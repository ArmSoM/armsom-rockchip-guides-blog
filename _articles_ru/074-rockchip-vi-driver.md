---
title: "Драйвер Rockchip VI: ISP, VICAP, сенсоры и отладка камер"
description: "Полное руководство V1.0.7: тракты камер Linux 4.19, драйверы CIS/VCM/вспышки/объектива, память, задержка, отладка и пять приложений."
translation_key: "074-rockchip-vi-driver"
slug: "074-rockchip-vi-driver"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "VI", "ISP", "VICAP", "Camera", "Linux"]
keywords: "ArmSoM Rockchip VI ISP VICAP RK3568 RV1126 Linux camera"
excerpt: "Полное руководство V1.0.7: тракты камер Linux 4.19, драйверы CIS/VCM/вспышки/объектива, память, задержка, отладка и пять приложений."
---

{% raw %}

# Драйвер Rockchip VI: ISP, VICAP, сенсоры и отладка камер

## Применимость к ArmSoM и источник

Это справочный материал по платформам Rockchip, а не отчёт об аппаратной проверке ArmSoM. Он описывает RKISP, общий рабочий процесс камеры и API для отладки драйверов. Источник — **Rockchip_Driver_Guide_VI_EN_v1.0.7.pdf**, V1.0.7, 133 страницы. Соответствующий китайский PDF не предоставлен: китайский и русский тексты полностью переведены с английского, а все три версии используют английские рисунки оригинала.

Таблица на обложке указывает RV1126/RV1109 и Linux 4.19; следующая матрица также включает RK3566/RK3568. Обе сохранены ниже. Это не означает совместимость с любой платой ArmSoM или BSP. Перед адаптацией проверить SoC, исходный SDK/BSP Linux 4.19, тракт ISP/ISPP/VICAP, разъём камеры и линии, питание и тактирование сенсора/VCM/вспышки, DTS и версии IQ/AIQ. Аппаратные испытания плат не выполнялись. Все измерения, журналы и команды — примеры оригинала, а не результаты ArmSoM.

> Противоречия источника не исправлены молча: таблицы на страницах 6 и 13 расходятся по максимальному разрешению RK356x; некоторые абзацы указывают RV1106 вместо RV1109 из области применимости. Написания hsync-acitve, pclk-ative, hieght и /dev/medio0 нужно сверить с целевым BSP. Перед применением примеров прочитайте редакционные замечания. Отключение IOMMU и повышение частот в разделе задержки — примеры источника, а не универсальные рекомендации для эксплуатации.

