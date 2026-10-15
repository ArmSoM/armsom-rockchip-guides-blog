---
title: "Rockchip CAN: драйвер, Device Tree и SocketCAN"
description: "Полное руководство Rockchip CAN: драйверы, DTS, конфигурация ядра, SocketCAN, диагностика и формулы битового времени."
translation_key: "031-rockchip-can"
slug: "031-rockchip-can"
lang: "ru"
date: "2026-10-15"
author: "Редакция ArmSoM · исходная документация Rockchip"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["CAN", "SocketCAN", "Device Tree", "Rockchip", "RK3576"]
keywords: "ArmSoM Rockchip CAN SocketCAN RK3576 RK3588 device tree"
excerpt: "Справочник по драйверу, DTS, SocketCAN и битовому времени из Rockchip CAN Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN: драйвер, Device Tree и SocketCAN

Это справочник по платформе, а не утверждение, что каждая плата ArmSoM имеет выведенный CAN или готовый трансивер. Sige7/AIM7 используют RK3588; Sige5/CM5/AIM5 — RK3576. Сверьте схему платы, pinmux, питание/standby трансивера и поставляемый BSP. В источнике указаны ядра 5.10 для RK3588 и 6.1 для RK3576, но конкретный образ ArmSoM не сертифицирован. Аппаратные испытания ArmSoM не выполнялись.

Основа: *Rockchip CAN Developer Guide*, RK-KF-YF-C44, V1.3.0, 2025-10-09. Китайский и английский PDF имеют по 9 страниц и не содержат самостоятельных технических рисунков, поэтому изображения не извлекались. Обложка/юридический текст, аудитория и история редакций исключены. [Запись редакторской проверки](/docs/rockchip-can/EDITORIAL-NOTES.md).

## 1. Драйвер CAN

### 1.1 Файлы драйверов

| SoC | Файл драйвера |
| --- | --- |
| RV1126/RV1109 | `drivers/net/can/rockchip/rockchip_can.c` |
| RK3568/RK3588 | `drivers/net/can/rockchip/rk3568_can.c` |
| RK3562 | `drivers/net/can/rockchip/rk3562_can.c` |
| RK3576/RK3506/RV1126B | `drivers/net/can/rockchip/rk3576_can.c` |

### 1.2 Узел DTS

```dts
interrupts = <GIC_SPI 100 IRQ_TYPE_LEVEL_HIGH>;
assigned-clocks = <&cru CLK_CAN>;
assigned-clock-rates = <200000000>;
clocks = <&cru CLK_CAN>, <&cru PCLK_CAN>;
clock-names = "baudclk", "apb_pclk";
&can { pinctrl-names = "default"; pinctrl-0 = <&canm0_pins>; status = "okay"; };
```

Прерывание возникает после завершения преобразования. Источник рекомендует 300 MHz для CAN 1 Mbit/s и 200 MHz ниже 1 Mbit/s; по возможности выбирайте чётную кратность скорости. Совместимые строки: `"rockchip,can-1.0"` (RV1126/RV1109), `"rockchip,rk3568-can-2.0"` (RK3568), `"rockchip,can-2.0"` (RK3588), `"rockchip,rk3562-can"` (RK3562), `"rockchip,rk3576-can"` (RK3576/RK3506), `"rockchip,rv1126b-can"` (RV1126B).

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 { dmas = <&dmac0 20>; dma-names = "rx"; };
```

Для classic CAN `<4>` даёт RX byte до 8 и FIFO глубиной 64; для CAN FD `<18>` даёт RX byte до 64 и 14 кадров FIFO. При отсутствии `auto-retx-cnt` повтор не ограничен; диапазон `1`…`0xffff` прекращает его после порога. RX DMA необязателен: удалите оба свойства DMA. RV1126B поддерживает DMA. Назначьте IOMUX CAN-H/CAN-L функции CAN.

### 1.3 Конфигурация ядра

Включите драйвер через **Networking support → CAN bus subsystem support → CAN Device Drivers → Platform CAN drivers with Netlink support**:

```text
CONFIG_CAN_RK3562=y
CONFIG_CAN_RK3576=y
```

Зависимости: `NET=y && CAN=y && CAN_DEV=y && ARCH_ROCKCHIP=y`.

## 2. Средства проверки CAN

`canutils` включает `canconfig`, `candump`, `canecho`, `cansend` и `cansequence`. Используйте полный `iproute2`: BusyBox `ip` не поддерживает CAN. Для Buildroot:

```text
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

## 3. Команды

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 500000
ip -details -statistics link show can0
ip link set can0 up
cansend can0 123#DEADBEEF
cansend can0 123#R
cansend can0 00000123#12345678
cansend can0 00000123#R
candump can0
```

Это поиск устройств; останов, настройка 500 kbit/s, просмотр и запуск; стандартные/расширенные data и remote кадры; приём.

## 4. Диагностика

### 4.1 Нет приёма или передачи

После запуска CAN включите loopback, используя фактический базовый адрес CAN из DTS:

```sh
io -4 0xfe580000 0x8415
```

Если после `cansend` `candump` получает кадр, контроллер исправен. Затем проверьте IOMUX, соединение, 120-омный терминатор и трансивер.

### 4.2 Периодический сбой

```sh
ip -details -statistics link show can0
```

Проверьте точность фактической скорости и при необходимости скорректируйте входную частоту. Точки выборки должны совпадать во всей сети.

## 5. Битовая скорость и точка выборки

```c
/* Use CiA recommended sample points */
if (bt->sample_point) sample_point_nominal = bt->sample_point;
else if (bt->bitrate > 800000) sample_point_nominal = 750;
else if (bt->bitrate > 500000) sample_point_nominal = 800;
else sample_point_nominal = 875;
```

```text
BitRate = clk_can / (2 *(brq + 1) / ((tseg2 + 1) + (tseg1 + 1) + 1)
Sample = (1 + (tseg1 + 1)) / (1 + (tseg1 + 1) + (tseg2 + 1))
```

`brq`, `tseg1` и `tseg2` находятся в регистре CAN `BITTIMING` TRM. Перед изменением BSP проверьте формулу и ограничения полей в TRM и целевом ядре.
{% endraw %}
