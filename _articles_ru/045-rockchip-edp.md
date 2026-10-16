---
title: "Полное руководство Rockchip eDP: панели, обучение линии, PSR и отладка сигналов"
description: "Полное описание eDP: архитектура, DTS, тайминги EDID, PSR, два канала, команды отладки и патчи диагностики AUX/Link Training."
translation_key: "045-rockchip-edp"
slug: "045-rockchip-edp"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["eDP", "RK3288", "RK3399", "RK3568", "RK3588", "RK3576", "PSR"]
keywords: "ArmSoM Rockchip eDP Panel Link Training PSR RK3576 RK3588"
excerpt: "Полное описание eDP: архитектура, DTS, тайминги EDID, PSR, два канала, команды отладки и патчи диагностики AUX/Link Training."
---

{% raw %}

# Полное руководство Rockchip eDP: панели, обучение линии, PSR и отладка сигналов

Это справочное руководство Rockchip eDP. Таблица оригинала указывает RK3288/RK3399 с Linux kernel 4.4 и новее, RK356x с 4.19 и новее, RK3588 с 5.10 и новее, RK3576 с 6.1 и новее. В проекте ArmSoM необходимо проверить SoC платы, доступность eDP, питание и подсветку панели, разводку HPD/PHY, SDK/BSP и патчи ядра. Возможности SoC не означают поддержку на любой плате. Проверка на оборудовании ArmSoM не проводилась; значение экономии PSR 470mW, журналы и фотографии взяты из оригинала, а не измерены на ArmSoM.

Источник: Rockchip eDP Interface Developer Guide, V2.3.0 в обеих языковых версиях. Китайская статья основана на китайском оригинале, английская и русская — на английском с сохранением тех же технических разделов. Китайские рисунки взяты из китайского PDF, английские и русские — из английского. Противоречия оригинала, включая таблицу скоростей RK3399 и вывод примера полосы, отмечены; адреса и константы не исправляются предположительно.

