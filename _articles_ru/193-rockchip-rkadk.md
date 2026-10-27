---
title: "Руководство по разработке приложений Rockchip RKADK"
description: "Руководство по разработке приложений Rockchip RKADK — V2.3.2"
excerpt: "Руководство по разработке приложений Rockchip RKADK"
translation_key: "193-rockchip-rkadk"
slug: "193-rockchip-rkadk"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RKADK, Linux]
---

{% raw %}

# Руководство по разработке приложений Rockchip RKADK

Основа - китайский и английский документы Rockchip RKADK V2.3.2. Сохранены 14 технических глав, API, определения типов и примеры. Для применения на ArmSoM проверьте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры взяты из источников. Команды и аппаратные испытания не выполнялись.

В китайской главе 3 обзор, API и типы имеют номера 3.1, 3.2, 3.3; в английской обзор идёт без номера, API и типы - 3.1, 3.2. Сохранена нумерация соответствующего источника. Китайский заголовок 3.3.6 - `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`, английский 3.2.6 - `RKADK_REC_MANUAL_SPLIT_ATTR_S`; проверьте тип по заголовочным файлам SDK. В английском объявлении `RKADK_RECORD_Single_Stop` слитно написано `RKADK_STREAM_TYPE_EenStrmType`; исходное написание сохранено, разделение типа и параметра требует проверки по SDK.

Оба источника датированы 2025-08-04. Определение структуры ручного разделения заканчивается именем `MUXER_MANUAL_SPLIT_ATTR_S`, а следующее перечисление типов - `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`, вопреки заголовку. Эти определения сохранены как в источнике и не являются проверенными компилируемыми заголовками SDK. `RKADK_MUXER_Disbale`, `librokadk.so`, `RGBA9888` и `RV1103/RV1103` в списке платформ проигрывателя также сохранены из источников; проверьте SDK. Между перенесёнными строками объявлений восстановлены пробелы без изменения параметров, указателей и идентификаторов.

| SoC | Linux |
| --- | --- |
| RV1126/RV1109 | 4.19 |
| RV1106/RV1103 | 5.10 |
| RV1103B | 5.10 |
| RK3576 | 6.10 |
| RV1126B | 6.10 |

## 1. Обзор системы

RKADK предоставляет базовые универсальные компоненты записи видео, фотосъёмки, воспроизведения и предварительного просмотра. Они упрощают и ускоряют разработку приложений записи аудио и видео. Компонент рассчитан только на один процесс; одновременная работа нескольких процессов не поддерживается, если не указано иное.

### 1.1 Версии

Версия 1.x.x: дополнительная обёртка над rkmedia и rockit, репозиторий master. Версия 2.x.x: дополнительная обёртка над rockit, репозиторий develop.

## 2. Запись

### 2.1 Обзор

Базовые функции записи видео: создание и уничтожение задач, запуск и остановка задач, ручное разделение файлов, интервальная запись, предварительная запись и запись «картинка в картинке» (PiP). Задачи получают сведения о видео и аудио из модуля параметров, запускают и останавливают VENC и AENC, а через модуль мультиплексирования создают файлы и записывают кадры. Каждой задаче соответствует один или несколько файлов. Для каждого файла требуется канал видеокодирования; при записи звука добавляется канал аудиокодирования. Файлы одной задачи имеют одинаковый тип записи и условия разделения, а при интервальной записи - одинаковый интервал. Длительность записи может задаваться отдельно.

Post AI ISP: RV1106/RV1126/RV1109 поддерживают подавление шума при слабом освещении и интеллектуальное улучшение выходных изображений VI через AI ISP. Это позволяет получать более чёткое изображение с меньшим шумом и без шлейфов даже при слабом освещении.

### 2.2 Справочник API

#### 2.2.1 RKADK_RECORD_Create

**Описание**

Создать задачу записи видео.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Create(RKADK_RECORD_ATTR_S *pstRecAttr, RKADK_MW_PTR *ppRecorder);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstRecAttr | Атрибуты задачи записи | Вход |
| ppRecorder | Указатель созданной задачи записи | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

Одна задача поддерживает одновременную запись не более двух файлов. Каждый файл содержит как минимум один видеопоток; максимум - один видеопоток и один аудиопоток. Повторное создание той же задачи не поддерживается. После создания для начала записи вызовите RKADK_RECORD_Start. Для PiP включите stPipAttr при RKADK_RECORD_Create, чтобы создать тракт «картинка в картинке».

**Пример**

rkadk_record_test.

**См. также**

RKADK_RECORD_Destroy.

#### 2.2.2 RKADK_RECORD_Destroy

**Описание**

Уничтожить задачи записи видео.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Destroy(RKADK_MW_PTR pRecorder);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

RKADK_RECORD_Destroy разрешён только после создания задачи. Уничтожать можно только созданные задачи; повторное уничтожение той же задачи не поддерживается.

**Пример**

rkadk_record_test.

**См. также**

RKADK_RECORD_Create

#### 2.2.3 RKADK_RECORD_Start

**Описание**

Запустить задачу записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Start(RKADK_MW_PTR pRecorder);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

RKADK_RECORD_Start разрешён только после создания задачи. Остановленную задачу можно запустить снова.

**Пример**

rkadk_record_test.

**См. также**

RKADK_RECORD_Stop

#### 2.2.4 RKADK_RECORD_Stop

**Описание**

Остановить задачу записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Stop(RKADK_MW_PTR pRecorder);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

RKADK_RECORD_Stop разрешён только после создания задачи. Повторная остановка той же задачи не поддерживается.

**Пример**

rkadk_record_test.

**См. также**

RKADK_RECORD_Start

#### 2.2.5 RKADK_RECORD_Single_Start

**Описание**

