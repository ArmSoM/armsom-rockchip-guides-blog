---
title: "Rockchip Linux GMAC: полное руководство по PHY, MAC-адресам, PTP и отладке TX/RX"
description: "Полное описание GMAC/PHY, DTS, регистров, MAC-адресов, петлевых тестов, RGMII, LED, WOL, Jumbo Frame, PTP и неисправностей."
translation_key: "063-rockchip-linux-gmac"
slug: "063-rockchip-linux-gmac"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "Полное описание GMAC/PHY, DTS, регистров, MAC-адресов, петлевых тестов, RGMII, LED, WOL, Jumbo Frame, PTP и неисправностей."
---

{% raw %}

# Rockchip Linux GMAC: полное руководство по PHY, MAC-адресам, PTP и отладке TX/RX

## Применимость к ArmSoM

Это справочный материал по платформе Rockchip, а не отчёт об испытаниях ArmSoM. Адаптация требует проверки интерфейса Ethernet конкретной платы, PHY, питания, сброса, IOMUX, опорных частот и целевого SDK/BSP. Поддержка всех плат ArmSoM не предполагается. Аппаратная проверка не проводилась. Журналы, пропускная способность и временные результаты взяты из исходника, а не измерены на ArmSoM.

Исходник охватывает микросхемы Rockchip и Linux 3.10 / 4.4 / 4.19. Обе версии PDF — V1.0.0, по 12 страниц. Китайская статья следует китайскому оригиналу, английская — английскому, русская полностью переводит английский текст. Раздел аппаратных испытаний, имеющийся только в китайской версии, добавлен с явным указанием источника. Технических иллюстраций в оригиналах нет.

> Замечания к исходнику: номера некоторых ссылок на главы тактирования/RGMII ошибочны; путь Linux 3.10 записан как driver/net, а не drivers/net. Требует проверки сочетание MTU 9000 и ping -s 9000. Формулировка проверки Link об отключении MDC/MDIO и прямом подключении к PC неоднозначна: она не разрешает подключать эти выводы к Ethernet-разъёму PC. Исходная информация сохранена для проверки.

[Редакторский протокол](/docs/rockchip-linux-gmac/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)

## Область применения исходника

| Микросхема | Версия ядра |
| --- | --- |
| Rockchip | 3.10 / 4.4 / 4.19 |

<!-- source: EN PDF p3; unit 0 -->

## 1. Расположение исходного кода

<!-- source: EN PDF p3; unit 1 -->

Аппаратно-зависимый код драйвера Ethernet в основном включает GMAC и PHY. Обычно используется универсальный драйвер PHY; если требуется менять специальные регистры, следует использовать драйвер соответствующего PHY. Код находится в drivers/net/phy. Кроме того, RK322x/RK3328 имеют встроенный PHY 100 Мбит/с.

<!-- source: EN PDF p3; unit 2 -->

