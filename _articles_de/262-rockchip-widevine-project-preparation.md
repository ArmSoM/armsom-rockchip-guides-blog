---
title: "Rockchip Android Widevine: L1-Projektvorbereitung und Keybox-Ablauf"
description: "Rockchip Android Widevine: L1-Projektvorbereitung und Keybox-Ablauf — Android / Rockchip"
excerpt: "Rockchip Android Widevine: L1-Projektvorbereitung und Keybox-Ablauf — Android / Rockchip"
translation_key: "262-rockchip-widevine-project-preparation"
slug: "262-rockchip-widevine-project-preparation"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Plattformreferenz für ArmSoM-Entwickler. Quelle: cover V1.0 / revision table V2.0. Vor der Verwendung müssen SoC, Android SDK/BSP, Kernelkonfiguration und Herstellerwerkzeuge zur Platine passen. Die Quelle bestätigt keine bestimmte ArmSoM-Platine oder Kernelversion. Es wurden keine ArmSoM-Hardwaretests durchgeführt; Beispiele und Bilder stammen aus der Quelle.

## Version und Geltungsbereich

Dies ist eine historische Anleitung zum Start eines Rockchip-Android-Widevine-Projekts. Das Deckblatt nennt V1.0, die Änderungstabelle V2.0 mit zusätzlichen Keybox-Antragsinformationen. Beide Angaben bleiben nachvollziehbar; der vollständige technische Text wird verwendet. Bestimmte SoCs, SDK-Ausgaben oder Kernelversionen sind nicht angegeben. L1 benötigt TrustZone und ein passendes Widevine-L1-Android-SDK. Daraus ergeben sich keine Aussagen zu heutigen Lizenzbedingungen, Portalfunktionen, Zertifizierungen oder zur Eignung von ArmSoM-Produkten. Es liegt nur die chinesische PDF vor; ihre teilweise englisch beschrifteten Diagramme werden in allen Sprachen verwendet.

## 1 Überblick

### 1.1 Widevine

