---
title: "Rockchip A/B OTA: Upgrade von Android 13 auf Android 14"
description: "Rockchip A/B OTA: Upgrade von Android 13 auf Android 14 — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA: Upgrade von Android 13 auf Android 14"
translation_key: "241-rockchip-ab-ota-android13-to14"
slug: "241-rockchip-ab-ota-android13-to14"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA: Upgrade von Android 13 auf Android 14

ArmSoM-Plattformreferenz nach der chinesischen Quelle RK-KF-YF-787 V1.0.0. Ihre Produkttabelle nennt RK3326/RK3399/RK356x/RK3588/RK3562 und Kernel 5.10/6.10; die Originalwerte bestätigen keine Unterstützung sämtlicher Kombinationen oder ArmSoM-Boards. Android-BSP, lunch-Ziel, A/B-Modus, Partitionen und Verschlüsselung konkret prüfen. Keine Hardwarevalidierung durchgeführt.

Flashen und Sicherheitsänderungen nur auf autorisierten Entwicklungsgeräten nach Datensicherung prüfen. userdebug-/SELinux-Einstellungen der Quelle sind Debugging-Beispiele, keine Produktionsempfehlungen. Keine Befehle ausgeführt oder Patches heruntergeladen.

| Chips laut Quelle | Kernelversionen laut Quelle |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Überblick

Dieses Dokument beschreibt die OTA-Migration von Rockchip Android 13.0 A/B auf Android 14.0 A/B.

## 2. Patches für Android 14.0

### 2.1 A/B-Konfiguration

A/B in BoardConfig.mk des Projekts aktivieren. Android 14 muss die A/B-Konfiguration von Android 13 übernehmen; war dort virtuelles A/B nicht aktiviert, auch unter Android 14 nicht aktivieren. A/B-Beispiel:

```text
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
 BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
```

Beispiel für virtuelles A/B:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 data und keymaster

a. Zuerst Kapitel 3 befolgen. Erreicht Android nach dem Update den Hauptbildschirm, entfällt b; andernfalls b ausführen.

b. Patches aus dem Verzeichnis userdata_patches unter folgendem Link beziehen und in den entsprechenden Android-14-SDK-Repositories anwenden. Hinweise stehen in README.txt des Verzeichnisses.

Link: https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w ; Zugangscode: `0nsa`.

Nur für Projekte zur Aktualisierung vorhandener Android-13-Geräte auf Android 14. Nicht für neu entwickelte Android-14-Geräte verwenden.

## 3. Upgrade von Android 13.0 auf Android 14.0

Das OTA-Paket auf Rockchip Android 14.0 erzeugen, auf das Android-13.0-Gerät übertragen und regulär per OTA aktualisieren. Zuerst die Vorsichtsmaßnahmen in Kapitel 4 lesen.

1. Das lunch-Ziel für 13.0 auf 14.0 auswählen, etwa `lunch rk3588_t-userdebug` oder `lunch rk3568_t-userdebug`. Das Projektverzeichnis lässt sich normalerweise direkt aus dem Android-13-SDK kopieren.

2. uboot und kernel regulär bauen, lunch ausführen und folgenden Quellbefehl verwenden:

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. Das Paket aus Schritt 2 update.zip nennen.
4. Auf das Android-13-Gerät übertragen und aktualisieren.

Hinweis (1): Stammt Android 13 aus einem Android-12-Upgrade nach `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android13_CN`, für den nächsten Schritt `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android14_CN` befolgen. Im Android-14-SDK das ursprüngliche Android-12-lunch-Ziel, etwa `lunch rk3568_s-userdebug` oder `lunch rk3588_s-userdebug`, auswählen und regulär bauen. Danach nennt die Quelle `upddate.zip` auf einem „Android-14.0-Gerät“. Der Dateiname widerspricht update.zip, die Geräteversion dem Android 13 vor dem Update. Diese Abweichungen bleiben erhalten und sind vor Anwendung zu prüfen.

Hinweis (2): Stammt Android 13 aus Android 11 nach `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android13_CN`, dann `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN` befolgen. Im Android-14-SDK das ursprüngliche Android-11-lunch-Ziel, etwa `lunch rk3568_r-userdebug`, wählen und regulär bauen. Wieder nennt die Quelle `upddate.zip` und ein „Android-14.0-Gerät“; dieselben Abweichungen prüfen.

## 4. Vorsichtsmaßnahmen

1. Für Prüfung und Debugging auf allen Android-Plattformen, etwa Android 13.0 und 14.0, userdebug-Builds verwenden und `BOARD_SELINUX_ENFORCING := false` setzen. Diese Testkonfiguration der Quelle ist keine Sicherheitsempfehlung für Seriengeräte.

2. Vor dem OTA-Update sicherstellen, dass die Partitionstabelle in `parameter.txt` identisch ist. Bei der Migration von 13.0 auf 14.0 muss die gebaute 14.0-Firmware dieselbe `parameter.txt`-Datei wie 13.0 verwenden.

3. Vor OTA müssen Dateisystem und Verschlüsselungsmodus des data-Bereichs in fstab, beispielsweise `fstab.rk30board`, übereinstimmen. Bei der Migration von 13.0 auf 14.0 muss die gebaute 14.0-Firmware Dateisystem und Verschlüsselungsmodus von 13.0 beibehalten.

4. Vor OTA die Firmware selbst prüfen. Bei der Migration von 13.0 auf 14.0 die gebaute 14.0-Firmware beispielsweise mit RKDevTool flashen und normalen Start sowie sämtliche Funktionen prüfen.

## Redaktionelle Hinweise und Quellen

Kein passendes englisches PDF; Englisch, Russisch und Deutsch übersetzen den vollständigen chinesischen Text. Keine technischen Abbildungen; Angaben der Produkttabelle stehen oben. Nichttechnisches Deckblatt, Zielgruppe und Revisionen sind entfernt. `–j32` enthält U+2013 und bleibt unverändert; vor Ausführung prüfen. `upddate.zip`/`update.zip` sind als Widerspruch markiert. Downloadlinks und Codes stammen aus der Quelle und wurden nicht geprüft.

Die Tabelle nennt Kernel 6.10; dies wurde nicht auf vermutetes 6.1 geändert. Kapitel 3 nennt bei historischen Upgrades ein Android-14-Zielgerät trotz vorhandenen Android 13; alle Sprachen kennzeichnen den Widerspruch. Den bisherigen A/B- beziehungsweise virtuellen A/B-Modus beibehalten. Die Einschränkung für neue Geräte am Ende von Seite 4 und die letzten Prüfbedingungen auf Seite 5 bleiben enthalten.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
