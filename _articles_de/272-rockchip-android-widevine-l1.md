---
title: "Widevine L1 unter Rockchip Android 14 integrieren und prüfen"
description: "Widevine L1 unter Rockchip Android 14 integrieren und prüfen"
excerpt: "Widevine L1 unter Rockchip Android 14 integrieren und prüfen"
translation_key: "272-rockchip-android-widevine-l1"
slug: "272-rockchip-android-widevine-l1"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Grundlage ist die chinesische Quelle RK-SM-YF-773 V1.0.0. Genannt werden Android14 auf RK3326, RK3399, RK3562, RK356x, RK3568, RK3576 und RK3588, ohne Kernel-Version. Für ArmSoM ist dies eine Plattformreferenz: BSP, TEE/OEMCrypto, Registrierung und Produktionsschlüssel müssen passen. Keine L1-/GMS-Zertifizierung wird bestätigt. Flashen, Registrierung, Upload oder Hardwaretest wurden nicht durchgeführt. Kein englisches PDF vorhanden; Übersetzungen verwenden dieselben Originalgrafiken, teilweise bereits englisch.

## 1 Umfang

Widevine-DRM-Client in Gerät/SoC integrieren; GMS/AOSP und Android14-LR-Upgrades gegenüber IR-Erstversionen unterscheiden, einschließlich Prüfung und Diagnose.

## 2 Ökosystem

Im Fokus: CDM und OEMCrypto HAL im roten Rahmen:

![Widevine-Ökosystem (Vektorgrafik der Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p03-1.png)

Widevine-Ökosystem (Vektorgrafik der Quelle)

### 2.1 L1-Anforderungen

1. Widevine-Level1-Sicherheitsanforderungen strikt erfüllen.
2. Passendes L1-OEMCrypto; CDM mit kompatiblem OEMCrypto bauen, üblicherweise vom Chipanbieter. Gerätehersteller beziehen den Build dort.
3. Gültige System ID durch Marken-/Modellregistrierung; während Integration IN_TESTING, vor Produktion RELEASED.
4. Zugangsdaten:2.0 fordert Keybox an;4.0 lädt die in der Quelle „密送“ genannten Daten hoch, erstellt Cloud-Projekt und lädt Schlüssel hoch. Den unklaren Begriff anhand der Schnittstellenspezifikation prüfen.
5. Integrationstests vor Freigabe abschließen.

### 2.2 L3-Anforderungen

Level3-Anforderungen und vorgebaute Widevine-L3-Bibliothek verwenden. Keine Familienregistrierung, Keybox oder Zertifikatsanforderung nötig. Richtige Plattform wählen: getrennte Datenbanken, nicht austauschbare Einträge. Integration Console für AOSP/CE(Linux), APFE für GMS/GAS/AAOS.

## 3 Android-DRM-Integration

### 3.1 GMS

Das für GMS angeforderte SDK enthält vendor/widevine. GAS-/AAOS-Autogeräte erhalten Software-/Dokumentzugriff vom Partnerteam. Clientcode, Tests und Geräteverwaltung sind getrennt.

### 3.2 AOSP

Widevine unterstützt AOSP ohne GMS direkt. Quellenablauf:

![AOSP-Integrationsablauf (Vektorgrafik)](/docs/rockchip-android-widevine-l1/images/pdf-p05-2.png)

AOSP-Integrationsablauf (Vektorgrafik)

### 3.2.1 L1-Ablauf

1. L1-OEMCrypto vom Chipanbieter beziehen.
2. [Console-Zugriff anfordern](https://developers.google.com/widevine/drm/device-management/ic-workflow/getting-access?hl=zh-cn), Geräte registrieren und Keyboxes anfordern. Marke/Modell entsprechen laut Quelle product.ro.manufacturer / product.ro.model; Präfixe im SDK prüfen.
3. CDM und Dokumentation unter `<branch>/libwvdrmengine` und `<branch>/libwvdrmengine/docs` beziehen, im AOSP-Baum ROOT/vendor/widevine automatisch bauen lassen.
4. `sh build_and_run_all_unit_tests.sh` in WIDEVINE_ROOT/libwvdrmengine/ sowie WVTS ausführen; CTS wird empfohlen.

### 3.2.2 L3-Ablauf

Bibliothek: vendor/widevine/libwvdrmengine/level3/*/libl3oemcrypto.cpp. Keine Familienregistrierung, Keybox oder Zertifikatsanforderung.

### 3.2.3 L1 aktivieren

Produktdatei device/rockchip/rk…/BoardConfig.mk:

```make
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 1
```

### 3.2.4 GMS-Dienst (für AOSP nicht nötig)

Hier verlangt die Quelle GMS für provisioning4.0, beschreibt später aber AOSP4.0. Mit dem Integrationsweg abgleichen. Nach Konfiguration lunch im SDK-Stamm ausführen und Werte prüfen:

```make
BUILD_WITH_GOOGLE_MARKET := true
```

```sh
get_build_var BOARD_WIDEVINE_OEMCRYPTO_LEVEL
get_build_var BUILD_WITH_GOOGLE_MARKET
```

### 3.2.5 Widevine-Repository

Bei Android14 IR überspringen. Für ältere Systeme mit Android14-LR-Upgrade in vendor/widevine:

```sh
cp -rf prebuilt/arm64/liboemcrypto_lr.so prebuilt/arm64/liboemcrypto.so
cp -rf prebuilt/arm/liboemcrypto_lr.so prebuilt/arm/liboemcrypto.so
```

Die Keybox-Bibliothek protokolliert folgenden provisioning-Wert. Nach LR-Werkzeugtausch in hardware/rockchip/keymaster4/rockchip_rkp_service wird nur default-CSR extrahiert:

```text
"provisioning":"OEMCrypto_Keybox"
```

```sh
cp -rf bin/arm/rockchip_rkp_factory_extraction_tool_lr bin/arm/rockchip_rkp_factory_extraction_tool
cp -rf bin/arm64/rockchip_rkp_factory_extraction_tool_lr bin/arm64/rockchip_rkp_factory_extraction_tool
```

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
```

## 4 Provisioning-Anforderungen

Quellenklassifikation nach Gerät/OEMCrypto:

|Gerät|OEMCrypto|DICE|2.0|3.0|4.0 non-DICE|4.0 DICE|
|---|---|---|---|---|---|---|
|Neu|v18+|Yes|-|-|-|Erforderlich(Standard)|
|Neu|v17+|No|Erforderlich(Standard)|Optional|Optional|-|
|Neu|v17 or earlier|No|Erforderlich(Standard)|Optional|-|-|
|Bestehend|v17+|No|Erforderlich(Standard)|Optional|-|-|

### 4.1 OTA auf Android14(LR)

Provisioning2.0 verwenden und L1-Keybox flashen. Das gekürzte Beispiel ist kein vollständiger echter Berechtigungsnachweis:

```xml
<?xml version="1.0"?>
<Widevine>
<NumberOfKeyboxes>1</NumberOfKeyboxes>
<Keybox DeviceID="test-001"><Key>738a1896e6c7ec9fa3079220aaaa132</Key>
<ID>0000000200...</ID><Magic>6b626f78</Magic><CRC>5d6a650a</CRC></Keybox>
</Widevine>
```

Mit rkpacker in kdb umwandeln und Tool1.64 flashen; vorhandene Keyboxes bleiben kompatibel. Bei Android12/13→14 oder Wiederverwendung alter APFE-SKUs Keybox-Registrierung beibehalten. Wechsel zu4.0 kann ausgelieferte Geräte wegen abweichender Authentifizierung ablehnen, obwohl neue funktionieren.

### 4.2 Android14 IR

Neues Android14 verwendet Provisioning4.0.

![Quellengrafik: PDF-Seite 8, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p08-3.png)

Quellengrafik: PDF-Seite 8, Abbildung 1 (chinesische Quelle)

1. SoC-Anbieter entwickelt OEMCrypto-TA.
2. Registriert Chipsatz bei Widevine.
3. OEM registriert Gerät über Widevine/APFE.
4. OEM nutzt chipbezogene UDS als Vertrauenswurzel; ein global eindeutiger128-Bit-SoC-Schlüssel erzeugt per KDF ein OEMCrypto-Schlüsselpaar.
5. OEM fertigt Geräte. Fokus3 und5.

### 4.2.1 Registrierung

Zuerst Chipsatzregistrierung(2) bestätigen. AOSP registriert bei Widevine; GMS meist über3pl mit APFE-Produktdaten. Screenshots: Gerät wählen→Edit→CPU Make/CPU Model im roten Feld ausfüllen→Register DRM.

![Quellengrafik: PDF-Seite 9, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p09-4.png)

Quellengrafik: PDF-Seite 9, Abbildung 1 (chinesische Quelle)

![Quellengrafik: PDF-Seite 9, Abbildung 2 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p09-5.png)

Quellengrafik: PDF-Seite 9, Abbildung 2 (chinesische Quelle)

![Quellengrafik: PDF-Seite 10, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p10-6.png)

Quellengrafik: PDF-Seite 10, Abbildung 1 (chinesische Quelle)

![Quellengrafik: PDF-Seite 10, Abbildung 2 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p10-7.png)

Quellengrafik: PDF-Seite 10, Abbildung 2 (chinesische Quelle)

![Quellengrafik: PDF-Seite 10, Abbildung 3 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p10-8.png)

Quellengrafik: PDF-Seite 10, Abbildung 3 (chinesische Quelle)

![Quellengrafik: PDF-Seite 10, Abbildung 4 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p10-9.png)

Quellengrafik: PDF-Seite 10, Abbildung 4 (chinesische Quelle)

Formularbeispiel: Provisioning4.0, Key Upload, DICE No, OEM_CRYPTO_V18_5, TEE/TA-OTA Yes, individuelles OTA Yes, Rollbackschutz Yes, privilegiertes Debugging deaktiviert Yes, Audioabschaltung No. LR: Keybox/Verifier key.5.1 Digitalausgang(unspecified ohne Ausgang/HDCP) und5.2 Abschalten digitaler Videoausgänge gerätespezifisch ausfüllen, nicht HDCP_V2_3/Yes kopieren. Erfolgsbeispiel folgt.

![Quellengrafik: PDF-Seite 11, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p11-10.png)

Quellengrafik: PDF-Seite 11, Abbildung 1 (chinesische Quelle)

### 4.2.2 Fertigung

Seriennummer und ID Attestation vor Extraktion/Upload von Widevine-RKP-CSR schreiben. Debugging per Befehl, Produktion mit RKDevInfoWriteTool. Falls fehlend, mit mm in system/security/provisioner bauen.

```sh
rkp_factory_extraction_tool64 --output_format build+csr > /sdcard/csr.json
```

Nach Seriennummer/ID Attestation normal neu starten. RKP erzeugt CSR in vendor storage; erneut Loader, Attestation-Keybox flashen und CSR ins Werkzeugverzeichnis lesen. IDs66/67. default, widevine und nichtleere serialno prüfen; Beispieldaten mit...gekürzt.

```c
#define VENDOR_CSR_SERIAL_ID 66
#define VENDOR_CSR_ID 67
```

![Quellengrafik: PDF-Seite 12, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p12-11.png)

Quellengrafik: PDF-Seite 12, Abbildung 1 (chinesische Quelle)

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
{"build_fingerprint":"rockchip/rk3562_u/...Vhc2Uta2V5cw==","name":"widevine","serialno":"rk83991906"}
```

CSR-Erzeugung wie keymint, siehe SDK RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide. Bei L1 enthält eine Extraktion keymint und widevine; einmal hochladen.

## 5 Prüfung

Netz mit Google-/YouTube-Zugriff verbinden, neu starten oder Zertifikatsdownload abwarten(Schritte3/5).

### 5.1 Stufe

new Drminfo.apk installieren. System ID muss Registrierung entsprechen; Vendor-/Version-Unterschiede ignorieren.

![Quellengrafik: PDF-Seite 14, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p14-12.png)

Quellengrafik: PDF-Seite 14, Abbildung 1 (chinesische Quelle)

![Quellengrafik: PDF-Seite 15, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p15-13.png)

Quellengrafik: PDF-Seite 15, Abbildung 1 (chinesische Quelle)

Bei4.0 System ID statt nur Level=L1 prüfen.2147483647 bedeutet fehlendes Zertifikat: Registrierung, CSR und Netz prüfen.8158 bedeutet fehlerhaft geladenes liboemcrypto.so und L3.

### 5.2 Video

Markierte ExoPlayer-Demo-Einträge sollten über1Minute laufen. Formate stehen in SoC-Dateien vendor/rockchip/common/vpu/etc/media_codecs_c2_rk***.xml und media_codecs_secure_rk***.xml.

![Quellengrafik: PDF-Seite 16, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p16-14.png)

Quellengrafik: PDF-Seite 16, Abbildung 1 (chinesische Quelle)

## 6 FAQ

### 6.1 Muss Registrierungsfirmware identisch sein?

Nein; gleiche Plattform und Android-Version sind möglich. Mindestens Device Name, Product, CPU Make(Rockchip) und CPU Model(tatsächliches RK****) müssen passen. Quelle bezeichnet Informationen als unvollständig; Genehmigungsergebnis beachten. Eigenschaftszuordnung unten.

### 6.2 L1-Umgebung prüfen

DrmInfo zeigt L1; logcat prüfen:

![Quellengrafik: PDF-Seite 17, Abbildung 1 (chinesische Quelle)](/docs/rockchip-android-widevine-l1/images/pdf-p17-15.png)

Quellengrafik: PDF-Seite 17, Abbildung 1 (chinesische Quelle)

```text
WVCdm: [cdm_engine.cpp(1089):IsSecurityLevelSupported] level = L1
...
WVCdm: [oemcrypto_adapter_dynamic.cpp(875):Initialize] OEMCrypto_Initialize Level 1 success. I will use level 1.
```

### 6.3 DrmInfo zeigt kein L1

1. L1-Bibliotheken und Protokolle nach Start/DrmInfo prüfen. IR4.0 und LR2.0 unterscheiden sich in provisioning:

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_BootCertificateChain","is_factory_build":"false","fused":false,"is_debug":false}
```

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_Keybox","is_factory_build":"false","fused":false,"is_debug":false}
```

2. Bei2.0 Keybox prüfen, bei4.0 Registrierung/Netz. Nicht-GMS registriert beiWidevine und lädt CSR hoch; GMS prüft Server:

```sh
ping remoteprovisioning.googleapis.com
```

Bei Zertifikatsfehlern RkpdWidevine suchen.500 bedeutet meist fehlende Registrierung oder CSR-Upload. Fehler-/Erfolgsprotokolle:

```text
2024-04-19 10:38:14.366 2333-2406/? E/RkpdWidevine: Server request for WV certs
failed. Error: 500
2024-04-19 10:38:14.368 2333-2406/? E/RkpdWidevine: WV Provisioning failed.
java.io.IOException: Failed to request WV certs. Error: 500
at
com.android.rkpdapp.provisioner.WidevineProvisioner.sendNetworkRequest(WidevineProvisioner.java:188)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.fetchWidevineCertificate(WidevineProvisioner.java:168)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.provisionWidevine(WidevineProvisioner.java:144)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.doWork(WidevineProvisioner.java:97)
at androidx.work.Worker$1.run(Worker.java:82)
at
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
at
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:644)
at java.lang.Thread.run(Thread.java:1012)
```

```text
Line 45913: 2024-05-15 20:17:52.504 2947-5376/? I/RkpdWidevine: Starting WV
provisioning. Current attempt: 0
Line 46152: 2024-05-15 20:17:53.843 2947-5376/? I/RkpdWidevine: Provisioning
successful.
```

Falls ungelöst: Boot-/DrmInfo-logcat, serielle Logs, Registrierungsdaten/Screenshots, adb bugreport und CSR bereitstellen. Bei4.0 System ID ungleich2147483647 und passend zur Registrierung. Quelle vermischt „Nicht-GMS/APFE“; nach2.2 unterscheiden.

### 6.4 Ton ohne Bild/grüne oder defekte Frames

Symptom und adb bugreport aufnehmen; XML aus5.2 und passende rk***-Einträge prüfen.

### 6.5 Gleichzeitig2.0/4.0?

Nur ein Modell pro Gerät, OEM entscheidet. Spezifikation schützt Videoausgabe, nicht Audio; Audioschutz ist fürLevel1 nicht erforderlich.

### 6.6 OEMCrypto-Version

Quelle empfiehlt neueste verfügbare Version. Abv18 verlangen neue Implementierungen4.0; ältere aufv18+ aktualisierte Geräte behalten Fertigungs-Provisioning. Tabelle ist Quellenstand, keine aktuelle Garantie:

|Android|Versionsdatum|MediaDRM HIDL|CDM|OEMCrypto(new)|OEMCrypto(upgrade)|
|---|---|---|---|---|---|
|Android15.0 V+|TBD|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy<br>udc-widevine-release|19.0.0(APEX)|19.1+|18.1|
|Android14.0 U+|2023-10|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy|18.0.0(APEX)|18.1+|17.1|
|Android13.0 T+|2022-08|android.hardware.drm-service.widevine<br>(tm-widevine-release)|17.0.0|17.1|16.3+|
|Android12.0 S+|2021-10|android.hardware.drm@1.4<br>sc-widevine-release|16.1.0|16.3 /16.4|16.3 /16.4|
|Android11.0 R+|2020-09|android.hardware.drm@1.3<br>rvc-widevine-release|16.0.0|16.3 /16.4|15.x /16.3 /16.4|

Doppelte HIDL-Einträge und Android15 „TBD“ bleiben erhalten, nicht als heutige Spezifikation aktualisiert.

### 6.7 Upload-Zeitpunkt

Daten vor Einschalten durch Endnutzer einzeln oder gesammelt hochladen; Aufzeichnungen für Google-Prüfung behalten.

## 7 Anhang: Android14-Code

Repository-Commits prüfen, fehlende Patches vonRK beziehen. Autorenangaben in technischen Commit-Daten bleiben erhalten.

### vendor/widevine

```text
commit 9f0b92744eeaa144629c6c2e0101d40a50160d7e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Wed May 15 15:15:24 2024 +0800
widevine : Add android LR version.
commit bab2013c13fdb22c5f244d38510c998da4c245ba (rk/rk35/mid/14.0/develop,
m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon Apr 22 09:07:46 2024 +0800
widevine : update opk to v18.5.
This version support widevine RKP.
```

### device/rockchip/common

```text
commit 56aa6a72e6f00753614fba71edef7261509320d6
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:28:03 2024 +0800
sepolicy : add sepolicy for widevine rkp csr provisioning.
-------------------------------------------------------------
commit b336ed61eff291ee0b9170e9a6415fd248a41428
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Dec 19 17:12:08 2023 +0800
media_drm : add PRODUCT_VENDOR_LINKER_CONFIG_FRAGMENTS configuration
for widevine L1.
```

### frameworks/av

```text
commit 1649daedd5a3fc8bc1a876c512fe657ee4132a80 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Wed Jul 12 12:50:41 2023 -0700
DrmRkpAdapter: only return HALs supporting get bcc
commit 0c588a79543ee1ae5a74c7a27bd4731161b8c409
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 11:54:57 2023 -0700
DrmRemotelyProvisionedComponent: assemble csr in adaptor
commit 72cc71abe5b8544f467e2e8e9d7f9930d0dc32e9
Author: Kyle Zhang <kelzhan@google.com>
Date: Thu Jun 15 00:16:42 2023 +0000
Create libmediadrmrkp as drm to irpc adapter library
```

### hardware/rockchip/keymaster4

```text
IR:
commit a6ba57b20d107ccf318fc678a1360fd963c8996e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon May 13 17:06:07 2024 +0800
rkp : add sepolicy for get serial number.
commit 7a176bf1ccf45cc0bc67b5dda8b855f6cfc057f3 (tag: android-14.0-mid-rkr4,
rk/rk35/mid/14.0/develop, m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:24:16 2024 +0800
rkp : support widevine rkp csr provisioning.
LR:
commit c6b01283afafe0ce4d9bf8ba22103ee0e33606dc
Author: callen.cai <callen.cai@rock-chips.com>
Date: Sat Jun 22 10:30:35 2024 +0800
rkp : Add LR version rkp csr tools.
```

### system/security

```text
commit 9b8fc62d77f0d7cf5f79efdaca53c2ee31c96dc0 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 13:07:35 2023 -0700
rkp_factory_extraction_tool: append drm CSRs
commit 36356e22faf3e78f0fbb90a03a4d750b15402395
Author: Robert Shih <robertshih@google.com>
Date: Wed Jun 28 15:32:45 2023 -0700
Export rkp_factory_extraction_tool on ci
```

### frameworks/native

Quelle verlangt diese manuelle Änderung:

```diff
diff --git a/libs/renderengine/skia/AutoBackendTexture.cpp b/libs/renderengine/skia/AutoBackendTexture.cpp
index 23c99b0796..acd7ae844b 100644
--- a/libs/renderengine/skia/AutoBackendTexture.cpp
+++ b/libs/renderengine/skia/AutoBackendTexture.cpp
@@ -44,7 +44,7 @@ AutoBackendTexture::AutoBackendTexture(GrDirectContext* context, AHardwareBuffer
isOutputBuffer);
mColorType =
GrAHardwareBufferUtils::GetSkColorTypeFromBufferFormat(desc.format);
if (!mBackendTexture.isValid() || !desc.width || !desc.height) {
- LOG_ALWAYS_FATAL("Failed to create a valid texture. [%p]:[%d,%d]
isProtected:%d "
+ ALOGE("Failed to create a valid texture. [%p]:[%d,%d] isProtected:%d "
"isWriteable:%d format:%d",
this, desc.width, desc.height, createProtectedImage,
isOutputBuffer,
desc.format);
```

## 8 Anhang: offizielle Referenzen(teils APFE erforderlich)

- [Provisioning4.0](https://developers.google.com/widevine/drm/specification/provisioning-4?hl=zh-cn)
- [Provisioning4.0 options](https://developers.google.com/widevine/drm/specification/provisioning-4/options?hl=zh-cn#device_key_database_model)
- [Testing / CSR upload](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp?hl=zh-cn#extract_and_upload_the_widevine_csr)
- [RKP FAQ](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp-faqs?hl=zh-cn#upload-update)
- [ArmSoM](https://docs.armsom.org/)

{% endraw %}