Код драйвера GMAC Linux 3.10: driver/net/ethernet/rockchip/gmac/*

<!-- source: EN PDF p3; unit 3 -->

В ядрах новее 3.10 код драйвера GMAC находится здесь:

<!-- source: EN PDF p3; unit 4 -->

drivers/net/ethernet/stmicro/stmmac/*

<!-- source: EN PDF p3; unit 5 -->

Код встроенного EPHY Rockchip: drivers/net/phy/rockchip.c

<!-- source: EN PDF p3; unit 6 -->

## 2. DTS

<!-- source: EN PDF p3; unit 7 -->

Описание конфигурации DTS:

<!-- source: EN PDF p3; unit 8 -->

Documentation/devicetree/bindings/net/rockchip-dwmac.txt

<!-- source: EN PDF p4; unit 9 -->

```text
gmac: ethernet@ff290000 {
      compatible = "rockchip,rk3288-gmac";
      reg = <0xff290000 0x10000>;

      interrupts = <GIC_SPI 27 IRQ_TYPE_LEVEL_HIGH>;
      interrupt-names = "macirq";
      rockchip,grf = <&grf>;
      clocks = <&cru SCLK_MAC>,
           <&cru SCLK_MAC_RX>, <&cru SCLK_MAC_TX>,
           <&cru SCLK_MACREF>, <&cru SCLK_MACREF_OUT>,
           <&cru ACLK_GMAC>, <&cru PCLK_GMAC>;
      clock-names = "stmmaceth",
           "mac_clk_rx", "mac_clk_tx",
           "clk_mac_ref", "clk_mac_refout",
           "aclk_mac", "pclk_mac";
      phy-mode = "rgmii";

      pinctrl-names = "default";
      pinctrl-0 = <&rgmii_pins /*&rmii_pins*/>;

      clock_in_out = "input";
      snps,reset-gpio = <&gpio4 7 0>;
      snps,reset-active-low;
      snps,reset-delays-us = <0 10000 1000000>;

      assigned-clocks = <&cru SCLK_MAC>;
      assigned-clock-parents = <&ext_gmac>;
      tx_delay = <0x30>;
      rx_delay = <0x10>;


      status = "ok";
};
```

<!-- source: EN PDF p4; unit 10 -->

При настройке платы необходимо обратить внимание на следующие параметры:

<!-- source: EN PDF p4; unit 11 -->

phy-mode: основные режимы — RMII и RGMII.

<!-- source: EN PDF p4; unit 12 -->

snps,reset-gpio: вывод аппаратного сброса PHY.

<!-- source: EN PDF p4; unit 13 -->

snps,reset-delays-us: временные интервалы сброса PHY. Три значения задают длительность разных этапов; требования зависят от PHY. При наличии snps,reset-active-low это время высокого, низкого и вновь высокого уровня на выводе Reset; при snps,reset-active-high уровни противоположны.

<!-- source: EN PDF p4; unit 14 -->

phy-supply: при постоянном питании PHY параметр можно не задавать; иначе необходимо указать соответствующий regulator.

<!-- source: EN PDF p4; unit 15 -->

Настройка тактирования: см. главу 3 исходного документа. Номер перекрёстной ссылки в исходнике требует проверки.

<!-- source: EN PDF p4; unit 16 -->

pinctrl: настройки RMII и RGMII различаются. Для вывода, выдающего тактовый сигнал, обычно отличается также сила тока выходного каскада. Например, в RMII при выдаче тактового сигнала через ref_clock устанавливают большую силу тока.

<!-- source: EN PDF p4; unit 17 -->

tx_delay/rx_delay: эти свойства необходимы в режиме RGMII. Исходник отсылает к главе 8 «RGMII Delayline», хотя фактически она имеет номер 6; исходная ссылка отмечена для проверки.

<!-- source: EN PDF p5; unit 18 -->

Ввиду большого числа режимов разных микросхем следует обратиться к отдельному документу Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_EN.pdf.

<!-- source: EN PDF p5; unit 19 -->

## 3. Отладка чтения и записи регистров PHY

<!-- source: EN PDF p5; unit 20 -->

Драйвер предоставляет интерфейсы чтения и записи регистров. Сейчас в разных версиях ядра используются два набора интерфейсов. Путь: /sys/bus/mdio_bus/devices/stmmac-0:00; stmmac-0:00 означает адрес PHY 0.

<!-- source: EN PDF p5; unit 21 -->

### 3.1 Linux 3.10

<!-- source: EN PDF p5; unit 22 -->

```text
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 23 -->

Запись

<!-- source: EN PDF p5; unit 24 -->

Например, запись 0xabcd в Reg0:

<!-- source: EN PDF p5; unit 25 -->

```text
echo 0x00 > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
echo 0xabcd > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 26 -->

Чтение

<!-- source: EN PDF p5; unit 27 -->

Например, чтение значения Reg0:

<!-- source: EN PDF p5; unit 28 -->

```text
echo 0x00 > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_reg
cat /sys/bus/mdio_bus/devices/stmmac-0:00/phy_regValue
```

<!-- source: EN PDF p5; unit 29 -->

### 3.2 Другие версии

<!-- source: EN PDF p5; unit 30 -->

```text
/sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 31 -->

Запись

<!-- source: EN PDF p5; unit 32 -->

Например, запись 0xabcd в Reg0:

<!-- source: EN PDF p5; unit 33 -->

