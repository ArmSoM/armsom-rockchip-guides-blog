---
title: "Rockchip ISP30-Entwicklung: vollständiger Leitfaden zu RK3588, RkAiq-API und Debugging"
description: "Vollständige ISP30-V1.2.5-Referenz zu RkAiq-Systemsteuerung, AE/AWB/AF, Bildverarbeitungsmodulen, Abstimmung, Debugging und RK-RAW-Formaten."
translation_key: "078-rockchip-isp30-development"
slug: "078-rockchip-isp30-development"
lang: "de"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "RkAiq", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip RK3588 ISP30 RkAiq API"
excerpt: "Vollständige ISP30-V1.2.5-Referenz zu RkAiq-Systemsteuerung, AE/AWB/AF, Bildverarbeitungsmodulen, Abstimmung, Debugging und RK-RAW-Formaten."
---

{% raw %}

# Rockchip ISP30-Entwicklung: vollständiger Leitfaden zu RK3588, RkAiq-API und Debugging

Diese Plattformreferenz bewahrt den vollständigen technischen Haupttext der 436-seitigen englischen Quelle V1.2.5 (PDF S. 16–436), einschließlich RK-RAW-Formaten und abschließender Kapitel zu Fehlercodes und Abkürzungen. Ein entsprechendes chinesisches PDF wurde nicht bereitgestellt. Die chinesische, russische und deutsche Fassung sind vollständige Übersetzungen dieser englischen Version; alle 42 technischen Originalabbildungen stammen aus dem englischen PDF, einschließlich dort bereits vorhandener chinesischer Beschriftungen. Zehn bildbasierte RAW-Aufbau-/Formattabellen sind zusätzlich als editierbare Tabellen transkribiert. Keine Ganzseitenbilder ersetzen den Haupttext.

Die Quelle nennt RK3588 / Linux 5.10; BuildRoot und Android sind mit Y, Debian und Yocto mit N gekennzeichnet. Dies sind historische Quellenangaben, keine Unterstützungszusage für jedes BSP. Prüfen Sie für ArmSoM-Platinen zuerst den genauen SoC, die ISP-Generation, Sensor/VCM, Kernel, AIQ-Bibliothek, IQ-Datei und SDK/BSP-Zweig. ArmSoM Sige7 ist eine RK3588-Platine, die APIs und Beispiele dieses Artikels wurden jedoch nicht auf ihrer Hardware validiert. Alle Messungen und Beispiele stammen aus der Quelle; keine Hardwarebefehle oder Kamera-/Motoroperationen wurden ausgeführt.

**Unklarheiten der Quelle:** Wiederholte API-Überschriften, vermischte ISP-Generationen und Typen sowie widersprüchliche Einheiten, Standardwerte, Protokollstufen und RAW-Feldbeschreibungen bleiben erhalten und sind in den redaktionellen Anmerkungen aufgeführt. Werte und Bezeichner werden nicht stillschweigend korrigiert. Codekommentare bleiben in ihrer Originalsprache. Befehle und APIs können den Kamera- oder Motorzustand verändern; passen und prüfen Sie sie vor Verwendung.

[Redaktionelle Anmerkungen](/docs/rockchip-isp30-development/EDITORIAL-NOTES.md) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM-Kameradokumentation](https://docs.armsom.org/sige-family-started) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.16; unit 0 -->

## 1.   Gesamtüberblick

<!-- Source EN PDF p.16; unit 1 -->

### 1.1   Strukturdiagramm

<!-- Source EN PDF p.16; unit 2 -->

![Technische Originalabbildung — PDF S. 16](/docs/rockchip-isp30-development/assets/en-p016-X692.jpg)

<!-- Source EN PDF p.16; unit 3 -->

RK3588 VI umfasst als Sammelbegriff für Videoeingangsmodule:

<!-- Source EN PDF p.16; unit 4 -->

Schnittstellen und Datenerfassung: C/DPHY, DVP, CSI, VICAP

<!-- Source EN PDF p.16; unit 5 -->

Bildverarbeitung: ISP-0,ISP-1,FEC-0,FEC-1

<!-- Source EN PDF p.16; unit 6 -->

Der RK3588 ISP gehört zur Version RK ISP v3.0 und wird in der weiteren Dokumentation als ISP30 bezeichnet.

<!-- Source EN PDF p.16; unit 7 -->

### 1.2   Betriebsarten

<!-- Source EN PDF p.16; unit 8 -->

Einzelner ISP, einzelner CIS (CMOS Image Sensor):

<!-- Source EN PDF p.16; unit 9 -->

RAW-Durchleitungs-/Online-Modus: Die blauen Pfeile im Blockdiagramm zeigen den Datenflusspfad 1.0.

<!-- Source EN PDF p.16; unit 10 -->

Raw-Rücklese-/Offline-Modus: Die orangefarbenen Pfeile im Blockdiagramm zeigen die Datenflusspfade 1.1 und 1.2.

<!-- Source EN PDF p.16; unit 11 -->

Dual-ISP-2-in-1-Modus für einen einzelnen CIS:

<!-- Source EN PDF p.16; unit 12 -->

Im 2-in-1-Modus verarbeiten ISP-0/ISP-1 den linken und rechten Teil eines einzelnen CIS-Bildes getrennt, um CIS mit hoher Auflösung zu unterstützen.

<!-- Source EN PDF p.16; unit 13 -->

Mehrere CIS:

<!-- Source EN PDF p.17; unit 14 -->

Ein einzelner ISP verwendet den Raw-Rücklese-/Offline-Modus und kann dadurch mehrere CIS-Eingänge im Zeitmultiplexbetrieb unterstützen.

<!-- Source EN PDF p.17; unit 15 -->

### 1.3   Überblick über Leistung und Einschränkungen

<!-- Source EN PDF p.17; unit 16 -->

Unterstützte Auflösungen und Durchsatz:

<!-- Source EN PDF p.17; unit 17 -->

| Betriebsart | Durchsatz | Maximale<br>Auflösung | Kleinste unterstützte<br>Auflösung |
|---|---|---|---|
| Einzelner ISP, einzelner CIS | 16Mega@30fps | 4672x3504 | 208x128 |
| Dual-ISP-2-in-1, einzelner<br>CIS | 32Mega@30fps | 8064x6048 | \ |

<!-- Source EN PDF p.17; unit 18 -->

Unterstützung für Raw12-Dateneingang.

<!-- Source EN PDF p.17; unit 19 -->

ISP30 unterstützt die Verarbeitung von Raw12-Daten. Bei Raw14-Eingang werden die niederwertigen Bits für die Raw12-Verarbeitung verworfen. Bei Bilddaten mit weniger als 12 Bit werden die niederwertigen Bits zur Raw12-Verarbeitung ergänzt.

<!-- Source EN PDF p.17; unit 20 -->

Unterstützung für Bayer-Farb-CIS und Mono-CIS.

<!-- Source EN PDF p.17; unit 21 -->

Unterstützung für 3-in-1-Mehrbild-HDR. Folgende HDR-CIS-Typen werden unterstützt:

<!-- Source EN PDF p.17; unit 22 -->

| HDR mit Mehrfachbelichtung | Unterstützung durch RK-Plattform | CIS | Anwendung |
|---|---|---|---|
| Sequential / Framebase HDR | ISP20: RV1109/RV1126 usw.<br>ISP21: RK356X usw.<br>ISP30: RK3588<br>ISP32: RV1106 | OV4689 | IPC/CVR |
| Staggered / DOL HDR | ISP20: RV1109/RV1126 usw.<br>ISP21: RK356X usw.<br>ISP30: RK3588<br>ISP32: RV1106 | OS04A10<br>IMX464<br>AR0239 | IPC/CVR |
| DCG HDR | ISP20: RV1109/RV1126 usw.<br>ISP21: RK356X usw.<br>ISP30: RK3588<br>ISP32: RV1106 | OS04A10<br>IMX585 | IPC/CVR |
| SME HDR | N | IMX378 | Verbrauchergeräte |
| BME HDR | N | IMX258 | Verbrauchergeräte |
| QBC HDR | N | OV50C40<br>IMX586 | Verbrauchergeräte |
| Lateral overflow HDR | N | AR0821 | IPC |
| Splite-diode pixel HDR | N | OV10640 | CVR |

<!-- Source EN PDF p.17; unit 23 -->

Geringste Latenz bis zur Benachrichtigung über die ISP30-Datenausgabe nach DDR im Raw-Durchleitungs-/Online-Modus: ungefähr Übertragungszeit eines Bildes/15.

<!-- Source EN PDF p.18; unit 24 -->

Im ISP-Zeitmultiplexmodus unterstützt ein einzelner ISP bis zu vier Datenquelleneingänge.

<!-- Source EN PDF p.18; unit 25 -->

Im RAW-Durchleitungs-/Online-Modus beträgt die minimale Bildaustastung 136 Zeilen und die minimale Zeilenaustastung 16 Pixel.

<!-- Source EN PDF p.18; unit 26 -->

Das CSM-Modul unterstützt keine Umwandlung auf den begrenzten YUV-Wertebereich; Einzelheiten siehe API-Beschreibung des IMGPROC/CSM-Moduls.

<!-- Source EN PDF p.18; unit 27 -->

## 2.   Überblick

<!-- Source EN PDF p.18; unit 28 -->

ISP30 umfasst eine Reihe von Bildverarbeitungsalgorithmusmodulen, insbesondere Dunkelstromkorrektur, Defektpixelkorrektur, 3A, HDR, Objektivschattierungskorrektur, Objektivverzeichnungskorrektur, 3DLUT, Rauschunterdrückung (einschließlich RAW-Domäne, Mehrbild-Rauschunterdrückung und Farbrauschunterdrückung), Schärfung usw.

<!-- Source EN PDF p.18; unit 29 -->

ISP30 umfasst eine Hardwareimplementierung der Algorithmen und einen Teil zur logischen Softwaresteuerung. RkAiq implementiert die logische Softwaresteuerung.

<!-- Source EN PDF p.18; unit 30 -->

Die Hauptfunktionen des RkAiq-Softwaremoduls sind das Abrufen von Bildstatistiken vom ISP-Treiber, ihre Kombination mit IQ-Abstimmparametern und die Berechnung neuer ISP-, Sensor- und weiterer Hardwareparameter durch eine Reihe von Algorithmen. Dieser Vorgang wird kontinuierlich wiederholt, um schließlich die beste Bildwirkung zu erzielen.

<!-- Source EN PDF p.18; unit 31 -->

### 2.1   Funktionsbeschreibung

<!-- Source EN PDF p.18; unit 32 -->

![Technische Originalabbildung — PDF S. 18](/docs/rockchip-isp30-development/assets/en-p018-X701.png)

<!-- Source EN PDF p.18; unit 33 -->

Abbildung 1-1 ISP21-Systemblockdiagramm

<!-- Source EN PDF p.18; unit 34 -->

Das gesamte Software-/Hardwareblockdiagramm von ISP30 ist in Abbildung 1-1 dargestellt. Der Sensor liefert einen Datenstrom an ISP HW, das nach einer Reihe von Bildverarbeitungsalgorithmen das Bild ausgibt. RkAiq ruft kontinuierlich statistische Daten von ISP HW ab und erzeugt mit Algorithmen wie 3A neue Parameter zur Rückkopplung an jedes Hardwaremodul. Das Abstimmwerkzeug kann Parameter online in Echtzeit abstimmen; anschließend lässt sich eine neue IQ-Parameterdatei speichern und erzeugen.

<!-- Source EN PDF p.19; unit 35 -->

### 2.2   RkAiq-Architektur

<!-- Source EN PDF p.19; unit 36 -->

![Technische Originalabbildung — PDF S. 19](/docs/rockchip-isp30-development/assets/en-p019-X706.png)

<!-- Source EN PDF p.19; unit 37 -->

Abbildung 1-2 Gesamtarchitektur von RkAiq

<!-- Source EN PDF p.19; unit 38 -->

1\. Das Softwarekonzept von ISP30 RkAiq ist in Abbildung 1-2 dargestellt. Es gliedert sich hauptsächlich in folgende vier Teile:

<!-- Source EN PDF p.19; unit 39 -->

1\. Dynamische Bibliothek RkAiq lib. Diese Bibliothek enthält die Hauptlogik, die Statistiken vom Treiber abruft und an die einzelnen Algorithmusbibliotheken weiterleitet.

<!-- Source EN PDF p.19; unit 40 -->

2\. Integrierte Algorithmusbibliotheken. Die von Rk bereitgestellte statische Algorithmusbibliothek wird standardmäßig bei der dynamischen Bibliothek RkAiq lib registriert.

<!-- Source EN PDF p.19; unit 41 -->

3\. Kundeneigene 3A-Bibliotheken. Kunden können entsprechend der Schnittstellendefinition eigene 3A- oder andere Algorithmusbibliotheken implementieren. Nach Registrierung einer eigenen Algorithmusbibliothek bei der dynamischen Bibliothek RkAiq lib lässt sich über die bereitgestellte Schnittstelle auswählen, ob die eigene oder die Rk-Bibliothek ausgeführt wird.

<!-- Source EN PDF p.19; unit 42 -->

4\. IQ-Datei. Ergebnisdateien der IQ-Abstimmung speichern algorithmusbezogene Parameter sowie einige statische Systemparameter, beispielsweise zum CIS.

<!-- Source EN PDF p.20; unit 43 -->

### 2.3   Softwarearchitektur

<!-- Source EN PDF p.20; unit 44 -->

![Technische Originalabbildung — PDF S. 20](/docs/rockchip-isp30-development/assets/en-p020-X710.png)

<!-- Source EN PDF p.20; unit 45 -->

Abbildung 1-3 Blockdiagramm der Softwarearchitektur

<!-- Source EN PDF p.20; unit 46 -->

Das ISP30-Softwareblockdiagramm in Abbildung 1-3 gliedert sich hauptsächlich in folgende drei Schichten:

<!-- Source EN PDF p.20; unit 47 -->

1\. Kernelschicht. Sie enthält alle Hardwaretreiber des Kamerasystems, insbesondere ISP-, Sensor-, VCM-, Blitzlicht- und IrCutter-Treiber usw. Die Treiber basieren auf V4L2 und dem Media-Framework.

<!-- Source EN PDF p.20; unit 48 -->

2\. Framework-Schicht. Diese Schicht integriert RkAiq lib auf zwei mögliche Arten:

<!-- Source EN PDF p.20; unit 49 -->

IspServer-Modus: Rkaiq lib läuft in einem eigenständigen IspServer-Prozess, mit dem der Client über dbus kommuniziert. Außerdem kann dieser Ansatz bestehenden Drittanwendungen wie v4L-CTL ohne Quellcodeänderung Bilder mit ISP-Abstimmwirkung bereitstellen.

<!-- Source EN PDF p.20; unit 50 -->

Direkte Integration: RkAiq lib kann direkt in Anwendungen integriert werden.

<!-- Source EN PDF p.20; unit 51 -->

3\. Benutzerschicht. Anwendungsschicht des Benutzers.

<!-- Source EN PDF p.21; unit 52 -->

### 2.4   Softwareabläufe

<!-- Source EN PDF p.22; unit 53 -->

![Technische Originalabbildung — PDF S. 22](/docs/rockchip-isp30-development/assets/en-p022-X717.png)

<!-- Source EN PDF p.23; unit 54 -->

Abbildung 1-4 Ablaufdiagramm

<!-- Source EN PDF p.23; unit 55 -->

Der Aufrufablauf der RkAiq-Schnittstellen ist in Abbildung 1-4 dargestellt. Gestrichelt umrahmte Teile sind optional; die blaue Schrift kennzeichnet die Konfiguration, die die Anwendung zusammen mit dem RkAiq-Ablauf verwenden muss.

<!-- Source EN PDF p.23; unit 56 -->

configure media pipeline: Optional die ISP30-Pipeline konfigurieren, beispielsweise die Sensorausgangsauflösung; der Treiber besitzt eine Standardkonfiguration. rk_aiq_uapi2_sysctl_init: RkAiq einschließlich der IQ-Abstimmparameter und verschiedener Algorithmusbibliotheken initialisieren. other Aiq or algo params uapis: Optional erforderliche Parameter über die APIs der einzelnen Algorithmen konfigurieren und Drittanbieter-Algorithmusbibliotheken registrieren. rk_aiq_uapi2_sysctl_prepare: Die Initialisierungsparameter jeder Algorithmusbibliothek und jedes Hardwaremoduls vorbereiten und an den Treiber übergeben.

<!-- Source EN PDF p.23; unit 57 -->

video capture start: Dieser Vorgang aktiviert den ISP-Datenfluss der Anwendung und muss nach rk_aiq_uapi2_sysctl_prepare aufgerufen werden.

<!-- Source EN PDF p.23; unit 58 -->

rk_aiq_uapi2_sysctl_start: Den internen RkAiq-Ablauf starten. Nach erfolgreichem Schnittstellenaufruf beginnt der Sensor mit der Datenausgabe; der ISP verarbeitet die Daten und gibt das verarbeitete Bild aus.

<!-- Source EN PDF p.23; unit 59 -->

Rkaiq running: RkAiq ruft kontinuierlich Statistiken vom ISP-Treiber ab, berechnet mit Algorithmen wie 3A neue Parameter und wendet sie auf den Treiber an. PC Online Tuning Tool: Der PC kann die Parameter online über das Abstimmwerkzeug anpassen. video capture stop: Vor dem Stoppen des RkAiq-Ablaufs muss der Datenfluss angehalten werden. rk_aiq_uapi2_sysctl_stop: Den laufenden RkAiq-Ablauf stoppen. Sie können Parameter anpassen und erneut starten oder direkt erneut starten.

<!-- Source EN PDF p.23; unit 60 -->

rk_aiq_uapi2_sysctl_deinit: RkAiq deinitialisieren.

<!-- Source EN PDF p.23; unit 61 -->

### 2.5   API-Beschreibung

<!-- Source EN PDF p.23; unit 62 -->

Die von RKAiq bereitgestellten APIs sind in zwei Ebenen unterteilt: funktionsbezogene und modulbezogene APIs.

<!-- Source EN PDF p.23; unit 63 -->

Funktionsbezogene API: Kapselt modulbezogene APIs und richtet sich hauptsächlich an Produktanwendungen mit einfachen, auf Modulfunktionen basierenden Aufgaben.

<!-- Source EN PDF p.23; unit 64 -->

Modulbezogene API: Detaillierte Parametereinstellung und -abfrage für das jeweilige Modul ohne funktionale Unterteilung der API.

<!-- Source EN PDF p.23; unit 65 -->

Die modulbezogenen APIs von RKAiq unterstützen synchrone und asynchrone Modi. Funktionsbezogene APIs kapseln standardmäßig den synchronen Modus der modulbezogenen APIs.

<!-- Source EN PDF p.23; unit 66 -->

Synchroner Modus (Sync): Diese API arbeitet blockierend. AIQ aktualisiert Parameter grundsätzlich bildweise; im synchronen Modus kann der aufrufende Thread für eine Zeit &lt;= der Videobildperiode blockiert werden.

<!-- Source EN PDF p.23; unit 67 -->

Asynchroner Modus (ASync): Diese API arbeitet nicht blockierend. Das AIQ-Framework speichert API-Einstellparameter im internen Parameterpuffer und überträgt zum jeweiligen Zeitpunkt die neuesten ISP-Parameter an die Hardware.

<!-- Source EN PDF p.23; unit 68 -->

Hinweise zur Verwendung synchroner und asynchroner Modi modulbezogener APIs

<!-- Source EN PDF p.23; unit 69 -->

Die zweite Parameterstruktur einer modulbezogenen API enthält gewöhnlich die Einstellparameter und wird Eigenschaftsstruktur genannt. Ihre internen rk_aiq_uapi_sync_t-Elemente konfigurieren den Aufrufmodus der jeweiligen API; Einzelheiten enthalten folgende Datentypen:

<!-- Source EN PDF p.24; unit 70 -->

#### 2.5.1  rk_aiq_uapi_sync_t

<!-- Source EN PDF p.24; unit 71 -->

【Beschreibung】 Synchronisationsmodus des Moduls

<!-- Source EN PDF p.24; unit 72 -->

【Definition】

<!-- Source EN PDF p.24; unit 73 -->

```text
 typedef struct rk_aiq_uapi_sync_s {
     rk_aiq_uapi_mode_sync_e     sync_mode;
     bool                        done;
 } rk_aiq_uapi_sync_t;
```

<!-- Source EN PDF p.24; unit 74 -->

【Felder】

<!-- Source EN PDF p.24; unit 75 -->

| Elementname | Beschreibung |
|---|---|
| sync_mode | @setAttrib: Kennzeichen für den Parameteraktualisierungsmodus;<br>RK_AIQ_UAPI_MODE_DEFAULT: Standardmäßig synchroner Modus.<br>RK_AIQ_UAPI_MODE_SYNC: Synchroner Modus.<br>RK_AIQ_UAPI_MODE_ASYNC: Asynchroner Modus.<br>@getAttrib:<br>RK_AIQ_UAPI_MODE_DEFAULT: Standardmäßig zuletzt gesetzte Eigenschaften abrufen (sync_mode ==<br>RK_AIQ_UAPI_MODE_ASYNC); möglicherweise noch nicht wirksam.<br>RK_AIQ_UAPI_MODE_SYNC: Aktuell verwendete Eigenschaften abrufen.<br>RK_AIQ_UAPI_MODE_ASYNC: Wie RK_AIQ_UAPI_MODE_DEFAULT. |
| done | @done (parsm out): Kennzeichen für den Parameteraktualisierungsstatus;<br>true bei aktualisierten Parametern, false bei noch nicht aktualisierten Parametern. |

<!-- Source EN PDF p.24; unit 76 -->

Der AIQ-API-Referenzcode ist nach Modulen gegliedert und enthält separate API-Beispiele; Kunden wird empfohlen, diese direkt als Referenz zu verwenden.

<!-- Source EN PDF p.24; unit 77 -->

rkisp_demo/demo/sample

<!-- Source EN PDF p.25; unit 78 -->

| Dateiname | Modul |
|---|---|
| sample_3dlut_module.cpp | 3DLUT |
| sample_ccm_module.cpp | CCM |
| sample_csm_module.cpp | CSM |
| sample_ablc_module.cpp | BLC |
| sample_abayer2dnr_module.cpp | BayerNR 2D |
| sample_abayertnr_module.cpp | BayerNR 3D |
| sample_aynr_module.cpp | YNR |
| sample_acnr_module.cpp | CNR |
| sample_asharp_module.cpp | Sharp |
| sample_amerge_module.cpp | Merge(HDR) |
| sample_adrc_module.cpp | DRC |
| sample_adehaze_module.cpp | Dunstentfernung &amp; Verbesserung |
| sample_agamma_module.cpp | Gamma |
| sample_awb_module.cpp | AWB |
| sample_ae_module.cpp | AE |
| sample_af_module.cpp | AF |

<!-- Source EN PDF p.25; unit 79 -->

## 3.   Systemsteuerung

<!-- Source EN PDF p.25; unit 80 -->

### 3.1   Funktionsüberblick

<!-- Source EN PDF p.25; unit 81 -->

Die Systemsteuerung umfasst die Konfiguration allgemeiner AIQ-Eigenschaften, Initialisierung, Ausführung und Beendigung von AIQ, Einstellung von AIQ-Modulen und weitere Funktionen.

<!-- Source EN PDF p.25; unit 82 -->

### 3.2   API-Referenz

<!-- Source EN PDF p.25; unit 83 -->

#### 3.2.1  rk_aiq_uapi2_sysctl_preInit

<!-- Source EN PDF p.25; unit 84 -->

【Beschreibung】 Vor der AIQ-Initialisierung einige Parameter voreinstellen, beispielsweise die verwendete IQ-Datei.

<!-- Source EN PDF p.25; unit 85 -->

【Syntax】

<!-- Source EN PDF p.26; unit 86 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit (const char* sns_ent_name,
                          rk_aiq_working_mode_t mode,
                          const char* force_iq_file);
```

<!-- Source EN PDF p.26; unit 87 -->

【Parameter】

<!-- Source EN PDF p.26; unit 88 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sns_ent_name | Sensor-Entitätsname | Eingabe |
| mode | ISP-Betriebsart | Eingabe |
| force_iq_file | Erzwungene IQ-Datei | Eingabe |

<!-- Source EN PDF p.26; unit 89 -->

【Rückgabewert】

<!-- Source EN PDF p.26; unit 90 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.26; unit 91 -->

【Voraussetzungen】

<!-- Source EN PDF p.26; unit 92 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.26; unit 93 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.26; unit 94 -->

【Hinweis】

<!-- Source EN PDF p.26; unit 95 -->

Muss vor rk_aiq_uapi2_sysctl_init aufgerufen werden.

<!-- Source EN PDF p.26; unit 96 -->

Der Parameter mode dient nur zur Auswahl von IQ-Dateien und konfiguriert nicht die ISP-Betriebsart. Diese muss in rk_aiq_uapi2_sysctl_prepare konfiguriert werden. Ist force_iq_file nicht leer, ist der Parameter mode unwirksam.

<!-- Source EN PDF p.26; unit 97 -->

Der Parameter force_iq_file enthält den vollständigen Pfad.

<!-- Source EN PDF p.26; unit 98 -->

Diese Funktion ist optional und dient nur zur Änderung einiger Standardeinstellungen vor rk_aiq_uapi2_sysctl_init.

<!-- Source EN PDF p.26; unit 99 -->

#### 3.2.2  rk_aiq_uapi2_sysctl_preInit_scene

<!-- Source EN PDF p.26; unit 100 -->

【Beschreibung】 Vor der AIQ-Initialisierung die IQ-Szenarioparameter auswählen.

<!-- Source EN PDF p.26; unit 101 -->

【Syntax】

<!-- Source EN PDF p.26; unit 102 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit_scene (const char* sns_ent_name,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.26; unit 103 -->

【Parameter】

<!-- Source EN PDF p.27; unit 104 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sns_ent_name | Sensor-Entitätsname | Eingabe |
| main_scene | Hauptszene; die Werte sind in der IQ-Datei definiert | Eingabe |
| sub_scene | Unterszenen; die Werte sind in der IQ-Datei definiert | Eingabe |

<!-- Source EN PDF p.27; unit 105 -->

【Rückgabewert】

<!-- Source EN PDF p.27; unit 106 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.27; unit 107 -->

【Voraussetzungen】

<!-- Source EN PDF p.27; unit 108 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.27; unit 109 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.27; unit 110 -->

【Hinweis】

<!-- Source EN PDF p.27; unit 111 -->

Muss vor rk_aiq_uapi2_sysctl_init aufgerufen werden.

<!-- Source EN PDF p.27; unit 112 -->

main_scene muss anhand des Hauptszenen-Arrays in der IQ-Datei ausgewählt werden; der Standardwert lautet gewöhnlich "normal".

<!-- Source EN PDF p.27; unit 113 -->

sub_scene muss anhand des Unterszenen-Arrays innerhalb der Hauptszene in der IQ-Datei ausgewählt werden; der Standardwert lautet gewöhnlich "day".

<!-- Source EN PDF p.27; unit 114 -->

Da standardmäßig normal-day gewählt wird, muss für hdr-day oder andere benutzerdefinierte Modi diese Funktion zur expliziten Auswahl aufgerufen werden. Andernfalls können die IQ-Parameter falsch sein.

<!-- Source EN PDF p.27; unit 115 -->

#### 3.2.3  rk_aiq_uapi2_sysctl_switch_scene

<!-- Source EN PDF p.27; unit 116 -->

【Beschreibung】 Nach der AIQ-Initialisierung die IQ-Szenarioparameter umschalten.

<!-- Source EN PDF p.27; unit 117 -->

【Syntax】

<!-- Source EN PDF p.27; unit 118 -->

```text
 int
 rk_aiq_uapi2_sysctl_switch_scene (const rk_aiq_sys_ctx_t* sys_ctx,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.27; unit 119 -->

【Parameter】

<!-- Source EN PDF p.27; unit 120 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| main_scene | Hauptszene; die Werte sind in der IQ-Datei definiert | Eingabe |
| sub_scene | Unterszenen; die Werte sind in der IQ-Datei definiert | Eingabe |

<!-- Source EN PDF p.28; unit 121 -->

【Rückgabewert】

<!-- Source EN PDF p.28; unit 122 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.28; unit 123 -->

【Voraussetzungen】

<!-- Source EN PDF p.28; unit 124 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.28; unit 125 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.28; unit 126 -->

【Hinweis】

<!-- Source EN PDF p.28; unit 127 -->

Nach rk_aiq_uapi2_sysctl_init aufrufen.

<!-- Source EN PDF p.28; unit 128 -->

main_scene muss anhand des Hauptszenen-Arrays in der IQ-Datei ausgewählt werden.

<!-- Source EN PDF p.28; unit 129 -->

sub_scene muss anhand des Unterszenen-Arrays innerhalb der Hauptszene in der IQ-Datei ausgewählt werden.

<!-- Source EN PDF p.28; unit 130 -->

Diese Schnittstelle schaltet IQ dynamisch um. Dies ist derzeit unzureichend getestet und kann unerwartete Ergebnisse verursachen; daher vorsichtig verwenden.

<!-- Source EN PDF p.28; unit 131 -->

#### 3.2.4  rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.28; unit 132 -->

【Beschreibung】 AIQ-Kontext initialisieren.

<!-- Source EN PDF p.28; unit 133 -->

【Syntax】

<!-- Source EN PDF p.28; unit 134 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_sysctl_init (const char* sns_ent_name,
                          const char* iq_file_dir,
                          rk_aiq_error_cb err_cb,
                          rk_aiq_metas_cb metas_cb);
```

<!-- Source EN PDF p.28; unit 135 -->

【Parameter】

<!-- Source EN PDF p.28; unit 136 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sns_ent_name | Sensor-Entitätsname | Eingabe |
| iq_file_dir | Pfad der Kalibrierparameterdatei | Eingabe |
| err_cb | Fehler-Callback-Funktion; kann NULL sein | Eingabe |
| metas_cb | Metadaten-Callback-Funktion; kann NULL sein | Eingabe |

<!-- Source EN PDF p.28; unit 137 -->

【Rückgabewert】

<!-- Source EN PDF p.28; unit 138 -->

| Rückgabewert | Beschreibung |
|---|---|
| rk_aiq_sys_ctx_t* | AIQ-Kontextzeiger |

<!-- Source EN PDF p.29; unit 139 -->

【Voraussetzungen】

<!-- Source EN PDF p.29; unit 140 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 141 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.29; unit 142 -->

【Hinweis】

<!-- Source EN PDF p.29; unit 143 -->

Muss vor anderen Funktionsaufrufen erfolgen.

<!-- Source EN PDF p.29; unit 144 -->

#### 3.2.5  rk_aiq_uapi2_sysctl_deinit

<!-- Source EN PDF p.29; unit 145 -->

【Beschreibung】 AIQ-Kontext deinitialisieren.

<!-- Source EN PDF p.29; unit 146 -->

【Syntax】

<!-- Source EN PDF p.29; unit 147 -->

```text
 void
 rk_aiq_uapi2_sysctl_deinit( rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.29; unit 148 -->

【Parameter】

<!-- Source EN PDF p.29; unit 149 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.29; unit 150 -->

【Rückgabewert】

<!-- Source EN PDF p.29; unit 151 -->

| Rückgabewert | Beschreibung |
|---|---|
| Keiner | Keiner |

<!-- Source EN PDF p.29; unit 152 -->

【Voraussetzungen】

<!-- Source EN PDF p.29; unit 153 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 154 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.29; unit 155 -->

【Hinweis】

<!-- Source EN PDF p.29; unit 156 -->

Darf nicht aufgerufen werden, während sich AIQ im gestarteten Zustand befindet.

<!-- Source EN PDF p.29; unit 157 -->

#### 3.2.6  rk_aiq_uapi2_sysctl_prepare

<!-- Source EN PDF p.29; unit 158 -->

【Beschreibung】 AIQ-Ausführungsumgebung vorbereiten.

<!-- Source EN PDF p.29; unit 159 -->

【Syntax】

<!-- Source EN PDF p.29; unit 160 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_prepare(const rk_aiq_sys_ctx_t* ctx,
                            uint32_t  width,
                            uint32_t  height,
                            rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.30; unit 161 -->

【Parameter】

<!-- Source EN PDF p.30; unit 162 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| width | Breite der Sensorausgangsauflösung; dient nur zur<br>Überprüfung | Eingabe |
| height | Höhe der Sensorausgangsauflösung; dient nur zur<br>Überprüfung | Eingabe |
| mode | Betriebsart der ISP-Pipeline (NORMAL/HDR) | Eingabe |

<!-- Source EN PDF p.30; unit 163 -->

【Rückgabewert】

<!-- Source EN PDF p.30; unit 164 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.30; unit 165 -->

【Voraussetzungen】

<!-- Source EN PDF p.30; unit 166 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.30; unit 167 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.30; unit 168 -->

【Hinweis】

<!-- Source EN PDF p.30; unit 169 -->

Muss vor rk_aiq_uapi2_sysctl_start aufgerufen werden.

<!-- Source EN PDF p.30; unit 170 -->

Wenn diese Funktion nach rk_aiq_uapi2_sysctl_start benötigt wird, rufen Sie zuerst rk_aiq_uapi2_sysctl_stop und anschließend rk_aiq_uapi2_sysctl_prepare auf, um die Ausführungsumgebung erneut vorzubereiten.

<!-- Source EN PDF p.30; unit 171 -->

#### 3.2.7  rk_aiq_uapi2_sysctl_start

<!-- Source EN PDF p.30; unit 172 -->

【Beschreibung】 AIQ-Steuerungssystem starten. Nach dem Start ruft AIQ kontinuierlich 3A-Statistiken vom ISP-Treiber ab, führt den 3A-Algorithmus aus und wendet die neu berechneten Parameter an.

<!-- Source EN PDF p.30; unit 173 -->

【Syntax】

<!-- Source EN PDF p.30; unit 174 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_start(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.30; unit 175 -->

【Parameter】

<!-- Source EN PDF p.30; unit 176 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.30; unit 177 -->

【Rückgabewert】

<!-- Source EN PDF p.31; unit 178 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.31; unit 179 -->

【Voraussetzungen】

<!-- Source EN PDF p.31; unit 180 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 181 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.31; unit 182 -->

【Hinweis】

<!-- Source EN PDF p.31; unit 183 -->

Muss nach rk_aiq_uapi2_sysctl_prepare aufgerufen werden.

<!-- Source EN PDF p.31; unit 184 -->

#### 3.2.8  rk_aiq_uapi2_sysctl_stop

<!-- Source EN PDF p.31; unit 185 -->

【Beschreibung】 AIQ-Steuerungssystem stoppen.

<!-- Source EN PDF p.31; unit 186 -->

【Syntax】

<!-- Source EN PDF p.31; unit 187 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_stop(const rk_aiq_sys_ctx_t* ctx, bool keep_ext_hw_st);
```

<!-- Source EN PDF p.31; unit 188 -->

【Parameter】

<!-- Source EN PDF p.31; unit 189 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| keep_ext_hw_st | Ob nach dem Stoppen der Zustand externer Geräte wie<br>(ircut/cpsl) unverändert bleibt | Eingabe |

<!-- Source EN PDF p.31; unit 190 -->

【Rückgabewert】

<!-- Source EN PDF p.31; unit 191 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.31; unit 192 -->

【Voraussetzungen】

<!-- Source EN PDF p.31; unit 193 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 194 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.32; unit 195 -->

#### 3.2.9  rk_aiq_uapi2_sysctl_getStaticMetas

<!-- Source EN PDF p.32; unit 196 -->

【Beschreibung】 Die zum Sensor gehörenden statischen Informationen wie Auflösung, Datenformat usw. abfragen.

<!-- Source EN PDF p.32; unit 197 -->

【Syntax】

<!-- Source EN PDF p.32; unit 198 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getStaticMetas(const char* sns_ent_name,
 rk_aiq_static_info_t* static_info);
```

<!-- Source EN PDF p.32; unit 199 -->

【Parameter】

<!-- Source EN PDF p.32; unit 200 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sns_ent_name | Sensor-Entitätsname | Eingabe |
| static_info | Zeiger auf die Struktur mit statischen Informationen | Ausgabe |

<!-- Source EN PDF p.32; unit 201 -->

【Rückgabewert】

<!-- Source EN PDF p.32; unit 202 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.32; unit 203 -->

【Voraussetzungen】

<!-- Source EN PDF p.32; unit 204 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.32; unit 205 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.32; unit 206 -->

#### 3.2.10  rk_aiq_uapi2_sysctl_enumStaticMetas

<!-- Source EN PDF p.32; unit 207 -->

【Beschreibung】 Die von AIQ ermittelten statischen Informationen aufzählen.

<!-- Source EN PDF p.32; unit 208 -->

【Syntax】

<!-- Source EN PDF p.32; unit 209 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enumStaticMetas(int index, rk_aiq_static_info_t*
 static_info);
```

<!-- Source EN PDF p.32; unit 210 -->

【Parameter】

<!-- Source EN PDF p.32; unit 211 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| index | Indexnummer, beginnend bei 0 | Eingabe |
| static_info | Zeiger auf die Struktur mit statischen Informationen | Ausgabe |

<!-- Source EN PDF p.32; unit 212 -->

【Rückgabewert】

<!-- Source EN PDF p.33; unit 213 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.33; unit 214 -->

【Voraussetzungen】

<!-- Source EN PDF p.33; unit 215 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 216 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.33; unit 217 -->

#### 3.2.11  rk_aiq_uapi2_sysctl_enableAxlib

<!-- Source EN PDF p.33; unit 218 -->

【Beschreibung】 Ausführungszustand der benutzerdefinierten Algorithmusbibliothek einstellen.

<!-- Source EN PDF p.33; unit 219 -->

【Syntax】

<!-- Source EN PDF p.33; unit 220 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enableAxlib(const rk_aiq_sys_ctx_t* ctx,
                                const int algo_type,
                                const int lib_id,
                                bool enable);
```

<!-- Source EN PDF p.33; unit 221 -->

【Parameter】

<!-- Source EN PDF p.33; unit 222 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| algo_type | Typ des zu bearbeitenden Algorithmusmoduls | Eingabe |
| lib_id | Kennungs-ID der Algorithmusbibliothek | Eingabe |
| enable | Statuseinstellung | Eingabe |

<!-- Source EN PDF p.33; unit 223 -->

【Rückgabewert】

<!-- Source EN PDF p.33; unit 224 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.33; unit 225 -->

【Voraussetzungen】

<!-- Source EN PDF p.33; unit 226 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 227 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.33; unit 228 -->

【Hinweis】

<!-- Source EN PDF p.33; unit 229 -->

Wenn lib_id der aktuell ausgeführten Algorithmusbibliothek entspricht, kann diese Funktion in jedem Zustand außer dem nicht initialisierten aufgerufen werden.

<!-- Source EN PDF p.34; unit 230 -->

In anderen Fällen darf sie nur im vorbereiteten Zustand aufgerufen werden. Die durch algo_type bezeichnete Algorithmusbibliothek wird dann durch die neue Bibliothek mit der Kennung lib_id ersetzt.

<!-- Source EN PDF p.34; unit 231 -->

#### 3.2.12  rk_aiq_uapi2_sysctl_getAxlibStatus

<!-- Source EN PDF p.34; unit 232 -->

【Beschreibung】 Zustand der Algorithmusbibliothek abrufen.

<!-- Source EN PDF p.34; unit 233 -->

【Syntax】

<!-- Source EN PDF p.34; unit 234 -->

```text
 bool
 rk_aiq_uapi2_sysctl_getAxlibStatus(const rk_aiq_sys_ctx_t* ctx,
                                   const int algo_type,
                                   const int lib_id);
```

<!-- Source EN PDF p.34; unit 235 -->

【Parameter】

<!-- Source EN PDF p.34; unit 236 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| algo_type | Typ des zu bearbeitenden Algorithmusmoduls | Eingabe |
| lib_id | Kennungs-ID der Algorithmusbibliothek | Eingabe |

<!-- Source EN PDF p.34; unit 237 -->

【Rückgabewert】

<!-- Source EN PDF p.34; unit 238 -->

| Rückgabewert | Beschreibung |
|---|---|
| false | Deaktivierter Zustand |
| true | Aktivierter Zustand |

<!-- Source EN PDF p.34; unit 239 -->

【Voraussetzungen】

<!-- Source EN PDF p.34; unit 240 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.34; unit 241 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.34; unit 242 -->

#### 3.2.13  rk_aiq_uapi2_sysctl_getEnabledAxlibCtx

<!-- Source EN PDF p.34; unit 243 -->

【Beschreibung】 Kontextstruktur der aktivierten Algorithmusbibliothek abrufen.

<!-- Source EN PDF p.34; unit 244 -->

【Syntax】

<!-- Source EN PDF p.34; unit 245 -->

```text
 const RkAiqAlgoContext*
 rk_aiq_uapi2_sysctl_getEnabledAxlibCtx(const rk_aiq_sys_ctx_t* ctx, const int
 algo_type);
```

<!-- Source EN PDF p.34; unit 246 -->

【Parameter】

<!-- Source EN PDF p.35; unit 247 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| algo_type | Typ des zu bearbeitenden Algorithmusmoduls | Eingabe |

<!-- Source EN PDF p.35; unit 248 -->

【Rückgabewert】

<!-- Source EN PDF p.35; unit 249 -->

| Rückgabewert | Beschreibung |
|---|---|
| NULL | Abruf fehlgeschlagen |
| Non-NULL | Abruf erfolgreich |

<!-- Source EN PDF p.35; unit 250 -->

【Voraussetzungen】

<!-- Source EN PDF p.35; unit 251 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.35; unit 252 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.35; unit 253 -->

【Hinweis】

<!-- Source EN PDF p.35; unit 254 -->

Die zurückgegebene Algorithmuskontextstruktur wird von internen privaten Funktionen verwendet. Bei benutzerdefinierten Algorithmusbibliotheken muss diese Funktion nach rk_aiq_uapi2_sysctl_enableAxlib aufgerufen werden; andernfalls wird NULL zurückgegeben.

<!-- Source EN PDF p.35; unit 255 -->

#### 3.2.14  rk_aiq_uapi2_sysctl_setCpsLtCfg

<!-- Source EN PDF p.35; unit 256 -->

【Beschreibung】 Steuerinformationen für die Zusatzbeleuchtung einstellen.

<!-- Source EN PDF p.35; unit 257 -->

【Syntax】

<!-- Source EN PDF p.35; unit 258 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_setCpsLtCfg(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cfg_t* cfg);
```

<!-- Source EN PDF p.35; unit 259 -->

【Parameter】

<!-- Source EN PDF p.35; unit 260 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| cfg | Zeiger auf die Konfigurationsstruktur der Zusatzbeleuchtung | Eingabe |

<!-- Source EN PDF p.35; unit 261 -->

【Rückgabewert】

<!-- Source EN PDF p.35; unit 262 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.35; unit 263 -->

【Voraussetzungen】

<!-- Source EN PDF p.36; unit 264 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 265 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.36; unit 266 -->

#### 3.2.15  rk_aiq_uapi2_sysctl_getCpsLtInfo

<!-- Source EN PDF p.36; unit 267 -->

【Beschreibung】 Steuerinformationen der Zusatzbeleuchtung abrufen.

<!-- Source EN PDF p.36; unit 268 -->

【Syntax】

<!-- Source EN PDF p.36; unit 269 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCpsLtInfo(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_info_t* info);
```

<!-- Source EN PDF p.36; unit 270 -->

【Parameter】

<!-- Source EN PDF p.36; unit 271 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| info | Zeiger auf die Konfigurationsstruktur der Zusatzbeleuchtung | Ausgabe |

<!-- Source EN PDF p.36; unit 272 -->

【Rückgabewert】

<!-- Source EN PDF p.36; unit 273 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.36; unit 274 -->

【Voraussetzungen】

<!-- Source EN PDF p.36; unit 275 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 276 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.36; unit 277 -->

#### 3.2.16  rk_aiq_uapi2_sysctl_queryCpsLtCap

<!-- Source EN PDF p.36; unit 278 -->

【Beschreibung】 Unterstützte Fähigkeiten der Zusatzbeleuchtung abfragen.

<!-- Source EN PDF p.36; unit 279 -->

【Syntax】

<!-- Source EN PDF p.36; unit 280 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_queryCpsLtCap(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cap_t* cap);
```

<!-- Source EN PDF p.36; unit 281 -->

【Parameter】

<!-- Source EN PDF p.37; unit 282 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| cap | Zeiger auf die Struktur zur Abfrage der Fähigkeiten der Zusatzbeleuchtung | Ausgabe |

<!-- Source EN PDF p.37; unit 283 -->

【Rückgabewert】

<!-- Source EN PDF p.37; unit 284 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.37; unit 285 -->

【Voraussetzungen】

<!-- Source EN PDF p.37; unit 286 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 287 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.37; unit 288 -->

#### 3.2.17  rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd

<!-- Source EN PDF p.37; unit 289 -->

【Beschreibung】 Den zum Videoknoten gehörenden Sensor-Entitätsnamen abfragen.

<!-- Source EN PDF p.37; unit 290 -->

【Syntax】

<!-- Source EN PDF p.37; unit 291 -->

```text
 const char* rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd(const char* vd);
```

<!-- Source EN PDF p.37; unit 292 -->

【Parameter】

<!-- Source EN PDF p.37; unit 293 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| vd | Videopfad, beispielsweise /dev/video20 | Eingabe |

<!-- Source EN PDF p.37; unit 294 -->

【Rückgabewert】

<!-- Source EN PDF p.37; unit 295 -->

| Rückgabewert | Beschreibung |
|---|---|
| Sensor-Entitätsname | Zeichenkettenzeiger |

<!-- Source EN PDF p.37; unit 296 -->

【Hinweis】

<!-- Source EN PDF p.37; unit 297 -->

Der Parameter muss der Pfad des ISPP-Skalierungsknotens sein.

<!-- Source EN PDF p.37; unit 298 -->

【Voraussetzungen】

<!-- Source EN PDF p.37; unit 299 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 300 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.38; unit 301 -->

#### 3.2.18  rk_aiq_uapi2_sysctl_updateIq

<!-- Source EN PDF p.38; unit 302 -->

【Beschreibung】 Die aktuell verwendete IQ-Parameterdatei dynamisch aktualisieren, ohne den Datenfluss anzuhalten.

<!-- Source EN PDF p.38; unit 303 -->

【Syntax】

<!-- Source EN PDF p.38; unit 304 -->

```text
 XCamReturn rk_aiq_uapi2_sysctl_updateIq(const rk_aiq_sys_ctx_t* sys_ctx, char*
 iqfile);
```

<!-- Source EN PDF p.38; unit 305 -->

【Parameter】

<!-- Source EN PDF p.38; unit 306 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| iqfile | Neue IQ-Datei | Eingabe |

<!-- Source EN PDF p.38; unit 307 -->

【Rückgabewert】

<!-- Source EN PDF p.38; unit 308 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.38; unit 309 -->

【Hinweis】

<!-- Source EN PDF p.38; unit 310 -->

iqfile muss ein vollständiger Pfad sein.

<!-- Source EN PDF p.38; unit 311 -->

Das Aktualisieren der IQ-Parameter ermöglicht keinen Wechsel der Betriebsart; beispielsweise lässt sich zwischen HDR und Normal nicht allein durch Aktualisieren der IQ-Datei umschalten. Einige Funktionen können jedoch durch unterschiedliche IQ-Parameterkonfigurationen umgeschaltet werden, beispielsweise erfolgt der Tag-/Nachtwechsel vollständig über die IQ-Konfiguration.

<!-- Source EN PDF p.38; unit 312 -->

Beim IQ-Wechsel überschreiben die IQ-Konfigurationsparameter die Einstellungen der Benutzer-API. Beispielsweise kann das AWB-Modul in IQ auf manuellen oder automatischen Modus eingestellt werden. Nach Ausführung dieser Funktion wird der aktuelle AWB-Modus unabhängig von seiner bisherigen Einstellung durch die Standardkonfiguration der neuen IQ-Datei überschrieben.

<!-- Source EN PDF p.38; unit 313 -->

【Voraussetzungen】

<!-- Source EN PDF p.38; unit 314 -->

Headerdatei: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.38; unit 315 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.38; unit 316 -->

#### 3.2.19  rk_aiq_uapi2_sysctl_getCrop

<!-- Source EN PDF p.38; unit 317 -->

【Beschreibung】 Zuschnittparameter abrufen.

<!-- Source EN PDF p.38; unit 318 -->

【Syntax】

<!-- Source EN PDF p.39; unit 319 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCrop(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_rect_t
 *rect);
```

<!-- Source EN PDF p.39; unit 320 -->

【Parameter】

<!-- Source EN PDF p.39; unit 321 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| rect | Zeiger auf die Zuschnittparameterstruktur | Ausgabe |

<!-- Source EN PDF p.39; unit 322 -->

【Rückgabewert】

<!-- Source EN PDF p.39; unit 323 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.39; unit 324 -->

### 3.3   Datentypen

<!-- Source EN PDF p.39; unit 325 -->

#### 3.3.1  rk_aiq_working_mode_t

<!-- Source EN PDF p.39; unit 326 -->

【Beschreibung】 Betriebsart der AIQ-Pipeline

<!-- Source EN PDF p.39; unit 327 -->

【Definition】

<!-- Source EN PDF p.39; unit 328 -->

```text
 typedef enum {
     RK_AIQ_WORKING_MODE_NORMAL,
     RK_AIQ_WORKING_MODE_ISP_HDR2    = 0x10,
     RK_AIQ_WORKING_MODE_ISP_HDR3    = 0x20,
 } rk_aiq_working_mode_t;
```

<!-- Source EN PDF p.39; unit 329 -->

【Felder】

<!-- Source EN PDF p.39; unit 330 -->

| Elementname | Beschreibung |
|---|---|
| RK_AIQ_WORKING_MODE_NORMAL | Normalmodus |
| RK_AIQ_WORKING_MODE_ISP_HDR2 | HDR-Modus mit zwei Bildern |
| RK_AIQ_WORKING_MODE_ISP_HDR3 | HDR-Modus mit drei Bildern |

<!-- Source EN PDF p.39; unit 331 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.39; unit 332 -->

Fragen Sie zuerst die von Sensor und AIQ unterstützten Modi ab. Wird der eingestellte Modus nicht unterstützt, ist die Einstellung unwirksam.

<!-- Source EN PDF p.40; unit 333 -->

#### 3.3.2  rk_aiq_static_info_t

<!-- Source EN PDF p.40; unit 334 -->

【Beschreibung】 Statische AIQ-Informationen

<!-- Source EN PDF p.40; unit 335 -->

【Definition】

<!-- Source EN PDF p.40; unit 336 -->

```text
 typedef struct {
     rk_aiq_sensor_info_t    sensor_info;
     rk_aiq_lens_info_t      lens_info;
     bool has_lens_vcm;
     bool has_fl;
     bool fl_strth_adj_sup;
     bool has_irc;
     bool fl_ir_strth_adj_sup;
 } rk_aiq_static_info_t;
```

<!-- Source EN PDF p.40; unit 337 -->

【Felder】

<!-- Source EN PDF p.40; unit 338 -->

| Elementname | Beschreibung |
|---|---|
| sensor_info | Beschreibung des Sensornamens, unterstützter Auflösungen usw. |
| lens_info | Objektivinformationen |
| has_lens_vcm | Ob VCM vorhanden ist |
| has_fl | Blitz vorhanden |
| fl_strth_adj_sup | Blitzstärke einstellbar |
| bool has_irc | IR-CUT vorhanden |
| bool fl_ir_strth_adj_sup |  |

<!-- Source EN PDF p.40; unit 339 -->

#### 3.3.3  rk_aiq_sensor_info_t

<!-- Source EN PDF p.40; unit 340 -->

【Beschreibung】 Sensorinformationen

<!-- Source EN PDF p.40; unit 341 -->

【Definition】

<!-- Source EN PDF p.40; unit 342 -->

```text
 typedef struct {
     char sensor_name[32];
     rk_frame_fmt_t  support_fmt[SUPPORT_FMT_MAX];
     int32_t num;
     /* binded pp stream media index */
     int8_t binded_strm_media_idx;
 } rk_aiq_sensor_info_t;
```

<!-- Source EN PDF p.40; unit 343 -->

【Felder】

<!-- Source EN PDF p.41; unit 344 -->

| Elementname | Beschreibung |
|---|---|
| sensor_name | Name des Sensors |
| support_fmt | Unterstützte Formate |
| num | Anzahl unterstützter Formate |
| has_fl | Blitz vorhanden |
| binded_strm_media_idx | Nummer des Medienknotens, an dem der Sensor eingebunden ist |

<!-- Source EN PDF p.41; unit 345 -->

#### 3.3.4  rk_aiq_module_id_t

<!-- Source EN PDF p.41; unit 346 -->

【Beschreibung】 AIQ-Modul-ID

<!-- Source EN PDF p.41; unit 347 -->

【Definition】

<!-- Source EN PDF p.41; unit 348 -->

```text
 typedef enum {
     RK_MODULE_INVAL = 0,
     RK_MODULE_DPCC,
     RK_MODULE_BLS,
     RK_MODULE_LSC,
     RK_MODULE_AWB_GAIN,
     RK_MODULE_CTK,
     RK_MODULE_GOC,
     RK_MODULE_SHARP,
     RK_MODULE_AE,
     RK_MODULE_AWB,
     RK_MODULE_NR,
     RK_MODULE_GIC,
     RK_MODULE_3DLUT,
     RK_MODULE_LDCH,
     RK_MODULE_TNR,
     RK_MODULE_FEC,
     RK_MODULE_MAX
 }rk_aiq_module_id_t;
```

<!-- Source EN PDF p.41; unit 349 -->

【Felder】

<!-- Source EN PDF p.42; unit 350 -->

| Elementname | Beschreibung |
|---|---|
| RK_MODULE_DPCC | Defektpixelerkennung und -korrektur |
| RK_MODULE_BLS | Schwarzpegel |
| RK_MODULE_LSC | Objektivschattierungskorrektur |
| RK_MODULE_AWB_GAIN | Weißabgleichsverstärkung |
| RK_MODULE_CTK | Farbkorrektur |
| RK_MODULE_GOC | Gamma |
| RK_MODULE_SHARP | Schärfung |
| RK_MODULE_AE | Belichtung |
| RK_MODULE_AWB | Weißabgleich |
| RK_MODULE_NR | Rauschunterdrückung |
| RK_MODULE_GIC | Grünabgleich |
| RK_MODULE_3DLUT | 3DLUT |
| RK_MODULE_LDCH | LDCH |
| RK_MODULE_TNR | 3D-Rauschunterdrückung |
| RK_MODULE_FEC | Fischaugenkorrektur |

<!-- Source EN PDF p.42; unit 351 -->

#### 3.3.5  rk_aiq_cpsl_cfg_t

<!-- Source EN PDF p.42; unit 352 -->

【Beschreibung】 Struktur zum Einstellen der Zusatzbeleuchtungsinformationen

<!-- Source EN PDF p.42; unit 353 -->

【Definition】

<!-- Source EN PDF p.42; unit 354 -->

```text
 typedef struct rk_aiq_cpsl_cfg_s {
     RKAiqOPMode_t mode;
     rk_aiq_cpsls_t lght_src;
     bool gray_on; /*!< force to gray if light on */
     union {
         struct {
             float sensitivity; /*!< Range [0-100] */
             uint32_t sw_interval; /*!< switch interval time, unit  seconds */
         } a; /*< auto mode */
         struct {
             uint8_t on; /*!< disable 0, enable 1 */
             float strength_led; /*!< Range [0-100] */
             float strength_ir; /*!< Range [0-100] */
         } m; /*!< manual mode */
     } u;
 } rk_aiq_cpsl_cfg_t;
```

<!-- Source EN PDF p.43; unit 355 -->

【Felder】

<!-- Source EN PDF p.43; unit 356 -->

| Elementname | Beschreibung |
|---|---|
| mode | Betriebsart |
| lght_src | Lichtquellentyp |
| gray_on | Ob nach dem Wechsel in den Nachtmodus auf Schwarzweiß umgestellt wird |
| sensitivity | Umschaltempfindlichkeit im Automatikmodus, Bereich [0,100] |
| sw_interval | Umschaltintervall im Automatikmodus in Sekunden |
| on | Ob im manuellen Modus in den Nachtmodus gewechselt wird |
| strength_led | LED-Lichtstärke im manuellen Modus, Bereich [0,100] |
| strength_ir | Infrarotlampenstärke im manuellen Modus, Bereich [0,100] |

<!-- Source EN PDF p.43; unit 357 -->

#### 3.3.6  rk_aiq_cpsl_info_t

<!-- Source EN PDF p.43; unit 358 -->

【Beschreibung】 Struktur zum Abfragen der Zusatzbeleuchtungsinformationen

<!-- Source EN PDF p.43; unit 359 -->

【Definition】

<!-- Source EN PDF p.43; unit 360 -->

```text
 typedef struct rk_aiq_cpsl_info_s {
     int32_t mode;
     uint8_t on;
     bool gray;
     float strength_led;
     float strength_ir;
     float sensitivity;
     uint32_t sw_interval;
     int32_t lght_src;
 } rk_aiq_cpsl_info_t;
```

<!-- Source EN PDF p.43; unit 361 -->

【Felder】

<!-- Source EN PDF p.44; unit 362 -->

| Elementname | Beschreibung |
|---|---|
| mode | Betriebsart |
| lght_src | Lichtquellentyp |
| gray | Ob nach dem Wechsel in den Nachtmodus auf Schwarzweiß umgestellt wird |
| sensitivity | Umschaltempfindlichkeit im Automatikmodus, Bereich [0,100] |
| sw_interval | Umschaltintervall im Automatikmodus in Sekunden |
| on | Ob im manuellen Modus in den Nachtmodus gewechselt wird |
| strength_led | LED-Lichtstärke im manuellen Modus, Bereich [0,100] |
| strength_ir | Infrarotlampenstärke im manuellen Modus, Bereich [0,100] |

<!-- Source EN PDF p.44; unit 363 -->

#### 3.3.7  rk_aiq_cpsl_cap_t

<!-- Source EN PDF p.44; unit 364 -->

【Beschreibung】 Struktur der unterstützten Zusatzbeleuchtungsfähigkeiten

<!-- Source EN PDF p.44; unit 365 -->

【Definition】

<!-- Source EN PDF p.44; unit 366 -->

```text
 typedef struct rk_aiq_cpsl_cap_s {
     int32_t supported_modes[RK_AIQ_OP_MODE_MAX];
     uint8_t modes_num;
     int32_t supported_lght_src[RK_AIQ_CPSLS_MAX];
     uint8_t lght_src_num;
     rk_aiq_range_t strength_led;
     rk_aiq_range_t sensitivity;
     rk_aiq_range_t strength_ir;
 } rk_aiq_cpsl_cap_t;
```

<!-- Source EN PDF p.44; unit 367 -->

【Felder】

<!-- Source EN PDF p.44; unit 368 -->

| Elementname | Beschreibung |
|---|---|
| supported_modes | Unterstützte Betriebsarten |
| modes_num | Anzahl unterstützter Modi |
| gray | Ob nach dem Wechsel in den Nachtmodus auf Schwarzweiß umgestellt wird |
| supported_lght_src | Unterstützte Lichtquellen |
| lght_src_num | Anzahl unterstützter Lichtquellen |
| strength_led | LED-Intensitätsbereich |
| sensitivity | Empfindlichkeitsbereich |
| strength_ir | Intensitätsbereich der Infrarotlampen |

<!-- Source EN PDF p.45; unit 369 -->

#### 3.3.8  rk_aiq_rect_t

<!-- Source EN PDF p.45; unit 370 -->

【Beschreibung】 Zuschnittparameterstruktur definieren

<!-- Source EN PDF p.45; unit 371 -->

【Definition】

<!-- Source EN PDF p.45; unit 372 -->

```text
 typedef struct rk_aiq_rect_s {
     int left;
     int top;
     int width;
     int height;
 } rk_aiq_rect_t;
```

<!-- Source EN PDF p.45; unit 373 -->

【Felder】

<!-- Source EN PDF p.45; unit 374 -->

| Elementname | Beschreibung |
|---|---|
| left | Horizontaler Ausgabeversatz |
| top | Vertikaler Ausgabeversatz |
| width | Horizontale Ausgabegröße |
| height | Vertikale Ausgabegröße |

<!-- Source EN PDF p.46; unit 375 -->

## 4.   Offline-Bildverarbeitung

<!-- Source EN PDF p.46; unit 376 -->

### 4.1   Überblick

<!-- Source EN PDF p.46; unit 377 -->

RKAIQ stellt eine Funktion zur Offline-Verarbeitung von RAW-Bildern bereit: Dateien im RK-eigenen RAW-Format werden von RKAIQ ausgewertet, zur Verarbeitung an ISP gesendet und als Bilder mit normaler Darstellung ausgegeben.

<!-- Source EN PDF p.46; unit 378 -->

Hinweis: Die Offline-Bildverarbeitungsfunktion wurde nicht getestet.

<!-- Source EN PDF p.46; unit 379 -->

### 4.2   Funktionsblockdiagramm

<!-- Source EN PDF p.46; unit 380 -->

![Technische Originalabbildung — PDF S. 46](/docs/rockchip-isp30-development/assets/en-p046-X802.png)

<!-- Source EN PDF p.46; unit 381 -->

Blockdiagramm der Offline-Bildverarbeitung

<!-- Source EN PDF p.46; unit 382 -->

### 4.3   Funktionsbeschreibung

<!-- Source EN PDF p.46; unit 383 -->

Unterstützt RK-RAW-Dateieingabe. Bei Verwendung der Dateieingabeschnittstelle wird der aufrufende Prozess blockiert, bis die Datei vollständig verarbeitet und erfolgreich ausgegeben wurde.

<!-- Source EN PDF p.46; unit 384 -->

Unterstützt RK-RAW-Puffereingabe im asynchronen Verarbeitungsmodus. Bei Verwendung der Puffereingabeschnittstelle wird der aufrufende Prozess nicht blockiert. Nach Abschluss der Pufferverarbeitung wird die Callback-Funktion aufgerufen, sofern eine registriert ist.

<!-- Source EN PDF p.47; unit 385 -->

Unterstützt RK-RAW-Puffereingabe im synchronen Verarbeitungsmodus. Bei Verwendung der Puffereingabeschnittstelle wird der aufrufende Prozess blockiert, bis der Puffer vollständig verarbeitet und erfolgreich ausgegeben wurde.

<!-- Source EN PDF p.47; unit 386 -->

### 4.4   Beschreibung des RK-RAW-Formats

<!-- Source EN PDF p.47; unit 387 -->

Siehe Dokumentation des RK-RAW-Dateiformats.

<!-- Source EN PDF p.47; unit 388 -->

### 4.5   Unterstützte RAW-Formate

<!-- Source EN PDF p.47; unit 389 -->

Unterstützt raw8/raw10/raw12 sowie die vier Bayer-Formate BGGR/GBRG/GRBG/RGGB.

<!-- Source EN PDF p.47; unit 390 -->

### 4.6   API-Referenz

<!-- Source EN PDF p.47; unit 391 -->

### 4.7   Datenstrukturen

<!-- Source EN PDF p.47; unit 392 -->

### 4.8   Hinweise

<!-- Source EN PDF p.47; unit 393 -->

Bei Verwendung der RK-Raw-Datenverarbeitung muss beim Erstellen eines AIQ-Kontexts der Parameter sns_ent_name der Schnittstelle rk_aiq_uapi2_sysctl_init "FakeCamera" lauten.

<!-- Source EN PDF p.47; unit 394 -->

Die RAW-Datenverarbeitung benötigt IQ-XML-Bildparameterdateien. Die XML-Datei muss für dieselbe Auflösung wie die eingehenden RK-Raw-Bilddaten erzeugt werden. Die Bildparameterdatei muss FakeCamera.xml heißen und im XML-Ladepfad abgelegt werden.

<!-- Source EN PDF p.47; unit 395 -->

### 4.9   Referenzbeispiel

<!-- Source EN PDF p.47; unit 396 -->

Weitere Informationen zur Verwendung der Offline-Bildverarbeitungs-API enthält rkisp_demo unter YOUR_SDK_DIR/external/camera_engine_rkaiq/rkisp_demo.

<!-- Source EN PDF p.48; unit 397 -->

## 5.   Kameragruppe

<!-- Source EN PDF p.48; unit 398 -->

### 5.1   Überblick

<!-- Source EN PDF p.48; unit 399 -->

Beispielsweise müssen bei Rundumsichtanwendungen mehrere Kameras zur gemeinsamen Verwaltung gruppiert und Parameter wie die Belichtung einheitlich eingestellt werden. Dazu lässt sich eine Gruppe anlegen und mehrere Kameras derselben Gruppe zuordnen. Die Camera-Group-API basiert auf der AIQ-API einer Einzelkamera. Sofern nicht anders angegeben, gelten APIs für einen einzelnen AIQ-Kontext auch für eine Kameragruppe. Die interne AIQ-Implementierung verteilt Anfragen je nach Typ des übergebenen Kontexts an eine Kameragruppe oder eine Einzelkamera.

<!-- Source EN PDF p.48; unit 400 -->

#### 5.1.1  rk_aiq_uapi2_camgroup_create

<!-- Source EN PDF p.48; unit 401 -->

【Beschreibung】 Beim Erstellen einer Kameragruppe wird für jede Kamera ein eigener AIQ ctx erstellt und anschließend zur Verwaltung an Group Ctx übergeben.

<!-- Source EN PDF p.48; unit 402 -->

【Syntax】

<!-- Source EN PDF p.48; unit 403 -->

```text
 rk_aiq_camgroup_ctx_t*
 rk_aiq_uapi2_camgroup_create (rk_aiq_camgroup_instance_cfg_t* cfg);
```

<!-- Source EN PDF p.48; unit 404 -->

【Parameter】

<!-- Source EN PDF p.48; unit 405 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| cfg | Konfigurationsparameter | Eingabe |

<!-- Source EN PDF p.48; unit 406 -->

【Rückgabewert】

<!-- Source EN PDF p.48; unit 407 -->

| Rückgabewert | Beschreibung |
|---|---|
| rk_aiq_camgroup_ctx_t* | Gruppenlaufzeitumgebung |
| NULL | Fehlgeschlagen |

<!-- Source EN PDF p.48; unit 408 -->

【Voraussetzungen】

<!-- Source EN PDF p.48; unit 409 -->

Headerdatei: rk_aiq_user_api2_camgroup.h

<!-- Source EN PDF p.48; unit 410 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.48; unit 411 -->

【Hinweis】

<!-- Source EN PDF p.48; unit 412 -->

Im Unterschied dazu erzeugt rk_aiq_uapi2_sysctl_init eine AIQ-Laufzeitumgebung für eine Einzelkamera. Wenn eine Sensorentität mit rk_aiq_uapi2_sysctl_init eine Laufzeitumgebung erhält, darf sie nicht zusätzlich über rk_aiq_uapi2_camgroup_create eine Gruppenlaufzeitumgebung erhalten, und umgekehrt.

<!-- Source EN PDF p.49; unit 413 -->

Da die standardmäßige IQ-Szene normal-day lautet, müssen HDR oder andere Modi vorab mit rk_aiq_uapi2_sysctl_preInit_scene eingestellt werden.

<!-- Source EN PDF p.49; unit 414 -->

#### 5.1.2  rk_aiq_uapi2_camgroup_prepare

<!-- Source EN PDF p.49; unit 415 -->

【Beschreibung】 Entsprechend dem gewählten Pipeline-Modus Initialisierungsparameter erzeugen und Pipelines anlegen. Für den AIQ ctx jeder Kamera wird rk_aiq_uapi2_sysctl_prepare aufgerufen.

<!-- Source EN PDF p.49; unit 416 -->

【Syntax】

<!-- Source EN PDF p.49; unit 417 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_prepare (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.49; unit 418 -->

【Parameter】

<!-- Source EN PDF p.49; unit 419 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |
| mode | Betriebsart der Pipeline | Eingabe |

<!-- Source EN PDF p.49; unit 420 -->

【Rückgabewert】

<!-- Source EN PDF p.49; unit 421 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Siehe Fehlercodes |

<!-- Source EN PDF p.49; unit 422 -->

【Voraussetzungen】

<!-- Source EN PDF p.49; unit 423 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.49; unit 424 -->

#### 5.1.3  rk_aiq_uapi2_camgroup_start

<!-- Source EN PDF p.49; unit 425 -->

【Beschreibung】 Kameragruppe ausführen. Für den AIQ ctx jeder Kamera wird rk_aiq_uapi2_sysctl_start aufgerufen.

<!-- Source EN PDF p.49; unit 426 -->

【Syntax】

<!-- Source EN PDF p.49; unit 427 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_start (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.49; unit 428 -->

【Parameter】

<!-- Source EN PDF p.50; unit 429 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |

<!-- Source EN PDF p.50; unit 430 -->

【Rückgabewert】

<!-- Source EN PDF p.50; unit 431 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler, siehe Fehlercode |

<!-- Source EN PDF p.50; unit 432 -->

【Voraussetzungen】

<!-- Source EN PDF p.50; unit 433 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.50; unit 434 -->

#### 5.1.4  rk_aiq_uapi2_camgroup_stop

<!-- Source EN PDF p.50; unit 435 -->

【Beschreibung】 Kameragruppe stoppen. Für den AIQ ctx jeder Kamera wird rk_aiq_uapi2_sysctl_stop aufgerufen.

<!-- Source EN PDF p.50; unit 436 -->

【Syntax】

<!-- Source EN PDF p.50; unit 437 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_stop (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.50; unit 438 -->

【Parameter】

<!-- Source EN PDF p.50; unit 439 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |

<!-- Source EN PDF p.50; unit 440 -->

【Rückgabewert】

<!-- Source EN PDF p.50; unit 441 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler, siehe Fehlercode |

<!-- Source EN PDF p.50; unit 442 -->

【Voraussetzungen】

<!-- Source EN PDF p.50; unit 443 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.51; unit 444 -->

#### 5.1.5  rk_aiq_uapi2_camgroup_destroy

<!-- Source EN PDF p.51; unit 445 -->

【Beschreibung】 Kameragruppe zerstören. Für den AIQ ctx jeder Kamera wird rk_aiq_uapi2_sysctl_deinit aufgerufen.

<!-- Source EN PDF p.51; unit 446 -->

【Syntax】

<!-- Source EN PDF p.51; unit 447 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_destroy (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 448 -->

【Parameter】

<!-- Source EN PDF p.51; unit 449 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |

<!-- Source EN PDF p.51; unit 450 -->

【Rückgabewert】

<!-- Source EN PDF p.51; unit 451 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler, siehe Fehlercode |

<!-- Source EN PDF p.51; unit 452 -->

【Voraussetzungen】

<!-- Source EN PDF p.51; unit 453 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.51; unit 454 -->

#### 5.1.6  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.51; unit 455 -->

【Beschreibung】 Im Rundumsichtszenario Überlappungsbereichsinformationen jeder Kamera aus dem CameraGroup-Kontext abrufen.

<!-- Source EN PDF p.51; unit 456 -->

【Syntax】

<!-- Source EN PDF p.51; unit 457 -->

```text
 struct RK_PS_SrcOverlapMap*
 rk_aiq_uapi2_camgroup_getOverlapMap (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 458 -->

【Parameter】

<!-- Source EN PDF p.51; unit 459 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |

<!-- Source EN PDF p.51; unit 460 -->

【Rückgabewert】

<!-- Source EN PDF p.52; unit 461 -->

| Rückgabewert | Beschreibung |
|---|---|
| struct RK_PS_SrcOverlapMap* | Zeiger auf die Struktur mit Überlappungsbereichsinformationen |
| NULL | Fehlgeschlagen |

<!-- Source EN PDF p.52; unit 462 -->

【Voraussetzungen】

<!-- Source EN PDF p.52; unit 463 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.52; unit 464 -->

#### 5.1.7  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.52; unit 465 -->

【Beschreibung】 Im Rundumsichtszenario Überlappungsbereichsinformationen jeder Kamera aus einer Datei abrufen.

<!-- Source EN PDF p.52; unit 466 -->

【Syntax】

<!-- Source EN PDF p.52; unit 467 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getOverlapMap_from_file (const char* map_file,
                                                             struct
 RK_PS_SrcOverlapMap** overlapMap);
```

<!-- Source EN PDF p.52; unit 468 -->

【Parameter】

<!-- Source EN PDF p.52; unit 469 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| map_file | Datei mit Überlappungsinformationen | Eingabe |
| overlapMap | Speichert die abgerufenen Überlappungsinformationen | Eingabe, Ausgabe |

<!-- Source EN PDF p.52; unit 470 -->

【Rückgabewert】

<!-- Source EN PDF p.52; unit 471 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler, siehe Fehlercode |

<!-- Source EN PDF p.52; unit 472 -->

【Voraussetzungen】

<!-- Source EN PDF p.52; unit 473 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.52; unit 474 -->

#### 5.1.8  rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm

<!-- Source EN PDF p.52; unit 475 -->

【Beschreibung】 Den AIQ-Kontext einer Einzelkamera über den Sensor-Entitätsnamen innerhalb der Gruppe abrufen.

<!-- Source EN PDF p.52; unit 476 -->

【Syntax】

<!-- Source EN PDF p.53; unit 477 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 const char* sns_entity_name);
```

<!-- Source EN PDF p.53; unit 478 -->

【Parameter】

<!-- Source EN PDF p.53; unit 479 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |
| sns_entity_name | Name der Sensorentität innerhalb der Gruppe | Eingabe |

<!-- Source EN PDF p.53; unit 480 -->

【Rückgabewert】

<!-- Source EN PDF p.53; unit 481 -->

| Rückgabewert | Beschreibung |
|---|---|
| rk_aiq_sys_ctx_t* | Abgerufene AIQ-Laufzeitumgebung |
| NULL | Fehlgeschlagen |

<!-- Source EN PDF p.53; unit 482 -->

【Voraussetzungen】

<!-- Source EN PDF p.53; unit 483 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.53; unit 484 -->

#### 5.1.9  rk_aiq_uapi2_camgroup_getCamInfos

<!-- Source EN PDF p.53; unit 485 -->

【Beschreibung】 Informationen zu den Kameras in der Gruppe abrufen, beispielsweise den Namen der Sensorentität.

<!-- Source EN PDF p.53; unit 486 -->

【Syntax】

<!-- Source EN PDF p.53; unit 487 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getCamInfos (rk_aiq_camgroup_ctx_t* camgroup_ctx,
                    rk_aiq_camgroup_camInfos_t* camInfos);
```

<!-- Source EN PDF p.53; unit 488 -->

【Parameter】

<!-- Source EN PDF p.53; unit 489 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| camgroup_ctx | Gruppenlaufzeitumgebung | Eingabe |
| camInfos | Abgerufene Informationen zu den Kameras in der Gruppe | Ausgabe |

<!-- Source EN PDF p.53; unit 490 -->

【Rückgabewert】

<!-- Source EN PDF p.53; unit 491 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler, siehe Fehlercode |

<!-- Source EN PDF p.54; unit 492 -->

【Voraussetzungen】

<!-- Source EN PDF p.54; unit 493 -->

Headerdatei: rk_aiq_user_api2_camgroup.h; Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.54; unit 494 -->

#### 5.1.10  rk_aiq_uapi2_camgroup_bind

<!-- Source EN PDF p.54; unit 495 -->

【Beschreibung】 Reservierte Schnittstelle, nicht implementiert.

<!-- Source EN PDF p.54; unit 496 -->

#### 5.1.11  rk_aiq_uapi2_camgroup_unbind

<!-- Source EN PDF p.54; unit 497 -->

【Beschreibung】 Reservierte Schnittstelle, nicht implementiert.

<!-- Source EN PDF p.54; unit 498 -->

### 5.2   Datenstrukturen

<!-- Source EN PDF p.54; unit 499 -->

#### 5.2.1  rk_aiq_camgroup_instance_cfg_t

<!-- Source EN PDF p.54; unit 500 -->

【Erläuterung】 Carmelaghrup-Konfigurationsparameter

<!-- Source EN PDF p.54; unit 501 -->

【Definition】

<!-- Source EN PDF p.54; unit 502 -->

```text
   typedef struct rk_aiq_camgroup_instance_cfg_s {
       const char* sns_ent_nm_array[RK_AIQ_CAM_GROUP_MAX_CAMS];
       int sns_num;
       const char* config_file_dir;
        /* followings are relative path to config_file_dir */
        const char* single_iq_file;
        const char* group_iq_file;
        const char* overlap_map_file;
    } rk_aiq_camgroup_instance_cfg_t;
```

<!-- Source EN PDF p.54; unit 503 -->

【Felder】

<!-- Source EN PDF p.55; unit 504 -->

| Feldname | Beschreibung |
|---|---|
| sns_ent_nm_array | Array der Sensorentitäten, die der Gruppenverwaltung hinzugefügt werden sollen |
| sns_num | Anzahl der Sensorentitäten, die zur Gruppe hinzugefügt werden sollen |
| config_file_dir | IQ-Dateipfad angeben |
| single_iq_file | IQ-Dateinamen angeben; kann NULL sein. Bei NULL wählt AIQ<br>automatisch aus |
| group_iq_file | Angegebene IQ-Konfigurationsdatei der Kameragruppe; derzeit nicht verwendet |
| overlap_map_file | Datei mit Kameraüberlappungsinformationen angeben; kann NULL sein |

<!-- Source EN PDF p.55; unit 505 -->

#### 5.2.2  rk_aiq_camgroup_camInfos_t

<!-- Source EN PDF p.55; unit 506 -->

【Erläuterung】 Informationen zu jeder Kamera in der Kameragruppe

<!-- Source EN PDF p.55; unit 507 -->

【Definition】

<!-- Source EN PDF p.55; unit 508 -->

```text
    typedef struct rk_aiq_camgroup_camInfos_s {
        int valid_sns_num;
        const char* sns_ent_nm[RK_AIQ_CAM_GROUP_MAX_CAMS];
        int sns_camPhyId[RK_AIQ_CAM_GROUP_MAX_CAMS];
   } rk_aiq_camgroup_camInfos_t;
```

<!-- Source EN PDF p.55; unit 509 -->

【Felder】

<!-- Source EN PDF p.55; unit 510 -->

| Feldname | Beschreibung |
|---|---|
| valid_sns_num | Anzahl der in der Gruppe enthaltenen Sensorentitäten |
| sns_ent_nm | Array der in der Gruppe enthaltenen Sensor-Entitätsnamen |
| sns_camPhyId | Array der physischen IDs der in der Gruppe enthaltenen Sensorentitäten |

<!-- Source EN PDF p.55; unit 511 -->

#### 5.2.3  struct RK_PS_SrcOverlapMap

<!-- Source EN PDF p.55; unit 512 -->

【Erläuterung】 Überlappungsbereich der Kamera definieren

<!-- Source EN PDF p.55; unit 513 -->

【Definition】

<!-- Source EN PDF p.55; unit 514 -->

```text
        struct RK_PS_SrcOverlapMap
      {
            char versionInfo[64];
            RK_PS_SrcOverlapPosition srcOverlapPositon[8];
            unsigned char overlapMap[15 * 15 * 8];
        };
```

<!-- Source EN PDF p.56; unit 515 -->

【Felder】

<!-- Source EN PDF p.56; unit 516 -->

| Feldname | Beschreibung |
|---|---|
| versionInfo | Versionsinformationen |
| srcOverlapPositon | Drehrichtung jeder Kamera: 0, 90, 180 oder 270 Grad |
| overlapMap | Überlappungsinformationen jedes Statistikblocks von 8 Kameras: Die<br>Statistikdaten jeder Kamera umfassen 15*15 Spalten, insgesamt für 8 Kameras<br>(nummeriert 0~7). Sind tatsächlich weniger als 8 Kameras vorhanden, wird die<br>entsprechende Position mit 0 gefüllt. Zeilenweise speichern: Nach der ersten Zeile<br>aller 8 Kameras folgt die zweite Zeile usw. Der Wertebereich ist 0~255. Bei vollständig<br>fehlender Überlappung ist der Wert 0, bei vollständiger Überlappung 255. Teilweise<br>Überlappung wird proportional interpoliert.<br>camera0 row0; camera1 row0; camera2 row0; camera3 row0; camera4 row0;<br>camera5 row0; camera6 row0; camera7 row0;<br>camera0 row1; camera1 row1; camera2 row1; camera3 row1; camera4 row1;<br>camera5 row1; camera6 row1; camera7 row1;<br>......<br>camera0 row14; camera1 row14; camera2 row14; camera3 row14; camera4 row14;<br>camera5 row14; camera6 row14; camera7 row14; |

<!-- Source EN PDF p.57; unit 517 -->

## 6.   AE

<!-- Source EN PDF p.57; unit 518 -->

### 6.1   Überblick

<!-- Source EN PDF p.57; unit 519 -->

Das AE-Modul ermittelt die Belichtung des aktuellen Bildes anhand des automatischen Belichtungsmesssystems und konfiguriert anschließend Objektivblende, Sensorverschluss und Verstärkung automatisch, um die beste Bildqualität zu erzielen.

<!-- Source EN PDF p.57; unit 520 -->

### 6.2   Wichtige Begriffe

<!-- Source EN PDF p.57; unit 521 -->

Belichtungszeit: Die Zeit, in der der Sensor Ladung sammelt, also der Zeitraum zwischen der Belichtung des Sensorpixels und dem Auslesen seiner Ladung.

<!-- Source EN PDF p.57; unit 522 -->

Belichtungsverstärkung: Gesamter Verstärkungsfaktor der vom Sensor ausgegebenen Ladung, gewöhnlich bestehend aus digitaler und analoger Verstärkung. Analoge Verstärkung verursacht etwas weniger Rauschen und wird daher im Allgemeinen bevorzugt.

<!-- Source EN PDF p.57; unit 523 -->

Blende: Mechanismus im Objektiv, der die Größe der freien Öffnung verändert.

<!-- Source EN PDF p.57; unit 524 -->

Flimmerunterdrückung: Bildflimmern durch eine Abweichung zwischen der Netzfrequenz der Lampe und der Sensorbildrate wird gewöhnlich durch Begrenzung der Belichtungszeit und Änderung der Sensorbildrate unterdrückt.

<!-- Source EN PDF p.57; unit 525 -->

### 6.3   Funktionsbeschreibung

<!-- Source EN PDF p.57; unit 526 -->

Das AE-Modul besteht aus AE-Statistik und dem Algorithmus der AE-Steuerstrategie.

<!-- Source EN PDF p.57; unit 527 -->

### 6.4   Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.57; unit 528 -->

#### 6.4.1  rk_aiq_uapi2_setAeLock

<!-- Source EN PDF p.57; unit 529 -->

【Beschreibung】

<!-- Source EN PDF p.57; unit 530 -->

AE-Belichtungssperre einstellen.

<!-- Source EN PDF p.57; unit 531 -->

【Syntax】

<!-- Source EN PDF p.57; unit 532 -->

```text
 XCamReturn rk_aiq_uapi2_setAeLock（const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.57; unit 533 -->

【Parameter】

<!-- Source EN PDF p.57; unit 534 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| on | Sperre aktivieren | Eingabe |

<!-- Source EN PDF p.58; unit 535 -->

【Rückgabewert】

<!-- Source EN PDF p.58; unit 536 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 |  |

<!-- Source EN PDF p.58; unit 537 -->

#### 6.4.2  rk_aiq_uapi2_setExpMode

<!-- Source EN PDF p.58; unit 538 -->

【Beschreibung】 Belichtungsmodus einstellen; automatische und manuelle Belichtung werden unterstützt.

<!-- Source EN PDF p.58; unit 539 -->

【Syntax】

<!-- Source EN PDF p.58; unit 540 -->

```text
 XCamReturn rk_aiq_uapi2_setExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.58; unit 541 -->

【Parameter】

<!-- Source EN PDF p.58; unit 542 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Belichtungsmodus | Eingabe |

<!-- Source EN PDF p.58; unit 543 -->

【Rückgabewert】

<!-- Source EN PDF p.58; unit 544 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.58; unit 545 -->

【Hinweis】

<!-- Source EN PDF p.58; unit 546 -->

Beim Wechsel in den manuellen Belichtungsmodus werden für Verstärkung und Belichtungszeit die in der Bildparameterdatei definierten Anfangswerte verwendet. Um den Belichtungswert gleichzeitig mit dem Wechsel in den manuellen Modus einzustellen, kann rk_aiq_uapi2_setManualExp verwendet werden.

<!-- Source EN PDF p.58; unit 547 -->

【Voraussetzungen】

<!-- Source EN PDF p.58; unit 548 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.58; unit 549 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.58; unit 550 -->

#### 6.4.3  rk_aiq_uapi2_getExpMode

<!-- Source EN PDF p.58; unit 551 -->

【Beschreibung】 Belichtungsmodus abrufen.

<!-- Source EN PDF p.58; unit 552 -->

【Syntax】

<!-- Source EN PDF p.59; unit 553 -->

```text
 XCamReturn rk_aiq_uapi2_getExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.59; unit 554 -->

【Parameter】

<!-- Source EN PDF p.59; unit 555 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Belichtungsmodus | Ausgabe |

<!-- Source EN PDF p.59; unit 556 -->

【Rückgabewert】

<!-- Source EN PDF p.59; unit 557 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.59; unit 558 -->

【Voraussetzungen】

<!-- Source EN PDF p.59; unit 559 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.59; unit 560 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.59; unit 561 -->

#### 6.4.4  rk_aiq_uapi2_setManualExp

<!-- Source EN PDF p.59; unit 562 -->

【Beschreibung】 Manuellen Belichtungsmodus verwenden und Verstärkung sowie Belichtungszeit einstellen.

<!-- Source EN PDF p.59; unit 563 -->

【Syntax】

<!-- Source EN PDF p.59; unit 564 -->

```text
 XCamReturn rk_aiq_uapi2_setManualExp(const rk_aiq_sys_ctx_t* ctx, float gain,
 float time);
```

<!-- Source EN PDF p.59; unit 565 -->

【Parameter】

<!-- Source EN PDF p.59; unit 566 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| gain | Belichtungsverstärkung | Eingabe |
| time | Belichtungszeit | Eingabe |

<!-- Source EN PDF p.59; unit 567 -->

【Rückgabewert】

<!-- Source EN PDF p.59; unit 568 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.59; unit 569 -->

【Voraussetzungen】

<!-- Source EN PDF p.60; unit 570 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 571 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.60; unit 572 -->

#### 6.4.5  rk_aiq_uapi2_setExpGainRange

<!-- Source EN PDF p.60; unit 573 -->

【Beschreibung】\*\* Verstärkungsbereich einstellen.

<!-- Source EN PDF p.60; unit 574 -->

【Syntax】

<!-- Source EN PDF p.60; unit 575 -->

```text
 XCamReturn rk_aiq_uapi2_setExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 576 -->

【Parameter】

<!-- Source EN PDF p.60; unit 577 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| gain | Bereich der Belichtungsverstärkung | Eingabe |

<!-- Source EN PDF p.60; unit 578 -->

【Rückgabewert】

<!-- Source EN PDF p.60; unit 579 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.60; unit 580 -->

【Voraussetzungen】

<!-- Source EN PDF p.60; unit 581 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 582 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.60; unit 583 -->

#### 6.4.6  rk_aiq_uapi2_getExpGainRange

<!-- Source EN PDF p.60; unit 584 -->

【Beschreibung】 Verstärkungsbereich abrufen.

<!-- Source EN PDF p.60; unit 585 -->

【Syntax】

<!-- Source EN PDF p.60; unit 586 -->

```text
 XCamReturn rk_aiq_uapi2_getExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 587 -->

【Parameter】

<!-- Source EN PDF p.61; unit 588 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| gain | Bereich der Belichtungsverstärkung | Ausgabe |

<!-- Source EN PDF p.61; unit 589 -->

【Rückgabewert】

<!-- Source EN PDF p.61; unit 590 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.61; unit 591 -->

【Voraussetzungen】

<!-- Source EN PDF p.61; unit 592 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 593 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.61; unit 594 -->

#### 6.4.7  rk_aiq_uapi2_setExpTimeRange

<!-- Source EN PDF p.61; unit 595 -->

【Beschreibung】 Belichtungszeitbereich einstellen.

<!-- Source EN PDF p.61; unit 596 -->

【Syntax】

<!-- Source EN PDF p.61; unit 597 -->

```text
 XCamReturn rk_aiq_uapi2_setExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.61; unit 598 -->

【Parameter】

<!-- Source EN PDF p.61; unit 599 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| time | Belichtungszeitbereich | Eingabe |

<!-- Source EN PDF p.61; unit 600 -->

【Rückgabewert】

<!-- Source EN PDF p.61; unit 601 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.61; unit 602 -->

【Voraussetzungen】

<!-- Source EN PDF p.61; unit 603 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 604 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.62; unit 605 -->

#### 6.4.8  rk_aiq_uapi2_getExpTimeRange

<!-- Source EN PDF p.62; unit 606 -->

【Beschreibung】 Belichtungszeitbereich abrufen.

<!-- Source EN PDF p.62; unit 607 -->

【Syntax】

<!-- Source EN PDF p.62; unit 608 -->

```text
 XCamReturn rk_aiq_uapi2_getExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.62; unit 609 -->

【Parameter】

<!-- Source EN PDF p.62; unit 610 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| time | Belichtungszeitbereich | Ausgabe |

<!-- Source EN PDF p.62; unit 611 -->

【Rückgabewert】

<!-- Source EN PDF p.62; unit 612 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.62; unit 613 -->

【Voraussetzungen】

<!-- Source EN PDF p.62; unit 614 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.62; unit 615 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.62; unit 616 -->

#### 6.4.9  rk_aiq_uapi2_setBLCMode

<!-- Source EN PDF p.62; unit 617 -->

【Beschreibung】 Gegenlichtkompensation ein-/ausschalten und Bereich auswählen.

<!-- Source EN PDF p.62; unit 618 -->

【Syntax】

<!-- Source EN PDF p.62; unit 619 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCMode(const rk_aiq_sys_ctx_t* ctx, bool on,
 aeMeasAreaType_t areaType);
```

<!-- Source EN PDF p.62; unit 620 -->

【Parameter】

<!-- Source EN PDF p.62; unit 621 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Eingabe |
| areaType | Auswahl des Kompensationsbereichs | Eingabe |

<!-- Source EN PDF p.62; unit 622 -->

【Rückgabewert】

<!-- Source EN PDF p.63; unit 623 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.63; unit 624 -->

【Hinweis】

<!-- Source EN PDF p.63; unit 625 -->

Diese Schnittstelle ist nur im linearen Modus verfügbar.

<!-- Source EN PDF p.63; unit 626 -->

【Voraussetzungen】

<!-- Source EN PDF p.63; unit 627 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 628 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.63; unit 629 -->

#### 6.4.10  rk_aiq_uapi2_setBLCStrength

<!-- Source EN PDF p.63; unit 630 -->

【Beschreibung】 Stärke der Aufhellung dunkler Bereiche einstellen.

<!-- Source EN PDF p.63; unit 631 -->

【Syntax】

<!-- Source EN PDF p.63; unit 632 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.63; unit 633 -->

【Parameter】

<!-- Source EN PDF p.63; unit 634 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| strength | Aufhellungsstärke, Bereich [1,100] | Eingabe |

<!-- Source EN PDF p.63; unit 635 -->

【Rückgabewert】

<!-- Source EN PDF p.63; unit 636 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.63; unit 637 -->

【Hinweis】

<!-- Source EN PDF p.63; unit 638 -->

Diese Schnittstelle ist nur im linearen Modus verfügbar.

<!-- Source EN PDF p.63; unit 639 -->

【Voraussetzungen】

<!-- Source EN PDF p.63; unit 640 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 641 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.64; unit 642 -->

#### 6.4.11  rk_aiq_uapi2_setHLCMode

<!-- Source EN PDF p.64; unit 643 -->

【Beschreibung】 Spitzlichtunterdrückung ein-/ausschalten.

<!-- Source EN PDF p.64; unit 644 -->

【Syntax】

<!-- Source EN PDF p.64; unit 645 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCMode(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.64; unit 646 -->

【Parameter】

<!-- Source EN PDF p.64; unit 647 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Eingabe |

<!-- Source EN PDF p.64; unit 648 -->

【Rückgabewert】

<!-- Source EN PDF p.64; unit 649 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.64; unit 650 -->

【Hinweis】

<!-- Source EN PDF p.64; unit 651 -->

Diese Schnittstelle ist nur im linearen Modus verfügbar.

<!-- Source EN PDF p.64; unit 652 -->

【Voraussetzungen】

<!-- Source EN PDF p.64; unit 653 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.64; unit 654 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.64; unit 655 -->

#### 6.4.12  rk_aiq_uapi2_setHLCStrength

<!-- Source EN PDF p.64; unit 656 -->

【Beschreibung】 Stärke der Spitzlichtunterdrückung einstellen.

<!-- Source EN PDF p.64; unit 657 -->

【Syntax】

<!-- Source EN PDF p.64; unit 658 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.64; unit 659 -->

【Parameter】

<!-- Source EN PDF p.64; unit 660 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| strength | Unterdrückungsstärke, Bereich [1,100] | Eingabe |

<!-- Source EN PDF p.65; unit 661 -->

【Rückgabewert】

<!-- Source EN PDF p.65; unit 662 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.65; unit 663 -->

【Hinweis】

<!-- Source EN PDF p.65; unit 664 -->

Diese Schnittstelle ist nur im linearen Modus verfügbar.

<!-- Source EN PDF p.65; unit 665 -->

【Voraussetzungen】

<!-- Source EN PDF p.65; unit 666 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 667 -->

Bibliotheksdatei: librkaiq.sov

<!-- Source EN PDF p.65; unit 668 -->

#### 6.4.13  rk_aiq_uapi2_setAntiFlickerEn

<!-- Source EN PDF p.65; unit 669 -->

【Beschreibung】 Unterdrückung netzfrequenzbedingten Flimmerns ein-/ausschalten.

<!-- Source EN PDF p.65; unit 670 -->

【Syntax】

<!-- Source EN PDF p.65; unit 671 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool on)；
```

<!-- Source EN PDF p.65; unit 672 -->

【Parameter】

<!-- Source EN PDF p.65; unit 673 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| on | Parameter zum Ein-/Ausschalten der Funktion | Eingabe |

<!-- Source EN PDF p.65; unit 674 -->

【Rückgabewert】

<!-- Source EN PDF p.65; unit 675 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.65; unit 676 -->

【Voraussetzungen】

<!-- Source EN PDF p.65; unit 677 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 678 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.66; unit 679 -->

#### 6.4.14  rk_aiq_uapi2_getAntiFlickerEn

<!-- Source EN PDF p.66; unit 680 -->

【Beschreibung】 Unterdrückung netzfrequenzbedingten Flimmerns ein-/ausschalten.

<!-- Source EN PDF p.66; unit 681 -->

【Syntax】

<!-- Source EN PDF p.66; unit 682 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool* on)；
```

<!-- Source EN PDF p.66; unit 683 -->

【Parameter】

<!-- Source EN PDF p.66; unit 684 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| on | Parameter zum Ein-/Ausschalten der Funktion | Eingabe |

<!-- Source EN PDF p.66; unit 685 -->

【Rückgabewert】

<!-- Source EN PDF p.66; unit 686 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.66; unit 687 -->

【Voraussetzungen】

<!-- Source EN PDF p.66; unit 688 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.66; unit 689 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.66; unit 690 -->

#### 6.4.15  rk_aiq_uapi2_setAntiFlickerMode

<!-- Source EN PDF p.66; unit 691 -->

【Beschreibung】 Modus der Flimmerunterdrückung einstellen.

<!-- Source EN PDF p.66; unit 692 -->

【Syntax】

<!-- Source EN PDF p.66; unit 693 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t mode);
```

<!-- Source EN PDF p.66; unit 694 -->

【Parameter】

<!-- Source EN PDF p.66; unit 695 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Modus der Flimmerunterdrückung | Eingabe |

<!-- Source EN PDF p.66; unit 696 -->

【Rückgabewert】

<!-- Source EN PDF p.67; unit 697 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.67; unit 698 -->

【Voraussetzungen】

<!-- Source EN PDF p.67; unit 699 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 700 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.67; unit 701 -->

#### 6.4.16  rk_aiq_uapi2_getAntiFlickerMode

<!-- Source EN PDF p.67; unit 702 -->

【Beschreibung】 Modus der Flimmerunterdrückung abrufen.

<!-- Source EN PDF p.67; unit 703 -->

【Syntax】

<!-- Source EN PDF p.67; unit 704 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t *mode);
```

<!-- Source EN PDF p.67; unit 705 -->

【Parameter】

<!-- Source EN PDF p.67; unit 706 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Modus der Flimmerunterdrückung | Ausgabe |

<!-- Source EN PDF p.67; unit 707 -->

【Rückgabewert】

<!-- Source EN PDF p.67; unit 708 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.67; unit 709 -->

【Voraussetzungen】

<!-- Source EN PDF p.67; unit 710 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 711 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.67; unit 712 -->

#### 6.4.17  rk_aiq_uapi2_setExpPwrLineFreqMode

<!-- Source EN PDF p.67; unit 713 -->

【Beschreibung】 Frequenz der Flimmerunterdrückung einstellen.

<!-- Source EN PDF p.67; unit 714 -->

【Syntax】

<!-- Source EN PDF p.67; unit 715 -->

```text
 XCamReturn rk_aiq_uapi2_setExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t freq);
```

<!-- Source EN PDF p.68; unit 716 -->

【Parameter】

<!-- Source EN PDF p.68; unit 717 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| freq | Frequenz der Flimmerunterdrückung | Eingabe |

<!-- Source EN PDF p.68; unit 718 -->

【Rückgabewert】

<!-- Source EN PDF p.68; unit 719 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.68; unit 720 -->

【Voraussetzungen】

<!-- Source EN PDF p.68; unit 721 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 722 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.68; unit 723 -->

#### 6.4.18  rk_aiq_uapi2_getExpPwrLineFreqMode

<!-- Source EN PDF p.68; unit 724 -->

【Beschreibung】\*\* Frequenz der Flimmerunterdrückung abrufen.

<!-- Source EN PDF p.68; unit 725 -->

【Syntax】

<!-- Source EN PDF p.68; unit 726 -->

```text
 XCamReturn rk_aiq_uapi2_getExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t *freq);
```

<!-- Source EN PDF p.68; unit 727 -->

【Parameter】

<!-- Source EN PDF p.68; unit 728 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| freq | Frequenz der Flimmerunterdrückung | Ausgabe |

<!-- Source EN PDF p.68; unit 729 -->

【Rückgabewert】

<!-- Source EN PDF p.68; unit 730 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.68; unit 731 -->

【Voraussetzungen】

<!-- Source EN PDF p.68; unit 732 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 733 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.69; unit 734 -->

### 6.5   Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.69; unit 735 -->

#### 6.5.1  opMode_t

<!-- Source EN PDF p.69; unit 736 -->

【Beschreibung】 Automatischen und manuellen Modus definieren.

<!-- Source EN PDF p.69; unit 737 -->

【Definition】

<!-- Source EN PDF p.69; unit 738 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.69; unit 739 -->

【Felder】

<!-- Source EN PDF p.69; unit 740 -->

| Feldname | Beschreibung |
|---|---|
| OP_AUTO | Automatikmodus |
| OP_MANUALl | Manueller Modus |
| OP_INVAL | Ungültiger Wert |

<!-- Source EN PDF p.69; unit 741 -->

#### 6.5.2  paRange_t

<!-- Source EN PDF p.69; unit 742 -->

【Beschreibung】 Parameterbereiche definieren.

<!-- Source EN PDF p.69; unit 743 -->

【Definition】

<!-- Source EN PDF p.69; unit 744 -->

```text
 typedef struct paRange_s {
     float max;
     float min;
 } paRange_t;
```

<!-- Source EN PDF p.69; unit 745 -->

【Felder】

<!-- Source EN PDF p.69; unit 746 -->

| Feldname | Beschreibung |
|---|---|
| max | Oberer Grenzwert |
| min | Unterer Grenzwert |

<!-- Source EN PDF p.70; unit 747 -->

#### 6.5.3  aeMeasAreaType_t

<!-- Source EN PDF p.70; unit 748 -->

【Beschreibung】 Typ des AE-Messbereichs definieren.

<!-- Source EN PDF p.70; unit 749 -->

【Definition】

<!-- Source EN PDF p.70; unit 750 -->

```text
 typedef enum aeMeasAreaType_e {
     AE_MEAS_AREA_AUTO = 0,
     AE_MEAS_AREA_UP,
     AE_MEAS_AREA_BOTTOM,
     AE_MEAS_AREA_LEFT,
     AE_MEAS_AREA_RIGHT,
     AE_MEAS_AREA_CENTER,
 } aeMeasAreaType_t;
```

<!-- Source EN PDF p.70; unit 751 -->

【Felder】

<!-- Source EN PDF p.70; unit 752 -->

| Feldname | Beschreibung |
|---|---|
| AE_MEAS_AREA_AUTO | Automatisch |
| AE_MEAS_AREA_UP | Oberer Bereich |
| AE_MEAS_AREA_BOTTOM | Unterer Bereich |
| AE_MEAS_AREA_LEFT | Linker Bereich |
| AE_MEAS_AREA_RIGHT | Rechter Bereich |
| AE_MEAS_AREA_CENTER | Mittlerer Bereich |

<!-- Source EN PDF p.70; unit 753 -->

#### 6.5.4  expPwrLineFreq_t

<!-- Source EN PDF p.70; unit 754 -->

【Beschreibung】 Frequenz der Flimmerunterdrückung definieren.

<!-- Source EN PDF p.70; unit 755 -->

【Definition】

<!-- Source EN PDF p.70; unit 756 -->

```text
 typedef enum expPwrLineFreq_e {
        EXP_PWR_LINE_FREQ_DIS   = 0,
        EXP_PWR_LINE_FREQ_50HZ  = 1,
        EXP_PWR_LINE_FREQ_60HZ  = 2,
 } expPwrLineFreq_t;
```

<!-- Source EN PDF p.70; unit 757 -->

【Felder】

<!-- Source EN PDF p.71; unit 758 -->

| Feldname | Beschreibung |
|---|---|
| EXP_PWR_LINE_FREQ_DIS |  |
| EXP_PWR_LINE_FREQ_50HZ | 50 Hz |
| EXP_PWR_LINE_FREQ_60HZ | 60 Hz |

<!-- Source EN PDF p.71; unit 759 -->

#### 6.5.5  antiFlickerMode_t

<!-- Source EN PDF p.71; unit 760 -->

【Beschreibung】 Modus der Flimmerunterdrückung definieren.

<!-- Source EN PDF p.71; unit 761 -->

【Definition】

<!-- Source EN PDF p.71; unit 762 -->

```text
 typedef enum antiFlickerMode_e {
     ANTIFLICKER_NORMAL_MODE = 0,
     ANTIFLICKER_AUTO_MODE = 1,
 } antiFlickerMode_t;
```

<!-- Source EN PDF p.71; unit 763 -->

【Felder】

<!-- Source EN PDF p.71; unit 764 -->

| Feldname | Beschreibung |
|---|---|
| ANTIFLICKER_NORMAL_MODE | Normalmodus |
| ANTIFLICKER_AUTO_MODE | Automatischer Auswahlmodus |

<!-- Source EN PDF p.71; unit 765 -->

### 6.6   Referenz der modulbezogenen APIs

<!-- Source EN PDF p.71; unit 766 -->

#### 6.6.1  rk_aiq_user_api2_ae_setExpSwAttr

<!-- Source EN PDF p.71; unit 767 -->

【Beschreibung】 Softwareeigenschaften der AE-Belichtung einstellen.

<!-- Source EN PDF p.71; unit 768 -->

【Syntax】

<!-- Source EN PDF p.71; unit 769 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                                 const Uapi_ExpSwAttrV2_t expSwAttr);
```

<!-- Source EN PDF p.71; unit 770 -->

【Parameter】

<!-- Source EN PDF p.71; unit 771 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| expSwAttr | Parameterstruktur zur Steuerung allgemeiner AE-Funktionen | Eingabe |

<!-- Source EN PDF p.71; unit 772 -->

【Rückgabewert】

<!-- Source EN PDF p.72; unit 773 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.72; unit 774 -->

【Voraussetzungen】

<!-- Source EN PDF p.72; unit 775 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.72; unit 776 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.72; unit 777 -->

【Beispiel】

<!-- Source EN PDF p.72; unit 778 -->

Eigenschaften für manuelle Belichtung einstellen

<!-- Source EN PDF p.72; unit 779 -->

Zu den Belichtungskomponenten gehören Sensorbelichtungszeit, Sensorbelichtungsverstärkung und digitale ISP-Verstärkung. Nach Auswahl des manuellen Belichtungsmodus müssen außerdem für jede Komponente der manuelle Zustand (ManualGainEn, ManualTimeEn, ManualIspDgainEn) und der zugehörige manuelle Wert eingestellt werden. Im manuellen Belichtungsmodus müssen alle Belichtungskomponenten manuell sein; ihre Werte werden durch Sensor und Objektiv begrenzt. Überschreitet ein eingestellter Komponentenwert die Sensorgrenze, korrigiert ihn der Algorithmus automatisch.

<!-- Source EN PDF p.72; unit 780 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = true;
 expSwAttr.stManual.LinearAE.GainValue = 1.0f; /*gain = 1x*/
 expSwAttr.stManual.LinearAE.TimeValue = 0.02f; /*time = 1/50s*/
 //HdrAE (should set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = true;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.72; unit 781 -->

Eigenschaften für automatische Belichtung einstellen

<!-- Source EN PDF p.72; unit 782 -->

Bei automatischer Belichtung kann der Bereich der Belichtungskomponenten eingestellt werden. Überschreitet dieser die Sensorgrenzen, korrigiert ihn der Algorithmus automatisch.

<!-- Source EN PDF p.72; unit 783 -->

【Hinweis】: Die Parameter zum Einstellen des Belichtungskomponentenbereichs unterscheiden sich von den Parametern zum Abrufen dieses Bereichs.

<!-- Source EN PDF p.72; unit 784 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set time range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Max = 0.04f; /*time_max =
 0.04*/
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Min = 0.001f; /*time_min =
 0.001*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Max = 0.002f; /*sframe
 time_max = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Min = 0.001f; /*sframe
 time_min = 0.01*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Max = 0.003f; /*mframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Min = 0.002f; /*mframe
 time_min = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Max = 0.04f; /*lframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Min = 0.03f; /*lframe
 time_min = 0.02*/
 //get time range in struct "stAuto"
 printf("linear time range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stExpTimeRange.Min,
 expSwAttr.stAuto.LinAeRange.stExpTimeRange.Max);
 printf("hdr stime range=[%f,%f], mtime range=[%f,%f], ltime range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Max);
 //set gain range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 32.0f; /*gain_max = 32x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 1.0f; /*gain_min = 1x*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 32.0f; /*sframe gain_max
 = 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 1.0f; /*sframe gain_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Max = 64.0f; /*mframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Min = 1.0f; /*mframe gian_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Max = 64.0f; /*lframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Min = 1.0f; /*lframe gain_min =
 1x*/
 //get gain range in struct "stAuto"
 printf("linear gain range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stGainRange.Min,
 expSwAttr.stAuto.LinAeRange.stGainRange.Max);
 printf("hdr sgain range=[%f,%f], mgain range=[%f,%f], lgain range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stGainRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[2].Max);
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.74; unit 785 -->

Eigenschaften für halbmanuelle Belichtung einstellen

<!-- Source EN PDF p.74; unit 786 -->

Halbmanuelle Belichtung bedeutet, dass mindestens eine Belichtungskomponente (Sensorbelichtungszeit, Sensorbelichtungsverstärkung oder digitale ISP-Verstärkung) manuell ist und die übrigen automatisch arbeiten; andernfalls wird mit einem Fehler beendet. Um beispielsweise die Verstärkung manuell und Belichtungszeit sowie digitale ISP-Verstärkung automatisch zu steuern, gibt es zwei Möglichkeiten: Im manuellen Belichtungsmodus die manuelle Aktivierung für Belichtungszeit und digitale ISP-Verstärkung auf false, für Belichtungsverstärkung auf true setzen und den gewünschten manuellen Wert einstellen. Methode 2: Im automatischen Belichtungsmodus den maximalen und minimalen Verstärkungswert auf den festzulegenden Wert setzen.

<!-- Source EN PDF p.74; unit 787 -->

【Hinweis】Methode 1: Im HDR-Belichtungsmodus ist das manuelle Verhalten aller Bilder synchron, d. h. die entsprechenden Komponenten jedes Bildes besitzen denselben manuellen Zustand. Zugleich muss die maximale Belichtung langer Bilder größer als die maximale Belichtung kurzer Bilder und die minimale Belichtung langer Bilder größer als die minimale Belichtung kurzer Bilder sein. Methode 2: Im HDR-Belichtungsmodus darf das manuelle Verhalten der Bilder unterschiedlich sein, beispielsweise manuelle Verstärkung kurzer Bilder bei automatischer Verstärkung langer Bilder. Auch hierbei muss die maximale Belichtung langer Bilder größer als die maximale Belichtung kurzer Bilder und die minimale Belichtung langer Bilder größer als die minimale Belichtung kurzer Bilder sein.

<!-- Source EN PDF p.74; unit 788 -->

```text
 //Method One
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = false;
 expSwAttr.stManual.LinearAE.ManualIspDgainEn = false;
 expSwAttr.stManual.LinearAE.GainValue = 2.0f; /*gain = 2x*/
 //HdrAE (need to set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = false;
 expSwAttr.stManual.HdrAE.ManualIspDgainEn = false;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //Method Two
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set gain range
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*Must be enabled*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 2.0f; /*gain_max = 2x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 2.0f;  /*gain_min = 2x*/
 //HdrAE (allow to set only one frame)
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 2.0f; /*sframe gain_max =
 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 2.0f;  /*sframe gain_min
 = 2x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 789 -->

Feste Bildrate oder automatische Bildratenreduzierung einstellen

<!-- Source EN PDF p.75; unit 790 -->

Im Modus mit fester Bildrate darf die zulässige Bildrate die vom Treiber definierte maximale Bildrate nicht überschreiten. Andernfalls erscheint ein Protokollhinweis und die Bildrateneinstellung wird deaktiviert.

<!-- Source EN PDF p.75; unit 791 -->

```text
 //set fixed framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = true;
 expSwAttr.stAuto.stFrmRate.FpsValue = 25; /*fps = 25*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //set auto framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = false;
 /*Generally, the automatic frame reduction mode is configured by tuning personnel
 in advance with the minimum frame rate and the gain value corresponding to the
 switching frame rate*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 792 -->

Geschwindigkeit der Belichtungsanpassung und Verzögerung in Bildern einstellen

<!-- Source EN PDF p.75; unit 793 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set ae speed
 expSwAttr.stAuto.stAeSpeed.DampOver = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampDark2Bright = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampUnder = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampBright2Dark = 0.8f;
 //set ae delay
 expSwAttr.stAuto.BlackDelayFrame = 2;
 expSwAttr.stAuto.WhiteDelayFrame = 4;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 794 -->

Flimmerunterdrückung konfigurieren

<!-- Source EN PDF p.75; unit 795 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set antifilicker mode
 expSwAttr.stAuto.stAntiFlicker.enable = true;
 expSwAttr.stAuto.stAntiFlicker.Frequency = AECV2_FLICKER_FREQUENCY_50HZ;
 expSwAttr.stAuto.stAntiFlicker.Mode = AECV2_ANTIFLICKER_AUTO_MODE;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 796 -->

AE-Gewichtung einstellen

<!-- Source EN PDF p.76; unit 797 -->

Stellen Sie eine 15X15-Gewichtung ein; der Algorithmus verdichtet sie entsprechend der tatsächlichen Blockaufteilung der Hardware. Derzeit gibt es zwei Einstellmöglichkeiten: Methode 1: Gewichte direkt in JSON ändern. Methode 2: Gewichte über stadvanced ändern; nach Deaktivierung kann die JSON-Gewichtung wiederhergestellt werden (empfohlene Methode).

<!-- Source EN PDF p.76; unit 798 -->

Für Gesichtsanwendungen wird empfohlen, beim Erscheinen eines Gesichts expSwAttr.stAdvanced.enable = true zu setzen und die Gewichte in expSwAttr.stAdvanced zu verwenden. Verschwindet das Gesicht, mit expSwAttr.stAdvanced.enable = false wieder die ursprünglichen Gewichte verwenden.

<!-- Source EN PDF p.76; unit 799 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 uint8_t GridWeights[225]={
 0,  0, 1,  2,  2,  3,  4,  5,  4, 3,  2,  2,  1,  0,  0,
 0,  1, 2,  3,  3,  4,  5,  6,  5, 4,  3,  3,  2,  1,  0,
 1,  2, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  2,  1,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 3,  5 ,7, 10, 11, 12, 13, 14, 13,12, 11, 10,  7,  5,  3,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 1,  2, 4,  6,  6,  7,  8,  9,  8, 7,  6,  6,  4,  2,  1,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0
 };
 //method one：
 memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
 sizeof(expSwAttr.GridWeights.uCoeff));
 //method two:
 expSwAttr.stAdvanced.enable = true; //important! true means preferring to use these parameters
 memcpy(expSwAttr.stAdvanced.GridWeights, GridWeights,
 sizeof(expSwAttr.stAdvanced.GridWeights));
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.76; unit 800 -->

#### 6.6.2  rk_aiq_user_api2_ae_getExpSwAttr

<!-- Source EN PDF p.76; unit 801 -->

【Beschreibung】 Softwareeigenschaften der AE-Belichtung abrufen.

<!-- Source EN PDF p.76; unit 802 -->

【Syntax】

<!-- Source EN PDF p.76; unit 803 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                         Uapi_ExpSwAttrV2_t* pExpSwAttr);
```

<!-- Source EN PDF p.77; unit 804 -->

【Parameter】

<!-- Source EN PDF p.77; unit 805 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pExpSwAttr | Zeiger auf die Struktur der AE-Belichtungssoftwareeigenschaften | Ausgabe |

<!-- Source EN PDF p.77; unit 806 -->

【Rückgabewert】

<!-- Source EN PDF p.77; unit 807 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.77; unit 808 -->

【Voraussetzungen】

<!-- Source EN PDF p.77; unit 809 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 810 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.77; unit 811 -->

#### 6.6.3  rk_aiq_user_api2_ae_setLinAeRouteAttr

<!-- Source EN PDF p.77; unit 812 -->

【Beschreibung】 Szenenbezogene AE-Belichtungsverteilungsstrategie im linearen Modus einstellen.

<!-- Source EN PDF p.77; unit 813 -->

【Syntax】

<!-- Source EN PDF p.77; unit 814 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinAeRouteAttr_t linAeRouteAttr);
```

<!-- Source EN PDF p.77; unit 815 -->

【Parameter】

<!-- Source EN PDF p.77; unit 816 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| linAeRouteAttr | Struktur der AE-Belichtungsverteilungsstrategie | Eingabe |

<!-- Source EN PDF p.77; unit 817 -->

【Rückgabewert】

<!-- Source EN PDF p.77; unit 818 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.77; unit 819 -->

【Voraussetzungen】

<!-- Source EN PDF p.77; unit 820 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 821 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.78; unit 822 -->

【Beispiel】

<!-- Source EN PDF p.78; unit 823 -->

```text
 Uapi_LinAeRouteAttr_t LinAeRouteAttr;
 memset(&LinAeRouteAttr,0x00,sizeof(Uapi_LinAeRouteAttr_t));
 rk_aiq_user_api2_ae_getLinAeRouteAttr(sys_ctx,&LinAeRouteAttr);
 int len = 8;
 float TimeDot[8]={0,0.01,0.01,0.02,0.02,0.03,0.03,0.04};
 float GainDot[8]={1,1,4,4,8,8,16,32};
 float IspGainDot[8]={1,1,1,1,1,1,1,1};
 int PirisDot[8]={512,512,512,512,512,512,512,512};
 LinAeRouteAttr.TimeDot_len = len;
 LinAeRouteAttr.GainDot_len = len;
 LinAeRouteAttr.IspDGainDot_len = len;
 LinAeRouteAttr.PIrisDot_len = len;
 LinAeRouteAttr.GainDot = GainDot;
 LinAeRouteAttr.IspDGainDot = IspGainDot;
 LinAeRouteAttr.TimeDot = TimeDot;
 LinAeRouteAttr.PIrisDot = PirisDot;
 rk_aiq_user_api2_ae_setLinAeRouteAttr(sys_ctx,LinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 824 -->

#### 6.6.4  rk_aiq_user_api2_ae_getLinAeRouteAttr

<!-- Source EN PDF p.78; unit 825 -->

【Beschreibung】 Szenenbezogene AE-Belichtungsverteilungsstrategie im linearen Modus abrufen.

<!-- Source EN PDF p.78; unit 826 -->

【Syntax】

<!-- Source EN PDF p.78; unit 827 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinAeRouteAttr_t* pLinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 828 -->

【Parameter】

<!-- Source EN PDF p.78; unit 829 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pLinAeRouteAttr | Zeiger auf die Struktur der AE-Belichtungsverteilungsstrategie | Ausgabe |

<!-- Source EN PDF p.78; unit 830 -->

【Rückgabewert】

<!-- Source EN PDF p.78; unit 831 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.78; unit 832 -->

【Voraussetzungen】

<!-- Source EN PDF p.79; unit 833 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 834 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.79; unit 835 -->

#### 6.6.5  rk_aiq_user_api2_ae_setHdrAeRouteAttr

<!-- Source EN PDF p.79; unit 836 -->

【Beschreibung】 Szenenbezogene AE-Belichtungsverteilungsstrategie im HDR-Modus einstellen.

<!-- Source EN PDF p.79; unit 837 -->

【Syntax】

<!-- Source EN PDF p.79; unit 838 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrAeRouteAttr_t hdrAeRouteAttr);
```

<!-- Source EN PDF p.79; unit 839 -->

【Parameter】

<!-- Source EN PDF p.79; unit 840 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| hdrAeRouteAttr | Struktur der AE-Belichtungsverteilungsstrategie | Eingabe |

<!-- Source EN PDF p.79; unit 841 -->

【Rückgabewert】

<!-- Source EN PDF p.79; unit 842 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.79; unit 843 -->

【Voraussetzungen】

<!-- Source EN PDF p.79; unit 844 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 845 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.79; unit 846 -->

【Beispiel】

<!-- Source EN PDF p.79; unit 847 -->

```text
 Uapi_HdrAeRouteAttr_t stHdrRoute;
 memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
 ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
 int len = 6;
 float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
                           0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
                           0.0, 0.03, 0.03, 0.03, 0.03, 0.03};
 float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12};
 float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1};
 int   HdrPIrisGainDot[6] = {1, 1, 1, 1, 1, 1};
 stHdrRoute.Frm0TimeDot_len = len;
 stHdrRoute.Frm0GainDot_len = len;
 stHdrRoute.Frm0IspDGainDot_len = len;
 stHdrRoute.Frm1TimeDot_len = len;
 stHdrRoute.Frm1GainDot_len = len;
 stHdrRoute.Frm1IspDGainDot_len = len;
 stHdrRoute.Frm2TimeDot_len = len;
 stHdrRoute.Frm2GainDot_len = len;
 stHdrRoute.Frm2IspDGainDot_len = len;
 stHdrRoute.PIrisDot_len = len;
 stHdrRoute.Frm0TimeDot = HdrTimeDot[0];
 stHdrRoute.Frm0GainDot = HdrGainDot[0];
 stHdrRoute.Frm0IspDGainDot = HdrIspDGainDot[0];
 stHdrRoute.Frm1TimeDot = HdrTimeDot[1];
 stHdrRoute.Frm1GainDot = HdrGainDot[1];
 stHdrRoute.Frm1IspDGainDot = HdrIspDGainDot[1];
 stHdrRoute.Frm2TimeDot = HdrTimeDot[2];
 stHdrRoute.Frm2GainDot = HdrGainDot[2];
 stHdrRoute.Frm2IspDGainDot = HdrIspDGainDot[2];
 stHdrRoute.PIrisDot = HdrPIrisGainDot;
 ret = rk_aiq_user_api2_ae_setHdrAeRouteAttr(ctx,stHdrRoute);
```

<!-- Source EN PDF p.80; unit 848 -->

#### 6.6.6  rk_aiq_user_api2_ae_getHdrAeRouteAttr

<!-- Source EN PDF p.80; unit 849 -->

【Beschreibung】 Szenenbezogene AE-Belichtungsverteilungsstrategie im HDR-Modus abrufen.

<!-- Source EN PDF p.80; unit 850 -->

【Syntax】

<!-- Source EN PDF p.80; unit 851 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrAeRouteAttr_t* pHdrAeRouteAttr);
```

<!-- Source EN PDF p.80; unit 852 -->

【Parameter】

<!-- Source EN PDF p.80; unit 853 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pHdrAeRouteAttr | Zeiger auf die Struktur der AE-Belichtungsverteilungsstrategie | Ausgabe |

<!-- Source EN PDF p.80; unit 854 -->

【Rückgabewert】

<!-- Source EN PDF p.80; unit 855 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.80; unit 856 -->

【Voraussetzungen】

<!-- Source EN PDF p.81; unit 857 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 858 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.81; unit 859 -->

#### 6.6.7  rk_aiq_user_api2_ae_setLinExpAttr

<!-- Source EN PDF p.81; unit 860 -->

【Beschreibung】 AE-Belichtungsparameter im linearen Modus einstellen.

<!-- Source EN PDF p.81; unit 861 -->

【Syntax】

<!-- Source EN PDF p.81; unit 862 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinExpAttrV2_t linExpAttr);
```

<!-- Source EN PDF p.81; unit 863 -->

【Parameter】

<!-- Source EN PDF p.81; unit 864 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| linExpAttr | AE-Belichtungsparameterstruktur | Eingabe |

<!-- Source EN PDF p.81; unit 865 -->

【Rückgabewert】

<!-- Source EN PDF p.81; unit 866 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.81; unit 867 -->

【Voraussetzungen】

<!-- Source EN PDF p.81; unit 868 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 869 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.81; unit 870 -->

【Beispiel】

<!-- Source EN PDF p.81; unit 871 -->

AE-Belichtungsparameter im linearen Modus einstellen, darunter beispielsweise Helligkeitsanpassung Evbias, Gegenlichtkompensation BackLightCtrl und Spitzlichtunterdrückung OverExpCtrl. Beachten Sie, dass Gegenlichtkompensation und Spitzlichtunterdrückung nicht gleichzeitig aktiviert werden können.

<!-- Source EN PDF p.81; unit 872 -->

```text
 Uapi_LinExpAttrV2_t linExpAttr;
 memset(&linExpAttr,0,sizeof(Uapi_LinExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getLinExpAttr(ctx, &linExpAttr);
 //set Evbias
 printf("Evbias=%f\n", linExpAttr.Evbias);
 linExpAttr.Evbias = 100.0f;
 //set BackLightCtrl
 linExpAttr.BackLightCtrl.Enable = true;
 linExpAttr.BackLightCtrl.StrBias = 200.0f;
 //set OverExpCtrl
 linExpAttr.OverExpCtrl.Enable = true;
 linExpAttr.OverExpCtrl.StrBias = 100.0f;
 ret = rk_aiq_user_api2_ae_setLinExpAttr(ctx, linExpAttr);
```

<!-- Source EN PDF p.82; unit 873 -->

#### 6.6.8  rk_aiq_user_api2_ae_getLinExpAttr

<!-- Source EN PDF p.82; unit 874 -->

【Beschreibung】 AE-Belichtungsparameter im linearen Modus abrufen.

<!-- Source EN PDF p.82; unit 875 -->

【Syntax】

<!-- Source EN PDF p.82; unit 876 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinExpAttrV2_t* pLinExpAttr);
```

<!-- Source EN PDF p.82; unit 877 -->

【Parameter】

<!-- Source EN PDF p.82; unit 878 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pLinExpAttr | Zeiger auf die AE-Belichtungsparameterstruktur | Ausgabe |

<!-- Source EN PDF p.82; unit 879 -->

【Rückgabewert】

<!-- Source EN PDF p.82; unit 880 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.82; unit 881 -->

【Voraussetzungen】

<!-- Source EN PDF p.82; unit 882 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.82; unit 883 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.82; unit 884 -->

#### 6.6.9  rk_aiq_user_api2_ae_setHdrExpAttr

<!-- Source EN PDF p.82; unit 885 -->

【Beschreibung】 AE-Belichtungsparameter im HDR-Modus einstellen.

<!-- Source EN PDF p.82; unit 886 -->

【Syntax】

<!-- Source EN PDF p.82; unit 887 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrExpAttrV2_t hdrExpAttr);
```

<!-- Source EN PDF p.82; unit 888 -->

【Parameter】

<!-- Source EN PDF p.83; unit 889 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| hdrExpAttr | AE-Belichtungsparameterstruktur | Eingabe |

<!-- Source EN PDF p.83; unit 890 -->

【Rückgabewert】

<!-- Source EN PDF p.83; unit 891 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.83; unit 892 -->

【Voraussetzungen】

<!-- Source EN PDF p.83; unit 893 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.83; unit 894 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.83; unit 895 -->

【Beispiel】

<!-- Source EN PDF p.83; unit 896 -->

AE-Belichtungsparameter im HDR-Modus einstellen, darunter beispielsweise manuelles oder automatisches Belichtungsverhältnis und Helligkeitsanpassung Evbias.

<!-- Source EN PDF p.83; unit 897 -->

```text
 Uapi_HdrExpAttrV2_t HdrExpAttr;
 memset(&HdrExpAttr,0,sizeof(Uapi_HdrExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getHdrExpAttr(ctx, &HdrExpAttr);
 //set hdr mframe params
 int len = 8;
 float explevel[8] = {0, 0.096, 0.192, 0.384, 0.96, 1.344, 1.92, 3};
 float setpoint[8] = {50, 45, 40, 35, 30, 25, 20, 15};
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel = explevel;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint = setpoint;
 //set ExpRatioType (AUTO/FIX)
 HdrExpAttr.ExpRatioCtrl.ExpRatioType = AECV2_HDR_RATIOTYPE_MODE_AUTO;
 //set Evbias
 HdrExpAttr.Evbias = -100.0f;
 ret = rk_aiq_user_api2_ae_setHdrExpAttr(ctx, HdrExpAttr);
```

<!-- Source EN PDF p.83; unit 898 -->

#### 6.6.10  rk_aiq_user_api2_ae_getHdrExpAttr

<!-- Source EN PDF p.83; unit 899 -->

【Beschreibung】 AE-Belichtungsparameter im HDR-Modus abrufen.

<!-- Source EN PDF p.83; unit 900 -->

【Syntax】

<!-- Source EN PDF p.84; unit 901 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrExpAttrV2_t* pHdrExpAttr);
```

<!-- Source EN PDF p.84; unit 902 -->

【Parameter】

<!-- Source EN PDF p.84; unit 903 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pHdrExpAttr | Zeiger auf die AE-Belichtungsparameterstruktur | Ausgabe |

<!-- Source EN PDF p.84; unit 904 -->

【Rückgabewert】

<!-- Source EN PDF p.84; unit 905 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.84; unit 906 -->

【Voraussetzungen】

<!-- Source EN PDF p.84; unit 907 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.84; unit 908 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.84; unit 909 -->

#### 6.6.11  rk_aiq_user_api2_ae_setIrisAttr

<!-- Source EN PDF p.84; unit 910 -->

【Beschreibung】 Parameter der AE-Blendensteuerung einstellen.

<!-- Source EN PDF p.84; unit 911 -->

【Syntax】

<!-- Source EN PDF p.84; unit 912 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t irisAttr);
```

<!-- Source EN PDF p.84; unit 913 -->

【Parameter】

<!-- Source EN PDF p.84; unit 914 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| irisAttr | Parameterstruktur der Blendensteuerung | Eingabe |

<!-- Source EN PDF p.84; unit 915 -->

【Rückgabewert】

<!-- Source EN PDF p.84; unit 916 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.85; unit 917 -->

【Voraussetzungen】

<!-- Source EN PDF p.85; unit 918 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.85; unit 919 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.85; unit 920 -->

【Beispiel】

<!-- Source EN PDF p.85; unit 921 -->

```text
 Uapi_IrisAttrV2_t irisAttr;
 ret = rk_aiq_user_api2_ae_getIrisAttr(ctx, &irisAttr);
 irisAttr.enable = true; /*run AIris*/
 //set P-iris attributes
 irisAttr.IrisType = IRIS_P_TYPE;
 irisAttr.PIrisAttr.TotalStep = 81;
 irisAttr.PIrisAttr.EffcStep = 44;
 irisAttr.PIrisAttr.ZeroIsMax = true;
 uint16_t StepTable[1024] = {512, 511, 506, 499, 491, 483, 474, 465, 456,
                             446, 437, 427, 417, 408, 398, 388, 378, 368,
                             359, 349, 339, 329, 319, 309, 300, 290, 280,
                             271, 261, 252, 242, 233, 224, 214, 205, 196,
                             187, 178, 170, 161, 153, 144, 136, 128, 120,
                             112, 105, 98, 90, 83, 77, 70, 64, 58,
                             52, 46, 41, 36, 31, 27, 23, 19, 16,
                             13, 10, 8, 6, 4, 3, 1, 1, 0,
                             0, 0, 0, 0, 0, 0, 0, 0, 0};
 memcpy(irisAttr.PIrisAttr.StepTable,StepTable,sizeof(irisAttr.PIrisAttr.StepTable
 ));
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set DC-iris attributes
 irisAttr.IrisType = IRIS_DC_TYPE;
 irisAttr.DCIrisAttr.Kp= 0.5f;
 irisAttr.DCIrisAttr.Ki= 0.2f;
 irisAttr.DCIrisAttr.Kd = 0.3f;
 irisAttr.DCIrisAttr.OpenPwmDuty = 40;
 irisAttr.DCIrisAttr.ClosePwmDuty = 22;
 irisAttr.DCIrisAttr.MinPwmDuty = 0;
 irisAttr.DCIrisAttr.MaxPwmDuty = 100;
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set manual iris with auto ae
 irisAttr.IrisOpType = RK_AIQ_OP_MODE_MANUAL;
 if(irisAttr.IrisType == IRIS_P_TYPE);
     irisAttr.ManualAttr.PIrisGainValue = 512; /*p-iris F#=1.4*/
 if(irisAttr.IrisType == IRIS_DC_TYPE);
     irisAttr.ManualAttr.DCIrisHoldValue = 20; /*dc-iris PwmDuty=20*/
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
```

<!-- Source EN PDF p.85; unit 922 -->

#### 6.6.12  rk_aiq_user_api2_ae_getIrisAttr

<!-- Source EN PDF p.85; unit 923 -->

【Beschreibung】 Parameter der AE-Blendensteuerung abrufen.

<!-- Source EN PDF p.85; unit 924 -->

【Syntax】

<!-- Source EN PDF p.86; unit 925 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t* irisAttr);
```

<!-- Source EN PDF p.86; unit 926 -->

【Parameter】

<!-- Source EN PDF p.86; unit 927 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| irisAttr | Parameterstruktur der Blendensteuerung | Ausgabe |

<!-- Source EN PDF p.86; unit 928 -->

【Rückgabewert】

<!-- Source EN PDF p.86; unit 929 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.86; unit 930 -->

【Voraussetzungen】

<!-- Source EN PDF p.86; unit 931 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.86; unit 932 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.86; unit 933 -->

#### 6.6.13  rk_aiq_user_api2_ae_setExpWinAttr

<!-- Source EN PDF p.86; unit 934 -->

【Beschreibung】 Eigenschaften des AE-Statistikfensters einstellen.

<!-- Source EN PDF p.86; unit 935 -->

【Syntax】

<!-- Source EN PDF p.86; unit 936 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx, const
 Uapi_ExpWin_t ExpWin);
```

<!-- Source EN PDF p.86; unit 937 -->

【Parameter】

<!-- Source EN PDF p.86; unit 938 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| ExpWin | Parameter der Fenstereigenschaften | Eingabe |

<!-- Source EN PDF p.86; unit 939 -->

【Rückgabewert】

<!-- Source EN PDF p.86; unit 940 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.87; unit 941 -->

【Voraussetzungen】

<!-- Source EN PDF p.87; unit 942 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.87; unit 943 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.87; unit 944 -->

【Beispiel】

<!-- Source EN PDF p.87; unit 945 -->

Die AE-Statistikkoordinaten anhand der Gesichtsposition ändern, um Helligkeitsstatistiken für den Gesichtsbereich zu erfassen.

<!-- Source EN PDF p.87; unit 946 -->

Hinweis: Beim Einstellen der Statistikkoordinaten muss ExpWin.h_offs+ExpWin.h_size&lt;=pic_width und ExpWin.v_offs+ExpWin.v_size&lt;=pic_height gelten.

<!-- Source EN PDF p.87; unit 947 -->

```text
 Uapi_ExpWin_t ExpWin;
 //Suppose the sensor resolution is 2688X1520, the lateral offset of the face from the upper left corner of the screen is 100 pixel, the vertical offset is 100 pixel, and the face size is a square with a side length of 100 pixel
 ExpWin.h_offs=100;
 ExpWin.v_offs=100;
 ExpWin.h_size=100;
 ExpWin.v_size=100;
 rk_aiq_user_api2_ae_setExpWinAttr(ctx, ExpWin);
```

<!-- Source EN PDF p.87; unit 948 -->

#### 6.6.14  rk_aiq_user_api2_ae_getExpWinAttr

<!-- Source EN PDF p.87; unit 949 -->

【Beschreibung】 Eigenschaften des AE-Statistikfensters abrufen.

<!-- Source EN PDF p.87; unit 950 -->

【Syntax】

<!-- Source EN PDF p.87; unit 951 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx,const
 Uapi_ExpWin_t* ExpWin);
```

<!-- Source EN PDF p.87; unit 952 -->

【Parameter】

<!-- Source EN PDF p.87; unit 953 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| ExpWin | Parameter der Fenstereigenschaften | Ausgabe |

<!-- Source EN PDF p.87; unit 954 -->

【Rückgabewert】

<!-- Source EN PDF p.87; unit 955 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.87; unit 956 -->

【Voraussetzungen】

<!-- Source EN PDF p.87; unit 957 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 958 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.88; unit 959 -->

#### 6.6.15  rk_aiq_user_api2_ae_queryExpResInfo

<!-- Source EN PDF p.88; unit 960 -->

【Beschreibung】 Interne AE-Zustandsinformationen abrufen.

<!-- Source EN PDF p.88; unit 961 -->

【Syntax】

<!-- Source EN PDF p.88; unit 962 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_queryExpResInfo(const rk_aiq_sys_ctx_t* ctx,
 Uapi_ExpQueryInfo_t* pExpResInfo);
```

<!-- Source EN PDF p.88; unit 963 -->

【Parameter】

<!-- Source EN PDF p.88; unit 964 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| pExpResInfo | Zeiger auf die Struktur mit internen AE-Zustandsinformationen | Ausgabe |

<!-- Source EN PDF p.88; unit 965 -->

【Rückgabewert】

<!-- Source EN PDF p.88; unit 966 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.88; unit 967 -->

【Voraussetzungen】

<!-- Source EN PDF p.88; unit 968 -->

Headerdateien: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 969 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.88; unit 970 -->

### 6.7   Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.88; unit 971 -->

#### 6.7.1  Uapi_ExpSwAttr_t

<!-- Source EN PDF p.88; unit 972 -->

【Beschreibung】

<!-- Source EN PDF p.88; unit 973 -->

Parameterstruktur zur Steuerung allgemeiner AE-Funktionen.

<!-- Source EN PDF p.88; unit 974 -->

【Definition】

<!-- Source EN PDF p.89; unit 975 -->

```text
 typedef struct Uapi_ExpSwAttrV2_s {
     rk_aiq_uapi_sync_t                 sync;
     uint8_t                            Enable;
     CalibDb_CamRawStatsModeV2_t        RawStatsMode;
     CalibDb_CamHistStatsModeV2_t       HistStatsMode;
     CalibDb_CamYRangeModeV2_t          YRangeMode;
     uint8_t                            AecRunInterval;
     RKAiqOPMode_t                      AecOpType;
     Cam15x15UCharMatrix_t              GridWeights;
     Uapi_AeAttrV2_t                    stAuto;
     Uapi_MeAttrV2_t                    stManual;
     Uapi_ExpSwAttr_AdvancedV2_t        stAdvanced;
 } Uapi_ExpSwAttrV2_t;
```

<!-- Source EN PDF p.89; unit 976 -->

【Felder】

<!-- Source EN PDF p.89; unit 977 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definitionen von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| Enable | AEC-Aktivierungsschalter. 1: Aec-Algorithmus einschalten; 0: Aec-Algorithmus<br>ausschalten. Die Belichtung verbleibt auf dem Wert vor dem Ausschalten. |
| RawStatsMode | Helligkeitsstatistikmodus des AEC-Moduls. Vier Modi:<br>CAM_RAWSTATSV2_MODE_Y/R/G/B; standardmäßig Y. |
| HistStatsMode | Histogrammstatistikmodus des AEC-Moduls. Fünf Modi:<br>CAM_HISTV2_MODE_Y/R/G/B; standardmäßig Y. |
| YRangeMode | Wertebereichsmodus des Y-Kanals im Aec-Modul. Zwei Modi:<br>CAM_YRANGEV2_MODE_FULL/LIMITED; standardmäßig FULL. |
| AecRunInterval | Ausführungsintervall des AE-Algorithmus, Wertebereich [0,255], Standardwert 0.<br>Bei 0 AE in jedem Bild ausführen; bei 1 AE alle 1 Bilder ausführen; entsprechend fortsetzen. |
| AecOpType | Belichtungsmodus: automatische Belichtung (RK_AIQ_OP_MODE_AUTO) oder<br>manuelle Belichtung (RK_AIQ_OP_MODE_MANUAL). Standardmäßig AUTO.<br>Manuelle Belichtung muss zusammen mit stManual verwendet werden, um den<br>manuellen Belichtungswert einzustellen. |
| GridWeights | Fenstergewichtung (Histogramm), enthält 15*15 Arrayelemente, Wertebereich [0,32] |
| stAuto | Parameterstruktur der automatischen Belichtung |
| stManual | Parameterstruktur der manuellen Belichtung |
| stAdvanced | Parameterstrukturen |

<!-- Source EN PDF p.89; unit 978 -->

Zugehöriger Datentyp

<!-- Source EN PDF p.89; unit 979 -->

rk_aiq_uapi_sync_t

<!-- Source EN PDF p.89; unit 980 -->

Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.89; unit 981 -->

Uapi_AeAttrV2_t

<!-- Source EN PDF p.90; unit 982 -->

Uapi_MeAttrV2_t

<!-- Source EN PDF p.90; unit 983 -->

6.7.1.1  Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.90; unit 984 -->

【Beschreibung】

<!-- Source EN PDF p.90; unit 985 -->

Parameterstrukturen mit Vorrang.

<!-- Source EN PDF p.90; unit 986 -->

【Definition】

<!-- Source EN PDF p.90; unit 987 -->

```text
 typedef struct Aec_uapi_advanced_attr_s {
     bool                          enable;
     uint8_t                       GridWeights[15 * 15];
     bool                          SetAeRangeEn;
     Aec_LinAeRange_t              SetLinAeRange;
     Aec_HdrAeRange_t              SetHdrAeRange;
 } Aec_uapi_advanced_attr_t;
 typedef Aec_uapi_advanced_attr_t Uapi_ExpSwAttr_AdvancedV2_t;
```

<!-- Source EN PDF p.90; unit 988 -->

【Felder】

<!-- Source EN PDF p.90; unit 989 -->

| Feldname | Beschreibung |
|---|---|
| enable | Auf 1 setzen, um den Parametern in dieser Struktur Vorrang zu geben |
| GridWeights | AE-Gewichtung, Größe 15X15. |
| SetAeRangeEn | Auf 1 setzen, um den Bereich der automatischen Belichtungskomponenten einzustellen;<br>bei 0 gilt stattdessen die Abstimmdatei. |
| SetLinAeRange | Eingestellter Bereich der automatischen Belichtungskomponenten bei linearer Belichtung<br>(nicht der endgültig wirksame Bereich) |
| SetHdrAeRange | Eingestellter Bereich der automatischen Belichtungskomponenten bei HDR-Belichtung<br>(nicht der endgültig wirksame Bereich) |

<!-- Source EN PDF p.90; unit 990 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.90; unit 991 -->

In Uapi_ExpSwAttrV2_t ist ein Satz AE-Gewichte mit der Größe 15X15 definiert. Der Algorithmus erweitert die Gewichtung entsprechend der tatsächlich von der Hardware konfigurierten Gewichtsanzahl. Für Aufgaben wie die Gesichtsbelichtung kann der in Uapi_ExpSwAttr_AdvancedV2_t definierte Gewichtssatz mit 15X15 Werten verwendet werden. Der Algorithmus verdichtet diese Gewichte entsprechend der tatsächlichen Hardwareanzahl. Um den in Uapi_ExpSwAttr_Advanced_t definierten Gewichtssatz zu verwenden, muss enable auf 1 gesetzt werden.

<!-- Source EN PDF p.90; unit 992 -->

Beim Einstellen des AE-Parameterbereichs über die API muss SetAeRangeEn auf 1 gesetzt werden; andernfalls gilt standardmäßig der automatische Belichtungsparameterbereich der Abstimmdatei. Je nach Belichtungsmodus erfolgt die Einstellung über SetLinAeRange oder SetHdrAeRange. SetHdrAeRange unterstützt die Bereichseinstellung für jedes Bild. Der endgültig wirksame Belichtungszeit- und Verstärkungsbereich muss zusätzlich in stAuto abgefragt werden; hier steht nur der eingestellte, nicht der endgültig wirksame Bereich.

<!-- Source EN PDF p.91; unit 993 -->

6.7.1.1.1 Aec_AeRange_t

<!-- Source EN PDF p.91; unit 994 -->

【Beschreibung】 AE-Parameterbereich definieren.

<!-- Source EN PDF p.91; unit 995 -->

【Definition】

<!-- Source EN PDF p.91; unit 996 -->

```text
 typedef struct Aec_AeRange_s {
     float                   Min;
     float                   Max;
 } Aec_AeRange_t;
```

<!-- Source EN PDF p.91; unit 997 -->

【Felder】

<!-- Source EN PDF p.91; unit 998 -->

| Feldname | Beschreibung |
|---|---|
| Min | Unterer Grenzwert |
| Max | Oberer Grenzwert |

<!-- Source EN PDF p.91; unit 999 -->

6.7.1.1.2 Aec_LinAeRange_t

<!-- Source EN PDF p.91; unit 1000 -->

【Beschreibung】 Parameterbereich für den linearen AE-Modus definieren.

<!-- Source EN PDF p.91; unit 1001 -->

【Definition】

<!-- Source EN PDF p.91; unit 1002 -->

```text
 typedef struct Aec_LinAeRange_s {
     Aec_AeRange_t      stExpTimeRange;
     Aec_AeRange_t      stGainRange;
     Aec_AeRange_t      stIspDGainRange;
     Aec_AeRange_t      stPIrisRange;
 } Aec_LinAeRange_t;
```

<!-- Source EN PDF p.91; unit 1003 -->

【Felder】

<!-- Source EN PDF p.91; unit 1004 -->

| Feldname | Beschreibung |
|---|---|
| stExpTimeRange | Belichtungszeitbereich; Maximum und Minimum in Millisekunden einstellen |
| stGainRange | Analoger Verstärkungsbereich des Sensors; Maximum und Minimum einstellen |
| stIspDGainRange | Digitaler ISP-Verstärkungsbereich; Maximum und Minimum einstellen |
| stPIrisRange | Bereich der blendenäquivalenten Verstärkung; nur P-Iris-Blendensteuerung unterstützt |

<!-- Source EN PDF p.91; unit 1005 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.91; unit 1006 -->

Wenn Maximum/Minimum jeder Belichtungskomponente den Standardwert 0 besitzt, wird der eingestellte Bereich nicht wirksam. Die tatsächlichen Maxima/Minima werden durch die minimalen und maximalen Knotenwerte des AecRoute-Belichtungszerlegungspfads bestimmt.

<!-- Source EN PDF p.92; unit 1007 -->

Wenn Maximum/Minimum jeder Belichtungskomponente ungleich 0 ist, wird der eingestellte Bereich wirksam. Überschreitet er nicht die Grenzen von Sensor oder ISP, gelten seine Maxima/Minima als tatsächliche Werte; der AecRoute-Belichtungszerlegungspfad wird entsprechend korrigiert und seine maximalen/minimalen Knotenwerte werden auf die eingestellten Komponentenwerte geändert. Werden Sensor- oder ISP-Grenzen überschritten, richten sich die tatsächlichen Maxima/Minima nach den minimalen und maximalen Knotenwerten des AecRoute-Belichtungszerlegungspfads.

<!-- Source EN PDF p.92; unit 1008 -->

6.7.1.1.3 Aec_HdrAeRange_t

<!-- Source EN PDF p.92; unit 1009 -->

【Beschreibung】 Parameterbereich für den AE-HDR-Modus definieren.

<!-- Source EN PDF p.92; unit 1010 -->

【Definition】

<!-- Source EN PDF p.92; unit 1011 -->

```text
 typedef struct Aec_HdrAeRange_s {
     Aec_AeRange_t      stExpTimeRange[3];
     Aec_AeRange_t      stGainRange[3];
     Aec_AeRange_t      stIspDGainRange[3];
     Aec_AeRange_t      stPIrisRange;
 } Aec_HdrAeRange_t;
```

<!-- Source EN PDF p.92; unit 1012 -->

【Felder】

<!-- Source EN PDF p.92; unit 1013 -->

| Feldname | Beschreibung |
|---|---|
| stExpTimeRange | Belichtungszeitbereich; Maximum und Minimum in Sekunden einstellen.<br>Arrayindizes 0/1/2 entsprechen kurzen, mittleren bzw. langen Bildern. |
| stGainRange | Analoger Sensorverstärkungsbereich; Maximum und Minimum einstellen.<br>Arrayindizes 0/1/2 entsprechen kurzen, mittleren bzw. langen Bildern. |
| stIspDGainRange | Digitaler ISP-Verstärkungsbereich; Maximum und Minimum einstellen.<br>Arrayindizes 0/1/2 entsprechen kurzen, mittleren bzw. langen Bildern. |
| stPIrisRange | Bereich der blendenäquivalenten Verstärkung; Maximum und Minimum einstellen |

<!-- Source EN PDF p.92; unit 1014 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.92; unit 1015 -->

stExpTimeRange, stGainRange und stIspDGainRange sind als Arrays mit 3 Elementen vordefiniert. Im HDR-Modus mit 2 Bildern gelten nur die Elemente 0 und 1 für die Belichtungskomponentenbereiche kurzer bzw. langer Bilder. Im HDR-Modus mit 3 Bildern gelten 0–2 für kurze, mittlere bzw. lange Bilder.

<!-- Source EN PDF p.92; unit 1016 -->

Wenn Maximum/Minimum jeder Belichtungskomponente den Standardwert 0 besitzt, wird der eingestellte Bereich nicht wirksam. Die tatsächlichen Maxima/Minima werden durch die minimalen und maximalen Knotenwerte des vom Algorithmus korrigierten Belichtungszerlegungspfads bestimmt.

<!-- Source EN PDF p.92; unit 1017 -->

Wenn Maximum/Minimum jeder Belichtungskomponente ungleich 0 ist, wird der eingestellte Bereich wirksam. Überschreitet er die Sensor- oder ISP-Grenzen nicht, gelten seine Maxima/Minima als tatsächliche Werte. Der Belichtungszerlegungspfad wird korrigiert und seine maximalen/minimalen Knotenwerte werden auf die eingestellten Komponentenwerte geändert. Werden Sensor- oder ISP-Grenzen

<!-- Source EN PDF p.93; unit 1018 -->

überschritten, richten sich die tatsächlichen Maxima/Minima nach den maximalen und minimalen Knotenwerten des Belichtungszerlegungspfads. Die Plattform 1106 unterstützt derzeit kein isp dgain; stIspDGainRange ist daher vorläufig unwirksam.

<!-- Source EN PDF p.93; unit 1019 -->

6.7.1.2  Uapi_AeAttrV2_t

<!-- Source EN PDF p.93; unit 1020 -->

【Beschreibung】 Eigenschaften der automatischen AE-Belichtung definieren.

<!-- Source EN PDF p.93; unit 1021 -->

【Definition】

<!-- Source EN PDF p.93; unit 1022 -->

```text
 typedef struct Uapi_AeAttrV2_s {
     Uapi_AeSpeedV2_t           stAeSpeed;
     DelayFrmNum
     uint8_t                    BlackDelayFrame;
     uint8_t                    WhiteDelayFrame;
     Auto/Fixed fps
     Uapi_AeFpsAttrV2_t         stFrmRate;
     Uapi_AntiFlickerV2_t       stAntiFlicker;
     auto range
     Aec_LinAeRange_t           LinAeRange;//result LinAerange
     Aec_HdrAeRange_t           HdrAeRange;//result HdrAerange
 } Uapi_AeAttrV2_t;
```

<!-- Source EN PDF p.93; unit 1023 -->

【Felder】

<!-- Source EN PDF p.93; unit 1024 -->

| Feldname | Beschreibung |
|---|---|
| stAeSpeed | Anpassungsgeschwindigkeit der automatischen Belichtung |
| BlackDelayFrame | Verzögerung der automatischen Belichtung: Liegt die Bildhelligkeit länger als<br>BlackDelayFrame Bilder unter dem Sollwert, beginnt Ae mit der Anpassung. |
| WhiteDelayFrame | Verzögerung der automatischen Belichtung: Liegt die Bildhelligkeit für<br>WhiteDelayFrame Bilder über dem Sollwert, beginnt Ae mit der Anpassung. |
| stFrmRate | Struktur für den Bildratenmodus der automatischen Belichtung: feste Bildrate<br>oder automatische Bildratenreduzierung |
| stAntiFlicker | Parameter zur Unterdrückung netzfrequenzbedingten Flimmerns |
| LinAeRange | AE-Bereichsstruktur im linearen Modus (endgültig wirksamer linearer Belichtungsbereich) |
| HdrAeRange | AE-Bereichsstruktur im HDR-Modus (endgültig wirksamer HDR-Belichtungsbereich) |

<!-- Source EN PDF p.93; unit 1025 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.93; unit 1026 -->

LinAeRange/HdrAeRange enthält den nach interner Prüfung und Korrektur durch den Algorithmus tatsächlich verwendeten Parameterbereich. Überschreitet der per API eingestellte AE-Bereich die Sensorgrenzen, gilt der sensorbegrenzte Bereich. Diese Grenzen finden Sie im AE-Modulparameter sensorinfo des Dokuments Rockchip_Tuning_Guide_ISP30_CN.pdf.

<!-- Source EN PDF p.94; unit 1027 -->

Zum Einstellen des Bereichs der automatischen Belichtungskomponenten verwendet die API die Parameter des oben beschriebenen Uapi_ExpSwAttr_AdvancedV2_t und setzt SetAeRangeEn auf 1. Andernfalls gilt standardmäßig der automatische Belichtungsparameterbereich der Abstimmdatei.

<!-- Source EN PDF p.94; unit 1028 -->

6.7.1.2.1 Uapi_AeSpeedV2_t

<!-- Source EN PDF p.94; unit 1029 -->

【Beschreibung】 Situationsabhängige AE-Anpassungsgeschwindigkeiten definieren.

<!-- Source EN PDF p.94; unit 1030 -->

【Definition】

<!-- Source EN PDF p.94; unit 1031 -->

```text
 typedef struct CalibDb_AeSpeedV2_s {
     float                   DampOver;
     float                   DampUnder;
     float                   DampDark2Bright;
     float                   DampBright2Dark;
 } CalibDb_AeSpeedV2_t;
 typedef CalibDb_AeSpeedV2_t Uapi_AeSpeedV2_t;
```

<!-- Source EN PDF p.94; unit 1032 -->

【Felder】

<!-- Source EN PDF p.94; unit 1033 -->

| Feldname | Beschreibung |
|---|---|
| DampOver | Bei stabiler Umgebungshelligkeit: Belichtungsanpassungsgeschwindigkeit,<br>wenn die Bildhelligkeit über dem Sollwert liegt; Wertebereich [0,1]. |
| DampUnder | Bei stabiler Umgebungshelligkeit: Belichtungsanpassungsgeschwindigkeit,<br>wenn die Bildhelligkeit unter dem Sollwert liegt; Wertebereich [0,1]. |
| DampDark2Bright | Bei plötzlicher Änderung der Umgebungshelligkeit: Geschwindigkeit<br>der Belichtungsanpassung von dunkel zu hell; Wertebereich [0,1]. |
| DampBright2Dark | Bei plötzlicher Änderung der Umgebungshelligkeit: Geschwindigkeit<br>der Belichtungsanpassung von hell zu dunkel; Wertebereich [0,1]. |

<!-- Source EN PDF p.94; unit 1034 -->

6.7.1.2.2 Uapi_AeFpsAttrV2_t

<!-- Source EN PDF p.94; unit 1035 -->

【Beschreibung】 AE-Bildrateneigenschaften definieren.

<!-- Source EN PDF p.94; unit 1036 -->

【Definition】

<!-- Source EN PDF p.94; unit 1037 -->

```text
 typedef struct CalibDb_AeFrmRateAttrV2_s {
     bool             isFpsFix;
     uint8_t          FpsValue;
 } CalibDb_AeFrmRateAttrV2_t;
 typedef CalibDb_AeFrmRateAttrV2_t Uapi_AeFpsAttrV2_t;
```

<!-- Source EN PDF p.94; unit 1038 -->

【Felder】

<!-- Source EN PDF p.95; unit 1039 -->

| Feldname | Beschreibung |
|---|---|
| isFpsFix | Aktivierung fester Bildrate bei automatischer Belichtung. Standardwert FALSE:<br>automatische Bildratenreduzierung. TRUE bedeutet einen Modus<br>mit fester Bildrate. |
| FpsValue | Nur bei fester Bildrate wirksam. Beim Standardwert 0 wird die Standardbildrate<br>des Treibers fest verwendet; bei einem Wert ungleich 0 gilt die eingestellte Bildrate. |

<!-- Source EN PDF p.95; unit 1040 -->

6.7.1.2.3 Uapi_AntiFlickerV2_t

<!-- Source EN PDF p.95; unit 1041 -->

【Beschreibung】 Eigenschaften der Flimmerunterdrückung definieren.

<!-- Source EN PDF p.95; unit 1042 -->

【Definition】

<!-- Source EN PDF p.95; unit 1043 -->

```text
 typedef struct CalibDb_AntiFlickerAttrV2_s {
     bool                           enable;
     CalibDb_FlickerFreq_t          Frequency;
     CalibDb_AntiFlickerMode_t      Mode;
 } CalibDb_AntiFlickerAttrV2_t;
 typedef CalibDb_AntiFlickerAttrV2_t Uapi_AntiFlickerV2_t;
```

<!-- Source EN PDF p.95; unit 1044 -->

【Felder】

<!-- Source EN PDF p.95; unit 1045 -->

| Feldname | Beschreibung |
|---|---|
| enable | Aktivierungszustand der netzfrequenzbezogenen Flimmerunterdrückung:<br>0: Funktion ausschalten; 1: Funktion einschalten |
| Frequency | Frequenzeigenschaft der Flimmerunterdrückung mit insgesamt 3 Bildraten:<br>AECV2_FLICKER_FREQUENCY_OFF (wirksam bei enable<br>0), AECV2_FLICKER_FREQUENCY_50HZ, AECV2_FLICKER_FREQUENCY_60HZ.<br>Standardmäßig AECV2_FLICKER_FREQUENCY_50HZ (Netzfrequenz 50 Hz). |
| Mode | Modus der Flimmerunterdrückung; zwei Modi:<br>AECV2_ANTIFLICKER_NORMAL_MODE (normaler Modus),<br>AECV2_ANTIFLICKER_AUTO_MODE (automatischer Modus) |

<!-- Source EN PDF p.95; unit 1046 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.95; unit 1047 -->

Zum Ausschalten der Flimmerunterdrückung muss enable auf 0 gesetzt werden; der Algorithmus konfiguriert dann automatisch Frequency=AECV2_FLICKER_FREQUENCY_OFF. Ist enable auf 1 gesetzt und als Frequenz AECV2_FLICKER_FREQUENCY_OFF konfiguriert, ist dieser Frequenzwert ungültig und wird durch den Standardwert AECV2_FLICKER_FREQUENCY_50HZ ersetzt.

<!-- Source EN PDF p.95; unit 1048 -->

Im normalen Modus AECV2_ANTIFLICKER_NORMAL_MODE kann die Belichtungszeit entsprechend der Helligkeit angepasst werden. Die minimale Belichtungszeit ist fest auf 1/120 sec (60Hz) oder 1/100 sec (50Hz) gesetzt und wird nicht durch die minimale Belichtungszeit begrenzt.

<!-- Source EN PDF p.95; unit 1049 -->

Beleuchtete Umgebung: Die Belichtungszeit kann an die Lichtquellenfrequenz angepasst werden, wodurch Bildflimmern vermieden wird.

<!-- Source EN PDF p.96; unit 1050 -->

Sehr helle Umgebung: Je höher die Helligkeit, desto kürzer muss die Belichtungszeit sein. Die minimale Belichtungszeit des normalen Flimmerunterdrückungsmodus kann nicht passend zur Lichtquellenfrequenz eingestellt werden, wodurch Überbelichtung entsteht. AECV2_ANTIFLICKER_AUTO_MODE ist der automatische Modus: Die Belichtungszeit wird helligkeitsabhängig angepasst und kann bis zur minimalen Sensorbelichtungszeit reichen. Der Unterschied zum normalen Modus zeigt sich vor allem bei hoher Helligkeit: Die minimale Sensorbelichtungszeit kann Überbelichtung wirksam unterdrücken, allerdings ist die Flimmerunterdrückung dann unwirksam.

<!-- Source EN PDF p.96; unit 1051 -->

6.7.1.3  Uapi_MeAttrV2_t

<!-- Source EN PDF p.96; unit 1052 -->

【Beschreibung】

<!-- Source EN PDF p.96; unit 1053 -->

Manuelle Belichtungsparametereinstellung, je nach Belichtungsmodus in die beiden Parametersätze LinearAE und HdrAE gegliedert.

<!-- Source EN PDF p.96; unit 1054 -->

【Definition】

<!-- Source EN PDF p.96; unit 1055 -->

```text
 typedef struct Uapi_MeAttrV2_s {
     Uapi_LinMeAttrV2_t     stLinMe;
     Uapi_HdrMeAttrV2_t     stHdrMe;
 } Uapi_MeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1056 -->

【Zugehörige Datentypen】

<!-- Source EN PDF p.96; unit 1057 -->

Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1058 -->

Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.96; unit 1059 -->

6.7.1.3.1 Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1060 -->

【Beschreibung】

<!-- Source EN PDF p.96; unit 1061 -->

Manuelle Belichtungssteuerparameter für LinearAE.

<!-- Source EN PDF p.96; unit 1062 -->

【Definition】

<!-- Source EN PDF p.96; unit 1063 -->

```text
 typedef struct Uapi_LinMeAttrV2_s {
     bool                 ManualTimeEn;
     bool                 ManualGainEn;
     bool                 ManualIspDgainEn;
     float                TimeValue;
     float                GainValue;
     float                IspDGainValue;
 } Uapi_LinMeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1064 -->

【Felder】

<!-- Source EN PDF p.97; unit 1065 -->

| Feldname | Beschreibung |
|---|---|
| ManualTimeEn | Manuelle Belichtungszeit aktivieren; Standardwert 1 |
| ManualGainEn | Manuelle Sensorverstärkung aktivieren; Standardwert 1 |
| ManualIspDgainEn | Manuelle digitale ISP-Verstärkung aktivieren; Standardwert 1 |
| TimeValue | Manuelle Belichtungszeit in s; Parameterwert durch Sensor begrenzt |
| GainValue | Manueller Sensorverstärkungswert; Parameterwert durch Sensor begrenzt |
| IspDGainValue | Manueller digitaler ISP-Verstärkungswert; Parameterwert durch ISP begrenzt |

<!-- Source EN PDF p.97; unit 1066 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.97; unit 1067 -->

Dieser Modulparameter gilt nur bei AeOptype = MANUAL. Sind ManualTimeEn, ManualGainEn und ManualIspDgainEn alle 1, handelt es sich um manuellen Modus. Sobald einer dieser drei Parameter nicht aktiviert ist, liegt halbautomatischer Modus vor. Sind alle vier oben genannten Werte 0, entspricht dies Automatikmodus und das System meldet einen Fehlerhinweis (die Quelle schreibt hier trotz der drei genannten Parameter „vier“).

<!-- Source EN PDF p.97; unit 1068 -->

Im manuellen/halbmanuellen Modus werden Belichtungszeit und Verstärkung durch die maximalen/minimalen Werte des Automatikmodus begrenzt. Bei Überschreitung gelten stattdessen die jeweiligen Maxima/Minima des Automatikmodus.

<!-- Source EN PDF p.97; unit 1069 -->

RK356X unterstützt keine digitale ISP-Verstärkung; ManualIspDgainEn und IspDGainValue sind daher unwirksam.

<!-- Source EN PDF p.97; unit 1070 -->

6.7.1.3.2 Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.97; unit 1071 -->

【Beschreibung】

<!-- Source EN PDF p.97; unit 1072 -->

Manuelle Belichtungssteuerparameter für HdrAE.

<!-- Source EN PDF p.97; unit 1073 -->

【Definition】

<!-- Source EN PDF p.97; unit 1074 -->

```text
 typedef struct Uapi_HdrMeAttrV2_s {
     bool                    ManualTimeEn;
     bool                    ManualGainEn;
     bool                    ManualIspDgainEn;
     Cam3x1FloatMatrix_t     TimeValue;
     Cam3x1FloatMatrix_t     GainValue;
     Cam3x1FloatMatrix_t     IspDGainValue;
 } Uapi_HdrMeAttrV2_t;
```

<!-- Source EN PDF p.97; unit 1075 -->

【Felder】

<!-- Source EN PDF p.97; unit 1076 -->

Die Variablen haben dieselbe Bedeutung wie in Uapi_LinMeAttrV2_t.

<!-- Source EN PDF p.97; unit 1077 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.97; unit 1078 -->

TimeValue/GainValue/IspDGainValue sind Arrays mit 3 Elementen. Im HDR-Modus mit 2 Bildern gelten die Elemente [0-1] für kurze bzw. lange Bilder. Im HDR-Modus mit 3 Bildern gelten [0-2] für kurze, mittlere bzw. lange Bilder.

<!-- Source EN PDF p.97; unit 1079 -->

Im manuellen/halbmanuellen Modus werden Belichtungszeit und Verstärkung durch die maximalen/minimalen Werte des Automatikmodus begrenzt. Bei Überschreitung gelten stattdessen die jeweiligen Maxima/Minima des Automatikmodus.

<!-- Source EN PDF p.97; unit 1080 -->

RK356X unterstützt derzeit keine digitale ISP-Verstärkung; ManualIspDgainEn und IspDGainValue sind daher unwirksam.

<!-- Source EN PDF p.98; unit 1081 -->

#### 6.7.2  Uapi_LinAeRouteAttr_t

<!-- Source EN PDF p.98; unit 1082 -->

【Beschreibung】 Eigenschaften des linearen AE-Belichtungszerlegungspfads definieren.

<!-- Source EN PDF p.98; unit 1083 -->

【Definition】

<!-- Source EN PDF p.98; unit 1084 -->

```text
 typedef struct CalibDb_LinAeRoute_AttrV2_s {
     float* TimeDot;
     int TimeDot_len;
     float* GainDot;
     int GainDot_len;
     float* IspDGainDot;
     int IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_LinAeRoute_AttrV2_t;
 typedef struct Uapi_LinAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinAeRoute_AttrV2_t   Params;
 } Uapi_LinAeRouteAttr_t;
```

<!-- Source EN PDF p.98; unit 1085 -->

【Felder】

<!-- Source EN PDF p.98; unit 1086 -->

| Feldname | Beschreibung |
|---|---|
| TimeDot | Sensorbelichtungszeitknoten in s |
| GainDot | Sensorbelichtungsverstärkungsknoten, |
| IspgainDot | Knoten der digitalen ISP-Verstärkung |
| PIrisGainDot | Knoten der blendenäquivalenten Verstärkung |

<!-- Source EN PDF p.98; unit 1087 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.98; unit 1088 -->

Die Anzahl der Knoten der Belichtungszerlegungskurve ist nicht begrenzt; empfohlen werden jedoch mindestens 6.

<!-- Source EN PDF p.98; unit 1089 -->

Die Belichtung eines Knotens ist das Produkt seiner Komponenten wie Belichtungszeit, Sensorverstärkung, digitaler ISP-Verstärkung und blendenäquivalenter Verstärkung. Sie muss monoton steigen, d. h. ein späterer Knoten muss stärker belichtet sein als der vorherige. Der erste Knoten hat die geringste und der zweite Knoten die größte Belichtung (so formuliert es die Quelle).

<!-- Source EN PDF p.98; unit 1090 -->

Die Belichtungszeitkomponente eines Knotens wird in Sekunden angegeben; als Minimum ist 0 erlaubt. Der tatsächliche minimale Belichtungszeitcode wird intern anhand der Sensorgrenze korrigiert.

<!-- Source EN PDF p.98; unit 1091 -->

Die Blendenkomponente unterstützt nur P-Iris, nicht DC-Iris. Die äquivalente P-Iris-Verstärkung gilt nur bei aktivierter automatischer Airis-Blendenfunktion; andernfalls bleibt die Blende standardmäßig auf ihrer Anfangsgröße fixiert. Die Berechnung der äquivalenten P-Iris-Verstärkung ist im Modul AecIrisCtrl beschrieben.

<!-- Source EN PDF p.98; unit 1092 -->

Die eingestellten Knoten des Belichtungszerlegungspfads bilden nicht den endgültigen Pfad. Die tatsächlichen maximalen/minimalen Werte jeder endgültigen Belichtungskomponente ergeben sich aus der Kombination der Zerlegungsknoten und der manuell konfigurierten Komponentenmaxima/-minima. Zunächst erfolgt eine erste Korrektur der maximalen/minimalen Knotenwerte:

<!-- Source EN PDF p.99; unit 1093 -->

Überschreiten diese Werte die SENSOR- oder ISP-Grenzen nicht, bleiben sie unverändert; andernfalls werden sie auf die Sensor- oder ISP-Grenzen begrenzt. Sind die manuell konfigurierten Komponentenmaxima/-minima 0, gilt der nach der ersten Korrektur erhaltene Pfad. Sind sie ungleich 0 und liegen innerhalb der SENSOR- oder ISP-Grenzen, erfolgt eine zweite Korrektur; dann richten sich die Knotenmaxima/-minima nach dem manuell eingestellten Bereich. Überschreitet dieser Bereich die Sensor- oder ISP-Grenzen, gelten die Ergebnisse der ersten Korrektur. Wenn die Belichtung benachbarter Knoten steigt, sollte nur eine Komponente steigen und die übrigen unverändert bleiben. Die steigende Komponente bestimmt die Verteilungsstrategie dieses Pfadsegments. Steigt beispielsweise die Verstärkung bei konstanten übrigen Komponenten, hat dieses Segment Verstärkungspriorität.

<!-- Source EN PDF p.99; unit 1094 -->

RK356X unterstützt derzeit keine digitale ISP-Verstärkung; IspgainDot ist daher unwirksam.

<!-- Source EN PDF p.99; unit 1095 -->

#### 6.7.3  Uapi_HdrAeRouteAttr_t

<!-- Source EN PDF p.99; unit 1096 -->

【Beschreibung】 Eigenschaften des AE-HDR-Belichtungszerlegungspfads definieren.

<!-- Source EN PDF p.99; unit 1097 -->

【Definition】

<!-- Source EN PDF p.99; unit 1098 -->

```text
 typedef struct CalibDb_HdrAeRoute_AttrV2_s {
     float* Frm0TimeDot;
     int Frm0TimeDot_len;
     float* Frm0GainDot;
     int Frm0GainDot_len;
     float* Frm0IspDGainDot;
     int Frm0IspDGainDot_len;
     float* Frm1TimeDot;
     int Frm1TimeDot_len;
     float* Frm1GainDot;
     int Frm1GainDot_len;
     float* Frm1IspDGainDot;
     int Frm1IspDGainDot_len;
     float* Frm2TimeDot;
     int Frm2TimeDot_len;
     float* Frm2GainDot;
     int Frm2GainDot_len;
     float* Frm2IspDGainDot;
     int Frm2IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_HdrAeRoute_AttV2r_t;
 typedef struct Uapi_HdrAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAeRoute_AttrV2_t   Params;
 } Uapi_HdrAeRouteAttr_t;
```

<!-- Source EN PDF p.100; unit 1099 -->

【Felder】

<!-- Source EN PDF p.100; unit 1100 -->

| Feldname | Beschreibung |
|---|---|
| Frm0/1/2TimeDot | Belichtungszeitknoten in Sekunden. Bei HDR mit 2 Bildern gilt nur Frm0/1TimeDot;<br>bei HDR mit 3 Bildern gilt Frm0/1/2TimeDot. FRM0~3 bezeichnet die<br>Bildreihenfolge von kurzer zu langer Belichtung. |
| Frm0/1/2GainDot | Sensorverstärkungsknoten. Bei HDR mit 2 Bildern gilt nur Frm0/1GainDot;<br>bei HDR mit 3 Bildern gilt Frm0/1/2GainDot. Die Verstärkung ist der tatsächliche Wert<br>in Einheiten von 1x. FRM0~3 bezeichnet die Reihenfolge von kurzer zu langer Belichtung. |
| Frm0/1/2IspDGainDot | Digitaler ISP-Verstärkungsknoten. Bei HDR mit 2 Bildern gilt nur Frm0/1IspDGainDot;<br>bei HDR mit 3 Bildern gilt Frm0/1/2IspDGainDot. Die Verstärkung ist der tatsächliche<br>Wert in Einheiten von 1x. FRM0~3 bezeichnet die Bildreihenfolge von<br>kurzer zu langer Belichtung. |
| PIrisDot | Knoten der blendenäquivalenten Verstärkung; der Verstärkungswert ist der tatsächliche<br>Wert in Einheiten von 1x. |

<!-- Source EN PDF p.100; unit 1101 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.100; unit 1102 -->

Die Anzahl der Knoten der Belichtungszerlegungskurve ist unbegrenzt. Mindestens 6 Knoten werden empfohlen, um eine gleichmäßige Belichtungszerlegung zu erzielen.

<!-- Source EN PDF p.100; unit 1103 -->

Bei HDR mit 2 Bildern müssen nur Frm0/1TimeDot, Frm0/1GainDot und Frm0/1IspDGainDot für das kurze bzw. lange Bild eingestellt werden. Bei HDR mit 3 Bildern sind Frm0/1/2TimeDot, Frm0/1/2GainDot und Frm0/1/2IspDGainDot für kurze, mittlere und lange Bilder einzustellen. Verteilen Sie die Sensorbelichtungszeiten im HDR-Modus sinnvoll: Die Summe aller Bildbelichtungszeiten \*\* darf die durch die Bildrate erlaubte maximale Belichtungszeit nicht überschreiten\*\*!

<!-- Source EN PDF p.100; unit 1104 -->

Die Belichtung eines Knotens ist das Produkt seiner Komponenten wie Belichtungszeit, Sensorverstärkung, digitaler ISP-Verstärkung und blendenäquivalenter Verstärkung. Sie muss monoton steigen, d. h. ein späterer Knoten muss stärker belichtet sein als der vorherige. Der erste Knoten hat die geringste und der zweite Knoten die größte Belichtung (so formuliert es die Quelle).

<!-- Source EN PDF p.100; unit 1105 -->

Die Belichtungszeitkomponente eines Knotens wird in Sekunden angegeben; als Minimum ist 0 erlaubt. Der tatsächliche minimale Belichtungszeitcode wird intern anhand der Sensorgrenze korrigiert.

<!-- Source EN PDF p.100; unit 1106 -->

Die Blendenkomponente unterstützt nur P-Iris, nicht DC-Iris. Die äquivalente P-Iris-Verstärkung gilt nur bei aktivierter automatischer Airis-Blendenfunktion; andernfalls bleibt die Blende standardmäßig auf ihrer Anfangsgröße fixiert. Die Berechnung der äquivalenten P-Iris-Verstärkung ist im Modul AecIrisCtrl beschrieben.

<!-- Source EN PDF p.100; unit 1107 -->

Die eingestellten Knoten des Belichtungszerlegungspfads bilden nicht den endgültigen Pfad. Die tatsächlichen maximalen/minimalen Werte jeder endgültigen Belichtungskomponente ergeben sich aus der Kombination der Zerlegungsknoten und der manuell konfigurierten Komponentenmaxima/-minima. Zunächst werden die Knotenmaxima/-minima korrigiert: Liegen sie innerhalb der SENSOR- oder ISP-Grenzen, bleiben sie unverändert; andernfalls gelten diese Grenzen. Sind die manuell konfigurierten Komponentenmaxima/-minima 0, gilt der Pfad nach dieser ersten Korrektur. Sind sie ungleich 0 und überschreiten die SENSOR- oder ISP-Grenzen nicht, erfolgt eine

<!-- Source EN PDF p.101; unit 1108 -->

zweite Korrektur, bei der die Knotenmaxima/-minima dem manuell eingestellten Bereich entsprechen. Überschreitet der eingestellte Komponentenbereich die Sensor- oder ISP-Grenzen, gelten die Ergebnisse der ersten Korrektur. Bei steigender Belichtung benachbarter Knoten sollte nur eine Komponente steigen und die übrigen konstant bleiben. Die steigende Komponente bestimmt die Verteilungsstrategie dieses Pfadsegments. Steigt beispielsweise die Verstärkung bei konstanten übrigen Komponenten, hat dieses Segment Verstärkungspriorität.

<!-- Source EN PDF p.101; unit 1109 -->

356X unterstützt derzeit keine digitale ISP-Verstärkung; Frm0/1/2ispDGainDot sind daher unwirksam.

<!-- Source EN PDF p.101; unit 1110 -->

#### 6.7.4  Uapi_LinExpAttrV2_t

<!-- Source EN PDF p.101; unit 1111 -->

【Beschreibung】

<!-- Source EN PDF p.101; unit 1112 -->

Abstimmparameter der linearen AE-Belichtung definieren.

<!-- Source EN PDF p.101; unit 1113 -->

【Definition】

<!-- Source EN PDF p.101; unit 1114 -->

```text
 typedef struct CalibDb_LinearAE_AttrV2_s {
     uint8_t RawStatsEn;
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t      StrategyMode;
     CalibDb_LinExpInitExpV2_t       InitExp;
     CalibDb_LinAeRoute_AttrV2_t     Route;
     CalibDb_AecDynamicSetpointV2_t  DySetpoint;
     CalibDb_AecBacklightV2_t        BackLightCtrl;
     CalibDb_AecOverExpCtrlV2_t OverExpCtrl;
 } CalibDb_LinearAE_AttrV2_t;
 typedef struct Uapi_LinExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinearAE_AttrV2_t     Params;
 } Uapi_LinExpAttrV2_t;
```

<!-- Source EN PDF p.101; unit 1115 -->

【Felder】

<!-- Source EN PDF p.102; unit 1116 -->

| Feldname | Beschreibung |
|---|---|
| RawStatsEn | Helligkeitsstatistik in der Raw-Domäne für lineare Belichtung aktivieren |
| EvBias | Prozentuale Abweichung der Belichtungsmenge bei automatischer<br>Belichtungsanpassung in %; Referenzwertebereich [-200, +200] |
| ToleranceIn/Out | Toleranz der Bildhelligkeit bei automatischer Belichtungsanpassung.<br>Einheit %, Wertebereich [0,100] |
| StrategyMode | Strategie der automatischen Belichtung: Lichter- oder Schwachlichtpriorität<br>[vorübergehend unwirksam] |
| DySetpoint | Dynamischer Helligkeitssollwert der automatischen Belichtungsanpassung,<br>der sich mit der Belichtungsmenge verändert |
| BackLightCtrl | Parameter der Gegenlichtkompensation |
| OverExpCtrl | Parameter der Spitzlichtunterdrückung |

<!-- Source EN PDF p.102; unit 1117 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.102; unit 1118 -->

EvBias dient in besonderen Szenarien zur Feinabstimmung der festen/dynamischen Helligkeitssollwerte (SetPoint/IRSetPoint). Der tatsächlich wirksame Helligkeitssollwert ist (SetPoint)\*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]. Bei EvBias=100 beträgt er das Doppelte des Standardparameters; bei EvBias=-100 die Hälfte.

<!-- Source EN PDF p.102; unit 1119 -->

Die AE-Bildhelligkeitstoleranz heißt Tolerance. Nach AE-Konvergenz sollte die Helligkeit B im Bereich [tatsächlich wirksamer Helligkeitssollwert X(1-Tolerance/100), tatsächlich wirksamer Helligkeitssollwert X(1+Tolerance/100)] liegen. Große ToleranceIn/Out-Werte beeinflussen sowohl die AE-Reaktionsgeschwindigkeit als auch die Wirkung von EvBias. Ist die Schrittweite der EvBias-Anpassung kleiner als ToleranceIn/Out, kann die Helligkeitsanpassung unwirksam bleiben.

<!-- Source EN PDF p.102; unit 1120 -->

StrategyMode ist derzeit unwirksam.

<!-- Source EN PDF p.102; unit 1121 -->

【Zugehörige Datentypen】

<!-- Source EN PDF p.102; unit 1122 -->

CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1123 -->

CalibDb_AecBacklightV2_t

<!-- Source EN PDF p.102; unit 1124 -->

CalibDb_AecOverExpCtrlV2_t

<!-- Source EN PDF p.102; unit 1125 -->

6.7.4.1  CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1126 -->

【Beschreibung】 Dynamische AE-Sollwerte definieren.

<!-- Source EN PDF p.102; unit 1127 -->

【Definition】

<!-- Source EN PDF p.102; unit 1128 -->

```text
 typedef struct CalibDb_AecDynamicSetpointV2_s {
     float* ExpLevel;
     int ExpLevel_len;
     float* DySetpoint;
     int DySetpoint_len;
 } CalibDb_AecDynamicSetpointV2_t;
```

<!-- Source EN PDF p.103; unit 1129 -->

【Felder】

<!-- Source EN PDF p.103; unit 1130 -->

| Feldname | Beschreibung |
|---|---|
| ExpLevel | Eigenschaft dynamischer Belichtungsknoten; der Knotenwert entspricht der aktuellen<br>Belichtung. Die Anzahl ist unbegrenzt. Mindestens 6 Knoten werden empfohlen;<br>die Quelle beschreibt dies widersprüchlich als Verhindern eines glatten Belichtungsübergangs. |
| DySetpoint | Eigenschaft dynamischer Helligkeitssollwertknoten. Der Wert verändert sich mit der<br>Belichtungsmenge; je größer der Belichtungsknotenwert, desto kleiner der Helligkeitssollwert.<br>Die Knoten entsprechen den Belichtungsknoten eins zu eins. Ihre Anzahl ist unbegrenzt,<br>muss aber der Anzahl der ExpLevel-Knoten entsprechen. Mindestens 6 Knoten werden<br>empfohlen; die Quelle schreibt widersprüchlich, dies verhindere einen glatten Übergang. |

<!-- Source EN PDF p.103; unit 1131 -->

#### 6.7.5  Uapi_HdrExpAttrV2_t

<!-- Source EN PDF p.103; unit 1132 -->

【Beschreibung】 Abstimmparameter der AE-HDR-Belichtung definieren.

<!-- Source EN PDF p.103; unit 1133 -->

【Definition】

<!-- Source EN PDF p.103; unit 1134 -->

```text
 typedef struct CalibDb_HdrAE_AttrV2_s {
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t StrategyMode;
     float LumaDistTh; //used for area-growing
     CalibDb_HdrExpInitExpV2_t InitExp;
     CalibDb_HdrAeRoute_AttrV2_t Route;
     CalibDb_ExpRatioCtrlV2_t ExpRatioCtrl;
     CalibDb_LongFrmCtrlV2_t LongFrmMode;
     CalibDb_LfrmCtrlV2_t LframeCtrl;
     CalibDb_MfrmCtrlV2_t MframeCtrl;
     CalibDb_SfrmCtrlV2_t SframeCtrl;
 } CalibDb_HdrAE_AttrV2_t;
 typedef struct Uapi_HdrExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAE_AttrV2_t        Params;
 } Uapi_HdrExpAttrV2_t;
```

<!-- Source EN PDF p.103; unit 1135 -->

【Felder】

<!-- Source EN PDF p.104; unit 1136 -->

| Feldname | Beschreibung |
|---|---|
| ToleranceIn/Out | Bildhelligkeitstoleranz bei automatischer Belichtungsanpassung. Einheit %, Wertebereich [0,100] |
| LongfrmMode | Parameter des Langbildmodus |
| StrategyMode | Strategie der automatischen Belichtung: Lichter- oder Schwachlichtpriorität<br>(AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR/AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR) |
| Evbias | Prozentuale Abweichung der Belichtungsmenge bei automatischer Belichtungsanpassung in %; Referenzwertebereich<br>[-200, +200] |
| ExpRatioCtrl | HdrAE-Belichtungsverhältnissteuerung; nur bei Mehrbildzusammenführung im HDR-Modus wirksam |
| LframeCtrl | Steuerparameter für lange Bilder |
| MframeCtrl | Steuerparameter für mittlere Bilder; nur bei HDR mit 3 Bildern wirksam |
| SframeCtrl | Steuerparameter für kurze Bilder |

<!-- Source EN PDF p.104; unit 1137 -->

【Zugehörige Datentypen】

<!-- Source EN PDF p.104; unit 1138 -->

CalibDb_LFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1139 -->

CalibDb_MFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1140 -->

CalibDb_SFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1141 -->

#### 6.7.6  Uapi_IrisAttrV2_t

<!-- Source EN PDF p.104; unit 1142 -->

【Beschreibung】

<!-- Source EN PDF p.104; unit 1143 -->

Blendensteuerparameter.

<!-- Source EN PDF p.104; unit 1144 -->

【Definition】

<!-- Source EN PDF p.104; unit 1145 -->

```text
 typedef struct CalibDb_AecIrisCtrlV2_s {
     uint8_t Enable;
     CalibDb_IrisTypeV2_t IrisType;
     RKAiqOPMode_t IrisOpType;
     CalibDb_MIris_AttrV2_t ManualAttr;
     CalibDb_PIris_AttrV2_t PIrisAttr;
     CalibDb_DCIris_AttrV2_t DCIrisAttr;
 } CalibDb_AecIrisCtrlV2_t;
 typedef struct Uapi_IrisAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_AecIrisCtrlV2_t       Params;
 } Uapi_IrisAttrV2_t;
```

<!-- Source EN PDF p.104; unit 1146 -->

【Felder】

<!-- Source EN PDF p.105; unit 1147 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Automatische Blendensteuerung aktivieren |
| IrisType | Blendentyp: P (P-Iris) oder DC (DC-Iris) |
| IrisOpType | Blendensteuerungsmodus: automatisch (RK_AIQ_OP_MODE_AUTO) oder<br>manuell (RK_AIQ_OP_MODE_MANUAL) |
| ManualAttr | Manuelle Blendenparameter |
| PIrisAttr | Eigenschaftsparameter der P-Blende |
| DCIrisAttr | Eigenschaftsparameter der DC-Blende |

<!-- Source EN PDF p.105; unit 1148 -->

6.7.6.1  CalibDb_MIris_AttrV2_t

<!-- Source EN PDF p.105; unit 1149 -->

【Beschreibung】

<!-- Source EN PDF p.105; unit 1150 -->

Manuelle Blendenparameter.

<!-- Source EN PDF p.105; unit 1151 -->

【Definition】

<!-- Source EN PDF p.105; unit 1152 -->

```text
 typedef struct CalibDb_MIris_AttrV2_s {
     int PIrisGainValue;
     int DCIrisHoldValue;
 } CalibDb_MIris_AttrV2_t;
```

<!-- Source EN PDF p.105; unit 1153 -->

【Felder】

<!-- Source EN PDF p.105; unit 1154 -->

| Feldname | Beschreibung |
|---|---|
| PIrisGainValue | Manueller blendenäquivalenter P-Verstärkungswert, begrenzt durch die P-Blende;<br>Wertebereich [1,1024] |
| DCIrisHoldValue | HoldValue der DC-Blende, abhängig vom DC-Blendengerät;<br>Wertebereich [0,100] |

<!-- Source EN PDF p.105; unit 1155 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.105; unit 1156 -->

IrisOpType = RK_AIQ_OP_MODE_MANUAL aktiviert die manuelle Blende. Bei P-Blende ist nur PirisGainValue wirksam; bei DC-Blende nur DCIrisHoldValue.

<!-- Source EN PDF p.105; unit 1157 -->

DCIrisHoldValue setzt im manuellen Modus direkt das PWM-Tastverhältnis des Motors, Wertebereich [0,100]. Liegt der eingestellte HoldValue im Bereich von ClosePwmDuty bis OpenPwmDuty in AecIrisCtrl, bleibt die DC-Blende auf ihrer aktuellen Größe. Ein Wert über OpenPwmDuty öffnet die Blende; je größer der Wert, desto schneller die Öffnung. Ein Wert unter ClosePwmDuty schließt die Blende; je kleiner der Wert, desto schneller das Schließen.

<!-- Source EN PDF p.106; unit 1158 -->

6.7.6.2  CalibDb_PIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1159 -->

【Beschreibung】

<!-- Source EN PDF p.106; unit 1160 -->

Eigenschaftsparameter der P-Blende.

<!-- Source EN PDF p.106; unit 1161 -->

【Definition】

<!-- Source EN PDF p.106; unit 1162 -->

```text
 #define AEC_PIRIS_STAP_TABLE_MAX (1024)
 typedef struct CalibDb_PIris_AttrV2_s {
     uint16_t              TotalStep;
     uint16_t              EffcStep;
     bool                  ZeroIsMax;
     uint16_t              StepTable[AEC_PIRIS_STAP_TABLE_MAX];
 } CalibDb_PIris_AttrV2_t;
```

<!-- Source EN PDF p.106; unit 1163 -->

【Felder】

<!-- Source EN PDF p.106; unit 1164 -->

| Feldname | Beschreibung |
|---|---|
| TotalStep | Gesamte Schrittzahl des P-Iris-Schrittmotors; hängt vom P-Iris-Objektiv ab. |
| EffcStep | Nutzbare Schrittzahl des P-Iris-Schrittmotors; hängt vom<br>P-Iris-Objektiv ab. |
| ZeroIsMax | Ob step0 des P-Iris-Schrittmotors der maximalen Blendenöffnung entspricht;<br>der Wert hängt vom P-Iris-Objektiv ab. Bei 0 entspricht<br>die Schrittmotorposition step0 der kleinsten Blende; bei 1<br>entspricht step0 der größten<br>Blende. |
| StepTable | Zuordnungstabelle der P-Iris-Schrittmotorposition zur blendenäquivalenten<br>Verstärkung; die Werte hängen vom P-Iris-Objektiv ab. |

<!-- Source EN PDF p.106; unit 1165 -->

6.7.6.3  CalibDb_DCIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1166 -->

【Beschreibung】

<!-- Source EN PDF p.106; unit 1167 -->

Eigenschaften der DC-Blende.

<!-- Source EN PDF p.106; unit 1168 -->

【Definition】

<!-- Source EN PDF p.106; unit 1169 -->

```text
 typedef struct CalibDb_DCIris_AttrV2_s {
     float       Kp;
     float       Ki;
     float       Kd;
     int         MinPwmDuty;
     int         MaxPwmDuty;
     int         OpenPwmDuty;
     int         ClosePwmDuty;
 } CalibDb_DCIris_AttrV2_t;
```

<!-- Source EN PDF p.107; unit 1170 -->

【Felder】

<!-- Source EN PDF p.107; unit 1171 -->

| Feldname | Beschreibung |
|---|---|
| Kp | Proportionalfaktor, der bei starken Änderungen die Öffnungs-/Schließgeschwindigkeit<br>der Blende begrenzt. Je größer der Wert, desto langsamer öffnet und schließt sie.<br>Ein zu großer Wert bewirkt ein vorzeitiges Abbremsen und damit zu lange<br>Regelzeiten; ein zu kleiner Wert bewirkt verspätetes Abbremsen<br>und stärkeres Überschwingen. Eine sinnvolle Einstellung hängt von<br>DC-Iris-Objektiv und Schaltung ab.<br>Empfohlener Wert 0.5; Wertebereich [0,1]. |
| Ki | Integrationskoeffizient zur Einstellung der Öffnungs-/Schließgeschwindigkeit.<br>Laut Quelle steigt diese mit größerer Blende. Ein zu großer Wert<br>verursacht leicht Überschwingen und Schwingungen; bei zu kleinem Wert<br>können durch langsame Blendenregelung und starke Änderungen der Umgebungshelligkeit<br>ebenfalls Schwingungen entstehen. Empfohlener Wert 0.2; Wertebereich [0,1]. |
| Kd | Differentialkoeffizient zur Einstellung der Öffnungs-/Schließgeschwindigkeit.<br>Je größer der Wert, desto schneller öffnet und schließt die Blende.<br>Empfohlener Wert 0.3; Wertebereich [0,1]. |
| MinPwmDuty | Minimales PWM-Tastverhältnis in %, abhängig von DC-Iris-Objektiv und<br>Schaltung. Je kleiner der Wert, desto schneller kann die Blende schließen,<br>allerdings steigt die Schwingungsneigung. Wertebereich [0,100], Standardwert<br>0. |
| MaxPwmDuty | Maximales PWM-Tastverhältnis in %, abhängig von DC-Iris-Objektiv und<br>Schaltung. Ein höherer Wert öffnet die Blende schneller. Ein zu kleiner<br>Wert kann die Blendensteuerung beenden, bevor die maximale Öffnung<br>erreicht wurde. Wertebereich [0,100], Standardwert 100. |
| OpenPwmDuty | PWM-Tastverhältnisschwelle zum Öffnen: Die Blende öffnet bei einem Tastverhältnis<br>streng größer als OpenPwmDuty. Der Wert hängt vom<br>DC-Iris-Objektiv ab und wird in % angegeben. |
| ClosePwmDuty | PWM-Tastverhältnisschwelle zum Schließen: Die Blende schließt bei einem Tastverhältnis<br>streng kleiner als ClosePwmDuty. Der Wert hängt vom DC-<br>Iris-Objektiv ab und wird in % angegeben. |

<!-- Source EN PDF p.107; unit 1172 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.107; unit 1173 -->

Wenn die automatische Blendenfunktion deaktiviert ist, wird eine DC-Iris-Blende standardmäßig vollständig geöffnet. Bei P-Iris wird standardmäßig die Schrittmotorposition für maximale Öffnung angefahren. Zur Änderung dieser Positionen können InitPIrisGainValue und InitDCIrisDutyValue im Modul AecInitValue angepasst werden.

<!-- Source EN PDF p.107; unit 1174 -->

Der grundlegende Steuerablauf des automatischen Blendenalgorithmus Airis lautet:

<!-- Source EN PDF p.107; unit 1175 -->

Bei DC-Iris-Objektiven steuert Airis die Blendenöffnung anhand der Abweichung zwischen aktueller Helligkeit und Helligkeitssollwert. Wenn die Belichtung ihr Minimum erreicht und die aktuelle Helligkeit den Sollwerttoleranzbereich überschreitet, wird die AE-Regelung verlassen. Belichtungszeit und Verstärkung werden fixiert und AIRIS übernimmt die Regelung. Ist die aktuelle Bildhelligkeit stabil und das PWM-Tastverhältnis

<!-- Source EN PDF p.108; unit 1176 -->

der DC-Iris größer als OpenPwmDuty, wird die maximale Blendenöffnung als erreicht betrachtet. Airis beendet die Blendenregelung und übergibt die Steuerung an AE.

<!-- Source EN PDF p.108; unit 1177 -->

Bei P-Iris-Objektiven erfolgt die Blendensteuerung über AecRoute. Die Blendenöffnung wird in eine äquivalente Verstärkung umgerechnet und in die Berechnung der Belichtungszerlegung einbezogen.

<!-- Source EN PDF p.108; unit 1178 -->

Die Zuordnungstabelle StepTable zwischen P-Iris-Schrittmotorposition und blendenäquivalenter Verstärkung wird gewöhnlich aus der vom Objektivhersteller gelieferten Zuordnung zwischen Motorposition und Blendenöffnung erstellt. Da das AE-Modul AecRoute die Öffnung in äquivalente Verstärkung umrechnet, muss die P-Iris-Steuerung gut linear sein. Die äquivalente Verstärkung liegt im Bereich [1,1024]: F1.0 entspricht 1024, F1.4 entspricht 512 und entsprechend fortgesetzt F32.0 dem Wert 1. Rechnen Sie zur Tabellenerstellung die Öffnung jeder Motorposition in äquivalente Verstärkung um und tragen Sie sie in StepTable in aufsteigender Reihenfolge der Motorpositionen ein (step0, step1... stepN).

<!-- Source EN PDF p.108; unit 1179 -->

TotalStep bezeichnet die gesamte Schrittzahl des P-Iris-Schrittmotors und hängt vom Objektiv ab. EffcStep bezeichnet die nutzbare Schrittzahl und ist gewöhnlich kleiner als TotalStep. Nahe der vollständig geschlossenen Position ist der Fehler der entsprechenden äquivalenten Verstärkung groß und bei der Blendenregelung können leicht Schwingungen entstehen. Daher werden solche Positionen gewöhnlich nicht verwendet.

<!-- Source EN PDF p.108; unit 1180 -->

Tabelle 4-1 ordnet P-Iris-Schrittmotorposition, Blendenfläche und äquivalente Verstärkung einander zu und dient als Beispiel für StepTable. Die Zuordnung zwischen Motorschritt und Fläche in Spalten 1–2 und 4–5 stammt von einem Objektivhersteller. Das Objektiv hat insgesamt 81 Motorschritte; step0 entspricht der größten Öffnung mit einer nominalen maximalen Blende von 1.4. Diese entspricht einer äquivalenten Verstärkung von 512, somit beträgt sie bei Schritt 0 ebenfalls 512. Beispiel Schritt 3: Die Fläche beträgt 195.869; daraus ergibt sich die äquivalente Verstärkung = 512\* (195.869/201.062)=499(gerundet). Entsprechend lassen sich die Werte anderer Motorpositionen berechnen. Aus Tabelle 1-1 (Verweis der Quelle) ist ersichtlich, dass nahe der geschlossenen Position die Fläche sehr klein ist und gegenüber der größten Fläche um Tausende Faktoren abweichen kann. Der Fehler der äquivalenten Verstärkung ist dann groß. Solche Positionen sollten zur Vermeidung fehlerbedingter Belichtungsschwingungen nicht verwendet werden. Die äquivalente Verstärkung jeder Motorposition wird in aufsteigender Reihenfolge der Positionen (step0, step1... stepN) in StepTable eingetragen.

<!-- Source EN PDF p.108; unit 1181 -->

OpenPwmDuty und ClosePwmDuty der DC-Iris müssen gemessen werden und hängen vom Objektiv ab. Bei einigen Objektiven öffnet die Blende, wenn das PWM-Tastverhältnis über OpenPwmDuty liegt; liegt es darunter, schließt sie (die Quelle nennt hier ebenfalls OpenPwmDuty). Im Bereich größer oder gleich ClosePwmDuty und kleiner oder gleich OpenPwmDuty bleibt sie stabil; die Werte dieses Bereichs heißen HoldValue. Andere Objektive besitzen nur eine Öffnungs-/Schließschwelle: Oberhalb öffnet die Blende, unterhalb schließt sie und genau auf der Schwelle bleibt sie stabil. Dieser Wert ist HoldValue; in diesem Fall kann ClosePwmDuty = OpenPwmDuty = HoldValue gesetzt werden.

<!-- Source EN PDF p.108; unit 1182 -->

Die manuelle Blendenparametereinstellung entspricht dem manuellen Belichtungsmodus. Setzen Sie für manuelle Blendensteuerung AecOpType auf manuellen Modus und aktivieren Sie ManualIrisEn in AecManualCtrl. Wenn IrisType P-iris ist, gilt nur PirisGainValue; wenn IrisType P-iris ist, gilt nur DCIrisValue. Die Quelle nennt in beiden Fällen P-iris; dieser Widerspruch bleibt erhalten.

<!-- Source EN PDF p.109; unit 1183 -->

Tabelle 4-1 Zuordnung von P-Iris-Schrittmotorposition, Blendenfläche und äquivalenter Verstärkung

<!-- Source EN PDF p.110; unit 1184 -->

| Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung | Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung |
|---|---|---|---|---|---|
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- Source EN PDF p.111; unit 1185 -->

| Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung | Schritt | Blendenfläche<br>(mm2) | Äquivalente<br>Verstärkung |
|---|---|---|---|---|---|
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | geschlossen | 0 |
| 32 | 87.777 | 224 | 73 | geschlossen | 0 |
| 33 | 84.156 | 214 | 74 | geschlossen | 0 |
| 34 | 80.569 | 205 | 75 | geschlossen | 0 |
| 35 | 77.02 | 196 | 76 | geschlossen | 0 |
| 36 | 73.51 | 187 | 77 | geschlossen | 0 |
| 37 | 70.043 | 178 | 78 | geschlossen | 0 |
| 38 | 66.621 | 170 | 79 | geschlossen | 0 |
| 39 | 63.247 | 161 | 80 | geschlossen | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- Source EN PDF p.111; unit 1186 -->

#### 6.7.7  Uapi_ExpWin_t

<!-- Source EN PDF p.111; unit 1187 -->

【Beschreibung】 Eigenschaftsparameter des AE-Statistikfensters definieren.

<!-- Source EN PDF p.111; unit 1188 -->

【Definition】

<!-- Source EN PDF p.111; unit 1189 -->

```text
 typedef struct window {
     uint16_t h_offs;
     uint16_t v_offs;
     uint16_t h_size;
     uint16_t v_size;
 } window_t;
 typedef struct Uapi_ExpWin_s {
   rk_aiq_uapi_sync_t            sync;
   window                        Params;
 } Uapi_ExpWin_t;
```

<!-- Source EN PDF p.111; unit 1190 -->

【Felder】

<!-- Source EN PDF p.112; unit 1191 -->

| Feldname | Beschreibung |
|---|---|
| h_offs | Horizontaler Versatz der linken oberen Fensterecke gegenüber dem Koordinatenursprung;<br>dieser liegt in der linken oberen Ecke des lichtempfindlichen<br>Sensorbereichs. |
| v_offs | Vertikaler Versatz der linken oberen Fensterecke gegenüber dem Koordinatenursprung;<br>dieser liegt in der linken oberen Ecke des lichtempfindlichen<br>Sensorbereichs. |
| h_size | Horizontale Fenstergröße |
| v_size | Vertikale Fenstergröße |

<!-- Source EN PDF p.112; unit 1192 -->

#### 6.7.8  Uapi_ExpQueryInfo_t

<!-- Source EN PDF p.112; unit 1193 -->

【Beschreibung】 AE-Belichtungsparameterabfragen definieren.

<!-- Source EN PDF p.112; unit 1194 -->

【Definition】

<!-- Source EN PDF p.112; unit 1195 -->

```text
 typedef struct Uapi_ExpQueryInfo_s {
     bool              IsConverged;
     bool              IsExpMax;
     float             LumaDeviation;
     float             HdrLumaDeviation[3];
     float             MeanLuma;
     float             HdrMeanLuma[3];
     float             GlobalEnvLux;
     float             BlockEnvLux[ISP2_RAWAE_WINNUM_MAX];
     RKAiqAecExpInfo_t CurExpInfo;
     unsigned short    Piris;
     float             LinePeriodsPerField;
     float             PixelPeriodsPerLine;
     float             PixelClockFreqMHZ;
 } Uapi_ExpQueryInfo_t;
```

<!-- Source EN PDF p.112; unit 1196 -->

【Felder】

<!-- Source EN PDF p.113; unit 1197 -->

| Feldname | Beschreibung |
|---|---|
| IsConverged | Ob die automatische Belichtung konvergiert ist |
| IsExpMax | Ob die ISP-Belichtung ihr Maximum erreicht hat |
| LumaDeviation | Im linearen Modus die Abweichung zwischen AEC-Sollwert und tatsächlicher<br>Bildhelligkeit. Ein positiver Wert bedeutet tatsächliche Helligkeit<br>über dem Sollwert, ein negativer Wert Helligkeit unter dem Sollwert.<br>Bei 0 liegt die tatsächliche Helligkeit<br>innerhalb des Toleranzbereichs<br>des Sollwerts. |
| HdrLumaDeviation | Im HDR-Modus die Abweichung zwischen Soll- und tatsächlicher Helligkeit<br>jedes Bildes. Ein positiver Wert bedeutet tatsächliche Helligkeit über dem Sollwert,<br>ein negativer Wert Helligkeit unter dem Sollwert. Bei 0 liegt die tatsächliche<br>Helligkeit innerhalb des Sollwerttoleranzbereichs.<br>Bei 2 Bildern gelten nur 0 und 1 für kurze bzw. lange Bilder;<br>bei 3 Bildern gelten 0–2 für kurze, mittlere<br>und lange Bilder. |
| MeanLuma | Im linearen Modus die mittlere Helligkeit des aktuellen Bildes |
| HdrMeanLuma | Im HDR-Modus die mittlere Helligkeit jedes aktuellen Teilbildes.<br>Bei 2 Bildern gelten nur Arrayelemente 0 und 1 für kurze bzw.<br>lange Bilder. Bei 3 Bildern gelten alle Arrayelemente<br>für kurze, mittlere bzw. lange Bilder. |
| CurExpInfo | Aktuelle Belichtungsparameter einschließlich Sensorbelichtungszeit und<br>Sensorverstärkungswert. Je nach Belichtungsmodus in zwei Sätze<br>gegliedert: LinearExp und HdrExp[3]. |
| Piris | Blende |
| LinePeriodsPerField | Sensor-VTS |
| PixelPeriodsPerLine | Sensor-HTS |
| PixelClockFreqMHZ | Pixeltaktfrequenz des Sensors in Megahertz |

<!-- Source EN PDF p.114; unit 1198 -->

### 6.8   Häufige Probleme und Debugging-Methoden

<!-- Source EN PDF p.114; unit 1199 -->

Bei Bildhelligkeitsflimmern, Überschwingen oder unerwarteter Helligkeit empfiehlt es sich, das AE-LOG der problematischen Szene zur Analyse zu erfassen. Dies hilft, die Ursache schneller zu finden und effizienter zu arbeiten.

<!-- Source EN PDF p.114; unit 1200 -->

#### 6.8.1  Synchroner Test von Belichtung und Statistik

<!-- Source EN PDF p.114; unit 1201 -->

Vor der Kalibrierung des ISP-Moduls müssen Treiber- oder Abstimmverantwortliche den Parameter SensorInfo in der IQ-XML-Abstimmdatei ausfüllen. Dieses Modul betrifft Belichtungsparametereinstellungen; falsche Werte können Belichtungsfehler, Flimmern usw. verursachen. Nach der Konfiguration von sensorinfo sollte SyncTest für einen Selbsttest aktiviert werden. Die Bedeutung der SensorInfo-Parameter beschreibt Rockchip_Tuning_Guide_ISP30.

<!-- Source EN PDF p.114; unit 1202 -->

SyncTest stellt zyklisch N Gruppen unterschiedlicher Belichtungswerte ein, um zu prüfen, ob Sensorbelichtungszeit, Sensorverstärkung und die Bildanzahl bis zum Wirksamwerden einer DCG-Umschaltung korrekt sind. Außerdem kann damit die Belichtungslinearität getestet werden, um Umrechnungsformeln und zugehörige Parameter zwischen Registerwerten und Belichtungszeit/-verstärkung zu bestätigen.

<!-- Source EN PDF p.114; unit 1203 -->

Die SyncTest-Funktionsparameter werden nachfolgend beschrieben:

<!-- Source EN PDF p.114; unit 1204 -->

【Beschreibung】

<!-- Source EN PDF p.114; unit 1205 -->

Der synchrone Test von Belichtung und Statistik stellt zyklisch N Gruppen unterschiedlicher Belichtungswerte mit einem vorgegebenen Bildintervall ein. Damit wird geprüft und abgestimmt, ob die Bildanzahl bis zum Wirksamwerden von Belichtungskomponenten (Zeit und Verstärkung) sowie die Sensorbelichtungsparametereinstellungen korrekt sind.

<!-- Source EN PDF p.114; unit 1206 -->

【Felder】

<!-- Source EN PDF p.114; unit 1207 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Gleichzeitigen Test von Belichtung und Statistik aktivieren |
| IntervalFrm | Bildanzahl zwischen Belichtungsumschaltungen |
| AlterExp | Parameter der Belichtungsumschaltung |

<!-- Source EN PDF p.114; unit 1208 -->

AlterExp

<!-- Source EN PDF p.114; unit 1209 -->

Je nach Modus werden zwei Parametersätze unterschieden: LinearAE und HdrAE.

<!-- Source EN PDF p.115; unit 1210 -->

| Feldname | Beschreibung |
|---|---|
| TimeValue | Belichtungszeitwert |
| GainValue | Belichtungsverstärkungswert |
| IspDgainValue | Digitaler ISP-Verstärkungswert |
| DcgMode | DCG-Moduswert |
| PIrisGainValue | Äquivalente P-Iris-Verstärkung |

<!-- Source EN PDF p.115; unit 1211 -->

Bei korrekten Parametern ergibt sich beispielsweise folgendes LOG; es zeigt nur die Schlüsselinformationen. Die rote Umrahmung markiert die Belichtungsumschaltung. Die sichtbare Helligkeit ändert sich nicht und passt zum Belichtungswert; es gibt keine verzögerte oder vorgezogene Linearitätsabweichung. Damit lässt sich grundsätzlich von korrekt gesetzten sensorinfo-Parametern ausgehen.

<!-- Source EN PDF p.115; unit 1212 -->

![Technische Originalabbildung — PDF S. 115](/docs/rockchip-isp30-development/assets/en-p115-X1039.png)

<!-- Source EN PDF p.115; unit 1213 -->

#### 6.8.2  Flimmern bei Belichtungsänderungen

<!-- Source EN PDF p.115; unit 1214 -->

Flimmern bei Belichtungsänderungen kann mehrere Ursachen haben:

<!-- Source EN PDF p.115; unit 1215 -->

(1) Falsche Bildanzahl bis zum Wirksamwerden von gain und time im Modul CISExpUpdate. Typische LOG-Beispiele folgen; pro Bild werden nur die Schlüsselzeilen gezeigt:

<!-- Source EN PDF p.115; unit 1216 -->

![Technische Originalabbildung — PDF S. 115](/docs/rockchip-isp30-development/assets/en-p115-X1040.png)

<!-- Source EN PDF p.115; unit 1217 -->

Die rote Umrahmung markiert die Helligkeitsfehler. Bei steigender oder fallender Belichtung entwickelt sich die entsprechende Helligkeit entgegengesetzt. Der abrupte Helligkeitswechsel tritt im zweiten Bild nach einer Änderung sowohl der Belichtungszeit als auch der Verstärkung auf. Die Helligkeitsentwicklung folgt der Belichtungszeit. Daraus lässt sich schließen, dass die Bildanzahl bis zum Wirksamwerden von gain und time falsch ist: Zeit und Verstärkung werden nicht gleichzeitig wirksam, sodass Helligkeit und Belichtung nicht zusammenpassen. Ändern Sie zur Behebung die entsprechenden Bildanzahlen. Das Problem lässt sich mit AE

<!-- Source EN PDF p.116; unit 1218 -->

syncTest nachstellen: Zwei Belichtungssätze mit unterschiedlicher Zeit und Verstärkung abwechselnd schalten und anhand des LOG prüfen, ob das Problem auftritt.

<!-- Source EN PDF p.116; unit 1219 -->

(2) Treiberfehler verursachen nicht konvergierende Helligkeitsschwingungen, häufig bei hellen Szenen. Typische LOG-Beispiele folgen; gezeigt werden nur die Schlüsselzeilen jedes Bildes.

<!-- Source EN PDF p.116; unit 1220 -->

![Technische Originalabbildung — PDF S. 116](/docs/rockchip-isp30-development/assets/en-p116-X1044.png)

<!-- Source EN PDF p.116; unit 1221 -->

Wie die Abbildung zeigt, schwankt die Belichtung zwischen 59ms und 44ms. Das Verhältnis der zugehörigen mittleren Helligkeiten weicht stark vom Verhältnis der Belichtungszeiten ab; es besteht ein Linearitätsproblem. Prüfen Sie zuerst den Sensortreiber und geben Sie den Belichtungsregisterwert aus, um seine Übereinstimmung mit der protokollierten Belichtung zu prüfen. Das Problem lässt sich mit AE syncTest nachstellen: Mehrere Belichtungssätze einschließlich des problematischen abwechselnd schalten und im LOG prüfen, ob die Helligkeitsänderung jedes Bildes linear zur Belichtung verläuft.

<!-- Source EN PDF p.116; unit 1222 -->

![Technische Originalabbildung — PDF S. 116](/docs/rockchip-isp30-development/assets/en-p116-X1045.png)

<!-- Source EN PDF p.116; unit 1223 -->

(3) Flimmern durch nachgelagerte AE-Module. Typische LOG-Beispiele folgen; gezeigt werden nur die Schlüsselzeilen jedes Bildes:

<!-- Source EN PDF p.116; unit 1224 -->

![Technische Originalabbildung — PDF S. 116](/docs/rockchip-isp30-development/assets/en-p116-X1046.png)

<!-- Source EN PDF p.117; unit 1225 -->

Im LOG ist zu erkennen, dass während des Rückgangs von SMeanLuma und MMeanLuma links die Ausgangshelligkeit des TmoMeanluma-Moduls schwankt. In diesem Fall muss das TMO-Modul abgestimmt werden.

<!-- Source EN PDF p.118; unit 1226 -->

## 7.   AWB

<!-- Source EN PDF p.118; unit 1227 -->

### 7.1   Überblick

<!-- Source EN PDF p.118; unit 1228 -->

Das AWB-Modul verändert die Farbkanalverstärkung des Aufnahmegeräts, um Farbabweichungen durch die Farbtemperatur der Umgebung sowie Abweichungen der geräteeigenen Farbkanalverstärkung gemeinsam auszugleichen. Dadurch soll das aufgenommene Bild die tatsächlichen Farben des Objekts korrekt wiedergeben.

<!-- Source EN PDF p.118; unit 1229 -->

### 7.2   Wichtige Begriffe

<!-- Source EN PDF p.118; unit 1230 -->

Farbtemperatur: Sie wird anhand eines idealen schwarzen Körpers definiert. Stimmt die Strahlung einer Lichtquelle im sichtbaren Bereich genau mit der eines idealen schwarzen Körpers überein, heißt dessen Temperatur Farbtemperatur der Lichtquelle.

<!-- Source EN PDF p.118; unit 1231 -->

Weißabgleich: Bei Lichtquellen unterschiedlicher Farbtemperatur kann die Sensorantwort auf Weiß bläulich oder rötlich ausfallen. Der Weißabgleichsalgorithmus passt die Intensitäten der drei Farbkanäle R, G und B so an, dass Weiß naturgetreu erscheint.

<!-- Source EN PDF p.118; unit 1232 -->

### 7.3   Funktionsbeschreibung

<!-- Source EN PDF p.118; unit 1233 -->

Das AWB-Modul besteht aus zwei Teilen: WB-Informationsstatistik und AWB-Steuerstrategiealgorithmus.

<!-- Source EN PDF p.118; unit 1234 -->

### 7.4   Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.118; unit 1235 -->

#### 7.4.1  rk_aiq_uapi2_setWBMode

<!-- Source EN PDF p.118; unit 1236 -->

【Beschreibung】 Betriebsart des Weißabgleichs einstellen.

<!-- Source EN PDF p.118; unit 1237 -->

【Syntax】

<!-- Source EN PDF p.118; unit 1238 -->

```text
 XCamReturn rk_aiq_uapi2_setWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.118; unit 1239 -->

【Parameter】

<!-- Source EN PDF p.118; unit 1240 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Weißabgleichsbetriebsart | Eingabe |

<!-- Source EN PDF p.118; unit 1241 -->

【Rückgabewert】

<!-- Source EN PDF p.119; unit 1242 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.119; unit 1243 -->

【Hinweis】

<!-- Source EN PDF p.119; unit 1244 -->

Im manuellen Modus wird der Weißabgleichsverstärkungswert durch den aktuellen manuellen Weißabgleichsparameter bestimmt. Um gleichzeitig in den manuellen Modus zu wechseln und einen bestimmten Verstärkungswert einzustellen, kann rk_aiq_uapi2_setMWBGain verwendet werden.

<!-- Source EN PDF p.119; unit 1245 -->

【Voraussetzungen】

<!-- Source EN PDF p.119; unit 1246 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1247 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.119; unit 1248 -->

【Beispiel】

<!-- Source EN PDF p.119; unit 1249 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.119; unit 1250 -->

#### 7.4.2  rk_aiq_uapi2_getWBMode

<!-- Source EN PDF p.119; unit 1251 -->

【Beschreibung】 Betriebsart des Weißabgleichs abrufen.

<!-- Source EN PDF p.119; unit 1252 -->

【Syntax】

<!-- Source EN PDF p.119; unit 1253 -->

```text
 XCamReturn rk_aiq_uapi2_getWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.119; unit 1254 -->

【Parameter】

<!-- Source EN PDF p.119; unit 1255 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Weißabgleichsbetriebsart | Ausgabe |

<!-- Source EN PDF p.119; unit 1256 -->

【Rückgabewert】

<!-- Source EN PDF p.119; unit 1257 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.119; unit 1258 -->

【Voraussetzungen】

<!-- Source EN PDF p.119; unit 1259 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1260 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.119; unit 1261 -->

【Beispiel】

<!-- Source EN PDF p.119; unit 1262 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.120; unit 1263 -->

#### 7.4.3  rk_aiq_uapi2_lockAWB

<!-- Source EN PDF p.120; unit 1264 -->

【Beschreibung】 Aktuelle Weißabgleichsparameter sperren.

<!-- Source EN PDF p.120; unit 1265 -->

【Syntax】

<!-- Source EN PDF p.120; unit 1266 -->

```text
 XCamReturn rk_aiq_uapi2_lockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1267 -->

【Parameter】

<!-- Source EN PDF p.120; unit 1268 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.120; unit 1269 -->

【Rückgabewert】

<!-- Source EN PDF p.120; unit 1270 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.120; unit 1271 -->

【Voraussetzungen】

<!-- Source EN PDF p.120; unit 1272 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.120; unit 1273 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.120; unit 1274 -->

【Beispiel】

<!-- Source EN PDF p.120; unit 1275 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.120; unit 1276 -->

#### 7.4.4  rk_aiq_uapi2_unlockAWB

<!-- Source EN PDF p.120; unit 1277 -->

【Beschreibung】 Gesperrte Weißabgleichsparameter wieder freigeben.

<!-- Source EN PDF p.120; unit 1278 -->

【Syntax】

<!-- Source EN PDF p.120; unit 1279 -->

```text
 XCamReturn rk_aiq_uapi2_unlockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1280 -->

【Parameter】

<!-- Source EN PDF p.120; unit 1281 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.120; unit 1282 -->

【Rückgabewert】

<!-- Source EN PDF p.121; unit 1283 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.121; unit 1284 -->

【Voraussetzungen】

<!-- Source EN PDF p.121; unit 1285 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1286 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.121; unit 1287 -->

【Beispiel】

<!-- Source EN PDF p.121; unit 1288 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.121; unit 1289 -->

#### 7.4.5  rk_aiq_uapi2_setMWBScene

<!-- Source EN PDF p.121; unit 1290 -->

【Beschreibung】 Weißabgleichsszene einstellen.

<!-- Source EN PDF p.121; unit 1291 -->

【Syntax】

<!-- Source EN PDF p.121; unit 1292 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t scene);
```

<!-- Source EN PDF p.121; unit 1293 -->

【Parameter】

<!-- Source EN PDF p.121; unit 1294 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| scene | Weißabgleichsszene | Eingabe |

<!-- Source EN PDF p.121; unit 1295 -->

【Rückgabewert】

<!-- Source EN PDF p.121; unit 1296 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.121; unit 1297 -->

【Voraussetzungen】

<!-- Source EN PDF p.121; unit 1298 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1299 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.121; unit 1300 -->

【Beispiel】

<!-- Source EN PDF p.121; unit 1301 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.122; unit 1302 -->

#### 7.4.6  rk_aiq_uapi2_getMWBScene

<!-- Source EN PDF p.122; unit 1303 -->

【Beschreibung】 Weißabgleichsszene abrufen.

<!-- Source EN PDF p.122; unit 1304 -->

【Syntax】

<!-- Source EN PDF p.122; unit 1305 -->

```text
 XCamReturn rk_aiq_uapi2_getMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t *scene);
```

<!-- Source EN PDF p.122; unit 1306 -->

【Parameter】

<!-- Source EN PDF p.122; unit 1307 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| scene | Weißabgleichsszene | Ausgabe |

<!-- Source EN PDF p.122; unit 1308 -->

【Rückgabewert】

<!-- Source EN PDF p.122; unit 1309 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.122; unit 1310 -->

【Voraussetzungen】

<!-- Source EN PDF p.122; unit 1311 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.122; unit 1312 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.122; unit 1313 -->

【Beispiel】

<!-- Source EN PDF p.122; unit 1314 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.122; unit 1315 -->

#### 7.4.7  rk_aiq_uapi2_setMWBGain

<!-- Source EN PDF p.122; unit 1316 -->

【Beschreibung】 Manuellen Weißabgleichsverstärkungsfaktor einstellen.

<!-- Source EN PDF p.122; unit 1317 -->

【Syntax】

<!-- Source EN PDF p.122; unit 1318 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.122; unit 1319 -->

【Parameter】

<!-- Source EN PDF p.122; unit 1320 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| gain | Weißabgleichsverstärkungsfaktor | Eingabe |

<!-- Source EN PDF p.123; unit 1321 -->

【Rückgabewert】

<!-- Source EN PDF p.123; unit 1322 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.123; unit 1323 -->

【Voraussetzungen】

<!-- Source EN PDF p.123; unit 1324 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1325 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.123; unit 1326 -->

【Beispiel】

<!-- Source EN PDF p.123; unit 1327 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.123; unit 1328 -->

#### 7.4.8  rk_aiq_uapi2_getWBGain

<!-- Source EN PDF p.123; unit 1329 -->

【Beschreibung】 Weißabgleichsverstärkungsfaktor abrufen. Diese Funktion gilt sowohl für manuellen als auch automatischen Weißabgleich.

<!-- Source EN PDF p.123; unit 1330 -->

【Syntax】

<!-- Source EN PDF p.123; unit 1331 -->

```text
 XCamReturn rk_aiq_uapi2_getWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.123; unit 1332 -->

【Parameter】

<!-- Source EN PDF p.123; unit 1333 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| gain | Weißabgleichsverstärkungsfaktor | Ausgabe |

<!-- Source EN PDF p.123; unit 1334 -->

【Rückgabewert】

<!-- Source EN PDF p.123; unit 1335 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.123; unit 1336 -->

【Voraussetzungen】

<!-- Source EN PDF p.123; unit 1337 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1338 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.123; unit 1339 -->

【Beispiel】

<!-- Source EN PDF p.123; unit 1340 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.124; unit 1341 -->

#### 7.4.9  rk_aiq_uapi2_setMWBCT

<!-- Source EN PDF p.124; unit 1342 -->

【Beschreibung】 Farbtemperaturparameter des manuellen Weißabgleichs einstellen.

<!-- Source EN PDF p.124; unit 1343 -->

【Syntax】

<!-- Source EN PDF p.124; unit 1344 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int ct);
```

<!-- Source EN PDF p.124; unit 1345 -->

【Parameter】

<!-- Source EN PDF p.124; unit 1346 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| ct | Farbtemperaturparameter des Weißabgleichs | Eingabe |

<!-- Source EN PDF p.124; unit 1347 -->

【Rückgabewert】

<!-- Source EN PDF p.124; unit 1348 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.124; unit 1349 -->

【Voraussetzungen】

<!-- Source EN PDF p.124; unit 1350 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.124; unit 1351 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.124; unit 1352 -->

【Beispiel】

<!-- Source EN PDF p.124; unit 1353 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.124; unit 1354 -->

#### 7.4.10  rk_aiq_uapi2_getWBCT

<!-- Source EN PDF p.124; unit 1355 -->

【Beschreibung】 Farbtemperatur des Weißabgleichs abrufen. Diese Funktion gilt für automatischen und manuellen Betrieb.

<!-- Source EN PDF p.124; unit 1356 -->

【Syntax】

<!-- Source EN PDF p.124; unit 1357 -->

```text
 XCamReturn rk_aiq_uapi2_getWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int *ct);
```

<!-- Source EN PDF p.124; unit 1358 -->

【Parameter】

<!-- Source EN PDF p.124; unit 1359 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| ct | Farbtemperatur des Weißabgleichs | Ausgabe |

<!-- Source EN PDF p.124; unit 1360 -->

【Rückgabewert】

<!-- Source EN PDF p.125; unit 1361 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.125; unit 1362 -->

【Voraussetzungen】

<!-- Source EN PDF p.125; unit 1363 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1364 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.125; unit 1365 -->

【Beispiel】

<!-- Source EN PDF p.125; unit 1366 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.125; unit 1367 -->

#### 7.4.11  rk_aiq_uapi2_setAwbGainOffsetAttrib

<!-- Source EN PDF p.125; unit 1368 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung einstellen.

<!-- Source EN PDF p.125; unit 1369 -->

【Syntax】

<!-- Source EN PDF p.125; unit 1370 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.125; unit 1371 -->

【Parameter】

<!-- Source EN PDF p.125; unit 1372 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | wbgain-Offsetparameter | Eingabe |

<!-- Source EN PDF p.125; unit 1373 -->

【Rückgabewert】

<!-- Source EN PDF p.125; unit 1374 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.125; unit 1375 -->

【Voraussetzungen】

<!-- Source EN PDF p.125; unit 1376 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1377 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.125; unit 1378 -->

【Beispiel】

<!-- Source EN PDF p.125; unit 1379 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.126; unit 1380 -->

#### 7.4.12  rk_aiq_uapi2_getAwbGainOffsetAttrib

<!-- Source EN PDF p.126; unit 1381 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung abrufen.

<!-- Source EN PDF p.126; unit 1382 -->

【Syntax】

<!-- Source EN PDF p.126; unit 1383 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 CalibDbV2_Awb_gain_offset_cfg_t *attr);
```

<!-- Source EN PDF p.126; unit 1384 -->

【Parameter】

<!-- Source EN PDF p.126; unit 1385 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | wbgain-Offsetparameter | Ausgabe |

<!-- Source EN PDF p.126; unit 1386 -->

【Rückgabewert】

<!-- Source EN PDF p.126; unit 1387 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.126; unit 1388 -->

【Voraussetzungen】

<!-- Source EN PDF p.126; unit 1389 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.126; unit 1390 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.126; unit 1391 -->

【Beispiel】

<!-- Source EN PDF p.126; unit 1392 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.126; unit 1393 -->

#### 7.4.13  rk_aiq_uapi2_setAwbGainAdjustAttrib

<!-- Source EN PDF p.126; unit 1394 -->

【Beschreibung】 Farbtonanpassungsparameter im automatischen Weißabgleichsmodus einstellen.

<!-- Source EN PDF p.126; unit 1395 -->

【Syntax】

<!-- Source EN PDF p.126; unit 1396 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.126; unit 1397 -->

【Parameter】

<!-- Source EN PDF p.126; unit 1398 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter des Weißabgleichs | Eingabe |

<!-- Source EN PDF p.127; unit 1399 -->

【Rückgabewert】

<!-- Source EN PDF p.127; unit 1400 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.127; unit 1401 -->

【Voraussetzungen】

<!-- Source EN PDF p.127; unit 1402 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1403 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.127; unit 1404 -->

【Beispiel】

<!-- Source EN PDF p.127; unit 1405 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.127; unit 1406 -->

#### 7.4.14  rk_aiq_uapi2_getAwbGainAdjustAttrib

<!-- Source EN PDF p.127; unit 1407 -->

【Beschreibung】 Farbtonanpassungsparameter im automatischen Weißabgleichsmodus abrufen.

<!-- Source EN PDF p.127; unit 1408 -->

【Syntax】

<!-- Source EN PDF p.127; unit 1409 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.127; unit 1410 -->

【Parameter】

<!-- Source EN PDF p.127; unit 1411 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter des Weißabgleichs | Ausgabe |

<!-- Source EN PDF p.127; unit 1412 -->

【Rückgabewert】

<!-- Source EN PDF p.127; unit 1413 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.127; unit 1414 -->

【Voraussetzungen】

<!-- Source EN PDF p.127; unit 1415 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1416 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.127; unit 1417 -->

【Beispiel】

<!-- Source EN PDF p.127; unit 1418 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.128; unit 1419 -->

#### 7.4.15  rk_aiq_uapi2_setAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1420 -->

【Beschreibung】 Alle von der Weißabgleichs-API unterstützten Parameter einstellen.

<!-- Source EN PDF p.128; unit 1421 -->

【Syntax】

<!-- Source EN PDF p.128; unit 1422 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.128; unit 1423 -->

【Parameter】

<!-- Source EN PDF p.128; unit 1424 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Alle von der Weißabgleichs-API unterstützten Parameter. | Eingabe |

<!-- Source EN PDF p.128; unit 1425 -->

【Rückgabewert】

<!-- Source EN PDF p.128; unit 1426 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler; Einzelheiten siehe Fehlercodetabelle |

<!-- Source EN PDF p.128; unit 1427 -->

【Voraussetzungen】

<!-- Source EN PDF p.128; unit 1428 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.128; unit 1429 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.128; unit 1430 -->

【Beispiel】

<!-- Source EN PDF p.128; unit 1431 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.128; unit 1432 -->

#### 7.4.16  rk_aiq_uapi2_getAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1433 -->

【Beschreibung】 Alle von der Weißabgleichs-API unterstützten Parameter abrufen.

<!-- Source EN PDF p.128; unit 1434 -->

【Syntax】

<!-- Source EN PDF p.128; unit 1435 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.128; unit 1436 -->

【Parameter】

<!-- Source EN PDF p.128; unit 1437 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | wbgain-Offsetparameter | Ausgabe |

<!-- Source EN PDF p.129; unit 1438 -->

【Rückgabewert】

<!-- Source EN PDF p.129; unit 1439 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler; Einzelheiten siehe Fehlercodetabelle |

<!-- Source EN PDF p.129; unit 1440 -->

【Voraussetzungen】

<!-- Source EN PDF p.129; unit 1441 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.129; unit 1442 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.129; unit 1443 -->

【Beispiel】

<!-- Source EN PDF p.129; unit 1444 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.129; unit 1445 -->

### 7.5   Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.129; unit 1446 -->

#### 7.5.1  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.129; unit 1447 -->

【Beschreibung】 Weißabgleichsbetriebsart definieren.

<!-- Source EN PDF p.129; unit 1448 -->

【Definition】

<!-- Source EN PDF p.129; unit 1449 -->

```text
 typedef enum rk_aiq_wb_op_mode_s {
     RK_AIQ_WB_MODE_INVALID        = 0,
     RK_AIQ_WB_MODE_MANUAL         = 1,
     RK_AIQ_WB_MODE_AUTO           = 2,
     RK_AIQ_WB_MODE_MAX
 } rk_aiq_wb_op_mode_t;
```

<!-- Source EN PDF p.129; unit 1450 -->

【Felder】

<!-- Source EN PDF p.129; unit 1451 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_WB_MODE_MANUAL | Manueller Weißabgleichsmodus |
| RK_AIQ_WB_MODE_AUTO | Automatischer Weißabgleichsmodus |

<!-- Source EN PDF p.129; unit 1452 -->

#### 7.5.2  rk_aiq_wb_mwb_mode_t

<!-- Source EN PDF p.129; unit 1453 -->

【Beschreibung】 Typ des manuellen Weißabgleichsmodus definieren.

<!-- Source EN PDF p.129; unit 1454 -->

【Definition】

<!-- Source EN PDF p.130; unit 1455 -->

```text
 typedef enum rk_aiq_wb_mwb_mode_e {
     RK_AIQ_MWB_MODE_INVAILD              = 0,
     RK_AIQ_MWB_MODE_CCT                  = 1,
     RK_AIQ_MWB_MODE_WBGAIN               = 2,
     RK_AIQ_MWB_MODE_SCENE                = 3,
 } rk_aiq_wb_mwb_mode_t;
```

<!-- Source EN PDF p.130; unit 1456 -->

【Felder】

<!-- Source EN PDF p.130; unit 1457 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_MWB_MODE_CCT | Farbtemperatur |
| RK_AIQ_MWB_MODE_WBGAIN | Verstärkungsfaktor |
| RK_AIQ_MWB_MODE_SCENE | Szene |

<!-- Source EN PDF p.130; unit 1458 -->

#### 7.5.3  rk_aiq_wb_gain_t

<!-- Source EN PDF p.130; unit 1459 -->

【Beschreibung】 Weißabgleichsverstärkungsparameter definieren.

<!-- Source EN PDF p.130; unit 1460 -->

【Definition】

<!-- Source EN PDF p.130; unit 1461 -->

```text
 typedef struct rk_aiq_wb_gain_s {
     float rgain;
     float grgain;
     float gbgain;
     float bgain;
 } rk_aiq_wb_gain_t;
```

<!-- Source EN PDF p.130; unit 1462 -->

【Felder】

<!-- Source EN PDF p.130; unit 1463 -->

| Feldname | Beschreibung |
|---|---|
| rgain | Verstärkung des R-Kanals |
| grgain | Verstärkung des G-Kanals |
| gbgain | Verstärkung des GB-Kanals |
| bgain | Verstärkung des B-Kanals |

<!-- Source EN PDF p.130; unit 1464 -->

#### 7.5.4  rk_aiq_wb_scene_t

<!-- Source EN PDF p.130; unit 1465 -->

【Beschreibung】 Weißabgleichsverstärkungsparameter definieren.

<!-- Source EN PDF p.130; unit 1466 -->

【Definition】

<!-- Source EN PDF p.131; unit 1467 -->

```text
 typedef enum rk_aiq_wb_scene_e {
     RK_AIQ_WBCT_INCANDESCENT = 0,
     RK_AIQ_WBCT_FLUORESCENT,
     RK_AIQ_WBCT_WARM_FLUORESCENT,
     RK_AIQ_WBCT_DAYLIGHT,
     RK_AIQ_WBCT_CLOUDY_DAYLIGHT,
     RK_AIQ_WBCT_TWILIGHT,
     RK_AIQ_WBCT_SHADE
 } rk_aiq_wb_scene_t;
```

<!-- Source EN PDF p.131; unit 1468 -->

【Felder】

<!-- Source EN PDF p.131; unit 1469 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_WBCT_INCANDESCENT | Glühlampe |
| RK_AIQ_WBCT_FLUORESCENT | Leuchtstofflampen |
| RK_AIQ_WBCT_WARM_FLUORESCENT | Warmweiße Leuchtstofflampe |
| RK_AIQ_WBCT_DAYLIGHT | Tageslicht |
| RK_AIQ_WBCT_CLOUDY_DAYLIGHT | Bewölkt |
| RK_AIQ_WBCT_TWILIGHT | Dämmerung |
| RK_AIQ_WBCT_SHADE | Schatten |

<!-- Source EN PDF p.131; unit 1470 -->

#### 7.5.5  rk_aiq_wb_cct_t

<!-- Source EN PDF p.131; unit 1471 -->

【Beschreibung】 Weißabgleichsverstärkungsparameter definieren.

<!-- Source EN PDF p.131; unit 1472 -->

【Definition】

<!-- Source EN PDF p.131; unit 1473 -->

```text
 typedef struct rk_aiq_wb_cct_s {
     float CCT;
     float CCRI;
 } rk_aiq_wb_cct_t;
```

<!-- Source EN PDF p.131; unit 1474 -->

【Felder】

<!-- Source EN PDF p.131; unit 1475 -->

| Feldname | Beschreibung |
|---|---|
| CCT | Korrelierte Farbtemperatur |
| CCRI | Korrelierter Farbwiedergabeindex |

<!-- Source EN PDF p.132; unit 1476 -->

#### 7.5.6  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.132; unit 1477 -->

【Beschreibung】 Eigenschaften des manuellen Weißabgleichs definieren.

<!-- Source EN PDF p.132; unit 1478 -->

【Definition】

<!-- Source EN PDF p.132; unit 1479 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.132; unit 1480 -->

【Felder】

<!-- Source EN PDF p.132; unit 1481 -->

| Feldname | Beschreibung |
|---|---|
| mode | Modusauswahl |

<!-- Source EN PDF p.132; unit 1482 -->

#### 7.5.7  rk_aiq_uapiV2_wb_awb_wbGainOffset_t

<!-- Source EN PDF p.132; unit 1483 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung definieren.

<!-- Source EN PDF p.132; unit 1484 -->

【Definition】

<!-- Source EN PDF p.132; unit 1485 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainOffset_s{
   rk_aiq_uapi_sync_t sync;
   CalibDbV2_Awb_gain_offset_cfg_t gainOffset;
 }rk_aiq_uapiV2_wb_awb_wbGainOffset_t;
```

<!-- Source EN PDF p.132; unit 1486 -->

【Felder】

<!-- Source EN PDF p.132; unit 1487 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definition von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| gainOffset | Siehe nachfolgende Beschreibung von CalibDbV2_Awb_gain_offset_cfg_t |

<!-- Source EN PDF p.132; unit 1488 -->

#### 7.5.8  CalibDbV2_Awb_gain_offset_cfg_t

<!-- Source EN PDF p.132; unit 1489 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung definieren.

<!-- Source EN PDF p.132; unit 1490 -->

【Definition】

<!-- Source EN PDF p.133; unit 1491 -->

```text
 typedef struct CalibDbV2_Awb_gain_offset_cfg_s{
   bool enable;
   float offset[4];
 }CalibDbV2_Awb_gain_offset_cfg_t;
```

<!-- Source EN PDF p.133; unit 1492 -->

【Felder】

<!-- Source EN PDF p.133; unit 1493 -->

| Feldname | Beschreibung |
|---|---|
| enable | Aktivierungsschalter;<br>0 bedeutet deaktiviert, 1 aktiviert |
| offset | wbgain und offset werden addiert. Der Offsetbereich für die Kanäle R GR GB B<br>ergibt sich aus der Summe von wbgain und offset;<br>diese Summe muss im Bereich [0,8] (ISP21) liegen. |

<!-- Source EN PDF p.133; unit 1494 -->

#### 7.5.9  rk_aiq_uapiV2_wb_awb_wbGainAdjust_t

<!-- Source EN PDF p.133; unit 1495 -->

【Beschreibung】 Farbtonanpassungsparameter des automatischen Weißabgleichs definieren.

<!-- Source EN PDF p.133; unit 1496 -->

【Definition】

<!-- Source EN PDF p.133; unit 1497 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_s {
   float lumaValue;
   int ct_grid_num;
   int cri_grid_num;
   float ct_in_range[2];//min,max, equal distance sapmle
   float cri_in_range[2];//min,max
   float *ct_lut_out;//size is ct_grid_num*cri_grid_num
   float *cri_lut_out;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t;
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjust_s {
   rk_aiq_uapi_sync_t sync;
   bool enable;
   rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
   int lutAll_len;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

<!-- Source EN PDF p.133; unit 1498 -->

【Felder】

<!-- Source EN PDF p.134; unit 1499 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definition von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| enable | Farbtonanpassung aktivieren:<br>0 bedeutet deaktiviert, 1 aktiviert |
| lutAll | Für unterschiedliche Umgebungshelligkeiten können unterschiedliche<br>Ausgangsfarbtemperaturtabellen konfiguriert werden. |
| lutAll_len | Anzahl der Farbtemperaturtabellen angeben |
| lutAll.ct_grid_num | Anzahl der Abtastpunkte<br>für die Eingangsfarbtemperatur der Farbtemperaturtabelle;<br>unbegrenzt |
| lutAll.ct_in_range | Eingangsfarbtemperaturbereich<br>der Farbtemperaturtabelle; unbegrenzt |
| lutAll.cri_grid_num | Anzahl der Abtastpunkte<br>für den Eingangsfarbwiedergabeindex der Farbtemperaturtabelle;<br>unbegrenzt |
| lutAll.cri_in_range | Bereich des Eingangsfarbwiedergabeindex<br>der Farbtemperaturtabelle; unbegrenzt |
| lutAll.ct_out | Wie im Werkzeugdialog dargestellt, liegen die ct-Werte der Punkte von links nach rechts<br>(Farbton von kalt zu warm), d. h. CT steigt von klein nach groß;<br>Wertebereich 0-255000. |
| lutAll.cri_out | Wie im Werkzeugdialog dargestellt, liegen die cri-Werte der Punkte von unten nach oben<br>(Farbton von Violett zu Grün), d. h. CRI steigt von negativen zu positiven<br>Werten **<br>Der Wertebereich ist unbegrenzt. |

<!-- Source EN PDF p.134; unit 1500 -->

Weitere Hinweise enthält das Kapitel zur WBGain-Farbanpassung im Dokument Rockchip_Color_Optimization_Guide.

<!-- Source EN PDF p.134; unit 1501 -->

#### 7.5.10  rk_aiq_uapiV2_wbV30_awb_attrib_t

<!-- Source EN PDF p.134; unit 1502 -->

【Beschreibung】 API-Parameter des automatischen Weißabgleichs definieren.

<!-- Source EN PDF p.134; unit 1503 -->

【Definition】

<!-- Source EN PDF p.134; unit 1504 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_awb_attrib_s {
     rk_aiq_uapiV2_wb_awb_wbGainAdjust_t wbGainAdjust;
     CalibDbV2_Awb_gain_offset_cfg_t wbGainOffset;
 } rk_aiq_uapiV2_wbV30_awb_attrib_t;
```

<!-- Source EN PDF p.134; unit 1505 -->

【Felder】

<!-- Source EN PDF p.135; unit 1506 -->

| Feldname | Beschreibung |
|---|---|
| wbGainAdjust | Siehe CalibDbV2_Awb_gain_offset_cfg_t |
| wbGainOffset | Siehe rk_aiq_uapiV2_wb_awb_wbGainAdjust_t |
| multiWindow | Siehe rk_aiq_uapiV2_wbV32_awb_mulWindow_t |

<!-- Source EN PDF p.135; unit 1507 -->

#### 7.5.11  rk_aiq_uapiV2_wbV32_attrib_t

<!-- Source EN PDF p.135; unit 1508 -->

【Beschreibung】 Alle von der Weißabgleichs-API unterstützten Parameter definieren.

<!-- Source EN PDF p.135; unit 1509 -->

【Definition】

<!-- Source EN PDF p.135; unit 1510 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_wb_op_mode_t mode;
     rk_aiq_wb_mwb_attrib_t stManual;
     rk_aiq_uapiV2_wbV30_awb_attrib_t stAuto;
 } rk_aiq_uapiV2_wbV30_attrib_t;
```

<!-- Source EN PDF p.135; unit 1511 -->

【Felder】

<!-- Source EN PDF p.135; unit 1512 -->

| Feldname | Beschreibung |
|---|---|
| sync | Beschreibung von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| bypass | Wert 0 oder 1. 0: Weißabgleichskorrektur durchführen; die verwendete Verstärkung<br>wird durch die Parameter am Tabellenende gesteuert.<br>1: Keine Weißabgleichskorrektur durchführen. |
| mode | Steuerparameter für automatischen oder manuellen Weißabgleich;<br>siehe rk_aiq_wb_op_mode_t |
| stManual | Manuelle Weißabgleichsparameter; siehe rk_aiq_wb_mwb_attrib_t |
| stAuto | Automatische Weißabgleichsparameter; siehe rk_aiq_uapiV2_wbV21_awb_attrib_t |

<!-- Source EN PDF p.135; unit 1513 -->

### 7.6   Referenz der modulbezogenen APIs

<!-- Source EN PDF p.135; unit 1514 -->

#### 7.6.1  rk_aiq_user_api2_awbV30_SetAllAttrib

<!-- Source EN PDF p.135; unit 1515 -->

【Beschreibung】 Alle von der Weißabgleichs-API unterstützten Parameter einstellen.

<!-- Source EN PDF p.135; unit 1516 -->

【Syntax】

<!-- Source EN PDF p.136; unit 1517 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_SetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.136; unit 1518 -->

【Parameter】

<!-- Source EN PDF p.136; unit 1519 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Alle von der Weißabgleichs-API unterstützten Parameter | Ausgabe |

<!-- Source EN PDF p.136; unit 1520 -->

【Rückgabewert】

<!-- Source EN PDF p.136; unit 1521 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.136; unit 1522 -->

【Voraussetzungen】

<!-- Source EN PDF p.136; unit 1523 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.136; unit 1524 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.136; unit 1525 -->

【Beispiel】

<!-- Source EN PDF p.136; unit 1526 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.136; unit 1527 -->

#### 7.6.2  rk_aiq_user_api2_awbV30_GetAllAttrib

<!-- Source EN PDF p.136; unit 1528 -->

【Beschreibung】 Alle von der Weißabgleichs-API unterstützten Parameter abrufen.

<!-- Source EN PDF p.136; unit 1529 -->

【Syntax】

<!-- Source EN PDF p.136; unit 1530 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_GetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.136; unit 1531 -->

【Parameter】

<!-- Source EN PDF p.136; unit 1532 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Alle von der Weißabgleichs-API unterstützten Parameter | Ausgabe |

<!-- Source EN PDF p.136; unit 1533 -->

【Rückgabewert】

<!-- Source EN PDF p.137; unit 1534 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.137; unit 1535 -->

【Voraussetzungen】

<!-- Source EN PDF p.137; unit 1536 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1537 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.137; unit 1538 -->

【Beispiel】

<!-- Source EN PDF p.137; unit 1539 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.137; unit 1540 -->

#### 7.6.3  rk_aiq_user_api2_awb_GetCCT

<!-- Source EN PDF p.137; unit 1541 -->

【Beschreibung】 Farbtemperatur des Weißabgleichs abrufen. Diese Funktion gilt für automatischen und manuellen Betrieb.

<!-- Source EN PDF p.137; unit 1542 -->

【Syntax】

<!-- Source EN PDF p.137; unit 1543 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetCCT(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_wb_cct_t
 *cct);
```

<!-- Source EN PDF p.137; unit 1544 -->

【Parameter】

<!-- Source EN PDF p.137; unit 1545 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| cct | Farbtemperaturparameter des Weißabgleichs | Ausgabe |

<!-- Source EN PDF p.137; unit 1546 -->

【Rückgabewert】

<!-- Source EN PDF p.137; unit 1547 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.137; unit 1548 -->

【Voraussetzungen】

<!-- Source EN PDF p.137; unit 1549 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1550 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.137; unit 1551 -->

【Beispiel】

<!-- Source EN PDF p.137; unit 1552 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.138; unit 1553 -->

#### 7.6.4  rk_aiq_user_api2_awb_QueryWBInfo

<!-- Source EN PDF p.138; unit 1554 -->

【Beschreibung】 Weißabgleichsverstärkungsfaktor und Farbtemperatur abrufen.

<!-- Source EN PDF p.138; unit 1555 -->

【Syntax】

<!-- Source EN PDF p.138; unit 1556 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_QueryWBInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_querry_info_t *wb_querry_info);
```

<!-- Source EN PDF p.138; unit 1557 -->

【Parameter】

<!-- Source EN PDF p.138; unit 1558 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| wb_querry_info | Farbbezogene Zustandsparameter | Ausgabe |

<!-- Source EN PDF p.138; unit 1559 -->

【Rückgabewert】

<!-- Source EN PDF p.138; unit 1560 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.138; unit 1561 -->

【Voraussetzungen】

<!-- Source EN PDF p.138; unit 1562 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.138; unit 1563 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.138; unit 1564 -->

【Beispiel】

<!-- Source EN PDF p.138; unit 1565 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.138; unit 1566 -->

#### 7.6.5  rk_aiq_user_api2_awb_Lock

<!-- Source EN PDF p.138; unit 1567 -->

【Beschreibung】 Aktuelle Weißabgleichsparameter sperren.

<!-- Source EN PDF p.138; unit 1568 -->

【Syntax】

<!-- Source EN PDF p.138; unit 1569 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.138; unit 1570 -->

【Parameter】

<!-- Source EN PDF p.138; unit 1571 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.139; unit 1572 -->

【Rückgabewert】

<!-- Source EN PDF p.139; unit 1573 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.139; unit 1574 -->

【Voraussetzungen】

<!-- Source EN PDF p.139; unit 1575 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1576 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.139; unit 1577 -->

【Beispiel】

<!-- Source EN PDF p.139; unit 1578 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.139; unit 1579 -->

#### 7.6.6  rk_aiq_user_api2_awb_Unlock

<!-- Source EN PDF p.139; unit 1580 -->

【Beschreibung】 Gesperrte Weißabgleichsparameter wieder freigeben.

<!-- Source EN PDF p.139; unit 1581 -->

【Syntax】

<!-- Source EN PDF p.139; unit 1582 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.139; unit 1583 -->

【Parameter】

<!-- Source EN PDF p.139; unit 1584 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.139; unit 1585 -->

【Rückgabewert】

<!-- Source EN PDF p.139; unit 1586 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.139; unit 1587 -->

【Voraussetzungen】

<!-- Source EN PDF p.139; unit 1588 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1589 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.139; unit 1590 -->

【Beispiel】

<!-- Source EN PDF p.139; unit 1591 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.140; unit 1592 -->

#### 7.6.7  rk_aiq_user_api2_awb_SetWpModeAttrib

<!-- Source EN PDF p.140; unit 1593 -->

【Beschreibung】 Weißabgleichsbetriebsart einstellen.

<!-- Source EN PDF p.140; unit 1594 -->

【Syntax】

<!-- Source EN PDF p.140; unit 1595 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t attr);
```

<!-- Source EN PDF p.140; unit 1596 -->

【Parameter】

<!-- Source EN PDF p.140; unit 1597 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Weißabgleichsbetriebsart | Ausgabe |

<!-- Source EN PDF p.140; unit 1598 -->

【Rückgabewert】

<!-- Source EN PDF p.140; unit 1599 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.140; unit 1600 -->

【Voraussetzungen】

<!-- Source EN PDF p.140; unit 1601 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.140; unit 1602 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.140; unit 1603 -->

【Beispiel】

<!-- Source EN PDF p.140; unit 1604 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.140; unit 1605 -->

#### 7.6.8  rk_aiq_user_api2_awb_GetWpModeAttrib

<!-- Source EN PDF p.140; unit 1606 -->

【Beschreibung】 Weißabgleichsbetriebsart abrufen.

<!-- Source EN PDF p.140; unit 1607 -->

【Syntax】

<!-- Source EN PDF p.140; unit 1608 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t *attr);
```

<!-- Source EN PDF p.140; unit 1609 -->

【Parameter】

<!-- Source EN PDF p.141; unit 1610 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Weißabgleichsbetriebsart | Ausgabe |

<!-- Source EN PDF p.141; unit 1611 -->

【Rückgabewert】

<!-- Source EN PDF p.141; unit 1612 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.141; unit 1613 -->

【Voraussetzungen】

<!-- Source EN PDF p.141; unit 1614 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.141; unit 1615 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.141; unit 1616 -->

【Beispiel】

<!-- Source EN PDF p.141; unit 1617 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.141; unit 1618 -->

#### 7.6.9  rk_aiq_user_api2_awb_SetMwbAttrib

<!-- Source EN PDF p.141; unit 1619 -->

【Beschreibung】 Manuelle Weißabgleichsparameter einstellen.

<!-- Source EN PDF p.141; unit 1620 -->

【Syntax】

<!-- Source EN PDF p.141; unit 1621 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.141; unit 1622 -->

【Parameter】

<!-- Source EN PDF p.141; unit 1623 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Manuelle Weißabgleichsparameter | Eingabe |

<!-- Source EN PDF p.141; unit 1624 -->

【Rückgabewert】

<!-- Source EN PDF p.141; unit 1625 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.141; unit 1626 -->

【Voraussetzungen】

<!-- Source EN PDF p.141; unit 1627 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1628 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.142; unit 1629 -->

【Beispiel】

<!-- Source EN PDF p.142; unit 1630 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.142; unit 1631 -->

#### 7.6.10  rk_aiq_user_api2_awb_GetMwbAttrib

<!-- Source EN PDF p.142; unit 1632 -->

【Beschreibung】 Manuelle Weißabgleichsparameter einstellen.

<!-- Source EN PDF p.142; unit 1633 -->

【Syntax】

<!-- Source EN PDF p.142; unit 1634 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.142; unit 1635 -->

【Parameter】

<!-- Source EN PDF p.142; unit 1636 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Manuelle Weißabgleichsparameter | Eingabe |

<!-- Source EN PDF p.142; unit 1637 -->

【Rückgabewert】

<!-- Source EN PDF p.142; unit 1638 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.142; unit 1639 -->

【Voraussetzungen】

<!-- Source EN PDF p.142; unit 1640 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1641 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.142; unit 1642 -->

【Beispiel】

<!-- Source EN PDF p.142; unit 1643 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.142; unit 1644 -->

#### 7.6.11  rk_aiq_user_api2_awb_SetWbGainAdjustAttrib

<!-- Source EN PDF p.142; unit 1645 -->

【Beschreibung】 Farbtonanpassungsparameter im automatischen Weißabgleichsmodus einstellen.

<!-- Source EN PDF p.142; unit 1646 -->

【Syntax】

<!-- Source EN PDF p.142; unit 1647 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.143; unit 1648 -->

【Parameter】

<!-- Source EN PDF p.143; unit 1649 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter | Eingabe |

<!-- Source EN PDF p.143; unit 1650 -->

【Rückgabewert】

<!-- Source EN PDF p.143; unit 1651 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.143; unit 1652 -->

【Voraussetzungen】

<!-- Source EN PDF p.143; unit 1653 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.143; unit 1654 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.143; unit 1655 -->

【Beispiel】

<!-- Source EN PDF p.143; unit 1656 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.143; unit 1657 -->

#### 7.6.12  rk_aiq_user_api2_awb_GetWbGainAdjustAttrib

<!-- Source EN PDF p.143; unit 1658 -->

【Beschreibung】 Farbtonanpassungsparameter im automatischen Weißabgleichsmodus abrufen.

<!-- Source EN PDF p.143; unit 1659 -->

【Syntax】

<!-- Source EN PDF p.143; unit 1660 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.143; unit 1661 -->

【Parameter】

<!-- Source EN PDF p.143; unit 1662 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter | Eingabe |

<!-- Source EN PDF p.143; unit 1663 -->

【Rückgabewert】

<!-- Source EN PDF p.143; unit 1664 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.143; unit 1665 -->

【Voraussetzungen】

<!-- Source EN PDF p.144; unit 1666 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1667 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.144; unit 1668 -->

【Beispiel】

<!-- Source EN PDF p.144; unit 1669 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.144; unit 1670 -->

#### 7.6.13  rk_aiq_user_api2_awb_SetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1671 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung einstellen.

<!-- Source EN PDF p.144; unit 1672 -->

【Syntax】

<!-- Source EN PDF p.144; unit 1673 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.144; unit 1674 -->

【Parameter】

<!-- Source EN PDF p.144; unit 1675 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter | Eingabe |

<!-- Source EN PDF p.144; unit 1676 -->

【Rückgabewert】

<!-- Source EN PDF p.144; unit 1677 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.144; unit 1678 -->

【Voraussetzungen】

<!-- Source EN PDF p.144; unit 1679 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1680 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.144; unit 1681 -->

【Beispiel】

<!-- Source EN PDF p.144; unit 1682 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.144; unit 1683 -->

#### 7.6.14  rk_aiq_user_api2_awb_GetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1684 -->

【Beschreibung】 Offset der automatischen Weißabgleichsverstärkung abrufen.

<!-- Source EN PDF p.144; unit 1685 -->

【Syntax】

<!-- Source EN PDF p.145; unit 1686 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t *attr);
```

<!-- Source EN PDF p.145; unit 1687 -->

【Parameter】

<!-- Source EN PDF p.145; unit 1688 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Farbtonanpassungsparameter | Eingabe |

<!-- Source EN PDF p.145; unit 1689 -->

【Rückgabewert】

<!-- Source EN PDF p.145; unit 1690 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.145; unit 1691 -->

【Voraussetzungen】

<!-- Source EN PDF p.145; unit 1692 -->

Headerdateien: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.145; unit 1693 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.145; unit 1694 -->

【Beispiel】

<!-- Source EN PDF p.145; unit 1695 -->

Siehe sample_awb_module.cpp.

<!-- Source EN PDF p.145; unit 1696 -->

### 7.7   Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.145; unit 1697 -->

#### 7.7.1  rk_aiq_wb_querry_info_t

<!-- Source EN PDF p.145; unit 1698 -->

【Beschreibung】 Weißabgleichsabfrageinformationen definieren.

<!-- Source EN PDF p.145; unit 1699 -->

【Definition】

<!-- Source EN PDF p.145; unit 1700 -->

```text
 typedef struct rk_aiq_wb_querry_info_s {
     rk_aiq_wb_gain_t gain;
     rk_aiq_wb_cct_t cctGloabl;
     bool awbConverged;
     uint32_t LVValue;
 } rk_aiq_wb_querry_info_t;
```

<!-- Source EN PDF p.145; unit 1701 -->

【Felder】

<!-- Source EN PDF p.146; unit 1702 -->

| Feldname | Beschreibung |
|---|---|
| gain | Verstärkung |
| cctGloabl | Globaler Farbtemperaturparameter |
| LVValue | Zugehörige Umgebungshelligkeit |

<!-- Source EN PDF p.146; unit 1703 -->

#### 7.7.2  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.146; unit 1704 -->

【Beschreibung】 Weißabgleichsbetriebsart definieren.

<!-- Source EN PDF p.146; unit 1705 -->

【Definition】

<!-- Source EN PDF p.146; unit 1706 -->

```text
 typedef struct rk_aiq_uapiV2_wb_opMode_s {
   rk_aiq_uapi_sync_t sync;
   rk_aiq_wb_op_mode_t mode;
 } rk_aiq_uapiV2_wb_opMode_t;
```

<!-- Source EN PDF p.146; unit 1707 -->

【Felder】

<!-- Source EN PDF p.146; unit 1708 -->

| Feldname | Beschreibung |
|---|---|
| sync | Beschreibung von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| mode | Siehe Beschreibung von rk_aiq_wb_op_mode_t |

<!-- Source EN PDF p.146; unit 1709 -->

#### 7.7.3  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.146; unit 1710 -->

【Beschreibung】 Eigenschaften des manuellen Weißabgleichs definieren.

<!-- Source EN PDF p.146; unit 1711 -->

【Definition】

<!-- Source EN PDF p.146; unit 1712 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
      rk_aiq_uapi_sync_t sync;
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.146; unit 1713 -->

【Felder】

<!-- Source EN PDF p.147; unit 1714 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definitionen von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| mode | Modusauswahl |
| para | Parameterkonfiguration für den Modus |

<!-- Source EN PDF p.147; unit 1715 -->

## 8.   AF

<!-- Source EN PDF p.147; unit 1716 -->

### 8.1   Überblick

<!-- Source EN PDF p.147; unit 1717 -->

Das AF-Modul stellt das Kameraobjektiv so ein, dass das Motiv scharf abgebildet wird.

<!-- Source EN PDF p.147; unit 1718 -->

### 8.2   Funktionsbeschreibung

<!-- Source EN PDF p.147; unit 1719 -->

Das AF-Modul besteht aus AF-Informationsstatistik und AF-Steueralgorithmus. Das folgende Blockbild zeigt die Statistik:

<!-- Source EN PDF p.147; unit 1720 -->

![Technische Originalabbildung — PDF S. 147](/docs/rockchip-isp30-development/assets/en-p147-X1161.png)

<!-- Source EN PDF p.147; unit 1721 -->

ch0/ch1/ch2 entsprechen im HDR-Modus den S/M/L-Frames; debayer bezeichnet den zusammengesetzten HDR-Frame.

<!-- Source EN PDF p.147; unit 1722 -->

windowA liefert hauptsächlich 15\*15 V1/V2/H1/H2-FV-Werte, Helligkeitsinformationen und die Anzahl heller Pixel.

<!-- Source EN PDF p.147; unit 1723 -->

windowB liefert hauptsächlich einen FV-Wert, Helligkeitsinformationen und die Anzahl heller Pixel.

<!-- Source EN PDF p.148; unit 1724 -->

### 8.3   userAF-Algorithmen entwickeln

<!-- Source EN PDF p.148; unit 1725 -->

![Technische Originalabbildung — PDF S. 148](/docs/rockchip-isp30-development/assets/en-p148-X1167.png)

<!-- Source EN PDF p.148; unit 1726 -->

Referenzcode im SDK: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.148; unit 1727 -->

### 8.4   Funktionsbezogene API-Referenz

<!-- Source EN PDF p.148; unit 1728 -->

#### 8.4.1  rk_aiq_uapi2_setFocusMode

<!-- Source EN PDF p.148; unit 1729 -->

【Beschreibung】 Fokusmodus konfigurieren.

<!-- Source EN PDF p.148; unit 1730 -->

【Syntax】

<!-- Source EN PDF p.148; unit 1731 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.148; unit 1732 -->

【Parameter】

<!-- Source EN PDF p.148; unit 1733 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Fokusmodus | Eingabe |

<!-- Source EN PDF p.148; unit 1734 -->

【Rückgabewert】

<!-- Source EN PDF p.148; unit 1735 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.148; unit 1736 -->

【Voraussetzungen】

<!-- Source EN PDF p.148; unit 1737 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.148; unit 1738 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.149; unit 1739 -->

#### 8.4.2  rk_aiq_uapi2_getFocusMode

<!-- Source EN PDF p.149; unit 1740 -->

【Beschreibung】 Aktuellen Fokusmodus abfragen.

<!-- Source EN PDF p.149; unit 1741 -->

【Syntax】

<!-- Source EN PDF p.149; unit 1742 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.149; unit 1743 -->

【Parameter】

<!-- Source EN PDF p.149; unit 1744 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Fokusmodus | Ausgabe |

<!-- Source EN PDF p.149; unit 1745 -->

【Rückgabewert】

<!-- Source EN PDF p.149; unit 1746 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.149; unit 1747 -->

【Voraussetzungen】

<!-- Source EN PDF p.149; unit 1748 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.149; unit 1749 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.149; unit 1750 -->

#### 8.4.3  rk_aiq_uapi2_setFocusWin

<!-- Source EN PDF p.149; unit 1751 -->

【Beschreibung】 Autofokusfenster einstellen.

<!-- Source EN PDF p.149; unit 1752 -->

【Syntax】

<!-- Source EN PDF p.149; unit 1753 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.149; unit 1754 -->

【Parameter】

<!-- Source EN PDF p.149; unit 1755 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| rect | Fokusfenster; der Wertebereich hängt von der Sensor-Eingangsgröße ab. | Eingabe |

<!-- Source EN PDF p.149; unit 1756 -->

【Rückgabewert】

<!-- Source EN PDF p.150; unit 1757 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.150; unit 1758 -->

【Voraussetzungen】

<!-- Source EN PDF p.150; unit 1759 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1760 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.150; unit 1761 -->

#### 8.4.4  rk_aiq_uapi2_getFocusWin

<!-- Source EN PDF p.150; unit 1762 -->

【Beschreibung】 Autofokusfenster einstellen. Die getFocusWin-Beschreibung lautet im Original ebenfalls „Set“; dies bleibt als Quellenabweichung erhalten.

<!-- Source EN PDF p.150; unit 1763 -->

【Syntax】

<!-- Source EN PDF p.150; unit 1764 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.150; unit 1765 -->

【Parameter】

<!-- Source EN PDF p.150; unit 1766 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| rect | Fokusfenster | Ausgabe |

<!-- Source EN PDF p.150; unit 1767 -->

【Rückgabewert】

<!-- Source EN PDF p.150; unit 1768 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.150; unit 1769 -->

【Voraussetzungen】

<!-- Source EN PDF p.150; unit 1770 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1771 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.150; unit 1772 -->

#### 8.4.5  rk_aiq_uapi2_lockFocus

<!-- Source EN PDF p.150; unit 1773 -->

【Beschreibung】 Autofokus sperren und die Fokusbewegung pausieren.

<!-- Source EN PDF p.150; unit 1774 -->

【Syntax】

<!-- Source EN PDF p.150; unit 1775 -->

```text
 XCamReturn rk_aiq_uapi2_lockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.150; unit 1776 -->

【Parameter】

<!-- Source EN PDF p.151; unit 1777 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.151; unit 1778 -->

【Rückgabewert】

<!-- Source EN PDF p.151; unit 1779 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.151; unit 1780 -->

【Voraussetzungen】

<!-- Source EN PDF p.151; unit 1781 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1782 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.151; unit 1783 -->

#### 8.4.6  rk_aiq_uapi2_unlockFocus

<!-- Source EN PDF p.151; unit 1784 -->

【Beschreibung】 Autofokus entsperren und Fokusbewegung fortsetzen.

<!-- Source EN PDF p.151; unit 1785 -->

【Syntax】

<!-- Source EN PDF p.151; unit 1786 -->

```text
 XCamReturn rk_aiq_uapi2_unlockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.151; unit 1787 -->

【Parameter】

<!-- Source EN PDF p.151; unit 1788 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.151; unit 1789 -->

【Rückgabewert】

<!-- Source EN PDF p.151; unit 1790 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.151; unit 1791 -->

【Voraussetzungen】

<!-- Source EN PDF p.151; unit 1792 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1793 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.151; unit 1794 -->

#### 8.4.7  rk_aiq_uapi2_oneshotFocus

<!-- Source EN PDF p.151; unit 1795 -->

【Beschreibung】 Einmalige Fokussierung auslösen; nach Abschluss wird nicht weiter fokussiert.

<!-- Source EN PDF p.151; unit 1796 -->

【Syntax】

<!-- Source EN PDF p.152; unit 1797 -->

```text
 XCamReturn rk_aiq_uapi2_oneshotFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1798 -->

【Parameter】

<!-- Source EN PDF p.152; unit 1799 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.152; unit 1800 -->

【Rückgabewert】

<!-- Source EN PDF p.152; unit 1801 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.152; unit 1802 -->

【Voraussetzungen】

<!-- Source EN PDF p.152; unit 1803 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1804 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.152; unit 1805 -->

#### 8.4.8  rk_aiq_uapi2_manualTrigerFocus

<!-- Source EN PDF p.152; unit 1806 -->

【Beschreibung】 Fokussierung manuell auslösen. Anschließend die Bildunschärfe weiter überwachen und bei erneuter Unschärfe nochmals fokussieren.

<!-- Source EN PDF p.152; unit 1807 -->

【Syntax】

<!-- Source EN PDF p.152; unit 1808 -->

```text
 XCamReturn rk_aiq_uapi2_manualTrigerFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1809 -->

【Parameter】

<!-- Source EN PDF p.152; unit 1810 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.152; unit 1811 -->

【Rückgabewert】

<!-- Source EN PDF p.152; unit 1812 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.152; unit 1813 -->

【Voraussetzungen】

<!-- Source EN PDF p.152; unit 1814 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1815 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.153; unit 1816 -->

#### 8.4.9  rk_aiq_uapi2_trackingFocus

<!-- Source EN PDF p.153; unit 1817 -->

【Beschreibung】 Bildunschärfe fortlaufend überwachen und bei Bedarf erneut fokussieren. Üblicherweise nach rk_aiq_uapi2_oneshotFocus verwenden.

<!-- Source EN PDF p.153; unit 1818 -->

【Syntax】

<!-- Source EN PDF p.153; unit 1819 -->

```text
 XCamReturn rk_aiq_uapi2_trackingFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.153; unit 1820 -->

【Parameter】

<!-- Source EN PDF p.153; unit 1821 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.153; unit 1822 -->

【Rückgabewert】

<!-- Source EN PDF p.153; unit 1823 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.153; unit 1824 -->

【Voraussetzungen】

<!-- Source EN PDF p.153; unit 1825 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.153; unit 1826 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.153; unit 1827 -->

#### 8.4.10  rk_aiq_uapi2_getSearchResult

<!-- Source EN PDF p.153; unit 1828 -->

【Beschreibung】 Fokussierergebnis abfragen.

<!-- Source EN PDF p.153; unit 1829 -->

【Syntax】

<!-- Source EN PDF p.153; unit 1830 -->

```text
 XCamReturn rk_aiq_uapi2_getSearchResult(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_result_t* result);
```

<!-- Source EN PDF p.153; unit 1831 -->

【Parameter】

<!-- Source EN PDF p.153; unit 1832 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| result | Fokussierergebnisse; siehe Struktur rk_aiq_af_result_t. | Ausgabe |

<!-- Source EN PDF p.153; unit 1833 -->

【Rückgabewert】

<!-- Source EN PDF p.154; unit 1834 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.154; unit 1835 -->

【Voraussetzungen】

<!-- Source EN PDF p.154; unit 1836 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1837 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.154; unit 1838 -->

#### 8.4.11  rk_aiq_uapi2_getZoomRange

<!-- Source EN PDF p.154; unit 1839 -->

【Beschreibung】 Zoombereich abfragen. Er begrenzt die Zoomcode-Eingabe von rk_aiq_uapi_setOpZoomPosition; die API-Schreibweise der Quelle bleibt erhalten.

<!-- Source EN PDF p.154; unit 1840 -->

【Syntax】

<!-- Source EN PDF p.154; unit 1841 -->

```text
 XCamReturn rk_aiq_uapi2_getZoomRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_zoomrange* range);
```

<!-- Source EN PDF p.154; unit 1842 -->

【Parameter】

<!-- Source EN PDF p.154; unit 1843 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| range | Bewegungsbereich des Zooms; siehe rk_aiq_af_zoomrange. | Ausgabe |

<!-- Source EN PDF p.154; unit 1844 -->

【Rückgabewert】

<!-- Source EN PDF p.154; unit 1845 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.154; unit 1846 -->

【Voraussetzungen】

<!-- Source EN PDF p.154; unit 1847 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1848 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.154; unit 1849 -->

#### 8.4.12  rk_aiq_uapi2_setOpZoomPosition

<!-- Source EN PDF p.154; unit 1850 -->

【Beschreibung】 Zoomposition einstellen beziehungsweise ändern.

<!-- Source EN PDF p.154; unit 1851 -->

【Syntax】

<!-- Source EN PDF p.154; unit 1852 -->

```text
 XCamReturn rk_aiq_uapi2_setOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int pos);
```

<!-- Source EN PDF p.154; unit 1853 -->

【Parameter】

<!-- Source EN PDF p.155; unit 1854 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pos | Zoomposition; Wertebereich gemäß rk_aiq_uapi2_getZoomRange. | Eingabe |

<!-- Source EN PDF p.155; unit 1855 -->

【Rückgabewert】

<!-- Source EN PDF p.155; unit 1856 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.155; unit 1857 -->

【Voraussetzungen】

<!-- Source EN PDF p.155; unit 1858 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1859 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.155; unit 1860 -->

#### 8.4.13  rk_aiq_uapi2_getOpZoomPosition

<!-- Source EN PDF p.155; unit 1861 -->

【Beschreibung】 Zoomposition abfragen.

<!-- Source EN PDF p.155; unit 1862 -->

【Syntax】

<!-- Source EN PDF p.155; unit 1863 -->

```text
 XCamReturn rk_aiq_uapi2_getOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int *pos);
```

<!-- Source EN PDF p.155; unit 1864 -->

【Parameter】

<!-- Source EN PDF p.155; unit 1865 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pos | Zoomposition | Ausgabe |

<!-- Source EN PDF p.155; unit 1866 -->

【Rückgabewert】

<!-- Source EN PDF p.155; unit 1867 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.155; unit 1868 -->

【Voraussetzungen】

<!-- Source EN PDF p.155; unit 1869 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1870 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.156; unit 1871 -->

#### 8.4.14  rk_aiq_uapi2_endOpZoomChange

<!-- Source EN PDF p.156; unit 1872 -->

【Beschreibung】 Einstellung der Zoommotorposition abschließen. Nach rk_aiq_uapi_setOpZoomPosition aufrufen; danach erfolgt die Fokussierung. Die API-Schreibweise der Quelle bleibt erhalten.

<!-- Source EN PDF p.156; unit 1873 -->

【Syntax】

<!-- Source EN PDF p.156; unit 1874 -->

```text
 XCamReturn rk_aiq_uapi2_endOpZoomChange(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.156; unit 1875 -->

【Parameter】

<!-- Source EN PDF p.156; unit 1876 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.156; unit 1877 -->

【Rückgabewert】

<!-- Source EN PDF p.156; unit 1878 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.156; unit 1879 -->

【Voraussetzungen】

<!-- Source EN PDF p.156; unit 1880 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.156; unit 1881 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.156; unit 1882 -->

#### 8.4.15  rk_aiq_uapi2_getFocusRange

<!-- Source EN PDF p.156; unit 1883 -->

【Beschreibung】 Fokusbereich abfragen. Er begrenzt den Fokuscode von rk_aiq_uapi_setFocusPosition; die API-Schreibweise der Quelle bleibt erhalten.

<!-- Source EN PDF p.156; unit 1884 -->

【Syntax】

<!-- Source EN PDF p.156; unit 1885 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_focusrange* range);
```

<!-- Source EN PDF p.156; unit 1886 -->

【Parameter】

<!-- Source EN PDF p.156; unit 1887 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| range | Bewegungsbereich des Fokus; siehe rk_aiq_af_focusrange. | Ausgabe |

<!-- Source EN PDF p.156; unit 1888 -->

【Rückgabewert】

<!-- Source EN PDF p.157; unit 1889 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.157; unit 1890 -->

【Voraussetzungen】

<!-- Source EN PDF p.157; unit 1891 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1892 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.157; unit 1893 -->

#### 8.4.16  rk_aiq_uapi2_setFocusPosition

<!-- Source EN PDF p.157; unit 1894 -->

【Beschreibung】 Fokusposition im manuellen Fokusmodus einstellen.

<!-- Source EN PDF p.157; unit 1895 -->

【Syntax】

<!-- Source EN PDF p.157; unit 1896 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short code);
```

<!-- Source EN PDF p.157; unit 1897 -->

【Parameter】

<!-- Source EN PDF p.157; unit 1898 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| code | Fokuscode; Wertebereich gemäß rk_aiq_uapi2_getFocusRange. | Eingabe |

<!-- Source EN PDF p.157; unit 1899 -->

【Rückgabewert】

<!-- Source EN PDF p.157; unit 1900 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.157; unit 1901 -->

【Voraussetzungen】

<!-- Source EN PDF p.157; unit 1902 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1903 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.157; unit 1904 -->

#### 8.4.17  rk_aiq_uapi2_getFocusPosition

<!-- Source EN PDF p.157; unit 1905 -->

【Beschreibung】 Aktuelle Fokusposition abfragen.

<!-- Source EN PDF p.157; unit 1906 -->

【Syntax】

<!-- Source EN PDF p.157; unit 1907 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short *code);
```

<!-- Source EN PDF p.158; unit 1908 -->

【Parameter】

<!-- Source EN PDF p.158; unit 1909 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| code | Fokuscodewert | Ausgabe |

<!-- Source EN PDF p.158; unit 1910 -->

【Rückgabewert】

<!-- Source EN PDF p.158; unit 1911 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.158; unit 1912 -->

【Voraussetzungen】

<!-- Source EN PDF p.158; unit 1913 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1914 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.158; unit 1915 -->

#### 8.4.18  rk_aiq_uapi2_startZoomCalib

<!-- Source EN PDF p.158; unit 1916 -->

【Beschreibung】 Elektromotormodul korrigieren.

<!-- Source EN PDF p.158; unit 1917 -->

【Syntax】

<!-- Source EN PDF p.158; unit 1918 -->

```text
 XCamReturn rk_aiq_uapi2_startZoomCalib(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.158; unit 1919 -->

【Parameter】

<!-- Source EN PDF p.158; unit 1920 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.158; unit 1921 -->

【Rückgabewert】

<!-- Source EN PDF p.158; unit 1922 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.158; unit 1923 -->

【Voraussetzungen】

<!-- Source EN PDF p.158; unit 1924 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1925 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.159; unit 1926 -->

#### 8.4.19  rk_aiq_uapi2_resetZoom

<!-- Source EN PDF p.159; unit 1927 -->

【Beschreibung】 Elektromotormodul zurücksetzen.

<!-- Source EN PDF p.159; unit 1928 -->

【Syntax】

<!-- Source EN PDF p.159; unit 1929 -->

```text
 XCamReturn rk_aiq_uapi2_resetZoom(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.159; unit 1930 -->

【Parameter】

<!-- Source EN PDF p.159; unit 1931 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.159; unit 1932 -->

【Rückgabewert】

<!-- Source EN PDF p.159; unit 1933 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.159; unit 1934 -->

【Voraussetzungen】

<!-- Source EN PDF p.159; unit 1935 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.159; unit 1936 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.159; unit 1937 -->

### 8.5   Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.159; unit 1938 -->

#### 8.5.1  opMode_t

<!-- Source EN PDF p.159; unit 1939 -->

【Beschreibung】 Betriebsmodus der AF-Informationsstatistik definieren.

<!-- Source EN PDF p.159; unit 1940 -->

【Definition】

<!-- Source EN PDF p.159; unit 1941 -->

```text
 typedef enum opMode_e {
     OP_AUTO   = 0,
     OP_MANUAL = 1,
     OP_SEMI_AUTO = 2,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.159; unit 1942 -->

【Felder】

<!-- Source EN PDF p.160; unit 1943 -->

| Feldname | Beschreibung |
|---|---|
| OP_AUTO | Autofokusmodus; integrierter AF-Algorithmus läuft. |
| OP_MANUAL | Manueller Fokus; integrierter AF-Algorithmus gestoppt. |
| OP_SEMI_AUTO | Halbautomatischer Fokus; Aufruf der Zoomposition-API löst Autofokus aus. |

<!-- Source EN PDF p.160; unit 1944 -->

#### 8.5.2  rk_aiq_af_zoomrange

<!-- Source EN PDF p.160; unit 1945 -->

【Beschreibung】 Wertebereich des Zooms definieren.

<!-- Source EN PDF p.160; unit 1946 -->

【Definition】

<!-- Source EN PDF p.160; unit 1947 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
     float min_fl;
     float max_fl;
 } rk_aiq_af_zoomrange;
```

<!-- Source EN PDF p.160; unit 1948 -->

【Felder】

<!-- Source EN PDF p.160; unit 1949 -->

| Feldname | Beschreibung |
|---|---|
| min_pos | Minimale Zoomposition |
| max_pos | Maximale Zoomposition |
| min_fl | Minimale Brennweite |
| max_fl | Maximale Brennweite |

<!-- Source EN PDF p.160; unit 1950 -->

#### 8.5.3  rk_aiq_af_focusrange

<!-- Source EN PDF p.160; unit 1951 -->

【Beschreibung】 Wertebereich des Fokus definieren.

<!-- Source EN PDF p.160; unit 1952 -->

【Definition】

<!-- Source EN PDF p.160; unit 1953 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
 } rk_aiq_af_focusrange;
```

<!-- Source EN PDF p.160; unit 1954 -->

【Felder】

<!-- Source EN PDF p.160; unit 1955 -->

| Feldname | Beschreibung |
|---|---|
| min_pos | Minimale Fokusposition |
| max_pos | Maximale Fokusposition |

<!-- Source EN PDF p.161; unit 1956 -->

#### 8.5.4  rk_aiq_af_result_t

<!-- Source EN PDF p.161; unit 1957 -->

【Beschreibung】 AF-Suchergebnisse definieren.

<!-- Source EN PDF p.161; unit 1958 -->

【Definition】

<!-- Source EN PDF p.161; unit 1959 -->

```text
 typedef enum rk_aiq_af_sec_stat_e
 {
     RK_AIQ_AF_SEARCH_INVAL   = 0,
     RK_AIQ_AF_SEARCH_RUNNING = 1,
     RK_AIQ_AF_SEARCH_END     = 2
 } rk_aiq_af_sec_stat_t;
 typedef struct {
     rk_aiq_af_sec_stat_t stat;
     int32_t final_pos;
 } rk_aiq_af_result_t;
```

<!-- Source EN PDF p.161; unit 1960 -->

【Felder】

<!-- Source EN PDF p.161; unit 1961 -->

| Feldname | Beschreibung |
|---|---|
| stat | Fokusstatus |
| final_pos | Endgültige Fokusposition |

<!-- Source EN PDF p.161; unit 1962 -->

### 8.6   Modulbezogene API-Referenz

<!-- Source EN PDF p.161; unit 1963 -->

#### 8.6.1  rk_aiq_user_api2_af_SetAttrib

<!-- Source EN PDF p.161; unit 1964 -->

【Beschreibung】 Fokuseigenschaften einstellen.

<!-- Source EN PDF p.161; unit 1965 -->

【Syntax】

<!-- Source EN PDF p.161; unit 1966 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 attr);
```

<!-- Source EN PDF p.161; unit 1967 -->

【Parameter】

<!-- Source EN PDF p.161; unit 1968 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Fokusparametereigenschaften | Eingabe |

<!-- Source EN PDF p.161; unit 1969 -->

【Rückgabewert】

<!-- Source EN PDF p.162; unit 1970 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.162; unit 1971 -->

【Voraussetzungen】

<!-- Source EN PDF p.162; unit 1972 -->

Headerdatei: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1973 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.162; unit 1974 -->

#### 8.6.2  rk_aiq_user_api2_af_GetAttrib

<!-- Source EN PDF p.162; unit 1975 -->

【Beschreibung】 Fokuseigenschaften abfragen.

<!-- Source EN PDF p.162; unit 1976 -->

【Syntax】

<!-- Source EN PDF p.162; unit 1977 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 *attr);
```

<!-- Source EN PDF p.162; unit 1978 -->

【Parameter】

<!-- Source EN PDF p.162; unit 1979 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Fokusparametereigenschaften | Ausgabe |

<!-- Source EN PDF p.162; unit 1980 -->

【Rückgabewert】

<!-- Source EN PDF p.162; unit 1981 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.162; unit 1982 -->

【Voraussetzungen】

<!-- Source EN PDF p.162; unit 1983 -->

Headerdatei: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1984 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.163; unit 1985 -->

### 8.7   Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.163; unit 1986 -->

#### 8.7.1  RKAIQ_AF_MODE

<!-- Source EN PDF p.163; unit 1987 -->

【Beschreibung】 Fokusbetriebsmodus definieren.

<!-- Source EN PDF p.163; unit 1988 -->

【Definition】

<!-- Source EN PDF p.163; unit 1989 -->

```text
 typedef enum _RKAIQ_AF_MODE
 {
     RKAIQ_AF_MODE_NOT_SET = -1,
     RKAIQ_AF_MODE_AUTO,
     RKAIQ_AF_MODE_MACRO,
     RKAIQ_AF_MODE_INFINITY,
     RKAIQ_AF_MODE_FIXED,
     RKAIQ_AF_MODE_EDOF,
     RKAIQ_AF_MODE_CONTINUOUS_VIDEO,
     RKAIQ_AF_MODE_CONTINUOUS_PICTURE,
     RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM,
 } RKAIQ_AF_MODE;
```

<!-- Source EN PDF p.163; unit 1990 -->

【Felder】

<!-- Source EN PDF p.163; unit 1991 -->

| Feldname | Beschreibung |
|---|---|
| RKAIQ_AF_MODE_NOT_SET | Fokusmodus nicht gesetzt. |
| RKAIQ_AF_MODE_AUTO | Autofokusmodus |
| RKAIQ_AF_MODE_MACRO | Makrofokusmodus |
| RKAIQ_AF_MODE_INFINITY | Fernfokusmodus |
| RKAIQ_AF_MODE_FIXED | Festfokusmodus |
| RKAIQ_AF_MODE_EDOF | Schärfentiefen-Fokusmodus |
| RKAIQ_AF_MODE_CONTINUOUS_VIDEO | Sanfter kontinuierlicher Fokus |
| RKAIQ_AF_MODE_CONTINUOUS_PICTURE | Schneller kontinuierlicher Fokus |
| RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM | Halbautomatischer Fokus; Einstellen der Zoomposition löst automatisch eine Fokussierung aus. |

<!-- Source EN PDF p.163; unit 1992 -->

#### 8.7.2  RKAIQ_AF_HWVER

<!-- Source EN PDF p.163; unit 1993 -->

【Beschreibung】 Fokusbetriebsmodus definieren. Die Quelle verwendet diese Beschreibung auch für RKAIQ_AF_HWVER; die Typ-/Beschreibungsabweichung bleibt dokumentiert.

<!-- Source EN PDF p.163; unit 1994 -->

【Definition】

<!-- Source EN PDF p.164; unit 1995 -->

```text
 typedef enum _RKAIQ_AF_HWVER
 {
     RKAIQ_AF_HW_V20 = 0,
     RKAIQ_AF_HW_V30,
     RKAIQ_AF_HW_VMAX
 } RKAIQ_AF_HWVER;
```

<!-- Source EN PDF p.164; unit 1996 -->

【Felder】

<!-- Source EN PDF p.164; unit 1997 -->

| Feldname | Beschreibung |
|---|---|
| RKAIQ_AF_HW_V20 | AF-Hardwareversion 2.0 |
| RKAIQ_AF_HW_V30 | AF-Hardwareversion 3.0 |

<!-- Source EN PDF p.164; unit 1998 -->

#### 8.7.3  rk_aiq_af_algo_meas_v30_t

<!-- Source EN PDF p.164; unit 1999 -->

【Beschreibung】 Betriebsmodus der AF-Informationsstatistik definieren.

<!-- Source EN PDF p.164; unit 2000 -->

【Definition】

<!-- Source EN PDF p.164; unit 2001 -->

```text
 typedef struct {
     unsigned char af_en;
     unsigned char rawaf_sel;
     unsigned char gamma_en;
     unsigned char gaus_en;
     unsigned char v1_fir_sel;
     unsigned char hiir_en;
     unsigned char viir_en;
     unsigned char v1_fv_outmode;    // 0 square, 1 absolute
     unsigned char v2_fv_outmode;    // 0 square, 1 absolute
     unsigned char h1_fv_outmode;    // 0 square, 1 absolute
     unsigned char h2_fv_outmode;    // 0 square, 1 absolute
     unsigned char ldg_en;
     unsigned char accu_8bit_mode;   //fix to 1
     unsigned char ae_mode;
     unsigned char y_mode;           //fix to 0
     unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
     unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
     unsigned char window_num;
     unsigned short wina_h_offs;
     unsigned short wina_v_offs;
     unsigned short wina_h_size;
     unsigned short wina_v_size;
     unsigned short winb_h_offs;
     unsigned short winb_v_offs;
     unsigned short winb_h_size;
     unsigned short winb_v_size;
     unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
     // [old version param]
     unsigned short thres;
     unsigned char shift_sum_a;
     unsigned char shift_sum_b;
     unsigned char shift_y_a;
     unsigned char shift_y_b;
```

<!-- Source EN PDF p.165; unit 2002 -->

```text
     /**********[Vertical IIR (v1 & v2)]************/
     short v1_iir_coe[9];
     short v1_fir_coe[3];
     short v2_iir_coe[3];
     short v2_fir_coe[3];
     /**********[Horizontal IIR (h1 & h2)]************/
     short h1_iir1_coe[6];
     short h2_iir1_coe[6];
     short h1_iir2_coe[6];
     short h2_iir2_coe[6];
     /**********[Focus value statistic param]**********/
     // level depended gain
     // input8 lumi, output8bit gain
     unsigned char h_ldg_lumth[2];    //luminance thresh
     unsigned char h_ldg_gain[2];     //gain for [minLum,maxLum]
     unsigned short h_ldg_gslp[2];    //[slope_low,-slope_high]
     unsigned char v_ldg_lumth[2];
     unsigned char v_ldg_gain[2];
     unsigned short v_ldg_gslp[2];
     // coring
     unsigned short v_fv_thresh;
     unsigned short h_fv_thresh;
     // left shift, more needed if outmode=square
     unsigned char v1_fv_shift; //only for sel1
     unsigned char v2_fv_shift;
     unsigned char h1_fv_shift;
     unsigned char h2_fv_shift;
     /**********[High light]**********/
     unsigned short highlit_thresh;
 }  rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.165; unit 2003 -->

【Felder】

<!-- Source EN PDF p.166; unit 2004 -->

| Feldname | Beschreibung |
|---|---|
| af_en | AF-Statistik aktivieren: 0 aus, 1 ein. |
| rawaf_sel | AF-Statistikkanal wählen, Bereich 0-3 für lange/mittlere/kurze/zusammengesetzte HDR-Frames. AF verwendet üblicherweise den mittleren Frame; ohne HDR auf 0, mit HDR auf 1 setzen. Die abweichende S/M/L-Reihenfolge im Überblick bleibt als Quellenabweichung erhalten. |
| gamma_en | Gamma-Modul einschalten: 0 aus, 1 ein. |
| gaus_en | Fest auf 1 setzen. |
| v1_fir_sel | Fest auf 1 setzen. |
| hiir_en | H1/H2-Kanäle aktivieren: 0 aus, 1 ein. |
| viir_en | V1/V2-Kanäle aktivieren: 0 aus, 1 ein. Bei aktiviertem gamma_en muss viir_en auf 1 stehen. |
| v1_fv_outmode | FV-Ausgabemodus für V1: 0 quadriert, 1 Absolutwert. |
| v2_fv_outmode | FV-Ausgabemodus für V2: 0 quadriert, 1 Absolutwert. |
| ldg_en | LDG aktivieren: 0 aus, 1 ein. |
| accu_8bit_mode | Fest auf 1 setzen. |
| ae_mode | Bei ae_mode = 1 aktiviert RAWAF eine 15x15-Helligkeitsmittelwertstatistik unter Mitbenutzung der RAWAE_BIG-Logik. |
| y_mode | Fest auf 0 setzen. |
| sobel_sel | Fest auf 0 setzen. |
| v_dnscl_mode | Breit-/Schmalbandmodus gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs wählen. |
| from_awb | AF-Statistikeingang stammt von AWB. |
| from_ynr | AF-Statistikeingang stammt von YNR. |
| ae_config_use | Fest auf 0 konfigurieren. |
| line_en | Derzeit ohne Wirkung. |
| line_num | Derzeit ohne Wirkung. |
| window_num | Anzahl aktiver Fenster: 1 aktiviert WinA als Hauptfenster; 2 aktiviert wina als Hauptfenster und winb als unabhängiges Fenster. |
| wina_h_offs | Horizontale Koordinate des ersten Pixels oben links in WinA, mindestens 2. |
| wina_v_offs | Vertikale Koordinate des ersten Pixels oben links in wina, mindestens 1. |

<!-- Source EN PDF p.167; unit 2005 -->

| Feldname | Beschreibung |
|---|---|
| wina_h_size | Breite von Wina: kleiner als Bildbreite -2-wina_h_offs und ein Vielfaches von 15. |
| wina_v_size | Höhe von Wina: kleiner als Bildhöhe -2-wina_v_offs und ein Vielfaches von 15. |
| winb_h_offs | Horizontale Koordinate des ersten Pixels oben links in winb, mindestens 2. |
| winb_v_offs | Vertikale Koordinate des ersten Pixels oben links in winb, mindestens 1. |
| winb_h_size | Breite von winb: kleiner als Bildbreite -2-wina_h_offs. Die Quelle nennt hier trotz winb ausdrücklich wina_h_offs. |
| winb_v_size | Höhe von winb: kleiner als Bildhöhe -2-wina_v_offs. Die Quelle nennt hier trotz winb ausdrücklich wina_v_offs. |
| gamma_y | Y-Werte der Gammatabelle, Bereich 0-1023. X-Segmentierung von 0 bis 1023: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128. |
| thres | AF-Statistikschwelle für win b. Kleinere berechnete fv-Werte werden gegen Rauscheinfluss auf 0 gesetzt. Bereich 0-0xFFFF. |
| shift_sum_a | Derzeit nicht verfügbar, fest auf 0 setzen. |
| shift_y_a | Derzeit nicht verfügbar, fest auf 0 setzen. |
| v1_iir_coe[9] | 3X3-IIR-Koeffizient des V1-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| v1_fir_coe[3] | 1x3-FIR-Koeffizient des V1-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| v2_iir_coe[3] | 1x3-IIR-Koeffizient des V2-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| v2_fir_coe[3] | 1x3-FIR-Koeffizient des V2-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| h1_iir1_coe[6] | 1X6-IIR1-Koeffizient des H1-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| h2_iir1_coe[6] | 1X6-IIR1-Koeffizient des H2-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| h1_iir2_coe[6] | 1X6-IIR2-Koeffizient des H1-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |
| h2_iir2_coe[6] | 1X6-IIR2-Koeffizient des H2-Kanals gemäß Ausgabe des AF-Filterkoeffizientenwerkzeugs. |

<!-- Source EN PDF p.168; unit 2006 -->

| Feldname | Beschreibung |
|---|---|
| h_ldg_lumth[2] | LDG-Helligkeitsschwellen für H1/H2. Index 0: linker dunkler Bereich; 1: rechter heller Bereich. Bereich 0~255. |
| h_ldg_gain[2] | Minimale LDG-Verstärkung für H1/H2. Index 0: linker dunkler Bereich; 1: rechter heller Bereich. Bereich 0~255. |
| h_ldg_gslp[2] | LDG-Steigungskoeffizient für H1/H2. Index 0: linker dunkler Bereich; 1: rechter heller Bereich. Bereich 0~65535. |
| v_ldg_lumth[2] | LDG-Helligkeitsschwellen für V1/V2. Index 0: linker dunkler Bereich; 1: rechter heller Bereich. Bereich 0~255. |
| v_ldg_gain[2] | Minimale LDG-Verstärkung für V1/V2. Index 0: linker dunkler Bereich; 1: rechter heller Bereich. Bereich 0~255. |
| v_ldg_gslp[2] | Laut Quelle minimale LDG-Verstärkung für V1/V2, Index 0 für links/dunkel und 1 für rechts/hell, Bereich 0~255. Die abweichende Beschreibung und der Wertebereich dieses gslp-Felds bleiben unverändert dokumentiert. |
| v_fv_thresh | AF-Statistikschwelle für V1/V2. Kleinere berechnete fv-Werte werden gegen Rauscheinfluss auf 0 gesetzt. Bereich 0-0x0FFF. |
| h_fv_thresh | AF-Statistikschwelle für H1/H2. Kleinere berechnete fv-Werte werden gegen Rauscheinfluss auf 0 gesetzt. Bereich 0-0x0FFF. |
| v1_fv_shift | FV-Rechtsschiebung für V1, um Überlauf zu vermeiden. Bereich 0-7. Der offensichtliche Quellschreibfehler „shit bit“ ist als Schiebebit übersetzt. |
| v2_fv_shift | FV-Rechtsschiebung für V2, um Überlauf zu vermeiden. Bereich 0-7. Der Quellschreibfehler „shit bit“ bleibt dokumentiert. |
| h1_fv_shift | FV-Rechtsschiebung für H1, um Überlauf zu vermeiden. Bereich 0-7. Der Quellschreibfehler „shit bit“ bleibt dokumentiert. |
| h2_fv_shift | FV-Rechtsschiebung für H2, um Überlauf zu vermeiden. Bereich 0-7. Der Quellschreibfehler „shit bit“ bleibt dokumentiert. |
| highlit_thresh | Schwelle der Spitzlichtstatistik. Größere Werte gelten als Spitzlichter; je Bereich wird nur ihre Anzahl aufsummiert. Bereich 0-0x0FFF. |

<!-- Source EN PDF p.169; unit 2007 -->

#### 8.7.4  rk_aiq_af_attrib_t

<!-- Source EN PDF p.169; unit 2008 -->

【Beschreibung】 Fokuskonfigurationsinformationen.

<!-- Source EN PDF p.169; unit 2009 -->

【Definition】

<!-- Source EN PDF p.169; unit 2010 -->

```text
 typedef struct rk_aiq_af_attrib_s {
     rk_aiq_uapi_sync_t sync;
     RKAIQ_AF_MODE AfMode;
     RKAIQ_AF_HWVER AfHwVer;
     bool contrast_af;
     bool laser_af;
     bool pdaf;
     int h_offs;
     int v_offs;
     unsigned int h_size;
     unsigned int v_size;
     short fixedModeDefCode;
     short macroModeDefCode;
     short infinityModeDefCode;
     union {
         rk_aiq_af_algo_meas_v20_t manual_meascfg;
         rk_aiq_af_algo_meas_v30_t manual_meascfg_v30;
     };
 } rk_aiq_af_attrib_t;
```

<!-- Source EN PDF p.169; unit 2011 -->

【Felder】

<!-- Source EN PDF p.170; unit 2012 -->

| Feldname | Beschreibung |
|---|---|
| sync | Für synchrone/asynchrone APIs siehe rk_aiq_uapi_sync_t im Überblick beziehungsweise in der API-Beschreibung. |
| AfMode | Fokusmodus |
| contrast_af | Kontrastfokus aktivieren. |
| laser_af | Laserfokus aktivieren. |
| pdaf | Phasenfokus aktivieren. |
| h_offs | Horizontale Anfangskoordinate des Fokusfensters. |
| v_offs | Vertikale Anfangskoordinate des Fokusfensters. |
| h_size | Fokusfensterbreite |
| v_size | Fokusfensterhöhe |
| fixedModeDefCode | Fokuscodewert |
| macroModeDefCode | Endcode im Makrofokusmodus ist laut Quelle 0-value; die ursprüngliche Angabe bleibt erhalten. |
| infinityModeDefCode | Anfangscode im Fernfokusmodus mit Fokusbereich -64; die ursprüngliche Angabe bleibt erhalten. |
| manual_meascfg | Benutzerdefinierte AF2.0-Fokusstatistikkonfiguration. |
| manual_meascfg_v30 | Benutzerdefinierte AF3.0-Fokusstatistikkonfiguration. |

<!-- Source EN PDF p.170; unit 2013 -->

### 8.8   Ergänzende Hinweise

<!-- Source EN PDF p.170; unit 2014 -->

#### 8.8.1  VCM-Motormodultreiber prüfen

<!-- Source EN PDF p.170; unit 2015 -->

1\. Prüfen, ob Anfangs- und Endstrom des VCM-Treibers korrekt eingestellt sind.

<!-- Source EN PDF p.170; unit 2016 -->

Zunächst die Angaben zu Anfangs- und Endstrom vom Modulhersteller einholen.

<!-- Source EN PDF p.170; unit 2017 -->

Anschließend einige Module auswählen und die Angaben wie folgt prüfen:

<!-- Source EN PDF p.170; unit 2018 -->

Im DTS Anfangs- und Endstrom auf den maximal vom VCM unterstützten Bereich setzen.

<!-- Source EN PDF p.170; unit 2019 -->

Auf manuellen Fokus wechseln und die VCM-Position schrittweise ab 64 ändern. Sobald das Objektiv sich bewegt und ein fernes Objekt über 10 Meter scharf ist, die aktuelle Position notieren.

<!-- Source EN PDF p.170; unit 2020 -->

Der Anfangsstrom beträgt (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2021 -->

VCM weiter bewegen. Sobald ein nahes Objekt bei 10cm oder 20cm scharf erscheint, die aktuelle Position notieren.

<!-- Source EN PDF p.170; unit 2022 -->

Der Endstrom beträgt (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2023 -->

2\. Prüfen, ob die Endposition bei Bewegung aus verschiedenen Richtungen stabil ist.

<!-- Source EN PDF p.171; unit 2024 -->

Im manuellen Fokusmodus eine Zielposition wählen. Einmal von 0, einmal von 64 dorthin bewegen. Bildschärfe und AF-Statistik beider Ergebnisse vergleichen.

<!-- Source EN PDF p.171; unit 2025 -->

3\. Prüfen, ob die benötigte Objektivbewegungszeit korrekt ist.

<!-- Source EN PDF p.171; unit 2026 -->

#### 8.8.2  Elektromotormodultreiber prüfen

<!-- Source EN PDF p.171; unit 2027 -->

1\. Prüfen, ob mehrere Einzelschritte und eine mehrschrittige Bewegung an derselben Position enden.

<!-- Source EN PDF p.171; unit 2028 -->

1\. Zunächst eine Zoom-/Fokusmotorposition mit maximaler Bildschärfe wählen, die Position notieren und Bild A aufnehmen.

<!-- Source EN PDF p.171; unit 2029 -->

2\. Zoom- oder Fokusmotor um einige Schritte zurückfahren und dann in Einzelschritten zur notierten Position bewegen. Bild B aufnehmen.

<!-- Source EN PDF p.171; unit 2030 -->

3\. Erneut um einige Schritte zurückfahren, die notierte Position mit einer einzigen Bewegung anfahren und Bild C aufnehmen.

<!-- Source EN PDF p.171; unit 2031 -->

4\. Schärfe und Sichtfeld von A, B und C auf Übereinstimmung prüfen.

<!-- Source EN PDF p.171; unit 2032 -->

2\. Prüfen, ob zufällige Motorbewegungen an derselben Zielposition enden.

<!-- Source EN PDF p.171; unit 2033 -->

1\. Zunächst eine Zoom-/Fokusmotorposition mit maximaler Bildschärfe wählen, die Position notieren und Bild A aufnehmen.

<!-- Source EN PDF p.171; unit 2034 -->

2\. Zoom- oder Fokusmotor per Skript 400 bis 500 zufällige Bewegungen ausführen lassen, zur ursprünglichen Position zurückkehren und Bild B aufnehmen.

<!-- Source EN PDF p.171; unit 2035 -->

3\. Bild A und B auf gleiche Schärfe und gleiches Sichtfeld prüfen.

<!-- Source EN PDF p.171; unit 2036 -->

3\. Prüfen, ob gleichzeitig bewegte Motoren dieselbe Endposition erreichen.

<!-- Source EN PDF p.171; unit 2037 -->

1\. Zunächst eine Zoom-/Fokusmotorposition mit maximaler Bildschärfe wählen, die Position notieren und Bild A aufnehmen.

<!-- Source EN PDF p.171; unit 2038 -->

2\. Zoom- und Fokusmotor per Skript gleichzeitig 400 bis 500 zufällige Bewegungen ausführen lassen, zur ursprünglichen Position zurückkehren und Bild B aufnehmen.

<!-- Source EN PDF p.171; unit 2039 -->

3\. Bild A und B auf gleiche Schärfe und gleiches Sichtfeld prüfen.

<!-- Source EN PDF p.171; unit 2040 -->

## 9.   IMGPROC

<!-- Source EN PDF p.171; unit 2041 -->

### 9.1   Überblick

<!-- Source EN PDF p.171; unit 2042 -->

imgproc bezeichnet die Module, die die Bildwirkung beeinflussen.

<!-- Source EN PDF p.172; unit 2043 -->

### 9.2   Merge

<!-- Source EN PDF p.172; unit 2044 -->

#### 9.2.1  Funktionsbeschreibung

<!-- Source EN PDF p.172; unit 2045 -->

Merge führt mehrere Bildframes zu einem einzelnen Frame zusammen.

<!-- Source EN PDF p.172; unit 2046 -->

#### 9.2.2  Wichtige Begriffe

<!-- Source EN PDF p.172; unit 2047 -->

Wirkt ausschließlich im HDR-Modus.

<!-- Source EN PDF p.172; unit 2048 -->

#### 9.2.3  Funktionsbezogene API-Referenz

<!-- Source EN PDF p.172; unit 2049 -->

#### 9.2.4  Modulbezogene API-Referenz

<!-- Source EN PDF p.172; unit 2050 -->

9.2.4.1  rk_aiq_user_api2_amerge_SetAttrib

<!-- Source EN PDF p.172; unit 2051 -->

【Beschreibung】 Merge-Eigenschaften einstellen.

<!-- Source EN PDF p.172; unit 2052 -->

【Syntax】

<!-- Source EN PDF p.172; unit 2053 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t attr);
```

<!-- Source EN PDF p.172; unit 2054 -->

【Parameter】

<!-- Source EN PDF p.172; unit 2055 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften von Merge | Eingabe |

<!-- Source EN PDF p.172; unit 2056 -->

【Rückgabewert】

<!-- Source EN PDF p.172; unit 2057 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.172; unit 2058 -->

【Voraussetzungen】

<!-- Source EN PDF p.172; unit 2059 -->

Headerdatei: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.172; unit 2060 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.173; unit 2061 -->

9.2.4.2  rk_aiq_user_api2_amerge_GetAttrib

<!-- Source EN PDF p.173; unit 2062 -->

【Beschreibung】 Merge-Eigenschaften abfragen.

<!-- Source EN PDF p.173; unit 2063 -->

【Syntax】

<!-- Source EN PDF p.173; unit 2064 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t* attr);
```

<!-- Source EN PDF p.173; unit 2065 -->

【Parameter】

<!-- Source EN PDF p.173; unit 2066 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften von Merge | Ausgabe |

<!-- Source EN PDF p.173; unit 2067 -->

【Rückgabewert】

<!-- Source EN PDF p.173; unit 2068 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.173; unit 2069 -->

【Voraussetzungen】

<!-- Source EN PDF p.173; unit 2070 -->

Headerdatei: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.173; unit 2071 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.173; unit 2072 -->

#### 9.2.5  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.173; unit 2073 -->

9.2.5.1  merge_OpMode_t

<!-- Source EN PDF p.173; unit 2074 -->

【Beschreibung】 Merge-Betriebsmodus definieren.

<!-- Source EN PDF p.173; unit 2075 -->

【Definition】

<!-- Source EN PDF p.173; unit 2076 -->

```text
 typedef enum merge_OpModeV21_e {
     MERGE_OPMODE_API_OFF = 0,
     MERGE_OPMODE_MANU    = 1,
 } merge_OpModeV21_t;
```

<!-- Source EN PDF p.173; unit 2077 -->

【Felder】

<!-- Source EN PDF p.174; unit 2078 -->

| Feldname | Beschreibung |
|---|---|
| MERGE_OPMODE_API_OFF | API ausgeschaltet; der Algorithmus arbeitet im AUTO-Modus unter Verwendung des Parameters. Die Quelle beendet die Angabe nach „parameter“. |
| MERGE_OPMODE_MANU | Manueller Modus |

<!-- Source EN PDF p.174; unit 2079 -->

9.2.5.2  MergeBaseFrame_t

<!-- Source EN PDF p.174; unit 2080 -->

【Beschreibung】 Referenzframe-Eigenschaften beim Zusammenführen definieren.

<!-- Source EN PDF p.174; unit 2081 -->

【Definition】

<!-- Source EN PDF p.174; unit 2082 -->

```text
 typedef enum MergeBaseFrame_e {
     BASEFRAME_LONG  = 0,
     BASEFRAME_SHORT = 1,
 } MergeBaseFrame_t;
```

<!-- Source EN PDF p.174; unit 2083 -->

【Felder】

<!-- Source EN PDF p.174; unit 2084 -->

| Feldname | Beschreibung |
|---|---|
| BASEFRAME_LONG | Beim Zusammenführen dienen lange Frames als Referenz. |
| BASEFRAME_SHORT | Beim Zusammenführen dienen kurze Frames als Referenz. |

<!-- Source EN PDF p.174; unit 2085 -->

9.2.5.3  MergeCurrCtlData_t

<!-- Source EN PDF p.174; unit 2086 -->

【Beschreibung】 Merge-Steuerparameter definieren.

<!-- Source EN PDF p.174; unit 2087 -->

【Definition】

<!-- Source EN PDF p.174; unit 2088 -->

```text
 typedef struct MergeCurrCtlData_s {
     float Envlv;
     float MoveCoef;
 } MergeCurrCtlData_t;
```

<!-- Source EN PDF p.174; unit 2089 -->

【Felder】

<!-- Source EN PDF p.174; unit 2090 -->

| Feldname | Beschreibung |
|---|---|
| Envlv | Aktuelle Umgebungshelligkeit; die Quelle nennt wörtlich „ranges from 0,1 to 0.000001“. Die widersprüchliche Bereichsangabe bleibt unverändert dokumentiert. |
| MoveCoef | Aktueller Bewegungskoeffizient, Bereich [0,1], Genauigkeit 0.000001; der Wert ist vorläufig fest. |

<!-- Source EN PDF p.175; unit 2091 -->

9.2.5.4  mMergeOECurveV21_t

<!-- Source EN PDF p.175; unit 2092 -->

【Beschreibung】 Eigenschaften der manuellen Merge-Überbelichtungskurve definieren.

<!-- Source EN PDF p.175; unit 2093 -->

【Definition】

<!-- Source EN PDF p.175; unit 2094 -->

```text
 typedef struct mMergeOECurveV21_s {
     float Smooth;
     float Offset;
 } mMergeOECurveV21_t;
```

<!-- Source EN PDF p.175; unit 2095 -->

【Felder】

<!-- Source EN PDF p.175; unit 2096 -->

| Feldname | Beschreibung |
|---|---|
| Smooth | Steigung der Überbelichtungskurve, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. |
| Offset | Versatz der Überbelichtungskurve, Bereich [108,280], Standard 210, Genauigkeit 0.1. |

<!-- Source EN PDF p.175; unit 2097 -->

9.2.5.5  mMergeMDCurveV21_t

<!-- Source EN PDF p.175; unit 2098 -->

【Beschreibung】 Bewegungskurveneigenschaften im Langframe-Modus definieren.

<!-- Source EN PDF p.175; unit 2099 -->

【Definition】

<!-- Source EN PDF p.175; unit 2100 -->

```text
 typedef struct mMergeMDCurveV21_s {
     float LM_smooth;
     float LM_offset;
     float MS_smooth;
     float MS_offset;
 } mMergeMDCurveV21_t;
```

<!-- Source EN PDF p.175; unit 2101 -->

【Felder】

<!-- Source EN PDF p.176; unit 2102 -->

| Feldname | Beschreibung |
|---|---|
| LM_smooth | Steigung der Bewegungskurve zwischen langem und mittlerem Frame, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. Auf RK356x ohne Wirkung. |
| LM_offset | Versatz der Bewegungskurve zwischen langem und mittlerem Frame, Bereich [0.26,1], Standard 0.38, Genauigkeit 0.01. Auf RK356x ohne Wirkung. |
| MS_smooth | Steigung der Bewegungskurve zwischen mittlerem und kurzem Frame, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. |
| MS_offset | Versatz der Bewegungskurve zwischen mittlerem und kurzem Frame, Bereich [0.26,1], Standard 0.38, Genauigkeit 0.01. |

<!-- Source EN PDF p.176; unit 2103 -->

9.2.5.6  mMergeAttrV21_t

<!-- Source EN PDF p.176; unit 2104 -->

【Beschreibung】 Manuelle Merge-Eigenschaften für RK3588 definieren.

<!-- Source EN PDF p.176; unit 2105 -->

【Definition】

<!-- Source EN PDF p.176; unit 2106 -->

```text
 typedef struct mMergeAttrV21_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mMergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2107 -->

【Felder】

<!-- Source EN PDF p.176; unit 2108 -->

| Feldname | Beschreibung |
|---|---|
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter des Bewegungsprofils |

<!-- Source EN PDF p.176; unit 2109 -->

9.2.5.7  mergeAttrV21_t

<!-- Source EN PDF p.176; unit 2110 -->

【Beschreibung】 Merge-Eigenschaften auf RK356x konfigurieren.

<!-- Source EN PDF p.176; unit 2111 -->

【Definition】

<!-- Source EN PDF p.176; unit 2112 -->

```text
 typedef struct mergeAttrV21_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV21_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2113 -->

【Felder】

<!-- Source EN PDF p.177; unit 2114 -->

| Feldname | Beschreibung |
|---|---|
| opMode | Modusauswahl |
| stManual | Manuelle Merge-Eigenschaften |
| CtlInfo | Steuergrößenparameter |

<!-- Source EN PDF p.177; unit 2115 -->

9.2.5.8  mLongFrameModeData_t

<!-- Source EN PDF p.177; unit 2116 -->

【Beschreibung】 Steuerparameter im Langframe-Modus definieren.

<!-- Source EN PDF p.177; unit 2117 -->

【Definition】

<!-- Source EN PDF p.177; unit 2118 -->

```text
 typedef struct mLongFrameModeData_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mLongFrameModeData_t;
```

<!-- Source EN PDF p.177; unit 2119 -->

【Felder】

<!-- Source EN PDF p.177; unit 2120 -->

| Feldname | Beschreibung |
|---|---|
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter des Bewegungsprofils |

<!-- Source EN PDF p.177; unit 2121 -->

9.2.5.9  mMergeMDCurveV30Short_t

<!-- Source EN PDF p.177; unit 2122 -->

【Beschreibung】 Bewegungskurveneigenschaften im Kurzframe-Modus definieren.

<!-- Source EN PDF p.177; unit 2123 -->

【Definition】

<!-- Source EN PDF p.177; unit 2124 -->

```text
 typedef struct mMergeMDCurveV30Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } mMergeMDCurveV30Short_t;
```

<!-- Source EN PDF p.177; unit 2125 -->

【Felder】

<!-- Source EN PDF p.178; unit 2126 -->

| Feldname | Beschreibung |
|---|---|
| Coef | Steuerkoeffizient, Bereich [0,1], Standard 0.05, Genauigkeit 0.0001. |
| ms_thd0 | Steuerkoeffizient für mittlere und kurze Frames, Bereich [0,1], Standard 0.0, Genauigkeit 0.1. |
| lm_thd0 | Steuerkoeffizient für lange und mittlere Frames, Bereich [0,1], Standard 0.0, Genauigkeit 0.1. |

<!-- Source EN PDF p.178; unit 2127 -->

9.2.5.10  mShortFrameModeData_t

<!-- Source EN PDF p.178; unit 2128 -->

【Beschreibung】 Steuerparameter im Kurzframe-Modus definieren.

<!-- Source EN PDF p.178; unit 2129 -->

【Definition】

<!-- Source EN PDF p.178; unit 2130 -->

```text
 typedef struct mShortFrameModeData_s {
     mMergeOECurveV21_t      OECurve;
     mMergeMDCurveV30Short_t MDCurve;
 } mShortFrameModeData_t;
```

<!-- Source EN PDF p.178; unit 2131 -->

【Felder】

<!-- Source EN PDF p.178; unit 2132 -->

| Feldname | Beschreibung |
|---|---|
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter des Bewegungsprofils |

<!-- Source EN PDF p.178; unit 2133 -->

9.2.5.11  mMergeAttrV30_t

<!-- Source EN PDF p.178; unit 2134 -->

【Beschreibung】 Manuelle Merge-Eigenschaften für RK3588 definieren.

<!-- Source EN PDF p.178; unit 2135 -->

【Definition】

<!-- Source EN PDF p.178; unit 2136 -->

```text
 typedef struct mMergeAttrV30_s {
     MergeBaseFrame_t      BaseFrm;
     mLongFrameModeData_t  LongFrmModeData;
     mShortFrameModeData_t ShortFrmModeData;
 } mMergeAttrV30_t;
```

<!-- Source EN PDF p.178; unit 2137 -->

【Felder】

<!-- Source EN PDF p.178; unit 2138 -->

| Feldname | Beschreibung |
|---|---|
| BaseFrm | Referenzframe beim Zusammenführen |
| LongFrmModeData | Steuerdaten, wenn ein langer Frame als Referenz dient. |

<!-- Source EN PDF p.179; unit 2139 -->

9.2.5.12  MergeOECurveV10_t

<!-- Source EN PDF p.179; unit 2140 -->

【Beschreibung】 Automatische Merge-Überbelichtungskurve definieren.

<!-- Source EN PDF p.179; unit 2141 -->

【Definition】

<!-- Source EN PDF p.179; unit 2142 -->

```text
 typedef struct MergeOECurveV10_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeOECurveV10_t;
```

<!-- Source EN PDF p.179; unit 2143 -->

【Felder】

<!-- Source EN PDF p.179; unit 2144 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Umgebungshelligkeit, Bereich [0,1]: 0 vollständig schwarz, 1 am hellsten. |
| Smooth | Steigung der Überbelichtungskurve, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. |
| Offset | Versatz der Überbelichtungskurve, Bereich [108,280], Standard 210, Genauigkeit 0.1. |

<!-- Source EN PDF p.179; unit 2145 -->

9.2.5.13  MergeMDCurveV10_t

<!-- Source EN PDF p.179; unit 2146 -->

【Beschreibung】 Bewegungskurveneigenschaften im Langframe-Modus definieren.

<!-- Source EN PDF p.179; unit 2147 -->

【Definition】

<!-- Source EN PDF p.179; unit 2148 -->

```text
 typedef struct MergeMDCurveV10_s {
     float MoveCoef[MERGE_ENVLV_STEP_MAX];
     float LM_smooth[MERGE_ENVLV_STEP_MAX];
     float LM_offset[MERGE_ENVLV_STEP_MAX];
     float MS_smooth[MERGE_ENVLV_STEP_MAX];
     float MS_offset[MERGE_ENVLV_STEP_MAX];
 } MergeMDCurveV10_t;
```

<!-- Source EN PDF p.179; unit 2149 -->

【Felder】

<!-- Source EN PDF p.180; unit 2150 -->

| Feldname | Beschreibung |
|---|---|
| MoveCoef | Bewegungsgrad des Bilds, Bereich [0,1]: 0 vollständig still, 1 volle Bewegung. |
| LM_smooth | Steigung der Bewegungskurve zwischen langem und mittlerem Frame, Bereich [0,1], Standard 0.4. Im HDR-x2-Modus ohne Wirkung. |
| LM_offset | Versatz der Bewegungskurve zwischen langem und mittlerem Frame, Bereich [0.26,1], Standard 0.38. Im HDR-x2-Modus ohne Wirkung. |
| MS_smooth | Steigung der Bewegungskurve zwischen mittlerem und kurzem Frame, Bereich [0,1], Standard 0.4. |
| MS_offset | Versatz der Bewegungskurve zwischen mittlerem und kurzem Frame, Bereich [0.26,1], Standard 0.38. |

<!-- Source EN PDF p.180; unit 2151 -->

9.2.5.14  MergeEachChnCurveV12_t

<!-- Source EN PDF p.180; unit 2152 -->

【Beschreibung】 Unterkanal-Erkennungskurve im Langframe-Modus definieren.

<!-- Source EN PDF p.180; unit 2153 -->

【Definition】

<!-- Source EN PDF p.180; unit 2154 -->

```text
 typedef struct MergeEachChnCurveV12_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeEachChnCurveV12_t;
```

<!-- Source EN PDF p.180; unit 2155 -->

【Felder】

<!-- Source EN PDF p.180; unit 2156 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Umgebungshelligkeit, Bereich [0,1]: 0 vollständig schwarz, 1 am hellsten. |
| Smooth | Steigung der Unterkanal-Überbelichtungskurve, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. |
| Offset | Versatz der Unterkanal-Überbelichtungskurve, Bereich [0,1], Standard 0.38, Genauigkeit 0.01. |

<!-- Source EN PDF p.180; unit 2157 -->

9.2.5.15  LongFrameModeDataV12_t

<!-- Source EN PDF p.180; unit 2158 -->

【Beschreibung】 Steuerparameter im Langframe-Modus definieren.

<!-- Source EN PDF p.180; unit 2159 -->

【Definition】

<!-- Source EN PDF p.181; unit 2160 -->

```text
 typedef struct LongFrameModeDataV12_s {
     bool                   EnableEachChn;
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV10_t      MDCurve;
     MergeEachChnCurveV12_t EachChnCurve;
     float                  OECurve_damp;
     float                  MDCurveLM_damp;
     float                  MDCurveMS_damp;
 } LongFrameModeDataV12_t;
```

<!-- Source EN PDF p.181; unit 2161 -->

【Felder】

<!-- Source EN PDF p.181; unit 2162 -->

| Feldname | Beschreibung |
|---|---|
| EnableEachChn | Schalter für getrennte Kanalerkennung |
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter des Bewegungsprofils |
| EachChnCurve | Kurvenparameter der getrennten Kanalerkennung |
| MDCurveLM_damp | Glättungskoeffizient für Änderungen der Bewegungskurve zwischen langem und mittlerem Frame: Anteil des aktuellen Frameparameters, Bereich [0,1], Standard 0.9. Im HDR-x2-Modus ohne Wirkung. |
| MDCurveMS_damp | Glättungskoeffizient für Änderungen der Bewegungskurve zwischen mittlerem und kurzem Frame: Anteil des aktuellen Frameparameters, Bereich [0,1], Standard 0.9. |

<!-- Source EN PDF p.181; unit 2163 -->

9.2.5.16  MergeMDCurveV11Short_t

<!-- Source EN PDF p.181; unit 2164 -->

【Beschreibung】 Bewegungskurveneigenschaften im Kurzframe-Modus definieren.

<!-- Source EN PDF p.181; unit 2165 -->

【Definition】

<!-- Source EN PDF p.181; unit 2166 -->

```text
 typedef struct MergeMDCurveV11Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } MergeMDCurveV11Short_t;
```

<!-- Source EN PDF p.181; unit 2167 -->

【Felder】

<!-- Source EN PDF p.182; unit 2168 -->

| Feldname | Beschreibung |
|---|---|
| Coef | Steuerkoeffizient, Bereich [0,1], Standard 0.05, Genauigkeit 0.0001. |
| ms_thd0 | Steuerkoeffizient für mittlere und kurze Frames, Bereich [0,1], Standard 0.0, Genauigkeit 0.1. |
| lm_thd0 | Steuerkoeffizient für lange und mittlere Frames, Bereich [0,1], Standard 0.0, Genauigkeit 0.1. |

<!-- Source EN PDF p.182; unit 2169 -->

9.2.5.17  ShortFrameModeData_t

<!-- Source EN PDF p.182; unit 2170 -->

【Beschreibung】 Steuerparameter im Kurzframe-Modus definieren.

<!-- Source EN PDF p.182; unit 2171 -->

【Definition】

<!-- Source EN PDF p.182; unit 2172 -->

```text
 typedef struct ShortFrameModeData_s {
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV11Short_t MDCurve;
     float                  OECurve_damp;
     float                  MDCurve_damp;
 } ShortFrameModeData_t;
```

<!-- Source EN PDF p.182; unit 2173 -->

【Felder】

<!-- Source EN PDF p.182; unit 2174 -->

| Feldname | Beschreibung |
|---|---|
| OECurve | Parameter der Überbelichtungskurve |
| MDCurve | Parameter des Bewegungsprofils |
| OECurve_damp | Glättungskoeffizient für Änderungen der Überbelichtungskurve: Anteil des aktuellen Frameparameters, Bereich [0,1], Standard 0.9. |
| MDCurve_damp | Glättungskoeffizient für Änderungen der Bewegungskurve: Anteil des aktuellen Frameparameters, Bereich [0,1], Standard 0.9. |

<!-- Source EN PDF p.182; unit 2175 -->

9.2.5.18  CalibDbV2_merge_V12_t

<!-- Source EN PDF p.182; unit 2176 -->

【Beschreibung】 Automatische Merge-Eigenschaften definieren.

<!-- Source EN PDF p.182; unit 2177 -->

【Definition】

<!-- Source EN PDF p.183; unit 2178 -->

```text
 typedef struct CalibDbV2_merge_V12_s {
     MergeBaseFrame_t       BaseFrm;
     float                  ByPassThr;
     LongFrameModeDataV12_t LongFrmModeData;
     ShortFrameModeData_t   ShortFrmModeData;
 } CalibDbV2_merge_V12_t;
```

<!-- Source EN PDF p.183; unit 2179 -->

【Felder】

<!-- Source EN PDF p.183; unit 2180 -->

| Feldname | Beschreibung |
|---|---|
| BaseFrm | Referenzframe beim Zusammenführen |
| ByPassThr | Bypass-Schwelle des aktuellen Moduls, Bereich [0,1]. Ist die prozentuale Differenz zwischen aktueller Umgebungshelligkeit und der des vorherigen Frames kleiner als ByPassThr, werden die Modulparameter nicht aktualisiert. |
| LongFrmModeData | Steuerdaten, wenn ein langer Frame als Referenz dient. |

<!-- Source EN PDF p.183; unit 2181 -->

9.2.5.19  MergeCurrCtlData_t

<!-- Source EN PDF p.183; unit 2182 -->

【Beschreibung】 Merge-Eigenschaften auf RK3588 konfigurieren.

<!-- Source EN PDF p.183; unit 2183 -->

【Definition】

<!-- Source EN PDF p.183; unit 2184 -->

```text
 typedef struct mergeAttrV30_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV30_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV30_t;
```

<!-- Source EN PDF p.183; unit 2185 -->

【Felder】

<!-- Source EN PDF p.183; unit 2186 -->

| Feldname | Beschreibung |
|---|---|
| opMode | Modusauswahl |
| stManual | Manuelle Merge-Eigenschaften |
| CtlInfo | Steuergrößenparameter |

<!-- Source EN PDF p.183; unit 2187 -->

9.2.5.20  mergeAttr_t

<!-- Source EN PDF p.183; unit 2188 -->

【Beschreibung】 Merge-Eigenschaften konfigurieren.

<!-- Source EN PDF p.183; unit 2189 -->

【Definition】

<!-- Source EN PDF p.184; unit 2190 -->

```text
 typedef struct mergeAttr_s {
     rk_aiq_uapi_sync_t  sync;
     mergeAttrV21_t      attrV21;
     mergeAttrV30_t      attrV30;
 } mergeAttr_t;
```

<!-- Source EN PDF p.184; unit 2191 -->

【Felder】

<!-- Source EN PDF p.184; unit 2192 -->

| Feldname | Beschreibung |
|---|---|
| sync | Für die Definition von rk_aiq_uapi_sync_t siehe Überblick/API-Beschreibung. |
| attrV21 | Merge-Eigenschaften für RK356x; auf RK3588 ohne Wirkung. |
| attrV30 | Merge-Eigenschaften für RK3588; auf RK356x ohne Wirkung. |

<!-- Source EN PDF p.184; unit 2193 -->

### 9.3   DRC

<!-- Source EN PDF p.184; unit 2194 -->

#### 9.3.1  Funktionsbeschreibung

<!-- Source EN PDF p.184; unit 2195 -->

DRC (High Dynamic Range Compression) komprimiert Bilder mit hoher Bittiefe in Bilder mit niedriger Bittiefe.

<!-- Source EN PDF p.184; unit 2196 -->

#### 9.3.2  Wichtige Begriffe

<!-- Source EN PDF p.184; unit 2197 -->

DRC ist sowohl im Linear- als auch im HDR-Modus nutzbar.

<!-- Source EN PDF p.184; unit 2198 -->

#### 9.3.3  Funktionsbezogene API-Referenz

<!-- Source EN PDF p.184; unit 2199 -->

9.3.3.1  rk_aiq_uapi2_setDrcGain

<!-- Source EN PDF p.184; unit 2200 -->

【Beschreibung】

<!-- Source EN PDF p.184; unit 2201 -->

Parameter der DrcGain-Kurve schnell einstellen.

<!-- Source EN PDF p.184; unit 2202 -->

【Syntax】

<!-- Source EN PDF p.184; unit 2203 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

Der API-Modus ist dabei DRC_OPMODE_DRC_GAIN. Der Aufruf speichert die Parameter in stDrcGain; dieses bestimmt die drei Parameter der DrcGain-Kurve. Die übrigen DRC-Parameter werden weiterhin vom DRC-Modul der JSON-Datei bestimmt.

<!-- Source EN PDF p.184; unit 2204 -->

【Parameter】

<!-- Source EN PDF p.185; unit 2205 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| Gain | Gain-Wert, Bereich [1,8] | Eingabe |
| Alpha | Alpha-Wert, Bereich [0,1] | Eingabe |
| Clip | Clip-Wert, Bereich [0,64] | Eingabe |

<!-- Source EN PDF p.185; unit 2206 -->

【Rückgabewert】

<!-- Source EN PDF p.185; unit 2207 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.185; unit 2208 -->

【Voraussetzungen】

<!-- Source EN PDF p.185; unit 2209 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.185; unit 2210 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.185; unit 2211 -->

9.3.3.2  rk_aiq_uapi2_getDrcGain

<!-- Source EN PDF p.185; unit 2212 -->

【Beschreibung】

<!-- Source EN PDF p.185; unit 2213 -->

Parameter der schnellen DrcGain-Kurve abfragen.

<!-- Source EN PDF p.185; unit 2214 -->

Die API liefert die Werte aus stDrcGain. Nur im API-Modus DRC_OPMODE_DRC_GAIN entsprechen sie den tatsächlich verwendeten aktuellen Parametern.

<!-- Source EN PDF p.185; unit 2215 -->

【Syntax】

<!-- Source EN PDF p.185; unit 2216 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

<!-- Source EN PDF p.185; unit 2217 -->

【Parameter】

<!-- Source EN PDF p.186; unit 2218 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| Gain | Gain-Wert, Bereich [1,8] | Ausgabe |
| Alpha | Alpha-Wert, Bereich [0,1] | Ausgabe |
| Clip | Clip-Wert, Bereich [0,64] | Ausgabe |

<!-- Source EN PDF p.186; unit 2219 -->

【Rückgabewert】

<!-- Source EN PDF p.186; unit 2220 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.186; unit 2221 -->

【Voraussetzungen】

<!-- Source EN PDF p.186; unit 2222 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.186; unit 2223 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.186; unit 2224 -->

9.3.3.3  rk_aiq_uapi2_setDrcHiLit

<!-- Source EN PDF p.186; unit 2225 -->

【Beschreibung】

<!-- Source EN PDF p.186; unit 2226 -->

DrcHiLit-Parameter schnell einstellen.

<!-- Source EN PDF p.186; unit 2227 -->

Dabei gilt DRC_OPMODE_HILIT. Der API-Aufruf speichert die Werte in stHiLit, das die HiLight-Parameter bestimmt. Alle übrigen DRC-Parameter stammen weiterhin aus dem DRC-Modul der JSON-Datei.

<!-- Source EN PDF p.186; unit 2228 -->

【Syntax】

<!-- Source EN PDF p.186; unit 2229 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.186; unit 2230 -->

【Parameter】

<!-- Source EN PDF p.186; unit 2231 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| Strength | Stärke, Bereich [0,1] | Eingabe |

<!-- Source EN PDF p.186; unit 2232 -->

【Rückgabewert】

<!-- Source EN PDF p.187; unit 2233 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.187; unit 2234 -->

【Voraussetzungen】

<!-- Source EN PDF p.187; unit 2235 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2236 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.187; unit 2237 -->

9.3.3.4  rk_aiq_uapi2_getDrcHiLit

<!-- Source EN PDF p.187; unit 2238 -->

【Beschreibung】

<!-- Source EN PDF p.187; unit 2239 -->

Parameter der schnellen DrcHiLit-Konfiguration abfragen.

<!-- Source EN PDF p.187; unit 2240 -->

Die API liefert DrcHiLit-Werte aus stHiLit. Nur im API-Modus DRC_OPMODE_HILIT sind dies die tatsächlich verwendeten Parameter.

<!-- Source EN PDF p.187; unit 2241 -->

【Syntax】

<!-- Source EN PDF p.187; unit 2242 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.187; unit 2243 -->

【Parameter】

<!-- Source EN PDF p.187; unit 2244 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| Strength | Stärke, Bereich [0,1] | Ausgabe |

<!-- Source EN PDF p.187; unit 2245 -->

【Rückgabewert】

<!-- Source EN PDF p.187; unit 2246 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.187; unit 2247 -->

【Voraussetzungen】

<!-- Source EN PDF p.187; unit 2248 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2249 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.187; unit 2250 -->

9.3.3.5  rk_aiq_uapi2_setDrcLocalData

<!-- Source EN PDF p.187; unit 2251 -->

【Beschreibung】

<!-- Source EN PDF p.187; unit 2252 -->

DrcLocalData-Parameter schnell einstellen.

<!-- Source EN PDF p.188; unit 2253 -->

Dabei gilt DRC_OPMODE_LOCAL_TMO. Der Aufruf speichert die Parameter in stLocalDataV30, das LocalData bestimmt. Die übrigen DRC-Parameter stammen weiterhin aus dem DRC-Modul der JSON-Datei.

<!-- Source EN PDF p.188; unit 2254 -->

【Syntax】

<!-- Source EN PDF p.188; unit 2255 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float
 LocalWeit, float GlobalContrast, float LoLitContrast，int LocalAutoEnable, float
 LocalAutoWeit);
```

<!-- Source EN PDF p.188; unit 2256 -->

【Parameter】

<!-- Source EN PDF p.188; unit 2257 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| LocalWeit | LocalWeit-Wert, Bereich [0,1] | Eingabe |
| GlobalContrast | GlobalContrast-Wert, Bereich [0,1] | Eingabe |
| LoLitContrast | LoLitContrast-Wert, Bereich [0,1] | Eingabe |
| LocalAutoEnable | Automatischer Local-Schalter, Bereich [0,1] | Eingabe |
| LocalAutoWeit | Automatischer LocalWeit-Wert, Bereich [0,1] | Eingabe |

<!-- Source EN PDF p.188; unit 2258 -->

【Rückgabewert】

<!-- Source EN PDF p.188; unit 2259 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.188; unit 2260 -->

【Voraussetzungen】

<!-- Source EN PDF p.188; unit 2261 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.188; unit 2262 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.188; unit 2263 -->

9.3.3.6  rk_aiq_uapi2_getDrcLocalData

<!-- Source EN PDF p.188; unit 2264 -->

【Beschreibung】

<!-- Source EN PDF p.188; unit 2265 -->

Zugehörige DrcLocalData-Parameter abfragen.

<!-- Source EN PDF p.188; unit 2266 -->

Die API liefert LocalData-Werte aus stLocalDataV30. Sie werden nur bei DRC_OPMODE_LOCAL_TMO verwendet.

<!-- Source EN PDF p.189; unit 2267 -->

【Syntax】

<!-- Source EN PDF p.189; unit 2268 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float*
 LocalWeit, float* GlobalContrast, float* LoLitContrast，int* LocalAutoEnable,
 float* LocalAutoWeit);
```

<!-- Source EN PDF p.189; unit 2269 -->

【Parameter】

<!-- Source EN PDF p.189; unit 2270 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| LocalWeit | LocalWeit-Wert, Bereich [0,1] | Ausgabe |
| GlobalContrast | GlobalContrast-Wert, Bereich [0,1] | Ausgabe |
| LoLitContrast | LoLitContrast-Wert, Bereich [0,1] | Ausgabe |
| ocalAutoEnable | Automatischer Local-Schalter, Bereich [0,1] | Ausgabe |
| LocalAutoWeit | Automatischer LocalWeit-Wert, Bereich [0,1] | Ausgabe |

<!-- Source EN PDF p.189; unit 2271 -->

【Rückgabewert】

<!-- Source EN PDF p.189; unit 2272 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.189; unit 2273 -->

【Voraussetzungen】

<!-- Source EN PDF p.189; unit 2274 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.189; unit 2275 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.189; unit 2276 -->

#### 9.3.4  Modulbezogene API-Referenz

<!-- Source EN PDF p.189; unit 2277 -->

9.3.4.1  rk_aiq_user_api2_adrc_SetAttrib

<!-- Source EN PDF p.189; unit 2278 -->

【Beschreibung】 DRC-Softwareeigenschaften einstellen.

<!-- Source EN PDF p.189; unit 2279 -->

【Syntax】

<!-- Source EN PDF p.189; unit 2280 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_SetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t attr);
```

<!-- Source EN PDF p.190; unit 2281 -->

【Parameter】

<!-- Source EN PDF p.190; unit 2282 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der DRC-Softwareeigenschaften | Eingabe |

<!-- Source EN PDF p.190; unit 2283 -->

【Rückgabewert】

<!-- Source EN PDF p.190; unit 2284 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.190; unit 2285 -->

【Voraussetzungen】

<!-- Source EN PDF p.190; unit 2286 -->

Headerdatei: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.190; unit 2287 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.190; unit 2288 -->

【Beschreibung】

<!-- Source EN PDF p.190; unit 2289 -->

9.3.4.2  rk_aiq_user_api2_adrc_GetAttrib

<!-- Source EN PDF p.190; unit 2290 -->

【Beschreibung】 DRC-Softwareeigenschaften abfragen.

<!-- Source EN PDF p.190; unit 2291 -->

【Syntax】

<!-- Source EN PDF p.190; unit 2292 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_GetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t* attr);
```

<!-- Source EN PDF p.190; unit 2293 -->

【Parameter】

<!-- Source EN PDF p.190; unit 2294 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der DRC-Softwareeigenschaften | Ausgabe |

<!-- Source EN PDF p.190; unit 2295 -->

【Rückgabewert】

<!-- Source EN PDF p.190; unit 2296 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.190; unit 2297 -->

【Voraussetzungen】

<!-- Source EN PDF p.190; unit 2298 -->

Headerdatei: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.191; unit 2299 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.191; unit 2300 -->

【Beschreibung】

<!-- Source EN PDF p.191; unit 2301 -->

#### 9.3.5  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.191; unit 2302 -->

9.3.5.1  AdrcVersion_t

<!-- Source EN PDF p.191; unit 2303 -->

【Beschreibung】 DRC-Versionseigenschaften definieren.

<!-- Source EN PDF p.191; unit 2304 -->

【Definition】

<!-- Source EN PDF p.191; unit 2305 -->

```text
 typedef enum AdrcVersion_e {
     ADRC_VERSION_356X = 0,
     ADRC_VERSION_3588 = 1,
     ADRC_VERSION_MAX
 } AdrcVersion_t;
```

<!-- Source EN PDF p.191; unit 2306 -->

【Felder】

<!-- Source EN PDF p.191; unit 2307 -->

| Feldname | Beschreibung |
|---|---|
| ADRC_VERSION_356X | RK356x |
| ADRC_VERSION_3588 | RK3588 |
| ADRC_VERSION_MAX | Maximaler Versionsmodus |

<!-- Source EN PDF p.191; unit 2308 -->

9.3.5.2  drc_OpMode_t

<!-- Source EN PDF p.191; unit 2309 -->

【Beschreibung】 DRC-Betriebsmodus definieren.

<!-- Source EN PDF p.191; unit 2310 -->

【Definition】

<!-- Source EN PDF p.191; unit 2311 -->

```text
 typedef enum drc_OpMode_e {
     DRC_OPMODE_API_OFF   = 0,
     DRC_OPMODE_MANU      = 1,
     DRC_OPMODE_DRC_GAIN  = 2,
     DRC_OPMODE_HILIT     = 3,
     DRC_OPMODE_LOCAL_TMO = 4,
 } drc_OpMode_t;
```

<!-- Source EN PDF p.191; unit 2312 -->

【Felder】

<!-- Source EN PDF p.192; unit 2313 -->

| Feldname | Beschreibung |
|---|---|
| DRC_OPMODE_API_OFF | Automatischer Modus: sämtliche Drc-Modulparameter werden durch JSON bestimmt. |
| DRC_OPMODE_MANU | Manueller Modus: sämtliche Drc-Modulparameter werden durch stManualV30 bestimmt. |
| DRC_OPMODE_DRC_GAIN | DrcGain-Modus: bestimmte DrcGain-Parameter werden durch stDrcGain, die übrigen durch die entsprechenden Parameter der JSON-Datei bestimmt. |
| DRC_OPMODE_HILIT | HiLit-Modus: bestimmte HiLight-Parameter werden durch stHiLit, die übrigen durch entsprechende Parameter der JSON-Datei bestimmt. |
| DRC_OPMODE_LOCAL_TMO | LocalTMO-Modus: bestimmte LocalData-Parameter werden durch stLocalDataV30, die übrigen durch entsprechende Parameter der JSON-Datei bestimmt. |

<!-- Source EN PDF p.192; unit 2314 -->

9.3.5.3  mDrcGain_t

<!-- Source EN PDF p.192; unit 2315 -->

【Beschreibung】 Manuelle DrcGain-Parameter definieren.

<!-- Source EN PDF p.192; unit 2316 -->

【Definition】

<!-- Source EN PDF p.192; unit 2317 -->

```text
 typedef struct mDrcGain_s {
     float DrcGain;
     float Alpha;
     float Clip;
 } mDrcGain_t;
```

<!-- Source EN PDF p.192; unit 2318 -->

【Felder】

<!-- Source EN PDF p.192; unit 2319 -->

| Feldname | Beschreibung |
|---|---|
| DrcGain | Manueller DrcGain-Wert, Bereich [1,8], Standard 1, Genauigkeit 0.01. |
| Alpha | Manueller Alpha-Wert, Bereich [0,1], Standard 0.2, Genauigkeit 0.01. |
| Clip | Manueller Clip-Wert, Bereich [0,64], Standard 16, Genauigkeit 0.01. |

<!-- Source EN PDF p.192; unit 2320 -->

9.3.5.4  mDrcHiLit_t

<!-- Source EN PDF p.192; unit 2321 -->

【Beschreibung】 Manuelle Drc-HiLit-Parameter definieren.

<!-- Source EN PDF p.192; unit 2322 -->

【Definition】

<!-- Source EN PDF p.193; unit 2323 -->

```text
 typedef struct mDrcHiLit_s {
     float Strength;
 } mDrcHiLit_t;
```

<!-- Source EN PDF p.193; unit 2324 -->

【Felder】

<!-- Source EN PDF p.193; unit 2325 -->

| Feldname | Beschreibung |
|---|---|
| Strength | Manuelle Stärke, Bereich [0,1], Standard 0, Genauigkeit 0.01. |

<!-- Source EN PDF p.193; unit 2326 -->

9.3.5.5  mLocalDataV21_t

<!-- Source EN PDF p.193; unit 2327 -->

【Beschreibung】 DRC-Local-Parameter für RK356x definieren.

<!-- Source EN PDF p.193; unit 2328 -->

【Definition】

<!-- Source EN PDF p.193; unit 2329 -->

```text
 typedef struct mLocalDataV21_s {
     float LocalWeit;
     float GlobalContrast;
     float LoLitContrast;
 } mLocalDataV21_t;
```

<!-- Source EN PDF p.193; unit 2330 -->

【Felder】

<!-- Source EN PDF p.193; unit 2331 -->

| Feldname | Beschreibung |
|---|---|
| LocalWeit | Manueller LocalWeit-Wert im Bereich 0,1, Standard 1, Genauigkeit 0.01. |
| GlobalContrast | Manueller GlobalContrast-Wert, Bereich 0,1, Standard 0, Genauigkeit 0.01. |
| LoLitContrast | Manueller LoLitContrast-Wert im Bereich 0,1, Standard 0, Genauigkeit 0.01. |

<!-- Source EN PDF p.193; unit 2332 -->

9.3.5.6  mLocalDataV30_t

<!-- Source EN PDF p.193; unit 2333 -->

【Beschreibung】 DRC-Local-Parameter für RK356x definieren. Der Text nennt auch bei mLocalDataV30_t RK356x; die Abweichung bleibt dokumentiert.

<!-- Source EN PDF p.193; unit 2334 -->

【Definition】

<!-- Source EN PDF p.194; unit 2335 -->

```text
 typedef struct mLocalDataV30_s {
     float         LocalWeit;
     int           LocalAutoEnable;
     float         LocalAutoWeit;
     float         GlobalContrast;
     float         LoLitContrast;
 } mLocalDataV30_t;
```

<!-- Source EN PDF p.194; unit 2336 -->

【Felder】

<!-- Source EN PDF p.194; unit 2337 -->

| Feldname | Beschreibung |
|---|---|
| LocalWeit | Manueller LocalWeit-Wert, Bereich [0,1], Standard 1, Genauigkeit 0.01. |
| LocalAutoEnable | Automatischer LocalWeit-Schalter, Bereich [0,1], Standard 1, Genauigkeit 1. |
| LocalAutoWeit | Automatischer LocalWeit-Wert, Bereich [0,1], Standard 0.4, Genauigkeit 0.01. |
| GlobalContrast | Manueller GlobalContrast-Wert, Bereich [0,1], Standard 0, Genauigkeit 0.01. |
| LoLitContrast | Manueller LoLitContrast-Wert, Bereich [0,1], Standard 0, Genauigkeit 0.01. |

<!-- Source EN PDF p.194; unit 2338 -->

9.3.5.7  mDrcLocalV21_t

<!-- Source EN PDF p.194; unit 2339 -->

【Beschreibung】 DRC-Local-Parameter für RK356x definieren.

<!-- Source EN PDF p.194; unit 2340 -->

【Definition】

<!-- Source EN PDF p.194; unit 2341 -->

```text
 typedef struct mDrcLocalV21_s {
     mLocalDataV21_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV21_t;
```

<!-- Source EN PDF p.194; unit 2342 -->

【Felder】

<!-- Source EN PDF p.195; unit 2343 -->

| Feldname | Beschreibung |
|---|---|
| LocalData | LocalData manuell setzen; die Quellbeschreibung endet nach „to“. |
| curPixWeit | Bilaterales Gewicht des aktuellen Punkts, Bereich [0,1], Standard 0.37, Genauigkeit 0.001. |
| preFrameWeit | Bilaterales Gewicht des vorherigen Frames, Bereich [0,1], Standard 0.8, Genauigkeit 0.001. |
| Range_force_sgm | Kehrwert des bilateralen Wertebereichs-Sigma, Bereich [0,1], Standard 0, Genauigkeit 0.0001. |
| Range_sgm_cur | Laut Quelle Kehrwert des bilateralen räumlichen Sigma des vorherigen Frames, Bereich 0,1, Standard 0.2, Genauigkeit 0.0001. Die Beschreibung „previous frame“ bleibt auch für cur erhalten. |
| Range_sgm_pre | Kehrwert des bilateralen räumlichen Sigma des vorherigen Frames, Bereich [0,1], Standard 0.2, Genauigkeit 0.0001. |
| Space_sgm_cur | Kehrwert des bilateralen Wertebereichs des aktuellen Frames, Bereich [0,4095], Standard 4068, Genauigkeit 1. |
| Space_sgm_pre | Kehrwert des bilateralen Wertebereichs-Sigma des vorherigen Frames, Bereich [0,4095], Standard 3068, Genauigkeit 1. |

<!-- Source EN PDF p.195; unit 2344 -->

9.3.5.8  mDrcLocalV30_t

<!-- Source EN PDF p.195; unit 2345 -->

【Beschreibung】 DRC-Local-Parameter für RK3588 definieren.

<!-- Source EN PDF p.195; unit 2346 -->

【Definition】

<!-- Source EN PDF p.195; unit 2347 -->

```text
 typedef struct mDrcLocalV30_s {
     mLocalDataV30_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV30_t;
```

<!-- Source EN PDF p.195; unit 2348 -->

【Felder】

<!-- Source EN PDF p.196; unit 2349 -->

| Feldname | Beschreibung |
|---|---|
| LocalData | Manuelle LocalData-Einstellungen |
| curPixWeit | Bilaterales Gewicht des aktuellen Punkts, Bereich [0,1], Standard 0.37, Genauigkeit 0.001. |
| preFrameWeit | Bilaterales Gewicht des vorherigen Frames, Bereich [0,1], Standard 0.8, Genauigkeit 0.001. |
| Range_force_sgm | Kehrwert des bilateralen Wertebereichs-Sigma, Bereich [0,1], Standard 0, Genauigkeit 0.0001. |
| Range_sgm_cur | Laut Quelle Kehrwert des bilateralen räumlichen Sigma des vorherigen Frames, Bereich [0,1], Standard 0.2, Genauigkeit 0.0001. Die abweichende cur-Beschreibung ist beibehalten. |
| Range_sgm_pre | Kehrwert des bilateralen räumlichen Sigma des vorherigen Frames, Bereich [0,1], Standard 0.2, Genauigkeit 0.0001. |
| Space_sgm_cur | Kehrwert des bilateralen Wertebereichs-Sigma des aktuellen Frames, Bereich [0,4095], Standard 4068, Genauigkeit 1. |
| Space_sgm_pre | Kehrwert des vorherigen bilateralen Wertebereichs-Sigma, Bereich [0,4095], Standard 3068, Genauigkeit 1. |

<!-- Source EN PDF p.196; unit 2350 -->

9.3.5.9  CompressMode_t

<!-- Source EN PDF p.196; unit 2351 -->

【Beschreibung】 Betriebsmodus der DrcCompress-Kurve im manuellen Modus definieren.

<!-- Source EN PDF p.196; unit 2352 -->

【Definition】

<!-- Source EN PDF p.196; unit 2353 -->

```text
 typedef enum CompressMode_s {
     COMPRESS_AUTO   = 0,
     COMPRESS_MANUAL = 1,
 } CompressMode_t;
```

<!-- Source EN PDF p.196; unit 2354 -->

【Felder】

<!-- Source EN PDF p.196; unit 2355 -->

| Feldname | Beschreibung |
|---|---|
| COMPRESS_AUTO | Manueller Modus, Compress-Kurve automatisch |
| COMPRESS_MANUAL | Manueller Modus, Compress-Kurve manuell |

<!-- Source EN PDF p.196; unit 2356 -->

9.3.5.10  mDrcCompress_t

<!-- Source EN PDF p.196; unit 2357 -->

【Beschreibung】 Manuelle DrcCompress-Parameter definieren.

<!-- Source EN PDF p.196; unit 2358 -->

【Definition】

<!-- Source EN PDF p.197; unit 2359 -->

```text
 typedef struct mDrcCompress_s {
     CompressMode_t Mode;
     uint16_t       Manual_curve[17];
 } mDrcCompress_t;
```

<!-- Source EN PDF p.197; unit 2360 -->

【Felder】

<!-- Source EN PDF p.197; unit 2361 -->

| Feldname | Beschreibung |
|---|---|
| Mode | Umschaltfunktion |
| Manual_curve | Manuelle Compress-Kurve im manuellen Modus |

<!-- Source EN PDF p.197; unit 2362 -->

9.3.5.11  mdrcAttr_V21_t

<!-- Source EN PDF p.197; unit 2363 -->

【Beschreibung】 Manuelle DRC-Eigenschaften für RK356x definieren.

<!-- Source EN PDF p.197; unit 2364 -->

【Definition】

<!-- Source EN PDF p.197; unit 2365 -->

```text
 typedef struct mdrcAttr_V21_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV21_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V21_t;
```

<!-- Source EN PDF p.197; unit 2366 -->

【Felder】

<!-- Source EN PDF p.198; unit 2367 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Manueller DRC-Schalter |
| DrcGain | Manuelle DrcGain-Einstellungen |
| HiLight | Manuelle HiLit-Einstellungen |
| LocalSetting | Manuelle lokale Einstellungen |
| CompressSetting | Einstellungen der Kompressionskurve |
| Scale_y | Skalentabelle zur Verstärkungskorrektur, Bereich [0,2048], Genauigkeit 1. |
| Edge_Weit | Skalenwert der Kantenantwort, Bereich [0,1], Standard 0.02, Genauigkeit 0.01. Verringert Artefakte an kontrastreichen Kanten. |
| OutPutLongFrame | Nur lange Frames ausgeben: 0 aus, 1 ein. |
| IIR_frame | Frameanzahl des IIR-Filters, Bereich [1,1000], Standard 2. |

<!-- Source EN PDF p.198; unit 2368 -->

9.3.5.12  mdrcAttr_V30_t

<!-- Source EN PDF p.198; unit 2369 -->

【Beschreibung】 Manuelle DRC-Eigenschaften für RK3588 definieren.

<!-- Source EN PDF p.198; unit 2370 -->

【Definition】

<!-- Source EN PDF p.198; unit 2371 -->

```text
 typedef struct mdrcAttr_V30_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV30_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V30_t;
```

<!-- Source EN PDF p.198; unit 2372 -->

【Felder】

<!-- Source EN PDF p.199; unit 2373 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Manueller DRC-Schalter |
| DrcGain | Manuelle DrcGain-Einstellungen |
| HiLight | Manuelle HiLit-Einstellungen |
| LocalSetting | Manuelle lokale Einstellungen |
| CompressSetting | Einstellungen der Kompressionskurve |
| Scale_y | Skalentabelle zur Verstärkungskorrektur, Bereich [0,2048], Genauigkeit 1. |
| Edge_Weit | Skalenwert der Kantenantwort, Bereich [0,1], Standard 0.02, Genauigkeit 0.01. Verringert Artefakte an kontrastreichen Kanten. |
| OutPutLongFrame | Nur lange Frames ausgeben: 0 aus, 1 ein. |
| IIR_frame | Frameanzahl des IIR-Filters, Bereich [1,1000], Standard 2. |

<!-- Source EN PDF p.199; unit 2374 -->

9.3.5.13  DrcInfo_t

<!-- Source EN PDF p.199; unit 2375 -->

【Beschreibung】 DRC-Steuerparameter definieren.

<!-- Source EN PDF p.199; unit 2376 -->

【Definition】

<!-- Source EN PDF p.199; unit 2377 -->

```text
 typedef struct DrcInfo_s {
     float EnvLv;
     float ISO;
 } DrcInfo_t;
```

<!-- Source EN PDF p.199; unit 2378 -->

【Felder】

<!-- Source EN PDF p.199; unit 2379 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Aktuelle Umgebungshelligkeit |
| ISO | Aktueller ISO-Wert |

<!-- Source EN PDF p.199; unit 2380 -->

9.3.5.14  drcAttr_t

<!-- Source EN PDF p.199; unit 2381 -->

【Beschreibung】 DRC-Eigenschaften definieren.

<!-- Source EN PDF p.199; unit 2382 -->

【Definition】

<!-- Source EN PDF p.200; unit 2383 -->

```text
 typedef struct drcAttr_s {
     rk_aiq_uapi_sync_t sync;
     AdrcVersion_t      Version;
     drc_OpMode_t       opMode;
     mdrcAttr_V21_t     stManualV21;
     mdrcAttr_V30_t     stManualV30;
     mDrcGain_t         stDrcGain;
     mDrcHiLit_t        stHiLit;
     mLocalDataV21_t    stLocalDataV21;
     mLocalDataV30_t    stLocalDataV30;
     DrcInfo_t          Info;
 } drcAttr_t;
```

<!-- Source EN PDF p.200; unit 2384 -->

【Felder】

<!-- Source EN PDF p.200; unit 2385 -->

| Feldname | Beschreibung |
|---|---|
| sync | Für die Definition von rk_aiq_uapi_sync_t siehe Überblick/API-Beschreibung. |
| Version | Versionsinformation |
| opMode | API-Modus |
| stManualV21 | Manuelle DRC-Eigenschaften für RK356x; wirksam bei opMode = DRC_OPMODE_MANU. |
| stManualV30 | Manuelle DRC-Eigenschaften für RK3588; wirksam bei opMode = DRC_OPMODE_MANU. |
| stDrcGain | DrcGain-Eigenschaften; wirksam bei opMode = DRC_OPMODE_DRC_GAIN. |
| stHiLit | Die Quelle schreibt „Hillitt attribute“ und nennt „Optmod is Dirk_Optmod_Hillit“. Diese abweichenden Bezeichner bleiben als ungeklärte Quellangabe erhalten. |
| stLocalDataV21 | LocalData-Eigenschaften für RK356x; wirksam bei opMode = DRC_OPMODE_LOCAL_TMO. |
| stLocalDataV30 | LocalData-Eigenschaften für RK3588; wirksam bei opMode = DRC_OPMODE_LOCAL_TMO. |
| Info | Informationen zu Steuerparametern |

<!-- Source EN PDF p.200; unit 2386 -->

### 9.4   Rauschminderung

<!-- Source EN PDF p.200; unit 2387 -->

#### 9.4.1  Funktionsbeschreibung

<!-- Source EN PDF p.200; unit 2388 -->

Bildrauschen sind unnötige oder unerwünschte Störinformationen in Bilddaten. Bildentrauschung reduziert dieses Rauschen in digitalen Bildern.

<!-- Source EN PDF p.201; unit 2389 -->

#### 9.4.2  Funktionsbezogene API-Referenz

<!-- Source EN PDF p.201; unit 2390 -->

9.4.2.1  rk_aiq_uapi2_setNRMode

<!-- Source EN PDF p.201; unit 2391 -->

【Beschreibung】 Entrauschungsmodus einstellen.

<!-- Source EN PDF p.201; unit 2392 -->

【Syntax】

<!-- Source EN PDF p.201; unit 2393 -->

```text
 XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.201; unit 2394 -->

【Parameter】

<!-- Source EN PDF p.201; unit 2395 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsmodus | Eingabe |

<!-- Source EN PDF p.201; unit 2396 -->

【Rückgabewert】

<!-- Source EN PDF p.201; unit 2397 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.201; unit 2398 -->

【Voraussetzungen】

<!-- Source EN PDF p.201; unit 2399 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.201; unit 2400 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.201; unit 2401 -->

9.4.2.2  rk_aiq_uapi2_getNRMode

<!-- Source EN PDF p.201; unit 2402 -->

【Beschreibung】 Aktuellen Entrauschungsmodus abfragen.

<!-- Source EN PDF p.201; unit 2403 -->

【Syntax】

<!-- Source EN PDF p.201; unit 2404 -->

```text
 XCamReturn rk_aiq_uapi2_getNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t* mode);
```

<!-- Source EN PDF p.201; unit 2405 -->

【Parameter】

<!-- Source EN PDF p.201; unit 2406 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsmodus | Ausgabe |

<!-- Source EN PDF p.201; unit 2407 -->

【Rückgabewert】

<!-- Source EN PDF p.202; unit 2408 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.202; unit 2409 -->

【Voraussetzungen】

<!-- Source EN PDF p.202; unit 2410 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2411 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.202; unit 2412 -->

9.4.2.3  rk_aiq_uapi2_setANRStrth

<!-- Source EN PDF p.202; unit 2413 -->

【Beschreibung】 Allgemeine Entrauschungsstärke einstellen.

<!-- Source EN PDF p.202; unit 2414 -->

【Syntax】

<!-- Source EN PDF p.202; unit 2415 -->

```text
 XCamReturn rk_aiq_uapi2_setANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.202; unit 2416 -->

【Parameter】

<!-- Source EN PDF p.202; unit 2417 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Eingabe |

<!-- Source EN PDF p.202; unit 2418 -->

【Rückgabewert】

<!-- Source EN PDF p.202; unit 2419 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.202; unit 2420 -->

【Voraussetzungen】

<!-- Source EN PDF p.202; unit 2421 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2422 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.202; unit 2423 -->

9.4.2.4  rk_aiq_uapi2_getANRStrth

<!-- Source EN PDF p.202; unit 2424 -->

【Beschreibung】 Allgemeine Entrauschungsstärke abfragen.

<!-- Source EN PDF p.202; unit 2425 -->

【Syntax】

<!-- Source EN PDF p.202; unit 2426 -->

```text
 XCamReturn rk_aiq_uapi2_getANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.202; unit 2427 -->

【Parameter】

<!-- Source EN PDF p.203; unit 2428 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Ausgabe |

<!-- Source EN PDF p.203; unit 2429 -->

【Rückgabewert】

<!-- Source EN PDF p.203; unit 2430 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.203; unit 2431 -->

【Voraussetzungen】

<!-- Source EN PDF p.203; unit 2432 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2433 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.203; unit 2434 -->

9.4.2.5  rk_aiq_uapi2_setMSpaNRStrth

<!-- Source EN PDF p.203; unit 2435 -->

【Beschreibung】 Räumliche Entrauschungsstärke einstellen.

<!-- Source EN PDF p.203; unit 2436 -->

【Syntax】

<!-- Source EN PDF p.203; unit 2437 -->

```text
 XCamReturn rk_aiq_uapi2_setMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.203; unit 2438 -->

【Parameter】

<!-- Source EN PDF p.203; unit 2439 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Eingabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Eingabe |

<!-- Source EN PDF p.203; unit 2440 -->

【Rückgabewert】

<!-- Source EN PDF p.203; unit 2441 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.203; unit 2442 -->

【Voraussetzungen】

<!-- Source EN PDF p.203; unit 2443 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2444 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.204; unit 2445 -->

9.4.2.6  rk_aiq_uapi2_getMSpaNRStrth

<!-- Source EN PDF p.204; unit 2446 -->

【Beschreibung】 Räumliche Entrauschungsstärke abfragen.

<!-- Source EN PDF p.204; unit 2447 -->

【Syntax】

<!-- Source EN PDF p.204; unit 2448 -->

```text
 XCamReturn rk_aiq_uapi2_getMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on,
 unsigned int *level);
```

<!-- Source EN PDF p.204; unit 2449 -->

【Parameter】

<!-- Source EN PDF p.204; unit 2450 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Ausgabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Ausgabe |

<!-- Source EN PDF p.204; unit 2451 -->

【Rückgabewert】

<!-- Source EN PDF p.204; unit 2452 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.204; unit 2453 -->

【Voraussetzungen】

<!-- Source EN PDF p.204; unit 2454 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.204; unit 2455 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.204; unit 2456 -->

9.4.2.7  rk_aiq_uapi2_setMTNRStrth

<!-- Source EN PDF p.204; unit 2457 -->

【Beschreibung】 Zeitliche Entrauschungsstärke einstellen.

<!-- Source EN PDF p.204; unit 2458 -->

【Syntax】

<!-- Source EN PDF p.204; unit 2459 -->

```text
 XCamReturn rk_aiq_uapi2_setMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.204; unit 2460 -->

【Parameter】

<!-- Source EN PDF p.204; unit 2461 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Eingabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Eingabe |

<!-- Source EN PDF p.204; unit 2462 -->

【Rückgabewert】

<!-- Source EN PDF p.205; unit 2463 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.205; unit 2464 -->

【Voraussetzungen】

<!-- Source EN PDF p.205; unit 2465 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2466 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.205; unit 2467 -->

9.4.2.8  rk_aiq_uapi2_getMTNRStrth

<!-- Source EN PDF p.205; unit 2468 -->

【Beschreibung】 Zeitliche Entrauschungsstärke abfragen.

<!-- Source EN PDF p.205; unit 2469 -->

【Syntax】

<!-- Source EN PDF p.205; unit 2470 -->

```text
 XCamReturn rk_aiq_uapi2_getMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on，
 unsigned int *level);
```

<!-- Source EN PDF p.205; unit 2471 -->

【Parameter】

<!-- Source EN PDF p.205; unit 2472 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Schalter | Ausgabe |
| level | Entrauschungsstärke, Bereich 0.0-100.0, Standard 50. | Ausgabe |

<!-- Source EN PDF p.205; unit 2473 -->

【Rückgabewert】

<!-- Source EN PDF p.205; unit 2474 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.205; unit 2475 -->

【Voraussetzungen】

<!-- Source EN PDF p.205; unit 2476 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2477 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.206; unit 2478 -->

#### 9.4.3  Modulbezogene API-Referenz

<!-- Source EN PDF p.206; unit 2479 -->

9.4.3.1  rk_aiq_user_api2_abayer2dnrV2_SetAttrib

<!-- Source EN PDF p.206; unit 2480 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus einstellen.

<!-- Source EN PDF p.206; unit 2481 -->

【Syntax】

<!-- Source EN PDF p.206; unit 2482 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2483 -->

【Parameter】

<!-- Source EN PDF p.206; unit 2484 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.206; unit 2485 -->

【Rückgabewert】

<!-- Source EN PDF p.206; unit 2486 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.206; unit 2487 -->

【Voraussetzungen】

<!-- Source EN PDF p.206; unit 2488 -->

Headerdateien: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.206; unit 2489 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.206; unit 2490 -->

9.4.3.2  rk_aiq_user_api2_abayer2dnrV2_GetAttrib

<!-- Source EN PDF p.206; unit 2491 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus abfragen.

<!-- Source EN PDF p.206; unit 2492 -->

【Syntax】

<!-- Source EN PDF p.206; unit 2493 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2494 -->

【Parameter】

<!-- Source EN PDF p.207; unit 2495 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.207; unit 2496 -->

【Rückgabewert】

<!-- Source EN PDF p.207; unit 2497 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.207; unit 2498 -->

【Voraussetzungen】

<!-- Source EN PDF p.207; unit 2499 -->

Headerdateien: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.207; unit 2500 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.207; unit 2501 -->

9.4.3.3  rk_aiq_user_api2_abayer2dnrV2_SetStrength

<!-- Source EN PDF p.207; unit 2502 -->

【Beschreibung】 Entrauschungsstärke einstellen.

<!-- Source EN PDF p.207; unit 2503 -->

【Syntax】

<!-- Source EN PDF p.207; unit 2504 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength)
```

<!-- Source EN PDF p.207; unit 2505 -->

【Parameter】

<!-- Source EN PDF p.207; unit 2506 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Struktur der Entrauschungsstärke; percent hat den Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.207; unit 2507 -->

【Rückgabewert】

<!-- Source EN PDF p.207; unit 2508 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.207; unit 2509 -->

【Voraussetzungen】

<!-- Source EN PDF p.208; unit 2510 -->

Headerdateien: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2511 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.208; unit 2512 -->

9.4.3.4  rk_aiq_user_api2_abayer2dnrV2_GetStrength

<!-- Source EN PDF p.208; unit 2513 -->

【Beschreibung】 Entrauschungsstärke abfragen.

<!-- Source EN PDF p.208; unit 2514 -->

【Syntax】

<!-- Source EN PDF p.208; unit 2515 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.208; unit 2516 -->

【Parameter】

<!-- Source EN PDF p.208; unit 2517 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pPercnt | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.208; unit 2518 -->

【Rückgabewert】

<!-- Source EN PDF p.208; unit 2519 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.208; unit 2520 -->

【Voraussetzungen】

<!-- Source EN PDF p.208; unit 2521 -->

Headerdateien: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2522 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.208; unit 2523 -->

9.4.3.5  rk_aiq_user_api2_abayertnrV2_SetAttrib

<!-- Source EN PDF p.208; unit 2524 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus einstellen.

<!-- Source EN PDF p.208; unit 2525 -->

【Syntax】

<!-- Source EN PDF p.208; unit 2526 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.208; unit 2527 -->

【Parameter】

<!-- Source EN PDF p.209; unit 2528 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.209; unit 2529 -->

【Rückgabewert】

<!-- Source EN PDF p.209; unit 2530 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.209; unit 2531 -->

【Voraussetzungen】

<!-- Source EN PDF p.209; unit 2532 -->

Headerdateien: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2533 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.209; unit 2534 -->

9.4.3.6  rk_aiq_user_api2_abayertnrV2_GetAttrib

<!-- Source EN PDF p.209; unit 2535 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus abfragen.

<!-- Source EN PDF p.209; unit 2536 -->

【Syntax】

<!-- Source EN PDF p.209; unit 2537 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.209; unit 2538 -->

【Parameter】

<!-- Source EN PDF p.209; unit 2539 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.209; unit 2540 -->

【Rückgabewert】

<!-- Source EN PDF p.209; unit 2541 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.209; unit 2542 -->

【Voraussetzungen】

<!-- Source EN PDF p.209; unit 2543 -->

Headerdateien: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2544 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.210; unit 2545 -->

9.4.3.7  rk_aiq_user_api2_abayertnrV2_SetStrength

<!-- Source EN PDF p.210; unit 2546 -->

【Beschreibung】 Entrauschungsstärke einstellen.

<!-- Source EN PDF p.210; unit 2547 -->

【Syntax】

<!-- Source EN PDF p.210; unit 2548 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2549 -->

【Parameter】

<!-- Source EN PDF p.210; unit 2550 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.210; unit 2551 -->

【Rückgabewert】

<!-- Source EN PDF p.210; unit 2552 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.210; unit 2553 -->

【Voraussetzungen】

<!-- Source EN PDF p.210; unit 2554 -->

Headerdateien: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.210; unit 2555 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.210; unit 2556 -->

9.4.3.8  rk_aiq_user_api2_abayertnrV2_GetStrength

<!-- Source EN PDF p.210; unit 2557 -->

【Beschreibung】 Entrauschungsstärke abfragen.

<!-- Source EN PDF p.210; unit 2558 -->

【Syntax】

<!-- Source EN PDF p.210; unit 2559 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2560 -->

【Parameter】

<!-- Source EN PDF p.211; unit 2561 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.211; unit 2562 -->

【Rückgabewert】

<!-- Source EN PDF p.211; unit 2563 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.211; unit 2564 -->

【Voraussetzungen】

<!-- Source EN PDF p.211; unit 2565 -->

Headerdateien: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.211; unit 2566 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.211; unit 2567 -->

9.4.3.9  rk_aiq_user_api2_aynrV3_SetAttrib

<!-- Source EN PDF p.211; unit 2568 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus einstellen.

<!-- Source EN PDF p.211; unit 2569 -->

【Syntax】

<!-- Source EN PDF p.211; unit 2570 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.211; unit 2571 -->

【Parameter】

<!-- Source EN PDF p.211; unit 2572 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.211; unit 2573 -->

【Rückgabewert】

<!-- Source EN PDF p.211; unit 2574 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.211; unit 2575 -->

【Voraussetzungen】

<!-- Source EN PDF p.211; unit 2576 -->

Headerdateien: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2577 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.212; unit 2578 -->

9.4.3.10  rk_aiq_user_api2_aynrV3_GetAttrib

<!-- Source EN PDF p.212; unit 2579 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus abfragen.

<!-- Source EN PDF p.212; unit 2580 -->

【Syntax】

<!-- Source EN PDF p.212; unit 2581 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.212; unit 2582 -->

【Parameter】

<!-- Source EN PDF p.212; unit 2583 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.212; unit 2584 -->

【Rückgabewert】

<!-- Source EN PDF p.212; unit 2585 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.212; unit 2586 -->

【Voraussetzungen】

<!-- Source EN PDF p.212; unit 2587 -->

Headerdateien: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2588 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.212; unit 2589 -->

9.4.3.11  rk_aiq_user_api2_aynrV3_SetStrength

<!-- Source EN PDF p.212; unit 2590 -->

【Beschreibung】 Entrauschungsstärke einstellen.

<!-- Source EN PDF p.212; unit 2591 -->

【Syntax】

<!-- Source EN PDF p.212; unit 2592 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.212; unit 2593 -->

【Parameter】

<!-- Source EN PDF p.213; unit 2594 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.213; unit 2595 -->

【Rückgabewert】

<!-- Source EN PDF p.213; unit 2596 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.213; unit 2597 -->

【Voraussetzungen】

<!-- Source EN PDF p.213; unit 2598 -->

Headerdateien: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.213; unit 2599 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.213; unit 2600 -->

9.4.3.12  rk_aiq_user_api2_aynrV3_GetStrength

<!-- Source EN PDF p.213; unit 2601 -->

【Beschreibung】 Entrauschungsstärke abfragen.

<!-- Source EN PDF p.213; unit 2602 -->

【Syntax】

<!-- Source EN PDF p.213; unit 2603 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.213; unit 2604 -->

【Parameter】

<!-- Source EN PDF p.213; unit 2605 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.213; unit 2606 -->

【Rückgabewert】

<!-- Source EN PDF p.213; unit 2607 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.213; unit 2608 -->

【Voraussetzungen】

<!-- Source EN PDF p.214; unit 2609 -->

Headerdateien: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2610 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.214; unit 2611 -->

9.4.3.13  rk_aiq_user_api2_acnrV2_SetAttrib

<!-- Source EN PDF p.214; unit 2612 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus einstellen.

<!-- Source EN PDF p.214; unit 2613 -->

【Syntax】

<!-- Source EN PDF p.214; unit 2614 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2615 -->

【Parameter】

<!-- Source EN PDF p.214; unit 2616 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.214; unit 2617 -->

【Rückgabewert】

<!-- Source EN PDF p.214; unit 2618 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.214; unit 2619 -->

【Voraussetzungen】

<!-- Source EN PDF p.214; unit 2620 -->

Headerdateien: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2621 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.214; unit 2622 -->

9.4.3.14  rk_aiq_user_api2_acnrV2_GetAttrib

<!-- Source EN PDF p.214; unit 2623 -->

【Beschreibung】 Eigenschaften des Entrauschungsalgorithmus abfragen.

<!-- Source EN PDF p.214; unit 2624 -->

【Syntax】

<!-- Source EN PDF p.214; unit 2625 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2626 -->

【Parameter】

<!-- Source EN PDF p.215; unit 2627 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Entrauschung | Eingabe |

<!-- Source EN PDF p.215; unit 2628 -->

【Rückgabewert】

<!-- Source EN PDF p.215; unit 2629 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.215; unit 2630 -->

【Voraussetzungen】

<!-- Source EN PDF p.215; unit 2631 -->

Headerdateien: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.215; unit 2632 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.215; unit 2633 -->

9.4.3.15  rk_aiq_user_api2_acnrV2_SetStrength

<!-- Source EN PDF p.215; unit 2634 -->

【Beschreibung】 Entrauschungsstärke einstellen.

<!-- Source EN PDF p.215; unit 2635 -->

【Syntax】

<!-- Source EN PDF p.215; unit 2636 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.215; unit 2637 -->

【Parameter】

<!-- Source EN PDF p.215; unit 2638 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.215; unit 2639 -->

【Rückgabewert】

<!-- Source EN PDF p.215; unit 2640 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.215; unit 2641 -->

【Voraussetzungen】

<!-- Source EN PDF p.215; unit 2642 -->

Headerdateien: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2643 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.216; unit 2644 -->

9.4.3.16  rk_aiq_user_api2_acnrV2_GetStrength

<!-- Source EN PDF p.216; unit 2645 -->

【Beschreibung】 Entrauschungsstärke abfragen.

<!-- Source EN PDF p.216; unit 2646 -->

【Syntax】

<!-- Source EN PDF p.216; unit 2647 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.216; unit 2648 -->

【Parameter】

<!-- Source EN PDF p.216; unit 2649 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Entrauschungsstärkestruktur; Prozentwert im Bereich 0.0-1.0. | Eingabe |

<!-- Source EN PDF p.216; unit 2650 -->

【Rückgabewert】

<!-- Source EN PDF p.216; unit 2651 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.216; unit 2652 -->

【Voraussetzungen】

<!-- Source EN PDF p.216; unit 2653 -->

Headerdateien: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2654 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.216; unit 2655 -->

#### 9.4.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.216; unit 2656 -->

9.4.4.1  rk_aiq_bayer2dnr_attrib_v2_t

<!-- Source EN PDF p.216; unit 2657 -->

【Beschreibung】 Parameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.216; unit 2658 -->

【Definition】

<!-- Source EN PDF p.217; unit 2659 -->

```text
 typedef struct rk_aiq_bayer2dnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
 Abayer2dnr_OPMode_V2_t eMode;
     Abayer2dnr_Auto_Attr_V2_t stAuto;
     Abayer2dnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayer2dnr_attrib_v2_t;
```

<!-- Source EN PDF p.217; unit 2660 -->

【Felder】

<!-- Source EN PDF p.217; unit 2661 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| eMode | Bayer2DNR-Entrauschungsmodus |
| stAuto | Bayer2DNR-Parameter für den automatischen Modus |
| stManual | Bayer2DNR-Parameter für den manuellen Modus |

<!-- Source EN PDF p.217; unit 2662 -->

9.4.4.2  Abayer2dnr_OPMode_V2_t

<!-- Source EN PDF p.217; unit 2663 -->

【Beschreibung】 Modus des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.217; unit 2664 -->

【Definition】

<!-- Source EN PDF p.217; unit 2665 -->

```text
 typedef enum Abayer2dnr_OPMode_V2_e {
     ABAYER2DNR_OP_MODE_INVALID           = 0,
     ABAYER2DNR_OP_MODE_AUTO              = 1,
     ABAYER2DNR_OP_MODE_MANUAL            = 2,
     ABAYER2DNR_OP_MODE_REG_MANUAL        = 3,
     ABAYER2DNR_OP_MODE_MAX
 } Abayer2dnr_OPMode_V2_t;
```

<!-- Source EN PDF p.217; unit 2666 -->

【Felder】

<!-- Source EN PDF p.217; unit 2667 -->

| Feldname | Beschreibung |
|---|---|
| ABAYER2DNR_OP_MODE_INVALID | Ungültiger Modus des Bayer-2DNR-Entrauschungsmoduls |
| ABAYER2DNR_OP_MODE_AUTO | Automatischer Modus des Bayer-2DNR-Entrauschungsmoduls |
| ABAYER2DNR_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des Bayer-2DNR-Entrauschungsmoduls |
| ABAYER2DNR_OP_MODE_REG_MANUAL | Registereinstellungen für den manuellen Modus des Bayer-2DNR-Entrauschungsmoduls |
| ABAYER2DNR_OP_MODE_MAX | Maximalwert der Bayer-2DNR-Modi; ungültiger Modus. |

<!-- Source EN PDF p.218; unit 2668 -->

9.4.4.3  Abayer2dnr_Auto_Attr_V2_t

<!-- Source EN PDF p.218; unit 2669 -->

【Beschreibung】 Automatische Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.218; unit 2670 -->

【Definition】

<!-- Source EN PDF p.218; unit 2671 -->

```text
 typedef struct Abayer2dnr_Auto_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_t st2DParams;
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
 } Abayer2dnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2672 -->

【Felder】

<!-- Source EN PDF p.218; unit 2673 -->

| Feldname | Beschreibung |
|---|---|
| st2DParams | Algorithmusparameter des Bayer2DNR-Moduls für jede ISO-Stufe |
| st2DSelect | Vom bayer2dnr-Modul berechnete Eigenschaftsparameter |

<!-- Source EN PDF p.218; unit 2674 -->

9.4.4.4  Abayer2dnr_Manual_Attr_V2_t

<!-- Source EN PDF p.218; unit 2675 -->

【Beschreibung】 Manuelle Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.218; unit 2676 -->

【Definition】

<!-- Source EN PDF p.218; unit 2677 -->

```text
 typedef struct Abayer2dnr_Manual_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
     RK_Bayer2dnr_Fix_V2_t st2Dfix;
 } Abayer2dnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2678 -->

【Felder】

<!-- Source EN PDF p.218; unit 2679 -->

| Feldname | Beschreibung |
|---|---|
| st2DSelect | Parameterwerte des Bayer2DNR-Algorithmus |
| st2Dfix | Bayer2DNR-Registerwerte im manuellen Modus |

<!-- Source EN PDF p.218; unit 2680 -->

9.4.4.5  RK_Bayer2dnr_Params_V2_t

<!-- Source EN PDF p.218; unit 2681 -->

【Beschreibung】 Automatikmodus und ISO-abhängige Algorithmusparameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.218; unit 2682 -->

【Definition】

<!-- Source EN PDF p.219; unit 2683 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   lumapoint[16];
     int   sigma[RK_BAYER2DNR_V2_MAX_ISO_NUM][16];
     float filter_strength[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float edgesofts[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float ratio[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float weight[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   gauss_guide[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int pix_diff[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int diff_thld[RK_BAYER2DNR_V2_MAX_ISO_NUM];
 } RK_Bayer2dnr_Params_V2_t;
```

<!-- Source EN PDF p.219; unit 2684 -->

【Felder】

<!-- Source EN PDF p.220; unit 2685 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| enable | Abstimmparameter | Modulschalter: 1 ein, 0 aus. |
| ISO | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen Abstimmparametern. Derzeit werden nur 13 Stufen unterstützt. |
| lumapoint | Kalibrierdaten | Unterschiedlichen Pixelhelligkeiten zugeordnete Punkte der Rausch-Sigma-Kurve, insgesamt 16 Punkte. |
| sigma | Kalibrierdaten | Unterschiedlichen Pixelhelligkeiten zugeordnete Punkte der Rausch-Sigma-Kurve, insgesamt 16 Punkte. |
| gauss_guide | Abstimmparameter | Gauß-Führung aktivieren: 1 ein, 0 aus. |
| filter_strength | Abstimmparameter | Entrauschungsstärke, Bereich [0, 16]. Größere Werte verstärken die Entrauschung. |
| edgesofts | Abstimmparameter | Beeinflusst die räumlichen Gewichte. Bereich 1 bis 16, Standard 1. |
| ratio | Abstimmparameter | Gewicht der weichen Schwelle, Bereich 0, 1.0. Kleinere Werte verstärken die Entrauschung. |
| weight | Abstimmparameter | Größere Filterausgangsgewichte verstärken die Entrauschung. |
| pix_diff | Abstimmparameter | Pixeldifferenzschwelle im 5x5-Fenster für bilaterale Filterung; Standard 0x3fff. |
| diff_thld | Abstimmparameter | Schwelle der quadrierten Differenz zur Berechnung euklidischer Abstände für die bilaterale Filterung: 0x3ff. |

<!-- Source EN PDF p.220; unit 2686 -->

9.4.4.6  RK_Bayer2dnr_Params_V2_Select_t

<!-- Source EN PDF p.220; unit 2687 -->

【Beschreibung】 Algorithmuseigenschaften des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.220; unit 2688 -->

【Definition】

<!-- Source EN PDF p.220; unit 2689 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_Select_s
 {
     int enable;
     int lumapoint[16];
     int sigma[16];
     float filter_strength;
     float edgesofts;
     float ratio;
     float weight;
     int gauss_guide;
     int pix_diff;
     int diff_thld;
 } RK_Bayer2dnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.221; unit 2690 -->

【Felder】

<!-- Source EN PDF p.221; unit 2691 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| enable | Abstimmparameter | Modulschalter: 1 ein, 0 aus. |
| lumapoint | Kalibrierdaten | Unterschiedlichen Pixelhelligkeiten zugeordnete Punkte der Rausch-SIGMA-Kurve, insgesamt 16 Punkte. |
| sigma | Kalibrierdaten | Unterschiedlichen Pixelhelligkeiten zugeordnete Punkte der Rausch-SIGMA-Kurve, insgesamt 16 Punkte. |
| gauss_guide | Abstimmparameter | Gauß-Führung aktivieren: 1 ein, 0 aus. |
| filter_strength | Abstimmparameter | Entrauschungsstärke, Bereich [0, 16]. Größere Werte verstärken die Entrauschung. |
| edgesofts | Abstimmparameter | Beeinflusst räumliche Gewichte, Bereich [1, 16], Standard 1. |
| ratio | Abstimmparameter | Gewicht der weichen Schwelle, Bereich [0, 1.0]. Kleinere Werte verstärken die Entrauschung. |
| weight | Abstimmparameter | Größere Filterausgangsgewichte verstärken die Entrauschung. |
| pix_diff | Abstimmparameter | Pixeldifferenzschwelle im 5x5-Fenster für bilaterale Filterung; Standard 0x3fff. |
| diff_thld | Abstimmparameter | Schwelle der quadrierten Differenz zur Berechnung euklidischer Abstände für die bilaterale Filterung: 0x3ff. |

<!-- Source EN PDF p.221; unit 2692 -->

9.4.4.7  RK_Bayer2dnr_Fix_V2_t

<!-- Source EN PDF p.221; unit 2693 -->

【Beschreibung】 Registerkonfiguration des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.221; unit 2694 -->

【Definition】

<!-- Source EN PDF p.221; unit 2695 -->

```text
 typedef struct RK_Bayer2dnr_Fix_V2_s {
     //ISP_BAYNR_3A00_CTRL
     uint8_t baynr_lg2_mode;
     uint8_t baynr_gauss_en;
     uint8_t baynr_log_bypass;
     uint8_t baynr_en;
     // ISP_BAYNR_3A00_DGAIN0-2
     uint16_t baynr_dgain[3];
     // ISP_BAYNR_3A00_PIXDIFF
     uint16_t baynr_pix_diff;
     // ISP_BAYNR_3A00_THLD
     uint16_t baynr_diff_thld;
     uint16_t baynr_softthld;
     // ISP_BAYNR_3A00_W1_STRENG
     uint16_t bltflt_streng;
     uint16_t baynr_reg_w1;
     // ISP_BAYNR_3A00_SIGMAX0-15
     uint16_t sigma_x[16];
     // ISP_BAYNR_3A00_SIGMAY0-15
     uint16_t sigma_y[16];
     // ISP_BAYNR_3A00_WRIT_D
     uint16_t weit_d[3];
     uint16_t lg2_lgoff;
     uint16_t lg2_off;
     uint32_t dat_max;
 } RK_Bayer2dnr_Fix_V2_t;
 } RK_Bayer2dnr_Fix_V23_t;
```

<!-- Source EN PDF p.222; unit 2696 -->

【Felder】

<!-- Source EN PDF p.223; unit 2697 -->

| Parameter | Bitbreite | Parameterbeschreibung |
|---|---|---|
| baynr_gauss_en | 1 | Gauß-geführte 3x3-Filterung: 1 ein, 0 aus; Standard 0. |
| baynr_log_bypass | 1 | Steuerbit der Log-Transformation; innerhalb der HDR-Hardware zwangsweise ausgeschaltet. 1: Log-Bypass ein, also Log-Transformation aus; 0: Bypass aus, Transformation ein. Standard 0. |
| baynr_en | 1 | Bayer-Entrauschung aktivieren: 1 ein, 0 aus; Standard 0. |
| baynr_dgain | 18 | Im HDR-Modus der Verstärkung dreier Frames entsprechender Parameter mit 10bit Nachkommanteil. |
| baynr_pix_diff | 14 | Pixeldifferenzschwelle im 5x5-Fenster für bilaterale Filterung; Standard 0x3fff. |
| baynr_diff_thld | 10 | Schwelle der quadrierten Differenz zur Berechnung euklidischer Abstände bei bilateraler Filterung; Standard 0x3ff. |
| baynr_softthld | 10 | Gewicht der weichen Schwelle: je größer der Wert, desto größer die Schwelle und desto mehr Rauschen bleibt erhalten. 10 Nachkommabits, Standard 0xa. |
| bltflt_streng | 12 | Stärke der bilateralen Entrauschung, 8bit Nachkommanteil; Standard 0xa3. |
| baynr_reg_w1 | 10 | Filterausgangsgewicht: größere Werte verwenden mehr gefilterte Ausgabe, kleinere mehr Originaldaten. 10bit Nachkommanteil; Standard 0x3ff. |
| sigma_x | 16 | 16 Helligkeitsstufen der Rauschkurve; so konfigurieren, dass die Interpolation zweier Werte laut Quelle einer Potenz von 2 entspricht. |
| sigma_y | 16 | 16 Rausch-Sigma-Stufen der Rauschkurve; Parameter werden kalibriert. |
| weit_d | 10 | Räumliche Gewichte verschiedener Positionen, 10bit Nachkommanteil; Standardwerte 0x178, 0x249, 0x31d. |

<!-- Source EN PDF p.224; unit 2698 -->

9.4.4.8  rk_aiq_bayer2dnr_strength_v2_t

<!-- Source EN PDF p.224; unit 2699 -->

【Beschreibung】 Struktur zur Entrauschungsstärke definieren.

<!-- Source EN PDF p.224; unit 2700 -->

【Definition】

<!-- Source EN PDF p.224; unit 2701 -->

```text
 typedef struct rk_aiq_bayer2dnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayer2dnr_strength_v2_t;
```

<!-- Source EN PDF p.224; unit 2702 -->

【Felder】

<!-- Source EN PDF p.224; unit 2703 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| percent | Entrauschungsstärke, Bereich 0.0-1.0. |

<!-- Source EN PDF p.224; unit 2704 -->

9.4.4.9  rk_aiq_bayertnr_attrib_v2_t

<!-- Source EN PDF p.224; unit 2705 -->

【Beschreibung】 Parameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.224; unit 2706 -->

【Definition】

<!-- Source EN PDF p.224; unit 2707 -->

```text
 typedef struct rk_aiq_bayertnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     Abayertnr_OPMode_V2_t eMode;
     Abayertnr_Auto_Attr_V2_t stAuto;
     Abayertnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayertnr_attrib_v2_t;
```

<!-- Source EN PDF p.224; unit 2708 -->

【Felder】

<!-- Source EN PDF p.224; unit 2709 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| eMode | Bayertnr-Entrauschungsmodus |
| stAuto | Bayertnr-Parameter für den automatischen Modus |
| stManual | Bayertnr-Parameter für den manuellen Modus |

<!-- Source EN PDF p.225; unit 2710 -->

9.4.4.10  Abayertnr_OPMode_V2_t

<!-- Source EN PDF p.225; unit 2711 -->

【Beschreibung】 Modus des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.225; unit 2712 -->

【Definition】

<!-- Source EN PDF p.225; unit 2713 -->

```text
 typedef enum Abayertnr_OPMode_V2_e {
     ABAYERTNRV2_OP_MODE_INVALID           = 0,
     ABAYERTNRV2_OP_MODE_AUTO              = 1,
     ABAYERTNRV2_OP_MODE_MANUAL            = 2,
     ABAYERTNRV2_OP_MODE_REG_MANUAL        = 3,
     ABAYERTNRV2_OP_MODE_MAX
 } Abayertnr_OPMode_V2_t;
```

<!-- Source EN PDF p.225; unit 2714 -->

【Felder】

<!-- Source EN PDF p.225; unit 2715 -->

| Feldname | Beschreibung |
|---|---|
| ABAYERTNRV2_OP_MODE_INVALID | Ungültiger Modus des Bayer-TNR-Entrauschungsmoduls |
| ABAYERTNRV2_OP_MODE_AUTO | Automatischer Modus des Bayer-TNR-Entrauschungsmoduls |
| ABAYERTNRV2_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des Bayer-TNR-Entrauschungsmoduls |
| ABAYERTNRV2_OP_MODE_MAX | Maximalwert der Bayer-TNR-Modi; ungültiger Modus. |

<!-- Source EN PDF p.225; unit 2716 -->

9.4.4.11  Abayertnr_Auto_Attr_V2_t

<!-- Source EN PDF p.225; unit 2717 -->

【Beschreibung】 Automatische Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.225; unit 2718 -->

【Definition】

<!-- Source EN PDF p.225; unit 2719 -->

```text
 typedef struct Abayertnr_Auto_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_t st3DParams;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
 } Abayertnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.225; unit 2720 -->

【Felder】

<!-- Source EN PDF p.226; unit 2721 -->

| Feldname | Beschreibung |
|---|---|
| bayernr3DEn | Bayer3dnr-Modulschalter |
| st3DParams | Algorithmusparameter je ISO-Stufe im automatischen Bayer3DNR-Modus |
| st3DSelect | Vom bayer3dnr-Modul berechnete Eigenschaftsparameter |

<!-- Source EN PDF p.226; unit 2722 -->

9.4.4.12  Abayertnr_Manual_Attr_V23_t

<!-- Source EN PDF p.226; unit 2723 -->

【Beschreibung】 Manuelle Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.226; unit 2724 -->

【Definition】

<!-- Source EN PDF p.226; unit 2725 -->

```text
 typedef struct Abayertnr_Manual_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
     RK_Bayertnr_Fix_V2_t st3DFix;
 } Abayertnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.226; unit 2726 -->

【Felder】

<!-- Source EN PDF p.226; unit 2727 -->

| Feldname | Beschreibung |
|---|---|
| bayernr3DEn | Bayer3dnr-Modulschalter |
| st3DSelect | Algorithmusparameterwerte im manuellen Bayer3DNR-Modus |
| st3Dfix | Bayer3DNR-Registerwerte im manuellen Modus |

<!-- Source EN PDF p.226; unit 2728 -->

9.4.4.13  RK_Bayertnr_Params_V2_t

<!-- Source EN PDF p.226; unit 2729 -->

【Beschreibung】 Automatikmodus und ISO-abhängige Algorithmusparameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.226; unit 2730 -->

【Definition】

<!-- Source EN PDF p.226; unit 2731 -->

```text
 typedef struct RK_Bayertnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYERNR_V2_MAX_ISO_NUM];
     //calib
     int   lumapoint[16];
     int   sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   lumapoint2[16];
     int   lo_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   hi_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     //tuning
     int   thumbds[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gsbay_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pk_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pksq[RK_BAYERNR_V2_MAX_ISO_NUM];
     float lo_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float soft_threshold_ratio[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_wgt_comp[RK_BAYERNR_V2_MAX_ISO_NUM];
     float clipwgt[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hidif_th[RK_BAYERNR_V2_MAX_ISO_NUM];
 } RK_Bayertnr_Params_V2_t;
```

<!-- Source EN PDF p.227; unit 2732 -->

【Felder】

<!-- Source EN PDF p.228; unit 2733 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| Enable | Abstimmparameter | Modul aktivieren |
| iso | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen Abstimmparametern; derzeit nur 13. |
| lumapoint / sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. Lumapoint bezeichnet die Pixelhelligkeit, sigma den Rauschkurvenwert. |
| lumapoint2 /<br>lo_sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. Lumapoint2 bezeichnet die Pixelhelligkeit, lo_sigma den Rauschkurvenwert. |
| lumapoint2 /<br>hi_sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. lumapoint2 bezeichnet die Pixelhelligkeit, hi_sigma den Rauschkurvenwert. |
| thumbds | Abstimmparameter | Unterabtastungsmaßstab |
| lo_enable | Abstimmparameter | Niederfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| hi_enable | Abstimmparameter | Hochfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| lo_med_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gsbay_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gslum_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_med_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_gslum_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| global_pk_en | Abstimmparameter | Globalen PK zur zeitlichen Entrauschung verwenden: 1 ja, 0 nein. Derzeit nur 0. |

<!-- Source EN PDF p.229; unit 2734 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| global_pksq | Abstimmparameter | Quadrat des globalen pk, verwendet bei global_pk_en = 1. Standard 1024, Bereich [0, 268435455]. |
| lo_filter_strength | Abstimmparameter | Stärke der hochfrequenten Bewegungserkennung laut Quelle; beeinflusst Hi Sigma und dadurch die zeitliche Entrauschungsstärke. Standard 1, Bereich [0.0, 16.0]. Die Hochfrequenzbeschreibung bleibt auch für lo_filter_strength erhalten. |
| hi_filter_strength | Abstimmparameter | Stärke der hochfrequenten Bewegungserkennung; beeinflusst Hi Sigma und dadurch die zeitliche Entrauschungsstärke. Standard 1, Bereich [0.0, 16.0]. |
| soft_threshold_ratio | Abstimmparameter | Gewicht der weichen Schwelle: größere Werte lassen mehr Rauschen erhalten. Bereich laut Quelle [0.0 1.0], Standard 0. |
| hi_wgt_comp | Abstimmparameter | Verhältnis der Gewichtskompensation beim Überlagern; nur bei aktivierter Hochfrequenz wirksam. Standard 0.16, Bereich [0.0, 1.0]. |
| clipwgt | Abstimmparameter | Gewichtsgrenze der Bildüberlagerung. Standard 0.03215, Bereich [0.0, 1.0]. |
| hidif_th | Abstimmparameter | Hochfrequenz-Differenzschwelle. Standard 32767, Bereich [0, 65535]. |

<!-- Source EN PDF p.229; unit 2735 -->

9.4.4.14  RK_Bayertnr_Params_V2_Select_t

<!-- Source EN PDF p.229; unit 2736 -->

【Beschreibung】 Struktur der Algorithmuseigenschaften im manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.229; unit 2737 -->

【Definition】

<!-- Source EN PDF p.229; unit 2738 -->

```text
 typedef struct RK_Bayertnr_Params_V2_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float clipwgt;
     float hi_wgt_comp;
     float hidif_th;
 } RK_Bayertnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.230; unit 2739 -->

【Felder】

<!-- Source EN PDF p.231; unit 2740 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| Enable | Abstimmparameter | Modul aktivieren |
| lumapoint / sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. Lumapoint bezeichnet die Pixelhelligkeit, sigma den Rauschkurvenwert. |
| lumapoint2 /<br>lo_sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. Lumapoint2 bezeichnet die Pixelhelligkeit, lo_sigma den Rauschkurvenwert. |
| lumapoint2 /<br>hi_sigma | Kalibrierparameter | Rauschkurvenwerte für verschiedene Helligkeiten, insgesamt 16 Punkte. Lumapoint2 bezeichnet die Pixelhelligkeit, hi_sigma den Rauschkurvenwert. |
| thumbds | Abstimmparameter | Unterabtastungsverhältnis |
| lo_enable | Abstimmparameter | Niederfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| hi_enable | Abstimmparameter | Hochfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| lo_med_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gsbay_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gslum_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_med_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_gslum_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| global_pk_en | Abstimmparameter | Globalen PK zur zeitlichen Entrauschung verwenden: 1 ja, 0 nein. Derzeit nur 0. |
| global_pksq | Abstimmparameter | Quadrat des globalen pk, verwendet bei global_pk_en = 1. Standard 1024, Bereich [0, 268435455]. |

<!-- Source EN PDF p.232; unit 2741 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| lo_filter_strength | Abstimmparameter | Laut Quelle Stärke der hochfrequenten Bewegungserkennung; beeinflusst Hi Sigma und damit die zeitliche Entrauschung. Standard 1, Bereich [0.0, 16.0]. Die abweichende lo-Beschreibung bleibt erhalten. |
| hi_filter_strength | Abstimmparameter | Stärke der hochfrequenten Bewegungserkennung; beeinflusst Hi Sigma und damit die zeitliche Entrauschung. Standard 1, Bereich [0.0, 16.0]. |
| soft_threshold_ratio | Abstimmparameter | Gewicht der weichen Schwelle: je größer der Wert, desto mehr Rauschen bleibt erhalten. Bereich laut Quelle [0.0 1.0], Standard 0. |
| hi_wgt_comp | Abstimmparameter | Verhältnis der Gewichtskompensation beim Überlagern; nur bei aktivierter Hochfrequenz wirksam. Standard 0.16, Bereich [0.0, 1.0]. |
| clipwgt | Abstimmparameter | Gewichtsgrenze der Bildüberlagerung. Standard 0.03215, Bereich laut Quelle 0.0, 1.0. |
| hidif_th | Abstimmparameter | Hochfrequenz-Differenzschwelle. Standard 32767, Bereich laut Quelle 0, 65535. |

<!-- Source EN PDF p.232; unit 2742 -->

9.4.4.15  RK_Bayertnr_Params_V23_Select_t

<!-- Source EN PDF p.232; unit 2743 -->

【Beschreibung】 Struktur der Algorithmuseigenschaften im manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.232; unit 2744 -->

【Definition】

<!-- Source EN PDF p.232; unit 2745 -->

```text
 typedef struct RK_Bayertnr_Params_V23_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds_w;
     int thumbds_h;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int trans_en;
     int wgt_use_mode;
     int wgt_mge_mode;
     int hi_guass;
     int kl_guass;
     bool global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float lo_clipwgt;
     float hi_wgt_comp;
     int   hidif_th;
     float lo_filter_rat0;
     int   lo_filter_thed0;
     int hi_filter_abs_ctrl;
     int hi_filter_filt_bay;
     int hi_filter_filt_avg;
     int hi_filter_filt_mode;
     float hi_filter_rat0;
     int   hi_filter_thed0;
     float hi_filter_rat1;
     int   hi_filter_thed1;
```

<!-- Source EN PDF p.233; unit 2746 -->

```text
     int   guass_guide_coeff0;
     int   guass_guide_coeff1;
     int   guass_guide_coeff2;
     int   guass_guide_coeff3;
 } RK_Bayertnr_Params_V23_Select_t;
```

<!-- Source EN PDF p.233; unit 2747 -->

【Felder】

<!-- Source EN PDF p.234; unit 2748 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| Enable | Abstimmparameter | Modul aktivieren |
| lumapoint / sigma | Kalibrierparameter | Rauschkurvenwerte für unterschiedliche Helligkeiten, insgesamt 16 Punkte. LumaPoint bezeichnet die Pixelhelligkeit, Sigma den Rauschkurvenwert. |
| lumapoint2 /<br>lo_sigma | Kalibrierparameter | Rauschkurvenwerte für unterschiedliche Helligkeiten, insgesamt 16 Punkte. lumapoint2 bezeichnet die Pixelhelligkeit, lo_sigma den Rauschkurvenwert. |
| lumapoint2 /<br>hi_sigma | Kalibrierparameter | Rauschkurvenwerte für unterschiedliche Helligkeiten, insgesamt 16 Punkte. lumapoint2 bezeichnet die Pixelhelligkeit, hi_sigma den Rauschkurvenwert. |
| thumbds_w<br>thumbds_h | Abstimmparameter | Unterabtastungsverhältnis: derzeit nur 4x4, 8x4 und 8x8; Standardmodus 8x4. |
| lo_enable | Abstimmparameter | Niederfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| hi_enable | Abstimmparameter | Hochfrequente Bewegungserkennung: 1 ein, 0 aus; standardmäßig ein. |
| lo_med_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gsbay_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| lo_gslum_en | Abstimmparameter | Interner niederfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_med_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| hi_gslum_en | Abstimmparameter | Interner hochfrequenter Untermodulschalter: 1 ein, 0 aus; standardmäßig ein. |
| global_pk_en | Abstimmparameter | Globalen PK für zeitliche Entrauschung verwenden: 1 ja, 0 nein. Derzeit nur 0. |
| global_pksq | Abstimmparameter | Quadrat des globalen pk; nur bei global_pk_en = 1 verwendet. Standard 1024, Bereich [0, 268435455]. |

<!-- Source EN PDF p.235; unit 2749 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| lo_filter_strength | Abstimmparameter | Laut Quelle Stärke der hochfrequenten Bewegungserkennung; beeinflusst HI Sigma und dadurch die zeitliche Entrauschung. Standard 1, Bereich [0.0, 16.0]. Die Beschreibung für lo bleibt erhalten. |
| hi_filter_strength | Abstimmparameter | Stärke der hochfrequenten Bewegungserkennung; beeinflusst HI Sigma und dadurch die zeitliche Entrauschung. Standard 1, Bereich [0.0, 16.0]. |
| soft_threshold_ratio | Abstimmparameter | Gewicht der weichen Schwelle: größere Werte lassen mehr Rauschen erhalten. Bereich laut Quelle [0.0 1.0], Standard 0. |
| hi_wgt_comp | Abstimmparameter | Verhältnis der ergänzenden Überlagerungsgewichtung; nur bei eingeschalteter Hochfrequenz wirksam. Standard 0.16, Bereich [0.0, 1.0]. |
| lo_clipwgt | Abstimmparameter | Gewichtsgrenze der Bildüberlagerung. Standard 0.03215, Bereich [0.0, 1.0]. |
| hidif_th | Abstimmparameter | Hochfrequenz-Differenzschwelle. Standard 32767, Bereich [0, 65535]. |
| trans_en | Abstimmparameter | Bandbreiteneinsparung: 0 aus, 1 ein. Im linearen Modus einstellbar; im HDR-Modus wird 0 empfohlen. |
| wgt_use_mode | Abstimmparameter | Optimierung bei der Gewichtsfusion: 0 aus, 1 ein. |
| wgt_mge_mode | Abstimmparameter | Optimierung der hochfrequenten Gewichtsberechnung: 0 aus, 1 ein. |
| hi_guass | Abstimmparameter | Datenquelle für hochfrequentes SIGMA: 0 ungefilterte Originaldaten, 1 gefilterte Daten. |
| kl_guass | Abstimmparameter | Datenquelle für PK-Sigma-Suche: 0 ungefilterte Originaldaten, 1 gefilterte Daten. |
| lo_filter_rat0 | Abstimmparameter | Bei der Gewichtsberechnung der niederfrequenten Bewegungserkennung von der Differenz abzuziehender Datenanteil. Bereich [0.0, 16.0], Standard 1. |
| lo_filter_thed0 | Abstimmparameter | Bei der Gewichtsberechnung der niederfrequenten Bewegungserkennung von der Differenz abzuziehender Datenversatz. Bereich [0, 4095], Standard 0. |

<!-- Source EN PDF p.236; unit 2750 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| hi_filter_rat0 | Abstimmparameter | Bei Berechnung des ersten hochfrequenten Bewegungsgewichts abzuziehender Datenanteil. Bereich [0.0, 16.0], Standard 1. |
| hi_filter_thed0 | Abstimmparameter | Bei Berechnung des ersten hochfrequenten Bewegungsgewichts von der Differenz abzuziehender Datenversatz. Bereich [0, 4095], Standard 256. |
| hi_filter_rat1 | Abstimmparameter | Bei Berechnung des zweiten hochfrequenten Bewegungsgewichts von der Differenz abzuziehender Datenanteil. Bereich [0.0, 16.0], Standard 1. |
| hi_filter_thed1 | Abstimmparameter | Bei Berechnung des zweiten hochfrequenten Bewegungsgewichts von der Differenz abzuziehender Datenversatz. Bereich [0, 4095], Standard 1024. |
| hi_filter_abs_ctrl | Abstimmparameter | Position der Absolutwertbildung bei der hochfrequenten Gewichtsberechnung: 0 Differenz→Median→Gauß→abs; 1 Differenz→Median→abs→Gauß. Standard 0. |
| hi_filter_filt_bay | Abstimmparameter | Gauß-Filterung bei hochfrequenter Gewichtsberechnung: 1 berechnet die 4 Bayer-Kanäle separat mit 3x3-Gauß; 0 berechnet sie nicht separat und verwendet 5x7-Gauß. Standard 0. |
| hi_filter_filt_avg | Abstimmparameter | 5x5-Filterung bei hochfrequenter Gewichtsberechnung: 0 aus, 1 ein; Standard 0. |
| hi_filter_filt_mode | Abstimmparameter | Filtermodus für die hochfrequente Gewichtsberechnung, Bereich [0, 4], Standard 4. |
| guass_guide_coeff0 | Abstimmparameter | Gauß-Filteroperatoren, Bereich [0, 64], Standardwerte 16,8,16,8. |

<!-- Source EN PDF p.236; unit 2751 -->

9.4.4.16  RK_Bayertnr_Fix_V2_t

<!-- Source EN PDF p.236; unit 2752 -->

【Beschreibung】 Registerkonfiguration des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.236; unit 2753 -->

【Definition】

<!-- Source EN PDF p.237; unit 2754 -->

```text
 typedef struct RK_Bayertnr_Fix_V2_s {
     // BAY3D_BAY3D_CTRL 0x2c00
     uint8_t bay3d_exp_sel;
     uint8_t bay3d_soft_st;
     uint8_t bay3d_soft_mode;
     uint8_t bay3d_bwsaving_en;
     uint8_t bay3d_loswitch_protect;
     uint8_t bay3d_glbpk_en;
     uint8_t bay3d_logaus3_bypass_en;
     uint8_t bay3d_logaus5_bypass_en;
     uint8_t bay3d_lomed_bypass_en;
     uint8_t bay3d_hichnsplit_en;
     uint8_t bay3d_hiabs_pssel;
     uint8_t bay3d_higaus_bypass_en;
     uint8_t bay3d_himed_bypass_en;
     uint8_t bay3d_lobypass_en;
     uint8_t bay3d_hibypass_en;
     uint8_t bay3d_bypass_en;
     uint8_t bay3d_en_i;
     // BAY3D_BAY3D_KALRATIO 0x2c04
     uint16_t bay3d_softwgt;
     uint16_t bay3d_hidif_th;
     // BAY3D_BAY3D_GLBPK2 0x2c08
     uint32_t bay3d_glbpk2;
     // BAY3D_BAY3D_WGTLMT 0x2c10
     uint16_t bay3d_wgtlmt;
     uint16_t bay3d_wgtratio;
     // BAY3D_BAY3D_SIG_X0  0x2c14 - 0x2c30
     uint16_t bay3d_sig0_x[16];
     // BAY3D_BAY3D_SIG0_Y0 0x2c34 - 0x2c50
     uint16_t bay3d_sig0_y[16];
     // BAY3D_BAY3D_SIG_X0  0x2c54 - 0x2c70
     uint16_t bay3d_sig1_x[16];
     // BAY3D_BAY3D_SIG1_Y0 0x2c74 - 0x2c90
     uint16_t bay3d_sig1_y[16];
     // BAY3D_BAY3D_SIG2_Y0 0x2c94 - 0x2cb0
     uint16_t bay3d_sig2_y[16];
     //BAY3D_BAY3D_LODIF_STAT0 0x2cb4 -0x2cb8
     uint64_t ro_sum_lodif;
     //BAY3D_BAY3D_LODIF_STAT0 0x2cbc -0x2cc0
     uint64_t ro_sum_hidif0;
     //BAY3D_BAY3D_MI_ST 0x2CC8
     uint8_t sw_bay3dmi_st_linemode;
     uint8_t sw_bay3d_mi2cur_linecnt;
 } RK_Bayertnr_Fix_V2_t;
```

<!-- Source EN PDF p.238; unit 2755 -->

【Felder】

<!-- Source EN PDF p.239; unit 2756 -->

| Parameter | Bitbreite | Parameterbeschreibung |
|---|---|---|
| bay3d_soft_st | 1 | Startimpulsbit des Softwaremodus; beim Einschalten 1 schreiben. |
| bay3d_soft_mode | 1 | Softwaremodus: 1 ein, 0 aus; Standard 0x0. |
| bay3d_bwsaving_en | 1 | Bandbreitenoptimierung aktivieren, nur ohne HDR wirksam: 1 ein, 0 aus; Standard 0x0. |
| bay3d_loswitch_protect | 1 | Derzeit nicht unterstützt. |
| bay3d_glbpk_en | 1 | Globalen pk für zeitliche Bayer-Entrauschung verwenden: 1 globaler pk, 0 lokaler pk; Standard 1. |
| bay3d_logaus3_bypass_en | 1 | Niederfrequente Gauß-Filterung im nachgeschalteten Helligkeitsbereich: 1 nicht ausführen, 0 ausführen; Standard 0x0. |
| bay3d_logaus5_bypass_en | 1 | Niederfrequente Gauß-Filterung im vorgeschalteten Bayer-Bereich: 1 nicht ausführen, 0 ausführen; Standard 0x0. |
| bay3d_lomed_bypass_en | 1 | Niederfrequente Medianfilterung: 1 nicht ausführen, 0 ausführen; Standard 0x0. |
| bay3d_hichnsplit_en | 1 | Auswahl des Gauß-Filters bei hochfrequenter Erkennung im Bayer- oder Helligkeitsbereich; dieses Bit einschalten, wenn ausschließlich hochfrequente Bewegungserkennung aktiv ist. 1 Bayer-Bereich, 0 Helligkeitsbereich; Standard 0x0. |

<!-- Source EN PDF p.240; unit 2757 -->

| Parameter | Bitbreite | Parameterbeschreibung |
|---|---|---|
| bay3d_hiabs_pssel | 1 | Absolutwert vor der Gauß-Filterung bei Hochfrequenzerkennung bilden; dieses Bit einschalten, wenn ausschließlich hochfrequente Bewegungserkennung aktiv ist. 1 ja, 0 nein; Standard 0x0. |
| bay3d_higaus_bypass_en | 1 | Hochfrequente Gauß-Filterung: 1 nicht ausführen, 0 ausführen; Standard 0x0. |
| bay3d_himed_bypass_en | 1 | Hochfrequente Medianfilterung: 1 nicht ausführen, 0 ausführen; Standard 0x0. |
| bay3d_lobypass_en | 1 | Laut Quelle hochfrequente Bewegungserkennung: 1 aus, 0 ein; Standard 0x0. Derzeit keine dynamische Änderung unterstützt; stets Standard 0. Die abweichende lo-Feldbeschreibung bleibt erhalten. |
| bay3d_hibypass_en | 1 | Hochfrequente Bewegungserkennung: 1 aus, 0 ein; Standard 0x0. |
| bay3d_bypass_en | 1 | Bypass der zeitlichen Bayer-Entrauschung: 1 Bypass ein, bayer3d führt nichts aus; 0 Bypass aus. Standard 0. |
| bay3d_en_i | 1 | Zeitliche Bayer-Entrauschung: 1 ein, 0 aus; Standard 0. |
| bay3d_softwgt | 10 | Gewicht der weichen Schwelle: größere Werte erhöhen die Schwelle und lassen mehr Rauschen erhalten. 10bit Nachkommanteil, Standard 0x100. |
| bay3d_hidif_th | 16 | Schwelle zum Zählen hochfrequenter Differenzwerte; Standard 0xffff. |
| bay3d_glbpk2 | 28 | Quadrat des globalen pk; laut Quelle nur bei pk_en = 0 verwendet. Standard 0x800. |
| bay3d_wgtlmt | 10 | Gewichtsgrenze der Bildüberlagerung, 10 Nachkommastellen laut Quelle; Standard 0x380. |

<!-- Source EN PDF p.241; unit 2758 -->

| Parameter | Bitbreite | Parameterbeschreibung |
|---|---|---|
| bay3d_wgtratio | 10 | Verhältnis der ergänzenden Überlagerungsgewichtung; nur bei eingeschalteter Hochfrequenz wirksam. 10 Nachkommastellen laut Quelle, Standard 0x0. |
| bay3d_sig0_x0-15 | 16 | 16 Helligkeitsstufen der Rauschkurve; Differenzen zweier Werte müssen einer Potenz von 2 entsprechen. |
| bay3d_sig0_y0-15 | 14 | 16 Rausch-Sigma-Stufen der Rauschkurve; Parameter werden kalibriert. |
| bay3d_sig1_x0-15 | 16 | 16 Helligkeitsstufen der hoch- und niederfrequenten Rauschkurven; Differenzen zweier Werte müssen einer Potenz von 2 entsprechen. |
| bay3d_sig1_y0-15 | 14 | 16 Rausch-SIGMA-Stufen der hochfrequenten Rauschkurven; Parameter werden kalibriert. |
| bay3d_sig2_y0-15 | 14 | 16 Rausch-Sigma-Stufen der niederfrequenten Rauschkurven; Parameter werden kalibriert. |

<!-- Source EN PDF p.241; unit 2759 -->

9.4.4.17  rk_aiq_bayertnr_strength_v2_t

<!-- Source EN PDF p.241; unit 2760 -->

【Beschreibung】 Struktur zur Entrauschungsstärke definieren.

<!-- Source EN PDF p.241; unit 2761 -->

【Definition】

<!-- Source EN PDF p.241; unit 2762 -->

```text
 typedef struct rk_aiq_bayertnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayertnr_strength_v2_t;
```

<!-- Source EN PDF p.241; unit 2763 -->

【Felder】

<!-- Source EN PDF p.241; unit 2764 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| percent | Entrauschungsstärke, Bereich 0.0-1.0. |

<!-- Source EN PDF p.241; unit 2765 -->

9.4.4.18  rk_aiq_ynr_attrib_v3_t

<!-- Source EN PDF p.241; unit 2766 -->

【Beschreibung】 Parameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.241; unit 2767 -->

【Definition】

<!-- Source EN PDF p.242; unit 2768 -->

```text
 typedef struct rk_aiq_ynr_attrib_v3_s {
     rk_aiq_uapi_sync_t sync;
     Aynr_OPMode_V3_t eMode;
     Aynr_Auto_Attr_V3_t stAuto;
     Aynr_Manual_Attr_V3_t stManual;
 } rk_aiq_ynr_attrib_v3_t;
```

<!-- Source EN PDF p.242; unit 2769 -->

【Felder】

<!-- Source EN PDF p.242; unit 2770 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| eMode | Ynr-Entrauschungsmodus |
| stAuto | YNR-Parameter für den automatischen Modus |
| stManual | Ynr-Parameter für den manuellen Modus |

<!-- Source EN PDF p.242; unit 2771 -->

9.4.4.19  Aynr_OPMode_V3_t

<!-- Source EN PDF p.242; unit 2772 -->

【Beschreibung】 Modus des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.242; unit 2773 -->

【Definition】

<!-- Source EN PDF p.242; unit 2774 -->

```text
 typedef enum Aynr_OPMode_V3_e {
     AYNRV3_OP_MODE_INVALID           = 0,
     AYNRV3_OP_MODE_AUTO              = 1,
     AYNRV3_OP_MODE_MANUAL            = 2,
     AYNRV3_OP_MODE_REG_MANUAL        = 3,
     AYNRV3_OP_MODE_MAX
 } Aynr_OPMode_V3_t;
```

<!-- Source EN PDF p.242; unit 2775 -->

【Felder】

<!-- Source EN PDF p.242; unit 2776 -->

| Feldname | Beschreibung |
|---|---|
| AYNRV3_OP_MODE_INVALID | Ungültiger Modus des Y-Bereich-YNR-Entrauschungsmoduls |
| AYNRV3_OP_MODE_AUTO | Automatischer Modus des Y-Bereich-YNR-Entrauschungsmoduls |
| AYNRV3_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des Y-Bereich-YNR-Entrauschungsmoduls |
| AYNRV3_OP_MODE_REG_MANUAL | Registereinstellungen für den manuellen Modus des Y-Bereich-YNR-Entrauschungsmoduls |
| AYNRV3_OP_MODE_MAX | Maximalwert der Y-Bereich-YNR-Modi; ungültiger Modus. |

<!-- Source EN PDF p.243; unit 2777 -->

9.4.4.20  Aynr_Auto_Attr_V3_t

<!-- Source EN PDF p.243; unit 2778 -->

【Beschreibung】 Automatische Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.243; unit 2779 -->

【Definition】

<!-- Source EN PDF p.243; unit 2780 -->

```text
 typedef struct Aynr_Auto_Attr_V3_s
 {
     RK_YNR_Params_V3_t stParams;
     RK_YNR_Params_V3_Select_t stSelect;
 } Aynr_Auto_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2781 -->

【Felder】

<!-- Source EN PDF p.243; unit 2782 -->

| Feldname | Beschreibung |
|---|---|
| stParams | Algorithmusparameter des ynr-Moduls für jede ISO-Stufe |
| stSelect | Vom ynr-Modul berechnete Eigenschaftsparameter |

<!-- Source EN PDF p.243; unit 2783 -->

9.4.4.21  Aynr_Manual_Attr_V3_t

<!-- Source EN PDF p.243; unit 2784 -->

【Beschreibung】 Manuelle Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.243; unit 2785 -->

【Definition】

<!-- Source EN PDF p.243; unit 2786 -->

```text
 typedef struct Aynr_Manual_Attr_V3_s
 {
     RK_YNR_Params_V3_Select_t stSelect;
     RK_YNR_Fix_V3_t stFix;
 } Aynr_Manual_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2787 -->

【Felder】

<!-- Source EN PDF p.243; unit 2788 -->

| Feldname | Beschreibung |
|---|---|
| stSelect | Algorithmusparameterwert |
| stFix | YNNR-Registerwert |

<!-- Source EN PDF p.243; unit 2789 -->

9.4.4.22  RK_YNR_Params_V3_t

<!-- Source EN PDF p.243; unit 2790 -->

【Beschreibung】 Eigenschaftsparameter des jeweiligen ISO-Algorithmus im automatischen Modus des YNR-Entrauschungsmoduls definieren.

<!-- Source EN PDF p.243; unit 2791 -->

【Definition】

<!-- Source EN PDF p.244; unit 2792 -->

```text
 typedef struct RK_YNR_Params_V3_s
 {
     int enable;
     char version[64];
     float iso[RK_YNR_V3_MAX_ISO_NUM];
     RK_YNR_Params_V3_Select_t arYnrParamsISO[RK_YNR_V3_MAX_ISO_NUM];
 } RK_YNR_Params_V3_t;
```

<!-- Source EN PDF p.244; unit 2793 -->

【Felder】

<!-- Source EN PDF p.244; unit 2794 -->

| Feldname | Beschreibung |
|---|---|
| enable | ynr-Modulschalter |
| version | Versionsnummer des ynr-Moduls |
| iso | Unterschiedliche ISO-Stufen mit unterschiedlichen Abstimmparametern; derzeit nur 13 Stufen unterstützt. |
| RK_YNR_Params_V3_Select_t | Algorithmusparameter des YYNR-Moduls |

<!-- Source EN PDF p.244; unit 2795 -->

9.4.4.23  RK_YNR_Params_V3_Select_t

<!-- Source EN PDF p.244; unit 2796 -->

【Beschreibung】 Algorithmuseigenschaften des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.244; unit 2797 -->

【Definition】

<!-- Source EN PDF p.244; unit 2798 -->

```text
 typedef struct RK_YNR_Params_V3_Select_s
 {
     int enable;
     float lci;
     float hci;
     float sigma[YNR_V3_ISO_CURVE_POINT_NUM];
     short lumaPoint[YNR_V3_ISO_CURVE_POINT_NUM];
     float lo_lumaPoint[6];
     float lo_ratio[6];
     float hi_lumaPoint[6];
     float hi_ratio[6];
     // low frequency
     float rnr_strength[17];
     int ynr_bft3x3_bypass;
     int ynr_lbft5x5_bypass;
     int ynr_lgft3x3_bypass;
     int ynr_flt1x1_bypass;
     int ynr_sft5x5_bypass;
     float low_bf1;
     float low_bf2;
     float low_thred_adj;
     float low_peak_supress;
     float low_edge_adj_thresh;
     float low_lbf_weight_thresh;
     float low_center_weight;
     float low_dist_adj;
     float low_weight;
     float low_filt1_strength;
     float low_filt2_strength;
     float low_bi_weight;
```

<!-- Source EN PDF p.245; unit 2799 -->

```text
     // high frequency
     float base_filter_weight1;
     float base_filter_weight2;
     float base_filter_weight3;
     float high_thred_adj;
     float high_weight;
     float high_direction_weight[8];
     float hi_min_adj;
     float hi_edge_thed;
     //local gain control
     float ynr_global_gain_alpha;
     float ynr_global_gain;
     float ynr_adjust_thresh;
     float ynr_adjust_scale;
 } RK_YNR_Params_V3_Select_t;
```

<!-- Source EN PDF p.245; unit 2800 -->

【Felder】

<!-- Source EN PDF p.246; unit 2801 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| enable | Abstimmparameter | ynr-Modulschalter: 1 ein, 0 aus. |
| lci | Kalibrierdaten | Einflussfaktor des niederfrequenten Rausch-Sigma. Größere Werte erhöhen das Rausch-Sigma und verstärken die Entrauschung. |
| hci | Kalibrierdaten | Einflussfaktor des hochfrequenten Rausch-Sigma. Größere Werte erhöhen das Rausch-Sigma und verstärken die Entrauschung. |
| sigma | Kalibrierdaten | Rausch-Sigma-Kurve |
| lumaPoint | Kalibrierdaten | Unterschiedlichen Pixelhelligkeiten zugeordnete Punkte der Rausch-SIGMA-Kurve, insgesamt 16 Punkte. |
| rnr_strength | Abstimmparameter | Vom Bildzentrum aus entlang des Kreisradius r unterschiedliche Entrauschungsstärken einstellen, hauptsächlich gegen LSC-Rauschen. Bereich [0, 16.0], Standard 1. |
| ynr_bft3x3_bypass | Abstimmparameter | Bypass eines internen Untermoduls: 0 Funktion ein, 1 Bypass. Üblicherweise sind sämtliche Untermodule aktiv und diese Werte auf 0 gesetzt. |
| ynr_lbft5x5_bypass | Abstimmparameter | Bypass eines internen Untermoduls: 0 Funktion ein, 1 Bypass. Üblicherweise sind sämtliche Untermodule aktiv und diese Werte auf 0 gesetzt. |
| ynr_lgft3x3_bypass | Abstimmparameter | Bypass eines internen Untermoduls: 0 Funktion ein, 1 Bypass. Üblicherweise sind sämtliche Untermodule aktiv und diese Werte auf 0 gesetzt. |
| ynr_flt1x1_bypass | Abstimmparameter | Bypass eines internen Untermoduls: 0 Funktion ein, 1 Bypass. Üblicherweise sind sämtliche Untermodule aktiv und diese Werte auf 0 gesetzt. |

<!-- Source EN PDF p.247; unit 2802 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| ynr_sft5x5_bypass | Abstimmparameter | Bypass eines internen Untermoduls: 0 Funktion ein, 1 Bypass. Üblicherweise sind sämtliche Untermodule aktiv und diese Werte auf 0 gesetzt. |
| low_bf1 | Abstimmparameter | Stärke der bilateralen 3x3-Filterung des Originalbilds. Größere Werte verstärken die Entrauschung. Bereich [0.01, 32], Standard 1. |
| low_bf2 | Abstimmparameter | Stärke der bilateralen 5x5-Filterung des verkleinerten vorherigen Frames. Größere Werte verstärken die Entrauschung. Bereich [0.01, 32], Standard 1. |
| low_thred_adj | Abstimmparameter | Niederfrequente weiche Schwelle: größere Werte verstärken die niederfrequente Entrauschung. Bereich [0, 31], Standard 0.5. |
| low_peak_supress | Abstimmparameter | Stärke der Entfernung isolierten Rauschens: kleinere Werte verstärken die Entrauschung. Bereich [0, 1], Standard 0.5. |
| low_edge_adj_thresh | Abstimmparameter | Schwelle des Anpassungsfaktors zur Kantenerkennung im verkleinerten Bild; begrenzt dessen Maximalwert. Kleinere Werte verstärken die Entrauschung und verwischen das Bild stärker. Ganzzahl im Bereich [0, 1023], Standard 7. |
| low_lbf_weight_thresh | Abstimmparameter | Begrenzt das Gewicht der bilateralen 5x5-Filterung. Größere Werte schwächen die niederfrequente Entrauschung. Bereich [0.0, 1.0], Standard 0.25. |
| low_center_weight | Abstimmparameter | Gewicht des Mittelpunkts bei bilateraler 5x5-Filterung; kleinere Werte verstärken die Entrauschung. Bereich [0,1], Standard 0.5. |
| low_dist_adj | Abstimmparameter | Anpassungsfaktor der Entfernungsgewichtung des bilateralen Filters. Kleinere Werte verstärken die Entrauschung. Bereich [0, 127.0], Standard 8.0. |
| low_weight | Abstimmparameter | Gewicht des niederfrequenten Entrauschungsergebnisses; größere Werte verstärken die niederfrequente Entrauschung. Bereich [0, 1], Standard 0.5. |

<!-- Source EN PDF p.248; unit 2803 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| low_filt1_strength | Abstimmparameter | Filterkerngewicht für Gauß-Filterung des Originalbilds. Bereich [0,1.0], Standard 0.7. |
| low_filt2_strength | Abstimmparameter | Gauß-Filterkerngewicht für die Gauß-Filterung des bilateralen Filterergebnisses. Bereich [0,1.0], Standard 0.85. |
| low_bi_weight | Abstimmparameter | Gewicht des ersten bilateralen Filters bei der Verarbeitung mit weicher Schwelle. Größere Werte verstärken die Entrauschung. Bereich [0, 1], Standard 0.3. |
| base_filter_weight1 | Abstimmparameter | Koeffizient des Richtungsfilters; normalerweise kaum anzupassen. |
| high_thred_adj | Abstimmparameter | Größere Werte verstärken die hochfrequente Entrauschung. Bereich laut Quelle 0, 31.0, Standard 1.0. |
| high_weight | Abstimmparameter | Gewicht der hochfrequenten Entrauschung: Anteil der erhaltenen Hochfrequenzkomponenten. Kleinere Werte verstärken die Entrauschung. Bereich laut Quelle 0, 1, Standard 0.78. |
| high_direction_weight | Abstimmparameter | Je größer der Wert einer Richtung, desto stärker wird entlang dieser Richtung entrauscht. |
| hi_min_adj | Abstimmparameter | Verhältnis sämtlicher Varianzwerte abzüglich des kleinsten Varianzwerts; größere Werte schärfen Kanten. Bereich laut Quelle 0.0, 1.0, Standard 0.9. |
| hi_edge_thed | Abstimmparameter | Kleinere Schwellen verstärken die hochfrequente Entrauschung. Ganzzahl im Bereich 0, 255, Standard 100. |
| ynr_global_gain_alpha | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem Ynr-Entrauschungsmodus. Üblicherweise Standardwert ohne Konfiguration verwenden; dann ausschließlich lokale Verstärkung. Bereich laut Quelle [0.0 1.0], Standard 0. |
| ynr_global_gain | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem Ynr-Entrauschungsmodus. Üblicherweise Standardwert ohne Konfiguration verwenden; dann ausschließlich lokale Verstärkung. Verstärkungsbereich laut Quelle [0.0 64.0], Standard 1. |

<!-- Source EN PDF p.249; unit 2804 -->

| Feldname | Parametertyp | Beschreibung |
|---|---|---|
| ynr_adjust_thresh | Abstimmparameter | Entrauschungsstärke für Rauschen oberhalb ynr_adjust_thresh. Bewegte Bereiche rauschen stärker; eine passende Schwelle erhöht dort die YNR-Entrauschung. Bereich [0.0, 1.0], Standard 1. |
| ynr_adjust_scale | Abstimmparameter | Entrauschungsstärke für Rauschen oberhalb ynr_adjust_thresh. Bewegte Bereiche rauschen stärker; eine passende Schwelle erhöht dort die YNR-Entrauschung. Bereich [0, 16.0], Standard 1. |
| lo_lumaPoint / lo_ratio | Abstimmparameter | Niederfrequentes Sigma für verschiedene Pixelhelligkeiten feinabstimmen. |
| hi_lumaPoint / hi_ratio | Abstimmparameter | Hochfrequentes Sigma für verschiedene Pixelhelligkeiten feinabstimmen. |

<!-- Source EN PDF p.249; unit 2805 -->

9.4.4.24  RK_YNR_Fix_V3_t

<!-- Source EN PDF p.249; unit 2806 -->

【Beschreibung】 Registerkonfiguration des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.249; unit 2807 -->

【Definition】

<!-- Source EN PDF p.249; unit 2808 -->

```text
 typedef struct RK_YNR_Fix_V3_s {
     // YNR_2700_GLOBAL_CTRL (0x0000)
     uint8_t ynr_rnr_en;
     uint8_t ynr_gate_dis;
     uint8_t ynr_thumb_mix_cur_en;
     uint8_t ynr_global_gain_alpha;
     uint16_t ynr_global_gain;
     uint8_t ynr_flt1x1_bypass_sel;
     uint8_t ynr_sft5x5_bypass;
     uint8_t ynr_flt1x1_bypass;
     uint8_t ynr_lgft3x3_bypass;
     uint8_t ynr_lbft5x5_bypass;
     uint8_t ynr_bft3x3_bypass;
     uint8_t ynr_en;
```

<!-- Source EN PDF p.249; unit 2809 -->

```text
     // YNR_2700_RNR_MAX_R  (0x0004)
     uint8_t ynr_local_gainscale;
     uint16_t ynr_rnr_max_r;
     // YNR_2700_RNR_MAX_R  (0x0008)
     uint16_t ynr_rnr_center_coorv;
     uint16_t ynr_rnr_center_coorh;
     // YNR_2700_RNR_MAX_R  (0x000c)
     uint8_t ynr_localgain_adj;
     uint16_t ynr_localgain_adj_thresh;
     // YNR_2700_LOWNR_CTRL0 (0x0010)
     uint16_t ynr_low_bf_inv[2];
     // YNR_2700_LOWNR_CTRL1  (0x0014)
     uint8_t ynr_low_peak_supress;
     uint16_t ynr_low_thred_adj;
     // YNR_2700_LOWNR_CTRL2 (0x0018)
     uint16_t ynr_low_dist_adj;
     uint16_t ynr_low_edge_adj_thresh;
     // YNR_2700_LOWNR_CTRL3 (0x001c)
     uint8_t ynr_low_bi_weight;
     uint8_t ynr_low_weight;
     uint16_t ynr_low_center_weight;
     // YNR_2700_HIGHNR_CTRL0 (0x0020)
     uint8_t ynr_hi_min_adj;
     uint16_t ynr_high_thred_adj;
     // YNR_2700_HIGHNR_CTRL1  (0x0024)
     uint8_t ynr_high_retain_weight;
     uint8_t ynr_hi_edge_thed;
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x0028)
     uint8_t ynr_base_filter_weight[3];
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x002c)
     uint32_t ynr_frame_full_size;
     uint16_t ynr_lbf_weight_thres;
     // YNR_2700_GAUSS1_COEFF  (0x0030)
     uint16_t ynr_low_gauss1_coeff[3];
     // YNR_2700_GAUSS2_COEFF  (0x0034)
     uint16_t ynr_low_gauss2_coeff[3];
     // YNR_2700_DIRECTION_W_0_3  (0x0038 - 0x003c)
     uint8_t ynr_direction_weight[8];
     // YNR_2700_SGM_DX_0_1 (0x0040 - 0x0060)
     uint16_t ynr_luma_points_x[17];
     // YNR_2700_LSGM_Y_0_1 (0x0070- 0x0090)
     uint16_t ynr_lsgm_y[17];
     // YNR_2700_HSGM_Y_0_1 (0x00a0- 0x00c0)
     uint16_t ynr_hsgm_y[17];
     // YNR_2700_RNR_STRENGTH03 (0x00d0- 0x00e0)
     uint16_t ynr_rnr_strength[17];
 } RK_YNR_Fix_V3_t;
```

<!-- Source EN PDF p.251; unit 2810 -->

【Felder】

<!-- Source EN PDF p.252; unit 2811 -->

| Feldname | Bitbreite<br>(Ganzzahl.<br>Nachkomma) | Beschreibung |
|---|---|---|
| ynr_low_bf_inv[0] | 5.9 | Steuert die Entrauschungsstärke; der Registerwert wird reziprok verwendet. Kleinere Werte verstärken die Entrauschung. 512 bedeutet 1x, 256 bedeutet 2x Entrauschungsstärke. Bereich [1, 16383]. |
| ynr_low_bf[1] | 5.9 | Steuert die Entrauschungsstärke; der Registerwert wird reziprok verwendet. Kleinere Werte verstärken die Entrauschung. 512 bedeutet 1x, 256 bedeutet 2x Entrauschungsstärke. |
| ynr_low_thred_adj | 5.6 | Anpassungsstärke der niederfrequenten weichen Schwelle; größere Werte verstärken die niederfrequente Entrauschung. Bereich [0, 2047]. |
| ynr_low_peak_supress | 1.7 | Stärke der Entfernung großer isolierter Rauschpunkte; größere Werte verstärken sie. Bereich [0, 128]. |
| ynr_low_edge_adj_thresh | 11.0 | Schwelle des Anpassungsfaktors zur Kantenerkennung im verkleinerten Bild; begrenzt dessen Maximalwert. Bereich [1, 1024]. |
| ynr_low_center_weight | 1.10 | Mittelpunktsgewicht der bilateralen 5x5-Filterung; kleinere Werte verstärken die Entrauschung. Bereich [1, 1024]. |
| sw_ynr_lbf_weight_thres | 10.0 | Begrenzt das Gewicht der bilateralen 5x5-Filterung; größere Werte schwächen die niederfrequente Entrauschung. Bereich [0, 1023]. |
| ynr_low_dist_adj | 7.2 | Anpassungsfaktor der Entfernungsgewichtung des bilateralen Filters. Bereich [1, 511]. |
| ynr_low_weight | 1.7 | Gewicht des niederfrequenten Entrauschungsergebnisses; größere Werte verstärken die niederfrequente Entrauschung. Bereich [0, 128]. |
| ynr_low_gauss1_coeff[3] | 1.8 | Gewichtsbereich des Gauß-Filterkerns zur Filterung des Originalbilds: [0, 256]. |
| ynr_low_gauss2_coeff[3] | 1.8 | Gewichtsbereich des Gauß-Filterkerns zur Gauß-Filterung des bilateralen Filterergebnisses: [0, 256]. |

<!-- Source EN PDF p.253; unit 2812 -->

| Feldname | Bitbreite<br>(Ganzzahl.<br>Nachkomma) | Beschreibung |
|---|---|---|
| ynr_low_bi_weight | 1.7 | Gewicht des ersten bilateralen Filters bei weicher Schwellenverarbeitung; größere Werte verstärken die Entrauschung. Bereich [0, 128]. |
| ynr_base_filter_weight[3] | 1.6 | Koeffizient des Richtungsfilters. Bereich [0, 64]. |
| ynr_high_thred_adj | 5.6 | Größere Werte verstärken die hochfrequente Entrauschung. Bereich [0, 2047]. |
| ynr_high_retain_weight | 1.7 | Gewicht der hochfrequenten Entrauschung; Anteil der erhaltenen Hochfrequenzkomponente. Größere Werte schwächen die Entrauschung. Bereich [0, 128]. |
| ynr_direction_weight[8] | 1.4 | Größere Werte einer Richtung verstärken die Entrauschung entlang dieser Richtung. Bereich [0,16]. |
| ynr_hi_min_adj | 0.6 | Verhältnis sämtlicher Varianzwerte abzüglich des kleinsten Varianzwerts; größere Werte schärfen Kanten. Bereich [6,60]. |
| ynr_hi_edge_thed | 10.0 | Kleinere Schwellen verstärken die hochfrequente Entrauschung. Bereich [0,1023]. |
| ynr_rnr_max_r | 14.0 | Anpassung der radialen Entrauschungsstärke; speichert 1/((rows/2)^2+(cols/2)^2). Die ersten 9 Bits sind Mantisse M, die letzten 5 Bits Exponent E. Bereich [1, 16383]. |
| ynr_rnr_strength[17] | 4.4 | Steuert die radiale Entrauschungsstärke mit insgesamt 17 Datenpunkten in 16 Segmenten: Entrauschung vom Bildzentrum zu den vier Bildecken. Bereich [0, 15]. |
| ynr_global_gain | 6.4 | Extern konfigurierte globale Verstärkung zur Steuerung der gesamten YNR-Entrauschungsstärke. Größere Werte verstärken die Entrauschung. Bereich [0, 1023]. |

<!-- Source EN PDF p.254; unit 2813 -->

| Feldname | Bitbreite<br>(Ganzzahl.<br>Nachkomma) | Beschreibung |
|---|---|---|
| ynr_global_gain_alpha | 1.3 | Anteil der vom Gain-Modul gelieferten und der extern konfigurierten Verstärkung. Größere Werte verwenden mehr externe globale Verstärkung. Bereich [0, 8]. |
| ynr_bft3x3_bypass | 1 | Bei 1 bilaterale 3x3-Filterung ausschalten. Wertebereich 0 oder 1. |
| ynr_lbft5x5_bypass | 1 | Bei 1 bilaterale 5x5-Filterung ausschalten. Wertebereich 0 oder 1. |
| ynr_lgft3x3_bypass | 1 | Bei 1 Gauß-Filterung mit 3x3 ausschalten. |
| ynr_flt1x1_bypass | 1 | Bei 1 niederfrequente Verarbeitung mit weicher Schwelle ausschalten. Wertebereich 0 oder 1. |
| ynr_sft5x5_bypass | 1 | Laut Quelle bei 5 die hochfrequente 1x5-Rauschunterdrückung ausschalten; zugleich nennt die Quelle den Wertebereich 0 oder 1. Dieser Widerspruch ist nicht aufgelöst. |

<!-- Source EN PDF p.254; unit 2814 -->

9.4.4.25  rk_aiq_ynr_strength_v3_t

<!-- Source EN PDF p.254; unit 2815 -->

【Beschreibung】 Struktur zur Entrauschungsstärke definieren.

<!-- Source EN PDF p.254; unit 2816 -->

【Definition】

<!-- Source EN PDF p.254; unit 2817 -->

```text
 typedef struct rk_aiq_ynr_strength_v3_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
     bool strength_enable;
 } rk_aiq_ynr_strength_v3_t;
```

<!-- Source EN PDF p.254; unit 2818 -->

【Felder】

<!-- Source EN PDF p.254; unit 2819 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| percent | Entrauschungsstärke, Bereich 0.0-1.0. |

<!-- Source EN PDF p.254; unit 2820 -->

9.4.4.26  rk_aiq_cnr_attrib_v2_t

<!-- Source EN PDF p.254; unit 2821 -->

【Beschreibung】 Parameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.254; unit 2822 -->

【Definition】

<!-- Source EN PDF p.255; unit 2823 -->

```text
 typedef struct rk_aiq_cnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     AcnrV2_OPMode_t eMode;
     Acnr_Auto_Attr_V2_t stAuto;
     Acnr_Manual_Attr_V2_t stManual;
 } rk_aiq_cnr_attrib_v2_t;
```

<!-- Source EN PDF p.255; unit 2824 -->

【Felder】

<!-- Source EN PDF p.255; unit 2825 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| eMode | CNR-Entrauschungsmodus |
| stAuto | CNR-Parameter für den automatischen Modus |
| stManual | CNR-Parameter für den manuellen Modus |

<!-- Source EN PDF p.255; unit 2826 -->

9.4.4.27  AcnrV2_OPMode_t

<!-- Source EN PDF p.255; unit 2827 -->

【Beschreibung】 Moduseigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.255; unit 2828 -->

【Definition】

<!-- Source EN PDF p.255; unit 2829 -->

```text
 typedef enum AcnrV2_OPMode_e {
     ACNRV2_OP_MODE_INVALID           = 0,
     ACNRV2_OP_MODE_AUTO              = 1,
     ACNRV2_OP_MODE_MANUAL            = 2,
     ACNRV2_OP_MODE_REG_MANUAL        = 3,
     ACNRV2_OP_MODE_MAX
 } AcnrV2_OPMode_t;
```

<!-- Source EN PDF p.255; unit 2830 -->

【Felder】

<!-- Source EN PDF p.255; unit 2831 -->

| Feldname | Beschreibung |
|---|---|
| ACNRV2_OP_MODE_INVALID | Ungültiger Modus des UV-Bereich-CNR-Entrauschungsmoduls |
| ACNRV2_OP_MODE_AUTO | Automatischer Modus des UV-Bereich-CNR-Entrauschungsmoduls |
| ACNRV2_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des UV-Bereich-CNR-Entrauschungsmoduls |
| ACNRV2_OP_MODE_REG_MANUAL | Registereinstellungen für den manuellen Modus des UV-Bereich-CNR-Entrauschungsmoduls |
| ACNRV2_OP_MODE_MAX | Maximalwert der UV-Bereich-CNR-Modi; ungültiger Modus. |

<!-- Source EN PDF p.256; unit 2832 -->

9.4.4.28  Acnr_Auto_Attr_V2_t

<!-- Source EN PDF p.256; unit 2833 -->

【Beschreibung】 Automatische Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.256; unit 2834 -->

【Definition】

<!-- Source EN PDF p.256; unit 2835 -->

```text
 typedef struct Acnr_Auto_Attr_V2_s
 {
     all ISO params and select param
 RK_CNR_Params_V2_t stParams;
     RK_CNR_Params_V2_Select_t stSelect;
 } Acnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2836 -->

【Felder】

<!-- Source EN PDF p.256; unit 2837 -->

| Feldname | Beschreibung |
|---|---|
| stParams | Algorithmusparameter des CNR-Moduls je ISO-Stufe |
| stSelect | Vom CNR-Modul berechnete Eigenschaftsparameter |

<!-- Source EN PDF p.256; unit 2838 -->

9.4.4.29  Acnr_Manual_Attr_V2_t

<!-- Source EN PDF p.256; unit 2839 -->

【Beschreibung】 Manuelle Eigenschaften des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.256; unit 2840 -->

【Definition】

<!-- Source EN PDF p.256; unit 2841 -->

```text
 typedef struct Acnr_Manual_Attr_V2_s
 {
     RK_CNR_Params_V2_Select_t stSelect;
 RK_CNR_Fix_V2_t stFix;
 } Acnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2842 -->

【Felder】

<!-- Source EN PDF p.256; unit 2843 -->

| Feldname | Beschreibung |
|---|---|
| stSelect | Algorithmusparameterwerte |
| stSelect | Registerwert |

<!-- Source EN PDF p.257; unit 2844 -->

9.4.4.30  RK_CNR_Params_V2_t

<!-- Source EN PDF p.257; unit 2845 -->

【Beschreibung】 Automatikmodus und ISO-abhängige Algorithmusparameter des Entrauschungsmoduls definieren.

<!-- Source EN PDF p.257; unit 2846 -->

【Definition】

<!-- Source EN PDF p.257; unit 2847 -->

```text
 typedef struct RK_CNR_Params_V2_s
 {
     int enable;
     float iso[RK_CNR_V2_MAX_ISO_NUM];
     int hf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     int lf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     // gain
     float global_gain[RK_CNR_V2_MAX_ISO_NUM];
     float global_gain_alpha[RK_CNR_V2_MAX_ISO_NUM];
     float local_gain_scale[RK_CNR_V2_MAX_ISO_NUM];
     // strength adj by gain
     int gain_adj_strength_ratio[RK_CNR_V2_MAX_ISO_NUM]
 [RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj[RK_CNR_V2_MAX_ISO_NUM];
     float color_sat_adj_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // step1
     // median filter
     float hf_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float hf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float hf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float hf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     int  hf_bf_wgt_clip[RK_CNR_V2_MAX_ISO_NUM];
```

<!-- Source EN PDF p.257; unit 2848 -->

```text
     // step2
     // median filter
     float thumb_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float thumb_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float thumb_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     // step3
     // bilateral filter
     float lf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float lf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float lf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_t;
```

<!-- Source EN PDF p.258; unit 2849 -->

【Felder】

<!-- Source EN PDF p.259; unit 2850 -->

| Parametername | Parametertyp | Parameterbeschreibung |
|---|---|---|
| Enable | Abstimmparameter | Modulschalter: 1 ein, 0 aus. |
| iso | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen Abstimmparametern; derzeit nur 13 Stufen unterstützt. |
| hf_bypass | Abstimmparameter | Bypass der hochfrequenten Entrauschung: 0 kein Bypass, 1 Bypass. |
| lf_bypass | Abstimmparameter | Bypass der niederfrequenten Entrauschung: 0 kein Bypass, 1 Bypass. |
| global_gain | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich 0.0 bis 64.0, Standard 1. |
| global_gain_alpha | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich laut Quelle 0.0 1.0, Standard 0. |
| global_gain_scale | Abstimmparameter | Verstärkt die CNR-Entrauschung. Normalerweise Standardwert verwenden und nicht leichtfertig anpassen. Bereich laut Quelle 0, 128, Standard 1. |
| gain_adj_strength_ratio | Abstimmparameter | Filterstärke anhand lokaler Verstärkung anpassen. Kleinere Werte verstärken die Rauschentfernung. Bereich [1, 255], Standard 255. |
| color_sat_adj | Abstimmparameter | Gradientenabhängig angepasster UV-Anteil der bilateralen Filterung, 1~255. Kleinere Werte verbessern die Farbrauschentfernung. Bereich [1, 255], Standard 40. |
| color_sat_adj_alpha | Abstimmparameter | Anpassungsanteil von color_sat_adj. Größere Werte verbessern die Farbrauschentfernung. Bereich laut Quelle 0, 1.0, Standard 0.8. |
| hf_spikes_reducion_strength | Abstimmparameter | Stärke der hochfrequenten Medianfilterung; größere Werte verstärken sie. Bereich laut Quelle 0, 1.0, Standard 0.5. |

<!-- Source EN PDF p.260; unit 2851 -->

| Parametername | Parametertyp | Parameterbeschreibung |
|---|---|---|
| hf_denoise_strength | Abstimmparameter | Stärke der hochfrequenten bilateralen Filterung; größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 10. |
| hf_color_sat | Abstimmparameter | UV-Skalierungsfaktor der hochfrequenten bilateralen Filterung. Kleinere Werte senken die Farbsättigung stärker. Bereich laut Quelle 0.0, 7.9, Standard 1.5. |
| hf_denoise_alpha | Abstimmparameter | Mittelpunktsgewicht des hochfrequenten bilateralen Filters. Bereich laut Quelle 0.0, 1.0, Standard 0. |
| hf_bf_wgt_clip | Abstimmparameter | Minimale Entrauschung hoher Frequenzen. Größere Werte verstärken die Entrauschung. Bereich laut Quelle 0, 255, Standard 0. |
| thumb_spikes_reducion_strength | Abstimmparameter | Stärke der Medianfilterung des Vorschaubilds. Größere Werte verstärken sie. Bereich laut Quelle 0.0, 1.0, Standard 0.5. |
| thumb_denoise_strength | Abstimmparameter | Stärke der bilateralen Filterung des Vorschaubilds. Größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 8. |
| thumb_color_sat | Abstimmparameter | UV-Skalierungsfaktor der bilateralen Filterung des Vorschaubilds; laut Quelle sinkt die Farbsättigung stärker. Bereich 0.0, 7.9, Standard 4. Die Quelle gibt hier keine eindeutige Änderungsrichtung des Parameters an. |
| lf_denoise_strength | Abstimmparameter | Stärke der niederfrequenten bilateralen Filterung. Größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 8. |
| lf_color_sat | Abstimmparameter | UV-Anteil der niederfrequenten bilateralen Filterung. Kleinere Werte senken die Farbsättigung stärker. Bereich laut Quelle 0.0, 7.9, Standard 4. |
| lf_denoise_alpha | Abstimmparameter | Mittelpunktsgewicht des niederfrequenten bilateralen Filters. Bereich laut Quelle 0.0, 1.0, Standard 0.5. |
| kernel_5x5 | Abstimmparameter | Filterkern der bilateralen 5x5-Filterung |

<!-- Source EN PDF p.261; unit 2852 -->

9.4.4.31  RK_CNR_Params_V2_Select_t

<!-- Source EN PDF p.261; unit 2853 -->

【Beschreibung】 Algorithmuseigenschaften des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.261; unit 2854 -->

【Definition】

<!-- Source EN PDF p.261; unit 2855 -->

```text
 typedef struct RK_CNR_Params_V2_Select_s
 {
     int enable;
     // bypass
     int hf_bypass;
     int lf_bypass;
     // gain
     // gain
     float global_gain;
     float global_gain_alpha;
     float local_gain_scale;
     // strength adj by gain
     int gain_adj_strength_ratio[RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj;
     float color_sat_adj_alpha;
     // step1
     // median filter
     float hf_spikes_reducion_strength;
     // bilateral filter
     float hf_denoise_strength;
     float hf_color_sat;
     float hf_denoise_alpha;
     int hf_bf_wgt_clip;
     // step2
     // median filter
     float thumb_spikes_reducion_strength;
     // bilateral filter
     float thumb_denoise_strength;
     float thumb_color_sat;
     // step3
     // bilateral filter
     float lf_denoise_strength;
     float lf_color_sat;
     float lf_denoise_alpha;
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_Select_t;
```

<!-- Source EN PDF p.262; unit 2856 -->

【Felder】

<!-- Source EN PDF p.263; unit 2857 -->

| Parametername | Parametertyp | Parameterbeschreibung |
|---|---|---|
| Enable | Abstimmparameter | Modulschalter: 1 ein, 0 aus. |
| iso | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen Abstimmparametern; derzeit nur 13 Stufen unterstützt. |
| hf_bypass | Abstimmparameter | Bypass der hochfrequenten Entrauschung: 0 kein Bypass, 1 Bypass. |
| lf_bypass | Abstimmparameter | Bypass der niederfrequenten Entrauschung: 0 kein Bypass, 1 Bypass. |
| global_gain | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich 0.0 bis 64.0, Standard 1. |
| global_gain_alpha | Abstimmparameter | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich laut Quelle 0.0 1.0, Standard 0. |
| global_gain_scale | Abstimmparameter | Verstärkt die CNR-Entrauschung. Normalerweise Standardwert verwenden und nicht leichtfertig anpassen. Bereich laut Quelle 0, 128, Standard 1. |
| gain_adj_strength_ratio | Abstimmparameter | Filterstärke anhand lokaler Verstärkung anpassen. Kleinere Werte verstärken die Rauschentfernung. Bereich [1, 255], Standard 255. |
| color_sat_adj | Abstimmparameter | Gradientenabhängig angepasster UV-Anteil der bilateralen Filterung, 1~255. Kleinere Werte verbessern die Farbrauschentfernung. Bereich [1, 255], Standard 40. |
| color_sat_adj_alpha | Abstimmparameter | Anpassungsanteil von color_sat_adj. Größere Werte verbessern die Farbrauschentfernung. Bereich laut Quelle 0, 1.0, Standard 0.8. |
| hf_spikes_reducion_strength | Abstimmparameter | Stärke der hochfrequenten Medianfilterung; größere Werte verstärken sie. Bereich laut Quelle 0, 1.0, Standard 0.5. |

<!-- Source EN PDF p.264; unit 2858 -->

| Parametername | Parametertyp | Parameterbeschreibung |
|---|---|---|
| hf_denoise_strength | Abstimmparameter | Stärke der hochfrequenten bilateralen Filterung; größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 10. |
| hf_color_sat | Abstimmparameter | UV-Skalierungsfaktor der hochfrequenten bilateralen Filterung. Kleinere Werte senken die Farbsättigung stärker. Bereich laut Quelle 0.0, 7.9, Standard 1.5. |
| hf_denoise_alpha | Abstimmparameter | Mittelpunktsgewicht des hochfrequenten bilateralen Filters. Bereich laut Quelle 0.0, 1.0, Standard 0. |
| hf_bf_wgt_clip | Abstimmparameter | Minimale Entrauschung hoher Frequenzen. Größere Werte verstärken die Entrauschung. Bereich laut Quelle 0, 255, Standard 0. |
| thumb_spikes_reducion_strength | Abstimmparameter | Stärke der Medianfilterung des Vorschaubilds. Größere Werte verstärken sie. Bereich laut Quelle 0.0, 1.0, Standard 0.5. |
| thumb_denoise_strength | Abstimmparameter | Stärke der bilateralen Filterung des Vorschaubilds. Größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 8. |
| thumb_color_sat | Abstimmparameter | UV-Skalierungsfaktor der bilateralen Filterung des Vorschaubilds; laut Quelle sinkt die Farbsättigung stärker. Bereich 0.0, 7.9, Standard 4. Die Quelle gibt hier keine eindeutige Änderungsrichtung des Parameters an. |
| lf_denoise_strength | Abstimmparameter | Stärke der niederfrequenten bilateralen Filterung. Größere Werte verbessern die Farbrauschentfernung. Bereich [1, 1023], Standard 8. |
| lf_color_sat | Abstimmparameter | UV-Anteil der niederfrequenten bilateralen Filterung. Kleinere Werte senken die Farbsättigung stärker. Bereich laut Quelle 0.0, 7.9, Standard 4. |
| lf_denoise_alpha | Abstimmparameter | Mittelpunktsgewicht des niederfrequenten bilateralen Filters. Bereich laut Quelle 0.0, 1.0, Standard 0.5. |
| kernel_5x5 | Abstimmparameter | Filterkern der bilateralen 5x5-Filterung |

<!-- Source EN PDF p.265; unit 2859 -->

9.4.4.32  RK_CNR_Fix_V2_t

<!-- Source EN PDF p.265; unit 2860 -->

【Beschreibung】 Registerkonfiguration des manuellen Entrauschungsmodus definieren.

<!-- Source EN PDF p.265; unit 2861 -->

【Definition】

<!-- Source EN PDF p.265; unit 2862 -->

```text
 typedef struct RK_CNR_Fix_V2_s {
     //ISP_CNR_2800_CTRL
     uint8_t cnr_thumb_mix_cur_en;
     uint8_t cnr_lq_bila_bypass;
     uint8_t cnr_hq_bila_bypass;
     uint8_t cnr_exgain_bypass;
     uint8_t cnr_en_i;
     // ISP_CNR_2800_EXGAIN
     uint8_t cnr_global_gain_alpha;
     uint16_t cnr_global_gain;
     // ISP_CNR_2800_GAIN_PARA
     uint8_t cnr_gain_iso;
     uint8_t cnr_gain_offset;
     uint8_t cnr_gain_1sigma;
     // ISP_CNR_2800_GAIN_UV_PARA
     uint8_t cnr_gain_uvgain1;
     uint8_t cnr_gain_uvgain0;
     // ISP_CNR_2800_LMED3
     uint8_t cnr_lmed3_alpha;
     // ISP_CNR_2800_LBF5_GAIN
     uint8_t cnr_lbf5_gain_y;
     uint8_t cnr_lbf5_gain_c;
     // ISP_CNR_2800_LBF5_WEITD0_4
     uint8_t cnr_lbf5_weit_d[5];
     // ISP_CNR_2800_HMED3
     uint8_t cnr_hmed3_alpha;
     // ISP_CNR_2800_HBF5
     uint8_t cnr_hbf5_weit_src;
     uint8_t cnr_hbf5_min_wgt;
     uint16_t cnr_hbf5_sigma;
     // ISP_CNR_2800_LBF3
     uint8_t cnr_lbf5_weit_src;
     uint16_t cnr_lbf3_sigma;
     //ISP_CNR_2800_SIGMA0-SIGMA3
     uint8_t cnr_sigma_y[13];
 } RK_CNR_Fix_V2_t;
```

<!-- Source EN PDF p.266; unit 2863 -->

【Felder】

<!-- Source EN PDF p.267; unit 2864 -->

| Parametername | Parameterbeschreibung |
|---|---|
| cnr_thumb_mix_cur_en | Freigabe zum Mischen des Vorschaubilds des aktuellen Frames mit dem vorherigen Bild: 1'b1 Mischen ein, 1'b0 Mischen aus. Rückgelesenes Anzeigeregister. |
| cnr_lq_bila_bypass | Bypass-Freigabe des niederfrequenten bilateralen 3x3-Filters: 1'b1 Bypass ein, out_data entspricht in_data; 1'b0 Bypass aus. Rückgelesenes Anzeigeregister. |
| cnr_hq_bila_bypass | Bypass des hochfrequenten bilateralen 5x5-Filters: 1 Bypass ein, out_data entspricht in_data; 0 Bypass aus. Rückgelesenes Anzeigeregister. |
| cnr_exgain_bypass | sw_cnr_exgain_bypass: Bypass-Freigabe der externen Verstärkung. 1 Bypass ein, externe Verstärkung fest auf sw_cnr_egain_mux; 0 Bypass aus, externe Verstärkung verwenden. Laut Quelle unterstützt die aktuelle Version das Deaktivieren des Bypass nicht. Rückgelesenes Anzeigeregister. |
| cnr_en_i | CNR-Modulfreigabe: 1 ein, 0 aus. |
| cnr_global_gain | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich 0.0 bis 64.0, Standard 1. |
| cnr_global_gain_alpha | Interpolationsstärke zwischen lokalem und globalem CNR-Entrauschungsmodus. Normalerweise Standardwert ohne Konfiguration verwenden; dann lokale Verstärkung. Bereich laut Quelle 0.0 1.0, Standard 0. |
| cnr_gain_iso | Externe Verstärkung erhöhen, Bereich 0~128. |
| cnr_gain_offset | Verstärkungsversatz des Tiefpassfilters bei der Verstärkungskalibrierung, Bereich 0~16. |
| cnr_gain_1sigma | Ausgangsdaten des Hochpassfilters bei der Verstärkungskalibrierung verstärken. |
| cnr_gain_uvgain1 | uvgain-Parameter 1 |
| cnr_gain_uvgain0 | uvgain-Parameter 0 |
| cnr_lmed3_alpha | in_data-Gewicht im niederfrequenten Medianfilter, Bereich 0~16. |
| cnr_lbf5_gain_y; | Y-Verstärkung des bilateralen lbf5x5-Filters |
| cnr_lbf5_gain_c; | UV-Verstärkung des bilateralen lbf5x5-Filters |
| cnr_lbf5_weit_d[0] | Räumliches Gewicht von pix12, Bereich 1~128. |

<!-- Source EN PDF p.268; unit 2865 -->

| Parametername | Parameterbeschreibung |
|---|---|
| cnr_lbf5_weit_d[1] | Räumliches Gewicht von pix7,11,13,17, Bereich 0~128. |
| cnr_lbf5_weit_d[2] | Räumliches Gewicht von pix6,8,16,18, Bereich 0~128. |
| cnr_lbf5_weit_d[3] | Räumliches Gewicht bei Abstand 4 oder 5, Bereich 0~128. |
| cnr_lbf5_weit_d[4] | Räumliches Gewicht von pix0,4,20,24, Bereich 0~128. |
| cnr_hmed3_alpha | in_data-Gewicht im hochfrequenten Medianfilter, Bereich 0~16. |
| cnr_hbf5_weit_src | in_data-Gewicht von hbf5x5, Bereich 0~128. |
| cnr_hbf5_min_wgt | Untergrenze von hbf5x5 weit_r |
| cnr_hbf5_sigma | Sigma-Wert von hbf5x5 |
| cnr_lbf5_weit_src | in_data-Gewicht von lbf3x3, Bereich 0~128. Die Quelle nennt trotz lbf5-Feldnamen ausdrücklich lbf3x3. |
| cnr_lbf3_sigma | Sigma-Wert von lbf3x3 |

<!-- Source EN PDF p.268; unit 2866 -->

9.4.4.33  rk_aiq_cnr_strength_v2_t

<!-- Source EN PDF p.268; unit 2867 -->

【Beschreibung】 Struktur zur Entrauschungsstärke definieren.

<!-- Source EN PDF p.268; unit 2868 -->

【Definition】

<!-- Source EN PDF p.268; unit 2869 -->

```text
 typedef struct rk_aiq_cnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_cnr_strength_v2_t;
```

<!-- Source EN PDF p.268; unit 2870 -->

【Felder】

<!-- Source EN PDF p.268; unit 2871 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus; siehe Überblick/API-Beschreibung. |
| percent | Entrauschungsstärke, Bereich 0.0-1.0. |

<!-- Source EN PDF p.268; unit 2872 -->

### 9.5   BLC

<!-- Source EN PDF p.268; unit 2873 -->

#### 9.5.1  Funktionsbeschreibung

<!-- Source EN PDF p.268; unit 2874 -->

#### 9.5.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.268; unit 2875 -->

9.5.2.1  rk_aiq_user_api2_ablc_SetAttrib

<!-- Source EN PDF p.269; unit 2876 -->

【Beschreibung】 BLC-Parametereigenschaften einstellen.

<!-- Source EN PDF p.269; unit 2877 -->

【Syntax】

<!-- Source EN PDF p.269; unit 2878 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2879 -->

【Parameter】

<!-- Source EN PDF p.269; unit 2880 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | BLC-Parametereigenschaft | Eingabe |

<!-- Source EN PDF p.269; unit 2881 -->

【Rückgabewert】

<!-- Source EN PDF p.269; unit 2882 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.269; unit 2883 -->

【Voraussetzungen】

<!-- Source EN PDF p.269; unit 2884 -->

Headerdateien: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.269; unit 2885 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.269; unit 2886 -->

9.5.2.2  rk_aiq_user_api2_ablc_GetAttrib

<!-- Source EN PDF p.269; unit 2887 -->

【Beschreibung】 BLC-Parametereigenschaften abrufen.

<!-- Source EN PDF p.269; unit 2888 -->

【Syntax】

<!-- Source EN PDF p.269; unit 2889 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2890 -->

【Parameter】

<!-- Source EN PDF p.269; unit 2891 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | BLC-Parametereigenschaft | Eingabe |

<!-- Source EN PDF p.270; unit 2892 -->

【Rückgabewert】

<!-- Source EN PDF p.270; unit 2893 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.270; unit 2894 -->

【Voraussetzungen】

<!-- Source EN PDF p.270; unit 2895 -->

Headerdateien: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.270; unit 2896 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.270; unit 2897 -->

#### 9.5.3  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.270; unit 2898 -->

9.5.3.1  rk_aiq_blc_attrib_t

<!-- Source EN PDF p.270; unit 2899 -->

【Beschreibung】 Parameter des BLC-Moduls

<!-- Source EN PDF p.270; unit 2900 -->

【Definition】

<!-- Source EN PDF p.270; unit 2901 -->

```text
 typedef struct rk_aiq_blc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     AblcOPMode_t eMode;
     AblcParams_t stBlc0Auto;
     AblcParams_t stBlc1Auto;
     AblcManualAttr_t stBlc0Manual;
     AblcManualAttr_t stBlc1Manual;
 } rk_aiq_blc_attrib_t;
```

<!-- Source EN PDF p.270; unit 2902 -->

【Felder】

<!-- Source EN PDF p.270; unit 2903 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus siehe Abschnitt Überblick/API-Beschreibung |
| eMode | Modus des BLC-Moduls |
| stBlc0Auto | Parameter des automatischen blc0-Modus |
| stBlc0Manual | Parameter des manuellen blc0-Modus |
| stBlc1Auto | Parameter des automatischen blc1-Modus |
| stBlc1Manual | Parameter des manuellen blc1-Modus |

<!-- Source EN PDF p.271; unit 2904 -->

9.5.3.2  AblcOPMode_t

<!-- Source EN PDF p.271; unit 2905 -->

【Beschreibung】 Moduseigenschaften des Rauschunterdrückungsmoduls definieren.

<!-- Source EN PDF p.271; unit 2906 -->

【Definition】

<!-- Source EN PDF p.271; unit 2907 -->

```text
 typedef enum AblcOPMode_e {
     ABLC_OP_MODE_OFF         = 0,
     ABLC_OP_MODE_AUTO             = 1,
     ABLC_OP_MODE_MANUAL           = 2,
     ABLC_OP_MODE_MAX
 } AblcOPMode_t;
```

<!-- Source EN PDF p.271; unit 2908 -->

【Felder】

<!-- Source EN PDF p.271; unit 2909 -->

| Feldname | Beschreibung |
|---|---|
| ABLC_OP_MODE_OFF | Ungültiger Modus des BLC-Moduls |
| ABLC_OP_MODE_AUTO | Automatischer Modus des BLC-Moduls |
| ABLC_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des BLC-Moduls |
| ABLC_OP_MODE_MAX | Maximalwert der BLC-Modusaufzählung; ungültiger Modus |

<!-- Source EN PDF p.271; unit 2910 -->

9.5.3.3  AblcParams_t

<!-- Source EN PDF p.271; unit 2911 -->

【Beschreibung】 Parameter des automatischen BLC-Modus

<!-- Source EN PDF p.271; unit 2912 -->

【Definition】

<!-- Source EN PDF p.271; unit 2913 -->

```text
 typedef struct AblcParams_s {
     bool enable;
     int len;
     float* iso;
     float* blc_r;
     float* blc_gr;
     float* blc_gb;
     float* blc_b;
 } AblcParams_t;
```

<!-- Source EN PDF p.271; unit 2914 -->

【Felder】

<!-- Source EN PDF p.272; unit 2915 -->

| Feldname | Beschreibung |
|---|---|
| enable | Modulaktivierung: 1 aktiviert; 0 deaktiviert; |
| len | Länge des zu iso gehörenden Arrays |
| iso | ISO-Stufe |
| blc_r | BLC-Werte für unterschiedliche ISO-Stufen; Arrayzeiger |
| blc_gr | BLC-Werte für unterschiedliche ISO-Stufen; Arrayzeiger |
| blc_gb | BLC-Werte für unterschiedliche ISO-Stufen; Arrayzeiger |
| blc_b | BLC-Werte für unterschiedliche ISO-Stufen; Arrayzeiger |

<!-- Source EN PDF p.272; unit 2916 -->

9.5.3.4  AblcManualAttr_t

<!-- Source EN PDF p.272; unit 2917 -->

【Beschreibung】 Parameter des manuellen BLC-Modus

<!-- Source EN PDF p.272; unit 2918 -->

【Definition】

<!-- Source EN PDF p.272; unit 2919 -->

```text
 typedef struct AblcSelect_s {
     bool enable;
     short int blc_r;
     short int blc_gr;
     short int blc_gb;
     short int blc_b;
 } AblcSelect_t;
 typedef AblcSelect_t AblcManualAttr_t;
```

<!-- Source EN PDF p.272; unit 2920 -->

【Felder】

<!-- Source EN PDF p.272; unit 2921 -->

| Feldname | Beschreibung |
|---|---|
| enable | Modulaktivierung: 1 aktiviert; 0 deaktiviert; |
| blc_r | R-Kanaleigenschaften des BLC-Moduls |
| blc_gr | gr-Kanaleigenschaften des blc-Moduls |
| blc_gb | GB-Kanaleigenschaften des BLC-Moduls |
| blc_b | B-Kanaleigenschaften des BLC-Moduls |

<!-- Source EN PDF p.273; unit 2922 -->

### 9.6   Dehaze&Enhance

<!-- Source EN PDF p.273; unit 2923 -->

#### 9.6.1  Funktionsbeschreibung

<!-- Source EN PDF p.273; unit 2924 -->

Dehaze &amp; Enhanced umfasst 2 Modi:

<!-- Source EN PDF p.273; unit 2925 -->

Dehaze verbessert das Bild durch dynamische Änderung von Kontrast und Helligkeit.

<!-- Source EN PDF p.273; unit 2926 -->

Enhance verstärkt den Kontrast lokaler Bildbereiche.

<!-- Source EN PDF p.273; unit 2927 -->

Dehaze und Enhanced schließen sich gegenseitig aus.

<!-- Source EN PDF p.273; unit 2928 -->

#### 9.6.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.273; unit 2929 -->

9.6.2.1  rk_aiq_uapi2_setDehazeModuleEnable

<!-- Source EN PDF p.273; unit 2930 -->

【Beschreibung】

<!-- Source EN PDF p.273; unit 2931 -->

Den Dehaze-Modulschalter einstellen, der stAuto.DehazeTuningPara.Enable oder stManual.Enable steuert; die Auswahl wird entsprechend dem aktuellen API-Modus automatisch angepasst.

<!-- Source EN PDF p.273; unit 2932 -->

【Syntax】

<!-- Source EN PDF p.273; unit 2933 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeModuleEnable(const rk_aiq_sys_ctx_t* ctx, bool
 on);
```

<!-- Source EN PDF p.273; unit 2934 -->

【Parameter】

<!-- Source EN PDF p.273; unit 2935 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Funktion ein-/ausschalten. | Eingabe |

<!-- Source EN PDF p.273; unit 2936 -->

【Rückgabewert】

<!-- Source EN PDF p.273; unit 2937 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler; Einzelheiten siehe Fehlercodetabelle |

<!-- Source EN PDF p.273; unit 2938 -->

【Voraussetzungen】

<!-- Source EN PDF p.273; unit 2939 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.273; unit 2940 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.274; unit 2941 -->

9.6.2.2  rk_aiq_uapi2_setDehazeEnable

<!-- Source EN PDF p.274; unit 2942 -->

【Beschreibung】

<!-- Source EN PDF p.274; unit 2943 -->

Den Dehaze-Funktionsschalter einstellen, der stAuto.DehazeTuningPara.dehaze_setting.en oder stManual.dehaze_setting.en steuert; die Auswahl wird entsprechend dem aktuellen API-Modus automatisch angepasst.

<!-- Source EN PDF p.274; unit 2944 -->

【Syntax】

<!-- Source EN PDF p.274; unit 2945 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.274; unit 2946 -->

【Parameter】

<!-- Source EN PDF p.274; unit 2947 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Funktion ein-/ausschalten. | Eingabe |

<!-- Source EN PDF p.274; unit 2948 -->

【Rückgabewert】

<!-- Source EN PDF p.274; unit 2949 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Ungleich 0 | Fehler; Einzelheiten siehe Fehlercodetabelle |

<!-- Source EN PDF p.274; unit 2950 -->

【Voraussetzungen】

<!-- Source EN PDF p.274; unit 2951 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.274; unit 2952 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.274; unit 2953 -->

9.6.2.3  rk_aiq_uapi2_setMDehazeStrth

<!-- Source EN PDF p.274; unit 2954 -->

【Beschreibung】

<!-- Source EN PDF p.274; unit 2955 -->

Manuelle Dunstentfernungsstärke einstellen. Basiswert ist 50; Werte über 50 erhöhen, Werte unter 50 verringern die Stärke.

<!-- Source EN PDF p.274; unit 2956 -->

Als API-Modus sind sowohl DEHAZE_API_AUTO als auch DEHAZE_API_MANUAL vorgesehen.

<!-- Source EN PDF p.274; unit 2957 -->

Stellen Sie vor Verwendung dieser API sicher, dass Dehaze wirksam ist, oder rufen Sie zuvor rk_aiq_uapi2_setDehazeModuleEnable und rk_aiq_uapi2_setDehazeEnable auf. Den Ablauf zeigt Fall 6 in sample_adehaze_module.cpp.

<!-- Source EN PDF p.274; unit 2958 -->

【Syntax】

<!-- Source EN PDF p.274; unit 2959 -->

```text
 XCamReturn rk_aiq_uapi2_setMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.274; unit 2960 -->

【Parameter】

<!-- Source EN PDF p.275; unit 2961 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Stufe, Wertebereich [1,100], Standardwert 50, Genauigkeit 1. | Eingabe |

<!-- Source EN PDF p.275; unit 2962 -->

【Rückgabewert】

<!-- Source EN PDF p.275; unit 2963 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.275; unit 2964 -->

【Voraussetzungen】

<!-- Source EN PDF p.275; unit 2965 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2966 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.275; unit 2967 -->

9.6.2.4  rk_aiq_uapi2_getMDehazeStrth

<!-- Source EN PDF p.275; unit 2968 -->

【Beschreibung】

<!-- Source EN PDF p.275; unit 2969 -->

Manuelle Dunstentfernungsstärke abrufen.

<!-- Source EN PDF p.275; unit 2970 -->

【Syntax】

<!-- Source EN PDF p.275; unit 2971 -->

```text
 XCamReturn rk_aiq_uapi2_getMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int* level);
```

<!-- Source EN PDF p.275; unit 2972 -->

【Parameter】

<!-- Source EN PDF p.275; unit 2973 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Stufe, Wertebereich [1,100], Standardwert 50, Genauigkeit 1. | Ausgabe |

<!-- Source EN PDF p.275; unit 2974 -->

【Rückgabewert】

<!-- Source EN PDF p.275; unit 2975 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.275; unit 2976 -->

【Voraussetzungen】

<!-- Source EN PDF p.275; unit 2977 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2978 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.276; unit 2979 -->

9.6.2.5  rk_aiq_uapi2_setEnhanceEnable

<!-- Source EN PDF p.276; unit 2980 -->

【Beschreibung】

<!-- Source EN PDF p.276; unit 2981 -->

Den Dehaze-Funktionsschalter einstellen, der stAuto.DehazeTuningPara.enhance_setting.en oder stManual.enhance_setting.en steuert; die Auswahl wird entsprechend dem aktuellen API-Modus automatisch angepasst. Die Quelle bezeichnet die Funktion hier als Dehaze.

<!-- Source EN PDF p.276; unit 2982 -->

【Syntax】

<!-- Source EN PDF p.276; unit 2983 -->

```text
 XCamReturn rk_aiq_uapi2_setEnhanceEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.276; unit 2984 -->

【Parameter】

<!-- Source EN PDF p.276; unit 2985 -->

| Rückgabewert | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| on | Funktion ein-/ausschalten. | Eingabe |

<!-- Source EN PDF p.276; unit 2986 -->

【Rückgabewert】

<!-- Source EN PDF p.276; unit 2987 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.276; unit 2988 -->

【Voraussetzungen】

<!-- Source EN PDF p.276; unit 2989 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.276; unit 2990 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.276; unit 2991 -->

9.6.2.6  rk_aiq_uapi2_setMEnhanceStrth

<!-- Source EN PDF p.276; unit 2992 -->

【Beschreibung】

<!-- Source EN PDF p.276; unit 2993 -->

Manuelle Kontrastverstärkungsstärke einstellen. Basiswert ist 50; Werte über 50 erhöhen, Werte unter 50 verringern den Kontrast.

<!-- Source EN PDF p.276; unit 2994 -->

Als API-Modus sind sowohl DEHAZE_API_AUTO als auch DEHAZE_API_MANUAL vorgesehen.

<!-- Source EN PDF p.276; unit 2995 -->

Stellen Sie vor Verwendung dieser API sicher, dass Enhance wirksam ist, oder rufen Sie zuvor rk_aiq_uapi2_setDehazeModuleEnable und rk_aiq_uapi2_setEnhanceEnable auf. Den Ablauf zeigt Fall 9 in sample_adehaze_module.cpp.

<!-- Source EN PDF p.276; unit 2996 -->

【Syntax】

<!-- Source EN PDF p.276; unit 2997 -->

```text
 XCamReturn rk_aiq_uapi2_setMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int level);
```

<!-- Source EN PDF p.276; unit 2998 -->

【Parameter】

<!-- Source EN PDF p.277; unit 2999 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Stufe, Wertebereich [1,100], Standardwert 50, Genauigkeit 1. | Eingabe |

<!-- Source EN PDF p.277; unit 3000 -->

【Rückgabewert】

<!-- Source EN PDF p.277; unit 3001 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.277; unit 3002 -->

【Voraussetzungen】

<!-- Source EN PDF p.277; unit 3003 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3004 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.277; unit 3005 -->

9.6.2.7  rk_aiq_uapi2_getMEnhanceStrth

<!-- Source EN PDF p.277; unit 3006 -->

【Beschreibung】

<!-- Source EN PDF p.277; unit 3007 -->

Manuelle Kontrastverstärkung abrufen.

<!-- Source EN PDF p.277; unit 3008 -->

【Syntax】

<!-- Source EN PDF p.277; unit 3009 -->

```text
 XCamReturn rk_aiq_uapi2_getMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int *level);
```

<!-- Source EN PDF p.277; unit 3010 -->

【Parameter】

<!-- Source EN PDF p.277; unit 3011 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Stufe, Wertebereich [1,100], Standardwert 50, Genauigkeit 1. | Ausgabe |

<!-- Source EN PDF p.277; unit 3012 -->

【Rückgabewert】

<!-- Source EN PDF p.277; unit 3013 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.277; unit 3014 -->

【Voraussetzungen】

<!-- Source EN PDF p.277; unit 3015 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3016 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.278; unit 3017 -->

#### 9.6.3  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.278; unit 3018 -->

9.6.3.1  rk_aiq_user_api2_adehaze_v12_setSwAttrib

<!-- Source EN PDF p.278; unit 3019 -->

【Beschreibung】

<!-- Source EN PDF p.278; unit 3020 -->

Dunstentfernungsparameter einstellen.

<!-- Source EN PDF p.278; unit 3021 -->

【Syntax】

<!-- Source EN PDF p.278; unit 3022 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_setSwAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3023 -->

【Parameter】

<!-- Source EN PDF p.278; unit 3024 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Dunstentfernungsparameter | Eingabe |

<!-- Source EN PDF p.278; unit 3025 -->

【Rückgabewert】

<!-- Source EN PDF p.278; unit 3026 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.278; unit 3027 -->

9.6.3.2  rk_aiq_user_api2_adehaze_getSwAttrib

<!-- Source EN PDF p.278; unit 3028 -->

【Beschreibung】

<!-- Source EN PDF p.278; unit 3029 -->

Aktuelle Dunstentfernungsparameter abrufen.

<!-- Source EN PDF p.278; unit 3030 -->

【Syntax】

<!-- Source EN PDF p.278; unit 3031 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_getSwAttrib(const rk_aiq_sys_ctx_t*
 sys_ctx,adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3032 -->

【Parameter】

<!-- Source EN PDF p.278; unit 3033 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Dunstentfernungsparameter | Ausgabe |

<!-- Source EN PDF p.278; unit 3034 -->

【Rückgabewert】

<!-- Source EN PDF p.279; unit 3035 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.279; unit 3036 -->

#### 9.6.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.279; unit 3037 -->

9.6.4.1  dehaze_api_mode_t

<!-- Source EN PDF p.279; unit 3038 -->

【Beschreibung】 Betriebsart des Dunstentfernungsmoduls definieren.

<!-- Source EN PDF p.279; unit 3039 -->

【Definition】

<!-- Source EN PDF p.279; unit 3040 -->

```text
 typedef enum dehaze_api_mode_e {
     DEHAZE_API_AUTO   = 0,
     DEHAZE_API_MANUAL = 1,
 } dehaze_api_mode_t;
```

<!-- Source EN PDF p.279; unit 3041 -->

【Felder】

<!-- Source EN PDF p.279; unit 3042 -->

| Feldname | Beschreibung |
|---|---|
| DEHAZE_API_AUTO | Automatischer Dunstentfernungsmodus |
| DEHAZE_API_MANUAL | Manueller Dunstentfernungsmodus |

<!-- Source EN PDF p.279; unit 3043 -->

9.6.4.2  DehazeDataV21_t

<!-- Source EN PDF p.279; unit 3044 -->

【Beschreibung】 Eigenschaften der automatischen Dunstentfernungs-Abstimmparameter definieren.

<!-- Source EN PDF p.279; unit 3045 -->

【Definition】

<!-- Source EN PDF p.279; unit 3046 -->

```text
 typedef struct DehazeDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* dc_min_th;
     int    dc_min_th_len;
     float* dc_max_th;
     int    dc_max_th_len;
     float* yhist_th;
     int    yhist_th_len;
     float* yblk_th;
     int    yblk_th_len;
     float* dark_th;
     int    dark_th_len;
     float* bright_min;
     int    bright_min_len;
     float* bright_max;
     int    bright_max_len;
     float* wt_max;
     int    wt_max_len;
     float* air_min;
     int    air_min_len;
     float* air_max;
     int    air_max_len;
     float* tmax_base;
     int    tmax_base_len;
     float* tmax_off;
     int    tmax_off_len;
     float* tmax_max;
     int    tmax_max_len;
     float* cfg_wt;
     int    cfg_wt_len;
     float* cfg_air;
     int    cfg_air_len;
     float* cfg_tmax;
     int    cfg_tmax_len;
     float* dc_weitcur;
     int    dc_weitcur_len;
     float* bf_weight;
     int    bf_weight_len;
     float* range_sigma;
     int    range_sigma_len;
     float* space_sigma_pre;
     int    space_sigma_pre_len;
     float* space_sigma_cur;
     int    space_sigma_cur_len;
 } DehazeDataV21_t;
```

<!-- Source EN PDF p.280; unit 3047 -->

【Felder】

<!-- Source EN PDF p.281; unit 3048 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des EnvLv-Arrays |
| dc_min_th | Adaptiver WT-Statistikbereich, Wertebereich [16, 120],<br>Standardwert 64. |
| dc_min_th_len | Länge des dc_min_th-Arrays |
| dc_max_th | Adaptiver WT-Statistikbereich für stark belichtete Bereiche, Wertebereich [170, 255],<br>Standardwert 192. |
| dc_max_th_len | Länge des dc_max_th-Arrays |
| yhist_th | Statistikbereich stark belichteter Y-Komponentenbereiche: [170, 255],<br>Standardwert 249. |
| yhist_th_len | Länge des yhist_th-Arrays |
| yblk_th | Anteilsschwelle der Y-Komponentenblockanzahl: 0.002,<br>0.01; Standardwert 0.002. |
| yblk_th_len | Länge des yblk_th-Arrays |
| dark_th | Adaptive WT-Mindestschwelle des Y-Komponentenblocks, Wertebereich<br>[230, 250], Standardwert 250. |
| dark_th_len | Länge des dark_th-Arrays |
| bright_min | Minimum der adaptiven AIR-Schwelle, Bereich 160 bis 200,<br>Standardwert 180. |
| bright_min_len | Länge des bright_min-Arrays |
| bright_max | Maximum der adaptiven air-Schwelle, Bereich 210 bis 250,<br>Standardwert 240. |
| bright_max_len | Länge des bright_max-Arrays |
| wt_max | Maximaler WT-Wert: 0.75 und 0.9; Standardwert 0.9. |
| wt_max_len | Länge des wt_max-Arrays |
| air_min | Minimaler adaptiver air-Wert, Bereich 200 bis 220,<br>Standardwert 200. |
| air_min_len | Länge des air_min-Arrays |
| air_max | Maximaler adaptiver air-Wert: 230 und 250; Standardwert 250. |
| air_max_len | Länge des air_max-Arrays |
| tmax_base | Standardwert von tmax: 125. Zugehörige Konfiguration:<br>200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105).<br>Empfohlen wird 131-105. |

<!-- Source EN PDF p.282; unit 3049 -->

| Feldname | Beschreibung |
|---|---|
| tmax_base_len | Länge des tmax_base-Arrays |
| tmax_off | Adaptiver Festwert von tmax, Wertebereich [0.1, 0.5],<br>Standardwert 0.1. |
| tmax_off_len | Länge des tmax_off-Arrays |
| tmax_max | Maximaler tmax-Wert: 0.1, 0.5; Standardwert 0.5. |
| tmax_max_len | Länge des tmax_max-Arrays |
| cfg_wt | Softwarekonfiguration von wt, Stärke der Bilddunstentfernung, Wertebereich [0, 1],<br>Standardwert 0.8. |
| cfg_wt_len | Länge des cfg_wt-Arrays |
| cfg_air | Softwarekonfiguration von air, atmosphärischer Lichtkoeffizient, Wertebereich<br>[0, 255], Standardwert 210. |
| cfg_air_len | Länge des cfg_air-Arrays |
| cfg_tmax | Softwarekonfiguration von tmax, maximaler Dunstentfernungswert,<br>Wertebereich [0, 1], Standardwert 0.2. |
| cfg_tmax_len | Länge des cfg_tmax-Arrays |
| bf_weight | Kombinationsgewicht der beiden bilateralen Filter, Wertebereich [0, 1],<br>Standardwert 0.5. |
| bf_weight_len | Länge des bf_weight-Arrays |
| dc_weitcur | Gewicht des Dunkelkanalanteils, Wertebereich [0, 1];<br>Standardwert in der Quelle nicht angegeben. |
| dc_weitcur_len | Länge des dc_weitcur-Arrays |
| range_sigma | Bereichs-Sigma des bilateralen Filters, Wertebereich [0, 1],<br>Standardwert 0.4. |
| range_sigma_len | Länge des range_sigma-Arrays |
| space_sigma_pre | Räumliches Sigma der bilateralen Filterung bei IIR-Daten als Referenz,<br>Wertebereich [0, 1], Standardwert 0.4. |
| space_sigma_pre_len | Länge des space_sigma_pre-Arrays |
| space_sigma_cur | Räumliches Sigma der bilateralen Filterung bei aktuellen Daten als Referenz,<br>Wertebereich [0, 1], Standardwert 0.8. |
| space_sigma_cur_len | Länge des space_sigma_cur-Arrays |

<!-- Source EN PDF p.283; unit 3050 -->

9.6.4.3  Dehaze_Setting_V21_t

<!-- Source EN PDF p.283; unit 3051 -->

【Beschreibung】 Parameter der automatischen Dunstentfernungsfunktion definieren.

<!-- Source EN PDF p.283; unit 3052 -->

【Definition】

<!-- Source EN PDF p.283; unit 3053 -->

```text
 typedef struct Dehaze_Setting_V21_s{
     bool            en;
     bool            air_lc_en;
     float           stab_fnum;
     float           sigma;
     float           wt_sigma;
     float           air_sigma;
     float           tmax_sigma;
     float           pre_wet;
     DehazeDataV21_t DehazeData;
 } Dehaze_Setting_V21_t;
```

<!-- Source EN PDF p.283; unit 3054 -->

【Felder】

<!-- Source EN PDF p.283; unit 3055 -->

| Feldname | Beschreibung |
|---|---|
| en | Funktionsschalter |
| air_lc_en | Ob Airlight Base zur unteren Begrenzung von Airlight verwendet wird |
| stab_fnum | Maximalwert für die Bildstabilisierung |
| sigma | IIR-gesteuertes Sigma |
| wt_sigma | Bildübergreifender WT-Filterkoeffizient |
| air_sigma | Bildübergreifender AIR-Filterkoeffizient |
| tmax_sigma | Bildübergreifender Tmax-Filterkoeffizient |
| pre_wet | IIR-Filterfaktor der Referenzdaten |
| DehazeData | Dunstentfernungs-Abstimmparameter |

<!-- Source EN PDF p.283; unit 3056 -->

9.6.4.4  EnhanceDataV21_t

<!-- Source EN PDF p.283; unit 3057 -->

【Beschreibung】 Eigenschaften der automatischen Enhance-Abstimmparameter definieren.

<!-- Source EN PDF p.283; unit 3058 -->

【Definition】

<!-- Source EN PDF p.284; unit 3059 -->

```text
 typedef struct EnhanceDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* enhance_value;
     int    enhance_value_len;
     float* enhance_chroma;
     int    enhance_chroma_len;
 } EnhanceDataV21_t;
```

<!-- Source EN PDF p.284; unit 3060 -->

【Felder】

<!-- Source EN PDF p.284; unit 3061 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des Umgebungshelligkeitsarrays |
| enhance_value | Allgemeine Kontraststärke, Wertebereich [0,16], empfohlener Bereich [1, 2] |
| enhance_value_len | Länge des enhance_value-Arrays |
| enhance_chroma | Verstärkungsparameter für die Chromatizität, Wertebereich [0, 16],<br>empfohlener Bereich [1, 2] |
| enhance_chroma_len | Länge des enhance_chroma-Arrays |

<!-- Source EN PDF p.284; unit 3062 -->

9.6.4.5  Enhance_Setting_V21_t

<!-- Source EN PDF p.284; unit 3063 -->

【Beschreibung】 Eigenschaften der automatischen Enhance-Funktionsparameter definieren.

<!-- Source EN PDF p.284; unit 3064 -->

【Definition】

<!-- Source EN PDF p.284; unit 3065 -->

```text
 typedef struct Enhance_Setting_V21_s{
     bool             en;
     float            enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     EnhanceDataV21_t EnhanceData;
 } Enhance_Setting_V21_t;
```

<!-- Source EN PDF p.284; unit 3066 -->

【Felder】

<!-- Source EN PDF p.284; unit 3067 -->

| Feldname | Beschreibung |
|---|---|
| en | Enhance-Funktionsschalter. 0: aus, 1: ein. |
| enhance_curve | Niederfrequenzkurve. |
| EnhanceData | Enhance-Abstimmparameter. |

<!-- Source EN PDF p.285; unit 3068 -->

9.6.4.6  Hist_setting_V21_t

<!-- Source EN PDF p.285; unit 3069 -->

【Beschreibung】 Eigenschaften der automatischen Hist-Abstimmparameter definieren.

<!-- Source EN PDF p.285; unit 3070 -->

【Definition】

<!-- Source EN PDF p.285; unit 3071 -->

```text
 typedef struct HistDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* hist_gratio;
     int    hist_gratio_len;
     float* hist_th_off;
     int    hist_th_off_len;
     float* hist_k;
     int    hist_k_len;
     float* hist_min;
     int    hist_min_len;
     float* hist_scale;
     int    hist_scale_len;
     float* cfg_gratio;
     int    cfg_gratio_len;
 } HistDataV21_t;
```

<!-- Source EN PDF p.285; unit 3072 -->

【Felder】

<!-- Source EN PDF p.286; unit 3073 -->

| Feldname | Beschreibung |
|---|---|
| EnvLv | Umgebungshelligkeit |
| EnvLv_len | Länge des EnvLv-Arrays |
| hist_gratio | Histogrammspreizungsfaktor, Steuerkoeffizient des Histogrammausgleichs,<br>Wertebereich [0, 32] |
| hist_gratio_len | Länge des hist_gratio-Arrays |
| hist_th_off | Histogrammstatistikschwelle, Bereich 0 bis 255, Standardwert<br>64 |
| hist_th_off_len | Länge des hist_th_off-Arrays |
| hist_k | Multiplikator der adaptiven Histogrammschwelle, Bereich 0 bis 7, Wert 2 |
| hist_k_len | Länge des hist_k-Arrays |
| hist_min | Minimum der Histogrammstatistikschwelle, laut Quelle Bereich 0,2 bis<br>0.016 |
| hist_min_len | Länge des hist_min-Arrays |
| hist_scale | Steuerkoeffizienten des Histogrammausgleichs, Wertebereich [0, 32] |
| hist_scale_len | Länge des hist_scale-Arrays |
| cfg_gratio | Softwarekonfiguration des Histogrammspreizungsfaktors bzw.<br>Steuerkoeffizienten des Histogrammausgleichs, Wertebereich [0, 32] |
| cfg_gratio_len | Länge des cfg_gratio-Arrays |

<!-- Source EN PDF p.286; unit 3074 -->

9.6.4.7  Hist_setting_V21_t

<!-- Source EN PDF p.286; unit 3075 -->

【Beschreibung】 Eigenschaften der automatischen Hist-Funktionsparameter definieren.

<!-- Source EN PDF p.286; unit 3076 -->

【Definition】

<!-- Source EN PDF p.286; unit 3077 -->

```text
 typedef struct Hist_setting_V21_s{
     bool          en;
     bool          hist_para_en;
     HistDataV21_t HistData;
 } Hist_setting_V21_t;
```

<!-- Source EN PDF p.286; unit 3078 -->

【Felder】

<!-- Source EN PDF p.287; unit 3079 -->

| Feldname | Beschreibung |
|---|---|
| en | Hist-Funktionsschalter |
| hist_para_en | Schalter zur Steuerung der Histogrammspreizung |
| HistData | Hist-Abstimmparameter |

<!-- Source EN PDF p.287; unit 3080 -->

9.6.4.8  CalibDbDehazeV21_t

<!-- Source EN PDF p.287; unit 3081 -->

【Beschreibung】 Eigenschaften der Abstimmparameter des automatischen Dunstentfernungsmoduls definieren.

<!-- Source EN PDF p.287; unit 3082 -->

【Definition】

<!-- Source EN PDF p.287; unit 3083 -->

```text
 typedef struct CalibDbDehazeV21_s{
     bool                  Enable;
     float                 cfg_alpha;
     float                 ByPassThr;
     Dehaze_Setting_V21_t  dehaze_setting;
     Enhance_Setting_V21_t enhance_setting;
     Hist_setting_V21_t    hist_setting;
 } CalibDbDehazeV21_t;
```

<!-- Source EN PDF p.287; unit 3084 -->

【Felder】

<!-- Source EN PDF p.287; unit 3085 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Funktionsschalter |
| cfg_alpha | Anteil der manuellen Softwarekonfiguration, Wertebereich 0, 1,<br>Standardwert 1, Genauigkeit 0.01 |
| dehaze_setting | Parameter der automatischen Dunstentfernungsfunktion |
| enhance_setting | Parameter der automatischen Enhance-Funktion |
| hist_setting | Parameter der automatischen Hist-Funktion |

<!-- Source EN PDF p.287; unit 3086 -->

9.6.4.9  CalibDbV2_dehaze_v21_t

<!-- Source EN PDF p.287; unit 3087 -->

【Beschreibung】 Eigenschaften des automatischen Dunstentfernungsmoduls definieren.

<!-- Source EN PDF p.287; unit 3088 -->

【Definition】

<!-- Source EN PDF p.287; unit 3089 -->

```text
 typedef struct CalibDbV2_dehaze_V21_s{
     CalibDbDehazeV21_t DehazeTuningPara;
 } CalibDbV2_dehaze_V21_t;
```

<!-- Source EN PDF p.287; unit 3090 -->

【Felder】

<!-- Source EN PDF p.288; unit 3091 -->

| Feldname | Beschreibung |
|---|---|
| DehazeTuningPara | Abstimmparameter des automatischen Dunstentfernungsmoduls |

<!-- Source EN PDF p.288; unit 3092 -->

9.6.4.10  mDehazeDataV21_t

<!-- Source EN PDF p.288; unit 3093 -->

【Beschreibung】 Manuelle DehazeData-Eigenschaften definieren.

<!-- Source EN PDF p.288; unit 3094 -->

【Definition】

<!-- Source EN PDF p.288; unit 3095 -->

```text
 typedef struct mDehazeDataV21_s {
     float dc_min_th;
     float dc_max_th;
     float yhist_th;
     float yblk_th;
     float dark_th;
     float bright_min;
     float bright_max;
     float wt_max;
     float air_min;
     float air_max;
     float tmax_base;
     float tmax_off;
     float tmax_max;
     float cfg_wt;
     float cfg_air;
     float cfg_tmax;
     float dc_weitcur;
     float bf_weight;
     float range_sigma;
     float space_sigma_pre;
     float space_sigma_cur;
 } mDehazeDataV21_t;
```

<!-- Source EN PDF p.288; unit 3096 -->

【Felder】

<!-- Source EN PDF p.289; unit 3097 -->

| Feldname | Beschreibung |
|---|---|
| dc_min_th | Adaptiver WT-Statistikbereich, Wertebereich [16, 120], Standardwert 64, Genauigkeit 0.1. |
| dc_max_th | Adaptiver WT-Statistikbereich für stark belichtete Bereiche, Wertebereich [170, 255],<br>Standardwert 192, Genauigkeit 0.1. |
| yhist_th | Statistikbereich stark belichteter Y-Komponentenbereiche, Wertebereich [170, 255],<br>Standardwert 249, Genauigkeit 0.1 |
| yblk_th | Anteilsschwelle der Y-Komponentenblockanzahl, Wertebereich [0.002, 0.01],<br>Standardwert 0.002, Genauigkeit 0.1. |
| dark_th | Adaptive WT-Mindestschwelle des Y-Komponentenblocks, Wertebereich [230, 250],<br>Standardwert 250, Genauigkeit 0.1 |
| bright_min | Minimum der adaptiven AIR-Schwelle, Wertebereich [160, 200],<br>Standardwert 180, Genauigkeit 0.1. |
| bright_max | Maximum der adaptiven AIR-Schwelle, Wertebereich [210, 250],<br>Standardwert 240, Genauigkeit 0.1. |
| wt_max | Obergrenze der adaptiven wt-Anpassung, Wertebereich [0.75, 0.9],<br>Standardwert 0.9, Genauigkeit 0.001. |
| air_min | Untergrenze der adaptiven air-Anpassung, Wertebereich [200, 220],<br>Standardwert 200, Genauigkeit 0.001. |
| air_max | Obergrenze der adaptiven AIR-Anpassung, Wertebereich [230, 250],<br>Standardwert 250, Genauigkeit 0.001. |
| tmax_base | Adaptiver tmax-Basiswert, Standard 125. Konfiguration: 200<br>(131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105); empfohlen 131-105 |
| tmax_off | Adaptiver Tmax-Festwert, Wertebereich [0.1, 0.5], Standardwert 0.1, Genauigkeit 0.1. |
| tmax_max | Maximum der adaptiven tmax-Anpassung, Wertebereich [0.1, 0.5],<br>Standardwert 0.5, Genauigkeit 0.1. |
| cfg_wt | Softwarekonfiguration von wt, Bilddunstentfernungsstärke, Wertebereich [0, 1],<br>Standardwert 0.8, Genauigkeit 0.001. |
| cfg_air | Softwarekonfiguration von air, atmosphärischer Lichtkoeffizient, Wertebereich [0, 255],<br>Standardwert 210, Genauigkeit 0.001 |
| cfg_tmax | Softwarekonfiguration von tmax, maximaler Dunstentfernungswert, Wertebereich [0, 1],<br>Standardwert 0.2, Genauigkeit 0.001. |
| bf_weight | Kombinationsgewicht der beiden bilateralen Filter, Wertebereich [0, 1],<br>Standardwert 0.5, Genauigkeit 0.1. |
| dc_weitcur | Bilaterales Gewicht des Dunkelkanalanteils, Wertebereich [0, 1],<br>Standardwert 1, Genauigkeit 0.1. |
| range_sigma | Bereichs-Sigma des bilateralen Filters, Wertebereich [0, 1], Standardwert 0.4, Genauigkeit 0.1. |

<!-- Source EN PDF p.290; unit 3098 -->

| Feldname | Beschreibung |
|---|---|
| space_sigma_pre | Räumliches Sigma der bilateralen Filterung bei IIR-Daten als Referenz,<br>Wertebereich [0, 1], Standardwert 0.4, Genauigkeit 0.1. |
| space_sigma_cur | Räumliches Sigma der bilateralen Filterung bei aktuellen Daten als Referenz,<br>Wertebereich [0, 1], Standardwert 0.8, Genauigkeit 0.1. |

<!-- Source EN PDF p.290; unit 3099 -->

9.6.4.11  mDehaze_setting_v21_t

<!-- Source EN PDF p.290; unit 3100 -->

【Beschreibung】 Eigenschaften der manuellen Dunstentfernungsfunktion definieren.

<!-- Source EN PDF p.290; unit 3101 -->

【Definition】

<!-- Source EN PDF p.290; unit 3102 -->

```text
 typedef struct mDehaze_setting_v21_s {
     bool             en;
     bool             air_lc_en;
     float            stab_fnum;
     float            sigma;
     float            wt_sigma;
     float            air_sigma;
     float            tmax_sigma;
     float            pre_wet;
     mDehazeDataV21_t DehazeData;
 } mDehaze_setting_V21_t;
```

<!-- Source EN PDF p.290; unit 3103 -->

【Felder】

<!-- Source EN PDF p.291; unit 3104 -->

| Feldname | Beschreibung |
|---|---|
| en | Funktionsschalter |
| air_lc_en | Ob Airlight Base zur unteren Begrenzung verwendet wird |
| stab_fnum | Maximalwert der Bildstabilisierung, Wertebereich [0,31], Standardwert<br>8, Genauigkeit 0.01 |
| sigma | IIR-gesteuertes Sigma, Wertebereich 0,255, Standardwert 6,<br>Genauigkeit 1. |
| wt_sigma | Bildübergreifender wt-Filterkoeffizient, Wertebereich [0,255], Standardwert<br>8, Genauigkeit 1. |
| air_sigma | Bildübergreifender air-Filterkoeffizient, Wertebereich 0,255, Standardwert 12,<br>Genauigkeit 1 |
| tmax_sigma | Bildübergreifender Tmax-Filterkoeffizient, Wertebereich [0,1], Standardwert<br>0.01, Genauigkeit 0.0001 |
| pre_wet | IIR-Filterkoeffizient der Referenzdaten, Wertebereich [0,1], Standardwert 0.01,<br>Genauigkeit 0.0001. |
| DehazeData | Dunstentfernungs-Abstimmparameter |

<!-- Source EN PDF p.291; unit 3105 -->

9.6.4.12  mEnhanceDataV21_t

<!-- Source EN PDF p.291; unit 3106 -->

【Beschreibung】 Manuelle EnhanceData-Eigenschaft definieren.

<!-- Source EN PDF p.291; unit 3107 -->

【Definition】

<!-- Source EN PDF p.291; unit 3108 -->

```text
 typedef struct mEnhanceDataV21_s {
     float enhance_value;
     float enhance_chroma;
 } mEnhanceDataV21_t;
```

<!-- Source EN PDF p.291; unit 3109 -->

【Felder】

<!-- Source EN PDF p.291; unit 3110 -->

| Feldname | Beschreibung |
|---|---|
| enhance_value | Allgemeine Kontraststärke, Wertebereich [0,16], Standardwert 1.0, Genauigkeit 0.001. |
| enhance_chroma | Verstärkungsparameter für die Chromatizität, Wertebereich [0,16],<br>Standardwert 1.0, Genauigkeit 0.001. |

<!-- Source EN PDF p.292; unit 3111 -->

9.6.4.13  mEnhance_setting_v21_t

<!-- Source EN PDF p.292; unit 3112 -->

【Beschreibung】 Eigenschaft der manuellen Enhance-Funktion definieren.

<!-- Source EN PDF p.292; unit 3113 -->

【Definition】

<!-- Source EN PDF p.292; unit 3114 -->

```text
 typedef struct mEnhance_Setting_V21_s {
     bool              en;
     float             enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     mEnhanceDataV21_t EnhanceData;
 } mEnhance_Setting_V21_t;
```

<!-- Source EN PDF p.292; unit 3115 -->

【Felder】

<!-- Source EN PDF p.292; unit 3116 -->

| Feldname | Beschreibung |
|---|---|
| en | Enhance-Funktionsschalter |
| enhance_curve | Niederfrequenzkurve |
| EnhanceData | Enhance-Abstimmparameter |

<!-- Source EN PDF p.292; unit 3117 -->

9.6.4.14  mHistDataV21_t

<!-- Source EN PDF p.292; unit 3118 -->

【Beschreibung】 Manuelle HistData-Eigenschaft definieren.

<!-- Source EN PDF p.292; unit 3119 -->

【Definition】

<!-- Source EN PDF p.292; unit 3120 -->

```text
 typedef struct mHistDataV21_s {
     float hist_gratio;
     float hist_th_off;
     float hist_k;
     float hist_min;
     float hist_scale;
     float cfg_gratio;
 } mHistDataV21_t;
```

<!-- Source EN PDF p.292; unit 3121 -->

【Felder】

<!-- Source EN PDF p.293; unit 3122 -->

| Feldname | Beschreibung |
|---|---|
| hist_gratio | Histogrammspreizungsfaktor, Steuerkoeffizient des Histogrammausgleichs, Wertebereich<br>[0, 32], Standardwert nicht angegeben, Genauigkeit 0.01. |
| hist_th_off | Histogrammstatistikschwelle, Wertebereich [0, 255], Standardwert 64, Genauigkeit 0.01. |
| hist_k | Multiplikator der adaptiven Histogrammschwelle, Wertebereich [0, 7), Standardwert 2,<br>Genauigkeit 0.01. |
| hist_min | Minimum der Histogrammstatistikschwelle, Wertebereich [0,2),<br>Standardwert 0.016, Genauigkeit 0.01. |
| hist_scale | Steuerkoeffizient des Histogrammausgleichs, Wertebereich [0, 32], Standardwert 0.9,<br>Genauigkeit 0.01. |
| cfg_gratio | Softwarekonfiguration des Histogrammspreizungsfaktors, Steuerkoeffizient des<br>Histogrammausgleichs, Wertebereich [0, 32), Standardwert 1, Genauigkeit 0.01. |

<!-- Source EN PDF p.293; unit 3123 -->

9.6.4.15  mHist_setting_v21_t

<!-- Source EN PDF p.293; unit 3124 -->

【Beschreibung】 Eigenschaften der manuellen Hist-Funktion definieren.

<!-- Source EN PDF p.293; unit 3125 -->

【Definition】

<!-- Source EN PDF p.293; unit 3126 -->

```text
 typedef struct mHist_setting_V21_s {
     bool           en;
     bool           hist_para_en;
     mHistDataV21_t HistData;
 } mHist_setting_V21_t;
```

<!-- Source EN PDF p.293; unit 3127 -->

【Felder】

<!-- Source EN PDF p.293; unit 3128 -->

| Feldname | Beschreibung |
|---|---|
| en | Hist-Funktionsschalter. |
| hist_para_en | Schalter zur Steuerung der Histogrammspreizung. |
| HistData | Hist-Abstimmparameter. |

<!-- Source EN PDF p.293; unit 3129 -->

9.6.4.16  mDehazeAttr_t

<!-- Source EN PDF p.293; unit 3130 -->

【Beschreibung】 Eigenschaften des manuellen Dunstentfernungsmoduls definieren.

<!-- Source EN PDF p.293; unit 3131 -->

【Definition】

<!-- Source EN PDF p.294; unit 3132 -->

```text
 typedef struct mDehazeAttr_s {
     bool                   Enable;
     float                  cfg_alpha;
     mDehaze_Setting_V21_t  dehaze_setting;
     mEnhance_Setting_V21_t enhance_setting;
     mHist_setting_V21_t    hist_setting;
 } mDehazeAttr_t;
```

<!-- Source EN PDF p.294; unit 3133 -->

【Felder】

<!-- Source EN PDF p.294; unit 3134 -->

| Feldname | Beschreibung |
|---|---|
| Enable | Funktionsschalter. |
| cfg_alpha | Anteil manueller Softwarekonfiguration, Wertebereich [0,1], Standardwert 1, Genauigkeit 0.01. |
| dehaze_setting | Parameter der manuellen Dunstentfernungsfunktion |
| enhance_setting | Parameter der manuellen Enhance-Funktion |
| hist_setting | Parameter der manuellen Hist-Funktion |

<!-- Source EN PDF p.294; unit 3135 -->

9.6.4.17  adehaze_sw_v2_t

<!-- Source EN PDF p.294; unit 3136 -->

【Beschreibung】 Dunstentfernungseigenschaft definieren.

<!-- Source EN PDF p.294; unit 3137 -->

【Definition】

<!-- Source EN PDF p.294; unit 3138 -->

```text
 typedef struct adehaze_sw_V2_s {
     rk_aiq_uapi_sync_t     sync;
     dehaze_api_mode_t      mode;
     CalibDbV2_dehaze_V21_t stAuto;
     mDehazeAttr_t          stManual;
     DehazeManuAttr_t       stDehazeManu;
     EnhanceManuAttr_t      stEnhanceManu;
 } adehaze_sw_V2_t;
```

<!-- Source EN PDF p.294; unit 3139 -->

【Felder】

<!-- Source EN PDF p.294; unit 3140 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definitionen von rk_aiq_uapi_sync_t siehe Überblick/API-Beschreibung. |
| mode | API-Schema. |
| stAuto | Parameter des automatischen Dunstentfernungsmoduls. |
| stManual | Parameter des manuellen Dunstentfernungsmoduls. |
| stDehazeManu | Parameter der Dunstentfernungsstufe; nicht verwenden. |
| stEnhanceManu | Parameter der Kontraststufe; nicht verwenden. |

<!-- Source EN PDF p.295; unit 3141 -->

### 9.7   CPROC

<!-- Source EN PDF p.295; unit 3142 -->

#### 9.7.1  Funktionsbeschreibung

<!-- Source EN PDF p.295; unit 3143 -->

CPRO (Color Processing) bietet grundlegende Farbanpassung durch Änderung von Helligkeit, Kontrast, Sättigung und Chromatizität innerhalb bestimmter Bereiche, um die gewünschte Farbwiedergabe zu erzielen. Das Modul verarbeitet Bilder in der YUV-Domäne.

<!-- Source EN PDF p.295; unit 3144 -->

#### 9.7.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.295; unit 3145 -->

#### 9.7.3  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.295; unit 3146 -->

9.7.3.1  rk_aiq_user_api2_acp_SetAttrib

<!-- Source EN PDF p.295; unit 3147 -->

【Beschreibung】

<!-- Source EN PDF p.295; unit 3148 -->

Eigenschaften des cpro-Moduls einstellen.

<!-- Source EN PDF p.295; unit 3149 -->

【Syntax】

<!-- Source EN PDF p.295; unit 3150 -->

```text
 XCamReturn rk_aiq_user_api2_acp_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
```

<!-- Source EN PDF p.295; unit 3151 -->

【Parameter】

<!-- Source EN PDF p.295; unit 3152 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften des cproc-Moduls | Eingabe |

<!-- Source EN PDF p.295; unit 3153 -->

【Rückgabewert】

<!-- Source EN PDF p.295; unit 3154 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.295; unit 3155 -->

【Voraussetzungen】

<!-- Source EN PDF p.295; unit 3156 -->

Headerdatei: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.295; unit 3157 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.295; unit 3158 -->

9.7.3.2  rk_aiq_user_api2_acp_GetAttrib

<!-- Source EN PDF p.295; unit 3159 -->

【Beschreibung】

<!-- Source EN PDF p.295; unit 3160 -->

Aktuelle Eigenschaften des CPRO-Moduls abrufen.

<!-- Source EN PDF p.296; unit 3161 -->

【Syntax】

<!-- Source EN PDF p.296; unit 3162 -->

```text
 XCamReturn rk_aiq_user_api2_acp_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         acp_attrib_t* attr);
```

<!-- Source EN PDF p.296; unit 3163 -->

【Parameter】

<!-- Source EN PDF p.296; unit 3164 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften des cproc-Moduls | Ausgabe |

<!-- Source EN PDF p.296; unit 3165 -->

【Rückgabewert】

<!-- Source EN PDF p.296; unit 3166 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.296; unit 3167 -->

【Voraussetzungen】

<!-- Source EN PDF p.296; unit 3168 -->

Headerdatei: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.296; unit 3169 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.296; unit 3170 -->

#### 9.7.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.296; unit 3171 -->

9.7.4.1  acp_attrib_t

<!-- Source EN PDF p.296; unit 3172 -->

【Beschreibung】 Parameter des CPROC-Moduls definieren.

<!-- Source EN PDF p.296; unit 3173 -->

【Definition】

<!-- Source EN PDF p.296; unit 3174 -->

```text
    typedef struct acp_attrib_s {
        uint8_t brightness; /* 0 ~ 255 */
        uint8_t contrast; /* 0 ~ 255 */
        uint8_t saturation; /* 0 ~ 255 */
        uint8_t hue; /* 0 ~ 255 */
    } acp_attrib_t;
```

<!-- Source EN PDF p.296; unit 3175 -->

【Felder】

<!-- Source EN PDF p.297; unit 3176 -->

| Feldname | Beschreibung |
|---|---|
| brightness | Helligkeit, Bereich [0,255], entsprechender Bereich [-128,127], Standardwert 128 |
| contrast | Kontrast, Bereich [0,255], entsprechender Faktor [0, 1.992], Standardwert 128 |
| saturation | Sättigung, Bereich [0,255], entsprechender Faktor [0, 1.992], Standardwert 128 |
| hue | Chromatizität, Bereich [0,255], entsprechender Winkel [-90,87.188], Standardwert 128 |

<!-- Source EN PDF p.297; unit 3177 -->

### 9.8   IE

<!-- Source EN PDF p.297; unit 3178 -->

#### 9.8.1  Funktionsbeschreibung

<!-- Source EN PDF p.297; unit 3179 -->

IE (Image Effect) stellt Bildeffekte wie Schwarzweiß bereit. Dieses Modul verarbeitet Bilder in der YUV-Domäne.

<!-- Source EN PDF p.297; unit 3180 -->

#### 9.8.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.297; unit 3181 -->

#### 9.8.3  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.297; unit 3182 -->

9.8.3.1  rk_aiq_user_api2_aie_SetAttrib

<!-- Source EN PDF p.297; unit 3183 -->

【Beschreibung】

<!-- Source EN PDF p.297; unit 3184 -->

Eigenschaften des IE-Moduls einstellen.

<!-- Source EN PDF p.297; unit 3185 -->

【Syntax】

<!-- Source EN PDF p.297; unit 3186 -->

```text
 XCamReturn rk_aiq_user_api2_aie_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t attr);
```

<!-- Source EN PDF p.297; unit 3187 -->

【Parameter】

<!-- Source EN PDF p.297; unit 3188 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften des IE-Moduls | Eingabe |

<!-- Source EN PDF p.297; unit 3189 -->

【Rückgabewert】

<!-- Source EN PDF p.297; unit 3190 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.297; unit 3191 -->

【Voraussetzungen】

<!-- Source EN PDF p.298; unit 3192 -->

Headerdatei: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3193 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.298; unit 3194 -->

9.8.3.2  rk_aiq_user_api2_aie_GetAttrib

<!-- Source EN PDF p.298; unit 3195 -->

【Beschreibung】

<!-- Source EN PDF p.298; unit 3196 -->

Aktuelle Eigenschaften des IE-Moduls abrufen.

<!-- Source EN PDF p.298; unit 3197 -->

【Syntax】

<!-- Source EN PDF p.298; unit 3198 -->

```text
 XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t* attr);
```

<!-- Source EN PDF p.298; unit 3199 -->

【Parameter】

<!-- Source EN PDF p.298; unit 3200 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften des IE-Moduls | Ausgabe |

<!-- Source EN PDF p.298; unit 3201 -->

【Rückgabewert】

<!-- Source EN PDF p.298; unit 3202 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.298; unit 3203 -->

【Voraussetzungen】

<!-- Source EN PDF p.298; unit 3204 -->

Headerdatei: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3205 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.298; unit 3206 -->

#### 9.8.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.298; unit 3207 -->

9.8.4.1  aie_attrib_t

<!-- Source EN PDF p.298; unit 3208 -->

【Beschreibung】 Parameter des IE-Moduls definieren.

<!-- Source EN PDF p.298; unit 3209 -->

【Definition】

<!-- Source EN PDF p.298; unit 3210 -->

```text
   typedef struct aie_attrib_s {
        rk_aiq_ie_effect_t mode;
   } aie_attrib_t;
```

<!-- Source EN PDF p.298; unit 3211 -->

【Felder】

<!-- Source EN PDF p.299; unit 3212 -->

| Feldname | Beschreibung |
|---|---|
| mode | Effekttyp |

<!-- Source EN PDF p.299; unit 3213 -->

9.8.4.2  rk_aiq_ie_effect_t

<!-- Source EN PDF p.299; unit 3214 -->

【Beschreibung】 IE-Effekttyp definieren.

<!-- Source EN PDF p.299; unit 3215 -->

【Definition】

<!-- Source EN PDF p.299; unit 3216 -->

```text
    typedef enum rk_aiq_ie_effect_e {
        RK_AIQ_IE_EFFECT_NONE,
        RK_AIQ_IE_EFFECT_BW,
        RK_AIQ_IE_EFFECT_NEGATIVE,
        RK_AIQ_IE_EFFECT_SEPIA,
        RK_AIQ_IE_EFFECT_EMBOSS,
       RK_AIQ_IE_EFFECT_SKETCH,
        RK_AIQ_IE_EFFECT_SHARPEN, /*!< deprecated */
   } rk_aiq_ie_effect_t;
```

<!-- Source EN PDF p.299; unit 3217 -->

【Felder】

<!-- Source EN PDF p.299; unit 3218 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_IE_EFFECT_NONE | Keine Spezialeffekte |
| RK_AIQ_IE_EFFECT_BW | Schwarzweißeffekt |
| RK_AIQ_IE_EFFECT_NEGATIVE | Negativeffekt, nicht unterstützt |
| RK_AIQ_IE_EFFECT_SEPIA | Dunkelbrauner Effekt |
| RK_AIQ_IE_EFFECT_EMBOSS | Reliefeffekt |
| RK_AIQ_IE_EFFECT_SKETCH | Skizzeneffekt |
| RK_AIQ_IE_EFFECT_SHARPEN | Nicht unterstützt |

<!-- Source EN PDF p.299; unit 3219 -->

### 9.9   CSM

<!-- Source EN PDF p.299; unit 3220 -->

#### 9.9.1  Funktionsbeschreibung

<!-- Source EN PDF p.299; unit 3221 -->

CSM (Color Space Matrix) ermöglicht die Parametereinstellung der RGB-zu-YUV-Konvertierung.

<!-- Source EN PDF p.300; unit 3222 -->

#### 9.9.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.300; unit 3223 -->

#### 9.9.3  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.300; unit 3224 -->

9.9.3.1  rk_aiq_user_api2_acsm_SetAttrib

<!-- Source EN PDF p.300; unit 3225 -->

【Beschreibung】

<!-- Source EN PDF p.300; unit 3226 -->

Eigenschaften des CSM-Moduls einstellen.

<!-- Source EN PDF p.300; unit 3227 -->

【Syntax】

<!-- Source EN PDF p.300; unit 3228 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t attr);
```

<!-- Source EN PDF p.300; unit 3229 -->

【Parameter】

<!-- Source EN PDF p.300; unit 3230 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaft des CSM-Moduls | Eingabe |

<!-- Source EN PDF p.300; unit 3231 -->

【Rückgabewert】

<!-- Source EN PDF p.300; unit 3232 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.300; unit 3233 -->

【Voraussetzungen】

<!-- Source EN PDF p.300; unit 3234 -->

Headerdatei: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.300; unit 3235 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.300; unit 3236 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.300; unit 3237 -->

Bei attr.param.op_mode = RK_AIQ_OP_MODE_AUTO werden die integrierten CSM-Standardparameter von AIQ verwendet. Bei attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL können CSM-Parameter konfiguriert werden.

<!-- Source EN PDF p.300; unit 3238 -->

attr.param.full_range kann nur auf TRUE gesetzt werden; der begrenzte Wertebereich lässt sich im CGC-Modul konfigurieren.

<!-- Source EN PDF p.300; unit 3239 -->

9.9.3.2  rk_aiq_user_api2_acsm_GetAttrib

<!-- Source EN PDF p.300; unit 3240 -->

【Beschreibung】

<!-- Source EN PDF p.300; unit 3241 -->

Aktuelle Eigenschaften des CSM-Moduls abrufen.

<!-- Source EN PDF p.300; unit 3242 -->

【Syntax】

<!-- Source EN PDF p.301; unit 3243 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t* attr);
```

<!-- Source EN PDF p.301; unit 3244 -->

【Parameter】

<!-- Source EN PDF p.301; unit 3245 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaft des CSM-Moduls | Ausgabe |

<!-- Source EN PDF p.301; unit 3246 -->

【Rückgabewert】

<!-- Source EN PDF p.301; unit 3247 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.301; unit 3248 -->

【Voraussetzungen】

<!-- Source EN PDF p.301; unit 3249 -->

Headerdatei: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.301; unit 3250 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.301; unit 3251 -->

#### 9.9.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.301; unit 3252 -->

9.9.4.1  rk_aiq_uapi_acsm_attrib_t

<!-- Source EN PDF p.301; unit 3253 -->

【Beschreibung】 Parameter des CSM-Moduls definieren.

<!-- Source EN PDF p.301; unit 3254 -->

【Definition】

<!-- Source EN PDF p.301; unit 3255 -->

```text
   typedef struct rk_aiq_uapi_acsm_attrib_s {
       rk_aiq_uapi_sync_t sync;
       rk_aiq_acsm_params_t param;
   } rk_aiq_uapi_acsm_attrib_t;
```

<!-- Source EN PDF p.301; unit 3256 -->

【Felder】

<!-- Source EN PDF p.301; unit 3257 -->

| Feldname | Beschreibung |
|---|---|
| sync | Definitionen von rk_aiq_uapi_sync_t siehe Abschnitt Überblick/API-Beschreibung |
| rk_aiq_acsm_params_t | CSM-Parameter |

<!-- Source EN PDF p.302; unit 3258 -->

9.9.4.2  rk_aiq_acsm_params_t

<!-- Source EN PDF p.302; unit 3259 -->

【Beschreibung】 CSM-Modulparameter definieren.

<!-- Source EN PDF p.302; unit 3260 -->

【Definition】

<!-- Source EN PDF p.302; unit 3261 -->

```text
 typedef struct __csm_param {
     RKAiqOPMode_t op_mode;
     bool full_range;
     uint8_t y_offset;
     uint8_t c_offset;
     float coeff[RK_AIQ_CSM_COEFF_NUM];
 } Csm_Param_t;
```

<!-- Source EN PDF p.302; unit 3262 -->

【Felder】

<!-- Source EN PDF p.302; unit 3263 -->

| Feldname | Beschreibung |
|---|---|
| op_mode | Modus: RK_AIQ_OP_MODE_AUTO oder RK_AIQ_OP_MODE_MANUAL |
| full_range | Ob der volle Wertebereich ausgegeben wird; Standardwert TRUE.<br>Hinweis: Bei ISP30 darf dieses Attribut nur TRUE sein. Der begrenzte Wertebereich<br>sollte über die CGC-Modul-API konfiguriert werden. |
| y_offset | Helligkeitsoffset, Bereich [0,63], Standardwert 0 |
| c_offset | Chromaoffset, Bereich [0,255], Standardwert 0 |
| coeff | 3x3-RGB-zu-YUV-Konvertierungsmatrix, Bereich [-2, 1.992], Standardwerte:<br>[ 0.299, 0.587, 0.114, -<br>0.169, -0.331, 0.5,<br>0.5, -0.419, -0.081] |

<!-- Source EN PDF p.302; unit 3264 -->

### 9.10   Schärfung

<!-- Source EN PDF p.302; unit 3265 -->

#### 9.10.1  Funktionsbeschreibung

<!-- Source EN PDF p.302; unit 3266 -->

Das Sharpen-Modul verbessert die Bildklarheit, indem es unter anderem die Kantenschärfung anpasst sowie Bilddetails und Texturen verstärkt.

<!-- Source EN PDF p.303; unit 3267 -->

#### 9.10.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.303; unit 3268 -->

9.10.2.1  rk_aiq_uapi2_setSharpness

<!-- Source EN PDF p.303; unit 3269 -->

【Beschreibung】

<!-- Source EN PDF p.303; unit 3270 -->

Schärfungsstufe einstellen.

<!-- Source EN PDF p.303; unit 3271 -->

【Syntax】

<!-- Source EN PDF p.303; unit 3272 -->

```text
 XCamReturn rk_aiq_uapi2_setSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.303; unit 3273 -->

【Parameter】

<!-- Source EN PDF p.303; unit 3274 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Schärfungsstufe, Wertebereich [0,100], Standardwert 50 | Eingabe |

<!-- Source EN PDF p.303; unit 3275 -->

【Rückgabewert】

<!-- Source EN PDF p.303; unit 3276 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.303; unit 3277 -->

【Voraussetzungen】

<!-- Source EN PDF p.303; unit 3278 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.303; unit 3279 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.303; unit 3280 -->

9.10.2.2  rk_aiq_uapi2_getSharpness

<!-- Source EN PDF p.303; unit 3281 -->

【Beschreibung】

<!-- Source EN PDF p.303; unit 3282 -->

Schärfungsstufe abrufen.

<!-- Source EN PDF p.303; unit 3283 -->

【Syntax】

<!-- Source EN PDF p.303; unit 3284 -->

```text
 XCamReturn rk_aiq_uapi2_getSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.303; unit 3285 -->

【Parameter】

<!-- Source EN PDF p.303; unit 3286 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| level | Schärfungsstufe | Ausgabe |

<!-- Source EN PDF p.304; unit 3287 -->

【Rückgabewert】

<!-- Source EN PDF p.304; unit 3288 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.304; unit 3289 -->

【Voraussetzungen】

<!-- Source EN PDF p.304; unit 3290 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.304; unit 3291 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.304; unit 3292 -->

#### 9.10.3  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.304; unit 3293 -->

9.10.3.1  rk_aiq_user_api2_asharpV4_SetAttrib

<!-- Source EN PDF p.304; unit 3294 -->

【Beschreibung】 Eigenschaften des Schärfungsalgorithmus einstellen.

<!-- Source EN PDF p.304; unit 3295 -->

【Syntax】

<!-- Source EN PDF p.304; unit 3296 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.304; unit 3297 -->

【Parameter】

<!-- Source EN PDF p.304; unit 3298 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Rauschunterdrückung | Eingabe |

<!-- Source EN PDF p.304; unit 3299 -->

【Rückgabewert】

<!-- Source EN PDF p.304; unit 3300 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.304; unit 3301 -->

【Voraussetzungen】

<!-- Source EN PDF p.304; unit 3302 -->

Headerdateien: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.304; unit 3303 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.305; unit 3304 -->

9.10.3.2  rk_aiq_user_api2_asharpV4_GetAttrib

<!-- Source EN PDF p.305; unit 3305 -->

【Beschreibung】 Eigenschaften des Schärfungsalgorithmus abrufen.

<!-- Source EN PDF p.305; unit 3306 -->

【Syntax】

<!-- Source EN PDF p.305; unit 3307 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.305; unit 3308 -->

【Parameter】

<!-- Source EN PDF p.305; unit 3309 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften der Rauschunterdrückung | Eingabe |

<!-- Source EN PDF p.305; unit 3310 -->

【Rückgabewert】

<!-- Source EN PDF p.305; unit 3311 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.305; unit 3312 -->

【Voraussetzungen】

<!-- Source EN PDF p.305; unit 3313 -->

Headerdateien: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.305; unit 3314 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.305; unit 3315 -->

9.10.3.3  rk_aiq_user_api2_asharpV4_SetStrength

<!-- Source EN PDF p.305; unit 3316 -->

【Beschreibung】 Schärfungsstärke einstellen.

<!-- Source EN PDF p.305; unit 3317 -->

【Syntax】

<!-- Source EN PDF p.305; unit 3318 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.305; unit 3319 -->

【Parameter】

<!-- Source EN PDF p.305; unit 3320 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Schärfungsstärkestruktur; der Prozentwert innerhalb<br>der Struktur hat den Bereich 0.0-1.0 | Eingabe |

<!-- Source EN PDF p.306; unit 3321 -->

【Rückgabewert】

<!-- Source EN PDF p.306; unit 3322 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.306; unit 3323 -->

【Voraussetzungen】

<!-- Source EN PDF p.306; unit 3324 -->

Headerdateien: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.306; unit 3325 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.306; unit 3326 -->

9.10.3.4  rk_aiq_user_api2_asharpV4_GetStrength

<!-- Source EN PDF p.306; unit 3327 -->

【Beschreibung】 Schärfungsstärke abrufen.

<!-- Source EN PDF p.306; unit 3328 -->

【Syntax】

<!-- Source EN PDF p.306; unit 3329 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.306; unit 3330 -->

【Parameter】

<!-- Source EN PDF p.306; unit 3331 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| pStrength | Zeiger auf die Schärfungsstärkestruktur; der Prozentwert innerhalb<br>der Struktur hat den Bereich 0.0-1.0 | Eingabe |

<!-- Source EN PDF p.306; unit 3332 -->

【Rückgabewert】

<!-- Source EN PDF p.306; unit 3333 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.306; unit 3334 -->

【Voraussetzungen】

<!-- Source EN PDF p.306; unit 3335 -->

Headerdateien: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.306; unit 3336 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.307; unit 3337 -->

#### 9.10.4  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.307; unit 3338 -->

9.10.4.1  rk_aiq_sharp_attrib_v4_t

<!-- Source EN PDF p.307; unit 3339 -->

【Beschreibung】 Parameter des Schärfungsmoduls definieren.

<!-- Source EN PDF p.307; unit 3340 -->

【Definition】

<!-- Source EN PDF p.307; unit 3341 -->

```text
 typedef struct rk_aiq_sharp_attrib_v4_s {
     rk_aiq_uapi_sync_t sync;
     Asharp4_OPMode_t eMode;
     Asharp_Auto_Attr_V4_t stAuto;
     Asharp_Manual_Attr_V4_t stManual;
 } rk_aiq_sharp_attrib_v4_t;
```

<!-- Source EN PDF p.307; unit 3342 -->

【Felder】

<!-- Source EN PDF p.307; unit 3343 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus siehe Abschnitt Überblick/API-Beschreibung |
| eMode | Eigenschaften des Schärfungsmoduls |
| stAuto | Parameter des automatischen Schärfungsmodus |

<!-- Source EN PDF p.307; unit 3344 -->

9.10.4.2  Asharp4_OPMode_t

<!-- Source EN PDF p.307; unit 3345 -->

【Beschreibung】

<!-- Source EN PDF p.307; unit 3346 -->

【Definition】

<!-- Source EN PDF p.307; unit 3347 -->

```text
 typedef enum Asharp4_OPMode_e {
     ASHARP4_OP_MODE_INVALID           = 0,
     ASHARP4_OP_MODE_AUTO              = 1,
     ASHARP4_OP_MODE_MANUAL            = 2,
     ASHARP4_OP_MODE_REG_MANUAL        = 3,
     ASHARP4_OP_MODE_MAX
 } Asharp4_OPMode_t;
```

<!-- Source EN PDF p.307; unit 3348 -->

【Felder】

<!-- Source EN PDF p.308; unit 3349 -->

| Feldname | Beschreibung |
|---|---|
| ASHARP4_OP_MODE_INVALID | Ungültiger Modus des Schärfungsmoduls |
| ASHARP4_OP_MODE_AUTO | Automatischer Modus des Schärfungsmoduls |
| ASHARP4_OP_MODE_MANUAL | Algorithmuseinstellungen für den manuellen Modus des<br>Schärfungsmoduls |
| ASHARP4_OP_MODE_REG_MANUAL | Registereinstellungen |
| ASHARP4_OP_MODE_MAX | Maximalwert der Schärfungsmodusaufzählung;<br>ungültiger Modus |

<!-- Source EN PDF p.308; unit 3350 -->

9.10.4.3  Asharp_Auto_Attr_V4_t

<!-- Source EN PDF p.308; unit 3351 -->

【Beschreibung】 Automatischen Schärfungsmodus und die Algorithmuseigenschaftsparameter jeder ISO-Stufe definieren.

<!-- Source EN PDF p.308; unit 3352 -->

【Definition】

<!-- Source EN PDF p.308; unit 3353 -->

```text
 typedef struct Asharp_Auto_Attr_V4_s
 {
     RK_SHARP_Params_V4_t stParams;
     RK_SHARP_Params_V4_Select_t stSelect;
 } Asharp_Auto_Attr_V4_t;
```

<!-- Source EN PDF p.308; unit 3354 -->

【Felder】

<!-- Source EN PDF p.308; unit 3355 -->

| Feldname | Beschreibung |
|---|---|
| stParams | Algorithmuseigenschaftsparameter des SHARP-Moduls für jede ISO-Stufe |
| stSelect | Vom Sharp-Modul berechneter Eigenschaftsparameter |

<!-- Source EN PDF p.308; unit 3356 -->

9.10.4.4  Asharp_Manual_Attr_V4_t

<!-- Source EN PDF p.308; unit 3357 -->

【Beschreibung】 Manuelle Eigenschaften des Schärfungsmoduls definieren.

<!-- Source EN PDF p.308; unit 3358 -->

【Definition】

<!-- Source EN PDF p.309; unit 3359 -->

```text
 typedef struct Asharp_Manual_Attr_V4_s
 {
     RK_SHARP_Params_V4_Select_t stSelect;
     RK_SHARP_Fix_V4_t stFix;
 } Asharp_Manual_Attr_V4_t;
```

<!-- Source EN PDF p.309; unit 3360 -->

【Felder】

<!-- Source EN PDF p.309; unit 3361 -->

| Feldname | Beschreibung |
|---|---|
| stSelect | Manuell gesetzte Sharp-Algorithmusparameter |
| stFix | Sharp-Registerwert |

<!-- Source EN PDF p.309; unit 3362 -->

9.10.4.5  RK_SHARP_Params_V4_t

<!-- Source EN PDF p.309; unit 3363 -->

【Beschreibung】 Manuelle Eigenschaften des Schärfungsmoduls definieren.

<!-- Source EN PDF p.309; unit 3364 -->

【Definition】

<!-- Source EN PDF p.309; unit 3365 -->

```text
 typedef struct RK_SHARP_Params_V4_s
 {
     int enable;
     int iso[RK_SHARP_V4_MAX_ISO_NUM];
     short luma_point        [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma        [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain          [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_add           [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_ratio         [RK_SHARP_V4_MAX_ISO_NUM];
     float gaus_ratio        [RK_SHARP_V4_MAX_ISO_NUM];
     float sharp_ratio       [RK_SHARP_V4_MAX_ISO_NUM];
     short hf_clip        [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain           [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_add            [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_ratio          [RK_SHARP_V4_MAX_ISO_NUM];
     short local_sharp_strength  [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_PBF_DIAM *
 RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_RF_DIAM *
 RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
 } RK_SHARP_Params_V4_t;
```

<!-- Source EN PDF p.310; unit 3366 -->

【Felder】

<!-- Source EN PDF p.311; unit 3367 -->

| Parametername | Parametertyp | Kurzbeschreibung |
|---|---|---|
| Enable | Abstimmparameter | Aktivierungsschalter des Sharp-Moduls.<br>1: ein, 0: aus. |
| iso | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen<br>Abstimmparametern. Derzeit werden nur 13 Stufen unterstützt. |
| pbf_gain | Abstimmparameter | Multiplikator des Vorfilter-Sigma. Je größer<br>der Wert, desto stärker die Filterung und desto weniger Rauschen<br>und Details.<br>Wertebereich [0.0, 2.0], Standardwert 1.0. |
| pbf_add | Abstimmparameter | Additiver Offset des Vorfilter-Sigma. Je größer<br>der Wert, desto stärker die Filterung und desto weniger Rauschen<br>und Details.<br>Wertebereich [0, 1023], Standardwert 0. |
| pbf_ratio | Abstimmparameter | Vorfilter-Fusionsgewicht. Je größer der Wert, desto stärker<br>die Filterung und desto weniger Rauschen und Details.<br>Wertebereich [0.0,<br>1.0], Standardwert 0.5. |
| gaus_ratio | Abstimmparameter | Das Führungsbild der hochfrequenten bilateralen Filterung<br>entsteht durch Fusion von Gauß-Filterergebnis und<br>Originalbild.<br>Je größer der Wert, desto größer das Führungsgewicht<br>des gaußschen bilateralen Filters.<br>Wertebereich [0.0, 1.0], Standardwert 0. |
| sharp_ratio | Abstimmparameter | Schärfungsstärke; größere Werte bewirken stärkere<br>Schärfung.<br>Wertebereich [0.0, 16], Standardwert 6. |
| bf_gain | Abstimmparameter | Multiplikator des Sigma der hochfrequenten bilateralen Filterung.<br>Je größer der Wert, desto stärker die Filterung und desto weniger<br>Rauschen und Details.<br>Wertebereich [0.0, 2.0], Standardwert 1.0. |
| bf_add | Abstimmparameter | Additiver Sigma-Offset der hochfrequenten bilateralen<br>Filterung. Größere Werte bewirken stärkere Filterung,<br>weniger Rauschen und weniger Details.<br>Wertebereich [0, 1023], Standardwert 0. |
| bf_add | Abstimmparameter | Fusionsgewicht der hochfrequenten bilateralen Filterung.<br>Größere Werte bewirken stärkere Filterung, weniger Rauschen<br>und weniger Details. Wertebereich [0.0,<br>1.0], Standardwert 0.5. |

<!-- Source EN PDF p.312; unit 3368 -->

| Parametername | Parametertyp | Kurzbeschreibung |
|---|---|---|
| luma_point / luma_sigma | Abstimmparameter | Verschiedenen Pixelhelligkeiten entsprechen unterschiedliche<br>Rausch-SIGMA-Kurven.<br>luma_point ist der Kurvenhelligkeitswert im Bereich [0,<br>1023].<br>luma_sigma ist die Rauschintensität im Bereich [0,<br>1023]. |
| luma_point / hf_clip | Abstimmparameter | Begrenzungsbereich der Hochfrequenzwerte bei unterschiedlichen<br>Pixelhelligkeiten.<br>Größere Werte erlauben eine höhere maximale<br>Schärfungsstärke.<br>Wertebereich [0, 1023], Standardwert 256. |
| luma_point /<br>local_sharp_strength | Abstimmparameter | Anteil bzw. Hochfrequenzüberlagerungsgewicht bei unterschiedlichen<br>Pixelhelligkeiten.<br>Je größer der Wert, desto mehr Hochfrequenzanteile dürfen<br>überlagert werden und desto schärfer ist das Bild.<br>Wertebereich [0, 1023], Standardwert 512. |
| prefilter_coeff | Abstimmparameter | Vorfilteroperatoren. |
| GaussianFilter_coeff | Abstimmparameter | Gauß-Filteroperatoren. |
| hfBilateralFilter_coeff | Abstimmparameter | Operatoren der hochfrequenten bilateralen Filterung. |

<!-- Source EN PDF p.312; unit 3369 -->

9.10.4.6  RK_SHARP_Params_V4_Select_t

<!-- Source EN PDF p.312; unit 3370 -->

【Beschreibung】 Algorithmuseigenschaften des manuellen Schärfungsmodus definieren.

<!-- Source EN PDF p.312; unit 3371 -->

【Definition】

<!-- Source EN PDF p.312; unit 3372 -->

```text
 typedef struct RK_SHARP_Params_V4_Select_s
 {
     int enable;
     short luma_point    [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma    [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain      ;
     float pbf_add       ;
     float pbf_ratio     ;
     float gaus_ratio    ;
     float sharp_ratio   ;
     short hf_clip       [RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain       ;
     float bf_add        ;
     float bf_ratio      ;
     short local_sharp_strength        [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_PBF_DIAM * RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_RF_DIAM * RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
```

<!-- Source EN PDF p.313; unit 3373 -->

```text
 } RK_SHARP_Params_V4_Select_t;
```

<!-- Source EN PDF p.313; unit 3374 -->

【Felder】

<!-- Source EN PDF p.314; unit 3375 -->

| Parametername | Parametertyp | Kurzbeschreibung |
|---|---|---|
| Enable | Abstimmparameter | Aktivierungsschalter des Sharp-Moduls.<br>1: ein, 0: aus. |
| iso | Abstimmparameter | Verschiedene ISO-Stufen mit unterschiedlichen<br>Abstimmparametern. Derzeit werden nur 13 Stufen unterstützt. |
| pbf_gain | Abstimmparameter | Multiplikator des Vorfilter-Sigma. Je größer<br>der Wert, desto stärker die Filterung und desto weniger Rauschen<br>und Details.<br>Wertebereich [0.0, 2.0], Standardwert 1.0. |
| pbf_add | Abstimmparameter | Additiver Offset des Vorfilter-Sigma. Je größer<br>der Wert, desto stärker die Filterung und desto weniger Rauschen<br>und Details.<br>Wertebereich [0, 1023], Standardwert 0. |
| pbf_ratio | Abstimmparameter | Vorfilter-Fusionsgewicht. Je größer der Wert, desto stärker<br>die Filterung und desto weniger Rauschen und Details.<br>Wertebereich [0.0,<br>1.0], Standardwert 0.5. |
| gaus_ratio | Abstimmparameter | Das Führungsbild der hochfrequenten bilateralen Filterung<br>entsteht durch Fusion von Gauß-Filterergebnis und<br>Originalbild.<br>Je größer der Wert, desto größer das Führungsgewicht<br>des gaußschen bilateralen Filters.<br>Wertebereich [0.0, 1.0], Standardwert 0. |
| sharp_ratio | Abstimmparameter | Schärfungsstärke; größere Werte bewirken stärkere<br>Schärfung.<br>Wertebereich [0.0, 16], Standardwert 6. |
| bf_gain | Abstimmparameter | Multiplikator des Sigma der hochfrequenten bilateralen Filterung.<br>Je größer der Wert, desto stärker die Filterung und desto weniger<br>Rauschen und Details.<br>Wertebereich [0.0, 2.0], Standardwert 1.0. |
| bf_add | Abstimmparameter | Additiver Sigma-Offset der hochfrequenten bilateralen<br>Filterung. Größere Werte bewirken stärkere Filterung,<br>weniger Rauschen und weniger Details.<br>Wertebereich [0, 1023], Standardwert 0. |
| bf_add | Abstimmparameter | Fusionsgewicht der hochfrequenten bilateralen Filterung.<br>Größere Werte bewirken stärkere Filterung, weniger Rauschen<br>und weniger Details. Wertebereich [0.0,<br>1.0], Standardwert 0.5. |

<!-- Source EN PDF p.315; unit 3376 -->

| Parametername | Parametertyp | Kurzbeschreibung |
|---|---|---|
| luma_point / luma_sigma | Abstimmparameter | Verschiedenen Pixelhelligkeiten entsprechen unterschiedliche<br>Rausch-SIGMA-Kurven.<br>luma_point ist der Kurvenhelligkeitswert im Bereich [0,<br>1023].<br>luma_sigma ist die Rauschintensität im Bereich [0,<br>1023]. |
| luma_point / hf_clip | Abstimmparameter | Begrenzungsbereich der Hochfrequenzwerte bei unterschiedlichen<br>Pixelhelligkeiten.<br>Größere Werte erlauben eine höhere maximale<br>Schärfungsstärke.<br>Wertebereich [0, 1023], Standardwert 256. |
| luma_point /<br>local_sharp_strength | Abstimmparameter | Anteil bzw. Hochfrequenzüberlagerungsgewicht bei unterschiedlichen<br>Pixelhelligkeiten.<br>Je größer der Wert, desto mehr Hochfrequenzanteile dürfen<br>überlagert werden und desto schärfer ist das Bild.<br>Wertebereich [0, 1023], Standardwert 512. |
| prefilter_coeff | Abstimmparameter | Vorfilteroperatoren. |
| GaussianFilter_coeff | Abstimmparameter | Gauß-Filteroperatoren. |
| hfBilateralFilter_coeff | Abstimmparameter | Operatoren der hochfrequenten bilateralen Filterung. |

<!-- Source EN PDF p.315; unit 3377 -->

9.10.4.7  RK_SHARP_Fix_V4_t

<!-- Source EN PDF p.315; unit 3378 -->

【Beschreibung】 Registerkonfiguration des manuellen Schärfungsmodus definieren.

<!-- Source EN PDF p.315; unit 3379 -->

【Definition】

<!-- Source EN PDF p.315; unit 3380 -->

```text
 typedef struct RK_SHARP_Fix_V4_s
 {
     // SHARP_SHARP_EN (0x0000)
     uint8_t sharp_clk_dis;
     uint8_t sharp_exgain_bypass;
     uint8_t sharp_center_mode;
     uint8_t sharp_bypass;
     uint8_t sharp_en;
     // SHARP_SHARP_RATIO  (0x0004)
     uint8_t sharp_sharp_ratio;
     uint8_t sharp_bf_ratio;
     uint8_t sharp_gaus_ratio;
     uint8_t sharp_pbf_ratio;
     // SHARP_SHARP_LUMA_DX (0x0008)
     uint8_t sharp_luma_dx[7];
     // SHARP_SHARP_PBF_SIGMA_INV_0 (0x000c - 0x0014)
     uint16_t sharp_pbf_sigma_inv[8];
     // SHARP_SHARP_BF_SIGMA_INV_0 (0x0018 -  0x0020)
     uint16_t sharp_bf_sigma_inv[8];
     // SHARP_SHARP_SIGMA_SHIFT (0x00024)
     uint8_t sharp_bf_sigma_shift;
     uint8_t sharp_pbf_sigma_shift;
     // SHARP_SHARP_EHF_TH_0 (0x0028 -  0x0030)
     uint16_t sharp_ehf_th[8];
     // SHARP_SHARP_CLIP_HF_0 (0x0034 -  0x003c)
     uint16_t sharp_clip_hf[8];
     // SHARP_SHARP_PBF_COEF (0x00040)
     uint8_t sharp_pbf_coef[3];
     // SHARP_SHARP_BF_COEF (0x00044)
     uint8_t sharp_bf_coef[3];
     // SHARP_SHARP_GAUS_COEF (0x00048 - 0x0004c)
     uint8_t sharp_gaus_coef[6];
 } RK_SHARP_Fix_V4_t;
```

<!-- Source EN PDF p.316; unit 3381 -->

【Felder】

<!-- Source EN PDF p.317; unit 3382 -->

| Parametername | Parameterbeschreibung |
|---|---|
| sharp_clk_dis | clk-Gate-Einstellung des Sharp-Moduls; derzeit nicht unterstützt,<br>Standardwert 0. |
| sharp_exgain_bypass | Ob das externe lokale Verstärkungsmodul umgangen wird; diese Einstellung wird<br>derzeit nicht unterstützt, Standardwert 0. |
| sharp_center_mode | Ob die Schärfung den Bildmittelpunkt als Koordinatenursprung verwendet.<br>Konfiguration derzeit nicht unterstützt, Standardwert 0. |
| sharp_bypass | Schärfungsmodul umgehen: 1 umgehen; 0 nicht umgehen |
| sharp_en | Schärfungsmodul aktivieren: 1 aktiviert; 0 deaktiviert |
| sharp_sharp_ratio | sharp_ratio: Schärfungsstärke, 0~15.9 |
| sharp_bf_ratio | Fusionsgewicht des bilateralen Filters, 0~1.0 |
| sharp_gaus_ratio | gaus_ratio: Gauß-Filter-Fusionsgewicht, Wertebereich [0.0, 1.0] |
| sharp_pbf_ratio | Fusionsgewicht der bilateralen Vorfilterung, Wertebereich [0.0, 1.0],<br>Standardwert 0.5 |
| sharp_luma_dx7 | Abstand zwischen Punkt 6 und Punkt 7. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx7. |
| sharp_luma_dx6 | Abstand zwischen Punkt 5 und Punkt 6. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx6. |
| sharp_luma_dx5 | Abstand zwischen Punkt 4 und Punkt 5. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx5. |
| sharp_luma_dx4 | Abstand zwischen Punkt 3 und Punkt 4. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx4. |
| sharp_luma_dx3 | Abstand zwischen Punkt 2 und Punkt 3. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx3. |
| sharp_luma_dx2 | Abstand zwischen Punkt 1 und Punkt 2. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx2. |
| sharp_luma_dx1 | Abstand zwischen Punkt 0 und Punkt 1. Der tatsächliche Abstand beträgt<br>2^sw_sharp_luma_dx1.<br>Hinweis: Der Gesamtabstand muss 1024 betragen. |
| sharp_pbf_sigma_inv | Kehrwert von Sharp-pbf-Sigma |
| sharp_bf_sigma_inv | Kehrwert von Sharp-bf-Sigma |
| sharp_pbf_coef | Bilateraler Vorfilterkern des Schärfungsmoduls |
| sharp_bf_coef | Bilaterale Filterkerne |
| sharp_gaus_coef | Gauß-Filterkern |

<!-- Source EN PDF p.318; unit 3383 -->

9.10.4.8  rk_aiq_sharp_strength_v4_t

<!-- Source EN PDF p.318; unit 3384 -->

【Beschreibung】 Konfigurationsstruktur der Rauschunterdrückungsstärke des Schärfungsmoduls definieren.

<!-- Source EN PDF p.318; unit 3385 -->

【Definition】

<!-- Source EN PDF p.318; unit 3386 -->

```text
 typedef struct rk_aiq_sharp_strength_v4_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_sharp_strength_v4_t;
```

<!-- Source EN PDF p.318; unit 3387 -->

【Felder】

<!-- Source EN PDF p.318; unit 3388 -->

| Feldname | Beschreibung |
|---|---|
| sync | Auswahl des synchronen/asynchronen Modus siehe Abschnitt Überblick/API-Beschreibung |
| percent | Schärfungsstärke, Wertebereich 0.0-1.0. |

<!-- Source EN PDF p.318; unit 3389 -->

### 9.11   Gamma

<!-- Source EN PDF p.318; unit 3390 -->

#### 9.11.1  Funktionsbeschreibung

<!-- Source EN PDF p.318; unit 3391 -->

Das Gamma-Modul führt eine nichtlineare Umwandlung im Helligkeitsraum durch, um Bilder an das Ausgabegerät anzupassen. RK3588 unterstützt eine 49-Punkt-Gammakurve im logarithmischen Bereich mit folgenden Abszissen:

<!-- Source EN PDF p.318; unit 3392 -->

```text
 int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
 768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
 4095};
```

<!-- Source EN PDF p.318; unit 3393 -->

#### 9.11.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.318; unit 3394 -->

9.11.2.1  rk_aiq_uapi2_setGammaCoef

<!-- Source EN PDF p.318; unit 3395 -->

【Beschreibung】

<!-- Source EN PDF p.318; unit 3396 -->

Gammakurven mit GammaCoef und SlopeAtZero schnell einstellen. Die Kurve wird wie folgt erzeugt:

<!-- Source EN PDF p.318; unit 3397 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.318; unit 3398 -->

【Syntax】

<!-- Source EN PDF p.319; unit 3399 -->

```text
 XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx, float
 GammaCoef, float SlopeAtZero);
```

<!-- Source EN PDF p.319; unit 3400 -->

【Parameter】

<!-- Source EN PDF p.319; unit 3401 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| GammaCoef | Gammakoeffizient, Wertebereich [0,100], Standardwert 2.2,<br>Genauigkeit 0.01 | Eingabe |
| SlopeAtZero | Steigung im dunklen Bereich, Wertebereich [-0.05,0.05], Standardwert 0,<br>Genauigkeit 0.001 | Eingabe |

<!-- Source EN PDF p.319; unit 3402 -->

【Rückgabewert】

<!-- Source EN PDF p.319; unit 3403 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.319; unit 3404 -->

【Voraussetzungen】

<!-- Source EN PDF p.319; unit 3405 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.319; unit 3406 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.319; unit 3407 -->

【Beschreibung】

<!-- Source EN PDF p.319; unit 3408 -->

Die über die API gesetzte Gammakurve wird nicht szenenabhängig umgeschaltet. Ändert sich die Szene, stellen Sie die Kurve erneut über die API ein.

<!-- Source EN PDF p.319; unit 3409 -->

#### 9.11.3  Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.319; unit 3410 -->

#### 9.11.4  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.319; unit 3411 -->

9.11.4.1  rk_aiq_user_api2_agamma_SetAttrib

<!-- Source EN PDF p.319; unit 3412 -->

【Beschreibung】 Gamma-Softwareeigenschaften einstellen.

<!-- Source EN PDF p.319; unit 3413 -->

【Syntax】

<!-- Source EN PDF p.319; unit 3414 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_v11_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, const
 rk_aiq_gamma_v11_attrib_t* attr);
```

<!-- Source EN PDF p.319; unit 3415 -->

【Parameter】

<!-- Source EN PDF p.320; unit 3416 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der Gamma-Softwareeigenschaften | Eingabe |

<!-- Source EN PDF p.320; unit 3417 -->

【Rückgabewert】

<!-- Source EN PDF p.320; unit 3418 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.320; unit 3419 -->

【Voraussetzungen】

<!-- Source EN PDF p.320; unit 3420 -->

Headerdatei: rk_aiq_user_api2_agamma.h

<!-- Source EN PDF p.320; unit 3421 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.320; unit 3422 -->

【Beschreibung】

<!-- Source EN PDF p.320; unit 3423 -->

Die über die API gesetzte Gammakurve wird nicht szenenabhängig umgeschaltet. Ändert sich die Szene, stellen Sie die Kurve erneut über die API ein.

<!-- Source EN PDF p.320; unit 3424 -->

9.11.4.2  rk_aiq_user_api2_agamma_GetAttrib

<!-- Source EN PDF p.320; unit 3425 -->

【Beschreibung】 Gamma-Softwareeigenschaften abrufen.

<!-- Source EN PDF p.320; unit 3426 -->

【Syntax】

<!-- Source EN PDF p.320; unit 3427 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_gamma_attrib_t* attr);
```

<!-- Source EN PDF p.320; unit 3428 -->

【Parameter】

<!-- Source EN PDF p.320; unit 3429 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der Gamma-Softwareeigenschaften | Ausgabe |

<!-- Source EN PDF p.320; unit 3430 -->

【Rückgabewert】

<!-- Source EN PDF p.320; unit 3431 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.320; unit 3432 -->

【Voraussetzungen】

<!-- Source EN PDF p.320; unit 3433 -->

Headerdatei: rk_aiq_user_api2_agamma.h

<!-- Source EN PDF p.321; unit 3434 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.321; unit 3435 -->

【Beschreibung】

<!-- Source EN PDF p.321; unit 3436 -->

#### 9.11.5  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.321; unit 3437 -->

9.11.5.1  rk_aiq_gamma_op_mode_t

<!-- Source EN PDF p.321; unit 3438 -->

【Beschreibung】 Gamma-Betriebsart definieren.

<!-- Source EN PDF p.321; unit 3439 -->

【Definition】

<!-- Source EN PDF p.321; unit 3440 -->

```text
 typedef enum rk_aiq_gamma_op_mode_s {
     RK_AIQ_GAMMA_MODE_OFF             = 0,
     RK_AIQ_GAMMA_MODE_MANUAL          = 1,
     RK_AIQ_GAMMA_MODE_FAST            = 2,
 } rk_aiq_gamma_op_mode_t;
```

<!-- Source EN PDF p.321; unit 3441 -->

【Felder】

<!-- Source EN PDF p.321; unit 3442 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_GAMMA_MODE_OFF | API ausgeschaltet |
| RK_AIQ_GAMMA_MODE_MANUAL | Manueller API-Modus |
| RK_AIQ_GAMMA_MODE_FAST | API-Schnellmodus |

<!-- Source EN PDF p.321; unit 3443 -->

9.11.5.2  Agamma_api_Fast_t

<!-- Source EN PDF p.321; unit 3444 -->

【Beschreibung】 Gamma-Eigenschaft im Schnellmodus definieren.

<!-- Source EN PDF p.321; unit 3445 -->

Gammakurven mit GammaBeef und SlopeAtZero schnell einstellen. Die Kurve wird wie folgt erzeugt (Schreibweise GammaBeef aus der Quelle):

<!-- Source EN PDF p.321; unit 3446 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.321; unit 3447 -->

【Definition】

<!-- Source EN PDF p.321; unit 3448 -->

```text
 typedef struct Agamma_api_Fast_s {
     bool  en;
     float GammaCoef;
     float SlopeAtZero;
 } Agamma_api_Fast_t;
```

<!-- Source EN PDF p.321; unit 3449 -->

【Felder】

<!-- Source EN PDF p.322; unit 3450 -->

| Feldname | Beschreibung |
|---|---|
| en | Funktionsschalter |
| GammaCoef | Gammakoeffizient, Wertebereich 0, 100, Standardwert 2.2,<br>Genauigkeit 0.01 |
| SlopeAtZero | Steigung im dunklen Bereich: laut Quelle 0.05 und 0.05, Standardwert 0,<br>Genauigkeit 0.001. Dies widerspricht dem zuvor angegebenen Bereich [-0.05,0.05]. |

<!-- Source EN PDF p.322; unit 3451 -->

9.11.5.3  GammaType_t

<!-- Source EN PDF p.322; unit 3452 -->

【Beschreibung】 Eigenschaft des X-Achsen-Abstandstyps der Gammakurve definieren.

<!-- Source EN PDF p.322; unit 3453 -->

【Definition】

<!-- Source EN PDF p.322; unit 3454 -->

```text
 typedef enum GammaType_e {
    GAMMATYPE_LOG = 0,
    GAMMATYPE_EQU = 1,
 } GammaType_t;
```

<!-- Source EN PDF p.322; unit 3455 -->

【Felder】

<!-- Source EN PDF p.322; unit 3456 -->

| Feldname | Beschreibung |
|---|---|
| GAMMATYPE_LOG | Ungleichmäßige Abstände |
| GAMMATYPE_EQU | Gleichmäßige Abstände |

<!-- Source EN PDF p.322; unit 3457 -->

9.11.5.4  Agamma_api_manualV21_t

<!-- Source EN PDF p.322; unit 3458 -->

【Beschreibung】 Manuelle Gamma-Eigenschaft für RK356x definieren.

<!-- Source EN PDF p.322; unit 3459 -->

【Definition】

<!-- Source EN PDF p.322; unit 3460 -->

```text
 typedef struct Agamma_api_manualV21_s {
    bool        Gamma_en;
    GammaType_t Gamma_out_segnum;
    uint16_t    Gamma_out_offset;
    uint16_t    Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM];
 } Agamma_api_manualV21_t;
```

<!-- Source EN PDF p.322; unit 3461 -->

【Felder】

<!-- Source EN PDF p.323; unit 3462 -->

| Feldname | Beschreibung |
|---|---|
| Gamma_en | Funktionsschalter |
| Gamma_out_segnum | X-Achsen-Abstandstyp der manuellen Gammakurve, Standardwert GAMMATYPE_LOG |
| Gamma_out_offset | Korrekturkoeffizient der manuellen Gammakurve, Wertebereich [-2048, 2048],<br>Standardwert 0, Genauigkeit 1. |
| Gamma_curve | Manuelle Gammakurve, Wertebereich [0,4095], Genauigkeit 1 |

<!-- Source EN PDF p.323; unit 3463 -->

9.11.5.5  Agamma_api_manualV30_t

<!-- Source EN PDF p.323; unit 3464 -->

【Beschreibung】 Manuelle Gamma-Eigenschaft für RK3588 definieren.

<!-- Source EN PDF p.323; unit 3465 -->

【Definition】

<!-- Source EN PDF p.323; unit 3466 -->

```text
 typedef struct Agamma_api_manualV30_s {
    bool     Gamma_en;
    uint16_t Gamma_out_offset;
    uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V30];
 } Agamma_api_manualV30_t;
```

<!-- Source EN PDF p.323; unit 3467 -->

【Felder】

<!-- Source EN PDF p.323; unit 3468 -->

| Feldname | Beschreibung |
|---|---|
| Gamma_en | Funktionsschalter |
| Gamma_out_offset | Korrekturkoeffizient der manuellen Gammakurve, Wertebereich [-2048, 2048],<br>Standardwert 0, Genauigkeit 1. |
| Gamma_curve | Manuelle Gammakurve, Wertebereich [0,4095], Genauigkeit 1 |

<!-- Source EN PDF p.323; unit 3469 -->

9.11.5.6  rk_aiq_gamma_attrV21_t

<!-- Source EN PDF p.323; unit 3470 -->

【Beschreibung】 Gamma-Eigenschaft für RK356x definieren.

<!-- Source EN PDF p.323; unit 3471 -->

【Definition】

<!-- Source EN PDF p.323; unit 3472 -->

```text
 typedef struct rk_aiq_gamma_attrV21_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV21_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV21_t;
```

<!-- Source EN PDF p.323; unit 3473 -->

【Felder】

<!-- Source EN PDF p.324; unit 3474 -->

| Feldname | Beschreibung |
|---|---|
| mode | API-Modus |
| stManual | Manueller Gamma-Parameter |
| stFast | Schnellmodusparameter |

<!-- Source EN PDF p.324; unit 3475 -->

9.11.5.7  rk_aiq_gamma_attrV30_t

<!-- Source EN PDF p.324; unit 3476 -->

【Beschreibung】 Gamma-Eigenschaft für RK3588 definieren.

<!-- Source EN PDF p.324; unit 3477 -->

【Definition】

<!-- Source EN PDF p.324; unit 3478 -->

```text
 typedef struct rk_aiq_gamma_attrV30_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV30_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV30_t;
```

<!-- Source EN PDF p.324; unit 3479 -->

【Felder】

<!-- Source EN PDF p.324; unit 3480 -->

| Feldname | Beschreibung |
|---|---|
| mode | API-Schema |
| stManual | Manueller Gamma-Parameter |
| stFast | Schnellmodusparameter |

<!-- Source EN PDF p.324; unit 3481 -->

9.11.5.8  rk_aiq_gamma_attr_t

<!-- Source EN PDF p.324; unit 3482 -->

【Beschreibung】 Gamma-Eigenschaft definieren.

<!-- Source EN PDF p.324; unit 3483 -->

【Definition】

<!-- Source EN PDF p.324; unit 3484 -->

```text
 typedef struct rk_aiq_gamma_attr_s {
     rk_aiq_uapi_sync_t     sync;
     rk_aiq_gamma_attrV21_t atrrV21;
     rk_aiq_gamma_attrV30_t atrrV30;
 } rk_aiq_gamma_attr_t;
```

<!-- Source EN PDF p.324; unit 3485 -->

【Felder】

<!-- Source EN PDF p.325; unit 3486 -->

| Feldname | Beschreibung |
|---|---|
| sync | Zur Definition von rk_aiq_uapi_sync_t siehe Übersicht/API-Beschreibung |
| atrrV21 | Manuelle Gamma-Eigenschaft für den RK356x-Chip |
| atrrV30 | Manuelle Gamma-Eigenschaft für den RK3588-Chip |

<!-- Source EN PDF p.325; unit 3487 -->

### 9.12   CCM

<!-- Source EN PDF p.325; unit 3488 -->

#### 9.12.1  Funktionsbeschreibung

<!-- Source EN PDF p.325; unit 3489 -->

Das CCM-Modul (Color Correction Matrix) führt Farbkorrektur auf Bildern durch.

<!-- Source EN PDF p.325; unit 3490 -->

#### 9.12.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.325; unit 3491 -->

9.12.2.1  rk_aiq_uapi2_setCCMMode

<!-- Source EN PDF p.325; unit 3492 -->

【Beschreibung】 CCM-Betriebsart einstellen.

<!-- Source EN PDF p.325; unit 3493 -->

【Syntax】

<!-- Source EN PDF p.325; unit 3494 -->

```text
 XCamReturn rk_aiq_uapi2_setCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.325; unit 3495 -->

【Parameter】

<!-- Source EN PDF p.325; unit 3496 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsart;<br>Wertebereich: {OP_AUTO, OP_MANUAL} | Eingabe |

<!-- Source EN PDF p.325; unit 3497 -->

【Rückgabewert】

<!-- Source EN PDF p.325; unit 3498 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.325; unit 3499 -->

【Voraussetzungen】

<!-- Source EN PDF p.325; unit 3500 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.325; unit 3501 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.325; unit 3502 -->

【Beispiel】

<!-- Source EN PDF p.326; unit 3503 -->

Zum Einstellen des manuellen/automatischen Modus siehe "sample_set_ccm_manual" / "sample_set_ccm_auto" in sample_accm_module.cpp.

<!-- Source EN PDF p.326; unit 3504 -->

9.12.2.2  rk_aiq_uapi2_getCCMMode

<!-- Source EN PDF p.326; unit 3505 -->

【Beschreibung】 CCM-Betriebsart abrufen.

<!-- Source EN PDF p.326; unit 3506 -->

【Syntax】

<!-- Source EN PDF p.326; unit 3507 -->

```text
 XCamReturn rk_aiq_uapi2_getCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.326; unit 3508 -->

【Parameter】

<!-- Source EN PDF p.326; unit 3509 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsart;<br>Wertebereich: {OP_AUTO, OP_MANUAL} | Ausgabe |

<!-- Source EN PDF p.326; unit 3510 -->

【Rückgabewert】

<!-- Source EN PDF p.326; unit 3511 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.326; unit 3512 -->

【Voraussetzungen】

<!-- Source EN PDF p.326; unit 3513 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.326; unit 3514 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.326; unit 3515 -->

【Beispiel】

<!-- Source EN PDF p.326; unit 3516 -->

Zum Abrufen der Betriebsart siehe "sample_get_ccm_mode" in sample_accm_module.cpp.

<!-- Source EN PDF p.326; unit 3517 -->

9.12.2.3  rk_aiq_uapi2_setMCcCoef

<!-- Source EN PDF p.326; unit 3518 -->

【Beschreibung】 CCM-Matrix im manuellen Modus einstellen, einschließlich Farbkorrekturmatrix und R/G/B-Kanaloffset.

<!-- Source EN PDF p.326; unit 3519 -->

【Syntax】

<!-- Source EN PDF p.326; unit 3520 -->

```text
 XCamReturn rk_aiq_uapi2_setMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.326; unit 3521 -->

【Parameter】

<!-- Source EN PDF p.327; unit 3522 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mccm | CCM-Matrix im manuellen Modus einschließlich Farbkorrekturmatrix<br>und R/G/B-Kanaloffset | Eingabe |

<!-- Source EN PDF p.327; unit 3523 -->

【Rückgabewert】

<!-- Source EN PDF p.327; unit 3524 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.327; unit 3525 -->

【Voraussetzungen】

<!-- Source EN PDF p.327; unit 3526 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.327; unit 3527 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.327; unit 3528 -->

【Beispiel】

<!-- Source EN PDF p.327; unit 3529 -->

Zum Einstellen einer manuellen CCM-Matrix siehe "sample_set_ccm_manual_matrix" in sample_accm_module.cpp.

<!-- Source EN PDF p.327; unit 3530 -->

9.12.2.4  rk_aiq_uapi2_getMCcCoef

<!-- Source EN PDF p.327; unit 3531 -->

【Beschreibung】 CCM-Matrix einschließlich Farbkorrekturmatrix und R/G/B-Kanaloffset abrufen.

<!-- Source EN PDF p.327; unit 3532 -->

【Syntax】

<!-- Source EN PDF p.327; unit 3533 -->

```text
 XCamReturn rk_aiq_uapi2_getMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.327; unit 3534 -->

【Parameter】

<!-- Source EN PDF p.327; unit 3535 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mccm | CCM-Matrix einschließlich Farbkorrekturmatrix und R/G/B-<br>Kanaloffset | Ausgabe |

<!-- Source EN PDF p.327; unit 3536 -->

【Rückgabewert】

<!-- Source EN PDF p.327; unit 3537 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.328; unit 3538 -->

【Voraussetzungen】

<!-- Source EN PDF p.328; unit 3539 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3540 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.328; unit 3541 -->

【Beispiel】

<!-- Source EN PDF p.328; unit 3542 -->

Zum Abrufen der CCM-Matrix siehe "sample_get_ccm_manual_matrix" in sample_accm_module.cpp.

<!-- Source EN PDF p.328; unit 3543 -->

9.12.2.5  rk_aiq_uapi2_getACcmSat

<!-- Source EN PDF p.328; unit 3544 -->

【Beschreibung】 CCM-Sättigung im automatischen Modus abrufen.

<!-- Source EN PDF p.328; unit 3545 -->

【Syntax】

<!-- Source EN PDF p.328; unit 3546 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmSat(const rk_aiq_sys_ctx_t* ctx,  float
 *finalsat);
```

<!-- Source EN PDF p.328; unit 3547 -->

【Parameter】

<!-- Source EN PDF p.328; unit 3548 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| finalsat | Sättigung; im manuellen Modus 0 | Ausgabe |

<!-- Source EN PDF p.328; unit 3549 -->

【Rückgabewert】

<!-- Source EN PDF p.328; unit 3550 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.328; unit 3551 -->

【Voraussetzungen】

<!-- Source EN PDF p.328; unit 3552 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3553 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.328; unit 3554 -->

【Beispiel】

<!-- Source EN PDF p.328; unit 3555 -->

Zur CCM-Sättigung im automatischen Modus siehe "sample_get_accm_sat" in sample_accm_module.cpp.

<!-- Source EN PDF p.328; unit 3556 -->

9.12.2.6  rk_aiq_uapi2_getACcmMatrixName

<!-- Source EN PDF p.328; unit 3557 -->

【Beschreibung】 CCM-Matrixnamen im automatischen Modus abrufen.

<!-- Source EN PDF p.328; unit 3558 -->

【Syntax】

<!-- Source EN PDF p.328; unit 3559 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmMatrixName(const rk_aiq_sys_ctx_t* ctx, char
 **ccm_name);
```

<!-- Source EN PDF p.329; unit 3560 -->

【Parameter】

<!-- Source EN PDF p.329; unit 3561 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| ccm_name | CCM-Matrixname | Ausgabe |

<!-- Source EN PDF p.329; unit 3562 -->

【Rückgabewert】

<!-- Source EN PDF p.329; unit 3563 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.329; unit 3564 -->

【Voraussetzungen】

<!-- Source EN PDF p.329; unit 3565 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.329; unit 3566 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.329; unit 3567 -->

【Beispiel】

<!-- Source EN PDF p.329; unit 3568 -->

Zum Abrufen der CCM-Sättigung im automatischen Modus siehe "sample_get_accm_matrix_name" in sample_accm_module.cpp (die Quelle schreibt hier Sättigung).

<!-- Source EN PDF p.329; unit 3569 -->

#### 9.12.3  Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.329; unit 3570 -->

9.12.3.1  opMode_t

<!-- Source EN PDF p.329; unit 3571 -->

【Beschreibung】 CCM-Betriebsart definieren.

<!-- Source EN PDF p.329; unit 3572 -->

【Definition】

<!-- Source EN PDF p.329; unit 3573 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUAL = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.329; unit 3574 -->

【Felder】

<!-- Source EN PDF p.329; unit 3575 -->

| Feldname | Beschreibung |
|---|---|
| OP_AUTO | Automatikmodus |
| OP_MANUAL | Manueller Modus |
| OP_INVAL | Ungültiger Wert |

<!-- Source EN PDF p.330; unit 3576 -->

9.12.3.2  rk_aiq_ccm_matrix_t

<!-- Source EN PDF p.330; unit 3577 -->

【Beschreibung】 CCM-Matrix definieren.

<!-- Source EN PDF p.330; unit 3578 -->

【Definition】

<!-- Source EN PDF p.330; unit 3579 -->

```text
 typedef struct rk_aiq_ccm_matrix_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
 } rk_aiq_ccm_matrix_t;
```

<!-- Source EN PDF p.330; unit 3580 -->

【Felder】

<!-- Source EN PDF p.330; unit 3581 -->

| Feldname | Beschreibung |
|---|---|
| ccMatrix | Farbkorrekturmatrix im manuellen Modus;<br>Wertebereich [-8, 7.992] |
| ccOffsets | RGB-Komponentenoffset im manuellen Modus;<br>Wertebereich [-4096, 4095] |

<!-- Source EN PDF p.330; unit 3582 -->

#### 9.12.4  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.330; unit 3583 -->

9.12.4.1  rk_aiq_user_api2_accm_v2_SetAttrib

<!-- Source EN PDF p.330; unit 3584 -->

【Beschreibung】 CCM-Eigenschaften einstellen.

<!-- Source EN PDF p.330; unit 3585 -->

【Syntax】

<!-- Source EN PDF p.330; unit 3586 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t attr);
```

<!-- Source EN PDF p.330; unit 3587 -->

【Parameter】

<!-- Source EN PDF p.330; unit 3588 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaftsparameter von CCM | Eingabe |

<!-- Source EN PDF p.330; unit 3589 -->

【Rückgabewert】

<!-- Source EN PDF p.330; unit 3590 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.331; unit 3591 -->

【Voraussetzungen】

<!-- Source EN PDF p.331; unit 3592 -->

Headerdateien: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.331; unit 3593 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.331; unit 3594 -->

【Beispiel】

<!-- Source EN PDF p.331; unit 3595 -->

Zum Einstellen der CCM-Eigenschaften siehe "sample_ccm_setCcmAttr" in sample_accm_module.cpp.

<!-- Source EN PDF p.331; unit 3596 -->

9.12.4.2  rk_aiq_user_api2_accm_GetAttrib

<!-- Source EN PDF p.331; unit 3597 -->

【Beschreibung】 CCM-Eigenschaften abrufen.

<!-- Source EN PDF p.331; unit 3598 -->

【Syntax】

<!-- Source EN PDF p.331; unit 3599 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t *attr);
```

<!-- Source EN PDF p.331; unit 3600 -->

【Parameter】

<!-- Source EN PDF p.331; unit 3601 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Parametereigenschaften von CCM | Ausgabe |

<!-- Source EN PDF p.331; unit 3602 -->

【Rückgabewert】

<!-- Source EN PDF p.331; unit 3603 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.331; unit 3604 -->

【Voraussetzungen】

<!-- Source EN PDF p.331; unit 3605 -->

Headerdateien: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.331; unit 3606 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.331; unit 3607 -->

【Beispiel】

<!-- Source EN PDF p.331; unit 3608 -->

Zum Abrufen der CCM-Eigenschaften siehe "sample_ccm_getCcmAttr" in sample_accm_module.cpp.

<!-- Source EN PDF p.331; unit 3609 -->

9.12.4.3  rk_aiq_user_api2_accm_QueryCcmInfo

<!-- Source EN PDF p.331; unit 3610 -->

【Beschreibung】 CCM-Informationen abfragen.

<!-- Source EN PDF p.331; unit 3611 -->

【Syntax】

<!-- Source EN PDF p.332; unit 3612 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_QueryCcmInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_querry_info_t *ccm_querry_info);
```

<!-- Source EN PDF p.332; unit 3613 -->

【Parameter】

<!-- Source EN PDF p.332; unit 3614 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| ccm_querry_info | CCM-Abfrageinhalt | Ausgabe |

<!-- Source EN PDF p.332; unit 3615 -->

【Rückgabewert】

<!-- Source EN PDF p.332; unit 3616 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.332; unit 3617 -->

【Voraussetzungen】

<!-- Source EN PDF p.332; unit 3618 -->

Headerdateien: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.332; unit 3619 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.332; unit 3620 -->

【Beispiel】

<!-- Source EN PDF p.332; unit 3621 -->

Zum Abfragen von CCM-Informationen siehe "sample_query_ccm_info" in sample_accm_module.cpp.

<!-- Source EN PDF p.332; unit 3622 -->

#### 9.12.5  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.332; unit 3623 -->

9.12.5.1  rk_aiq_ccm_op_mode_t

<!-- Source EN PDF p.332; unit 3624 -->

【Beschreibung】 CCM-Betriebsart definieren.

<!-- Source EN PDF p.332; unit 3625 -->

【Definition】

<!-- Source EN PDF p.332; unit 3626 -->

```text
 typedef enum rk_aiq_ccm_op_mode_s {
     RK_AIQ_CCM_MODE_INVALID                     = 0,
     RK_AIQ_CCM_MODE_MANUAL                      = 1,
     RK_AIQ_CCM_MODE_AUTO                        = 2,
     RK_AIQ_CCM_MODE_MAX
 } rk_aiq_ccm_op_mode_t;
```

<!-- Source EN PDF p.332; unit 3627 -->

【Felder】

<!-- Source EN PDF p.333; unit 3628 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_CCM_MODE_INVALID | Ungültiger CCM-Modus |
| RK_AIQ_CCM_MODE_MANUAL | Manueller CCM-Modus |
| RK_AIQ_CCM_MODE_AUTO | Automatischer CCM-Modus |

<!-- Source EN PDF p.333; unit 3629 -->

9.12.5.2  rk_aiq_ccm_mccm_attrib_t

<!-- Source EN PDF p.333; unit 3630 -->

【Beschreibung】 Manuelle CCM-Eigenschaften definieren.

<!-- Source EN PDF p.333; unit 3631 -->

【Definition】

<!-- Source EN PDF p.333; unit 3632 -->

```text
 typedef struct rk_aiq_ccm_mccm_attrib_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[17];
     float low_bound_pos_bit;
 } rk_aiq_ccm_mccm_attrib_t;
```

<!-- Source EN PDF p.333; unit 3633 -->

【Felder】

<!-- Source EN PDF p.333; unit 3634 -->

| Feldname | Beschreibung |
|---|---|
| ccMatrix | Farbkorrekturmatrix;<br>Wertebereich [-8, 7.992] |
| ccOffsets | RGB-Komponentenoffset;<br>Wertebereich [-4096, 4095] |
| y_alpha_curve | Intensitätskonfiguration der Farbkorrekturstärke-Anpassungskurve in Abhängigkeit<br>von der Pixelhelligkeit (12bit).<br>Gültige Werte [0x0, 0x400]; 0x400 bedeutet einfache Intensität, 0x0 bedeutet<br>keine Korrektur. |
| low_bound_pos_bit | Helligkeitsbereich des Knickpunkts der Pixelhelligkeits-Anpassungskurve (12bit):<br>[0, 2^low_bound_pos_bit] und [4095-2^low_bound_pos_bit,<br>4095].<br>Gültige Werte [0,10]. |

<!-- Source EN PDF p.333; unit 3635 -->

9.12.5.3  rk_aiq_ccm_color_inhibition_t

<!-- Source EN PDF p.333; unit 3636 -->

【Beschreibung】 CCM-Farbunterdrückungsstufe definieren.

<!-- Source EN PDF p.333; unit 3637 -->

【Definition】

<!-- Source EN PDF p.334; unit 3638 -->

```text
 typedef struct rk_aiq_ccm_color_inhibition_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_inhibition_t;
```

<!-- Source EN PDF p.334; unit 3639 -->

【Felder】

<!-- Source EN PDF p.334; unit 3640 -->

| Feldname | Beschreibung |
|---|---|
| sensorGain | Belichtungsverstärkungskomponente |
| level | Farbunterdrückungsstufe;<br>Wertebereich [0,100];<br>Standardwert 0 |

<!-- Source EN PDF p.334; unit 3641 -->

9.12.5.4  rk_aiq_ccm_color_saturation_t

<!-- Source EN PDF p.334; unit 3642 -->

【Beschreibung】 Farbsättigungsstufe des automatischen CCM definieren.

<!-- Source EN PDF p.334; unit 3643 -->

【Definition】

<!-- Source EN PDF p.334; unit 3644 -->

```text
 typedef struct rk_aiq_ccm_color_saturation_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_saturation_t;
```

<!-- Source EN PDF p.334; unit 3645 -->

【Felder】

<!-- Source EN PDF p.334; unit 3646 -->

| Feldname | Beschreibung |
|---|---|
| sensorGain | Belichtungsverstärkungskomponente |
| level | Farbsättigungsstufe;<br>Wertebereich [0,100];<br>Standardwert 100 |

<!-- Source EN PDF p.334; unit 3647 -->

9.12.5.5  rk_aiq_ccm_accm_attrib_t

<!-- Source EN PDF p.334; unit 3648 -->

【Beschreibung】 Automatische CCM-Eigenschaften definieren.

<!-- Source EN PDF p.334; unit 3649 -->

【Definition】

<!-- Source EN PDF p.334; unit 3650 -->

```text
 typedef struct rk_aiq_ccm_accm_attrib_s {
     rk_aiq_ccm_color_inhibition_t color_inhibition;
     rk_aiq_ccm_color_saturation_t color_saturation;
 } rk_aiq_ccm_accm_attrib_t;
```

<!-- Source EN PDF p.334; unit 3651 -->

【Felder】

<!-- Source EN PDF p.335; unit 3652 -->

| Feldname | Beschreibung |
|---|---|
| color_inhibition | CCM-Farbunterdrückungsstufe |
| color_saturation | CCM-Farbsättigungsstufe |

<!-- Source EN PDF p.335; unit 3653 -->

9.12.5.6  rk_aiq_ccm_attrib_t

<!-- Source EN PDF p.335; unit 3654 -->

【Beschreibung】 CCM-Eigenschaften definieren.

<!-- Source EN PDF p.335; unit 3655 -->

【Definition】

<!-- Source EN PDF p.335; unit 3656 -->

```text
 typedef struct rk_aiq_ccm_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_ccm_op_mode_t mode;
     rk_aiq_ccm_mccm_attrib_t stManual;
     rk_aiq_ccm_accm_attrib_t stAuto;
     CalibDbV2_Ccm_Para_V2_t stTool;
 } rk_aiq_ccm_attrib_t;
```

<!-- Source EN PDF p.335; unit 3657 -->

【Felder】

<!-- Source EN PDF p.335; unit 3658 -->

| Feldname | Beschreibung |
|---|---|
| sync | Synchrone/asynchrone Signale; Definition von rk_aiq_uapi_sync_t siehe<br>Abschnitt Überblick/API-Beschreibung |
| byPass | Modulverarbeitung überspringen;<br>true: CCM überspringen, false: CCM aktivieren |
| mode | Auswahl der Betriebsart;<br>Wertebereich {RK_AIQ_CCM_MODE_MANUAL, RK_AIQ_CCM_MODE_AUTO}<br>für manuellen bzw. automatischen Modus |
| stManual | Konfiguration der Eigenschaftsparameter im manuellen Modus |
| stAuto | Konfiguration der Eigenschaftsparameter im automatischen Modus |
| stTool | Parameterkonfiguration im Werkzeugmodus; keine Konfiguration erforderlich |

<!-- Source EN PDF p.335; unit 3659 -->

9.12.5.7  rk_aiq_ccm_querry_info_t

<!-- Source EN PDF p.335; unit 3660 -->

【Beschreibung】 CCM-Abfrageinformationen definieren.

<!-- Source EN PDF p.335; unit 3661 -->

【Definition】

<!-- Source EN PDF p.336; unit 3662 -->

```text
 typedef struct rk_aiq_ccm_querry_info_s {
     bool ccm_en;
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[CCM_CURVE_DOT_NUM];
     float low_bound_pos_bit;
     float color_inhibition_level;
     float color_saturation_level;
     float finalSat;
     char  ccmname1[25];
     char  ccmname2[25];
 } rk_aiq_ccm_querry_info_t;
```

<!-- Source EN PDF p.336; unit 3663 -->

【Felder】

<!-- Source EN PDF p.336; unit 3664 -->

| Feldname | Beschreibung |
|---|---|
| ccm_en | CCM aktiviert;<br>true aktiviert, false deaktiviert |
| ccMatrix | Wirksame CCM-Korrekturmatrix;<br>Wertebereich [-8,7.992] |
| ccOffsets | Wirksamer RGB-Komponentenoffset;<br>Wertebereich [-4096,4095] |
| y_alpha_curve | Intensitätskonfiguration der Farbkorrekturstärke-Anpassungskurve in Abhängigkeit<br>von der Pixelhelligkeit (12bit).<br>Wertebereich [0x0, 0x400].<br>0x400 bedeutet einfache Intensität, 0x0 bedeutet keine Korrektur. |
| low_bound_pos_bit | Helligkeitsbereich des Knickpunkts der Pixelhelligkeits-Anpassungskurve (12bit):<br>[0, 2^low_bound_pos_bit] und [4095-2^low_bound_pos_bit,<br>4095].<br>Gültige Werte [0,10]. |
| color_inhibition_level | CCM-Farbunterdrückungsstufe (nur automatischer Modus) |
| color_saturation_level | CCM-Farbsättigungsstufe (nur automatischer Modus) |
| finalSat | Zur aktuellen Matrix gehörender Sättigungswert (nur automatischer Modus<br>unterstützt) |
| ccmname1 | Name der Kalibriermatrix, die zur interpolierten Berechnung der aktuellen<br>Matrix verwendet wird (nur automatischer Modus) |
| ccmname2 | Name der Kalibriermatrix, die zur interpolierten Berechnung der aktuellen<br>Matrix verwendet wird (nur automatischer Modus) |

<!-- Source EN PDF p.337; unit 3665 -->

### 9.13   3DLUT

<!-- Source EN PDF p.337; unit 3666 -->

#### 9.13.1  Funktionsbeschreibung

<!-- Source EN PDF p.337; unit 3667 -->

Das 3DLUT-Modul (3D-Lookup-Tabelle) führt eine Farbabbildung von Bildern im RGB-Raum durch.

<!-- Source EN PDF p.337; unit 3668 -->

#### 9.13.2  Referenz der funktionsbezogenen APIs

<!-- Source EN PDF p.337; unit 3669 -->

9.13.2.1  rk_aiq_uapi2_setLut3dMode

<!-- Source EN PDF p.337; unit 3670 -->

【Beschreibung】 3DLUT-Betriebsart einstellen.

<!-- Source EN PDF p.337; unit 3671 -->

【Syntax】

<!-- Source EN PDF p.337; unit 3672 -->

```text
 XCamReturn rk_aiq_uapi2_setLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.337; unit 3673 -->

【Parameter】

<!-- Source EN PDF p.337; unit 3674 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsart;<br>Wertebereich: {OP_AUTO, OP_MANUAL} | Eingabe |

<!-- Source EN PDF p.337; unit 3675 -->

【Rückgabewert】

<!-- Source EN PDF p.337; unit 3676 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.337; unit 3677 -->

【Voraussetzungen】

<!-- Source EN PDF p.337; unit 3678 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.337; unit 3679 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.337; unit 3680 -->

【Beispiel】

<!-- Source EN PDF p.337; unit 3681 -->

Zum Einstellen des manuellen/automatischen Modus siehe "sample_set_a3dlut_manual" / "sample_set_a3dlut_auto" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.337; unit 3682 -->

9.13.2.2  rk_aiq_uapi2_getLut3dMode

<!-- Source EN PDF p.337; unit 3683 -->

【Beschreibung】 3DLUT-Betriebsart abrufen.

<!-- Source EN PDF p.337; unit 3684 -->

【Syntax】

<!-- Source EN PDF p.338; unit 3685 -->

```text
 XCamReturn rk_aiq_uapi2_getLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.338; unit 3686 -->

【Parameter】

<!-- Source EN PDF p.338; unit 3687 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mode | Betriebsart | Ausgabe |

<!-- Source EN PDF p.338; unit 3688 -->

【Rückgabewert】

<!-- Source EN PDF p.338; unit 3689 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.338; unit 3690 -->

【Voraussetzungen】

<!-- Source EN PDF p.338; unit 3691 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.338; unit 3692 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.338; unit 3693 -->

【Beispiel】

<!-- Source EN PDF p.338; unit 3694 -->

Zum Einstellen des manuellen/automatischen Modus siehe "sample_get_a3dlut_mode" in sample_a3dlut_module.cpp (die Quelle schreibt hier Einstellen).

<!-- Source EN PDF p.338; unit 3695 -->

9.13.2.3  rk_aiq_uapi2_setM3dLut

<!-- Source EN PDF p.338; unit 3696 -->

【Beschreibung】 Manuelle 3D-Lookup-Tabelle von 3DLUT einstellen.

<!-- Source EN PDF p.338; unit 3697 -->

【Syntax】

<!-- Source EN PDF p.338; unit 3698 -->

```text
 XCamReturn rk_aiq_uapi2_setM3dLut(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.338; unit 3699 -->

【Parameter】

<!-- Source EN PDF p.338; unit 3700 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mlut | 3D-Lookup-Tabelle | Eingabe |

<!-- Source EN PDF p.338; unit 3701 -->

【Rückgabewert】

<!-- Source EN PDF p.338; unit 3702 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.339; unit 3703 -->

【Voraussetzungen】

<!-- Source EN PDF p.339; unit 3704 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3705 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.339; unit 3706 -->

【Beispiel】

<!-- Source EN PDF p.339; unit 3707 -->

Zum Einstellen der manuellen 3D-Lookup-Tabelle von 3DLUT siehe "sample_set_a3dlut_manual_lut" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.339; unit 3708 -->

9.13.2.4  rk_aiq_uapi2_getM3dLut

<!-- Source EN PDF p.339; unit 3709 -->

【Beschreibung】 3D-Lookup-Tabelle von 3DLUT abrufen.

<!-- Source EN PDF p.339; unit 3710 -->

【Syntax】

<!-- Source EN PDF p.339; unit 3711 -->

```text
 XCamReturn rk_aiq_uapi2_getM3dLut(const rk_aiq_sys_ctx_t* ctx,
  rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.339; unit 3712 -->

【Parameter】

<!-- Source EN PDF p.339; unit 3713 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| mlut | 3D-Lookup-Tabelle | Ausgabe |

<!-- Source EN PDF p.339; unit 3714 -->

【Rückgabewert】

<!-- Source EN PDF p.339; unit 3715 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.339; unit 3716 -->

【Voraussetzungen】

<!-- Source EN PDF p.339; unit 3717 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3718 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.339; unit 3719 -->

【Beispiel】

<!-- Source EN PDF p.339; unit 3720 -->

Zu 3DLUT-3D-Lookup-Tabellen siehe "sample_get_a3dlut_lut" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.339; unit 3721 -->

9.13.2.5  rk_aiq_uapi2_getA3dLutStrth

<!-- Source EN PDF p.339; unit 3722 -->

【Beschreibung】 3DLUT-Anpassungsstärke abrufen.

<!-- Source EN PDF p.339; unit 3723 -->

【Syntax】

<!-- Source EN PDF p.339; unit 3724 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutStrth(const rk_aiq_sys_ctx_t* ctx, float alpha);
```

<!-- Source EN PDF p.340; unit 3725 -->

【Parameter】

<!-- Source EN PDF p.340; unit 3726 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| alpha | 3DLUT-Modulationsstärke | Ausgabe |

<!-- Source EN PDF p.340; unit 3727 -->

【Rückgabewert】

<!-- Source EN PDF p.340; unit 3728 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.340; unit 3729 -->

【Voraussetzungen】

<!-- Source EN PDF p.340; unit 3730 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.340; unit 3731 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.340; unit 3732 -->

【Beispiel】

<!-- Source EN PDF p.340; unit 3733 -->

Zur 3DLUT-Anpassungsstärke siehe "sample_get_a3dlut_strength" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.340; unit 3734 -->

9.13.2.6  rk_aiq_uapi2_getA3dLutName

<!-- Source EN PDF p.340; unit 3735 -->

【Beschreibung】 3DLUT-Tabellennamen im automatischen Modus abrufen.

<!-- Source EN PDF p.340; unit 3736 -->

【Syntax】

<!-- Source EN PDF p.340; unit 3737 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutName(const rk_aiq_sys_ctx_t* ctx, char *name);
```

<!-- Source EN PDF p.340; unit 3738 -->

【Parameter】

<!-- Source EN PDF p.340; unit 3739 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| name | 3DLUT-Tabellenname | Ausgabe |

<!-- Source EN PDF p.340; unit 3740 -->

【Rückgabewert】

<!-- Source EN PDF p.340; unit 3741 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.340; unit 3742 -->

【Voraussetzungen】

<!-- Source EN PDF p.340; unit 3743 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.341; unit 3744 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.341; unit 3745 -->

【Beispiel】

<!-- Source EN PDF p.341; unit 3746 -->

Zum Abrufen des 3DLUT-Tabellennamens im automatischen Modus siehe "sample_get_a3dlut_lutname" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.341; unit 3747 -->

#### 9.13.3  Datentypen der funktionsbezogenen APIs

<!-- Source EN PDF p.341; unit 3748 -->

9.13.3.1  opMode_t

<!-- Source EN PDF p.341; unit 3749 -->

【Beschreibung】 3DLUT-Betriebsart definieren.

<!-- Source EN PDF p.341; unit 3750 -->

【Definition】

<!-- Source EN PDF p.341; unit 3751 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.341; unit 3752 -->

【Felder】

<!-- Source EN PDF p.341; unit 3753 -->

| Feldname | Beschreibung |
|---|---|
| OP_AUTO | Automatikmodus |
| OP_MANUALl | Manueller Modus |
| OP_INVAL | Ungültiger Wert |

<!-- Source EN PDF p.341; unit 3754 -->

9.13.3.2  rk_aiq_lut3d_table_t

<!-- Source EN PDF p.341; unit 3755 -->

【Beschreibung】 3D-Lookup-Tabelle von 3DLUT definieren.

<!-- Source EN PDF p.341; unit 3756 -->

【Definition】

<!-- Source EN PDF p.341; unit 3757 -->

```text
 typedef struct rk_aiq_lut3d_table_s{
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_table_t;
```

<!-- Source EN PDF p.341; unit 3758 -->

【Felder】

<!-- Source EN PDF p.342; unit 3759 -->

| Feldname | Beschreibung |
|---|---|
| look_up_table_r | R-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0x3ff] |
| look_up_table_g | G-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0xfff] |
| look_up_table_b | B-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0x3ff] |

<!-- Source EN PDF p.342; unit 3760 -->

#### 9.13.4  Referenz der modulbezogenen APIs

<!-- Source EN PDF p.342; unit 3761 -->

9.13.4.1  rk_aiq_user_api2_a3dlut_SetAttrib

<!-- Source EN PDF p.342; unit 3762 -->

【Beschreibung】 3DLUT-Eigenschaft einstellen.

<!-- Source EN PDF p.342; unit 3763 -->

【Syntax】

<!-- Source EN PDF p.342; unit 3764 -->

```text
 XCamReturn rk_aiq_user_api2_a3dlut_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t attr);
```

<!-- Source EN PDF p.342; unit 3765 -->

【Parameter】

<!-- Source EN PDF p.342; unit 3766 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | 3DLUT-Parametereigenschaften | Eingabe |

<!-- Source EN PDF p.342; unit 3767 -->

【Rückgabewert】

<!-- Source EN PDF p.342; unit 3768 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.342; unit 3769 -->

【Voraussetzungen】

<!-- Source EN PDF p.342; unit 3770 -->

Headerdateien: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.342; unit 3771 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.342; unit 3772 -->

【Beispiel】

<!-- Source EN PDF p.342; unit 3773 -->

Zum Einstellen der 3DLUT-Eigenschaft siehe "sample_3dlut_set3dlutAttr" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.343; unit 3774 -->

9.13.4.2  rk_aiq_user_api2_a3dlut_GetAttrib

<!-- Source EN PDF p.343; unit 3775 -->

【Beschreibung】 3DLUT-Eigenschaft abrufen.

<!-- Source EN PDF p.343; unit 3776 -->

【Syntax】

<!-- Source EN PDF p.343; unit 3777 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t *attr);
```

<!-- Source EN PDF p.343; unit 3778 -->

【Parameter】

<!-- Source EN PDF p.343; unit 3779 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | 3DLUT-Parametereigenschaften | Ausgabe |

<!-- Source EN PDF p.343; unit 3780 -->

【Rückgabewert】

<!-- Source EN PDF p.343; unit 3781 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.343; unit 3782 -->

【Voraussetzungen】

<!-- Source EN PDF p.343; unit 3783 -->

Headerdateien: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.343; unit 3784 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.343; unit 3785 -->

【Beispiel】

<!-- Source EN PDF p.343; unit 3786 -->

Zum Abrufen von 3DLUT-Eigenschaften siehe "sample_3dlut_get3dlutAttr" und weitere Beispiele in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.343; unit 3787 -->

9.13.4.3  rk_aiq_user_api2_a3dlut_Query3dlutInfo

<!-- Source EN PDF p.343; unit 3788 -->

【Beschreibung】 3DLUT-Informationen abfragen.

<!-- Source EN PDF p.343; unit 3789 -->

【Syntax】

<!-- Source EN PDF p.343; unit 3790 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_Query3dlutInfo(const RkAiqAlgoContext *ctx,
 rk_aiq_lut3d_querry_info_t *lut3d_querry_info );
```

<!-- Source EN PDF p.343; unit 3791 -->

【Parameter】

<!-- Source EN PDF p.344; unit 3792 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| lut3d_querry_info | 3DLUT-Abfrageinhalt | Ausgabe |

<!-- Source EN PDF p.344; unit 3793 -->

【Rückgabewert】

<!-- Source EN PDF p.344; unit 3794 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.344; unit 3795 -->

【Voraussetzungen】

<!-- Source EN PDF p.344; unit 3796 -->

Headerdateien: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.344; unit 3797 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.344; unit 3798 -->

【Beispiel】

<!-- Source EN PDF p.344; unit 3799 -->

Zu 3DLUT-Informationen siehe "sample_query_a3dlut_info" in sample_a3dlut_module.cpp.

<!-- Source EN PDF p.344; unit 3800 -->

#### 9.13.5  Datentypen der modulbezogenen APIs

<!-- Source EN PDF p.344; unit 3801 -->

9.13.5.1  rk_aiq_lut3d_op_mode_t

<!-- Source EN PDF p.344; unit 3802 -->

【Beschreibung】 3DLUT-Betriebsart definieren.

<!-- Source EN PDF p.344; unit 3803 -->

【Definition】

<!-- Source EN PDF p.344; unit 3804 -->

```text
 typedef enum rk_aiq_lut3d_op_mode_s {
     RK_AIQ_LUT3D_MODE_INVALID                     = 0,
     RK_AIQ_LUT3D_MODE_MANUAL                      = 1,
     RK_AIQ_LUT3D_MODE_AUTO                        = 2,
     RK_AIQ_LUT3D_MODE_MAX
 } rk_aiq_lut3d_op_mode_t;
```

<!-- Source EN PDF p.344; unit 3805 -->

【Felder】

<!-- Source EN PDF p.344; unit 3806 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_LUT3D_MODE_INVALID | Ungültiger 3DLUT-Modus |
| RK_AIQ_LUT3D_MODE_MANUAL | Manueller 3DLUT-Modus |
| RK_AIQ_LUT3D_MODE_AUTO | Automatischer 3DLUT-Modus |

<!-- Source EN PDF p.345; unit 3807 -->

9.13.5.2  rk_aiq_lut3d_mlut3d_attrib_t

<!-- Source EN PDF p.345; unit 3808 -->

【Beschreibung】 Manuelle 3DLUT-Eigenschaften definieren.

<!-- Source EN PDF p.345; unit 3809 -->

【Definition】

<!-- Source EN PDF p.345; unit 3810 -->

```text
 typedef struct rk_aiq_lut3d_mlut3d_attrib_s {
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_mlut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3811 -->

【Felder】

<!-- Source EN PDF p.345; unit 3812 -->

| Feldname | Beschreibung |
|---|---|
| look_up_table_r | R-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0x3ff] |
| look_up_table_g | G-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0xfff] |
| look_up_table_b | B-Kanal-Lookup-Tabelle im manuellen Modus;<br>Wertebereich [0x0, 0x3ff] |

<!-- Source EN PDF p.345; unit 3813 -->

9.13.5.3  rk_aiq_lut3d_attrib_t

<!-- Source EN PDF p.345; unit 3814 -->

【Beschreibung】 3DLUT-Eigenschaften definieren.

<!-- Source EN PDF p.345; unit 3815 -->

【Definition】

<!-- Source EN PDF p.345; unit 3816 -->

```text
 typedef struct rk_aiq_lut3d_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_lut3d_op_mode_t mode;
     rk_aiq_lut3d_mlut3d_attrib_t stManual;
 } rk_aiq_lut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3817 -->

【Felder】

<!-- Source EN PDF p.346; unit 3818 -->

| Feldname | Beschreibung |
|---|---|
| sync | Synchrone/asynchrone Signale; Definition von rk_aiq_uapi_sync_t siehe<br>Abschnitt Überblick/API-Beschreibung |
| byPass | Modulverarbeitung überspringen;<br>true: 3DLUT überspringen, false: 3DLUT aktivieren |
| mode | Auswahl der Betriebsart;<br>Wertebereich {RK_AIQ_LUT3D_MODE_MANUAL,<br>RK_AIQ_LUT3D_MODE_AUTO} für manuellen bzw. automatischen Modus |
| stManual | Konfiguration der Eigenschaftsparameter im manuellen Modus |

<!-- Source EN PDF p.346; unit 3819 -->

9.13.5.4  rk_aiq_lut3d_querry_info_t

<!-- Source EN PDF p.346; unit 3820 -->

【Beschreibung】 3DLUT-Abfrageinformationen definieren.

<!-- Source EN PDF p.346; unit 3821 -->

【Definition】

<!-- Source EN PDF p.346; unit 3822 -->

```text
 typedef struct rk_aiq_lut3d_querry_info_s {
     bool lut3d_en;
     float alpha;
     char name[25];
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_querry_info_t;
```

<!-- Source EN PDF p.346; unit 3823 -->

【Felder】

<!-- Source EN PDF p.346; unit 3824 -->

| Feldname | Beschreibung |
|---|---|
| lut3d_en | 3DLUT aktiviert;<br>true aktiviert, false deaktiviert |
| alpha | 3DLUT-Regelstärke;<br>Wertebereich [0, 1.0], größere Werte bedeuten höhere Stärke; 1.0 |
| name | 3DLUT-Tabellenname; nur automatischer Modus unterstützt |
| look_up_table_r | R-Kanal-Lookup-Tabelle;<br>Wertebereich [0x0, 0x3ff] |
| look_up_table_g | G-Kanal-Lookup-Tabelle;<br>Wertebereich [0x0, 0xfff] |
| look_up_table_b | B-Kanal-Lookup-Tabelle;<br>Wertebereich [0x0, 0x3ff] |

<!-- Source EN PDF p.347; unit 3825 -->

### 9.14 LDCH

<!-- Source EN PDF p.347; unit 3826 -->

#### 9.14.1 Funktionsbeschreibung

<!-- Source EN PDF p.347; unit 3827 -->

LDCH korrigiert verzerrte Bilder. Unterstützt wird ausschließlich die Korrektur in horizontaler Richtung.

<!-- Source EN PDF p.347; unit 3828 -->

#### 9.14.2 Referenz der Funktions-APIs

<!-- Source EN PDF p.347; unit 3829 -->

9.14.2.1 rk_aiq_uapi_setLdchEn

<!-- Source EN PDF p.347; unit 3830 -->

【Beschreibung】 Horizontale Verzeichnungskorrektur ein- oder ausschalten.

<!-- Source EN PDF p.347; unit 3831 -->

【Syntax】

<!-- Source EN PDF p.347; unit 3832 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchEn(const rk_aiq_sys_ctx_t* ctx, bool en);
```

<!-- Source EN PDF p.347; unit 3833 -->

【Parameter】

<!-- Source EN PDF p.347; unit 3834 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| en | Korrektur ein/aus | Eingabe |

<!-- Source EN PDF p.347; unit 3835 -->

【Rückgabewert】

<!-- Source EN PDF p.347; unit 3836 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.347; unit 3837 -->

【Voraussetzungen】

<!-- Source EN PDF p.347; unit 3838 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.347; unit 3839 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.347; unit 3840 -->

9.14.2.2 rk_aiq_uapi2_setLdchCorrectLevel

<!-- Source EN PDF p.347; unit 3841 -->

【Beschreibung】 Stärke der horizontalen Verzeichnungskorrektur einstellen.

<!-- Source EN PDF p.347; unit 3842 -->

【Syntax】

<!-- Source EN PDF p.347; unit 3843 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchCorrectLevel(const rk_aiq_sys_ctx_t* ctx, int
 correctLevel);
```

<!-- Source EN PDF p.347; unit 3844 -->

【Parameter】

<!-- Source EN PDF p.348; unit 3845 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| correctLevel | Korrekturstärke, Wertebereich [0~255] | Eingabe |

<!-- Source EN PDF p.348; unit 3846 -->

【Rückgabewert】

<!-- Source EN PDF p.348; unit 3847 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.348; unit 3848 -->

【Voraussetzungen】

<!-- Source EN PDF p.348; unit 3849 -->

Headerdatei: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.348; unit 3850 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.348; unit 3851 -->

#### 9.14.3 Referenz der Modul-APIs

<!-- Source EN PDF p.348; unit 3852 -->

9.14.3.1 rk_aiq_user_api2_aldch_SetAttrib

<!-- Source EN PDF p.348; unit 3853 -->

【Beschreibung】 FEC-Eigenschaft einstellen. (Die Vorlage bezeichnet die LDCH-Eigenschaft hier als FEC.)

<!-- Source EN PDF p.348; unit 3854 -->

【Syntax】

<!-- Source EN PDF p.348; unit 3855 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.348; unit 3856 -->

【Parameter】

<!-- Source EN PDF p.348; unit 3857 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | LDCH-Parameterattribute | Eingabe |

<!-- Source EN PDF p.348; unit 3858 -->

【Rückgabewert】

<!-- Source EN PDF p.348; unit 3859 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.348; unit 3860 -->

【Voraussetzungen】

<!-- Source EN PDF p.348; unit 3861 -->

Headerdatei: rk_aiq_user_api2_aldch.h

<!-- Source EN PDF p.348; unit 3862 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.349; unit 3863 -->

9.14.3.2 rk_aiq_user_api2_aldch_GetAttrib

<!-- Source EN PDF p.349; unit 3864 -->

【Beschreibung】 FEC-Eigenschaft abfragen. (Bezeichnung FEC aus der Vorlage beibehalten.)

<!-- Source EN PDF p.349; unit 3865 -->

【Syntax】

<!-- Source EN PDF p.349; unit 3866 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.349; unit 3867 -->

【Parameter】

<!-- Source EN PDF p.349; unit 3868 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | LDCH-Parameterattribute | Eingabe |

<!-- Source EN PDF p.349; unit 3869 -->

【Rückgabewert】

<!-- Source EN PDF p.349; unit 3870 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.349; unit 3871 -->

【Voraussetzungen】

<!-- Source EN PDF p.349; unit 3872 -->

Headerdatei: rk_aiq_user_api2_aldch.h

<!-- Source EN PDF p.349; unit 3873 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.349; unit 3874 -->

#### 9.14.4 Datentypen der Modul-API

<!-- Source EN PDF p.349; unit 3875 -->

9.14.4.1 rk_aiq_ldch_attrib_t

<!-- Source EN PDF p.349; unit 3876 -->

【Beschreibung】 LDCH-Attributkonfiguration.

<!-- Source EN PDF p.349; unit 3877 -->

【Definition】

<!-- Source EN PDF p.349; unit 3878 -->

```text
 typedef struct rk_aiq_ldch_cfg_s {
     rk_aiq_uapi_sync_t sync;
     unsigned int en;
     int correct_level;
 } rk_aiq_ldch_cfg_t;
```

<!-- Source EN PDF p.349; unit 3879 -->

【Felder】

<!-- Source EN PDF p.350; unit 3880 -->

| Feldname | Beschreibung |
|---|---|
| sync | Synchrone/asynchrone Schnittstellenfunktion; zu rk_aiq_uapi_sync_t siehe die Übersicht |
| en | LDCH aktivieren/deaktivieren |
| correct_level | LDCH-Korrekturstärke einstellen, Wertebereich [0~255] |

<!-- Source EN PDF p.350; unit 3881 -->

### 9.15 DeBayer

<!-- Source EN PDF p.350; unit 3882 -->

#### 9.15.1 Funktionsbeschreibung

<!-- Source EN PDF p.350; unit 3883 -->

DeBayer interpoliert ein CFA-Bild zu einem RGB-Bild mit vollständigen Farbwerten für jedes Pixel.

<!-- Source EN PDF p.350; unit 3884 -->

Unterstützte Bayer-Rohdatenformate sind RGGB/BGGR/GRBG/gbrg. Andere Formate wie CCCB und RGB-IR werden derzeit nicht unterstützt.

<!-- Source EN PDF p.350; unit 3885 -->

#### 9.15.2 Referenz der Modul-APIs

<!-- Source EN PDF p.350; unit 3886 -->

9.15.2.1 rk_aiq_user_api_adebayer_SetAttrib

<!-- Source EN PDF p.350; unit 3887 -->

【Beschreibung】 Demosaik-Eigenschaften einstellen.

<!-- Source EN PDF p.350; unit 3888 -->

【Syntax】

<!-- Source EN PDF p.350; unit 3889 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t attr);
```

<!-- Source EN PDF p.350; unit 3890 -->

【Parameter】

<!-- Source EN PDF p.350; unit 3891 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Demosaik-Eigenschaften | Eingabe |

<!-- Source EN PDF p.350; unit 3892 -->

【Rückgabewert】

<!-- Source EN PDF p.350; unit 3893 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.350; unit 3894 -->

【Voraussetzungen】

<!-- Source EN PDF p.351; unit 3895 -->

Headerdatei: rk_aiq_user_api2_adebayer.h

<!-- Source EN PDF p.351; unit 3896 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.351; unit 3897 -->

9.15.2.2 rk_aiq_user_api_adebayer_GetAttrib

<!-- Source EN PDF p.351; unit 3898 -->

【Beschreibung】 Demosaik-Eigenschaften abfragen.

<!-- Source EN PDF p.351; unit 3899 -->

【Syntax】

<!-- Source EN PDF p.351; unit 3900 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t *attr);
```

<!-- Source EN PDF p.351; unit 3901 -->

【Parameter】

<!-- Source EN PDF p.351; unit 3902 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Demosaik-Eigenschaften | Ausgabe |

<!-- Source EN PDF p.351; unit 3903 -->

【Rückgabewert】

<!-- Source EN PDF p.351; unit 3904 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.351; unit 3905 -->

【Voraussetzungen】

<!-- Source EN PDF p.351; unit 3906 -->

Headerdatei: rk_aiq_uapi2_adebayer_int.h

<!-- Source EN PDF p.351; unit 3907 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.351; unit 3908 -->

#### 9.15.3 Datentypen der Modul-API

<!-- Source EN PDF p.351; unit 3909 -->

9.15.3.1 rk_aiq_debayer_op_mode_t

<!-- Source EN PDF p.351; unit 3910 -->

【Beschreibung】 Betriebsmodus definieren.

<!-- Source EN PDF p.351; unit 3911 -->

【Definition】

<!-- Source EN PDF p.352; unit 3912 -->

```text
 typedef enum rk_aiq_debayer_op_mode_s {
     RK_AIQ_DEBAYER_MODE_INVALID                     = 0,        /**<
 initialization value */
     RK_AIQ_DEBAYER_MODE_MANUAL                      = 1,        /**< run manual
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_AUTO                        = 2,        /**< run auto
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_MAX
 } rk_aiq_debayer_op_mode_t;
```

<!-- Source EN PDF p.352; unit 3913 -->

【Felder】

<!-- Source EN PDF p.352; unit 3914 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_DEBAYER_MODE_INVALID | Ungültiger DeBayer-Modus |
| RK_AIQ_DEBAYER_MODE_MANUAL | Manueller DeBayer-Modus |
| RK_AIQ_DEBAYER_MODE_AUTO | Automatischer DeBayer-Modus |

<!-- Source EN PDF p.352; unit 3915 -->

9.15.3.2 adebayer_attrib_manual_t

<!-- Source EN PDF p.352; unit 3916 -->

【Beschreibung】 Konfigurationseigenschaften im manuellen Modus definieren.

<!-- Source EN PDF p.352; unit 3917 -->

【Definition】

<!-- Source EN PDF p.352; unit 3918 -->

```text
 typedef struct adebayer_attrib_manual_s {
     int8_t      filter1[5];
     int8_t      filter2[5];
     uint8_t     gain_offset;
     uint8_t     sharp_strength;
     uint8_t     hf_offset;
     uint8_t     offset;
     uint8_t     clip_en;
     uint8_t     filter_g_en;
     uint8_t     filter_c_en;
     uint8_t     thed0;
     uint8_t     thed1;
     uint8_t     dist_scale;
     uint8_t     cnr_strength;
     uint8_t     shift_num;
 } adebayer_attrib_manual_t;
```

<!-- Source EN PDF p.352; unit 3919 -->

【Felder】

<!-- Source EN PDF p.353; unit 3920 -->

| Feldname | Beschreibung |
|---|---|
| filter1 | Filterkoeffizienten für den niederfrequenten Gradienten, Wertebereich [-8,7] |
| filter2 | Filterkoeffizienten für den hochfrequenten Gradienten, Wertebereich [-8,7] |
| gain_offset | Gradientenoffset bei der Berechnung der Schärfungsgewichtung für die G-Interpolation, Wertebereich [0,15] |
| sharp_strength | Stärke der G-Interpolation; größere Werte verstärken den Effekt, Wertebereich [0,4] |
| hf_offset | Richtungssteuerung: kleinere Werte erzeugen eher Artefakte in gleichmäßigen Bereichen, größere eher Aliasing an Kanten; Wertebereich [0,4095] |
| offset | Begrenzungsbereich der G-Interpolation; größere Werte erweitern den Bereich, Wertebereich [0,65535] |
| clip_en | Begrenzung der G-Interpolation: 0 aus, 1 ein |
| filter_g_en | Entfernung verstreuter G-Pixel: 0 aus, 1 ein |
| filter_c_en | Falschfarbenunterdrückung: 0 aus, 1 ein |
| thed0 | Größere Werte verringern die Wahrscheinlichkeit einer hochfrequenten Gewichtung, Wertebereich [0,16] |
| thed1 | Auswahl zwischen hohen und niedrigen Frequenzen; größere Werte verringern die Wahrscheinlichkeit einer niederfrequenten Auswahl, Wertebereich [0,16] |
| dist_scale | Größere Werte verringern die Wahrscheinlichkeit einer hochfrequenten Auswahl, Wertebereich [0,16] |
| cnr_strength | Stärke der Farbrauschunterdrückung; größere Werte verstärken die Unterdrückung, Wertebereich [0,9] |
| shift_num | Kleinere Werte vergrößern den Chroma-Begrenzungsbereich, Wertebereich [0,4] |

<!-- Source EN PDF p.353; unit 3921 -->

9.15.3.3 adebayer_attrib_auto_t

<!-- Source EN PDF p.353; unit 3922 -->

【Beschreibung】 Konfigurationseigenschaften im automatischen Modus definieren.

<!-- Source EN PDF p.353; unit 3923 -->

【Definition】

<!-- Source EN PDF p.354; unit 3924 -->

```text
 typedef struct adebayer_attrib_auto_s {
     uint8_t     sharp_strength[9];
     uint8_t     low_freq_thresh;
     uint8_t     high_freq_thresh;
 } adebayer_attrib_auto_t;
```

<!-- Source EN PDF p.354; unit 3925 -->

【Felder】

<!-- Source EN PDF p.354; unit 3926 -->

| Feldname | Beschreibung |
|---|---|
| enhance_strength[9] | Detail- und Texturverstärkung nach ISO. Die Indizes 0–8 entsprechen 50,100,200,400,800,1600,3200,6400,12800. Größere Werte erhöhen die Detailschärfe, aber auch Artefakte; Wertebereich [0~7] |
| low_freq_thresh | Größere Werte verringern die Wahrscheinlichkeit einer niederfrequenten Auswahl, Wertebereich [0~15] |
| high_freq_thresh | Größere Werte verringern die Wahrscheinlichkeit einer hochfrequenten Auswahl, Wertebereich [0~15] |

<!-- Source EN PDF p.354; unit 3927 -->

9.15.3.4 adebayer_attrib_t

<!-- Source EN PDF p.354; unit 3928 -->

【Beschreibung】 Konfigurationsattribute definieren.

<!-- Source EN PDF p.354; unit 3929 -->

【Definition】

<!-- Source EN PDF p.354; unit 3930 -->

```text
 typedef struct adebayer_attrib_s {
     rk_aiq_uapi_sync_t          sync;
     uint8_t                     enable;
     rk_aiq_debayer_op_mode_t    mode;
     adebayer_attrib_manual_t    stManual;
     adebayer_attrib_auto_t      stAuto;
 } adebayer_attrib_t;
```

<!-- Source EN PDF p.354; unit 3931 -->

【Felder】

<!-- Source EN PDF p.355; unit 3932 -->

| Feldname | Beschreibung |
|---|---|
| sync | Synchrone/asynchrone Schnittstellenfunktion; zu rk_aiq_uapi_sync_t siehe die Übersicht |
| enable | 0: Bypass; 1: aktivieren |
| mode | DeBayer-Betriebsmodus |
| stManual | Manuelle DeBayer-Konfiguration |
| stAuto | Automatische DeBayer-Konfiguration |

<!-- Source EN PDF p.355; unit 3933 -->

### 9.16 DPCC

<!-- Source EN PDF p.355; unit 3934 -->

#### 9.16.1 Funktionsbeschreibung

<!-- Source EN PDF p.355; unit 3935 -->

Defekte Pixel in Bildern erkennen und entfernen. Einzelheiten enthält die „Funktionsbeschreibung“ in Abschnitt 4.6 „DPCC“ des Dokuments Rockchip_Tuning_Guide_ISP30.

<!-- Source EN PDF p.355; unit 3936 -->

#### 9.16.2 Referenz der Modul-APIs

<!-- Source EN PDF p.355; unit 3937 -->

9.16.2.1 rk_aiq_user_api2_adpcc_SetAttrib

<!-- Source EN PDF p.355; unit 3938 -->

【Beschreibung】 DPCC-Softwareeigenschaften einstellen.

<!-- Source EN PDF p.355; unit 3939 -->

【Syntax】

<!-- Source EN PDF p.355; unit 3940 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.355; unit 3941 -->

【Parameter】

<!-- Source EN PDF p.355; unit 3942 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der DPCC-Softwareeigenschaften | Eingabe |

<!-- Source EN PDF p.355; unit 3943 -->

【Rückgabewert】

<!-- Source EN PDF p.355; unit 3944 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.356; unit 3945 -->

【Voraussetzungen】

<!-- Source EN PDF p.356; unit 3946 -->

Headerdatei: rk_aiq_user_api2_adpcc.h

<!-- Source EN PDF p.356; unit 3947 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.356; unit 3948 -->

【Beschreibung】

<!-- Source EN PDF p.356; unit 3949 -->

9.16.2.2 rk_aiq_user_api2_adpcc_GetAttrib

<!-- Source EN PDF p.356; unit 3950 -->

【Beschreibung】 DPCC-Softwareeigenschaften abfragen.

<!-- Source EN PDF p.356; unit 3951 -->

【Syntax】

<!-- Source EN PDF p.356; unit 3952 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.356; unit 3953 -->

【Parameter】

<!-- Source EN PDF p.356; unit 3954 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der DPCC-Softwareeigenschaften | Ausgabe |

<!-- Source EN PDF p.356; unit 3955 -->

【Rückgabewert】

<!-- Source EN PDF p.356; unit 3956 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.356; unit 3957 -->

【Voraussetzungen】

<!-- Source EN PDF p.356; unit 3958 -->

Headerdatei: rk_aiq_user_api2_adpcc.h

<!-- Source EN PDF p.356; unit 3959 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.356; unit 3960 -->

【Beschreibung】

<!-- Source EN PDF p.356; unit 3961 -->

#### 9.16.3 Datentypen

<!-- Source EN PDF p.356; unit 3962 -->

9.16.3.1 rk_aiq_dpcc_attrib_V20_t

<!-- Source EN PDF p.356; unit 3963 -->

【Beschreibung】 Attribute zur Korrektur defekter Pixel definieren.

<!-- Source EN PDF p.356; unit 3964 -->

【Definition】

<!-- Source EN PDF p.357; unit 3965 -->

```text
 typedef struct rk_aiq_dpcc_attrib_V20_s {
     AdpccOPMode_t eMode;
     Adpcc_Auto_Attr_t stAuto;
     Adpcc_Manual_Attr_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_dpcc_attrib_V20_t;
```

<!-- Source EN PDF p.357; unit 3966 -->

【Felder】

<!-- Source EN PDF p.357; unit 3967 -->

| Feldname | Beschreibung |
|---|---|
| eMode | DPCC-Betriebsmodus definieren; Einzelheiten siehe AdpccOPMode_t |
| stAuto | Parametereinstellung für den automatischen Modus |
| stManual | Parametereinstellung für den manuellen Modus |
| sync | Synchrone/asynchrone Schnittstellenfunktion; zur Definition von rk_aiq_uapi_sync_t siehe Übersicht/API-Beschreibung |

<!-- Source EN PDF p.357; unit 3968 -->

9.16.3.2 AdpccOPMode_t

<!-- Source EN PDF p.357; unit 3969 -->

【Beschreibung】 DPCC-Betriebsmodus definieren.

<!-- Source EN PDF p.357; unit 3970 -->

【Definition】

<!-- Source EN PDF p.357; unit 3971 -->

```text
 typedef enum AdpccOPMode_e {
     ADPCC_OP_MODE_INVALID        = 0,
     ADPCC_OP_MODE_AUTO           = 1,
     ADPCC_OP_MODE_MANUAL         = 2,
     ADPCC_OP_MODE_TOOL           = 3,
     ADPCC_OP_MODE_MAX
 } AdpccOPMode_t;
```

<!-- Source EN PDF p.357; unit 3972 -->

【Felder】

<!-- Source EN PDF p.357; unit 3973 -->

| Feldname | Beschreibung |
|---|---|
| ADPCC_OP_MODE_INVALID | Ungültiger API-Modus |
| ADPCC_OP_MODE_AUTO | Automatischer API-Modus |
| ADPCC_OP_MODE_MANUAL | Manueller API-Modus |
| ADPCC_OP_MODE_TOOL | API-Werkzeugmodus |
| ADPCC_OP_MODE_MAX |  |

<!-- Source EN PDF p.358; unit 3974 -->

9.16.3.3 Adpcc_basic_params_select_t

<!-- Source EN PDF p.358; unit 3975 -->

【Beschreibung】 Eigenschaften der DPCC-Basisparameter definieren.

<!-- Source EN PDF p.358; unit 3976 -->

【Definition】

<!-- Source EN PDF p.358; unit 3977 -->

```text
 typedef struct Adpcc_basic_params_select_s
 {
     int           iso;
     unsigned char stage1_enable;
     unsigned char grayscale_mode;
     unsigned char enable;
     unsigned char sw_rk_out_sel;
     unsigned char sw_dpcc_output_sel;
     unsigned char stage1_rb_3x3;
     unsigned char stage1_g_3x3;
     unsigned char stage1_incl_rb_center;
     unsigned char stage1_incl_green_center;
     unsigned char stage1_use_fix_set;
     unsigned char stage1_use_set_3;
     unsigned char stage1_use_set_2;
     unsigned char stage1_use_set_1;
     unsigned char sw_rk_red_blue1_en;
     unsigned char rg_red_blue1_enable;
     unsigned char rnd_red_blue1_enable;
     unsigned char ro_red_blue1_enable;
     unsigned char lc_red_blue1_enable;
     unsigned char pg_red_blue1_enable;
     unsigned char sw_rk_green1_en;
     unsigned char rg_green1_enable;
     unsigned char rnd_green1_enable;
     unsigned char ro_green1_enable;
     unsigned char lc_green1_enable;
     unsigned char pg_green1_enable;
     unsigned char sw_rk_red_blue2_en;
     unsigned char rg_red_blue2_enable;
     unsigned char rnd_red_blue2_enable;
     unsigned char ro_red_blue2_enable;
     unsigned char lc_red_blue2_enable;
     unsigned char pg_red_blue2_enable;
     unsigned char sw_rk_green2_en;
     unsigned char rg_green2_enable;
     unsigned char rnd_green2_enable;
     unsigned char ro_green2_enable;
     unsigned char lc_green2_enable;
     unsigned char pg_green2_enable;
     unsigned char sw_rk_red_blue3_en;
     unsigned char rg_red_blue3_enable;
     unsigned char rnd_red_blue3_enable;
     unsigned char ro_red_blue3_enable;
     unsigned char lc_red_blue3_enable;
     unsigned char pg_red_blue3_enable;
     unsigned char sw_rk_green3_en;
     unsigned char rg_green3_enable;
     unsigned char rnd_green3_enable;
     unsigned char ro_green3_enable;
     unsigned char lc_green3_enable;
     unsigned char pg_green3_enable;
     unsigned char sw_mindis1_rb;
     unsigned char sw_mindis1_g;
     unsigned char line_thr_1_rb;
     unsigned char line_thr_1_g;
     unsigned char sw_dis_scale_min1;
     unsigned char sw_dis_scale_max1;
     unsigned char line_mad_fac_1_rb;
     unsigned char line_mad_fac_1_g;
     unsigned char pg_fac_1_rb;
     unsigned char pg_fac_1_g;
     unsigned char rnd_thr_1_rb;
     unsigned char rnd_thr_1_g;
     unsigned char rg_fac_1_rb;
     unsigned char rg_fac_1_g;
     unsigned char sw_mindis2_rb;
     unsigned char sw_mindis2_g;
     unsigned char line_thr_2_rb;
     unsigned char line_thr_2_g;
     unsigned char sw_dis_scale_min2;
     unsigned char sw_dis_scale_max2;
     unsigned char line_mad_fac_2_rb;
     unsigned char line_mad_fac_2_g;
     unsigned char pg_fac_2_rb;
     unsigned char pg_fac_2_g;
     unsigned char rnd_thr_2_rb;
     unsigned char rnd_thr_2_g;
     unsigned char rg_fac_2_rb;
     unsigned char rg_fac_2_g;
     unsigned char sw_mindis3_rb;
     unsigned char sw_mindis3_g;
     unsigned char line_thr_3_rb;
     unsigned char line_thr_3_g;
     unsigned char sw_dis_scale_min3;
     unsigned char sw_dis_scale_max3;
     unsigned char line_mad_fac_3_rb;
     unsigned char line_mad_fac_3_g;
     unsigned char pg_fac_3_rb;
     unsigned char pg_fac_3_g;
     unsigned char rnd_thr_3_rb;
     unsigned char rnd_thr_3_g;
     unsigned char rg_fac_3_rb;
     unsigned char rg_fac_3_g;
     unsigned char ro_lim_3_rb;
     unsigned char ro_lim_3_g;
     unsigned char ro_lim_2_rb;
     unsigned char ro_lim_2_g;
     unsigned char ro_lim_1_rb;
     unsigned char ro_lim_1_g;
     unsigned char rnd_offs_3_rb;
     unsigned char rnd_offs_3_g;
     unsigned char rnd_offs_2_rb;
     unsigned char rnd_offs_2_g;
     unsigned char rnd_offs_1_rb;
     unsigned char rnd_offs_1_g;
 } Adpcc_basic_params_select_t;
```

<!-- Source EN PDF p.360; unit 3978 -->

9.16.3.4 Adpcc_basic_params_t

<!-- Source EN PDF p.360; unit 3979 -->

【Beschreibung】 Eigenschaften der DPCC-Basisparameter definieren.

<!-- Source EN PDF p.360; unit 3980 -->

【Definition】

<!-- Source EN PDF p.360; unit 3981 -->

```text
 typedef struct Adpcc_basic_params_s
 {
     Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
 } Adpcc_basic_params_t;
```

<!-- Source EN PDF p.360; unit 3982 -->

【Felder】

<!-- Source EN PDF p.360; unit 3983 -->

| Feldname | Beschreibung |
|---|---|
| arBasic | DPCC-Basisparameter |

<!-- Source EN PDF p.360; unit 3984 -->

9.16.3.5 Adpcc_bpt_params_t

<!-- Source EN PDF p.360; unit 3985 -->

【Beschreibung】 Automatische DPCC-Eigenschaften definieren.

<!-- Source EN PDF p.360; unit 3986 -->

【Definition】

<!-- Source EN PDF p.360; unit 3987 -->

```text
 typedef struct Adpcc_bpt_params_s
 {
     unsigned char      bpt_rb_3x3;
     unsigned char      bpt_g_3x3;
     unsigned char      bpt_incl_rb_center;
     unsigned char      bpt_incl_green_center;
     unsigned char      bpt_use_fix_set;
     unsigned char      bpt_use_set_3;
     unsigned char      bpt_use_set_2;
     unsigned char      bpt_use_set_1;
     unsigned char      bpt_cor_en;
     unsigned char      bpt_det_en;
     unsigned short int bp_number;
     unsigned short int bp_table_addr;
     unsigned short int bpt_v_addr;
     unsigned short int bpt_h_addr;
     unsigned int       bp_cnt;
 } Adpcc_bpt_params_t;
```

<!-- Source EN PDF p.361; unit 3988 -->

9.16.3.6 dpcc_pdaf_point_t

<!-- Source EN PDF p.361; unit 3989 -->

【Beschreibung】

<!-- Source EN PDF p.361; unit 3990 -->

【Definition】

<!-- Source EN PDF p.361; unit 3991 -->

```text
 typedef struct dpcc_pdaf_point_s
 {
     unsigned char y;
     unsigned char x;
 } dpcc_pdaf_point_t;
```

<!-- Source EN PDF p.361; unit 3992 -->

Das Modul ist noch nicht implementiert.

<!-- Source EN PDF p.361; unit 3993 -->

9.16.3.7 Adpcc_pdaf_params_t

<!-- Source EN PDF p.361; unit 3994 -->

【Beschreibung】 PDAF-Moduseigenschaften im automatischen Modus definieren.

<!-- Source EN PDF p.361; unit 3995 -->

【Definition】

<!-- Source EN PDF p.361; unit 3996 -->

```text
 typedef struct Adpcc_pdaf_params_s
 {
     unsigned char      sw_pdaf_en;
     unsigned char      pdaf_point_en[DPCC_PDAF_POINT_NUM];
     unsigned short int pdaf_offsety;
     unsigned short int pdaf_offsetx;
     unsigned char      pdaf_wrapy;
     unsigned char      pdaf_wrapx;
     unsigned short int pdaf_wrapy_num;
     unsigned short int pdaf_wrapx_num;
     dpcc_pdaf_point_t  point[DPCC_PDAF_POINT_NUM];
     unsigned char      pdaf_forward_med;
 } Adpcc_pdaf_params_t;
```

<!-- Source EN PDF p.361; unit 3997 -->

Das Modul ist noch nicht implementiert.

<!-- Source EN PDF p.361; unit 3998 -->

9.16.3.8 CalibDb_Dpcc_Fast_Mode_t

<!-- Source EN PDF p.361; unit 3999 -->

【Beschreibung】 Eigenschaften des Schnellmodus im automatischen Modus definieren.

<!-- Source EN PDF p.361; unit 4000 -->

【Definition】

<!-- Source EN PDF p.362; unit 4001 -->

```text
 typedef struct CalibDb_Dpcc_Fast_Mode_s
 {
     int fast_mode_en;
     int ISO[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_single_en;
     int fast_mode_single_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_double_en;
     int fast_mode_double_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_triple_en;
     int fast_mode_triple_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Fast_Mode_t;
```

<!-- Source EN PDF p.362; unit 4002 -->

【Felder】

<!-- Source EN PDF p.362; unit 4003 -->

| Feldname | Beschreibung |
|---|---|
| Fast_mode_enable | Fast_mode ein/aus: 0 aus, 1 ein |
| ISO | ISO-Wert der Szene |
| fast_mode_single_en | Korrektur einzelner defekter Pixel: 0 aus, 1 ein |
| fast_mode_single_level | Stärke der Korrektur einzelner defekter Pixel, Wertebereich [0, 10] |
| fast_mode_double_en | Korrektur zweier defekter Pixel: 0 aus, 1 ein |
| fast_mode_double_level | Stärke der Korrektur zweier defekter Pixel, Wertebereich [0, 10] |
| fast_mode_triple_en | Korrektur mehrerer defekter Pixel: 0 aus, 1 ein |
| fast_mode_triple_level | Stärke der Korrektur mehrerer defekter Pixel, Wertebereich [0, 10] |

<!-- Source EN PDF p.362; unit 4004 -->

9.16.3.9 CalibDb_Dpcc_Sensor_t

<!-- Source EN PDF p.362; unit 4005 -->

【Beschreibung】 Eigenschaften des Schnellmodus im automatischen Modus definieren.

<!-- Source EN PDF p.362; unit 4006 -->

【Definition】

<!-- Source EN PDF p.362; unit 4007 -->

```text
 typedef struct CalibDb_Dpcc_Sensor_s
 {
     float en;
     float max_level;
     float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_single[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_multiple[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Sensor_t;
```

<!-- Source EN PDF p.362; unit 4008 -->

【Felder】

<!-- Source EN PDF p.363; unit 4009 -->

| Feldname | Beschreibung |
|---|---|
| en | Sensor-DPCC ein/aus: 0 aus, 1 ein |
| max_level | Maximale Stärke der Korrektur defekter Pixel |
| iso | ISO-Wert der Szene |
| level_single | Stärke der Korrektur einzelner defekter Pixel |
| level_multiple | Stärke der Korrektur mehrerer defekter Pixel |

<!-- Source EN PDF p.363; unit 4010 -->

9.16.3.10 Adpcc_bpt_params_select_t

<!-- Source EN PDF p.363; unit 4011 -->

【Beschreibung】 Im automatischen Modus ausgewählte Schnellmodus-Eigenschaften definieren.

<!-- Source EN PDF p.363; unit 4012 -->

【Definition】

<!-- Source EN PDF p.363; unit 4013 -->

```text
 typedef Adpcc_bpt_params_t Adpcc_bpt_params_select_t;
```

<!-- Source EN PDF p.363; unit 4014 -->

9.16.3.11 Adpcc_pdaf_params_select_t

<!-- Source EN PDF p.363; unit 4015 -->

【Beschreibung】 Im automatischen Modus ausgewählte PDAF-Moduseigenschaften definieren.

<!-- Source EN PDF p.363; unit 4016 -->

【Definition】

<!-- Source EN PDF p.363; unit 4017 -->

```text
 typedef Adpcc_pdaf_params_t Adpcc_pdaf_params_select_t
```

<!-- Source EN PDF p.363; unit 4018 -->

9.16.3.12 Adpcc_Auto_Attr_t

<!-- Source EN PDF p.363; unit 4019 -->

【Beschreibung】 Automatische DPCC-Eigenschaften definieren.

<!-- Source EN PDF p.363; unit 4020 -->

【Definition】

<!-- Source EN PDF p.363; unit 4021 -->

```text
 typedef struct Adpcc_Auto_Attr_s
 {
     Adpcc_basic_params_t        stBasicParams;
     Adpcc_bpt_params_t          stBptParams;
     Adpcc_pdaf_params_t         stPdafParams;
     CalibDb_Dpcc_Fast_Mode_t    stFastMode;
     CalibDb_Dpcc_Sensor_t       stSensorDpcc;
     Adpcc_basic_params_select_t stBasicSelect;
     Adpcc_bpt_params_select_t   stBptSelect;
     Adpcc_pdaf_params_select_t  stPdafSelect;
 } Adpcc_Auto_Attr_t;
```

<!-- Source EN PDF p.363; unit 4022 -->

【Felder】

<!-- Source EN PDF p.364; unit 4023 -->

| Feldname | Beschreibung |
|---|---|
| stBasicParams | Basisparameter im automatischen Modus |
| stBptParams | Parameter für defekte Pixel im automatischen Modus |
| stPdafParams | PDAF-Modusparameter im automatischen Modus |
| stFastMode | Schnellmodusparameter im automatischen Modus |
| stSensorDpcc | Parameter der Sensorfunktion für defekte Pixel im automatischen Modus |
| stBasicSelect | Im automatischen Modus ausgewählte Basisparameter |
| stBptSelect | Im automatischen Modus ausgewählte Parameter für defekte Pixel |
| stPdafSelect | Im automatischen Modus ausgewählte PDAF-Modusparameter |

<!-- Source EN PDF p.364; unit 4024 -->

9.16.3.13 Adpcc_fast_mode_attr_t

<!-- Source EN PDF p.364; unit 4025 -->

【Beschreibung】 Eigenschaften des Schnellmodus im manuellen Modus definieren.

<!-- Source EN PDF p.364; unit 4026 -->

【Definition】

<!-- Source EN PDF p.364; unit 4027 -->

```text
 typedef struct Adpcc_fast_mode_attr_s
 {
     bool fast_mode_en;
     bool fast_mode_single_en;
     int  fast_mode_single_level;
     bool fast_mode_double_en;
     int  fast_mode_double_level;
     bool fast_mode_triple_en;
     int  fast_mode_triple_level;
 } Adpcc_fast_mode_attr_t;
```

<!-- Source EN PDF p.364; unit 4028 -->

【Felder】

<!-- Source EN PDF p.364; unit 4029 -->

| Feldname | Beschreibung |
|---|---|
| Fast_mode_en | Fast_mode ein/aus |
| fast_mode_single_en | Korrektur einzelner defekter Pixel ein/aus |
| fast_mode_single_level | Stärke der Korrektur einzelner defekter Pixel, Wertebereich [0, 10] |
| fast_mode_double_en | Korrektur zweier defekter Pixel ein/aus |
| fast_mode_double_level | Stärke der Korrektur zweier defekter Pixel, Wertebereich [0, 10] |
| fast_mode_triple_en | Korrektur mehrerer defekter Pixel ein/aus |
| fast_mode_triple_level | Stärke der Korrektur mehrerer defekter Pixel, Wertebereich [0, 10] |

<!-- Source EN PDF p.365; unit 4030 -->

9.16.3.14 Adpcc_sensor_dpcc_attr_t

<!-- Source EN PDF p.365; unit 4031 -->

【Beschreibung】 Eigenschaften der Sensorfunktion für defekte Pixel im manuellen Modus definieren.

<!-- Source EN PDF p.365; unit 4032 -->

【Definition】

<!-- Source EN PDF p.365; unit 4033 -->

```text
 typedef struct Adpcc_sensor_dpcc_attr_s
 {
     bool en;
     int  max_level;
     int  single_level;
     int  double_level;
 } Adpcc_sensor_dpcc_attr_t;
```

<!-- Source EN PDF p.365; unit 4034 -->

【Felder】

<!-- Source EN PDF p.365; unit 4035 -->

| Feldname | Beschreibung |
|---|---|
| en | Sensor-DPCC ein/aus |
| max_level | Maximale Stärke der Korrektur defekter Pixel |
| single_level | Stärke der Korrektur einzelner defekter Pixel |
| double_level | Stärke der Korrektur mehrerer defekter Pixel |

<!-- Source EN PDF p.365; unit 4036 -->

9.16.3.15 Adpcc_Manual_Attr_t

<!-- Source EN PDF p.365; unit 4037 -->

【Beschreibung】 Manuelle DPCC-Eigenschaften definieren.

<!-- Source EN PDF p.365; unit 4038 -->

【Definition】

<!-- Source EN PDF p.365; unit 4039 -->

```text
 typedef struct Adpcc_Manual_Attr_s
 {
     unsigned char enable;
     Adpcc_onfly_cfg_t stOnfly;
     Adpcc_bpt_params_select_t   stBpt;
     Adpcc_pdaf_params_select_t  stPdaf;
     Adpcc_sensor_dpcc_attr_t    stSensorDpcc;
 } Adpcc_Manual_Attr_t;
```

<!-- Source EN PDF p.365; unit 4040 -->

【Felder】

<!-- Source EN PDF p.366; unit 4041 -->

| Feldname | Beschreibung |
|---|---|
| enable | DPCC im manuellen Modus ein/aus |
| stOnfly | Parameter für die dynamische Erkennung und Korrektur defekter Pixel des ISP-DPCC-Moduls im manuellen Modus |
| stBptParams | Parameter für die statische Korrektur defekter Pixel des ISP-DPCC-Moduls im manuellen Modus |
| stPdafParams | Parameter der PDAF-SPC-Funktion des ISP-DPCC-Moduls im manuellen Modus |
| stSensorDpcc | Parameter der Korrektur defekter Pixel des sensorseitigen DPCC-Moduls im manuellen Modus |

<!-- Source EN PDF p.366; unit 4042 -->

9.16.3.16 Adpcc_onfly_cfg_t

<!-- Source EN PDF p.366; unit 4043 -->

【Beschreibung】 Manuelle DPCC-Basisparameter definieren.

<!-- Source EN PDF p.366; unit 4044 -->

【Definition】

<!-- Source EN PDF p.366; unit 4045 -->

```text
 typedef struct Adpcc_onfly_cfg_s {
    Adpcc_onfly_mode_t mode;
    Adpcc_fast_mode_attr_t fast_mode;
    Adpcc_basic_cfg_params_t expert_mode;
 } Adpcc_onfly_cfg_t;
```

<!-- Source EN PDF p.366; unit 4046 -->

【Felder】

<!-- Source EN PDF p.366; unit 4047 -->

| Feldname | Beschreibung |
|---|---|
| mode | Schnellmodus oder Expertenmodus |
| fastmode | Schnellmodus-Parametereinstellungen im manuellen Modus |
| expert_mode | Parametereinstellungen des Expertenmodus |

<!-- Source EN PDF p.366; unit 4048 -->

9.16.3.17 Adpcc_onfly_mode_t

<!-- Source EN PDF p.366; unit 4049 -->

【Beschreibung】 Manuelle DPCC-Basisparameter definieren.

<!-- Source EN PDF p.366; unit 4050 -->

【Definition】

<!-- Source EN PDF p.366; unit 4051 -->

```text
 typedef enum Adpcc_onfly_mode_e {
     ADPCC_ONFLY_MODE_FAST        = 0,                   /**< dpcc manual fast
 mode */
     ADPCC_ONFLY_MODE_EXPERT      = 1,                   /**< dpcc manual expert
 mode */
     ADPCC_ONFLY_MODE_MAX                                /**< max */
 } Adpcc_onfly_mode_t;
```

<!-- Source EN PDF p.367; unit 4052 -->

【Felder】

<!-- Source EN PDF p.367; unit 4053 -->

| Feldname | Beschreibung |
|---|---|
| ADPCC_ONFLY_MODE_FAST | Schnellmodus |
| ADPCC_ONFLY_MODE_EXPERT | Expertenmodus |
| ADPCC_ONFLY_MODE_MAX | Ungültige Parametereinstellung |

<!-- Source EN PDF p.367; unit 4054 -->

9.16.3.18 CalibDb_Dpcc_Pdaf_t

<!-- Source EN PDF p.367; unit 4055 -->

【Beschreibung】 Attributparameter der PDAF-SPC-Werkzeugfunktion definieren.

<!-- Source EN PDF p.367; unit 4056 -->

【Definition】

<!-- Source EN PDF p.367; unit 4057 -->

```text
 typedef struct CalibDb_Dpcc_Pdaf_s
 {
     unsigned char      en;
     unsigned char      point_en[16];
     unsigned short int offsetx;
     unsigned short int offsety;
     unsigned char      wrapx;
     unsigned char      wrapy;
     unsigned short int wrapx_num;
     unsigned short int wrapy_num;
     unsigned char      point_x[16];
     unsigned char      point_y[16];
     unsigned char      forward_med;
 } CalibDb_Dpcc_Pdaf_t;
```

<!-- Source EN PDF p.367; unit 4058 -->

9.16.3.19 CalibDb_Dpcc_set_RK_t

<!-- Source EN PDF p.367; unit 4059 -->

【Beschreibung】 Eigenschaften des RK-Algorithmus definieren.

<!-- Source EN PDF p.367; unit 4060 -->

【Definition】

<!-- Source EN PDF p.367; unit 4061 -->

```text
 typedef struct CalibDb_Dpcc_set_RK_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_min[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_max[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RK_t;
```

<!-- Source EN PDF p.367; unit 4062 -->

【Felder】

<!-- Source EN PDF p.368; unit 4063 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_sw_mindis | Schwellenwert 1 für defekte Pixel im roten und blauen Kanal |
| g_sw_mindis | Schwellenwert 1 für defekte Pixel im grünen Kanal |
| sw_dis_scale_min | Schwellenwert 2 für defekte Pixel |
| sw_dis_scale_max | Schwellenwert 3 für defekte Pixel |

<!-- Source EN PDF p.368; unit 4064 -->

9.16.3.20 CalibDb_Dpcc_set_LC_t

<!-- Source EN PDF p.368; unit 4065 -->

【Beschreibung】 Eigenschaften des LC-Algorithmus definieren.

<!-- Source EN PDF p.368; unit 4066 -->

【Definition】

<!-- Source EN PDF p.368; unit 4067 -->

```text
 typedef struct CalibDb_Dpcc_set_LC_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_LC_t;
```

<!-- Source EN PDF p.368; unit 4068 -->

【Felder】

<!-- Source EN PDF p.368; unit 4069 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_line_thr | Schwellenwert 1 für defekte Pixel im roten und blauen Kanal |
| g_line_thr | Schwellenwert 1 für defekte Pixel im grünen Kanal |
| rb_line_mad_fac | Schwellenwert 2 für defekte Pixel im roten und blauen Kanal |
| g_line_mad_fac | Schwellenwert 2 für defekte Pixel im grünen Kanal |

<!-- Source EN PDF p.368; unit 4070 -->

9.16.3.21 CalibDb_Dpcc_set_PG_t

<!-- Source EN PDF p.368; unit 4071 -->

【Beschreibung】 Eigenschaften des PG-Algorithmus definieren.

<!-- Source EN PDF p.368; unit 4072 -->

【Definition】

<!-- Source EN PDF p.369; unit 4073 -->

```text
 typedef struct CalibDb_Dpcc_set_PG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_PG_t;
```

<!-- Source EN PDF p.369; unit 4074 -->

【Felder】

<!-- Source EN PDF p.369; unit 4075 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_pg_fac | Schwellenwerte für defekte Pixel im roten und blauen Kanal |
| g_pg_fac | Schwellenwert für defekte Pixel im grünen Kanal |

<!-- Source EN PDF p.369; unit 4076 -->

9.16.3.22 CalibDb_Dpcc_set_RND_t

<!-- Source EN PDF p.369; unit 4077 -->

【Beschreibung】 Eigenschaften des RND-Algorithmus definieren.

<!-- Source EN PDF p.369; unit 4078 -->

【Definition】

<!-- Source EN PDF p.369; unit 4079 -->

```text
 typedef struct CalibDb_Dpcc_set_RND_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RND_t;
```

<!-- Source EN PDF p.369; unit 4080 -->

【Felder】

<!-- Source EN PDF p.369; unit 4081 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_rnd_thr | Schwellenwert 1 für defekte Pixel im roten und blauen Kanal |
| g_rnd_thr | Schwellenwert 1 für defekte Pixel im grünen Kanal |
| rb_rnd_offs | Schwellenwert 2 für defekte Pixel im roten und blauen Kanal |
| g_rnd_offs | Schwellenwert 2 für defekte Pixel im grünen Kanal |

<!-- Source EN PDF p.370; unit 4082 -->

9.16.3.23 CalibDb_Dpcc_set_RG_t

<!-- Source EN PDF p.370; unit 4083 -->

【Beschreibung】 Eigenschaften des RK-Algorithmus definieren. (Die Vorlage nennt hier RK trotz des Typnamens RG.)

<!-- Source EN PDF p.370; unit 4084 -->

【Definition】

<!-- Source EN PDF p.370; unit 4085 -->

```text
 typedef struct CalibDb_Dpcc_set_RG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RG_t;
```

<!-- Source EN PDF p.370; unit 4086 -->

【Felder】

<!-- Source EN PDF p.370; unit 4087 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_rg_fac | Schwellenwerte für defekte Pixel im roten und blauen Kanal |
| g_rg_fac | Schwellenwert für defekte Pixel im grünen Kanal |

<!-- Source EN PDF p.370; unit 4088 -->

9.16.3.24 CalibDb_Dpcc_set_RO_t

<!-- Source EN PDF p.370; unit 4089 -->

【Beschreibung】 Eigenschaften des RO-Algorithmus definieren.

<!-- Source EN PDF p.370; unit 4090 -->

【Definition】

<!-- Source EN PDF p.370; unit 4091 -->

```text
 typedef struct CalibDb_Dpcc_set_RO_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RO_t;
```

<!-- Source EN PDF p.370; unit 4092 -->

【Felder】

<!-- Source EN PDF p.370; unit 4093 -->

| Feldname | Beschreibung |
|---|---|
| rb_enable | Erkennung defekter Pixel im roten und blauen Kanal ein/aus |
| g_enable | Erkennung defekter Pixel im grünen Kanal ein/aus |
| rb_ro_lim | Schwellenwerte für defekte Pixel im roten und blauen Kanal |
| g_ro_lim | Schwellenwert für defekte Pixel im grünen Kanal |

<!-- Source EN PDF p.371; unit 4094 -->

9.16.3.25 CalibDb_Dpcc_set_t

<!-- Source EN PDF p.371; unit 4095 -->

【Beschreibung】 Eigenschaften der Erkennungsbedingungen für defekte Pixel definieren.

<!-- Source EN PDF p.371; unit 4096 -->

【Definition】

<!-- Source EN PDF p.371; unit 4097 -->

```text
 typedef struct CalibDb_Dpcc_set_s
 {
     CalibDb_Dpcc_set_RK_t  rk;
     CalibDb_Dpcc_set_LC_t  lc;
     CalibDb_Dpcc_set_PG_t  pg;
     CalibDb_Dpcc_set_RND_t rnd;
     CalibDb_Dpcc_set_RG_t  rg;
     CalibDb_Dpcc_set_RO_t  ro;
 } CalibDb_Dpcc_set_t;
```

<!-- Source EN PDF p.371; unit 4098 -->

【Felder】

<!-- Source EN PDF p.371; unit 4099 -->

| Feldname | Beschreibung |
|---|---|
| rk | RK-Algorithmus |
| lc | LC-Algorithmus |
| pg | PG-Algorithmus |
| rnd | RND-Algorithmus |
| rg | RG-Algorithmus |
| ro | RO-Algorithmus |

<!-- Source EN PDF p.371; unit 4100 -->

9.16.3.26 CalibDb_Dpcc_Expert_Mode_t

<!-- Source EN PDF p.371; unit 4101 -->

【Beschreibung】 Eigenschaften des Werkzeug-Expertenmodus definieren.

<!-- Source EN PDF p.371; unit 4102 -->

【Definition】

<!-- Source EN PDF p.371; unit 4103 -->

```text
 typedef struct CalibDb_Dpcc_Expert_Mode_s
 {
     float              iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      grayscale_mode;
     unsigned char      rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      dpcc_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_rb_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_g_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_rb_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_g_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_fix_set[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set2[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set1[CALIBDB_DPCC_MAX_ISO_LEVEL];
     CalibDb_Dpcc_set_t set[3];
 } CalibDb_Dpcc_Expert_Mode_t;
```

<!-- Source EN PDF p.372; unit 4104 -->

【Felder】

<!-- Source EN PDF p.372; unit 4105 -->

| Feldname | Beschreibung |
|---|---|
| iso | ISO-Wert der Szene |
| stage1_Enable | Standardwert 1 |
| grayscale_mode | Schwarzweißmodus: 0 aus, 1 ein |
| rk_out_sel | RK-Erkennungsmodus für defekte Pixel: 0 Modus 1, 1 Modus 2, 2 Modus 3 |
| dpcc_out_sel | Korrekturmodus für defekte Pixel: 0 Median, 1 RK-Modus |
| stage1_rb_3x3 | Standardwert: 0 |
| stage1_g_3x3 | Standardwert: 0 |
| stage1_inc_rb_center | Standardwert 1 |
| stage1_inc_g_center | Standardwert 1 |
| stage1_use_fix_set | Integrierte Erkennungsbedingung für defekte Pixel: 0 aus, 1 ein |
| stage1_use_set3 | Dritte Erkennungsbedingung für defekte Pixel in set_cell: 0 aus, 1 ein |
| stage1_use_set2 | Zweite Erkennungsbedingung für defekte Pixel in set_cell: 0 aus, 1 ein |
| stage1_use_set1 | Erste Erkennungsbedingung für defekte Pixel in set_cell: 0 aus, 1 ein |

<!-- Source EN PDF p.372; unit 4106 -->

9.16.3.27 CalibDb_Dpcc_t

<!-- Source EN PDF p.372; unit 4107 -->

【Beschreibung】 DPCC-Werkzeugeigenschaften definieren.

<!-- Source EN PDF p.372; unit 4108 -->

【Definition】

<!-- Source EN PDF p.372; unit 4109 -->

```text
 typedef struct CalibDb_Dpcc_s
 {
     int                        enable;
     char                       version[64];
     CalibDb_Dpcc_Fast_Mode_t   fast;
     CalibDb_Dpcc_Expert_Mode_t expert;
     CalibDb_Dpcc_Pdaf_t        pdaf;
     CalibDb_Dpcc_Sensor_t      sensor_dpcc;
 } CalibDb_Dpcc_t;
```

<!-- Source EN PDF p.372; unit 4110 -->

【Felder】

<!-- Source EN PDF p.373; unit 4111 -->

| Feldname | Beschreibung |
|---|---|
| enable | Ein-/Ausschaltfunktion |
| version | Version |
| fast | Schnellmodus |
| expert | Expertenmodus |
| pdaf | Erkennungsbedingung für defekte Pixel im PADF-SPC-Funktionsmodus |
| sensor_dpcc | Korrekturparameter für defekte Pixel des sensorseitigen DPCC-Moduls |

<!-- Source EN PDF p.373; unit 4112 -->

9.16.3.28 rk_aiq_dpcc_attrib_t

<!-- Source EN PDF p.373; unit 4113 -->

【Beschreibung】 DPCC-Eigenschaften definieren.

<!-- Source EN PDF p.373; unit 4114 -->

【Definition】

<!-- Source EN PDF p.373; unit 4115 -->

```text
 typedef struct rk_aiq_dpcc_attrib_s
 {
     AdpccOPMode_t       eMode;
     Adpcc_Auto_Attr_t   stAuto;
     Adpcc_Manual_Attr_t stManual;
     CalibDb_Dpcc_t      stTool;
 } rk_aiq_dpcc_attrib_t;
```

<!-- Source EN PDF p.373; unit 4116 -->

【Felder】

<!-- Source EN PDF p.373; unit 4117 -->

| Feldname | Beschreibung |
|---|---|
| eMode | API-Modus |
| stAuto | Automatischer DPCC-Modus |
| stManual | Manueller DPCC-Modus |
| stTool | DPCC-Werkzeugmodus |

<!-- Source EN PDF p.373; unit 4118 -->

### 9.17 LSC

<!-- Source EN PDF p.373; unit 4119 -->

#### 9.17.1 Funktionsbeschreibung

<!-- Source EN PDF p.373; unit 4120 -->

Lens Shading Correction gleicht Randabschattungen aus, die aufgrund der optischen Eigenschaften und der ungleichmäßigen Lichtbrechung des Objektivs entstehen.

<!-- Source EN PDF p.374; unit 4121 -->

#### 9.17.2 Referenz der Modul-APIs

<!-- Source EN PDF p.374; unit 4122 -->

9.17.2.1 rk_aiq_user_api2_alsc_SetAttrib

<!-- Source EN PDF p.374; unit 4123 -->

【Beschreibung】 Eigenschaften der Objektivabschattungskorrektur einstellen.

<!-- Source EN PDF p.374; unit 4124 -->

【Syntax】

<!-- Source EN PDF p.374; unit 4125 -->

```text
 XCamReturn
 rk_aiq_user_api2_alsc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t attr);
```

<!-- Source EN PDF p.374; unit 4126 -->

【Parameter】

<!-- Source EN PDF p.374; unit 4127 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften der Objektivabschattungskorrektur | Eingabe |

<!-- Source EN PDF p.374; unit 4128 -->

【Rückgabewert】

<!-- Source EN PDF p.374; unit 4129 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.374; unit 4130 -->

【Voraussetzungen】

<!-- Source EN PDF p.374; unit 4131 -->

Headerdatei: rk_aiq_user_api2_alsc.h

<!-- Source EN PDF p.374; unit 4132 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.374; unit 4133 -->

9.17.2.2 rk_aiq_user_api2_alsc_GetAttrib

<!-- Source EN PDF p.374; unit 4134 -->

【Beschreibung】 Eigenschaften der Objektivabschattungskorrektur abfragen.

<!-- Source EN PDF p.374; unit 4135 -->

【Syntax】

<!-- Source EN PDF p.374; unit 4136 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t *attr);
```

<!-- Source EN PDF p.374; unit 4137 -->

【Parameter】

<!-- Source EN PDF p.375; unit 4138 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften der Objektivabschattungskorrektur | Ausgabe |

<!-- Source EN PDF p.375; unit 4139 -->

【Rückgabewert】

<!-- Source EN PDF p.375; unit 4140 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.375; unit 4141 -->

【Voraussetzungen】

<!-- Source EN PDF p.375; unit 4142 -->

Headerdatei: rk_aiq_user_api2_alsc.h

<!-- Source EN PDF p.375; unit 4143 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.375; unit 4144 -->

#### 9.17.3 Datentypen

<!-- Source EN PDF p.375; unit 4145 -->

9.17.3.1 rk_aiq_lsc_attrib_t

<!-- Source EN PDF p.375; unit 4146 -->

【Beschreibung】 ISP-Eigenschaften der Objektivabschattungskorrektur definieren.

<!-- Source EN PDF p.375; unit 4147 -->

【Definition】

<!-- Source EN PDF p.375; unit 4148 -->

```text
 typedef struct rk_aiq_lsc_attrib_s {
     bool byPass;
     rk_aiq_lsc_op_mode_t mode;
     rk_aiq_lsc_mlsc_attrib_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_lsc_attrib_t;
```

<!-- Source EN PDF p.375; unit 4149 -->

【Felder】

<!-- Source EN PDF p.375; unit 4150 -->

| Feldname | Beschreibung |
|---|---|
| sync | Synchrone/asynchrone Schnittstellenfunktion; zur Definition von rk_aiq_uapi_sync_t siehe Abschnitt Übersicht/API-Beschreibung |
| bypass | LSC-Modul aktivieren:<br>1 aus<br>0 aktivieren |
| mode | Moduseinstellungen |
| stManual | Parametereinstellungen im manuellen Modus |

<!-- Source EN PDF p.376; unit 4151 -->

9.17.3.2 rk_aiq_lsc_op_mode_t

<!-- Source EN PDF p.376; unit 4152 -->

【Beschreibung】 ISP-Betriebsmodus der Objektivabschattungskorrektur definieren.

<!-- Source EN PDF p.376; unit 4153 -->

【Definition】

<!-- Source EN PDF p.376; unit 4154 -->

```text
 typedef enum rk_aiq_lsc_op_mode_s {
     RK_AIQ_LSC_MODE_INVALID                     = 0,        /**< initialization
 value */
     RK_AIQ_LSC_MODE_MANUAL                      = 1,        /**< run manual lens
 shading correction */
     RK_AIQ_LSC_MODE_AUTO                        = 2,        /**< run auto lens
 shading correction */
     RK_AIQ_LSC_MODE_MAX
 } rk_aiq_lsc_op_mode_t;
```

<!-- Source EN PDF p.376; unit 4155 -->

【Felder】

<!-- Source EN PDF p.376; unit 4156 -->

| Feldname | Beschreibung |
|---|---|
| RK_AIQ_LSC_MODE_INVALID | Ungültiger Modus |
| RK_AIQ_LSC_MODE_MANUAL | Manueller Modus |
| RK_AIQ_LSC_MODE_AUTO | Automatischer Modus |

<!-- Source EN PDF p.376; unit 4157 -->

9.17.3.3 rk_aiq_lsc_table_t

<!-- Source EN PDF p.376; unit 4158 -->

【Beschreibung】 ISP-Tabelle der Objektivabschattungskorrektur definieren.

<!-- Source EN PDF p.376; unit 4159 -->

【Definition】

<!-- Source EN PDF p.376; unit 4160 -->

```text
 typedef struct rk_aiq_lsc_table_s {
     unsigned short r_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gr_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gb_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short b_data_tbl[LSC_DATA_TBL_SIZE];
 } rk_aiq_lsc_table_t;
```

<!-- Source EN PDF p.376; unit 4161 -->

【Felder】

<!-- Source EN PDF p.377; unit 4162 -->

| Feldname | Beschreibung |
|---|---|
| r_data_tbl | Korrekturtabelle der R-Komponente<br>Anzahl der Elemente [17x17]<br>Wertebereich [1~7.99]<br>Obere 3 Bit Ganzzahl, untere 8 Bit Nachkommastellen |
| gr_data_tbl | Korrekturtabelle der GR-Komponente<br>Anzahl der Elemente [17x17]<br>Wertebereich [1~7.99]<br>Obere 3 Bit Ganzzahl, untere 8 Bit Nachkommastellen |
| gb_data_tbl | Korrekturtabelle der GB-Komponente<br>Anzahl der Elemente [17x17]<br>Wertebereich [1~7.99]<br>Obere 3 Bit Ganzzahl, untere 8 Bit Nachkommastellen |
| b_data_tbl | Korrekturtabelle der B-Komponente<br>Anzahl der Elemente [17x17]<br>Wertebereich [1~7.99]<br>Obere 3 Bit Ganzzahl, untere 8 Bit Nachkommastellen |

<!-- Source EN PDF p.379; unit 4163 -->

### 9.18 GIC

<!-- Source EN PDF p.379; unit 4164 -->

#### 9.18.1 Funktionsbeschreibung

<!-- Source EN PDF p.379; unit 4165 -->

Das GIC-Modul korrigiert das Ungleichgewicht zwischen den Kanälen Gr und Gb und verbessert dadurch die Bildqualität bestimmter Szenen.

<!-- Source EN PDF p.379; unit 4166 -->

#### 9.18.2 Referenz der Modul-APIs

<!-- Source EN PDF p.379; unit 4167 -->

9.18.2.1 rk_aiq_user_api2_agic_v2_SetAttrib

<!-- Source EN PDF p.379; unit 4168 -->

【Beschreibung】 GIC-Softwareeigenschaften einstellen.

<!-- Source EN PDF p.379; unit 4169 -->

【Syntax】

<!-- Source EN PDF p.379; unit 4170 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.379; unit 4171 -->

【Parameter】

<!-- Source EN PDF p.379; unit 4172 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der GIC-Softwareeigenschaften | Eingabe |

<!-- Source EN PDF p.379; unit 4173 -->

【Rückgabewert】

<!-- Source EN PDF p.379; unit 4174 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.379; unit 4175 -->

【Voraussetzungen】

<!-- Source EN PDF p.379; unit 4176 -->

Headerdatei: rk_aiq_user_api2_agic.h

<!-- Source EN PDF p.379; unit 4177 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.379; unit 4178 -->

【Beschreibung】

<!-- Source EN PDF p.379; unit 4179 -->

Keine.

<!-- Source EN PDF p.380; unit 4180 -->

9.18.2.2 rk_aiq_user_api2_agic_v2_GetAttrib

<!-- Source EN PDF p.380; unit 4181 -->

【Beschreibung】 Gamma-Softwareeigenschaften abfragen. (Die Vorlage nennt hier Gamma, obwohl die API zum GIC-Modul gehört.)

<!-- Source EN PDF p.380; unit 4182 -->

【Syntax】

<!-- Source EN PDF p.380; unit 4183 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.380; unit 4184 -->

【Parameter】

<!-- Source EN PDF p.380; unit 4185 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Struktur der GIC-Softwareeigenschaften | Ausgabe |

<!-- Source EN PDF p.380; unit 4186 -->

【Rückgabewert】

<!-- Source EN PDF p.380; unit 4187 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.380; unit 4188 -->

【Voraussetzungen】

<!-- Source EN PDF p.380; unit 4189 -->

Headerdatei: rk_aiq_user_api2_agic.h

<!-- Source EN PDF p.380; unit 4190 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.380; unit 4191 -->

【Beschreibung】

<!-- Source EN PDF p.380; unit 4192 -->

#### 9.18.3 Datentypen der Modul-API

<!-- Source EN PDF p.380; unit 4193 -->

9.18.3.1 rkaiq_gic_api_op_mode_t

<!-- Source EN PDF p.380; unit 4194 -->

【Beschreibung】 GIC-Betriebsmodus definieren.

<!-- Source EN PDF p.380; unit 4195 -->

【Definition】

<!-- Source EN PDF p.380; unit 4196 -->

```text
   typedef enum rkaiq_gic_api_op_mode_e {
       RKAIQ_GIC_API_OPMODE_OFF    = 0,
       RKAIQ_GIC_API_OPMODE_AUTO   = 1,
       RKAIQ_GIC_API_OPMODE_MANUAL = 2,
   } rkaiq_gic_api_op_mode_t;
```

<!-- Source EN PDF p.380; unit 4197 -->

【Felder】

<!-- Source EN PDF p.381; unit 4198 -->

| Feldname | Beschreibung |
|---|---|
| RKAIQ_GIC_API_OPMODE_OFF | GIC ausgeschaltet |
| RKAIQ_GIC_API_OPMODE_AUTO | Manueller API-Modus (so in der Vorlage trotz AUTO) |
| RKAIQ_GIC_API_OPMODE_MANUAL | Manueller Modus |

<!-- Source EN PDF p.381; unit 4199 -->

9.18.3.2 rkaiq_gic_v2_param_selected_t

<!-- Source EN PDF p.381; unit 4200 -->

【Beschreibung】 Automatische/manuelle Eigenschaften für RK3588 definieren.

<!-- Source EN PDF p.381; unit 4201 -->

【Definition】

<!-- Source EN PDF p.381; unit 4202 -->

```text
   typedef struct rkaiq_gic_v2_param_selected_s {
       uint32_t iso;
       uint8_t bypass;
       uint8_t gr_ratio;
       uint16_t min_busy_thre;
       uint16_t min_grad_thr1;
       uint16_t min_grad_thr2;
       uint16_t k_grad1;
       uint16_t k_grad2;
       uint16_t gb_thre;
       uint16_t maxCorV;
       uint16_t maxCorVboth;
       uint16_t dark_thre;
       uint16_t dark_threHi;
       uint16_t k_grad1_dark;
       uint16_t k_grad2_dark;
       uint16_t min_grad_thr_dark1;
       uint16_t min_grad_thr_dark2;
       float NoiseScale;
       float NoiseBase;
       float noiseCurve_0;
       float noiseCurve_1;
       float globalStrength;
       uint16_t diff_clip;
   } rkaiq_gic_v2_param_selected_t;
```

<!-- Source EN PDF p.381; unit 4203 -->

【Felder】

<!-- Source EN PDF p.382; unit 4204 -->

| Feldname | Beschreibung |
|---|---|
| iso | ISO-Wert der Szene |
| bypass | Reserviert, nicht verwendet |
| gr_ratio | Reserviert, nicht verwendet |
| min_busy_thre | Erkennungsfähigkeit für strukturreiche Bereiche, Wertebereich [0, 1023], Standardwert 160 |
| min_grad_thr1 | Anzahl-Schwellenwert 1 für Bereiche ohne Kanten, GIC-Stärkeregelwert; Wertebereich [0, 1023], Standardwert 32 |
| min_grad_thr2 | Anzahl-Schwellenwert 2 für Bereiche ohne Kanten, GIC-Stärkeregelwert; Wertebereich [0, 1023], Standardwert 32 |
| k_grad1 | Ansprechschwelle 1 für Kanten (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 5 |
| k_grad2 | Ansprechschwelle 2 für Kanten (horizontaler und vertikaler Gradient), Wertebereich [0, 15], Standardwert 1 |
| gb_thre | Skalierungsfaktor, Wertebereich [0, 15], Standardwert 7 |
| maxCorV | Maximalen GB-Kompensationswert im Kantenbereich begrenzen; Wertebereich [0, 1023], Standardwert 40 |
| maxCorVboth | Maximalen GB-Kompensationswert in gleichmäßigen Bereichen ohne Kanten begrenzen; Wertebereich [0, 1023], Standardwert 8 |
| dark_thre | Schwellenwert 1 für dunkle Bereiche definieren; Wertebereich [0, 2047], Standardwert 120 |
| dark_threHi | Schwellenwert 2 für dunkle Bereiche definieren; Wertebereich [0, 2047], Standardwert 240 |
| k_grad1_dark | Kantenschwellenwert 1 (horizontaler und vertikaler Gradient) im dunklen Bildbereich; Wertebereich [0, 15], Standardwert 6 |
| k_grad2_dark | Kantenansprechschwelle 2 (horizontaler und vertikaler Gradient) im dunklen Bildbereich; Wertebereich [0, 15], Standardwert 1 |
| min_grad_thr_dark1 | Anzahl-Schwellenwert 1 für Bereiche ohne Kanten im dunklen Bildteil; Wertebereich [0, 1023], Standardwert 64 |
| min_grad_thr_dark2 | Anzahl-Schwellenwert 2 für Bereiche ohne Kanten im dunklen Bildteil; Wertebereich [0, 1023], Standardwert 32 |
| noiseCurve_0 | Rauschkurvenparameter 1 |
| noiseCurve_1 | Rauschprofilparameter 2 |
| globalStrength | Globale Regelung der Stärke des GB-Kompensationswerts; Wertebereich [0, 2], Standardwert 1 |

<!-- Source EN PDF p.383; unit 4205 -->

| Feldname | Beschreibung |
|---|---|
| NoiseScale | Aus der Rauschkurve die Rauschstandardabweichung des aktuellen Punkts bestimmen; mit noise_std *noise_scale den maximalen GB-Kompensationswert bestimmen |
| NoiseBase | Schwellenwert zur Unterdrückung einer Korrektur an Bildkanten: Zu den Berechnungsergebnissen des ersten und zweiten Gradienten noise_offset addieren und vergleichen. Gilt in einer Richtung gradx&gt;2*grady, wird eine Kante angenommen und keine Korrektur vorgenommen |
| diff_clip | Maximalen GB-Kompensationswert begrenzen |

<!-- Source EN PDF p.383; unit 4206 -->

9.18.3.3 rkaiq_gic_v2_api_attr_t

<!-- Source EN PDF p.383; unit 4207 -->

【Beschreibung】 GIC-Attribute definieren.

<!-- Source EN PDF p.383; unit 4208 -->

【Definition】

<!-- Source EN PDF p.383; unit 4209 -->

```text
   typedef struct rkaiq_gic_v2_api_attr_s {
       rk_aiq_uapi_sync_t sync;
       uint8_t gic_en;
       rkaiq_gic_api_op_mode_t op_mode;
       uint32_t iso_cnt;
       rkaiq_gic_v2_param_selected_t auto_params[RKAIQ_GIC_MAX_ISO_CNT];
       rkaiq_gic_v2_param_selected_t manual_param;
   } rkaiq_gic_v2_api_attr_t;
```

<!-- Source EN PDF p.383; unit 4210 -->

【Felder】

<!-- Source EN PDF p.383; unit 4211 -->

| Feldname | Beschreibung |
|---|---|
| sync | Zur Definition von rk_aiq_uapi_sync_t siehe Übersicht/API-Beschreibung |
| gic_en | Ein/aus |
| op_mode | Betriebsmodus |
| iso_cnt | Anzahl der ISO-Werte in den automatischen Parametern |
| auto_params | Automatische Parameter, ein Satz pro ISO-Wert; die Software berechnet die Werte automatisch durch ISO-Interpolation |
| manual_param | Manuelle Parameter; dieser Parametersatz wird fest verwendet |

<!-- Source EN PDF p.384; unit 4212 -->

### 9.19 CGC

<!-- Source EN PDF p.384; unit 4213 -->

#### 9.19.1 Funktionsbeschreibung

<!-- Source EN PDF p.384; unit 4214 -->

CGC (Color Gamut Compression) dient zur Einstellung der Parameter für die Farbraumkompression.

<!-- Source EN PDF p.384; unit 4215 -->

#### 9.19.2 Referenz der Funktions-APIs

<!-- Source EN PDF p.384; unit 4216 -->

#### 9.19.3 Referenz der Modul-APIs

<!-- Source EN PDF p.384; unit 4217 -->

9.19.3.1 rk_aiq_user_api2_acgc_SetAttrib

<!-- Source EN PDF p.384; unit 4218 -->

【Beschreibung】

<!-- Source EN PDF p.384; unit 4219 -->

Eigenschaften des CGC-Moduls einstellen.

<!-- Source EN PDF p.384; unit 4220 -->

【Syntax】

<!-- Source EN PDF p.384; unit 4221 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t attr);
```

<!-- Source EN PDF p.384; unit 4222 -->

【Parameter】

<!-- Source EN PDF p.384; unit 4223 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaften des CGC-Moduls | Eingabe |

<!-- Source EN PDF p.384; unit 4224 -->

【Rückgabewert】

<!-- Source EN PDF p.384; unit 4225 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.384; unit 4226 -->

【Voraussetzungen】

<!-- Source EN PDF p.384; unit 4227 -->

Headerdatei: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.384; unit 4228 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.384; unit 4229 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.384; unit 4230 -->

Bei attr.param.op_mode = RK_AIQ_OP_MODE_AUTO werden die integrierten CGC-Standardparameter von AIQ verwendet. Bei attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL können die CGC-Parameter konfiguriert werden.

<!-- Source EN PDF p.385; unit 4231 -->

9.19.3.2 rk_aiq_user_api2_acgc_GetAttrib

<!-- Source EN PDF p.385; unit 4232 -->

【Beschreibung】

<!-- Source EN PDF p.385; unit 4233 -->

Aktuelle Eigenschaften des CGC-Moduls abfragen.

<!-- Source EN PDF p.385; unit 4234 -->

【Syntax】

<!-- Source EN PDF p.385; unit 4235 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t* attr);
```

<!-- Source EN PDF p.385; unit 4236 -->

【Parameter】

<!-- Source EN PDF p.385; unit 4237 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Eigenschaft des CGC-Moduls | Ausgabe |

<!-- Source EN PDF p.385; unit 4238 -->

【Rückgabewert】

<!-- Source EN PDF p.385; unit 4239 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.385; unit 4240 -->

【Voraussetzungen】

<!-- Source EN PDF p.385; unit 4241 -->

Headerdatei: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.385; unit 4242 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.385; unit 4243 -->

#### 9.19.4 Datentypen der Modul-API

<!-- Source EN PDF p.385; unit 4244 -->

9.19.4.1 rk_aiq_uapi_acgc_attrib_t

<!-- Source EN PDF p.385; unit 4245 -->

【Beschreibung】 API-Parameter des CGC-Moduls definieren.

<!-- Source EN PDF p.385; unit 4246 -->

【Definition】

<!-- Source EN PDF p.385; unit 4247 -->

```text
 typedef struct rk_aiq_uapi_acgc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     rk_aiq_acgc_params_t param;
 } rk_aiq_uapi_acgc_attrib_t;
```

<!-- Source EN PDF p.385; unit 4248 -->

【Felder】

<!-- Source EN PDF p.386; unit 4249 -->

| Feldname | Beschreibung |
|---|---|
| sync | Zur Definition von rk_aiq_uapi_sync_t siehe Übersicht/API-Beschreibung |
| rk_aiq_acgc_params_t | CGC-Parameter |

<!-- Source EN PDF p.386; unit 4250 -->

9.19.4.2 rk_aiq_acgc_params_t

<!-- Source EN PDF p.386; unit 4251 -->

【Beschreibung】 Parameter des CGC-Moduls definieren.

<!-- Source EN PDF p.386; unit 4252 -->

【Definition】

<!-- Source EN PDF p.386; unit 4253 -->

```text
 typedef struct __cgc_param {
     RKAiqOPMode_t op_mode;
     bool cgc_ratio_en;
     bool cgc_yuv_limit;
 } Cgc_Param_t;
 typedef Cgc_Param_t rk_aiq_acgc_params_t;
```

<!-- Source EN PDF p.386; unit 4254 -->

【Felder】

<!-- Source EN PDF p.386; unit 4255 -->

| Feldname | Beschreibung |
|---|---|
| op_mode | Modus: RK_AIQ_OP_MODE_AUTO (integrierte AIQ-Parameter verwenden) oder RK_AIQ_OP_MODE_MANUAL (benutzerkonfigurierbare Parameter verwenden) |
| cgc_ratio_en | Farbraumkompressionsmodus aktivieren oder deaktivieren; Standardwert FALSE |
| cgc_yuv_limit | Ausgabe im begrenzten Wertebereich; bei cgc_yuv_limit = FALSE wird CGC umgangen. Standardwert FALSE |

<!-- Source EN PDF p.386; unit 4256 -->

## 10. Statistiken

<!-- Source EN PDF p.386; unit 4257 -->

### 10.1 Übersicht

<!-- Source EN PDF p.386; unit 4258 -->

ISP30 unterstützt die Verarbeitung von Bilddaten zur Gewinnung der für die 3A-Regelalgorithmen AWB/AE/AF benötigten Statistikdaten. Der grundsätzliche Ablauf ist wie folgt:

<!-- Source EN PDF p.387; unit 4259 -->

![Technische Originalabbildung — PDF S.387](/docs/rockchip-isp30-development/assets/en-p387-X2034.jpg)

<!-- Source EN PDF p.387; unit 4260 -->

### 10.2 Funktionsbeschreibung

<!-- Source EN PDF p.387; unit 4261 -->

#### 10.2.1 AE-Statistik

<!-- Source EN PDF p.387; unit 4262 -->

Die AE-Hardwarestatistik umfasst hauptsächlich:

<!-- Source EN PDF p.387; unit 4263 -->

Gewichtete Histogrammstatistik mit 256 Abschnitten und blockweise R/G/B/Y-Mittelwerte auf Basis des RAW-Bereichs;

<!-- Source EN PDF p.387; unit 4264 -->

10.2.1.1 AE-Statistik auf Basis von RAW-Bildern

<!-- Source EN PDF p.387; unit 4265 -->

Die Modulstatistik gliedert sich in blockweise Helligkeitsstatistik und Histogrammstatistik. Je nach unterstützter Blockgröße und Verfügbarkeit unabhängiger Teilfensterstatistiken wird zwischen Big- und Lite-Modus unterschieden.

<!-- Source EN PDF p.387; unit 4266 -->

Big-Modus: Unterstützt maximal 15X15 und minimal 1X1 nicht unabhängige Teilfensterblöcke. Jeder Block liefert den Helligkeitsmittelwert der R/B-Kanäle mit 10 Bit und den Mittelwert des G-Kanals mit 12 Bit; standardmäßig werden 15X15 Blöcke verwendet. Zusätzlich können 4 unabhängige Teilfenster eingerichtet werden. Jedes liefert die Helligkeitssumme der R/B-Kanäle mit 29 Bit und die Summe des G-Kanals mit 32 Bit. Zur Berechnung der mittleren Helligkeit muss die Software durch die Pixelanzahl des jeweiligen Teilfensters dividieren. Die gewichtete Histogrammstatistik basiert auf der Blockanzahl und den zugewiesenen Gewichten; die effektive Pixelanzahl pro Helligkeitsabschnitt ist 28 Bit breit.

<!-- Source EN PDF p.387; unit 4267 -->

Lite-Modus: Unterstützt maximal 5X5 und minimal 1X1 nicht unabhängige Teilfensterblöcke. Jeder Block liefert den Helligkeitsmittelwert der R/B-Kanäle mit 10 Bit und den Mittelwert des G-Kanals mit 12 Bit; standardmäßig werden 5X5 Blöcke verwendet. Unabhängige Teilfenster werden nicht unterstützt. Die gewichtete Histogrammstatistik basiert auf der Blockanzahl und den zugewiesenen Gewichten; die effektive Pixelanzahl pro Helligkeitsabschnitt ist 28 Bit breit.

<!-- Source EN PDF p.388; unit 4268 -->

Auf der 3588-Plattform verwendet der Nicht-HDR-Belichtungsmodus standardmäßig BIG (15X15 nicht unabhängige Teilfenster). Im HDR-2-Bild-Modus wird ebenfalls BIG verwendet. Im HDR-3-Bild-Modus verwenden das kurz und das lang belichtete Bild BIG (15X15), das mittel belichtete Bild LITE (5X5 nicht unabhängige Teilfenster).

<!-- Source EN PDF p.388; unit 4269 -->

#### 10.2.2 AWB-Statistik

<!-- Source EN PDF p.388; unit 4270 -->

Datenquelle der AWB-Hardwarestatistik:

<!-- Source EN PDF p.388; unit 4271 -->

Im HDR-Mehrbildmodus kann einer der 3 Kanäle L/M/S ausgewählt werden.

<!-- Source EN PDF p.388; unit 4272 -->

Im linearen Modus gibt es nur 1 Datenkanal.

<!-- Source EN PDF p.388; unit 4273 -->

Statistikberechnung nach Raw-BLC-LSC.

<!-- Source EN PDF p.388; unit 4274 -->

Die AWB-Hardwarestatistik umfasst Weißpunktstatistik und Blockstatistik.

<!-- Source EN PDF p.388; unit 4275 -->

Weißpunktstatistik

<!-- Source EN PDF p.388; unit 4276 -->

Im Hauptfenster werden die Summenwerte und Anzahlen von RGins und BGains in den Weißbereichen von 7 Lichtquellen und 2 Größen erfasst.

<!-- Source EN PDF p.388; unit 4277 -->

Im Teilfenster werden die Summenwerte und Anzahlen von RGins und BGains in den Weißbereichen von 4 Lichtquellen und 2 Größen erfasst.

<!-- Source EN PDF p.388; unit 4278 -->

RGin und BGain in den 4 UV- oder XY-Bereichen werden im jeweiligen Rahmen aufsummiert; außerdem wird die Anzahl der RGins erfasst. (Terminologie der Vorlage beibehalten.)

<!-- Source EN PDF p.388; unit 4279 -->

Blockstatistik: Das Bild wird in 15x15 Blöcke aufgeteilt; für jeden Block werden die R-, G- und B-Mittelwerte aller Punkte oder der Weißpunkte ermittelt.

<!-- Source EN PDF p.388; unit 4280 -->

#### 10.2.3 AF-Statistik

<!-- Source EN PDF p.388; unit 4281 -->

AFHW-Hardwarestatistik:

<!-- Source EN PDF p.388; unit 4282 -->

Im HDR-Mehrbildmodus kann einer der 3 Kanäle L/M/S ausgewählt werden. Auch die nach Zusammenführung der 3 Kanäle entstehenden Daten werden als Eingang unterstützt.

<!-- Source EN PDF p.388; unit 4283 -->

Im linearen Modus gibt es nur 1 Datenkanal.

<!-- Source EN PDF p.388; unit 4284 -->

Unterstützt wird die FV-Ausgabe für jeweils 2 konfigurierbare Frequenzbänder in horizontaler und vertikaler Richtung.

<!-- Source EN PDF p.388; unit 4285 -->

Blockdiagramm des ISP30-AF-Hardwarestatistikmoduls

<!-- Source EN PDF p.388; unit 4286 -->

![Technische Originalabbildung — PDF S.388](/docs/rockchip-isp30-development/assets/en-p388-X2040.jpg)

<!-- Source EN PDF p.389; unit 4287 -->

### 10.3 API-Referenz

<!-- Source EN PDF p.389; unit 4288 -->

#### 10.3.1 rk_aiq_uapi_sysctl_get3AStatsBlk

<!-- Source EN PDF p.389; unit 4289 -->

【Beschreibung】

<!-- Source EN PDF p.389; unit 4290 -->

3A-Statistiken synchron abrufen.

<!-- Source EN PDF p.389; unit 4291 -->

【Syntax】

<!-- Source EN PDF p.389; unit 4292 -->

```text
 XCamReturn
 rk_aiq_uapi_sysctl_get3AStatsBlk(const rk_aiq_sys_ctx_t* ctx, rk_aiq_isp_stats_t
 **stats, int timeout_ms);
```

<!-- Source EN PDF p.389; unit 4293 -->

【Parameter】

<!-- Source EN PDF p.389; unit 4294 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| stats | Zeiger auf die Statistikstruktur | Ausgabe |
| timeout_ms | Zeitlimit; -1 bedeutet unbegrenztes Warten, bis Statistikdaten vorliegen | Eingabe |

<!-- Source EN PDF p.389; unit 4295 -->

【Rückgabewert】

<!-- Source EN PDF p.389; unit 4296 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.389; unit 4297 -->

【Voraussetzungen】

<!-- Source EN PDF p.389; unit 4298 -->

Headerdatei: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.389; unit 4299 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.389; unit 4300 -->

#### 10.3.2 rk_aiq_uapi_sysctl_release3AStatsRef

<!-- Source EN PDF p.389; unit 4301 -->

【Beschreibung】

<!-- Source EN PDF p.389; unit 4302 -->

Die abgerufenen 3A-Statistikdaten freigeben; gemeinsam mit rk_aiq_uapi_sysctl_get3AStatsBlk verwenden.

<!-- Source EN PDF p.389; unit 4303 -->

【Syntax】

<!-- Source EN PDF p.389; unit 4304 -->

```text
 void
 rk_aiq_uapi_sysctl_release3AStatsRef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_isp_stats_t *stats);
```

<!-- Source EN PDF p.390; unit 4305 -->

【Parameter】

<!-- Source EN PDF p.390; unit 4306 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| stats | Zeiger auf die Statistikstruktur | Eingabe |

<!-- Source EN PDF p.390; unit 4307 -->

【Rückgabewert】

<!-- Source EN PDF p.390; unit 4308 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolg |
| Non-0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.390; unit 4309 -->

【Voraussetzungen】

<!-- Source EN PDF p.390; unit 4310 -->

Headerdatei: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.390; unit 4311 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.390; unit 4312 -->

Referenzcode

<!-- Source EN PDF p.390; unit 4313 -->

SDK: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.390; unit 4314 -->

### 10.4 Datentypen

<!-- Source EN PDF p.390; unit 4315 -->

#### 10.4.1 rk_aiq_isp_stats_t

<!-- Source EN PDF p.390; unit 4316 -->

【Beschreibung】 AIQ-3A-Statistiken.

<!-- Source EN PDF p.390; unit 4317 -->

【Definition】

<!-- Source EN PDF p.390; unit 4318 -->

```text
 typedef struct {
     rk_aiq_isp_aec_stats_t aec_stats;
     rk_aiq_isp_awb_stats2_v3x_t awb_stats_v3x;
     rk_aiq_isp_af_stats_t  af_stats;
 } rk_aiq_isp_stats_t;
```

<!-- Source EN PDF p.390; unit 4319 -->

【Felder】

<!-- Source EN PDF p.390; unit 4320 -->

| Feldname | Beschreibung |
|---|---|
| aec_stats | AE-Statistik |
| rk_aiq_isp_awb_stats2_v3x_t | AWB-Statistik |
| af_stats | AF-Statistik |

<!-- Source EN PDF p.391; unit 4321 -->

#### 10.4.2 RKAiqAecStats_t

<!-- Source EN PDF p.391; unit 4322 -->

【Beschreibung】 AE-Dateninformationen definieren; Einzelheiten siehe Funktionsbeschreibung des AE-Abschnitts.

<!-- Source EN PDF p.391; unit 4323 -->

【Definition】

<!-- Source EN PDF p.391; unit 4324 -->

```text
 typedef struct RKAiqAecStats_s {
     RkAiqAecHwStatsRes_t ae_data;
     RKAiqAecExpInfo_t ae_exp;
 } RKAiqAecStats_t;
```

<!-- Source EN PDF p.391; unit 4325 -->

【Felder】

<!-- Source EN PDF p.391; unit 4326 -->

| Feldname | Beschreibung |
|---|---|
| ae_data | Hardwarestatistik des AE-Moduls |
| ae_exp | Sensorbelichtungsinformationen des AE-Moduls |

<!-- Source EN PDF p.391; unit 4327 -->

10.4.2.1 RKAiqAecExpInfo_t

<!-- Source EN PDF p.391; unit 4328 -->

【Beschreibung】 Belichtungsparameterinformationen des AE-Moduls.

<!-- Source EN PDF p.391; unit 4329 -->

【Definition】

<!-- Source EN PDF p.391; unit 4330 -->

```text
 typedef struct RKAiqAecExpInfo_s {
     RkAiqExpParamComb_t LinearExp;
     RkAiqExpParamComb_t HdrExp[3];
     RkAiqIrisParamComb_t Iris;
     uint16_t line_length_pixels;
     uint32_t frame_length_lines;
     float pixel_clock_freq_mhz;
     CISFeature_t CISFeature;
     RKAiqExpI2cParam_t exp_i2c_params;
 } RKAiqAecExpInfo_t;
```

<!-- Source EN PDF p.391; unit 4331 -->

【Felder】

<!-- Source EN PDF p.392; unit 4332 -->

| Feldname | Beschreibung |
|---|---|
| LinearExp | Belichtungsparameterinformationen für Nicht-HDR-Modi, einschließlich tatsächlicher Belichtungswerte und Registerwerte im RK-Format |
| HdrExp | Belichtungsparameterinformationen für den HDR-Modus, einschließlich tatsächlicher Belichtungswerte und Registerwerte im RK-Format; unterstützt bis zu 3 Belichtungen |
| exp_i2c_params | Sensorregisterwerte der Belichtungsparameter; Belichtungsregisterparameter für AE-Lösungen von Drittanbietern |
| line_length_pixels | hts; der Wert wird durch die Konfigurationssequenz des Sensors bestimmt |
| frame_length_lines | vts; der Wert wird durch die Konfigurationssequenz des Sensors bestimmt |
| pixel_clock_freq_mhz | pclk in MHz; der Wert wird durch die Konfigurationssequenz des Sensors bestimmt |

<!-- Source EN PDF p.392; unit 4333 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.392; unit 4334 -->

HdrExp enthält die Belichtungsparameterinformationen im HDR-Modus und unterstützt bis zu 3TO1. Bei HDR 2TO1 bezeichnet Index 0 die kurze und Index 1 die lange Belichtung; Index 2 ist ungültig. Bei HDR 3TO1 bezeichnet Index 0 die kurze, Index 1 die mittlere und Index 2 die lange Belichtung.

<!-- Source EN PDF p.392; unit 4335 -->

10.4.2.1.1 RkAiqExpParamComb_t

<!-- Source EN PDF p.392; unit 4336 -->

【Beschreibung】 Details der Belichtungsparameterinformationen des AE-Moduls.

<!-- Source EN PDF p.392; unit 4337 -->

【Felder】

<!-- Source EN PDF p.392; unit 4338 -->

```text
 typedef struct {
     RkAiqExpRealParam_t exp_real_params; real value
     RkAiqExpSensorParam_t exp_sensor_params;//RK reg value
 } RkAiqExpParamComb_t;
```

<!-- Source EN PDF p.392; unit 4339 -->

| Feldname | Beschreibung |
|---|---|
| exp_real_params | Tatsächlicher physikalischer Wert der Belichtungskomponente |
| exp_sensor_params | Sensorregisterwert der Belichtungskomponente gemäß der RK-Belichtungseinstellung |

<!-- Source EN PDF p.392; unit 4340 -->

```text
 typedef struct RkAiqExpRealParam_s {
     float integration_time;
     float analog_gain;
     float digital_gain;
     float isp_dgain;
     int   iso;
     int   dcg_mode;
 } RkAiqExpRealParam_t;
```

<!-- Source EN PDF p.393; unit 4341 -->

| Feldname | Beschreibung |
|---|---|
| integration_time | Belichtungsintegrationszeit in Sekunden (s) |
| analog_gain | Analoge Verstärkung/Gesamtverstärkung des Sensors als Faktor |
| digital_gain | Digitale Sensorverstärkung als Faktor; wenn diese die Genauigkeit der analogen Verstärkung ausgleicht, wird sie auf 1x gesetzt und der Gesamtverstärkungswert in analog_gain geschrieben |
| isp_dgain | Digitale ISP-Verstärkung als Faktor; derzeit ungültig, Standardwert 1x |
| iso | Gesamtverstärkungswert; ISO repräsentiert die Systemverstärkung mit dem konstanten Faktor 50: ISO = Gesamtverstärkung * 50 |
| dcg_mode | Dual Conversion Gain |

<!-- Source EN PDF p.393; unit 4342 -->

```text
 typedef struct RkAiqExpSensorParam_s {
     unsigned short fine_integration_time;
     unsigned short coarse_integration_time;
     unsigned short analog_gain_code_global;
     unsigned short digital_gain_global;
     unsigned short isp_digital_gain;
 } RkAiqExpSensorParam_t;
```

<!-- Source EN PDF p.393; unit 4343 -->

| Feldname | Beschreibung |
|---|---|
| fine_integration_time | Registerwert für den Bruchteil einer Zeile der Sensorbelichtungsintegrationszeit; nur erforderlich, wenn der Sensor gebrochene Zeilen unterstützt |
| coarse_integration_time | Registerwert der Sensorbelichtungsintegrationszeit als Zeilenanzahl |
| analog_gain_code_global | Registerwerte der analogen Sensorverstärkung |
| digital_gain_global | Registerwerte der digitalen Sensorverstärkung |
| isp_digital_gain | Registerwert der digitalen ISP-Verstärkung; vorläufig ungültig |

<!-- Source EN PDF p.393; unit 4344 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.393; unit 4345 -->

Die digitale Verstärkung erfüllt je nach Sensor unterschiedliche Aufgaben: Sie erweitert die Empfindlichkeit oder gleicht die Genauigkeit der analogen Verstärkung aus. Daher wird sie hier nicht separat aufgeführt; ihr Wert und die zugehörigen Registerwerte sind in der analogen Verstärkung enthalten.

<!-- Source EN PDF p.393; unit 4346 -->

Der Dual-Conversion-Gain-Modus hat drei Zustände: -1 bedeutet, dass der Sensor DCG nicht unterstützt, 0 bezeichnet LCG und 1 bezeichnet HCG.

<!-- Source EN PDF p.393; unit 4347 -->

10.4.2.1.2 RKAiqExpI2cParam_t

<!-- Source EN PDF p.393; unit 4348 -->

【Beschreibung】 I2c-Belichtungsparameter des AE-Moduls, normalerweise für AE von Drittanbietern.

<!-- Source EN PDF p.393; unit 4349 -->

【Definition】

<!-- Source EN PDF p.394; unit 4350 -->

```text
 #define MAX_I2CDATA_LEN 64
 typedef struct RKAiqExpI2cParam_s {
     bool           bValid;
     unsigned int   nNumRegs;
     unsigned int   RegAddr[MAX_I2CDATA_LEN];
     unsigned int   AddrByteNum[MAX_I2CDATA_LEN];
     unsigned int   RegValue[MAX_I2CDATA_LEN];
     unsigned int   ValueByteNum[MAX_I2CDATA_LEN];
     unsigned int   DelayFrames[MAX_I2CDATA_LEN];
 } RKAiqExpI2cParam_t;
```

<!-- Source EN PDF p.394; unit 4351 -->

【Felder】

<!-- Source EN PDF p.394; unit 4352 -->

| Feldname | Beschreibung |
|---|---|
| bValid | Gültigkeitsfreigabe für I2c-Parameter:<br>true: Registerwerte mit RKAiqExpI2cParam_t einstellen (üblicherweise für Drittanbieter-AE);<br>false: Registerwerte anhand der Registerparameter im RK-Format einstellen |
| nNumRegs | Anzahl der einzustellenden Registerwerte |
| AddrByteNum | Bitlänge der Registeradresse; maximal 64 Elemente |
| RegValue | Array von Registerwerten mit maximal 64 Elementen |
| ValueByteNum | Bitlänge des Registerwerts; maximal 64 Elemente |
| DelayFrames | Array der Verzögerungen in Bildern für Registerwerte; maximal 64 Elemente |

<!-- Source EN PDF p.394; unit 4353 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.394; unit 4354 -->

Dieser Registerparameter gilt nur, wenn die Drittanbieter-AE-Anwendung aktiv und bValid true ist. Andernfalls werden standardmäßig die Registerparameter im RK-Format aus RkAiqExpParamComb_t verwendet.

<!-- Source EN PDF p.394; unit 4355 -->

Es können maximal 64 Registerwerte eingestellt werden.

<!-- Source EN PDF p.394; unit 4356 -->

10.4.2.1.3 RkAiqIrisParamComb_t

<!-- Source EN PDF p.394; unit 4357 -->

【Beschreibung】 Blendenparameter des AE-Moduls.

<!-- Source EN PDF p.394; unit 4358 -->

【Definition】

<!-- Source EN PDF p.394; unit 4359 -->

```text
 typedef struct {
     RkAiqPIrisParam_t   PIris;
     RkAiqDCIrisParam_t  DCIris;
 } RkAiqIrisParamComb_t;
 typedef struct {
     int            step;
     int            gain;
     bool           update;
 } RkAiqPIrisParam_t;
 typedef struct {
     int        pwmDuty; //percent value,range = 0-100
     bool       update;
 } RkAiqDCIrisParam_t;
```

<!-- Source EN PDF p.395; unit 4360 -->

【Felder】

<!-- Source EN PDF p.395; unit 4361 -->

| Mitgliedsname | Untergeordnete Mitglieder | Beschreibung |
|---|---|---|
| PIris | step<br>gain<br>update | P-Blendenparameter:<br>Registerwert der P-Blendenstufe; äquivalenter Verstärkungswert dieser Stufe;<br>Aktualisierungsflag für die P-Blendenstufe |
| DCIris | pwmDuty<br>update | DC-Blendenparameter: PWM-Tastverhältnis, Wertebereich 1~100;<br>Aktualisierungsflag für die DC-Blendenparameter |

<!-- Source EN PDF p.395; unit 4362 -->

10.4.2.2 RkAiqAecHwStatsRes_t

<!-- Source EN PDF p.395; unit 4363 -->

【Beschreibung】 Hardwarestatistik des AE-Moduls.

<!-- Source EN PDF p.395; unit 4364 -->

【Definition】

<!-- Source EN PDF p.395; unit 4365 -->

```text
 typedef struct RkAiqAecHwStatsRes_s {
     Aec_Stat_Res_t chn[3];
     Aec_Stat_Res_t extra;
     struct yuvae_stat yuvae;
     struct sihist_stat sihist;
 } RkAiqAecHwStatsRes_t;
```

<!-- Source EN PDF p.395; unit 4366 -->

【Felder】

<!-- Source EN PDF p.395; unit 4367 -->

| Feldname | Beschreibung |
|---|---|
| chn[3] | RAW-Bildstatistik des AE-Moduls nach BLC und AWB; kompatibel mit HDR- und Nicht-HDR-Modi, bis zu HDR 3TO1 S/M/L-Statistiken |
| extra | RAW-Bildstatistik des AE-Moduls vor DeBayer; im HDR-Modus die Statistik des zusammengeführten Bildes |
| yuvae | Blockinformationen des AE-Moduls auf Basis des RGB-Bilds vor Gamma [von der 3588-Plattform nicht unterstützt] |
| sihist | Histogramminformationen des AE-Moduls auf Basis des RGB-Bilds vor Gamma [von der 3588-Plattform nicht unterstützt] |

<!-- Source EN PDF p.395; unit 4368 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.395; unit 4369 -->

Aec_Stat_Res_t chn[3] repräsentiert die Statistik der ersten 3 RAW-Datenpfade vor dem HDR-Merge-Modul. Im Nicht-HDR-Modus ist Index 0 gültig; alle anderen sind ungültig. Bei HDR 2TO1 bezeichnet Index 0 den kurz belichteten und Index 1 den lang belichteten Datenpfad; Index 2 ist ungültig. Bei HDR 3TO1 stehen Index 0 für den kurzen, Index 1 für den mittleren und Index 2 für den langen Belichtungsdatenpfad.

<!-- Source EN PDF p.396; unit 4370 -->

Vor dem RAW-basierten Statistikmodul liegen BLC und AWB; daher beeinflussen deren Verstärkungswerte die Statistik. Aec_Stat_Res_t extra bezeichnet im HDR-Modus die RAW-Bildstatistik nach der HDR-Zusammenführung. Vor diesem Statistikmodul liegen unter anderem BLC, AWB, HDRMERGE und TMO; deren Verstärkungen beeinflussen daher die Statistik. Wenn das AF-Modul eingeschaltet ist, ist dieser Statistikteil außerdem ungültig.

<!-- Source EN PDF p.396; unit 4371 -->

Die 3588-Plattform unterstützt keine Block- und Histogramminformationen auf Basis des RGB-Bilds vor Gamma.

<!-- Source EN PDF p.396; unit 4372 -->

10.4.2.2.1 Aec_Stat_Res_t

<!-- Source EN PDF p.396; unit 4373 -->

【Beschreibung】 RAW-Bildstatistik des AE-Moduls.

<!-- Source EN PDF p.396; unit 4374 -->

【Definition】

<!-- Source EN PDF p.396; unit 4375 -->

```text
 typedef struct Aec_Stat_Res_s {
     //rawae
     struct rawaebig_stat rawae_big;
     struct rawaelite_stat rawae_lite;
     //rawhist
     struct rawhist_stat rawhist_big;
     struct rawhist_stat rawhist_lite;
 } Aec_Stat_Res_t;
```

<!-- Source EN PDF p.396; unit 4376 -->

【Felder】

<!-- Source EN PDF p.396; unit 4377 -->

| Feldname | Beschreibung |
|---|---|
| rawae_big | RAW-basierte Blockstatistik im Big-Modus |
| rawae_lite | RAW-basierte Blockstatistik im Lite-Modus |
| rawhist_big | RAW-basierte Histogrammstatistik im BIG-Modus |
| rawhist_lite | RAW-basierte Histogrammstatistik im Lite-Modus |

<!-- Source EN PDF p.396; unit 4378 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.396; unit 4379 -->

Zu den Unterschieden zwischen BIG und LITE bei RAW-Bildstatistiken siehe die Funktionsbeschreibung. Die Hauptunterschiede sind die Anzahl der Blöcke für die mittlere Helligkeit und die Unterstützung unabhängiger Teilfenster-Mittelwerte. Die RAW-basierten Histogrammstatistiken beider Modi verwenden dieselbe Datenstruktur.

<!-- Source EN PDF p.396; unit 4380 -->

Auf der 3588-Plattform verwendet der Nicht-HDR-Modus standardmäßig BIG (15X15 nicht unabhängige Teilfenster). Bei HDR mit 2 Bildern verwendet jedes Bild BIG (15X15). Bei HDR mit 3 Bildern verwenden die kurze und lange Belichtung BIG (15X15), die mittlere Belichtung LITE (5X5 nicht unabhängige Teilfenster).

<!-- Source EN PDF p.397; unit 4381 -->

10.4.2.2.2 rawaebig_stat

<!-- Source EN PDF p.397; unit 4382 -->

【Beschreibung】 Die RAW-basierte Big-Modus-Statistik enthält die mittlere R/G/B-Helligkeit von 15X15 nicht unabhängigen Teilfenstern und die R/G/B-Helligkeitssummen von 4 unabhängigen Teilfenstern.

<!-- Source EN PDF p.397; unit 4383 -->

【Definition】

<!-- Source EN PDF p.397; unit 4384 -->

```text
 struct rawaebig_stat {
     unsigned short channelr_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelg_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelb_xy[RAWAEBIG_WIN_NUM];
     unsigned int   channely_xy[RAWAEBIG_WIN_NUM]; //not HW!
     unsigned long int wndx_sumr[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumg[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumb[RAWAEBIG_SUBWIN_NUM];
     unsigned short wndx_channelr[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelg[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelb[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned char wndx_channely[RAWAEBIG_SUBWIN_NUM]; //not HW!
 };
 #define RAWAEBIG_WIN_NUM    225
 #define RAWAEBIG_SUBWIN_NUM  4
```

<!-- Source EN PDF p.397; unit 4385 -->

【Felder】

<!-- Source EN PDF p.397; unit 4386 -->

| Feldname | Beschreibung |
|---|---|
| channelr_xy | Mittlere Helligkeit des R-Kanals nicht unabhängiger Teilfensterblöcke im BIG-Modus; 10 gültige Bit |
| channelg_xy | Mittlere Helligkeit des G-Kanals nicht unabhängiger Teilfensterblöcke im Big-Modus; 12 gültige Bit |
| channelb_xy | Mittlere Helligkeit des B-Kanals nicht unabhängiger Teilfensterblöcke im BIG-Modus; 10 gültige Bit |
| wndx_sumr | Helligkeitssumme des R-Kanals unabhängiger Teilfenster im Big-Modus; 29 gültige Bit |
| wndx_sumg | Helligkeitssumme des G-Kanals unabhängiger Teilfenster im BIG-Modus; 32 gültige Bit |
| wndx_sumb | Helligkeitssumme des B-Kanals unabhängiger Teilfenster im Big-Modus; 29 gültige Bit |

<!-- Source EN PDF p.397; unit 4387 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.397; unit 4388 -->

Die RAW-basierte Big-Modus-Statistik enthält nur die 3 Kanäle R/G/B. Falls eine Y-Kanal-Statistik benötigt wird, kann zusätzlicher Softwarecode sie aus den R/G/B-Statistikwerten berechnen.

<!-- Source EN PDF p.397; unit 4389 -->

Die RAW-basierte BIG-Modus-Statistik umfasst 15X15 nicht unabhängige Teilfenster mit einer Mindestgröße von 16X4.

<!-- Source EN PDF p.398; unit 4390 -->

Die RAW-basierte BIG-Modus-Statistik umfasst 4 unabhängige Teilfenster. Ihre Positionen dürfen sich überlappen; ihre Größe darf jeweils 2k x 1k nicht überschreiten.

<!-- Source EN PDF p.398; unit 4391 -->

Die Strukturparameter channely_xy, wndx_channelr, wndx_channelg, wndx_channelb und wndx_channely werden in Software berechnet. Hierzu muss Code ergänzt werden, der die Hardwarestatistikwerte auswertet.

<!-- Source EN PDF p.398; unit 4392 -->

10.4.2.2.3 rawaelite_stat

<!-- Source EN PDF p.398; unit 4393 -->

【Beschreibung】 Die RAW-basierte Lite-Modus-Statistik enthält die mittlere R/G/B-Helligkeit von 5X5 nicht unabhängigen Teilfensterblöcken.

<!-- Source EN PDF p.398; unit 4394 -->

【Definition】

<!-- Source EN PDF p.398; unit 4395 -->

```text
 struct rawaelite_stat {
     unsigned short channelr_xy[RAWAELITE_WIN_NUM];
     unsigned short channelg_xy[RAWAELITE_WIN_NUM];
     unsigned short channelb_xy[RAWAELITE_WIN_NUM];
     unsigned int   channely_xy[RAWAELITE_WIN_NUM]; not HW!
 };
 #define RAWAELITE_WIN_NUM  25
```

<!-- Source EN PDF p.398; unit 4396 -->

【Felder】

<!-- Source EN PDF p.398; unit 4397 -->

| Feldname | Beschreibung |
|---|---|
| channelr_xy | Mittlere R-Kanal-Helligkeit nicht unabhängiger Teilfensterblöcke im Lite-Modus; 10 gültige Bit |
| channelg_xy | Mittlere G-Kanal-Helligkeit nicht unabhängiger Teilfensterblöcke im Lite-Modus; 12 gültige Bit |
| channelb_xy | Mittlere B-Kanal-Helligkeit nicht unabhängiger Teilfensterblöcke im Lite-Modus; 10 gültige Bit |

<!-- Source EN PDF p.398; unit 4398 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.398; unit 4399 -->

Die RAW-basierte Lite-Modus-Statistik enthält nur die 3 R/G/B-Kanäle von 5X5 nicht unabhängigen Teilfenstern. Eine benötigte Y-Statistik kann durch zusätzlichen Softwarecode aus R/G/B berechnet werden. Die Teilfenster müssen mindestens 16X4 groß sein.

<!-- Source EN PDF p.398; unit 4400 -->

channely_xy ist ein Softwareberechnungsparameter; zur Berechnung aus den Hardwarestatistikwerten muss Code ergänzt werden.

<!-- Source EN PDF p.398; unit 4401 -->

10.4.2.2.4 rawhist_stat

<!-- Source EN PDF p.398; unit 4402 -->

【Beschreibung】 RAW-basierte Histogrammstatistik.

<!-- Source EN PDF p.398; unit 4403 -->

【Definition】

<!-- Source EN PDF p.399; unit 4404 -->

```text
 struct rawhist_stat {
     unsigned int bins[RAWHIST_BIN_N_MAX];
 };
 #define RAWHIST_BIN_N_MAX  256
```

<!-- Source EN PDF p.399; unit 4405 -->

【Felder】

<!-- Source EN PDF p.399; unit 4406 -->

| Feldname | Beschreibung |
|---|---|
| bins | Histogramm mit insgesamt 256 Abschnitten; pro Abschnitt 28 gültige Bit |

<!-- Source EN PDF p.399; unit 4407 -->

#### 10.4.3 rk_aiq_isp_awb_stats2_v3x_t

<!-- Source EN PDF p.399; unit 4408 -->

【Beschreibung】 Weißabgleich-Hardwarestatistik definieren; sie umfasst hauptsächlich Weißpunkt- und Blockstatistiken.

<!-- Source EN PDF p.399; unit 4409 -->

Weißpunktstatistik

<!-- Source EN PDF p.399; unit 4410 -->

Im Hauptfenster werden Summenwerte und Anzahlen von RGins und BGain in den Weißbereichen von 7 Lichtquellen und 2 Größen erfasst;

<!-- Source EN PDF p.399; unit 4411 -->

im Teilfenster werden Summenwerte und Anzahlen von RGin und BGain in den Weißbereichen von 4 Lichtquellen und 2 Größen erfasst;

<!-- Source EN PDF p.399; unit 4412 -->

Summenwerte und Anzahlen von RGin und BGain in 4 zusätzlichen Rahmen im UV- oder XY-Bereich;

<!-- Source EN PDF p.399; unit 4413 -->

Helligkeitshistogramm der Weißpunkte;

<!-- Source EN PDF p.399; unit 4414 -->

Blockstatistik: Das Bild wird in 15x15 Blöcke aufgeteilt (siehe AWB-Blockschema), mit R-, G- und B-Mittelwerten aller Punkte oder Weißpunkte jedes Blocks.

<!-- Source EN PDF p.399; unit 4415 -->

![Technische Originalabbildung — PDF S.399](/docs/rockchip-isp30-development/assets/en-p399-X2080.png)

<!-- Source EN PDF p.399; unit 4416 -->

Abbildung: AWB-Blockschema

<!-- Source EN PDF p.399; unit 4417 -->

【Definition】

<!-- Source EN PDF p.400; unit 4418 -->

```text
 typedef struct rk_aiq_isp_awb_stats2_v3x_s {
     //method1
     rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //method2
     rk_aiq_awb_stat_blk_res_v201_t   blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
     //window in pixel domain
     rk_aiq_awb_stat_wp_res_light_v201_t
 multiwindowLightResult[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //window in xy or uv domain
     rk_aiq_awb_stat_wp_res_v201_t
 excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
     //wpno histogram
     unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
 } rk_aiq_isp_awb_stats2_v3x_t;
```

<!-- Source EN PDF p.400; unit 4419 -->

【Felder】

<!-- Source EN PDF p.400; unit 4420 -->

| Feldname | Beschreibung |
|---|---|
| light | Weißpunktstatistiken für unterschiedliche Lichtquellen im Hauptfenster; maximal RK_AIQ_AWB_MAX_WHITEREGIONS_NUM Lichtquellen |
| WpNo2 | Anzahl der Weißpunkte im Schnittbereich von XY- und UV-Bereich für unterschiedliche Lichtquellen im Hauptfenster; ohne Nachkommastellen |
| blockResult | RGB-Summen jedes Blocks; das Bild ist gleichmäßig in insgesamt 15x15 (RK_AIQ_AWB_GRID_NUM_TOTAL) Blöcke aufgeteilt, siehe AWB-Blockschema |
| multiwindowLightResult | Weißpunktstatistik unterschiedlicher Lichtquellen in mehreren Teilfenstern, maximal 4 Teilfenster. Nur die ersten 4 Lichtquellen werden erfasst; mittels Zeitmultiplex können alle erfasst werden |
| excWpRangeResult | Statistik der Punkte im Bereich excludeWpRange; nur die ersten vier Bereiche werden erfasst, maximal 4 Bereiche |
| WpNoHist | Weißpunkthistogramm: Anzahl der Weißpunkte je Bin ohne Nachkommastellen. Das Register xyRangeTypeForWpHist bestimmt, ob Weißpunkte im großen XY-Rahmen oder im XY-Rahmen gezählt werden |

<!-- Source EN PDF p.400; unit 4421 -->

【Vorsichtsmaßnahmen】

<!-- Source EN PDF p.400; unit 4422 -->

Für eine globale Weißpunktstatistik des Hauptfensters können die Weißpunktstatistiken aller Lichtquellen einfach zusammengeführt werden.

<!-- Source EN PDF p.401; unit 4423 -->

#### 10.4.4 rk_aiq_awb_stat_wp_res_light_v201_t

<!-- Source EN PDF p.401; unit 4424 -->

【Beschreibung】 Weißpunktstatistikergebnis für eine Lichtquelle definieren.

<!-- Source EN PDF p.401; unit 4425 -->

【Definition】

<!-- Source EN PDF p.401; unit 4426 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_light_v201_s {
     rk_aiq_awb_stat_wp_res_v201_t xYType[RK_AIQ_AWB_XY_TYPE_MAX_V201];
 } rk_aiq_awb_stat_wp_res_light_v201_t;
```

<!-- Source EN PDF p.401; unit 4427 -->

【Felder】

<!-- Source EN PDF p.401; unit 4428 -->

| Feldname | Beschreibung |
|---|---|
| XYType | Weißpunktstatistik von XY-Rahmen unterschiedlicher Größe für eine Lichtquelle; maximal RK_AIQ_AWB_XY_TYPE_MAX_V201 Rahmen, also 2 Rahmen |

<!-- Source EN PDF p.401; unit 4429 -->

#### 10.4.5 rk_aiq_awb_stat_wp_res_v201_t

<!-- Source EN PDF p.401; unit 4430 -->

【Beschreibung】 Weißpunktstatistik im XY-Rahmen einer bestimmten Größe für eine Lichtquelle sowie Nicht-Weißpunktstatistik im Nicht-Weißpunktbereich definieren.

<!-- Source EN PDF p.401; unit 4431 -->

【Definition】

<!-- Source EN PDF p.401; unit 4432 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_v201_s {
     long long WpNo;
     long long RgainValue;
     long long BgainValue;
 } rk_aiq_awb_stat_wp_res_v201_t;
```

<!-- Source EN PDF p.401; unit 4433 -->

【Felder】

<!-- Source EN PDF p.401; unit 4434 -->

| Feldname | Beschreibung |
|---|---|
| WpNo | Anzahl der Weißpunkte mit 22 Ganzzahl-Bit und 10 Nachkommabits; WpNo = Weißpunktzahl der ISP-Hardwarestatistik / 2^10 |
| RgainValue | Summe der R-Kanalwerte der Weißpunkte, 22 Ganzzahl-Bit und 10 Nachkommabits |
| BgainValue | Summe der G-Kanalwerte der Weißpunkte, 22 Ganzzahl-Bit und 10 Nachkommabits (G laut Vorlage trotz BgainValue) |

<!-- Source EN PDF p.402; unit 4435 -->

#### 10.4.6 rk_aiq_awb_stat_blk_res_v201_t

<!-- Source EN PDF p.402; unit 4436 -->

【Beschreibung】 Statistikergebnisse für jeden Block definieren.

<!-- Source EN PDF p.402; unit 4437 -->

Bei blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 ist das erfasste Ergebnis die Summe aller Punkte des Blocks;

<!-- Source EN PDF p.402; unit 4438 -->

bei blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 ist das Ergebnis die Summe aller Weißpunkte des Blocks;

<!-- Source EN PDF p.402; unit 4439 -->

blkMeasureMode ist das Register zur Steuerung des statistischen Inhalts eines Blocks.

<!-- Source EN PDF p.402; unit 4440 -->

【Definition】

<!-- Source EN PDF p.402; unit 4441 -->

```text
 typedef struct rk_aiq_awb_stat_blk_res_v201_s {
     long long WpNo;
     long long Rvalue;
     long long Gvalue;
     long long Bvalue;
 } rk_aiq_awb_stat_blk_res_v201_t;
```

<!-- Source EN PDF p.402; unit 4442 -->

【Felder】

<!-- Source EN PDF p.402; unit 4443 -->

| Feldname | Beschreibung |
|---|---|
| WpNo | Anzahl der Punkte im Block |
| Rvalue | Summe der R-Kanalwerte aller Punkte im Block |
| Gvalue | Summe der RG-Kanalwerte aller Punkte im Block (RG laut Vorlage) |
| Bvalue | Summe der RB-Kanalwerte aller Punkte im Block (RB laut Vorlage; Satzende unvollständig) |

<!-- Source EN PDF p.402; unit 4444 -->

#### 10.4.7 rk_aiq_af_algo_stat_v30_t

<!-- Source EN PDF p.402; unit 4445 -->

【Beschreibung】 AF-Statistik definieren.

<!-- Source EN PDF p.402; unit 4446 -->

【Definition】

<!-- Source EN PDF p.402; unit 4447 -->

```text
 typedef struct {
     unsigned int wndb_luma;
     unsigned int wndb_sharpness;
     unsigned int winb_highlit_cnt;
     unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int int_state;
     struct timeval focus_starttim;
     struct timeval focus_endtim;
     struct timeval zoom_starttim;
     struct timeval zoom_endtim;
     int64_t sof_tim;
     int focusCode;
     int zoomCode;
     bool focusCorrection;
     bool zoomCorrection;
     float angleZ;
 } rk_aiq_af_algo_stat_v30_t;
```

<!-- Source EN PDF p.403; unit 4448 -->

【Felder】

<!-- Source EN PDF p.403; unit 4449 -->

| Feldname | Beschreibung |
|---|---|
| wndb_luma | Helligkeitswert des unabhängigen Fensters |
| wndb_sharpness | Schärfewert des unabhängigen Fensters |
| winb_highlit_cnt | Spitzlichtzähler des unabhängigen Fensters |
| wnda_luma | Helligkeitswert der 15*15 Teilfenster im Hauptfenster |
| wnda_fv_v1 | V1-Schärfewert der 15*15 Teilfenster im Hauptfenster |
| wnda_fv_v2 | V2-Schärfewert der 15*15 Teilfenster im Hauptfenster |
| wnda_fv_h1 | H1-Schärfewert der 15*15 Teilfenster im Hauptfenster |
| wnda_fv_h2 | H2-Schärfewert der 15*15 Teilfenster im Hauptfenster |
| wina_highlit_cnt | Spitzlichtzähler der 15*15 Teilfenster im Hauptfenster |
| int_state | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| focus_starttim | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| focus_endtim | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| zoom_starttim | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| zoom_endtim | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| sof_tim | Bildstartzeit dieses Datenbilds in ns |
| focusCode | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| zoomCode | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| focusCorrection | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| zoomCorrection | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |
| angleZ | Vom RK-AF-Algorithmus verwendet; kann ignoriert werden |

<!-- Source EN PDF p.404; unit 4450 -->

## 11. Debugging und FAQ

<!-- Source EN PDF p.404; unit 4451 -->

### 11.1 Versionsnummer ermitteln

<!-- Source EN PDF p.404; unit 4452 -->

AIQ stellt das Veröffentlichungsdatum der Version, die AIQ-Version, die IQ-Parser-Version und die Versionsinformationen der einzelnen ISP-Algorithmusmodule bereit.

<!-- Source EN PDF p.404; unit 4453 -->

11.1.0.1 Kurzfassung der Versionsinformationen abrufen

<!-- Source EN PDF p.404; unit 4454 -->

```text
 strings librkaiq.so | grep -w AIQ
 AIQ: v0.1.6
```

<!-- Source EN PDF p.404; unit 4455 -->

11.1.0.2 Vollständige Versionsinformationen abrufen

<!-- Source EN PDF p.404; unit 4456 -->

1\. Die AIQ-Bibliothek im SDK wird standardmäßig als Release-Version gebaut. Auf Debug umstellen, die AIQ-Bibliothek neu kompilieren und auf dem Gerät aktualisieren.

<!-- Source EN PDF p.404; unit 4457 -->

```text
SDK/external/camera_engine_rkaiq/CMakeLists.txt:
```

<!-- Source EN PDF p.404; unit 4458 -->

```text
if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
endif()
```

<!-- Source EN PDF p.404; unit 4459 -->

Ändern in:

<!-- Source EN PDF p.404; unit 4460 -->

```text
#if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
#endif()
```

<!-- Source EN PDF p.404; unit 4461 -->

2\. Bei der standardmäßigen Protokollstufe gibt die geladene und laufende AIQ-Bibliothek nichts aus. Die Protokollstufe des xcore-Moduls kann für die Ausgabe der AIQ-Versionsinformationen eingestellt werden:

<!-- Source EN PDF p.404; unit 4462 -->

```text
 export persist_camera_engine_log=0x1000000ff2
```

<!-- Source EN PDF p.404; unit 4463 -->

3\. Beim AIQ-Start werden folgende Versionsinformationen ausgegeben:

<!-- Source EN PDF p.404; unit 4464 -->

```text
 ************************** VERSION INFOS **************************
 version release date: 2020-06-05
                  AIQ: v0.1.6
            IQ PARSER: v1.0.0
 RK INTEGRATED ALGO MODULES:
                  AWB: v0.0.9
                  AEC: v0.1.1
                   AF: v0.0.9
                 AHDR: v0.0.9
                  ANR: v0.0.9
               ASHARP: v0.0.9
              ADEHAZE: v0.0.9
               AGAMMA: v0.0.9
               A3DLUT: v0.0.9
                 ABLC: v0.0.9
                 ACCM: v0.0.9
                 ACGC: v0.0.9
                  ACP: v0.0.9
             ADEBAYER: v0.0.1
                ADPCC: v0.0.9
                 AGIC: v0.0.9
                  AIE: v0.0.1
                ALDCH: v0.0.9
                 ALSC: v0.0.9
                 AORB: v0.0.9
                 AR2Y: v0.0.9
                  ASD: v0.0.9
                 AWDR: v0.0.9
 ************************ VERSION INFOS END ************************
```

<!-- Source EN PDF p.405; unit 4465 -->

#### 11.1.1 Regeln zur Versionskompatibilität

<!-- Source EN PDF p.405; unit 4466 -->

Für die Kompatibilität zwischen AIQ, IQ Tool und ISP-Treiber gelten folgende Regeln:

<!-- Source EN PDF p.405; unit 4467 -->

v A . B. C

<!-- Source EN PDF p.405; unit 4468 -->

B ist hexadezimal dargestellt. bit[0:3] kennzeichnet die zueinander passende Version von AIQ und IQ Tool; bit[4:7] kennzeichnet die zueinander passende Version von AIQ und ISP-Treiber. Beispiele:

<!-- Source EN PDF p.405; unit 4469 -->

ISP-Treiber: v 1. 0x3.0 passt zu AIQ:v1.0x30.0 und AIQ:v1.0x40.0. (Versionsangaben der Vorlage beibehalten.)

<!-- Source EN PDF p.405; unit 4470 -->

IQ Tool: v 1. 0x3.0 passt zu AIQ:v1.0x33.0 und AIQ:v1.0x30.0. Ist C in der AIQ-Versionsnummer nicht 0, kann eine Versionsinkompatibilität auftreten. Für die Zuordnung zum IQ Tool sollte vorzugsweise eine AIQ-Version mit C = 0 verwendet werden.

<!-- Source EN PDF p.405; unit 4471 -->

### 11.2 AIQ-Protokollierung

<!-- Source EN PDF p.405; unit 4472 -->

#### 11.2.1 Übersicht

<!-- Source EN PDF p.405; unit 4473 -->

AIQ verwendet 64 Bit zur Darstellung der Protokollstufen aller Module. Bitbelegung und Modulbeschreibungen:

<!-- Source EN PDF p.405; unit 4474 -->

```text
 bit: [63-39]   38      37       36    35   34     33    32    31
 mean:  [U]   [CAMHW][ANALYZER][XCORE][ASD][ACGC][AFEC][AORB][ASHARP]
 bit:  30   29   28     27     26       25      24   23       22
 mean:[AIE][ACP][ACSM][ALDCH][A3DLUT][ADEHAZE][AWDR][AGAMMA][ACCM]
 bit:      21     20    19   18    17    16     15   14  13   12
 mean:[ADEBAYER][AGIC][ALSC][ANR][AHDR][ADPCC][ABLC][AF][AWB][AEC]
 bit:    11-4        3-0
 mean:[sub modules][level]
     [U] means unused now.
     [level] : use 4 bits to define log levels.
     each module log has following ascending levels:
     0: error
     1: warning
     2: info
     3: debug
     4: verbose
     5: low1
     6-7: unused, now the same as debug
     [sub modules] : use bits 4-11 to define the sub modules of each module,
 thespecific meaning of each bit is decided by the module itself. These bitsis
 designed to implement the sub module's log switch.
     [modules] : AEC, AWB, AF ...
     set debug level example:
     eg. set module af log level to debug, and enable all sub modules of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4ff4
     Linux:
     export persist_camera_engine_log=0x4ff4
     And if only want enable the sub module 1 log of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4014
     Linux:
     export persist_camera_engine_log=0x4014
```

<!-- Source EN PDF p.406; unit 4475 -->

Wie oben beschrieben, wird die Protokollstufe der einzelnen Module unter Linux durch die Umgebungsvariable persist_camera_engine_log gesteuert.

<!-- Source EN PDF p.407; unit 4476 -->

| Modul | Debug-Protokoll | Verbose-Protokoll |
|---|---|---|
| AE | export persist_camera_engine_log=0x1ff3 | export persist_camera_engine_log=0x1ff4 |
| AWB | export persist_camera_engine_log=0x2ff3 | export persist_camera_engine_log=0x2ff4 |
| AF | export persist_camera_engine_log=0x4ff3 | export persist_camera_engine_log=0x4ff4 |
| HDR | export persist_camera_engine_log=0x20ff3 | export persist_camera_engine_log=0x20ff3 |
| NR | export persist_camera_engine_log=0x40ff3 | export persist_camera_engine_log=0x40ff4 |
| Dehaze | export persist_camera_engine_log=0x2000ff3 | export persist_camera_engine_log=0x2000ff3 |
| Sharp | export persist_camera_engine_log=0x80000ff3 | export persist_camera_engine_log=0x80000ff4 |
| CAMHW | export<br>persist_camera_engine_log=0x4000000ff3 | export<br>persist_camera_engine_log=0x4000000ff4 |
|  |  |  |
|  |  |  |
|  |  |  |

<!-- Source EN PDF p.407; unit 4477 -->

Die aktuelle Protokollstufe lässt sich mit folgendem Befehl abfragen:

<!-- Source EN PDF p.407; unit 4478 -->

```text
    [root@RV1126_RV1109:/]# echo $persist_camera_engine_log
    0x4014
```

<!-- Source EN PDF p.407; unit 4479 -->

#### 11.2.2 AE

<!-- Source EN PDF p.407; unit 4480 -->

11.2.2.1 Konfigurationsanleitung

<!-- Source EN PDF p.407; unit 4481 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Error | Standardmäßig aktiviert<br>Schwerwiegender Fehler |
| Warning | Standardmäßig nicht aktiviert<br>Warnung: Der Algorithmus kann den Fehler gegebenenfalls behandeln und weiterlaufen |
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: keine<br>Ereignisinformationen: Betriebsstatus und Bildrate des Algorithmus, üblicherweise nur bei Initialisierung, Auflösungswechsel und Änderung der Konfigurationsparameter ausgegeben<br>Empfehlung:<br>Zur Ermittlung von Betriebsstatus und Bildrate des Algorithmus |

<!-- Source EN PDF p.408; unit 4482 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe: Bildnummer, zum Bild gehörige Belichtung, zum Bild gehörige AE-Statistik (Bildhelligkeit) und Belichtungsergebnis<br>Ereignisinformationen:<br>Empfehlung:<br>Probleme wie Helligkeitsflackern anhand kontinuierlicher Bildhelligkeits-, Belichtungs- und weiterer Daten untersuchen |
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Debug:<br>Bildweise Ausgabe: Berechnungsergebnisse des Algorithmus<br>Ereignisinformationen:<br>Empfehlung:<br>Üblicherweise ausgeschaltet; aktivieren, wenn Debug zur Diagnose nicht ausreicht |

<!-- Source EN PDF p.408; unit 4483 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4] | Protokollstufe zur AE-Parameterkonfiguration<br>Empfehlung:<br>Beim Einlesen von IQ- oder API-Parametern anhand des Protokolls prüfen, ob die Konfiguration korrekt ist |
| bit[5] | Protokollierung des AE-Informationsverarbeitungsmoduls, das anhand der AE-Statistik Szenen- und Bildkennwerte berechnet<br>Empfehlung:<br>Statistikbezogene Helligkeitsinformationen auslesen |
| bit[6] | Protokollierung des AE-Belichtungsberechnungsmoduls<br>Empfehlung:<br>Informationen zu Belichtungsergebnissen auslesen |
| bit[7] | Protokollstufe des Airis-Blendenalgorithmus<br>Empfehlung:<br>Bei Problemen mit variabler Blende |
| bit[8:11] | Nicht belegt |

<!-- Source EN PDF p.408; unit 4484 -->

11.2.2.2 Interpretation des Protokolls

<!-- Source EN PDF p.408; unit 4485 -->

Aus Platzgründen wird hier nur die Debug-Stufe erläutert (0x1ff3, entsprechend Debug-Informationen aller AE-Untermodule).

<!-- Source EN PDF p.408; unit 4486 -->

AE-Protokoll im linearen Modus

<!-- Source EN PDF p.409; unit 4487 -->

![Technische Originalabbildung — PDF S.409](/docs/rockchip-isp30-development/assets/en-p409-X2117.png)

<!-- Source EN PDF p.409; unit 4488 -->

Abbildung 3-1: AE-Protokoll im linearen Modus

<!-- Source EN PDF p.409; unit 4489 -->

Abbildung 3-1 zeigt ein AE-Protokollbeispiel im linearen Modus. Zeile 1:

<!-- Source EN PDF p.409; unit 4490 -->

```text
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

<!-- Source EN PDF p.409; unit 4491 -->

Belichtungsparameterinformationen des aktuellen Bildes.

<!-- Source EN PDF p.409; unit 4492 -->

| Feldname | Beschreibung |
|---|---|
| FrmId | Nummer des aktuellen Bildes |
| gain | Registerwert der Sensorbelichtungsverstärkung für das aktuelle Bild |
| time | Registerwert der Sensorbelichtungszeit für das aktuelle Bild |
| envChange | Sprunghafte Änderung der Umgebungshelligkeit im aktuellen Bild: 0 keine, 1 sprunghafte Änderung |
| dcg | DCG-Modus des aktuellen Bildes: -1 Sensor unterstützt DCG nicht oder schaltet DCG intern um; 0 LCG; 1 HCG |
| pirs | Position des P-Iris-Blenden-Schrittmotors für das aktuelle Bild. Bei deaktivierter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |

<!-- Source EN PDF p.409; unit 4493 -->

Zeile 2:

<!-- Source EN PDF p.409; unit 4494 -->

```text
Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0
```

<!-- Source EN PDF p.409; unit 4495 -->

Neue Belichtungsparameter aus dem letzten AE-Durchlauf. Einige entsprechen den Angaben unter (1) und werden hier nicht erneut erläutert. Durch Vergleich der Belichtungsprotokolle von Zeile 1 und 2 lässt sich feststellen, ob die aktuelle mit der neuen Belichtung übereinstimmt und die neue Belichtung somit wirksam geworden ist. Zeile 3:

<!-- Source EN PDF p.409; unit 4496 -->

```text
================================= Linear-AE (enter)===============================
```

<!-- Source EN PDF p.409; unit 4497 -->

Eintritt in das AE-Regelalgorithmusmodul; Linear-AE kennzeichnet den aktuellen linearen Belichtungsmodus.

<!-- Source EN PDF p.409; unit 4498 -->

Zeile 4:

<!-- Source EN PDF p.409; unit 4499 -->

```text
Framenum=270
```

<!-- Source EN PDF p.409; unit 4500 -->

```text
Cur gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=34.875557,Is Converged=0
```

<!-- Source EN PDF p.410; unit 4501 -->

| Feldname | Beschreibung |
|---|---|
| Framenum | Nummer des aktuellen Bildes |
| gain | Sensorbelichtungsverstärkung des aktuellen Bildes |
| time | Sensorbelichtungszeit des aktuellen Bildes |
| pirisGain | Äquivalente Verstärkung der P-Iris-Blende für das aktuelle Bild. Bei deaktivierter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |
| RawMeanluma | Helligkeit des RAW-Bildes vor DeBayer für das aktuelle Bild, bereits um den Schwarzwert vermindert und mit AWB Gain multipliziert |
| YuvMeanluma | Helligkeit des RGB-Bildes vor Gamma für das aktuelle Bild; zur Beurteilung des Helligkeitseinflusses der Module nach DeBayer |
| IsConverged | Belichtung des aktuellen Bildes konvergiert: 0 nein, 1 ja |

<!-- Source EN PDF p.410; unit 4502 -->

Zeile 5:

<!-- Source EN PDF p.410; unit 4503 -->

```text
AecClmExecute: NewExposure(0.180993) SplitGain(6.033096) SplitIntegrationTime(0.030000) SplitPirisGain(0)
```

<!-- Source EN PDF p.410; unit 4504 -->

| Feldname | Beschreibung |
|---|---|
| NewExposure | Neuer vom AE-Regelalgorithmus berechneter Belichtungswert |
| SplitGain | Neue Sensorbelichtungsverstärkung |
| SplitIntegrationTime | Neue Sensorbelichtungszeit |
| SplitPirisGain | Neue äquivalente Verstärkung der P-IRIS-Blende. Bei ausgeschalteter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |

<!-- Source EN PDF p.410; unit 4505 -->

Zeile 6:

<!-- Source EN PDF p.410; unit 4506 -->

```text
calc result:SetPoint=22.000000,gain=6.023529,time=0.029987,piris=0,reggain=854,regtime=1398
```

<!-- Source EN PDF p.410; unit 4507 -->

Die endgültig eingestellte neue Belichtung

<!-- Source EN PDF p.411; unit 4508 -->

| Feldname | Beschreibung |
|---|---|
| SetPoint | Zielhelligkeitswert |
| gain | Endgültige neue Belichtungsverstärkung |
| time | Endgültige neue Belichtungszeit |
| piris | Endgültige neue äquivalente Verstärkung der P-IRIS-Blende. Bei ausgeschalteter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |
| reggain | Registerwert der endgültigen neuen Belichtungsverstärkung |
| regtime | Registerwert der endgültigen neuen Belichtungszeit |

<!-- Source EN PDF p.411; unit 4509 -->

Zusammenfassend lassen sich die Helligkeit des aktuellen Bildes RawMeanLuma und der zugehörige Zielwert setpoint ablesen. Die neue Belichtung wird durch Vergleich der Bildhelligkeit mit der Zielhelligkeit berechnet. AE-Protokoll im HDR-Modus:

<!-- Source EN PDF p.411; unit 4510 -->

![Technische Originalabbildung — PDF S.411](/docs/rockchip-isp30-development/assets/en-p411-X2122.png)

<!-- Source EN PDF p.411; unit 4511 -->

Abbildung 3-2: AE-Protokoll im HDR-Modus

<!-- Source EN PDF p.411; unit 4512 -->

Zeile 1:

<!-- Source EN PDF p.411; unit 4513 -->

```text
Cur-Exp: FrmId=22,S-gain=0x0,S-time=0x2b6,M-gain=0xb,M-time=0x1a5e,L-gain=0x0,L- time=0x0,envChange=1,dcg=-1--1--1,Piris=0
```

<!-- Source EN PDF p.411; unit 4514 -->

Belichtungsparameterinformationen des aktuellen Bildes.

<!-- Source EN PDF p.412; unit 4515 -->

| Feldname | Beschreibung |
|---|---|
| FrmId | Nummer des aktuellen Bildes |
| S/M/L-gain | Registerwert der Sensorbelichtungsverstärkung für jedes aktuelle HDR-Bild. Bei HDR mit 2 Bildern ist S/M gültig, bei HDR mit 3 Bildern S/M/L |
| S/M/L-time | Registerwert der Sensorbelichtungszeit für jedes aktuelle HDR-Bild. Bei HDR mit 2 Bildern ist S/M gültig, bei HDR mit 3 Bildern S/M/L |
| envChange | Sprunghafte Änderung der Umgebungshelligkeit im aktuellen Bild: 0 keine, 1 sprunghafte Änderung |
| dcg | DCG-Modi für die 3 kurzen, mittleren und langen Belichtungen. Bei HDR mit 2 Bildern sind die ersten beiden Werte gültig und bezeichnen kurze und lange Belichtung. Bei HDR mit 3 Bildern bezeichnen alle drei Werte kurze, mittlere und lange Belichtung. -1: Sensor unterstützt DCG nicht oder schaltet intern um; 0: LCG; 1: HCG |
| pirs | Position des P-Iris-Blenden-Schrittmotors für das aktuelle Bild. Bei deaktivierter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |

<!-- Source EN PDF p.412; unit 4516 -->

Zeile 2:

<!-- Source EN PDF p.412; unit 4517 -->

```text
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L- time=0x0
```

<!-- Source EN PDF p.412; unit 4518 -->

Neue Belichtungsparameter aus dem letzten AE-Durchlauf. Einige entsprechen den Angaben unter (1) und werden hier nicht erneut erläutert. Durch Vergleich der Belichtungsprotokolle von Zeile 1 und 2 lässt sich erkennen, ob die aktuelle mit der neuen Belichtung übereinstimmt und die neue Belichtung bereits wirksam ist.

<!-- Source EN PDF p.412; unit 4519 -->

Zeile 3:

<!-- Source EN PDF p.412; unit 4520 -->

```text
================================= HDR-AE (enter)===============================
```

<!-- Source EN PDF p.412; unit 4521 -->

Eintritt in das AE-Regelalgorithmusmodul; HDR-AE kennzeichnet den aktuellen HDR-Belichtungsmodus.

<!-- Source EN PDF p.412; unit 4522 -->

Zeile 4:

<!-- Source EN PDF p.412; unit 4523 -->

```text
AecRun: SMeanLuma=9.342692, MMeanLuma=37.698597,LMeanLuma=0.000000,TmoMeanluma=37.571430,Isconverged=0,Longfr m=0
```

<!-- Source EN PDF p.413; unit 4524 -->

| Feldname | Beschreibung |
|---|---|
| S/M/LMeanLuma | Mittlere Helligkeit jedes aktuellen HDR-Bildes. Bei HDR mit 2 Bildern ist S/M gültig, bei HDR mit 3 Bildern S/M/L |
| TmoMeanluma | Mittlere Ausgangshelligkeit des TMO-Moduls für das aktuelle Bild |
| Isconverged | Belichtung jedes aktuellen HDR-Bildes konvergiert: 0 nein, 1 ja |
| Longfrm | Langbelichtungsmodus des aktuellen Bildes: 0 aus, 1 ein |

<!-- Source EN PDF p.413; unit 4525 -->

Zeile 5:

<!-- Source EN PDF p.413; unit 4526 -->

```text
Framenum=22 Cur Piris=0, Sgain=1.000000,Stime=0.002570,mgain=1.462177,mtime=0.025000,lgain=1.000000,ltime=0.000000
```

<!-- Source EN PDF p.413; unit 4527 -->

| Feldname | Beschreibung |
|---|---|
| Framenum | Nummer des aktuellen Bildes |
| s/m/lgain | Sensorbelichtungsverstärkung des aktuellen Bildes. Bei HDR mit 2 Bildern ist s/m gültig, bei HDR mit 3 Bildern s/m/l |
| s/m/ltime | Sensorbelichtungszeit des aktuellen Bildes. Bei HDR mit 2 Bildern ist s/m gültig, bei HDR mit 3 Bildern s/m/l |
| piris | Äquivalente Verstärkung der P-Iris-Blende für das aktuelle Bild. Bei deaktivierter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |

<!-- Source EN PDF p.413; unit 4528 -->

Zeile 6:

<!-- Source EN PDF p.413; unit 4529 -->

```text
S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433
```

<!-- Source EN PDF p.413; unit 4530 -->

Protokoll des Regelalgorithmus für die kurze Belichtung

<!-- Source EN PDF p.413; unit 4531 -->

| Feldname | Beschreibung |
|---|---|
| S-HighLightLuma | Helligkeit des Spitzlichtbereichs der aktuellen kurzen Belichtung |
| S-Target | Zielhelligkeit des Spitzlichtbereichs der aktuellen kurzen Belichtung |
| S-GlobalLuma | Globale mittlere Helligkeit der aktuellen kurzen Belichtung |
| S-Target | Globale Zielhelligkeit der aktuellen kurzen Belichtung |

<!-- Source EN PDF p.413; unit 4532 -->

Zeile 7:

<!-- Source EN PDF p.413; unit 4533 -->

```text
L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155
```

<!-- Source EN PDF p.413; unit 4534 -->

Protokoll des Regelalgorithmus für die lange Belichtung

<!-- Source EN PDF p.414; unit 4535 -->

| Feldname | Beschreibung |
|---|---|
| L-LowLightLuma | Helligkeit des dunklen Bereichs der aktuellen langen Belichtung |
| L-Target | Zielhelligkeit des dunklen Bereichs der aktuellen langen Belichtung |
| L-GlobalLuma | Globale mittlere Helligkeit der aktuellen langen Belichtung |
| L-Target | Globale Zielhelligkeit der aktuellen langen Belichtung |

<!-- Source EN PDF p.414; unit 4536 -->

Zeile 8:

<!-- Source EN PDF p.414; unit 4537 -->

```text
calc result:piris=0,sgain=1.000000,stime=0.005081,mgain=1.862087,mtime=0.025000,lgain=0.000000,lti me=0.000000
```

<!-- Source EN PDF p.414; unit 4538 -->

Belichtungsergebnis des AE-Regelalgorithmus

<!-- Source EN PDF p.414; unit 4539 -->

| Feldname | Beschreibung |
|---|---|
| s/m/lgain | Endgültige neue Sensorbelichtungsverstärkung. Bei HDR mit 2 Bildern ist s/m gültig, bei HDR mit 3 Bildern s/m/l |
| s/m/ltime | Endgültige neue Sensorbelichtungszeit. Bei HDR mit 2 Bildern ist s/m gültig, bei HDR mit 3 Bildern s/m/l |
| piris | Endgültige neue äquivalente Verstärkung der P-IRIS-Blende. Bei deaktivierter Airis-Funktion ist dieser Parameter ungültig und bedeutungslos |

<!-- Source EN PDF p.414; unit 4540 -->

#### 11.2.3 AWB

<!-- Source EN PDF p.414; unit 4541 -->

11.2.3.1 Konfigurationsanleitung

<!-- Source EN PDF p.414; unit 4542 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Error | Standardmäßig aktiviert<br>Schwerwiegender Fehler |
| Warning | Standardmäßig aktiviert<br>Warnung; intern kann eine entsprechende Ausnahmebehandlung vorhanden sein |
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: wbgain-Ergebnisse<br>Ereignisinformationen:<br>Empfehlung: |

<!-- Source EN PDF p.415; unit 4543 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe: Konvergenzzustand des Weißabgleichs, Umgebungshelligkeit, Anzahl der Weißpunkte, Gesamtfarbtemperatur, Wahrscheinlichkeiten der ersten vier besonders wahrscheinlichen Lichtquellen usw.<br>Ereignisinformationen: Ausgabe zugehöriger Attribute nach Aufruf der AWS-API (AWS laut Vorlage)<br>Empfehlung: Bei begrenzter Protokollgröße lassen sich mit dieser Stufe die wichtigsten Diagnoseinformationen erfassen |
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Debug:<br>Bildweise Ausgabe: Weißpunktstatistiken jeder Lichtquelle (Weißabgleichsverstärkung, Weißpunktanzahl), strategiebezogene Zwischenergebnisse usw.<br>Ereignisinformationen:<br>Empfehlung: Diese Stufe zur Erfassung vollständiger Diagnoseprotokolle verwenden |

<!-- Source EN PDF p.415; unit 4544 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.415; unit 4545 -->

11.2.3.2 Interpretation des Protokolls

<!-- Source EN PDF p.415; unit 4546 -->

Siehe „Rockchip_Color_Optimization_Guide_ISP2x_CN“.

<!-- Source EN PDF p.415; unit 4547 -->

#### 11.2.4 AF

<!-- Source EN PDF p.415; unit 4548 -->

11.2.4.1 Konfigurationsanleitung

<!-- Source EN PDF p.415; unit 4549 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Error | Standardmäßig aktiviert<br>Schwerwiegender Fehler |
| Warning | Standardmäßig nicht aktiviert<br>Warnung; intern kann eine entsprechende Ausnahmebehandlung vorhanden sein |
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: Endergebnis des Fokussuchalgorithmus<br>Ereignisinformationen:<br>Empfehlung: |

<!-- Source EN PDF p.416; unit 4550 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe: FV-Statistikwerte, Motorposition<br>Ereignisinformationen: Fokusauslösung, Suche nach der scharfen Position, Zoom, Fokusnachführung, Fokussierung<br>Empfehlung:<br>Diese Stufe zur Erfassung vollständiger Diagnoseprotokolle verwenden |
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Debugging-Informationen gegenüber Debug: keine<br>Bildweise Ausgabe:<br>Ereignisinformationen:<br>Empfehlung: keine |

<!-- Source EN PDF p.416; unit 4551 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.416; unit 4552 -->

11.2.4.2 Interpretation des Protokolls

<!-- Source EN PDF p.416; unit 4553 -->

#### 11.2.5 MERGE

<!-- Source EN PDF p.416; unit 4554 -->

11.2.5.1 Konfigurationsanleitung

<!-- Source EN PDF p.416; unit 4555 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: noch nicht verwendet<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: ausgeschaltet lassen |
| debug | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: Merge-Diagnoseinformationen<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Aktivieren, wenn die Bildhelligkeit nicht den Erwartungen entspricht oder der Kontrast nach TMO nicht ausreicht |
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Debugging-Informationen gegenüber Verbose (so in der Vorlage):<br>Bildweise Ausgabe: Merge-bezogene Belichtungsinformationen<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Bei Bildflackern anhand des AE-Protokolls prüfen, ob TMO während des Flackerns aktiv ist; zur Diagnose durch RK-Mitarbeiter verwenden |

<!-- Source EN PDF p.417; unit 4556 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.417; unit 4557 -->

11.2.5.2 Interpretation des Protokolls

<!-- Source EN PDF p.417; unit 4558 -->

Im linearen Modus sieht das Merge-Protokoll wie folgt aus:

<!-- Source EN PDF p.417; unit 4559 -->

![Technische Originalabbildung — PDF S.417](/docs/rockchip-isp30-development/assets/en-p417-X2143.png)

<!-- Source EN PDF p.417; unit 4560 -->

Im HDR-Modus mit langer Basisbelichtung lautet die Merge-Protokollstufe 10000000ff3.

<!-- Source EN PDF p.417; unit 4561 -->

![Technische Originalabbildung — PDF S.417](/docs/rockchip-isp30-development/assets/en-p417-X2144.png)

<!-- Source EN PDF p.418; unit 4562 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| HDRFrameNum | Anzahl der HDR-Bilder |
| LongFrmMode | Langbelichtungsmodus: 0 aus, 1 ein |
| MergeApiMode | API-Modus |
| EnvLv | Umgebungshelligkeit |
| MoveCoef | Bewegungsvariablen |
| bypass | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| BaseFrm | Basisbelichtungsmodus: 0 lange, 1 kurze Belichtung |
| OECurve_smooth | Steigung der Überbelichtungskurve des aktuellen Bildes, Wertebereich [0,200]; durch Rückskalierung der JSON-Parameter mit Faktor 200 ermittelt |
| OECurve_offset | Offset der Überbelichtungskurve des aktuellen Bildes, Wertebereich [108,280] |
| MDCurveMS_smooth | Steigung der Bewegungskurve zwischen mittlerer und kurzer Belichtung im aktuellen Bild, Wertebereich [0,200]; durch Rückskalierung der JSON-Parameter mit Faktor 200 ermittelt |
| MDCurveMS_offset | Offset der Bewegungskurve zwischen mittlerer und kurzer Belichtung im aktuellen Bild, Wertebereich [0.26,100]; durch Rückskalierung der JSON-Parameter mit Faktor 100 ermittelt |
| MDCurveLM_smooth | Steigung der Bewegungskurve zwischen langer und mittlerer Belichtung im aktuellen Bild, Wertebereich [0,200]; durch Rückskalierung der JSON-Parameter mit Faktor 200 ermittelt |
| MDCurveLM_offset | Offset der Bewegungskurve zwischen langer und mittlerer Belichtung im aktuellen Bild, Wertebereich [0.26,100]; durch Rückskalierung der JSON-Parameter mit Faktor 100 ermittelt |

<!-- Source EN PDF p.418; unit 4563 -->

Im HDR-Modus mit kurzer Basisbelichtung lautet die Merge-Protokollstufe 10000000ff3.

<!-- Source EN PDF p.418; unit 4564 -->

![Technische Originalabbildung — PDF S.418](/docs/rockchip-isp30-development/assets/en-p418-X2148.png)

<!-- Source EN PDF p.419; unit 4565 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| HDRFrameNum | Anzahl der HDR-Bilder |
| LongFrmMode | Langbelichtungsmodus: 0 aus, 1 ein |
| MergeApiMode | API-Modus |
| EnvLv | Umgebungshelligkeit |
| MoveCoef | Bewegungsvariablen |
| bypass | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| BaseFrm | Basisbelichtungsmodus: 0 lange, 1 kurze Belichtung |
| OECurve_smooth | Steigung der Überbelichtungskurve des aktuellen Bildes, Wertebereich [0,200]; durch Rückskalierung der JSON-Parameter mit Faktor 200 ermittelt |
| OECurve_offset | Offset der Überbelichtungskurve des aktuellen Bildes, Wertebereich [108,280] |
| MDCurve_Coef | Regelkoeffizient des aktuellen Bildes, Wertebereich [0,1], Standardwert 0.05, Genauigkeit 0.0001 |
| MDCurve_ms_thd0 | Regelkoeffizient der kurzen Belichtung im aktuellen Bild, Wertebereich [0,1], Standardwert 0.0, Genauigkeit 0.1 |
| MDCurve_lm_thd0 | Regelkoeffizient der langen Belichtung im aktuellen Bild, Wertebereich [0,1], Standardwert 0.0, Genauigkeit 0.1 |

<!-- Source EN PDF p.419; unit 4566 -->

#### 11.2.6 DRC

<!-- Source EN PDF p.419; unit 4567 -->

11.2.6.1 Konfigurationsanleitung

<!-- Source EN PDF p.419; unit 4568 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: noch nicht verwendet<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: ausgeschaltet lassen |
| debug | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: DRC-Diagnoseinformationen<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Aktivieren, wenn die Bildhelligkeit nicht den Erwartungen entspricht oder der Kontrast nach TMO nicht ausreicht |

<!-- Source EN PDF p.420; unit 4569 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Debugging-Informationen gegenüber Verbose (so in der Vorlage):<br>Bildweise Ausgabe: DRC-bezogene Belichtungsinformationen<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Bei Bildflackern anhand des AE-Protokolls prüfen, ob TMO während des Flackerns aktiv ist; zur Diagnose durch RK-Mitarbeiter verwenden |

<!-- Source EN PDF p.420; unit 4570 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.420; unit 4571 -->

11.2.6.2 Interpretation des Protokolls

<!-- Source EN PDF p.420; unit 4572 -->

Bei DRC-Protokollstufe 20ff3:

<!-- Source EN PDF p.420; unit 4573 -->

![Technische Originalabbildung — PDF S.420](/docs/rockchip-isp30-development/assets/en-p420-X2155.png)

<!-- Source EN PDF p.421; unit 4574 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| HDRFrameNum | Anzahl der HDR-Bilder |
| LongFrmMode | Langbelichtungsmodus: 0 aus, 1 ein |
| DRCApiMode | API-Modus |
| EnvLv | Umgebungshelligkeit |
| bypass | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| Enable | DRC ein/aus |
| DrcGain | DRC-Blockverstärkung des aktuellen Bildes, Wertebereich [1,8] |
| Alpha | DrcGain-Alpha-Wert des aktuellen Bildes, Wertebereich [0,1] |
| Clip | DrcGain-Clip-Wert des aktuellen Bildes, Wertebereich [0,64] |
| Strength | HiLight-Detailsteuerung im Spitzlichtbereich des aktuellen Bildes, Wertebereich [0,1] |
| CompressMode | CompressSetting-Modus des aktuellen Bildes |
| LocalWeit | Lokales Gewicht des aktuellen Bildes, Wertebereich [0, 1]: 0 global, 1 vollständig lokal; Standardwert 0 |
| LocalAutoEnable | Automatische LocalWeit-Steuerung des aktuellen Bildes ein/aus, Wertebereich [0,1], Standardwert 1, Genauigkeit 1 |
| LocalAutoWeit | Automatischer LocalWeit-Wert des aktuellen Bildes, Wertebereich [0,1], Standardwert 0.4, Genauigkeit 0.01 |
| GlobalContrast | Globaler Kontrast des aktuellen Bildes, Wertebereich [0,1], Standardwert 0, Genauigkeit 0.01 |
| LoLitContrast | Kontrast im dunklen Bereich des aktuellen Bildes, Wertebereich [0,1], Standardwert 0, Genauigkeit 0.01 |

<!-- Source EN PDF p.421; unit 4575 -->

#### 11.2.7 NR&Sharp

<!-- Source EN PDF p.421; unit 4576 -->

11.2.7.1 Konfigurationsanleitung

<!-- Source EN PDF p.421; unit 4577 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| error | Standardmäßig aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: schwerwiegende Fehler, die einen Softwareabsturz verursachen können<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: aktivieren |

<!-- Source EN PDF p.422; unit 4578 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: sämtliche Funktionsaufrufe ohne Registerwerte; insgesamt umfangreiche Ausgabe<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Bei normaler Bildwirkung und ohne Fehler nicht aktivieren. Registerwerte vorzugsweise mit dem Befehl io ausgeben |
| debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe: sämtliche Funktionsaufrufe einschließlich umfangreicher Registerwertausgaben<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: Bei schwerwiegenden Bildfehlern aktivieren und das Protokoll RK zur Diagnose bereitstellen |

<!-- Source EN PDF p.422; unit 4579 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.422; unit 4580 -->

11.2.7.2 Interpretation des Protokolls

<!-- Source EN PDF p.422; unit 4581 -->

#### 11.2.8 Dhz&Ehz

<!-- Source EN PDF p.422; unit 4582 -->

11.2.8.1 Konfigurationsanleitung

<!-- Source EN PDF p.422; unit 4583 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe: noch nicht verwendet<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: |
| debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe: DHZ- und Ehz-Diagnoseinformationen<br>Ereignisinformationen:<br>Empfehlung: |

<!-- Source EN PDF p.423; unit 4584 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Debugging-Informationen gegenüber Verbose (so in der Vorlage):<br>Bildweise Ausgabe: noch nicht verwendet<br>Ereignisinformationen: noch nicht verwendet<br>Empfehlung: |

<!-- Source EN PDF p.423; unit 4585 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4:11] | Nicht belegt |

<!-- Source EN PDF p.423; unit 4586 -->

11.2.8.2 Interpretation des Protokolls

<!-- Source EN PDF p.423; unit 4587 -->

Bei aktivierter Enhance-Funktion lautet die Dehaze-Protokollstufe 2000ff3.

<!-- Source EN PDF p.423; unit 4588 -->

![Technische Originalabbildung — PDF S.423](/docs/rockchip-isp30-development/assets/en-p423-X2168.png)

<!-- Source EN PDF p.423; unit 4589 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| byPassProc | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| ISO | ISO |
| Dehaze module en | Dehaze-Modul ein/aus |
| Dehaze en | Dehaze-Funktion ein/aus |
| Enhance en | Verstärkungsfunktion ein/aus |
| Hist en | Hist-Funktion ein/aus |
| EnvLv | Umgebungshelligkeit des aktuellen Bildes |
| enhance_value | Allgemeine Kontraststärke des aktuellen Bildes, Wertebereich [0,16], empfohlener Bereich [1, 2] |
| enhance_chroma | Verstärkungsparameter für die Chromatizität des aktuellen Bildes, Wertebereich [0,16], empfohlener Bereich [1, 2] |
| enhance_value_reg | Registerwert der allgemeinen Kontraststärke des aktuellen Bildes |
| enhance_chroma_reg | Registerwert des Verstärkungsparameters für die Chromatizität des aktuellen Bildes |

<!-- Source EN PDF p.423; unit 4590 -->

Bei aktivierter Dehaze-Funktion und cfg_alpha=0 lautet die Dehaze-Protokollstufe 2000ff3.

<!-- Source EN PDF p.424; unit 4591 -->

![Technische Originalabbildung — PDF S.424](/docs/rockchip-isp30-development/assets/en-p424-X2172.png)

<!-- Source EN PDF p.424; unit 4592 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| byPassProc | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| ISO | ISO |
| Dehaze<br>module en | Dehaze-Modul ein/aus |
| Dehaze en | Dehaze-Funktion ein/aus |
| Enhance en | Verstärkungsfunktion ein/aus |
| Hist en | Hist-Funktion ein/aus |
| cfg_alpha | Anteil der Softwarekonfiguration, Wertebereich [0,1], Standardwert 1, Genauigkeit 0.01 |
| EnvLv | Umgebungshelligkeit des aktuellen Bildes |
| air_max | Obergrenze der AIR-Anpassung des aktuellen Bildes, Wertebereich [230, 250], Standardwert 250 |
| air_min | Untergrenze der AIR-Anpassung des aktuellen Bildes, Wertebereich [230, 250], Standardwert 200 (Widerspruch zum Bereich aus der Vorlage beibehalten) |
| tmax_base | Adaptiver tmax-Basiswert des aktuellen Bildes, Standardwert 125. Zuordnung: 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105); empfohlen 131-105 |
| wt_max | Obergrenze der wt-Anpassung des aktuellen Bildes, Wertebereich [0.75, 0.9], Standardwert 0.9 |

<!-- Source EN PDF p.424; unit 4593 -->

Bei aktivierter Dehaze-Funktion und cfg_alpha=1 lautet die Dehaze-Protokollstufe 2000ff3.

<!-- Source EN PDF p.424; unit 4594 -->

![Technische Originalabbildung — PDF S.424](/docs/rockchip-isp30-development/assets/en-p424-X2173.png)

<!-- Source EN PDF p.425; unit 4595 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| byPassProc | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| ISO | ISO |
| Dehaze module<br>en | Dehaze-Modul ein/aus |
| Dehaze en | Dehaze-Funktion ein/aus |
| Enhance en | Verstärkungsfunktion ein/aus |
| Hist en | Hist-Funktion ein/aus |
| cfg_alpha | Anteil der Softwarekonfiguration, Wertebereich [0,1], Standardwert 1, Genauigkeit 0.01 |
| EnvLv | Umgebungshelligkeit des aktuellen Bildes |
| cfg_air | Softwarekonfigurierter atmosphärischer Lichtkoeffizient air des aktuellen Bildes, Wertebereich [0, 255], Standardwert 210 |
| cfg_tmax | Softwarekonfigurierter tmax-Wert des aktuellen Bildes, maximaler Entnebelungswert, Wertebereich [0, 1], Standardwert 0.2 |
| cfg_wt | Softwarekonfigurierter wt-Wert des aktuellen Bildes, Entnebelungsstärke, Wertebereich [0, 1], Standardwert 0.8 |

<!-- Source EN PDF p.425; unit 4596 -->

Bei aktivierter Hist-Funktion lautet die Dehaze-Protokollstufe 2000ff3.

<!-- Source EN PDF p.425; unit 4597 -->

![Technische Originalabbildung — PDF S.425](/docs/rockchip-isp30-development/assets/en-p425-X2176.png)

<!-- Source EN PDF p.426; unit 4598 -->

| Name | Description |
|---|---|
| FrameID | Bildnummer |
| byPassProc | Bypass des aktuellen Bildes: 0 aus, 1 ein |
| ISO | ISO |
| Dehaze module<br>en | Dehaze-Modul ein/aus |
| Dehaze en | Dehaze-Funktion ein/aus |
| Enhance en | Verstärkungsfunktion ein/aus |
| Hist en | Hist-Funktion ein/aus |
| cfg_alpha | Anteil der Softwarekonfiguration, Wertebereich [0,1], Standardwert 1, Genauigkeit 0.01 |
| EnvLv | Umgebungshelligkeit des aktuellen Bildes |
| hist_para_en | Histogrammspreizung des aktuellen Bildes ein/aus |
| hist_gratio | Histogrammspreizungsfaktor bzw. Regelkoeffizient des Histogrammausgleichs für das aktuelle Bild, Wertebereich [0, 32] |
| hist_th_off | Statistikschwelle des Histogramms des aktuellen Bildes, Wertebereich [0, 255], Standardwert 64 |
| hist_k | Faktor der adaptiven Histogrammschwelle des aktuellen Bildes, Wertebereich [0, 7), Standardwert 2 |
| hist_min | Mindestwert der Histogrammstatistikschwelle des aktuellen Bildes, Wertebereich [0,2], Standardwert 0.016 |
| hist_scale | Regelkoeffizient des Histogrammausgleichs für das aktuelle Bild, Wertebereich [0, 32] |
| cfg_gratio | Softwarekonfigurierter Histogrammspreizungsfaktor bzw. Regelkoeffizient des Histogrammausgleichs für das aktuelle Bild, Wertebereich [0, 32] |

<!-- Source EN PDF p.426; unit 4599 -->

#### 11.2.9 CamHW

<!-- Source EN PDF p.426; unit 4600 -->

11.2.9.1 Konfigurationsanleitung

<!-- Source EN PDF p.426; unit 4601 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Error | Standardmäßig aktiviert<br>Schwerwiegender Fehler |
| Warning | Standardmäßig nicht aktiviert<br>Warnung; der Algorithmus verfügt gegebenenfalls über eine Ausnahmebehandlung |

<!-- Source EN PDF p.427; unit 4602 -->

| Protokollstufe | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| Info | Standardmäßig nicht aktiviert<br>Grundlegende Debugging-Informationen:<br>Bildweise Ausgabe:<br>Ereignisinformationen:<br>Empfehlung: |
| Debug | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Info:<br>Bildweise Ausgabe:<br>Ereignisinformationen:<br>Empfehlung: |
| Verbose | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Debug:<br>Bildweise Ausgabe:<br>Ereignisinformationen:<br>Empfehlung: Mit Vorsicht verwenden, da große Informationsmengen auf einmal ausgegeben werden können |
| Low1 | Standardmäßig nicht aktiviert<br>Zusätzliche Informationen gegenüber Debug:<br>Bildweise Ausgabe:<br>Ereignisinformationen: Funktionsaufrufpfad<br>Empfehlung: |

<!-- Source EN PDF p.428; unit 4603 -->

| Untermodul-Bit | Beschreibung und Aktivierungsempfehlungen |
|---|---|
| bit[4] | Protokollierung des Untermoduls 30 für die HWI-Ablaufsteuerung<br>Empfehlung:<br>Gemeinsam mit den folgenden Untermodulen aktivieren |
| bit[5] | Protokollierung der Untermodule Isp30Params und Isp30PollThread für ISP-Parameter, Datenströme, Ereignisse usw.<br>Empfehlung:<br>Bei vermuteter Fehlzuordnung von Parametern und Videobildern, fehlerhaftem Timing und ähnlichen Problemen;<br>im Offline-Readback-Modus bei unterbrochenem Datenfluss und ähnlichen Problemen |
| bit[6] | Protokollierung des Untermoduls SensorHw für den Kamerasensor<br>Empfehlung:<br>Bei vermuteten Problemen mit CIS-Belichtungseinstellungen usw. |
| bit[7] | Protokollierung des Untermoduls FlashLight für die Aufhelllichtsteuerung<br>Empfehlung:<br>Bei Problemen mit der Aufhelllichtsteuerung |
| bit[8] | Protokollierung des Untermoduls LensHw für die Objektivmotorsteuerung<br>Empfehlung:<br>Bei Motorsteuerungsproblemen usw. |
| bit[9] | Untermodul 30SpThread ein/aus;<br>für die interne Modulverwendung reserviert |
| bit[10:11] | Nicht belegt |

<!-- Source EN PDF p.428; unit 4604 -->

11.2.9.2 Interpretation des Protokolls

<!-- Source EN PDF p.428; unit 4605 -->

Untermodul CamHwIsp20

<!-- Source EN PDF p.428; unit 4606 -->

![Technische Originalabbildung — PDF S.428](/docs/rockchip-isp30-development/assets/en-p428-X2185.png)

<!-- Source EN PDF p.428; unit 4607 -->

Das obige Protokoll wird beim Laden der AIQ-Bibliothek nur einmal ausgegeben. Es zeigt die Verbindungen zwischen Kamerasensor, ISP und ISPP anhand der Analyse der Media-Knoten-Topologie. Daraus lässt sich erkennen, ob der Kamerasensor ordnungsgemäß erkannt wurde.

<!-- Source EN PDF p.428; unit 4608 -->

![Technische Originalabbildung — PDF S.428](/docs/rockchip-isp30-development/assets/en-p428-X2186.png)

<!-- Source EN PDF p.429; unit 4609 -->

Das obige Protokoll zeigt die neuen Parameter, welche die HWI-Schicht an den ISP-Treiber übergibt. Die Konfiguration erfolgt derzeit praktisch für jedes Bild. Die Bedeutungen sind:

<!-- Source EN PDF p.429; unit 4610 -->

| Feldname | Beschreibung |
|---|---|
| ispparam ens | Modul-Aktivierungsbit; Bitdefinitionen siehe HWI/ISP20/rk_isp20_hw.H |
| en_up | Aktualisierungsbit der Modulaktivierung; ein gesetztes Bit 1 bedeutet, dass das zugehörige Aktivierungsbit aktualisiert werden muss |
| cfg_up | Aktualisierungsbit der Modulparameter; 1 bedeutet, dass die Modulparameter aktualisiert werden müssen |
| device | Videoknoten des ISP-Parametermoduls |

<!-- Source EN PDF p.429; unit 4611 -->

![Technische Originalabbildung — PDF S.429](/docs/rockchip-isp30-development/assets/en-p429-X2190.png)

<!-- Source EN PDF p.429; unit 4612 -->

Das obige Protokoll zeigt die Übermittlung neuer Parameter durch die HWI-Schicht an den ISPP-Treiber. Dies erfolgt praktisch für jedes Bild; die Bedeutung entspricht dem zuvor beschriebenen ISP-Modul.

<!-- Source EN PDF p.429; unit 4613 -->

Untermodul Isp20PollThread

<!-- Source EN PDF p.429; unit 4614 -->

![Technische Originalabbildung — PDF S.429](/docs/rockchip-isp30-development/assets/en-p429-X2191.png)

<!-- Source EN PDF p.429; unit 4615 -->

Das obige Protokoll zeigt den Start des Readbacks eines Bildes im Readback-Modus. Im normalen Readback-Betrieb wird es für jedes Bild ausgegeben. Die Bedeutungen sind:

<!-- Source EN PDF p.429; unit 4616 -->

| Feldname | Beschreibung |
|---|---|
| frame | RAW-Bildnummer, beginnend bei 0 |
| sof_ts | SOF-Zeitstempel des Bildes |
| frame_ts | Zeitstempel des Abschlusses der Erfassung in DDR |
| readback | Anzahl der ISP-Readbacks |

<!-- Source EN PDF p.429; unit 4617 -->

![Technische Originalabbildung — PDF S.429](/docs/rockchip-isp30-development/assets/en-p429-X2192.png)

<!-- Source EN PDF p.429; unit 4618 -->

Das obige Protokoll zeigt den Umlauf der RAW-Puffer im Readback-Modus. Es wird in diesem Modus für jedes Bild ausgegeben. Die Bedeutungen sind:

<!-- Source EN PDF p.430; unit 4619 -->

| Members | Description |
|---|---|
| handle_rx_buf | Rückgabe an VICAP/isp_tx, nachdem der ISP ein Bild verarbeitet hat |
| dev_index | Geräteindex für lange, mittlere und kurze Belichtung. Gleicher dev_index in den Protokollen von handle_tx_buf und handle_rx_buf bezeichnet dieselben Daten |
| sequence | Bildnummer, beginnend bei 0 |

<!-- Source EN PDF p.430; unit 4620 -->

Untermodul SensorHw

<!-- Source EN PDF p.430; unit 4621 -->

![Technische Originalabbildung — PDF S.430](/docs/rockchip-isp30-development/assets/en-p430-X2195.png)

<!-- Source EN PDF p.430; unit 4622 -->

Das obige Protokoll zeigt im linearen Modus das Einstellen einer neuen Belichtung im Sensortreiber. Der Aufruf erfolgt bei einer neuen Belichtung. Die Bedeutungen sind:

<!-- Source EN PDF p.430; unit 4623 -->

| Members | Description |
|---|---|
| frameid | Bildnummer des SOF-Ereignisses |
| handle_sof | SOF-Ereignisrückruffunktion, einmal pro Bild; verarbeitet die Belichtungseinstellung |
| exp_list size | Anzahl neuer Belichtungszeiten in der Belichtungsliste, die noch nicht an den Treiber übergeben wurden |
| gain_list size | Anzahl neuer Belichtungsverstärkungen in der Belichtungsliste, die noch nicht an den Treiber übergeben wurden |
| working_mode | Aktueller Betriebsmodus; 0 bedeutet normal |
| set_time | Neue Belichtungszeit in der SOF-Nachricht vorhanden, die an den Treiber übergeben werden muss |
| set_gain | Neue Belichtungsverstärkung in der SOF-Nachricht vorhanden, die an den Treiber übergeben werden muss |
| a-gain, time | Neue Belichtungszeit, Verstärkungsregisterwert |

<!-- Source EN PDF p.430; unit 4624 -->

### 11.3 RAW-/YUV-Bilder erfassen

<!-- Source EN PDF p.430; unit 4625 -->

RAW-Daten sind die unverarbeiteten Ausgabedaten des CIS. Bei Bayer-RAW-Sensoren handelt es sich um Bayer-RGB-Daten mit 8/12/14 Bit. CIS-RAW-Daten werden üblicherweise in folgenden Situationen benötigt:

<!-- Source EN PDF p.430; unit 4626 -->

1\. Wenn die vom ISP verarbeiteten YUV-Ausgabedaten fehlerhaft sind,
sollen die RAW-Eingangsdaten des ISP dynamisch erfasst und analysiert werden,
um festzustellen, ob das Problem vom CIS stammt.
2\. Vor der Abstimmung der Bildqualität müssen CIS-RAW-Daten
zur Kalibrierung der Modulparameter erfasst werden.

<!-- Source EN PDF p.431; unit 4627 -->

#### 11.3.1 Speicherformat der RAW-Daten

<!-- Source EN PDF p.431; unit 4628 -->

11.3.1.1 Ungepacktes Speicherformat

<!-- Source EN PDF p.431; unit 4629 -->

Die Speicheranordnung von raw12-Daten wird anhand eines 4-Byte-Speicherabschnitts dargestellt:

<!-- Source EN PDF p.431; unit 4630 -->

![Technische Originalabbildung — PDF S.431](/docs/rockchip-isp30-development/assets/en-p431-X2199.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Bits des Speicherworts | Pixel | Pixelbits |
|---|---|---|
| 31:20 | Pixel 0 | 11:0 |
| 19:16 | Pixel 0 | - - - - |
| 15:4 | Pixel 1 | 11:0 |
| 3:0 | Pixel 1 | - - - - |

<!-- Source EN PDF p.431; unit 4631 -->

11.3.1.2 Gepacktes Speicherformat

<!-- Source EN PDF p.431; unit 4632 -->

Die Speicheranordnung von raw12-Daten wird anhand eines 4-Byte-Speicherabschnitts dargestellt:

<!-- Source EN PDF p.431; unit 4633 -->

![Technische Originalabbildung — PDF S.431](/docs/rockchip-isp30-development/assets/en-p431-X2200.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Bits des Speicherworts | Pixel | Pixelbits |
|---|---|---|
| 31:24 | Pixel3 | 7:0 |
| 23:12 | Pixel2 | 11:0 |
| 11:0 | Pixel1 | 11:0 |

<!-- Source EN PDF p.431; unit 4634 -->

11.3.1.3 RK-RAW V1.0

<!-- Source EN PDF p.431; unit 4635 -->

![Technische Originalabbildung — PDF S.431](/docs/rockchip-isp30-development/assets/en-p431-X2201.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Parametername | Typ | Länge (Byte) | Beschreibung |
|---|---|---|---|
| Kennung | unsigned short | 2 | Fest 0x8080 |
| Headerlänge | unsigned short | 2 | Fest 128 |
| Bildindex | unsigned int | 4 | Bildindex |
| Breite | unsigned short | 2 | Bildbreite |
| Höhe | unsigned short | 2 | Bildhöhe |
| Bittiefe | unsigned char | 1 | Bittiefe des Bildes |
| Bayer-Format | unsigned char | 1 | 0: BGGR; 1: GBRG; 2: GRBG; 3: RGGB |
| Anzahl der HDR-Bilder | unsigned char | 1 | 1: linear, kurz; 2: HDR2, lang+kurz; 3: HDR3, lang+mittel+kurz |
| Aktueller Bildtyp | unsigned char | 1 | 1 kurz; 2 mittel; 3 lang |
| Speichertyp | unsigned char | 1 | 0 gepackt; 1 ungepackt |
| Zeilenabstand | unsigned short | 2 | Byte |
| Effektiver Zeilenabstand | unsigned short | 2 | Byte |
| Reserviert | unsigned char | 107 | Reserviert |
| RAW-DATEN | RAW | W * H * BPP | RAW-DATEN |

<!-- Source EN PDF p.432; unit 4636 -->

11.3.1.4 RK-RAW V2.0

<!-- Source EN PDF p.432; unit 4637 -->

Das Format RK-RAW V2.0 besteht aus Startkennung, Datenblock und Endkennung.

<!-- Source EN PDF p.432; unit 4638 -->

Definition des Formatblocks

<!-- Source EN PDF p.432; unit 4639 -->

Ein Datenblock besteht aus drei Teilen: Kennungs-ID, Blocklänge und Blockdaten. Jede Kennungs-ID besitzt einen eindeutigen festen Wert.

<!-- Source EN PDF p.432; unit 4640 -->

![Technische Originalabbildung — PDF S.432](/docs/rockchip-isp30-development/assets/en-p432-X2208.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Standardwert | Beschreibung |
|---|---|---|---|---|
| Startkennung | u16 | 2 | 0xFF00 | Dateianfang |
| Blockkennung | u16 | 2 | 0xFF01 | RAW-Informationen |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF02 | RAW-Daten im Normalmodus |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF03 | RAW der kurzen HDR2/HDR3-Belichtung |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF04 | RAW der langen HDR2-/mittleren HDR3-Belichtung |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF05 | RAW der langen HDR3-Belichtung |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF06 | Bildstatistik |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF07 | ISP-Registerformat |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF08 | ISP-Register |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF09 | ISPP-Registerformat |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF0a | ISPP-Register |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| Blockkennung | u16 | 2 | 0xFF0b | Plattforminformationen |
| Blocklänge | u32 | 4 | - |  |
| Blockdaten |  |  |  |  |
| ... |  |  |  |  |
| Endkennung | u16 | 2 | 0x00FF | Dateiende |

<!-- Source EN PDF p.432; unit 4641 -->

Nicht alle dargestellten Blöcke sind erforderlich; mehrere können nach Bedarf kombiniert werden. Beispielsweise kann eine RKRawV2-Datei nur „Raw Blocks“, „Raw Blocks“ und „Frame Statistics Blocks“ enthalten. Mindestens diese drei Blöcke werden empfohlen, damit die Datei sinnvoll nutzbar ist. (Die doppelte Bezeichnung „Raw Blocks“ stammt aus der Vorlage.)

<!-- Source EN PDF p.432; unit 4642 -->

Definition des RAW-Informationsblocks

<!-- Source EN PDF p.432; unit 4643 -->

![Technische Originalabbildung — PDF S.432](/docs/rockchip-isp30-development/assets/en-p432-X2209.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Standardwert | Beschreibung |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Sensorname | string | 32 | - | Sensormodell |
| Szene/Licht | string | 32 | - | Aufnahmeszene/Lichtquelle |
| Bildnummer | u32 | 4 | - | Bildnummer |
| Breite | u16 | 2 | - | Bildbreite in Pixeln |
| Höhe | u16 | 2 | - | Bildhöhe in Pixeln |
| Bittiefe | u8 | 1 | - | Bittiefe des Bildes |
| Bayer-Format | u8 | 1 | - | 0 BGGR; 1 GBRG; 2 GRBG; 3 RGGB |
| HDR-Bildanzahl | u8 | 1 | - | 1 linear; 2 lang+kurz; 3 lang+mittel+kurz |
| Speicherformat | u8 | 1 | - | 0 gepackt; 1 ungepackt |
| Zeilenabstand | u16 | 2 | - | Byte |
| Effektiver Zeilenabstand | u16 | 2 | - | Byte |
| Bytereihenfolge | u8 | 1 | - | 0 Big-Endian; 1 Little-Endian |

<!-- Source EN PDF p.432; unit 4644 -->

Definition des RAW-Datenblocks

<!-- Source EN PDF p.433; unit 4645 -->

Dieser Datenabschnitt kann RAW-Bilddaten, einen Puffer-fd oder eine virtuelle Adresse der RAW-Bilddaten enthalten. Bei Verwendung der zugehörigen API muss der Datentyp des Blocks über Parameter angegeben werden; Einzelheiten siehe rk_aiq_rawbuf_type_t.

<!-- Source EN PDF p.433; unit 4646 -->

![Technische Originalabbildung — PDF S.433](/docs/rockchip-isp30-development/assets/en-p433-X2213.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Beschreibung |
|---|---|---|---|
| RAW-Daten | - | height*width*N; ungepackt N=2; gepackt N=bpp/8 | RAW-Daten, 0xFF02–0xFF05 |

<!-- Source EN PDF p.433; unit 4647 -->

Definition des Bildstatistikblocks

<!-- Source EN PDF p.433; unit 4648 -->

![Technische Originalabbildung — PDF S.433](/docs/rockchip-isp30-development/assets/en-p433-X2214.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Standardwert | Beschreibung |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | Raw: 0x0200=v2.0 |
| Bildnummer | u32 | 4 | - | Bildnummer |
| Normal_Exp | float | 4 | - | Belichtungszeit im linearen Modus |
| Normal_Gain | float | 4 | - | Belichtungsverstärkung im linearen Modus |
| Normal_Exp_REG | u32 | 4 | - | SENSOR-Register der linearen Belichtungszeit |
| Normal_Gain_REG | u32 | 4 | - | SENSOR-Register der linearen Verstärkung |
| HDR_Exp_L | float | 4 | - | Lange HDR3-Belichtungszeit |
| HDR_Gain_L | float | 4 | - | Verstärkung der langen HDR3-Belichtung |
| HDR_Exp_L_REG | u32 | 4 | - | SENSOR-Register der langen HDR3-Belichtungszeit |
| HDR_Gain_L_REG | u32 | 4 | - | SENSOR-Register der langen HDR3-Verstärkung |
| HDR_Exp_M | float | 4 | - | Mittlere HDR3-/lange HDR2-Belichtungszeit |
| HDR_Gain_M | float | 4 | - | Verstärkung der mittleren HDR3-/langen HDR2-Belichtung |
| HDR_Exp_M_REG | u32 | 4 | - | SENSOR-Register der mittleren HDR3-/langen HDR2-Belichtungszeit |
| HDR_Gain_M_REG | u32 | 4 | - | SENSOR-Register der mittleren HDR3-/langen HDR2-Belichtungszeit (Originalbeschreibung widerspricht dem Gain-Feldnamen; zu prüfen) |
| HDR_Exp_S | float | 4 | - | Kurze HDR3/HDR2-Belichtungszeit |
| HDR_Gain_S | float | 4 | - | Verstärkung der kurzen HDR3/HDR2-Belichtung |
| HDR_Exp_S_REG | u32 | 4 | - | SENSOR-Register der kurzen HDR3/HDR2-Belichtungszeit |
| HDR_Gain_S_REG | u32 | 4 | - | SENSOR-Register der kurzen HDR3/HDR2-Belichtungszeit (Originalbeschreibung widerspricht dem Gain-Feldnamen; zu prüfen) |
| AWB_Rgain | float | 4 | - | Weißabgleichsverstärkung |
| AWB_Bgain | float | 4 | - | Weißabgleichsverstärkung |

<!-- Source EN PDF p.433; unit 4649 -->

Definition des Registerformatblocks

<!-- Source EN PDF p.433; unit 4650 -->

![Technische Originalabbildung — PDF S.433](/docs/rockchip-isp30-development/assets/en-p433-X2215.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Standardwert | Beschreibung |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Bildnummer | u32 | 4 | - | Registerbasisadresse (wie in der Abbildung) |
| Basisadresse | u32 | 4 | - | Registerbasisadresse |
| Offsetadresse | u32 | 4 | - | Startoffsetadresse |
| Anzahl | u32 | 4 | - | Registeranzahl |

<!-- Source EN PDF p.433; unit 4651 -->

Definition des Registerblocks

<!-- Source EN PDF p.433; unit 4652 -->

![Technische Originalabbildung — PDF S.433](/docs/rockchip-isp30-development/assets/en-p433-X2216.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Beschreibung |
|---|---|---|---|
| Registerdaten | - | - | Registerdaten, 0xFF08/0xFF0a |

<!-- Source EN PDF p.433; unit 4653 -->

Definition des Plattforminformationsblocks

<!-- Source EN PDF p.433; unit 4654 -->

![Technische Originalabbildung — PDF S.433](/docs/rockchip-isp30-development/assets/en-p433-X2217.png)

Editierbare Transkription (die Originalabbildung enthält bereits chinesische Beschriftungen):

| Element | Typ | Länge (Byte) | Beschreibung |
|---|---|---|---|
| Chipmodell | string | 32 |  |
| ISP-Version | string | 32 |  |
| AIQ-Version | string | 32 |  |

<!-- Source EN PDF p.434; unit 4655 -->

#### 11.3.2 Erfassung von RAW-/YUV-Daten

<!-- Source EN PDF p.435; unit 4656 -->

## 12. Fehlercodes

<!-- Source EN PDF p.435; unit 4657 -->

| Fehlercode | Beschreibung |
|---|---|
| 0 | Erfolg |
| -1 | Fehlgeschlagen |
| -2 | Ungültiger Parameter |
| -3 | Nicht genügend Arbeitsspeicher |
| -4 | Dateioperation fehlgeschlagen |
| -5 | Fehler im Analysemodul |
| -6 | Fehler im ISP-Modul |
| -7 | Fehler im Sensortreiber |
| -8 | Fehler bei einer Thread-Operation |
| -9 | Fehler bei einer IOCTL-Operation |
| -10 | Timingfehler |
| -20 | Zeitüberschreitung |
| -21 | Außerhalb des gültigen Bereichs |
| -255 | Unbekannter Fehler |

<!-- Source EN PDF p.436; unit 4658 -->

## 13. Abkürzungen

<!-- Source EN PDF p.436; unit 4659 -->

| Abkürzung | Vollständige Bezeichnung |
|---|---|
| CIS | Camera Image Sensor – Kamerabildsensor |
| RkAiq | Rockchip Automatical Image Quality – automatische Rockchip-Bildqualität |
| ISP | Image Signal Process – Bildsignalverarbeitung |
| IQ Tuning | Image Quality Tuning – Abstimmung der Bildqualität |

{% endraw %}

