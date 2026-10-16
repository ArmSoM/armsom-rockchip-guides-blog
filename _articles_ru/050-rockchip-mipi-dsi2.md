---
title: "Руководство Rockchip MIPI DSI2: панели, DSC, протокол и отладка сигналов"
description: "Полное руководство RK3576/RK3588 MIPI DSI2: D/C-PHY, DSC/PPS, панели, один/два канала, осциллограммы протокола, FAQ, патч драйвера и параметры сигналов."
translation_key: "050-rockchip-mipi-dsi2"
slug: "050-rockchip-mipi-dsi2"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "RK3576", "RK3588", "MIPI DSI2"]
excerpt: "Полное руководство RK3576/RK3588 MIPI DSI2: D/C-PHY, DSC/PPS, панели, один/два канала, осциллограммы протокола, FAQ, патч драйвера и параметры сигналов."
---

{% raw %}

# Руководство Rockchip MIPI DSI2: панели, DSC, протокол и отладка сигналов

Полный материал основан на китайском исходнике V2.3.0 из 74 страниц и полностью переведён на английский и русский. Английский PDF не предоставлен; все три версии используют оригинальные рисунки китайского PDF с исходными надписями. Это платформенный справочник для ArmSoM. Область исходника: RK3576 Kernel 6.1, RK3588 Kernel 5.10/6.1. Проверьте конкретную плату, SDK/BSP, панель, порядок питания и разводку. Аппаратная проверка не проводилась; поддержка всеми платами ArmSoM не подразумевается.

Примеры, осциллограммы и измерения взяты из исходного документа, а не из тестов ArmSoM. Запись регистров, изменение напряжений/таймингов PHY и патчи могут нарушить работу дисплея или системы; аппаратные команды не выполнялись. Код, комментарии, команды и параметры сохранены; противоречия исходника не исправляются молча.