```text
echo 0x00 0xabcd > /sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 34 -->

Чтение

<!-- source: EN PDF p5; unit 35 -->

```text
cat /sys/bus/mdio_bus/devices/stmmac-0:00/phy_registers
```

<!-- source: EN PDF p5; unit 36 -->

Команда читает все регистры от 0 до 31, после чего можно просмотреть нужное значение.

<!-- source: EN PDF p6; unit 37 -->

## 4. MAC-адрес

<!-- source: EN PDF p6; unit 38 -->

Исходная стратегия чтения MAC-адреса сначала использует адрес из DTB (куда его также записывает uboot), затем адрес, записанный в IDB. Если адрес соответствует требованиям, используется он; иначе, либо при отсутствии записанного адреса, генерируется случайный адрес, который меняется после перезапуска. Начиная с RK3399, RK3328/RK3228H и более поздних версий стратегия улучшена: приоритет имеет адрес из IDB или vendor Storage. Корректный адрес используется непосредственно; при некорректном или отсутствующем адресе случайный MAC сохраняется в разделе Vendor и используется далее. Он не теряется после перезагрузки или возврата к заводским настройкам.

<!-- source: EN PDF p6; unit 39 -->

Инструмент записи MAC-адреса описан в Rockchip_User_Guide_RKDevInfoWriteTool_EN.pdf.

<!-- source: EN PDF p6; unit 40 -->

## 5. Петлевое тестирование

<!-- source: EN PDF p6; unit 41 -->

Предусмотрены главным образом петлевые тесты MAC и PHY. См. описание узлов phy_lb и mac_lb в Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_EN.pdf.

<!-- source: EN PDF p6; unit 42 -->

## 6. RGMII Delayline

<!-- source: EN PDF p6; unit 43 -->

Интерфейс RGMII предоставляет линии задержки tx и rx для настройки временных параметров. Выбор подходящих значений описан в Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_CN.pdf. Здесь сохранено имя китайского файла, указанное в английском исходнике.

<!-- source: EN PDF p6; unit 44 -->

## 7. Светодиодные индикаторы

<!-- source: EN PDF p6; unit 45 -->

Каждый PHY имеет собственное управление LED. Ниже приведены настройки macphy в RK3228 и RK3328; для внешних PHY следует использовать соответствующий datasheet.

<!-- source: EN PDF p6; unit 46 -->

RK3228: необходимо применить kernel_4.4_rk322x_phy_led_control.patch.

<!-- source: EN PDF p6; unit 47 -->

RK3328: настройте iomux в DTS. Например, для управления LED сигналами rx и link задайте соответствующий pinctrl.

<!-- source: EN PDF p7; unit 48 -->

```text
phy: phy@0 {
      compatible = "ethernet-phy-id1234.d400", "ethernet-phy-ieee802.3-c22";
      reg = <0>;

      clocks = <&cru SCLK_MAC2PHY_OUT>;
      resets = <&cru SRST_MACPHY>;
      pinctrl-names = "default";
      pinctrl-0 = <&fephyled_rxm1 &fephyled_linkm1>;
      phy-is-integrated;
};
```

<!-- source: EN PDF p7; unit 49 -->

## 8. WOL

<!-- source: EN PDF p7; unit 50 -->

Регистры настройки Wake On LAN различаются у разных PHY. Имеющиеся в исходнике патчи охватывают RTL8211E/F и RTL8201F.

<!-- source: EN PDF p7; unit 51 -->

## 9. Прямое соединение MAC с MAC

<!-- source: EN PDF p7; unit 52 -->

См. Rockchip_Developer_Guide_Linux_MAC_TO_MAC_EN.pdf.

<!-- source: EN PDF p7; unit 53 -->

## 10. Jumbo Frame

<!-- source: EN PDF p7; unit 54 -->

Начиная с RV1126/1109 поддерживается Jumbo Frame 9K. В исходнике предлагается MTU тестовой сети 9000 и приводятся следующие результаты. Это исходный пример, а не измерения ArmSoM; соответствие размера ping и MTU следует проверить.

<!-- source: EN PDF p7; unit 55 -->

```text
<pre>[root@Puma:/]# ping -s 9000 192.168.1.100
PING 192.168.1.100 (192.168.1.100) 9000(9028) bytes of data.

