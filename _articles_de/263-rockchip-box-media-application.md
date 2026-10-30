---
title: "Rockchip Box Media Center: Wiedergabe, DLNA und Dateien"
description: "Rockchip Box Media Center: Wiedergabe, DLNA und Dateien — Android / Rockchip"
excerpt: "Rockchip Box Media Center: Wiedergabe, DLNA und Dateien — Android / Rockchip"
translation_key: "263-rockchip-box-media-application"
slug: "263-rockchip-box-media-application"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Plattformreferenz für ArmSoM-Entwickler. Quelle: RK-SM-YF-502 cover 2.0.1 / revision table 2.0.0. Vor der Verwendung müssen SoC, Android SDK/BSP, Kernelkonfiguration und Herstellerwerkzeuge zur Platine passen. Die Quelle bestätigt keine bestimmte ArmSoM-Platine oder Kernelversion. Es wurden keine ArmSoM-Hardwaretests durchgeführt; Beispiele und Bilder stammen aus der Quelle.

## Geltungsbereich und Abweichung der Sprachfassungen

Quelle 2.0.1 ist eine chinesisch-englische PDF zu Box Media Center für RK mit Android 7.0 oder höher; eine Kernelversion fehlt. Der gemeinsame Bildsatz, teilweise mit chinesischer Oberfläche, wird in allen Sprachen verwendet; separate englische Bilder fehlen. Das Deckblatt nennt 2.0.1, die Änderungstabelle endet bei 2.0.0.

**DLNA-Widerspruch:** Chinesisch p7 verlangt `ro.config.low_ram = false` und `persist.sys.dlna.enable = true` für den Autostart. Englisch p8 nennt `ro.config.low_ram = true`, doch der folgende Detailpunkt verbietet wie Chinesisch den Autostart bei `true`. Wir folgen dem chinesischen `false` und dokumentieren die Abweichung; prüfen Sie das SDK.

## 1 Überblick

Media Center ist eine Box-TV-App zur Erkennung von internem Speicher, SD, USB, externen Festplatten, Samba/NFS, DLNA/UPnP und weiteren Geräten. Sie bietet Datei- und Bildansicht, Video-/Musikwiedergabe und APK-Installation. Querformatkonfigurationen:

- `[size:1280x720 density:160]`
- `[size:1280x720 density:213]`
- `[size:1920x1080 density:213]`
- `[size:1920x1080 density:320]`

Der Quellcode ist plattformspezifisch und über Rockchip Redmine/FAE anzufordern.

### 1.1 Startbildschirm und Grundbedienung

![Abbildung 1: Startbildschirm](/docs/rockchip-box-media-application/images/p006-01.png)

*Abbildung 1: Startbildschirm — Originalbild aus der chinesisch-englischen PDF, p. 6.*

Der Bildschirm zeigt lokale Speicher (intern, SD, USB, externe Festplatte), hinzugefügte Samba/NFS und erkannte LAN-DLNA-UPnP-Geräte mit Datei-, Video-, Musik-, Bild- und sonstigen Kategorien. Ziehen per Maus in vier Richtungen wird unterstützt.

1. Auf/Ab wählt ein Gerät.
2. Links/Rechts wählt dessen Medienkategorie; Bestätigen öffnet sie.
3. Menü (Abbildung 2) fügt NFS/Samba hinzu, aktualisiert DLNA oder alle Geräte und setzt DLNA-Anzeigename und Aktivierung.

![Abbildung 2: Hauptmenü](/docs/rockchip-box-media-application/images/p007-01.png)

*Abbildung 2: Hauptmenü — Originalbild aus der chinesisch-englischen PDF, p. 7.*

### 1.2 Systemeigenschaften

Nach chinesischer Bedingung benötigt DLNA-Autostart `ro.config.low_ram = false` und `persist.sys.dlna.enable = true`.

- `ro.config.low_ram`: Eigenschaft für wenig RAM; `true` verhindert Autostart. Manuell über Menü → DLNA Setting einschalten.
- `persist.sys.dlna.enable`: DLNA beim Booten starten; Standard `false`.

## 2 Multimedia-Module

Media Center durchsucht und klassifiziert Dateien automatisch. Video, Image und Audio öffnen Kategorien; File erhält die Verzeichnisstruktur. Netzwerkverwaltung und DLNA gehören dazu. Es folgen sechs Module.

### 2.1 Videowiedergabe

![Abbildung 3: Videoplayer](/docs/rockchip-box-media-application/images/p009-01.png)

*Abbildung 3: Videoplayer — Originalbild aus der chinesisch-englischen PDF, p. 9.*

Video in File oder Video wählen und bestätigen. Standard: Vollbild, Wiederholung, Stereo. Linksklick schaltet ebenfalls Wiedergabe/Pause.

1. Bestätigen pausiert/startet.
2. Einmal Rechts/Links springt **10 Sekunden** vor/zurück.
3. Gedrückthalten spult schnell.
4. Menü öffnet die untere Leiste; PIP erscheint nur bei aktivierter System-PIP-Feature.

