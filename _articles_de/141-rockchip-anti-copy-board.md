---
title: "Rockchip-Platinenkopierschutz: drei Sicherheitsstufen"
description: "Rockchip-Platinenkopierschutz: drei Sicherheitsstufen — V1.2.0."
translation_key: "141-rockchip-anti-copy-board"
slug: "141-rockchip-anti-copy-board"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE, Security]
excerpt: "Rockchip-Platinenkopierschutz: drei Sicherheitsstufen — V1.2.0."
---

{% raw %}

Vollständiger technischer Inhalt der chinesischen und englischen Originale V1.2.0 (je17 Seiten). Für ArmSoM sind OTP/TEE des konkreten SoC und passende U-Boot-, rk_tee_user- und SDK/BSP-Versionen zu prüfen. Keine einheitliche Kernelversion ist angegeben; nicht alle Boards werden automatisch unterstützt. Plattformen stehen je Lösung. Keine ArmSoM-Hardwarevalidierung; Befehle und Ausgaben sind Herstellerbeispiele.

> OTP-Programmierung und Schlüsselsperren können irreversibel sein; Fehler können Booten oder Datenwiederherstellung verhindern. Veröffentlichung ist keine Ausführungserlaubnis. Zuerst auf Testboards prüfen und Schlüsselverwaltung, Wiederherstellung und Fertigung vorbereiten. Keine Programmier-, Sperr- oder Sicherheitskonfigurationsbefehle wurden ausgeführt. §4.4 nennt mittlere Stufe innerhalb des Kapitels hoher Stufe; der Quellfehler bleibt markiert. Tool-Screenshots des englischen PDFs enthalten ebenfalls chinesische UI-Texte.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1 Übersicht

Rockchip-Chips bieten Schutz gegen Platinenkopien zum Schutz kundeneigener Firmware, privater Daten und Kerncode. Er verhindert unbefugtes Kopieren und Verwenden von Firmware/Daten und damit verbundene wirtschaftliche Schäden. Beschrieben werden drei Lösungen: niedrige, mittlere und hohe Stufe. Kunden können eine davon wählen.

## 2 Lösung niedriger Stufe

### 2.1 Prinzip

Rockchip programmiert bei der Fertigung eine eindeutige CPUID je Chip in OTP. CPUID lesen und mit dem symmetrischen Key zu ENC-CPUID verschlüsseln, das in vendor storage gespeichert werden kann. Nach dem Booten ENC-CPUID lesen, zu DEC-CPUID entschlüsseln und mit CPUID vergleichen. Bei Nichtübereinstimmung wird das als unzulässig bewertete Gerät zum Kopierschutz neu gestartet.

![Abbildung 1: Diagramm/Tool-Screenshot, englische Quelle, Seite 4](/docs/rockchip-anti-copy-board/assets/en-p004-figure-01.png)

*Abbildung 1: Diagramm/Tool-Screenshot, englische Quelle, Seite 4*

Die Sicherheit hängt vom Schutz von Key ab. Den Klartextschlüssel nicht direkt im Code hinterlegen; die Quelle empfiehlt vorherige Verschleierung, um die Wiedergewinnung durch Disassemblierung zu erschweren. ENC-CPUID liegt in vendor storage. Beim Flash-Löschen wird diese Partition geleert; anschließend muss ENC-CPUID erneut programmiert werden.

### 2.2 Unterstützte Plattformen

Laut Quelle unterstützen Plattformen mit OTP im Chip diese Lösung. /sys/bus/nvmem/devices/rockchip-otp0/nvmem prüfen: Die Existenz dieses Knotens gilt in der Quelle als Unterstützungskriterium.

### 2.3 Anwendungsschritte

Schritte der Lösung niedriger Stufe:

1. Einen privaten symmetrischen Key erzeugen, CPUID aus OTP lesen und mit Key/AES zu ENC-CPUID verschlüsseln.

