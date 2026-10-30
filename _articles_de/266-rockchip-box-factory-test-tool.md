---
title: "Rockchip Box: Funktionstests, Dauertests und Seriennummern"
description: "Rockchip Box: Funktionstests, Dauertests und Seriennummern"
excerpt: "Rockchip Box: Funktionstests, Dauertests und Seriennummern"
translation_key: "266-rockchip-box-factory-test-tool"
slug: "266-rockchip-box-factory-test-tool"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Dieser Artikel enthält den vollständigen technischen Inhalt von RK-YH-YF-501, Factory Test Tool Instructions V3.0. Die Quelle nennt Kompatibilität ab Android 4.4 und Android-Q-Unterstützung, ordnet den Rechner-Einstieg jedoch V4.0 zu; dieser Widerspruch bleibt dokumentiert. Für ArmSoM ist dies eine Referenz zur Rockchip-Android-SDK-Plattform: Board, SoC, BSP, Werkzeug- und Kernelversion prüfen. LED-, Tasten- und Framework-Funktionen erfordern Produktanpassungen; keine Hardwareprüfung auf ArmSoM wurde durchgeführt. Alle drei Abbildungen stammen aus dem chinesischen PDF; separate englische Bilder liegen nicht vor. Siehe [offizielle ArmSoM-Dokumentation](https://docs.armsom.org/).

## 1 Überblick

Das Werkzeug prüft Geräte in der Fertigung sowie die Stabilität bei Langzeitbelastung. Ein USB-Laufwerk oder eine SDCard startet den Test einer PCBA oder eines vollständigen Geräts mit vollständiger Firmware. Funktionstests: WIFI, BT, LAN, SD, USB, HDMI, linker/rechter Audiokanal, Tasten, LED und CVBS. Dauertests: Cpu, Vpu, Gpu und Memory.

## 2 Funktionstests

### 2.1 Oberfläche

![Funktionstest-Oberfläche, chinesische Quelle S. 6.](/docs/rockchip-box-factory-test-tool/images/cn-p006-1.png)

Funktionstest-Oberfläche, chinesische Quelle S. 6.

### 2.2 Konfiguration

`Factory_Test.ini` erstellen. `activated = 0` deaktiviert einen Test, `1` aktiviert ihn. Jeder Test unterstützt die Wiederholungstaste `test_key`: `test_key = 1` wiederholt fehlgeschlagene Tests über Taste 1 der Fernbedienung. Parameter und Originalkommentare einschließlich mehrfacher Schrägstriche bleiben unverändert.

```ini
[WIFI]
activated = 1 //是否启用该测试项，1：开启， 0：禁用
wifi_ap = zhangwen //测试使用的 Wifi Ap 名称
password = //Wifi Ap 密码
connect = 1 //是否连接 wifi 测试，1：连接 AP, 0：不连接
db_start = -30 //信号强度范围
db_end = -70 //信号强度范围

[BT]
activated = 1 //是否启用该测试项，1：开启， 0：禁用
bt_name = //配置指定蓝牙名称，默认为空

[LAN]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[SD]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[USB]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[HDMI]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[CHNL]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[LED]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[REST]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
[CVBS]
activated = 1 ////是否启用该测试项，1：开启， 0：禁用
```

WIFI-Parameter: `wifi_ap` bezeichnet den AP, `password` dessen Kennwort; `connect = 1` verbindet sich mit dem AP, `0` nicht. `db_start` und `db_end` definieren den Signalstärkebereich. BT `bt_name` legt den Gerätenamen fest und ist standardmäßig leer. `CHNL` bezeichnet die Audiokanäle; `REST` ist der Abschnittsname für RESET im Original.

### 2.3 Konfiguration verschlüsseln

`EncryptTool` im Verzeichnis `EncryptTool` starten, „Encrypt“ anklicken und `Factory_Test.ini` auswählen. Im selben Verzeichnis entsteht `Factory_Test_Signed.bin`; in `Factory_Test.bin` umbenennen.

![EncryptTool, chinesische Quelle S. 8.](/docs/rockchip-box-factory-test-tool/images/cn-p008-1.png)

EncryptTool, chinesische Quelle S. 8.

### 2.4 Funktionstest starten

`Factory_Test.bin` ins Stammverzeichnis der SDCard oder des USB-Laufwerks kopieren. Beim Einstecken startet der Funktionstest automatisch.

### 2.5 Testverhalten

| Test | Bewertung und Hinweise |
|---|---|
| Wifi | Sucht automatisch den konfigurierten AP, verbindet sich entsprechend der Einstellung und zeigt das Ergebnis; Fehlerursachen erscheinen in den Bemerkungen. |
| Bluetooth | Sucht automatisch Bluetooth-Geräte. Bei konfiguriertem Namen muss dieses Gerät gefunden werden; andernfalls genügt ein beliebiges Gerät. Ergebnis erscheint in der Oberfläche. |
| Lan | Bezieht automatisch eine IP-Adresse zur Ergebnisermittlung und Anzeige. |
| SDCard | Prüft automatisch Dateizugriffe und zeigt das Ergebnis. |
| USB | Prüft automatisch Dateizugriffe; bei mehreren USB-Ports stehen Einzelergebnisse in den Bemerkungen. |
| HDMI | Automatisch abgespieltes Testvideo manuell prüfen. Normale Wiedergabe ohne Störlinien oder andere Fehler gilt als bestanden. Standarddatei: `/sdcard/Aging_Test_Video.mp4`. |
| CVBS | Manuell prüfen, ob nach automatischer CVBS-Umschaltung der HDMI-Bildschirm erlischt und der CVBS-Bildschirm anzeigt. |
| CHNL | Manuell hören: männliche Stimme links und weibliche Stimme rechts bedeuten bestanden. |
| LED | Regelmäßiges LED-Blinken manuell beobachten. Produktspezifisch: LED-Steuerknoten im Kernel ergänzen oder neuen Pfad in `persist.sys.leds_path` setzen. |
| RESET | RESET auf der Board-Rückseite gedrückt halten. Bei Erfolg verschwindet der Dialog und Erfolg wird angezeigt. Produktspezifische Tastenzuordnung ist erforderlich. |

Die angezeigte Mac-Adresse ist standardmäßig die Ethernet-Adresse.

## 3 Dauertests

### 3.1 Oberfläche

![Dauertest-Oberfläche, chinesische Quelle S. 11.](/docs/rockchip-box-factory-test-tool/images/cn-p011-1.png)

Dauertest-Oberfläche, chinesische Quelle S. 11.

### 3.2 Konfiguration

`Aging_Test.ini` erstellen. Eine Sperre legt fest, ob zuvor der Funktionstest bestanden sein muss. Bei Serienfertigung Videos unter `system/usr/` oder `/sdcard/` in die Firmware integrieren, um Kopien auf vielen USB-Laufwerken oder SDCards zu vermeiden.

Der Text nennt ab V4.0 den Einstieg über `000.=` im Android-Rechner. Dies widerspricht V3.0 auf dem Deckblatt; tatsächliche Werkzeugversion prüfen. Videos müssen vorhanden sein, sonst startet der VPU-Dauertest nicht. Standarddateien sind `/sdcard/Aging_Test_Video.mp4` und `/sdcard/Aging_Test_Video_Float.mp4`; Dateien unter `system/usr/` haben Vorrang.

```ini
[FactoryTest]
required = 0 ////是否必须要通过功能测试后，才能进行老化测试。
///// 1：必须通过功能测试， 0：不必通过功能测试
```

`required = 1` verlangt einen bestandenen Funktionstest; `0` nicht.

### 3.3 Verschlüsselung

Wie beim Funktionstest vorgehen; die fertige Datei heißt `Aging_Test.bin`.

### 3.4 Dauertest starten

`Aging_Test.bin` ins Stammverzeichnis der SDCard/des USB-Laufwerks legen und einstecken. Rote und grüne LED blinken beim Start gemeinsam. Sechs Sekunden nach abnormalem Programmende leuchten beide dauerhaft; bei Testfehlern erlöschen beide. Diese Anzeigen müssen produktspezifisch konfiguriert werden.

### 3.5 Dauertest beenden

Zum Schutz vor versehentlichem Abbruch über die Fernbedienung führt HOME zum Desktop zurück. Die Funktion ist nicht allgemein verfügbar und benötigt passende SDK-Framework-Änderungen.

## 4 Seriennummer schreiben

### 4.1 Konfiguration

`SN_Test.ini` erstellen. `adb_enable = 1` aktiviert ADB, `0` deaktiviert es.

```ini
[ADB]
adb_enable = 1 //开启或关闭 ADB 1：开启，0：关闭
```

### 4.2 Verschlüsselung

Mit dem Verfahren des Funktionstests `SN_Test.bin` erzeugen.

### 4.3 Schreiben aktivieren

`SN_Test.bin` ins Stammverzeichnis der SDCard/des USB-Laufwerks legen. Einstecken aktiviert ADB für ein externes Werkzeug zum Schreiben der Seriennummer. Ein anderes Werkzeug schreibt die Nummer; dieser Vorgang aktiviert lediglich ADB und lässt sich erweitern.

**Liegen alle drei Konfigurationsdateien auf einem USB-Laufwerk, startet standardmäßig nur der Funktionstest.**

{% endraw %}
