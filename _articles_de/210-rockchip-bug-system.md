---
title: "Rockchip: Anleitung zum Bug-System"
description: "Rockchip: Anleitung zum Bug-System — V1.1.3"
excerpt: "Rockchip: Anleitung zum Bug-System"
translation_key: "210-rockchip-bug-system"
slug: "210-rockchip-bug-system"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, SDK, Redmine, Linux]
---

{% raw %}

# Rockchip: Anleitung zum Bug-System

ArmSoM-Entwicklungsablaufreferenz nach den chinesischen/englischen Rockchip-Bug-System-Quellen V1.1.3 (24/27 Seiten). Beschrieben werden SDK-Support und Fehlerberichte, nicht die Treiberunterstützung einer bestimmten Platine, eines SoC oder Kernels. Ein autorisiertes Konto, geschäftliche Freigabe und SDK-Zugriff sind erforderlich. Dieser Artikel erteilt keine Zugriffsrechte; Anmeldung, Kontoänderungen, Anfragen und Hardwaretests wurden nicht durchgeführt.

Sicherheit: Das gemeinsame FTP-Passwort der Quelle wird nicht veröffentlicht; Zugang beim autorisierten Ansprechpartner erfragen. Die Bilder der Passwort-Rücksetzmail sind geschwärzte Kopien: Die vollständige URL mit Token ist abgedeckt; die Textschritte bleiben erhalten. Andere Bilder behalten ihre Quellsprache. Das nichttechnische Kapitel 5 mit Kontakt-/Beschwerdekanälen entfällt, die Nummerierung von Kapitel 6 bleibt. Unterschiedliche Camera-Links werden nebeneinander dokumentiert. data/arn/trace.txt und der abschließende Backtick in der Android-Manifestliste bleiben ungeklärte Quellauffälligkeiten. Historische URLs dienen der Nachvollziehbarkeit; ihre Erreichbarkeit wurde nicht geprüft.

## 1. Bedienungsanleitung

### 1.1 Antragsverfahren

Das Konto auf https://redmine.rock-chips.com wird nach dem Antrag automatisch erstellt. Das folgende Diagramm zeigt den SDK-Antragsablauf.

![SDK-Antragsverfahren](/docs/rockchip-bug-system/assets/en-p005-flowchart.png)

Üblicherweise wird ein Konto bereitgestellt. Für Sonderfälle wie mehrere Projekte oder große Abteilungen sind nach Abstimmung mehrere Konten möglich.

### 1.2 Anmeldung

Nach Abschluss der geschäftlichen Abwicklung sendet das System eine Nachricht über das angelegte Konto.

![Oberfläche aus der Quelle — 6](/docs/rockchip-bug-system/assets/en-p006-figure-01.png)

Die Nachricht enthält Anmeldenamen, anfängliches Passwort und zugeordnete E-Mail-Adresse. Öffnen Sie die Website zur Anmeldung.

### 1.3 Aktivierung

Aktivieren Sie das Konto durch Eingabe des Anmeldenamens und des anfänglichen Passworts.

![Oberfläche aus der Quelle — 6](/docs/rockchip-bug-system/assets/en-p006-figure-02.png)

Nach Aktivierung und Anmeldung kann das System verwendet werden.

### 1.4 Eine Anfrage erstellen

Nach der Aktivierung lässt sich eine Anfrage in der folgenden Reihenfolge erstellen.

#### 1.4.1 FAE-Projekt wählen

Wählen Sie oben rechts das FAE-Projekt aus der Auswahlliste.

![Oberfläche aus der Quelle — 7](/docs/rockchip-bug-system/assets/en-p007-figure-01.png)

#### 1.4.2 Neue Anfrage

a. Klicken Sie auf die Schaltfläche für eine neue Anfrage.

![Oberfläche aus der Quelle — 7](/docs/rockchip-bug-system/assets/en-p007-figure-02.png)

b. Lesen Sie den Redmine-Hinweis und die Vorgaben und klicken Sie auf „确认“ (Bestätigen).

![Oberfläche aus der Quelle — 8](/docs/rockchip-bug-system/assets/en-p008-figure-01.png)

#### 1.4.3 Anfrage ausfüllen

Beschreiben Sie das Problem ausführlich, damit die Ingenieure Anfrage und Anforderungen verstehen können.