[Редакционные записи](/docs/rockchip-mipi-dsi2/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.6, block 0 -->

## 1. Введение

<!-- Source CN PDF p.6, block 1 -->

DSI-2 входит в набор протоколов связи, определённых MIPI Alliance. DWC-MIPI-DSI2 — цифровое ядро контроллера, реализующее все функции протокола спецификации MIPI-DSI2. Оно совместимо с физическими интерфейсами D-PHY и C-PHY и поддерживает два тракта передачи Display Stream Compression (DSC).

<!-- Source CN PDF p.6, block 2 -->

![Технический рисунок исходника — PDF 6](/docs/rockchip-mipi-dsi2/assets/cn-p06-figure1.png)

<!-- Source CN PDF p.6, block 3 -->

## 2. Возможности MIPI-DSI2

<!-- Source CN PDF p.6, block 4 -->

1\. Спецификация MIPI® Alliance Display Serial Interface 2 (DSI-2), версия 1.1

<!-- Source CN PDF p.6, block 5 -->

2\. Спецификация MIPI® Alliance Display Command Set (DCS), версия 1.4

<!-- Source CN PDF p.6, block 6 -->

3\. Спецификация MIPI® Alliance D-PHY v2.0

<!-- Source CN PDF p.6, block 7 -->

4\. Спецификация MIPI® Alliance C-PHY v1.1

<!-- Source CN PDF p.6, block 8 -->

5\. Четыре линии данных D-PHY и три триады C-PHY

<!-- Source CN PDF p.6, block 9 -->

6\. Двунаправленная связь и режим Escape через линию данных 0

<!-- Source CN PDF p.6, block 10 -->

7\. Непрерывное и прерывистое тактирование D-PHY; прерывистое тактирование C-PHY

<!-- Source CN PDF p.6, block 11 -->

8\. Пакет завершения передачи End of Transmission (EoTp)

<!-- Source CN PDF p.6, block 12 -->

9\. Скремблирование

<!-- Source CN PDF p.6, block 13 -->

10\. VESA DSC 1.1/1.2a

<!-- Source CN PDF p.6, block 14 -->

11\. До 4.5 Gbps на линию D-PHY

<!-- Source CN PDF p.6, block 15 -->

12\. До 2.0 Gsps на триаду C-PHY

<!-- Source CN PDF p.7, block 16 -->

## 3. Различия интерфейсов DSI RK3576 и RK3588

<!-- Source CN PDF p.7, block 17 -->

| Функция | RK3576 | RK3588 |
|---|---|---|
| Два канала | Не поддерживается | Поддерживается |
| Максимальное разрешение | 2560x1600@60Hz | 4096x2304@60Hz |
| Линии данных | 1/2/4 lanes | 1/2/4/8 lanes |
| Максимальная скорость линии | D-PHY: 2.5Gbps/lane<br>C-PHY: 1.7Gsps/lane | D-PHY: 4.5Gbps/lane<br>C-PHY: 2.0Gsps/lane |
| Цветовой формат | RGB | RGB |
| Максимальная глубина цвета | 10 bit | 10 bit |
| DSC | Не поддерживается | Поддерживает VESA DSC 1.1/1.2a |
| C-PHY | Поддерживается | Поддерживается |

<!-- Source CN PDF p.7, block 18 -->

## 4. Различия MIPI DSI-2 Host и MIPI DSI Host

<!-- Source CN PDF p.7, block 19 -->

MIPI DSI-2 совместим со всеми функциями протокола MIPI DSI и дополнительно поддерживает MIPI C-PHY.

<!-- Source CN PDF p.7, block 20 -->

![Технический рисунок исходника — PDF 7](/docs/rockchip-mipi-dsi2/assets/cn-p07-figure1.png)

Редактируемая расшифровка исходного рисунка:

| DSI | D-PHY 1.01 | D-PHY 1.1 | D-PHY 1.2 | D-PHY 2.0 | C-PHY 1.0 |
|---|---|---|---|---|---|
| DSI 1.0 | Yes | Yes | Yes | Yes | No |
| DSI 1.1 | Yes | Yes | Yes | Yes | No |
| DSI 1.2 | Yes | Yes | Yes | Yes | No |
| DSI 1.3 | Yes | Yes | Yes | Yes | No |
| DSI-2 1.0 | Yes | Yes | Yes | Yes | Yes |

<!-- Source CN PDF p.7, block 21 -->

## 5. Различия MIPI DPHY

<!-- Source CN PDF p.7, block 22 -->

Версия MIPI DPHY платформы RK3588 отличается от предыдущих платформ и обеспечивает пропускную способность до 4.5 Gbps.

<!-- Source CN PDF p.8, block 23 -->

![Технический рисунок исходника — PDF 8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure1.png)

<!-- Source CN PDF p.8, block 24 -->

## 6. Области применения

<!-- Source CN PDF p.8, block 25 -->

MIPI DSI использует дифференциальную передачу сигналов, уменьшая число выводов и сложность аппаратной разработки при сохранении хорошей аппаратной совместимости. IP-блоки на основе MIPI DSI также отличаются низким энергопотреблением и низким уровнем EMI.

<!-- Source CN PDF p.8, block 26 -->

Области применения показаны на рисунке ниже.

<!-- Source CN PDF p.8, block 27 -->

![Технический рисунок исходника — PDF 8](/docs/rockchip-mipi-dsi2/assets/cn-p08-figure2.png)

<!-- Source CN PDF p.8, block 28 -->

## 7. Код драйверов

<!-- Source CN PDF p.8, block 29 -->

### 7.1 U-Boot

<!-- Source CN PDF p.8, block 30 -->

#### 7.1.1 Расположение драйвера

<!-- Source CN PDF p.9, block 31 -->

```text
drivers/video/drm/dw_mipi_dsi2.c
drivers/video/drm/samsung_mipi_dcphy.c
```

<!-- Source CN PDF p.9, block 32 -->

#### 7.1.2 Настройка драйвера

<!-- Source CN PDF p.9, block 33 -->

```text
CONFIG_DRM_ROCKCHIP_DW_MIPI_DSI2=y
CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY=y
```

<!-- Source CN PDF p.9, block 34 -->

### 7.2 Ядро

<!-- Source CN PDF p.9, block 35 -->

#### 7.2.1 Расположение драйвера

<!-- Source CN PDF p.9, block 36 -->

```text
MIPI DSI-2 host controller:
drivers/gpu/drm/rockchip/dw-mipi-dsi2-rockchip.c
MIPI DCPHY:
drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
```

<!-- Source CN PDF p.9, block 37 -->

#### 7.2.2 Настройка драйвера

<!-- Source CN PDF p.9, block 38 -->

```text
cONFIG_ROCKCHIP_DW_MIPI_DSI=y
CONFIG_PHY_ROCKCHIP_SAMSUNG_DCPHY=y
```

<!-- Source CN PDF p.9, block 39 -->

#### 7.2.3 Эталонные деревья устройств

<!-- Source CN PDF p.9, block 40 -->

Пути DTS:

<!-- Source CN PDF p.9, block 41 -->

```text
arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb2-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb3-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588-evb4-lp4.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb2-lp5.dtsi
arch/arm64/boot/dts/rockchip/rk3588s-evb4-lp4x.dtsi
```

<!-- Source CN PDF p.9, block 42 -->

Сценарии настройки DTS:

<!-- Source CN PDF p.10, block 43 -->

```text
rk3588-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->1080p_panel;
rk3588-evb2: dsi1->dphy->1080p_panel;
rk3588-evb3: dsi0->dphy->1080p_panel && dsi1->cphy->cphy_panel;
rk3588-evb4: dsi0->dphy->1080p_panel;
rk3588s-evb1: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_no_dsc_panel;
rk3588s-evb2: dsi0->cphy->cphy_panel & dsi1->dphy->1080p_panel;
rk3588s-evb4: dsi0->dphy->1080p_panel && dsi1->dphy->cmd_dsc_panel;
```

<!-- Source CN PDF p.10, block 44 -->

## 8. Настройка контроллера DSI и панели

<!-- Source CN PDF p.10, block 45 -->

### 8.1 Настройка DTS

<!-- Source CN PDF p.10, block 46 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
};
&dsi0_panel {
    status = "okay";
    compatible = "simple-panel-dsi";
    reg = <0>;
    power-supply = <&vcc3v3_lcd_n>;
    backlight = <&backlight>;
    reset-gpios = <&gpio2 RK_PB4 GPIO_ACTIVE_LOW>;
    reset-delay-ms = <10>;
    enable-delay-ms = <10>;
    prepare-delay-ms = <10>;
    unprepare-delay-ms = <10>;
    disable-delay-ms = <60>;
    dsi,flags = <(MIPI_DSI_MODE_VIDEO | MIPI_DSI_MODE_VIDEO_BURST |
        MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_EOT_PACKET)>;
    dsi,format = <MIPI_DSI_FMT_RGB888>;
    dsi,lanes = <4>;
    //phy-c-option;
    //compressed-data;
    //slice-width = <720>;
    //slice-height = <65>;
    //version-major = <1>;
    //version-minor = <1>;
    panel-init-sequence = [
        ...
        05 78 01 11
        05 00 01 29
    ];
    panel-exit-sequence = [
        05 00 01 28
        05 00 01 10
    ];
    disp_timings0: display-timings {
        native-mode = <&dsi0_timing0>;
        dsi0_timing0: timing0 {
            clock-frequency = <132000000>;
            hactive = <1080>;
            vactive = <1920>;
            hfront-porch = <15>;
            hsync-len = <4>;
            hback-porch = <30>;
            vfront-porch = <15>;
            vsync-len = <2>;
            vback-porch = <15>;
            hsync-active = <0>;
            vsync-active = <0>;
            de-active = <0>;
            pixelclk-active = <0>;
        };
    };
};
```

<!-- Source CN PDF p.11, block 48 -->

### 8.2 Описание настроек

<!-- Source CN PDF p.11, block 49 -->

#### 8.2.1 Общие настройки

<!-- Source CN PDF p.11, block 50 -->

| Свойство | Описание | Значение |
|---|---|---|
| rockchip,lane-rate | Ручное задание скорости линии MIPI | Единицы:<br>D-PHY: Mbps/lane или Kbps/lane<br>C-PHY: Msps/lane или Ksps/lane<br>Для 800Mbps: rockchip,lane-rate = &lt;800&gt;; или rockchip,lane-rate = &lt;800000&gt;; |
| auto-calculation | Включить Auto-Calculation | Строка логического типа (формулировка исходника) |
| disable-hold-mode | Обновлять кадры без настройки TE | Строка логического типа (формулировка исходника) |
| support-psr | Включить PSR | Строка логического типа (формулировка исходника) |
| compatible | compatible | simple-panel-dsi |
| power-supply | Питание панели [необязательно] | Ссылка на соответствующий regulator |
| backlight | Подсветка | Ссылка на подсветку |
| enable-gpios | GPIO включения панели [необязательно] | Ссылка на GPIO |
| reset-gpios | GPIO сброса панели | Ссылка на GPIO |
| reset-delay-ms | panel sequence<br>delay | См. спецификацию панели |
| enable-delay-ms | panel sequence<br>delay | См. спецификацию панели |
| prepare-delay-ms | panel sequence<br>delay | См. спецификацию панели |
| unprepare-delay-ms | panel sequence<br>delay | См. спецификацию панели |
| disable-delay-ms | panel sequence<br>delay | См. спецификацию панели |
| dsi,flags | Режим работы DSI2 | cmd mode:<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,flags | Режим работы DSI2 | video mode:<br>MIPI_DSI_MODE_VIDEO \|<br>MIPI_DSI_MODE_VIDEO_BURST \|<br>MIPI_DSI_MODE_LPM \|<br>MIPI_DSI_MODE_EOT_PACKET |
| dsi,format | Формат пиксельных данных | MIPI_DSI_FMT_RGB888 |
| dsi,format | Формат пиксельных данных | MIPI_DSI_FMT_RGB666 |
| dsi,format | Формат пиксельных данных | MIPI_DSI_FMT_RGB666_PACKED |
| dsi,format | Формат пиксельных данных | MIPI_DSI_FMT_RGB565 |
| dsi,lanes | Количество линий данных MIPI | 1/2/3 trios [cphy] |
| dsi,lanes | Количество линий данных MIPI | 6 триад [двухканальный CPHY] |
| dsi,lanes | Количество линий данных MIPI | 1/2/3/4 lanes [dphy] |
| dsi,lanes | Количество линий данных MIPI | 8 линий [двухканальный DPHY] |
| phy-c-option | C-PHY panel [option] | Строка логического типа (формулировка исходника) |
| compressed-data | Панель с DSC [необязательно] | Строка логического типа (формулировка исходника) |
| slice-width | Ширина среза DSC [необязательно] | См. спецификацию панели |
| slice-height | Высота среза DSC [необязательно] | См. спецификацию панели |
| version-major | Версия DSC [необязательно] | См. спецификацию панели |
| version-minor | Версия DSC [необязательно] | См. спецификацию панели |
| panel-init-sequence | Последовательность инициализации при включении панели | [hex]<br>data_type delay_ms payload_lenth payload |
| panel-exit-sequence | Последовательность выключения панели | [hex]<br>data_type delay_ms payload_lenth payload |
| display-timing | Тайминги панели | См. спецификацию панели |

<!-- Source CN PDF p.13, block 53 -->

#### 8.2.2 Тайминги дисплея

<!-- Source CN PDF p.13, block 54 -->

![Технический рисунок исходника — PDF 13](/docs/rockchip-mipi-dsi2/assets/cn-p13-figure1.png)

<!-- Source CN PDF p.13, block 55 -->

#### 8.2.3 dsi,flags

<!-- Source CN PDF p.13, block 56 -->

##### 8.2.3.1 Тип тактирования

<!-- Source CN PDF p.13, block 57 -->

Раздел 5.6.1 «Требования к тактированию» спецификации MIPI DSI устанавливает обязательную поддержку непрерывного тактирования на тактовой линии всеми передатчиками и приёмниками DSI; поддержка прерывистого тактирования необязательна. Поэтому выбор непрерывного или прерывистого режима зависит от требований дисплейного периферийного устройства.

<!-- Source CN PDF p.13, block 58 -->

По умолчанию тактовая линия MIPI DPHY работает непрерывно — этот режим поддерживают и ведущий, и ведомый компоненты дисплейной системы DSI. Если периферийному устройству для работы необходим тактовый сигнал хоста, линия обязательно должна работать непрерывно, как показано ниже.

<!-- Source CN PDF p.14, block 59 -->

![Технический рисунок исходника — PDF 14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure1.png)

<!-- Source CN PDF p.14, block 60 -->

Когда требуется экономить энергию, особенно при передаче, прерывистый режим позволяет не расходовать её в периоды отсутствия данных. Добавление MIPI_DSI_CLOCK_NON_CONTINUOUS в dsi,flags переводит тактовую линию MIPI DPHY в прерывистый режим, показанный ниже.

<!-- Source CN PDF p.14, block 61 -->

![Технический рисунок исходника — PDF 14](/docs/rockchip-mipi-dsi2/assets/cn-p14-figure2.png)

<!-- Source CN PDF p.14, block 62 -->

##### 8.2.3.2 Eotp

<!-- Source CN PDF p.14, block 63 -->

DSI V1.0 и более ранние версии не поддерживают Eotp. Устройства, соответствующие более новым спецификациям, должны поддерживать его формирование и обнаружение. Здесь исходник называет версию DSI RK3588/RK3576 V2.0. Для совместимости со старыми устройствами хост должен позволять включать и отключать формирование и обнаружение Eotp. Таким образом, включение Eotp зависит от поддержки панелью.

<!-- Source CN PDF p.14, block 64 -->

Eotp — короткий пакет, обозначающий завершение высокоскоростной передачи по каналу данных. Его основная задача — повысить надёжность высокоскоростного обмена; поэтому в режиме LP передавать Eotp не требуется.

<!-- Source CN PDF p.15, block 65 -->

В отличие от остальных пакетов DSI, Eotp имеет фиксированный формат:

<!-- Source CN PDF p.15, block 66 -->

```text
Data Type = DI [5:0] = 0b001000
Virtual Channel = DI [7:6] = 0b00
Payload Data [15:0] = 0x0F0F
ECC [7:0] = 0x01
```

<!-- Source CN PDF p.15, block 67 -->

Добавление MIPI_DSI_MODE_EOT_PACKET в dsi,flags управляет передачей Eotp блоком MIPI DSI TX SoC в высокоскоростном режиме. Ниже показана осциллограмма Eotp в режиме HSDT.

<!-- Source CN PDF p.15, block 68 -->

![Технический рисунок исходника — PDF 15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure1.png)

<!-- Source CN PDF p.15, block 69 -->

##### 8.2.3.3 BLANK_HS_EN

<!-- Source CN PDF p.15, block 70 -->

На линии данных одна строка обычно содержит два интервала гашения LP11, как показано ниже.

<!-- Source CN PDF p.15, block 71 -->

![Технический рисунок исходника — PDF 15](/docs/rockchip-mipi-dsi2/assets/cn-p15-figure2.png)

<!-- Source CN PDF p.16, block 72 -->

Некоторые дисплейные модули и внешние мосты MIPI не поддерживают два интервала LP-11 в Hblank. Добавьте BLK_HFP_HS_EN или BLK_HBP_HS_EN в dsi,flags, чтобы HFP или HBP передавался в высокоскоростном режиме.

<!-- Source CN PDF p.16, block 73 -->

![Технический рисунок исходника — PDF 16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure1.png)

<!-- Source CN PDF p.16, block 74 -->

#### 8.2.4 Последовательность включения питания панели

<!-- Source CN PDF p.16, block 75 -->

![Технический рисунок исходника — PDF 16](/docs/rockchip-mipi-dsi2/assets/cn-p16-figure2.png)

<!-- Source CN PDF p.17, block 76 -->

#### 8.2.5 Последовательность выключения питания панели

<!-- Source CN PDF p.17, block 77 -->

![Технический рисунок исходника — PDF 17](/docs/rockchip-mipi-dsi2/assets/cn-p17-figure1.png)

<!-- Source CN PDF p.17, block 78 -->

#### 8.2.6 Распространённые типы данных последовательности инициализации

<!-- Source CN PDF p.17, block 79 -->

| Тип данных | Описание | Размер пакета |
|---|---|---|
| 0x03 | Generic Short WRITE без параметров | Короткий |
| 0x13 | Generic Short WRITE, 1 параметр | Короткий |
| 0x23 | Generic Short WRITE, 2 параметра | Короткий |
| 0x29 | Generic long WRITE | Длинный |
| 0x05 | DCS Short WRITE без параметров | Короткий |
| 0x15 | DCS Short WRITE, 1 параметр | Короткий |
| 0x07 | DCS Short WRITE, 1 параметр, DSC EN | Короткий |
| 0x0a | DCS long WRITE, PPS, 128 байт | Длинный |

<!-- Source CN PDF p.18, block 80 -->

## 9. Тайминги видеорежима DSI

<!-- Source CN PDF p.18, block 81 -->

![Технический рисунок исходника — PDF 18](/docs/rockchip-mipi-dsi2/assets/cn-p18-figure1.png)

<!-- Source CN PDF p.18, block 82 -->

## 10. Пропускная способность

<!-- Source CN PDF p.18, block 83 -->

Драйвер MIPI DSI автоматически рассчитывает пропускную способность для разных режимов по следующим формулам. При отладке результат можно скорректировать свойством rockchip,lane-rate узла dsi в DTS. Единицы: Kbps/Mbps для D-PHY или Ksps/Msps для C-PHY. Пример показывает, что MIPI DSI DPHY RK3588 полностью поддерживает 4K@60 без DSC, тогда как для CPHY требование немного превышает максимальную пропускную способность.

<!-- Source CN PDF p.19, block 84 -->

![Технический рисунок исходника — PDF 19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure1.png)

Редактируемая расшифровка исходного рисунка:

| Parameter | Value |
|---|---|
| Resolution | 3840x2160 |
| hact / hfp / hsync / hbp | 3840 / 176 / 88 / 296 |
| vact / vfp / vsync / vbp | 2160 / 8 / 10 / 72 |
| bpp / lanes | 24 / 4 |

```text
Htotal = hact + hfp + hsync + hbp = 4400
Vtotal = vact + vfp + vsync + vbp = 2250
Pixel-CLK = Htotal * Vtotal * framerate = 4400 * 2250 * 60
D-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9
= 4400 * 2250 * 60 * 24 * 10 / 4 / 9 = 3.96 Gbps
D-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes
= 4400 * 2250 * 60 * 24 / 4 = 3.57 Gbps
C-PHY Video Burst: BW = Htotal * Vtotal * framerate * BPP * 10 / lanes / 9 / 2.28
= 4450 * 2250 * 60 * 24 * 10 / 3 / 9 / 2.28 = 2.32 Gbps
C-PHY Non Burst Sync Pulse/Event: BW = Htotal * Vtotal * framerate * BPP / lanes / 2.28
= 4450 * 2250 * 60 * 24 / 3 / 2.28 = 2.11 Gbps
```

В подстановках C-PHY исходник использует 4450 вместо Htotal=4400 и единицу Gbps, хотя текст использует Gsps. Расхождения сохранены; это не измеренные результаты и не исправленные расчёты.

<!-- Source CN PDF p.19, block 85 -->

## 11. DSC

<!-- Source CN PDF p.19, block 86 -->

DSC означает Display Stream Compression. Ниже приведена схема полной системы DSC, работающей в реальном времени. Несжатые пиксели поступают в кодер в порядке растрового сканирования; сформированный битовый поток передаётся через дисплейный канал декодеру. Декодер восстанавливает пиксели и направляет их дисплейному модулю. Формат декодированного изображения совпадает с форматом данных до кодирования. RK3588 содержит два кодера DSC, позволяющих передавать изображение высокого разрешения при меньшей пропускной способности и задержке и подключать через MIPI DSI дисплеи большего разрешения.

<!-- Source CN PDF p.19, block 87 -->

![Технический рисунок исходника — PDF 19](/docs/rockchip-mipi-dsi2/assets/cn-p19-figure2.png)

<!-- Source CN PDF p.19, block 88 -->

### 11.1 Срезы (slice)

<!-- Source CN PDF p.19, block 89 -->

Для ускорения кодирования и уменьшения искажений сжатия DSC делит кадр на срезы, кодируемые параллельно. Поддерживаются 1, 2, 4, 8 и более срезов. Единица измерения — slices/line; line означает строку пикселей в порядке растрового сканирования. Ширина и высота среза также могут различаться. На верхнем и нижнем рисунках справа показано по четыре среза на строку: сверху они имеют форму длинных полос, снизу — более коротких прямоугольников. Геометрия зависит от числа срезов, поддерживаемого DSC источника и приёмника, и скорости сжатия/декомпрессии. DSC0 RK3588 поддерживает до 8 срезов, DSC1 — до 2.

<!-- Source CN PDF p.20, block 90 -->

![Технический рисунок исходника — PDF 20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure1.png)

<!-- Source CN PDF p.20, block 91 -->

Чтобы проверить поддержку конкретного разрешения и числа срезов блоком DSC RK3588, используйте следующие формулы:

<!-- Source CN PDF p.20, block 92 -->

```text
DSC_8K: active_slice_num * slice_width <= 960 * 8
DSC_4K: active_slice_num * slice_width <= 2048 * 2
```

<!-- Source CN PDF p.20, block 93 -->

### 11.2 Кодирование DSC

<!-- Source CN PDF p.20, block 94 -->

До сжатия источник и приёмник согласуют поддерживаемое число срезов и равномерно делят изображение сеткой. Например, изображение 3840x2160 при поддержке 8 срезов обоими устройствами можно разделить на четыре столбца и две строки. Если кодер DSC содержит четыре независимых параллельных ядра сжатия, восемь срезов слева можно распределить в четыре группы и сжимать одновременно, передавая 4K с низкой задержкой и меньшей пропускной способностью.

<!-- Source CN PDF p.20, block 95 -->

![Технический рисунок исходника — PDF 20](/docs/rockchip-mipi-dsi2/assets/cn-p20-figure2.png)

<!-- Source CN PDF p.21, block 96 -->

### 11.3 Пропускная способность DSC

<!-- Source CN PDF p.21, block 97 -->

Для разрешения 4Kp60 таблица ниже сравнивает пропускную способность MIPI D/C-PHY до и после включения DSC. С DSC её можно уменьшить до одной трети — половины исходного значения.

<!-- Source CN PDF p.21, block 98 -->

![Технический рисунок исходника — PDF 21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure1.png)

Редактируемая расшифровка исходного рисунка:

| 3840x2160 / 60Hz | 24 bits RGB | DSC 8 bits RGB |
|---|---|---|
| D-PHY Video Burst | 3.96 x 4 Gbps | 1.32 x 4 Gbps |
| C-PHY Video Burst | 2.32 x 3 Gsps | 0.774 x 3 Gsps |

<!-- Source CN PDF p.21, block 99 -->

Следующие исходные осциллограммы получены при подключении к MIPI DSI RK3588 модуля 1440x3120p60 с 4 линиями и DSC: соответственно при исходной пропускной способности и при одной трети этого значения.

<!-- Source CN PDF p.21, block 100 -->

![Технический рисунок исходника — PDF 21](/docs/rockchip-mipi-dsi2/assets/cn-p21-figure2.png)

<!-- Source CN PDF p.21, block 101 -->

### 11.4 PPS

<!-- Source CN PDF p.21, block 102 -->

Длина PPS составляет 128 bytes. Следующая таблица описывает важную информацию для системы DSC:

<!-- Source CN PDF p.21, block 103 -->

1\. Версия DSC;

<!-- Source CN PDF p.21, block 104 -->

2\. BPC до сжатия DSC;

<!-- Source CN PDF p.21, block 105 -->

3\. BPP после сжатия DSC;

<!-- Source CN PDF p.21, block 106 -->

4\. Ширина и высота исходного изображения до сжатия;

<!-- Source CN PDF p.21, block 107 -->

5\. Ширина и высота среза DSC.

<!-- Source CN PDF p.22, block 108 -->

![Технический рисунок исходника — PDF 22](/docs/rockchip-mipi-dsi2/assets/cn-p22-figure1.png)

Редактируемая расшифровка исходного рисунка:

Пример PPS: 1600 × 2560, slice 40. Ниже перенесены все полностью видимые поля и PA1–PA31; отсутствующие в рисунке последующие байты PPS не додумываются.

| Field | Dec | Hex |
| --- | --- | --- |
| force_reg_dsc_version_major[3:0] | 1 | 1 |
| force_reg_dsc_version_minor[3:0] | 1 | 1 |
| force_reg_pps_identifier[7:0] | 0 | 00 |
| force_reg_bits_per_component[3:0] | 8 | 8 |
| force_reg_linebuf_depth[3:0] | 9 | 9 |
| force_reg_block_pred_enable | 1 | 1 |
| force_reg_convert_rgb | 1 | 1 |
| force_reg_simple_422 | 0 | 0 |
| force_reg_vbr_enable | 0 | 0 |
| force_reg_bits_per_pixel[9:0] | 128 | 80 |
| force_reg_pic_height[15:0] | 2560 | 0A00 |
| force_reg_pic_width[15:0] | 1600 | 0640 |
| force_reg_slice_height[15:0] | 40 | 28 |
| force_reg_slice_width[15:0] | 1600 | 0640 |
| force_reg_chunk_size[15:0] | 1600 | 0640 |
| force_reg_initial_xmit_delay[9:0] | 512 | 0200 |
| force_reg_initial_dec_delay[15:0] | 1057 | 0421 |
| force_reg_initial_scale_value[5:0] | 32 | 0020 |
| force_reg_scale_inc_interval[15:0] | 1488 | 05D0 |
| force_reg_scale_dec_interval[11:0] | 22 | 0016 |
| force_reg_first_line_bpg_offset[4:0] | 12 | 0C |
| force_reg_nfl_bpg_offset[15:0] | 631 | 0277 |
| force_reg_slice_bpg_offset[15:0] | 218 | 00DA |
| force_reg_initial_offset[15:0] | 6144 | 1800 |
| force_reg_final_offset[15:0] | 4320 | 10E0 |
| force_reg_flatness_min_qp[4:0] | 3 | 03 |
| force_reg_flatness_max_qp[4:0] | 12 | 0C |

| PA | Hex | PPS |
| --- | --- | --- |
| PA1 | 11 | PPS1 |
| PA2 | 00 | PPS2 |
| PA3 | 00 | PPS3 |
| PA4 | 89 | PPS4 |
| PA5 | 30 | PPS5 |
| PA6 | 80 | PPS6 |
| PA7 | 0A | PPS7 |
| PA8 | 00 | PPS8 |
| PA9 | 06 | PPS9 |
| PA10 | 40 | PPS10 |
| PA11 | 00 | PPS11 |
| PA12 | 28 | PPS12 |
| PA13 | 06 | PPS13 |
| PA14 | 40 | PPS14 |
| PA15 | 06 | PPS15 |
| PA16 | 40 | PPS16 |
| PA17 | 02 | PPS17 |
| PA18 | 00 | PPS18 |
| PA19 | 04 | PPS19 |
| PA20 | 21 | PPS20 |
| PA21 | 00 | PPS21 |
| PA22 | 20 | PPS22 |
| PA23 | 05 | PPS23 |
| PA24 | D0 | PPS24 |
| PA25 | 00 | PPS25 |
| PA26 | 16 | PPS26 |
| PA27 | 00 | PPS27 |
| PA28 | 0C | PPS28 |
| PA29 | 02 | PPS29 |
| PA30 | 77 | PPS30 |
| PA31 | 00 | PPS31 |

<!-- Source CN PDF p.22, block 109 -->

### 11.5 Примеры

<!-- Source CN PDF p.22, block 110 -->

#### 11.5.1 Когда включать DSC

<!-- Source CN PDF p.22, block 111 -->

Следующие параметры дисплейного модуля, предоставленные заказчиком, иллюстрируют условия включения DSC в проекте MIPI DSI:

<!-- Source CN PDF p.22, block 112 -->

1\. Интерфейс DPHY с 4 линиями данных, максимальная скорость 1Gbps/lane;

<!-- Source CN PDF p.22, block 113 -->

2\. Режим Video Burst; исходная пропускная способность 1.866Gbps, RGB 24 bits, 60 кадров/с;

<!-- Source CN PDF p.22, block 114 -->

3\. Поддержка DSC с 1 срезом;

<!-- Source CN PDF p.22, block 115 -->

4\. Целевая скорость 676Mbps/lane.

<!-- Source CN PDF p.23, block 116 -->

![Технический рисунок исходника — PDF 23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure1.png)

Редактируемая расшифровка исходного рисунка:

| Parameter | Value |
|---|---|
| Frame Rate | 60 Hz |
| Pixel Clock | 84.5 MHz |
| MIPI Lane | 1 port * 4 Lane |
| MIPI Speed | 676 M sps |
| HSW / HBP / HACT / HFP | 20 / 40 / 1600 / 118 |
| VSW / VBP / VACT / VFP | 4 / 18 / 2560 / 60 |

<!-- Source CN PDF p.23, block 117 -->

#### 11.5.2 Включение DSC для двухканального MIPI

<!-- Source CN PDF p.23, block 118 -->

Ниже показан тракт дисплея в проекте заказчика с двухканальным MIPI-модулем 2560x2560p120 и поддержкой DSC.

<!-- Source CN PDF p.23, block 119 -->

![Технический рисунок исходника — PDF 23](/docs/rockchip-mipi-dsi2/assets/cn-p23-figure2.png)

<!-- Source CN PDF p.24, block 120 -->

## 12. Маршрутизация дисплея

<!-- Source CN PDF p.24, block 121 -->

![Технический рисунок исходника — PDF 24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure1.png)

<!-- Source CN PDF p.24, block 122 -->

### 12.1 MIPI с DSC

<!-- Source CN PDF p.24, block 123 -->

![Технический рисунок исходника — PDF 24](/docs/rockchip-mipi-dsi2/assets/cn-p24-figure2.png)

<!-- Source CN PDF p.25, block 124 -->

### 12.2 MIPI с обходом DSC

<!-- Source CN PDF p.25, block 125 -->

![Технический рисунок исходника — PDF 25](/docs/rockchip-mipi-dsi2/assets/cn-p25-figure1.png)

<!-- Source CN PDF p.25, block 126 -->

### 12.3 Настройка DTS

<!-- Source CN PDF p.25, block 127 -->

Пример подключения DSI0 к VP3:

<!-- Source CN PDF p.25, block 128 -->

```text
&dsi0_in_vp2 {
    status = "disabled";
};
&dsi0_in_vp3 {
    status = "okay";
};
```

<!-- Source CN PDF p.25, block 129 -->

Пример подключения DSI1 к VP2:

<!-- Source CN PDF p.25, block 130 -->

```text
&dsi1_in_vp2 {
    status = "okay";
};
&dsi1_in_vp3 {
    status = "disabled";
};
```

<!-- Source CN PDF p.26, block 131 -->

## 13. Загрузочный логотип

<!-- Source CN PDF p.26, block 132 -->

### 13.1 route_dsi0

<!-- Source CN PDF p.26, block 133 -->

Например, vp3->dsi0 или vp3->dsc0->dsi0:

<!-- Source CN PDF p.26, block 134 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
```

