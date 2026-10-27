---
title: "Rockchip-Firmware-Upgradefehler: Boot Code, IDB, NAND und EMMC"
description: "Rockchip-Firmware-Upgradefehler: Boot Code, IDB, NAND und EMMC — V1.2"
excerpt: "Rockchip-Firmware-Upgradefehler: Boot Code, IDB, NAND und EMMC"
translation_key: "253-rockchip-firmware-upgrade-failure-analysis"
slug: "253-rockchip-firmware-upgrade-failure-analysis"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "firmware", "NAND", "EMMC"]
---

{% raw %}

# Rockchip-Firmware-Upgradefehler: Boot Code, IDB, NAND und EMMC

Plattformreferenz für ArmSoM: vollständiger technischer Inhalt von RK Firmware Upgrade Failure Analysis 1.2. Einzige Quelle ist ein chinesisches25-seitiges PDF; Englisch, Russisch und Deutsch sind vollständige Übersetzungen mit jeweils45 Originalabbildungen. Logs, Binärvergleiche, PCB- und Signalbelege bleiben als Originalscreenshots; unleserliche Zeichen werden nicht geraten. Lesbarer Batchcode und letzte Stromtabelle zusätzlich als Text. Beispiele betreffen ältere SoCs/Werkzeuge, keine ArmSoM-Tests. Hardware, BSP, Speicherdatenblatt und Bootkette prüfen.

## Grenzen und Quellenprüfung

- Hersteller-Diagnosehinweise, kein Beweis eines defekten Bauteils allein durch eine Meldung. Logs sichern, Firmware/Versorgung prüfen, dann Befunde untersuchen. Nacharbeit benötigt Fachkenntnis.
- Repair, IDB-Löschen, Flashen und misc-Schreiben können Daten/Bootzustand zerstören. Vorher sichern und exakte Ziele/Partitionsgrößen prüfen. Secure Boot benötigt passende signierte Firmware, keine Umgehung.
- Pin38 an VCC,10K-Pull-ups und EXT CSD179/167/162 gelten nur für passende Bauteile/Plattformen. RTS_n, DATO und RK3329 sind fragliche Quellschreibweisen; keine Verdrahtung aus Tippfehlern ableiten.
- ID-Tabellen sind historische Beispiele, keine Vollständigkeitsliste. Das Trennzeichen nach D3 hat keinen zweiten Wert; keiner wird erfunden.00/FF nur im Quellkontext auslegen, nicht statt elektrischer Messungen.
- Seite25 enthält eine reine Bildtabelle, erhalten und zeilenweise transkribiert: Ta=25°C bei3.3V, VCC2.7V–3.6V,60mV Spitze-Spitze-Ripple. Textbereiche100-300mA/100-700uA sind keine identische Garantie dieses Einzelmodells.
- Dritter Batch-Screenshot auf Seite17 ist bereits im PDF rechts beschnitten. Vollständige Zeile aus vorherigem Bild und expliziter Änderung-RK29→-RK30 rekonstruierbar; Originale bleiben. Logzeitstempel bleiben technischer Kontext; Deckblattdaten, Kontakte und Revisionstabelle entfallen. Keine Flash-, Lösch-, Register- oder Hardwareaktionen ausgeführt.

## 1. Überblick

In Fertigung und Entwicklung treten häufig Firmware-Upgradefehler auf. Dieser Leitfaden sammelt typische Probleme und Diagnosehinweise. Werkzeuge entwickeln sich weiter; genaue Meldungen können abweichen, sollten für dieselbe Fehlerart aber ähnlich sein.

## 2. Typische Fehler und Analyse

### 2.1. Boot-Code-Download fehlgeschlagen

Meldung im Produktionswerkzeug:

![Original-Screenshot oder Diagramm, PDF-Seite 2, Abbildung 1](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-01.png)

Meldung im Entwicklungswerkzeug:

![Original-Screenshot oder Diagramm, PDF-Seite 2, Abbildung 2](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-02.png)

Logdatei im log-Verzeichnis des Produktionswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 3, Abbildung 3](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-01.png)

Logdatei im log-Verzeichnis des Entwicklungswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 3, Abbildung 4](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-02.png)

Mögliche Ursachen:

1. Schlechte USB-Signalqualität.

2. Schlechte SoC-Lötstellen oder Versorgungsprobleme.

3. DDR-Probleme.

4. Unzureichende Versorgung.

5. Unsignierte Firmware bei aktiviertem Secure Boot.

Diagnoseschritte:

1. Mit dem DDR-Testwerkzeug Lötprobleme prüfen.