![Oberfläche aus der Quelle — 9](/docs/rockchip-bug-system/assets/en-p009-figure-01.png)

### 1.5 Anfrageattribute

Anfragefelder:

- Tracker: Fehler, Funktion, Support oder Test entsprechend der Kategorie.
- Thema: Chipmodell + SDK-Version + Kurzbeschreibung, beispielsweise RK3588_Rockchip_Android13.0_SDK mit Fehlerbeschreibung.
- Beschreibung: genaue Reproduktionsschritte, Vergleichsdaten, Ziel, aktueller Zustand und erste Analyse. Protokolle, Bildschirmfotos, Fotos und Videos anhängen; für Dateien über 10M einen Cloud-Link angeben.
- Status: New — erstellt; Confirmed — einem bearbeitenden Ingenieur zugeordnet; Feedback — umsetzbarer Vorschlag, Rückmeldung erwartet; Resolved — nach Einschätzung des Ingenieurs gelöst, Prüfung ausstehend; Closed — Lösung bestätigt; Hung up — derzeit keine wirksame Lösung.

- Reopen: Ein gelöstes Problem tritt erneut auf.
- Priorität: niedrig, normal, dringend oder sofort.
- Zielversion: SDK-Version.
- RK-Chiplieferant: bei Unklarheit beim zuständigen Ansprechpartner erfragen.
- Produkttyp.
- Component_fae: Modul; falls keines passt, others wählen.
- Schweregrad: Fatal, Serious, Bad oder Warning.
- Problemtyp: common, special, general oder simple.
- Name und Telefonnummer des zuständigen Ingenieurs.
- Auftretenswahrscheinlichkeit.

Bestätigte Lösungen zeitnah schließen. Viele ungelöste Anfragen ohne Aktualisierung können die Bearbeitungsgeschwindigkeit beeinträchtigen.

### 1.6 Nach Problemen suchen

Häufige Anfragen stehen zur Suche bereit: https://redmine.rock-chips.com/projects/redmine-issues/issues .

### 1.7 Hardwareprüfung

Für das erste beziehungsweise ein geschäftlich bestätigtes Schlüsselprojekt wird dringend empfohlen, Schaltplan und PCB jeweils einmal anhand der Originaldateien prüfen zu lassen, sofern keine Ausnahme vereinbart wurde. Sonderwünsche mit dem Ansprechpartner abstimmen. Die DDR-Vorlage möglichst unverändert verwenden: Sie wurde simuliert und in Serie eingesetzt. Änderungen müssen abgestimmt und gegebenenfalls durch Simulation geprüft werden.

Dürfen Originaldateien aus Vertraulichkeitsgründen nicht versendet werden, bringen Sie sie zur Vor-Ort-Prüfung mit. Den Termin bei den Ingenieuren in Shanghai, Shenzhen oder Fuzhou vorher abstimmen.

## 2. Mehrbenutzerbetrieb

### 2.1 Einführung

In den persönlichen Einstellungen werden Stammdaten, Sprache, E-Mail-Adressen und Benachrichtigungen verwaltet. Klicken Sie oben rechts auf My account.

![Oberfläche aus der Quelle — 11](/docs/rockchip-bug-system/assets/en-p011-figure-01.png)

Die Seite My account wird geöffnet.

![Oberfläche aus der Quelle — 11](/docs/rockchip-bug-system/assets/en-p011-figure-02.png)

### 2.2 Verwendung

#### 2.2.1 Stammdaten

Im unteren Seitenbereich Vorname, Nachname und E-Mail-Adresse eintragen.

![Oberfläche aus der Quelle — 12](/docs/rockchip-bug-system/assets/en-p012-figure-01.png)

Zur Identifikation den Firmennamen und eine geschäftliche E-Mail-Adresse verwenden.

#### 2.2.2 Sprache

a. Language anklicken.

![Oberfläche aus der Quelle — 12](/docs/rockchip-bug-system/assets/en-p012-figure-02.png)

b. Sprache auswählen und speichern.

![Oberfläche aus der Quelle — 13](/docs/rockchip-bug-system/assets/en-p013-figure-01.png)

#### 2.2.3 Benachrichtigungen

Benachrichtigungen über die Auswahlliste rechts passend zum Projekt konfigurieren.

