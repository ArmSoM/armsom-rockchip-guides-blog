---
title: "Руководство Rockchip RGB/MCU: контакты, панели, SPI и тайминги"
description: "Полные протоколы RGB/MCU, поддержка платформ, карты контактов, DTS, инициализация, формулы частоты кадров и frame write/read."
translation_key: "052-rockchip-rgb-mcu"
slug: "052-rockchip-rgb-mcu"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RGB", "MCU", "RK3576", "RK3506", "RV1126B", "SPI"]
keywords: "ArmSoM Rockchip RGB MCU Panel SPI RK3576 RK3506"
excerpt: "Полные протоколы RGB/MCU, поддержка платформ, карты контактов, DTS, инициализация, формулы частоты кадров и frame write/read."
---

{% raw %}

# Руководство Rockchip RGB/MCU: контакты, панели, SPI и тайминги

Это справочный материал по RGB/MCU Rockchip. Таблица V1.7.1 перечисляет RK1808, RK312X/PX3SE, RK3288, RK3308B/BS, RK3326/PX30, RK3506, RK3562, RK3568, RK3576, RV1103/1106, RV1109/RV1126 и RV1126B с различными возможностями. Это не означает поддержку на всех платах ArmSoM. Настройки SPI/панели разделены для kernel 4.19 и ранее и для 5.10 и новее. Проверьте SDK/BSP платы, доступность интерфейса, мультиплексирование контактов, напряжения и тайминги панели. Проверка на оборудовании ArmSoM не проводилась; значения и иллюстрации оригинала являются примерами платформы.

Источник: Rockchip_Developer_Guide_RGB_MCU_CN.pdf, V1.7.1, 34 страницы. Предоставлен только китайский оригинал. Английская и русская версии полностью переводят технический текст; во всех версиях используются рисунки китайского PDF без заявления о переводе надписей внутри них.

[Редакционная проверка](/docs/rockchip-rgb-mcu/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Основные понятия

### 1.1 Интерфейс RGB

RGB также называется DPI (Display Pixel Interface). Для синхронизации используются четыре сигнала: Vsync, Hsync, Den (Enable) и DCLK (Dotclk). В зависимости от способа синхронизации различают DE mode и SYNC mode. Тайминги выхода RGB Rockchip совместимы с обоими режимами.

![Тайминги режима DE](/docs/rockchip-rgb-mcu/assets/cn-p4-1.png)

*Тайминги режима DE*

#### 1.1.1 Режим DE

Действительность DB[23:0] определяется только Den. В оригинале указано, что данные действительны при низком уровне и недействительны в противном случае.

#### 1.1.2 Режим SYNC

![Тайминги режима SYNC](/docs/rockchip-rgb-mcu/assets/cn-p5-1.png)

*Тайминги режима SYNC*

Данные DB[23:0] синхронизируются Vsync и Hsync и выводятся согласно приведённой развёртке.

### 1.2 Интерфейс MCU

MCU также называется DBI или интерфейсом 8080. Он поддерживает двунаправленную связь TX/RX с четырьмя сигналами синхронизации: RS (CSX), CSN (D/CX), WEN (WRX) и REN (RDX). Во вводном абзаце оригинала указана поддержка Rockchip только MCU TX; далее таблица платформ отдельно указывает поддержку чтения RK3506 и RV1126B. Противоречие сохранено для проверки.

#### 1.2.1 Тайминги записи

![Тайминги записи MCU](/docs/rockchip-rgb-mcu/assets/cn-p6-1.png)

*Тайминги записи MCU*

CSX, D/CX и WRX последовательно переводятся в низкий уровень. Пока DB[23:0] действительны, WRX сначала переходит в низкий, затем в высокий уровень.

#### 1.2.2 Тайминги чтения

![Тайминги чтения MCU и первые недействительные данные](/docs/rockchip-rgb-mcu/assets/cn-p6-2.png)

*Тайминги чтения MCU и первые недействительные данные*

CSX, D/CX и RDX последовательно переводятся в низкий уровень. Пока DB[23:0] действительны, RDX сначала переходит в низкий, затем в высокий уровень.

Перед чтением выполните запись, передающую панели адрес регистра.

Первое чтение возвращает недействительные данные; действительные данные поступают со второго чтения.

Чтение MCU обычно используется при отладке панели, для различения идентификаторов панелей и совместимости с несколькими панелями, а также для функции frame read, описанной далее.

#### 1.2.3 Режимы bypass и normal

Режим bypass используется при передаче команд между MCU и панелью операциями write/read.

Передача init/deinit из panel-init-sequence/panel-exit-sequence и операции frame write/read относятся к режиму bypass. См. соответствующие подразделы настройки ПО ниже.

В режиме normal хост передаёт изображение через MCU в RAM панели для обычного отображения. Этот режим обычно включается после передачи panel-init-sequence и подтверждения успешной инициализации панели.

Режим bypass может включать запись и чтение; режим normal — только запись.

## 2. Поддержка платформ Rockchip

| Платформа SoC | Поддержка RGB | Поддержка MCU | Поддержка чтения MCU | Версия VOP | Тракт Video Port (VOP 2.0) | Поддерживаемые режимы вывода |
| --- | --- | --- | --- | --- | --- | --- |
| RK1808 | Y | Y | N | VOP 1.0 |  | RGB666/RGB565 |
| RK312X/PX3SE | Y | N | N | VOP 1.0 |  | RGB888/RGB666/RGB565 |
| RK3288 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3308B/RK3308BS | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RK3326/PX30 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565 |
| RK3506 | Y | Y | Y | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RK3562 | Y | Y | N | VOP 2.0 | VP0 | RGB888/RGB666/RGB565/RGB3x8 |
| RK3568 | Y | N | N | VOP 2.0 | VP2 | RGB888/RGB666/RGB565 |
| RK3576 | Y | Y | N | VOP 2.0 | VP1/VP2 | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |
| RV1103 | Y | Y | N | VOP 1.0 |  | RGB3x8 |
| RV1106 | Y | Y | N | VOP 1.0 |  | RGB666/RGB565/RGB3x8 |
| RV1109/RV1126 | Y | Y | N | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8 |
| RV1126B | Y | Y | Y | VOP 1.0 |  | RGB888/RGB666/RGB565/RGB3x8/RGB3x6/RGB2x8 |

Описание VOP и VP (Video Port) см. в Rockchip_Developer_Guide_DRM_Display_Driver_CN.

## 3. Аппаратные соединения

### 3.1 RK3562/RK3576/RK3506/RV1126B

| Имя компонента | Имя контакта | RGB888 (MCU) | RGB666 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) | RGB3x6 (MCU) | RGB2x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | VO_LCDC_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | VO_LCDC_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | VO_LCDC_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | VO_LCDC_D23 | √ | √ | √ | √ (D7_m1) | √ (D5_m1) | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ | √ | √ (D6_m1) | √ (D4_m1) | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ | √ | √ (D5_m1) | √ (D3_m1) | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ | √ | √ (D4_m1) | √ (D2_m1) | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ | √ | √ (D3_m1) | √ (D1_m1) | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | √ | √ | × | × | × | × |
| R1_D17 | VO_LCDC_D17 | √ | × | × | × | × | × |
| R0_D16 | VO_LCDC_D16 | √ | × | × | × | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ | √ | √ (D2_m1) | √ (D0_m1) | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ | √ | √ (D1_m1) | × | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ | √ | √ (D0_m1) | × | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ | √ | √ (D7_m0) | √ (D5_m0) | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ | √ | √ (D6_m0) | √ (D4_m0) | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ | √ | √ (D5_m0) | √ (D3_m0) | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | √ | × | × | × | × | × |
| G0_D8 | VO_LCDC_D8 | √ | × | × | × | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ | √ | √ (D4_m0) | √ (D2_m0) | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ | √ | √ (D3_m0) | √ (D1_m0) | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ | √ | √ (D2_m0) | √ (D0_m0) | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ | √ | √ (D1_m0) | × | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ | √ | √ (D0_m0) | × | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | √ | √ | × | × | × | × |
| B1_D1 | VO_LCDC_D1 | √ | × | × | × | × | × |
| B0_D0 | VO_LCDC_D0 | √ | × | × | × | × | × |

