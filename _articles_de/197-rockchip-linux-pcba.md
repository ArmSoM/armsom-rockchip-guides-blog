---
title: "Entwicklerhandbuch für Rockchip Linux PCBA-Tests"
description: "Entwicklerhandbuch für Rockchip Linux PCBA-Tests — V1.2.0"
excerpt: "Entwicklerhandbuch für Rockchip Linux PCBA-Tests"
translation_key: "197-rockchip-linux-pcba"
slug: "197-rockchip-linux-pcba"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, PCBA, Buildroot]
---

{% raw %}

# Entwicklerhandbuch für Rockchip Linux PCBA-Tests

Grundlage sind die chinesische und englische Profile-Fassung von RK-KF-YF-301 V1.2.0 vom 2025-12-13, mit Chinesisch als technischer Basis. Verglichen wurde auch ApplicationNote Englisch V1.1.2 vom 2021-07-30. Technische Kapitel, Protokolle, Parameter, Code und Abbildungen bleiben erhalten; ältere Abläufe sind gekennzeichnet. Für ArmSoM konkrete Platine, SoC, SDK/BSP und Peripherie prüfen. Es wurden keine Tests, Flashvorgänge oder Gerätebefehle ausgeführt. Der recovery-Ablauf formatiert userdata durch wipe_all und führt nicht lediglich einen Neustart aus.

Quelltabelle: RK3328, RK3326, RK3358, PX30, RK3229, PX3-SE, RK3399, RK3288 und weitere Linux-Plattformen; Werkzeug V1.7.

## 1. PCBA-Testwerkzeug

### 1.1 Überblick

Das PCBA-Werkzeug führt Funktionstests (FCT) in der Produktion aus, um Produktfunktionen schnell zu prüfen und die Fertigungseffizienz zu erhöhen. Es wurde für Windows entwickelt und läuft ausschließlich dort. Zusammen mit geräteseitigen Programmen prüft es Funktion und Qualität relevanter Komponenten. Vorgesehen sind Tests für SD, WLAN, Bluetooth, DDR, Ringmikrofon, USB-Host, LED, Wiedergabe, Aufnahme, Tasten, PDM Mic, Audio Line In und SPDIF IN/OUT; die Liste ist erweiterbar. SD, WLAN, Bluetooth, DDR, Ringmikrofon und USB-Host laufen automatisch und melden bestanden/nicht bestanden ohne Bedienereingriff. LED, Wiedergabe, Aufnahme, Tasten, PDM Mic, Audio Line In und SPDIF IN/OUT erfordern eine manuelle Bewertung.

### 1.2 Installation

PCBATool_Setup_xxxx.exe ausführen. Nach der Installation enthält das gewählte Verzeichnis das Programm, Konfigurationsdateien, Hilfsprogramme und Bibliotheken.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 6](/docs/rockchip-linux-pcba/assets/en-p006-figure-01.png)

Abbildung 1-1. Installation von PCBA Tool. CamData speichert einzelne Kamerabilder als BMP und wird derzeit nicht verwendet. Language enthält Sprachkonfigurationen. Log enthält Testprotokolle zur Diagnose. Config.ini speichert Werkzeug-, Sprach- und weitere Einstellungen. Bei eigener Verzeichniswahl einen ausschließlich englischen Pfad verwenden, um ADB-Fehler durch nichtenglische Zeichen zu vermeiden.

### 1.3 Werkzeugoberfläche

Abbildung 1-2 zeigt das Hauptfenster von PCBA Tool.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 7](/docs/rockchip-linux-pcba/assets/en-p007-figure-01.png)

Abbildung 1-2. Die Oberfläche hat vier Bereiche. Bereich 1 zeigt nach Testbeginn Gerätename und MAC, lädt vorbereitete Konfigurationen und bietet Testauswahl, Start/Stopp sowie manuelle Bestanden-/Fehlgeschlagen-Schaltflächen. Bereich 2 zeigt Testkategorien und Ergebnisse. Bereich 3 zeigt Ablaufmeldungen und Ergebnisse einzelner Tests. Bereich 4 zeigt Verbindung und Gesamtergebnis: Grün bedeutet verfügbares ADB-Gerät, Orange nicht verfügbar; nach Abschluss erscheint hier das Ergebnis.

### 1.4 Testkonfiguration

Mit „...“ bei der Testauswahl oder F2 den Konfigurationsdialog öffnen (Abbildung 1-3), die JSON-Datei wählen und Open drücken. Die Tests erscheinen mit ihrem konfigurierten Typ auto oder manual. Die Quelle verweist hier auf Bereich 3, obwohl die Testliste zuvor Bereich 2 zugeordnet wird. Abbildung 1-4 zeigt ein JSON-Beispiel.

```text
{
    "meta": {
        "version": "1.0",
        "author": "rockchip_dep3",
```

```text
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},

"test_groups": [
    {
        "test_item": "ddr_test",
        "test_bin_name": "echo_ddr_test",
        "name": "DDR Test",
        "test_type": "auto",
        "description": "",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "emmc_test",
        "test_bin_name": "echo_emmc_test",
        "name": "EMMC Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "rtc_test",
        "test_bin_name": "echo_rtc_test",
        "name": "RTC Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "wifi_test",
        "test_bin_name": "echo_wlan_test",
        "name": "WIFI Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },
```

```text
{
    "test_item": "bt_test",
    "test_bin_name": "echo_bt_test",
    "name": "BT Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "camera_test",
    "test_bin_name": "echo_camera_test",
    "name": "Camera Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "usbhost_test",
    "test_bin_name": "echo_usbhost_test",
    "name": "U-disk Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "sdcard_test",
    "test_bin_name": "echo_sdcard_test",
    "name": "SD-card Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "audio_play_test",
    "test_bin_name": "echo_audio_play_test",
```

```text
            "name": "Audio Playback Test",
            "description":"",
            "test_type": "manual",
            "enable": 0,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },

        {
            "test_item": "audio_record_test",
            "test_bin_name": "echo_audio_record_test",
            "name": "Recording Playback Test",
            "description":"",
            "test_type": "manual",
            "enable": 0,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },

        {
            "test_item": "key_test",
            "test_bin_name": "echo_key_test",
            "name": "Key Test",
            "description":"",
            "test_type": "manual",
            "enable": 1,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },
    },

    "mes_config": {
        "use_mes": false,
        "product":"RM1820SA0",
        "station":"FT1",
        "station_ip":"10.58.9.21",
        "note": "url_path1 use for actual production",
        "url_path1":
"http://rjiot.ruijie.com.cn/api/services/app/RuiJieATE/EquipmentUniversalPort",
        "note2": "url_path2 just use for test, don't use for production",
        "url_path2":
"http://10.60.5.223:8080/api/services/app/RuiJieATE/EquipmentUniversalPPort",
        "is_test": true,
        "ftp_server":"10.60.5.224",
        "ftp_port":"21",
        "username":"",
        "password":""

    }
}
```