![Oberfläche aus der Quelle — 14](/docs/rockchip-bug-system/assets/en-p014-figure-01.png)

Sechs Optionen stehen bereit: alle Ereignisse meiner Projekte; alle Ereignisse ausgewählter Projekte; beobachtete Ereignisse oder solche mit meiner Beteiligung; beobachtete oder mir zugewiesene; beobachtete oder von mir erstellte; keine Benachrichtigungen.

![Oberfläche aus der Quelle — 15](/docs/rockchip-bug-system/assets/en-p015-figure-01.png)

c. Benachrichtigungen über eigene Änderungen lassen sich deaktivieren.

![Oberfläche aus der Quelle — 15](/docs/rockchip-bug-system/assets/en-p015-figure-02.png)

#### 2.2.4 Mehrere Benutzer

Bei gemeinsam genutzten Konten können mehrere Adressen Aktualisierungen erhalten. Oben rechts Emails anklicken.

![Oberfläche aus der Quelle — 16](/docs/rockchip-bug-system/assets/en-p016-figure-01.png)

b. Zusätzliche Adresse eingeben und Add anklicken.

![Oberfläche aus der Quelle — 16](/docs/rockchip-bug-system/assets/en-p016-figure-02.png)

c. Hauptadresse und zusätzliche Adressen erhalten Statusänderungen der Anfragen.

![Oberfläche aus der Quelle — 17](/docs/rockchip-bug-system/assets/en-p017-figure-01.png)

d. Die Hauptadresse aus §2.2.1 erhält eine Benachrichtigung.

![Oberfläche aus der Quelle — 17](/docs/rockchip-bug-system/assets/en-p017-figure-02.png)

e. Adressen ausgeschiedener Mitarbeiter entfernen, damit sie die Verteilerliste nicht belegen und keine vertraulichen Informationen erhalten.

![Oberfläche aus der Quelle — 18](/docs/rockchip-bug-system/assets/en-p018-figure-01.png)

f. Die Hauptadresse wird über die Entfernung informiert.

![Oberfläche aus der Quelle — 18](/docs/rockchip-bug-system/assets/en-p018-figure-02.png)

#### 2.2.5 Passwort ändern

a. Rechts Change password anklicken.

![Oberfläche aus der Quelle — 18](/docs/rockchip-bug-system/assets/en-p018-figure-03.png)

b. Aktuelles und neues Passwort eingeben und die Änderung anwenden.

![Oberfläche aus der Quelle — 19](/docs/rockchip-bug-system/assets/en-p019-figure-01.png)

c. Das System sendet eine Benachrichtigung über die Passwortänderung.

![Oberfläche aus der Quelle — 19](/docs/rockchip-bug-system/assets/en-p019-figure-02.png)

#### 2.2.6 Passwort vergessen

Zur Wiederherstellung die Haupt-E-Mail-Adresse verwenden. https://redmine.rock-chips.com/login öffnen und Lost password anklicken.

![Oberfläche aus der Quelle — 20](/docs/rockchip-bug-system/assets/en-p020-figure-01.png)

b. E-Mail-Adresse eingeben und den Antrag absenden.

![Oberfläche aus der Quelle — 20](/docs/rockchip-bug-system/assets/en-p020-figure-02.png)

c. Eine Bestätigung über den erfolgreichen Versand erscheint.

![Oberfläche aus der Quelle — 20](/docs/rockchip-bug-system/assets/en-p020-figure-03.png)

d. Die Nachricht enthält einen Rücksetzlink und den Anmeldenamen. Unten steht eine geschwärzte Kopie: Die vollständige URL mit Rücksetztoken ist abgedeckt. Verwenden Sie nur Ihre eigene autorisierte Nachricht.

![Passwort-Rücksetzmail: geschwärzte Kopie der englischen Quelle, vollständige URL abgedeckt](/docs/rockchip-bug-system/assets/en-p021-figure-01-redacted.png)

e. Link öffnen und ein neues Passwort festlegen.

![Oberfläche aus der Quelle — 21](/docs/rockchip-bug-system/assets/en-p021-figure-02.png)

g. Nach der Änderung erneut anmelden; die Hauptadresse erhält eine Benachrichtigung. Der Buchstabe f fehlt im Original.