[Редакционная проверка](/docs/rockchip-edp/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Обзор

В документе описаны основные возможности, рабочий процесс и анализ типичных неисправностей интерфейса eDP процессоров Rockchip. Цель — помочь инженерам понять структуру драйвера отображения и аппаратный интерфейс eDP платформы Rockchip, а также быстро локализовать, оптимизировать и устранять проблемы на основе типовых случаев.

## 2. Основы eDP

### 2.1 Подсистема отображения DRM

Взаимодействие приложений с драйвером DRM через libdrm происходит следующим образом:

![Техническая иллюстрация из оригинала (EN, 6)](/docs/rockchip-edp/assets/en-p6-1.png)

### 2.2 Системная структура интерфейса eDP

Типовая структурная схема применения eDP:

![Техническая иллюстрация из оригинала (EN, 7)](/docs/rockchip-edp/assets/en-p7-1.png)

Протокол eDP расширяет DP (Display Port) для встраиваемых приложений и широко применяется в ноутбуках, планшетах и мобильных телефонах.

Аппаратный интерфейс eDP состоит главным образом из Main-Link, AUX CH и HPD; вместе они обеспечивают взаимодействие устройств Source и Sink.

Main-Link: 1/2/4 пары дифференциальных сигналов для передачи потоков видео и аудио.

eDP v1.3 поддерживает RBR 1.62G/HBR 2.7G/HBR2 5.4G bps/lane. В eDP v1.4 добавлены четыре рекомендуемые скорости: R216 2.16G/R243 2.43G/R324 3.24G/R432 4.32G bps/lane.

AUX CH: полудуплексная дифференциальная пара для обмена конфигурацией между Source и Sink, включая чтение/запись DPCD и разбор EDID; скорость передачи — 1 Mbps.

HPD: на стороне Source обычно это один контакт обнаружения горячего подключения, используемый для определения состояния Sink и обработки его запросов HPD IRQ; в английском оригинале встречается опечатка HDP.

При переходе Sink из отключённого состояния в подключённое уровень HPD должен измениться с низкого на высокий.

HPD отражает рабочее состояние Sink. Высокий уровень обычно означает готовность к нормальному отображению. При проектировании аппаратуры рекомендуется соединить контакты HPD Source и Sink.

### 2.3 Обучение линии eDP

![Техническая иллюстрация из оригинала (EN, 8)](/docs/rockchip-edp/assets/en-p8-1.png)

Процесс Link Training на схеме выше:

1: После подачи питания Sink отправляет Source импульс HPD Plug.

2–3: Source читает DPCD Sink, определяя поддерживаемые функции.

4–5: Source читает EDID Sink, определяя поддерживаемые тайминги отображения.

6: Source записывает конфигурацию линии в DPCD, например MAX_LINK_RATE и MAX_LANE_COUNT.

7: Source запускает Link Training, а Sink выполняет Clock Recovery и Equalization.

8–9: Source читает Link Status из DPCD для определения результата обучения. При неудаче процесс возвращается к шагу 7.

10: После успешного обучения Source отправляет MSA, а Sink разбирает конфигурацию видеопотока и восстанавливает Stream Clock.

11: Source передаёт поток видеоданных.

## 3. eDP на платформах Rockchip

### 3.1 Функциональные возможности

| Функция | RK3288 | RK3399 | RK3568 | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- |
| Версия eDP | v1.3 | v1.3 | v1.3 | v1.3 | v1.3 |
| Режим DP | Не поддерживается | Не поддерживается | Не поддерживается | v1.2 | v1.2 |
| Максимальное разрешение | 2560x1600@60Hz | 2560x1600@60Hz | 2560x1600@60Hz | 3840x2160@60Hz | 3840x2160@60Hz |
| Линии Main-Link | 1/2/4 lanes | 1/2/4 lanes | 1/2/4 lanes | 1/2/4 lanes | 1/2/4 lanes |
| Скорость Main-Link | 2.7/1.62 Gbps/lane | 2.7/1.62 Gbps/lane | 2.7/1.62 Gbps/lane | 5.4/4.32/3.24/2.7/2.43/2.16/1.62 Gbps/lane | 5.4/4.32/3.24/2.7/2.43/2.16/1.62 Gbps/lane |
| AUX_CH | 1 M | 1 M | 1 M | 1 M | 1 M |
| Цветовой формат | RGB | RGB | RGB | RGB/YUV444/YUV422 | RGB/YUV444/YUV422 |
| Глубина цвета | 8 bpc | 8 bpc | 8 bpc | 8/10 bpc (6 bpc только для RGB) | 8/10 бит (6 bpc только для RGB) |
| ASSR | Поддерживается | Поддерживается | Поддерживается | Поддерживается | Поддерживается |
| I2S | Не поддерживается | Не поддерживается | Не поддерживается | Поддерживается | Поддерживается |
| SPDIF | Не поддерживается | Не поддерживается | Не поддерживается | Поддерживается | Поддерживается |
| PSR | Не поддерживается | Не поддерживается | Не поддерживается | Поддерживается | Поддерживается |
| Разделение изображения | Не поддерживается | Не поддерживается | Не поддерживается | Поддерживается | Поддерживается |

### 3.2 Соединение eDP с VOP

Подробности см. в разделе «Тракты отображения платформы VOP2» документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.

### 3.3 Файлы драйверов

Драйверы U-Boot:

```text
/* Controller */
drivers/video/drm/analogix_dp.c
drivers/video/drm/analogix_dp.h

drivers/video/drm/analogix_dp_reg.c

/* PHY */
/* RK3568 */
drivers/phy/phy-rockchip-naneng-edp.c
/* RK3588/RK3576 */
drivers/phy/phy-rockchip-samsung-hdptx.c

/* Panel */
drivers/video/drm/rockchip_panel.c
```

Драйверы ядра:

```text
/* Controller */
drivers/gpu/drm/bridge/analogix/analogix_dp_core.c

drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
drivers/gpu/drm/bridge/analogix/analogix_dp_reg.h
drivers/gpu/drm/rockchip/analogix_dp-rockchip.c
include/drm/bridge/analogix_dp.h

/* PHY */
/* RK3568 */
drivers/phy/rockchip/phy-rockchip-naneng-edp.c
/* RK3588/RK3576 */
drivers/phy/rockchip/phy-rockchip-samsung-hdptx.c

/* Panel */

drivers/gpu/drm/panel/panel-simple.c
```

Для eDP PHY RK3288/RK3399 отдельного драйвера нет: настройка PHY включена в драйвер контроллера Analogix DP.

## 4. Программная конфигурация

### 4.1 Включение модуля

#### 4.1.1 Настройка DTS контроллера

Конфигурация DTS контроллера eDP зависит от подключённого устройства: Panel (панель) или Monitor (монитор). Далее используется пример выхода eDP0 платформы RK3588.

4.1.1.1 Настройка HPD

Хотя в протоколе eDP HPD является необязательным, его уровень важен для определения рабочего состояния Sink. Поддержку HPD рекомендуется предусмотреть при проектировании аппаратуры.

При неисправности панели HPD может уведомить основной контроллер и помочь избежать проблем.

Настройка HPD уменьшает число ошибок отображения из-за неверной последовательности включения, включая ошибки AUX и Link Training.

Если аппаратура не поддерживает HPD, необходимо включить Force HPD. При использовании HPD платформа Rockchip поддерживает Function Pin HPD и GPIO HPD.

Force HPD:

```text
&edp0 {
 force-hpd;
};
```

Function Pin HPD:

```text
&edp0 {
 pinctrl-names = "default";
 pinctrl-0 = <&hdmim0_tx0_hpd>;

};
```

Конфигурации pinctrl специализированных контактов HPD для разных платформ приведены ниже; их необходимо проверить по схеме платы.

|  | Конфигурация pinctrl |
| --- | --- |
| RK3288 | edp_hpd (GPIO7_B3) |
| RK3399 | edp_hpd (GPIO4_C7) |
| RK3568 | edpdpm0_pins (GPIO4_C4) \| edpdpm1_pins (GPIO0_C2) |
| RK3588 | hdmim0_tx0_hpd (GPIO1_A5) \| hdmim0_tx1_hpd (GPIO1_A6) \| hdmim1_tx0_hpd (GPIO3_D4) \| hdmim1_tx1_hpd (GPIO3_B7) |
| RK3576 | edp_txm0_pins (GPIO4_C1) \| edp_txm1_pins (GPIO0_B6) |

GPIO HPD:

Для функции HPD можно выбрать любой подходящий GPIO.

```text
&edp0 {
 pinctrl-names = "default";
 pinctrl-0 = <&edp0_hpd>;

 hpd-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_HIGH>;
};

&pinctrl {
 edp {
   edp0_hpd: edp0-hpd {
    rockchip,pins = <1 RK_PA5 0 &pcfg_pull_none>;
   };
 };
};
```

Если при отсутствии кабеля между Source и Sink драйвер ошибочно определяет состояние Connected, настройте подтяжку соответствующего GPIO вниз для повышения стабильности.

```text
&pinctrl {
 edp {
   edp0_hpd: edp0-hpd {

    rockchip,pins = <1 RK_PA5 0 &pcfg_pull_down>;
   };
 };
};
```

4.1.1.2 Подключение панели

```text
&edp0 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&hdmim0_tx0_hpd>;

   ports {
      port@1 {
         reg = <1>;

         edp_out_panel: endpoint {
           remote-endpoint = <&panel_in_edp>;
         };
      };
   };
};
```

4.1.1.3 Подключение монитора

Интерфейс eDP RK3588/RK3576 поддерживает режим DP. Для работы как DP необходимо настроить HPD, как описано в разделе настройки HPD DTS.

Пример DTS: arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-hdmi2dp.dts. Название связано с тем, что HDMI и eDP используют комбинированный PHY: на этой плате разъём HDMI заменён на DP для использования eDP в качестве DP.

```text
&edp1 {
   pinctrl-names = "default";
   pinctrl-0 = <&hdmim0_tx1_hpd>;

   status = "okay";
};
```

#### 4.1.2 Настройка DTS PHY

Для RK3568/RK3588/RK3576 требуется настройка PHY в DTS; для RK3288/RK3399 она не нужна.

```text
/* RK3568 */
&edp_phy {
      status = "okay";

};

/* RK3588/RK3576 */
&hdptxphy0 {
     status = "okay";
};

&hdptxphy_hdmi0 {
     status = "disabled";
};
```

В RK3588 и RK3576 eDP и HDMI используют комбинированный PHY. При использовании eDP убедитесь, что соответствующие узлы HDMI PHY hdptxphy_hdmi0/hdptxphy_hdmi1 отключены.

В RK3588/RK3576 eDP PHY позволяет задать Link Training Table вместо значений по умолчанию для оптимизации качества сигнала и параметров глазковой диаграммы.

```text
&hdptxphy0 {
      /* Single Vdiff Training Table (optional) */
      training-table = /bits/ 8 <

         /* voltage swing 0, pre-emphasis 0->3 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         /* voltage swing 1, pre-emphasis 0->2 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04
         /* voltage swing 2, pre-emphasis 0->1 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
         0x0d 0x0a 0x04 0x06 0x00 0x04

         /* voltage swing 3, pre-emphasis 0 */
         0x0d 0x0a 0x04 0x06 0x00 0x04
      >;
      status = "okay";
};
```

eDP RK3588/RK3576 поддерживает перестановку дифференциальных сигналов P/N линий. Это применимо при обратном соединении P/N между Source и Sink. Пример конфигурации:

```text
&hdptxphy0 {
      /* swap lane1 P/N */

      lane-polarity-invert = <0 1 0 0>;
      status = "okay";
};
```

#### 4.1.3 Настройка DTS панели

При подключении панели тайминги eDP передаются через драйвер Panel. На платформах Rockchip используется drivers/gpu/drm/panel/panel-simple.c.

Для Kernel-5.10 и новее см. Documentation/devicetree/bindings/display/panel/panel-simple.yaml.

Для Kernel-4.19 и старее см. Documentation/devicetree/bindings/display/panel/simple-panel.txt.

Для нормального отображения eDP требуется корректный Panel Timing. Сведения о таймингах см. в разделе описания развёртки документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

Способы получения Panel Timing:

- Чтение EDID — рекомендуемый способ.

- Таблица Signal Timing Specifications в документации панели.

- Запрос таймингов у изготовителя панели.

Примечание: EDID некоторых панелей повреждён и не читается; в этом случае используйте другой способ получения таймингов.

Доступны два варианта настройки DTS:

- Не задавать узел Timing, считывать тайминги из EDID — рекомендуемая конфигурация.

- Задать узел Timing и выводить изображение с фиксированными таймингами.

Требования HPD и задержек:

- При отсутствии узла Timing необходимо подключить HPD аппаратно, чтобы избежать проблем последовательности включения.

- При заданном узле Timing также рекомендуется подключить HPD.

- Если HPD не подключён, настройте prepare-delay-ms — интервал от подачи VCC до первого доступа AUX — в соответствии с требованиями включения панели.

4.1.3.1 DTS с получением таймингов из EDID

Пример для RK3588S EVB1: DTS Kernel-6.1 находится в arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi.

```text
panel-edp {
   compatible = "simple-panel";
   backlight = <&backlight>;

   power-supply = <&vcc3v3_lcd_edp>;
   prepare-delay-ms = <120>;
   enable-delay-ms = <120>;
   unprepare-delay-ms = <120>;
   disable-delay-ms = <120>;
   width-mm = <120>;
   height-mm = <160>;

   port {
      panel_in_edp: endpoint {
         remote-endpoint = <&edp_out_panel>;
      };
   };

};
```

Настройку pwms узла backlight необходимо изменить по реальным соединениям. Перед выводом изображения убедитесь, что подсветка включается правильно.

Подробности см. в руководстве PWM Rockchip_Developer_Guide_Linux_PWM_CN.

power-supply задаёт источник питания панели.

При ошибках Sink распространённый способ сброса — принудительное отключение и включение питания панели или моста. Основной контроллер должен иметь возможность управлять питанием панели.

enable-gpios/reset-gpios задают контакты включения/сброса панели. Измените их в соответствии со схемой платы.

Необязательно: enable обычно включает питание панели; настройка GPIO зависит от схемы питания.

Необязательно: reset обычно выведен непосредственно с панели; условия сброса указаны в её документации. Настройка GPIO зависит от схемы сброса.

Значения delay-ms должны соответствовать временным требованиям включения, отключения и сброса из документации панели.

Необязательно: enable-delay-ms/disable-delay-ms задают задержку после включения либо перед отключением контакта enable.

Необязательно: reset-delay-ms задаёт задержку после активации контакта reset.

Необязательно: prepare-delay-ms/unprepare-delay-ms задают задержку после включения либо перед отключением power-supply.

Следующее описание delay-ms взято из Documentation/devicetree/bindings/display/panel/panel-simple.yaml:

```text
......
 prepare-delay-ms:
   description: |

    the time (in milliseconds) that it takes for the panel to
    become ready and start receiving video data
 enable-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    display the first valid frame after starting to receive
    video data
 disable-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    turn the display off (no content is visible)
 unprepare-delay-ms:

   description: |
    the time (in milliseconds) that it takes for the panel
    to power itself down completely
 reset-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    reset itself completely
 init-delay-ms:
   description: |
    the time (in milliseconds) that it takes for the panel to
    send init command sequence after reset deassert
......
```

4.1.3.2 DTS с фиксированными таймингами

Преимущества фиксированного Panel Timing в DTS:

- Интерфейс больше не читает EDID, что исключает ошибки его чтения.

- Параметры таймингов можно изменять по требованиям, включая выравнивание пикселей и особенности деления частоты.

Недостатки фиксированного Panel Timing:

- Несоответствие таймингов требованиям панели вызывает ошибку обучения линии или некорректное изображение.

Фиксированные тайминги DTS могут применяться для панелей с повреждённым EDID, особыми частотами или необходимостью коррекции параметров развёртки.

Структура display_timing и её поля описаны в include/video/display_timing.h подсистемы DRM. Пример:

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
 * Video ______________________XXXXXXXXXXXXXXXXXXXXXXX____________________
 *  |<- sync ->|<- back ->|<----- active ----->|<- front ->|<- sync..
 *  |    |  porch |        |  porch |
 *
 * HSync _|¯¯¯¯¯¯¯¯¯¯¯|___________________________________________|¯¯¯¯¯¯¯¯¯
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

Расчёт основных параметров таймингов:

`htotal = hsync_len + hback_porch + hactive + hfront_porch`

`hsync_start = hfront_porch + hactive`

`hsync_end = htotal - hback_porch = hsync_len + hactive + hfront_porch`

`vtotal = vsync_len + vback_porch + vactive + vfront_porch`

`vsync_start = vfront_porch + vactive`

`vsync_end = vtotal - vback_porch = vsync_len + vactive + vfront_porch`

Полученные тайминги задаются в узле Panel. DRM распознаёт их и заполняет структуру display_timing. Пример конфигурации:

```text
panel-edp {
   compatible = "simple-panel";
   backlight = <&backlight>;
   power-supply = <&vcc3v3_lcd_edp>;

   prepare-delay-ms = <120>;
   enable-delay-ms = <120>;
   unprepare-delay-ms = <120>;
   disable-delay-ms = <120>;
   width-mm = <120>;
   height-mm = <160>;

   panel-timing {
      clock-frequency = <200000000>;
      hactive = <1536>;
      vactive = <2048>;
      hfront-porch = <12>;

      hsync-len = <16>;
      hback-porch = <48>;
      vfront-porch = <8>;
      vsync-len = <4>;
      vback-porch = <8>;
      hsync-active = <0>;
      vsync-active = <0>;
      de-active = <0>;
      pixelclk-active = <0>;
   };

   port {
      panel_in_edp: endpoint {

         remote-endpoint = <&edp_out_panel>;
      };
   };
};
```

clock-frequency определяет частоту кадров на выходе VOP. Для расчёта нужны параметры DRM htotal и vtotal.

Для особых значений clock-frequency, которые не удаётся получить делением, оригинал предлагает для проверки обнулить младшие разряды, оставив значение с точностью до целых MHz.

Расчёт частоты кадров реализован в drm_mode_vrefresh() файла drivers/gpu/drm/drm_modes.c. Если обозначить частоту кадров fr, формула имеет вид:

```text
fr = clock / (htotal * vtotal)
```

```text
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

hsync-active/vsync-active/de-active/pixelclk-active задают полярности сигналов hsync/vsync/den и pixelclk; макросы описаны ниже в display_flags.

`hsync-active = <0>;` означает DISPLAY_FLAGS_HSYNC_LOW — активный низкий уровень HSYNC; иначе DISPLAY_FLAGS_HSYNC_HIGH — активный высокий.

`vsync-active = <0>;` означает DISPLAY_FLAGS_VSYNC_LOW — активный низкий уровень VSYNC; иначе DISPLAY_FLAGS_VSYNC_HIGH — активный высокий.

`de-active = <0>;`

Это означает DISPLAY_FLAGS_DE_LOW — активный низкий уровень DEN; иначе DISPLAY_FLAGS_DE_HIGH — активный высокий.

`pixelclk-active = <0>;` означает DISPLAY_FLAGS_PIXDATA_NEGEDGE — данные действительны по спаду Clock; иначе DISPLAY_FLAGS_PIXDATA_POSEDGE — по фронту Clock.

4.1.3.2.1 Восстановление таймингов по EDID

Если в узле Panel DTS нет Timing (см. пример EDID в §4.1.3.1), по умолчанию EDID панели читается через AUX.

После подключения дисплея в последовательном журнале U-Boot выводится:

```text
#Old version code prints other EDID information
Maximum visible display size: 26 cm x 17 cm
Power management features: no active off, no suspend, no standby

Established timings:
Standard timings:
2400x1600 59 Hz (detailed)
Monitor name: LQ123P1JX31
Detailed mode clock 252750 kHz, flags[a]
H: 2400 2448 2480 2560
V: 1600 1603 1613 1646
bus_format: 1009
```

```text
#New version does not print other EDID information
edp@fded0000: detailed mode clock 148500 kHz, flags[5]
   H: 1920 2008 2052 2200

   V: 1080 1084 1089 1125
bus_format: 100a
```

Убедитесь, что в журнале U-Boot отсутствует следующее сообщение. Его наличие означает, что узел Panel в DTS всё ещё содержит Timing, поэтому EDID не читается:

```text
Using display timing dts
```

Из приведённой информации получаем:

`clock-frequency = 252750 kHz`

`hactive = 2400 hsync_start = 2448 hsync_end = 2480 htotal = 2560`

`vactive = 1600 vsync_start = 1603 vsync_end = 1613 vtotal = 1646`

`flags = 0xa`

Это соответствует hsync-active/vsync-active/de-active/pixelclk-active и другим display_flags узла Timing.

Определения display_flags находятся в include/video/display_timing.h:

```text
enum display_flags {
   DISPLAY_FLAGS_HSYNC_LOW = BIT(0),
   DISPLAY_FLAGS_HSYNC_HIGH = BIT(1),

   DISPLAY_FLAGS_VSYNC_LOW = BIT(2),
   DISPLAY_FLAGS_VSYNC_HIGH = BIT(3),

   /* data enable flag */
   DISPLAY_FLAGS_DE_LOW = BIT(4),
   DISPLAY_FLAGS_DE_HIGH = BIT(5),
   /* drive data on pos. edge */
   DISPLAY_FLAGS_PIXDATA_POSEDGE = BIT(6),
   /* drive data on neg. edge */
   DISPLAY_FLAGS_PIXDATA_NEGEDGE = BIT(7),
   DISPLAY_FLAGS_INTERLACED = BIT(8),
   DISPLAY_FLAGS_DOUBLESCAN = BIT(9),
   DISPLAY_FLAGS_DOUBLECLK = BIT(10),
   /* drive sync on pos. edge */
   DISPLAY_FLAGS_SYNC_POSEDGE = BIT(11),

   /* drive sync on neg. edge */
   DISPLAY_FLAGS_SYNC_NEGEDGE = BIT(12),
};
```

`bus_format = 1009`

Это текущий цветовой формат; подробности в include/uapi/linux/media-bus-format.h.

```text
/* RGB - next is 0x1024 */
#define MEDIA_BUS_FMT_RGB444_1X12 0x1016

#define MEDIA_BUS_FMT_RGB444_2X8_PADHI_BE 0x1001
#define MEDIA_BUS_FMT_RGB444_2X8_PADHI_LE 0x1002
#define MEDIA_BUS_FMT_RGB555_2X8_PADHI_BE 0x1003
#define MEDIA_BUS_FMT_RGB555_2X8_PADHI_LE 0x1004
#define MEDIA_BUS_FMT_RGB565_1X16 0x1017
#define MEDIA_BUS_FMT_BGR565_2X8_BE 0x1005
#define MEDIA_BUS_FMT_BGR565_2X8_LE 0x1006
#define MEDIA_BUS_FMT_RGB565_2X8_BE 0x1007
#define MEDIA_BUS_FMT_RGB565_2X8_LE 0x1008
#define MEDIA_BUS_FMT_RGB666_1X18 0x1009
#define MEDIA_BUS_FMT_RBG888_1X24 0x100e
#define MEDIA_BUS_FMT_RGB666_1X24_CPADHI 0x1015
#define MEDIA_BUS_FMT_RGB666_1X7X3_SPWG 0x1010

#define MEDIA_BUS_FMT_BGR888_1X24 0x1013
#define MEDIA_BUS_FMT_BGR888_3X8 0x101b
#define MEDIA_BUS_FMT_GBR888_1X24 0x1014
#define MEDIA_BUS_FMT_RGB888_1X24 0x100a
#define MEDIA_BUS_FMT_RGB888_2X12_BE 0x100b
#define MEDIA_BUS_FMT_RGB888_2X12_LE 0x100c
#define MEDIA_BUS_FMT_RGB888_3X8 0x101c
#define MEDIA_BUS_FMT_RGB888_3X8_DELTA 0x101d
#define MEDIA_BUS_FMT_RGB888_1X7X4_SPWG 0x1011
#define MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA 0x1012
```

4.1.3.2.2 Расчёт по документации панели

Следующий рисунок взят из документации панели lg,lp079qx1-sp0v, используемой в примере DTS:

![Техническая иллюстрация из оригинала (EN, 22)](/docs/rockchip-edp/assets/en-p22-1.png)

Редактируемая расшифровка таблицы таймингов выше (пустые примечания сохранены):

| Параметр | Описание | Символ | Мин. | Тип. | Макс. | Единица | Примечание |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DCLK | Частота | fCLK | - | 200.02 | - | MHz |  |
| Hsync | Активная область | tWHA | - | 1536 | - | tCLK |  |
| Hsync | Период | tHP | - | 1612 | - | tCLK |  |
| Hsync | Активная ширина | tWH | - | 16 | - | tCLK |  |
| Vsync | Активная область | tWVA | - | 2048 | - | tHP |  |
| Vsync | Период | tVP | - | 2068 | - | tHP |  |
| Vsync | Активная ширина | tWV | - | 4 | - | tHP |  |
| Data Enable | Задний горизонтальный интервал | tHBP | - | 48 | - | tCLK |  |
| Data Enable | Передний горизонтальный интервал | tHFP | - | 12 | - | tCLK |  |
| Data Enable | Задний вертикальный интервал | tVBP | - | 8 | - | tHP |  |
| Data Enable | Передний вертикальный интервал | tVFP | - | 8 | - | tHP |  |

При настройке по документации панели параметры можно уточнять в указанных минимальных и максимальных пределах с учётом задачи.

Рассчитанные параметры фиксируются в узле Panel Timing eDP, как описано выше, после чего вывод выполняется с заданными таймингами.

### 4.2 Настройка функций

#### 4.2.1 Самотестирование панели

Этот режим обычно применяется при отладке панели. Если обычное изображение некорректно, но самотестирование панели показывает нормальную картинку, Sink работает правильно и следует искать проблему на стороне Source. Подробности см. в разделе типичных неисправностей и методов анализа.

В примере RK3588S EVB1 arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi добавьте свойство panel-self-test в узел edp:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
index 8c1d0f37b8a3..e58dd8aae2ee 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -262,6 +262,7 @@ &dp0_sound{
 };

 &edp0 {
+     panel-self-test;
      force-hpd;
      status = "okay";
```

Для панели lg,lp079qx1-sp0v самотестирование переключает следующие два изображения:

![Техническая иллюстрация из оригинала (EN, 23)](/docs/rockchip-edp/assets/en-p23-1.png)

![Техническая иллюстрация из оригинала (EN, 24)](/docs/rockchip-edp/assets/en-p24-1.png)

#### 4.2.2 Самотестирование контроллера

Режим обычно используется при отладке панели. Если обычное изображение некорректно, но самотестирование контроллера работает нормально, тракт eDP Controller -> PHY -> Panel исправен. Анализ следует продолжить выше по тракту, то есть на VOP. См. Rockchip_Developer_Guide_DRM_Display_Driver_CN.

В примере RK3588S EVB1 arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi добавьте analogix,video-bist-enable в узел edp:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi

index 8c1d0f37b8a3..07a9de32f910 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -262,6 +262,7 @@ &dp0_sound{
 };

 &edp0 {
+     analogix,video-bist-enable;
      force-hpd;
      status = "okay";
```

По умолчанию самотестирование контроллера eDP выводит следующее изображение:

![Техническая иллюстрация из оригинала (EN, 25)](/docs/rockchip-edp/assets/en-p25-1.png)

#### 4.2.3 Режим PSR

PSR (Panel Self-Refresh), введённый в eDP v1.3, необязателен для Source и Sink. Для корректного включения его должны поддерживать обе стороны.

После включения PSR при статическом изображении, например неподвижном рабочем столе Android, модули VOP и eDP в тракте VOP -> eDP -> Panel автоматически переходят в состояние низкого энергопотребления. Оригинал приводит измерение для Kernel-6.1, DTS arch/arm64/boot/dts/rockchip/rk3576-evb1-v10-edp-NE160QAM-NX1.dts, одной панели NE160QAM-NX1 через eDP и статического рабочего стола: среднее снижение потребления системы около 470mW. Это измерение из документа Rockchip, не результат теста ArmSoM.

```text
commit 303b0de1b8fd9f33a8cbfa935e0885c53fe9f78c
Author: Damon Ding <damon.ding@rock-chips.com>

Date: Wed Jul 16 14:22:21 2025 +0800

   drm/bridge: analogix_dp: Add &analogix_dp_plat_data.disable_psr to check whether to
disable PSR

   First of all, since the PSR feature can help to reduce the power
   consumption, the Source device, which can support PSR function,
should enable PSR if the PSR capability of Sink device is detected
rather than depending on the user to add 'support-psr' DTS property
manually.


Different platforms that use the same Analogix DP bridge driver may
have different methods for parsing the PSR capability. Therefore, add
a new flag &analogix_dp_plat_data.disable_psr to disable PSR forcely,
which set in the platform side, should be more reasonable.

If the user truly does not want to enable PSR function or the Panel
has something wrong with it, the property 'rockchip,disable-psr' will
be helpful.

Fixes: 9622f2d0f10a ("drm/bridge: analogix_dp: disable PSR feature by default")
Change-Id: Id2fce34857df80de5a1ec97f342709a6e2840ed4

Signed-off-by: Damon Ding <damon.ding@rock-chips.com>
```

В ядре с указанным выше коммитом драйвер eDP проверяет поддержку PSR у Sink через регистр DPCD DP_PSR_SUPPORT по адресу 0x70. При поддержке Sink драйвер автоматически включает PSR на Source. Если DP_PSR_SUPPORT читается как 1, но PSR работает неправильно, уточните реальную поддержку у изготовителя панели. В качестве обходного решения PSR можно принудительно отключить свойством rockchip,disable-psr в узле edp дерева устройств.

```text
&edp {
   rockchip,disable-psr;

};
```

Без этого коммита PSR включается вручную свойством support-psr в узле edp:

```text
&edp {
   support-psr;
};
```

#### 4.2.4 Режим Connector-split

Функция Connector-split VOP2 похожа на MIPI Dual Channel Mode: выход одного Video Port делится по горизонтали пополам для двух одинаковых либо разных интерфейсов с совпадающими таймингами. Подробности см. в разделе Connector-split документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.

Пример Connector-split с двумя eDP:

1. Один VP управляет двумя панелями eDP с одинаковыми таймингами.

2. Панели показывают левую и правую половины изображения соответственно.

3. DRM регистрирует только один Connector; приложение видит лишь устройство eDP0.

![Техническая иллюстрация из оригинала (EN, 27)](/docs/rockchip-edp/assets/en-p27-1.png)

Пример DTS Kernel-6.1: arch/arm64/boot/dts/rockchip/rk3588-vehicle-serdes-display-v20.dtsi. Основные настройки:

Оба edp0 и edp1 должны выводиться с одного VP. В примере одновременно включены edp0_in_vp1 и edp1_in_vp1.

Интерфейсу левой половины Connector-split необходимо добавить свойство rockchip,split-mode.

```text
&edp0 {
   rockchip,split-mode;
   force-hpd;

   status = "okay";

   ports {
      port@1 {
         reg = <1>;

         edp0_out_i2c5_bu18tl82: endpoint {
           remote-endpoint = <&i2c5_bu18tl82_in_edp0>;
         };
      };
   };
};


&edp0_in_vp0 {
   status = "disabled";
};

&edp0_in_vp1 {
   status = "okay";
};

&edp0_in_vp2 {
   status = "disabled";
};


&edp1 {
   force-hpd;
   status = "okay";

   ports {
      port@1 {
         reg = <1>;

         edp1_out_i2c7_bu18tl82: endpoint {

           remote-endpoint = <&i2c7_bu18tl82_in_edp1>;
         };
      };
   };
};

&edp1_in_vp0 {
   status = "disabled";
};

&edp1_in_vp1 {
   status = "okay";

};

&edp1_in_vp2 {
   status = "disabled";
};
```

#### 4.2.5 Двухканальный режим

Connector-split обычно направляет выход одного VP на два экрана/монитора. Когда два одинаковых интерфейса управляют одной панелью, у левого интерфейса необходимо включить свойство rockchip,dual-channel.

![Техническая иллюстрация из оригинала (EN, 28)](/docs/rockchip-edp/assets/en-p28-1.png)

Dual-channel можно считать частным случаем Connector-split с общим механизмом реализации. Отличие: для левого connector задаются полные реальные тайминги VP, тогда как при split-mode задаётся половина реальных таймингов VP.

Пример: модуль панели M280DCA, eDP 8 lane, 3840x2160@144Hz. Требуемое документацией распределение данных:

| Область | Линия | Поток данных |
| --- | --- | --- |
| Слева | Lane 0 | Pixel 1,5,9, ...... ,1913,1917 |
|  | Lane 1 | Pixel 2,6,10, ...... ,1914,1918 |
|  | Lane 2 | Pixel 3,7,11, ...... ,1915,1919 |
|  | Lane 3 | Pixel 4,8,12, ...... ,1916,1920 |
| Справа | Lane 4 | Pixel 1921,1925,1929, ...... ,3833,3837 |
|  | Lane 5 | Pixel 1922,1926,1930, ...... ,3834,3838 |
|  | Lane 6 | Pixel 1923,1927,1931, ...... ,3835,3839 |
|  | Lane 7 | Pixel 1924,1928,1932, ...... ,3836,3840 |

RK3588 поддерживает 3840x2160@60Hz через один eDP с четырьмя линиями. Режим Dual-channel позволяет получить 3840x2160@144Hz через восемь линий. Пример: arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4-v10-edp-8lanes-M280DCA.dts. Основные настройки:

Оба edp0 и edp1 должны выводиться с одного VP: в примере одновременно включены edp0_in_vp0 и edp1_in_vp0.

Левому интерфейсу Dual-channel необходимо добавить rockchip,dual-channel.

```text
/ {
   panel-edp {
      compatible = "simple-panel";

      backlight = <&backlight>;
      power-supply = <&vcc3v3_edp>;
      enable-gpios = <&gpio4 RK_PC1 GPIO_ACTIVE_HIGH>;
      prepare-delay-ms = <120>;
      enable-delay-ms = <120>;
      unprepare-delay-ms = <120>;
      disable-delay-ms = <120>;

      display-timings {
         native-mode = <&timing_4kp144>;
         timing_4kp144: timing0 {
           clock-frequency = <1360800000>;

           hactive = <3840>;
           vactive = <2160>;
           hfront-porch = <160>;
           hsync-len = <40>;
           hback-porch = <160>;
           vfront-porch = <40>;
           vsync-len = <10>;
           vback-porch = <40>;
           hsync-active = <0>;
           vsync-active = <0>;
            de-active = <0>;
            pixelclk-active = <0>;
         };


         timing_4kp120: timing1 {
            clock-frequency = <1188000000>;
            hactive = <3840>;
            vactive = <2160>;
            hfront-porch = <240>;
            hsync-len = <80>;
            hback-porch = <240>;
            vfront-porch = <40>;
            vsync-len = <10>;
            vback-porch = <40>;
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
            panel_in_edp0: endpoint {

               remote-endpoint = <&edp0_out_panel>;
            };
         };

         port@1 {
            reg = <1>;
            panel_in_edp1: endpoint {
               remote-endpoint = <&edp1_out_panel>;
            };
         };
      };
   };

};

&edp0 {
   force-hpd;
   status = "okay";
   dual-channel;

   ports {
      port@1 {
         reg = <1>;

         edp0_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp>;
         };
      };
   };

};

&edp0 {
   force-hpd;
   rockchip,dual-channel;
   rockchip,data-swap;
   status = "okay";

   ports {
      port@1 {
         reg = <1>;


         edp0_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp0>;
         };
      };
   };
};

