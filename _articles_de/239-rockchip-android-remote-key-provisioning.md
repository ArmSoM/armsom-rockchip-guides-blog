---
title: "Rockchip Android RKP: Extraktion, Upload, Tests und Fehler"
description: "Rockchip Android RKP: Extraktion, Upload, Tests und Fehler — V1.1, CSR, KeyMint, GTS"
excerpt: "Rockchip Android RKP: Extraktion, Upload, Tests und Fehler"
translation_key: "239-rockchip-android-remote-key-provisioning"
slug: "239-rockchip-android-remote-key-provisioning"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android", "RKP", "KeyMint"]
---

{% raw %}

# Rockchip Android RKP: Extraktion, Upload, Tests und Fehler

Plattformreferenz für ArmSoM: vollständiger technischer Inhalt des chinesischen Rockchip Android Remote key Provisioning Guide, Dokument 747, Entwurf V1.1 vom 16 Seiten. Zweisprachiges Deckblatt, chinesischer Fachtext. Keine separate englische Quelle; Englisch, Russisch und Deutsch übersetzen den chinesischen Text und nutzen alle neun Originalabbildungen. Keine Tests mit ArmSoM-Hardware oder echten Google-Konten. Aktuelle GMS/VSR-Regeln, APIs und Werkzeuge müssen nicht dem Stand 2023 entsprechen. BSP, sichere Hardware und autorisierte Partneranforderungen prüfen.

## Quellenunklarheiten und Anwendungsgrenzen

- Die Secure-Boot-/Test-Produktionsregel auf Seite 15 ist fragwürdig und im Text markiert. `is_test=true` registriert dauerhaft, nicht zum unverbindlichen Ausprobieren. Die Aussage über Produktionszertifikate aller registrierten Geräte muss von dauerhafter Testregistrierung unterschieden werden.
- Seite 10 nennt den Verschlüsselungsschlüssel privat; Seite 13 spricht von Verschlüsselung „in den öffentlichen Geräteschlüssel“. Kryptografisch ungenaue Formulierungen. Es geht um öffentliche Schlüsseldaten im CSR, nicht um den Export privater Geräteschlüssel. Wegfall der HAL-Verschlüsselung dieser Daten ab Android 14 macht private Schlüssel nicht lesbar.
- Der curl-Quellpayload enthält JSON-Feldnamen ohne Anführungszeichen. Er bleibt erhalten, gilt aber nicht als ausführbar; vor Korrektur die autorisierte API-Spezifikation prüfen. Für `./data/local/tmp/...` das Arbeitsverzeichnis prüfen. Der Pseudocode mischt C/Python und fehlerhafte Umbrüche; er erläutert Bedingungen, ist jedoch nicht kompilierbar.
- PDF-Zeilenumbrüche in Befehlen, JSON-Strings, Zugangsdatenpfaden und gtest_filter wurden verbunden; Optionen, Hashes, Platzhalter und Fehlercodes bleiben gleich. Git-Autoren bleiben als Codehistorie, nicht als Kontakte. OAuth-Zustimmung, Uploads, Updates und Registrierung verändern externe Daten; hier nicht ausgeführt.
- Öffentliche CSR-Schlüsseldaten dürfen nicht beliebig verändert werden: Schreibzugriff begrenzen und redundant speichern. OAuth-Daten, Dienstkontoschlüssel und Tokens schützen. Auf geteilten Computern kein `--cache-token`. Testwurzeln sind kein Produktionsvertrauen; Zurücksetzen löscht Nutzerdaten.
- „Je X Geräte“ definiert X nicht; keine erfundene Stichprobenrate. Verzögerungsfreiheit und RemoteProvisioner-/API-/GMS-Regeln sind historische Quellaussagen, keine Dienstgarantien.

## Überblick

Remote Key Provisioning (RKP) verlagert die Schlüsselbereitstellung aus der Fabrik auf den Funkweg. Es kombiniert werkseitige Extraktion öffentlicher Schlüssel, drahtlose Zertifikatsbereitstellung und kurzlebige Zertifikate. Als Teil der Android-Attestierungsinfrastruktur stärkt es die Vertrauenskette und erleichtert deren Wiederherstellung nach Schwachstellen.

![RKP 2](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p002-figure-01.png)

Abbildung 1. RKP-Ablauf

