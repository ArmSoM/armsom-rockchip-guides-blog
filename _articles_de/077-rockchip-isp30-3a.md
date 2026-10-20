---
title: "Eigene 3A-Algorithmen für Rockchip ISP30: AE-, AWB- und AF-APIs und Statistiken"
description: "Vollständige RK3588-/Linux-5.10-Referenz zur Registrierung eigener 3A-Algorithmen, AE/AWB-Callbacks und Strukturen sowie AF-Statistiken, Filtern und Quellbeispielen."
translation_key: "077-rockchip-isp30-3a"
slug: "077-rockchip-isp30-3a"
lang: "de"
date: "2026-10-19"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "3A", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip ISP30 RK3588 3A AE AWB AF"
excerpt: "Vollständige Referenz für RK3588 und Linux 5.10: eigene 3A-Algorithmen, AE/AWB-Callbacks und Strukturen, AF-Statistiken und Filter sowie Quellbeispiele."
---

{% raw %}

# Eigene 3A-Algorithmen für Rockchip ISP30: AE-, AWB- und AF-APIs und Statistiken

Dieser Artikel bewahrt den vollständigen technischen Hauptteil (PDF-Seiten 5–46) der 46-seitigen englischen Quelle V1.1.0 mit vollständigen chinesischen, russischen und deutschen Übersetzungen. Ein entsprechendes chinesisches PDF wurde nicht bereitgestellt. Alle Sprachfassungen verwenden die 14 Originalabbildungen aus dem englischen PDF; darin bereits vorhandene chinesische Oberflächenbeschriftungen bleiben erhalten. Code, Kommentare, APIs, Parameter, Registerwerte und Beispielkonstanten bewahren den Quelltext; Bildunterschriften und Fließtext sind lokalisiert.

Der Produktumfang und die Betriebssystemunterstützung der Quelle werden nachfolgend wiedergegeben. Sie dokumentieren den Stand der Quelle und bestätigen nicht die Kompatibilität aller aktuellen Versionen. Dies ist eine Plattformreferenz für ArmSoM: Prüfen Sie tatsächliches Board, RK3588, Sensor/VCM, ISP30, SDK/BSP, AIQ und Kernelversion. Es wurde keine Hardwarevalidierung auf ArmSoM durchgeführt. Übertragen Sie die Beschreibung gemischter RK-/eigener Bibliotheken nicht auf ungeprüfte Versionen. Belichtung, Verstärkung, Fokus und Motorsteuerung können Bildaufnahme oder Hardwarezustand verändern; es wurden weder Code noch Gerätekonfigurationen oder Motorbewegungen ausgeführt.

**Hinweise zur Quelle:** Wiederholte Schnittstellenbeschreibungen und Überschriften, gemischte `uapi`-/`uapi2`-Namen, ein ISP32-Querverweis, zwei beschädigte Tabellenbeschreibungen und widersprüchliche Fensterparameter bleiben erhalten und sind dokumentiert. Der Code ist ein Quellbeispiel ohne Garantie der Kompilierbarkeit. Siehe die redaktionellen Prüfnotizen.

| SoC | Kernel |
|---|---|
| RK3588 | Linux 5.10 |

| SoC | BuildRoot | Debian | Yocto | Android |
|---|---|---|---|---|
| RK3588 | Y | N | N | Y |

Quellen- und Anpassungshinweise:
[Redaktionelle Prüfnotizen](/docs/rockchip-isp30-3a/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, block 0 -->

## 1 Überblick

<!-- Source EN PDF p.5, block 1 -->

Dieses Dokument erläutert vor allem die Implementierung von 3A-Bibliotheken und führt durch die Entwicklung eigener 3A-Algorithmusbibliotheken.

<!-- Source EN PDF p.5, block 2 -->

Die 3A-Algorithmusbibliothek hängt von AIQ ab. AIQ enthält bereits die 3A-Algorithmusbibliothek von RK, die standardmäßig aktiviert ist. Bei Bedarf können Benutzer nach diesem Dokument eigene 3A-Bibliotheken implementieren.

<!-- Source EN PDF p.5, block 3 -->

### 1.1 Entwurfsprinzip

<!-- Source EN PDF p.5, block 4 -->

Das grundlegende Entwurfsprinzip zeigt folgende Abbildung:

<!-- Source EN PDF p.5, block 5 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 5](/docs/rockchip-isp30-3a/assets/en-p05-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 5.*

<!-- Source EN PDF p.5, block 6 -->

Die 3A-Bibliothek wird bei der ISP-Bibliothek registriert. Die 3A-Bibliothek von RK ist bereits implizit registriert und muss vom Benutzer nicht ausdrücklich registriert werden.

<!-- Source EN PDF p.5, block 7 -->

Nach der Registrierung empfängt die ISP-Bibliothek die 3A-Statistiken vom Treiber und ruft die Schnittstelle der 3A-Bibliothek auf, um neue 3A-Parameter zu erhalten. Anschließend übergibt sie diese Parameter an den Treiber.

<!-- Source EN PDF p.5, block 8 -->

### 1.2 Dateiorganisation

<!-- Source EN PDF p.5, block 9 -->

Die Dateiorganisation zeigt folgende Abbildung:

<!-- Source EN PDF p.6, block 10 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 6](/docs/rockchip-isp30-3a/assets/en-p06-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 6.*

<!-- Source EN PDF p.6, block 11 -->

Die ISP-Firmware gliedert sich in die Anwendungsschicht librkaiq.so und die Treiberschicht mit ISP- und Peripherietreibern, einschließlich Sensor, VCM und Blitzlicht.

<!-- Source EN PDF p.6, block 12 -->

librkaiq.so enthält zahlreiche Algorithmusbibliotheken, etwa für 3A und HDR. Diese liegen als statische Bibliotheken vor und werden schließlich zu librkaiq.so gelinkt. Außer für die 3A-Bibliotheken librkaiq_ae/awb/af.a, deren Quellcode nicht bereitgestellt wird, ist der Quellcode der übrigen Basisbibliotheken offen.

<!-- Source EN PDF p.6, block 13 -->

Die Algorithmusbibliotheken sämtlicher vom Framework unterstützten Module können kundeneigene Algorithmen verwenden. Abgesehen von der anzupassenden 3A-Bibliothek können jedoch normalerweise die von RK bereitgestellten Standardbibliotheken eingesetzt werden.

<!-- Source EN PDF p.6, block 14 -->

### 1.3 Entwicklungsmodi

<!-- Source EN PDF p.6, block 15 -->

Die folgenden drei Entwicklungsmodi werden unterstützt:

<!-- Source EN PDF p.6, block 16 -->

Die 3A-Bibliothek verwendet die RK-Bibliothek. Dabei stehen die 3A-Bibliotheks-APIs von RK zur Verfügung, darunter rk_aiq_user_api2_ae.h, rk_aiq_user_api2_af.h und rk_aiq_user_api2_awb.h.

<!-- Source EN PDF p.6, block 17 -->

Die 3A-Bibliothek verwendet teilweise die RK-Bibliothek und teilweise eine eigene Bibliothek. Beispielsweise kann AE eine eigene Bibliothek verwenden, während AWB die RK-Bibliothek nutzt.

<!-- Source EN PDF p.6, block 18 -->

Eigene 3A-Bibliothek und RK-Bibliothek werden gleichzeitig verwendet. Läuft beispielsweise eine eigene AE-Bibliothek zusammen mit der RK-Bibliothek, wird zuerst RK AE und anschließend die eigene AE-Bibliothek ausgeführt. Deren Ergebnis überschreibt das RK-AE-Ergebnis. Dieser Modus vereinfacht die Entwicklung: Die eigene Bibliothek muss nicht alle vom AIQ-Framework benötigten Ergebnisse liefern; einen Teil kann RK AE bereitstellen.

<!-- Source EN PDF p.7, block 19 -->

### 1.4 Softwareabläufe

<!-- Source EN PDF p.7, block 20 -->

#### 1.4.1 Grundablauf

<!-- Source EN PDF p.7, block 21 -->

Der RK-3A-Algorithmus muss nicht ausdrücklich registriert werden, da dies implizit im AIQ-Framework geschieht. Die Registrierung eines eigenen 3A-Algorithmus wird am Beispiel von AE durch folgenden Pseudocode veranschaulicht:

<!-- Source EN PDF p.7, block 22 -->

```text
// Initialize the usage scenario, not required, defaults to normal, day, which is used to select scene parameters in the JSON IQ file
if (work_mode == RK_AIQ_WORKING_MODE_NORMAL)
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "normal",
"day");
  else
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "hdr", "day");
// Depending on whether the usage pattern is surround view or single camera, initialize Group Ctx or AIQ ctx
   if (!group_mode)
        ctx->aiq_ctx = rk_aiq_uapi2_sysctl_init(sns_entity_name, ctx->iqpath,
NULL, NULL);
  else {
       rk_aiq_camgroup_instance_cfg_t camgroup_cfg;
       memset(&camgroup_cfg, 0, sizeof(camgroup_cfg));
       camgroup_cfg.sns_num = 1;
       camgroup_cfg.sns_num++;
       camgroup_cfg.sns_ent_nm_array[0] = sns_entity_name;
       camgroup_cfg.sns_ent_nm_array[1] = sns_entity_name2;
       camgroup_cfg.config_file_dir = ctx->iqpath;
       camgroup_cfg.overlap_map_file = "srcOverlapMap.bin";
       ctx->camgroup_ctx = rk_aiq_uapi2_camgroup_create(&camgroup_cfg);
  }
// If you need to register a custom AE algorithm, register a custom AE callback
  rk_aiq_customeAe_cbs_t cbs = {
                           .pfn_ae_init = custom_ae_init,
                           .pfn_ae_run = custom_ae_run,
                           .pfn_ae_ctrl = custom_ae_ctrl,
                           .pfn_ae_exit = custom_ae_exit,
                       };
  rk_aiq_uapi2_customAE_register((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
&cbs);
// If you need to run a third-party AE algorithm, enable the custom AE algorithm. Third-party AE library registration interface, single camera and surround view shared.
//In the current AIQ version, both the default RK algorithm and the third-party algorithm will run, and if necessary, you can call rk_aiq_uapi2_sysctl_enableAxlib to force off RK AE.
  rk_aiq_uapi2_customAE_enable((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
true);
// Prepare the ISP pipeline and configure initialization parameters such as ISP and Sensor
// If necessary, you can call the module API before prepare to modify the module initialization parameters, otherwise the initialization parameters are specified by the IQ file, or are specified by hard code in AIQ, or the chip reset value
 if (!group_mode) {
      rk_aiq_uapi2_sysctl_prepare(ctx->aiq_ctx, ctx->width, ctx->height,
work_mode);
      rk_aiq_uapi2_sysctl_start(ctx->aiq_ctx );
 } else {
      rk_aiq_uapi2_camgroup_prepare(ctx->camgroup_ctx, work_mode);
      ret = rk_aiq_uapi2_camgroup_start(ctx->camgroup_ctx);
 }
// Turn on the VI data flow and note that no AIQ library interfaces are called in this section.
start_capturing(ctx);
......
// AIQ internal thread loop work: obtain 3A statistics from the driver, call each algorithm library to calculate new ISP parameters, sensor parameters, etc., and issue new parameters to ISP drivers and sensor drivers.
// This procedure calls the API to set parameters for each algorithm module
......
// Stop the data flow first on exit
stop_capturing(ctx);
// Stop AIQ ctx or Group ctx
 if (!group_mode)
       rk_aiq_uapi2_sysctl_stop(ctx->aiq_ctx, false);
else
       rk_aiq_uapi2_camgroup_stop(ctx->camgroup_ctx);
// Anti-register third-party AEs
 rk_aiq_uapi2_customAE_unRegister(ctx->aiq_ctx);
// Deinitialize AIQ ctx or Group ctx
 if (!group_mode)
        rk_aiq_uapi2_sysctl_deinit(ctx->aiq_ctx);
else
       rk_aiq_uapi2_camgroup_destroy(ctx->camgroup_ctx);
```

<!-- Source EN PDF p.8, block 24 -->

#### 1.4.2 Interne Abläufe

<!-- Source EN PDF p.8, block 25 -->

Die internen Abläufe von AIQ zeigt folgende Abbildung:

<!-- Source EN PDF p.9, block 26 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 9](/docs/rockchip-isp30-3a/assets/en-p09-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 9.*

<!-- Source EN PDF p.9, block 27 -->

Thread zum Abrufen der Statistiken: Er liest fortlaufend 3A-Statistiken vom ISP-Treiber und sendet sie an den 3A-Berechnungsthread.

<!-- Source EN PDF p.9, block 28 -->

3A-Berechnungsthread: Nach Empfang der Statistiken ruft er die Modulalgorithmen einschließlich Drittanbieter-Callbacks auf, berechnet neue Parameter und sendet diese an den Thread zur ISP-Parametereinstellung und den SOF-Thread.

<!-- Source EN PDF p.9, block 30 -->

Thread zur ISP-Parametereinstellung: Nach Empfang einer neuen Einstellungsanforderung übermittelt er die Parameter zum geeigneten Zeitpunkt an den ISP-Treiber.

<!-- Source EN PDF p.9, block 31 -->

SOF-Thread: Dieser Thread reagiert auf das Frame-Start-Ereignis des Sensors. Er empfängt neue Belichtungseinstellungen und übergibt die neuen Belichtungsparameter aus der Warteschlange an den Sensortreiber.

<!-- Source EN PDF p.10, block 32 -->

## 2 Entwicklerleitfaden

<!-- Source EN PDF p.10, block 33 -->

### 2.1 AE-Algorithmus registrieren

<!-- Source EN PDF p.10, block 34 -->

Der Registrierungsablauf umfasst Registrierung, Aktivierung und Abmeldung des Algorithmus. Die Registrierung erfolgt durch Aufruf von rk_aiq_uapi_customAE_register, die Aktivierung über rk_aiq_uapi_customAE_enable und die Abmeldung durch Aufruf von rk_aiq_uapi_customAE_unRegister.

<!-- Source EN PDF p.10, block 35 -->

#### 2.1.1 rk_aiq_uapi2_customAE_register

<!-- Source EN PDF p.10, block 36 -->

【Beschreibung】 AE-Algorithmusbibliothek registrieren

<!-- Source EN PDF p.10, block 37 -->

【Syntax】

<!-- Source EN PDF p.10, block 38 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAe_cbs_t* cbs)
```

<!-- Source EN PDF p.10, block 39 -->

【Parameter】

<!-- Source EN PDF p.10, block 40 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |
| cbs | Callback-Funktionszeiger |  |

<!-- Source EN PDF p.10, block 41 -->

【Rückgabewert】

<!-- Source EN PDF p.10, block 42 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.11, block 43 -->

#### 2.1.2 rk_aiq_uapi2_customAE_enable

<!-- Source EN PDF p.11, block 44 -->

【Beschreibung】 AE-Algorithmusbibliothek registrieren

<!-- Source EN PDF p.11, block 45 -->

【Syntax】

<!-- Source EN PDF p.11, block 46 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.11, block 47 -->

【Parameter】

<!-- Source EN PDF p.11, block 48 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |
| enable | Aktivierungsbit des AE-Algorithmus | Eingabe |

<!-- Source EN PDF p.11, block 49 -->

【Rückgabewert】

<!-- Source EN PDF p.11, block 50 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.11, block 51 -->

#### 2.1.3 rk_aiq_uapi2_customAE_unRegister

<!-- Source EN PDF p.11, block 52 -->

【Beschreibung】 AE-Algorithmusbibliothek registrieren

<!-- Source EN PDF p.11, block 53 -->

【Syntax】

<!-- Source EN PDF p.11, block 54 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.11, block 55 -->

【Parameter】

<!-- Source EN PDF p.11, block 56 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |

<!-- Source EN PDF p.11, block 57 -->

【Rückgabewert】

<!-- Source EN PDF p.12, block 58 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.12, block 59 -->

#### 2.1.4 Callback-Funktionen und Datentypen

<!-- Source EN PDF p.12, block 60 -->

In der selbst entwickelten AE-Bibliothek müssen folgende Callback-Funktionen implementiert werden:

<!-- Source EN PDF p.12, block 61 -->

```text
rk_aiq_customeAe_cbs_t cbs = {
.pfn_ae_init = custom_ae_init,
.pfn_ae_run = custom_ae_run,
.pfn_ae_ctrl = custom_ae_ctrl,
.pfn_ae_exit = custom_ae_exit,
};
```

<!-- Source EN PDF p.12, block 62 -->

| Mitgliedsname | Beschreibung |
|---|---|
| pfn_ae_init | Funktionszeiger des Callbacks zur Initialisierung von AE |
| pfn_ae_run | Funktionszeiger des Callbacks zur Ausführung von AE |
| pfn_ae_ctrl | Zeiger auf den Callback zur Steuerung des internen AE-Zustands; dieser Parameter ist<br>derzeit nicht wirksam. |
| pfn_ae_exit | Funktionszeiger des Callbacks zur Freigabe von AE |

<!-- Source EN PDF p.12, block 63 -->

##### 2.1.4.1 custom_ae_init

<!-- Source EN PDF p.12, block 64 -->

【Beschreibung】 AE-Algorithmusbibliothek initialisieren

<!-- Source EN PDF p.12, block 65 -->

【Syntax】

<!-- Source EN PDF p.12, block 66 -->

```text
int32_t custom_ae_init(void* ctx);
```

<!-- Source EN PDF p.12, block 67 -->

【Parameter】

<!-- Source EN PDF p.12, block 68 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |

<!-- Source EN PDF p.12, block 69 -->

【Rückgabewert】

<!-- Source EN PDF p.13, block 70 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.13, block 71 -->

##### 2.1.4.2 custom_ae_run

<!-- Source EN PDF p.13, block 72 -->

【Beschreibung】 AE-Algorithmusbibliothek ausführen, um Belichtungszeit und Verstärkung des Sensors sowie die digitale ISP-Verstärkung zu berechnen und die Hardwarekonfigurationsparameter zu aktualisieren

<!-- Source EN PDF p.13, block 73 -->

【Syntax】

<!-- Source EN PDF p.13, block 74 -->

```text
int32_t custom_ae_run(void* ctx, const rk_aiq_customAe_stats_t* pstAeInfo,
                      rk_aiq_customeAe_results_t* pstAeResult);