&edp0_in_vp0 {
   status = "okay";
};

&edp0_in_vp1 {
   status = "disabled";

};

&edp0_in_vp2 {
   status = "disabled";
};

&edp1 {
   force-hpd;
   status = "okay";

   ports {
      port@1 {

         reg = <1>;

         edp1_out_panel: endpoint {
            remote-endpoint = <&panel_in_edp1>;
         };
      };
   };
};

&edp1_in_vp0 {
   status = "okay";
};
&edp1_in_vp1 {
   status = "disabled";
};


&edp1_in_vp2 {
   status = "disabled";
};
```

## 5. Основные способы отладки

### 5.1 Проверка состояния DRM Connector

Пример RK3588S EVB1 использует DTS arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi.

В Linux зарегистрированные устройства DRM находятся в /sys/class/drm. В следующем журнале card0 — Display-subsystem Rockchip, card0-DP-1 и card0-eDP-1 — интерфейсы DP и eDP соответственно.

```text
console:/ # cat /sys/class/drm/
card0-DP-1/   card0-eDP-1/   card1/        renderD129/
card0-Writeback-1/ card0/    renderD128/   version
```

Например, каталог card0-eDP-1 содержит:

```text
console:/ # ls /sys/class/drm/card0-eDP-1/
device dpms edid enabled modes power status subsystem uevent
```

dpms: состояние питания устройства.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/dpms
On
```