Die OEM-Fabrik extrahiert den eindeutigen öffentlichen Schlüssel jedes Geräts; der Hersteller lädt ihn zum Google-Backend hoch. Das Gerät fordert Attestierungsschlüssel-Zertifikate an, indem es dem Provisionierungsserver den Besitz seines privaten Schlüssels nachweist. Der Server prüft den öffentlichen Schlüssel und signiert Gerätezertifikate.

Laut Quelle müssen Geräte mit Android 13 oder neuer ab Markteinführung und Chipsätzen nach Vendor Software Requirements (VSR) 12 oder neuer RKP unterstützen. Drei Hauptschritte: Android Partner API einrichten, Zertifikatssignierungsanfragen (CSR) extrahieren und CSR hochladen.

Schnellstart: Ist die Android Partner API bereits eingerichtet, führen folgende Befehle durch den RKP-Ablauf. CSR extrahieren:

```text
adb shell  rkp_factory_extraction_tool --output_format build+csr > csrs.json
```

CSR hochladen:

```text
./device_info_uploader.py --credentials /secure/storage/cred.json --json-csr csrs.json --cache-token --company-id COMPANY_ID
```

GTS-Test ausführen:

```text
run gts -m GtsGmscoreHostTestCases
```

Hinweis: Zum Stand dieses Leitfadens ergänzt RKP den werkseitigen Attestierungsschlüssel, statt ihn zu ersetzen.

So lässt sich prüfen, ob ein Attestierungsschlüssel provisioniert wurde:

```text
adb push VtsAidlKeyMintTargetTest /data/local/tmp/
adb shell chmod +x /data/local/tmp/VtsAidlKeyMintTargetTest
adb shell
su
./data/local/tmp/VtsAidlKeyMintTargetTest --gtest_filter=PerInstance/AttestKeyTest.RsaAttestedAttestKeys/0_android_hardware_security_keymint_IKeyMintDevice_default
```

VtsAidlKeyMintTargetTest mit `mm` unter `hardware/interfaces/security/keymint/aidl/vts/functional` bauen.

## 1. Android Partner API einrichten

Die Android Partner API ist eine Google-Cloud-Project-API (GCP) mit Benutzerkonten. Vorhandene `cred.json`-Zugangsdaten anderer Partner-API-Dienste können wiederverwendet werden. Neue Nutzer müssen das Einrichtungsverfahren befolgen, eine OAuth-2.0-Client-ID für das GCP-Projekt erstellen und als `cred.json` herunterladen.

Die erwähnten Anleitungen sind nur für MADA-Unterzeichner beziehungsweise EMADA, TMADA oder TADA mit GMS-Vertriebslizenz zugänglich. Deren Schritte genau befolgen. Bei neuer Einrichtung zuerst die Aktivierung der Android Partner API beantragen und sie anschließend in GCP aktivieren.

## 2. Zertifikatssignierungsanfragen extrahieren

Bei der Herstellung aus jedem Gerät einen CSR mit dessen öffentlichem Schlüssel extrahieren. Das SDK unterstützt Kommandozeile und Fabrikwerkzeug.

### 2.1. Kommandozeile

Googles Referenzwerkzeug `rkp_factory_extraction_tool` ist in der aus dem SDK gebauten Firmware enthalten. Die Ausgabe wird in eine separate Datei geschrieben. Geräte-CSR extrahieren:

```text
adb shell  rkp_factory_extraction_tool --output_format build+csr > csrs.json
```

Quellcode: `system/security/provisioner/rkp_factory_extraction_tool.cpp`; bei Bedarf anpassen.

#### Kommandozeilenoptionen

Das Extraktionswerkzeug akzeptiert folgende Optionen:

| Option | Beschreibung |
| --- | --- |
| --test_mode | Testmodus: IRemotelyProvisionedComponent erzeugt einen temporären Schlüssel. Die Nutzlast ist nicht zum Upload geeignet. |
| --self_test | Test-CSR abrufen und mit derselben Logik wie VTS zur Chipsatzprüfung validieren. |
| --output_format | csr (Standard): CBOR-Zertifikatsanfragestruktur. build+csr: JSON-String mit Build-Fingerprint und CBOR-Anfrage zur Zuordnung von CSRs zu Geräten. |

#### Rückgabecodes

Das Werkzeug verwendet diese Rückgabecodes:

| Code | Ergebnis |
| --- | --- |
| 0 | Erfolg |
| 1 | Unerwarteter Ausführungsfehler; Beschreibung auf stderr. |
| -1 | Ungültige Argumente; Beschreibung auf stderr. |

