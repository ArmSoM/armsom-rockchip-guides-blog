---
title: "LVDS Rockchip: электрические характеристики, одно- и двухканальная конфигурация и отладка"
description: "Полный справочный материал LVDS: диаграммы JEIDA/VESA, поддержка платформ, пять схем отображения, DTS и настройка напряжений."
translation_key: "049-rockchip-lvds"
slug: "049-rockchip-lvds"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["LVDS", "JEIDA", "VESA", "RK356X", "RK3288"]
keywords: "ArmSoM Rockchip LVDS Dual LVDS JEIDA VESA DTS"
excerpt: "Полный справочный материал LVDS: диаграммы JEIDA/VESA, поддержка платформ, пять схем отображения, DTS и настройка напряжений."
---

{% raw %}
# LVDS Rockchip: электрические характеристики, одно- и двухканальная конфигурация и отладка

## Применимость к ArmSoM

Это справочный материал платформы Rockchip, а не отчёт об аппаратных испытаниях ArmSoM. Таблица версий исходника охватывает RK3126, RK3128 и RK3288 (Linux 4.4), а также RK3326/PX30, RK3368 и RK356X (Linux 4.19 и новее); таблица поддержки также включает RK3562. Перед адаптацией проверьте выведенные сигналы LVDS, маршрутизацию PHY/VP, драйвер SDK, временные параметры, питание и подсветку панели. Поддержка LVDS на всех платах ArmSoM не заявляется. Аппаратные испытания не выполнялись.

Китайский и английский PDF имеют версию V1.2.0 и объём 22 и 24 страницы соответственно. Китайская статья следует китайскому источнику; английская — английскому; русская полностью переводит английский технический текст. Соответствующие разделы и различия источников сохранены. В китайской статье используются китайские оригиналы рисунков, в английской и русской — английские.