Запустить запись указанного потока.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Single_Start(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| enStrmType | Тип потока | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечания**

RKADK_RECORD_Single_Start разрешён только после создания задачи. Используется вместе с RKADK_RECORD_Single_Stop. После остановки запись можно запустить снова.

**Пример**

rkadk_record_test.

**Связанные темы**

RKADK_RECORD_Single_Stop.

#### 2.2.6 RKADK_RECORD_Single_Stop

**Описание**

Остановить запись указанного потока.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Single_Stop(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_EenStrmType);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| enStrmType | Тип потока | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечания**

RKADK_RECORD_Stop разрешён только после создания задачи. Используется вместе с RKADK_RECORD_Single_Start. Повторная остановка той же задачи не поддерживается.

**Пример**

rkadk_record_test.

**Связанные темы**

RKADK_RECORD_Single_Start

#### 2.2.7 RKADK_RECORD_Reset

**Описание**

Перенастроить задачу записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_Reset(RKADK_MW_PTR *ppRecorder);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| ppRecorder | Указатель задачи записи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

RKADK_RECORD_Reset разрешён только после создания задачи. При смене разрешения, частоты кадров, битрейта, типа кодирования или записи измените параметры Record в ini через RKADK_PARAM_SetCamParam. RV1126/RV1109 и RK3576 не поддерживают динамическую смену разрешения и типа кодирования.

Сначала вызовите RKADK_RECORD_Destroy, задайте новое разрешение или тип кодирования, затем снова вызовите RKADK_RECORD_Create. Если Record делит канал VI с другими модулями, переключайте разрешение всех этих модулей одновременно, чтобы разрешения VI и VENC совпадали.

**Пример**

rkadk_record_test.

**См. также**

Нет

#### 2.2.8 RKADK_RECORD_ManualSplit

**Описание**

Разделить видеофайлы вручную.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_ManualSplit(RKADK_MW_PTR pRecorder, RKADK_REC_MANUAL_SPLIT_ATTR_S *pstSplitAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| pstSplitAttr | Параметры ручного разделения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

RKADK_RECORD_ManualSplit разрешён только после создания задачи. Повторное ручное разделение допускается до завершения предыдущего разделения.

**Пример**

rkadk_record_test.

**См. также**

Нет

#### 2.2.9 RKADK_RECORD_GetAencChn

**Описание**

Получить ID канала AENC записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_GetAencChn();
```

**Возвращаемое значение**

ID канала AENC, используемого для записи.

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

#### 2.2.10 RKADK_GetThmInMp4

**Описание**

Получить миниатюру из MP4.

**Синтаксис**

```c
RKADK_S32 RKADK_GetThmInMp4(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_U8 *pu8Buf, RKADK_U32 *pu32Size);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pszFileName | Путь к MP4 | Вход |
| pu8Buf | Вход: указатель буфера миниатюры; выход: фактические данные миниатюры | Input/Output |
| pu32Size | Вход: длина pu8Buf; выход: фактическая длина данных миниатюры | Input/Output |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_thumb.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

Нет

#### 2.2.11 RKADK_GetThmInMp4Ex

**Описание**

Расширенный интерфейс извлечения миниатюры из MP4 позволяет задать тип и разрешение выходного изображения. Используйте вместе с RKADK_ThmBufFree.

**Синтаксис**

```c
RKADK_S32 RKADK_GetThmInMp4Ex(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pszFileName | Путь к MP4 | Вход |
| pstThumbAttr | Указатель структуры атрибутов миниатюры | Вход/выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_thumb.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

RKADK_ThmBufFree

#### 2.2.12 RKADK_ThmBufFree

**Описание**

Освободить память, выделенную RKADK_GetThmInMp4Ex. Используется вместе с RKADK_GetThmInMp4Ex.

**Синтаксис**

```c
RKADK_S32 RKADK_ThmBufFree(RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstThumbAttr | Указатель структуры атрибутов миниатюры | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_thumb.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

RKADK_GetThmInMp4Ex

#### 2.2.13 RKADK_RECORD_SetRotation

**Описание**

Задать поворот записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_SetRotation(RKADK_MW_PTR pRecorder, ROTATION_E enRotation, RKADK_STREAM_TYPE_E enStreamType);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| enRotation | Угол поворота | Вход |
| enStreamType | Тип потока | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Пример**

rkadk_record_test

#### 2.2.14 RKADK_RECORD_ToggleMirror

**Описание**

Задать зеркальное отражение записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_ToggleMirror(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType, bool mirror);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| enStreamType | Тип потока | Вход |
| mirror | Включение зеркального отражения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

#### 2.2.15 RKADK_RECORD_ToggleFlip

**Описание**

Задать переворот записи.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_ToggleFlip(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType, bool flip);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| enStreamType | Тип потока | Вход |
| flip | Включение переворота | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

#### 2.2.16 RKADK_RECORD_FileCacheInit

**Описание**

Инициализация File Cache сглаживает запись файлов. При включённом File Cache данные записываются на накопитель через DirectIO; механизм кэширования ядра не действует.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_FileCacheInit(FILE_CACHE_ARG *pstFileCacheAttr)
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstFileCacheAttr | Указатель атрибутов File Cache | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

По умолчанию File Cache выключен. Для включения задайте переменную окружения file_cache_env.

```text
export file_cache_env=1
```

При включённом File Cache вызовите этот интерфейс один раз до RKADK_RECORD_Create; иначе вызов не нужен. Для File Cache требуется дополнительная память объёмом u32TotalCache. Используйте в паре с RKADK_RECORD_FileCacheDeInit.

**Пример**

rkadk_record_test

#### 2.2.17 RKADK_RECORD_FileCacheDeInit

**Описание**

Деинициализация File Cache

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_FileCacheDeInit();
```

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечание**

Используйте вместе с RKADK_RECORD_FileCacheInit. При включённом File Cache вызывайте после RKADK_RECORD_Destroy; иначе вызов не нужен. rkadk_record_test.

#### 2.2.18 RKADK_RECORD_FileCacheSetMode

**Описание**

Задать тип записи для File Cache.

**Синтаксис**

```c
void RKADK_RECORD_FileCacheSetMode(RKADK_REC_TYPE_E enRecType);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| enRecType | Тип записи | Вход |

**Требования**

Заголовочный файл: rkadk_record.h. Библиотека: librkadk.so.

**Примечания**

Если File Cache включён, при смене типа записи задайте новый тип File Cache через этот API. rkadk_aov_record_test.

#### 2.2.19 RKADK_MEDIA_EnablePostIsp

**Описание**

Включить Post AI ISP. Помимо этого интерфейса, функцию можно включить параметром post_aiisp в ini-файле сенсора.

**Синтаксис**

```c
RKADK_S32 RKADK_MEDIA_EnablePostIsp(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_POST_ISP_ATTR_S *pstPostIspAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип потока | Вход |
| pstPostIspAttr | Указатель атрибутов Post AI ISP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_media_comm.h. Библиотека: librkadk.so.

#### 2.2.20 RKADK_MEDIA_SetPostIspAttr

**Описание**

Динамически задать атрибуты Post AI ISP.

**Синтаксис**

```c
RKADK_S32 RKADK_MEDIA_SetPostIspAttr(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool bEnable, RKADK_POST_ISP_ATTR_S *pstPostIspAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип потока | Вход |
| bEnable | Переключатель Post AI ISP, динамический атрибут | Вход |
| pstPostIspAttr | Указатель атрибутов Post AI ISP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_media_comm.h. Библиотека: librkadk.so.

#### 2.2.21 RKADK_RECORD_SetPipAttr

**Описание**

Динамически задать атрибуты PiP.

**Синтаксис**

```c
RKADK_S32 RKADK_RECORD_SetPipAttr(RKADK_MW_PTR pRecorder, RKADK_PIP_ATTR_S *pstPipAttr);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pRecorder | Указатель задачи записи | Вход |
| pstPipAttr | Атрибуты «картинки в картинке» | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_record.h.

Библиотека: librkadk.so. Примечание: для PiP включите stPipAttr при RKADK_RECORD_Create, чтобы создать соответствующий тракт.

### 2.3 Типы данных

Основные типы модуля записи: RKADK_MW_PTR - указатель задачи; RECORD_FILE_NUM_MAX - максимальное число одновременно записываемых файлов одной задачи; RKADK_REC_EVENT_CALLBACK_FN - обратный вызов событий; RKADK_REC_TYPE_E - типы записи; RKADK_REC_REQUEST_FILE_NAMES_FN - функция запроса имён файлов; RKADK_REC_PTS_CALLBACK_FN - обратный вызов временной метки видеокадра; RKADK_RECORD_ATTR_S - атрибуты задачи; RKADK_REC_MANUAL_SPLIT_ATTR_S - ручное разделение; FILE_CACHE_ARG - атрибуты File Cache; RKADK_POST_ISP_ATTR_S - атрибуты Post AI ISP; RKADK_MOUNT_SDCARD_FN - функция монтирования SD; RKADK_AOV_ATTR_S - атрибуты AOV; RKADK_PIP_ATTR_S - атрибуты PiP.

#### 2.3.1 Общие типы данных

**Описание**

Определение базовых типов данных.

**Определение**

```text
typedef unsigned char RKADK_U8;
typedef unsigned short RKADK_U16;
typedef unsigned int RKADK_U32;

typedef signed char RKADK_S8;
typedef short RKADK_S16;
typedef int RKADK_S32;

typedef unsigned long RKADK_UL;
typedef signed long RKADK_SL;
typedef float RKADK_FLOAT;
typedef double RKADK_DOUBLE;

#ifndef _M_IX86
typedef unsigned long long RKADK_U64;
typedef long long RKADK_S64;
#else
typedef unsigned __int64 RKADK_U64;
typedef __int64 RKADK_S64;
#endif

typedef char RKADK_CHAR;
#define RKADK_VOID void

typedef unsigned int RKADK_HANDLE;

typedef RKADK_VOID *RKADK_MW_PTR;

typedef char (*ARRAY_FILE_NAME)[RKADK_MAX_FILE_PATH_LEN];

typedef enum {
  RKADK_FALSE = 0,
  RKADK_TRUE = 1,
} RKADK_BOOL;

#ifndef NULL
#define NULL 0L
#endif

#define RKADK_NULL 0L
#define RKADK_SUCCESS 0
#define RKADK_FAILURE (-1)
```

#### 2.3.2 RKADK_MW_PTR

**Описание**

Определение указателя задачи

**Определение**

```text
typedef RKADK_VOID *RKADK_MW_PTR;
```

#### 2.3.3 RKADK_MAX_SENSOR_CNT

**Описание**

Максимальное поддерживаемое число сенсоров; можно изменить согласно конкретной конфигурации

**Определение**

```text
#define RKADK_MAX_SENSOR_CNT 8
```

#### 2.3.4 RECORD_FILE_NUM_MAX

**Описание**

Максимальное число файлов, одновременно записываемых одной задачей.

**Определение**

```text
#define RECORD_FILE_NUM_MAX 2
```

#### 2.3.5 RKADK_REC_EVENT_CALLBACK_FN

**Описание**

Указатель обратного вызова событий записи.

**Определение**

```text
typedef RKADK_MUXER_EVENT_CALLBACK_FN RKADK_REC_EVENT_CALLBACK_FN;
```

**Связанные типы данных и интерфейсы**

RKADK_MUXER_EVENT_CALLBACK_FN

#### 2.3.6 RKADK_REC_TYPE_E

**Описание**

Перечисление типов записи.

**Определение**

```text
typedef RKADK_MUXER_REC_TYPE_E RKADK_REC_TYPE_E;
```

**Связанные типы данных и интерфейсы**

RKADK_MUXER_REC_TYPE_E

#### 2.3.7 RKADK_REC_REQUEST_FILE_NAMES_FN

**Описание**

Указатель функции запроса имени видеофайла.

**Определение**

```text
typedef RKADK_S32 (*RKADK_REC_REQUEST_FILE_NAMES_FN)(RKADK_MW_PTR pRecorder, RKADK_U32
u32FileCnt, RKADK_CHAR(*paszFilename)[RKADK_MAX_FILE_PATH_LEN]);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pRecorder | Указатель задачи записи |
| u32FileCnt | Число запрашиваемых имён файлов |
| paszFilename | Буфер для имён файлов |

**Связанные типы данных и интерфейсы**

RKADK_MW_PTR RKADK_RECORD_ATTR_S

#### 2.3.8 RKADK_REC_PTS_CALLBACK_FN

**Описание**

Указатель обратного вызова временной метки видеокадра.

**Определение**

```text
typedef RKADK_MUXER_PTS_CALLBACK_FN RKADK_REC_PTS_CALLBACK_FN;
```

**Связанные типы данных и интерфейсы**

RKADK_MUXER_PTS_CALLBACK_FN RKADK_RECORD_ATTR_S

#### 2.3.9 RKADK_MOUNT_SDCARD_FN

**Описание**

Указатель функции монтирования SD-карты.

**Определение**

```text
typedef int (*RKADK_MOUNT_SDCARD_FN)(void);
```

**Связанные типы данных и интерфейсы**

RKADK_RECORD_ATTR_S

#### 2.3.10 RKADK_RECORD_ATTR_S

**Описание**

Структура атрибутов задачи записи.

**Определение**

```text
typedef struct {
  RKADK_S32 s32CamID;                                  /* Camera ID */
  RKADK_U32 u32FragKeyFrame;
  RKADK_REC_REQUEST_FILE_NAMES_FN pfnRequestFileNames; /* rec callbak */
  RKADK_REC_EVENT_CALLBACK_FN pfnEventCallback;        /* event callbak */
  RKADK_AOV_ATTR_S stAovAttr;
  RKADK_POST_ISP_ATTR_S *pstPostIspAttr;
  RKADK_MOUMNT_SDCARD_FN pfnMountSdcard;
  RKADK_PIP_ATTR_S stPipAttr[RECORD_FILE_NUM_MAX];
  RKADK_U32 u32GetThumbTime[RECORD_FILE_NUM_MAX];      /* get thumbnail delay time(ms) when
enbale file cache, default: 3000(ms) */
  RKADK_THIRD_MUXER_ATTR_S *pstThirdMuxerAttr;         /* third party muxer attr */
} RKADK_RECORD_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32CamID | ID камеры |
| u32FragKeyFrame | Разделять ли видеофайл по I-кадрам |
| pfnRequestFileNames | Указатель функции запроса имени файла |
| pfnEventCallback | Указатель обратного вызова событий записи |
| stAovAttr | Атрибуты AOV (Always On Video) |
| pstPostIspAttr | Атрибуты Post AI ISP |
| pfnMountSdcard | Указатель функции монтирования SD-карты |
| stPipAttr | Атрибуты «картинки в картинке» |
| u32GetThumbTime | Задержка получения миниатюры при включённом File Cache, мс |
| pstThirdMuxerAttr | Указатель атрибутов стороннего Muxer |

**Связанные типы данных и интерфейсы**

RKADK_REC_EVENT_CALLBACK_FN RKADK_REC_REQUEST_FILE_NAMES_FN RKADK_MOUMNT_SDCARD_FN RKADK_AOV_ATTR_S RKADK_POST_ISP_ATTR_S RKADK_PIP_ATTR_S RKADK_THIRD_MUXER_ATTR_S RKADK_RECORD_Create

#### 2.3.11 RKADK_REC_MANUAL_SPLIT_ATTR_S

**Описание**

Структура атрибутов ручного разделения.

**Определение**

```text
typedef MUXER_MANUAL_SPLIT_ATTR_S RKADK_REC_MANUAL_SPLIT_ATTR_S;
```

**Связанные типы данных и интерфейсы**

MUXER_MANUAL_SPLIT_ATTR_S RKADK_RECORD_ManualSplit

#### 2.3.12 FILE_CACHE_ARG

**Описание**

Структура атрибутов File Cache.

**Определение**

```text
typedef struct _FILE_CACHE_ARG {
  const char *sdcard_path;
  int write_cache;  /* write cache size(byte), default 1M */
  int total_cache;  /* total cache size(byte), default 10M */
  FILE_WRITE_THREAD_ARG write_thread_arg;
  FILE_SDCARD_ARG sdcard_arg;
} FILE_CACHE_ARG;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| sdcard_path | Путь монтирования SD-карты |
| write_cache | Размер кэша для каждого записываемого файла |
| total_cache | Общий размер кэша |
| write_thread_arg | Атрибуты потока записи |
| sdcard_arg | Атрибуты SD-карты |

**Связанные типы данных и интерфейсы**

RKADK_RECORD_FileCacheInit FILE_WRITE_THREAD_ARG FILE_SDCARD_ARG

#### 2.3.13 FILE_WRITE_THREAD_ARG

**Описание**

Структура атрибутов потока записи.

**Определение**

```text
typedef enum _FILE_SCHED_POLICY {
  FILE_SCHED_OTHER = 0,
  FILE_SCHED_BATCH,
  FILE_SCHED_IDLE,
  FILE_SCHED_FIFO,      /* sched_priority[1, 99] */
  FILE_SCHED_RR,        /* sched_priority[1, 99] */
} FILE_SCHED_POLICY;

typedef struct _FILE_WRITE_THREAD_ARG {
  FILE_SCHED_POLICY sched_policy;
  int priority; /* SCHED_OTHER/SCHED_IDLE/SCHED_BATCH inoperative */
} FILE_WRITE_THREAD_ARG;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| sched_policy | Политика планирования потока |
| priority | Приоритет потока |

**Связанные типы данных и интерфейсы**

RKADK_RECORD_FileCacheInit

FILE_CACHE_ARG

#### 2.3.14 FILE_SDCARD_ARG

**Описание**

Структура атрибутов SD-карты.

**Определение**

```text
typedef struct _FILE_SDCARD_ARG {
    FILE_CACHE_SDCARD_LOCK lock;
    FILE_CACHE_SDCARD_UNLOCK unlock;
    FILE_CACHE_MOUMNT_SDCARD mount_sdcard;
    FILE_CACHE_UMOUMNT_SDCARD umount_sdcard;
} FILE_SDCARD_ARG;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| lock | Функция блокировки операций SD-карты |
| unlock | Функция снятия блокировки операций SD-карты |
| mount_sdcard | Функция монтирования SD-карты |
| umount_sdcard | Функция размонтирования SD-карты |

**Связанные типы данных и интерфейсы**

FILE_CACHE_ARG

#### 2.3.15 RKADK_POST_ISP_ATTR_S

**Описание**

Структура атрибутов Post AI ISP.

**Определение**

```text
typedef struct {
  AIISP_CALLBACK_FUNC_S stAiIspCallback;      /* post isp callback function */
  const RK_CHAR        *pModelFilePath;       /* post isp model file path   */
  RK_U32                u32FrameBufCnt;       /* RW; frame buffer cnt    */
} RKADK_POST_ISP_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| stAiIspCallback | Обратный вызов обновления параметров AI NR |
| pModelFilePath | Путь к файлу модели Post AI ISP |
| u32FrameBufCnt | Число кадровых буферов, по умолчанию 1 |

**Связанные типы данных и интерфейсы**

RKADK_MEDIA_EnablePostIsp RKADK_MEDIA_SetPostIspAttr

#### 2.3.16 RKADK_AOV_ATTR_S

**Описание**

Структура атрибутов AOV.

**Определение**

```text
typedef struct {
  RKADK_ISP_WAKE_UP_PAUSE_FN pfnSingleFrame;
  RKADK_ISP_WAKE_UP_RESUME_FN pfnMultiFrame;
} RKADK_AOV_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pfnSingleFrame | Указатель функции однокадрового режима |
| pfnMultiFrame | Указатель функции многокадрового режима |

**Связанные типы данных и интерфейсы**

RKADK_RECORD_Create

#### 2.3.17 RKADK_PIP_ATTR_S

**Описание**

Структура атрибутов «картинки в картинке».

**Определение**

```text
typedef struct {
  RKADK_BOOL bEnablePip;                      /* enable picture-in-picture */
  RKADK_U32 u32AvsGrpId;                      /* AVS group id [0, AVS_MAX_GRP_NUM)] */
  RKADK_U32 u32AvsBufCnt;                     /* default 2, min value 2 */
  RKADK_U32 u32SubCamId;                      /* subwindow camera id */
  RKADK_STREAM_TYPE_E enSubStreamType;        /* subwindow stream type */
  RKADK_RECT_S stSubRect;                     /* The subwindow is based on the display area
of the main window */
} RKADK_PIP_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bEnablePip | Включить «картинку в картинке» |
| u32AvsGrpId | ID группы AVS для PiP |
| u32AvsBufCnt | Максимальное число буферов целевого изображения AVS |
| u32SubCamId | ID камеры вложенного окна |
| enSubStreamType | Тип потока вложенного окна |
| stSubRect | Область вложенного окна внутри основного окна |

**Связанные типы данных и интерфейсы**

RKADK_RECORD_Create RKADK_RECORD_SetPipAttr

## 3. Мультиплексор

Модуль предоставляет создание и уничтожение, запуск и остановку мультиплексоров, ручное разделение файлов. Каждый мультиплексор одновременно упаковывает до двух файлов. В файле должен быть как минимум один видеопоток; максимум - один видеопоток и один аудиопоток. Можно создавать несколько мультиплексоров одновременно. Поддерживается упаковка сторонних потоков.

### 3.1 Справочник API

#### 3.1.1 RKADK_MUXER_Create

**Описание**

Создать мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Create(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Атрибуты мультиплексора | Вход |
| ppHandle | Указатель созданного мультиплексора | Выход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Повторное создание того же мультиплексора не поддерживается. После создания включите его через RKADK_MUXER_Enable, затем запустите через RKADK_MUXER_Start.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Destroy.

#### 3.1.2 RKADK_MUXER_Destroy

**Описание**

Уничтожить мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Destroy(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Уничтожать можно только созданный мультиплексор; повторное уничтожение не поддерживается. Перед уничтожением остановите его через RKADK_MUXER_Stop, затем отключите через RKADK_MUXER_Disable.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Create

#### 3.1.3 RKADK_MUXER_Enable

**Описание**

Включить мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Enable(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Атрибуты мультиплексора | Вход |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Используйте вместе с RKADK_MUXER_Disable.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Disable.

#### 3.1.4 RKADK_MUXER_Disable

**Описание**

Отключить мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Disable(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Используйте вместе с RKADK_MUXER_Enable.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Enable

#### 3.1.5 RKADK_MUXER_Start

**Описание**

Инициализировать мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Start(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

После остановки мультиплексор можно запустить снова.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Stop

#### 3.1.6 RKADK_MUXER_Stop

**Описание**

Остановить мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Stop(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Повторная остановка того же мультиплексора не поддерживается.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Start

#### 3.1.7 RKADK_MUXER_Single_Start

**Описание**

Запустить мультиплексор указанного потока.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Single_Start(RKADK_MW_PTR pHandle, int s32MuxerId, int s32VencChn);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |
| s32MuxerId | ID мультиплексора | Вход |
| s32VencChn | Канал VENC; для мультиплексирования стороннего потока s32VencChn должен быть -1 | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Используйте вместе с RKADK_MUXER_Single_Stop. После остановки мультиплексор можно запустить снова.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Single_Stop

#### 3.1.8 RKADK_MUXER_Single_Stop

**Описание**

Остановить мультиплексор указанного потока.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Single_Stop(RKADK_MW_PTR pHandle, int s32MuxerId, int s32VencChn);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |
| s32MuxerId | ID мультиплексора | Вход |
| s32VencChn | Канал VENC; при упаковке стороннего потока s32VencChn должен быть -1 | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Используйте вместе с RKADK_MUXER_Single_Start. Повторная остановка того же мультиплексора не поддерживается.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Single_Start

#### 3.1.9 RKADK_MUXER_ManualSplit

**Описание**

Разделить файлы вручную.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_ManualSplit(RKADK_MW_PTR pHandle, RKADK_MUXER_MANUAL_SPLIT_ATTR_S *pstSplitAttr);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pRecorder | Указатель мультиплексора | Вход |
| pstSplitAttr | Параметры ручного разделения | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Допускается повторное ручное разделение до завершения предыдущего разделения.

**Пример**

rkadk_muxer_test

#### 3.1.10 RKADK_MUXER_Reset

**Описание**

Сбросить мультиплексор.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_Reset(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librokadk.so.

**Примечания**

До RKADK_MUXER_Reset вызовите RKADK_MUXER_SetResetState для перехода в состояние сброса. После RKADK_MUXER_Reset вызовите RKADK_MUXER_ResetParam для перенастройки параметров, затем снова RKADK_MUXER_SetResetState для выхода из состояния сброса.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_ResetParam RKADK_MUXER_SetResetState

#### 3.1.11 RKADK_MUXER_ResetParam

**Описание**

Перенастроить параметры мультиплексора.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_ResetParam(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Атрибуты мультиплексора | Вход |
| pHandle | Указатель мультиплексора | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Reset RKADK_MUXER_SetResetState

#### 3.1.12 RKADK_MUXER_SetResetState

**Описание**

Задать состояние сброса мультиплексора.

**Синтаксис**

```c
void RKADK_MUXER_SetResetState(RKADK_MW_PTR pHandle, bool state);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель мультиплексора | Вход |
| state | Состояние сброса: True до сброса, False после | Вход |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Пример**

rkadk_muxer_test.

**Связанные темы**

RKADK_MUXER_Reset RKADK_MUXER_ResetParam

#### 3.1.13 RKADK_MUXER_BuildInThumb

**Описание**

Встроить миниатюры в файлы.

**Синтаксис**

```c
RKADK_S32 RKADK_MUXER_BuildInThumb(RKADK_MW_PTR pHandle, RKADK_MUXER_THUMB_INFO_S stThumbInfo);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель кодировщика | Вход |
| stThumbInfo | Информация о миниатюре | Вход |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Примечания**

Для встраивания миниатюр задайте их разрешение при RKADK_MUXER_Create, чтобы зарезервировать место хранения. Встроенные миниатюры поддерживаются только в MP4.

**Пример**

rkadk_muxer_test.

#### 3.1.14 RKADK_MUXER_WriteVideoFrame

**Описание**

Записать данные видеопотока.

**Синтаксис**

```c
int RKADK_MUXER_WriteVideoFrame(RKADK_MUXER_DATA_S stData, void *handle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| handle | Указатель мультиплексора | Вход |
| stData | Данные видеопотока | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Пример**

rkadk_muxer_test.

#### 3.1.15 RKADK_MUXER_WriteAudioFrame

**Описание**

Записать данные аудиопотока.

**Синтаксис**

```c
int RKADK_MUXER_WriteAudioFrame(RKADK_MUXER_DATA_S stData, void *handle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| handle | Указатель мультиплексора | Вход |
| stData | Данные аудиопотока | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_muxer.h. Библиотека: librkadk.so.

**Пример**

rkadk_muxer_test.

### 3.2 Типы данных

Основные типы модуля Muxer: RKADK_MUXER_FILE_TYPE_E - типы файлов; RKADK_MUXER_EVENT_E - события; RKADK_MUXER_FILE_EVENT_INFO_S - информация о файловом событии; RKADK_MUXER_EVENT_INFO_S - информация о событии мультиплексора; RKADK_MUXER_EVENT_CALLBACK_FN - обратный вызов событий; RKADK_MUXER_MANUAL_SPLIT_ATTR_S - атрибуты ручного разделения; RKADK_MUXER_MANUAL_SPLIT_TYPE_E - типы ручного разделения; RKADK_MUXER_ATTR_S - атрибуты мультиплексора; RKADK_MUXER_REC_TYPE_E - типы записи; RKADK_MUXER_TYPE_E - типы мультиплексоров; RKADK_MUXER_REQUEST_FILE_NAME_CB - запрос имени файла; RKADK_MUXER_STREAM_ATTR_S - атрибуты потока; RKADK_MUXER_PRE_RECORD_ATTR_S - атрибуты предварительной записи; RKADK_MUXER_PRE_RECORD_MODE_E - режимы предварительной записи; RKADK_MUXER_PTS_CALLBACK_FN - обратный вызов временной метки; RKADK_MUXER_PTS_INFO_S - информация о временной метке; RKADK_MUXER_DATA_S - данные упаковки; RKADK_MUXER_THUMB_INFO_S - информация о миниатюре; RKADK_THIRD_MUXER_ATTR_S - атрибуты стороннего мультиплексора.

#### 3.2.1 RKADK_MUXER_FILE_TYPE_E

**Описание**

Перечисление типов файлов мультиплексора.

**Определение**

```text
typedef enum rkMUXER_TYPE_E {
  RKADK_MUXER_TYPE_MP4 = 0,
  RKADK_MUXER_TYPE_MPEGTS,
  RKADK_MUXER_TYPE_FLV,
  RKADK_MUXER_TYPE_BUTT
} RKADK_MUXER_FILE_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_MUXER_TYPE_MP4 | MP4 |
| RKADK_MUXER_TYPE_MPEGTS | TS |
| RKADK_MUXER_TYPE_FLV | FLV |

**Примечания**

Встроенные миниатюры поддерживаются только в MP4.

#### 3.2.2 RKADK_MUXER_EVENT_E

**Описание**

Перечисление событий мультиплексора.

**Определение**

```text
typedef enum rkMUXER_EVENT_E {
  RKADK_MUXER_EVENT_STREAM_START = 0,
  RKADK_MUXER_EVENT_STREAM_STOP,
  RKADK_MUXER_EVENT_FILE_BEGIN,
  RKADK_MUXER_EVENT_FILE_END,
  RKADK_MUXER_EVENT_MANUAL_SPLIT_END,
  RKADK_MUXER_EVENT_ERR_CREATE_FILE_FAIL,
  RKADK_MUXER_EVENT_ERR_WRITE_FILE_FAIL,
  RKADK_MUXER_EVENT_FILE_WRITING_SLOW,
  RKADK_MUXER_EVENT_ERR_CARD_NONEXIST,
  RKADK_MUXER_EVENT_BUTT
} RKADK_MUXER_EVENT_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_MUXER_EVENT_STREAM_START | Начало записи |
| RKADK_MUXER_EVENT_STREAM_STOP | Остановка записи |
| RKADK_MUXER_EVENT_FILE_BEGIN | Начало записи нового файла |
| RKADK_MUXER_EVENT_FILE_END | Окончание записи файла |
| RKADK_MUXER_EVENT_MANUAL_SPLIT_END | Окончание записи файла при ручном разделении |
| RKADK_MUXER_EVENT_ERR_GET_FILENAME | Не удалось получить имя файла |
| RKADK_MUXER_EVENT_ERR_CREATE_FILE_FAIL | Зарезервировано |
| RKADK_MUXER_EVENT_ERR_WRITE_FILE_FAIL | Ошибка записи файла |
| RKADK_MUXER_EVENT_FILE_WRITING_SLOW | Медленная запись файлов |
| RKADK_MUXER_EVENT_ERR_CARD_NONEXIST | SD-карта отсутствует |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.3 RKADK_MUXER_FILE_EVENT_INFO_S

**Описание**

Структура информации о файловом событии.

**Определение**

```text
typedef struct {
  RK_CHAR asFileName[RKADK_MUXER_FILE_NAME_LEN];
  RK_U32 u32Duration; // ms
} RKADK_MUXER_FILE_EVENT_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| asFileName | Имя файла |
| u32Duration | Фактическая длительность записанного файла |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.4 RKADK_MUXER_EVENT_INFO_S

**Описание**

Структура информации о событии мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_MUXER_EVENT_E enEvent;
  union {
    RKADK_MUXER_FILE_EVENT_INFO_S stFileInfo;
    RKADK_MUXER_ERROR_EVENT_INFO_S stErrorInfo;
  } unEventInfo;
} RKADK_MUXER_EVENT_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enEvent | Тип события записи |
| stFileInfo | Информация о файловом событии |
| stErrorInfo | Информация об ошибке (зарезервировано) |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_EVENT_E RKADK_MUXER_FILE_EVENT_INFO_S

#### 3.2.5 RKADK_MUXER_EVENT_CALLBACK_FN

**Описание**

Указатель обратного вызова событий мультиплексора.

**Определение**

```text
typedef RKADK_VOID (*RKADK_MUXER_EVENT_CALLBACK_FN)(RKADK_MW_PTR pRecorder, const
RKADK_MUXER_EVENT_INFO_S *pstEventInfo);
```

**Связанные типы данных и интерфейсы**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.6 RKADK_REC_MANUAL_SPLIT_ATTR_S

**Описание**

Структура атрибутов ручного разделения.

**Определение**

```text
typedef struct {
  RKADK_MUXER_MANUAL_SPLIT_TYPE_E enManualType;               /* maual split type */
  RKADK_U32 u32DurationSec; /* file duration of manual split file */
} MUXER_MANUAL_SPLIT_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enManualType | Тип ручного разделения |
| u32DurationSec | Длительность видеофайла при ручном разделении |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_MANUAL_SPLIT_TYPE_E RKADK_MUXER_ManualSplit

#### 3.2.7 RKADK_MUXER_MANUAL_SPLIT_TYPE_E

**Описание**

Тип ручного разделения.

**Определение**

```text
typedef enum {
  MUXER_PRE_MANUAL_SPLIT,      /* pre manual split type */
  MUXER_NORMAL_MANUAL_SPLIT,   /* normal manual split type */
} RKADK_MUXER_MANUAL_SPLIT_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| MUXER_PRE_MANUAL_SPLIT | Ручное разделение видеофайлов с предварительной записью |
| MUXER_NORMAL_MANUAL_SPLIT | Ручное разделение видеофайлов |

**Связанные типы данных и интерфейсы**

RKADK_REC_MANUAL_SPLIT_ATTR_S

#### 3.2.8 RKADK_THIRD_MUXER_ATTR_S

**Описание**

Структура атрибутов стороннего мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_THIRD_MUXER_INIT_FN pfnMuxerInit;
  RKADK_THIRD_MUXER_DEINIT_FN pfnMuxerDeinit;
  RKADK_THIRD_MUXER_WRITE_VIDEO_FN pfnWriteVideo;
  RKADK_THIRD_MUXER_WRITE_AUDIO_FN pfnWriteAudio;
  RKADK_THIRD_MUXER_GET_THUMB_POS_FN pfnGetThumbPos;
} RKADK_THIRD_MUXER_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pfnMuxerInit | Указатель функции инициализации стороннего мультиплексора |
| pfnMuxerDeinit | Указатель функции деинициализации стороннего мультиплексора |
| pfnWriteVideo | Указатель функции записи видеокадра стороннего мультиплексора |
| pfnWriteAudio | Указатель функции записи аудиокадра стороннего мультиплексора |
| pfnGetThumbPos | Указатель получения позиции записи миниатюры стороннего мультиплексора |

**Примечания**

При включении стороннего мультиплексора RKADK_GetthmInMp4 и RKADK_GetthmInMp4Ex не поддерживают получение миниатюр видео.

**Связанные типы данных и интерфейсы**

RKADK_MUXER_ATTR_S

#### 3.2.9 RKADK_MUXER_ATTR_S

**Описание**

Структура атрибутов мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_MUXER_REC_TYPE_E enRecType;
  RKADK_MUXER_TYPE_E enMuxerType;
  RKADK_U32 u32StreamCnt; /* stream cnt */
  RKADK_U32 u32FragKeyFrame;
  RKADK_MUXER_STREAM_ATTR_S
  astStreamAttr[RKADK_MUXER_STREAM_MAX_CNT]; /* array of stream attr */
  RKADK_MUXER_PRE_RECORD_ATTR_S stPreRecordAttr;
  RKADK_MUXER_REQUEST_FILE_NAME_CB pcbRequestFileNames;
  RKADK_MUXER_EVENT_CALLBACK_FN pfnEventCallback;
  RKADK_MUXER_PTS_CALLBACK_FN pfnPtsCallback;
  RKADK_AOV_ATTR_S stAovAttr;
  RKADK_MOUMNT_SDCARD_FN pfnMountSdcard;
  bool bEnableAiisp;
  RKADK_THIRD_MUXER_ATTR_S *pstThirdMuxerAttr;         /* third party muxer attr */
} RKADK_MUXER_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | Идентификатор камеры |
| enRecType | Тип записи; сторонний поток не поддерживает интервальную запись AOV |
| enMuxerType | Тип мультиплексора |
| u32StreamCnt | Число потоков мультиплексора |
| u32FragKeyFrame | Разделять ли файл по I-кадрам |
| astStreamAttr | Атрибуты потока мультиплексора |
| stPreRecordAttr | Атрибуты предварительной записи |
| pcbRequestFileNames | Указатель функции запроса имён файлов |
| pfnEventCallback | Указатель обратного вызова событий |
| pfnPtsCallback | Указатель обратного вызова временной метки текущего видеокадра |
| stAovAttr | Атрибуты AOV (Always On Video); сторонний поток не поддерживается |
| pfnMountSdcard | Указатель функции монтирования SD-карты; обязателен для интервального режима AOV |
| bEnableAiisp | Включить Aiisp |
| pstThirdMuxerAttr | Указатель атрибутов стороннего Muxer |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_REC_TYPE_E RKADK_MUXER_TYPE_E RKADK_MUXER_STREAM_ATTR_S RKADK_MUXER_PRE_RECORD_ATTR_S RKADK_MUXER_REQUEST_FILE_NAME_CB

RKADK_MUXER_EVENT_CALLBACK_FN RKADK_MUXER_PTS_CALLBACK_FN RKADK_AOV_ATTR_S RKADK_MOUMNT_SDCARD_FN RKADK_THIRD_MUXER_ATTR_S RKADK_MUXER_Create RKADK_MUXER_ResetParam

#### 3.2.10 RKADK_MUXER_REC_TYPE_E

**Описание**

Перечисление типов записи мультиплексора.

**Определение**

```text
typedef enum {
  RKADK_REC_TYPE_NORMAL = 0, /* normal record */
  RKADK_REC_TYPE_LAPSE,      /* time lapse record */
  RKADK_REC_TYPE_AOV_LAPSE,  /* low power time lapse record */
  RKADK_REC_TYPE_BUTT
} RKADK_MUXER_REC_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_REC_TYPE_NORMAL | Обычная запись |
| RKADK_REC_TYPE_LAPSE | Интервальное видео |
| RKADK_REC_TYPE_AOV_LAPSE | Интервальная запись с низким энергопотреблением |

**Связанные типы данных и интерфейсы**

Нет. Примечание: интервальную запись AOV поддерживают только RV1126, RV1106 и RV1126B.

#### 3.2.11 RKADK_MUXER_TYPE_E

**Описание**

Перечисление типов мультиплексоров.

**Определение**

```text
typedef enum {
  RKADK_MUXER_TYPE_RECORD = 0,
  RKADK_MUXER_TYPE_THIRD_STREAM,
} RKADK_MUXER_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_MUXER_TYPE_RECORD | Мультиплексор локальной записи |
| RKADK_MUXER_TYPE_THIRD_STREAM | Мультиплексор стороннего потока |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_ATTR_S

#### 3.2.12 RKADK_MUXER_REQUEST_FILE_NAME_CB

**Описание**

Указатель обратного вызова запроса имён файлов.

**Определение**

```text
typedef int (*RKADK_MUXER_REQUEST_FILE_NAME_CB)(void *pHandle, char *pcFileName, unsigned
int u32MuxerId);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pHandle | Указатель кодировщика |
| pcFileName | Указатель имени файла |
| u32MuxerId | ID мультиплексора |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_ATTR_S

#### 3.2.13 RKADK_MUXER_PTS_CALLBACK_FN

**Описание**

Указатель обратного вызова временной метки видеокадра.

**Определение**

```text
typedef RKADK_VOID (*RKADK_MUXER_PTS_CALLBACK_FN)(const RKADK_MUXER_PTS_INFO_S *pstPtsInfo);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pstPtsInfo | Указатель информации о временной метке видеокадра |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_PTS_INFO_S RKADK_MUXER_ATTR_S

#### 3.2.14 RKADK_MUXER_PTS_INFO_S

**Описание**

Структура информации о временной метке.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_S32 s32MuxerId;
  RKADK_U32 u32ChnId;
  RKADK_U64 u64PTS;
  RKADK_U32 u32Seq;
  const char *pFileName;
} RKADK_MUXER_PTS_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | ID камеры |
| s32MuxerId | ID мультиплексора |
| u32ChnId | Канал VENC |
| u64PTS | Временная метка кадра |
| u32Seq | Порядковый номер кадра |
| pFileName | Имя файла |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_PTS_CALLBACK_FN

#### 3.2.15 RKADK_MUXER_STREAM_ATTR_S

**Описание**

Структура атрибутов потока мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  /* If it is a third-party stream that is not Rockit(such as a network stream),
    * s32ViChn/s32VencChn must set to -1.
  */
  RKADK_S32 s32ViChn;
  RKADK_S32 s32VencChn;
  RKADK_S32 s32ThumbVencChn;
  bool bUseVpss;
  RKADK_U32 u32TimeLenSec; /* record time */
  RKADK_PIP_ATTR_S stPipAttr;
  RKADK_U32 u32GetThumbTime;
  RKADK_U32 u32TrackCnt;   /* track cnt*/
  RKADK_MUXER_TRACK_SOURCE_S
  aHTrackSrcHandle[RKADK_MUXER_TRACK_MAX_CNT]; /* array of track source cnt */
  RKADK_MUXER_FILE_TYPE_E enType;
} RKADK_MUXER_STREAM_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32MuxerId | ID мультиплексора |
| s32ViChn | Канал VI; для сторонних потоков задайте -1 |
| s32VencChn | Канал VENC; для сторонних потоков задайте -1 |
| s32ThumbVencChn | Канал VENC миниатюр; для сторонних потоков задайте -1 |
| bUseVpss | Использование VPSS; для сторонних потоков задайте False |
| u32TimeLenSec | Имя файла |
| stPipAttr | Атрибуты PiP; для сторонних потоков не действуют |
| u32GetThumbTime | Время встраивания миниатюры, по умолчанию 3000 мс |
| u32TrackCnt | Число потоков |
| aHTrackSrcHandle | Атрибуты потока |
| enType | Тип файла |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_TRACK_SOURCE_S RKADK_MUXER_FILE_TYPE_E

