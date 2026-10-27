---
title: "Rockchip-OTA ohne A/B: Android 13 auf Android 14"
description: "Vollständiger data/keymaster-Patch, Build-Schritte, Upgrade-Historien und Partitionsanforderungen für OTA ohne A/B."
excerpt: "Vollständiger data/keymaster-Patch, Build-Schritte, Upgrade-Historien und Partitionsanforderungen für OTA ohne A/B."
translation_key: "251-rockchip-ota-android13-to14"
slug: "251-rockchip-ota-android13-to14"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM-Plattformreferenz: vollständiger OTA-Ablauf Android 13→14 ohne A/B aus dem chinesischen Dokument RK-KF-YF-788 V1.0.0. Die Quelle nennt RK3326/RK3399/RK356x/RK3588/RK3562 sowie Kernel 5.10 und 6.10; 6.10 bleibt unverändert und wird nicht stillschweigend zu 6.1. Dies bestätigt keine ArmSoM-Board-Unterstützung. Board, Android-BSP, Partitionen und Sicherheitskonfiguration müssen geprüft werden; keine Hardwarevalidierung durchgeführt. Nur eine chinesische Quelle liegt vor, ohne technische Abbildungen; Tabellen und Patches bleiben editierbar.

> Risiko: Der Quellpatch löscht Benutzerdaten, die Debug-Einstellung schwächt SELinux. Die Beispiele wurden nicht ausgeführt. Daten sichern und Ziel-SDK unabhängig prüfen; keine ungeprüfte Produktionskonfiguration übernehmen.

| SoCs der Quelle | Kernel der Quelle |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Übersicht

Diese Anleitung beschreibt das OTA-Upgrade eines Rockchip-Systems mit Android 13.0 ohne A/B auf Android 14.0 ohne A/B.

## 2. Android-14.0-Patches

### 2.1 data-Partition und keymaster

(1) Nach einem Hauptversionswechsel empfiehlt die Quelle dringend, `data` zu löschen, um komplexe Kompatibilitätsprobleme beim Android-Start zu vermeiden. Der folgende Referenzpatch im Repository `build/make` des Android 14 SDK löscht `data` nach dem Upgrade automatisch.

```diff
diff --git a/tools/releasetools/ota_from_target_files.py b/tools/releasetools/ota_from_target_files.py
index d1b935845f..a3f2e28af0 100755
--- a/tools/releasetools/ota_from_target_files.py
+++ b/tools/releasetools/ota_from_target_files.py
@@ -279,7 +279,7 @@ logger = logging.getLogger(__name__)
 OPTIONS = ota_utils.OPTIONS
 OPTIONS.verify = False
 OPTIONS.patch_threshold = 0.95
-OPTIONS.wipe_user_data = False
+OPTIONS.wipe_user_data = True
 OPTIONS.extra_script = None
 OPTIONS.worker_threads = multiprocessing.cpu_count() // 2
 if OPTIONS.worker_threads == 0:
@@ -1498,14 +1498,15 @@ def main(argv):
   else:
     OPTIONS.info_dict = ParseInfoDict(args[0])

-  if OPTIONS.wipe_user_data:
+  '''if OPTIONS.wipe_user_data:
     if not OPTIONS.vabc_downgrade:
       logger.info("Detected downgrade/datawipe OTA."
                   "When wiping userdata, VABC OTA makes the user "
                   "wait in recovery mode for merge to finish. Disable VABC by "
                   "default. If you really want to do VABC downgrade, pass "
                   "--vabc_downgrade")
-      OPTIONS.disable_vabc = True
+      OPTIONS.disable_vabc = True'''
+  if OPTIONS.downgrade:
     # We should only allow downgrading incrementals (as opposed to full).
     # Otherwise the device may go back from arbitrary build with this full
     # OTA package.
```

(2) Soll `data` nach dem Upgrade erhalten bleiben:

a. Zuerst das Upgrade gemäß Abschnitt 3 ausführen. Startet die Android-Hauptoberfläche normal, entfällt b; andernfalls b befolgen.

b. Die passenden Patches aus `userdata_patches` über den folgenden Quelldownload beziehen und auf die entsprechenden Android-14-SDK-Repositories anwenden. Die genaue Verwendung beschreibt `README.txt` in diesem Verzeichnis.