### 3.2 RK3568

| Имя компонента | Имя контакта | RGB888 | RGB666 | RGB565 |
| --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK | DCLK | DCLK | DCLK |
| VSYNC | LCDC_VSYNC | VSYNC | VSYNC | VSYNC |
| HSYNC | LCDC_HSYNC | HSYNC | HSYNC | HSYNC |
| DEN | LCDC_DEN | DEN | DEN | DEN |
| R7_D23 | LCDC_D23 | √ | √ | √ |
| R6_D22 | LCDC_D22 | √ | √ | √ |
| R5_D21 | LCDC_D21 | √ | √ | √ |
| R4_D20 | LCDC_D20 | √ | √ | √ |
| R3_D19 | LCDC_D19 | √ | √ | √ |
| R2_D18 | LCDC_D18 | √ | √ | × |
| R1_D17 | LCDC_D17 | √ | × | × |
| R0_D16 | LCDC_D16 | √ | × | × |
| G7_D15 | LCDC_D15 | √ | √ | √ |
| G6_D14 | LCDC_D14 | √ | √ | √ |
| G5_D13 | LCDC_D13 | √ | √ | √ |
| G4_D12 | LCDC_D12 | √ | √ | √ |
| G3_D11 | LCDC_D11 | √ | √ | √ |
| G2_D10 | LCDC_D10 | √ | √ | √ |
| G1_D9 | LCDC_D9 | √ | × | × |
| G0_D8 | LCDC_D8 | √ | × | × |
| B7_D7 | LCDC_D7 | √ | √ | √ |
| B6_D6 | LCDC_D6 | √ | √ | √ |
| B5_D5 | LCDC_D5 | √ | √ | √ |
| B4_D4 | LCDC_D4 | √ | √ | √ |
| B3_D3 | LCDC_D3 | √ | √ | √ |
| B2_D2 | LCDC_D2 | √ | √ | × |
| B1_D1 | LCDC_D1 | √ | × | × |
| B0_D0 | LCDC_D0 | √ | × | × |

### 3.3 RK312X/PX3SE/RK3288/RK3308B/RK3308BS/RK3328/RK3326/PX30/RV1109/RV1126