9008 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.784 ms
9008 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.675 ms
9008 bytes from 192.168.1.100: icmp_seq=3 ttl=64 time=0.666 ms
9008 bytes from 192.168.1.100: icmp_seq=4 ttl=64 time=0.656 ms
9008 bytes from 192.168.1.100: icmp_seq=5 ttl=64 time=0.677 ms
9008 bytes from 192.168.1.100: icmp_seq=6 ttl=64 time=0.637 ms
9008 bytes from 192.168.1.100: icmp_seq=7 ttl=64 time=0.641 ms
9008 bytes from 192.168.1.100: icmp_seq=8 ttl=64 time=0.692 ms
9008 bytes from 192.168.1.100: icmp_seq=9 ttl=64 time=0.656 ms
```

<!-- source: EN PDF p8; unit 56 -->

## 11. PTP1588

<!-- source: EN PDF p8; unit 57 -->

Начиная с RV1126/1109 поддерживается PTP1588. Ниже приведены результаты из исходного документа, не испытания ArmSoM.

<!-- source: EN PDF p8; unit 58 -->

### 11.1 PC — ведущий, RK — ведомый

<!-- source: EN PDF p8; unit 59 -->

```text
ubuntu@thinkpad: sudo ptp4l -i enp0s31f6 -m -H
ptp4l[1790161.443]: selected /dev/ptp0 as PTP clock

ptp4l[1790161.443]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1790161.443]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1790168.489]: port 1: LISTENING to MASTER on ANNOUNCE_RECEIPT_TIMEOUT_EXPIRES
ptp4l[1790168.489]: selected local clock 54e1ad.fffe.dfa454 as best master
ptp4l[1790168.490]: assuming the grand master role
```

<!-- source: EN PDF p8; unit 60 -->

```text
[root@Puma:/]# ptp4l -i eth0 -m -H -s
ptp4l[39.868]: selected /dev/ptp0 as PTP clock

[  39.871092] rk_gmac-dwmac ffc40000.ethernet eth0: stmmac_hwtstamp_set config flags:0x0,
tx_type:0x1, rx_filter:0xc
[  39.872029] stmmac_hwtstamp_set, value: 0x17e03
ptp4l[39.870]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[39.871]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[41.251]: port 1: new foreign master 54e1ad.fffe.dfa454-1
[  43.817340] rk_gmac-dwmac ffc40000.ethernet eth0: stmmac_hwtstamp_set config flags:0x0,
tx_type:0x1, rx_filter:0xc
[  43.818262] stmmac_hwtstamp_set, value: 0x17e03
ptp4l[45.251]: selected best master clock 54e1ad.fffe.dfa454
ptp4l[45.251]: port 1: LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[49.251]: master offset -1608 s0 freq +0 path delay 5691
ptp4l[50.251]: master offset -5579 s0 freq +0 path delay 9435

ptp4l[51.251]: master offset -4831 s2 freq +748 path delay 9435
ptp4l[51.251]: port 1: UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[52.251]: master offset 12189 s2 freq +12937 path delay 7563
ptp4l[53.251]: master offset 14413 s2 freq +18818 path delay 8287
ptp4l[54.251]: master offset 10712 s2 freq +19441 path delay 8861
ptp4l[55.251]: master offset 7185 s2 freq +19127 path delay 8861
ptp4l[56.251]: master offset 3234 s2 freq +17332 path delay 9435
ptp4l[57.251]: master offset 1787 s2 freq +16855 path delay 9454
ptp4l[58.251]: master offset 785 s2 freq +16389 path delay 9454
ptp4l[59.251]: master offset 89 s2 freq +15928 path delay 9473
ptp4l[60.251]: master offset 31 s2 freq +15897 path delay 9454
ptp4l[61.251]: master offset -71 s2 freq +15804 path delay 9454

