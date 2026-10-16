---
title: "Rockchip BT.656 / BT.1120 TX: синхронизация, выводы и настройка дисплея Linux"
description: "Полный справочник по прогрессивной и чересстрочной развёртке, EAV/SAV, поддержке платформ, соединениям, DTS, DRM и всем 12 вопросам источника."
translation_key: "039-rockchip-bt656-bt1120"
slug: "039-rockchip-bt656-bt1120"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "BT.656", "BT.1120", "DRM", "display"]
keywords: "ArmSoM Rockchip BT656 BT1120 TX DTS Linux DRM RK3588 RK3576"
excerpt: "Полный справочник по прогрессивной и чересстрочной развёртке, EAV/SAV, поддержке платформ, соединениям, DTS, DRM и всем 12 вопросам источника."
---

# Rockchip BT.656 / BT.1120 TX: синхронизация, выводы и настройка дисплея Linux

Полное изложение Rockchip BT.656 TX and BT.1120 TX Developer Guide V2.2.0 (RK-YH-YF-178). Предоставлен только китайский PDF; английская и русская версии полностью переведены с него. Все шесть исходных рисунков взяты из этого PDF: английские надписи на рисунках не означают наличие английского PDF. Таблицы доступны для редактирования; для таблиц-картинок сохранён оригинал и добавлены копируемые данные.

