---
title: "Rockchip SDK beantragen und synchronisieren"
description: "Rockchip SDK beantragen und synchronisieren — V1.1.8"
excerpt: "Rockchip SDK beantragen und synchronisieren"
translation_key: "211-rockchip-sdk-application-and-synchronization"
slug: "211-rockchip-sdk-application-and-synchronization"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "development"
products: []
tags: [ArmSoM, Rockchip, SDK, Git, Repo]
---

{% raw %}

# Rockchip SDK beantragen und synchronisieren

Grundlage sind die chinesischen und englischen Rockchip-Quellen RK-YH-YF-801 V1.1.8 vom 2025-10-24. Technische Inhalte zu Antrag, Autorisierung, Synchronisierung, SDK-Versionen, Werkzeugen und Fehlerbehebung sind vollständig erhalten. Das ursprüngliche Kapitel 4 enthält nur Kontakt-/Beschwerdeinformationen und entfällt samt rechtlichen Titel-, Zielgruppen- und Revisionsseiten; übrige Kapitelnummern bleiben erhalten. Die Matrix mit 143 SDK-Zeilen und Empfehlungssternen ist historisch, kein aktueller Wartungsstatus oder ArmSoM-Supportversprechen. Es wurden keine Anträge, Downloads, Schlüsseländerungen, Repositorylöschungen oder Hardwaretests durchgeführt.

Sicherheit: Nur den öffentlichen .pub-Schlüssel einreichen, niemals private Schlüssel, .git-credentials oder Token. Der Quellbefehl zur „Sicherung des öffentlichen Schlüssels“ archiviert ganz ~/.ssh und damit möglicherweise private Schlüssel; Backup verschlüsseln und Zugriff beschränken. Passwortlose Schlüssel, StrictHostKeyChecking no und das Akzeptieren unbekannter Hosts sind keine allgemeinen Sicherheitsempfehlungen: Fingerprints unabhängig prüfen und organisatorische Schlüsselregeln beachten. Repositorylöschung, --force-sync und Überschreiben können lokale Änderungen vernichten; vorher sichern und genaue Ziele prüfen.

Quellunterschiede: Englisch nennt drei Autorisierungsdateien, listet aber nur zwei; die chinesische Zahl zwei gilt. Das Linux-Werkzeugverzeichnis lautet gemäß Chinesisch tools statt englisch Tools. Der falsche englische Basispaket-Titel 1.2.2 wird anhand Chinesisch als direkte Serversynchronisierung wiedergegeben. RK1808 wurde aus der englischen ToyBrick-Liste ergänzt. Im englischen Abschnitt zur Schlüsseleinreichung ist tatsächlich eine Redmine-Aktivierungsmail abgebildet; das Original bleibt mit diesem Hinweis erhalten. Die meisten Oberflächen sind chinesisch/zweisprachig. Nur geprüfte Bilder werden verwendet, Kontaktfußzeilen beschnitten und reine Kontaktbilder ausgeschlossen. Befehle im Release-Notes-Screenshot sind horizontal abgeschnitten und nicht vollständig ausführbar.

Quellcode bleibt wörtlich erhalten und ist nicht garantiert ausführbar: Die E-Mail in englischem ssh-keygen enthält Markdown-Linksyntax, einige -p-Optionen verwenden den Gedankenstrich –p, gitconfig enthält •-Aufzählungszeichen und die Sicherungsdatei heißt id_ras_backup.tag.gz. Vor Verwendung die tatsächliche Syntax prüfen; diese Quellfehler werden nicht stillschweigend korrigiert.

<!-- source:en p5 unit:38 -->

## 1. Bedienungsanleitung

<!-- source:en p5 unit:39 -->

Dieses Kapitel beschreibt den Rockchip-SDK-Antrag einschließlich öffentlichem Schlüssel, Antragsformular und zuständiger Person für den Materialempfang.

<!-- source:en p5 unit:40 -->

### 1.1 Ablauf und Schritte zum Erhalt eines SDK

<!-- source:en p5 unit:41 -->

Gehen Sie zum Erhalt eines Rockchip SDK wie folgt vor:

<!-- source:en p5 unit:42 -->

#### 1.1.1 Arbeitsablauf

<!-- source:en p5 unit:43 -->

Nachfolgend ist der Antragsprozess für das Rockchip SDK einschließlich aller veröffentlichten Softwarematerialien dargestellt.

<!-- source:en p5 unit:43f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p005-application-flow.png)

<!-- source:en p5 unit:44 -->

#### 1.1.2 Registrierungsformular ausfüllen

<!-- source:en p5 unit:45 -->

Bei erstmaliger Zusammenarbeit mit Rockchip sendet das System nach Unterzeichnung der Geschäftsvereinbarung die E-Mail „Rockchip Customer Information Form“. Tragen Sie die Registrierungsdaten Ihres Unternehmens wie folgt ein:

<!-- source:en p6 unit:46 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p006-figure-01.png)

<!-- source:en p6 unit:47 -->

Nach Anklicken von „Fill out the Information Form“ erscheint folgendes Registrierungsformular:

<!-- source:en p7 unit:48 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p007-figure-01.png)

<!-- source:en p7 unit:49 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p007-figure-02.png)

<!-- source:en p8 unit:50 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p008-figure-01.png)

<!-- source:en p8 unit:51 -->

#### 1.1.3 Zuständige Person für den Materialempfang angeben

<!-- source:en p8 unit:52 -->

Die „Empfangsstelle für Dokumentation“ ist die vom Unternehmen benannte Kontaktperson für Rockchip, die Software-, Hardware- und Plattformveröffentlichungen erhält. Laut Quellrichtlinie erhält jede juristische Person ein zentral verwaltetes, intern gemeinsam verwendetes Konto. Sichern Sie alle Materialien. Informieren Sie bei einem Wechsel der Kontaktperson den Rockchip-Geschäftskontakt rechtzeitig per E-Mail, damit die Daten aktualisiert und spätere Mitteilungen nicht verpasst werden. Empfohlen wird eine gemeinsame R&D-Teamadresse, etwa xxrd@xx.com, um Informationsverluste durch individuelle Weiterleitung, Projektverzögerungen oder Schäden zu vermeiden.

<!-- source:en p8 unit:53 -->

#### 1.1.4 SDK-Antragsformular bereitstellen

<!-- source:en p8 unit:54 -->

Sie können eine oder mehrere SDK-Versionen beantragen. Wegen der vielen Chips und Versionen siehe Abschnitt 2.1 oder die Liste unter https://redmine.rock-chips.com/projects/fae/documents. Geben Sie die für Ihr Projekt benötigten Versionsnummern an und senden Sie den Antrag von Ihrer geschäftlichen E-Mail-Adresse an den zuständigen Rockchip-Geschäftskontakt zur internen Registrierung. Folgende Angaben sind erforderlich:

<!-- source:en p9 unit:55 -->

| Rockchip-SDK-Antragsformular |  |
| --- | --- |
| Nr. | Zur Aktivierung beantragte SDK-Version |
| 1 |  |
| 2 |  |
| 3 |  |
| 4 |  |
| 5 |  |
| 6 |  |
| 7 |  |

<!-- source:en p9 unit:56 -->

#### 1.1.5 Öffentlichen Schlüssel erzeugen

<!-- source:en p9 unit:57 -->

Führen Sie unter Ubuntu folgenden Befehl in Ihrem Verzeichnis aus:

<!-- source:en p9 unit:58 -->

```text
xx@ubuntu:~$ cd ~
xx@ubuntu:~$ ssh-keygen -t rsa -C [user@rock-chips.com](mailto:user@rock-chips.com)
```

<!-- source:en p9 unit:59 -->

Zum Erzeugen des öffentlichen Schlüssels sieht die Quelle den obigen Befehl ohne Passworteingabe vor. user@rock-chips.com steht dabei für Ihre geschäftliche, nicht private E-Mail-Adresse. Anschließend werden die Schlüsseldateien in folgendem Verzeichnis erzeugt:

<!-- source:en p9 unit:60 -->

```text
xx@ubuntu:~$ ls -l .ssh/
total 12
-rw------- 1 rockchip rockchip 1675 Oct 31 2018 id_rsa
-rw-r--r-- 1 rockchip rockchip 403 Oct 31 2018 id_rsa.pub
```

<!-- source:en p9 unit:61 -->

Bewahren Sie den privaten Schlüssel id_rsa und das Passwort sicher auf. Reichen Sie nach der E-Mail „Rockchip-SDK Public Key Submission“ den öffentlichen Schlüssel id_rsa.pub gemäß Anleitung ein; siehe Abschnitt 1.1.6.

<!-- source:en p10 unit:62 -->

#### 1.1.6 Öffentlichen Schlüssel einreichen

<!-- source:en p10 unit:63 -->

Nach Abschluss der internen Abläufe durch den Rockchip-Geschäftskontakt sendet das System bei Bedarf „Rockchip-SDK Public Key Submission“. Ist der Unternehmensschlüssel bereits gespeichert, ist keine erneute Einreichung erforderlich und die E-Mail entfällt. Sie wird nur bei erstmaliger Zusammenarbeit ausgelöst, wenn noch kein öffentlicher Schlüssel registriert ist. Beispiel:

<!-- source:en p10 unit:64 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p010-figure-01.png)

<!-- source:en p10 unit:65 -->

Nach Anklicken von „SDK Kit Submission“ erscheint folgende Seite:

<!-- source:en p11 unit:66 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p011-figure-01.png)

<!-- source:en p11 unit:67 -->

Kopieren Sie den Inhalt der öffentlichen Unternehmensschlüsseldatei (*.pub) in das vorgesehene Feld und senden Sie ihn ab; siehe 1.1.5. Der Link gilt 7 Tage. Erfolgt keine rechtzeitige Einreichung, sendet das System „Rockchip-SDK Kit Submission Timeout“ mit einer Verlängerung um 24 Stunden. Wird auch diese Frist verpasst, muss ein neuer Link beantragt und aktiviert werden.

<!-- source:en p12 unit:68 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p012-figure-01.png)

<!-- source:en p12 unit:69 -->

#### 1.1.7 Öffentlichen Schlüssel sichern

<!-- source:en p12 unit:70 -->

Sichern Sie den Unternehmensschlüssel zuverlässig, damit ein Verlust die Codesynchronisierung mit Rockchip nicht verhindert.

<!-- source:en p12 unit:71 -->

```text
xx@ubuntu:~$ tar zcvf id_ras_backup.tag.gz ~/.ssh
```

<!-- source:en p12 unit:72 -->

#### 1.1.8 Öffentlichen Schlüssel ändern

<!-- source:en p12 unit:73 -->

Schützen Sie das erzeugte Schlüsselpaar. Es ist unabhängig von Serverwechseln oder anderen Systemänderungen, muss nicht häufig erneuert werden und beeinträchtigt die SDK-Synchronisierung nicht. Bei Verlust oder notwendigem Austausch kontaktieren Sie den Rockchip-Geschäftskontakt per E-Mail. Nach interner Prüfung und Freigabe sendet das System erneut den Einreichungslink. Beispiel:

<!-- source:en p13 unit:74 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p013-figure-01.png)

<!-- source:en p13 unit:75 -->

Der Link gilt 7 Tage; danach ist ein neuer Antrag erforderlich. Reichen Sie den neuen Schlüssel nach der Benachrichtigung möglichst bald ein. Nach erfolgreicher Übermittlung erscheint folgende Seite:

<!-- source:en p14 unit:76 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p014-figure-01.png)

<!-- source:en p14 unit:77 -->

Nach Ablage und Aktivierung des Schlüsselupdates sendet Rockchip „Rockchip - Public Key Update Successful“. Damit ist der neue Schlüssel wirksam. Beispiel:

<!-- source:en p15 unit:78 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p015-figure-01.png)

<!-- source:en p15 unit:79 -->

### 1.2 Zugriff auf das SDK erhalten

<!-- source:en p15 unit:80 -->

Im nächsten internen Verfahrensschritt erhalten Sie „Rockchip-SDK has been activated“:

<!-- source:en p16 unit:81 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p016-figure-01.png)

<!-- source:en p16 unit:82 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p016-figure-02.png)

<!-- source:en p17 unit:83 -->

Mit der Weiterentwicklung des SDK wachsen Funktionen, Sicherheitsniveau und Codeumfang. Es gibt zwei Bezugswege: direkt per sync vom Server den vollständigen Quellcode samt Basispaket synchronisieren; oder zuerst das Basispaket laden und anschließend per sync den vollständigen Code beziehen.

<!-- source:en p17 unit:84 -->

#### 1.2.1 Authentifizierung und Autorisierung — verpflichtend

<!-- source:en p17 unit:85 -->

Zum Schutz des Codeservers ist eine zusätzliche Prüfung der Downloadberechtigung vorgeschrieben. Beziehen Sie das Autorisierungsskript per git clone. Gerrit-Konto, E-Mail der Dokumentationskontaktperson und Name der privaten Schlüsseldatei werden manuell eingegeben. Schritte: a. Skript beziehen.