[Редакционные замечания](/docs/rockchip-vi-driver/EDITORIAL-NOTES.md) · [Документация ArmSoM](https://docs.armsom.org/) · [Linux media userspace API](https://www.kernel.org/doc/html/latest/userspace-api/media/index.html)

### Область продукта оригинала (страница 1)

| Микросхема | Версия ядра |
| --- | --- |
| RV1126/RV1109 | Linux 4.19 |

### Матрица применимости оригинала (страница 2)

| Платформа | Linux Kernel 4.19 |
| --- | --- |
| RV1126 | Y |
| RV1109 | Y |
| RK3566 | Y |
| RK3568 | Y |


## Различия VI между микросхемами

<!-- Source: English PDF p6, table unit 1 -->

| SOC | VI IP | Интерфейс VI | Максимальное разрешение Bayer CIS | Возможности |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 3072x2048 | HDR до 3 кадров |
| RK3566 | ISP21 Lite: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x2304 | Без HDR |
| RK3568 | ISP21: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x2304 | HDR до 2 кадров |
| RV1126 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4416x3312 | HDR до 3 кадров |

## Структура каталогов драйверов камеры

Linux Kernel-4.19

- `arch/arm/boot/dts` — файлы конфигурации DTS

- `drivers/phy/rockchip`

- `drivers/phy/rockchip/phy-rockchip-mipi-rx.c` — драйвер MIPI DPHY

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-common.h`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-hw.c`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy.c`

- `drivers/media`

- `drivers/media/platform/rockchip/cif`

- `drivers/media/platform/rockchip/isp`

- `drivers/media/platform/rockchip/isp/dev` — probe, асинхронная регистрация, тактирование, pipeline, iommu и фреймворк media/v4l2

- `drivers/media/platform/rockchip/isp/capture` — настройка mp/sp/rawwr и vb2, обработка кадровых прерываний

- `drivers/media/platform/rockchip/isp/dmarx` — настройка rawrd и vb2, обработка кадровых прерываний

- `drivers/media/platform/rockchip/isp/isp_params` — настройка параметров 3A

- `drivers/media/platform/rockchip/isp/isp_stats` — статистика 3A

- `drivers/media/platform/rockchip/isp/isp_mipi_luma` — статистика яркости данных MIPI

- `drivers/media/platform/rockchip/isp/regs` — операции чтения и записи регистров

- `drivers/media/platform/rockchip/isp/rkisp` — регистрация subdev и entity ISP

- `drivers/media/platform/rockchip/isp/csi` — subdev CSI и настройка MIPI

- `drivers/media/platform/rockchip/isp/bridge` — subdev моста для взаимодействия ISP и ISPP

- `drivers/media/platform/rockchip/ispp`

- `drivers/media/platform/rockchip/ispp/dev` — probe, асинхронная регистрация, тактирование, pipeline, iommu и фреймворк media/v4l2

- `drivers/media/platform/rockchip/ispp/stream` — настройка четырёх видеовыходов и vb2, обработка кадровых прерываний

- `drivers/media/platform/rockchip/ispp/rkispp` — регистрация subdev и entity ISPP

- `drivers/media/platform/rockchip/ispp/params` — настройка параметров TNR/NR/SHP/FEC/ORB

- `drivers/media/platform/rockchip/ispp/stats` — статистика ORB

- `drivers/media/i2c`

- `drivers/media/i2c/os04a10.c` — драйвер CIS (CMOS-сенсора изображения)

## Связь ISP и VICAP

На платформах RV1126/RV1109 и RK356X VICAP и ISP являются независимыми IP-блоками обработки изображений. Если изображения, захваченные VICAP, обрабатываются ISP, драйвер должен создать подустройство v4l2 для соответствующего интерфейса VICAP и связать его с узлом ISP, передавая параметры драйверу ISP. Описание ISP приведено в разделе «Драйвер RKISP», а VICAP — в разделе «Драйвер RKVICAP». Общая схема связей интерфейсов VICAP с ISP показана ниже:

![Оригинальный английский рисунок 1, страница 7](/docs/rockchip-vi-driver/assets/en-p7-X177.jpg)

*Оригинальный английский рисунок 1, страница 7*

## Драйвер RKISP

### Краткое описание фреймворка

Драйвер RKISP основан на v4l2/media и реализует настройку оборудования, обработку прерываний, управление сменой буферов, включение и выключение питания подустройств, например MIPI DPHY и сенсора.

Ниже показана топология драйвера RKISP:

![Оригинальный английский рисунок 2, страница 8](/docs/rockchip-vi-driver/assets/en-p8-X184.jpg)

*Оригинальный английский рисунок 2, страница 8*

<!-- Source: English PDF p9, table unit 41 -->

| Название | Тип | Описание |
| --- | --- | --- |
| rkisp_mainpath | v4l2_vdevcapture | Форматы: YUV, RAW Bayer; поддерживается кадрирование |
| rkisp_selfpath | v4l2_vdevcapture | Форматы: YUV, RGB; поддерживается кадрирование |
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
| rkispp_scale0 | v4l2_vdev<br>capture | YUV полного либо уменьшенного разрешения; масштаб [1 8]; максимальная ширина 3264 для YUV422 и 2080 для YUV420. |
| rkispp_scale1 | v4l2_vdev<br>capture | YUV полного либо уменьшенного разрешения; масштаб [2 8]; максимальная ширина 1280. |
| rkispp_scale2 | v4l2_vdev<br>capture | YUV полного либо уменьшенного разрешения; масштаб [2 8]; максимальная ширина 1280. |

### Режим HDR ISP

RKISP2 принимает трёхкадровый или двухкадровый HDR-поток сенсора MIPI. Аппаратура записывает данные в DDR через 3 или 2 канала dmatx, затем читает их в ISP через 3 или 2 канала dmarx; ISP объединяет три или два кадра. Цепочка драйверов показана ниже:

![Оригинальный английский рисунок 3, страница 10](/docs/rockchip-vi-driver/assets/en-p10-X190.png)

*Оригинальный английский рисунок 3, страница 10*

![Оригинальный английский рисунок 4, страница 10](/docs/rockchip-vi-driver/assets/en-p10-X191.png)

*Оригинальный английский рисунок 4, страница 10*

CSI subdev получает выходные параметры драйвера сенсора через get_fmt для нескольких форматов pad; им соответствуют source pad CSI.

Конкретная настройка драйвера сенсора MIPI описана в разделе «Этапы переноса драйвера».

<!-- Source: English PDF p11, table unit 50 -->

| Название | Название | Описание |
| --- | --- | --- |
| rkisp-isp-subdev | Sensor pad0 | ISP получает ширину, высоту и формат выхода sensor vc0 (по умолчанию), обычно в линейном режиме. |
| rkisp_rawwr0 | Sensor<br>pad1 | Rawwr0 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr1 | Sensor<br>pad2 | Rawwr1 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr2 | Sensor<br>pad3 | Rawwr2 получает ширину, высоту и формат выхода sensor vcX |
| rkisp_rawwr3 | Sensor<br>pad4 | Rawwr3 получает ширину, высоту и формат выхода sensor vcX |

## Драйвер RKVICAP

### Описание фреймворка

Драйвер RKVICAP основан на v4l2/media и реализует настройку аппаратуры, обработку прерываний, управление сменой буферов и питанием подустройств, например MIPI DPHY и сенсора.

В RV1126/RV1109 VICAP имеет два IP-ядра: VICAP FULL и VICAP LITE. У VICAP FULL три интерфейса — dvp/mipi/lvds. Dvp может работать одновременно с mipi или lvds, но mipi и lvds взаимно исключаются. VICAP LITE имеет только lvds и может работать одновременно с VICAP FULL. Интерфейсу dvp VICAP FULL соответствует rkvicap_dvp, интерфейсам mipi/lvds — rkvicap_mipi_lvds, а VICAP LITE — rkvicap_lite_mipi_lvds. Каждый узел может захватывать данные независимо.

У RK356X VICAP имеет одно ядро с интерфейсами dvp и mipi. Интерфейсу dvp соответствует rkvicap_dvp, а mipi — rkvicap_mipi_lvds (имя совпадает с VICAP FULL в RV1126/RV1109). Каждый узел может захватывать данные независимо.

Для передачи захваченных VICAP данных драйверу ISP логический узел sditf, созданный VICAP, связывают с виртуальным устройством ISP. DVP соответствует rkvicap_dvp_sditf, mipi/lvds VICAP FULL — rkvicap_mipi_lvds_sditf, VICAP LITE — rkvicap_lite_sditf.

Способы связи интерфейсов в DTS приведены в разделе «Регистрация устройства CIS (DTS)».

Ниже показана топология устройств драйвера RKVICAP:

![Оригинальный английский рисунок 5, страница 12](/docs/rockchip-vi-driver/assets/en-p12-X201.jpg)

*Оригинальный английский рисунок 5, страница 12*

## Различия версий микросхем

<!-- Source: English PDF p13, table unit 61 -->

| SOC | VI IP | Интерфейс VI | Максимальное разрешение Bayer CIS | Возможности |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 3072x2048 | HDR до 3 кадров |
| RK3566 | ISP21 Lite: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x3072 | Без HDR |
| RK3568 | ISP21: 1; VICAP Full: 1 | MIPI DPHY: 2 × 2 либо 1 × 4 линии, 2.5Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4096x3072 | HDR до 2 кадров |
| RV1126 | ISP20 (ISP + ISPP): 1; VICAP Full: 1; VICAP Lite: 1 | MIPI DPHY: 2 × 4 линии, 2.5Gbps/Lane; LVDS: 2 × 4 линии, 1.0Gbps/Lane; DVP: BT601 / BT656 / BT1120; pclk: 150MHz | 4416x3312 | HDR до 3 кадров |

## Драйвер CIS (CMOS-сенсора изображения)

### Регистрация устройства CIS (DTS)

#### Регистрация одного сенсора

##### Интерфейс MIPI

В этом месте исходник указывает RV1126 и RV1106: два независимых полноценных стандартных физических DPHY MIPI CSI2, соответствующих csi_dphy0 и csi_dphy1 в DTS (см. RV1126.dtsi). Их свойства приведены ниже. Обозначение RV1106 отличается от RV1109 ранее в документе; расхождение сохранено для проверки.

Не более 4 линий данных;

Максимальная скорость 2.5Gbps/lane;

На RK356X имеется один стандартный физический DPHY MIPI CSI2 с режимами full mode и split mode. Он представлен тремя логическими DPHY: csi2_dphy0/csi2_dphy1/csi2_dphy2 (см. rk3568.dtsi). Свойства:

##### Полный режим (Full mode)

Используется только csi2_dphy0; он взаимно исключается с csi2_dphy1/csi2_dphy2, одновременное использование невозможно;

Не более 4 линий данных;

Максимальная скорость 2.5Gbps/lane;

##### Разделённый режим (Split mode)

Используются только csi2_dphy1 и csi2_dphy2, взаимно исключающие csi2_dphy0;

csi2_dphy1 и csi2_dphy2 можно использовать одновременно;

csi2_dphy1 и csi2_dphy2 имеют не более 2 линий данных каждый;

csi2_dphy1 соответствует lane0/lane1 физического DPHY;

csi2_dphy2 соответствует lane2/lane3 физического DPHY;

Максимальная скорость — 2.5Gbps/lane.

Конкретные примеры DTS приведены ниже.

##### Подключение к ISP

##### Платформа RV1126/RV1106 (обозначение исходника)

Ниже приведён пример RV1126 ISP и os04a10.

##### Связь: sensor->csi_dphy->isp->ispp

arch/arm/boot/dts/RV1126-evb-v10.dtsi

##### Основные настройки

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

##### Платформа RK356X

Пример ниже использует rk3566 ISP и gc8034 с 4 линиями:

##### Связь: sensor->csi2_dphy0->isp. Основные настройки:

Необходимо настроить data-lanes и включить узел csi2_dphy_hw.

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

##### Подключение к VICAP

##### Платформа RV1126/RV1109

Пример подключения MIPI os04a10 с 4 линиями к VICAP:

##### Связь: sensor->csi dphy->mipi csi host->vicap. Основные настройки:

В data-lanes задают число используемых линий, иначе тип MIPI не распознаётся; DPHY связывают с узлом CSI host.

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

##### Платформа RK356X

Пример подключения gc5025 с 2 линиями к lane2/lane3 DPHY MIPI CSI2 платы rk3566 evb2:

##### Связь: sensor->csi2 dphy->mipi csi host->vicap. Основные настройки:

В data-lanes задают число линий, иначе тип MIPI не распознаётся; DPHY связывают с CSI host; узел csi2 dphy hw необходимо включить.

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

##### Интерфейс LVDS

##### Подключение к VICAP

##### Платформа RV1126/RV1109

Пример для imx327 с 4 линиями; связь показана ниже:

##### Связь: sensor->csi dphy->vicap. Основные настройки:

DPHY не следует связывать с CSI host, иначе данные не принимаются. В data-lanes необходимо указать фактическое число линий, иначе приём также невозможен. bus-type должен быть равен 3; иначе интерфейс LVDS не распознаётся и связь не устанавливается.

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

##### Интерфейс DVP: подключение к VICAP

На RV1126/RV1106/RK356X настройки DTS соответствующих интерфейсов DVP одинаковы. Обозначение RV1106 сохранено из исходника и требует сверки с указанной выше областью применения.

##### BT601

Пример для ar0230 BT601; связь показана ниже:

##### Связь: sensor->vicap. Основные настройки:

Необходимо задать hsync-active/vsync-active, чтобы при асинхронной регистрации v4l2 распознал BT601; без них будет определён BT656. pclk-sample/bus-width необязательны. В g_mbus_config драйвер сенсора должен флагами указать активную полярность hsync-acitve/vsync-active/pclk-ative, иначе данные не принимаются (написание свойств сохранено из исходника для проверки). Нужно сослаться на pinctrl для настройки IOMUX соответствующих GPIO BT601, иначе приём невозможен.

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

##### BT656/BT1120

Использование DTS для BT656 и BT1120 одинаково.

Пример для ava fpga bt1120; связь показана ниже:

##### Связь: sensor->vicap. Основные настройки:

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

#### Регистрация нескольких сенсоров

Один аппаратный ISP создаёт несколько виртуальных устройств и обрабатывает данные нескольких RAW-сенсоров с временным разделением.

##### На платформе RV1126/RV1106 связи isp0->ispp0 и isp1->ispp1 фиксированы в RV1126.dtsi. Можно выбрать подачу в ISP от MIPI либо CIF. Обозначение RV1106 сохранено из исходника.

Например:

##### sensor0->csi_dphy0->csi2->vicap->isp0->ispp0

sensor1->csi_dphy1->isp1->ispp1

Пример: arch/arm/boot/dts/RV1109-evb-ddr3-v12-facial-gate.dts.

gc2053->csi_dphy0->csi2->cif->isp1->ispp1

ov2718->csi_dphy1->isp0->ispp0

При разных разрешениях особенно важна следующая настройка: max-input берёт максимальные ширину, высоту и частоту кадров среди сенсоров.

```dts
&rkispp {
    status = "okay";
    /* the max input w h and fps of mulit sensor */
    max-input = <2688 1520 30>;//Take the maximum width and height and frame rate of different sensors
};
```

##### Платформа RK3566/RK3568

Например:

ov5695->dphy1->isp_vir0

gc5025->dphy2->csi2->vicap->isp_vir1

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

### Описание драйвера CIS

Сенсор камеры взаимодействует с основным контроллером по I2C. Драйвер сенсора реализован как драйвер устройства I2C и использует v4l2 subdev для взаимодействия с драйвером контроллера.

#### Краткое описание типов данных

##### struct i2c_driver

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

<!-- Source: English PDF p36, table unit 176 -->

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

##### struct v4l2_subdev_ops

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

<!-- Source: English PDF p37, table unit 186 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p38, table unit 195 -->

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

##### Следующие частные ioctl используются для запроса сведений о модуле, а также запроса и настройки OTP.

<!-- Source: English PDF p39, table unit 199 -->

| Частный ioctl | Описание |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Получает сведения о модуле; см. struct rkmodule_inf. |
| RKMODULE_AWB_CFG | Переключает компенсацию AWB sensor; если golden AWB не записан в модуле, его можно задать здесь; см. struct rkmodule awb_cfg (написание исходника). |
| RKMODULE_LSC_CFG | Переключает компенсацию LSC sensor; см. struct rkmodule_lsc_cfg. |
| PREISP_CMD_SET_HDRAE_EXP | Настройка экспозиции HDR; см. struct preisp_hdrae_exp_s. |
| RKMODULE_SET_HDR_CFG | Задаёт HDR и переключение обычного/HDR-режима. Драйвер должен поддерживать оба набора настроек; см. struct rkmodule_hdr_cfg. |
| RKMODULE_GET_HDR_CFG | Получает текущий HDR-режим; см. struct rkmodule_hdr_cfg. |
| RKMODULE_SET_CONVERSION_GAIN | Задаёт conversion gain линейного режима, например imx347/os04a10; если sensor не поддерживает функцию, реализация необязательна. |

##### struct v4l2_subdev_video_ops

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

<!-- Source: English PDF p40, table unit 206 -->

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

##### struct v4l2_subdev_pad_ops

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

<!-- Source: English PDF p41, table unit 215 -->

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

##### struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p41, table unit 224 -->

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

##### struct xxxx_mode

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

<!-- Source: English PDF p42, table unit 235 -->

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

##### struct v4l2_mbus_framefmt

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

<!-- Source: English PDF p44, table unit 245 -->

| Имя поля | Описание |
| --- | --- |
| width | Ширина кадра |
| height | Высота кадра |
| code | См. таблицу MEDIA_BUS_FMT |
| field | V4L2_FIELD_NONE: кадровый вывод; V4L2_FIELD_INTERLACED: полевой вывод. |

[Пример]

##### struct rkmodule_base_inf

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

<!-- Source: English PDF p44, table unit 253 -->

| Имя поля | Описание |
| --- | --- |
| sensor | Имя sensor, получаемое из его драйвера. |
| module | Имя модуля из DTS, согласно документации модуля. |
| lens | Имя объектива из DTS, согласно документации модуля. |

[Пример]

##### struct rkmodule_fac_inf

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

<!-- Source: English PDF p45, table unit 261 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| module | Имя модуля определяется по номеру, прочитанному из OTP. |
| lens | Имя объектива определяется по номеру из OTP. |
| year | Год выпуска: например, 12 означает 2012. |
| month | Месяц выпуска |
| day | Дата выпуска |

[Пример]

##### struct rkmodule_awb_inf

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

<!-- Source: English PDF p46, table unit 269 -->

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

##### struct rkmodule_lsc_inf

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

<!-- Source: English PDF p47, table unit 277 -->

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

##### struct rkmodule_af_inf

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

<!-- Source: English PDF p47, table unit 285 -->

| Имя поля | Описание |
| --- | --- |
| flag | Признак действительности группы данных |
| vcm_start | Начальный ток VCM |
| vcm_end | Конечный ток VCM |
| vcm_dir | Направление определения VCM |

[Пример]

##### struct rkmodule_inf

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

<!-- Source: English PDF p48, table unit 293 -->

| Имя поля | Описание |
| --- | --- |
| base | Основные сведения модуля |
| fac | Заводские сведения OTP модуля |
| awb | Измерения AWB в OTP модуля |
| lsc | Измерения LSC в OTP модуля |
| af | Измерения AF в OTP модуля |

[Пример]

##### struct rkmodule_awb_cfg

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

<!-- Source: English PDF p48, table unit 301 -->

| Имя поля | Описание |
| --- | --- |
| enable | Признак включения коррекции AWB |
| golden_r_value | Измерения AWB R типового модуля |
| golden_b_value | Измерения AWB B типового модуля |
| golden_gr_value | Измерения AWB GR типового модуля |
| golden_gb_value | Измерения AWB GB типового модуля |

[Пример]

##### struct rkmodule_lsc_cfg

[Описание]

Конфигурация LSC в OTP модуля.

[Определение]

```text
  struct rkmodule_lsc_cfg {
      __u32 enable;
  } __attribute__ ((packed));
```

[Основные члены]

<!-- Source: English PDF p49, table unit 309 -->

| Имя поля | Описание |
| --- | --- |
| enable | Признак включения коррекции LSC |

[Пример]

##### struct rkmodule_hdr_cfg

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

<!-- Source: English PDF p50, table unit 317 -->

| Имя поля | Описание |
| --- | --- |
| hdr_mode | NO_HDR=0 //обычный режим<br>HDR_X2=5 //HDR из 2 кадров<br>HDR_X3=6 //HDR из 3 кадров |
| struct rkmodule_hdr_esp | Специальный режим HDR |
| enum hdr_esp_mode | HDR_NORMAL_VC=0 //обычный режим виртуального канала<br>HDR_LINE_CNT=1 //счётчик строк (AR0239)<br>HDR_ID_CODE=2 //код идентификации (IMX327) |

[Пример]

##### struct preisp_hdrae_exp_s

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

<!-- Source: English PDF p51, table unit 325 -->

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

В preisp_hdrae_exp_s достаточно учитывать параметры, описанные в «Основных членах». Формулы перевода экспозиции и усиления в значения регистров находятся в IQ XML; подробности см. в описании формата IQ XML. Conversion gain требует поддержки со стороны сенсора; при её отсутствии параметр conversion можно не учитывать. Для HDR2X переданные параметры среднего и короткого кадров записывают в регистры экспозиции, соответствующие двум выходным кадрам сенсора.

[Пример]

#### Краткое описание API

##### xxxx_set_fmt

[Описание]

Устанавливает выходной формат сенсора.

[Синтаксис]

```text
  static int xxxx_set_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Параметры]