ptp4l[62.251]: master offset -100 s2 freq +15754 path delay 9406
ptp4l[63.251]: master offset -27 s2 freq +15797 path delay 9406
ptp4l[64.251]: master offset -69 s2 freq +15747 path delay 9395
ptp4l[65.251]: master offset 29 s2 freq +15824 path delay 9395
ptp4l[66.251]: master offset -73 s2 freq +15731 path delay 9395
ptp4l[67.251]: master offset 32 s2 freq +15814 path delay 9388
ptp4l[68.251]: master offset -20 s2 freq +15772 path delay 9388
ptp4l[69.251]: master offset -104 s2 freq +15682 path delay 9395
ptp4l[70.251]: master offset -56 s2 freq +15699 path delay 9395
ptp4l[71.251]: master offset 24 s2 freq +15762 path delay 9388
ptp4l[72.251]: master offset 11 s2 freq +15756 path delay 9395
```

<!-- source: EN PDF p9; unit 61 -->

<!-- source: EN PDF p9; unit 62 -->

### 11.2 RK — ведущий, PC — ведомый

<!-- source: EN PDF p9; unit 63 -->

```text
[root@Puma:/]# ptp4l -i eth0 -m -H
ptp4l[15.668]: selected /dev/ptp0 as PTP clock
ptp4l[15.670]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE

ptp4l[15.670]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[22.120]: port 1: LISTENING to MASTER on ANNOUNCE_RECEIPT_TIMEOUT_EXPIRES
ptp4l[22.120]: selected local clock aadc46.fffe.5da6d9 as best master
ptp4l[22.121]: assuming the grand master role
```

<!-- source: EN PDF p9; unit 64 -->

```text
ubuntu@thinkpad: sudo ptp4l -i enp0s31f6 -m -H -s
ptp4l[1879661.603]: selected /dev/ptp0 as PTP clock

ptp4l[1879661.603]: port 1: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1879661.603]: port 0: INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[1879662.249]: port 1: new foreign master aadc46.fffe.5da6d9-1
ptp4l[1879665.849]: selected best master clock aadc46.fffe.5da6d9
ptp4l[1879665.849]: port 1: LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[1879667.649]: master offset 49 s0 freq -9515 path delay 9364
ptp4l[1879668.549]: master offset 128 s2 freq -9436 path delay 9338
ptp4l[1879668.549]: port 1: UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[1879669.449]: master offset 256 s2 freq -9180 path delay 9338
ptp4l[1879670.349]: master offset -230 s2 freq -9589 path delay 9338
ptp4l[1879671.249]: master offset -399 s2 freq -9827 path delay 9360
ptp4l[1879672.149]: master offset 142 s2 freq -9406 path delay 9360
ptp4l[1879673.049]: master offset 232 s2 freq -9273 path delay 9347

ptp4l[1879673.949]: master offset -303 s2 freq -9739 path delay 9347
ptp4l[1879674.849]: master offset -267 s2 freq -9794 path delay 9338
ptp4l[1879675.749]: master offset 327 s2 freq -9280 path delay 9335
ptp4l[1879676.649]: master offset 405 s2 freq -9104 path delay 9335
ptp4l[1879677.549]: master offset -156 s2 freq -9543 path delay 9335
ptp4l[1879678.449]: master offset -178 s2 freq -9612 path delay 9335
ptp4l[1879679.349]: master offset -100 s2 freq -9587 path delay 9335
ptp4l[1879680.249]: master offset -73 s2 freq -9590 path delay 9335
ptp4l[1879681.149]: master offset -79 s2 freq -9618 path delay 9344
ptp4l[1879682.049]: master offset -76 s2 freq -9639 path delay 9344
ptp4l[1879682.949]: master offset -59 s2 freq -9645 path delay 9329
ptp4l[1879683.849]: master offset -31 s2 freq -9634 path delay 9329
ptp4l[1879684.750]: master offset 22 s2 freq -9591 path delay 9329

