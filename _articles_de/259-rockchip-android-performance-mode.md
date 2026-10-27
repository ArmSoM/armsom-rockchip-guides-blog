---
title: "Rockchip Android: Leistungsmodus konfigurieren"
description: "Paketnamen und Aktivierung in package_performance.xml, vollständige Build-Ausgabe und dokumentierte odm/oem.img-Abweichung."
excerpt: "Paketnamen und Aktivierung in package_performance.xml, vollständige Build-Ausgabe und dokumentierte odm/oem.img-Abweichung."
translation_key: "259-rockchip-android-performance-mode"
slug: "259-rockchip-android-performance-mode"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM-Plattformreferenz auf Basis des zweisprachigen Dokuments RK-SM-YF-204 V1.1. Die Quelle nennt Android 8.1 und höher, V1.1 wurde für Android Q aktualisiert. Dies beschreibt das historische SDK und garantiert keine Unterstützung aller neueren Versionen oder ArmSoM-Boards. Geprüfte Boards, SoCs und Kernel-Versionen sind nicht angegeben. Im tatsächlichen Android-BSP prüfen, ob `package_performance.xml` implementiert ist. Keine Hardware-, Leistungsaufnahme- oder Performancetests durchgeführt; ein aktivierter anwendungsspezifischer Modus ist kein Messergebnis. Die Quelle enthält keine technischen Abbildungen; Konfigurationscode bleibt kopierbar.

## 1. Übersicht

Dieses Dokument beschreibt die Beschleunigung und Leistungssteigerung bestimmter Anwendungen, beispielsweise Antutu.

## 2. Schneller Einstieg

### 2.1 Aktivieren und deaktivieren

Unter `device/rockchip/rk3xxx/` die Datei `package_performance.xml` konfigurieren und den Paketnamen für den Leistungsmodus im Knoten eintragen. Die Quelle nennt folgende Befehlsform zum Ermitteln des Paketnamens. `file_path.apk` ist ein Platzhalter; den tatsächlichen Pfad vor Verwendung prüfen:

```shell
aapt dump badging (file_path.apk)
```

Die Quelle enthält gleichbedeutende chinesische und englische Vorlagen. Hier bleibt die englische Originalvorlage erhalten; beschreibende Werte sind keine einsatzfertigen Parameter:

```xml
<app package="the package name" mode="whether to enable the speedup, 1 means enable, 0 means disable"/>
```

`package` enthält den Paketnamen der Anwendung. `mode="1"` aktiviert die Beschleunigung, `mode="0"` deaktiviert sie. Die Quelle zeigt Antutu als Beispiel:

```xml
<app package="com.antutu.ABenchMark" mode="1"/>
<app package="com.antutu.benchmark.full" mode="1"/>
```

Beim Kompilieren wird die Datei in das Firmware-Image aufgenommen.

### 2.2 Build-Ergebnis

Nach dem Kompilieren liegt die Konfigurationsdatei in der Partition `odm` (`$OUT/odm/etc/`). Beide Quellsprachen verlangen anschließend das Flashen von `oem.img`, damit die Konfiguration wirksam wird.

> Prüfhinweis: Der Pfad `odm` und der Name `oem.img` stehen in beiden Quellsprachen nebeneinander. Der Name wird nicht stillschweigend durch `odm.img` ersetzt. Paketierungsregeln des Ziel-SDK und tatsächliche Partitionszuordnung prüfen. Es wurde nicht geflasht.

Offizieller Werkzeughintergrund: [Android SDK Build Tools](https://developer.android.com/tools/releases/build-tools). Dies bestätigt weder Implementierung noch Wirkung des Leistungsmodus in einem Rockchip-BSP.

{% endraw %}
