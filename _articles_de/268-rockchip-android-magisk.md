---
title: "Magisk auf Rockchip Android installieren: Referenz für Pie und Q"
description: "Vollständige historische Boot-Image- und TWRP-Verfahren, Ramdisk-Konfiguration und SafetyNet-Quellenhinweise."
excerpt: "Vollständige historische Boot-Image- und TWRP-Verfahren, Ramdisk-Konfiguration und SafetyNet-Quellenhinweise."
translation_key: "268-rockchip-android-magisk"
slug: "268-rockchip-android-magisk"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## Geltungsbereich und historische Quelle

Dies ist eine vollständige technische Aufbereitung der bereitgestellten englischen Magisk-Anleitung für Rockchip Android Pie und Android Q. Das Deckblatt nennt V1.0.1, die Änderungstabelle reicht jedoch bis V1.0.2; diese Abweichung bleibt dokumentiert. Beschrieben wird der historische Ablauf mit MagiskManager, Magisk Hide und SafetyNet. Dies ist weder eine Installationsanweisung für aktuelle Versionen noch eine Zusage für erfolgreiche Integritätsprüfungen. Eine bestimmte ArmSoM-Platine, BSP-Version oder Kernelversion wurde nicht verifiziert; prüfen Sie zuerst Boot-Image-Aufbau und passendes SDK. Flashen, Root-Installation und Hardwaretests wurden nicht durchgeführt. Da kein chinesischer PDF-Text vorliegt, verwenden alle vier Sprachen den einzigen englischen Screenshot.

## 1 Einführung

Die Quelle beschreibt Magisk als quelloffenen Werkzeugsatz zur Android-Anpassung ab Android 5.0 (API 21). Genannt werden Root, Bootskripte, SELinux-Patches und das Entfernen von AVB2.0, dm-verity sowie forceencrypt. Die Systemless Interface verändert das Verhalten von system oder vendor, während die tatsächlichen Partitionen unverändert bleiben. Der historische Text beschreibt außerdem das Verbergen von Änderungen vor Prüfungen in Banking-Apps, Unternehmensüberwachung, Anti-Cheat-Systemen und Google SafetyNet. Dies ist eine Aussage der Quelle, keine verifizierte aktuelle Fähigkeit.