Das JSON-Beispiel hat drei Abschnitte. meta: version bezeichnet die Version, author den Autor, description die Beschreibung und needreboot den Neustartbedarf nach Abschluss. test_group: test_item ist die programmseitige Testkennung; test_bin_name ist das mit dem PC-Werkzeug zusammenarbeitende Programm auf der Platine; name und description geben Name und Beschreibung an; test_type ist manual oder auto. Bei manual entscheidet der Bediener per Schaltfläche, bei auto das Werkzeug. is_loop_test, is_first, is_last und is_check_sn sind anpassbare Felder; bei Nichtgebrauch false setzen. mes_config konfiguriert den MES-Server zum Hochladen von Ergebnissen; bei Nichtgebrauch use_mes=false setzen und bei eigener Entwicklung anpassen. Allgemeine Tests umfassen SD, Tasten, WLAN, Bluetooth, Wiedergabe, Aufnahme, USB-Host, RTC und Kamera; weitere sollen folgen. RK3308 unterstützt SD, WLAN, Bluetooth, DDR, Ringmikrofon, USB-Host, LED, Wiedergabe, Aufnahme, Tasten, PDM Mic, Audio Line In und SPDIF IN/OUT. Bei anderen Rockchip-Chips Tests gemäß Anforderungen und Platinenhardware auswählen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 12](/docs/rockchip-linux-pcba/assets/en-p012-figure-01.png)

Abbildung 1-3. PCBA-Testauswahl

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 13](/docs/rockchip-linux-pcba/assets/en-p013-figure-01.png)

Abbildung 1-4. PCBA-Konfiguration abgeschlossen

#### 1.4.1 Testbeschreibung

1. WLAN ist automatisch: Das Gerät sucht nahe Zugangspunkte und bewertet das Suchergebnis.

2. Bluetooth ist automatisch. Ältere Plattformen schalten Bluetooth aus, wieder ein und aktivieren es nach dem Firmwareladen. Neuere überspringen diesen Schritt, da die Firmware beim Start geladen wird. Erfolg erfordert eine aktivierte Schnittstelle hci0 und eine Bluetooth-Hardwareadresse.

3. DDR ist automatisch: Die DDR-Kapazität wird gelesen; eine korrekte Abfrage bestimmt den Erfolg.

4. EMMC ist automatisch: Die EMMC-Kapazität wird gelesen; eine korrekte Abfrage bestimmt den Erfolg.

5. RTC ist automatisch: Eine feste Systemzeit wird gesetzt, der Prozess schläft eine festgelegte Dauer und liest danach die Zeit. Stimmt die Differenz mit der Dauer überein, ist der Test bestanden, andernfalls fehlgeschlagen.

6. SD ist automatisch. Ein Skript prüft nach dem Einstecken den Geräteknoten. Bei Erkennung wird die Karte im vorgegebenen Verzeichnis eingehängt und ihre Kapazität erfasst. Fehlt der Knoten nach 60 Sekunden, beendet sich der Test mit Fehler.

7. USB-Host ist automatisch. Nach Anschluss des USB-Geräts prüft das Skript dessen Knoten, hängt es im vorgesehenen Verzeichnis ein und erfasst die Kapazität. Ohne Erkennung binnen 60 Sekunden endet der Test mit Fehler.

8. CAMERA ist automatisch: v4l2_capture.sh findet verfügbare Kameras und nimmt ein Bild vorzugsweise als JPG auf. photo_check.sh prüft das gespeicherte Bildformat und bestimmt das Ergebnis.

9. LED ist manuell. Nacheinander erscheinen Rot, Grün, Blau und Weiß als Mischung aller drei Farben. Der Bediener bewertet die korrekte Anzeige und wählt Pass oder Fail für den nächsten Test.

10. Wiedergabe ist manuell: Das Gerät spielt Audiodaten vom festgelegten Ort. Die Klangqualität beurteilen und mit Pass oder Fail fortfahren.

11. Aufnahme ist manuell: Das Gerät nimmt einen Abschnitt vom aktuellen Mikrofon auf und gibt ihn wieder. Der Bediener bewertet die Qualität und wählt Pass oder Fail.

12. Tasten sind manuell. Physische Tasten drücken; das Werkzeug zeigt die erkannte Taste an. Nach allen definierten prüfbaren Platinentasten erscheint eine Meldung, die den erfolgreichen Durchlauf anzeigt. Andernfalls ist der Test fehlgeschlagen. Das Endergebnis wird manuell mit Pass oder Fail gesetzt.

13. PDM Mic wird manuell geprüft: Wiedergabe beurteilen und Pass oder Fail wählen.

14. Audio Line In ist manuell: Audioquelle am Line-In der Platine anschließen und Musik abspielen. Lautsprecherklang beurteilen, dann Pass oder Fail wählen.

15. SPDIF IN/OUT ist ein manueller Test.

#### 1.4.2 Testablauf

Schritt 1: PCBA Tool installieren und starten. Grün unten rechts zeigt ein erkanntes angeschlossenes ADB-Gerät, Orange ein nicht verfügbares Gerät. Schritt 2: [...] neben Load Test Items oder F2 drücken, die JSON-Konfiguration wählen und Open drücken. Im Hauptfenster erscheinen die vorgesehenen Tests.

Schritt 3: Start Testing startet alle automatischen Tests und den ersten manuellen Test gleichzeitig. Automatische Tests benötigen kein Pass/Fail. Siehe Abbildung 1-5.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 15](/docs/rockchip-linux-pcba/assets/en-p015-figure-01.png)

Abbildung 1-5. Teststart. Schritt 4: Manuelle Tests laufen einzeln. Nach jedem Pass oder Fail wählen, um ihn zu beenden und fortzufahren. Beim Tastentest zeigt das Meldungsfenster den geräteseitig definierten Tastennamen und nach Abschluss eine Meldung; andere manuelle Ergebnisse beurteilt der Bediener.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 16](/docs/rockchip-linux-pcba/assets/en-p016-figure-01.png)

Abbildung 1-6. Tastentest

#### 1.4.3 Kamera: historische Schaltflächenfunktion