### 2.2. Fabrikwerkzeug

Sicherstellen, dass beide Verzeichnisse die folgenden Commits enthalten.

`hardware/rockchip/keymaster4`:

```text
commit 2a1c90a031f02964c05a66ba8aa971da528782e8
Author: Wu Liangqing <wlq@rock-chips.com>
Date:   Fri May 19 01:26:20 2023 +0000

    add rockchip_rkp_factory_extraction_tool arm32 version.

    Signed-off-by: Wu Liangqing <wlq@rock-chips.com>
    Change-Id: Id511b1e9277eec1073c0ae523e3065826811d9cd
```

`device/rockchip/common`:

```text
commit 5b2b3c61d51e93cee1ce42e937ee1cace5b258fd
Author: Bian Jin chen <kenjc.bian@rock-chips.com>
Date:   Sat May 6 15:48:30 2023 +0800

    gms : Add rockchip_rkp_factory_service for factory MP.

    Signed-off-by: Bian Jin chen <kenjc.bian@rock-chips.com>
    Change-Id: I86f8a7a78dad7e62e78ebc6e938e9259178d1e04
```

1. Zuerst die Geräteseriennummer schreiben, dann neu starten. Beim ersten Start mit Seriennummer erzeugt `rockchip_rkp_factory_service` den RKP-CSR in der vendor-Partition; dort ist er nicht direkt abrufbar.

2. KeyboxWriter-v1.55 aus `RKTools\windows\KeyboxWriter-v1.55.7z` öffnen und den zu schreibenden Google-Schlüssel wählen.

![RKP 5](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p005-figure-01.png)

3. Konfiguration öffnen und das PC-Verzeichnis zum Speichern der RKP-CSRs wählen.

![RKP 5](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p005-figure-02.png)

4. Das Gerät in den loader-Flashmodus versetzen und auf Start klicken.

![RKP 6](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p006-figure-01.png)

Der Geräte-CSR wird wie gezeigt im konfigurierten Ordner gespeichert.

![RKP 6](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p006-figure-02.png)

Format des CSR-Dateinamens:

`Seriennummer-konkreter-Zeitpunkt.json` (Seriennummer und Zeitstempel).

Wichtig:

1. Wird der Google-Schlüssel vor der Seriennummer geschrieben, kann der RKP-CSR nicht gelesen werden; der gezeigte Fehler tritt auf.

![RKP 7](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p007-figure-01.png)

2. Nach Schreiben der Seriennummer normal neu starten, erneut den loader-Modus aufrufen und den CSR mit KeyboxWriter abrufen.

## 3. Zertifikatssignierungsanfragen hochladen

Dieser Abschnitt beschreibt das Hochladen von CSRs zum Google-Backend.

1. Umgebung vorbereiten und Abhängigkeiten installieren:

```text
pip3 install google-auth==2.13.0 requests==2.28
```

`device_info_uploader.py` herunterladen.

2. Die extrahierte Datei `csrs.json` verwenden.

3. `COMPANY_ID` für den Upload ermitteln: In Android Partner Approvals anmelden und Firmenmetadaten unter Builds > Metadata ansehen. Beispiel unten.

![RKP 7](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p007-figure-02.png)

Abbildung 2. Firmen-ID in Partner Approvals

4. Geräteinformationen hochladen: `batchUpload` für neue Geräte, `batchUpdate` für bestehende Registrierungen. Drei Varianten: `device_info_uploader.py` mit GCP-Benutzerkonto, mit GCP-Dienstkonto oder direkter Android-Partner-API-Aufruf über curl.

### Option 1: device_info_uploader.py mit GCP-Konto

Diese Variante verwendet das Upload-Skript.

1. Das Skript wie im Beispiel ausführen:

```text
./device_info_uploader.py --credentials /secure/storage/cred.json --json-csr csrs.json --cache-token --company-id COMPANY_ID
```

Die Authentifizierung mit `--credentials` benötigt einen lokal installierten JavaScript-fähigen Browser. Für entfernte Terminals wie SSH ein Dienstkonto verwenden: in Google Cloud erstellen, freischalten, JSON-Schlüssel herunterladen und mit `--credentials-keyfile keyfile.json` authentifizieren.