[Редакторские примечания](/docs/rockchip-lvds/EDITORIAL-NOTES.md) · [ArmSoM docs](https://docs.armsom.org/)

> Неоднозначности исходника: строка 4 таблицы сценариев дважды указывает LVDS0, хотя последующие схема и настройки используют LVDS0/LVDS1. Исходные значения сохранены для проверки. В примере vopl для RK3288 отсутствует последняя точка с запятой; она не добавлялась без подтверждения.

## Версии платформ в исходнике

| SoC | Linux |
| --- | --- |
| RK3126 | 4.4 |
| RK3128 | 4.4 |
| RK3288 | 4.4 |
| RK3326/PX30 | 4.19 и новее |
| RK3368 | 4.19 и новее |
| RK356X | 4.19 и новее |

## 1. Основные понятия

LVDS (Low Voltage Differential Signaling) — технология передачи низковольтных дифференциальных сигналов, применяемая в высокоскоростной последовательной связи. Она широко используется для дисплеев, передачи изображений и данных.

LVDS относится к физическому уровню и определяет электрические характеристики и стандарты интерфейса. Организации VESA и JEIDA задают способы передачи данных по LVDS. В зависимости от объёма и порядка передачи различают JEIDA-18, JEIDA-24, VESA-24 и другие форматы.

За один тактовый период LVDS передаёт 7 бит. Ниже приведены временные диаграммы распространённых форматов.

1\. JEIDA-18

```text
Slot     0    1     2     3     4     5    6
       __________                _________________
Clock         \_______________________/

       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
```

2\. JEIDA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________
Clock         \_______________________/

      ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G2__><__R7__><__R6__><__R5__><__R4__><__R3__><__R2__><
DATA1 ><__B3__><__B2__><__G7__><__G6__><__G5__><__G4__><__G3__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B7__><__B6__><__B5__><__B4__><
DATA3 ><_CTL3_><__B1__><__B0__><__G1__><__G0__><__R1__><__R0__><
```

3\. VESA-24

```text
Slot     0    1     2     3     4     5    6
      ___________                _________________

Clock         \_______________________/
       ______ ______ ______ ______ ______ ______ ______
DATA0 ><__G0__><__R5__><__R4__><__R3__><__R2__><__R1__><__R0__><
DATA1 ><__B1__><__B0__><__G5__><__G4__><__G3__><__G2__><__G1__><
DATA2 ><_CTL2_><_CTL1_><_CTL0_><__B5__><__B4__><__B3__><__B2__><
DATA3 ><_CTL3_><__B7__><__B6__><__G7__><__G6__><__R7__><__R6__><
```

CTL2 — сигнал разрешения DE; CTL1 — кадровая синхронизация VSYNC; CTL0 — строчная синхронизация HSYNC. CTL3 зарезервирован для дополнительных функций и обычно может игнорироваться.

В узле panel дерева DTS формат LVDS задаётся свойством bus-format. Соответствия:

`MEDIA_BUS_FMT_RGB666_1X7X3_SPWG`: jeida-18

`MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA`: jeida-24

`MEDIA_BUS_FMT_RGB888_1X7X4_SPWG`: vesa-24

## 2. Электрические характеристики

![Технический рисунок исходника — PDF 5](/docs/rockchip-lvds/assets/en-p5-X49.png)

На рисунке показана типовая схема драйвера LVDS. По существу это дифференциальный усилитель, питаемый источником постоянного тока.

Сначала рассмотрим характеристики постоянного выходного напряжения. Для идеального дифференциального усилителя синфазное напряжение Vcm выражается так:

`V_cm = (U_a + U_b) / 2`

Здесь U_a — постоянное напряжение точки A относительно земли, U_b — постоянное напряжение точки B относительно земли.

Для идеального дифференциального усилителя принимается U_a = U_b: на резисторе 100 Ω приёмника нет разности напряжений, что в исходнике описано как блокирование постоянной составляющей.

Для переменной составляющей малый сигнал u_ab между A и B создаёт падение напряжения на резисторе 100 Ω приёмника, что соответствует прохождению переменного сигнала.

Часто требуется настроить нагрузочную способность LVDS. Для её увеличения существуют разные способы, например увеличение тока источника или сопротивления нагрузки.

Это рассмотрение с точки зрения анализа схемы. На практике некоторые LVDS PHY предоставляют дополнительные настройки. Например, увеличение дифференциального напряжения u_ab может увеличить нагрузочную способность LVDS: чем больше разность напряжений, тем больше ток.

На практике следует учитывать и линию передачи. Снижение ёмкости и сопротивления дифференциальных линий также в определённой степени улучшает нагрузочную способность LVDS.

## 3. Поддержка платформ

| Платформа | LVDS0 | LVDS1 |
| --- | --- | --- |
| RK3568 | Y | Y |
| RK3567 | Y | Y |
| RK3566 | Y | N |
| RK3562 | Y | N |
| RK3368 | Y | N |
| RK3326 / PX30 | Y | N |
| RK3288 | Y | Y |
| RK3128 | Y | N |
| RK3126 | Y | N |

## 4. Обзор сценариев

Варианты применения LVDS сведены в таблицу:

| № | Панелей | Интерфейсы LVDS | Распределение Video Port | Максимальное разрешение | Описание | Пример конфигурации |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | LVDS0 / LVDS1 | VP1 → LVDS0/1; VP2 → LVDS0/1 | 1280x800 | Одноканальная панель LVDS | rk3567-evb2-lp4x-v10-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-single-channel-lvds.dts |
| 2 | 1 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1920x1080 | Dual LVDS, двухканальный LVDS | rk3567-evb2-lp4x-v10-dual-channel-lvds.dts |
| 3 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP2 → LVDS1; VP2 → LVDS0, VP1 → LVDS1 | 1280x800 на панель | Два VP, каждый с одной одноканальной панелью LVDS | rk3567-evb2-lp4x-v10-two-vp-two-separate-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-two-vp-two-separate-single-channel-lvds.dts |
| 4 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0, VP1 → LVDS0; VP2 → LVDS0, VP2 → LVDS0 | 1280x800 на панель | Один VP с двумя одноканальными панелями, каждая показывает половину содержимого VP | rk3567-evb2-lp4x-v10-one-vp-two-single-channel-lvds.dts<br>rk3568-evb1-ddr4-v10-one-vp-two-single-channel-lvds.dts |
| 5 | 2 | LVDS0 + LVDS1 | VP1 → LVDS0 + LVDS1; VP2 → LVDS0 + LVDS1 | 1280x800 на панель | Один VP с двумя одноканальными панелями, обе показывают одинаковое содержимое (connector mirror) | См. соответствующий раздел статьи |

Результат работы этих пяти вариантов показан на следующем рисунке:

![Технический рисунок исходника — PDF 9](/docs/rockchip-lvds/assets/en-p9-X66.jpg)

Для RK356X связь между Video Port и LVDS показана ниже:

![Технический рисунок исходника — PDF 10](/docs/rockchip-lvds/assets/en-p10-X69.jpg)

## 5. Примеры конфигурации LVDS

В этом разделе приведены конфигурации разных вариантов LVDS. Несмотря на множество сочетаний выходов, достаточно определить два условия:

Используется ли двухканальный режим Dual LVDS.

Какому VP соответствует фактический выход LVDS.

Для Dual LVDS необходимо включить оба узла LVDS и добавить свойство dual-channel в узел LVDS0.

```text
&lvds0 {
   status = "okay";

   dual-channel;
};
```

Также необходимо определить соответствующий VP. В режиме Dual LVDS оба выхода LVDS0 и LVDS1 используют либо VP1, либо VP2. В остальных случаях конфигурация зависит от сценария:

```text
/*
 * Example 1: Two VPs are respectively connected to a single-channel LVDS panel

 * VP1 -> LVDS0, VP2 -> LVDS1
 */
&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};