Die Quelle beschreibt Widevine als Google-DRM-Funktion, die nach Android 3.0 eingeführt wurde. Die [Widevine-Website](https://www.widevine.com/) stellt Produkt-, Technik-, Dokumentations-, Keybox- und Supportinformationen bereit. Die Quelle unterscheidet drei Sicherheitsstufen.

| Stufe | Sicherer Bootloader | Schlüsselbereitstellung | Sicherheitshardware / TEE | Keybox- und Videoschlüsselverarbeitung | Videopfad |
|---|---|---|---|---|---|
| L1 | Ja | Werk | Ja | Schlüssel nie im Klartext für Host-CPU sichtbar | Hardwaregeschützter Videopfad |
| L2 | Ja | Werk | Ja | Schlüssel nie im Klartext für Host-CPU sichtbar | Klartext-Videoströme zum Renderer |
| L3 | Ja | Im Feld | Nein | Klartextschlüssel für Host-CPU sichtbar | Klartext-Videoströme zum Decoder |

![Originaltabelle der Sicherheitsstufen](/docs/rockchip-widevine-project-preparation/images/p004-01.png)

*Originaltabelle der Sicherheitsstufen — Originalabbildung aus der chinesischen PDF, p. 4.*

Wegen geringer Nachfrage nach L2 nennt die Anleitung hauptsächlich L1 und L3. L3 bietet grundlegenden Schutz für Inhalte und Keybox ohne besondere Chip- oder Lösungsanforderungen, wenn der Inhaltsanbieter keine besonderen Vorgaben macht. L1 nutzt Rockchip TrustZone zum Hardwareschutz von Keybox, Ver- und Entschlüsselungsschlüsseln sowie entschlüsselten Datenströmen. Dies gilt für Anbieter, die TrustZone und einen Secure Video Path ausdrücklich verlangen.

### 1.2 Widevine-Ablauf

![Ablauf für Provisioning, Inhalte und Lizenzen](/docs/rockchip-widevine-project-preparation/images/p005-01.png)

*Ablauf für Provisioning, Inhalte und Lizenzen — Originalabbildung aus der chinesischen PDF, p. 5.*

1. Der Verschlüsselungsserver verschlüsselt Klartextinhalte und legt sie in der Inhaltsbibliothek ab. Ein normaler HTTP-Server liefert die verschlüsselten Inhalte an Clients.
2. Der Provisioning Server verteilt ein eindeutiges Gerätezertifikat. Die Quelle bezeichnet diesen Schritt als optional zur Verbesserung der Sicherheit. Das Gerät verwendet die Keybox als Vertrauensanker, um das Zertifikat zu erhalten. Die Anwendung nutzt für Lizenzanfragen ein RSA-signiertes Zertifikat statt der Keybox selbst.
3. Der Client fordert eine Lizenz beim Licence Server an. Nach Geräteprüfung liefert dieser eine signierte und verschlüsselte Lizenz. Erst danach darf das Gerät auf die DRM-Inhalte zugreifen.

## 2 Widevine-L1-Entwicklung

### 2.1 Projektbeziehungen

![Beziehungen zwischen Google, Rockchip und Gerätehersteller](/docs/rockchip-widevine-project-preparation/images/p006-01.png)

*Beziehungen zwischen Google, Rockchip und Gerätehersteller — Originalabbildung aus der chinesischen PDF, p. 6.*

Das Diagramm ordnet Google die Keybox und Rockchip SDK sowie Widevine-Patches zu; der Gerätehersteller integriert beides.

### 2.2 Entwicklungsablauf

![L1-Projektablauf](/docs/rockchip-widevine-project-preparation/images/p007-01.png)

*L1-Projektablauf — Originalabbildung aus der chinesischen PDF, p. 7.*

1. Wählen Sie eine Rockchip-Plattform; L1 setzt TrustZone voraus.
2. Beziehen Sie ein Rockchip-Android-SDK mit Widevine-L1-Unterstützung.
3. Stellen Sie die Geschäftsbeziehung zu Widevine her und beantragen Sie das CDM-Plug-in.
4. Beantragen Sie für Level 1 eine Keybox.
5. Beziehen Sie die zugehörigen Rockchip-Patches.
6. Integrieren Sie Level-1-Patches und Widevine CDM Client in das SDK.
7. Entwickeln und testen Sie.
8. Schreiben Sie die Keybox in der Werksproduktion.

### 2.3 Keybox-Antrag

![Ablauf für Keybox-Antrag und Produktion](/docs/rockchip-widevine-project-preparation/images/p008-01.png)

*Ablauf für Keybox-Antrag und Produktion — Originalabbildung aus der chinesischen PDF, p. 8.*

Blaue Kästen im Original markieren OEM-Aufgaben:

1. Google-Konto mit der Firmen-E-Mail anlegen.
2. PGP-Schlüssel erstellen; die Quelle nennt einen 2048-bit RSA cipher key.
3. Bei Integration Platform registrieren.
4. Anmelden.
5. Gerät hinzufügen.
6. Model, Make und weitere Angaben für die Google-Whitelist eintragen.
7. DeviceId manuell erzeugen und hochladen.
8. Die Plattform erzeugt daraus die Keybox.
9. Keybox herunterladen und prüfen.
10. Widevine Level 1 am Gerät testen.
11. Level-1/2-Geräte mit programmierter Keybox in Serie ausliefern.

## 3 FAQ

### 3.1 Widevine_DRM_Getting_Started

Bei einem Widevine-L1-Antrag stellt Google normalerweise das Getting-Started-Dokument bereit. Die Quelle fasst folgende Punkte zusammen:

1. Widevine CDM Client beantragen, das Android-Integrations-Plug-in. Unterschiedliche Android-Versionen verwenden unterschiedliche Plug-ins.
2. Organisationsbezogene Zugangsdaten beantragen. Widevine Cloud License Services setzt solche Zugangsdaten voraus; laut Quelle wird ein Schlüssel im Ablauf mit Zertifikaten verknüpft.
3. Bei Android-Produkten mit Widevine hängt die Anmeldung von der endgültigen Anwendung ab; serverseitige Freigabelisten können nötig sein. Für Google Apps wie Play Store, Gmail und YouTube verweist die Quelle auf Android Partnership, für AOSP ohne Google Apps auf Widevine.
4. Der historische Text verlangt eine Lizenzvereinbarung und nennt keine Widevine-Lizenzgebühren für Produkte oder Dienste. Dies ist Quellenkontext, keine Bestätigung heutiger geschäftlicher oder rechtlicher Bedingungen.
5. Fragen werden an die Widevine-Website verwiesen.

### 3.2 Widevine_DRM_Getting_Started_Device_Management

Dieser Abschnitt richtet sich vor allem an AOSP; ATV-Zertifizierungsprojekte müssen die ATV-Anforderungen beachten. Bleibt ein Keybox-Antrag länger als einen Monat offen, empfiehlt die Quelle Unterstützung durch Rockchip. Google liefert beim L1-Keybox-Antrag normalerweise Device Management. Ablauf:

1. Geräte und Keyboxes werden über Integration Platform verwaltet. Konto anlegen und registrieren sowie den angeforderten öffentlichen PGP-Schlüssel bereitstellen. Die Anmeldung ist nach Genehmigung möglich.
2. Nach Erstellung des Google-Kontos Widevine um Registrierung bei Integration Platform bitten.
3. Bei [Integration Platform](https://integration.widevine.com/) anmelden.
4. Unter Devices → Management gibt es drei Aktionen: Gerät hinzufügen, vorhandenen Datensatz bearbeiten und Keyboxes für ein vorhandenes Gerät erzeugen. Die Quelle schreibt den Button `GENERATEKEYBOXS`.

![Device-Management-Oberfläche](/docs/rockchip-widevine-project-preparation/images/p011-01.png)

*Device-Management-Oberfläche — Originalabbildung aus der chinesischen PDF, p. 11.*

### 3.3 Hinweise zum Google-Vertrag

Laut Quelle kann das Widevine-Team Angaben zu Unternehmenshintergrund, Mitarbeiterzahl, F&E-Anteil, betreuten Marken, künftigen Produkten und einer eigenen Marke verlangen. Sicherheitsfragen betreffen Schlüsselschutz, Secure Boot und Schutz vor unerlaubtem Flashen; die Quelle bietet hierfür Rockchip-Unterstützung an. Außerdem wird genannt, dass der Lizenznehmer auf schriftliche Anfrage von Google innerhalb von sieben (7) Tagen schriftlich, auch per E-Mail, die Einhaltung der Robustness Requirements selbst bestätigen muss. Dies sind historische Quellenangaben, die mit dem tatsächlich geltenden Projektvertrag abzugleichen sind.

Offizielle Dokumentation: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