| Имя компонента | Имя контакта | RGB888 (MCU) | RGB666 (MCU) | RGB666_CPADHI (MCU) | RGB565 (MCU) | RGB565_CPADHI (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | LCDC_D23/LCD_D23 | √ | × | √ | × | √ | × |
| R6_D22 | LCDC_D22/LCD_D22 | √ | × | √ | × | √ | × |
| R5_D21 | LCDC_D21/LCD_D21 | √ | × | √ | × | √ | × |
| R4_D20 | LCDC_D20/LCD_D20 | √ | × | √ | × | √ | × |
| R3_D19 | LCDC_D19/LCD_D19 | √ | × | √ | × | √ | × |
| R2_D18 | LCDC_D18/LCD_D18 | √ | × | √ | × | × | × |
| R1_D17 | LCDC_D17/LCD_D17 | √ | √ | × | × | × | × |
| R0_D16 | LCDC_D16/LCD_D16 | √ | √ | × | × | × | × |
| G7_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | √ | √ | × |
| G6_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | √ | √ | × |
| G5_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | √ | √ | × |
| G4_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | √ | √ | × |
| G3_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | √ | √ | × |
| G2_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | √ | √ | × |
| G1_D9 | LCDC_D9/LCD_D9 | √ | √ | × | √ | × | × |
| G0_D8 | LCDC_D8/LCD_D8 | √ | √ | × | √ | × | × |
| B7_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ | √ | √ |
| B6_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ | × | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | × | √ | × | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | × | √ | × | √ |

### 3.4 RK1808/RV1106

| Имя компонента | Имя контакта | RGB666 (MCU) | RGB565 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R5_D17 | LCDC_D17/LCD_D17 | √ | × | × | × |
| R4_D16 | LCDC_D16/LCD_D16 | √ | × | × | × |
| R3_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | × |
| R2_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | × |
| R1_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | × |
| R0_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | × |
| G5_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | × |
| G4_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | × |
| G3_D9 | LCDC_D9/LCD_D9 | √ | √ | √ | × |
| G2_D8 | LCDC_D8/LCD_D8 | √ | √ | √ | × |
| G1_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ |
| G0_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | √ | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | √ | √ |

### 3.5 RV1103

| Имя компонента | Имя контакта | RGB3x8 (MCU) |
| --- | --- | --- |
| DCLK | LCDC_CLK | DCLK(RS) |
| VSYNC | LCDC_VSYNC | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC | HSYNC(WRN) |
| DEN | LCDC_DEN | DEN(RDN) |
| D7 | LCDC_D7 | √ |
| D6 | LCDC_D6 | √ |
| D5 | LCDC_D5 | √ |
| D4 | LCDC_D4 | √ |
| D3 | LCDC_D3 | √ |
| D2 | LCDC_D2 | √ |
| D1 | LCDC_D1 | √ |
| D0 | LCDC_D0 | √ |

### 3.6 RV1126B-P

В RV1126B-P введена карта данных data map для сохранения схемы соединений раннего RV1126. Разные карты выводят данные на разные аппаратные контакты.

Полные определения data map находятся в include/dt-bindings/display/rockchip_vop.h:

```text
/* mcu_data[23:0] */
#define ROCKCHIP_MCU_DATA_MAP_DATA_1x24 0
/*

 * { mcu_data[7:3], 3'b0, mcu_data[2:0], mcu_data[7:5], 2'b0, mcu_data[4:0], 3'b0 }
 * That is:
 *   LCDC_D23 -> MCU_D7_M1
 *   LCDC_D22 -> MCU_D6_M1
 *   LCDC_D21 -> MCU_D5_M1
 *   LCDC_D20 -> MCU_D4_M1
 *   LCDC_D19 -> MCU_D3_M1
 *   LCDC_D18 -> N/A
 *   LCDC_D17 -> N/A
 *   LCDC_D16 -> N/A
 *   LCDC_D15 -> MCU_D2_M1
 *   LCDC_D14 -> MCU_D1_M1

 *   LCDC_D13 -> MCU_D0_M1
 *   LCDC_D12 -> MCU_D7_M0
 *   LCDC_D11 -> MCU_D6_M0
 *   LCDC_D10 -> MCU_D5_M0
 *   LCDC_D9 -> N/A

 *   LCDC_D8 -> N/A
 *   LCDC_D7 -> MCU_D4_M0
 *   LCDC_D6 -> MCU_D3_M0
 *   LCDC_D5 -> MCU_D2_M0
 *   LCDC_D4 -> MCU_D1_M0
 *   LCDC_D3 -> MCU_D0_M0
 *   LCDC_D2 -> N/A
 *   LCDC_D1 -> N/A
 *   LCDC_D0 -> N/A
 */
#define ROCKCHIP_MCU_DATA_MAP_DATA_WITH_DUMMY_0 1
```

Для обычного RV1126B следующие соединения MCU по умолчанию соответствуют ROCKCHIP_MCU_DATA_MAP_DATA_WITH_DUMMY_0.

| Имя компонента | Имя контакта | RGB888 (MCU) | RGB666 (MCU) | RGB565 (MCU) | RGB3x8 (MCU) | RGB3x6 (MCU) | RGB2x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | VO_LCDC_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | VO_LCDC_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | VO_LCDC_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | VO_LCDC_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | VO_LCDC_D23 | √ | √ | √ | √ (D7_m1) | √ (D5_m1) | √ (D7_m1) |
| R6_D22 | VO_LCDC_D22 | √ | √ | √ | √ (D6_m1) | √ (D4_m1) | √ (D6_m1) |
| R5_D21 | VO_LCDC_D21 | √ | √ | √ | √ (D5_m1) | √ (D3_m1) | √ (D5_m1) |
| R4_D20 | VO_LCDC_D20 | √ | √ | √ | √ (D4_m1) | √ (D2_m1) | √ (D4_m1) |
| R3_D19 | VO_LCDC_D19 | √ | √ | √ | √ (D3_m1) | √ (D1_m1) | √ (D3_m1) |
| R2_D18 | VO_LCDC_D18 | √ | √ | × | × | × | × |
| R1_D17 | VO_LCDC_D17 | √ | × | × | × | × | × |
| R0_D16 | VO_LCDC_D16 | √ | × | × | × | × | × |
| G7_D15 | VO_LCDC_D15 | √ | √ | √ | √ (D2_m1) | √ (D0_m1) | √ (D2_m1) |
| G6_D14 | VO_LCDC_D14 | √ | √ | √ | √ (D1_m1) | × | √ (D1_m1) |
| G5_D13 | VO_LCDC_D13 | √ | √ | √ | √ (D0_m1) | × | √ (D0_m1) |
| G4_D12 | VO_LCDC_D12 | √ | √ | √ | √ (D7_m0) | √ (D5_m0) | √ (D7_m0) |
| G3_D11 | VO_LCDC_D11 | √ | √ | √ | √ (D6_m0) | √ (D4_m0) | √ (D6_m0) |
| G2_D10 | VO_LCDC_D10 | √ | √ | √ | √ (D5_m0) | √ (D3_m0) | √ (D5_m0) |
| G1_D9 | VO_LCDC_D9 | √ | × | × | × | × | × |
| G0_D8 | VO_LCDC_D8 | √ | × | × | × | × | × |
| B7_D7 | VO_LCDC_D7 | √ | √ | √ | √ (D4_m0) | √ (D2_m0) | √ (D4_m0) |
| B6_D6 | VO_LCDC_D6 | √ | √ | √ | √ (D3_m0) | √ (D1_m0) | √ (D3_m0) |
| B5_D5 | VO_LCDC_D5 | √ | √ | √ | √ (D2_m0) | √ (D0_m0) | √ (D2_m0) |
| B4_D4 | VO_LCDC_D4 | √ | √ | √ | √ (D1_m0) | × | √ (D1_m0) |
| B3_D3 | VO_LCDC_D3 | √ | √ | √ | √ (D0_m0) | × | √ (D0_m0) |
| B2_D2 | VO_LCDC_D2 | √ | √ | × | × | × | × |
| B1_D1 | VO_LCDC_D1 | √ | × | × | × | × | × |
| B0_D0 | VO_LCDC_D0 | √ | × | × | × | × | × |

RV1126B-P использует ROCKCHIP_MCU_DATA_MAP_DATA_1x24, чтобы аппаратный выход MCU соответствовал раннему RV1126. Соединения показаны ниже:

| Имя компонента | Имя контакта | RGB888 (MCU) | RGB666 (MCU) | RGB666_CPADHI (MCU) | RGB565 (MCU) | RGB565_CPADHI (MCU) | RGB3x8 (MCU) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | LCDC_CLK/LCD_CLK | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) | DCLK(RS) |
| VSYNC | LCDC_VSYNC/LCD_VSYNC | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) | VSYNC(CSN) |
| HSYNC | LCDC_HSYNC/LCD_HSYNC | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) | HSYNC(WRN) |
| DEN | LCDC_DEN/LCD_DEN | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) | DEN(RDN) |
| R7_D23 | LCDC_D23/LCD_D23 | √ | × | √ | × | √ | × |
| R6_D22 | LCDC_D22/LCD_D22 | √ | × | √ | × | √ | × |
| R5_D21 | LCDC_D21/LCD_D21 | √ | × | √ | × | √ | × |
| R4_D20 | LCDC_D20/LCD_D20 | √ | × | √ | × | √ | × |
| R3_D19 | LCDC_D19/LCD_D19 | √ | × | √ | × | √ | × |
| R2_D18 | LCDC_D18/LCD_D18 | √ | × | √ | × | × | × |
| R1_D17 | LCDC_D17/LCD_D17 | √ | √ | × | × | × | × |
| R0_D16 | LCDC_D16/LCD_D16 | √ | √ | × | × | × | × |
| G7_D15 | LCDC_D15/LCD_D15 | √ | √ | √ | √ | √ | × |
| G6_D14 | LCDC_D14/LCD_D14 | √ | √ | √ | √ | √ | × |
| G5_D13 | LCDC_D13/LCD_D13 | √ | √ | √ | √ | √ | × |
| G4_D12 | LCDC_D12/LCD_D12 | √ | √ | √ | √ | √ | × |
| G3_D11 | LCDC_D11/LCD_D11 | √ | √ | √ | √ | √ | × |
| G2_D10 | LCDC_D10/LCD_D10 | √ | √ | √ | √ | √ | × |
| G1_D9 | LCDC_D9/LCD_D9 | √ | √ | × | √ | × | × |
| G0_D8 | LCDC_D8/LCD_D8 | √ | √ | × | √ | × | × |
| B7_D7 | LCDC_D7/LCD_D7 | √ | √ | √ | √ | √ | √ |
| B6_D6 | LCDC_D6/LCD_D6 | √ | √ | √ | √ | √ | √ |
| B5_D5 | LCDC_D5/LCD_D5 | √ | √ | √ | √ | √ | √ |
| B4_D4 | LCDC_D4/LCD_D4 | √ | √ | √ | √ | √ | √ |
| B3_D3 | LCDC_D3/LCD_D3 | √ | √ | √ | √ | √ | √ |
| B2_D2 | LCDC_D2/LCD_D2 | √ | √ | √ | √ | × | √ |
| B1_D1 | LCDC_D1/LCD_D1 | √ | √ | × | √ | × | √ |
| B0_D0 | LCDC_D0/LCD_D0 | √ | √ | × | √ | × | √ |