<!-- Source: English PDF p51, table unit 337 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fmt | Указатель структуры формата media bus уровня pad | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p52, table unit 339 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_get_fmt

[Описание]

Получает выходной формат сенсора.

[Синтаксис]

```text
  static int xxxx_get_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[Параметры]

<!-- Source: English PDF p52, table unit 346 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fmt | Указатель структуры формата media bus уровня pad | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p52, table unit 348 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

См. таблицу MEDIA_BUS_FMT.

##### xxxx_enum_mbus_code

[Описание]

Перечисляет выходные форматы шины сенсора.

[Синтаксис]

```text
  static int xxxx_enum_mbus_code(struct v4l2_subdev *sd,
                                 struct v4l2_subdev_pad_config *cfg,
                                 struct v4l2_subdev_mbus_code_enum *code)
```

[Параметры]

<!-- Source: English PDF p53, table unit 356 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *code | Указатель структуры перечисления форматов media bus | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p53, table unit 358 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

Ниже сведены соответствующие форматы разных типов изображений; см. таблицу MEDIA_BUS_FMT.

##### xxxx_enum_frame_sizes

[Описание]

Перечисляет выходные размеры изображения сенсора.

[Синтаксис]

```text
  static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                              struct v4l2_subdev_pad_config *cfg,
                              struct v4l2_subdev_frame_size_enum *fse)
```

[Параметры]

<!-- Source: English PDF p53, table unit 366 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *cfg | Указатель структуры сведений subdev pad | Вход |
| *fse | Указатель структуры размера кадра media bus | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p53, table unit 368 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_g_frame_interval

[Описание]

Получает частоту выходных кадров сенсора.

[Синтаксис]

```text
  static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                   struct v4l2_subdev_frame_interval *fi)
```

[Параметры]

<!-- Source: English PDF p54, table unit 375 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| *fi | Указатель структуры частоты кадров уровня pad | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p54, table unit 377 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_s_stream

[Описание]

Настраивает ввод и вывод потока.

[Синтаксис]

```text
  static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

[Параметры]

<!-- Source: English PDF p54, table unit 384 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| on | 1: начать поток; 0: остановить поток. | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p54, table unit 386 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_runtime_resume

[Описание]

Обратный вызов при включении питания сенсора.

[Синтаксис]

```text
  static int xxxx_runtime_resume(struct device *dev)
```

[Параметры]

<!-- Source: English PDF p55, table unit 393 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *dev | Указатель структуры device | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p55, table unit 395 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_runtime_suspend

[Описание]

Обратный вызов при выключении питания сенсора.

[Синтаксис]

```text
  static int xxxx_runtime_suspend(struct device *dev)
```

[Параметры]

<!-- Source: English PDF p55, table unit 402 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *dev | Указатель структуры device | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p55, table unit 404 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_set_ctrl

[Описание]

Задать значение каждого control.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p56, table unit 411 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2_ctrl | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p56, table unit 413 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxx_enum_frame_interval

[Описание]

Перечислить поддерживаемые сенсором параметры межкадрового интервала.

[Синтаксис]

```text
  static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                      struct v4l2_subdev_pad_config *cfg,
                      struct v4l2_subdev_frame_interval_enum *fie)
```

[Параметры]

<!-- Source: English PDF p56, table unit 420 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Экземпляр subdevice | Вход |
| *cfg | Параметры конфигурации pad | Вход |
| *fie | Параметр интервала кадров | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p56, table unit 422 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_g_mbus_config

[Описание]

Получить поддерживаемую конфигурацию шины. Например, если сенсор поддерживает несколько режимов передачи MIPI, параметры можно передавать в соответствии с текущим режимом MIPI сенсора.

[Синтаксис]

```text
  static int xxxx_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
```

[Параметры]

<!-- Source: English PDF p57, table unit 429 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *config | Параметры шины | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p57, table unit 431 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_get_selection

[Описание]

Настроить параметры обрезки. Ширина входа ISP должна быть кратна 16, высота — 8. Если выходное разрешение сенсора не отвечает требованиям выравнивания или не является стандартным, эта функция позволяет обрезать изображение на входе ISP.

[Синтаксис]

