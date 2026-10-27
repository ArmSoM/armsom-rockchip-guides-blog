---
title: "Rockchip PCBA-Testtool: Entwicklerhandbuch"
description: "Rockchip PCBA-Testtool: Entwicklerhandbuch"
excerpt: "Rockchip PCBA-Testtool: Entwicklerhandbuch"
translation_key: "252-rockchip-pcba-test-tool"
slug: "252-rockchip-pcba-test-tool"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "PCBA"]
---

{% raw %}

# Rockchip PCBA-Testtool: Entwicklerhandbuch

Vollständiger technischer Text des zweisprachigen RK-KF-YF-264 V1.3: Überblick, Tests, Konfiguration, Parameter-/Testerweiterungen, Schnittstellen, Rotation, Build und Betrieb. Technische Versionsangaben bleiben: Bluetooth-Autoerkennung nach Android 5.0 und Android-10.0-Unterstützung in V1.3. Historischer Quellenumfang; Ziel-BSP prüfen. Keine Hardwaretests. Chinesisch/Englisch folgen ihren Quellabsätzen, Russisch/Deutsch sind vollständig übersetzt. Keine technischen Bilder oder Tabellen vorhanden oder erfunden. Deckblattdaten, Erklärungen, Kontakte, Zielgruppe und Revisionshistorie entfernt.

Prüfung: Seitenfortsetzungen verbunden, Schnittstellenerklärungen aus Kommentaren in vollständig übersetzten Text übernommen, kurze chinesische Kommentare lokalisiert. Quellprobleme bleiben: UST HOST/USB HOST, test_cong.cfg/test_config.cfg, Expample, Boardconfig.mk-Schreibweise, ungenutztes program gegenüber case1/case2 sowie Codec unter automatischen Tests trotz category=1. Typografische module_args-Anführungszeichen, error/n, ...... und nicht implementierte Bedingungen sind Quellbeispiele, kein direkt kompilierbares Programm. Chinesisch nennt konkret Rückkopplung statt englisch noise; diese Präzision bleibt. Formatieren löscht Daten: Zielmedium prüfen und sichern. Bei Audiotests Lautstärke und Aufnahmeprivatsphäre beachten. Keine Tests, Formatierung oder Builds ausgeführt.

<!-- source:bilingual p2 unit:0 -->

## Überblick

<!-- source:bilingual p2 unit:1 -->

Das PCBA-Testtool erkennt Funktionsfehler in der Serienfertigung schnell und verbessert die Produktionseffizienz. Testpunkte umfassen Display (LCD), WLAN (Wi-Fi), Bluetooth, DDR/eMMC, SD-Karte, USB HOST, Tasten (KEY), Lautsprecher und Kopfhörer (Codec).

<!-- source:bilingual p2 unit:2 -->

Die Tests sind automatisch oder manuell. WLAN, DDR/eMMC und Ethernet werden automatisch getestet; Tasten, SD-Karte, USB Host und Codec benötigen manuelle Mitwirkung.

<!-- source:bilingual p2 unit:3 -->

Die Testpunkte werden über test_config.cfg konfiguriert und können bei Bedarf erweitert werden. Einzelheiten stehen im Konfigurationsabschnitt dieses Dokuments.

<!-- source:bilingual p3 unit:4 -->

## Beschreibung der Testpunkte

<!-- source:bilingual p3 unit:5 -->

Die Testpunkte unterteilen sich in automatische und manuelle Tests.

<!-- source:bilingual p3 unit:6 -->

Automatische Tests werden vom System ausgeführt und bewertet, etwa Netzwerk und Speicher. Manuelle Tests erfordern menschliche Mitwirkung bei Durchführung oder Bewertung, etwa Audioaufnahme, Tasten, USB-Stick und SD-Karte.

<!-- source:bilingual p3 unit:7 -->

Zwei Farben kennzeichnen den Teststatus: Rot und Gelb.

<!-- source:bilingual p3 unit:8 -->