Обычно RV1126B и RV1126B-P не требуют дополнительной настройки. При необходимости изменения можно задать в DTS.

Следующий пример настраивает RV1126B на схему соединений раннего RV1126. Для RV1126B-P эта конфигурация уже используется по умолчанию.

```text
&rgb {
   /*

   * RV1126 compatible pin output mode 0.
   * MCU: ROCKCHIP_MCU_DATA_MAP_DATA_1x24
   */
   rockchip,data-map-mode = <0>;
};
```

## 4. Настройка ПО

### 4.1 Тракты вывода

![Тракты RGB/MCU для VOP 1.0/2.0](/docs/rockchip-rgb-mcu/assets/cn-p15-1.png)

*Тракты RGB/MCU для VOP 1.0/2.0*

VOP (Video Output Process) — блок обработки изображения Rockchip. Архитектуры VOP 1.0 и VOP 2.0 отличаются главным образом поддержкой нескольких дисплеев; см. Rockchip_Developer_Guide_DRM_Display_Driver_CN. Левая и правая схемы показывают RGB/MCU для VOP 1.0 и VOP 2.0 соответственно. VOP читает изображение из DDR, обрабатывает его и передаёт в RGB/MCU. Интерфейс преобразует изображение в поток соответствующего протокола и отправляет панели.

### 4.2 Настройка панели

Драйвер панели RGB см. в drivers/gpu/drm/panel/panel-simple.c. Типичный узел панели:

```text
/ {
   panel: panel {

      compatible = "simple-panel";
      bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      backlight = <&backlight>;
      enable-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
      reset-delay-ms = <10>;
      status = "okay";

      display-timings {

         native-mode = <&fx070_dhm11boe_timing>;

         fx070_dhm11boe_timing: timing0 {
           clock-frequency = <50000000>;
           hactive = <1024>;
           vactive = <600>;
           hback-porch = <140>;
           hfront-porch = <160>;
           vback-porch = <20>;
           vfront-porch = <20>;
           hsync-len = <20>;
           vsync-len = <2>;

           hsync-active = <0>;
           vsync-active = <0>;
           de-active = <0>;
           pixelclk-active = <0>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };
   };

};

&backlight {
   pwms = <&pwm9 0 25000 0>;
   status = "okay";
};
```

Задайте bus-format по режиму дисплея панели, обычно указанному в описании контактов datasheet и поддерживаемых режимах IC. Макросы DTS определены в include/uapi/linux/media-bus-format.h. Соответствия аппаратным соединениям:

| Режим дисплея | Формат шины | Циклов на пиксель |
| --- | --- | --- |
| RGB888 (24bit) | MEDIA_BUS_FMT_RGB888_1X24 | 1 |
| RGB666 (18bit) | MEDIA_BUS_FMT_RGB666_1X18 | 1 |
| RGB666_CPADHI (18bit) | MEDIA_BUS_FMT_RGB666_1X24_CPADHI | 1 |
| RGB565 (16bit) | MEDIA_BUS_FMT_RGB565_1X16 | 1 |
| RGB565_CPADHI (16bit) | MEDIA_BUS_FMT_RGB565_1X24_CPADHI | 1 |
| RGB3x8 (8bit) | MEDIA_BUS_FMT_RGB888_3X8 MEDIA_BUS_FMT_RGB888_3X8 | 3 |
| RGB4x8(8bit) | MEDIA_BUS_FMT_RGB888_DUMMY_4X8 MEDIA_BUS_FMT_BGR888_DUMMY_4X8 | 4 |

Измените pwms узла backlight согласно фактической разводке. Перед выводом изображения убедитесь, что подсветка включена. См. Rockchip_Developer_Guide_Linux_PWM_CN.

Настройте enable-gpios/reset-gpios и enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms согласно требованиям питания/сброса панели и реальной аппаратной схеме.

Необязательно: enable обычно управляет питанием панели. Конфигурация GPIO зависит от схемы питания.

Необязательно: панель обычно имеет контакт reset, условия срабатывания которого описаны в datasheet. Конфигурация GPIO зависит от схемы сброса.

Необязательно: задайте enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms согласно таймингам power/reset/signal из datasheet.

Datasheet панели содержит рекомендуемые display-timings. Значения можно подстраивать под приложение в пределах заданных минимальных и максимальных границ. Следующий datasheet соответствует примеру узла панели:

![Исходная таблица таймингов панели примера](/docs/rockchip-rgb-mcu/assets/cn-p17-1.png)

*Исходная таблица таймингов панели примера*

| Режим | Параметр | Обозначение | Мин. | Тип. | Макс. | Единица | Примечание |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DE | Пиксельная частота | 1/tCLK | 45 | 51.2 | 57 | MHz |  |
| DE | Скважность DCLK | Tcwh | 40 | 50 | 60 | % |  |
| DE | Полный период строки | tH | 1324 | 1344 | 1364 | tCLK |  |
| DE | Активный период строки | tHA |  | 1024 |  | tCLK |  |
| DE | Горизонтальное гашение | tHB | 300 | 320 | 340 | tCLK |  |
| DE | Полный период кадра | tV | 625 | 635 | 645 | tH |  |
| DE | Активный период кадра | tVA |  | 600 |  | tH |  |
| DE | Вертикальное гашение | tVB | 25 | 35 | 45 | tH |  |
| SYNC | Полный период строки | TH | 1324 | 1344 | 1364 | tCLK |  |
| SYNC | Ширина горизонтального импульса | Thpw |  | 20 | - | tCLK | thb + thpw = 160DCLK (фиксировано) |
| SYNC | Задняя горизонтальная площадка | Thb |  | 140 | - | tCLK | thb + thpw = 160DCLK (фиксировано) |
| SYNC | Передняя горизонтальная площадка | Thfp | 140 | 160 | 180 | tCLK |  |
| SYNC | Активный период строки | THA |  | 1024 |  | tCLK |  |
| SYNC | Полный период кадра | TV | 625 | 635 | 645 | th |  |
| SYNC | Ширина вертикального импульса | Tvpw |  | 3 | - | th | tvpw + tvb = 23th (фиксировано) |
| SYNC | Задняя вертикальная площадка | Tvb | - | 20 | - | th | tvpw + tvb = 23th (фиксировано) |
| SYNC | Передняя вертикальная площадка | Tvfp | 2 | 12 | 22 | th |  |
| SYNC | Активная часть кадра | Tvd |  | 600 |  | th |  |

Структура DRM display_timing и описание её полей находятся в include/video/display_timing.h:

```text
/*
 * Single "mode" entry. This describes one set of signal timings a display can
 * have in one setting. This struct can later be converted to struct videomode

 * (see include/video/videomode.h). As each timing_entry can be defined as a
 * range, one struct display_timing may become multiple struct videomodes.
 *
 * Example: hsync active high, vsync active low
 *
 *            Active Video
 * Video ______________________XXXXXXXXXXXXXXXXXXXXXX_____________________
 *  |<- sync ->|<- back ->|<----- active ----->|<- front ->|<- sync..
 *  |    |  porch |        |  porch |
 *
 * HSync _|¯¯¯¯¯¯¯¯¯¯|___________________________________________|¯¯¯¯¯¯¯¯¯
 *

 * VSync ¯|__________|¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|_________
 */
struct display_timing {
   struct timing_entry pixelclock;

   struct timing_entry hactive; /* hor. active video */
   struct timing_entry hfront_porch; /* hor. front porch */
   struct timing_entry hback_porch; /* hor. back porch */
   struct timing_entry hsync_len; /* hor. sync len */

   struct timing_entry vactive; /* ver. active video */
   struct timing_entry vfront_porch; /* ver. front porch */
   struct timing_entry vback_porch; /* ver. back porch */

   struct timing_entry vsync_len; /* ver. sync len */

   enum display_flags flags; /* display flags */
};
```

Для RGB/MCU свойство clock-frequency в display-timings определяет частоту кадров VOP. В расчёте используются параметры DRM htotal и vtotal. Ниже приведён фрагмент; подробнее см. include/drm/drm_modes.h.

Расчёт частоты кадров реализован функцией drm_mode_vrefresh() в drivers/gpu/drm/drm_modes.c. Если обозначить частоту кадров fr, формула имеет вид:

```text
fr = clock / (htotal * vtotal)
```

```text
/**
 * struct drm_display_mode - DRM kernel-internal display mode structure

 * @hdisplay: horizontal display size
 * @hsync_start: horizontal sync start
 * @hsync_end: horizontal sync end
 * @htotal: horizontal total size
 * @hskew: horizontal skew?!
 * @vdisplay: vertical display size
 * @vsync_start: vertical sync start
 * @vsync_end: vertical sync end
 * @vtotal: vertical total size
 * @vscan: vertical scan?!
......
 *

 * The horizontal and vertical timings are defined per the following diagram.
 *
 * ::
 *
 *
 *          Active           Front      Sync       Back
 *         Region           Porch                  Porch
 *   <-----------------------><----------------><-------------><-------------->
 *    //////////////////////|
 *    ////////////////////// |
 *   ////////////////////// |.................. ................
 *                                  _______________

 *   <----- [hv]display ----->
 *   <------------- [hv]sync_start ------------>
 *   <--------------------- [hv]sync_end --------------------->
 *   <-------------------------------- [hv]total ----------------------------->*
 *
......
 */

/**
 * drm_mode_vrefresh - get the vrefresh of a mode
 * @mode: mode
 *
 * Returns:

 * @modes's vrefresh rate in Hz, rounded to the nearest integer. Calculates the
 * value first if it is not yet set.
 */
int drm_mode_vrefresh(const struct drm_display_mode *mode)
{
   unsigned int num, den;

   if (mode->htotal == 0 || mode->vtotal == 0)
      return 0;

   num = mode->clock;
   den = mode->htotal * mode->vtotal;


   if (mode->flags & DRM_MODE_FLAG_INTERLACE)
      num *= 2;
   if (mode->flags & DRM_MODE_FLAG_DBLSCAN)
      den *= 2;
   if (mode->vscan > 1)
      den *= mode->vscan;

   return DIV_ROUND_CLOSEST_ULL(mul_u32_u32(num, 1000), den);
}
EXPORT_SYMBOL(drm_mode_vrefresh);
```

#### 4.2.1 Инициализация SPI

Некоторые RGB-панели требуют команд инициализации через SPI. drivers/gpu/drm/panel/panel-simple.c поддерживает протокол 3-wire 9-bit serial interface:

![Протокол инициализации трёхпроводного 9-битного SPI](/docs/rockchip-rgb-mcu/assets/cn-p20-1.png)

*Протокол инициализации трёхпроводного 9-битного SPI*

Аппаратный SPI Rockchip поддерживает передачу блоками 4/8/16 бит, тогда как этот протокол использует 9 бит. Поэтому panel-simple реализует SPI программно через GPIO.

Типичная конфигурация для kernel-5.10 и новее:

```text
spi_gpio: spi-gpio {
   compatible = "spi-gpio";

   #address-cells = <0x1>;
   #size-cells = <0x0>;
   pinctrl-names = "default";
   pinctrl-0 = <&spi_gpio_pins>;
   spi-delay-us = <10>;
   status = "okay";

   sck-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>;
   miso-gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_HIGH>;
   mosi-gpios = <&gpio4 RK_PA6 GPIO_ACTIVE_HIGH>;
   cs-gpios = <&gpio4 RK_PA4 GPIO_ACTIVE_HIGH>;
   num-chipselects = <1>;


   /*
   * 320x480 RGB/MCU screen K350C4516T
   */
   panel: panel {
      compatible = "simple-panel-spi";
      reg = <0>;
      bus-format = <MEDIA_BUS_FMT_RGB666_1X18>;
      backlight = <&backlight>;
      enable-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
      reset-delay-ms = <10>;

      prepare-delay-ms = <20>;
      unprepare-delay-ms = <20>;
      disable-delay-ms = <20>;
      init-delay-ms = <10>;
      width-mm = <217>;
      height-mm = <136>;
      rockchip,cmd-type = "spi";

      status = "okay";

      // type:0 is cmd, 1 is data
      panel-init-sequence = [
         /* type delay num val1 val2 val3 */
         00 00 01 e0
         01 00 01 00
         ......
         00 78 01 11
         00 00 01 29
      ];


      panel-exit-sequence = [
         //type delay num val1 val2 val3
         00 0a 01 28
         00 78 01 10
      ];

      display-timings {
         native-mode = <&kd050fwfba002_timing>;

         kd050fwfba002_timing: timing0 {
           /*
            * 10453500 for RGB666(18bit)
            */

           clock-frequency = <10453500>;
           hactive = <320>;
           vactive = <480>;
           hback-porch = <10>;
           hfront-porch = <5>;
           vback-porch = <10>;
           vfront-porch = <5>;
           hsync-len = <10>;
           vsync-len = <10>;
           hsync-active = <0>;
           vsync-active = <0>;
           de-active = <0>;

           pixelclk-active = <1>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };
   };
};
```

Включите CONFIG_SPI_GPIO и задайте sck-gpios, miso-gpios, mosi-gpios и

cs-gpios согласно аппаратной схеме; см. drivers/spi/spi-gpio.c. Узел панели в основном аналогичен приведённому выше, но учитывайте следующее:

Измените compatible на "simple-panel-spi".

Задайте rockchip,cmd-type как "spi".

Заполните panel-init-sequence/panel-exit-sequence соответствующими последовательностями init/deinit.

В kernel 4.19 и более ранних версиях SDI/SCL/CS для SPI RGB эмулируются GPIO непосредственно в simple-panel без стороннего драйвера SPI. SDI фактически не поддерживается: обозначение SDI в DTS относится к аппаратному SDO и является опечаткой ранней версии. Пример:

```text
panel: panel {
   compatible = "simple-panel";

   ......
   spi-sdi-gpios = <&gpio1 RK_PC7 GPIO_ACTIVE_HIGH>;
   spi-scl-gpios = <&gpio1 RK_PD0 GPIO_ACTIVE_HIGH>;
   spi-cs-gpios = <&gpio1 RK_PD1 GPIO_ACTIVE_HIGH>;
   ......
   rockchip,cmd-type = "spi";

   /* type:0 is cmd, 1 is data */
   panel-init-sequence = [
      /* type delay num val1 val2 val3 */
       00  00 01 e0
       ......
       00  78 01 11

       00  00 01 29
   ];

   panel-exit-sequence = [
      /* type delay num val1 val2 val3 */
      00 0a 01 28
      00 78 01 10
   ];
   ......
};
```

Примеры настройки SPI RGB для разных ядер:

kernel 4.19 и ранее: arch/arm64/boot/dts/rockchip/rk3308-evb-ext-v10.dtsi

kernel 5.10 и новее: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-rgb-k350c4516t.dts

### 4.3 Интерфейс RGB

Драйвер RGB: drivers/gpu/drm/rockchip/rockchip_rgb.c. Пример DTS:

```text
&rgb {
   status = "okay";

   pinctrl-0 = <&rgb666_pins>;
   ports {
      port@1 {
         reg = <1>;


         rgb_out_panel: endpoint {
           remote-endpoint = <&panel_in_rgb>;
         };
      };
   };
};

//VOP 1.0
&rgb_in_vop {
   status = "okay";
};


//VOP 2.0
&rgb_in_vp0 {
   status = "okay";
};
```

Настройка узлов RGB различается для VOP 1.0 и VOP 2.0. Примеры:

VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-rgb-v10.dtsi.

VOP 2.0: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-rgb-FX070-DHM11BOE-A.dts.

Выберите pinctrl по реальным аппаратным соединениям. Определения порядка контактов находятся в rkxxxx-pinctrl.dtsi/rvxxxx-pinctrl.dtsi.

### 4.4 Интерфейс MCU

Драйверы интерфейса MCU и панели MCU находятся в drivers/gpu/drm/rockchip/rockchip_rgb.c. DTS в основном аналогичен RGB с дополнительными параметрами выбора режима MCU и тайминга. Пример:

```text
&rgb {
   status = "okay";

   rockchip,data-sync-bypass;
   pinctrl-names = "default";
   /*
   * rgb3x8_pins_m0/rgb3x8_pins_m1 for RGB3x8(8bit)
   * rgb565_pins for RGB565(16bit)
   */
   pinctrl-0 = <&rgb565_pins>;

   /*
   * 320x480 RGB/MCU screen K350C4516T
   */
   mcu_panel: mcu-panel {
      /*

      * MEDIA_BUS_FMT_RGB888_3X8 for RGB3x8(8bit)
       * MEDIA_BUS_FMT_RGB565_1X16 for RGB565(16bit)
       */
      bus-format = <MEDIA_BUS_FMT_RGB565_1X16>;

      backlight = <&backlight>;
      enable-gpios = <&gpio1 RK_PA3 GPIO_ACTIVE_LOW>;
      enable-delay-ms = <20>;
      reset-gpios = <&gpio1 RK_PA4 GPIO_ACTIVE_LOW>;
      reset-value = <0>;
      reset-delay-ms = <10>;
      prepare-delay-ms = <20>;
      unprepare-delay-ms = <20>;
      disable-delay-ms = <20>;
      init-delay-ms = <10>;
      width-mm = <217>;
      height-mm = <136>;


      // type:0 is cmd, 1 is data
      panel-init-sequence = [
         //type delay num val1 val2 val3
          ......
          01  00 01 55 /*
                       * interface pixel format:
                       * 66 for RGB3x8(8bit)
                       * 55 for RGB565(16bit)
                       */
          ......
          01  00 01 a0 /*
                       * frame rate control:

                       * 70 (45hz) for RGB3x8(8bit)
                       * a0 (60hz) for RGB565(16bit)
                       */
          ......
          01  00 01 02 /*
                       * display function control:
                       * 32 for RGB
                       * 02 for MCU
                       */
          00  78 01 11
          00  32 01 29
          00  00 01 2c

      ];

      panel-exit-sequence = [
         //type delay num val1 val2 val3
          00  0a 01 28
          00  78 01 10
      ];

      display-timings {
         native-mode = <&kd050fwfba002_timing>;

         kd050fwfba002_timing: timing0 {
            /*
             * 7840125 for frame rate 45Hz
             * 10453500 for frame rate 60Hz
             */

            clock-frequency = <10453500>;
            hactive = <320>;
            vactive = <480>;
            hback-porch = <10>;
            hfront-porch = <5>;
            vback-porch = <10>;
            vfront-porch = <5>;
            hsync-len = <10>;
            vsync-len = <10>;
            hsync-active = <0>;
            vsync-active = <0>;
            de-active = <0>;

            pixelclk-active = <1>;
         };
      };

      port {
            panel_in_rgb: endpoint {
               remote-endpoint = <&rgb_out_panel>;
            };
         };
      };

      ports {
         rgb_out: port@1 {

            reg = <1>;
            #address-cells = <1>;
            #size-cells = <0>;

            rgb_out_panel: endpoint@0 {
               reg = <0>;
               remote-endpoint = <&panel_in_rgb>;
            };
         };
      };
   };
};


//VOP 1.0
&rgb_in_vop {
   status = "okay";
};

&vop {
   status = "okay";

   /*
    * Default config is as follows:
    *
    * mcu-pix-total = <9>;
   * mcu-cs-pst = <1>;
   * mcu-cs-pend = <8>;
   * mcu-rw-pst = <2>;

   * mcu-rw-pend = <5>;
   * mcu-hold-mode = <0>; // default set to 0
   *
   * To increase the frame rate, reduce all parameters because
   * the max dclk rate of mcu is 150M in rv1103/rv1106.
   */
   mcu-timing {
      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;


      mcu-hold-mode = <0>; // default set to 0
   };
};

//VOP 2.0
&rgb_in_vp0 {
   status = "okay";
};

&vp0 {
   status = "okay";


   /*
   * Default config is as follows:
   *
   * mcu-pix-total = <9>;
   * mcu-cs-pst = <1>;
   * mcu-cs-pend = <8>;
   * mcu-rw-pst = <2>;
   * mcu-rw-pend = <5>;
   * mcu-hold-mode = <0>; // default set to 0
   *
   * To increase the frame rate, reduce all parameters because
   * the max dclk rate of mcu is 150M in rk3562.

   */
   mcu-timing {
      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;

      mcu-hold-mode = <0>; // default set to 0
   };
};
```

Настройка узлов MCU различается для VOP 1.0 и VOP 2.0. Примеры:

VOP 1.0: arch/arm/boot/dts/rv1106-evb-ext-mcu-v10.dtsi.

VOP 2.0: arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-mcu-k350c4516t.dts. Драйвер выбирает MCU или RGB по свойству rockchip,data-sync-bypass узла rgb. Без свойства используется RGB; включение свойства выбирает MCU.

В kernel-5.10 и новее рекомендуется размещать MCU panel внутри узла rgb. В kernel-4.19 и ранее отдельный узел инициализируется через simple-panel. При переносе узла панели из simple-panel в rgb учитывайте:

Назовите узел mcu-panel: драйвер использует это имя для обнаружения и разбора параметров панели MCU.

Свойство compatible можно удалить; оно не требуется.