#### 3.2.16 RKADK_MUXER_TRACK_SOURCE_S

**Описание**

Структура атрибутов потока мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_TRACK_SOURCE_TYPE_E enTrackType;
  union {
    RKADK_TRACK_VIDEO_SOURCE_INFO_S stVideoInfo; /* <video track info */
    RKADK_TRACK_AUDIO_SOURCE_INFO_S stAudioInfo; /* <audio track info */
  } unTrackSourceAttr;
} RKADK_MUXER_TRACK_SOURCE_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enTrackType | Тип потока |
| stVideoInfo | Атрибуты видеопотока |
| stAudioInfo | Атрибуты аудиопотока |

**Связанные типы данных и интерфейсы**

RKADK_TRACK_SOURCE_TYPE_E RKADK_TRACK_VIDEO_SOURCE_INFO_S RKADK_TRACK_AUDIO_SOURCE_INFO_S

#### 3.2.17 RKADK_TRACK_SOURCE_TYPE_E

**Описание**

Перечисление типов дорожек потока мультиплексора.

**Определение**

```text
typedef enum {
  RKADK_TRACK_SOURCE_TYPE_VIDEO = 0,
  RKADK_TRACK_SOURCE_TYPE_AUDIO,
  RKADK_TRACK_SOURCE_TYPE_BUTT
} RKADK_TRACK_SOURCE_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_TRACK_SOURCE_TYPE_VIDEO | Видеопоток |
| RKADK_TRACK_SOURCE_TYPE_AUDIO | Аудиопоток |

#### 3.2.18 RKADK_TRACK_VIDEO_SOURCE_INFO_S

**Описание**

Структура атрибутов видеопотока мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_CHAR cPixFmt[RKADK_PIX_FMT_LEN];
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32BitRate;
  RKADK_U32 u32FrameRate;
  RKADK_U32 u32Gop;
  RKADK_U16 u16Profile;
  RKADK_U16 u16Level;
  RKADK_U32 u32ThumbWidth;
  RKADK_U32 u32ThumbHeight;
} RKADK_TRACK_VIDEO_SOURCE_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enCodecType | Тип кодирования |
| cPixFmt | Формат пикселей |
| u32Width | Ширина изображения |
| u32Height | Высота изображения |
| u32BitRate | Битрейт |
| u32FrameRate | Частота кадров |
| u32Gop | GOP |
| u16Profile | Профиль кодирования |
| u16Level | Уровень кодирования |
| u32ThumbWidth | Ширина миниатюры |
| u32ThumbHeight | Высота миниатюры |

#### 3.2.19 RKADK_TRACK_AUDIO_SOURCE_INFO_S

**Описание**

Структура атрибутов аудиопотока мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U16 u32BitWidth;
  RKADK_U32 u32ChnCnt;
  RKADK_U32 u32SampleRate;
  RKADK_U32 u32SamplesPerFrame;
  RKADK_U32 u32Bitrate;
} RKADK_TRACK_AUDIO_SOURCE_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enCodecType | Тип кодека |
| u32BitWidth | Разрядность |
| u32ChnCnt | Число каналов |
| u32SampleRate | Частота дискретизации |
| u32SamplesPerFrame | Отсчётов на кадр |
| u32Bitrate | Битрейт |

#### 3.2.20 RKADK_MUXER_PRE_RECORD_ATTR_S

**Описание**

Структура атрибутов предварительной записи.

**Определение**

```text
typedef struct {
  RKADK_U32 u32PreRecTimeSec; /* pre record time, unit in second(s) */
  RKADK_U32 u32PreRecCacheTime;
  RKADK_MUXER_PRE_RECORD_MODE_E enPreRecordMode;
} RKADK_MUXER_PRE_RECORD_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32PreRecTimeSec | Длительность предварительной записи |
| u32PreRecCacheTime | Длительность кэша предварительной записи |
| enPreRecordMode | Режим предварительной записи |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_PRE_RECORD_MODE_E RKADK_MUXER_ATTR_S

**Примечания**

u32PreRecCacheTime должен быть не меньше u32PreRecTimeSec и содержать полный GoP, чтобы корректно получить I-кадр.

#### 3.2.21 RKADK_MUXER_PRE_RECORD_MODE_E

**Описание**

Перечисление режимов предварительной записи.

**Определение**

```text
typedef enum {
  RKADK_MUXER_PRE_RECORD_NONE = 0,
  RKADK_MUXER_PRE_RECORD_MANUAL_SPLIT, /* manual split file prerecord */
  RKADK_MUXER_PRE_RECORD_SINGLE        /* first file prerecord */
} RKADK_MUXER_PRE_RECORD_MODE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_MUXER_PRE_RECORD_NONE | Без предварительной записи |
| RKADK_MUXER_PRE_RECORD_MANUAL_SPLIT | Предварительная запись при ручном разделении файла |
| RKADK_MUXER_PRE_RECORD_SINGLE | Предварительная запись первого файла |

#### 3.2.22 RKADK_MUXER_DATA_S

**Описание**

Структура данных мультиплексора.

**Определение**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  RKADK_S32 s32VencChn;
  int isKeyFrame;
  RKADK_U64 u64Pts;
  RKADK_U32 u32Seq;
  RKADK_U32 u32Len;
  MB_BLK pMbBlk;
} RKADK_MUXER_DATA_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32MuxerId | ID мультиплексора |
| s32VencChn | Канал VENC; для стороннего потока задайте -1 |
| isKeyFrame | Является ли кадр ключевым |
| u64Pts | Временная метка кадра |
| u32Seq | Порядковый номер кадра |
| u32Len | Длина данных кадра |
| pMbBlk | Указатель блока кадрового буфера |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_WriteVideoFrame RKADK_MUXER_WriteAudioFrame

#### 3.2.23 RKADK_MUXER_THUMB_INFO_S

**Описание**

Структура информации о миниатюре.

**Определение**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  unsigned char* pBuf;
  RKADK_U32 u32Len;
} RKADK_MUXER_THUMB_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32MuxerId | ID мультиплексора |
| pBuf | Указатель данных миниатюры |
| u32Len | Длина данных миниатюры |

**Связанные типы данных и интерфейсы**

RKADK_MUXER_BuildInThumb

## 4. AOV (непрерывная видеозапись)

### 4.1 Обзор

AOV (Always On Video) - непрерывная запись с низкой частотой кадров на основе циклов сна и пробуждения. При событии, например обнаружении ИИ, срабатывании PIR или пробуждении по Wi-Fi, можно вернуться к обычной частоте кадров. Рекомендуется включить файловый кэш; см. RKADK_RECORD_FileCacheInit и RKADK_RECORD_FileCacheDeInit в главе о записи. Для снижения энергопотребления при интервальной записи AOV питание SD-карты во сне отключают; перед засыпанием приложение должно её размонтировать. При включённом файловом кэше он пытается монтировать карту во время записи и защищает операцию, чтобы карта не была размонтирована до её завершения. Процесс AOV показан ниже.

![AOV](/docs/rockchip-rkadk/assets/en-p068-figure-01.png)

### 4.2 Справочник API

#### 4.2.1 RKADK_AOV_Init

**Описание**

Инициализация AOV.

**Синтаксис**

```c
int RKADK_AOV_Init(RKADK_AOV_ARG_S *pstAovAttr);
```

**Параметр**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstAovAttr | Указатель атрибутов AOV | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Примечание**

Используйте вместе с RKADK_AOV_DeInit. Повторная инициализация не поддерживается.

**Пример**

rkadk_aov_record_test

**Связанная тема**

RKADK_AOV_DeInit

#### 4.2.2 RKADK_AOV_DeInit

**Описание**

Деинициализация AOV.

**Синтаксис**

```c
int RKADK_AOV_DeInit();
```

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Примечание**

Используйте вместе с RKADK_AOV_Init. Повторная деинициализация не поддерживается.

**Пример**

rkadk_aov_record_test

**Связанная тема**

RKADK_AOV_Init

#### 4.2.3 RKADK_AOV_SetSuspendTime

**Описание**

Задать запланированную длительность сна AOV в мс.

**Синтаксис**

```c
int RKADK_AOV_SetSuspendTime(int u32WakeupSuspendTime);
```

**Параметр**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32WakeupSuspendTime | Длительность сна | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Пример**

rkadk_aov_record_test

#### 4.2.4 RKADK_AOV_EnterSleep

**Описание**

Перейти в AOV.

**Синтаксис**

```c
int RKADK_AOV_EnterSleep();
```

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Пример**

rkadk_aov_record_test

#### 4.2.5 RKADK_AOV_WakeupLock

**Описание**

Заблокировать операции AOV.

**Синтаксис**

```c
void RKADK_AOV_WakeupLock();
```

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Примечание**

Используйте вместе с RKADK_AOV_WakeupUnlock.

**Пример**

rkadk_aov_record_test

**Связанная тема**

RKADK_AOV_WakeupUnlock

#### 4.2.6 RKADK_AOV_WakeupUnlock

**Описание**

Разблокировать операции AOV.

**Синтаксис**

```c
void RKADK_AOV_WakeupUnlock();
```

**Требования**

Заголовочный файл: rkadk_aov.h. Библиотека: librkadk.so.

**Примечание**

Используйте вместе с RKADK_AOV_WakeupLock.

**Пример**

rkadk_aov_record_test

**Связанная тема**

RKADK_AOV_WakeupLock

### 4.3 Типы данных

Основные типы модуля AOV: RKADK_AOV_ARG_S - структура атрибутов AOV; RKADK_AOV_NOTIFY_CALLBACK - указатель обратного вызова уведомлений AOV.

#### 4.3.1 RKADK_AOV_ARG_S

**Определение**

Структура атрибутов AOV.

**Определение**

```text
typedef struct {
   RKADK_AOV_NOTIFY_CALLBACK pfnNotifyCallback;
} RKADK_AOV_ARG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pfnNotifyCallback | Указатель обратного вызова уведомлений AOV |

Связанные типы и интерфейсы: RKADK_AOV_Init, RKADK_AOV_NOTIFY_CALLBACK

#### 4.3.2 RKADK_AOV_NOTIFY_CALLBACK

**Определение**

Указатель обратного вызова уведомлений AOV.

**Определение**

```text
typedef void (*RKADK_AOV_NOTIFY_CALLBACK)(RKADK_AOV_EVENT_E enEvent, void *msg);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enEvent | Перечисление событий уведомления AOV |
| msg | Резерв |

Связанные типы и интерфейсы: RKADK_AOV_ARG_S, RKADK_AOV_EVENT_E

#### 4.3.3 RKADK_AOV_EVENT_E

**Определение**

Перечисление событий уведомления AOV.

**Определение**

```text
typedef enum {
   RKADK_AOV_ENTER_SLEEP = 0,
   RKADK_AOV_EVENT_BUTT
} RKADK_AOV_EVENT_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_AOV_ENTER_SLEEP | Переход AOV в сон |

Связанные типы данных и интерфейсы

RKADK_AOV_NOTIFY_CALLBACK

## 5. Фотосъёмка

### 5.1 Обзор

Базовая фотосъёмка с упаковкой JPEG: одиночные снимки, серийная съёмка и JPEG Slice. При JPEG Slice данные VI кодируются в JPEG по сегментам для экономии памяти. При увеличении JPEG данные VI сначала увеличиваются интерполяцией по сегментам, затем сегментами кодируются в JPEG. Высота сегмента должна быть кратна 16 пикселям. Для качественного объединения рекомендуется сохранять соотношение сторон сегментов максимально близким к исходному изображению. Больше сегментов требует меньше памяти, но увеличивает время формирования изображения; меньше сегментов требует больше памяти, но ускоряет обработку. Число сегментов выбирайте по конкретной задаче.

### 5.2 Справочник API

#### 5.2.1 RKADK_PHOTO_Init

**Описание**