Gelb: Test noch ausstehend oder in Ausführung. Nach erfolgreicher Prüfung erscheint [PASS].

<!-- source:bilingual p3 unit:9 -->

Rot: Test fehlgeschlagen.

<!-- source:bilingual p3 unit:10 -->

### Automatische Tests

<!-- source:bilingual p3 unit:11 -->

#### DDR/EMMC-Kapazitätserkennung

<!-- source:bilingual p3 unit:12 -->

Der automatische Test zeigt DDR- und EMMC-Kapazität des Geräts in GB. Übliche DDR-Größen: 1GB, 2GB, 4GB; EMMC: 2GB, 4GB, 8GB, 16GB, 32GB, 64GB, 128GB. Beispiel: „Systemspeicher: [PASS] { DDR: 2GB, EMMC: 16GB }“.

<!-- source:bilingual p3 unit:13 -->

#### Drahtloses Netzwerk (Wi-Fi-Test)

<!-- source:bilingual p3 unit:14 -->

Wi-Fi wird automatisch geprüft: APs in der Umgebung werden gescannt, Name und Signalstärke des stärksten AP angezeigt. Die Anzeige reicht von 0 bis 4 Balken. Beispiel: „Netzwerk: [PASS] { “AP WIFI” Signalstärke 4 Balken }“.

<!-- source:bilingual p3 unit:15 -->

#### Ethernet-Test

<!-- source:bilingual p3 unit:16 -->

Es gibt zwei Verfahren. Standardmäßig prüft ping die Ethernet-Kommunikation: 5 Pakete gesendet, 5 empfangen, 0 verloren. Lokale Adresse und Ping-Ziel werden in external/rk-pcba-test/res/test_cong.cfg geändert.

<!-- source:bilingual p3 unit:17 -->

Das zweite Verfahren prüft, ob die Netzwerkkarte aktiviert ist. Dann existiert eine inet6-Adresse, etwa „inet6 addr: fe80::c8eb:eaff:fe6d:730d/64 Scope:Link“.

<!-- source:bilingual p3 unit:18 -->

Eine erkannte inet6-Adresse gilt dabei als funktionierendes Ethernet, bestätigt jedoch nicht die Kommunikationsfähigkeit. Für dieses Verfahren „use_ping = 1;“ in external/rk-pcba-test/lan_test.c auskommentieren.

<!-- source:bilingual p4 unit:19 -->

#### Kopfhörer-/Lautsprechertest (Codec)

<!-- source:bilingual p4 unit:20 -->

Codec bietet gleichzeitiges Aufnehmen/Wiedergeben oder Wiedergabe vor Aufnahme. Letzteres ist weniger effizient, vermeidet aber Rückkopplung beim Lautsprecher und eignet sich dafür. Der gleichzeitige Modus ist effizienter, verursacht am Lautsprecher jedoch Rückkopplung und eignet sich für Kopfhörer. Der Aufnahmepegel folgt dem Eingang und reicht von 0–100%, etwa „Aufnahmepegel: [25%]“. Zur Moduswahl siehe Konfiguration.

<!-- source:bilingual p4 unit:21 -->

#### Bluetooth-Test

<!-- source:bilingual p4 unit:22 -->

Bluetooth wird automatisch getestet. Nach Aktivierung erkennt das System den Zustand und zeigt PASS oder FAIL an.

<!-- source:bilingual p4 unit:23 -->

Standardport für Bluetooth ist /dev/ttyS0. Wird ein anderer verwendet, UartPort in hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf auf den tatsächlichen Port ändern.

<!-- source:bilingual p4 unit:24 -->

### Manuelle Tests

<!-- source:bilingual p4 unit:25 -->

#### SD-Kartentest

<!-- source:bilingual p4 unit:26 -->

Nach Einsetzen wird die SD-Karte automatisch erkannt. Der Bildschirm zeigt das Testergebnis und bei Erfolg die Kapazität.

<!-- source:bilingual p4 unit:27 -->