```text
  static int xxxx_get_selection(struct v4l2_subdev *sd,
  struct v4l2_subdev_pad_config *cfg,
  struct v4l2_subdev_selection *sel)
```

[Параметры]

<!-- Source: English PDF p57, table unit 438 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Экземпляр subdevice | Вход |
| *cfg | Параметры конфигурации pad | Вход |
| *sel | Параметры кадрирования | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p57, table unit 440 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

##### 1. Реализовать стандартную часть драйвера подустройства I2C.

1.1 Реализовать следующие члены согласно описанию struct i2c_driver:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe: 1). Получить ресурсы устройства CIS, главным образом разобрав ресурсы, определённые в DTS; см. регистрацию устройства CIS (DTS).

1.1) Частные ресурсы RK именуются по схеме rockchip, camera-module-xxx. Драйвер передаёт их пользовательскому camera_engine для определения соответствия параметров качества изображения IQ.

1.2) Определение ресурсов CIS: соответствующие эталонные драйверы RK обычно включают следующие элементы:

<!-- Source: English PDF p58, table unit 452 -->

| Имя поля | Описание |
| --- | --- |
| Опорный такт CIS | При отдельном внешнем кварце получение не нужно. В референсной схеме RK такт обычно выдаёт AP; его нужно получить, обычно имя — xvclk. |
| Управляющие GPIO CIS | Например, выводы Resst и Powerdown (написание Resst сохранено). |
| Управляемое питание CIS | Получите программные ресурсы управления питанием по схеме: gpio, regulator. |

1.3) Проверка ID устройства CIS. После получения необходимых ресурсов рекомендуется прочитать ID устройства для проверки аппаратной части; этот шаг не является обязательным.

1.4) Инициализировать устройство CIS v4l2 и сущности media;

Подустройство v4l2: v4l2_i2c_subdev_init. В драйвере RK CIS subdev должен иметь собственный узел устройства для доступа пользовательского rk_aiq и управления экспозицией;

Сущность media: media_entity_init

2\. Реализовать драйвер подустройства v4l2 согласно описанию struct v4l2_subdev_ops, прежде всего следующие три члена:

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

<!-- Source: English PDF p59, table unit 464 -->

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

<!-- Source: English PDF p60, table unit 466 -->

| Имя поля | Описание |
| --- | --- |
| .s_stream | Переключает поток. При continuous MIPI CLK поток нужно включать именно здесь; преждевременное включение мешает распознать MIPI LP. |
| .g_frame_interval | Получает интервал кадров (частоту) |
| .g_mbus_config | Получает настройки шины. Для sensor MIPI с разными lane либо HDR возвращает конфигурацию текущего режима. |

2.3 Реализовать обратные вызовы согласно описанию struct v4l2_subdev_pad_ops, прежде всего следующие:

<!-- Source: English PDF p60, table unit 468 -->

| Имя поля | Описание |
| --- | --- |
| .enum_mbus_code | Перечисляет форматы текущего драйвера CIS |
| .enum_frame_size | Перечисляет разрешения текущего драйвера CIS |
| .get_fmt | Обязательный callback, через который RKISP получает формат CIS. Типы Bayer raw, SOC yuv, BW raw см. в MEDIA_BUS_FMT; полевой вывод — struct v4l2_mbus_framefmt. |
| .set_fmt | Задаёт формат и разрешение CIS; реализация обязательна. |
| .enum_frame_interval | Перечисляет интервалы кадров sensor с указанием разрешения. |
| .get_selection | Настройка кадрирования; ширина ISP кратна 16, высота — 8. |

2.4 Реализовать согласно описанию struct v4l2_ctrl_ops, прежде всего следующие обратные вызовы:

<!-- Source: English PDF p60, table unit 470 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | RKISP и camera_engine управляют экспозицией CIS различными командами. |

Реализовать каждый control ID по списку V4L2-controls драйвера CIS. Следующие ID предназначены для получения информации и реализуются как стандартные целочисленные меню controls:

<!-- Source: English PDF p61, table unit 472 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_LINK_FREQ | См. стандартные V4L2 controls драйвера CIS; RKISP получает этой командой частоту MIPI. |
| V4L2_CID_PIXEL_RATE | Для MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample. |
| V4L2_CID_HBLANK | См. стандартное определение V4L2 controls драйвера CIS. |
| V4L2_CID_VBLANK | См. стандартное определение V4L2 controls драйвера CIS. |

RK camera_engine получает через эти команды информацию для расчёта экспозиции. Используются следующие формулы:

##### Формулы

```text
line_time = HTS / PIXEL_RATE;
PIXEL_RATE = HTS * VTS * FPS
HTS = sensor_width_out + HBLANK;
VTS = sensor_height_out + VBLANK;
```

Следующие ID относятся к управлению: через эти команды RK camera_engine управляет CIS:

<!-- Source: English PDF p61, table unit 480 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Изменяет VBLANK, затем частоту кадров и максимум экспозиции. |
| V4L2_CID_EXPOSURE | Задаёт экспозицию в строках. |
| V4L2_CID_ANALOGUE_GAIN | Задаёт усиление экспозиции: общее = аналоговое × цифровое; единица — значение регистра усиления. |

##### 3. Драйвер CIS не определяет сведения об аппаратном интерфейсе данных. Связь интерфейсов CIS и AP задаётся через port узла устройства DTS; см. описание Port в разделе регистрации CIS (DTS).

4. Список эталонных драйверов CIS.

## Драйвер VCM

### Регистрация устройства VCM (DTS)

##### Описание частных параметров драйвера RK VCM:

<!-- Source: English PDF p62, table unit 485 -->

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

### Описание драйвера VCM

#### Краткое описание типов данных

##### struct i2c_driver

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

<!-- Source: English PDF p63, table unit 495 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p64, table unit 504 -->

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p65, table unit 515 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получает новое значение control; обычно для изменяющихся volatile (часто read-only) значений, например уровня сигнала. |
| .s_ctrl | Устанавливает новое значение; s_ctrl обязателен. При вызове удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

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

#### Краткое описание API

##### xxxx_get_ctrl

[Описание]

Получить положение мотора.

[Синтаксис]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p65, table unit 527 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p66, table unit 529 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_set_ctrl

[Описание]

Задать положение мотора.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p66, table unit 536 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p66, table unit 538 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p66, table unit 546 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p67, table unit 548 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

##### 1. Реализовать стандартную часть драйвера подустройства i2c.

1.1 Согласно описанию struct i2c_driver реализовать прежде всего следующие части:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получить ресурсы устройства VCM, главным образом из DTS; см. регистрацию устройства VCM (DTS).

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и главным образом предоставляют параметры для сопоставления с устройством камеры.

1.2) Параметры VCM именуются, например, rockchip, vcm-xxx и главным образом задают аппаратные параметры: начальный ток, номинальный ток и режим движения. Они определяют диапазон и скорость движения мотора.

2\. Инициализировать устройство VCM v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер RK VCM требует отдельный узел устройства subdev для доступа пользовательского camera_engine и управления фокусировкой;

Сущность media: media_entity_init;

