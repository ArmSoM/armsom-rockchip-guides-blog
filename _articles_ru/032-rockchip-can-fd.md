---
title: "Rockchip CAN FD: DTS, SocketCAN, BRS и TDC"
description: "Полное руководство Rockchip CAN FD: драйвер RK3576, DTS, SocketCAN FD, диагностика, битовое время и TDC по задержке петли."
translation_key: "032-rockchip-can-fd"
slug: "032-rockchip-can-fd"
lang: "ru"
date: "2026-10-15"
author: "Редакция ArmSoM · исходная документация Rockchip"
category: "linux"
products: ["Sige5", "CM5", "AIM5"]
tags: ["CAN FD", "SocketCAN", "RK3576", "BRS", "TDC"]
keywords: "ArmSoM Rockchip CAN FD RK3576 SocketCAN BRS TDC"
excerpt: "Справочник RK3576 CAN FD, DTS, SocketCAN, BRS и TDC из Rockchip CAN FD Developer Guide V1.3.0."
---

{% raw %}
# Rockchip CAN FD: DTS, SocketCAN, BRS и TDC

Это справочник для поддерживаемого источником семейства RK3576/RK3506/RV1126B. Для ArmSoM он может относиться к Sige5, CM5 и AIM5 (RK3576), но не доказывает наличие готового CAN FD на плате. Проверьте схему, трансивер, pinmux, терминацию, тактирование и выпущенный BSP 6.1. Аппаратные испытания ArmSoM не выполнялись.

Основа: *Rockchip CAN FD Developer Guide*, RK-KF-YF-162, V1.3.0, 2025-04-08. Китайский файл содержит 9, английский 11 страниц: английская история редакций вынесена на отдельную страницу; технические разделы совпадают. Независимых технических рисунков нет. Обложка/юридический текст, аудитория и история редакций исключены. [Запись редакторской проверки](/docs/rockchip-can-fd/EDITORIAL-NOTES.md).

## 1. Драйвер CAN FD

### 1.1 Файл драйвера и DTS

```text
drivers/net/can/rockchip/rk3576_canfd.c
```

```dts
interrupts = <GIC_SPI 121 IRQ_TYPE_LEVEL_HIGH>;
clocks = <&cru CLK_CAN0>, <&cru HCLK_CAN0>;
clock-names = "baudclk", "apb_pclk";
resets = <&cru SRST_CAN0>, <&cru SRST_H_CAN0>;
reset-names = "can", "can-apb";
&can0 { assigned-clocks = <&cru CLK_CAN0>; assigned-clock-rates = <200000000>; pinctrl-names = "default"; pinctrl-0 = <&can0m0_pins>; status = "okay"; };
```

Прерывание создаётся при завершении преобразования. Свойства clock управляют переключением тактового сигнала, reset сбрасывают шину. Назначьте IOMUX CAN-H/CAN-L функции CAN.

```dts
&can0 { rockchip,rx-max-data = <4>; };
&can0 { rockchip,auto-retx-cnt = <100>; };
&can0 { dmas = <&dmac0 20>; dma-names = "rx"; };
```

Для classic CAN `<4>` обеспечивает RX byte 8 и FIFO 64; CAN FD `<18>` — RX byte 64 и 14 кадров FIFO. Повтор TX не ограничен без свойства, `1`…`0xffff` задаёт предел. RX DMA необязателен.

### 1.2 Ядро и тестовые средства

```text
+CONFIG_CAN=y
+CONFIG_CANFD_RK3576=y
BR2_PACKAGE_CAN_UTILS=y
BR2_PACKAGE_IPROUTE2=y
```

`canutils` включает `canconfig`, `candump`, `canecho`, `cansend`, `cansequence`; нужен полный `iproute2`, не BusyBox `ip`.

### 1.3 Настройка, передача, приём

```sh
ifconfig -a
ip link set can0 down
ip link set can0 type can bitrate 1000000 dbitrate 3000000 fd on
ip -details link show can0
ip link set can0 up
cansend can0 123##1DEADBEEF
cansend can0 00000123##1DEADBEEF
candump can0 &
```

`bitrate` — арбитражный сегмент (1 Mbit/s), `dbitrate` — сегмент данных (3 Mbit/s).

### 1.4 Обычные команды CAN/CAN FD

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
cangen can0 -g 1 -e -I i -L i -D r
cangen can0 -g 1 -I i -L i -D r
cangen can0 -g 1 -R -I i -L i -D r
cangen can0 -g 1 -e -R -I i -L i -D r
cangen can0 -g 1 -e -f -I i -L i -D i
cangen can0 -g 1 -e -f -I r -L i -D r
cangen can0 -g 1 -f -I i -L i -D i
cangen can0 -g 1 -f -I r -L i -D r
cangen can0 -g 1 -e -f -b -I i -L i -D i
cangen can0 -g 1 -e -f -b -I r -L i -D r
cangen can0 -g 1 -f -b -I i -L i -D i
cangen can0 -g 1 -f -b -I r -L i -D r
```

Команды покрывают classic CAN extended/standard/remote, CAN FD без BRS и CAN FD с BRS для extended и standard кадров.

## 2. Диагностика

```sh
ip link set can0 down
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on loopback on
ip -details -statistics link show can0
ip link set can0 up
echo 4096 > /sys/class/net/can0/tx_queue_len
candump can0 &
```

При успехе loopback проверьте IOMUX, соединения, 120-омный терминатор и трансивер. При периодической ошибке проверьте фактическую скорость командой `ip -details -statistics link show can0` и синхронизируйте точки выборки сети.

## 3. Битовая скорость и точка выборки

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

`brq`, `tseg1`, `tseg2` находятся в `BITTIMING`; сверяйте пределы с TRM/BSP.

## 4. Изменение скорости и TDC

Выше 5 Mbit/s возможна нестабильность. Сначала измерьте loop delay:

```sh
io -4 0x2ac00108 0x80
cansend 001#aaaaaaaa
io -4 0x2ac00110
```

Значение из `0x2ac00110` — задержка петли. Затем:

```sh
io -4 0x2ac00108 0x19
```

Задайте `tdc_offset`, равный половине задержки, включите `tdc_enable`, сверьтесь с регистром TRM `RKCAN_FD_TDC` и внесите итоговое значение в конфигурацию `tdc` функции `rk3576_canfd_set_bittiming()`. Точки выборки в сети CAN FD с разными скоростями должны совпадать, иначе возможны ошибки BRS.

```sh
ip link set can0 type can bitrate 500000 sample-point 0.8 dbitrate 2000000 dsample-point 0.8 fd on
```
{% endraw %}