Инициализировать задачу фотосъёмки.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_Init(RKADK_PHOTO_ATTR_S *pstPhotoAttr, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstPhotoAttr | Указатель атрибутов задачи фотосъёмки | Вход |
| ppHandle | Указатель созданной задачи фотосъёмки | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Примечание**

Повторная инициализация не поддерживается.

**Пример**

rkadk_photo_test

**См. также**

RKADK_PHOTO_DeInit

#### 5.2.2 RKADK_PHOTO_DeInit

**Описание**

Деинициализировать задачу фотосъёмки.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_DeInit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель задачи фотосъёмки | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Примечание**

Повторная деинициализация не поддерживается.

**Пример**

rkadk_photo_test

**См. также**

RKADK_PHOTO_DeInit

#### 5.2.3 RKADK_PHOTO_TakePhoto

**Описание**

Выполнить фотосъёмку.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_TakePhoto(RKADK_MW_PTR pHandle, RKADK_TAKE_PHOTO_ATTR_S *pstAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель задачи фотосъёмки | Вход |
| pstAttr | Атрибуты фотосъёмки | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PHOTO_TakePhoto разрешён только после инициализации задачи записи (так указано в оригинале).

**Пример**

rkadk_photo_test

**См. также**

Нет

#### 5.2.4 RKADK_PHOTO_Reset

**Описание**

Перенастроить задачу фотосъёмки.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_Reset(RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| ppHandle | Указатель задачи фотосъёмки | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PHOTO_Reset разрешён только после инициализации задачи записи (термин оригинала). При смене разрешения измените разрешение Photo в ini через RKADK_PARAM_SetCamParam. RV1126/RV1109 и RK3576 не поддерживают динамическую смену разрешения: сначала RKADK_PHOTO_DeInit, затем настройка нового разрешения и RKADK_PHOTO_Init. Если Photo и другие модули делят канал VI, меняйте их разрешения одновременно, чтобы VI и VENC совпадали.

**Пример**

rkadk_photo_test

**См. также**

#### 5.2.5 RKADK_PHOTO_GetThmInJpg

**Описание**

Получить данные миниатюры из JPG.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_GetThmInJpg(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_JPG_THUMB_TYPE_E eThmType, RKADK_U8 *pu8Buf, RKADK_U32 *pu32Size);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pszFileName | Путь к JPG | Вход |
| eThmType | Тип миниатюры | Вход |
| pu8Buf | Вход: указатель буфера миниатюры; выход: фактические данные миниатюры | Input/Output |
| pu32Size | Вход: длина pu8Buf; выход: фактическая длина данных миниатюры | Input/Output |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

No.

#### 5.2.6 RKADK_PHOTO_GetThmInJpgEx

**Описание**

Расширенный интерфейс извлечения миниатюры из JPG позволяет задать тип и разрешение выходной миниатюры. Используйте вместе с RKADK_PHOTO_ThumbBufFree.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_GetThmInJpgEx(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_JPG_THUMB_TYPE_E eThmType, RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pszFileName | Путь к JPG | Вход |
| eThmType | Тип миниатюры | Вход |
| pstThumbAttr | Указатель структуры атрибутов миниатюры | Вход/выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

RKADK_PHOTO_ThumbBufFree

#### 5.2.7 RKADK_PHOTO_ThumbBufFree

**Описание**

Освободить память, выделенную RKADK_PHOTO_GetThmInJpgEx. Используйте вместе с RKADK_PHOTO_GetThmInJpgEx.

**Синтаксис**

```c
RKADK_S32 RKADK_PHOTO_ThumbBufFree(RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstThumbAttr | Указатель структуры атрибутов миниатюры | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_photo.h. Библиотека: librkadk.so.

**Пример**

rkadk_thumb_test

**См. также**

RKADK_PHOTO_GetThmInJpgEx

#### 5.2.8 RKADK_MEDIA_SetVencRotation

**Описание**

Задать поворот канала VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_MEDIA_SetVencRotation(RKADK_U32 u32CamId, ROTATION_E enRotation, RKADK_STREAM_TYPE_E enStreamType);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enRotation | Угол поворота | Вход |
| enStreamType | Тип потока | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_media_comm.h. Библиотека: librkadk.so.

#### 5.2.9 RKADK_MEDIA_ToggleVencMirror

**Описание**

Задать зеркальное отражение канала VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_MEDIA_ToggleVencMirror(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool mirror);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enStreamType | Тип потока | Вход |
| mirror | Включение зеркального отражения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_media_comm.h. Библиотека: librkadk.so.

#### 5.2.10 RKADK_MEDIA_ToggleVencFlip

**Описание**

Задать переворот канала VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_MEDIA_ToggleVencFlip(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool flip);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enStreamType | Тип потока | Вход |
| flip | Включение переворота | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_media_comm.h. Библиотека: librkadk.so.

### 5.3 Типы данных

Основные типы модуля фотосъёмки: RKADK_PHOTO_TYPE_E - типы съёмки; RKADK_PHOTO_SINGLE_ATTR_S - атрибуты одиночного снимка; RKADK_PHOTO_MULTIPLE_ATTR_S - серийной съёмки; RKADK_PHOTO_RECV_DATA_S - данные фотографии; RKADK_PHOTO_DATA_RECV_FN_PTR - функция приёма данных; RKADK_TAKE_PHOTO_ATTR_S - атрибуты съёмки; RKADK_PHOTO_ATTR_S - атрибуты задачи; RKADK_JPG_THUMB_TYPE_E - типы миниатюр JPG; RKADK_THUMB_TYPE_E - типы выходных миниатюр; RKADK_THUMB_ATTR_S - атрибуты миниатюры; ROTATION_E - типы поворота; RKADK_PHOTO_FMT_CHANGE_S - параметры преобразования FBC0/NV16.

#### 5.3.1 RKADK_PHOTO_TYPE_E

**Описание**

Перечисление типов фотосъёмки.

**Определение**

```text
typedef enum {
  RKADK_PHOTO_TYPE_SINGLE = 0,
  RKADK_PHOTO_TYPE_MULTIPLE,
  RKADK_PHOTO_TYPE_LAPSE, // TODO
  RKADK_PHOTO_TYPE_BUTT
} RKADK_PHOTO_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_PHOTO_TYPE_SINGLE | Режим одиночного снимка |
| RKADK_PHOTO_TYPE_MULTIPLE | Режим серийной съёмки |
| RKADK_PHOTO_TYPE_LAPSE | Интервальная фотосъёмка (зарезервировано) |

**Связанные типы данных и интерфейсы**

RKADK_TAKE_PHOTO_ATTR_S

#### 5.3.2 RKADK_PHOTO_SINGLE_ATTR_S

**Описание**

Структура атрибутов одиночного снимка.

**Определение**

```text
typedef struct {
  // TODO
  RKADK_S32 s32Time_sec;
} RKADK_PHOTO_SINGLE_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32Time_sec | Зарезервировано |

**Связанные типы данных и интерфейсы**

RKADK_TAKE_PHOTO_ATTR_S

#### 5.3.3 RKADK_PHOTO_MULTIPLE_ATTR_S

**Описание**

Структура атрибутов серийной съёмки.

**Определение**

```text
typedef struct {
  /* s32Count is -1 that means continuous photo, larger than 0 that meas photo
   * number */
  RKADK_S32 s32Count;
} RKADK_PHOTO_MULTIPLE_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32Count | Число последовательных снимков; -1 означает непрерывную съёмку до RKADK_PHOTO_DeInit |

**Связанные типы данных и интерфейсы**

RKADK_TAKE_PHOTO_ATTR_SS

#### 5.3.4 RKADK_PHOTO_THUMB_ATTR_S

**Описание**

Структура параметров миниатюры.

**Определение**

```text
#define RKADK_MPF_LARGE_THUMB_NUM_MAX 2  /* Supports the maximum number of MPF thumbnails to
be generated simultaneously */

typedef struct rkSIZE_S {
  RK_U32 u32Width;               /* Thumbnail width*/
  RK_U32 u32Height;              /* Thumbnail height */
} SIZE_S;

typedef enum {
  RKADK_PHOTO_MPF_SINGLE = 0,    /* Single MPF thumbnail */
  RKADK_PHOTO_MPF_MULTI,         /* Multiple MPF thumbnails */
  RKADK_PHOTO_MPF_BUTT
} RKADK_PHOTO_MPF_MODE_E;

typedef struct {
  RKADK_U8 u8LargeThumbNum;      /* Number of generated MPF thumbnails*/
  SIZE_S astLargeThumbSize[RKADK_MPF_LARGE_THUMB_NUM_MAX];  /* Each thumbnail resolution */
} RKADK_PHOTO_MPF_CFG_S;
typedef struct {
  RKADK_PHOTO_MPF_MODE_E eMode;  /* MPF thumbnail mode */
  RKADK_PHOTO_MPF_CFG_S sCfg;    /* MPF thumbnail configuration */
} RKADK_PHOTO_MPF_ATTR_S;

typedef struct {
  RKADK_BOOL bSupportDCF; /* Fixed resolution: 160 * 120 jpg */
  RKADK_PHOTO_MPF_ATTR_S stMPFAttr;
} RKADK_PHOTO_THUMB_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bSupportDCF | Создавать ли миниатюры DCF с фиксированным разрешением 160*120 |
| stMPFAttr | Параметры миниатюры MPF |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_ATTR_S

#### 5.3.5 RKADK_PHOTO_RECV_DATA_S

**Описание**

Структура данных фотографии.

**Определение**

```text
typedef struct {
  RKADK_U8 *pu8DataBuf;
  RKADK_U32 u32DataLen;
  RKADK_U32 u32CamId;
  bool bStreamEnd;
  void *userdata;
} RKADK_PHOTO_RECV_DATA_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pu8DataBuf | Указатель данных |
| u32DataLen | Длина данных |
| u32CamId | ID камеры |
| bStreamEnd | Конец потока данных; главным образом для JPEG Slice |
| userdata | Указатель пользовательских данных |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_DATA_RECV_FN_PTR

#### 5.3.6 RKADK_PHOTO_DATA_RECV_FN_PTR

**Описание**

Указатель функции приёма данных фотографии.

**Определение**

```text
typedef void (*RKADK_PHOTO_DATA_RECV_FN_PTR)(RKADK_PHOTO_RECV_DATA_S *pstData);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pstData | Указатель данных |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_RECV_DATA_S RKADK_PHOTO_ATTR_S

#### 5.3.7 RKADK_TAKE_PHOTO_ATTR_S

**Описание**

Структура атрибутов фотографии.

**Определение**

```text
typedef struct {
  RKADK_PHOTO_TYPE_E enPhotoType;
  union tagPhotoTypeAttr {
    RKADK_PHOTO_SINGLE_ATTR_S stSingleAttr;
    RKADK_PHOTO_LAPSE_ATTR_S stLapseAttr; // TODO
    RKADK_PHOTO_MULTIPLE_ATTR_S stMultipleAttr;
  } unPhotoTypeAttr;
} RKADK_TAKE_PHOTO_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enPhotoType | Тип фотосъёмки |
| stSingleAttr | Параметры одиночного снимка |
| stMultipleAttr | Параметры серийной съёмки |
| stLapseAttr | Параметры интервальной фотосъёмки (зарезервировано) |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_TYPE_E RKADK_PHOTO_SINGLE_ATTR_S RKADK_PHOTO_MULTIPLE_ATTR_S RKADK_PHOTO_TakePhoto

#### 5.3.8 RKADK_PHOTO_FMT_CHANGE_S

**Описание**

Структура параметров преобразования формата FBC0/NV16

**Определение**

```text
typedef struct {
  RKADK_U32 u32VencChn;
  RKADK_U32 u32VdecChn;

  //format change venc parameter
  RKADK_U32 u32BitRate;   //default 4M
  RKADK_U32 u32Profile;   //default 77
} RKADK_PHOTO_FMT_CHANGE_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32VencChn | ID канала VENC для преобразования формата |
| u32VdecChn | ID канала VDEC для преобразования формата |
| u32BitRate | Битрейт кодирования, по умолчанию 4M |
| u32Profile | Уровень кодирования, по умолчанию 77 |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_ATTR_S RKADK_PHOTO_Init

#### 5.3.9 RKADK_PHOTO_ATTR_S

**Описание**

Структура атрибутов задачи фотосъёмки.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_PHOTO_THUMB_ATTR_S stThumbAttr;
  RKADK_PHOTO_DATA_RECV_FN_PTR pfnPhotoDataProc;
  void *userdata;
  RKADK_POST_ISP_ATTR_S *pstPostIspAttr;
  RKADK_PHOTO_FMT_CHANGE_S stFmtChange;
} RKADK_PHOTO_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | ID камеры |
| stThumbAttr | Параметры миниатюры |
| pfnPhotoDataProc | Указатель обратного вызова приёма данных фотографии |
| userdata | Указатель пользовательских данных |
| pstPostIspAttr | Атрибуты Post AI ISP |
| stFmtChange | Параметры преобразования формата FBC0/NV16 |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_THUMB_ATTR_S RKADK_PHOTO_DATA_RECV_FN_PTR RKADK_POST_ISP_ATTR_S RKADK_PHOTO_FMT_CHANGE_S RKADK_PHOTO_Init

#### 5.3.10 RKADK_JPG_THUMB_TYPE_E

**Описание**

Перечисление типов миниатюр JPG.

**Определение**

```text
typedef enum {
  RKADK_JPG_THUMB_TYPE_DCF,
  RKADK_JPG_THUMB_TYPE_MFP1,
  RKADK_JPG_THUMB_TYPE_MFP2,
  RKADK_JPG_THUMB_TYPE_BUTT
} RKADK_JPG_THUMB_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_JPG_THUMB_TYPE_DCF | Миниатюра DCF |
| RKADK_JPG_THUMB_TYPE_MFP1 | Миниатюра MPF1 |
| RKADK_JPG_THUMB_TYPE_MFP2 | Миниатюра MPF2 |

**Связанные типы данных и интерфейсы**

RKADK_PHOTO_GetThmInJpg RKADK_PHOTO_GetThmInJpgEx

#### 5.3.11 RKADK_THUMB_TYPE_E

**Описание**

Перечисление типов выходных миниатюр.

**Определение**

```text
typedef enum {
  RKADK_THUMB_TYPE_NV12 = 0,
  RKADK_THUMB_TYPE_JPEG,
  RKADK_THUMB_TYPE_RGB565,
  RKADK_THUMB_TYPE_RGBA8888,
  RKADK_THUMB_TYPE_BGRA8888
} RKADK_THUMB_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_THUMB_TYPE_NV12 | Выходная миниатюра NV12 |
| RKADK_THUMB_TYPE_JPEG | Выходная миниатюра JPG |
| RKADK_THUMB_TYPE_RGB565 | Выходная миниатюра RGB565 |
| RKADK_THUMB_TYPE_RGBA8888 | Выходная миниатюра RGBA9888 |
| RKADK_THUMB_TYPE_BGRA8888 | Выходная миниатюра BGRA8888 |

**Связанные типы данных и интерфейсы**

RKADK_THUMB_ATTR_S RKADK_GetThmInMp4Ex RKADK_PHOTO_GetThmInJpgEx

#### 5.3.12 RKADK_THUMB_ATTR_S

**Описание**

Структура атрибутов миниатюры.

**Определение**

```text
typedef struct {
  RKADK_THUMB_TYPE_E enType;
  // 4 alignment
  RKADK_U32 u32Width;
  // 2 alignment
  RKADK_U32 u32Height;
  // 4 alignment
  RKADK_U32 u32VirWidth;
  // 2 alignment
  RKADK_U32 u32VirHeight;
  RKADK_U8 *pu8Buf;
  RKADK_U32 u32BufSize;
} RKADK_THUMB_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enType | Требуемый тип миниатюры |
| u32Width | На входе требуемая ширина миниатюры, на выходе фактическая |
| u32Height | На входе требуемая высота миниатюры, на выходе фактическая |
| u32VirWidth | На входе требуемая виртуальная ширина миниатюры, на выходе фактическая |
| u32VirHeight | На входе требуемая виртуальная высота миниатюры, на выходе фактическая |
| pu8Buf | Указатель данных миниатюры |
| u32BufSize | Длина данных миниатюры |

**Связанные типы данных и интерфейсы**

RKADK_THUMB_TYPE_E

RKADK_GetThmInMp4Ex RKADK_PHOTO_GetThmInJpgEx

#### 5.3.13 ROTATION_E

**Описание**

Перечисление типов поворота.

**Определение**

```text
typedef enum rkROTATION_E {
    ROTATION_0        = 0,
    ROTATION_90       = 1,
    ROTATION_180      = 2,
    ROTATION_270      = 3,
    ROTATION_BUTT
} ROTATION_E;
```

**Связанные типы данных и интерфейсы**

RKADK_MEDIA_SetVencRotation

## 6. Удалённый предварительный просмотр

### 6.1 Обзор

Обратные вызовы предварительного просмотра позволяют получать сведения о видео и аудио, запускать и останавливать VENC/AENC и регистрировать функции обработки кадров аудио и видео.

### 6.2 Справочник API

#### 6.2.1 RKADK_STREAM_VideoInit

**Описание**

Инициализировать видеомодули VI и VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_VideoInit(RKADK_STREAM_VIDEO_ATTR_S *pstVideoAttr, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstVideoAttr | Указатель атрибутов видео | Вход |
| ppHandle | Указатель созданной видеозадачи | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Повторная инициализация видеомодуля не поддерживается.

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_VideoDeInit

#### 6.2.2 RKADK_STREAM_VideoDeInit

**Описание**

Деинициализировать видеомодули VI и VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_VideoDeInit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель видеозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Повторная деинициализация не поддерживается.

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_VideoInit

#### 6.2.3 RKADK_STREAM_VencStart

**Описание**

Включить VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_VencStart(RKADK_MW_PTR pHandle, RKADK_S32 s32FrameCnt);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель видеозадачи | Вход |
| s32FrameCnt | Число принимаемых кадров; -1 означает неограниченный приём до VencStop | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

RKADK_STREAM_VencStart разрешён только после инициализации видеомодуля. После вызова запускается обратный вызов данных VENC для начала приёма.

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_VencStop

#### 6.2.4 RKADK_STREAM_VencStop

**Описание**

Отключить VENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_VencStop(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель видеозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_VencStart

#### 6.2.5 RKADK_STREAM_VideoReset

**Описание**

Перенастроить потоковое видео.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_VideoReset(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель видеозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

RKADK_STREAM_VideoReset разрешён только после RKADK_STREAM_VideoInit. При смене разрешения, частоты кадров, битрейта, типа кодирования или записи измените параметры Preview в ini через RKADK_PARAM_SetCamParam. RV1126/RV1109 и RK3576 не поддерживают динамическую смену разрешения и типа кодирования: сначала RKADK_STREAM_VideoDeInit, затем новые параметры и RKADK_STREAM_VideoInit. Если Preview делит канал VI с другими модулями, переключайте разрешение всех этих модулей одновременно, чтобы VI и VENC совпадали.

**Пример**

rkadk_stream_test

#### 6.2.6 RKADK_STREAM_GetVideoInfo

**Описание**

Получить сведения о видео.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_GetVideoInfo(RKADK_U32 u32CamId, RKADK_VIDEO_INFO_S *pstVideoInfo);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pstVideoInfo | Указатель структуры сведений о видео | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_stream_test

**См. также**

Нет

#### 6.2.7 RKADK_STREAM_AudioInit

**Описание**

Инициализировать аудиомодули AI и AENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_AudioInit(RKADK_STREAM_AUDIO_ATTR_S *pstAudioAttr, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstAudioAttr | Указатель атрибутов аудио | Вход |
| ppHandle | Указатель созданной аудиозадачи | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Повторная инициализация аудиомодуля не поддерживается.

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_AudioDeInit

#### 6.2.8 RKADK_STREAM_AudioDeInit

**Описание**

Деинициализировать аудиомодули AI и AENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_AudioDeInit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель аудиозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_AudioInit

#### 6.2.9 RKADK_STREAM_AencStart

**Описание**

Включить AENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_AencStart(RKADK_MW_PTR *pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель аудиозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

RKADK_STREAM_AencStart разрешён только после инициализации аудиомодуля. После вызова запускается обратный вызов данных AENC для начала приёма.

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_AencStop

#### 6.2.10 RKADK_STREAM_AencStop

**Описание**

Отключить AENC.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_AencStop(RKADK_MW_PTR *pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель аудиозадачи | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_stream_test

**См. также**

RKADK_STREAM_AencStart

#### 6.2.11 RKADK_STREAM_GetAudioInfo

**Описание**

Получить сведения об аудио.

**Синтаксис**

```c
RKADK_S32 RKADK_STREAM_GetAudioInfo(RKADK_MW_PTR *pHandle, RKADK_AUDIO_INFO_S *pstAudioInfo);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель аудиозадачи | Вход |
| pstAudioInfo | Указатель структуры сведений об аудио | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_stream.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_stream_test

**См. также**

Нет

### 6.3 Типы данных

В источнике перечислены типы модуля воспроизведения: RKADK_CODEC_TYPE_E - форматы кодирования; RKADK_VENC_DATA_PROC_FUNC - обратный вызов данных VENC; RKADK_VIDEO_STREAM_S - видеопоток; RKADK_VENC_DATA_PACK_S - пакет VENC; RKADK_VENC_DATA_TYPE_S - тип пакета VENC; RKADK_VIDEO_INFO_S - сведения о видео; RKADK_STREAM_VIDEO_ATTR_S - атрибуты видеозадачи; RKADK_AUDIO_DATA_PROC_FUNC - обратный вызов аудиоданных; RKADK_AUDIO_STREAM_S - аудиоданные; RKADK_AUDIO_INFO_S - сведения об аудио; RKADK_STREAM_AUDIO_ATTR_S - атрибуты аудиозадачи.

#### 6.3.1 RKADK_CODEC_TYPE_E

**Описание**

Перечисление форматов кодирования. По умолчанию аудиокодирование AAC не поддерживается.

**Определение**

```text
typedef enum {
  //Video
  RKADK_CODEC_TYPE_H264 = 0,
  RKADK_CODEC_TYPE_H265,
  RKADK_CODEC_TYPE_MJPEG,
  RKADK_CODEC_TYPE_JPEG,

  //Audio
  RKADK_CODEC_TYPE_G711A,
  RKADK_CODEC_TYPE_G711U,
  RKADK_CODEC_TYPE_G726,
  RKADK_CODEC_TYPE_MP2,
  RKADK_CODEC_TYPE_MP3,
  RKADK_CODEC_TYPE_ACC,
  RKADK_CODEC_TYPE_PCM,
  RKADK_CODEC_TYPE_BUTT
} RKADK_CODEC_TYPE_E;
```

#### 6.3.2 RKADK_VENC_DATA_PROC_FUNC

**Описание**

Указатель обратного вызова данных VENC.

**Определение**

```text
typedef RKADK_S32 (*RKADK_VENC_DATA_PROC_FUNC)(RKADK_VIDEO_STREAM_S *pVStreamData);
```

**Связанные типы данных и интерфейсы**

RKADK_VIDEO_STREAM_S

#### 6.3.3 RKADK_VIDEO_STREAM_S

**Описание**

Структура видеопотока.

**Определение**

```text
typedef struct {
  RKADK_VENC_DATA_PACK_S astPack; /* stream pack attribute */
  RKADK_U32 u32Seq;               /* the list number of stream */
  RKADK_BOOL bEndOfStream;        /* frame end flag */
  RKADK_U32 u32CamId;
} RKADK_VIDEO_STREAM_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| astPack | Структура пакета |
| u32Seq | Порядковый ID пакета |
| bEndOfStream | Зарезервировано |
| u32CamId | ID камеры |

**Связанные типы данных и интерфейсы**

RKADK_VENC_DATA_PACK_S RKADK_VENC_DATA_PROC_FUNC

#### 6.3.4 RKADK_VENC_DATA_PACK_S

**Описание**

Структура пакета VENC.

**Определение**

```text
typedef struct {
  RKADK_U8 *apu8Addr;                /* the virtual address of stream */
  RKADK_U32 au32Len;                 /* the length of stream */
  RKADK_U64 u64PTS;                  /* time stamp */
  RKADK_VENC_DATA_TYPE_S stDataType; /* the type of stream */
} RKADK_VENC_DATA_PACK_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| apu8Addr | Указатель данных |
| au32Len | Длина данных |
| u64PTS | Временная метка |
| stDataType | Тип данных |

**Связанные типы данных и интерфейсы**

RKADK_VENC_DATA_TYPE_S RKADK_VIDEO_STREAM_S

#### 6.3.5 RKADK_VENC_DATA_TYPE_S

**Описание**

Тип пакета VENC.

**Определение**

```text
/* the nalu type of H264 */
typedef enum {
  RKADK_H264E_NALU_BSLICE = 0,   /* B SLICE types */
  RKADK_H264E_NALU_PSLICE = 1,   /* P SLICE types */
  RKADK_H264E_NALU_ISLICE = 2,   /* I SLICE types */
  RKADK_H264E_NALU_IDRSLICE = 5, /* IDR SLICE types */
  RKADK_H264E_NALU_SEI = 6,      /* SEI types */
  RKADK_H264E_NALU_SPS = 7,      /* SPS types */
  RKADK_H264E_NALU_PPS = 8,      /* PPS types */
  RKADK_H264E_NALU_BUTT
} RKADK_H264E_NALU_TYPE_E;
/* the nalu type of H265 */
typedef enum {
  RKADK_H265E_NALU_BSLICE = 0,    /* B SLICE types */
  RKADK_H265E_NALU_PSLICE = 1,    /* P SLICE types */
  RKADK_H265E_NALU_ISLICE = 2,    /* I SLICE types */
  RKADK_H265E_NALU_IDRSLICE = 19, /* IDR SLICE types */
  RKADK_H265E_NALU_VPS = 32,      /* VPS types */
  RKADK_H265E_NALU_SPS = 33,      /* SPS types */
  RKADK_H265E_NALU_PPS = 34,      /* PPS types */
  RKADK_H265E_NALU_SEI = 39,      /* SEI types */
  RKADK_H265E_NALU_BUTT
} RKADK_H265E_NALU_TYPE_E;

typedef struct {
  RKADK_CODEC_TYPE_E enPayloadType;      /* H.264/H.265/JPEG/MJPEG */
  union {
    RKADK_H264E_NALU_TYPE_E enH264EType; /* H264E NALU types */
    RKADK_H265E_NALU_TYPE_E enH265EType; /* H265E NALU types */
    RKADK_JPEGE_PACK_TYPE_E enJPEGEType; /* TODO: JPEGE PACK types*/
  };
} RKADK_VENC_DATA_TYPE_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enPayloadType | Тип кодирования |
| enH264EType | Тип пакета H264 |
| enH265EType | Тип пакета H265 |
| enJPEGEType | Зарезервировано |

**Связанные типы данных и интерфейсы**

RKADK_CODEC_TYPE_E RKADK_VENC_DATA_PACK_S

#### 6.3.6 RKADK_VIDEO_INFO_S

**Описание**

Структура сведений о видео.

**Определение**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32BitRate;
  RKADK_U32 u32FrameRate;
  RKADK_U32 u32Gop;
} RKADK_VIDEO_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enPayloadType | Тип кодирования |
| u32Width | Ширина изображения |
| u32Height | Высота изображения |
| u32BitRate | Битрейт |
| u32FrameRate | Частота кадров |
| u32Gop | Интервал I-кадров |

**Связанные типы данных и интерфейсы**

RKADK_CODEC_TYPE_E RKADK_STREAM_GetVideoInfo

#### 6.3.7 RKADK_STREAM_VIDEO_ATTR_S

**Описание**

Структура атрибутов видеозадачи.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_VENC_DATA_PROC_FUNC pfnDataCB;
} RKADK_STREAM_VIDEO_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | ID камеры |
| pfnDataCB | Обратный вызов выдачи видеоданных |

**Связанные типы данных и интерфейсы**

RKADK_VENC_DATA_PROC_FUNC RKADK_STREAM_VideoInit

#### 6.3.8 RKADK_AUDIO_DATA_PROC_FUNC

**Описание**

Указатель обратного вызова данных AENC.

**Определение**

```text
typedef RKADK_S32 (*RKADK_AUDIO_DATA_PROC_FUNC)(RKADK_AUDIO_STREAM_S *pAStreamData);
```

**Связанные типы данных и интерфейсы**

RKADK_AUDIO_STREAM_S

#### 6.3.9 RKADK_AUDIO_STREAM_S

**Описание**

Структура потока аудиоданных.

**Определение**

```text
typedef struct {
  RKADK_U8 *pStream;      /* the virtual address of stream */
  RKADK_U32 u32Len;       /* stream lenth, by bytes */
  RKADK_U64 u64TimeStamp; /* frame time stamp */
  RKADK_U32 u32Seq;       /* frame seq, if stream is not a valid frame,u32Seq is 0 */
  RKADK_CODEC_TYPE_E enType;
} RKADK_AUDIO_STREAM_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pStream | Указатель данных |
| u32Len | Длина данных |
| u64TimeStamp | Временная метка |
| u32Seq | Порядковый номер |
| enType | Тип кодирования аудиоданных |

**Связанные типы данных и интерфейсы**

RKADK_AUDIO_DATA_PROC_FUNC

#### 6.3.10 RKADK_AUDIO_INFO_S

**Описание**

Структура сведений об аудио.

**Определение**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32ChnCnt;
  RKADK_U32 u32SampleRate;
  RKADK_U32 u32AvgBytesPerSec;
  RKADK_U32 u32SamplesPerFrame;
  RKADK_U16 u16SampleBitWidth;
} RKADK_AUDIO_INFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enPayloadType | Тип кодирования |
| u32ChnCntt | Число каналов |
| u32SampleRate | Частота дискретизации |
| u32AvgBytesPerSec | Байт в секунду |
| u32SamplesPerFrame | Число отсчётов на кадр |
| u16SampleBitWidth | Бит на отсчёт |

**Связанные типы данных и интерфейсы**

RKADK_CODEC_TYPE_E RKADK_STREAM_GetAudioInfo

#### 6.3.11 RKADK_STREAM_AUDIO_ATTR_S

**Описание**

Структура атрибутов аудиозадачи.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_AUDIO_DATA_PROC_FUNC pfnPcmDataCB;
  RKADK_AUDIO_DATA_PROC_FUNC pfnAencDataCB;
} RKADK_STREAM_AUDIO_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | ID камеры |
| enCodecType | Тип кодирования |
| pfnPcmDataCB | Обратный вызов выдачи PCM |
| pfnAencDataCB | Обратный вызов выдачи кодированных аудиоданных |

**Связанные типы данных и интерфейсы**

RKADK_AUDIO_DATA_PROC_FUNC RKADK_STREAM_AudioInit

## 7. Проигрыватель

### 7.1 Обзор

Воспроизведение локальных аудио- и видеофайлов и сетевых потоков RTSP с управлением воспроизведением, паузой, переходом и снимком экрана. Функция Player совместима с RV1109/RV1126, RV1103/RV1103, RK3308 и RK3506 (перечень сохранён из источника). RV1109/RV1126 используют аппаратное декодирование, остальные платформы - программное.

### 7.2 Справочник API

#### 7.2.1 RKADK_PLAYER_Create

**Описание**

Создать проигрыватель.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Create(RKADK_MW_PTR *ppPlayer, RKADK_PLAYER_CFG_S *pstPlayCfg);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| ppPlayer | Указатель созданного проигрывателя | Выход |
| pstPlayCfg | Свойства проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Повторное создание того же проигрывателя не поддерживается.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Destroy

#### 7.2.2 RKADK_PLAYER_Destroy

**Описание**

Уничтожить проигрыватель.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Destroy(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Повторное уничтожение одного и того же проигрывателя не поддерживается.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Create

#### 7.2.3 RKADK_PLAYER_SetDataSource

**Описание**

Задать путь воспроизводимого файла. Если в Player включена сторонняя библиотека демультиплексирования, следует использовать RKADK_PLAYER_SetDataParam.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SetDataSource(RKADK_MW_PTR pPlayer, const RKADK_CHAR *pszfilePath);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| pszfilePath | Путь воспроизводимого файла | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Интерфейс RKADK_PLAYER_SetDataSource можно вызывать только после создания проигрывателя.

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.4 RKADK_PLAYER_SetDataParam

**Описание**

Задать параметры аудио и видео воспроизводимого файла. Используйте этот интерфейс, если в Player включена сторонняя библиотека демультиплексирования; иначе используйте RKADK_PLAYER_SetDataSource.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SetDataParam(RKADK_MW_PTR pPlayer, RKADK_PLAYER_DATA_PARAM_S *pstDataParam);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| pstDataParam | Параметры аудио и видео воспроизводимого файла | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PLAYER_SetDataParam можно вызывать только после создания проигрывателя.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SendVideoPacket

#### 7.2.5 RKADK_PLAYER_Prepare

**Описание**

Подготовка к воспроизведению.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Prepare(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PLAYER_Prepare можно вызывать только после создания проигрывателя и задания пути воспроизведения.

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.6 RKADK_PLAYER_GetCurrentPosition

**Описание**

Получить текущую позицию воспроизведения.

**Синтаксис**

```c
RKADK_S64 RKADK_PLAYER_GetCurrentPosition(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| Позиция воспроизведения, мс | Успех |
| -1 | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h

Библиотека: librkadk.so

**Примечание**

Нет

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.7 RKADK_PLAYER_Play

**Описание**

Начать воспроизведение.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Play(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PLAYER_Play можно вызывать только после RKADK_PLAYER_Prepare.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Stop

#### 7.2.8 RKADK_PLAYER_Stop

**Описание**

Остановить воспроизведение и освободить ресурсы.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Stop(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Play

#### 7.2.9 RKADK_PLAYER_Pause

**Описание**

Приостановить воспроизведение.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Pause(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Play

#### 7.2.10 RKADK_PLAYER_Seek

**Описание**

Seek.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Seek(RKADK_MW_PTR pPlayer, RKADK_S64 s64TimeInMs);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| s64TimeInMs | Время перехода | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

RKADK_PLAYER_Seek можно вызывать только после RKADK_PLAYER_Play.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_Play

#### 7.2.11 RKADK_PLAYER_GetPlayStatus

**Описание**

Получить текущее состояние воспроизведения.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_GetPlayStatus(RKADK_MW_PTR pPlayer, RKADK_PLAYER_STATE_E *penState);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| penState | Текущее состояние воспроизведения | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.12 RKADK_PLAYER_GetDuration

**Описание**

Получить длительность текущего воспроизводимого файла.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_GetDuration(RKADK_MW_PTR pPlayer, RKADK_U32 *pDuration);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| pDuration | Длительность текущего воспроизводимого файла, мс | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Нет

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.13 RKADK_PLAYER_Snapshot

**Описание**

Снимок экрана проигрывателя: этот интерфейс кодирует текущее отображаемое изображение в JPEG. Приложение получает созданные данные JPEG, зарегистрировав обратный вызов RKADK_PPLAYER_SNAPSHOT_RECV_FN.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_Snapshot(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Пример**

rkadk_player_test

**См. также**

Нет

#### 7.2.14 RKADK_PLAYER_SendAudioPacket

**Описание**

При включенной сторонней библиотеке демультиплексирования этот интерфейс передает распакованные аудиоданные в Player для декодирования и воспроизведения.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SendAudioPacket(RKADK_MW_PTR pPlayer, RKADK_PLAYER_PACKET *pstPacket);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| pstPacket | Передаваемый пакет | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Перед использованием этого интерфейса вызовите RKADK_PLAYER_SetDataParam для задания параметров аудио и видео.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_SendVideoPacket RKADK_PLAYER_SetDataParam

#### 7.2.15 RKADK_PLAYER_SendVideoPacket

**Описание**

При включенной сторонней библиотеке демультиплексирования этот интерфейс передает распакованные видеоданные в Player для декодирования и воспроизведения.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SendVideoPacket(RKADK_MW_PTR pPlayer, RKADK_PLAYER_PACKET *pstPacket);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| pstPacket | Передаваемый пакет | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечание**

Перед использованием этого интерфейса вызовите RKADK_PLAYER_SetDataParam для задания параметров аудио и видео.

**Пример**

rkadk_player_test

**См. также**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SetDataParam

#### 7.2.16 RKADK_PLAYER_GetSendFrameNum

**Описание**

Получить количество успешно декодированных кадров.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_GetSendFrameNum(RKADK_MW_PTR pPlayer);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| Количество кадров | Успех |
| -1 | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h

Библиотека: librkadk.so. Примечание: счетчик сбрасывается после Pause/Stop.

**Пример**

rkadk_player_test

**Связанные темы**

Нет

#### 7.2.17 RKADK_PLAYER_SetVdecWaterline

**Описание**

Задать порог заполнения VDEC.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SetVdecWaterline(RKADK_MW_PTR pPlayer, RKADK_U32 u32VdecWaterline);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Вход |
| u32VdecWaterline | Значение порога заполнения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so. Примечание: после задания порога VDEC воспроизведение начинается только при достижении этого уровня заполнения буфера VDEC.

**Пример**

rkadk_player_test

**Связанные темы**

Нет

#### 7.2.18 RKADK_PLAYER_SetAoVolume

**Описание**

Задать громкость воспроизведения.

**Синтаксис**

```c
RKADK_S32 RKADK_PLAYER_SetAoVolume(RKADK_MW_PTR pPlayer, RKADK_S32 s32Volume);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pPlayer | Указатель проигрывателя | Выход |
| s32Volume | Значение громкости | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_player.h. Библиотека: librkadk.so.

**Примечания**

Нет

**Пример**

rkadk_player_test

**Связанные темы**

Нет

### 7.3 Типы данных

Модуль воспроизведения предоставляет следующие основные типы данных: RKADK_PLAYER_EVENT_E — перечисление событий воспроизведения; RKADK_PLAYER_EVENT_FN — указатель функции обратного вызова события воспроизведения.

RKADK_PLAYER_CFG_S: структура атрибутов проигрывателя; RKADK_VO_FORMAT_E: перечисление пиксельных форматов; RKADK_VO_INTF_TYPE_E: перечисление интерфейсов дисплея; RKADK_PLAYER_FRAME_INFO_S: структура информации изображения; RKADK_PLAYER_STATE_E: перечисление состояний воспроизведения; RKADK_PLAYER_DATA_PARAM_S: структура параметров аудио и видео; RKADK_PLAYER_PACKET: пакет данных проигрывателя; RKADK_PLAYER_RTSP_CFG_S: структура атрибутов RTSP; RKADK_PLAYER_VDEC_CFG_S: структура атрибутов VDEC; RKADK_PLAYER_SNAPSHOT_CFG_S: структура атрибутов снимка; RKADK_PLAYER_SNAPSHOT_S: структура данных снимка; RKADK_PPLAYER_SNAPSHOT_RECV_FN: указатель функции обратного вызова данных снимка.

#### 7.3.1 RKADK_PLAYER_EVENT_E

**Описание**

Определяет перечисление событий воспроизведения.

**Определение**

```text
typedef enum {
  RKADK_PLAYER_EVENT_STATE_CHANGED = 0x0,
  RKADK_PLAYER_EVENT_PREPARED,
  RKADK_PLAYER_EVENT_PLAY,
  RKADK_PLAYER_EVENT_PAUSED,
  RKADK_PLAYER_EVENT_STOPPED,
  RKADK_PLAYER_EVENT_EOF,
  RKADK_PLAYER_EVENT_SOF,
  RKADK_PLAYER_EVENT_SEEK_END,
  RKADK_PLAYER_EVENT_ERROR,
  RKADK_PLAYER_EVENT_BUTT
} RKADK_PLAYER_EVENT_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_PLAYER_EVENT_STATE_CHANGED | Изменение состояния (зарезервировано) |
| RKADK_PLAYER_EVENT_PREPARED | Подготовка Prepared завершена |
| RKADK_PLAYER_EVENT_PLAY | Начать воспроизведение |
| RKADK_PLAYER_EVENT_PAUSED | Приостановить воспроизведение (зарезервировано) |
| RKADK_PLAYER_EVENT_STOPPED | Остановить воспроизведение |
| RKADK_PLAYER_EVENT_EOF | Конец воспроизведения |
| RKADK_PLAYER_EVENT_SOF | Зарезервировано |
| RKADK_PLAYER_EVENT_SEEK_END | Переход Seek завершен (зарезервировано) |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_EVENT_FN

#### 7.3.2 RKADK_PLAYER_EVENT_FN

**Описание**

Определить указатель обратного вызова события воспроизведения.

**Определение**

```text
typedef RKADK_VOID (*RKADK_PLAYER_EVENT_FN)(RKADK_MW_PTR pPlayer, RKADK_PLAYER_EVENT_E
enEvent, RKADK_VOID *pData);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pPlayer | Указатель проигрывателя |
| enEvent | Тип события |
| pData | Параметры события |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_EVENT_E RKADK_PLAYER_CFG_S

#### 7.3.3 RKADK_PLAYER_CFG_S

**Описание**

Определить структуру атрибутов проигрывателя.

**Определение**

```text
typedef struct {
  RKADK_BOOL bEnableVideo;
  RKADK_BOOL bEnableAudio;
  RKADK_BOOL bEnableThirdDemuxer;
  RKADK_PLAYER_FRAME_INFO_S stFrmInfo;
  RKADK_PLAYER_RTSP_CFG_S stRtspCfg;
  RKADK_PLAYER_VDEC_CFG_S stVdecCfg;
  RKADK_PLAYER_SNAPSHOT_CFG_S stSnapshotCfg;
  RKADK_BOOL bEnableBlackBackground;
  RKADK_PLAYER_EVENT_FN pfnPlayerCallback;
} RKADK_PLAYER_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bEnableVideo | Включить воспроизведение видео |
| bEnableAudio | Включить воспроизведение аудио |
| bEnableThirdDemuxer | Включить стороннюю библиотеку демультиплексирования |
| pfnPlayerCallback | Указатель функции обратного вызова события проигрывателя |
| stFrmInfo | Определить информацию изображения |
| stRtspCfg | Атрибут RTSP |
| stVdecCfg | Атрибут VDEC |
| stSnapshotCfg | Атрибут снимка экрана |
| bEnableBlackBackground | Становится ли экран черным после воспроизведения |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_EVENT_FN RKADK_PLAYER_FRAME_INFO_S RKADK_PLAYER_RTSP_CFG_S RKADK_PLAYER_VDEC_CFG_S RKADK_PLAYER_SNAPSHOT_CFG_S RKADK_PLAYER_Create

#### 7.3.4 RKADK_VO_FORMAT_E

**Описание**

Определяет перечисление пиксельных форматов изображения.

**Определение**

```text
typedef enum {
  VO_FORMAT_ARGB8888 = 0,
  VO_FORMAT_ABGR8888,
  VO_FORMAT_RGB888,
  VO_FORMAT_BGR888,
  VO_FORMAT_ARGB1555,
  VO_FORMAT_ABGR1555,
  VO_FORMAT_RGB565,
  VO_FORMAT_RGB444,
  VO_FORMAT_NV12,
  VO_FORMAT_NV21
} RKADK_VO_FORMAT_E;
```

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.5 RKADK_VO_INTF_TYPE_E

**Описание**

Определяет перечисление интерфейсов дисплея.

**Определение**

```text
typedef enum {
  DISPLAY_TYPE_HDMI = 0,
  DISPLAY_TYPE_EDP,
  DISPLAY_TYPE_VGA,
  DISPLAY_TYPE_DP,
  DISPLAY_TYPE_HDMI_EDP,
  DISPLAY_TYPE_MIPI,
  DISPLAY_TYPE_DEFAULT,
} RKADK_VO_INTF_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| DISPLAY_TYPE_HDMI | Интерфейс дисплея HDMI |
| DISPLAY_TYPE_EDP | Интерфейс дисплея EDP |
| DISPLAY_TYPE_VGA | Интерфейс дисплея VGA |
| DISPLAY_TYPE_MIPI | Интерфейс дисплея MIPI |
| DISPLAY_TYPE_DP | Интерфейс дисплея DP |
| DISPLAY_TYPE_HDMI_EDP | Интерфейс дисплея HDMI \| EDP |
| DISPLAY_TYPE_DEFAULT | Внутреннее обнаружение; интерфейс дисплея соответствует фактически подключенному оборудованию |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.6 RKADK_VO_SPLICE_MODE_E

**Описание**

Определяет перечисление способов объединения слоев.

**Определение**

```text
typedef enum {
  SPLICE_MODE_RGA = 0,
  SPLICE_MODE_GPU,
  SPLICE_MODE_BYPASS
} RKADK_VO_INTF_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| SPLICE_MODE_RGA | Объединение через RGA |
| SPLICE_MODE_GPU | Объединение через GPU |
| SPLICE_MODE_BYPASS | BYPASS, без объединения |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.7 RKADK_PLAYER_FRAME_INFO_S

**Описание**

Определить структуру информации изображения.

**Определение**

```text
typedef struct {
  RKADK_U32 u32FrmInfoX;
  RKADK_U32 u32FrmInfoY;
  RKADK_U32 u32DispWidth;
  RKADK_U32 u32DispHeight;
  RKADK_U32 u32ImgWidth;
  RKADK_U32 u32ImgHeight;
  RKADK_U32 u32VoLay;
  RKADK_U32 u32VoDev;
  RKADK_U32 u32VoChn;
  RKADK_U32 u32BorderColor;
  RKADK_U32 u32BorderTopWidth;
  RKADK_U32 u32BorderBottomWidth;
  RKADK_U32 u32BorderLeftWidth;
  RKADK_U32 u32BorderRightWidth;
  RKADK_BOOL bMirror;
  RKADK_BOOL bFlip;
  RKADK_U32 u32Rotation; //0: 0, 1: 90, 2: 180, 3: 270
  RKADK_VO_FORMAT_E u32VoFormat;
  RKADK_VO_INTF_TYPE_E u32EnIntfType;
  RKADK_VO_INTF_SYNC_E enIntfSync;
  RKADK_VO_SYNC_INFO_S stSyncInfo;
  RKADK_VO_SPLICE_MODE_E enVoSpliceMode;
} RKADK_PLAYER_FRAMEINFO_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32FrmInfoX | Координата x области отображения слоя |
| u32FrmInfoY | Координата y области отображения слоя |
| u32DispWidth | Ширина области отображения слоя |
| u32DispHeight | Высота области отображения слоя |
| u32ImgWidth | Ширина изображения слоя |
| u32ImgHeight | Высота изображения слоя |
| u32VoLay | Номер видеослоя видеовыхода |
| u32VoDev | Номер устройства вывода изображения |
| u32VoChn | Номер канала видеовыхода, диапазон: [0, VO_MAX_CHN_NUM(128)] |
| u32BorderColor | Атрибут рамки канала видеовыхода: цвет (зарезервировано) |
| u32BorderTopWidth | Атрибут рамки канала видеовыхода: ширина верхней границы (зарезервировано) |
| u32BorderBottomWidth | Атрибут рамки канала видеовыхода: ширина нижней границы (зарезервировано) |
| u32BorderLeftWidth | Атрибут рамки канала видеовыхода: ширина левой границы (зарезервировано) |
| u32BorderRightWidth | Атрибут рамки канала видеовыхода: ширина правой границы (зарезервировано) |
| bMirror | Включить зеркальное отражение |
| bFlip | Включить переворот |
| u32Rotation | Поворот, значения: [0: 0, 1: 90, 2: 180, 3: 270] |
| u32VoFormat | Определить пиксельный формат изображения |
| u32EnIntfType | Тип интерфейса дисплея |
| enIntfSync | Режим синхронизации интерфейса экрана |
| stSyncInfo | Структура атрибутов экрана |
| enVoSpliceMode | Режим объединения слоев |

**Примечание**

Подробные атрибуты видеовыхода описаны в главе VO документа Rockit Rockchip_Developer_Guide_MPI.pdf.

**Связанные типы данных и интерфейсы**

RKADK_VO_FORMAT_E RKADK_VO_INTF_TYPE_E RKADK_VO_SPLICE_MODE_E

RKADK_PLAYER_Create

#### 7.3.8 RKADK_PLAYER_STATE_E

**Описание**

Определяет перечисление состояний воспроизведения.

**Определение**

```text
typedef enum {
  RKADK_PLAYER_STATE_IDLE = 0, /* The player state before init */
  RKADK_PLAYER_STATE_INIT,     /* The player is in the initial state. It changes
                                  to the initial state after being SetDataSource */
  RKADK_PLAYER_STATE_PREPARED, /* The player is in the prepared state */
  RKADK_PLAYER_STATE_PLAY,     /* The player is in the playing state */
  RKADK_PLAYER_STATE_TPLAY,    /* The player is in the trick playing state, Reserved */
  RKADK_PLAYER_STATE_PAUSE,    /* The player is in the pause state */
  RKADK_PLAYER_STATE_ERR,      /* The player is in the err state */
  RKADK_PLAYER_STATE_BUTT
} RKADK_PLAYER_STATE_E;
```

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_GetPlayStatus

#### 7.3.9 RKADK_PLAYER_SNAPSHOT_S

**Описание**

Определить структуру данных снимка экрана.

**Определение**

```text
typedef struct {
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32DataLen;
  RKADK_U8 *pu8DataBuf;
} RKADK_PLAYER_SNAPSHOT_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32Width | Ширина снимка |
| u32Height | Высота снимка |
| u32DataLen | Длина данных снимка |
| pu8DataBuf | Указатель данных снимка |

**Связанные типы данных и интерфейсы**

RKADK_PPLAYER_SNAPSHOT_RECV_FN

#### 7.3.10 RKADK_PPLAYER_SNAPSHOT_RECV_FN

**Описание**

Определяет указатель функции обратного вызова данных снимка.

**Определение**

```text
typedef void (*RKADK_PPLAYER_SNAPSHOT_RECV_FN)(RKADK_PLAYER_SNAPSHOT_S *pstData);
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pstData | Указатель данных снимка |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_SNAPSHOT_S RKADK_PLAYER_SNAPSHOT_CFG_S

#### 7.3.11 RKADK_PLAYER_SNAPSHOT_CFG_S

**Описание**

Определить структуру атрибутов снимка.

**Определение**

```text
typedef struct {
  RKADK_U32 u32VencChn;
  RKADK_U32 u32MaxWidth;    //Support snapshot max width, default 4096
  RKADK_U32 u32MaxHeight;   //Support snapshot max height, default 4096
  RKADK_PPLAYER_SNAPSHOT_RECV_FN pfnDataCallback;
} RKADK_PLAYER_SNAPSHOT_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32VencChn | Канал кодирования JPEG |
| u32MaxWidth | Максимальная ширина снимка, по умолчанию 4096 |
| u32MaxHeight | Максимальная высота снимка, по умолчанию 4096 |
| pfnDataCallback | Указатель обратного вызова данных снимка |

**Связанные типы данных и интерфейсы**

RKADK_PPLAYER_SNAPSHOT_RECV_FN RKADK_PLAYER_CFG_S

#### 7.3.12 RKADK_PLAYER_VDEC_CFG_S

**Описание**

Определить структуру атрибутов VDEC.

**Определение**

```text
typedef struct {
  RKADK_U32 u32FrameBufCnt; //frame buffer cnt(output), default: 3
  RKADK_U32 u32StreamBufCnt; //stream buffer cnt(input), default: 3
} RKADK_PLAYER_VDEC_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32FrameBufCnt | Количество выходных буферов, по умолчанию 3 |
| u32StreamBufCnt | Количество входных буферов, по умолчанию 3 |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_CFG_S

#### 7.3.13 RKADK_PLAYER_RTSP_CFG_S

**Описание**

Определить структуру атрибутов RTSP.

**Определение**

```text
typedef struct {
  const char *transport; //udp or tcp, default: udp
  RKADK_U32 u32IoTimeout; //timeout (in microseconds) of socket I/O operations
} RKADK_PLAYER_RTSP_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| transport | Транспортный протокол, по умолчанию UDP |
| u32ITimeout | Тайм-аут операций ввода-вывода сокета, мс; по умолчанию без ограничения |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_CFG_S

#### 7.3.14 RKADK_PLAYER_PACKET

**Описание**

Определить структуру пакета данных для использования сторонней библиотеки демультиплексирования.

**Определение**

```text
typedef struct {
  bool bEofFlag;
  RKADK_S8 *s8PacketData;
  RKADK_S32 s32PacketSize;
  RKADK_U32 u32Seq;
  RKADK_S64 s64Pts;

  //if bypass, must set pFreeCB;
  bool bBypass;
  RKADK_MPI_MB_FREE_CB pFreeCB;
} RKADK_PLAYER_PACKET;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bEofFlag | Являются ли данные последним кадром |
| s8PacketData | Указатель данных |
| s32PacketSize | Длина данных |
| u32Seq | Порядковый номер |
| s64Pts | Временная метка |
| bBypass | Способ передачи данных: true — прямая передача, false — дополнительное копирование |
| pFreeCB | Указатель функции освобождения s8PacketData; обязателен при bBypass=true |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SendVideoPacket

#### 7.3.15 RKADK_PLAYER_DATA_PARAM_S

**Описание**

Определить структуру параметров аудио и видео для работы со сторонней библиотекой демультиплексирования.

**Определение**

```text
typedef struct {
  const RKADK_CHAR *pFilePath;
  RKADK_BOOL bIsRtsp;
  RKADK_BOOL bVideoExist;
  RKADK_BOOL bAudioExist;

  //video param
  RKADK_CODEC_TYPE_E enVCodecType;
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_FORMAT_E enPixFmt; //output pixel format
  RKADK_U32 u32FrameRate;

  //audio param
  RKADK_CODEC_TYPE_E enACodecType;
  RKADK_S32 u32BitWidth;
  RKADK_S32 u32SampleRate;
  RKADK_S32 u32Channel;
} RKADK_PLAYER_DATA_PARAM_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| pFilePath | Путь воспроизводимого файла |
| bIsRtsp | Является ли поток сетевым потоком RTSP |
| bVideoExist | Есть ли видеопоток в воспроизводимом файле |
| bAudioExist | Есть ли аудиопоток в воспроизводимом файле |
| enVCodecType | Формат декодирования видеопотока |
| u32Width | Ширина видеопотока |
| u32Height | Высота видеопотока |
| u32FrameRate | Частота кадров видеопотока |
| enACodecType | Формат декодирования аудиопотока |
| u32BitWidth | Разрядность аудиопотока |
| u32SampleRate | Частота дискретизации аудиопотока |
| u32Channel | Количество каналов аудиопотока |

**Связанные типы данных и интерфейсы**

RKADK_PLAYER_SetDataParam

## 8. Прямая трансляция

### 8.1 Обзор

Предоставляет базовые службы стандартной прямой трансляции RTSP и службы прямой трансляции RTMP. Одновременный запуск RTSP и RTMP не поддерживается.

### 8.2 Справочник API

#### 8.2.1 RTSP

##### 8.2.1.1 RKADK_RTSP_Init

**Описание**

Инициализировать модуль RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_Init(RKADK_U32 u32CamId, RKADK_U32 port, const char *path, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| port | Номер порта | Вход |
| path | Адрес RTSP | Вход |
| ppHandle | Созданный дескриптор RTSP | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h

Библиотека: librkadk.so

**Примечание**

После RKADK_RTSP_Init вызовите RKADK_RTSP_Start для запуска прямой трансляции RTSP.

**Пример**

rkadk_rtsp_test

**См. также**

RKADK_RTSP_DeInit

##### 8.2.1.2 RKADK_RTSP_DeInit

**Описание**

Деинициализировать модуль RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_DeInit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTSP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h. Библиотека: librkadk.so

**Пример**

rkadk_rtsp_test

**См. также**

RKADK_RTSP_Init

##### 8.2.1.3 RKADK_RTSP_Start

**Описание**

Начать прямую трансляцию RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_Start(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTSP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h. Библиотека: librkadk.so

**Примечание**

Вызывайте этот интерфейс после RKADK_RTSP_Init.

**Пример**

rkadk_rtsp_test

**См. также**

RKADK_RTSP_Stop

##### 8.2.1.4 RKADK_RTSP_Stop

**Описание**

Остановить прямую трансляцию RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_Stop(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTSP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h. Библиотека: librkadk.so

**Пример**

rkadk_rtsp_test

**См. также**

RKADK_RTSP_Start

##### 8.2.1.5 RKADK_RTSP_VideoReset

**Описание**

Перенастроить прямую трансляцию RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_VideoReset(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTSP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h

Библиотека: librkadk.so

**Примечание**

RKADK_RTSP_VideoReset можно использовать только после RKADK_RTSP_Init. При изменении разрешения, частоты кадров, битрейта, типа кодирования или записи перенастройте параметры модуля Live в ini-файле через RKADK_PARAM_SetCamParam. RV1126/RV1109 и RK3576 не поддерживают динамическую смену разрешения и типа кодирования: сначала выполните RKADK_RTSP_DeInit, задайте новое разрешение или тип кодирования, затем снова RKADK_RTSP_Init. Если Live совместно с другими модулями использует канал VI, разрешение Live и этих модулей нужно менять одновременно, чтобы избежать несовпадения разрешений VI и VENC.

#### 8.2.2 RTMP

##### 8.2.2.1 RKADK_RTMP_Init

**Описание**

Инициализировать модуль RTMP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTMP_Init(RKADK_U32 u32CamId, const char *path, RKADK_MW_PTR *ppHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| path | Адрес RTMP | Вход |
| ppHandle | Созданный дескриптор RTMP | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtmp.h. Библиотека: librkadk.so

**Пример**

rkadk_rtmp_test

**См. также**

RKADK_RTMP_DeInit

##### 8.2.2.2 RKADK_RTMP_DeInit

**Описание**

Деинициализировать модуль RTMP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTMP_DeInit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTMP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtmp.h. Библиотека: librkadk.so

**Пример**

rkadk_rtmp_test

**См. также**

RKADK_RTMP_Init

##### 8.2.2.3 RKADK_RTSP_VideoReset

**Описание**

Перенастроить прямую трансляцию RTSP.

**Синтаксис**

```c
RKADK_S32 RKADK_RTSP_VideoReset(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Созданный дескриптор RTSP | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_rtsp.h. Библиотека: librkadk.so

**Примечание**

RKADK_RTMP_VideoReset можно использовать только после RKADK_RTMP_Init. При изменении разрешения, частоты кадров, битрейта, типа кодирования или записи перенастройте параметры модуля Live в ini-файле через RKADK_PARAM_SetCamParam. RV1126/RV1109 и RK3576 не поддерживают динамическую смену разрешения и типа кодирования: сначала выполните RKADK_RTMP_DeInit, задайте новое разрешение или тип кодирования, затем снова RKADK_RTMP_Init. Если Live совместно с другими модулями использует канал VI, разрешение Live и этих модулей нужно менять одновременно, чтобы избежать несовпадения разрешений VI и VENC.

## 9. Хранение данных

### 9.1 Обзор

Предоставляет базовые функции хранения: обнаружение, хранение, получение и управление файлами; запрос емкости и состояния устройства; автоматическое удаление файлов; форматирование.

### 9.2 Справочник API

#### 9.2.1 RKADK_STORAGE_Init

**Описание**

Инициализация модуля хранения.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_Init(RKADK_MW_PTR *ppHandle, RKADK_STR_DEV_ATTR *pstDevAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| ppHandle | Созданный дескриптор модуля хранения | Выход |
| pstDevAttr | Указатель атрибутов подключенного устройства | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

Повторная инициализация не поддерживается. Если RKADK_STR_DEV_ATTR передается как NULL, используются атрибуты по умолчанию: 2 папки video_front и video_back, сортировка по имени файла, порог автоматического удаления 500~1000M, без ограничения количества файлов, с долей 50%.

**Пример**

rkadk_storage_test

**См. также**

RKADK_STORAGE_Deinit

#### 9.2.2 RKADK_STORAGE_Deinit

**Описание**

Деинициализация модуля хранения.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_Deinit(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель дескриптора модуля хранения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

Повторная деинициализация не поддерживается.

**Пример**

rkadk_storage_test

**См. также**

RKADK_STORAGE_Init

#### 9.2.3 RKADK_STORAGE_GetDevAttr

**Описание**

Получить атрибуты подключенного устройства.

**Синтаксис**

```c
RKADK_STR_DEV_ATTR RKADK_STORAGE_GetDevAttr(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель дескриптора модуля хранения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| RKADK_STR_DEV_ATTR | Структура атрибутов подключенного устройства |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

RKADK_STORAGE_GetDevAttr можно использовать только после инициализации модуля хранения.

**Пример**

Нет

**См. также**

Нет

#### 9.2.4 RKADK_STORAGE_GetMountStatus

**Описание**

Получить состояние подключения устройства.

**Синтаксис**

```c
RKADK_MOUNT_STATUS RKADK_STORAGE_GetMountStatus(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель дескриптора модуля хранения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| RKADK_MOUNT_STATUS | Перечисление состояний подключения |

**Требования**

Заголовочный файл: rkadk_storage.h

Библиотека: librkadk.so

**Пример**

rkadk_storage_test

**См. также**

Нет

#### 9.2.5 RKADK_STORAGE_GetCapacity

**Описание**

Получить емкость устройства.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_GetCapacity(RKADK_MW_PTR *ppHandle, RKADK_S32 *totalSize, RKADK_S32 *freeSize);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| ppHandle | Созданный дескриптор модуля хранения | Input/Output |
| totalSize | Указатель полной емкости устройства | Выход |
| freeSize | Указатель оставшейся емкости устройства | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Пример**

rkadk_storage_test

**См. также**

Нет

#### 9.2.6 RKADK_STORAGE_GetFileList

**Описание**

Получить список файлов.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_GetFileList(RKADK_FILE_LIST *list, RKADK_MW_PTR pHandle, RKADK_SORT_TYPE sort);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| list | Указатель структуры списка файлов | Вход/выход |
| PHandle | Указатель дескриптора модуля хранения | Вход |
| sort | Тип сортировки | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

Необходимо использовать вместе с RKADK_STORAGE_FreeFileList.

**Пример**

rkadk_storage_test

**См. также**

RKADK_STORAGE_FreeFileList

#### 9.2.7 RKADK_STORAGE_FreeFileList

**Описание**

Освободить список файлов.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_FreeFileList(RKADK_FILE_LIST *list);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| list | Указатель структуры списка файлов | Вход/выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

Необходимо использовать вместе с RKADK_STORAGE_GetFileList.

**Пример**

rkadk_storage_test

**См. также**

RKADK_STORAGE_GetFileList

#### 9.2.8 RKADK_STORAGE_GetFileNum

**Описание**

Получить количество файлов.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_GetFileNum(RKADK_CHAR *fileListPath, RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| fileListPath | Указатель пути списка файлов | Вход |
| PHandle | Указатель дескриптора модуля хранения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| non-negative | Количество файлов |
| -1 | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Пример**

Нет

**См. также**

Нет

#### 9.2.9 RKADK_STORAGE_GetDevPath

**Описание**

Получить путь подключенного устройства.

**Синтаксис**

```c
RKADK_CHAR *RKADK_STORAGE_GetDevPath(RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель дескриптора модуля хранения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| RKADK_CHAR * | Указатель пути подключенного устройства |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Примечание**

RKADK_STORAGE_GetDevPath можно использовать только после инициализации модуля хранения.

**Пример**

rkadk_storage_test

**См. также**

Нет

#### 9.2.10 RKADK_STORAGE_Format

**Описание**

Форматирование устройства.

**Синтаксис**

```c
RKADK_S32 RKADK_STORAGE_Format(RKADK_MW_PTR pHandle, RKADK_CHAR *cFormat);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| PHandle | Указатель дескриптора модуля хранения | Вход |
| cFormat | Тип файловой системы | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_storage.h. Библиотека: librkadk.so

**Пример**

Нет

**См. также**

Нет

### 9.3 Типы данных

Модуль хранения предоставляет следующие основные типы: RKADK_MOUNT_STATUS — перечисление состояний подключения; RKADK_SORT_TYPE — перечисление типов сортировки; RKADK_SORT_CONDITION — перечисление условий сортировки.

RKADK_STR_FOLDER_ATTR: структура атрибутов папки; RKADK_STR_DEV_ATTR: структура атрибутов устройства; RKADK_FILE_INFO: структура информации файла; RKADK_FILE_LIST: структура списка файлов; RKADK_FILE_LIST_ARRAY: структура группы списков файлов.

#### 9.3.1 RKADK_MOUNT_STATUS

**Описание**

Определяет перечисление состояний подключения.

**Определение**

```text
typedef enum {
  DISK_UNMOUNTED = 0,
  DISK_NOT_FORMATTED,
  DISK_FORMAT_ERR,
  DISK_SCANNING,
  DISK_MOUNTED,
  DISK_MOUNT_BUTT,
} RKADK_MOUNT_STATUS;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| DISK_UNMOUNTED | Диск не подключен |
| DISK_NOT_FORMATTED | Диск не отформатирован |
| DISK_FORMAT_ERR | Ошибка формата диска |
| DISK_SCANNING | Выполняется сканирование диска |
| DISK_MOUNTED | Диск подключен |

**Связанные типы данных и интерфейсы**

RKADK_STORAGE_GetMountStatus

#### 9.3.2 RKADK_SORT_TYPE

**Описание**

Определяет перечисление типов сортировки.

**Определение**

```text
typedef enum {
  LIST_ASCENDING = 0,
  LIST_DESCENDING,
  LIST_BUTT,
} RKADK_SORT_TYPE;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| LIST_ASCENDING | Сортировать список по возрастанию |
| LIST_DESCENDING | Сортировать список по убыванию |

**Связанные типы данных и интерфейсы**

RKADK_STORAGE_GetFileList

#### 9.3.3 RKADK_SORT_CONDITION

**Описание**

Определяет перечисление условий сортировки.

**Определение**

```text
typedef enum {
  SORT_MODIFY_TIME = 0,
  SORT_FILE_NAME,
  SORT_BUTT,
} RKADK_SORT_CONDITION;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| SORT_MODIFY_TIME | Список сортируется по времени изменения файла |
| SORT_FILE_NAME | Список сортируется по имени файла |

**Связанные типы данных и интерфейсы**

RKADK_STR_FOLDER_ATTR

#### 9.3.4 RKADK_STR_FOLDER_ATTR

**Описание**

Определить структуру атрибутов папки.

**Определение**

```text
typedef struct {
  RKADK_CHAR cFolderPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_SORT_CONDITION s32SortCond;
  RKADK_BOOL bNumLimit;
  RKADK_S32 s32Limit;
} RKADK_STR_FOLDER_ATTR;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| cFolderPath | Путь папки |
| s32SortCond | Условия сортировки |
| bNumLimit | Параметр: задавать ли верхний предел по количеству файлов |
| s32Limit | Максимальная емкость папки (доля/количество) |

**Связанные типы данных и интерфейсы**

RKADK_SORT_CONDITION RKADK_STR_DEV_ATTR

#### 9.3.5 RKADK_STR_DEV_ATTR

**Описание**

Определить структуру атрибутов устройства.

**Определение**

```text
typedef struct {
  RKADK_CHAR cDevPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_CHAR cMountPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_S32 s32FreeSizeDelMin;
  RKADK_S32 s32FreeSizeDelMax;
  RKADK_S32 s32AutoDel;
  RKADK_S32 s32FolderNum;
  RKADK_CHAR cFormatId[RKADK_MAX_FORMAT_ID_LEN];
  RKADK_CHAR cVolume[RKADK_MAX_VOLUME_LEN];
  RKADK_S32 s32CheckFormatId;
  RKADK_STR_FOLDER_ATTR *pstFolderAttr;
} RKADK_STR_DEV_ATTR;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| cDevPath | Имя устройства (путь устройства) |
| cMountPath | Путь подключения устройства |
| s32FreeSizeDelMin | Нижний порог автоматического удаления |
| s32FreeSizeDelMax | Верхний порог автоматического удаления |
| s32AutoDel | Параметр автоматического удаления |
| s32FolderNum | Количество папок |
| cFormatId | Идентификатор формата |
| cVolume | Метка тома |
| s32CheckFormatId | Проверить соответствие идентификатора формата |
| pstFolderAttr | Указатель структуры атрибутов папки |

**Связанные типы данных и интерфейсы**

RKADK_STR_FOLDER_ATTR RKADK_STORAGE_Init RKADK_STORAGE_GetDevAttr

#### 9.3.6 RKADK_FILE_INFO

**Описание**

Определить структуру информации файла.

**Определение**

```text
typedef struct {
  RKADK_CHAR filename[RKADK_MAX_FILE_PATH_LEN];
  off_t stSize;
  time_t stTime;
  void *thumb;
} RKADK_FILE_INFO;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| filename | Имя файла |
| stSize | Размер файла |
| stTime | Время изменения файла |
| thumb | Указатель миниатюры |

**Связанные типы данных и интерфейсы**

RKADK_FILE_LIST

#### 9.3.7 RKADK_FILE_LIST

**Описание**

Определить структуру списка файлов.

**Определение**

```text
typedef struct {
  RKADK_CHAR path[RKADK_MAX_FILE_PATH_LEN];
  RKADK_S32 s32FileNum;
  RKADK_FILE_INFO *file;
} RKADK_FILE_LIST;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| path | Путь списка файлов (папки) |
| s32FileNum | Количество файлов |
| file | Указатель структуры информации файла |

**Связанные типы данных и интерфейсы**

RKADK_FILE_INFO RKADK_FILE_LIST_ARRAY

#### 9.3.8 RKADK_FILE_LIST_ARRAY

**Описание**

Определить структуру группы списков файлов.

**Определение**

```text
typedef struct {
  RKADK_S32 s32ListNum;
  RKADK_FILE_LIST *list;
} RKADK_FILE_LIST_ARRAY;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| s32ListNum | Количество списков файлов (папок) |
| list | Указатель структуры списка файлов |

**Связанные типы данных и интерфейсы**

RKADK_FILE_LIST

## 10. Отображение

### 10.1 Обзор

Предоставляет локальный предпросмотр, отображение двух потоков с горизонтальным или вертикальным объединением, а также «картинку в картинке» для потоков нескольких камер с переключением содержимого основного экрана и вложенной области. Поддерживается совместный показ локального предпросмотра и стороннего потока H264/H265 в режиме «картинка в картинке», также с переключением этих областей. Поддерживается отображение до двух каналов PIP.

### 10.2 Справочник API

#### 10.2.1 RKADK_DISP_Init

**Описание**

Инициализировать модуль локального предпросмотра.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_Init(RKADK_U32 u32CamId);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

**Пример**

rkadk_disp_test

**См. также**

RKADK_DISP_DeInit

#### 10.2.2 RKADK_DISP_DeInit

**Описание**

Деинициализировать модуль локального предпросмотра.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_DeInit(RKADK_U32 u32CamId);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h

Библиотека: librkadk.so

**Пример**

rkadk_disp_test

**См. также**

RKADK_DISP_Init

#### 10.2.3 RKADK_DISP_SetAttr

**Описание**

Задать атрибуты предпросмотра.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_SetAttr(RKADK_U32 u32CamId, RKADK_DISP_ATTR_S *pstAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| pstAttr | Атрибуты предпросмотра | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

#### 10.2.4 RKADK_DISP_InitEx

**Описание**

Инициализировать локальный предпросмотр и дополнительный поток.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_InitEx(RKADK_DISP_CFG_S *pstAttr, RKADK_MW_PTR *ppHandle) ;
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pstAttr | Указатель параметров настройки предпросмотра и дополнительного потока | Вход |
| ppHandle | Указатель созданной задачи предпросмотра | Выход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Примечания**

Если тип дополнительного потока равен RKADK_STREAM_TYPE_DISP, параметры инициализации читаются из ini.

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

**Пример**

rkadk_disp_test

**Связанные темы**

RKADK_DISP_DeInitEx

#### 10.2.5 RKADK_DISP_DeInitEx

**Описание**

Деинициализировать локальный предпросмотр и дополнительный поток.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_DeInitEx(RKADK_MW_PTR pHandle) ;
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель задачи предпросмотра | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

**Пример**

rkadk_disp_test

**Связанные темы**

RKADK_DISP_InitEx

#### 10.2.6 RKADK_DISP_SetAttrEx

**Описание**

Задать атрибуты предпросмотра и дополнительного потока.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_SetAttrEx(RKADK_DISP_ATTR_S *pstAttr, RKADK_MW_PTR pHandle);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pstAttr | Атрибуты предпросмотра и дополнительного потока | Вход |
| pHandle | Указатель задачи предпросмотра | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

#### 10.2.7 RKADK_DISP_SendVideoStream

**Описание**

При включенном отображении дополнительного потока этот интерфейс передает его данные в VDEC.

**Синтаксис**

```c
RKADK_S32 RKADK_DISP_SendVideoStream(RKADK_MW_PTR pHandle, RKADK_U32 u32VdecChn, RKADK_DISP_DATA_S *pstData);
```

**Параметры**

| Имя параметра | Описание | Input/Output |
| --- | --- | --- |
| pHandle | Указатель задачи предпросмотра | Вход |
| u32VdecChn | Канал VDEC | Вход |
| pstData | Указатель данных дополнительного потока | Вход |

**Возвращаемые значения**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_disp.h. Библиотека: librkadk.so

### 10.3 Типы данных

Модуль отображения предоставляет следующие основные типы: RKADK_DISP_SUB_STREAM_NUM — количество дополнительных потоков; RKADK_DISP_CFG_S — структура настройки параметров предпросмотра и дополнительных потоков; RKADK_DISP_STREAM_CFG_S — структура настройки параметров дополнительного потока; RKADK_DISP_VDEC_CFG_S — структура настройки параметров VDEC дополнительного потока; RKADK_DISP_VO_CFG_S — структура настройки параметров VO дополнительного потока; RKADK_DISP_ATTR_S — структура атрибутов предпросмотра и дополнительных потоков; RKADK_DISP_STREAM_ATTR_S — структура атрибутов дополнительного потока; RKADK_DISP_VDEC_ATTR_S — структура атрибутов VDEC дополнительного потока.

RKADK_DISP_DATA_S: структура данных дополнительного потока

#### 10.3.1 RKADK_DISP_SUB_STREAM_NUM

**Описание**

Количество дополнительных потоков.

**Определение**

```text
#define RKADK_DISP_SUB_STREAM_NUM 2
```

#### 10.3.2 RKADK_DISP_CFG_S

**Описание**

Определяет структуру настройки параметров предпросмотра и дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_DISP_STREAM_CFG_S stSubStream[RKADK_DISP_SUB_STREAM_NUM];
} RKADK_DISP_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32CamId | ID камеры |
| stSubStream | Параметры дополнительного потока |

#### 10.3.3 RKADK_DISP_STREAM_CFG_S

**Описание**

Определяет структуру настройки параметров дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_BOOL bEnable;                       /* enable subwindow */
  RKADK_S32 s32CamId;                       /* subwindow camera id, set to -1 when
RKADK_STREAM_TYPE_THIRD_STREAM */
  RKADK_STREAM_TYPE_E enStreamType;         /* subwindow stream type */
  RKADK_DISP_VO_CFG_S stVoCfg;              /* VO configuration read from ini when
RKADK_STREAM_TYPE_DISP */
  RKADK_DISP_VDEC_CFG_S stVdecCfg;          /* stream must set stVdecCfg when
RKADK_STREAM_TYPE_THIRD_STREAM */
} RKADK_DISP_STREAM_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bEnable | Включать ли дополнительный поток |
| s32CamId | Идентификатор камеры дополнительного потока; для стороннего потока задайте -1 |
| enStreamType | Тип дополнительного потока |
| stVoCfg | Параметры VO дополнительного потока; при типе RKADK_STREAM_TYPE_DISP читаются из ini |
| stVdecCfg | Параметры VDEC дополнительного потока; обязательны при типе RKADK_STREAM_TYPE_THIRD_STREAM |

#### 10.3.4 RKADK_DISP_VDEC_CFG_S

**Описание**

Определяет структуру настройки параметров VDEC дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_U32 u32VdecChn;
  RKADK_U32 u32SrcWidth;
  RKADK_U32 u32SrcHeight;
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32StreamBufCnt;                /* stream(input) buffer count, default: 8 */
  RKADK_U32 u32FrameBufCnt;                 /* frame(output) buffer count, default: 3 */
  RKADK_U32 u32FrameBufSize;                /* if not set, calculated internally */
  VIDEO_MODE_E u32DecodeMode;               /* decoding mode */
  VIDEO_OUTPUT_ORDER_E enOutputOrder;       /* frames output order */
} RKADK_DISP_VDEC_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32VdecChn | Канал VDEC |
| u32SrcWidth | Ширина дополнительного потока |
| u32SrcHeight | Высота дополнительного потока |
| enCodecType | Тип кодирования дополнительного потока (H264/H265) |
| u32StreamBufCnt | Количество входных буферов VDEC, по умолчанию 8 |
| u32FrameBufCnt | Количество выходных буферов VDEC, по умолчанию 3 |
| u32FrameBufSize | Размер буфера VDEC; при значении 0 вычисляется внутри VDEC |
| u32DecodeMode | Способ передачи потока |
| enOutputOrder | Порядок вывода декодированных кадров: для потоков с B-кадрами задайте порядок отображения, иначе порядок декодирования |

#### 10.3.5 RKADK_DISP_VO_CFG_S

**Описание**

Определяет структуру настройки параметров VO дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_U32 u32VoChn;
  RKADK_RECT_S stVoRect;
  RKADK_U32 rotation;     /* Range:[0,3], 0:0, 1:90, 2:180, 3:270 */
} RKADK_DISP_VO_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32VoChn | Канал VO |
| stVoRect | Область вывода дополнительного потока |
| rotation | Поворот дополнительного потока |

#### 10.3.6 RKADK_DISP_ATTR_S

**Описание**

Определить структуру атрибутов предпросмотра и дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_RECT_S stVpssCropRect;
  RKADK_RECT_S stVoRect;
  RKADK_S32 s32Priority;  /* Overlay priority, higher value, higher priority, -1 is not
change */
  RKADK_DISP_STREAM_ATTR_S stSubStreamAttr[RKADK_DISP_SUB_STREAM_NUM];
} RKADK_DISP_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| stVpssCropRect | Входная область отображения |
| stVoRect | Выходная область отображения |
| s32Priority | Приоритет канала Vo: чем больше значение, тем выше приоритет; -1 означает не задавать (использовать приоритет по умолчанию) |
| stSubStreamAttr | Атрибуты дополнительного потока |

#### 10.3.7 RKADK_DISP_STREAM_ATTR_S

**Описание**

Определяет структуру атрибутов дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_RECT_S stVpssCropRect;
  RKADK_RECT_S stVoRect;
  RKADK_S32 s32Priority;  /* Overlay priority, higher value, higher priority, -1 is not
change */
  RKADK_DISP_VDEC_ATTR_S stVdecAttr;
} RKADK_DISP_STREAM_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| stVpssCropRect | Входная область отображения дополнительного потока; действует только при типе RKADK_STREAM_TYPE_DISP |
| stVoRect | Выходная область отображения дополнительного потока |
| s32Priority | Приоритет канала vo: чем больше значение, тем выше приоритет; -1 означает не задавать (использовать приоритет по умолчанию) |
| stVdecAttr | Атрибуты VDEC дополнительного потока; действуют только при типе RKADK_STREAM_TYPE_THIRD_STREAM |

#### 10.3.8 RKADK_DISP_VDEC_ATTR_S

**Описание**

Определяет структуру атрибутов VDEC дополнительного потока.

**Определение**

```text
typedef struct {
  RKADK_U32 u32SrcWidth;
  RKADK_U32 u32SrcHeight;
  RKADK_CODEC_TYPE_E enCodecType; // RKADK_CODEC_TYPE_BUTT is not change
} RKADK_DISP_VDEC_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32SrcWidth | Ширина дополнительного потока |
| u32SrcHeight | Высота дополнительного потока |
| enCodecType | Тип кодирования дополнительного потока (H264/H265) |

#### 10.3.9 RKADK_DISP_DATA_S

**Описание**

Определяет структуру данных дополнительного потока.

**Определение**

```text
typedef struct {
  bool bEofFlag;
  char *data;
  RKADK_U32 u32Len;
  RKADK_U64 u64Pts;
  RKADK_U32 u32Seq;
  bool bBypass;             /* if bypass, must set pFreeCB; */
  RKADK_DISP_MB_FREE_CB pFreeCB;
} RKADK_DISP_DATA_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| bEofFlag | Указывает, является ли это последним кадром данных |
| data | Указатель данных |
| u32Len | Длина данных |
| u32Seq | Порядковый номер |
| u64Pts | Временная метка |
| bBypass | Способ передачи данных: true — прямая передача, false — копирование |
| pFreeCB | Указатель функции освобождения данных; обязателен при bBypass=true |

## 11. OSD

### 11.1 Обзор

Модуль OSD предоставляет базовые функции водяного знака

### 11.2 Справочник API

#### 11.2.1 RKADK_OSD_Init

**Описание**

Инициализировать задачу водяного знака.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_Init(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| pstOsdAttr | Указатель атрибутов задачи водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

**Примечание**

Повторная инициализация не поддерживается.

#### 11.2.2 RKADK_OSD_Deinit

**Описание**

Деинициализировать задачу водяного знака.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_Deinit(RKADK_U32 u32OsdId);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

**Примечание**

Повторная деинициализация не поддерживается.

#### 11.2.3 RKADK_OSD_UpdateBitMap

**Описание**

Обновить содержимое водяного знака.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_UpdateBitMap(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| pstOsdAttr | Указатель атрибутов задачи водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

**Примечание**

Необходимо использовать после завершения задачи деинициализации.

#### 11.2.4 RKADK_OSD_AttachToStream

**Описание**

Добавить водяной знак к целевому потоку.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_AttachToStream(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_OSD_STREAM_ATTR_S *pstOsdStreamAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип целевого потока | Вход |
| pstOsdStreamAttr | Указатель информации о положении водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

**Примечание**

Один и тот же водяной знак нельзя повторно добавить к одному типу потока.

#### 11.2.5 RKADK_OSD_DettachFromStream

**Описание**

Удалить водяной знак из целевого потока.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_DettachFromStream(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип целевого потока | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

#### 11.2.6 RKADK_OSD_UpdateOsdSize

**Описание**

Обновить размер водяного знака.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_UpdateOsdSize(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| pstOsdAttr | Указатель атрибутов задачи водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

#### 11.2.7 RKADK_OSD_UpdateDisplayAttr

**Описание**

Обновить область отображения водяного знака.

**Синтаксис**

```c
RKADK_S32 RKADK_OSD_UpdateDisplayAttr(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_OSD_STREAM_ATTR_S *pstOsdStreamAttr);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32OsdId | Идентификатор водяного знака | Вход |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип потока | Вход |
| pstOsdStreamAttr | Информация о положении водяного знака | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_osd.h. Библиотека: librkadk.so

### 11.3 Типы данных

Модуль водяного знака предоставляет следующие основные типы: RKADK_OSD_ATTR_S — структура атрибутов водяного знака; RKADK_OSD_STREAM_ATTR_S — структура информации о его положении; RKADK_OSD_TYPE_E — тип наложения водяного знака.

#### 11.3.1 RKADK_OSD_ATTR_S

**Описание**

Определить атрибуты водяного знака.

**Определение**

```text
typedef struct {
  RKADK_U32 Width;
  RKADK_U32 Height;
  RKADK_VOID *pData;
  RKADK_FORMAT_E Format;
  RKADK_OSD_TYPE_E enOsdType;
} RKADK_OSD_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| Ширина | Ширина водяного знака |
| Высота | Высота водяного знака |
| pData | Содержимое водяного знака |
| Формат | Формат водяного знака |
| enOsdType | Тип наложения водяного знака |

**Связанные типы данных и интерфейсы**

RKADK_OSD_ATTR_S RKADK_OSD_TYPE_E

#### 11.3.2 RKADK_OSD_STREAM_ATTR_S

**Описание**

Определить информацию о положении водяного знака.

**Определение**

```text
typedef struct {
  RKADK_BOOL bEnableShow;
  RKADK_U32 Origin_X;
  RKADK_U32 Origin_Y;
} RKADK_OSD_STREAM_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| Origin_X | Начальное смещение водяного знака по X |
| Origin_Y | Начальное смещение водяного знака по Y |
| bEnableShow | Отображать ли водяной знак |

**Связанные типы данных и интерфейсы**

RKADK_OSD_STREAM_ATTR_S

### 11.4 RKADK_OSD_TYPE_E

**Описание**

Определить тип наложения водяного знака.

**Определение**

```text
typedef enum {
  RKADK_OSD_TYPE_NORMAL = 0, //use encoder do osd
  RKADK_OSD_TYPE_EXTRA,      //use rga do osd
  RKADK_OSD_TYPE_BUTT
} RKADK_OSD_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_OSD_TYPE_NORMAL | Наложение OSD кодировщиком |
| RKADK_OSD_TYPE_EXTRA | Наложение через RGA |

**Примечание**

Кодирование JPEG на RV1109/RV1126 не поддерживает наложение водяного знака OSD кодировщика; необходимо задать RKADK_OSD_TYPE_EXTRA.

## 12. Наложение UI

### 12.1 Обзор

Предоставляет наложение UI на видеоизображение для платформ с однослойным VOP, например RV1103/RV1106.

### 12.2 Справочник API

#### 12.2.1 RKADK_UI_Create

**Описание**

Инициализировать модуль наложения UI

**Синтаксис**

```c
RKADK_S32 RKADK_UI_Create(RKADK_UI_ATTR_S *pstUiAttr, RKADK_MW_PTR *ppUi);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pstUiAttr | Атрибуты UI | Вход |
| ppUi | Указатель созданной задачи UI | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_ui.h. Библиотека: librkadk.so

**Пример**

rkadk_ui_test

**См. также**

RKADK_UI_Destroy

#### 12.2.2 RKADK_UI_Destroy

**Описание**

Деинициализировать модуль наложения UI

**Синтаксис**

```c
RKADK_S32 RKADK_UI_Destroy(RKADK_MW_PTR pUi);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pUi | Указатель задачи UI | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_ui.h. Библиотека: librkadk.so

**Пример**

rkadk_ui_test

**См. также**

RKADK_UI_Create

#### 12.2.3 RKADK_UI_Update

**Описание**

Обновить данные UI.

**Синтаксис**

```c
RKADK_S32 RKADK_UI_Update(RKADK_MW_PTR pUi, RKADK_UI_FRAME_INFO *pstUiFrameInfo);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| pUi | Указатель задачи UI | Вход |
| pstUiFrameInfo | Указатель данных UI | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_ui.h. Библиотека: librkadk.so

**Пример**

rkadk_ui_test

### 12.3 Типы данных

RKADK_UI_ATTR_S: структура атрибутов UI; RKADK_UI_FRAME_INFO: структура данных UI

#### 12.3.1 RKADK_UI_ATTR_S

**Описание**

Определить структуру атрибутов UI.

**Определение**

```text
typedef struct {
  RKADK_U32 u32DispX;
  RKADK_U32 u32DispY;
  RKADK_U32 u32DispWidth;
  RKADK_U32 u32DispHeight;
  RKADK_U32 u32DispFrmRt;
  RKADK_U32 u32ImgWidth;
  RKADK_U32 u32ImgHeight;
  RKADK_U32 u32VoLay;
  RKADK_U32 u32VoDev;
  RKADK_U32 u32VoChn;
  RKADK_U32 u32Rotation; //0: 0, 1: 90, 2: 180, 3: 270
  RKADK_BOOL bMirror;
  RKADK_BOOL bFlip;
  RKADK_VO_FORMAT_E enUiVoFormat;
  RKADK_VO_INTF_TYPE_E enUiVoIntfTye;
  RKADK_VO_SPLICE_MODE_E enVoSpliceMode;
} RKADK_UI_ATTR_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32DispX | Координата x области отображения слоя |
| u32DispY | Координата y области отображения слоя |
| u32DispWidth | Ширина области отображения слоя |
| u32DispHeight | Высота области отображения слоя |
| u32ImgWidth | Ширина изображения слоя |
| u32ImgHeight | Высота изображения слоя |
| u32DispFrmRt | Частота обновления кадров |
| u32VoLay | Номер видеослоя видеовыхода |
| u32VoDev | Номер устройства вывода изображения |
| u32VoChn | Номер канала видеовыхода, диапазон: [0, VO_MAX_CHN_NUM(128)] |
| u32Rotation | Поворот, значения: [0: 0, 1: 90, 2: 180, 3: 270] |
| bMirror | Включить зеркальное отражение |
| bFlip | Включить переворот |
| enUiVoFormat | Пиксельный формат изображения |
| enUiVoIntfTye | Тип интерфейса дисплея |
| enVoSpliceMode | Режим композиции слоев |

**Связанные типы данных и интерфейсы**

RKADK_VO_FORMAT_E RKADK_VO_INTF_TYPE_E RKADK_VO_SPLICE_MODE_E RKADK_UI_Create

#### 12.3.2 RKADK_UI_FRAME_INFO

**Описание**

Определить информацию о данных UI.

**Определение**

```text
typedef struct {
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_FORMAT_E Format;
  RKADK_VOID *pMblk;
  RKADK_S32 s32MilliSec; //update timeout in millisecond, default: 1000ms
} RKADK_UI_FRAME_INFO;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| u32Width | Ширина данных UI |
| u32Height | Высота данных UI |
| Формат | Формат данных UI |
| pMblk | Указатель данных UI |
| s32MilliSec | Тайм-аут обновления UI, по умолчанию 1000ms; -1 означает блокирование |

**Связанные типы данных и интерфейсы**

RKADK_FORMAT_E RKADK_UI_Update

#### 12.3.3 RKADK_FORMAT_E

**Описание**

Определить пиксельный формат.

**Определение**

```text
typedef enum {
  RKADK_FMT_ARGB1555,                                   /* 16-bit RGB               */
  RKADK_FMT_ABGR1555,                                   /* 16-bit RGB               */
  RKADK_FMT_RGBA5551,                                   /* 16-bit RGB               */
  RKADK_FMT_BGRA5551,                                   /* 16-bit RGB               */
  RKADK_FMT_ARGB4444,                                   /* 16-bit RGB               */
  RKADK_FMT_ABGR4444,                                   /* 16-bit RGB               */
  RKADK_FMT_RGBA4444,                                   /* 16-bit RGB               */
  RKADK_FMT_BGRA4444,                                   /* 16-bit RGB               */
  RKADK_FMT_ARGB8888,                                   /* 32-bit RGB               */
  RKADK_FMT_ABGR8888,                                   /* 32-bit RGB               */
  RKADK_FMT_RGBA8888,                                   /* 32-bit RGB               */
  RKADK_FMT_BGRA8888,                                   /* 32-bit RGB               */
  RKADK_FMT_2BPP,
  RKADK_FMT_YUV420SP,
  RKADK_FMT_YUV420SP_10BIT,
  RKADK_FMT_YUV422SP,
  RKADK_FMT_BUTT,
} RKADK_FORMAT_E;
```

**Связанные типы данных и интерфейсы**

RKADK_UI_FRAME_INFO

## 13. Настройка параметров

### 13.1 Обзор

Модуль параметров тесно связан с формой продукта. Комбинируя структуры данных общих компонентов, определяют структуру для соответствующего продукта. Модуль позволяет получать и сохранять заданные параметры и восстанавливать значения по умолчанию. Для удобства редактирования параметры хранятся в ini-файлах. Путь ini по умолчанию можно задать переменной среды rkadk_default_ini_path; стандартный путь — /oem/usr/etc.

```text
export rkadk_default_ini_path=/oem/usr/etc
```

### 13.2 Справочник API

#### 13.2.1 RKADK_PARAM_Init

**Описание**

Инициализировать модуль параметров

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_Init(char *globalSetting, char **sesnorSettingArrary);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| globalSetting | Путь глобального конфигурационного ini-файла | Вход |
| sesnorSettingArrary | Путь конфигурационного ini-файла датчика | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Перед запуском любого модуля сначала вызовите RKADK_PARAM_Init для инициализации модуля параметров. Если globalSetting не задан, используется путь RKADK_PARAM_PATH. Если sesnorSettingArrary не задан, используется RKADK_PARAM_PATH_SENSOR_PREFIX. Стандартное имя конфигурации датчика — rkadk_setting_sensor_n.ini, где _n обозначает идентификатор камеры датчика; нумерация начинается с 0.

**Пример**

rkadk_record_test

**См. также**

Нет

#### 13.2.2 RKADK_PARAM_GetCamParam

**Описание**

Получить параметры камеры.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_GetCamParam(RKADK_S32 s32CamID, RKADK_PARAM_TYPE_E enParamType, RKADK_VOID *pvParam);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| s32CamID | ID камеры | Вход |
| enParamType | Тип параметра | Вход |
| pvParam | Указатель полученного параметра | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

rkadk_record_test

**См. также**

RKADK_PARAM_SetCamParam

#### 13.2.3 RKADK_PARAM_SetCamParam

**Описание**

Задать параметры камеры.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_SetCamParam(RKADK_S32 s32CamID, RKADK_PARAM_TYPE_E enParamType, const RKADK_VOID *pvParam);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| s32CamID | ID камеры | Вход |
| enParamType | Тип параметра | Вход |
| pvParam | Указатель задаваемого параметра | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

rkadk_record_test

**См. также**

RKADK_PARAM_GetCamParam

#### 13.2.4 RKADK_PARAM_GetCommParam

**Описание**

Получить общие параметры.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_GetCommParam(RKADK_PARAM_TYPE_E enParamType, RKADK_VOID *pvParam);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| enParamType | Тип параметра | Вход |
| pvParam | Указатель полученного параметра | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h

Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

rkadk_record_test

**См. также**

RKADK_PARAM_SetCommParam

#### 13.2.5 RKADK_PARAM_SetCommParam

**Описание**

Задать общие параметры.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_SetCommParam(RKADK_PARAM_TYPE_E enParamType, const RKADK_VOID *pvParam);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| enParamType | Тип параметра | Вход |
| pvParam | Указатель задаваемого параметра | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

rkadk_record_test

**См. также**

RKADK_PARAM_GetCommParam

#### 13.2.6 RKADK_PARAM_SetDefault

**Описание**

Восстановить конфигурацию по умолчанию.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_SetDefault(RKADK_VOID);
```

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

#### 13.2.7 RKADK_PARAM_GetResolution

**Описание**

Преобразовать RKADK_PARAM_RES_E в конкретное разрешение.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_GetResolution(RKADK_PARAM_RES_E type, RKADK_U32 *width, RKADK_U32 *height);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| type | Тип разрешения | Вход |
| width | Ширина после преобразования разрешения | Выход |
| height | Высота после преобразования разрешения | Выход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Другое значение | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

Нет

**См. также**

RKADK_PARAM_GetResType

#### 13.2.8 RKADK_PARAM_GetResType

**Описание**

Преобразовать разрешение в RKADK_PARAM_RES_E.

**Синтаксис**

```c
RKADK_PARAM_RES_E RKADK_PARAM_GetResType(RKADK_U32 width, RKADK_U32 height);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| width | Ширина изображения | Вход |
| height | Высота изображения | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| Соответствующее значение RKADK_PARAM_RES_E | Успех |
| RKADK_RES_BUTT | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

Нет

**См. также**

RKADK_PARAM_GetResolution

#### 13.2.9 RKADK_PARAM_GetVencChnId

**Описание**

Получить номер канала VENC для Record, Photo и Stream.

**Синтаксис**

```c
RKADK_S32 RKADK_PARAM_GetVencChnId(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType);
```

**Параметры**

| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| u32CamId | ID камеры | Вход |
| enStrmType | Тип потока | Вход |

**Возвращаемое значение**

| Возвращаемое значение | Описание |
| --- | --- |
| Соответствующий номер канала VENC | Успех |
| -1 | Ошибка |

**Требования**

Заголовочный файл: rkadk_param.h. Библиотека: librkadk.so

**Примечание**

Этот интерфейс можно вызывать только после инициализации модуля параметров через RKADK_PARAM_Init.

**Пример**

Нет

**См. также**

Нет

### 13.3 Типы данных

Модуль параметров предоставляет следующие основные типы: RKADK_DEFPARAM_PATH — путь глобального ini по умолчанию; RKADK_DEFPARAM_PATH_SENSOR_PREFIX — путь ini датчика по умолчанию; RKADK_PARAM_PATH — путь глобального ini; RKADK_PARAM_PATH_SENSOR_PREFIX — путь ini датчика; RKADK_PARAM_TYPE_E — перечисление типов параметров; RKADK_PARAM_RES_E — перечисление разрешений; RKADK_STREAM_TYPE_E — перечисление типов потоков данных; RKADK_PARAM_CODEC_CFG_S — структура настройки типа кодирования; RKADK_PARAM_BITRATE_S — структура настройки битрейта; RKADK_PARAM_REC_TIME_S — структура настройки длительности записи; RKADK_PARAM_GOP_S — структура настройки GOP VENC; RKADK_VQE_MODE_E — перечисление улучшений качества входного аудио; RKADK_MIC_TYPE_E — перечисление режимов каналов аудиоустройства.

#### 13.3.1 RKADK_DEFPARAM_PATH

**Описание**

Путь глобального ini по умолчанию: файл хранит общую конфигурацию датчиков и используется для восстановления настроек по умолчанию.

**Определение**

```text
#define RKADK_DEFPARAM_PATH "/oem/usr/etc/rkadk_defsetting.ini"
```

#### 13.3.2 RKADK_DEFPARAM_PATH_SENSOR_PREFIX

**Описание**

Путь ini датчика по умолчанию: файл хранит индивидуальную конфигурацию каждого датчика и используется для восстановления настроек по умолчанию.

**Определение**

```text
#define RKADK_DEFPARAM_PATH_SENSOR_PREFIX "/oem/usr/etc/rkadk_defsetting_sensor"
```

**Примечание**

Стандартное имя файла конфигурации датчика — rkadk_defsetting_sensor_n.ini; _n — идентификатор камеры датчика, нумерация начинается с 0.

#### 13.3.3 RKADK_PARAM_PATH

**Описание**

Путь глобального ini-файла, содержащего общую конфигурацию всех датчиков.

**Определение**

```text
#define RKADK_PARAM_PATH "/data/rkadk/rkadk_setting.ini"
```

#### 13.3.4 RKADK_PARAM_PATH_SENSOR_PREFIX

**Описание**

Путь ini-файла датчика, содержащего его индивидуальную конфигурацию. Используется для сохранения новых настроек при изменении разрешения записи, типа Codec и других операциях.

**Определение**

```text
#define RKADK_PARAM_PATH_SENSOR_PREFIX "/data/rkadk/rkadk_setting_sensor"
```

**Примечание**

Стандартное имя файла конфигурации датчика — rkadk_setting_sensor_n.ini; _n — идентификатор камеры датчика, нумерация начинается с 0.

#### 13.3.5 RKADK_PARAM_TYPE_E

**Описание**

Определить перечисление типов параметров.

**Определение**

```text
typedef enum {
  /* Cam Dependent Param */
  RKADK_PARAM_TYPE_FPS,             /* framerate */
  RKADK_PARAM_TYPE_GOP,             /* gop */
  RKADK_PARAM_TYPE_RES,             /* specify RKADK_PARAM_RES_E(record) */
  RKADK_PARAM_TYPE_PHOTO_RES,       /* specify RKADK_PARAM_RES_E(photo) */
  RKADK_PARAM_TYPE_STREAM_RES,      /* specify RKADK_PARAM_RES_CFG_S(record_main,
record_sub, photo, stream, live) */
  RKADK_PARAM_TYPE_CODEC_TYPE,      /* specify RKADK_PARAM_CODEC_CFG_S(record) */
  RKADK_PARAM_TYPE_BITRATE,         /* encode bitrate,specify RKADK_PARAM_BITRATE_S */
  RKADK_PARAM_TYPE_FLIP,            /* bool */
  RKADK_PARAM_TYPE_MIRROR,          /* bool */
  RKADK_PARAM_TYPE_LDC,             /* ldc level [0,255] */
  RKADK_PARAM_TYPE_ANTIFOG,         /* antifog value, [0,10] */
  RKADK_PARAM_TYPE_WDR,             /* wdr level, [0,10] */
  RKADK_PARAM_TYPE_HDR,             /* 0: normal, 1: HDR2, 2: HDR3, [0,2] */
  RKADK_PARAM_TYPE_RECORD_TYPE,     /* specify RKADK_REC_TYPE_E */
  RKADK_PARAM_TYPE_RECORD_TIME,     /* specify RKADK_PARAM_REC_TIME_S, record time(s) */
  RKADK_PARAM_TYPE_PRE_RECORD_TIME, /* pre record time, unit in second(s) */
  RKADK_PARAM_TYPE_PRE_RECORD_MODE, /* pre record mode, specify MUXER_PRE_RECORD_MODE_E */
  RKADK_PARAM_TYPE_SPLITTIME,       /* specify RKADK_PARAM_REC_TIME_S, manual splite time(s)
*/
  RKADK_PARAM_TYPE_FILE_CNT,        /* record file count, maximum RECORD_FILE_NUM_MAX */
  RKADK_PARAM_TYPE_LAPSE_INTERVAL,  /* specify RKADK_PARAM_REC_TIME_S, lapse interval(s) */
  RKADK_PARAM_TYPE_LAPSE_MULTIPLE,  /* lapse multiple */
  RKADK_PARAM_TYPE_JPEG_SLICE,      /* enable/disable JPEG slice */
  RKADK_PARAM_TYPE_SLICE_HEIGHT,    /* set JPEG slice height */
  RKADK_PARAM_TYPE_INPUT_FMT,       /* set vi input format */
  RKADK_PARAM_TYPE_INPUT_BUFCNT,    /* set vi input buffer count */
  RKADK_PARAM_TYPE_ENABLE_AUDIO,    /* enable record audio */
  RKADK_PARAM_TYPE_MUTE,            /* mute specifies sensor, bool */

  /* COMM Dependent Param */
  RKADK_PARAM_TYPE_REC_MUTE,        /* record audio mute, bool */
  RKADK_PARAM_TYPE_VOLUME,          /* speaker volume, [0,100] */
  RKADK_PARAM_TYPE_MIC_VOLUME,      /* mic volume, [0,100] */
  RKADK_PARAM_TYPE_BUTT
} RKADK_PARAM_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_PARAM_TYPE_FPS | Частота кадров |
| RKADK_PARAM_TYPE_GOP | Интервал I-кадров, RKADK_PARAM_GOP_S |
| RKADK_PARAM_TYPE_RES | Разрешение видео, RKADK_PARAM_RES_E |
| RKADK_PARAM_TYPE_PHOTO_RES | Разрешение фотографии, RKADK_PARAM_RES_E |
| RKADK_PARAM_TYPE_STREAM_RES | Задает разрешение потока, указанного перечислением RKADK_STREAM_TYPE_E |
| RKADK_PARAM_TYPE_CODEC_TYPE | Тип кодирования видео, RKADK_PARAM_CODEC_CFG_S |
| RKADK_PARAM_TYPE_BITRATE | Битрейт, RKADK_PARAM_BITRATE_S |
| RKADK_PARAM_TYPE_FLIP | Переворот вверх-вниз |
| RKADK_PARAM_TYPE_MIRROR | Зеркальное отражение слева направо |
| RKADK_PARAM_TYPE_LDC | Коррекция искажения [0,255] |
| RKADK_PARAM_TYPE_ANTIFOG | Удаление дымки [0,10] |
| RKADK_PARAM_TYPE_WDR | Широкий динамический диапазон [0,10] |
| RKADK_PARAM_TYPE_HDR | Расширенный динамический диапазон HDR [0,10] |
| RKADK_PARAM_TYPE_RECORD_TYPE | Тип записи, RKADK_REC_TYPE_E |
| RKADK_PARAM_TYPE_RECORD_TIME | Длительность записи; основной и дополнительный потоки могут иметь разные длительности, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_PRE_RECORD_TIME | Длительность предварительной записи |
| RKADK_PARAM_TYPE_PRE_RECORD_MODE | Режим предварительной записи: 0 - выключена, 1 - при ручном разделении, 2 - первый файл, 3 - все файлы |
| RKADK_PARAM_TYPE_SPLITTIME | Длительность записи при ручном разделении; основной и дополнительный потоки могут иметь разные длительности, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_FILE_CNT | Число одновременно записываемых файлов, максимум 2 |
| RKADK_PARAM_TYPE_LAPSE_INTERVAL | Длительность интервальной записи; основной и дополнительный потоки могут иметь разные длительности, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_LAPSE_MULTIPLE | Кратность отношения длительности воспроизведения интервального файла к реальному времени снятого содержимого |

| Имя поля | Описание |
| --- | --- |
| RKADK_PARAM_TYPE_JPEG_SLICE | Включение JPEG Slice |
| RKADK_PARAM_TYPE_SLICE_HEIGHT | Высота сегмента JPEG Slice |
| RKADK_PARAM_TYPE_INPUT_FMT | Входной формат VI |
| RKADK_PARAM_TYPE_INPUT_BUFCNT | Число буферов VI |
| RKADK_PARAM_TYPE_ENABLE_AUDIO | Включение канала аудиозаписи указанного сенсора |
| RKADK_PARAM_TYPE_MUTE | Отключение звука записи указанного сенсора |
| RKADK_PARAM_TYPE_REC_MUTE | Отключение звука всех записей |
| RKADK_PARAM_TYPE_VOLUME | Громкость динамика [0,100] |
| RKADK_PARAM_TYPE_MIC_VOLUME | Громкость микрофона [0,100] |

**Примечание**

Для аппаратных настроек камеры, например удаления тумана, WDR и HDR, помимо изменения ini через RKADK_PARAM_SetCamParam вызовите соответствующий интерфейс ISP, чтобы настройка вступила в силу. RKADK_PARAM_TYPE_LAPSE_MULTIPLE: отношение длительности воспроизведения интервального файла к реальному времени связано с частотой кадров. Например, при обычной записи 30 fps и интервальной 1 fps кратность равна 30. При смене разрешения RV1126/RV1109, если разрешение фото не равно максимальному для сенсора, оно должно совпадать с разрешением основного потока Record. RKADK_PARAM_TYPE_REC_MUTE используйте вместе с RKADK_RECORD_GetAencChn и RK_MPI_AENC_SetMute.

**Связанные типы данных и интерфейсы**

RKADK_PARAM_GetCamParam RKADK_PARAM_SetCamParam RKADK_PARAM_GetCommParam RKADK_PARAM_SetCommParam

#### 13.3.6 RKADK_PARAM_RES_E

**Описание**

Определяет перечисление событий воспроизведения.

**Определение**

```text
typedef enum {
  RKADK_RES_480P = 0, /* 848*480 */
  RKADK_RES_720P,     /* 1280*720 */
  RKADK_RES_1080P,    /* 1920*1080 */
  RKADK_RES_1296P,    /* 2304*1296 */
  RKADK_RES_1440P,    /* 2560*1440 */
  RKADK_RES_1520P,    /* 2688*1520 */
  RKADK_RES_1600P,    /* 2560*1600 */
  RKADK_RES_1620P,    /* 2880*1616, height 8 alignment */
  RKADK_RES_1944P,    /* 2592*1944 */
  RKADK_RES_2160P,    /* 3840*2160 */
  RKADK_RES_3456P,    /* 4608*3456 */
  RKADK_RES_4000P,    /* 6000*4000 */
  RKADK_RES_4480P,    /* 6720*4480 */
  RKADK_RES_4275P,    /* 7600*4275 */
  RKADK_RES_4320P,    /* 7680*4320 */
  RKADK_RES_3672P,    /* 6528*3672 */
  RKADK_RES_BUTT,
} RKADK_PARAM_RES_E;
```

**Связанные типы данных и интерфейсы**

RKADK_PARAM_GetResolution RKADK_PARAM_GetResType

#### 13.3.7 RKADK_STREAM_TYPE_E

**Описание**

Перечисление типов потоков.

**Определение**

```text
typedef enum {
  RKADK_STREAM_TYPE_SENSOR,
  RKADK_STREAM_TYPE_VIDEO_MAIN,
  RKADK_STREAM_TYPE_VIDEO_SUB,
  RKADK_STREAM_TYPE_SNAP,
  RKADK_STREAM_TYPE_PREVIEW,
  RKADK_STREAM_TYPE_LIVE,
  RKADK_STREAM_TYPE_DISP,
  RKADK_STREAM_TYPE_BUTT
} RKADK_STREAM_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_STREAM_TYPE_VIDEO_MAIN | Основной видеопоток |
| RKADK_STREAM_TYPE_VIDEO_SUB | Дополнительный видеопоток |
| RKADK_STREAM_TYPE_SNAP | Фотосъёмка |
| RKADK_STREAM_TYPE_PREVIEW | Удалённый предварительный просмотр |
| RKADK_STREAM_TYPE_LIVE | Прямая трансляция |
| RKADK_STREAM_TYPE_DISP | Локальный предварительный просмотр |
| RKADK_STREAM_TYPE_SENSOR | Сенсор |

**Связанные типы данных и интерфейсы**

RKADK_PARAM_GetVencChnId

#### 13.3.8 RKADK_PARAM_CODEC_CFG_S

**Описание**

Структура настройки типа кодирования.

**Определение**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_CODEC_TYPE_E enCodecType;
} RKADK_PARAM_CODEC_CFG_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enStreamType | Тип потока |
| enCodecType | Тип кодирования |

**Связанные типы данных и интерфейсы**

RKADK_CODEC_TYPE_E RKADK_STREAM_TYPE_E

#### 13.3.9 RKADK_PARAM_BITRATE_S

**Описание**

Структура настройки битрейта.

**Определение**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 u32Bitrate;
} RKADK_PARAM_BITRATE_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enStreamType | Тип потока |
| u32Bitrate | Битрейт |

**Связанные типы данных и интерфейсы**

RKADK_STREAM_TYPE_E

#### 13.3.10 RKADK_PARAM_REC_TIME_S

**Описание**

Структура настройки длительности записи.

**Определение**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 time;
} RKADK_PARAM_REC_TIME_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enStreamType | Тип потока |
| time | Длительность записи |

**Связанные типы данных и интерфейсы**

RKADK_STREAM_TYPE_E

#### 13.3.11 RKADK_PARAM_GOP_S

**Описание**

Структура настройки интервала I-кадров VENC.

**Определение**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 u32Gop;
} RKADK_PARAM_GOP_S;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| enStreamType | Тип потока |
| u32Gop | Интервал I-кадров |

**Связанные типы данных и интерфейсы**

RKADK_STREAM_TYPE_E

#### 13.3.12 RKADK_VQE_MODE_E

**Описание**

Перечисление улучшений качества входного аудио

**Определение**

```text
typedef enum {
  RKADK_VQE_MODE_AI_TALK = 0,
  RKADK_VQE_MODE_AI_RECORD,
  RKADK_VQE_MODE_BUTT
} RKADK_VQE_MODE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_VQE_MODE_AI_TALK | Включить AEC, ANR, AGC |
| RKADK_VQE_MODE_AI_RECORD | Включить ANR |

#### 13.3.13 RKADK_MIC_TYPE_E

**Описание**

Тип режима каналов аудиоустройства

**Определение**

```text
typedef enum {
  RKADK_MIC_TYPE_LEFT = 0,
  RKADK_MIC_TYPE_RIGHT,
  RKADK_MIC_TYPE_BOTH,
  RKADK_MIC_TYPE_BUTT
} RKADK_MIC_TYPE_E;
```

**Поля**

| Имя поля | Описание |
| --- | --- |
| RKADK_MIC_TYPE_LEFT | Звук левого канала |
| RKADK_MIC_TYPE_RIGHT | Звук правого канала |
| RKADK_MIC_TYPE_BOTH | Dual-channel |

### 13.4 Введение в INI-файлы

#### 13.4.1 Глобальный INI-файл конфигурации

```text
[version]
version                        = 2.2.0      /* Version */

/* common parameters */
[common]
sensor_count                   = 2          /* Number of Sensors*/
rec_mute                       = FALSE      /* Whether to enable video mute */
speaker_volume                 = 80         /* Speaker volume,[0,100] */
mic_volume                     = 80         /* Microphone volume,[0,100] */
vpss_devcie                    = 1          /* VPSS hardware device type, 0:GPU, 1:RGA */

/* Audio parameters */
[audio]
ai_audio_node                  = hw:0,0     /* AI device node */
ao_audio_node                  = hw:0,0     /* AO device node */
ai_depth                       = 1          /* AI depth */
bit_width                      = 1          /* Sampling accuracy */
channels                       = 1          /* Channels */
mic_type                       = 0          /* Audio device channel mode, specifically
RKADK_MIC_TYPE_E, 0: left channel, 1: right channel, 2: dual channel*/
samplerate                     = 16000      /* Sample rate   */
samples_per_frame              = 576        /* Number of samples per frame*/
bitrate                        = 64000      /* Bitrate */
vqe_mode                       = 1          /* Configure audio input sound quality
enhancement, specifically RKADK_VQE_MODE_E*/
vqe_config_path                = /oem/usr/share/vqefiles/config_aivqe.json /*vqe
configuration file path */
codec_type                     = 8          /* Record and Live Audio encoding types, adapted
to MP3 by default, specifically RKADK_CODEC_TYPE_E */
```

#### 13.4.2 INI-файлы конфигурации сенсоров

```text
[sensor]
used_isp                       = TRUE       /* Has the Sensor used ISP? */
max_width                      = 2688       /* Max width */
max_height                     = 1520       /* Max height    */
framerate                      = 30         /* Framerate*/
flip                           = FALSE      /* Flip up and down*/
mirror                         = FALSE      /* Mirror left and right */
ldc                            = 0          /* Lens distortion correction, [0,255] */
wdr                            = 0          /* Wide dynamic range, [0,10] */
hdr                            = 0          /* High dynamic range imaging, [0,10] */
antifog                        = 0          /* Remove fog, [0,10] */
enable_wrap                    = FALSE      /* Whether the VI enables wrap */
wrap_buf_line                  = 1620       /* The line height of the wrap buffer */

/* VI channel configuration parameters */
[vi.0]
chn_id                         = 0                  /* Channel ID */
device_name                    = rkispp_m_bypass    /* Video node path*/
buf_cnt                        = 4                  /* The total number of buffer blocks in
the output channel */
depth                          = 0                  /* VI depth depth  */
width                          = 2688               /* Video width   */
height                         = 1520               /* Video height  */
pix_fmt                        = FBC0               /* VI output format*/
module                         = RECORD_MAIN|PHOTO  /* The usage module of this VI,Options:
NONE/RECORD_MAIN/RECORD_SUB/PREVIEW/PHOTO/LIVE/DISP */

[vi.1]
chn_id                         = 1
device_name                    = rkispp_scale0
buf_cnt                        = 4
depth                          = 0
width                          = 0
height                         = 0
pix_fmt                        = NV12
module                         = RECORD_MAIN|PHOTO

[vi.2]
chn_id                         = 2
device_name                    = rkispp_scale1
buf_cnt                        = 2
depth                          = 0
width                          = 0
height                         = 0
pix_fmt                        = NV12
module                         = NONE

[vi.3]
chn_id                         = 3
device_name                    = rkispp_scale2
buf_cnt                        = 4
depth                          = 0
width                          = 848
height                         = 480
pix_fmt                        = NV12
module                         = RECORD_SUB|PREVIEW|LIVE|DISP

/* Record parameters */
[record]
record_type                    = 0          /* Recording type, specifically
RKADK_REC_TYPE_E*/
file_type                      = 0          /* Video file type, specifically
RKADK_MUXER_FILE_TYPE_E */
pre_record_time                = 0          /* Pre-recording duration */
pre_record_mode                = 0          /* Pre-recorded mode */
lapse_multiple                 = 30         /* The multiple relationship between the
playback duration of a time-lapse video file and the actual screen content duration */
file_num                       = 1          /* Number of files recorded simultaneously,
maximum 2 */
switch_res                     = TRUE       /* Whether to switch resolution */
enable_audio                   = TRUE       /* Whether to enable recording */

/* Record 0 VENC parameters of Main stream  */
[record.0]
record_time                    = 60         /* Recording duration*/
splite_time                    = 60         /* Manually divide video duration */
lapse_interval                 = 60         /* Time-lapse recording duration */
width                          = 2688       /* Video width */
height                         = 1520       /* Video height */
bufsize                        = 10379776   /* The buffer size of the code stream */
framerate                      = 30         /* Venc framerate */
bitrate                        = 8294400    /* Bitrate */
gop                            = 30         /* I frame interval */
profile                        = 100        /* Encoder profile */
codec_type                     = 0          /* Encoding type, specificallyRKADK_CODEC_TYPE_E
*/
venc_chn                       = 0          /* VENC channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = CBR        /* Encoding protocol type, supports CBR, VBR,
AVBR*/
/* The following are advanced encoding parameters. If you need to adjust the encoder effect,
please add them according to your actual needs. For specific instructions, please refer to
the Rockit and MPP documents */
min_qp                         = 10
max_qp                         = 51
min_i_qp                       = 10
max_i_qp                       = 51
frame_min_i_qp                 = 25
frame_min_qp                   = 26
frame_max_i_qp                 = 45
frame_max_qp                   = 48
full_range                     = 1
scalinglist                    = 1
hier_qp_delta                  = -2,0,0,0
hier_frame_num                 = 3,0,0,0
enable_motion_deblur           = 1
motion_deblur_strength         = 0
enable_motion_static_switch    = 0
enable_debreath_effect         = 0
debreath_effect_strength       = 16
thrd_i                         = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
thrd_p                         = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
aq_step_i                      = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
aq_step_p                      = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
qbias_enable                   = 1
qbias_i                        = 171
qbias_p                        = 85
flt_str_i                      = 2
flt_str_p                      = 2
cu_dqp                         = 1
anti_ring                      = 3
anti_line                      = 3
lambda                         = 4
lambda_i                       = 7
atf_str                        = 2
tmvp_en                        = 0
static_frm_num                 = 5
madp16_th                      = 15
skip16_wgt                     = 6
skip32_wgt                     = 6
qbias_arr                     = 3,6,13,144,144,144,144,3,6,13,144,144,171,144,85,85,85,85
aq_rnge_arr                    = 8,8,12,12,12,8,8,12,12,12
lgt_chg_lvl                    = 0
sao_str_i                      = 0
sao_str_p                      = 0
speed                          = 1

/* VENC parameter of the substream Record 1, when file_num = 1, rec.1 does not need to be
configured*/
[record.1]
record_time                    = 60
splite_time                    = 60
lapse_interval                 = 60
width                          = 848
height                         = 480
bufsize                        = 2367488
bitrate                        = 407040
framerate                      = 30
gop                            = 30
profile                        = 100
codec_type                     = 0
venc_chn                       = 1
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = VBR

/* Photo VENC parameters */
[photo]
image_width                    = 3840       /* Image width */
image_height                   = 2160       /* Image_height  */
venc_chn                       = 2          /* VENC channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
enable_combo                   = FALSE      /* Enable the Combo attribute of the encoding
channel */
combo_venc_chn                 = 0          /* Combo data source channel */
qfactor                        = 50         /* For the detailed meaning, please refer to the
RFC2435 protocol. The system default value is 70 and the value range is [1, 99] */
switch_res                     = TRUE       /* Whether to switch resolution */
jpeg_slice                     = FALSE      /* Whether to enable JPEG Slice */
slice_height                   = 0          /* The height of JPEG Slice must not be greater
than max_slice_height*/
max_slice_width                = 0          /* Maximum width of JPEG Slice */
max_slice_height               = 0          /* Maximum height of JPEG Slice*/

/* Remote preview of VENC parameters */
[preview]
width                          = 848        /* Video width */
height                         = 480        /* Video height */
bufsize                        = 2367488
bitrate                        = 407040     /* Bitrate */
framerate                      = 30         /* Venc framerate  */
gop                            = 30         /* I frame interval */
profile                        = 100        /* Encoder profile */
codec_type                     = 0          /* Coding type, specifically RKADK_CODEC_TYPE_E
*/
venc_chn                       = 1          /* Venc channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID */
vpss_chn                       = 0          /* VPSS  channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = VBR        /* Encoding protocol type, supports CBR, VBR,
AVBR */

/* Live VENC parameters */
[live]
width                          = 1280
height                         = 720
bufsize                        = 2367488
bitrate                        = 4194304
framerate                      = 30
gop                            = 30
profile                        = 100
codec_type                     = 0
venc_chn                       = 1
vpss_grp                       = 0
vpss_chn                       = 0
post_aiisp                     = FALSE
rc_mode                        = VBR

/* Local preview parameters */
[display]
x                              = 0                /* Display X coordinate */
y                              = 0                /* Display y coordinate */
width                          = 720              /* Display the width  */
height                         = 1280             /* Display the height */
rotaion                        = 90               /* Degrees of rotation, Options: 0:0,
1:90, 2:180, 3:270 */
vpss_grp                       = 0                /* VPSS GROUP ID */
vpss_chn                       = 0                /* VPSS channel ID */
img_type                       = RGB888           /* Video output format */
vo_device                      = 0                /* Display output device number */
vo_layer                       = 0                /* Video output video layer number */
vo_chn                         = 0                /* VO channel ID */
frame_rate                     = 30               /* VO frame rate */
intf_type                      = default          /* Show interface type, Options:  MIPI,
HDMI, EDP, VGA, DP, HDMI_EDP, LCD, default*/
splice_mode                    = RGA              /* Splice mode, Options: RGA, GPU, BYPASS
*/
```

#### 13.4.3 Указания по настройке INI

Путь к INI по умолчанию задаётся переменной окружения, например: export rkadk_default_ini_path=/oem/usr/etc. Путь также задаётся через RKADK_PARAM_Init. Версии в rkadk_defsetting.ini и rkadk_setting.ini должны совпадать; иначе проверка версии не проходит и используется INI по умолчанию. При обновлении SDK набор ini-параметров может изменяться. sensor_count означает фактическое число сенсоров и не может превышать RKADK_MAX_SENSOR_CNT; в источнике сообщается об отладке трёх сенсоров. Если сенсор использует ISP, задайте used_isp=TRUE: масштабирование задаётся разрешением узла ISP, канал VPSS не требуется, vpss_grp и vpss_chn равны 0. Без ISP задайте used_isp=FALSE и соответствующие vpss_grp/vpss_chn; масштабирование выполняет VPSS. При одинаковом разрешении записи, удалённого просмотра и трансляции рекомендуется совместно использовать VENC с одинаковыми параметрами для экономии полосы памяти и памяти. При совместном использовании VENC или одинаковом его разрешении рекомендуется также совместно использовать каналы VPSS для экономии полосы памяти. Рекомендуется gop=framerate, чтобы получать один I-кадр в секунду.

## 14. Примеры

Ниже приведены функциональные примеры. Перед запуском убедитесь, что используемые узлы не заняты другими приложениями, например mediaserver или ispserver. Параметры по умолчанию рассчитаны на RK EVB. Для другого оборудования задайте соответствующие параметры команд или измените код.

### 14.1 rkadk_record_test

**Описание**

Проверка записи. Исходный код: rkadk/examples/rkadk_record_test.c. Быстрый запуск:

```text
./rkadk_record_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -m | Проверка двух сенсоров: 0 - ISP-сенсор, 1 - все ISP-сенсоры, 2 - ISP+AHD-сенсоры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -k | Разделять ли видеофайл по I-кадрам | Без разделения |
| -P | Включить запись «картинка в картинке» | Выключено |
| -c | Число буферов AVS | 2 |
| -t | Задержка получения миниатюры при включённом File Cache, мс | 3000ms |
| -e | Включить EIS | Выключено |

### 14.2 rkadk_photo_test

**Описание**

Проверка фотосъёмки. Исходный код: /rkadk/examples/rkadk_photo_test.c. Быстрый запуск:

```text
./rkadk_photo_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -t | Тип данных полученного JPG | NV12 |
| -m | Проверка двух сенсоров: 0 - ISP-сенсор, 1 - все ISP-сенсоры, 2 - ISP+AHD-сенсоры | 0 |
| -o | Путь к файлу OSD | NULL |
| -W | Ширина OSD | 0 |
| -H | Высота OSD | 0 |

### 14.3 rkadk_stream_test

**Описание**

Получить аудиопоток, закодировать и записать в файл; получить видеопоток, закодировать и записать в файл. Исходный код: /rkadk/examples/rkadk_stream_test.c. Быстрый запуск:

```text
./rkadk_stream_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -M | Режим проверки: audio, video | audio |
| -e | Тип кодирования | pcm |
| -o | Путь к выходному файлу | /tmp/ai.pcm |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -m | Проверка двух сенсоров: 0 - ISP-сенсор, 1 - все ISP-сенсоры, 2 - ISP+AHD-сенсоры | 0 |

### 14.4 rkadk_player_test

**Описание**

Проверка воспроизведения локального файла. Исходный код: /rkadk/examples/rkadk_player_test.c. Быстрый запуск:

```text
./rkadk_player_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -i | Путь к воспроизводимому файлу | /etc/bsa_file/8k8bpsMono.wav |
| -x | Начальная координата X области видео | 0 |
| -y | Начальная координата Y области видео | 0 |
| -W | Ширина области видео | Физическая ширина экрана |
| -H | Высота области видео | Физическая высота экрана |
| -r | Угол поворота видео: 0, 90, 180, 270 | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -m | Зеркальное отражение видео | Выключено (disable) |
| -f | Переворот видео | Выключено (disable) |
| -a | Воспроизведение звука: 0 - выключено, 1 - включено | 1 |
| -v | Включить воспроизведение видео | Выключено (disable) |
| -s | Способ композиции слоёв: 0 - RGA, 1 - GPU, 2 - ByPass | 0 |
| -P | Формат пикселей экрана: 0 - RGB888, 1 - NV12, 2 - RGB565 | 0 |
| -I | Интерфейс дисплея: 0 - DEFAILT, 1 - MIPI, 2 - LCD | 1106: 0; другие платформы: 1 |
| -F | Частота обновления кадров | 30 |
| -t | Протокол передачи RTSP: 0 - udp, 1 - tcp | 0 |
| -b | Чёрный экран после воспроизведения | Выключено (disable) |
| -T | Тайм-аут выхода для операций ввода-вывода сокета RTSP, мс | Блокировка без тайм-аута |
| -l | ID слоя VO | 0 |
| -O | Число выходных буферов VDEC | 3 [1, 8] |
| -D | Включить стороннюю библиотеку демультиплексирования | Выключено (disable) |

**Примечание**

При воспроизведении видеофайлов параметр -v обязателен для включения видео. Зеркальное отражение/переворот нельзя одновременно использовать с поворотом.

### 14.5 rkadk_thumb_test

Проверка извлечения миниатюры. Исходный код: /rkadk/examples/rkadk_thumb_test.c. Быстрый запуск:

```text
Get MP4 thumbnail: ./rkadk_thumb_test -i test_file.mp4
Get JPG thumbnail: ./rkadk_thumb_test -i test_file.jpg -f jpg -t MPF1
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -i | Путь к тестовому файлу | Нет |
| -f | Формат файла: mp4, jpg | mp4 |
| -t | Типы миниатюр JPG: DCF, MPF1, MPF2 | DCF |
| -T | Тип выходной миниатюры: JPG, NV12, RGB565, RGB888 | JPG |
| -W | Ширина миниатюры | Из ini |
| -H | Высота миниатюры | Из ini |

### 14.6 rkadk_rtsp_test

Проверка трансляции RTSP. Исходный код: /rkadk/examples/rkadk_rtsp_test.c. Быстрый запуск:

```text
1. Start wifi on the board end
2. Run the board end./rkadk_rtsp_test
3. Open VLC on PC -> Media -> Open network streaming -> Enter the network URL: rtsp://board
end ip address/live/main_stream
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -o | Путь к файлу OSD | /userdata/rkadk_ARGB8888 |

### 14.7 rkadk_rtmp_test

Проверка трансляции RTMP. Исходный код: /rkadk/examples/rkadk_rtmp_test.c. Быстрый запуск:

```text
1. Start wifi on the board
2. Run ./rkadk_rtmp_test on the board
3. Open VLC on the PC -> Media -> Open network streaming -> Enter the network URL:
rtmp://The ip address of the board::1935/live/substream
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |

### 14.8 rkadk_storage_test

**Описание**

Проверка модуля хранения. Исходный код: /rkadk/examples/rkadk_storage_test.c. Быстрый запуск:

```text
./rkadk_storage_test
```

Параметры: отсутствуют

**Примечание**

Тест создаёт MP4-файл, заполненный нулями, для проверки автоматического удаления, получения списка файлов и других интерфейсов. Файл не содержит реальных медиаданных и не воспроизводится.

### 14.9 rkadk_disp_test

Проверка локального просмотра. Исходный код: /rkadk/examples/rkadk_disp_test.c. Быстрый запуск:

```text
./rkadk_disp_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |

### 14.10 rkadk_ui_test

Проверка наложения UI. Исходный код: /rkadk/examples/rkadk_ui_test.c. Быстрый запуск:

```text
./rkadk_ui_test
```

Параметр

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -I | ID камеры | 0 |
| -p | Путь к каталогу INI-конфигурации | /data/rkadk |
| -W | Ширина области отображения | 720 |
| -H | Высота области отображения | 1280 |
| -f | Формат пикселей экрана: 0 - RGB888, 1 - NV12, 2 - RGB565, 3 - RGB444 | 0 |

### 14.11 rkadk_muxer_test

Проверка мультиплексора. Исходный код: /rkadk/examples/rkadk_muxer_test.c. Быстрый запуск:

```text
./rkadk_muxer_test
```

Параметры

| Параметры | Описание | По умолчанию |
| --- | --- | --- |
| -a | Включить встроенную функцию ISP. Без аргумента используется значение по умолчанию; аргумент задаёт путь к каталогу с файлом aiq. | /etc/iqfiles |
| -W | Ширина видео | 1920 |
| -H | Высота видео | 1080 |
| -f | Частота кадров | 30 |
| -C | Тип кодека: 0 - H264, 1 - H265 | H264 |
| -d | Узел аудиоустройства | hw:0,0 |
| -k | Разделение по ключевым кадрам | Выключено |
| -c | Число потоков: 1 - основной, 2 - основной и дополнительный | 1 |
| -t | Обрабатывать сторонний поток | Включено |
| -A | Включить звук | Включено |
| -p | Длительность предварительной записи, с | 0 |
| -I | Файл стороннего I-кадра | null |
| -P | Файл стороннего P-кадра | null |
| -n | Число записываемых потоков | -1 |

{% endraw %}