ptp4l[1879685.650]: master offset -9 s2 freq -9615 path delay 9337
ptp4l[1879686.550]: master offset -31 s2 freq -9640 path delay 9337
ptp4l[1879687.450]: master offset -3 s2 freq -9621 path delay 9337
ptp4l[1879688.350]: master offset -15 s2 freq -9634 path delay 9351
```

## Дополнение из китайского исходника: испытания аппаратных сигналов

Раздел присутствует в китайской V1.0.0, стр. 9, глава 12, но отсутствует в английской. Следует обратиться к документам аппаратного подразделения Rockchip по испытаниям сигналов RMII/RGMII и глазковых диаграмм PHY: `瑞芯硬件部100base-t测试指南-V1.1.doc` и `瑞芯硬件部1000base-t测试指南_V1.0.doc`. Исходные имена файлов сохранены для поиска. Следующая английская глава сохраняет исходный номер 12 (в китайской версии ей соответствует глава 13).

<!-- source: EN PDF p10; unit 65 -->

## 12. Анализ неисправностей

<!-- source: EN PDF p10; unit 66 -->

### 12.1 DMA Initialization Failed

<!-- source: EN PDF p10; unit 67 -->

Если в журнале запуска драйвера GMAC появляется DMA engine initialization failed, возможна проблема с рабочим тактированием GMAC. Сначала измерьте наличие сигнала на тактовом выводе, его частоту и амплитуду. Основные проверки:

<!-- source: EN PDF p10; unit 68 -->

Ошибка IOMUX: проверьте значение регистра тактового вывода.

<!-- source: EN PDF p10; unit 69 -->

Направление и конфигурация тактирования не соответствуют аппаратуре; исходник отсылает к настройкам тактирования в главе 4. Номер ссылки требует проверки.

<!-- source: EN PDF p10; unit 70 -->

Проверьте дерево тактирования и регистры CRU: частоту и разрешение тактового сигнала.

<!-- source: EN PDF p10; unit 71 -->

### 12.2 Ошибка инициализации PHY

<!-- source: EN PDF p10; unit 72 -->

Сообщения No PHY found или Cannot attach to PHY в журнале запуска означают, что PHY не найден. Драйвер сначала читает ID PHY через MDIO. Можно проверить осциллограммы MDC и MDIO; шина похожа на I2C, а частота MDC должна быть меньше 2.5M, как указано в исходнике. Обычные причины отсутствия PHY:

<!-- source: EN PDF p10; unit 73 -->

Проверьте значения регистров IOMUX MDC/MDIO.

<!-- source: EN PDF p10; unit 74 -->

Проверьте питание PHY.

<!-- source: EN PDF p10; unit 75 -->

Неверно задан Reset IO.

<!-- source: EN PDF p10; unit 76 -->

Временные параметры Reset IO не соответствуют datasheet PHY. Требования разных PHY различаются; настройка описана в разделе DTS.

<!-- source: EN PDF p10; unit 77 -->

Проверьте осциллограммы MDIO/MDC. Частота MDC должна быть меньше 2.5M.

<!-- source: EN PDF p10; unit 79 -->

### 12.3 Проблемы Link

<!-- source: EN PDF p10; unit 80 -->

При проблеме Link исходник предлагает исключить программное влияние: отключить MDC/MDIO от основного контроллера, подключить напрямую к компьютеру и проверить, повторяется ли проблема на стороне PC. Описание подключения неоднозначно: это не указание подключать выводы MDC/MDIO к Ethernet-разъёму PC. Необходимо свериться со схемой и уточнить методику. Затем проверяют аппаратные причины, начиная с наличия осциллограмм Link на TXN/P и RXN/P.

<!-- source: EN PDF p10; unit 81 -->

Если Link up/Link down повторяется постоянно, возможно, PHY принимает ошибочные данные:

<!-- source: EN PDF p10; unit 82 -->

В режиме EEE неверная конфигурация delayline может приводить к постоянным переходам link up/down.

<!-- source: EN PDF p10; unit 83 -->

Неверный тактовый сигнал PHY также может вызвать эту проблему.

<!-- source: EN PDF p11; unit 84 -->

### 12.4 Данные не проходят

<!-- source: EN PDF p11; unit 85 -->

Сначала определите, затронут ли TX, RX или оба направления.

<!-- source: EN PDF p11; unit 86 -->

#### 12.4.1 TX

<!-- source: EN PDF p11; unit 87 -->

Командой ifconfig -a проверьте рост TX packets интерфейса eth0. Если счётчик равен 0, возможно, кабель не установил Link. Состояние соединения доступно в узле carrier: 1 означает link up, 0 — link down. Пример RK3328:

<!-- source: EN PDF p11; unit 88 -->

```text
console:/ # cat /sys/devices/platform/ff550000.ethernet/net/eth0/carrier
1
```

<!-- source: EN PDF p11; unit 89 -->

```text
eth0   Link encap:Ethernet HWaddr 16:21:8d:d9:67:0b Driver rk_gmac-dwmac
       inet6 addr: fe80::c43d:3e5d:533:b7ea/64 Scope: Link

       UP BROADCAST RUNNING MULTICAST MTU:1500 Metric:1
       RX packets:0 errors:0 dropped:0 overruns:0 frame:0
       TX packets:19 errors:0 dropped:0 overruns:0 carrier:0
       collisions:0 txqueuelen:1000
       RX bytes:0 TX bytes:2848
       Interrupt:45
