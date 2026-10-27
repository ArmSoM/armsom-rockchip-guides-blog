---
title: "Rockchip Android: App-Vorinstallation"
description: "Rockchip Android: App-Vorinstallation"
excerpt: "Rockchip Android: App-Vorinstallation"
translation_key: "254-rockchip-android-application-preinstallation"
slug: "254-rockchip-android-application-preinstallation"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android: App-Vorinstallation

Vollständige technische Seiten 6–7 des zweisprachigen RK-SM-YF-203 V1.2. Technischer Umfang: Android 8.1 und neuer mit Android-Q-Update; historischer Quellenstand, Ziel-BSP prüfen. Chinesisch/Englisch folgen dem jeweiligen Original; zusammengezogene englische Leerzeichen wurden repariert. Russisch/Deutsch vollständig übersetzt. Keine technischen Bilder/Tabellen. Deckblattdaten, Erklärungen, Kontakte, Zielgruppe und Revisionen entfernt. Keine Befehle, Flash- oder Hardwaretests ausgeführt.

Prüfung: Alle drei Installationsarten sowie Eingabe- und Ausgabeordner bleiben in Originalreihenfolge; seitengetrennte Zuordnung verbunden. Ein Skriptpfad für source fehlt und wurde nicht erfunden. $OUT/oem neben odm/odm.img bleibt erhalten; gegen das Ziel-SDK prüfen. systemuid-Einschränkung und native mk-Referenz bleiben. Flashen kann Daten löschen: autorisierte Geräte, Backup und Imageprüfung erforderlich. Keine Vertriebsrechte für Drittanbieter-APKs werden erteilt.

<!-- source:bilingual p6 unit:0 -->

## 1 Überblick

<!-- source:bilingual p6 unit:1 -->

Bei der Android-App-Vorinstallation werden vorbereitete Drittanbieter-Apps entsprechend den Herstelleranforderungen während der Produktkonfiguration in Android integriert.

<!-- source:bilingual p6 unit:2 -->

Vorinstallationsarten:

<!-- source:bilingual p6 unit:3 -->

1. Apps installieren, die nicht deinstalliert werden können.

<!-- source:bilingual p6 unit:4 -->

2. Apps installieren, die dauerhaft deinstalliert werden können.

<!-- source:bilingual p6 unit:5 -->

3. Apps installieren, die nach Deinstallation bei einem Werksreset automatisch wiederhergestellt werden.

<!-- source:bilingual p6 unit:6 -->

## 2 Funktion aktivieren

<!-- source:bilingual p6 unit:7 -->

### 2.1 Konfiguration und Verwendung

<!-- source:bilingual p6 unit:8 -->

Nach source den folgenden Befehl eingeben, um das Zielverzeichnis zu finden, etwa device/rockchip/rk3126c/.

<!-- source:bilingual p6 unit:9 -->

```text
get_build_var TARGET_DEVICE_DIR
```

<!-- source:bilingual p6 unit:10 -->

Das Zielverzeichnis enthält drei Ordner:

<!-- source:bilingual p6 unit:11 -->

```text
1. preinstall
2. preinstall_del_forever
3. preinstall_del
```

<!-- source:bilingual p6 unit:12 -->

Sie entsprechen in dieser Reihenfolge den Arten im Überblick. Apps in den passenden Ordner legen. Englische APK-Dateinamen bevorzugen und Leerzeichen vermeiden.

<!-- source:bilingual p6 unit:13 -->

Nach erfolgreichem make werden unter $OUT/oem die entsprechenden Ordner erzeugt:

<!-- source:bilingual p6 unit:14 -->

```text
1. bundled_persist-app
2. bundled_uninstall_gone-app
3. bundled_uninstall_back-app
```

<!-- source:bilingual p6 unit:15 -->

Auch diese entsprechen den Arten im Überblick.

<!-- source:bilingual p7 unit:16 -->

Nach dem Flashen installiert das System diese Apps automatisch in den entsprechenden Verzeichnissen.

<!-- source:bilingual p7 unit:17 -->

Hinweis: Apps mit systemuid werden für diese Vorinstallation nicht unterstützt. Die native Android-Methode zum Schreiben der mk-Datei verwenden; Integrationsbeispiel unter vendor/rockchip/common/apps/RkDeviceTest/.

<!-- source:bilingual p7 unit:18 -->

### 2.2 Build-Ergebnis

<!-- source:bilingual p7 unit:19 -->

Nach dem Build werden die Konfigurationsdateien für die odm-Partition unter $OUT/oem/ ausgegeben. Nach dem Hinzufügen sicherstellen, dass odm.img geflasht wurde, damit die Änderungen wirksam werden.

{% endraw %}