Это справочник по Rockchip BSP, а не обещание поддержки на каждой плате ArmSoM. Ниже приведена таблица версий из источника. RK3576 присутствует в разделах возможностей и соединений, но отсутствует в этой таблице версий ядра; версия ядра для него не добавляется догадкой. Для ArmSoM [Sige5](https://docs.armsom.org/armsom-sige5) (RK3576) и [Sige7](https://docs.armsom.org/armsom-sige7) (RK3588) сначала проверьте выведенные сигналы, плату-носитель, питание, приёмник, SDK/BSP и драйвер ядра. Проверка на оборудовании ArmSoM не проводилась. Ниже используются примеры источника.

| Чип | Версия ядра |
|---|---|
| RV1109/RV1126 | Linux kernel 4.19 и новее |
| RV1103/RV1106 | Linux kernel 5.10 и новее |
| RK356X | Linux kernel 4.19 и новее |
| RK3588 | Linux kernel 5.10 и новее |
| RK3562 | Linux kernel 5.10 и новее |
| RK3506 | Linux kernel 6.1 и новее |
| RV1126B | Linux kernel 6.1 и новее |

## 1. Основные понятия

BT.656 и BT.1120 определяют интерфейсы SDTV и HDTV соответственно. Коды временной привязки EAV и SAV передают встроенную синхронизацию в интервале гашения; данные имеют формат YCbCr 4:2:2. В руководствах их также называют видеосигналами или YUV. На описанных в источнике платформах RK глубина изображения и кодов привязки составляет 8 бит. Подробности протоколов приведены в Rec. ITU-R BT.1120 и Rec. ITU-R BT.656.

### 1.1 Прогрессивная развёртка (P)

![Прогрессивная развёртка: активное видео, гашение и позиции EAV/SAV в кадре](/docs/rockchip-bt656-bt1120/assets/cn-p04-figure1.png)

### 1.2 Чересстрочная развёртка (I)

![Чересстрочная развёртка: активное видео, гашение и коды двух полей](/docs/rockchip-bt656-bt1120/assets/cn-p05-figure1.png)

### 1.3 Коды временной привязки

Первые три слова фиксированы: `0xFF, 0x00, 0x00`; четвёртое зависит от положения развёртки. Bit9 всегда равен 1. Для Bit8(F) источник описывает F=0 как чётное поле, F=1 как нечётное. Bit7(V) равен 0 для строки с активным видео и 1 в остальных случаях. Bit6(H) равен 0 для SAV и 1 для EAV. Bit[5,2] (P3,P2,P1,P0) вычисляются из F/V/H. Bit[1,0] всегда равны 0; в 8-битном режиме RK эти два младших бита можно считать отсутствующими.

```text
Bit5 = V XOR H
Bit4 = F XOR H
Bit3 = F XOR V
Bit2 = F XOR V XOR H
```

![Распределение битов кода для прогрессивного и чересстрочного режимов](/docs/rockchip-bt656-bt1120/assets/cn-p06-figure1.png)

| Слово | 9 (MSB) | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 (LSB) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 1 | F | V | H | P3 | P2 | P1 | P0 | 0 | 0 |

Рисунок дополнительно задаёт F=1 для поля/сегмента 2 и F=0 для поля/сегмента 1 в чересстрочной и сегментированной системах. V=1 при гашении поля/сегмента и 0 в остальных положениях. В прогрессивной системе F=0; V=1 при гашении кадра и 0 в остальных случаях. Для обеих систем H=1 при EAV и H=0 при SAV. Защитные биты для сочетаний (F,V,H) приведены ниже.

![Таблица защитных битов SAV/EAV](/docs/rockchip-bt656-bt1120/assets/cn-p07-figure1.png)

| Bit9 | F | V | H | P3 | P2 | P1 | P0 | Bit1 | Bit0 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 0 |

Сочетание этих определений даёт следующие коды временной привязки интервалов гашения:

| EAV | CODE | SAV | CODE |
|---|---|---|---|
| 1 | 0XFF 0X00 0X00 0X9D | 0 | 0XFF 0X00 0X00 0X80 |
| 3 | 0XFF 0X00 0X00 0XB6 | 2 | 0XFF 0X00 0X00 0XAB |
| 5 | 0XFF 0X00 0X00 0XDA | 4 | 0XFF 0X00 0X00 0XC7 |
| 7 | 0XFF 0X00 0X00 0XF1 | 6 | 0XFF 0X00 0X00 0XEC |

## 2. Поддержка платформ RK

| Платформа SoC | Поддержка BT.656 | Поддержка BT.1120 | Развёртка |
|---|---|---|---|
| RV1109/RV1126 | N | Y | Только прогрессивная |
| RV1103 | Y | N | Прогрессивная и чересстрочная |
| RV1106 | Y | Y | Прогрессивная и чересстрочная |
| RK3566/RK3568 | Y | Y | Прогрессивная и чересстрочная |
| RK3588 | Y | Y | Прогрессивная и чересстрочная |
| RK3562 | Y | Y | Прогрессивная и чересстрочная |
| RK3576 | Y | Y | Прогрессивная и чересстрочная |
| RK3506 | Y | Y | Прогрессивная и чересстрочная |
| RV1126B | Y | Y | Прогрессивная и чересстрочная |

## 3. Аппаратные соединения

### 3.1 RV1109/RV1126/RV1103/RV1106/RK3566/RK3568/RK3588

Ниже приведены три варианта соединения. В зависимости от разводки задайте соответствующий `bus_format` в DTS или драйвере преобразователя.

![Соединения BT.656 и два варианта BT.1120 с bus_format](/docs/rockchip-bt656-bt1120/assets/cn-p08-figure1.png)

| Интерфейс | Такт | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | Такт | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | Такт | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | Такт | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

### 3.2 RK3562/RK3576/RK3506/RV1126B

BT.656 одновременно выводит изображение на группы выводов m0 и m1, что позволяет настроить один дисплей либо два дисплея с одинаковым изображением.

| Компонент | Вывод | BT1120 | BT656 |
|---|---|---|---|
| Формат шины | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

### 3.3 RV1126B-P

Для совместимости с прежней разводкой RV1126 в RV1126B-P введены карты data map, выбирающие выводы данных. Определения находятся в `include/dt-bindings/display/rockchip_vop.h`:

```text
 /* { 8'd0, BT1120[15:0] } */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO 0
 /* { BT1120[15:0], 8'd0 }*/

 #define ROCKCHIP_BT1120_DATA_MAP_DATA_PADHI 1
 /*
  * { BT1120[15:11], 3'd0, BT1120[10:5], 2'd0, BT1120[4:0], 3'b0 }
  * That is:
  *   LCDC_D23 -> BT1120_D15
  *   LCDC_D22 -> BT1120_D14
  *   LCDC_D21 -> BT1120_D13
  *   LCDC_D20 -> BT1120_D12
  *   LCDC_D19 -> BT1120_D11
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A

  *   LCDC_D15 -> BT1120_D10
  *   LCDC_D14 -> BT1120_D9
  *   LCDC_D13 -> BT1120_D8
  *   LCDC_D12 -> BT1120_D7
  *   LCDC_D11 -> BT1120_D6
  *   LCDC_D10 -> BT1120_D5
  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT1120_D4
  *   LCDC_D6 -> BT1120_D3
  *   LCDC_D5 -> BT1120_D2
  *   LCDC_D4 -> BT1120_D1
  *   LCDC_D3 -> BT1120_D0

  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0 3
 /* { 16'd0, BT656[7:0] }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADLO 0
 /* { 8'd0, BT656[7:0], 8'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_DUMMY_HI_LO 1
 /* { BT656[7:0], 16'd0 }*/
 #define ROCKCHIP_BT656_DATA_MAP_PADHI 2
 /*

  * { BT656[7:3], 3'd0, BT656[2:0], BT656[7:5], 2'd0, BT656[4:0], 3'd0 }
  * That is:
  *   LCDC_D23 -> BT656_D7_M1
  *   LCDC_D22 -> BT656_D6_M1
  *   LCDC_D21 -> BT656_D5_M1
  *   LCDC_D20 -> BT656_D4_M1
  *   LCDC_D19 -> BT656_D3_M1
  *   LCDC_D18 -> N/A
  *   LCDC_D17 -> N/A
  *   LCDC_D16 -> N/A
  *   LCDC_D15 -> BT656_D2_M1
  *   LCDC_D14 -> BT656_D1_M1
  *   LCDC_D13 -> BT656_D0_M1
  *   LCDC_D12 -> BT656_D7_M0
  *   LCDC_D11 -> BT656_D6_M0
  *   LCDC_D10 -> BT656_D5_M0

  *   LCDC_D9 -> N/A
  *   LCDC_D8 -> N/A
  *   LCDC_D7 -> BT656_D4_M0
  *   LCDC_D6 -> BT656_D3_M0
  *   LCDC_D5 -> BT656_D2_M0
  *   LCDC_D4 -> BT656_D1_M0
  *   LCDC_D3 -> BT656_D0_M0
  *   LCDC_D2 -> N/A
  *   LCDC_D1 -> N/A
  *   LCDC_D0 -> N/A
  */
 #define ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0 3
```

Соединения RV1126B по умолчанию соответствуют `ROCKCHIP_BT1120_DATA_MAP_DATA_WITH_DUMMY_0` и `ROCKCHIP_BT656_DATA_MAP_DATA_WITH_DUMMY_0`, как показано ниже.

| Компонент | Вывод | BT1120 | BT656 |
|---|---|---|---|
| Формат шины | × | MEDIA_BUS_FMT_YUYV8_1X16/ MEDIA_BUS_FMT_UYVY8_1x16 | MEDIA_BUS_FMT_UYVY8_2X8 |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) |
| R7_D23 | VO_LCDC_D23 | √ | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | × | × |
| R1_D17 | VO_LCDC_D17 | × | × |
| R0_D16 | VO_LCDC_D16 | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | × | × |
| G0_D8 | VO_LCDC_D8 | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | × | × |
| B1_D1 | VO_LCDC_D1 | × | × |
| B0_D0 | VO_LCDC_D0 | × | × |