Панели MCU обычно нужна последовательность инициализации display mode, pixel format и frame rate (в зависимости от IC), а также деинициализации для выключения или перехода в малопотребляющий режим. Для panel-init-sequence и panel-exit-sequence:

Последовательность предоставляет производитель панели; обычно её нужно преобразовать из файла C в DTS.

Каждая строка последовательности содержит слева направо: тип cmd/data, задержку в ms, длину данных в байтах и данные.

Частота кадров обычно задаётся при инициализации последовательности и должна соответствовать расчёту в разделе настройки панели. Фрагмент руководства IC примера:

![Исходная таблица регистра управления частотой кадров FRMCTR1](/docs/rockchip-rgb-mcu/assets/cn-p27-1.png)

*Исходная таблица регистра управления частотой кадров FRMCTR1*

| FRMCTR1 (B1h) | D/CX | RDX | WRX | D[23:8] | D7..D0 | HEX |
| --- | --- | --- | --- | --- | --- | --- |
| Команда | 0 | 1 | ↑ | XX | 1 0 1 1 0 0 0 1 | B1h |
| 1-й параметр | 1 | 1 | ↑ | XX | FRS[3:0] / 0 / 0 / DIVA[1:0] | B0h |
| 2-й параметр | 1 | 1 | ↑ | XX | 0 / 0 / 0 / RTNA[4:0] | 11h |

![Исходный фрагмент соответствия FRS и частоты кадров](/docs/rockchip-rgb-mcu/assets/cn-p27-2.png)

*Исходный фрагмент соответствия FRS и частоты кадров*

| FRS[3:0] | CNT | Hz / TE OFF (R34h) | Hz / TE ON (R35h), VBP+VFP &lt;24 |
| --- | --- | --- | --- |
| 0000 | 37 | 28.78 | 27.64 |
| 0001 | 35 | 30.38 | 29.17 |
| 0010 | 33 | 32.17 | 30.89 |
| 0011 | 31 | 34.18 | 32.82 |
| 0100 | 29 | 36.46 | 35.01 |
| 0101 | 27 | 39.06 | 37.51 |
| 0110 | 25 | 42.07 | 40.40 |
| 0111 | 23 | 45.57 | 43.76 |
| 1000 | 21 | 49.71 | 47.74 |
| 1001 | 19 | 54.69 | 52.52 |
| 1010 | 17 | 60.76 | 58.35 |
| 1011 | 15 | 68.36 | 65.65 |
| 1100 | 13 | 78.13 | 75.03 |
| 1101 | 11 | 91.15 | 87.53 |

mcu-timing задаёт тайминги управляющих сигналов CSN/WEN/REN в режиме normal. Свойства соответствуют интервалам ниже. Подробные тайминги и требования взяты из datasheet панели примера DTS. Далее описана настройка mcu-timing и clock-frequency в display-timings.

![Тайминги управляющих сигналов MCU normal](/docs/rockchip-rgb-mcu/assets/cn-p28-1.png)

*Тайминги управляющих сигналов MCU normal*

![Тайминги записи/чтения панели](/docs/rockchip-rgb-mcu/assets/cn-p28-2.png)

*Тайминги записи/чтения панели*

![Исходные требования тайминга IC панели](/docs/rockchip-rgb-mcu/assets/cn-p29-1.png)

*Исходные требования тайминга IC панели*

| Сигнал | Обозначение | Параметр | Мин. | Макс. | Единица | Описание |
| --- | --- | --- | --- | --- | --- | --- |
| DCX | tast | Время установки адреса | 0 | - | ns | - |
| DCX | that | Время удержания адреса (запись/чтение) | 0 | - | ns | - |
| CSX | tchw | Ширина высокого импульса CSX | 0 | - | ns | - |
| CSX | tcs | Установка выбора кристалла (запись) | 15 | - | ns | - |
| CSX | trcs | Установка выбора кристалла (чтение ID) | 45 | - | ns | - |
| CSX | trcsfm | Установка выбора кристалла (чтение FM) | 355 | - | ns | - |
| CSX | tcsf | Ожидание выбора кристалла (запись/чтение) | 0 | - | ns | - |
| WRX | twc | Цикл записи | 30 | - | ns | - |
| WRX | twrh | Длительность высокого уровня управления записью | 15 | - | ns | - |
| WRX | twrl | Длительность низкого уровня управления записью | 15 | - | ns | - |
| RDX (FM) | trcfm | Цикл чтения (FM) | 450 | - | ns | Чтение памяти кадра |
| RDX (FM) | trdhfm | Высокий уровень управления чтением (FM) | 90 | - | ns | Чтение памяти кадра |
| RDX (FM) | trdlfm | Низкий уровень управления чтением (FM) | 355 | - | ns | Чтение памяти кадра |
| RDX (ID) | trc | Цикл чтения (ID) | 160 | - | ns | Чтение данных ID |
| RDX (ID) | trdh | Высокий уровень управления чтением | 90 | - | ns | Чтение данных ID |
| RDX (ID) | trdl | Низкий уровень управления чтением | 45 | - | ns | Чтение данных ID |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tdst | Установка данных записи | 10 | - | ns | Максимум: CL=30pF; минимум: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tdht | Удержание данных записи | 10 | - | ns | Максимум: CL=30pF; минимум: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | trat | Время доступа чтения | - | 40 | ns | Максимум: CL=30pF; минимум: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | tratfm | Время доступа чтения | - | 340 | ns | Максимум: CL=30pF; минимум: CL=8pF |
| DB[23:0], DB[17:0], DB[15:0], DB[8:0], DB[7:0] | trod | Время отключения выхода чтения | 20 | 80 | ns | Максимум: CL=30pF; минимум: CL=8pF |

Пусть ptotal — значение mcu-pix-total в mcu-timing. Datasheet панели требует, чтобы интервал MCU_PIX_TOTAL был не короче tmin:

В datasheet панели twc = 40, а в datasheet IC twc = 30; используется большее значение.

```text
tmin = T_CHW + T_AST + T_WC + T_CHW = 40 ns
```

Панель примера поддерживает MEDIA_BUS_FMT_RGB888_3X8 и MEDIA_BUS_FMT_RGB565_1X16. Обозначим cpp как Cycles Per Pixel — число циклов передачи пикселя (см. настройку панели). Теоретические пределы частоты кадров frs-max и frp-max:

```text
fr < 1000000000 / (htotal * ptotal * cpp * tmin)
htotal = hactive + hback-porch + hfront-porch + hsync-len = 345
vtotal = vactive + vback-porch + vfront-porch + vsync-len = 505
fr_s-max < 1000000000 / (345 * 505 * 3 * 40) ≈ 47.83 Hz
fr_p-max < 1000000000 / (345 * 505 * 1 * 40) ≈ 143.49 Hz
```

Примечание: в общей формуле оригинала указан `ptotal`, но при подстановке использовано `505` (указанный `vtotal`). Формула и расчёт сохранены без скрытого исправления.

Поэтому в оригинале выбраны frs = 45(Hz) для последовательного rgb3x8 и frp = 60(Hz) для параллельного rgb1x16.

Далее индекс s означает последовательный режим, p — параллельный.

Значения clock-frequency в display-timings:

```text
clock_s = fr_s * htotal * vtotal = 45 * 345 * 505 = 7840125
clock_p = fr_p * htotal * vtotal = 60 * 345 * 505 = 10453500
```

Каждая платформа ограничивает dclk MCU. См. mcu_max_dclk_rate в drivers/gpu/drm/rockchip/rockchip_rgb.c; обычно это 150000000 Hz. Проверка реализована в rockchip_rgb_encoder_mode_valid().

По dclkmax и частоте кадров fr из последовательности инициализации (обычно 60Hz) вычисляется максимальный ptotal:

```text
ptotal_max < dclk_max / (cpp * clock) - 1
ptotal_s-max < 150000000 / (3 * 7840125) - 1 ≈ 5.38
ptotal_p-max < 150000000 / (1 * 10453500) - 1 ≈ 13.35
```

Выберите меньшее значение, ptotal = 5, и определите остальные параметры mcu-timing по диаграмме.

В конце проверьте рассчитанные фактические значения по требованиям тайминга datasheet.

Фактическая dclk MCU не равна просто clock-frequency из display-timings; она также зависит от mcu-pix-total в mcu-timing и Cycles Per Pixel:

```text
dclk = clock * cpp * (ptotal + 1)
dclk_s = 7840125 * 3 * 6 = 141122250
dclk_p = 10453500 * 1 * 6 = 62721000
```

Обе частоты dclk не превышают dclkmax. Фактические длительности MCU_PIX_TOTAL:

```text
t_s = (ptotal + 1) * 1000000000 / dclk_s ≈ 42.52 ns
t_p = (ptotal + 1) * 1000000000 / dclk_p ≈ 95.66 ns
```

Обе длительности MCU_PIX_TOTAL t удовлетворяют требованию превышать 40 ns.

#### 4.4.1 Тайминги MCU bypass

Ранние платформы MCU, например RK3308 и PX30, используют одинаковые тайминги bypass и normal. Начиная с RK3562 конструкция IC оптимизирована, а драйвер предоставляет стандартные тайминги bypass для большинства операций write/read. См. vop_mcu_bypass_cfg в drivers/gpu/drm/rockchip/rockchip_vop_reg.c и drivers/gpu/drm/rockchip/rockchip_vop2_reg.c, например:

```text
static struct rockchip_mcu_timing rk3506_mcu_bypass_timing = {
   .mcu_pix_total = 26,
   .mcu_cs_pst = 3,

   .mcu_cs_pend = 24,
   .mcu_rw_pst = 6,
   .mcu_rw_pend = 15,
};

static const struct vop_mcu_bypass_cfg rk3506_mcu_bypass_cfg = {
   .timing = &rk3506_mcu_bypass_timing,
   .dclk_rate = 120000000,
};
```

Если стандартные тайминги bypass не подходят, задайте их в DTS; см. arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts:

```text
&vop {
   mcu-timing {

      mcu-pix-total = <5>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <4>;
      mcu-rw-pst = <2>;
      mcu-rw-pend = <3>;

      mcu-hold-mode = <0>;
   };

   mcu-bypass-timing {
      mcu-pix-total = <9>;
      mcu-cs-pst = <1>;
      mcu-cs-pend = <8>;

      mcu-rw-pst = <2>;
      mcu-rw-pend = <7>;

      mcu-hold-mode = <0>;
   };
};
```

Режим bypass может включать чтение MCU. Минимальные ограничения тайминга чтения обычно больше, чем записи (см. предыдущий datasheet), поэтому mcu-bypass-timing обычно рассчитывают по ограничениям чтения, чтобы удовлетворить требованиям обеих операций.

#### 4.4.2 MCU frame write/read

В режиме MCU normal функция frame write/read позволяет обмениваться командами между хостом и панелью между кадрами: читать регистры состояния, менять начало отображения и т. п. Обычно она используется при электростатических испытаниях либо для панелей, требующих обновления начальной позиции каждый кадр.

Для включения задайте panel-frame-sequence в DTS. См. arch/arm/boot/dts/rk3506g-evb1-v10-mcu-k350c4516t.dts:

```text
&rgb {
   ......
   mcu_panel: mcu-panel {

      ......
      panel-frame-sequence = [
         //type delay num val1 val2 val3
          00  00 01 0a
          02  00 01 0a
          02  00 01 0a
          00  00 01 2c
      ];
      ......
   };
   ......
};
```

Межкадровые write/read реализованы в drivers/gpu/drm/rockchip/rockchip_rgb.c:

```text
static void mcu_interframe_work_func(struct work_struct *work)
{
   struct rockchip_mcu_panel *mcu_panel =

      container_of(work, struct rockchip_mcu_panel, interframe_work);
   struct drm_panel *panel = &mcu_panel->base;
   struct drm_display_mode *mode = mcu_panel->desc->mode;
   struct drm_crtc *crtc = mcu_panel->encoder->crtc;
   u32 timeout = DIV_ROUND_CLOSEST_ULL(1000, drm_mode_vrefresh(mode));
   int ret;

   ret = rockchip_drm_wait_vact_end(crtc, timeout);
   if (ret) {
      DRM_DEV_ERROR(panel->dev, "wairt vact end timed out\n");
      return;
   }


   ret = rockchip_mcu_panel_xfer_mcu_cmd_seq(mcu_panel, mcu_panel->desc->frame_seq);
   if (ret) {
      DRM_DEV_ERROR(panel->dev, "failed to send frame cmds seq\n");
      return;
   }

   schedule_work(&mcu_panel->interframe_work);
};
```

Для специальных требований приложения можно изменить реализацию указанной выше рабочей функции.

## 5. Порядок отладки

1\. Проверьте аппаратные соединения всех контактов RGB/MCU. Сопоставления контактов могут различаться между платформами; см.

раздел аппаратных соединений выше.

![Пример соединений контактов RGB/MCU](/docs/rockchip-rgb-mcu/assets/cn-p33-1.png)

*Пример соединений контактов RGB/MCU*

2\. По datasheet панели настройте полярность enable/reset, последовательность питания и канал PWM подсветки. Для MCU-панели также задайте правильную последовательность инициализации.

![Пример соединений reset, enable и PWM подсветки](/docs/rockchip-rgb-mcu/assets/cn-p33-2.png)

*Пример соединений reset, enable и PWM подсветки*

3\. При включённой подсветке снова проверьте уровни enable/reset. Если измерения не соответствуют ожидаемым, проверьте правильность выбора GPIO в iomux.

## 6. Типичные проблемы

### 6.1 Шум или смещение изображения на RGB/MCU

Попробуйте инвертировать полярность dclk свойством pixelclk-active в display-timings. Это изменяет относительную фазу dclk и данных.

```text
display-timings {
   native-mode = <&fx070_dhm11boe_timing>;


   fx070_dhm11boe_timing: timing0 {
      clock-frequency = <50000000>;
      hactive = <1024>;
      vactive = <600>;
      hback-porch = <140>;
      hfront-porch = <160>;
      vback-porch = <20>;
      vfront-porch = <20>;
      hsync-len = <20>;
      vsync-len = <2>;
      hsync-active = <0>;
      vsync-active = <0>;

      de-active = <0>;
      pixelclk-active = <0>; // 1 翻转，0 不翻转
   };
};
```

{% endraw %}