2. Kurzes, hochwertiges USB-2.0-Kabel an einem rückseitigen PC-USB-Port verwenden.

3. ESD-Bauteile auf USB-Leitungen und deren Spezifikation prüfen.

4. USB-Versorgungsspannung und Ripple prüfen.

5. Prüfen, ob USB-Leiterbahnen parallel zu anderen Bahnen benachbarter Lagen verlaufen.

6. Widerstands- und Kondensatorwerte an SoC und USB prüfen.

7. Die von der Platine vorgesehene externe Versorgung oder Batterie nutzen.

8. Secure-Boot-Geräte benötigen die passende korrekt signierte Firmware.

### 2.2. Gerätetest scheitert nach erfolgreichem Boot-Code-Download

Meldung im Produktionswerkzeug:

![Original-Screenshot oder Diagramm, PDF-Seite 4, Abbildung 5](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-01.png)

Meldung im Entwicklungswerkzeug:

![Original-Screenshot oder Diagramm, PDF-Seite 4, Abbildung 6](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-02.png)

Log des Produktionswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 5, Abbildung 7](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-01.png)

Log des Entwicklungswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 5, Abbildung 8](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-02.png)

Mögliche Ursachen:

1. DDR-Bausteine oder DDR-Leiterbahnführung; laut Quelle relativ wahrscheinlich.

2. Schlechte USB-Signalqualität.

3. Falsches usbplug beim Packen von miniloader unter U-Boot.

Diagnoseschritte:

1. DDR-Lötstellen mit dem Testwerkzeug prüfen.

2. DDR-Layout auf Regelverletzungen prüfen.

3. Bei entsprechendem Befund DDR-Baustein ersetzen.

4. USB-Prüfungen nach Abschnitt 2.1 durchführen.

5. Serielle Konsole anschließen und prüfen, ob die CPU DDR-Initialisierung oder usbplug erreicht.

### 2.3. IDB-Vorbereitung: NAND-FLASH-/EMMC-Lötprobleme

Produktionswerkzeug meldet Fehler bei der IDB-Vorbereitung:

![Original-Screenshot oder Diagramm, PDF-Seite 6, Abbildung 9](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-01.png)

Log des Produktionswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 6, Abbildung 10](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-02.png)

Entwicklungswerkzeug meldet fehlgeschlagenes Schreiben von ID_BLOCK:

![Original-Screenshot oder Diagramm, PDF-Seite 7, Abbildung 11](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p007-figure-01.png)

Das Entwicklungslog meldet: NAND FLASH nicht gefunden, ID_BLOCK-Schreiben fehlgeschlagen.

Mögliche Ursachen:

1. Schlechte NAND-FLASH-/EMMC-Lötstellen.

2. Nicht unterstützter NAND-FLASH.

3. Leiterplattendefekte.

4. Falsche FLASH-VCCQ-Versorgung.

5. Falsche FLASH-SEL-Auswahl am AP.

6. Fehlende CMD-/D0-Pull-ups bei EMMC.

Diagnoseschritte:

1. PCB prüfen und NAND-FLASH-/EMMC-Lötstellen fachgerecht nacharbeiten.

2. Schaltplan und NAND-Datenblatt, besonders Pin 38, vergleichen. Laut Quelle benötigen die meisten Toshiba-, Sandisk- und Samsung-Teile dort VCC, andere nicht. Historische Verallgemeinerung: Maßgeblich sind konkretes Datenblatt und Gehäuse.

3. Für nicht unterstützten NAND ein passendes Treiberupdate über den Herstellersupport beziehen und die konkrete Teilenummer in dessen Supportliste prüfen.

4. Serielle Logs helfen bei Lötfehlern. Ein normales NAND-Gerät zeigt FLASH-IDs wie unten. EMMC-Geräte zeigen in diesem Quell-Bootpfad normalerweise keine FLASH-ID.

![Original-Screenshot oder Diagramm, PDF-Seite 8, Abbildung 12](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p008-figure-01.png)

Das erste FLASH-ID-Byte kennzeichnet den Hersteller:

| ID | Hersteller |
| --- | --- |
| 2C | Micron |
| AD | Hynix |
| 45 | Sandisk |
| 89 | Intel |
| EC | Samsung |
| 98 | Toshiba |
| 00 | Kein NAND FLASH angeschlossen |
| FF | Kein NAND FLASH angeschlossen |
| Andere Werte | Schlechte Lötung oder nicht unterstützter NAND FLASH. |

Das zweite Byte kennzeichnet die Kapazität; übliche Quellwerte:

| ID | Kapazität |
| --- | --- |
| 75 | 32MB |
| 76 | 64MB |
| 78、79、F1、D1 | 128MB |
| DA、71 | 256MB |
| DC | 512MB |
| D3、 | 1GB |
| D5、48 | 2GB |
| D7、68 | 4GB |
| D9、88、DE、3A、64 | 8GB |
| 3C、A8、84 | 16GB |
| Andere Werte | Schlechte Lötung oder nicht unterstützter NAND FLASH. |

Diagnosebeispiele:

1. Das folgende Log weist laut Quelle auf schlechte NAND-FLASH-/EMMC-Lötstellen hin.

![Original-Screenshot oder Diagramm, PDF-Seite 9, Abbildung 13](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p009-figure-01.png)

2. Zwei NAND-Chips verbaut, vier erkannt: Laut Quelle fehlerhafte Chip-Select-Lötstelle (CS).

![Original-Screenshot oder Diagramm, PDF-Seite 10, Abbildung 14](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-01.png)

3. Zwei NANDs erkannt, IDs jedoch falsch: Erstes Byte 2c bedeutet Micron, zweites 8C statt des hier erwarteten 88. Die Quelle folgert einen Lötfehler. Nicht jeden ungelisteten ID ohne Prüfung des konkreten Teils als Fehler bewerten.

![Original-Screenshot oder Diagramm, PDF-Seite 10, Abbildung 15](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-02.png)

### 2.4. IDB-Schreibfehler

Produktionswerkzeug meldet ID_BLOCK-Schreibfehler:

![Original-Screenshot oder Diagramm, PDF-Seite 11, Abbildung 16](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-01.png)

ID_BLOCK-Schreibfehler im Entwicklungswerkzeug:

![Original-Screenshot oder Diagramm, PDF-Seite 11, Abbildung 17](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-02.png)

Das Entwicklungslog meldet einen Vergleichsfehler:

![Original-Screenshot oder Diagramm, PDF-Seite 12, Abbildung 18](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-01.png)

Log des Produktionswerkzeugs:

![Original-Screenshot oder Diagramm, PDF-Seite 12, Abbildung 19](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-02.png)

Im LOG-Verzeichnis erscheinen außerdem Binärdateien:

![Original-Screenshot oder Diagramm, PDF-Seite 12, Abbildung 20](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-03.png)

Mit einem Binärvergleich Dateien gleichen Präfixes und der Suffixe „flash“ und „file“ vergleichen, etwa:

![Original-Screenshot oder Diagramm, PDF-Seite 13, Abbildung 21](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-01.png)

Einzelne abweichende Bits deuten im Beispiel auf DDR-Probleme. Abschnitt 2.2 beachten; ein Hinweis, kein alleiniger Beweis.

![Original-Screenshot oder Diagramm, PDF-Seite 13, Abbildung 22](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-02.png)

Viele unterschiedliche Bits deuten in den Quellbeispielen meist auf NAND. Die Quelle schlägt erneutes Upgraden vor. Hoher Versorgungsripple oder fehlende Filterkondensatoren können dasselbe bewirken. Bei normaler Versorgung und erfolglosen Wiederholungen NAND nach bestätigter Diagnose ersetzen.

![Original-Screenshot oder Diagramm, PDF-Seite 13, Abbildung 23](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-03.png)

### 2.5. Firmware-Download fehlgeschlagen

Produktionswerkzeug meldet Firmware-Downloadfehler:

![Original-Screenshot oder Diagramm, PDF-Seite 14, Abbildung 24](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-01.png)

Produktionslog: `WriteLBA failed`, Fehlercode `(-3)`.

![Original-Screenshot oder Diagramm, PDF-Seite 14, Abbildung 25](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-02.png)

Produktionslog: `ReadLBA failed`, Fehlercode `(-4)`.

![Original-Screenshot oder Diagramm, PDF-Seite 14, Abbildung 26](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-03.png)

Die Quelle führt beide Fälle auf unterbrochene USB-Kommunikation zurück. Prüfungen aus 2.1 anwenden.

Produktionslog: `RKA_File_Check failed`.

![Original-Screenshot oder Diagramm, PDF-Seite 15, Abbildung 27](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-01.png)

Im Log-Verzeichnis liegen zwei Dateien: vorgesehene Firmwaredaten und fehlerhaft zurückgelesene Flashdaten.

![Original-Screenshot oder Diagramm, PDF-Seite 15, Abbildung 28](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-02.png)

Dateien vergleichen. Einzelne unterschiedliche Bits deuten auf DDR; Abschnitt 2.2 beachten.

![Original-Screenshot oder Diagramm, PDF-Seite 16, Abbildung 29](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-01.png)