```

<!-- source: EN PDF p11; unit 90 -->

Если TX packets продолжает расти, значит GMAC передаёт данные TX.

<!-- source: EN PDF p11; unit 91 -->

Подключите плату и PC к одной локальной сети. Выполняйте ping PC с платы и захватывайте пакеты на PC, например Wireshark. Если пакеты платы видны, передача TX проходит. Иначе определите участок неисправности и измерьте TX Clock и TX Data GMAC, чтобы различить проблему MAC и PHY. Для MAC проверяют:

<!-- source: EN PDF p11; unit 92 -->

Iomux TX Clock/TX Data.

<!-- source: EN PDF p11; unit 93 -->

Правильность тактового сигнала TXC.

<!-- source: EN PDF p11; unit 94 -->

Правильность Tx Delayline в режиме RGMII.

<!-- source: EN PDF p11; unit 95 -->

На стороне PHY можно проверить TXN/P и убедиться, что PHY передаёт данные. Настройки разных PHY могут отличаться; обращайтесь к их datasheet.

<!-- source: EN PDF p11; unit 96 -->

#### 12.4.2 RX

<!-- source: EN PDF p11; unit 97 -->

Исключив проблему TX, сосредоточьтесь на RX. Подключите сетевой кабель и командой ifconfig -a проверьте рост RX packets eth0. Если счётчик равен 0, GMAC RX не получает данные.

<!-- source: EN PDF p12; unit 98 -->

```text
eth0   Link encap:Ethernet HWaddr 16:21:8d:d9:67:0b Driver rk_gmac-dwmac
       inet6 addr: fe80::c43d:3e5d:533:b7ea/64 Scope: Link
       UP BROADCAST RUNNING MULTICAST MTU:1500 Metric:1

       RX packets:341 errors:0 dropped:0 overruns:0 frame:0
       TX packets:26 errors:0 dropped:0 overruns:0 carrier:0
       collisions:0 txqueuelen:1000
       RX bytes:48928 TX bytes:3741
       Interrupt:355
```

<!-- source: EN PDF p12; unit 99 -->

Аналогично проверьте RXN/P PHY и RX Clock/RX Data GMAC, чтобы определить, связан ли сбой с MAC или PHY. Для MAC проверяют:

<!-- source: EN PDF p12; unit 100 -->

Iomux RX Clock/RX Data.

<!-- source: EN PDF p12; unit 101 -->

Правильность тактового сигнала RXC.

<!-- source: EN PDF p12; unit 102 -->

Правильность RGMII Tx Delayline.

<!-- source: EN PDF p12; unit 103 -->

Правильность Rx Delayline в режиме RGMII.

<!-- source: EN PDF p12; unit 104 -->

Если TX packets растёт, но Ethernet по-прежнему не работает нормально, возможны следующие причины:

<!-- source: EN PDF p12; unit 105 -->

В режиме RMII MAC и PHY используют разные опорные тактовые сигналы.

<!-- source: EN PDF p12; unit 106 -->

Неверно настроен режим PHY, например аппаратно выбран MII.

<!-- source: EN PDF p12; unit 107 -->

### 12.5 TX queue0 timeout

<!-- source: EN PDF p12; unit 108 -->

Предполагается, что TX не может передавать, обычно из-за сбоя контроллера. Возможные причины:

<!-- source: EN PDF p12; unit 109 -->

Проблема тактирования: проверьте конфигурацию; исходник отсылает к главе 3.

<!-- source: EN PDF p12; unit 110 -->

Неверная последовательность сброса PHY приводит к неправильному тактовому сигналу от PHY.

<!-- source: EN PDF p12; unit 111 -->

Аппаратная неисправность PHY вызывает обнаружение коллизии и блокирует передачу.

<!-- source: EN PDF p12; unit 112 -->

Слишком низкое логическое напряжение.

{% endraw %}
