---
title: "Rockchip Android Recovery: Entwicklerhandbuch"
description: "Rockchip Android Recovery: Entwicklerhandbuch — OTA, update.img, rkLoader, RKUpdateService, V1.2.0"
excerpt: "Rockchip Android Recovery: Entwicklerhandbuch"
translation_key: "248-rockchip-android-recovery"
slug: "248-rockchip-android-recovery"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "Recovery", "OTA"]
---

{% raw %}

# Rockchip Android Recovery: Entwicklerhandbuch

Plattformreferenz für ArmSoM. RK-YH-YF-209 V1.2.0 behandelt Rockchip Android >= 12, überwiegend ohne AB. Die Produkttabelle nennt RK3326/RK3399/RK356x/RK3588 und Kernel 4.19/5.10; der Text ergänzt Befehle für Android-14-Differenzpakete. Ein einheitlicher BSP-Tag fehlt; daraus folgt keine Unterstützung aller ArmSoM-Platinen. Vor Anpassungen Android-BSP, Partitionen, Bootloader, Signaturschlüssel und Kernelkonfiguration der Zielplatine prüfen. Keine Hardwarevalidierung. Flashen, Werksreset und Erstellen von Update-Medien können Daten löschen: sichern und Zielgerät prüfen. Hier wurden keine solchen Befehle ausgeführt.

| Chips laut Quelle | Kernelversionen laut Quelle |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 4.19, 5.10 |

## 1. Überblick

Dieses Handbuch beschreibt Rockchip Recovery für Rockchip Android >= 12. Im Recovery-Modus lassen sich interne Daten oder das System verändern: ein neues Android installieren, das bestehende System sichern oder aktualisieren sowie Werkseinstellungen wiederherstellen. Behandelt werden überwiegend Nicht-AB-Systeme. Für AB siehe Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.

## 2. OTA-Pakete erstellen

Auf der beschriebenen Rockchip-Android-Plattform ist AB standardmäßig deaktiviert. Die Aktivierung erfordert Anpassungen an Android, U-BOOT und Kernel-DTS; siehe Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN. Im Folgenden geht es hauptsächlich um Nicht-AB-Systeme.

### 2.1 Einführung in OTA

OTA (Over The Air) ist das standardmäßige Software-Update-Verfahren von Android. Es unterstützt vollständige Updates (Vollpakete) und inkrementelle Updates (Differenzpakete), lokal oder über das Netzwerk.

### 2.2 Vollpaket erstellen

OTA (Over The Air) ist das standardmäßige Software-Update-Verfahren von Android. Es unterstützt vollständige Updates (Vollpakete) und inkrementelle Updates (Differenzpakete), lokal oder über das Netzwerk. Build-Befehle:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Alternativ:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

Das vollständige OTA-Paket rkxxxx-ota-eng.root.zip entsteht unter out/target/product/rkxxxx/. In update.zip umbenennen und zur Aktualisierung auf eine T-Karte oder in den internen Flash kopieren. Für die Android-Plattformen kann auch build.sh verwendet werden; dabei -o angeben, wie im Quellbeispiel build.sh –AUCKuop.

Release-Firmware muss mit ./mkimage.sh ota erstellt werden, sodass boot und kernel zusammen verpackt werden; kernel muss dann nicht separat geflasht werden. Eine getrennte Produktionsfirmware beeinträchtigt spätere Differenzupdates, sofern diese benötigt werden. Beim Erstellen von update.img mit ./build.sh ist ./build.sh -ou erforderlich, nicht nur ./build.sh -u.

### 2.3 Differenzpaket erstellen

Ein OTA-Differenzpaket enthält nur Änderungen und ist deshalb kleiner. Es dient hauptsächlich Online-OTA, kann aber auch lokal von einer T-Karte installiert werden. Dafür ist ein spezieller manueller Build erforderlich:

(1) Firmware v1 veröffentlichen und das Vollpaket erzeugen:

```text
非AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage.sh ota
AB时：
make installclean && make -j16 && make dist -j16 && ./mkimage_ab.sh ota
```

Alternativ:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(2) out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip als rkxxxx-target_files-v1.zip sichern: das Ausgangs-target-files-Paket für v1. Das Gerät unbedingt mit der in Schritt 1 unter rockdev erzeugten Firmware flashen.

(3) Kernel- oder Android-Code ändern, v2 veröffentlichen und dessen Vollpaket erstellen:

```text
make installclean && make -j16 && make otapackage -j16
```

Alternativ:

```text
非AB时：
build.sh –AUCKuop
AB时：
build.sh -ABUCKuop
```

(4) out/target/product/rkxxxx/obj/PACKAGING/target_files_intermediates/rkxxx-target_files-eng.xxx.zip als rkxxxx-target_files-v2.zip sichern, das Ausgangspaket für v2.

