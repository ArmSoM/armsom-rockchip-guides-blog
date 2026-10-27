---
title: "Rockchip: OTA-Upgrade von Android 12 auf Android 14"
description: "Rockchip: OTA-Upgrade von Android 12 auf Android 14 — RK3588/RK356x/RK3399, BSP, parameter, fstab, userdata"
excerpt: "Rockchip: OTA-Upgrade von Android 12 auf Android 14"
translation_key: "250-rockchip-ota-android12-to14"
slug: "250-rockchip-ota-android12-to14"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "RK3588", "RK356x"]
---

{% raw %}

# Rockchip: OTA-Upgrade von Android 12 auf Android 14

ArmSoM-Plattformreferenz auf Grundlage der chinesischen Quelle RK-KF-YF-796 V1.0.0 zur Non-AB-OTA-Migration von Android 12 auf 14. Die Produkttabelle nennt RK3326/RK3399/RK356x/RK3588 und Kernel 6.1/5.10/4.19. Daraus folgt weder Unterstützung jeder Chip-Kernel-Kombination noch ein direktes Upgrade beliebiger ArmSoM-Boards. Android-BSP, lunch-Ziel, Partitionen, Verschlüsselung und Geräteanpassung konkret prüfen. Es fand keine Hardwarevalidierung statt.

Warnung: Die Quelle enthält FRP-Deaktivierung, SELinux-Debugging-Einstellungen und einen Patch zur automatischen Löschung von data. Nur in kontrollierter Entwicklung auf autorisierten Geräten bewerten; Produktionssicherheit separat prüfen und Daten vorher sichern. Es wurden keine Befehle ausgeführt und keine Patches heruntergeladen.

| Chips laut Quelle | Kernelversionen laut Quelle |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.19 |

## 1. Überblick

Dieses Dokument beschreibt die OTA-Migration von Rockchip Android 12.0 auf Android 14.0.

## 2. Patches für Android 14.0

Die folgenden Patches im Android-14.0-SDK anwenden. Die Quelle stellt alle Patches unter https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ bereit; Zugangscode: `vgp7`; Archivpasswort: `rk12to14JDY39`.

### 2.1 RK3588

1. Unter `device/rockchip/common` die Patches `jdy_device_rockchip_common_device.diff` und `jdy_device_rockchip_common_manifests.diff` anwenden.
2. Unter `build/make` den Patch `jdy_build_make.diff` anwenden.
3. Laut Quelle aktiviert Android 14 bei RK3588 standardmäßig FRP, Android 12 dagegen nicht. FRP nur dann zur Angleichung deaktivieren, wenn dies der tatsächlichen Konfiguration des Android-12-Projekts entspricht; diese ist maßgeblich.

```diff
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

Wenn FRP deaktiviert werden muss, zusätzlich `jdy_packages_apps_Settings.diff` unter `packages/apps/Settings` anwenden.

### 2.2 RK356X

1. Unter `device/rockchip/common` die Patches `jdy_device_rockchip_common_device.diff` und `jdy_device_rockchip_common_manifests.diff` anwenden.
2. Unter `build/make` den Patch `jdy_build_make.diff` anwenden.
3. Für rk3568 unter `device/rockchip/rk356x` den Patch `0001-Add-rk3568_s.patch` anwenden.

Für rk3566 unter `device/rockchip/rk356x` den Patch `0002-Add-rk3566_s.patch` anwenden.

Für die Variante rk3566 Go den Patch `0003-Add-rk3566_sgo.patch` unter `device/rockchip/rk356x` anwenden. Die entsprechenden Einträge in `device/rockchip/rk356x/AndroidProducts.mk` ergänzen; nachfolgend das Beispiel für rk3568.

```diff
diff --git a/AndroidProducts.mk b/AndroidProducts.mk
index 70af8e4..eaa4c50 100644
--- a/AndroidProducts.mk
+++ b/AndroidProducts.mk
@@ -15,11 +15,14 @@
 #

 PRODUCT_MAKEFILES := \