Historische Beschreibung der separaten Kameraschaltfläche: Die Unterstützung hängt von der Plattform ab. Ohne Unterstützung ist Camera Test grau und deaktiviert; der Abschnitt kann entfallen. Bei Unterstützung ist die Schaltfläche aktiv.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 16](/docs/rockchip-linux-pcba/assets/en-p016-figure-02.png)

Dev_Plateform in Config.ini definiert die Plattform. Ohne Wert kann die Kameraschaltfläche aktiv erscheinen, auf einer nicht unterstützten Plattform aber einen Fehler auslösen. V4l2_test erfasst einen Frame und speichert ihn; Quellen: ./external/rk_pcba_test/camera_api. nv12_to_bmp_main konvertiert NV12 nach BMP zur Anzeige am PC; dazu wird die statische Bibliothek libyuv.a benötigt, Quellen unter ./external/libyuv.

#### 1.4.4 Neustart

Im Konfigurationsabschnitt meta steuert needreboot den Neustart.

```text
"meta": {
    "version": "1.0",
    "author": "rockchip_dep3",
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},
```

Bei zwei rootfs, etwa A/B, dient system_a standardmäßig pcba_rootfs.img und system_b der normalen Systemfirmware. Ist die Option aktiv und sind alle Tests bestanden, wird ins normale System neu gestartet. Bei einem einzelnen System startet dagegen erneut das PCBA-rootfs.

### 1.5 Weiterentwicklung

Zur Erweiterung von PCBA Tool eigene Tests nach den folgenden Schritten hinzufügen.

#### 1.5.1 Entwicklungsablauf

VS2022 installieren: Desktopentwicklung mit C++ wählen und die C++-MFC-Komponente für die v143-Buildtools aktivieren, wie in Abbildung 1-8.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 17](/docs/rockchip-linux-pcba/assets/en-p017-figure-01.png)

Abbildung 1-8. PCBA-Entwicklungsumgebung. Das Projekt öffnen und in der Ressourcenansicht in IDD_SETTING_DIALOG eine CheckBox für den neuen Test hinzufügen; ID und Beschriftung festlegen.

In SettingBase.h eine Zeichenkettenvariable für den Test und eine boolesche Auswahlvariable in CIniSettingBase hinzufügen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-01.png)

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-02.png)

Abbildung 1-8. Variablen für Testname und Auswahl. In LoadToolSetting in SettingBase.cpp ihre Initialisierung nach dem Muster anderer Tests ergänzen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-03.png)

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-04.png)

Abbildung 1-9. Variableninitialisierung. In Config.ini Testname und Standardauswahl hinzufügen. Für SD enthält SdcardName den Namen des Platinenprogramms echo_sdcard_test; SdcardTest=0 bedeutet nicht ausgewählt, 1 ausgewählt. Beide Werte werden im Code ausgewertet.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-05.png)

Abbildung 1-10. config.ini-Variablen. Testbeschriftungen in Chinese.ini und English.ini ergänzen. Beim SD-Beispiel bezeichnet [DIALOG_129] die Ressourcen-ID von IDD_SETTING_DIALOG und BUTTON_1010 die des SD-Tests; der Text nach dem Gleichheitszeichen wird angezeigt.

Die Dialog- oder CheckBox-ID steht in resource.h des VS-Projekts. echo_sdcard_test muss SdcardName in config.ini entsprechen; der Text nach dem Gleichheitszeichen erscheint in der Testliste.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-01.png)

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-02.png)

Abbildung 1-11. Chinese.ini-Variablen. Schnittstellen des neuen Tests in PcbaTest.cpp und PcbaTest.h ergänzen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-03.png)

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-04.png)

Abbildung 1-12. Testschnittstellen. In initTestCase in IPSearchDlg.cpp die Auswahl des neuen Tests nach bestehenden Beispielen ergänzen:

```text
if (m_Configs.bCpuTest) {
TestCase.TestName = m_Configs.strCpuTest;
TestCase.bAuto = true;
TestCase.bTestLoop = true;
TestCase.nTestStatus = TEST_UNDO;
m_TestCaseList.push_back(TestCase);
}
```

In DoTestItem Auswahl und Ausführung des neuen Tests nach bestehenden Beispielen ergänzen:

```text
else if (strTestName.compare(m_Configs.strCpuTest) == 0)
{
 ret = m_DevTest.CpuTest(m_TestSocket, wstr2str(strTestName));
}
```

Die Struktur TestCase ist wie folgt definiert:

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 20](/docs/rockchip-linux-pcba/assets/en-p020-figure-01.png)

Abbildung 1-13. Teststruktur. In ConfigDlg.cpp die Abfrage des CheckBox-Zustands in BOOL CConfigDlg::OnInitDialog() ergänzen. Beispiel:

```text
((CButton*)GetDlgItem(IDC_CHECK_CPU))->SetCheck(m_Configs.bCpuTest  ?BST_CHECKED:
BST_UNCHECKED);
```

In Void CConfigDlg::OnBnClickedBtnOk() die Standardauswahl des Tests setzen. Beispiel:

```text
m_Configs.bCpuTest       = (((CButton*)GetDlgItem(IDC_CHECK_CPU))->GetCheck() ==
BST_CHECKED);
```

Nach fehlerfreier Kompilierung ist die Ergänzung abgeschlossen. Das Werkzeug im DEBUG-Modus mit Haltepunkten und Ablaufverfolgung starten, um den neuen Test zu prüfen.

#### 1.5.2 Paketierung und Freigabe

Inno Setup installieren, ein kleines kostenloses Paketierungsprogramm für Windows. Die Quelle verweist auf die Inno-Setup-Downloadseite. Paketierungsverzeichnis: PCBATool_package.

PCBATool_package enthält das kompilierte PCBA-Programm, die auszuliefernden ini-Konfigurationen, Sprachdateien und DLLs. pcbatool_setup.iss als Inno-Setup-Konfiguration öffnen, APP-Angaben anpassen und Run/F9 ausführen. Das Installationspaket entsteht im gleichrangigen Verzeichnis output. Gleichzeitig startet die Installation; bei Nichtbedarf abbrechen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 21](/docs/rockchip-linux-pcba/assets/en-p021-figure-01.png)

Abbildung 1-14. Verzeichnis PCBATool_package

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 21](/docs/rockchip-linux-pcba/assets/en-p021-figure-02.png)

Abbildung 1-15. Paketierung mit Inno Setup

### 1.6 Quellcode beziehen

Zur Weiterentwicklung sind die Quellen über den FAE erhältlich. Quellcodeadresse:

```text
git clone ssh://10.10.10.29:29418/linux/rk_pcba_tool
```

## 2. PCBA-Softwareentwurf

### 2.1 Blockdiagramm

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 22](/docs/rockchip-linux-pcba/assets/en-p022-figure-01.png)

Abbildung 2-1. PCBA-Blockdiagramm

1. Das Werkzeug kommuniziert über ADB mit dem Gerät.

2. Jeder Test läuft als eigenständiger Prozess unabhängig von den anderen.

### 2.2 Ablauf

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 23](/docs/rockchip-linux-pcba/assets/en-p023-figure-01.png)

Abbildung 2-2. PCBA-Testablauf

### 2.3 Befehls- und Protokollformat

PC und Gerät kommunizieren über einen Socket über ADB. Befehl:

```text
Command:<TYPE><TEST_ITEM><CMD><MSG>
Response:<TYPE><TEST_ITEM><RES><MSG><STATUS><RESULT><ERR_CODE>
```

### 2-1 Command

| Feld/Wert | Bedeutung |
| --- | --- |
| `TYPE` | Typ (Quellüberschrift: TPYE) |
| `TEST_ITEM` | Testname |
| `CMD` | Auszuführender Befehl |
| `MSG` | Zusätzliche Daten |

### 2-2 Response

| Feld/Wert | Bedeutung |
| --- | --- |
| `TYPE` | Typ (Quellüberschrift: TPYE) |
| `TEST_ITEM` | Testname |
| `RES` | Antwortbefehl |
| `MSG` | Zusätzliche Daten |
| `STATUS` | Status |
| `RESULT` | Testergebnis |
| `ERR_CODE` | Fehlercode |

### 2-3 TYPE

| Feld/Wert | Bedeutung |
| --- | --- |
| `CMD` | PC sendet Befehl ans Gerät |
| `RES` | Gerät antwortet dem PC |

### 2-4 TEST_ITEM

| Feld/Wert | Bedeutung |
| --- | --- |
| `KEY_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `SDCard_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `AUDIO_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `HDMI_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `CAMERA_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `USB_HOST_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `LED_test` | Konkreter Test; Name entspricht dem Programm; erweiterbar |
| `...` | Konkreter Test; Name entspricht dem Programm; erweiterbar |

### 2-5 CMD/RES

| Feld/Wert | Bedeutung |
| --- | --- |
| `ENTER` | Testmodus betreten, ohne Testkennung |
| `EXIT` | Testmodus verlassen, ohne Testkennung |
| `START` | Test starten |
| `SAVE` | Ergebnis speichern |
| `QUERY` | Teststatus abfragen |

### 2-6 MSG

| Feld/Wert | Bedeutung |
| --- | --- |
| `msg` | Befehls- oder Antwortdaten; ohne Daten weglassen |

### 2-7 STATUS

| Feld/Wert | Bedeutung |
| --- | --- |
| `ACK` | Erfolgreiche Antwort; jeder PC-Befehl ist zu beantworten |
| `NAK` | Fehlgeschlagene Antwort |

### 2-8 RESULT

| Feld/Wert | Bedeutung |
| --- | --- |
| `TESTING` | Test läuft |
| `PASS` | Bestanden |
| `FAIL` | Fehlgeschlagen |
| `VERIFY` | Test abgeschlossen; Ergebnis bestätigen |
| `PRESS` | Nur Tastentest: Taste gedrückt |

### 2-9 ERR_CODE

| Feld/Wert | Bedeutung |
| --- | --- |
| `err_code` | Fehlerursache; 0x01–0xFF; bei Erfolg weglassen |

1. PCBA-Testmodus betreten Eintritt:{"TYPE":"CMD", "CMD":"ENTER"} Antwort auf Eintritt: Erfolg: {"TYPE":"RES", "RES":"ENTER", "STATUS":"ACK"} Fehler: {"TYPE":"RES", "RES":"ENTER", "STATUS":"NAK", "ERR_CODE":"err_code"}

2. PCBA-Testmodus verlassen Verlassen: {"TYPE":"CMD", "CMD":"EXIT"} Antwort auf Verlassen: {"TYPE":"RES", "CMD":"EXIT", "STATUS":"ACK"}

{"TYPE":"RES", "RES":"EXIT", "STATUS":"NAK", "ERR_CODE":"err_code"}

3. Beispiel Tastentest; andere Tests sind entsprechend Testbeginn {"TYPE":"CMD", "TEST_ITEM":"KEY-TEST", "CMD":"START"} Antwort auf Eintritt: {"TYPE":"RES", "TEST_ITEM":"KEY-TEST", "RES":"START", "STATUS":"ACK"} {"TYPE":"RES", "TEST_ITEM":"KEY-TEST", "RES":"START", "STATUS":"NAK", "ERR_CODE":"err_code"}

4. Teststatus abfragen {"TYPE":"CMD", "TEST_ITEM":"test_item", "CMD":"QUERY" } Antwort auf Abfrage: Fehlerantwort: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"NAK", "ERR_CODE":"err_code"} Test läuft:{"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"TESTING"} Bestanden: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"PASS"} Ergebnisbestätigung: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"VERIFY"} Fehlgeschlagen:{"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"FAIL", "ERR_CODE":"err_code"} Taste gedrückt: {"TYPE":"RES", "TEST_ITEM":"key_test", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"PRESS"}(nur beim Tastentest)

## 3. Testcodearchitektur

### 3.1 Quellcodestruktur

PCBA-Tests sind eigenständig ausführbare Programme auf dem Gerät. Die Quelle nennt /extenal/rk-pcba-test (Schreibweise erhalten); die Struktur folgt unten.

```text
├── audio_test.h
├── bt_test.h
├── cJSON
│   ├── cJSON.c
│   └── cJSON.h
├── CMakeLists.txt
├── common.c
├── common.h
├── cpu_test.h
```