![Oberfläche aus der Quelle — 21](/docs/rockchip-bug-system/assets/en-p021-figure-03.png)

## 3. Materialien

Materialien werden über Redmine und FTP verteilt. Der Dokumentbereich https://redmine.rockchip.com.cn/projects/fae/documents enthält technische Änderungen und Listen wichtiger Flash-, DDR-, eMMC-, WiFi- und Camera-Komponenten.

### 3.1 FTP

FTP: ftp://www.rockchip.com.cn . Zugang beim autorisierten Ansprechpartner erfragen; das gemeinsame Passwort aus der Quelle wurde aus der öffentlichen Fassung entfernt.

- 01-Wifi, 02-BT und 11-Linux: Funkgerätetreiber, Zertifizierungswerkzeuge und Support.
- 05-patch: Mehrfensterbetrieb, Farbtemperatur, mehrere USB-Geräte/Partitionen, Echo-/Rauschunterdrückung, HDMI_IN, a2dp sink.
- 06: Quellen für Player, PCBA, Stresstests, WiFi Display und OtaUpdate.
- 08: Datasheet.
- 11-Linux: DPDK, WiFi/BT und Anwendungen.
- 10-Security_Patch: Android-Sicherheitskorrekturen.
- 12-Rockchip_RKIVE_Simulator_release: Dokumentation und Patches.
- 13-Rockchip_SDK_Release_Note: SDK-Versionen und Release Notes.

### 3.2 Redmine-Dokumentbereich

https://redmine.rock-chips.com/projects/fae/documents : Komponentenlisten, SDK-Support, Patches und Hinweise.

#### 3.2.1 Patches

https://redmine.rock-chips.com/projects/rockchip_patch/issues

#### 3.2.2 EVB

https://redmine.rock-chips.com/projects/fae/urllist

#### 3.2.3 Technische Berichte

https://redmine.rock-chips.com/projects/fae/boards/6

#### 3.2.4 DDR-Hardwarevorlagen

https://redmine.rock-chips.com/documents/116 : Hardware- und DDR-Versionen nach SoC. Bei veraltetem Stand eine aktuelle Fassung anfordern.

#### 3.2.5 Flash

https://redmine.rock-chips.com/documents/46

#### 3.2.6 DDR

https://redmine.rock-chips.com/documents/49

#### 3.2.7 eMMC

https://redmine.rock-chips.com/documents/50

#### 3.2.8 WiFi

https://redmine.rockchip.com.cn/documents/52 : Funkgeräteliste und FTP-Werkzeuge. Zugangsdaten über einen autorisierten Ansprechpartner beziehen; das gemeinsame Passwort aus der Quelle wurde entfernt.

#### 3.2.9 Camera

Die englische Quelle nennt https://redmine.rock-chips.com/documents/50 , die chinesische https://redmine.rockchip.com.cn/documents/53 . Die Angaben widersprechen sich; die richtige Ressource ist zu prüfen und wird nicht stillschweigend ersetzt.

#### 3.2.10 SDK

https://redmine.rock-chips.com/documents/117 . Für die erste Platine AVL-Komponenten verwenden, da sonst die Diagnose erschwert wird. Ergänzung aus der chinesischen Quelle: Dies betrifft auch Camera; zunächst grundlegende WiFi- und Kamerafunktionen bestätigen. Nach Erreichen eines stabilen Zustands gewünschte weitere Komponentenkompatibilität über den autorisierten Ansprechpartner abstimmen.

## 4. Vor-Ort-Unterstützung

Rockchip teilt Ingenieure entsprechend Projekt und Problem zu; zwei Varianten sind vorgesehen.

### 4.1 Bei Rockchip

Geeignet für Designprüfung, Labormessungen, besondere Software-/Hardwareaufgaben, nicht über das Ticketsystem reproduzierbare Probleme, Spezialhardware, Projektbeschleunigung und dringende Schlüsselaufgaben. Mindestens einen Arbeitstag vorher über den Ansprechpartner abstimmen. Rockchip wählt einen Standort in Shanghai, Shenzhen oder Fuzhou.

### 4.2 Beim Kunden

Designprüfung und Laborprüfungen.