<!-- source:en p17 unit:86 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/script
```

<!-- source:en p17 unit:87 -->

b. Skript ausführen

<!-- source:en p17 unit:88 -->

```text
xx@ubuntu:~$ ./Generate-Credential.x
```

<!-- source:en p17 unit:89 -->

Wechseln Sie ins Skriptverzeichnis und starten Sie es. Geben Sie Gerrit-Konto, E-Mail der Materialkontaktperson und privaten Schlüsseldateinamen ein. Nach Schlüssel- und Kontoprüfung erhalten Sie Download- und Sync-Berechtigung.

<!-- source:en p17 unit:90 -->

```text
└── script
├── Generate-Credential.x
└── README.md
```

<!-- source:en p17 unit:91 -->

c. Beispielausführung des Skripts

<!-- source:en p17 unit:92 -->

```text
Please input your username (make sure to use the username exactly the same as the one in RK
email!!): Gerrit_Account
Please input your email (make sure to use the company email address!!): data_owner_email
Please input your SSH private key filename (e.g. id_rsa): id_rsa
```

<!-- source:en p17 unit:93 -->

Die folgende Ausgabe bedeutet eine erfolgreiche Skriptausführung.

<!-- source:en p18 unit:94 -->

```text
Your Credential check has passed
New git credential will be added into your history!!
You are All Set!!
```

<!-- source:en p18 unit:95 -->

Erscheint am Ende folgende Meldung, ist das Skript fehlgeschlagen. Prüfen Sie gemäß Abschnitt 5.1 Q&A die Konfiguration oder ob Sicherheitsgeräte Ihres Unternehmens das Downloadprotokoll SSH blockieren.

<!-- source:en p18 unit:96 -->

```text
Credential mismatch issue, please refer to the instruction documents attached to the
Rockchip-SDK Ready email to correctly configure the gerrit account and ssh key.
Do you want to retry (y/n)?
```

<!-- source:en p18 unit:97 -->

Bei erfolgreicher Autorisierung entstehen außerdem folgende zwei Dateien:

<!-- source:en p18 unit:98 -->

```text
└──~/.gitconfig # Contains Gerrit account information and configuration
└──~/.git-credentials # Contains the Gerrit account corresponding to the HTTPS download
authorization
```

<!-- source:en p18 unit:99 -->

Starten Sie das Skript nach Erhalt des Kontos mit dem privaten Schlüssel zum zuvor eingereichten öffentlichen Schlüssel: Datei id_rsa mit Berechtigung 600. Nach Bindung des lokalen Geräts sind Downloads möglich. Die Berechtigung ist an den lokalen Systembenutzer gebunden, der das Skript ausführt, und liegt in dessen Home-Verzeichnis. Werden ~/.gitconfig und ~/.git-credentials in das Home-Verzeichnis eines anderen Geräts oder Benutzers kopiert, sind auch dort direkte HTTPS-Downloads möglich. Prüfen Sie vor dem Download die Autorisierungsdateien im Home-Verzeichnis des aktuellen Benutzers. Erneute Ausführung erzeugt eine neue Berechtigung und macht die alte automatisch ungültig.

<!-- source:en p18 unit:100 -->

#### 1.2.2 Direkter Download und Synchronisierung vom Server

<!-- source:en p18 unit:101 -->

Die SDK-Aktivierungs-E-Mail enthält die Release-Dokumentation mit repo-Downloadadresse und Codesynchronisierungsverfahren. Das folgende Beispiel verwendet Rockchip_Android13_SDK_Developer_Guide_CN.pdf:

<!-- source:en p19 unit:102 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p019-figure-01.png)

<!-- source:en p19 unit:103 -->

Einzelheiten siehe 1.2.1 zur Autorisierungsprüfung.

<!-- source:en p19 unit:104 -->

#### 1.2.3 Verfahren zum Herunterladen des Basispakets

<!-- source:en p19 unit:105 -->

Das Basispaket enthält den anfänglichen Funktionscode, Entwicklungswerkzeuge, Dokumentation und Versionshistorien der Repositories. Manche SDKs überschreiten 100 GB; die Sync-Dauer hängt daher unvorhersehbar von der Netzgeschwindigkeit ab. Kopieren Sie zur Zeitersparnis zunächst das Basispaket und synchronisieren Sie danach, um den vollständigen Netzwerkdownload zu verkürzen. Das Paket ist nur die Ausgangsversion. Rockchip bietet drei Bezugswege. Wichtig: Das Basispaket enthält nicht das vollständige SDK; sync mit dem Rockchip-Server ist für die vollständige Version sowie Stabilität und Zuverlässigkeit erforderlich. a. FTP: Die firmenspezifischen Angaben umfassen Adresse, Verbindungsart, Port, Konto und Passwort. Wegen schwankender FTP-Geschwindigkeit und großer Android-SDKs werden auch die folgenden beiden Verfahren empfohlen. b. Kopieren vor Ort.

<!-- source:en p20 unit:106 -->

Der Vor-Ort-Reservierungslink gilt 7 Tage; danach ist ein neuer Antrag erforderlich. Laut Quelle gibt es SDK-Kopierdienste in Fuzhou, Shenzhen und Shanghai; wählen Sie den nächstgelegenen Standort. „On-site Download Reservation“ öffnet folgendes Fenster:

<!-- source:en p20 unit:107 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p020-figure-01.png)

<!-- source:en p20 unit:108 -->

Tragen Sie Name, Telefonnummer und E-Mail der Kontaktperson, Rockchip-Standort (Fuzhou, Shenzhen oder Shanghai) und Besuchszeit ein. Nach erfolgreicher Übermittlung erscheint folgende Bestätigung:

<!-- source:en p21 unit:109 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p021-figure-01.png)

<!-- source:en p21 unit:110 -->

Nach erfolgreicher Reservierung erhält die Kontaktperson „Rockchip-SDK On-site Download Reservation Information“. Beispiel:

<!-- source:en p22 unit:111 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p022-figure-01.png)

<!-- source:en p23 unit:113 -->

Erscheinen Sie nach der Mitteilung pünktlich am gewählten Ort mit einer großen externen Festplatte oder einem anderen USB-3.0-Speicher, der mit Rockchip-Rechnern kompatibel ist. Für mehrere SDKs werden mindestens 512 GB freier Platz empfohlen, um Kapazitätsengpässe zu vermeiden. Melden Sie Terminänderungen frühzeitig, damit Abstimmung und Projektzeitplan nicht beeinträchtigt werden. c. Datenträgerversand: Senden Sie gemäß „Mailing Hardware Method“ eine große externe Festplatte oder einen Speicher mit zwingender USB-3.0-Unterstützung ein. Für mehrere Versionen werden ebenfalls mindestens 512 GB freier Platz empfohlen. Laut beschriebenem Verfahren organisiert Rockchip nach Eingang den Rückversand per SF Express innerhalb eines Arbeitstags.

<!-- source:en p23 unit:114 -->

### 1.3 Download mit anschließender Serversynchronisierung

<!-- source:en p23 unit:115 -->

Ein vor Ort kopiertes oder per FTP geladenes SDK ist nur ein Basispaket. Für die vollständige Version ist ein Netzwerk-sync darauf erforderlich. Einzelheiten stehen in Rockchip_Android13_SDK_Developer_Guide_EN.pdf. Überblick:

<!-- source:en p23 unit:116 -->

#### 1.3.1 Dateiintegrität prüfen

<!-- source:en p23 unit:117 -->

SDK-Archive können bei FTP-Übertragung, Vor-Ort-Kopie oder Datenträgerversand beschädigt werden. Prüfen Sie nach dem Kopieren in die Entwicklungsumgebung die Integrität. Beispielsweise liegt zu Rockchip_Android13.0_SDK_RELEASE.tar.gz neben dem *.tar.gz-Paket eine separate MD5-Datei vor. Andere SDK-Versionen erhalten ihre Prüfsummen auf gleiche Weise.

<!-- source:en p23 unit:118 -->

```text
xx@ubuntu:~$ md5sum Rockchip_Android13.0_SDK_RELEASE.tar.gz*
cb37437acfdd4d10cbae1809ee37c91d  Rockchip_Android13.0_SDK_RELEASE.tar.gz00
7a446207302810dfe08e386c9018faed  Rockchip_Android13.0_SDK_RELEASE.tar.gz01
68a68fe3127f0a9b8a97727b2fd27106  Rockchip_Android13.0_SDK_RELEASE.tar.gz02
4a6b06b48709eb0357e3aa5b18ba63d4  Rockchip_Android13.0_SDK_RELEASE.tar.gz03
b24083f7c4d36bba730e421d2c0a444b  Rockchip_Android13.0_SDK_RELEASE.tar.gz04
362641e26f93c600f12ea21bd178dac9  Rockchip_Android13.0_SDK_RELEASE.tar.gz05
97d0ab6b7d9d523496544605eaedf6f2  Rockchip_Android13.0_SDK_RELEASE.tar.gz06
d8958db52f86982490b66732e6daf0ea  Rockchip_Android13.0_SDK_RELEASE.tar.gz07
7f65e490ef4541997dd21c559262ca1e  Rockchip_Android13.0_SDK_RELEASE.tar.gz08
942f811b75b58aacb73628a6e3a304a5  Rockchip_Android13.0_SDK_RELEASE.tar.gz09
8f742ea39960725d7f6d8660e6974b48  Rockchip_Android13.0_SDK_RELEASE.tar.gz10
4d4342750dc746dbe5e2b9fc93254eb7  Rockchip_Android13.0_SDK_RELEASE.tar.gz11
0c15e71f234fb242b0b494cf25382672  Rockchip_Android13.0_SDK_RELEASE.tar.gz12
921b93b045f9d1d71f308d8d9df4e3ca  Rockchip_Android13.0_SDK_RELEASE.tar.gz13
22c9261fa4e3700287c525ec25075691  Rockchip_Android13.0_SDK_RELEASE.tar.gz14
```

<!-- source:en p24 unit:119 -->

Vergleichen Sie md5sum mit dem Rockchip-Wert. Vollständige Übereinstimmung bedeutet ein intaktes Archiv; bei Abweichung erneut kopieren oder herunterladen.

<!-- source:en p24 unit:120 -->

#### 1.3.2 SDK aktualisieren

<!-- source:en p24 unit:121 -->

Das Rockchip SDK wird nach internen Tests und Abnahme veröffentlicht. Stabilität und Reife steigen durch weitere Iterationen; synchronisieren Sie deshalb regelmäßig mit dem Server, um neue Funktionen und Verbesserungen zu erhalten. Versionsangaben stehen in den Release Notes, beispielsweise Rockchip_Android13_SDK_Developer_Guide_CN.pdf. Sync-Verfahren und Fehlersuche siehe Abschnitt 5.4.

<!-- source:en p24 unit:122 -->

### 1.4 Hardwareunterlagen beziehen

<!-- source:en p24 unit:123 -->

Rockchip-Hardwareunterlagen und SDK KIT werden getrennt bereitgestellt. Der Antragsprozess für Hardwareunterlagen ist nachfolgend dargestellt.

<!-- source:en p24 unit:123f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p024-hardware-flow.png)

<!-- source:en p24 unit:125 -->

Hardwareunterlagen sind nach Chipplattform geordnet; Sie können eine oder mehrere Plattformen gleichzeitig beantragen. Sie umfassen Referenzdesigns für Stromversorgung, DDR-Vorlagen, Hardwareentwurfsrichtlinien und Funktionsreferenzen. Beachten Sie: a. Verwenden Sie die Stromverwaltungslösung des Referenzdesigns. b. Übernehmen Sie die passende DDR-Vorlage unverändert. c. Verwenden Sie Rockchips Liste wichtiger Komponenten einschließlich DDR, eMMC, Flash, WiFi/BT und Camera. d. Halten Sie die Unterlagen aktuell, da Rockchip sie weiter optimiert. Geplante Abweichungen müssen vorab mit dem Rockchip-Geschäftskontakt abgestimmt werden. Andernfalls kann das Technikteam möglicherweise keine stabile und wirksame Unterstützung leisten, was den Projektzeitplan gefährdet.

<!-- source:en p25 unit:126 -->

Aktualisierungen der Hardwareunterlagen stehen unter https://redmine.rock-chips.com/projects/fae/documents in der Referenzdesign-Versionsliste. Ist Ihre Version älter, beziehen Sie die aktuelle beim Rockchip-Dokumentationskontakt, um die Entwicklung zu erleichtern.

<!-- source:en p25 unit:127 -->

## 2. SDK-Versionen

<!-- source:en p25 unit:128 -->

Drei offizielle SDK-Bezugswege werden beschrieben: a. Interner Rockchip-Server — offizieller Antragsprozess erforderlich. b. Öffentliches GitHub-Repository — frei herunterladbar, kein Antrag nötig. c. Toybrick-Community — SDKs bestimmter Plattformen ebenfalls ohne Antrag.

<!-- source:en p25 unit:129 -->

### 2.1 Offizielle SDK-Versionen

<!-- source:en p25 unit:130 -->

Nachfolgend stehen die von Rockchip-Chips unterstützten Android-/Linux-Versionen, Produkttypen und Supportstufen. Hinweise: a. Versionsdetails: https://redmine.rock-chips.com/documents/54. b. Der Empfehlungsindex zeigt den Wartungsschwerpunkt zum Quellzeitpunkt; berücksichtigen Sie ihn bei der Auswahl. c. Zwei langfristig gepflegte Android-SDKs für Industrieprodukte: RK3399_ANDROID7.1-Industry-SDK_V1.0 und RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629. d. Android express enthält GMS und ist für Google-zertifizierte Nutzer mit MADA-Berechtigung vorgesehen. Beantragen Sie bei Bedarf express; die Standardversion enthält kein GMS. e. Chip-Suffixe anhand des Datenblatts prüfen: S — kleines Gehäuse; M — Automotive-Ausführung; J — Industrieausführung; K — erweiterter Temperaturbereich, beispielsweise -20°C bis 85°C oder -40°C bis 85°C gemäß Datenblatt.

<!-- source:en p26 unit:131 -->

-S bezeichnet einen SMIC-Wafer. f. SDKs für NAS, NVR, Displaycontroller, SoC-Arrays, Edge-Computing-Boxen und PCIe-Verbindungen: RK3588_Rockchip_Linux_SDK-SmartHub, RK3576_Rockchip_Linux_SDK-SmartHub, RK3568_Rockchip_Linux_SDK-SmartHub.

<!-- source:en p27 unit:132 -->

| Chip | SDK-Version (Quellkennung) | Empfehlung |
| --- | --- | --- |
| RK3588(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Android15.0(express-Version)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>Rockchip_Android14.0(express-Version)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Rockchip_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Android12_SDK_Release-Car</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_RKTTS_SDK</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_IPC_SDK_202205</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_QNX_AAOS12_SDK</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_EDGE_SDK_202206</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Linux_SDK-SmartHub</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_NVR_SDK_Release_V1.0.0_20220304</code> | <code>*</code> |
| RK3576(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>Rockchip_Android15.0(express-Version)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0(express-Version)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576_Android11_CloudDesk_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_Android9.0_SDK_Release</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_NVR_SDK</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rk3576_RKTTS_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_LINUX6.1_SDK</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>RK3576_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>Rockchip_Android15.0(express-Version)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>Rockchip_Android14.0(express-Version)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3566_ANDROID11.0_EBOOK_SDK_RELEASE_V1.0.0_20210126</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_ANDROID11_CLOUDDESK_SDK_202307</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_AMP_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_NVR_SDK_V1.4.0_20220611</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568_RK3566_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>RK3568_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>RK356X_STANDALONE_SDK_RELEASE_V1.0.0_20210713</code> | <code>*</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3562(J) | <code>RK3562_Android15.0(express-Version)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Android14.0(express-Version)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>*</code> |
| RK3562(J) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_RKTTS_SDK</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_LINUX5.10_SDK_V1.0.0_20230620</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3528(J/A) | <code>RK3528_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>*****</code> |
| RK3528(J/A) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>*</code> |
| RK3528(J/A) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3528(J/A) | <code>Rockchip_RK3528_Linux_SDK_20230410</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_Linux6.1_SDK</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_RT-Thread_SDK_Release</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3399(K) | <code>Rockchip_Android15.0(express-Version)</code> | <code>**</code> |
| RK3399(K) | <code>Rockchip_Android14.0(express-Version)</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>**</code> |
| RK3399(K) | <code>RK3399_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3399(K) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android9.0_SDK_V1.0_20190104</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android8.1_SDK_V1.00_20180517</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID7.1-Industry-SDK_V1.0</code> | <code>***</code> |
| RK3399(K) | <code>RK3399_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3399(K) | <code>RK3399_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3399PRO | <code>RK3399Pro_Android9.0_SDK_V1.00_20190806</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3328 | <code>RK3328_ANDROID11.0_BOX_SDK_V1.0.1_20201030</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID10.0-BOX_V1.0_20191125</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID9.0-BOX-SDK_V1.0_20181206</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID8.1-BOX-SDK_V1.0_20180319</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID7.1_BOX-SDK_v1.00_20170223</code> | <code>*</code> |
| RK3328 | <code>RK3328_linux_v1.00_20170419</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express-Version)</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android15.0_SDK(express-Version)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android14.0_SDK(express-Version)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express-Version)</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID10.0_SDK_20191211</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID9.0_SDK_20180925</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID8.1-TABLET-SDK_V1.0.0_20180505</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_RK3326_Linux6.1</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3308(J/M) | <code>RK3308_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3308(J/M) | <code>RK3308_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3308(J/M) | <code>RK3308_Linux_PartyBox_SDK</code> | <code>**</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3288(W/K) | <code>RK3288(W_Version)_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID10.0_SDK_Release</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288(W-Version)_Android9.0_SDK_V1.0_20190410</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID8.1_SDK_V1.0_20180508</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_LINUX5.10_SDK</code> | <code>**</code> |
| RK3229 | <code>RK3229_ANDROID10.0_BOX_SDK_V1.0_20200109</code> | <code>***</code> |
| RK3229 | <code>RK3229_ANDROID9.0_BOX_SDK_V1.0_2019012</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID8.1-BOX-SDK_V1.0_20180423</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID7.1_BOX-SDK_V1.00_20170831</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID6.0-RBOX-SDK_V1.00_20160831</code> | <code>*</code> |
| RK3229 | <code>RK3229_wireless_dongle_v1.00_20161130</code> | <code>**</code> |
| RK182X | <code>RK182X_AI_COPROCESSOR_SDK</code> | <code>*****</code> |
| RK182X | <code>RK182X_RT-THREAD_SDK</code> | <code>*****</code> |
| PX3SE | <code>PX3SE_LINUX_SDK_V0.2</code> | <code>**</code> |
| PX3SE | <code>PX3SE_ANDROID7.1_SDK_V1.00_20170719/td&gt;</code> | <code>**</code> |
| RK3128(H) | <code>RK3128H_ANDROID8.1-BOX-SDK_V1.0_20180601</code> | <code>***</code> |
| RK3128(H) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3128(H) | <code>RK3128_ANDROID7.1-BOX-SDK_V1.00_20170823</code> | <code>*</code> |
| RK3128(H) | <code>RK312X_LINUX5.10_SDK_RELEASE_202304</code> | <code>*</code> |
| RK3126(C) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>****</code> |
| RK3126(C) | <code>RK3126C_ANDROID9.0_SDK_V1.0_20190103</code> | <code>*</code> |
| RK3126(C) | <code>RK3126C_ANDROID8.1-SDK_V1.00_20180105</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3066 | <code>RK3066_ANDROID4.4.2-SDK_V1.00_2014.02.12</code> | <code>*</code> |
| RK3036 | <code>RK3036_wireless_dongle_v1.00_20161130</code> | <code>*</code> |
| RK3036 | <code>RK3036_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK2118(M) | <code>RK2118_RT-Thread_SDK</code> | <code>*****</code> |
| RK2116(M) | <code>RK2116_RT-Thread_SDK</code> | <code>*****</code> |
| RK2108 | <code>RK2108_RT-THEAD_SDK_V1.0.0_20200812</code> | <code>*</code> |
| RK2106 | <code>RK2106_FreeRTOS_BETA_V0.1_20181229</code> | <code>**</code> |
| RV1126B(P) | <code>RV1126B_Linux6.1_SDK</code> | <code>*****</code> |
| RV1126B(P) | <code>RV1126B_Linux_IPC_SDK-IPC, CVR</code> | <code>*****</code> |
| RV(K)1108 | <code>RV1108_LINUX_SDK_V2.1_20190329</code> | <code>*</code> |
| RV(K)1108 | <code>RV1108_CVR_V1.4_20180604</code> | <code>*</code> |
| RV(K)1108 | <code>RV110X_LINUX_IPC_SDK_V1.2_20170607</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_IPC_LINUX_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106B_RV1103B_LINUX_IPC_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_CVR_SDK-CVR</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_SMART_DOOR_LINUX_SDK</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1103_SCANER_LINUX_SDK_V0.0.1_20220915</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_Battery_IPC_Doorbell-电池IPC和⻔铃</code> | <code>*</code> |
| RKNanoD | <code>RKNANOD_MP3_SDK_V1.3_20161102</code> | <code>***</code> |
| RKNanoD | <code>RKNANOD_WIRELESS_AUDIO_SDK_V1.6_201611149</code> | <code>*</code> |
| RK628 | <code>RK628(Drittanbieter)</code> | <code>**</code> |
| SOFIA3GR | <code>SOFIA3GR_Android6.0-SDK_20160428</code> | <code>*</code> |
| SOFIA3GR | <code>SoFIA_3G-R_ANDROID5.1-SDK行⻋记录仪</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Phone_Android4.4-SDK(nicht mehr aktualisiert)</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Watch_Android4.4-SDK_20151015(nicht mehr aktualisiert)</code> | <code>*</code> |

<!-- source:en p32 unit:142 -->

### 2.2 Öffentliche Unterlagen

<!-- source:en p32 unit:143 -->

Rockchip stellt detaillierte Unterlagen unter https://opensource.rock-chips.com/wiki_Main_Page offen bereit. Genannt werden RK3568, RK3399, RK3288, RK3328 und PX30.

<!-- source:en p33 unit:144 -->

### 2.3 Open-Source-Community

<!-- source:en p33 unit:145 -->

Die KI-orientierte ToyBrick-Community bietet eine effiziente, komfortable und stabile Entwicklungsumgebung für schnelle Anwendungseinführung und Bereitstellung industrieller KI-Produkte. Unterstützt werden RK3588, RK3399PRO, RK1808, RK3568 und weitere Lösungen. Angeboten werden Platinenbezugswege, Android-/Linux-SDKs, vollständige Hardwareunterlagen, Softwareentwicklungsdokumente und Werkzeuge. Einzelheiten: http://t.rock-chips.com/forum.php. Fragen zu ToyBrick-Platinen gehören direkt in https://t.rock-chips.com/forum.php, nicht nach Redmine unter https://redmine.rock-chips.com. In Sonderfällen hilft der Rockchip-Geschäftskontakt bei der Koordination.

<!-- source:en p33 unit:146 -->

### 2.4 Patchveröffentlichung

<!-- source:en p33 unit:147 -->

Rockchip-Plattformpatches: https://redmine.rock-chips.com/projects/rockchip_patch/issues. Entscheiden Sie anhand des jeweiligen Patches und Ihres Projekts über die Anwendung.

<!-- source:en p33 unit:148 -->

## 3. Dokumentation und Werkzeuge

<!-- source:en p33 unit:149 -->

Rockchip-Dokumente und Werkzeuge werden synchron zum SDK veröffentlicht. Die zwei Hauptsysteme sind Android OS und Linux OS; Ablagepfade unterscheiden sich etwas, daher die jeweilige SDK-Verzeichnisstruktur prüfen.

<!-- source:en p33 unit:150 -->

### 3.1 Android SDK

<!-- source:en p33 unit:151 -->

Im Android-OS-SDK liegen Dokumente unter RKDocs und Werkzeuge unter RKTools im SDK-Wurzelverzeichnis.

<!-- source:en p34 unit:152 -->

### 3.2 Linux SDK

<!-- source:en p34 unit:153 -->

Im Linux-OS-SDK liegen Dokumente unter docs und Werkzeuge unter tools im SDK-Wurzelverzeichnis. Mit jedem Codeupdate werden sie in die entsprechenden SDK-Versionen integriert. Der Umfang kann zwischen Versionen variieren; verwenden Sie deshalb genau passende Werkzeuge. Nicht zusammenpassende Code- und Werkzeugversionen können Flash- oder Systemstartfehler verursachen und die Entwicklung erheblich behindern.

<!-- source:en p34 unit:158 -->

## 5. Fragen und Antworten

<!-- source:en p34 unit:159 -->

Dieser Abschnitt behandelt häufige Probleme beim Beantragen und Verwenden des Rockchip SDK.

<!-- source:en p35 unit:160 -->

### 5.1 SDK-Verwaltung

<!-- source:en p35 unit:161 -->

Für jedes SDK-Basispaket ist eine separate Synchronisierungsberechtigung zu beantragen. Nicht autorisierte Konten können nicht per Repo mit Rockchip synchronisieren. Das konkrete Verfahren steht in der Release-Dokumentation des Basispakets.

<!-- source:en p35 unit:161cn -->

Ergänzung aus der chinesischen Quelle: Bewahren und verwalten Sie das Rockchip SDK sorgfältig. Ersatzkopien werden nicht automatisch bereitgestellt; beantragen Sie verlorene Materialien erneut über den Geschäftskontakt.

<!-- source:en p35 unit:162 -->

### 5.2 SDK-Code aktualisieren

<!-- source:en p35 unit:163 -->

#### 5.2.1 SDK synchronisieren

<!-- source:en p35 unit:164 -->

Für jedes Basispaket ist das Synchronisierungsrecht separat zu beantragen; andernfalls kann repo den Code nicht vom Rockchip-Server aktualisieren. Das Verfahren steht in den mitgelieferten Release Notes.

<!-- source:en p35 unit:165 -->

#### 5.2.2 SDKs mehrerer Plattformen beantragen

<!-- source:en p35 unit:166 -->

SDKs verschiedener Rockchip-Chipplattformen werden separat beantragt. Besteht etwa Zugriff auf RK3288 und wird später RK3399 benötigt, unterstützt der Geschäftskontakt den Antrag für die neue Plattform. Nach Freigabe stellt das Technikteam die Materialien bereit.

<!-- source:en p35 unit:167 -->

### 5.3 Versionsverwaltung

<!-- source:en p35 unit:168 -->

Rockchip verwaltet SDK-Code mit repo nach Googles Verfahren. Die repo-/git-Historie sollte nicht gelöscht werden, da dies Updates und Support erschwert. Falls aus historischen Gründen die Ursprungshistorie entfernt und ein eigenes git oder svn verwendet werden muss, kann folgendes Verfahren dienen.

<!-- source:en p35 unit:169 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p035-version-control.png)

<!-- source:en p35 unit:170 -->

Empfohlen sind zwei getrennte Umgebungen: ein Zwischenspeicher-/Staging-Server und ein Server für die tägliche Entwicklung. Der Staging-Server synchronisiert mit Rockchip und überträgt Änderungen zum lokalen Entwicklungsserver; zugleich dient er als Versionsreferenz gegenüber Rockchip. Der Entwicklungsserver lässt sich projektbezogen anpassen. Vorteil: Das Rockchip-Technikteam kann bei der Fehlersuche die Codeversion genau bestimmen.

<!-- source:en p36 unit:171 -->

So können auch Entwicklungsserver ohne direkten Netzwerkzugang synchronisiert werden: Updates werden über den Staging-Server übertragen und halten den Entwicklungsstand konsistent.

<!-- source:en p36 unit:172 -->

### 5.4 SDK-Synchronisierungsfehler behandeln

<!-- source:en p36 unit:173 -->

#### 5.4.1 Prüfungen vor der SDK-Synchronisierung

<!-- source:en p36 unit:174 -->

Prüfen Sie vor der Synchronisierung die Umgebung. a. SSH-Dateien: Unter ~/.ssh/ müssen id_rsa (privater Schlüssel), id_rsa.pub (öffentlicher Schlüssel) und known_hosts (beim ersten SSH-Verbindungsaufbau erzeugt) liegen. Prüfung:

<!-- source:en p36 unit:175 -->

```text
xx@ubuntu:~$ ls -l ~/.ssh/
-rw------- 1 xx xx  1675 Apr 9 08:40 id_rsa
-rw-r--r-- 1 xx xx 400 Apr 9 08:40 id_rsa.pub
-rw-r--r-- 1 xx xx  2220 Apr 9 08:40 known_hosts
```

<!-- source:en p36 unit:176 -->

b. Schlüsselbegrenzung: Die Quelle setzt höchstens einen Schlüssel in .ssh voraus. Bei mehreren Schlüsseln verwenden Sie key-chain gemäß Release-Anleitung. c. Private Schlüsselrechte: id_rsa muss 600 haben. Andernfalls:

<!-- source:en p36 unit:177 -->

```text
xx@ubuntu:~$ chmod 600  ~/.ssh/id_rsa
```

<!-- source:en p36 unit:178 -->

d. Netzwerkprüfung — Ping und Portverfügbarkeit:

<!-- source:en p36 unit:179 -->

```text
`Non-chinese mainland customers`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
```

<!-- source:en p37 unit:180 -->

```text
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.