edid: данные EDID, полученные от Sink.

Их можно разобрать командой edid-decode:

```text
console:/ # edid-decode /sys/class/drm/card0-eDP-1/edid
edid-decode (hex):


00 ff ff ff ff ff ff 00 16 83 00 00 00 00 00 00
04 17 01 00 a5 10 0c 78 06 ef 05 a3 54 4c 99 26
0f 50 54 00 00 00 01 01 01 01 01 01 01 01 01 01
01 01 01 01 01 01 ea 4e 00 4c 60 00 14 80 0c 10
84 00 78 a0 00 00 00 18 00 00 00 10 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 fe 00 4c
50 30 37 39 51 58 31 2d 53 50 30 56 00 00 00 fc
00 43 6f 6c 6f 72 20 4c 43 44 0a 20 20 20 00 3f

----------------

Block 0, Base EDID:
 EDID Structure Version & Revision: 1.0
 Vendor & Product Identification:
   Manufacturer: ETC
   Model: 0
   Made in: week 4 of 2013
 Basic Display Parameters & Features:
   Digital display
   Maximum image size: 16 cm x 12 cm
   Gamma: 2.20
   Monochrome or grayscale display
   Default (sRGB) color space is primary color space

   First detailed timing is the preferred timing
 Color Characteristics:
   Red : 0.6396, 0.3300
   Green: 0.2998, 0.6005
   Blue : 0.1484, 0.0585
   White: 0.3134, 0.3291
 Established Timings I & II: none
 Standard Timings: none
 Detailed Timing Descriptors:
   DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
            Hfront 12 Hsync 16 Hback 48 Hpol N
            Vfront 8 Vsync 4 Vback 8 Vpol N

   Dummy Descriptor:
   Alphanumeric Data String: 'LP079QX1-SP0V'
   Display Product Name: 'Color LCD'
Checksum: 0x3f
```

