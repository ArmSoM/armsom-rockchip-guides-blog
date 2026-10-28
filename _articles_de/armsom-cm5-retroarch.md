---
title: "RetroArch auf ArmSoM CM5: Ein Retro-Spielterminal mit RK3576"
description: "Falling, GBAtris und Snake auf dem ArmSoM CM5-Entwicklungskit mit Debian 12: Gerätedemo und Anleitung zum Bauen von RetroArch aus dem Quellcode."
excerpt: "Falling, GBAtris und Snake auf dem ArmSoM CM5-Entwicklungskit mit Debian 12: Gerätedemo und Anleitung zum Bauen von RetroArch aus dem Quellcode."
translation_key: "armsom-cm5-retroarch"
slug: "armsom-cm5-retroarch"
lang: de
date: 2026-10-27
author: "ArmSoM"
category: projects
products: [CM5]
tags: [ArmSoM, CM5, RK3576, RetroArch, Debian, Linux, libretro]
image: /assets/cm5-retroarch/three-games.png
---

Display anschließen, RetroArch öffnen und eine Pfeiltaste drücken: Auf dem vom ArmSoM CM5 angesteuerten Bildschirm erscheint vertraute Pixelgrafik. Für dieses Projekt haben wir auf einem CM5-Entwicklungskit mit einer nativen Debian-12-Desktopumgebung eine Retro-Spieledemo eingerichtet. Wir haben Falling, GBAtris und Snake ausprobiert und den Weg zum eigenen Build für Entwickler dokumentiert, die das Projekt nachvollziehen möchten.

![Auf ArmSoM CM5 aufgenommene Screenshots von Falling, GBAtris und Snake](/assets/cm5-retroarch/three-games.png)

*Von links nach rechts: Falling, GBAtris und Snake. Die Originalaufnahmen wurden mit Nearest-Neighbor-Skalierung vergrößert und zu einer Collage zusammengesetzt, damit die Pixelkanten erhalten bleiben. Die Abmessungen der Collage entsprechen nicht der Renderauflösung der Spiele.*

## Die CM5-Demo ansehen

<video controls playsinline preload="metadata" width="1080" height="1920" style="display:block;width:100%;height:auto;max-width:420px;aspect-ratio:9/16;margin:1.5rem auto;background:#101820" aria-label="ArmSoM CM5 RetroArch: englisches Demovideo im Hochformat">
  <source src="/assets/cm5-retroarch/retroarch-en-portrait.mp4" type="video/mp4">
  Ihr Browser unterstützt keine eingebetteten Videos.
</video>

*Englisches Video im Hochformat. Über die Bedienelemente lässt sich die Wiedergabe starten oder der Vollbildmodus öffnen.*

Die Demo verwendet ein HDMI-Display und eine USB-Tastatur. Falling, GBAtris und Snake stehen dabei für NES-, GBA- beziehungsweise GB-Inhalte. Geprüft wurden der grundlegende Betrieb, die Tastatursteuerung, das Pausieren sowie das Speichern und Laden von Spielzuständen.

In Falling bewegen Sie die Spielfigur, in GBAtris drehen und platzieren Sie Blöcke, in Snake steuern Sie die Schlange auf der Suche nach Nahrung. Dasselbe Frontend verbindet die Auswahl der Inhalte mit Spielen, Pausieren und Fortsetzen.

Diese Ergebnisse gelten für das verwendete System, die Cores und die Inhalte dieser Demo. Sie belegen weder die Kompatibilität mit allen Spielen noch dauerhaft gemessene Bildraten oder Langzeitstabilität.

## Wie RetroArch unterschiedliche Cores verbindet

RetroArch ist ein quelloffenes, plattformübergreifendes Frontend mit einer gemeinsamen Oberfläche für Emulatoren, Spiele-Engines und Mediaplayer. Es lädt unterschiedliche libretro-Cores für die jeweiligen Inhalte: Das Frontend verwaltet Menüs, Eingaben sowie Audio und Video, während der Core die Plattform emuliert oder die Inhalte ausführt. Über dieselbe Oberfläche lassen sich Spiele auswählen, Eingaben konfigurieren und Funktionen wie Speicherstände nutzen, sofern der jeweilige Core sie unterstützt.

Für Spielefans vereinfacht eine gemeinsame Oberfläche die Organisation der Bibliothek. Entwickler können mit dem offenen Quellcode und den modularen Cores eigene interaktive Anwendungen für Linux-Geräte gestalten. Dieses Projekt verwendet RetroArch sowie die Cores Nestopia und mGBA und bringt damit Software der Community auf das CM5-Entwicklungskit.

![XMB-Menüabbildung aus der README des RetroArch-Upstream-Projekts](/assets/cm5-retroarch/retroarch-xmb-readme.jpg)