`Chinese mainland customers`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
```

<!-- source:en p37 unit:181 -->

Keine Antwort deutet auf einen gesperrten Port hin. Lassen Sie die IT-Abteilung mögliche Netzwerksperren prüfen. e. Schlüsselpaar prüfen: Erzeugen Sie mit folgendem Befehl einen öffentlichen Vergleichsschlüssel:

<!-- source:en p37 unit:182 -->

```text
xx@ubuntu:~$ ssh-keygen -y -f id_rsa > id_rsa.pub.tobecompared
```

<!-- source:en p37 unit:183 -->

Vergleichen Sie danach id_rsa.pub.tobecompare mit id_rsa.pub, ohne die E-Mail am Ende. Stimmen sie nicht überein, bilden die Schlüssel kein Paar und müssen neu erzeugt werden. f. SSH-Test: Entnehmen Sie die SDK-Adresse den Release Notes. Bei repo init --repo-url https://gerrit.rock-chips.com testen Sie mit folgendem SSH-Befehl:

<!-- source:en p37 unit:184 -->

```text
xx@ubuntu:~$ ssh -vT Gerrit_account@gerrit.rock-chips.com –p 8222
```

<!-- source:en p37 unit:185 -->

Folgender Testbefehl:

<!-- source:en p37 unit:186 -->

```text
xx@ubuntu:~$ ssh -vT xxx@gerrit.rock-chips.com -p 8222
OpenssH_7.4p1, OpenSSL 1.0.2k-fips 26 Jan 2017
debug1: Reading configuration data /home/gerrit/ .ssh/config
debug1: /home/gerrit/.ssh/config line 11: Applying options for gerrit.rock-chips.com
debug1: Reading configuration data /etc/ssh/ssh_config
debug1 /etc/ssh/ssh_config line 58: Applying options for *
debug1: Connecting to gerrit.rock-chips.com [***] port 8222
debug1: Connection established.
...
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey
```

<!-- source:en p38 unit:187 -->

```text
debug1: Next authentication method: publickey
debug1: Trying private key:/home/gerrit.ssh/id_rsa
debug1: Authentication **
succeeded** (publickey).
Authenticated to gerrit.rock-chips.com_([xxxx]:8222).debugi: channel e: new [client-session]
debug1: Entering interactive session.
debug1: pledge: network debugi: Sending environment.
debug1: Sending env LANG = en_us.UTF-8

   ****welcome to Gerrit code Review****

 Hi xxx, you have **successfully connected** over SSH.
 Unfortunately, interactive shells are disabled.
 To clone a hosted Git repository, use:

 git clone ssh: / /xxx@gerrit.rock-chips.com:29418/REPOSITORY_NANE.git