```text
├── ddr_test.h
├── echo_audio_linein_test.c
├── echo_audio_play_test.c
├── echo_audio_record_test.c
├── echo_audio_test.c
├── echo_auto_test.c
├── echo_bt_test.c
├── echo_camera_test.c
├── echo_cpu_test.c
├── echo_ddr_test.c
├── echo_discovery.c
├── echo_emmc_test.c
├── echo_ir_test.c
├── echo_key_test.c
├── echo_led_test.c
├── echo_pcbatest_server.c
├── echo_ringmic_pdm_test.c
├── echo_ringmic_test.c
├── echo_rotary_test.c
├── echo_rtc_test.c
├── echo_sdcard_test.c
├── echo_touchpad_test.c
├── echo_usbhost_test.c
├── echo_wlan_test.c
├── emmc_test.h
├── key_test.h
├── led_test.h
├── LICENSE
├── mic_test_Linux
│   ├── Makefile
│   ├── record_test.c
│   ├── record_test.h
│   ├── vibrate_test.c
│   └── vibrate_test.h
├── pcba_minui
│   ├── audio_play_test.c
│   ├── audio_play_test.h
│   ├── audio_record_test.c
│   ├── audio_record_test.h
│   ├── bt_test.c
│   ├── bt_test.h
│   ├── common.h
│   ├── ddr_test.c
│   ├── ddr_test.h
│   ├── debug.h
│   ├── emmc_test.c
│   ├── emmc_test.h
│   ├── key_test.c
│   ├── key_test.h
│   ├── Language
│   │   ├── language_cn.h
│   │   ├── language_en.h
│   │   └── language.h
│   ├── list.h
│   ├── minui
│   │   ├── Android.mk
```

```text
│   │   ├── events.c
│   │   ├── font_10x18.h
│   │   ├── graphics_adf.c
│   │   ├── graphics.c
│   │   ├── graphics_drm.c
│   │   ├── graphics_fbdev.c
│   │   ├── graphics.h
│   │   ├── minui.h
│   │   ├── mkfont.c
│   │   └── resources.c
│   ├── minzip
│   │   ├── Android.mk
│   │   ├── Bits.h
│   │   ├── DirUtil.c
│   │   ├── DirUtil.h
│   │   ├── Hash.c
│   │   ├── Hash.h
│   │   ├── inline_magic.h
│   │   ├── Inlines.c
│   │   ├── Log.h
│   │   ├── SysUtil.c
│   │   ├── SysUtil.h
│   │   ├── Zip.c
│   │   └── Zip.h
│   ├── mtdutils
│   │   ├── Android.mk
│   │   ├── flash_image.c
│   │   ├── mounts.c
│   │   ├── mounts.h
│   │   ├── mtdutils.c
│   │   ├── mtdutils.h
│   │   ├── rk29.c
│   │   └── rk29.h
│   ├── pcba_core.c
│   ├── recovery_ui.h
│   ├── res
│   │   └── udisktester.sh
│   ├── rtc_test.c
│   ├── rtc_test.h
│   ├── safe_iop.c
│   ├── safe_iop.h
│   ├── screen_test.c
│   ├── screen_test.h
│   ├── screen_ui.h
│   ├── script.c
│   ├── script.h
│   ├── script_parser.c
│   ├── script_parser.h
│   ├── sdcard_test.c
│   ├── sdcard_test.h
│   ├── strlcat.c
│   ├── strlcpy.c
│   ├── test_case.h
│   ├── touch_test.c
│   ├── udisk_test.c
│   ├── udisk_test.h
```

```text
│   ├── ui.c
│   ├── wlan_test.c
│   └── wlan_test.h
├── pcbatest_server.h
├── rk_pcba_test
│   ├── audio_test_start.wav
│   ├── font.png
│   ├── fw_bcm4339a0_ag.bin
│   ├── photo_check.sh
│   ├── rectest_400hz.wav
│   ├── sdcard_test.sh
│   ├── switch_inoutput.sh
│   ├── test_config.cfg
│   ├── usbhost_test.sh
│   ├── v4l2_capture.sh
│   ├── vibration.wav
│   └── wifi.sh
├── rk_pcba_test_led.h
├── rtc_test.h
├── tinyalsa
│   ├── asoundlib.h
│   ├── pcm.c
│   ├── tinycap.c
│   └── tinyplay.c
└── wlan_test.h
```

### 3.2 Architekturbeschreibung

Beim Test ist das Gerät TCP-Server und der PC Client. Die Kommunikation ist hauptsächlich in echo_pcbatest_server.c implementiert; der Ablauf folgt in der Abbildung.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 30](/docs/rockchip-linux-pcba/assets/en-p030-figure-01.png)

Abbildung 3-1. Geräteseitige Testarchitektur

### 3.3 Firmware erzeugen

Es gibt zwei Buildwege. Der erste erzeugt ein separates PCBA-rootfs zum Flashen in die rootfs-Partition. Nach dem Start läuft direkt die Testumgebung, die der angeschlossene PC mit PCBA Tool verwendet. Der zweite integriert Tests in recovery: Ein spezieller PCBA-Befehl in misc startet das Testprogramm; nach Abschluss wird er gelöscht und der Neustart führt ins normale System. Bei wenig Speicher eignet sich der erste Weg, benötigt jedoch zweimaliges Flashen von rootfs: zuerst Test-, dann normale Firmware. Bei ausreichend Speicher kann der zweite Weg genutzt werden; der Test

startet das Gerät nach Abschluss automatisch ins normale System neu, ohne erneutes Flashen.

#### 3.3.1 Separates rootfs-Image

1. PCBA-Konfiguration in Buildroot. Fehlt unter buildroot/configs/ die Datei rockchip_rkxxxx_pcba.defconfig für den Chip xxxx, eine funktionsfähige rootfs-defconfig dort als Vorlage verwenden. Alle erforderlichen Testmodule und Parameter ergänzen. Notwendige Grundkonfigurationen für rockchip_rkxxxx_pcba.defconfig:

```text
#include "base/pcba.config"
```

defconfig gemäß Testbedarf ergänzen. Beispielsweise für RK3328 mit WLAN-, Bluetooth-, Kamera-, Wiedergabe-, Aufnahme- und USB-Speichertests die folgenden Optionen oder Konfigurationsdateien hinzufügen.

```text
#include "fs/vfat.config"
#include "multimedia/audio.config"
#include "multimedia/camera.config"
#include "multimedia/gst/audio.config"
#include "multimedia/gst/camera.config"
#include "multimedia/gst/rtsp.config"
#include "multimedia/gst/video.config"
#include "multimedia/mpp.config"
#include "wifibt/bt.config"
#include "wifibt/wireless.config"
```

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 32](/docs/rockchip-linux-pcba/assets/en-p032-figure-01.png)

Abbildung 3-2. PCBA-Konfiguration im rootfs

2. Buildroot-Buildumgebung prüfen. buildroot/package/rockchip/rockchip-pcba/ muss Config.in und rockchip-pcba.mk enthalten.

3. PCBA mit Buildroot kompilieren. Nach Vorbereitung der Konfigurationen im SDK-Hauptverzeichnis die Umgebung initialisieren:

```text
source envsetup.sh
```