/*
 * Example 2: Two VPs are respectively connected to a single-channel LVDS panel (in reverse
order)

 * VP2 -> LVDS0, VP1 -> LVDS1
 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.1 Одноканальный LVDS

Для настройки одноканального LVDS уточните:

Временные параметры панели, формат вывода, вывод Enable и вывод ШИМ подсветки.

Используется выход LVDS0 или LVDS1.

LVDS получает данные от VP1 или VP2.

Для одноканального LVDS на RK356X существуют четыре сочетания LVDS и VP, показанные ниже:

![Технический рисунок исходника — PDF 12](/docs/rockchip-lvds/assets/en-p12-X81.png)

На примере VP1 → LVDS0 настройка DTS выполняется следующим образом:

1\. Настройте узел panel: временные параметры, формат, выводы Enable и подсветки; свяжите панель с узлом LVDS:

```text
panel {
   compatible = "simple-panel";

   backlight = <&backlight>;
   power-supply = <&vcc3v3_lcd0_n>;
   enable-delay-ms = <20>;
   prepare-delay-ms = <20>;
   unprepare-delay-ms = <20>;
   disable-delay-ms = <20>;
   bus-format = <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG>;
   width-mm = <217>;
   height-mm = <136>;

   display-timings {
      native-mode = <&timing0>;
      timing0: timing0 {

         clock-frequency = <67000000>;
         hactive = <800>;
         vactive = <1280>;
         hback-porch = <60>;
         hfront-porch = <60>;

         vback-porch = <4>;
         vfront-porch = <2>;
         hsync-len = <8>;
         vsync-len = <8>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };

   ports {

      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;
         };
      };
   };
};
```

2\. Включите соответствующий узел LVDS и свяжите его с узлом panel:

```text
&lvds0 {
   status = "okay";
   ports {

      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

3\. Укажите VP, используемый для вывода LVDS:

```text
&lvds0_in_vp1 {
   status = "okay";

 };
```

### 5.2 Dual LVDS (двухканальный LVDS)

Конфигурация этого раздела относится к RK356X.

1\. Добавьте dual-channel в узел lvds для LVDS0, чтобы включить Dual LVDS.

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Задайте распределение Video Port. Для Dual LVDS на RK356X можно выбрать VP1 или VP2. Все варианты показаны на рисунке.

![Технический рисунок исходника — PDF 14](/docs/rockchip-lvds/assets/en-p14-X88.png)

Следующий пример использует VP1, то есть вариант 1 на рисунке:

```text
&lvds0_in_vp1 {
   status = "okay";
};


&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. Задайте порядок вывода каналов LVDS:

```text
panel {
   /* ... Relevant panel parameters are filled in here */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-odd-pixels; /* Output odd pixels */
         panel_in_lvds0: endpoint {
           remote-endpoint = <&lvds0_out_panel>;
         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-even-pixels; /* Output even pixels */

         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

Здесь LVDS0 выводит нечётные пиксели (dual-lvds-odd-pixels), а LVDS1 — чётные (dual-lvds-even-pixels). При необходимости порядок можно поменять.

### 5.3 Dual LVDS (двухканальный LVDS) на RK3288

Этот раздел относится к RK3288.

1\. Добавьте dual-channel в узел lvds, чтобы включить Dual LVDS.

```text
&lvds {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Укажите VOP для вывода LVDS: vopb или vopl.

```text
/* Output on vopb */
&lvds_in_vopb {

   status = "okay";
};

/* Or, output on vopl */
&lvds_in_vopl {
   status = "okay";
}
```

3\. Задайте порядок вывода каналов. На RK3288 свойство rockchip,data-swap в узле lvds меняет порядок каналов:

```text
&lvds {
   rockchip,data-swap;

};
```

### 5.4 Два VP и две независимые одноканальные панели LVDS

Каждый одноканальный LVDS настраивается по правилам одноканального вывода.

Не задавайте dual-channel: иначе система распознает конфигурацию как Dual LVDS.

Необходимо указать распределение Video Port. Возможны два варианта:

![Технический рисунок исходника — PDF 17](/docs/rockchip-lvds/assets/en-p17-X100.png)

Следующие примеры DTS соответствуют вариантам 1 и 2 на рисунке:

```text
/*
 * VP1 -> LVDS0, VP2 -> LVDS1

 */
&lvds0_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "okay";
};

/*
 * Or, VP2 -> LVDS0, VP1 -> LVDS1
 */