debug1: channel 0: free: client-session, nchannels 1
Connection to gerrit.rock-chips.com closed by remote host.
Transferred: sent 2484,received 1904 bytes, in 50.0 seconds
Bytes per second: sent 49.6,received 38.0
debugl: Exit status_-l
```

<!-- source:en p38 unit:188 -->

Bei „Are you sure you want to continue connecting (yes/no)?“ sieht die Quelle die Eingabe yes vor. successfully connected bestätigt die SSH-Verbindung. Fehler können von PC-/Servereinstellungen oder Sicherheitsgeräten verursacht werden. Testen Sie einen anderen Rechner oder einen Hotspot. Virtuelle Maschinen mit Bridged Networking haben häufig SSH-Probleme. g. Prüfen Sie ~/.ssh/config und folgenden Inhalt:

<!-- source:en p38 unit:189 -->

```text
xx@ubuntu:~$ cat ~/.ssh/config
Host gerrit.rock-chips.com
 HostName gerrit.rock-chips.com
 User **Gerrit account**
 Port 8222
 IdentityFile ~/.ssh/**private key file name**
 PreferredAuthentications publickey
 StrictHostKeyChecking no
 UserKnownHostsFile ~/.ssh/known_hosts
 PubKeyAcceptedKeyTypes +ssh-rsa
```

<!-- source:en p38 unit:190 -->

Fehlt die Datei, erstellen Sie sie manuell und setzen Sie passende Berechtigungen.

<!-- source:en p39 unit:191 -->

```text
xx@ubuntu:~$ ls -l  ~/.ssh/config
-rw-r--r-- 1 xx xx 220 Nov 28 18:43 config
```

<!-- source:en p39 unit:192 -->

h. Beginnen Sie nach der Umgebungsprüfung die Synchronisierung gemäß SDK-Release-Notes.

<!-- source:en p39 unit:193 -->

#### 5.4.2 SDK-Synchronisierungsfehler und Lösungen

<!-- source:en p39 unit:194 -->

Nachfolgend typische Fehler und Lösungen. a. Falsche Python-Version. Beispielprotokoll:

<!-- source:en p39 unit:195 -->

```text
Traceback (most recent call last):
File "/root/repo/main.py", line 628, in <module>
_Main(sys.argv[1:])
File "/root/repo/main.py", line 602, in _Main
result = run()
File "/root/repo/main.py", line 595, in <lambda>
run = lambda: repo._Run(name, gopts, argv) or 0
File "/root/repo/main.py", line 264, in _Run
result = cmd.Execute(copts, cargs)
File "/root/repo/subcmds/init.py", line 531, in Execute
self._SyncManifest(opt)
File "/root/repo/subcmds/init.py", line 324, in _SyncManifest
clone_filter=opt.clone_filter):
File "/root/repo/project.py", line 1144, in Sync_NetworkHalf
clone_filter=clone_filter, retry_fetches=retry_fetches):
File "/root/repo/project.py", line 2139, in _RemoteFetch
ret = gitcmd.Wait()
File "/root/repo/git_command.py", line 379, in Wait
rc = self._CaptureOutput()
File "/root/repo/git_command.py", line 407, in _CaptureOutput
s.dest.write(buf)
UnicodeEncodeError: 'ascii' codec can't encode characters in position 8-12: ordinal not in
range(128)
Or
Traceback (most recent call last):Start related error
```

<!-- source:en p39 unit:196 -->

Lösung: Wechseln Sie zur empfohlenen Python-Version 3.10.x oder neuer; bei Python 2 verwenden Sie

<!-- source:en p39 unit:197 -->

2.7.11 oder neuer. Die folgenden Schritte vermeiden Versionsprobleme von repo oder der Python-Umgebung.

<!-- source:en p40 unit:198 -->

```text
xx@ubuntu:~$ ./Gerrit_Account (Gerrit Account naming script).x (Make sure authorization
script has been run and the authorization file has been generated according to the
"Authentication and Authorization Mode (Mandatory)" chapter of this document.)
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo (tag
v2.18)
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c (Call just downloaded repo tool to resynchronize)
```

<!-- source:en p40 unit:199 -->

b. Beim Erzeugen des Schlüssels wurde ein Passwort gesetzt. Beispielprotokoll:

<!-- source:en p40 unit:200 -->

```text
Enter passphrase for key '/home/junyikeji/.ssh/id_rsa':
```

<!-- source:en p40 unit:201 -->

Lösung: Empfohlen wird zentrale Schlüsselverwaltung mit keychain; alternativ beschreibt die Quelle das Zurücksetzen der privaten Schlüsselpassphrase auf leer:

<!-- source:en p40 unit:202 -->

```text
xx@ubuntu:~$ ssh-keygen -f ~/.ssh/id_rsa –p
```

<!-- source:en p40 unit:203 -->

c. SDK-Berechtigungsproblem. Beispielprotokoll:

<!-- source:en p40 unit:204 -->

```text
Get ssh://git@ww.rockchip.com,cn:2222/Android s/rk3588-manifests.git
fatal: Could not read from remote repos itory.

please make sure you have the correct access rights
and the repository exists.
```

<!-- source:en p40 unit:205 -->

Lösung: Prüfen Sie die Berechtigung für das betreffende SDK. d. Git-Konfigurationsfehler. Beispielprotokoll:

<!-- source:en p40 unit:206 -->

```text
Please tell me who you are.
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
to set your account's default identity.
```

<!-- source:en p40 unit:207 -->

Lösung: Globale Git-Benutzerdaten konfigurieren oder .gitconfig erstellen:

<!-- source:en p41 unit:208 -->

```text
xx@ubuntu:~$ vi ~/.gitconfig
[color]
•       ui = true
[user]
•       name = xxx(fill in your name)
•       email = yyy(fill in your email)
```

<!-- source:en p41 unit:209 -->

e. Unterrepository-Synchronisierung fehlgeschlagen oder Referenz beschädigt. Beispielprotokoll:

<!-- source:en p41 unit:210 -->

```text
From ssh://www.rockchip.com.cn/repo/android/RKTools
[new branch] android-5.1 -> rk/android-5.1
[new branch] remotes/rk/rk3288/mid/android-5.1 -> rk/remotes/rk/rk3288/mid/android-5.1
[new branch] rk3036/wireless_dongle/5.1/develop -> rk/rk3036/wireless_dongle/5.1/develop
error: 'refs/remotes/rk/rk312x' exists; cannot create 'refs/remotes/rk/rk312x/mid/android-
5.1'
! [new branch] rk312x/mid/android-5.1 -> rk/rk312x/mid/android-5.1 (unable to update local
ref)
error: unable to resolve reference refs/remotes/rk/rk322x/box/android-5.1: Not a directory
! [new branch] rk322x/box/android-5.1 -> rk/rk322x/box/android-5.1 (unable to update local
ref)
error: 'refs/remotes/rk/rk3288' exists; cannot create 'refs/remotes/rk/rk3288/mid/android-
5.1'
```

<!-- source:en p41 unit:211 -->

Quelllösung: Das fehlerhafte Unterrepository-Verzeichnis löschen und erneut synchronisieren:

<!-- source:en p41 unit:212 -->

```text
xx@ubuntu:~$ rm -rf RKTools
xx@ubuntu:~$ .repo/repo/repo sync
```

<!-- source:en p41 unit:213 -->

Bei einem Checkout-Fehler beschreibt die Quelle alternativ das Löschen der zugehörigen Spiegel- und Arbeitsrepositorypfade an den folgenden drei Orten und anschließendes Synchronisieren. Solche Fehler entstehen oft nach manuellem Sync-Abbruch und beschädigten lokalen Daten.

<!-- source:en p41 unit:214 -->

```text
xx@ubuntu:~$ rm -rf .repo/project-objects/(sub-repository)
xx@ubuntu:~$ rm -rf .repo/projects/(sub-repository)
xx@ubuntu:~$ rm -rf ./(sub-repository)
```

<!-- source:en p41 unit:215 -->

f. Fehlerhafte Locale-Einstellung. Beispielprotokoll:

<!-- source:en p42 unit:216 -->

```text
projects: 50% (235/469) perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
LANGUAGE = (unset),
LC_ALL = (unset),
LC_PAPER = "zh_CN.UTF-8",
LC_ADDRESS = "zh_CN.UTF-8",
LC_MONETARY = "zh_CN.UTF-8",
LC_NUMERIC = "zh_CN.UTF-8",
LC_TELEPHONE = "zh_CN.UTF-8",
LC_IDENTIFICATION = "zh_CN.UTF-8",
LC_MEASUREMENT = "zh_CN.UTF-8",
LC_TIME = "zh_CN.UTF-8",
LC_NAME = "zh_CN.UTF-8",
LANG = "en_US.UTF-8"
are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
```

<!-- source:en p42 unit:217 -->

Lösung: Folgendes am Ende von .bashrc ergänzen und die Konfiguration laden:

<!-- source:en p42 unit:218 -->

```text
xx@ubuntu:~$ vi ~/.bashrc
export LC_ALL=C
```

<!-- source:en p42 unit:219 -->

Speichern und ausführen:

<!-- source:en p42 unit:220 -->

```text
xx@ubuntu:~$ source ~/.bashrc
```

<!-- source:en p42 unit:221 -->

g. GitError: force-sync erforderlich. Beispielprotokoll:

<!-- source:en p42 unit:222 -->

```text
GitError: --force-sync not enabled; cannot overwrite a local work tree. If you're
comfortable with the possibility of losing the work tree's git metadata, use `repo sync --
force-sync frameworks/native` to proceed.
```

<!-- source:en p42 unit:223 -->

Quelllösung: repo v2.18 verwenden und erneut synchronisieren.

<!-- source:en p42 unit:224 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo (Download
the tag v2.18 repo tool under your local home directory)
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync(Call just downloaded repo tool to
resynchronize)
```

<!-- source:en p43 unit:225 -->

h. fetch fehlgeschlagen. Beispielprotokoll:

<!-- source:en p43 unit:226 -->

```text
Fetching projects: 99% (477/481) Fetching projectplatform/external/libusb-compat
Fetching project platform/external/libseccomp-helper
error: Cannot fetch android/rk/u-boot
```

<!-- source:en p43 unit:227 -->

Lösung: repo v2.18 und korrekte Zugriffsrechte prüfen.

<!-- source:en p43 unit:228 -->

```text
xx@ubuntu:~$ git clone "https://gerrit.rock-chips.com:8443/repo-release/tools/repo"
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync(Call just downloaded repo tool to
resynchronize)
```

<!-- source:en p43 unit:229 -->

i. Fehler bei Verwendung von sudo. Beispielprotokoll:

<!-- source:en p43 unit:230 -->

```text
xx@ubuntu:~$ sudo .repo/repo/repo sync -c
xx: Permission dented (publickey).
fatal: could not read from remote repository.
Please make sure you have the correct access rights and the repository exists.
Caborted by user
```

<!-- source:en p43 unit:231 -->

Lösung: repo als derselbe Benutzer ausführen, der das Autorisierungsskript gestartet hat; kein sudo verwenden.

<!-- source:en p43 unit:232 -->

```text
xx@ubuntu:~$ .repo/repo/repo sync -c
```

<!-- source:en p43 unit:233 -->

j. HTTPS-Downloadfehler. Beispielprotokoll:

<!-- source:en p43 unit:234 -->

```text
gnutls_handshake() failed: An unexpected TLS packet was received
Or
gnutls_handshake() failed: Start related error
```

<!-- source:en p43 unit:235 -->

Lösung: Die Systemkomponenten git, curl und gnutls aktualisieren.

<!-- source:en p44 unit:236 -->

```text
xx@ubuntu:~$ sudo apt-get update
xx@ubuntu:~$ sudo apt upgrade git -y
xx@ubuntu:~$ sudo apt upgrade curl -y
```

<!-- source:en p44 unit:237 -->

Besteht der Fehler nach Aktualisierung und Neuinstallation der Abhängigkeiten weiter, verwenden Sie eine der folgenden Möglichkeiten. Empfohlen wird Ubuntu 20 oder neuer für Android- und Linux-SDK-Builds. Alternativ per SSH herunterladen, wie nachfolgend gezeigt:

<!-- source:en p44 unit:238 -->

```text
xx@ubuntu:~$repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m
Android14.xml

update:

xx@ubuntu:~$ repo init --repo-url ssh://username@gerrit.rock-chips.com:8222/repo-
release/tools/repo
-u ssh://username@gerrit.rock-chips.com:8222/Android_U/manifests -b master -m
Android14.xml
```

<!-- source:en p44 unit:239 -->

Nicht behandelte Probleme melden Sie unter https://redmine.rock-chips.com/ an Rockchip. Das Team unterstützt bei der Lösung; lokale Netzwerkursachen von Verbindungsfehlern müssen Nutzer selbst beheben.

{% endraw %}