3\. Алгоритм RK AF задаёт положение по всему ходу объектива модуля в диапазоне [0,64]. Ему соответствует диапазон тока привода VCM [начальный ток, номинальный ток]. Рекомендуется реализовать в функции преобразование между этими диапазонами.

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
.ioctl.compat_ioctl32
```

Этот обратный вызов главным образом реализует частные команды управления RK:

<!-- Source: English PDF p68, table unit 572 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | camera_engine получает длительность перемещения, определяет остановку и перекрытие с экспозицией CIS. Время зависит от расстояния и режима выходного тока VCM IC. |

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p68, table unit 576 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | camera_engine задаёт/читает абсолютное положение объектива; RK AF задаёт весь ход диапазоном [0,64]. |

## Драйвер FlashLight

### Регистрация устройства FLASHLight (DTS)

##### Пример DTS для SGM378:

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

##### Пример dts для управления GPIO и PWM:

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

##### Примечание:

1\. ПО должно различать обработку по типу подсветки. Для инфракрасной подсветки метка узла dts должна содержать ir для обозначения аппаратного типа; для светодиодной подсветки поле ir можно убрать.

2\. Для такой схемы с одним управляющим выводом возможны два варианта: при фиксированной яркости используется gpio; при регулируемой — pwm с изменением коэффициента заполнения. В dts выбирается одна из конфигураций: pwms или enable-gpio.

### Описание драйвера FLASHLight

#### Краткое описание типов данных

##### struct i2c_driver

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

<!-- Source: English PDF p70, table unit 597 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p71, table unit 607 -->

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p72, table unit 618 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получает новое значение control; обычно для изменяющихся volatile (часто read-only) значений, например уровня сигнала. |
| .s_ctrl | Устанавливает новое значение; s_ctrl обязателен. При вызове удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

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

#### Краткое описание API

##### xxxx_set_ctrl

[Описание]

Задать режим вспышки, ток и тайм-аут вспышки.

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p72, table unit 628 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p72, table unit 630 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_get_ctrl

[Описание]

Получить состояние неисправности вспышки.

[Синтаксис]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p73, table unit 637 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p73, table unit 639 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p73, table unit 647 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p73, table unit 649 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

Для светодиодов с непосредственным управлением обычным gpio см. kernel/drivers/leds/leds-rgb13h.c и kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt.

Драйвер микросхемы вспышки можно перенести следующим образом:

##### 1. Реализовать стандартную часть драйвера подустройства i2c.

1.1 Согласно описанию struct i2c_driver реализовать прежде всего следующие части:

struct driver.name

struct driver.pm

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получить ресурсы устройства вспышки, главным образом из DTS; см. регистрацию FLASHLIGHT (DTS);

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и главным образом предоставляют параметры для сопоставления с устройством камеры.

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

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 Реализовать обратные вызовы согласно описанию v4l2_subdev_core_ops, прежде всего следующие:

```text
.ioctl.compat_ioctl32
```

Этот обратный вызов главным образом реализует частные команды управления RK:

<!-- Source: English PDF p75, table unit 676 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_FLASH_TIMEINFO | camera_engine получает момент включения LED и проверяет, начинается ли экспозиция CIS после вспышки. |

2.2 Реализовать обратные вызовы согласно описанию v4l2_ctrl_ops, прежде всего следующие:

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl и .s_ctrl реализуют следующие команды через стандартные controls v4l2:

<!-- Source: English PDF p75, table unit 680 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_FLASH_FAULT | Получает ошибки вспышки |
| V4L2_CID_FLASH_LED_MODE | Задаёт LED-режим: V4L2_FLASH_LED_MODE_NONE, V4L2_FLASH_LED_MODE_TORCH, V4L2_FLASH_LED_MODE_FLASH. |
| V4L2_CID_FLASH_STROBE | Включает вспышку |
| V4L2_CID_FLASH_STROBE_STOP | Выключает вспышку |
| V4L2_CID_FLASH_TIMEOUT | Задаёт максимальное непрерывное время свечения flash |
| V4L2_CID_FLASH_INTENSITY | Задаёт ток flash |
| V4L2_CID_FLASH_TORCH_INTENSITY | Задаёт ток torch |

## Драйвер FOCUS, ZOOM, P-IRIS

Здесь рассматривается управление шаговым мотором для автофокуса (FOCUS), зума (ZOOM) и автоматической диафрагмы (P-IRIS). Из-за одинакового способа управления моторами и особенностей аппаратной реализации три функции объединены в одном драйвере. В зависимости от микросхемы, например с управлением SPI, драйвер можно оформить как подустройство SPI. В этой главе на примере MP6507 и MS41908 описаны необходимые структуры данных, каркас и меры предосторожности.

### Регистрация устройства MP6507 (DTS)

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

##### Описание частных определений RK:

<!-- Source: English PDF p78, table unit 688 -->

| Имя поля | Описание |
| --- | --- |
| rockchip,<br>camera-module-index | Номер камеры для сопоставления по полю. |
| rockchip,<br>camera-module-facing | Ориентация камеры для сопоставления по полю. |
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
| focus-speed-down-table | Максимум торможения фокусировки должен быть ниже максимума разгона. Если разгон недействителен, торможение также отключено, движение равномерное на начальной скорости. Без отдельной таблицы торможение симметрично разгону. |
| zoom-speed-up-table | Разгон зума задаётся трапецеидальной либо S-образной таблицей. Без неё либо при одном значении — равномерная начальная скорость. Минимум не выше максимальной стартовой скорости, максимум не выше максимальной рабочей. |
| zoom-speed-down-table | Максимум торможения зума ниже максимума разгона. Если разгон недействителен, движение равномерное на начальной скорости; без таблицы торможение симметрично разгону. |

#### Краткое описание типов данных

##### struct platform_driver

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

<!-- Source: English PDF p80, table unit 698 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p81, table unit 707 -->

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p81, table unit 716 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получает новое значение control; обычно для изменяющихся volatile (часто read-only) значений, например уровня сигнала. |
| .s_ctrl | Устанавливает новое значение; s_ctrl обязателен. При вызове удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Краткое описание API

##### xxxx_set_ctrl

[Описание]

Вызвать стандартный v4l2_control для задания положения фокуса, зума и диафрагмы P.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p82, table unit 724 -->

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

<!-- Source: English PDF p82, table unit 728 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p82, table unit 730 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

##### xxxx_get_ctrl

[Описание]

Вызвать стандартный v4l2_control для получения текущего положения фокуса, зума и диафрагмы P.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p82, table unit 735 -->

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

<!-- Source: English PDF p83, table unit 739 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p83, table unit 741 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Реализация пользовательского ioctl главным образом получает временные сведения о фокусе, зуме и диафрагме P (метки начала и конца движения). Поскольку у используемого объектива нет устройства позиционирования, при необходимости требуется сброс положения мотора.

##### Реализуемые пользовательские команды:

<!-- Source: English PDF p83, table unit 746 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Время фокусировки для проверки действительности кадра после её завершения. |
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

<!-- Source: English PDF p84, table unit 750 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p84, table unit 752 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

Для микросхем с управлением SPI можно переносить драйвер в рамках SPI. Эталонный драйвер RK использует MP6507: управляющий сигнал формируется напрямую pwm, а MP6507 усиливает мощность. Поэтому перенос выполнен непосредственно на основе platform. Эталон: /kernel/drivers/media/i2c/mp6507.c.

Этапы переноса:

##### 1. Реализовать стандартную часть драйвера подустройства platform.

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получить ресурсы устройства, главным образом из DTS; см. регистрацию MP6507 (DTS);

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить конфигурацию pwm. При данном управлении мотором фазы A и B сдвинуты на 90 градусов. Это достигается центрированием PWM фазы B. В узле pwm DTS настроить center-aligned; подробности см. в регистрации MP6507 (DTS).

![Оригинальный английский рисунок 6, страница 85](/docs/rockchip-vi-driver/assets/en-p85-X457.png)

*Оригинальный английский рисунок 6, страница 85*

Последовательность возбуждения; вращение вала CW.

| Фаза / шаг | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| A | + | + | − | − |
| A̅ | − | − | + | + |
| B | − | + | + | − |
| B̅ | + | − | − | + |

1.3) Получить вывод разрешения. MP6507 требуется четыре PWM для формирования сигналов шагового мотора. При ограниченном количестве аппаратных PWM моторы фокуса, зума и диафрагмы P имеют отдельные MP6507, включаемые через gpio: PWM разделяются по времени. Недостаток — одновременно работает только один мотор, а два других ожидают завершения предыдущей операции.

1.4) Получить аппаратные ограничения и ресурсы каждого мотора: максимальное число шагов, максимальную начальную и рабочую скорость, данные кривой ускорения.

2\. hrtimer_init инициализирует таймер. pwm работает непрерывно, поэтому требуется отсчёт времени: после заданного числа импульсов прерывание таймера отключает pwm. При ускорении после заданного числа импульсов прерывание также изменяет частоту pwm для ускорения шагового мотора.

3\. init_completion реализует синхронизацию через completion: следующая операция мотора возможна только после завершения предыдущего движения.

4\. Инициализировать устройство v4l2 и сущность media.

Подустройство v4l2: v4l2_i2c_subdev_init. Драйвер требует отдельный узел subdev для доступа пользовательского rkaiq и управления мотором;

Сущность media: media_entity_init;

5\. Имя устройства вспышки:

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

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

<!-- Source: English PDF p86, table unit 783 -->

| Имя поля | Описание |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | Время фокусировки для проверки действительности кадра после её завершения. |
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

<!-- Source: English PDF p86, table unit 788 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | Управляет фокусом: 0 — минимальное фокусное расстояние, резкость вблизи. |
| V4L2_CID_ZOOM_ABSOLUTE | Управляет зумом: 0 — минимальное увеличение и максимальное поле зрения. |
| V4L2_CID_IRIS_ABSOLUTE | Управляет P-диафрагмой: 0 — закрыта (исходник заканчивается **). |

##### 3. Примеры кривой ускорения шагового мотора:

3.1 Трапециевидная кривая: можно ускоряться и замедляться с равными временными интервалами и приращениями скорости, как на рисунке.

![Оригинальный английский рисунок 7, страница 86](/docs/rockchip-vi-driver/assets/en-p86-X460.png)

*Оригинальный английский рисунок 7, страница 86*

3.2 S-образная кривая

Если трапециевидное ускорение не подходит, можно использовать S-образное по формуле:

`Speed = Vmin + ((Vmax-Vmin) / (1 + exp(-fac * (i-Num) / Num)));`

Vmin — начальная скорость мотора, Vmax — целевая; fac — коэффициент кривой, обычно 4~6: чем он больше, тем круче середина кривой; i — номер участка скорости, при 32 участках принимает 0~31; Num — половина числа участков, при 32 участках num равен 16.

![Оригинальный английский рисунок 8, страница 87](/docs/rockchip-vi-driver/assets/en-p87-X463.png)

*Оригинальный английский рисунок 8, страница 87*

### Регистрация устройства MS41908 (DTS)

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

#### Основное описание:

<!-- Source: English PDF p88, table unit 800 -->

| Имя поля | Описание |
| --- | --- |
| pinctrl-0 | Определения SPI pinmux по схеме, например pinctrl-0 = &lt;&amp;spi0m0_clk &amp;spi0m0_cs0n &amp;spi0m0_miso &amp;spi0m0_mosi&gt;;. |
| assigned-clocks<br>assigned-clock-rates | Настройка такта SPI, рекомендуется 100MHz. |
| reg | reg = &lt;0&gt;; для cs0; reg = &lt;1&gt;; для cs1. |
| rockchip,camera-module-index | Номер камеры для сопоставления. |
| rockchip,camera-module-facing | Ориентация камеры для сопоставления. |
| reset-gpios | Вывод сброса ms41908; не требуется при постоянной аппаратной подтяжке вверх. |
| vd_fz-period-us | Период импульса обновления регистров шагового драйвера, общий для двух двигателей. Превышение vd вызывает потерю шагов; драйвер удерживает время одиночного движения внутри vd. |

#### Описание FOCUS:

<!-- Source: English PDF p89, table unit 802 -->

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

##### Описание оптопары:

<!-- Source: English PDF p90, table unit 804 -->

| Имя поля | Описание |
| --- | --- |
| focus-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| focus-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| focus-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| focus-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| focus-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### Описание ZOOM:

<!-- Source: English PDF p91, table unit 807 -->

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

##### Описание оптопары:

<!-- Source: English PDF p91, table unit 809 -->

| Имя поля | Описание |
| --- | --- |
| zoom-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| zoom-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| zoom-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### Описание ZOOM1:

<!-- Source: English PDF p92, table unit 812 -->

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

##### Описание оптопары:

<!-- Source: English PDF p93, table unit 814 -->

| Имя поля | Описание |
| --- | --- |
| zoom1-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| zoom1-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| zoom1-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| zoom1-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| zoom1-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### Описание PIRIS:

<!-- Source: English PDF p94, table unit 817 -->

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

##### Описание оптопары:

<!-- Source: English PDF p95, table unit 819 -->

| Имя поля | Описание |
| --- | --- |
| piris-pic | Вывод C оптопары обнаруживает переход уровня, его граница задаёт начало отсчёта. |
| piris-pia | Вывод A управляет фотодиодом: высокий при калибровке, низкий при нормальной работе, иначе влияет на изображение. |
| piris-pie | Можно аппаратно заземлить; при GPIO-управлении задайте низкий уровень. |
| piris-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |
| piris-min-pos | Измерьте число шагов по обе стороны начала оптопары и внесите в DTS; допускается больше фактического. |

Примечание: объективу без позиционирования оптопарой параметры оптопары не требуются.

#### Описание DCIRIS:

<!-- Source: English PDF p95, table unit 822 -->

| Имя поля | Описание |
| --- | --- |
| use-dc-iris | Использовать ли DC-IRIS |
| vd_iris-gpios | Вывод синхроимпульса применения регистров DC-диафрагмы. |
| dc-iris-reserved-polarity | Полярность DC-диафрагмы; если 0 означает полное открытие, свойство инвертирует её. |
| dc-iris-max-log | Целевой диапазон DC-диафрагмы 0~1023; фактический может быть уже, параметр ограничивает его. |

#### Краткое описание типов данных

##### struct spi_driver

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

<!-- Source: English PDF p96, table unit 830 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p97, table unit 839 -->

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

##### struct v4l2_ctrl_ops

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

<!-- Source: English PDF p97, table unit 848 -->

| Имя поля | Описание |
| --- | --- |
| .g_volatile_ctrl | Получает новое значение, обычно для volatile и часто read-only controls, например меняющегося уровня сигнала. |
| .s_ctrl | Устанавливает новое значение; s_ctrl обязателен. При вызове удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Краткое описание API

##### xxxx_set_ctrl

[Описание]

Вызвать стандартный v4l2_control для задания положения фокуса, зума и диафрагмы P.

Драйвер реализует следующие стандартные команды v4l2:

<!-- Source: English PDF p98, table unit 856 -->

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

<!-- Source: English PDF p98, table unit 860 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[Описание]

Реализация пользовательского ioctl главным образом получает временные сведения о фокусе, зуме и диафрагме P (метки начала и конца движения). Поскольку у используемого объектива нет устройства позиционирования, при необходимости требуется сброс положения мотора.

##### Пользовательские команды драйвера:

<!-- Source: English PDF p99, table unit 865 -->

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

1\. Для устранения ошибки абсолютного положения мотора из-за люфта шестерён одно направление принимается за положительное, другое — за отрицательное; исходно шестерня прижата в положительном направлении. При отрицательном ходе выполняют дополнительно n шагов, превышающих люфт, затем n шагов обратно в положительном направлении. Такой возврат сохраняет положительный прижим и точность абсолютного положения. Но число шагов возврата превышает люфт; при последовательных отрицательных перемещениях во время ручной или автоматической фокусировки постоянный возврат воспринимается как дрожание, поэтому он нужен не каждый раз. В новых интерфейсах RK_VIDIOC_FOCUS_SET_POSITION и RK_VIDIOC_ZOOM_SET_POSITION необходимость возврата определяет алгоритм af. Стандартные команды v4l2 V4L2_CID_FOCUS_ABSOLUTE и V4L2_CID_ZOOM_ABSOLUTE не выполняют возврат и применяются только вручную. RK_VIDIOC_ZOOM_SET_POSITION содержит параметры focus и zoom; синхронная подстройка фокуса при зумировании обеспечивает естественный переход изображения.

2\. Первоначально люфт компенсировали параметром focus-backlash, добавляя при отрицательном движении соответствующее число шагов. Но индивидуальные различия люфта объективов приводят к ошибкам и большому объёму калибровки, поэтому параметр исключён из рекомендуемого применения. Реализация сохранена в драйвере и может использоваться при невысоких требованиях к точности положения.

[Синтаксис]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[Параметры]

<!-- Source: English PDF p100, table unit 874 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p100, table unit 876 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

Драйвер микросхемы с управлением SPI можно перенести на основе SPI, используя MS41908 как образец. Эталон: /kernel/drivers/media/spi/ms41908.c.

Этапы переноса:

##### 1. Реализовать стандартную часть драйвера подустройства spi.

1.1 Согласно описанию struct spi_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1) Получить ресурсы устройства, главным образом из DTS; см. регистрацию MS41908 (DTS);

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить параметры настройки мотора, определяемые требованиями функций микросхемы; по возможности параметры движения следует сделать настраиваемыми.

2\. hrtimer_init инициализирует таймер. ms41908 запускается сигналом vd; таймер фиксирует период vd для удобства управления. Регистры ms41908 вступают в силу после vd, поэтому новые значения можно записывать заранее, перед сигналом. Скорость и число шагов, задаваемые регистрами, должны укладываться в период vd; шаги за его пределами теряются.

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

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

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

## Драйвер DC-IRIS

В отличие от P-IRIS, DC-IRIS не позволяет точно определить открытие диафрагмы. Обычно она полностью открыта; если при минимальной экспозиции остаётся переэкспонирование или при максимальной — недоэкспонирование, начинается регулировка диафрагмы. Используется мотор постоянного тока с отрицательной обратной связью от датчика Холла для сглаживания скорости. Драйвер управляет одним PWM: при заполнении менее 20% диафрагма медленно закрывается до конца, причём меньшее заполнение ускоряет закрытие; свыше 40% она открывается, и большее заполнение ускоряет открытие; в диапазоне 20%~40% положение сохраняется. Пороги 20% и 40% не фиксированы и зависят от частоты pwm и точности аппаратных компонентов. Эталон: /kernel/drivers/media/i2c/hall-dc-motor.c.

### Регистрация устройства DC-IRIS (DTS)

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

#### Краткое описание типов данных

##### struct platform_driver

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

<!-- Source: English PDF p103, table unit 917 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p104, table unit 926 -->

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

##### struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p104, table unit 935 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### Краткое описание API

##### xxxx_set_ctrl

[Описание]

Стандартный v4l2_control задаёт положение диафрагмы. На практике точное положение DC-диафрагмы неизвестно, поэтому здесь задаётся коэффициент заполнения pwm.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p105, table unit 943 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Задаёт PWM диафрагмы в диапазоне 0~100. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p105, table unit 947 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p105, table unit 949 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p105, table unit 956 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p105, table unit 958 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

Эталонный драйвер: /kernel/drivers/media/i2c/hall-dc-motor.c.

Этапы переноса:

##### 1. Реализовать стандартную часть драйвера подустройства platform.

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получить ресурсы устройства, главным образом из DTS; см. регистрацию DC-IRIS (DTS);

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

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

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

<!-- Source: English PDF p107, table unit 985 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | Задаёт PWM диафрагмы в диапазоне 0~100. |

## Драйвер RK-IRCUT

IRCUT управляется двумя проводами с питанием 3.5v~6v. Для переключения меняют полярность и подают питание на 100ms±10%. Драйвер двумя gpio задаёт направление тока моторного драйвера; команды gpio — open (красный провод) и close (чёрный). При токе от open к close устанавливается ИК-отсекающий фильтр для дня; от close к open — прозрачное стекло для ночи.

### Регистрация устройства RK-IRCUT (DTS)

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

#### Краткое описание типов данных

##### struct platform_driver

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

<!-- Source: English PDF p108, table unit 997 -->

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

##### struct v4l2_subdev_core_ops

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

<!-- Source: English PDF p109, table unit 1006 -->

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

##### struct v4l2_ctrl_ops

[Описание]

Операции управления, которые должен предоставить драйвер.

[Определение]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[Основные члены]

<!-- Source: English PDF p110, table unit 1015 -->

| Имя поля | Описание |
| --- | --- |
| .s_ctrl | Устанавливает новое значение control; s_ctrl обязателен. Удерживается ctrl-&gt;handler-&gt;lock, исключая другой доступ к controls обработчика. |

[Пример]

```text
  static const struct v4l2_ctrl_ops ircut_ctrl_ops = {
      .s_ctrl = ircut_s_ctrl,
  };
