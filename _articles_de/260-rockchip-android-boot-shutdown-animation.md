---
title: "Rockchip Android-Start-/Abschaltanimation und Ton"
description: "Android-Start- und Abschaltanimationen, Audioformate, Frametiming und ODM-Paketierung anpassen."
excerpt: "Android-Start- und Abschaltanimationen, Audioformate, Frametiming und ODM-Paketierung anpassen."
translation_key: "260-rockchip-android-boot-shutdown-animation"
slug: "260-rockchip-android-boot-shutdown-animation"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Quelle:zweisprachiges RK-SM-YF-202 V1.1. Für Android8.1+ des beschriebenen SDK;V1.1 aktualisiert Android Q. Rockchip-Anleitung,keine ArmSoM-Tests oder Bestätigung aller Folgeversionen. Keine Befehle ausgeführt. Beide Screenshots nur einmal im zweisprachigen PDF,mit chinesischer UI;keine englischen Gegenstücke. Alle Sprachen behalten Originale.

## 1 Überblick

Anpassung von Android-Start-/Abschaltton sowie Start-/Abschaltanimation. Schnelle Einrichtung siehe §2.

## 2 Schnelle Einrichtung

### 2.1 Aktivieren und deaktivieren

In device/rockchip/common/BoardConfig.mk BOOT_SHUTDOWN_ANIMATION_RINGING von false auf true ändern:Dateien werden beim Build in Firmware gepackt. false deaktiviert Verpackung.

```make
BOOT_SHUTDOWN_ANIMATION_RINGING := true
```

### 2.2 Dateipfade

Seit Android7.0 sind Animation und Ton kombiniert. Animation samt Ton in jeweilige Quellpfade unten kopieren. Ausgabe:$OUT/odm/media/;zum Anwenden odm.img flashen.

| Zweck | Quellpfad | Gerätepfad |
| --- | --- | --- |
| Start | device/rockchip/common/bootshutdown/bootanimation.zip | /odm/media/bootanimation.zip |
| Abschalten | device/rockchip/common/bootshutdown/shutdownanimation.zip | /odm/media/shutdownanimation.zip |

### 2.3 Build-Ergebnis

Die erstellten Mediendateien liegen unter $OUT/odm/media/. Flashen Sie odm.img, damit neue Animationen und Töne wirksam werden.

## 3 Dateianforderungen

Startton:WAV;Abschaltton:WAV oder OGG. Bilder:PNG,Farbbittiefe8,Abmessungen passend zur Displayauflösung.

### 3.1 bootanimation.zip erstellen

Animation besteht aus einzelnen PNG-Frames,nicht einem GIF. bootanimation.zip mit ZIP Store (unkomprimiert) packen. desc.txt in ANSI definiert Größe,Bildrate,Wiederholungen und Verzeichnisse. part0 enthält erste,part1 zweite Phase. Screenshot enthält zusätzlich part2,obwohl Beispiel nur part0/part1 beschreibt.

![Archivinhalt:chinesische UI der zweisprachigen Quelle](/docs/rockchip-android-boot-shutdown-animation/images/archive-content.png)

Archivinhalt:chinesische UI der zweisprachigen Quelle - Originalabbildung;PDF-Seite 7 (BILINGUAL).

```text
480 427 30
p 1 0 part0
p 0 10 part1
```

Zeile1:Breite480,Höhe427,30Bilder/s. Danach:Marker,Wiederholungen,Pause in Framezeiten,Verzeichnis. Quelle verlangt p. Wiederholung0 heißt endlos:part0 einmal ohne Pause,part1 endlos mit Pause10. Bei30fps dauert Frame1/30s≈33.3ms,Pause10≈333ms. Während Pausen schläft Animationsprozess und gibt CPU für Initialisierung frei. Quelle:Mehr Pause kann Start beschleunigen,beeinflusst aber Darstellung.

Zusammenhängende Sequenz vorbereiten,Frames stapelweise aufs Panel skalieren,PNG mit fortlaufenden Namen0000.png,0001.png exportieren. In part0/part1 ablegen,desc.txt anpassen. Screenshot zeigt nummerierte PNG.

![Fortlaufende PNG-Frames (kein ZIP-Einstellungsdialog)](/docs/rockchip-android-boot-shutdown-animation/images/zip-store.png)

Fortlaufende PNG-Frames (kein ZIP-Einstellungsdialog) - Originalabbildung;PDF-Seite 9 (BILINGUAL).

Abschließend bootanimation.zip erstellen:ZIP-Format und Store-Methode,sonst kann beschriebenes System es nicht lesen. Nach erfolgreicher Erstellung Original ersetzen. Chinesischer Text verlangt zusätzlich Rechte755;englischer Absatz lässt Satz aus. CN-Anforderung bleibt erhalten,für Ziel-SDK prüfen.

{% endraw %}