(5) Das Differenzpaket von v1 nach v2 erzeugen, beispielsweise:

```text
./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86  ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Für Android 13 muss python3 verwendet werden:

```text
python3 ./build/tools/releasetools/ota_from_target_files -v -i ./rockdev/v1/rk3588_t-target_files-eng.jdy.zip --block -p ./out/host/linux-x86 ./rockdev/v2/rk3588_t-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Für Android >= 14:

```text
out/host/linux-x86/bin/ota_from_target_files -v -i ./rockdev/V1/rk3588_u-target_files-eng.jdy.zip  --block -p ./out/host/linux-x86 ./rockdev/V2/rk3588_u-target_files-eng.jdy.zip  ./rockdev/v1v2.zip
```

Syntax zur Erstellung des Differenzpakets:

- ota_from_target_files: Paketgenerator.
- -v -i: ältere target-Datei für den Vergleich.
- --block: blockbasiertes OTA-Update.
- -p: Build-Umgebung des Hosts.
- -k: Paketschlüssel. Android 13 verwendet standardmäßig device/rockchip/common/security/testkey, andere Android-Plattformen build/make/target/product/security/testkey.
- Nächstes Positionsargument: neuere target-Datei.
- Letztes Positionsargument: auszugebendes OTA-Differenzpaket.

### 2.4 Wichtige Hinweise

Vollständiges Updatepaket und target-files-Paket sind verschieden. Differenzpakete entstehen durch Vergleich der target-files-Pakete zweier Versionen. Deshalb für jedes Release das Paket unter obj, das vollständige Updatepaket und alle mit ./mkimage.sh ota erzeugten Images aufbewahren.

## 3. rkLoader aktualisieren

Normalerweise benötigt OTA kein rkloader-Update. Falls erforderlich, den Loader (den miniloader des Flash-Werkzeugs) als RKLoader.bin unter $(TARGET_DEVICE_DIR)/ota/loader ablegen; er wird beim OTA-Packaging aufgenommen. Den Wert von $(TARGET_DEVICE_DIR) nach source build/envsetup.sh und lunch XXX im SDK-Stamm mit get_build_var TARGET_DEVICE_DIR ermitteln.

## 4. update.img direkt in Recovery installieren

Normalerweise wird update.img mit einem Flash-Werkzeug geschrieben. Für die Installation in Recovery die Rockchip-Recovery-Schnittstelle do_rk_mode_update an passender Stelle der Anwendungslogik aufrufen. Bei update.img auf einem USB-Datenträger diesen zunächst selbst oder über folgende Schnittstelle einhängen:

```text
prksdboot->ensure_usb_mounted();
```

Beispiel für do_rk_mode_update mit update.img auf einem USB-Datenträger:

```text
+ auto ui = device->GetUI();
+ InstallResult result = INSTALL_SUCCESS;

+ prksdboot->sdboot_set_bSDBoot(false);
+ prksdboot->sdboot_set_bUsbBoot(true);
+ /*FileName是相对于U盘根目录的路径，比如update.img位于U盘根目录abc子目录下，则设置
FileName为“/abc/update.img”即可*/
+ result = (InstallResult)do_rk_mode_update(FileName, prksdboot, ui);
```

## 5. Konfiguration

### 5.1 Log-Umleitung

1. Logs können an drei Ziele ausgegeben werden: serielle Schnittstelle, SD-Karte und /cache/recovery/.

2. In bootable/recovery/Android.bp konfigurieren:

- -DLogToSerial: Ausgabe an die serielle Schnittstelle.
- -DLogToCache: Ausgabe unter /cache/recovery/.
- -DLogToSDCard: recovery.log auf der SD-Karte.

### 5.2 Bildschirmdrehung

1. Recovery unterstützt Drehungen um 0°, 90°, 180° und 270°.

2. In device/rockchip/XXXX/BoardConfig.mk eine Zuweisung wählen:

- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_NONE — keine Drehung.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_LEFT — 270°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_RIGHT — 90°.
- TARGET_RECOVERY_DEFAULT_ROTATION := ROTATION_DOWN — 180°.

### 5.3 Dateien erhalten

Laut Quelle werden Dateien unter /cache/recovery/Recovery_* beim Formatieren nicht entfernt.

### 5.4 Updates von NTFS-USB-/SD-Medien

Die Quelle nennt Fragen des geistigen Eigentums als Grund für die standardmäßig fehlende NTFS-Unterstützung und verlangt vor Nutzung die entsprechende Berechtigung. Der Standardkernel kann NTFS-USB-Medien nicht einhängen, daher kann Recovery sie nicht verwenden. Zur Unterstützung die passende Kernelkonfiguration aktivieren.