![Original-Screenshot oder Diagramm, PDF-Seite 16, Abbildung 30](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-02.png)

Bei vielen Bitabweichungen vermutet die Quelle NAND und empfiehlt „Repair“ im Produktionswerkzeug oder „Erase IDB“ im Entwicklungswerkzeug vor erneutem Flashen. Dies kann Daten und Bootmetadaten löschen: vorher sichern und Ziel prüfen. Originalschaltflächen bleiben unten erhalten.

![Original-Screenshot oder Diagramm, PDF-Seite 16, Abbildung 31](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-03.png)

Erst nach gewähltem Reparatur-/Löschschritt und erforderlichen Prüfungen erneut flashen.

Hoher NAND-Ripple oder fehlende Filterung können ebenfalls ursächlich sein. Helfen Versorgungskontrolle und erneutes Flashen nicht, NAND nach Diagnose ersetzen.

![Original-Screenshot oder Diagramm, PDF-Seite 16, Abbildung 32](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-04.png)

Meldungen/Logs des Entwicklungswerkzeugs sind ähnlich; entsprechend analysieren.

### 2.6. Chipprüfung fehlgeschlagen

Chipprüfung scheitert meist bei Firmware für den falschen SoC. In der Entwicklung kann der Packparameter falsch sein. Laut Quelle prüft das Entwicklungswerkzeug den Chip nicht; falsche Firmware bootet nicht oder kehrt in den Upgrademodus zurück. Passende Firmware erneut flashen.

![Original-Screenshot oder Diagramm, PDF-Seite 17, Abbildung 33](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-01.png)

Die RK30-Beispielfirmware wurde fälschlich als RK29 gepackt. In `mkupdate.bat` das Chipargument korrigieren.

