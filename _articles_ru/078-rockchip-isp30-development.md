---
title: "Разработка Rockchip ISP30: полный справочник RkAiq для RK3588 и отладка"
description: "Полный материал ISP30 V1.2.5: управление RkAiq, AE/AWB/AF, обработка изображения, настройка, отладка и форматы RK-RAW с исходным кодом и параметрами."
translation_key: "078-rockchip-isp30-development"
slug: "078-rockchip-isp30-development"
lang: "ru"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "RkAiq", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip RK3588 ISP30 RkAiq API"
excerpt: "Полный материал ISP30 V1.2.5: управление RkAiq, AE/AWB/AF, обработка изображения, настройка, отладка и форматы RK-RAW с исходным кодом и параметрами."
---

{% raw %}

# Разработка Rockchip ISP30: полный справочник RkAiq для RK3588 и отладка

Это справочный материал платформы: полностью сохранена техническая часть 436-страничного английского оригинала V1.2.5 (стр.16–436), включая форматы RK-RAW и заключительные главы кодов ошибок и сокращений. Соответствующий китайский PDF не предоставлен; китайская и русская статьи — полные переводы этой версии. Все 42 технических рисунка взяты из английского PDF, в том числе с китайскими подписями, уже присутствующими в оригинале. Десять таблиц форматов и расположения битов RAW дополнительно восстановлены в редактируемом виде. Изображения целых страниц не заменяют текст.

В исходнике указаны RK3588 / Linux 5.10: BuildRoot и Android — Y, Debian и Yocto — N. Это исторические сведения исходника, не гарантия совместимости всех BSP. Для ArmSoM сначала проверьте SoC, поколение ISP, сенсор/VCM, ядро, библиотеку AIQ, файл IQ и ветку SDK/BSP конкретной платы. ArmSoM Sige7 использует RK3588, однако API и примеры этой статьи на её оборудовании не проверялись. Данные и примеры относятся к исходнику, а не к измерениям ArmSoM. Команды оборудования и операции камеры/мотора не выполнялись.

**Неоднозначности оригинала:** сохранены повторяющиеся заголовки API, смешение поколений ISP и типов, противоречия единиц, значений по умолчанию, уровней журнала и описаний полей RAW. Они перечислены в редакционных заметках; значения и идентификаторы не исправляются молча. Комментарии кода оставлены на языке оригинала. Команды и API могут менять состояние камеры или мотора: перед использованием необходимы проверка и адаптация.

[EDITORIAL-NOTES](/docs/rockchip-isp30-development/EDITORIAL-NOTES.md) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM camera documentation](https://docs.armsom.org/sige-family-started) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.16; unit 0 -->

## 1. Общий обзор

<!-- Source EN PDF p.16; unit 1 -->

### 1.1 Структурная схема

<!-- Source EN PDF p.16; unit 2 -->

![Технический рисунок английского оригинала — PDF p.16](/docs/rockchip-isp30-development/assets/en-p016-X692.jpg)

<!-- Source EN PDF p.16; unit 3 -->

RK3588 VI — общее обозначение модулей видеоввода, включающих:

<!-- Source EN PDF p.16; unit 4 -->

Интерфейсы и сбор данных: C/DPHY, DVP, CSI, VICAP.

<!-- Source EN PDF p.16; unit 5 -->

Обработка изображений: ISP-0, ISP-1, FEC-0, FEC-1.

<!-- Source EN PDF p.16; unit 6 -->

ISP RK3588 относится к RK ISP v3.0; далее в документе он обозначается ISP30.

<!-- Source EN PDF p.16; unit 7 -->

### 1.2 Режимы работы

<!-- Source EN PDF p.16; unit 8 -->

Один ISP и один CIS (CMOS Image Sensor):

<!-- Source EN PDF p.16; unit 9 -->

Сквозной/онлайновый режим RAW: синие стрелки на схеме показывают путь данных 1.0.

<!-- Source EN PDF p.16; unit 10 -->

Режим обратного чтения/офлайновой обработки Raw: оранжевые стрелки показывают пути данных 1.1 и 1.2.

<!-- Source EN PDF p.16; unit 11 -->

Режим двух ISP 2-in-1 для одного CIS:

<!-- Source EN PDF p.16; unit 12 -->

В режиме 2-in-1 ISP-0 и ISP-1 отдельно обрабатывают левую и правую части изображения одного CIS, обеспечивая поддержку CIS высокого разрешения.

<!-- Source EN PDF p.16; unit 13 -->

Несколько CIS:

<!-- Source EN PDF p.17; unit 14 -->

Один ISP в режиме обратного чтения/офлайновой обработки Raw может обслуживать несколько входов CIS посредством временного мультиплексирования.

<!-- Source EN PDF p.17; unit 15 -->

### 1.3 Производительность и ограничения

<!-- Source EN PDF p.17; unit 16 -->

Поддерживаемые разрешения и пропускная способность:

<!-- Source EN PDF p.17; unit 17 -->

| Режим работы | Пропускная способность | Максимальное разрешение | Минимальное поддерживаемое разрешение |
|---|---|---|---|
| Один ISP, один CIS | 16Mega@30fps | 4672x3504 | 208x128 |
| Два ISP 2-in-1, один CIS | 32Mega@30fps | 8064x6048 | \ |

<!-- Source EN PDF p.17; unit 18 -->

Поддерживается ввод данных Raw12.

<!-- Source EN PDF p.17; unit 19 -->

ISP30 обрабатывает данные Raw12. При вводе Raw14 младшие биты отбрасываются для обработки как Raw12. У данных с разрядностью менее 12 бит младшие разряды дополняются до Raw12.

<!-- Source EN PDF p.17; unit 20 -->

Поддерживаются цветные Bayer CIS и монохромные Mono CIS.

<!-- Source EN PDF p.17; unit 21 -->

Поддерживается многокадровый HDR 3-in-1. Типы HDR CIS перечислены ниже:

<!-- Source EN PDF p.17; unit 22 -->

| Многоэкспозиционный HDR | Поддержка платформами RK | CIS | Применение |
|---|---|---|---|
| Sequential / Framebase HDR (последовательный/покадровый) | ISP20: RV1109/RV1126 и др.; ISP21: RK356X и др.; ISP30: RK3588; ISP32: RV1106 | OV4689 | IPC/CVR |
| Staggered / DOL HDR (чередование) | ISP20: RV1109/RV1126 и др.; ISP21: RK356X и др.; ISP30: RK3588; ISP32: RV1106 | OS04A10 IMX464 AR0239 | IPC/CVR |
| DCG HDR | ISP20: RV1109/RV1126 и др.; ISP21: RK356X и др.; ISP30: RK3588; ISP32: RV1106 | OS04A10 IMX585 | IPC/CVR |
| SME HDR | N | IMX378 | Потребительские устройства |
| BME HDR | N | IMX258 | Потребительские устройства |
| QBC HDR | N | OV50C40 IMX586 | Потребительские устройства |
| HDR с боковым переполнением | N | AR0821 | IPC |
| Splite-diode pixel HDR (написание исходника) | N | OV10640 | CVR |

<!-- Source EN PDF p.17; unit 23 -->

В сквозном/онлайновом режиме Raw минимальная задержка до уведомления о выводе данных ISP30 в DDR составляет примерно время передачи кадра/15.

<!-- Source EN PDF p.18; unit 24 -->

В режиме временного мультиплексирования один ISP поддерживает до четырёх входных источников данных.

<!-- Source EN PDF p.18; unit 25 -->

В сквозном/онлайновом режиме RAW минимальный кадровый интервал гашения составляет 136 строк, минимальный строчный — 16 пикселей.

<!-- Source EN PDF p.18; unit 26 -->

Модуль CSM не поддерживает преобразование в ограниченный диапазон YUV; подробности приведены в описании API IMGPROC/CSM.

<!-- Source EN PDF p.18; unit 27 -->

## 2. Обзор

<!-- Source EN PDF p.18; unit 28 -->

ISP30 включает алгоритмы коррекции тёмного тока и дефектных пикселей, 3A, HDR, коррекции затенения и геометрических искажений объектива, 3DLUT, шумоподавления (в домене RAW, многокадрового, цветового и др.) и повышения резкости.

<!-- Source EN PDF p.18; unit 29 -->

ISP30 состоит из аппаратной реализации алгоритмов и программного логического управления; RkAiq реализует программное управление.

<!-- Source EN PDF p.18; unit 30 -->

RkAiq получает статистику изображения от драйвера ISP, объединяет её с параметрами IQ Tuning, рассчитывает алгоритмами новые параметры ISP, Sensor и других аппаратных блоков и непрерывно повторяет процесс для получения наилучшего изображения.

<!-- Source EN PDF p.18; unit 31 -->

### 2.1 Описание функций

<!-- Source EN PDF p.18; unit 32 -->

![Технический рисунок английского оригинала — PDF p.18](/docs/rockchip-isp30-development/assets/en-p018-X701.png)

<!-- Source EN PDF p.18; unit 33 -->

Рис. 1-1. Структурная схема системы ISP21 (подпись исходника)

<!-- Source EN PDF p.18; unit 34 -->

Общая программно-аппаратная схема ISP30 приведена на рис. 1-1. Сенсор передаёт поток ISP HW, который выводит изображение после последовательности алгоритмов обработки. RkAiq непрерывно получает статистику ISP HW и алгоритмами, включая 3A, формирует новые параметры для аппаратных модулей. Инструмент Tuning позволяет изменять параметры онлайн в реальном времени и затем сохранить новый файл параметров IQ.

<!-- Source EN PDF p.19; unit 35 -->

### 2.2 Архитектура RkAiq

<!-- Source EN PDF p.19; unit 36 -->

![Технический рисунок английского оригинала — PDF p.19](/docs/rockchip-isp30-development/assets/en-p019-X706.png)

<!-- Source EN PDF p.19; unit 37 -->

Рис. 1-2. Общая архитектура RkAiq

<!-- Source EN PDF p.19; unit 38 -->

1\. Программная концепция ISP30 RkAiq показана на рис. 1-2 и включает четыре части:

<!-- Source EN PDF p.19; unit 39 -->

1\. Динамическая библиотека RkAiq lib содержит основную логику: получает статистику драйвера и передаёт её отдельным алгоритмическим библиотекам.

<!-- Source EN PDF p.19; unit 40 -->

2\. Integrated algo libs: статические алгоритмические библиотеки RK по умолчанию зарегистрированы в динамической библиотеке RkAiq lib.

<!-- Source EN PDF p.19; unit 41 -->

3\. customer 3A libs: заказчик может реализовать собственную библиотеку 3A или других алгоритмов согласно интерфейсам. После регистрации в RkAiq lib предоставленные интерфейсы позволяют выбрать собственную библиотеку или библиотеку RK.

<!-- Source EN PDF p.19; unit 42 -->

4\. IQ file: файл результатов настройки IQ хранит параметры алгоритмов и статические параметры системы, например CIS.

<!-- Source EN PDF p.20; unit 43 -->

### 2.3 Программная архитектура

<!-- Source EN PDF p.20; unit 44 -->

![Технический рисунок английского оригинала — PDF p.20](/docs/rockchip-isp30-development/assets/en-p020-X710.png)

<!-- Source EN PDF p.20; unit 45 -->

Рис. 1-3. Программная архитектура

<!-- Source EN PDF p.20; unit 46 -->

Программная схема ISP30 на рис. 1-3 включает три основных слоя:

<!-- Source EN PDF p.20; unit 47 -->

1\. Слой kernel содержит аппаратные драйверы камеры: ISP, sensor, VCM, flashlight, IrCutter и другие, основанные на V4L2 и Media framework.

<!-- Source EN PDF p.20; unit 48 -->

2\. Слой framework интегрирует RkAiq lib двумя способами:

<!-- Source EN PDF p.20; unit 49 -->

Режим IspServer: Rkaiq lib работает в отдельном процессе IspServer, с которым клиент взаимодействует через dbus. Это также позволяет предоставлять существующим сторонним приложениям, например v4L-CTL, изображения с настроенной обработкой ISP без изменения их исходного кода.

<!-- Source EN PDF p.20; unit 50 -->

Прямая интеграция: RkAiq lib можно встроить непосредственно в приложение.

<!-- Source EN PDF p.20; unit 51 -->

3\. Слой user: пользовательские приложения.

<!-- Source EN PDF p.21; unit 52 -->

### 2.4 Программный процесс

<!-- Source EN PDF p.22; unit 53 -->

![Технический рисунок английского оригинала — PDF p.22](/docs/rockchip-isp30-development/assets/en-p022-X717.png)

<!-- Source EN PDF p.23; unit 54 -->

Рис. 1-4. Блок-схема процесса

<!-- Source EN PDF p.23; unit 55 -->

Последовательность вызовов RkAiq показана на рис. 1-4. Пунктирные блоки необязательны; синий текст обозначает настройки приложения, необходимые для работы с процессом RkAiq.

<!-- Source EN PDF p.23; unit 56 -->

configure media pipeline: при необходимости настройте тракт ISP30, например выходное разрешение sensor; драйвер имеет настройки по умолчанию. rk_aiq_uapi2_sysctl_init: инициализирует RkAiq, параметры IQ и библиотеки алгоритмов. other Aiq or algo params uapis: необязательно задайте параметры через API алгоритмов и зарегистрируйте сторонние библиотеки. rk_aiq_uapi2_sysctl_prepare: подготавливает начальные параметры библиотек и аппаратных модулей и передаёт их драйверу.

<!-- Source EN PDF p.23; unit 57 -->

video capture start: включает поток ISP для приложения; этот шаг выполняется после rk_aiq_uapi2_sysctl_prepare.

<!-- Source EN PDF p.23; unit 58 -->

rk_aiq_uapi2_sysctl_start: запускает внутренний процесс RkAiq. После успешного вызова sensor начинает выдавать данные, а ISP — обрабатывать и выводить изображение.

<!-- Source EN PDF p.23; unit 59 -->

Rkaiq running: непрерывно получает статистику драйвера ISP, рассчитывает новые параметры алгоритмами, включая 3A, и передаёт их драйверу. PC Online Tuning Tool: ПК может настраивать параметры онлайн через Tuning Tool. video capture stop: перед остановкой RkAiq остановите поток данных. rk_aiq_uapi2_sysctl_stop: останавливает процесс RkAiq; после этого можно изменить параметры и перезапустить его либо перезапустить без изменений.

<!-- Source EN PDF p.23; unit 60 -->

rk_aiq_uapi2_sysctl_deinit: освобождает ресурсы RkAiq.

<!-- Source EN PDF p.23; unit 61 -->

### 2.5 Описание API

<!-- Source EN PDF p.23; unit 62 -->

API RKAiq делятся на функциональный и модульный уровни.

<!-- Source EN PDF p.23; unit 63 -->

Функциональный API оборачивает модульный API и предназначен прежде всего для простых настроек функций модуля в прикладном продукте.

<!-- Source EN PDF p.23; unit 64 -->

Модульный API предоставляет детальную настройку и запрос параметров модуля без разделения API по функциям.

<!-- Source EN PDF p.23; unit 65 -->

Модульные API RKAiq поддерживают синхронный и асинхронный режимы; функциональные API по умолчанию используют синхронный режим модульных API.

<!-- Source EN PDF p.23; unit 66 -->

Синхронный режим (Sync): блокирующий API. AIQ обновляет параметры в основном с гранулярностью видеокадра; время возможной блокировки вызывающего потока &lt;= периода видеокадра.

<!-- Source EN PDF p.23; unit 67 -->

Асинхронный режим (ASync): неблокирующий API. AIQ сохраняет параметры в своём буфере и в соответствующий момент передаёт аппаратуре последние настройки ISP.

<!-- Source EN PDF p.23; unit 68 -->

Использование синхронного и асинхронного режимов модульного API

<!-- Source EN PDF p.23; unit 69 -->

Второй параметр модульного API обычно представляет набор настроек — структуру атрибутов. Её член rk_aiq_uapi_sync_t задаёт режим вызова текущего API; подробнее см. тип данных ниже:

<!-- Source EN PDF p.24; unit 70 -->

#### 2.5.1  rk_aiq_uapi_sync_t

<!-- Source EN PDF p.24; unit 71 -->

【Описание】Режим синхронизации модуля

<!-- Source EN PDF p.24; unit 72 -->

【Определение】

<!-- Source EN PDF p.24; unit 73 -->

```text
 typedef struct rk_aiq_uapi_sync_s {
     rk_aiq_uapi_mode_sync_e     sync_mode;
     bool                        done;
 } rk_aiq_uapi_sync_t;
```

<!-- Source EN PDF p.24; unit 74 -->

【Члены】

<!-- Source EN PDF p.24; unit 75 -->

| Имя члена | Описание |
|---|---|
| sync_mode | @setAttrib: флаг режима обновления параметров; RK_AIQ_UAPI_MODE_DEFAULT — по умолчанию синхронный; RK_AIQ_UAPI_MODE_SYNC — синхронный; RK_AIQ_UAPI_MODE_ASYNC — асинхронный. @getAttrib: RK_AIQ_UAPI_MODE_DEFAULT возвращает последние заданные атрибуты (sync_mode == RK_AIQ_UAPI_MODE_ASYNC), которые могут ещё не действовать; RK_AIQ_UAPI_MODE_SYNC — реально используемые атрибуты; RK_AIQ_UAPI_MODE_ASYNC — то же, что RK_AIQ_UAPI_MODE_DEFAULT. |
| done | @done (parsm out, написание исходника): флаг состояния обновления; true — параметры обновлены, false — ещё не обновлены. |

<!-- Source EN PDF p.24; unit 76 -->

Примеры использования API AIQ разделены по модулям; рекомендуется обращаться непосредственно к этим примерам.

<!-- Source EN PDF p.24; unit 77 -->

rkisp_demo/demo/sample

<!-- Source EN PDF p.25; unit 78 -->

| Имя файла | Модуль |
|---|---|
| sample_3dlut_module.cpp | 3DLUT |
| sample_ccm_module.cpp | CCM |
| sample_csm_module.cpp | CSM |
| sample_ablc_module.cpp | BLC |
| sample_abayer2dnr_module.cpp | BayerNR 2D |
| sample_abayertnr_module.cpp | BayerNR 3D |
| sample_aynr_module.cpp | YNR |
| sample_acnr_module.cpp | CNR |
| sample_asharp_module.cpp | Sharp |
| sample_amerge_module.cpp | Merge(HDR) |
| sample_adrc_module.cpp | DRC |
| sample_adehaze_module.cpp | Удаление дымки и улучшение изображения |
| sample_agamma_module.cpp | Gamma |
| sample_awb_module.cpp | AWB |
| sample_ae_module.cpp | AE |
| sample_af_module.cpp | AF |

<!-- Source EN PDF p.25; unit 79 -->

## 3. Управление системой

<!-- Source EN PDF p.25; unit 80 -->

### 3.1 Обзор функций

<!-- Source EN PDF p.25; unit 81 -->

Управление системой включает общие атрибуты AIQ, инициализацию, запуск, завершение работы и настройку модулей AIQ.

<!-- Source EN PDF p.25; unit 82 -->

### 3.2 Справочник API

<!-- Source EN PDF p.25; unit 83 -->

#### 3.2.1  rk_aiq_uapi2_sysctl_preInit

<!-- Source EN PDF p.25; unit 84 -->

【Описание】Предварительная установка параметров перед инициализацией AIQ, например используемого файла IQ.

<!-- Source EN PDF p.25; unit 85 -->

【Синтаксис】

<!-- Source EN PDF p.26; unit 86 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit (const char* sns_ent_name,
                          rk_aiq_working_mode_t mode,
                          const char* force_iq_file);
```

<!-- Source EN PDF p.26; unit 87 -->

【Параметры】

<!-- Source EN PDF p.26; unit 88 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sns_ent_name | Имя сущности sensor | Вход |
| mode | Режим работы ISP | Вход |
| force_iq_file | Принудительно заданный файл iq | Вход |

<!-- Source EN PDF p.26; unit 89 -->

【Возвращаемое значение】

<!-- Source EN PDF p.26; unit 90 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.26; unit 91 -->

【Зависимости】

<!-- Source EN PDF p.26; unit 92 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.26; unit 93 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.26; unit 94 -->

【Примечание】

<!-- Source EN PDF p.26; unit 95 -->

Вызывать до rk_aiq_uapi2_sysctl_init.

<!-- Source EN PDF p.26; unit 96 -->

mode используется только для выбора файла IQ, но не задаёт режим ISP: его задают в rk_aiq_uapi2_sysctl_prepare. Если force_iq_file не пуст, mode не действует.

<!-- Source EN PDF p.26; unit 97 -->

Параметр force_iq_file содержит полный путь.

<!-- Source EN PDF p.26; unit 98 -->

Функция необязательна и служит только для изменения некоторых настроек по умолчанию до rk_aiq_uapi2_sysctl_init.

<!-- Source EN PDF p.26; unit 99 -->

#### 3.2.2  rk_aiq_uapi2_sysctl_preInit_scene

<!-- Source EN PDF p.26; unit 100 -->

【Описание】Выбор параметров сцены IQ до инициализации AIQ.

<!-- Source EN PDF p.26; unit 101 -->

【Синтаксис】

<!-- Source EN PDF p.26; unit 102 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit_scene (const char* sns_ent_name,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.26; unit 103 -->

【Параметры】

<!-- Source EN PDF p.27; unit 104 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sns_ent_name | Имя сущности sensor | Вход |
| main_scene | Основная сцена; значения определены в файле IQ. | Вход |
| sub_scene | Подсцена; значения определены в файле IQ. | Вход |

<!-- Source EN PDF p.27; unit 105 -->

【Возвращаемое значение】

<!-- Source EN PDF p.27; unit 106 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.27; unit 107 -->

【Зависимости】

<!-- Source EN PDF p.27; unit 108 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.27; unit 109 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.27; unit 110 -->

【Примечание】

<!-- Source EN PDF p.27; unit 111 -->

Вызывать до rk_aiq_uapi2_sysctl_init.

<!-- Source EN PDF p.27; unit 112 -->

main_scene выбирают из массива основных сцен файла IQ; обычно по умолчанию используется "normal".

<!-- Source EN PDF p.27; unit 113 -->

sub_scene выбирают из массива подсцен основной сцены файла IQ; обычно по умолчанию используется "day".

<!-- Source EN PDF p.27; unit 114 -->

По умолчанию выбирается normal-day. Для hdr-day или другого пользовательского режима укажите сцену этой функцией, иначе параметры IQ могут оказаться неверными.

<!-- Source EN PDF p.27; unit 115 -->

#### 3.2.3  rk_aiq_uapi2_sysctl_switch_scene

<!-- Source EN PDF p.27; unit 116 -->

【Описание】Переключение параметров сцены IQ после инициализации AIQ.

<!-- Source EN PDF p.27; unit 117 -->

【Синтаксис】

<!-- Source EN PDF p.27; unit 118 -->

```text
 int
 rk_aiq_uapi2_sysctl_switch_scene (const rk_aiq_sys_ctx_t* sys_ctx,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.27; unit 119 -->

【Параметры】

<!-- Source EN PDF p.27; unit 120 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| main_scene | Основная сцена; значения определены в файле IQ. | Вход |
| sub_scene | Подсцена; значения определены в файле IQ. | Вход |

<!-- Source EN PDF p.28; unit 121 -->

【Возвращаемое значение】

<!-- Source EN PDF p.28; unit 122 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.28; unit 123 -->

【Зависимости】

<!-- Source EN PDF p.28; unit 124 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.28; unit 125 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.28; unit 126 -->

【Примечание】

<!-- Source EN PDF p.28; unit 127 -->

Вызывать после rk_aiq_uapi2_sysctl_init.

<!-- Source EN PDF p.28; unit 128 -->

main_scene выбирают из массива основных сцен файла IQ.

<!-- Source EN PDF p.28; unit 129 -->

sub_scene выбирают из массива подсцен основной сцены файла IQ.

<!-- Source EN PDF p.28; unit 130 -->

Интерфейс динамически переключает IQ; он пока недостаточно протестирован и может дать неожиданный результат, поэтому используйте его осторожно.

<!-- Source EN PDF p.28; unit 131 -->

#### 3.2.4  rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.28; unit 132 -->

【Описание】Инициализация контекста AIQ.

<!-- Source EN PDF p.28; unit 133 -->

【Синтаксис】

<!-- Source EN PDF p.28; unit 134 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_sysctl_init (const char* sns_ent_name,
                          const char* iq_file_dir,
                          rk_aiq_error_cb err_cb,
                          rk_aiq_metas_cb metas_cb);
```

<!-- Source EN PDF p.28; unit 135 -->

【Параметры】

<!-- Source EN PDF p.28; unit 136 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sns_ent_name | Имя сущности sensor | Вход |
| iq_file_dir | Путь к файлу параметров калибровки | Вход |
| err_cb | Обратный вызов ошибки; может быть NULL. | Вход |
| metas_cb | Обратный вызов метаданных; может быть NULL. | Вход |

<!-- Source EN PDF p.28; unit 137 -->

【Возвращаемое значение】

<!-- Source EN PDF p.28; unit 138 -->

| Возвращаемое значение | Описание |
|---|---|
| rk_aiq_sys_ctx_t* | Указатель контекста AIQ |

<!-- Source EN PDF p.29; unit 139 -->

【Зависимости】

<!-- Source EN PDF p.29; unit 140 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 141 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.29; unit 142 -->

【Примечание】

<!-- Source EN PDF p.29; unit 143 -->

Вызывать до других функций.

<!-- Source EN PDF p.29; unit 144 -->

#### 3.2.5  rk_aiq_uapi2_sysctl_deinit

<!-- Source EN PDF p.29; unit 145 -->

【Описание】Освобождение контекста AIQ.

<!-- Source EN PDF p.29; unit 146 -->

【Синтаксис】

<!-- Source EN PDF p.29; unit 147 -->

```text
 void
 rk_aiq_uapi2_sysctl_deinit( rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.29; unit 148 -->

【Параметры】

<!-- Source EN PDF p.29; unit 149 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.29; unit 150 -->

【Возвращаемое значение】

<!-- Source EN PDF p.29; unit 151 -->

| Возвращаемое значение | Описание |
|---|---|
| Нет | Нет |

<!-- Source EN PDF p.29; unit 152 -->

【Зависимости】

<!-- Source EN PDF p.29; unit 153 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 154 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.29; unit 155 -->

【Примечание】

<!-- Source EN PDF p.29; unit 156 -->

Не вызывать, когда AIQ находится в состоянии start.

<!-- Source EN PDF p.29; unit 157 -->

#### 3.2.6  rk_aiq_uapi2_sysctl_prepare

<!-- Source EN PDF p.29; unit 158 -->

【Описание】Подготовка рабочей среды AIQ.

<!-- Source EN PDF p.29; unit 159 -->

【Синтаксис】

<!-- Source EN PDF p.29; unit 160 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_prepare(const rk_aiq_sys_ctx_t* ctx,
                            uint32_t  width,
                            uint32_t  height,
                            rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.30; unit 161 -->

【Параметры】

<!-- Source EN PDF p.30; unit 162 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| width | Ширина выходного разрешения sensor; используется только для проверки. | Вход |
| height | Высота выходного разрешения sensor; используется только для проверки. | Вход |
| mode | Режим работы тракта ISP (NORMAL/HDR). | Вход |

<!-- Source EN PDF p.30; unit 163 -->

【Возвращаемое значение】

<!-- Source EN PDF p.30; unit 164 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.30; unit 165 -->

【Зависимости】

<!-- Source EN PDF p.30; unit 166 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.30; unit 167 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.30; unit 168 -->

【Примечание】

<!-- Source EN PDF p.30; unit 169 -->

Вызывать до rk_aiq_uapi2_sysctl_start.

<!-- Source EN PDF p.30; unit 170 -->

Если требуется вызов после rk_aiq_uapi2_sysctl_start, сначала вызовите rk_aiq_uapi2_sysctl_stop, затем rk_aiq_uapi2_sysctl_prepare для повторной подготовки рабочей среды.

<!-- Source EN PDF p.30; unit 171 -->

#### 3.2.7  rk_aiq_uapi2_sysctl_start

<!-- Source EN PDF p.30; unit 172 -->

【Описание】Запуск системы управления AIQ. После запуска она непрерывно получает статистику 3A от драйвера ISP, выполняет алгоритм 3A и применяет рассчитанные параметры.

<!-- Source EN PDF p.30; unit 173 -->

【Синтаксис】

<!-- Source EN PDF p.30; unit 174 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_start(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.30; unit 175 -->

【Параметры】

<!-- Source EN PDF p.30; unit 176 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.30; unit 177 -->

【Возвращаемое значение】

<!-- Source EN PDF p.31; unit 178 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.31; unit 179 -->

【Зависимости】

<!-- Source EN PDF p.31; unit 180 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 181 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.31; unit 182 -->

【Примечание】

<!-- Source EN PDF p.31; unit 183 -->

Вызывать после rk_aiq_uapi2_sysctl_prepare.

<!-- Source EN PDF p.31; unit 184 -->

#### 3.2.8  rk_aiq_uapi2_sysctl_stop

<!-- Source EN PDF p.31; unit 185 -->

【Описание】Остановка системы управления AIQ.

<!-- Source EN PDF p.31; unit 186 -->

【Синтаксис】

<!-- Source EN PDF p.31; unit 187 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_stop(const rk_aiq_sys_ctx_t* ctx, bool keep_ext_hw_st);
```

<!-- Source EN PDF p.31; unit 188 -->

【Параметры】

<!-- Source EN PDF p.31; unit 189 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| keep_ext_hw_st | Сохранять ли после остановки состояние внешних устройств, например ircut/cpsl. | Вход |

<!-- Source EN PDF p.31; unit 190 -->

【Возвращаемое значение】

<!-- Source EN PDF p.31; unit 191 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.31; unit 192 -->

【Зависимости】

<!-- Source EN PDF p.31; unit 193 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 194 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.32; unit 195 -->

#### 3.2.9  rk_aiq_uapi2_sysctl_getStaticMetas

<!-- Source EN PDF p.32; unit 196 -->

【Описание】Запрос статических сведений о sensor, например разрешения и формата данных.

<!-- Source EN PDF p.32; unit 197 -->

【Синтаксис】

<!-- Source EN PDF p.32; unit 198 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getStaticMetas(const char* sns_ent_name,
 rk_aiq_static_info_t* static_info);
```

<!-- Source EN PDF p.32; unit 199 -->

【Параметры】

<!-- Source EN PDF p.32; unit 200 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sns_ent_name | Имя сущности sensor | Вход |
| static_info | Указатель структуры статических сведений | Выход |

<!-- Source EN PDF p.32; unit 201 -->

【Возвращаемое значение】

<!-- Source EN PDF p.32; unit 202 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.32; unit 203 -->

【Зависимости】

<!-- Source EN PDF p.32; unit 204 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.32; unit 205 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.32; unit 206 -->

#### 3.2.10  rk_aiq_uapi2_sysctl_enumStaticMetas

<!-- Source EN PDF p.32; unit 207 -->

【Описание】Перечисление статических сведений, полученных AIQ.

<!-- Source EN PDF p.32; unit 208 -->

【Синтаксис】

<!-- Source EN PDF p.32; unit 209 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enumStaticMetas(int index, rk_aiq_static_info_t*
 static_info);
```

<!-- Source EN PDF p.32; unit 210 -->

【Параметры】

<!-- Source EN PDF p.32; unit 211 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| index | Индекс, начиная с 0. | Вход |
| static_info | Указатель структуры статических сведений | Выход |

<!-- Source EN PDF p.32; unit 212 -->

【Возвращаемое значение】

<!-- Source EN PDF p.33; unit 213 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.33; unit 214 -->

【Зависимости】

<!-- Source EN PDF p.33; unit 215 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 216 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.33; unit 217 -->

#### 3.2.11  rk_aiq_uapi2_sysctl_enableAxlib

<!-- Source EN PDF p.33; unit 218 -->

【Описание】Установка состояния пользовательской библиотеки алгоритмов.

<!-- Source EN PDF p.33; unit 219 -->

【Синтаксис】

<!-- Source EN PDF p.33; unit 220 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enableAxlib(const rk_aiq_sys_ctx_t* ctx,
                                const int algo_type,
                                const int lib_id,
                                bool enable);
```

<!-- Source EN PDF p.33; unit 221 -->

【Параметры】

<!-- Source EN PDF p.33; unit 222 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| algo_type | Тип обрабатываемого алгоритмического модуля. | Вход |
| lib_id | Идентификатор библиотеки алгоритмов | Вход |
| enable | Настройка состояния | Вход |

<!-- Source EN PDF p.33; unit 223 -->

【Возвращаемое значение】

<!-- Source EN PDF p.33; unit 224 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.33; unit 225 -->

【Зависимости】

<!-- Source EN PDF p.33; unit 226 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 227 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.33; unit 228 -->

【Примечание】

<!-- Source EN PDF p.33; unit 229 -->

Если lib_id соответствует работающей библиотеке, функцию можно вызвать в любом состоянии, кроме неинициализированного.

<!-- Source EN PDF p.34; unit 230 -->

В остальных случаях вызывать только в состоянии prepared: библиотека алгоритма algo_type заменяется новой библиотекой с идентификатором lib_id.

<!-- Source EN PDF p.34; unit 231 -->

#### 3.2.12  rk_aiq_uapi2_sysctl_getAxlibStatus

<!-- Source EN PDF p.34; unit 232 -->

【Описание】Получение состояния библиотеки алгоритмов.

<!-- Source EN PDF p.34; unit 233 -->

【Синтаксис】

<!-- Source EN PDF p.34; unit 234 -->

```text
 bool
 rk_aiq_uapi2_sysctl_getAxlibStatus(const rk_aiq_sys_ctx_t* ctx,
                                   const int algo_type,
                                   const int lib_id);
```

<!-- Source EN PDF p.34; unit 235 -->

【Параметры】

<!-- Source EN PDF p.34; unit 236 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| algo_type | Тип обрабатываемого алгоритмического модуля. | Вход |
| lib_id | Идентификатор библиотеки алгоритмов | Вход |

<!-- Source EN PDF p.34; unit 237 -->

【Возвращаемое значение】

<!-- Source EN PDF p.34; unit 238 -->

| Возвращаемое значение | Описание |
|---|---|
| false | Выключено |
| true | Включено |

<!-- Source EN PDF p.34; unit 239 -->

【Зависимости】

<!-- Source EN PDF p.34; unit 240 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.34; unit 241 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.34; unit 242 -->

#### 3.2.13  rk_aiq_uapi2_sysctl_getEnabledAxlibCtx

<!-- Source EN PDF p.34; unit 243 -->

【Описание】Получение структуры контекста включённой библиотеки алгоритмов.

<!-- Source EN PDF p.34; unit 244 -->

【Синтаксис】

<!-- Source EN PDF p.34; unit 245 -->

```text
 const RkAiqAlgoContext*
 rk_aiq_uapi2_sysctl_getEnabledAxlibCtx(const rk_aiq_sys_ctx_t* ctx, const int
 algo_type);
```

<!-- Source EN PDF p.34; unit 246 -->

【Параметры】

<!-- Source EN PDF p.35; unit 247 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| algo_type | Тип обрабатываемого алгоритмического модуля. | Вход |

<!-- Source EN PDF p.35; unit 248 -->

【Возвращаемое значение】

<!-- Source EN PDF p.35; unit 249 -->

| Возвращаемое значение | Описание |
|---|---|
| NULL | Не удалось получить |
| Non-NULL | Получено успешно |

<!-- Source EN PDF p.35; unit 250 -->

【Зависимости】

<!-- Source EN PDF p.35; unit 251 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.35; unit 252 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.35; unit 253 -->

【Примечание】

<!-- Source EN PDF p.35; unit 254 -->

Возвращаемая структура контекста алгоритма используется внутренней закрытой функцией. Для пользовательских библиотек вызывайте её после rk_aiq_uapi2_sysctl_enableAxlib, иначе возвращается NULL.

<!-- Source EN PDF p.35; unit 255 -->

#### 3.2.14  rk_aiq_uapi2_sysctl_setCpsLtCfg

<!-- Source EN PDF p.35; unit 256 -->

【Описание】Установка параметров управления подсветкой.

<!-- Source EN PDF p.35; unit 257 -->

【Синтаксис】

<!-- Source EN PDF p.35; unit 258 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_setCpsLtCfg(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cfg_t* cfg);
```

<!-- Source EN PDF p.35; unit 259 -->

【Параметры】

<!-- Source EN PDF p.35; unit 260 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| cfg | Указатель структуры настроек подсветки | Вход |

<!-- Source EN PDF p.35; unit 261 -->

【Возвращаемое значение】

<!-- Source EN PDF p.35; unit 262 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.35; unit 263 -->

【Зависимости】

<!-- Source EN PDF p.36; unit 264 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 265 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.36; unit 266 -->

#### 3.2.15  rk_aiq_uapi2_sysctl_getCpsLtInfo

<!-- Source EN PDF p.36; unit 267 -->

【Описание】Получение параметров управления подсветкой.

<!-- Source EN PDF p.36; unit 268 -->

【Синтаксис】

<!-- Source EN PDF p.36; unit 269 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCpsLtInfo(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_info_t* info);
```

<!-- Source EN PDF p.36; unit 270 -->

【Параметры】

<!-- Source EN PDF p.36; unit 271 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| info | Указатель структуры настроек подсветки | Выход |

<!-- Source EN PDF p.36; unit 272 -->

【Возвращаемое значение】

<!-- Source EN PDF p.36; unit 273 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.36; unit 274 -->

【Зависимости】

<!-- Source EN PDF p.36; unit 275 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 276 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.36; unit 277 -->

#### 3.2.16  rk_aiq_uapi2_sysctl_queryCpsLtCap

<!-- Source EN PDF p.36; unit 278 -->

【Описание】Запрос возможностей подсветки.

<!-- Source EN PDF p.36; unit 279 -->

【Синтаксис】

<!-- Source EN PDF p.36; unit 280 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_queryCpsLtCap(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cap_t* cap);
```

<!-- Source EN PDF p.36; unit 281 -->

【Параметры】

<!-- Source EN PDF p.37; unit 282 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| cap | Указатель структуры запроса поддерживаемых возможностей подсветки. | Выход |

<!-- Source EN PDF p.37; unit 283 -->

【Возвращаемое значение】

<!-- Source EN PDF p.37; unit 284 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.37; unit 285 -->

【Зависимости】

<!-- Source EN PDF p.37; unit 286 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 287 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.37; unit 288 -->

#### 3.2.17  rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd

<!-- Source EN PDF p.37; unit 289 -->

【Описание】Запрос имени сущности sensor, соответствующей узлу video.

<!-- Source EN PDF p.37; unit 290 -->

【Синтаксис】

<!-- Source EN PDF p.37; unit 291 -->

```text
 const char* rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd(const char* vd);
```

<!-- Source EN PDF p.37; unit 292 -->

【Параметры】

<!-- Source EN PDF p.37; unit 293 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| vd | Путь узла video, например /dev/video20 | Вход |

<!-- Source EN PDF p.37; unit 294 -->

【Возвращаемое значение】

<!-- Source EN PDF p.37; unit 295 -->

| Возвращаемое значение | Описание |
|---|---|
| Имя сущности sensor | Указатель строки |

<!-- Source EN PDF p.37; unit 296 -->

【Примечание】

<!-- Source EN PDF p.37; unit 297 -->

Параметр должен содержать путь узла ISPP scale.

<!-- Source EN PDF p.37; unit 298 -->

【Зависимости】

<!-- Source EN PDF p.37; unit 299 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 300 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.38; unit 301 -->

#### 3.2.18  rk_aiq_uapi2_sysctl_updateIq

<!-- Source EN PDF p.38; unit 302 -->

【Описание】Динамическое обновление текущего файла параметров IQ без остановки потока.

<!-- Source EN PDF p.38; unit 303 -->

【Синтаксис】

<!-- Source EN PDF p.38; unit 304 -->

```text
 XCamReturn rk_aiq_uapi2_sysctl_updateIq(const rk_aiq_sys_ctx_t* sys_ctx, char*
 iqfile);
```

<!-- Source EN PDF p.38; unit 305 -->

【Параметры】

<!-- Source EN PDF p.38; unit 306 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| iqfile | Новый файл IQ | Вход |

<!-- Source EN PDF p.38; unit 307 -->

【Возвращаемое значение】

<!-- Source EN PDF p.38; unit 308 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.38; unit 309 -->

【Примечание】

<!-- Source EN PDF p.38; unit 310 -->

iqfile должен содержать полный путь.

<!-- Source EN PDF p.38; unit 311 -->

Обновление параметров IQ не переключает рабочий режим: например, переход HDR/normal нельзя выполнить обновлением файла IQ. Однако отдельные функции переключаются разными настройками IQ; например, дневной/ночной режим целиком переключается конфигурацией IQ.

<!-- Source EN PDF p.38; unit 312 -->

При переключении IQ его параметры заменяют настройки пользовательского API. Например, IQ может задать ручной или автоматический AWB; после вызова функции текущий режим AWB в любом случае заменяется конфигурацией нового IQ по умолчанию.

<!-- Source EN PDF p.38; unit 313 -->

【Зависимости】

<!-- Source EN PDF p.38; unit 314 -->

Заголовочный файл: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.38; unit 315 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.38; unit 316 -->

#### 3.2.19  rk_aiq_uapi2_sysctl_getCrop

<!-- Source EN PDF p.38; unit 317 -->

【Описание】Получение параметров кадрирования.

<!-- Source EN PDF p.38; unit 318 -->

【Синтаксис】

<!-- Source EN PDF p.39; unit 319 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCrop(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_rect_t
 *rect);
```

<!-- Source EN PDF p.39; unit 320 -->

【Параметры】

<!-- Source EN PDF p.39; unit 321 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| rect | Указатель структуры параметров кадрирования | Выход |

<!-- Source EN PDF p.39; unit 322 -->

【Возвращаемое значение】

<!-- Source EN PDF p.39; unit 323 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.39; unit 324 -->

### 3.3 Типы данных

<!-- Source EN PDF p.39; unit 325 -->

#### 3.3.1  rk_aiq_working_mode_t

<!-- Source EN PDF p.39; unit 326 -->

【Описание】Режим работы тракта AIQ.

<!-- Source EN PDF p.39; unit 327 -->

【Определение】

<!-- Source EN PDF p.39; unit 328 -->

```text
 typedef enum {
     RK_AIQ_WORKING_MODE_NORMAL,
     RK_AIQ_WORKING_MODE_ISP_HDR2    = 0x10,
     RK_AIQ_WORKING_MODE_ISP_HDR3    = 0x20,
 } rk_aiq_working_mode_t;
```

<!-- Source EN PDF p.39; unit 329 -->

【Члены】

<!-- Source EN PDF p.39; unit 330 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_WORKING_MODE_NORMAL | Обычный режим |
| RK_AIQ_WORKING_MODE_ISP_HDR2 | Двухкадровый режим HDR |
| RK_AIQ_WORKING_MODE_ISP_HDR3 | Трёхкадровый режим HDR |

<!-- Source EN PDF p.39; unit 331 -->

【Меры предосторожности】

<!-- Source EN PDF p.39; unit 332 -->

Сначала запросите режимы, поддерживаемые sensor и AIQ; установка неподдерживаемого режима не действует.

<!-- Source EN PDF p.40; unit 333 -->

#### 3.3.2  rk_aiq_static_info_t

<!-- Source EN PDF p.40; unit 334 -->

【Описание】Статические сведения AIQ.

<!-- Source EN PDF p.40; unit 335 -->

【Определение】

<!-- Source EN PDF p.40; unit 336 -->

```text
 typedef struct {
     rk_aiq_sensor_info_t    sensor_info;
     rk_aiq_lens_info_t      lens_info;
     bool has_lens_vcm;
     bool has_fl;
     bool fl_strth_adj_sup;
     bool has_irc;
     bool fl_ir_strth_adj_sup;
 } rk_aiq_static_info_t;
```

<!-- Source EN PDF p.40; unit 337 -->

【Члены】

<!-- Source EN PDF p.40; unit 338 -->

| Имя члена | Описание |
|---|---|
| sensor_info | Имя sensor, поддерживаемые разрешения и другие сведения. |
| lens_info | Сведения об объективе |
| has_lens_vcm | Наличие VCM |
| has_fl | Наличие вспышки |
| fl_strth_adj_sup | Возможность регулировки вспышки |
| bool has_irc | Наличие IR-CUT |
| bool fl_ir_strth_adj_sup |  |

<!-- Source EN PDF p.40; unit 339 -->

#### 3.3.3  rk_aiq_sensor_info_t

<!-- Source EN PDF p.40; unit 340 -->

【Описание】Сведения о sensor.

<!-- Source EN PDF p.40; unit 341 -->

【Определение】

<!-- Source EN PDF p.40; unit 342 -->

```text
 typedef struct {
     char sensor_name[32];
     rk_frame_fmt_t  support_fmt[SUPPORT_FMT_MAX];
     int32_t num;
     /* binded pp stream media index */
     int8_t binded_strm_media_idx;
 } rk_aiq_sensor_info_t;
```

<!-- Source EN PDF p.40; unit 343 -->

【Члены】

<!-- Source EN PDF p.41; unit 344 -->

| Имя члена | Описание |
|---|---|
| sensor_name | Имя sensor |
| support_fmt | Поддерживаемые форматы |
| num | Количество поддерживаемых форматов |
| has_fl | Наличие вспышки |
| binded_strm_media_idx | Номер узла media, к которому подключён sensor. |

<!-- Source EN PDF p.41; unit 345 -->

#### 3.3.4  rk_aiq_module_id_t

<!-- Source EN PDF p.41; unit 346 -->

【Описание】Идентификатор модуля AIQ.

<!-- Source EN PDF p.41; unit 347 -->

【Определение】

<!-- Source EN PDF p.41; unit 348 -->

```text
 typedef enum {
     RK_MODULE_INVAL = 0,
     RK_MODULE_DPCC,
     RK_MODULE_BLS,
     RK_MODULE_LSC,
     RK_MODULE_AWB_GAIN,
     RK_MODULE_CTK,
     RK_MODULE_GOC,
     RK_MODULE_SHARP,
     RK_MODULE_AE,
     RK_MODULE_AWB,
     RK_MODULE_NR,
     RK_MODULE_GIC,
     RK_MODULE_3DLUT,
     RK_MODULE_LDCH,
     RK_MODULE_TNR,
     RK_MODULE_FEC,
     RK_MODULE_MAX
 }rk_aiq_module_id_t;
```

<!-- Source EN PDF p.41; unit 349 -->

【Члены】

<!-- Source EN PDF p.42; unit 350 -->

| Имя члена | Описание |
|---|---|
| RK_MODULE_DPCC | Обнаружение и коррекция дефектных пикселей |
| RK_MODULE_BLS | Уровень чёрного |
| RK_MODULE_LSC | Коррекция затенения объектива |
| RK_MODULE_AWB_GAIN | Усиление баланса белого |
| RK_MODULE_CTK | Цветокоррекция |
| RK_MODULE_GOC | Gamma |
| RK_MODULE_SHARP | Повышение резкости |
| RK_MODULE_AE | Экспозиция |
| RK_MODULE_AWB | Баланс белого |
| RK_MODULE_NR | Шумоподавление |
| RK_MODULE_GIC | Баланс зелёных каналов |
| RK_MODULE_3DLUT | 3DLUT |
| RK_MODULE_LDCH | LDCH |
| RK_MODULE_TNR | 3D-шумоподавление |
| RK_MODULE_FEC | Коррекция «рыбьего глаза» |

<!-- Source EN PDF p.42; unit 351 -->

#### 3.3.5  rk_aiq_cpsl_cfg_t

<!-- Source EN PDF p.42; unit 352 -->

【Описание】Структура настройки подсветки.

<!-- Source EN PDF p.42; unit 353 -->

【Определение】

<!-- Source EN PDF p.42; unit 354 -->

```text
 typedef struct rk_aiq_cpsl_cfg_s {
     RKAiqOPMode_t mode;
     rk_aiq_cpsls_t lght_src;
     bool gray_on; /*!< force to gray if light on */
     union {
         struct {
             float sensitivity; /*!< Range [0-100] */
             uint32_t sw_interval; /*!< switch interval time, unit  seconds */
         } a; /*< auto mode */
         struct {
             uint8_t on; /*!< disable 0, enable 1 */
             float strength_led; /*!< Range [0-100] */
             float strength_ir; /*!< Range [0-100] */
         } m; /*!< manual mode */
     } u;
 } rk_aiq_cpsl_cfg_t;
```

<!-- Source EN PDF p.43; unit 355 -->

【Члены】

<!-- Source EN PDF p.43; unit 356 -->

| Имя члена | Описание |
|---|---|
| mode | Режим работы |
| lght_src | Тип источника света |
| gray_on | Переводить ли изображение в чёрно-белое после перехода в ночной режим. |
| sensitivity | Чувствительность переключения в автоматическом режиме, диапазон [0,100]. |
| sw_interval | Интервал переключения в автоматическом режиме, в секундах. |
| on | Переходить ли в ночной режим при ручном управлении. |
| strength_led | Интенсивность LED при ручном управлении, диапазон [0,100]. |
| strength_ir | Интенсивность ИК-подсветки при ручном управлении, диапазон [0,100]. |

<!-- Source EN PDF p.43; unit 357 -->

#### 3.3.6  rk_aiq_cpsl_info_t

<!-- Source EN PDF p.43; unit 358 -->

【Описание】Структура запроса сведений о подсветке.

<!-- Source EN PDF p.43; unit 359 -->

【Определение】

<!-- Source EN PDF p.43; unit 360 -->

```text
 typedef struct rk_aiq_cpsl_info_s {
     int32_t mode;
     uint8_t on;
     bool gray;
     float strength_led;
     float strength_ir;
     float sensitivity;
     uint32_t sw_interval;
     int32_t lght_src;
 } rk_aiq_cpsl_info_t;
```

<!-- Source EN PDF p.43; unit 361 -->

【Члены】

<!-- Source EN PDF p.44; unit 362 -->

| Имя члена | Описание |
|---|---|
| mode | Режим работы |
| lght_src | Тип источника света |
| gray | Переводить ли изображение в чёрно-белое после перехода в ночной режим. |
| sensitivity | Чувствительность переключения в автоматическом режиме, диапазон [0,100]. |
| sw_interval | Интервал переключения в автоматическом режиме, в секундах. |
| on | Переходить ли в ночной режим при ручном управлении. |
| strength_led | Интенсивность LED при ручном управлении, диапазон [0,100]. |
| strength_ir | Интенсивность ИК-подсветки при ручном управлении, диапазон [0,100]. |

<!-- Source EN PDF p.44; unit 363 -->

#### 3.3.7  rk_aiq_cpsl_cap_t

<!-- Source EN PDF p.44; unit 364 -->

【Описание】Структура поддерживаемых возможностей подсветки.

<!-- Source EN PDF p.44; unit 365 -->

【Определение】

<!-- Source EN PDF p.44; unit 366 -->

```text
 typedef struct rk_aiq_cpsl_cap_s {
     int32_t supported_modes[RK_AIQ_OP_MODE_MAX];
     uint8_t modes_num;
     int32_t supported_lght_src[RK_AIQ_CPSLS_MAX];
     uint8_t lght_src_num;
     rk_aiq_range_t strength_led;
     rk_aiq_range_t sensitivity;
     rk_aiq_range_t strength_ir;
 } rk_aiq_cpsl_cap_t;
```

<!-- Source EN PDF p.44; unit 367 -->

【Члены】

<!-- Source EN PDF p.44; unit 368 -->

| Имя члена | Описание |
|---|---|
| supported_modes | Поддерживаемые режимы работы |
| modes_num | Количество поддерживаемых режимов |
| gray | Переводить ли изображение в чёрно-белое после перехода в ночной режим. |
| supported_lght_src | Поддерживаемые источники света |
| lght_src_num | Количество поддерживаемых источников света |
| strength_led | Диапазон интенсивности LED |
| sensitivity | Диапазон чувствительности |
| strength_ir | Диапазон интенсивности ИК-подсветки |

<!-- Source EN PDF p.45; unit 369 -->

#### 3.3.8  rk_aiq_rect_t

<!-- Source EN PDF p.45; unit 370 -->

【Описание】Определение структуры параметров кадрирования.

<!-- Source EN PDF p.45; unit 371 -->

【Определение】

<!-- Source EN PDF p.45; unit 372 -->

```text
 typedef struct rk_aiq_rect_s {
     int left;
     int top;
     int width;
     int height;
 } rk_aiq_rect_t;
```

<!-- Source EN PDF p.45; unit 373 -->

【Члены】

<!-- Source EN PDF p.45; unit 374 -->

| Имя члена | Описание |
|---|---|
| left | Горизонтальное смещение вывода |
| top | Вертикальное смещение вывода |
| width | Размер вывода по горизонтали |
| height | Размер вывода по вертикали |

<!-- Source EN PDF p.46; unit 375 -->

## 4. Офлайновая обработка кадров

<!-- Source EN PDF p.46; unit 376 -->

### 4.1 Обзор

<!-- Source EN PDF p.46; unit 377 -->

RKAIQ поддерживает офлайновую обработку кадров RAW: разбирает файл собственного формата RAW RK, передаёт его ISP и выводит изображение, пригодное для нормального отображения.

<!-- Source EN PDF p.46; unit 378 -->

Примечание: функция офлайновой обработки кадров не протестирована.

<!-- Source EN PDF p.46; unit 379 -->

### 4.2 Функциональная схема

<!-- Source EN PDF p.46; unit 380 -->

![Технический рисунок английского оригинала — PDF p.46](/docs/rockchip-isp30-development/assets/en-p046-X802.png)

<!-- Source EN PDF p.46; unit 381 -->

Схема офлайновой обработки кадров

<!-- Source EN PDF p.46; unit 382 -->

### 4.3 Описание функций

<!-- Source EN PDF p.46; unit 383 -->

Поддерживается ввод файла RK-RAW. При файловом интерфейсе вызывающий процесс блокируется до завершения обработки файла и успешного вывода.

<!-- Source EN PDF p.46; unit 384 -->

Поддерживается ввод буфера RK-RAW с асинхронной обработкой. Процесс не блокируется; после обработки буфера вызывается обратный вызов, если он зарегистрирован.

<!-- Source EN PDF p.47; unit 385 -->

Поддерживается ввод буфера RK-RAW с синхронной обработкой. Процесс блокируется до окончания обработки буфера и успешного вывода.

<!-- Source EN PDF p.47; unit 386 -->

### 4.4 Формат RK-RAW

<!-- Source EN PDF p.47; unit 387 -->

См. документ RK RAW File Format.

<!-- Source EN PDF p.47; unit 388 -->

### 4.5 Поддерживаемые форматы RAW

<!-- Source EN PDF p.47; unit 389 -->

Поддерживаются raw8/raw10/raw12 и четыре формата Bayer: BGGR/GBRG/GRBG/RGGB.

<!-- Source EN PDF p.47; unit 390 -->

### 4.6 Справочник API

<!-- Source EN PDF p.47; unit 391 -->

### 4.7 Структуры данных

<!-- Source EN PDF p.47; unit 392 -->

### 4.8 Особенности использования

<!-- Source EN PDF p.47; unit 393 -->

При создании AIQ Context для обработки RK Raw параметр sns_ent_name интерфейса rk_aiq_uapi2_sysctl_init должен быть "FakeCamera".

<!-- Source EN PDF p.47; unit 394 -->

Обработка Raw зависит от файла эффектов IQ XML. XML должен быть подготовлен для того же разрешения, что и входной кадр RK Raw; файл необходимо назвать FakeCamera.xml и поместить в путь загрузки XML.

<!-- Source EN PDF p.47; unit 395 -->

### 4.9 Пример использования

<!-- Source EN PDF p.47; unit 396 -->

Пример работы с API офлайновой обработки кадров: rkisp_demo, путь YOUR_SDK_DIR/external/camera_engine_rkaiq/rkisp_demo.

<!-- Source EN PDF p.48; unit 397 -->

## 5. Группы камер

<!-- Source EN PDF p.48; unit 398 -->

### 5.1 Обзор

<!-- Source EN PDF p.48; unit 399 -->

В круговом обзоре и подобных сценариях камеры объединяют для общего управления и настройки экспозиции и других параметров. Для этого создают group. Camera Group API основан на AIQ API отдельной камеры; если не оговорено иное, API отдельного AIQ подходит и группе. По типу переданного Context AIQ направляет запрос группе либо одной камере.

<!-- Source EN PDF p.48; unit 400 -->

#### 5.1.1  rk_aiq_uapi2_camgroup_create

<!-- Source EN PDF p.48; unit 401 -->

【Описание】При создании Camera group для каждой Camera создаётся отдельный AIQ ctx, управляемый Group Ctx.

<!-- Source EN PDF p.48; unit 402 -->

【Синтаксис】

<!-- Source EN PDF p.48; unit 403 -->

```text
 rk_aiq_camgroup_ctx_t*
 rk_aiq_uapi2_camgroup_create (rk_aiq_camgroup_instance_cfg_t* cfg);
```

<!-- Source EN PDF p.48; unit 404 -->

【Параметр】

<!-- Source EN PDF p.48; unit 405 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| cfg | Параметры настройки | Вход |

<!-- Source EN PDF p.48; unit 406 -->

【Возвращаемое значение】

<!-- Source EN PDF p.48; unit 407 -->

| Возвращаемое значение | Описание |
|---|---|
| rk_aiq_camgroup_ctx_t* | Рабочий контекст группы |
| NULL | Ошибка |

<!-- Source EN PDF p.48; unit 408 -->

【Зависимости】

<!-- Source EN PDF p.48; unit 409 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h

<!-- Source EN PDF p.48; unit 410 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.48; unit 411 -->

【Примечание】

<!-- Source EN PDF p.48; unit 412 -->

rk_aiq_uapi2_sysctl_init создаёт среду AIQ отдельной камеры. Для sensor entity, среда которой уже создана этой функцией, нельзя дополнительно создавать групповую среду через rk_aiq_uapi2_camgroup_create, и наоборот.

<!-- Source EN PDF p.49; unit 413 -->

Сцена IQ по умолчанию — normal-day. Для HDR и других режимов предварительно настройте сцену через rk_aiq_uapi2_sysctl_preInit_scene.

<!-- Source EN PDF p.49; unit 414 -->

#### 5.1.2  rk_aiq_uapi2_camgroup_prepare

<!-- Source EN PDF p.49; unit 415 -->

【Описание】Создаёт начальные параметры и тракты согласно выбранному режиму pipeline, вызывая rk_aiq_uapi2_sysctl_prepare для AIQ ctx каждой Camera.

<!-- Source EN PDF p.49; unit 416 -->

【Синтаксис】

<!-- Source EN PDF p.49; unit 417 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_prepare (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.49; unit 418 -->

【Параметр】

<!-- Source EN PDF p.49; unit 419 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |
| mode | Режим работы pipeline | Вход |

<!-- Source EN PDF p.49; unit 420 -->

【Возвращаемое значение】

<!-- Source EN PDF p.49; unit 421 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | См. коды ошибок |

<!-- Source EN PDF p.49; unit 422 -->

【Зависимости】

<!-- Source EN PDF p.49; unit 423 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.49; unit 424 -->

#### 5.1.3  rk_aiq_uapi2_camgroup_start

<!-- Source EN PDF p.49; unit 425 -->

【Описание】Запускает группу камер, вызывая rk_aiq_uapi2_sysctl_start для AIQ ctx каждой Camera.

<!-- Source EN PDF p.49; unit 426 -->

【Синтаксис】

<!-- Source EN PDF p.49; unit 427 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_start (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.49; unit 428 -->

【Параметр】

<!-- Source EN PDF p.50; unit 429 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |

<!-- Source EN PDF p.50; unit 430 -->

【Возвращаемое значение】

<!-- Source EN PDF p.50; unit 431 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. коды ошибок |

<!-- Source EN PDF p.50; unit 432 -->

【Зависимости】

<!-- Source EN PDF p.50; unit 433 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.50; unit 434 -->

#### 5.1.4  rk_aiq_uapi2_camgroup_stop

<!-- Source EN PDF p.50; unit 435 -->

【Описание】Останавливает группу камер, вызывая rk_aiq_uapi2_sysctl_stop для AIQ ctx каждой Camera.

<!-- Source EN PDF p.50; unit 436 -->

【Синтаксис】

<!-- Source EN PDF p.50; unit 437 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_stop (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.50; unit 438 -->

【Параметр】

<!-- Source EN PDF p.50; unit 439 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |

<!-- Source EN PDF p.50; unit 440 -->

【Возвращаемое значение】

<!-- Source EN PDF p.50; unit 441 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. коды ошибок |

<!-- Source EN PDF p.50; unit 442 -->

【Зависимости】

<!-- Source EN PDF p.50; unit 443 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.51; unit 444 -->

#### 5.1.5  rk_aiq_uapi2_camgroup_destroy

<!-- Source EN PDF p.51; unit 445 -->

【Описание】Уничтожает группу камер, вызывая rk_aiq_uapi2_sysctl_deinit для AIQ ctx каждой Camera.

<!-- Source EN PDF p.51; unit 446 -->

【Синтаксис】

<!-- Source EN PDF p.51; unit 447 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_destroy (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 448 -->

【Параметр】

<!-- Source EN PDF p.51; unit 449 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |

<!-- Source EN PDF p.51; unit 450 -->

【Возвращаемое значение】

<!-- Source EN PDF p.51; unit 451 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. коды ошибок |

<!-- Source EN PDF p.51; unit 452 -->

【Зависимости】

<!-- Source EN PDF p.51; unit 453 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.51; unit 454 -->

#### 5.1.6  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.51; unit 455 -->

【Описание】В круговом обзоре получает сведения о перекрытии камер из контекста CameraGroup.

<!-- Source EN PDF p.51; unit 456 -->

【Синтаксис】

<!-- Source EN PDF p.51; unit 457 -->

```text
 struct RK_PS_SrcOverlapMap*
 rk_aiq_uapi2_camgroup_getOverlapMap (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 458 -->

【Параметр】

<!-- Source EN PDF p.51; unit 459 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |

<!-- Source EN PDF p.51; unit 460 -->

【Возвращаемое значение】

<!-- Source EN PDF p.52; unit 461 -->

| Возвращаемое значение | Описание |
|---|---|
| struct RK_PS_SrcOverlapMap* | Указатель структуры сведений о перекрытии |
| NULL | Ошибка |

<!-- Source EN PDF p.52; unit 462 -->

【Зависимости】

<!-- Source EN PDF p.52; unit 463 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.52; unit 464 -->

#### 5.1.7  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.52; unit 465 -->

【Описание】В круговом обзоре получает сведения о перекрытии камер из файла.

<!-- Source EN PDF p.52; unit 466 -->

【Синтаксис】

<!-- Source EN PDF p.52; unit 467 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getOverlapMap_from_file (const char* map_file,
                                                             struct
 RK_PS_SrcOverlapMap** overlapMap);
```

<!-- Source EN PDF p.52; unit 468 -->

【Параметр】

<!-- Source EN PDF p.52; unit 469 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| map_file | Файл со сведениями о перекрытии | Вход |
| overlapMap | Хранит полученные сведения о перекрытии | Вход, выход |

<!-- Source EN PDF p.52; unit 470 -->

【Возвращаемое значение】

<!-- Source EN PDF p.52; unit 471 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. коды ошибок |

<!-- Source EN PDF p.52; unit 472 -->

【Зависимости】

<!-- Source EN PDF p.52; unit 473 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.52; unit 474 -->

#### 5.1.8  rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm

<!-- Source EN PDF p.52; unit 475 -->

【Описание】Получает контекст AIQ отдельной Camera по имени сущности Sensor в группе.

<!-- Source EN PDF p.52; unit 476 -->

【Синтаксис】

<!-- Source EN PDF p.53; unit 477 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 const char* sns_entity_name);
```

<!-- Source EN PDF p.53; unit 478 -->

【Параметр】

<!-- Source EN PDF p.53; unit 479 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |
| sns_entity_name | Имя сущности sensor в группе | Вход |

<!-- Source EN PDF p.53; unit 480 -->

【Возвращаемое значение】

<!-- Source EN PDF p.53; unit 481 -->

| Возвращаемое значение | Описание |
|---|---|
| rk_aiq_sys_ctx_t* | Полученная рабочая среда AIQ |
| NULL | Ошибка |

<!-- Source EN PDF p.53; unit 482 -->

【Зависимости】

<!-- Source EN PDF p.53; unit 483 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.53; unit 484 -->

#### 5.1.9  rk_aiq_uapi2_camgroup_getCamInfos

<!-- Source EN PDF p.53; unit 485 -->

【Описание】Получает сведения о камерах группы, например имена сущностей sensor.

<!-- Source EN PDF p.53; unit 486 -->

【Синтаксис】

<!-- Source EN PDF p.53; unit 487 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getCamInfos (rk_aiq_camgroup_ctx_t* camgroup_ctx,
                    rk_aiq_camgroup_camInfos_t* camInfos);
```

<!-- Source EN PDF p.53; unit 488 -->

【Параметр】

<!-- Source EN PDF p.53; unit 489 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| camgroup_ctx | Рабочий контекст группы | Вход |
| camInfos | Полученные сведения о камерах группы | Выход |

<!-- Source EN PDF p.53; unit 490 -->

【Возвращаемое значение】

<!-- Source EN PDF p.53; unit 491 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. коды ошибок |

<!-- Source EN PDF p.54; unit 492 -->

【Зависимости】

<!-- Source EN PDF p.54; unit 493 -->

Заголовочный файл: rk_aiq_user_api2_camgroup.h; библиотека: librkaiq.so

<!-- Source EN PDF p.54; unit 494 -->

#### 5.1.10  rk_aiq_uapi2_camgroup_bind

<!-- Source EN PDF p.54; unit 495 -->

【Описание】Зарезервированный интерфейс, не реализован.

<!-- Source EN PDF p.54; unit 496 -->

#### 5.1.11  rk_aiq_uapi2_camgroup_unbind

<!-- Source EN PDF p.54; unit 497 -->

【Описание】Зарезервированный интерфейс, не реализован.

<!-- Source EN PDF p.54; unit 498 -->

### 5.2 Структуры данных

<!-- Source EN PDF p.54; unit 499 -->

#### 5.2.1  rk_aiq_camgroup_instance_cfg_t

<!-- Source EN PDF p.54; unit 500 -->

【Описание】Параметры Carmelaghrup (написание исходника).

<!-- Source EN PDF p.54; unit 501 -->

【Определение】

<!-- Source EN PDF p.54; unit 502 -->

```text
   typedef struct rk_aiq_camgroup_instance_cfg_s {
       const char* sns_ent_nm_array[RK_AIQ_CAM_GROUP_MAX_CAMS];
       int sns_num;
       const char* config_file_dir;
        /* followings are relative path to config_file_dir */
        const char* single_iq_file;
        const char* group_iq_file;
        const char* overlap_map_file;
    } rk_aiq_camgroup_instance_cfg_t;
```

<!-- Source EN PDF p.54; unit 503 -->

【Члены】

<!-- Source EN PDF p.55; unit 504 -->

| Имя члена | Описание |
|---|---|
| sns_ent_nm_array | Массив сущностей Sensor, которые нужно включить в управление группой. |
| sns_num | Количество сущностей sensor, добавляемых в группу. |
| config_file_dir | Задаёт путь к файлам IQ. |
| single_iq_file | Задаёт имя файла IQ; допускается NULL, тогда AIQ выбирает файл автоматически. |
| group_iq_file | Заданный файл IQ для Camera group; пока не используется. |
| overlap_map_file | Задаёт файл сведений о перекрытии Camera; допускается NULL. |

<!-- Source EN PDF p.55; unit 505 -->

#### 5.2.2  rk_aiq_camgroup_camInfos_t

<!-- Source EN PDF p.55; unit 506 -->

【Описание】Сведения о каждой камере Camera group.

<!-- Source EN PDF p.55; unit 507 -->

【Определение】

<!-- Source EN PDF p.55; unit 508 -->

```text
    typedef struct rk_aiq_camgroup_camInfos_s {
        int valid_sns_num;
        const char* sns_ent_nm[RK_AIQ_CAM_GROUP_MAX_CAMS];
        int sns_camPhyId[RK_AIQ_CAM_GROUP_MAX_CAMS];
   } rk_aiq_camgroup_camInfos_t;
```

<!-- Source EN PDF p.55; unit 509 -->

【Члены】

<!-- Source EN PDF p.55; unit 510 -->

| Имя члена | Описание |
|---|---|
| valid_sns_num | Количество сущностей Sensor в группе. |
| sns_ent_nm | Массив имён сущностей Sensor в группе. |
| sns_camPhyId | Массив физических ID, соответствующих сущностям Sensor в группе. |

<!-- Source EN PDF p.55; unit 511 -->

#### 5.2.3  struct RK_PS_SrcOverlapMap

<!-- Source EN PDF p.55; unit 512 -->

【Описание】Определение областей перекрытия камер.

<!-- Source EN PDF p.55; unit 513 -->

【Определение】

<!-- Source EN PDF p.55; unit 514 -->

```text
        struct RK_PS_SrcOverlapMap
      {
            char versionInfo[64];
            RK_PS_SrcOverlapPosition srcOverlapPositon[8];
            unsigned char overlapMap[15 * 15 * 8];
        };
```

<!-- Source EN PDF p.56; unit 515 -->

【Члены】

<!-- Source EN PDF p.56; unit 516 -->

| Имя члена | Описание |
|---|---|
| versionInfo | Сведения о версии |
| srcOverlapPositon | Угол поворота каждой камеры: 0, 90, 180 или 270 градусов. |
| overlapMap | Сведения о перекрытии статистических блоков восьми камер: у каждой камеры сетка 15*15; всего восемь камер с номерами 0~7. Если камер меньше восьми, соответствующие позиции заполняются нулями. Запись построчная: сначала первая строка всех восьми камер, затем вторая и т. д. Диапазон 0~255: 0 — нет перекрытия, 255 — полное перекрытие; частичное перекрытие интерполируется пропорционально. Порядок: camera0 row0; camera1 row0; camera2 row0; camera3 row0; camera4 row0; camera5 row0; camera6 row0; camera7 row0; camera0 row1; camera1 row1; camera2 row1; camera3 row1; camera4 row1; camera5 row1; camera6 row1; camera7 row1; ...... camera0 row14; camera1 row14; camera2 row14; camera3 row14; camera4 row14; camera5 row14; camera6 row14; camera7 row14; |

<!-- Source EN PDF p.57; unit 517 -->

## 6.   AE

<!-- Source EN PDF p.57; unit 518 -->

### 6.1 Обзор

<!-- Source EN PDF p.57; unit 519 -->

Модуль AE определяет экспозицию текущего изображения системой автоматического замера и автоматически настраивает диафрагму объектива, затвор и усиление sensor для наилучшего качества изображения.

<!-- Source EN PDF p.57; unit 520 -->

### 6.2 Основные понятия

<!-- Source EN PDF p.57; unit 521 -->

Время экспозиции: время накопления заряда sensor, от начала экспонирования пикселя до считывания заряда.

<!-- Source EN PDF p.57; unit 522 -->

Усиление экспозиции: общий коэффициент усиления выходного заряда sensor, обычно включающий цифровое и аналоговое усиление. Аналоговое вносит несколько меньше шума, поэтому обычно предпочтительнее.

<!-- Source EN PDF p.57; unit 523 -->

Диафрагма: механизм объектива, изменяющий размер светового отверстия.

<!-- Source EN PDF p.57; unit 524 -->

Подавление мерцания: устраняет мерцание из-за несовпадения частоты питания лампы и частоты кадров sensor; обычно ограничивает выдержку и изменяет частоту кадров sensor.

<!-- Source EN PDF p.57; unit 525 -->

### 6.3 Описание функций

<!-- Source EN PDF p.57; unit 526 -->

Модуль AE состоит из статистики AE и алгоритма стратегии управления AE.

<!-- Source EN PDF p.57; unit 527 -->

### 6.4 Справочник функционального API

<!-- Source EN PDF p.57; unit 528 -->

#### 6.4.1  rk_aiq_uapi2_setAeLock

<!-- Source EN PDF p.57; unit 529 -->

【Описание】

<!-- Source EN PDF p.57; unit 530 -->

Настройка блокировки экспозиции AE.

<!-- Source EN PDF p.57; unit 531 -->

【Синтаксис】

<!-- Source EN PDF p.57; unit 532 -->

```text
 XCamReturn rk_aiq_uapi2_setAeLock（const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.57; unit 533 -->

【Параметры】

<!-- Source EN PDF p.57; unit 534 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| on | Включение блокировки | Вход |

<!-- Source EN PDF p.58; unit 535 -->

【Возвращаемое значение】

<!-- Source EN PDF p.58; unit 536 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 |  |

<!-- Source EN PDF p.58; unit 537 -->

#### 6.4.2  rk_aiq_uapi2_setExpMode

<!-- Source EN PDF p.58; unit 538 -->

【Описание】Установка автоматического или ручного режима экспозиции.

<!-- Source EN PDF p.58; unit 539 -->

【Синтаксис】

<!-- Source EN PDF p.58; unit 540 -->

```text
 XCamReturn rk_aiq_uapi2_setExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.58; unit 541 -->

【Параметры】

<!-- Source EN PDF p.58; unit 542 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим экспозиции | Вход |

<!-- Source EN PDF p.58; unit 543 -->

【Возвращаемое значение】

<!-- Source EN PDF p.58; unit 544 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.58; unit 545 -->

【Примечание】

<!-- Source EN PDF p.58; unit 546 -->

При переходе к ручной экспозиции усиление и выдержка берутся из начальных значений файла эффектов. Чтобы одновременно задать экспозицию, используйте rk_aiq_uapi2_setManualExp.

<!-- Source EN PDF p.58; unit 547 -->

【Зависимости】

<!-- Source EN PDF p.58; unit 548 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.58; unit 549 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.58; unit 550 -->

#### 6.4.3  rk_aiq_uapi2_getExpMode

<!-- Source EN PDF p.58; unit 551 -->

【Описание】Получение режима экспозиции.

<!-- Source EN PDF p.58; unit 552 -->

【Синтаксис】

<!-- Source EN PDF p.59; unit 553 -->

```text
 XCamReturn rk_aiq_uapi2_getExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.59; unit 554 -->

【Параметры】

<!-- Source EN PDF p.59; unit 555 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим экспозиции | Выход |

<!-- Source EN PDF p.59; unit 556 -->

【Возвращаемое значение】

<!-- Source EN PDF p.59; unit 557 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.59; unit 558 -->

【Зависимости】

<!-- Source EN PDF p.59; unit 559 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.59; unit 560 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.59; unit 561 -->

#### 6.4.4  rk_aiq_uapi2_setManualExp

<!-- Source EN PDF p.59; unit 562 -->

【Описание】Установка ручной экспозиции с заданием усиления и выдержки.

<!-- Source EN PDF p.59; unit 563 -->

【Синтаксис】

<!-- Source EN PDF p.59; unit 564 -->

```text
 XCamReturn rk_aiq_uapi2_setManualExp(const rk_aiq_sys_ctx_t* ctx, float gain,
 float time);
```

<!-- Source EN PDF p.59; unit 565 -->

【Параметры】

<!-- Source EN PDF p.59; unit 566 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| gain | Усиление экспозиции | Вход |
| time | Время экспозиции | Вход |

<!-- Source EN PDF p.59; unit 567 -->

【Возвращаемое значение】

<!-- Source EN PDF p.59; unit 568 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.59; unit 569 -->

【Зависимости】

<!-- Source EN PDF p.60; unit 570 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 571 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.60; unit 572 -->

#### 6.4.5  rk_aiq_uapi2_setExpGainRange

<!-- Source EN PDF p.60; unit 573 -->

【Описание】Установка диапазона усиления.

<!-- Source EN PDF p.60; unit 574 -->

【Синтаксис】

<!-- Source EN PDF p.60; unit 575 -->

```text
 XCamReturn rk_aiq_uapi2_setExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 576 -->

【Параметры】

<!-- Source EN PDF p.60; unit 577 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| gain | Диапазон усиления экспозиции | Вход |

<!-- Source EN PDF p.60; unit 578 -->

【Возвращаемое значение】

<!-- Source EN PDF p.60; unit 579 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.60; unit 580 -->

【Зависимости】

<!-- Source EN PDF p.60; unit 581 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 582 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.60; unit 583 -->

#### 6.4.6  rk_aiq_uapi2_getExpGainRange

<!-- Source EN PDF p.60; unit 584 -->

【Описание】Получение диапазона усиления.

<!-- Source EN PDF p.60; unit 585 -->

【Синтаксис】

<!-- Source EN PDF p.60; unit 586 -->

```text
 XCamReturn rk_aiq_uapi2_getExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 587 -->

【Параметры】

<!-- Source EN PDF p.61; unit 588 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| gain | Диапазон усиления экспозиции | Выход |

<!-- Source EN PDF p.61; unit 589 -->

【Возвращаемое значение】

<!-- Source EN PDF p.61; unit 590 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.61; unit 591 -->

【Зависимости】

<!-- Source EN PDF p.61; unit 592 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 593 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.61; unit 594 -->

#### 6.4.7  rk_aiq_uapi2_setExpTimeRange

<!-- Source EN PDF p.61; unit 595 -->

【Описание】Установка диапазона выдержки.

<!-- Source EN PDF p.61; unit 596 -->

【Синтаксис】

<!-- Source EN PDF p.61; unit 597 -->

```text
 XCamReturn rk_aiq_uapi2_setExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.61; unit 598 -->

【Параметры】

<!-- Source EN PDF p.61; unit 599 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| time | Диапазон выдержки | Вход |

<!-- Source EN PDF p.61; unit 600 -->

【Возвращаемое значение】

<!-- Source EN PDF p.61; unit 601 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.61; unit 602 -->

【Зависимости】

<!-- Source EN PDF p.61; unit 603 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 604 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.62; unit 605 -->

#### 6.4.8  rk_aiq_uapi2_getExpTimeRange

<!-- Source EN PDF p.62; unit 606 -->

【Описание】Получение диапазона выдержки.

<!-- Source EN PDF p.62; unit 607 -->

【Синтаксис】

<!-- Source EN PDF p.62; unit 608 -->

```text
 XCamReturn rk_aiq_uapi2_getExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.62; unit 609 -->

【Параметры】

<!-- Source EN PDF p.62; unit 610 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| time | Диапазон выдержки | Выход |

<!-- Source EN PDF p.62; unit 611 -->

【Возвращаемое значение】

<!-- Source EN PDF p.62; unit 612 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.62; unit 613 -->

【Зависимости】

<!-- Source EN PDF p.62; unit 614 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.62; unit 615 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.62; unit 616 -->

#### 6.4.9  rk_aiq_uapi2_setBLCMode

<!-- Source EN PDF p.62; unit 617 -->

【Описание】Включение компенсации контрового света и выбор области.

<!-- Source EN PDF p.62; unit 618 -->

【Синтаксис】

<!-- Source EN PDF p.62; unit 619 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCMode(const rk_aiq_sys_ctx_t* ctx, bool on,
 aeMeasAreaType_t areaType);
```

<!-- Source EN PDF p.62; unit 620 -->

【Параметры】

<!-- Source EN PDF p.62; unit 621 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Вход |
| areaType | Выбор области компенсации | Вход |

<!-- Source EN PDF p.62; unit 622 -->

【Возвращаемое значение】

<!-- Source EN PDF p.63; unit 623 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.63; unit 624 -->

【Примечание】

<!-- Source EN PDF p.63; unit 625 -->

Интерфейс доступен только в линейном режиме.

<!-- Source EN PDF p.63; unit 626 -->

【Зависимости】

<!-- Source EN PDF p.63; unit 627 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 628 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.63; unit 629 -->

#### 6.4.10  rk_aiq_uapi2_setBLCStrength

<!-- Source EN PDF p.63; unit 630 -->

【Описание】Установка степени усиления тёмных областей.

<!-- Source EN PDF p.63; unit 631 -->

【Синтаксис】

<!-- Source EN PDF p.63; unit 632 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.63; unit 633 -->

【Параметры】

<!-- Source EN PDF p.63; unit 634 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| strength | Степень усиления, диапазон [1,100]. | Вход |

<!-- Source EN PDF p.63; unit 635 -->

【Возвращаемое значение】

<!-- Source EN PDF p.63; unit 636 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.63; unit 637 -->

【Примечание】

<!-- Source EN PDF p.63; unit 638 -->

Интерфейс доступен только в линейном режиме.

<!-- Source EN PDF p.63; unit 639 -->

【Зависимости】

<!-- Source EN PDF p.63; unit 640 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 641 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.64; unit 642 -->

#### 6.4.11  rk_aiq_uapi2_setHLCMode

<!-- Source EN PDF p.64; unit 643 -->

【Описание】Включение подавления ярких областей.

<!-- Source EN PDF p.64; unit 644 -->

【Синтаксис】

<!-- Source EN PDF p.64; unit 645 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCMode(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.64; unit 646 -->

【Параметры】

<!-- Source EN PDF p.64; unit 647 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Вход |

<!-- Source EN PDF p.64; unit 648 -->

【Возвращаемое значение】

<!-- Source EN PDF p.64; unit 649 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.64; unit 650 -->

【Примечание】

<!-- Source EN PDF p.64; unit 651 -->

Интерфейс доступен только в линейном режиме.

<!-- Source EN PDF p.64; unit 652 -->

【Зависимости】

<!-- Source EN PDF p.64; unit 653 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.64; unit 654 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.64; unit 655 -->

#### 6.4.12  rk_aiq_uapi2_setHLCStrength

<!-- Source EN PDF p.64; unit 656 -->

【Описание】Установка степени подавления ярких областей.

<!-- Source EN PDF p.64; unit 657 -->

【Синтаксис】

<!-- Source EN PDF p.64; unit 658 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.64; unit 659 -->

【Параметры】

<!-- Source EN PDF p.64; unit 660 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| strength | Степень подавления, диапазон [1,100]. | Вход |

<!-- Source EN PDF p.65; unit 661 -->

【Возвращаемое значение】

<!-- Source EN PDF p.65; unit 662 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.65; unit 663 -->

【Примечание】

<!-- Source EN PDF p.65; unit 664 -->

Интерфейс доступен только в линейном режиме.

<!-- Source EN PDF p.65; unit 665 -->

【Зависимости】

<!-- Source EN PDF p.65; unit 666 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 667 -->

Библиотека: librkaiq.sov (написание исходника, требуется проверка).

<!-- Source EN PDF p.65; unit 668 -->

#### 6.4.13  rk_aiq_uapi2_setAntiFlickerEn

<!-- Source EN PDF p.65; unit 669 -->

【Описание】Включение подавления мерцания на частоте сети.

<!-- Source EN PDF p.65; unit 670 -->

【Синтаксис】

<!-- Source EN PDF p.65; unit 671 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool on)；
```

<!-- Source EN PDF p.65; unit 672 -->

【Параметры】

<!-- Source EN PDF p.65; unit 673 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| on | Параметры включения функции | Вход |

<!-- Source EN PDF p.65; unit 674 -->

【Возвращаемое значение】

<!-- Source EN PDF p.65; unit 675 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.65; unit 676 -->

【Зависимости】

<!-- Source EN PDF p.65; unit 677 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 678 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.66; unit 679 -->

#### 6.4.14  rk_aiq_uapi2_getAntiFlickerEn

<!-- Source EN PDF p.66; unit 680 -->

【Описание】Включение подавления мерцания на частоте сети.

<!-- Source EN PDF p.66; unit 681 -->

【Синтаксис】

<!-- Source EN PDF p.66; unit 682 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool* on)；
```

<!-- Source EN PDF p.66; unit 683 -->

【Параметры】

<!-- Source EN PDF p.66; unit 684 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| on | Параметры включения функции | Вход |

<!-- Source EN PDF p.66; unit 685 -->

【Возвращаемое значение】

<!-- Source EN PDF p.66; unit 686 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.66; unit 687 -->

【Зависимости】

<!-- Source EN PDF p.66; unit 688 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.66; unit 689 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.66; unit 690 -->

#### 6.4.15  rk_aiq_uapi2_setAntiFlickerMode

<!-- Source EN PDF p.66; unit 691 -->

【Описание】Установка режима подавления мерцания.

<!-- Source EN PDF p.66; unit 692 -->

【Синтаксис】

<!-- Source EN PDF p.66; unit 693 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t mode);
```

<!-- Source EN PDF p.66; unit 694 -->

【Параметры】

<!-- Source EN PDF p.66; unit 695 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим подавления мерцания | Вход |

<!-- Source EN PDF p.66; unit 696 -->

【Возвращаемое значение】

<!-- Source EN PDF p.67; unit 697 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.67; unit 698 -->

【Зависимости】

<!-- Source EN PDF p.67; unit 699 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 700 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.67; unit 701 -->

#### 6.4.16  rk_aiq_uapi2_getAntiFlickerMode

<!-- Source EN PDF p.67; unit 702 -->

【Описание】Получение режима подавления мерцания.

<!-- Source EN PDF p.67; unit 703 -->

【Синтаксис】

<!-- Source EN PDF p.67; unit 704 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t *mode);
```

<!-- Source EN PDF p.67; unit 705 -->

【Параметры】

<!-- Source EN PDF p.67; unit 706 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим подавления мерцания | Выход |

<!-- Source EN PDF p.67; unit 707 -->

【Возвращаемое значение】

<!-- Source EN PDF p.67; unit 708 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.67; unit 709 -->

【Зависимости】

<!-- Source EN PDF p.67; unit 710 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 711 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.67; unit 712 -->

#### 6.4.17  rk_aiq_uapi2_setExpPwrLineFreqMode

<!-- Source EN PDF p.67; unit 713 -->

【Описание】Установка частоты подавления мерцания.

<!-- Source EN PDF p.67; unit 714 -->

【Синтаксис】

<!-- Source EN PDF p.67; unit 715 -->

```text
 XCamReturn rk_aiq_uapi2_setExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t freq);
```

<!-- Source EN PDF p.68; unit 716 -->

【Параметры】

<!-- Source EN PDF p.68; unit 717 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| freq | Частота подавления мерцания | Вход |

<!-- Source EN PDF p.68; unit 718 -->

【Возвращаемое значение】

<!-- Source EN PDF p.68; unit 719 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.68; unit 720 -->

【Зависимости】

<!-- Source EN PDF p.68; unit 721 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 722 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.68; unit 723 -->

#### 6.4.18  rk_aiq_uapi2_getExpPwrLineFreqMode

<!-- Source EN PDF p.68; unit 724 -->

【Описание】Получение частоты подавления мерцания.

<!-- Source EN PDF p.68; unit 725 -->

【Синтаксис】

<!-- Source EN PDF p.68; unit 726 -->

```text
 XCamReturn rk_aiq_uapi2_getExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t *freq);
```

<!-- Source EN PDF p.68; unit 727 -->

【Параметры】

<!-- Source EN PDF p.68; unit 728 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| freq | Частота подавления мерцания | Выход |

<!-- Source EN PDF p.68; unit 729 -->

【Возвращаемое значение】

<!-- Source EN PDF p.68; unit 730 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.68; unit 731 -->

【Зависимости】

<!-- Source EN PDF p.68; unit 732 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 733 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.69; unit 734 -->

### 6.5 Типы данных функционального API

<!-- Source EN PDF p.69; unit 735 -->

#### 6.5.1  opMode_t

<!-- Source EN PDF p.69; unit 736 -->

【Описание】Определение автоматического и ручного режимов.

<!-- Source EN PDF p.69; unit 737 -->

【Определение】

<!-- Source EN PDF p.69; unit 738 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.69; unit 739 -->

【Члены】

<!-- Source EN PDF p.69; unit 740 -->

| Имя члена | Описание |
|---|---|
| OP_AUTO | Автоматический режим |
| OP_MANUALl | Ручной режим |
| OP_INVAL | Недопустимое значение |

<!-- Source EN PDF p.69; unit 741 -->

#### 6.5.2  paRange_t

<!-- Source EN PDF p.69; unit 742 -->

【Описание】Определение диапазона параметра.

<!-- Source EN PDF p.69; unit 743 -->

【Определение】

<!-- Source EN PDF p.69; unit 744 -->

```text
 typedef struct paRange_s {
     float max;
     float min;
 } paRange_t;
```

<!-- Source EN PDF p.69; unit 745 -->

【Члены】

<!-- Source EN PDF p.69; unit 746 -->

| Имя члена | Описание |
|---|---|
| max | Верхняя граница |
| min | Нижняя граница |

<!-- Source EN PDF p.70; unit 747 -->

#### 6.5.3  aeMeasAreaType_t

<!-- Source EN PDF p.70; unit 748 -->

【Описание】Определение типа области измерения AE.

<!-- Source EN PDF p.70; unit 749 -->

【Определение】

<!-- Source EN PDF p.70; unit 750 -->

```text
 typedef enum aeMeasAreaType_e {
     AE_MEAS_AREA_AUTO = 0,
     AE_MEAS_AREA_UP,
     AE_MEAS_AREA_BOTTOM,
     AE_MEAS_AREA_LEFT,
     AE_MEAS_AREA_RIGHT,
     AE_MEAS_AREA_CENTER,
 } aeMeasAreaType_t;
```

<!-- Source EN PDF p.70; unit 751 -->

【Члены】

<!-- Source EN PDF p.70; unit 752 -->

| Имя члена | Описание |
|---|---|
| AE_MEAS_AREA_AUTO | Автоматически |
| AE_MEAS_AREA_UP | Верхняя область |
| AE_MEAS_AREA_BOTTOM | Нижняя область |
| AE_MEAS_AREA_LEFT | Левая область |
| AE_MEAS_AREA_RIGHT | Правая область |
| AE_MEAS_AREA_CENTER | Центральная область |

<!-- Source EN PDF p.70; unit 753 -->

#### 6.5.4  expPwrLineFreq_t

<!-- Source EN PDF p.70; unit 754 -->

【Описание】Определение частоты подавления мерцания.

<!-- Source EN PDF p.70; unit 755 -->

【Определение】

<!-- Source EN PDF p.70; unit 756 -->

```text
 typedef enum expPwrLineFreq_e {
        EXP_PWR_LINE_FREQ_DIS   = 0,
        EXP_PWR_LINE_FREQ_50HZ  = 1,
        EXP_PWR_LINE_FREQ_60HZ  = 2,
 } expPwrLineFreq_t;
```

<!-- Source EN PDF p.70; unit 757 -->

【Члены】

<!-- Source EN PDF p.71; unit 758 -->

| Имя члена | Описание |
|---|---|
| EXP_PWR_LINE_FREQ_DIS |  |
| EXP_PWR_LINE_FREQ_50HZ | 50 Hz |
| EXP_PWR_LINE_FREQ_60HZ | 60 Hz |

<!-- Source EN PDF p.71; unit 759 -->

#### 6.5.5  antiFlickerMode_t

<!-- Source EN PDF p.71; unit 760 -->

【Описание】Определение режима подавления мерцания.

<!-- Source EN PDF p.71; unit 761 -->

【Определение】

<!-- Source EN PDF p.71; unit 762 -->

```text
 typedef enum antiFlickerMode_e {
     ANTIFLICKER_NORMAL_MODE = 0,
     ANTIFLICKER_AUTO_MODE = 1,
 } antiFlickerMode_t;
```

<!-- Source EN PDF p.71; unit 763 -->

【Члены】

<!-- Source EN PDF p.71; unit 764 -->

| Имя члена | Описание |
|---|---|
| ANTIFLICKER_NORMAL_MODE | Обычный режим |
| ANTIFLICKER_AUTO_MODE | Автоматический выбор режима |

<!-- Source EN PDF p.71; unit 765 -->

### 6.6 Справочник модульного API

<!-- Source EN PDF p.71; unit 766 -->

#### 6.6.1  rk_aiq_user_api2_ae_setExpSwAttr

<!-- Source EN PDF p.71; unit 767 -->

【Описание】Установка программных атрибутов экспозиции AE.

<!-- Source EN PDF p.71; unit 768 -->

【Синтаксис】

<!-- Source EN PDF p.71; unit 769 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                                 const Uapi_ExpSwAttrV2_t expSwAttr);
```

<!-- Source EN PDF p.71; unit 770 -->

【Параметры】

<!-- Source EN PDF p.71; unit 771 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| expSwAttr | Структура параметров управления общими функциями AE | Вход |

<!-- Source EN PDF p.71; unit 772 -->

【Возвращаемое значение】

<!-- Source EN PDF p.72; unit 773 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.72; unit 774 -->

【Зависимости】

<!-- Source EN PDF p.72; unit 775 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.72; unit 776 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.72; unit 777 -->

【Пример】

<!-- Source EN PDF p.72; unit 778 -->

Настройка ручной экспозиции

<!-- Source EN PDF p.72; unit 779 -->

Компоненты экспозиции: выдержка sensor, его усиление и цифровое усиление ISP. После выбора ручного режима задайте ручные состояния каждого компонента (ManualGainEn, ManualTimeEn, ManualIspDgainEn) и соответствующие значения. В ручном режиме все компоненты должны управляться вручную; значения ограничены sensor и объективом. При превышении ограничений sensor алгоритм автоматически исправляет значение.

<!-- Source EN PDF p.72; unit 780 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = true;
 expSwAttr.stManual.LinearAE.GainValue = 1.0f; /*gain = 1x*/
 expSwAttr.stManual.LinearAE.TimeValue = 0.02f; /*time = 1/50s*/
 //HdrAE (should set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = true;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.72; unit 781 -->

Настройка автоматической экспозиции

<!-- Source EN PDF p.72; unit 782 -->

Для автоматической экспозиции задаются диапазоны компонентов; при выходе за ограничения sensor алгоритм корректирует их автоматически.

<!-- Source EN PDF p.72; unit 783 -->

【Примечание】Параметры задания диапазона компонентов экспозиции отличаются от параметров получения диапазона.

<!-- Source EN PDF p.72; unit 784 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set time range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Max = 0.04f; /*time_max =
 0.04*/
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Min = 0.001f; /*time_min =
 0.001*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Max = 0.002f; /*sframe
 time_max = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Min = 0.001f; /*sframe
 time_min = 0.01*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Max = 0.003f; /*mframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Min = 0.002f; /*mframe
 time_min = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Max = 0.04f; /*lframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Min = 0.03f; /*lframe
 time_min = 0.02*/
 //get time range in struct "stAuto"
 printf("linear time range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stExpTimeRange.Min,
 expSwAttr.stAuto.LinAeRange.stExpTimeRange.Max);
 printf("hdr stime range=[%f,%f], mtime range=[%f,%f], ltime range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Max);
 //set gain range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 32.0f; /*gain_max = 32x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 1.0f; /*gain_min = 1x*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 32.0f; /*sframe gain_max
 = 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 1.0f; /*sframe gain_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Max = 64.0f; /*mframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Min = 1.0f; /*mframe gian_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Max = 64.0f; /*lframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Min = 1.0f; /*lframe gain_min =
 1x*/
 //get gain range in struct "stAuto"
 printf("linear gain range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stGainRange.Min,
 expSwAttr.stAuto.LinAeRange.stGainRange.Max);
 printf("hdr sgain range=[%f,%f], mgain range=[%f,%f], lgain range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stGainRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[2].Max);
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.74; unit 785 -->

Настройка полуручной экспозиции

<!-- Source EN PDF p.74; unit 786 -->

Полуручная экспозиция требует ручного управления хотя бы одним компонентом (выдержкой sensor, его усилением или цифровым усилением ISP), тогда как остальные управляются автоматически; иначе происходит выход с ошибкой. Для ручного усиления при автоматических выдержке и усилении ISP есть два способа. Способ 1: в ручном режиме задать false для ручного управления выдержкой и усилением ISP, true для усиления sensor и нужное ручное значение. Способ 2: в автоматическом режиме установить одинаковые максимум и минимум усиления, равные фиксируемому значению.

<!-- Source EN PDF p.74; unit 787 -->

【Примечание】Способ 1: в HDR ручное управление синхронно для всех кадров — соответствующие компоненты имеют одинаковое состояние. Максимальная экспозиция длинного кадра должна превышать максимальную короткого, минимальная длинного — минимальную короткого. Способ 2: в HDR состояния могут различаться, например ручное усиление короткого и автоматическое длинного кадра. Требования к превышению максимума и минимума длинного кадра над коротким сохраняются.

<!-- Source EN PDF p.74; unit 788 -->

```text
 //Method One
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = false;
 expSwAttr.stManual.LinearAE.ManualIspDgainEn = false;
 expSwAttr.stManual.LinearAE.GainValue = 2.0f; /*gain = 2x*/
 //HdrAE (need to set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = false;
 expSwAttr.stManual.HdrAE.ManualIspDgainEn = false;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //Method Two
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set gain range
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*Must be enabled*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 2.0f; /*gain_max = 2x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 2.0f;  /*gain_min = 2x*/
 //HdrAE (allow to set only one frame)
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 2.0f; /*sframe gain_max =
 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 2.0f;  /*sframe gain_min
 = 2x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 789 -->

Настройка фиксированной частоты кадров или её автоматического снижения

<!-- Source EN PDF p.75; unit 790 -->

В режиме фиксированной частоты нельзя превышать максимальную частоту, заданную драйвером; иначе выводится сообщение в журнал и настройка частоты отключается.

<!-- Source EN PDF p.75; unit 791 -->

```text
 //set fixed framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = true;
 expSwAttr.stAuto.stFrmRate.FpsValue = 25; /*fps = 25*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //set auto framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = false;
 /*Generally, the automatic frame reduction mode is configured by tuning personnel
 in advance with the minimum frame rate and the gain value corresponding to the
 switching frame rate*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 792 -->

Настройка скорости регулировки экспозиции и задержки в кадрах

<!-- Source EN PDF p.75; unit 793 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set ae speed
 expSwAttr.stAuto.stAeSpeed.DampOver = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampDark2Bright = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampUnder = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampBright2Dark = 0.8f;
 //set ae delay
 expSwAttr.stAuto.BlackDelayFrame = 2;
 expSwAttr.stAuto.WhiteDelayFrame = 4;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 794 -->

Настройка подавления мерцания

<!-- Source EN PDF p.75; unit 795 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set antifilicker mode
 expSwAttr.stAuto.stAntiFlicker.enable = true;
 expSwAttr.stAuto.stAntiFlicker.Frequency = AECV2_FLICKER_FREQUENCY_50HZ;
 expSwAttr.stAuto.stAntiFlicker.Mode = AECV2_ANTIFLICKER_AUTO_MODE;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 796 -->

Настройка весов AE

<!-- Source EN PDF p.76; unit 797 -->

Задаются веса 15X15, которые алгоритм сжимает под фактическую сетку аппаратных блоков. Можно менять веса непосредственно в JSON либо через stadvanced; при отключении последнего восстанавливаются веса JSON. Рекомендуется второй способ.

<!-- Source EN PDF p.76; unit 798 -->

Для приложений с лицами при появлении лица рекомендуется expSwAttr.stAdvanced.enable = true и использование весов expSwAttr.stAdvanced; при исчезновении — false для возврата исходных весов.

<!-- Source EN PDF p.76; unit 799 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 uint8_t GridWeights[225]={
 0,  0, 1,  2,  2,  3,  4,  5,  4, 3,  2,  2,  1,  0,  0,
 0,  1, 2,  3,  3,  4,  5,  6,  5, 4,  3,  3,  2,  1,  0,
 1,  2, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  2,  1,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 3,  5 ,7, 10, 11, 12, 13, 14, 13,12, 11, 10,  7,  5,  3,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 1,  2, 4,  6,  6,  7,  8,  9,  8, 7,  6,  6,  4,  2,  1,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0
 };
 //method one：
 memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
 sizeof(expSwAttr.GridWeights.uCoeff));
 //method two:
 expSwAttr.stAdvanced.enable = true; //important! true means preferring to use these parameters
 memcpy(expSwAttr.stAdvanced.GridWeights, GridWeights,
 sizeof(expSwAttr.stAdvanced.GridWeights));
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.76; unit 800 -->

#### 6.6.2  rk_aiq_user_api2_ae_getExpSwAttr

<!-- Source EN PDF p.76; unit 801 -->

【Описание】Получение программных атрибутов экспозиции AE.

<!-- Source EN PDF p.76; unit 802 -->

【Синтаксис】

<!-- Source EN PDF p.76; unit 803 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                         Uapi_ExpSwAttrV2_t* pExpSwAttr);
```

<!-- Source EN PDF p.77; unit 804 -->

【Параметры】

<!-- Source EN PDF p.77; unit 805 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pExpSwAttr | Указатель структуры программных атрибутов экспозиции AE | Выход |

<!-- Source EN PDF p.77; unit 806 -->

【Возвращаемое значение】

<!-- Source EN PDF p.77; unit 807 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.77; unit 808 -->

【Зависимости】

<!-- Source EN PDF p.77; unit 809 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 810 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.77; unit 811 -->

#### 6.6.3  rk_aiq_user_api2_ae_setLinAeRouteAttr

<!-- Source EN PDF p.77; unit 812 -->

【Описание】Установка стратегии распределения экспозиции AE для сцены в линейном режиме.

<!-- Source EN PDF p.77; unit 813 -->

【Синтаксис】

<!-- Source EN PDF p.77; unit 814 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinAeRouteAttr_t linAeRouteAttr);
```

<!-- Source EN PDF p.77; unit 815 -->

【Параметры】

<!-- Source EN PDF p.77; unit 816 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| linAeRouteAttr | Структура стратегии распределения экспозиции AE | Вход |

<!-- Source EN PDF p.77; unit 817 -->

【Возвращаемое значение】

<!-- Source EN PDF p.77; unit 818 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.77; unit 819 -->

【Зависимости】

<!-- Source EN PDF p.77; unit 820 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 821 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.78; unit 822 -->

【Пример】

<!-- Source EN PDF p.78; unit 823 -->

```text
 Uapi_LinAeRouteAttr_t LinAeRouteAttr;
 memset(&LinAeRouteAttr,0x00,sizeof(Uapi_LinAeRouteAttr_t));
 rk_aiq_user_api2_ae_getLinAeRouteAttr(sys_ctx,&LinAeRouteAttr);
 int len = 8;
 float TimeDot[8]={0,0.01,0.01,0.02,0.02,0.03,0.03,0.04};
 float GainDot[8]={1,1,4,4,8,8,16,32};
 float IspGainDot[8]={1,1,1,1,1,1,1,1};
 int PirisDot[8]={512,512,512,512,512,512,512,512};
 LinAeRouteAttr.TimeDot_len = len;
 LinAeRouteAttr.GainDot_len = len;
 LinAeRouteAttr.IspDGainDot_len = len;
 LinAeRouteAttr.PIrisDot_len = len;
 LinAeRouteAttr.GainDot = GainDot;
 LinAeRouteAttr.IspDGainDot = IspGainDot;
 LinAeRouteAttr.TimeDot = TimeDot;
 LinAeRouteAttr.PIrisDot = PirisDot;
 rk_aiq_user_api2_ae_setLinAeRouteAttr(sys_ctx,LinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 824 -->

#### 6.6.4  rk_aiq_user_api2_ae_getLinAeRouteAttr

<!-- Source EN PDF p.78; unit 825 -->

【Описание】Получение стратегии распределения экспозиции AE для сцены в линейном режиме.

<!-- Source EN PDF p.78; unit 826 -->

【Синтаксис】

<!-- Source EN PDF p.78; unit 827 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinAeRouteAttr_t* pLinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 828 -->

【Параметры】

<!-- Source EN PDF p.78; unit 829 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pLinAeRouteAttr | Указатель структуры стратегии распределения экспозиции AE | Выход |

<!-- Source EN PDF p.78; unit 830 -->

【Возвращаемое значение】

<!-- Source EN PDF p.78; unit 831 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.78; unit 832 -->

【Зависимости】

<!-- Source EN PDF p.79; unit 833 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 834 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.79; unit 835 -->

#### 6.6.5  rk_aiq_user_api2_ae_setHdrAeRouteAttr

<!-- Source EN PDF p.79; unit 836 -->

【Описание】Установка стратегии распределения экспозиции AE для сцены в режиме HDR.

<!-- Source EN PDF p.79; unit 837 -->

【Синтаксис】

<!-- Source EN PDF p.79; unit 838 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrAeRouteAttr_t hdrAeRouteAttr);
```

<!-- Source EN PDF p.79; unit 839 -->

【Параметры】

<!-- Source EN PDF p.79; unit 840 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| hdrAeRouteAttr | Структура стратегии распределения экспозиции AE | Вход |

<!-- Source EN PDF p.79; unit 841 -->

【Возвращаемое значение】

<!-- Source EN PDF p.79; unit 842 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.79; unit 843 -->

【Зависимости】

<!-- Source EN PDF p.79; unit 844 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 845 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.79; unit 846 -->

【Пример】

<!-- Source EN PDF p.79; unit 847 -->

```text
 Uapi_HdrAeRouteAttr_t stHdrRoute;
 memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
 ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
 int len = 6;
 float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
                           0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
                           0.0, 0.03, 0.03, 0.03, 0.03, 0.03};
 float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12};
 float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1};
 int   HdrPIrisGainDot[6] = {1, 1, 1, 1, 1, 1};
 stHdrRoute.Frm0TimeDot_len = len;
 stHdrRoute.Frm0GainDot_len = len;
 stHdrRoute.Frm0IspDGainDot_len = len;
 stHdrRoute.Frm1TimeDot_len = len;
 stHdrRoute.Frm1GainDot_len = len;
 stHdrRoute.Frm1IspDGainDot_len = len;
 stHdrRoute.Frm2TimeDot_len = len;
 stHdrRoute.Frm2GainDot_len = len;
 stHdrRoute.Frm2IspDGainDot_len = len;
 stHdrRoute.PIrisDot_len = len;
 stHdrRoute.Frm0TimeDot = HdrTimeDot[0];
 stHdrRoute.Frm0GainDot = HdrGainDot[0];
 stHdrRoute.Frm0IspDGainDot = HdrIspDGainDot[0];
 stHdrRoute.Frm1TimeDot = HdrTimeDot[1];
 stHdrRoute.Frm1GainDot = HdrGainDot[1];
 stHdrRoute.Frm1IspDGainDot = HdrIspDGainDot[1];
 stHdrRoute.Frm2TimeDot = HdrTimeDot[2];
 stHdrRoute.Frm2GainDot = HdrGainDot[2];
 stHdrRoute.Frm2IspDGainDot = HdrIspDGainDot[2];
 stHdrRoute.PIrisDot = HdrPIrisGainDot;
 ret = rk_aiq_user_api2_ae_setHdrAeRouteAttr(ctx,stHdrRoute);
```

<!-- Source EN PDF p.80; unit 848 -->

#### 6.6.6  rk_aiq_user_api2_ae_getHdrAeRouteAttr

<!-- Source EN PDF p.80; unit 849 -->

【Описание】Получение стратегии распределения экспозиции AE для сцены в режиме HDR.

<!-- Source EN PDF p.80; unit 850 -->

【Синтаксис】

<!-- Source EN PDF p.80; unit 851 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrAeRouteAttr_t* pHdrAeRouteAttr);
```

<!-- Source EN PDF p.80; unit 852 -->

【Параметры】

<!-- Source EN PDF p.80; unit 853 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pHdrAeRouteAttr | Указатель структуры стратегии распределения экспозиции AE | Выход |

<!-- Source EN PDF p.80; unit 854 -->

【Возвращаемое значение】

<!-- Source EN PDF p.80; unit 855 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.80; unit 856 -->

【Зависимости】

<!-- Source EN PDF p.81; unit 857 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 858 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.81; unit 859 -->

#### 6.6.7  rk_aiq_user_api2_ae_setLinExpAttr

<!-- Source EN PDF p.81; unit 860 -->

【Описание】Установка параметров экспозиции AE в линейном режиме.

<!-- Source EN PDF p.81; unit 861 -->

【Синтаксис】

<!-- Source EN PDF p.81; unit 862 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinExpAttrV2_t linExpAttr);
```

<!-- Source EN PDF p.81; unit 863 -->

【Параметры】

<!-- Source EN PDF p.81; unit 864 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| linExpAttr | Структура параметров экспозиции AE | Вход |

<!-- Source EN PDF p.81; unit 865 -->

【Возвращаемое значение】

<!-- Source EN PDF p.81; unit 866 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.81; unit 867 -->

【Зависимости】

<!-- Source EN PDF p.81; unit 868 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 869 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.81; unit 870 -->

【Пример】

<!-- Source EN PDF p.81; unit 871 -->

Установка параметров линейной экспозиции AE, включая Evbias для регулировки яркости, BackLightCtrl для компенсации контрового света и OverExpCtrl для подавления ярких областей. Последние две функции нельзя включать одновременно.

<!-- Source EN PDF p.81; unit 872 -->

```text
 Uapi_LinExpAttrV2_t linExpAttr;
 memset(&linExpAttr,0,sizeof(Uapi_LinExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getLinExpAttr(ctx, &linExpAttr);
 //set Evbias
 printf("Evbias=%f\n", linExpAttr.Evbias);
 linExpAttr.Evbias = 100.0f;
 //set BackLightCtrl
 linExpAttr.BackLightCtrl.Enable = true;
 linExpAttr.BackLightCtrl.StrBias = 200.0f;
 //set OverExpCtrl
 linExpAttr.OverExpCtrl.Enable = true;
 linExpAttr.OverExpCtrl.StrBias = 100.0f;
 ret = rk_aiq_user_api2_ae_setLinExpAttr(ctx, linExpAttr);
```

<!-- Source EN PDF p.82; unit 873 -->

#### 6.6.8  rk_aiq_user_api2_ae_getLinExpAttr

<!-- Source EN PDF p.82; unit 874 -->

【Описание】Получение параметров линейной экспозиции AE.

<!-- Source EN PDF p.82; unit 875 -->

【Синтаксис】

<!-- Source EN PDF p.82; unit 876 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinExpAttrV2_t* pLinExpAttr);
```

<!-- Source EN PDF p.82; unit 877 -->

【Параметры】

<!-- Source EN PDF p.82; unit 878 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pLinExpAttr | Указатель структуры параметров экспозиции AE | Выход |

<!-- Source EN PDF p.82; unit 879 -->

【Возвращаемое значение】

<!-- Source EN PDF p.82; unit 880 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.82; unit 881 -->

【Зависимости】

<!-- Source EN PDF p.82; unit 882 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.82; unit 883 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.82; unit 884 -->

#### 6.6.9  rk_aiq_user_api2_ae_setHdrExpAttr

<!-- Source EN PDF p.82; unit 885 -->

【Описание】Установка параметров экспозиции AE в режиме HDR.

<!-- Source EN PDF p.82; unit 886 -->

【Синтаксис】

<!-- Source EN PDF p.82; unit 887 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrExpAttrV2_t hdrExpAttr);
```

<!-- Source EN PDF p.82; unit 888 -->

【Параметры】

<!-- Source EN PDF p.83; unit 889 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| hdrExpAttr | Структура параметров экспозиции AE | Вход |

<!-- Source EN PDF p.83; unit 890 -->

【Возвращаемое значение】

<!-- Source EN PDF p.83; unit 891 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.83; unit 892 -->

【Зависимости】

<!-- Source EN PDF p.83; unit 893 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.83; unit 894 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.83; unit 895 -->

【Пример】

<!-- Source EN PDF p.83; unit 896 -->

Установка параметров HDR AE, включая ручное/автоматическое соотношение экспозиций и регулировку яркости Evbias.

<!-- Source EN PDF p.83; unit 897 -->

```text
 Uapi_HdrExpAttrV2_t HdrExpAttr;
 memset(&HdrExpAttr,0,sizeof(Uapi_HdrExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getHdrExpAttr(ctx, &HdrExpAttr);
 //set hdr mframe params
 int len = 8;
 float explevel[8] = {0, 0.096, 0.192, 0.384, 0.96, 1.344, 1.92, 3};
 float setpoint[8] = {50, 45, 40, 35, 30, 25, 20, 15};
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel = explevel;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint = setpoint;
 //set ExpRatioType (AUTO/FIX)
 HdrExpAttr.ExpRatioCtrl.ExpRatioType = AECV2_HDR_RATIOTYPE_MODE_AUTO;
 //set Evbias
 HdrExpAttr.Evbias = -100.0f;
 ret = rk_aiq_user_api2_ae_setHdrExpAttr(ctx, HdrExpAttr);
```

<!-- Source EN PDF p.83; unit 898 -->

#### 6.6.10  rk_aiq_user_api2_ae_getHdrExpAttr

<!-- Source EN PDF p.83; unit 899 -->

【Описание】Получение параметров экспозиции AE в режиме HDR.

<!-- Source EN PDF p.83; unit 900 -->

【Синтаксис】

<!-- Source EN PDF p.84; unit 901 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrExpAttrV2_t* pHdrExpAttr);
```

<!-- Source EN PDF p.84; unit 902 -->

【Параметры】

<!-- Source EN PDF p.84; unit 903 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pHdrExpAttr | Указатель структуры параметров экспозиции AE | Выход |

<!-- Source EN PDF p.84; unit 904 -->

【Возвращаемое значение】

<!-- Source EN PDF p.84; unit 905 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.84; unit 906 -->

【Зависимости】

<!-- Source EN PDF p.84; unit 907 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.84; unit 908 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.84; unit 909 -->

#### 6.6.11  rk_aiq_user_api2_ae_setIrisAttr

<!-- Source EN PDF p.84; unit 910 -->

【Описание】Установка параметров управления диафрагмой AE.

<!-- Source EN PDF p.84; unit 911 -->

【Синтаксис】

<!-- Source EN PDF p.84; unit 912 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t irisAttr);
```

<!-- Source EN PDF p.84; unit 913 -->

【Параметры】

<!-- Source EN PDF p.84; unit 914 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| irisAttr | Структура параметров управления диафрагмой | Вход |

<!-- Source EN PDF p.84; unit 915 -->

【Возвращаемое значение】

<!-- Source EN PDF p.84; unit 916 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.85; unit 917 -->

【Зависимости】

<!-- Source EN PDF p.85; unit 918 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.85; unit 919 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.85; unit 920 -->

【Пример】

<!-- Source EN PDF p.85; unit 921 -->

```text
 Uapi_IrisAttrV2_t irisAttr;
 ret = rk_aiq_user_api2_ae_getIrisAttr(ctx, &irisAttr);
 irisAttr.enable = true; /*run AIris*/
 //set P-iris attributes
 irisAttr.IrisType = IRIS_P_TYPE;
 irisAttr.PIrisAttr.TotalStep = 81;
 irisAttr.PIrisAttr.EffcStep = 44;
 irisAttr.PIrisAttr.ZeroIsMax = true;
 uint16_t StepTable[1024] = {512, 511, 506, 499, 491, 483, 474, 465, 456,
                             446, 437, 427, 417, 408, 398, 388, 378, 368,
                             359, 349, 339, 329, 319, 309, 300, 290, 280,
                             271, 261, 252, 242, 233, 224, 214, 205, 196,
                             187, 178, 170, 161, 153, 144, 136, 128, 120,
                             112, 105, 98, 90, 83, 77, 70, 64, 58,
                             52, 46, 41, 36, 31, 27, 23, 19, 16,
                             13, 10, 8, 6, 4, 3, 1, 1, 0,
                             0, 0, 0, 0, 0, 0, 0, 0, 0};
 memcpy(irisAttr.PIrisAttr.StepTable,StepTable,sizeof(irisAttr.PIrisAttr.StepTable
 ));
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set DC-iris attributes
 irisAttr.IrisType = IRIS_DC_TYPE;
 irisAttr.DCIrisAttr.Kp= 0.5f;
 irisAttr.DCIrisAttr.Ki= 0.2f;
 irisAttr.DCIrisAttr.Kd = 0.3f;
 irisAttr.DCIrisAttr.OpenPwmDuty = 40;
 irisAttr.DCIrisAttr.ClosePwmDuty = 22;
 irisAttr.DCIrisAttr.MinPwmDuty = 0;
 irisAttr.DCIrisAttr.MaxPwmDuty = 100;
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set manual iris with auto ae
 irisAttr.IrisOpType = RK_AIQ_OP_MODE_MANUAL;
 if(irisAttr.IrisType == IRIS_P_TYPE);
     irisAttr.ManualAttr.PIrisGainValue = 512; /*p-iris F#=1.4*/
 if(irisAttr.IrisType == IRIS_DC_TYPE);
     irisAttr.ManualAttr.DCIrisHoldValue = 20; /*dc-iris PwmDuty=20*/
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
```

<!-- Source EN PDF p.85; unit 922 -->

#### 6.6.12  rk_aiq_user_api2_ae_getIrisAttr

<!-- Source EN PDF p.85; unit 923 -->

【Описание】Получение параметров управления диафрагмой AE.

<!-- Source EN PDF p.85; unit 924 -->

【Синтаксис】

<!-- Source EN PDF p.86; unit 925 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t* irisAttr);
```

<!-- Source EN PDF p.86; unit 926 -->

【Параметры】

<!-- Source EN PDF p.86; unit 927 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| irisAttr | Структура параметров управления диафрагмой | Выход |

<!-- Source EN PDF p.86; unit 928 -->

【Возвращаемое значение】

<!-- Source EN PDF p.86; unit 929 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.86; unit 930 -->

【Зависимости】

<!-- Source EN PDF p.86; unit 931 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.86; unit 932 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.86; unit 933 -->

#### 6.6.13  rk_aiq_user_api2_ae_setExpWinAttr

<!-- Source EN PDF p.86; unit 934 -->

【Описание】Установка атрибутов окна статистики AE.

<!-- Source EN PDF p.86; unit 935 -->

【Синтаксис】

<!-- Source EN PDF p.86; unit 936 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx, const
 Uapi_ExpWin_t ExpWin);
```

<!-- Source EN PDF p.86; unit 937 -->

【Параметры】

<!-- Source EN PDF p.86; unit 938 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| ExpWin | Параметры атрибутов окна | Вход |

<!-- Source EN PDF p.86; unit 939 -->

【Возвращаемое значение】

<!-- Source EN PDF p.86; unit 940 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.87; unit 941 -->

【Зависимости】

<!-- Source EN PDF p.87; unit 942 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.87; unit 943 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.87; unit 944 -->

【Пример】

<!-- Source EN PDF p.87; unit 945 -->

Измените координаты статистики AE по положению лица для измерения яркости его области.

<!-- Source EN PDF p.87; unit 946 -->

Примечание: при настройке координат обеспечьте ExpWin.h_offs+ExpWin.h_size&lt;=pic_width и ExpWin.v_offs+ExpWin.v_size&lt;=pic_height.

<!-- Source EN PDF p.87; unit 947 -->

```text
 Uapi_ExpWin_t ExpWin;
 //Suppose the sensor resolution is 2688X1520, the lateral offset of the face from the upper left corner of the screen is 100 pixel, the vertical offset is 100 pixel, and the face size is a square with a side length of 100 pixel
 ExpWin.h_offs=100;
 ExpWin.v_offs=100;
 ExpWin.h_size=100;
 ExpWin.v_size=100;
 rk_aiq_user_api2_ae_setExpWinAttr(ctx, ExpWin);
```

<!-- Source EN PDF p.87; unit 948 -->

#### 6.6.14  rk_aiq_user_api2_ae_getExpWinAttr

<!-- Source EN PDF p.87; unit 949 -->

【Описание】Получение атрибутов окна статистики AE.

<!-- Source EN PDF p.87; unit 950 -->

【Синтаксис】

<!-- Source EN PDF p.87; unit 951 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx,const
 Uapi_ExpWin_t* ExpWin);
```

<!-- Source EN PDF p.87; unit 952 -->

【Параметры】

<!-- Source EN PDF p.87; unit 953 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| ExpWin | Параметры атрибутов окна | Выход |

<!-- Source EN PDF p.87; unit 954 -->

【Возвращаемое значение】

<!-- Source EN PDF p.87; unit 955 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.87; unit 956 -->

【Зависимости】

<!-- Source EN PDF p.87; unit 957 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 958 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.88; unit 959 -->

#### 6.6.15  rk_aiq_user_api2_ae_queryExpResInfo

<!-- Source EN PDF p.88; unit 960 -->

【Описание】Получение внутренних состояний AE.

<!-- Source EN PDF p.88; unit 961 -->

【Синтаксис】

<!-- Source EN PDF p.88; unit 962 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_queryExpResInfo(const rk_aiq_sys_ctx_t* ctx,
 Uapi_ExpQueryInfo_t* pExpResInfo);
```

<!-- Source EN PDF p.88; unit 963 -->

【Параметры】

<!-- Source EN PDF p.88; unit 964 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| pExpResInfo | Указатель структуры внутренних состояний AE | Выход |

<!-- Source EN PDF p.88; unit 965 -->

【Возвращаемое значение】

<!-- Source EN PDF p.88; unit 966 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.88; unit 967 -->

【Зависимости】

<!-- Source EN PDF p.88; unit 968 -->

Заголовочные файлы: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 969 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.88; unit 970 -->

### 6.7 Типы данных модульного API

<!-- Source EN PDF p.88; unit 971 -->

#### 6.7.1  Uapi_ExpSwAttr_t

<!-- Source EN PDF p.88; unit 972 -->

【Описание】

<!-- Source EN PDF p.88; unit 973 -->

Структура параметров управления общими функциями AE.

<!-- Source EN PDF p.88; unit 974 -->

【Определение】

<!-- Source EN PDF p.89; unit 975 -->

```text
 typedef struct Uapi_ExpSwAttrV2_s {
     rk_aiq_uapi_sync_t                 sync;
     uint8_t                            Enable;
     CalibDb_CamRawStatsModeV2_t        RawStatsMode;
     CalibDb_CamHistStatsModeV2_t       HistStatsMode;
     CalibDb_CamYRangeModeV2_t          YRangeMode;
     uint8_t                            AecRunInterval;
     RKAiqOPMode_t                      AecOpType;
     Cam15x15UCharMatrix_t              GridWeights;
     Uapi_AeAttrV2_t                    stAuto;
     Uapi_MeAttrV2_t                    stManual;
     Uapi_ExpSwAttr_AdvancedV2_t        stAdvanced;
 } Uapi_ExpSwAttrV2_t;
```

<!-- Source EN PDF p.89; unit 976 -->

【Члены】

<!-- Source EN PDF p.89; unit 977 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| Enable | Включение AEC: 1 — включить алгоритм; 0 — выключить с сохранением последней экспозиции. |
| RawStatsMode | Режим статистики яркости AEC: четыре варианта CAM_RAWSTATSV2_MODE_Y/R/G/B; по умолчанию Y. |
| HistStatsMode | Режим гистограммы AEC. Исходник говорит о пяти вариантах, перечисляя CAM_HISTV2_MODE_Y/R/G/B; по умолчанию Y. Несоответствие количества сохранено. |
| YRangeMode | Диапазон Y-канала AEC: CAM_YRANGEV2_MODE_FULL/LIMITED; по умолчанию FULL. |
| AecRunInterval | Интервал запуска AE, диапазон [0,255], по умолчанию 0. При 0 AE работает каждый кадр, при 1 — через один кадр и т. д. |
| AecOpType | Режим экспозиции: автоматический RK_AIQ_OP_MODE_AUTO или ручной RK_AIQ_OP_MODE_MANUAL; по умолчанию AUTO. Ручной режим требует задания значений через stManual. |
| GridWeights | Веса окна (гистограммы), массив 15*15 элементов, диапазон [0,32]. |
| stAuto | Структура параметров автоматической экспозиции |
| stManual | Структура параметров ручной экспозиции |
| stAdvanced | Структуры параметров |

<!-- Source EN PDF p.89; unit 978 -->

Связанные типы данных

<!-- Source EN PDF p.89; unit 979 -->

rk_aiq_uapi_sync_t

<!-- Source EN PDF p.89; unit 980 -->

Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.89; unit 981 -->

Uapi_AeAttrV2_t

<!-- Source EN PDF p.90; unit 982 -->

Uapi_MeAttrV2_t

<!-- Source EN PDF p.90; unit 983 -->

6.7.1.1  Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.90; unit 984 -->

【Описание】

<!-- Source EN PDF p.90; unit 985 -->

Приоритет параметров структуры.

<!-- Source EN PDF p.90; unit 986 -->

【Определение】

<!-- Source EN PDF p.90; unit 987 -->

```text
 typedef struct Aec_uapi_advanced_attr_s {
     bool                          enable;
     uint8_t                       GridWeights[15 * 15];
     bool                          SetAeRangeEn;
     Aec_LinAeRange_t              SetLinAeRange;
     Aec_HdrAeRange_t              SetHdrAeRange;
 } Aec_uapi_advanced_attr_t;
 typedef Aec_uapi_advanced_attr_t Uapi_ExpSwAttr_AdvancedV2_t;
```

<!-- Source EN PDF p.90; unit 988 -->

【Члены】

<!-- Source EN PDF p.90; unit 989 -->

| Имя члена | Описание |
|---|---|
| enable | При 1 приоритет имеют параметры структуры. |
| GridWeights | Веса AE, размер 15X15. |
| SetAeRangeEn | 1 — задать диапазон компонентов автоматической экспозиции; 0 — не задавать, использовать файл настройки. |
| SetLinAeRange | Заданный диапазон компонентов автоматической линейной экспозиции, а не окончательный действующий диапазон. |
| SetHdrAeRange | Заданный диапазон компонентов автоматической экспозиции HDR, а не окончательный действующий диапазон. |

<!-- Source EN PDF p.90; unit 990 -->

【Меры предосторожности】

<!-- Source EN PDF p.90; unit 991 -->

Uapi_ExpSwAttrV2_t содержит веса AE 15X15, которые алгоритм разворачивает под фактическое количество аппаратных весов. Для экспозиции лица и подобных областей можно использовать веса 15X15 из Uapi_ExpSwAttr_AdvancedV2_t; алгоритм сжимает их под аппаратную конфигурацию. Для использования весов Uapi_ExpSwAttr_Advanced_t установите enable в 1. В последнем имени типа исходника отсутствует V2; оно сохранено.

<!-- Source EN PDF p.90; unit 992 -->

Для задания диапазона AE через API установите SetAeRangeEn в 1; иначе используются диапазоны файла настройки. Для разных режимов предусмотрены SetLinAeRange и SetHdrAeRange; последний задаёт диапазоны для каждого кадра. Окончательные действующие диапазоны выдержки и усиления запрашивают в stAuto: здесь хранятся только заданные, не окончательные диапазоны.

<!-- Source EN PDF p.91; unit 993 -->

6.7.1.1.1 Aec_AeRange_t

<!-- Source EN PDF p.91; unit 994 -->

【Описание】Определение диапазона параметров AE.

<!-- Source EN PDF p.91; unit 995 -->

【Определение】

<!-- Source EN PDF p.91; unit 996 -->

```text
 typedef struct Aec_AeRange_s {
     float                   Min;
     float                   Max;
 } Aec_AeRange_t;
```

<!-- Source EN PDF p.91; unit 997 -->

【Члены】

<!-- Source EN PDF p.91; unit 998 -->

| Имя члена | Описание |
|---|---|
| Min | Нижняя граница |
| Max | Верхняя граница |

<!-- Source EN PDF p.91; unit 999 -->

6.7.1.1.2 Aec_LinAeRange_t

<!-- Source EN PDF p.91; unit 1000 -->

【Описание】Определение диапазонов AE в линейном режиме.

<!-- Source EN PDF p.91; unit 1001 -->

【Определение】

<!-- Source EN PDF p.91; unit 1002 -->

```text
 typedef struct Aec_LinAeRange_s {
     Aec_AeRange_t      stExpTimeRange;
     Aec_AeRange_t      stGainRange;
     Aec_AeRange_t      stIspDGainRange;
     Aec_AeRange_t      stPIrisRange;
 } Aec_LinAeRange_t;
```

<!-- Source EN PDF p.91; unit 1003 -->

【Члены】

<!-- Source EN PDF p.91; unit 1004 -->

| Имя члена | Описание |
|---|---|
| stExpTimeRange | Диапазон выдержки; максимум и минимум задаются в миллисекундах (единица исходника). |
| stGainRange | Диапазон аналогового усиления Sensor; задаются максимум и минимум. |
| stIspDGainRange | Диапазон цифрового усиления ISP; задаются максимум и минимум. |
| stPIrisRange | Диапазон эквивалентного усиления диафрагмы; поддерживается только регулировка размера P-Iris. |

<!-- Source EN PDF p.91; unit 1005 -->

【Меры предосторожности】

<!-- Source EN PDF p.91; unit 1006 -->

Если максимум/минимум компонента равен исходному 0, заданный диапазон не действует; фактические границы определяются узлами маршрута разложения экспозиции AecRoute.

<!-- Source EN PDF p.92; unit 1007 -->

При ненулевых максимуме/минимуме заданный диапазон действует. Если ограничения sensor/ISP не превышены, фактические границы равны заданным и соответствующим образом корректируются узлы AecRoute. При превышении ограничений используются максимум/минимум узлов AecRoute.

<!-- Source EN PDF p.92; unit 1008 -->

6.7.1.1.3 Aec_HdrAeRange_t

<!-- Source EN PDF p.92; unit 1009 -->

【Описание】Определение диапазонов AE в режиме HDR.

<!-- Source EN PDF p.92; unit 1010 -->

【Определение】

<!-- Source EN PDF p.92; unit 1011 -->

```text
 typedef struct Aec_HdrAeRange_s {
     Aec_AeRange_t      stExpTimeRange[3];
     Aec_AeRange_t      stGainRange[3];
     Aec_AeRange_t      stIspDGainRange[3];
     Aec_AeRange_t      stPIrisRange;
 } Aec_HdrAeRange_t;
```

<!-- Source EN PDF p.92; unit 1012 -->

【Члены】

<!-- Source EN PDF p.92; unit 1013 -->

| Имя члена | Описание |
|---|---|
| stExpTimeRange | Диапазон выдержки, максимум/минимум в секундах; элементы 0/1/2 соответствуют короткому, среднему и длинному кадрам. |
| stGainRange | Диапазон аналогового усиления Sensor; максимум/минимум элементов 0/1/2 соответствуют короткому, среднему и длинному кадрам. |
| stIspDGainRange | Диапазон цифрового усиления ISP; максимум/минимум элементов 0/1/2 соответствуют короткому, среднему и длинному кадрам. |
| stPIrisRange | Диапазон эквивалентного усиления диафрагмы; задаются максимум и минимум. |

<!-- Source EN PDF p.92; unit 1014 -->

【Меры предосторожности】

<!-- Source EN PDF p.92; unit 1015 -->

stExpTimeRange, stGainRange и stIspDGainRange — массивы из трёх элементов. В двухкадровом HDR действуют только 0 и 1 для короткого и длинного кадров; в трёхкадровом — 0–2 для короткого, среднего и длинного.

<!-- Source EN PDF p.92; unit 1016 -->

При исходных нулевых максимуме/минимуме заданный диапазон не действует; фактические границы определяются узлами маршрута разложения экспозиции после коррекции алгоритмом.

<!-- Source EN PDF p.92; unit 1017 -->

При ненулевых максимуме/минимуме заданный диапазон действует. Если ограничения sensor/ISP не превышены, фактические границы равны заданным, а границы узлов маршрута разложения экспозиции корректируются под них; при превышении ограничений sensor/ISP

<!-- Source EN PDF p.93; unit 1018 -->

фактические границы определяются максимумом/минимумом узлов маршрута разложения экспозиции. Платформа 1106 пока не поддерживает isp dgain, поэтому stIspDGainRange временно не действует.

<!-- Source EN PDF p.93; unit 1019 -->

6.7.1.2  Uapi_AeAttrV2_t

<!-- Source EN PDF p.93; unit 1020 -->

【Описание】Определение атрибутов автоматической экспозиции AE.

<!-- Source EN PDF p.93; unit 1021 -->

【Определение】

<!-- Source EN PDF p.93; unit 1022 -->

```text
 typedef struct Uapi_AeAttrV2_s {
     Uapi_AeSpeedV2_t           stAeSpeed;
     DelayFrmNum
     uint8_t                    BlackDelayFrame;
     uint8_t                    WhiteDelayFrame;
     Auto/Fixed fps
     Uapi_AeFpsAttrV2_t         stFrmRate;
     Uapi_AntiFlickerV2_t       stAntiFlicker;
     auto range
     Aec_LinAeRange_t           LinAeRange;//result LinAerange
     Aec_HdrAeRange_t           HdrAeRange;//result HdrAerange
 } Uapi_AeAttrV2_t;
```

<!-- Source EN PDF p.93; unit 1023 -->

【Члены】

<!-- Source EN PDF p.93; unit 1024 -->

| Имя члена | Описание |
|---|---|
| stAeSpeed | Скорость регулировки автоматической экспозиции |
| BlackDelayFrame | Задержка AE: если яркость ниже целевой дольше BlackDelayFrame кадров, начинается регулировка. |
| WhiteDelayFrame | Задержка AE: если яркость выше целевой дольше WhiteDelayFrame кадров, начинается регулировка. |
| stFrmRate | Структура частоты кадров AE: фиксированная частота или автоматическое снижение. |
| stAntiFlicker | Параметры подавления сетевого мерцания |
| LinAeRange | Структура диапазона линейного AE (окончательный действующий диапазон). |
| HdrAeRange | Структура диапазона HDR AE (окончательный действующий диапазон). |

<!-- Source EN PDF p.93; unit 1025 -->

【Меры предосторожности】

<!-- Source EN PDF p.93; unit 1026 -->

LinAeRange/HdrAeRange — фактически используемые диапазоны после внутренней проверки и коррекции. Если заданный API диапазон превышает ограничения sensor, применяются ограничения sensor. Они описаны в параметре sensorinfo модуля AE документа Rockchip_Tuning_Guide_ISP30_CN.pdf, на который ссылается исходник.

<!-- Source EN PDF p.94; unit 1027 -->

Чтобы задать диапазоны компонентов AE, используйте параметры Uapi_ExpSwAttr_AdvancedV2_t и SetAeRangeEn = 1; иначе действуют диапазоны файла настройки.

<!-- Source EN PDF p.94; unit 1028 -->

6.7.1.2.1 Uapi_AeSpeedV2_t

<!-- Source EN PDF p.94; unit 1029 -->

【Описание】Определение скоростей регулировки AE.

<!-- Source EN PDF p.94; unit 1030 -->

【Определение】

<!-- Source EN PDF p.94; unit 1031 -->

```text
 typedef struct CalibDb_AeSpeedV2_s {
     float                   DampOver;
     float                   DampUnder;
     float                   DampDark2Bright;
     float                   DampBright2Dark;
 } CalibDb_AeSpeedV2_t;
 typedef CalibDb_AeSpeedV2_t Uapi_AeSpeedV2_t;
```

<!-- Source EN PDF p.94; unit 1032 -->

【Члены】

<!-- Source EN PDF p.94; unit 1033 -->

| Имя поля | Описание |
|---|---|
| DampOver | Скорость регулировки при стабильном освещении и яркости выше целевой, диапазон [0,1]. |
| DampUnder | Скорость регулировки при стабильном освещении и яркости ниже целевой, диапазон [0,1]. |
| DampDark2Bright | Скорость регулировки при резком переходе освещения от тёмного к светлому, диапазон [0,1]. |
| DampBright2Dark | Скорость регулировки при резком переходе от светлого к тёмному, диапазон [0,1]. |

<!-- Source EN PDF p.94; unit 1034 -->

6.7.1.2.2 Uapi_AeFpsAttrV2_t

<!-- Source EN PDF p.94; unit 1035 -->

【Описание】Определение частоты кадров AE.

<!-- Source EN PDF p.94; unit 1036 -->

【Определение】

<!-- Source EN PDF p.94; unit 1037 -->

```text
 typedef struct CalibDb_AeFrmRateAttrV2_s {
     bool             isFpsFix;
     uint8_t          FpsValue;
 } CalibDb_AeFrmRateAttrV2_t;
 typedef CalibDb_AeFrmRateAttrV2_t Uapi_AeFpsAttrV2_t;
```

<!-- Source EN PDF p.94; unit 1038 -->

【Члены】

<!-- Source EN PDF p.95; unit 1039 -->

| Имя члена | Описание |
|---|---|
| isFpsFix | Фиксация частоты кадров AE. По умолчанию FALSE — автоматическое снижение; TRUE — фиксированная частота. |
| FpsValue | Действует только при фиксированной частоте: 0 использует частоту драйвера по умолчанию, ненулевое значение — заданную частоту. |

<!-- Source EN PDF p.95; unit 1040 -->

6.7.1.2.3 Uapi_AntiFlickerV2_t

<!-- Source EN PDF p.95; unit 1041 -->

【Описание】Определение атрибутов подавления мерцания.

<!-- Source EN PDF p.95; unit 1042 -->

【Определение】

<!-- Source EN PDF p.95; unit 1043 -->

```text
 typedef struct CalibDb_AntiFlickerAttrV2_s {
     bool                           enable;
     CalibDb_FlickerFreq_t          Frequency;
     CalibDb_AntiFlickerMode_t      Mode;
 } CalibDb_AntiFlickerAttrV2_t;
 typedef CalibDb_AntiFlickerAttrV2_t Uapi_AntiFlickerV2_t;
```

<!-- Source EN PDF p.95; unit 1044 -->

【Члены】

<!-- Source EN PDF p.95; unit 1045 -->

| Имя члена | Описание |
|---|---|
| enable | Включение подавления сетевого мерцания: 0 — выключено, 1 — включено. |
| Frequency | Три значения частоты: AECV2_FLICKER_FREQUENCY_OFF (действует при бите включения 0), AECV2_FLICKER_FREQUENCY_50HZ и AECV2_FLICKER_FREQUENCY_60HZ; по умолчанию AECV2_FLICKER_FREQUENCY_50HZ, то есть сеть 50 Hz. |
| Mode | Два режима подавления мерцания: обычный AECV2_ANTIFLICKER_NORMAL_MODE и автоматический AECV2_ANTIFLICKER_AUTO_MODE. |

<!-- Source EN PDF p.95; unit 1046 -->

【Меры предосторожности】

<!-- Source EN PDF p.95; unit 1047 -->

Для выключения установите enable = 0; алгоритм задаст Frequency=AECV2_FLICKER_FREQUENCY_OFF. Если enable = 1, значение частоты OFF недействительно и заменяется исходным AECV2_FLICKER_FREQUENCY_50HZ.

<!-- Source EN PDF p.95; unit 1048 -->

В обычном режиме AECV2_ANTIFLICKER_NORMAL_MODE выдержка меняется с яркостью, но её минимум фиксирован: 1/120 sec (60Hz) или 1/100 sec (50Hz); исходник указывает отсутствие ограничения «минимальной выдержкой».

<!-- Source EN PDF p.95; unit 1049 -->

При освещении выдержка согласуется с частотой источника, предотвращая мерцание.

<!-- Source EN PDF p.96; unit 1050 -->

При высокой яркости нужна более короткая выдержка. Ограничение минимальной выдержки обычного режима может привести к пересвету. Автоматический AECV2_ANTIFLICKER_AUTO_MODE меняет выдержку по яркости вплоть до минимума sensor. Основное отличие проявляется при высокой яркости: можно подавить пересвет, однако защита от мерцания тогда не действует.

<!-- Source EN PDF p.96; unit 1051 -->

6.7.1.3  Uapi_MeAttrV2_t

<!-- Source EN PDF p.96; unit 1052 -->

【Описание】

<!-- Source EN PDF p.96; unit 1053 -->

Ручные параметры экспозиции разделены на LinearAE и HdrAE.

<!-- Source EN PDF p.96; unit 1054 -->

【Определение】

<!-- Source EN PDF p.96; unit 1055 -->

```text
 typedef struct Uapi_MeAttrV2_s {
     Uapi_LinMeAttrV2_t     stLinMe;
     Uapi_HdrMeAttrV2_t     stHdrMe;
 } Uapi_MeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1056 -->

【Связанные типы данных】

<!-- Source EN PDF p.96; unit 1057 -->

Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1058 -->

Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.96; unit 1059 -->

6.7.1.3.1 Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1060 -->

【Описание】

<!-- Source EN PDF p.96; unit 1061 -->

Параметры ручного управления экспозицией LinearAE.

<!-- Source EN PDF p.96; unit 1062 -->

【Определение】

<!-- Source EN PDF p.96; unit 1063 -->

```text
 typedef struct Uapi_LinMeAttrV2_s {
     bool                 ManualTimeEn;
     bool                 ManualGainEn;
     bool                 ManualIspDgainEn;
     float                TimeValue;
     float                GainValue;
     float                IspDGainValue;
 } Uapi_LinMeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1064 -->

【Члены】

<!-- Source EN PDF p.97; unit 1065 -->

| Имя поля | Описание |
|---|---|
| ManualTimeEn | Включение ручной выдержки, по умолчанию 1. |
| ManualGainEn | Включение ручного усиления sensor, по умолчанию 1. |
| ManualIspDgainEn | Включение ручного цифрового усиления ISP, по умолчанию 1. |
| TimeValue | Ручная выдержка в s, ограничена sensor. |
| GainValue | Ручное усиление sensor, ограничено sensor. |
| IspDGainValue | Ручное цифровое усиление ISP, ограничено ISP. |

<!-- Source EN PDF p.97; unit 1066 -->

【Меры предосторожности】

<!-- Source EN PDF p.97; unit 1067 -->

Действует только при AeOptype = MANUAL. Если ManualTimeEn, ManualGainEn и ManualIspDgainEn равны 1, режим ручной; при отключении любого — полуавтоматический. Далее исходник говорит о «всех четырёх, равных 0»: это приравнивается к автоматическому режиму с сообщением об ошибке; несоответствие количества сохранено.

<!-- Source EN PDF p.97; unit 1068 -->

В ручном/полуручном режиме выдержка и усиление ограничены границами автоматического режима; при выходе за них используются соответствующие границы автоматического режима.

<!-- Source EN PDF p.97; unit 1069 -->

RK356X не поддерживает цифровое усиление ISP; ManualIspDgainEn и IspDGainValue не действуют.

<!-- Source EN PDF p.97; unit 1070 -->

6.7.1.3.2 Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.97; unit 1071 -->

【Описание】

<!-- Source EN PDF p.97; unit 1072 -->

Параметры ручного управления экспозицией HdrAE.

<!-- Source EN PDF p.97; unit 1073 -->

【Определение】

<!-- Source EN PDF p.97; unit 1074 -->

```text
 typedef struct Uapi_HdrMeAttrV2_s {
     bool                    ManualTimeEn;
     bool                    ManualGainEn;
     bool                    ManualIspDgainEn;
     Cam3x1FloatMatrix_t     TimeValue;
     Cam3x1FloatMatrix_t     GainValue;
     Cam3x1FloatMatrix_t     IspDGainValue;
 } Uapi_HdrMeAttrV2_t;
```

<!-- Source EN PDF p.97; unit 1075 -->

【Члены】

<!-- Source EN PDF p.97; unit 1076 -->

Значения переменных совпадают с Uapi_LinMeAttrV2_t.

<!-- Source EN PDF p.97; unit 1077 -->

【Меры предосторожности】

<!-- Source EN PDF p.97; unit 1078 -->

TimeValue/GainValue/IspDGainValue — массивы из трёх элементов. В двухкадровом HDR действуют [0-1] для короткого и длинного кадров; в трёхкадровом — [0-2] для короткого, среднего и длинного.

<!-- Source EN PDF p.97; unit 1079 -->

В ручном/полуручном режиме выдержка и усиление ограничены границами автоматического режима; при выходе за них используются соответствующие границы автоматического режима.

<!-- Source EN PDF p.97; unit 1080 -->

RK356X пока не поддерживает цифровое усиление ISP; ManualIspDgainEn и IspDGainValue не действуют.

<!-- Source EN PDF p.98; unit 1081 -->

#### 6.7.2  Uapi_LinAeRouteAttr_t

<!-- Source EN PDF p.98; unit 1082 -->

【Описание】Определение атрибутов маршрута разложения линейной экспозиции AE.

<!-- Source EN PDF p.98; unit 1083 -->

【Определение】

<!-- Source EN PDF p.98; unit 1084 -->

```text
 typedef struct CalibDb_LinAeRoute_AttrV2_s {
     float* TimeDot;
     int TimeDot_len;
     float* GainDot;
     int GainDot_len;
     float* IspDGainDot;
     int IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_LinAeRoute_AttrV2_t;
 typedef struct Uapi_LinAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinAeRoute_AttrV2_t   Params;
 } Uapi_LinAeRouteAttr_t;
```

<!-- Source EN PDF p.98; unit 1085 -->

【Члены】

<!-- Source EN PDF p.98; unit 1086 -->

| Имя члена | Описание |
|---|---|
| TimeDot | Узел выдержки sensor в s. |
| GainDot | Узел усиления экспозиции sensor. |
| IspgainDot | Узел цифрового усиления ISP |
| PIrisGainDot | Узел эквивалентного усиления диафрагмы |

<!-- Source EN PDF p.98; unit 1087 -->

【Меры предосторожности】

<!-- Source EN PDF p.98; unit 1088 -->

Число узлов кривой не ограничено, рекомендуется не менее 6.

<!-- Source EN PDF p.98; unit 1089 -->

Экспозиция узла — произведение выдержки, усиления sensor, цифрового усиления ISP, эквивалентного усиления диафрагмы и других компонентов. Она должна монотонно возрастать: следующий узел больше предыдущего. Далее исходник говорит: «у первого узла минимальная экспозиция, у второго — максимальная»; сомнительное соответствие многоузловому описанию сохранено.

<!-- Source EN PDF p.98; unit 1090 -->

Выдержка узла задаётся в секундах, допускается минимум 0; код корректирует фактическую минимальную выдержку по ограничениям sensor.

<!-- Source EN PDF p.98; unit 1091 -->

Компонент диафрагмы поддерживает только P-Iris, но не DC-Iris. Эквивалентное усиление P-iris действует лишь при включённом автоматическом Airis; иначе диафрагма фиксирована в начальном положении. Расчёт описан в AecIrisCtrl.

<!-- Source EN PDF p.98; unit 1092 -->

Заданные узлы не являются окончательным маршрутом. Фактические границы компонентов определяются совместно узлами и вручную настроенными пределами. Сначала выполняется первая коррекция границ узлов:

<!-- Source EN PDF p.99; unit 1093 -->

Если ограничения SENSOR/ISP не превышены, границы узлов не меняются; иначе ограничиваются возможностями SENSOR/ISP. При нулевых ручных границах действует результат первой коррекции. При ненулевых ручных границах в допустимых пределах выполняется вторая коррекция по ручному диапазону; если ручные границы превышают ограничения, сохраняется результат первой коррекции. Между соседними узлами увеличивают только один компонент при фиксированных остальных. Этот компонент задаёт стратегию участка: например, увеличение только усиления означает его приоритет.

<!-- Source EN PDF p.99; unit 1094 -->

RK356X пока не поддерживает цифровое усиление ISP, поэтому IspgainDot не действует.

<!-- Source EN PDF p.99; unit 1095 -->

#### 6.7.3  Uapi_HdrAeRouteAttr_t

<!-- Source EN PDF p.99; unit 1096 -->

【Описание】Определение атрибутов маршрута разложения HDR-экспозиции AE.

<!-- Source EN PDF p.99; unit 1097 -->

【Определение】

<!-- Source EN PDF p.99; unit 1098 -->

```text
 typedef struct CalibDb_HdrAeRoute_AttrV2_s {
     float* Frm0TimeDot;
     int Frm0TimeDot_len;
     float* Frm0GainDot;
     int Frm0GainDot_len;
     float* Frm0IspDGainDot;
     int Frm0IspDGainDot_len;
     float* Frm1TimeDot;
     int Frm1TimeDot_len;
     float* Frm1GainDot;
     int Frm1GainDot_len;
     float* Frm1IspDGainDot;
     int Frm1IspDGainDot_len;
     float* Frm2TimeDot;
     int Frm2TimeDot_len;
     float* Frm2GainDot;
     int Frm2GainDot_len;
     float* Frm2IspDGainDot;
     int Frm2IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_HdrAeRoute_AttV2r_t;
 typedef struct Uapi_HdrAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAeRoute_AttrV2_t   Params;
 } Uapi_HdrAeRouteAttr_t;
```

<!-- Source EN PDF p.100; unit 1099 -->

【Поля】

<!-- Source EN PDF p.100; unit 1100 -->

| Имя поля | Описание |
|---|---|
| Frm0/1/2TimeDot | Узлы выдержки в секундах: в двухкадровом HDR действуют Frm0/1TimeDot, в трёхкадровом — Frm0/1/2TimeDot. Исходное обозначение FRM0~3 как порядка от короткой к длинной экспозиции сохранено. |
| Frm0/1/2GainDot | Узлы усиления Sensor: Frm0/1GainDot для двухкадрового HDR и Frm0/1/2GainDot для трёхкадрового; значения в единицах 1x. Исходник обозначает порядок от короткой к длинной экспозиции как FRM0~3. |
| Frm0/1/2IspDGainDot | Узлы цифрового усиления ISP: Frm0/1IspDGainDot для двухкадрового HDR и Frm0/1/2IspDGainDot для трёхкадрового; значения в единицах 1x. Исходное FRM0~3 обозначает порядок от короткой к длинной экспозиции. |
| PIrisDot | Узлы эквивалентного усиления диафрагмы, фактические значения в единицах 1x. |

<!-- Source EN PDF p.100; unit 1101 -->

【Меры предосторожности】

<!-- Source EN PDF p.100; unit 1102 -->

Число узлов не ограничено; рекомендуется не менее 6 для плавного разложения экспозиции.

<!-- Source EN PDF p.100; unit 1103 -->

В двухкадровом HDR задаются Frm0/1TimeDot, Frm0/1GainDot и Frm0/1IspDGainDot для короткого и длинного кадров. В трёхкадровом — Frm0/1/2TimeDot, Frm0/1/2GainDot и Frm0/1/2IspDGainDot для короткого, среднего и длинного. Распределяйте выдержки разумно: их сумма не должна превышать максимум, допускаемый частотой кадров!

<!-- Source EN PDF p.100; unit 1104 -->

Экспозиция узла — произведение выдержки, усиления sensor, цифрового усиления ISP, эквивалентного усиления диафрагмы и других компонентов. Она должна монотонно возрастать: следующий узел больше предыдущего. Далее исходник говорит: «у первого узла минимальная экспозиция, у второго — максимальная»; сомнительное соответствие многоузловому описанию сохранено.

<!-- Source EN PDF p.100; unit 1105 -->

Выдержка узла задаётся в секундах, допускается минимум 0; код корректирует фактическую минимальную выдержку по ограничениям sensor.

<!-- Source EN PDF p.100; unit 1106 -->

Компонент диафрагмы поддерживает только P-Iris, но не DC-Iris. Эквивалентное усиление P-iris действует лишь при включённом автоматическом Airis; иначе диафрагма фиксирована в начальном положении. Расчёт описан в AecIrisCtrl.

<!-- Source EN PDF p.100; unit 1107 -->

Заданные узлы не являются окончательным маршрутом: границы компонентов зависят и от узлов, и от ручных пределов. Сначала границы узлов проверяются: в пределах SENSOR/ISP остаются прежними, иначе ограничиваются аппаратурой. При нулевых ручных границах действует первая коррекция; при ненулевых допустимых границах выполняется

<!-- Source EN PDF p.101; unit 1108 -->

вторая коррекция по ручному диапазону. Если ручные границы превышают ограничения, действует первая коррекция. При росте экспозиции соседних узлов увеличивают один компонент, фиксируя остальные. Этот компонент определяет стратегию участка: например, увеличение только усиления задаёт его приоритет.

<!-- Source EN PDF p.101; unit 1109 -->

356X пока не поддерживает цифровое усиление ISP; Frm0/1/2ispDGainDot не действуют.

<!-- Source EN PDF p.101; unit 1110 -->

#### 6.7.4  Uapi_LinExpAttrV2_t

<!-- Source EN PDF p.101; unit 1111 -->

【Описание】

<!-- Source EN PDF p.101; unit 1112 -->

Определение параметров настройки линейной экспозиции AE.

<!-- Source EN PDF p.101; unit 1113 -->

【Определение】

<!-- Source EN PDF p.101; unit 1114 -->

```text
 typedef struct CalibDb_LinearAE_AttrV2_s {
     uint8_t RawStatsEn;
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t      StrategyMode;
     CalibDb_LinExpInitExpV2_t       InitExp;
     CalibDb_LinAeRoute_AttrV2_t     Route;
     CalibDb_AecDynamicSetpointV2_t  DySetpoint;
     CalibDb_AecBacklightV2_t        BackLightCtrl;
     CalibDb_AecOverExpCtrlV2_t OverExpCtrl;
 } CalibDb_LinearAE_AttrV2_t;
 typedef struct Uapi_LinExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinearAE_AttrV2_t     Params;
 } Uapi_LinExpAttrV2_t;
```

<!-- Source EN PDF p.101; unit 1115 -->

【Члены】

<!-- Source EN PDF p.102; unit 1116 -->

| Имя члена | Описание |
|---|---|
| RawStatsEn | Использование статистической яркости домена Raw для линейной экспозиции. |
| EvBias | Процентное смещение экспозиции при автоматической регулировке, в %, рекомендуемый диапазон [-200, +200]. |
| ToleranceIn/Out | Допуск яркости при автоматической регулировке, в %, диапазон [0,100]. |
| StrategyMode | Стратегия AE: приоритет светов или слабого освещения; пока не действует. |
| DySetpoint | Динамическая целевая яркость AE, изменяемая с экспозицией. |
| BackLightCtrl | Параметры компенсации контрового света |
| OverExpCtrl | Параметры подавления ярких областей |

<!-- Source EN PDF p.102; unit 1117 -->

【Меры предосторожности】

<!-- Source EN PDF p.102; unit 1118 -->

EvBias корректирует целевую яркость SetPoint/IRSetPoint (фиксированную или динамическую) для особых сцен. Действующая цель равна (SetPoint)\*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]. При EvBias=100 она вдвое выше исходной, при EvBias=-100 — вдвое ниже.

<!-- Source EN PDF p.102; unit 1119 -->

Допуск яркости AE задаётся Tolerance. После сходимости B должна находиться в [действующая целевая яркость X(1-Tolerance/100), действующая целевая яркость X(1+Tolerance/100)]. Большие ToleranceIn/Out влияют на скорость реакции и действие EvBias; если шаг EvBias меньше ToleranceIn/Out, коррекция яркости может не проявиться.

<!-- Source EN PDF p.102; unit 1120 -->

StrategyMode пока не действует.

<!-- Source EN PDF p.102; unit 1121 -->

【Связанные типы данных】

<!-- Source EN PDF p.102; unit 1122 -->

CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1123 -->

CalibDb_AecBacklightV2_t

<!-- Source EN PDF p.102; unit 1124 -->

CalibDb_AecOverExpCtrlV2_t

<!-- Source EN PDF p.102; unit 1125 -->

6.7.4.1  CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1126 -->

【Описание】Определение динамических целевых значений AE.

<!-- Source EN PDF p.102; unit 1127 -->

【Определение】

<!-- Source EN PDF p.102; unit 1128 -->

```text
 typedef struct CalibDb_AecDynamicSetpointV2_s {
     float* ExpLevel;
     int ExpLevel_len;
     float* DySetpoint;
     int DySetpoint_len;
 } CalibDb_AecDynamicSetpointV2_t;
```

<!-- Source EN PDF p.103; unit 1129 -->

【Члены】

<!-- Source EN PDF p.103; unit 1130 -->

| Имя поля | Описание |
|---|---|
| ExpLevel | Узлы динамической экспозиции: значение узла равно текущей экспозиции; число не ограничено, рекомендуется не менее 6 для плавного перехода. Сомнительная отрицательная формулировка оригинала отмечена в записях. |
| DySetpoint | Динамическая целевая яркость меняется с экспозицией: большему узлу экспозиции соответствует меньшая целевая яркость. Узлы соответствуют друг другу один к одному, их число равно ExpLevel; оно не ограничено, но рекомендуется не менее 6 для плавного перехода. |

<!-- Source EN PDF p.103; unit 1131 -->

#### 6.7.5  Uapi_HdrExpAttrV2_t

<!-- Source EN PDF p.103; unit 1132 -->

【Описание】Определение параметров настройки HDR-экспозиции AE.

<!-- Source EN PDF p.103; unit 1133 -->

【Определение】

<!-- Source EN PDF p.103; unit 1134 -->

```text
 typedef struct CalibDb_HdrAE_AttrV2_s {
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t StrategyMode;
     float LumaDistTh; //used for area-growing
     CalibDb_HdrExpInitExpV2_t InitExp;
     CalibDb_HdrAeRoute_AttrV2_t Route;
     CalibDb_ExpRatioCtrlV2_t ExpRatioCtrl;
     CalibDb_LongFrmCtrlV2_t LongFrmMode;
     CalibDb_LfrmCtrlV2_t LframeCtrl;
     CalibDb_MfrmCtrlV2_t MframeCtrl;
     CalibDb_SfrmCtrlV2_t SframeCtrl;
 } CalibDb_HdrAE_AttrV2_t;
 typedef struct Uapi_HdrExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAE_AttrV2_t        Params;
 } Uapi_HdrExpAttrV2_t;
```

<!-- Source EN PDF p.103; unit 1135 -->

【Члены】

<!-- Source EN PDF p.104; unit 1136 -->

| Имя члена | Описание |
|---|---|
| ToleranceIn/Out | Допуск яркости при автоматической регулировке, в %, диапазон [0,100]. |
| LongfrmMode | Параметры режима длинного кадра |
| StrategyMode | Стратегия AE: приоритет слабого освещения/светов (AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR/AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR). |
| Evbias | Процентное смещение экспозиции при автоматической регулировке, в %, рекомендуемый диапазон [-200, +200]. |
| ExpRatioCtrl | Модуль управления отношением экспозиций HdrAE; действует только при многокадровом HDR. |
| LframeCtrl | Параметры длинного кадра |
| MframeCtrl | Параметры среднего кадра; только для трёхкадрового HDR. |
| SframeCtrl | Параметры короткого кадра |

<!-- Source EN PDF p.104; unit 1137 -->

【Связанные типы данных】

<!-- Source EN PDF p.104; unit 1138 -->

CalibDb_LFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1139 -->

CalibDb_MFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1140 -->

CalibDb_SFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1141 -->

#### 6.7.6  Uapi_IrisAttrV2_t

<!-- Source EN PDF p.104; unit 1142 -->

【Описание】

<!-- Source EN PDF p.104; unit 1143 -->

Параметры управления диафрагмой.

<!-- Source EN PDF p.104; unit 1144 -->

【Определение】

<!-- Source EN PDF p.104; unit 1145 -->

```text
 typedef struct CalibDb_AecIrisCtrlV2_s {
     uint8_t Enable;
     CalibDb_IrisTypeV2_t IrisType;
     RKAiqOPMode_t IrisOpType;
     CalibDb_MIris_AttrV2_t ManualAttr;
     CalibDb_PIris_AttrV2_t PIrisAttr;
     CalibDb_DCIris_AttrV2_t DCIrisAttr;
 } CalibDb_AecIrisCtrlV2_t;
 typedef struct Uapi_IrisAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_AecIrisCtrlV2_t       Params;
 } Uapi_IrisAttrV2_t;
```

<!-- Source EN PDF p.104; unit 1146 -->

【Члены】

<!-- Source EN PDF p.105; unit 1147 -->

| Имя поля | Описание |
|---|---|
| Enable | Включение автоматического управления диафрагмой. |
| IrisType | Тип диафрагмы: P (P-iris) или DC (DC-iris). |
| IrisOpType | Режим управления: автоматический RK_AIQ_OP_MODE_AUTO или ручной RK_AIQ_OP_MODE_MANUAL. |
| ManualAttr | Параметры ручного управления диафрагмой |
| PIrisAttr | Атрибуты P-диафрагмы |
| DCIrisAttr | Атрибуты DC-диафрагмы |

<!-- Source EN PDF p.105; unit 1148 -->

6.7.6.1  CalibDb_MIris_AttrV2_t

<!-- Source EN PDF p.105; unit 1149 -->

【Описание】

<!-- Source EN PDF p.105; unit 1150 -->

Параметры ручного управления диафрагмой.

<!-- Source EN PDF p.105; unit 1151 -->

【Определение】

<!-- Source EN PDF p.105; unit 1152 -->

```text
 typedef struct CalibDb_MIris_AttrV2_s {
     int PIrisGainValue;
     int DCIrisHoldValue;
 } CalibDb_MIris_AttrV2_t;
```

<!-- Source EN PDF p.105; unit 1153 -->

【Члены】

<!-- Source EN PDF p.105; unit 1154 -->

| Имя поля | Описание |
|---|---|
| PIrisGainValue | Ручное эквивалентное усиление P-диафрагмы, ограниченное устройством, диапазон [1,1024]. |
| DCIrisHoldValue | HoldValue DC-диафрагмы, зависит от устройства, диапазон [0,100]. |

<!-- Source EN PDF p.105; unit 1155 -->

【Меры предосторожности】

<!-- Source EN PDF p.105; unit 1156 -->

Ручное управление включается при IrisOpType = RK_AIQ_OP_MODE_MANUAL. Для P-диафрагмы действует только PirisGainValue, для DC — только DCIrisHoldValue.

<!-- Source EN PDF p.105; unit 1157 -->

DCIrisHoldValue непосредственно задаёт PWM двигателя в ручном режиме, диапазон [0,100]. При HoldValue между ClosePwmDuty и OpenPwmDuty из AecIrisCtrl размер сохраняется. Выше OpenPwmDuty диафрагма открывается тем быстрее, чем больше значение; ниже ClosePwmDuty закрывается тем быстрее, чем меньше значение.

<!-- Source EN PDF p.106; unit 1158 -->

6.7.6.2  CalibDb_PIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1159 -->

【Описание】

<!-- Source EN PDF p.106; unit 1160 -->

Атрибуты P-диафрагмы.

<!-- Source EN PDF p.106; unit 1161 -->

【Определение】

<!-- Source EN PDF p.106; unit 1162 -->

```text
 #define AEC_PIRIS_STAP_TABLE_MAX (1024)
 typedef struct CalibDb_PIris_AttrV2_s {
     uint16_t              TotalStep;
     uint16_t              EffcStep;
     bool                  ZeroIsMax;
     uint16_t              StepTable[AEC_PIRIS_STAP_TABLE_MAX];
 } CalibDb_PIris_AttrV2_t;
```

<!-- Source EN PDF p.106; unit 1163 -->

【Члены】

<!-- Source EN PDF p.106; unit 1164 -->

| Имя поля | Описание |
|---|---|
| TotalStep | Полное число шагов двигателя P-iris, зависит от объектива. |
| EffcStep | Число используемых шагов двигателя P-iris, зависит от объектива. |
| ZeroIsMax | Соответствие step0 максимальной диафрагме зависит от объектива: 0 означает минимальное отверстие в step0, 1 — максимальное. |
| StepTable | Таблица соответствия положения двигателя и эквивалентного усиления диафрагмы, зависит от P-iris объектива. |

<!-- Source EN PDF p.106; unit 1165 -->

6.7.6.3  CalibDb_DCIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1166 -->

【Описание】

<!-- Source EN PDF p.106; unit 1167 -->

Атрибуты DC-диафрагмы.

<!-- Source EN PDF p.106; unit 1168 -->

【Определение】

<!-- Source EN PDF p.106; unit 1169 -->

```text
 typedef struct CalibDb_DCIris_AttrV2_s {
     float       Kp;
     float       Ki;
     float       Kd;
     int         MinPwmDuty;
     int         MaxPwmDuty;
     int         OpenPwmDuty;
     int         ClosePwmDuty;
 } CalibDb_DCIris_AttrV2_t;
```

<!-- Source EN PDF p.107; unit 1170 -->

【Члены】

<!-- Source EN PDF p.107; unit 1171 -->

| Имя поля | Описание |
|---|---|
| Kp | Пропорциональный коэффициент ограничения резких изменений скважности диафрагмы. По исходнику при большем значении она меняется медленнее. Слишком большое значение вызывает раннее торможение и долгую регулировку, слишком малое — позднее торможение и перерегулирование. Подбор зависит от DC-iris объектива и схемы. Рекомендуется 0.5, диапазон [0,1]. |
| Ki | Интегральный коэффициент скорости открытия/закрытия. По исходнику большее значение увеличивает скорость; слишком большое вызывает перерегулирование и колебания, слишком малое — медленную регулировку и колебания при резких изменениях света. Рекомендуется 0.2, диапазон [0,1]. |
| Kd | Дифференциальный коэффициент скорости открытия/закрытия: большее значение увеличивает скорость. Рекомендуется 0.3, диапазон [0,1]. |
| MinPwmDuty | Минимальный PWM в %, зависит от объектива и схемы. Меньшее значение допускает более быстрое закрытие, но повышает риск колебаний. Диапазон [0,100], по умолчанию 0. |
| MaxPwmDuty | Максимальный PWM в %, зависит от объектива и схемы. Большее значение ускоряет открытие; слишком малое может завершить управление до максимального открытия. Диапазон [0,100], по умолчанию 100. |
| OpenPwmDuty | Порог открытия OpenPwmDuty: диафрагма открывается при PWM строго выше него. Значение зависит от DC-iris объектива, в %. |
| ClosePwmDuty | Порог закрытия ClosePwmDuty: диафрагма закрывается при PWM строго ниже него. Значение зависит от DC-iris объектива, в %. |

<!-- Source EN PDF p.107; unit 1172 -->

【Меры предосторожности】

<!-- Source EN PDF p.107; unit 1173 -->

При выключении автоматической диафрагмы DC-iris по умолчанию полностью открывается, P-iris переходит в положение максимального отверстия. Изменить эти начальные положения можно через InitPIrisGainValue и InitDCIrisDutyValue модуля AecInitValue.

<!-- Source EN PDF p.107; unit 1174 -->

Основной процесс алгоритма автоматической диафрагмы Airis:

<!-- Source EN PDF p.107; unit 1175 -->

Для DC-iris алгоритм Airis управляет отверстием по отклонению яркости от цели. Когда экспозиция минимальна, но яркость превышает целевой допуск, управление AE прекращается, выдержка и усиление фиксируются, включается AIRIS. Если яркость стабильна и PWM DC-iris

<!-- Source EN PDF p.108; unit 1176 -->

превышает OpenPwmDuty, диафрагма считается полностью открытой; Airis завершается и возвращает управление AE.

<!-- Source EN PDF p.108; unit 1177 -->

P-iris управляется через AecRoute: размер отверстия преобразуется в эквивалентное усиление для разложения экспозиции.

<!-- Source EN PDF p.108; unit 1178 -->

StepTable обычно строят по соответствию положения двигателя и отверстия, предоставленному производителем. AecRoute AE переводит отверстие в эквивалентное усиление, поэтому требуется хорошая линейность P-iris. Диапазон усиления [1,1024]: F1.0 соответствует 1024, F1.4 — 512, далее до F32.0 — 1. Пересчитайте отверстия в усиления и заполните StepTable в порядке положений step0, step1…stepN.

<!-- Source EN PDF p.108; unit 1179 -->

TotalStep — полное число шагов двигателя, зависящее от объектива. EffcStep — число используемых шагов, обычно меньше TotalStep. Возле закрытого конца ошибка эквивалентного усиления велика и возможны колебания, поэтому эти положения обычно не используются.

<!-- Source EN PDF p.108; unit 1180 -->

Таблица 4-1 связывает положение двигателя, отверстие и усиление для примера StepTable. Соответствия положения и площади в столбцах 1–2 и 4–5 предоставлены производителем объектива. У него 81 шаг; step0 соответствует максимальному отверстию F1.4 и усилению 512. Для step3 площадь 195.869 даёт усиление = 512\* (195.869/201.062)=499 после округления. Остальные значения рассчитываются аналогично. Далее исходник ссылается на «таблицу 1-1»: у закрытого конца площадь может быть в тысячи раз меньше максимальной, ошибка усиления велика; такие положения не рекомендуется использовать из-за колебаний экспозиции. Заполните StepTable усилениями в порядке step0, step1…stepN. Различие ссылок на таблицу сохранено.

<!-- Source EN PDF p.108; unit 1181 -->

OpenPwmDuty и ClosePwmDuty измеряют для конкретного DC-iris объектива. Некоторые объективы открываются выше OpenPwmDuty. Далее исходник говорит о закрытии ниже OpenPwmDuty, но затем определяет ClosePwmDuty &lt;= PWM &lt;= OpenPwmDuty как область удержания HoldValue; противоречие не исправлено молча. У других объективов один порог: выше — открытие, ниже — закрытие, на пороге — удержание. Тогда ClosePwmDuty = OpenPwmDuty = HoldValue.

<!-- Source EN PDF p.108; unit 1182 -->

Настройка ручной диафрагмы аналогична ручной экспозиции: AecOpType перевести в ручной режим и включить AecManualCtrl.ManualIrisEn. Исходник дважды указывает IrisType = P-iris, связывая его сначала только с PirisGainValue, затем только с DCIrisValue. Противоречивое условие типа сохранено и требует проверки перед применением.

<!-- Source EN PDF p.109; unit 1183 -->

Таблица 4-1. Положение двигателя P-iris, площадь отверстия и эквивалентное усиление

<!-- Source EN PDF p.110; unit 1184 -->

| Положение шага | Площадь отверстия (mm2) | Эквивалентное усиление | Положение шага | Площадь отверстия (mm2) | Эквивалентное усиление |
|---|---|---|---|---|---|
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- Source EN PDF p.111; unit 1185 -->

| Положение шага | Площадь отверстия (mm2) | Эквивалентное усиление | Положение шага | Площадь отверстия (mm2) | Эквивалентное усиление |
|---|---|---|---|---|---|
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | Закрыто | 0 |
| 32 | 87.777 | 224 | 73 | Закрыто | 0 |
| 33 | 84.156 | 214 | 74 | Закрыто | 0 |
| 34 | 80.569 | 205 | 75 | Закрыто | 0 |
| 35 | 77.02 | 196 | 76 | Закрыто | 0 |
| 36 | 73.51 | 187 | 77 | Закрыто | 0 |
| 37 | 70.043 | 178 | 78 | Закрыто | 0 |
| 38 | 66.621 | 170 | 79 | Закрыто | 0 |
| 39 | 63.247 | 161 | 80 | Закрыто | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- Source EN PDF p.111; unit 1186 -->

#### 6.7.7  Uapi_ExpWin_t

<!-- Source EN PDF p.111; unit 1187 -->

【Описание】Определение атрибутов окна статистики AE.

<!-- Source EN PDF p.111; unit 1188 -->

【Определение】

<!-- Source EN PDF p.111; unit 1189 -->

```text
 typedef struct window {
     uint16_t h_offs;
     uint16_t v_offs;
     uint16_t h_size;
     uint16_t v_size;
 } window_t;
 typedef struct Uapi_ExpWin_s {
   rk_aiq_uapi_sync_t            sync;
   window                        Params;
 } Uapi_ExpWin_t;
```

<!-- Source EN PDF p.111; unit 1190 -->

【Члены】

<!-- Source EN PDF p.112; unit 1191 -->

| Имя члена | Описание |
|---|---|
| h_offs | Горизонтальное смещение левого верхнего угла окна от начала координат — левого верхнего угла светочувствительной области sensor. |
| v_offs | Вертикальное смещение левого верхнего угла окна от начала координат — левого верхнего угла светочувствительной области sensor. |
| h_size | Горизонтальный размер окна |
| v_size | Вертикальный размер окна |

<!-- Source EN PDF p.112; unit 1192 -->

#### 6.7.8  Uapi_ExpQueryInfo_t

<!-- Source EN PDF p.112; unit 1193 -->

【Описание】Определение запроса параметров экспозиции AE.

<!-- Source EN PDF p.112; unit 1194 -->

【Определение】

<!-- Source EN PDF p.112; unit 1195 -->

```text
 typedef struct Uapi_ExpQueryInfo_s {
     bool              IsConverged;
     bool              IsExpMax;
     float             LumaDeviation;
     float             HdrLumaDeviation[3];
     float             MeanLuma;
     float             HdrMeanLuma[3];
     float             GlobalEnvLux;
     float             BlockEnvLux[ISP2_RAWAE_WINNUM_MAX];
     RKAiqAecExpInfo_t CurExpInfo;
     unsigned short    Piris;
     float             LinePeriodsPerField;
     float             PixelPeriodsPerLine;
     float             PixelClockFreqMHZ;
 } Uapi_ExpQueryInfo_t;
```

<!-- Source EN PDF p.112; unit 1196 -->

【Члены】

<!-- Source EN PDF p.113; unit 1197 -->

| Имя члена | Описание |
|---|---|
| IsConverged | Сошлась ли автоматическая экспозиция |
| IsExpMax | Достигнут ли максимум экспозиции ISP |
| LumaDeviation | Отклонение яркости от цели AEC в линейном режиме: положительное — фактическая яркость выше цели, отрицательное — ниже, 0 — в пределах допуска цели. |
| HdrLumaDeviation | Отклонения фактической яркости от цели для кадров HDR: положительное — выше цели, отрицательное — ниже, 0 — в допуске. В двухкадровом HDR 0 и 1 соответствуют короткому и длинному кадрам, в трёхкадровом 0–2 — короткому, среднему и длинному. |
| MeanLuma | Средняя яркость текущего изображения в линейном режиме. |
| HdrMeanLuma | Средняя яркость текущих кадров HDR: в двухкадровом режиме элементы 0 и 1 — короткий и длинный кадры; в трёхкадровом все элементы — короткий, средний и длинный. |
| CurExpInfo | Текущие параметры выдержки и усиления sensor, разделённые по режиму на LinearExp и HdrExp[3]. |
| Piris | Aperture |
| LinePeriodsPerField | sensor VTS |
| PixelPeriodsPerLine | sensor HTS |
| PixelClockFreqMHZ | Частота пиксельного такта Sensor в MHz. |

<!-- Source EN PDF p.114; unit 1198 -->

### 6.8 Поиск проблем и отладка

<!-- Source EN PDF p.114; unit 1199 -->

При мерцании яркости, перерегулировании или несоответствии ожидаемой яркости рекомендуется записать AE LOG проблемной сцены для быстрого анализа.

<!-- Source EN PDF p.114; unit 1200 -->

#### 6.8.1 Тест синхронизации экспозиции и статистики

<!-- Source EN PDF p.114; unit 1201 -->

Перед калибровкой ISP разработчик драйвера или настройщик должен заполнить SensorInfo в IQ XML. Ошибки этих параметров экспозиции могут вызвать неправильную экспозицию, мерцание и другие проблемы. После настройки рекомендуется самопроверка SyncTest; параметры описаны в Rockchip_Tuning_Guide_ISP30.

<!-- Source EN PDF p.114; unit 1202 -->

SyncTest циклически задаёт N наборов экспозиций для проверки кадров вступления в силу выдержки, усиления sensor и переключения DCG. Он также проверяет линейность и правильность формул преобразования регистров выдержки/усиления и связанных параметров.

<!-- Source EN PDF p.114; unit 1203 -->

Параметры SyncTest:

<!-- Source EN PDF p.114; unit 1204 -->

【Описание】

<!-- Source EN PDF p.114; unit 1205 -->

Тест синхронизации циклически задаёт N экспозиций через заданное число кадров, проверяя кадры вступления в силу выдержки/усиления и настройки экспозиции sensor.

<!-- Source EN PDF p.114; unit 1206 -->

【Члены】

<!-- Source EN PDF p.114; unit 1207 -->

| Имя поля | Описание |
|---|---|
| Enable | Включение теста синхронизации экспозиции и статистики. |
| IntervalFrm | Интервал переключения экспозиции в кадрах |
| AlterExp | Параметры переключения экспозиции |

<!-- Source EN PDF p.114; unit 1208 -->

AlterExp

<!-- Source EN PDF p.114; unit 1209 -->

Два набора по режиму: LinearAE и HdrAE.

<!-- Source EN PDF p.115; unit 1210 -->

| Имя поля | Описание |
|---|---|
| TimeValue | Значение выдержки |
| GainValue | Значение усиления экспозиции |
| IspDgainValue | Значение цифрового усиления ISP |
| DcgMode | Значение режима DCG |
| PIrisGainValue | Эквивалентное усиление P-iris |

<!-- Source EN PDF p.115; unit 1211 -->

В исходном примере LOG приведены только ключевые сведения. Красная рамка отмечает переключение экспозиции. Если яркость соответствует экспозиции без задержки, опережения и нарушения линейности, sensorinfo предварительно можно считать настроенным правильно.

<!-- Source EN PDF p.115; unit 1212 -->

![Технический рисунок английского оригинала — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1039.png)

<!-- Source EN PDF p.115; unit 1213 -->

#### 6.8.2 Мерцание при изменении экспозиции

<!-- Source EN PDF p.115; unit 1214 -->

Возможные причины мерцания при изменении экспозиции:

<!-- Source EN PDF p.115; unit 1215 -->

(1) Неверные кадры вступления в силу gain/time в CISExpUpdate. В примере LOG показаны только ключевые строки каждого кадра.

<!-- Source EN PDF p.115; unit 1216 -->

![Технический рисунок английского оригинала — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1040.png)

<!-- Source EN PDF p.115; unit 1217 -->

Красная рамка показывает ошибочную яркость: она изменяется противоположно росту/снижению экспозиции. Резкий скачок приходится на второй кадр после изменения выдержки и усиления и следует выдержке. Это указывает на неверные кадры вступления в силу gain/time: они действуют не одновременно, нарушая соответствие яркости и экспозиции. Исправьте число кадров gain/time. Для воспроизведения используйте AE syncTest

<!-- Source EN PDF p.116; unit 1218 -->

с двумя наборами различных усилений/выдержек, переключая их и проверяя воспроизведение по LOG.

<!-- Source EN PDF p.116; unit 1219 -->

(2) Ошибка драйвера вызывает колебания яркости без сходимости, часто при ярком освещении. В LOG приведены ключевые строки кадров.

<!-- Source EN PDF p.116; unit 1220 -->

![Технический рисунок английского оригинала — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1044.png)

<!-- Source EN PDF p.116; unit 1221 -->

На рисунке выдержка колеблется между 59ms и 44ms; отношение средних яркостей сильно отличается от отношения экспозиций, что указывает на нелинейность. Сначала выведите регистр экспозиции в драйвере sensor и сравните с LOG. Для проверки переключайте через syncTest несколько экспозиций, включая проблемную, и анализируйте линейность яркости по кадрам LOG.

<!-- Source EN PDF p.116; unit 1222 -->

![Технический рисунок английского оригинала — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1045.png)

<!-- Source EN PDF p.116; unit 1223 -->

(3) Мерцание вызывается модулями после AE. В примере LOG показаны ключевые строки кадров.

<!-- Source EN PDF p.116; unit 1224 -->

![Технический рисунок английского оригинала — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1046.png)

<!-- Source EN PDF p.117; unit 1225 -->

В левом LOG при снижении SMeanLuma и MMeanLuma меняется яркость выхода TmoMeanluma; в таком случае требуется отладка TMO.

<!-- Source EN PDF p.118; unit 1226 -->

## 7.   AWB

<!-- Source EN PDF p.118; unit 1227 -->

### 7.1 Обзор

<!-- Source EN PDF p.118; unit 1228 -->

AWB изменяет усиления цветовых каналов камеры, компенсируя цветовую температуру среды и собственное различие усилений устройства, чтобы изображение верно передавало цвет объекта.

<!-- Source EN PDF p.118; unit 1229 -->

### 7.2 Основные понятия

<!-- Source EN PDF p.118; unit 1230 -->

Цветовая температура определяется через абсолютное чёрное тело: если излучение источника в видимом диапазоне совпадает с ним, температура этого тела называется цветовой температурой источника.

<!-- Source EN PDF p.118; unit 1231 -->

Баланс белого: при разных цветовых температурах белый на sensor может выглядеть синеватым или красноватым. Алгоритм регулирует R, G и B для реалистичного белого.

<!-- Source EN PDF p.118; unit 1232 -->

### 7.3 Описание функций

<!-- Source EN PDF p.118; unit 1233 -->

AWB состоит из статистики WB и алгоритма управления балансом белого.

<!-- Source EN PDF p.118; unit 1234 -->

### 7.4 Справочник функционального API

<!-- Source EN PDF p.118; unit 1235 -->

#### 7.4.1  rk_aiq_uapi2_setWBMode

<!-- Source EN PDF p.118; unit 1236 -->

【Описание】Установка режима баланса белого.

<!-- Source EN PDF p.118; unit 1237 -->

【Синтаксис】

<!-- Source EN PDF p.118; unit 1238 -->

```text
 XCamReturn rk_aiq_uapi2_setWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.118; unit 1239 -->

【Параметры】

<!-- Source EN PDF p.118; unit 1240 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим баланса белого | Вход |

<!-- Source EN PDF p.118; unit 1241 -->

【Возвращаемое значение】

<!-- Source EN PDF p.119; unit 1242 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.119; unit 1243 -->

【Примечание】

<!-- Source EN PDF p.119; unit 1244 -->

В ручном режиме усиление WB определяется текущими ручными параметрами. Для перехода в ручной режим с одновременным заданием усиления используйте rk_aiq_uapi2_setMWBGain.

<!-- Source EN PDF p.119; unit 1245 -->

【Зависимости】

<!-- Source EN PDF p.119; unit 1246 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1247 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.119; unit 1248 -->

【Пример】

<!-- Source EN PDF p.119; unit 1249 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.119; unit 1250 -->

#### 7.4.2  rk_aiq_uapi2_getWBMode

<!-- Source EN PDF p.119; unit 1251 -->

【Описание】Получение режима баланса белого.

<!-- Source EN PDF p.119; unit 1252 -->

【Синтаксис】

<!-- Source EN PDF p.119; unit 1253 -->

```text
 XCamReturn rk_aiq_uapi2_getWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.119; unit 1254 -->

【Параметры】

<!-- Source EN PDF p.119; unit 1255 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим баланса белого | Выход |

<!-- Source EN PDF p.119; unit 1256 -->

【Возвращаемое значение】

<!-- Source EN PDF p.119; unit 1257 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.119; unit 1258 -->

【Зависимости】

<!-- Source EN PDF p.119; unit 1259 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1260 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.119; unit 1261 -->

【Пример】

<!-- Source EN PDF p.119; unit 1262 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.120; unit 1263 -->

#### 7.4.3  rk_aiq_uapi2_lockAWB

<!-- Source EN PDF p.120; unit 1264 -->

【Описание】Блокировка текущих параметров WB.

<!-- Source EN PDF p.120; unit 1265 -->

【Синтаксис】

<!-- Source EN PDF p.120; unit 1266 -->

```text
 XCamReturn rk_aiq_uapi2_lockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1267 -->

【Параметры】

<!-- Source EN PDF p.120; unit 1268 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.120; unit 1269 -->

【Возвращаемое значение】

<!-- Source EN PDF p.120; unit 1270 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.120; unit 1271 -->

【Зависимости】

<!-- Source EN PDF p.120; unit 1272 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.120; unit 1273 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.120; unit 1274 -->

【Пример】

<!-- Source EN PDF p.120; unit 1275 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.120; unit 1276 -->

#### 7.4.4  rk_aiq_uapi2_unlockAWB

<!-- Source EN PDF p.120; unit 1277 -->

【Описание】Снятие блокировки параметров WB.

<!-- Source EN PDF p.120; unit 1278 -->

【Синтаксис】

<!-- Source EN PDF p.120; unit 1279 -->

```text
 XCamReturn rk_aiq_uapi2_unlockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1280 -->

【Параметры】

<!-- Source EN PDF p.120; unit 1281 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.120; unit 1282 -->

【Возвращаемое значение】

<!-- Source EN PDF p.121; unit 1283 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.121; unit 1284 -->

【Зависимости】

<!-- Source EN PDF p.121; unit 1285 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1286 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.121; unit 1287 -->

【Пример】

<!-- Source EN PDF p.121; unit 1288 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.121; unit 1289 -->

#### 7.4.5  rk_aiq_uapi2_setMWBScene

<!-- Source EN PDF p.121; unit 1290 -->

【Описание】Установка сцены баланса белого.

<!-- Source EN PDF p.121; unit 1291 -->

【Синтаксис】

<!-- Source EN PDF p.121; unit 1292 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t scene);
```

<!-- Source EN PDF p.121; unit 1293 -->

【Параметры】

<!-- Source EN PDF p.121; unit 1294 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| scene | Сцена баланса белого | Вход |

<!-- Source EN PDF p.121; unit 1295 -->

【Возвращаемое значение】

<!-- Source EN PDF p.121; unit 1296 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.121; unit 1297 -->

【Зависимости】

<!-- Source EN PDF p.121; unit 1298 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1299 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.121; unit 1300 -->

【Пример】

<!-- Source EN PDF p.121; unit 1301 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.122; unit 1302 -->

#### 7.4.6  rk_aiq_uapi2_getMWBScene

<!-- Source EN PDF p.122; unit 1303 -->

【Описание】Получение сцены баланса белого.

<!-- Source EN PDF p.122; unit 1304 -->

【Синтаксис】

<!-- Source EN PDF p.122; unit 1305 -->

```text
 XCamReturn rk_aiq_uapi2_getMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t *scene);
```

<!-- Source EN PDF p.122; unit 1306 -->

【Параметры】

<!-- Source EN PDF p.122; unit 1307 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| scene | Сцена баланса белого | Выход |

<!-- Source EN PDF p.122; unit 1308 -->

【Возвращаемое значение】

<!-- Source EN PDF p.122; unit 1309 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.122; unit 1310 -->

【Зависимости】

<!-- Source EN PDF p.122; unit 1311 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.122; unit 1312 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.122; unit 1313 -->

【Пример】

<!-- Source EN PDF p.122; unit 1314 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.122; unit 1315 -->

#### 7.4.7  rk_aiq_uapi2_setMWBGain

<!-- Source EN PDF p.122; unit 1316 -->

【Описание】Установка коэффициентов ручного усиления WB.

<!-- Source EN PDF p.122; unit 1317 -->

【Синтаксис】

<!-- Source EN PDF p.122; unit 1318 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.122; unit 1319 -->

【Параметры】

<!-- Source EN PDF p.122; unit 1320 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| gain | Коэффициенты усиления WB | Вход |

<!-- Source EN PDF p.123; unit 1321 -->

【Возвращаемое значение】

<!-- Source EN PDF p.123; unit 1322 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.123; unit 1323 -->

【Зависимости】

<!-- Source EN PDF p.123; unit 1324 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1325 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.123; unit 1326 -->

【Пример】

<!-- Source EN PDF p.123; unit 1327 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.123; unit 1328 -->

#### 7.4.8  rk_aiq_uapi2_getWBGain

<!-- Source EN PDF p.123; unit 1329 -->

【Описание】Получение коэффициентов усиления WB для ручного и автоматического режимов.

<!-- Source EN PDF p.123; unit 1330 -->

【Синтаксис】

<!-- Source EN PDF p.123; unit 1331 -->

```text
 XCamReturn rk_aiq_uapi2_getWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.123; unit 1332 -->

【Параметры】

<!-- Source EN PDF p.123; unit 1333 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| gain | Коэффициенты усиления WB | Выход |

<!-- Source EN PDF p.123; unit 1334 -->

【Возвращаемое значение】

<!-- Source EN PDF p.123; unit 1335 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.123; unit 1336 -->

【Зависимости】

<!-- Source EN PDF p.123; unit 1337 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1338 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.123; unit 1339 -->

【Пример】

<!-- Source EN PDF p.123; unit 1340 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.124; unit 1341 -->

#### 7.4.9  rk_aiq_uapi2_setMWBCT

<!-- Source EN PDF p.124; unit 1342 -->

【Описание】Установка цветовой температуры ручного WB.

<!-- Source EN PDF p.124; unit 1343 -->

【Синтаксис】

<!-- Source EN PDF p.124; unit 1344 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int ct);
```

<!-- Source EN PDF p.124; unit 1345 -->

【Параметры】

<!-- Source EN PDF p.124; unit 1346 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| ct | Параметры цветовой температуры WB | Вход |

<!-- Source EN PDF p.124; unit 1347 -->

【Возвращаемое значение】

<!-- Source EN PDF p.124; unit 1348 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.124; unit 1349 -->

【Зависимости】

<!-- Source EN PDF p.124; unit 1350 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.124; unit 1351 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.124; unit 1352 -->

【Пример】

<!-- Source EN PDF p.124; unit 1353 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.124; unit 1354 -->

#### 7.4.10  rk_aiq_uapi2_getWBCT

<!-- Source EN PDF p.124; unit 1355 -->

【Описание】Получение цветовой температуры WB в автоматическом и ручном режимах.

<!-- Source EN PDF p.124; unit 1356 -->

【Синтаксис】

<!-- Source EN PDF p.124; unit 1357 -->

```text
 XCamReturn rk_aiq_uapi2_getWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int *ct);
```

<!-- Source EN PDF p.124; unit 1358 -->

【Параметры】

<!-- Source EN PDF p.124; unit 1359 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| ct | Цветовая температура WB | Выход |

<!-- Source EN PDF p.124; unit 1360 -->

【Возвращаемое значение】

<!-- Source EN PDF p.125; unit 1361 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.125; unit 1362 -->

【Зависимости】

<!-- Source EN PDF p.125; unit 1363 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1364 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.125; unit 1365 -->

【Пример】

<!-- Source EN PDF p.125; unit 1366 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.125; unit 1367 -->

#### 7.4.11  rk_aiq_uapi2_setAwbGainOffsetAttrib

<!-- Source EN PDF p.125; unit 1368 -->

【Описание】Установка смещения усиления AWB.

<!-- Source EN PDF p.125; unit 1369 -->

【Синтаксис】

<!-- Source EN PDF p.125; unit 1370 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.125; unit 1371 -->

【Параметры】

<!-- Source EN PDF p.125; unit 1372 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры смещения wbgain | Вход |

<!-- Source EN PDF p.125; unit 1373 -->

【Возвращаемое значение】

<!-- Source EN PDF p.125; unit 1374 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.125; unit 1375 -->

【Зависимости】

<!-- Source EN PDF p.125; unit 1376 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1377 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.125; unit 1378 -->

【Пример】

<!-- Source EN PDF p.125; unit 1379 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.126; unit 1380 -->

#### 7.4.12  rk_aiq_uapi2_getAwbGainOffsetAttrib

<!-- Source EN PDF p.126; unit 1381 -->

【Описание】Получение смещения усиления AWB.

<!-- Source EN PDF p.126; unit 1382 -->

【Синтаксис】

<!-- Source EN PDF p.126; unit 1383 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 CalibDbV2_Awb_gain_offset_cfg_t *attr);
```

<!-- Source EN PDF p.126; unit 1384 -->

【Параметры】

<!-- Source EN PDF p.126; unit 1385 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры смещения wbgain | Выход |

<!-- Source EN PDF p.126; unit 1386 -->

【Возвращаемое значение】

<!-- Source EN PDF p.126; unit 1387 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.126; unit 1388 -->

【Зависимости】

<!-- Source EN PDF p.126; unit 1389 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.126; unit 1390 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.126; unit 1391 -->

【Пример】

<!-- Source EN PDF p.126; unit 1392 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.126; unit 1393 -->

#### 7.4.13  rk_aiq_uapi2_setAwbGainAdjustAttrib

<!-- Source EN PDF p.126; unit 1394 -->

【Описание】Установка коррекции цветового тона AWB.

<!-- Source EN PDF p.126; unit 1395 -->

【Синтаксис】

<!-- Source EN PDF p.126; unit 1396 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.126; unit 1397 -->

【Параметры】

<!-- Source EN PDF p.126; unit 1398 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона WB | Вход |

<!-- Source EN PDF p.127; unit 1399 -->

【Возвращаемое значение】

<!-- Source EN PDF p.127; unit 1400 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.127; unit 1401 -->

【Зависимости】

<!-- Source EN PDF p.127; unit 1402 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1403 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.127; unit 1404 -->

【Пример】

<!-- Source EN PDF p.127; unit 1405 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.127; unit 1406 -->

#### 7.4.14  rk_aiq_uapi2_getAwbGainAdjustAttrib

<!-- Source EN PDF p.127; unit 1407 -->

【Описание】Получение параметров коррекции тона AWB.

<!-- Source EN PDF p.127; unit 1408 -->

【Синтаксис】

<!-- Source EN PDF p.127; unit 1409 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.127; unit 1410 -->

【Параметры】

<!-- Source EN PDF p.127; unit 1411 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона WB | Выход |

<!-- Source EN PDF p.127; unit 1412 -->

【Возвращаемое значение】

<!-- Source EN PDF p.127; unit 1413 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.127; unit 1414 -->

【Зависимости】

<!-- Source EN PDF p.127; unit 1415 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1416 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.127; unit 1417 -->

【Пример】

<!-- Source EN PDF p.127; unit 1418 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.128; unit 1419 -->

#### 7.4.15  rk_aiq_uapi2_setAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1420 -->

【Описание】Установка всех параметров API баланса белого.

<!-- Source EN PDF p.128; unit 1421 -->

【Синтаксис】

<!-- Source EN PDF p.128; unit 1422 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.128; unit 1423 -->

【Параметр】

<!-- Source EN PDF p.128; unit 1424 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Все параметры API баланса белого. | Вход |

<!-- Source EN PDF p.128; unit 1425 -->

【Возвращаемое значение】

<!-- Source EN PDF p.128; unit 1426 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок. |

<!-- Source EN PDF p.128; unit 1427 -->

【Зависимости】

<!-- Source EN PDF p.128; unit 1428 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.128; unit 1429 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.128; unit 1430 -->

【Пример】

<!-- Source EN PDF p.128; unit 1431 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.128; unit 1432 -->

#### 7.4.16  rk_aiq_uapi2_getAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1433 -->

【Описание】Получение всех параметров API баланса белого.

<!-- Source EN PDF p.128; unit 1434 -->

【Синтаксис】

<!-- Source EN PDF p.128; unit 1435 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.128; unit 1436 -->

【Параметр】

<!-- Source EN PDF p.128; unit 1437 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры смещения wbgain | Выход |

<!-- Source EN PDF p.129; unit 1438 -->

【Возвращаемое значение】

<!-- Source EN PDF p.129; unit 1439 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок. |

<!-- Source EN PDF p.129; unit 1440 -->

【Зависимости】

<!-- Source EN PDF p.129; unit 1441 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.129; unit 1442 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.129; unit 1443 -->

【Пример】

<!-- Source EN PDF p.129; unit 1444 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.129; unit 1445 -->

### 7.5 Типы данных функционального API

<!-- Source EN PDF p.129; unit 1446 -->

#### 7.5.1  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.129; unit 1447 -->

【Описание】Определение режима WB.

<!-- Source EN PDF p.129; unit 1448 -->

【Определение】

<!-- Source EN PDF p.129; unit 1449 -->

```text
 typedef enum rk_aiq_wb_op_mode_s {
     RK_AIQ_WB_MODE_INVALID        = 0,
     RK_AIQ_WB_MODE_MANUAL         = 1,
     RK_AIQ_WB_MODE_AUTO           = 2,
     RK_AIQ_WB_MODE_MAX
 } rk_aiq_wb_op_mode_t;
```

<!-- Source EN PDF p.129; unit 1450 -->

【Члены】

<!-- Source EN PDF p.129; unit 1451 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_WB_MODE_MANUAL | Ручной WB |
| RK_AIQ_WB_MODE_AUTO | Автоматический WB |

<!-- Source EN PDF p.129; unit 1452 -->

#### 7.5.2  rk_aiq_wb_mwb_mode_t

<!-- Source EN PDF p.129; unit 1453 -->

【Описание】Определение типа ручного режима WB.

<!-- Source EN PDF p.129; unit 1454 -->

【Определение】

<!-- Source EN PDF p.130; unit 1455 -->

```text
 typedef enum rk_aiq_wb_mwb_mode_e {
     RK_AIQ_MWB_MODE_INVAILD              = 0,
     RK_AIQ_MWB_MODE_CCT                  = 1,
     RK_AIQ_MWB_MODE_WBGAIN               = 2,
     RK_AIQ_MWB_MODE_SCENE                = 3,
 } rk_aiq_wb_mwb_mode_t;
```

<!-- Source EN PDF p.130; unit 1456 -->

【Члены】

<!-- Source EN PDF p.130; unit 1457 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_MWB_MODE_CCT | Цветовая температура |
| RK_AIQ_MWB_MODE_WBGAIN | Коэффициент усиления |
| RK_AIQ_MWB_MODE_SCENE | Сцена |

<!-- Source EN PDF p.130; unit 1458 -->

#### 7.5.3  rk_aiq_wb_gain_t

<!-- Source EN PDF p.130; unit 1459 -->

【Описание】Определение параметров усиления WB.

<!-- Source EN PDF p.130; unit 1460 -->

【Определение】

<!-- Source EN PDF p.130; unit 1461 -->

```text
 typedef struct rk_aiq_wb_gain_s {
     float rgain;
     float grgain;
     float gbgain;
     float bgain;
 } rk_aiq_wb_gain_t;
```

<!-- Source EN PDF p.130; unit 1462 -->

【Члены】

<!-- Source EN PDF p.130; unit 1463 -->

| Имя члена | Описание |
|---|---|
| rgain | Усиление R |
| grgain | Усиление G |
| gbgain | Усиление GB |
| bgain | Усиление B |

<!-- Source EN PDF p.130; unit 1464 -->

#### 7.5.4  rk_aiq_wb_scene_t

<!-- Source EN PDF p.130; unit 1465 -->

【Описание】Определение параметров усиления WB.

<!-- Source EN PDF p.130; unit 1466 -->

【Определение】

<!-- Source EN PDF p.131; unit 1467 -->

```text
 typedef enum rk_aiq_wb_scene_e {
     RK_AIQ_WBCT_INCANDESCENT = 0,
     RK_AIQ_WBCT_FLUORESCENT,
     RK_AIQ_WBCT_WARM_FLUORESCENT,
     RK_AIQ_WBCT_DAYLIGHT,
     RK_AIQ_WBCT_CLOUDY_DAYLIGHT,
     RK_AIQ_WBCT_TWILIGHT,
     RK_AIQ_WBCT_SHADE
 } rk_aiq_wb_scene_t;
```

<!-- Source EN PDF p.131; unit 1468 -->

【Члены】

<!-- Source EN PDF p.131; unit 1469 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_WBCT_INCANDESCENT | Лампа накаливания |
| RK_AIQ_WBCT_FLUORESCENT | Люминесцентная лампа |
| RK_AIQ_WBCT_WARM_FLUORESCENT | Тёплая люминесцентная лампа |
| RK_AIQ_WBCT_DAYLIGHT | Дневной свет |
| RK_AIQ_WBCT_CLOUDY_DAYLIGHT | Облачно |
| RK_AIQ_WBCT_TWILIGHT | Сумерки |
| RK_AIQ_WBCT_SHADE | Тень |

<!-- Source EN PDF p.131; unit 1470 -->

#### 7.5.5  rk_aiq_wb_cct_t

<!-- Source EN PDF p.131; unit 1471 -->

【Описание】Определение параметров усиления WB.

<!-- Source EN PDF p.131; unit 1472 -->

【Определение】

<!-- Source EN PDF p.131; unit 1473 -->

```text
 typedef struct rk_aiq_wb_cct_s {
     float CCT;
     float CCRI;
 } rk_aiq_wb_cct_t;
```

<!-- Source EN PDF p.131; unit 1474 -->

【Члены】

<!-- Source EN PDF p.131; unit 1475 -->

| Имя члена | Описание |
|---|---|
| CCT | Коррелированная цветовая температура |
| CCRI | Коррелированный индекс цветопередачи |

<!-- Source EN PDF p.132; unit 1476 -->

#### 7.5.6  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.132; unit 1477 -->

【Описание】Определение атрибутов ручного WB.

<!-- Source EN PDF p.132; unit 1478 -->

【Определение】

<!-- Source EN PDF p.132; unit 1479 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.132; unit 1480 -->

【Члены】

<!-- Source EN PDF p.132; unit 1481 -->

| Имя члена | Описание |
|---|---|
| mode | Выбор режима |

<!-- Source EN PDF p.132; unit 1482 -->

#### 7.5.7  rk_aiq_uapiV2_wb_awb_wbGainOffset_t

<!-- Source EN PDF p.132; unit 1483 -->

【Описание】Определение смещения усиления AWB.

<!-- Source EN PDF p.132; unit 1484 -->

【Определение】

<!-- Source EN PDF p.132; unit 1485 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainOffset_s{
   rk_aiq_uapi_sync_t sync;
   CalibDbV2_Awb_gain_offset_cfg_t gainOffset;
 }rk_aiq_uapiV2_wb_awb_wbGainOffset_t;
```

<!-- Source EN PDF p.132; unit 1486 -->

【Члены】

<!-- Source EN PDF p.132; unit 1487 -->

| Имя поля | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| gainOffset | См. далее описание CalibDbV2_Awb_gain_offset_cfg_t. |

<!-- Source EN PDF p.132; unit 1488 -->

#### 7.5.8  CalibDbV2_Awb_gain_offset_cfg_t

<!-- Source EN PDF p.132; unit 1489 -->

【Описание】Определение смещения усиления AWB.

<!-- Source EN PDF p.132; unit 1490 -->

【Определение】

<!-- Source EN PDF p.133; unit 1491 -->

```text
 typedef struct CalibDbV2_Awb_gain_offset_cfg_s{
   bool enable;
   float offset[4];
 }CalibDbV2_Awb_gain_offset_cfg_t;
```

<!-- Source EN PDF p.133; unit 1492 -->

【Члены】

<!-- Source EN PDF p.133; unit 1493 -->

| Имя поля | Описание |
|---|---|
| enable | Включение: 0 — выключено, 1 — включено. |
| offset | offset суммируется с wbgain; диапазоны offset каналов R GR GB B выбирают так, чтобы сумма была в [0,8] (ISP21 — платформа, указанная исходником). |

<!-- Source EN PDF p.133; unit 1494 -->

#### 7.5.9  rk_aiq_uapiV2_wb_awb_wbGainAdjust_t

<!-- Source EN PDF p.133; unit 1495 -->

【Описание】Определение коррекции цветового тона AWB.

<!-- Source EN PDF p.133; unit 1496 -->

【Определение】

<!-- Source EN PDF p.133; unit 1497 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_s {
   float lumaValue;
   int ct_grid_num;
   int cri_grid_num;
   float ct_in_range[2];//min,max, equal distance sapmle
   float cri_in_range[2];//min,max
   float *ct_lut_out;//size is ct_grid_num*cri_grid_num
   float *cri_lut_out;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t;
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjust_s {
   rk_aiq_uapi_sync_t sync;
   bool enable;
   rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
   int lutAll_len;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

<!-- Source EN PDF p.133; unit 1498 -->

【Члены】

<!-- Source EN PDF p.134; unit 1499 -->

| Имя поля | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| enable | Включение коррекции тона: 0 — выключено, 1 — включено. |
| lutAll | Для разных яркостей среды можно задать различные таблицы выходной цветовой температуры. |
| lutAll_len | Количество таблиц цветовой температуры. |
| lutAll.ct_grid_num | Число точек выборки входной цветовой температуры не ограничено. |
| lutAll.ct_in_range | Диапазон входной цветовой температуры не ограничен. |
| lutAll.cri_grid_num | Число точек выборки индекса цветопередачи входной таблицы не ограничено. |
| lutAll.cri_in_range | Диапазон индекса цветопередачи входной таблицы не ограничен. |
| lutAll.ct_out | На интерфейсе инструмента ct возрастает слева направо, от холодного к тёплому тону; диапазон CT 0-255000. |
| lutAll.cri_out | На интерфейсе cri возрастает снизу вверх, от отрицательных значений к положительным, от пурпурного к зелёному; диапазон CRI не ограничен. |

<!-- Source EN PDF p.134; unit 1500 -->

Подробнее см. раздел цветовой настройки WBGain в Rockchip_Color_Optimization_Guide.

<!-- Source EN PDF p.134; unit 1501 -->

#### 7.5.10  rk_aiq_uapiV2_wbV30_awb_attrib_t

<!-- Source EN PDF p.134; unit 1502 -->

【Описание】Определение параметров API AWB.

<!-- Source EN PDF p.134; unit 1503 -->

【Определение】

<!-- Source EN PDF p.134; unit 1504 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_awb_attrib_s {
     rk_aiq_uapiV2_wb_awb_wbGainAdjust_t wbGainAdjust;
     CalibDbV2_Awb_gain_offset_cfg_t wbGainOffset;
 } rk_aiq_uapiV2_wbV30_awb_attrib_t;
```

<!-- Source EN PDF p.134; unit 1505 -->

【Члены】

<!-- Source EN PDF p.135; unit 1506 -->

| Имя поля | Описание |
|---|---|
| wbGainAdjust | См. CalibDbV2_Awb_gain_offset_cfg_t. |
| wbGainOffset | См. rk_aiq_uapiV2_wb_awb_wbGainAdjust_t. |
| multiWindow | См. rk_aiq_uapiV2_wbV32_awb_mulWindow_t. |

<!-- Source EN PDF p.135; unit 1507 -->

#### 7.5.11  rk_aiq_uapiV2_wbV32_attrib_t

<!-- Source EN PDF p.135; unit 1508 -->

【Описание】Определение всех параметров API WB.

<!-- Source EN PDF p.135; unit 1509 -->

【Определение】

<!-- Source EN PDF p.135; unit 1510 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_wb_op_mode_t mode;
     rk_aiq_wb_mwb_attrib_t stManual;
     rk_aiq_uapiV2_wbV30_awb_attrib_t stAuto;
 } rk_aiq_uapiV2_wbV30_attrib_t;
```

<!-- Source EN PDF p.135; unit 1511 -->

【Члены】

<!-- Source EN PDF p.135; unit 1512 -->

| Имя поля | Описание |
|---|---|
| sync | Описание rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| byPass | Значение 0 или 1: 0 — выполнять WB с усилением, задаваемым параметрами конца таблицы; 1 — не выполнять коррекцию WB. |
| mode | Автоматическое/ручное управление WB: см. rk_aiq_wb_op_mode_t. |
| stManual | Ручные параметры WB: см. rk_aiq_wb_mwb_attrib_t. |
| stAuto | Параметры AWB: см. rk_aiq_uapiV2_wbV21_awb_attrib_t. |

<!-- Source EN PDF p.135; unit 1513 -->

### 7.6 Справочник модульного API

<!-- Source EN PDF p.135; unit 1514 -->

#### 7.6.1  rk_aiq_user_api2_awbV30_SetAllAttrib

<!-- Source EN PDF p.135; unit 1515 -->

【Описание】Установка всех параметров API баланса белого.

<!-- Source EN PDF p.135; unit 1516 -->

【Синтаксис】

<!-- Source EN PDF p.136; unit 1517 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_SetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.136; unit 1518 -->

【Параметры】

<!-- Source EN PDF p.136; unit 1519 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Все параметры API WB | Выход |

<!-- Source EN PDF p.136; unit 1520 -->

【Возвращаемое значение】

<!-- Source EN PDF p.136; unit 1521 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.136; unit 1522 -->

【Зависимости】

<!-- Source EN PDF p.136; unit 1523 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.136; unit 1524 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.136; unit 1525 -->

【Пример】

<!-- Source EN PDF p.136; unit 1526 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.136; unit 1527 -->

#### 7.6.2  rk_aiq_user_api2_awbV30_GetAllAttrib

<!-- Source EN PDF p.136; unit 1528 -->

【Описание】Получение всех параметров API WB.

<!-- Source EN PDF p.136; unit 1529 -->

【Синтаксис】

<!-- Source EN PDF p.136; unit 1530 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_GetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.136; unit 1531 -->

【Параметры】

<!-- Source EN PDF p.136; unit 1532 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Все параметры API WB | Выход |

<!-- Source EN PDF p.136; unit 1533 -->

【Возвращаемое значение】

<!-- Source EN PDF p.137; unit 1534 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.137; unit 1535 -->

【Зависимости】

<!-- Source EN PDF p.137; unit 1536 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1537 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.137; unit 1538 -->

【Пример】

<!-- Source EN PDF p.137; unit 1539 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.137; unit 1540 -->

#### 7.6.3  rk_aiq_user_api2_awb_GetCCT

<!-- Source EN PDF p.137; unit 1541 -->

【Описание】Получение цветовой температуры WB в автоматическом и ручном режимах.

<!-- Source EN PDF p.137; unit 1542 -->

【Синтаксис】

<!-- Source EN PDF p.137; unit 1543 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetCCT(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_wb_cct_t
 *cct);
```

<!-- Source EN PDF p.137; unit 1544 -->

【Параметры】

<!-- Source EN PDF p.137; unit 1545 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| cct | Параметры цветовой температуры WB | Выход |

<!-- Source EN PDF p.137; unit 1546 -->

【Возвращаемое значение】

<!-- Source EN PDF p.137; unit 1547 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.137; unit 1548 -->

【Зависимости】

<!-- Source EN PDF p.137; unit 1549 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1550 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.137; unit 1551 -->

【Пример】

<!-- Source EN PDF p.137; unit 1552 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.138; unit 1553 -->

#### 7.6.4  rk_aiq_user_api2_awb_QueryWBInfo

<!-- Source EN PDF p.138; unit 1554 -->

【Описание】Получение усиления и цветовой температуры WB.

<!-- Source EN PDF p.138; unit 1555 -->

【Синтаксис】

<!-- Source EN PDF p.138; unit 1556 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_QueryWBInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_querry_info_t *wb_querry_info);
```

<!-- Source EN PDF p.138; unit 1557 -->

【Параметры】

<!-- Source EN PDF p.138; unit 1558 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| wb_querry_info | Параметры состояния цвета | Выход |

<!-- Source EN PDF p.138; unit 1559 -->

【Возвращаемое значение】

<!-- Source EN PDF p.138; unit 1560 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.138; unit 1561 -->

【Зависимости】

<!-- Source EN PDF p.138; unit 1562 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.138; unit 1563 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.138; unit 1564 -->

【Пример】

<!-- Source EN PDF p.138; unit 1565 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.138; unit 1566 -->

#### 7.6.5  rk_aiq_user_api2_awb_Lock

<!-- Source EN PDF p.138; unit 1567 -->

【Описание】Блокировка текущих параметров WB.

<!-- Source EN PDF p.138; unit 1568 -->

【Синтаксис】

<!-- Source EN PDF p.138; unit 1569 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.138; unit 1570 -->

【Параметры】

<!-- Source EN PDF p.138; unit 1571 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.139; unit 1572 -->

【Возвращаемое значение】

<!-- Source EN PDF p.139; unit 1573 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.139; unit 1574 -->

【Зависимости】

<!-- Source EN PDF p.139; unit 1575 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1576 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.139; unit 1577 -->

【Пример】

<!-- Source EN PDF p.139; unit 1578 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.139; unit 1579 -->

#### 7.6.6  rk_aiq_user_api2_awb_Unlock

<!-- Source EN PDF p.139; unit 1580 -->

【Описание】Снятие блокировки параметров WB.

<!-- Source EN PDF p.139; unit 1581 -->

【Синтаксис】

<!-- Source EN PDF p.139; unit 1582 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.139; unit 1583 -->

【Параметры】

<!-- Source EN PDF p.139; unit 1584 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.139; unit 1585 -->

【Возвращаемое значение】

<!-- Source EN PDF p.139; unit 1586 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.139; unit 1587 -->

【Зависимости】

<!-- Source EN PDF p.139; unit 1588 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1589 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.139; unit 1590 -->

【Пример】

<!-- Source EN PDF p.139; unit 1591 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.140; unit 1592 -->

#### 7.6.7  rk_aiq_user_api2_awb_SetWpModeAttrib

<!-- Source EN PDF p.140; unit 1593 -->

【Описание】Установка режима баланса белого.

<!-- Source EN PDF p.140; unit 1594 -->

【Синтаксис】

<!-- Source EN PDF p.140; unit 1595 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t attr);
```

<!-- Source EN PDF p.140; unit 1596 -->

【Параметры】

<!-- Source EN PDF p.140; unit 1597 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Режим баланса белого | Выход |

<!-- Source EN PDF p.140; unit 1598 -->

【Возвращаемое значение】

<!-- Source EN PDF p.140; unit 1599 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.140; unit 1600 -->

【Зависимости】

<!-- Source EN PDF p.140; unit 1601 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.140; unit 1602 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.140; unit 1603 -->

【Пример】

<!-- Source EN PDF p.140; unit 1604 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.140; unit 1605 -->

#### 7.6.8  rk_aiq_user_api2_awb_GetWpModeAttrib

<!-- Source EN PDF p.140; unit 1606 -->

【Описание】Получение режима баланса белого.

<!-- Source EN PDF p.140; unit 1607 -->

【Синтаксис】

<!-- Source EN PDF p.140; unit 1608 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t *attr);
```

<!-- Source EN PDF p.140; unit 1609 -->

【Параметры】

<!-- Source EN PDF p.141; unit 1610 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Режим баланса белого | Выход |

<!-- Source EN PDF p.141; unit 1611 -->

【Возвращаемое значение】

<!-- Source EN PDF p.141; unit 1612 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.141; unit 1613 -->

【Зависимости】

<!-- Source EN PDF p.141; unit 1614 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.141; unit 1615 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.141; unit 1616 -->

【Пример】

<!-- Source EN PDF p.141; unit 1617 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.141; unit 1618 -->

#### 7.6.9  rk_aiq_user_api2_awb_SetMwbAttrib

<!-- Source EN PDF p.141; unit 1619 -->

【Описание】Установка ручных параметров WB.

<!-- Source EN PDF p.141; unit 1620 -->

【Синтаксис】

<!-- Source EN PDF p.141; unit 1621 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.141; unit 1622 -->

【Параметры】

<!-- Source EN PDF p.141; unit 1623 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры ручного WB | Вход |

<!-- Source EN PDF p.141; unit 1624 -->

【Возвращаемое значение】

<!-- Source EN PDF p.141; unit 1625 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.141; unit 1626 -->

【Зависимости】

<!-- Source EN PDF p.141; unit 1627 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1628 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.142; unit 1629 -->

【Пример】

<!-- Source EN PDF p.142; unit 1630 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.142; unit 1631 -->

#### 7.6.10  rk_aiq_user_api2_awb_GetMwbAttrib

<!-- Source EN PDF p.142; unit 1632 -->

【Описание】Установка ручных параметров WB.

<!-- Source EN PDF p.142; unit 1633 -->

【Синтаксис】

<!-- Source EN PDF p.142; unit 1634 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.142; unit 1635 -->

【Параметры】

<!-- Source EN PDF p.142; unit 1636 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры ручного WB | Вход |

<!-- Source EN PDF p.142; unit 1637 -->

【Возвращаемое значение】

<!-- Source EN PDF p.142; unit 1638 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.142; unit 1639 -->

【Зависимости】

<!-- Source EN PDF p.142; unit 1640 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1641 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.142; unit 1642 -->

【Пример】

<!-- Source EN PDF p.142; unit 1643 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.142; unit 1644 -->

#### 7.6.11  rk_aiq_user_api2_awb_SetWbGainAdjustAttrib

<!-- Source EN PDF p.142; unit 1645 -->

【Описание】Установка коррекции цветового тона AWB.

<!-- Source EN PDF p.142; unit 1646 -->

【Синтаксис】

<!-- Source EN PDF p.142; unit 1647 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.143; unit 1648 -->

【Параметры】

<!-- Source EN PDF p.143; unit 1649 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона | Вход |

<!-- Source EN PDF p.143; unit 1650 -->

【Возвращаемое значение】

<!-- Source EN PDF p.143; unit 1651 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.143; unit 1652 -->

【Зависимости】

<!-- Source EN PDF p.143; unit 1653 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.143; unit 1654 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.143; unit 1655 -->

【Пример】

<!-- Source EN PDF p.143; unit 1656 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.143; unit 1657 -->

#### 7.6.12  rk_aiq_user_api2_awb_GetWbGainAdjustAttrib

<!-- Source EN PDF p.143; unit 1658 -->

【Описание】Получение параметров коррекции тона AWB.

<!-- Source EN PDF p.143; unit 1659 -->

【Синтаксис】

<!-- Source EN PDF p.143; unit 1660 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.143; unit 1661 -->

【Параметры】

<!-- Source EN PDF p.143; unit 1662 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона | Вход |

<!-- Source EN PDF p.143; unit 1663 -->

【Возвращаемое значение】

<!-- Source EN PDF p.143; unit 1664 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.143; unit 1665 -->

【Зависимости】

<!-- Source EN PDF p.144; unit 1666 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1667 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.144; unit 1668 -->

【Пример】

<!-- Source EN PDF p.144; unit 1669 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.144; unit 1670 -->

#### 7.6.13  rk_aiq_user_api2_awb_SetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1671 -->

【Описание】Установка смещения усиления AWB.

<!-- Source EN PDF p.144; unit 1672 -->

【Синтаксис】

<!-- Source EN PDF p.144; unit 1673 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.144; unit 1674 -->

【Параметры】

<!-- Source EN PDF p.144; unit 1675 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона | Вход |

<!-- Source EN PDF p.144; unit 1676 -->

【Возвращаемое значение】

<!-- Source EN PDF p.144; unit 1677 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.144; unit 1678 -->

【Зависимости】

<!-- Source EN PDF p.144; unit 1679 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1680 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.144; unit 1681 -->

【Пример】

<!-- Source EN PDF p.144; unit 1682 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.144; unit 1683 -->

#### 7.6.14  rk_aiq_user_api2_awb_GetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1684 -->

【Описание】Получение смещения усиления AWB.

<!-- Source EN PDF p.144; unit 1685 -->

【Синтаксис】

<!-- Source EN PDF p.145; unit 1686 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t *attr);
```

<!-- Source EN PDF p.145; unit 1687 -->

【Параметры】

<!-- Source EN PDF p.145; unit 1688 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры коррекции тона | Вход |

<!-- Source EN PDF p.145; unit 1689 -->

【Возвращаемое значение】

<!-- Source EN PDF p.145; unit 1690 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.145; unit 1691 -->

【Зависимости】

<!-- Source EN PDF p.145; unit 1692 -->

Заголовочный файл: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.145; unit 1693 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.145; unit 1694 -->

【Пример】

<!-- Source EN PDF p.145; unit 1695 -->

См. sample_awb_module.cpp.

<!-- Source EN PDF p.145; unit 1696 -->

### 7.7 Типы данных модульного API

<!-- Source EN PDF p.145; unit 1697 -->

#### 7.7.1  rk_aiq_wb_querry_info_t

<!-- Source EN PDF p.145; unit 1698 -->

【Описание】Определение запрашиваемых сведений WB.

<!-- Source EN PDF p.145; unit 1699 -->

【Определение】

<!-- Source EN PDF p.145; unit 1700 -->

```text
 typedef struct rk_aiq_wb_querry_info_s {
     rk_aiq_wb_gain_t gain;
     rk_aiq_wb_cct_t cctGloabl;
     bool awbConverged;
     uint32_t LVValue;
 } rk_aiq_wb_querry_info_t;
```

<!-- Source EN PDF p.145; unit 1701 -->

【Члены】

<!-- Source EN PDF p.146; unit 1702 -->

| Имя члена | Описание |
|---|---|
| gain | Gain |
| cctGloabl | Параметры глобальной цветовой температуры |
| LVValue | Соответствующая яркость среды |

<!-- Source EN PDF p.146; unit 1703 -->

#### 7.7.2  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.146; unit 1704 -->

【Описание】Определение режима WB.

<!-- Source EN PDF p.146; unit 1705 -->

【Определение】

<!-- Source EN PDF p.146; unit 1706 -->

```text
 typedef struct rk_aiq_uapiV2_wb_opMode_s {
   rk_aiq_uapi_sync_t sync;
   rk_aiq_wb_op_mode_t mode;
 } rk_aiq_uapiV2_wb_opMode_t;
```

<!-- Source EN PDF p.146; unit 1707 -->

【Члены】

<!-- Source EN PDF p.146; unit 1708 -->

| Имя члена | Описание |
|---|---|
| sync | Описание rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| mode | См. описание rk_aiq_wb_op_mode_t. |

<!-- Source EN PDF p.146; unit 1709 -->

#### 7.7.3  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.146; unit 1710 -->

【Описание】Определение атрибутов ручного WB.

<!-- Source EN PDF p.146; unit 1711 -->

【Определение】

<!-- Source EN PDF p.146; unit 1712 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
      rk_aiq_uapi_sync_t sync;
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.146; unit 1713 -->

【Члены】

<!-- Source EN PDF p.147; unit 1714 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| mode | Выбор режима |
| para | Конфигурация параметров режима |

<!-- Source EN PDF p.147; unit 1715 -->

## 8.   AF

<!-- Source EN PDF p.147; unit 1716 -->

### 8.1 Обзор

<!-- Source EN PDF p.147; unit 1717 -->

Модуль AF регулирует объектив камеры для резкого изображения объекта.

<!-- Source EN PDF p.147; unit 1718 -->

### 8.2 Описание функций

<!-- Source EN PDF p.147; unit 1719 -->

AF состоит из статистики и алгоритма управления; ниже показана схема модуля статистики AF.

<!-- Source EN PDF p.147; unit 1720 -->

![Технический рисунок английского оригинала — PDF p.147](/docs/rockchip-isp30-development/assets/en-p147-X1161.png)

<!-- Source EN PDF p.147; unit 1721 -->

ch0/ch1/ch2 соответствуют кадрам S/M/L HDR; debayer — объединённый кадр HDR.

<!-- Source EN PDF p.147; unit 1722 -->

windowA выводит главным образом FV V1/V2/H1/H2 размером 15\*15, яркость и число ярких пикселей.

<!-- Source EN PDF p.147; unit 1723 -->

windowB выводит главным образом одно значение FV, яркость и число ярких пикселей.

<!-- Source EN PDF p.148; unit 1724 -->

### 8.3 Разработка пользовательских алгоритмов AF

<!-- Source EN PDF p.148; unit 1725 -->

![Технический рисунок английского оригинала — PDF p.148](/docs/rockchip-isp30-development/assets/en-p148-X1167.png)

<!-- Source EN PDF p.148; unit 1726 -->

Расположение примера: sdk: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.148; unit 1727 -->

### 8.4 Справочник функционального API

<!-- Source EN PDF p.148; unit 1728 -->

#### 8.4.1  rk_aiq_uapi2_setFocusMode

<!-- Source EN PDF p.148; unit 1729 -->

【Описание】Настройка режима фокусировки.

<!-- Source EN PDF p.148; unit 1730 -->

【Синтаксис】

<!-- Source EN PDF p.148; unit 1731 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.148; unit 1732 -->

【Параметры】

<!-- Source EN PDF p.148; unit 1733 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим фокусировки | Вход |

<!-- Source EN PDF p.148; unit 1734 -->

【Возвращаемое значение】

<!-- Source EN PDF p.148; unit 1735 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.148; unit 1736 -->

【Зависимости】

<!-- Source EN PDF p.148; unit 1737 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.148; unit 1738 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.149; unit 1739 -->

#### 8.4.2  rk_aiq_uapi2_getFocusMode

<!-- Source EN PDF p.149; unit 1740 -->

【Описание】Получение текущего режима фокусировки.

<!-- Source EN PDF p.149; unit 1741 -->

【Синтаксис】

<!-- Source EN PDF p.149; unit 1742 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.149; unit 1743 -->

【Параметры】

<!-- Source EN PDF p.149; unit 1744 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| mode | Режим фокусировки | Выход |

<!-- Source EN PDF p.149; unit 1745 -->

【Возвращаемое значение】

<!-- Source EN PDF p.149; unit 1746 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.149; unit 1747 -->

【Зависимости】

<!-- Source EN PDF p.149; unit 1748 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.149; unit 1749 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.149; unit 1750 -->

#### 8.4.3  rk_aiq_uapi2_setFocusWin

<!-- Source EN PDF p.149; unit 1751 -->

【Описание】Установка окна автофокусировки.

<!-- Source EN PDF p.149; unit 1752 -->

【Синтаксис】

<!-- Source EN PDF p.149; unit 1753 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.149; unit 1754 -->

【Параметры】

<!-- Source EN PDF p.149; unit 1755 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| rect | Окно фокусировки, диапазон определяется входным размером sensor. | Вход |

<!-- Source EN PDF p.149; unit 1756 -->

【Возвращаемое значение】

<!-- Source EN PDF p.150; unit 1757 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.150; unit 1758 -->

【Зависимости】

<!-- Source EN PDF p.150; unit 1759 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1760 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.150; unit 1761 -->

#### 8.4.4  rk_aiq_uapi2_getFocusWin

<!-- Source EN PDF p.150; unit 1762 -->

【Описание】Установка окна автофокусировки.

<!-- Source EN PDF p.150; unit 1763 -->

【Синтаксис】

<!-- Source EN PDF p.150; unit 1764 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.150; unit 1765 -->

【Параметры】

<!-- Source EN PDF p.150; unit 1766 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| rect | Окно фокусировки | Выход |

<!-- Source EN PDF p.150; unit 1767 -->

【Возвращаемое значение】

<!-- Source EN PDF p.150; unit 1768 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.150; unit 1769 -->

【Зависимости】

<!-- Source EN PDF p.150; unit 1770 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1771 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.150; unit 1772 -->

#### 8.4.5  rk_aiq_uapi2_lockFocus

<!-- Source EN PDF p.150; unit 1773 -->

【Описание】Блокировка автофокуса и приостановка фокусировки.

<!-- Source EN PDF p.150; unit 1774 -->

【Синтаксис】

<!-- Source EN PDF p.150; unit 1775 -->

```text
 XCamReturn rk_aiq_uapi2_lockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.150; unit 1776 -->

【Параметры】

<!-- Source EN PDF p.151; unit 1777 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.151; unit 1778 -->

【Возвращаемое значение】

<!-- Source EN PDF p.151; unit 1779 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.151; unit 1780 -->

【Зависимости】

<!-- Source EN PDF p.151; unit 1781 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1782 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.151; unit 1783 -->

#### 8.4.6  rk_aiq_uapi2_unlockFocus

<!-- Source EN PDF p.151; unit 1784 -->

【Описание】Разблокировка автофокуса и продолжение фокусировки.

<!-- Source EN PDF p.151; unit 1785 -->

【Синтаксис】

<!-- Source EN PDF p.151; unit 1786 -->

```text
 XCamReturn rk_aiq_uapi2_unlockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.151; unit 1787 -->

【Параметры】

<!-- Source EN PDF p.151; unit 1788 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.151; unit 1789 -->

【Возвращаемое значение】

<!-- Source EN PDF p.151; unit 1790 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.151; unit 1791 -->

【Зависимости】

<!-- Source EN PDF p.151; unit 1792 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1793 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.151; unit 1794 -->

#### 8.4.7  rk_aiq_uapi2_oneshotFocus

<!-- Source EN PDF p.151; unit 1795 -->

【Описание】Однократная фокусировка без продолжения после завершения.

<!-- Source EN PDF p.151; unit 1796 -->

【Синтаксис】

<!-- Source EN PDF p.152; unit 1797 -->

```text
 XCamReturn rk_aiq_uapi2_oneshotFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1798 -->

【Параметры】

<!-- Source EN PDF p.152; unit 1799 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.152; unit 1800 -->

【Возвращаемое значение】

<!-- Source EN PDF p.152; unit 1801 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.152; unit 1802 -->

【Зависимости】

<!-- Source EN PDF p.152; unit 1803 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1804 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.152; unit 1805 -->

#### 8.4.8  rk_aiq_uapi2_manualTrigerFocus

<!-- Source EN PDF p.152; unit 1806 -->

【Описание】Ручной запуск фокусировки с дальнейшим контролем резкости и повторной фокусировкой при размытии.

<!-- Source EN PDF p.152; unit 1807 -->

【Синтаксис】

<!-- Source EN PDF p.152; unit 1808 -->

```text
 XCamReturn rk_aiq_uapi2_manualTrigerFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1809 -->

【Параметры】

<!-- Source EN PDF p.152; unit 1810 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.152; unit 1811 -->

【Возвращаемое значение】

<!-- Source EN PDF p.152; unit 1812 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.152; unit 1813 -->

【Зависимости】

<!-- Source EN PDF p.152; unit 1814 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1815 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.153; unit 1816 -->

#### 8.4.9  rk_aiq_uapi2_trackingFocus

<!-- Source EN PDF p.153; unit 1817 -->

【Описание】Непрерывный контроль резкости и повторная фокусировка при размытии; обычно используется после rk_aiq_uapi2_oneshotFocus.

<!-- Source EN PDF p.153; unit 1818 -->

【Синтаксис】

<!-- Source EN PDF p.153; unit 1819 -->

```text
 XCamReturn rk_aiq_uapi2_trackingFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.153; unit 1820 -->

【Параметры】

<!-- Source EN PDF p.153; unit 1821 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.153; unit 1822 -->

【Возвращаемое значение】

<!-- Source EN PDF p.153; unit 1823 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.153; unit 1824 -->

【Зависимости】

<!-- Source EN PDF p.153; unit 1825 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.153; unit 1826 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.153; unit 1827 -->

#### 8.4.10  rk_aiq_uapi2_getSearchResult

<!-- Source EN PDF p.153; unit 1828 -->

【Описание】Получение результата фокусировки.

<!-- Source EN PDF p.153; unit 1829 -->

【Синтаксис】

<!-- Source EN PDF p.153; unit 1830 -->

```text
 XCamReturn rk_aiq_uapi2_getSearchResult(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_result_t* result);
```

<!-- Source EN PDF p.153; unit 1831 -->

【Параметры】

<!-- Source EN PDF p.153; unit 1832 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| result | Результат фокусировки: см. rk_aiq_af_result_t. | Выход |

<!-- Source EN PDF p.153; unit 1833 -->

【Возвращаемое значение】

<!-- Source EN PDF p.154; unit 1834 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.154; unit 1835 -->

【Зависимости】

<!-- Source EN PDF p.154; unit 1836 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1837 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.154; unit 1838 -->

#### 8.4.11  rk_aiq_uapi2_getZoomRange

<!-- Source EN PDF p.154; unit 1839 -->

【Описание】Получение диапазона зума, ограничивающего код положения на входе rk_aiq_uapi_setOpZoomPosition.

<!-- Source EN PDF p.154; unit 1840 -->

【Синтаксис】

<!-- Source EN PDF p.154; unit 1841 -->

```text
 XCamReturn rk_aiq_uapi2_getZoomRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_zoomrange* range);
```

<!-- Source EN PDF p.154; unit 1842 -->

【Параметры】

<!-- Source EN PDF p.154; unit 1843 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| range | Диапазон перемещения зума, см. rk_aiq_af_zoomrange. | Выход |

<!-- Source EN PDF p.154; unit 1844 -->

【Возвращаемое значение】

<!-- Source EN PDF p.154; unit 1845 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.154; unit 1846 -->

【Зависимости】

<!-- Source EN PDF p.154; unit 1847 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1848 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.154; unit 1849 -->

#### 8.4.12  rk_aiq_uapi2_setOpZoomPosition

<!-- Source EN PDF p.154; unit 1850 -->

【Описание】Установка и изменение положения зума.

<!-- Source EN PDF p.154; unit 1851 -->

【Синтаксис】

<!-- Source EN PDF p.154; unit 1852 -->

```text
 XCamReturn rk_aiq_uapi2_setOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int pos);
```

<!-- Source EN PDF p.154; unit 1853 -->

【Параметры】

<!-- Source EN PDF p.155; unit 1854 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pos | Положение зума, диапазон определяется rk_aiq_uapi2_getZoomRange. | Вход |

<!-- Source EN PDF p.155; unit 1855 -->

【Возвращаемое значение】

<!-- Source EN PDF p.155; unit 1856 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.155; unit 1857 -->

【Зависимости】

<!-- Source EN PDF p.155; unit 1858 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1859 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.155; unit 1860 -->

#### 8.4.13  rk_aiq_uapi2_getOpZoomPosition

<!-- Source EN PDF p.155; unit 1861 -->

【Описание】Получение положения зума.

<!-- Source EN PDF p.155; unit 1862 -->

【Синтаксис】

<!-- Source EN PDF p.155; unit 1863 -->

```text
 XCamReturn rk_aiq_uapi2_getOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int *pos);
```

<!-- Source EN PDF p.155; unit 1864 -->

【Параметры】

<!-- Source EN PDF p.155; unit 1865 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pos | Положение зума | Выход |

<!-- Source EN PDF p.155; unit 1866 -->

【Возвращаемое значение】

<!-- Source EN PDF p.155; unit 1867 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.155; unit 1868 -->

【Зависимости】

<!-- Source EN PDF p.155; unit 1869 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1870 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.156; unit 1871 -->

#### 8.4.14  rk_aiq_uapi2_endOpZoomChange

<!-- Source EN PDF p.156; unit 1872 -->

【Описание】Завершение установки положения зума; вызывается после rk_aiq_uapi_setOpZoomPosition и запускает фокусировку.

<!-- Source EN PDF p.156; unit 1873 -->

【Синтаксис】

<!-- Source EN PDF p.156; unit 1874 -->

```text
 XCamReturn rk_aiq_uapi2_endOpZoomChange(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.156; unit 1875 -->

【Параметры】

<!-- Source EN PDF p.156; unit 1876 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.156; unit 1877 -->

【Возвращаемое значение】

<!-- Source EN PDF p.156; unit 1878 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.156; unit 1879 -->

【Зависимости】

<!-- Source EN PDF p.156; unit 1880 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.156; unit 1881 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.156; unit 1882 -->

#### 8.4.15  rk_aiq_uapi2_getFocusRange

<!-- Source EN PDF p.156; unit 1883 -->

【Описание】Получение диапазона фокусировки, ограничивающего код положения на входе rk_aiq_uapi_setFocusPosition.

<!-- Source EN PDF p.156; unit 1884 -->

【Синтаксис】

<!-- Source EN PDF p.156; unit 1885 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_focusrange* range);
```

<!-- Source EN PDF p.156; unit 1886 -->

【Параметры】

<!-- Source EN PDF p.156; unit 1887 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| range | Диапазон перемещения фокуса, см. rk_aiq_af_focusrange. | Выход |

<!-- Source EN PDF p.156; unit 1888 -->

【Возвращаемое значение】

<!-- Source EN PDF p.157; unit 1889 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.157; unit 1890 -->

【Зависимости】

<!-- Source EN PDF p.157; unit 1891 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1892 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.157; unit 1893 -->

#### 8.4.16  rk_aiq_uapi2_setFocusPosition

<!-- Source EN PDF p.157; unit 1894 -->

【Описание】Установка положения фокуса в ручном режиме.

<!-- Source EN PDF p.157; unit 1895 -->

【Синтаксис】

<!-- Source EN PDF p.157; unit 1896 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short code);
```

<!-- Source EN PDF p.157; unit 1897 -->

【Параметры】

<!-- Source EN PDF p.157; unit 1898 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| code | Код положения фокуса, диапазон определяется rk_aiq_uapi2_getFocusRange. | Вход |

<!-- Source EN PDF p.157; unit 1899 -->

【Возвращаемое значение】

<!-- Source EN PDF p.157; unit 1900 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.157; unit 1901 -->

【Зависимости】

<!-- Source EN PDF p.157; unit 1902 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1903 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.157; unit 1904 -->

#### 8.4.17  rk_aiq_uapi2_getFocusPosition

<!-- Source EN PDF p.157; unit 1905 -->

【Описание】Получение текущего положения фокуса.

<!-- Source EN PDF p.157; unit 1906 -->

【Синтаксис】

<!-- Source EN PDF p.157; unit 1907 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short *code);
```

<!-- Source EN PDF p.158; unit 1908 -->

【Параметры】

<!-- Source EN PDF p.158; unit 1909 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| code | Код положения фокуса | Выход |

<!-- Source EN PDF p.158; unit 1910 -->

【Возвращаемое значение】

<!-- Source EN PDF p.158; unit 1911 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.158; unit 1912 -->

【Зависимости】

<!-- Source EN PDF p.158; unit 1913 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1914 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.158; unit 1915 -->

#### 8.4.18  rk_aiq_uapi2_startZoomCalib

<!-- Source EN PDF p.158; unit 1916 -->

【Описание】Калибровка моторизованного модуля.

<!-- Source EN PDF p.158; unit 1917 -->

【Синтаксис】

<!-- Source EN PDF p.158; unit 1918 -->

```text
 XCamReturn rk_aiq_uapi2_startZoomCalib(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.158; unit 1919 -->

【Параметры】

<!-- Source EN PDF p.158; unit 1920 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.158; unit 1921 -->

【Возвращаемое значение】

<!-- Source EN PDF p.158; unit 1922 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.158; unit 1923 -->

【Зависимости】

<!-- Source EN PDF p.158; unit 1924 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1925 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.159; unit 1926 -->

#### 8.4.19  rk_aiq_uapi2_resetZoom

<!-- Source EN PDF p.159; unit 1927 -->

【Описание】Сброс моторизованного модуля.

<!-- Source EN PDF p.159; unit 1928 -->

【Синтаксис】

<!-- Source EN PDF p.159; unit 1929 -->

```text
 XCamReturn rk_aiq_uapi2_resetZoom(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.159; unit 1930 -->

【Параметры】

<!-- Source EN PDF p.159; unit 1931 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.159; unit 1932 -->

【Возвращаемое значение】

<!-- Source EN PDF p.159; unit 1933 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.159; unit 1934 -->

【Зависимости】

<!-- Source EN PDF p.159; unit 1935 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.159; unit 1936 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.159; unit 1937 -->

### 8.5 Типы данных функционального API

<!-- Source EN PDF p.159; unit 1938 -->

#### 8.5.1  opMode_t

<!-- Source EN PDF p.159; unit 1939 -->

【Описание】Определение режима статистики AF.

<!-- Source EN PDF p.159; unit 1940 -->

【Определение】

<!-- Source EN PDF p.159; unit 1941 -->

```text
 typedef enum opMode_e {
     OP_AUTO   = 0,
     OP_MANUAL = 1,
     OP_SEMI_AUTO = 2,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.159; unit 1942 -->

【Члены】

<!-- Source EN PDF p.160; unit 1943 -->

| Имя члена | Описание |
|---|---|
| OP_AUTO | Автофокус с выполнением встроенного алгоритма AF. |
| OP_MANUAL | Ручной фокус с остановкой встроенного AF. |
| OP_SEMI_AUTO | Полуавтоматический фокус: вызов API положения зума выполняет одну автофокусировку. |

<!-- Source EN PDF p.160; unit 1944 -->

#### 8.5.2  rk_aiq_af_zoomrange

<!-- Source EN PDF p.160; unit 1945 -->

【Описание】Определение диапазона зума.

<!-- Source EN PDF p.160; unit 1946 -->

【Определение】

<!-- Source EN PDF p.160; unit 1947 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
     float min_fl;
     float max_fl;
 } rk_aiq_af_zoomrange;
```

<!-- Source EN PDF p.160; unit 1948 -->

【Члены】

<!-- Source EN PDF p.160; unit 1949 -->

| Имя члена | Описание |
|---|---|
| min_pos | Минимум зума |
| max_pos | zoommax |
| min_fl | Минимальное фокусное расстояние |
| max_fl | Максимальное фокусное расстояние |

<!-- Source EN PDF p.160; unit 1950 -->

#### 8.5.3  rk_aiq_af_focusrange

<!-- Source EN PDF p.160; unit 1951 -->

【Описание】Определение диапазона фокуса.

<!-- Source EN PDF p.160; unit 1952 -->

【Определение】

<!-- Source EN PDF p.160; unit 1953 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
 } rk_aiq_af_focusrange;
```

<!-- Source EN PDF p.160; unit 1954 -->

【Члены】

<!-- Source EN PDF p.160; unit 1955 -->

| Имя члена | Описание |
|---|---|
| min_pos | Минимум фокуса |
| max_pos | Максимум фокуса |

<!-- Source EN PDF p.161; unit 1956 -->

#### 8.5.4  rk_aiq_af_result_t

<!-- Source EN PDF p.161; unit 1957 -->

【Описание】Определение результатов поиска AF.

<!-- Source EN PDF p.161; unit 1958 -->

【Определение】

<!-- Source EN PDF p.161; unit 1959 -->

```text
 typedef enum rk_aiq_af_sec_stat_e
 {
     RK_AIQ_AF_SEARCH_INVAL   = 0,
     RK_AIQ_AF_SEARCH_RUNNING = 1,
     RK_AIQ_AF_SEARCH_END     = 2
 } rk_aiq_af_sec_stat_t;
 typedef struct {
     rk_aiq_af_sec_stat_t stat;
     int32_t final_pos;
 } rk_aiq_af_result_t;
```

<!-- Source EN PDF p.161; unit 1960 -->

【Члены】

<!-- Source EN PDF p.161; unit 1961 -->

| Имя члена | Описание |
|---|---|
| stat | Состояние фокусировки |
| final_pos | Окончательное положение фокуса |

<!-- Source EN PDF p.161; unit 1962 -->

### 8.6 Справочник модульного API

<!-- Source EN PDF p.161; unit 1963 -->

#### 8.6.1  rk_aiq_user_api2_af_SetAttrib

<!-- Source EN PDF p.161; unit 1964 -->

【Описание】Установка атрибутов фокусировки.

<!-- Source EN PDF p.161; unit 1965 -->

【Синтаксис】

<!-- Source EN PDF p.161; unit 1966 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 attr);
```

<!-- Source EN PDF p.161; unit 1967 -->

【Параметры】

<!-- Source EN PDF p.161; unit 1968 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров фокусировки | Вход |

<!-- Source EN PDF p.161; unit 1969 -->

【Возвращаемое значение】

<!-- Source EN PDF p.162; unit 1970 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.162; unit 1971 -->

【Зависимости】

<!-- Source EN PDF p.162; unit 1972 -->

Заголовочный файл: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1973 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.162; unit 1974 -->

#### 8.6.2  rk_aiq_user_api2_af_GetAttrib

<!-- Source EN PDF p.162; unit 1975 -->

【Описание】Получение атрибутов фокусировки.

<!-- Source EN PDF p.162; unit 1976 -->

【Синтаксис】

<!-- Source EN PDF p.162; unit 1977 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 *attr);
```

<!-- Source EN PDF p.162; unit 1978 -->

【Параметры】

<!-- Source EN PDF p.162; unit 1979 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров фокусировки | Выход |

<!-- Source EN PDF p.162; unit 1980 -->

【Возвращаемое значение】

<!-- Source EN PDF p.162; unit 1981 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.162; unit 1982 -->

【Зависимости】

<!-- Source EN PDF p.162; unit 1983 -->

Заголовочный файл: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1984 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.163; unit 1985 -->

### 8.7 Типы данных модульного API

<!-- Source EN PDF p.163; unit 1986 -->

#### 8.7.1  RKAIQ_AF_MODE

<!-- Source EN PDF p.163; unit 1987 -->

【Описание】Определение режима работы фокуса.

<!-- Source EN PDF p.163; unit 1988 -->

【Определение】

<!-- Source EN PDF p.163; unit 1989 -->

```text
 typedef enum _RKAIQ_AF_MODE
 {
     RKAIQ_AF_MODE_NOT_SET = -1,
     RKAIQ_AF_MODE_AUTO,
     RKAIQ_AF_MODE_MACRO,
     RKAIQ_AF_MODE_INFINITY,
     RKAIQ_AF_MODE_FIXED,
     RKAIQ_AF_MODE_EDOF,
     RKAIQ_AF_MODE_CONTINUOUS_VIDEO,
     RKAIQ_AF_MODE_CONTINUOUS_PICTURE,
     RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM,
 } RKAIQ_AF_MODE;
```

<!-- Source EN PDF p.163; unit 1990 -->

【Члены】

<!-- Source EN PDF p.163; unit 1991 -->

| Имя члена | Описание |
|---|---|
| RKAIQ_AF_MODE_NOT_SET | Режим фокуса не задан |
| RKAIQ_AF_MODE_AUTO | Режим автофокуса |
| RKAIQ_AF_MODE_MACRO | Режим макрофокуса |
| RKAIQ_AF_MODE_INFINITY | Режим дальнего фокуса |
| RKAIQ_AF_MODE_FIXED | Режим фиксированного фокуса |
| RKAIQ_AF_MODE_EDOF | Режим фокусировки по глубине резкости |
| RKAIQ_AF_MODE_CONTINUOUS_VIDEO | Плавный непрерывный автофокус |
| RKAIQ_AF_MODE_CONTINUOUS_PICTURE | Быстрый непрерывный автофокус |
| RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM | Полуавтоматический фокус: настройка положения зума автоматически запускает одну фокусировку. |

<!-- Source EN PDF p.163; unit 1992 -->

#### 8.7.2  RKAIQ_AF_HWVER

<!-- Source EN PDF p.163; unit 1993 -->

【Описание】Определение режима работы фокуса.

<!-- Source EN PDF p.163; unit 1994 -->

【Определение】

<!-- Source EN PDF p.164; unit 1995 -->

```text
 typedef enum _RKAIQ_AF_HWVER
 {
     RKAIQ_AF_HW_V20 = 0,
     RKAIQ_AF_HW_V30,
     RKAIQ_AF_HW_VMAX
 } RKAIQ_AF_HWVER;
```

<!-- Source EN PDF p.164; unit 1996 -->

【Члены】

<!-- Source EN PDF p.164; unit 1997 -->

| Имя члена | Описание |
|---|---|
| RKAIQ_AF_HW_V20 | Версия аппаратуры AF 2.0 |
| RKAIQ_AF_HW_V30 | Версия аппаратуры AF 3.0 |

<!-- Source EN PDF p.164; unit 1998 -->

#### 8.7.3  rk_aiq_af_algo_meas_v30_t

<!-- Source EN PDF p.164; unit 1999 -->

【Описание】Определение режима статистики AF.

<!-- Source EN PDF p.164; unit 2000 -->

【Определение】

<!-- Source EN PDF p.164; unit 2001 -->

```text
 typedef struct {
     unsigned char af_en;
     unsigned char rawaf_sel;
     unsigned char gamma_en;
     unsigned char gaus_en;
     unsigned char v1_fir_sel;
     unsigned char hiir_en;
     unsigned char viir_en;
     unsigned char v1_fv_outmode;    // 0 square, 1 absolute
     unsigned char v2_fv_outmode;    // 0 square, 1 absolute
     unsigned char h1_fv_outmode;    // 0 square, 1 absolute
     unsigned char h2_fv_outmode;    // 0 square, 1 absolute
     unsigned char ldg_en;
     unsigned char accu_8bit_mode;   //fix to 1
     unsigned char ae_mode;
     unsigned char y_mode;           //fix to 0
     unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
     unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
     unsigned char window_num;
     unsigned short wina_h_offs;
     unsigned short wina_v_offs;
     unsigned short wina_h_size;
     unsigned short wina_v_size;
     unsigned short winb_h_offs;
     unsigned short winb_v_offs;
     unsigned short winb_h_size;
     unsigned short winb_v_size;
     unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
     // [old version param]
     unsigned short thres;
     unsigned char shift_sum_a;
     unsigned char shift_sum_b;
     unsigned char shift_y_a;
     unsigned char shift_y_b;
```

<!-- Source EN PDF p.165; unit 2002 -->

```text
     /**********[Vertical IIR (v1 & v2)]************/
     short v1_iir_coe[9];
     short v1_fir_coe[3];
     short v2_iir_coe[3];
     short v2_fir_coe[3];
     /**********[Horizontal IIR (h1 & h2)]************/
     short h1_iir1_coe[6];
     short h2_iir1_coe[6];
     short h1_iir2_coe[6];
     short h2_iir2_coe[6];
     /**********[Focus value statistic param]**********/
     // level depended gain
     // input8 lumi, output8bit gain
     unsigned char h_ldg_lumth[2];    //luminance thresh
     unsigned char h_ldg_gain[2];     //gain for [minLum,maxLum]
     unsigned short h_ldg_gslp[2];    //[slope_low,-slope_high]
     unsigned char v_ldg_lumth[2];
     unsigned char v_ldg_gain[2];
     unsigned short v_ldg_gslp[2];
     // coring
     unsigned short v_fv_thresh;
     unsigned short h_fv_thresh;
     // left shift, more needed if outmode=square
     unsigned char v1_fv_shift; //only for sel1
     unsigned char v2_fv_shift;
     unsigned char h1_fv_shift;
     unsigned char h2_fv_shift;
     /**********[High light]**********/
     unsigned short highlit_thresh;
 }  rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.165; unit 2003 -->

【Члены】

<!-- Source EN PDF p.166; unit 2004 -->

| Имя члена | Описание |
|---|---|
| af_en | Включение статистики AF: 0 — выключено, 1 — включено. |
| rawaf_sel | Канал статистики AF, диапазон 0-3, соответствует длинному/среднему/короткому/объединённому кадрам HDR. Обычно выбирается средний: 0 для не-HDR, 1 для HDR; исходное соответствие сохранено. |
| Gamma_en | Включение Gamma: 0 — выключено, 1 — включено. |
| gaus_en | Необходимо фиксированное значение 1. |
| v1_fir_sel | Необходимо фиксированное значение 1. |
| hiir_en | Включение H1/H2: 0 — выключено, 1 — включено. |
| viir_en | Включение V1/V2: 0 — выключено, 1 — включено. При gamma_en необходимо viir_en = 1. |
| v1_fv_outmode | Режим выхода FV канала V1: 0 — квадрат, 1 — абсолютное значение. |
| v2_fv_outmode | Выход FV V2: 0 — квадрат, 1 — абсолютное значение. |
| ldg_en | Включение LDG: 0 — выключено, 1 — включено. |
| accu_8bit_mode | Необходимо фиксированное значение 1. |
| ae_mode | При ae_mode=1 RAWAF использует логику RAWAE_BIG для усреднения яркости по сетке 15x15. |
| y_mode | Необходимо фиксированное значение 0. |
| sobel_sel | Необходимо фиксированное значение 0. |
| v_dnscl_mode | Широкая/узкая полоса, задаётся по результату инструмента коэффициентов фильтра AF. |
| from_awb | Вход статистики AF берётся из AWB. |
| from_ynr | Вход статистики AF берётся из YNR. |
| ae_config_use | Фиксированное значение 0. |
| line_en | Пока не действует. |
| line_num | Пока не действует. |
| window_num | Число окон: window_num=1 — основное WinA; 2 — WinA и независимое WinB. |
| wina_h_offs | Горизонтальная координата первого пикселя левого верхнего угла WinA, должна быть &gt;=2. |
| wina_v_offs | Вертикальная координата первого пикселя левого верхнего угла WinA, должна быть &gt;=1. |

<!-- Source EN PDF p.167; unit 2005 -->

| Имя члена | Описание |
|---|---|
| wina_h_size | Ширина WinA должна быть меньше ширины изображения -2-wina_h_offs и кратна 15. |
| wina_v_size | Высота WinA должна быть меньше высоты изображения -2-wina_v_offs и кратна 15. |
| winb_h_offs | Горизонтальная координата первого пикселя WinB, должна быть &gt;=2. |
| winb_v_offs | Вертикальная координата первого пикселя WinB, должна быть &gt;=1. |
| winb_h_size | Ширина WinB меньше ширины изображения -2-wina_h_offs; ссылка на смещение WinA сохранена и требует проверки. |
| winb_v_size | Высота WinB меньше высоты изображения -2-wina_v_offs; ссылка на WinA сохранена и требует проверки. |
| gamma_y | Значения y Gamma в диапазоне 0-1023; сегменты x от 0 до 1023: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128. |
| thres | Порог AF WinB: FV ниже порога обнуляется для подавления шума; диапазон 0-0xFFFF. |
| shift_sum_a | Пока недоступно, фиксировать 0. |
| shift_y_a | Пока недоступно, фиксировать 0. |
| v1_iir_coe[9] | Коэффициенты IIR 3X3 канала V1 по выходу инструмента AF. |
| v1_fir_coe[3] | Коэффициенты FIR 1x3 канала V1 по инструменту AF. |
| v2_iir_coe[3] | Коэффициенты IIR 1x3 канала V2 по инструменту AF. |
| v2_fir_coe[3] | Коэффициенты FIR 1x3 канала V2 по инструменту AF. |
| h1_iir1_coe[6] | Коэффициенты IIR1 1X6 канала H1 по инструменту AF. |
| h2_iir1_coe[6] | Коэффициенты IIR1 1X6 канала H2 по инструменту AF. |
| h1_iir2_coe[6] | Коэффициенты IIR2 1X6 канала H1 по инструменту AF. |
| h2_iir2_coe[6] | Коэффициенты IIR2 1X6 канала H2 по инструменту AF. |

<!-- Source EN PDF p.168; unit 2006 -->

| Имя члена | Описание |
|---|---|
| h_ldg_lumth[2] | Порог яркости LDG H1/H2: 0 — левая тёмная область, 1 — правая светлая; диапазон 0~255. |
| h_ldg_gain[2] | Минимальное усиление LDG H1/H2: 0 — тёмная, 1 — светлая область; диапазон 0~255. |
| h_ldg_gslp[2] | Наклон LDG H1/H2: 0 — тёмная, 1 — светлая область; диапазон 0~65535. |
| v_ldg_lumth[2] | Порог яркости LDG V1/V2: 0 — тёмная, 1 — светлая область; диапазон 0~255. |
| v_ldg_gain[2] | Минимальное усиление LDG V1/V2: 0 — тёмная, 1 — светлая область; диапазон 0~255. |
| v_ldg_gslp[2] | Минимальное усиление LDG V1/V2: 0 — тёмная, 1 — светлая область; диапазон 0~255. |
| v_fv_thresh | Порог AF V1/V2: FV ниже него обнуляется для подавления шума; диапазон 0-0x0FFF. |
| h_fv_thresh | Порог AF H1/H2: FV ниже него обнуляется для подавления шума; диапазон 0-0x0FFF. |
| v1_fv_shift | Правый сдвиг FV V1 для защиты от переполнения, диапазон 0-7; исходное shit bit — опечатка. |
| v2_fv_shift | Правый сдвиг FV V2 для защиты от переполнения, диапазон 0-7; в исходнике shit bit. |
| h1_fv_shift | Правый сдвиг FV H1 для защиты от переполнения, диапазон 0-7; в исходнике shit bit. |
| h2_fv_shift | Правый сдвиг FV H2 для защиты от переполнения, диапазон 0-7; в исходнике shit bit. |
| highlit_thresh | Порог ярких пикселей: значения выше него считаются яркими; в каждой области накапливается только их количество. Диапазон 0-0x0FFF. |

<!-- Source EN PDF p.169; unit 2007 -->

#### 8.7.4  rk_aiq_af_attrib_t

<!-- Source EN PDF p.169; unit 2008 -->

【Описание】Конфигурация фокусировки.

<!-- Source EN PDF p.169; unit 2009 -->

【Определение】

<!-- Source EN PDF p.169; unit 2010 -->

```text
 typedef struct rk_aiq_af_attrib_s {
     rk_aiq_uapi_sync_t sync;
     RKAIQ_AF_MODE AfMode;
     RKAIQ_AF_HWVER AfHwVer;
     bool contrast_af;
     bool laser_af;
     bool pdaf;
     int h_offs;
     int v_offs;
     unsigned int h_size;
     unsigned int v_size;
     short fixedModeDefCode;
     short macroModeDefCode;
     short infinityModeDefCode;
     union {
         rk_aiq_af_algo_meas_v20_t manual_meascfg;
         rk_aiq_af_algo_meas_v30_t manual_meascfg_v30;
     };
 } rk_aiq_af_attrib_t;
```

<!-- Source EN PDF p.169; unit 2011 -->

【Члены】

<!-- Source EN PDF p.170; unit 2012 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронные/асинхронные API: см. rk_aiq_uapi_sync_t в разделе «Обзор/Описание API». |
| AfMode | Режим фокусировки |
| contrast_af | Включение контрастного фокуса |
| laser_af | Включение лазерного фокуса |
| pdaf | Включение фазового фокуса |
| h_offs | Начальная горизонтальная координата окна |
| v_offs | Начальная вертикальная координата окна |
| h_size | Ширина окна фокуса |
| v_size | Высота окна фокуса |
| fixedModeDefCode | Код положения фокуса |
| macroModeDefCode | Код остановки макрофокуса, исходный диапазон 0-value. |
| infinityModeDefCode | Начальный код дальнего фокуса, исходный диапазон -64. |
| manual_meascfg | Пользовательская статистика AF2.0 |
| manual_meascfg_v30 | Пользовательская статистика AF3.0 |

<!-- Source EN PDF p.170; unit 2013 -->

### 8.8 Дополнительные указания

<!-- Source EN PDF p.170; unit 2014 -->

#### 8.8.1 Проверка драйвера VCM

<!-- Source EN PDF p.170; unit 2015 -->

1\. Правильны ли начальный и конечный токи VCM.

<!-- Source EN PDF p.170; unit 2016 -->

Сначала получите данные о начальном и конечном токах у производителя модуля.

<!-- Source EN PDF p.170; unit 2017 -->

Затем проверьте сведения на нескольких модулях:

<!-- Source EN PDF p.170; unit 2018 -->

В DTS задайте максимальный поддерживаемый VCM диапазон токов.

<!-- Source EN PDF p.170; unit 2019 -->

В ручном фокусе постепенно изменяйте позицию от 64; когда объектив начинает двигаться и объект дальше 10 метров резок, запишите позицию.

<!-- Source EN PDF p.170; unit 2020 -->

Начальный ток: (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2021 -->

Продолжайте регулировку и запишите позицию резкого близкого объекта (10cm или 20cm).

<!-- Source EN PDF p.170; unit 2022 -->

Конечный ток: (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2023 -->

2\. Стабильно ли конечное положение VCM при движении с разных направлений.

<!-- Source EN PDF p.171; unit 2024 -->

В ручном режиме выберите позицию и подойдите к ней от 0 и от 64; сравните резкость изображений и близость статистики AF.

<!-- Source EN PDF p.171; unit 2025 -->

3\. Правильно ли время перемещения объектива.

<!-- Source EN PDF p.171; unit 2026 -->

#### 8.8.2 Проверка драйвера моторизованного модуля

<!-- Source EN PDF p.171; unit 2027 -->

1\. Совпадает ли конечная позиция после отдельных шагов и одного многошагового перемещения.

<!-- Source EN PDF p.171; unit 2028 -->

1\. Выберите наиболее резкое положение zoom/focus, запишите позицию двигателя и сохраните изображение A.

<!-- Source EN PDF p.171; unit 2029 -->

2\. Отведите двигатель на несколько шагов и верните по одному шагу в записанную позицию; сохраните B.

<!-- Source EN PDF p.171; unit 2030 -->

3\. Снова отведите двигатель на несколько шагов и верните одним перемещением; сохраните C.

<!-- Source EN PDF p.171; unit 2031 -->

4\. Сравните резкость и поле зрения A, B и C.

<!-- Source EN PDF p.171; unit 2032 -->

2\. Совпадает ли конечная позиция после случайных перемещений.

<!-- Source EN PDF p.171; unit 2033 -->

1\. Выберите наиболее резкое положение zoom/focus, запишите позицию двигателя и сохраните изображение A.

<!-- Source EN PDF p.171; unit 2034 -->

2\. Скриптом выполните 400–500 случайных перемещений zoom либо focus, верните исходную позицию и сохраните B.

<!-- Source EN PDF p.171; unit 2035 -->

3\. Сравните резкость и поле зрения A и B.

<!-- Source EN PDF p.171; unit 2036 -->

3\. Совпадает ли конечная позиция после одновременного движения двигателей.

<!-- Source EN PDF p.171; unit 2037 -->

1\. Выберите наиболее резкое положение zoom/focus, запишите позицию двигателя и сохраните изображение A.

<!-- Source EN PDF p.171; unit 2038 -->

2\. Скриптом одновременно выполните 400–500 случайных перемещений zoom и focus, верните исходные позиции и сохраните B.

<!-- Source EN PDF p.171; unit 2039 -->

3\. Сравните резкость и поле зрения A и B.

<!-- Source EN PDF p.171; unit 2040 -->

## 9.   IMGPROC

<!-- Source EN PDF p.171; unit 2041 -->

### 9.1 Обзор

<!-- Source EN PDF p.171; unit 2042 -->

imgproc обозначает модули, влияющие на вид изображения.

<!-- Source EN PDF p.172; unit 2043 -->

### 9.2   Merge

<!-- Source EN PDF p.172; unit 2044 -->

#### 9.2.1 Описание функций

<!-- Source EN PDF p.172; unit 2045 -->

Merge объединяет несколько кадров в один.

<!-- Source EN PDF p.172; unit 2046 -->

#### 9.2.2 Основные понятия

<!-- Source EN PDF p.172; unit 2047 -->

Действует только в режиме HDR.

<!-- Source EN PDF p.172; unit 2048 -->

#### 9.2.3 Справочник функционального API

<!-- Source EN PDF p.172; unit 2049 -->

#### 9.2.4 Справочник модульного API

<!-- Source EN PDF p.172; unit 2050 -->

9.2.4.1  rk_aiq_user_api2_amerge_SetAttrib

<!-- Source EN PDF p.172; unit 2051 -->

【Описание】Установка атрибутов merge.

<!-- Source EN PDF p.172; unit 2052 -->

【Синтаксис】

<!-- Source EN PDF p.172; unit 2053 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t attr);
```

<!-- Source EN PDF p.172; unit 2054 -->

【Параметры】

<!-- Source EN PDF p.172; unit 2055 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров merge | Вход |

<!-- Source EN PDF p.172; unit 2056 -->

【Возвращаемое значение】

<!-- Source EN PDF p.172; unit 2057 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.172; unit 2058 -->

【Зависимости】

<!-- Source EN PDF p.172; unit 2059 -->

Заголовочный файл: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.172; unit 2060 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.173; unit 2061 -->

9.2.4.2  rk_aiq_user_api2_amerge_GetAttrib

<!-- Source EN PDF p.173; unit 2062 -->

【Описание】Получение атрибутов merge.

<!-- Source EN PDF p.173; unit 2063 -->

【Синтаксис】

<!-- Source EN PDF p.173; unit 2064 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t* attr);
```

<!-- Source EN PDF p.173; unit 2065 -->

【Параметры】

<!-- Source EN PDF p.173; unit 2066 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров merge | Выход |

<!-- Source EN PDF p.173; unit 2067 -->

【Возвращаемое значение】

<!-- Source EN PDF p.173; unit 2068 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.173; unit 2069 -->

【Зависимости】

<!-- Source EN PDF p.173; unit 2070 -->

Заголовочный файл: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.173; unit 2071 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.173; unit 2072 -->

#### 9.2.5 Типы данных модульного API

<!-- Source EN PDF p.173; unit 2073 -->

9.2.5.1  merge_OpMode_t

<!-- Source EN PDF p.173; unit 2074 -->

【Описание】Определение режима merge.

<!-- Source EN PDF p.173; unit 2075 -->

【Определение】

<!-- Source EN PDF p.173; unit 2076 -->

```text
 typedef enum merge_OpModeV21_e {
     MERGE_OPMODE_API_OFF = 0,
     MERGE_OPMODE_MANU    = 1,
 } merge_OpModeV21_t;
```

<!-- Source EN PDF p.173; unit 2077 -->

【Члены】

<!-- Source EN PDF p.174; unit 2078 -->

| Имя члена | Описание |
|---|---|
| MERGE_OPMODE_API_OFF | Режим выключенного API; алгоритм находится в AUTO и использует параметр (исходная фраза незавершена). |
| MERGE_OPMODE_MANU | Ручной режим |

<!-- Source EN PDF p.174; unit 2079 -->

9.2.5.2  MergeBaseFrame_t

<!-- Source EN PDF p.174; unit 2080 -->

【Описание】Определение опорного кадра объединения.

<!-- Source EN PDF p.174; unit 2081 -->

【Определение】

<!-- Source EN PDF p.174; unit 2082 -->

```text
 typedef enum MergeBaseFrame_e {
     BASEFRAME_LONG  = 0,
     BASEFRAME_SHORT = 1,
 } MergeBaseFrame_t;
```

<!-- Source EN PDF p.174; unit 2083 -->

【Члены】

<!-- Source EN PDF p.174; unit 2084 -->

| Имя члена | Описание |
|---|---|
| BASEFRAME_LONG | Объединение с опорой на длинный кадр. |
| BASEFRAME_SHORT | Объединение с опорой на короткий кадр. |

<!-- Source EN PDF p.174; unit 2085 -->

9.2.5.3  MergeCurrCtlData_t

<!-- Source EN PDF p.174; unit 2086 -->

【Описание】Определение управляющих параметров Merge.

<!-- Source EN PDF p.174; unit 2087 -->

【Определение】

<!-- Source EN PDF p.174; unit 2088 -->

```text
 typedef struct MergeCurrCtlData_s {
     float Envlv;
     float MoveCoef;
 } MergeCurrCtlData_t;
```

<!-- Source EN PDF p.174; unit 2089 -->

【Члены】

<!-- Source EN PDF p.174; unit 2090 -->

| Имя члена | Описание |
|---|---|
| Envlv | Текущая яркость среды; исходная запись диапазона 0,1 и точности 0.000001 сохранена. |
| MoveCoef | Текущий коэффициент движения, диапазон [0,1], точность 0.000001; пока фиксирован. |

<!-- Source EN PDF p.175; unit 2091 -->

9.2.5.4  mMergeOECurveV21_t

<!-- Source EN PDF p.175; unit 2092 -->

【Описание】Определение ручной кривой пересвета Merge.

<!-- Source EN PDF p.175; unit 2093 -->

【Определение】

<!-- Source EN PDF p.175; unit 2094 -->

```text
 typedef struct mMergeOECurveV21_s {
     float Smooth;
     float Offset;
 } mMergeOECurveV21_t;
```

<!-- Source EN PDF p.175; unit 2095 -->

【Члены】

<!-- Source EN PDF p.175; unit 2096 -->

| Имя члена | Описание |
|---|---|
| Smooth | Наклон кривой пересвета, диапазон [0,1], по умолчанию 0.4, точность 0.01. |
| Offset | Смещение кривой пересвета, диапазон [108,280], по умолчанию 210, точность 0.1. |

<!-- Source EN PDF p.175; unit 2097 -->

9.2.5.5  mMergeMDCurveV21_t

<!-- Source EN PDF p.175; unit 2098 -->

【Описание】Определение кривой движения режима длинного кадра.

<!-- Source EN PDF p.175; unit 2099 -->

【Определение】

<!-- Source EN PDF p.175; unit 2100 -->

```text
 typedef struct mMergeMDCurveV21_s {
     float LM_smooth;
     float LM_offset;
     float MS_smooth;
     float MS_offset;
 } mMergeMDCurveV21_t;
```

<!-- Source EN PDF p.175; unit 2101 -->

【Члены】

<!-- Source EN PDF p.176; unit 2102 -->

| Имя поля | Описание |
|---|---|
| LM_smooth | Наклон кривой движения длинного/среднего кадров, [0,1], по умолчанию 0.4, точность 0.01; не действует на RK356x. |
| LM_offset | Смещение кривой длинного/среднего кадров, [0.26,1], по умолчанию 0.38, точность 0.01; не действует на RK356x. |
| MS_smooth | Наклон кривой среднего/короткого кадров, [0,1], по умолчанию 0.4, точность 0.01. |
| MS_offset | Смещение кривой среднего/короткого кадров, [0.26,1], по умолчанию 0.38, точность 0.01. |

<!-- Source EN PDF p.176; unit 2103 -->

9.2.5.6  mMergeAttrV21_t

<!-- Source EN PDF p.176; unit 2104 -->

【Описание】Определение ручных атрибутов merge RK3588.

<!-- Source EN PDF p.176; unit 2105 -->

【Определение】

<!-- Source EN PDF p.176; unit 2106 -->

```text
 typedef struct mMergeAttrV21_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mMergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2107 -->

【Члены】

<!-- Source EN PDF p.176; unit 2108 -->

| Имя члена | Описание |
|---|---|
| OECurve | Параметры кривой пересвета |
| MDCurve | Параметры кривой движения |

<!-- Source EN PDF p.176; unit 2109 -->

9.2.5.7  mergeAttrV21_t

<!-- Source EN PDF p.176; unit 2110 -->

【Описание】Настройка атрибутов merge RK356x.

<!-- Source EN PDF p.176; unit 2111 -->

【Определение】

<!-- Source EN PDF p.176; unit 2112 -->

```text
 typedef struct mergeAttrV21_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV21_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2113 -->

【Члены】

<!-- Source EN PDF p.177; unit 2114 -->

| Имя члена | Описание |
|---|---|
| opMode | Выбор режима |
| stManual | Ручные атрибуты merge |
| CtlInfo | Параметры управляющих величин |

<!-- Source EN PDF p.177; unit 2115 -->

9.2.5.8  mLongFrameModeData_t

<!-- Source EN PDF p.177; unit 2116 -->

【Описание】Определение управляющих параметров длинного кадра.

<!-- Source EN PDF p.177; unit 2117 -->

【Определение】

<!-- Source EN PDF p.177; unit 2118 -->

```text
 typedef struct mLongFrameModeData_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mLongFrameModeData_t;
```

<!-- Source EN PDF p.177; unit 2119 -->

【Члены】

<!-- Source EN PDF p.177; unit 2120 -->

| Имя поля | Описание |
|---|---|
| OECurve | Параметры кривой пересвета |
| MDCurve | Параметры кривой движения |

<!-- Source EN PDF p.177; unit 2121 -->

9.2.5.9  mMergeMDCurveV30Short_t

<!-- Source EN PDF p.177; unit 2122 -->

【Описание】Определение кривой движения короткого кадра.

<!-- Source EN PDF p.177; unit 2123 -->

【Определение】

<!-- Source EN PDF p.177; unit 2124 -->

```text
 typedef struct mMergeMDCurveV30Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } mMergeMDCurveV30Short_t;
```

<!-- Source EN PDF p.177; unit 2125 -->

【Члены】

<!-- Source EN PDF p.178; unit 2126 -->

| Имя поля | Описание |
|---|---|
| Coef | Управляющий коэффициент, [0,1], по умолчанию 0.05, точность 0.0001. |
| ms_thd0 | Коэффициент среднего/короткого кадров, [0,1], по умолчанию 0.0, точность 0.1. |
| lm_thd0 | Коэффициент длинного/среднего кадров, [0,1], по умолчанию 0.0, точность 0.1. |

<!-- Source EN PDF p.178; unit 2127 -->

9.2.5.10  mShortFrameModeData_t

<!-- Source EN PDF p.178; unit 2128 -->

【Описание】Определение управляющих параметров короткого кадра.

<!-- Source EN PDF p.178; unit 2129 -->

【Определение】

<!-- Source EN PDF p.178; unit 2130 -->

```text
 typedef struct mShortFrameModeData_s {
     mMergeOECurveV21_t      OECurve;
     mMergeMDCurveV30Short_t MDCurve;
 } mShortFrameModeData_t;
```

<!-- Source EN PDF p.178; unit 2131 -->

【Члены】

<!-- Source EN PDF p.178; unit 2132 -->

| Имя поля | Описание |
|---|---|
| OECurve | Параметры кривой пересвета |
| MDCurve | Параметры кривой движения |

<!-- Source EN PDF p.178; unit 2133 -->

9.2.5.11  mMergeAttrV30_t

<!-- Source EN PDF p.178; unit 2134 -->

【Описание】Определение ручных атрибутов merge RK3588.

<!-- Source EN PDF p.178; unit 2135 -->

【Определение】

<!-- Source EN PDF p.178; unit 2136 -->

```text
 typedef struct mMergeAttrV30_s {
     MergeBaseFrame_t      BaseFrm;
     mLongFrameModeData_t  LongFrmModeData;
     mShortFrameModeData_t ShortFrmModeData;
 } mMergeAttrV30_t;
```

<!-- Source EN PDF p.178; unit 2137 -->

【Члены】

<!-- Source EN PDF p.178; unit 2138 -->

| Имя члена | Описание |
|---|---|
| BaseFrm | Опорный кадр объединения |
| LongFrmModeData | Управляющие данные при длинном опорном кадре (в исходнике повтор data). |

<!-- Source EN PDF p.179; unit 2139 -->

9.2.5.12  MergeOECurveV10_t

<!-- Source EN PDF p.179; unit 2140 -->

【Описание】Определение автоматической кривой пересвета Merge.

<!-- Source EN PDF p.179; unit 2141 -->

【Определение】

<!-- Source EN PDF p.179; unit 2142 -->

```text
 typedef struct MergeOECurveV10_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeOECurveV10_t;
```

<!-- Source EN PDF p.179; unit 2143 -->

【Члены】

<!-- Source EN PDF p.179; unit 2144 -->

| Имя поля | Описание |
|---|---|
| EnvLv | Яркость среды, [0,1]: 0 — полная темнота, 1 — максимум. |
| Smooth | Наклон кривой пересвета, диапазон [0,1], по умолчанию 0.4, точность 0.01. |
| Offset | Смещение кривой пересвета, диапазон [108,280], по умолчанию 210, точность 0.1. |

<!-- Source EN PDF p.179; unit 2145 -->

9.2.5.13  MergeMDCurveV10_t

<!-- Source EN PDF p.179; unit 2146 -->

【Описание】Определение кривой движения режима длинного кадра.

<!-- Source EN PDF p.179; unit 2147 -->

【Определение】

<!-- Source EN PDF p.179; unit 2148 -->

```text
 typedef struct MergeMDCurveV10_s {
     float MoveCoef[MERGE_ENVLV_STEP_MAX];
     float LM_smooth[MERGE_ENVLV_STEP_MAX];
     float LM_offset[MERGE_ENVLV_STEP_MAX];
     float MS_smooth[MERGE_ENVLV_STEP_MAX];
     float MS_offset[MERGE_ENVLV_STEP_MAX];
 } MergeMDCurveV10_t;
```

<!-- Source EN PDF p.179; unit 2149 -->

【Члены】

<!-- Source EN PDF p.180; unit 2150 -->

| Имя поля | Описание |
|---|---|
| MoveCoef | Движение изображения, [0,1]: 0 — неподвижно, 1 — полное движение. |
| LM_smooth | Наклон кривой длинного/среднего кадров, [0,1], по умолчанию 0.4; не действует в HDR x2. |
| LM_offset | Смещение кривой длинного/среднего кадров, [0.26,1], по умолчанию 0.38; не действует в HDR x2. |
| MS_smooth | Наклон кривой среднего/короткого кадров, [0,1], по умолчанию 0.4. |
| MS_offset | Смещение кривой среднего/короткого кадров, [0.26,1], по умолчанию 0.38. |

<!-- Source EN PDF p.180; unit 2151 -->

9.2.5.14  MergeEachChnCurveV12_t

<!-- Source EN PDF p.180; unit 2152 -->

【Описание】Определение кривой обнаружения подканала в режиме длинного кадра.

<!-- Source EN PDF p.180; unit 2153 -->

【Определение】

<!-- Source EN PDF p.180; unit 2154 -->

```text
 typedef struct MergeEachChnCurveV12_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeEachChnCurveV12_t;
```

<!-- Source EN PDF p.180; unit 2155 -->

【Члены】

<!-- Source EN PDF p.180; unit 2156 -->

| Имя члена | Описание |
|---|---|
| EnvLv | Яркость среды, [0,1]: 0 — полная темнота, 1 — максимум. |
| Smooth | Наклон кривой пересвета подканала, [0,1], по умолчанию 0.4, точность 0.01. |
| Offset | Смещение кривой пересвета подканала, [0,1], по умолчанию 0.38, точность 0.01. |

<!-- Source EN PDF p.180; unit 2157 -->

9.2.5.15  LongFrameModeDataV12_t

<!-- Source EN PDF p.180; unit 2158 -->

【Описание】Определение управляющих параметров длинного кадра.

<!-- Source EN PDF p.180; unit 2159 -->

【Определение】

<!-- Source EN PDF p.181; unit 2160 -->

```text
 typedef struct LongFrameModeDataV12_s {
     bool                   EnableEachChn;
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV10_t      MDCurve;
     MergeEachChnCurveV12_t EachChnCurve;
     float                  OECurve_damp;
     float                  MDCurveLM_damp;
     float                  MDCurveMS_damp;
 } LongFrameModeDataV12_t;
```

<!-- Source EN PDF p.181; unit 2161 -->

【Члены】

<!-- Source EN PDF p.181; unit 2162 -->

| Имя поля | Описание |
|---|---|
| EnableEachChn | Включение обнаружения по отдельным каналам |
| OECurve | Параметры кривой пересвета |
| MDCurve | Параметры кривой движения |
| EachChnCurve | Параметры кривой обнаружения отдельных каналов |
| MDCurveLM_damp | Сглаживание кривой длинного/среднего кадров — доля параметра текущего кадра, [0,1], по умолчанию 0.9; не действует в HDR x2. |
| MDCurveMS_damp | Сглаживание кривой среднего/короткого кадров — доля параметра текущего кадра, [0,1], по умолчанию 0.9. |

<!-- Source EN PDF p.181; unit 2163 -->

9.2.5.16  MergeMDCurveV11Short_t

<!-- Source EN PDF p.181; unit 2164 -->

【Описание】Определение кривой движения короткого кадра.

<!-- Source EN PDF p.181; unit 2165 -->

【Определение】

<!-- Source EN PDF p.181; unit 2166 -->

```text
 typedef struct MergeMDCurveV11Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } MergeMDCurveV11Short_t;
```

<!-- Source EN PDF p.181; unit 2167 -->

【Члены】

<!-- Source EN PDF p.182; unit 2168 -->

| Имя поля | Описание |
|---|---|
| Coef | Управляющий коэффициент, [0,1], по умолчанию 0.05, точность 0.0001. |
| ms_thd0 | Коэффициент среднего/короткого кадров, [0,1], по умолчанию 0.0, точность 0.1. |
| lm_thd0 | Коэффициент длинного/среднего кадров, [0,1], по умолчанию 0.0, точность 0.1. |

<!-- Source EN PDF p.182; unit 2169 -->

9.2.5.17  ShortFrameModeData_t

<!-- Source EN PDF p.182; unit 2170 -->

【Описание】Определение управляющих параметров короткого кадра.

<!-- Source EN PDF p.182; unit 2171 -->

【Определение】

<!-- Source EN PDF p.182; unit 2172 -->

```text
 typedef struct ShortFrameModeData_s {
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV11Short_t MDCurve;
     float                  OECurve_damp;
     float                  MDCurve_damp;
 } ShortFrameModeData_t;
```

<!-- Source EN PDF p.182; unit 2173 -->

【Члены】

<!-- Source EN PDF p.182; unit 2174 -->

| Имя поля | Описание |
|---|---|
| OECurve | Параметры кривой пересвета |
| MDCurve | Параметры кривой движения |
| OECurve_damp | Сглаживание кривой пересвета — доля параметра текущего кадра, [0,1], по умолчанию 0.9. |
| MDCurve_damp | Сглаживание кривой движения — доля параметра текущего кадра, [0,1], по умолчанию 0.9. |

<!-- Source EN PDF p.182; unit 2175 -->

9.2.5.18  CalibDbV2_merge_V12_t

<!-- Source EN PDF p.182; unit 2176 -->

【Описание】Определение автоматических атрибутов merge.

<!-- Source EN PDF p.182; unit 2177 -->

【Определение】

<!-- Source EN PDF p.183; unit 2178 -->

```text
 typedef struct CalibDbV2_merge_V12_s {
     MergeBaseFrame_t       BaseFrm;
     float                  ByPassThr;
     LongFrameModeDataV12_t LongFrmModeData;
     ShortFrameModeData_t   ShortFrmModeData;
 } CalibDbV2_merge_V12_t;
```

<!-- Source EN PDF p.183; unit 2179 -->

【Члены】

<!-- Source EN PDF p.183; unit 2180 -->

| Имя члена | Описание |
|---|---|
| BaseFrm | Опорный кадр объединения |
| ByPassThr | Порог обхода модуля, [0,1]. Если процентное различие яркости среды текущего и предыдущего кадров меньше ByPassThr, параметры не обновляются. |
| LongFrmModeData | Управляющие данные при длинном опорном кадре (в исходнике повтор data). |

<!-- Source EN PDF p.183; unit 2181 -->

9.2.5.19  MergeCurrCtlData_t

<!-- Source EN PDF p.183; unit 2182 -->

【Описание】Настройка merge RK3588.

<!-- Source EN PDF p.183; unit 2183 -->

【Определение】

<!-- Source EN PDF p.183; unit 2184 -->

```text
 typedef struct mergeAttrV30_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV30_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV30_t;
```

<!-- Source EN PDF p.183; unit 2185 -->

【Члены】

<!-- Source EN PDF p.183; unit 2186 -->

| Имя члена | Описание |
|---|---|
| opMode | Выбор режима |
| stManual | Ручные атрибуты merge |
| CtlInfo | Параметры управляющих величин |

<!-- Source EN PDF p.183; unit 2187 -->

9.2.5.20  mergeAttr_t

<!-- Source EN PDF p.183; unit 2188 -->

【Описание】Конфигурация атрибутов merge.

<!-- Source EN PDF p.183; unit 2189 -->

【Определение】

<!-- Source EN PDF p.184; unit 2190 -->

```text
 typedef struct mergeAttr_s {
     rk_aiq_uapi_sync_t  sync;
     mergeAttrV21_t      attrV21;
     mergeAttrV30_t      attrV30;
 } mergeAttr_t;
```

<!-- Source EN PDF p.184; unit 2191 -->

【Члены】

<!-- Source EN PDF p.184; unit 2192 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| attrV21 | Атрибуты merge RK356x не действуют на RK3588. |
| attrV30 | Атрибуты merge RK3588 не действуют на RK356x. |

<!-- Source EN PDF p.184; unit 2193 -->

### 9.3   DRC

<!-- Source EN PDF p.184; unit 2194 -->

#### 9.3.1 Описание функций

<!-- Source EN PDF p.184; unit 2195 -->

DRC (сжатие высокого динамического диапазона) переводит изображение большей разрядности в меньшую.

<!-- Source EN PDF p.184; unit 2196 -->

#### 9.3.2 Основные понятия

<!-- Source EN PDF p.184; unit 2197 -->

DRC применяется в линейном режиме и HDR.

<!-- Source EN PDF p.184; unit 2198 -->

#### 9.3.3 Справочник функционального API

<!-- Source EN PDF p.184; unit 2199 -->

9.3.3.1  rk_aiq_uapi2_setDrcGain

<!-- Source EN PDF p.184; unit 2200 -->

【Описание】

<!-- Source EN PDF p.184; unit 2201 -->

Быстрая установка параметров кривой DrcGain.

<!-- Source EN PDF p.184; unit 2202 -->

【Синтаксис】

<!-- Source EN PDF p.184; unit 2203 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

При этом API работает в DRC_OPMODE_DRC_GAIN. Параметры вызова сохраняются в stDrcGain, определяющем три параметра кривой DrcGain; остальные параметры DRC по-прежнему берутся из модуля DRC в JSON.

<!-- Source EN PDF p.184; unit 2204 -->

【Параметры】

<!-- Source EN PDF p.185; unit 2205 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| Gain | Диапазон Gain: [1,8]. | Вход |
| alpha | Диапазон Alpha: [0,1]. | Вход |
| Clip | Диапазон Clip: [0,64]. | Вход |

<!-- Source EN PDF p.185; unit 2206 -->

【Возвращаемое значение】

<!-- Source EN PDF p.185; unit 2207 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.185; unit 2208 -->

【Зависимости】

<!-- Source EN PDF p.185; unit 2209 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.185; unit 2210 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.185; unit 2211 -->

9.3.3.2  rk_aiq_uapi2_getDrcGain

<!-- Source EN PDF p.185; unit 2212 -->

【Описание】

<!-- Source EN PDF p.185; unit 2213 -->

Получение параметров быстрой кривой DrcGain.

<!-- Source EN PDF p.185; unit 2214 -->

API возвращает параметры stDrcGain; они являются реально используемыми только в режиме DRC_OPMODE_DRC_GAIN.

<!-- Source EN PDF p.185; unit 2215 -->

【Синтаксис】

<!-- Source EN PDF p.185; unit 2216 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

<!-- Source EN PDF p.185; unit 2217 -->

【Параметры】

<!-- Source EN PDF p.186; unit 2218 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| Gain | Диапазон Gain: [1,8]. | Выход |
| alpha | Диапазон Alpha: [0,1]. | Выход |
| Clip | Диапазон Clip: [0,64]. | Выход |

<!-- Source EN PDF p.186; unit 2219 -->

【Возвращаемое значение】

<!-- Source EN PDF p.186; unit 2220 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.186; unit 2221 -->

【Зависимости】

<!-- Source EN PDF p.186; unit 2222 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.186; unit 2223 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.186; unit 2224 -->

9.3.3.3  rk_aiq_uapi2_setDrcHiLit

<!-- Source EN PDF p.186; unit 2225 -->

【Описание】

<!-- Source EN PDF p.186; unit 2226 -->

Быстрая установка DrcHiLit.

<!-- Source EN PDF p.186; unit 2227 -->

В режиме DRC_OPMODE_HILIT параметры вызова сохраняются в stHiLit и определяют HiLight; остальные параметры DRC по-прежнему берутся из JSON.

<!-- Source EN PDF p.186; unit 2228 -->

【Синтаксис】

<!-- Source EN PDF p.186; unit 2229 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.186; unit 2230 -->

【Параметры】

<!-- Source EN PDF p.186; unit 2231 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| Strength | Диапазон Intensity: [0,1]. | Вход |

<!-- Source EN PDF p.186; unit 2232 -->

【Возвращаемое значение】

<!-- Source EN PDF p.187; unit 2233 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.187; unit 2234 -->

【Зависимости】

<!-- Source EN PDF p.187; unit 2235 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2236 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.187; unit 2237 -->

9.3.3.4  rk_aiq_uapi2_getDrcHiLit

<!-- Source EN PDF p.187; unit 2238 -->

【Описание】

<!-- Source EN PDF p.187; unit 2239 -->

Получение параметров быстрой настройки DrcHiLit.

<!-- Source EN PDF p.187; unit 2240 -->

API получает параметры stHiLit; они реально используются только в DRC_OPMODE_HILIT.

<!-- Source EN PDF p.187; unit 2241 -->

【Синтаксис】

<!-- Source EN PDF p.187; unit 2242 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.187; unit 2243 -->

【Параметры】

<!-- Source EN PDF p.187; unit 2244 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| Strength | Диапазон Intensity: [0,1]. | Выход |

<!-- Source EN PDF p.187; unit 2245 -->

【Возвращаемое значение】

<!-- Source EN PDF p.187; unit 2246 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.187; unit 2247 -->

【Зависимости】

<!-- Source EN PDF p.187; unit 2248 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2249 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.187; unit 2250 -->

9.3.3.5  rk_aiq_uapi2_setDrcLocalData

<!-- Source EN PDF p.187; unit 2251 -->

【Описание】

<!-- Source EN PDF p.187; unit 2252 -->

Быстрая установка DrcLocalData.

<!-- Source EN PDF p.188; unit 2253 -->

В DRC_OPMODE_LOCAL_TMO параметры сохраняются в stLocalDataV30 и определяют LocalData; остальные параметры DRC берутся из JSON.

<!-- Source EN PDF p.188; unit 2254 -->

【Синтаксис】

<!-- Source EN PDF p.188; unit 2255 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float
 LocalWeit, float GlobalContrast, float LoLitContrast，int LocalAutoEnable, float
 LocalAutoWeit);
```

<!-- Source EN PDF p.188; unit 2256 -->

【Параметры】

<!-- Source EN PDF p.188; unit 2257 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| LocalWeit | Диапазон LocalWeit: [0,1]. | Вход |
| GlobalContrast | Диапазон GlobalContrast: [0,1]. | Вход |
| LoLitContrast | Диапазон LoLitContrast: [0,1]. | Вход |
| LocalAutoEnable | Переключатель автоматического Local, диапазон [0,1]. | Вход |
| LocalAutoWeit | Диапазон автоматического LocalWeit: [0,1]. | Вход |

<!-- Source EN PDF p.188; unit 2258 -->

【Возвращаемое значение】

<!-- Source EN PDF p.188; unit 2259 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.188; unit 2260 -->

【Зависимости】

<!-- Source EN PDF p.188; unit 2261 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.188; unit 2262 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.188; unit 2263 -->

9.3.3.6  rk_aiq_uapi2_getDrcLocalData

<!-- Source EN PDF p.188; unit 2264 -->

【Описание】

<!-- Source EN PDF p.188; unit 2265 -->

Получение параметров DrcLocalData.

<!-- Source EN PDF p.188; unit 2266 -->

API получает LocalData из stLocalDataV30; они применяются только в DRC_OPMODE_LOCAL_TMO.

<!-- Source EN PDF p.189; unit 2267 -->

【Синтаксис】

<!-- Source EN PDF p.189; unit 2268 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float*
 LocalWeit, float* GlobalContrast, float* LoLitContrast，int* LocalAutoEnable,
 float* LocalAutoWeit);
```

<!-- Source EN PDF p.189; unit 2269 -->

【Параметры】

<!-- Source EN PDF p.189; unit 2270 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| LocalWeit | Диапазон LocalWeit: [0,1]. | Выход |
| GlobalContrast | Диапазон GlobalContrast: [0,1]. | Выход |
| LoLitContrast | Диапазон LoLitContrast: [0,1]. | Выход |
| ocalAutoEnable | Переключатель автоматического Local, диапазон [0,1]. | Выход |
| LocalAutoWeit | Диапазон автоматического LocalWeit: [0,1]. | Выход |

<!-- Source EN PDF p.189; unit 2271 -->

【Возвращаемое значение】

<!-- Source EN PDF p.189; unit 2272 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.189; unit 2273 -->

【Зависимости】

<!-- Source EN PDF p.189; unit 2274 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.189; unit 2275 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.189; unit 2276 -->

#### 9.3.4 Справочник модульного API

<!-- Source EN PDF p.189; unit 2277 -->

9.3.4.1  rk_aiq_user_api2_adrc_SetAttrib

<!-- Source EN PDF p.189; unit 2278 -->

【Описание】Установка программных атрибутов DRC.

<!-- Source EN PDF p.189; unit 2279 -->

【Синтаксис】

<!-- Source EN PDF p.189; unit 2280 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_SetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t attr);
```

<!-- Source EN PDF p.190; unit 2281 -->

【Параметры】

<!-- Source EN PDF p.190; unit 2282 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных атрибутов DRC | Вход |

<!-- Source EN PDF p.190; unit 2283 -->

【Возвращаемое значение】

<!-- Source EN PDF p.190; unit 2284 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.190; unit 2285 -->

【Зависимости】

<!-- Source EN PDF p.190; unit 2286 -->

Заголовочный файл: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.190; unit 2287 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.190; unit 2288 -->

【Описание】

<!-- Source EN PDF p.190; unit 2289 -->

9.3.4.2  rk_aiq_user_api2_adrc_GetAttrib

<!-- Source EN PDF p.190; unit 2290 -->

【Описание】Получение программных атрибутов DRC.

<!-- Source EN PDF p.190; unit 2291 -->

【Синтаксис】

<!-- Source EN PDF p.190; unit 2292 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_GetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t* attr);
```

<!-- Source EN PDF p.190; unit 2293 -->

【Параметры】

<!-- Source EN PDF p.190; unit 2294 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных атрибутов DRC | Выход |

<!-- Source EN PDF p.190; unit 2295 -->

【Возвращаемое значение】

<!-- Source EN PDF p.190; unit 2296 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.190; unit 2297 -->

【Зависимости】

<!-- Source EN PDF p.190; unit 2298 -->

Заголовочный файл: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.191; unit 2299 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.191; unit 2300 -->

【Описание】

<!-- Source EN PDF p.191; unit 2301 -->

#### 9.3.5 Типы данных модульного API

<!-- Source EN PDF p.191; unit 2302 -->

9.3.5.1  AdrcVersion_t

<!-- Source EN PDF p.191; unit 2303 -->

【Описание】Определение версии DRC.

<!-- Source EN PDF p.191; unit 2304 -->

【Определение】

<!-- Source EN PDF p.191; unit 2305 -->

```text
 typedef enum AdrcVersion_e {
     ADRC_VERSION_356X = 0,
     ADRC_VERSION_3588 = 1,
     ADRC_VERSION_MAX
 } AdrcVersion_t;
```

<!-- Source EN PDF p.191; unit 2306 -->

【Члены】

<!-- Source EN PDF p.191; unit 2307 -->

| Имя члена | Описание |
|---|---|
| ADRC_VERSION_356X | RK356x |
| ADRC_VERSION_3588 | RK3588 |
| ADRC_VERSION_MAX | Максимальный режим версии |

<!-- Source EN PDF p.191; unit 2308 -->

9.3.5.2  drc_OpMode_t

<!-- Source EN PDF p.191; unit 2309 -->

【Описание】Определение режима DRC.

<!-- Source EN PDF p.191; unit 2310 -->

【Определение】

<!-- Source EN PDF p.191; unit 2311 -->

```text
 typedef enum drc_OpMode_e {
     DRC_OPMODE_API_OFF   = 0,
     DRC_OPMODE_MANU      = 1,
     DRC_OPMODE_DRC_GAIN  = 2,
     DRC_OPMODE_HILIT     = 3,
     DRC_OPMODE_LOCAL_TMO = 4,
 } drc_OpMode_t;
```

<!-- Source EN PDF p.191; unit 2312 -->

【Члены】

<!-- Source EN PDF p.192; unit 2313 -->

| Имя члена | Описание |
|---|---|
| DRC_OPMODE_API_OFF | Автоматический режим: все параметры Drc определяются JSON. |
| DRC_OPMODE_MANU | Ручной режим: все параметры Drc задаёт stManualV30. |
| DRC_OPMODE_DRC_GAIN | DrcGain: соответствующие параметры задаёт stDrcGain, остальные берутся из JSON. |
| DRC_OPMODE_HILIT | HiLit: параметры HiLight задаёт stHiLit, остальные берутся из JSON. |
| DRC_OPMODE_LOCAL_TMO | LocalTMO: параметры LocalData задаёт stLocalDataV30, остальные берутся из JSON. |

<!-- Source EN PDF p.192; unit 2314 -->

9.3.5.3  mDrcGain_t

<!-- Source EN PDF p.192; unit 2315 -->

【Описание】Определение ручного DrcGain.

<!-- Source EN PDF p.192; unit 2316 -->

【Определение】

<!-- Source EN PDF p.192; unit 2317 -->

```text
 typedef struct mDrcGain_s {
     float DrcGain;
     float Alpha;
     float Clip;
 } mDrcGain_t;
```

<!-- Source EN PDF p.192; unit 2318 -->

【Члены】

<!-- Source EN PDF p.192; unit 2319 -->

| Имя члена | Описание |
|---|---|
| DrcGain | Ручной DrcGain, [1,8], по умолчанию 1, точность 0.01. |
| alpha | Ручной alpha, [0,1], по умолчанию 0.2, точность 0.01. |
| Clip | Ручной Clip, [0,64], по умолчанию 16, точность 0.01. |

<!-- Source EN PDF p.192; unit 2320 -->

9.3.5.4  mDrcHiLit_t

<!-- Source EN PDF p.192; unit 2321 -->

【Описание】Определение ручного Drc HiLit.

<!-- Source EN PDF p.192; unit 2322 -->

【Определение】

<!-- Source EN PDF p.193; unit 2323 -->

```text
 typedef struct mDrcHiLit_s {
     float Strength;
 } mDrcHiLit_t;
```

<!-- Source EN PDF p.193; unit 2324 -->

【Члены】

<!-- Source EN PDF p.193; unit 2325 -->

| Имя члена | Описание |
|---|---|
| Strength | Ручной Strength, [0,1], по умолчанию 0, точность 0.01. |

<!-- Source EN PDF p.193; unit 2326 -->

9.3.5.5  mLocalDataV21_t

<!-- Source EN PDF p.193; unit 2327 -->

【Описание】Определение DRC Local RK356x.

<!-- Source EN PDF p.193; unit 2328 -->

【Определение】

<!-- Source EN PDF p.193; unit 2329 -->

```text
 typedef struct mLocalDataV21_s {
     float LocalWeit;
     float GlobalContrast;
     float LoLitContrast;
 } mLocalDataV21_t;
```

<!-- Source EN PDF p.193; unit 2330 -->

【Члены】

<!-- Source EN PDF p.193; unit 2331 -->

| Имя члена | Описание |
|---|---|
| LocalWeit | Ручной LocalWeit, исходный диапазон 0,1, по умолчанию 1, точность 0.01. |
| GlobalContrast | Ручной GlobalContrast, исходный диапазон 0,1, по умолчанию 0, точность 0.01. |
| LoLitContrast | Ручной LoLitContrast, исходный диапазон 0,1, по умолчанию 0, точность 0.01. |

<!-- Source EN PDF p.193; unit 2332 -->

9.3.5.6  mLocalDataV30_t

<!-- Source EN PDF p.193; unit 2333 -->

【Описание】Определение DRC Local RK356x.

<!-- Source EN PDF p.193; unit 2334 -->

【Определение】

<!-- Source EN PDF p.194; unit 2335 -->

```text
 typedef struct mLocalDataV30_s {
     float         LocalWeit;
     int           LocalAutoEnable;
     float         LocalAutoWeit;
     float         GlobalContrast;
     float         LoLitContrast;
 } mLocalDataV30_t;
```

<!-- Source EN PDF p.194; unit 2336 -->

【Члены】

<!-- Source EN PDF p.194; unit 2337 -->

| Имя члена | Описание |
|---|---|
| LocalWeit | Ручной LocalWeit, [0,1], по умолчанию 1, точность 0.01. |
| LocalAutoEnable | Переключатель автоматического LocalWeit, [0,1], по умолчанию 1, точность 1. |
| LocalAutoWeit | Автоматический LocalWeit, [0,1], по умолчанию 0.4, точность 0.01. |
| GlobalContrast | Ручной GlobalContrast, [0,1], по умолчанию 0, точность 0.01. |
| LoLitContrast | Ручной LoLitContrast, [0,1], по умолчанию 0, точность 0.01. |

<!-- Source EN PDF p.194; unit 2338 -->

9.3.5.7  mDrcLocalV21_t

<!-- Source EN PDF p.194; unit 2339 -->

【Описание】Определение DRC Local RK356x.

<!-- Source EN PDF p.194; unit 2340 -->

【Определение】

<!-- Source EN PDF p.194; unit 2341 -->

```text
 typedef struct mDrcLocalV21_s {
     mLocalDataV21_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV21_t;
```

<!-- Source EN PDF p.194; unit 2342 -->

【Члены】

<!-- Source EN PDF p.195; unit 2343 -->

| Имя члена | Описание |
|---|---|
| LocalData | Ручная настройка LocalData (фраза исходника незавершена). |
| curPixWeit | Билатеральный вес текущей точки, [0,1], по умолчанию 0.37, точность 0.001. |
| preFrameWeit | Билатеральный вес предыдущего кадра, [0,1], по умолчанию 0.8, точность 0.001. |
| Range_force_sgm | Обратная sigma диапазона значений билатерального фильтра, [0,1], по умолчанию 0, точность 0.0001. |
| Range_sgm_cur | Обратная пространственная sigma предыдущего кадра, исходный диапазон 0,1, по умолчанию 0.2, точность 0.0001. |
| Range_sgm_pre | Обратная пространственная sigma предыдущего кадра, [0,1], по умолчанию 0.2, точность 0.0001. |
| Space_sgm_cur | Обратная величина диапазона значений текущего кадра, [0,4095], по умолчанию 4068, точность 1. |
| Space_sgm_pre | Обратная sigma диапазона значений предыдущего кадра, [0,4095], по умолчанию 3068, точность 1. |

<!-- Source EN PDF p.195; unit 2344 -->

9.3.5.8  mDrcLocalV30_t

<!-- Source EN PDF p.195; unit 2345 -->

【Описание】Определение DRC Local RK3588.

<!-- Source EN PDF p.195; unit 2346 -->

【Определение】

<!-- Source EN PDF p.195; unit 2347 -->

```text
 typedef struct mDrcLocalV30_s {
     mLocalDataV30_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV30_t;
```

<!-- Source EN PDF p.195; unit 2348 -->

【Члены】

<!-- Source EN PDF p.196; unit 2349 -->

| Имя члена | Описание |
|---|---|
| LocalData | Ручная настройка LocalData |
| curPixWeit | Билатеральный вес текущей точки, [0,1], по умолчанию 0.37, точность 0.001. |
| preFrameWeit | Билатеральный вес предыдущего кадра, [0,1], по умолчанию 0.8, точность 0.001. |
| Range_force_sgm | Обратная sigma диапазона значений, [0,1], по умолчанию 0, точность 0.0001. |
| Range_sgm_cur | Обратная пространственная sigma предыдущего кадра, [0,1], по умолчанию 0.2, точность 0.0001. |
| Range_sgm_pre | Обратная пространственная sigma предыдущего кадра, [0,1], по умолчанию 0.2, точность 0.0001. |
| Space_sgm_cur | Обратная sigma диапазона значений текущего кадра, [0,4095], по умолчанию 4068, точность 1. |
| Space_sgm_pre | Обратная sigma диапазона значений предыдущего кадра, [0,4095], по умолчанию 3068, точность 1. |

<!-- Source EN PDF p.196; unit 2350 -->

9.3.5.9  CompressMode_t

<!-- Source EN PDF p.196; unit 2351 -->

【Описание】Определение режима кривой DrcCompress при ручном управлении.

<!-- Source EN PDF p.196; unit 2352 -->

【Определение】

<!-- Source EN PDF p.196; unit 2353 -->

```text
 typedef enum CompressMode_s {
     COMPRESS_AUTO   = 0,
     COMPRESS_MANUAL = 1,
 } CompressMode_t;
```

<!-- Source EN PDF p.196; unit 2354 -->

【Члены】

<!-- Source EN PDF p.196; unit 2355 -->

| Имя члена | Описание |
|---|---|
| COMPRESS_AUTO | Ручной режим, автоматическая кривая Compress. |
| COMPRESS_MANUAL | Ручной режим, ручная кривая Compress. |

<!-- Source EN PDF p.196; unit 2356 -->

9.3.5.10  mDrcCompress_t

<!-- Source EN PDF p.196; unit 2357 -->

【Описание】Определение ручного DrcCompress.

<!-- Source EN PDF p.196; unit 2358 -->

【Определение】

<!-- Source EN PDF p.197; unit 2359 -->

```text
 typedef struct mDrcCompress_s {
     CompressMode_t Mode;
     uint16_t       Manual_curve[17];
 } mDrcCompress_t;
```

<!-- Source EN PDF p.197; unit 2360 -->

【Члены】

<!-- Source EN PDF p.197; unit 2361 -->

| Имя члена | Описание |
|---|---|
| Mode | Включение функции |
| Manual_curve | Ручная кривая Compress в ручном режиме. |

<!-- Source EN PDF p.197; unit 2362 -->

9.3.5.11  mdrcAttr_V21_t

<!-- Source EN PDF p.197; unit 2363 -->

【Описание】Определение ручного DRC RK356x.

<!-- Source EN PDF p.197; unit 2364 -->

【Определение】

<!-- Source EN PDF p.197; unit 2365 -->

```text
 typedef struct mdrcAttr_V21_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV21_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V21_t;
```

<!-- Source EN PDF p.197; unit 2366 -->

【Члены】

<!-- Source EN PDF p.198; unit 2367 -->

| Имя члена | Описание |
|---|---|
| Enable | Включение ручного DRC |
| DrcGain | Ручные настройки DrcGain |
| HiLight | Ручные настройки HiLit |
| LocalSetting | Ручные настройки Local |
| CompressSetting | Настройка кривой сжатия |
| Scale_y | Таблица масштаба коррекции усиления, [0,2048], точность 1. |
| Edge_Weit | Масштаб отклика границ, [0,1], по умолчанию 0.02, точность 0.01; уменьшает артефакты контрастных границ. |
| OutPutLongFrame | Вывод только длинного кадра: 0 — выключено, 1 — включено. |
| IIR_frame | Количество кадров фильтра IIR, [1,1000], по умолчанию 2. |

<!-- Source EN PDF p.198; unit 2368 -->

9.3.5.12  mdrcAttr_V30_t

<!-- Source EN PDF p.198; unit 2369 -->

【Описание】Определение ручного DRC RK3588.

<!-- Source EN PDF p.198; unit 2370 -->

【Определение】

<!-- Source EN PDF p.198; unit 2371 -->

```text
 typedef struct mdrcAttr_V30_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV30_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V30_t;
```

<!-- Source EN PDF p.198; unit 2372 -->

【Члены】

<!-- Source EN PDF p.199; unit 2373 -->

| Имя члена | Описание |
|---|---|
| Enable | Включение ручного DRC |
| DrcGain | Ручные настройки DrcGain |
| HiLight | Ручные настройки HiLit |
| LocalSetting | Ручные настройки Local |
| CompressSetting | Настройка кривой сжатия |
| Scale_y | Таблица масштаба коррекции усиления, [0,2048], точность 1. |
| Edge_Weit | Масштаб отклика границ, [0,1], по умолчанию 0.02, точность 0.01; уменьшает артефакты контрастных границ. |
| OutPutLongFrame | Вывод только длинного кадра: 0 — выключено, 1 — включено. |
| IIR_frame | Количество кадров фильтра IIR, [1,1000], по умолчанию 2. |

<!-- Source EN PDF p.199; unit 2374 -->

9.3.5.13  DrcInfo_t

<!-- Source EN PDF p.199; unit 2375 -->

【Описание】Определение управляющих параметров DRC.

<!-- Source EN PDF p.199; unit 2376 -->

【Определение】

<!-- Source EN PDF p.199; unit 2377 -->

```text
 typedef struct DrcInfo_s {
     float EnvLv;
     float ISO;
 } DrcInfo_t;
```

<!-- Source EN PDF p.199; unit 2378 -->

【Члены】

<!-- Source EN PDF p.199; unit 2379 -->

| Имя члена | Описание |
|---|---|
| EnvLv | Текущая яркость среды |
| ISO | Текущее ISO |

<!-- Source EN PDF p.199; unit 2380 -->

9.3.5.14  drcAttr_t

<!-- Source EN PDF p.199; unit 2381 -->

【Описание】Определение атрибутов DRC.

<!-- Source EN PDF p.199; unit 2382 -->

【Определение】

<!-- Source EN PDF p.200; unit 2383 -->

```text
 typedef struct drcAttr_s {
     rk_aiq_uapi_sync_t sync;
     AdrcVersion_t      Version;
     drc_OpMode_t       opMode;
     mdrcAttr_V21_t     stManualV21;
     mdrcAttr_V30_t     stManualV30;
     mDrcGain_t         stDrcGain;
     mDrcHiLit_t        stHiLit;
     mLocalDataV21_t    stLocalDataV21;
     mLocalDataV30_t    stLocalDataV30;
     DrcInfo_t          Info;
 } drcAttr_t;
```

<!-- Source EN PDF p.200; unit 2384 -->

【Члены】

<!-- Source EN PDF p.200; unit 2385 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| Версия | Сведения о версии |
| opMode | Режим API |
| stManualV21 | Ручные атрибуты DRC RK356x; действуют при opMode = DRC_OPMODE_MANU. |
| stManualV30 | Ручные атрибуты DRC RK3588; параметры действуют при opMode = DRC_OPMODE_MANU. |
| stDrcGain | Атрибут DrcGain, действует при opMode = DRC_OPMODE_DRC_GAIN. |
| stHiLit | Атрибут Hillitt действует при Optmod = Dirk_Optmod_Hillit; написание идентификаторов сохранено из оригинала. |
| stLocalDataV21 | Атрибут LocalData RK356x, действует при opMode = DRC_OPMODE_LOCAL_TMO. |
| stLocalDataV30 | Атрибут LocalData RK3588, действует при opMode = DRC_OPMODE_LOCAL_TMO. |
| Info | Информация управляющих параметров |

<!-- Source EN PDF p.200; unit 2386 -->

### 9.4 Подавление шума

<!-- Source EN PDF p.200; unit 2387 -->

#### 9.4.1 Описание функции

<!-- Source EN PDF p.200; unit 2388 -->

Шум изображения — ненужные или нежелательные помехи в данных изображения. Шумоподавление уменьшает шум цифрового изображения.

<!-- Source EN PDF p.201; unit 2389 -->

#### 9.4.2 API функционального уровня

<!-- Source EN PDF p.201; unit 2390 -->

9.4.2.1  rk_aiq_uapi2_setNRMode

<!-- Source EN PDF p.201; unit 2391 -->

【Описание】Установить режим шумоподавления.

<!-- Source EN PDF p.201; unit 2392 -->

【Синтаксис】

<!-- Source EN PDF p.201; unit 2393 -->

```text
 XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.201; unit 2394 -->

【Параметры】

<!-- Source EN PDF p.201; unit 2395 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы | Вход |

<!-- Source EN PDF p.201; unit 2396 -->

【Возвращаемое значение】

<!-- Source EN PDF p.201; unit 2397 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.201; unit 2398 -->

【Зависимости】

<!-- Source EN PDF p.201; unit 2399 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.201; unit 2400 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.201; unit 2401 -->

9.4.2.2  rk_aiq_uapi2_getNRMode

<!-- Source EN PDF p.201; unit 2402 -->

【Описание】Получить текущий режим шумоподавления.

<!-- Source EN PDF p.201; unit 2403 -->

【Синтаксис】

<!-- Source EN PDF p.201; unit 2404 -->

```text
 XCamReturn rk_aiq_uapi2_getNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t* mode);
```

<!-- Source EN PDF p.201; unit 2405 -->

【Параметры】

<!-- Source EN PDF p.201; unit 2406 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы | Выход |

<!-- Source EN PDF p.201; unit 2407 -->

【Возвращаемое значение】

<!-- Source EN PDF p.202; unit 2408 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.202; unit 2409 -->

【Зависимости】

<!-- Source EN PDF p.202; unit 2410 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2411 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.202; unit 2412 -->

9.4.2.3  rk_aiq_uapi2_setANRStrth

<!-- Source EN PDF p.202; unit 2413 -->

【Описание】Установить обычную интенсивность шумоподавления.

<!-- Source EN PDF p.202; unit 2414 -->

【Синтаксис】

<!-- Source EN PDF p.202; unit 2415 -->

```text
 XCamReturn rk_aiq_uapi2_setANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.202; unit 2416 -->

【Параметры】

<!-- Source EN PDF p.202; unit 2417 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Вход |

<!-- Source EN PDF p.202; unit 2418 -->

【Возвращаемое значение】

<!-- Source EN PDF p.202; unit 2419 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.202; unit 2420 -->

【Зависимости】

<!-- Source EN PDF p.202; unit 2421 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2422 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.202; unit 2423 -->

9.4.2.4  rk_aiq_uapi2_getANRStrth

<!-- Source EN PDF p.202; unit 2424 -->

【Описание】Получить обычную интенсивность шумоподавления.

<!-- Source EN PDF p.202; unit 2425 -->

【Синтаксис】

<!-- Source EN PDF p.202; unit 2426 -->

```text
 XCamReturn rk_aiq_uapi2_getANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.202; unit 2427 -->

【Параметры】

<!-- Source EN PDF p.203; unit 2428 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Выход |

<!-- Source EN PDF p.203; unit 2429 -->

【Возвращаемое значение】

<!-- Source EN PDF p.203; unit 2430 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.203; unit 2431 -->

【Зависимости】

<!-- Source EN PDF p.203; unit 2432 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2433 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.203; unit 2434 -->

9.4.2.5  rk_aiq_uapi2_setMSpaNRStrth

<!-- Source EN PDF p.203; unit 2435 -->

【Описание】Установить интенсивность пространственного шумоподавления.

<!-- Source EN PDF p.203; unit 2436 -->

【Синтаксис】

<!-- Source EN PDF p.203; unit 2437 -->

```text
 XCamReturn rk_aiq_uapi2_setMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.203; unit 2438 -->

【Параметры】

<!-- Source EN PDF p.203; unit 2439 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Вход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Вход |

<!-- Source EN PDF p.203; unit 2440 -->

【Возвращаемое значение】

<!-- Source EN PDF p.203; unit 2441 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.203; unit 2442 -->

【Зависимости】

<!-- Source EN PDF p.203; unit 2443 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2444 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.204; unit 2445 -->

9.4.2.6  rk_aiq_uapi2_getMSpaNRStrth

<!-- Source EN PDF p.204; unit 2446 -->

【Описание】Получить интенсивность пространственного шумоподавления.

<!-- Source EN PDF p.204; unit 2447 -->

【Синтаксис】

<!-- Source EN PDF p.204; unit 2448 -->

```text
 XCamReturn rk_aiq_uapi2_getMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on,
 unsigned int *level);
```

<!-- Source EN PDF p.204; unit 2449 -->

【Параметры】

<!-- Source EN PDF p.204; unit 2450 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Выход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Выход |

<!-- Source EN PDF p.204; unit 2451 -->

【Возвращаемое значение】

<!-- Source EN PDF p.204; unit 2452 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.204; unit 2453 -->

【Зависимости】

<!-- Source EN PDF p.204; unit 2454 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.204; unit 2455 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.204; unit 2456 -->

9.4.2.7  rk_aiq_uapi2_setMTNRStrth

<!-- Source EN PDF p.204; unit 2457 -->

【Описание】Установить интенсивность временного шумоподавления.

<!-- Source EN PDF p.204; unit 2458 -->

【Синтаксис】

<!-- Source EN PDF p.204; unit 2459 -->

```text
 XCamReturn rk_aiq_uapi2_setMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.204; unit 2460 -->

【Параметры】

<!-- Source EN PDF p.204; unit 2461 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Вход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Вход |

<!-- Source EN PDF p.204; unit 2462 -->

【Возвращаемое значение】

<!-- Source EN PDF p.205; unit 2463 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.205; unit 2464 -->

【Зависимости】

<!-- Source EN PDF p.205; unit 2465 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2466 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.205; unit 2467 -->

9.4.2.8  rk_aiq_uapi2_getMTNRStrth

<!-- Source EN PDF p.205; unit 2468 -->

【Описание】Получить интенсивность временного шумоподавления.

<!-- Source EN PDF p.205; unit 2469 -->

【Синтаксис】

<!-- Source EN PDF p.205; unit 2470 -->

```text
 XCamReturn rk_aiq_uapi2_getMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on，
 unsigned int *level);
```

<!-- Source EN PDF p.205; unit 2471 -->

【Параметры】

<!-- Source EN PDF p.205; unit 2472 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Переключатель | Выход |
| level | Интенсивность шумоподавления, диапазон 0.0–100.0, по умолчанию 50. | Выход |

<!-- Source EN PDF p.205; unit 2473 -->

【Возвращаемое значение】

<!-- Source EN PDF p.205; unit 2474 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.205; unit 2475 -->

【Зависимости】

<!-- Source EN PDF p.205; unit 2476 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2477 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.206; unit 2478 -->

#### 9.4.3 API уровня модуля

<!-- Source EN PDF p.206; unit 2479 -->

9.4.3.1  rk_aiq_user_api2_abayer2dnrV2_SetAttrib

<!-- Source EN PDF p.206; unit 2480 -->

【Описание】Установить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.206; unit 2481 -->

【Синтаксис】

<!-- Source EN PDF p.206; unit 2482 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2483 -->

【Параметры】

<!-- Source EN PDF p.206; unit 2484 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.206; unit 2485 -->

【Возвращаемое значение】

<!-- Source EN PDF p.206; unit 2486 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.206; unit 2487 -->

【Зависимости】

<!-- Source EN PDF p.206; unit 2488 -->

Заголовочные файлы: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.206; unit 2489 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.206; unit 2490 -->

9.4.3.2  rk_aiq_user_api2_abayer2dnrV2_GetAttrib

<!-- Source EN PDF p.206; unit 2491 -->

【Описание】Получить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.206; unit 2492 -->

【Синтаксис】

<!-- Source EN PDF p.206; unit 2493 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2494 -->

【Параметры】

<!-- Source EN PDF p.207; unit 2495 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.207; unit 2496 -->

【Возвращаемое значение】

<!-- Source EN PDF p.207; unit 2497 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.207; unit 2498 -->

【Зависимости】

<!-- Source EN PDF p.207; unit 2499 -->

Заголовочные файлы: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.207; unit 2500 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.207; unit 2501 -->

9.4.3.3  rk_aiq_user_api2_abayer2dnrV2_SetStrength

<!-- Source EN PDF p.207; unit 2502 -->

【Описание】Установить интенсивность шумоподавления.

<!-- Source EN PDF p.207; unit 2503 -->

【Синтаксис】

<!-- Source EN PDF p.207; unit 2504 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength)
```

<!-- Source EN PDF p.207; unit 2505 -->

【Параметры】

<!-- Source EN PDF p.207; unit 2506 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Структура интенсивности шумоподавления; диапазон percent в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.207; unit 2507 -->

【Возвращаемое значение】

<!-- Source EN PDF p.207; unit 2508 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.207; unit 2509 -->

【Зависимости】

<!-- Source EN PDF p.208; unit 2510 -->

Заголовочные файлы: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2511 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.208; unit 2512 -->

9.4.3.4  rk_aiq_user_api2_abayer2dnrV2_GetStrength

<!-- Source EN PDF p.208; unit 2513 -->

【Описание】Получить интенсивность шумоподавления.

<!-- Source EN PDF p.208; unit 2514 -->

【Синтаксис】

<!-- Source EN PDF p.208; unit 2515 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.208; unit 2516 -->

【Параметры】

<!-- Source EN PDF p.208; unit 2517 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pPercnt | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.208; unit 2518 -->

【Возвращаемое значение】

<!-- Source EN PDF p.208; unit 2519 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.208; unit 2520 -->

【Зависимости】

<!-- Source EN PDF p.208; unit 2521 -->

Заголовочные файлы: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2522 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.208; unit 2523 -->

9.4.3.5  rk_aiq_user_api2_abayertnrV2_SetAttrib

<!-- Source EN PDF p.208; unit 2524 -->

【Описание】Установить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.208; unit 2525 -->

【Синтаксис】

<!-- Source EN PDF p.208; unit 2526 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.208; unit 2527 -->

【Параметры】

<!-- Source EN PDF p.209; unit 2528 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.209; unit 2529 -->

【Возвращаемое значение】

<!-- Source EN PDF p.209; unit 2530 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.209; unit 2531 -->

【Зависимости】

<!-- Source EN PDF p.209; unit 2532 -->

Заголовочные файлы: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2533 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.209; unit 2534 -->

9.4.3.6  rk_aiq_user_api2_abayertnrV2_GetAttrib

<!-- Source EN PDF p.209; unit 2535 -->

【Описание】Получить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.209; unit 2536 -->

【Синтаксис】

<!-- Source EN PDF p.209; unit 2537 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.209; unit 2538 -->

【Параметры】

<!-- Source EN PDF p.209; unit 2539 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.209; unit 2540 -->

【Возвращаемое значение】

<!-- Source EN PDF p.209; unit 2541 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.209; unit 2542 -->

【Зависимости】

<!-- Source EN PDF p.209; unit 2543 -->

Заголовочные файлы: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2544 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.210; unit 2545 -->

9.4.3.7  rk_aiq_user_api2_abayertnrV2_SetStrength

<!-- Source EN PDF p.210; unit 2546 -->

【Описание】Установить интенсивность шумоподавления.

<!-- Source EN PDF p.210; unit 2547 -->

【Синтаксис】

<!-- Source EN PDF p.210; unit 2548 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2549 -->

【Параметры】

<!-- Source EN PDF p.210; unit 2550 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.210; unit 2551 -->

【Возвращаемое значение】

<!-- Source EN PDF p.210; unit 2552 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.210; unit 2553 -->

【Зависимости】

<!-- Source EN PDF p.210; unit 2554 -->

Заголовочные файлы: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.210; unit 2555 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.210; unit 2556 -->

9.4.3.8  rk_aiq_user_api2_abayertnrV2_GetStrength

<!-- Source EN PDF p.210; unit 2557 -->

【Описание】Получить интенсивность шумоподавления.

<!-- Source EN PDF p.210; unit 2558 -->

【Синтаксис】

<!-- Source EN PDF p.210; unit 2559 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2560 -->

【Параметры】

<!-- Source EN PDF p.211; unit 2561 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.211; unit 2562 -->

【Возвращаемое значение】

<!-- Source EN PDF p.211; unit 2563 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.211; unit 2564 -->

【Зависимости】

<!-- Source EN PDF p.211; unit 2565 -->

Заголовочные файлы: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.211; unit 2566 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.211; unit 2567 -->

9.4.3.9  rk_aiq_user_api2_aynrV3_SetAttrib

<!-- Source EN PDF p.211; unit 2568 -->

【Описание】Установить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.211; unit 2569 -->

【Синтаксис】

<!-- Source EN PDF p.211; unit 2570 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.211; unit 2571 -->

【Параметры】

<!-- Source EN PDF p.211; unit 2572 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.211; unit 2573 -->

【Возвращаемое значение】

<!-- Source EN PDF p.211; unit 2574 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.211; unit 2575 -->

【Зависимости】

<!-- Source EN PDF p.211; unit 2576 -->

Заголовочные файлы: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2577 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.212; unit 2578 -->

9.4.3.10  rk_aiq_user_api2_aynrV3_GetAttrib

<!-- Source EN PDF p.212; unit 2579 -->

【Описание】Получить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.212; unit 2580 -->

【Синтаксис】

<!-- Source EN PDF p.212; unit 2581 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.212; unit 2582 -->

【Параметры】

<!-- Source EN PDF p.212; unit 2583 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.212; unit 2584 -->

【Возвращаемое значение】

<!-- Source EN PDF p.212; unit 2585 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.212; unit 2586 -->

【Зависимости】

<!-- Source EN PDF p.212; unit 2587 -->

Заголовочные файлы: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2588 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.212; unit 2589 -->

9.4.3.11  rk_aiq_user_api2_aynrV3_SetStrength

<!-- Source EN PDF p.212; unit 2590 -->

【Описание】Установить интенсивность шумоподавления.

<!-- Source EN PDF p.212; unit 2591 -->

【Синтаксис】

<!-- Source EN PDF p.212; unit 2592 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.212; unit 2593 -->

【Параметры】

<!-- Source EN PDF p.213; unit 2594 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.213; unit 2595 -->

【Возвращаемое значение】

<!-- Source EN PDF p.213; unit 2596 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.213; unit 2597 -->

【Зависимости】

<!-- Source EN PDF p.213; unit 2598 -->

Заголовочные файлы: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.213; unit 2599 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.213; unit 2600 -->

9.4.3.12  rk_aiq_user_api2_aynrV3_GetStrength

<!-- Source EN PDF p.213; unit 2601 -->

【Описание】Получить интенсивность шумоподавления.

<!-- Source EN PDF p.213; unit 2602 -->

【Синтаксис】

<!-- Source EN PDF p.213; unit 2603 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.213; unit 2604 -->

【Параметры】

<!-- Source EN PDF p.213; unit 2605 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.213; unit 2606 -->

【Возвращаемое значение】

<!-- Source EN PDF p.213; unit 2607 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.213; unit 2608 -->

【Зависимости】

<!-- Source EN PDF p.214; unit 2609 -->

Заголовочные файлы: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2610 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.214; unit 2611 -->

9.4.3.13  rk_aiq_user_api2_acnrV2_SetAttrib

<!-- Source EN PDF p.214; unit 2612 -->

【Описание】Установить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.214; unit 2613 -->

【Синтаксис】

<!-- Source EN PDF p.214; unit 2614 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2615 -->

【Параметры】

<!-- Source EN PDF p.214; unit 2616 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.214; unit 2617 -->

【Возвращаемое значение】

<!-- Source EN PDF p.214; unit 2618 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.214; unit 2619 -->

【Зависимости】

<!-- Source EN PDF p.214; unit 2620 -->

Заголовочные файлы: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2621 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.214; unit 2622 -->

9.4.3.14  rk_aiq_user_api2_acnrV2_GetAttrib

<!-- Source EN PDF p.214; unit 2623 -->

【Описание】Получить атрибуты алгоритма шумоподавления.

<!-- Source EN PDF p.214; unit 2624 -->

【Синтаксис】

<!-- Source EN PDF p.214; unit 2625 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2626 -->

【Параметры】

<!-- Source EN PDF p.215; unit 2627 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.215; unit 2628 -->

【Возвращаемое значение】

<!-- Source EN PDF p.215; unit 2629 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.215; unit 2630 -->

【Зависимости】

<!-- Source EN PDF p.215; unit 2631 -->

Заголовочные файлы: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.215; unit 2632 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.215; unit 2633 -->

9.4.3.15  rk_aiq_user_api2_acnrV2_SetStrength

<!-- Source EN PDF p.215; unit 2634 -->

【Описание】Установить интенсивность шумоподавления.

<!-- Source EN PDF p.215; unit 2635 -->

【Синтаксис】

<!-- Source EN PDF p.215; unit 2636 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.215; unit 2637 -->

【Параметры】

<!-- Source EN PDF p.215; unit 2638 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.215; unit 2639 -->

【Возвращаемое значение】

<!-- Source EN PDF p.215; unit 2640 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.215; unit 2641 -->

【Зависимости】

<!-- Source EN PDF p.215; unit 2642 -->

Заголовочные файлы: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2643 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.216; unit 2644 -->

9.4.3.16  rk_aiq_user_api2_acnrV2_GetStrength

<!-- Source EN PDF p.216; unit 2645 -->

【Описание】Получить интенсивность шумоподавления.

<!-- Source EN PDF p.216; unit 2646 -->

【Синтаксис】

<!-- Source EN PDF p.216; unit 2647 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.216; unit 2648 -->

【Параметры】

<!-- Source EN PDF p.216; unit 2649 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности шумоподавления; диапазон percentage в структуре 0.0–1.0. | Вход |

<!-- Source EN PDF p.216; unit 2650 -->

【Возвращаемое значение】

<!-- Source EN PDF p.216; unit 2651 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.216; unit 2652 -->

【Зависимости】

<!-- Source EN PDF p.216; unit 2653 -->

Заголовочные файлы: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2654 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.216; unit 2655 -->

#### 9.4.4 Типы данных API уровня модуля

<!-- Source EN PDF p.216; unit 2656 -->

9.4.4.1  rk_aiq_bayer2dnr_attrib_v2_t

<!-- Source EN PDF p.216; unit 2657 -->

【Описание】Определить параметры модуля шумоподавления.

<!-- Source EN PDF p.216; unit 2658 -->

【Определение】

<!-- Source EN PDF p.217; unit 2659 -->

```text
 typedef struct rk_aiq_bayer2dnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
 Abayer2dnr_OPMode_V2_t eMode;
     Abayer2dnr_Auto_Attr_V2_t stAuto;
     Abayer2dnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayer2dnr_attrib_v2_t;
```

<!-- Source EN PDF p.217; unit 2660 -->

【Члены】

<!-- Source EN PDF p.217; unit 2661 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Режим модуля шумоподавления Bayer2DNR |
| stAuto | Параметры автоматического режима Bayer2DNR |
| stManual | Параметры ручного режима Bayer2DNR |

<!-- Source EN PDF p.217; unit 2662 -->

9.4.4.2  Abayer2dnr_OPMode_V2_t

<!-- Source EN PDF p.217; unit 2663 -->

【Описание】Определить режим модуля шумоподавления.

<!-- Source EN PDF p.217; unit 2664 -->

【Определение】

<!-- Source EN PDF p.217; unit 2665 -->

```text
 typedef enum Abayer2dnr_OPMode_V2_e {
     ABAYER2DNR_OP_MODE_INVALID           = 0,
     ABAYER2DNR_OP_MODE_AUTO              = 1,
     ABAYER2DNR_OP_MODE_MANUAL            = 2,
     ABAYER2DNR_OP_MODE_REG_MANUAL        = 3,
     ABAYER2DNR_OP_MODE_MAX
 } Abayer2dnr_OPMode_V2_t;
```

<!-- Source EN PDF p.217; unit 2666 -->

【Члены】

<!-- Source EN PDF p.217; unit 2667 -->

| Имя члена | Описание |
|---|---|
| ABAYER2DNR_OP_MODE_INVALID | Недопустимый режим шумоподавления 2DNR в области Bayer |
| ABAYER2DNR_OP_MODE_AUTO | Автоматический режим шумоподавления 2DNR в области Bayer |
| ABAYER2DNR_OP_MODE_MANUAL | Настройки алгоритма ручного режима 2DNR в области Bayer |
| ABAYER2DNR_OP_MODE_REG_MANUAL | Настройки регистров ручного режима 2DNR в области Bayer |
| ABAYER2DNR_OP_MODE_MAX | Максимум перечисления режимов 2DNR Bayer; недопустимый режим. |

<!-- Source EN PDF p.218; unit 2668 -->

9.4.4.3  Abayer2dnr_Auto_Attr_V2_t

<!-- Source EN PDF p.218; unit 2669 -->

【Описание】Определить автоматические атрибуты модуля шумоподавления.

<!-- Source EN PDF p.218; unit 2670 -->

【Определение】

<!-- Source EN PDF p.218; unit 2671 -->

```text
 typedef struct Abayer2dnr_Auto_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_t st2DParams;
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
 } Abayer2dnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2672 -->

【Члены】

<!-- Source EN PDF p.218; unit 2673 -->

| Имя члена | Описание |
|---|---|
| st2DParams | Параметры алгоритма Bayer2DNR для каждого ISO |
| st2DSelect | Рассчитанные параметры атрибутов Bayer2DNR |

<!-- Source EN PDF p.218; unit 2674 -->

9.4.4.4  Abayer2dnr_Manual_Attr_V2_t

<!-- Source EN PDF p.218; unit 2675 -->

【Описание】Определить ручные атрибуты модуля шумоподавления.

<!-- Source EN PDF p.218; unit 2676 -->

【Определение】

<!-- Source EN PDF p.218; unit 2677 -->

```text
 typedef struct Abayer2dnr_Manual_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
     RK_Bayer2dnr_Fix_V2_t st2Dfix;
 } Abayer2dnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2678 -->

【Члены】

<!-- Source EN PDF p.218; unit 2679 -->

| Имя члена | Описание |
|---|---|
| st2DSelect | Значения параметров алгоритма Bayer2DNR |
| st2Dfix | Значения регистров Bayer2DNR в ручном режиме |

<!-- Source EN PDF p.218; unit 2680 -->

9.4.4.5  RK_Bayer2dnr_Params_V2_t

<!-- Source EN PDF p.218; unit 2681 -->

【Описание】Определить автоматический режим шумоподавления и параметры алгоритма для каждого ISO.

<!-- Source EN PDF p.218; unit 2682 -->

【Определение】

<!-- Source EN PDF p.219; unit 2683 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   lumapoint[16];
     int   sigma[RK_BAYER2DNR_V2_MAX_ISO_NUM][16];
     float filter_strength[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float edgesofts[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float ratio[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float weight[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   gauss_guide[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int pix_diff[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int diff_thld[RK_BAYER2DNR_V2_MAX_ISO_NUM];
 } RK_Bayer2dnr_Params_V2_t;
```

<!-- Source EN PDF p.219; unit 2684 -->

【Члены】

<!-- Source EN PDF p.220; unit 2685 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| enable | Параметр настройки | Переключатель модуля: 1 — включён, 0 — выключен. |
| ISO | Параметр настройки | Разным ступеням ISO соответствуют разные параметры настройки; поддерживаются только 13 ступеней. |
| lumapoint | Калибровочные данные | Точки кривой sigma шума для разных яркостей пикселей; всего 16. |
| sigma | Калибровочные данные | Точки кривой sigma шума для разных яркостей пикселей; всего 16. |
| gauss_guide | Параметр настройки | Включение гауссовского направляющего фильтра: 1 — включить, 0 — выключить. |
| filter_strength | Параметр настройки | Параметр интенсивности шумоподавления, диапазон [0, 16]; большее значение усиливает подавление. |
| edgesofts | Параметр настройки | Влияет на пространственные веса; диапазон 1–16, по умолчанию 1. |
| ratio | Параметр настройки | Вес мягкого порога, диапазон 0–1.0; меньшее значение усиливает подавление. |
| weight | Параметр настройки | Чем больше вес выхода фильтра, тем сильнее шумоподавление. |
| pix_diff | Параметр настройки | Порог разности пикселей окна 5x5 двустороннего фильтра; по умолчанию 0x3fff. |
| diff_thld | Параметр настройки | Порог квадрата разности для евклидова расстояния двустороннего фильтра — 0x3ff. |

<!-- Source EN PDF p.220; unit 2686 -->

9.4.4.6  RK_Bayer2dnr_Params_V2_Select_t

<!-- Source EN PDF p.220; unit 2687 -->

【Описание】Определить атрибуты алгоритма шумоподавления в ручном режиме.

<!-- Source EN PDF p.220; unit 2688 -->

【Определение】

<!-- Source EN PDF p.220; unit 2689 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_Select_s
 {
     int enable;
     int lumapoint[16];
     int sigma[16];
     float filter_strength;
     float edgesofts;
     float ratio;
     float weight;
     int gauss_guide;
     int pix_diff;
     int diff_thld;
 } RK_Bayer2dnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.221; unit 2690 -->

【Поля】

<!-- Source EN PDF p.221; unit 2691 -->

| Имя поля | Тип параметра | Описание |
|---|---|---|
| enable | Параметры настройки | Переключатель модуля: 1 — включён, 0 — выключен. |
| lumapoint | Калибровочные данные | Разным яркостям пикселей соответствуют точки кривой SIGMA шума; всего 16. |
| sigma | Калибровочные данные | Разным яркостям пикселей соответствуют точки кривой SIGMA шума; всего 16. |
| gauss_guide | Параметры настройки | Включение гауссовского направляющего фильтра: 1 — включить, 0 — выключить. |
| filter_strength | Параметры настройки | Параметр интенсивности шумоподавления, диапазон [0, 16]; большее значение усиливает подавление. |
| edgesofts | Параметры настройки | Влияет на пространственные веса; диапазон [1, 16], по умолчанию 1. |
| ratio | Параметры настройки | Вес мягкого порога, диапазон [0, 1.0]; меньшее значение усиливает подавление. |
| weight | Параметр настройки | Чем больше вес выхода фильтра, тем сильнее шумоподавление. |
| pix_diff | Параметр настройки | Порог разности пикселей окна 5x5 двустороннего фильтра; по умолчанию 0x3fff. |
| diff_thld | Параметр настройки | Порог квадрата разности для евклидова расстояния двустороннего фильтра — 0x3ff. |

<!-- Source EN PDF p.221; unit 2692 -->

9.4.4.7  RK_Bayer2dnr_Fix_V2_t

<!-- Source EN PDF p.221; unit 2693 -->

【Описание】Определить настройки регистров шумоподавления в ручном режиме.

<!-- Source EN PDF p.221; unit 2694 -->

【Определение】

<!-- Source EN PDF p.221; unit 2695 -->

```text
 typedef struct RK_Bayer2dnr_Fix_V2_s {
     //ISP_BAYNR_3A00_CTRL
     uint8_t baynr_lg2_mode;
     uint8_t baynr_gauss_en;
     uint8_t baynr_log_bypass;
     uint8_t baynr_en;
     // ISP_BAYNR_3A00_DGAIN0-2
     uint16_t baynr_dgain[3];
     // ISP_BAYNR_3A00_PIXDIFF
     uint16_t baynr_pix_diff;
     // ISP_BAYNR_3A00_THLD
     uint16_t baynr_diff_thld;
     uint16_t baynr_softthld;
     // ISP_BAYNR_3A00_W1_STRENG
     uint16_t bltflt_streng;
     uint16_t baynr_reg_w1;
     // ISP_BAYNR_3A00_SIGMAX0-15
     uint16_t sigma_x[16];
     // ISP_BAYNR_3A00_SIGMAY0-15
     uint16_t sigma_y[16];
     // ISP_BAYNR_3A00_WRIT_D
     uint16_t weit_d[3];
     uint16_t lg2_lgoff;
     uint16_t lg2_off;
     uint32_t dat_max;
 } RK_Bayer2dnr_Fix_V2_t;
 } RK_Bayer2dnr_Fix_V23_t;
```

<!-- Source EN PDF p.222; unit 2696 -->

【Поля】

<!-- Source EN PDF p.223; unit 2697 -->

| Параметр | Разрядность | Описание параметра |
|---|---|---|
| baynr_gauss_en | 1 | Бит включения направляющего гауссовского фильтра 3x3: 1 — включить, 0 — выключить; по умолчанию 0. |
| baynr_log_bypass | 1 | Бит управления log-преобразованием; внутри HDR аппаратно принудительно отключается. 1 включает обход log, то есть выключает преобразование; 0 выключает обход и включает преобразование. По умолчанию 0. |
| baynr_en | 1 | Бит включения шумоподавления Bayer: 1 — включить, 0 — выключить; по умолчанию 0. |
| baynr_dgain | 18 | Параметры усиления трёх кадров HDR; дробная часть 10bit. |
| baynr_pix_diff | 14 | Порог разности пикселей окна 5x5 двустороннего фильтра; по умолчанию 0x3fff. |
| baynr_diff_thld | 10 | Порог квадрата разности для евклидова расстояния двустороннего фильтра; по умолчанию 0x3ff. |
| baynr_softthld | 10 | Вес мягкого порога: большее значение повышает порог и сохраняет больше шума. Дробная часть 10bit, по умолчанию 0xa. |
| bltflt_streng | 12 | Интенсивность шумоподавления двустороннего фильтра; дробная часть 8bit, по умолчанию 0xa3. |
| baynr_reg_w1 | 10 | Вес выхода фильтра: большее значение усиливает вклад фильтрованного результата, меньшее — исходного. Дробная часть 10bit, по умолчанию 0x3ff. |
| sigma_x | 16 | 16 уровней яркости кривой шума; интервал интерполяции между двумя значениями должен быть степенью 2. |
| sigma_y | 16 | 16 уровней sigma кривой шума; параметры получаются калибровкой. |
| weit_d | 10 | Пространственные веса разных позиций; дробная часть 10bit. По умолчанию 0x178, 0x249, 0x31d. |

<!-- Source EN PDF p.224; unit 2698 -->

9.4.4.8  rk_aiq_bayer2dnr_strength_v2_t

<!-- Source EN PDF p.224; unit 2699 -->

【Описание】Определить структуру настройки интенсивности шумоподавления.

<!-- Source EN PDF p.224; unit 2700 -->

【Определение】

<!-- Source EN PDF p.224; unit 2701 -->

```text
 typedef struct rk_aiq_bayer2dnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayer2dnr_strength_v2_t;
```

<!-- Source EN PDF p.224; unit 2702 -->

【Члены】

<!-- Source EN PDF p.224; unit 2703 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| percent | Интенсивность шумоподавления, диапазон 0.0–1.0. |

<!-- Source EN PDF p.224; unit 2704 -->

9.4.4.9  rk_aiq_bayertnr_attrib_v2_t

<!-- Source EN PDF p.224; unit 2705 -->

【Описание】Определить параметры модуля шумоподавления.

<!-- Source EN PDF p.224; unit 2706 -->

【Определение】

<!-- Source EN PDF p.224; unit 2707 -->

```text
 typedef struct rk_aiq_bayertnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     Abayertnr_OPMode_V2_t eMode;
     Abayertnr_Auto_Attr_V2_t stAuto;
     Abayertnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayertnr_attrib_v2_t;
```

<!-- Source EN PDF p.224; unit 2708 -->

【Члены】

<!-- Source EN PDF p.224; unit 2709 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Режим модуля шумоподавления BayerTNR |
| stAuto | Параметры автоматического режима BayerTNR |
| stManual | Параметры ручного режима BayerTNR |

<!-- Source EN PDF p.225; unit 2710 -->

9.4.4.10  Abayertnr_OPMode_V2_t

<!-- Source EN PDF p.225; unit 2711 -->

【Описание】Определить режим модуля шумоподавления.

<!-- Source EN PDF p.225; unit 2712 -->

【Определение】

<!-- Source EN PDF p.225; unit 2713 -->

```text
 typedef enum Abayertnr_OPMode_V2_e {
     ABAYERTNRV2_OP_MODE_INVALID           = 0,
     ABAYERTNRV2_OP_MODE_AUTO              = 1,
     ABAYERTNRV2_OP_MODE_MANUAL            = 2,
     ABAYERTNRV2_OP_MODE_REG_MANUAL        = 3,
     ABAYERTNRV2_OP_MODE_MAX
 } Abayertnr_OPMode_V2_t;
```

<!-- Source EN PDF p.225; unit 2714 -->

【Члены】

<!-- Source EN PDF p.225; unit 2715 -->

| Имя члена | Описание |
|---|---|
| ABAYERTNRV2_OP_MODE_INVALID | Недопустимый режим TNR в области Bayer |
| ABAYERTNRV2_OP_MODE_AUTO | Автоматический режим TNR в области Bayer |
| ABAYERTNRV2_OP_MODE_MANUAL | Настройки алгоритма ручного режима TNR в области Bayer |
| ABAYERTNRV2_OP_MODE_MAX | Максимум перечисления режимов TNR Bayer; недопустимый режим. |

<!-- Source EN PDF p.225; unit 2716 -->

9.4.4.11  Abayertnr_Auto_Attr_V2_t

<!-- Source EN PDF p.225; unit 2717 -->

【Описание】Определить автоматические атрибуты модуля шумоподавления.

<!-- Source EN PDF p.225; unit 2718 -->

【Определение】

<!-- Source EN PDF p.225; unit 2719 -->

```text
 typedef struct Abayertnr_Auto_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_t st3DParams;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
 } Abayertnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.225; unit 2720 -->

【Члены】

<!-- Source EN PDF p.226; unit 2721 -->

| Имя члена | Описание |
|---|---|
| bayernr3DEn | Переключатель Bayer3DNR |
| st3DParams | Параметры алгоритма Bayer3DNR для каждого ISO в автоматическом режиме |
| st3DSelect | Рассчитанные параметры атрибутов Bayer3DNR |

<!-- Source EN PDF p.226; unit 2722 -->

9.4.4.12  Abayertnr_Manual_Attr_V23_t

<!-- Source EN PDF p.226; unit 2723 -->

【Описание】Определить ручные атрибуты модуля шумоподавления.

<!-- Source EN PDF p.226; unit 2724 -->

【Определение】

<!-- Source EN PDF p.226; unit 2725 -->

```text
 typedef struct Abayertnr_Manual_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
     RK_Bayertnr_Fix_V2_t st3DFix;
 } Abayertnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.226; unit 2726 -->

【Члены】

<!-- Source EN PDF p.226; unit 2727 -->

| Имя члена | Описание |
|---|---|
| bayernr3DEn | Переключатель Bayer3DNR |
| st3DSelect | Значения параметров алгоритма Bayer3DNR в ручном режиме |
| st3Dfix | Значения регистров Bayer3DNR в ручном режиме |

<!-- Source EN PDF p.226; unit 2728 -->

9.4.4.13  RK_Bayertnr_Params_V2_t

<!-- Source EN PDF p.226; unit 2729 -->

【Описание】Определить автоматический режим шумоподавления и параметры алгоритма для каждого ISO.

<!-- Source EN PDF p.226; unit 2730 -->

【Определение】

<!-- Source EN PDF p.226; unit 2731 -->

```text
 typedef struct RK_Bayertnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYERNR_V2_MAX_ISO_NUM];
     //calib
     int   lumapoint[16];
     int   sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   lumapoint2[16];
     int   lo_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   hi_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     //tuning
     int   thumbds[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gsbay_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pk_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pksq[RK_BAYERNR_V2_MAX_ISO_NUM];
     float lo_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float soft_threshold_ratio[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_wgt_comp[RK_BAYERNR_V2_MAX_ISO_NUM];
     float clipwgt[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hidif_th[RK_BAYERNR_V2_MAX_ISO_NUM];
 } RK_Bayertnr_Params_V2_t;
```

<!-- Source EN PDF p.227; unit 2732 -->

【Члены】

<!-- Source EN PDF p.228; unit 2733 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| Enable | Параметры настройки | Переключатель модуля |
| iso | Параметр настройки | Разным ступеням ISO соответствуют разные параметры настройки; сейчас только 13 ступеней. |
| lumapoint / sigma | Параметр калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint — яркость пикселя, sigma — значение кривой шума. |
| lumapoint2 / lo_sigma | Параметр калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, lo_sigma — значение кривой шума. |
| lumapoint2 / hi_sigma | Параметр калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, hi_sigma — значение кривой шума. |
| thumbds | Параметр настройки | Коэффициент уменьшения разрешения |
| lo_enable | Параметр настройки | Включение низкочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| hi_enable | Параметр настройки | Включение высокочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| lo_med_en | Параметр настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gsbay_en | Параметр настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gslum_en | Параметр настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_med_en | Параметр настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_gslum_en | Параметр настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| global_pk_en | Параметр настройки | Использование глобального PK для временного шумоподавления: 1 — да, 0 — нет; сейчас допустим только 0. |

<!-- Source EN PDF p.229; unit 2734 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| global_pksq | Параметр настройки | Квадрат глобального PK, используется при global_pk_en = 1. По умолчанию 1024, диапазон [0, 268435455]. |
| lo_filter_strength | Параметр настройки | Интенсивность высокочастотного обнаружения движения; влияет на hi_sigma и тем самым на временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| hi_filter_strength | Параметр настройки | Интенсивность высокочастотного обнаружения движения; влияет на hi_sigma и тем самым на временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| soft_threshold_ratio | Параметр настройки | Вес мягкого порога: большее значение сохраняет больше шума. Диапазон [0.0 1.0], по умолчанию 0. |
| hi_wgt_comp | Параметр настройки | Коэффициент компенсации веса наложения; действует только при включённой высокочастотной обработке. По умолчанию 0.16, диапазон [0.0, 1.0]. |
| clipwgt | Параметр настройки | Предел веса наложения изображений; по умолчанию 0.03215, диапазон [0.0, 1.0]. |
| hidif_th | Параметр настройки | Порог высокочастотной разности; по умолчанию 32767, диапазон [0, 65535]. |

<!-- Source EN PDF p.229; unit 2735 -->

9.4.4.14  RK_Bayertnr_Params_V2_Select_t

<!-- Source EN PDF p.229; unit 2736 -->

【Описание】Определить структуру атрибутов алгоритма шумоподавления в ручном режиме.

<!-- Source EN PDF p.229; unit 2737 -->

【Определение】

<!-- Source EN PDF p.229; unit 2738 -->

```text
 typedef struct RK_Bayertnr_Params_V2_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float clipwgt;
     float hi_wgt_comp;
     float hidif_th;
 } RK_Bayertnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.230; unit 2739 -->

【Члены】

<!-- Source EN PDF p.231; unit 2740 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| Enable | Параметры настройки | Переключатель модуля |
| lumapoint / sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint — яркость пикселя, sigma — значение кривой шума. |
| lumapoint2 / lo_sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, lo_sigma — значение кривой шума. |
| lumapoint2 / hi_sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, hi_sigma — значение кривой шума. |
| thumbds | Параметры настройки | Коэффициент уменьшения разрешения |
| lo_enable | Параметры настройки | Включение низкочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| hi_enable | Параметры настройки | Включение высокочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| lo_med_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gsbay_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gslum_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_med_en | Параметры настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_gslum_en | Параметры настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| global_pk_en | Параметры настройки | Использование глобального PK для временного шумоподавления: 1 — да, 0 — нет; сейчас допустим только 0. |
| global_pksq | Параметры настройки | Квадрат глобального PK, используется при global_pk_en = 1. По умолчанию 1024, диапазон [0, 268435455]. |

<!-- Source EN PDF p.232; unit 2741 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| lo_filter_strength | Параметры настройки | Интенсивность высокочастотного обнаружения движения влияет на hi_sigma и временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| hi_filter_strength | Параметры настройки | Интенсивность высокочастотного обнаружения движения влияет на hi_sigma и временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| soft_threshold_ratio | Параметры настройки | Вес мягкого порога: большее значение сохраняет больше шума. Диапазон [0.0 1.0], по умолчанию 0. |
| hi_wgt_comp | Параметры настройки | Коэффициент компенсации веса наложения; действует только при включённой высокочастотной обработке. По умолчанию 0.16, диапазон [0.0, 1.0]. |
| clipwgt | Параметры настройки | Предел веса наложения изображений; по умолчанию 0.03215, диапазон 0.0–1.0. |
| hidif_th | Параметры настройки | Порог высокочастотной разности; по умолчанию 32767, диапазон 0–65535. |

<!-- Source EN PDF p.232; unit 2742 -->

9.4.4.15  RK_Bayertnr_Params_V23_Select_t

<!-- Source EN PDF p.232; unit 2743 -->

【Описание】Определить структуру атрибутов алгоритма шумоподавления в ручном режиме.

<!-- Source EN PDF p.232; unit 2744 -->

【Определение】

<!-- Source EN PDF p.232; unit 2745 -->

```text
 typedef struct RK_Bayertnr_Params_V23_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds_w;
     int thumbds_h;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int trans_en;
     int wgt_use_mode;
     int wgt_mge_mode;
     int hi_guass;
     int kl_guass;
     bool global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float lo_clipwgt;
     float hi_wgt_comp;
     int   hidif_th;
     float lo_filter_rat0;
     int   lo_filter_thed0;
     int hi_filter_abs_ctrl;
     int hi_filter_filt_bay;
     int hi_filter_filt_avg;
     int hi_filter_filt_mode;
     float hi_filter_rat0;
     int   hi_filter_thed0;
     float hi_filter_rat1;
     int   hi_filter_thed1;
```

<!-- Source EN PDF p.233; unit 2746 -->

```text
     int   guass_guide_coeff0;
     int   guass_guide_coeff1;
     int   guass_guide_coeff2;
     int   guass_guide_coeff3;
 } RK_Bayertnr_Params_V23_Select_t;
```

<!-- Source EN PDF p.233; unit 2747 -->

【Поля】

<!-- Source EN PDF p.234; unit 2748 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| Enable | Параметры настройки | Переключатель модуля |
| lumapoint / sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. LumaPoint — яркость пикселя, Sigma — значение кривой шума. |
| lumapoint2 / lo_sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, lo_sigma — значение кривой шума. |
| lumapoint2 / hi_sigma | Параметры калибровки | Значения кривой шума для разных яркостей, всего 16 точек. lumapoint2 — яркость пикселя, hi_sigma — значение кривой шума. |
| thumbds_w thumbds_h | Параметры настройки | Поддерживаются только коэффициенты уменьшения разрешения 4x4, 8x4 и 8x8; по умолчанию 8x4. |
| lo_enable | Параметры настройки | Включение низкочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| hi_enable | Параметры настройки | Включение высокочастотного обнаружения движения: 1 — вкл., 0 — выкл.; по умолчанию включено. |
| lo_med_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gsbay_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| lo_gslum_en | Параметры настройки | Переключатель внутреннего низкочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_med_en | Параметры настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| hi_gslum_en | Параметры настройки | Переключатель внутреннего высокочастотного подмодуля: 1 — вкл., 0 — выкл.; по умолчанию включён. |
| global_pk_en | Параметры настройки | Использование глобального PK для временного шумоподавления: 1 — да, 0 — нет; сейчас допустим только 0. |
| global_pksq | Параметры настройки | Квадрат глобального PK; используется только при global_pk_en = 1. По умолчанию 1024, диапазон [0, 268435455]. |

<!-- Source EN PDF p.235; unit 2749 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| lo_filter_strength | Параметры настройки | Интенсивность высокочастотного обнаружения движения влияет на hi_sigma и временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| hi_filter_strength | Параметры настройки | Интенсивность высокочастотного обнаружения движения влияет на hi_sigma и временное шумоподавление. По умолчанию 1, диапазон [0.0, 16.0]. |
| soft_threshold_ratio | Параметры настройки | Вес мягкого порога: большее значение сохраняет больше шума. Диапазон [0.0 1.0], по умолчанию 0. |
| hi_wgt_comp | Параметры настройки | Коэффициент компенсации веса наложения, действует только при включённой высокочастотной обработке. По умолчанию 0.16, диапазон [0.0, 1.0]. |
| lo_clipwgt | Параметры настройки | Предел веса наложения изображений; по умолчанию 0.03215, диапазон [0.0, 1.0]. |
| hidif_th | Параметры настройки | Порог высокочастотной разности; по умолчанию 32767, диапазон [0, 65535]. |
| trans_en | Параметры настройки | Экономия полосы пропускания: 0 — выключена, 1 — включена. Можно задать в линейном режиме; для HDR рекомендуется 0. |
| wgt_use_mode | Параметры настройки | Оптимизация при слиянии весов: 0 — выключена, 1 — включена. |
| wgt_mge_mode | Параметры настройки | Оптимизация вычисления высокочастотных весов: 0 — выключена, 1 — включена. |
| hi_guass | Параметры настройки | Данные для высокочастотной SIGMA: 0 — исходные нефильтрованные, 1 — фильтрованные. |
| kl_guass | Параметры настройки | Данные для поиска PK sigma: 0 — исходные нефильтрованные, 1 — фильтрованные. |
| lo_filter_rat0 | Параметры настройки | Коэффициент данных, вычитаемых из разности при вычислении веса низкочастотного обнаружения движения. Диапазон [0.0, 16.0], по умолчанию 1. |
| lo_filter_thed0 | Параметры настройки | Смещение данных, вычитаемое из разности при вычислении веса низкочастотного обнаружения движения. Диапазон [0, 4095], по умолчанию 0. |

<!-- Source EN PDF p.236; unit 2750 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| hi_filter_rat0 | Параметры настройки | Коэффициент вычитаемых данных при расчёте первого веса высокочастотного движения; диапазон [0.0, 16.0], по умолчанию 1. |
| hi_filter_thed0 | Параметры настройки | Смещение, вычитаемое из разности при расчёте первого веса высокочастотного обнаружения движения; диапазон [0, 4095], по умолчанию 256. |
| hi_filter_rat1 | Параметры настройки | Коэффициент данных, вычитаемых из разности при расчёте второго веса высокочастотного обнаружения движения; диапазон [0.0, 16.0], по умолчанию 1. |
| hi_filter_thed1 | Параметры настройки | Смещение, вычитаемое из разности при расчёте второго веса высокочастотного обнаружения движения; диапазон [0, 4095], по умолчанию 1024. |
| hi_filter_abs_ctrl | Параметры настройки | Позиция взятия модуля при расчёте высокочастотного веса: 0 — разность→медиана→Гаусс→abs; 1 — разность→медиана→abs→Гаусс. По умолчанию 0. |
| hi_filter_filt_bay | Параметры настройки | Раздельная гауссовская обработка четырёх Bayer-каналов при расчёте высокочастотных весов: 1 — отдельно, 3x3 на канал; 0 — совместно, Гаусс 5x7. По умолчанию 0. |
| hi_filter_filt_avg | Параметры настройки | Фильтрация 5x5 при расчёте высокочастотного веса: 0 — выкл., 1 — вкл.; по умолчанию 0. |
| hi_filter_filt_mode | Параметры настройки | Режим фильтра при расчёте высокочастотных весов; диапазон [0, 4], по умолчанию 4. |
| guass_guide_coeff0 | Параметры настройки | Коэффициенты гауссовского фильтра; диапазон [0, 64], по умолчанию 16,8,16,8. |

<!-- Source EN PDF p.236; unit 2751 -->

9.4.4.16  RK_Bayertnr_Fix_V2_t

<!-- Source EN PDF p.236; unit 2752 -->

【Описание】Определить настройки регистров шумоподавления в ручном режиме.

<!-- Source EN PDF p.236; unit 2753 -->

【Определение】

<!-- Source EN PDF p.237; unit 2754 -->

```text
 typedef struct RK_Bayertnr_Fix_V2_s {
     // BAY3D_BAY3D_CTRL 0x2c00
     uint8_t bay3d_exp_sel;
     uint8_t bay3d_soft_st;
     uint8_t bay3d_soft_mode;
     uint8_t bay3d_bwsaving_en;
     uint8_t bay3d_loswitch_protect;
     uint8_t bay3d_glbpk_en;
     uint8_t bay3d_logaus3_bypass_en;
     uint8_t bay3d_logaus5_bypass_en;
     uint8_t bay3d_lomed_bypass_en;
     uint8_t bay3d_hichnsplit_en;
     uint8_t bay3d_hiabs_pssel;
     uint8_t bay3d_higaus_bypass_en;
     uint8_t bay3d_himed_bypass_en;
     uint8_t bay3d_lobypass_en;
     uint8_t bay3d_hibypass_en;
     uint8_t bay3d_bypass_en;
     uint8_t bay3d_en_i;
     // BAY3D_BAY3D_KALRATIO 0x2c04
     uint16_t bay3d_softwgt;
     uint16_t bay3d_hidif_th;
     // BAY3D_BAY3D_GLBPK2 0x2c08
     uint32_t bay3d_glbpk2;
     // BAY3D_BAY3D_WGTLMT 0x2c10
     uint16_t bay3d_wgtlmt;
     uint16_t bay3d_wgtratio;
     // BAY3D_BAY3D_SIG_X0  0x2c14 - 0x2c30
     uint16_t bay3d_sig0_x[16];
     // BAY3D_BAY3D_SIG0_Y0 0x2c34 - 0x2c50
     uint16_t bay3d_sig0_y[16];
     // BAY3D_BAY3D_SIG_X0  0x2c54 - 0x2c70
     uint16_t bay3d_sig1_x[16];
     // BAY3D_BAY3D_SIG1_Y0 0x2c74 - 0x2c90
     uint16_t bay3d_sig1_y[16];
     // BAY3D_BAY3D_SIG2_Y0 0x2c94 - 0x2cb0
     uint16_t bay3d_sig2_y[16];
     //BAY3D_BAY3D_LODIF_STAT0 0x2cb4 -0x2cb8
     uint64_t ro_sum_lodif;
     //BAY3D_BAY3D_LODIF_STAT0 0x2cbc -0x2cc0
     uint64_t ro_sum_hidif0;
     //BAY3D_BAY3D_MI_ST 0x2CC8
     uint8_t sw_bay3dmi_st_linemode;
     uint8_t sw_bay3d_mi2cur_linecnt;
 } RK_Bayertnr_Fix_V2_t;
```

<!-- Source EN PDF p.238; unit 2755 -->

【Члены】

<!-- Source EN PDF p.239; unit 2756 -->

| Параметр | Разрядность | Описание параметра |
|---|---|---|
| bay3d_soft_st | 1 | Бит стартового импульса программного режима; для запуска записать 1. |
| bay3d_soft_mode | 1 | Бит включения программного режима: 1 — вкл., 0 — выкл.; по умолчанию 0x0. |
| bay3d_bwsaving_en | 1 | Бит оптимизации полосы пропускания, действует вне HDR: 1 — вкл., 0 — выкл.; по умолчанию 0x0. |
| bay3d_loswitch_protect | 1 | Сейчас не поддерживается. |
| bay3d_glbpk_en | 1 | Использование глобального PK во временном шумоподавлении Bayer: 1 — глобальный, 0 — локальный; по умолчанию 1. |
| bay3d_logaus3_bypass_en | 1 | Гауссовская фильтрация низких частот в последующей области яркости: 1 — не выполнять, 0 — выполнять; по умолчанию 0x0. |
| bay3d_logaus5_bypass_en | 1 | Гауссовская фильтрация низких частот в предварительной области Bayer: 1 — не выполнять, 0 — выполнять; по умолчанию 0x0. |
| bay3d_lomed_bypass_en | 1 | Медианная фильтрация низких частот: 1 — не выполнять, 0 — выполнять; по умолчанию 0x0. |
| bay3d_hichnsplit_en | 1 | Выбор области гауссовской фильтрации высокочастотного обнаружения; бит включается, когда используется только высокочастотное обнаружение движения. 1 — Bayer, 0 — яркость; по умолчанию 0x0. |

<!-- Source EN PDF p.240; unit 2757 -->

| Параметр | Разрядность | Описание параметра |
|---|---|---|
| bay3d_hiabs_pssel | 1 | Брать ли модуль перед гауссовской фильтрацией высокочастотного обнаружения; бит включается при использовании только высокочастотного обнаружения движения. 1 — да, 0 — нет; по умолчанию 0x0. |
| bay3d_higaus_bypass_en | 1 | Гауссовская фильтрация высоких частот: 1 — не выполнять, 0 — выполнять; по умолчанию 0x0. |
| bay3d_himed_bypass_en | 1 | Медианная фильтрация высоких частот: 1 — не выполнять, 0 — выполнять; по умолчанию 0x0. |
| bay3d_lobypass_en | 1 | Переключатель высокочастотного обнаружения движения: 1 — выкл., 0 — вкл.; по умолчанию 0x0. Динамическое изменение не поддерживается, бит всегда остаётся 0. |
| bay3d_hibypass_en | 1 | Переключатель высокочастотного обнаружения движения: 1 — выкл., 0 — вкл.; по умолчанию 0x0. |
| bay3d_bypass_en | 1 | Обход временного шумоподавления Bayer: 1 — включить обход, Bayer3D ничего не делает; 0 — выключить обход. По умолчанию 0. |
| bay3d_en_i | 1 | Временное шумоподавление Bayer: 1 — включить, 0 — выключить; по умолчанию 0. |
| bay3d_softwgt | 10 | Вес мягкого порога: большее значение повышает порог и сохраняет больше шума. Дробная часть 10bit, по умолчанию 0x100. |
| bay3d_hidif_th | 16 | Порог подсчёта высокочастотных разностей; по умолчанию 0xffff. |
| bay3d_glbpk2 | 28 | Квадрат глобального PK, используется только при pk_en = 0; по умолчанию 0x800. |
| bay3d_wgtlmt | 10 | Предел веса наложения изображений; дробная часть 10 разрядов, по умолчанию 0x380. |

<!-- Source EN PDF p.241; unit 2758 -->

| Параметр | Разрядность | Описание параметра |
|---|---|---|
| bay3d_wgtratio | 10 | Коэффициент компенсации веса наложения, действует только при включённой высокочастотной обработке. Дробная часть 10 разрядов, по умолчанию 0x0. |
| bay3d_sig0_x0-15 | 16 | 16 уровней яркости кривой шума; разность двух значений должна быть степенью 2. |
| bay3d_sig0_y0-15 | 14 | 16 уровней sigma кривой шума; параметры получаются калибровкой. |
| bay3d_sig1_x0-15 | 16 | 16 уровней яркости высоко- и низкочастотных кривых шума; разность двух значений должна быть степенью 2. |
| bay3d_sig1_y0-15 | 14 | 16 уровней SIGMA высокочастотной кривой шума; параметры получают калибровкой. |
| bay3d_sig2_y0-15 | 14 | 16 уровней sigma низкочастотной кривой шума; параметры получают калибровкой. |

<!-- Source EN PDF p.241; unit 2759 -->

9.4.4.17  rk_aiq_bayertnr_strength_v2_t

<!-- Source EN PDF p.241; unit 2760 -->

【Описание】Определить структуру настройки интенсивности шумоподавления.

<!-- Source EN PDF p.241; unit 2761 -->

【Определение】

<!-- Source EN PDF p.241; unit 2762 -->

```text
 typedef struct rk_aiq_bayertnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayertnr_strength_v2_t;
```

<!-- Source EN PDF p.241; unit 2763 -->

【Члены】

<!-- Source EN PDF p.241; unit 2764 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| percent | Интенсивность шумоподавления, диапазон 0.0–1.0. |

<!-- Source EN PDF p.241; unit 2765 -->

9.4.4.18  rk_aiq_ynr_attrib_v3_t

<!-- Source EN PDF p.241; unit 2766 -->

【Описание】Определить параметры модуля шумоподавления.

<!-- Source EN PDF p.241; unit 2767 -->

【Определение】

<!-- Source EN PDF p.242; unit 2768 -->

```text
 typedef struct rk_aiq_ynr_attrib_v3_s {
     rk_aiq_uapi_sync_t sync;
     Aynr_OPMode_V3_t eMode;
     Aynr_Auto_Attr_V3_t stAuto;
     Aynr_Manual_Attr_V3_t stManual;
 } rk_aiq_ynr_attrib_v3_t;
```

<!-- Source EN PDF p.242; unit 2769 -->

【Члены】

<!-- Source EN PDF p.242; unit 2770 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Режим модуля шумоподавления YNR |
| stAuto | Параметры автоматического режима YNR |
| stManual | Параметры ручного режима YNR |

<!-- Source EN PDF p.242; unit 2771 -->

9.4.4.19  Aynr_OPMode_V3_t

<!-- Source EN PDF p.242; unit 2772 -->

【Описание】Определить режим модуля шумоподавления.

<!-- Source EN PDF p.242; unit 2773 -->

【Определение】

<!-- Source EN PDF p.242; unit 2774 -->

```text
 typedef enum Aynr_OPMode_V3_e {
     AYNRV3_OP_MODE_INVALID           = 0,
     AYNRV3_OP_MODE_AUTO              = 1,
     AYNRV3_OP_MODE_MANUAL            = 2,
     AYNRV3_OP_MODE_REG_MANUAL        = 3,
     AYNRV3_OP_MODE_MAX
 } Aynr_OPMode_V3_t;
```

<!-- Source EN PDF p.242; unit 2775 -->

【Члены】

<!-- Source EN PDF p.242; unit 2776 -->

| Имя члена | Описание |
|---|---|
| AYNRV3_OP_MODE_INVALID | Недопустимый режим YNR в области Y |
| AYNRV3_OP_MODE_AUTO | Автоматический режим YNR в области Y |
| AYNRV3_OP_MODE_MANUAL | Настройки алгоритма ручного режима YNR в области Y |
| AYNRV3_OP_MODE_REG_MANUAL | Настройки регистров ручного режима YNR в области Y |
| AYNRV3_OP_MODE_MAX | Максимум перечисления режимов YNR области Y; недопустимый режим. |

<!-- Source EN PDF p.243; unit 2777 -->

9.4.4.20  Aynr_Auto_Attr_V3_t

<!-- Source EN PDF p.243; unit 2778 -->

【Описание】Определить автоматические атрибуты модуля шумоподавления.

<!-- Source EN PDF p.243; unit 2779 -->

【Определение】

<!-- Source EN PDF p.243; unit 2780 -->

```text
 typedef struct Aynr_Auto_Attr_V3_s
 {
     RK_YNR_Params_V3_t stParams;
     RK_YNR_Params_V3_Select_t stSelect;
 } Aynr_Auto_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2781 -->

【Члены】

<!-- Source EN PDF p.243; unit 2782 -->

| Имя члена | Описание |
|---|---|
| stParams | Параметры алгоритма YNR для каждого ISO |
| stSelect | Рассчитанные параметры атрибутов YNR |

<!-- Source EN PDF p.243; unit 2783 -->

9.4.4.21  Aynr_Manual_Attr_V3_t

<!-- Source EN PDF p.243; unit 2784 -->

【Описание】Определить ручные атрибуты модуля шумоподавления.

<!-- Source EN PDF p.243; unit 2785 -->

【Определение】

<!-- Source EN PDF p.243; unit 2786 -->

```text
 typedef struct Aynr_Manual_Attr_V3_s
 {
     RK_YNR_Params_V3_Select_t stSelect;
     RK_YNR_Fix_V3_t stFix;
 } Aynr_Manual_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2787 -->

【Члены】

<!-- Source EN PDF p.243; unit 2788 -->

| Имя члена | Описание |
|---|---|
| stSelect | Значения параметров алгоритма |
| stFix | Значения регистров YNNR |

<!-- Source EN PDF p.243; unit 2789 -->

9.4.4.22  RK_YNR_Params_V3_t

<!-- Source EN PDF p.243; unit 2790 -->

【Описание】Определить параметры алгоритма YNR для каждого ISO в автоматическом режиме.

<!-- Source EN PDF p.243; unit 2791 -->

【Определение】

<!-- Source EN PDF p.244; unit 2792 -->

```text
 typedef struct RK_YNR_Params_V3_s
 {
     int enable;
     char version[64];
     float iso[RK_YNR_V3_MAX_ISO_NUM];
     RK_YNR_Params_V3_Select_t arYnrParamsISO[RK_YNR_V3_MAX_ISO_NUM];
 } RK_YNR_Params_V3_t;
```

<!-- Source EN PDF p.244; unit 2793 -->

【Члены】

<!-- Source EN PDF p.244; unit 2794 -->

| Имя члена | Описание |
|---|---|
| enable | Переключатель YNR |
| Версия | Версия модуля YNR |
| iso | Разным ступеням ISO соответствуют разные параметры настройки; сейчас поддерживаются только 13 ступеней. |
| RK_YNR_Params_V3_Select_t | Параметры алгоритма YYNR |

<!-- Source EN PDF p.244; unit 2795 -->

9.4.4.23  RK_YNR_Params_V3_Select_t

<!-- Source EN PDF p.244; unit 2796 -->

【Описание】Определить атрибуты алгоритма шумоподавления в ручном режиме.

<!-- Source EN PDF p.244; unit 2797 -->

【Определение】

<!-- Source EN PDF p.244; unit 2798 -->

```text
 typedef struct RK_YNR_Params_V3_Select_s
 {
     int enable;
     float lci;
     float hci;
     float sigma[YNR_V3_ISO_CURVE_POINT_NUM];
     short lumaPoint[YNR_V3_ISO_CURVE_POINT_NUM];
     float lo_lumaPoint[6];
     float lo_ratio[6];
     float hi_lumaPoint[6];
     float hi_ratio[6];
     // low frequency
     float rnr_strength[17];
     int ynr_bft3x3_bypass;
     int ynr_lbft5x5_bypass;
     int ynr_lgft3x3_bypass;
     int ynr_flt1x1_bypass;
     int ynr_sft5x5_bypass;
     float low_bf1;
     float low_bf2;
     float low_thred_adj;
     float low_peak_supress;
     float low_edge_adj_thresh;
     float low_lbf_weight_thresh;
     float low_center_weight;
     float low_dist_adj;
     float low_weight;
     float low_filt1_strength;
     float low_filt2_strength;
     float low_bi_weight;
```

<!-- Source EN PDF p.245; unit 2799 -->

```text
     // high frequency
     float base_filter_weight1;
     float base_filter_weight2;
     float base_filter_weight3;
     float high_thred_adj;
     float high_weight;
     float high_direction_weight[8];
     float hi_min_adj;
     float hi_edge_thed;
     //local gain control
     float ynr_global_gain_alpha;
     float ynr_global_gain;
     float ynr_adjust_thresh;
     float ynr_adjust_scale;
 } RK_YNR_Params_V3_Select_t;
```

<!-- Source EN PDF p.245; unit 2800 -->

【Поля】

<!-- Source EN PDF p.246; unit 2801 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| enable | Параметры настройки | Переключатель YNR: 1 — вкл., 0 — выкл. |
| lci | Калибровочные данные | Коэффициент низкочастотной sigma шума; большее значение увеличивает sigma и усиливает шумоподавление. |
| hci | Калибровочные данные | Коэффициент высокочастотной sigma шума; большее значение увеличивает sigma и усиливает шумоподавление. |
| sigma | Калибровочные данные | Кривая sigma шума. |
| lumaPoint | Калибровочные данные | Разным яркостям пикселей соответствуют точки кривой SIGMA шума; всего 16. |
| rnr_strength | Параметры настройки | Задать разную интенсивность шумоподавления вдоль радиуса r от центра изображения, главным образом для шума LSC. Диапазон [0, 16.0], по умолчанию 1. |
| ynr_bft3x3_bypass | Параметры настройки | Обход внутренних подмодулей: 0 — функция включена, 1 — обход. Обычно все подмодули включены, значения равны 0. |
| ynr_lbft5x5_bypass | Параметры настройки | Обход внутренних подмодулей: 0 — функция включена, 1 — обход. Обычно все подмодули включены, значения равны 0. |
| ynr_lgft3x3_bypass | Параметры настройки | Обход внутренних подмодулей: 0 — функция включена, 1 — обход. Обычно все подмодули включены, значения равны 0. |
| ynr_flt1x1_bypass | Параметры настройки | Обход внутренних подмодулей: 0 — функция включена, 1 — обход. Обычно все подмодули включены, значения равны 0. |

<!-- Source EN PDF p.247; unit 2802 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| ynr_sft5x5_bypass | Параметры настройки | Обход внутренних подмодулей: 0 — функция включена, 1 — обход. Обычно все подмодули включены, значения равны 0. |
| low_bf1 | Параметры настройки | Интенсивность двустороннего фильтра 3x3 исходного изображения: больше — сильнее подавление. Диапазон [0.01, 32], по умолчанию 1. |
| low_bf2 | Параметры настройки | Интенсивность двустороннего фильтра 5x5 уменьшенного предыдущего кадра: больше — сильнее подавление. Диапазон [0.01, 32], по умолчанию 1. |
| low_thred_adj | Параметры настройки | Чем выше низкочастотный мягкий порог, тем сильнее подавление низкочастотного шума. Диапазон [0, 31], по умолчанию 0.5. |
| low_peak_supress | Параметры настройки | Управление удалением изолированного шума: меньшее значение усиливает подавление. Диапазон [0, 1], по умолчанию 0.5. |
| low_edge_adj_thresh | Параметры настройки | Порог коэффициента коррекции обнаружения границ уменьшенного изображения, ограничивающий его максимум. Меньше — сильнее подавление и размытие. Целое [0, 1023], по умолчанию 7. |
| low_lbf_weight_thresh | Параметры настройки | Ограничение веса двустороннего фильтра 5x5: большее значение ослабляет низкочастотное подавление. Диапазон [0.0, 1.0], по умолчанию 0.25. |
| low_center_weight | Параметры настройки | Вес центральной точки двустороннего фильтра 5x5: меньше — сильнее подавление. Диапазон [0,1], по умолчанию 0.5. |
| low_dist_adj | Параметры настройки | Коэффициент коррекции пространственного веса двустороннего фильтра: меньше — сильнее подавление. Диапазон [0, 127.0], по умолчанию 8.0. |
| low_weight | Параметры настройки | Вес результата низкочастотного подавления: больше — сильнее подавление. Диапазон [0, 1], по умолчанию 0.5. |

<!-- Source EN PDF p.248; unit 2803 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| low_filt1_strength | Параметры настройки | Вес ядра гауссовского фильтра исходного изображения; диапазон [0,1.0], по умолчанию 0.7. |
| low_filt2_strength | Параметры настройки | Вес ядра гауссовского фильтра результата двусторонней фильтрации; диапазон [0,1.0], по умолчанию 0.85. |
| low_bi_weight | Параметры настройки | Вес первого двустороннего фильтра в обработке мягкого порога: больше — сильнее подавление. Диапазон [0, 1], по умолчанию 0.3. |
| base_filter_weight1 | Параметр настройки | Коэффициенты направленного фильтра; обычно почти не требуют настройки. |
| high_thred_adj | Параметр настройки | Большее значение усиливает высокочастотное шумоподавление. Диапазон 0–31.0, по умолчанию 1.0. |
| high_weight | Параметр настройки | Вес высокочастотного подавления означает долю сохраняемых высоких частот: меньше — сильнее подавление. Диапазон 0–1, по умолчанию 0.78. |
| high_direction_weight | Параметр настройки | Чем больше значение для направления, тем сильнее подавление вдоль него. |
| hi_min_adj | Параметр настройки | Доля вычитания минимальной дисперсии из всех дисперсий: большее значение делает границы резче. Диапазон 0.0–1.0, по умолчанию 0.9. |
| hi_edge_thed | Параметр настройки | Чем меньше порог, тем сильнее высокочастотное шумоподавление. Целое значение в диапазоне 0, 255; по умолчанию 100. |
| ynr_global_gain_alpha | Параметры настройки | Настройка силы интерполяции локального и глобального режимов YNR. Обычно оставляют значение по умолчанию без настройки и используют локальное усиление. Диапазон [0.0 1.0], по умолчанию 0. |
| ynr_global_gain | Параметры настройки | Настройка силы интерполяции локального и глобального режимов YNR. Обычно оставляют значение по умолчанию без настройки и используют локальное усиление. Диапазон усиления [0.0 64.0], по умолчанию 1. |

<!-- Source EN PDF p.249; unit 2804 -->

| Имя члена | Тип параметра | Описание |
|---|---|---|
| ynr_adjust_thresh | Параметры настройки | Управляет шумоподавлением при шуме выше порога ynr_adjust_thresh. В движущихся областях шум сильнее; подходящий порог усиливает там YNR. Диапазон [0.0, 1.0], по умолчанию 1. |
| ynr_adjust_scale | Параметры настройки | Управляет шумоподавлением при шуме выше порога ynr_adjust_thresh. В движущихся областях шум сильнее; подходящий порог усиливает там YNR. Диапазон [0, 16.0], по умолчанию 1. |
| lo_lumaPoint / lo_ratio | Параметры настройки | Точная настройка низкочастотной Sigma для разной яркости пикселей. |
| hi_lumaPoint / hi_ratio | Параметры настройки | Точная настройка высокочастотной Sigma для разной яркости пикселей. |

<!-- Source EN PDF p.249; unit 2805 -->

9.4.4.24  RK_YNR_Fix_V3_t

<!-- Source EN PDF p.249; unit 2806 -->

【Описание】Определить настройки регистров шумоподавления в ручном режиме.

<!-- Source EN PDF p.249; unit 2807 -->

【Определение】

<!-- Source EN PDF p.249; unit 2808 -->

```text
 typedef struct RK_YNR_Fix_V3_s {
     // YNR_2700_GLOBAL_CTRL (0x0000)
     uint8_t ynr_rnr_en;
     uint8_t ynr_gate_dis;
     uint8_t ynr_thumb_mix_cur_en;
     uint8_t ynr_global_gain_alpha;
     uint16_t ynr_global_gain;
     uint8_t ynr_flt1x1_bypass_sel;
     uint8_t ynr_sft5x5_bypass;
     uint8_t ynr_flt1x1_bypass;
     uint8_t ynr_lgft3x3_bypass;
     uint8_t ynr_lbft5x5_bypass;
     uint8_t ynr_bft3x3_bypass;
     uint8_t ynr_en;
```

<!-- Source EN PDF p.249; unit 2809 -->

```text
     // YNR_2700_RNR_MAX_R  (0x0004)
     uint8_t ynr_local_gainscale;
     uint16_t ynr_rnr_max_r;
     // YNR_2700_RNR_MAX_R  (0x0008)
     uint16_t ynr_rnr_center_coorv;
     uint16_t ynr_rnr_center_coorh;
     // YNR_2700_RNR_MAX_R  (0x000c)
     uint8_t ynr_localgain_adj;
     uint16_t ynr_localgain_adj_thresh;
     // YNR_2700_LOWNR_CTRL0 (0x0010)
     uint16_t ynr_low_bf_inv[2];
     // YNR_2700_LOWNR_CTRL1  (0x0014)
     uint8_t ynr_low_peak_supress;
     uint16_t ynr_low_thred_adj;
     // YNR_2700_LOWNR_CTRL2 (0x0018)
     uint16_t ynr_low_dist_adj;
     uint16_t ynr_low_edge_adj_thresh;
     // YNR_2700_LOWNR_CTRL3 (0x001c)
     uint8_t ynr_low_bi_weight;
     uint8_t ynr_low_weight;
     uint16_t ynr_low_center_weight;
     // YNR_2700_HIGHNR_CTRL0 (0x0020)
     uint8_t ynr_hi_min_adj;
     uint16_t ynr_high_thred_adj;
     // YNR_2700_HIGHNR_CTRL1  (0x0024)
     uint8_t ynr_high_retain_weight;
     uint8_t ynr_hi_edge_thed;
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x0028)
     uint8_t ynr_base_filter_weight[3];
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x002c)
     uint32_t ynr_frame_full_size;
     uint16_t ynr_lbf_weight_thres;
     // YNR_2700_GAUSS1_COEFF  (0x0030)
     uint16_t ynr_low_gauss1_coeff[3];
     // YNR_2700_GAUSS2_COEFF  (0x0034)
     uint16_t ynr_low_gauss2_coeff[3];
     // YNR_2700_DIRECTION_W_0_3  (0x0038 - 0x003c)
     uint8_t ynr_direction_weight[8];
     // YNR_2700_SGM_DX_0_1 (0x0040 - 0x0060)
     uint16_t ynr_luma_points_x[17];
     // YNR_2700_LSGM_Y_0_1 (0x0070- 0x0090)
     uint16_t ynr_lsgm_y[17];
     // YNR_2700_HSGM_Y_0_1 (0x00a0- 0x00c0)
     uint16_t ynr_hsgm_y[17];
     // YNR_2700_RNR_STRENGTH03 (0x00d0- 0x00e0)
     uint16_t ynr_rnr_strength[17];
 } RK_YNR_Fix_V3_t;
```

<!-- Source EN PDF p.251; unit 2810 -->

【Поля】

<!-- Source EN PDF p.252; unit 2811 -->

| Имя члена | Разрядность (целая часть.дробная часть) | Описание |
|---|---|---|
| ynr_low_bf_inv[0] | 5.9 | Управляет силой шумоподавления. В регистре задается обратная величина, поэтому меньшее значение усиливает подавление. 512 соответствует силе 1x, 256 — 2x. Диапазон [1, 16383]. |
| ynr_low_bf[1] | 5.9 | Управляет силой шумоподавления. Используется обратная величина настроенного значения регистра, поэтому меньшее значение усиливает подавление. 512 соответствует 1x, 256 — 2x. |
| ynr_low_thred_adj | 5.6 | Сила корректировки низкочастотного мягкого порога: большее значение усиливает низкочастотное шумоподавление. Диапазон [0, 2047]. |
| ynr_low_peak_supress | 1.7 | Сила удаления крупных изолированных шумовых выбросов: чем больше значение, тем сильнее удаление. Диапазон [0, 128]. |
| ynr_low_edge_adj_thresh | 11.0 | Порог коэффициента корректировки обнаружения границ на уменьшенном изображении, ограничивающий его максимальное значение. Диапазон [1, 1024]. |
| ynr_low_center_weight | 1.10 | Вес центральной точки двустороннего фильтра 5x5: меньшее значение усиливает шумоподавление. Диапазон [1, 1024]. |
| sw_ynr_lbf_weight_thres | 10.0 | Вес, ограничивающий значение двусторонней фильтрации 5x5: большее значение ослабляет низкочастотное шумоподавление. Диапазон [0, 1023]. |
| ynr_low_dist_adj | 7.2 | Коэффициент корректировки весов расстояния двустороннего фильтра. Диапазон [1, 511]. |
| ynr_low_weight | 1.7 | Вес результата низкочастотного шумоподавления: большее значение усиливает подавление. Диапазон [0, 128]. |
| ynr_low_gauss1_coeff[3] | 1.8 | Вес ядра гауссовой фильтрации исходного изображения. Диапазон [0, 256]. |
| ynr_low_gauss2_coeff[3] | 1.8 | Вес гауссова ядра при фильтрации результата двустороннего фильтра. Диапазон [0, 256]. |

<!-- Source EN PDF p.253; unit 2812 -->

| Имя члена | Разрядность (целая часть.дробная часть) | Описание |
|---|---|---|
| ynr_low_bi_weight | 1.7 | Вес первого двустороннего фильтра при обработке мягкого порога: большее значение усиливает подавление. Диапазон [0, 128]. |
| ynr_base_filter_weight[3] | 1.6 | Коэффициент направленного фильтра. Диапазон [0, 64]. |
| ynr_high_thred_adj | 5.6 | Чем больше значение, тем сильнее высокочастотное шумоподавление. Диапазон [0, 2047]. |
| ynr_high_retain_weight | 1.7 | Вес высокочастотного шумоподавления. Значение задает долю сохраняемой высокочастотной составляющей, поэтому его увеличение ослабляет подавление. Диапазон [0, 128]. |
| ynr_direction_weight[8] | 1.4 | Чем больше значение для направления, тем сильнее шумоподавление вдоль него. Диапазон [0,16]. |
| ynr_hi_min_adj | 0.6 | Отношение всех значений дисперсии за вычетом минимальной дисперсии: большее значение делает границы резче. Диапазон [6,60]. |
| ynr_hi_edge_thed | 10.0 | Чем меньше порог, тем сильнее высокочастотное шумоподавление. Диапазон [0,1023]. |
| ynr_rnr_max_r | 14.0 | Корректирует радиальную силу шумоподавления и хранит 1/((rows/2)^2+(cols/2)^2): первые 9 бит — мантисса M, последние 5 бит — показатель E. Диапазон [1, 16383]. |
| ynr_rnr_strength[17] | 4.4 | Управляет радиальным шумоподавлением: 17 точек образуют 16 сегментов, задающих силу от центра к четырем углам изображения. Диапазон [0, 15]. |
| ynr_global_gain | 6.4 | Внешнее глобальное усиление управляет общей силой YNR: чем больше значение, тем сильнее шумоподавление. Диапазон [0, 1023]. |

<!-- Source EN PDF p.254; unit 2813 -->

| Имя члена | Разрядность (целая часть.дробная часть) | Описание |
|---|---|---|
| ynr_global_gain_alpha | 1.3 | Задает соотношение усиления от модуля gain и внешнего усиления: большее значение увеличивает долю внешнего глобального усиления. Диапазон [0, 8]. |
| ynr_bft3x3_bypass | 1 | При 1 отключает двустороннюю фильтрацию 3x3. Значение 0 или 1. |
| ynr_lbft5x5_bypass | 1 | При 1 отключает двустороннюю фильтрацию 5x5. Значение 0 или 1. |
| ynr_lgft3x3_bypass | 1 | При 1 отключает гауссову фильтрацию 3x3. |
| ynr_flt1x1_bypass | 1 | При 1 отключает низкочастотную обработку мягкого порога. Значение 0 или 1. |
| ynr_sft5x5_bypass | 1 | При 5 отключает высокочастотное подавление 1x5; диапазон 0 или 1 (так в оригинале: условие противоречит диапазону). |

<!-- Source EN PDF p.254; unit 2814 -->

9.4.4.25  rk_aiq_ynr_strength_v3_t

<!-- Source EN PDF p.254; unit 2815 -->

【Описание】Определить структуру настройки интенсивности шумоподавления.

<!-- Source EN PDF p.254; unit 2816 -->

【Определение】

<!-- Source EN PDF p.254; unit 2817 -->

```text
 typedef struct rk_aiq_ynr_strength_v3_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
     bool strength_enable;
 } rk_aiq_ynr_strength_v3_t;
```

<!-- Source EN PDF p.254; unit 2818 -->

【Члены】

<!-- Source EN PDF p.254; unit 2819 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| percent | Интенсивность шумоподавления, диапазон 0.0–1.0. |

<!-- Source EN PDF p.254; unit 2820 -->

9.4.4.26  rk_aiq_cnr_attrib_v2_t

<!-- Source EN PDF p.254; unit 2821 -->

【Описание】Определить параметры модуля шумоподавления.

<!-- Source EN PDF p.254; unit 2822 -->

【Определение】

<!-- Source EN PDF p.255; unit 2823 -->

```text
 typedef struct rk_aiq_cnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     AcnrV2_OPMode_t eMode;
     Acnr_Auto_Attr_V2_t stAuto;
     Acnr_Manual_Attr_V2_t stManual;
 } rk_aiq_cnr_attrib_v2_t;
```

<!-- Source EN PDF p.255; unit 2824 -->

【Члены】

<!-- Source EN PDF p.255; unit 2825 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Режим модуля шумоподавления CNR |
| stAuto | Параметры автоматического режима CNR |
| stManual | Параметры ручного режима CNR |

<!-- Source EN PDF p.255; unit 2826 -->

9.4.4.27  AcnrV2_OPMode_t

<!-- Source EN PDF p.255; unit 2827 -->

【Описание】 Определяет свойства режима модуля шумоподавления.

<!-- Source EN PDF p.255; unit 2828 -->

【Определение】

<!-- Source EN PDF p.255; unit 2829 -->

```text
 typedef enum AcnrV2_OPMode_e {
     ACNRV2_OP_MODE_INVALID           = 0,
     ACNRV2_OP_MODE_AUTO              = 1,
     ACNRV2_OP_MODE_MANUAL            = 2,
     ACNRV2_OP_MODE_REG_MANUAL        = 3,
     ACNRV2_OP_MODE_MAX
 } AcnrV2_OPMode_t;
```

<!-- Source EN PDF p.255; unit 2830 -->

【Члены】

<!-- Source EN PDF p.255; unit 2831 -->

| Имя члена | Описание |
|---|---|
| ACNRV2_OP_MODE_INVALID | Недопустимый режим CNR в области UV |
| ACNRV2_OP_MODE_AUTO | Автоматический режим CNR в области UV |
| ACNRV2_OP_MODE_MANUAL | Настройки алгоритма ручного режима CNR в области UV |
| ACNRV2_OP_MODE_REG_MANUAL | Настройки регистров ручного режима CNR в области UV |
| ACNRV2_OP_MODE_MAX | Максимальное значение режима CNR в области UV; недопустимый режим |

<!-- Source EN PDF p.256; unit 2832 -->

9.4.4.28  Acnr_Auto_Attr_V2_t

<!-- Source EN PDF p.256; unit 2833 -->

【Описание】Определить автоматические атрибуты модуля шумоподавления.

<!-- Source EN PDF p.256; unit 2834 -->

【Определение】

<!-- Source EN PDF p.256; unit 2835 -->

```text
 typedef struct Acnr_Auto_Attr_V2_s
 {
     all ISO params and select param
 RK_CNR_Params_V2_t stParams;
     RK_CNR_Params_V2_Select_t stSelect;
 } Acnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2836 -->

【Члены】

<!-- Source EN PDF p.256; unit 2837 -->

| Имя члена | Описание |
|---|---|
| stParams | Параметры свойств алгоритма CNR для каждого ISO |
| stSelect | Расчетные параметры свойств модуля CNR |

<!-- Source EN PDF p.256; unit 2838 -->

9.4.4.29  Acnr_Manual_Attr_V2_t

<!-- Source EN PDF p.256; unit 2839 -->

【Описание】Определить ручные атрибуты модуля шумоподавления.

<!-- Source EN PDF p.256; unit 2840 -->

【Определение】

<!-- Source EN PDF p.256; unit 2841 -->

```text
 typedef struct Acnr_Manual_Attr_V2_s
 {
     RK_CNR_Params_V2_Select_t stSelect;
 RK_CNR_Fix_V2_t stFix;
 } Acnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2842 -->

【Члены】

<!-- Source EN PDF p.256; unit 2843 -->

| Имя члена | Описание |
|---|---|
| stSelect | Значение параметра алгоритма |
| stSelect | Значение регистра |

<!-- Source EN PDF p.257; unit 2844 -->

9.4.4.30  RK_CNR_Params_V2_t

<!-- Source EN PDF p.257; unit 2845 -->

【Описание】Определить автоматический режим шумоподавления и параметры алгоритма для каждого ISO.

<!-- Source EN PDF p.257; unit 2846 -->

【Определение】

<!-- Source EN PDF p.257; unit 2847 -->

```text
 typedef struct RK_CNR_Params_V2_s
 {
     int enable;
     float iso[RK_CNR_V2_MAX_ISO_NUM];
     int hf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     int lf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     // gain
     float global_gain[RK_CNR_V2_MAX_ISO_NUM];
     float global_gain_alpha[RK_CNR_V2_MAX_ISO_NUM];
     float local_gain_scale[RK_CNR_V2_MAX_ISO_NUM];
     // strength adj by gain
     int gain_adj_strength_ratio[RK_CNR_V2_MAX_ISO_NUM]
 [RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj[RK_CNR_V2_MAX_ISO_NUM];
     float color_sat_adj_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // step1
     // median filter
     float hf_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float hf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float hf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float hf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     int  hf_bf_wgt_clip[RK_CNR_V2_MAX_ISO_NUM];
```

<!-- Source EN PDF p.257; unit 2848 -->

```text
     // step2
     // median filter
     float thumb_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float thumb_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float thumb_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     // step3
     // bilateral filter
     float lf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float lf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float lf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_t;
```

<!-- Source EN PDF p.258; unit 2849 -->

【Члены】

<!-- Source EN PDF p.259; unit 2850 -->

| Имя параметра | Тип параметра | Описание параметра |
|---|---|---|
| Enable | Параметры настройки | Переключатель модуля: 1 — включён, 0 — выключен. |
| iso | Параметры настройки | Разным ступеням ISO соответствуют разные параметры настройки. Сейчас поддерживаются только 13 ступеней. |
| hf_bypass | Параметры настройки | Обход высокочастотного шумоподавления. 0: без обхода; 1: обход. |
| lf_bypass | Параметры настройки | Обход низкочастотного шумоподавления. 0: без обхода; 1: обход. |
| global_gain | Параметры настройки | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон от 0.0 до 64.0, по умолчанию 1. |
| global_gain_alpha | Параметры настройки | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон 0.0 1.0, по умолчанию 0. |
| global_gain_scale | Параметры настройки | Усиливает шумоподавление CNR; обычно используют значение по умолчанию, корректировать не рекомендуется. Диапазон 0, 128; по умолчанию 1. |
| gain_adj_strength_ratio | Параметры настройки | Корректирует фильтрацию по локальному усилению: меньшее значение усиливает подавление. Диапазон [1, 255], по умолчанию 255. |
| color_sat_adj | Параметры настройки | Отношение UV двустороннего фильтра с корректировкой по градиенту, 1~255. Меньшее значение улучшает удаление цветового шума. Диапазон [1, 255], по умолчанию 40. |
| color_sat_adj_alpha | Параметры настройки | Коэффициент корректировки color_sat_adj: большее значение улучшает удаление цветового шума. Диапазон 0, 1.0; по умолчанию 0.8. |
| hf_spikes_reducion_strength | Параметры настройки | Сила высокочастотной медианной фильтрации: чем больше значение, тем сильнее фильтрация. Диапазон 0, 1.0; по умолчанию 0.5. |

<!-- Source EN PDF p.260; unit 2851 -->

| Имя параметра | Тип параметра | Описание параметра |
|---|---|---|
| hf_denoise_strength | Параметры настройки | Сила высокочастотной двусторонней фильтрации: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 10. |
| hf_color_sat | Параметры настройки | Масштаб UV высокочастотного двустороннего фильтра: меньшее значение сильнее снижает насыщенность. Диапазон 0.0, 7.9; по умолчанию 1.5. |
| hf_denoise_alpha | Параметры настройки | Вес центральной точки высокочастотного двустороннего фильтра. Диапазон 0.0, 1.0; по умолчанию 0. |
| hf_bf_wgt_clip | Параметры настройки | Минимальное высокочастотное шумоподавление: большее значение усиливает подавление. Диапазон 0, 255; по умолчанию 0. |
| thumb_spikes_reducion_strength | Параметры настройки | Сила медианной фильтрации миниатюры: большее значение усиливает фильтрацию. Диапазон 0.0, 1.0; по умолчанию 0.5. |
| thumb_denoise_strength | Параметры настройки | Сила двусторонней фильтрации миниатюры: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 8. |
| thumb_color_sat | Параметры настройки | Масштаб UV двусторонней фильтрации миниатюры, сильнее снижает насыщенность (направление изменения в оригинале не указано). Диапазон 0.0, 7.9; по умолчанию 4. |
| lf_denoise_strength | Параметры настройки | Сила низкочастотной двусторонней фильтрации: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 8. |
| lf_color_sat | Параметры настройки | Коэффициент UV низкочастотной двусторонней фильтрации: меньшее значение сильнее снижает насыщенность. Диапазон 0.0, 7.9; по умолчанию 4. |
| lf_denoise_alpha | Параметры настройки | Вес центральной точки низкочастотного двустороннего фильтра. Диапазон 0.0, 1.0; по умолчанию 0.5. |
| kernel_5x5 | Параметры настройки | Ядро двустороннего фильтра 5x5. |

<!-- Source EN PDF p.261; unit 2852 -->

9.4.4.31  RK_CNR_Params_V2_Select_t

<!-- Source EN PDF p.261; unit 2853 -->

【Описание】Определить атрибуты алгоритма шумоподавления в ручном режиме.

<!-- Source EN PDF p.261; unit 2854 -->

【Определение】

<!-- Source EN PDF p.261; unit 2855 -->

```text
 typedef struct RK_CNR_Params_V2_Select_s
 {
     int enable;
     // bypass
     int hf_bypass;
     int lf_bypass;
     // gain
     // gain
     float global_gain;
     float global_gain_alpha;
     float local_gain_scale;
     // strength adj by gain
     int gain_adj_strength_ratio[RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj;
     float color_sat_adj_alpha;
     // step1
     // median filter
     float hf_spikes_reducion_strength;
     // bilateral filter
     float hf_denoise_strength;
     float hf_color_sat;
     float hf_denoise_alpha;
     int hf_bf_wgt_clip;
     // step2
     // median filter
     float thumb_spikes_reducion_strength;
     // bilateral filter
     float thumb_denoise_strength;
     float thumb_color_sat;
     // step3
     // bilateral filter
     float lf_denoise_strength;
     float lf_color_sat;
     float lf_denoise_alpha;
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_Select_t;
```

<!-- Source EN PDF p.262; unit 2856 -->

【Члены】

<!-- Source EN PDF p.263; unit 2857 -->

| Имя параметра | Тип параметра | Описание параметра |
|---|---|---|
| Enable | Параметры настройки | Переключатель модуля: 1 — включён, 0 — выключен. |
| iso | Параметры настройки | Разным ступеням ISO соответствуют разные параметры настройки. Сейчас поддерживаются только 13 ступеней. |
| hf_bypass | Параметры настройки | Обход высокочастотного шумоподавления. 0: без обхода; 1: обход. |
| lf_bypass | Параметры настройки | Обход низкочастотного шумоподавления. 0: без обхода; 1: обход. |
| global_gain | Параметры настройки | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон от 0.0 до 64.0, по умолчанию 1. |
| global_gain_alpha | Параметры настройки | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон 0.0 1.0, по умолчанию 0. |
| global_gain_scale | Параметры настройки | Усиливает шумоподавление CNR; обычно используют значение по умолчанию, корректировать не рекомендуется. Диапазон 0, 128; по умолчанию 1. |
| gain_adj_strength_ratio | Параметры настройки | Корректирует фильтрацию по локальному усилению: меньшее значение усиливает подавление. Диапазон [1, 255], по умолчанию 255. |
| color_sat_adj | Параметры настройки | Отношение UV двустороннего фильтра с корректировкой по градиенту, 1~255. Меньшее значение улучшает удаление цветового шума. Диапазон [1, 255], по умолчанию 40. |
| color_sat_adj_alpha | Параметры настройки | Коэффициент корректировки color_sat_adj: большее значение улучшает удаление цветового шума. Диапазон 0, 1.0; по умолчанию 0.8. |
| hf_spikes_reducion_strength | Параметры настройки | Сила высокочастотной медианной фильтрации: чем больше значение, тем сильнее фильтрация. Диапазон 0, 1.0; по умолчанию 0.5. |

<!-- Source EN PDF p.264; unit 2858 -->

| Имя параметра | Тип параметра | Описание параметра |
|---|---|---|
| hf_denoise_strength | Параметры настройки | Сила высокочастотной двусторонней фильтрации: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 10. |
| hf_color_sat | Параметры настройки | Масштаб UV высокочастотного двустороннего фильтра: меньшее значение сильнее снижает насыщенность. Диапазон 0.0, 7.9; по умолчанию 1.5. |
| hf_denoise_alpha | Параметры настройки | Вес центральной точки высокочастотного двустороннего фильтра. Диапазон 0.0, 1.0; по умолчанию 0. |
| hf_bf_wgt_clip | Параметры настройки | Минимальное высокочастотное шумоподавление: большее значение усиливает подавление. Диапазон 0, 255; по умолчанию 0. |
| thumb_spikes_reducion_strength | Параметры настройки | Сила медианной фильтрации миниатюры: большее значение усиливает фильтрацию. Диапазон 0.0, 1.0; по умолчанию 0.5. |
| thumb_denoise_strength | Параметры настройки | Сила двусторонней фильтрации миниатюры: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 8. |
| thumb_color_sat | Параметры настройки | Масштаб UV двусторонней фильтрации миниатюры, сильнее снижает насыщенность (направление изменения в оригинале не указано). Диапазон 0.0, 7.9; по умолчанию 4. |
| lf_denoise_strength | Параметры настройки | Сила низкочастотной двусторонней фильтрации: большее значение улучшает удаление цветового шума. Диапазон [1, 1023], по умолчанию 8. |
| lf_color_sat | Параметры настройки | Коэффициент UV низкочастотной двусторонней фильтрации: меньшее значение сильнее снижает насыщенность. Диапазон 0.0, 7.9; по умолчанию 4. |
| lf_denoise_alpha | Параметры настройки | Вес центральной точки низкочастотного двустороннего фильтра. Диапазон 0.0, 1.0; по умолчанию 0.5. |
| kernel_5x5 | Параметры настройки | Ядро двустороннего фильтра 5x5. |

<!-- Source EN PDF p.265; unit 2859 -->

9.4.4.32  RK_CNR_Fix_V2_t

<!-- Source EN PDF p.265; unit 2860 -->

【Описание】Определить настройки регистров шумоподавления в ручном режиме.

<!-- Source EN PDF p.265; unit 2861 -->

【Определение】

<!-- Source EN PDF p.265; unit 2862 -->

```text
 typedef struct RK_CNR_Fix_V2_s {
     //ISP_CNR_2800_CTRL
     uint8_t cnr_thumb_mix_cur_en;
     uint8_t cnr_lq_bila_bypass;
     uint8_t cnr_hq_bila_bypass;
     uint8_t cnr_exgain_bypass;
     uint8_t cnr_en_i;
     // ISP_CNR_2800_EXGAIN
     uint8_t cnr_global_gain_alpha;
     uint16_t cnr_global_gain;
     // ISP_CNR_2800_GAIN_PARA
     uint8_t cnr_gain_iso;
     uint8_t cnr_gain_offset;
     uint8_t cnr_gain_1sigma;
     // ISP_CNR_2800_GAIN_UV_PARA
     uint8_t cnr_gain_uvgain1;
     uint8_t cnr_gain_uvgain0;
     // ISP_CNR_2800_LMED3
     uint8_t cnr_lmed3_alpha;
     // ISP_CNR_2800_LBF5_GAIN
     uint8_t cnr_lbf5_gain_y;
     uint8_t cnr_lbf5_gain_c;
     // ISP_CNR_2800_LBF5_WEITD0_4
     uint8_t cnr_lbf5_weit_d[5];
     // ISP_CNR_2800_HMED3
     uint8_t cnr_hmed3_alpha;
     // ISP_CNR_2800_HBF5
     uint8_t cnr_hbf5_weit_src;
     uint8_t cnr_hbf5_min_wgt;
     uint16_t cnr_hbf5_sigma;
     // ISP_CNR_2800_LBF3
     uint8_t cnr_lbf5_weit_src;
     uint16_t cnr_lbf3_sigma;
     //ISP_CNR_2800_SIGMA0-SIGMA3
     uint8_t cnr_sigma_y[13];
 } RK_CNR_Fix_V2_t;
```

<!-- Source EN PDF p.266; unit 2863 -->

【Поля】

<!-- Source EN PDF p.267; unit 2864 -->

| Имя параметра | Описание параметра |
|---|---|
| cnr_thumb_mix_cur_en | Разрешение смешивания миниатюры текущего кадра с предыдущим изображением: 1'b1: смешивание включено; 1'b0: выключено. Это считываемые регистры отображения. |
| cnr_lq_bila_bypass | Разрешение обхода низкочастотного двустороннего фильтра 3x3: 1'b1: обход включен, out_data равен in_data этого фильтра; 1'b0: обход выключен. Это считываемые регистры отображения. |
| cnr_hq_bila_bypass | Сигнал обхода высокочастотного двустороннего фильтра 5x5: 1: обход включен, out_data равен in_data; 0: обход выключен. Это считываемые регистры отображения. |
| cnr_exgain_bypass | sw_cnr_exgain_bypass — разрешение обхода внешнего усиления. 1: обход включен, внешнее усиление фиксировано на sw_cnr_egain_mux; 0: обход выключен, используется внешнее усиление. Текущая версия не поддерживает отключение обхода. Это считываемые регистры отображения. |
| cnr_en_i | Разрешение CNR: 1: включено; 0: выключено. |
| cnr_global_gain | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон от 0.0 до 64.0, по умолчанию 1. |
| cnr_global_gain_alpha | Сила интерполяции локального и глобального режимов CNR. Обычно оставляют значение по умолчанию и используют локальное усиление без настройки. Диапазон 0.0 1.0, по умолчанию 0. |
| cnr_gain_iso | Усиливает внешнее усиление, диапазон 0~128. |
| cnr_gain_offset | Смещение усиления ФНЧ при калибровке усиления, диапазон 0~16. |
| cnr_gain_1sigma | Усиливает выходные данные ФВЧ при калибровке усиления. |
| cnr_gain_uvgain1 | Параметр uvgain 1 |
| cnr_gain_uvgain0 | Параметр uvgain 0 |
| cnr_lmed3_alpha | Вес in_data в низкочастотном медианном фильтре, диапазон 0~16. |
| cnr_lbf5_gain_y; | Усиление Y двустороннего фильтра lbf5x5. |
| cnr_lbf5_gain_c; | Усиление UV двустороннего фильтра lbf5x5. |
| cnr_lbf5_weit_d[0] | Пространственный вес pix12, диапазон 1~128. |

<!-- Source EN PDF p.268; unit 2865 -->

| Имя параметра | Описание параметра |
|---|---|
| cnr_lbf5_weit_d[1] | Пространственный вес pix7,11,13,17, диапазон 0~128. |
| cnr_lbf5_weit_d[2] | Пространственный вес pix6,8,16,18, диапазон 0~128. |
| cnr_lbf5_weit_d[3] | Пространственный вес при расстоянии 4 или 5, диапазон 0~128. |
| cnr_lbf5_weit_d[4] | Пространственный вес pix0,4,20,24, диапазон 0~128. |
| cnr_hmed3_alpha | Вес in_data в высокочастотном медианном фильтре, диапазон 0~16. |
| cnr_hbf5_weit_src | Вес in_data фильтра hbf5x5, диапазон 0~128. |
| cnr_hbf5_min_wgt | Нижний предел weit_r фильтра hbf5x5. |
| cnr_hbf5_sigma | Значение Sigma фильтра hbf5x5. |
| cnr_lbf5_weit_src | Вес in_data фильтра lbf3x3, диапазон 0~128. |
| cnr_lbf3_sigma | Значение sigma фильтра lbf3x3. |

<!-- Source EN PDF p.268; unit 2866 -->

9.4.4.33  rk_aiq_cnr_strength_v2_t

<!-- Source EN PDF p.268; unit 2867 -->

【Описание】Определить структуру настройки интенсивности шумоподавления.

<!-- Source EN PDF p.268; unit 2868 -->

【Определение】

<!-- Source EN PDF p.268; unit 2869 -->

```text
 typedef struct rk_aiq_cnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_cnr_strength_v2_t;
```

<!-- Source EN PDF p.268; unit 2870 -->

【Члены】

<!-- Source EN PDF p.268; unit 2871 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| percent | Интенсивность шумоподавления, диапазон 0.0–1.0. |

<!-- Source EN PDF p.268; unit 2872 -->

### 9.5   BLC

<!-- Source EN PDF p.268; unit 2873 -->

#### 9.5.1 Описание функций

<!-- Source EN PDF p.268; unit 2874 -->

#### 9.5.2 Справочник функционального API

<!-- Source EN PDF p.268; unit 2875 -->

9.5.2.1  rk_aiq_user_api2_ablc_SetAttrib

<!-- Source EN PDF p.269; unit 2876 -->

【Описание】 Устанавливает свойства параметров BLC.

<!-- Source EN PDF p.269; unit 2877 -->

【Синтаксис】

<!-- Source EN PDF p.269; unit 2878 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2879 -->

【Параметры】

<!-- Source EN PDF p.269; unit 2880 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров BLC | Вход |

<!-- Source EN PDF p.269; unit 2881 -->

【Возвращаемое значение】

<!-- Source EN PDF p.269; unit 2882 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.269; unit 2883 -->

【Зависимости】

<!-- Source EN PDF p.269; unit 2884 -->

Заголовочный файл: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.269; unit 2885 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.269; unit 2886 -->

9.5.2.2  rk_aiq_user_api2_ablc_GetAttrib

<!-- Source EN PDF p.269; unit 2887 -->

【Описание】 Получает свойства параметров BLC.

<!-- Source EN PDF p.269; unit 2888 -->

【Синтаксис】

<!-- Source EN PDF p.269; unit 2889 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2890 -->

【Параметры】

<!-- Source EN PDF p.269; unit 2891 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров BLC | Вход |

<!-- Source EN PDF p.270; unit 2892 -->

【Возвращаемое значение】

<!-- Source EN PDF p.270; unit 2893 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.270; unit 2894 -->

【Зависимости】

<!-- Source EN PDF p.270; unit 2895 -->

Заголовочный файл: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.270; unit 2896 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.270; unit 2897 -->

#### 9.5.3 Типы данных модульного API

<!-- Source EN PDF p.270; unit 2898 -->

9.5.3.1  rk_aiq_blc_attrib_t

<!-- Source EN PDF p.270; unit 2899 -->

【Описание】 Параметры модуля BLC.

<!-- Source EN PDF p.270; unit 2900 -->

【Определение】

<!-- Source EN PDF p.270; unit 2901 -->

```text
 typedef struct rk_aiq_blc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     AblcOPMode_t eMode;
     AblcParams_t stBlc0Auto;
     AblcParams_t stBlc1Auto;
     AblcManualAttr_t stBlc0Manual;
     AblcManualAttr_t stBlc1Manual;
 } rk_aiq_blc_attrib_t;
```

<!-- Source EN PDF p.270; unit 2902 -->

【Члены】

<!-- Source EN PDF p.270; unit 2903 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Режим модуля BLC |
| stBlc0Auto | Параметр автоматического режима blc0 |
| stBlc0Manual | Параметр ручного режима blc0 |
| stBlc1Auto | Параметр автоматического режима blc1 |
| stBlc1Manual | Параметр ручного режима blc1 |

<!-- Source EN PDF p.271; unit 2904 -->

9.5.3.2  AblcOPMode_t

<!-- Source EN PDF p.271; unit 2905 -->

【Описание】 Определяет свойства режима модуля шумоподавления.

<!-- Source EN PDF p.271; unit 2906 -->

【Определение】

<!-- Source EN PDF p.271; unit 2907 -->

```text
 typedef enum AblcOPMode_e {
     ABLC_OP_MODE_OFF         = 0,
     ABLC_OP_MODE_AUTO             = 1,
     ABLC_OP_MODE_MANUAL           = 2,
     ABLC_OP_MODE_MAX
 } AblcOPMode_t;
```

<!-- Source EN PDF p.271; unit 2908 -->

【Члены】

<!-- Source EN PDF p.271; unit 2909 -->

| Имя члена | Описание |
|---|---|
| ABLC_OP_MODE_OFF | Недопустимый режим BLC |
| ABLC_OP_MODE_AUTO | Автоматический режим BLC |
| ABLC_OP_MODE_MANUAL | Настройки алгоритма ручного режима BLC |
| ABLC_OP_MODE_MAX | Максимальное значение режима BLC; недопустимый режим. |

<!-- Source EN PDF p.271; unit 2910 -->

9.5.3.3  AblcParams_t

<!-- Source EN PDF p.271; unit 2911 -->

【Описание】 Параметры автоматического режима BLC.

<!-- Source EN PDF p.271; unit 2912 -->

【Определение】

<!-- Source EN PDF p.271; unit 2913 -->

```text
 typedef struct AblcParams_s {
     bool enable;
     int len;
     float* iso;
     float* blc_r;
     float* blc_gr;
     float* blc_gb;
     float* blc_b;
 } AblcParams_t;
```

<!-- Source EN PDF p.271; unit 2914 -->

【Члены】

<!-- Source EN PDF p.272; unit 2915 -->

| Имя члена | Описание |
|---|---|
| enable | Переключатель модуля: 1: включен; 0: выключен. |
| len | Длина массива, соответствующая iso |
| iso | Ступень ISO |
| blc_r | Значения BLC для разных ISO; указатель массива. |
| blc_gr | Значения BLC для разных ISO; указатель массива. |
| blc_gb | Значения BLC для разных ISO; указатель массива. |
| blc_b | Значения BLC для разных ISO; указатель массива. |

<!-- Source EN PDF p.272; unit 2916 -->

9.5.3.4  AblcManualAttr_t

<!-- Source EN PDF p.272; unit 2917 -->

【Описание】 Параметры ручного режима BLC.

<!-- Source EN PDF p.272; unit 2918 -->

【Определение】

<!-- Source EN PDF p.272; unit 2919 -->

```text
 typedef struct AblcSelect_s {
     bool enable;
     short int blc_r;
     short int blc_gr;
     short int blc_gb;
     short int blc_b;
 } AblcSelect_t;
 typedef AblcSelect_t AblcManualAttr_t;
```

<!-- Source EN PDF p.272; unit 2920 -->

【Члены】

<!-- Source EN PDF p.272; unit 2921 -->

| Имя члена | Описание |
|---|---|
| enable | Переключатель модуля: 1: включен; 0: выключен. |
| blc_r | Свойства канала R модуля BLC |
| blc_gr | Свойства канала gr модуля BLC |
| blc_gb | Свойства канала GB модуля BLC |
| blc_b | Свойства канала B модуля BLC |

<!-- Source EN PDF p.273; unit 2922 -->

### 9.6 Удаление дымки и усиление

<!-- Source EN PDF p.273; unit 2923 -->

#### 9.6.1 Описание функций

<!-- Source EN PDF p.273; unit 2924 -->

Удаление дымки и усиление включают 2 режима:

<!-- Source EN PDF p.273; unit 2925 -->

Удаление дымки улучшает изображение динамическим изменением контраста и яркости.

<!-- Source EN PDF p.273; unit 2926 -->

Усиление контраста локальных областей изображения.

<!-- Source EN PDF p.273; unit 2927 -->

Удаление дымки и усиление взаимоисключающие.

<!-- Source EN PDF p.273; unit 2928 -->

#### 9.6.2 Справочник функционального API

<!-- Source EN PDF p.273; unit 2929 -->

9.6.2.1  rk_aiq_uapi2_setDehazeModuleEnable

<!-- Source EN PDF p.273; unit 2930 -->

【Описание】

<!-- Source EN PDF p.273; unit 2931 -->

Задает переключатель модуля удаления дымки, управляя stAuto.DehazeTuningPara.Enable или stManual.Enable (изменяется автоматически согласно текущему режиму API).

<!-- Source EN PDF p.273; unit 2932 -->

【Синтаксис】

<!-- Source EN PDF p.273; unit 2933 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeModuleEnable(const rk_aiq_sys_ctx_t* ctx, bool
 on);
```

<!-- Source EN PDF p.273; unit 2934 -->

【Параметр】

<!-- Source EN PDF p.273; unit 2935 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Функция переключения. | Вход |

<!-- Source EN PDF p.273; unit 2936 -->

【Возвращаемое значение】

<!-- Source EN PDF p.273; unit 2937 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок. |

<!-- Source EN PDF p.273; unit 2938 -->

【Зависимости】

<!-- Source EN PDF p.273; unit 2939 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.273; unit 2940 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.274; unit 2941 -->

9.6.2.2  rk_aiq_uapi2_setDehazeEnable

<!-- Source EN PDF p.274; unit 2942 -->

【Описание】

<!-- Source EN PDF p.274; unit 2943 -->

Задает переключатель функции удаления дымки: stAuto.DehazeTuningPara.dehaze_setting.en или stManual.dehaze_setting.en (автоматически согласно текущему режиму API).

<!-- Source EN PDF p.274; unit 2944 -->

【Синтаксис】

<!-- Source EN PDF p.274; unit 2945 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.274; unit 2946 -->

【Параметр】

<!-- Source EN PDF p.274; unit 2947 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Функция переключения. | Вход |

<!-- Source EN PDF p.274; unit 2948 -->

【Возвращаемое значение】

<!-- Source EN PDF p.274; unit 2949 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок. |

<!-- Source EN PDF p.274; unit 2950 -->

【Зависимости】

<!-- Source EN PDF p.274; unit 2951 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.274; unit 2952 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.274; unit 2953 -->

9.6.2.3  rk_aiq_uapi2_setMDehazeStrth

<!-- Source EN PDF p.274; unit 2954 -->

【Описание】

<!-- Source EN PDF p.274; unit 2955 -->

Задает ручную силу удаления дымки относительно 50: выше 50 усиливает удаление, ниже 50 ослабляет.

<!-- Source EN PDF p.274; unit 2956 -->

DEHAZE_API_AUTO и DEHAZE_API_MANUAL устанавливаются как режим API.

<!-- Source EN PDF p.274; unit 2957 -->

Перед этим API убедитесь, что удаление дымки действует, либо вызовите rk_aiq_uapi2_setDehazeModuleEnable и rk_aiq_uapi2_setDehazeEnable (порядок см. в Case 6 файла sample_adehaze_module.cpp).

<!-- Source EN PDF p.274; unit 2958 -->

【Синтаксис】

<!-- Source EN PDF p.274; unit 2959 -->

```text
 XCamReturn rk_aiq_uapi2_setMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.274; unit 2960 -->

【Параметры】

<!-- Source EN PDF p.275; unit 2961 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень, диапазон [1,100], по умолчанию 50, точность 1. | Вход |

<!-- Source EN PDF p.275; unit 2962 -->

【Возвращаемое значение】

<!-- Source EN PDF p.275; unit 2963 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.275; unit 2964 -->

【Зависимости】

<!-- Source EN PDF p.275; unit 2965 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2966 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.275; unit 2967 -->

9.6.2.4  rk_aiq_uapi2_getMDehazeStrth

<!-- Source EN PDF p.275; unit 2968 -->

【Описание】

<!-- Source EN PDF p.275; unit 2969 -->

Получает ручную силу удаления дымки.

<!-- Source EN PDF p.275; unit 2970 -->

【Синтаксис】

<!-- Source EN PDF p.275; unit 2971 -->

```text
 XCamReturn rk_aiq_uapi2_getMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int* level);
```

<!-- Source EN PDF p.275; unit 2972 -->

【Параметры】

<!-- Source EN PDF p.275; unit 2973 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень, диапазон [1,100], по умолчанию 50, точность 1. | Выход |

<!-- Source EN PDF p.275; unit 2974 -->

【Возвращаемое значение】

<!-- Source EN PDF p.275; unit 2975 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.275; unit 2976 -->

【Зависимости】

<!-- Source EN PDF p.275; unit 2977 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2978 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.276; unit 2979 -->

9.6.2.5  rk_aiq_uapi2_setEnhanceEnable

<!-- Source EN PDF p.276; unit 2980 -->

【Описание】

<!-- Source EN PDF p.276; unit 2981 -->

Задает переключатель функции Dehaze через stAuto.DehazeTuningPara.enhance_setting.en или stManual.enhance_setting.en (автоматически согласно текущему режиму API; в оригинале указано Dehaze).

<!-- Source EN PDF p.276; unit 2982 -->

【Синтаксис】

<!-- Source EN PDF p.276; unit 2983 -->

```text
 XCamReturn rk_aiq_uapi2_setEnhanceEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.276; unit 2984 -->

【Параметры】

<!-- Source EN PDF p.276; unit 2985 -->

| Возвращаемое значение | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| on | Функция переключения. | Вход |

<!-- Source EN PDF p.276; unit 2986 -->

【Возвращаемое значение】

<!-- Source EN PDF p.276; unit 2987 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.276; unit 2988 -->

【Зависимости】

<!-- Source EN PDF p.276; unit 2989 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.276; unit 2990 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.276; unit 2991 -->

9.6.2.6  rk_aiq_uapi2_setMEnhanceStrth

<!-- Source EN PDF p.276; unit 2992 -->

【Описание】

<!-- Source EN PDF p.276; unit 2993 -->

Задает ручную силу усиления контраста относительно 50: выше 50 увеличивает контраст, ниже 50 уменьшает.

<!-- Source EN PDF p.276; unit 2994 -->

DEHAZE_API_AUTO и DEHAZE_API_MANUAL устанавливаются как режим API.

<!-- Source EN PDF p.276; unit 2995 -->

Перед этим API убедитесь, что усиление действует, либо вызовите rk_aiq_uapi2_setDehazeModuleEnable и rk_aiq_uapi2_setEnhanceEnable (порядок см. в Case 9 файла sample_adehaze_module.cpp).

<!-- Source EN PDF p.276; unit 2996 -->

【Синтаксис】

<!-- Source EN PDF p.276; unit 2997 -->

```text
 XCamReturn rk_aiq_uapi2_setMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int level);
```

<!-- Source EN PDF p.276; unit 2998 -->

【Параметры】

<!-- Source EN PDF p.277; unit 2999 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень, диапазон [1,100], по умолчанию 50, точность 1. | Вход |

<!-- Source EN PDF p.277; unit 3000 -->

【Возвращаемое значение】

<!-- Source EN PDF p.277; unit 3001 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.277; unit 3002 -->

【Зависимости】

<!-- Source EN PDF p.277; unit 3003 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3004 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.277; unit 3005 -->

9.6.2.7  rk_aiq_uapi2_getMEnhanceStrth

<!-- Source EN PDF p.277; unit 3006 -->

【Описание】

<!-- Source EN PDF p.277; unit 3007 -->

Получает ручную силу усиления контраста.

<!-- Source EN PDF p.277; unit 3008 -->

【Синтаксис】

<!-- Source EN PDF p.277; unit 3009 -->

```text
 XCamReturn rk_aiq_uapi2_getMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int *level);
```

<!-- Source EN PDF p.277; unit 3010 -->

【Параметры】

<!-- Source EN PDF p.277; unit 3011 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень, диапазон [1,100], по умолчанию 50, точность 1. | Выход |

<!-- Source EN PDF p.277; unit 3012 -->

【Возвращаемое значение】

<!-- Source EN PDF p.277; unit 3013 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.277; unit 3014 -->

【Зависимости】

<!-- Source EN PDF p.277; unit 3015 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3016 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.278; unit 3017 -->

#### 9.6.3 Справочник модульного API

<!-- Source EN PDF p.278; unit 3018 -->

9.6.3.1  rk_aiq_user_api2_adehaze_v12_setSwAttrib

<!-- Source EN PDF p.278; unit 3019 -->

【Описание】

<!-- Source EN PDF p.278; unit 3020 -->

Устанавливает параметры удаления дымки.

<!-- Source EN PDF p.278; unit 3021 -->

【Синтаксис】

<!-- Source EN PDF p.278; unit 3022 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_setSwAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3023 -->

【Параметры】

<!-- Source EN PDF p.278; unit 3024 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры удаления дымки | Вход |

<!-- Source EN PDF p.278; unit 3025 -->

【Возвращаемое значение】

<!-- Source EN PDF p.278; unit 3026 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.278; unit 3027 -->

9.6.3.2  rk_aiq_user_api2_adehaze_getSwAttrib

<!-- Source EN PDF p.278; unit 3028 -->

【Описание】

<!-- Source EN PDF p.278; unit 3029 -->

Получает текущие параметры удаления дымки.

<!-- Source EN PDF p.278; unit 3030 -->

【Синтаксис】

<!-- Source EN PDF p.278; unit 3031 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_getSwAttrib(const rk_aiq_sys_ctx_t*
 sys_ctx,adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3032 -->

【Параметры】

<!-- Source EN PDF p.278; unit 3033 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры удаления дымки | Выход |

<!-- Source EN PDF p.278; unit 3034 -->

【Возвращаемое значение】

<!-- Source EN PDF p.279; unit 3035 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.279; unit 3036 -->

#### 9.6.4 Типы данных модульного API

<!-- Source EN PDF p.279; unit 3037 -->

9.6.4.1  dehaze_api_mode_t

<!-- Source EN PDF p.279; unit 3038 -->

【Описание】 Определяет режим работы модуля удаления дымки.

<!-- Source EN PDF p.279; unit 3039 -->

【Определение】

<!-- Source EN PDF p.279; unit 3040 -->

```text
 typedef enum dehaze_api_mode_e {
     DEHAZE_API_AUTO   = 0,
     DEHAZE_API_MANUAL = 1,
 } dehaze_api_mode_t;
```

<!-- Source EN PDF p.279; unit 3041 -->

【Члены】

<!-- Source EN PDF p.279; unit 3042 -->

| Имя члена | Описание |
|---|---|
| DEHAZE_API_AUTO | Автоматический режим удаления дымки |
| DEHAZE_API_MANUAL | Ручной режим удаления дымки |

<!-- Source EN PDF p.279; unit 3043 -->

9.6.4.2  DehazeDataV21_t

<!-- Source EN PDF p.279; unit 3044 -->

【Описание】 Определяет свойства параметров настройки автоматического удаления дымки.

<!-- Source EN PDF p.279; unit 3045 -->

【Определение】

<!-- Source EN PDF p.279; unit 3046 -->

```text
 typedef struct DehazeDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* dc_min_th;
     int    dc_min_th_len;
     float* dc_max_th;
     int    dc_max_th_len;
     float* yhist_th;
     int    yhist_th_len;
     float* yblk_th;
     int    yblk_th_len;
     float* dark_th;
     int    dark_th_len;
     float* bright_min;
     int    bright_min_len;
     float* bright_max;
     int    bright_max_len;
     float* wt_max;
     int    wt_max_len;
     float* air_min;
     int    air_min_len;
     float* air_max;
     int    air_max_len;
     float* tmax_base;
     int    tmax_base_len;
     float* tmax_off;
     int    tmax_off_len;
     float* tmax_max;
     int    tmax_max_len;
     float* cfg_wt;
     int    cfg_wt_len;
     float* cfg_air;
     int    cfg_air_len;
     float* cfg_tmax;
     int    cfg_tmax_len;
     float* dc_weitcur;
     int    dc_weitcur_len;
     float* bf_weight;
     int    bf_weight_len;
     float* range_sigma;
     int    range_sigma_len;
     float* space_sigma_pre;
     int    space_sigma_pre_len;
     float* space_sigma_cur;
     int    space_sigma_cur_len;
 } DehazeDataV21_t;
```

<!-- Source EN PDF p.280; unit 3047 -->

【Поля】

<!-- Source EN PDF p.281; unit 3048 -->

| Имя поля | Описание |
|---|---|
| EnvLv | Яркость окружающей среды |
| EnvLv_len | Длина массива EnvLv |
| dc_min_th | Диапазон статистики адаптивного WT: [16, 120], по умолчанию 64. |
| dc_min_th_len | Длина массива dc_min_th |
| dc_max_th | Диапазон статистики областей высокой экспозиции адаптивного WT: [170, 255], по умолчанию 192. |
| dc_max_th_len | Длина массива dc_max_th |
| yhist_th | Диапазон статистики областей высокой экспозиции компоненты Y: [170, 255], по умолчанию 249. |
| yhist_th_len | Длина массива yhist_th |
| yblk_th | Порог доли числа блоков компоненты Y: 0.002, 0.01; по умолчанию 0.002. |
| yblk_th_len | Длина массива yblk_th |
| dark_th | Минимальный порог блока компоненты Y для адаптивного WT, диапазон [230, 250], по умолчанию 250. |
| dark_th_len | Длина массива dark_th |
| bright_min | Минимальный адаптивный порог AIR, диапазон от 160 до 200, по умолчанию 180. |
| bright_min_len | Длина массива bright_min |
| bright_max | Максимальный адаптивный порог AIR, диапазон от 210 до 250, по умолчанию 240. |
| bright_max_len | Длина массива bright_max |
| wt_max | Максимум WT: 0.75, 0.9; по умолчанию 0.9. |
| wt_max_len | Длина массива wt_max |
| air_min | Минимальное адаптивное значение AIR, диапазон от 200 до 220, по умолчанию 200. |
| air_min_len | Длина массива air_min |
| air_max | Максимальное адаптивное значение AIR: 230, 250; по умолчанию 250. |
| air_max_len | Длина массива air_max |
| tmax_base | По умолчанию tmax равен 125; соответствующие настройки: 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105); рекомендуется 131-105. |

<!-- Source EN PDF p.282; unit 3049 -->

| Имя поля | Описание |
|---|---|
| tmax_base_len | Длина массива tmax_base |
| tmax_off | Фиксированное значение адаптивного tmax, диапазон [0.1, 0.5], по умолчанию 0.1. |
| tmax_off_len | Длина массива tmax_off |
| tmax_max | Максимум tmax: 0.1, 0.5; по умолчанию 0.5. |
| tmax_max_len | Длина массива tmax_max |
| cfg_wt | Программно заданный wt — сила удаления дымки, диапазон [0, 1], по умолчанию 0.8. |
| cfg_wt_len | Длина массива cfg_wt |
| cfg_air | Программно заданный air — коэффициент атмосферного света, диапазон [0, 255], по умолчанию 210. |
| cfg_air_len | Длина массива cfg_air |
| cfg_tmax | Программно заданный tmax — максимальное значение удаления дымки, диапазон [0, 1], по умолчанию 0.2. |
| cfg_tmax_len | Длина массива cfg_tmax |
| bf_weight | Вес объединения двух двусторонних фильтров, диапазон [0, 1], по умолчанию 0.5. |
| bf_weight_len | Длина массива bf_weight |
| dc_weitcur | Вес темного канала, диапазон [0, 1]; значение по умолчанию упомянуто, но не приведено. |
| dc_weitcur_len | Длина массива dc_weitcur |
| range_sigma | Sigma диапазона двустороннего фильтра, диапазон [0, 1], по умолчанию 0.4. |
| range_sigma_len | Длина массива range_sigma |
| space_sigma_pre | Пространственная sigma двустороннего фильтра при опоре на данные IIR, диапазон [0, 1], по умолчанию 0.4. |
| space_sigma_pre_len | Длина массива space_sigma_pre |
| space_sigma_cur | Пространственная sigma двустороннего фильтра при опоре на текущие данные, диапазон [0, 1], по умолчанию 0.8. |
| space_sigma_cur_len | Длина массива space_sigma_cur |

<!-- Source EN PDF p.283; unit 3050 -->

9.6.4.3  Dehaze_Setting_V21_t

<!-- Source EN PDF p.283; unit 3051 -->

【Описание】 Определяет параметры автоматического удаления дымки.

<!-- Source EN PDF p.283; unit 3052 -->

【Определение】

<!-- Source EN PDF p.283; unit 3053 -->

```text
 typedef struct Dehaze_Setting_V21_s{
     bool            en;
     bool            air_lc_en;
     float           stab_fnum;
     float           sigma;
     float           wt_sigma;
     float           air_sigma;
     float           tmax_sigma;
     float           pre_wet;
     DehazeDataV21_t DehazeData;
 } Dehaze_Setting_V21_t;
```

<!-- Source EN PDF p.283; unit 3054 -->

【Члены】

<!-- Source EN PDF p.283; unit 3055 -->

| Имя члена | Описание |
|---|---|
| en | Включение функции |
| air_lc_en | Использовать ли Airlight Base для переключения минимального значения Airlight (формулировка оригинала неясна). |
| stab_fnum | Максимальное значение стабилизации кадров. |
| sigma | Sigma управления IIR. |
| wt_sigma | Коэффициент межкадровой фильтрации WT. |
| air_sigma | Коэффициент межкадровой фильтрации AIR. |
| tmax_sigma | Коэффициент межкадровой фильтрации Tmax. |
| pre_wet | Коэффициент IIR-фильтрации опорных данных. |
| DehazeData | Параметры настройки удаления дымки. |

<!-- Source EN PDF p.283; unit 3056 -->

9.6.4.4  EnhanceDataV21_t

<!-- Source EN PDF p.283; unit 3057 -->

【Описание】 Определяет свойства параметров настройки автоматического усиления.

<!-- Source EN PDF p.283; unit 3058 -->

【Определение】

<!-- Source EN PDF p.284; unit 3059 -->

```text
 typedef struct EnhanceDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* enhance_value;
     int    enhance_value_len;
     float* enhance_chroma;
     int    enhance_chroma_len;
 } EnhanceDataV21_t;
```

<!-- Source EN PDF p.284; unit 3060 -->

【Члены】

<!-- Source EN PDF p.284; unit 3061 -->

| Имя члена | Описание |
|---|---|
| EnvLv | Яркость окружающей среды |
| EnvLv_len | Длина массива яркости окружающей среды. |
| enhance_value | Общая сила контраста, диапазон [0,16], рекомендуется [1, 2]. |
| enhance_value_len | Длина массива enhance_value |
| enhance_chroma | Параметр корректировки усиления цветности, диапазон [0, 16], рекомендуется [1, 2]. |
| enhance_chroma_len | Длина массива enhance_chroma |

<!-- Source EN PDF p.284; unit 3062 -->

9.6.4.5  Enhance_Setting_V21_t

<!-- Source EN PDF p.284; unit 3063 -->

【Описание】 Определяет свойства параметров автоматического усиления.

<!-- Source EN PDF p.284; unit 3064 -->

【Определение】

<!-- Source EN PDF p.284; unit 3065 -->

```text
 typedef struct Enhance_Setting_V21_s{
     bool             en;
     float            enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     EnhanceDataV21_t EnhanceData;
 } Enhance_Setting_V21_t;
```

<!-- Source EN PDF p.284; unit 3066 -->

【Члены】

<!-- Source EN PDF p.284; unit 3067 -->

| Имя члена | Описание |
|---|---|
| en | Переключатель усиления. 0: выключено; 1: включено. |
| enhance_curve | Низкочастотная кривая. |
| EnhanceData | Параметры настройки усиления. |

<!-- Source EN PDF p.285; unit 3068 -->

9.6.4.6  Hist_setting_V21_t

<!-- Source EN PDF p.285; unit 3069 -->

【Описание】 Определяет свойства параметров настройки автоматического hist.

<!-- Source EN PDF p.285; unit 3070 -->

【Определение】

<!-- Source EN PDF p.285; unit 3071 -->

```text
 typedef struct HistDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* hist_gratio;
     int    hist_gratio_len;
     float* hist_th_off;
     int    hist_th_off_len;
     float* hist_k;
     int    hist_k_len;
     float* hist_min;
     int    hist_min_len;
     float* hist_scale;
     int    hist_scale_len;
     float* cfg_gratio;
     int    cfg_gratio_len;
 } HistDataV21_t;
```

<!-- Source EN PDF p.285; unit 3072 -->

【Члены】

<!-- Source EN PDF p.286; unit 3073 -->

| Имя члена | Описание |
|---|---|
| EnvLv | Яркость окружающей среды |
| EnvLv_len | Длина массива EnvLv |
| hist_gratio | Кратность растяжения гистограммы, коэффициент управления выравниванием гистограммы; диапазон [0, 32]. |
| hist_gratio_len | Длина массива hist_gratio |
| hist_th_off | Порог статистики гистограммы, диапазон от 0 до 255, по умолчанию 64. |
| hist_th_off_len | Длина массива hist_th_off |
| hist_k | Множитель адаптивного порога гистограммы, диапазон от 0 до 7, значение 2. |
| hist_k_len | Длина массива hist_k |
| hist_min | Минимум статистического порога гистограммы: в оригинале диапазон «0,2 to 0.016»; сохранен для проверки. |
| hist_min_len | Длина массива hist_min |
| hist_scale | Коэффициенты управления выравниванием гистограммы, диапазон [0, 32]. |
| hist_scale_len | Длина массива hist_scale |
| cfg_gratio | Программно заданные кратность растяжения и коэффициент управления выравниванием гистограммы, диапазон [0, 32]. |
| cfg_gratio_len | Длина массива cfg_gratio |

<!-- Source EN PDF p.286; unit 3074 -->

9.6.4.7  Hist_setting_V21_t

<!-- Source EN PDF p.286; unit 3075 -->

【Описание】 Определяет свойства параметров автоматической функции hist.

<!-- Source EN PDF p.286; unit 3076 -->

【Определение】

<!-- Source EN PDF p.286; unit 3077 -->

```text
 typedef struct Hist_setting_V21_s{
     bool          en;
     bool          hist_para_en;
     HistDataV21_t HistData;
 } Hist_setting_V21_t;
```

<!-- Source EN PDF p.286; unit 3078 -->

【Члены】

<!-- Source EN PDF p.287; unit 3079 -->

| Имя члена | Описание |
|---|---|
| en | Переключатель функции Hist. |
| hist_para_en | Переключатель управления растяжением гистограммы. |
| HistData | Параметры настройки hist. |

<!-- Source EN PDF p.287; unit 3080 -->

9.6.4.8  CalibDbDehazeV21_t

<!-- Source EN PDF p.287; unit 3081 -->

【Описание】 Определяет свойства параметров настройки автоматического модуля удаления дымки.

<!-- Source EN PDF p.287; unit 3082 -->

【Определение】

<!-- Source EN PDF p.287; unit 3083 -->

```text
 typedef struct CalibDbDehazeV21_s{
     bool                  Enable;
     float                 cfg_alpha;
     float                 ByPassThr;
     Dehaze_Setting_V21_t  dehaze_setting;
     Enhance_Setting_V21_t enhance_setting;
     Hist_setting_V21_t    hist_setting;
 } CalibDbDehazeV21_t;
```

<!-- Source EN PDF p.287; unit 3084 -->

【Члены】

<!-- Source EN PDF p.287; unit 3085 -->

| Имя члена | Описание |
|---|---|
| Enable | Включение функции |
| cfg_alpha | Доля ручной программной настройки, диапазон 0, 1; по умолчанию 1, точность 0.01. |
| dehaze_setting | Параметр автоматического удаления дымки. |
| enhance_setting | Параметр автоматического усиления. |
| hist_setting | Параметр автоматической функции hist |

<!-- Source EN PDF p.287; unit 3086 -->

9.6.4.9  CalibDbV2_dehaze_v21_t

<!-- Source EN PDF p.287; unit 3087 -->

【Описание】 Определяет свойства автоматического модуля удаления дымки.

<!-- Source EN PDF p.287; unit 3088 -->

【Определение】

<!-- Source EN PDF p.287; unit 3089 -->

```text
 typedef struct CalibDbV2_dehaze_V21_s{
     CalibDbDehazeV21_t DehazeTuningPara;
 } CalibDbV2_dehaze_V21_t;
```

<!-- Source EN PDF p.287; unit 3090 -->

【Члены】

<!-- Source EN PDF p.288; unit 3091 -->

| Имя члена | Описание |
|---|---|
| DehazeTuningPara | Параметры настройки автоматического модуля удаления дымки |

<!-- Source EN PDF p.288; unit 3092 -->

9.6.4.10  mDehazeDataV21_t

<!-- Source EN PDF p.288; unit 3093 -->

【Описание】 Определяет свойства ручного DehazeData.

<!-- Source EN PDF p.288; unit 3094 -->

【Определение】

<!-- Source EN PDF p.288; unit 3095 -->

```text
 typedef struct mDehazeDataV21_s {
     float dc_min_th;
     float dc_max_th;
     float yhist_th;
     float yblk_th;
     float dark_th;
     float bright_min;
     float bright_max;
     float wt_max;
     float air_min;
     float air_max;
     float tmax_base;
     float tmax_off;
     float tmax_max;
     float cfg_wt;
     float cfg_air;
     float cfg_tmax;
     float dc_weitcur;
     float bf_weight;
     float range_sigma;
     float space_sigma_pre;
     float space_sigma_cur;
 } mDehazeDataV21_t;
```

<!-- Source EN PDF p.288; unit 3096 -->

【Члены】

<!-- Source EN PDF p.289; unit 3097 -->

| Имя поля | Описание |
|---|---|
| dc_min_th | Диапазон статистики адаптивного WT: [16, 120], по умолчанию 64, точность 0.1. |
| dc_max_th | Диапазон статистики высокоэкспонированных областей адаптивного WT: [170, 255], по умолчанию 192, точность 0.1. |
| yhist_th | Диапазон статистики высокоэкспонированных областей компоненты Y: [170, 255], по умолчанию 249, точность 0.1. |
| yblk_th | Порог доли числа блоков компоненты Y, диапазон [0.002, 0.01], по умолчанию 0.002, точность 0.1. |
| dark_th | Минимальный порог блока Y адаптивного WT, диапазон [230, 250], по умолчанию 250, точность 0.1. |
| bright_min | Минимальный адаптивный порог AIR, диапазон [160, 200], по умолчанию 180, точность 0.1. |
| bright_max | Максимальный адаптивный порог AIR, диапазон [210, 250], по умолчанию 240, точность 0.1. |
| wt_max | Верхний предел адаптивного wt, диапазон [0.75, 0.9], по умолчанию 0.9, точность 0.001. |
| air_min | Нижний предел адаптивного air, диапазон [200, 220], по умолчанию 200, точность 0.001. |
| air_max | Верхний предел адаптивного AIR, диапазон [230, 250], по умолчанию 250, точность 0.001. |
| tmax_base | Базовое значение адаптивного tmax, по умолчанию 125; настройки: 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105); рекомендуется 131-105. |
| tmax_off | Фиксированное значение адаптивного Tmax, диапазон [0.1, 0.5], по умолчанию 0.1, точность 0.1. |
| tmax_max | Максимум адаптивного tmax, диапазон [0.1, 0.5], по умолчанию 0.5, точность 0.1. |
| cfg_wt | Программно заданный wt (сила удаления дымки), диапазон [0, 1], по умолчанию 0.8, точность 0.001. |
| cfg_air | Программно заданный air (коэффициент атмосферного света), диапазон [0, 255], по умолчанию 210, точность 0.001. |
| cfg_tmax | Программно заданный tmax (максимум удаления дымки), диапазон [0, 1], по умолчанию 0.2, точность 0.001. |
| bf_weight | Вес объединения двух двусторонних фильтров, диапазон [0, 1], по умолчанию 0.5, точность 0.1. |
| dc_weitcur | Двусторонний вес темного канала, диапазон [0, 1], по умолчанию 1, точность 0.1. |
| range_sigma | Sigma диапазона двустороннего фильтра, диапазон [0, 1], по умолчанию 0.4, точность 0.1. |

<!-- Source EN PDF p.290; unit 3098 -->

| Имя поля | Описание |
|---|---|
| space_sigma_pre | Пространственная sigma двустороннего фильтра при опоре на IIR, диапазон [0, 1], по умолчанию 0.4, точность 0.1. |
| space_sigma_cur | Пространственная sigma двустороннего фильтра при опоре на текущие данные, диапазон [0, 1], по умолчанию 0.8, точность 0.1. |

<!-- Source EN PDF p.290; unit 3099 -->

9.6.4.11  mDehaze_setting_v21_t

<!-- Source EN PDF p.290; unit 3100 -->

【Описание】 Определяет свойства ручной функции удаления дымки.

<!-- Source EN PDF p.290; unit 3101 -->

【Определение】

<!-- Source EN PDF p.290; unit 3102 -->

```text
 typedef struct mDehaze_setting_v21_s {
     bool             en;
     bool             air_lc_en;
     float            stab_fnum;
     float            sigma;
     float            wt_sigma;
     float            air_sigma;
     float            tmax_sigma;
     float            pre_wet;
     mDehazeDataV21_t DehazeData;
 } mDehaze_setting_V21_t;
```

<!-- Source EN PDF p.290; unit 3103 -->

【Члены】

<!-- Source EN PDF p.291; unit 3104 -->

| Имя члена | Описание |
|---|---|
| en | Включение функции |
| air_lc_en | Переключатель использования Airlight Base для отсечения минимального значения. |
| stab_fnum | Максимум стабилизации кадров, диапазон [0,31], по умолчанию 8, точность 0.01. |
| sigma | Sigma управления IIR, диапазон 0,255, по умолчанию 6, точность 1. |
| wt_sigma | Коэффициент межкадровой фильтрации wt, диапазон [0,255], по умолчанию 8, точность 1. |
| air_sigma | Коэффициент межкадровой фильтрации air, диапазон 0,255, по умолчанию 12, точность 1. |
| tmax_sigma | Коэффициент межкадровой фильтрации Tmax, диапазон [0,1], по умолчанию 0.01, точность 0.0001. |
| pre_wet | Коэффициент IIR-фильтрации опорных данных, диапазон [0,1], по умолчанию 0.01, точность 0.0001. |
| DehazeData | Параметр настройки удаления дымки |

<!-- Source EN PDF p.291; unit 3105 -->

9.6.4.12  mEnhanceDataV21_t

<!-- Source EN PDF p.291; unit 3106 -->

【Описание】 Определяет свойства ручного EnhanceData.

<!-- Source EN PDF p.291; unit 3107 -->

【Определение】

<!-- Source EN PDF p.291; unit 3108 -->

```text
 typedef struct mEnhanceDataV21_s {
     float enhance_value;
     float enhance_chroma;
 } mEnhanceDataV21_t;
```

<!-- Source EN PDF p.291; unit 3109 -->

【Члены】

<!-- Source EN PDF p.291; unit 3110 -->

| Имя члена | Описание |
|---|---|
| enhance_value | Общая сила контраста, диапазон [0,16], по умолчанию 1.0, точность 0.001. |
| enhance_chroma | Корректировка усиления цветности, диапазон [0,16], по умолчанию 1.0, точность 0.001. |

<!-- Source EN PDF p.292; unit 3111 -->

9.6.4.13  mEnhance_setting_v21_t

<!-- Source EN PDF p.292; unit 3112 -->

【Описание】 Определяет свойства ручной функции усиления.

<!-- Source EN PDF p.292; unit 3113 -->

【Определение】

<!-- Source EN PDF p.292; unit 3114 -->

```text
 typedef struct mEnhance_Setting_V21_s {
     bool              en;
     float             enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     mEnhanceDataV21_t EnhanceData;
 } mEnhance_Setting_V21_t;
```

<!-- Source EN PDF p.292; unit 3115 -->

【Члены】

<!-- Source EN PDF p.292; unit 3116 -->

| Имя члена | Описание |
|---|---|
| en | Переключатель усиления |
| enhance_curve | Низкочастотная кривая |
| EnhanceData | Параметры настройки усиления |

<!-- Source EN PDF p.292; unit 3117 -->

9.6.4.14  mHistDataV21_t

<!-- Source EN PDF p.292; unit 3118 -->

【Описание】 Определяет свойства ручного HistData.

<!-- Source EN PDF p.292; unit 3119 -->

【Определение】

<!-- Source EN PDF p.292; unit 3120 -->

```text
 typedef struct mHistDataV21_s {
     float hist_gratio;
     float hist_th_off;
     float hist_k;
     float hist_min;
     float hist_scale;
     float cfg_gratio;
 } mHistDataV21_t;
```

<!-- Source EN PDF p.292; unit 3121 -->

【Члены】

<!-- Source EN PDF p.293; unit 3122 -->

| Имя члена | Описание |
|---|---|
| hist_gratio | Кратность растяжения и коэффициент выравнивания гистограммы, диапазон [0, 32], точность 0.01; значение по умолчанию не приведено. |
| hist_th_off | Статистический порог гистограммы, диапазон [0, 255], по умолчанию 64, точность 0.01. |
| hist_k | Множитель адаптивного порога гистограммы, диапазон [0, 7), по умолчанию 2, точность 0.01. |
| hist_min | Минимум статистического порога гистограммы, диапазон [0,2), по умолчанию 0.016, точность 0.01. |
| hist_scale | Коэффициент выравнивания гистограммы, диапазон [0, 32], по умолчанию 0.9, точность 0.01. |
| cfg_gratio | Программно заданные кратность растяжения и коэффициент выравнивания гистограммы, диапазон [0, 32), по умолчанию 1, точность 0.01. |

<!-- Source EN PDF p.293; unit 3123 -->

9.6.4.15  mHist_setting_v21_t

<!-- Source EN PDF p.293; unit 3124 -->

【Описание】 Определяет свойства ручной функции Hist.

<!-- Source EN PDF p.293; unit 3125 -->

【Определение】

<!-- Source EN PDF p.293; unit 3126 -->

```text
 typedef struct mHist_setting_V21_s {
     bool           en;
     bool           hist_para_en;
     mHistDataV21_t HistData;
 } mHist_setting_V21_t;
```

<!-- Source EN PDF p.293; unit 3127 -->

【Члены】

<!-- Source EN PDF p.293; unit 3128 -->

| Имя члена | Описание |
|---|---|
| en | Переключатель функции Hist. |
| hist_para_en | Переключатель управления растяжением гистограммы. |
| HistData | Параметры настройки Hist. |

<!-- Source EN PDF p.293; unit 3129 -->

9.6.4.16  mDehazeAttr_t

<!-- Source EN PDF p.293; unit 3130 -->

【Описание】 Определяет свойства ручного модуля удаления дымки.

<!-- Source EN PDF p.293; unit 3131 -->

【Определение】

<!-- Source EN PDF p.294; unit 3132 -->

```text
 typedef struct mDehazeAttr_s {
     bool                   Enable;
     float                  cfg_alpha;
     mDehaze_Setting_V21_t  dehaze_setting;
     mEnhance_Setting_V21_t enhance_setting;
     mHist_setting_V21_t    hist_setting;
 } mDehazeAttr_t;
```

<!-- Source EN PDF p.294; unit 3133 -->

【Члены】

<!-- Source EN PDF p.294; unit 3134 -->

| Имя члена | Описание |
|---|---|
| Enable | Функция переключения. |
| cfg_alpha | Доля ручной программной настройки, диапазон [0,1], по умолчанию 1, точность 0.01. |
| dehaze_setting | Параметры ручного удаления дымки |
| enhance_setting | Параметр ручного усиления |
| hist_setting | Параметры ручной функции Hist |

<!-- Source EN PDF p.294; unit 3135 -->

9.6.4.17  adehaze_sw_v2_t

<!-- Source EN PDF p.294; unit 3136 -->

【Описание】 Определяет свойства удаления дымки.

<!-- Source EN PDF p.294; unit 3137 -->

【Определение】

<!-- Source EN PDF p.294; unit 3138 -->

```text
 typedef struct adehaze_sw_V2_s {
     rk_aiq_uapi_sync_t     sync;
     dehaze_api_mode_t      mode;
     CalibDbV2_dehaze_V21_t stAuto;
     mDehazeAttr_t          stManual;
     DehazeManuAttr_t       stDehazeManu;
     EnhanceManuAttr_t      stEnhanceManu;
 } adehaze_sw_V2_t;
```

<!-- Source EN PDF p.294; unit 3139 -->

【Члены】

<!-- Source EN PDF p.294; unit 3140 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в «Обзор/Описание API». |
| mode | Режим API. |
| stAuto | Параметры автоматического модуля удаления дымки. |
| stManual | Параметры ручного модуля удаления дымки. |
| stDehazeManu | Параметр уровня удаления дымки; не использовать. |
| stEnhanceManu | Параметр уровня контраста; не использовать. |

<!-- Source EN PDF p.295; unit 3141 -->

### 9.7   CPROC

<!-- Source EN PDF p.295; unit 3142 -->

#### 9.7.1 Описание функций

<!-- Source EN PDF p.295; unit 3143 -->

CPRO (обработка цвета) обеспечивает базовую корректировку цвета: изменением яркости, контраста, насыщенности и цветности в определенных пределах получают желаемую цветопередачу. Модуль работает с изображениями в области YUV.

<!-- Source EN PDF p.295; unit 3144 -->

#### 9.7.2 Справочник функционального API

<!-- Source EN PDF p.295; unit 3145 -->

#### 9.7.3 Справочник модульного API

<!-- Source EN PDF p.295; unit 3146 -->

9.7.3.1  rk_aiq_user_api2_acp_SetAttrib

<!-- Source EN PDF p.295; unit 3147 -->

【Описание】

<!-- Source EN PDF p.295; unit 3148 -->

Устанавливает свойства модуля CPRO.

<!-- Source EN PDF p.295; unit 3149 -->

【Синтаксис】

<!-- Source EN PDF p.295; unit 3150 -->

```text
 XCamReturn rk_aiq_user_api2_acp_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
```

<!-- Source EN PDF p.295; unit 3151 -->

【Параметры】

<!-- Source EN PDF p.295; unit 3152 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства модуля CPROC | Вход |

<!-- Source EN PDF p.295; unit 3153 -->

【Возвращаемое значение】

<!-- Source EN PDF p.295; unit 3154 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.295; unit 3155 -->

【Зависимости】

<!-- Source EN PDF p.295; unit 3156 -->

Заголовочный файл: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.295; unit 3157 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.295; unit 3158 -->

9.7.3.2  rk_aiq_user_api2_acp_GetAttrib

<!-- Source EN PDF p.295; unit 3159 -->

【Описание】

<!-- Source EN PDF p.295; unit 3160 -->

Получает текущие свойства модуля CPRO.

<!-- Source EN PDF p.296; unit 3161 -->

【Синтаксис】

<!-- Source EN PDF p.296; unit 3162 -->

```text
 XCamReturn rk_aiq_user_api2_acp_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         acp_attrib_t* attr);
```

<!-- Source EN PDF p.296; unit 3163 -->

【Параметры】

<!-- Source EN PDF p.296; unit 3164 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства модуля CPROC | Выход |

<!-- Source EN PDF p.296; unit 3165 -->

【Возвращаемое значение】

<!-- Source EN PDF p.296; unit 3166 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.296; unit 3167 -->

【Зависимости】

<!-- Source EN PDF p.296; unit 3168 -->

Заголовочный файл: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.296; unit 3169 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.296; unit 3170 -->

#### 9.7.4 Типы данных модульного API

<!-- Source EN PDF p.296; unit 3171 -->

9.7.4.1  acp_attrib_t

<!-- Source EN PDF p.296; unit 3172 -->

【Описание】 Определяет параметры модуля CPROC.

<!-- Source EN PDF p.296; unit 3173 -->

【Определение】

<!-- Source EN PDF p.296; unit 3174 -->

```text
    typedef struct acp_attrib_s {
        uint8_t brightness; /* 0 ~ 255 */
        uint8_t contrast; /* 0 ~ 255 */
        uint8_t saturation; /* 0 ~ 255 */
        uint8_t hue; /* 0 ~ 255 */
    } acp_attrib_t;
```

<!-- Source EN PDF p.296; unit 3175 -->

【Члены】

<!-- Source EN PDF p.297; unit 3176 -->

| Имя члена | Описание |
|---|---|
| brightness | Яркость, диапазон [0,255], соответствующий диапазон [-128,127], по умолчанию 128. |
| contrast | Контраст, диапазон [0,255], соответствующий множитель [0, 1.992], по умолчанию 128. |
| saturation | Насыщенность, диапазон [0,255], соответствующий множитель [0, 1.992], по умолчанию 128. |
| hue | Цветность, диапазон [0,255], соответствующий угол [-90,87.188], по умолчанию 128. |

<!-- Source EN PDF p.297; unit 3177 -->

### 9.8   IE

<!-- Source EN PDF p.297; unit 3178 -->

#### 9.8.1 Описание функций

<!-- Source EN PDF p.297; unit 3179 -->

IE (эффекты изображения) задает специальные эффекты, например черно-белый. Модуль работает с изображениями в области YUV.

<!-- Source EN PDF p.297; unit 3180 -->

#### 9.8.2 Справочник функционального API

<!-- Source EN PDF p.297; unit 3181 -->

#### 9.8.3 Справочник модульного API

<!-- Source EN PDF p.297; unit 3182 -->

9.8.3.1  rk_aiq_user_api2_aie_SetAttrib

<!-- Source EN PDF p.297; unit 3183 -->

【Описание】

<!-- Source EN PDF p.297; unit 3184 -->

Устанавливает свойства модуля IE.

<!-- Source EN PDF p.297; unit 3185 -->

【Синтаксис】

<!-- Source EN PDF p.297; unit 3186 -->

```text
 XCamReturn rk_aiq_user_api2_aie_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t attr);
```

<!-- Source EN PDF p.297; unit 3187 -->

【Параметры】

<!-- Source EN PDF p.297; unit 3188 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства модуля IE | Вход |

<!-- Source EN PDF p.297; unit 3189 -->

【Возвращаемое значение】

<!-- Source EN PDF p.297; unit 3190 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.297; unit 3191 -->

【Зависимости】

<!-- Source EN PDF p.298; unit 3192 -->

Заголовочный файл: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3193 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.298; unit 3194 -->

9.8.3.2  rk_aiq_user_api2_aie_GetAttrib

<!-- Source EN PDF p.298; unit 3195 -->

【Описание】

<!-- Source EN PDF p.298; unit 3196 -->

Получает текущие свойства модуля IE.

<!-- Source EN PDF p.298; unit 3197 -->

【Синтаксис】

<!-- Source EN PDF p.298; unit 3198 -->

```text
 XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t* attr);
```

<!-- Source EN PDF p.298; unit 3199 -->

【Параметры】

<!-- Source EN PDF p.298; unit 3200 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства модуля IE | Выход |

<!-- Source EN PDF p.298; unit 3201 -->

【Возвращаемое значение】

<!-- Source EN PDF p.298; unit 3202 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.298; unit 3203 -->

【Зависимости】

<!-- Source EN PDF p.298; unit 3204 -->

Заголовочный файл: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3205 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.298; unit 3206 -->

#### 9.8.4 Типы данных модульного API

<!-- Source EN PDF p.298; unit 3207 -->

9.8.4.1  aie_attrib_t

<!-- Source EN PDF p.298; unit 3208 -->

【Описание】 Определяет параметры модуля IE.

<!-- Source EN PDF p.298; unit 3209 -->

【Определение】

<!-- Source EN PDF p.298; unit 3210 -->

```text
   typedef struct aie_attrib_s {
        rk_aiq_ie_effect_t mode;
   } aie_attrib_t;
```

<!-- Source EN PDF p.298; unit 3211 -->

【Члены】

<!-- Source EN PDF p.299; unit 3212 -->

| Имя члена | Описание |
|---|---|
| mode | Тип эффекта |

<!-- Source EN PDF p.299; unit 3213 -->

9.8.4.2  rk_aiq_ie_effect_t

<!-- Source EN PDF p.299; unit 3214 -->

【Описание】 Определяет тип эффекта IE.

<!-- Source EN PDF p.299; unit 3215 -->

【Определение】

<!-- Source EN PDF p.299; unit 3216 -->

```text
    typedef enum rk_aiq_ie_effect_e {
        RK_AIQ_IE_EFFECT_NONE,
        RK_AIQ_IE_EFFECT_BW,
        RK_AIQ_IE_EFFECT_NEGATIVE,
        RK_AIQ_IE_EFFECT_SEPIA,
        RK_AIQ_IE_EFFECT_EMBOSS,
       RK_AIQ_IE_EFFECT_SKETCH,
        RK_AIQ_IE_EFFECT_SHARPEN, /*!< deprecated */
   } rk_aiq_ie_effect_t;
```

<!-- Source EN PDF p.299; unit 3217 -->

【Члены】

<!-- Source EN PDF p.299; unit 3218 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_IE_EFFECT_NONE | Без эффектов |
| RK_AIQ_IE_EFFECT_BW | Черно-белый эффект |
| RK_AIQ_IE_EFFECT_NEGATIVE | Негатив, не поддерживается |
| RK_AIQ_IE_EFFECT_SEPIA | Эффект темно-коричневого тона |
| RK_AIQ_IE_EFFECT_EMBOSS | Эффект тиснения |
| RK_AIQ_IE_EFFECT_SKETCH | Эффект эскиза |
| RK_AIQ_IE_EFFECT_SHARPEN | Не поддерживается |

<!-- Source EN PDF p.299; unit 3219 -->

### 9.9   CSM

<!-- Source EN PDF p.299; unit 3220 -->

#### 9.9.1 Описание функций

<!-- Source EN PDF p.299; unit 3221 -->

CSM (матрица цветового пространства) позволяет задавать параметры преобразования RGB в YUV.

<!-- Source EN PDF p.300; unit 3222 -->

#### 9.9.2 Справочник функционального API

<!-- Source EN PDF p.300; unit 3223 -->

#### 9.9.3 Справочник модульного API

<!-- Source EN PDF p.300; unit 3224 -->

9.9.3.1  rk_aiq_user_api2_acsm_SetAttrib

<!-- Source EN PDF p.300; unit 3225 -->

【Описание】

<!-- Source EN PDF p.300; unit 3226 -->

Устанавливает свойства модуля CSM.

<!-- Source EN PDF p.300; unit 3227 -->

【Синтаксис】

<!-- Source EN PDF p.300; unit 3228 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t attr);
```

<!-- Source EN PDF p.300; unit 3229 -->

【Параметры】

<!-- Source EN PDF p.300; unit 3230 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойство модуля CSM | Вход |

<!-- Source EN PDF p.300; unit 3231 -->

【Возвращаемое значение】

<!-- Source EN PDF p.300; unit 3232 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.300; unit 3233 -->

【Зависимости】

<!-- Source EN PDF p.300; unit 3234 -->

Заголовочный файл: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.300; unit 3235 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.300; unit 3236 -->

【Меры предосторожности】

<!-- Source EN PDF p.300; unit 3237 -->

При attr.param.op_mode = RK_AIQ_OP_MODE_AUTO используются встроенные параметры CSM по умолчанию AIQ; при attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL параметры CSM можно настраивать.

<!-- Source EN PDF p.300; unit 3238 -->

attr.param.full_range допускает только TRUE; ограниченный диапазон настраивается в модуле CGC.

<!-- Source EN PDF p.300; unit 3239 -->

9.9.3.2  rk_aiq_user_api2_acsm_GetAttrib

<!-- Source EN PDF p.300; unit 3240 -->

【Описание】

<!-- Source EN PDF p.300; unit 3241 -->

Получает текущие свойства модуля CSM.

<!-- Source EN PDF p.300; unit 3242 -->

【Синтаксис】

<!-- Source EN PDF p.301; unit 3243 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t* attr);
```

<!-- Source EN PDF p.301; unit 3244 -->

【Параметры】

<!-- Source EN PDF p.301; unit 3245 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойство модуля CSM | Выход |

<!-- Source EN PDF p.301; unit 3246 -->

【Возвращаемое значение】

<!-- Source EN PDF p.301; unit 3247 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.301; unit 3248 -->

【Зависимости】

<!-- Source EN PDF p.301; unit 3249 -->

Заголовочный файл: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.301; unit 3250 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.301; unit 3251 -->

#### 9.9.4 Типы данных API уровня модуля

<!-- Source EN PDF p.301; unit 3252 -->

9.9.4.1 rk_aiq_uapi_acsm_attrib_t

<!-- Source EN PDF p.301; unit 3253 -->

【Описание】Определяет параметры модуля CSM.

<!-- Source EN PDF p.301; unit 3254 -->

【Определение】

<!-- Source EN PDF p.301; unit 3255 -->

```text
   typedef struct rk_aiq_uapi_acsm_attrib_s {
       rk_aiq_uapi_sync_t sync;
       rk_aiq_acsm_params_t param;
   } rk_aiq_uapi_acsm_attrib_t;
```

<!-- Source EN PDF p.301; unit 3256 -->

【Члены】

<!-- Source EN PDF p.301; unit 3257 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| rk_aiq_acsm_params_t | Параметр CSM. |

<!-- Source EN PDF p.302; unit 3258 -->

9.9.4.2 rk_aiq_acsm_params_t

<!-- Source EN PDF p.302; unit 3259 -->

【Описание】Определяет параметры модуля CSM.

<!-- Source EN PDF p.302; unit 3260 -->

【Определение】

<!-- Source EN PDF p.302; unit 3261 -->

```text
 typedef struct __csm_param {
     RKAiqOPMode_t op_mode;
     bool full_range;
     uint8_t y_offset;
     uint8_t c_offset;
     float coeff[RK_AIQ_CSM_COEFF_NUM];
 } Csm_Param_t;
```

<!-- Source EN PDF p.302; unit 3262 -->

【Члены】

<!-- Source EN PDF p.302; unit 3263 -->

| Имя члена | Описание |
|---|---|
| op_mode | Режим: RK_AIQ_OP_MODE_AUTO либо RK_AIQ_OP_MODE_MANUAL. |
| full_range | Вывод полного диапазона, по умолчанию TRUE. Для ISP30 допускается только TRUE; ограниченный диапазон рекомендуется настраивать API модуля CGC. |
| y_offset | Смещение яркости, [0,63], по умолчанию 0. |
| c_offset | Смещение цветности, [0,255], по умолчанию 0. |
| coeff | Матрица 3×3 преобразования RGB в YUV, диапазон [-2,1.992], по умолчанию [0.299,0.587,0.114,-0.169,-0.331,0.5,0.5,-0.419,-0.081]. |

<!-- Source EN PDF p.302; unit 3264 -->

### 9.10 Повышение резкости

<!-- Source EN PDF p.302; unit 3265 -->

#### 9.10.1 Описание функции

<!-- Source EN PDF p.302; unit 3266 -->

Модуль Sharpen повышает чёткость изображения, регулируя резкость краёв и усиливая детали и текстуры.

<!-- Source EN PDF p.303; unit 3267 -->

#### 9.10.2 API уровня функций

<!-- Source EN PDF p.303; unit 3268 -->

9.10.2.1 rk_aiq_uapi2_setSharpness

<!-- Source EN PDF p.303; unit 3269 -->

【Описание】

<!-- Source EN PDF p.303; unit 3270 -->

Задаёт уровень резкости.

<!-- Source EN PDF p.303; unit 3271 -->

【Синтаксис】

<!-- Source EN PDF p.303; unit 3272 -->

```text
 XCamReturn rk_aiq_uapi2_setSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.303; unit 3273 -->

【Параметры】

<!-- Source EN PDF p.303; unit 3274 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень резкости [0,100], по умолчанию 50. | Вход |

<!-- Source EN PDF p.303; unit 3275 -->

【Возвращаемое значение】

<!-- Source EN PDF p.303; unit 3276 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.303; unit 3277 -->

【Зависимости】

<!-- Source EN PDF p.303; unit 3278 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.303; unit 3279 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.303; unit 3280 -->

9.10.2.2 rk_aiq_uapi2_getSharpness

<!-- Source EN PDF p.303; unit 3281 -->

【Описание】

<!-- Source EN PDF p.303; unit 3282 -->

Получает уровень резкости.

<!-- Source EN PDF p.303; unit 3283 -->

【Синтаксис】

<!-- Source EN PDF p.303; unit 3284 -->

```text
 XCamReturn rk_aiq_uapi2_getSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.303; unit 3285 -->

【Параметры】

<!-- Source EN PDF p.303; unit 3286 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| level | Уровень резкости. | Выход |

<!-- Source EN PDF p.304; unit 3287 -->

【Возвращаемое значение】

<!-- Source EN PDF p.304; unit 3288 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.304; unit 3289 -->

【Зависимости】

<!-- Source EN PDF p.304; unit 3290 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.304; unit 3291 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.304; unit 3292 -->

#### 9.10.3 API уровня модуля

<!-- Source EN PDF p.304; unit 3293 -->

9.10.3.1 rk_aiq_user_api2_asharpV4_SetAttrib

<!-- Source EN PDF p.304; unit 3294 -->

【Описание】Задаёт свойства алгоритма повышения резкости.

<!-- Source EN PDF p.304; unit 3295 -->

【Синтаксис】

<!-- Source EN PDF p.304; unit 3296 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.304; unit 3297 -->

【Параметры】

<!-- Source EN PDF p.304; unit 3298 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.304; unit 3299 -->

【Возвращаемое значение】

<!-- Source EN PDF p.304; unit 3300 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.304; unit 3301 -->

【Зависимости】

<!-- Source EN PDF p.304; unit 3302 -->

Заголовочные файлы: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h.

<!-- Source EN PDF p.304; unit 3303 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.305; unit 3304 -->

9.10.3.2 rk_aiq_user_api2_asharpV4_GetAttrib

<!-- Source EN PDF p.305; unit 3305 -->

【Описание】Получает свойства алгоритма повышения резкости.

<!-- Source EN PDF p.305; unit 3306 -->

【Синтаксис】

<!-- Source EN PDF p.305; unit 3307 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.305; unit 3308 -->

【Параметры】

<!-- Source EN PDF p.305; unit 3309 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров шумоподавления | Вход |

<!-- Source EN PDF p.305; unit 3310 -->

【Возвращаемое значение】

<!-- Source EN PDF p.305; unit 3311 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.305; unit 3312 -->

【Зависимости】

<!-- Source EN PDF p.305; unit 3313 -->

Заголовочные файлы: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h.

<!-- Source EN PDF p.305; unit 3314 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.305; unit 3315 -->

9.10.3.3 rk_aiq_user_api2_asharpV4_SetStrength

<!-- Source EN PDF p.305; unit 3316 -->

【Описание】Задаёт интенсивность повышения резкости.

<!-- Source EN PDF p.305; unit 3317 -->

【Синтаксис】

<!-- Source EN PDF p.305; unit 3318 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.305; unit 3319 -->

【Параметры】

<!-- Source EN PDF p.305; unit 3320 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности резкости; диапазон percentage в структуре 0.0-1.0. | Вход |

<!-- Source EN PDF p.306; unit 3321 -->

【Возвращаемое значение】

<!-- Source EN PDF p.306; unit 3322 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.306; unit 3323 -->

【Зависимости】

<!-- Source EN PDF p.306; unit 3324 -->

Заголовочные файлы: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h.

<!-- Source EN PDF p.306; unit 3325 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.306; unit 3326 -->

9.10.3.4 rk_aiq_user_api2_asharpV4_GetStrength

<!-- Source EN PDF p.306; unit 3327 -->

【Описание】Получает интенсивность повышения резкости.

<!-- Source EN PDF p.306; unit 3328 -->

【Синтаксис】

<!-- Source EN PDF p.306; unit 3329 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.306; unit 3330 -->

【Параметры】

<!-- Source EN PDF p.306; unit 3331 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| pStrength | Указатель структуры интенсивности резкости; диапазон percentage в структуре 0.0-1.0. | Вход |

<!-- Source EN PDF p.306; unit 3332 -->

【Возвращаемое значение】

<!-- Source EN PDF p.306; unit 3333 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.306; unit 3334 -->

【Зависимости】

<!-- Source EN PDF p.306; unit 3335 -->

Заголовочные файлы: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h.

<!-- Source EN PDF p.306; unit 3336 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.307; unit 3337 -->

#### 9.10.4 Типы данных API уровня модуля

<!-- Source EN PDF p.307; unit 3338 -->

9.10.4.1 rk_aiq_sharp_attrib_v4_t

<!-- Source EN PDF p.307; unit 3339 -->

【Описание】Определяет параметры модуля повышения резкости.

<!-- Source EN PDF p.307; unit 3340 -->

【Определение】

<!-- Source EN PDF p.307; unit 3341 -->

```text
 typedef struct rk_aiq_sharp_attrib_v4_s {
     rk_aiq_uapi_sync_t sync;
     Asharp4_OPMode_t eMode;
     Asharp_Auto_Attr_V4_t stAuto;
     Asharp_Manual_Attr_V4_t stManual;
 } rk_aiq_sharp_attrib_v4_t;
```

<!-- Source EN PDF p.307; unit 3342 -->

【Члены】

<!-- Source EN PDF p.307; unit 3343 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| eMode | Свойства модуля Sharpen. |
| stAuto | Параметры автоматического режима Sharpen. |

<!-- Source EN PDF p.307; unit 3344 -->

9.10.4.2 Asharp4_OPMode_t

<!-- Source EN PDF p.307; unit 3345 -->

【Описание】

<!-- Source EN PDF p.307; unit 3346 -->

【Определение】

<!-- Source EN PDF p.307; unit 3347 -->

```text
 typedef enum Asharp4_OPMode_e {
     ASHARP4_OP_MODE_INVALID           = 0,
     ASHARP4_OP_MODE_AUTO              = 1,
     ASHARP4_OP_MODE_MANUAL            = 2,
     ASHARP4_OP_MODE_REG_MANUAL        = 3,
     ASHARP4_OP_MODE_MAX
 } Asharp4_OPMode_t;
```

<!-- Source EN PDF p.307; unit 3348 -->

【Члены】

<!-- Source EN PDF p.308; unit 3349 -->

| Имя члена | Описание |
|---|---|
| ASHARP4_OP_MODE_INVALID | Недействительный режим Sharpen. |
| ASHARP4_OP_MODE_AUTO | Автоматический режим Sharpen. |
| ASHARP4_OP_MODE_MANUAL | Настройки алгоритма ручного режима повышения резкости. |
| ASHARP4_OP_MODE_REG_MANUAL | Настройки регистров. |
| ASHARP4_OP_MODE_MAX | Максимальное значение режима Sharpen, недействительный режим. |

<!-- Source EN PDF p.308; unit 3350 -->

9.10.4.3 Asharp_Auto_Attr_V4_t

<!-- Source EN PDF p.308; unit 3351 -->

【Описание】Определяет свойства алгоритма автоматического режима повышения резкости для каждого ISO.

<!-- Source EN PDF p.308; unit 3352 -->

【Определение】

<!-- Source EN PDF p.308; unit 3353 -->

```text
 typedef struct Asharp_Auto_Attr_V4_s
 {
     RK_SHARP_Params_V4_t stParams;
     RK_SHARP_Params_V4_Select_t stSelect;
 } Asharp_Auto_Attr_V4_t;
```

<!-- Source EN PDF p.308; unit 3354 -->

【Члены】

<!-- Source EN PDF p.308; unit 3355 -->

| Имя члена | Описание |
|---|---|
| stParams | Свойства алгоритма SHARP для каждого ISO. |
| stSelect | Вычисленные параметры свойств Sharp. |

<!-- Source EN PDF p.308; unit 3356 -->

9.10.4.4 Asharp_Manual_Attr_V4_t

<!-- Source EN PDF p.308; unit 3357 -->

【Описание】Определяет ручные свойства модуля повышения резкости.

<!-- Source EN PDF p.308; unit 3358 -->

【Определение】

<!-- Source EN PDF p.309; unit 3359 -->

```text
 typedef struct Asharp_Manual_Attr_V4_s
 {
     RK_SHARP_Params_V4_Select_t stSelect;
     RK_SHARP_Fix_V4_t stFix;
 } Asharp_Manual_Attr_V4_t;
```

<!-- Source EN PDF p.309; unit 3360 -->

【Члены】

<!-- Source EN PDF p.309; unit 3361 -->

| Имя члена | Описание |
|---|---|
| stSelect | Ручные параметры алгоритма Sharp. |
| stFix | Значения регистров Sharp. |

<!-- Source EN PDF p.309; unit 3362 -->

9.10.4.5 RK_SHARP_Params_V4_t

<!-- Source EN PDF p.309; unit 3363 -->

【Описание】Определяет ручные свойства модуля повышения резкости.

<!-- Source EN PDF p.309; unit 3364 -->

【Определение】

<!-- Source EN PDF p.309; unit 3365 -->

```text
 typedef struct RK_SHARP_Params_V4_s
 {
     int enable;
     int iso[RK_SHARP_V4_MAX_ISO_NUM];
     short luma_point        [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma        [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain          [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_add           [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_ratio         [RK_SHARP_V4_MAX_ISO_NUM];
     float gaus_ratio        [RK_SHARP_V4_MAX_ISO_NUM];
     float sharp_ratio       [RK_SHARP_V4_MAX_ISO_NUM];
     short hf_clip        [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain           [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_add            [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_ratio          [RK_SHARP_V4_MAX_ISO_NUM];
     short local_sharp_strength  [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_PBF_DIAM *
 RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_RF_DIAM *
 RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
 } RK_SHARP_Params_V4_t;
```

<!-- Source EN PDF p.310; unit 3366 -->

【Члены】

<!-- Source EN PDF p.311; unit 3367 -->

| Имя параметра | Тип параметра | Краткое описание. |
|---|---|---|
| Enable | Параметры настройки | Переключатель Sharp: 1 включает, 0 отключает. |
| iso | Параметры настройки | Разные уровни ISO используют разные параметры настройки; поддерживаются только 13 уровней. |
| pbf_gain | Параметры настройки | Множитель sigma предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,2.0], по умолчанию 1.0. |
| pbf_add | Параметры настройки | Добавочное смещение sigma предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0,1023], по умолчанию 0. |
| pbf_ratio | Параметры настройки | Вес смешивания предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,1.0], по умолчанию 0.5. |
| gaus_ratio | Параметры настройки | Направляющее изображение высокочастотного двустороннего фильтра — смесь гауссовой фильтрации и оригинала. Большее значение повышает направляющий вес гауссова двустороннего фильтра. [0.0,1.0], по умолчанию 0. |
| sharp_ratio | Параметры настройки | Интенсивность повышения резкости; большее значение усиливает резкость. [0.0,16], по умолчанию 6. |
| bf_gain | Параметры настройки | Множитель sigma высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,2.0], по умолчанию 1.0. |
| bf_add | Параметры настройки | Добавочное смещение sigma высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0,1023], по умолчанию 0. |
| bf_add | Параметры настройки | Вес смешивания высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,1.0], по умолчанию 0.5. |

<!-- Source EN PDF p.312; unit 3368 -->

| Имя параметра | Тип параметра | Краткое описание. |
|---|---|---|
| luma_point / luma_sigma | Параметры настройки | Разной яркости пикселя соответствует кривая SIGMA шума. luma_point — яркость [0,1023]; luma_sigma — интенсивность шума [0,1023]. |
| luma_point / hf_clip | Параметры настройки | Ограничение высокочастотных значений по яркости пикселя. Большее значение повышает максимально допустимую резкость. [0,1023], по умолчанию 256. |
| luma_point / local_sharp_strength | Параметры настройки | Вес наложения высоких частот по яркости пикселя. Большее значение допускает больше высоких частот, повышая резкость. [0,1023], по умолчанию 512. |
| prefilter_coeff | Параметры настройки | Оператор предварительной фильтрации. |
| GaussianFilter_coeff | Параметры настройки | Оператор гауссовой фильтрации. |
| hfBilateralFilter_coeff | Параметры настройки | Оператор высокочастотной двусторонней фильтрации. |

<!-- Source EN PDF p.312; unit 3369 -->

9.10.4.6 RK_SHARP_Params_V4_Select_t

<!-- Source EN PDF p.312; unit 3370 -->

【Описание】Определяет свойства алгоритма ручного режима повышения резкости.

<!-- Source EN PDF p.312; unit 3371 -->

【Определение】

<!-- Source EN PDF p.312; unit 3372 -->

```text
 typedef struct RK_SHARP_Params_V4_Select_s
 {
     int enable;
     short luma_point    [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma    [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain      ;
     float pbf_add       ;
     float pbf_ratio     ;
     float gaus_ratio    ;
     float sharp_ratio   ;
     short hf_clip       [RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain       ;
     float bf_add        ;
     float bf_ratio      ;
     short local_sharp_strength        [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_PBF_DIAM * RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_RF_DIAM * RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
```

<!-- Source EN PDF p.313; unit 3373 -->

```text
 } RK_SHARP_Params_V4_Select_t;
```

<!-- Source EN PDF p.313; unit 3374 -->

【Члены】

<!-- Source EN PDF p.314; unit 3375 -->

| Имя параметра | Тип параметра | Краткое описание. |
|---|---|---|
| Enable | Параметры настройки | Переключатель Sharp: 1 включает, 0 отключает. |
| iso | Параметры настройки | Разные уровни ISO используют разные параметры настройки; поддерживаются только 13 уровней. |
| pbf_gain | Параметры настройки | Множитель sigma предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,2.0], по умолчанию 1.0. |
| pbf_add | Параметры настройки | Добавочное смещение sigma предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0,1023], по умолчанию 0. |
| pbf_ratio | Параметры настройки | Вес смешивания предварительного фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,1.0], по умолчанию 0.5. |
| gaus_ratio | Параметры настройки | Направляющее изображение высокочастотного двустороннего фильтра — смесь гауссовой фильтрации и оригинала. Большее значение повышает направляющий вес гауссова двустороннего фильтра. [0.0,1.0], по умолчанию 0. |
| sharp_ratio | Параметры настройки | Интенсивность повышения резкости; большее значение усиливает резкость. [0.0,16], по умолчанию 6. |
| bf_gain | Параметры настройки | Множитель sigma высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,2.0], по умолчанию 1.0. |
| bf_add | Параметры настройки | Добавочное смещение sigma высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0,1023], по умолчанию 0. |
| bf_add | Параметры настройки | Вес смешивания высокочастотного двустороннего фильтра. Большее значение усиливает фильтрацию, уменьшая шум и детали. [0.0,1.0], по умолчанию 0.5. |

<!-- Source EN PDF p.315; unit 3376 -->

| Имя параметра | Тип параметра | Краткое описание. |
|---|---|---|
| luma_point / luma_sigma | Параметры настройки | Разной яркости пикселя соответствует кривая SIGMA шума. luma_point — яркость [0,1023]; luma_sigma — интенсивность шума [0,1023]. |
| luma_point / hf_clip | Параметры настройки | Ограничение высокочастотных значений по яркости пикселя. Большее значение повышает максимально допустимую резкость. [0,1023], по умолчанию 256. |
| luma_point / local_sharp_strength | Параметры настройки | Вес наложения высоких частот по яркости пикселя. Большее значение допускает больше высоких частот, повышая резкость. [0,1023], по умолчанию 512. |
| prefilter_coeff | Параметры настройки | Оператор предварительной фильтрации. |
| GaussianFilter_coeff | Параметры настройки | Оператор гауссовой фильтрации. |
| hfBilateralFilter_coeff | Параметры настройки | Оператор высокочастотной двусторонней фильтрации. |

<!-- Source EN PDF p.315; unit 3377 -->

9.10.4.7 RK_SHARP_Fix_V4_t

<!-- Source EN PDF p.315; unit 3378 -->

【Описание】Определяет конфигурацию регистров ручного режима повышения резкости.

<!-- Source EN PDF p.315; unit 3379 -->

【Определение】

<!-- Source EN PDF p.315; unit 3380 -->

```text
 typedef struct RK_SHARP_Fix_V4_s
 {
     // SHARP_SHARP_EN (0x0000)
     uint8_t sharp_clk_dis;
     uint8_t sharp_exgain_bypass;
     uint8_t sharp_center_mode;
     uint8_t sharp_bypass;
     uint8_t sharp_en;
     // SHARP_SHARP_RATIO  (0x0004)
     uint8_t sharp_sharp_ratio;
     uint8_t sharp_bf_ratio;
     uint8_t sharp_gaus_ratio;
     uint8_t sharp_pbf_ratio;
     // SHARP_SHARP_LUMA_DX (0x0008)
     uint8_t sharp_luma_dx[7];
     // SHARP_SHARP_PBF_SIGMA_INV_0 (0x000c - 0x0014)
     uint16_t sharp_pbf_sigma_inv[8];
     // SHARP_SHARP_BF_SIGMA_INV_0 (0x0018 -  0x0020)
     uint16_t sharp_bf_sigma_inv[8];
     // SHARP_SHARP_SIGMA_SHIFT (0x00024)
     uint8_t sharp_bf_sigma_shift;
     uint8_t sharp_pbf_sigma_shift;
     // SHARP_SHARP_EHF_TH_0 (0x0028 -  0x0030)
     uint16_t sharp_ehf_th[8];
     // SHARP_SHARP_CLIP_HF_0 (0x0034 -  0x003c)
     uint16_t sharp_clip_hf[8];
     // SHARP_SHARP_PBF_COEF (0x00040)
     uint8_t sharp_pbf_coef[3];
     // SHARP_SHARP_BF_COEF (0x00044)
     uint8_t sharp_bf_coef[3];
     // SHARP_SHARP_GAUS_COEF (0x00048 - 0x0004c)
     uint8_t sharp_gaus_coef[6];
 } RK_SHARP_Fix_V4_t;
```

<!-- Source EN PDF p.316; unit 3381 -->

【Члены】

<!-- Source EN PDF p.317; unit 3382 -->

| Имя параметра | Описание параметра |
|---|---|
| sharp_clk_dis | Управление тактированием Sharp, пока не поддерживается, по умолчанию 0. |
| sharp_exgain_bypass | Обход внешнего модуля локального усиления, пока не поддерживается, по умолчанию 0. |
| sharp_center_mode | Повышение резкости относительно центра изображения; настройка пока не поддерживается, по умолчанию 0. |
| sharp_bypass | Обход модуля резкости: 1 — обход, 0 — без обхода. |
| sharp_en | Включение Sharpen: 1 включает, 0 отключает. |
| sharp_sharp_ratio | sharp_ratio: интенсивность резкости, 0~15.9. |
| sharp_bf_ratio | Вес смешивания двустороннего фильтра, 0~1.0. |
| sharp_gaus_ratio | gaus_ratio: вес смешивания гауссова фильтра, [0.0,1.0]. |
| sharp_pbf_ratio | Вес смешивания двустороннего предварительного фильтра, [0.0,1.0], по умолчанию 0.5. |
| sharp_luma_dx7 | Расстояние между точками 6 и 7 равно 2^sw_sharp_luma_dx7. |
| sharp_luma_dx6 | Расстояние между точками 5 и 6 равно 2^sw_sharp_luma_dx6. |
| sharp_luma_dx5 | Расстояние между точками 4 и 5 равно 2^sw_sharp_luma_dx5. |
| sharp_luma_dx4 | Расстояние между точками 3 и 4 равно 2^sw_sharp_luma_dx4. |
| sharp_luma_dx3 | Расстояние между точками 2 и 3 равно 2^sw_sharp_luma_dx3. |
| sharp_luma_dx2 | Расстояние между точками 1 и 2 равно 2^sw_sharp_luma_dx2. |
| sharp_luma_dx1 | Расстояние между точками 0 и 1 равно 2^sw_sharp_luma_dx1. Суммарное расстояние должно быть 1024. |
| sharp_pbf_sigma_inv | Обратное значение sigma pbf Sharp. |
| sharp_bf_sigma_inv | Обратное значение sigma bf Sharp. |
| sharp_pbf_coef | Ядро двустороннего фильтра модуля резкости. |
| sharp_bf_coef | Ядро двустороннего фильтра. |
| sharp_gaus_coef | Ядро гауссова фильтра. |

<!-- Source EN PDF p.318; unit 3383 -->

9.10.4.8 rk_aiq_sharp_strength_v4_t

<!-- Source EN PDF p.318; unit 3384 -->

【Описание】Определяет структуру настройки интенсивности подавления шума модуля резкости.

<!-- Source EN PDF p.318; unit 3385 -->

【Определение】

<!-- Source EN PDF p.318; unit 3386 -->

```text
 typedef struct rk_aiq_sharp_strength_v4_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_sharp_strength_v4_t;
```

<!-- Source EN PDF p.318; unit 3387 -->

【Члены】

<!-- Source EN PDF p.318; unit 3388 -->

| Имя члена | Описание |
|---|---|
| sync | Выбор синхронного/асинхронного режима см. в обзоре и описании API. |
| percent | Интенсивность резкости, диапазон 0.0-1.0. |

<!-- Source EN PDF p.318; unit 3389 -->

### 9.11 Gamma

<!-- Source EN PDF p.318; unit 3390 -->

#### 9.11.1 Описание функции

<!-- Source EN PDF p.318; unit 3391 -->

Модуль gamma нелинейно преобразует яркость изображения для выходного устройства. RK3588 поддерживает 49-точечную кривую gamma в логарифмической области со следующими абсциссами:

<!-- Source EN PDF p.318; unit 3392 -->

```text
 int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
 768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
 4095};
```

<!-- Source EN PDF p.318; unit 3393 -->

#### 9.11.2 API уровня функций

<!-- Source EN PDF p.318; unit 3394 -->

9.11.2.1 rk_aiq_uapi2_setGammaCoef

<!-- Source EN PDF p.318; unit 3395 -->

【Описание】

<!-- Source EN PDF p.318; unit 3396 -->

Быстро задаёт gamma через GammaCoef и SlopeAtZero. Кривая формируется следующим образом:

<!-- Source EN PDF p.318; unit 3397 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.318; unit 3398 -->

【Синтаксис】

<!-- Source EN PDF p.319; unit 3399 -->

```text
 XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx, float
 GammaCoef, float SlopeAtZero);
```

<!-- Source EN PDF p.319; unit 3400 -->

【Параметры】

<!-- Source EN PDF p.319; unit 3401 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| GammaCoef | Коэффициент gamma, [0,100], по умолчанию 2.2, точность 0.01. | Вход |
| SlopeAtZero | Наклон тёмной области, [-0.05,0.05], по умолчанию 0, точность 0.001. | Вход |

<!-- Source EN PDF p.319; unit 3402 -->

【Возвращаемое значение】

<!-- Source EN PDF p.319; unit 3403 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.319; unit 3404 -->

【Зависимости】

<!-- Source EN PDF p.319; unit 3405 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.319; unit 3406 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.319; unit 3407 -->

【Описание】

<!-- Source EN PDF p.319; unit 3408 -->

Кривая Gamma API не переключается по сцене; при её изменении задайте кривую заново через API.

<!-- Source EN PDF p.319; unit 3409 -->

#### 9.11.3 Типы данных API уровня функций

<!-- Source EN PDF p.319; unit 3410 -->

#### 9.11.4 API уровня модуля

<!-- Source EN PDF p.319; unit 3411 -->

9.11.4.1 rk_aiq_user_api2_agamma_SetAttrib

<!-- Source EN PDF p.319; unit 3412 -->

【Описание】Задаёт программные свойства gamma.

<!-- Source EN PDF p.319; unit 3413 -->

【Синтаксис】

<!-- Source EN PDF p.319; unit 3414 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_v11_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, const
 rk_aiq_gamma_v11_attrib_t* attr);
```

<!-- Source EN PDF p.319; unit 3415 -->

【Параметры】

<!-- Source EN PDF p.320; unit 3416 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств Gamma. | Вход |

<!-- Source EN PDF p.320; unit 3417 -->

【Возвращаемое значение】

<!-- Source EN PDF p.320; unit 3418 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.320; unit 3419 -->

【Зависимости】

<!-- Source EN PDF p.320; unit 3420 -->

Заголовочный файл: rk_aiq_user_api2_agamma.h.

<!-- Source EN PDF p.320; unit 3421 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.320; unit 3422 -->

【Описание】

<!-- Source EN PDF p.320; unit 3423 -->

Кривая Gamma API не переключается по сцене; при её изменении задайте кривую заново через API.

<!-- Source EN PDF p.320; unit 3424 -->

9.11.4.2 rk_aiq_user_api2_agamma_GetAttrib

<!-- Source EN PDF p.320; unit 3425 -->

【Описание】Получает программные свойства gamma.

<!-- Source EN PDF p.320; unit 3426 -->

【Синтаксис】

<!-- Source EN PDF p.320; unit 3427 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_gamma_attrib_t* attr);
```

<!-- Source EN PDF p.320; unit 3428 -->

【Параметры】

<!-- Source EN PDF p.320; unit 3429 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств Gamma. | Выход |

<!-- Source EN PDF p.320; unit 3430 -->

【Возвращаемое значение】

<!-- Source EN PDF p.320; unit 3431 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.320; unit 3432 -->

【Зависимости】

<!-- Source EN PDF p.320; unit 3433 -->

Заголовочный файл: rk_aiq_user_api2_agamma.h.

<!-- Source EN PDF p.321; unit 3434 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.321; unit 3435 -->

【Описание】

<!-- Source EN PDF p.321; unit 3436 -->

#### 9.11.5 Типы данных API уровня модуля

<!-- Source EN PDF p.321; unit 3437 -->

9.11.5.1 rk_aiq_gamma_op_mode_t

<!-- Source EN PDF p.321; unit 3438 -->

【Описание】Определяет режим работы Gamma.

<!-- Source EN PDF p.321; unit 3439 -->

【Определение】

<!-- Source EN PDF p.321; unit 3440 -->

```text
 typedef enum rk_aiq_gamma_op_mode_s {
     RK_AIQ_GAMMA_MODE_OFF             = 0,
     RK_AIQ_GAMMA_MODE_MANUAL          = 1,
     RK_AIQ_GAMMA_MODE_FAST            = 2,
 } rk_aiq_gamma_op_mode_t;
```

<!-- Source EN PDF p.321; unit 3441 -->

【Члены】

<!-- Source EN PDF p.321; unit 3442 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_GAMMA_MODE_OFF | Режим отключения API. |
| RK_AIQ_GAMMA_MODE_MANUAL | Ручной режим API. |
| RK_AIQ_GAMMA_MODE_FAST | Быстрый режим API. |

<!-- Source EN PDF p.321; unit 3443 -->

9.11.5.2 Agamma_api_Fast_t

<!-- Source EN PDF p.321; unit 3444 -->

【Описание】Определяет свойства Gamma быстрого режима.

<!-- Source EN PDF p.321; unit 3445 -->

Быстро задаёт gamma через GammaBeef и SlopeAtZero; формирование кривой ниже. GammaBeef — написание оригинала.

<!-- Source EN PDF p.321; unit 3446 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.321; unit 3447 -->

【Определение】

<!-- Source EN PDF p.321; unit 3448 -->

```text
 typedef struct Agamma_api_Fast_s {
     bool  en;
     float GammaCoef;
     float SlopeAtZero;
 } Agamma_api_Fast_t;
```

<!-- Source EN PDF p.321; unit 3449 -->

【Члены】

<!-- Source EN PDF p.322; unit 3450 -->

| Имя члена | Описание |
|---|---|
| en | Включение функции |
| GammaCoef | Коэффициент gamma; диапазон в оригинале записан 0, 100, по умолчанию 2.2, точность 0.01. |
| SlopeAtZero | Наклон тёмной области; оригинал указывает границы 0.05 и 0.05, по умолчанию 0, точность 0.001. Следует проверить возможный пропуск минуса. |

<!-- Source EN PDF p.322; unit 3451 -->

9.11.5.3 GammaType_t

<!-- Source EN PDF p.322; unit 3452 -->

【Описание】Определяет тип шага по X кривой Gamma.

<!-- Source EN PDF p.322; unit 3453 -->

【Определение】

<!-- Source EN PDF p.322; unit 3454 -->

```text
 typedef enum GammaType_e {
    GAMMATYPE_LOG = 0,
    GAMMATYPE_EQU = 1,
 } GammaType_t;
```

<!-- Source EN PDF p.322; unit 3455 -->

【Члены】

<!-- Source EN PDF p.322; unit 3456 -->

| Имя члена | Описание |
|---|---|
| GAMMATYPE_LOG | Неравномерный шаг. |
| GAMMATYPE_EQU | Равномерный шаг. |

<!-- Source EN PDF p.322; unit 3457 -->

9.11.5.4 Agamma_api_manualV21_t

<!-- Source EN PDF p.322; unit 3458 -->

【Описание】Определяет ручные свойства gamma RK356x.

<!-- Source EN PDF p.322; unit 3459 -->

【Определение】

<!-- Source EN PDF p.322; unit 3460 -->

```text
 typedef struct Agamma_api_manualV21_s {
    bool        Gamma_en;
    GammaType_t Gamma_out_segnum;
    uint16_t    Gamma_out_offset;
    uint16_t    Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM];
 } Agamma_api_manualV21_t;
```

<!-- Source EN PDF p.322; unit 3461 -->

【Члены】

<!-- Source EN PDF p.323; unit 3462 -->

| Имя члена | Описание |
|---|---|
| Gamma_en | Включение функции |
| Gamma_out_segnum | Тип шага по X ручной кривой Gamma, по умолчанию GAMMATYPE_LOG. |
| Gamma_out_offset | Коэффициент коррекции ручной кривой Gamma, [-2048,2048], по умолчанию 0, точность 1. |
| Gamma_curve | Ручная кривая Gamma, [0,4095], точность 1. |

<!-- Source EN PDF p.323; unit 3463 -->

9.11.5.5 Agamma_api_manualV30_t

<!-- Source EN PDF p.323; unit 3464 -->

【Описание】Определяет ручные свойства gamma RK3588.

<!-- Source EN PDF p.323; unit 3465 -->

【Определение】

<!-- Source EN PDF p.323; unit 3466 -->

```text
 typedef struct Agamma_api_manualV30_s {
    bool     Gamma_en;
    uint16_t Gamma_out_offset;
    uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V30];
 } Agamma_api_manualV30_t;
```

<!-- Source EN PDF p.323; unit 3467 -->

【Члены】

<!-- Source EN PDF p.323; unit 3468 -->

| Имя члена | Описание |
|---|---|
| Gamma_en | Включение функции |
| Gamma_out_offset | Коэффициент коррекции ручной кривой Gamma, [-2048,2048], по умолчанию 0, точность 1. |
| Gamma_curve | Ручная кривая Gamma, [0,4095], точность 1. |

<!-- Source EN PDF p.323; unit 3469 -->

9.11.5.6 rk_aiq_gamma_attrV21_t

<!-- Source EN PDF p.323; unit 3470 -->

【Описание】Определяет свойства Gamma RK356x.

<!-- Source EN PDF p.323; unit 3471 -->

【Определение】

<!-- Source EN PDF p.323; unit 3472 -->

```text
 typedef struct rk_aiq_gamma_attrV21_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV21_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV21_t;
```

<!-- Source EN PDF p.323; unit 3473 -->

【Члены】

<!-- Source EN PDF p.324; unit 3474 -->

| Имя члена | Описание |
|---|---|
| mode | Режим API. |
| stManual | Параметры ручной Gamma. |
| stFast | Параметры быстрого режима. |

<!-- Source EN PDF p.324; unit 3475 -->

9.11.5.7 rk_aiq_gamma_attrV30_t

<!-- Source EN PDF p.324; unit 3476 -->

【Описание】Определяет свойства Gamma RK3588.

<!-- Source EN PDF p.324; unit 3477 -->

【Определение】

<!-- Source EN PDF p.324; unit 3478 -->

```text
 typedef struct rk_aiq_gamma_attrV30_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV30_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV30_t;
```

<!-- Source EN PDF p.324; unit 3479 -->

【Члены】

<!-- Source EN PDF p.324; unit 3480 -->

| Имя члена | Описание |
|---|---|
| mode | Режим API. |
| stManual | Параметры ручной Gamma. |
| stFast | Параметры быстрого режима. |

<!-- Source EN PDF p.324; unit 3481 -->

9.11.5.8 rk_aiq_gamma_attr_t

<!-- Source EN PDF p.324; unit 3482 -->

【Описание】Определяет свойства Gamma.

<!-- Source EN PDF p.324; unit 3483 -->

【Определение】

<!-- Source EN PDF p.324; unit 3484 -->

```text
 typedef struct rk_aiq_gamma_attr_s {
     rk_aiq_uapi_sync_t     sync;
     rk_aiq_gamma_attrV21_t atrrV21;
     rk_aiq_gamma_attrV30_t atrrV30;
 } rk_aiq_gamma_attr_t;
```

<!-- Source EN PDF p.324; unit 3485 -->

【Члены】

<!-- Source EN PDF p.325; unit 3486 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| atrrV21 | Ручные свойства gamma микросхемы RK356x. |
| atrrV30 | Ручные свойства gamma микросхемы RK3588. |

<!-- Source EN PDF p.325; unit 3487 -->

### 9.12 CCM

<!-- Source EN PDF p.325; unit 3488 -->

#### 9.12.1 Описание функции

<!-- Source EN PDF p.325; unit 3489 -->

Модуль CCM (матрица цветокоррекции) выполняет цветовую коррекцию изображения.

<!-- Source EN PDF p.325; unit 3490 -->

#### 9.12.2 API уровня функций

<!-- Source EN PDF p.325; unit 3491 -->

9.12.2.1 rk_aiq_uapi2_setCCMMode

<!-- Source EN PDF p.325; unit 3492 -->

【Описание】Задаёт режим работы CCM.

<!-- Source EN PDF p.325; unit 3493 -->

【Синтаксис】

<!-- Source EN PDF p.325; unit 3494 -->

```text
 XCamReturn rk_aiq_uapi2_setCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.325; unit 3495 -->

【Параметры】

<!-- Source EN PDF p.325; unit 3496 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы, {OP_AUTO, OP_MANUAL}. | Вход |

<!-- Source EN PDF p.325; unit 3497 -->

【Возвращаемое значение】

<!-- Source EN PDF p.325; unit 3498 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.325; unit 3499 -->

【Зависимости】

<!-- Source EN PDF p.325; unit 3500 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.325; unit 3501 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.325; unit 3502 -->

【Пример】

<!-- Source EN PDF p.326; unit 3503 -->

Для ручного/автоматического режима см. sample_set_ccm_manual / sample_set_ccm_auto в sample_accm_module.cpp.

<!-- Source EN PDF p.326; unit 3504 -->

9.12.2.2 rk_aiq_uapi2_getCCMMode

<!-- Source EN PDF p.326; unit 3505 -->

【Описание】Получает режим работы CCM.

<!-- Source EN PDF p.326; unit 3506 -->

【Синтаксис】

<!-- Source EN PDF p.326; unit 3507 -->

```text
 XCamReturn rk_aiq_uapi2_getCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.326; unit 3508 -->

【Параметры】

<!-- Source EN PDF p.326; unit 3509 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы, {OP_AUTO, OP_MANUAL}. | Выход |

<!-- Source EN PDF p.326; unit 3510 -->

【Возвращаемое значение】

<!-- Source EN PDF p.326; unit 3511 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.326; unit 3512 -->

【Зависимости】

<!-- Source EN PDF p.326; unit 3513 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.326; unit 3514 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.326; unit 3515 -->

【Пример】

<!-- Source EN PDF p.326; unit 3516 -->

Получение режима см. в sample_get_ccm_mode файла sample_accm_module.cpp.

<!-- Source EN PDF p.326; unit 3517 -->

9.12.2.3 rk_aiq_uapi2_setMCcCoef

<!-- Source EN PDF p.326; unit 3518 -->

【Описание】Задаёт CCM ручного режима: матрицу цветокоррекции и смещения каналов R/G/B.

<!-- Source EN PDF p.326; unit 3519 -->

【Синтаксис】

<!-- Source EN PDF p.326; unit 3520 -->

```text
 XCamReturn rk_aiq_uapi2_setMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.326; unit 3521 -->

【Параметры】

<!-- Source EN PDF p.327; unit 3522 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mccm | CCM ручного режима: матрица цветокоррекции и смещения R/G/B. | Вход |

<!-- Source EN PDF p.327; unit 3523 -->

【Возвращаемое значение】

<!-- Source EN PDF p.327; unit 3524 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.327; unit 3525 -->

【Зависимости】

<!-- Source EN PDF p.327; unit 3526 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.327; unit 3527 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.327; unit 3528 -->

【Пример】

<!-- Source EN PDF p.327; unit 3529 -->

Настройку ручной CCM см. в sample_set_ccm_manual_matrix файла sample_accm_module.cpp.

<!-- Source EN PDF p.327; unit 3530 -->

9.12.2.4 rk_aiq_uapi2_getMCcCoef

<!-- Source EN PDF p.327; unit 3531 -->

【Описание】Получает CCM: матрицу цветокоррекции и смещения R/G/B.

<!-- Source EN PDF p.327; unit 3532 -->

【Синтаксис】

<!-- Source EN PDF p.327; unit 3533 -->

```text
 XCamReturn rk_aiq_uapi2_getMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.327; unit 3534 -->

【Параметры】

<!-- Source EN PDF p.327; unit 3535 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mccm | CCM: матрица цветокоррекции и смещения R/G/B. | Выход |

<!-- Source EN PDF p.327; unit 3536 -->

【Возвращаемое значение】

<!-- Source EN PDF p.327; unit 3537 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.328; unit 3538 -->

【Зависимости】

<!-- Source EN PDF p.328; unit 3539 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3540 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.328; unit 3541 -->

【Пример】

<!-- Source EN PDF p.328; unit 3542 -->

Получение CCM см. в sample_get_ccm_manual_matrix файла sample_accm_module.cpp.

<!-- Source EN PDF p.328; unit 3543 -->

9.12.2.5 rk_aiq_uapi2_getACcmSat

<!-- Source EN PDF p.328; unit 3544 -->

【Описание】Получает насыщенность CCM автоматического режима.

<!-- Source EN PDF p.328; unit 3545 -->

【Синтаксис】

<!-- Source EN PDF p.328; unit 3546 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmSat(const rk_aiq_sys_ctx_t* ctx,  float
 *finalsat);
```

<!-- Source EN PDF p.328; unit 3547 -->

【Параметры】

<!-- Source EN PDF p.328; unit 3548 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| finalsat | Насыщенность; в ручном режиме 0. | Выход |

<!-- Source EN PDF p.328; unit 3549 -->

【Возвращаемое значение】

<!-- Source EN PDF p.328; unit 3550 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.328; unit 3551 -->

【Зависимости】

<!-- Source EN PDF p.328; unit 3552 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3553 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.328; unit 3554 -->

【Пример】

<!-- Source EN PDF p.328; unit 3555 -->

Насыщенность автоматической CCM см. в sample_get_accm_sat файла sample_accm_module.cpp.

<!-- Source EN PDF p.328; unit 3556 -->

9.12.2.6 rk_aiq_uapi2_getACcmMatrixName

<!-- Source EN PDF p.328; unit 3557 -->

【Описание】Получает имя матрицы CCM автоматического режима.

<!-- Source EN PDF p.328; unit 3558 -->

【Синтаксис】

<!-- Source EN PDF p.328; unit 3559 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmMatrixName(const rk_aiq_sys_ctx_t* ctx, char
 **ccm_name);
```

<!-- Source EN PDF p.329; unit 3560 -->

【Параметры】

<!-- Source EN PDF p.329; unit 3561 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| ccm_name | Имя матрицы CCM. | Выход |

<!-- Source EN PDF p.329; unit 3562 -->

【Возвращаемое значение】

<!-- Source EN PDF p.329; unit 3563 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.329; unit 3564 -->

【Зависимости】

<!-- Source EN PDF p.329; unit 3565 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.329; unit 3566 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.329; unit 3567 -->

【Пример】

<!-- Source EN PDF p.329; unit 3568 -->

Оригинал указывает получение насыщенности автоматической CCM через sample_get_accm_matrix_name в sample_accm_module.cpp.

<!-- Source EN PDF p.329; unit 3569 -->

#### 9.12.3 Типы данных API уровня функций

<!-- Source EN PDF p.329; unit 3570 -->

9.12.3.1 opMode_t

<!-- Source EN PDF p.329; unit 3571 -->

【Описание】Определяет режим работы CCM.

<!-- Source EN PDF p.329; unit 3572 -->

【Определение】

<!-- Source EN PDF p.329; unit 3573 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUAL = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.329; unit 3574 -->

【Члены】

<!-- Source EN PDF p.329; unit 3575 -->

| Имя члена | Описание |
|---|---|
| OP_AUTO | Автоматический режим |
| OP_MANUAL | Ручной режим |
| OP_INVAL | Недопустимое значение |

<!-- Source EN PDF p.330; unit 3576 -->

9.12.3.2 rk_aiq_ccm_matrix_t

<!-- Source EN PDF p.330; unit 3577 -->

【Описание】Определяет матрицу CCM.

<!-- Source EN PDF p.330; unit 3578 -->

【Определение】

<!-- Source EN PDF p.330; unit 3579 -->

```text
 typedef struct rk_aiq_ccm_matrix_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
 } rk_aiq_ccm_matrix_t;
```

<!-- Source EN PDF p.330; unit 3580 -->

【Члены】

<!-- Source EN PDF p.330; unit 3581 -->

| Имя члена | Описание |
|---|---|
| ccMatrix | Матрица цветокоррекции ручного режима, [-8,7.992]. |
| ccOffsets | Смещения RGB ручного режима, [-4096,4095]. |

<!-- Source EN PDF p.330; unit 3582 -->

#### 9.12.4 API уровня модуля

<!-- Source EN PDF p.330; unit 3583 -->

9.12.4.1 rk_aiq_user_api2_accm_v2_SetAttrib

<!-- Source EN PDF p.330; unit 3584 -->

【Описание】Задаёт свойства CCM.

<!-- Source EN PDF p.330; unit 3585 -->

【Синтаксис】

<!-- Source EN PDF p.330; unit 3586 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t attr);
```

<!-- Source EN PDF p.330; unit 3587 -->

【Параметры】

<!-- Source EN PDF p.330; unit 3588 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Параметры свойств CCM. | Вход |

<!-- Source EN PDF p.330; unit 3589 -->

【Возвращаемое значение】

<!-- Source EN PDF p.330; unit 3590 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.331; unit 3591 -->

【Зависимости】

<!-- Source EN PDF p.331; unit 3592 -->

Заголовочные файлы: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h.

<!-- Source EN PDF p.331; unit 3593 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.331; unit 3594 -->

【Пример】

<!-- Source EN PDF p.331; unit 3595 -->

Настройку свойств CCM см. в sample_ccm_setCcmAttr файла sample_accm_module.cpp.

<!-- Source EN PDF p.331; unit 3596 -->

9.12.4.2 rk_aiq_user_api2_accm_GetAttrib

<!-- Source EN PDF p.331; unit 3597 -->

【Описание】Получает свойства CCM.

<!-- Source EN PDF p.331; unit 3598 -->

【Синтаксис】

<!-- Source EN PDF p.331; unit 3599 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t *attr);
```

<!-- Source EN PDF p.331; unit 3600 -->

【Параметры】

<!-- Source EN PDF p.331; unit 3601 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров CCM. | Выход |

<!-- Source EN PDF p.331; unit 3602 -->

【Возвращаемое значение】

<!-- Source EN PDF p.331; unit 3603 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.331; unit 3604 -->

【Зависимости】

<!-- Source EN PDF p.331; unit 3605 -->

Заголовочные файлы: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h.

<!-- Source EN PDF p.331; unit 3606 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.331; unit 3607 -->

【Пример】

<!-- Source EN PDF p.331; unit 3608 -->

Получение свойств CCM см. в sample_ccm_getCcmAttr файла sample_accm_module.cpp.

<!-- Source EN PDF p.331; unit 3609 -->

9.12.4.3 rk_aiq_user_api2_accm_QueryCcmInfo

<!-- Source EN PDF p.331; unit 3610 -->

【Описание】Запрашивает информацию CCM.

<!-- Source EN PDF p.331; unit 3611 -->

【Синтаксис】

<!-- Source EN PDF p.332; unit 3612 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_QueryCcmInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_querry_info_t *ccm_querry_info);
```

<!-- Source EN PDF p.332; unit 3613 -->

【Параметры】

<!-- Source EN PDF p.332; unit 3614 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| ccm_querry_info | Содержимое запроса CCM. | Выход |

<!-- Source EN PDF p.332; unit 3615 -->

【Возвращаемое значение】

<!-- Source EN PDF p.332; unit 3616 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.332; unit 3617 -->

【Зависимости】

<!-- Source EN PDF p.332; unit 3618 -->

Заголовочные файлы: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h.

<!-- Source EN PDF p.332; unit 3619 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.332; unit 3620 -->

【Пример】

<!-- Source EN PDF p.332; unit 3621 -->

Запрос информации CCM см. в sample_query_ccm_info файла sample_accm_module.cpp.

<!-- Source EN PDF p.332; unit 3622 -->

#### 9.12.5 Типы данных API уровня модуля

<!-- Source EN PDF p.332; unit 3623 -->

9.12.5.1 rk_aiq_ccm_op_mode_t

<!-- Source EN PDF p.332; unit 3624 -->

【Описание】Определяет режим работы CCM.

<!-- Source EN PDF p.332; unit 3625 -->

【Определение】

<!-- Source EN PDF p.332; unit 3626 -->

```text
 typedef enum rk_aiq_ccm_op_mode_s {
     RK_AIQ_CCM_MODE_INVALID                     = 0,
     RK_AIQ_CCM_MODE_MANUAL                      = 1,
     RK_AIQ_CCM_MODE_AUTO                        = 2,
     RK_AIQ_CCM_MODE_MAX
 } rk_aiq_ccm_op_mode_t;
```

<!-- Source EN PDF p.332; unit 3627 -->

【Члены】

<!-- Source EN PDF p.333; unit 3628 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_CCM_MODE_INVALID | Недействительный режим CCM. |
| RK_AIQ_CCM_MODE_MANUAL | Ручной режим CCM. |
| RK_AIQ_CCM_MODE_AUTO | Автоматический режим CCM. |

<!-- Source EN PDF p.333; unit 3629 -->

9.12.5.2 rk_aiq_ccm_mccm_attrib_t

<!-- Source EN PDF p.333; unit 3630 -->

【Описание】Определяет свойства ручной CCM.

<!-- Source EN PDF p.333; unit 3631 -->

【Определение】

<!-- Source EN PDF p.333; unit 3632 -->

```text
 typedef struct rk_aiq_ccm_mccm_attrib_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[17];
     float low_bound_pos_bit;
 } rk_aiq_ccm_mccm_attrib_t;
```

<!-- Source EN PDF p.333; unit 3633 -->

【Члены】

<!-- Source EN PDF p.333; unit 3634 -->

| Имя члена | Описание |
|---|---|
| ccMatrix | Матрица цветокоррекции, [-8,7.992]. |
| ccOffsets | Смещения RGB, [-4096,4095]. |
| y_alpha_curve | Интенсивность цветокоррекции по яркости пикселя (12bit). [0x0,0x400]; 0x400 — единичная интенсивность, 0x0 — без коррекции. |
| low_bound_pos_bit | Диапазоны яркости точек перегиба кривой для пикселей 12bit: [0,2^low_bound_pos_bit] и [4095-2^low_bound_pos_bit,4095]. Допустимые значения [0,10]. |

<!-- Source EN PDF p.333; unit 3635 -->

9.12.5.3 rk_aiq_ccm_color_inhibition_t

<!-- Source EN PDF p.333; unit 3636 -->

【Описание】Определяет уровень подавления цвета CCM.

<!-- Source EN PDF p.333; unit 3637 -->

【Определение】

<!-- Source EN PDF p.334; unit 3638 -->

```text
 typedef struct rk_aiq_ccm_color_inhibition_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_inhibition_t;
```

<!-- Source EN PDF p.334; unit 3639 -->

【Члены】

<!-- Source EN PDF p.334; unit 3640 -->

| Имя члена | Описание |
|---|---|
| sensorGain | Компонент усиления экспозиции. |
| level | Уровень подавления цвета, [0,100], по умолчанию 0. |

<!-- Source EN PDF p.334; unit 3641 -->

9.12.5.4 rk_aiq_ccm_color_saturation_t

<!-- Source EN PDF p.334; unit 3642 -->

【Описание】Определяет уровень насыщенности автоматической CCM.

<!-- Source EN PDF p.334; unit 3643 -->

【Определение】

<!-- Source EN PDF p.334; unit 3644 -->

```text
 typedef struct rk_aiq_ccm_color_saturation_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_saturation_t;
```

<!-- Source EN PDF p.334; unit 3645 -->

【Члены】

<!-- Source EN PDF p.334; unit 3646 -->

| Имя члена | Описание |
|---|---|
| sensorGain | Компонент усиления экспозиции. |
| level | Уровень насыщенности, [0,100], по умолчанию 100. |

<!-- Source EN PDF p.334; unit 3647 -->

9.12.5.5 rk_aiq_ccm_accm_attrib_t

<!-- Source EN PDF p.334; unit 3648 -->

【Описание】Определяет свойства автоматической CCM.

<!-- Source EN PDF p.334; unit 3649 -->

【Определение】

<!-- Source EN PDF p.334; unit 3650 -->

```text
 typedef struct rk_aiq_ccm_accm_attrib_s {
     rk_aiq_ccm_color_inhibition_t color_inhibition;
     rk_aiq_ccm_color_saturation_t color_saturation;
 } rk_aiq_ccm_accm_attrib_t;
```

<!-- Source EN PDF p.334; unit 3651 -->

【Члены】

<!-- Source EN PDF p.335; unit 3652 -->

| Имя члена | Описание |
|---|---|
| color_inhibition | Уровень подавления цвета CCM. |
| color_saturation | Уровень насыщенности CCM. |

<!-- Source EN PDF p.335; unit 3653 -->

9.12.5.6 rk_aiq_ccm_attrib_t

<!-- Source EN PDF p.335; unit 3654 -->

【Описание】Определяет свойства CCM.

<!-- Source EN PDF p.335; unit 3655 -->

【Определение】

<!-- Source EN PDF p.335; unit 3656 -->

```text
 typedef struct rk_aiq_ccm_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_ccm_op_mode_t mode;
     rk_aiq_ccm_mccm_attrib_t stManual;
     rk_aiq_ccm_accm_attrib_t stAuto;
     CalibDbV2_Ccm_Para_V2_t stTool;
 } rk_aiq_ccm_attrib_t;
```

<!-- Source EN PDF p.335; unit 3657 -->

【Члены】

<!-- Source EN PDF p.335; unit 3658 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронный/асинхронный сигнал; см. определение rk_aiq_uapi_sync_t и раздел «Обзор/Описание API». |
| byPass | Пропуск обработки: true обходит CCM, false включает CCM. |
| mode | Режим {RK_AIQ_CCM_MODE_MANUAL, RK_AIQ_CCM_MODE_AUTO}: ручной либо автоматический. |
| stManual | Конфигурация свойств ручного режима. |
| stAuto | Конфигурация свойств автоматического режима. |
| stTool | Параметры режима инструмента, настройка не требуется. |

<!-- Source EN PDF p.335; unit 3659 -->

9.12.5.7 rk_aiq_ccm_querry_info_t

<!-- Source EN PDF p.335; unit 3660 -->

【Описание】Определяет запрашиваемую информацию CCM.

<!-- Source EN PDF p.335; unit 3661 -->

【Определение】

<!-- Source EN PDF p.336; unit 3662 -->

```text
 typedef struct rk_aiq_ccm_querry_info_s {
     bool ccm_en;
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[CCM_CURVE_DOT_NUM];
     float low_bound_pos_bit;
     float color_inhibition_level;
     float color_saturation_level;
     float finalSat;
     char  ccmname1[25];
     char  ccmname2[25];
 } rk_aiq_ccm_querry_info_t;
```

<!-- Source EN PDF p.336; unit 3663 -->

【Члены】

<!-- Source EN PDF p.336; unit 3664 -->

| Имя члена | Описание |
|---|---|
| ccm_en | CCM: true включена, false отключена. |
| ccMatrix | Действующая матрица CCM, [-8,7.992]. |
| ccOffsets | Действующие смещения RGB, [-4096,4095]. |
| y_alpha_curve | Интенсивность цветокоррекции по яркости пикселя (12bit). [0x0,0x400]; 0x400 — единичная интенсивность, 0x0 — без коррекции. |
| low_bound_pos_bit | Диапазоны яркости точек перегиба кривой для пикселей 12bit: [0,2^low_bound_pos_bit] и [4095-2^low_bound_pos_bit,4095]. Допустимые значения [0,10]. |
| color_inhibition_level | Уровень подавления цвета CCM, только автоматический режим. |
| color_saturation_level | Уровень насыщенности CCM, только автоматический режим. |
| finalSat | Насыщенность текущей матрицы, только автоматический режим. |
| ccmname1 | Имя калибровочной матрицы для интерполяции текущей матрицы, только автоматический режим. |
| ccmname2 | Имя калибровочной матрицы для интерполяции текущей матрицы, только автоматический режим. |

<!-- Source EN PDF p.337; unit 3665 -->

### 9.13 3DLUT

<!-- Source EN PDF p.337; unit 3666 -->

#### 9.13.1 Описание функции

<!-- Source EN PDF p.337; unit 3667 -->

Модуль 3DLUT (трёхмерная таблица поиска) отображает цвета изображения в пространстве RGB.

<!-- Source EN PDF p.337; unit 3668 -->

#### 9.13.2 API уровня функций

<!-- Source EN PDF p.337; unit 3669 -->

9.13.2.1 rk_aiq_uapi2_setLut3dMode

<!-- Source EN PDF p.337; unit 3670 -->

【Описание】Задаёт режим работы 3DLUT.

<!-- Source EN PDF p.337; unit 3671 -->

【Синтаксис】

<!-- Source EN PDF p.337; unit 3672 -->

```text
 XCamReturn rk_aiq_uapi2_setLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.337; unit 3673 -->

【Параметры】

<!-- Source EN PDF p.337; unit 3674 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы, {OP_AUTO, OP_MANUAL}. | Вход |

<!-- Source EN PDF p.337; unit 3675 -->

【Возвращаемое значение】

<!-- Source EN PDF p.337; unit 3676 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.337; unit 3677 -->

【Зависимости】

<!-- Source EN PDF p.337; unit 3678 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.337; unit 3679 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.337; unit 3680 -->

【Пример】

<!-- Source EN PDF p.337; unit 3681 -->

Настройку ручного/автоматического режима см. в sample_set_a3dlut_manual / sample_set_a3dlut_auto файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.337; unit 3682 -->

9.13.2.2 rk_aiq_uapi2_getLut3dMode

<!-- Source EN PDF p.337; unit 3683 -->

【Описание】Получает режим работы 3DLUT.

<!-- Source EN PDF p.337; unit 3684 -->

【Синтаксис】

<!-- Source EN PDF p.338; unit 3685 -->

```text
 XCamReturn rk_aiq_uapi2_getLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.338; unit 3686 -->

【Параметры】

<!-- Source EN PDF p.338; unit 3687 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mode | Режим работы | Выход |

<!-- Source EN PDF p.338; unit 3688 -->

【Возвращаемое значение】

<!-- Source EN PDF p.338; unit 3689 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.338; unit 3690 -->

【Зависимости】

<!-- Source EN PDF p.338; unit 3691 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.338; unit 3692 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.338; unit 3693 -->

【Пример】

<!-- Source EN PDF p.338; unit 3694 -->

Оригинал указывает настройку ручного/автоматического режима через sample_get_a3dlut_mode в sample_a3dlut_module.cpp.

<!-- Source EN PDF p.338; unit 3695 -->

9.13.2.3 rk_aiq_uapi2_setM3dLut

<!-- Source EN PDF p.338; unit 3696 -->

【Описание】Задаёт ручную трёхмерную таблицу 3DLUT.

<!-- Source EN PDF p.338; unit 3697 -->

【Синтаксис】

<!-- Source EN PDF p.338; unit 3698 -->

```text
 XCamReturn rk_aiq_uapi2_setM3dLut(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.338; unit 3699 -->

【Параметры】

<!-- Source EN PDF p.338; unit 3700 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mlut | Трёхмерная таблица поиска. | Вход |

<!-- Source EN PDF p.338; unit 3701 -->

【Возвращаемое значение】

<!-- Source EN PDF p.338; unit 3702 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.339; unit 3703 -->

【Зависимости】

<!-- Source EN PDF p.339; unit 3704 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3705 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.339; unit 3706 -->

【Пример】

<!-- Source EN PDF p.339; unit 3707 -->

Настройку ручной 3DLUT см. в sample_set_a3dlut_manual_lut файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.339; unit 3708 -->

9.13.2.4 rk_aiq_uapi2_getM3dLut

<!-- Source EN PDF p.339; unit 3709 -->

【Описание】Получает трёхмерную таблицу 3DLUT.

<!-- Source EN PDF p.339; unit 3710 -->

【Синтаксис】

<!-- Source EN PDF p.339; unit 3711 -->

```text
 XCamReturn rk_aiq_uapi2_getM3dLut(const rk_aiq_sys_ctx_t* ctx,
  rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.339; unit 3712 -->

【Параметры】

<!-- Source EN PDF p.339; unit 3713 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| mlut | Трёхмерная таблица поиска. | Выход |

<!-- Source EN PDF p.339; unit 3714 -->

【Возвращаемое значение】

<!-- Source EN PDF p.339; unit 3715 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.339; unit 3716 -->

【Зависимости】

<!-- Source EN PDF p.339; unit 3717 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3718 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.339; unit 3719 -->

【Пример】

<!-- Source EN PDF p.339; unit 3720 -->

Получение 3DLUT см. в sample_get_a3dlut_lut файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.339; unit 3721 -->

9.13.2.5 rk_aiq_uapi2_getA3dLutStrth

<!-- Source EN PDF p.339; unit 3722 -->

【Описание】Получает интенсивность коррекции 3DLUT.

<!-- Source EN PDF p.339; unit 3723 -->

【Синтаксис】

<!-- Source EN PDF p.339; unit 3724 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutStrth(const rk_aiq_sys_ctx_t* ctx, float alpha);
```

<!-- Source EN PDF p.340; unit 3725 -->

【Параметры】

<!-- Source EN PDF p.340; unit 3726 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| alpha | Интенсивность коррекции 3DLUT. | Выход |

<!-- Source EN PDF p.340; unit 3727 -->

【Возвращаемое значение】

<!-- Source EN PDF p.340; unit 3728 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.340; unit 3729 -->

【Зависимости】

<!-- Source EN PDF p.340; unit 3730 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.340; unit 3731 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.340; unit 3732 -->

【Пример】

<!-- Source EN PDF p.340; unit 3733 -->

Интенсивность 3DLUT см. в sample_get_a3dlut_strength файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.340; unit 3734 -->

9.13.2.6 rk_aiq_uapi2_getA3dLutName

<!-- Source EN PDF p.340; unit 3735 -->

【Описание】Получает имя таблицы 3DLUT автоматического режима.

<!-- Source EN PDF p.340; unit 3736 -->

【Синтаксис】

<!-- Source EN PDF p.340; unit 3737 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutName(const rk_aiq_sys_ctx_t* ctx, char *name);
```

<!-- Source EN PDF p.340; unit 3738 -->

【Параметры】

<!-- Source EN PDF p.340; unit 3739 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| name | Имя таблицы 3DLUT. | Выход |

<!-- Source EN PDF p.340; unit 3740 -->

【Возвращаемое значение】

<!-- Source EN PDF p.340; unit 3741 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.340; unit 3742 -->

【Зависимости】

<!-- Source EN PDF p.340; unit 3743 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.341; unit 3744 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.341; unit 3745 -->

【Пример】

<!-- Source EN PDF p.341; unit 3746 -->

Получение имени автоматической 3DLUT см. в sample_get_a3dlut_lutname файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.341; unit 3747 -->

#### 9.13.3 Типы данных API уровня функций

<!-- Source EN PDF p.341; unit 3748 -->

9.13.3.1 opMode_t

<!-- Source EN PDF p.341; unit 3749 -->

【Описание】Определяет режим работы 3DLUT.

<!-- Source EN PDF p.341; unit 3750 -->

【Определение】

<!-- Source EN PDF p.341; unit 3751 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.341; unit 3752 -->

【Члены】

<!-- Source EN PDF p.341; unit 3753 -->

| Имя члена | Описание |
|---|---|
| OP_AUTO | Автоматический режим |
| OP_MANUALl | Ручной режим |
| OP_INVAL | Недопустимое значение |

<!-- Source EN PDF p.341; unit 3754 -->

9.13.3.2 rk_aiq_lut3d_table_t

<!-- Source EN PDF p.341; unit 3755 -->

【Описание】Определяет трёхмерную таблицу 3DLUT.

<!-- Source EN PDF p.341; unit 3756 -->

【Определение】

<!-- Source EN PDF p.341; unit 3757 -->

```text
 typedef struct rk_aiq_lut3d_table_s{
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_table_t;
```

<!-- Source EN PDF p.341; unit 3758 -->

【Члены】

<!-- Source EN PDF p.342; unit 3759 -->

| Имя члена | Описание |
|---|---|
| look_up_table_r | Таблица R ручного режима, [0x0,0x3ff]. |
| look_up_table_g | Таблица G ручного режима, [0x0,0xfff]. |
| look_up_table_b | Таблица B ручного режима, [0x0,0x3ff]. |

<!-- Source EN PDF p.342; unit 3760 -->

#### 9.13.4 API уровня модуля

<!-- Source EN PDF p.342; unit 3761 -->

9.13.4.1 rk_aiq_user_api2_a3dlut_SetAttrib

<!-- Source EN PDF p.342; unit 3762 -->

【Описание】Задаёт свойства 3DLUT.

<!-- Source EN PDF p.342; unit 3763 -->

【Синтаксис】

<!-- Source EN PDF p.342; unit 3764 -->

```text
 XCamReturn rk_aiq_user_api2_a3dlut_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t attr);
```

<!-- Source EN PDF p.342; unit 3765 -->

【Параметры】

<!-- Source EN PDF p.342; unit 3766 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров 3DLUT. | Вход |

<!-- Source EN PDF p.342; unit 3767 -->

【Возвращаемое значение】

<!-- Source EN PDF p.342; unit 3768 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.342; unit 3769 -->

【Зависимости】

<!-- Source EN PDF p.342; unit 3770 -->

Заголовочные файлы: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h.

<!-- Source EN PDF p.342; unit 3771 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.342; unit 3772 -->

【Пример】

<!-- Source EN PDF p.342; unit 3773 -->

Настройку 3DLUT см. в sample_3dlut_set3dlutAttr файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.343; unit 3774 -->

9.13.4.2 rk_aiq_user_api2_a3dlut_GetAttrib

<!-- Source EN PDF p.343; unit 3775 -->

【Описание】Получает свойства 3DLUT.

<!-- Source EN PDF p.343; unit 3776 -->

【Синтаксис】

<!-- Source EN PDF p.343; unit 3777 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t *attr);
```

<!-- Source EN PDF p.343; unit 3778 -->

【Параметры】

<!-- Source EN PDF p.343; unit 3779 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров 3DLUT. | Выход |

<!-- Source EN PDF p.343; unit 3780 -->

【Возвращаемое значение】

<!-- Source EN PDF p.343; unit 3781 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.343; unit 3782 -->

【Зависимости】

<!-- Source EN PDF p.343; unit 3783 -->

Заголовочные файлы: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h.

<!-- Source EN PDF p.343; unit 3784 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.343; unit 3785 -->

【Пример】

<!-- Source EN PDF p.343; unit 3786 -->

Получение 3DLUT см. в sample_3dlut_get3dlutAttr и подобных примерах файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.343; unit 3787 -->

9.13.4.3 rk_aiq_user_api2_a3dlut_Query3dlutInfo

<!-- Source EN PDF p.343; unit 3788 -->

【Описание】Запрашивает информацию 3DLUT.

<!-- Source EN PDF p.343; unit 3789 -->

【Синтаксис】

<!-- Source EN PDF p.343; unit 3790 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_Query3dlutInfo(const RkAiqAlgoContext *ctx,
 rk_aiq_lut3d_querry_info_t *lut3d_querry_info );
```

<!-- Source EN PDF p.343; unit 3791 -->

【Параметры】

<!-- Source EN PDF p.344; unit 3792 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| lut3d_querry_info | Содержимое запроса 3DLUT. | Выход |

<!-- Source EN PDF p.344; unit 3793 -->

【Возвращаемое значение】

<!-- Source EN PDF p.344; unit 3794 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.344; unit 3795 -->

【Зависимости】

<!-- Source EN PDF p.344; unit 3796 -->

Заголовочные файлы: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h.

<!-- Source EN PDF p.344; unit 3797 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.344; unit 3798 -->

【Пример】

<!-- Source EN PDF p.344; unit 3799 -->

Информацию 3DLUT см. в sample_query_a3dlut_info файла sample_a3dlut_module.cpp.

<!-- Source EN PDF p.344; unit 3800 -->

#### 9.13.5 Типы данных API уровня модуля

<!-- Source EN PDF p.344; unit 3801 -->

9.13.5.1 rk_aiq_lut3d_op_mode_t

<!-- Source EN PDF p.344; unit 3802 -->

【Описание】Определяет режим работы 3DLUT.

<!-- Source EN PDF p.344; unit 3803 -->

【Определение】

<!-- Source EN PDF p.344; unit 3804 -->

```text
 typedef enum rk_aiq_lut3d_op_mode_s {
     RK_AIQ_LUT3D_MODE_INVALID                     = 0,
     RK_AIQ_LUT3D_MODE_MANUAL                      = 1,
     RK_AIQ_LUT3D_MODE_AUTO                        = 2,
     RK_AIQ_LUT3D_MODE_MAX
 } rk_aiq_lut3d_op_mode_t;
```

<!-- Source EN PDF p.344; unit 3805 -->

【Члены】

<!-- Source EN PDF p.344; unit 3806 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_LUT3D_MODE_INVALID | Недействительный режим 3DLUT. |
| RK_AIQ_LUT3D_MODE_MANUAL | Ручной режим 3DLUT. |
| RK_AIQ_LUT3D_MODE_AUTO | Автоматический режим 3DLUT. |

<!-- Source EN PDF p.345; unit 3807 -->

9.13.5.2 rk_aiq_lut3d_mlut3d_attrib_t

<!-- Source EN PDF p.345; unit 3808 -->

【Описание】Определяет свойства ручной 3DLUT.

<!-- Source EN PDF p.345; unit 3809 -->

【Определение】

<!-- Source EN PDF p.345; unit 3810 -->

```text
 typedef struct rk_aiq_lut3d_mlut3d_attrib_s {
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_mlut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3811 -->

【Члены】

<!-- Source EN PDF p.345; unit 3812 -->

| Имя члена | Описание |
|---|---|
| look_up_table_r | Таблица R ручного режима, [0x0,0x3ff]. |
| look_up_table_g | Таблица G ручного режима, [0x0,0xfff]. |
| look_up_table_b | Таблица B ручного режима, [0x0,0x3ff]. |

<!-- Source EN PDF p.345; unit 3813 -->

9.13.5.3 rk_aiq_lut3d_attrib_t

<!-- Source EN PDF p.345; unit 3814 -->

【Описание】Определяет свойства 3DLUT.

<!-- Source EN PDF p.345; unit 3815 -->

【Определение】

<!-- Source EN PDF p.345; unit 3816 -->

```text
 typedef struct rk_aiq_lut3d_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_lut3d_op_mode_t mode;
     rk_aiq_lut3d_mlut3d_attrib_t stManual;
 } rk_aiq_lut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3817 -->

【Члены】

<!-- Source EN PDF p.346; unit 3818 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронный/асинхронный сигнал; см. определение rk_aiq_uapi_sync_t и раздел «Обзор/Описание API». |
| byPass | Пропуск обработки: true обходит 3DLUT, false включает. |
| mode | Режим {RK_AIQ_LUT3D_MODE_MANUAL, RK_AIQ_LUT3D_MODE_AUTO}: ручной либо автоматический. |
| stManual | Конфигурация свойств ручного режима. |

<!-- Source EN PDF p.346; unit 3819 -->

9.13.5.4 rk_aiq_lut3d_querry_info_t

<!-- Source EN PDF p.346; unit 3820 -->

【Описание】Определяет запрашиваемую информацию 3DLUT.

<!-- Source EN PDF p.346; unit 3821 -->

【Определение】

<!-- Source EN PDF p.346; unit 3822 -->

```text
 typedef struct rk_aiq_lut3d_querry_info_s {
     bool lut3d_en;
     float alpha;
     char name[25];
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_querry_info_t;
```

<!-- Source EN PDF p.346; unit 3823 -->

【Члены】

<!-- Source EN PDF p.346; unit 3824 -->

| Имя члена | Описание |
|---|---|
| lut3d_en | 3DLUT: true включена, false отключена. |
| alpha | Интенсивность коррекции 3DLUT, [0,1.0]; большее значение усиливает коррекцию. В конце исходной строки указано 1.0. |
| name | Имя таблицы 3DLUT, только автоматический режим. |
| look_up_table_r | Таблица канала R, [0x0,0x3ff]. |
| look_up_table_g | Таблица канала G, [0x0,0xfff]. |
| look_up_table_b | Таблица канала B, [0x0,0x3ff]. |

<!-- Source EN PDF p.347; unit 3825 -->

### 9.14 LDCH

<!-- Source EN PDF p.347; unit 3826 -->

#### 9.14.1 Описание функции

<!-- Source EN PDF p.347; unit 3827 -->

LDCH восстанавливает искажённое изображение, исправляя дисторсию только по горизонтали.

<!-- Source EN PDF p.347; unit 3828 -->

#### 9.14.2 API уровня функций

<!-- Source EN PDF p.347; unit 3829 -->

9.14.2.1 rk_aiq_uapi_setLdchEn

<!-- Source EN PDF p.347; unit 3830 -->

【Описание】Переключатель коррекции горизонтальной дисторсии.

<!-- Source EN PDF p.347; unit 3831 -->

【Синтаксис】

<!-- Source EN PDF p.347; unit 3832 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchEn(const rk_aiq_sys_ctx_t* ctx, bool en);
```

<!-- Source EN PDF p.347; unit 3833 -->

【Параметры】

<!-- Source EN PDF p.347; unit 3834 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| en | Переключатель коррекции. | Вход |

<!-- Source EN PDF p.347; unit 3835 -->

【Возвращаемое значение】

<!-- Source EN PDF p.347; unit 3836 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.347; unit 3837 -->

【Зависимости】

<!-- Source EN PDF p.347; unit 3838 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.347; unit 3839 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.347; unit 3840 -->

9.14.2.2 rk_aiq_uapi2_setLdchCorrectLevel

<!-- Source EN PDF p.347; unit 3841 -->

【Описание】Задаёт уровень коррекции горизонтальной дисторсии.

<!-- Source EN PDF p.347; unit 3842 -->

【Синтаксис】

<!-- Source EN PDF p.347; unit 3843 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchCorrectLevel(const rk_aiq_sys_ctx_t* ctx, int
 correctLevel);
```

<!-- Source EN PDF p.347; unit 3844 -->

【Параметры】

<!-- Source EN PDF p.348; unit 3845 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| correctLevel | Уровень коррекции, [0~255]. | Вход |

<!-- Source EN PDF p.348; unit 3846 -->

【Возвращаемое значение】

<!-- Source EN PDF p.348; unit 3847 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.348; unit 3848 -->

【Зависимости】

<!-- Source EN PDF p.348; unit 3849 -->

Заголовочный файл: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.348; unit 3850 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.348; unit 3851 -->

#### 9.14.3 API уровня модуля

<!-- Source EN PDF p.348; unit 3852 -->

9.14.3.1 rk_aiq_user_api2_aldch_SetAttrib

<!-- Source EN PDF p.348; unit 3853 -->

【Описание】Задаёт свойства FEC (так в оригинале; раздел посвящён LDCH).

<!-- Source EN PDF p.348; unit 3854 -->

【Синтаксис】

<!-- Source EN PDF p.348; unit 3855 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.348; unit 3856 -->

【Параметры】

<!-- Source EN PDF p.348; unit 3857 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров LDCH. | Вход |

<!-- Source EN PDF p.348; unit 3858 -->

【Возвращаемое значение】

<!-- Source EN PDF p.348; unit 3859 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.348; unit 3860 -->

【Зависимости】

<!-- Source EN PDF p.348; unit 3861 -->

Заголовочный файл: rk_aiq_user_api2_aldch.h.

<!-- Source EN PDF p.348; unit 3862 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.349; unit 3863 -->

9.14.3.2 rk_aiq_user_api2_aldch_GetAttrib

<!-- Source EN PDF p.349; unit 3864 -->

【Описание】Получает свойства FEC (так в оригинале).

<!-- Source EN PDF p.349; unit 3865 -->

【Синтаксис】

<!-- Source EN PDF p.349; unit 3866 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.349; unit 3867 -->

【Параметры】

<!-- Source EN PDF p.349; unit 3868 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства параметров LDCH. | Вход |

<!-- Source EN PDF p.349; unit 3869 -->

【Возвращаемое значение】

<!-- Source EN PDF p.349; unit 3870 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.349; unit 3871 -->

【Зависимости】

<!-- Source EN PDF p.349; unit 3872 -->

Заголовочный файл: rk_aiq_user_api2_aldch.h.

<!-- Source EN PDF p.349; unit 3873 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.349; unit 3874 -->

#### 9.14.4 Типы данных API уровня модуля

<!-- Source EN PDF p.349; unit 3875 -->

9.14.4.1 rk_aiq_ldch_attrib_t

<!-- Source EN PDF p.349; unit 3876 -->

【Описание】Конфигурация свойств LDCH.

<!-- Source EN PDF p.349; unit 3877 -->

【Определение】

<!-- Source EN PDF p.349; unit 3878 -->

```text
 typedef struct rk_aiq_ldch_cfg_s {
     rk_aiq_uapi_sync_t sync;
     unsigned int en;
     int correct_level;
 } rk_aiq_ldch_cfg_t;
```

<!-- Source EN PDF p.349; unit 3879 -->

【Члены】

<!-- Source EN PDF p.350; unit 3880 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронное/асинхронное выполнение интерфейса; см. rk_aiq_uapi_sync_t и раздел «Обзор/Описание API». |
| en | Включает/отключает LDCH. |
| correct_level | Уровень коррекции LDCH: [0~255]. |

<!-- Source EN PDF p.350; unit 3881 -->

### 9.15 DeBayer

<!-- Source EN PDF p.350; unit 3882 -->

#### 9.15.1 Описание функции

<!-- Source EN PDF p.350; unit 3883 -->

DeBayer интерполяцией восстанавливает из CFA-изображения датчика RGB с полной информацией каждого пикселя.

<!-- Source EN PDF p.350; unit 3884 -->

Поддерживаются Bayer raw с RGGB, BGGR, GRBG и gbrg. Другие CFA, включая CCCB и RGB-IR, пока не поддерживаются.

<!-- Source EN PDF p.350; unit 3885 -->

#### 9.15.2 API уровня модуля

<!-- Source EN PDF p.350; unit 3886 -->

9.15.2.1 rk_aiq_user_api_adebayer_SetAttrib

<!-- Source EN PDF p.350; unit 3887 -->

【Описание】Задаёт свойства демозаики.

<!-- Source EN PDF p.350; unit 3888 -->

【Синтаксис】

<!-- Source EN PDF p.350; unit 3889 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t attr);
```

<!-- Source EN PDF p.350; unit 3890 -->

【Параметры】

<!-- Source EN PDF p.350; unit 3891 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства демозаики. | Вход |

<!-- Source EN PDF p.350; unit 3892 -->

【Возвращаемое значение】

<!-- Source EN PDF p.350; unit 3893 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.350; unit 3894 -->

【Зависимости】

<!-- Source EN PDF p.351; unit 3895 -->

Заголовочный файл: rk_aiq_user_api2_adebayer.h.

<!-- Source EN PDF p.351; unit 3896 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.351; unit 3897 -->

9.15.2.2 rk_aiq_user_api_adebayer_GetAttrib

<!-- Source EN PDF p.351; unit 3898 -->

【Описание】Получает свойства демозаики.

<!-- Source EN PDF p.351; unit 3899 -->

【Синтаксис】

<!-- Source EN PDF p.351; unit 3900 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t *attr);
```

<!-- Source EN PDF p.351; unit 3901 -->

【Параметры】

<!-- Source EN PDF p.351; unit 3902 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства демозаики. | Выход |

<!-- Source EN PDF p.351; unit 3903 -->

【Возвращаемое значение】

<!-- Source EN PDF p.351; unit 3904 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.351; unit 3905 -->

【Зависимости】

<!-- Source EN PDF p.351; unit 3906 -->

Заголовочный файл: rk_aiq_uapi2_adebayer_int.h.

<!-- Source EN PDF p.351; unit 3907 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.351; unit 3908 -->

#### 9.15.3 Типы данных

<!-- Source EN PDF p.351; unit 3909 -->

9.15.3.1 rk_aiq_debayer_op_mode_t

<!-- Source EN PDF p.351; unit 3910 -->

【Описание】Определяет режим работы debayer.

<!-- Source EN PDF p.351; unit 3911 -->

【Определение】

<!-- Source EN PDF p.352; unit 3912 -->

```text
 typedef enum rk_aiq_debayer_op_mode_s {
     RK_AIQ_DEBAYER_MODE_INVALID                     = 0,        /**<
 initialization value */
     RK_AIQ_DEBAYER_MODE_MANUAL                      = 1,        /**< run manual
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_AUTO                        = 2,        /**< run auto
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_MAX
 } rk_aiq_debayer_op_mode_t;
```

<!-- Source EN PDF p.352; unit 3913 -->

【Члены】

<!-- Source EN PDF p.352; unit 3914 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_DEBAYER_MODE_INVALID | Недействительный режим Debayer. |
| RK_AIQ_DEBAYER_MODE_MANUAL | Ручной режим Debayer. |
| RK_AIQ_DEBAYER_MODE_AUTO | Автоматический режим Debayer. |

<!-- Source EN PDF p.352; unit 3915 -->

9.15.3.2 adebayer_attrib_manual_t

<!-- Source EN PDF p.352; unit 3916 -->

【Описание】Определяет настраиваемые свойства ручного режима debayer.

<!-- Source EN PDF p.352; unit 3917 -->

【Определение】

<!-- Source EN PDF p.352; unit 3918 -->

```text
 typedef struct adebayer_attrib_manual_s {
     int8_t      filter1[5];
     int8_t      filter2[5];
     uint8_t     gain_offset;
     uint8_t     sharp_strength;
     uint8_t     hf_offset;
     uint8_t     offset;
     uint8_t     clip_en;
     uint8_t     filter_g_en;
     uint8_t     filter_c_en;
     uint8_t     thed0;
     uint8_t     thed1;
     uint8_t     dist_scale;
     uint8_t     cnr_strength;
     uint8_t     shift_num;
 } adebayer_attrib_manual_t;
```

<!-- Source EN PDF p.352; unit 3919 -->

【Члены】

<!-- Source EN PDF p.353; unit 3920 -->

| Имя члена | Описание |
|---|---|
| filter1 | Фильтр низкочастотного градиента, [-8,7]. |
| filter2 | Фильтр высокочастотного градиента, [-8,7]. |
| gain_offset | Смещение градиента при вычислении веса резкости коэффициента интерполяции G, [0,15]. |
| sharp_strength | Интенсивность резкости интерполяции G; большее значение усиливает её. [0,4]. |
| hf_offset | Направленность интерполяции: меньшие значения вызывают ложные текстуры на ровных участках, большие — ступенчатость краёв. [0,4095]. |
| offset | Смещение ограничения G; большее значение расширяет диапазон ограничения. [0,65535]. |
| clip_en | Ограничение интерполяции G: 0 выключено, 1 включено. |
| filter_g_en | Удаление одиночных выбросов G: 0 выключено, 1 включено. |
| filter_c_en | Удаление ложных цветов: 0 выключено, 1 включено. |
| thed0 | Большее значение снижает вероятность выбора высокочастотного веса. [0,16]. |
| thed1 | Выбор высоко-/низкочастотных весов; большее значение снижает вероятность выбора низкочастотного веса. [0,16]. |
| dist_scale | Большее значение снижает вероятность выбора высокочастотного веса. [0,16]. |
| cnr_strength | Большее значение повышает интенсивность. [0,9]. |
| shift_num | Меньшее значение расширяет диапазон ограничения цветовых разностей. [0,4]. |

<!-- Source EN PDF p.353; unit 3921 -->

9.15.3.3 adebayer_attrib_auto_t

<!-- Source EN PDF p.353; unit 3922 -->

【Описание】Определяет настраиваемые свойства автоматического режима debayer.

<!-- Source EN PDF p.353; unit 3923 -->

【Определение】

<!-- Source EN PDF p.354; unit 3924 -->

```text
 typedef struct adebayer_attrib_auto_s {
     uint8_t     sharp_strength[9];
     uint8_t     low_freq_thresh;
     uint8_t     high_freq_thresh;
 } adebayer_attrib_auto_t;
```

<!-- Source EN PDF p.354; unit 3925 -->

【Члены】

<!-- Source EN PDF p.354; unit 3926 -->

| Имя члена | Описание |
|---|---|
| enhance_strength[9] | Усиление деталей/текстур по ISO: индексы 0–8 соответствуют ISO 50, 100, 200, 400, 800, 1600, 3200, 6400, 12800. Большее значение повышает детализацию и чёткость, но также ложные детали. [0~7]. |
| low_freq_thresh | Порог выбора низкочастотного веса; большее значение снижает вероятность его выбора. [0~15]. |
| high_freq_thresh | Порог выбора высокочастотного веса; большее значение снижает вероятность его выбора. [0~15]. |

<!-- Source EN PDF p.354; unit 3927 -->

9.15.3.4 adebayer_attrib_t

<!-- Source EN PDF p.354; unit 3928 -->

【Описание】Определяет настраиваемые свойства debayer.

<!-- Source EN PDF p.354; unit 3929 -->

【Определение】

<!-- Source EN PDF p.354; unit 3930 -->

```text
 typedef struct adebayer_attrib_s {
     rk_aiq_uapi_sync_t          sync;
     uint8_t                     enable;
     rk_aiq_debayer_op_mode_t    mode;
     adebayer_attrib_manual_t    stManual;
     adebayer_attrib_auto_t      stAuto;
 } adebayer_attrib_t;
```

<!-- Source EN PDF p.354; unit 3931 -->

【Члены】

<!-- Source EN PDF p.355; unit 3932 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронный/асинхронный режим интерфейса см. в rk_aiq_uapi_sync_t и «Обзор/Описание API». |
| enable | Переключатель debayer: 0 — обход, 1 — включение. |
| mode | Режим работы Debayer. |
| stManual | Свойства конфигурации ручного режима Debaye (написание оригинала). |
| stAuto | Свойства конфигурации автоматического режима debayer. |

<!-- Source EN PDF p.355; unit 3933 -->

### 9.16 DPCC

<!-- Source EN PDF p.355; unit 3934 -->

#### 9.16.1 Описание функции

<!-- Source EN PDF p.355; unit 3935 -->

Обнаруживает и устраняет дефектные пиксели. См. «Описание функции» раздела 4.6 «DPCC» в Rockchip_Tuning_Guide_ISP30.

<!-- Source EN PDF p.355; unit 3936 -->

#### 9.16.2 API уровня модуля

<!-- Source EN PDF p.355; unit 3937 -->

9.16.2.1 rk_aiq_user_api2_adpcc_SetAttrib

<!-- Source EN PDF p.355; unit 3938 -->

【Описание】Задаёт программные свойства DPCC.

<!-- Source EN PDF p.355; unit 3939 -->

【Синтаксис】

<!-- Source EN PDF p.355; unit 3940 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.355; unit 3941 -->

【Параметры】

<!-- Source EN PDF p.355; unit 3942 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств DPCC. | Вход |

<!-- Source EN PDF p.355; unit 3943 -->

【Возвращаемое значение】

<!-- Source EN PDF p.355; unit 3944 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.356; unit 3945 -->

【Зависимости】

<!-- Source EN PDF p.356; unit 3946 -->

Заголовочный файл: rk_aiq_user_api2_adpcc.h.

<!-- Source EN PDF p.356; unit 3947 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.356; unit 3948 -->

【Описание】

<!-- Source EN PDF p.356; unit 3949 -->

9.16.2.2 rk_aiq_user_api2_adpcc_GetAttrib

<!-- Source EN PDF p.356; unit 3950 -->

【Описание】Получает программные свойства DPCC.

<!-- Source EN PDF p.356; unit 3951 -->

【Синтаксис】

<!-- Source EN PDF p.356; unit 3952 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.356; unit 3953 -->

【Параметры】

<!-- Source EN PDF p.356; unit 3954 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств DPCC. | Выход |

<!-- Source EN PDF p.356; unit 3955 -->

【Возвращаемое значение】

<!-- Source EN PDF p.356; unit 3956 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.356; unit 3957 -->

【Зависимости】

<!-- Source EN PDF p.356; unit 3958 -->

Заголовочный файл: rk_aiq_user_api2_adpcc.h.

<!-- Source EN PDF p.356; unit 3959 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.356; unit 3960 -->

【Описание】

<!-- Source EN PDF p.356; unit 3961 -->

#### 9.16.3 Типы данных

<!-- Source EN PDF p.356; unit 3962 -->

9.16.3.1 rk_aiq_dpcc_attrib_V20_t

<!-- Source EN PDF p.356; unit 3963 -->

【Описание】Определяет свойства устранения дефектных пикселей.

<!-- Source EN PDF p.356; unit 3964 -->

【Определение】

<!-- Source EN PDF p.357; unit 3965 -->

```text
 typedef struct rk_aiq_dpcc_attrib_V20_s {
     AdpccOPMode_t eMode;
     Adpcc_Auto_Attr_t stAuto;
     Adpcc_Manual_Attr_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_dpcc_attrib_V20_t;
```

<!-- Source EN PDF p.357; unit 3966 -->

【Члены】

<!-- Source EN PDF p.357; unit 3967 -->

| Имя члена | Описание |
|---|---|
| eMode | Определяет режим DPCC; см. AdpccOPMode_t. |
| stAuto | Настройки автоматического режима. |
| stManual | Настройки ручного режима. |
| sync | Синхронное/асинхронное выполнение интерфейса; см. rk_aiq_uapi_sync_t и «Обзор/Описание API». |

<!-- Source EN PDF p.357; unit 3968 -->

9.16.3.2 AdpccOPMode_t

<!-- Source EN PDF p.357; unit 3969 -->

【Описание】Определяет режим DPCC.

<!-- Source EN PDF p.357; unit 3970 -->

【Определение】

<!-- Source EN PDF p.357; unit 3971 -->

```text
 typedef enum AdpccOPMode_e {
     ADPCC_OP_MODE_INVALID        = 0,
     ADPCC_OP_MODE_AUTO           = 1,
     ADPCC_OP_MODE_MANUAL         = 2,
     ADPCC_OP_MODE_TOOL           = 3,
     ADPCC_OP_MODE_MAX
 } AdpccOPMode_t;
```

<!-- Source EN PDF p.357; unit 3972 -->

【Члены】

<!-- Source EN PDF p.357; unit 3973 -->

| Имя члена | Описание |
|---|---|
| ADPCC_OP_MODE_INVALID | Недействительный режим API. |
| ADPCC_OP_MODE_AUTO | Автоматический режим API. |
| ADPCC_OP_MODE_MANUAL | Ручной режим API. |
| ADPCC_OP_MODE_TOOL | Режим инструмента API. |
| ADPCC_OP_MODE_MAX |  |

<!-- Source EN PDF p.358; unit 3974 -->

9.16.3.3 Adpcc_basic_params_select_t

<!-- Source EN PDF p.358; unit 3975 -->

【Описание】Определяет свойства базовых параметров DPCC.

<!-- Source EN PDF p.358; unit 3976 -->

【Определение】

<!-- Source EN PDF p.358; unit 3977 -->

```text
 typedef struct Adpcc_basic_params_select_s
 {
     int           iso;
     unsigned char stage1_enable;
     unsigned char grayscale_mode;
     unsigned char enable;
     unsigned char sw_rk_out_sel;
     unsigned char sw_dpcc_output_sel;
     unsigned char stage1_rb_3x3;
     unsigned char stage1_g_3x3;
     unsigned char stage1_incl_rb_center;
     unsigned char stage1_incl_green_center;
     unsigned char stage1_use_fix_set;
     unsigned char stage1_use_set_3;
     unsigned char stage1_use_set_2;
     unsigned char stage1_use_set_1;
     unsigned char sw_rk_red_blue1_en;
     unsigned char rg_red_blue1_enable;
     unsigned char rnd_red_blue1_enable;
     unsigned char ro_red_blue1_enable;
     unsigned char lc_red_blue1_enable;
     unsigned char pg_red_blue1_enable;
     unsigned char sw_rk_green1_en;
     unsigned char rg_green1_enable;
     unsigned char rnd_green1_enable;
     unsigned char ro_green1_enable;
     unsigned char lc_green1_enable;
     unsigned char pg_green1_enable;
     unsigned char sw_rk_red_blue2_en;
     unsigned char rg_red_blue2_enable;
     unsigned char rnd_red_blue2_enable;
     unsigned char ro_red_blue2_enable;
     unsigned char lc_red_blue2_enable;
     unsigned char pg_red_blue2_enable;
     unsigned char sw_rk_green2_en;
     unsigned char rg_green2_enable;
     unsigned char rnd_green2_enable;
     unsigned char ro_green2_enable;
     unsigned char lc_green2_enable;
     unsigned char pg_green2_enable;
     unsigned char sw_rk_red_blue3_en;
     unsigned char rg_red_blue3_enable;
     unsigned char rnd_red_blue3_enable;
     unsigned char ro_red_blue3_enable;
     unsigned char lc_red_blue3_enable;
     unsigned char pg_red_blue3_enable;
     unsigned char sw_rk_green3_en;
     unsigned char rg_green3_enable;
     unsigned char rnd_green3_enable;
     unsigned char ro_green3_enable;
     unsigned char lc_green3_enable;
     unsigned char pg_green3_enable;
     unsigned char sw_mindis1_rb;
     unsigned char sw_mindis1_g;
     unsigned char line_thr_1_rb;
     unsigned char line_thr_1_g;
     unsigned char sw_dis_scale_min1;
     unsigned char sw_dis_scale_max1;
     unsigned char line_mad_fac_1_rb;
     unsigned char line_mad_fac_1_g;
     unsigned char pg_fac_1_rb;
     unsigned char pg_fac_1_g;
     unsigned char rnd_thr_1_rb;
     unsigned char rnd_thr_1_g;
     unsigned char rg_fac_1_rb;
     unsigned char rg_fac_1_g;
     unsigned char sw_mindis2_rb;
     unsigned char sw_mindis2_g;
     unsigned char line_thr_2_rb;
     unsigned char line_thr_2_g;
     unsigned char sw_dis_scale_min2;
     unsigned char sw_dis_scale_max2;
     unsigned char line_mad_fac_2_rb;
     unsigned char line_mad_fac_2_g;
     unsigned char pg_fac_2_rb;
     unsigned char pg_fac_2_g;
     unsigned char rnd_thr_2_rb;
     unsigned char rnd_thr_2_g;
     unsigned char rg_fac_2_rb;
     unsigned char rg_fac_2_g;
     unsigned char sw_mindis3_rb;
     unsigned char sw_mindis3_g;
     unsigned char line_thr_3_rb;
     unsigned char line_thr_3_g;
     unsigned char sw_dis_scale_min3;
     unsigned char sw_dis_scale_max3;
     unsigned char line_mad_fac_3_rb;
     unsigned char line_mad_fac_3_g;
     unsigned char pg_fac_3_rb;
     unsigned char pg_fac_3_g;
     unsigned char rnd_thr_3_rb;
     unsigned char rnd_thr_3_g;
     unsigned char rg_fac_3_rb;
     unsigned char rg_fac_3_g;
     unsigned char ro_lim_3_rb;
     unsigned char ro_lim_3_g;
     unsigned char ro_lim_2_rb;
     unsigned char ro_lim_2_g;
     unsigned char ro_lim_1_rb;
     unsigned char ro_lim_1_g;
     unsigned char rnd_offs_3_rb;
     unsigned char rnd_offs_3_g;
     unsigned char rnd_offs_2_rb;
     unsigned char rnd_offs_2_g;
     unsigned char rnd_offs_1_rb;
     unsigned char rnd_offs_1_g;
 } Adpcc_basic_params_select_t;
```

<!-- Source EN PDF p.360; unit 3978 -->

9.16.3.4 Adpcc_basic_params_t

<!-- Source EN PDF p.360; unit 3979 -->

【Описание】Определяет свойства базовых параметров DPCC.

<!-- Source EN PDF p.360; unit 3980 -->

【Определение】

<!-- Source EN PDF p.360; unit 3981 -->

```text
 typedef struct Adpcc_basic_params_s
 {
     Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
 } Adpcc_basic_params_t;
```

<!-- Source EN PDF p.360; unit 3982 -->

【Члены】

<!-- Source EN PDF p.360; unit 3983 -->

| Имя члена | Описание |
|---|---|
| arBasic | Базовые параметры DPCC. |

<!-- Source EN PDF p.360; unit 3984 -->

9.16.3.5 Adpcc_bpt_params_t

<!-- Source EN PDF p.360; unit 3985 -->

【Описание】Определяет свойства автоматической DPCC.

<!-- Source EN PDF p.360; unit 3986 -->

【Определение】

<!-- Source EN PDF p.360; unit 3987 -->

```text
 typedef struct Adpcc_bpt_params_s
 {
     unsigned char      bpt_rb_3x3;
     unsigned char      bpt_g_3x3;
     unsigned char      bpt_incl_rb_center;
     unsigned char      bpt_incl_green_center;
     unsigned char      bpt_use_fix_set;
     unsigned char      bpt_use_set_3;
     unsigned char      bpt_use_set_2;
     unsigned char      bpt_use_set_1;
     unsigned char      bpt_cor_en;
     unsigned char      bpt_det_en;
     unsigned short int bp_number;
     unsigned short int bp_table_addr;
     unsigned short int bpt_v_addr;
     unsigned short int bpt_h_addr;
     unsigned int       bp_cnt;
 } Adpcc_bpt_params_t;
```

<!-- Source EN PDF p.361; unit 3988 -->

9.16.3.6 dpcc_pdaf_point_t

<!-- Source EN PDF p.361; unit 3989 -->

【Описание】

<!-- Source EN PDF p.361; unit 3990 -->

【Определение】

<!-- Source EN PDF p.361; unit 3991 -->

```text
 typedef struct dpcc_pdaf_point_s
 {
     unsigned char y;
     unsigned char x;
 } dpcc_pdaf_point_t;
```

<!-- Source EN PDF p.361; unit 3992 -->

Модуль пока не реализован.

<!-- Source EN PDF p.361; unit 3993 -->

9.16.3.7 Adpcc_pdaf_params_t

<!-- Source EN PDF p.361; unit 3994 -->

【Описание】Определяет свойства PDAF автоматического режима.

<!-- Source EN PDF p.361; unit 3995 -->

【Определение】

<!-- Source EN PDF p.361; unit 3996 -->

```text
 typedef struct Adpcc_pdaf_params_s
 {
     unsigned char      sw_pdaf_en;
     unsigned char      pdaf_point_en[DPCC_PDAF_POINT_NUM];
     unsigned short int pdaf_offsety;
     unsigned short int pdaf_offsetx;
     unsigned char      pdaf_wrapy;
     unsigned char      pdaf_wrapx;
     unsigned short int pdaf_wrapy_num;
     unsigned short int pdaf_wrapx_num;
     dpcc_pdaf_point_t  point[DPCC_PDAF_POINT_NUM];
     unsigned char      pdaf_forward_med;
 } Adpcc_pdaf_params_t;
```

<!-- Source EN PDF p.361; unit 3997 -->

Модуль пока не реализован.

<!-- Source EN PDF p.361; unit 3998 -->

9.16.3.8 CalibDb_Dpcc_Fast_Mode_t

<!-- Source EN PDF p.361; unit 3999 -->

【Описание】Определяет свойства Fast в автоматическом режиме.

<!-- Source EN PDF p.361; unit 4000 -->

【Определение】

<!-- Source EN PDF p.362; unit 4001 -->

```text
 typedef struct CalibDb_Dpcc_Fast_Mode_s
 {
     int fast_mode_en;
     int ISO[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_single_en;
     int fast_mode_single_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_double_en;
     int fast_mode_double_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_triple_en;
     int fast_mode_triple_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Fast_Mode_t;
```

<!-- Source EN PDF p.362; unit 4002 -->

【Члены】

<!-- Source EN PDF p.362; unit 4003 -->

| Имя поля | Описание |
|---|---|
| Fast_mode_enable | Переключатель Fast_mode: 0 выключает, 1 включает. |
| ISO | ISO сцены. |
| fast_mode_single_en | Удаление одиночных дефектных пикселей: 0 выключено, 1 включено. |
| fast_mode_single_level | Интенсивность удаления одиночных дефектных пикселей, [0,10]. |
| fast_mode_double_en | Удаление пар дефектных пикселей: 0 выключено, 1 включено. |
| fast_mode_double_level | Интенсивность удаления пар дефектных пикселей, [0,10]. |
| fast_mode_triple_en | Удаление групп дефектных пикселей: 0 выключено, 1 включено. |
| fast_mode_triple_level | Интенсивность удаления групп дефектных пикселей, [0,10]. |

<!-- Source EN PDF p.362; unit 4004 -->

9.16.3.9 CalibDb_Dpcc_Sensor_t

<!-- Source EN PDF p.362; unit 4005 -->

【Описание】Определяет свойства Fast в автоматическом режиме.

<!-- Source EN PDF p.362; unit 4006 -->

【Определение】

<!-- Source EN PDF p.362; unit 4007 -->

```text
 typedef struct CalibDb_Dpcc_Sensor_s
 {
     float en;
     float max_level;
     float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_single[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_multiple[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Sensor_t;
```

<!-- Source EN PDF p.362; unit 4008 -->

【Члены】

<!-- Source EN PDF p.363; unit 4009 -->

| Имя поля | Описание |
|---|---|
| en | Переключатель DPCC датчика: 0 выключает, 1 включает. |
| max_level | Максимальная интенсивность удаления дефектных пикселей. |
| iso | ISO сцены. |
| level_single | Интенсивность удаления одиночных дефектных пикселей. |
| level_multiple | Интенсивность удаления групп дефектных пикселей. |

<!-- Source EN PDF p.363; unit 4010 -->

9.16.3.10 Adpcc_bpt_params_select_t

<!-- Source EN PDF p.363; unit 4011 -->

【Описание】Определяет свойства Fast, выбранные в автоматическом режиме.

<!-- Source EN PDF p.363; unit 4012 -->

【Определение】

<!-- Source EN PDF p.363; unit 4013 -->

```text
 typedef Adpcc_bpt_params_t Adpcc_bpt_params_select_t;
```

<!-- Source EN PDF p.363; unit 4014 -->

9.16.3.11 Adpcc_pdaf_params_select_t

<!-- Source EN PDF p.363; unit 4015 -->

【Описание】Определяет свойства PDAF, выбранные в автоматическом режиме.

<!-- Source EN PDF p.363; unit 4016 -->

【Определение】

<!-- Source EN PDF p.363; unit 4017 -->

```text
 typedef Adpcc_pdaf_params_t Adpcc_pdaf_params_select_t
```

<!-- Source EN PDF p.363; unit 4018 -->

9.16.3.12 Adpcc_Auto_Attr_t

<!-- Source EN PDF p.363; unit 4019 -->

【Описание】Определяет свойства автоматической DPCC.

<!-- Source EN PDF p.363; unit 4020 -->

【Определение】

<!-- Source EN PDF p.363; unit 4021 -->

```text
 typedef struct Adpcc_Auto_Attr_s
 {
     Adpcc_basic_params_t        stBasicParams;
     Adpcc_bpt_params_t          stBptParams;
     Adpcc_pdaf_params_t         stPdafParams;
     CalibDb_Dpcc_Fast_Mode_t    stFastMode;
     CalibDb_Dpcc_Sensor_t       stSensorDpcc;
     Adpcc_basic_params_select_t stBasicSelect;
     Adpcc_bpt_params_select_t   stBptSelect;
     Adpcc_pdaf_params_select_t  stPdafSelect;
 } Adpcc_Auto_Attr_t;
```

<!-- Source EN PDF p.363; unit 4022 -->

【Члены】

<!-- Source EN PDF p.364; unit 4023 -->

| Имя члена | Описание |
|---|---|
| stBasicParams | Базовые параметры автоматического режима. |
| stBptParams | Параметры дефектных пикселей автоматического режима. |
| stPdafParams | Параметры PDAF автоматического режима. |
| stFastMode | Параметры быстрого режима в автоматическом режиме. |
| stSensorDpcc | Параметры функции дефектных пикселей датчика в автоматическом режиме. |
| stBasicSelect | Базовые параметры, выбранные автоматически. |
| stBptSelect | Параметры дефектных пикселей, выбранные автоматически. |
| stPdafSelect | Параметры PDAF, выбранные автоматически. |

<!-- Source EN PDF p.364; unit 4024 -->

9.16.3.13 Adpcc_fast_mode_attr_t

<!-- Source EN PDF p.364; unit 4025 -->

【Описание】Определяет свойства быстрого режима при ручном управлении.

<!-- Source EN PDF p.364; unit 4026 -->

【Определение】

<!-- Source EN PDF p.364; unit 4027 -->

```text
 typedef struct Adpcc_fast_mode_attr_s
 {
     bool fast_mode_en;
     bool fast_mode_single_en;
     int  fast_mode_single_level;
     bool fast_mode_double_en;
     int  fast_mode_double_level;
     bool fast_mode_triple_en;
     int  fast_mode_triple_level;
 } Adpcc_fast_mode_attr_t;
```

<!-- Source EN PDF p.364; unit 4028 -->

【Члены】

<!-- Source EN PDF p.364; unit 4029 -->

| Имя поля | Описание |
|---|---|
| Fast_mode_en | Переключатель Fast_mode. |
| fast_mode_single_en | Переключатель удаления одиночных дефектных пикселей. |
| fast_mode_single_level | Интенсивность удаления одиночных дефектных пикселей, [0,10]. |
| fast_mode_double_en | Переключатель удаления пар дефектных пикселей. |
| fast_mode_double_level | Интенсивность удаления пар дефектных пикселей, [0,10]. |
| fast_mode_triple_en | Переключатель удаления групп дефектных пикселей. |
| fast_mode_triple_level | Интенсивность удаления групп дефектных пикселей, [0,10]. |

<!-- Source EN PDF p.365; unit 4030 -->

9.16.3.14 Adpcc_sensor_dpcc_attr_t

<!-- Source EN PDF p.365; unit 4031 -->

【Описание】Определяет свойства функции дефектных пикселей датчика при ручном управлении.

<!-- Source EN PDF p.365; unit 4032 -->

【Определение】

<!-- Source EN PDF p.365; unit 4033 -->

```text
 typedef struct Adpcc_sensor_dpcc_attr_s
 {
     bool en;
     int  max_level;
     int  single_level;
     int  double_level;
 } Adpcc_sensor_dpcc_attr_t;
```

<!-- Source EN PDF p.365; unit 4034 -->

【Члены】

<!-- Source EN PDF p.365; unit 4035 -->

| Имя поля | Описание |
|---|---|
| en | Переключатель DPCC датчика. |
| max_level | Максимальная интенсивность удаления дефектных пикселей. |
| single_level | Интенсивность удаления одиночных дефектных пикселей. |
| double_level | Интенсивность удаления групп дефектных пикселей. |

<!-- Source EN PDF p.365; unit 4036 -->

9.16.3.15 Adpcc_Manual_Attr_t

<!-- Source EN PDF p.365; unit 4037 -->

【Описание】Определяет свойства ручной DPCC.

<!-- Source EN PDF p.365; unit 4038 -->

【Определение】

<!-- Source EN PDF p.365; unit 4039 -->

```text
 typedef struct Adpcc_Manual_Attr_s
 {
     unsigned char enable;
     Adpcc_onfly_cfg_t stOnfly;
     Adpcc_bpt_params_select_t   stBpt;
     Adpcc_pdaf_params_select_t  stPdaf;
     Adpcc_sensor_dpcc_attr_t    stSensorDpcc;
 } Adpcc_Manual_Attr_t;
```

<!-- Source EN PDF p.365; unit 4040 -->

【Члены】

<!-- Source EN PDF p.366; unit 4041 -->

| Имя члена | Описание |
|---|---|
| enable | Переключатель DPCC ручного режима. |
| stOnfly | Параметры динамического обнаружения и исправления дефектных пикселей ISP DPCC в ручном режиме. |
| stBptParams | Параметры статической коррекции дефектных пикселей ISP DPCC в ручном режиме. |
| stPdafParams | Параметры функции PDAF SPC модуля ISP DPCC в ручном режиме. |
| stSensorDpcc | Параметры коррекции дефектных пикселей DPCC на стороне датчика в ручном режиме. |

<!-- Source EN PDF p.366; unit 4042 -->

9.16.3.16 Adpcc_onfly_cfg_t

<!-- Source EN PDF p.366; unit 4043 -->

【Описание】Определяет базовые параметры ручной DPCC.

<!-- Source EN PDF p.366; unit 4044 -->

【Определение】

<!-- Source EN PDF p.366; unit 4045 -->

```text
 typedef struct Adpcc_onfly_cfg_s {
    Adpcc_onfly_mode_t mode;
    Adpcc_fast_mode_attr_t fast_mode;
    Adpcc_basic_cfg_params_t expert_mode;
 } Adpcc_onfly_cfg_t;
```

<!-- Source EN PDF p.366; unit 4046 -->

【Члены】

<!-- Source EN PDF p.366; unit 4047 -->

| Имя члена | Описание |
|---|---|
| mode | Быстрый либо экспертный режим. |
| fastmode | Настройки быстрого режима при ручном управлении. |
| expert_mode | Настройки экспертного режима. |

<!-- Source EN PDF p.366; unit 4048 -->

9.16.3.17 Adpcc_onfly_mode_t

<!-- Source EN PDF p.366; unit 4049 -->

【Описание】Определяет базовые параметры ручной DPCC.

<!-- Source EN PDF p.366; unit 4050 -->

【Определение】

<!-- Source EN PDF p.366; unit 4051 -->

```text
 typedef enum Adpcc_onfly_mode_e {
     ADPCC_ONFLY_MODE_FAST        = 0,                   /**< dpcc manual fast
 mode */
     ADPCC_ONFLY_MODE_EXPERT      = 1,                   /**< dpcc manual expert
 mode */
     ADPCC_ONFLY_MODE_MAX                                /**< max */
 } Adpcc_onfly_mode_t;
```

<!-- Source EN PDF p.367; unit 4052 -->

【Члены】

<!-- Source EN PDF p.367; unit 4053 -->

| Имя члена | Описание |
|---|---|
| ADPCC_ONFLY_MODE_FAST | Быстрый режим. |
| ADPCC_ONFLY_MODE_EXPERT | Экспертный режим. |
| ADPCC_ONFLY_MODE_MAX | Недействительная настройка параметра. |

<!-- Source EN PDF p.367; unit 4054 -->

9.16.3.18 CalibDb_Dpcc_Pdaf_t

<!-- Source EN PDF p.367; unit 4055 -->

【Описание】Определяет параметры свойств PDAF SPC инструмента.

<!-- Source EN PDF p.367; unit 4056 -->

【Определение】

<!-- Source EN PDF p.367; unit 4057 -->

```text
 typedef struct CalibDb_Dpcc_Pdaf_s
 {
     unsigned char      en;
     unsigned char      point_en[16];
     unsigned short int offsetx;
     unsigned short int offsety;
     unsigned char      wrapx;
     unsigned char      wrapy;
     unsigned short int wrapx_num;
     unsigned short int wrapy_num;
     unsigned char      point_x[16];
     unsigned char      point_y[16];
     unsigned char      forward_med;
 } CalibDb_Dpcc_Pdaf_t;
```

<!-- Source EN PDF p.367; unit 4058 -->

9.16.3.19 CalibDb_Dpcc_set_RK_t

<!-- Source EN PDF p.367; unit 4059 -->

【Описание】Определяет свойства алгоритма RK.

<!-- Source EN PDF p.367; unit 4060 -->

【Определение】

<!-- Source EN PDF p.367; unit 4061 -->

```text
 typedef struct CalibDb_Dpcc_set_RK_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_min[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_max[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RK_t;
```

<!-- Source EN PDF p.367; unit 4062 -->

【Члены】

<!-- Source EN PDF p.368; unit 4063 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_sw_mindis | Порог 1 дефектных пикселей красного и синего каналов. |
| g_sw_mindis | Порог 1 дефектных пикселей зелёного канала. |
| sw_dis_scale_min | Порог 2 дефектных пикселей. |
| sw_dis_scale_max | Порог 3 дефектных пикселей. |

<!-- Source EN PDF p.368; unit 4064 -->

9.16.3.20 CalibDb_Dpcc_set_LC_t

<!-- Source EN PDF p.368; unit 4065 -->

【Описание】Определяет свойства алгоритма LC.

<!-- Source EN PDF p.368; unit 4066 -->

【Определение】

<!-- Source EN PDF p.368; unit 4067 -->

```text
 typedef struct CalibDb_Dpcc_set_LC_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_LC_t;
```

<!-- Source EN PDF p.368; unit 4068 -->

【Члены】

<!-- Source EN PDF p.368; unit 4069 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_line_thr | Порог 1 дефектных пикселей красного и синего каналов. |
| g_line_thr | Порог 1 дефектных пикселей зелёного канала. |
| rb_line_mad_fac | Порог 2 дефектных пикселей красного и синего каналов. |
| g_line_mad_fac | Порог 2 дефектных пикселей зелёного канала. |

<!-- Source EN PDF p.368; unit 4070 -->

9.16.3.21 CalibDb_Dpcc_set_PG_t

<!-- Source EN PDF p.368; unit 4071 -->

【Описание】Определяет свойства алгоритма PG.

<!-- Source EN PDF p.368; unit 4072 -->

【Определение】

<!-- Source EN PDF p.369; unit 4073 -->

```text
 typedef struct CalibDb_Dpcc_set_PG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_PG_t;
```

<!-- Source EN PDF p.369; unit 4074 -->

【Члены】

<!-- Source EN PDF p.369; unit 4075 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_pg_fac | Порог дефектных пикселей красного и синего каналов. |
| g_pg_fac | Порог дефектных пикселей зелёного канала. |

<!-- Source EN PDF p.369; unit 4076 -->

9.16.3.22 CalibDb_Dpcc_set_RND_t

<!-- Source EN PDF p.369; unit 4077 -->

【Описание】Определяет свойства алгоритма RND.

<!-- Source EN PDF p.369; unit 4078 -->

【Определение】

<!-- Source EN PDF p.369; unit 4079 -->

```text
 typedef struct CalibDb_Dpcc_set_RND_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RND_t;
```

<!-- Source EN PDF p.369; unit 4080 -->

【Члены】

<!-- Source EN PDF p.369; unit 4081 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_rnd_thr | Порог 1 дефектных пикселей красного и синего каналов. |
| g_rnd_thr | Порог 1 дефектных пикселей зелёного канала. |
| rb_rnd_offs | Порог 2 дефектных пикселей красного и синего каналов. |
| g_rnd_offs | Порог 2 дефектных пикселей зелёного канала. |

<!-- Source EN PDF p.370; unit 4082 -->

9.16.3.23 CalibDb_Dpcc_set_RG_t

<!-- Source EN PDF p.370; unit 4083 -->

【Описание】Определяет свойства алгоритма RK.

<!-- Source EN PDF p.370; unit 4084 -->

【Определение】

<!-- Source EN PDF p.370; unit 4085 -->

```text
 typedef struct CalibDb_Dpcc_set_RG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RG_t;
```

<!-- Source EN PDF p.370; unit 4086 -->

【Члены】

<!-- Source EN PDF p.370; unit 4087 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_rg_fac | Порог дефектных пикселей красного и синего каналов. |
| g_rg_fac | Порог дефектных пикселей зелёного канала. |

<!-- Source EN PDF p.370; unit 4088 -->

9.16.3.24 CalibDb_Dpcc_set_RO_t

<!-- Source EN PDF p.370; unit 4089 -->

【Описание】Определяет свойства алгоритма RO.

<!-- Source EN PDF p.370; unit 4090 -->

【Определение】

<!-- Source EN PDF p.370; unit 4091 -->

```text
 typedef struct CalibDb_Dpcc_set_RO_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RO_t;
```

<!-- Source EN PDF p.370; unit 4092 -->

【Поля】

<!-- Source EN PDF p.370; unit 4093 -->

| Имя члена | Описание |
|---|---|
| rb_enable | Переключатель обнаружения дефектных пикселей красного и синего каналов. |
| g_enable | Переключатель обнаружения дефектных пикселей зелёного канала. |
| rb_ro_lim | Порог дефектных пикселей красного и синего каналов. |
| g_ro_lim | Порог дефектных пикселей зелёного канала. |

<!-- Source EN PDF p.371; unit 4094 -->

9.16.3.25 CalibDb_Dpcc_set_t

<!-- Source EN PDF p.371; unit 4095 -->

【Описание】Определяет свойства условий дефектных пикселей.

<!-- Source EN PDF p.371; unit 4096 -->

【Определение】

<!-- Source EN PDF p.371; unit 4097 -->

```text
 typedef struct CalibDb_Dpcc_set_s
 {
     CalibDb_Dpcc_set_RK_t  rk;
     CalibDb_Dpcc_set_LC_t  lc;
     CalibDb_Dpcc_set_PG_t  pg;
     CalibDb_Dpcc_set_RND_t rnd;
     CalibDb_Dpcc_set_RG_t  rg;
     CalibDb_Dpcc_set_RO_t  ro;
 } CalibDb_Dpcc_set_t;
```

<!-- Source EN PDF p.371; unit 4098 -->

【Члены】

<!-- Source EN PDF p.371; unit 4099 -->

| Имя члена | Описание |
|---|---|
| rk | Алгоритм RK. |
| lc | Алгоритм LC. |
| pg | Алгоритм PG. |
| rnd | Алгоритм RND. |
| rg | Алгоритм RG. |
| ro | Алгоритм RO. |

<!-- Source EN PDF p.371; unit 4100 -->

9.16.3.26 CalibDb_Dpcc_Expert_Mode_t

<!-- Source EN PDF p.371; unit 4101 -->

【Описание】Определяет свойства экспертного режима инструмента.

<!-- Source EN PDF p.371; unit 4102 -->

【Определение】

<!-- Source EN PDF p.371; unit 4103 -->

```text
 typedef struct CalibDb_Dpcc_Expert_Mode_s
 {
     float              iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      grayscale_mode;
     unsigned char      rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      dpcc_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_rb_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_g_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_rb_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_g_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_fix_set[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set2[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set1[CALIBDB_DPCC_MAX_ISO_LEVEL];
     CalibDb_Dpcc_set_t set[3];
 } CalibDb_Dpcc_Expert_Mode_t;
```

<!-- Source EN PDF p.372; unit 4104 -->

【Поля】

<!-- Source EN PDF p.372; unit 4105 -->

| Имя поля | Описание |
|---|---|
| iso | ISO сцены. |
| stage1_Enable | По умолчанию 1. |
| grayscale_mode | Монохромный режим: 0 выключает, 1 включает. |
| rk_out_sel | Режим определения дефектных пикселей RK: 0 — режим 1, 1 — режим 2, 2 — режим 3. |
| dpcc_out_sel | Режим коррекции дефектных пикселей: 0 — медианный, 1 — RK. |
| stage1_rb_3x3 | По умолчанию 0. |
| stage1_g_3x3 | По умолчанию 0. |
| stage1_inc_rb_center | По умолчанию 1. |
| stage1_inc_g_center | По умолчанию 1. |
| stage1_use_fix_set | Встроенное условие дефектных пикселей: 0 выключено, 1 включено. |
| stage1_use_set3 | Третье условие определения дефектных пикселей в set_cell: 0 выключено, 1 включено. |
| stage1_use_set2 | Второе условие определения дефектных пикселей в set_cell: 0 выключено, 1 включено. |
| stage1_use_set1 | Первое условие определения дефектных пикселей в set_cell: 0 выключено, 1 включено. |

<!-- Source EN PDF p.372; unit 4106 -->

9.16.3.27 CalibDb_Dpcc_t

<!-- Source EN PDF p.372; unit 4107 -->

【Описание】Определяет свойства DPCC инструмента.

<!-- Source EN PDF p.372; unit 4108 -->

【Определение】

<!-- Source EN PDF p.372; unit 4109 -->

```text
 typedef struct CalibDb_Dpcc_s
 {
     int                        enable;
     char                       version[64];
     CalibDb_Dpcc_Fast_Mode_t   fast;
     CalibDb_Dpcc_Expert_Mode_t expert;
     CalibDb_Dpcc_Pdaf_t        pdaf;
     CalibDb_Dpcc_Sensor_t      sensor_dpcc;
 } CalibDb_Dpcc_t;
```

<!-- Source EN PDF p.372; unit 4110 -->

【Члены】

<!-- Source EN PDF p.373; unit 4111 -->

| Имя члена | Описание |
|---|---|
| enable | Включение функции |
| Версия | Версия |
| fast | Быстрый режим. |
| expert | Экспертный режим. |
| pdaf | Условие дефектных пикселей режима PADF SPC (написание PADF сохранено). |
| sensor_dpcc | Параметры коррекции дефектных пикселей DPCC на стороне датчика. |

<!-- Source EN PDF p.373; unit 4112 -->

9.16.3.28 rk_aiq_dpcc_attrib_t

<!-- Source EN PDF p.373; unit 4113 -->

【Описание】Определяет свойства DPCC.

<!-- Source EN PDF p.373; unit 4114 -->

【Определение】

<!-- Source EN PDF p.373; unit 4115 -->

```text
 typedef struct rk_aiq_dpcc_attrib_s
 {
     AdpccOPMode_t       eMode;
     Adpcc_Auto_Attr_t   stAuto;
     Adpcc_Manual_Attr_t stManual;
     CalibDb_Dpcc_t      stTool;
 } rk_aiq_dpcc_attrib_t;
```

<!-- Source EN PDF p.373; unit 4116 -->

【Члены】

<!-- Source EN PDF p.373; unit 4117 -->

| Имя члена | Описание |
|---|---|
| eMode | Режим API |
| stAuto | Автоматический режим DPCC. |
| stManual | Ручной режим DPCC. |
| stTool | Режим инструмента DPCC. |

<!-- Source EN PDF p.373; unit 4118 -->

### 9.17 LSC

<!-- Source EN PDF p.373; unit 4119 -->

#### 9.17.1 Описание функции

<!-- Source EN PDF p.373; unit 4120 -->

Коррекция затенения объектива устраняет потемнение по краям, вызванное оптическими свойствами и неравномерным преломлением объектива.

<!-- Source EN PDF p.374; unit 4121 -->

#### 9.17.2 API уровня модуля

<!-- Source EN PDF p.374; unit 4122 -->

9.17.2.1 rk_aiq_user_api2_alsc_SetAttrib

<!-- Source EN PDF p.374; unit 4123 -->

【Описание】Задаёт свойства коррекции затенения объектива.

<!-- Source EN PDF p.374; unit 4124 -->

【Синтаксис】

<!-- Source EN PDF p.374; unit 4125 -->

```text
 XCamReturn
 rk_aiq_user_api2_alsc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t attr);
```

<!-- Source EN PDF p.374; unit 4126 -->

【Параметры】

<!-- Source EN PDF p.374; unit 4127 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства коррекции затенения объектива. | Вход |

<!-- Source EN PDF p.374; unit 4128 -->

【Возвращаемое значение】

<!-- Source EN PDF p.374; unit 4129 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.374; unit 4130 -->

【Зависимости】

<!-- Source EN PDF p.374; unit 4131 -->

Заголовочный файл: rk_aiq_user_api2_alsc.h.

<!-- Source EN PDF p.374; unit 4132 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.374; unit 4133 -->

9.17.2.2 rk_aiq_user_api2_alsc_GetAttrib

<!-- Source EN PDF p.374; unit 4134 -->

【Описание】Получает свойства коррекции затенения объектива.

<!-- Source EN PDF p.374; unit 4135 -->

【Синтаксис】

<!-- Source EN PDF p.374; unit 4136 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t *attr);
```

<!-- Source EN PDF p.374; unit 4137 -->

【Параметры】

<!-- Source EN PDF p.375; unit 4138 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства коррекции затенения объектива. | Выход |

<!-- Source EN PDF p.375; unit 4139 -->

【Возвращаемое значение】

<!-- Source EN PDF p.375; unit 4140 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.375; unit 4141 -->

【Зависимости】

<!-- Source EN PDF p.375; unit 4142 -->

Заголовочный файл: rk_aiq_user_api2_alsc.h.

<!-- Source EN PDF p.375; unit 4143 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.375; unit 4144 -->

#### 9.17.3 Типы данных

<!-- Source EN PDF p.375; unit 4145 -->

9.17.3.1 rk_aiq_lsc_attrib_t

<!-- Source EN PDF p.375; unit 4146 -->

【Описание】Определяет свойства коррекции затенения объектива ISP.

<!-- Source EN PDF p.375; unit 4147 -->

【Определение】

<!-- Source EN PDF p.375; unit 4148 -->

```text
 typedef struct rk_aiq_lsc_attrib_s {
     bool byPass;
     rk_aiq_lsc_op_mode_t mode;
     rk_aiq_lsc_mlsc_attrib_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_lsc_attrib_t;
```

<!-- Source EN PDF p.375; unit 4149 -->

【Члены】

<!-- Source EN PDF p.375; unit 4150 -->

| Имя члена | Описание |
|---|---|
| sync | Синхронное/асинхронное выполнение интерфейса; см. rk_aiq_uapi_sync_t и раздел «Обзор/Описание API». |
| byPass | Управление LSC: 1 отключает, 0 включает. |
| mode | Настройка режима. |
| stManual | Настройки ручного режима. |

<!-- Source EN PDF p.376; unit 4151 -->

9.17.3.2 rk_aiq_lsc_op_mode_t

<!-- Source EN PDF p.376; unit 4152 -->

【Описание】Определяет режим коррекции затенения объектива ISP.

<!-- Source EN PDF p.376; unit 4153 -->

【Определение】

<!-- Source EN PDF p.376; unit 4154 -->

```text
 typedef enum rk_aiq_lsc_op_mode_s {
     RK_AIQ_LSC_MODE_INVALID                     = 0,        /**< initialization
 value */
     RK_AIQ_LSC_MODE_MANUAL                      = 1,        /**< run manual lens
 shading correction */
     RK_AIQ_LSC_MODE_AUTO                        = 2,        /**< run auto lens
 shading correction */
     RK_AIQ_LSC_MODE_MAX
 } rk_aiq_lsc_op_mode_t;
```

<!-- Source EN PDF p.376; unit 4155 -->

【Члены】

<!-- Source EN PDF p.376; unit 4156 -->

| Имя члена | Описание |
|---|---|
| RK_AIQ_LSC_MODE_INVALID | Недействительный режим. |
| RK_AIQ_LSC_MODE_MANUAL | Ручной режим |
| RK_AIQ_LSC_MODE_AUTO | Автоматический режим |

<!-- Source EN PDF p.376; unit 4157 -->

9.17.3.3 rk_aiq_lsc_table_t

<!-- Source EN PDF p.376; unit 4158 -->

【Описание】Определяет таблицу коррекции затенения объектива ISP.

<!-- Source EN PDF p.376; unit 4159 -->

【Определение】

<!-- Source EN PDF p.376; unit 4160 -->

```text
 typedef struct rk_aiq_lsc_table_s {
     unsigned short r_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gr_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gb_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short b_data_tbl[LSC_DATA_TBL_SIZE];
 } rk_aiq_lsc_table_t;
```

<!-- Source EN PDF p.376; unit 4161 -->

【Члены】

<!-- Source EN PDF p.377; unit 4162 -->

| Имя члена | Описание |
|---|---|
| r_data_tbl | Таблица коррекции R, [17×17] элементов, диапазон [1~7.99]; старшие 3 бита — целая часть, младшие 8 — дробная. |
| gr_data_tbl | Таблица коррекции GR, [17×17] элементов, диапазон [1~7.99]; старшие 3 бита — целая часть, младшие 8 — дробная. |
| gb_data_tbl | Таблица коррекции GB, [17×17] элементов, диапазон [1~7.99]; старшие 3 бита — целая часть, младшие 8 — дробная. |
| b_data_tbl | Таблица коррекции B, [17×17] элементов, диапазон [1~7.99]; старшие 3 бита — целая часть, младшие 8 — дробная. |

<!-- Source EN PDF p.379; unit 4163 -->

### 9.18 GIC

<!-- Source EN PDF p.379; unit 4164 -->

#### 9.18.1 Описание функции

<!-- Source EN PDF p.379; unit 4165 -->

GIC исправляет дисбаланс каналов Gr и Gb, улучшая изображение в некоторых сценах.

<!-- Source EN PDF p.379; unit 4166 -->

#### 9.18.2 API уровня модуля

<!-- Source EN PDF p.379; unit 4167 -->

9.18.2.1 rk_aiq_user_api2_agic_v2_SetAttrib

<!-- Source EN PDF p.379; unit 4168 -->

【Описание】Задаёт программные свойства GIC.

<!-- Source EN PDF p.379; unit 4169 -->

【Синтаксис】

<!-- Source EN PDF p.379; unit 4170 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.379; unit 4171 -->

【Параметры】

<!-- Source EN PDF p.379; unit 4172 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств GIC. | Вход |

<!-- Source EN PDF p.379; unit 4173 -->

【Возвращаемое значение】

<!-- Source EN PDF p.379; unit 4174 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.379; unit 4175 -->

【Зависимости】

<!-- Source EN PDF p.379; unit 4176 -->

Заголовочный файл: rk_aiq_user_api2_agic.h.

<!-- Source EN PDF p.379; unit 4177 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.379; unit 4178 -->

【Описание】

<!-- Source EN PDF p.379; unit 4179 -->

Not.

<!-- Source EN PDF p.380; unit 4180 -->

9.18.2.2 rk_aiq_user_api2_agic_v2_GetAttrib

<!-- Source EN PDF p.380; unit 4181 -->

【Описание】Получает программные свойства gamma.

<!-- Source EN PDF p.380; unit 4182 -->

【Синтаксис】

<!-- Source EN PDF p.380; unit 4183 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.380; unit 4184 -->

【Параметры】

<!-- Source EN PDF p.380; unit 4185 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Структура программных свойств GIC. | Выход |

<!-- Source EN PDF p.380; unit 4186 -->

【Возвращаемое значение】

<!-- Source EN PDF p.380; unit 4187 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.380; unit 4188 -->

【Зависимости】

<!-- Source EN PDF p.380; unit 4189 -->

Заголовочный файл: rk_aiq_user_api2_agic.h.

<!-- Source EN PDF p.380; unit 4190 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.380; unit 4191 -->

【Описание】

<!-- Source EN PDF p.380; unit 4192 -->

#### 9.18.3 Типы данных API уровня модуля

<!-- Source EN PDF p.380; unit 4193 -->

9.18.3.1 rkaiq_gic_api_op_mode_t

<!-- Source EN PDF p.380; unit 4194 -->

【Описание】Определяет режим GIC.

<!-- Source EN PDF p.380; unit 4195 -->

【Определение】

<!-- Source EN PDF p.380; unit 4196 -->

```text
   typedef enum rkaiq_gic_api_op_mode_e {
       RKAIQ_GIC_API_OPMODE_OFF    = 0,
       RKAIQ_GIC_API_OPMODE_AUTO   = 1,
       RKAIQ_GIC_API_OPMODE_MANUAL = 2,
   } rkaiq_gic_api_op_mode_t;
```

<!-- Source EN PDF p.380; unit 4197 -->

【Члены】

<!-- Source EN PDF p.381; unit 4198 -->

| Имя члена | Описание |
|---|---|
| RKAIQ_GIC_API_OPMODE_OFF | Режим отключения GIC |
| RKAIQ_GIC_API_OPMODE_AUTO | Ручной режим API. |
| RKAIQ_GIC_API_OPMODE_MANUAL | Ручной режим |

<!-- Source EN PDF p.381; unit 4199 -->

9.18.3.2  rkaiq_gic_v2_param_selected_t

<!-- Source EN PDF p.381; unit 4200 -->

【Описание】Автоматические/ручные свойства для RK3588

<!-- Source EN PDF p.381; unit 4201 -->

【Определение】

<!-- Source EN PDF p.381; unit 4202 -->

```text
   typedef struct rkaiq_gic_v2_param_selected_s {
       uint32_t iso;
       uint8_t bypass;
       uint8_t gr_ratio;
       uint16_t min_busy_thre;
       uint16_t min_grad_thr1;
       uint16_t min_grad_thr2;
       uint16_t k_grad1;
       uint16_t k_grad2;
       uint16_t gb_thre;
       uint16_t maxCorV;
       uint16_t maxCorVboth;
       uint16_t dark_thre;
       uint16_t dark_threHi;
       uint16_t k_grad1_dark;
       uint16_t k_grad2_dark;
       uint16_t min_grad_thr_dark1;
       uint16_t min_grad_thr_dark2;
       float NoiseScale;
       float NoiseBase;
       float noiseCurve_0;
       float noiseCurve_1;
       float globalStrength;
       uint16_t diff_clip;
   } rkaiq_gic_v2_param_selected_t;
```

<!-- Source EN PDF p.381; unit 4203 -->

【Члены】

<!-- Source EN PDF p.382; unit 4204 -->

| Имя члена | Описание |
|---|---|
| iso | ISO условий съёмки |
| byPass | Зарезервировано, не используется |
| gr_ratio | Зарезервировано, не используется |
| min_busy_thre | Способность обнаружения сложных участков; диапазон [0, 1023], по умолчанию 160 |
| min_grad_thr1 | Порог 1 количества некраевых участков, управляющий интенсивностью GIC; диапазон [0, 1023], по умолчанию 32 |
| min_grad_thr2 | Порог 2 количества некраевых участков, управляющий интенсивностью GIC; диапазон [0, 1023], по умолчанию 32 |
| k_grad1 | Порог 1 отклика края (горизонтального и вертикального градиентов); диапазон [0, 15], по умолчанию 5 |
| k_grad2 | Порог 2 отклика края (горизонтального и вертикального градиентов); диапазон [0, 15], по умолчанию 1 |
| gb_thre | Коэффициент масштабирования; диапазон [0, 15], по умолчанию 7 |
| maxCorV | Ограничение максимальной компенсации GB на краях; диапазон [0, 1023], по умолчанию 40 |
| maxCorVboth | Ограничение максимальной компенсации GB на плоских (некраевых) участках; диапазон [0, 1023], по умолчанию 8 |
| dark_thre | Порог 1 тёмной области; диапазон [0, 2047], по умолчанию 120 |
| dark_threHi | Порог 2 тёмной области; диапазон [0, 2047], по умолчанию 240 |
| k_grad1_dark | Порог 1 отклика края (горизонтального и вертикального градиентов) в тёмной части; диапазон [0, 15], по умолчанию 6 |
| k_grad2_dark | Порог 2 степени отклика края (горизонтального и вертикального градиентов) в тёмной части; диапазон [0, 15], по умолчанию 1 |
| min_grad_thr_dark1 | Порог 1 количества некраевых участков в тёмной части; диапазон [0, 1023], по умолчанию 64 |
| min_grad_thr_dark2 | Порог 2 количества некраевых участков в тёмной части; диапазон [0, 1023], по умолчанию 32 |
| noiseCurve_0 | Параметр 1 кривой шума |
| noiseCurve_1 | Параметр 2 кривой шума |
| globalStrength | Глобальная регулировка интенсивности компенсации GB; диапазон [0, 2], по умолчанию 1 |

<!-- Source EN PDF p.383; unit 4205 -->

| Имя члена | Описание |
|---|---|
| NoiseScale | По кривой шума получают стандартное отклонение шума текущей точки; noise_std *noise_scale определяет максимальную компенсацию GB |
| NoiseBase | Порог регулировки с подавлением коррекции на краях: к результатам первого и второго градиентов добавляют noise_offset, затем сравнивают. Если хотя бы в одном направлении gradx&gt;2*grady, точка считается краевой и не корректируется |
| diff_clip | Ограничивает максимальную компенсацию GB |

<!-- Source EN PDF p.383; unit 4206 -->

9.18.3.3  rkaiq_gic_v2_api_attr_t

<!-- Source EN PDF p.383; unit 4207 -->

【Описание】Свойства GIC

<!-- Source EN PDF p.383; unit 4208 -->

【Определение】

<!-- Source EN PDF p.383; unit 4209 -->

```text
   typedef struct rkaiq_gic_v2_api_attr_s {
       rk_aiq_uapi_sync_t sync;
       uint8_t gic_en;
       rkaiq_gic_api_op_mode_t op_mode;
       uint32_t iso_cnt;
       rkaiq_gic_v2_param_selected_t auto_params[RKAIQ_GIC_MAX_ISO_CNT];
       rkaiq_gic_v2_param_selected_t manual_param;
   } rkaiq_gic_v2_api_attr_t;
```

<!-- Source EN PDF p.383; unit 4210 -->

【Члены】

<!-- Source EN PDF p.383; unit 4211 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| gic_en | Переключатель |
| op_mode | Режим работы |
| iso_cnt | Количество ISO в автоматических параметрах |
| auto_params | Автоматические параметры: один набор на ISO; ПО автоматически вычисляет значения интерполяцией по ISO |
| manual_param | Ручные параметры: постоянно используется этот набор |

<!-- Source EN PDF p.384; unit 4212 -->

### 9.19   CGC

<!-- Source EN PDF p.384; unit 4213 -->

#### 9.19.1 Описание функций

<!-- Source EN PDF p.384; unit 4214 -->

CGC (Color Gamut Compression, сжатие цветового охвата) позволяет задавать параметры сжатия цветового охвата.

<!-- Source EN PDF p.384; unit 4215 -->

#### 9.19.2 Справочник функционального API

<!-- Source EN PDF p.384; unit 4216 -->

#### 9.19.3 Справочник модульного API

<!-- Source EN PDF p.384; unit 4217 -->

9.19.3.1  rk_aiq_user_api2_acgc_SetAttrib

<!-- Source EN PDF p.384; unit 4218 -->

【Описание】

<!-- Source EN PDF p.384; unit 4219 -->

Задаёт свойства модуля CGC

<!-- Source EN PDF p.384; unit 4220 -->

【Синтаксис】

<!-- Source EN PDF p.384; unit 4221 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t attr);
```

<!-- Source EN PDF p.384; unit 4222 -->

【Параметры】

<!-- Source EN PDF p.384; unit 4223 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойства модуля CGC | Вход |

<!-- Source EN PDF p.384; unit 4224 -->

【Возвращаемое значение】

<!-- Source EN PDF p.384; unit 4225 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.384; unit 4226 -->

【Зависимости】

<!-- Source EN PDF p.384; unit 4227 -->

Заголовочный файл: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.384; unit 4228 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.384; unit 4229 -->

【Меры предосторожности】

<!-- Source EN PDF p.384; unit 4230 -->

При attr.param.op_mode = RK_AIQ_OP_MODE_AUTO используются встроенные параметры CGC по умолчанию из AIQ; при attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL параметры CGC можно настраивать.

<!-- Source EN PDF p.385; unit 4231 -->

9.19.3.2  rk_aiq_user_api2_acgc_GetAttrib

<!-- Source EN PDF p.385; unit 4232 -->

【Описание】

<!-- Source EN PDF p.385; unit 4233 -->

Получает текущие свойства модуля CGC

<!-- Source EN PDF p.385; unit 4234 -->

【Синтаксис】

<!-- Source EN PDF p.385; unit 4235 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t* attr);
```

<!-- Source EN PDF p.385; unit 4236 -->

【Параметры】

<!-- Source EN PDF p.385; unit 4237 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Свойство модуля CGC | Выход |

<!-- Source EN PDF p.385; unit 4238 -->

【Возвращаемое значение】

<!-- Source EN PDF p.385; unit 4239 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.385; unit 4240 -->

【Зависимости】

<!-- Source EN PDF p.385; unit 4241 -->

Заголовочный файл: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.385; unit 4242 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.385; unit 4243 -->

#### 9.19.4 Типы данных модульного API

<!-- Source EN PDF p.385; unit 4244 -->

9.19.4.1  rk_aiq_uapi_acgc_attrib_t

<!-- Source EN PDF p.385; unit 4245 -->

【Описание】Параметры API модуля CGC

<!-- Source EN PDF p.385; unit 4246 -->

【Определение】

<!-- Source EN PDF p.385; unit 4247 -->

```text
 typedef struct rk_aiq_uapi_acgc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     rk_aiq_acgc_params_t param;
 } rk_aiq_uapi_acgc_attrib_t;
```

<!-- Source EN PDF p.385; unit 4248 -->

【Члены】

<!-- Source EN PDF p.386; unit 4249 -->

| Имя члена | Описание |
|---|---|
| sync | Определение rk_aiq_uapi_sync_t см. в разделе «Обзор/Описание API». |
| rk_aiq_acgc_params_t | Параметр cgc |

<!-- Source EN PDF p.386; unit 4250 -->

9.19.4.2  rk_aiq_acgc_params_t

<!-- Source EN PDF p.386; unit 4251 -->

【Описание】Параметры модуля CGC

<!-- Source EN PDF p.386; unit 4252 -->

【Определение】

<!-- Source EN PDF p.386; unit 4253 -->

```text
 typedef struct __cgc_param {
     RKAiqOPMode_t op_mode;
     bool cgc_ratio_en;
     bool cgc_yuv_limit;
 } Cgc_Param_t;
 typedef Cgc_Param_t rk_aiq_acgc_params_t;
```

<!-- Source EN PDF p.386; unit 4254 -->

【Члены】

<!-- Source EN PDF p.386; unit 4255 -->

| Имя члена | Описание |
|---|---|
| op_mode | Режим: RK_AIQ_OP_MODE_AUTO (встроенные параметры AIQ) либо RK_AIQ_OP_MODE_MANUAL (параметры, настраиваемые пользователем) |
| cgc_ratio_en | Включать ли режим сжатия цветового охвата; по умолчанию FALSE |
| cgc_yuv_limit | Выводить ли ограниченный диапазон; при cgc_yuv_limit = FALSE CGC обходится. По умолчанию FALSE |

<!-- Source EN PDF p.386; unit 4256 -->

## 10.   Statistics

<!-- Source EN PDF p.386; unit 4257 -->

### 10.1 Обзор

<!-- Source EN PDF p.386; unit 4258 -->

ISP30 обрабатывает данные изображения, получая статистику для алгоритмов управления 3A (AWB/AE/AF), в общих чертах следующую:

<!-- Source EN PDF p.387; unit 4259 -->

![Технический рисунок английского оригинала — PDF p.387](/docs/rockchip-isp30-development/assets/en-p387-X2034.jpg)

<!-- Source EN PDF p.387; unit 4260 -->

### 10.2 Описание функций

<!-- Source EN PDF p.387; unit 4261 -->

#### 10.2.1 Статистика AE

<!-- Source EN PDF p.387; unit 4262 -->

Аппаратная статистика AE в основном включает:

<!-- Source EN PDF p.387; unit 4263 -->

Взвешенную гистограмму из 256 интервалов в домене RAW и поблочную статистику средних R/G/B/Y;

<!-- Source EN PDF p.387; unit 4264 -->

10.2.1.1 Статистика AE по RAW-изображению

<!-- Source EN PDF p.387; unit 4265 -->

Статистика модуля делится на поблочную статистику яркости и гистограммы. По поддерживаемому размеру блоков и наличию независимых подокон выделяют режимы big и lite.

<!-- Source EN PDF p.387; unit 4266 -->

Режим big: разбиение на неотдельные подокна от 1X1 до 15X15, по умолчанию 15X15. Каждый блок выдаёт 10bit среднюю яркость R/B и 12bit среднее G. Дополнительно задаются 4 независимых подокна; каждое выдаёт 29-bit сумму яркости R/B и 32-bit сумму G. Для среднего ПО делит сумму на число пикселей соответствующего подокна. Взвешенная гистограмма учитывает число блоков и назначенные веса; счётчик эффективных пикселей каждого интервала яркости имеет 28bit.

<!-- Source EN PDF p.387; unit 4267 -->

Режим lite: разбиение на неотдельные подокна от 1X1 до 5X5, по умолчанию 5X5. Каждый блок выдаёт 10bit среднюю яркость R/B и 12bit среднее G. Независимые подокна не поддерживаются. Взвешенная гистограмма учитывает число блоков и назначенные веса; счётчик эффективных пикселей каждого интервала яркости имеет 28bit.

<!-- Source EN PDF p.388; unit 4268 -->

На платформе 3588 по умолчанию: без HDR — BIG (15X15 неотдельных подокон); HDR из 2 кадров — BIG (15X15); HDR из 3 кадров — BIG для короткого и длинного кадров (15X15), LITE для среднего (5X5).

<!-- Source EN PDF p.388; unit 4269 -->

#### 10.2.2 Статистика AWB

<!-- Source EN PDF p.388; unit 4270 -->

Источник данных аппаратной статистики AWB:

<!-- Source EN PDF p.388; unit 4271 -->

В многокадровом HDR выбирается один из трёх каналов L/M/S.

<!-- Source EN PDF p.388; unit 4272 -->

В линейном режиме имеется только один канал данных.

<!-- Source EN PDF p.388; unit 4273 -->

Статистика собирается по данным после Raw-BLC-LSC.

<!-- Source EN PDF p.388; unit 4274 -->

Аппаратная статистика AWB включает статистику белых точек и блоков.

<!-- Source EN PDF p.388; unit 4275 -->

Статистика белых точек

<!-- Source EN PDF p.388; unit 4276 -->

Записывает суммы RGins и BGains и количество точек белых областей двух размеров для 7 источников света в основном окне.

<!-- Source EN PDF p.388; unit 4277 -->

Записывает суммы RGins и BGains и количество точек белых областей двух размеров для 4 источников света в подокне.

<!-- Source EN PDF p.388; unit 4278 -->

Суммирует RGin и BGain в 4 дополнительных рамках домена UV или XY, а также количество RGins (формулировка количества сохранена из оригинала).

<!-- Source EN PDF p.388; unit 4279 -->

Поблочная статистика: изображение разбивается на 15x15 блоков; для каждого вычисляются средние R, G, B всех точек либо белых точек.

<!-- Source EN PDF p.388; unit 4280 -->

#### 10.2.3 Статистика AF

<!-- Source EN PDF p.388; unit 4281 -->

Аппаратная статистика AFHW Stats:

<!-- Source EN PDF p.388; unit 4282 -->

В многокадровом HDR можно выбрать один из трёх каналов L/M/S либо использовать входные данные после объединения трёх каналов.

<!-- Source EN PDF p.388; unit 4283 -->

В линейном режиме имеется только один канал данных.

<!-- Source EN PDF p.388; unit 4284 -->

Поддерживается вывод FV для 2 настраиваемых частотных полос по горизонтали и 2 по вертикали.

<!-- Source EN PDF p.388; unit 4285 -->

Блок-схема модуля аппаратной статистики AF ISP30

<!-- Source EN PDF p.388; unit 4286 -->

![Технический рисунок английского оригинала — PDF p.388](/docs/rockchip-isp30-development/assets/en-p388-X2040.jpg)

<!-- Source EN PDF p.389; unit 4287 -->

### 10.3 Справочник API

<!-- Source EN PDF p.389; unit 4288 -->

#### 10.3.1  rk_aiq_uapi_sysctl_get3AStatsBlk

<!-- Source EN PDF p.389; unit 4289 -->

【Описание】

<!-- Source EN PDF p.389; unit 4290 -->

Синхронно получает статистику 3A.

<!-- Source EN PDF p.389; unit 4291 -->

【Синтаксис】

<!-- Source EN PDF p.389; unit 4292 -->

```text
 XCamReturn
 rk_aiq_uapi_sysctl_get3AStatsBlk(const rk_aiq_sys_ctx_t* ctx, rk_aiq_isp_stats_t
 **stats, int timeout_ms);
```

<!-- Source EN PDF p.389; unit 4293 -->

【Параметры】

<!-- Source EN PDF p.389; unit 4294 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| stats | Указатель на структуру статистики | Выход |
| timeout_ms | Тайм-аут; -1 означает ожидание без ограничения до появления статистики | Вход |

<!-- Source EN PDF p.389; unit 4295 -->

【Возвращаемое значение】

<!-- Source EN PDF p.389; unit 4296 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.389; unit 4297 -->

【Зависимости】

<!-- Source EN PDF p.389; unit 4298 -->

Заголовочный файл: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.389; unit 4299 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.389; unit 4300 -->

#### 10.3.2  rk_aiq_uapi_sysctl_release3AStatsRef

<!-- Source EN PDF p.389; unit 4301 -->

【Описание】

<!-- Source EN PDF p.389; unit 4302 -->

Освобождает полученную статистику 3A; применяется совместно с rk_aiq_uapi_sysctl_get3AStatsBlk.

<!-- Source EN PDF p.389; unit 4303 -->

【Синтаксис】

<!-- Source EN PDF p.389; unit 4304 -->

```text
 void
 rk_aiq_uapi_sysctl_release3AStatsRef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_isp_stats_t *stats);
```

<!-- Source EN PDF p.390; unit 4305 -->

【Параметры】

<!-- Source EN PDF p.390; unit 4306 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| stats | Указатель на структуру статистики | Вход |

<!-- Source EN PDF p.390; unit 4307 -->

【Возвращаемое значение】

<!-- Source EN PDF p.390; unit 4308 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успешно |
| Не 0 | Ошибка; см. таблицу кодов ошибок |

<!-- Source EN PDF p.390; unit 4309 -->

【Зависимости】

<!-- Source EN PDF p.390; unit 4310 -->

Заголовочный файл: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.390; unit 4311 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.390; unit 4312 -->

Пример кода

<!-- Source EN PDF p.390; unit 4313 -->

Путь в SDK: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.390; unit 4314 -->

### 10.4 Типы данных

<!-- Source EN PDF p.390; unit 4315 -->

#### 10.4.1  rk_aiq_isp_stats_t

<!-- Source EN PDF p.390; unit 4316 -->

【Описание】Статистика AIQ 3A

<!-- Source EN PDF p.390; unit 4317 -->

【Определение】

<!-- Source EN PDF p.390; unit 4318 -->

```text
 typedef struct {
     rk_aiq_isp_aec_stats_t aec_stats;
     rk_aiq_isp_awb_stats2_v3x_t awb_stats_v3x;
     rk_aiq_isp_af_stats_t  af_stats;
 } rk_aiq_isp_stats_t;
```

<!-- Source EN PDF p.390; unit 4319 -->

【Члены】

<!-- Source EN PDF p.390; unit 4320 -->

| Имя члена | Описание |
|---|---|
| aec_stats | Статистика AE |
| rk_aiq_isp_awb_stats2_v3x_t | Статистика AWB |
| af_stats | Статистика AF |

<!-- Source EN PDF p.391; unit 4321 -->

#### 10.4.2  RKAiqAecStats_t

<!-- Source EN PDF p.391; unit 4322 -->

【Описание】Данные AE; подробности приведены в описании функций раздела AE.

<!-- Source EN PDF p.391; unit 4323 -->

【Определение】

<!-- Source EN PDF p.391; unit 4324 -->

```text
 typedef struct RKAiqAecStats_s {
     RkAiqAecHwStatsRes_t ae_data;
     RKAiqAecExpInfo_t ae_exp;
 } RKAiqAecStats_t;
```

<!-- Source EN PDF p.391; unit 4325 -->

【Члены】

<!-- Source EN PDF p.391; unit 4326 -->

| Имя члена | Описание |
|---|---|
| ae_data | Аппаратная статистика модуля AE |
| ae_exp | Сведения об экспозиции сенсора модуля AE |

<!-- Source EN PDF p.391; unit 4327 -->

10.4.2.1  RKAiqAecExpInfo_t

<!-- Source EN PDF p.391; unit 4328 -->

【Описание】Сведения о параметрах экспозиции AE

<!-- Source EN PDF p.391; unit 4329 -->

【Определение】

<!-- Source EN PDF p.391; unit 4330 -->

```text
 typedef struct RKAiqAecExpInfo_s {
     RkAiqExpParamComb_t LinearExp;
     RkAiqExpParamComb_t HdrExp[3];
     RkAiqIrisParamComb_t Iris;
     uint16_t line_length_pixels;
     uint32_t frame_length_lines;
     float pixel_clock_freq_mhz;
     CISFeature_t CISFeature;
     RKAiqExpI2cParam_t exp_i2c_params;
 } RKAiqAecExpInfo_t;
```

<!-- Source EN PDF p.391; unit 4331 -->

【Члены】

<!-- Source EN PDF p.392; unit 4332 -->

| Имя члена | Описание |
|---|---|
| LinearExp | Сведения об экспозиции без HDR, включая физические значения и значения регистров в формате RK |
| HdrExp | Сведения об экспозиции HDR, включая физические значения и значения регистров в формате RK; до 3 экспозиций |
| exp_i2c_params | Значения регистров экспозиции сенсора для сторонних реализаций AE |
| line_length_pixels | hts; значение определяется последовательностью настройки сенсора |
| frame_length_lines | vts; значение определяется последовательностью настройки сенсора |
| pixel_clock_freq_mhz | pclk в MHz; значение определяется последовательностью настройки сенсора |

<!-- Source EN PDF p.392; unit 4333 -->

【Меры предосторожности】

<!-- Source EN PDF p.392; unit 4334 -->

HdrExp содержит параметры экспозиции HDR, до 3TO1. Для HDR 2TO1 индекс 0 — короткий кадр, 1 — длинный, 2 недействителен. Для HDR 3TO1 индекс 0 — короткий кадр, 1 — средний, 2 — длинный.

<!-- Source EN PDF p.392; unit 4335 -->

10.4.2.1.1 RkAiqExpParamComb_t

<!-- Source EN PDF p.392; unit 4336 -->

【Описание】Подробные сведения о параметрах экспозиции AE

<!-- Source EN PDF p.392; unit 4337 -->

【Члены】

<!-- Source EN PDF p.392; unit 4338 -->

```text
 typedef struct {
     RkAiqExpRealParam_t exp_real_params; real value
     RkAiqExpSensorParam_t exp_sensor_params;//RK reg value
 } RkAiqExpParamComb_t;
```

<!-- Source EN PDF p.392; unit 4339 -->

| Имя члена | Описание |
|---|---|
| exp_real_params | Физическое значение компонента экспозиции |
| exp_sensor_params | Значение регистра компонента экспозиции сенсора по правилам установки экспозиции RK |

<!-- Source EN PDF p.392; unit 4340 -->

```text
 typedef struct RkAiqExpRealParam_s {
     float integration_time;
     float analog_gain;
     float digital_gain;
     float isp_dgain;
     int   iso;
     int   dcg_mode;
 } RkAiqExpRealParam_t;
```

<!-- Source EN PDF p.393; unit 4341 -->

| Имя члена | Описание |
|---|---|
| integration_time | Время интегрирования экспозиции в секундах (s) |
| analog_gain | Аналоговое/общее усиление сенсора, кратность |
| digital_gain | Цифровое усиление сенсора, кратность. Если оно компенсирует точность аналогового усиления, задаётся 1x, а общее усиление записывается в analog_gain |
| isp_dgain | Цифровое усиление ISP, кратность; сейчас недействительно, по умолчанию 1x |
| iso | Общее усиление; ISO выражает усиление системы с постоянным множителем 50: ISO = Total gain * 50 |
| dcg_mode | Двойное усиление преобразования |

<!-- Source EN PDF p.393; unit 4342 -->

```text
 typedef struct RkAiqExpSensorParam_s {
     unsigned short fine_integration_time;
     unsigned short coarse_integration_time;
     unsigned short analog_gain_code_global;
     unsigned short digital_gain_global;
     unsigned short isp_digital_gain;
 } RkAiqExpSensorParam_t;
```

<!-- Source EN PDF p.393; unit 4343 -->

| Имя члена | Описание |
|---|---|
| fine_integration_time | Регистр дробной части строк времени интегрирования сенсора; требуется только при поддержке дробных строк |
| coarse_integration_time | Регистр времени интегрирования сенсора, число строк |
| analog_gain_code_global | Регистры аналогового усиления сенсора |
| digital_gain_global | Регистры цифрового усиления сенсора |
| isp_digital_gain | Регистр цифрового усиления ISP; временно недействителен |

<!-- Source EN PDF p.393; unit 4344 -->

【Меры предосторожности】

<!-- Source EN PDF p.393; unit 4345 -->

Назначение цифрового усиления различается: у одних сенсоров оно расширяет диапазон чувствительности, у других дополняет точность аналогового усиления. Поэтому здесь цифровое усиление отдельно не выделено: его величина и соответствующие регистры включены в аналоговое усиление.

<!-- Source EN PDF p.393; unit 4346 -->

Режим двойного усиления преобразования имеет три состояния: -1 — сенсор не поддерживает DCG, 0 — LCG, 1 — HCG.

<!-- Source EN PDF p.393; unit 4347 -->

10.4.2.1.2 RKAiqExpI2cParam_t

<!-- Source EN PDF p.393; unit 4348 -->

【Описание】Параметры экспозиции I2c модуля AE (обычно для стороннего AE)

<!-- Source EN PDF p.393; unit 4349 -->

【Определение】

<!-- Source EN PDF p.394; unit 4350 -->

```text
 #define MAX_I2CDATA_LEN 64
 typedef struct RKAiqExpI2cParam_s {
     bool           bValid;
     unsigned int   nNumRegs;
     unsigned int   RegAddr[MAX_I2CDATA_LEN];
     unsigned int   AddrByteNum[MAX_I2CDATA_LEN];
     unsigned int   RegValue[MAX_I2CDATA_LEN];
     unsigned int   ValueByteNum[MAX_I2CDATA_LEN];
     unsigned int   DelayFrames[MAX_I2CDATA_LEN];
 } RKAiqExpI2cParam_t;
```

<!-- Source EN PDF p.394; unit 4351 -->

【Члены】

<!-- Source EN PDF p.394; unit 4352 -->

| Имя члена | Описание |
|---|---|
| bValid | Флаг действительности параметров I2c. true: запись регистров через RKAiqExpI2cParam_t (обычно сторонним AE); false: использование параметров регистров в формате RK |
| nNumRegs | Количество записываемых значений регистров |
| AddrByteNum | Битовая длина адреса регистра; не более 64 элементов |
| RegValue | Массив значений регистров, не более 64 элементов |
| ValueByteNum | Битовая длина значения регистра; не более 64 элементов |
| DelayFrames | Массив задержек применения регистров в кадрах, не более 64 элементов |

<!-- Source EN PDF p.394; unit 4353 -->

【Меры предосторожности】

<!-- Source EN PDF p.394; unit 4354 -->

Эти параметры действуют только при true для стороннего приложения AE и bValid. Иначе по умолчанию используются регистры формата RK из RkAiqExpParamComb_t.

<!-- Source EN PDF p.394; unit 4355 -->

Можно задать не более 64 значений регистров.

<!-- Source EN PDF p.394; unit 4356 -->

10.4.2.1.3 RkAiqIrisParamComb_t

<!-- Source EN PDF p.394; unit 4357 -->

【Описание】Параметры диафрагмы AE

<!-- Source EN PDF p.394; unit 4358 -->

【Определение】

<!-- Source EN PDF p.394; unit 4359 -->

```text
 typedef struct {
     RkAiqPIrisParam_t   PIris;
     RkAiqDCIrisParam_t  DCIris;
 } RkAiqIrisParamComb_t;
 typedef struct {
     int            step;
     int            gain;
     bool           update;
 } RkAiqPIrisParam_t;
 typedef struct {
     int        pwmDuty; //percent value,range = 0-100
     bool       update;
 } RkAiqDCIrisParam_t;
```

<!-- Source EN PDF p.395; unit 4360 -->

【Члены】

<!-- Source EN PDF p.395; unit 4361 -->

| Имя члена | Вложенные поля | Описание |
|---|---|---|
| PIris | Обновление усиления шага | Параметры P-диафрагмы: регистр шага, эквивалентное усиление шага и флаг обновления шага |
| DCIris | Обновление pwmDuty | Параметры DC-диафрагмы: коэффициент заполнения PWM в диапазоне 1~100 и флаг обновления параметров DC-диафрагмы |

<!-- Source EN PDF p.395; unit 4362 -->

10.4.2.2  RkAiqAecHwStatsRes_t

<!-- Source EN PDF p.395; unit 4363 -->

【Описание】Аппаратная статистика AE

<!-- Source EN PDF p.395; unit 4364 -->

【Определение】

<!-- Source EN PDF p.395; unit 4365 -->

```text
 typedef struct RkAiqAecHwStatsRes_s {
     Aec_Stat_Res_t chn[3];
     Aec_Stat_Res_t extra;
     struct yuvae_stat yuvae;
     struct sihist_stat sihist;
 } RkAiqAecHwStatsRes_t;
```

<!-- Source EN PDF p.395; unit 4366 -->

【Члены】

<!-- Source EN PDF p.395; unit 4367 -->

| Имя члена | Описание |
|---|---|
| chn[3] | Статистика AE по RAW после BLC и AWB; совместима с HDR и без HDR, до HDR 3TO1 со статистикой S/M/L |
| extra | Статистика AE по RAW до Debayer; в HDR соответствует объединённому кадру |
| yuvae | Поблочная информация AE по RGB до gamma [платформой 3588 не поддерживается]. |
| sihist | Гистограмма AE по RGB до gamma [платформой 3588 не поддерживается] |

<!-- Source EN PDF p.395; unit 4368 -->

【Меры предосторожности】

<!-- Source EN PDF p.395; unit 4369 -->

Aec_Stat_Res_t chn[3]: статистика трёх путей RAW перед HDR Merge. Без HDR действителен индекс 0, остальные нет. При HDR 2TO1: 0 — короткий кадр, 1 — длинный, 2 недействителен. При HDR 3TO1: 0 — короткий кадр, 1 — средний, 2 — длинный путь данных

<!-- Source EN PDF p.396; unit 4370 -->

со статистикой. Перед модулем статистики RAW находятся BLC и AWB, поэтому их усиление влияет на результаты. Aec_Stat_Res_t extra: в HDR это статистика RAW после объединения HDR. Перед ней находятся BLC, AWB, HDRMERGE, TMO и другие модули, усиление которых влияет на результат. При включении AF эта часть статистики недействительна.

<!-- Source EN PDF p.396; unit 4371 -->

На платформе 3588 не поддерживаются поблочная информация и гистограммы RGB до gamma.

<!-- Source EN PDF p.396; unit 4372 -->

10.4.2.2.1 Aec_Stat_Res_t

<!-- Source EN PDF p.396; unit 4373 -->

【Описание】Статистика AE по RAW-изображению

<!-- Source EN PDF p.396; unit 4374 -->

【Определение】

<!-- Source EN PDF p.396; unit 4375 -->

```text
 typedef struct Aec_Stat_Res_s {
     //rawae
     struct rawaebig_stat rawae_big;
     struct rawaelite_stat rawae_lite;
     //rawhist
     struct rawhist_stat rawhist_big;
     struct rawhist_stat rawhist_lite;
 } Aec_Stat_Res_t;
```

<!-- Source EN PDF p.396; unit 4376 -->

【Члены】

<!-- Source EN PDF p.396; unit 4377 -->

| Имя члена | Описание |
|---|---|
| rawae_big | Поблочная статистика RAW в режиме BIG |
| rawae_lite | Поблочная статистика RAW в режиме Lite |
| rawhist_big | Гистограмма RAW в режиме BIG |
| rawhist_lite | Гистограмма RAW в режиме Lite |

<!-- Source EN PDF p.396; unit 4378 -->

【Меры предосторожности】

<!-- Source EN PDF p.396; unit 4379 -->

Различия BIG и LITE для RAW описаны в разделе функций. Основные отличия — число блоков статистики средней яркости и поддержка средней яркости независимых подокон. Структуры гистограмм RAW для BIG и LITE одинаковы.

<!-- Source EN PDF p.396; unit 4380 -->

На 3588 по умолчанию без HDR используется BIG (15X15 неотдельных подокон); HDR из 2 кадров — BIG для каждого (15X15); HDR из 3 кадров — BIG для короткого и длинного (15X15), LITE для среднего (5X5).

<!-- Source EN PDF p.397; unit 4381 -->

10.4.2.2.2 rawaebig_stat

<!-- Source EN PDF p.397; unit 4382 -->

【Описание】Статистика big по RAW: средние R/G/B в 15X15 неотдельных подокнах и суммы R/G/B в 4 независимых подокнах

<!-- Source EN PDF p.397; unit 4383 -->

【Определение】

<!-- Source EN PDF p.397; unit 4384 -->

```text
 struct rawaebig_stat {
     unsigned short channelr_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelg_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelb_xy[RAWAEBIG_WIN_NUM];
     unsigned int   channely_xy[RAWAEBIG_WIN_NUM]; //not HW!
     unsigned long int wndx_sumr[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumg[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumb[RAWAEBIG_SUBWIN_NUM];
     unsigned short wndx_channelr[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelg[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelb[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned char wndx_channely[RAWAEBIG_SUBWIN_NUM]; //not HW!
 };
 #define RAWAEBIG_WIN_NUM    225
 #define RAWAEBIG_SUBWIN_NUM  4
```

<!-- Source EN PDF p.397; unit 4385 -->

【Члены】

<!-- Source EN PDF p.397; unit 4386 -->

| Имя члена | Описание |
|---|---|
| channelr_xy | Средняя яркость R блоков неотдельных подокон BIG. Значащих бит: 10bit. |
| channelg_xy | Средняя яркость G блоков неотдельных подокон BIG. Значащих бит: 12bit. |
| channelb_xy | Средняя яркость B блоков неотдельных подокон BIG. Значащих бит: 10bit. |
| wndx_sumr | Сумма яркости R независимых подокон BIG. Значащих бит: 29bit. |
| wndx_sumg | Сумма яркости G независимых подокон BIG. Значащих бит: 32bit. |
| wndx_sumb | Сумма яркости B независимых подокон BIG. Значащих бит: 29bit. |

<!-- Source EN PDF p.397; unit 4387 -->

【Меры предосторожности】

<!-- Source EN PDF p.397; unit 4388 -->

Статистика BIG по RAW содержит только R/G/B. Для Y следует добавить в ПО вычисление по статистическим значениям R/G/B.

<!-- Source EN PDF p.397; unit 4389 -->

Статистика BIG по RAW содержит 15X15 неотдельных подокон. Минимальный размер такого подокна — 16X4.

<!-- Source EN PDF p.398; unit 4390 -->

Статистика BIG по RAW содержит 4 независимых подокна, которые могут перекрываться либо нет. Максимальный размер не должен превышать 2k x 1k.

<!-- Source EN PDF p.398; unit 4391 -->

Параметры структуры channely_xy, wndx_channelr, wndx_channelg, wndx_channelb и wndx_channely вычисляются программно: необходимо добавить код расчёта по аппаратной статистике.

<!-- Source EN PDF p.398; unit 4392 -->

10.4.2.2.3 rawaelite_stat

<!-- Source EN PDF p.398; unit 4393 -->

【Описание】Статистика lite по RAW содержит среднюю яркость R/G/B в 5X5 блоках неотдельных подокон

<!-- Source EN PDF p.398; unit 4394 -->

【Определение】

<!-- Source EN PDF p.398; unit 4395 -->

```text
 struct rawaelite_stat {
     unsigned short channelr_xy[RAWAELITE_WIN_NUM];
     unsigned short channelg_xy[RAWAELITE_WIN_NUM];
     unsigned short channelb_xy[RAWAELITE_WIN_NUM];
     unsigned int   channely_xy[RAWAELITE_WIN_NUM]; not HW!
 };
 #define RAWAELITE_WIN_NUM  25
```

<!-- Source EN PDF p.398; unit 4396 -->

【Члены】

<!-- Source EN PDF p.398; unit 4397 -->

| Имя члена | Описание |
|---|---|
| channelr_xy | Средняя яркость R блоков неотдельных подокон Lite. Значащих бит: 10bit. |
| channelg_xy | Средняя яркость G блоков неотдельных подокон Lite. Значащих бит: 12bit. |
| channelb_xy | Средняя яркость B блоков неотдельных подокон Lite. Значащих бит: 10bit. |

<!-- Source EN PDF p.398; unit 4398 -->

【Меры предосторожности】

<!-- Source EN PDF p.398; unit 4399 -->

Статистика lite по RAW содержит только R/G/B в 5X5 неотдельных подокнах. Для Y можно добавить вычисление по R/G/B. Минимальный размер неотдельного подокна — 16X4.

<!-- Source EN PDF p.398; unit 4400 -->

channely_xy в структуре вычисляется программно: следует добавить расчёт по аппаратной статистике.

<!-- Source EN PDF p.398; unit 4401 -->

10.4.2.2.4 rawhist_stat

<!-- Source EN PDF p.398; unit 4402 -->

【Описание】Гистограмма по RAW-изображению

<!-- Source EN PDF p.398; unit 4403 -->

【Определение】

<!-- Source EN PDF p.399; unit 4404 -->

```text
 struct rawhist_stat {
     unsigned int bins[RAWHIST_BIN_N_MAX];
 };
 #define RAWHIST_BIN_N_MAX  256
```

<!-- Source EN PDF p.399; unit 4405 -->

【Члены】

<!-- Source EN PDF p.399; unit 4406 -->

| Имя члена | Описание |
|---|---|
| bins | Гистограмма разбита на 256 интервалов; значащих бит в каждом — 28bit |

<!-- Source EN PDF p.399; unit 4407 -->

#### 10.4.3  rk_aiq_isp_awb_stats2_v3x_t

<!-- Source EN PDF p.399; unit 4408 -->

【Описание】Аппаратная статистика баланса белого: в основном статистика белых точек и блоков

<!-- Source EN PDF p.399; unit 4409 -->

Статистика белых точек

<!-- Source EN PDF p.399; unit 4410 -->

Записывает суммы RGins и BGain и количество точек белых областей двух размеров для 7 источников света в основном окне;

<!-- Source EN PDF p.399; unit 4411 -->

Записывает суммы RGin и BGain и количество точек белых областей двух размеров для 4 источников света в подокне;

<!-- Source EN PDF p.399; unit 4412 -->

Суммы RGin, BGain и количество точек в 4 дополнительных рамках домена UV или XY;

<!-- Source EN PDF p.399; unit 4413 -->

Гистограмма яркости белых точек;

<!-- Source EN PDF p.399; unit 4414 -->

Поблочная статистика: изображение делится на 15x15 блоков (см. схему AWB), для каждого берутся средние R, G, B всех точек либо белых точек.

<!-- Source EN PDF p.399; unit 4415 -->

![Технический рисунок английского оригинала — PDF p.399](/docs/rockchip-isp30-development/assets/en-p399-X2080.png)

<!-- Source EN PDF p.399; unit 4416 -->

Рисунок: схема блоков AWB

<!-- Source EN PDF p.399; unit 4417 -->

【Определение】

<!-- Source EN PDF p.400; unit 4418 -->

```text
 typedef struct rk_aiq_isp_awb_stats2_v3x_s {
     //method1
     rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //method2
     rk_aiq_awb_stat_blk_res_v201_t   blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
     //window in pixel domain
     rk_aiq_awb_stat_wp_res_light_v201_t
 multiwindowLightResult[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //window in xy or uv domain
     rk_aiq_awb_stat_wp_res_v201_t
 excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
     //wpno histogram
     unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
 } rk_aiq_isp_awb_stats2_v3x_t;
```

<!-- Source EN PDF p.400; unit 4419 -->

【Члены】

<!-- Source EN PDF p.400; unit 4420 -->

| Имя члена | Описание |
|---|---|
| light | Результаты статистики белых точек для разных источников света в основном окне; до RK_AIQ_AWB_MAX_WHITEREGIONS_NUM источников; |
| WpNo2 | Число белых точек в пересечении доменов XY и UV для разных источников света в основном окне, без дробной части. |
| blockResult | Суммы RGB каждого равномерного блока изображения; всего 15x15 (RK_AIQ_AWB_GRID_NUM_TOTAL) блоков, см. схему AWB |
| multiwindowLightResult | Статистика белых точек разных источников света в подокнах (записываются лишь первые 4 источника; все можно записывать с временным разделением), до 4 подокон |
| excWpRangeResult | Статистика точек в excludeWpRange (записываются лишь первые четыре области excludeWpRange), до 4 областей |
| WpNoHist | Гистограмма белых точек: число точек в каждом bin, без дробной части. Регистр xyRangeTypeForWpHist определяет, считать ли точки большой рамки XY либо рамки внутри XY. |

<!-- Source EN PDF p.400; unit 4421 -->

【Меры предосторожности】

<!-- Source EN PDF p.400; unit 4422 -->

Общую статистику белых точек основного окна легко получить преобразованием статистики по всем источникам света.

<!-- Source EN PDF p.401; unit 4423 -->

#### 10.4.4  rk_aiq_awb_stat_wp_res_light_v201_t

<!-- Source EN PDF p.401; unit 4424 -->

【Описание】Определение статистики белых точек при одном источнике света.

<!-- Source EN PDF p.401; unit 4425 -->

【Определение】

<!-- Source EN PDF p.401; unit 4426 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_light_v201_s {
     rk_aiq_awb_stat_wp_res_v201_t xYType[RK_AIQ_AWB_XY_TYPE_MAX_V201];
 } rk_aiq_awb_stat_wp_res_light_v201_t;
```

<!-- Source EN PDF p.401; unit 4427 -->

【Члены】

<!-- Source EN PDF p.401; unit 4428 -->

| Имя члена | Описание |
|---|---|
| XYType | Статистика белых точек XY-рамок разного размера для одного источника; максимум RK_AIQ_AWB_XY_TYPE_MAX_V201, то есть 2 рамки. |

<!-- Source EN PDF p.401; unit 4429 -->

#### 10.4.5  rk_aiq_awb_stat_wp_res_v201_t

<!-- Source EN PDF p.401; unit 4430 -->

【Описание】Статистика белых точек XY-рамки заданного размера для источника и не-белых точек в соответствующей области.

<!-- Source EN PDF p.401; unit 4431 -->

【Определение】

<!-- Source EN PDF p.401; unit 4432 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_v201_s {
     long long WpNo;
     long long RgainValue;
     long long BgainValue;
 } rk_aiq_awb_stat_wp_res_v201_t;
```

<!-- Source EN PDF p.401; unit 4433 -->

【Члены】

<!-- Source EN PDF p.401; unit 4434 -->

| Имя члена | Описание |
|---|---|
| WpNo | Число белых точек: 22 целых и 10 дробных бит (в исходнике 10ibit). WpNo = аппаратная статистика белых точек ISP / 2^10. |
| RgainValue | Сумма R белых точек: 22 целых и 10 дробных бит. |
| BgainValue | Сумма G белых точек: 22 целых и 10 дробных бит. |

<!-- Source EN PDF p.402; unit 4435 -->

#### 10.4.6  rk_aiq_awb_stat_blk_res_v201_t

<!-- Source EN PDF p.402; unit 4436 -->

【Описание】Определение статистики каждого блока.

<!-- Source EN PDF p.402; unit 4437 -->

При blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 записывается сумма всех точек блока; исходный пробел между знаками равенства сохранён в английском тексте.

<!-- Source EN PDF p.402; unit 4438 -->

При blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 записывается сумма всех белых точек блока.

<!-- Source EN PDF p.402; unit 4439 -->

blkMeasureMode — регистр выбора содержимого статистики блока.

<!-- Source EN PDF p.402; unit 4440 -->

【Определение】

<!-- Source EN PDF p.402; unit 4441 -->

```text
 typedef struct rk_aiq_awb_stat_blk_res_v201_s {
     long long WpNo;
     long long Rvalue;
     long long Gvalue;
     long long Bvalue;
 } rk_aiq_awb_stat_blk_res_v201_t;
```

<!-- Source EN PDF p.402; unit 4442 -->

【Члены】

<!-- Source EN PDF p.402; unit 4443 -->

| Имя члена | Описание |
|---|---|
| WpNo | Число точек в блоке |
| Rvalue | Сумма R всех точек блока. |
| Gvalue | Сумма RG всех точек блока (обозначение RG исходника). |
| Bvalue | Сумма RB всех точек блока; исходная фраза заканчивается and. |

<!-- Source EN PDF p.402; unit 4444 -->

#### 10.4.7  rk_aiq_af_algo_stat_v30_t

<!-- Source EN PDF p.402; unit 4445 -->

【Описание】Определение статистики AF.

<!-- Source EN PDF p.402; unit 4446 -->

【Определение】

<!-- Source EN PDF p.402; unit 4447 -->

```text
 typedef struct {
     unsigned int wndb_luma;
     unsigned int wndb_sharpness;
     unsigned int winb_highlit_cnt;
     unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int int_state;
     struct timeval focus_starttim;
     struct timeval focus_endtim;
     struct timeval zoom_starttim;
     struct timeval zoom_endtim;
     int64_t sof_tim;
     int focusCode;
     int zoomCode;
     bool focusCorrection;
     bool zoomCorrection;
     float angleZ;
 } rk_aiq_af_algo_stat_v30_t;
```

<!-- Source EN PDF p.403; unit 4448 -->

【Члены】

<!-- Source EN PDF p.403; unit 4449 -->

| Имя члена | Описание |
|---|---|
| wndb_luma | Яркость независимого окна. |
| wndb_sharpness | Резкость независимого окна. |
| winb_highlit_cnt | Число ярких пикселей независимого окна. |
| wnda_luma | Яркость подокон 15*15 основного окна. |
| wnda_fv_v1 | Резкость V1 подокон 15*15 основного окна. |
| wnda_fv_v2 | Резкость V2 подокон 15*15 основного окна. |
| wnda_fv_h1 | Резкость H1 подокон 15*15 основного окна. |
| wnda_fv_h2 | Резкость H2 подокон 15*15 основного окна. |
| wina_highlit_cnt | Число ярких пикселей подокон 15*15 основного окна. |
| int_state | Используется алгоритмом RK AF, можно игнорировать. |
| focus_starttim | Используется алгоритмом RK AF, можно игнорировать. |
| focus_endtim | Используется алгоритмом RK AF, можно игнорировать. |
| zoom_starttim | Используется алгоритмом RK AF, можно игнорировать. |
| zoom_endtim | Используется алгоритмом RK AF, можно игнорировать. |
| sof_tim | Время начала данного кадра в ns. |
| focusCode | Используется алгоритмом RK AF, можно игнорировать. |
| zoomCode | Используется алгоритмом RK AF, можно игнорировать. |
| focusCorrection | Используется алгоритмом RK AF, можно игнорировать. |
| zoomCorrection | Используется алгоритмом RK AF, можно игнорировать. |
| angleZ | Используется алгоритмом RK AF, можно игнорировать. |

<!-- Source EN PDF p.404; unit 4450 -->

## 11. Отладка и FAQ

<!-- Source EN PDF p.404; unit 4451 -->

### 11.1 Получение версии

<!-- Source EN PDF p.404; unit 4452 -->

AIQ предоставляет дату выпуска, версии AIQ, парсера IQ и каждого алгоритмического модуля ISP.

<!-- Source EN PDF p.404; unit 4453 -->

11.1.0.1 Краткая версия

<!-- Source EN PDF p.404; unit 4454 -->

```text
 strings librkaiq.so | grep -w AIQ
 AIQ: v0.1.6
```

<!-- Source EN PDF p.404; unit 4455 -->

11.1.0.2 Полная версия

<!-- Source EN PDF p.404; unit 4456 -->

1\. Библиотека AIQ SDK по умолчанию собрана как Release; измените на Debug, пересоберите и обновите на устройстве.

<!-- Source EN PDF p.404; unit 4457 -->

```text
SDK/external/camera_engine_rkaiq/CMakeLists.txt:
```

<!-- Source EN PDF p.404; unit 4458 -->

```text
if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
endif()
```

<!-- Source EN PDF p.404; unit 4459 -->

Изменить на:

<!-- Source EN PDF p.404; unit 4460 -->

```text
#if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
#endif()
```

<!-- Source EN PDF p.404; unit 4461 -->

2\. Исходный уровень не печатает версию работающей библиотеки AIQ; настройте уровень xcore для её вывода.

<!-- Source EN PDF p.404; unit 4462 -->

```text
 export persist_camera_engine_log=0x1000000ff2
```

<!-- Source EN PDF p.404; unit 4463 -->

3\. Версия, выводимая при запуске AIQ:

<!-- Source EN PDF p.404; unit 4464 -->

```text
 ************************** VERSION INFOS **************************
 version release date: 2020-06-05
                  AIQ: v0.1.6
            IQ PARSER: v1.0.0
 RK INTEGRATED ALGO MODULES:
                  AWB: v0.0.9
                  AEC: v0.1.1
                   AF: v0.0.9
                 AHDR: v0.0.9
                  ANR: v0.0.9
               ASHARP: v0.0.9
              ADEHAZE: v0.0.9
               AGAMMA: v0.0.9
               A3DLUT: v0.0.9
                 ABLC: v0.0.9
                 ACCM: v0.0.9
                 ACGC: v0.0.9
                  ACP: v0.0.9
             ADEBAYER: v0.0.1
                ADPCC: v0.0.9
                 AGIC: v0.0.9
                  AIE: v0.0.1
                ALDCH: v0.0.9
                 ALSC: v0.0.9
                 AORB: v0.0.9
                 AR2Y: v0.0.9
                  ASD: v0.0.9
                 AWDR: v0.0.9
 ************************ VERSION INFOS END ************************
```

<!-- Source EN PDF p.405; unit 4465 -->

#### 11.1.1 Правила совместимости версий

<!-- Source EN PDF p.405; unit 4466 -->

Правила согласования AIQ, IQ Tool и ISP Driver:

<!-- Source EN PDF p.405; unit 4467 -->

v A . B. C

<!-- Source EN PDF p.405; unit 4468 -->

B задаётся в шестнадцатеричном виде: bit[0:3] — согласование AIQ/IQ Tool, bit[4:7] — AIQ/ISP driver. Например:

<!-- Source EN PDF p.405; unit 4469 -->

ISP driver: v 1. 0x3.0 соответствует AIQ:v1.0x30.0 и AIQ:v1.0x40.0 (исходный пример сохранён).

<!-- Source EN PDF p.405; unit 4470 -->

IQ tool: v 1. 0x3.0 соответствует AIQ:v1.0x33.0 и AIQ:v1.0x30.0. При ненулевом C возможна несовместимость; для IQ Tool рекомендуется сначала версия AIQ с C=0.

<!-- Source EN PDF p.405; unit 4471 -->

### 11.2 Журнал AIQ

<!-- Source EN PDF p.405; unit 4472 -->

#### 11.2.1 Обзор

<!-- Source EN PDF p.405; unit 4473 -->

AIQ кодирует уровни журнала всех модулей в 64bits; битовая карта и описания приведены ниже.

<!-- Source EN PDF p.405; unit 4474 -->

```text
 bit: [63-39]   38      37       36    35   34     33    32    31
 mean:  [U]   [CAMHW][ANALYZER][XCORE][ASD][ACGC][AFEC][AORB][ASHARP]
 bit:  30   29   28     27     26       25      24   23       22
 mean:[AIE][ACP][ACSM][ALDCH][A3DLUT][ADEHAZE][AWDR][AGAMMA][ACCM]
 bit:      21     20    19   18    17    16     15   14  13   12
 mean:[ADEBAYER][AGIC][ALSC][ANR][AHDR][ADPCC][ABLC][AF][AWB][AEC]
 bit:    11-4        3-0
 mean:[sub modules][level]
     [U] means unused now.
     [level] : use 4 bits to define log levels.
     each module log has following ascending levels:
     0: error
     1: warning
     2: info
     3: debug
     4: verbose
     5: low1
     6-7: unused, now the same as debug
     [sub modules] : use bits 4-11 to define the sub modules of each module,
 thespecific meaning of each bit is decided by the module itself. These bitsis
 designed to implement the sub module's log switch.
     [modules] : AEC, AWB, AF ...
     set debug level example:
     eg. set module af log level to debug, and enable all sub modules of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4ff4
     Linux:
     export persist_camera_engine_log=0x4ff4
     And if only want enable the sub module 1 log of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4014
     Linux:
     export persist_camera_engine_log=0x4014
```

Карта выше сохранена из исходника: U в bit[63-39] пока не используется. level занимает 4 бита: 0 error, 1 warning, 2 info, 3 debug, 4 verbose, 5 low1; 6-7 не используются и сейчас эквивалентны debug. sub modules занимают bit4-11; смысл каждого бита и включение журнала определяет модуль. modules включают AEC, AWB, AF и др. Примеры сначала включают все подмодули AF, затем только подмодуль 1; Android использует setprop, Linux — export. Исходник называет 0x4ff4 примером debug, но младшие 4 бита равны 4, соответствующему verbose. Значения сохранены; проверьте SDK.

<!-- Source EN PDF p.406; unit 4475 -->

В Linux уровни и включение журналов модулей задаются переменной среды persist_camera_engine_log.

<!-- Source EN PDF p.407; unit 4476 -->

| Модуль | Журнал Debug | Журнал Verbose |
|---|---|---|
| AE | export persist_camera_engine_log=0x1ff3 | export persist_camera_engine_log=0x1ff4 |
| AWB | export persist_camera_engine_log=0x2ff3 | export persist_camera_engine_log=0x2ff4 |
| AF | export persist_camera_engine_log=0x4ff3 | export persist_camera_engine_log=0x4ff4 |
| HDR | export persist_camera_engine_log=0x20ff3 | export persist_camera_engine_log=0x20ff3 |
| NR | export persist_camera_engine_log=0x40ff3 | export persist_camera_engine_log=0x40ff4 |
| Dehaze | export persist_camera_engine_log=0x2000ff3 | export persist_camera_engine_log=0x2000ff3 |
| Sharp | export persist_camera_engine_log=0x80000ff3 | export persist_camera_engine_log=0x80000ff4 |
| CAMHW | export<br>persist_camera_engine_log=0x4000000ff3 | export<br>persist_camera_engine_log=0x4000000ff4 |
|  |  |  |
|  |  |  |
|  |  |  |

<!-- Source EN PDF p.407; unit 4477 -->

Команда просмотра текущего уровня журнала:

<!-- Source EN PDF p.407; unit 4478 -->

```text
    [root@RV1126_RV1109:/]# echo $persist_camera_engine_log
    0x4014
```

<!-- Source EN PDF p.407; unit 4479 -->

#### 11.2.2  AE

<!-- Source EN PDF p.407; unit 4480 -->

11.2.2.1 Настройка

<!-- Source EN PDF p.407; unit 4481 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Ошибка (Error) | Включено по умолчанию, критические ошибки. |
| Предупреждение (Warning) | По умолчанию выключено: предупреждения об ошибках, которые алгоритм может обработать и продолжить работу. |
| Информация (Info) | По умолчанию выключено. Базовая отладка без покадрового вывода; события сообщают состояние и частоту кадров обычно при инициализации, смене разрешения и параметров. Рекомендуется для контроля состояния и частоты кадров. |

<!-- Source EN PDF p.408; unit 4482 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Отладка (Debug) | По умолчанию выключено. Дополнительно к Info выводит номер кадра, соответствующие экспозицию, яркость статистики AE и результат экспозиции. Подходит для анализа мерцания по непрерывным данным яркости и экспозиции. Поле событий исходника пусто. |
| Подробно (Verbose) | По умолчанию выключено. Дополнительно к Debug выводит покадровые результаты алгоритма. Обычно не требуется; включать, если Debug недостаточно. Поле событий исходника пусто. |

<!-- Source EN PDF p.408; unit 4483 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4] | Журнал настройки AE: при чтении IQ или установке API позволяет проверить параметры. |
| bit[5] | Журнал обработки сведений AE: вычисляет показатели среды и изображения по статистике, позволяет читать яркостные данные. |
| bit[6] | Журнал расчёта AE для анализа результата экспозиции. |
| bit[7] | Журнал Airis для проблем регулируемой диафрагмы. |
| bit[8:11] | void |

<!-- Source EN PDF p.408; unit 4484 -->

11.2.2.2 Интерпретация журнала

<!-- Source EN PDF p.408; unit 4485 -->

Исходник разбирает только Debug 0x1ff3 — отладку всех подмодулей AE — из-за ограниченного объёма.

<!-- Source EN PDF p.408; unit 4486 -->

AE LOG линейного режима

<!-- Source EN PDF p.409; unit 4487 -->

![Технический рисунок английского оригинала — PDF p.409](/docs/rockchip-isp30-development/assets/en-p409-X2117.png)

<!-- Source EN PDF p.409; unit 4488 -->

Рис. 3-1. AE LOG линейного режима

<!-- Source EN PDF p.409; unit 4489 -->

Рис. 3-1 показывает линейный AE LOG. Строка 1:

<!-- Source EN PDF p.409; unit 4490 -->

```text
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

<!-- Source EN PDF p.409; unit 4491 -->

Параметры экспозиции текущего кадра.

<!-- Source EN PDF p.409; unit 4492 -->

| Имя поля | Описание |
|---|---|
| FrmId | Номер текущего кадра |
| gain | Регистр усиления экспозиции sensor текущего кадра. |
| time | Регистр выдержки sensor текущего кадра. |
| envChange | Резкое изменение яркости среды: 0 — нет, 1 — есть. |
| dcg | DCG текущего кадра: -1 — не поддерживается sensor либо переключается внутри; 0 — LCG, 1 — HCG. |
| pirs | Позиция двигателя P-iris текущего кадра; при выключенном Airis не действует и не имеет смысла. |

<!-- Source EN PDF p.409; unit 4493 -->

Строка 2:

<!-- Source EN PDF p.409; unit 4494 -->

```text
Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0
```

<!-- Source EN PDF p.409; unit 4495 -->

Новые параметры предыдущего запуска AE частично совпадают с (1) и повторно не описываются. Сравнение Line1 и Line2 показывает, совпадает ли текущая экспозиция с новой, то есть вступила ли новая в силу. Строка 3:

<!-- Source EN PDF p.409; unit 4496 -->

```text
================================= Linear-AE (enter)===============================
```

<!-- Source EN PDF p.409; unit 4497 -->

Вход в алгоритм управления AE; Linear-AE обозначает линейную экспозицию.

<!-- Source EN PDF p.409; unit 4498 -->

Строка 4:

<!-- Source EN PDF p.409; unit 4499 -->

```text
Framenum=270
```

<!-- Source EN PDF p.409; unit 4500 -->

```text
Cur gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=34.875557,Is Converged=0
```

<!-- Source EN PDF p.410; unit 4501 -->

| Имя поля | Описание |
|---|---|
| Framenum | Номер текущего кадра |
| gain | Усиление экспозиции sensor текущего кадра. |
| time | Выдержка sensor текущего кадра. |
| pirisGain | Эквивалентное усиление P-iris текущего кадра; при выключенном Airis не действует. |
| RawMeanluma | Яркость RAW перед Debayer после вычитания чёрного и умножения на AWB Gain. |
| YuvMeanluma | Яркость RGB перед Gamma для оценки влияния модулей после debayer на яркость. |
| IsConverged | Сходимость экспозиции: 0 — нет, 1 — достигнута. |

<!-- Source EN PDF p.410; unit 4502 -->

Строка 5:

<!-- Source EN PDF p.410; unit 4503 -->

```text
AecClmExecute: NewExposure(0.180993) SplitGain(6.033096) SplitIntegrationTime(0.030000) SplitPirisGain(0)
```

<!-- Source EN PDF p.410; unit 4504 -->

| Имя поля | Описание |
|---|---|
| NewExposure | Новая экспозиция, рассчитанная AE. |
| SplitGain | Новое усиление sensor. |
| SplitIntegrationTime | Новая выдержка sensor. |
| SplitPirisGain | Новое эквивалентное усиление P-iris; при выключенном Airis не действует. |

<!-- Source EN PDF p.410; unit 4505 -->

Строка 6:

<!-- Source EN PDF p.410; unit 4506 -->

```text
calc result:SetPoint=22.000000,gain=6.023529,time=0.029987,piris=0,reggain=854,regtime=1398
```

<!-- Source EN PDF p.410; unit 4507 -->

Окончательно заданная новая экспозиция.

<!-- Source EN PDF p.411; unit 4508 -->

| Имя поля | Описание |
|---|---|
| SetPoint | Целевая яркость |
| gain | Окончательное новое усиление экспозиции. |
| time | Окончательная новая выдержка. |
| piris | Окончательное новое усиление P-iris; при выключенном Airis не действует. |
| reggain | Регистр окончательного нового усиления. |
| regtime | Регистр окончательной новой выдержки. |

<!-- Source EN PDF p.411; unit 4509 -->

Так определяются RawMeanLuma текущего кадра и целевой setpoint; их сравнение даёт новую экспозицию. Далее — AE LOG режима HDR:

<!-- Source EN PDF p.411; unit 4510 -->

![Технический рисунок английского оригинала — PDF p.411](/docs/rockchip-isp30-development/assets/en-p411-X2122.png)

<!-- Source EN PDF p.411; unit 4511 -->

Рис. 3-2. AE LOG HDR

<!-- Source EN PDF p.411; unit 4512 -->

Строка 1:

<!-- Source EN PDF p.411; unit 4513 -->

```text
Cur-Exp: FrmId=22,S-gain=0x0,S-time=0x2b6,M-gain=0xb,M-time=0x1a5e,L-gain=0x0,L- time=0x0,envChange=1,dcg=-1--1--1,Piris=0
```

<!-- Source EN PDF p.411; unit 4514 -->

Параметры экспозиции текущего кадра.

<!-- Source EN PDF p.412; unit 4515 -->

| Имя поля | Описание |
|---|---|
| FrmId | Номер текущего кадра |
| S/M/L-gain | Регистры усиления sensor кадров HDR: S/M для двух кадров, S/M/L для трёх. |
| S/M/L-time | Регистры выдержки sensor кадров HDR: S/M для двух кадров, S/M/L для трёх. |
| envChange | Резкое изменение яркости среды: 0 — нет, 1 — есть. |
| dcg | Три значения DCG относятся к короткому, среднему и длинному кадрам. В двухкадровом режиме первые два относятся к короткому и длинному; в трёхкадровом — ко всем трём. -1 — не поддерживается либо внутреннее переключение; 0 — LCG, 1 — HCG. |
| pirs | Позиция двигателя P-iris текущего кадра; при выключенном Airis не действует и не имеет смысла. |

<!-- Source EN PDF p.412; unit 4516 -->

Строка 2:

<!-- Source EN PDF p.412; unit 4517 -->

```text
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L- time=0x0
```

<!-- Source EN PDF p.412; unit 4518 -->

Новая экспозиция предыдущего AE; часть полей совпадает с (1). Сравнение Line1/Line2 показывает, вступила ли она в силу.

<!-- Source EN PDF p.412; unit 4519 -->

Строка 3:

<!-- Source EN PDF p.412; unit 4520 -->

```text
================================= HDR-AE (enter)===============================
```

<!-- Source EN PDF p.412; unit 4521 -->

Вход в алгоритм AE; HDR-AE обозначает режим HDR.

<!-- Source EN PDF p.412; unit 4522 -->

Строка 4:

<!-- Source EN PDF p.412; unit 4523 -->

```text
AecRun: SMeanLuma=9.342692, MMeanLuma=37.698597,LMeanLuma=0.000000,TmoMeanluma=37.571430,Isconverged=0,Longfr m=0
```

<!-- Source EN PDF p.413; unit 4524 -->

| Имя поля | Описание |
|---|---|
| S/M/LMeanLuma | Средняя яркость кадров HDR: S/M для двух, S/M/L для трёх. |
| TmoMeanluma | Средняя яркость выхода TMO текущего кадра. |
| Isconverged | Сходимость экспозиции кадров HDR: 0 — нет, 1 — достигнута. |
| Longfrm | Режим длинного кадра: 0 — выключен, 1 — включён. |

<!-- Source EN PDF p.413; unit 4525 -->

Строка 5:

<!-- Source EN PDF p.413; unit 4526 -->

```text
Framenum=22 Cur Piris=0, Sgain=1.000000,Stime=0.002570,mgain=1.462177,mtime=0.025000,lgain=1.000000,ltime=0.000000
```

<!-- Source EN PDF p.413; unit 4527 -->

| Имя поля | Описание |
|---|---|
| Framenum | Номер текущего кадра. |
| s/m/lgain | Усиления sensor текущего HDR: s/m для двух кадров, s/m/l для трёх. |
| s/m/ltime | Выдержки sensor текущего HDR: s/m для двух кадров, s/m/l для трёх. |
| piris | Эквивалентное усиление P-iris текущего кадра; при выключенном Airis не действует. |

<!-- Source EN PDF p.413; unit 4528 -->

Строка 6:

<!-- Source EN PDF p.413; unit 4529 -->

```text
S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433
```

<!-- Source EN PDF p.413; unit 4530 -->

LOG управления коротким кадром

<!-- Source EN PDF p.413; unit 4531 -->

| Имя поля | Описание |
|---|---|
| S-HighLightLuma | Яркость светов текущего короткого кадра. |
| S-Target | Целевая яркость светов короткого кадра. |
| S-GlobalLuma | Средняя глобальная яркость короткого кадра. |
| S-Target | Глобальная целевая яркость короткого кадра. |

<!-- Source EN PDF p.413; unit 4532 -->

Строка 7:

<!-- Source EN PDF p.413; unit 4533 -->

```text
L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155
```

<!-- Source EN PDF p.413; unit 4534 -->

LOG управления длинным кадром

<!-- Source EN PDF p.414; unit 4535 -->

| Имя поля | Описание |
|---|---|
| L-LowLightLuma | Яркость теней длинного кадра |
| L-Target | Целевая яркость теней длинного кадра. |
| L-GlobalLuma | Средняя глобальная яркость длинного кадра. |
| L-Target | Глобальная целевая яркость длинного кадра. |

<!-- Source EN PDF p.414; unit 4536 -->

Строка 8:

<!-- Source EN PDF p.414; unit 4537 -->

```text
calc result:piris=0,sgain=1.000000,stime=0.005081,mgain=1.862087,mtime=0.025000,lgain=0.000000,lti me=0.000000
```

<!-- Source EN PDF p.414; unit 4538 -->

Результат экспозиции алгоритма управления AE.

<!-- Source EN PDF p.414; unit 4539 -->

| Имя поля | Описание |
|---|---|
| s/m/lgain | Окончательные новые усиления sensor: s/m для двух кадров, s/m/l для трёх. |
| s/m/ltime | Окончательные новые выдержки sensor: s/m для двух кадров, s/m/l для трёх. |
| piris | Окончательное новое усиление P-iris; при выключенном Airis не действует. |

<!-- Source EN PDF p.414; unit 4540 -->

#### 11.2.3  AWB

<!-- Source EN PDF p.414; unit 4541 -->

11.2.3.1 Настройка

<!-- Source EN PDF p.414; unit 4542 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Ошибка (Error) | Включено по умолчанию, критические ошибки. |
| Предупреждение (Warning) | Включено по умолчанию: предупреждения об ошибках, которые могут обрабатываться внутри. |
| Информация (Info) | По умолчанию выключено: базовая отладка с покадровым wbgain; поля событий и рекомендаций пусты. |

<!-- Source EN PDF p.415; unit 4543 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| debug | По умолчанию выключено. Дополнительно к Info: сходимость WB, яркость среды, число белых точек, общая цветовая температура, вероятности четырёх наиболее вероятных источников и др. После вызова названного в исходнике AWS API печатаются атрибуты; написание AWS сохранено. Уровень удобен при ограниченном размере LOG. |
| Подробно (Verbose) | По умолчанию выключено. Дополнительно к Debug: статистика белых точек каждого источника (усиления WB и количество) и промежуточные результаты стратегии. Поле событий пусто. Рекомендуется для полного отладочного LOG. |

<!-- Source EN PDF p.415; unit 4544 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.415; unit 4545 -->

11.2.3.2 Интерпретация журнала

<!-- Source EN PDF p.415; unit 4546 -->

См. Rockchip_Color_Optimization_Guide_ISP2x_CN (ссылка исходника).

<!-- Source EN PDF p.415; unit 4547 -->

#### 11.2.4  AF

<!-- Source EN PDF p.415; unit 4548 -->

11.2.4.1 Настройка

<!-- Source EN PDF p.415; unit 4549 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Ошибка (Error) | Включено по умолчанию, критические ошибки. |
| Предупреждение (Warning) | По умолчанию выключено: предупреждения об ошибках, которые могут обрабатываться внутри. |
| Информация (Info) | По умолчанию выключено: базовая отладка с результатом поиска фокуса по кадрам; события и рекомендации пусты. |

<!-- Source EN PDF p.416; unit 4550 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| debug | По умолчанию выключено. Дополнительно к Info: FV и положение двигателя; события — запуск фокуса, поиск резкой позиции, зум, сопровождение фокуса и фокусировка. Рекомендуется для полного отладочного LOG. |
| Подробно (Verbose) | По умолчанию выключено. Дополнительные сведения относительно Debug указаны как None; покадровые сведения, события и рекомендации отсутствуют либо None. |

<!-- Source EN PDF p.416; unit 4551 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.416; unit 4552 -->

11.2.4.2 Интерпретация журнала

<!-- Source EN PDF p.416; unit 4553 -->

#### 11.2.5  MERGE

<!-- Source EN PDF p.416; unit 4554 -->

11.2.5.1 Настройка

<!-- Source EN PDF p.416; unit 4555 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Информация (Info) | По умолчанию выключено; покадровые данные и события пока не используются, рекомендуется отключить. |
| debug | По умолчанию выключено: покадровая отладка Merge, события не используются. Включать при неверной яркости или недостаточном контрасте после TMO. |
| Подробно (Verbose) | По умолчанию выключено: по исходнику дополнительно к Verbose выводит экспозицию Mrerge, события не используются. Включать для RK при мерцании, подтверждённом AE LOG как связанном с TMO; Mrerge — написание исходника. |

<!-- Source EN PDF p.417; unit 4556 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.417; unit 4557 -->

11.2.5.2 Интерпретация журнала

<!-- Source EN PDF p.417; unit 4558 -->

Уровень merge для линейного режима:

<!-- Source EN PDF p.417; unit 4559 -->

![Технический рисунок английского оригинала — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2143.png)

<!-- Source EN PDF p.417; unit 4560 -->

При HDR с длинным опорным кадром уровень merge — 10000000ff3.

<!-- Source EN PDF p.417; unit 4561 -->

![Технический рисунок английского оригинала — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2144.png)

<!-- Source EN PDF p.418; unit 4562 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| HDRFrameNum | Количество кадров HDR |
| LongFrmMode | Режим длинного кадра: 0 — выключен, 1 — включён. |
| MergeApiMode | Режим API |
| EnvLv | Яркость окружающей среды |
| MoveCoef | Переменные движения |
| byPass | Обход текущего кадра: 0 — выключен, 1 — включён. |
| BaseFrm | Опорный кадр: 0 — длинный, 1 — короткий. |
| OECurve_smooth | Наклон кривой пересвета, [0,200], денормализуется из JSON с коэффициентом 200. |
| OECurve_offset | Смещение кривой пересвета текущего кадра, [108,280]. |
| MDCurveMS_smooth | Наклон кривой между указанным исходником «frame» и коротким кадром, [0,200], денормализация JSON с коэффициентом 200. |
| MDCurveMS_offset | Смещение кривой между «frame» и коротким кадром, [0.26,100], денормализация JSON с коэффициентом 100. |
| MDCurveLM_smooth | Наклон кривой длинного/среднего кадров, [0,200], денормализация JSON с коэффициентом 200. |
| MDCurveLM_offset | Смещение кривой длинного/среднего кадров, [0.26,100], денормализация JSON с коэффициентом 100. |

<!-- Source EN PDF p.418; unit 4563 -->

При HDR с коротким опорным кадром уровень merge — 10000000ff3.

<!-- Source EN PDF p.418; unit 4564 -->

![Технический рисунок английского оригинала — PDF p.418](/docs/rockchip-isp30-development/assets/en-p418-X2148.png)

<!-- Source EN PDF p.419; unit 4565 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| HDRFrameNum | Количество кадров HDR |
| LongFrmMode | Режим длинного кадра: 0 — выключен, 1 — включён. |
| MergeApiMode | Режим API |
| EnvLv | Яркость окружающей среды |
| MoveCoef | Переменные движения |
| byPass | Обход текущего кадра: 0 — выключен, 1 — включён. |
| BaseFrm | Опорный кадр: 0 — длинный, 1 — короткий. |
| OECurve_smooth | Наклон кривой пересвета, [0,200], денормализуется из JSON с коэффициентом 200. |
| OECurve_offset | Смещение кривой пересвета текущего кадра, [108,280]. |
| MDCurve_Coef | Управляющий коэффициент текущего кадра, [0,1], по умолчанию 0.05, точность 0.0001. |
| MDCurve_ms_thd0 | Коэффициент короткого кадра, [0,1], по умолчанию 0.0, точность 0.1. |
| MDCurve_lm_thd0 | Коэффициент длинного кадра, [0,1], по умолчанию 0.0, точность 0.1. |

<!-- Source EN PDF p.419; unit 4566 -->

#### 11.2.6  DRC

<!-- Source EN PDF p.419; unit 4567 -->

11.2.6.1 Настройка

<!-- Source EN PDF p.419; unit 4568 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Информация (Info) | По умолчанию выключено; покадровые данные и события пока не используются, рекомендуется отключить. |
| debug | По умолчанию выключено: покадровая отладка DRC, события не используются. Включать при неверной яркости или недостаточном контрасте после TMO. |

<!-- Source EN PDF p.420; unit 4569 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Подробно (Verbose) | По умолчанию выключено: по исходнику дополнительно к Verbose выводит экспозиционные сведения DRC, события не используются. Включать для RK, когда AE LOG подтверждает мерцание TMO. |

<!-- Source EN PDF p.420; unit 4570 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.420; unit 4571 -->

11.2.6.2 Интерпретация журнала

<!-- Source EN PDF p.420; unit 4572 -->

При уровне DRC 20ff3:

<!-- Source EN PDF p.420; unit 4573 -->

![Технический рисунок английского оригинала — PDF p.420](/docs/rockchip-isp30-development/assets/en-p420-X2155.png)

<!-- Source EN PDF p.421; unit 4574 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| HDRFrameNum | Количество кадров HDR |
| LongFrmMode | Режим длинного кадра: 0 — выключен, 1 — включён. |
| DRCApiMode | Режим API |
| EnvLv | Яркость окружающей среды |
| byPass | Обход текущего кадра: 0 — выключен, 1 — включён. |
| Enable | Включение DRC |
| DrcGain | Усиление DRC текущего кадра, [1,8]. |
| alpha | Текущий DrcGain Alpha, [0,1]. |
| Clip | Текущий DrcGain Clip, [0,64]. |
| Strength | Детализация светов HiLight текущего кадра, [0,1]. |
| CompressMode | Текущий режим CompressSetting. |
| LocalWeit | Текущий вес Local, [0,1]: 0 — Global, 1 — полностью Local, по умолчанию 0. |
| LocalAutoEnable | Переключатель автоматического LocalWeit, [0,1], по умолчанию 1, точность 1. |
| LocalAutoWeit | Автоматический LocalWeit, [0,1], по умолчанию 0.4, точность 0.01. |
| GlobalContrast | Глобальный контраст текущего кадра, [0,1], по умолчанию 0, точность 0.01. |
| LoLitContrast | Контраст тёмной области (исходное low volume), [0,1], по умолчанию 0, точность 0.01. |

<!-- Source EN PDF p.421; unit 4575 -->

#### 11.2.7 NR и резкость

<!-- Source EN PDF p.421; unit 4576 -->

11.2.7.1 Настройка

<!-- Source EN PDF p.421; unit 4577 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| error | Включено по умолчанию: покадровый вывод критических ошибок, способных вызвать сбой программы. События не используются; рекомендуется включить. |

<!-- Source EN PDF p.422; unit 4578 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Информация (Info) | По умолчанию выключено: все вызовы функций без регистров, большой объём данных. События не используются. При нормальном изображении без ошибок включать не рекомендуется; обычно регистры печатают командой io. |
| debug | По умолчанию выключено. Дополнительно к Info — все вызовы с большим объёмом регистров. События не используются. Включать при серьёзном дефекте изображения для отладки RK. |

<!-- Source EN PDF p.422; unit 4579 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.422; unit 4580 -->

11.2.7.2 Интерпретация журнала

<!-- Source EN PDF p.422; unit 4581 -->

#### 11.2.8 Dhz&Ehz

<!-- Source EN PDF p.422; unit 4582 -->

11.2.8.1 Настройка

<!-- Source EN PDF p.422; unit 4583 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Информация (Info) | По умолчанию выключено; покадровые данные и события не используются, рекомендация отсутствует. |
| debug | По умолчанию выключено; дополнительно к Info — отладка DHZ &amp; Ehz; события и рекомендации пусты. |

<!-- Source EN PDF p.423; unit 4584 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Подробно (Verbose) | По умолчанию выключено; исходник указывает дополнение к Verbose, но покадровые данные и события не используются, рекомендация пуста. |

<!-- Source EN PDF p.423; unit 4585 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.423; unit 4586 -->

11.2.8.2 Интерпретация журнала

<!-- Source EN PDF p.423; unit 4587 -->

При включённом Enhance уровень Dehaze — 2000ff3.

<!-- Source EN PDF p.423; unit 4588 -->

![Технический рисунок английского оригинала — PDF p.423](/docs/rockchip-isp30-development/assets/en-p423-X2168.png)

<!-- Source EN PDF p.423; unit 4589 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| byPassProc | Обход текущего кадра: 0 — выключен, 1 — включён. |
| ISO | ISO |
| Включение модуля Dehaze | Переключатель модуля Dehaze |
| Включение Dehaze | Переключатель удаления дымки |
| Включение Enhance | Переключатель улучшения изображения |
| Включение Hist | Переключатель функции Hist. |
| EnvLv | Яркость среды текущего кадра. |
| enhance_value | Общая сила контраста кадра, [0,16], рекомендуется [1,2]. |
| enhance_chroma | Параметр улучшения цветности текущего кадра, [0,16], рекомендуется [1,2]. |
| enhance_value_reg | Значение reg общей силы контраста текущего кадра. |
| enhance_chroma_reg | Значение REG параметра улучшения цветности текущего кадра. |

<!-- Source EN PDF p.423; unit 4590 -->

При включённом Dehaze и cfg_alpha=0 уровень — 2000ff3.

<!-- Source EN PDF p.424; unit 4591 -->

![Технический рисунок английского оригинала — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2172.png)

<!-- Source EN PDF p.424; unit 4592 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| byPassProc | Обход текущего кадра: 0 — выключен, 1 — включён. |
| ISO | ISO |
| Включение модуля Dehaze | Переключатель модуля Dehaze |
| Включение Dehaze | Переключатель удаления дымки |
| Включение Enhance | Переключатель улучшения изображения |
| Включение Hist | Переключатель функции Hist. |
| cfg_alpha | Доля программной конфигурации, [0,1], по умолчанию 1, точность 0.01. |
| EnvLv | Яркость среды текущего кадра. |
| air_max | Верхний предел адаптации AIR, [230,250], по умолчанию 250. |
| air_min | Нижний предел адаптации AIR: исходный диапазон [230,250], значение по умолчанию 200; противоречие сохранено. |
| tmax_base | База адаптации tmax, по умолчанию 125. Соответствия: 200(131), 210(125), 220(119), 230(114), 240(109), 250(105); рекомендуется 131-105. |
| wt_max | Верхний предел адаптации wt, [0.75,0.9], по умолчанию 0.9. |

<!-- Source EN PDF p.424; unit 4593 -->

При включённом Dehaze и cfg_alpha=1 уровень — 2000ff3.

<!-- Source EN PDF p.424; unit 4594 -->

![Технический рисунок английского оригинала — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2173.png)

<!-- Source EN PDF p.425; unit 4595 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| byPassProc | Обход текущего кадра: 0 — выключен, 1 — включён. |
| ISO | ISO |
| Включение модуля Dehaze | Переключатель модуля Dehaze |
| Включение Dehaze | Переключатель удаления дымки |
| Включение Enhance | Переключатель улучшения изображения |
| Включение Hist | Переключатель функции Hist. |
| cfg_alpha | Доля программной конфигурации, [0,1], по умолчанию 1, точность 0.01. |
| EnvLv | Яркость среды текущего кадра. |
| cfg_air | Программный air, коэффициент атмосферного света, [0,255], по умолчанию 210. |
| cfg_tmax | Программный tmax, максимум удаления дымки, [0,1], по умолчанию 0.2. |
| cfg_wt | Программная сила удаления дымки wt, [0,1], по умолчанию 0.8. |

<!-- Source EN PDF p.425; unit 4596 -->

При включённом Hist уровень Dehaze — 2000ff3.

<!-- Source EN PDF p.425; unit 4597 -->

![Технический рисунок английского оригинала — PDF p.425](/docs/rockchip-isp30-development/assets/en-p425-X2176.png)

<!-- Source EN PDF p.426; unit 4598 -->

| Название | Описание |
|---|---|
| FrameID | Номер кадра |
| byPassProc | Обход текущего кадра: 0 — выключен, 1 — включён. |
| ISO | ISO |
| Включение модуля Dehaze | Переключатель модуля Dehaze |
| Включение Dehaze | Переключатель удаления дымки |
| Включение Enhance | Переключатель улучшения изображения |
| Включение Hist | Переключатель функции Hist. |
| cfg_alpha | Доля программной конфигурации, [0,1], по умолчанию 1, точность 0.01. |
| EnvLv | Яркость среды текущего кадра. |
| hist_para_en | Включение растяжения гистограммы текущего кадра. |
| hist_gratio | Коэффициент растяжения и управления выравниванием гистограммы, [0,32]. |
| hist_th_off | Порог статистики гистограммы, [0,255], по умолчанию 64. |
| hist_k | Множитель адаптивного порога гистограммы, [0,7), по умолчанию 2. |
| hist_min | Минимальный порог статистики гистограммы, [0,2], по умолчанию 0.016. |
| hist_scale | Коэффициент выравнивания гистограммы, [0,32]. |
| cfg_gratio | Программные коэффициенты растяжения и выравнивания гистограммы, [0,32]. |

<!-- Source EN PDF p.426; unit 4599 -->

#### 11.2.9  CamHW

<!-- Source EN PDF p.426; unit 4600 -->

11.2.9.1 Настройка

<!-- Source EN PDF p.426; unit 4601 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Ошибка (Error) | Включено по умолчанию, критические ошибки. |
| Предупреждение (Warning) | По умолчанию выключено: предупреждения об ошибках, возможно обрабатываемых алгоритмом. |

<!-- Source EN PDF p.427; unit 4602 -->

| Уровень журнала | Описание и рекомендации включения |
|---|---|
| Информация (Info) | По умолчанию выключено: базовая отладка, покадровые сведения, события и рекомендации пусты. |
| Отладка (Debug) | По умолчанию выключено: дополнение к Info, покадровые сведения, события и рекомендации пусты. |
| Подробно (Verbose) | По умолчанию выключено: дополнение к Debug, покадровые сведения и события пусты. Возможен большой объём единовременного вывода; используйте осторожно. |
| Low1 | По умолчанию выключено: дополнение к Debug; покадровые сведения пусты, события показывают путь вызовов функций, рекомендация отсутствует. |

<!-- Source EN PDF p.428; unit 4603 -->

| Бит подмодуля | Описание и рекомендации включения |
|---|---|
| bit[4] | Журнал подмодуля 30, управляющего процессом HWI; рекомендуется включать вместе с перечисленными ниже. |
| bit[5] | Журналы Isp30Params и Isp30PollThread обрабатывают параметры ISP, потоки и события. Полезны при несовпадении параметров с кадрами, ошибках времени и обрывах офлайнового потока обратного чтения. |
| bit[6] | SensorHw относится к sensor; используется при подозрениях на настройки экспозиции CIS. |
| bit[7] | FlashLight относится к подсветке и используется при проблемах её управления. |
| bit[8] | LensHw относится к двигателям объектива и используется при проблемах их управления. |
| bit[9] | Переключатель 30SpThread, зарезервирован для внутренних модулей. |
| bit[10:11] | void |

<!-- Source EN PDF p.428; unit 4604 -->

11.2.9.2 Интерпретация журнала

<!-- Source EN PDF p.428; unit 4605 -->

Подмодуль CamHwIsp20

<!-- Source EN PDF p.428; unit 4606 -->

![Технический рисунок английского оригинала — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2185.png)

<!-- Source EN PDF p.428; unit 4607 -->

Этот LOG печатается один раз при загрузке AIQ и показывает связи sensor, ISP и ISPP по топологии media; позволяет проверить обнаружение sensor.

<!-- Source EN PDF p.428; unit 4608 -->

![Технический рисунок английского оригинала — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2186.png)

<!-- Source EN PDF p.429; unit 4609 -->

LOG выше показывает новые параметры HWI для драйвера ISP, передаваемые практически каждый кадр. Поля:

<!-- Source EN PDF p.429; unit 4610 -->

| Имя поля | Описание |
|---|---|
| ispparam ens | Биты включения модулей; определения см. HWI/ISP20/rk_isp20_hw.H. |
| en_up | Биты обновления включения: 1 означает необходимость обновить состояние модуля. |
| cfg_up | Биты обновления параметров: 1 означает необходимость обновления. |
| device | Узел video модуля параметров ISP. |

<!-- Source EN PDF p.429; unit 4611 -->

![Технический рисунок английского оригинала — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2190.png)

<!-- Source EN PDF p.429; unit 4612 -->

LOG показывает новые параметры HWI для ISPP, также практически каждый кадр; значения полей аналогичны ISP выше.

<!-- Source EN PDF p.429; unit 4613 -->

Подмодуль Isp20PollThread

<!-- Source EN PDF p.429; unit 4614 -->

![Технический рисунок английского оригинала — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2191.png)

<!-- Source EN PDF p.429; unit 4615 -->

LOG выводится при запуске обратного чтения кадра и печатается каждый кадр нормальной работы этого режима. Значения:

<!-- Source EN PDF p.429; unit 4616 -->

| Имя поля | Описание |
|---|---|
| frame | ID кадра RAW, начиная с 0. |
| sof_ts | Временная метка SOF кадра. |
| frame_ts | Метка завершения захвата в DDR. |
| readback | Количество обратных чтений ISP. |

<!-- Source EN PDF p.429; unit 4617 -->

![Технический рисунок английского оригинала — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2192.png)

<!-- Source EN PDF p.429; unit 4618 -->

LOG показывает оборот RAW buf в режиме обратного чтения и печатается каждый кадр:

<!-- Source EN PDF p.430; unit 4619 -->

| Члены | Описание |
|---|---|
| handle_rx_buf | После обработки кадра ISP буфер возвращается VICAP/isp_tx. |
| dev_index | Индекс устройства длинного, среднего или короткого кадра; одинаковый dev_index в handle_tx_buf и handle_rx_buf обозначает одни данные. |
| sequence | Номер кадра, начиная с 0. |

<!-- Source EN PDF p.430; unit 4620 -->

Подмодуль SensorHw

<!-- Source EN PDF p.430; unit 4621 -->

![Технический рисунок английского оригинала — PDF p.430](/docs/rockchip-isp30-development/assets/en-p430-X2195.png)

<!-- Source EN PDF p.430; unit 4622 -->

LOG показывает передачу новой линейной экспозиции драйверу sensor при её появлении. Поля:

<!-- Source EN PDF p.430; unit 4623 -->

| Члены | Описание |
|---|---|
| frameid | Номер кадра события SOF. |
| handle_sof | Обратный вызов SOF один раз за кадр, обрабатывающий настройки экспозиции. |
| Размер exp_list | Число новых выдержек списка, ещё не переданных драйверу. |
| Размер gain_list | Число новых усилений списка, ещё не переданных драйверу. |
| working_mode | Текущий режим: 0 — normal. |
| set_time | Есть ли в SOF новая выдержка для передачи драйверу. |
| set_gain | Есть ли в SOF новое усиление для передачи драйверу. |
| a-gain, time | Новые регистровые значения выдержки и усиления. |

<!-- Source EN PDF p.430; unit 4624 -->

### 11.3 Получение изображений Raw/YUV

<!-- Source EN PDF p.430; unit 4625 -->

Raw — выход CIS без обработки изображения. Для Bayer raw sensor это данные Bayer RGB 8/12/14 bit. Обычно CIS Raw получают в следующих случаях:

<!-- Source EN PDF p.430; unit 4626 -->

1\. При неверном YUV после ISP можно динамически перехватить входящий Raw, чтобы проверить, связана ли проблема с CIS.

2\. Перед настройкой качества изображения собирают CIS Raw для калибровки параметров модулей.

<!-- Source EN PDF p.431; unit 4627 -->

#### 11.3.1 Хранение Raw

<!-- Source EN PDF p.431; unit 4628 -->

11.3.1.1 Неупакованный формат

<!-- Source EN PDF p.431; unit 4629 -->

Размещение raw12 на примере фрагмента памяти 4 байта:

<!-- Source EN PDF p.431; unit 4630 -->

![Технический рисунок английского оригинала — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2199.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Биты слова памяти | Pixel | Биты пикселя |
|---|---|---|
| 31:20 | Pixel 0 | 11:0 |
| 19:16 | Pixel 0 | - - - - |
| 15:4 | Pixel 1 | 11:0 |
| 3:0 | Pixel 1 | - - - - |

<!-- Source EN PDF p.431; unit 4631 -->

11.3.1.2 Упакованный формат

<!-- Source EN PDF p.431; unit 4632 -->

Размещение raw12 на примере фрагмента памяти 4 байта:

<!-- Source EN PDF p.431; unit 4633 -->

![Технический рисунок английского оригинала — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2200.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Биты слова памяти | Pixel | Биты пикселя |
|---|---|---|
| 31:24 | Pixel3 | 7:0 |
| 23:12 | Pixel2 | 11:0 |
| 11:0 | Pixel1 | 11:0 |

<!-- Source EN PDF p.431; unit 4634 -->

11.3.1.3 RK-RAW V1.0

<!-- Source EN PDF p.431; unit 4635 -->

![Технический рисунок английского оригинала — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2201.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Имя параметра | Тип | Длина (Byte) | Описание |
|---|---|---|---|
| Identifier | unsigned short | 2 | Фиксировано 0x8080 |
| Header length | unsigned short | 2 | Фиксировано 128 |
| Frame index | unsigned int | 4 | Индекс кадра |
| Width | unsigned short | 2 | Ширина изображения |
| Height | unsigned short | 2 | Высота изображения |
| Bit depth | unsigned char | 1 | Разрядность изображения |
| Bayer format | unsigned char | 1 | 0: BGGR; 1: GBRG; 2: GRBG; 3: RGGB |
| Number of HDR Frame | unsigned char | 1 | 1: линейный, короткий; 2: HDR2, длинный+короткий; 3: HDR3, длинный+средний+короткий |
| Current Frame type | unsigned char | 1 | 1 короткий; 2 средний; 3 длинный |
| Storage type | unsigned char | 1 | 0 упакованный; 1 неупакованный |
| Line stride | unsigned short | 2 | Байты |
| Effective line stride | unsigned short | 2 | Байты |
| Reserved | unsigned char | 107 | Резерв |
| RAW DATA | RAW | W * H * BPP | RAW DATA |

<!-- Source EN PDF p.432; unit 4636 -->

11.3.1.4 RK-RAW V2.0

<!-- Source EN PDF p.432; unit 4637 -->

RK-RAW V2.0 состоит из начального идентификатора, блоков данных и конечного идентификатора.

<!-- Source EN PDF p.432; unit 4638 -->

Определение блока формата

<!-- Source EN PDF p.432; unit 4639 -->

Блок состоит из ID, длины и данных; каждый ID имеет уникальное фиксированное значение.

<!-- Source EN PDF p.432; unit 4640 -->

![Технический рисунок английского оригинала — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2208.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | По умолчанию | Описание |
|---|---|---|---|---|
| Начальный идентификатор | u16 | 2 | 0xFF00 | Начало файла |
| ID блока | u16 | 2 | 0xFF01 | Сведения Raw |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF02 | Raw линейного режима |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF03 | Raw короткого кадра HDR2/HDR3 |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF04 | Raw длинного HDR2/среднего HDR3 |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF05 | Raw длинного HDR3 |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF06 | Статистика кадра |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF07 | Формат регистров ISP |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF08 | Регистры ISP |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF09 | Формат регистров ISPP |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF0a | Регистры ISPP |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ID блока | u16 | 2 | 0xFF0b | Сведения о платформе |
| Длина блока | u32 | 4 | - |  |
| Данные блока |  |  |  |  |
| ... |  |  |  |  |
| Конечный идентификатор | u16 | 2 | 0x00FF | Конец файла |

<!-- Source EN PDF p.432; unit 4641 -->

Не все блоки обязательны, их можно комбинировать. Исходник предлагает минимум три блока, называя их «Raw Blocks», «Raw Blocks» и «Frame Statistics Blocks», и считает такую комбинацию осмысленной. Повтор имени сохранён без догадочной замены.

<!-- Source EN PDF p.432; unit 4642 -->

Определение блока Raw

<!-- Source EN PDF p.432; unit 4643 -->

![Технический рисунок английского оригинала — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2209.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | По умолчанию | Описание |
|---|---|---|---|---|
| Версия | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Имя Sensor | string | 32 | - | Модель Sensor |
| Сцена/свет | string | 32 | - | Сцена/источник света |
| Номер кадра | u32 | 4 | - | Номер кадра |
| Ширина | u16 | 2 | - | Ширина в пикселях |
| Высота | u16 | 2 | - | Высота в пикселях |
| Разрядность | u8 | 1 | - | Разрядность изображения |
| Формат Bayer | u8 | 1 | - | 0 BGGR; 1 GBRG; 2 GRBG; 3 RGGB |
| Кадры HDR | u8 | 1 | - | 1 линейный; 2 длинный+короткий; 3 длинный+средний+короткий |
| Формат хранения | u8 | 1 | - | 0 упакованный; 1 неупакованный |
| Шаг строки | u16 | 2 | - | Байты |
| Эффективный шаг | u16 | 2 | - | Байты |
| Порядок байтов | u8 | 1 | - | 0 big-endian; 1 little-endian |

<!-- Source EN PDF p.432; unit 4644 -->

Определение блока RAW

<!-- Source EN PDF p.433; unit 4645 -->

Сегмент хранит изображение Raw либо buffer fd/виртуальный адрес данных. При вызове API укажите тип содержимого параметром; см. rk_aiq_rawbuf_type_t.

<!-- Source EN PDF p.433; unit 4646 -->

![Технический рисунок английского оригинала — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2213.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | Описание |
|---|---|---|---|
| Данные Raw | - | высота*ширина*N; неупакованный N=2; упакованный N=bpp/8 | Raw, 0xFF02–0xFF05 |

<!-- Source EN PDF p.433; unit 4647 -->

Определение блока статистики кадра

<!-- Source EN PDF p.433; unit 4648 -->

![Технический рисунок английского оригинала — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2214.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | По умолчанию | Описание |
|---|---|---|---|---|
| Версия | u16 | 2 | 0x0200 | Raw: 0x0200=v2.0 |
| Номер кадра | u32 | 4 | - | Номер кадра |
| Normal_Exp | float | 4 | - | Выдержка линейного режима |
| Normal_Gain | float | 4 | - | Усиление линейного режима |
| Normal_Exp_REG | u32 | 4 | - | Регистр выдержки SENSOR линейного режима |
| Normal_Gain_REG | u32 | 4 | - | Регистр усиления SENSOR линейного режима |
| HDR_Exp_L | float | 4 | - | Выдержка длинного кадра HDR3 |
| HDR_Gain_L | float | 4 | - | Усиление длинного HDR3 |
| HDR_Exp_L_REG | u32 | 4 | - | Регистр выдержки длинного HDR3 |
| HDR_Gain_L_REG | u32 | 4 | - | Регистр усиления длинного HDR3 |
| HDR_Exp_M | float | 4 | - | Выдержка среднего HDR3/длинного HDR2 |
| HDR_Gain_M | float | 4 | - | Усиление среднего HDR3/длинного HDR2 |
| HDR_Exp_M_REG | u32 | 4 | - | Регистр выдержки среднего HDR3/длинного HDR2 |
| HDR_Gain_M_REG | u32 | 4 | - | Регистр выдержки среднего HDR3/длинного HDR2 (так в оригинале; имя Gain противоречит описанию, проверить) |
| HDR_Exp_S | float | 4 | - | Выдержка короткого HDR3/HDR2 |
| HDR_Gain_S | float | 4 | - | Усиление короткого HDR3/HDR2 |
| HDR_Exp_S_REG | u32 | 4 | - | Регистр выдержки короткого HDR3/HDR2 |
| HDR_Gain_S_REG | u32 | 4 | - | Регистр выдержки короткого HDR3/HDR2 (так в оригинале; имя Gain противоречит описанию, проверить) |
| AWB_Rgain | float | 4 | - | Усиление WB |
| AWB_Bgain | float | 4 | - | Усиление WB |

<!-- Source EN PDF p.433; unit 4649 -->

Определение блока формата регистров

<!-- Source EN PDF p.433; unit 4650 -->

![Технический рисунок английского оригинала — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2215.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | По умолчанию | Описание |
|---|---|---|---|---|
| Версия | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Номер кадра | u32 | 4 | - | Базовый адрес регистров (так в рисунке) |
| Базовый адрес | u32 | 4 | - | Базовый адрес регистров |
| Адрес смещения | u32 | 4 | - | Начальный адрес смещения |
| Количество | u32 | 4 | - | Число регистров |

<!-- Source EN PDF p.433; unit 4651 -->

Определение блока регистров

<!-- Source EN PDF p.433; unit 4652 -->

![Технический рисунок английского оригинала — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2216.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | Описание |
|---|---|---|---|
| Данные регистров | - | - | Данные регистров, 0xFF08/0xFF0a |

<!-- Source EN PDF p.433; unit 4653 -->

Определение блока сведений о платформе

<!-- Source EN PDF p.433; unit 4654 -->

![Технический рисунок английского оригинала — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2217.png)

Редактируемая расшифровка (в оригинальном рисунке уже есть китайские подписи):

| Элемент | Тип | Длина (Byte) | Описание |
|---|---|---|---|
| Модель чипа | string | 32 |  |
| Версия ISP | string | 32 |  |
| Версия AIQ | string | 32 |  |

<!-- Source EN PDF p.434; unit 4655 -->

#### 11.3.2 Получение данных Raw/YUV

<!-- Source EN PDF p.435; unit 4656 -->

## 12. Коды ошибок

<!-- Source EN PDF p.435; unit 4657 -->

| Код ошибки | Описание |
|---|---|
| 0 | Успешно |
| -1 | Ошибка |
| -2 | Неверный параметр |
| -3 | Недостаточно памяти |
| -4 | Ошибка файловой операции |
| -5 | Ошибка модуля анализатора |
| -6 | Ошибка модуля ISP |
| -7 | Ошибка драйвера sensor |
| -8 | Ошибка операции с потоком |
| -9 | Ошибка операции IOCTL |
| -10 | Ошибка временной последовательности |
| -20 | Тайм-аут |
| -21 | Выход за диапазон |
| -255 | Неизвестная ошибка |

<!-- Source EN PDF p.436; unit 4658 -->

## 13.   Abbreviations

<!-- Source EN PDF p.436; unit 4659 -->

| Сокращение | Полное название |
|---|---|
| CIS | Сенсор изображения камеры (Camera Image Sensor) |
| RkAiq | Автоматическое качество изображения Rockchip (Rockchip Automatical Image Quality, написание исходника) |
| ISP | Обработка сигнала изображения (Image Signal Process, исходное название) |
| Настройка IQ | Настройка качества изображения |

{% endraw %}