<!-- Source CN PDF p.26, block 135 -->

### 13.2 route_dsi1

<!-- Source CN PDF p.26, block 136 -->

Например, vp2->dsi1 или vp2->dsc1->dsi1:

<!-- Source CN PDF p.26, block 137 -->

```text
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 138 -->

### 13.3 route_dsi0 && route_dsi1

<!-- Source CN PDF p.26, block 139 -->

Например, (vp3->dsi0 или vp3->dsc0->dsi0) && (vp2->dsi1 или vp2->dsc1->dsi1):

<!-- Source CN PDF p.26, block 140 -->

```text
&route_dsi0 {
    status = "okay";
    connect = <&vp3_out_dsi0>;
};
&route_dsi1 {
    status = "okay";
    connect = <&vp2_out_dsi1>;
};
```

<!-- Source CN PDF p.26, block 141 -->

## 14. DSI HOST

<!-- Source CN PDF p.26, block 142 -->

DSI поддерживает режимы Manual и Auto-Calculation. По умолчанию драйвер выбирает Manual; пользователь может включить Auto-Calculation со следующими особенностями.

<!-- Source CN PDF p.26, block 143 -->

Хост автоматически извлекает из интерфейсов IPI и PPI необходимые сведения и параметры таймингов для выполнения требований к кадрам видеорежима. Преимущества Auto-Calculation:

<!-- Source CN PDF p.27, block 144 -->

Пользователю не требуется настраивать набор регистров.

<!-- Source CN PDF p.27, block 145 -->

Настройка упрощается, а вероятность неожиданного поведения контроллера уменьшается.

<!-- Source CN PDF p.27, block 146 -->

Кадры IPI могут динамически изменяться, а контроллер адаптирует выходные кадры.

<!-- Source CN PDF p.27, block 147 -->

В следующих примерах ports связывает Display Interface и панель. Подробности настройки приведены в документе:

<!-- Source CN PDF p.27, block 148 -->

```text
Documentation/devicetree/bindings/graph.txt
```

<!-- Source CN PDF p.27, block 149 -->

### 14.1 Один DSI

<!-- Source CN PDF p.27, block 150 -->

![Технический рисунок исходника — PDF 27](/docs/rockchip-mipi-dsi2/assets/cn-p27-figure1.png)

<!-- Source CN PDF p.27, block 151 -->

#### 14.1.1 DSI0

<!-- Source CN PDF p.27, block 152 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
```