&lvds0_in_vp2 {

   status = "okay";
};

&lvds1_in_vp1 {
   status = "okay";
};
```

### 5.5 Один VP и две одноканальные панели LVDS

Один VP подключается к двум одноканальным панелям LVDS; каждая показывает половину содержимого VP.

Сейчас этот сценарий реализован как расширение Dual LVDS, поэтому конфигурация похожа:

1\. Добавьте dual-channel в узел lvds для LVDS0.

```text
&lvds0 {
   status = "okay";
   dual-channel;


   ports {
      port@1 {
         reg = <1>;
         lvds0_out_panel: endpoint {
           remote-endpoint = <&panel_in_lvds0>;
         };
      };
   };
};
```

2\. Задайте распределение Video Port. На RK356X один VP с двумя одноканальными панелями LVDS может использовать VP1 или VP2. Возможные варианты показаны ниже.

![Технический рисунок исходника — PDF 19](/docs/rockchip-lvds/assets/en-p19-X106.png)

Следующий пример использует VP1, то есть вариант 1 на рисунке:

```text
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

&lvds1_in_vp2 {
   status = "disabled";
};
```

3\. Задайте порядок вывода каналов LVDS:

```text
panel {
   /*... Relevant panel parameters are filled in here */


   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         dual-lvds-left-pixels; /* Output the left-half content */
         panel_in_lvds0: endpoint {

           remote-endpoint = <&lvds0_out_panel>;
         };
      };
      port@1 {
         reg = <1>;
         dual-lvds-right-pixels; /* Output the right-half content */
         panel_in_lvds1: endpoint {
           remote-endpoint = <&lvds1_out_panel>;
         };
      };
   };
};
```

Для различения порядка вывода дополнительно определены свойства dual-lvds-left-pixels и dual-lvds-right-pixels. При необходимости их можно поменять.

### 5.6 Один VP и две одноканальные панели LVDS (Connector Mirror)

Один VP подключается к двум одноканальным панелям LVDS с одинаковыми временными параметрами; они показывают полностью одинаковое изображение.

Временные параметры каждой панели настраиваются как для одноканального LVDS.

Для распределения Video Port и LVDS можно выбрать вывод от VP1 или VP2:

![Технический рисунок исходника — PDF 21](/docs/rockchip-lvds/assets/en-p21-X112.png)

```text
/* Output using VP1 */
&lvds0_in_vp1 {
   status = "okay";

};

&lvds1_in_vp1 {
   status = "okay";
};

/* Or, output using VP2 */
&lvds0_in_vp2 {
   status = "okay";
};

&lvds1_in_vp2 {

   status = "okay";
};
```

## 6. Отладка LVDS

Текущие сведения о LVDS Connector можно получить через узел summary VOP:

```text
cat /sys/kernel/debug/dri/0/summary
```

Если Dual LVDS включён и драйвер успешно загружен, появится узел Connector с именем LVDS-DUAL:

![Технический рисунок исходника — PDF 22](/docs/rockchip-lvds/assets/en-p22-X115.jpg)

В сценарии с одним VP и двумя одноканальными панелями, каждая из которых показывает половину содержимого VP, также отображается LVDS-DUAL.

При использовании двух одноканальных панелей видны разные узлы LVDS Connector:

![Технический рисунок исходника — PDF 23](/docs/rockchip-lvds/assets/en-p23-X120.jpg)

Привязка LVDS Connector к VP зависит от конкретной конфигурации.

## 7. Частые вопросы

### 7.1 Нет вывода по каналу LVDS1

Сначала проверьте summary VOP и убедитесь, что LVDS1 включён правильно. Если вывода по-прежнему нет, попробуйте обновить Loader.

### 7.2 Искажённое или зубчатое изображение в Dual LVDS

Возможно, LVDS0 и LVDS1 поменяны местами. Попробуйте переставить свойства dual-lvds-odd-pixels и dual-lvds-even-pixels в DTS.

### 7.3 Чёрное или белое изображение

Проверьте аппаратное подключение и правильность сигналов подсветки и Enable.

### 7.4 Изменение синфазного и дифференциального напряжения LVDS

На RK356X измените свойства DTS соответствующего PHY:

inno,lvds-vcom задаёт синфазное напряжение, inno,lvds-vod — дифференциальное.

Синфазное напряжение RK356X:

- 1000 mV

- 950 mV (по умолчанию)

- 900 mV

- 850 mV

Дифференциальное напряжение RK356X:

- 400 mV

- 350 mV (по умолчанию)

- 300 mV

- 250 mV

```text
&video_phy0 {
      inno,lvds-vcom = <1000>; /* 1000mV */
      inno,lvds-vod = <400>; /* 400mV */

};
```

{% endraw %}