Upstream-Referenz: [Magisk](https://github.com/topjohnwu/Magisk).

## 2 Installationsmethoden

Die Quelle nennt zwei Integrationswege:

1. Ein mit Magisk Manager gepatchtes Boot-Image flashen.
2. Eine Magisk-ZIP-Datei über ein alternatives Recovery wie TWRP installieren.

## 3 Ein von Magisk Manager gepatchtes Boot-Image flashen

Laut Quelle verwenden die meisten Rockchip-Geräte kein A/B. Unter Android Pie nutzen Nicht-A/B-Geräte system-as-root; `boot.img` enthält dann keine Ramdisk. Da Magisk seine Dateien in der Ramdisk des Boot-Images ablegt, muss diese vorhanden sein. Unter Android Q befindet sich die Ramdisk wieder in `boot.img`. Analog zur A/B-Anordnung kann eine Ramdisk eingefügt und mit `skip_initramfs` in der cmdline übersprungen werden.

### 3.1 Vorbereitung

Erstellen Sie `boot.img` mit Ramdisk: Aktivieren Sie `BOOTIMG_SUPPORT_MAGISK` und bauen Sie das Boot-Image. Die Quelle schreibt den BoardConfig-Pfad als `device/rockchip/rk3328/rk3328_box BoardConfig.mk` mit Leerzeichen. Prüfen Sie den tatsächlichen Pfad und behandeln Sie diese Angabe nicht als Befehl.

```make
BOOTIMG_SUPPORT_MAGISK := true
```

```sh
make bootimage
```

Unter Android Q entfällt dieser Vorbereitungsschritt, da `boot.img` bereits eine Ramdisk enthält. Laden Sie MagiskManager aus den [Upstream-Releases](https://github.com/topjohnwu/Magisk/releases) in einer zum historischen Ablauf passenden Version herunter.

### 3.2 Installation

1. Übertragen Sie `boot.img` auf das Gerät.

```sh
adb push path/to/boot.img /storage/emulated/0/Download
```

2. Installieren Sie MagiskManager.

```sh
adb install /path/to/MagiskManager.apk
```

3. Wählen Sie in MagiskManager **install → Patch Boot Image File** und anschließend die in Schritt 1 übertragene `boot.img`. MagiskManager lädt die Magisk-ZIP-Datei herunter und patcht das Image automatisch.
4. Kopieren Sie das gepatchte Image auf den PC.

```sh
adb pull /storage/emulated/0/Download/boot_patched.img
```

5. Flashen Sie `boot_patched.img` mit AndroidTools in die Boot-Partition.

Hinweise der Quelle:

1. Stürzt die APK nach Patch Boot Image File ab, schlägt die Quelle einen zusätzlichen Dateimanager vor; als historisches Beispiel nennt sie ES File Explorer File Manager.
2. Ist adb nach der Installation nicht verfügbar, deaktivieren Sie **Settings → Settings → Magisk Hide** und starten Sie das Gerät neu.
3. Stellen Sie nach der MagiskManager-Installation eine Netzwerkverbindung her. Andernfalls kann die Installationsschaltfläche fehlen, wie in Abbildung 1.

![Abbildung 1. MagiskManager ohne Installationsschaltfläche; englischer PDF-Text, Seite 5.](/docs/rockchip-android-magisk/images/magisk-manager.png)

Abbildung 1. MagiskManager ohne Installationsschaltfläche; englischer PDF-Text, Seite 5.

## 4 Magisk-ZIP über TWRP installieren

### 4.1 Vorbereitung

- Bauen Sie [Rockchip TWRP](https://github.com/rockchip-software/TWRP).
- Bauen Sie wie oben beschrieben `boot.img` mit Ramdisk.
- Laden Sie `Magisk.zip` aus den [Magisk-Releases](https://github.com/topjohnwu/Magisk/releases) herunter.

### 4.2 Installation

1. Flashen Sie TWRP (`recovery.img`) und `boot.img` mit AndroidTool.
2. Übertragen Sie `Magisk.zip` auf das Gerät.

```sh
adb push /path/to/Magisk.zip /sdcard/
```

3. Starten Sie das Gerät im Recovery-Modus neu.

```sh
adb reboot recovery
```

4. Installieren Sie `Magisk.zip` über TWRP.
5. Starten Sie das Gerät neu.
6. Installieren Sie MagiskManager.

```sh
adb install /path/to/MagiskManager.apk
```

## 5 SafetyNet-Prüfung — historischer Ablauf

Die Quelle unterteilt SafetyNet in CTS compatibility und Basic integrity. CTS wird als schwer vorzutäuschende serverseitige Prüfung beschrieben, Basic integrity als geräteseitige Prüfung mit geringerem Sicherheitsniveau. Einige Apps nutzen nur Basic integrity und können daher trotz fehlgeschlagener vollständiger SafetyNet-Prüfung funktionieren. Diese Beschreibungen bleiben in ihrem historischen Kontext erhalten.

Laut Quelle kann ein Gerät von Google als nicht vertrauenswürdig eingestuft sein, wenn Basic integrity true meldet, SafetyNet aber fehlschlägt. Als Ansatz nennt sie das Anpassen von Eigenschaften, insbesondere `ro.build.fingerprint`, an eine ROM mit erfolgreicher Prüfung über MagiskHide Props Config. Dies bedeutet weder eine Gerätezertifizierung noch eine Erfolgsgarantie.

Die ursprünglichen Installationswege sind Downloads in Magisk Manager oder eine ZIP aus dem Manager beziehungsweise dem Supportthread des Moduls, installiert über **Magisk Manager → Modules** oder ein Recovery wie TWRP. Nach Installation und Neustart nennt die Quelle folgende Befehle:

```sh
adb shell
su
props
```

Wählen Sie einen zertifizierten Fingerprint aus der Liste. Die Quelle verweist auf die [MagiskHide-SafetyNet-Dokumentation](https://www.didgeridoohan.com/magisk/MagiskHideSafetyNet) und [MagiskHidePropsConf](https://github.com/Magisk-Modules-Repo/MagiskHidePropsConf).

Quellenhinweis: Entfernen Sie zunächst andere bereits integrierte Root-Werkzeuge.

ArmSoM-Plattformdokumentation: [docs.armsom.org](https://docs.armsom.org/).

{% endraw %}