<!-- Source CN PDF p.28, block 154 -->

#### 14.1.2 DSI1

<!-- Source CN PDF p.28, block 155 -->

```text
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.29, block 157 -->

### 14.2 Двухканальный DSI

<!-- Source CN PDF p.29, block 158 -->

MODE1:

<!-- Source CN PDF p.29, block 159 -->

![Технический рисунок исходника — PDF 29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure1.png)

<!-- Source CN PDF p.29, block 160 -->

MODE2:

<!-- Source CN PDF p.29, block 161 -->

![Технический рисунок исходника — PDF 29](/docs/rockchip-mipi-dsi2/assets/cn-p29-figure2.png)

<!-- Source CN PDF p.29, block 162 -->

Для двухканального режима обратите внимание на выделенные свойства: rockchip,dual-channel = `<&dsi1>` и dsi,lanes = `<8>`; для панели DPHY. Для панели CPHY число линий изменяется на 6. Ниже приведены полные исходные примеры DTS.

<!-- Source CN PDF p.29, block 163 -->

```text
&dsi0 {
    status = "okay";
    rockchip,dual-channel = <&dsi1>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel {
        status = "okay";
        compatible = "simple-panel-dsi";
        dsi,lanes = <8>;
        ...
        display-timings {
            native-mode = <&timing0>;
            timing0: timing0 {
                clock-frequency = <260000000>;
                hactive = <1440>;
                vactive = <2560>;
                hfront-porch = <150>;
                hsync-len = <30>;
                hback-porch = <60>;
                vfront-porch = <8>;
                vsync-len = <4>;
                vback-porch = <4>;
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
                panel_in_dsi0: endpoint {
                    remote-endpoint = <&dsi0_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi0_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi0>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.31, block 167 -->

### 14.3 Dual-link DSI

<!-- Source CN PDF p.31, block 168 -->

![Технический рисунок исходника — PDF 31](/docs/rockchip-mipi-dsi2/assets/cn-p31-figure1.png)

<!-- Source CN PDF p.31, block 169 -->

```text
&dsi0 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi0_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi: endpoint {
                    remote-endpoint = <&dsi_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi>;
            };
        };
    };
};
&dsi1 {
    status = "okay";
    //rockchip,lane-rate = <1000>;
    //auto-calculation-mode;
    //disable-hold-mode;
    //support-psr;
    dsi1_panel: panel@0 {
        status = "okay";
        compatible = "simple-panel-dsi";
        ...
        ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                    remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
    };
    ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                remote-endpoint = <&panel_in_dsi1>;
            };
        };
    };
};
&mipi_dcphy0 {
    status = "okay";
};
&mipi_dcphy1 {
    status = "okay";
};
```

<!-- Source CN PDF p.33, block 173 -->

### 14.4 Сценарии применения DSI

<!-- Source CN PDF p.33, block 174 -->

#### 14.4.1 Решение DSI + SerDer

<!-- Source CN PDF p.33, block 175 -->

![Технический рисунок исходника — PDF 33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure1.png)

<!-- Source CN PDF p.33, block 176 -->

#### 14.4.2 Объединение нескольких дисплеев

<!-- Source CN PDF p.33, block 177 -->

![Технический рисунок исходника — PDF 33](/docs/rockchip-mipi-dsi2/assets/cn-p33-figure2.png)

<!-- Source CN PDF p.34, block 178 -->

## 15. DC-PHY

<!-- Source CN PDF p.34, block 179 -->

По умолчанию используется D-PHY. Как описано в разделе настройки панели, следующая конфигурация позволяет выбрать C-PHY:

<!-- Source CN PDF p.34, block 180 -->

```text
dsi0_panel: panel@0 {
    ...
    phy-c-option;
    ...
};
```

<!-- Source CN PDF p.34, block 181 -->

### 15.1 D-PHY

<!-- Source CN PDF p.34, block 182 -->

![Технический рисунок исходника — PDF 34](/docs/rockchip-mipi-dsi2/assets/cn-p34-figure1.png)

<!-- Source CN PDF p.34, block 183 -->

1\. До 4.5 Gbps на линию D-PHY;

<!-- Source CN PDF p.34, block 184 -->

2\. Один порт D-PHY содержит до 4 линий, каждая состоит из двух дифференциальных проводников;

<!-- Source CN PDF p.34, block 185 -->

3\. D обозначает римское число 500. Первоначально максимальная скорость D-PHY составляла 1G (DDR), чему соответствовал тактовый сигнал 500MHz. Современные скорости превышают эти значения, поэтому D уже не несёт прежнего смысла.

<!-- Source CN PDF p.35, block 186 -->

### 15.2 C-PHY

<!-- Source CN PDF p.35, block 187 -->

![Технический рисунок исходника — PDF 35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure1.png)

<!-- Source CN PDF p.35, block 188 -->

1\. До 2.0 Gsps на триаду C-PHY;

<!-- Source CN PDF p.35, block 189 -->

2\. Один порт C-PHY содержит до 3 линий, каждая состоит из трёхпроводной триады (в исходнике написано «tree-wire-trios»);

<!-- Source CN PDF p.35, block 190 -->

3\. У C-PHY нет отдельной тактовой линии: тактирование встроено во временную структуру обмена;

<!-- Source CN PDF p.35, block 191 -->

4\. C означает Channel-limited: число каналов ограничено тремя. Всего у C-PHY 3 линии, каждая использует трёхпроводную передачу.

<!-- Source CN PDF p.35, block 192 -->

## 16. Динамическое переключение частоты кадров

<!-- Source CN PDF p.35, block 193 -->

MIPI DSI поддерживает динамическое незаметное переключение частоты кадров, например между 120fps и 60fps. Подробности приведены в Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.

<!-- Source CN PDF p.35, block 194 -->

![Технический рисунок исходника — PDF 35](/docs/rockchip-mipi-dsi2/assets/cn-p35-figure2.png)

<!-- Source CN PDF p.36, block 195 -->

## 17. PSR

<!-- Source CN PDF p.36, block 196 -->

Если MIPI DSI работает в режиме COMMAND, а панель содержит GRAM, при отображении статичного кадра можно отключить выход DSI хоста для экономии энергии. Панель продолжает обновлять изображение из GRAM. При любом изменении содержимого следующего кадра хост обязан включить выход и записать новый кадр в GRAM панели.

<!-- Source CN PDF p.36, block 197 -->

![Технический рисунок исходника — PDF 36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure1.png)

<!-- Source CN PDF p.36, block 198 -->

## 18. Анализ протокола

<!-- Source CN PDF p.36, block 199 -->

### 18.1 Уровни DSI

<!-- Source CN PDF p.36, block 200 -->

![Технический рисунок исходника — PDF 36](/docs/rockchip-mipi-dsi2/assets/cn-p36-figure2.png)

<!-- Source CN PDF p.37, block 201 -->

### 18.2 D Option

<!-- Source CN PDF p.37, block 202 -->

#### 18.2.1 Состояния линий и уровни сигналов

<!-- Source CN PDF p.37, block 203 -->

![Технический рисунок исходника — PDF 37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure1.png)

<!-- Source CN PDF p.37, block 204 -->

Следующая таблица перечисляет все состояния линий, возможные при нормальной работе DPHY.

<!-- Source CN PDF p.37, block 205 -->

![Технический рисунок исходника — PDF 37](/docs/rockchip-mipi-dsi2/assets/cn-p37-figure2.png)

Редактируемая расшифровка исходного рисунка:

| State | Dp-Line | Dn-Line | HS Burst | LP Control | LP Escape |
|---|---|---|---|---|---|
| HS-0 | HS Low | HS High | Differential-0 | N/A (1) | N/A (1) |
| HS-1 | HS High | HS Low | Differential-1 | N/A (1) | N/A (1) |
| LP-00 | LP Low | LP Low | N/A | Bridge | Space |
| LP-01 | LP Low | LP High | N/A | HS-Rqst | Mark-0 |
| LP-10 | LP High | LP Low | N/A | LP-Rqst | Mark-1 |
| LP-11 | LP High | LP High | N/A | Stop | N/A (2) |

(1) При высокоскоростной передаче LP-приёмники наблюдают LP-00. (2) LP-11 в Escape Mode возвращает линию в Stop (Control Mode LP-11).

<!-- Source CN PDF p.38, block 206 -->

#### 18.2.2 Общая схема работы

<!-- Source CN PDF p.38, block 207 -->

![Технический рисунок исходника — PDF 38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure1.png)

<!-- Source CN PDF p.38, block 208 -->

Линия данных DSI может работать в следующих трёх режимах:

<!-- Source CN PDF p.38, block 209 -->

1\. Escape Mode (только Dp0/Dn0);

<!-- Source CN PDF p.38, block 210 -->

2\. Bus Turnaround Request (только Dp0/Dn0);

<!-- Source CN PDF p.38, block 211 -->

3\. High-Speed Data Transmission — высокоскоростная передача данных.

<!-- Source CN PDF p.38, block 212 -->

Эти режимы и последовательности входа определены ниже.

<!-- Source CN PDF p.38, block 213 -->

![Технический рисунок исходника — PDF 38](/docs/rockchip-mipi-dsi2/assets/cn-p38-figure2.png)

Редактируемая расшифровка исходного рисунка:

| Mode | Entry | Exit |
|---|---|---|
| Escape Mode | LP-11 → LP-10 → LP-00 → LP-01 → LP-00 | LP-00 → LP-10 → LP-11 (Mark-1) |
| High-Speed Data Transmission | LP-11 → LP-01 → LP-00 → HS-0 | (HS-0 or HS-1) → LP-11 |
| Bus Turnaround Request | LP-11 → LP-10 → LP-00 → LP-10 → LP-00 | Hi-Z |

<!-- Source CN PDF p.38, block 214 -->

##### 18.2.2.1 Режимы Escape

<!-- Source CN PDF p.38, block 215 -->

Когда линии данных находятся в режиме LP, для Escape Mode используется линия 0. Вход выполняется последовательностью LP-11->LP-10->LP-00->LP-01->LP-00, выход — LP-00->LP-10->LP-11.

<!-- Source CN PDF p.39, block 216 -->

![Технический рисунок исходника — PDF 39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure1.png)

<!-- Source CN PDF p.39, block 217 -->

###### 18.2.2.1.1 Команды Escape

<!-- Source CN PDF p.39, block 218 -->

После входа линии в Escape Mode передатчик отправляет 8-битную команду Escape, определяющую требуемое действие. Команды перечислены ниже.

<!-- Source CN PDF p.39, block 219 -->

![Технический рисунок исходника — PDF 39](/docs/rockchip-mipi-dsi2/assets/cn-p39-figure2.png)

Редактируемая расшифровка исходного рисунка:

| Escape command | Type | First → last bit transmitted | Dn | D0 |
|---|---|---|---|---|
| Low-Power Data Transmission | Mode | 1110 0001 b | - | X |
| Ultra-Low Power Mode | Mode | 0001 1110 b | X | X |
| Undefined-1 (1) | Mode | 1001 1111 b | - | - |
| Undefined-2 (1) | Mode | 1101 1110 b | - | - |
| Remote Application Reset | Trigger | 0110 0010 b | - | X |
| Acknowledge | Trigger | 0010 0001 b | - | X |
| Unknown-5 (1) | Trigger | 1010 0000 b | - | - |

(1) Команда Escape не реализована в дисплейном модуле. n=1; X=поддерживается; -=не поддерживается.

<!-- Source CN PDF p.39, block 220 -->

###### 18.2.2.1.2 LPDT

<!-- Source CN PDF p.39, block 221 -->

После входа линии в Escape Mode и отправки модулю последовательности Low-Power Data Transmission (LPDT) блок MIPI DSI TX SoC может передавать данные в режиме LPDT. Обычно таким способом в MIPI-модуль загружается последовательность инициализации.

<!-- Source CN PDF p.40, block 222 -->

![Технический рисунок исходника — PDF 40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure1.png)

<!-- Source CN PDF p.40, block 223 -->

Ниже приведена осциллограмма LPDT.

<!-- Source CN PDF p.40, block 224 -->

![Технический рисунок исходника — PDF 40](/docs/rockchip-mipi-dsi2/assets/cn-p40-figure2.png)

<!-- Source CN PDF p.41, block 225 -->

###### 18.2.2.1.3 ULPS

<!-- Source CN PDF p.41, block 226 -->

![Технический рисунок исходника — PDF 41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure1.png)

<!-- Source CN PDF p.41, block 227 -->

##### 18.2.2.2 HSDT

<!-- Source CN PDF p.41, block 228 -->

Когда тактовая линия DPHY работает в высокоскоростном режиме, дисплейный модуль может перейти к высокоскоростной передаче данных. Все линии входят в этот режим одновременно, но выходить из него могут в разное время. Последовательность входа:

<!-- Source CN PDF p.41, block 229 -->

LP-11 -> LP-01 -> LP-00 -> HS-0 -> SoT(0001_1101).

<!-- Source CN PDF p.41, block 230 -->

```text
1. Start: LP-11
2. HS-Request: LP-01
3. HS-Settle: LP-00 -> HS-0 (RX: Lane Termination Enable)
4. Rx Synchronization: SoT(0001_1101)
5. End: High-Speed Data Transmission (HSDT) - Ready to receive High-Speed Data Load
```

<!-- Source CN PDF p.41, block 231 -->

Для выхода из высокоскоростного режима сразу после последних данных полезной нагрузки инвертируют дифференциальное состояние и удерживают его в течение Ths-trail.

<!-- Source CN PDF p.41, block 232 -->

![Технический рисунок исходника — PDF 41](/docs/rockchip-mipi-dsi2/assets/cn-p41-figure2.png)

<!-- Source CN PDF p.41, block 233 -->

Ниже приведена осциллограмма HSDT.

<!-- Source CN PDF p.42, block 234 -->

![Технический рисунок исходника — PDF 42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure1.png)

<!-- Source CN PDF p.42, block 235 -->

##### 18.2.2.3 BTA

<!-- Source CN PDF p.42, block 236 -->

Для чтения информации из дисплейного модуля первая линия данных DPHY SoC выполняет разворот шины. Порядок действий показан ниже.

<!-- Source CN PDF p.42, block 237 -->

![Технический рисунок исходника — PDF 42](/docs/rockchip-mipi-dsi2/assets/cn-p42-figure2.png)

Редактируемая расшифровка исходного рисунка:

Порядок BTA: MCU начинает с LP-11 и запрашивает разворот последовательностью LP-11 → LP-10 → LP-00 → LP-10 → LP-00. Он ожидает, пока модуль начнёт управлять D0P/N, затем отключает собственные выходы (High-Z). Модуль переходит в Stop через LP-00 → LP-10 → LP-11.

<!-- Source CN PDF p.42, block 238 -->

Осциллограмма ниже показывает BTA при чтении из дисплейного модуля во время HSDT.

<!-- Source CN PDF p.43, block 239 -->

![Технический рисунок исходника — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure1.png)

<!-- Source CN PDF p.43, block 240 -->

#### 18.2.3 Порядок байтов

<!-- Source CN PDF p.43, block 241 -->

И при LP, и при HS данные упаковываются в длинные или короткие пакеты и передаются дисплейному модулю.

<!-- Source CN PDF p.43, block 242 -->

##### 18.2.3.1 SPa

<!-- Source CN PDF p.43, block 243 -->

![Технический рисунок исходника — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure2.png)

<!-- Source CN PDF p.43, block 244 -->

Пример:

<!-- Source CN PDF p.43, block 245 -->

![Технический рисунок исходника — PDF 43](/docs/rockchip-mipi-dsi2/assets/cn-p43-figure3.png)

<!-- Source CN PDF p.44, block 246 -->

###### 18.2.3.1.1 LPDT-SPa

<!-- Source CN PDF p.44, block 247 -->

Осциллограмма ниже показывает отправку указанного SPa дисплейному модулю в режиме LPDT.

<!-- Source CN PDF p.44, block 248 -->

![Технический рисунок исходника — PDF 44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure1.png)

<!-- Source CN PDF p.44, block 249 -->

###### 18.2.3.1.2 HSDT-SPa

<!-- Source CN PDF p.44, block 250 -->

Осциллограмма ниже показывает отправку указанного SPa дисплейному модулю в режиме HSDT.

<!-- Source CN PDF p.44, block 251 -->

![Технический рисунок исходника — PDF 44](/docs/rockchip-mipi-dsi2/assets/cn-p44-figure2.png)

<!-- Source CN PDF p.45, block 252 -->

##### 18.2.3.2 LPa

<!-- Source CN PDF p.45, block 253 -->

![Технический рисунок исходника — PDF 45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure1.png)

<!-- Source CN PDF p.45, block 254 -->

Пример:

<!-- Source CN PDF p.45, block 255 -->

![Технический рисунок исходника — PDF 45](/docs/rockchip-mipi-dsi2/assets/cn-p45-figure2.png)

<!-- Source CN PDF p.46, block 256 -->

###### 18.2.3.2.1 LPDT-LPa

<!-- Source CN PDF p.46, block 257 -->

Осциллограмма ниже показывает отправку указанного LPa дисплейному модулю в режиме LPDT.

<!-- Source CN PDF p.46, block 258 -->

![Технический рисунок исходника — PDF 46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure1.png)

<!-- Source CN PDF p.46, block 259 -->

###### 18.2.3.2.2 HSDT-LPa

<!-- Source CN PDF p.46, block 260 -->

Осциллограмма ниже показывает отправку указанного LPa дисплейному модулю в режиме HSDT.

<!-- Source CN PDF p.46, block 261 -->

![Технический рисунок исходника — PDF 46](/docs/rockchip-mipi-dsi2/assets/cn-p46-figure2.png)

<!-- Source CN PDF p.46, block 262 -->

##### 18.2.3.3 DI

<!-- Source CN PDF p.46, block 263 -->

И SPa, и LPa содержат поле Data Identification (DI), которое определяет длинный или короткий тип пакета. DI входит в заголовок пакета и состоит из двух частей:

<!-- Source CN PDF p.47, block 264 -->

![Технический рисунок исходника — PDF 47](/docs/rockchip-mipi-dsi2/assets/cn-p47-figure1.png)

Редактируемая расшифровка исходного рисунка:

| DI field | Bits | Width |
|---|---|---|
| VC (Virtual Channel) | DI[7:6] | 2 |
| DT (Data Type) | DI[5:0] | 6 |

<!-- Source CN PDF p.47, block 265 -->

Ниже перечислено большинство типов данных, определённых протоколом MIPI.

<!-- Source CN PDF p.48, block 266 -->

![Технический рисунок исходника — PDF 48](/docs/rockchip-mipi-dsi2/assets/cn-p48-figure1.png)

Редактируемая расшифровка исходного рисунка:

| Тип данных (hex) | Двоичный код | Описание | Тип пакета |
| --- | --- | --- | --- |
| 0x01 | 00 0001 | Событие синхронизации: начало V Sync | Короткий |
| 0x11 | 01 0001 | Событие синхронизации: конец V Sync | Короткий |
| 0x21 | 10 0001 | Событие синхронизации: начало H Sync | Короткий |
| 0x31 | 11 0001 | Событие синхронизации: конец H Sync | Короткий |
| 0x07 | 00 0111 | Команда режима сжатия | Короткий |
| 0x08 | 00 1000 | Пакет конца передачи EoTp | Короткий |
| 0x02 | 00 0010 | Команда отключения цветового режима CM | Короткий |
| 0x12 | 01 0010 | Команда включения цветового режима CM | Короткий |
| 0x22 | 10 0010 | Команда выключения периферии | Короткий |
| 0x32 | 11 0010 | Команда включения периферии | Короткий |
| 0x03 | 00 0011 | Общая короткая запись без параметров | Короткий |
| 0x13 | 01 0011 | Общая короткая запись с 1 параметром | Короткий |
| 0x23 | 10 0011 | Общая короткая запись с 2 параметрами | Короткий |
| 0x04 | 00 0100 | Общее чтение без параметров | Короткий |
| 0x14 | 01 0100 | Общее чтение с 1 параметром | Короткий |
| 0x24 | 10 0100 | Общее чтение с 2 параметрами | Короткий |
| 0x05 | 00 0101 | Короткая запись DCS без параметров | Короткий |
| 0x15 | 01 0101 | Короткая запись DCS с 1 параметром | Короткий |
| 0x06 | 00 0110 | Чтение DCS без параметров | Короткий |
| 0x16 | 01 0110 | Выполнение очереди | Короткий |
| 0x37 | 11 0111 | Задание максимального размера возвращаемого пакета | Короткий |
| 0x27 | 10 0111 | Команда режима скремблирования | Короткий |
| 0x09 | 00 1001 | Нулевой пакет без данных | Длинный |
| 0x19 | 01 1001 | Пакет гашения без данных | Длинный |
| 0x29 | 10 1001 | Общая длинная запись | Длинный |
| 0x39 | 11 1001 | Длинная запись DCS / командный пакет write_LUT | Длинный |
| 0x0A | 00 1010 | Набор параметров изображения PPS | Длинный |
| 0x0B | 00 1011 | Сжатый поток пикселей | Длинный |
| 0x0C | 00 1100 | Неплотно упакованный поток пикселей, 20-bit YCbCr, формат 4:2:2 | Длинный |

<!-- Source CN PDF p.49, block 267 -->

#### 18.2.4 Тайминги интерфейса видеорежима

<!-- Source CN PDF p.49, block 268 -->

##### 18.2.4.1 Вертикальные тайминги дисплея (видеорежим)

<!-- Source CN PDF p.49, block 269 -->

![Технический рисунок исходника — PDF 49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure1.png)

<!-- Source CN PDF p.49, block 270 -->

##### 18.2.4.2 Горизонтальные тайминги дисплея (видеорежим)

<!-- Source CN PDF p.49, block 271 -->

![Технический рисунок исходника — PDF 49](/docs/rockchip-mipi-dsi2/assets/cn-p49-figure2.png)

<!-- Source CN PDF p.50, block 272 -->

##### 18.2.4.3 Режим Non-Burst с синхроимпульсами

<!-- Source CN PDF p.50, block 273 -->

![Технический рисунок исходника — PDF 50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure1.png)

<!-- Source CN PDF p.50, block 274 -->

Ниже приведена осциллограмма режима Non Burst Sync Pulse.

<!-- Source CN PDF p.50, block 275 -->

![Технический рисунок исходника — PDF 50](/docs/rockchip-mipi-dsi2/assets/cn-p50-figure2.png)

<!-- Source CN PDF p.51, block 276 -->

##### 18.2.4.4 Режим Burst

<!-- Source CN PDF p.51, block 277 -->

![Технический рисунок исходника — PDF 51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure1.png)

<!-- Source CN PDF p.51, block 278 -->

Ниже приведена осциллограмма Video Burst.

<!-- Source CN PDF p.51, block 279 -->

![Технический рисунок исходника — PDF 51](/docs/rockchip-mipi-dsi2/assets/cn-p51-figure2.png)

<!-- Source CN PDF p.52, block 280 -->

## 19. Типичные проблемы

<!-- Source CN PDF p.52, block 281 -->

### 19.1 Просмотр таймингов VOP и информации Connector

<!-- Source CN PDF p.52, block 282 -->

```text
console:/ # cat /d/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
    Connector: DSI-2
        bus_format[100a]: RGB888_1X24
        overlay_mode[0] output_mode[0] color_space[0]
    Display mode: 1080x1920p60
        clk[132000] real_clk[132000] type[48] flag[a]
        H: 1080 1095 1099 1129
        V: 1920 1935 1937 1952
    Cluster3-win0: ACTIVE
        win_id: 6
        format: AB24 little-endian (0x34324241) SDR[0] color_space[0] glb_alpha[0xff]
        rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
        csc: y2r[0] r2y[0] csc mode[0]
        zpos: 0
        src: pos[0, 0] rect[1080 x 1920]
        dst: pos[0, 0] rect[1080 x 1920]
        buf[0]: addr: 0x000000000376e000 pitch: 4352 offset: 0
```

<!-- Source CN PDF p.52, block 283 -->

### 19.2 Просмотр дерева тактовых сигналов DSI2

<!-- Source CN PDF p.52, block 284 -->

При работе MIPI без DSC интерфейс передаёт 4 пикселя за такт. Частоты должны удовлетворять соотношению:

<!-- Source CN PDF p.52, block 285 -->

video_timing_pixel_rate / 4 = mipi_pixel_clock × K = dclk_out × K = dclk_core

<!-- Source CN PDF p.52, block 286 -->

При работе MIPI с DSC частоты должны удовлетворять соотношению:

<!-- Source CN PDF p.52, block 287 -->

mipi_pixel_clock = cds_clk / 2

<!-- Source CN PDF p.52, block 288 -->

Внимание: по умолчанию K = 1; для двухканального режима вывода MIPI K = 2.

<!-- Source CN PDF p.52, block 289 -->

```text
console:/ # cat /d/clk/clk_summary | grep vop
    clk_vop_pmu 0 0 0 24000000 0 0 50000
          dclk_vop3 1 2 0 33000000 0 0 50000
          dclk_vop1_src 0 1 0 594000000 0 0 50000
             dclk_vop1 0 1 0 594000000 0 0 50000
          dclk_vop0_src 0 1 0 594000000 0 0 50000
             dclk_vop0 0 1 0 594000000 0 0 50000
             aclk_vop_low_root 1 1 0 396000000 0 0 50000
             hclk_vop_root 2 4 0 198000000 0 0 50000
                hclk_vop 1 3 0 198000000 0 0 50000
          aclk_vop_root 1 1 0 500000000 0 0 50000
             aclk_vop_doby 0 0 0 500000000 0 0 50000
             aclk_vop_sub_src 1 1 0 500000000 0 0 50000
                aclk_vop 1 4 0 500000000 0 0 50000
             pclk_vop_root 3 5 0 100000000 0 0 50000
          dclk_vop2_src 1 1 0 148500000 0 0 50000
             dclk_vop2 1 2 0 148500000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep dsi
                pclk_dsihost1 1 2 0 100000000 0 0 50000
                pclk_dsihost0 1 2 0 100000000 0 0 50000
    clk_dsihost1 1 2 0 351000000 0 0 50000
    clk_dsihost0 1 2 0 351000000 0 0 50000
console:/ # cat /d/clk/clk_summary | grep mipi
          mipi1_clk_src 0 0 0 33000000 0 0 50000
             mipi1_pixclk 0 0 0 33000000 0 0 50000
          mipi0_clk_src 0 0 0 148500000 0 0 50000
             mipi0_pixclk 0 0 0 148500000 0 0 50000
    clk_usbdpphy_mipidcpphy_ref 5 5 0 24000000 0 0 50000
    clk_mipi_camaraout_m4 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m3 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m2 0 0 0 24000000 0 0 50000
    clk_mipi_camaraout_m0 0 0 0 24000000 0 0 50000
          clk_mipi_camaraout_m1 0 0 0 37125000 0 0 50000
                pclk_mipi_dcphy1 1 1 0 100000000 0 0 50000
                pclk_mipi_dcphy0 1 1 0 100000000 0 0 50000
console:/ #
```

<!-- Source CN PDF p.53, block 291 -->

### 19.3 Просмотр заданной скорости линии DSI

<!-- Source CN PDF p.53, block 292 -->

Скорость линии DSI задаётся двумя способами. Первый — автоматический расчёт драйвером:

<!-- Source CN PDF p.53, block 293 -->

```text
dmesg | grep dsi
[ 77.369812] dw-mipi-dsi2 fde20000.dsi: [drm:dw_mipi_dsi2_encoder_enable] final DSI-Link
bandwidth: 879 x 4 Mbps
```

<!-- Source CN PDF p.53, block 294 -->

Второй — ручное задание следующим свойством:

<!-- Source CN PDF p.53, block 295 -->

```text
&dsi0 {
    ...
    rockchip,lane-rate = <1000>;
    ...
}
```

<!-- Source CN PDF p.54, block 296 -->

### 19.4 MIPI DSI2 HOST не имеет собственного генератора цветовых полос; используйте полосы VOP2 следующими командами

<!-- Source CN PDF p.54, block 297 -->

Выберите команду согласно тракту вывода:

<!-- Source CN PDF p.54, block 298 -->

#### 19.4.1 RK3588

<!-- Source CN PDF p.54, block 299 -->

```text
vp0:
io -4 0xfdd90c08 0x1 && io -4 0xfdd90000 0xffffffff
vp1:
io -4 0xfdd90d08 0x1 && io -4 0xfdd90000 0xffffffff
vp2:
io -4 0xfdd90e08 0x1 && io -4 0xfdd90000 0xffffffff
vp3:
io -4 0xfdd90f08 0x1 && io -4 0xfdd90000 0xffffffff
```

<!-- Source CN PDF p.54, block 300 -->

#### 19.4.2 RK3576

<!-- Source CN PDF p.54, block 301 -->

```text
vp0:
io -4 0x27d00c08 0x1 && io -4 0x27d00000 0xffffffff
vp1:
io -4 0x27d00d08 0x1 && io -4 0x27d00000 0xffffffff
vp2:
io -4 0x27d00e08 0x1 && io -4 0x27d00000 0xffffffff
```

<!-- Source CN PDF p.54, block 302 -->

### 19.5 Проверка связи MIPI DSI2 с панелью при нарушениях изображения

<!-- Source CN PDF p.54, block 303 -->

U-Boot:

<!-- Source CN PDF p.54, block 304 -->

```text
--- a/drivers/video/drm/rockchip_panel.c
+++ b/drivers/video/drm/rockchip_panel.c
@@ -260,6 +260,7 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    struct rockchip_panel_priv *priv = dev_get_priv(panel->dev);
    struct mipi_dsi_device *dsi = dev_get_parent_platdata(panel->dev);
    int ret;
+ u8 mode;
    if (priv->prepared)
        return;
@@ -285,6 +286,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
    if (plat->delay.init)
        mdelay(plat->delay.init);
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    if (plat->on_cmds) {
        if (priv->cmd_type == CMD_TYPE_SPI)
            ret = rockchip_panel_send_spi_cmds(panel->state,
@@ -298,6 +301,8 @@ static void panel_simple_prepare(struct rockchip_panel *panel)
            printf("failed to send on cmds: %d\n", ret);
    }
+ mipi_dsi_dcs_get_power_mode(dsi, &mode);
+ printf("===>mode: 0x%x\n", mode);
    priv->prepared = true;
 }
```

<!-- Source CN PDF p.55, block 306 -->

Ядро:

<!-- Source CN PDF p.55, block 307 -->

```text
--- a/drivers/gpu/drm/panel/panel-simple.c
+++ b/drivers/gpu/drm/panel/panel-simple.c
@@ -506,6 +506,7 @@ static int panel_simple_prepare(struct drm_panel *panel)
    unsigned int delay;
    int err;
    int hpd_asserted;
+ u8 mode;
    if (p->prepared)
        return 0;
@@ -554,6 +555,8 @@ static int panel_simple_prepare(struct drm_panel *panel)
        }
    }
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
    if (p->desc->init_seq)
        if (p->dsi)
            panel_simple_xfer_dsi_cmd_seq(p, p->desc->init_seq);
@@ -561,6 +564,9 @@ static int panel_simple_prepare(struct drm_panel *panel)
    if (p->desc->delay.init)
        msleep(p->desc->delay.init);
+ mipi_dsi_dcs_get_power_mode(p->dsi, &mode);
+ printk("===>mode: 0x%x\n", mode);
+
    p->prepared = true;
    return 0;
```

<!-- Source CN PDF p.55, block 308 -->

При нормальной связи появляются следующие сообщения. Иначе проверьте тайминги и готовность панели:

<!-- Source CN PDF p.56, block 309 -->

```text
===> mode: 0x8
===> mode: 0x9c
```

<!-- Source CN PDF p.56, block 310 -->

#### 19.5.1 Две осциллограммы ответа get_power_mode

<!-- Source CN PDF p.56, block 311 -->

##### 19.5.1.1 Нормальный ответ панели 0x08 (0x11 и 0x29 не отправлены)

<!-- Source CN PDF p.56, block 312 -->

![Технический рисунок исходника — PDF 56](/docs/rockchip-mipi-dsi2/assets/cn-p56-figure1.png)

<!-- Source CN PDF p.57, block 313 -->

##### 19.5.1.2 Нормальный ответ панели 0x9c (0x11 и 0x29 уже отправлены)

<!-- Source CN PDF p.57, block 314 -->

![Технический рисунок исходника — PDF 57](/docs/rockchip-mipi-dsi2/assets/cn-p57-figure1.png)

<!-- Source CN PDF p.57, block 315 -->

### 19.6 Драйвер DRM не выполняет bind

<!-- Source CN PDF p.57, block 316 -->

Следующей командой проверьте, не завершился ли bind какого-либо компонента ошибкой. Например, отключённый PHY DP препятствует bind DP:

<!-- Source CN PDF p.57, block 317 -->

```text
/sys/kernel/debug/device_component/display-subsystem <
master name status
-------------------------------------------------------------
display-subsystem bound
device name status
-------------------------------------------------------------
fdd90000.vop bound
fde20000.dsi bound
fde30000.dsi bound
fde50000.dp bound
```

<!-- Source CN PDF p.57, block 318 -->

### 19.7 Ошибка probe драйвера подсветки

<!-- Source CN PDF p.57, block 319 -->

```text
console:/ # dmesg | grep backlight
[ 3.164274] pwm-backlight: probe of backlight failed with error -16
```

<!-- Source CN PDF p.58, block 320 -->

### 19.8 Настройка TE для дисплейного модуля command mode

<!-- Source CN PDF p.58, block 321 -->

Для предотвращения разрывов изображения частота обновления контроллера должна совпадать с частотой чтения изображения модулем из GRAM. RK3588 и RK3576 поддерживают только внешний сигнал обратной связи TE от дисплейного модуля.

<!-- Source CN PDF p.58, block 322 -->

#### 19.8.1 Аппаратный TE

<!-- Source CN PDF p.58, block 323 -->

MIPI DSI имеет специальные контакты, которые можно мультиплексировать как TE.

<!-- Source CN PDF p.58, block 324 -->

```text
&dsi0 {
    ...
    /* 显示模组TE信号连接到MIPI_TE0 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te0>;
    ...
};
&dsi1 {
    ...
    /* 显示模组TE信号连接到MIPI_TE1，only RK3588 support dsi1 */
    pinctrl-names = "default";
    pinctrl-0 = <&mipi_te1>;
    ...
};
```

<!-- Source CN PDF p.58, block 325 -->

#### 19.8.2 Программный TE

<!-- Source CN PDF p.58, block 326 -->

Если аппаратный контакт TE занят другой функцией, другой свободный GPIO можно использовать как вход для уведомления системы вывода о прерывании TE.

<!-- Source CN PDF p.58, block 327 -->

```text
&dsi0 {
    status = "okay";
    te-gpios = <&gpio0 RK_PC4 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&lcd_te_gpio>;
};
```

<!-- Source CN PDF p.58, block 328 -->

Следующая осциллограмма показывает совпадение частоты полей данных MIPI DSI с частотой сигнала TE дисплейного модуля:

<!-- Source CN PDF p.59, block 329 -->

![Технический рисунок исходника — PDF 59](/docs/rockchip-mipi-dsi2/assets/cn-p59-figure1.png)

<!-- Source CN PDF p.59, block 330 -->

### 19.9 Перестановка ведущего и ведомого в двухканальном MIPI

<!-- Source CN PDF p.59, block 331 -->

Если два порта MIPI перепутаны в аппаратной схеме, порядок можно исправить программно следующей конфигурацией:

<!-- Source CN PDF p.59, block 332 -->

```text
&dsi0 {
    ...
    rockchip,data-swap;
    rockchip,dual-channel = <&dsi1>;
    ...
};
&dsi1 {
    status = "okay";
};
```

<!-- Source CN PDF p.59, block 333 -->

### 19.10 Узлы отладки

<!-- Source CN PDF p.59, block 334 -->

При испытаниях сигналов MIPI DSI может потребоваться их настройка. Пути соответствующих узлов отладки:

<!-- Source CN PDF p.59, block 335 -->

```text
dcphy0：
cd /sys/devices/platform/feda0000.phy/
dcphy1：
cd /sys/devices/platform/fedb0000.phy/
```

<!-- Source CN PDF p.60, block 336 -->

#### 19.10.1 Патч

<!-- Source CN PDF p.60, block 337 -->

```diff
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
index cd6b615228d9..26bb1d030d08 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.c
@@ -219,6 +219,25 @@
 #define RX_S0D3_DESKEW_CON4 (0xF50)
 #define RX_S0D3_ADI_STAT0 (0XFEC)
 #define MIPI_DCPHY_MAX_REGISGER RX_S0D3_ADI_STAT0
+#define REG_400M_MASK GENMASK(6, 4)
+#define REG_400M(x) UPDATE(x, 6, 4)
+#define REG_645M_MASK GENMASK(2, 0)
+#define REG_645M(x) UPDATE(x, 2, 0)
+
+#define BIAS_CON4 0x0010
+#define I_MUX_SEL_MASK GENMASK(6, 5)
+#define I_MUX_SEL(x) UPDATE(x, 6, 5)
+#define CAP_PEAKING_MASK GENMASK(14, 8)
+#define RES_UP_MASK GENMASK(7, 4)
+#define RES_UP(x) UPDATE(x, 7, 4)
+#define RES_DN_MASK GENMASK(3, 0)
+#define RES_DN(x) UPDATE(x, 3, 0)
+#define T_HS_ZERO_MASK GENMASK(15, 8)
+#define T_HS_PREPARE_MASK GENMASK(7, 0)
+#define T_HS_EXIT_MASK GENMASK(15, 8)
+#define T_HS_TRAIL_MASK GENMASK(7, 0)
+#define T_TA_GET_MASK GENMASK(7, 4)
+#define T_TA_GO_MASK GENMASK(3, 0)
 struct samsung_mipi_dphy_timing {
    unsigned int max_lane_mbps;
@@ -1780,10 +1799,10 @@ static struct v4l2_subdev *get_remote_sensor(struct v4l2_subdev *sd);
 static int samsung_mipi_dcphy_power_on(struct phy *phy)
 {
    struct samsung_mipi_dcphy *samsung = phy_get_drvdata(phy);
- enum phy_mode mode = phy_get_mode(phy);
    int on = 0;
    struct v4l2_subdev *sensor_sd = NULL;
+ samsung->mode = phy_get_mode(phy);
    pm_runtime_get_sync(samsung->dev);
    reset_control_assert(samsung->apb_rst);
    udelay(1);
@@ -1801,7 +1820,7 @@ static int samsung_mipi_dcphy_power_on(struct phy *phy)
                     RKMODULE_SET_QUICK_STREAM, &on);
    }
- switch (mode) {
+ switch (samsung->mode) {
    case PHY_MODE_MIPI_DPHY:
        samsung_mipi_dphy_power_on(samsung);
        break;
@@ -2381,6 +2400,467 @@ static const struct regmap_config samsung_mipi_dcphy_regmap_config = {
    .max_register = MIPI_DCPHY_MAX_REGISGER,
 };
+static ssize_t
+reg_645m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_645M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_645m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_645M_MASK, REG_645M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_645m);
+
+static ssize_t
+reg_400m_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON2, &val);
+ level = (val & REG_400M_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+reg_400m_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON2, REG_400M_MASK, REG_400M(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(reg_400m);
+
+static ssize_t
+cap_peaking_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & CAP_PEAKING_MASK) >> 12;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+cap_peaking_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 7)
+ val = 7;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, CAP_PEAKING_MASK,
+ EDGE_CON_DIR(samsung->mode == PHY_MODE_MIPI_DPHY ? 0 : 1) |
+ EDGE_CON(val) | EDGE_CON_EN);
+
+ return count;
+}
+static DEVICE_ATTR_RW(cap_peaking);
+
+static ssize_t
+res_up_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_UP_MASK) >> 4;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_up_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_UP_MASK, RES_UP(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_UP_MASK, RES_UP(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_up);
+
+static ssize_t
+res_dn_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, COMBO_MD0_ANA_CON0, &val);
+ level = (val & RES_DN_MASK);
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+res_dn_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 15)
+ val = 15;
+
+ regmap_update_bits(samsung->regmap, DPHY_MC_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD0_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD1_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, COMBO_MD2_ANA_CON0, RES_DN_MASK, RES_DN(val));
+ regmap_update_bits(samsung->regmap, DPHY_MD3_ANA_CON0, RES_DN_MASK, RES_DN(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(res_dn);
+
+static ssize_t
+output_voltage_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int level;
+
+ regmap_read(samsung->regmap, BIAS_CON4, &val);
+ level = (val & I_MUX_SEL_MASK) >> 5;
+
+ return sprintf(buf, "%d\n", level);
+
+}
+
+static ssize_t
+output_voltage_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+
+ if (val > 3)
+ val = 3;
+
+ regmap_update_bits(samsung->regmap, BIAS_CON4,
+ I_MUX_SEL_MASK, I_MUX_SEL(val));
+
+ return count;
+}
+static DEVICE_ATTR_RW(output_voltage);
+
+static ssize_t
+hs_exit_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_exit;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_exit = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_exit);
+
+}
+
+static ssize_t hs_exit_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_exit;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_exit = T_HS_EXIT(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_EXIT_MASK, hs_exit);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_exit);
+
+static ssize_t
+hs_trail_or_post_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_trail;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON2, &val);
+ hs_trail = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_trail);
+
+}
+
+static ssize_t hs_trail_or_post_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_trail;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_trail = T_HS_TRAIL(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON2, T_HS_TRAIL_MASK, hs_trail);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_trail_or_post_3);
+
+static ssize_t
+hs_zero_or_prebegin_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_zero;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_zero = (val & GENMASK(15, 8)) >> 8;
+
+ return sprintf(buf, "%d\n", hs_zero);
+
+}
+
+static ssize_t hs_zero_or_prebegin_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_zero;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_zero = T_HS_ZERO(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_ZERO_MASK, hs_zero);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_zero_or_prebegin_3);
+
+static ssize_t
+hs_prepare_or_prepare_3_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int hs_prepare;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON1, &val);
+ hs_prepare = val & GENMASK(7, 0);
+
+ return sprintf(buf, "%d\n", hs_prepare);
+}
+
+static ssize_t hs_prepare_or_prepare_3_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long hs_prepare;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ hs_prepare = T_HS_PREPARE(val);
+ regmap_update_bits(samsung->regmap, COMBO_MD0_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD1_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, COMBO_MD2_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+
+ if (!samsung->c_option) {
+ regmap_update_bits(samsung->regmap, DPHY_MC_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ regmap_update_bits(samsung->regmap, DPHY_MD3_TIME_CON1,
+ T_HS_PREPARE_MASK, hs_prepare);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(hs_prepare_or_prepare_3);
+
+static ssize_t
+lpx_show(struct device *device, struct device_attribute *attr, char *buf)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned int val;
+ unsigned int lpx;
+
+ regmap_read(samsung->regmap, COMBO_MD0_TIME_CON0, &val);
+ lpx = (val & GENMASK(11, 4)) >> 4;
+
+ return sprintf(buf, "%d\n", lpx);
+
+}
+
+static ssize_t lpx_store(struct device *device, struct device_attribute *attr,
+ const char *buf, size_t count)
+{
+ struct samsung_mipi_dcphy *samsung = dev_get_drvdata(device);
+ unsigned long val;
+ unsigned long lpx = 0;
+
+ if (kstrtoul(buf, 10, &val))
+ return -EINVAL;
+
+ lpx |= T_LPX(val);
+ /* T_LP_EXIT_SKEW/T_LP_ENTRY_SKEW unconfig */
+ regmap_write(samsung->regmap, COMBO_MD0_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD1_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, COMBO_MD2_TIME_CON0, lpx);
+
+ if (!samsung->c_option) {
+ regmap_write(samsung->regmap, DPHY_MC_TIME_CON0, lpx);
+ regmap_write(samsung->regmap, DPHY_MD3_TIME_CON0, lpx);
+ }
+
+ return count;
+}
+static DEVICE_ATTR_RW(lpx);
+
+static struct attribute *samsung_mipi_dcphy_cts_attrs[] = {
+ &dev_attr_lpx.attr,
+ &dev_attr_hs_prepare_or_prepare_3.attr,
+ &dev_attr_hs_zero_or_prebegin_3.attr,
+ &dev_attr_hs_trail_or_post_3.attr,
+ &dev_attr_hs_exit.attr,
+ &dev_attr_output_voltage.attr,
+ &dev_attr_res_up.attr,
+ &dev_attr_res_dn.attr,
+ &dev_attr_cap_peaking.attr,
+ &dev_attr_reg_400m.attr,
+ &dev_attr_reg_645m.attr,
+ NULL
+};
+
+static const struct attribute_group samsung_mipi_dcphy_cts_attr_group = {
+ .attrs = samsung_mipi_dcphy_cts_attrs,
+};
+
+static int samsung_mipi_dcphy_cts_sysfs_add(struct samsung_mipi_dcphy *samsung)
+{
+ struct device *dev = samsung->dev;
+ int ret;
+
+ ret = sysfs_create_group(&dev->kobj, &samsung_mipi_dcphy_cts_attr_group);
+ if (ret) {
+ dev_err(dev, "failed to register sysfs. err: %d\n", ret);
+ return ret;
+ };
+
+ return 0;
+}
+
+
 static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
 {
    struct device *dev = &pdev->dev;
@@ -2474,6 +2954,7 @@ static int samsung_mipi_dcphy_probe(struct platform_device *pdev)
    samsung->stream_off = samsung_dcphy_rx_stream_off;
    mutex_init(&samsung->mutex);
    pm_runtime_enable(dev);
+ samsung_mipi_dcphy_cts_sysfs_add(samsung);
    return 0;
 }
diff --git a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
index b5e827d7cfc1..a53356c0eed6 100644
--- a/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
+++ b/drivers/phy/rockchip/phy-rockchip-samsung-dcphy.h
@@ -48,6 +48,7 @@ struct samsung_mipi_dcphy {
    struct clk *pclk;
    struct regmap *regmap;
    struct regmap *grf_regmap;
+ int mode;
    struct reset_control *m_phy_rst;
    struct reset_control *s_phy_rst;
    struct reset_control *apb_rst;
```

<!-- Source CN PDF p.70, block 357 -->

#### 19.10.2 Сила драйвера

<!-- Source CN PDF p.70, block 358 -->

##### 19.10.2.1 Выбор выходного напряжения (400mV/200mV/530mV)

<!-- Source CN PDF p.70, block 359 -->

```text
echo level > output_voltage
```

<!-- Source CN PDF p.70, block 360 -->

Настройки драйвера по умолчанию:

<!-- Source CN PDF p.70, block 361 -->

1\. D-PHY: 2'b00

<!-- Source CN PDF p.70, block 362 -->

2\. C-PHY: 2'b10

<!-- Source CN PDF p.70, block 363 -->

Соответствие уровней:

<!-- Source CN PDF p.70, block 364 -->

1\. 2b'00 : 400mV

<!-- Source CN PDF p.70, block 365 -->

2\. 2b'01 : 200mV

<!-- Source CN PDF p.70, block 366 -->

3\. 2b'10 : 530mV

<!-- Source CN PDF p.70, block 367 -->

4\. 2b'11 : 530mV

<!-- Source CN PDF p.70, block 368 -->

##### 19.10.2.2 Синфазное напряжение LP

<!-- Source CN PDF p.70, block 369 -->

```text
echo level > reg_645m
```

<!-- Source CN PDF p.70, block 370 -->

Соответствие уровней:

<!-- Source CN PDF p.70, block 371 -->

Опорное напряжение управляющего контакта LP: 645mV

<!-- Source CN PDF p.71, block 372 -->

1\. 3'b000: 605mV

<!-- Source CN PDF p.71, block 373 -->

2\. 3'b001: 625mV

<!-- Source CN PDF p.71, block 374 -->

3\. 3'b010: 635mV

<!-- Source CN PDF p.71, block 375 -->

4\. 3'b011: 645mV

<!-- Source CN PDF p.71, block 376 -->

5\. 3'b100: 655mV

<!-- Source CN PDF p.71, block 377 -->

6\. 3'b101: 665mV

<!-- Source CN PDF p.71, block 378 -->

7\. 3'b110: 685mV

<!-- Source CN PDF p.71, block 379 -->

8\. 3'b111: 725mV

<!-- Source CN PDF p.71, block 380 -->

##### 19.10.2.3 Синфазное напряжение HS

<!-- Source CN PDF p.71, block 381 -->

```text
echo level > reg_400m
```

<!-- Source CN PDF p.71, block 382 -->

Соответствие уровней:

<!-- Source CN PDF p.71, block 383 -->

1\. 3'b000: 380mV / 230mV

<!-- Source CN PDF p.71, block 384 -->

2\. 3'b001: 390mV / 220mV

<!-- Source CN PDF p.71, block 385 -->

3\. 3'b010: 400mV / 210mV

<!-- Source CN PDF p.71, block 386 -->

4\. 3'b011: 410mV / 200mV

<!-- Source CN PDF p.71, block 387 -->

5\. 3'b100: 420mV / 190mV

<!-- Source CN PDF p.71, block 388 -->

6\. 3'b101: 430mV / 180mV

<!-- Source CN PDF p.71, block 389 -->

7\. 3'b110: 440mV / 170mV

<!-- Source CN PDF p.71, block 390 -->

8\. 3'b111: 450mV / 160mV

<!-- Source CN PDF p.71, block 391 -->

##### 19.10.2.4 Дифференциальное напряжение HS

<!-- Source CN PDF p.71, block 392 -->

Высокоскоростное дифференциальное напряжение совместно определяется следующими настраиваемыми подтягивающими и стягивающими резисторами:

<!-- Source CN PDF p.71, block 393 -->

VREG соответствует синфазному напряжению (поле регистра REG_400M).

<!-- Source CN PDF p.71, block 394 -->

###### 19.10.2.4.1 Управление подтягивающим резистором высокоскоростного драйвера

<!-- Source CN PDF p.71, block 395 -->

```text
echo level > res_up
```

<!-- Source CN PDF p.71, block 396 -->

Соответствие уровней:

<!-- Source CN PDF p.71, block 397 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.71, block 398 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.71, block 399 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.71, block 400 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 401 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 402 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 403 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 404 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 405 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 406 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 407 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 408 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 409 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 410 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 411 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 412 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.72, block 413 -->

###### 19.10.2.4.2 Управление стягивающим резистором высокоскоростного драйвера

<!-- Source CN PDF p.72, block 414 -->

```text
echo level > res_dn
```

<!-- Source CN PDF p.72, block 415 -->

Соответствие уровней:

<!-- Source CN PDF p.72, block 416 -->

1\. 4'b0000: 43 ohm

<!-- Source CN PDF p.72, block 417 -->

2\. 4'b0001: 46 ohm

<!-- Source CN PDF p.72, block 418 -->

3\. 4'b0010: 49 ohm

<!-- Source CN PDF p.72, block 419 -->

4\. 4'b0011: 52 ohm

<!-- Source CN PDF p.72, block 420 -->

5\. 4'b0100: 56 ohm

<!-- Source CN PDF p.72, block 421 -->

6\. 4'b0101: 60 ohm

<!-- Source CN PDF p.72, block 422 -->

7\. 4'b0110: 66 ohm

<!-- Source CN PDF p.72, block 423 -->

8\. 4'b0111: 73 ohm

<!-- Source CN PDF p.72, block 424 -->

9\. 4'b1000: 30 ohm

<!-- Source CN PDF p.72, block 425 -->

10\. 4'b1001: 31.2 ohm

<!-- Source CN PDF p.72, block 426 -->

11\. 4'b1010: 32.5 ohm

<!-- Source CN PDF p.72, block 427 -->

12\. 4'b1011: 34 ohm

<!-- Source CN PDF p.72, block 428 -->

13\. 4'b1100: 35.5 ohm

<!-- Source CN PDF p.72, block 429 -->

14\. 4'b1101: 37 ohm

<!-- Source CN PDF p.72, block 430 -->

15\. 4'b1110: 39 ohm

<!-- Source CN PDF p.72, block 431 -->

16\. 4'b1111: 41 ohm

<!-- Source CN PDF p.73, block 432 -->

##### 19.10.2.5 Ёмкостная коррекция фронтов (cap peaking)

<!-- Source CN PDF p.73, block 433 -->

![Технический рисунок исходника — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure1.png)

Редактируемая расшифровка исходного рисунка:

Регистр: `M%_COMBO_MD#_ANA_CON0`, смещение `0x0708`, диапазон `[31:0]`, значение D-PHY по умолчанию `0x0000_7333`, C-PHY `0x0000_1188`.

| Field | Range | Access Tag | RTL Tag | D-PHY | C-PHY |
| --- | --- | --- | --- | --- | --- |
| RESERVED0 | [31:16] | RWi | RWi | 0x0 | 0x0 |
| RESERVED1 | [15] | R/W |  | 0x0 | 0x0 |
| EDGE_CON | [14:12] | R/W |  | 0x7 | 0x1 |
| RESERVED2 | [11:10] | R/W |  | 0x0 | 0x0 |
| EDGE_CON_DIR | [9] | R/W |  | 0x1 | 0x0 |
| EDGE_CON_EN | [8] | R/W |  | 0x1 | 0x1 |
| RES_UP | [7:4] | R/W |  | 0x3 | 0x8 |
| RES_DN | [3:0] | R/W |  | 0x3 | 0x8 |

Примечание оригинала: все `M%_COMBO_MD#_ANA_CON0`, `M%_DPHY_MD#_ANA_CON0` и `M%_DPHY_MC_ANA_CON0` должны иметь одинаковое значение. Слева схема cap-peaking показывает ток, интенсивность EL, время, эффект пика и эффект удаления носителей.

<!-- Source CN PDF p.73, block 434 -->

![Технический рисунок исходника — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure2.png)

Редактируемая расшифровка исходного рисунка:

| Field | Value | Значение |
| --- | --- | --- |
| EDGE_CON | 3'b111 | Сильная коррекция cap-peaking |
| EDGE_CON | 3'b011 | Средняя коррекция cap-peaking |
| EDGE_CON | 3'b001 | Слабая коррекция cap-peaking |
| EDGE_CON | 3'b000 | Отключено независимо от EDGE_CON_EN/EDGE_CON_DIR |
| EDGE_CON_DIR | 1'b0 | D-PHY: назад (медленнее); C-PHY: вперёд (быстрее) |
| EDGE_CON_DIR | 1'b1 | D-PHY: вперёд (быстрее); C-PHY: назад (медленнее) |
| EDGE_CON_EN | 1'b0 | Отключено |
| EDGE_CON_EN | 1'b1 | Включено |

`EDGE_CON` использует термометрический код. `RES_UP` и `RES_DN` управляют подтягивающим/стягивающим сопротивлением высокоскоростного драйвера; одинаковые коды дают одинаковое сопротивление. Таблица сохраняет значения рисунка, отличающиеся на некоторых уровнях от 43/46/49/52/56/60/66 ohm в тексте; скрытого согласования нет.

| RES_UP / RES_DN | ohm | По умолчанию |
| --- | --- | --- |
| 4'b0000 | 42 |  |
| 4'b0001 | 44 |  |
| 4'b0010 | 46 |  |
| 4'b0011 | 49 | D-PHY |
| 4'b0100 | 52 |  |
| 4'b0101 | 58 |  |
| 4'b0110 | 64 |  |
| 4'b0111 | 73 |  |
| 4'b1000 | 30 | C-PHY |
| 4'b1001 | 31.2 |  |
| 4'b1010 | 32.5 |  |
| 4'b1011 | 34 |  |
| 4'b1100 | 35.5 |  |
| 4'b1101 | 37 |  |
| 4'b1110 | 39 |  |
| 4'b1111 | 41 |  |

<!-- Source CN PDF p.73, block 435 -->

```text
echo level > cap_peaking
level: 0~7
```

<!-- Source CN PDF p.73, block 436 -->

#### 19.10.3 Тайминги сигналов

<!-- Source CN PDF p.73, block 437 -->

Все параметры сигналов в красных рамках ниже можно изменять.

<!-- Source CN PDF p.73, block 438 -->

![Технический рисунок исходника — PDF 73](/docs/rockchip-mipi-dsi2/assets/cn-p73-figure3.png)

<!-- Source CN PDF p.74, block 439 -->

![Технический рисунок исходника — PDF 74](/docs/rockchip-mipi-dsi2/assets/cn-p74-figure1.png)

<!-- Source CN PDF p.74, block 440 -->

Изменяйте значения count относительно считанных значений, например для Tlpx:

<!-- Source CN PDF p.74, block 441 -->

```text
cat lpx
```

<!-- Source CN PDF p.74, block 442 -->

##### 19.10.3.1 Tlpx

<!-- Source CN PDF p.74, block 443 -->

```text
echo count > lpx
```

<!-- Source CN PDF p.74, block 444 -->

##### 19.10.3.2 Ths_prepare_or_prepare_3

<!-- Source CN PDF p.74, block 445 -->

```text
echo count > hs_prepare_or_prepare_3
```

<!-- Source CN PDF p.74, block 446 -->

##### 19.10.3.3 Ths_zero_or_prebegin_3

<!-- Source CN PDF p.74, block 447 -->

```text
echo count > hs_zero_or_prebegin_3
```

<!-- Source CN PDF p.74, block 448 -->

##### 19.10.3.4 Ths_trail_or_post_3

<!-- Source CN PDF p.74, block 449 -->

```text
echo count > hs_trail_or_post_3
```

<!-- Source CN PDF p.74, block 450 -->

##### 19.10.3.5 Ths_exit

<!-- Source CN PDF p.74, block 451 -->

```text
echo count > hs_exit
```

{% endraw %}

