---
title: "Настройка Bluetooth Rockchip Android 9.0"
description: "Настройка Bluetooth Rockchip Android 9.0 — V1.0.0"
excerpt: "Настройка Bluetooth Rockchip Android 9.0"
translation_key: "235-rockchip-android9-bluetooth-configuration"
slug: "235-rockchip-android9-bluetooth-configuration"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Bluetooth]
---

{% raw %}

# Настройка Bluetooth Rockchip Android 9.0

Полный текст настройки и диагностики технических страниц 4–7 китайского источника V1.0 от 2018-11-16, всего 7 страниц. Заголовок говорит Android 9.0, раздел назначения — Android 8.1; оба сохранены как исторические сведения, не гарантия текущей совместимости. Только китайский источник, английских оригинальных рисунков нет. Технических изображений и таблиц нет; DTS и команды редактируемы. Обложка, история изменений, оглавление и колонтитулы удалены. Команды, изменения прошивки и аппаратные тесты не выполнялись.

Проверка: соединены DTS между страницами, пути libbt и свойства snoop после переносов. Сохранены исходные 32k, GPIO, порты, свойства и написание кода. В исходном pinctrl DTS неполные скобки/точки с запятой; они не дополняются по догадке. Перед использованием сверить с кодом и аппаратурой. Команды питания — только для разрешённых устройств. Snoop-журналы могут раскрывать обмен и сведения об устройствах: ограничьте доступ, отключайте запись после отладки и удаляйте ненужные журналы.

<!-- source:cn p4 unit:0 -->

## 1 Назначение

<!-- source:cn p4 unit:1 -->

Описание автоматической совместимости BT на Android 8.1 и необходимых мер предосторожности. Прошивка, собранная по приведённым инструкциям полной автоматической совместимости, поддерживает соответствующие BT-модули; один образ может поддерживать несколько модулей.

<!-- source:cn p4 unit:2 -->

### 1.1 Замечания по ядру

<!-- source:cn p4 unit:3 -->

1. Сначала настройте wifi_chip_type. Система загружает разные библиотеки libbt в зависимости от chip_type.

<!-- source:cn p4 unit:4 -->

```text
wireless-wlan {
compatible = "wlan-platdata";
wifi_chip_type ="ap6255"; //或者如”rtl8723ds”;
WIFI,host_wake_irq = <&gpio0 GPIO_D4 GPIO_ACTIVE_HIGH>;
status = "okay";
};
```

<!-- source:cn p4 unit:5 -->

2. Настройка DTS для BT

<!-- source:cn p4 unit:6 -->

```text
wireless-bluetooth {
compatible = "bluetooth-platdata";
clocks = <&rk808 1>;
clock-names = "ext_clock";
//wifi-bt-power-toggle;
uart_rts_gpios = <&gpio2 19 GPIO_ACTIVE_LOW>;
pinctrl-names = "default", "rts_gpio";
pinctrl-0 = <&uart0_rts>;
pinctrl-1 = <&uart0_gpios>;
//BT,power_gpio = <&gpio3 19 GPIO_ACTIVE_HIGH>;
BT,reset_gpio = <&gpio0 9 GPIO_ACTIVE_HIGH>;
BT,wake_gpio = <&gpio2 26 GPIO_ACTIVE_HIGH>;
BT,wake_host_irq = <&gpio0 4 GPIO_ACTIVE_HIGH>;
status = "okay";
};
&pinctrl {
wireless-bluetooth {
uart0_gpios: uart0-gpios {
rockchip,pins =
<2 19 RK_FUNC_GPIO &pcfg_pull_none>;
}
};
```

<!-- source:cn p5 unit:7 -->

Приведённая конфигурация DTS задаёт главным образом управление питанием, прерывания и другие функциональные выводы BT. Изменяйте её в соответствии с реальной принципиальной схемой.

<!-- source:cn p5 unit:8 -->

3. Драйвер питания BT находится в net/rfkill/rfkill-bt.c и создаёт узел /sys/class/rfkill/rfkill0/state.

<!-- source:cn p5 unit:9 -->

