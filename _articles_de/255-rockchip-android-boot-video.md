---
title: "Rockchip Android-Bootvideo"
description: "Dateien, Wiedergabedauer, Lautstärke und Startverzögerung für Rockchip Android-Bootvideos konfigurieren."
excerpt: "Dateien, Wiedergabedauer, Lautstärke und Startverzögerung für Rockchip Android-Bootvideos konfigurieren."
translation_key: "255-rockchip-android-boot-video"
slug: "255-rockchip-android-boot-video"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}


Quelle:RK-SM-YF-505 V1.0.0,chinesisch. Betrieb,Anpassung und Nutzung von Rockchip-SDK-Bootvideo;keine ArmSoM-Tests oder Bestätigung neuer SDKs. Keine Befehle ausgeführt;alle Originalbilder aus CN,keine EN-Quelle.

## 1 Überblick

Diese Anleitung erklärt Funktionsweise, Anpassung und Verwendung des Android-Bootvideos. Für die schnelle Einrichtung gehen Sie zu Kapitel 3.

## 2 Funktionsweise des Bootvideos

Schnelle Nutzung siehe §3. Native bootanimation erhält Bootvideo-Wiedergabe/Steuerung. Audiodienst behandelt Bootvideo-Audio für stabile Lautstärke. Originaldiagramm besteht aus zwei Bildobjekten,unten nacheinander.

![Bootvideo-Ablauf,oberer Teil](/docs/rockchip-android-boot-video/images/bootvideo-flow.png)

Bootvideo-Ablauf,oberer Teil - Originalabbildung;PDF-Seite 6 (CN).

![Bootvideo-Ablauf,Fortsetzung](/docs/rockchip-android-boot-video/images/audio-flow.png)

Bootvideo-Ablauf,Fortsetzung - Originalabbildung;PDF-Seite 6 (CN).

## 3 Verwendung

### 3.1 Aktivieren und deaktivieren

Beschriebenes RKSDK enthält Bootvideo. Makro in device/rockchip/common/BoardConfig.mk:true aktiviert,false deaktiviert;eine Einstellung wählen.

```make
BOOT_VIDEO_ENABLE ?= true
```

```make
BOOT_VIDEO_ENABLE ?= false
```

### 3.2 Ablage der Videodatei

bootanimation.ts unter device/rockchip/common/bootvideo/bootanimation.ts ablegen. Code erkennt Namen;andere unterstützte Formate ohne Konvertierung umbenennen. Keine zusätzliche Codec-Unterstützung dadurch. Build kopiert ins media-Verzeichnis der system-Partition;Quellausgabe unten.

### 3.3 Build-Ergebnis

Nach erfolgreichem Build wird bootanimation.ts ins media-Verzeichnis der system-Partition kopiert. Der Quellscreenshot zeigt folgenden RK3328-BOX-Ausgabepfad:

```text
out/target/product/rk3328_box/system/media/bootanimation.ts
```

![Build-Ausgabe](/docs/rockchip-android-boot-video/images/installed-file.png)

Build-Ausgabe - Originalabbildung;PDF-Seite 7 (CN).

### 3.4 Videoanforderungen

Grundsätzlich eignet sich im lokalen Media Center normal abspielbares Video. Viele beim Booten startende Dienste erzeugen hohe Last:Chipfähigkeit beachten,Hardwaredecodierung bevorzugen. Empfohlenes Maximum:RK3328/RK3228H 1080p;RK322x/RK312x 720p.

### 3.5 Eigenschaftssteuerung

| Eigenschaft | Werte |
| --- | --- |
| persist.sys.bootvideo.enable | true an;false aus |
| persist.sys.bootvideo.showtime | -2 Standard:Videodauer lesen,vollständig spielen. -1:kein Timer,sofort bei System-Endsignal stoppen. Positive Ganzzahl:Sekunden;20 spielt20s,bei früherem Ende letztes Bild halten. Hier &gt;0;über120 auf120s begrenzt. |
| persist.sys.bootvideo.vol | 1–100,Maximum100 |
| persist.sys.bootvideo.delaytime | Debug-Wiedergabeverzögerung ≥0 Sekunden;5 bedeutet5s |

## 4 Fragen und Antworten

Quelle:noch zu ergänzen;keine weiteren Antworten.

{% endraw %}