## 6. Update-Ablauf

Rockchip stellt RKUpdateService als Standard-Updateclient für die Plattformprüfung bereit. Die folgenden Schritte verwenden; bei AB stattdessen Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN beachten.

1. Ein OTA-Paket gemäß Abschnitt 2 erstellen und in update.zip umbenennen.

2. update.zip in das Stammverzeichnis des USB-/SD-Mediums oder nach /data/media/0/ kopieren.

3. Das Paket wird automatisch erkannt und ein Update-Dialog erscheint. Andernfalls das USB-Kabel neu verbinden oder neu starten.

4. Das Gerät startet in Recovery und installiert das OTA-Paket automatisch. Nach Abschluss startet es wieder zur Android-Hauptoberfläche.

## 7. Update-Medien

### 7.1 SD-Updatekarte

Mit SDDiskTool aus der Produktionsfirmware update.img eine Updatekarte erstellen. Die Funktion Firmware-Upgrade und die passende update.img wählen, „Erstellung starten“ anklicken und abwarten. Die fertige Karte in den Gerätesteckplatz einsetzen und die Versorgung neu einschalten. Bei AB zuvor UPGRADE_PROGRAM_PARTITION=boot_b in der SDDiskTool-config setzen und SDDiskTool erneut öffnen.

### 7.2 USB-Updatelaufwerk

Für USB-Update-Medien zunächst CONFIG_ROCKCHIP_USB_BOOT in U-Boot aktivieren, U-Boot neu bauen und diese Fassung auf das Gerät flashen. Anschließend das Update-Laufwerk mit der vollständig gebauten update.img erstellen. Beispiel für rk3588:

```text
diff --git a/configs/rk3588_defconfig b/configs/rk3588_defconfig
index 67a8c357f0..be47518735 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -234,3 +234,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ROCKCHIP_USB_BOOT=y
```

Mit SDDiskTool aus der Produktions-update.img ein USB-Updatelaufwerk erstellen. Firmware-Upgrade und die passende update.img auswählen, die Erstellung starten und abwarten. Das fertige Laufwerk am passenden Port anschließen und die Versorgung neu einschalten. Bei AB vorher UPGRADE_PROGRAM_PARTITION=boot_b in der SDDiskTool-config setzen und das Werkzeug neu öffnen.

## Quelle und redaktionelle Prüfung

Geliefert wurde nur das chinesische Rockchip_Developer_Guide_Android_Recovery_CN.pdf mit 9 Seiten. Der Haupttext umfasst Seiten 4–8; Seite 9 ist leer. Englisch, Russisch und Deutsch sind vollständige Übersetzungen, keine eigenen Quellfassungen. Technische Abbildungen sind nicht vorhanden. Alle Chip- und Kernelangaben der Produkttabelle stehen im Anwendungshinweis.

- `build.sh –AUCKuop` enthält im Original U+2013 statt eines ASCII-Bindestrichs. Die Schreibweise bleibt erhalten; direktes Einfügen in die Shell kann scheitern. Die tatsächlichen Skriptoptionen prüfen, ohne den Originalbefehl stillschweigend zu verändern.
- Visuelle PDF-Zeilenumbrüche langer OTA-Befehle sind zusammengeführt. Die Bindestriche in `rk3588_t-target_files` und `rk3588_u-target_files` sowie `v1/v2` und `V1/V2` bleiben unverändert.
- Das do_rk_mode_update-Beispiel behält diff-Präfixe `+` und den chinesischen Kommentar. Dieser definiert FileName relativ zum USB-Stammverzeichnis, etwa `/abc/update.img`. Es ist ein Patch-Ausschnitt, keine vollständige ausführbare Quelldatei.
- Die Quelle fasst `-v -i` ohne getrennte Erklärung zusammen. testkey-Pfade sind Entwicklungsbeispiele, keine Empfehlung für Produktionsschlüssel.
- Die Aussage zum Erhalt von `/cache/recovery/Recovery_*` gilt für die beschriebene Recovery-Implementierung, nicht für beliebige Formatier-/Löschvorgänge. Externe Sicherung anlegen.
- NTFS-Berechtigung und Standardunterstützung sind historische Quellangaben, keine aktuelle rechtliche Bewertung. Konkreten BSP und anwendbare Berechtigungen prüfen.
- Datum/Klassifizierung des Deckblatts, rechtliche/Kontaktabschnitte, Zielgruppe und Revisionstabelle sind entfernt. Technische Version, Geltungsbereich und alle sieben Kapitel bleiben erhalten. Die wiederholte OTA-Einführung entspricht der Quelle.


Offizielle Referenzen: [Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab).

{% endraw %}