```

#### Краткое описание API

##### xxxx_set_ctrl

[Описание]

Переключить IRCUT стандартным v4l2_control.

Реализуются следующие стандартные команды v4l2:

<!-- Source: English PDF p110, table unit 1023 -->

| Имя параметра | Описание |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 — CLOSE, ИК-свет проходит; 3 — OPEN, ИК-свет не проходит. |

[Синтаксис]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[Параметры]

<!-- Source: English PDF p110, table unit 1027 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *ctrl | Указатель структуры v4l2 control | Вход |

[Возвращаемое значение]

<!-- Source: English PDF p110, table unit 1029 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

```text
xxxx_ioctl xxxx_compat_ioctl
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

<!-- Source: English PDF p111, table unit 1036 -->

| Имя параметра | Описание | Ввод/вывод |
| --- | --- | --- |
| *sd | Указатель структуры v4l2 subdev | Вход |
| cmd | Команда ioctl | Вход |
| *arg/arg | Указатель параметра | Выход |

[Возвращаемое значение]

<!-- Source: English PDF p111, table unit 1038 -->

| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Не 0 | Ошибка |

#### Этапы переноса драйвера

Эталонный драйвер: /kernel/drivers/media/i2c/rk_ircut.c.

Этапы переноса:

##### 1. Реализовать стандартную часть драйвера подустройства platform.