+        $(LOCAL_DIR)/rk3568_s/rk3568_s.mk \
         $(LOCAL_DIR)/rk3566_tgo/rk3566_tgo.mk \
         $(LOCAL_DIR)/rk3566_t/rk3566_t.mk \
         $(LOCAL_DIR)/rk3568_t/rk3568_t.mk

 COMMON_LUNCH_CHOICES := \
+    rk3568_s-userdebug \
+    rk3568_s-user \
     rk3566_tgo-userdebug \
     rk3566_tgo-user \
     rk3566_t-userdebug \
```

4. Auch für RK356X nennt die Quelle standardmäßig aktiviertes FRP in Android 14 und deaktiviertes FRP in Android 12. Die tatsächliche Android-12-Projektkonfiguration übernehmen. Ist eine Deaktivierung erforderlich, im betreffenden `BoardConfig.mk` unter `device/rockchip/rk356x/XXX` Folgendes setzen: `BUILD_WITH_GOOGLE_FRP := false`. Beispiel:

```diff
+BUILD_WITH_GOOGLE_FRP := false
```

Wenn FRP deaktiviert werden muss, zusätzlich `jdy_packages_apps_Settings.diff` unter `packages/apps/Settings` anwenden.

### 2.3 Andere Chips, etwa RK3399

1. Unter `device/rockchip/common` die Patches `jdy_device_rockchip_common_device.diff` und `jdy_device_rockchip_common_manifests.diff` anwenden.
2. Unter `build/make` den Patch `jdy_build_make.diff` anwenden.
3. Den passenden lunch-Eintrag des Android-12-Projekts aus dessen SDK in das Android-14-SDK kopieren, beispielsweise `rk3399_Android12`, `rk3568_s` oder `rk3588_s`.
4. Laut Quelle aktiviert Android 14 FRP standardmäßig, Android 12 nicht. Falls erforderlich, FRP entsprechend der tatsächlichen Android-12-Konfiguration deaktivieren. Die Quelle verwendet diesen Beispielpatch:

```diff
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

Wenn FRP deaktiviert werden muss, zusätzlich `jdy_packages_apps_Settings.diff` unter `packages/apps/Settings` anwenden.

## 3. Upgrade von Android 12.0 auf Android 14.0

Das OTA-Paket auf der Rockchip-Android-14.0-Plattform wie folgt erzeugen, auf das Android-12.0-Gerät übertragen und ein reguläres OTA-Update durchführen. Zuerst Abschnitt 4, Vorsichtsmaßnahmen, lesen; die Quelle verweist irrtümlich auf Abschnitt 3.

1. Das lunch-Ziel für die Migration von 12.0 auf 14.0 auswählen, etwa `rk3568_s` oder `rk3588_s`. Das zugehörige Projektverzeichnis lässt sich normalerweise direkt aus dem Android-12-SDK kopieren.

2. Das System regulär bauen: uboot und kernel bauen, lunch ausführen und anschließend den folgenden Quellbefehl verwenden.

```text
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

3. Das in Schritt 2 erzeugte Updatepaket `update.zip` nennen.

4. Die entsprechende Datei `update.zip` auf das Android-12-Gerät übertragen und das Update ausführen.

Hinweis: Wurde die vorhandene Android-12.0-Installation zuvor anhand von `Rockchip_Developer_Guide_OTA_from_Android11_to_Android12_CN` aus Android 11.0 aktualisiert, erfolgt die weitere Migration gemäß `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: im Android-14.0-SDK das Android-11.0-lunch-Ziel, etwa `rk3399_Android11`, auswählen, regulär bauen und das Paket auf dieses Android-12.0-Gerät übertragen. Hier nennt die Quelle das Paket `upddate.zip`, sonst `update.zip`; den tatsächlichen Dateinamen prüfen.

## 4. Vorsichtsmaßnahmen