![Abbildung 4: Videomenü](/docs/rockchip-box-media-application/images/p010-01.png)

*Abbildung 4: Videomenü — Originalbild aus der chinesisch-englischen PDF, p. 10.*

Seek wählt eine genaue Position (Abbildung 5).

![Abbildung 5: Seek](/docs/rockchip-box-media-application/images/p010-02.png)

*Abbildung 5: Seek — Originalbild aus der chinesisch-englischen PDF, p. 10.*

Setting umfasst Skalierung, Kanalauswahl, Wiedergabemodus, Untertitel, Tonspuren und 3D.

![Abbildung 6: Videoeinstellungen](/docs/rockchip-box-media-application/images/p011-01.png)

*Abbildung 6: Videoeinstellungen — Originalbild aus der chinesisch-englischen PDF, p. 11.*

PIP erlaubt nach Verlassen von Media Center andere Apps. Home gedrückt halten zeigt letzte Aufgaben und zentriert PIP; danach Vollbild wiederherstellen, PIP schließen oder pausieren.

![Abbildung 7: PIP-Wiedergabe](/docs/rockchip-box-media-application/images/p011-02.png)

*Abbildung 7: PIP-Wiedergabe — Originalbild aus der chinesisch-englischen PDF, p. 11.*

![Abbildung 8: PIP-Steuerung](/docs/rockchip-box-media-application/images/p012-01.png)

*Abbildung 8: PIP-Steuerung — Originalbild aus der chinesisch-englischen PDF, p. 12.*

### 2.2 DLNA

RK DLNA ist eine Mehrbildschirmkomponente mit drei Typen:

- **DMS (Digital Media Server):** speichert/teilt Medien für vernetzte DMP und DMR.
- **DMP (Digital Media Player):** sucht und empfängt DMS/M-DMS-Inhalte und bietet Wiedergabe, Rendering und Steuerung.
- **DMR (Digital Media Renderer):** spielt nach Konfiguration durch ein anderes Gerät DMS/M-DMS-Inhalte. Anders als DMP benötigt er einen DMC (Digital Media Controller) zum Abrufen von DMS.

Für Kompatibilität ohne Störung fremder DLNA-Apps ist RK DLNA separat in Media Center integriert. Über DLNA oder die Assistenten-App aktivieren. Bei Service Status `Opened` können Telefon-/PC-DLNA-Apps Inhalte übertragen und weitere Funktionen nutzen. Bei Problemen siehe Originalanleitung in Abbildung 9.

![Abbildung 9: DLNA-Anleitung](/docs/rockchip-box-media-application/images/p013-01.png)

*Abbildung 9: DLNA-Anleitung — Originalbild aus der chinesisch-englischen PDF, p. 13.*

### 2.3 Musikwiedergabe

![Abbildung 10: Musikplayer](/docs/rockchip-box-media-application/images/p014-01.png)

*Abbildung 10: Musikplayer — Originalbild aus der chinesisch-englischen PDF, p. 14.*

Musik in File oder Music wählen; Wiederholung ist Standard. Links Cover, Dateiname, Künstler, Album; rechts Liste; unten Steuerung und Liedtext.

1. Auf/Ab wählt Titel. Bei sichtbarem Auswahlrahmen startet Bestätigen den ausgewählten Titel, danach pausiert/fortsetzt es den laufenden.
2. Links/Rechts ändert die Position.
3. Menü öffnet Abbildung 11: Play Mode setzt den Modus, Image den Hintergrund.

![Abbildung 11: Musikmenü](/docs/rockchip-box-media-application/images/p015-01.png)

*Abbildung 11: Musikmenü — Originalbild aus der chinesisch-englischen PDF, p. 15.*

### 2.4 Bilder und 4K-Anzeige

Bild in File oder Image wählen. Standard: automatischer Wechsel alle **5 Sekunden**, Überblendung und Hintergrundmusik.

![Abbildung 12: Bildanzeige](/docs/rockchip-box-media-application/images/p016-01.png)

*Abbildung 12: Bildanzeige — Originalbild aus der chinesisch-englischen PDF, p. 16.*

1. Bestätigen schaltet Autowiedergabe um.
2. Menü öffnet die untere Bildleiste.

![Abbildung 13: Bildmenü](/docs/rockchip-box-media-application/images/p016-02.png)

*Abbildung 13: Bildmenü — Originalbild aus der chinesisch-englischen PDF, p. 16.*

Zoom In/Out öffnet Zoomsteuerung. Settings (Abbildung 14) setzt Übergangsmodus, Intervall und Detailanzeige. Music schaltet Hintergrundmusik beim Bildlauf ein/aus.

![Abbildung 14: Bildeinstellungen](/docs/rockchip-box-media-application/images/p017-01.png)

*Abbildung 14: Bildeinstellungen — Originalbild aus der chinesisch-englischen PDF, p. 17.*

Laut Quelle werden 4K-Bilder auf Android-7.0+-SDK mit Media Center **3.5.4 oder höher** und externem **4K-Bildschirm** unterstützt. Dies ist keine Prüfung aller ArmSoM-Abbilder.