Die SD-Karte muss FAT32 verwenden; andere Formate werden nicht unterstützt. Sie darf nur eine Partition enthalten. Eine nicht passende Karte in das erforderliche Format formatieren.

<!-- source:bilingual p4 unit:28 -->

#### USB-HOST-Test

<!-- source:bilingual p4 unit:29 -->

USB HOST wird gewöhnlich mit einem USB-Stick getestet. Nach Einstecken erfolgt die automatische Erkennung; anschließend erscheinen Ergebnis und Kapazität.

<!-- source:bilingual p4 unit:30 -->

Wie bei SD-Karten muss der USB-Stick FAT32 und genau eine Partition besitzen; andere Formate werden nicht unterstützt. Andernfalls in das erforderliche Format formatieren.

<!-- source:bilingual p5 unit:31 -->

## Konfigurationsdatei

<!-- source:bilingual p5 unit:32 -->

Alle PCBA-Tests werden über test_config.cfg unter „Android SDK“/bootable/recovery/pcba_core/res/test_config.cfg konfiguriert. Die Datei wird an die Projekthardware angepasst, wählt die Testmodule und übergibt benötigte Parameter an das Testprogramm.

<!-- source:bilingual p5 unit:33 -->

Das Skript verwendet INI mit Abschnitten, Schlüsseln und Werten. Ein Abschnitt entspricht meist einem Modul. UTF-8 ist erforderlich; andere Kodierungen können unbekannte Fehler verursachen.

<!-- source:bilingual p5 unit:34 -->

### 1.3.1 Beispiel der Konfigurationsdatei