Besondere Software-/Hardwareaufgaben, Produktionslinie, Reproduktionsumgebung, Spezialhardware, langsame Ticketbearbeitung oder dringende Schlüsselprobleme können einen Besuch erfordern. Mindestens zwei Arbeitstage vorher beantragen; nach geschäftlicher Abstimmung weist Rockchip Ingenieure zu. Wegen begrenzter Personalressourcen wird ein Besuch des Kunden bei Rockchip bevorzugt.

## 6. Fragen und Antworten

### 6.1 Beispiel eines Softwareproblems

Das Beispiel zeigt, wie sich der Kommunikationsaufwand reduzieren lässt.

#### 6.1.1 Erforderliche Angaben

a. logcat- und Kernel-Protokolle.

Über serielle Konsole oder adb shell `logcat -v time` ausführen. Bei zu vielen Meldungen vor dem APK-Start mit `logcat -c` leeren, anschließend `logcat -v time` aktivieren und die APK starten. Kernel-Protokolle über die serielle Konsole oder `dmesg` erfassen. Bei Hängern oder erzwungenem Schließen nennt die Quelle `data/arn/trace.txt`; arn bleibt erhalten, der Pfad ist für das eingesetzte Android zu prüfen.

b. Genaue Reproduktionsschritte.

c. SDK-Version, Beispiel RK3588 Linux:

```text
~/linux_rk3588/.repo/manifests$ ls  rk3588_*
rk3588_linux_release.xml  rk3588_nvr_linux.xml

rk3588_linux:
RK3588_Linux5.10_SDK_Note.md            rk3588_linux_beta_v0.1.1_20220421.xml
rk3588_linux_release_v1.0.2_20220820.xml  rk3588_linux_release_v1.0.5_20221120.xml
rk3588_linux_release_v1.1.1_20230520.xml
rk3588_linux_alpha_v0.0.1_20220115.xml  rk3588_linux_release_v1.0.0_20220520.xml
rk3588_linux_release_v1.0.3_20220920.xml  rk3588_linux_release_v1.0.6_20221220.xml
rk3588_linux_release_v1.2.0_20230620.xml
rk3588_linux_beta_v0.1.0_20220414.xml   rk3588_linux_release_v1.0.1_20220620.xml
rk3588_linux_release_v1.0.4_20221020.xml  rk3588_linux_release_v1.1.0_20230420.xml
rk3588_linux_release_v1.2.1_20230720.xml

rk3588_nvr_linux:
rk3588_linux_nvr_release_v1.0.0_20220304.xml  rk3588_linux_nvr_release_v1.3.0_20220805.xml
rk3588_linux_nvr_release_v1.5.0_20230105.xml
rk3588_linux_nvr_release_v1.1.0_20220418.xml  rk3588_linux_nvr_release_v1.4.0_20221015.xml
rk3588_linux_nvr_release_v1.6.0_20230510.xml
rk3588_linux_nvr_release_v1.2.0_20220610.xml  rk3588_linux_nvr_release_v1.4.1_20221114.xml
RK3588_Linux_NVR_SDK_Note.md
```

Haupt- und Unterversion angeben, etwa rk3588_linux_release_v1.2.1_20230720.xml oder rk3588_linux_nvr_release_v1.6.0_20230510.xml. Beispiel Android 13:

```text
~/rockchip_android13.0_sdk_release/.repo/manifests/include$ ls
partner_gms_express.xml      rk3326_repository.xml  rk3528_repository.xml
rk356x_repository.xml  rk_checkout_repository.xml
partner_modules_express.xml  rk3399_repository.xml  rk3562_repository.xml
rk3588_repository.xml  rk_modules_repository.xml`
```

Haupt- und Unterversion aus rk3588_repository.xml oder rk3399_repository.xml angeben und folgende Zeile prüfen.

```text
~/rockchip_android13.0_sdk_release/.repo/manifests/include$ cat rk3588_repository.xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest>
  <project path="device/rockchip/rk3588" name="rk/device/rockchip/rk3588" remote="rk"
revision="refs/tags/android-13.0-mid-rkr5" />
</manifest>
```

android-13.0-mid-rkr5 bedeutet RK3588 Android 13 R5.

[ArmSoM Docs](https://docs.armsom.org/)

[Rockchip Redmine](https://redmine.rock-chips.com/)

{% endraw %}