2. ENC-CPUID in vendor storage schreiben. Key zur besseren Absicherung verschleiern und den verschleierten Schlüssel im Anwendungscode hinterlegen.

3. Zur Laufzeit liest die Anwendung ENC-CPUID aus vendor storage, entschlüsselt es mit Key zu DEC-CPUID und liest CPUID.

4. DEC-CPUID mit CPUID vergleichen. Je nach Ergebnis normal weiterlaufen oder sofort neu starten.

### 2.4 Vollständiger Ablauf

Vollständiger Ablauf der Lösung niedriger Stufe:

![Abbildung 2: Diagramm/Tool-Screenshot, englische Quelle, Seite 6](/docs/rockchip-anti-copy-board/assets/en-p006-figure-01.png)

*Abbildung 2: Diagramm/Tool-Screenshot, englische Quelle, Seite 6*

### 2.5 Referenzbeispiel

1. ENC-CPUID mit BoardProofTool programmieren. Beim Einschalten recovery gedrückt halten, um Loader zu starten. low.bin erstellen, hexadezimal bearbeiten und einen 32-Byte-Schlüssel eintragen. In BoardProofTool.exe die Schlüsselauswahl (密钥) öffnen, low.bin wählen und Ausführen (执行) anklicken.

![Abbildung 3: Diagramm/Tool-Screenshot, englische Quelle, Seite 7](/docs/rockchip-anti-copy-board/assets/en-p007-figure-01.png)

*Abbildung 3: Diagramm/Tool-Screenshot, englische Quelle, Seite 7*

BoardProofTool liest CPUID über U-Boot rkusb_do_read_otp, verschlüsselt es automatisch mit dem Schlüssel zu ENC-CPUID und speichert es über U-Boot vendor_storage_write.

2. ENC-CPUID aus dem Userspace mit rk_anti_copy_board programmieren. Quellcode: rk_tee_user/v2/host/rk_anti_copy_board. Android-Buildbefehle:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Linux-Buildbefehle:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

Testbefehl:

```text
root@RK3588:/# rk_anti_copy_board low_gen
generate enc_cpuid success!
```

3. Die Geräteautorisierung im Userspace mit rk_anti_copy_board prüfen. Testbefehl:

```text
root@RK3588:/# rk_anti_copy_board low_verify
verify success!
```

## 3 Lösung mittlerer Stufe

### 3.1 Prinzip

OTP reserviert Platz für private Kopierschutzdaten. DATA und MAC erzeugen und func so wählen, dass MAC = func(DATA). DATA in OTP programmieren und MAC im Code einer Trusted Application (TA) hinterlegen. Nach dem Booten liest die TA DATA aus OTP und prüft die gewählte Beziehung zu MAC. Bei Nichtübereinstimmung wird das Gerät als unzulässig neu gestartet.

![Abbildung 4: Diagramm/Tool-Screenshot, englische Quelle, Seite 8](/docs/rockchip-anti-copy-board/assets/en-p008-figure-01.png)

*Abbildung 4: Diagramm/Tool-Screenshot, englische Quelle, Seite 8*

Die Sicherheit hängt vom Schutz von DATA ab. Der Kernel kann sie nicht lesen, nur die TA. Das Kapitel zur TA-Signatur in Rockchip_Developer_Guide_TEE_SDK_CN.md beachten und die TA mit eigenem Schlüssel signieren, damit unzulässige TAs DATA nicht offenlegen.

### 3.2 Unterstützte Plattformen

RV1109, RV1126, RK3566, RK3568, RK3588, RK3528, RK3562, RV1106, RK3576, RV1103B, RK3506, RV1126B

### 3.3 Anwendungsschritte

Schritte der Lösung mittlerer Stufe:

1. Private DATA erzeugen, func wählen und MAC = func(DATA) berechnen.

2. DATA in OTP programmieren, eine TA entwickeln und MAC in deren Code hinterlegen.