Для соответствия прежней разводке RV1126 платформа RV1126B-P по умолчанию использует `ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO` для BT.1120 и `ROCKCHIP_BT656_DATA_MAP_PADLO` для BT.656. Соединения показаны ниже.

![Соединения RV1126B-P по умолчанию](/docs/rockchip-bt656-bt1120/assets/cn-p12-figure1.png)

| Интерфейс | Такт | D15 | D14 | D13 | D12 | D11 | D10 | D9 | D8 | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | bus_format |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BT.656 | Такт | - | - | - | - | - | - | - | - | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | MEDIA_BUS_FMT_UYVY8_2X8 |
| BT.1120 (1) | Такт | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | MEDIA_BUS_FMT_YUYV8_1X16 |
| BT.1120 (2) | Такт | C7 | C6 | C5 | C4 | C3 | C2 | C1 | C0 | Y7 | Y6 | Y5 | Y4 | Y3 | Y2 | Y1 | Y0 | MEDIA_BUS_FMT_UYVY8_1X16 |

Обычно соединения обеих платформ уже заданы и дополнительная настройка не нужна. При необходимости используйте DTS. Пример задаёт для RV1126B прежнюю разводку RV1126; для RV1126B-P это уже настройка по умолчанию.

```text
 &rgb {
    /*
    * RV1126 compatible pin output mode 0.

    *
    * BT1120: ROCKCHIP_BT1120_DATA_MAP_DATA_PADLO
    * BT656: ROCKCHIP_BT656_DATA_MAP_PADLO
    */
    rockchip,data-map-mode = <0>;
 };
```

## 4. Настройка программного обеспечения

### 4.1 Включение BT.656/BT.1120

(1) Если приёмному устройству не нужен драйвер на передающей стороне, то есть регистрация DRM connector не требуется, настройте узел panel в DTS:

```text
 panel {
    ……

    bus-format = MEDIA_BUS_FMT_YUYV8_1X16; //or
 MEDIA_BUS_FMT_YUYV8_1X16/MEDIA_BUS_FMT_UYVY8_1X16
    ……
 }
```