1. Für Prüfung und Debugging auf allen Android-Plattformen, etwa Android 12.0 und 14.0, userdebug-Builds verwenden und `BOARD_SELINUX_ENFORCING := false` setzen. Diese Testkonfiguration der Quelle ist keine Sicherheitsempfehlung für Seriengeräte.

2. Vor dem OTA-Update sicherstellen, dass die Partitionstabelle in `parameter` identisch ist. Bei der Migration von 12.0 auf 14.0 muss die gebaute 14.0-Firmware dieselbe `parameter`-Datei wie 12.0 verwenden.

3. Vor OTA müssen Dateisystem und Verschlüsselungsmodus des data-Bereichs in fstab, beispielsweise `fstab.rk30board`, übereinstimmen. Bei der Migration von 12.0 auf 14.0 muss die gebaute 14.0-Firmware Dateisystem und Verschlüsselungsmodus von 12.0 beibehalten.

4. Vor OTA die Firmware selbst prüfen. Bei der Migration von 12.0 auf 14.0 die gebaute 14.0-Firmware beispielsweise mit RKDevTool flashen und normalen Start sowie sämtliche Funktionen prüfen.

5. data und keymaster

(1) Nach einem Hauptversionsupgrade empfiehlt die Quelle ausdrücklich, data zu löschen, um komplexe Kompatibilitätsprobleme zu vermeiden, die den Android-Start verhindern. Der folgende Beispielpatch im Repository `build/make` des Android-14-SDK löscht data nach dem Update automatisch. **Dabei werden Benutzerdaten zerstört; vorher sichern und die Freigabe einholen.**

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

(2) Wenn data nach dem Update tatsächlich erhalten bleiben muss:

a. Zunächst Abschnitt 3 befolgen. Erreicht Android nach dem Update den Hauptbildschirm, ist Punkt b nicht erforderlich; andernfalls Punkt b ausführen.

b. Die passenden Patches aus `userdata_patches` unter https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA beziehen (Zugangscode `jset`) und in den entsprechenden Android-14-SDK-Repositories anwenden. Anwendungshinweise stehen in `userdata_patches/README.txt`.

**Diese Patches gelten nur für Projekte, die vorhandene Android-12-Geräte auf Android 14 aktualisieren; bei der Entwicklung neuer Android-14-Geräte dürfen sie nicht verwendet werden.**

## Redaktionelle Hinweise und Quellen

- Es liegt kein passendes englisches PDF vor; Englisch, Russisch und Deutsch wurden aus dem chinesischen Fachtext übersetzt. Technische Abbildungen sind nicht vorhanden. Der Geltungsbereich der Produkttabelle steht oben.
- Alle vier Kapitel auf PDF-Seiten 4–7 sind enthalten; Seite 8 ist leer. Nichttechnische Deckblattangaben, Zielgruppe und Revisionshistorie wurden entfernt. Die letzte Zeile auf Seite 7 mit dem Verbot der userdata-Patches für neue Android-14-Geräte wurde wiederhergestellt.
- Der Quellbefehl enthält `–j32` (U+2013), keinen ASCII-Bindestrich. Die Schreibweise bleibt erhalten; vor Ausführung prüfen und nicht blind kopieren. Der visuelle Umbruch der ersten diff-Zeile wurde verbunden; sonstige Codeparameter bleiben unverändert.
- Der Verweis in Kapitel 3 auf „3. Vorsichtsmaßnahmen“ meint Kapitel 4. `upddate.zip` widerspricht `update.zip` und gilt nicht als bestätigter Dateiname.
- Abschnitt 2.3 wiederholt eine Pfadangabe und verwendet ein RK3588-Beispiel; daraus folgt keine unveränderte Anwendbarkeit auf RK3399. Downloadlinks, Zugangscodes und Archivpasswort stammen aus dem PDF und wurden nicht heruntergeladen oder geprüft; es handelt sich nicht um lokale Zugangsdaten.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