<!-- source:bilingual p5 unit:35 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
category = 0
[example]
```

<!-- source:bilingual p5 unit:36 -->

#### [example] / Example

<!-- source:bilingual p5 unit:37 -->

Example bezeichnet den Konfigurationsmodulnamen. Vorhandene Modulnamen der cfg-Datei dürfen nicht geändert werden, sonst startet der betreffende Test nicht.

<!-- source:bilingual p5 unit:38 -->

#### display_name

<!-- source:bilingual p5 unit:39 -->

display_name ist der angezeigte Name des Testmoduls. Er kann angepasst werden und darf höchstens 64 Byte lang sein. Bei leerem Namen läuft das Testprogramm nicht.

<!-- source:bilingual p5 unit:40 -->

#### activated

<!-- source:bilingual p5 unit:41 -->

activated bestimmt die Prüfung: 0 = Modul nicht testen, 1 = testen.

<!-- source:bilingual p5 unit:42 -->

#### program

<!-- source:bilingual p5 unit:43 -->

Dieser Schlüssel wird derzeit nicht verwendet und muss nicht konfiguriert werden.

<!-- source:bilingual p5 unit:44 -->

#### category

<!-- source:bilingual p5 unit:45 -->

category legt die Testart fest: 0 = automatisch, 1 = manuell.

<!-- source:bilingual p5 unit:46 -->

#### Beispiel

<!-- source:bilingual p6 unit:47 -->

```text
[Key] // Tastentest
display_name= "Key"
activated = 1 // diesen Punkt testen
program = "keytester"
category = 1 // manueller Test
```

<!-- source:bilingual p6 unit:48 -->

### Konfiguration einzelner Tests

<!-- source:bilingual p6 unit:49 -->

#### Audiotest

<!-- source:bilingual p6 unit:50 -->

```text
[Codec]
display_name= "Codec"
activated = 1 // diesen Punkt testen
program = "case1" //case1, case2
category = 1 // manueller Test
run_type = 1
delay = 5
volume = 40
```

<!-- source:bilingual p6 unit:51 -->

##### Case1

<!-- source:bilingual p6 unit:52 -->

Wiedergabe vor Aufnahme: weniger effizient, aber ohne Rückkopplung am Lautsprecher. Dieser Modus eignet sich für Lautsprecher.

<!-- source:bilingual p6 unit:53 -->

##### Case2

<!-- source:bilingual p6 unit:54 -->

Gleichzeitige Wiedergabe und Aufnahme: effizienter, jedoch mit Rückkopplung am Lautsprecher. Für Kopfhörer geeignet.

<!-- source:bilingual p6 unit:55 -->

#### Bluetooth-Test

<!-- source:bilingual p6 unit:56 -->

```text
[bluetooth]
display_name= "bluetooth"
activated = 1
program =
category =
run_type = 1
chip_type = "" ; rk903, mt6622, rda587x, rda5990,rtk8723as
```

<!-- source:bilingual p6 unit:57 -->

chip_type wählt den BT-Chiptyp. Standardmäßig leer, also kein BT-Test. Nach Android 5.0 ist keine Auswahl nötig; das System erkennt den Typ automatisch.

<!-- source:bilingual p6 unit:58 -->

#### Sensortest

<!-- source:bilingual p6 unit:59 -->

```text
[allsensor]
display_name= "allsensor"
activated = 0
program = ""
category = 0
run_type = 1
sensor_type = 39
```

<!-- source:bilingual p7 unit:60 -->

sensor_type wählt die Sensoren: 1 = GSENSOR, 2 = GYROSCOPE, 4 = COMPASS, 8 = LSENSOR, 16 = PSENSOR, 32 = GSENSOR_CALIBRATE. Für mehrere Sensoren die Werte addieren. Standard ist 39 = GSENSOR_CALIBRATE(32)+COMPASS(4)+GYROSCOPE(2)+GSENSOR(1).

<!-- source:bilingual p7 unit:61 -->

#### Kameratest

<!-- source:bilingual p7 unit:62 -->

```text
[camera]
display_name = "camera"
activated = 1
category = 0
program = ""
number = 2
```

<!-- source:bilingual p7 unit:63 -->

number bestimmt die Anzahl zu testender Kameras; höchstens 2 werden unterstützt.

<!-- source:bilingual p7 unit:64 -->

Zum eigenen Hinzufügen eines Testmoduls siehe „RK_PCBA_Camera移植说明v1.0.doc“.

<!-- source:bilingual p7 unit:65 -->

## Konfigurationsparameter erweitern

<!-- source:bilingual p7 unit:66 -->

Die Testparameter in test_config.cfg lassen sich erweitern. Benötigt ein Modul zusätzliche Konfigurationsparameter, diese wie folgt ergänzen:

<!-- source:bilingual p7 unit:67 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
module_args = “xxx”
```

<!-- source:bilingual p7 unit:68 -->

Im Testprogramm können die Parameterwerte über die API script_fetch abgerufen werden:

<!-- source:bilingual p7 unit:69 -->

```text
int script_fetch(char *main_name, char *sub_name, int value[], int count);
```

<!-- source:bilingual p7 unit:70 -->

main_name ist der Testmodulname in test_config.cfg, im Beispiel „example“.

<!-- source:bilingual p7 unit:71 -->

sub_name ist der Schlüssel, etwa activated, display_name oder module_args.

<!-- source:bilingual p7 unit:72 -->

### Beispiel zum Abrufen eines Werts

<!-- source:bilingual p8 unit:73 -->

```text
if(script_fetch("example", "module_args", (int *)des, 8) == 0)
{
printf("module_args value is: %s\n",des);
}
```

<!-- source:bilingual p8 unit:74 -->

## Testpunkte erweitern

<!-- source:bilingual p8 unit:75 -->

Das PCBA-Programm lässt sich um eigene Tests erweitern. Benötigt das Projekt ein bislang nicht unterstütztes Modul, ein eigenes Testprogramm schreiben und in das Testframework integrieren.

<!-- source:bilingual p8 unit:76 -->

Integrationsverfahren:

<!-- source:bilingual p8 unit:77 -->

Zuerst Testprogramm und Header erstellen. Die Testschnittstelle muss das Format void * xxxx_test(void *argv, display_callback *hook) besitzen.