`/secure/storage/cred.json` durch den eigenen Zugangsdatenpfad ersetzen. `--cache-token` speichert das Autorisierungstoken lokal. Bei unsicherem Speicher, etwa auf gemeinsam genutzten Computern, diese Option nicht verwenden.

`csrs.json` wie unten formatieren; dies entspricht stdout von `rkp_factory_extraction_tool --output_format build+csr`.

```text
{"build_fingerprint":"YOUR_FINGERPRINT","csr":"YOUR_CERTIFICATE_REQUEST"}
```

2. Auf die ausgegebene Anmelde-URL warten.

3. URL in einem neuen Browser-Tab öffnen. Bei Google das Firmenkonto im Format `android-partner-api@company.com` wählen, wie gezeigt.

![RKP 8](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p008-figure-01.png)

Abbildung 3. Konto auswählen

4. „Zulassen“ wählen, damit die Testanwendung Partner-Geräteinformationen ansehen und verwalten kann.

![RKP 9](/docs/rockchip-android-remote-key-provisioning/assets/unspecified-p009-figure-01.png)

Abbildung 4. Zugriff auf das Google-Konto erlauben

### Option 2: device_info_uploader.py mit GCP-Dienstkonto

`device_info_uploader.py` mit `csrs.json` und der aus Service Account Credentials heruntergeladenen Schlüsseldatei `my-project-0000000000-ffffffffffff.json` starten:

```text
./device_info_uploader.py --credentials-keyfile /secure/storage/my-project-0000000000-ffffffffffff.json --json-csr csrs.json --company-id COMPANY_ID
```

### Option 3: Android Partner API direkt mit curl aufrufen

API aufrufen und Datei mit curl hochladen, wie in diesem Quellbeispiel:

```text
curl -s -X POST -H "Content-Type: application/json" -H "$(oauth2l header --json /secure/storage/cred.json androidPartner)" -H "X-GFE-SSL: yes" -d '{company_id: COMPANY_ID, device_payloads: [{certificate_payloads: [{certificate_signing_request: "CERTIFICATE_SIGNING_REQUEST"}]}]}' https://androidpartner.googleapis.com/v1/devices:batchUpload
```

`/secure/storage/cred.json` durch den Zugangsdatenpfad, `COMPANY_ID` durch die Android-Partner-Firmen-ID und `CERTIFICATE_SIGNING_REQUEST` durch den CBOR-codierten Zertifikatsantrag des Extraktionswerkzeugs ersetzen.

## 4. Tests und Validierung

Gerätevalidierung: Die Quelle empfiehlt, jedes Stichprobengerät („je X Geräte“, ohne X festzulegen) mit einem externen Netz zu verbinden und GTS `AttestationRootHostTest` auszuführen. Erfolg zeigt korrekte Registrierung und gültige Google-Attestierungszertifikate. Öffentliche Schlüssel vor Erreichen der Teststation hochladen.

Extraktion und Upload müssen zu 100% zuverlässig sein: Ohne hochgeladenen öffentlichen Schlüssel erhält ein Gerät keine Attestierungsschlüssel. Extrahierte Daten redundant speichern, um die Integrität bis zum Upload zu sichern.

Datensicherheit: Laut Quelle sind die Daten mit einem nur dem Google-Backend zugänglichen Schlüssel verschlüsselt und enthalten öffentliche Schlüssel, die keine hochvertrauliche Speicherung benötigen. Diese Formulierung ist mehrdeutig; siehe redaktionellen Hinweis. Schreibzugriff begrenzen, damit Angreifer keine gefälschten Geräteschlüssel in die Fabrikdatenbank einfügen. Partner-API-Zugangsdaten für Uploads begrenzen und schützen.

## 5. RKP-API-Fehler

Die folgenden CSR-Uploadfehler helfen bei der RKP-Testdiagnose.

### Spezifische Fehler

#### Benutzerberechtigung für Firmen-ID verweigert

Dem Benutzer fehlt die Uploadberechtigung für die Firma. Meldung: CSR nicht hochgeladen; `{USER}` darf keine Geräteinformationen für `{COMPANY_ID}` hochladen. Problem melden oder TAM wegen der Berechtigung kontaktieren.

Code 7 (Berechtigung verweigert), HTTP 403.

#### Schlüssel existiert bereits

Ein CSR mit zuvor hochgeladenem öffentlichem Schlüssel wird abgewiesen: CSR nicht hochgeladen; Geräteschlüssel existiert bereits; BatchUpdate zum Ändern seiner Daten aufrufen. Code 6 (bereits vorhanden), HTTP 400. Zugehörige Geräteinformationen über die Update-API ändern.