```

<!-- Source EN PDF p.13, block 75 -->

【Parameter】

<!-- Source EN PDF p.13, block 76 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |
| pstAeInfo | Eingabezeiger auf Daten mit AE-Hardwarestatistiken und den dazu synchronisierten<br>Belichtungsinformationen; Eingabe |  |
| pstAeResult | Ausgabezeiger auf das Algorithmusergebnis mit Sensor-Belichtungsparametern<br>und aktualisierten Hardwarekonfigurationsparametern | Ausgabe |

<!-- Source EN PDF p.13, block 77 -->

【Rückgabewert】

<!-- Source EN PDF p.13, block 78 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.13, block 79 -->

##### 2.1.4.3 custom_ae_ctrl

<!-- Source EN PDF p.13, block 80 -->

【Beschreibung】 Internen Zustand der Algorithmusbibliothek ändern; derzeit nicht verwendbar

<!-- Source EN PDF p.13, block 81 -->

【Syntax】

<!-- Source EN PDF p.13, block 82 -->

```text
int32_t custom_ae_ctrl(void* ctx, uint32_t u32Cmd, void *pValue);
```

<!-- Source EN PDF p.13, block 83 -->

【Parameter】

<!-- Source EN PDF p.14, block 84 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |

<!-- Source EN PDF p.14, block 85 -->

【Rückgabewert】

<!-- Source EN PDF p.14, block 86 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.14, block 87 -->

##### 2.1.4.4 custom_ae_exit

<!-- Source EN PDF p.14, block 88 -->

【Beschreibung】 AE-Algorithmusbibliothek abmelden

<!-- Source EN PDF p.14, block 89 -->

【Syntax】

<!-- Source EN PDF p.14, block 90 -->

```text
int32_t custom_ae_exit(void* ctx)；
```

<!-- Source EN PDF p.14, block 91 -->

【Parameter】

<!-- Source EN PDF p.14, block 92 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger für Einzelkamera- und Surround-View-Anwendungen | Eingabe |

<!-- Source EN PDF p.14, block 93 -->

【Rückgabewert】

<!-- Source EN PDF p.14, block 94 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.14, block 95 -->

#### 2.1.5 Eingabedatenparameter

<!-- Source EN PDF p.14, block 96 -->

【Beschreibung】

<!-- Source EN PDF p.14, block 97 -->

Die Eingabedatenparameter einer Drittanbieter-AE umfassen Bildhelligkeitsstatistiken und zugehörige Belichtungsparameter. Sie unterstützen Einzelkamera- und Surround-View-Anwendungen. 【Definition】

<!-- Source EN PDF p.15, block 98 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_customAe_stats_s
{
    //hw stats
    Aec_Stat_Res_t rawae_stat[RK_AIQ_MAX_HDR_FRAME]; // before awb gain
    Aec_Stat_Res_t extra; // after awb gain, lsc, TMO
    //exposure
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    struct rk_aiq_customAe_stats_s* next; // for surround view(multiple cams)
} rk_aiq_customAe_stats_t;
```

<!-- Source EN PDF p.15, block 99 -->

【Mitglieder】

<!-- Source EN PDF p.15, block 100 -->

| Mitgliedsname | Beschreibung |
|---|---|
| rawae_stat[RK_AIQ_MAX_HDR_FRAME] | Vorgeschaltete Hardwarestatistiken auf Basis von RAW-Bildern; bis zu<br>3 RAW-Bilder können erfasst werden. Im linearen Belichtungsmodus ist nur rawae_stat [0] gültig.<br>Im HDR-Belichtungsmodus stehen rawae_stat [0-2] für die Hardwarestatistiken kurzer, mittlerer und langer Bilder. |
| extra | Nachgeschaltete Hardwarestatistiken auf Basis von RAW-Bildern;<br>im HDR-Modus Statistiken der zusammengeführten Bilder. |
| linear_exp | Belichtungsparameter im linearen Modus, synchron zu den Hardwarestatistiken |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | Mit den Hardwarestatistiken synchronisierte HDR-Belichtungsparameter;<br>0~2 stehen für kurze, mittlere beziehungsweise lange Bilder. |
| next | Nur für Surround-View-Mehrkamera-Anwendungen gültig. Der Zeiger verweist auf<br>die Eingabedatenparameter der nächsten Kamera; die entsprechenden Parametermitglieder sind bei allen Kameras gleich. |

<!-- Source EN PDF p.15, block 101 -->

【Beschreibung】

<!-- Source EN PDF p.15, block 102 -->

Die Eingabedatenparameter umfassen zwei Arten von Parametern: die Hardwarestatistiken des Bildes und die dazugehörigen Belichtungsparameter.

<!-- Source EN PDF p.15, block 103 -->

Die Eingabedatenparameter unterstützen Einzelkamera- und Surround-View-Mehrkamera-Anwendungen. Über den Zeiger next lassen sich die Eingabedaten mehrerer Kameras abrufen.