Im erzeugten lunch-Menü die Nummer der PCBA-Konfiguration für den Chip wählen und kompilieren:

```text
make rockchip-pcba
```

Nach Änderungen an PCBA-Quellen oder -Konfiguration vollständig neu kompilieren:

```text
make rockchip-pcba-dirclean
make rockchip-pcba-rebuild
```

4. rootfs.img erzeugen. Folgende Einstellung in rockchip_rkxxxx_evb_defconfig ergänzen:

```text
RK_BUILDROOT_BASE_CFG="rkxxxx_pcba"
```

Anschließend den Buildbefehl ausführen:

```text
./build.sh buildroot
```

Damit entsteht rootfs.img. Hinweise:

1. In buildroot/package/rockchip/partinit/partinit.mk ln -s userdata data entfernen. Diese Verknüpfung bindet data an userdata, wodurch die userdata-Partition das PCBA-Programm überdeckt. Ist die Verknüpfung nötig, die PCBA-mk-Datei ändern und Tests anderswo installieren.

2. Bei folgendem Buildfehler:

```text
processing option: pcba
Skipping build_pcba for missing configs:  RK_CFG_PCBA.
```

RK_CFG_PCBA in der Platinenkonfiguration device/rockchip/.Boardconfig.mk für die Plattform ergänzen; Beispiel RK3308:

```text
export RK_CFG_PCBA=rockchip_rk3308_pcba
```

Für andere Plattformen entsprechend rockchip_rkxxxx_pcba ergänzen.

#### 3.3.2 Integration in recovery

Für einmaliges Flashen und anschließenden Start ins normale System PCBA in recovery integrieren. Beim ersten Flashen muss misc.img den speziellen PCBA-Startbefehl enthalten (Abbildung 3-7); Änderungen sind mit UE oder einem anderen Hexeditor möglich. Es folgt das Beispiel RK3308 EVB. Die PCBA-Konfiguration liegt in /buildroot/configs/rockchip/pcba_test.config und wird in Abbildung 3-3 gezeigt.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-01.png)

Abbildung 3-3. PCBA-Konfiguration in recovery. Die Optionen gelten möglicherweise nur für RK3308; andere Plattformen benötigen angepasste Optionen gemäß Hardware und Software. Recovery-Konfiguration: buildroot/configs/rockchip_rk3308_recovery_defconfig.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-02.png)

Abbildung 3-4. Die recovery-Konfiguration bindet PCBA-Einstellungen ein. Im Projekthauptverzeichnis ausführen:

```text
./build.sh recovery
```

Nach der Kompilierung entstehen folgende Programme:

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-03.png)

Abbildung 3-5. Ergebnis der Testprogrammkompilierung

Wegen unterschiedlicher Hardware Tests in exteral/rk_pcba_test an die eigene Platine anpassen. SDK-Code ist nur an RK-EVB-Platinen angepasst; einzelne Tests passen möglicherweise nicht zu eigener Hardware. Nach Änderungen im SDK-Hauptverzeichnis ausführen:

```text
make pcba-rebuild
```

Danach erzeugt ./build.sh recovery das Image unter ./buildroot/output/rockchip_rk3308_recovery/images/; die Quelle schreibt ecovery.img. Im Hauptverzeichnis ausführen:

```text
./mkfirmware.sh
```

Die Images aller Partitionen werden unter rocketdev/ erzeugt (Quellschreibweise). recovery.img in die recovery-Partition flashen. Andere Plattformen siehe deren Dokumentation. Hinweise:

1. fstab unter /buildroot/board/rockchip/rk3308/fs-overlay-pcba/etc wird nicht benötigt: Es überschreibt die von partinit erzeugte fstab und stört recovery.

```text
~/3308/buildroot/board/rockchip/rk3308/fs-overlay-pcba/etc $ ls
asound.conf  init.d  inittab  profile.d
```

2. In buildroot/package/rockchip/partinit/partinit.mk ln -s userdata data entfernen, sonst überdeckt userdata das PCBA-Programm. Falls benötigt, die PCBA-mk-Datei anpassen und Programme in einem anderen Verzeichnis installieren.

3. buildroot/package/rockchip/pcba/Config.in und pcba.mk wie folgt ändern:

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 35](/docs/rockchip-linux-pcba/assets/en-p035-figure-01.png)

Abbildung 3-6. Konfiguration und Makefile ändern

Die Änderung entfernt in recovery die Verknüpfung von data auf userdata; andernfalls wird die Audiowiedergabe beim normalen Systemstart beeinträchtigt. data neu erstellen und die unter userdata erzeugten Programme dorthin kopieren.

4. Für Tests in recovery misc.img mit dem PCBA-Testbefehl in misc flashen.

5. Abbildung 3-7 zeigt das PCBA-Befehlsformat in misc.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 36](/docs/rockchip-linux-pcba/assets/en-p036-figure-01.png)

Abbildung 3-7. Testbefehl in misc.img

5. Im PCBA-JSON "needreboot": true setzen. Nach erfolgreichen Tests sendet das Werkzeug die Neustartmeldung. Das Gerät ersetzt factory_pcba_test in misc durch wipe_all: Beim nächsten recovery-Start wird userdata formatiert, danach startet das normale System. Unten steht die meta-Konfiguration mit needreboot.

```text
"meta": {
    "version": "1.0",
    "author": "rockchip_dep3",
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},
```

6. echo_pcbatest_server.c ändern: Nach erfolgreichem Test vor dem Neustart in exit_pcba_test_mode recovery erkennen und den Factory-Befehl in misc durch wipe_all ersetzen. Der nächste recovery-Start formatiert die Benutzerpartition und startet das normale System.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 36](/docs/rockchip-linux-pcba/assets/en-p036-figure-02.png)

Abbildung 3-9. Änderungen an echo_pcbatest_server.c

7. Mögliche Probleme beim Aufnahmetest

Bei Aufnahme mit mehr als zwei Kanälen, beispielsweise mit:

```text
arecord -Dhw:0,0 -f S16_LE -r 48000 -c 4 /tmp/record.wav
```

Trotz angeforderter vier Kanäle kann das Ergebnis nur zwei enthalten. Buildroot/configs/rockchip/audio.config prüfen und BR2_PACKAGE_PULSEAUDIO=y sowie BR2_PACKAGE_PULSEAUDIO_DAEMON=y deaktivieren.