3. Die laufende App ruft die TA auf. Diese liest DATA aus OTP, prüft die Übereinstimmung mit MAC und liefert das Ergebnis.

4. Je nach Prüfergebnis läuft die App normal weiter oder startet sofort neu.

### 3.4 Vollständiger Ablauf

Vollständiger Ablauf der Lösung mittlerer Stufe:

![Abbildung 5: Diagramm/Tool-Screenshot, englische Quelle, Seite 10](/docs/rockchip-anti-copy-board/assets/en-p010-figure-01.png)

*Abbildung 5: Diagramm/Tool-Screenshot, englische Quelle, Seite 10*

### 3.5 Referenzbeispiel

1. DATA mit BoardProofTool in OTP programmieren. Beim Einschalten recovery für Loader gedrückt halten. mid.bin im Hexeditor mit 16 Byte privaten Kopierschutzdaten erstellen. In BoardProofTool.exe die Datendatei (数据) wählen und ausführen (执行). OTP ist einmalig programmierbar: Diese Daten können je Gerät nur einmal geschrieben werden.

![Abbildung 6: Diagramm/Tool-Screenshot, englische Quelle, Seite 11](/docs/rockchip-anti-copy-board/assets/en-p011-figure-01.png)

*Abbildung 6: Diagramm/Tool-Screenshot, englische Quelle, Seite 11*

2. DATA aus dem Userspace mit rk_anti_copy_board in OTP programmieren. Quellcode: rk_tee_user/v2/host/rk_anti_copy_board. Android-Buildbefehle:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libteec.so /vendor/lib64
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\tee-supplicant /vendor/bin
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Linux-Buildbefehle:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1 /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

Testbefehl:

```text
root@RK3588:/# rk_anti_copy_board mid_gen
save data into OTP success!
```

3. Die Geräteautorisierung im Userspace mit rk_anti_copy_board prüfen. Testbefehl:

```text
root@RK3588:/# tee-supplicant &
root@RK3588:/# rk_anti_copy_board mid_verify
I/TA: Hello!
I/TA: verify success!
I/TA: Goodbye!
```

## 4 Lösung hoher Stufe

### 4.1 Prinzip

OTP reserviert Platz für private Kundenschlüssel; siehe OEM Cipher Key in Rockchip_Developer_Guide_OTP_CN.md. Die Lösung verwendet einen bei der Fertigung programmierten OEM Cipher Key. Zum Schutz vor Offenlegung bietet das System nur eine Programmierschnittstelle, keine Leseschnittstelle. Einige Plattformen unterstützen zusätzlich Hardware-Read-Sperren: Danach kann die CPU den Schlüssel nicht lesen. Klartext data wählen und mit OEM Cipher Key/AES zu enc-data verschlüsseln. enc-data an einer festgelegten Flashposition oder im Code ablegen; Klartext data in der App konfigurieren. Nach dem Booten enc-data zu dec-data entschlüsseln und mit data vergleichen. Manipulation von data/enc-data oder Kopieren der Flashfirmware auf einen nicht autorisierten Chip führt zu einer Abweichung; das Gerät wird dann als unzulässig neu gestartet.

![Abbildung 7: Diagramm/Tool-Screenshot, englische Quelle, Seite 13](/docs/rockchip-anti-copy-board/assets/en-p013-figure-01.png)

*Abbildung 7: Diagramm/Tool-Screenshot, englische Quelle, Seite 13*

Vorteil: Nach dem Sperren kann die CPU OEM Cipher Key nicht lesen; dies erhöht Vertraulichkeit, Integrität und Manipulationsschutz.

### 4.2 Unterstützte Plattformen

RV1109, RV1126, RK3566, RK3568, RK3588, RK3528, RK3562, RV1106, RK3576, RV1103B, RK3506, RV1126B. Schlüsselsperren werden auf RK3588, RK3528, RK3562, RK3576, RK3506 und RV1126B unterstützt.

### 4.3 Anwendungsschritte

