---
title: "Rockchip Android: Schutz nach Werksreset"
description: "Rockchip Android: Schutz nach Werksreset"
excerpt: "Rockchip Android: Schutz nach Werksreset"
translation_key: "257-rockchip-android-factory-reset-protection"
slug: "257-rockchip-android-factory-reset-protection"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android: Schutz nach Werksreset

Vollständiger technischer Text von Seite 6 des zweisprachigen RK-SM-YF-206 V1.0. Android 8.1 und neuer ist historischer Quellenumfang, keine aktuelle Kompatibilitätsgarantie. Chinesisch/Englisch folgen ihren Quellabsätzen; Russisch/Deutsch vollständig übersetzt. Die chinesische Einschränkung „andere Person als der Kontoinhaber“ bleibt ausdrücklich erhalten. Keine technischen Bilder/Tabellen. Deckblattdaten, Erklärungen, Kontakte, Zielgruppe und Revisionen entfernt. Keine Flash-, Sicherheitskonfigurations- oder Hardwaretests.

Sicherheit und Prüfung: FRP schützt vor unbefugter Gerätenutzung. Die misc-Aussage zur Werksreparatur bleibt nur historische Quelleninformation, kein allgemein gültiges Verfahren; keine Anleitung zur Umgehung der Kontoprüfung wird ergänzt. Kontowiederherstellung über offizielle Eigentümerprozesse oder autorisierten Service. Flashen kann Daten löschen und Schutz beeinflussen. Abschnitt 2.1 nennt Deaktivieren, zeigt aber nur false→true-Aktivierung; fehlende Schritte werden nicht erfunden. Der zweiten Zeile „Google Service and frp overlay“ fehlt im Original #; sie bleibt erhalten, ist aber keine gültige eigenständige make-Anweisung. GMS-Abhängigkeit und Referenzdateiname bleiben.

<!-- source:bilingual p6 unit:0 -->

## 1 Überblick

<!-- source:bilingual p6 unit:1 -->

Dieses Dokument beschreibt die Anpassung von Android FRP für Google Factory Reset Protection. Ist die Funktion aktiv und wird nach Anmeldung eines Google-Kontos durch eine andere Person per Tastenkombination Recovery geöffnet und ein Werksreset durchgeführt, verhindern fehlendes Wi-Fi oder eine nicht mögliche Google-Anmeldung den Abschluss des Einrichtungsassistenten.

<!-- source:bilingual p6 unit:2 -->

Laut Quelle kann Flashen von misc das Benutzerkonto für die Wiederherstellung im Werk formatieren.

<!-- source:bilingual p6 unit:3 -->

Für den Schnelleinstieg siehe Kapitel 2 „Schnellaktivierung“.

<!-- source:bilingual p6 unit:4 -->

## 2 Schnellaktivierung

<!-- source:bilingual p6 unit:5 -->

### 2.1 Aktivieren und deaktivieren

<!-- source:bilingual p6 unit:6 -->

Die hier beschriebene FRP-Funktion benötigt GMS (Google-Serviceframework). Bei anderen Anforderungen [FactoryResetProtectionforPartners.pdf] zur Anpassung der benötigten Funktionen heranziehen.

<!-- source:bilingual p6 unit:7 -->

Zum Aktivieren die folgenden beiden Werte in device/rockchip/rk3xxx/BoardConfig.mk ändern:

<!-- source:bilingual p6 unit:8 -->

```text
#Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := false
BUILD_WITH_GOOGLE_FRP := false
```

<!-- source:bilingual p6 unit:9 -->

Auf:

<!-- source:bilingual p6 unit:10 -->

```text
Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := true
BUILD_WITH_GOOGLE_FRP := true
```

<!-- source:bilingual p6 unit:11 -->

Damit wird FRP aktiviert.

{% endraw %}