![Original-Screenshot oder Diagramm, PDF-Seite 17, Abbildung 34](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-02.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK29 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

Für dieses RK30-Beispiel das Chipargument von `RKImageMaker.exe` auf `-RK30` ändern.

![Original-Screenshot oder Diagramm, PDF-Seite 17, Abbildung 35](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-03.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK30 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

Weitere Konfiguration in den Unterlagen des Firmware-Erzeugungswerkzeugs nachlesen.

## 3. Weitere Probleme

### 3.1. Nach automatischem Neustart weiterhin Upgrademodus

Fall 1: Nach Flashen mit dem Entwicklungswerkzeug kein Boot, über USB Upgrademodus. Serielle Ausgabe unten.

![Original-Screenshot oder Diagramm, PDF-Seite 18, Abbildung 36](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p018-figure-01.png)

Lesbare wichtige Zustände der seriellen Ausgabe (Auszug; vollständiges Log im Originalbild):

```text
unsigned!
SecureBootEn = 0
Boot ver: 2012-11-13#1.20
Error: Invaid tag(0x00000000)!
Load failed!
Begin recover...
GetRemapTbl flag = 1
Error: Invaid tag(0x00000000) in backup!
Start RockUsb...
2900305 UsbConnected
```

Laut Quelle entsteht dies durch Flashen von misc.img ohne recovery.img.

![Original-Screenshot oder Diagramm, PDF-Seite 19, Abbildung 37](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p019-figure-01.png)

Abhilfe: recovery.img erneut flashen. Die Quelle nennt auch eine andere Datei größer als 32KB in misc zum Löschen der Befehle; destruktiv und nicht ungeprüft auf moderne Layouts übertragbar.

Fall 2: Die Quelle nennt RK3329 und RK3368 als Beispiele mit Bootfehler ohne trust.img. Passendes trust.img flashen. RK3329 bleibt als Quellschreibweise prüfbedürftig.

### 3.2. EMMC-Gerät bootet beim Einschalten nicht

Laut Quelle vor allem RK3188, PX3, PX2, RK3066 und RK3168 nach Loaderupdate oder Bestückung vorprogrammierter Speicher. Prüfungen:

1. Schaltplan/Layout prüfen. CMD und DATA0-DATA7 benötigen Pull-ups; Quelle empfiehlt 10K. Lötstellen prüfen. EMMC-Signale nicht über NC-Pins führen.

2. Einschaltsequenz messen. CMD sollte wie gezeigt zusammen mit EMMC-VCCQ ansteigen. Späteres CMD kann manche EMMC am Booten hindern.

![Original-Screenshot oder Diagramm, PDF-Seite 20, Abbildung 38](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-01.png)

3. CMD/CLK auf Glitches prüfen. Diese verhindern bei manchen EMMC den Boot. Quelle beobachtete dies bei RK3066 mit TI-PMU und empfiehlt angepasste Einschaltsequenz.

![Original-Screenshot oder Diagramm, PDF-Seite 20, Abbildung 39](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-02.png)

4. Überschwingen an CMD, CLK und DATA prüfen; Serienterminierung erwägen. Starkes CLK-Ringing kann Logikfehler verursachen.

![Original-Screenshot oder Diagramm, PDF-Seite 21, Abbildung 40](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p021-figure-01.png)

5. VCC-Ripple prüfen und geeignete Filterkondensatoren erwägen.

6. Bei vorprogrammiertem Speicher EXT CSD prüfen.

Quellwerte EXT CSD: Byte179 = 0x08 (boot1 ohne ACK), Byte167 = 0x1F, Byte162 = 0x01 (Reset-Pin aktiv). Rest unverändert. Plattformspezifisch, keine universelle Programmieranweisung; Änderungen können irreversibel sein.

Bei RK312X, RK3228, RK3366, RK3288 und RK3399 deutet Verbleib in MASKROM nach Flashen laut Quelle meist auf falsch angeschlossene EMMC-D0-D7-Leitungen.

### 3.3. EMMC bootet nach Reset nicht

EMMC_PWEN des SoC soll laut Quelle mit dem dort RTS_n genannten EMMC-Pin verbunden sein. Tatsächlichen Signalnamen anhand Schaltplan/Datenblatt prüfen; mögliche Schreibfehler nicht zur Verdrahtungsgrundlage machen.

Für vorprogrammierte Firmware auf RK3188, PX3, PX2, RK3066 oder RK3168 nennt die Quelle EXTCSD162 = 0x01.

### 3.4. Lange Verzögerung bis LOADER bei EMMC

Die Quelle führt die Verzögerung auf BOOTROM-NAND-Erkennung zurück, die einige Sekunden dauert. Prüfungen:

1. Schaltplan/Layout, CMD-/DATA0-DATA7-Pull-ups (empfohlen10K) und Lötstellen prüfen. EMMC nicht über NC routen. Das Beispiel verbindet DATA6 über NC und bootet dadurch langsam.

![Original-Screenshot oder Diagramm, PDF-Seite 22, Abbildung 41](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p022-figure-01.png)

2. DATA0-DATA7 beim Einschalten messen (Quelle schreibt DATO). DATA-Anstieg im Beispiel unter2us. Abbildung2 vergrößert den roten Bereich aus Abbildung1.

Abbildung1:

![Original-Screenshot oder Diagramm, PDF-Seite 23, Abbildung 42](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-01.png)

Abbildung2: vergrößerter Signalanstieg.

![Original-Screenshot oder Diagramm, PDF-Seite 23, Abbildung 43](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-02.png)

### 3.5. EMMC-Lese-/Schreibfehler im Android-Betrieb

Mögliche Ursachen:

1. Unzureichendes VCC/VCCQ mit Spannungseinbruch im Betrieb.

2. Schlechte Leiterbahnführung und starke Störungen.

Abhilfe:

1. Externe Einflüsse wie Wi-Fi auf die EMMC-Versorgung prüfen; die Quelle empfiehlt eine separate Versorgung.
2. Bus-Timing mit einem Oszilloskop messen. Beispiel: zu kurze Hold-Zeit an der fallenden CLK-Flanke im DDR-Modus kann Logikfehler verursachen.

![Original-Screenshot oder Diagramm, PDF-Seite 24, Abbildung 44](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p024-figure-01.png)

### 3.6. EMMC-Stromverbrauch

Quelle nennt100-300mA beim Lesen/Schreiben und100-700uA im Standby. Einflussfaktoren: Geschwindigkeitsmodus, EMMC-Takt/-Kapazität, Schnittstellenspannung, Temperatur, Herstellungsprozess und Pull-ups. Folgendes Beispiel betrifft ein ungenanntes Modell, keinen allgemeinen Grenzwert.

![Original-Screenshot oder Diagramm, PDF-Seite 25, Abbildung 45](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p025-figure-01.png)

Ta=25°C @3.3V

| Modus | Maximum/typisch | Einheit |
| --- | --- | --- |
| Automatischer Schlaf | 350 | uA |
| Schlaf (CMD5) | 200 maximal;130 typisch | uA |
| Lesen: Standardtempo | 100 | mA |
| Lesen: hohes Tempo | 200 | mA |
| Schreiben: Standardtempo | 100 | mA |
| Schreiben: hohes Tempo | 200 | mA |

VCC:2.7V–3.6V; maximaler Ripple60mV Spitze-Spitze.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