### 2.5 APK-Installation

![Abbildung 15: APK-Installation](/docs/rockchip-box-media-application/images/p018-01.png)

*Abbildung 15: APK-Installation — Originalbild aus der chinesisch-englischen PDF, p. 18.*

Media Center starten, APK in File wählen und bestätigen. Bei Fehlern die aktivierten App-Berechtigungen prüfen.

### 2.6 Geräte- und Dateiverwaltung

Verwaltet werden lokale Speicher (intern, SD, USB, externe Platten), Samba/NFS und im LAN erkannte DLNA-UPnP-Geräte/Dateien. Samba/NFS manuell hinzufügen und einhängen; folgend Samba.

![Abbildung 16: Netzwerkgerät hinzufügen](/docs/rockchip-box-media-application/images/p019-01.png)

*Abbildung 16: Netzwerkgerät hinzufügen — Originalbild aus der chinesisch-englischen PDF, p. 19.*

Add Samba device wählen, Adresse, Benutzer und Passwort eingeben; Ergebnis siehe Abbildung 17.

![Abbildung 17: Samba eingehängt](/docs/rockchip-box-media-application/images/p019-02.png)

*Abbildung 17: Samba eingehängt — Originalbild aus der chinesisch-englischen PDF, p. 19.*

Zum Entfernen delete devices wählen und das Gerät im Dialog auswählen.

![Abbildung 18: Netzwerkgerät entfernen](/docs/rockchip-box-media-application/images/p020-01.png)

*Abbildung 18: Netzwerkgerät entfernen — Originalbild aus der chinesisch-englischen PDF, p. 20.*

![Abbildung 19: Verzeichnisansicht](/docs/rockchip-box-media-application/images/p020-02.png)

*Abbildung 19: Verzeichnisansicht — Originalbild aus der chinesisch-englischen PDF, p. 20.*

File des Geräts im Startbildschirm öffnen. Menü (Abbildung 20) bietet Kopieren, Löschen, Verschieben, Umbenennen, Sortieren, Suche und „Bluetooth analysis“. Beide Quellsprachen verwenden 蓝牙分析 / bluetooth analysis ohne Erklärung; dies wird nicht in Bluetooth-Freigabe umbenannt.

![Abbildung 20: Dateioperationen](/docs/rockchip-box-media-application/images/p021-01.png)

*Abbildung 20: Dateioperationen — Originalbild aus der chinesisch-englischen PDF, p. 21.*

Die Liste folgt der Verzeichnisstruktur: Ordner vor Dateien. Auf/Ab wählt ein Objekt; Vorschau und Details rechts hängen vom Typ ab.

![Abbildung 21: Ordnervorschau](/docs/rockchip-box-media-application/images/p021-02.png)

*Abbildung 21: Ordnervorschau — Originalbild aus der chinesisch-englischen PDF, p. 21.*

![Abbildung 22: Videovorschau](/docs/rockchip-box-media-application/images/p021-03.png)

*Abbildung 22: Videovorschau — Originalbild aus der chinesisch-englischen PDF, p. 21.*

1. **Ordner:** Symbol, Name, Anzahl untergeordneter Dateien/Ordner. Bestätigen lädt diese auf derselben Seite. Englisch nennt nur Unterordner; der vollständige chinesische Inhalt bleibt erhalten.
2. **Video:** Miniatur, sonst Standardsymbol; Name, Größe, Typ, Dauer, letzte Änderung. Bestätigen startet Video.

![Abbildung 23: Musikvorschau](/docs/rockchip-box-media-application/images/p022-01.png)

*Abbildung 23: Musikvorschau — Originalbild aus der chinesisch-englischen PDF, p. 22.*

![Abbildung 24: Bildvorschau](/docs/rockchip-box-media-application/images/p022-02.png)

*Abbildung 24: Bildvorschau — Originalbild aus der chinesisch-englischen PDF, p. 22.*

3. **Musik:** Albumcover, sonst Standardsymbol; Details wie bei Video. Bestätigen startet Musik.
4. **Bild:** Miniatur, sonst Standardsymbol. Zeilen: Name, Größe, Typ, letzte Änderung, Beschreibung. Bestätigen öffnet Bildansicht.

![Abbildung 25: APK-Vorschau](/docs/rockchip-box-media-application/images/p023-01.png)

*Abbildung 25: APK-Vorschau — Originalbild aus der chinesisch-englischen PDF, p. 23.*

![Abbildung 26: sonstige Dateien](/docs/rockchip-box-media-application/images/p023-02.png)

*Abbildung 26: sonstige Dateien — Originalbild aus der chinesisch-englischen PDF, p. 23.*

5. **APK:** Paketsymbol, sonst APK-Standardsymbol; Name, Größe, letzte Änderung. Bestätigen öffnet Systeminstallation.
6. **Andere:** Fragezeichensymbol; Name, Größe, letzte Änderung. Bestätigen hat keine Wirkung.

Offizielle Dokumentation: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
