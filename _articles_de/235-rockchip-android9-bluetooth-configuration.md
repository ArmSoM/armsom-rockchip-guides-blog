---
title: "Rockchip Android 9.0 Bluetooth-Konfiguration"
description: "Rockchip Android 9.0 Bluetooth-Konfiguration — V1.0.0"
excerpt: "Rockchip Android 9.0 Bluetooth-Konfiguration"
translation_key: "235-rockchip-android9-bluetooth-configuration"
slug: "235-rockchip-android9-bluetooth-configuration"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Bluetooth]
---

{% raw %}

# Rockchip Android 9.0 Bluetooth-Konfiguration

Vollständige Konfiguration und Fehlersuche der technischen Seiten 4–7 aus der siebenseitigen chinesischen Quelle V1.0 vom 2018-11-16. Titel Android 9.0, Zweckabsatz Android 8.1: Beides bleibt als historische Quellangabe erhalten, nicht als aktuelle Kompatibilitätszusage. Nur chinesische Quelle, keine englischen Originalbilder. Keine technischen Bilder oder Tabellen; DTS und Befehle sind editierbar. Deckblatt, Revision, Inhaltsverzeichnis und wiederholte Kopf-/Fußzeilen entfallen. Keine Befehle, Firmwareänderungen oder Hardwaretests ausgeführt.

Prüfung: Seitengetrennte BT-DTS und Umbrüche in libbt-Pfaden sowie Snoop-Eigenschaften verbunden. 32k, GPIOs, Ports, Eigenschaften und Codeschreibweisen bleiben erhalten. Das pinctrl-DTS der Quelle enthält unvollständige Klammern/Semikolons; keine geratenen Ergänzungen. Vor Einsatz mit Quellcode und Hardware abgleichen. Stromversorgungsbefehle nur für autorisierte Geräte. Snoop-Logs können Kommunikation und Gerätedaten offenlegen: Zugriff begrenzen, Logging nach dem Debuggen deaktivieren und unnötige Logs entfernen.

<!-- source:cn p4 unit:0 -->

## 1 Zweck

<!-- source:cn p4 unit:1 -->

Automatische BT-Kompatibilität auf Android 8.1 und die zugehörigen Hinweise erläutern. Nach diesen Anweisungen erstellte Firmware unterstützt die entsprechenden BT-Module; ein Firmware-Image kann mehrere BT-Module unterstützen.

<!-- source:cn p4 unit:2 -->

### 1.1 Kernel-Hinweise

<!-- source:cn p4 unit:3 -->

1. Zuerst wifi_chip_type konfigurieren. Das System lädt je nach chip_type unterschiedliche libbt-Bibliotheken.

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

2. BT-DTS-Konfiguration

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

Die obige BT-DTS-Konfiguration legt hauptsächlich Stromversorgung, Interrupts und weitere Funktionspins fest. An den tatsächlichen Hardware-Schaltplan anpassen.

<!-- source:cn p5 unit:8 -->

3. Der BT-Stromversorgungstreiber liegt in net/rfkill/rfkill-bt.c und erzeugt /sys/class/rfkill/rfkill0/state.

<!-- source:cn p5 unit:9 -->

Der erste folgende Befehl schaltet das Bluetooth-Modul manuell ein, der zweite aus. Beim Aktivieren von Bluetooth schaltet das System die Versorgung automatisch ein.

<!-- source:cn p5 unit:10 -->

```text
echo 1 > /sys/class/rfkill/rfkill0/state
echo 0 > /sys/class/rfkill/rfkill0/state
```

<!-- source:cn p5 unit:11 -->

### 1.2 Android-Hinweise

<!-- source:cn p5 unit:12 -->

#### 1. Libbt

<!-- source:cn p5 unit:13 -->