<!-- source:bilingual p8 unit:78 -->

Festlegen, ob der Test manuell oder automatisch ist, und die benötigte Konfiguration in test_config.cfg eintragen.

<!-- source:bilingual p8 unit:79 -->

Den eigenen Testcode in rkfactory_test.cpp registrieren.

<!-- source:bilingual p8 unit:80 -->

```text
/* new_test.h */
#ifndef _NEW_TEST_H_
#define _NEW_TEST_H_
#include "display_callback.h"
void *new_test(void *argv, display_callback *hook);
#endif
/* new_test.cpp */
void *new_test(void *argv, display_callback *hook) {
struct testcase_info *tc_info = (struct testcase_info *)argv;
char msg[50];
snprintf(msg, sizeof(msg), "%s:[%s..]", "New Test", PCBA_TESTING);
hook->handle_refresh_screen(tc_info->y, msg);
if (/* pass or fail */) {
hook->handle_refresh_screen_hl(tc_info->y, msg, highlight);
}
}
/* rkfactory_test.cpp */
#include "new_test.h"
int start_test_pthread(struct testcase_info *tc_info) {
......
if (!strcmp(tc_info->base_info->name, "new")) {
init_title_lines_for_testcase(tc_info->base_info->name, tc_info);
std::thread *temp = new std::thread(&new_test, tc_info, get_display_hook());
if (!temp) {
printf("create %s test thread error/n", tc_info->base_info->name);
}
}
......
}
```

<!-- source:bilingual p9 unit:81 -->

### Schnittstellenbeschreibung

<!-- source:bilingual p9 unit:82 -->

msg_index ist der Index des angezeigten Eintrags, normalerweise dessen Position bei der Erstellung entsprechend der Position im Nachrichtenarray. msg ist der selbst festgelegte Anzeigetext vom Typ std::string.

<!-- source:bilingual p9 unit:83 -->

```text
handle_refresh_screen(int msg_index, string msg);
```

<!-- source:bilingual p9 unit:84 -->

highlight bestimmt, ob die Nachricht hervorgehoben wird; Standardfarbe ist Rot. Bei fehlgeschlagenem Test üblicherweise true übergeben.

<!-- source:bilingual p9 unit:85 -->

```text
handle_refresh_screen_hl(int msg_index, string msg, boolean highlight);
```

<!-- source:bilingual p9 unit:86 -->

new_test ist die Testfunktion des Moduls.

<!-- source:bilingual p9 unit:87 -->

## Displayrotation konfigurieren

<!-- source:bilingual p9 unit:88 -->

PCBA unterstützt 0°, 90°, 180° und 270° für unterschiedliche Bildschirmausrichtungen. 0° und 180° dienen dem Hochformat, 90° und 270° dem Querformat. Standard ist 0°.

<!-- source:bilingual p9 unit:89 -->

Die Displayrotation wird in device/rockchip/common/Boardconfig.mk konfiguriert.

<!-- source:bilingual p9 unit:90 -->

```text
#rotate screen to 0, 90, 180, 270
#0: ROTATION_NONE ORIENTATION_0 : 0
#90: ROTATION_RIGHT ORIENTATION_90 : 90
#180: ROTATION_DOWN ORIENTATION_180: 180
#270: ROTATION_LEFT ORIENTATION_270: 270
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

<!-- source:bilingual p9 unit:91 -->

## Image-Build, Konfiguration und Paketierung

<!-- source:bilingual p9 unit:92 -->

Das PCBA-Programm liegt unter „Android SDK“/bootable/recovery/pcba_core. Beim Build wird pcba_core statisch in recovery eingebunden. Dateien aus pcba_core/res werden automatisch in das pcba-Verzeichnis von recovery kopiert.

<!-- source:bilingual p9 unit:93 -->

PCBA läuft im Recovery-System. Ablauf: Nach dem Einschalten Recovery starten, anschließend das PCBA-Testprogramm für die Funktionstests ausführen.

{% endraw %}