Если в SDK нет edid-decode, сохраните EDID в двоичный файл и разберите его отдельно:

```text
cat /sys/class/drm/card0-eDP-1/edid > /data/edid.bin
```

Разбор EDID панели lg,lp079qx1-sp0v через https://hverkuil.home.xs4all.nl/edid-decode/edid-decode.html даёт следующий результат:

```text
edid-decode (hex):

00 ff ff ff ff ff ff 00 16 83 00 00 00 00 00 00

04 17 01 00 a5 10 0c 78 06 ef 05 a3 54 4c 99 26
0f 50 54 00 00 00 01 01 01 01 01 01 01 01 01 01
01 01 01 01 01 01 ea 4e 00 4c 60 00 14 80 0c 10
84 00 78 a0 00 00 00 18 00 00 00 10 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 fe 00 4c
50 30 37 39 51 58 31 2d 53 50 30 56 00 00 00 fc
00 43 6f 6c 6f 72 20 4c 43 44 0a 20 20 20 00 3f

----------------
Block 0, Base EDID:
  EDID Structure Version & Revision: 1.0
  Vendor & Product Identification:

   Manufacturer: ETC
   Model: 0
   Made in: week 4 of 2013
  Basic Display Parameters & Features:
   Digital display
   Maximum image size: 16 cm x 12 cm
   Gamma: 2.20
   Monochrome or grayscale display
   Default (sRGB) color space is primary color space
   First detailed timing is the preferred timing
  Color Characteristics:
   Red : 0.6396, 0.3300

   Green: 0.2998, 0.6005
   Blue : 0.1484, 0.0585
   White: 0.3134, 0.3291
  Established Timings I & II: none
  Standard Timings: none
  Detailed Timing Descriptors:
   DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
             Hfront 12 Hsync 16 Hback 48 Hpol N
             Vfront 8 Vsync 4 Vback 8 Vpol N
   Dummy Descriptor:
   Alphanumeric Data String: 'LP079QX1-SP0V'
   Display Product Name: 'Color LCD'

Checksum: 0x3f

----------------
Preferred Video Timing if only Block 0 is parsed:
  DTD 1: 1536x2048 60.600861 Hz 3:4 125.323 kHz 202.020000 MHz (120
mm x 160 mm)
             Hfront 12 Hsync 16 Hback 48 Hpol N
             Vfront 8 Vsync 4 Vback 8 Vpol N

----------------
Native Video Resolution:
  1536x2048


----------------
edid-decode SHA: dc3a7b9f5453 2025-04-29 13:26:06

Warnings:

Block 0, Base EDID:
  EDID Structure Version & Revision: EDID 1.0 is deprecated, do not use.

Failures:

Block 0, Base EDID:
 Basic Display Parameters & Features: Digital Video Interface Standard set to
reserved value 0x25.
 Basic Display Parameters & Features: sRGB is signaled, but the chromaticities

do not match.
 Detailed Timing Descriptor #1: Mismatch of image size 120x160 mm vs display
size 160x120 mm.
 Display Descriptor #2: Has descriptor blocks other than detailed timings.
 Display Descriptor #3: Has descriptor blocks other than detailed timings.
 Display Descriptor #4: Has descriptor blocks other than detailed timings.
EDID:
 Base EDID: The DTD max image size is 120x160mm, which is larger than the
display size 160.0x120.0mm.

EDID conformity: FAIL
```

enabled: состояние включения устройства.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/enabled
enabled
```

modes: список поддерживаемых разрешений.

```text
console:/ # cat /sys/class/drm/card0-eDP-1/modes
1536x2048
```

status: состояние подключения устройства.

```text
cat /sys/class/drm/card0-eDP-1/status
connected
```

### 5.2 Просмотр регистров контроллера и PHY

Базовые адреса контроллера и PHY платформ eDP:

|  | RK3288 | RK3399 | RK3568 | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- |
| Контроллер | 0xff970000 | 0xff970000 | 0xfe0c0000 | 0xfdec0000/0xfded0000 | 0x27dc0000 |
| PHY | 0xff970600 | 0xff970600 | 0xfdcb0000 | 0xfed60000/0xfed70000 | 0x2b000000 |

Команда получения дампа регистров контроллера на примере RK3576:

```text
io -4 -l 0x400 0x27dc0000
```

Команды получения регистров PHY зависят от платформы:

RK3288/RK3399:

```text
io -4 -l 0x200 0xff970600
```

RK3568:

```text
io -4 -l 0x100 0xfdcb0000
```

RK3588/RK3576:

```text
cat /sys/kernel/debug/regmap/2b000000.phy/registers
```

### 5.3 Проверка состояния VOP

Подробности см. в разделе получения текущего состояния отображения документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.

### 5.4 Проверка тактирования

Подробности см. в разделе просмотра текущих частот отображения документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.

### 5.5 Принудительное включение и отключение eDP

На примере RK3576: тракт отображения eDP можно принудительно включать и отключать через узел status, описанный в разделе проверки DRM Connector:

```text
console:/ # echo off > /sys/class/drm/card0-eDP-1/status
console:/ # [ 480.579852][ T333] rockchip-vop2 27d00000.vop:

[drm:vop2_crtc_atomic_disable] Crtc atomic disable vp1
[ 480.589443][ T333] [WLAN_RFKILL]: wlan_early_suspend :enter
......
console:/ # echo on > /sys/class/drm/card0-eDP-1/status
console:/ # [ 503.199908][ T333] [WLAN_RFKILL]: wlan_late_resume :enter
[ 503.199952][ T333] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode
to 1536x2048p60, type: 14(if:eDP0, flag:0x0) for vp1 dclk: 200000000
[ 503.200223][ T333] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set
dclk_vp1 to 200000000, get 200000000
```

### 5.6 Чтение и запись DPCD

Доступ к DPCD реализован через drm_dp_aux_dev; драйвер находится в /drivers/gpu/drm/drm_dp_aux_dev.c.

После включения CONFIG_DRM_DP_AUX_CHARDEV чтение и запись выполняются следующими командами.

Чтение 16 регистров DPCD начиная с адреса 0x00000:

```text
console:/ # dd if=/dev/drm_dp_aux0 bs=1 skip=$((0x00000)) count=16 status=none | od -tx1
0000000 11 06 84 41 00 00 01 c0 02 00 00 00 0f 03 00 00
0000020
```

if: узел AUX. При регистрации двух интерфейсов eDP доступны /dev/drm_dp_aux0 и /dev/drm_dp_aux1.

skip: начальный адрес регистров DPCD.

count: число читаемых регистров DPCD.

Запись 0x0a и 0x80 в два регистра DPCD начиная с 0x100:

```text
console:/ # echo -e -n "\x0a\x80" | dd of=/dev/drm_dp_aux0 bs=1 seek=$((0x100)) count=2
status=none
```

of: узел AUX. При регистрации двух интерфейсов eDP доступны /dev/drm_dp_aux0 и /dev/drm_dp_aux1.

seek: начальный адрес регистров DPCD.

count: число записываемых регистров DPCD.

### 5.7 Настройка категорий журнала DRM

Описание уровней отладочного журнала DRM находится в drivers/gpu/drm/drm_print.c.

```text
/*
 * __drm_debug: Enable debug output.
 * Bitmask of DRM_UT_x. See include/drm/drm_print.h for details.

 */