1.1 Согласно описанию struct platform_driver реализовать следующие основные части:

struct driver.name

struct driver. of_match_table

Функция probe

Функция remove

1.2 Подробное описание реализации probe:

1\. Получить ресурсы устройства, главным образом из DTS; см. регистрацию RK-IRCUT (DTS);

1.1) Частные ресурсы RK именуются, например, rockchip, camera-module-xxx и предоставляют параметры для сопоставления с устройством камеры.

1.2) Получить ресурсы gpio open и close;

2\. init_completion реализует синхронизацию через completion. Переключение IRCUT занимает около 100ms, поэтому completion должен гарантировать завершение предыдущего переключения до следующей операции;

3\. Создать рабочую очередь и выполнять переключение в ней, чтобы избежать длительной блокировки;

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

##### 2. Реализовать драйвер подустройства v4l2, прежде всего следующие два члена:

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

<!-- Source: English PDF p112, table unit 1072 -->

| Имя поля | Описание |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 — CLOSE, ИК-свет проходит; 3 — OPEN, ИК-свет не проходит. |

## Инструменты media-ctl и v4l2-ctl

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

Примечание: отключить тракт ispp, подключить main_path и захватить RAW через main_path. Без -d media-ctl использует /dev/media0. Требуется проверить, к какому узлу подключён rkisp-isp-subdev; обычно это /dev/media1.

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

Примечание: драйвер isp вызывает команды управления подустройством камеры, поэтому экспозицию можно задавать через video3 (main_path или self_path). vicap этих команд не вызывает, и настройка непосредственно на узле захвата завершится неудачно. Нужно найти узел камеры /dev/v4l-subdevX и настраивать его напрямую.

## Оптимизация памяти RV1109/RV1126

```text
MIPI -> DDR_1 -> ISP -> DDR_2 -> ISPP(TNR) -> DDR_3 -> ISPP(NR&Sharp) -> DDR_4 -> ISPP(FEC) -> DDR_5
```

1\. DDR_1: RAW-данные Vicap или isp MIPI записываются в ddr, после чего isp читает их из ddr для обработки.

Занимаемая память: buf_cnt * buf_size * N, где N = 1 для линейного режима, 2 для hdr2, 3 для hdr3.

buf_size: `ALIGN(width * bpp / 8, 256) * height;`, где bpp — разрядность: raw8, raw10 или raw12.

buf_cnt: по умолчанию 4, задаётся в hwi/isp20/CamHwIsp20.h библиотеки aiq; минимум 3.

```text
#define ISP_TX_BUF_NUM 4
#define VIPCAP_TX_BUF_NUM 4
```

2\. DDR_2: данные isp fbc yuv420 и gain записываются в ddr, затем ispp читает их для обработки.

Занимаемая память: buf_size * buf_cnt.

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 4 буфера в режиме tnr 3to1 и 3 буфера в 2to1; режим задаётся в iq xml.

3\. DDR_3: данные ispp tnr fbc yuv420 и gain записываются в ddr, затем повторно читаются ispp NR&Sharp для обработки.

Занимаемая память: buf_size * buf_cnt.

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt: 2, минимальное значение.

4\. DDR_4: данные ispp NR&Sharp yuyv записываются в ddr, затем читаются ispp fec для обработки.

Занимаемая память: buf_size * buf_cnt (при выключенной fec память не занимается).

```text
buf_size: width * height * 2
```

buf_cnt: 2, минимальное значение.

5\. DDR_5: буферы четырёх выходных потоков ispp; размер рассчитывается по заданным пользователем разрешению, формату и buf_cnt.

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

Пояснение к примеру памяти: включить отладку cma. Одна страница равна 4K, 26091 страниц — 104364K; требуется выравнивание 4M, поэтому isp_reserved задаётся как 104M.

## Оптимизация задержки RV1109/RV1126

##### 1. Настроить vicap wait-line

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

##### 2. Настроить isp wait-line

Задать wait-line в узле isp DTS. Например, при высоте 1520 и wait-line 760 передача ispp начинается после обработки строки 760. Настроить wait-line по времени обработки ISP и ISPP.

```text
&rkisp_vir0 {
      wait-line = <760>;
};
```

Для отладки можно настроить /sys/module/video_rkisp/parameters/wait_line до открытия isp video.

Примечание: при слишком малом wait-line и работе ISPP быстрее ISP формат сжатия FBC вызывает состояние hold. Эта возможность не поддерживается с Motion и несколькими сенсорами.

##### 3. Настроить ispp wait-line для четырёх потоков

Задать wait-line в узле ispp DTS. Например, при высоте 1520 и wait-line 896 изображение передаётся далее после обработки строки 896. Настроить wait-line по времени обработки ISPP (nr или fec) и следующего блока.

```text
&rkispp_vir0 {
     status = "okay";
     wait-line = <896>;
};
```

Для отладки можно настроить /sys/module/video_rkispp/parameters/wait_line до открытия ispp video.

Примечание: при слишком малом wait-line и работе следующего блока быстрее ISPP обработка изображения нарушается. Несколько сенсоров не поддерживаются.

##### 4. Повысить скорость аппаратной обработки

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
   &rkisp_mmu {          status = "disabled";    };
  &rkisp {
        memory-region = <&isp_reserved>;
  };
  &rkispp_mmu {          status = "disabled";   };
  &rkispp {
        memory-region = <&isp_reserved>;
  };
```

## Частые вопросы

### Как получить версию драйвера

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

### Как проверить загрузку драйвера RKISP

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

### Как захватить RAW и YUV от CIS

После разработки драйвера можно напрямую получить выходные данные CIS стандартной командой v4l2-ctl. Справка: https://www.mankier.com/1/v4l2-ctl.

##### Пример:

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

#### Поддерживаемые устройства

##### RV1109/RV1126

<!-- Source: English PDF p119, table unit 1185 -->

| Устройство | Интерфейс | Формат | Имя узла устройства | Вывод Raw | Вывод YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Неупакованный Raw | Нет |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Неупакованный Raw; упакованный Raw | Нет |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Нет | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Неупакованный Raw; упакованный Raw | Нет |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Неупакованный Raw | nv12<br>nv16 |
| ISPP | Только чтение DDR | YUV | rkispp_m_bypass<br>rkispp_scale0<br>rkispp_scale1<br>rkispp_scale2 | Нет | nv12<br>nv16 |

##### RK356X

<!-- Source: English PDF p119, table unit 1187 -->

| Устройство | Интерфейс | Формат | Имя узла устройства | Вывод Raw | Вывод YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | Неупакованный Raw | Нет |
| VICAP | MIPI/LVDS | RAW | video0~video3 | Неупакованный Raw; упакованный Raw | Нет |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | Нет | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | Неупакованный Raw; упакованный Raw | Нет |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | Неупакованный Raw | nv12<br>nv16 |

Примечание:

1\. Команда запроса имён узлов: media-ctl -p -d /dev/mediaX (X = 0, 1, 2, 3...).

#### Формат хранения RAW

##### Неупакованный формат RAW

В неупакованном формате raw10 и raw12 сенсора хранятся в 16 битах с выравниванием по старшим битам. Расположение raw12 на примере четырёхбайтового участка памяти:

![Оригинальный английский рисунок 9, страница 120](/docs/rockchip-vi-driver/assets/en-p120-X579.png)

*Оригинальный английский рисунок 9, страница 120*

##### Упакованный формат RAW

Расположение raw12 на примере четырёхбайтового участка памяти:

![Оригинальный английский рисунок 10, страница 120](/docs/rockchip-vi-driver/assets/en-p120-X580.png)

*Оригинальный английский рисунок 10, страница 120*

##### Важно:

При входе Raw10 или Raw12 устройство ISP mainpath всегда выдаёт неупакованный RAW в формате Raw12.

#### Примеры:

##### Вывод RAW через VICAP

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

##### Неупакованный RAW через ISP maipath (написание заголовка оригинала сохранено)

1\. Для захвата mainpath нужно переключить стандартную выходную связь isp rkisp-bridge-ispp на mainpath следующей командой:

```text
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

Примечание: без -d используется media0. Если rkisp-isp-subdev находится в другом узле media, указать его через -d.

0 после "rkisp-bridge-ispp" означает pad0, sink; подробности см. в документации v4l2.

2\. По умолчанию isp выдаёт YUYV8_2X8. Для перехода на Bayer RAW использовать следующую команду:

```text
      media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
```

Примечание: rkisp-isp-subdev не обязательно находится в media0. -d задаёт устройство; сначала определить нужный узел media.

2 после "rkisp-isp-subdev" означает pad2, source; подробности см. в документации v4l2.