(2) Если необходимы драйвер передающей стороны и регистрация DRM connector, используйте DTS либо задайте формат в `drm_connector_helper_funcs -> get_modes` драйвера connector. Пример из `drivers/gpu/drm/bridge/sii902x.c`:

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    u32 bus_format = MEDIA_BUS_FMT_YUYV8_1X16;//depend on hardware

    ……
    drm_display_info_set_bus_formats(&connector->display_info, &bus_format, 1);
    ……
 }
```

После настройки `bus_format` одним из этих способов драйвер VOP включает BT.656/BT.1120 и соответствующее отображение выводов.

### 4.2 Настройка временных параметров

Существуют три способа настройки. Первый: для изделия с фиксированным разрешением задайте временные параметры в узле panel DTS. Пример прогрессивной развёртки:

```text
 timing_1080p: timing-1080p {
    clock-frequency = <148500000>;

    hactive = <1920>;
    vactive = <1080>;
    hback-porch = <100>;
    hfront-porch = <200>;
    vback-porch = <10>;
    vfront-porch = <10>;
    hsync-len = <20>;
    vsync-len = <20>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
 };
```

Пример чересстрочной развёртки:

```text
 timing_ntsc: timing-ntsc {
    clock-frequency = <13500000>;
    hactive = <720>;

    vactive = <480>;
    hback-porch = <43>;
    hfront-porch = <33>;
    vback-porch = <36>;
    vfront-porch = <3>;
    hsync-len = <62>;
    vsync-len = <6>;
    hsync-active = <0>;
    vsync-active = <0>;
    de-active = <0>;
    pixelclk-active = <0>;
    interlaced;

    doubleclk; //only NTSC(480i60) mode and PAL(576i50) mode need this property
 };
```

Второй способ — чтение EDID. Если дисплей поддерживает несколько разрешений и предоставляет EDID, используйте драйвер sii902x как пример чтения EDID по DDC/I2C для получения поддерживаемых режимов.

```text
 //dts
 &i2c3 {
    clock-frequency = <400000>;
    status = "okay";

    sii9022: sii9022@39 {
       compatible = "sil,sii9022";
       reg = <0x39>;
       pinctrl-names = "default";
       ……
       ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
            reg = <0>;
            sii9022_in_rgb: endpoint {
               remote-endpoint = <&rgb_out_sii9022>;

            };
          };
       };
    };
 };

 &rgb {
    status = "okay";
    ……
    ports {
       port@1 {
          reg = <1>;
          #address-cells = <1>;

          #size-cells = <0>;

          rgb_out_sii9022: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&sii9022_in_rgb>;
          };
       };
    };
 };

 //drivers/gpu/drm/bridge/sii902x.c
 static int sii902x_probe(struct i2c_client *client, const struct i2c_device_id *id)

 {
    ……
    i2c_set_clientdata(client, sii902x);
    sii902x->i2cmux =
    i2c_mux_alloc(client->adapter, dev, 1, 0, I2C_MUX_GATE, sii902x_i2c_bypass_select,
 sii902x_i2c_bypass_deselect);
    if (!sii902x->i2cmux)
       return -ENOMEM;
    sii902x->i2cmux->priv = sii902x;
    return i2c_mux_add_adapter(sii902x->i2cmux, 0, 0, 0);
    ……
 }
 static int sii902x_get_modes(struct drm_connector *connector)
 {
    struct sii902x *sii902x = connector_to_sii902x(connector);


    edid = drm_get_edid(connector, sii902x->i2cmux->adapter[0]);
    drm_connector_update_edid_property(connector, edid);
    if (edid) {
       if (drm_detect_hdmi_monitor(edid))
          output_mode = SII902X_SYS_CTRL_OUTPUT_HDMI;
       num = drm_add_edid_modes(connector, edid);
       kfree(edid);
    }
 }
```

Третий способ — заранее задать режимы в драйвере connector. Это удобно при отладке или когда нужны несколько разрешений без канала I2C/DDC. Пример из sii902x.c:

```text
 static int sii902x_get_modes(struct drm_connector *connector)
 {

    struct sii902x *sii902x = connector_to_sii902x(connector);

    ……
    for (i = 0; i < ARRAY_SIZE(sii902x_default_modes); i++) {
       const struct drm_display_mode *ptr = &sii902x_default_modes[i];

       mode = drm_mode_duplicate(connector->dev, ptr);
       if (mode) {
          if (!i)
            mode->type = DRM_MODE_TYPE_PREFERRED;
          drm_mode_probed_add(connector, mode);
          ret++;
       }

    }
    ……
 }
