---
title: "Rockchip Android Device ID Attestation: Programmierung und Prüfung"
description: "Rockchip Android Device ID Attestation: Programmierung und Prüfung — Android / Rockchip"
excerpt: "Rockchip Android Device ID Attestation: Programmierung und Prüfung — Android / Rockchip"
translation_key: "264-rockchip-device-id-attestation"
slug: "264-rockchip-device-id-attestation"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Plattformreferenz für ArmSoM-Entwickler. Quelle: RK-YH-YF-780 V1.0.0. Vor der Verwendung müssen SoC, Android SDK/BSP, Kernelkonfiguration und Herstellerwerkzeuge zur Platine passen. Die Quelle bestätigt keine bestimmte ArmSoM-Platine oder Kernelversion. Es wurden keine ArmSoM-Hardwaretests durchgeführt; Beispiele und Bilder stammen aus der Quelle.

## Geltungsbereich der Quelle

V1.0.0 nennt RK3399, RK3326, RK3562, RK3568, RK3588 und RK3576 mit Android 14 oder höher. SDK, TEE und Produktionswerkzeuge müssen den Ablauf unterstützen. Nur die chinesische PDF liegt vor; ihre drei Abbildungen werden in allen Sprachen verwendet.

## 1 Überblick

ID Attestation ermöglicht dem Gerät, Hardwarekennungen wie Seriennummer oder IMEI nachzuweisen. Damit wird etwa eine echte Zero-Touch-Fernbereitstellung sicherer: Die Gegenstelle kann feststellen, dass sie mit dem richtigen Gerät und nicht mit einem Nachahmer kommuniziert.

Vor der Auslieferung wird eine Kopie der Hardwarekennungen angelegt, auf die nur die vertrauenswürdige Ausführungsumgebung (TEE) zugreifen kann. Benutzer können den Bootloader entsperren und Systemsoftware sowie vom Android-Framework gemeldete Kennungen ändern. Die TEE-Kopie lässt sich auf diesem Weg nicht verändern. Attestation weist damit die ursprünglichen Hardwarekennungen nach und verhindert Identitätsvortäuschung. Beschrieben werden Programmierung, Prüfung und Hinweise.

## 2 Programmierung und Prüfung

### 2.1 Hardwarekennungen

Unterstützte Kennungen:

1. Marke: `Build.BRAND`
2. Gerätename: `Build.DEVICE`
3. Produktname: `Build.PRODUCT`
4. Hersteller: `Build.MANUFACTURER`
5. Modell: `Build.MODEL`
6. Seriennummer
7. IMEI aller Funkmodule
8. MEID aller Funkmodule

Die ersten sechs Kennungen sind bei allen Android-Geräten vorhanden und für die Funktion erforderlich. Bei integrierten Mobilfunkmodulen muss auch deren IMEI oder MEID attestiert werden. Jedes Attribut ist auf **32 Byte** begrenzt; dies ist bei Produkteigenschaften und GMS-Antragsdaten zu berücksichtigen.

### 2.2 Programmierablauf

![Typischer Konfigurationsablauf für Keybox und ID Attestation](/docs/rockchip-device-id-attestation/images/p004-01.png)

*Typischer Konfigurationsablauf für Keybox und ID Attestation — Originalabbildung aus der chinesischen PDF, p. 4.*

Die mit `RKDevInfoWriteTool` geschriebene Seriennummer muss mit der ID-Attestation-Seriennummer desselben Geräts übereinstimmen. Werkzeuge können über die entsprechenden Rockchip-Schnittstellen angepasst werden. Die nächste Abbildung zeigt einen beispielhaften Programmierablauf.

![Referenzablauf der Produktionsprogrammierung](/docs/rockchip-device-id-attestation/images/p005-01.png)

*Referenzablauf der Produktionsprogrammierung — Originalabbildung aus der chinesischen PDF, p. 5.*

Abhängigkeiten:

- Zum Erzeugen eines RKP CSR wird die Seriennummer benötigt; sie ist daher zuerst zu schreiben.
- Der Dienst zur RKP-CSR-Erzeugung läuft erst nach einem normalen Android-Start.

Ein RKP CSR wird erzeugt, wenn der zuvor leere Seriennummernspeicher einen Wert erhält oder wenn sich der gespeicherte Wert gegenüber der letzten CSR-Erzeugung geändert hat.

#### 2.2.1 ID Attestation schreiben

Verwenden Sie `RKDevInfoTool-for-IDATTE-V1.0.0` oder `rk_vendor_storage`.

![ID-Attestation-Dialog von RKDevInfoTool](/docs/rockchip-device-id-attestation/images/p006-01.png)

*ID-Attestation-Dialog von RKDevInfoTool — Originalabbildung aus der chinesischen PDF, p. 6.*

Das Befehlszeilenbeispiel folgt unten; die Werkzeugbedienung beschreibt `vendorstorage-tutorial`. **Alle ID-Attestation-Attribute müssen gemeinsam in einem Vorgang geschrieben werden; getrennte Schreibvorgänge für einzelne Attribute sind nicht zulässig.**

```text
rk_vendor_storage.exe -w -i 21 -v "rockchip;rk3562_tgo;rk3562_tgo;rockchip;rk3562_tgo;rk83991906;;;"
```

#### 2.2.2 ID Attestation prüfen

Es gibt zwei beschriebene Prüfwege. Erstens: Protokoll der seriellen Schnittstelle prüfen:

```text
write_id_attestation_to_secure_storage size=288
write id attestation : ret=0
```

Zweitens: VTS-Test ausführen:

```sh
data/local/tmp/VtsAidlKeyMintTargetTest --gtest_filter=PerInstance/AttestKeyTest.EcdsaAttestationID/0_android_hardware_security_keymint_IKeyMintDevice_default
```

Erstellen Sie `VtsAidlKeyMintTargetTest` mit `mm` im Quellverzeichnis `hardware/interfaces/security/keymint/aidl/vts/functional`. Im Original fehlt ein führendes `/` im Programmpfad; dies bleibt erhalten, während PDF-Zeilenumbrüche in Option und Testname zusammengeführt wurden. Prüfen Sie den tatsächlichen Pfad auf dem Zielgerät.

Zum Schutz vor Benutzeränderungen darf ID Attestation nach dem Schreiben nicht geändert werden. Ein erneuter Schreibversuch erzeugt diese originale Meldung:

```text
id attestation already exsit,you cannot update it!
```

Falls eine Änderung erforderlich ist, verlangt die Quelle zuerst **Erase All** im Firmware-Flashtool und danach erneutes Schreiben. Dies ist ein destruktives Löschen, keine normale Attributaktualisierung.

## 3 Anhang

Der Originalanhang enthält nur die leeren Einträge `1.` und `2.` ohne Verweise oder technische Inhalte. Es wurde nichts ergänzt oder erfunden.

Offizielle Dokumentation: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