```text
buildroot/configs$ git diff rockchip
diff --git a/configs/rockchip/audio.config b/configs/rockchip/audio.config
index 8cf1207..f23cb5a 100644
--- a/configs/rockchip/audio.config
+++ b/configs/rockchip/audio.config
@@ -8,8 +8,8 @@ BR2_PACKAGE_ALSA_UTILS_ALSACONF=y
 BR2_PACKAGE_ALSA_UTILS_AMIXER=y
 BR2_PACKAGE_ALSA_UTILS_APLAY=y
 BR2_PACKAGE_LIBMAD=y
-BR2_PACKAGE_PULSEAUDIO=y
-BR2_PACKAGE_PULSEAUDIO_DAEMON=y
+#BR2_PACKAGE_PULSEAUDIO=y
+#BR2_PACKAGE_PULSEAUDIO_DAEMON=y

 # Copy alas configs
 BR2_PACKAGE_ALSA_CONFIG=y
```

## 4. PCBA mit Bildschirm

Einige RK-Plattformen zeigen PCBA-Tests und Ergebnisse direkt ohne PC auf einem Bildschirm, ähnlich Android-PCBA. Es folgt Linux-PCBA mit Display am Beispiel PX3-SE; für andere Plattformen die Konfiguration anpassen.

### 4.1 Testcode

Test- und Anzeigecode liegen unter external/rk_pcba_test. Linux übernimmt den Android-Ansatz: rk_pcba_test/test_config.cfg bestimmt ausgeführte und angezeigte Tests. Details stehen in dessen Modulbeispielen. Für eigene Tests einen Fall aus rk_pcba_test/pcba_minui als Vorlage verwenden

und den fertigen Code in cMakeList.txt aufnehmen, damit er mitgebaut wird.

### 4.2 Build und Konfiguration

PCBA-Paketkonfiguration in Buildroot: buildroot/package/rockchip/rockchip-pcba/Config.in.

```text
config BR2_PACKAGE_PCBA
    bool "Rockchip pcba test"
    help
      Rockchip pcba test.

if BR2_PACKAGE_PCBA

config BR2_PACKAGE_PCBA_SCREEN
    bool "pcba with screen"
    select BR2_PACKAGE_LIBDRM
    select BR2_PACKAGE_LIBPNG
    select BR2_PACKAGE_LIBPTHREAD_STUBS
    select BR2_PACKAGE_LIBZIP
    help
      Enable screen support for PCBA testing.
      Note: This will automatically enable the required graphics
      libraries (libdrm, libpng, libzip) and threading support.

endif
```

Das Paket integriert Rockchip-PCBA-Tests. BR2_PACKAGE_PCBA_SCREEN wählt automatisch BR2_PACKAGE_LIBDRM (DRM-Grafik), BR2_PACKAGE_LIBPNG (PNG), BR2_PACKAGE_LIBPTHREAD_STUBS (POSIX-Thread-Kompatibilität) und BR2_PACKAGE_LIBZIP (ZIP). Es folgt buildroot/package/rockchip/rockchip-pcba/rockchip-pcba.mk.

```text
################################################################################
#
# rockchip-pcba project
#
################################################################################

ROCKCHIP_PCBA_SITE = $(TOPDIR)/../external/rk_pcba_test
ROCKCHIP_PCBA_SITE_METHOD = local

ifeq ($(BR2_PACKAGE_PCBA_SCREEN),y)
ROCKCHIP_PCBA_CONF_OPTS = -DROCKCHIP_PCBA_WITH_UI=ON
```

```text
ROCKCHIP_PCBA_DEPENDENCIES = zlib libpthread-stubs libpng libdrm
endif

define ROCKCHIP_PCBA_INSTALL_TARGET_CMDS
    $(INSTALL) -d -m 0755 $(TARGET_DIR)/data
    $(INSTALL) -D -m 0755 $(@D)/rk_pcba_test/* $(TARGET_DIR)/data
endef

$(eval $(cmake-package))
```

Die .mk-Datei setzt Makros anhand der Plattformkonfigurationen in configs. Bei BR2_PACKAGE_PCBA_SCREEN=y werden PCBA_WITH_UI und die Abhängigkeiten zlib, libpthread-stubs, libpng und libdrm gesetzt. PCBA_CONF_OPTS und PCBA_DEPENDENCIES sind mk-Variablen. Für eine neue Plattform Definitionen in rockchip-pcba.mk nach bestehenden Beispielen ergänzen.

```text
ifeq ($(BR2_PACKAGE_PX3SE),y)
ifeq ($(BR2_PACKAGE_PCBA_SCREEN),y)
PCBA_CONF_OPTS = -DPCBA_WITH_UI=ON
PCBA_DEPENDENCIES = zlib libpthread-stubs libpng libdrm
endif
PCBA_CONF_OPTS += -DPCBA_PX3SE=ON
endif
```

Für PX3-SE mit BR2_PACKAGE_PX3SE=y und BR2_PACKAGE_PCBA_SCREEN=y werden PCBA_WITH_UI und zlib libpthread-stubs libpng libdrm gesetzt. Die PX3-SE-Auswahl allein setzt außerdem PCBA_PX3SE. PCBA_CONF_OPTS und PCBA_DEPENDENCIES gehören zur mk-Syntax. Eigene Plattformdefinitionen nach pcba.mk ergänzen. Wichtige Optionen von configs/rockchip_px3se_pcba_defconfig:

```text
#include "base/pcba.config"
......
BR2_PACKAGE_PX3SE=y
BR2_PACKAGE_PCBA_SCREEN=y
......
```

### 4.3 Ausführung

Siehe board/rockchip/px3se/fs-overlay-pcba/data/RkLunch.sh.

```text
#! /bin/sh
if [ -f "pcba-core" ]; then
pcba-core &
fi

echo_pcbatest_server &
echo_auto_test echo_wlan_test &
echo_auto_test echo_bt_test &
echo_auto_test echo_ddr_test &
echo_auto_test echo_emmc_test &
echo_auto_test echo_rtc_test &

board/rockchip/px3se/fs-overlay-pcba/etc/init.d/S98_lunch_init
source /etc/profile.d/RkEnv.sh

case "$1" in
  start)
        source /data/RkLunch.sh
        printf "insmod vcodec service...\n"
        insmod /system/etc/firmware/vcodec_service.ko
        ;;
  stop)
        printf "stop finished\n"
        ;;
  *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
exit 0
```

RkLunch.sh im Startskript aufrufen, damit pcba-core und weitere Starttests nach dem Booten im Hintergrund laufen.

## 5. Anhang

### 5.1 Häufige Fehler

#### 5.1.1 Fehler beim Öffnen von PCBA Tool

Beim Start kann „Initialize RKupdate dll failed“ erscheinen, siehe Abbildung 5-1.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 41](/docs/rockchip-linux-pcba/assets/en-p041-figure-01.png)