```

## 5. Частые вопросы

### 5.1 Полный или ограниченный диапазон?

Выход использует ограниченный диапазон: активные данные изображения — `[16, 235]`; `0xFF, 0x00` могут встречаться только в кодах временной привязки.

### 5.2 Как проверить настройку выхода?

Выполните `cat /sys/kernel/debug/dri/0/summary`, посмотрите `bus_format` у VOP/VP и сравните с таблицами раздела 3. Пример вывода из источника:

```text
 cat /sys/kernel/debug/dri/0/summary
    Video Port0: ACTIVE

    ……
    bus_format[2025]: YUV8_1X24
    ……
```

### 5.3 Соответствуют ли сигналы стандартам?

Источник отвечает утвердительно: разработка основана на Rec. ITU-R BT.656 и Rec. ITU-R BT.1120. Это не независимый тест соответствия в рамках статьи; учитывайте различия данных гашения в §5.12.

### 5.4 Один фронт или оба фронта?

Используется один фронт. По умолчанию нарастающий фронт тактового сигнала находится в середине данных. Если приёмнику нужен спадающий фронт в этой позиции, задайте `pixelclk-active = 1` в DTS.

### 5.5 Примеры DTS

```text
BT.656: arch/arm64/boot/dts/rockchip/rk3568-evb6-ddr3-v10-rk630-bt656-to-cvbs.dts
BT.1120: arch/arm64/boot/dts/rockchip/rk3568-evb2-lp4x-v10-bt1120-to-hdmi.dts
```

### 5.6 Как управлять сторонним преобразователем?

Если преобразователь работает после подачи питания без программирования регистров, настройте GPIO и источники питания в узле panel DTS. Дополнительный драйвер не нужен; `rockchip_rgb.c` регистрирует DRM encoder и connector.

Если требуется программирование регистров, помимо GPIO и питания в DTS нужен драйвер преобразователя. `rockchip_rgb.c` регистрирует encoder, драйвер преобразователя — connector; они соединяются через DRM bridge. См. `drivers/gpu/drm/bridge/sii902x.c`.

### 5.7 Как использовать BT.1120 в RK628?

Источник отсылает к `Rockchip_DRM_RK628_Porting_Guide_CN`.

### 5.8 Связь с BT.656/BT.1120 камеры

Здесь рассматриваются параллельные выходы BT.656 TX/BT.1120 TX. Камера использует параллельные входы BT.656 RX/BT.1120 RX. Протоколы одинаковы; документацию по RX следует получать через техническую поддержку производителя или команду ISP, она не входит в это руководство TX.

### 5.9 Связь с VOP

BT.656/BT.1120 — параллельные выходы со встроенной синхронизацией. VOP объединяет несколько слоёв (буферов) и выводит результат через эти интерфейсы.

### 5.10 Связь с RGB

BT.656/BT.1120 используют встроенную синхронизацию, а RGB — отдельные HSYNC/VSYNC/DEN. Это независимые интерфейсы без прямой связи в тракте отображения, хотя выводы IO могут мультиплексироваться.

### 5.11 Выведены ли HSYNC/VSYNC/DEN наружу?

- RV1126/RV1109/RK3562/RK3576: все сигналы выведены; Data отстаёт на 1 такт.
- RV1126B: все сигналы выведены. Data BT.1120 синхронны, Data BT.656 отстают на 2 такта.
- RK3566/RK3568/RK3588: сигналы не выведены.
- RV1103/RV1106/RK3506: все сигналы выведены, Data синхронны.

### 5.12 Данные в интервале гашения

Для RV1126/RK3566/RK3568/RK3588 данные гашения BT.656 равны `0x80 0x10 0x80 0x10`; оба канала Y и UV BT.1120 также используют `0x80 0x10 0x80 0x10`. Источник прямо указывает отличие этих данных BT.1120 от протокола и возможные проблемы изображения у чувствительных приёмников.

На остальных платформах данные гашения BT.656 — `0x80 0x10 0x80 0x10`; BT.1120 использует `0x80` на Y и `0x10` на UV. Значения сохранены из источника без перестановки Y/UV.

## Редакционные замечания

Сохранены строчная x в `MEDIA_BUS_FMT_UYVY8_1x16`, повтор макроса в примере DTS panel и вывод `YUV8_1X24` в §5.2. Сверяйте их с фактическими привязками и драйвером ядра. Значения Y/UV в §5.12 и описание нумерации полей в §1.3 нельзя исправлять без пояснений. [Полный журнал проверки](/docs/rockchip-bt656-bt1120/EDITORIAL-NOTES.md).