*Beispiel des RetroArch-XMB-Menüs aus der Upstream-README, keine Aufnahme dieser CM5-Demo.*

## Ein kompaktes Modul für eigene Projekte

ArmSoM CM5 integriert Rockchip RK3576, Arbeitsspeicher und eingebauten Speicher auf einem 55 × 40 mm großen Rechenmodul. Mit einer Trägerplatine kann daraus ein Entwicklungskit für Spiele auf dem Schreibtisch werden. Eigene Tasten, ein Display und ein Gehäuse ermöglichen darüber hinaus Projekte wie einen kleinen Arcade-Automaten oder ein spezialisiertes interaktives Terminal.

![Produktabbildung des ArmSoM CM5-Rechenmoduls](/assets/cm5-retroarch/armsom-cm5-product.png)

*Produktbild aus der offiziellen ArmSoM-Dokumentation. Das Rechenmodul benötigt eine Trägerplatine, eine Stromversorgung und Peripheriegeräte.*

RK3576 besitzt vier Cortex-A72- und vier Cortex-A53-Kerne mit maximal 2.2 GHz beziehungsweise 1.8 GHz sowie eine Mali-G52 MC3 GPU. Maßgeblich sind die [offizielle ArmSoM CM5-Produktdokumentation](https://docs.armsom.org/armsom-cm5) und die jeweilige Hardwareversion.

Im Projekt wurde ein OpenGL-ES-3.2-Grafikpfad eingerichtet; die Bildausgabe erfolgt über HDMI und die Bedienung über eine USB-Tastatur. Die Hardware bildet die Entwicklungsgrundlage. Wie ein Spiel tatsächlich läuft, hängt jedoch vom System, Grafiktreiber, Core, Inhalt und den Einstellungen ab. Aus Prozessordaten allein lässt sich keine Kompatibilität ableiten.

## Vom Spielen zum eigenen Build

Neben dem Ausprobieren fertiger Anwendungen haben wir RetroArch 1.22.2 unter nativem Debian 12 auf CM5 aus unverändertem Upstream-Quellcode gebaut, installiert und den Start von Falling geprüft. Die getesteten Cores stammen aus Debian-Paketen.

Dabei sind zwei Prüfbereiche zu unterscheiden: Die Tests mit drei Spielen beschreiben die Laufzeitergebnisse der Demo. Die Ausführungsprüfung nach dem Bauen des Upstream-Quellcodes bezieht sich ausdrücklich auf Falling. Dieses Ergebnis darf nicht auf sämtliche Cores oder Spiele übertragen werden.

Die Bauanleitung ist im Dokumentationsrepository von libretro verfügbar. Entwickler können damit die Umgebung vorbereiten, die Software bauen und das Ergebnis prüfen und anschließend Probleme oder Verbesserungen an die Community zurückmelden.

[Zur Anleitung Building RetroArch on ArmSoM CM5](https://github.com/libretro/docs/blob/master/docs/guides/armsom-cm5.md)

![CM5-Bauanleitung im libretro-docs-Repository](/assets/cm5-retroarch/github-cm5-tutorial.png)

*Aufnahme der Anleitungsseite aus dem bereitgestellten Materialpaket. Die aktuellen Schritte stehen im verlinkten Dokument.*

![Upstream-Quellcoderepository von RetroArch](/assets/cm5-retroarch/github-retroarch-source.png)

*Das Upstream-Repository enthält die Implementierung, Bauanleitungen und Projektaktualisierungen.*

## Das eigene CM5-Projekt starten

Für eine vergleichbare Demo beginnen Sie mit einem CM5-Entwicklungskit, einer passenden Stromversorgung, einem HDMI-Display und einer USB-Tastatur. Richten Sie zunächst die Grundumgebung nach der Anleitung ein und erproben Sie anschließend schrittweise Eingabegeräte, Cores und eine eigene Benutzeroberfläche.

- [ArmSoM CM5 und die Hardwareunterlagen kennenlernen](https://docs.armsom.org/armsom-cm5)
- [RetroArch auf CM5 bauen](https://github.com/libretro/docs/blob/master/docs/guides/armsom-cm5.md)
- [RetroArch-Quellcode ansehen](https://github.com/libretro/RetroArch)
- [Offizielle Libretro-Dokumentation lesen](https://docs.libretro.com/)
- [Mehr über CM5-Trägerplatinen erfahren](/de/articles/019-cm5-carrier-production/)

Die Demo verwendet quelloffene Spiele. Für Spiele, Cores, Projektaufnahmen und andere Materialien gelten weiterhin die jeweiligen Rechte und Lizenzen; diese sind bei Nutzung und Weitergabe zu beachten. Die beschriebenen Ergebnisse stammen aus den Aufzeichnungen dieses Projekts und stellen keine Kompatibilitätszusage für andere Systemabbilder, Core-Versionen oder kommerzielle Spiele dar.