Quelldownload: [Patches](https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w), Zugriffscode `0nsa`. Aktuelle Verfügbarkeit ungeprüft; nichts heruntergeladen oder ausgeführt.

Wichtig: Diese Patches gelten ausschließlich für das Upgrade bestehender Android-13-Geräte auf Android 14, nicht für neue Android-14-Geräte.

## 3. Upgrade von Android 13.0 auf Android 14.0

Das passende OTA-Paket auf der Rockchip-Android-14.0-Plattform erzeugen, auf das Rockchip-Android-13.0-Gerät übertragen und regulär per OTA aktualisieren. Zuerst Abschnitt 4 lesen.

1. Das `lunch`-Ziel für Android 13→14 wählen, beispielsweise `lunch rk3588_t-userdebug` oder `lunch rk3568_t-userdebug`. Das zugehörige lunch-Projektverzeichnis lässt sich normalerweise aus dem Android 13 SDK kopieren.
2. Das System regulär bauen: uboot und kernel kompilieren, lunch ausführen und anschließend den Quellbefehl verwenden:

```shell
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

Das erste `–j32` enthält im Original einen Nicht-ASCII-Strich, der zur Nachvollziehbarkeit erhalten bleibt. Vor Ausführung die tatsächliche Option prüfen; direkte Kopierbarkeit wird nicht zugesichert.

3. Das Paket aus Schritt 2 als `update.zip` benennen.
4. Die passende `update.zip` auf das Android-13-Gerät übertragen und aktualisieren.

**Upgrade-Historie:**

(1) Wurde das aktuelle Android 13.0 gemäß `Rockchip_Developer_Guide_OTA_from_Android12_to_Android13_CN` aus Android 12.0 aktualisiert, erfolgt der weitere Wechsel auf 14.0 nach `Rockchip_Developer_Guide_OTA_from_Android12_to_Android14_CN`: Im 14.0-Baum das lunch-Ziel für 12.0 wählen, etwa `lunch rk3568_s-userdebug` oder `lunch rk3588_s-userdebug`, regulär bauen und das im Original `upddate.zip` genannte Paket auf das dort als „Android-14.0-Gerät“ bezeichnete Gerät übertragen und aktualisieren.

(2) Kam Android 13.0 gemäß `Rockchip_Developer_Guide_OTA_from_Android11_to_Android13_CN` aus Android 11.0, gilt `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: Im 14.0-Baum das lunch-Ziel für 11.0 wählen, etwa `lunch rk3568_r-userdebug`, regulär bauen und die im Original `upddate.zip` genannte Datei auf das dort bezeichnete „Android-14.0-Gerät“ übertragen und aktualisieren.

Redaktioneller Hinweis: `upddate.zip` widerspricht `update.zip` im Hauptablauf; „Android-14.0-Gerät“ widerspricht dem Android-13.0-Ausgangszustand. Beide Quellabweichungen bleiben dokumentiert; Dateiname und Zielgerät prüfen.

## 4. Hinweise

1. Für Validierung und Debugging verlangt die Quelle auf jeder Android-Plattform, etwa 13.0/14.0, `userdebug` und folgende Variable. Dies ist ein Debug-Beispiel, keine direkt übernehmbare Produktionsvorgabe.

```make
BOARD_SELINUX_ENFORCING := false
```

2. Vor OTA müssen die `parameter`-Partitionstabellen übereinstimmen. Bei 13.0→14.0 muss die 14.0-Firmware dieselbe `parameter.txt` wie 13.0 verwenden.
3. Dateisystem und Verschlüsselung von data in `fstab`, beispielsweise `fstab.rk30board`, müssen übereinstimmen. Bei 13.0→14.0 müssen beide Einstellungen in 14.0 denen von 13.0 entsprechen.
4. Vor OTA die Firmware selbst prüfen. Bei 13.0→14.0 die 14.0-Firmware beispielsweise mit `RKDevTool` flashen und normalen Start sowie korrekte Funktion sämtlicher Bereiche bestätigen.

Offizieller Hintergrund: [AOSP-OTA ohne A/B](https://source.android.com/docs/core/ota/nonab). Der Verweis bestätigt keine Prüfung der Rockchip-Patches für ein aktuelles SDK.

{% endraw %}