Abbildung 5-1. Startfehler. Ursache sind falsche Installationspfade. In config.ini im Installationsverzeichnis LogPath und TestPath auf die tatsächlichen Pfade setzen. Das Quellbeispiel nennt D:\ROCKCHIP\PCBATool, zeigt aber LogPath=D:\ROCKCHIP\PCBAToo\Log\ und TestPath=D:\ROCKCHIP\PCBAToo\test\: Das fehlende l prüfen und den tatsächlichen Ordner verwenden.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 41](/docs/rockchip-linux-pcba/assets/en-p041-figure-02.png)

Abbildung 5-2. Datei config.ini

#### 5.1.2 Fehler bei adb forward

Nach dem Start kann „adb forward fail“ erscheinen, siehe Abbildung 5-3.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 42](/docs/rockchip-linux-pcba/assets/en-p042-figure-01.png)

Abbildung 5-3. adb-forward-Fehler. Möglicherweise erkennt ADB mehrere Geräte und das Werkzeug startet den Dienst nicht korrekt. CMD öffnen, ins adb-Verzeichnis wechseln und adb devices ausführen. Zusätzliche Geräte abziehen oder den ADB-Dienst mit folgenden Befehlen neu starten.

```text
adb kill-server
adb start-server
```

Danach erneut versuchen.

#### 5.1.3 Keine Verbindung unter Windows 10

Unter Windows 10 können ADB-Verbindungsprobleme durch Programminkompatibilität auftreten. Windows-7-Kompatibilität versuchen: Rechtsklick auf das Symbol → Eigenschaften → Kompatibilität → Programm im Kompatibilitätsmodus ausführen.

![Entwicklerhandbuch für Rockchip Linux PCBA-Tests — en 43](/docs/rockchip-linux-pcba/assets/en-p043-figure-01.png)

Abbildung 5-4. Verbindungsfehler unter Windows 10

#### 5.1.4 Fehler upload file fail

„upload file fail“ erscheint, wenn echo_pcbatest_server auf dem Gerät nicht läuft. Das Werkzeug versucht dann ein lokales Programm per ADB zu übertragen, das im test-Verzeichnis der Installation fehlt. Folgende Gerätekonfiguration prüfen.

1. echo_pcbatest_server und alle Testprogramme liegen unter /data auf dem Gerät.

2. PCBA-Dienste und automatische Tests starten erfolgreich mit dem System.

## Abgleich der chinesischen, englischen und älteren Quellen

- Hauptquellen: V1.2.0, Werkzeug V1.7. Ältere ApplicationNote: V1.1.2, Werkzeug V1.6. Neu sind EMMC, RTC, automatisches CAMERA, JSON meta/test_group/mes_config und VS2022 mit v143 MFC. Alt sind VS2008 SP1 und Checkbox-Auswahl mit Speicherung in config.ini für den nächsten Start; die Abläufe sind getrennt zu betrachten.
- Englisch behält den alten Kameraschaltflächenabschnitt 1.4.3, den Chinesisch entfernt hat; dort ist Neustart 1.4.3. Der englische Abschnitt bleibt als historisches Material erhalten. Dev_Plateform, V4l2_test und nv12_to_bmp_main betreffen die alte Schaltfläche. Neu werden v4l2_capture.sh und photo_check.sh verwendet; CamData ist ungenutzt.
- Die alte Neustartcheckbox war standardmäßig aus und durch ein festes, beim FAE erhältliches Passwort geschützt. Neu gilt JSON needreboot. system_a/system_b ist das Quellbeispiel, keine allgemeine ArmSoM-Partitionierung.
- Neue Befehle: make rockchip-pcba, rockchip-pcba-dirclean, rockchip-pcba-rebuild, ./build.sh buildroot. Alte Befehle: make pcba, make pcba-dirclean, make pcba-rebuild, ./build.sh pcba. Alte RK3308-Ausgaben unter buildroot/output/rockchip_rk3308_pcba/images/: rootfs.cpio, rootfs.cpio.gz, rootfs.ext2, rootfs.squashfs. Das vollständige rootfs passend zum Dateisystem wählen, nicht einfach pcba.img.
- Die alte Overlay-Methode benötigt BR2_ROOTFS_OVERLAY und BR2_PACKAGE_PCBA. Fehlt board/rockchip/rkxxxx/fs-overlay-pcba, eine RK3308-Kopie anpassen; data/RkLunch.sh startet über etc/init.d/S98_lunch_init den Dienst. Alte Pfade nicht ungeprüft auf neue SDKs übertragen.
- Chinesisch ändert für recovery buildroot/package/rockchip/rockchip-pcba/{Config.in,rockchip-pcba.mk}; Englisch behält pcba/{Config.in,pcba.mk}. Chinesisch nennt recovery.img und rockdev/, Englisch fälschlich ecovery.img und rocketdev/. Maßgeblich ist hier Chinesisch.
- Englisch Kapitel 4 behält alte PX3-SE-Makros neben der neuen allgemeinen Konfiguration. Historische Bedingungen sind PCBA_PX3SE, PCBA_3308 und PCBA_3229GVA. Der alte PX3-SE-Ringmikrofontest kompiliert echo_ringmic_test.c und bindet rk_pcba_test/libmictest.so ein. Daraus folgt keine Unterstützung beliebiger Platinen.
- Tabellen schreiben TPYE, JSON verwendet TYPE. Die erfolgreiche EXIT-Antwort enthält in der Quelle CMD statt RES. KEY_test, KEY-TEST und key_test unterscheiden sich; Implementierung prüfen. VERIFY heißt in der Tabelle Testabschluss, im Beispiel Ergebnisbestätigung. Neun Protokolltabellen wurden ohne abgeschnittene PDF-Spalten rekonstruiert.
- Der Ladetext nennt Bereich 3 für die Testliste, die Übersicht Bereich 2. Private Netzwerkadressen, MES und Kontofelder sind nur unverwendete Quellbeispiele. RK3358 aus der chinesischen Chiptabelle bleibt erhalten, ohne stillschweigende Änderung in RK3588; Unterstützung und Bezeichner am SDK prüfen.

Die chinesischen Bluetooth-Beispiele nennen RK3229GVA, PX3-SE und RK3308 als ältere Plattformen mit Aus-/Einschalten; RK3328, RK3326, RK3358 und PX30 als neuere mit Firmwareladen beim Start ohne diesen Zyklus. Dies sind Beispiele der Quellversion.

{% endraw %}