<!-- Source EN PDF p.15, block 104 -->

Der Datentyp der Bildhardwarestatistiken ist Aec_Stat_Res_t, derjenige der Belichtungsinformationen RkAiqExpParamComb_t. Einzelheiten enthält Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.15, block 105 -->

RK_AIQ_MAX_HDR_FRAME gibt an, dass RK HDR mit bis zu 3 Bildern unterstützt.

<!-- Source EN PDF p.16, block 106 -->

#### 2.1.6 Ausgabeparameter des Algorithmusergebnisses

<!-- Source EN PDF p.16, block 107 -->

【Beschreibung】

<!-- Source EN PDF p.16, block 108 -->

Die Ausgabeparameter einer Drittanbieter-AE umfassen Belichtungsparameter, Hardwareparameter usw. und unterstützen Einzelkamera- und Surround-View-Anwendungen.

<!-- Source EN PDF p.16, block 109 -->

【Definition】

<!-- Source EN PDF p.16, block 110 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_i2c_data_s {
    bool bValid;
    unsigned int nNumRegs;
    unsigned int* pRegAddr;
    unsigned int* pRegValue;
    unsigned int* pDelayFrames;
} rk_aiq_i2c_data_t;
typedef struct rk_aiq_customeAe_results_singel_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_single_t;
typedef struct rk_aiq_customeAe_results_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    RkAiqIrisParamComb_t Iris;
    uint32_t frame_length_lines;
    bool is_longfrm_mode;
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_t;
```

<!-- Source EN PDF p.16, block 111 -->

【Mitglieder】

<!-- Source EN PDF p.17, block 112 -->

| Mitglied | Untergeordnete Mitglieder | Beschreibung |
|---|---|---|
| linear_exp | exp_real_params<br>exp_sensor_params | Belichtungsparameter im linearen Modus mit tatsächlichem Belichtungswert<br>(exp_real_params) und Registerwert im RK-Format (exp_sensor_params) |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | exp_real_params<br>exp_sensor_params | HDR-Belichtungsparameter mit tatsächlichem Belichtungswert (exp_real_params)<br>und Registerwert im RK-Format (exp_sensor_params). 0~2 bezeichnen die Belichtungsparameter<br>kurzer, mittlerer und langer Bilder. Bei HDR2-Zusammenführung sind die Elemente 0 und 1 gültig,<br>bei HDR3 die Elemente 0-2. |
| exp_i2c_params | bValid nNumRegs<br>pRegAddr<br>pRegValue<br>pDelayFrames | Bei bValid=true werden die I2C-Registerwerte über exp_i2c_params gesetzt.<br>Bei bValid=false werden die Registerwertparameter im RK-Format aus linear_exp<br>beziehungsweise hdr_exp zum Setzen der Register verwendet. |
| frame_length_lines |  | VTS-Wert des Sensors, der mit der Bildrateneinstellung zusammenhängt |
| is_longfrm_mode |  | Aktivierung des Langbildmodus: true aktiviert, false deaktiviert ihn.<br>Dieser Parameter ist nur im HDR-Modus gültig. |
| Iris | PIris DCIris | Blendeneinstellungen, einschließlich P- und DC-Blendenparametern |
| meas_win | h_offs<br>v_offs<br>h_size<br>v_size | Bereich des Hardwarestatistikfensters. h/v_offs bezeichnet den horizontalen/vertikalen<br>Versatz der linken oberen Fensterecke gegenüber der linken oberen Ecke des lichtempfindlichen Bereichs.<br>h/v_size bezeichnet die horizontale beziehungsweise vertikale Fenstergröße. |
| meas_weight |  | Gewichtungsparameter der Hardwarestatistik: 15X15 Gewichte mit Wertebereich 0~32 |
| next |  | Außerhalb von Surround View muss der Zeiger leer sein. Sollen in einer Surround-View-Anwendung<br>mehrere Kameras dasselbe Algorithmusergebnis verwenden, bleibt er ebenfalls leer: Nur die Mitglieder<br>in rk_aiq_customeAe_results_t werden gesetzt, und alle Kameras verwenden dieses Ergebnis.<br>Benötigen die Kameras unterschiedliche Ergebnisse, muss Speicher für den Zeiger next reserviert<br>und das Algorithmusergebnis der nächsten Kamera ergänzt werden. |

<!-- Source EN PDF p.18, block 114 -->

【Hinweise】

<!-- Source EN PDF p.18, block 115 -->

Die Algorithmusergebnisse unterstützen Einzelkamera- und Surround-View-Mehrkamera-Anwendungen. Bei Surround View können gemeinsame oder mehrere unterschiedliche Algorithmusergebnisse verwendet werden.

<!-- Source EN PDF p.18, block 116 -->

meas_win beschreibt den Fensterbereich der AE-Hardwarestatistik. Hardwarestatistiken wie Kachelhelligkeit und Histogramm werden auf Basis dieses Bereichs ermittelt. Bei HDR-Mehrfachbelichtung ist das Statistikfenster standardmäßig für alle Bilder gleich.

<!-- Source EN PDF p.18, block 117 -->

meas_weight ist der für gewichtete Histogrammstatistiken benötigte Gewichtungsparameter. Er entspricht im Allgemeinen der Softwaregewichtung zur Berechnung des gewichteten Mittelwerts der Kachelhelligkeit.

<!-- Source EN PDF p.18, block 118 -->

Beim Einstellen der Belichtung müssen tatsächlicher Belichtungswert und zugehöriger Registerwert konfiguriert werden. Der tatsächliche Wert umfasst Belichtungszeit in Sekunden, Belichtungsverstärkung als Faktor und DCG-Zustand (0:LCG, 1:HCG) für andere Algorithmusmodule. Der Belichtungsregisterwert wird an den Sensor übergeben und unterstützt RK- sowie Drittanbieterformate.

<!-- Source EN PDF p.18, block 119 -->

Für Belichtungsregisterwerte werden RK- und Drittanbieterformate unterstützt. Registerwerte im RK-Format muss der Kunde nicht setzen; sie werden intern aus dem tatsächlichen Belichtungswert umgerechnet. Dafür muss bValid in exp_i2c_params false sein. Drittanbieterformate erfordern das Setzen der benötigten Registerwerte und Adressen durch den Benutzer sowie bValid=true in exp_i2c_params.

<!-- Source EN PDF p.18, block 120 -->

Sollen bei Surround View alle Kameras dieselben Belichtungs- und Hardwarewerte verwenden, setzen Sie nur die Parameter in rk_aiq_customeAe_results_t; next bleibt leer. Benötigt jede Kamera andere Werte, setzen Sie die Ergebnisse der Reihe nach und reservieren Sie Speicher, sodass next auf das Ergebnis der nächsten Kamera verweist. Beachten Sie die Unterschiede zwischen rk_aiq_customeAe_results_t und rk_aiq_customeAe_results_single_t: Erstere Struktur enthält zusätzliche Ergebnisparameter, die gemeinsam gelten und standardmäßig für alle Kameras auf denselben Wert gesetzt werden.

<!-- Source EN PDF p.19, block 121 -->

Der Datentyp der Bildhardwarestatistik ist Aec_Stat_Res_t, derjenige der RK-Belichtungsinformationen RkAiqExpParamComb_t und derjenige der RK-Blendenparameter RkAiqIrisParamComb_t. Einzelheiten enthält Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.19, block 122 -->

### 2.2 AWB-Algorithmus registrieren

<!-- Source EN PDF p.19, block 123 -->

Der RK-AWB-Algorithmus implementiert die Registrierungsfunktion rk_aiq_uapi_customAWB_register. Der Benutzer registriert damit seinen eigenen AWB-Algorithmus beim ISP. Das Beispiel entspricht der Registrierung der AE-Algorithmusbibliothek. Aktiviert wird der eigene AWB-Algorithmus über rk_aiq_uapi_customAWB_enable.

<!-- Source EN PDF p.19, block 124 -->

Hinweis: Für eine reibungslose Portierung wird empfohlen, Folgendes zu lesen:

<!-- Source EN PDF p.19, block 125 -->

(1) Folgende Inhalte aus „Rockchip_Color_Optimization_Guide“:

<!-- Source EN PDF p.19, block 126 -->

(a) Abschnitt „2 AWB/2.1 Function Description“ zur Funktionsbeschreibung sowie das AWB-Ablaufdiagramm.

<!-- Source EN PDF p.19, block 127 -->

(b) AWB-Ablaufdiagramm zur Weißpunkterkennung im Abschnitt „2 AWB/2.2 White Spot Detection Process for Key Parameters/Hardware“.

<!-- Source EN PDF p.19, block 128 -->

(2) Abschnitt „Statistics / Data Types / rk_aiq_isp_awb_stats2_v3x_t“ in Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.19, block 129 -->

#### 2.2.1 API

<!-- Source EN PDF p.19, block 130 -->

##### 2.2.1.1 rk_aiq_uapi_customAWB_register

<!-- Source EN PDF p.19, block 131 -->

【Beschreibung】 Eigenen AWB-Algorithmus registrieren.

<!-- Source EN PDF p.19, block 132 -->

【Syntax】

<!-- Source EN PDF p.19, block 133 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAwb_cbs_t* cbs);
```

<!-- Source EN PDF p.19, block 134 -->

【Parameter】

<!-- Source EN PDF p.19, block 135 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| cbs | Beim ISP registrierter Callback des eigenen AWB-Algorithmus;<br>siehe die nachfolgende Strukturbeschreibung rk_aiq_customeAwb_cbs_t. Eingabe |  |

<!-- Source EN PDF p.19, block 136 -->

【Rückgabewert】

<!-- Source EN PDF p.20, block 137 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.20, block 138 -->

【Hinweis】

<!-- Source EN PDF p.20, block 139 -->

Zuerst muss rk_aiq_uapi_sysctl_init aufgerufen werden, um den AIQ-Kontextzeiger ctx zu initialisieren.

<!-- Source EN PDF p.20, block 140 -->

【Voraussetzungen】

<!-- Source EN PDF p.20, block 141 -->

Headerdatei: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 142 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.20, block 143 -->

##### 2.2.1.2 rk_aiq_uapi_customAWB_enable

<!-- Source EN PDF p.20, block 144 -->

【Beschreibung】 Eigenen AWB-Algorithmus aktivieren.

<!-- Source EN PDF p.20, block 145 -->

【Syntax】

<!-- Source EN PDF p.20, block 146 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.20, block 147 -->

【Parameter】

<!-- Source EN PDF p.20, block 148 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |
| enable | Aktivierungsschalter für eigene AWB:<br>Wert: true / false; Standard: false | Eingabe |

<!-- Source EN PDF p.20, block 149 -->

【Rückgabewert】

<!-- Source EN PDF p.20, block 150 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.20, block 151 -->

【Hinweis】

<!-- Source EN PDF p.20, block 152 -->

Nach abgeschlossener Registrierung des eigenen AWB-Algorithmus durch rk_aiq_uapi_customAWB_register aufrufen.

<!-- Source EN PDF p.20, block 153 -->

【Voraussetzungen】

<!-- Source EN PDF p.20, block 154 -->

Headerdatei: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 155 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.21, block 156 -->

##### 2.2.1.3 rk_aiq_uapi_customAWB_unRegister

<!-- Source EN PDF p.21, block 157 -->

【Beschreibung】 Eigenen AWB-Algorithmus abmelden.

<!-- Source EN PDF p.21, block 158 -->

【Syntax】

<!-- Source EN PDF p.21, block 159 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.21, block 160 -->

【Parameter】