#### Schlüssel existiert nicht

Update eines unbekannten Schlüssels schlägt fehl: CSR nicht hochgeladen; Geräteschlüssel nicht gefunden; zuerst BatchUpload aufrufen. Code 5 (nicht gefunden), HTTP 400.

#### CSR-Version fehlt

CSR ohne Version wird abgewiesen: nicht hochgeladen; Version fehlt; korrekte Felder sicherstellen. Code 3 (ungültiges Argument), HTTP 400. Die Version bestimmt, ob der Hersteller überprüft wird.

#### Hersteller nicht gefunden

Der Hersteller lässt sich nicht extrahieren. CSR-Version 1 wird mit Warnung erfolgreich hochgeladen: Herstellerangaben sind bei VSR12 optional, ab VSR13 erforderlich; Fabrikwerkzeuge für zukünftige Chipsätze vorbereiten. HTTP 200 Erfolg. CSR-Version 2 oder höher wird nicht hochgeladen: Hersteller ab VSR13 erforderlich; Code 3, HTTP 400.

#### Herstellerberechtigung verweigert

Dem Benutzer fehlen Rechte für den Hersteller. CSR-Version 1 wird mit Warnung hochgeladen: keine Berechtigung für `{MANUFACTURER}`, VSR12-CSRs werden jedoch noch akzeptiert; Rechte für VSR13+ beschaffen. HTTP 200. CSR-Version 2 oder höher wird abgewiesen: Berechtigung für `{MANUFACTURER}` fehlt; Hersteller in Android Partner Approvals registrieren und Bericht hochladen. Code 7, HTTP 403. Beim ersten Upload für neue/unregistrierte Hersteller einen Bericht mit deren Informationen einreichen.

#### Doppelter Schlüssel im selben Request

Mehrfaches Hochladen desselben Schlüssels: doppelter öffentlicher Geräteschlüssel im Request gefunden; Schlüssel bereits hochgeladen. Code 3, HTTP 400.

#### Maximale CSR-Anzahl

Über 5000 CSRs pro Request: Höchstzahl erreicht; höchstens 5000 CSRs pro DevicePayload hochladen. Code 3, HTTP 400.

#### CSR kann nicht deserialisiert werden

Ungültiger CSR: nicht hochgeladen; Zertifikatssignierungsanfrage bei Registrierung nicht deserialisierbar; Unversehrtheit prüfen. Code 3, HTTP 400.

### Allgemeine Fehler

**Frist überschritten:** zu viele Schlüssel führen zum Timeout. Meldung: Frist überschritten; mit weniger CSRs wiederholen, bei Fortbestehen Google TAM kontaktieren. Code 4, HTTP 504.

**Interner Fehler:** laut Quelle nicht zwischengespeichert und durch Google-Ingenieure zu untersuchen. Meldung: interner Fehler. Code 13.

**Nicht authentifiziert:** Benutzer nicht authentifiziert; Partner-API-Einrichtung prüfen. Meldung: nicht authentifiziert. Code 16, HTTP 401.

**Ressourcen erschöpft:** etwa Benutzerquote erreicht oder Dateisystem voll. Später wiederholen. Code 8 (RESOURCE_EXHAUSTED), HTTP 429.

**Dienst nicht verfügbar:** wahrscheinlich vorübergehend; mit wachsendem Abstand erneut versuchen. Meldung: Dienst nicht verfügbar. Code 14 (UNAVAILABLE), HTTP 503.

**Abgebrochen:**

Ein Vorgang wurde abgebrochen, meist wegen Nebenläufigkeit, etwa einer fehlgeschlagenen Sequenzprüfung oder abgebrochenen Transaktion. Meldung: abgebrochen. Code 10 (ABORTED), HTTP 409.

#### Google Cloud Platform deaktiviert

Beim Erstellen eines GCP-Projekts mit Partner-Domain-Konto kann die Aufforderung erscheinen, den Dienst vom Administrator in der G Suite Admin console aktivieren zu lassen. Laut Quelle kein Partner-Domain-Konto zur Projekterstellung verwenden, sondern das Firmenkonto. Bei Google Workspace den IT-Administrator um GCP-Aktivierung bitten.

## 6. Häufige RKP-Fragen

### Geräteinformationen hochladen/aktualisieren

