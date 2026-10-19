---
title: "Драйвер Rockchip ISP30 VI V1.1.5: сенсоры, VICAP и отладка камер"
description: "Полное руководство V1.1.5: многокамерные тракты RK3588, драйверы CIS и объективов, хранение RAW, сброс VICAP, диагностика экспозиции и пять приложений."
translation_key: "079-rockchip-isp30-vi-driver"
slug: "079-rockchip-isp30-vi-driver"
lang: "ru"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "VI", "VICAP", "Camera", "Linux"]
keywords: "ArmSoM Rockchip ISP30 VI RK3588 VICAP camera driver"
excerpt: "Полное руководство V1.1.5: многокамерные тракты RK3588, драйверы CIS и объективов, хранение RAW, сброс VICAP, диагностика экспозиции и пять приложений."
---

{% raw %}

# Драйвер Rockchip ISP30 VI V1.1.5: сенсоры, VICAP и отладка камер

## Применимость к ArmSoM и источник

Это справочный материал по платформе Rockchip, а не отчёт об испытаниях ArmSoM. Источник: **Rockchip_Driver_Guide_VI_EN_v1.1.5.pdf**, V1.1.5, 230 страниц PDF (последняя пустая). Китайский PDF не предоставлен. Китайская и русская версии полностью переводят английский источник; все три используют его оригинальные английские рисунки. Измерения, команды и журналы — примеры источника. Аппаратная проверка конкретных плат не выполнялась.

Таблица продукта и матрица применимости источника имеют разный охват; обе сохранены ниже. Текст также рассматривает RK3588/RK3588S и RV1106. Официальная документация подтверждает RK3588 и применение камер у ArmSoM Sige7, но не совместимость старого SDK, драйверов ядра или API этого документа. Перед адаптацией проверьте плату/SoC, SDK/BSP и соответствующее ядро 4.19/5.10, сенсор, разводку lanes, питание, тактирование, DTS, тракт ISP/VICAP и версии IQ/AIQ.

Издание V1.1.5 не заменяет имеющуюся статью V1.0.7. Новая глава 8 CIS и повторная глава 10 CIS сохранены полностью вместе с различиями. Расхождения ограничений RK356x, написания узлов, описаний сброса и формул экспозиции отмечены, а не исправлены молча. Оптимизация памяти, IOMMU и частот требует проверки на целевой платформе.