<!-- Source EN PDF p.21, block 161 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| ctx | AIQ-Kontextzeiger | Eingabe |

<!-- Source EN PDF p.21, block 162 -->

【Rückgabewert】

<!-- Source EN PDF p.21, block 163 -->

| Rückgabewert | Beschreibung |
|---|---|
| 0 | Erfolgreich |
| Ungleich 0 | Fehler; siehe Fehlercodetabelle |

<!-- Source EN PDF p.21, block 164 -->

【Hinweis】

<!-- Source EN PDF p.21, block 165 -->

Nach abgeschlossener Registrierung des eigenen AWB-Algorithmus durch rk_aiq_uapi_customAWB_register aufrufen.

<!-- Source EN PDF p.21, block 166 -->

【Voraussetzungen】

<!-- Source EN PDF p.21, block 167 -->

Headerdatei: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.21, block 168 -->

Bibliotheksdatei: librkaiq.so

<!-- Source EN PDF p.21, block 169 -->

#### 2.2.2 Datentypen

<!-- Source EN PDF p.21, block 170 -->

##### 2.2.2.1 Bei der ISP-Bibliothek registrierter Callback

<!-- Source EN PDF p.21, block 171 -->

###### 2.2.2.1.1 rk_aiq_customeAwb_cbs_t

<!-- Source EN PDF p.21, block 172 -->

【Beschreibung】 Definiert die Callback-Funktionen, die der eigene AWB-Algorithmus bei der ISP-Bibliothek registriert.

<!-- Source EN PDF p.21, block 173 -->

【Definition】

<!-- Source EN PDF p.22, block 174 -->

```text
typedef struct rk_aiq_customeAwb_cbs_s
{
    int32_t (*pfn_awb_init)(void* ctx);
    int32_t (*pfn_awb_run)(void* ctx, const rk_aiq_customAwb_stats_t* pstAwbInfo,
rk_aiq_customeAwb_results_t* pstAwbResult);
    int32_t (*pfn_awb_run)(void* ctx, uint32_t u32Cmd, void *pValue);
    int32_t (*pfn_awb_exit)(void* ctx);
} rk_aiq_customeAwb_cbs_t;
```

<!-- Source EN PDF p.22, block 175 -->

【Mitglied】

<!-- Source EN PDF p.22, block 176 -->

| Mitgliedsname | Beschreibung |
|---|---|
| pfn_awb_init | Initialisierung; der erste Initialisierungsaufruf erfolgt durch AwbDemoPrepare. |
| pfn_awb_ctrl | Funktionszeiger zur Steuerung des internen Zustands der eigenen AWB;<br>derzeit nicht unterstützt. |
| pfn_awb_run | Funktionszeiger zur Ausführung der eigenen AWB; siehe die Beschreibungen von<br>rk_aiq_customAwb_stats_t und rk_aiq_customeAwb_results_t. Laut Quelle bezeichnet<br>pstAwbResult==nullptr die Initialisierung, bei der pstAwbResult konfiguriert wird.<br>Andernfalls ist die Berechnung von pstAwbResult aus den Statistiken pstAwbInfo zu implementieren.<br>Bei Surround View mit identischen Einstellungen für alle Kameras gilt derselbe Ablauf.<br>Andernfalls müssen pstAwbResult->next für die erste Kamera, pstAwbResult->next->next<br>für die zweite Kamera usw. gesetzt werden. Hinweis: pstAwbResult gehört zu Kamera 0. |
| pfn_awb_exit | Reservierten Speicher usw. freigeben; Aufruf durch AwbDemoDestroyCtx. |

<!-- Source EN PDF p.22, block 177 -->

【Hinweis】

<!-- Source EN PDF p.22, block 178 -->

Die obigen Callbacks müssen in der eigenen AWB-Bibliothek implementiert werden.

<!-- Source EN PDF p.22, block 179 -->

Für die Implementierung von pfn_awb_run dient der Pseudocode in custom_awb_run in third_party_awb_algo.cpp als Referenz.

<!-- Source EN PDF p.22, block 180 -->

##### 2.2.2.2 Statistiken

<!-- Source EN PDF p.22, block 181 -->

###### 2.2.2.2.1 rk_aiq_customAwb_stats_t

<!-- Source EN PDF p.22, block 182 -->

【Beschreibung】 Definiert die Weißabgleich-Hardwarestatistiken, die der eigene AWB-Algorithmus erhält.

<!-- Source EN PDF p.22, block 183 -->

【Definition】

<!-- Source EN PDF p.23, block 184 -->

```text
typedef struct rk_aiq_customAwb_stats_s
{
    rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    rk_aiq_awb_stat_blk_res_v201_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
    rk_aiq_awb_stat_wp_res_light_v201_t multiwindowLightResult[4];
    rk_aiq_awb_stat_wp_res_v201_t
excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
    unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
    struct rk_aiq_customAwb_stats_s* next;
} rk_aiq_customAwb_stats_t;
```

<!-- Source EN PDF p.23, block 185 -->

【Mitglied】

<!-- Source EN PDF p.23, block 186 -->

| Mitgliedsname | Beschreibung |
|---|---|
| light | Weißpunktstatistiken verschiedener Lichtquellen im Hauptfenster;<br>höchstens RK_AIQ_AWB_MAX_WHITEREGIONS_NUM Lichtquellen. |
| WpNo2 | Anzahl der Weißpunkte im Schnittbereich von XY- und UV-Domäne<br>für verschiedene Lichtquellen im Hauptfenster, ohne Nachkommastellen. |
| blockResult | RGB-Akkumulation je Block; das Bild ist gleichmäßig in insgesamt<br>15x15 (RK_AIQ_AWB_GRID_NUM_TOTAL) Blöcke aufgeteilt. |
| multiwindowLightResult | Weißpunktstatistiken verschiedener Lichtquellen in mehreren Unterfenstern.<br>Nur die ersten 4 Lichtquellen werden erfasst; durch Zeitmultiplex können alle erfasst werden.<br>Höchstens 4 Unterfenster. |
| excWpRangeResult | Statistiken der Punkte innerhalb von excludeWpRange.<br>Nur die ersten vier excludeWpRange-Bereiche werden erfasst; höchstens 4 Bereiche. |
| WpNoHist | Anzahl der Weißpunkte je Klasse des Weißpunkthistogramms, ohne Nachkommastellen.<br>Ob der XY-Rahmen oder der Rahmen in XY erfasst wird, bestimmt xyRangeTypeForWpHist.<br>Die mehrdeutige Beschreibung der Quelle bleibt erhalten. |
| next | Nur bei Surround-View-Mehrkamera-Anwendungen relevant; verweist auf<br>die Weißabgleich-Hardwarestatistiken der nächsten Kamera. |

<!-- Source EN PDF p.23, block 187 -->

【Hinweis】

<!-- Source EN PDF p.23, block 188 -->

Einzelheiten zu den Mitgliedern stehen in „Statistics/Data Types“ von Rockchip_Development_Guide_ISP30 unter der Definition der Strukturmitglieder von rk_aiq_isp_awb_stats2_v3x_t.

<!-- Source EN PDF p.24, block 189 -->

##### 2.2.2.3 Berechnungsergebnis

<!-- Source EN PDF p.24, block 190 -->

###### 2.2.2.3.1 rk_aiq_customeAwb_results_t

<!-- Source EN PDF p.24, block 191 -->

【Beschreibung】 Definiert Konfigurationsparameter und Berechnungsergebnisse des eigenen AWB-Algorithmus.

<!-- Source EN PDF p.24, block 192 -->

【Definition】

<!-- Source EN PDF p.24, block 193 -->

```text
typedef struct rk_aiq_customeAwb_results_s
{
    bool IsConverged; true: converged; false: not converged
    rk_aiq_wb_gain_t awb_gain_algo;
    float awb_smooth_factor;
    rk_aiq_customAwb_hw_cfg_t awbHwConfig;
    rk_aiq_customeAwb_single_results_t *next;//defalut vaue is nullptr,which means all cameras with the same cfg;
} rk_aiq_customeAwb_results_t;
```

<!-- Source EN PDF p.24, block 194 -->

【Mitglied】

<!-- Source EN PDF p.25, block 195 -->

| Mitgliedsname | Beschreibung |
|---|---|
| IsConverged | Gibt an, ob der aktuelle AWBgain konvergiert ist:<br>true konvergiert, false nicht konvergiert; Standard: false.<br>Muss konfiguriert werden. |
| awb_gain_algo | Vom eigenen AWB-Algorithmus ermittelte Verstärkungen der Farbkanäle R, GR, GB, B.<br>Standard: {1.0, 1.0, 1.0, 1.0}, keine Weißabgleichkorrektur.<br>Muss konfiguriert werden. |
| awb_smooth_factor | Bildübergreifender Glättungsfaktor für CCM und LSC.<br>Größere Werte verringern das Gewicht des aktuellen Bildes.<br>Wertebereich: [0,1]; Standard: 0.5. Konfiguration kann entfallen. |
| awbHwConfig | Hardwarekonfigurationsparameter des eigenen AWB-Algorithmus.<br>Die meisten Parameter sowie modulspezifische Parameter müssen korrekt gesetzt werden.<br>Andere besitzen bereits Standardwerte und müssen nicht aktualisiert werden.<br>Einzelheiten siehe rk_aiq_customAwb_hw_cfg_t weiter unten. |
| next | Außerhalb von Surround View nicht relevant. Sollen mehrere Kameras dasselbe<br>Algorithmusergebnis verwenden, bleibt der Zeiger leer und alle verwenden das Ergebnis<br>in rk_aiq_customeAwb_results_t. Werden unterschiedliche Mitgliedergebnisse von<br>rk_aiq_customeAwb_single_results_t benötigt, muss Speicher für next reserviert und das<br>Ergebnis der nächsten Kamera ergänzt werden. Die entsprechenden Mitglieder von next<br>ersetzen dann diejenigen in rk_aiq_customeAwb_results_t.<br>Die Definition von rk_aiq_customeAwb_single_results_t folgt unten. |

<!-- Source EN PDF p.25, block 196 -->

###### 2.2.2.3.2 rk_aiq_customeAwb_single_results_t

<!-- Source EN PDF p.25, block 197 -->

【Beschreibung】 Definiert Konfigurationsparameter und Berechnungsergebnisse jeder Kamera im Surround-View-Modus des eigenen AWB-Algorithmus. Außerhalb von Surround View nicht relevant.

<!-- Source EN PDF p.25, block 198 -->

【Definition】

<!-- Source EN PDF p.25, block 199 -->

```text
typedef struct rk_aiq_customeAwb_single_results_s
{
    rk_aiq_wb_gain_t awb_gain_algo;//for each camera
    rk_aiq_customAwb_single_hw_cfg_t awbHwConfig;//for each camera
    struct rk_aiq_customeAwb_single_results_s *next;
} rk_aiq_customeAwb_single_results_t;
```

<!-- Source EN PDF p.25, block 200 -->

【Mitglied】

<!-- Source EN PDF p.26, block 201 -->

| Mitgliedsname | Beschreibung |
|---|---|
| awb_gain_algo | Gleiche Bedeutung wie awb_gain_algo in rk_aiq_customeAwb_results_s |
| awbHwConfig | Gleiche Bedeutung wie das gleichnamige Mitglied der Struktur awbHwConfig<br>in rk_aiq_customeAwb_results_s |
| next | Laut Quelle unbenutzt; gleiche Bedeutung wie das dort „anext“ genannte Mitglied<br>in rk_aiq_customeAwb_results_s. |

<!-- Source EN PDF p.26, block 202 -->

