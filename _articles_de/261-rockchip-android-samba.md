---
title: "Rockchip Android Samba: Client und CIFS-Freigaben"
description: "Rockchip Android Samba: Client und CIFS-Freigaben — Android / Rockchip"
excerpt: "Rockchip Android Samba: Client und CIFS-Freigaben — Android / Rockchip"
translation_key: "261-rockchip-android-samba"
slug: "261-rockchip-android-samba"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Plattformreferenz für ArmSoM-Entwickler. Quelle: RK-SM-YF-295 V1.0.0. Vor der Verwendung müssen SoC, Android SDK/BSP, Kernelkonfiguration und Herstellerwerkzeuge zur Platine passen. Die Quelle bestätigt keine bestimmte ArmSoM-Platine oder Kernelversion. Es wurden keine ArmSoM-Hardwaretests durchgeführt; Beispiele und Bilder stammen aus der Quelle.

## Geltungsbereich der Quelle

Die Anleitung V1.0.0 beschreibt Samba unter Rockchip Android 10/11 und nennt alle Rockchip-Chips. Daraus folgt nicht, dass jedes ArmSoM-Systemabbild den Client oder CIFS unterstützt. Es liegt nur eine chinesische PDF vor; alle Sprachfassungen verwenden deren zwei Originalbilder.

## 1 Samba Client

### 1.1 Android Samba Client verwenden

Google stellt einen quelloffenen Android-Samba-Client bereit: [samba-documents-provider](https://github.com/google/samba-documents-provider/). Laut Originalanleitung gab es kein offiziell vorkompiliertes APK; man konnte selbst kompilieren oder eine fremde APK beziehen. Diese historische Angabe ist keine Prüfung des heutigen Veröffentlichungsstands.

![Verbindungsdialog des Android Samba Client](/docs/rockchip-android-samba/images/p002-01.png)

*Verbindungsdialog des Android Samba Client — Originalabbildung aus der chinesischen PDF, p. 2.*

Tragen Sie die Samba-Freigabe und die Kontodaten ein und wählen Sie `MOUNT`. Nach erfolgreichem Einhängen öffnet die App automatisch Google Files, um die Freigabe anzuzeigen.

![Eingehängte Freigabe in Google Files](/docs/rockchip-android-samba/images/p003-01.png)

*Eingehängte Freigabe in Google Files — Originalabbildung aus der chinesischen PDF, p. 3.*

### 1.2 Samba-Freigabe über die Befehlszeile einhängen

Das Kernel muss CIFS unterstützen. Aktivieren Sie die folgende Option, erstellen Sie das Kernelabbild neu und flashen Sie es. Laut Originalablauf sind keine Änderungen auf Android-Seite nötig.

```text
CONFIG_CIFS=y
```

Richten Sie zuerst auf dem PC einen Samba-Server ein; dessen Einrichtung wird in der Quelle nicht erläutert. Öffnen Sie auf dem Gerät ADB shell, legen Sie den Einhängepunkt an und hängen Sie die Freigabe ein. Der zweite mount-Befehl ist das konkrete Originalbeispiel; verwenden Sie einen passenden Befehl.

```sh
adb shell
mkdir -p /sdcard/share
mount -t cifs -o username=<SMB_USER>,password=<SMB_PASSWORD>,vers=2.1 //<SMB_IP>/<SMB_PATH> /sdcard/share

mount -t cifs -o username=all,password=all,vers=2.1 //10.10.10.201/all /sdcard/share
```

Prüfen Sie nach dem Einhängen den Verzeichnisinhalt und hängen Sie die Freigabe nach der Verwendung aus.

```sh
ls -l /sdcard/share
umount /sdcard/share
```

Offizielle Dokumentation: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