**1. Warum HTTP 500 „interner Fehler“?** Manche TEE-Implementierungen formatieren Requests falsch; der Server kann die Nutzlast nicht parsen und liefert 500. Wiederholen und Problem melden.

**2. Warum unterschiedliche CSRs desselben Geräts? Ändert sich der öffentliche Schlüssel?** Unter Android 13 und älter verschlüsselt die HAL einen CSR-Teil mit öffentlichen Schlüsseldaten. Zufälligkeit erzeugt bei V1/V2-HAL-CSRs verschiedene Chiffretexte. Der Klartextschlüssel muss gleich bleiben. Laut Quelle benötigt die Verifikation das Google-Backend-Team, das den Request entschlüsseln kann.

**3. Wie lässt sich der Geräteschlüssel im Klartext ansehen?** Unter Android 13 und älter verschlüsselt die HAL die Schlüsseldaten. Laut Quelle kann nur das Google-Backend entschlüsseln, nicht einmal Google-Mitarbeiter direkt zugreifen; unter Android 13 sind sie daher nicht einsehbar. Ab Android 14 ist diese HAL-Verschlüsselung nicht mehr erforderlich, was Architektur und Tests vereinfacht. Gemeint sind öffentliche CSR-Schlüsseldaten, keine Erlaubnis zum Export privater Schlüssel.

**4. Darf ein Nicht-Produktionsmodellname verwendet werden?** Modell und Hersteller müssen der Firmenregistrierung in Android Partner Approvals entsprechen.

### CSR-Upload

**1. Führt ein beschädigter CSR zu einem Fehler?** Ja, die API liefert dokumentierte Fehler; das Backend prüft die kryptografischen CSR-Operationen.

**2. Kann ein falscher CSR zurückgenommen oder geändert werden?**

Ja. `device_info_uploader` aktualisiert Geräte automatisch mit den neuesten Informationen; zum Aktualisieren erneut ausführen.

**3. Was passiert bei doppeltem CSR-Upload?** Der normale Upload liefert einen Bereits-hochgeladen-Fehler. Ein Update ändert die Metadaten wie manufacturer und model.

**4. Gibt es ein Uploadlimit?** Höchstens 5,000 CSRs pro API-Aufruf. Das Werkzeug bündelt automatisch jeweils 2,000: Aus 100,000 CSRs werden 50 API-Batches zu je 2,000.

**5. Wie lange dauert es nach dem Upload?** Laut Quelle keine Verzögerung: RKP funktioniert nach Eingang des CSR im Backend sofort. Quellaussage, keine gemessene Dienstgarantie.

**6. Kann man registrierte CSRs im Google-Backend prüfen?** Zum Stand des Leitfadens nein; Google erwog die Funktion. Ein Update kann einen Nicht-vorhanden-Fehler liefern, Änderungen bleiben jedoch gespeichert. Alternativ denselben CSR oder einen neuen CSR desselben Geräts mit `device_info_uploader.py --no-update` hochladen:

```text
./device_info_uploader.py --credentials /secure/storage/cred.json --json-csr csrs.json --cache-token --company-id COMPANY_ID --no-update
```

Es folgt eine Antwort wie diese:

```text
"status": {
        "code": 6,
        "message": "This CSR was not uploaded. Device public key already exists. Please call BatchUpdate to modify an existing key's data."
      }
```

Dies zeigt, dass der Geräte-CSR bereits hochgeladen wurde.

### Tests

**1. Wie testet man Vorseriengeräte?** Produktionsgeräte erhalten echte Attestierungszertifikate für Googles Signierung von Zertifikatsanfragen. Frühe Vorseriengeräte deshalb nicht als Produktionsgeräte registrieren. `is_test` auf `true` setzen: Der Schlüssel wird dauerhaft als Testgerät registriert und lässt sich durch Informationsupdates nicht in Produktion umwandeln. Testzertifikate führen zu einer Testwurzel. Werden Produktionszertifikate benötigt, etwa für GTS, kann ein Gerät stattdessen von Anfang an als Produktion registriert werden. `--is-test` kennzeichnet Testgeräte im Uploader.

**Zu prüfender Quellwortlaut:** „Geräte mit aktiviertem Secure Boot als Testgeräte markieren; Geräte mit deaktiviertem Secure Boot als Produktionsgeräte markieren.“ Dies wirkt widersprüchlich zu Produktions-Vertrauensanforderungen. Als ungeklärte Entwurfsaussage erhalten, nicht als Anweisung zum Abschalten von Secure Boot oder zur Produktionsregistrierung unsicherer Geräte. Vor irreversibler Registrierung die korrekte Richtlinie autorisiert bestätigen lassen.