unsigned long __drm_debug;
EXPORT_SYMBOL(__drm_debug);

MODULE_PARM_DESC(debug, "Enable debug output, where each bit enables a debug category.\n"
"\t\tBit 0 (0x01) will enable CORE messages (drm core code)\n"
"\t\tBit 1 (0x02) will enable DRIVER messages (drm controller code)\n"
"\t\tBit 2 (0x04) will enable KMS messages (modesetting code)\n"
"\t\tBit 3 (0x08) will enable PRIME messages (prime code)\n"
"\t\tBit 4 (0x10) will enable ATOMIC messages (atomic code)\n"
"\t\tBit 5 (0x20) will enable VBL messages (vblank code)\n"
"\t\tBit 7 (0x80) will enable LEASE messages (leasing code)\n"

"\t\tBit 8 (0x100) will enable DP messages (displayport code)");
```

Категории DRM можно выбирать по необходимости. Для сообщений чтения и записи DPCD выполните:

```text
echo 0x100 > /sys/module/drm/parameters/debug
```

Можно также непосредственно изменить значение переменной __drm_debug; этот способ неприменим к SDK версии GKI.

```text
diff --git a/drivers/gpu/drm/drm_print.c b/drivers/gpu/drm/drm_print.c
index 5b93c11895bb..8da96cde8308 100644
--- a/drivers/gpu/drm/drm_print.c

+++ b/drivers/gpu/drm/drm_print.c
@@ -39,7 +39,7 @@
 * __drm_debug: Enable debug output.
 * Bitmask of DRM_UT_x. See include/drm/drm_print.h for details.
 */
-unsigned long __drm_debug;
+unsigned long __drm_debug = 0x100;
 EXPORT_SYMBOL(__drm_debug);
```

## 6. Частые вопросы

### 6.1 Расчёт полосы пропускания

Для заданного режима отображения требуемая полоса каждой линии eDP рассчитывается так:

```text
bandwidth_per_lane = pixel_clk * bit_per_pixel * 1.25 / lane_count
```

bit_per_pixel — число бит на пиксель, 1.25 — коэффициент кодирования линий по eDP, lane_count — число доступных линий. Результат bandwidth_per_lane — минимальная требуемая полоса каждой линии. Если текущая скорость ниже, драйвер eDP отфильтрует режим с соответствующей пиксельной частотой.

Например, для панели с двумя линиями, разрешением 2K@60Hz, пиксельной частотой 297MHz и форматом RGB888 минимальная полоса на линию составляет:

```text
bandwidth_per_lane = 297 * 24 * 1.25 / 2 = 4.46 Gbps/lane
```

Из таблицы функциональных возможностей следует, что RK3399/RK3588/RK3576 поддерживают такую панель, а RK3288/RK3568 — нет.

### 6.2 Точность DCLK

На этапе U-Boot сравните ожидаемую и фактическую DCLK по следующему журналу; пример для RK3588S EVB1:

```text
edp@fdec0000: detailed mode clock 200000 kHz, flags[a] //expected dclk rate
   H: 1536 1548 1564 1612
   V: 2048 2056 2060 2068

bus_format: 100e
VOP update mode to: 1536x2048p60, type: eDP0 for VP2
VP2 set crtc_clock to 200000KHz         //actual dclk rate
```

На этапе ядра проверка выполняется командой `cat /sys/kernel/debug/dri/0/summary`:

```text
console:/ # cat /sys/kernel/debug/dri/0/summary
Video Port1: DISABLED
Video Port2: ACTIVE

   Connector:eDP-1 Encoder: TMDS-463
      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[f] SDR[0] color-encoding[BT.709] color-range[Full]
   Display mode: 1536x2048p60
      dclk[200000 kHz] real_dclk[200000 kHz] aclk[500000 kHz] type[48] flag[a]
//dclk[expected] real_dclk[actual]
      H: 1536 1548 1564 1612
      V: 2048 2056 2060 2068
      Fixed H: 1536 1548 1564 1612
      Fixed V: 2048 2056 2060 2068
   Cluster2-win0: ACTIVE
      win_id: 4
      format: AB24 little-endian (0x34324241)_AFBC-16x16 pixel_blend_mode[0]

glb_alpha[0xff]
      color: SDR[0] color-encoding[BT.709] color-range[Full]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 0
      src: pos[0, 0] rect[1536 x 2048]
      dst: pos[0, 0] rect[1536 x 2048]
      buf[0]: addr: 0x00000000f16bb000 pitch: 6144 offset: 0
```

Если фактическая DCLK отличается от ожидаемой, сначала проверьте её допустимость по документации панели. Если требования соблюдены, изображение нормальное и частота кадров соответствует ожиданию, различием можно пренебречь:

- Панели eDP обычно имеют некоторый допуск Pixel Clock: в определённых пределах ошибки они отображают нормально и сохраняют частоту кадров.

- Число PLL на платформе ограничено, поэтому точную DCLK нельзя гарантировать каждому модулю. Обычно обеспечивается ближайшая частота деления; см. Rockchip_Developer_Guide_Clock_CN.

Если изготовитель подтвердил высокую чувствительность панели к Pixel Clock и расхождение DCLK вызывает ошибки изображения, настройте DCLK соответствующего VOP/VP на выделенную дисплею PLL. См. раздел тактирования DCLK VOP в Rockchip_Developer_Guide_DRM_Display_Driver_CN.

### 6.3 Анализ и устранение ошибок AUX

```text
/* DEMO1 */
[  11.591242] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)
[  11.592663] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)

[  11.594057] Rockchip-dp fe0c0000.edp: AUX CH error occurred: 0x2 (1)
/* DEMO2 */
console:/ # dmesg | grep edp
[ 3.236549] Rockchip-dp fdec0000.edp: failed to read max link rate
[ 3.260422] Rockchip-dp fdec0000.edp: failed to read max link rate
[ 3.284163] Rockchip-dp fdec0000.edp: failed to read max link rate
```

Проверьте следующие пункты:

#### 6.3.1 Проверка PHY

По разделу настройки PHY DTS убедитесь, что узлы PHY, соответствующие eDP0/eDP1, включены правильно.

#### 6.3.2 Проверка панели

По разделу настройки Panel DTS убедитесь, что все параметры соответствуют документации панели.

Также проверьте соответствие питания требованиям панели. Подробности см. в её документации и Rockchip_Developer_Guide_Linux_IO_DOMAIN_CN.

Питание панели рекомендуется сделать управляемым основным контроллером, чтобы при особых сбоях можно было выполнить сброс отключением питания.

#### 6.3.3 Проверка HPD и последовательности включения

Выберите один способ HPD: Force HPD, Function Pin HPD или GPIO HPD; см. раздел настройки HPD.

Force HPD:

В режиме Force HPD сигнал готовности Sink не передаётся Source, поэтому последовательность включения может не соответствовать документации панели.

Проверьте осциллографом значения enable-delay-ms/reset-delay-ms/prepare-delay-ms/unprepare-delay-ms/disable-delay-ms по разделу Panel DTS.

![Техническая иллюстрация из оригинала (EN, 41)](/docs/rockchip-edp/assets/en-p41-1.png)

Если все интервалы соответствуют документации, но AUX всё равно выдаёт ошибки, оригинал предлагает увеличить T3, то есть prepare-delay-ms, даже за показанный предел ≤ 200. Это позволяет Sink подготовиться до начала обмена AUX с Source. Пример:

```text
&panel {
   prepare-delay-ms = <500>;
}
```

GPIO HPD:

В режиме GPIO HPD, кроме проверки последовательности питания, убедитесь, что выбранный HPD PIN не занят другим модулем. Используйте `cat /d/gpio`:

```text
console:/ # cat /d/gpio
gpiochip1: GPIOs 32-63, parent: platform/ff730000.gpio1, gpio1:
 gpio-33 (            |?              ) out lo

 gpio-34 (            |int-n          ) in hi
 gpio-45 (            |enable         ) out lo
 gpio-46 (            |vsel           ) out lo
 gpio-49 (            |vsel           ) out lo
 gpio-50 (            |vbus-5v        ) out lo
 gpio-55 (            |reset          ) out lo
... ...
gpiochip5: GPIOs 511-511, parent: platform/rk805-pinctrl, rk817-gpio, can sleep:
```

Подтяжка контакта GPIO HPD вниз также помогает стабильно распознавать HPD; см. настройку HPD.

#### 6.3.4 Проверка аппаратной схемы AUX

Проверьте, не перепутаны ли положительный и отрицательный проводники дифференциальной пары AUX. При такой ошибке проектирования используйте следующие изменения.

U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp_reg.c b/drivers/video/drm/analogix_dp_reg.c
index 292a5076705..373189e9157 100644

--- a/drivers/video/drm/analogix_dp_reg.c
+++ b/drivers/video/drm/analogix_dp_reg.c
@@ -1241,7 +1241,7 @@ ssize_t analogix_dp_aux_transfer(struct drm_dp_aux *aux, struct
drm_dp_aux_msg *
      }

      /* Enable AUX CH operation */
-     reg = AUX_EN;
+     reg = AUX_EN | 0x4;

      /* Zero-sized messages specify address-only transactions. */
      if (msg->size < 1)
```