После изменения проверить результат через media-ctl -p -d /dev/mediaX (X=0,1,2,...). Только после вступления настройки в силу захватываются исходные RAW-данные.

3\. Команда v4l2-ctl

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### Вывод YUV через VICAP:

Вход должен быть в формате YUV; при входном RAW vicap не может выдавать YUV.

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### Вывод YUV через ISP:

```text
  v4l2-ctl -d /dev/video5  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

Примечание:

1\. Для isp можно захватывать mainpath или selfpath; video5 приведён лишь как пример, настройка должна соответствовать реальной конфигурации.

2\. При входном RAW ISP может преобразовывать RAW в YUV и выполнять обработку изображения. Модулями обработки должен управлять RK AIQ. Эти команды задают только поток данных, оставляя параметры обработки по умолчанию драйвера, поэтому качество изображения обычно некорректно.

##### Вывод YUV через ISPP:

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

<!-- Source: English PDF p122, table unit 1235 -->

| Узел | Возможности выхода |
| --- | --- |
| rkispp_m_bypass | Полное разрешение, формат YUV |
| rkispp_scale0 | Полное либо уменьшенное YUV; масштаб [1 8], максимальная ширина 3264. |
| rkispp_scale1 | Полное либо уменьшенное YUV; масштаб [2 8], максимальная ширина 1280. |
| rkispp_scale2 | Полное либо уменьшенное YUV; масштаб [2 8], максимальная ширина 1280. |

### Как переключить разрешение выхода CIS

1\. Для драйвера сенсора с несколькими разрешениями перед захватом RAW другого разрешения переключить текущий режим следующей командой:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"m01_f_os04a10 1-0036-1":0[fmt:SBGGR12_1X12/2688x1520]'
```

Примечание: m01_f_os04a10 1-0036-1 — имя узла сенсора, за которым идёт требуемый формат; он должен поддерживаться драйвером сенсора.

2\. Для vicap достаточно настроить узел сенсора; для isp дополнительно требуются входной и выходной форматы. Пример команды:

```text
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[crop:(0,0)/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[crop:(0,0)/2688x1520]'
```

### Как задать экспозицию CIS

1\. Найти узел сенсора через media-ctl -p -d /dev/mediaX; имя имеет вид /dev/v4l-subdevX. Пример команды:

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

### Как поддержать монохромную камеру

Драйвер CIS должен выбрать для монохромного сенсора один из следующих трёх выходных форматов:

```text
  MEDIA_BUS_FMT_Y8_1X8 (sensor 8bit output)
  MEDIA_BUS_FMT_Y10_1X10 (sensor 10bit output)
  MEDIA_BUS_FMT_Y12_1X12 (sensor 12bit output)
```

То есть возвращать указанный формат в xxxx_get_fmt и xxxx_enum_mbus_code.

RKISP выполняет специальную настройку этих трёх форматов для захвата монохромного изображения.

Если приложению нужен Y8, следует использовать только SP Path: лишь этот тракт поддерживает вывод Y8.

### Как поддержать объединение чётных и нечётных полей

RKISP поддерживает объединение чётных и нечётных полей при следующих условиях:

1\. Интерфейс MIPI должен выдавать счётчик кадров (из коротких пакетов начала и конца кадра); по нему RKISP определяет чётность поля;

2\. Интерфейс BT656 должен выдавать стандартные SAV/EAV, где bit6 обозначает чётность поля; по нему RKISP определяет текущее поле;

3\. Функция доступна только у видеоустройства RKISP1_selfpath драйвера RKISP. При ошибочном обращении приложения к другим узлам драйвер выдаёт:

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

##### Реализация драйвера:

format.field драйвера следует задать как V4L2_FIELD_INTERLACED, обозначающий чересстрочный выход, и возвращать это значение из xxxx_get_fmt. Пример: driver/media/i2c/tc35874x.c.

### Как просмотреть отладочные сведения

1\. Проверить сведения media pipeline, соответствующие настройкам камеры в dts.

```text
  media-ctl -p -d /dev/mediaX (X = 0, 1, 2 ..)
```

2\. Просмотреть proc: текущие состояния isp/ispp и входные/выходные кадры. Команду cat можно выполнить несколько раз.

```text
  cat /proc/rkisp*
```

3\. Для журналов драйвера задать уровень debug узлам isp и ispp; большее значение даёт больше сведений.

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

1\. На месте возникновения проблемы: 1->2->4->3.

2\. Воспроизведение: 3->Запуск->Воспроизведение->1->2->4.

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
  Input      rkisp0 Format:FBC420 Size:2688x1520 (frame:26510 rate:32ms
  delay:13ms)
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

src subdev: входное устройство, обычно сенсор; включает ориентацию камеры, индекс, имя, шину i2c, 7bit адрес ведомого и другие сведения.

interface: физический интерфейс данных, например mipi, lvds, dvp.

vc channel: фактически используемый виртуальный канал многоканальной передачи MIPI.

hdr mode: режим сенсора — normal, hdr_x2 или hdr_x3.

format: тип входных данных.

crop.bounds: параметры обрезки задаются в .get_selection драйвера сенсора для необходимой обрезки входных данных.

Output Info: сводка выходных данных.

format: тип выходных данных.

compact: по умолчанию упакованный вывод; определения см. в разделе захвата RAW и YUV от CIS.

frame amount:

early: в режиме пробуждения буфер передаётся isp после захвата wait_line строк, тогда как обычно передаётся полный кадр. early показывает выигрыш времени при ранней передаче буфера до завершения кадра. Настройку см. в руководстве по оптимизации задержки RV1109/RV1126.

single readout: в режиме hdr время передачи одного кадра равно времени передачи длинного кадра.

total readout: в hdr интервал от начала передачи длинного до конца короткого кадра — исходное время передачи составного кадра.

rate: межкадровый интервал.

fps: частота кадров.

irq statistics: сведения о прерываниях.

total: общее число прерываний, включая frame end и err.

csi over flow: число прерываний переполнения.

csi bandwidth lack: число прерываний недостаточной пропускной способности.

frame dma end: число прерываний конца кадра, равное числу кадров сенсора с момента stream start.

## Приложение A. Controls V4L2 драйвера CIS

<!-- Source: English PDF p129, table unit 1327 -->

| CID | Описание |
| --- | --- |
| V4L2_CID_VBLANK | Вертикальное гашение — простой после кадра без данных, в строках. Длина строки равна ширине изображения плюс горизонтальное гашение при скорости V4L2_CID_PIXEL_RATE того же subdev. |
| V4L2_CID_HBLANK | Горизонтальное гашение — простой после строки без данных, в пикселях. |
| V4L2_CID_EXPOSURE | Определяет экспозицию sensor, ограниченную интервалом кадров. |
| V4L2_CID_ANALOGUE_GAIN | Аналоговое усиление применяется ко всем цветовым компонентам матрицы до АЦП. |
| V4L2_CID_PIXEL_RATE | Скорость пикселей source pad subdev, read-only, пикселей/сек. Для MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample. |
| V4L2_CID_LINK_FREQ | Частота шины вместе с pixel code media bus и типом шины (такты на образец) задаёт V4L2_CID_PIXEL_RATE массива пикселей, либо иной точки у не-sensor устройства. Частота кадров рассчитывается из pixel clock, ширины, высоты и обоих гашений. Если pixel rate задан вне subdev массива, этой информации недостаточно: только в массиве гашение точно и дополнительного гашения нет. Частоту кадров выбирают горизонтальным и вертикальным гашением. Единица control — Hz. |

## Приложение B. Таблица MEDIA_BUS_FMT

<!-- Source: English PDF p130, table unit 1329 -->

| Тип CIS sensor | Формат выхода sensor |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| Raw BW sensor с выводом только Y (чёрно-белый) | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

## Приложение C. Эталонные драйверы CIS

<!-- Source: English PDF p131, table unit 1331 -->

| Интерфейс данных CIS | Тип выходных данных CIS | Кадр/поле | Референсный драйвер |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | Кадр | 0.3M<br>ov7750.c<br>gc0403.c<br>1.2M<br>ov9750.c<br>jx-h65.c<br>2M<br>ov2685.c<br>ov2680.c<br>ov2735.c<br>gc2385.c<br>gc2355.c<br>gc2053.c<br>sc2239.c<br>sc210iot.c<br>4M<br>gc4c33.c<br>5M<br>ov5695.c<br>ov5648.c<br>ov5670.c<br>gc5024.c<br>gc5025.c<br>gc5035.c<br>8M<br>ov8858.c<br>imx378.c<br>imx317.c<br>imx219.c<br>gc8034.c<br>13M<br>ov13850.c<br>imx258.c |
| MIPI | Bayer raw HDR | Кадр | 2M<br>imx307.c<br>imx327.c<br>gc2093.c<br>ov02k10<br>ov2718.c<br>sc200ai.c<br>sc2310.c<br>jx-f37.c<br>4M<br>ov4689.c<br>os04a10.c<br>imx347.c<br>sc4238.c<br>5M<br>imx335.c<br>8M<br>imx334.c<br>imx415.c |
| MIPI | YUV | Кадр | 2M<br>gc2145.c |
| MIPI | RAW BW | Кадр | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  |  |
| ITU.BT656 | Bayer RAW |  | 2M: imx323 (может поддерживаться) |

## Приложение D. Эталонные драйверы микросхем VCM

##### Эталонный драйвер

vm149c.c

dw9714.c

fp5510.c

## Приложение E. Эталонные драйверы микросхем вспышки

##### Эталонный драйвер

sgm3784.c

leds-rgb13h.c (управление GPIO)

{% endraw %}