**2. Unterscheiden sich userdebug-Tests von Produktion?** Nicht registrierte userdebug-/eng-Geräte erhalten Testzertifikate ohne Upload. Deren Testwurzel eignet sich für Tests, darf aber nicht für Produktionsattestierung vertraut werden. Anschließend sagt die Quelle, registrierte Geräte erhielten unabhängig vom Build immer Produktionszertifikate; dies ist zusammen mit der zuvor beschriebenen dauerhaften Testregistrierung zu klären, nicht als deren Aufhebung.

**3. Sind CSRs für Geräte ohne Auslieferungsanforderungen zulässig?** Ja, laut Quelle für interne und externe Tests.

**4. Hinterlässt AttestationRootHostTest Spuren?** Ja, Löschen der Nutzerdaten entfernt alle Spuren dieses Tests. Dabei gehen auch Nutzerdaten verloren: vorher sichern.

**5. Mindestanforderungen? Ist die in GTS genannte SIM Pflicht?** Die Quelle nennt nur Netzwerkzugriff auf Googles Backend und den dort hochgeladenen Geräteschlüssel; eine SIM wird nicht als Mindestanforderung genannt.

**6. Scheitert RKP GTS nach Upgrade eines mit Android 12 gestarteten Geräts auf Android 13?** Laut Quelle nein: Die Anforderung betrifft Geräte mit Android 13 ab Markteinführung. Die genaue Auswahl folgt als Pseudocode.

```text
bool is_rkp_supported() {  # not supported on CN-GMS devices  if
has_feature("cn.google.services") AND has_package("com.google.android.gms"):
return false  # supported on T+ with VSR S+  if ro.product.first_api_level >= 33
AND ro.vendor.api_level >= 31:    return true  # otherwise unsupported  return
false}
```

**7. Warum schlägt testFallback oder AttestationRootHostTest.testFallbackKey fehl?** Die Tests prüfen Keymints Rückfall auf Fabrikschlüssel ohne entfernte Schlüssel. Ohne lokalen Attestierungsschlüssel kann keystore keinen attestierten Signaturschlüssel erzeugen, da der Ersatzschlüssel zur Bestätigung fehlt. Fehler ist dann erwartbar; lokalen Schlüssel bereitstellen und wiederholen.

**8. Warum schlagen alle RKP-GTS-Tests fehl?**

Häufig fehlt RemoteProvisioner APK im Systemimage. Laut Quelle enthalten generische AOSP-Images es nicht; für GMS-Geräte explizit aufnehmen, da RKP eine GMS- und keine CDD-Anforderung ist. `AttestationRootTest.testRemoteProvisionerInstalled` prüft die Installation. Fehlendes APK dem Image hinzufügen.

**9. Was bedeutet com.android.remoteprovisioner.RemoteProvisioningException: HTTP error status encountered: 444?**

Nach der in der Quelle beschriebenen RemoteProvisioningException bedeutet 444, dass das Gerät nicht im Google-Backend registriert ist.

## Quellenlinks (gegebenenfalls Partnerzugang erforderlich)

- [Google Cloud authentication](https://cloud.google.com/docs/authentication/?hl=zh-cn)

- [Android Partner API](https://docs.partner.android.com/gms/building/integrating/att-keys/Setting-Up-Partner-API?hl=zh-cn)

- [GCP service account](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp?hl=zh-cn#create-service-account)

- [device_info_uploader.py](https://docs.partner.android.com/static/common/device_info_uploader.py?hl=zh-cn)

- [batchUpload](https://developers.google.com/android-partner/reference/rest/v1/devices/batchUpload?hl=zh-cn)

- [batchUpdate](https://developers.google.com/android-partner/reference/rest/v1/devices/batchUpdate?hl=zh-cn)

- [RemoteProvisioningException.java](https://cs.android.com/android/platform/superproject/+/master:packages/apps/RemoteProvisioner/src/com/android/remoteprovisioner/RemoteProvisioningException.java;l=43;drc=b45a2ea782074944f79fc388df20b06e01f265f7?hl=zh-cn)

[Rockchip](https://www.rock-chips.com/) · [Android](https://source.android.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