Ядро:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
index 810b5a2f6041..2dbde10033c5 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
@@ -1202,7 +1202,7 @@ ssize_t analogix_dp_transfer(struct analogix_dp_device *dp,
      }

      /* Enable AUX CH operation */
-     reg = AUX_EN;
+     reg = AUX_EN | 0x4;

      /* Zero-sized messages specify address-only transactions. */
      if (msg->size < 1)
```

Для аппаратного канала AUX eDP v1.2 и новее оригинал предписывает удалить подтягивающие резисторы дифференциальной пары AUX. Если ошибки AUX остаются, предлагается попробовать уменьшить последовательные ёмкости сигнальных линий AUX. Изменения выполняются только после проверки требований конкретной платы и панели.

### 6.4 Анализ и устранение ошибок Link Training

Ошибки обучения линии eDP выглядят следующим образом:

```text
# Link Training CR(Clock Recovery) phase failure
[ 1410.198900][ T318] rockchip-dp fdec0000.edp: CR Max reached (0,3,0)

[ 1410.202213][ T318] rockchip-dp fdec0000.edp: LT CR failed!
[ 1410.202227][ T318] rockchip-dp fdec0000.edp: eDP link training failed (-5)
[ 1410.202238][ T318] rockchip-dp fdec0000.edp: unable to do link train, ret=-5

# Link Training EQ(Channel Equalization) phase failure
[ 6673.100385][ T318] rockchip-dp fdec0000.edp: EQ Max loop
[ 6673.101511][ T318] rockchip-dp fdec0000.edp: LT EQ failed!
[ 6673.101515][ T318] rockchip-dp fdec0000.edp: eDP link training failed (-5)
[ 6673.101517][ T318] rockchip-dp fdec0000.edp: unable to do link train, ret=-5
[ 6673.101522][ T318] [drm:analogix_dp_bridge_atomic_enable] ERROR dp commit error, ret = -5
[ 6673.101533][ T318] rockchip-dp fdec0000.edp: failed to set bridge, retry: 0
```

Основной цикл обучения eDP приблизительно имеет следующий вид; разные версии отличаются:

```text
while (!retval && !training_finished) {
   switch (dp->link_train.lt_state) {

      case START:
         retval = analogix_dp_link_start(dp);
         if (retval)
           dev_err(dp->dev, "LT link start failed!\n");
         break;
      case CLOCK_RECOVERY:
         retval = analogix_dp_process_clock_recovery(dp);
         if (retval)
           dev_err(dp->dev, "LT CR failed!\n");
         break;
      case EQUALIZER_TRAINING:
         retval = analogix_dp_process_equalizer_training(dp);

         if (retval)
           dev_err(dp->dev, "LT EQ failed!\n");
         break;
      case FINISHED:
         training_finished = 1;
         break;
      case FAILED:
         return -EREMOTEIO;
   }
}
```

В драйвере обучение делится на три этапа: START, CLOCK_RECOVERY и EQUALIZER_TRAINING.

START: инициализация начальных параметров обучения.

CLOCK_RECOVERY: восстановление тактовой частоты линии.

EQUALIZER_TRAINING: выравнивание канала.

По журналу можно определить этап, на котором произошёл сбой.

#### 6.4.1 Проверка поддержки протокола панелью

Сопоставьте поддержку протокола интерфейсом eDP платформы Rockchip из таблицы возможностей с версией в документации панели. Оригинал требует, чтобы версия интерфейса была не ниже версии панели.

#### 6.4.2 Проверка аппаратной схемы Main Link

Проверьте взаимно-однозначное соответствие каждой линии Main Link на Source и Sink. При ошибке аппаратной схемы распределение линий можно изменить следующим образом:

```text
&edp0 {
   data-lanes = <3 2 1 0>;

};
```

Проверьте соответствие Main Link аппаратной спецификации платформы. Например, для RK3576 используйте официальное руководство Rockchip RK3576 Hardware Design Guide.

#### 6.4.3 Проверка кабеля и разъёмов панели

Требования к кабелю и разъёму уточняются у изготовителя панели. Типовые требования:

- Длина кабеля не более 30cm.

- Кабель должен иметь экранирование.

- Соединение кабеля с разъёмом должно быть правильным и стабильным.

#### 6.4.4 Проверка HPD и последовательности питания

См. приведённый выше раздел проверки HPD и последовательности включения.

#### 6.4.5 Изменение предыскажения и размаха напряжения

PE (Pre-emphasis, предыскажение) и VS (Voltage Swing, размах напряжения) существенно влияют на качество сигнала eDP. Их сочетания приведены ниже:

| Уровень размаха напряжения | Предыскажение: уровень 0 Vdiff_pre_pp | Предыскажение: уровень 1 Vdiff_pre_pp | Предыскажение: уровень 2 Vdiff_pre_pp | Предыскажение: уровень 3 Vdiff_pre_pp |
| --- | --- | --- | --- | --- |
| 0 | Обязательно | Обязательно | Обязательно | Необязательно |
| 1 | Обязательно | Обязательно | Обязательно | Недопустимо |
| 2 | Обязательно | Обязательно | Недопустимо | Недопустимо |
| 3 | Необязательно | Недопустимо | Недопустимо | Недопустимо |

6.4.5.1 Изменение начальной конфигурации

Протокол eDP задаёт начальную конфигурацию PE Level 0 / VS Level 0. Для проверки других сочетаний можно изменить начальные PE/VS следующим образом. Определения параметров:

```text
# define DP_TRAIN_MAX_SWING_REACHED (1 << 2)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_0 (0 << 0)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_1 (1 << 0)

# define DP_TRAIN_VOLTAGE_SWING_LEVEL_2 (2 << 0)
# define DP_TRAIN_VOLTAGE_SWING_LEVEL_3 (3 << 0)

# define DP_TRAIN_PRE_EMPHASIS_MASK (3 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_0 (0 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_1 (1 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_2 (2 << 3)
# define DP_TRAIN_PRE_EMPH_LEVEL_3 (3 << 3)
```

Пример изменения U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..0afb116104f 100644
--- a/drivers/video/drm/analogix_dp.c

+++ b/drivers/video/drm/analogix_dp.c
@@ -240,8 +240,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
      /* Set TX voltage-swing and pre-emphasis to minimum */
      for (lane = 0; lane < lane_count; lane++)
           dp->link_train.training_lane[lane] =
-                      DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
-                      DP_TRAIN_PRE_EMPH_LEVEL_0;
+                      DP_TRAIN_VOLTAGE_SWING_LEVEL_2 |
+                      DP_TRAIN_PRE_EMPH_LEVEL_1;
      analogix_dp_set_lane_link_training(dp);

      /* Set training pattern 1 */

@@ -254,8 +254,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
           return retval;

      for (lane = 0; lane < lane_count; lane++)
-          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_0 |
-                   DP_TRAIN_VOLTAGE_SWING_LEVEL_0;
+          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_1 |
+                   DP_TRAIN_VOLTAGE_SWING_LEVEL_2;

      retval = drm_dp_dpcd_write(&dp->aux, DP_TRAINING_LANE0_SET, buf,
                         lane_count);
```

Пример изменения ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c

index 4015073bbb39..10407e67c95f 100644
--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -435,8 +435,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
      /* Set TX voltage-swing and pre-emphasis to minimum */
      for (lane = 0; lane < lane_count; lane++)
           dp->link_train.training_lane[lane] =
-                            DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
-                            DP_TRAIN_PRE_EMPH_LEVEL_0;
+                            DP_TRAIN_VOLTAGE_SWING_LEVEL_2 |
+                            DP_TRAIN_PRE_EMPH_LEVEL_1;
      analogix_dp_set_lane_link_training(dp);


      /* Set training pattern 1 */
@@ -450,8 +450,8 @@ static int analogix_dp_link_start(struct analogix_dp_device *dp)
           return retval;

      for (lane = 0; lane < lane_count; lane++)
-          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_0 |
-                   DP_TRAIN_VOLTAGE_SWING_LEVEL_0;
+          buf[lane] = DP_TRAIN_PRE_EMPH_LEVEL_2 |
+                   DP_TRAIN_VOLTAGE_SWING_LEVEL_1;


      retval = drm_dp_dpcd_write(&dp->aux, DP_TRAINING_LANE0_SET, buf,
                         lane_count);
```

6.4.5.2 Добавление вывода настроек

Если первая попытка Link Training с заданными Voltage_swing и Pre-emphasis неуспешна, следующая использует параметры, рекомендованные панелью. Добавьте журнал по примеру ниже, чтобы определить последующие настройки PE/VS. Пример U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp_reg.c b/drivers/video/drm/analogix_dp_reg.c
index d2cb10cc0e..c96495f5e9 100644
--- a/drivers/video/drm/analogix_dp_reg.c

+++ b/drivers/video/drm/analogix_dp_reg.c
@@ -1002,6 +1002,7 @@ void analogix_dp_set_lane_link_training(struct analogix_dp_device *dp)
               DP_TRAIN_PRE_EMPHASIS_SHIFT;
           phy_cfg.dp.voltage[lane] = vs;
           phy_cfg.dp.pre[lane] = pe;
+          printf("[Link Training] vs = %d pe = %d\n", vs, pe);
      }

      phy_cfg.dp.lanes = dp->link_train.lane_count;
```

Пример ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
index 42d1cbe28b40..ea5657770cfb 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_reg.c
@@ -733,10 +733,14 @@ void analogix_dp_set_lane_link_training(struct analogix_dp_device *dp)
      u8 lane;
      int ret;