Первая команда ниже вручную включает питание Bluetooth-модуля, вторая выключает. При включении Bluetooth система подаёт питание автоматически.

<!-- source:cn p5 unit:10 -->

```text
echo 1 > /sys/class/rfkill/rfkill0/state
echo 0 > /sys/class/rfkill/rfkill0/state
```

<!-- source:cn p5 unit:11 -->

### 1.2 Замечания по Android

<!-- source:cn p5 unit:12 -->

#### 1. Libbt

<!-- source:cn p5 unit:13 -->

Libbt инициализирует Bluetooth-чип, в том числе загружает firmware. Для разных чипов используются разные реализации libbt, обычно от производителя. В источнике преимущественно используются Broadcom и Realtek с кодом в hardware/broadcom/libbt и hardware/realtek/rtkbt/code/libbt-vendor соответственно. Обычно достаточно настроить порт модуля и путь firmware; иных изменений libbt не требуется. Конфигурации различаются: hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf для Broadcom и hardware/realtek/rtkbt/code/vendor/etc/bluetooth/rtkbt.conf для Realtek.

<!-- source:cn p6 unit:14 -->

#### 2. bluedroid

<!-- source:cn p6 unit:15 -->

Исходный код Bluedroid находится в system/bt. Начиная с Android 9.0 собирается библиотека libbluetooth.so. Некоторые настраиваемые макросы можно разместить в device/rockchip/rk3368/bluetooth/bdroid_buildcfg.h.

<!-- source:cn p6 unit:16 -->

Для изменения уровней журналирования компонентов Bluedroid редактируйте /system/etc/bt_stack.conf на устройстве.

<!-- source:cn p6 unit:17 -->

"persist.bluetooth.btsnoopenable" управляет записью snoop log. "persist.bluetooth.btsnooppath" меняет путь сохранения; по умолчанию это "/data/misc/bluetooth/logs/btsnoop_hci.log". "persist.bluetooth.btsnoopsize" задаёт размер файла snoop log.

<!-- source:cn p6 unit:18 -->

#### 3. Тестирование BT на PCBA

<!-- source:cn p6 unit:19 -->

Код теста BT для PCBA по умолчанию использует порт модуля /dev/ttyS0. При необходимости другой порт задаётся в /system/etc/bt_stack.conf.

<!-- source:cn p7 unit:20 -->

## 2 Диагностика BT

<!-- source:cn p7 unit:21 -->

### 2.1 BT не включается

<!-- source:cn p7 unit:22 -->

#### 1. Аппаратные проблемы

<!-- source:cn p7 unit:23 -->

(1) Измерьте правильность последовательности включения питания BT; (2) проверьте нормальную подачу тактового сигнала 32k; (3) проверьте обмен данными по последовательному порту.

<!-- source:cn p7 unit:24 -->

#### 2. Программные проблемы

<!-- source:cn p7 unit:25 -->

(1) Проверьте порт связи BT-модуля с основным CPU; (2) проверьте соответствие DTS ядра аппаратной схеме; (3) проверьте соответствие firmware Bluetooth-модулю.

<!-- source:cn p7 unit:26 -->

3. По источнику, стек Bluetooth после Android 8.0 по умолчанию требует BLE. Поэтому нужен модуль с BLE, иначе Bluetooth не запустится.

<!-- source:cn p7 unit:27 -->

### 2.2 Прерывания Bluetooth-музыки

<!-- source:cn p7 unit:28 -->

#### 1. Аппаратные проблемы

<!-- source:cn p7 unit:29 -->

(1) Проверьте пайку BT-антенны; (2) измерьте соответствие радиочастотных параметров BT требованиям.

<!-- source:cn p7 unit:30 -->

#### 2. Программные проблемы

<!-- source:cn p7 unit:31 -->

Прерывания музыки часто связаны с аппаратурой. Сосуществование Wi-Fi и BT также может быть причиной, поэтому сначала обеспечьте актуальность Wi-Fi-драйвера. У многих бюджетных комбинированных Wi-Fi/BT-модулей сканирование Wi-Fi или BT также может вызывать прерывания Bluetooth-музыки.

{% endraw %}