###### 2.2.2.3.3 rk_aiq_wb_gain_t

<!-- Source EN PDF p.26, block 203 -->

Siehe die Strukturdefinition rk_aiq_wb_gain_t im Abschnitt „AWB/Function-Level API/Data Type“ von Rockchip_Development_Guide_ISP32; der ISP32-Querverweis der Quelle bleibt erhalten.

<!-- Source EN PDF p.26, block 204 -->

###### 2.2.2.3.4 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.26, block 205 -->

【Beschreibung】 Definiert Hardwarekonfigurationsparameter des eigenen AWB-Algorithmus, darunter Haupt-/Mehrfachfensterkonfiguration und Auswahl des Statistikbildes.

<!-- Source EN PDF p.26, block 206 -->

【Definition】

<!-- Source EN PDF p.26, block 207 -->

```text
typedef struct rk_aiq_customAwb_hw_cfg_s {
    bool awbEnable;
    bool lscBypEnable;
    uint8_t frameChoose;
    unsigned short windowSet[4];
    unsigned char lightNum;
    unsigned short maxR;
    unsigned short minR;
    unsigned short maxG;
    unsigned short minG;
    unsigned short maxB;
    unsigned short minB;
    unsigned short maxY;
    unsigned short minY;
    bool uvDetectionEnable;
    rk_aiq_awb_uv_range_para_t uvRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool xyDetectionEnable;
    rk_aiq_rgb2xy_para_t rgb2xy_param;
    rk_aiq_awb_xy_range_para_t xyRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool threeDyuvEnable;
    unsigned short threeDyuvIllu[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    short icrgb2RYuv_matrix[12];
    rk_aiq_awb_rt3dyuv_range_para_t
ic3Dyuv2Range_param[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
} rk_aiq_customAwb_hw_cfg_t;
```

<!-- Source EN PDF p.26, block 208 -->

【Mitglied】

<!-- Source EN PDF p.27, block 209 -->

| Mitgliedsname | Beschreibung |
|---|---|
| awbEnable | Aktivierungsschalter der AWB-Statistik:<br>true aktiviert, false deaktiviert; Standard: true. |
| lscBypEnable | LSC-Bypass im AWB-Statistikpfad: true aktiviert den Bypass ohne LSC;<br>false verwendet LSC. Standard: false. |
| frameChoose | Eingabebild der AWB-Hardwarestatistik. Werte {0,1,2} bezeichnen kurze,<br>mittlere und lange Bilder. Standard im linearen Modus: 0; im Modus mit hohem Dynamikumfang: 1. |
| windowSet | AWB-Hauptfenster: windowSet=[h_offset,v_offset,h_size,v_size],<br>h horizontal, v vertikal. Wertebereich: [0x0, 0xfff].<br>h_size* v_size muss kleiner als 5120*2880 sein.<br>Standard: {0, 0, RawWidth, RawHeight}, gesamtes Fenster.<br>Ohne Fensteränderung ist keine Konfiguration erforderlich. |
| lightNum | Anzahl zu erfassender Lichtquellen; Wertebereich [0, 7], Standard 7.<br>Entsprechend der bei der Kalibrierung verwendeten Anzahl konfigurieren;<br>das Kalibrierwerkzeug gibt den Wert aus. |
| maxR | Obergrenze des R-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 230. |
| minR | Untergrenze des R-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 3. |
| maxG | Obergrenze des G-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 230. |
| minG | Untergrenze des G-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 3. |
| maxB | Obergrenze des B-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 230. |
| minB | Untergrenze des B-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 3. |
| maxY | Obergrenze des Y-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 230. |
| minY | Untergrenze des Y-Kanals für die Weißpunkterkennung bei RGB-Statistiken.<br>Wertebereich: [0x0, 0xff]; Standard: 3. |
| uvDetectionEnable | Weißpunkterkennung in der UV-Domäne: true aktiviert sie, sodass Punkte<br>innerhalb des UV-Weißpunktbereichs als Weißpunkte gelten. Bei false gelten alle Punkte<br>als Weißpunkte. Standard: true. |
| uvRange_param | Begrenzungsparameter des viereckigen UV-Weißpunktbereichs; bis zu 7 Lichtquellen.<br>Modulspezifisch und bei uvDetectionEnable=ture korrekt zu konfigurieren; die Schreibweise<br>„ture“ stammt aus der Quelle. Nicht festgelegte Parameter liefert das Kalibrierwerkzeug.<br>Siehe rk_aiq_awb_uv_range_para_t. |
| xyDetectionEnable | Weißpunkterkennung in der XY-Domäne: true aktiviert sie, sodass Punkte<br>innerhalb des XY-Weißpunktbereichs als Weißpunkte gelten. Bei false gelten alle Punkte<br>als Weißpunkte. Standard: true. |
| rgb2xy_param | Modulspezifische Umrechnungsparameter von RGB nach XY.<br>Bei xyDetectionEnable=true korrekt konfigurieren; nicht festgelegte Parameter liefert<br>das Kalibrierwerkzeug. Siehe rk_aiq_rgb2xy_para_t. |
| xyRange_param | Begrenzungsparameter des viereckigen XY-Weißpunktbereichs; bis zu 7 Lichtquellen.<br>Modulspezifisch und bei xyDetectionEnable=true korrekt zu konfigurieren.<br>Nicht festgelegte Parameter liefert das Kalibrierwerkzeug. Siehe rk_aiq_awb_xy_range_para_t. |
| threeDyuvEnable | Weißpunkterkennung in der YUV-Domäne: true aktiviert, false deaktiviert.<br>Standard: true. |
| threeDyuvIllu | Wertebereich [0, 7]. 7 deaktiviert die YUV-Weißpunkterkennung, sodass alle<br>Punkte als Weißpunkte gelten. Andere Werte aktivieren die entsprechende Lichtquelle.<br>Standard: {7, 7, 7, 7}. |
| icrgb2RYuv_matrix | Rotationsmatrixparameter von RGB nach YUV, modulspezifisch.<br>Bei aktiviertem threeDyuvEnable und threeDyuvIllu ungleich 7 korrekt konfigurieren;<br>die Quelle schreibt hierfür fehlerhaft „threeDyuvEnable and turethreeDyuvIllu“.<br>Wertebereich letzte Spalte: [-2^12,2^12-1], übrige: [-2^9,2^9-1].<br>Parameter ohne Festkommaumsetzung sind über das Kalibrierwerkzeug erhältlich. |
| ic3Dyuv2Range_param | Modulspezifische Begrenzungsparameter der YUV-Weißpunkte.<br>Bei aktiviertem threeDyuvEnable und threeDyuvIllu ungleich 7 korrekt konfigurieren;<br>die Quelle schreibt „threeDyuvEnable and turethreeDyuvIllu“.<br>Nicht festgelegte Parameter liefert das dort genannte Indexierungswerkzeug.<br>Siehe rk_aiq_awb_rt3dyuv_range_para_t. |
| multiwindow_en | Aktivierungsschalter der AWB-Mehrfensterstatistik:<br>true aktiviert, false deaktiviert; Standard: false. |
| multiwindow | AWB-Mehrfensterkonfiguration, höchstens 4 Fenster.<br>multiwindow[i]=[h_offset,v_offset,h_size,v_size], h horizontal, v vertikal.<br>Wertebereich: [0x0, 0xfff]. |
| excludeWpRange | Höchstens 7 Weißpunkt- oder Nichtweißpunktbereiche in UV oder XY.<br>Die ersten 4 können als zusätzliche Weißpunktbereiche konfiguriert werden.<br>Modulspezifisch; siehe rk_aiq_awb_exc_range_v201_t. |
| wpDiffWeiEnable | Aktivierung der helligkeitsabhängigen Weißpunktgewichtung:<br>true aktiviert, false deaktiviert; Standard: false. |
| wpDiffwei_y | Helligkeitsintervalle des Weißpunkthistogramms mit insgesamt 9 Endpunkten.<br>Wertebereich: [0x0, 0xff]. Benachbarte Intervalle von wpDiffwei_y müssen Zweierpotenzen sein. |
| wpDiffwei_w | Gewicht jedes Endpunkts von wpDiffwei_y.<br>Wertebereich: [0, 31], 5 Nachkommastellen; Standard: 31. |
| xyRangeTypeForWpHist | Wählt den mittleren oder großen Bereich für das Weißpunkthelligkeitshistogramm.<br>Werte: RK_AIQ_AWB_XY_TYPE_NORMAL_V201 für den mittleren Bereich oder<br>RK_AIQ_AWB_XY_TYPE_BIG_V201 für den großen Bereich.<br>Standard: RK_AIQ_AWB_XY_TYPE_NORMAL_V201. |
| blkWeightEn | Aktivierung der Blockgewichtung; die Quelle schreibt „rue“ für aktiviert,<br>false für deaktiviert. Standard: false. |
| blkWeight | Blockgewicht: Wertebereich [0,63], 6 Nachkommastellen. |
| blkMeasureMode | Wählt, ob alle Punkte oder nur Weißpunkte eines Blocks erfasst werden.<br>RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 erfasst alle Punkte;<br>RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 nur Weißpunkte.<br>Standard: RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201. |
| xyRangeTypeForBlkStatistics | Wählt mittleren oder großen Weißpunktbereich für die Blockstatistik;<br>nur bei blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 relevant.<br>RK_AIQ_AWB_XY_TYPE_NORMAL_V201 beziehungsweise RK_AIQ_AWB_XY_TYPE_BIG_V201<br>bezeichnen Normal- und Großbereich. Standard: RK_AIQ_AWB_XY_TYPE_NORMAL_V201. |
| illIdxForBlkStatistics | Wählt die Lichtquelle für die Weißpunktstatistik; nur bei<br>blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 relevant.<br>Zulässige Werte: {RK_AIQ_AWB_BLK_STAT_REALWP_ILL0,<br>RK_AIQ_AWB_BLK_STAT_REALWP_ILL1,RK_AIQ_AWB_BLK_STAT_REALWP_ILL2,RK_AIQ_AWB_BLK_STAT_REALWP_ILL3,<br>RK_AIQ_AWB_BLK_STAT_REALWP_ILL4,RK_AIQ_AWB_BLK_STAT_REALWP_ILL5,<br>RK_AIQ_AWB_BLK_STAT_REALWP_ILL6, RK_AIQ_AWB_BLK_STAT_REALWP_ALL}. |

<!-- Source EN PDF p.29, block 212 -->

【Hinweis】

<!-- Source EN PDF p.29, block 213 -->

Die in der Quelle schwarz markierten Parameter können mit Standardwerten konfiguriert werden.

<!-- Source EN PDF p.29, block 214 -->

Für ein vertieftes Verständnis dieser Parameter siehe folgende Inhalte in Rockchip_Color_Optimization_Guide:

<!-- Source EN PDF p.29, block 215 -->

(a) Abschnitt „2 AWB/2.1 Function Description“ zur Funktionsbeschreibung sowie das AWB-Ablaufdiagramm.

<!-- Source EN PDF p.29, block 216 -->

(b) AWB-Ablaufdiagramm zur Weißpunkterkennung im Abschnitt „2 AWB/2.2 White Spot Detection Process for Key Parameters/Hardware“.

<!-- Source EN PDF p.29, block 217 -->

###### 2.2.2.3.5 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.29, block 218 -->

【Beschreibung】 Definiert unterschiedliche Hardwarekonfigurationen der einzelnen Kameras im Surround-View-Modus; außerhalb von Surround View nicht relevant.

<!-- Source EN PDF p.29, block 219 -->

【Definition】

<!-- Source EN PDF p.29, block 220 -->