-     for (lane = 0; lane < dp->link_train.lane_count; lane++)
+     for (lane = 0; lane < dp->link_train.lane_count; lane++) {
           analogix_dp_write(dp,
                         ANALOGIX_DP_LN0_LINK_TRAINING_CTL + 4 * lane,
                         dp->link_train.training_lane[lane]);
+          printk("[Link Training] vs = %d pe = %d\n",

+                       (dp->link_train.training_lane[lane] &
DP_TRAIN_VOLTAGE_SWING_MASK) >> DP_TRAIN_VOLTAGE_SWING_SHIFT,
+                       (dp->link_train.training_lane[lane] &
DP_TRAIN_PRE_EMPHASIS_MASK) >> DP_TRAIN_PRE_EMPHASIS_SHIFT);
+     }
if (dp->phy) {
     union phy_configure_opts phy_cfg;
```

#### 6.4.6 Попытка снизить скорость

Расчёт полосы описан в предыдущем разделе о полосе пропускания.

Если полосы достаточно, можно снизить Link Rate. Пример DTS:

```text
&edp {
   force-hpd;

   status = "okay";
   ports {
      port@1 {
         reg = <1>;
         edp_out: endpoint {
           link-frequencies = <2700000000>;
           remote-endpoint = <&panel_in>;
         };
      };
   };
};
```

Можно также принудительно задать Link Rate в драйвере. Определения макросов скорости:

```text
# define DP_LINK_BW_1_62  0x06
# define DP_LINK_BW_2_7 0x0a
# define DP_LINK_BW_5_4 0x14

# define DP_LINK_BW_8_1 0x1e
```

Пример изменения U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..35daf949017 100644

--- a/drivers/video/drm/analogix_dp.c
+++ b/drivers/video/drm/analogix_dp.c
@@ -665,6 +665,7 @@ static int analogix_dp_get_max_rx_bandwidth(struct analogix_dp_device
*dp,

           *bandwidth = data;
      }
+     *bandwidth = DP_LINK_BW_1_62;

      return 0;
 }
```

Пример изменения ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..f70898e0319e 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -851,6 +851,7 @@ static int analogix_dp_get_max_rx_bandwidth(struct analogix_dp_device
*dp,

           *bandwidth = data;
      }
+     *bandwidth = DP_LINK_BW_1_62;

      return 0;
 }
```

#### 6.4.7 Увеличение числа повторов CR/EQ

Согласно оригиналу, протокол eDP ограничивает число повторов CR/EQ значением 5. Однако отдельным дисплеям может потребоваться больше попыток для успешного обучения.

Пример изменения U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.h b/drivers/video/drm/analogix_dp.h
index c6cb113190e..f9312f7391d 100644
--- a/drivers/video/drm/analogix_dp.h

+++ b/drivers/video/drm/analogix_dp.h
@@ -460,9 +460,9 @@
 /* ANALOGIX_DP_LINK_POLICY */
 #define ALTERNATE_SR_ENABLE       (0x1 << 7)

-#define DP_TIMEOUT_LOOP_COUNT 100
-#define MAX_CR_LOOP 5
-#define MAX_EQ_LOOP 5
+#define DP_TIMEOUT_LOOP_COUNT 200
+#define MAX_CR_LOOP 10
+#define MAX_EQ_LOOP 10

 /* I2C EDID Chip ID, Slave Address */

 #define I2C_EDID_DEVICE_ADDR      0x50
```

Пример изменения ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
index 879a56eab2b7..8d493a0f76d1 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.h
@@ -13,9 +13,9 @@
 #include <drm/drm_crtc.h>
 #include <drm/drm_bridge.h>
-#define DP_TIMEOUT_LOOP_COUNT 100
-#define MAX_CR_LOOP 5

-#define MAX_EQ_LOOP 5
+#define DP_TIMEOUT_LOOP_COUNT 200
+#define MAX_CR_LOOP 10
+#define MAX_EQ_LOOP 10
 #define MAX_PLL_LOCK_LOOP 5

 /* Training takes 22ms if AUX channel comm fails. Use this as retry interval */
```

#### 6.4.8 Добавление сброса панели

Пример изменения U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..91ff3fa2ae6 100644
--- a/drivers/video/drm/analogix_dp.c

+++ b/drivers/video/drm/analogix_dp.c
@@ -715,6 +715,12 @@ static int analogix_dp_init_training(struct analogix_dp_device *dp,
      /* All DP analog module power up */
      analogix_dp_set_analog_power_down(dp, POWER_ALL, 0);

+     if (dp->connector.panel->funcs->unprepare)
+          dp->connector.panel->funcs->unprepare(dp->connector.panel);
+
+     if (dp->connector.panel->funcs->prepare)
+          dp->connector.panel->funcs->prepare(dp->connector.panel);
+
      return 0;

 }
```

Пример изменения ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..4dfc04a6ccae 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -910,6 +910,11 @@ static int analogix_dp_full_link_train(struct analogix_dp_device *dp,
      /* All DP analog module power up */
      analogix_dp_set_analog_power_down(dp, POWER_ALL, 0);

+     if (dp->plat_data->panel) {
+          analogix_dp_panel_unprepare(dp);
+          analogix_dp_panel_prepare(dp);
+     }
+
      dp->link_train.lt_state = START;
/* Process here */
```

#### 6.4.9 Попытка принудительного вывода

Если ни один из перечисленных способов не обеспечил успешное Link Training, можно попробовать принудительный вывод для диагностики.

Пример изменения U-Boot:

```text
diff --git a/drivers/video/drm/analogix_dp.c b/drivers/video/drm/analogix_dp.c
index c4b50018baa..5cf45165698 100644

--- a/drivers/video/drm/analogix_dp.c
+++ b/drivers/video/drm/analogix_dp.c
@@ -1035,6 +1035,7 @@ static int analogix_dp_connector_enable(struct rockchip_connector
*conn,
      u32 fmt_id;
      u32 val;
      int ret;
+     int i;

      drm_mode_copy(&video->mode, &conn_state->mode);

@@ -1097,8 +1098,11 @@ static int analogix_dp_connector_enable(struct rockchip_connector
*conn,

      ret = analogix_dp_set_link_train(dp, dp->video_info.max_lane_count,
                              dp->video_info.max_link_rate);
      if (ret) {
-          dev_err(dp->dev, "unable to do link train\n");
-          return ret;
+          dev_err(dp->dev, "unable to do link train, using default strength\n");
+          for (i = 0; i < dp->link_train.lane_count; i++) {
+                dp->link_train.training_lane[i] = DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
DP_TRAIN_PRE_EMPH_LEVEL_0;
+          }
+          analogix_dp_set_lane_link_training(dp);
      }


      ret = analogix_dp_enable_scramble(dp, 1);
```

Пример изменения ядра:

```text
diff --git a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
index 4015073bbb39..b97cd40ef205 100644

--- a/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
+++ b/drivers/gpu/drm/bridge/analogix/analogix_dp_core.c
@@ -1341,6 +1341,7 @@ static int analogix_dp_commit(struct analogix_dp_device *dp)
 {
      struct video_info *video = &dp->video_info;
      int ret;
+     int i;
      ret = drm_dp_read_dpcd_caps(&dp->aux, dp->dpcd);
      if (ret < 0) {

@@ -1362,8 +1363,10 @@ static int analogix_dp_commit(struct analogix_dp_device *dp)

      ret = analogix_dp_train_link(dp);
      if (ret) {
-          dev_err(dp->dev, "unable to do link train, ret=%d\n", ret);
-          return ret;
+          dev_err(dp->dev, "unable to do link train, using default strength\n");
+          for (i = 0; i < dp->link_train.lane_count; i++)
+                dp->link_train.training_lane[i] = DP_TRAIN_VOLTAGE_SWING_LEVEL_0 |
DP_TRAIN_PRE_EMPH_LEVEL_0;
+          analogix_dp_set_lane_link_training(dp);
      }


      ret = analogix_dp_enable_scramble(dp, 1);
```

Предупреждение: принудительный вывод выше не соответствует спецификации eDP. Даже если экран заработал, скрытые проблемы могут остаться. Рекомендуется дальнейший анализ совместно с изготовителем панели.

### 6.5 Ошибки изображения после успешного обучения

Если Link Training успешно, но экран чёрный либо изображение некорректно, последовательно выполните следующие проверки.

#### 6.5.1 Самотестирование

См. разделы самотестирования панели и контроллера.

#### 6.5.2 Проверка ожидаемого состояния VOP

См. раздел проверки состояния VOP выше.

#### 6.5.3 Проверка ожидаемого тактирования

См. раздел проверки конфигурации частот выше.

### 6.6 Оптимизация качества сигнала

#### 6.6.1 Настройка уровней PE/VS

См. раздел изменения конфигурации PE/VS.

#### 6.6.2 Включение SSC

SSC (Spread Spectrum Clocking) может уменьшать электромагнитные помехи EMI и влияние шумов питания, улучшая целостность сигнала.

В описанной реализации Rockchip SSC включается по умолчанию, если его поддерживает Sink. Ниже функция проверки поддержки SSC; в неё можно добавить журнал:

```text
bool analogix_dp_ssc_supported(struct analogix_dp_device *dp)
{
   /* Check if SSC is supported by both sides */

   return dp->plat_data->ssc && dp->link_train.ssc;
}
```

Для принудительного включения SSC оригинал предлагает заставить указанную функцию возвращать True. Изменения необходимы и в U-Boot, и в ядре. Перед применением необходимо подтвердить совместимость Sink; это диагностическое предложение исходного документа.

{% endraw %}