Libbt initialisiert den Bluetooth-Chip einschließlich Firmware-Laden. Verschiedene Chips verwenden unterschiedliche, meist vom Chiphersteller bereitgestellte libbt-Versionen. Die Quelle verwendet hauptsächlich Broadcom und Realtek mit Code in hardware/broadcom/libbt beziehungsweise hardware/realtek/rtkbt/code/libbt-vendor. Normalerweise sind nur Modulport und Firmwarepfad zu konfigurieren. Broadcom und Realtek verwenden unterschiedliche Dateien: hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf beziehungsweise hardware/realtek/rtkbt/code/vendor/etc/bluetooth/rtkbt.conf.

<!-- source:cn p6 unit:14 -->

#### 2. bluedroid

<!-- source:cn p6 unit:15 -->

Bluedroid-Quellcode liegt unter system/bt. Seit Android 9.0 heißt die kompilierte Bibliothek libbluetooth.so. Einige konfigurierbare Makros können in device/rockchip/rk3368/bluetooth/bdroid_buildcfg.h stehen.

<!-- source:cn p6 unit:16 -->

Die Log-Ausgabestufen der Bluedroid-Komponenten lassen sich in /system/etc/bt_stack.conf auf dem Gerät ändern.

<!-- source:cn p6 unit:17 -->

"persist.bluetooth.btsnoopenable" steuert Snoop-Logging. "persist.bluetooth.btsnooppath" ändert den Speicherpfad; Standard ist "/data/misc/bluetooth/logs/btsnoop_hci.log". "persist.bluetooth.btsnoopsize" legt die Dateigröße fest.

<!-- source:cn p6 unit:18 -->

#### 3. PCBA-BT-Test

<!-- source:cn p6 unit:19 -->

Der PCBA-BT-Testcode verwendet standardmäßig /dev/ttyS0 als Modulport. Bei Bedarf einen anderen Port in /system/etc/bt_stack.conf konfigurieren.

<!-- source:cn p7 unit:20 -->

## 2 BT-Fehlersuche

<!-- source:cn p7 unit:21 -->

### 2.1 BT lässt sich nicht aktivieren

<!-- source:cn p7 unit:22 -->

#### 1. Hardwareprobleme

<!-- source:cn p7 unit:23 -->

(1) Einschalt-Timing von BT messen; (2) ordnungsgemäße Versorgung mit dem 32k-Takt prüfen; (3) serielle Datenkommunikation prüfen.

<!-- source:cn p7 unit:24 -->

#### 2. Softwareprobleme

<!-- source:cn p7 unit:25 -->

(1) Korrekte Konfiguration des Kommunikationsports zwischen BT-Modul und Haupt-CPU prüfen; (2) Kernel-DTS mit dem Hardwaredesign abgleichen; (3) passende Firmware für das Bluetooth-Modul prüfen.

<!-- source:cn p7 unit:26 -->

3. Laut Quelle benötigt der Bluetooth-Stack nach Android 8.0 standardmäßig BLE. Daher ist ein BLE-fähiges Modul erforderlich, sonst startet Bluetooth nicht.

<!-- source:cn p7 unit:27 -->

### 2.2 Bluetooth-Musik stockt

<!-- source:cn p7 unit:28 -->

#### 1. Hardwareprobleme

<!-- source:cn p7 unit:29 -->

(1) Ordnungsgemäße Lötung der BT-Antenne prüfen; (2) BT-Hochfrequenzwerte auf Einhaltung der Anforderungen messen.

<!-- source:cn p7 unit:30 -->

#### 2. Softwareprobleme

<!-- source:cn p7 unit:31 -->

Stockende Musik hat häufig Hardwareursachen. Auch Wi-Fi/BT-Koexistenz kann dazu führen; daher zuerst einen aktuellen Wi-Fi-Treiber sicherstellen. Bei vielen einfachen Wi-Fi/BT-Kombimodulen kann sowohl Wi-Fi- als auch BT-Scanning die Bluetooth-Musik stören.

{% endraw %}