```text
typedef struct rk_aiq_customAwb_single_hw_cfg_t {
    unsigned short windowSet[4];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
    bool blkWeightEnable;
    unsigned char blkWeight[RK_AIQ_AWB_GRID_NUM_TOTAL];
} rk_aiq_customAwb_single_hw_cfg_t;
```

<!-- Source EN PDF p.29, block 221 -->

【Mitglied】

<!-- Source EN PDF p.29, block 222 -->

| Mitgliedsname | Beschreibung |
|---|---|
| windowSet | Gleiche Bedeutung wie windowSet in rk_aiq_customAwb_hw_cfg_t |
| multiwindow_en | Gleiche Bedeutung wie multiwindow_en in rk_aiq_customAwb_hw_cfg_t |
| multiwindow | Gleiche Bedeutung wie multiwindow in rk_aiq_customAwb_hw_cfg_t |
| blkWeightEnable | Die Quelle enthält die beschädigte Beschreibung „Tongke_Ike_Kustomab_Hall_Cob_T-Bulkwertnabul meaning“; Bedeutung ungeklärt. |
| blkWeight | Die Quelle enthält die beschädigte Beschreibung „Tongke_Ike_Coustomab_Hall_Cove_Tur in Burkwaite meaning“; Bedeutung ungeklärt. |

<!-- Source EN PDF p.30, block 223 -->

###### 2.2.2.3.6 rk_aiq_awb_uv_range_para_t

<!-- Source EN PDF p.30, block 224 -->

【Erläuterung】 Definiert Begrenzungsparameter des viereckigen UV-Weißpunktbereichs für den eigenen AWB-Algorithmus.