Schritte der Lösung hoher Stufe:

1. Einen privaten OEM Cipher Key erzeugen, in OTP programmieren und sperren.

2. Klartext data im App-Code konfigurieren.

3. In der App data mit OEM Cipher Key zu enc-data verschlüsseln und an einer festgelegten Flashposition oder im Code ablegen.

![Abbildung 8: Diagramm/Tool-Screenshot, englische Quelle, Seite 14](/docs/rockchip-anti-copy-board/assets/en-p014-figure-01.png)

*Abbildung 8: Diagramm/Tool-Screenshot, englische Quelle, Seite 14*

4. Nach dem Booten entschlüsselt die App enc-data aus Flash mit OEM Cipher Key zu dec-data und vergleicht es mit Klartext data im Code. Je nach Ergebnis normal fortfahren oder sofort neu starten.

![Abbildung 9: Diagramm/Tool-Screenshot, englische Quelle, Seite 14](/docs/rockchip-anti-copy-board/assets/en-p014-figure-02.png)

*Abbildung 9: Diagramm/Tool-Screenshot, englische Quelle, Seite 14*

### 4.4 Vollständiger Ablauf

Vollständiger Ablauf der Lösung mittlerer Stufe (Quellwortlaut im Kapitel hoher Stufe):

![Abbildung 10: Diagramm/Tool-Screenshot, englische Quelle, Seite 15](/docs/rockchip-anti-copy-board/assets/en-p015-figure-01.png)

*Abbildung 10: Diagramm/Tool-Screenshot, englische Quelle, Seite 15*

### 4.5 Referenzbeispiel

1. OEM Cipher Key mit BoardProofTool programmieren. Beim Einschalten recovery für Loader halten. high.bin im Hexeditor mit einem privaten 16-Byte-Schlüssel erstellen (auch 24 oder 32 Byte unterstützt). In BoardProofTool.exe Key Index wählen, high.bin über die Schlüsselauswahl (密钥) öffnen und ausführen (执行). OTP ist einmalig programmierbar: Je Gerät kann ein privater Schlüssel pro Key Index nur einmal geschrieben werden.

![Abbildung 11: Diagramm/Tool-Screenshot, englische Quelle, Seite 16](/docs/rockchip-anti-copy-board/assets/en-p016-figure-01.png)

*Abbildung 11: Diagramm/Tool-Screenshot, englische Quelle, Seite 16*

2. OEM Cipher Key aus dem Userspace mit rk_anti_copy_board programmieren. Quellcode: rk_tee_user/v2/host/rk_anti_copy_board. Wie für die niedrige Stufe kompilieren; die Schritte werden nicht wiederholt. Testbefehl:

```text
root@RK3588:/# rk_anti_copy_board high_gen
```

3. Die Geräteautorisierung im Userspace mit rk_anti_copy_board prüfen. Testbefehl:

```text
root@RK3588:/# rk_anti_copy_board high_verify
```

### 4.6 Erweiterungen

Die Nutzung von OEM Cipher Key kann erweitert werden: beispielsweise kritische Daten verschlüsselt speichern und nach dem Booten bei Bedarf entschlüsseln. Auch Kerncode kann verschlüsselt und nach dem Booten vor seiner Ausführung entschlüsselt werden.

## 5 Erweiterte Sicherheit

Den Kopierschutz mit folgenden Verfahren kombinieren, um das Risiko weiter zu senken und die Systemsicherheit zu erhöhen.

- Secure Boot: Firmware beim Start validieren, ihre Unverändertheit sicherstellen und unzulässige Programme verhindern. Ablauf und Anwendungsschritte stehen in der Secure-Boot-Dokumentation.
- Firmwareverschlüsselung: vor dem Programmieren verschlüsseln und erst beim Booten entschlüsseln; dies verhindert unbefugten Zugriff auf Klartextfirmware im Flash und Disassemblierungsanalyse.

{% endraw %}