[Редакционные замечания](/docs/rockchip-isp30-vi-driver/EDITORIAL-NOTES.md) · [Предыдущая V1.0.7](/ru/articles/074-rockchip-vi-driver/) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [Официальное начало работы Sige](https://docs.armsom.org/sige-family-started)

### Область применимости оригинала (страница 2)

| Микросхема | Ядро |
| --- | --- |
| RV1126/RV1109 | Linux 4.19 |

| Микросхема | Система | Поддержка |
| --- | --- | --- |
| RV1126 | Linux Kernel-4.19 / Kernel-5.10 | Y |
| RV1109 | Linux Kernel-4.19 / Kernel-5.10 | Y |
| RK3566 | Linux Kernel-5.10 | Y |
| RK3568 | Linux Kernel-5.10 | Y |
| RK3562 | Linux Kernel-5.10 | Y |

## 1. Различия VI между микросхемами

<!-- Source: English PDF p8, table unit 1 -->

| SOC | VI IP | Интерфейс VI | Максимальное разрешение Bayer CIS | Возможности |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 3072x2048 | HDR до 3 кадров |
| RK3566 | ISP21 Lite: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x2304 | Без HDR |
| RK3568 | ISP21: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x2304 | HDR до 2 кадров |
| RV1126 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4416x3312 | HDR до 3 кадров |
| RK3588 | VICAP：1 ISP30：2 FEC：2 | MIPI DPHY: 4 x 2Lanes или 2 x 4Lanes, 2.5Gbps/Lane; MIPI DCPHY: 2 x 4Lanes dphy или 2 x 3Lanes cphy, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120, pclk: 150MHz | 4672x3504 один ISP; 8192x6144 объединение двух ISP | HDR до 3 кадров |

<!-- Source: English PDF p9, table unit 2 -->

| SOC | VI IP | Интерфейс VI | Максимальное разрешение Bayer CIS | Возможности |
| --- | --- | --- | --- | --- |
| RK3588S | VICAP：1 ISP30：2 FEC：2 | MIPI DPHY: 2 x 2Lanes или 1 x 4Lanes, 2.5Gbps/Lane; MIPI DCPHY: 2 x 4Lanes dphy или 2 x 3Lanes cphy, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120, pclk: 150MHz | 4672x3504 один ISP; 8192x6144 объединение двух ISP | HDR до 3 кадров |
| RV1106 | VICAP：1 ISP32：1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 3072x1728 | HDR до 2 кадров |
| RK3562 | VICAP：1 ISP32_LITE：1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4224x3136 | HDR до 2 кадров |

## 2. Структура каталогов драйверов камеры

Linux Kernel-4.19

<p style="white-space:pre-wrap">|-- arch/arm/boot/dts файлы конфигурации DTS</p>

<p style="white-space:pre-wrap">|-- drivers/phy/rockchip</p>

<p style="white-space:pre-wrap">     |-- phy-rockchip-mipi-rx.c драйвер MIPI DPHY</p>

<p style="white-space:pre-wrap">      |-- phy-rockchip-csi2-dphy-common.h</p>

<p style="white-space:pre-wrap">      |-- phy-rockchip-csi2-dphy-hw.c</p>

<p style="white-space:pre-wrap">      |-- phy-rockchip-csi2-dphy.c</p>

<p style="white-space:pre-wrap">|-- drivers/media</p>

<p style="white-space:pre-wrap">      |-- platform/rockchip/cif</p>

<p style="white-space:pre-wrap">      |-- platform/rockchip/isp</p>

<p style="white-space:pre-wrap">|-- dev включает probe, асинхронную регистрацию, тактирование, pipeline, iommu и media/v4l2</p>

<p style="white-space:pre-wrap">            |-- capture: настройка mp/sp/rawwr и vb2, обработка кадровых прерываний</p>

<p style="white-space:pre-wrap">            |-- dmarx: настройка rawrd и vb2, обработка кадровых прерываний</p>

<p style="white-space:pre-wrap">            |-- isp_params: настройка параметров 3A</p>

<p style="white-space:pre-wrap">            |-- isp_stats: статистика 3A</p>

<p style="white-space:pre-wrap">            |-- isp_mipi_luma: статистика яркости данных MIPI</p>

<p style="white-space:pre-wrap">            |-- regs: операции чтения и записи регистров</p>

<p style="white-space:pre-wrap">            |-- rkisp: регистрация subdev и entity ISP</p>

<p style="white-space:pre-wrap">            |-- csi: subdev CSI и настройка MIPI</p>

<p style="white-space:pre-wrap">            |-- bridge: subdev моста для взаимодействия ISP и ISPP</p>

<p style="white-space:pre-wrap">      |-- platform/rockchip/ispp</p>

<p style="white-space:pre-wrap">|-- dev включает probe, асинхронную регистрацию, тактирование, pipeline, iommu и media/v4l2</p>

<p style="white-space:pre-wrap">            |-- stream: настройка четырёх видеовыходов и vb2, обработка кадровых прерываний</p>

<p style="white-space:pre-wrap">            |-- rkispp: регистрация subdev и entity ISPP</p>

<p style="white-space:pre-wrap">            |-- params: настройка параметров TNR/NR/SHP/FEC/ORB</p>

<p style="white-space:pre-wrap">           |-- stats: статистика ORB</p>

<p style="white-space:pre-wrap">       |-- i2c</p>

<p style="white-space:pre-wrap">          |-- os04a10.c драйвер CIS (CMOS-сенсора изображения)</p>

## 3. Связь ISP и VICAP

На платформах RV1126/RV1109 и RK356X VICAP и ISP являются независимыми IP-блоками обработки изображений. Если изображения, захваченные VICAP, обрабатываются ISP, драйвер должен создать подустройство v4l2 для соответствующего интерфейса VICAP и связать его с узлом ISP, передавая параметры драйверу ISP. Описание ISP приведено в разделе «Драйвер RKISP», а VICAP — в разделе «Драйвер RKVICAP». Общая схема связей интерфейсов VICAP с ISP показана ниже:

![Топология соединений ISP и VICAP — английский оригинал, страница 10](/docs/rockchip-isp30-vi-driver/assets/en-p10-X243.jpg)

*Топология соединений ISP и VICAP — английский оригинал, страница 10*

## 4. Драйвер RKISP

### 4.1 Краткое описание фреймворка

Драйвер RKISP основан на v4l2/media и реализует настройку оборудования, обработку прерываний, управление сменой буферов, включение и выключение питания подустройств, например MIPI DPHY и сенсора.

Ниже показана топология драйвера RKISP:

![Топология драйвера RKISP — английский оригинал, страница 11](/docs/rockchip-isp30-vi-driver/assets/en-p11-X249.jpg)

*Топология драйвера RKISP — английский оригинал, страница 11*

<!-- Source: English PDF p12, table unit 40 -->

| Название | Тип | Описание |
| --- | --- | --- |
| rkisp_mainpath | v4l2_vdevcapture | Формат: YUV, RAW Bayer; поддержка: обрезка, масштабирование (кроме RAW) |
| rkisp_selfpath | v4l2_vdevcapture | Формат: YUV, RGB; поддержка: обрезка, масштабирование (кроме RAW) |
| rkisp-isp-subdev | v4l2_subdev | Внутренние блоки ISP; кадрирование source/sink pad. Формат и размер sink pad равны входу sensor. При выводе raw Bayer формат source pad равен формату vdev, иначе — YUYV2X8. Размер source pad не превышает sink pad. |
| rkisp-mipi-luma | v42_vdevcapture | Предоставляет яркость raw-изображения |
| rkisp-statistics | v4l2_vdevcapture | Предоставляет статистику цвета изображения |
| rkisp-input-params | v4l2_vdevoutput | Принимает параметры блоков улучшения AWB, BLC и других |
| rkisp_rawrd0_m | v4l2_vdevoutput | Читает raw из DDR в ISP, обычно средний кадр HDR |
| rkisp_rawrd1_l | v4l2_vdevoutput | Читает raw из DDR в ISP, обычно длинный кадр HDR |
| rkisp_rawrd2_s | v4l2_vdevoutput | Читает raw из DDR в ISP, обычно короткий кадр HDR |
| rkisp-csi-subdev | v4l2_subdev | Настройка MIPI CSI |
| rkisp_rawwr0 | v4l2_vdevcapture | Записывает raw sensor в DDR, обычно средний кадр HDR |
| rkisp_rawwr1 | v4l2_vdevcapture | Записывает raw sensor в DDR, обычно длинный кадр HDR |
| rkisp_rawwr2 | v4l2_vdevcapture | Записывает raw sensor в DDR, обычно короткий кадр HDR |
| rkisp_rawwr3 | v4l2_vdevcapture | Записывает raw sensor в DDR |
| rockchip-mipi-dphy-rx | v4l2_subdev | Настройка MIPI-DPHY |
| rkisp-bridge-ispp | v4l2_subdev | ISP передаёт YUV в ISPP |
| rkispp_input_image | v4l2_vdevoutput | Читает YUV из DDR в ISPP |
| rkisp-isp-subdev | v4l2_subdev | Формат и размер sink pad равны выходу ISP. Максимум 4416x3312, минимум 66x258. |
| rkispp_m_bypass | v4l2_vdev<br>capture | Полное разрешение, формат YUV |

<!-- Source: English PDF p13, table unit 41 -->

| Название | Тип | Описание |
| --- | --- | --- |
| rkispp_scale0 | v4l2_vdev<br>capture | Полное или уменьшенное разрешение, формат YUV; коэффициент масштабирования [1 8]; максимальная ширина 3264 для YUV422 и 2080 для YUV420; только rv1126 |
| rkispp_scale1 | v4l2_vdev<br>capture | Полное или уменьшенное разрешение, формат YUV; коэффициент масштабирования [2 8]; максимальная ширина 1280; только rv1126 |
| rkispp_scale2 | v4l2_vdev<br>capture | Полное или уменьшенное разрешение, формат YUV; коэффициент масштабирования [2 8]; максимальная ширина 1280; только rv1126 |

### 4.2 Режим HDR ISP

RKISP2 принимает трёхкадровый или двухкадровый HDR-поток сенсора MIPI. Аппаратура записывает данные в DDR через 3 или 2 канала dmatx, затем читает их в ISP через 3 или 2 канала dmarx; ISP объединяет три или два кадра. Цепочка драйверов показана ниже:

![Тракт трёхкадрового HDR — английский оригинал, страница 13](/docs/rockchip-isp30-vi-driver/assets/en-p13-X256.png)

*Тракт трёхкадрового HDR — английский оригинал, страница 13*

![Тракт двухкадрового HDR — английский оригинал, страница 13](/docs/rockchip-isp30-vi-driver/assets/en-p13-X257.png)

*Тракт двухкадрового HDR — английский оригинал, страница 13*

CSI subdev получает выходные параметры драйвера сенсора через get_fmt для нескольких форматов pad; им соответствуют source pad CSI.

Конкретная настройка драйвера сенсора MIPI описана в разделе «Этапы переноса драйвера».

<!-- Source: English PDF p14, table unit 48 -->

| Название | Название | Описание |
| --- | --- | --- |
| rkisp-isp-subdev | Sensor pad0 | ISP получает ширину, высоту и формат выхода sensor vc0 (по умолчанию), обычно в линейном режиме. |
| rkisp_rawwr0 | Sensor<br>pad1 | Rawwr0 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr1 | Sensor<br>pad2 | Rawwr1 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr2 | Sensor<br>pad3 | Rawwr2 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr3 | Sensor<br>pad4 | Rawwr3 получает ширину, высоту и формат выхода sensor vcX |

## 5. Драйвер RKVICAP

### 5.1 Описание фреймворка

Драйвер RKVICAP основан на v4l2/media и реализует настройку аппаратуры, обработку прерываний, управление сменой буферов и питанием подустройств, например MIPI DPHY и сенсора.

В RV1126/RV1109 VICAP имеет два IP-ядра: VICAP FULL и VICAP LITE. У VICAP FULL три интерфейса — dvp/mipi/lvds. Dvp может работать одновременно с mipi или lvds, но mipi и lvds взаимно исключаются. VICAP LITE имеет только lvds и может работать одновременно с VICAP FULL. Интерфейсу dvp VICAP FULL соответствует rkvicap_dvp, интерфейсам mipi/lvds — rkvicap_mipi_lvds, а VICAP LITE — rkvicap_lite_mipi_lvds. Каждый узел может захватывать данные независимо.

У RK356X VICAP имеет одно ядро с интерфейсами dvp и mipi. Интерфейсу dvp соответствует rkvicap_dvp, а mipi — rkvicap_mipi_lvds (имя совпадает с VICAP FULL в RV1126/RV1109). Каждый узел может захватывать данные независимо.

Для передачи захваченных VICAP данных драйверу ISP логический узел sditf, созданный VICAP, связывают с виртуальным устройством ISP. DVP соответствует rkvicap_dvp_sditf, mipi/lvds VICAP FULL — rkvicap_mipi_lvds_sditf, VICAP LITE — rkvicap_lite_sditf.

Способы связи интерфейсов в DTS приведены в разделе «Регистрация устройства CIS (DTS)».

Ниже показана топология устройств драйвера RKVICAP:

![Топология интерфейсов VICAP — английский оригинал, страница 15](/docs/rockchip-isp30-vi-driver/assets/en-p15-X267.jpg)

*Топология интерфейсов VICAP — английский оригинал, страница 15*

## 6. Структура VI RK3588

## 7. Аппаратная блок-схема

![Аппаратная схема VI RK3588 — английский оригинал, страница 16](/docs/rockchip-isp30-vi-driver/assets/en-p16-X270.png)

*Аппаратная схема VI RK3588 — английский оригинал, страница 16*

### 7.1 Поддержка нескольких сенсоров

Один аппаратный ISP поддерживает до четырёх каналов мультиплексирования со следующими разрешениями:

Два канала: максимальное разрешение 3840x2160; в DTS настраиваются два устройства rkisp_vir.

Три или четыре канала: максимальное разрешение 2560x1536; в DTS настраиваются три или четыре устройства rkisp_vir.

Аппаратура поддерживает захват максимум с 7 сенсоров: 6MIPI + 1DVP. Программные тракты показаны ниже:

![Тракты нескольких сенсоров RK3588 — английский оригинал, страница 16](/docs/rockchip-isp30-vi-driver/assets/en-p16-X271.png)

*Тракты нескольких сенсоров RK3588 — английский оригинал, страница 16*

Описание блок-схемы:

(1) RK3588 поддерживает два DCPHY: csi2_dcphy0/csi2_dcphy1. Каждый одновременно поддерживает RX/TX; RX используется для камер. Поддерживается мультиплексирование DPHY/CPHY. TX и RX одного DCPHY должны одновременно использовать либо DPHY, либо CPHY. Остальные параметры см. в datasheet RK3588.

(2) RK3588 имеет два аппаратных DPHY, здесь dphy0_hw/dphy1_hw. Оба поддерживают Full Mode и Split Mode.

- dphy0_hw: в Full Mode узел csi2_dphy0, до 4 lanes; в Split Mode разделяется на csi2_dphy1 (lanes 0/1) и csi2_dphy2 (lanes 2/3), каждый до 2 lanes. Для Full Mode настройте тракт как для csi2_dphy1, но замените имя узла на csi2_dphy0. ПО различает режим по номеру PHY.
- dphy1_hw: в Full Mode узел csi2_dphy3, до 4 lanes; в Split Mode — csi2_dphy4 (lanes 0/1) и csi2_dphy5 (lanes 2/3), каждый до 2 lanes. Full Mode настраивается как тракт csi2_dphy4, но имя меняется на csi2_dphy3; ПО различает режим по номеру PHY.

(3) Для этих MIPI PHY нужно настроить соответствующие физические узлы csi2_dcphy0_hw/csi2_dcphy1_hw/csi2_dphy0_hw/csi2_dphy1_hw.

(4) Каждому MIPI PHY нужен модуль CSI2 для разбора протокола MIPI: узлы mipi0_csi2~mipi5_csi2.

(5) Все данные камер RK3588 поступают в ISP через VICAP. Единственный аппаратный VICAP поддерживает одновременный вход 6 MIPI PHY и одного DVP. Он разделён на 7 узлов rkcif_mipi_lvds~rkcif_mipi_lvds5, rkcif_dvp и т. д. Привязки строго соответствуют номерам узлов блок-схемы.

(6) Связь каждого узла VICAP с ISP задаётся соответствующим виртуальным XXX_sditf.

(7) RK3588 имеет два ISP. Каждый виртуализирует несколько узлов; ПО по очереди читает изображения из DDR в ISP. Для нескольких камер рекомендуется равномерно распределять потоки между двумя ISP.

(8) Прямой проход и обратное чтение:

- Прямой проход: VICAP передаёт захваченные данные непосредственно ISP без DDR. В HDR только короткий кадр проходит напрямую; длинный хранится в DDR и читается ISP.
- Обратное чтение: VICAP записывает данные в DDR; приложение получает их и передаёт адрес буфера ISP, который читает изображение из DDR.
- При одном виртуальном узле DTS аппаратный ISP по умолчанию работает напрямую; при нескольких — через обратное чтение.

### 7.2 Объединение двух ISP для разрешения 8K

VICAP захватывает данные сенсора 8K, передаёт левую и правую части двум ISP, затем выводит результат в DDR. Последовательность показана ниже:

![Объединение 8K двумя ISP — английский оригинал, страница 18](/docs/rockchip-isp30-vi-driver/assets/en-p18-X281.png)

*Объединение 8K двумя ISP — английский оригинал, страница 18*

Если разрешение превышает 16M (4672x3504), для одного изображения одновременно используются два ISP; поддерживается только одна камера.

1\. В rk3588s.dtsi определены rkisp0, rkisp1 и rkisp_unite. Если обрабатываемое разрешение превышает 16M, отключите rkisp0 и rkisp1, включите rkisp_unite и измените соответствующий узел iommu.

2\. Узел rkisp_unite также позволяет создавать несколько виртуальных узлов. В этом случае независимо от разрешения одно изображение делится на левую и правую части, обрабатывается двумя ISP и объединяется в один выход.

3\. Пример конфигурации DTS (в оригинале ссылка ещё не добавлена).

### 7.3 Поддержка 8 сенсоров MIPI

Аппаратура RK3588 поддерживает до 6 сенсоров MIPI; число расширяется объединением через RK1608. RK1608 имеет 4 входа MIPI (1, 2, 4lane) и два выхода (1, 2, 4lane). Объединение 3 каналов через RK1608 и исходных 5 каналов MIPI даёт 8 входных сенсоров; соединение показано ниже:

![Подключение восьми MIPI-сенсоров через RK1608 — английский оригинал, страница 18](/docs/rockchip-isp30-vi-driver/assets/en-p18-X282.png)

*Подключение восьми MIPI-сенсоров через RK1608 — английский оригинал, страница 18*

В defconfig ядра необходимо включить драйвер RK1608:

```text
  CONFIG_VIDEO_ROCKCHIP_PREISP=y
  CONFIG_VIDEO_PREISP_DUMMY_SENSOR=y
```

В тракте DTS RK1608 представлен узлом RK1608 dphy и виртуальным входным сенсором preisp_dmy. Как обычный сенсор, RK1608 dphy подключается к dcphy RK3588, образуя тракт RK1608-&gt;dcphy-&gt;csi-&gt;cif lvds. Физические сенсоры RK1608 в DTS подключаются непосредственно к port0 узлов rkcif_mipi_lvdsx_sditf, rkcif_mipi_lvdsx_sditf_vir1, rkcif_mipi_lvdsx_sditf_vir2 и rkcif_mipi_lvdsx_sditf_vir3 как входы SDITF.

Выход SDITF соответствует исходному тракту и нужному узлу ISP. Тракт DTS показан ниже:

![Топология связей DTS RK1608 — английский оригинал, страница 19](/docs/rockchip-isp30-vi-driver/assets/en-p19-X288.png)

*Топология связей DTS RK1608 — английский оригинал, страница 19*

Основная конфигурация DTS RK1608 находится в узле rk1608-dpy и включает входные/выходные каналы и разрешение:

```text
  #define LINK_FREQ               700000000
      mipidphy0: mipidphy0 {
      compatible =  "rockchip,rk1608-dphy";
          status = "okay";
          //rockchip,grf = <&grf>;
          id = <0>;  //RK1608 internal ID (0-2, spliced sequentially by ID)
          cam_nums = <1>;
          in_mipi = <1>;         //Input MIPI channel of the first sensor (0-3)
          out_mipi = <0>;        //Output MIPI channel (0-1)
          link-freqs = /bits/ 64 <LINK_FREQ>; //MIPI rate
          sensor_i2c_bus = <5>;     //The 8-mesh pattern is invalid
          sensor_i2c_addr = <0x1a>; //The 8-mesh pattern is invalid
          sensor-name = "IMX464";
          rockchip,camera-module-index = <9>; //Same as ordinary sensor
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "TongJu";
          rockchip,camera-module-lens-name = "CHT842-MD";
          /* virtual-sensor mode */
          virtual-sub-sensor-config-0 {  //Configuration information for the second
  sensor
              id = <1>;  //RK1608 internal ID (0-2, spliced by ID)
              in_mipi = <2>;
              out_mipi = <1>;
          };
          virtual-sub-sensor-config-1 { //Configuration information for the third
  sensor
              id = <2>;  //RK1608 internal ID (0-2, spliced by ID)
              in_mipi = <3>;
              out_mipi = <1>;
          };
          /* multi-sensor mode end */
          format-config-0 {
              data_type = <0x2b>;
              mipi_lane = <2>;     //The number of lanes connected to the sensor
              mipi_lane_out = <4>; //The number of lanes output by RK1608
              field = <1>;      //The following is the same as the normal sensor
  configuration
              colorspace = <8>;
              code = <MEDIA_BUS_FMT_SRGGB10_1X10>;
              width = <2712>;  //Sensor output resolution
              height= <1538>;
              hactive = <2712>; //RK1608 output resolution, the same width, height
  is n*sensor
              vactive = <4614>;
              htotal = <3616>; //After increasing the width and height of blank,
  30% of the blank is generally required
              vtotal = <4710>;
              inch0-info = <2712 1538 0x2b 0x2b 1>; //Sensor output resolution
              outch0-info = <2712 4614 0x2b 0x2b 1>; //RK1608 output resolution
              hcrop = <2560>; //Single resolution after cropping
              vcrop = <1520>;
          };
          ...
```

Пример DTS сенсора:

```text
  &rkcif_mipi_lvds_sditf {
      #address-cells = <1>;
      #size-cells = <0>;
      status = "okay";
      rockchip,combine-index = <0>; //Order in RK1608 stitching diagram
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_lvds_sditf_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&imx464_out7>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_lvds_sditf: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&isp0_vir0>;
              };
          };
      };
  };
```

## 8. Драйвер CIS (CMOS-сенсор изображения)

### 8.1 Регистрация устройства CIS (DTS)

#### 8.1.1 Интерфейс MIPI

На платформах RV1126 и RV1106 имеются два независимых полноценных физических MIPI CSI2 DPY, соответствующих csi_dphy0 и csi_dphy1 в DTS (см. RV1126.DTSI), со следующими свойствами:

До 4 линий данных.

Максимальная скорость 2.5Gbps/lane.

RK356X имеет один стандартный физический MIPI CSI2 dphy с режимами full и split и тремя логическими dphy: csi2_dphy0/csi2_dphy1/csi2_dphy2 (см. rk3568.dtsi). Свойства:

**Полный режим (Full mode)**

Используется только csi2_dphy0; он взаимоисключается с csi2_dphy1/csi2_dphy2 и не работает одновременно с ними.

До 4 линий данных.

Максимальная скорость 2.5Gbps/lane.

**Разделённый режим (Split mode)**

Используются только csi2_dphy1 и csi2_dphy2; они взаимоисключаются с csi2_dphy0.

csi2_dphy1 и csi2_dphy2 можно использовать одновременно;

csi2_dphy1 и csi2_dphy2 имеют максимум по 2 линии данных.

csi2_dphy1 соответствует lane0/lane1 физического DPY.

csi2_dphy2 соответствует Lane2/LANE3 физического DPY.

Максимальная скорость — 2.5Gbps/lane.

Конкретные примеры DTS приведены далее.

##### 8.1.1.1 Подключение к ISP

###### 8.1.1.1.1 RV1126/RV1106

Далее приведён пример RV1126 ISP и OS04A10.

**Связь: sensor-&gt;csi_dphy-&gt;isp-&gt;ispp**

arch/arm/boot/dts/rv1126-evb-v10.dtsi

**Основные настройки**

data-lanes должен задавать фактическое число линий, иначе интерфейс не распознаётся как MIPI.

```text
  cam_ircut0: cam_ircut {
      status = "okay";
      compatible = "rockchip,ircut";
      ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
      ircut-close-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
  };
  os04a10: os04a10@36 {
      compatible = "ovti,os04a10";// It needs to match the matching string in the
  driver
      reg = <0x36>;// sensor I2C device address, 7 bits
      clocks = <&cru CLK_MIPICSI_OUT>;// Sensor clickin configuration
      clock-names = "xvclk";
      power-domains = <&power RV1126_PD_VI>;
      pinctrl-names = "rockchip,camera_default";
      pinctrl-0 = <&mipi_csi_clk0>;// PINCTL settings
      //power supply
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // Power pin assignment and active level
      pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
      // Module number, which should not be repeated
      rockchip,camera-module-index = <1>;
      // Module orientation, with "back" and "front"
      rockchip,camera-module-facing = "front";
      // Module name
      rockchip,camera-module-name = "CMK-OT1607-FV1";
      // Lens name
      rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
      //IR CUT equipment
      ir-cut = <&cam_ircut0>;
      port {
          ucam_out0: endpoint {
              // The port name on the mipi dphy side
              remote-endpoint = <&mipi_in_ucam0>;
              // MIPI lanes number, 1 lane is <1>,
              4lane is <1 2 3 4 >
              data-lanes = <1 2 3 4>;
          };
      };
   };
  &csi_dphy0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  // MIPI lanes number, 1 lane is <1>, 4lane is
  <1 2 3 4 >,data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name on the ISP side
                  remote-endpoint = <&isp_in>;
              };
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  // The port name on the mipi dphy side
                  remote-endpoint = <&csidphy0_out>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_out: endpoint@1 {
                  reg = <1>;
                  // ISP port name, ISP output to ISP
                  remote-endpoint = <&ispp0_in>;
              };
          };
      };
  };
  &rkispp {
      status = "okay";
  };
  &rkispp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          Ispp0_in: endpoint@0 {
              reg = <0>;
              // ISP port name, ISPP input
              remote-endpoint = <&isp0_out>;
          };
      };
  };
```

###### 8.1.1.1.2 RK356X

Пример RK3566 ISP и GC8034 4LANE:

**Тракт: sensor-&gt;csi2_dphy0-&gt;isp. Основные настройки:**

Необходимо настроить data-lanes.

Необходимо включить узел csi2_dphy_hw.

```text
   /* full mode: lane0-3 */
      gc8034: gc8034@37 {
          // It needs to match the matching string in the driver
          compatible = "galaxycore,gc8034";
          status = "okay";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RK3568_PD_VI>;
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&cif_clk>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio4 RK_PB2 GPIO_ACTIVE_LOW>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "back";
          // Module name
          rockchip,camera-module-name = "RK-CMK-8M-2-v1";
          // Lens name
          rockchip,camera-module-lens-name = "CK8401";
          port {
              gc8034_out: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&dphy0_in>;
                  // CSI2 dphy lane number, 1lane is <1>,
                  4lane is <1 2 3 4>, data-lanes = <1 2 3 4>;
              };
          };
      };
      &csi2_dphy_hw {
         status = "okay";
      };
      &csi2_dphy0 {
          //csi2_dphy0 is not used at the same time as
          csi2_dphy1/csi2_dphy2, mutually exclusive
          status = "okay";
          /*
           * dphy0 only used for full mode,
           * full mode and split mode are mutually exclusive
           */
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_in: endpoint@1 {
                      reg = <1>;
                      // The port name on the sensor side
                      remote-endpoint = <&gc8034_out>;
                      // CSI2 dphy lanes, 1 lane is <1 >, 4 lanes is <1 2 3 4 >,
  which needs to be consistent with the sensor side
                          data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_out: endpoint@1 {
                      reg = <1>;
                      // The port name on the ISP side
                      remote-endpoint = <&isp0_in>;
                  };
              };
          };
      };
  &rkisp {
      status = "okay";
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              // The port name of the CSI2 dphy side
              remote-endpoint = <&dphy0_out>;
          };
      };
  };
```

##### 8.1.1.2 Подключение к VICAP

###### 8.1.1.2.1 RV1126/RV1109

Пример подключения MIPI OS04A10 4 Lanes к VICAP:

**Тракт: sensor-&gt;csi dphy-&gt;mipi csi host-&gt;vicap. Основные настройки:**

data-lanes должен задавать фактическое число линий, иначе интерфейс не распознаётся как MIPI.

dphy необходимо подключить к узлу CSI Host.

```text
  os04a10: os04a10@36 {
          // It needs to match the matching string in the driver
          compatible = "ovti,os04a10";
          // sensor I2C device address, 7 bits
          reg = <0x36>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //Sensor McLk pinctl settings
          pinctrl-names = "rockchip,camera_default";
          pinctrl-0 = <&mipicsi_clk0>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // Lens name
          rockchip,camera-module-lens-name = "M12-40IRC-4MP-F16";
          // Ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&mipi_in_ucam0>;
                  // CSI2 dphy lanes number, 1lane is <1>, 4lane is <1 2 3 4 >
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  &csi_dphy0 {
      //csi2_dphy0 is not used at the same time as csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  // CSI2 dphy lanes, 1 lane is <1 >, 4 lanes is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&csidphy0_out>;
                  // CSI2 host lanes, 1 lane is <1>,
                  4lane is <1 2 3 4 >, which needs to be
                  consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // The port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // CSI2 host lanes, 1 lane is <1>,
                  4lane is <1 2 3 4 >, which needs to be
                  consistent with the sensor side
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              // The port name of the CSI2 host
              remote-endpoint = <&mipi_csi2_output>;
              // The number of lanes on the vicap side,
              1 lane is <1 >, 4lane is < 1 2 3 4 >,
              which needs to be consistent with the sensor side
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* sditf endpoint */
          mipi_lvds_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //The number of lanes of MIPI CSI2 dphy,
              consistent with the sensor
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the Vicap SDITF
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.1.2.2 RK356X

Пример подключения GC5025 2lane к lane2/lane3 MIPI CSI2 dphy платы rk3566 EVB2:

**Тракт: sensor-&gt;csi2 dphy-&gt;mipi CSI host-&gt;vicap. Основные настройки:**

data-lanes должен задавать фактическое число линий, иначе интерфейс не распознаётся как MIPI.

dphy необходимо подключить к узлу CSI Host.

Необходимо включить узел CSI2 dphy HW.

```text
  /* split mode: lane:2/3 */
  gc5025: gc5025@37 {
          status = "okay";
          // It needs to match the matching string in the driver
          compatible = "galaxycore,gc5025";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // Sensor mclk source configuration
          clocks = <&pmucru CLK_WIFI>;
          clock-names = "xvclk";
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&refclk_pins>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio3 RK_PA5 GPIO_ACTIVE_LOW>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
          // The sensor dependent power domain is enabled
          power-domains = <&power RK3568_PD_VI>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "TongJu";
          // Lens name
          rockchip,camera-module-lens-name = "CHT842-MD";
          port {
              gc5025_out: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&dphy2_in>;
                  // CSI2 dphy lanes number, 2lanes are <1 2>, 4lanes are <1 2 3 4
  >
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
           status = "okay";
   };
  &csi2_dphy2 {
      //csi2_dphy2 is not used at the same time as csi2_dphy0, mutually exclusive;
  Can be used in parallel with csi2_dphy1
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&gc5025_out>;
                  // CSI2 dphy lanes, 2lane is <1 2>, 4lane is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  // The port name of the CSI2 host
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // The port name on the CSI2 dphy side
                  remote-endpoint = <&dphy2_out>;
                  // CSI2 host lanes, 2 lanes are <1 2>, 4lanes are <1 2 3 4 >,
  which need to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // The port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // CSI2 host lanes, 1 lane is <1>, 4lane is <1 2 3 4 >, which
  needs to be consistent with the sensor side
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              // The port name of the CSI2 host
              remote-endpoint = <&mipi_csi2_output>;
              // The number of lanes on the vicap side, 2lane is <1 2>, 4lane is <1
  2 3 4 >, which needs to be consistent with the sensor side
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          mipi_lvds_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //The number of lanes of MIPI CSI2 dphy, consistent with the sensor
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of Vicap Mipi SDITF
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.1.2.3 RK3588

Пример подключения IMX464 к DPY1.

data-lanes должен задавать фактическое число линий, иначе интерфейс не распознаётся как MIPI.

dphy необходимо связать с узлом CSI Host; csi2_dphy3 использует mipi4_csi2.

csi2_dphy3 — логический узел, зависящий от физического csi2_dphy1_hw.

rkcif_mipi_lvds4 — один из логических узлов VICAP; необходимо настроить физический rkcif и соответствующий iommu.

rkcif_mipi_lvds4_sditf — виртуальный дочерний узел rkcif_mipi_lvds4 для соединения с ISP.

Драйвер сенсора обычно управляет AVDD/DVDD/DOVDD. Источник наподобие выделенного RAK809 можно настроить прямо в узле сенсора. Внешний LDO с GPIO разрешения оформляется как узел питания по примеру vcc_mipicsi1; счётчик ссылок позволяет совместно использовать питание несколькими устройствами. Для нескольких камер оригинал рекомендует отдельное питание DVD, а AVDD/DOVDD допускает общее. При общем DVD и большом потреблении возможна кратковременная нехватка тока и просадка, ухудшающая изображение или останавливающая вывод. Написания RAK809 и DVD сохранены; проверьте компонент и домен DVDD.

```text
      / {
          vcc_mipicsi1: vcc-mipicsi1-regulator {
              compatible = "regulator-fixed";
              gpio = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
              pinctrl-names = "default";
              pinctrl-0 = <&mipicsi1_pwr>;
              regulator-name = "vcc_mipicsi1";
              enable-active-high;
          };
      };
      &csi2_dphy1_hw {
          status = "okay";
      };
      &csi2_dphy3 {
          status = "okay";
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi_in_ucam: endpoint@1 {
                      reg = <1>;
                      remote-endpoint = <&imx464_out>;
                      data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  csidphy3_out: endpoint@0 {
                      reg = <0>;
                      remote-endpoint = <&mipi4_csi2_input>;
                  };
              };
          };
      };
      &i2c4 {
          status = "okay";
          pinctrl-0 = <&i2c4m3_xfer>;
          imx464: imx464@36 {
              compatible = "sony,imx464";
              status = "okay";
              reg = <0x36>;
              clocks = <&cru CLK_MIPI_CAMARAOUT_M4>;
              clock-names = "xvclk";
              pinctrl-names = "default";
              pinctrl-0 = <&mipim0_camera4_clk>;
              avdd-supply = <&vcc_mipicsi1>;
              reset-gpios = <&gpio1 RK_PD6 GPIO_ACTIVE_HIGH>;
              pwdn-gpios = <&gpio3 RK_PC1 GPIO_ACTIVE_HIGH>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "CMK-OT1980-PX1";
              rockchip,camera-module-lens-name = "SHG102";
              port {
                  imx464_out: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1 2 3 4>;
                  };
              };
          };
      };
      &mipi4_csi2 {
          status = "okay";
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi4_csi2_input: endpoint@1 {
                      reg = <1>;
                      remote-endpoint = <&csidphy3_out>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  mipi4_csi2_output: endpoint@0 {
                      reg = <0>;
                      remote-endpoint = <&cif_mipi_in4>;
                  };
              };
          };
      };
      &pinctrl {
          cam {
              mipicsi1_pwr: mipicsi1-pwr {
                  rockchip,pins =
                      /* camera power en */
                      <4 RK_PA6 RK_FUNC_GPIO &pcfg_pull_none>;
              };
          };
      };
      &rkcif {
          status = "okay";
      };
      &rkcif_mipi_lvds4 {
          status = "okay";
          port {
              cif_mipi_in4: endpoint {
                  remote-endpoint = <&mipi4_csi2_output>;
              };
          };
      };
      &rkcif_mipi_lvds4_sditf {
          status = "okay";
          port {
              mipi4_lvds_sditf: endpoint {
                  remote-endpoint = <&isp0_vir0>;
              };
          };
      };
      &rkcif_mmu {
          status = "okay";
      };
      #if 1
      &rkisp0 {
          status = "okay";
          /* the max input w h and fps of mulit sensor */
          //max-input = <2688 1520 30>;多摄sensor分辨率不一样，需要配置
      };
      &isp0_mmu {
          status = "okay";
      };
      #else //sensor分辨率大于16M(4672x3504)需要2个isp合成处理
      /* dual isp case need width 32 align， height 8 align */
      &rkisp_unite_mmu {
          status = "okay";
      };
      &rkisp_unite {
             status = "okay";
      };
      &rkisp0_vir0 {
             status = "okay";
             rockchip,hw = <&rkisp_unite>;
      };
      #endif
      &rkisp0_vir0 {
          status = "okay";
          port {
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_vir0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi4_lvds_sditf>;
              };
          };
      };
```

###### 8.1.1.2.4 RV1106

Конфигурация DTS: arch/arm/boot/dts/rv1106-evb-cam.dtsi.

###### 8.1.1.2.5 RK3562

Конфигурация DTS: arch/arm64/boot/dts/rockchip/rk3562-evb1-cam.dtsi.

#### 8.1.2 Интерфейс LVDS

##### 8.1.2.1 Подключение к VICAP

###### 8.1.2.1.1 RV1126/RV1109

Пример IMX327 4lane; тракт показан ниже:

**Тракт: sensor-&gt;csi dphy-&gt;vicap. Основные настройки:**

dphy не должен соединяться с CSI Host, иначе данные не принимаются.

data-lanes должен задавать фактическое число линий, иначе данные не принимаются.

bus-type должен быть равен 3, иначе интерфейс не распознаётся как LVDS и тракт не создаётся.

```text
  imx327: imx327@1a {
          // It needs to match the matching string in the driver
          compatible = "sony,imx327";
          // sensor I2C device address, 7 bits
          reg = <0x1a>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //Sensor McLk pinctl settings
          pinctrl-names = "default";
          pinctrl-0 = <&mipicsi_clk0>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
          // Reset pin assignment and active level
          reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "front";
          // Module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // Lens name
          rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
          // Ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // The port name of the CSI2 dphy end
                  remote-endpoint = <&mipi_in_ucam0>;
                  //CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  //The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
  };
  &csi_dphy0 {
      //csi2_dphy0 is not used at the same time as csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name on the sensor side
                  remote-endpoint = <&ucam_out0>;
                  //CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  //The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // The port name of the vicap lite side
                  remote-endpoint = <&cif_lite_lvds_in>;
                  // CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >,
  must be specified
                  data-lanes = <4>;
                  // The type of LVDS interface, which must be specified
                  bus-type = <3>;
              };
          };
      };
  };
  &rkcif_lite_mipi_lvds {
      status = "okay";
      port {
          /* lvds endpoint */
          cif_lite_lvds_in: endpoint {
              // The port name of the CSI2 dphy end
              remote-endpoint = <&csidphy0_out>;
              // CSI2 dphy lvds number of lanes, 1 lane is <1>, 4lane is <4 >, must
  be specified
              data-lanes = <4>;
              //The type of LVDS interface, which must be specified
              bus-type = <3>;
          };
      };
  };
  &rkcif_lite_sditf {
      status = "okay";
      port {
          /* lvds endpoint */
          lite_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //CSI2 dphy has the number of lanes, which is the same as the sensor
              data-lanes = <4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &isp0_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the lite vicap lvds sditf
                  remote-endpoint = <&lite_sditf>;
              };
          };
      };
  };
```

Для обработки двумя ISP внесите следующие изменения:

```text
  &rkisp {
      status = "disabled";
  };
  &isp0_mmu {
      status = "disabled";
  };
  &rkisp_unite {
      status = "okay";
  };
  &rkisp_unite_mmu {
      status = "okay";
  };
  &rkisp0_vir0 {
      status = "okay";
      /* hw is referenced as a unite node*/
      rockchip,hw = <&rkisp_unite>;
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_vir0: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi4_lvds_sditf>;
          };
      };
  };
```

#### 8.1.3 Интерфейс DVP

##### 8.1.3.1 Подключение к VICAP

На RV1126/RV1109/RK356X/RK3588 конфигурация DTS соответствующих интерфейсов DVP одинакова.

###### 8.1.3.1.1 BT601

Пример AR0230 BT601; тракт показан ниже:

**Тракт: sensor-&gt;vicap. Основные настройки:**

Нужно задать hsync-active/vsync-active для асинхронной регистрации и распознавания BT601 в v4l2; без них определяется BT656.

pclk-sample/bus-width необязательны.

В g_mbus_config драйвера сенсора флагами должна задаваться активная полярность hsync-acitve/vsync-active/pclk-ative, иначе данные не принимаются; написания исходника требуют проверки.

Нужно правильно указать pinctrl для IOMUX выводов BT601, иначе данные не принимаются.

Пример кода g_mbus_config:

```text
  static int ar0230_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_PARALLEL;
      config->flags = V4L2_MBUS_HSYNC_ACTIVE_HIGH |
              V4L2_MBUS_VSYNC_ACTIVE_HIGH |
              V4L2_MBUS_PCLK_SAMPLE_FALLING;
      return 0;
  }
```

Пример конфигурации DTS:

```text
  ar0230: ar0230@10 {
          // It needs to match the matching string in the driver
          compatible = "aptina,ar0230";
          // sensor I2C device address, 7 bits
          reg = <0x10>;
          // Sensor mclk source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //The sensor dependent power domain is enabled
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          power-domains = <&power RV1126_PD_VI>;
          // Powerdown pin assignment and active level
          pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
          //Configure the DVP-related data pins and clock pins
          pinctrl-names = "default";
          pinctrl-0 = <&cifm0_dvp_ctl>;
          // Module number, which should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, with "back" and "front"
          rockchip,camera-module-facing = "back";
          // Module name
          rockchip,camera-module-name = "CMK-OT0836-PT2";
          // Lens name
          rockchip,camera-module-lens-name = "YT-2929";
          port {
              cam_para_out1: endpoint {
                  remote-endpoint = <&cif_para_in>;
              };
          };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //The name of the sensor endpoint
              remote-endpoint = <&cam_para_out1>;
              //Relevant configuration parameters on the sensor side
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              //Relevant configuration parameters on the sensor side
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the DVD SDITF
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

###### 8.1.3.1.2 BT656/BT1120

DTS для BT656 и BT1120 используется одинаково.

Пример Ava FPGA BT1120; тракт показан ниже:

Тракт: sensor-&gt;vicap

Основные настройки

Не задавайте hsync-active/vsync-active, иначе при асинхронной регистрации v4l2 определит BT601.

pclk-sample/bus-width необязательны.

В g_mbus_config драйвера сенсора переменная flag должна указывать активную полярность pclk-ative, иначе данные не принимаются; написание сохранено.

Необходимо реализовать querystd в v4l2_subdev_video_ops и указать интерфейс ATSC, иначе данные не принимаются.

Необходимо реализовать RKMODULE_GET_BT656_MBUS_INFO; BT656/BT1120 вызывают этот совместимый ioctl. Пример: drivers/media/i2c/nvp6158_drv/nvp6158_v4l2.c.

Правильно укажите pinctrl для IOMUX выводов BT656/BT1120, иначе данные не принимаются.

Пример кода g_mbus_config:

```text
  static int avafpga_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_BT656;
      config->flags = V4L2_MBUS_PCLK_SAMPLE_RISING;
      return 0;
  }
```

Пример querystd:

```text
  static int avafpga_querystd(struct v4l2_subdev *sd, v4l2_std_id *std)
  {
      *std = V4L2_STD_ATSC;
      return 0;
  }
```

Пример конфигурации DTS:

```text
  avafpga: avafpga@70 {
      // It needs to match the matching string in the driver
      compatible = "ava,fpga";
      // sensor I2C device address, 7 bits
      reg = <0x10>;
      // Sensor mclk source configuration
      clocks = <&cru CLK_CIF_OUT>;
      clock-names = "xvclk";
      //The sensor dependent power domain is enabled
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // Powerdown pin assignment and active level
      power-domains = <&power RV1126_PD_VI>;
      pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
      //Configure the DVP-related data pins and clock pins
      pinctrl-names = "default";
      pinctrl-0 = <&cifm0_dvp_ctl>;
      // Module number, which should not be repeated
      rockchip,camera-module-index = <0>;
      // Module orientation, with "back" and "front"
      rockchip,camera-module-facing = "back";
      // Module name
      rockchip,camera-module-name = "CMK-OT0836-PT2";
      // Lens name
      rockchip,camera-module-lens-name = "YT-2929";
      port {
          cam_para_out2: endpoint {
              remote-endpoint = <&cif_para_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //The name of the sensor endpoint
              remote-endpoint = <&cam_para_out2>;
              //Sensor-side related configuration parameters, optional
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //ISP virtual device port name
              remote-endpoint = <&isp_in>;
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //The endpoint name of the DVD SDITF
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

###### 8.1.3.1.3 Примечания к DVP DTS RV1106

Конфигурация в основном совпадает с описанной выше; настройте MCLK и остальные ресурсы по фактическим соединениям.

RV1106 поддерживает две группы DVP pinctrl; выберите в DTS группу, соответствующую схеме. M0:

Поддерживаются BT1120 16bit, BT656 8bit и BT601 8/10/12bit. Эти выводы совмещены с MIPI dphy, который должен работать в режиме TTL; поэтому rkcif_dvp должен ссылаться на узел MIPI dphy:

```text
  &rkcif_dvp {
      status = "okay";
      rockchip,dphy_hw = <&csi2_dphy_hw>;
          ......
```

}；

M1: поддержка BT656 8bit и BT601 8/10; допускается одновременная работа с MIPI.

Примечание: оригинал указывает выравнивание данных DVD по старшим разрядам на платформе RK. При проектировании внимательно изучите руководство по аппаратуре RK, иначе несоответствие схемы может сделать захват невозможным. Написание DVD сохранено; проверьте его в контексте DVP.

#### 8.1.4 Регистрация нескольких сенсоров

Один аппаратный ISP обрабатывает несколько RAW-сенсоров посредством виртуализации нескольких устройств.

VICAP RV1109/RV1126/RK356X сохраняет DVP RAW только в неупакованном виде, тогда как ISP по умолчанию обрабатывает упакованный RAW. См. раздел настройки формата хранения ISP/VICAP RAW (в оригинале ссылка ещё не добавлена).

##### 8.1.4.1 RV1126/RV1109

**Соединения isp0-&gt;ispp0 и isp1-&gt;ispp1 фиксированы в rv1126.dtsi.**

При достаточной полосе RV1109/RV1126 ISP/ISPP поддерживает до четырёх каналов; в RV1126.DTSI можно добавить rkisp_vir0~rkisp_vir4/rkispp_vir0~rkispp_vir4. Расхождение числа каналов и диапазона индексов сохранено.

**Можно выбрать прямой вход MIPI в ISP либо вход через CIF.**

RV1109/RV1126 имеет два PHY, каждый может использоваться как MIPI/LVDS, до 4LANE.

RV1109/RV1126 имеет один DVP с поддержкой BT601/BT656/BT1120.

ISP принимает MIPI либо DVP; одновременная работа невозможна.

VICAP поддерживает MIPI/LVDS/DVP. MIPI и LVDS взаимоисключаются; DVP может работать одновременно с выбранным интерфейсом.

VICAP Lite поддерживает только LVDS.

С учётом этой конфигурации RV1109/RV1126 поддерживает обработку ISP максимум трёх RAW-сенсоров.

###### 8.1.4.1.1 Два входа ISP: sensor0 (mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1 (mipi)-&gt;csi_dphy1-&gt;isp1-&gt;ispp1.

Пример: arch/arm/boot/dts/rv1109-evb-ddr3-v12-facial-gate.dts. gc2053-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp1-&gt;ispp1; ov2718-&gt;csi_dphy1-&gt;isp0-&gt;ispp0. Для разных разрешений задайте максимальные ширину, высоту и частоту кадров:

```dts
&rkispp {
         status = "okay";
         /* the max input w h and fps of mulit sensor */
         max-input = <2688 1520 30>;// Maximum width and height and frame rate for different sensors
};
```

###### 8.1.4.1.2 Три входа ISP: sensor0 (mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1 (mipi)-&gt;csi_dphy1-&gt;isp1-&gt;ispp1; sensor2 (DVP)-&gt;vicap-&gt;isp2-&gt;ispp2.

Или

sensor0 (mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1 (lvds)-&gt;csi_dphy1-&gt;vicap lite-&gt;isp1-&gt;ispp1; sensor2 (DVP)-&gt;vicap-&gt;isp2-&gt;ispp2.

Пример:

bf2253-0(mipi)-&gt;dphy0-&gt;csi2-&gt;vicap(mipi)-&gt;isp0-&gt;ispp0; bf2253-1(mipi)-&gt;dphy1-&gt;isp1-&gt;ispp1; gc1054(dvp)-&gt;vicap(dvp)-&gt;isp2-&gt;ispp2.

```text
  &i2c1 {
      status = "okay";
       clock-frequency = <400000>;
      gc1054: gc1054@21 {
                 compatible = "galaxycore,gc1054";
              reg = <0x21>;
                 clocks = <&cru CLK_CIF_OUT>;
              clock-names = "xvclk";
              power-domains = <&power RV1126_PD_VI>;
              pwdn-gpios  = <&gpio3 RK_PA5 GPIO_ACTIVE_HIGH>;
              reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
              rockchip,grf = <&grf>;
              pinctrl-names = "default";
              pinctrl-0 = <&cifm0_dvp_ctl>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "GC1054_B";
              rockchip,camera-module-lens-name = "GC1054_LEN";
                 port {
                      cam_para_out1: endpoint {
                      remote-endpoint = <&cif_para_in>;
                          bus-width = <10>;
                          hsync-active = <1>;
                          vsync-active = <1>;
              };
          };
      };
      bf2253_isp0: bf2253_isp0@6d {
            compatible = "ovti,bf2253_isp0";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            pinctrl-0   = <&mipicsi_clk0>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio1 RK_PD4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <1>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                cam_out1: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1>;
                  };
            };
       };
  };
  &i2c3 {
      status = "okay";
      clock-frequency = <400000>;
      pinctrl-names = "default";
      pinctrl-0 = <&i2c3m2_xfer>;
      bf2253_isp1: bf2253_isp1@6d {
            compatible = "ovti,bf2253_isp1";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            //pinctrl-names = "rockchip,camera_sleep";
            pinctrl-0 = <&mipicsi_clk1>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio3 RK_PA4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <2>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                 cam_out0: endpoint {
                     remote-endpoint = <&csi_dphy1_input>;
                     data-lanes = <1>;
                 };
            };
       };
  };
  &csi_dphy0 {
      status = "okay";
      ports {
          port@0 {
              mipi_in_ucam: endpoint@1 {
                  remote-endpoint = <&cam_out1>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy0_out: endpoint@0 {
                  remote-endpoint = <&mipi_csi2_input>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &csi_dphy1 {
      status = "okay";
      ports {
          port@0 {
              csi_dphy1_input: endpoint@1 {
                  remote-endpoint = <&cam_out0>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy1_output: endpoint@0 {
                  remote-endpoint = <&isp_in1>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          port@0 {
              mipi_csi2_input: endpoint@1 {
                  remote-endpoint = <&csi_dphy0_out>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              mipi_csi2_output: endpoint@0 {
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          lvds_sditf: endpoint {
              remote-endpoint = <&isp_in0>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_dvp {
          status = "okay";
          //iommus = <&rkcif_mmu>;
          ///delete-property/ memory-region;
          port {
                  /* Parallel bus endpoint */
                  cif_para_in: endpoint {
                          remote-endpoint = <&cam_para_out1>;
                          bus-width = <8>;
                          hsync-active = <1>;
                          vsync-active = <1>;
                  };
          };
  };
  &rkcif_dvp_sditf {
          status = "okay";
          port {
                  /* Parallel bus endpoint */
          dvp_sditf: endpoint {
                          remote-endpoint = <&isp_in2>;
                  };
          };
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&lvds_sditf>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in1: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&csi_dphy1_output>;
              };
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in2: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
  &rkispp_vir0 {
      status = "okay";
  };
  &rkispp_vir1 {
      status = "okay";
  };
  &rkispp_vir2 {
          status = "okay";
  };
  &rkcif {
          status = "okay";
  };
  rkisp: rkisp@ffb50000 {
      status = "okay";
  };
  &rkispp {
      status = "okay";
      max-input = <1600 1200 30>;
      memory-region = <&isp_reserved>;
      /* the max input w h and fps of mulit sensor */
  };
   rkcif_mmu: iommu@ffae0800{
      status = "disabled";
  };
   rkisp_mmu: iommu@ffb51a00 {
      status = "disabled";
  };
  &rkispp_mmu {
      status = "disabled";
  };
```

##### 8.1.4.2 RK3566/RK3568

При достаточной полосе RK356X ISP поддерживает до четырёх каналов; в RK3568.DTSI можно добавить rkisp_vir0~rkisp_vir4.

**Можно выбрать прямой вход MIPI в ISP либо вход через CIF.**

RK356X имеет один PHY с 4 линиями, разделяемый на два PHY по 2 линии, и один DVD (написание оригинала) с BT601/BT656/BT1120. ISP принимает либо MIPI, либо DVP, не одновременно. VICAP может одновременно использовать MIPI и DVP. Такая конфигурация позволяет обрабатывать ISP до трёх RAW-сенсоров.

###### 8.1.4.2.1 Обработка двух входов ISP:

Примеры:

ov5695-&gt;dphy1-&gt;isp_vir0; gc5025-&gt;dphy2-&gt;csi2-&gt;vicap-&gt;isp_vir1.

```text
  ov5695: ov5695@36 {
          status = "okay";
          ...
          port {
              ov5695_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
  };
  gc5025: gc5025@37 {
          status = "okay";
          ...
          port {
              gc5025_out: endpoint {
                  remote-endpoint = <&dphy2_in>;
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
           status = "okay";
   };
  &csi2_dphy1 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc5025_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <2592 1944 30>;
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dphy1_out>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp1_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

###### 8.1.4.2.2 Обработка трёх входов ISP:

Примеры:

gc2053(mipi)-&gt;dphy1-&gt;isp0; sc1330(dvp)-&gt;vicap(dvp)-&gt;isp1; ov5695(mipi)-&gt;dphy2-&gt;csi2-&gt;vicap(mipi)-&gt;isp2.

```text
  &i2c2 {
      status = "okay";
      pinctrl-0 = <&i2c2m1_xfer>;
      /* split mode: lane0/1 */
      gc2053: gc2053@37 {
          status = "okay";
          compatible = "galaxycore,gc2053";
          reg = <0x37>;
          clocks = <&cru CLK_CAM0_OUT>;
          clock-names = "xvclk";
          /* Set pinctl of xvclk in &pinctl */
          power-domains = <&power RK3568_PD_VI>;
          reset-gpios = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PD0 GPIO_ACTIVE_LOW>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          rockchip,camera-module-index = <0>;
          rockchip,camera-module-facing = "front";
          rockchip,camera-module-name = "rgbd";
          rockchip,camera-module-lens-name = "Optics";
          port {
              gc2053_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &i2c3 {
      status = "okay";
      pinctrl-0 = <&i2c3m0_xfer>;
      sc1330: sc1330@32 {
          status = "okay";
          compatible = "smartsens,sc1330";
          reg = <0x32>;
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          power-domains = <&power RK3568_PD_VI>;
          pinctrl-names = "default";
          /* conflict with gmac1m1_rgmii_pins & cif_clk*/
          pinctrl-0 = <&cif_clk &cif_dvp_clk &cif_dvp_bus10>;
          /*avdd-supply = <&vcc2v8_dvp>;*/
          /*dovdd-supply = <&vcc1v8_dvp>;*/
          /*dvdd-supply = <&vcc1v8_dvp>;*/
          reset-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PC7 GPIO_ACTIVE_LOW>;
          rockchip,camera-module-index = <2>;
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "default";
          rockchip,camera-module-lens-name = "default";
          port {
              sc1330_out: endpoint {
                  remote-endpoint = <&dvp_in_bcam>;
              };
          };
      };
  };
  &i2c4 {
      status = "okay";
      pinctrl-0 = <&i2c4m0_xfer>;
      clock-frequency = <1000000>;
      /* split mode: lane:2/3 */
      ov5695: ov5695@36 {
                  status = "okay";
                  compatible = "ovti,ov5695";
                  reg = <0x36>;
                  clocks = <&cru CLK_CAM0_OUT>;
                  clock-names = "xvclk";
                  power-domains = <&power RK3568_PD_VI>;
                  pinctrl-names = "default";
                  pinctrl-0 = <&cif_clk>;
                  reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_HIGH>;
                  pwdn-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
                  rockchip,camera-module-index = <1>;
                  rockchip,camera-module-facing = "front";
                  rockchip,camera-module-name = "TongJu";
                  rockchip,camera-module-lens-name = "CHT842-MD";
                  port {
                          ov5695_out: endpoint {
                                  remote-endpoint = <&dphy2_in>;
                                  data-lanes = <1 2>;
                          };
                  };
      };
  };
  &csi2_dphy_hw {
      status = "okay";
  };
  &csi2_dphy1 {
      status = "okay";
      /*
       * dphy1 only used for split mode,
       * can be used  concurrently  with dphy2
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc2053_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif {
      status = "okay";
  };
  &rkcif_mmu {
      status = "okay";
  };
  &rkcif_mipi_lvds {
      status = "okay";
      /* csi2 link to rkcif, using rkcif to capture stream */
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp2_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          dvp_in_bcam: endpoint {
              remote-endpoint = <&sc1330_out>;
              bus-width = <10>;
              vsync-active = <0>;
              hsync-active = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      /* parallel endpoint */
      port {
          dvp_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              bus-width = <10>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <1920 1080 30>;
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dphy1_out>;
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp1_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dvp_sditf>;
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp2_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi_lvds_sditf>;
          };
      };
  };
```

##### 8.1.4.3 RK3588

1\. См. поддержку нескольких сенсоров RK3588 (ссылка в оригинале ещё не добавлена).

2\. См. arch/arm64/boot/dts/rockchip/rk3588-evb1-cam-6x.dtsi.

3\. Режим unite двух ISP:

1) Две камеры, максимальное разрешение 7424x2160.

2) Три/четыре камеры, максимальное разрешение 4864x1536.

Возьмите описанную выше конфигурацию unite для одной камеры, затем настройте узлы ISP:

```text
&rkisp0_vir1 {
     status = "okay";
     rockchip,hw = <&rkisp_unite>;
   //Other omissions
};
&rkisp0_vir2 {
     status = "okay";
     rockchip,hw = <&rkisp_unite>;
   //Other omissions
};
```

##### 8.1.4.4 RV1106

Пример DTS: arch/arm/boot/dts/rv1106-evb-dual-cam.dtsi.

Аппаратный ISP поддерживает две камеры максимум 1080p. При большем разрешении один кадр обрабатывается двумя обратными чтениями; это расходует больше пропускной способности ISP и памяти и снижает выходную частоту кадров.

##### 8.1.4.5 RK3562

Пример DTS: arch/arm64/boot/dts/rockchip/rk3562-evb2-ddr4-v10-dual-camera.dts.

Две камеры: максимальное разрешение 3840x2160.

Три камеры: максимальные разрешения 3840x2160, 2688x1536 и 2688x1536.

Четыре камеры: максимальное разрешение 2688x1536.

### 8.2 Описание драйвера CIS

Сенсор взаимодействует с SoC по I2C; драйвер реализован как драйвер устройства I2C и использует V4L2 subdev для взаимодействия с драйвером host.

#### 8.2.1 Краткое описание типов данных

##### 8.2.1.1 struct i2c_driver

[Описание]

Определение информации драйвера I2C.

[Определение]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p63, table unit 302 -->

| Имя поля | Описание |
| --- | --- |
| @driver | Драйвер модели устройств содержит главным образом имя драйвера и of_match_table для сопоставления с устройством, зарегистрированным в DTS. При совпадении compatible в of_match_table и DTS вызывается .probe. |
| @id_table | Список устройств I2C, поддерживаемых драйвером. Если ядро не использует of_match_table для сопоставления устройств DTS, сопоставление выполняется по этой таблице. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  #if IS_ENABLED(CONFIG_OF)
  static const struct of_device_id os04a10_of_match[] = {
      { .compatible = "ovti,os04a10" },
      {},
  };
  MODULE_DEVICE_TABLE(of, os04a10_of_match);
  #endif
  static const struct i2c_device_id os04a10_match_id[] = {
      { "ovti,os04a10", 0 },
      { },
  };
  static struct i2c_driver os04a10_i2c_driver = {
      .driver = {
          .name = OS04A10_NAME,
          .pm = &os04a10_pm_ops,
          .of_match_table = of_match_ptr(os04a10_of_match),
      },
      .probe        = &os04a10_probe,
      .remove        = &os04a10_remove,
      .id_table    = os04a10_match_id,
  };
  static int __init sensor_mod_init(void)
  {
      return i2c_add_driver(&os04a10_i2c_driver);
  }
  static void __exit sensor_mod_exit(void)
  {
      i2c_del_driver(&os04a10_i2c_driver);
  }
  device_initcall_sync(sensor_mod_init);
  module_exit(sensor_mod_exit);
```

##### 8.2.1.2 struct v4l2_subdev_ops

[Описание]

Определяет обратные вызовы ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_ops {
      const struct v4l2_subdev_core_ops    *core;
      ……
      const struct v4l2_subdev_video_ops    *video;
      ……
      const struct v4l2_subdev_pad_ops    *pad;
  };
```

[Основные члены]

<!-- Source: English PDF p64, table unit 312 -->

| Имя поля | Описание |
| --- | --- |
| .core | Определяет core ops для subdev |
| .video | Обратные вызовы при открытии v4l-устройства в видеорежиме |
| .pad | Операции уровня pad v4l2-subdev |

[Пример]

```text
  static const struct v4l2_subdev_ops os04a10_subdev_ops = {
      .core    = &os04a10_core_ops,
      .video    = &os04a10_video_ops,
      .pad    = &os04a10_pad_ops,
  };
```

##### 8.2.1.3 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      int (*s_power)(struct v4l2_subdev *sd, int on);
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
          unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p65, table unit 321 -->

| Имя поля | Описание |
| --- | --- |
| .s_power | Переводит subdevice в энергосбережение (on == 0) либо нормальный режим (on == 1). |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops os04a10_core_ops = {
      .s_power = os04a10_s_power,
      .ioctl = os04a10_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = os04a10_compat_ioctl32,
  #endif
  };
```

Следующие частные ioctl используются для получения информации модуля и настройки OTP.

<!-- Source: English PDF p66, table unit 325 -->

| Частный ioctl | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Информация модуля; см. struct rkmodule_inf. |
| RKMODULE_AWB_CFG | Включение/отключение компенсации AWB сенсора. Если golden awb не записан в модуль, можно задать эту настройку; см. struct rkmodule_awb_cfg. |
| RKMODULE_LSC_CFG | Включение/отключение компенсации LSC сенсора; см. struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | Настройка экспозиции HDR; см. struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Установка режима HDR с переключением между обычным режимом и HDR. Драйвер должен поддерживать две группы настроек; см. struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Получение текущего режима HDR; см. struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Установка коэффициента преобразования линейного режима, например для IMX347 и OS04A10. Если сенсор не поддерживает conversion gain, реализацию можно не предоставлять. |

##### 8.2.1.4 struct v4l2_subdev_video_ops

[Описание]

Обратные вызовы при открытии устройства v4l в видеорежиме.

[Определение]

```text
  struct v4l2_subdev_video_ops {
      ……
      int (*s_stream)(struct v4l2_subdev *sd, int enable);
      ……
      int (*g_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_frame_interval *interval);
      int (*g_mbus_config)(struct v4l2_subdev *sd,
                 struct v4l2_mbus_config *cfg);
   ……
  };
```

[Основные члены]

<!-- Source: English PDF p67, table unit 332 -->

| Имя поля | Описание |
| --- | --- |
| .g_frame_interval | Обработчик VIDIOC_SUBDEV_G_FRAME_INTERVAL ioctl |
| .s_stream | Уведомляет драйвер о начале либо остановке потока |
| .g_mbus_config | Получает поддерживаемые конфигурации mediabus |

[Пример]

```text
  static const struct v4l2_subdev_video_ops os04a10_video_ops = {
      .s_stream = os04a10_s_stream,
      .g_frame_interval = os04a10_g_frame_interval,
      .g_mbus_config = os04a10_g_mbus_config,
  };
```

##### 8.2.1.5 struct v4l2_subdev_pad_ops

[Описание]

Операции уровня pad для v4l2-subdev.

[Определение]

```text
  struct v4l2_subdev_pad_ops {
      ……
      int (*enum_mbus_code)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_mbus_code_enum *code);
      int (*enum_frame_size)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_size_enum *fse);
      int (*get_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*set_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*enum_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_interval_enum *fie);
      int (*get_selection)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_selection *sel);
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p68, table unit 341 -->

| Имя поля | Описание |
| --- | --- |
| . enum_mbus_code | Обработчик VIDIOC_SUBDEV_ENUM_MBUS_CODE ioctl |
| . enum_frame_size | Обработчик VIDIOC_SUBDEV_ENUM_FRAME_SIZE ioctl |
| .s_fmt | Обработчик VIDIOC_SUBDEV_S_FMT ioctl |
| .g_fmt | Обработчик VIDIOC_SUBDEV_G_FMT ioctl |
| .enum_frame_interval | Обработчик VIDIOC_SUBDEV_ENUM_FRAME_INTERVAL() ioctl |
| .get_selection | Обработчик VIDIOC_SUBDEV_G_SELECTION() ioctl |

[Пример]

```text
  static const struct v4l2_subdev_pad_ops os04a10_pad_ops = {
      .enum_mbus_code = os04a10_enum_mbus_code,
      .enum_frame_size = os04a10_enum_frame_sizes,
      .enum_frame_interval = os04a10_enum_frame_interval,
      .get_fmt = os04a10_get_fmt,
      .set_fmt = os04a10_set_fmt,
  };
```

##### 8.2.1.6 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p68, table unit 350 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control |

[Пример]

```text
  static const struct v4l2_ctrl_ops os04a10_ctrl_ops = {
      .s_ctrl = os04a10_set_ctrl,
  };
```

RKISP требует user controls из фреймворка; драйвер сенсора должен реализовать следующие функции. См. список V4L2-controls CIS (в оригинале пометка «1, ссылка ещё не добавлена»).

##### 8.2.1.7 struct xxxx_mode

[Описание]

Информация о поддерживаемых режимах сенсора.

Структура часто встречается в драйверах сенсоров, но не обязательна по V4L2. При добавлении функций в неё можно включать новые переменные.

[Определение]

```text
  struct xxxx_mode {
      u32 bus_fmt;
      u32 width;
      u32 height;
      struct v4l2_fract max_fps;
      u32 hts_def;
      u32 vts_def;
      u32 exp_def;
      const struct regval *reg_list;
      u32 hdr_mode;
      u32 vc[PAD_MAX];
  };
```

[Основные члены]

<!-- Source: English PDF p69, table unit 361 -->

| Имя поля | Описание |
| --- | --- |
| .bus_fmt | Выходной формат сенсора; см. таблицу MEDIA_BUS_FMT (в оригинале ссылка ещё не добавлена). |
| .width | Ширина активного изображения должна совпадать с текущей выходной шириной сенсора. |
| .height | Высота активного изображения должна совпадать с текущей выходной высотой сенсора. |
| .max_fps | Частота кадров: denominator/numerator равняется fps. |
| hts_def | HTS по умолчанию = ширина активного изображения + HBLANK. |
| vts_def | VTS по умолчанию = высота активного изображения + VBLANK. |
| exp_def | Экспозиция по умолчанию |
| *reg_list | Список регистров. |
| .hdr_mode | Режим сенсора: линейный, HDR с объединением двух или трёх кадров. |
| .vc[PAD_MAX] | Настройка канала MIPI VC. |

[Пример]

```text
   enum os04a10_max_pad {
      PAD0, /* link to isp */
      PAD1, /* link to csi rawwr0 | hdr x2:L x3:M */
      PAD2, /* link to csi rawwr1 | hdr    x3:L */
      PAD3, /* link to csi rawwr2 | hdr x2:M x3:S */
      PAD_MAX,
  };
  static const struct os04a10_mode supported_modes[] = {
      {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 300372,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0984,
          .reg_list = os04a10_linear12bit_2688x1520_regs,
          .hdr_mode = NO_HDR,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
      }, {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 225000,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0658,
          .reg_list = os04a10_hdr12bit_2688x1520_regs,
          .hdr_mode = HDR_X2,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
          .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
      },
  };
```

##### 8.2.1.8 struct v4l2_mbus_framefmt

[Описание]

Формат кадра на медиашине.

[Определение]

```text
  struct v4l2_mbus_framefmt {
      __u32            width;
      __u32            height;
      __u32            code;
      __u32            field;
      __u32            colorspace;
      __u16            ycbcr_enc;
      __u16            quantization;
      __u16            xfer_func;
      __u16            reserved[11];
  };
```

[Основные члены]

<!-- Source: English PDF p71, table unit 371 -->

| Имя поля | Описание |
| --- | --- |
| width | Ширина кадра |
| height | Высота кадра |
| code | См. таблицу MEDIA_BUS_FMT. |
| field | V4L2_FIELD_NONE: кадровый вывод; V4L2_FIELD_INTERLACED: полевой вывод. |

[Пример]

##### 8.2.1.9 struct rkmodule_base_inf

[Описание]

Основная информация модуля, используемая верхним уровнем для выбора IQ.

[Определение]

```text
  struct rkmodule_base_inf {
      char sensor[RKMODULE_NAME_LEN];
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p71, table unit 379 -->

| Имя поля | Описание |
| --- | --- |
| sensor | Имя сенсора, получаемое из его драйвера. |
| module | Имя модуля из конфигурации DTS; ориентироваться на данные модуля. |
| lens | Имя объектива из конфигурации DTS; ориентироваться на данные модуля. |

[Пример]

##### 8.2.1.10 struct rkmodule_fac_inf

[Описание]

Заводские сведения OTP модуля.

[Определение]

```text
  struct rkmodule_fac_inf {
      __u32 flag;
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
      __u32 year;
      __u32 month;
      __u32 day;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p72, table unit 387 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности информации группы. |
| module | Имя модуля: получить номер из OTP и определить имя по номеру. |
| lens | Имя объектива: получить номер из OTP и определить имя по номеру. |
| year | Год выпуска: например, 12 означает 2012. |
| month | Месяц выпуска |
| day | Дата выпуска |

[Пример]

##### 8.2.1.11 struct rkmodule_awb_inf

[Описание]

Измеренные сведения AWB в OTP модуля.

[Определение]

```text
  struct rkmodule_awb_inf {
      __u32 flag;
      __u32 r_value;
      __u32 b_value;
      __u32 gr_value;
      __u32 gb_value;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p73, table unit 395 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности информации группы. |
| r_value | Измерение AWB R текущего модуля. |
| b_value | Измерение AWB B текущего модуля. |
| gr_value | Измерение AWB GR текущего модуля. |
| gb_value | Измерение AWB GB текущего модуля. |
| golden_r_value | Измерение AWB R эталонного модуля; если не записано, установить 0. |
| golden_b_value | Измерение AWB B эталонного модуля; если не записано, установить 0. |
| golden_gr_value | Измерение AWB GR эталонного модуля; если не записано, установить 0. |
| golden_gb_value | Измерение AWB GB эталонного модуля; если не записано, установить 0. |

[Пример]

##### 8.2.1.12 struct rkmodule_lsc_inf

[Описание]

Измеренные сведения LSC в OTP модуля.

[Определение]

```text
  struct rkmodule_lsc_inf {
      __u32 flag;
      __u16 lsc_w;
      __u16 lsc_h;
      __u16 decimal_bits;
      __u16 lsc_r[RKMODULE_LSCDATA_LEN];
      __u16 lsc_b[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gr[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gb[RKMODULE_LSCDATA_LEN];
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p74, table unit 403 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности информации группы. |
| lsc_w | Фактическая ширина таблицы LSC. |
| lsc_h | Фактическая высота таблицы LSC. |
| decimal_bits | Число десятичных знаков измерения LSC; если неизвестно, установить 0. |
| lsc_r | Измерение LSC R. |
| lsc_b | Измерение LSC B. |
| lsc_gr | Измерение LSC GR. |
| lsc_gb | Измерение LSC GB. |

[Пример]

##### 8.2.1.13 struct rkmodule_af_inf

[Описание]

Измеренные сведения AF в OTP модуля.

[Определение]

```text
  struct rkmodule_af_inf {
      __u32 flag; // The identity of whether the group information is valid
      __u32 vcm_start; // VCM start-up current
      __u32 vcm_end; // VCM terminates the current
      __u32 vcm_dir; // VCM determination direction
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p74, table unit 411 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности информации группы. |
| vcm_start | Начальный ток VCM. |
| vcm_end | Конечный ток VCM. |
| vcm_dir | Направление измерения VCM. |

[Пример]

##### 8.2.1.14 struct rkmodule_inf

[Описание]

Сведения о модуле.

[Определение]

```text
  struct rkmodule_inf {
      struct rkmodule_base_inf base;
      struct rkmodule_fac_inf fac;
      struct rkmodule_awb_inf awb;
      struct rkmodule_lsc_inf lsc;
      struct rkmodule_af_inf af;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p75, table unit 419 -->

| Имя поля | Описание |
| --- | --- |
| base | Основная информация модуля. |
| fac | Заводская информация OTP модуля. |
| awb | Измерения AWB в OTP модуля |
| lsc | Измерения LSC в OTP модуля |
| af | Измерения AF в OTP модуля |

[Пример]

##### 8.2.1.15 struct rkmodule_awb_cfg

[Описание]

Конфигурация AWB в OTP модуля.

[Определение]

```text
  struct rkmodule_awb_cfg {
      __u32 enable;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p76, table unit 427 -->

| Имя поля | Описание |
| --- | --- |
| enable | Признак включения коррекции AWB. |
| golden_r_value | Измерение AWB R эталонного модуля. |
| golden_b_value | Измерение AWB B эталонного модуля. |
| golden_gr_value | Измерение AWB GR эталонного модуля. |
| golden_gb_value | Измерение AWB GB эталонного модуля. |

[Пример]

##### 8.2.1.16 struct rkmodule_lsc_cfg

[Описание]

[Определение]

[Основные члены]

[Пример]

[Описание]

[Определение]

[Основные члены]

[Пример]

## 9. Различия версий микросхем

<!-- Source: English PDF p77, table unit 439 -->

| SOC | VI IP | Интерфейс VI | Максимальное разрешение Bayer CIS | Возможности |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 3072x2048 | HDR до 3 кадров |
| RK3566 | ISP21 Lite: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x3072 | Без HDR |
| RK3568 | ISP21: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x3072 | HDR до 2 кадров |
| RV1126 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4416x3312 | HDR до 3 кадров |

## 10. Драйвер CIS (CMOS-сенсора изображения)

### 10.1 Регистрация устройства CIS (DTS)

#### 10.1.1 Регистрация одного сенсора

##### 10.1.1.1 Интерфейс MIPI

В этом месте исходник указывает RV1126 и RV1106: два независимых полноценных стандартных физических DPHY MIPI CSI2, соответствующих csi_dphy0 и csi_dphy1 в DTS (см. RV1126.dtsi). Их свойства приведены ниже. Обозначение RV1106 отличается от RV1109 ранее в документе; расхождение сохранено для проверки.

Не более 4 линий данных;

Максимальная скорость 2.5Gbps/lane;

На RK356X имеется один стандартный физический DPHY MIPI CSI2 с режимами full mode и split mode. Он представлен тремя логическими DPHY: csi2_dphy0/csi2_dphy1/csi2_dphy2 (см. rk3568.dtsi). Свойства:

**Полный режим (Full mode)**

Используется только csi2_dphy0; он взаимно исключается с csi2_dphy1/csi2_dphy2, одновременное использование невозможно;

Не более 4 линий данных;

Максимальная скорость 2.5Gbps/lane;

**Разделённый режим (Split mode)**

Используются только csi2_dphy1 и csi2_dphy2, взаимно исключающие csi2_dphy0;

csi2_dphy1 и csi2_dphy2 можно использовать одновременно;

csi2_dphy1 и csi2_dphy2 имеют не более 2 линий данных каждый;

csi2_dphy1 соответствует lane0/lane1 физического DPHY;

csi2_dphy2 соответствует lane2/lane3 физического DPHY;

Максимальная скорость — 2.5Gbps/lane.

Конкретные примеры DTS приведены ниже.

###### 10.1.1.1.1 Подключение к ISP

**Платформа RV1126/RV1106 (обозначение исходника)**

Ниже приведён пример RV1126 ISP и os04a10.

**Связь: sensor-&gt;csi_dphy-&gt;isp-&gt;ispp**

arch/arm/boot/dts/RV1126-evb-v10.dtsi

**Основные настройки**

В data-lanes необходимо указать число используемых линий; иначе тип MIPI не будет распознан;

```text
  cam_ircut0: cam_ircut {
      status = "okay";
      compatible = "rockchip,ircut";
      ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
      ircut-close-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
  };
  os04a10: os04a10@36 {
      // Need to be consistent with the matching string in the driver
      compatible = "ovti,os04a10";
      reg = <0x36>;// sensor I2CDevice address, 7 bits
      clocks = <&cru CLK_MIPICSI_OUT>;// sensor clickinConfiguration
      clock-names = "xvclk";
      power-domains = <&power RV1126_PD_VI>;
      pinctrl-names = "rockchip,camera_default";
      pinctrl-0 = <&mipi_csi_clk0>;// pinctl Set up
      //power supply
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // power Pin assignment and effective level
      pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <1>;
      // Module orientation which are "back" and "front"
      rockchip,camera-module-facing = "front";
      // name of moudle
      rockchip,camera-module-name = "CMK-OT1607-FV1";
      // lens name
      rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
      //ir cut device
      ir-cut = <&cam_ircut0>;
      port {
          ucam_out0: endpoint {
              // mipi dphy port
              remote-endpoint = <&mipi_in_ucam0>;
              // number of mipi lane，1lane is <1>, 4lanei s <1 2 3 4>
              data-lanes = <1 2 3 4>;
          };
      };
   };
  &csi_dphy0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // mipi lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // name of isp port
                  remote-endpoint = <&isp_in>;
              };
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  // name of mipi dphy port
                  remote-endpoint = <&csidphy0_out>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_out: endpoint@1 {
                  reg = <1>;
                  // ispp port name, isp output to ispp
                  remote-endpoint = <&ispp0_in>;
              };
          };
      };
  };
  &rkispp {
      status = "okay";
  };
  &rkispp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          Ispp0_in: endpoint@0 {
              reg = <0>;
              // isp port name, ispp input
              remote-endpoint = <&isp0_out>;
          };
      };
  };
```

**Платформа RK356X**

Пример ниже использует rk3566 ISP и gc8034 с 4 линиями:

**Связь: sensor-&gt;csi2_dphy0-&gt;isp. Основные настройки:**

Необходимо настроить data-lanes.

Необходимо включить csi2_dphy_hw.

```text
      /* full mode: lane0-3 */
      gc8034: gc8034@37 {
          //Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc8034";
          status = "okay";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclk Source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          //sensor mclk pinctl set up
          pinctrl-names = "default";
          pinctrl-0 = <&cif_clk>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio4 RK_PB2 GPIO_ACTIVE_LOW>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // moudle name
          rockchip,camera-module-name = "RK-CMK-8M-2-v1";
          // lens name
          rockchip,camera-module-lens-name = "CK8401";
          port {
              gc8034_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy0_in>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
      &csi2_dphy_hw {
         status = "okay";
      };
      &csi2_dphy0 {
          //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually exclusive
          status = "okay";
          /*
           * dphy0 only used for full mode,
           * full mode and split mode are mutually exclusive
           */
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_in: endpoint@1 {
                      reg = <1>;
                      // The port name of the sensor
                      remote-endpoint = <&gc8034_out>;
                      // csi2 dphy lane number
                      data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_out: endpoint@1 {
                      reg = <1>;
                      // The port name of the isp
                      remote-endpoint = <&isp0_in>;
                  };
              };
          };
      };
  &rkisp {
      status = "okay";
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              // The port name of csi2 dphy
              remote-endpoint = <&dphy0_out>;
          };
      };
  };
```

###### 10.1.1.1.2 Подключение к VICAP

**Платформа RV1126/RV1109**

Пример подключения MIPI os04a10 с 4 линиями к VICAP:

**Связь: sensor-&gt;csi dphy-&gt;mipi csi host-&gt;vicap. Основные настройки:**

В data-lanes необходимо указать число используемых линий; иначе тип MIPI не будет распознан;

dphy нужно соединить с узлом CSI host.

```text
  os04a10: os04a10@36 {
          // Need to be consistent with the matching string in the driver
          compatible = "ovti,os04a10";
          // sensor I2C device address, 7 bits
          reg = <0x36>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "rockchip,camera_default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-40IRC-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is  <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2 , mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // csi2 dphy lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&csidphy0_out>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // Port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* sditf endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number, consistent with sensor
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //Endpoint name of vicap sditf
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

**Платформа RK356X**

Пример подключения gc5025 с 2 линиями к lane2/lane3 DPHY MIPI CSI2 платы rk3566 evb2:

**Связь: sensor-&gt;csi2 dphy-&gt;mipi csi host-&gt;vicap. Основные настройки:**

В data-lanes необходимо указать число используемых линий; иначе тип MIPI не будет распознан;

dphy нужно соединить с узлом CSI host.

Нужно включить узел csi2 dphy hw.

```text
  /* split mode: lane:2/3 */
  gc5025: gc5025@37 {
          status = "okay";
          // Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc5025";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclkSource configuration
          clocks = <&pmucru CLK_WIFI>;
          clock-names = "xvclk";
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&refclk_pins>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA5 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "TongJu";
          // lens name
          rockchip,camera-module-lens-name = "CHT842-MD";
          port {
              gc5025_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_in>;
                  // csi2 dphy lane name，2lane is <1 2>, 4lane is <1 2 3 4>
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy2 {
      //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually
  exclusivee;can be used in parallel with csi2_dphy1
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&gc5025_out>;
                  // csi2 dphy lane name
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_out>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // vicapport name
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number，consistent with sensor
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //vicap mipi sditf port name
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### 10.1.1.2 Интерфейс LVDS

###### 10.1.1.2.1 Подключение к VICAP

**Платформа RV1126/RV1109**

Пример для imx327 с 4 линиями; связь показана ниже:

**Связь: sensor-&gt;csi dphy-&gt;vicap. Основные настройки:**

dphy не должен соединяться с CSI host, иначе данные не принимаются.

data-lanes должен указывать фактическое число линий, иначе данные не принимаются.

bus-type должен быть равен 3, иначе LVDS не распознаётся и тракт не создаётся.

```text
  imx327: imx327@1a {
          // Need to be consistent with the matching string in the driver
          compatible = "sony,imx327";
          // sensor I2C device address, 7 bits
          reg = <0x1a>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
  };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // vicap liteport name
                  remote-endpoint = <&cif_lite_lvds_in>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
      };
  };
  &rkcif_lite_mipi_lvds {
      status = "okay";
      port {
          /* lvds endpoint */
          cif_lite_lvds_in: endpoint {
              // csi2 dphy port name
              remote-endpoint = <&csidphy0_out>;
              //csi2 dphy lvds lane name，1lane is <1>, 4lane is <4>，must be specified
              data-lanes = <4>;
              //Type of lvds interface, must be specified
              bus-type = <3>;
          };
      };
  };
  &rkcif_lite_sditf {
      status = "okay";
      port {
          /* lvds endpoint */
          lite_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //csi2 dphy lane number， consistent with sensor
              data-lanes = <4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //lite vicap lvds sditf port name
                  remote-endpoint = <&lite_sditf>;
              };
          };
      };
  };
```

##### 10.1.1.3 Интерфейс DVP

###### 10.1.1.3.1 Подключение к VICAP

На RV1126/RV1106/RK356X настройки DTS соответствующих интерфейсов DVP одинаковы. Обозначение RV1106 сохранено из исходника и требует сверки с указанной выше областью применения.

**BT601**

Пример для ar0230 BT601; связь показана ниже:

**Связь: sensor-&gt;vicap. Основные настройки:**

Для асинхронного распознавания BT601 в v4l2 нужны hsync-active/vsync-active, иначе определяется BT656.

pclk-sample/bus-width необязательны;

В g_mbus_config флагами должна задаваться активная полярность hsync-acitve/vsync-active/pclk-ative, иначе данные не принимаются; написания сохранены.

Правильно укажите pinctrl для IOMUX выводов BT601, иначе данные не принимаются.

Пример кода g_mbus_config:

```text
  static int ar0230_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_PARALLEL;
      config->flags = V4L2_MBUS_HSYNC_ACTIVE_HIGH |
              V4L2_MBUS_VSYNC_ACTIVE_HIGH |
              V4L2_MBUS_PCLK_SAMPLE_FALLING;
      return 0;
  }
```

Пример конфигурации DTS:

```text
  ar0230: ar0230@10 {
          // Need to be consistent with the matching string in the driver
          compatible = "aptina,ar0230";
          // sensor I2C device address, 7 bits
          reg = <0x10>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          power-domains = <&power RV1126_PD_VI>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
          //Configure dvp related data pins and clock pins
          pinctrl-names = "default";
          pinctrl-0 = <&cifm0_dvp_ctl>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // module name
          rockchip,camera-module-name = "CMK-OT0836-PT2";
          // lens name
          rockchip,camera-module-lens-name = "YT-2929";
          port {
              cam_para_out1: endpoint {
                  remote-endpoint = <&cif_para_in>;
              };
          };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out1>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

**BT656/BT1120**

Использование DTS для BT656 и BT1120 одинаково.

Пример для ava fpga bt1120; связь показана ниже:

**Связь: sensor-&gt;vicap. Основные настройки:**

Не задавайте hsync-active/vsync-active, иначе v4l2 при асинхронной регистрации распознает BT601;

pclk-sample/bus-width необязательны;

В g_mbus_config драйвер сенсора должен флагом указать активную полярность pclk-ative, иначе данные не принимаются (pclk-ative — написание исходника).

Необходимо реализовать querystd в v4l2_subdev_video_ops и указать, что текущий интерфейс относится к ATSC; иначе данные не принимаются.

Необходимо сослаться на pinctrl для настройки IOMUX GPIO bt656/bt1120; иначе приём данных невозможен.

Пример кода g_mbus_config:

```text
  static int avafpga_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_BT656;
      config->flags = V4L2_MBUS_PCLK_SAMPLE_RISING;
      return 0;
  }
```

Пример querystd:

```text
  static int avafpga_querystd(struct v4l2_subdev *sd, v4l2_std_id *std)
  {
      *std = V4L2_STD_ATSC;
      return 0;
  }
```

Пример конфигурации DTS:

```text
  avafpga: avafpga@70 {
      // Need to be consistent with the matching string in the driver
      compatible = "ava,fpga";
      // sensor I2C device address, 7 bits
      reg = <0x10>;
      // sensor mclkSource configuration
      clocks = <&cru CLK_CIF_OUT>;
      clock-names = "xvclk";
      //sensor Related power domain enable
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // powerdownPin assignment and effective level
      power-domains = <&power RV1126_PD_VI>;
      pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
      //Configure dvp related data pins and clock pins
      pinctrl-names = "default";
      pinctrl-0 = <&cifm0_dvp_ctl>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <0>;
      // Module orientation, there are "back" and "front"
      rockchip,camera-module-facing = "back";
      // module name
      rockchip,camera-module-name = "CMK-OT0836-PT2";
      // lens name
      rockchip,camera-module-lens-name = "YT-2929";
      port {
          cam_para_out2: endpoint {
              remote-endpoint = <&cif_para_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out2>;
              //Sensor configuration parameters，Optional
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

#### 10.1.2 Регистрация нескольких сенсоров

Один аппаратный ISP создаёт несколько виртуальных устройств и обрабатывает данные нескольких RAW-сенсоров с временным разделением.

VICAP RV1109/RV1126/RK356X сохраняет DVP RAW только неупакованным, а ISP по умолчанию обрабатывает упакованный RAW. См. раздел настройки формата хранения ISP/VICAP RAW.

#### 10.1.3 RV1126/RV1109

**Соединения isp0-&gt;ispp0 и isp1-&gt;ispp1 фиксированы в RV1126.dtsi.**

При достаточной полосе RV1109/RV1126 ISP/ISPP поддерживает до четырёх каналов; добавьте rkisp_vir0~rkisp_vir4/rkispp_vir0~rkispp_vir4 в rv1126.dtsi.

**Можно выбрать прямой вход MIPI в ISP либо вход через CIF.**

RV1109/RV1126 имеет два PHY, каждый используется как MIPI/LVDS с максимум 4 линиями, и один DVP с BT601/BT656/BT1120. ISP принимает MIPI либо DVP, но не одновременно. VICAP поддерживает MIPI/LVDS/DVP: MIPI и LVDS взаимоисключаются, DVP может работать одновременно с выбранным интерфейсом. VICAP Lite поддерживает только LVDS. Поэтому ISP обрабатывает до трёх RAW-сенсоров.

##### 10.1.3.1 Обработка двух камер ISP

**sensor0(mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1(mipi)-&gt;csi_dphy1-&gt;isp1-&gt;ispp1.**

Пример: arch/arm/boot/dts/RV1109-evb-ddr3-v12-facial-gate.dts.

gc2053-&gt;csi_dphy0-&gt;csi2-&gt;cif-&gt;isp1-&gt;ispp1

ov2718-&gt;csi_dphy1-&gt;isp0-&gt;ispp0

При разных разрешениях особенно важна следующая настройка: max-input берёт максимальные ширину, высоту и частоту кадров среди сенсоров.

```dts
&rkispp {
     status = "okay";
     /* the max input w h and fps of mulit sensor */
     max-input = <2688 1520 30>;//Take the maximum width and height and frame rate of different sensors
};
```

##### 10.1.3.2 Обработка трёх камер ISP

sensor0 (mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1 (mipi)-&gt;csi_dphy1-&gt;isp1-&gt;ispp1; sensor2 (DVP)-&gt;vicap-&gt;isp2-&gt;ispp2.

Или

sensor0 (mipi)-&gt;csi_dphy0-&gt;csi2-&gt;vicap-&gt;isp0-&gt;ispp0; sensor1 (lvds)-&gt;csi_dphy1-&gt;vicap lite-&gt;isp1-&gt;ispp1; sensor2 (DVP)-&gt;vicap-&gt;isp2-&gt;ispp2.

Например: bf2253-0(mipi)-&gt;dphy0-&gt;csi2-&gt;vicap(mipi)-&gt;isp0-&gt;ispp0; bf2253-1(mipi)-&gt;dphy1-&gt;isp1-&gt;ispp1; gc1054(dvp)-&gt;vicap(dvp)-&gt;isp2-&gt;ispp2.

```text
  &i2c1 {
      status = "okay";
      clock-frequency = <400000>;
      gc1054: gc1054@21 {
              compatible = "galaxycore,gc1054";
              reg = <0x21>;
              clocks = <&cru CLK_CIF_OUT>;
              clock-names = "xvclk";
              power-domains = <&power RV1126_PD_VI>;
              pwdn-gpios  = <&gpio3 RK_PA5 GPIO_ACTIVE_HIGH>;
              reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
              rockchip,grf = <&grf>;
              pinctrl-names = "default";
              pinctrl-0 = <&cifm0_dvp_ctl>;
              rockchip,camera-module-index = <0>;
              rockchip,camera-module-facing = "back";
              rockchip,camera-module-name = "GC1054_B";
              rockchip,camera-module-lens-name = "GC1054_LEN";
              port {
                      cam_para_out1: endpoint {
                      remote-endpoint = <&cif_para_in>;
                          bus-width = <10>;
                          hsync-active = <1>;
                          vsync-active = <1>;
              };
          };
      };
      bf2253_isp0: bf2253_isp0@6d {
            compatible = "ovti,bf2253_isp0";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            pinctrl-0   = <&mipicsi_clk0>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio1 RK_PD4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <1>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                cam_out1: endpoint {
                      remote-endpoint = <&mipi_in_ucam>;
                      data-lanes = <1>;
                  };
            };
       };
  };
  &i2c3 {
      status = "okay";
      clock-frequency = <400000>;
      pinctrl-names = "default";
      pinctrl-0 = <&i2c3m2_xfer>;
      bf2253_isp1: bf2253_isp1@6d {
            compatible = "ovti,bf2253_isp1";
            reg = <0x6d>;
            clocks = <&cru CLK_MIPICSI_OUT>;
            clock-names = "xvclk";
            power-domains = <&power RV1126_PD_VI>;
            pinctrl-names = "rockchip,camera_default";
            //pinctrl-names = "rockchip,camera_sleep";
            pinctrl-0 = <&mipicsi_clk1>;
            power-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
            pwdn-gpios  = <&gpio3 RK_PA4 GPIO_ACTIVE_LOW>;
            reset-gpios = <&gpio2 RK_PA0 GPIO_ACTIVE_HIGH>;
            avdd-supply  = <&vcc_3v3>;
            dovdd-supply = <&vcc_1v8>;
            dvdd-supply  = <&vcc_1v8>;
            rockchip,camera-module-index = <2>;
            rockchip,camera-module-facing = "front";
            rockchip,camera-module-name = "LA6110PA";
            rockchip,camera-module-lens-name = "YM6011P";
            port {
                 cam_out0: endpoint {
                     remote-endpoint = <&csi_dphy1_input>;
                     data-lanes = <1>;
                 };
            };
       };
  };
  &csi_dphy0 {
      status = "okay";
      ports {
          port@0 {
              mipi_in_ucam: endpoint@1 {
                  remote-endpoint = <&cam_out1>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy0_out: endpoint@0 {
                  remote-endpoint = <&mipi_csi2_input>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &csi_dphy1 {
      status = "okay";
      ports {
          port@0 {
              csi_dphy1_input: endpoint@1 {
                  remote-endpoint = <&cam_out0>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              csi_dphy1_output: endpoint@0 {
                  remote-endpoint = <&isp_in1>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          port@0 {
              mipi_csi2_input: endpoint@1 {
                  remote-endpoint = <&csi_dphy0_out>;
                  data-lanes = <1>;
              };
          };
          port@1 {
              mipi_csi2_output: endpoint@0 {
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          lvds_sditf: endpoint {
              remote-endpoint = <&isp_in0>;
              data-lanes = <1>;
          };
      };
  };
  &rkcif_dvp {
          status = "okay";
          //iommus = <&rkcif_mmu>;
          ///delete-property/ memory-region;
          port {
                  /* Parallel bus endpoint */
                  cif_para_in: endpoint {
                          remote-endpoint = <&cam_para_out1>;
                          bus-width = <8>;
                          hsync-active = <1>;
                          vsync-active = <1>;
                  };
          };
  };
  &rkcif_dvp_sditf {
          status = "okay";
          port {
                  /* Parallel bus endpoint */
          dvp_sditf: endpoint {
                          remote-endpoint = <&isp_in2>;
                  };
          };
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in0: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&lvds_sditf>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in1: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&csi_dphy1_output>;
              };
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in2: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
  &rkispp_vir0 {
      status = "okay";
  };
  &rkispp_vir1 {
      status = "okay";
  };
  &rkispp_vir2 {
          status = "okay";
  };
  &rkcif {
          status = "okay";
  };
  rkisp: rkisp@ffb50000 {
      status = "okay";
  };
  &rkispp {
      status = "okay";
      max-input = <1600 1200 30>;
      memory-region = <&isp_reserved>;
      /* the max input w h and fps of mulit sensor */
  };
   rkcif_mmu: iommu@ffae0800{
      status = "disabled";
  };
   rkisp_mmu: iommu@ffb51a00 {
      status = "disabled";
  };
  &rkispp_mmu {
      status = "disabled";
  };
```

#### 10.1.4 RK3566/RK3568

При достаточной полосе RK356X ISP поддерживает до четырёх каналов; добавьте rkisp_vir0~rkisp_vir4 в rk3568.dtsi.

**Можно выбрать прямой вход MIPI в ISP либо вход через CIF.**

RK356X имеет один PHY с 4 линиями, разделяемый на два PHY по 2 линии, и один DVP с BT601/BT656/BT1120. ISP использует MIPI либо DVP, не одновременно; VICAP допускает оба интерфейса одновременно. Поэтому ISP обрабатывает до трёх RAW-сенсоров.

##### 10.1.4.1 Обработка двух камер ISP:

Например:

ov5695-&gt;dphy1-&gt;isp_vir0

gc5025-&gt;dphy2-&gt;csi2-&gt;vicap-&gt;isp_vir1

```text
  ov5695: ov5695@36 {
          status = "okay";
          ...
          port {
              ov5695_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
  };
  gc5025: gc5025@37 {
          status = "okay";
          ...
          port {
              gc5025_out: endpoint {
                  remote-endpoint = <&dphy2_in>;
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy1 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc5025_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <2592 1944 30>;
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dphy1_out>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp1_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### 10.1.4.2 Обработка трёх камер ISP

Например: gc2053(mipi)-&gt;dphy1-&gt;isp0; sc1330(dvp)-&gt;vicap(dvp)-&gt;isp1; ov5695(mipi)-&gt;dphy2-&gt;csi2-&gt;vicap(mipi)-&gt;isp2.

```text
  &i2c2 {
      status = "okay";
      pinctrl-0 = <&i2c2m1_xfer>;
      /* split mode: lane0/1 */
      gc2053: gc2053@37 {
          status = "okay";
          compatible = "galaxycore,gc2053";
          reg = <0x37>;
          clocks = <&cru CLK_CAM0_OUT>;
          clock-names = "xvclk";
          /* Set pinctl of xvclk in &pinctl */
          power-domains = <&power RK3568_PD_VI>;
          reset-gpios = <&gpio4 RK_PB1 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PD0 GPIO_ACTIVE_LOW>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          rockchip,camera-module-index = <0>;
          rockchip,camera-module-facing = "front";
          rockchip,camera-module-name = "rgbd";
          rockchip,camera-module-lens-name = "Optics";
          port {
              gc2053_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &i2c3 {
      status = "okay";
      pinctrl-0 = <&i2c3m0_xfer>;
      sc1330: sc1330@32 {
          status = "okay";
          compatible = "smartsens,sc1330";
          reg = <0x32>;
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          power-domains = <&power RK3568_PD_VI>;
          pinctrl-names = "default";
          /* conflict with gmac1m1_rgmii_pins & cif_clk*/
          pinctrl-0 = <&cif_clk &cif_dvp_clk &cif_dvp_bus10>;
          /*avdd-supply = <&vcc2v8_dvp>;*/
          /*dovdd-supply = <&vcc1v8_dvp>;*/
          /*dvdd-supply = <&vcc1v8_dvp>;*/
          reset-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_LOW>;
          pwdn-gpios = <&gpio3 RK_PC7 GPIO_ACTIVE_LOW>;
          rockchip,camera-module-index = <2>;
          rockchip,camera-module-facing = "back";
          rockchip,camera-module-name = "default";
          rockchip,camera-module-lens-name = "default";
          port {
              sc1330_out: endpoint {
                  remote-endpoint = <&dvp_in_bcam>;
              };
          };
      };
  };
  &i2c4 {
      status = "okay";
      pinctrl-0 = <&i2c4m0_xfer>;
      clock-frequency = <1000000>;
      /* split mode: lane:2/3 */
      ov5695: ov5695@36 {
                  status = "okay";
                  compatible = "ovti,ov5695";
                  reg = <0x36>;
                  clocks = <&cru CLK_CAM0_OUT>;
                  clock-names = "xvclk";
                  power-domains = <&power RK3568_PD_VI>;
                  pinctrl-names = "default";
                  pinctrl-0 = <&cif_clk>;
                  reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_HIGH>;
                  pwdn-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
                  rockchip,camera-module-index = <1>;
                  rockchip,camera-module-facing = "front";
                  rockchip,camera-module-name = "TongJu";
                  rockchip,camera-module-lens-name = "CHT842-MD";
                  port {
                          ov5695_out: endpoint {
                                  remote-endpoint = <&dphy2_in>;
                                  data-lanes = <1 2>;
                          };
                  };
      };
  };
  &csi2_dphy_hw {
      status = "okay";
  };
  &csi2_dphy1 {
      status = "okay";
      /*
       * dphy1 only used for split mode,
       * can be used  concurrently  with dphy2
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc2053_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif {
      status = "okay";
  };
  &rkcif_mmu {
      status = "okay";
  };
  &rkcif_mipi_lvds {
      status = "okay";
      /* csi2 link to rkcif, using rkcif to capture stream */
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp2_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          dvp_in_bcam: endpoint {
              remote-endpoint = <&sc1330_out>;
              bus-width = <10>;
              vsync-active = <0>;
              hsync-active = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      /* parallel endpoint */
      port {
          dvp_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              bus-width = <10>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <1920 1080 30>;
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dphy1_out>;
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp1_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&dvp_sditf>;
          };
      };
  };
  &rkisp_vir2 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp2_in: endpoint@0 {
              reg = <0>;
              remote-endpoint = <&mipi_lvds_sditf>;
          };
      };
  };
```

### 10.2 Описание драйвера CIS

Сенсор камеры взаимодействует с основным контроллером по I2C. Драйвер сенсора реализован как драйвер устройства I2C и использует v4l2 subdev для взаимодействия с драйвером контроллера.

#### 10.2.1 Краткое описание типов данных

##### 10.2.1.1 struct i2c_driver

[Описание]

Определяет сведения о драйвере устройства I2C.

[Определение]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p113, table unit 594 -->

| Имя поля | Описание |
| --- | --- |
| @driver | Драйвер модели устройств содержит имя и of_match_table для сопоставления устройств DTS. При совпадении compatible таблицы и DTS вызывается .probe. |
| @id_table | Список поддерживаемых I2C-устройств; используется ядром, если сопоставление через of_match_table и DTS не применяется. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  #if IS_ENABLED(CONFIG_OF)
  static const struct of_device_id os04a10_of_match[] = {
      { .compatible = "ovti,os04a10" },
      {},
  };
  MODULE_DEVICE_TABLE(of, os04a10_of_match);
  #endif
  static const struct i2c_device_id os04a10_match_id[] = {
      { "ovti,os04a10", 0 },
      { },
  };
  static struct i2c_driver os04a10_i2c_driver = {
      .driver = {
          .name = OS04A10_NAME,
          .pm = &os04a10_pm_ops,
          .of_match_table = of_match_ptr(os04a10_of_match),
      },
      .probe      = &os04a10_probe,
      .remove     = &os04a10_remove,
      .id_table   = os04a10_match_id,
  };
  static int __init sensor_mod_init(void)
  {
      return i2c_add_driver(&os04a10_i2c_driver);
  }
  static void __exit sensor_mod_exit(void)
  {
      i2c_del_driver(&os04a10_i2c_driver);
  }
  device_initcall_sync(sensor_mod_init);
  module_exit(sensor_mod_exit);
```

##### 10.2.1.2 struct v4l2_subdev_ops

[Описание]

Определяет обратные вызовы ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_ops {
      const struct v4l2_subdev_core_ops   *core;
      ……
      const struct v4l2_subdev_video_ops  *video;
      ……
      const struct v4l2_subdev_pad_ops    *pad;
  };
```

[Основные члены]

<!-- Source: English PDF p114, table unit 604 -->

| Имя поля | Описание |
| --- | --- |
| .core | Определяет core ops для subdev |
| .video | Обратные вызовы при открытии v4l-устройства в видеорежиме |
| .pad | Операции уровня pad v4l2-subdev |

[Пример]

```text
  static const struct v4l2_subdev_ops os04a10_subdev_ops = {
      .core   = &os04a10_core_ops,
      .video  = &os04a10_video_ops,
      .pad    = &os04a10_pad_ops,
  };
```

##### 10.2.1.3 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      int (*s_power)(struct v4l2_subdev *sd, int on);
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
          unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p115, table unit 613 -->

| Имя поля | Описание |
| --- | --- |
| .s_power | Переводит subdevice в энергосбережение (on == 0) либо нормальный режим (on == 1). |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops os04a10_core_ops = {
      .s_power = os04a10_s_power,
      .ioctl = os04a10_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = os04a10_compat_ioctl32,
  #endif
  };
```

Следующие частные ioctl используются для запроса сведений о модуле, а также запроса и настройки OTP.

<!-- Source: English PDF p116, table unit 617 -->

| Частный ioctl | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Получает сведения о модуле; см. struct rkmodule_inf. |
| RKMODULE_AWB_CFG | Переключает компенсацию AWB sensor; если golden AWB не записан в модуле, его можно задать здесь; см. struct rkmodule awb_cfg (написание исходника). |
| RKMODULE_LSC_CFG | Переключает компенсацию LSC sensor; см. struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | Настройка экспозиции HDR; см. struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Задаёт HDR и переключение обычного/HDR-режима. Драйвер должен поддерживать оба набора настроек; см. struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Получает текущий HDR-режим; см. struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Задаёт conversion gain линейного режима, например imx347/os04a10; если sensor не поддерживает функцию, реализация необязательна. |

##### 10.2.1.4 struct v4l2_subdev_video_ops

[Описание]

Обратные вызовы при открытии устройства v4l в видеорежиме.

[Определение]

```text
  struct v4l2_subdev_video_ops {
      ……
      int (*s_stream)(struct v4l2_subdev *sd, int enable);
      ……
      int (*g_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_frame_interval *interval);
      int (*g_mbus_config)(struct v4l2_subdev *sd,
                 struct v4l2_mbus_config *cfg);
   ……
  };
```

[Основные члены]

<!-- Source: English PDF p117, table unit 624 -->

| Имя поля | Описание |
| --- | --- |
| .g_frame_interval | Обработчик VIDIOC_SUBDEV_G_FRAME_INTERVAL ioctl |
| .s_stream | Уведомляет драйвер о начале либо остановке потока |
| .g_mbus_config | Получает поддерживаемые конфигурации mediabus |

[Пример]

```text
  static const struct v4l2_subdev_video_ops os04a10_video_ops = {
      .s_stream = os04a10_s_stream,
      .g_frame_interval = os04a10_g_frame_interval,
      .g_mbus_config = os04a10_g_mbus_config,
  };
```

##### 10.2.1.5 struct v4l2_subdev_pad_ops

[Описание]

Операции уровня pad для v4l2-subdev.

[Определение]

```text
  struct v4l2_subdev_pad_ops {
      ……
      int (*enum_mbus_code)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_mbus_code_enum *code);
      int (*enum_frame_size)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_size_enum *fse);
      int (*get_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*set_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*enum_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_interval_enum *fie);
      int (*get_selection)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_selection *sel);
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p118, table unit 633 -->

| Имя поля | Описание |
| --- | --- |
| . enum_mbus_code | Обработчик VIDIOC_SUBDEV_ENUM_MBUS_CODE ioctl |
| . enum_frame_size | Обработчик VIDIOC_SUBDEV_ENUM_FRAME_SIZE ioctl |
| .s_fmt | Обработчик VIDIOC_SUBDEV_S_FMT ioctl |
| .g_fmt | Обработчик VIDIOC_SUBDEV_G_FMT ioctl |
| .enum_frame_interval | Обработчик VIDIOC_SUBDEV_ENUM_FRAME_INTERVAL() ioctl |
| .get_selection | Обработчик VIDIOC_SUBDEV_G_SELECTION() ioctl |

[Пример]

```text
  static const struct v4l2_subdev_pad_ops os04a10_pad_ops = {
      .enum_mbus_code = os04a10_enum_mbus_code,
      .enum_frame_size = os04a10_enum_frame_sizes,
      .enum_frame_interval = os04a10_enum_frame_interval,
      .get_fmt = os04a10_get_fmt,
      .set_fmt = os04a10_set_fmt,
  };
```

##### 10.2.1.6 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p118, table unit 642 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control |

[Пример]

```text
  static const struct v4l2_ctrl_ops os04a10_ctrl_ops = {
      .s_ctrl = os04a10_set_ctrl,
  };
```

RKISP требует использовать пользовательские элементы управления фреймворка. Драйвер сенсора камеры должен реализовать следующие функции управления; см. список V4L2-controls драйвера CIS (в исходной ссылке имеется завершающая цифра 1).

##### 10.2.1.7 struct xxxx_mode

[Описание]

Сведения обо всех режимах, поддерживаемых сенсором.

Эта структура часто встречается в драйверах сенсоров, хотя стандарт v4l2 её не требует.

[Определение]

```text
  struct xxxx_mode {
      u32 bus_fmt;
      u32 width;
      u32 height;
      struct v4l2_fract max_fps;
      u32 hts_def;
      u32 vts_def;
      u32 exp_def;
      const struct regval *reg_list;
      u32 hdr_mode;
      u32 vc[PAD_MAX];
  };
```

[Основные члены]

<!-- Source: English PDF p119, table unit 653 -->

| Имя поля | Описание |
| --- | --- |
| .bus_fmt | Формат выхода sensor; см. MEDIA_BUS_FMT |
| .width | Эффективная ширина изображения должна совпадать с текущей выходной шириной sensor. |
| .height | Эффективная высота изображения должна совпадать с текущей выходной высотой sensor. |
| .max_fps | Частота кадров: denominator/numerator равняется fps. |
| hts_def | HTS по умолчанию: эффективная ширина + HBLANK. |
| vts_def | VTS по умолчанию: эффективная высота + VBLANK. |
| exp_def | Экспозиция по умолчанию |
| *reg_list | Список регистров |
| .hdr_mode | Режим sensor: линейный, HDR из двух либо трёх кадров. |
| .vc[PAD_MAX] | Настройка канала MIPI VC |

[Пример]

```text
   enum os04a10_max_pad {
      PAD0, /* link to isp */
      PAD1, /* link to csi rawwr0 | hdr x2:L x3:M */
      PAD2, /* link to csi rawwr1 | hdr    x3:L */
      PAD3, /* link to csi rawwr2 | hdr x2:M x3:S */
      PAD_MAX,
  };
  static const struct os04a10_mode supported_modes[] = {
      {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 300372,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0984,
          .reg_list = os04a10_linear12bit_2688x1520_regs,
          .hdr_mode = NO_HDR,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
      }, {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 225000,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0658,
          .reg_list = os04a10_hdr12bit_2688x1520_regs,
          .hdr_mode = HDR_X2,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
          .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
      },
  };
```

##### 10.2.1.8 struct v4l2_mbus_framefmt

[Описание]

Формат кадра на медиашине.

[Определение]

```text
  struct v4l2_mbus_framefmt {
      __u32           width;
      __u32           height;
      __u32           code;
      __u32           field;
      __u32           colorspace;
      __u16           ycbcr_enc;
      __u16           quantization;
      __u16           xfer_func;
      __u16           reserved[11];
  };
```

[Основные члены]

<!-- Source: English PDF p121, table unit 663 -->

| Имя поля | Описание |
| --- | --- |
| width | Ширина кадра |
| height | Высота кадра |
| code | См. таблицу MEDIA_BUS_FMT |
| field | V4L2_FIELD_NONE: кадровый вывод; V4L2_FIELD_INTERLACED: полевой вывод. |

[Пример]

##### 10.2.1.9 struct rkmodule_base_inf

[Описание]

Основные сведения о модуле, используемые верхним уровнем для выбора IQ.

[Определение]

```text
  struct rkmodule_base_inf {
      char sensor[RKMODULE_NAME_LEN];
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p121, table unit 671 -->

| Имя поля | Описание |
| --- | --- |
| sensor | Имя sensor, получаемое из его драйвера. |
| module | Имя модуля из DTS, согласно документации модуля. |
| lens | Имя объектива из DTS, согласно документации модуля. |

[Пример]

##### 10.2.1.10 struct rkmodule_fac_inf

[Описание]

Заводские сведения OTP модуля.

[Определение]

```text
  struct rkmodule_fac_inf {
      __u32 flag;
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
      __u32 year;
      __u32 month;
      __u32 day;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p122, table unit 679 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| module | Имя модуля определяется по номеру, прочитанному из OTP. |
| lens | Имя объектива определяется по номеру из OTP. |
| year | Год выпуска: например, 12 означает 2012. |
| month | Месяц выпуска |
| day | Дата выпуска |

[Пример]

##### 10.2.1.11 struct rkmodule_awb_inf

[Описание]

Измеренные сведения AWB в OTP модуля.

[Определение]

```text
  struct rkmodule_awb_inf {
      __u32 flag;
      __u32 r_value;
      __u32 b_value;
      __u32 gr_value;
      __u32 gb_value;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p123, table unit 687 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| r_value | Измерение AWB R текущего модуля |
| b_value | Измерение AWB B текущего модуля |
| gr_value | Измерение AWB GR текущего модуля |
| gb_value | Измерение AWB GB текущего модуля |
| golden_r_value | AWB R типового модуля; 0, если не записано. |
| golden_b_value | AWB B типового модуля; 0, если не записано. |
| golden_gr_value | AWB GR типового модуля; 0, если не записано. |
| golden_gb_value | AWB GB типового модуля; 0, если не записано. |

[Пример]

##### 10.2.1.12 struct rkmodule_lsc_inf

[Описание]

Измеренные сведения LSC в OTP модуля.

[Определение]

```text
  struct rkmodule_lsc_inf {
      __u32 flag;
      __u16 lsc_w;
      __u16 lsc_h;
      __u16 decimal_bits;
      __u16 lsc_r[RKMODULE_LSCDATA_LEN];
      __u16 lsc_b[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gr[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gb[RKMODULE_LSCDATA_LEN];
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p124, table unit 695 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| lsc_w | Фактическая ширина таблицы LSC |
| lsc_h | Фактическая высота таблицы LSC |
| decimal_bits | Число дробных разрядов измерений LSC; при отсутствии — 0. |
| lsc_r | Измерения LSC R |
| lsc_b | Измерения LSC B |
| lsc_gr | Измерения LSC GR |
| lsc_gb | Измерения LSC GB |

[Пример]

##### 10.2.1.13 struct rkmodule_af_inf

[Описание]

Измеренные сведения AF в OTP модуля.

[Определение]

```text
  struct rkmodule_af_inf {
      __u32 flag; // Whether this group of information is a valid flag
      __u32 vcm_start; // vcm start current
      __u32 vcm_end; // vcm termination current
      __u32 vcm_dir; // vcm measurement direction
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p124, table unit 703 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| vcm_start | Начальный ток VCM |
| vcm_end | Конечный ток VCM |
| vcm_dir | Направление определения VCM |

[Пример]

##### 10.2.1.14 struct rkmodule_inf

[Описание]

Сведения о модуле.

[Определение]

```text
  struct rkmodule_inf {
      struct rkmodule_base_inf base;
      struct rkmodule_fac_inf fac;
      struct rkmodule_awb_inf awb;
      struct rkmodule_lsc_inf lsc;
      struct rkmodule_af_inf af;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p125, table unit 711 -->

| Имя поля | Описание |
| --- | --- |
| base | Основные сведения модуля |
| fac | Заводские сведения OTP модуля |
| awb | Измерения AWB в OTP модуля |
| lsc | Измерения LSC в OTP модуля |
| af | Измерения AF в OTP модуля |

[Пример]

##### 10.2.1.15 struct rkmodule_awb_cfg

[Описание]

Конфигурация AWB в OTP модуля.

[Определение]

```text
  struct rkmodule_awb_cfg {
      __u32 enable;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p126, table unit 719 -->

| Имя поля | Описание |
| --- | --- |
| enable | Признак включения коррекции AWB |
| golden_r_value | Измерения AWB R типового модуля |
| golden_b_value | Измерения AWB B типового модуля |
| golden_gr_value | Измерения AWB GR типового модуля |
| golden_gb_value | Измерения AWB GB типового модуля |

[Пример]

##### 10.2.1.16 struct rkmodule_lsc_cfg

[Описание]

Конфигурация LSC в OTP модуля.

[Определение]

```text
  struct rkmodule_lsc_cfg {
      __u32 enable;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p126, table unit 727 -->

| Имя поля | Описание |
| --- | --- |
| enable | Признак включения коррекции LSC |

[Пример]

##### 10.2.1.17 struct rkmodule_hdr_cfg

[Описание]

Сведения о конфигурации HDR.

[Определение]

```text
  struct rkmodule_hdr_cfg {
      __u32 hdr_mode;
      struct rkmodule_hdr_esp esp;
  } __attribute__ ((packed));
  struct rkmodule_hdr_esp {
      enum hdr_esp_mode mode;
      union {
          struct {
              __u32 padnum;
              __u32 padpix;
          } lcnt;
          struct {
              __u32 efpix;
              __u32 obpix;
          } idcd;
      } val;
  };
```

[Основные члены]

<!-- Source: English PDF p127, table unit 736 -->

| Имя поля | Описание |
| --- | --- |
| hdr_mode | NO_HDR=0 //обычный режим<br>HDR_X2=5 //HDR из 2 кадров<br>HDR_X3=6 //HDR из 3 кадров |
| struct rkmodule_hdr_esp | Специальный режим HDR |
| enum hdr_esp_mode | HDR_NORMAL_VC=0 //обычный режим виртуального канала<br>HDR_LINE_CNT=1 //счётчик строк (AR0239)<br>HDR_ID_CODE=2 //код идентификации (IMX327) |

[Пример]

##### 10.2.1.18 struct preisp_hdrae_exp_s

[Описание]

Параметры экспозиции HDR.

[Определение]

```text
  struct preisp_hdrae_exp_s {
      unsigned int long_exp_reg;
      unsigned int long_gain_reg;
      unsigned int middle_exp_reg;
      unsigned int middle_gain_reg;
      unsigned int short_exp_reg;
      unsigned int short_gain_reg;
      unsigned int long_exp_val;
      unsigned int long_gain_val;
      unsigned int middle_exp_val;
      unsigned int middle_gain_val;
      unsigned int short_exp_val;
      unsigned int short_gain_val;
      unsigned char long_cg_mode;
      unsigned char middle_cg_mode;
      unsigned char short_cg_mode;
  };
```

[Основные члены]

<!-- Source: English PDF p128, table unit 744 -->

| Имя поля | Описание |
| --- | --- |
| long_exp_reg | Значение регистра экспозиции длинного кадра |
| long_gain_reg | Значение регистра усиления длинного кадра |
| middle_exp_reg | Значение регистра экспозиции среднего кадра |
| middle_gain_reg; | Значение регистра усиления среднего кадра |
| short_exp_reg | Значение регистра экспозиции короткого кадра |
| short_gain_reg | Значение регистра усиления короткого кадра |
| long_cg_mode | Conversion gain длинного кадра: 0 LCG, 1 HCG |
| middle_cg_mode | Conversion gain среднего кадра: 0 LCG, 1 HCG |
| short_cg_mode | Conversion gain короткого кадра: 0 LCG, 1 HCG |

[Описание]

В preisp_hdrae_exp_s достаточно учитывать параметры из описания ключевых членов. Формулы преобразования экспозиции и усиления в регистры находятся в IQ XML; см. описание его формата. Conversion gain требует поддержки сенсора; иначе этот параметр можно не учитывать. Для HDR2X переданные параметры среднего и короткого кадров записываются в регистры экспозиции соответствующих двух кадров сенсора.

[Пример]

#### 10.2.2 Краткое описание API

##### 10.2.2.1 xxxx_set_fmt

[Описание]

Устанавливает выходной формат сенсора.

[Синтаксис]

```text
  static int xxxx_set_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Параметры]

<!-- Source: English PDF p128, table unit 756 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fmt | Указатель структуры формата media bus уровня pad | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p129, table unit 758 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.2 xxxx_get_fmt

[Описание]

Получает выходной формат сенсора.

[Синтаксис]

```text
  static int xxxx_get_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Параметры]

<!-- Source: English PDF p129, table unit 765 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fmt | Указатель структуры формата media bus уровня pad | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p129, table unit 767 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

См. таблицу MEDIA_BUS_FMT.

##### 10.2.2.3 xxxx_enum_mbus_code

[Описание]

Перечисляет выходные форматы шины сенсора.

[Синтаксис]

```text
  static int xxxx_enum_mbus_code(struct v4l2_subdev *sd,
                                 struct v4l2_subdev_pad_config *cfg,
                                 struct v4l2_subdev_mbus_code_enum *code)
```

[Параметры]

<!-- Source: English PDF p130, table unit 775 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *code | Указатель структуры перечисления форматов media bus | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p130, table unit 777 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Ниже сведены соответствующие форматы разных типов изображений; см. таблицу MEDIA_BUS_FMT.

##### 10.2.2.4 xxxx_enum_frame_sizes

[Описание]

Перечисляет выходные размеры изображения сенсора.

[Синтаксис]

```text
  static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                              struct v4l2_subdev_pad_config *cfg,
                              struct v4l2_subdev_frame_size_enum *fse)
```

[Параметры]

<!-- Source: English PDF p130, table unit 785 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fse | Указатель структуры размера кадра media bus | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p130, table unit 787 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.5 xxxx_g_frame_interval

[Описание]

Получает частоту выходных кадров сенсора.

[Синтаксис]

```text
  static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                   struct v4l2_subdev_frame_interval *fi)
```

[Параметры]

<!-- Source: English PDF p131, table unit 794 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *fi | Указатель структуры частоты кадров уровня pad | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p131, table unit 796 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.6 xxxx_s_stream

[Описание]

Настраивает ввод и вывод потока.

[Синтаксис]

```text
  static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

[Параметры]

<!-- Source: English PDF p131, table unit 803 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| on | 1: начать поток; 0: остановить поток. | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p131, table unit 805 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.7 xxxx_runtime_resume

[Описание]

Обратный вызов при включении питания сенсора.

[Синтаксис]

```text
  static int xxxx_runtime_resume(struct device *dev)
```

[Параметры]

<!-- Source: English PDF p132, table unit 812 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *dev | Указатель структуры device | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p132, table unit 814 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.8 xxxx_runtime_suspend

[Описание]

Обратный вызов при выключении питания сенсора.

[Синтаксис]

```text
  static int xxxx_runtime_suspend(struct device *dev)
```

[Параметры]

<!-- Source: English PDF p132, table unit 821 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *dev | Указатель структуры device | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p132, table unit 823 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.9 xxxx_set_ctrl

[Описание]

Задать значение каждого control.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p133, table unit 830 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2_ctrl | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p133, table unit 832 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.10 xxx_enum_frame_interval

[Описание]

Перечислить поддерживаемые сенсором параметры межкадрового интервала.

[Синтаксис]

```text
  static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                      struct v4l2_subdev_pad_config *cfg,
                      struct v4l2_subdev_frame_interval_enum *fie)
```

[Параметры]

<!-- Source: English PDF p133, table unit 839 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Экземпляр subdevice | Вход |
| *cfg | Параметры конфигурации pad | Вход |
| *fie | Параметр интервала кадров | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p133, table unit 841 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.11 xxxx_g_mbus_config

[Описание]

Получить поддерживаемую конфигурацию шины. Например, если сенсор поддерживает несколько режимов передачи MIPI, параметры можно передавать в соответствии с текущим режимом MIPI сенсора.

[Синтаксис]

```text
  static int xxxx_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
```

[Параметры]

<!-- Source: English PDF p134, table unit 848 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *config | Параметры шины | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p134, table unit 850 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 10.2.2.12 xxxx_get_selection

[Описание]

Настроить параметры обрезки. Ширина входа ISP должна быть кратна 16, высота — 8. Если выходное разрешение сенсора не отвечает требованиям выравнивания или не является стандартным, эта функция позволяет обрезать изображение на входе ISP.

[Синтаксис]

```text
  static int xxxx_get_selection(struct v4l2_subdev *sd,
  struct v4l2_subdev_pad_config *cfg,
  struct v4l2_subdev_selection *sel)
```

[Параметры]

<!-- Source: English PDF p134, table unit 857 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Экземпляр subdevice | Вход |
| *cfg | Параметры конфигурации pad | Вход |
| *sel | Параметры кадрирования | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p135, table unit 859 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 10.2.3 Этапы переноса драйвера

**1. Реализуйте стандартную часть драйвера подустройства I2C.**

1.1 Реализовать следующие члены согласно описанию struct i2c_driver:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe: 1). Получить ресурсы устройства CIS, главным образом разобрав ресурсы, определённые в DTS; см. регистрацию устройства CIS (DTS).

1.1) Частные ресурсы RK именуются rockchip,camera-module-xxx; драйвер передаёт их пользовательскому camera_engine для выбора параметров IQ.

1.2) Определение ресурсов CIS: соответствующие эталонные драйверы RK обычно включают следующие элементы:

<!-- Source: English PDF p135, table unit 871 -->

| Имя поля | Описание |
| --- | --- |
| Опорный такт CIS | При отдельном внешнем кварце получение не нужно. В референсной схеме RK такт обычно выдаёт AP; его нужно получить, обычно имя — xvclk. |
| Управляющие GPIO CIS | Например, выводы Resst и Powerdown (написание Resst сохранено). |
| Управляемое питание CIS | Получите программные ресурсы управления питанием по схеме: gpio, regulator. |

1.3) Проверка ID устройства CIS. После получения необходимых ресурсов рекомендуется прочитать ID устройства для проверки аппаратной части; этот шаг не является обязательным.

1.4) Инициализировать устройство CIS v4l2 и сущности media;

Подустройство v4l2: v4l2_i2c_subdev_init. В драйвере RK CIS subdev должен иметь собственный узел устройства для доступа пользовательского rk_aiq и управления экспозицией;

Сущность media: media_entity_init

2\. Реализуйте драйвер подустройства v4l2 по описанию struct v4l2_subdev_ops; главным образом реализуются следующие три члена:

```text
  struct v4l2_subdev_core_ops
  struct v4l2_subdev_video_ops
  struct v4l2_subdev_pad_ops
```

2.1 Реализовать обратные вызовы согласно описанию struct v4l2_subdev_core_ops, прежде всего следующие:

```text
.s_power.ioctl
.compat_ioctl32
```

Основные частные команды управления RK, реализуемые ioctl:

<!-- Source: English PDF p136, table unit 883 -->

| Имя поля | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Передаёт сведения модуля из DTS (например имя) в camera_engine этой командой. |
| RKMODULE_AWB_CFG | При включённой OTP camera_engine передаёт эталонные значения AWB. Драйвер CIS сравнивает их с AWB текущего модуля, формирует R/B Gain и задаёт их блоку MWB CIS. |
| RKMODULE_LSC_CFG | При включённой OTP camera_engine этой командой управляет применением LSC-калибровки. |
| PREISP_CMD_SET_HDRAE_EXP | Настройки HDR-экспозиции см. в struct preisp_hdrae_exp_s этого документа. |
| RKMODULE_SET_HDR_CFG | Задаёт HDR и переключение обычного/HDR-режима. Нужны два набора настроек драйвера; см. struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Получает текущий HDR-режим; см. struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Задаёт conversion gain линейного режима, например imx347/os04a10. Высокий conversion gain улучшает SNR при слабом свете; при отсутствии поддержки реализация необязательна. |

2.2 Реализовать обратные вызовы согласно описанию struct v4l2_subdev_video_ops, прежде всего следующие:

<!-- Source: English PDF p137, table unit 885 -->

| Имя поля | Описание |
| --- | --- |
| .s_stream | Переключает поток. При continuous MIPI CLK поток нужно включать именно здесь; преждевременное включение мешает распознать MIPI LP. |
| .g_frame_interval | Получает интервал кадров (частоту) |
| .g_mbus_config | Получает настройки шины. Для sensor MIPI с разными lane либо HDR возвращает конфигурацию текущего режима. |

2.3 Реализовать обратные вызовы согласно описанию struct v4l2_subdev_pad_ops, прежде всего следующие:

<!-- Source: English PDF p137, table unit 887 -->

| Имя поля | Описание |
| --- | --- |
| .enum_mbus_code | Перечисляет форматы текущего драйвера CIS |
| .enum_frame_size | Перечисляет разрешения текущего драйвера CIS |
| .get_fmt | Обязательный callback, через который RKISP получает формат CIS. Типы Bayer raw, SOC yuv, BW raw см. в MEDIA_BUS_FMT; полевой вывод — struct v4l2_mbus_framefmt. |
| .set_fmt | Задаёт формат и разрешение CIS; реализация обязательна. |
| .enum_frame_interval | Перечисляет интервалы кадров sensor с указанием разрешения. |
| .get_selection | Настройка кадрирования; ширина ISP кратна 16, высота — 8. |

2.4 Реализовать согласно описанию struct v4l2_ctrl_ops, прежде всего следующие обратные вызовы:

<!-- Source: English PDF p137, table unit 889 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | RKISP и camera_engine управляют экспозицией CIS различными командами. |

Реализовать каждый control ID по списку V4L2-controls драйвера CIS. Следующие ID предназначены для получения информации и реализуются как стандартные целочисленные меню controls:

<!-- Source: English PDF p138, table unit 891 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_LINK_FREQ | См. стандартные V4L2 controls драйвера CIS; RKISP получает этой командой частоту MIPI. |
| V4L2_CID_PIXEL_RATE | Для MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample. |
| V4L2_CID_HBLANK | См. стандартное определение V4L2 controls драйвера CIS. |
| V4L2_CID_VBLANK | См. стандартное определение V4L2 controls драйвера CIS. |

RK camera_engine получает через эти команды информацию для расчёта экспозиции. Используются следующие формулы:

| Формула |
| --- |
| `line_time = HTS / PIXEL_RATE;` |
| `PIXEL_RATE = HTS * VTS * FPS` |
| `HTS = sensor_width_out + HBLANK;` |
| `VTS = sensor_height_out + VBLANK;` |

Следующие ID относятся к управлению: через эти команды RK camera_engine управляет CIS:

<!-- Source: English PDF p138, table unit 899 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Изменяет VBLANK, затем частоту кадров и максимум экспозиции. |
| V4L2_CID_EXPOSURE | Задаёт экспозицию в строках. |
| V4L2_CID_ANALOGUE_GAIN | Задаёт усиление экспозиции: общее = аналоговое × цифровое; единица — значение регистра усиления. |

3\. Драйвер CIS не определяет аппаратный интерфейс данных; соединение CIS с AP описывается port узла DTS. См. Port в разделе регистрации CIS (DTS). 4. Список эталонных драйверов CIS.

## 11. Драйвер VCM

### 11.1 Регистрация устройства VCM (DTS)

**Описание частных параметров драйвера RK VCM:**

<!-- Source: English PDF p139, table unit 904 -->

| Название | Описание |
| --- | --- |
| Начальный ток | Ток IC VCM, при котором объектив только начинает движение от ближнего края хода (фокус модуля вдаль), определяется как начальный. |
| Номинальный ток | Ток IC VCM, при котором объектив достигает дальнего края хода (ближний фокус модуля), определяется как номинальный. |
| Режим выходного тока VCM | При движении VCM возникают колебания. Изменение тока IC должно учитывать их период для подавления; режим задаёт время достижения целевого тока. |

```text
  vm149c: vm149c@0c { // vcm driver configuration, this set up is required when supporting AF
      compatible = "silicon touch,vm149c";
      status = "okay";
      reg = <0x0c>;
      rockchip,vcm-start-current = <0>;// Starting current of the motor
      rockchip,vcm-rated-current = <100>; // Motor rated current
      rockchip,vcm-step-mode = <4>; // Current output mode of motor drive IC
      rockchip,camera-module-index = <0>; // Module number
      rockchip,camera-module-facing = "back"; // Module orientation, there are "back" and "front"
  };
  ov13850: ov13850@10 {
      ......
      lens-focus = <&vm149c>; // vcm driver set up, need to have this set up when supporting AF
      ......
  };
```

### 11.2 Описание драйвера VCM

#### 11.2.1 Краткое описание типов данных

##### 11.2.1.1 struct i2c_driver

[Описание]

Определяет сведения о драйвере устройства I2C.

[Определение]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p140, table unit 914 -->

| Имя поля | Описание |
| --- | --- |
| @driver | Драйвер модели устройств содержит имя и of_match_table для сопоставления устройств DTS. При совпадении compatible таблицы и DTS вызывается .probe. |
| @id_table | Список поддерживаемых I2C-устройств; используется ядром, если сопоставление через of_match_table и DTS не применяется. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  static const struct i2c_device_id vm149c_id_table[] = {
      { VM149C_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, vm149c_id_table);
  static const struct of_device_id vm149c_of_table[] = {
      { .compatible = "silicon touch,vm149c" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, vm149c_of_table);
  static const struct dev_pm_ops vm149c_pm_ops = {
      SET_SYSTEM_SLEEP_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume)
      SET_RUNTIME_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume, NULL)
  };
  static struct i2c_driver vm149c_i2c_driver = {
      .driver = {
          .name = VM149C_NAME,
          .pm = &vm149c_pm_ops,
          .of_match_table = vm149c_of_table,
      },
      .probe = &vm149c_probe,
      .remove = &vm149c_remove,
      .id_table = vm149c_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### 11.2.1.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
                             unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p141, table unit 923 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops vm149c_core_ops = {
      .ioctl = vm149c_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = vm149c_compat_ioctl32
  #endif
  };
```

В настоящее время для запроса временных параметров движения мотора используется следующий частный ioctl.

```text
RK_VIDIOC_VCM_TIMEINFO
```

##### 11.2.1.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
     int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
     int (*try_ctrl)(struct v4l2_ctrl *ctrl);
     int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p142, table unit 934 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получение нового значения control. Обычно требуется только для volatile (как правило, доступных лишь для чтения) control, например возвращающих непрерывно меняющуюся силу сигнала. |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops vm149c_vcm_ctrl_ops = {
      .g_volatile_ctrl = vm149c_get_ctrl,
      .s_ctrl = vm149c_set_ctrl,
  };
```

vm149c_get_ctrl и vm149c_set_ctrl поддерживают следующие controls:

```text
V4L2_CID_FOCUS_ABSOLUTE
```

#### 11.2.2 Краткое описание API

##### 11.2.2.1 xxxx_get_ctrl

[Описание]

Получить положение мотора.

[Синтаксис]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p142, table unit 946 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p143, table unit 948 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 11.2.2.2 xxxx_set_ctrl

[Описание]

Задать положение мотора.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p143, table unit 955 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p143, table unit 957 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
11.2.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Функция реализации пользовательского ioctl, главным образом для получения временных параметров движения мотора.

Реализуется пользовательский RK_VIDIOC_COMPAT_VCM_TIMEINFO.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p144, table unit 965 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p144, table unit 967 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 11.2.3 Этапы переноса драйвера

**1. Реализуйте стандартную часть драйвера подустройства I2C.**

1.1 Согласно описанию struct i2c_driver реализовать прежде всего следующие части:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получите ресурсы VCM, главным образом из DTS; см. регистрацию устройства VCM (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Параметры VCM именуются, например, rockchip, vcm-xxx и главным образом задают аппаратные параметры: начальный ток, номинальный ток и режим движения. Они определяют диапазон и скорость движения мотора.

2\. Инициализировать устройство VCM v4l2 и сущность media.

Подустройство V4L2: v4l2_i2c_subdev_init. RK VCM требует отдельный узел subdev, через который пользовательский camera_engine обращается к устройству и управляет фокусом.

Сущность media: media_entity_init;

3\. Алгоритм RK AF задаёт положение объектива во всём диапазоне перемещения как [0,64]. Полный ход соответствует диапазону тока VCM [начальный ток, номинальный ток]; рекомендуется реализовать преобразование между ними в функции.

**2. Реализуйте драйвер подустройства v4l2, главным образом следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
.ioctl.compat_ioctl32
```

Этот обратный вызов главным образом реализует частные команды управления RK:

<!-- Source: English PDF p145, table unit 991 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | camera_engine получает длительность перемещения, определяет остановку и перекрытие с экспозицией CIS. Время зависит от расстояния и режима выходного тока VCM IC. |

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p145, table unit 995 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | camera_engine задаёт/читает абсолютное положение объектива; RK AF задаёт весь ход диапазоном [0,64]. |

## 12. Драйвер FlashLight

### 12.1 Регистрация устройства FLASHLight (DTS)

**Пример DTS для SGM378:**

```text
  &i2c1 {
      ...
      sgm3784: sgm3784@30 {//Flash equipment
          #address-cells = <1>;
          #size-cells = <0>;
          compatible = "sgmicro,gsm3784";
          reg = <0x30>;
          rockchip,camera-module-index = <0>;//The flash corresponds to the camera module number
          rockchip,camera-module-facing = "back";//The flash corresponds to the orientation of the camera module
          enable-gpio = <&gpio2 RK_PB4 GPIO_ACTIVE_HIGH>;//enable gpio
          strobe-gpio = <&gpio1 RK_PA3 GPIO_ACTIVE_HIGH>;//flash trigger gpio
          status = "okay";
          sgm3784_led0: led@0 {//led0 device information
              reg = <0x0>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
          sgm3784_led1: led@1 {//led1 device information
              reg = <0x1>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
      };
      ...
      ov13850: ov13850@10 {
          ...
          flash-leds = <&sgm3784_led0 &sgm3784_led1>;//The flash device is hooked to the camera
          ...
      };
      ...
  }
```

**Пример dts для управления GPIO и PWM:**

```text
  flash_ir: flash-ir {
          status = "okay";
          compatible = "led,rgb13h";
          label = "pwm-flash-ir";
          led-max-microamp = <20000>;
          flash-max-microamp = <20000>;
          flash-max-timeout-us = <1000000>;
          pwms=<&pwm3 0 25000 0>;
          //enable-gpio = <&gpio0 RK_PA1 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx415: imx415@1a {
          ...
          flash-leds = <&flash_ir>;
          ...
      }
  }
```

**Примечание:**

1\. Программный поток зависит от типа подсветки. Для инфракрасной подсветки метка узла DTS должна содержать ir для обозначения аппаратуры; у обычной LED-подсветки ir можно убрать.

2\. Для управления одним выводом существуют два варианта. При фиксированной яркости непосредственно используется GPIO; регулируемая яркость задаётся коэффициентом заполнения PWM. Выберите в DTS либо pwms, либо enable-gpio.

### 12.2 Описание драйвера FLASHLight

#### 12.2.1 Краткое описание типов данных

##### 12.2.1.1 struct i2c_driver

[Описание]

Определяет сведения о драйвере устройства I2C.

[Определение]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p147, table unit 1016 -->

| Имя поля | Описание |
| --- | --- |
| @driver | Драйвер модели устройств содержит имя и of_match_table для сопоставления устройств DTS. При совпадении compatible таблицы и DTS вызывается .probe. |
| @id_table | Список поддерживаемых I2C-устройств; используется ядром, если сопоставление через of_match_table и DTS не применяется. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  static const struct i2c_device_id sgm3784_id_table[] = {
      { SGM3784_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, sgm3784_id_table);
  static const struct of_device_id sgm3784_of_table[] = {
      { .compatible = "sgmicro,sgm3784" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, sgm3784_of_table);
  static const struct dev_pm_ops sgm3784_pm_ops = {
      SET_RUNTIME_PM_OPS(sgm3784_runtime_suspend, sgm3784_runtime_resume, NULL)
  };
  static struct i2c_driver sgm3784_i2c_driver = {
      .driver = {
          .name = sgm3784_NAME,
          .pm = &sgm3784_pm_ops,
          .of_match_table = sgm3784_of_table,
      },
      .probe = &sgm3784_probe,
      .remove = &sgm3784_remove,
      .id_table = sgm3784_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### 12.2.1.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p148, table unit 1026 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops sgm3784_core_ops = {
      .ioctl = sgm3784_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = sgm3784_compat_ioctl32
  #endif
  };
```

В настоящее время время включения вспышки запрашивается через следующий частный ioctl.

```text
RK_VIDIOC_FLASH_TIMEINFO
```

##### 12.2.1.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p149, table unit 1037 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получение нового значения control. Обычно требуется только для volatile (как правило, доступных лишь для чтения) control, например возвращающих непрерывно меняющуюся силу сигнала. |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops sgm3784_ctrl_ops[LED_MAX] = {
      [LED0] = {
          .g_volatile_ctrl = sgm3784_led0_get_ctrl,
          .s_ctrl = sgm3784_led0_set_ctrl,
      },
      [LED1] = {
          .g_volatile_ctrl = sgm3784_led1_get_ctrl,
          .s_ctrl = sgm3784_led1_set_ctrl,
      }
  };
```

#### 12.2.2 Краткое описание API

##### 12.2.2.1 xxxx_set_ctrl

[Описание]

Задать режим вспышки, ток и тайм-аут вспышки.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p150, table unit 1047 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p150, table unit 1049 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 12.2.2.2 xxxx_get_ctrl

[Описание]

Получить состояние неисправности вспышки.

[Синтаксис]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p150, table unit 1056 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p150, table unit 1058 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
12.2.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Функция реализации пользовательского ioctl, главным образом для получения временных параметров вспышки.

Реализуется пользовательский RK_VIDIOC_COMPAT_FLASH_TIMEINFO.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p151, table unit 1066 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p151, table unit 1068 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 12.2.3 Этапы переноса драйвера

Прямое управление LED через GPIO: см. kernel/drivers/leds/leds-rgb13h.c и kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt

Драйвер микросхемы вспышки можно перенести следующим образом:

**1. Реализуйте стандартную часть драйвера подустройства I2C.**

1.1 Согласно описанию struct i2c_driver реализовать прежде всего следующие части:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получите ресурсы вспышки, главным образом из DTS; см. регистрацию устройства FLASHLIGHT (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

2\. Имя устройства вспышки:

Для двух светодиодов вспышки используются имена устройств led0 и led1.

```text
  /* NOTE: to distinguish between two led
   * name: led0 meet the main led
   * name: led1 meet the secondary led
   */
  snprintf(sd->name, sizeof(sd->name),
           "m%02d_%s_%s_led%d %s",
           flash->module_index, facing,
           SGM3784_NAME, i, dev_name(sd->dev));
```

3\. Инициализировать устройство FLASH v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер вспышки RK требует отдельный узел subdev для доступа пользовательского camera_engine и управления LED;

Сущность media: media_entity_init;

**2. Реализуйте драйвер подустройства v4l2, главным образом следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
.ioctl.compat_ioctl32
```

Этот обратный вызов главным образом реализует частные команды управления RK:

<!-- Source: English PDF p152, table unit 1095 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_FLASH_TIMEINFO | camera_engine получает момент включения LED и проверяет, начинается ли экспозиция CIS после вспышки. |

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p153, table unit 1099 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FLASH_FAULT | Получает ошибки вспышки |
| V4L2_CID_FLASH_LED_MODE | Задаёт LED-режим: V4L2_FLASH_LED_MODE_NONE, V4L2_FLASH_LED_MODE_TORCH, V4L2_FLASH_LED_MODE_FLASH. |
| V4L2_CID_FLASH_STROBE | Включает вспышку |
| V4L2_CID_FLASH_STROBE_STOP | Выключает вспышку |
| V4L2_CID_FLASH_TIMEOUT | Задаёт максимальное непрерывное время свечения flash |
| V4L2_CID_FLASH_INTENSITY | Задаёт ток flash |
| V4L2_CID_FLASH_TORCH_INTENSITY | Задаёт ток torch |

## 13. Драйвер FOCUS, ZOOM, P-IRIS

Здесь рассматривается управление шаговым мотором для автофокуса (FOCUS), зума (ZOOM) и автоматической диафрагмы (P-IRIS). Из-за одинакового способа управления моторами и особенностей аппаратной реализации три функции объединены в одном драйвере. В зависимости от микросхемы, например с управлением SPI, драйвер можно оформить как подустройство SPI. В этой главе на примере MP6507 и MS41908 описаны необходимые структуры данных, каркас и меры предосторожности.

### 13.1 Регистрация устройства MP6507 (DTS)

```text
  mp6507: mp6507 {
      status = "okay";
      compatible = "monolithicpower,mp6507";
      #pwm-cells = <3>;
      pwms = <&pwm6 0 25000 0>,
             <&pwm10 0 25000 0>,
             <&pwm9 0 25000 0>,
             <&pwm8 0 25000 0>;
      pwm-names = "ain1","ain2","bin1","bin2";
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      iris_en-gpios  = <&gpio0 RK_PC2 GPIO_ACTIVE_HIGH>;
      focus_en-gpios  = <&gpio0 RK_PC3 GPIO_ACTIVE_HIGH>;
      zoom_en-gpios  = <&gpio0 RK_PC0 GPIO_ACTIVE_HIGH>;
      iris-step-max = <80>;
      focus-step-max = <7500>;
      zoom-step-max = <7500>;
      iris-start-up-speed = <1200>;
      focus-start-up-speed = <1200>;
      focus-max-speed = <2500>;
      zoom-start-up-speed = <1200>;
      zoom-max-speed = <2500>;
      focus-first-speed-step = <8>;
      zoom-first-speed-step = <8>;
      focus-speed-up-table = < 1176 1181 1188 1196
                               1206 1217 1231 1246
                               1265 1286 1309 1336
                               1365 1396 1429 1464
                               1500 1535 1570 1603
                               1634 1663 1690 1713
                               1734 1753 1768 1782
                               1793 1803 1811 1818>;
      focus-speed-down-table = < 1796 1788 1779 1768
                                 1756 1743 1728 1712
                                 1694 1674 1653 1630
                                 1605 1580 1554 1527
                                 1500 1472 1445 1419
                                 1394 1369 1346 1325
                                 1305 1287 1271 1256
                                 1243 1231 1220 1211
                                 1203 1195 1189 1184
                                 1179 1175>;
      zoom-speed-up-table = < 1198 1205 1212 1220
                              1228 1238 1249 1260
                              1272 1285 1299 1313
                              1328 1343 1359 1375
                              1390 1406 1421 1436
                              1450 1464 1477 1489
                              1500 1511 1521 1529
                              1537 1544 1551>;
      zoom-speed-down-table = < 1547 1540 1531 1522
                                1511 1499 1487 1473
                                1458 1443 1426 1409
                                1392 1375 1357 1340
                                1323 1306 1291 1276
                                1262 1250 1238 1227
                                1218 1209 1202 1195
                                1189 1184 1179 1175
                                1171 1168>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&mp6507>;
          ...
      }
  }
  &pwm6 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm6m1_pins_pull_up>;
  };
  &pwm8 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm8m1_pins_pull_down>;
      center-aligned;
  };
  &pwm9 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm9m1_pins_pull_down>;
      center-aligned;
  };
  &pwm10 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm10m1_pins_pull_down>;
  };
```

**Описание частных определений RK:**

<!-- Source: English PDF p156, table unit 1107 -->

| Имя поля | Описание |
| --- | --- |
| rockchip,camera-module-index | Номер камеры для сопоставления по полю. |
| rockchip,camera-module-facing | Ориентация камеры для сопоставления по полю. |
| iris_en-gpios | GPIO включения IRIS |
| focus_en-gpios | GPIO включения фокусировки |
| zoom_en-gpios | GPIO включения зума |
| rockchip,iris-step-max | Максимум шагов двигателя P-IRIS |
| rockchip,focus-step-max | Максимум шагов двигателя фокусировки |
| zoom-step-max | Максимум шагов двигателя зума |
| iris-start-up-speed | Начальная скорость двигателя IRIS |
| focus-start-up-speed | Начальная скорость двигателя фокусировки |
| focus-max-speed | Максимальная скорость двигателя фокусировки |
| zoom-start-up-speed | Начальная скорость двигателя зума |
| zoom-max-speed | Максимальная скорость двигателя зума |
| focus-first-speed-step | Число шагов на начальной скорости фокусировки; далее оно пропорционально растёт, чтобы время каждого скоростного этапа было примерно одинаковым. |
| zoom-first-speed-step | Число шагов на начальной скорости зума; далее оно пропорционально растёт для примерно одинаковой длительности этапов. |
| focus-speed-up-table | Разгон фокусировки задаётся таблицей трапецеидальной либо S-образной кривой. Без таблицы либо при одном значении движение равномерное на начальной скорости. Минимум кривой не выше максимальной стартовой скорости, максимум не выше максимальной рабочей скорости двигателя. |

<!-- Source: English PDF p157, table unit 1108 -->

| Имя поля | Описание |
| --- | --- |
| focus-speed-down-table | Максимум торможения фокусировки должен быть ниже максимума разгона. Если разгон недействителен, торможение также отключено, движение равномерное на начальной скорости. Без отдельной таблицы торможение симметрично разгону. |
| zoom-speed-up-table | Кривая ускорения zoom задаётся таблицей: подобрать параметры, сформировать трапецеидальную или S-образную кривую и настроить таблицу её данных. Без таблицы либо с одним значением движение выполняется с постоянной начальной скоростью. Минимум кривой не превышает максимальную стартовую скорость, максимум — максимальную рабочую скорость шагового двигателя. |
| zoom-speed-down-table | Максимум торможения зума ниже максимума разгона. Если разгон недействителен, движение равномерное на начальной скорости; без таблицы торможение симметрично разгону. |

#### 13.1.1 Краткое описание типов данных

##### 13.1.1.1 struct platform_driver

[Описание]

Определить сведения о драйвере устройства platform.

[Определение]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Основные члены]

<!-- Source: English PDF p158, table unit 1116 -->

| Имя поля | Описание |
| --- | --- |
| @driver | struct device_driver содержит имя и of_match_table для устройств DTS; совпадение compatible вызывает .probe. |
| @id_table | Если of_match_table и DTS не используются, ядро сопоставляет устройства по этой таблице. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "monolithicpower,mp6507", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### 13.1.1.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p159, table unit 1125 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 13.1.1.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p159, table unit 1134 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получение нового значения control. Обычно требуется только для volatile (как правило, доступных лишь для чтения) control, например возвращающих непрерывно меняющуюся силу сигнала. |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 13.1.2 Краткое описание API

##### 13.1.2.1 xxxx_set_ctrl

[Описание]

Вызвать стандартный v4l2_control для задания положения фокуса, зума и диафрагмы P.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p160, table unit 1142 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Управляет фокусом: 0 — минимальное фокусное расстояние, резкость вблизи. |
| V4L2_CID_ZOOM_ABSOLUTE | Управляет зумом: 0 — минимальное увеличение и максимальное поле зрения. |
| V4L2_CID_IRIS_ABSOLUTE | Управляет раскрытием P-диафрагмы: 0 — закрыта. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p160, table unit 1146 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p160, table unit 1148 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### 13.1.2.2 xxxx_get_ctrl

[Описание]

Вызвать стандартный v4l2_control для получения текущего положения фокуса, зума и диафрагмы P.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p161, table unit 1153 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Управляет фокусом: 0 — минимальное фокусное расстояние, резкость вблизи. |
| V4L2_CID_ZOOM_ABSOLUTE | Управляет зумом: 0 — минимальное увеличение и максимальное поле зрения. |
| V4L2_CID_IRIS_ABSOLUTE | Управляет раскрытием P-диафрагмы: 0 — закрыта. |

[Синтаксис]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p161, table unit 1157 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p161, table unit 1159 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
13.1.2.3   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Реализация пользовательского ioctl главным образом получает временные сведения о фокусе, зуме и диафрагме P (метки начала и конца движения). Поскольку у используемого объектива нет устройства позиционирования, при необходимости требуется сброс положения мотора.

**Реализуемые пользовательские команды:**

<!-- Source: English PDF p162, table unit 1164 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Время фокусировки для проверки действительности кадра после неё. |
| RK_VIDIOC_ZOOM_TIMEINFO | Время зума для проверки действительности кадра после завершения. |
| RK_VIDIOC_IRIS_TIMEINFO | Время диафрагмы для проверки действительности кадра после настройки. |
| RK_VIDIOC_FOCUS_CORRECTION | Коррекция (сброс) положения фокуса |
| RK_VIDIOC_ZOOM_CORRECTION | Коррекция (сброс) положения зума |
| RK_VIDIOC_IRIS_CORRECTION | Коррекция (сброс) положения диафрагмы |

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p162, table unit 1168 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p162, table unit 1170 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 13.1.3 Этапы переноса драйвера

Для микросхем с управлением SPI можно переносить драйвер в рамках SPI. Эталонный драйвер RK использует MP6507: управляющий сигнал формируется напрямую pwm, а MP6507 усиливает мощность. Поэтому перенос выполнен непосредственно на основе platform. Эталон: /kernel/drivers/media/i2c/mp6507.c.

Этапы переноса:

**1. Реализуйте стандартную часть драйвера подустройства platform.**

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получите ресурсы устройства, главным образом из DTS; см. регистрацию MP6507 (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить конфигурацию pwm. При данном управлении мотором фазы A и B сдвинуты на 90 градусов. Это достигается центрированием PWM фазы B. В узле pwm DTS настроить center-aligned; подробности см. в регистрации MP6507 (DTS).

![Последовательность возбуждения и соединения обмоток двигателя — английский оригинал, страница 163](/docs/rockchip-isp30-vi-driver/assets/en-p163-X756.png)

*Последовательность возбуждения и соединения обмоток двигателя — английский оригинал, страница 163*

Последовательность возбуждения; вращение выходного вала CW.

| Фаза / шаг | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| A | + | + | − | − |
| A̅ | − | − | + | + |
| B | − | + | + | − |
| B̅ | + | − | − | + |

1.3) Получить вывод разрешения. MP6507 требуется четыре PWM для формирования сигналов шагового мотора. При ограниченном количестве аппаратных PWM моторы фокуса, зума и диафрагмы P имеют отдельные MP6507, включаемые через gpio: PWM разделяются по времени. Недостаток — одновременно работает только один мотор, а два других ожидают завершения предыдущей операции.

1.4) Получить аппаратные ограничения и ресурсы каждого мотора: максимальное число шагов, максимальную начальную и рабочую скорость, данные кривой ускорения.

2\. hrtimer_init: инициализация таймера. Непрерывный режим PWM требует отсчёта времени; после выдачи заданного числа импульсов прерывание таймера отключает PWM. При ускорении после заданного числа импульсов прерывание меняет частоту PWM, ускоряя шаговый двигатель.

3\. init_completion: синхронизация через completion; следующая операция двигателя допускается лишь после завершения предыдущего движения.

4\. Инициализировать устройство v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер требует отдельный узел subdev для доступа пользовательского rkaiq и управления мотором;

Сущность media: media_entity_init;

5\. Имя устройства вспышки:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Реализуйте драйвер подустройства v4l2, главным образом следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
  .ioctl
  .compat_ioctl32
```

Этот обратный вызов главным образом реализует частные команды управления RK:

<!-- Source: English PDF p164, table unit 1201 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Время фокусировки для проверки действительности кадра после неё. |
| RK_VIDIOC_ZOOM_TIMEINFO | Время зума для проверки действительности кадра после завершения. |
| RK_VIDIOC_IRIS_TIMEINFO | Время диафрагмы для проверки действительности кадра после настройки. |
| RK_VIDIOC_FOCUS_CORRECTION | Коррекция (сброс) положения фокуса |
| RK_VIDIOC_ZOOM_CORRECTION | Коррекция (сброс) положения зума |
| RK_VIDIOC_IRIS_CORRECTION | Коррекция (сброс) положения диафрагмы |

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl
.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p164, table unit 1206 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Управляет фокусом: 0 — минимальное фокусное расстояние, резкость вблизи. |
| V4L2_CID_ZOOM_ABSOLUTE | Управляет зумом: 0 — минимальное увеличение и максимальное поле зрения. |
| V4L2_CID_IRIS_ABSOLUTE | Управляет P-диафрагмой: 0 — закрыта (исходник заканчивается **). |

**3. Пример кривой ускорения шагового двигателя:**

3.1 Трапециевидная кривая: можно ускоряться и замедляться с равными временными интервалами и приращениями скорости, как на рисунке.

![Трапецеидальное ускорение двигателя — английский оригинал, страница 165](/docs/rockchip-isp30-vi-driver/assets/en-p165-X763.png)

*Трапецеидальное ускорение двигателя — английский оригинал, страница 165*

3.2 S-образная кривая: если трапецеидальное ускорение неудовлетворительно, используйте S-образное по формуле: Speed = Vmin + ((Vmax-Vmin) / (1 + exp(-fac * (i-Num) / Num)));

Здесь:

Vmin — стартовая скорость, Vmax — целевая. fac — коэффициент кривой, обычно 4~6; большее значение делает середину круче. i — номер сегмента скорости: при 32 сегментах диапазон 0~31. Num — половина числа сегментов, то есть 16 при 32 сегментах.

![S-образное ускорение двигателя — английский оригинал, страница 165](/docs/rockchip-isp30-vi-driver/assets/en-p165-X764.png)

*S-образное ускорение двигателя — английский оригинал, страница 165*

### 13.2 Регистрация устройства MS41908 (DTS)

Некоторые объективы поддерживают PIRIS, FOCUS, ZOOM, ZOOM1 или сочетание DC-IRIS, FOCUS, ZOOM. Поэтому функции PIRIS, FOCUS, ZOOM, ZOOM1, DC-IRIS в MS41908 настраиваются, а драйвер может загружаться несколько раз для сочетания нескольких микросхем. Это усложняет dts; внимательно изучите описание каждого параметра.

```text
  &spi0 {
      status = "okay";
      pinctrl-names = "default";
      pinctrl-0 = <&spi0m0_clk &spi0m0_cs0n &spi0m0_miso &spi0m0_mosi>;
      //If pinctrl is not configured, confirm whether the default pinctrl is the actual pin group
      assigned-clocks = <&pmucru CLK_SPI0>;
      assigned-clock-rates = <100000000>;
      ms41908: ms41908@00 {
          status = "okay";
          compatible = "relmon,ms41908";
          reg = <0>;
          pinctrl-names = "default";
          focus-start-up-speed = <800>;
          zoom-start-up-speed = <800>;
          focus-step-max = <3160>;
          zoom-step-max = <1520>;
          focus-backlash = <18>;
          vd_fz-period-us = <10000>;
          vd_fz-gpios = <&gpio3 RK_PC6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
          use-focus;
          use-zoom;
          focus-used-pin = "cd";
          zoom-used-pin = "ab";
      };
  };
  &i2c1 {
      imx335: imx335@1a{
          ...
          lens-focus = <&ms41908>;
          //Multiple device registration，lens-focus = <&ms41908_0 &ms41908_1>;
          ...
      };
  };
```

#### 13.2.1 Основное описание:

<!-- Source: English PDF p167, table unit 1219 -->

| Имя поля | Описание |
| --- | --- |
| pinctrl-0 | Определения SPI pinmux по схеме, например pinctrl-0 = &lt;&amp;spi0m0_clk &amp;spi0m0_cs0n &amp;spi0m0_miso &amp;spi0m0_mosi&gt;;. |
| assigned-clocks assigned-clock-rates | Настройка такта SPI, рекомендуется 100MHz. |
| reg | reg = &lt;0&gt;; для cs0; reg = &lt;1&gt;; для cs1. |
| rockchip,camera-module-index | Номер камеры для сопоставления. |
| rockchip,camera-module-facing | Ориентация камеры для сопоставления. |
| reset-gpios | Вывод сброса ms41908; не требуется при постоянной аппаратной подтяжке вверх. |
| vd_fz-period-us | Период импульса обновления регистров шагового драйвера, общий для двух двигателей. Превышение vd вызывает потерю шагов; драйвер удерживает время одиночного движения внутри vd. |

#### 13.2.2 Описание FOCUS:

<!-- Source: English PDF p168, table unit 1221 -->

| Имя поля | Описание |
| --- | --- |
| use-focus | Использовать ли фокусировку |
| focus-used-pin | Каждая ms41908 управляет двумя двигателями через группы ab и cd; задайте по схеме. |
| focus-backlash | Компенсационные шаги люфта при смене направления, определяемые испытанием объектива. |
| focus-start-up-speed | Начальная скорость двигателя, PPS. |
| focus-step-max | Эффективный ход двигателя в шагах. |
| focus-ppw | Задаёт PWM ms41908 0–255; большее значение усиливает привод. Настройте по нагрузке. |
| focus-phmode | Коррекция фазы PWM ms41908; обычно не задаётся, зависит от условий. |
| focus-micro | Микрошаг: 64, 128 либо 256; по умолчанию 256. |
| focus-reback-distance | Для точности к фокусной позиции подходят с одной стороны: из 100 к 90 сначала возвращаются к 80, затем идут к 90. Параметр задаёт дополнительный обратный ход. |
| focus-1-2phase-excitation | По умолчанию возбуждение 2-2; для 1-2 задайте focus-1-2phase-excitation;. |
| focus-dir-opposite | Если движение противоположно кривой фокуса, инвертируйте: focus-dir-opposite;. |

**Описание оптопары:**

<!-- Source: English PDF p169, table unit 1223 -->

| Имя поля | Описание |
| --- | --- |
| focus-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| focus-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| focus-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| focus-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| focus-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### 13.2.3 Описание ZOOM:

<!-- Source: English PDF p170, table unit 1226 -->

| Имя поля | Описание |
| --- | --- |
| use-zoom | Использовать ли зум |
| zoom-used-pin | Каждая ms41908 управляет двумя двигателями через группы ab и cd; задайте по схеме. |
| zoom-backlash | Шаги компенсации люфта при смене направления, по результату теста. |
| zoom-start-up-speed | Начальная скорость двигателя, PPS. |
| zoom-step-max | Эффективный ход двигателя в шагах. |
| zoom-ppw | Задаёт PWM ms41908 0–255; большее значение усиливает привод. Настройте по нагрузке. |
| zoom-phmode | Коррекция фазы PWM ms41908; обычно не задаётся, зависит от условий. |
| zoom-micro | Микрошаг: 64, 128 либо 256; по умолчанию 256. |
| zoom-1-2phase-excitation | По умолчанию 2-2; zoom-1-2phase-excitation; включает 1-2. |
| zoom-dir-opposite | При противоположном кривой фокуса направлении задайте zoom-dir-opposite;. |

**Описание оптопары:**

<!-- Source: English PDF p170, table unit 1228 -->

| Имя поля | Описание |
| --- | --- |
| zoom-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| zoom-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| zoom-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### 13.2.4 Описание ZOOM1:

<!-- Source: English PDF p171, table unit 1231 -->

| Имя поля | Описание |
| --- | --- |
| use-zoom1 | Использовать ли zoom1; некоторые объективы имеют две группы зума. |
| zoom1-used-pin | Каждая ms41908 управляет двумя двигателями через группы ab и cd; задайте по схеме. |
| zoom1-backlash | Шаги компенсации люфта при смене направления, по результату теста. |
| zoom1-start-up-speed | Начальная скорость двигателя, PPS. |
| zoom1-step-max | Эффективный ход двигателя в шагах. |
| zoom1-ppw | Задаёт PWM ms41908 0–255; большее значение усиливает привод. Настройте по нагрузке. |
| zoom1-phmode | Коррекция фазы PWM ms41908; обычно не задаётся, зависит от условий. |
| zoom1-micro | Микрошаг: 64, 128 либо 256; по умолчанию 256. |
| zoom1-1-2phase-excitation | По умолчанию 2-2; zoom1-1-2phase-excitation; включает 1-2. |
| zoom1-dir-opposite | При противоположном кривой фокуса направлении задайте zoom1-dir-opposite;. |

**Описание оптопары:**

<!-- Source: English PDF p171, table unit 1233 -->

| Имя поля | Описание |
| --- | --- |
| zoom1-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| zoom1-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| zoom1-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| zoom1-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| zoom1-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### 13.2.5 Описание PIRIS:

<!-- Source: English PDF p172, table unit 1236 -->

| Имя поля | Описание |
| --- | --- |
| use-p-iris | Использовать ли P-IRIS |
| piris-used-pin | Каждая ms41908 управляет двумя двигателями через группы ab и cd; задайте по схеме. |
| piris-backlash | Компенсационные шаги люфта при смене направления, определяемые испытанием объектива. |
| piris-start-up-speed | Начальная скорость двигателя, PPS. |
| piris-step-max | Эффективный ход двигателя в шагах. |
| piris-ppw | Задаёт PWM ms41908 0–255; большее значение усиливает привод. Настройте по нагрузке. |
| piris-phmode | Коррекция фазы PWM ms41908; обычно не задаётся, зависит от условий. |
| piris-micro | Микрошаг: 64, 128 либо 256; по умолчанию 256. |
| piris-1-2phase-excitation | По умолчанию 2-2; piris-1-2phase-excitation; включает 1-2. |
| piris-dir-opposite | При противоположном кривой фокуса направлении задайте piris-dir-opposite;. |

**Описание оптопары:**

<!-- Source: English PDF p173, table unit 1238 -->

| Имя поля | Описание |
| --- | --- |
| piris-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| piris-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| piris-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| piris-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| piris-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### 13.2.6 Описание DCIRIS:

<!-- Source: English PDF p173, table unit 1241 -->

| Имя поля | Описание |
| --- | --- |
| use-dc-iris | Использовать ли DC-IRIS |
| vd_iris-gpios | Вывод синхроимпульса применения регистров DC-диафрагмы. |
| dc-iris-reserved-polarity | Полярность DC-диафрагмы; если 0 означает полное открытие, свойство инвертирует её. |
| dc-iris-max-log | Целевой диапазон DC-диафрагмы 0~1023; фактический может быть уже, параметр ограничивает его. |

#### 13.2.7 Краткое описание типов данных

##### 13.2.7.1 struct spi_driver

[Описание]

Определить сведения о драйвере устройства platform.

[Определение]

```text
  struct spi_driver {
          int (*probe)(struct spi_device *spi);
          int (*remove)(struct spi_device *spi);
          struct device_driver driver;
          const struct spi_device_id *id_table;
  };
```

[Основные члены]

<!-- Source: English PDF p174, table unit 1249 -->

| Имя поля | Описание |
| --- | --- |
| @driver | struct device_driver содержит имя и of_match_table для устройств DTS; совпадение compatible вызывает .probe. |
| @id_table | Если of_match_table и DTS не используются, ядро сопоставляет устройства по этой таблице. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  static const struct spi_device_id motor_match_id[] = {
      {"relmon,ms41908", 0 },
      { }
  };
  static struct spi_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe      = &motor_dev_probe,
      .remove     = &motor_dev_remove,
      .id_table   = motor_match_id,
  };
```

##### 13.2.7.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p175, table unit 1258 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 13.2.7.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p176, table unit 1267 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получение нового значения control. Обычно требуется только для volatile (как правило, доступных лишь для чтения) control, например возвращающих непрерывно меняющуюся силу сигнала. |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 13.2.8 Краткое описание API

##### 13.2.8.1 xxxx_set_ctrl

[Описание]

Вызвать стандартный v4l2_control для задания положения фокуса, зума и диафрагмы P.

Драйвер реализует следующие стандартные команды v4l2:

<!-- Source: English PDF p176, table unit 1275 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Фокусировка: 0 — минимальное фокусное расстояние, резкость вблизи. |
| V4L2_CID_ZOOM_ABSOLUTE | Зум: 0 — минимальное увеличение, максимальное поле зрения. |
| V4L2_CID_IRIS_ABSOLUTE | Раскрытие диафрагмы: 0 — закрыта. |
| V4L2_CID_ZOOM_CONTINUOUS | Управляет zoom1 при нескольких группах зума. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p176, table unit 1279 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

```text
13.2.8.2   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Реализация пользовательского ioctl главным образом получает временные сведения о фокусе, зуме и диафрагме P (метки начала и конца движения). Поскольку у используемого объектива нет устройства позиционирования, при необходимости требуется сброс положения мотора.

**Пользовательские команды драйвера:**

<!-- Source: English PDF p177, table unit 1284 -->

| Имя параметра | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Время фокусировки для проверки действительности кадра после неё. |
| RK_VIDIOC_ZOOM_TIMEINFO | Время зума для проверки действительности кадра после завершения. |
| RK_VIDIOC_IRIS_TIMEINFO | Время диафрагмы для проверки действительности кадра после настройки P-диафрагмы. |
| RK_VIDIOC_ZOOM1_TIMEINFO | Время zoom1 при нескольких группах для проверки действительности кадра после завершения. |
| RK_VIDIOC_IRIS_CORRECTION | Сброс положения диафрагмы, только P-IRIS. |
| RK_VIDIOC_FOCUS_CORRECTION | Сброс положения фокуса |
| RK_VIDIOC_ZOOM_CORRECTION | Сброс положения зума |
| RK_VIDIOC_ZOOM1_CORRECTION | Сброс второй группы двухгруппового зума |
| RK_VIDIOC_FOCUS_SET_POSITION | Задаёт положение фокуса |
| RK_VIDIOC_ZOOM_SET_POSITION | Задаёт параметры следящей фокусировки и многошаговую связь зума с фокусом по кривой. |

Примечание:

1\. Для устранения погрешности абсолютного положения из-за люфта одно направление назначается положительным, другое отрицательным; исходно шестерня прижата в положительную сторону. При движении назад проходят дополнительные n шагов, превышающие люфт, затем n шагов вперёд, восстанавливая прижим. Это возвратная компенсация, обеспечивающая точность. Но её ход превышает люфт, поэтому при последовательных обратных движениях фокусировки повторение каждый раз воспринимается как дрожание. Интерфейсы RK_VIDIOC_FOCUS_SET_POSITION и RK_VIDIOC_ZOOM_SET_POSITION передают решение о компенсации алгоритму AF. Стандартные V4L2_CID_FOCUS_ABSOLUTE и V4L2_CID_ZOOM_ABSOLUTE её не выполняют и предназначены только для ручного режима. RK_VIDIOC_ZOOM_SET_POSITION включает параметры focus и zoom; фокус меняется синхронно с масштабом для естественного перехода изображения.

2\. Первоначально настройка focus-backlash компенсировала люфт: при обратном движении добавлялось число шагов люфта. Из-за индивидуальных различий объективов калибровка неточна и трудоёмка, поэтому параметр устарел. Драйвер сохраняет реализацию; её можно использовать при невысоких требованиях к точности.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p178, table unit 1294 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p178, table unit 1296 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 13.2.9 Этапы переноса драйвера

Драйвер микросхемы с управлением SPI можно перенести на основе SPI, используя MS41908 как образец. Эталон: /kernel/drivers/media/spi/ms41908.c.

Этапы переноса:

**1. Реализовать стандартную часть драйвера подустройства spi.**

1.1 Согласно описанию struct spi_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1) Получить ресурсы устройства, главным образом из DTS; см. регистрацию MS41908 (DTS);

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить параметры настройки мотора, определяемые требованиями функций микросхемы; по возможности параметры движения следует сделать настраиваемыми.

2\. hrtimer_init: инициализация таймера. MS41908 запускается сигналом VD; таймер фиксирует период VD для удобства управления. Регистры вступают в силу после VD, поэтому их можно заранее изменить перед сигналом. Заданные скорость и число шагов должны укладываться в период VD; лишние шаги теряются.

3) init_completion обеспечивает синхронизацию через completion: следующая операция того же мотора допускается только после завершения предыдущей.

4\. Инициализировать устройство v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер требует отдельный узел subdev для доступа пользовательского rkaiq и управления мотором;

Сущность media: media_entity_init;

5\. Имя устройства:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы по описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
  .ioctl
  .compat_ioctl32
```

2.2 Реализовать обратные вызовы по описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl
.s_ctrl
```

## 14. Драйвер DC-IRIS

В отличие от P-IRIS, DC-IRIS не знает точное раскрытие; обычно диафрагма полностью открыта. Регулировка начинается, если при минимальной экспозиции изображение переэкспонировано либо при максимальной недоэкспонировано. Двигатель постоянного тока использует отрицательную обратную связь датчика Холла для плавности. Достаточно одного PWM: при заполнении менее 20% диафрагма закрывается, тем быстрее, чем меньше значение; выше 40% открывается, тем быстрее, чем больше значение; 20%~40% удерживает положение. Пороги 20% и 40% зависят от частоты PWM и точности аппаратуры. Драйвер: /kernel/drivers/media/i2c/hall-dc-motor.c.

### 14.1 Регистрация устройства DC-IRIS (DTS)

```text
  hal_dc_motor: hal_dc_motor{
          status = "okay";
          compatible = "rockchip,hall-dc";
          pwms = <&pwm6 0 2500 0>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &pwm6 {
          status = "okay";
          pinctrl-names = "active";
          pinctrl-0 = <&pwm6m0_pins_pull_down>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&hal_dc_motor>;
          ...
      }
  }
```

#### 14.1.1 Краткое описание типов данных

##### 14.1.1.1 struct platform_driver

[Описание]

Определить сведения о драйвере устройства platform.

[Определение]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Основные члены]

<!-- Source: English PDF p181, table unit 1336 -->

| Имя поля | Описание |
| --- | --- |
| @driver | struct device_driver содержит имя и of_match_table для устройств DTS; совпадение compatible вызывает .probe. |
| @id_table | Если of_match_table и DTS не используются, ядро сопоставляет устройства по этой таблице. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "rockchip,hall-dc", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### 14.1.1.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p182, table unit 1345 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### 14.1.1.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p182, table unit 1354 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### 14.1.2 Краткое описание API

##### 14.1.2.1 xxxx_set_ctrl

[Описание]

Стандартный v4l2_control задаёт положение диафрагмы. На практике точное положение DC-диафрагмы неизвестно, поэтому здесь задаётся коэффициент заполнения pwm.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p183, table unit 1362 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Задаёт PWM диафрагмы в диапазоне 0~100. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p183, table unit 1366 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p183, table unit 1368 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
14.1.2.2   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Сейчас частные определения не требуются; для регистрации в v4l2 реализуются пустые функции.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p184, table unit 1375 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p184, table unit 1377 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 14.1.3 Этапы переноса драйвера

Эталонный драйвер: /kernel/drivers/media/i2c/hall-dc-motor.c.

Этапы переноса:

**1. Реализуйте стандартную часть драйвера подустройства platform.**

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получите ресурсы устройства, главным образом из DTS; см. регистрацию DC-IRIS (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить ресурсы pwm; проверить включение узла pwm.

2\. Инициализировать устройство v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер требует отдельный узел subdev для доступа пользовательского rkaiq и управления мотором;

Сущность media: media_entity_init;

3\. Имя устройства вспышки:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

**2. Реализуйте драйвер подустройства v4l2, главным образом следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
  ioctl
  .compat_ioctl32
```

Обратный вызов пока не требует конкретных команд, но подустройство v4l2 обязано иметь функцию операции, поэтому здесь реализована пустая функция.

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p185, table unit 1403 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Задаёт PWM диафрагмы в диапазоне 0~100. |

## 15. Драйвер RK-IRCUT

IRCUT управляется двумя проводами с питанием 3.5v~6v. Для переключения меняют полярность и подают питание на 100ms±10%. Драйвер двумя gpio задаёт направление тока моторного драйвера; команды gpio — open (красный провод) и close (чёрный). При токе от open к close устанавливается ИК-отсекающий фильтр для дня; от close к open — прозрачное стекло для ночи.

### 15.1 Регистрация устройства RK-IRCUT (DTS)

```text
  cam_ircut0: cam_ircut {
          status = "okay";
          compatible = "rockchip,ircut";
          ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
          ircut-close-gpios  = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          ir-cut = <&cam_ircut0>;
          ...
      }
  }
```

#### 15.1.1 Краткое описание типов данных

##### 15.1.1.1 struct platform_driver

[Описание]

Определить сведения о драйвере устройства platform.

[Определение]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[Основные члены]

<!-- Source: English PDF p187, table unit 1415 -->

| Имя поля | Описание |
| --- | --- |
| @driver | struct device_driver содержит имя и of_match_table для устройств DTS; совпадение compatible вызывает .probe. |
| @id_table | Если of_match_table и DTS не используются, ядро сопоставляет устройства по этой таблице. |
| @probe | Обратный вызов привязки устройства |
| @remove | Обратный вызов отвязки устройства |

[Пример]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id ircut_of_match[] = {
      { .compatible = "rockchip,ircut", },
      {},
  };
  #endif
  static struct platform_driver ircut_driver = {
      .driver = {
          .name = RK_IRCUT_NAME,
          .of_match_table = of_match_ptr(ircut_of_match),
      },
      .probe = ircut_probe,
      .remove = ircut_drv_remove,
  };
  module_platform_driver(ircut_driver);
```

##### 15.1.1.2 struct v4l2_subdev_core_ops

[Описание]

Определяет обратные вызовы core ops для подустройств.

[Определение]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[Основные члены]

<!-- Source: English PDF p188, table unit 1424 -->

| Имя поля | Описание |
| --- | --- |
| .ioctl | Вызывается в конце обработчика ioctl() V4L2 core для поддержки частных ioctl драйвера. |
| .compat_ioctl32 | Вызывается для 32-битного приложения в 64-битном ядре, чтобы корректировать данные между ядром и userspace; исходник повторяет пояснение. |

[Пример]

```text
  static const struct v4l2_subdev_core_ops ircut_core_ops = {
      .ioctl = ircut_ioctl,
  };
  static const struct v4l2_subdev_ops ircut_subdev_ops = {
      .core   = &ircut_core_ops,
  };
```

##### 15.1.1.3 struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p188, table unit 1433 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops ircut_ctrl_ops = {
      .s_ctrl = ircut_s_ctrl,
  };
```

#### 15.1.2 Краткое описание API

##### 15.1.2.1 xxxx_set_ctrl

[Описание]

Переключить IRCUT стандартным v4l2_control.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p189, table unit 1441 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 — CLOSE, ИК-свет проходит; 3 — OPEN, ИК-свет не проходит. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p189, table unit 1445 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p189, table unit 1447 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
15.1.2.2   xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Сейчас частные определения не требуются; для регистрации в v4l2 реализуются пустые функции.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p190, table unit 1454 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p190, table unit 1456 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### 15.1.3 Этапы переноса драйвера

Эталонный драйвер: /kernel/drivers/media/i2c/rk_ircut.c.

Этапы переноса:

**1. Реализуйте стандартную часть драйвера подустройства platform.**

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получите ресурсы устройства, главным образом из DTS; см. регистрацию RK-IRCUT (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить ресурсы gpio open и close;

2\. init_completion: синхронизация через completion. Переключение IRCUT занимает около 100ms, поэтому следующая операция допускается лишь после завершения предыдущего переключения.

3\. Создайте рабочую очередь и выполняйте переключение в ней, чтобы избежать длительной блокировки.

4\. Инициализировать устройство v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйверу требуется отдельный узел subdev для доступа пользовательского rkaiq и управления IRCUT;

Сущность media: media_entity_init;

```text
  sd->entity.function = MEDIA_ENT_F_LENS;
  sd->entity.flags = 1;//flag is fixed to 1, used to distinguish other sub-devices of MEDIA_ENT_F_LENS type
```

5\. Имя устройства:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           ircut->module_index, facing,
           RK_IRCUT_NAME);
```

**2. Реализуйте драйвер подустройства v4l2, главным образом следующие два члена:**

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
  .ioctl
  .compat_ioctl32
```

Сейчас частные команды не требуются, но регистрация в v4l2 требует обратного вызова, поэтому реализуется пустая функция, которую можно дополнить впоследствии.

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.s_ctrl
```

.s_ctrl реализует следующие команды стандартным control v4l2:

<!-- Source: English PDF p191, table unit 1488 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 — CLOSE, ИК-свет проходит; 3 — OPEN, ИК-свет не проходит. |

## 16. Инструменты media-ctl и v4l2-ctl

media-ctl работает через устройства media, например /dev/medio0, управляя форматом, размером и связями узлов топологии Media. (В оригинале /dev/medio0; вероятно, подразумевается /dev/media0. Исходное написание сохранено для проверки.)

v4l2-ctl предназначен для видеоустройств /dev/video0, /dev/video1 и т. п. и выполняет set_fmt, reqbuf, qbuf, dqbuf, stream_on, stream_off и другие операции.

Подробности приведены в справке команды; ниже показаны распространённые способы применения.

1\. Вывести топологию

```text
  media-ctl -p -d /dev/media0
```

Примечание: у isp2 много узлов; возможны media0/media1/media2. Следует перечислить их и проверить сведения о каждом устройстве.

2\. Связи

```text
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Примечание: отключите путь ISPP, подключите main_path и захватывайте RAW оттуда. Без -d media-ctl использует /dev/media0; уточните узел rkisp-isp-subdev, обычно /dev/media1.

3\. Изменить fmt/size

```text
  media-ctl -d /dev/media0 \
  --set-v4l2'"ov5695 7-0036":0[fmt:SBGGR10_1X10/640x480]'
```

Примечание: определить, к какому устройству media относится узел камеры (ov5695 7-0036).

4\. Задать fmt и захватить кадр

```text
  v4l2-ctl -d /dev/video0 \
  --set-fmt-video=width=720,height=480,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-skip=3 \
  --stream-to=/tmp/cif.out \
  --stream-count=1 \
  --stream-poll
```

5\. Задать экспозицию, усиление и другие controls

```text
  v4l2-ctl -d /dev/video3 --set-ctrl'exposure=1216,analogue_gain=10'
```

Драйвер ISP вызывает управляющие команды подустройства камеры, поэтому экспозицию можно задать через video3 (main_path/self_path). VICAP их не вызывает, и настройка узла захвата не сработает. Найдите /dev/v4l-subdevX камеры и настраивайте непосредственно его.

## 17. Оптимизация памяти RV1109/RV1126

```text
MIPI -> DDR_1 -> ISP -> DDR_2 -> ISPP(TNR) -> DDR_3 -> ISPP(NR&Sharp) -> DDR_4 -> ISPP(FEC) -> DDR_5
```

1\. DDR_1: RAW VICAP либо ISP MIPI записывается в DDR, затем ISP читает из DDR RAW для обработки.

Занимаемая память: buf_cnt * buf_size * N, где N = 1 для линейного режима, 2 для hdr2, 3 для hdr3.

buf_size: `ALIGN(width * bpp / 8, 256) * height;`, где bpp — разрядность: raw8, raw10 или raw12.

buf_cnt: по умолчанию 4, задаётся в hwi/isp20/CamHwIsp20.h библиотеки aiq; минимум 3.

```text
#define ISP_TX_BUF_NUM 4
#define VIPCAP_TX_BUF_NUM 4
```

Настройте ROCKCHIP_CIF_USE_NONE_DUMMY_BUF для VICAP, чтобы убрать один внутренний буфер.

2\. DDR_2: ISP записывает FBC YUV420 и gain в DDR, ISPP читает их для обработки.

Занимаемая память: buf_size * buf_cnt.

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 4 буфера в режиме tnr 3to1 и 3 буфера в 2to1; режим задаётся в iq xml.

При включённом motion имеется один масштабированный выход; прореживание mxn поддерживает настройки IQ XML 4x8 и 8x8.

buf_size: ALIGN(width / m, 16) * (height / n) * 1.5

buf_cnt: по умолчанию 6, зависит от числа буферов, запрошенных AIQ self_path video.

3\. DDR_3: ISPP TNR записывает FBC YUV420 и gain в DDR, затем ISPP NR&amp;Sharp повторно читает их из DDR для обработки.

Занимаемая память: buf_size * buf_cnt.

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 2, минимальное значение.

4\. DDR_4: ISPP NR&amp;Sharp записывает YUYV в DDR, ISPP FEC читает их для обработки.

Занимаемая память: buf_size * buf_cnt (при выключенной fec память не занимается).

```text
buf_size: width * height * 2
```

buf_cnt: 2, минимальное значение.

5\. DDR_5: буферы четырёх выходов ISPP; размер определяется заданными пользователем разрешением, форматом и buf_cnt.

Указанные buf_cnt позволяют оптимизировать использование памяти.

Размер резервируемой памяти isp cma: можно сначала выделить больше памяти и определить фактическое использование после запуска приложения камеры.

```text
  isp_reserved: isp {
      compatible = "shared-dma-pool";
      inactive;
      reusable;
      size = <0x10000000>;//256M and need 4M align
  };
  enable cma debug
  +++ b/arch/arm/configs/rv1126_defconfig
  @@ -62,6 +62,8 @@ CONFIG_IOSCHED_BFQ=y
   CONFIG_KSM=y
   CONFIG_DEFAULT_MMAP_MIN_ADDR=32768
   CONFIG_CMA=y
  +CONFIG_CMA_DEBUG=y
  +CONFIG_CMA_DEBUGFS=y
  one page is 4K, 26091 page is 104364K and need 4M align, so config 104M to
  isp_reserved
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# ls
  alloc  base_pfn  bitmap  count free  maxchunk order_per_bit  used
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# cat used
  26091
```

## 18. Оптимизация задержки RV1109/RV1126

**1. Настроить vicap wait-line**

Задать wait-line в узле vicap DTS. Например, при высоте 1520 и wait-line 760 буфер передаётся isp уже после захвата половины кадра. Настроить wait-line по скорости чтения буфера isp.

```text
&rkcif_mipi_lvds {
wait-line = <760>;
};
```

Также доступна следующая команда с поддержкой динамической настройки.

```text
  echo 1000 > /sys/devices/platform/rkcif_mipi_lvds/wait_line
```

Примечание: слишком малое wait-line вызывает преждевременное чтение буфера isp, пока часть данных ещё не захвачена и содержит предыдущий кадр. При резких изменениях нижняя часть изображения может выглядеть разорванной. Подбирать wait-line следует по фактическим испытаниям.

**2. Настроить isp wait-line**

Задать wait-line в узле isp DTS. Например, при высоте 1520 и wait-line 760 передача ispp начинается после обработки строки 760. Настроить wait-line по времени обработки ISP и ISPP.

```text
&rkisp_vir0 {
wait-line = <760>;
};
```

Для отладки можно настроить /sys/module/video_rkisp/parameters/wait_line до открытия isp video.

Примечание: при слишком малом wait-line и работе ISPP быстрее ISP формат сжатия FBC вызывает состояние hold. Эта возможность не поддерживается с Motion и несколькими сенсорами.

**3. Настроить ispp wait-line для четырёх потоков**

Задать wait-line в узле ispp DTS. Например, при высоте 1520 и wait-line 896 изображение передаётся далее после обработки строки 896. Настроить wait-line по времени обработки ISPP (nr или fec) и следующего блока.

```text
&rkispp_vir0 {
     status = "okay";
     wait-line = <896>;
};
```

Для отладки можно настроить /sys/module/video_rkispp/parameters/wait_line до открытия ispp video.

Примечание: слишком малое значение wait-line при обработке на следующем этапе быстрее ISPP вызывает ошибки изображения. Несколько сенсоров не поддерживаются.

**4. Повысить скорость аппаратной обработки**

1) Повысить isp/ispp clk

   drivers/media/platform/rockchip/isp/hw.c

```text
static const struct isp_clk_info rv1126_isp_clk_rate[] = {
{
.clk_rate = 20,
.refer_data = 0,
}, {
.clk_rate = 600,
.refer_data = 1920, //width
}, {
.clk_rate = 600,
.refer_data = 2688,
}, {
.clk_rate = 600,
.refer_data = 3072,
}, {
.clk_rate = 600,
.refer_data = 3840,
}
};
```

   drivers/media/platform/rockchip/ispp/hw.c

```text
static const struct ispp_clk_info rv1126_ispp_clk_rate[] = {
{
.clk_rate = 150,
.refer_data = 0,
}, {
.clk_rate = 500,
.refer_data = 1920 //width
}, {
.clk_rate = 500,
.refer_data = 2688,
}, {
.clk_rate = 500,
.refer_data = 3072,
}, {
.clk_rate = 500,
.refer_data = 3840,
}
};
```

2) Отключить iommu и использовать зарезервированную память

```text
&rkisp_mmu {
status = "disabled";
};
  &rkisp {
        memory-region = <&isp_reserved>;
  };
&rkispp_mmu {
status = "disabled";   };
  &rkispp {
        memory-region = <&isp_reserved>;
  };
```

## 19. Частые вопросы

### 19.1 Как отдельно обновить версию драйвера

(1) Создать патчи ядра нового SDK.

```text
git format-patch A..B drivers/media/common drivers/media/v4l2-core drivers/media/platform/rockchip drivers/media/i2c include/uapi/linux/rkisp2-config.h include/uapi/linux/rkisp21-config.h include/uapi/linux/rkispp-config.h include/uapi/linux/rkcif-config.h include/uapi/linux/rk-camera-module.h include/uapi/linux/rk_vcm_head.h include/uapi/linux/videodev2.h include/uapi/linux/media-bus-format.h -o tmp_patch
```

(2) Применить патчи к ядру старого SDK.

```text
git am tmp_patch/*
```

Примечание: A — commit id старого ядра, B — commit id нового ядра, tmp_patch — каталог выходных патчей.

### 19.2 Как получить версию драйвера

Из журнала загрузки ядра

```text
  rkisp ffb50000.rkisp: rkisp driver version: v00.01.00
  rkispp ffb60000.rkispp: rkispp driver version: v00.01.00
```

Получить следующим способом

```text
  cat /sys/module/video_rkisp/parameters/version
  cat /sys/module/video_rkispp/parameters/version
```

### 19.3 Как проверить загрузку драйвера RKISP

После успешной загрузки RKISP в /dev/ появляются устройства video и media. При нескольких /dev/video узлы, зарегистрированные RKISP, можно найти через /sys.

```text
  localhost ~ # grep'' /sys/class/video4linux/video*/name
```

Также можно вывести топологию media-ctl и проверить корректность pipeline.

Для проверки загрузки драйверов камер: после регистрации всех камер ядро выводит следующий журнал.

```text
  localhost ~ # dmesg | grep Async
  [0.682982] RKISP: Async subdev notifier completed
```

Если строки Async subdev notifier completed нет, сначала проверить ошибки сенсора и успешность связи I2C.

### 19.4 Как настроить формат хранения RAW в ISP/VICAP

isp：

**rv1109/rv1126:**

Три режима:

0: raw12/raw10/raw8 8bit уплотнённое хранение

1: raw12/raw10 16bit одна ячейка памяти на пиксель старший байт первым

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| 3| 2| 1| 0| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4|
```



2: raw12/raw10 16bit одна ячейка памяти на пиксель выравнивание по старшим битам

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



**rk356x:**

Три режима:

0: raw12/raw10/raw8 8bit уплотнённое хранение

1: raw12/raw10 16bit одна ячейка памяти на пиксель выравнивание по младшим битам

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
```



2: raw12/raw10 16bit одна ячейка памяти на пиксель выравнивание по старшим битам

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



Указания по управлению:

В AIQ добавлено управление режимом хранения. При запуске программа AIQ настраивает поддерживаемый режим хранения в соответствии с моделью сенсора.

rv1109/rv1126: поддерживаются AIQ v0x1.0x71.1 и новее; rk356x: AIQ v2.60.01 и новее.

Форматом хранения также можно управлять через ioctl потокового устройства. Определения находятся в include/uapi/linux/rkisp2-config.h:

```text
  #define RKISP_CMD_GET_CSI_MEMORY_MODE \
      _IOR('V', BASE_VIDIOC_PRIVATE + 100, int)
  #define RKISP_CMD_SET_CSI_MEMORY_MODE \
      _IOW('V', BASE_VIDIOC_PRIVATE + 101, int)
  enum isp_csi_memory {
      CSI_MEM_COMPACT = 0,
      CSI_MEM_WORD_BIG_END = 1,
      CSI_MEM_WORD_LITTLE_ALIGN = 1,
      CSI_MEM_WORD_BIG_ALIGN = 2,
  };
```

vicap：

**rv1109/rv1126/rk356x:**

Три режима:

0: raw12/raw10/raw8 8bit уплотнённое хранение

1: raw12/raw10 16bit одна ячейка памяти на пиксель выравнивание по младшим битам для rv1126/rv1109/rk356x

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
| -| -| -| -|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
```



2: raw12/raw10 16bit одна ячейка памяти на пиксель выравнивание по старшим битам для rv1126/rv1109/rk356x

```text
|15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
```



Примечание: DVP в rv1109/rv1126/rk356x поддерживает только неуплотнённый режим с выравниванием по младшим или старшим битам.

Указания по управлению:

В AIQ добавлено управление режимом хранения. При запуске программа AIQ настраивает поддерживаемый режим хранения в соответствии с моделью сенсора.

rv1109/rv1126: поддерживаются AIQ v0x1.0x71.1 и новее; rk356x: AIQ v2.60.01 и новее.

Форматом хранения также можно управлять через ioctl потокового устройства. Определения находятся в include/uapi/linux/rkcif-config.h:

```text
  #define RKCIF_CMD_GET_CSI_MEMORY_MODE \
      _IOR('V', BASE_VIDIOC_PRIVATE + 0, int)
  #define RKCIF_CMD_SET_CSI_MEMORY_MODE \
      _IOW('V', BASE_VIDIOC_PRIVATE + 1, int)
  enum cif_csi_lvds_memory {
      CSI_LVDS_MEM_COMPACT = 0,
      CSI_LVDS_MEM_WORD_LOW_ALIGN = 1,
      CSI_LVDS_MEM_WORD_HIGH_ALIGN = 2,
  };
```

VICAP можно настроить следующей командой, но только для отладки.

Настройка неуплотнённого режима: каждое число соответствует каналу.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

Настройка выравнивания по младшим битам.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/is_high_align
```

Настройка выравнивания по старшим битам.

```text
  echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/is_high_align
```

### 19.5 Как настроить сброс VICAP при ошибках

Драйвер VICAP имеет механизм сброса через CRU при возникновении ошибок VICAP. Порядок использования:

**Настройка для kernel-4.19:**

Для включения механизма сброса в узел соответствующего интерфейса CIF в DTS нужно добавить параметр rockchip, cif-monitor. Если параметр не задан, механизм по умолчанию выключен.

```text
  &rkcif_mipi_lvds {
      status = "okay";
      /* rockchip,cif-monitor = <index0 index1 index2 index3 index4>; */
      rockchip,cif-monitor = <2 2 5 1000 5>;
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2 3 4>;
          };
      };
  };
```

index0: режим сброса; сейчас имеются четыре основных режима:

<!-- Source: English PDF p201, table unit 1632 -->

| Режим | Описание |
| --- | --- |
| Idle | Мониторинг не используется. |
| Continue | Непрерывный мониторинг ошибок MIPI и прекращения потока VICAP; при ошибке или остановке выполняется сброс VICAP. По достижении числа кадров index1 таймер мониторинга инициализируется в конце кадра и начинается мониторинг. Следующая фраза оригинала утверждает, что при достижении соответствующего числа кадров мониторинг не запускается; противоречие требует проверки драйвера. Период выборки задаётся index2. |
| Trigger | Сброс запускается только при ошибке MIPI уровня протокола CSI2 в VICAP. index4 задаёт число сообщений об ошибке. При достижении index4 таймер мониторинга инициализируется в прерывании конца кадра, затем по истечении периода index2 выполняется сброс VICAP. |
| Hotplug | Hotplug предназначен главным образом для автомобильных мостов n4/tp6188 и устраняет повреждение изображения или остановку потока при подключении. Включает Continue: непрерывно отслеживает ошибки MIPI и остановку потока VICAP и выполняет сброс; после index1 кадров таймер инициализируется в конце кадра и запускается мониторинг, до этого он не запускается. Выборка выполняется с периодом index2. Отличие от Continue: даже без ошибок MIPI и остановки потока, если сенсор задаёт и включает информацию сброса командой RKMODULE_SET_VICAP_RST_INFO, VICAP после получения её через RKMODULE_GET_VICAP_RST_INFO запускает сброс. |

index1: для continue или hotplug таймер мониторинга запускается после захвата index1 кадров.

index2: период таймера мониторинга в кадрах; период составляет index2 кадров.

index3: задержка сброса. После обнаружения ошибки VICAP CSI2 мониторинг продолжается в течение указанного времени. Когда ошибки перестают нарастать, выполняется сброс. По истечении времени сброс выполняется немедленно независимо от дальнейшего роста ошибок. Единица — ms.

index4: число ошибок MIPI CSI, по достижении которого запускается сброс.

Для обнаружения ошибок как MIPI, так и DVP механизм изменён. Необходимо обновление со следующими коммитами:

```text
  media: rockchip: rkcif reset all dev when trigger reset event
      move monitor param to rkcif node
      ag &rkcif {
          status = "okay";
          rockchip,cif-monitor = <3 200 1000 5 0>;
          /*
           * index 0: monitor mode
           *     val: 0 idle
           *          1 Continue mode, detect cut of stream or csi2 err
           *          2 trigger mode, detect csi2 err
           *          3 Hotplug, detect hot plug or cut off stream or csi2 err
           * index 1: monitor cycle
           *     val: timer of monitor cycle, unit ms
           * index 2: error interval
           *     val: time of error keeping, such as 1000,
           *          mean atfer one second error still occur,force reset dev,
           *          the max timer to wait error stop
           * index 3: err_ref_cnt:
           *     val: timer error ref val for reset
           * index 4: reset_by_user
           *     val: set val 1 to control reset by user
           */
      };
      Signed-off-by: Zefa Chen <zefa.chen@rock-chips.com>
      Change-Id: If4da872c7ee3c5140f94e5cf331cab84005361d2
```

Подробности: (1) Конфигурация, записанная в оригинале как "rockchip, cif monitor", перенесена из rkcif_ mipi_lvds в узел rkcif. (2) index1 удалён: обнаружение начинается после запуска потока. (3) Добавлен reset_by_user: при 1 драйвер сам не выполняет сброс, а ждёт приложения. Приложение периодически опрашивает ioctl "RKCIF_CMD_ET_RESET_INFO" узла video; состояние 1 означает необходимость сброса. В подходящий момент приложение вызывает ioctl "RKCIF_CMD_SET_RESET". Идентификаторы сохранены как в источнике; написание следует сверить с целевым BSP.

**Настройка для kernel-5.10:**

В drivers/media/rockchip/cif/Kconfig добавлена настройка обнаружения ошибок. Можно изменить значения по умолчанию либо переопределить их в defconfig. Параметры:

<!-- Source: English PDF p203, table unit 1643 -->

| ROCKCHIP_CIF_USE_MONITOR | Включение мониторинга аномалий; пользователь должен включить его, по умолчанию выключен. |
| --- | --- |
| ROCKCHIP_CIF_MONITOR_MODE | Режим мониторинга аномалий, определён как в kernel 4.19. |
| ROCKCHIP_CIF_MONITOR_START_FRAME | Номер кадра начала проверки; рекомендуется 0. |
| ROCKCHIP_CIF_MONITOR_CYCLE | Период проверки в межкадровых интервалах. При 25fps и значении 4 он равен 40ms * 4. По оценке проекта рекомендуется период около 400ms. |
| ROCKCHIP_CIF_MONITOR_KEEP_TIME | Время отложенного сброса. После обнаружения ошибки VICAP CSI2 мониторинг продолжается в течение указанного времени; если ошибки перестают нарастать, выполняется сброс. По истечении времени сброс выполняется немедленно независимо от роста ошибок. Единица — ms. |
| ROCKCHIP_CIF_MONITOR_ERR_CNT | Обычно число ошибок MIPI; по умолчанию 5, то есть сброс после 5 * 2 ошибок. |
| ROCKCHIP_CIF_RESET_BY_USER | При значении 1 выполняется только обнаружение аномалий без автоматического сброса; приложение получает уведомление для сброса в подходящий момент. |

При сбросе под управлением пользователя учесть два пункта: (1) Событие сброса передаётся через узел MIPI CSI2. Найдите его командой media-ctl -p -d /dev/mediaX (X = 0, 1, 2, 3 и т. д.) и слушайте события сброса. (2) Откройте любой video-узел stream_cif_mipi_id0~3: они принадлежат одному оборудованию. Обычно выбирают stream_cif_mipi_id0 и выполняют сброс через соответствующий ioctl.

Пример:

```text
  #include <stdio.h>
  #include <stdlib.h>
  #include <getopt.h>
  #include <fcntl.h>
  #include <unistd.h>
  #include <sys/ioctl.h>
  #include <linux/videodev2.h>
  #include "rkcif-config.h"
  int subscribe_event(int fd, int event)
  {
      int ret = 0;
      struct v4l2_event_subscription sub;
      if (fd < 0) {
          printf("fd is err\n");
          return -1;
      }
      sub.type = event;
      sub.id = 0;
      ret = ioctl(fd, VIDIOC_SUBSCRIBE_EVENT, &sub);
      if (ret < 0) {
          printf("VIDIOC_SUBSCRIBE_EVENT fail\n");
          return -1;
      }
      return 0;
  }
  int unsubscribe_event(int fd, int event)
  {
      int ret = 0;
      struct v4l2_event_subscription sub;
      if (fd < 0) {
          printf("fd is err\n");
          return -1;
      }
      sub.type = event;
      sub.id = 0;
      ret = ioctl(fd, VIDIOC_UNSUBSCRIBE_EVENT, &sub);
      if (ret < 0) {
          printf("VIDIOC_SUBSCRIBE_EVENT fail\n");
          return -1;
      }
      return 0;
  }
  int main(int argc, char **argv)
  {
      char *dev;
      int ret;
      int fd = -1;
      int fd_cif = -1;
      int i = 0;
      struct v4l2_event event;
      char *dev_cif;
      if (argc != 3) {
          printf("invalid input\n");
          for (i = 0; i < argc; i++)
              printf("argv[%d]:%s\n", i, argv[i]);
          return -1;
      }
      dev = argv[1];
      fd = open(dev, O_RDWR, 0);
      if (fd < 0) {
          printf("open dev:%s fail\n", dev);
          return -1;
      }
      dev_cif = argv[2];
      fd_cif = open(dev_cif, O_RDWR, 0);
      if (fd_cif < 0) {
          printf("open dev:%s fail\n", dev_cif);
          return -1;
      }
      ret = subscribe_event(fd, V4L2_EVENT_RESET_DEV);
      if (ret < 0)
          goto end;
      while (1) {
              printf("VIDIOC_DQEVENT ready %d\n", ret);
          ret = ioctl(fd, VIDIOC_DQEVENT, &event);
              if (ret) {
                      printf("VIDIOC_DQEVENT err %d\n", ret);
                      goto end;
                 }
          printf("VIDIOC_DQEVENT event %x, %d\n", event.type, event.reserved[0]);
          if (event.type == V4L2_EVENT_RESET_DEV) {
              ret = ioctl(fd_cif, RKCIF_CMD_SET_RESET, &event.reserved[0]);
              if (ret) {
                          printf("RKCIF_CMD_SET_RESET err %d\n", ret);
                          goto end;
              }
                 }
      }
  end:
      ret = unsubscribe_event(fd, V4L2_EVENT_RESET_DEV);
      close(fd);
      close(fd_cif);
      return 0;
  }
```

### 19.6 Как захватить RAW и YUV от CIS

После разработки драйвера можно непосредственно использовать стандартную команду v4l2-ctl для получения выходных данных CIS. Справка v4l2-ctl: https://www.mankier.com/1/v4l2-ctl

**Пример:**

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

-d: задать имя устройства.

--set-fmt-video: задать разрешение, совпадающее с выходом сенсора. Текущее разрешение можно проверить через media-ctl -p -d /dev/mediaX.

pixelformat: формат выходных данных, например BG12, NV12.

--stream-mmap: число буферов mmap.

--stream-count: число захватываемых кадров; несколько кадров также сохраняются в одном файле.

--stream-to: задать путь сохранения.

--stream-skip: число пропускаемых кадров.

#### 19.6.1 Поддерживаемые устройства

##### 19.6.1.1 RV1109/RV1126

<!-- Source: English PDF p206, table unit 1662 -->

| Устройство | Интерфейс | Формат | Имя узла устройства | Вывод Raw | Вывод YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Неупакованный Raw | Нет |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Неупакованный Raw; упакованный Raw | Нет |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Нет | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Неупакованный Raw; упакованный Raw | Нет |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Неупакованный Raw | nv12<br>nv16 |
| ISPP | Только чтение DDR | YUV | rkispp_m_bypass<br>rkispp_scale0<br>rkispp_scale1<br>rkispp_scale2 | Нет | nv12<br>nv16 |

##### 19.6.1.2 RK356X

<!-- Source: English PDF p207, table unit 1664 -->

| Устройство | Интерфейс | Формат | Имя узла устройства | Вывод Raw | Вывод YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Неупакованный Raw | Нет |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Неупакованный Raw; упакованный Raw | Нет |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Нет | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Неупакованный Raw; упакованный Raw | Нет |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Неупакованный Raw | nv12<br>nv16 |

Примечание:

1\. Команда запроса имён узлов: media-ctl -p -d /dev/mediaX (X = 0, 1, 2, 3...).

#### 19.6.2 Формат хранения RAW

##### 19.6.2.1 Неупакованный формат RAW

В неупакованном формате raw10 и raw12 сенсора хранятся в 16 битах с выравниванием по старшим битам. Расположение raw12 на примере четырёхбайтового участка памяти:

![Неуплотнённое размещение RAW в памяти — английский оригинал, страница 207](/docs/rockchip-isp30-vi-driver/assets/en-p207-X900.png)

*Неуплотнённое размещение RAW в памяти — английский оригинал, страница 207*

##### 19.6.2.2 Упакованный формат RAW

Расположение raw12 на примере четырёхбайтового участка памяти:

![Уплотнённое размещение RAW в памяти — английский оригинал, страница 207](/docs/rockchip-isp30-vi-driver/assets/en-p207-X901.png)

*Уплотнённое размещение RAW в памяти — английский оригинал, страница 207*

**Важно:**

При входе Raw10 или Raw12 устройство ISP mainpath всегда выдаёт RAW в неуплотнённом формате хранения Raw12.

#### 19.6.3 Примеры:

##### 19.6.3.1 Вывод RAW через VICAP

1\. По умолчанию используется упакованный формат. Переключение между упакованным и неупакованным выполняется командами:

```text
      echo 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

0 означает неупакованный формат, 1 — упакованный. При нескольких каналах команда может быть изменена на:

```text
      echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

Числа после echo последовательно задают тип хранения каналов vc0, vc1, vc2, vc3.

2\. video0~3 соответствуют vc0~vc3.

3\. Команда v4l2-ctl

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.2 Неупакованный RAW через ISP maipath (написание заголовка оригинала сохранено)

(1) Требуется захват изображения mainpath. Выходной тракт ISP по умолчанию — rkisp-bridge-ispp; переключите его на mainpath следующей командой:

```text
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Примечание: без -d используется узел media0. Если rkisp-isp-subdev расположен не в media0, необходимо указать его media-узел параметром -d.

0 после "rkisp-bridge-ispp" означает pad0, sink. Подробности приведены в документации V4L2.

2\. По умолчанию isp выдаёт YUYV8_2X8. Для перехода на Bayer RAW использовать следующую команду:

```text
      media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
```

Примечание: rkisp-isp-subdev не обязательно находится в media0. -d задаёт устройство; нужно определить, в каком media-узле находится rkisp-isp-subdev.

2 после "rkisp-isp-subdev" означает pad2, source. Подробности приведены в документации V4L2.

После изменения необходимо проверить командой media-ctl -p -d /dev/mediaX (X=0,1,2,...), вступило ли оно в силу. Только после этого захватываемые RAW-данные являются исходными RAW-данными.

3\. Команда v4l2-ctl

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.3 Вывод YUV через VICAP:

Вход должен быть в формате YUV; при входном RAW vicap не может выдавать YUV.

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### 19.6.3.4 Вывод YUV через ISP:

```text
  v4l2-ctl -d /dev/video5  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

Примечание:

(1) Для ISP можно захватывать mainpath или selfpath; video5 — только пример, используйте фактическую конфигурацию.

(2) При входе RAW ISP преобразует данные в YUV и обрабатывает изображение. Модулями должен управлять RK AIQ. Эти команды задают только поток данных, оставляя параметры обработки по умолчанию драйвера, поэтому изображение обычно некорректно.

##### 19.6.3.5 Вывод YUV через ISPP:

Источник входа ispp — rkisp-bridge-ispp;

Связи rkisp_mainpath, rkisp_selfpath и rkispp_input_image должны быть отключены.

Формат rkisp-isp-subdev pad2: Source должен быть fmt:YUYV8_2X8.

По умолчанию isp связан с ispp; пример команды:

```text
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_selfpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[1]'
  media-ctl -d /dev/media1 -l '"rkispp_input_image":0->"rkispp-subdev":0[1]'
  v4l2-ctl -d /dev/video13 \
  --set-fmt-video=width=2688,height=1520,pixelformat=NV12 \
  --stream-mmap=3 --stream-to=/tmp/nv12.out --stream-count=20 --stram-poll
```

Примечание: для -d можно выбрать следующие узлы по требованиям захвата; имена проверяются через media-ctl -p -d /dev/mediaX.

<!-- Source: English PDF p210, table unit 1718 -->

| rkispp_m_bypass | Полное разрешение, формат YUV |
| --- | --- |
| rkispp_scale0 | Полное либо уменьшенное YUV; масштаб [1 8], максимальная ширина 3264. |
| rkispp_scale1 | Полное либо уменьшенное YUV; масштаб [2 8], максимальная ширина 1280. |
| rkispp_scale2 | Полное либо уменьшенное YUV; масштаб [2 8], максимальная ширина 1280. |

### 19.7 Как переключить разрешение выхода CIS

(1) Если драйвер сенсора поддерживает несколько разрешений и требуется захват RAW-данных другого разрешения, переключите текущее разрешение сенсора следующей командой:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"m01_f_os04a10 1-0036-1":0[fmt:SBGGR12_1X12/2688x1520]'
```

Примечание: m01_f_os04a10 1-0036-1 — имя узла сенсора, за которым идёт требуемый формат; он должен поддерживаться драйвером сенсора.

(2) Для VICAP достаточно настроить узел сенсора; для ISP также требуется настроить входной и выходной форматы ISP. Пример команды:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[crop:(0,0)/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[crop:(0,0)/2688x1520]'
```

### 19.8 Как задать экспозицию CIS

(1) Найдите имя узла сенсора командой media-ctl -p -d /dev/mediaX. Формат имени узла — /dev/v4l- subdevX. Пример команды:

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl 'exposure=1216,analogue_gain=10'
```

Можно также задавать отдельно:

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl exposure=1216
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl analogue_gain=10
```

2\. Максимальная экспозиция ограничена vts сенсора, например vts-4 или vts-10; точные ограничения указаны в его руководстве. При 30fps максимальная выдержка составляет 33.3ms; для 40ms необходимо увеличить vts. Пропорция vts_30fps * 30fps = vts_25fps * 25fps позволяет вычислить vts для 25fps; (vts-height) равно vblank. Передав рассчитанное vblank драйверу, можно задать большую экспозицию. Пример команды:

vts — длина кадра, включая активные строки и строки гашения.

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl vertical_blanking=200
```

### 19.9 Как поддержать монохромную камеру

Драйвер CIS должен выбрать для монохромного сенсора один из следующих трёх выходных форматов:

```text
  MEDIA_BUS_FMT_Y8_1X8 (sensor 8bit output)
  MEDIA_BUS_FMT_Y10_1X10 (sensor 10bit output)
  MEDIA_BUS_FMT_Y12_1X12 (sensor 12bit output)
```

То есть возвращать указанный формат в xxxx_get_fmt и xxxx_enum_mbus_code.

RKISP выполняет специальную настройку этих трёх форматов для захвата монохромного изображения.

Если приложению нужен Y8, следует использовать только SP Path: лишь этот тракт поддерживает вывод Y8.

### 19.10 Как поддержать объединение чётных и нечётных полей

RKISP поддерживает объединение чётных и нечётных полей при следующих условиях:

(1) Интерфейс MIPI: поддерживает вывод счётчика кадров из коротких пакетов начала и конца кадра. Драйвер RKISP использует его для определения чётности текущего поля.

(2) Интерфейс BT656: поддерживает стандартные SAV/EAV, где bit6 содержит признак чётности поля. Драйвер RKISP использует его для определения чётности текущего поля.

(3) Эта функция имеется у video-узла RKISP1_selfpath драйвера RKISP, но у других video-узлов её нет. Если приложение ошибочно использует другой узел, драйвер выдаёт следующую ошибку:

```text
"Only selfpath support interlaced"
```

Сведения о RKISP_selfpath можно посмотреть через media-ctl -p:

```text
  entity 3: rkisp_selfpath (1 pad, 1 link)
       type Node subtype V4L flags 0
        device node name /dev/video1
      pad0: Sink
         <- "rkisp-isp-subdev":2 [ENABLED]
```

**Реализация драйвера:**

format.field драйвера следует задать как V4L2_FIELD_INTERLACED, обозначающий чересстрочный выход, и возвращать это значение из xxxx_get_fmt. Пример: driver/media/i2c/tc35874x.c.

### 19.11 Как просмотреть отладочные сведения

1\. Проверить сведения media pipeline, соответствующие настройкам камеры в dts.

```text
  media-ctl -p -d /dev/mediaX (X = 0, 1, 2 ..)
```

(2) Просмотрите информацию proc: текущее состояние ISP/ISPP и вход/выход кадров. Можно выполнить cat несколько раз.

```text
  cat /proc/rkisp*
```

(3) Просмотрите отладочную информацию драйвера, задав уровень отладки узлов ISP и ISPP. Чем выше значение, тем больше информации.

```text
  echo n> /sys/module/video_rkisp/parameters/debug (n = 0, 1, 2, 3; 0 is off)
  echo n> /sys/module/video_rkispp/parameters/debug
  echo 8 > /proc/sys/kernel/printk
```

4\. Проверить регистры и выгрузить файл reg.

Для RV1109/RV1126

```text
      io -4 -l 0x10000 0xffb50000> /tmp/isp.reg
      io -4 -l 0x1000 0xffb60000> /tmp/ispp.reg
```

Для RK3566/RK3568

```text
      io -4 -l 0x10000 0xfdff0000> /tmp/isp.reg
```

5\. Порядок предоставления отладочной информации

(1) При возникшей проблеме: 1→2→4→3.

(2) Воспроизведение: 3→запуск→воспроизведение→1→2→4.

6\. Описание сведений proc

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkisp-vir0 Version:v01.06.00
  clk_isp    400000000
  aclk_isp   500000000
  hclk_isp   250000000
  Interrupt  Cnt:7521 ErrCnt:0
  Input      rkcif_mipi_lvds Format:SBGGR10_1X10 Size:2688x1520@30fps Offset(0,0)
  Isp Read   mode:frame2 (frame:1522 rate:33ms idle time:10ms) cnt(total:1522
  X1:1503 X2:18 X3:-1)
  Output     rkispp0 Format:FBC420 Size:2688x1520 (frame:1522 rate:32ms)
  DPCC0      ON(0x5)
  DPCC1      ON(0x5)
  DPCC2      ON(0x5)
  BLS        ON(0x1)
  SDG        OFF(0x80446197)
  LSC        ON(0x1)
  AWBGAIN    ON(0x80446197) (gain: 0x01110111, 0x028a0202)
  DEBAYER    ON(0x7000111)
  CCM        ON(0x80000001)
  GAMMA_OUT  ON(0x80000001)
  CPROC      ON(0xf)
  IE         OFF(0x0) (effect: BLACKWHITE)
  WDR        OFF(0x30cf0)
  HDRTMO     ON(0xa4f05a27)
  HDRMGE     ON(0x80000005)
  RAWNR      ON(0x80100001)
  GIC        OFF(0x0)
  DHAZ       ON(0x80101119)
  3DLUT      OFF(0x2)
  GAIN       ON(0x80010111)
  LDCH       OFF(0x0)
  CSM        FULL(0x80446197)
  SIAF       OFF(0x0)
  SIAWB      OFF(0x0)
  YUVAE      ON(0x400100f3)
  SIHST      ON(0x38000107)
  RAWAF      ON(0x7)
  RAWAWB     ON(0x776887)
  RAWAE0     ON(0x40000003)
  RAWAE1     ON(0x400000f5)
  RAWAE2     ON(0x400000f5)
  RAWAE3     ON(0x400000f5)
  RAWHIST0   ON(0x40000501)
  RAWHIST1   ON(0x60000501)
  RAWHIST2   ON(0x60000501)
  RAWHIST3   ON(0x60000501)
  Monitor    OFF Cnt:0
```

clk_isp: тактовая частота isp.

Interrupt: прерывания mipi и модулей isp; рост счётчиков означает поступление данных в isp. ErrCnt — статистика ошибочных прерываний.

Input: источник, формат, разрешение и сведения об обрезке входа.

Isp read: mode — one или hdr2/3; frame — номер; rate — межкадровый интервал; idle/working — состояние isp; time — время работы аппаратного isp; cnt — общее число обратных чтений и количество случаев с одним, двумя, тремя чтениями.

Output: получатель, формат и разрешение выхода; frame — номер, rate — межкадровый интервал.

Other: состояния включения модулей isp.

Monitor: обнаружение аномалий и сброс.

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkispp-vir0 Version:v01.06.00
  clk_ispp   350000000
  aclk_ispp  500000000
  hclk_ispp  250000000
  Interrupt  Cnt:79532 ErrCnt:0
  Input      rkisp0 Format:FBC420 Size:2688x1520 (frame:26510 rate:32ms delay:13ms)
  Output     rkispp_m_bypass Format:NV12 Size:2688x1520 (frame:26509 rate:32ms
  delay:30ms)
  TNR        ON(0xf00000f) (mode: 3to1) (global gain: disable) (frame:26510
  time:8ms idle) CNT:0x0 STATE:0x1e000000
  NR         ON(0x57) (external gain: enable) (frame:26510 time:6ms working)
  0x5f0:0x19 0x5f4:0x780f
  SHARP      ON(0x19) (YNR input filter: ON) (local ratio: OFF) 0x630:0x19
  FEC        OFF(0x2) (frame:0 time:0ms idle) 0xc90:0x0
  ORB        OFF(0x0)
  Monitor    ON Cnt:0
```

clk_ispp: тактовая частота ispp.

Interrupt: прерывания обработки ispp; рост счётчиков означает поступление данных. ErrCnt — статистика ошибочных прерываний.

Input: источник, формат, разрешение; frame — номер, rate — межкадровый интервал, delay — время входного кадра минус время кадра mipi.

Output: получатель, формат, разрешение; frame — номер, rate — межкадровый интервал, delay — время выходного кадра минус время кадра mipi, также зависит от выходного кадрового буфера.

Other: состояния включения модулей ispp; frame — номер, time — время работы аппаратного модуля, idle/working — его состояние.

Monitor: обнаружение аномалий и сброс.

```text
  [root@RV1126_RV1109:/]# cat /proc/rkcif_mipi_lvds
  Driver Version:v00.01.0a
  Work Mode:ping pong
  Monitor Mode:idle
  aclk_cif:500000000
  hclk_cif:250000000
  dclk_cif:297000000
  Input Info:
          src subdev:m01_f_os04a10 1-0036-1
          interface:mipi csi2
          lanes:4
          vc channel: 0 1
          hdr mode: hdr_x2
          format:SBGGR10_1X10/2688x1520@30
          crop.bounds:(0, 0)/2688x1520
  Output Info:
          format:BG10/2688x1520(0,0)
          compact:enable
          frame amount:264
          early:10 ms
          single readout:30 ms
          total readout:30 ms
          rate:33 ms
          fps:30
          irq statistics:
                          total:515
                          csi over flow:0
                          csi bandwidth lack:0
                          all err count:0
                          frame dma end:515
```

Work Mode: начиная после rv1109 по умолчанию используется ping pong; этот режим рекомендуется.

Monitor Mode: режим мониторинга. После включения при аномалии mipi выполняется сброс vicap.

Input Info: сводка входных данных.

src subdev: входное устройство, обычно сенсор. Информация включает ориентацию камеры, индекс, имя устройства, шину I2C, 7bit адрес ведомого и другие сведения.

interface: физический интерфейс данных, например mipi, lvds, dvp.

vc channel: реально используемый виртуальный канал многоканальной передачи по протоколу MIPI.

hdr mode: режим сенсора — normal, hdr_x2 или hdr_x3.

format: тип входных данных.

crop.bounds: параметры обрезки можно настроить в .get_selection драйвера сенсора для соответствующей обрезки входных данных.

Output Info: сводка выходных данных.

format: тип выходных данных.

compact: по умолчанию уплотнённый вывод. Определения см. в разделе «Как захватить выходные RAW- и YUV-данные CIS».

**frame amount:**

early: в режиме wake up после захвата wait_line строк буфер заранее передаётся ISP для обработки. По умолчанию буфер передаётся ISP после захвата полного кадра. early — выигрыш во времени за счёт передачи буфера до завершения кадра. Настройка wake up описана в руководстве по оптимизации задержки RV1109/RV1126.

single readout: в HDR время передачи одного кадра равно времени передачи длинного кадра.

total readout: в HDR интервал между началом передачи длинного и окончанием передачи короткого кадра — исходное время передачи одного составного кадра.

rate: межкадровый интервал.

fps: частота кадров.

irq statistics: сведения о прерываниях.

total: общее число прерываний, включая frame end и err.

csi over flow: число прерываний переполнения.

csi bandwidth lack: число прерываний недостаточной пропускной способности.

frame dma end: число прерываний конца кадра, равное числу кадров, выданных сенсором с момента stream start.

### 19.12 Как диагностировать мерцание

Сначала определите источник мерцания по журналу AE.

Включение журнала AE:

(1) В терминале (последовательный порт или adb shell) выполнить: export persist_camera_engine_log=0x1ff3

(2) В том же терминале запустить librkaiq.so через rkisp_demo, RkLunch.sh или аналогичную программу.

(3) Если после шагов 1 и 2 журнал AE отсутствует, возможно, журналирование не включено при сборке по умолчанию. См. изменения ниже.

```text
  czf@ISP:~/rk356x_sdk/external/camera_engine_rkaiq$ git diff
  diff --git a/CMakeLists.txt b/CMakeLists.txt
  index 46fba20..f5ea67f 100755
  --- a/CMakeLists.txt
  +++ b/CMakeLists.txt
  @ -6,9 +6,9 @ if(NOT CMAKE_BUILD_TYPE)
  FORCE)
  endif()
  -if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
  #if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
  add_definitions(-DBUILD_TYPE_DEBUG)
  -endif()
  #endif()
```

Журнал AE содержит MeanLuma (статистика яркости), TmoMeanLuma (яркость после TMO), параметры экспозиции и другие данные для предварительного анализа мерцания.

![Пример журнала экспозиции AE — английский оригинал, страница 217](/docs/rockchip-isp30-vi-driver/assets/en-p217-X940.png)

*Пример журнала экспозиции AE — английский оригинал, страница 217*

Копируемая транскрипция снимка (средние точки обозначают отображённые пробелы).

```text
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7028:==================================HDR-AE·(enter)===============================
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7049:·AecRun:·SMeanLuma=0.280734,·MMeanLuma=4.009174,LMeanLuma=0.000000,TmoMeanLuma=6.188991,Isconverged=0,Longfrm=0
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7058:·>>>·Framenum=5·Cur·Piris=128,·sgain=1.000000,Stime=0.000505,mgain=1.000000,mtime=0.003005,lgain=1.000000,ltime=0.003000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:3887:·S-HighLightLuma=16.500000,S-Target=110.000000,S-GlobalLuma=0.280734,S-Target=15.662778
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:4264:·T-LowLightLuma=3.848156,T-Target=50.000000,L-GlobalLuma=4.009174,L-Target=75.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:5725:·AecHdrClmExecute:·sgain=1.000000,stime=0.002510,mgain=2.148907,mtime=0.020000,lgain=0.000000,ltime=0.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7162:·calc·result:·piris=128,sgain=1.000000,stime=0.002514,mgain=2.137962,mtime=0.020000,lgain=0.000000,ltime=0.000000
[AEC]:XCAM·DEBUG·rk_aiq_ae_algo.cpp:7166:==================================(exit)===============================
```

Анализ мерцания:

(1) Мерцание из-за объединения TMO показано ниже. После фильтрации журнала можно ясно увидеть, что статистика короткого и среднего кадров стабильна (в двухкадровом режиме средний означает длинный), а после TMO скачет. Это указывает на непригодность параметров TMO для некоторых сцен. Настройте их по руководству tuning; если проблема остаётся, обратитесь к инженеру RK по IQ.

![Пример скачка яркости TMO в журнале — английский оригинал, страница 217](/docs/rockchip-isp30-vi-driver/assets/en-p217-X941.png)

*Пример скачка яркости TMO в журнале — английский оригинал, страница 217*

Копируемая транскрипция снимка (средние точки обозначают отображённые пробелы).

```text
AecRun: SMeanLuma=3.642202, MMeanLuma=59.557796,LMeanLuma=0.000000,TmoMeanLuma=46.662384,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.638532, MMeanLuma=59.590824,LMeanLuma=0.000000,TmoMeanLuma=46.708256,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.644037, MMeanLuma=59.631191,LMeanLuma=0.000000,TmoMeanLuma=46.691742,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.642202, MMeanLuma=59.647705,LMeanLuma=0.000000,TmoMeanLuma=46.713760,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.638532, MMeanLuma=59.598164,LMeanLuma=0.000000,TmoMeanLuma=64.000000,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.640367, MMeanLuma=59.543118,LMeanLuma=0.000000,TmoMeanLuma=46.702751,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.644037, MMeanLuma=59.620182,LMeanLuma=0.000000,TmoMeanLuma=46.719265,Isconverged=1,Longfrm=0
AecRun: SMeanLuma=3.631193, MMeanLuma=59.620182,LMeanLuma=0.000000,TmoMeanLuma=46.746788,Isconverged=1,Longfrm=0
```

(2) Если статистика RAW и после TMO стабильна, но мерцание на изображении сохраняется, причина находится в последующих модулях ISP. После этих проверок обратитесь к инженеру RK для дальнейшего анализа.

(3) Если мерцание возникает при одновременном изменении time и gain, возможно, неверно настроены кадры вступления параметров в силу. Обычно time сенсора действует с n+2, gain — с n+2 или n+1. Если задержка известна, укажите её в IQ-файле для проверки. Ниже показан XML-вариант: 2 означает действие с n+2; n — кадр, в начале которого переданы параметры экспозиции. Параметры JSON аналогичны; настройте их по документации.

```text
  <EXP_DELAY index="1" type="struct" size="[1 1]">
         <Normal index="1" type="struct" size="[1 1]">
              <time_delay index="1" type="double" size="[1 1]">
              [2 ]
          </time_delay>
              <gain_delay index="1" type="double" size="[1 1]">
              [2 ]
          </gain_delay>
              <dcg_delay index="1" type="double" size="[1 1]">
              [1 ]
          </dcg_delay>
        </Normal>
        <Hdr index="1" type="struct" size="[1 1]">
           <time_delay index="1" type="double" size="[1 1]">
              [2]
           </time_delay>
           <gain_delay index="1" type="double" size="[1 1]">
              [2]
           </gain_delay>
           <dcg_delay index="1" type="double" size="[1 1]">
              [1]
           </dcg_delay>
        </Hdr>
  </EXP_DELAY>
```

Если кадр вступления в силу неизвестен, используйте AecSyncTest модуля AE в IQ-файле. Он переключает два набора параметров экспозиции через заданное число кадров. Задайте одинаковый time и разный gain, затем анализируйте MeanLuma журнала AE и соответствующие time/gain.

(4) Если при мерцании time стабилен, а gain меняется туда и обратно, возможны ошибка формулы преобразования gain либо плохая линейность сенсора.

4.1 Формула преобразования связана со спецификацией сенсора и реализацией драйвера. Подробности см. в руководстве заполнения Sensor Info. Рассчитайте регистры по time/gain журнала AE и сравните их со значениями, напечатанными драйвером. Если ручной и программный расчёты расходятся, проверьте формулу и драйвер.

4.2 Линейность можно проверить захватом RAW-изображений и получением статистики в программе просмотра изображений.

4.2.1 Проверка линейности времени экспозиции:

a. Закройте объектив матовым стеклом (можно заменить тонкой бумажной салфеткой для равномерного освещения всего изображения в линейной области), зафиксируйте gain = 1 и захватите RAW при 10ms, 20ms и 30ms. Получите статистику (обычно 8bit, диапазон 0~255) и занесите в таблицу.

b. Полностью затемните объектив и захватите RAW: его статистика даёт значение чёрного уровня. Высокая точность не требуется, поэтому строгих требований к time/gain нет, но нельзя брать чрезмерно отличающиеся значения: например, 1x при тесте и 1000x для чёрного уровня искажают статистику.

c. Вычтите чёрный уровень шага b из статистики шага a и постройте график полученной статистики от времени экспозиции. Прямая или близкая к прямой линия означает хорошую линейность.

Примечание:

(1) Таблица supported_modes драйвера содержит vts_def (длину кадра по умолчанию, включая вертикальное гашение) и частоту кадров. По ним рассчитывается экспозиция. При 30fps и vts_def=1200 интервал кадра 1s/30fps=33.333ms; 10ms соответствует 10/33.333*1200=360 строкам. Настройку см. в разделе параметров экспозиции CIS.

(2) Статистика RAW шага a должна быть выше чёрного уровня и ниже 180.

4.2.2 Линейность усиления

a. Закройте объектив матовым стеклом, зафиксируйте time = 10ms и захватите RAW при gain 1x, 2x, 4x, 8x и т. д. Получите статистику (обычно 8bit, 0~255) и занесите в таблицу. Если при некоторых gain значение не ниже 180, измените time и проверяйте диапазоны отдельно.

b. Полностью затемните объектив и захватите RAW: его статистика даёт значение чёрного уровня. Высокая точность не требуется, поэтому строгих требований к time/gain нет, но нельзя брать чрезмерно отличающиеся значения: например, 1x при тесте и 1000x для чёрного уровня искажают статистику.

уровня.

c. Вычтите чёрный уровень шага b из статистики шага a и постройте график полученной статистики от времени экспозиции. Прямая или близкая к прямой линия означает хорошую линейность.

Постройте график статистики после вычитания чёрного уровня от gain. Прямая или близкая к прямой линия означает хорошую линейность.

Примечание:

(1) Статистика RAW шага a должна быть выше чёрного уровня и ниже 180.

(2) При подозрении на нелинейность конкретного gain можно проверить отдельно этот участок, а не весь диапазон усиления.

(5) При высокой яркости, например на сильном солнце, мерцание может быть вызвано ошибкой преобразования экспозиции в регистры. Например, приложение задаёт 5 строк, но реально действуют 4. Разница в яркости одной строки легко вызывает мерцание на сильном солнце. Тщательно проверьте драйвер по расчёту экспозиции из руководства сенсора.

### 19.13 Как диагностировать фиолетовые области у источников света

(1) Линейный режим

В линейном режиме фиолетовый источник света может означать недопустимое значение gain сенсора, вызывающее искажение. Проверьте соответствие рассчитанного драйвером регистра gain ограничениям руководства сенсора.

(2) Режим HDR

В HDR имеются две основные причины:

2.1 Смещение короткого кадра вызывает несовпадение при объединении HDR. Проверьте, есть ли ошибки MIPI в журнале ядра. Если нет, проверьте параметры экспозиции сенсора. HDR-сенсоры обычно имеют дополнительные ограничения длинной/короткой экспозиции; см. Sensor Info. Напечатайте записываемые драйвером регистры и сравните с ограничениями руководства.

2.2 Соотношение заданных длинной и короткой экспозиций не совпадает с реально действующим. Проверьте преобразование по 2.1. Частая причина — ограничение максимальной короткой экспозиции сенсора. Например, максимум 2ms, а в sensor info/AEC IQ-файла предел отсутствует или выше ограничения драйвера. AEC рассчитывает 3ms, но драйвер устанавливает лишь 2ms, не возвращая ошибку AEC. AEC считает 3ms успешно установленными и передаёт эти параметры TMO. Получаются неверное соотношение и яркость объединённого изображения. Короткий кадр обычно используется в переэкспонированной области источника света, поэтому возникает фиолетовая окраска.

Поэтому при фиолетовой окраске прежде всего проверьте расхождение параметров, рассчитанных AEC, с реально установленными в сенсоре.

### 19.14 Руководство заполнения Sensor Info

Пример imx290:

```text
[imx290]
CISAgainRange=1 31.6
CISDgainRange=1 125.89
```

Если аналогового усиления again недостаточно, яркость обычно компенсируется цифровым dgain. RK передаёт их совместно, а драйвер разделяет again/dgain и записывает соответствующие регистры сенсора.

Распределение усиления по руководству Imx290:

От 0dB до 30dB: аналоговое усиление 30dB, шаг 0.3dB.

От 30.3dB до 72dB: аналоговое усиление 30dB + цифровое 0.3–42dB, шаг 0.3dB.

То есть again 30dB, dgain 42dB.

По формуле:

```text
db = 20 * log10(gain multiple format)
reg_gain = 20 * log10(gain multiple forma) * 10 / 3
```

В кратных единицах: again = 10^(30db/20)=31.6 x

```text
        Dgain = 10^(42db/20) = 125.89 x
CISExtraAgainRange=2 63.2
```

CISExtraAgainRange — диапазон again * dcg ratio. Некоторые сенсоры поддерживают HCG/LCG; HCG улучшает отношение сигнал/шум в темноте. Если функция реализована драйвером, укажите соответствующий коэффициент. Для Imx290 типовое отношение эффективности преобразования равно 2: при again 2x и HCG фактическое усиление 4x. Поэтому CISExtraAgainRange=2*[1 31.6]. Если HCG/LCG не реализован, оставить [1 1].

```text
CISIspDgainRange=1 1
```

Цифровое усиление ISP сейчас не используется; оставить значение по умолчанию.

```text
CISMinFps=10
```

Минимально допустимая частота кадров. Для снижения до 5fps при поддержке сенсором нужно также изменить это значение на 5; только тогда снижение возможно через IQ или API.

```text
CISTimeRegMin=1
```

Минимальная единица строки экспозиции в линейном режиме; см. руководство сенсора.

```text
CISLinTimeRegMaxFac=1.00 2.00
```

Максимальное число строк экспозиции в линейном режиме; см. руководство сенсора.

```text
CISTimeRegOdevity=1 0
```

Чётность строк экспозиции в линейном режиме: по руководству сенсора shs1 изменяется с шагом 1, поэтому строки экспозиции также изменяются с шагом 1.

Руководство Imx290 описывает: Integration time = 1 frame period - (SHS1 + 1) X(1H period)

Сейчас RK передаёт экспозицию из AIQ драйверу в единицах времени строки. Для сенсоров с единицей полстроки требуется пересчёт в строки. Формула imx290 использует строки. Перепишем её для строк экспозиции: time_lines = vts -shs1 - 1

По руководству сенсора shs1 ограничен диапазоном 1~(Number of lines per frame - 2), то есть 1~（vts-2）.

Следовательно, CISTimeRegMin = vts -shs1 - 1 = vts -（vts-2）- 1 = 1

```text
CISLinTimeRegMaxFac = vts - shs1 - 1 = vts - 1 - 1 = vts - 2
```

vts — полное число строк кадра, включая вертикальное гашение. Формулировки руководств различаются: 1 frame period и Number of lines per frame обозначают vts.

```text
CISHdrTimeRegMin=1
```

Минимальное число строк экспозиции HDR; см. руководство сенсора.

```text
CISHdrTimeRegMax=8 0 0
```

Максимальное число строк экспозиции HDR. Параметр добавлен из-за сенсоров, у которых максимальная короткая экспозиция не увеличивается при уменьшении длинной экспозиции или частоты кадров. Таков imx290. В стандартной конфигурации Sony максимум короткой экспозиции — 8 строк. В описанном imx307 DOL режиме уменьшения отношения экспозиций максимум — 222 строки. В документе imx290 DOL такого описания нет; уточните у поддержки Sony.

```text
CISHdrTimeRegOdevity=1.00 0.00
CISHdrTimeRegSumFac=1.00 6.00
```

Документ Sony DOL содержит следующее описание:

![Настройки двухкадрового DOL и формулы экспозиции — английский оригинал, страница 222](/docs/rockchip-isp30-vi-driver/assets/en-p222-X957.png)

*Настройки двухкадрового DOL и формулы экспозиции — английский оригинал, страница 222*

| Параметр | Символ | Регистр | Значение / условие |
| --- | --- | --- | --- |
| Счётчик кадров | FSC | VMAX | VMAX × 2 |
| Момент затвора SEF1 | SHS1 | SHS1 | ≥ 2 и ≤ RHS1 - 2 |
| Момент чтения SEF1 | RHS1 | RHS1 | 2n+5 (n = 0, 1, 2 …) и RHS1 ≤ FSC - BRL × 2 - 21 |
| Момент затвора LEF | SHS2 | SHS2 | ≥ RHS1 + 2 и ≤ FSC - 2 |

| Параметр | Символ | Формула | Единица | Примечание |
| --- | --- | --- | --- | --- |
| Время экспозиции LEF | t_LEF | FSC - (SHS2 + 1) | H | - |
| Время экспозиции SEF1 | t_SEF1 | RHS1 - (SHS1 + 1) | H | - |
| Отношение экспозиций | - | t_LEF / t_SEF1 | - | Объединение 2 кадров |

CISHdrTimeRegMin：

По таблице можно вычислить минимальную длинную экспозицию:

Экспозиция длинного кадра = FSC-SHS2-1=FSC-(FSC-2)-1=1

Экспозиция короткого кадра = RHS1-SHS1-1=RHS1-(SHS1-2)-1=1. Формула сохранена из источника; сомнительная подстановка отмечена в редакционных замечаниях.

Следовательно, минимальная экспозиция HDR — 1 строка.

CISHdrTimeRegOdevity: по таблице shs1/shs2 не имеют ограничений 2n или 2n+1, поэтому число строк экспозиции может увеличиваться с шагом 1.

CISHdrTimeRegSumFac：

Сумма длинной и короткой экспозиций =（FSC-SHS2-1）+ （RHS1-SHS1-1）

Одновременный минимум SHS2 и SHS1 максимизирует обе экспозиции.

Сумма длинной и короткой экспозиций =（FSC-（RHS1+2）-1）+ （RHS1-2-1）=FSC-6

Для двухкадрового DOL HDR FSC=2vts, поэтому максимальная сумма экспозиций равна 2vts-6.

То есть CISHdrTimeRegSumFac=[2 6]. Но для удобства драйвер Sony DOL HDR передаёт FSC в AEC как vts: передаваемый vts уже удвоен. Поэтому CISHdrTimeRegSumFac=[1 6].

```text
CISTimeRegUnEqualEn=1
```

Могут ли времена длинного и короткого кадров быть равны. Из-за ограничения короткого кадра imx290 они не могут быть равны ни при каких условиях.

```text
CISHdrGainIndSetEn=1
```

Должны ли усиления длинного и короткого кадров совпадать: 1 разрешает разные, 0 требует одинаковые. См. описание сенсора. Некоторые сенсоры используют общие регистры; другие имеют отдельные, но по конструкции требуют одинаковых значений. Для правильного разложения экспозиции параметр должен быть точным.

Примечание:

Для imx290 обратите внимание на настройку FPGC PFGC_1; документ DOL содержит подробное описание.

```text
FullResolution=1920x1080
GainRange=1 2 20 20 1 0 20 2 4 10 0 1 20 40 4 8 5 -20 1 40 60 8 16 2.5 -40 1 60 80 16 32 1.25 -60 1 80 100 32 64 0.625 -80 1 100 120 64 128 0.3125 -100 1 120 140 128 256 0.15625 -120 1 140 160 256 512 0.078125 -140 1 160 180 512 1024 0.0390625 -160 1 180 200
IsLinear=0
```

RK поддерживает усиление как множитель и в режиме Sony dB. 0 означает dB. Для imx290 можно непосредственно использовать dB либо формулу GainRange выше. Последняя даёт небольшую погрешность из-за разбиения нелинейной кривой на линейные участки.

```text
NonLinear=DB_MODE
PatternMode=RGGB
TimeFactor=0 0 1 0.5
```

Формулу разложения времени рекомендуется сохранить; если расчёт ей не соответствует, преобразование выполняет драйвер сенсора.

```text
hdr_dcg_ratio=2
normal_dcg_ratio=2
```

Отношение DCG описано выше.

```text
SensorFlip=0
```

Состояние зеркального отражения/переворота по умолчанию: bit0 — зеркало, bit1 — переворот.

## 20. Приложение A. Controls V4L2 драйвера CIS

<!-- Source: English PDF p224, table unit 1960 -->

| CID | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Вертикальное гашение — простой после кадра без данных, в строках. Длина строки равна ширине изображения плюс горизонтальное гашение при скорости V4L2_CID_PIXEL_RATE того же subdev. |
| V4L2_CID_HBLANK | Горизонтальное гашение — простой после строки без данных, в пикселях. |
| V4L2_CID_EXPOSURE | Определяет экспозицию sensor, ограниченную интервалом кадров. |
| V4L2_CID_ANALOGUE_GAIN | Аналоговое усиление применяется ко всем цветовым компонентам матрицы до АЦП. |
| V4L2_CID_PIXEL_RATE | Скорость пикселей на исходящих pad subdev; control только для чтения, единица — пикселей/секунду. Например MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample. |
| V4L2_CID_LINK_FREQ | Частота шины вместе с pixel code media bus и типом шины (такты на образец) задаёт V4L2_CID_PIXEL_RATE массива пикселей, либо иной точки у не-sensor устройства. Частота кадров рассчитывается из pixel clock, ширины, высоты и обоих гашений. Если pixel rate задан вне subdev массива, этой информации недостаточно: только в массиве гашение точно и дополнительного гашения нет. Частоту кадров выбирают горизонтальным и вертикальным гашением. Единица control — Hz. |

## 21. Приложение B. Таблица MEDIA_BUS_FMT

<!-- Source: English PDF p225, table unit 1962 -->

| Тип CIS sensor | Формат выхода sensor |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| Raw BW sensor с выводом только Y (чёрно-белый) | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

## 22. Приложение C. Эталонные драйверы CIS

<!-- English PDF p226; continuation p227 follows. -->

| Интерфейс CIS | Тип выхода | Кадр / поле | Эталонный драйвер |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | кадр | 0.3M: ov7750.c, gc0403.c<br>0.9M jx_h62.c<br>1.2M ov9750.c jx-h65.c<br>2M ov2685.c ov2680.c ov2735.c ov02g10.c ov02b10.c gc2385.c gc2355.c gc2053.c sc2232.c sc2239.c sc223a sc210iot.c sp250a.c<br>4M gc4c33.c jx_k04.c os04c10.c sc401ai.c<br>5M ov5695.c ov5648.c ov5670.c gc5024.c gc5025.c gc5035.c hm5040.c sc5239.c hynix_hi556.c<br>8M ov8858.c |

<!-- Source: English PDF p227, table unit 1973 -->

| Интерфейс данных CIS | Тип выходных данных CIS | Кадр/поле | Референсный драйвер |
| --- | --- | --- | --- |
|  |  |  | os08a10.c os08a20.c sc8220 imx378.c imx317.c imx219.c gc8034.c hynix_hi846.c s5kgm1sp.c s5k4h7yx.c 13M ov13850.c ov13b10.c imx258.c ov12d2q.c |
| MIPI | Bayer raw HDR | Кадр | 2M imx307.c imx327.c imx462.c gc2093.c ov02k10 ov2718.c sc200ai.c sc2310.c jx-f37.c 4M ov4689.c os04a10.c imx347.c imx464.c sc4238.c 5M imx335.c os05a20.c sc500ai.c 8M imx334.c imx415.c |
| MIPI | YUV | Кадр | 2M<br>gc2145.c |

<!-- Source: English PDF p228, table unit 1974 -->

| Интерфейс данных CIS | Тип выходных данных CIS | Кадр/поле | Референсный драйвер |
| --- | --- | --- | --- |
| MIPI | RAW BW | Кадр | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  | 0.3M sc031gs.c 1.3M sc032gs.c |
| ITU.BT656 | Bayer RAW |  | 2M: imx323 (может поддерживаться) |

## 23. Приложение D. Эталонные драйверы микросхем VCM

| Эталонный драйвер |
| --- |
| vm149c.c |
| dw9714.c |
| dw9718.c |
| fp5510.c |
| gt9760s.c |
| fp5501.c (шаговый двигатель) |
| mp6507.c (шаговый двигатель) |
| ms41908.c (шаговый двигатель) |

## 24. Приложение E. Эталонные драйверы микросхем вспышки

| Эталонный драйвер |
| --- |
| sgm3784.c |
| leds-rgb13h.c (управление GPIO) |

{% endraw %}