<!-- Source EN PDF p.30, block 225 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 30](/docs/rockchip-isp30-3a/assets/en-p30-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 30.*

<!-- Source EN PDF p.30, block 226 -->

【Definition】

<!-- Source EN PDF p.30, block 227 -->

```text
typedef struct rk_aiq_awb_uv_range_para_s {
    unsigned short pu_region[5];
    unsigned short pv_region[5];
    int slope_inv[4];
} rk_aiq_awb_uv_range_para_t;
```

<!-- Source EN PDF p.30, block 228 -->

【Mitglied】

<!-- Source EN PDF p.30, block 229 -->

| Mitgliedsname | Beschreibung |
|---|---|
| pu_region | U-Koordinaten des UV-Weißpunktbereichs als geschlossener Linienzug,<br>z. B. [u0,u1,u2,u3,u0]. Wertebereich [0x0, 0x1ff], 1 Nachkommastelle. |
| pv_region | V-Koordinaten des UV-Weißpunktbereichs als geschlossener Linienzug,<br>z. B. [v0,v1,v2,v3,v0]. Wertebereich [0x0, 0x1ff], 1 Nachkommastelle. |
| slope_inv | Kehrwerte der Steigungen der vier Seiten des UV-Weißpunktbereichs;<br>10 Nachkommastellen möglich. |

<!-- Source EN PDF p.30, block 230 -->

【Hinweis】

<!-- Source EN PDF p.30, block 231 -->

Festkomma- oder umgerechnete Parameter auf Grundlage des Abschnitts „AWB/UV domain white points detector“ in Rockchip_Color_Optimization_Guide_ISP30; sie werden vom Kalibrierwerkzeug geliefert.

<!-- Source EN PDF p.30, block 232 -->

Die modulspezifischen Parameter müssen bei uvDetectionEnable=ture korrekt konfiguriert werden; „ture“ ist die Schreibweise der Quelle.

<!-- Source EN PDF p.30, block 233 -->

###### 2.2.2.3.7 rk_aiq_rgb2xy_para_t

<!-- Source EN PDF p.30, block 234 -->

【Erläuterung】 Definiert die Umrechnungsparameter von RGB nach XY für den eigenen AWB-Algorithmus.

<!-- Source EN PDF p.30, block 235 -->

【Definition】

<!-- Source EN PDF p.31, block 236 -->

```text
typedef struct rk_aiq_rgb2xy_para_s {
    unsigned short pseudoLuminanceWeight[3];
    short rotationMat[9];
} rk_aiq_rgb2xy_para_t;
```

<!-- Source EN PDF p.31, block 237 -->

【Mitglied】

<!-- Source EN PDF p.31, block 238 -->

| Mitgliedsname | Beschreibung |
|---|---|
| pseudoLuminanceWeight | Umrechnungsparameter von RGB nach XY: [0, 2^12-1],<br>12 Nachkommastellen. |
| rotationMat | Umrechnungsparameter von RGB nach XY: [-2^14, 2^14-1],<br>12 Nachkommastellen. |

<!-- Source EN PDF p.31, block 239 -->

【Hinweis】

<!-- Source EN PDF p.31, block 240 -->

Die vom Kalibrierwerkzeug gelieferten Parameter werden anhand des Abschnitts „AWB/RGB2XY“ in Rockchip_Color_Optimization_Guide_ISP30 in Festkommadarstellung umgesetzt.

<!-- Source EN PDF p.31, block 241 -->

Die modulspezifischen Parameter müssen bei xyDetectionEnable=ture korrekt konfiguriert werden; „ture“ ist die Schreibweise der Quelle.

<!-- Source EN PDF p.31, block 242 -->

###### 2.2.2.3.8 rk_aiq_awb_xy_range_para_t

<!-- Source EN PDF p.31, block 243 -->

【Erläuterung】 Definiert Begrenzungsparameter des viereckigen XY-Weißpunktbereichs für den eigenen AWB-Algorithmus.

<!-- Source EN PDF p.31, block 244 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 31](/docs/rockchip-isp30-3a/assets/en-p31-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 31.*

<!-- Source EN PDF p.31, block 245 -->

【Definition】

<!-- Source EN PDF p.31, block 246 -->

```text
typedef struct rk_aiq_awb_xy_range_para_s {
    int NorrangeX[2];
    int NorrangeY[2];
    int SperangeX[2];
    int SperangeY[2];
    int SmalrangeX[2];
    int SmalrangeY[2];
} rk_aiq_awb_xy_range_para_t;
```

<!-- Source EN PDF p.31, block 247 -->

【Mitglied】

<!-- Source EN PDF p.32, block 248 -->

| Mitgliedsname | Beschreibung |
|---|---|
| NorrangeX | Horizontale Anfangs- und Endkoordinaten des XY-Weißpunktbereichs [x0,x1].<br>Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |
| NorrangeY | Vertikale Anfangs- und Endkoordinaten des XY-Weißpunktbereichs [y0,y1].<br>Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |
| SperangeX | Horizontale Anfangs- und Endkoordinaten des XY-Weißpunktbereichs [x0,x1].<br>Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |
| SperangeY | Vertikale Anfangs- und Endkoordinaten des XY-Weißpunktbereichs [y0,y1].<br>Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |
| SmalrangeX | Horizontale Anfangs- und Endkoordinaten des kleinen XY-Weißpunktbereichs [x0,x1].<br>In der aktuellen Version nicht unterstützt. Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |
| SmalrangeY | Vertikale Anfangs- und Endkoordinaten des kleinen XY-Weißpunktbereichs [y0,y1].<br>In der aktuellen Version nicht unterstützt. Wertebereich: [-2^13, 2^13-1], 10 Nachkommastellen. |

<!-- Source EN PDF p.32, block 249 -->

【Hinweise】

<!-- Source EN PDF p.32, block 250 -->

Festkommaparameter auf Grundlage des Abschnitts „AWB/XY domain white points detector“ in Rockchip_Color_Optimization_Guide_ISP30; sie werden vom Kalibrierwerkzeug geliefert.

<!-- Source EN PDF p.32, block 251 -->

Die modulspezifischen Parameter müssen bei xyDetectionEnable=ture korrekt konfiguriert werden; „ture“ ist die Schreibweise der Quelle.

<!-- Source EN PDF p.32, block 252 -->

###### 2.2.2.3.9 rk_aiq_awb_rt3dyuv_range_para_t

<!-- Source EN PDF p.32, block 253 -->

【Erläuterung】 Definiert YUV-Weißpunktbegrenzungsparameter für den eigenen AWB-Algorithmus.

<!-- Source EN PDF p.32, block 254 -->

【Definition】

<!-- Source EN PDF p.32, block 255 -->

```text
typedef struct rk_aiq_awb_rt3dyuv_range_para_s {
    unsigned char thcurve_u[6];
    unsigned short thcure_th[6];
    unsigned short lineP1[3];
    short vP1P2[3];
    unsigned char disP1P2;
} rk_aiq_awb_rt3dyuv_range_para_t;
```

<!-- Source EN PDF p.32, block 256 -->

【Mitglied】

<!-- Source EN PDF p.33, block 257 -->

| Mitgliedsname | Beschreibung |
|---|---|
| thcurve_u | u-Komponente des stückweisen Linienzuges u-th.<br>Wertebereich: [0x0, 0xff]. Die Differenz zweier benachbarter u-Komponenten<br>muss eine Zweierpotenz sein. |
| thcure_th | th-Komponente des stückweisen Linienzuges u-th.<br>Wertebereich: [0x0, 0xfff], 4 Nachkommastellen.<br>Der Linienzug u-th muss monoton steigen. |
| lineP1 | Zur Berechnung des theoretischen Weißpunkts (y',u0,v0) benötigte Parameter:<br>Koordinaten von p1 in der YUV-Domäne.<br>Wertebereich jeder Komponente: [0x0, 0xfff], 4 Nachkommastellen. |
| vP1P2 | Zur Berechnung des theoretischen Weißpunkts (y',u0,v0) benötigte Parameter:<br>Vektor von p1 nach p2 in der YUV-Domäne.<br>Wertebereich jeder Komponente: [-2^12, 2^12-1], 4 Nachkommastellen. |
| disP1P2 | Der euklidische Abstand zwischen p1 und p2 beträgt 2^disP1P2.<br>Wertebereich: [0,5]. |

<!-- Source EN PDF p.33, block 258 -->

【Hinweise】

<!-- Source EN PDF p.33, block 259 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 33](/docs/rockchip-isp30-3a/assets/en-p33-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 33.*

<!-- Source EN PDF p.33, block 260 -->

Festkomma- oder umgerechnete Parameter auf Grundlage des Abschnitts „AWB/YUV domain white points detector“ in Rockchip_Color_Optimization_Guide_ISP30; sie werden vom Kalibrierwerkzeug geliefert.

<!-- Source EN PDF p.33, block 261 -->

Die modulspezifischen Parameter müssen bei threeDyuvEnable=ture und threeDyuvIllu ungleich 7 korrekt konfiguriert werden; „ture“ ist die Schreibweise der Quelle.

<!-- Source EN PDF p.33, block 262 -->

###### 2.2.2.3.10 rk_aiq_awb_exc_range_v201_t

<!-- Source EN PDF p.33, block 263 -->

【Erläuterung】 Definiert Begrenzungsparameter für ausgeschlossene oder zusätzliche Weißpunktbereiche in UV oder XY für den eigenen AWB-Algorithmus.

<!-- Source EN PDF p.33, block 264 -->

【Definition】

<!-- Source EN PDF p.34, block 265 -->

```text
typedef struct rk_aiq_awb_exc_range_v201_s {
    rk_aiq_awb_exc_range_domain_t domain;
    bool excludeEnable[RK_AIQ_AWB_XY_TYPE_MAX_V201];
    bool measureEnable;
    int xu[2];
    int yv[2];
} rk_aiq_awb_exc_range_v201_t;
```

<!-- Source EN PDF p.34, block 266 -->

【Mitglied】

<!-- Source EN PDF p.34, block 267 -->

| Mitgliedsname | Beschreibung |
|---|---|
| rk_aiq_awb_exc_range_domain_t | Wählt die Domäne für ausgeschlossene/zusätzliche Weißpunktbereiche.<br>Zulässige Werte: RK_AIQ_AWB_EXC_RANGE_DOMAIN_UV oder<br>RK_AIQ_AWB_EXC_RANGE_DOMAIN_XY für UV beziehungsweise XY.<br>Die Quelle enthält an dieser Stelle die unklare Formulierung „UV AND selection“. |
| excludeEnable | Ausschlussbereich aktivieren:<br>true aktiviert, false deaktiviert; Standard: true. |
| measureEnable | Gibt an, ob die Summe der Kanäle RGain und BGain im ausgeschlossenen/<br>zusätzlichen Bereich erfasst wird. true erfasst, false nicht; Standard: false. |
| xu | Horizontale Anfangs- und Endkoordinaten des ausgeschlossenen/zusätzlichen<br>UV- oder XY-Weißpunktbereichs: xu = {x0,x1}. Wertebereich: -2^13, 2^13-1. |
| yv | Vertikale Anfangs- und Endkoordinaten des ausgeschlossenen/zusätzlichen<br>UV- oder XY-Weißpunktbereichs: yv = {y0,y1}. Wertebereich: -2^13, 2^13-1. |

<!-- Source EN PDF p.34, block 268 -->

【Hinweise】

<!-- Source EN PDF p.34, block 269 -->

Höchstens 7 Fenster sind konfigurierbar; measureEnable darf jedoch nur bei den ersten 4 auf true gesetzt werden.

<!-- Source EN PDF p.34, block 270 -->

### 2.3 Eigene AF-Algorithmen entwickeln

<!-- Source EN PDF p.34, block 271 -->

Wird die RK-AF-Algorithmusbibliothek nicht verwendet, kann auf Basis der 3A-Statistikwerte ein eigener AF-Algorithmus entwickelt werden, beispielsweise für Zoom und Fokussierung.

<!-- Source EN PDF p.34, block 272 -->

Bei der Implementierung eines eigenen AF-Algorithmus:

<!-- Source EN PDF p.34, block 273 -->

1\. Zuerst rk_aiq_user_api2_af_SetAttrib aufrufen, um die AF-Statistik zu konfigurieren.

<!-- Source EN PDF p.34, block 274 -->

2\. Anschließend 3A-Statistikwerte mit rk_aiq_uapi_sysctl_get3AStatsBlk abrufen. Diese API blockiert und kehrt sofort zurück, sobald neue 3A-Statistikwerte vorliegen.

<!-- Source EN PDF p.35, block 275 -->

3\. Der eigene AF-Algorithmus berechnet anhand dieser Werte die erforderlichen Ergebnisse und bewegt Zoom- und Fokusmotor.

<!-- Source EN PDF p.35, block 276 -->

4\. Abschließend die erhaltenen 3A-Statistikwerte durch rk_aiq_uapi_sysctl_release3AStatsRef freigeben.

<!-- Source EN PDF p.35, block 277 -->

Den Gesamtablauf zeigt folgende Abbildung.

<!-- Source EN PDF p.35, block 278 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 35](/docs/rockchip-isp30-3a/assets/en-p35-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 35.*

<!-- Source EN PDF p.35, block 279 -->

#### 2.3.1 AF-Statistikmodul

<!-- Source EN PDF p.35, block 280 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 35](/docs/rockchip-isp30-3a/assets/en-p35-figure2.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 35.*

<!-- Source EN PDF p.35, block 281 -->

Liefert der Sensor ein HDR-Bild, kann das AF-Modul das kurz, mittel oder lang belichtete HDR-Bild oder Daten des zusammengeführten HDR-Bildes als Eingabe für die AF-Statistik wählen.

<!-- Source EN PDF p.35, block 282 -->

Liefert der Sensor ein normales Bild, kann das AF-Modul das Sensoreingabebild oder das demosaizierte Bild als Eingabe der AF-Statistik wählen.

<!-- Source EN PDF p.35, block 283 -->

Unterstützt werden insgesamt zwei Fenster: Hauptfenster A und unabhängiges Fenster B.

<!-- Source EN PDF p.35, block 284 -->

Hauptfenster A enthält 15\*15 Unterfenster. Es lässt sich mit vier Filtern V1/V2/H1/H2 konfigurieren und liefert die vier entsprechenden FV-Werte sowie Helligkeits- und Spitzlichtstatistiken.

<!-- Source EN PDF p.35, block 285 -->

Das unabhängige Fenster B berechnet den FV-Wert mit einem festen Operator und liefert einen FV-Wert, einen Helligkeitswert und einen Spitzlichtstatistikwert.

<!-- Source EN PDF p.36, block 286 -->

#### 2.3.2 AF-Statistikfenster konfigurieren

<!-- Source EN PDF p.36, block 287 -->

Hauptfenster A und unabhängiges Fenster B unterstützen rechteckige Fenster. Konfigurierbar sind die Koordinaten der linken oberen Ecke sowie Breite und Höhe.

<!-- Source EN PDF p.36, block 288 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 36](/docs/rockchip-isp30-3a/assets/en-p36-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 36.*

<!-- Source EN PDF p.36, block 289 -->

#### 2.3.3 Gamma

<!-- Source EN PDF p.36, block 290 -->

Gamma wandelt das RAW-Eingabebild des Sensors entsprechend der menschlichen Wahrnehmung natürlicher Helligkeit um. Die x-Koordinate von 0 bis 1023 wird wie folgt unterteilt: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128. Der Wertebereich der y-Koordinate beträgt 0 bis 1023.

<!-- Source EN PDF p.36, block 291 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 36](/docs/rockchip-isp30-3a/assets/en-p36-figure2.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 36.*

<!-- Source EN PDF p.36, block 292 -->

#### 2.3.4 Fokusfilter

<!-- Source EN PDF p.36, block 293 -->

Für Hauptfenster A lassen sich vier Filter V1/V2/H1/H2 einstellen. Das unabhängige Fenster B verwendet feste Operatoren.

<!-- Source EN PDF p.37, block 294 -->

Die Frequenzbänder der Filter V1/V2/H1/H2 sind einstellbar; Filterentwurfswerkzeuge erzeugen die zugehörigen Registerwerte.

<!-- Source EN PDF p.37, block 295 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 37](/docs/rockchip-isp30-3a/assets/en-p37-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 37.*

<!-- Source EN PDF p.37, block 296 -->

#### 2.3.5 Helligkeit und Spitzlichter

<!-- Source EN PDF p.37, block 297 -->

Hauptfenster A liefert Helligkeitsstatistiken und eine Zählung der Spitzlichter.

<!-- Source EN PDF p.37, block 298 -->

Lichtquellen beeinflussen den FV-Wert leicht. Bei unscharfem Fokus nimmt durch die Ausbreitung des Lichthofs der niederfrequente Bildanteil zu. Das Bild wird unscharf, während der FV-Wert steigen kann.

<!-- Source EN PDF p.37, block 299 -->

Üblicherweise wird dies mit einem Spitzlichtzähler behandelt: Bei Unschärfe wächst der Lichthof und damit die Zahl heller Spitzlichtpunkte. Bei scharfem Fokus ist diese Zahl am kleinsten.

<!-- Source EN PDF p.37, block 300 -->

#### 2.3.6 Helligkeitsabhängige Verstärkung

<!-- Source EN PDF p.37, block 301 -->

Die LDG-Funktion kann den Einfluss von Lichtquellen ebenfalls reduzieren: Sie schwächt den FV-Wert entsprechend der Pixelhelligkeit ab und verringert ihn an hellen sowie zu dunklen Punkten.

<!-- Source EN PDF p.38, block 302 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 38](/docs/rockchip-isp30-3a/assets/en-p38-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 38.*

<!-- Source EN PDF p.38, block 303 -->

Liegt die Helligkeit innerhalb [ldg_xl, ldg_xh], beträgt die ausgegebene Verstärkung 1; der FV-Wert wird nicht abgeschwächt.

<!-- Source EN PDF p.38, block 304 -->

Liegt die Helligkeit innerhalb [0, ldg_xl], wird die Verstärkung entsprechend der Steigung ldg_kl abgeschwächt, jedoch nicht unter ldg_yl.

<!-- Source EN PDF p.38, block 305 -->

`gain = 256 - ldg_kl*(ldg_xl - x)/256; gain = max(gain, ldg_yl);`

<!-- Source EN PDF p.38, block 306 -->

Liegt die Helligkeit innerhalb [ldg_xh, 255], wird die Verstärkung entsprechend der Steigung ldg_kh abgeschwächt, jedoch nicht unter ldg_yh.

<!-- Source EN PDF p.38, block 307 -->

`gain = 256 - ldg_kh*(x-ldg_xh)/256; gain = max(gain, ldg_yh);`

<!-- Source EN PDF p.38, block 308 -->

Die horizontalen Kanäle H1/H2 teilen sich eine LDG-Kurve; die vertikalen Kanäle V1/V2 teilen sich eine weitere.

<!-- Source EN PDF p.38, block 309 -->

#### 2.3.7 Fv-Schwelle

<!-- Source EN PDF p.38, block 310 -->

Ein berechneter Fv-Wert unterhalb der Fv-Schwelle wird in der endgültigen Ausgabe nicht berücksichtigt. Dies kann den Rauscheinfluss verringern.

<!-- Source EN PDF p.39, block 311 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 39](/docs/rockchip-isp30-3a/assets/en-p39-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 39.*

<!-- Source EN PDF p.39, block 312 -->

Die Fv-Schwelle gilt für den LDG-Ausgabewert nach der Filterung.

<!-- Source EN PDF p.39, block 313 -->

#### 2.3.8 Fv-Berechnung

<!-- Source EN PDF p.39, block 314 -->

Der Fv-Wert unterstützt Betrags- und Quadratmodus. Im Quadratmodus wird Fv quadriert, wodurch sich der Anteil scharf fokussierter Positionen am FV-Wert erhöhen lässt.

<!-- Source EN PDF p.39, block 315 -->

Zur Vermeidung eines Überlaufs des endgültigen Fv-Ausgabewerts lassen sich im Hauptfenster vier Rechtsverschiebungswerte für v1/v2/h1/h2 und im unabhängigen Fenster zwei für fv/luma einstellen.

<!-- Source EN PDF p.39, block 316 -->

#### 2.3.9 Fv-Ausgabe

<!-- Source EN PDF p.39, block 317 -->

Die Ausgabe von Hauptfenster A enthält v1/v2/h1/h2-Fv-Informationen für 1515 sowie luma/highlight-Informationen für 1515. Die Schreibweise „1515“ der Quelle bleibt erhalten; das zugehörige Raster zeigt 15×15.

<!-- Source EN PDF p.39, block 319 -->

Die räumliche Verteilung der Ausgabe von Hauptfenster A ist nachfolgend dargestellt.

<!-- Source EN PDF p.39, block 320 -->

Das unabhängige Fenster B gibt einen Fv-Wert, eine Helligkeitsinformation und eine Spitzlichtstatistik aus.

<!-- Source EN PDF p.40, block 321 -->

![Technische Abbildung aus der englischen Quelle, PDF-S. 40](/docs/rockchip-isp30-3a/assets/en-p40-figure1.png)

*Technische Abbildung aus der englischen Quelle, PDF-S. 40.*

Bearbeitbare Übertragung des FV-Rasters aus der Quelle:

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 2 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 3 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 4 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 5 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 6 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 7 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 8 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 9 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 10 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 11 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 12 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 13 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 14 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 15 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |

<!-- Source EN PDF p.40, block 322 -->

#### 2.3.10 Endgültigen FV-Wert berechnen

<!-- Source EN PDF p.40, block 323 -->

H1 und V1 können für die Grobsuche auf ein Tiefpassband, H2 und V2 für die Feinsuche auf ein Hochpassband eingestellt werden.

<!-- Source EN PDF p.40, block 324 -->

Die horizontale Filterausgabe H und die vertikale Filterausgabe V lassen sich gewichten:

<!-- Source EN PDF p.40, block 325 -->

`FV = FvH * weight + FvV * (1-weight)`

<!-- Source EN PDF p.40, block 326 -->

Die FV-Werte der einzelnen Blöcke können bei Bedarf ebenfalls unterschiedlich gewichtet werden.

<!-- Source EN PDF p.40, block 327 -->

#### 2.3.11 AF-Statistik konfigurieren

<!-- Source EN PDF p.40, block 328 -->

Verwenden Sie zur Konfiguration rk_aiq_user_api2_af_SetAttrib.

<!-- Source EN PDF p.40, block 329 -->

```text
XCamReturn
rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
attr);
```

<!-- Source EN PDF p.40, block 330 -->

| Parametername | Beschreibung | Eingabe/Ausgabe |
|---|---|---|
| sys_ctx | AIQ-Kontextzeiger | Eingabe |
| attr | Fokussierungsattribute | Eingabe |

<!-- Source EN PDF p.40, block 331 -->

rk_aiq_af_algo_meas_v30_t im Parameter rk_aiq_af_attrib_t wird nachfolgend beschrieben:

<!-- Source EN PDF p.40, block 332 -->

```text
typedef struct {
    unsigned char af_en;
    unsigned char rawaf_sel;
    unsigned char gamma_en;
    unsigned char gaus_en;
    unsigned char v1_fir_sel;
    unsigned char hiir_en;
    unsigned char viir_en;
unsigned char v1_fv_outmode; // 0 square, 1 absolute
unsigned char v2_fv_outmode; // 0 square, 1 absolute
unsigned char h1_fv_outmode; // 0 square, 1 absolute
unsigned char h2_fv_outmode; // 0 square, 1 absolute
unsigned char ldg_en;
unsigned char accu_8bit_mode; // fix to 1
unsigned char ae_mode;
unsigned char y_mode; // fix to 0
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
unsigned char h_ldg_lumth[2]; //luminance thresh
unsigned char h_ldg_gain[2]; //gain for [minLum,maxLum]
unsigned short h_ldg_gslp[2]; //[slope_low,-slope_high]
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
} rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.43, block 336 -->

| Mitgliedsname | Beschreibung |
|---|---|
| af_en | AF-Statistikerfassung: 0 aus, 1 ein |
| rawaf_sel | Kanalwahl der AF-Statistik, Wertebereich 0-3. Im HDR-Modus Auswahl zwischen<br>langem, mittlerem, kurzem und zusammengeführtem Bild. Üblicherweise verwendet AF das mittlere Bild.<br>Ohne HDR auf 0, mit HDR auf 1 setzen. |
| gamma_en | Gamma-Modul: 0 aus, 1 ein |
| gaus_en | Fest auf 1 setzen |
| v1_fir_sel | Fest auf 1 setzen |
| hiir_en | Kanäle H1/H2: 0 aus, 1 ein |
| viir_en | Kanäle V1/V2: 0 aus, 1 ein.<br>Bei aktiviertem gamma_en muss viir_en auf 1 stehen. |
| v1_fv_outmode | FV-Ausgabemodus des V1-Kanals: 0 Quadratmodus, 1 Betragsmodus |
| v2_fv_outmode | FV-Ausgabemodus des V2-Kanals: 0 Quadratmodus, 1 Betragsmodus |
| h1_fv_outmode | FV-Ausgabemodus des H1-Kanals: 0 Quadratmodus, 1 Betragsmodus |
| h2_fv_outmode | FV-Ausgabemodus des H2-Kanals: 0 Quadratmodus, 1 Betragsmodus |
| ldg_en | LDG-Funktion: 0 aus, 1 ein |
| accu_8bit_mode | Fest auf 1 setzen |
| ae_mode | Bei ae_mode=1 aktiviert RAWAF eine 15x15-Statistik der mittleren Helligkeit<br>unter Mitnutzung der Logik des RAWAE_BIG-Moduls. |
| y_mode | Fest auf 0 setzen |
| line_en | Noch nicht wirksam |
| line_num | Noch nicht wirksam |
| window_num | Anzahl wirksamer Fenster: Bei 1 ist WinA (Hauptfenster) aktiv;<br>bei 2 sind WinA und WinB (unabhängiges Fenster) aktiv. |
| wina_h_offs | Horizontale Koordinate des ersten Pixels links oben in Wina (Hauptfenster);<br>muss mindestens 2 betragen. |
| wina_v_offs | Vertikale Koordinate des ersten Pixels links oben in WinA (Hauptfenster);<br>muss mindestens 1 betragen. |
| wina_h_size | Breite von Wina; muss kleiner als Bildbreite -2-wina_h_offs<br>und ein Vielfaches von 15 sein. |
| wina_v_size | Die Quelle nennt hier „Breite“ von Wina und fordert einen Wert kleiner als<br>Bildbreite -2-wina_v_offs sowie ein Vielfaches von 15.<br>Der Widerspruch zum vertikalen Parameternamen bleibt erhalten. |
| winb_h_offs | Horizontale Koordinate des ersten Pixels links oben in Winb (unabhängiges Fenster);<br>muss mindestens 2 betragen. |
| winb_v_offs | Vertikale Koordinate des ersten Pixels links oben in Winb (unabhängiges Fenster);<br>muss mindestens 1 betragen. |
| winb_h_size | Breite von winb; muss laut Quelle kleiner als Bildbreite -2-wina_h_offs sein.<br>Der Verweis auf wina bleibt erhalten. |
| winb_v_size | Höhe von WinB; muss laut Quelle kleiner als Bildhöhe -2-wina_v_offs sein.<br>Der Verweis auf wina bleibt erhalten. |
| gamma_y | y-Werte der Gammatabelle, Wertebereich 0-1023.<br>Unterteilung der x-Koordinate von 0 bis 1023:<br>16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128 |
| thres | Liegt der berechnete fv-Wert darunter, wird er zur Rauschunterdrückung auf 0 gesetzt.<br>Wertebereich: 0-0xFFFF. |
| shift_sum_a | Derzeit nicht verfügbar; kann fest auf 0 gesetzt werden |
| shift_sum_b | Rechtsverschiebung des fv-Werts von win b zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| shift_y_a | Derzeit nicht verfügbar; kann fest auf 0 gesetzt werden |
| shift_y_b | Rechtsverschiebung des luma-Werts von win b zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| v1_iir_coe[9] | 3X3-IIR-Koeffizienten des V1-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| v1_fir_coe[3] | 1x3-FIR-Koeffizienten des V1-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| v2_iir_coe[3] | 1x3-IIR-Koeffizienten des V2-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| v2_fir_coe[3] | 1x3-FIR-Koeffizienten des V2-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| h1_iir1_coe[6] | 1X6-IIR1-Koeffizienten des H1-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| h2_iir1_coe[6] | 1X6-IIR1-Koeffizienten des H2-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| h1_iir2_coe[6] | 1X6-IIR2-Koeffizienten des H1-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| h2_iir2_coe[6] | 1X6-IIR2-Koeffizienten des H2-Kanals gemäß Ausgabe des<br>AF-Filterkoeffizientenwerkzeugs setzen. |
| h_ldg_lumth[2] | LDG-Helligkeitsschwelle für H1/H2: Index 0 für den linken dunklen Bereich,<br>Index 1 für den rechten hellen Bereich. Wertebereich: 0~255. |
| h_ldg_gain[2] | Minimale LDG-Verstärkung für H1/H2: Index 0 für den linken dunklen Bereich,<br>Index 1 für den rechten hellen Bereich. Wertebereich: 0~255. |
| h_ldg_gslp[2] | LDG-Steigung für H1/H2: Index 0 für den linken dunklen Bereich,<br>Index 1 für den rechten hellen Bereich. Wertebereich: 0~65535. |
| v_ldg_lumth[2] | LDG-Helligkeitsschwelle für V1/V2: Index 0 für den linken dunklen Bereich,<br>Index 1 für den rechten hellen Bereich. Wertebereich: 0~255. |
| v_ldg_gain[2] | Minimale LDG-Verstärkung für V1/V2: Index 0 für den linken dunklen Bereich,<br>Index 1 für den rechten hellen Bereich. Wertebereich: 0~255. |
| v_ldg_gslp[2] | Laut Quelle minimale LDG-Verstärkung für V1/V2: Index 0 für den linken dunklen<br>Bereich, Index 1 für den rechten hellen Bereich. Wertebereich: 0~255.<br>Die vom Steigungsparameternamen abweichende Beschreibung bleibt erhalten. |
| v_fv_thresh | AF-Statistikschwelle für V1/V2: Kleinere berechnete fv-Werte werden zur<br>Rauschunterdrückung auf 0 gesetzt. Wertebereich: 0-0x0FFF. |
| h_fv_thresh | AF-Statistikschwelle für H1/H2: Kleinere berechnete fv-Werte werden zur<br>Rauschunterdrückung auf 0 gesetzt. Wertebereich: 0-0x0FFF. |
| v1_fv_shift | Rechtsverschiebung des fv-Werts im V1-Kanal zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| v2_fv_shift | Rechtsverschiebung des fv-Werts im V2-Kanal zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| h1_fv_shift | Rechtsverschiebung des fv-Werts im H1-Kanal zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| h2_fv_shift | Rechtsverschiebung des fv-Werts im H2-Kanal zur Vermeidung eines Überlaufs.<br>Wertebereich: 0-7. |
| highlit_thresh | Schwelle der Spitzlichtstatistik: Höhere Werte gelten als Spitzlichter und werden<br>erfasst. Je Bereich wird nur deren Anzahl aufsummiert. Wertebereich: 0-0x0FFF. |

<!-- Source EN PDF p.45, block 339 -->

#### 2.3.12 AF-Statistikwerte abrufen

<!-- Source EN PDF p.45, block 340 -->

Einzelheiten enthält der Abschnitt „Statistics“ in Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.45, block 341 -->

`rk_aiq_uapi_sysctl_get3AStatsBlk () / rk_aiq_uapi_sysctl_release3AStatsRef()`

<!-- Source EN PDF p.46, block 342 -->

Die Struktur für AF-Statistikergebnisse heißt rk_aiq_af_algo_stat_v30_t.

<!-- Source EN PDF p.46, block 343 -->

#### 2.3.13 Filterentwurfswerkzeuge verwenden

<!-- Source EN PDF p.46, block 344 -->

Siehe die Dokumentation des Filterentwurfswerkzeugs.

<!-- Source EN PDF p.46, block 345 -->

### 2.4 Codebeispiele als Referenz

<!-- Source EN PDF p.46, block 346 -->

Referenzcode für die Implementierung eigener 3A-Algorithmen finden Sie unter:

<!-- Source EN PDF p.46, block 347 -->

Verzeichnis: AIQ root/rkisp_demo/demo/

<!-- Source EN PDF p.46, block 348 -->

\|-------ae_algo_demo // Referenzcode für AE-Algorithmen

<!-- Source EN PDF p.46, block 349 -->

\|-------awb_algo_demo // Referenzcode für AWB-Algorithmen

<!-- Source EN PDF p.46, block 350 -->

\|-------af_algo_demo // Referenzcode für AF-Algorithmen

{% endraw %}
