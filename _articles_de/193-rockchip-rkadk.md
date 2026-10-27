---
title: "Rockchip RKADK: Handbuch zur Anwendungsentwicklung"
description: "Rockchip RKADK: Handbuch zur Anwendungsentwicklung — V2.3.2"
excerpt: "Rockchip RKADK: Handbuch zur Anwendungsentwicklung"
translation_key: "193-rockchip-rkadk"
slug: "193-rockchip-rkadk"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, RKADK, Linux]
---

{% raw %}

# Rockchip RKADK: Handbuch zur Anwendungsentwicklung

Grundlage sind die chinesischen und englischen Rockchip-RKADK-Dokumente V2.3.2. Alle 14 technischen Kapitel, APIs, Typdefinitionen und Beispiele bleiben erhalten. Für ArmSoM konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie prüfen; die Unterstützung aller ArmSoM-Platinen wird nicht zugesichert. Die Beispiele stammen aus den Quellen. Es wurden keine Befehle oder Hardwaretests ausgeführt.

In Kapitel 3 nummeriert Chinesisch Überblick, API und Datentypen als 3.1, 3.2 und 3.3. Englisch lässt den Überblick unnummeriert und verwendet 3.1/3.2 für API/Typen. Die jeweilige Quellnummerierung bleibt erhalten. Die chinesische Überschrift 3.3.6 lautet `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`, die englische 3.2.6 `RKADK_REC_MANUAL_SPLIT_ATTR_S`; den Typ an den SDK-Headern prüfen. Die englische Deklaration von `RKADK_RECORD_Single_Stop` schreibt `RKADK_STREAM_TYPE_EenStrmType` zusammen; die Quellschreibweise bleibt erhalten, die Trennung von Typ und Parameter ist am SDK zu prüfen.

Beide Quellen sind auf 2025-08-04 datiert. Die Struktur für manuelles Aufteilen endet mit dem typedef-Namen `MUXER_MANUAL_SPLIT_ATTR_S`; die folgende Typaufzählung endet entgegen ihrer Überschrift mit `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`. Diese Quelldefinitionen bleiben erhalten und sind keine geprüften kompilierbaren SDK-Header. Auch `RKADK_MUXER_Disbale`, `librokadk.so`, `RGBA9888` und `RV1103/RV1103` in der Player-Plattformliste sind Quellschreibweisen; am SDK prüfen. Leerzeichen an umgebrochenen Deklarationszeilen wurden wiederhergestellt, ohne Parameter, Zeiger oder Bezeichner zu ändern.

| SoC | Linux |
| --- | --- |
| RV1126/RV1109 | 4.19 |
| RV1106/RV1103 | 5.10 |
| RV1103B | 5.10 |
| RK3576 | 6.10 |
| RV1126B | 6.10 |

## 1. Systemübersicht

RKADK stellt grundlegende Komponenten für Videoaufzeichnung, Fotoaufnahme, Wiedergabe und Vorschau bereit und vereinfacht damit die schnelle Entwicklung von Audio-/Videoaufzeichnungsanwendungen. Der Baustein unterstützt nur einen Prozess; mehrere gleichzeitig arbeitende Prozesse werden, sofern nicht anders angegeben, nicht unterstützt.

### 1.1 Versionen

Version 1.x.x: zusätzliche Kapselung von rkmedia und rockit, Repository master. Version 2.x.x: zusätzliche Kapselung von rockit, Repository develop.

## 2. Aufzeichnung

### 2.1 Überblick

Grundlegende Videoaufzeichnung mit Erstellen und Zerstören sowie Starten und Stoppen von Aufgaben, manuellem Aufteilen von Dateien, Zeitraffer, Voraufzeichnung und Bild-in-Bild (PiP). Eine Aufgabe liest Video- und Audiodaten aus dem Parametermodul, startet und stoppt VENC und AENC und erstellt über den Muxer Dateien, in die sie Frames schreibt. Zu jeder Aufgabe gehören eine oder mehrere Dateien. Jede Datei benötigt einen Videokodierungskanal; für Ton kommt ein Audiokodierungskanal hinzu. Dateien derselben Aufgabe haben denselben Aufzeichnungstyp und dieselben Aufteilungsbedingungen, bei Zeitraffer auch dasselbe Intervall. Unterschiedliche Aufzeichnungsdauern sind möglich.

Post AI ISP: RV1106/RV1126/RV1109 unterstützen Rauschunterdrückung bei schwachem Licht und intelligente Verbesserung der VI-Ausgabebilder durch AI ISP. Dadurch entstehen auch bei wenig Licht klarere Bilder mit geringem Rauschen und ohne Nachzieheffekte.

### 2.2 API-Referenz

#### 2.2.1 RKADK_RECORD_Create

**Beschreibung**

Videoaufzeichnungsaufgabe erstellen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Create(RKADK_RECORD_ATTR_S *pstRecAttr, RKADK_MW_PTR *ppRecorder);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstRecAttr | Attribute der Aufzeichnungsaufgabe | Eingabe |
| ppRecorder | Zeiger auf die erstellte Aufzeichnungsaufgabe | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

Eine Aufgabe unterstützt höchstens zwei gleichzeitige Aufzeichnungsdateien. Jede Datei enthält mindestens einen Videostream und höchstens einen Video- und einen Audiostream. Wiederholtes Erstellen derselben Aufgabe wird nicht unterstützt. Nach dem Erstellen startet RKADK_RECORD_Start die Aufnahme. PiP muss beim Aufruf von RKADK_RECORD_Create über stPipAttr aktiviert werden; dadurch wird der PiP-Pfad erzeugt.

**Beispiel**

rkadk_record_test.

**Siehe auch**

RKADK_RECORD_Destroy.

#### 2.2.2 RKADK_RECORD_Destroy

**Beschreibung**

Videoaufzeichnungsaufgaben zerstören.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Destroy(RKADK_MW_PTR pRecorder);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_RECORD_Destroy darf erst nach dem Erstellen einer Aufgabe aufgerufen werden. Nur erstellte Aufgaben können zerstört werden; wiederholtes Zerstören derselben Aufgabe wird nicht unterstützt.

**Beispiel**

rkadk_record_test.

**Siehe auch**

RKADK_RECORD_Create

#### 2.2.3 RKADK_RECORD_Start

**Beschreibung**

Aufzeichnungsaufgabe starten.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Start(RKADK_MW_PTR pRecorder);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_RECORD_Start darf erst nach dem Erstellen der Aufgabe aufgerufen werden. Eine gestoppte Aufgabe kann erneut gestartet werden.

**Beispiel**

rkadk_record_test.

**Siehe auch**

RKADK_RECORD_Stop

#### 2.2.4 RKADK_RECORD_Stop

**Beschreibung**

Aufzeichnungsaufgabe stoppen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Stop(RKADK_MW_PTR pRecorder);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_RECORD_Stop darf erst nach dem Erstellen der Aufgabe aufgerufen werden. Wiederholtes Stoppen derselben Aufgabe wird nicht unterstützt.

**Beispiel**

rkadk_record_test.

**Siehe auch**

RKADK_RECORD_Start

#### 2.2.5 RKADK_RECORD_Single_Start

**Beschreibung**

Aufzeichnung des angegebenen Streams starten.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Single_Start(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| enStrmType | Streamtyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweise**

RKADK_RECORD_Single_Start darf erst nach dem Erstellen der Aufgabe aufgerufen werden und wird zusammen mit RKADK_RECORD_Single_Stop verwendet. Nach dem Stoppen ist ein erneuter Start möglich.

**Beispiel**

rkadk_record_test.

**Verwandte Themen**

RKADK_RECORD_Single_Stop.

#### 2.2.6 RKADK_RECORD_Single_Stop

**Beschreibung**

Aufzeichnung des angegebenen Streams stoppen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Single_Stop(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_EenStrmType);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| enStrmType | Streamtyp | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweise**

RKADK_RECORD_Stop darf erst nach dem Erstellen der Aufgabe aufgerufen werden und wird zusammen mit RKADK_RECORD_Single_Start verwendet. Wiederholtes Stoppen derselben Aufgabe wird nicht unterstützt.

**Beispiel**

rkadk_record_test.

**Verwandte Themen**

RKADK_RECORD_Single_Start

#### 2.2.7 RKADK_RECORD_Reset

**Beschreibung**

Aufzeichnungsaufgabe neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_Reset(RKADK_MW_PTR *ppRecorder);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| ppRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_RECORD_Reset darf erst nach dem Erstellen der Aufgabe aufgerufen werden. Bei Änderung von Auflösung, Framerate, Bitrate, Kodierungs- oder Aufzeichnungstyp die Record-Parameter in der ini-Datei über RKADK_PARAM_SetCamParam anpassen. RV1126/RV1109 und RK3576 unterstützen keinen dynamischen Wechsel von Auflösung und Kodierungstyp.

Zuerst RKADK_RECORD_Destroy aufrufen, dann die neue Auflösung oder den Kodierungstyp einstellen und anschließend erneut RKADK_RECORD_Create aufrufen. Teilen sich Record und andere Module den VI-Kanal, müssen ihre Auflösungen gleichzeitig umgestellt werden, damit VI und VENC übereinstimmen.

**Beispiel**

rkadk_record_test.

**Siehe auch**

Keine

#### 2.2.8 RKADK_RECORD_ManualSplit

**Beschreibung**

Videodateien manuell aufteilen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_ManualSplit(RKADK_MW_PTR pRecorder, RKADK_REC_MANUAL_SPLIT_ATTR_S *pstSplitAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| pstSplitAttr | Attribute der manuellen Aufteilung | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_RECORD_ManualSplit darf erst nach dem Erstellen der Aufgabe aufgerufen werden. Erneutes manuelles Aufteilen ist auch vor Abschluss der vorherigen Aufteilung möglich.

**Beispiel**

rkadk_record_test.

**Siehe auch**

Nein

#### 2.2.9 RKADK_RECORD_GetAencChn

**Beschreibung**

ID des AENC-Kanals für die Aufzeichnung abrufen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_GetAencChn();
```

**Rückgabewert**

ID des für die Aufzeichnung verwendeten AENC-Kanals.

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

#### 2.2.10 RKADK_GetThmInMp4

**Beschreibung**

Vorschaubilddaten aus MP4-Dateien abrufen.

**Syntax**

```c
RKADK_S32 RKADK_GetThmInMp4(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_U8 *pu8Buf, RKADK_U32 *pu32Size);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pszFileName | MP4-Dateipfad | Eingabe |
| pu8Buf | Eingabe: Zeiger auf Vorschaubildspeicher; Ausgabe: tatsächliche Vorschaubilddaten | Input/Output |
| pu32Size | Eingabe: Länge von pu8Buf; Ausgabe: tatsächliche Länge der Vorschaubilddaten | Input/Output |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_thumb.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

Keine

#### 2.2.11 RKADK_GetThmInMp4Ex

**Beschreibung**

Die erweiterte Schnittstelle zum Abrufen von MP4-Vorschaubildern unterstützt die Angabe von Typ und Auflösung des Ausgabebildes. Zusammen mit RKADK_ThmBufFree verwenden.

**Syntax**

```c
RKADK_S32 RKADK_GetThmInMp4Ex(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pszFileName | MP4-Dateipfad | Eingabe |
| pstThumbAttr | Zeiger auf die Vorschaubild-Attributstruktur | Eingabe/Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_thumb.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

RKADK_ThmBufFree

#### 2.2.12 RKADK_ThmBufFree

**Beschreibung**

Von RKADK_GetThmInMp4Ex angeforderten Speicher freigeben. Zusammen mit RKADK_GetThmInMp4Ex verwenden.

**Syntax**

```c
RKADK_S32 RKADK_ThmBufFree(RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstThumbAttr | Zeiger auf die Vorschaubild-Attributstruktur | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_thumb.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

RKADK_GetThmInMp4Ex

#### 2.2.13 RKADK_RECORD_SetRotation

**Beschreibung**

Drehung der Aufnahme einstellen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_SetRotation(RKADK_MW_PTR pRecorder, ROTATION_E enRotation, RKADK_STREAM_TYPE_E enStreamType);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| enRotation | Drehwinkel | Eingabe |
| enStreamType | Streamtyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_record_test

#### 2.2.14 RKADK_RECORD_ToggleMirror

**Beschreibung**

Spiegelung der Aufnahme einstellen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_ToggleMirror(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType, bool mirror);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| enStreamType | Streamtyp | Eingabe |
| mirror | Spiegelung aktivieren | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

#### 2.2.15 RKADK_RECORD_ToggleFlip

**Beschreibung**

Vertikales Spiegeln der Aufnahme einstellen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_ToggleFlip(RKADK_MW_PTR pRecorder, RKADK_STREAM_TYPE_E enStrmType, bool flip);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| enStreamType | Streamtyp | Eingabe |
| flip | Vertikales Spiegeln aktivieren | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

#### 2.2.16 RKADK_RECORD_FileCacheInit

**Beschreibung**

Die Initialisierung von File Cache glättet Dateischreibvorgänge. Bei aktiviertem File Cache werden Dateien über DirectIO auf das Speichermedium geschrieben; der Cache des Kernels ist dabei unwirksam.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_FileCacheInit(FILE_CACHE_ARG *pstFileCacheAttr)
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstFileCacheAttr | Zeiger auf File-Cache-Attribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

File Cache ist standardmäßig deaktiviert. Zum Aktivieren die Umgebungsvariable file_cache_env setzen.

```text
export file_cache_env=1
```

Bei aktiviertem File Cache diese Schnittstelle einmal vor RKADK_RECORD_Create aufrufen; andernfalls ist kein Aufruf erforderlich. File Cache benötigt zusätzlichen Speicher entsprechend u32TotalCache. Paarweise mit RKADK_RECORD_FileCacheDeInit verwenden.

**Beispiel**

rkadk_record_test

#### 2.2.17 RKADK_RECORD_FileCacheDeInit

**Beschreibung**

File Cache deinitialisieren

**Syntax**

```c
RKADK_S32 RKADK_RECORD_FileCacheDeInit();
```

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweis**

Zusammen mit RKADK_RECORD_FileCacheInit verwenden. Bei aktiviertem File Cache nach RKADK_RECORD_Destroy aufrufen; andernfalls ist kein Aufruf nötig. rkadk_record_test.

#### 2.2.18 RKADK_RECORD_FileCacheSetMode

**Beschreibung**

Aufzeichnungstyp für File Cache einstellen.

**Syntax**

```c
void RKADK_RECORD_FileCacheSetMode(RKADK_REC_TYPE_E enRecType);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| enRecType | Aufzeichnungstyp | Eingabe |

**Voraussetzungen**

Headerdatei: rkadk_record.h. Bibliothek: librkadk.so.

**Hinweise**

Bei aktiviertem File Cache muss beim Wechsel des Aufzeichnungstyps dessen neuer Typ über diese API gesetzt werden. rkadk_aov_record_test.

#### 2.2.19 RKADK_MEDIA_EnablePostIsp

**Beschreibung**

Post AI ISP aktivieren. Zusätzlich zur Schnittstelle lässt sich Post AI ISP über post_aiisp in der Sensor-ini aktivieren.

**Syntax**

```c
RKADK_S32 RKADK_MEDIA_EnablePostIsp(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_POST_ISP_ATTR_S *pstPostIspAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Streamtyp | Eingabe |
| pstPostIspAttr | Zeiger auf Post-AI-ISP-Attribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_media_comm.h. Bibliothek: librkadk.so.

#### 2.2.20 RKADK_MEDIA_SetPostIspAttr

**Beschreibung**

Post-AI-ISP-Attribute dynamisch einstellen.

**Syntax**

```c
RKADK_S32 RKADK_MEDIA_SetPostIspAttr(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool bEnable, RKADK_POST_ISP_ATTR_S *pstPostIspAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Streamtyp | Eingabe |
| bEnable | Post-AI-ISP-Schalter, dynamisches Attribut | Eingabe |
| pstPostIspAttr | Zeiger auf Post-AI-ISP-Attribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_media_comm.h. Bibliothek: librkadk.so.

#### 2.2.21 RKADK_RECORD_SetPipAttr

**Beschreibung**

Bild-in-Bild-Attribute (PiP) dynamisch einstellen.

**Syntax**

```c
RKADK_S32 RKADK_RECORD_SetPipAttr(RKADK_MW_PTR pRecorder, RKADK_PIP_ATTR_S *pstPipAttr);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe | Eingabe |
| pstPipAttr | Bild-in-Bild-Attribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_record.h.

Bibliothek: librkadk.so. Hinweis: PiP beim Aufruf von RKADK_RECORD_Create über stPipAttr aktivieren; dadurch wird der PiP-Pfad erstellt.

### 2.3 Datentypen

Wichtige Datentypen des Aufzeichnungsmoduls: RKADK_MW_PTR - Aufgabenzeiger; RECORD_FILE_NUM_MAX - maximale Anzahl gleichzeitig aufgezeichneter Dateien einer Aufgabe; RKADK_REC_EVENT_CALLBACK_FN - Ereignis-Callback; RKADK_REC_TYPE_E - Aufzeichnungstypen; RKADK_REC_REQUEST_FILE_NAMES_FN - Funktion zum Anfordern von Dateinamen; RKADK_REC_PTS_CALLBACK_FN - Callback für Videoframe-Zeitstempel; RKADK_RECORD_ATTR_S - Aufgabenattribute; RKADK_REC_MANUAL_SPLIT_ATTR_S - manuelle Aufteilung; FILE_CACHE_ARG - File-Cache-Attribute; RKADK_POST_ISP_ATTR_S - Post-AI-ISP-Attribute; RKADK_MOUNT_SDCARD_FN - SD-Mount-Funktion; RKADK_AOV_ATTR_S - AOV-Attribute; RKADK_PIP_ATTR_S - PiP-Attribute.

#### 2.3.1 Allgemeine Datentypen

**Beschreibung**

Definition der grundlegenden Datentypen.

**Definition**

```text
typedef unsigned char RKADK_U8;
typedef unsigned short RKADK_U16;
typedef unsigned int RKADK_U32;

typedef signed char RKADK_S8;
typedef short RKADK_S16;
typedef int RKADK_S32;

typedef unsigned long RKADK_UL;
typedef signed long RKADK_SL;
typedef float RKADK_FLOAT;
typedef double RKADK_DOUBLE;

#ifndef _M_IX86
typedef unsigned long long RKADK_U64;
typedef long long RKADK_S64;
#else
typedef unsigned __int64 RKADK_U64;
typedef __int64 RKADK_S64;
#endif

typedef char RKADK_CHAR;
#define RKADK_VOID void

typedef unsigned int RKADK_HANDLE;

typedef RKADK_VOID *RKADK_MW_PTR;

typedef char (*ARRAY_FILE_NAME)[RKADK_MAX_FILE_PATH_LEN];

typedef enum {
  RKADK_FALSE = 0,
  RKADK_TRUE = 1,
} RKADK_BOOL;

#ifndef NULL
#define NULL 0L
#endif

#define RKADK_NULL 0L
#define RKADK_SUCCESS 0
#define RKADK_FAILURE (-1)
```

#### 2.3.2 RKADK_MW_PTR

**Beschreibung**

Aufgabenzeiger definieren

**Definition**

```text
typedef RKADK_VOID *RKADK_MW_PTR;
```

#### 2.3.3 RKADK_MAX_SENSOR_CNT

**Beschreibung**

Maximale unterstützte Sensoranzahl; an die konkrete Konfiguration anpassbar

**Definition**

```text
#define RKADK_MAX_SENSOR_CNT 8
```

#### 2.3.4 RECORD_FILE_NUM_MAX

**Beschreibung**

Maximale Anzahl gleichzeitig von einer Aufgabe aufgezeichneter Dateien.

**Definition**

```text
#define RECORD_FILE_NUM_MAX 2
```

#### 2.3.5 RKADK_REC_EVENT_CALLBACK_FN

**Beschreibung**

Zeiger auf den Aufzeichnungsereignis-Callback.

**Definition**

```text
typedef RKADK_MUXER_EVENT_CALLBACK_FN RKADK_REC_EVENT_CALLBACK_FN;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_EVENT_CALLBACK_FN

#### 2.3.6 RKADK_REC_TYPE_E

**Beschreibung**

Aufzählung der Aufzeichnungstypen.

**Definition**

```text
typedef RKADK_MUXER_REC_TYPE_E RKADK_REC_TYPE_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_REC_TYPE_E

#### 2.3.7 RKADK_REC_REQUEST_FILE_NAMES_FN

**Beschreibung**

Zeiger auf die Funktion zum Anfordern eines Videodateinamens.

**Definition**

```text
typedef RKADK_S32 (*RKADK_REC_REQUEST_FILE_NAMES_FN)(RKADK_MW_PTR pRecorder, RKADK_U32
u32FileCnt, RKADK_CHAR(*paszFilename)[RKADK_MAX_FILE_PATH_LEN]);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pRecorder | Zeiger auf die Aufzeichnungsaufgabe |
| u32FileCnt | Anzahl angeforderter Dateinamen |
| paszFilename | Puffer für Dateinamen |

**Verwandte Datentypen und Schnittstellen**

RKADK_MW_PTR RKADK_RECORD_ATTR_S

#### 2.3.8 RKADK_REC_PTS_CALLBACK_FN

**Beschreibung**

Zeiger auf den Callback für Videoframe-Zeitstempel.

**Definition**

```text
typedef RKADK_MUXER_PTS_CALLBACK_FN RKADK_REC_PTS_CALLBACK_FN;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_PTS_CALLBACK_FN RKADK_RECORD_ATTR_S

#### 2.3.9 RKADK_MOUNT_SDCARD_FN

**Beschreibung**

Zeiger auf die Funktion zum Einhängen der SD-Karte.

**Definition**

```text
typedef int (*RKADK_MOUNT_SDCARD_FN)(void);
```

**Verwandte Datentypen und Schnittstellen**

RKADK_RECORD_ATTR_S

#### 2.3.10 RKADK_RECORD_ATTR_S

**Beschreibung**

Attributstruktur der Aufzeichnungsaufgabe.

**Definition**

```text
typedef struct {
  RKADK_S32 s32CamID;                                  /* Camera ID */
  RKADK_U32 u32FragKeyFrame;
  RKADK_REC_REQUEST_FILE_NAMES_FN pfnRequestFileNames; /* rec callbak */
  RKADK_REC_EVENT_CALLBACK_FN pfnEventCallback;        /* event callbak */
  RKADK_AOV_ATTR_S stAovAttr;
  RKADK_POST_ISP_ATTR_S *pstPostIspAttr;
  RKADK_MOUMNT_SDCARD_FN pfnMountSdcard;
  RKADK_PIP_ATTR_S stPipAttr[RECORD_FILE_NUM_MAX];
  RKADK_U32 u32GetThumbTime[RECORD_FILE_NUM_MAX];      /* get thumbnail delay time(ms) when
enbale file cache, default: 3000(ms) */
  RKADK_THIRD_MUXER_ATTR_S *pstThirdMuxerAttr;         /* third party muxer attr */
} RKADK_RECORD_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32CamID | Kamera-ID |
| u32FragKeyFrame | Videodatei an I-Frames aufteilen |
| pfnRequestFileNames | Zeiger auf die Dateinamenanforderungsfunktion |
| pfnEventCallback | Zeiger auf den Aufzeichnungsereignis-Callback |
| stAovAttr | AOV-Attribute (Always On Video) |
| pstPostIspAttr | Post-AI-ISP-Attribute |
| pfnMountSdcard | Zeiger auf die SD-Mount-Funktion |
| stPipAttr | Bild-in-Bild-Attribute |
| u32GetThumbTime | Verzögerung beim Abrufen des Vorschaubildes mit aktiviertem File Cache, ms |
| pstThirdMuxerAttr | Zeiger auf Attribute eines Drittanbieter-Muxers |

**Verwandte Datentypen und Schnittstellen**

RKADK_REC_EVENT_CALLBACK_FN RKADK_REC_REQUEST_FILE_NAMES_FN RKADK_MOUMNT_SDCARD_FN RKADK_AOV_ATTR_S RKADK_POST_ISP_ATTR_S RKADK_PIP_ATTR_S RKADK_THIRD_MUXER_ATTR_S RKADK_RECORD_Create

#### 2.3.11 RKADK_REC_MANUAL_SPLIT_ATTR_S

**Beschreibung**

Attributstruktur der manuellen Aufteilung.

**Definition**

```text
typedef MUXER_MANUAL_SPLIT_ATTR_S RKADK_REC_MANUAL_SPLIT_ATTR_S;
```

**Verwandte Datentypen und Schnittstellen**

MUXER_MANUAL_SPLIT_ATTR_S RKADK_RECORD_ManualSplit

#### 2.3.12 FILE_CACHE_ARG

**Beschreibung**

Attributstruktur von File Cache.

**Definition**

```text
typedef struct _FILE_CACHE_ARG {
  const char *sdcard_path;
  int write_cache;  /* write cache size(byte), default 1M */
  int total_cache;  /* total cache size(byte), default 10M */
  FILE_WRITE_THREAD_ARG write_thread_arg;
  FILE_SDCARD_ARG sdcard_arg;
} FILE_CACHE_ARG;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| sdcard_path | Mount-Pfad der SD-Karte |
| write_cache | Cache-Größe pro geschriebener Datei |
| total_cache | Gesamte Cache-Größe |
| write_thread_arg | Attribute des Schreibthreads |
| sdcard_arg | SD-Karten-Attribute |

**Verwandte Datentypen und Schnittstellen**

RKADK_RECORD_FileCacheInit FILE_WRITE_THREAD_ARG FILE_SDCARD_ARG

#### 2.3.13 FILE_WRITE_THREAD_ARG

**Beschreibung**

Attributstruktur des Schreibthreads.

**Definition**

```text
typedef enum _FILE_SCHED_POLICY {
  FILE_SCHED_OTHER = 0,
  FILE_SCHED_BATCH,
  FILE_SCHED_IDLE,
  FILE_SCHED_FIFO,      /* sched_priority[1, 99] */
  FILE_SCHED_RR,        /* sched_priority[1, 99] */
} FILE_SCHED_POLICY;

typedef struct _FILE_WRITE_THREAD_ARG {
  FILE_SCHED_POLICY sched_policy;
  int priority; /* SCHED_OTHER/SCHED_IDLE/SCHED_BATCH inoperative */
} FILE_WRITE_THREAD_ARG;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| sched_policy | Thread-Scheduling-Strategie |
| priority | Thread-Priorität |

**Verwandte Datentypen und Schnittstellen**

RKADK_RECORD_FileCacheInit

FILE_CACHE_ARG

#### 2.3.14 FILE_SDCARD_ARG

**Beschreibung**

Attributstruktur der SD-Karte.

**Definition**

```text
typedef struct _FILE_SDCARD_ARG {
    FILE_CACHE_SDCARD_LOCK lock;
    FILE_CACHE_SDCARD_UNLOCK unlock;
    FILE_CACHE_MOUMNT_SDCARD mount_sdcard;
    FILE_CACHE_UMOUMNT_SDCARD umount_sdcard;
} FILE_SDCARD_ARG;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| lock | Sperrfunktion für SD-Kartenoperationen |
| unlock | Entsperrfunktion für SD-Kartenoperationen |
| mount_sdcard | SD-Mount-Funktion |
| umount_sdcard | SD-Unmount-Funktion |

**Verwandte Datentypen und Schnittstellen**

FILE_CACHE_ARG

#### 2.3.15 RKADK_POST_ISP_ATTR_S

**Beschreibung**

Attributstruktur von Post AI ISP.

**Definition**

```text
typedef struct {
  AIISP_CALLBACK_FUNC_S stAiIspCallback;      /* post isp callback function */
  const RK_CHAR        *pModelFilePath;       /* post isp model file path   */
  RK_U32                u32FrameBufCnt;       /* RW; frame buffer cnt    */
} RKADK_POST_ISP_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| stAiIspCallback | Callback zum Aktualisieren der AI-NR-Parameter |
| pModelFilePath | Pfad zur Post-AI-ISP-Modelldatei |
| u32FrameBufCnt | Anzahl der Framepuffer, standardmäßig 1 |

**Verwandte Datentypen und Schnittstellen**

RKADK_MEDIA_EnablePostIsp RKADK_MEDIA_SetPostIspAttr

#### 2.3.16 RKADK_AOV_ATTR_S

**Beschreibung**

Attributstruktur von AOV.

**Definition**

```text
typedef struct {
  RKADK_ISP_WAKE_UP_PAUSE_FN pfnSingleFrame;
  RKADK_ISP_WAKE_UP_RESUME_FN pfnMultiFrame;
} RKADK_AOV_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pfnSingleFrame | Funktionszeiger für den Einzelbildmodus |
| pfnMultiFrame | Funktionszeiger für den Mehrbildmodus |

**Verwandte Datentypen und Schnittstellen**

RKADK_RECORD_Create

#### 2.3.17 RKADK_PIP_ATTR_S

**Beschreibung**

Attributstruktur für Bild-in-Bild.

**Definition**

```text
typedef struct {
  RKADK_BOOL bEnablePip;                      /* enable picture-in-picture */
  RKADK_U32 u32AvsGrpId;                      /* AVS group id [0, AVS_MAX_GRP_NUM)] */
  RKADK_U32 u32AvsBufCnt;                     /* default 2, min value 2 */
  RKADK_U32 u32SubCamId;                      /* subwindow camera id */
  RKADK_STREAM_TYPE_E enSubStreamType;        /* subwindow stream type */
  RKADK_RECT_S stSubRect;                     /* The subwindow is based on the display area
of the main window */
} RKADK_PIP_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bEnablePip | Bild-in-Bild aktivieren |
| u32AvsGrpId | AVS-Gruppen-ID für Bild-in-Bild |
| u32AvsBufCnt | Maximale Anzahl der AVS-Zielbildpuffer |
| u32SubCamId | Kamera-ID des Unterfensters |
| enSubStreamType | Streamtyp des Unterfensters |
| stSubRect | Anzeigebereich des Unterfensters im Hauptfenster |

**Verwandte Datentypen und Schnittstellen**

RKADK_RECORD_Create RKADK_RECORD_SetPipAttr

## 3. Muxer

Das Modul bietet Erstellen, Zerstören, Starten und Stoppen von Muxern sowie manuelle Dateiaufteilung. Jeder Muxer verpackt gleichzeitig bis zu zwei Dateien. Jede Datei enthält mindestens einen Videostream und höchstens einen Video- und einen Audiostream. Mehrere Muxer können gleichzeitig erstellt werden. Streams von Drittanbietern werden unterstützt.

### 3.1 API-Referenz

#### 3.1.1 RKADK_MUXER_Create

**Beschreibung**

Muxer erstellen.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Create(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Muxer-Attribute | Eingabe |
| ppHandle | Zeiger auf den erstellten Muxer | Ausgabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Wiederholtes Erstellen desselben Muxers wird nicht unterstützt. Nach dem Erstellen zunächst RKADK_MUXER_Enable zum Aktivieren, dann RKADK_MUXER_Start zum Starten aufrufen.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Destroy.

#### 3.1.2 RKADK_MUXER_Destroy

**Beschreibung**

Muxer zerstören.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Destroy(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Nur erstellte Muxer können zerstört werden; wiederholtes Zerstören wird nicht unterstützt. Vorher mit RKADK_MUXER_Stop stoppen und anschließend mit RKADK_MUXER_Disable deaktivieren.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Create

#### 3.1.3 RKADK_MUXER_Enable

**Beschreibung**

Muxer aktivieren.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Enable(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Muxer-Attribute | Eingabe |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Zusammen mit RKADK_MUXER_Disable verwenden.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Disable.

#### 3.1.4 RKADK_MUXER_Disable

**Beschreibung**

Muxer deaktivieren.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Disable(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Zusammen mit RKADK_MUXER_Enable verwenden.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Enable

#### 3.1.5 RKADK_MUXER_Start

**Beschreibung**

Muxer initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Start(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Ein gestoppter Muxer kann erneut gestartet werden.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Stop

#### 3.1.6 RKADK_MUXER_Stop

**Beschreibung**

Muxer stoppen.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Stop(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Wiederholtes Stoppen desselben Muxers wird nicht unterstützt.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Start

#### 3.1.7 RKADK_MUXER_Single_Start

**Beschreibung**

Muxer des angegebenen Streams starten.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Single_Start(RKADK_MW_PTR pHandle, int s32MuxerId, int s32VencChn);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |
| s32MuxerId | Muxer-ID | Eingabe |
| s32VencChn | VENC-Kanal; für einen Drittanbieter-Stream muss s32VencChn auf -1 gesetzt werden | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Zusammen mit RKADK_MUXER_Single_Stop verwenden. Ein erneuter Start nach dem Stoppen wird unterstützt.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Single_Stop

#### 3.1.8 RKADK_MUXER_Single_Stop

**Beschreibung**

Muxer des angegebenen Streams stoppen.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Single_Stop(RKADK_MW_PTR pHandle, int s32MuxerId, int s32VencChn);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |
| s32MuxerId | Muxer-ID | Eingabe |
| s32VencChn | VENC-Kanal; beim Verpacken eines Drittanbieter-Streams muss s32VencChn auf -1 gesetzt werden | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Zusammen mit RKADK_MUXER_Single_Start verwenden. Wiederholtes Stoppen desselben Muxers wird nicht unterstützt.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Single_Start

#### 3.1.9 RKADK_MUXER_ManualSplit

**Beschreibung**

Dateien manuell aufteilen.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_ManualSplit(RKADK_MW_PTR pHandle, RKADK_MUXER_MANUAL_SPLIT_ATTR_S *pstSplitAttr);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pRecorder | Muxer-Zeiger | Eingabe |
| pstSplitAttr | Attribute der manuellen Aufteilung | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Erneutes manuelles Aufteilen vor Abschluss der vorherigen Aufteilung wird unterstützt.

**Beispiel**

rkadk_muxer_test

#### 3.1.10 RKADK_MUXER_Reset

**Beschreibung**

Muxer zurücksetzen.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_Reset(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librokadk.so.

**Hinweise**

Vor RKADK_MUXER_Reset den Muxer mit RKADK_MUXER_SetResetState in den Reset-Zustand versetzen. Danach mit RKADK_MUXER_ResetParam die Parameter neu konfigurieren und anschließend mit RKADK_MUXER_SetResetState den Reset-Zustand wieder verlassen.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_ResetParam RKADK_MUXER_SetResetState

#### 3.1.11 RKADK_MUXER_ResetParam

**Beschreibung**

Muxer-Parameter neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_ResetParam(RKADK_MUXER_ATTR_S *pstMuxerAttr, RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pstMuxerAttr | Muxer-Attribute | Eingabe |
| pHandle | Muxer-Zeiger | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Reset RKADK_MUXER_SetResetState

#### 3.1.12 RKADK_MUXER_SetResetState

**Beschreibung**

Reset-Zustand des Muxers setzen.

**Syntax**

```c
void RKADK_MUXER_SetResetState(RKADK_MW_PTR pHandle, bool state);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Muxer-Zeiger | Eingabe |
| state | Reset-Zustand: True vor dem Reset, False danach | Eingabe |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_muxer_test.

**Verwandte Themen**

RKADK_MUXER_Reset RKADK_MUXER_ResetParam

#### 3.1.13 RKADK_MUXER_BuildInThumb

**Beschreibung**

Vorschaubilder in Dateien einbetten.

**Syntax**

```c
RKADK_S32 RKADK_MUXER_BuildInThumb(RKADK_MW_PTR pHandle, RKADK_MUXER_THUMB_INFO_S stThumbInfo);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Encoder-Zeiger | Eingabe |
| stThumbInfo | Vorschaubildinformationen | Eingabe |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Hinweise**

Zum Einbetten von Vorschaubildern bei RKADK_MUXER_Create deren Auflösung korrekt einstellen, damit Speicherplatz reserviert wird. Nur MP4-Dateien unterstützen eingebettete Vorschaubilder.

**Beispiel**

rkadk_muxer_test.

#### 3.1.14 RKADK_MUXER_WriteVideoFrame

**Beschreibung**

Videostreamdaten schreiben.

**Syntax**

```c
int RKADK_MUXER_WriteVideoFrame(RKADK_MUXER_DATA_S stData, void *handle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| handle | Muxer-Zeiger | Eingabe |
| stData | Videostreamdaten | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_muxer_test.

#### 3.1.15 RKADK_MUXER_WriteAudioFrame

**Beschreibung**

Audiostreamdaten schreiben.

**Syntax**

```c
int RKADK_MUXER_WriteAudioFrame(RKADK_MUXER_DATA_S stData, void *handle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| handle | Muxer-Zeiger | Eingabe |
| stData | Audiostreamdaten | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_muxer.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_muxer_test.

### 3.2 Datentypen

Wichtige Muxer-Datentypen: RKADK_MUXER_FILE_TYPE_E - Dateitypen; RKADK_MUXER_EVENT_E - Ereignisse; RKADK_MUXER_FILE_EVENT_INFO_S - Dateiereignisinformationen; RKADK_MUXER_EVENT_INFO_S - Muxer-Ereignisinformationen; RKADK_MUXER_EVENT_CALLBACK_FN - Ereignis-Callback; RKADK_MUXER_MANUAL_SPLIT_ATTR_S - Attribute der manuellen Aufteilung; RKADK_MUXER_MANUAL_SPLIT_TYPE_E - Arten der manuellen Aufteilung; RKADK_MUXER_ATTR_S - Muxer-Attribute; RKADK_MUXER_REC_TYPE_E - Aufzeichnungstypen; RKADK_MUXER_TYPE_E - Muxer-Typen; RKADK_MUXER_REQUEST_FILE_NAME_CB - Dateinamenanforderung; RKADK_MUXER_STREAM_ATTR_S - Streamattribute; RKADK_MUXER_PRE_RECORD_ATTR_S - Voraufzeichnungsattribute; RKADK_MUXER_PRE_RECORD_MODE_E - Voraufzeichnungsmodi; RKADK_MUXER_PTS_CALLBACK_FN - Zeitstempel-Callback; RKADK_MUXER_PTS_INFO_S - Zeitstempelinformationen; RKADK_MUXER_DATA_S - Verpackungsdaten; RKADK_MUXER_THUMB_INFO_S - Vorschaubildinformationen; RKADK_THIRD_MUXER_ATTR_S - Attribute eines Drittanbieter-Muxers.

#### 3.2.1 RKADK_MUXER_FILE_TYPE_E

**Beschreibung**

Aufzählung der Muxer-Dateitypen.

**Definition**

```text
typedef enum rkMUXER_TYPE_E {
  RKADK_MUXER_TYPE_MP4 = 0,
  RKADK_MUXER_TYPE_MPEGTS,
  RKADK_MUXER_TYPE_FLV,
  RKADK_MUXER_TYPE_BUTT
} RKADK_MUXER_FILE_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_MUXER_TYPE_MP4 | MP4 |
| RKADK_MUXER_TYPE_MPEGTS | TS |
| RKADK_MUXER_TYPE_FLV | FLV |

**Hinweise**

Nur MP4-Dateien unterstützen eingebettete Vorschaubilder.

#### 3.2.2 RKADK_MUXER_EVENT_E

**Beschreibung**

Aufzählung der Muxer-Ereignisse.

**Definition**

```text
typedef enum rkMUXER_EVENT_E {
  RKADK_MUXER_EVENT_STREAM_START = 0,
  RKADK_MUXER_EVENT_STREAM_STOP,
  RKADK_MUXER_EVENT_FILE_BEGIN,
  RKADK_MUXER_EVENT_FILE_END,
  RKADK_MUXER_EVENT_MANUAL_SPLIT_END,
  RKADK_MUXER_EVENT_ERR_CREATE_FILE_FAIL,
  RKADK_MUXER_EVENT_ERR_WRITE_FILE_FAIL,
  RKADK_MUXER_EVENT_FILE_WRITING_SLOW,
  RKADK_MUXER_EVENT_ERR_CARD_NONEXIST,
  RKADK_MUXER_EVENT_BUTT
} RKADK_MUXER_EVENT_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_MUXER_EVENT_STREAM_START | Aufzeichnung starten |
| RKADK_MUXER_EVENT_STREAM_STOP | Aufzeichnung stoppen |
| RKADK_MUXER_EVENT_FILE_BEGIN | Aufzeichnung einer neuen Datei starten |
| RKADK_MUXER_EVENT_FILE_END | Dateiaufzeichnung beendet |
| RKADK_MUXER_EVENT_MANUAL_SPLIT_END | Aufzeichnung der manuell aufgeteilten Datei beendet |
| RKADK_MUXER_EVENT_ERR_GET_FILENAME | Dateiname konnte nicht abgerufen werden |
| RKADK_MUXER_EVENT_ERR_CREATE_FILE_FAIL | Reserviert |
| RKADK_MUXER_EVENT_ERR_WRITE_FILE_FAIL | Dateischreiben fehlgeschlagen |
| RKADK_MUXER_EVENT_FILE_WRITING_SLOW | Langsames Dateischreiben |
| RKADK_MUXER_EVENT_ERR_CARD_NONEXIST | SD-Karte nicht vorhanden |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.3 RKADK_MUXER_FILE_EVENT_INFO_S

**Beschreibung**

Struktur der Dateiereignisinformationen.

**Definition**

```text
typedef struct {
  RK_CHAR asFileName[RKADK_MUXER_FILE_NAME_LEN];
  RK_U32 u32Duration; // ms
} RKADK_MUXER_FILE_EVENT_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| asFileName | Dateiname |
| u32Duration | Tatsächliche Dauer der aufgezeichneten Datei |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.4 RKADK_MUXER_EVENT_INFO_S

**Beschreibung**

Struktur der Muxer-Ereignisinformationen.

**Definition**

```text
typedef struct {
  RKADK_MUXER_EVENT_E enEvent;
  union {
    RKADK_MUXER_FILE_EVENT_INFO_S stFileInfo;
    RKADK_MUXER_ERROR_EVENT_INFO_S stErrorInfo;
  } unEventInfo;
} RKADK_MUXER_EVENT_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enEvent | Typ des Aufzeichnungsereignisses |
| stFileInfo | Dateiereignisinformationen |
| stErrorInfo | Fehlerereignisinformationen (reserviert) |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_EVENT_E RKADK_MUXER_FILE_EVENT_INFO_S

#### 3.2.5 RKADK_MUXER_EVENT_CALLBACK_FN

**Beschreibung**

Zeiger auf den Muxer-Ereignis-Callback.

**Definition**

```text
typedef RKADK_VOID (*RKADK_MUXER_EVENT_CALLBACK_FN)(RKADK_MW_PTR pRecorder, const
RKADK_MUXER_EVENT_INFO_S *pstEventInfo);
```

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_EVENT_INFO_S

#### 3.2.6 RKADK_REC_MANUAL_SPLIT_ATTR_S

**Beschreibung**

Attributstruktur der manuellen Aufteilung.

**Definition**

```text
typedef struct {
  RKADK_MUXER_MANUAL_SPLIT_TYPE_E enManualType;               /* maual split type */
  RKADK_U32 u32DurationSec; /* file duration of manual split file */
} MUXER_MANUAL_SPLIT_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enManualType | Art der manuellen Aufteilung |
| u32DurationSec | Videodauer bei manueller Aufteilung |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_MANUAL_SPLIT_TYPE_E RKADK_MUXER_ManualSplit

#### 3.2.7 RKADK_MUXER_MANUAL_SPLIT_TYPE_E

**Beschreibung**

Art der manuellen Aufteilung.

**Definition**

```text
typedef enum {
  MUXER_PRE_MANUAL_SPLIT,      /* pre manual split type */
  MUXER_NORMAL_MANUAL_SPLIT,   /* normal manual split type */
} RKADK_MUXER_MANUAL_SPLIT_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| MUXER_PRE_MANUAL_SPLIT | Videodateien manuell aufteilen und voraufzeichnen |
| MUXER_NORMAL_MANUAL_SPLIT | Videodateien manuell aufteilen |

**Verwandte Datentypen und Schnittstellen**

RKADK_REC_MANUAL_SPLIT_ATTR_S

#### 3.2.8 RKADK_THIRD_MUXER_ATTR_S

**Beschreibung**

Attributstruktur eines Drittanbieter-Muxers.

**Definition**

```text
typedef struct {
  RKADK_THIRD_MUXER_INIT_FN pfnMuxerInit;
  RKADK_THIRD_MUXER_DEINIT_FN pfnMuxerDeinit;
  RKADK_THIRD_MUXER_WRITE_VIDEO_FN pfnWriteVideo;
  RKADK_THIRD_MUXER_WRITE_AUDIO_FN pfnWriteAudio;
  RKADK_THIRD_MUXER_GET_THUMB_POS_FN pfnGetThumbPos;
} RKADK_THIRD_MUXER_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pfnMuxerInit | Zeiger auf die Initialisierungsfunktion des Drittanbieter-Muxers |
| pfnMuxerDeinit | Zeiger auf die Deinitialisierungsfunktion des Drittanbieter-Muxers |
| pfnWriteVideo | Zeiger auf die Videoframe-Schreibfunktion des Drittanbieter-Muxers |
| pfnWriteAudio | Zeiger auf die Audioframe-Schreibfunktion des Drittanbieter-Muxers |
| pfnGetThumbPos | Zeiger zum Ermitteln der Vorschaubild-Schreibposition des Drittanbieter-Muxers |

**Hinweise**

Bei aktiviertem Drittanbieter-Muxer wird das Abrufen von Videovorschaubildern über RKADK_GetthmInMp4 und RKADK_GetthmInMp4Ex nicht unterstützt.

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_ATTR_S

#### 3.2.9 RKADK_MUXER_ATTR_S

**Beschreibung**

Attributstruktur des Muxers.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_MUXER_REC_TYPE_E enRecType;
  RKADK_MUXER_TYPE_E enMuxerType;
  RKADK_U32 u32StreamCnt; /* stream cnt */
  RKADK_U32 u32FragKeyFrame;
  RKADK_MUXER_STREAM_ATTR_S
  astStreamAttr[RKADK_MUXER_STREAM_MAX_CNT]; /* array of stream attr */
  RKADK_MUXER_PRE_RECORD_ATTR_S stPreRecordAttr;
  RKADK_MUXER_REQUEST_FILE_NAME_CB pcbRequestFileNames;
  RKADK_MUXER_EVENT_CALLBACK_FN pfnEventCallback;
  RKADK_MUXER_PTS_CALLBACK_FN pfnPtsCallback;
  RKADK_AOV_ATTR_S stAovAttr;
  RKADK_MOUMNT_SDCARD_FN pfnMountSdcard;
  bool bEnableAiisp;
  RKADK_THIRD_MUXER_ATTR_S *pstThirdMuxerAttr;         /* third party muxer attr */
} RKADK_MUXER_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamerakennung |
| enRecType | Aufzeichnungstyp; Drittanbieter-Streams unterstützen keinen AOV-Zeitraffer |
| enMuxerType | Muxer-Typ |
| u32StreamCnt | Anzahl der Muxer-Streams |
| u32FragKeyFrame | Datei an I-Frames aufteilen |
| astStreamAttr | Muxer-Streamattribute |
| stPreRecordAttr | Voraufzeichnungsattribute |
| pcbRequestFileNames | Zeiger auf die Dateinamenanforderungsfunktion |
| pfnEventCallback | Zeiger auf den Ereignis-Callback |
| pfnPtsCallback | Zeiger auf den Zeitstempel-Callback des aktuellen Videoframes |
| stAovAttr | AOV-Attribute (Always On Video); Drittanbieter-Streams werden nicht unterstützt |
| pfnMountSdcard | Zeiger auf die SD-Mount-Funktion; im AOV-Zeitraffermodus erforderlich |
| bEnableAiisp | Aiisp aktivieren |
| pstThirdMuxerAttr | Zeiger auf Attribute eines Drittanbieter-Muxers |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_REC_TYPE_E RKADK_MUXER_TYPE_E RKADK_MUXER_STREAM_ATTR_S RKADK_MUXER_PRE_RECORD_ATTR_S RKADK_MUXER_REQUEST_FILE_NAME_CB

RKADK_MUXER_EVENT_CALLBACK_FN RKADK_MUXER_PTS_CALLBACK_FN RKADK_AOV_ATTR_S RKADK_MOUMNT_SDCARD_FN RKADK_THIRD_MUXER_ATTR_S RKADK_MUXER_Create RKADK_MUXER_ResetParam

#### 3.2.10 RKADK_MUXER_REC_TYPE_E

**Beschreibung**

Aufzählung der Muxer-Aufzeichnungstypen.

**Definition**

```text
typedef enum {
  RKADK_REC_TYPE_NORMAL = 0, /* normal record */
  RKADK_REC_TYPE_LAPSE,      /* time lapse record */
  RKADK_REC_TYPE_AOV_LAPSE,  /* low power time lapse record */
  RKADK_REC_TYPE_BUTT
} RKADK_MUXER_REC_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_REC_TYPE_NORMAL | Normale Aufzeichnung |
| RKADK_REC_TYPE_LAPSE | Zeitraffervideo |
| RKADK_REC_TYPE_AOV_LAPSE | Zeitrafferaufzeichnung mit geringer Leistungsaufnahme |

**Verwandte Datentypen und Schnittstellen**

Keine. Hinweis: Nur RV1126, RV1106 und RV1126B unterstützen AOV-Zeitrafferaufzeichnung.

#### 3.2.11 RKADK_MUXER_TYPE_E

**Beschreibung**

Aufzählung der Muxer-Typen.

**Definition**

```text
typedef enum {
  RKADK_MUXER_TYPE_RECORD = 0,
  RKADK_MUXER_TYPE_THIRD_STREAM,
} RKADK_MUXER_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_MUXER_TYPE_RECORD | Muxer für lokale Aufzeichnung |
| RKADK_MUXER_TYPE_THIRD_STREAM | Muxer für Drittanbieter-Streams |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_ATTR_S

#### 3.2.12 RKADK_MUXER_REQUEST_FILE_NAME_CB

**Beschreibung**

Zeiger auf den Callback zur Dateinamenanforderung.

**Definition**

```text
typedef int (*RKADK_MUXER_REQUEST_FILE_NAME_CB)(void *pHandle, char *pcFileName, unsigned
int u32MuxerId);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pHandle | Encoder-Zeiger |
| pcFileName | Dateinamenzeiger |
| u32MuxerId | Muxer-ID |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_ATTR_S

#### 3.2.13 RKADK_MUXER_PTS_CALLBACK_FN

**Beschreibung**

Zeiger auf den Callback für Videoframe-Zeitstempel.

**Definition**

```text
typedef RKADK_VOID (*RKADK_MUXER_PTS_CALLBACK_FN)(const RKADK_MUXER_PTS_INFO_S *pstPtsInfo);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pstPtsInfo | Zeiger auf Videoframe-Zeitstempelinformationen |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_PTS_INFO_S RKADK_MUXER_ATTR_S

#### 3.2.14 RKADK_MUXER_PTS_INFO_S

**Beschreibung**

Struktur der Zeitstempelinformationen.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_S32 s32MuxerId;
  RKADK_U32 u32ChnId;
  RKADK_U64 u64PTS;
  RKADK_U32 u32Seq;
  const char *pFileName;
} RKADK_MUXER_PTS_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamera-ID |
| s32MuxerId | Muxer-ID |
| u32ChnId | VENC-Kanal |
| u64PTS | Frame-Zeitstempel |
| u32Seq | Frame-Sequenznummer |
| pFileName | Dateiname |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_PTS_CALLBACK_FN

#### 3.2.15 RKADK_MUXER_STREAM_ATTR_S

**Beschreibung**

Attributstruktur des Muxer-Streams.

**Definition**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  /* If it is a third-party stream that is not Rockit(such as a network stream),
    * s32ViChn/s32VencChn must set to -1.
  */
  RKADK_S32 s32ViChn;
  RKADK_S32 s32VencChn;
  RKADK_S32 s32ThumbVencChn;
  bool bUseVpss;
  RKADK_U32 u32TimeLenSec; /* record time */
  RKADK_PIP_ATTR_S stPipAttr;
  RKADK_U32 u32GetThumbTime;
  RKADK_U32 u32TrackCnt;   /* track cnt*/
  RKADK_MUXER_TRACK_SOURCE_S
  aHTrackSrcHandle[RKADK_MUXER_TRACK_MAX_CNT]; /* array of track source cnt */
  RKADK_MUXER_FILE_TYPE_E enType;
} RKADK_MUXER_STREAM_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32MuxerId | Muxer-ID |
| s32ViChn | VI-Kanal; für Drittanbieter-Streams auf -1 setzen |
| s32VencChn | VENC-Kanal; für Drittanbieter-Streams auf -1 setzen |
| s32ThumbVencChn | VENC-Kanal für Vorschaubilder; für Drittanbieter-Streams auf -1 setzen |
| bUseVpss | VPSS verwenden; für Drittanbieter-Streams auf False setzen |
| u32TimeLenSec | Dateiname |
| stPipAttr | PiP-Attribute; für Drittanbieter-Streams unwirksam |
| u32GetThumbTime | Zeitpunkt der Vorschaubildeinbettung, standardmäßig 3000 ms |
| u32TrackCnt | Anzahl der Streams |
| aHTrackSrcHandle | Streamattribute |
| enType | Dateityp |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_TRACK_SOURCE_S RKADK_MUXER_FILE_TYPE_E

#### 3.2.16 RKADK_MUXER_TRACK_SOURCE_S

**Beschreibung**

Attributstruktur des Muxer-Streams.

**Definition**

```text
typedef struct {
  RKADK_TRACK_SOURCE_TYPE_E enTrackType;
  union {
    RKADK_TRACK_VIDEO_SOURCE_INFO_S stVideoInfo; /* <video track info */
    RKADK_TRACK_AUDIO_SOURCE_INFO_S stAudioInfo; /* <audio track info */
  } unTrackSourceAttr;
} RKADK_MUXER_TRACK_SOURCE_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enTrackType | Streamtyp |
| stVideoInfo | Videostreamattribute |
| stAudioInfo | Audiostreamattribute |

**Verwandte Datentypen und Schnittstellen**

RKADK_TRACK_SOURCE_TYPE_E RKADK_TRACK_VIDEO_SOURCE_INFO_S RKADK_TRACK_AUDIO_SOURCE_INFO_S

#### 3.2.17 RKADK_TRACK_SOURCE_TYPE_E

**Beschreibung**

Aufzählung der Muxer-Streamspurtypen.

**Definition**

```text
typedef enum {
  RKADK_TRACK_SOURCE_TYPE_VIDEO = 0,
  RKADK_TRACK_SOURCE_TYPE_AUDIO,
  RKADK_TRACK_SOURCE_TYPE_BUTT
} RKADK_TRACK_SOURCE_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_TRACK_SOURCE_TYPE_VIDEO | Videostream |
| RKADK_TRACK_SOURCE_TYPE_AUDIO | Audiostream |

#### 3.2.18 RKADK_TRACK_VIDEO_SOURCE_INFO_S

**Beschreibung**

Attributstruktur des Muxer-Videostreams.

**Definition**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_CHAR cPixFmt[RKADK_PIX_FMT_LEN];
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32BitRate;
  RKADK_U32 u32FrameRate;
  RKADK_U32 u32Gop;
  RKADK_U16 u16Profile;
  RKADK_U16 u16Level;
  RKADK_U32 u32ThumbWidth;
  RKADK_U32 u32ThumbHeight;
} RKADK_TRACK_VIDEO_SOURCE_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enCodecType | Kodierungstyp |
| cPixFmt | Pixelformat |
| u32Width | Bildbreite |
| u32Height | Bildhöhe |
| u32BitRate | Bitrate |
| u32FrameRate | Framerate |
| u32Gop | GOP |
| u16Profile | Kodierungsprofil |
| u16Level | Kodierungslevel |
| u32ThumbWidth | Vorschaubildbreite |
| u32ThumbHeight | Vorschaubildhöhe |

#### 3.2.19 RKADK_TRACK_AUDIO_SOURCE_INFO_S

**Beschreibung**

Attributstruktur des Muxer-Audiostreams.

**Definition**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U16 u32BitWidth;
  RKADK_U32 u32ChnCnt;
  RKADK_U32 u32SampleRate;
  RKADK_U32 u32SamplesPerFrame;
  RKADK_U32 u32Bitrate;
} RKADK_TRACK_AUDIO_SOURCE_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enCodecType | Codec-Typ |
| u32BitWidth | Bitbreite |
| u32ChnCnt | Kanalanzahl |
| u32SampleRate | Abtastrate |
| u32SamplesPerFrame | Samples pro Frame |
| u32Bitrate | Bitrate |

#### 3.2.20 RKADK_MUXER_PRE_RECORD_ATTR_S

**Beschreibung**

Attributstruktur der Voraufzeichnung.

**Definition**

```text
typedef struct {
  RKADK_U32 u32PreRecTimeSec; /* pre record time, unit in second(s) */
  RKADK_U32 u32PreRecCacheTime;
  RKADK_MUXER_PRE_RECORD_MODE_E enPreRecordMode;
} RKADK_MUXER_PRE_RECORD_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32PreRecTimeSec | Voraufzeichnungsdauer |
| u32PreRecCacheTime | Cache-Dauer der Voraufzeichnung |
| enPreRecordMode | Voraufzeichnungsmodus |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_PRE_RECORD_MODE_E RKADK_MUXER_ATTR_S

**Hinweise**

u32PreRecCacheTime muss mindestens u32PreRecTimeSec betragen und eine vollständige GoP enthalten, damit der I-Frame korrekt abgerufen werden kann.

#### 3.2.21 RKADK_MUXER_PRE_RECORD_MODE_E

**Beschreibung**

Aufzählung der Voraufzeichnungsmodi.

**Definition**

```text
typedef enum {
  RKADK_MUXER_PRE_RECORD_NONE = 0,
  RKADK_MUXER_PRE_RECORD_MANUAL_SPLIT, /* manual split file prerecord */
  RKADK_MUXER_PRE_RECORD_SINGLE        /* first file prerecord */
} RKADK_MUXER_PRE_RECORD_MODE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_MUXER_PRE_RECORD_NONE | Keine Voraufzeichnung |
| RKADK_MUXER_PRE_RECORD_MANUAL_SPLIT | Voraufzeichnung bei manueller Dateiaufteilung |
| RKADK_MUXER_PRE_RECORD_SINGLE | Voraufzeichnung der ersten Datei |

#### 3.2.22 RKADK_MUXER_DATA_S

**Beschreibung**

Datenstruktur des Muxers.

**Definition**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  RKADK_S32 s32VencChn;
  int isKeyFrame;
  RKADK_U64 u64Pts;
  RKADK_U32 u32Seq;
  RKADK_U32 u32Len;
  MB_BLK pMbBlk;
} RKADK_MUXER_DATA_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32MuxerId | Muxer-ID |
| s32VencChn | VENC-Kanal; für Drittanbieter-Streams auf -1 setzen |
| isKeyFrame | Kennzeichnung als Schlüsselframe |
| u64Pts | Frame-Zeitstempel |
| u32Seq | Frame-Sequenznummer |
| u32Len | Länge der Framedaten |
| pMbBlk | Zeiger auf den Framepufferblock |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_WriteVideoFrame RKADK_MUXER_WriteAudioFrame

#### 3.2.23 RKADK_MUXER_THUMB_INFO_S

**Beschreibung**

Struktur der Vorschaubildinformationen.

**Definition**

```text
typedef struct {
  RKADK_S32 s32MuxerId;
  unsigned char* pBuf;
  RKADK_U32 u32Len;
} RKADK_MUXER_THUMB_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32MuxerId | Muxer-ID |
| pBuf | Zeiger auf Vorschaubilddaten |
| u32Len | Länge der Vorschaubilddaten |

**Verwandte Datentypen und Schnittstellen**

RKADK_MUXER_BuildInThumb

## 4. AOV (kontinuierliche Videoaufzeichnung)

### 4.1 Überblick

AOV (Always On Video) zeichnet durch Schlaf-/Aufwachzyklen kontinuierlich mit niedriger Framerate auf. Ereignisse wie KI-Erkennung, PIR-Auslösung oder WLAN-Aufwecken können zur normalen Framerate zurückschalten. File Cache wird empfohlen; siehe RKADK_RECORD_FileCacheInit und RKADK_RECORD_FileCacheDeInit im Aufzeichnungskapitel. Um im AOV-Zeitraffermodus Energie zu sparen, wird die SD-Karte im Schlaf stromlos geschaltet; die Anwendung muss sie zuvor aushängen. Bei aktiviertem File Cache versucht dieser beim Schreiben die Karte einzuhängen und schützt den Schreibvorgang vor einem zwischenzeitlichen Aushängen. Der AOV-Ablauf ist unten dargestellt.

![AOV](/docs/rockchip-rkadk/assets/en-p068-figure-01.png)

### 4.2 API-Referenz

#### 4.2.1 RKADK_AOV_Init

**Beschreibung**

AOV initialisieren.

**Syntax**

```c
int RKADK_AOV_Init(RKADK_AOV_ARG_S *pstAovAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstAovAttr | Zeiger auf AOV-Attribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Hinweis**

Zusammen mit RKADK_AOV_DeInit verwenden. Wiederholte Initialisierung wird nicht unterstützt.

**Beispiel**

rkadk_aov_record_test

**Verwandtes Thema**

RKADK_AOV_DeInit

#### 4.2.2 RKADK_AOV_DeInit

**Beschreibung**

AOV deinitialisieren.

**Syntax**

```c
int RKADK_AOV_DeInit();
```

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Hinweis**

Zusammen mit RKADK_AOV_Init verwenden. Wiederholte Deinitialisierung wird nicht unterstützt.

**Beispiel**

rkadk_aov_record_test

**Verwandtes Thema**

RKADK_AOV_Init

#### 4.2.3 RKADK_AOV_SetSuspendTime

**Beschreibung**

Geplante AOV-Schlafdauer in ms einstellen.

**Syntax**

```c
int RKADK_AOV_SetSuspendTime(int u32WakeupSuspendTime);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32WakeupSuspendTime | Schlafdauer | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_aov_record_test

#### 4.2.4 RKADK_AOV_EnterSleep

**Beschreibung**

In AOV wechseln.

**Syntax**

```c
int RKADK_AOV_EnterSleep();
```

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_aov_record_test

#### 4.2.5 RKADK_AOV_WakeupLock

**Beschreibung**

AOV-Operationen sperren.

**Syntax**

```c
void RKADK_AOV_WakeupLock();
```

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Hinweis**

Zusammen mit RKADK_AOV_WakeupUnlock verwenden.

**Beispiel**

rkadk_aov_record_test

**Verwandtes Thema**

RKADK_AOV_WakeupUnlock

#### 4.2.6 RKADK_AOV_WakeupUnlock

**Beschreibung**

AOV-Operationen entsperren.

**Syntax**

```c
void RKADK_AOV_WakeupUnlock();
```

**Voraussetzungen**

Headerdatei: rkadk_aov.h. Bibliothek: librkadk.so.

**Hinweis**

Zusammen mit RKADK_AOV_WakeupLock verwenden.

**Beispiel**

rkadk_aov_record_test

**Verwandtes Thema**

RKADK_AOV_WakeupLock

### 4.3 Datentypen

Wichtige AOV-Datentypen: RKADK_AOV_ARG_S - AOV-Attributstruktur; RKADK_AOV_NOTIFY_CALLBACK - Zeiger auf den AOV-Benachrichtigungs-Callback.

#### 4.3.1 RKADK_AOV_ARG_S

**Definition**

Attributstruktur von AOV.

**Definition**

```text
typedef struct {
   RKADK_AOV_NOTIFY_CALLBACK pfnNotifyCallback;
} RKADK_AOV_ARG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pfnNotifyCallback | Zeiger auf den AOV-Benachrichtigungs-Callback |

Verwandte Datentypen und Schnittstellen: RKADK_AOV_Init, RKADK_AOV_NOTIFY_CALLBACK

#### 4.3.2 RKADK_AOV_NOTIFY_CALLBACK

**Definition**

Zeiger auf den AOV-Benachrichtigungs-Callback.

**Definition**

```text
typedef void (*RKADK_AOV_NOTIFY_CALLBACK)(RKADK_AOV_EVENT_E enEvent, void *msg);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enEvent | Aufzählung der AOV-Benachrichtigungsereignisse |
| msg | Reserviert |

Verwandte Datentypen und Schnittstellen: RKADK_AOV_ARG_S, RKADK_AOV_EVENT_E

#### 4.3.3 RKADK_AOV_EVENT_E

**Definition**

Aufzählung der AOV-Benachrichtigungsereignisse.

**Definition**

```text
typedef enum {
   RKADK_AOV_ENTER_SLEEP = 0,
   RKADK_AOV_EVENT_BUTT
} RKADK_AOV_EVENT_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_AOV_ENTER_SLEEP | AOV-Schlafmodus betreten |

Verwandte Datentypen und Schnittstellen

RKADK_AOV_NOTIFY_CALLBACK

## 5. Fotoaufnahme

### 5.1 Überblick

Grundlegende Fotoaufnahme mit JPEG-Kapselung: Einzelaufnahmen, Serienaufnahmen und JPEG Slice. JPEG Slice kodiert VI-Daten abschnittsweise in JPEG und spart Speicher. Beim Vergrößern werden die VI-Daten abschnittsweise interpoliert und anschließend abschnittsweise in JPEG kodiert. Die Segmenthöhe muss auf 16 Pixel ausgerichtet sein. Für gute Zusammensetzung sollte das Seitenverhältnis der Segmente möglichst dem Originalbild entsprechen. Mehr Segmente sparen Speicher, verlängern aber die Bilderzeugung; weniger Segmente benötigen mehr Speicher, beschleunigen jedoch die Verarbeitung. Die Segmentanzahl richtet sich nach dem konkreten Einsatz.

### 5.2 API-Referenz

#### 5.2.1 RKADK_PHOTO_Init

**Beschreibung**

Fotoaufnahmeaufgabe initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_Init(RKADK_PHOTO_ATTR_S *pstPhotoAttr, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstPhotoAttr | Zeiger auf Attribute der Fotoaufgabe | Eingabe |
| ppHandle | Zeiger auf die erstellte Fotoaufgabe | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholte Initialisierung wird nicht unterstützt.

**Beispiel**

rkadk_photo_test

**Siehe auch**

RKADK_PHOTO_DeInit

#### 5.2.2 RKADK_PHOTO_DeInit

**Beschreibung**

Fotoaufnahmeaufgabe deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_DeInit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Fotoaufnahmeaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholte Deinitialisierung wird nicht unterstützt.

**Beispiel**

rkadk_photo_test

**Siehe auch**

RKADK_PHOTO_DeInit

#### 5.2.3 RKADK_PHOTO_TakePhoto

**Beschreibung**

Fotos aufnehmen.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_TakePhoto(RKADK_MW_PTR pHandle, RKADK_TAKE_PHOTO_ATTR_S *pstAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Fotoaufnahmeaufgabe | Eingabe |
| pstAttr | Fotoattribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PHOTO_TakePhoto darf erst nach Initialisierung der Aufzeichnungsaufgabe verwendet werden (Wortlaut der Quelle).

**Beispiel**

rkadk_photo_test

**Siehe auch**

Nein

#### 5.2.4 RKADK_PHOTO_Reset

**Beschreibung**

Fotoaufnahmeaufgabe neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_Reset(RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| ppHandle | Zeiger auf die Fotoaufnahmeaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PHOTO_Reset darf erst nach Initialisierung der Aufzeichnungsaufgabe verwendet werden (Quellbezeichnung). Beim Auflösungswechsel die Photo-Auflösung in der ini über RKADK_PARAM_SetCamParam ändern. RV1126/RV1109 und RK3576 unterstützen keinen dynamischen Auflösungswechsel: zuerst RKADK_PHOTO_DeInit, dann neue Auflösung einstellen und RKADK_PHOTO_Init aufrufen. Bei gemeinsam genutztem VI-Kanal die Auflösungen von Photo und den anderen Modulen gleichzeitig umstellen, damit VI und VENC übereinstimmen.

**Beispiel**

rkadk_photo_test

**Siehe auch**

#### 5.2.5 RKADK_PHOTO_GetThmInJpg

**Beschreibung**

Vorschaubilddaten aus einer JPG-Datei abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_GetThmInJpg(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_JPG_THUMB_TYPE_E eThmType, RKADK_U8 *pu8Buf, RKADK_U32 *pu32Size);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pszFileName | JPG-Dateipfad | Eingabe |
| eThmType | Vorschaubildtyp | Eingabe |
| pu8Buf | Eingabe: Zeiger auf Vorschaubildspeicher; Ausgabe: tatsächliche Vorschaubilddaten | Input/Output |
| pu32Size | Eingabe: Länge von pu8Buf; Ausgabe: tatsächliche Länge der Vorschaubilddaten | Input/Output |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

No.

#### 5.2.6 RKADK_PHOTO_GetThmInJpgEx

**Beschreibung**

Die erweiterte Schnittstelle zum Abrufen von JPG-Vorschaubildern unterstützt die Angabe von Typ und Auflösung. Zusammen mit RKADK_PHOTO_ThumbBufFree verwenden.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_GetThmInJpgEx(RKADK_U32 u32CamId, RKADK_CHAR *pszFileName, RKADK_JPG_THUMB_TYPE_E eThmType, RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pszFileName | JPG-Dateipfad | Eingabe |
| eThmType | Vorschaubildtyp | Eingabe |
| pstThumbAttr | Zeiger auf die Vorschaubild-Attributstruktur | Eingabe/Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

RKADK_PHOTO_ThumbBufFree

#### 5.2.7 RKADK_PHOTO_ThumbBufFree

**Beschreibung**

Von RKADK_PHOTO_GetThmInJpgEx angeforderten Speicher freigeben. Zusammen mit RKADK_PHOTO_GetThmInJpgEx verwenden.

**Syntax**

```c
RKADK_S32 RKADK_PHOTO_ThumbBufFree(RKADK_THUMB_ATTR_S *pstThumbAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstThumbAttr | Zeiger auf die Vorschaubild-Attributstruktur | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_photo.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_thumb_test

**Siehe auch**

RKADK_PHOTO_GetThmInJpgEx

#### 5.2.8 RKADK_MEDIA_SetVencRotation

**Beschreibung**

Drehung des VENC-Kanals einstellen.

**Syntax**

```c
RKADK_S32 RKADK_MEDIA_SetVencRotation(RKADK_U32 u32CamId, ROTATION_E enRotation, RKADK_STREAM_TYPE_E enStreamType);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enRotation | Drehwinkel | Eingabe |
| enStreamType | Streamtyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_media_comm.h. Bibliothek: librkadk.so.

#### 5.2.9 RKADK_MEDIA_ToggleVencMirror

**Beschreibung**

Spiegelung des VENC-Kanals einstellen.

**Syntax**

```c
RKADK_S32 RKADK_MEDIA_ToggleVencMirror(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool mirror);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enStreamType | Streamtyp | Eingabe |
| mirror | Spiegelung aktivieren | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_media_comm.h. Bibliothek: librkadk.so.

#### 5.2.10 RKADK_MEDIA_ToggleVencFlip

**Beschreibung**

Vertikales Spiegeln des VENC-Kanals einstellen.

**Syntax**

```c
RKADK_S32 RKADK_MEDIA_ToggleVencFlip(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, bool flip);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enStreamType | Streamtyp | Eingabe |
| flip | Vertikales Spiegeln aktivieren | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_media_comm.h. Bibliothek: librkadk.so.

### 5.3 Datentypen

Wichtige Foto-Datentypen: RKADK_PHOTO_TYPE_E - Aufnahmetypen; RKADK_PHOTO_SINGLE_ATTR_S - Einzelaufnahmeattribute; RKADK_PHOTO_MULTIPLE_ATTR_S - Serienaufnahmeattribute; RKADK_PHOTO_RECV_DATA_S - Fotodaten; RKADK_PHOTO_DATA_RECV_FN_PTR - Datenempfangsfunktion; RKADK_TAKE_PHOTO_ATTR_S - Aufnahmeattribute; RKADK_PHOTO_ATTR_S - Aufgabenattribute; RKADK_JPG_THUMB_TYPE_E - JPG-Vorschaubildtypen; RKADK_THUMB_TYPE_E - Ausgabevorschaubildtypen; RKADK_THUMB_ATTR_S - Vorschaubildattribute; ROTATION_E - Drehungstypen; RKADK_PHOTO_FMT_CHANGE_S - Parameter zur FBC0/NV16-Konvertierung.

#### 5.3.1 RKADK_PHOTO_TYPE_E

**Beschreibung**

Aufzählung der Fotoaufnahmetypen.

**Definition**

```text
typedef enum {
  RKADK_PHOTO_TYPE_SINGLE = 0,
  RKADK_PHOTO_TYPE_MULTIPLE,
  RKADK_PHOTO_TYPE_LAPSE, // TODO
  RKADK_PHOTO_TYPE_BUTT
} RKADK_PHOTO_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_PHOTO_TYPE_SINGLE | Einzelaufnahmemodus |
| RKADK_PHOTO_TYPE_MULTIPLE | Serienaufnahmemodus |
| RKADK_PHOTO_TYPE_LAPSE | Zeitrafferfotografie (reserviert) |

**Verwandte Datentypen und Schnittstellen**

RKADK_TAKE_PHOTO_ATTR_S

#### 5.3.2 RKADK_PHOTO_SINGLE_ATTR_S

**Beschreibung**

Attributstruktur der Einzelaufnahme.

**Definition**

```text
typedef struct {
  // TODO
  RKADK_S32 s32Time_sec;
} RKADK_PHOTO_SINGLE_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32Time_sec | Reserviert |

**Verwandte Datentypen und Schnittstellen**

RKADK_TAKE_PHOTO_ATTR_S

#### 5.3.3 RKADK_PHOTO_MULTIPLE_ATTR_S

**Beschreibung**

Attributstruktur der Serienaufnahme.

**Definition**

```text
typedef struct {
  /* s32Count is -1 that means continuous photo, larger than 0 that meas photo
   * number */
  RKADK_S32 s32Count;
} RKADK_PHOTO_MULTIPLE_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32Count | Anzahl aufeinanderfolgender Fotos; -1 bedeutet kontinuierliche Aufnahme bis RKADK_PHOTO_DeInit |

**Verwandte Datentypen und Schnittstellen**

RKADK_TAKE_PHOTO_ATTR_SS

#### 5.3.4 RKADK_PHOTO_THUMB_ATTR_S

**Beschreibung**

Parameterstruktur des Vorschaubildes.

**Definition**

```text
#define RKADK_MPF_LARGE_THUMB_NUM_MAX 2  /* Supports the maximum number of MPF thumbnails to
be generated simultaneously */

typedef struct rkSIZE_S {
  RK_U32 u32Width;               /* Thumbnail width*/
  RK_U32 u32Height;              /* Thumbnail height */
} SIZE_S;

typedef enum {
  RKADK_PHOTO_MPF_SINGLE = 0,    /* Single MPF thumbnail */
  RKADK_PHOTO_MPF_MULTI,         /* Multiple MPF thumbnails */
  RKADK_PHOTO_MPF_BUTT
} RKADK_PHOTO_MPF_MODE_E;

typedef struct {
  RKADK_U8 u8LargeThumbNum;      /* Number of generated MPF thumbnails*/
  SIZE_S astLargeThumbSize[RKADK_MPF_LARGE_THUMB_NUM_MAX];  /* Each thumbnail resolution */
} RKADK_PHOTO_MPF_CFG_S;
typedef struct {
  RKADK_PHOTO_MPF_MODE_E eMode;  /* MPF thumbnail mode */
  RKADK_PHOTO_MPF_CFG_S sCfg;    /* MPF thumbnail configuration */
} RKADK_PHOTO_MPF_ATTR_S;

typedef struct {
  RKADK_BOOL bSupportDCF; /* Fixed resolution: 160 * 120 jpg */
  RKADK_PHOTO_MPF_ATTR_S stMPFAttr;
} RKADK_PHOTO_THUMB_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bSupportDCF | DCF-Vorschaubilder mit fester Auflösung 160*120 erzeugen |
| stMPFAttr | MPF-Vorschaubildparameter |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_ATTR_S

#### 5.3.5 RKADK_PHOTO_RECV_DATA_S

**Beschreibung**

Struktur der Fotodaten.

**Definition**

```text
typedef struct {
  RKADK_U8 *pu8DataBuf;
  RKADK_U32 u32DataLen;
  RKADK_U32 u32CamId;
  bool bStreamEnd;
  void *userdata;
} RKADK_PHOTO_RECV_DATA_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pu8DataBuf | Datenzeiger |
| u32DataLen | Datenlänge |
| u32CamId | Kamera-ID |
| bStreamEnd | Ende des Datenstroms; hauptsächlich für JPEG Slice |
| userdata | Zeiger auf Benutzerdaten |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_DATA_RECV_FN_PTR

#### 5.3.6 RKADK_PHOTO_DATA_RECV_FN_PTR

**Beschreibung**

Zeiger auf die Fotodaten-Empfangsfunktion.

**Definition**

```text
typedef void (*RKADK_PHOTO_DATA_RECV_FN_PTR)(RKADK_PHOTO_RECV_DATA_S *pstData);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pstData | Datenzeiger |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_RECV_DATA_S RKADK_PHOTO_ATTR_S

#### 5.3.7 RKADK_TAKE_PHOTO_ATTR_S

**Beschreibung**

Attributstruktur der Fotoaufnahme.

**Definition**

```text
typedef struct {
  RKADK_PHOTO_TYPE_E enPhotoType;
  union tagPhotoTypeAttr {
    RKADK_PHOTO_SINGLE_ATTR_S stSingleAttr;
    RKADK_PHOTO_LAPSE_ATTR_S stLapseAttr; // TODO
    RKADK_PHOTO_MULTIPLE_ATTR_S stMultipleAttr;
  } unPhotoTypeAttr;
} RKADK_TAKE_PHOTO_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enPhotoType | Fotoaufnahmetyp |
| stSingleAttr | Einzelaufnahmeparameter |
| stMultipleAttr | Serienaufnahmeparameter |
| stLapseAttr | Zeitrafferfotoparameter (reserviert) |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_TYPE_E RKADK_PHOTO_SINGLE_ATTR_S RKADK_PHOTO_MULTIPLE_ATTR_S RKADK_PHOTO_TakePhoto

#### 5.3.8 RKADK_PHOTO_FMT_CHANGE_S

**Beschreibung**

Parameterstruktur für die FBC0/NV16-Formatkonvertierung

**Definition**

```text
typedef struct {
  RKADK_U32 u32VencChn;
  RKADK_U32 u32VdecChn;

  //format change venc parameter
  RKADK_U32 u32BitRate;   //default 4M
  RKADK_U32 u32Profile;   //default 77
} RKADK_PHOTO_FMT_CHANGE_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32VencChn | VENC-Kanal-ID für die Formatkonvertierung |
| u32VdecChn | VDEC-Kanal-ID für die Formatkonvertierung |
| u32BitRate | Kodierungsbitrate, standardmäßig 4M |
| u32Profile | Kodierungslevel, standardmäßig 77 |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_ATTR_S RKADK_PHOTO_Init

#### 5.3.9 RKADK_PHOTO_ATTR_S

**Beschreibung**

Attributstruktur der Fotoaufnahmeaufgabe.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_PHOTO_THUMB_ATTR_S stThumbAttr;
  RKADK_PHOTO_DATA_RECV_FN_PTR pfnPhotoDataProc;
  void *userdata;
  RKADK_POST_ISP_ATTR_S *pstPostIspAttr;
  RKADK_PHOTO_FMT_CHANGE_S stFmtChange;
} RKADK_PHOTO_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamera-ID |
| stThumbAttr | Vorschaubildparameter |
| pfnPhotoDataProc | Zeiger auf den Callback zum Empfang von Fotodaten |
| userdata | Zeiger auf Benutzerdaten |
| pstPostIspAttr | Post-AI-ISP-Attribute |
| stFmtChange | Parameter für die FBC0/NV16-Formatkonvertierung |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_THUMB_ATTR_S RKADK_PHOTO_DATA_RECV_FN_PTR RKADK_POST_ISP_ATTR_S RKADK_PHOTO_FMT_CHANGE_S RKADK_PHOTO_Init

#### 5.3.10 RKADK_JPG_THUMB_TYPE_E

**Beschreibung**

Aufzählung der JPG-Vorschaubildtypen.

**Definition**

```text
typedef enum {
  RKADK_JPG_THUMB_TYPE_DCF,
  RKADK_JPG_THUMB_TYPE_MFP1,
  RKADK_JPG_THUMB_TYPE_MFP2,
  RKADK_JPG_THUMB_TYPE_BUTT
} RKADK_JPG_THUMB_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_JPG_THUMB_TYPE_DCF | DCF-Vorschaubild |
| RKADK_JPG_THUMB_TYPE_MFP1 | MPF1-Vorschaubild |
| RKADK_JPG_THUMB_TYPE_MFP2 | MPF2-Vorschaubild |

**Verwandte Datentypen und Schnittstellen**

RKADK_PHOTO_GetThmInJpg RKADK_PHOTO_GetThmInJpgEx

#### 5.3.11 RKADK_THUMB_TYPE_E

**Beschreibung**

Aufzählung der Ausgabevorschaubildtypen.

**Definition**

```text
typedef enum {
  RKADK_THUMB_TYPE_NV12 = 0,
  RKADK_THUMB_TYPE_JPEG,
  RKADK_THUMB_TYPE_RGB565,
  RKADK_THUMB_TYPE_RGBA8888,
  RKADK_THUMB_TYPE_BGRA8888
} RKADK_THUMB_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_THUMB_TYPE_NV12 | Vorschaubildausgabe in NV12 |
| RKADK_THUMB_TYPE_JPEG | Vorschaubildausgabe in JPG |
| RKADK_THUMB_TYPE_RGB565 | Vorschaubildausgabe in RGB565 |
| RKADK_THUMB_TYPE_RGBA8888 | Vorschaubildausgabe in RGBA9888 |
| RKADK_THUMB_TYPE_BGRA8888 | Vorschaubildausgabe in BGRA8888 |

**Verwandte Datentypen und Schnittstellen**

RKADK_THUMB_ATTR_S RKADK_GetThmInMp4Ex RKADK_PHOTO_GetThmInJpgEx

#### 5.3.12 RKADK_THUMB_ATTR_S

**Beschreibung**

Attributstruktur des Vorschaubildes.

**Definition**

```text
typedef struct {
  RKADK_THUMB_TYPE_E enType;
  // 4 alignment
  RKADK_U32 u32Width;
  // 2 alignment
  RKADK_U32 u32Height;
  // 4 alignment
  RKADK_U32 u32VirWidth;
  // 2 alignment
  RKADK_U32 u32VirHeight;
  RKADK_U8 *pu8Buf;
  RKADK_U32 u32BufSize;
} RKADK_THUMB_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enType | Gewünschter Vorschaubildtyp |
| u32Width | Eingabe: gewünschte Vorschaubildbreite; Ausgabe: tatsächliche Breite |
| u32Height | Eingabe: gewünschte Vorschaubildhöhe; Ausgabe: tatsächliche Höhe |
| u32VirWidth | Eingabe: gewünschte virtuelle Vorschaubildbreite; Ausgabe: tatsächliche virtuelle Breite |
| u32VirHeight | Eingabe: gewünschte virtuelle Vorschaubildhöhe; Ausgabe: tatsächliche virtuelle Höhe |
| pu8Buf | Zeiger auf Vorschaubilddaten |
| u32BufSize | Länge der Vorschaubilddaten |

**Verwandte Datentypen und Schnittstellen**

RKADK_THUMB_TYPE_E

RKADK_GetThmInMp4Ex RKADK_PHOTO_GetThmInJpgEx

#### 5.3.13 ROTATION_E

**Beschreibung**

Aufzählung der Drehungstypen.

**Definition**

```text
typedef enum rkROTATION_E {
    ROTATION_0        = 0,
    ROTATION_90       = 1,
    ROTATION_180      = 2,
    ROTATION_270      = 3,
    ROTATION_BUTT
} ROTATION_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_MEDIA_SetVencRotation

## 6. Remote-Vorschau

### 6.1 Überblick

Callback-Schnittstellen für die Vorschau ermöglichen das Abrufen von Video-/Audioinformationen, Starten und Stoppen von VENC/AENC sowie Registrieren von Verarbeitungsfunktionen für Audio- und Videoframes.

### 6.2 API-Referenz

#### 6.2.1 RKADK_STREAM_VideoInit

**Beschreibung**

Videomodule VI und VENC initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_VideoInit(RKADK_STREAM_VIDEO_ATTR_S *pstVideoAttr, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstVideoAttr | Zeiger auf Videoattribute | Eingabe |
| ppHandle | Zeiger auf die erstellte Videoaufgabe | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholte Initialisierung des Videomoduls wird nicht unterstützt.

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_VideoDeInit

#### 6.2.2 RKADK_STREAM_VideoDeInit

**Beschreibung**

Videomodule VI und VENC deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_VideoDeInit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Videoaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholte Deinitialisierung wird nicht unterstützt.

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_VideoInit

#### 6.2.3 RKADK_STREAM_VencStart

**Beschreibung**

VENC aktivieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_VencStart(RKADK_MW_PTR pHandle, RKADK_S32 s32FrameCnt);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Videoaufgabe | Eingabe |
| s32FrameCnt | Anzahl zu empfangender Frames; -1 bedeutet unbegrenzten Empfang bis VencStop | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_STREAM_VencStart darf erst nach Initialisierung des Videomoduls aufgerufen werden. Der Aufruf löst den VENC-Daten-Callback zum Start des Empfangs aus.

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_VencStop

#### 6.2.4 RKADK_STREAM_VencStop

**Beschreibung**

VENC deaktivieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_VencStop(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Videoaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_VencStart

#### 6.2.5 RKADK_STREAM_VideoReset

**Beschreibung**

Videostream neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_VideoReset(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Videoaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_STREAM_VideoReset darf erst nach RKADK_STREAM_VideoInit aufgerufen werden. Bei Änderung von Auflösung, Framerate, Bitrate, Kodierungs- oder Aufzeichnungstyp die Preview-Parameter in der ini über RKADK_PARAM_SetCamParam anpassen. RV1126/RV1109 und RK3576 unterstützen keinen dynamischen Wechsel von Auflösung und Kodierungstyp: zuerst RKADK_STREAM_VideoDeInit, dann neue Parameter und RKADK_STREAM_VideoInit. Bei gemeinsam genutztem VI-Kanal alle betroffenen Auflösungen gleichzeitig umstellen, damit VI und VENC übereinstimmen.

**Beispiel**

rkadk_stream_test

#### 6.2.6 RKADK_STREAM_GetVideoInfo

**Beschreibung**

Videoinformationen abrufen.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_GetVideoInfo(RKADK_U32 u32CamId, RKADK_VIDEO_INFO_S *pstVideoInfo);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pstVideoInfo | Zeiger auf die Videoinformationsstruktur | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_stream_test

**Siehe auch**

Keine

#### 6.2.7 RKADK_STREAM_AudioInit

**Beschreibung**

Audiomodule AI und AENC initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_AudioInit(RKADK_STREAM_AUDIO_ATTR_S *pstAudioAttr, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstAudioAttr | Zeiger auf Audioattribute | Eingabe |
| ppHandle | Zeiger auf die erstellte Audioaufgabe | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholte Initialisierung des Audiomoduls wird nicht unterstützt.

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_AudioDeInit

#### 6.2.8 RKADK_STREAM_AudioDeInit

**Beschreibung**

Audiomodule AI und AENC deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_AudioDeInit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Audioaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_AudioInit

#### 6.2.9 RKADK_STREAM_AencStart

**Beschreibung**

AENC aktivieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_AencStart(RKADK_MW_PTR *pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Audioaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_STREAM_AencStart darf erst nach Initialisierung des Audiomoduls aufgerufen werden. Der Aufruf löst den AENC-Daten-Callback zum Start des Empfangs aus.

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_AencStop

#### 6.2.10 RKADK_STREAM_AencStop

**Beschreibung**

AENC deaktivieren.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_AencStop(RKADK_MW_PTR *pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Audioaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_stream_test

**Siehe auch**

RKADK_STREAM_AencStart

#### 6.2.11 RKADK_STREAM_GetAudioInfo

**Beschreibung**

Audioinformationen abrufen.

**Syntax**

```c
RKADK_S32 RKADK_STREAM_GetAudioInfo(RKADK_MW_PTR *pHandle, RKADK_AUDIO_INFO_S *pstAudioInfo);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf die Audioaufgabe | Eingabe |
| pstAudioInfo | Zeiger auf die Audioinformationsstruktur | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_stream.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_stream_test

**Siehe auch**

Keine

### 6.3 Datentypen

Die Quelle nennt folgende Typen des Wiedergabemoduls: RKADK_CODEC_TYPE_E - Kodierungsformate; RKADK_VENC_DATA_PROC_FUNC - VENC-Daten-Callback; RKADK_VIDEO_STREAM_S - Videostream; RKADK_VENC_DATA_PACK_S - VENC-Paket; RKADK_VENC_DATA_TYPE_S - VENC-Pakettyp; RKADK_VIDEO_INFO_S - Videoinformationen; RKADK_STREAM_VIDEO_ATTR_S - Videoaufgabenattribute; RKADK_AUDIO_DATA_PROC_FUNC - Audiodaten-Callback; RKADK_AUDIO_STREAM_S - Audiodaten; RKADK_AUDIO_INFO_S - Audioinformationen; RKADK_STREAM_AUDIO_ATTR_S - Audioaufgabenattribute.

#### 6.3.1 RKADK_CODEC_TYPE_E

**Beschreibung**

Aufzählung der Kodierungsformate. AAC-Audiokodierung wird standardmäßig nicht unterstützt.

**Definition**

```text
typedef enum {
  //Video
  RKADK_CODEC_TYPE_H264 = 0,
  RKADK_CODEC_TYPE_H265,
  RKADK_CODEC_TYPE_MJPEG,
  RKADK_CODEC_TYPE_JPEG,

  //Audio
  RKADK_CODEC_TYPE_G711A,
  RKADK_CODEC_TYPE_G711U,
  RKADK_CODEC_TYPE_G726,
  RKADK_CODEC_TYPE_MP2,
  RKADK_CODEC_TYPE_MP3,
  RKADK_CODEC_TYPE_ACC,
  RKADK_CODEC_TYPE_PCM,
  RKADK_CODEC_TYPE_BUTT
} RKADK_CODEC_TYPE_E;
```

#### 6.3.2 RKADK_VENC_DATA_PROC_FUNC

**Beschreibung**

Zeiger auf den VENC-Daten-Callback.

**Definition**

```text
typedef RKADK_S32 (*RKADK_VENC_DATA_PROC_FUNC)(RKADK_VIDEO_STREAM_S *pVStreamData);
```

**Verwandte Datentypen und Schnittstellen**

RKADK_VIDEO_STREAM_S

#### 6.3.3 RKADK_VIDEO_STREAM_S

**Beschreibung**

Struktur des Videostreams.

**Definition**

```text
typedef struct {
  RKADK_VENC_DATA_PACK_S astPack; /* stream pack attribute */
  RKADK_U32 u32Seq;               /* the list number of stream */
  RKADK_BOOL bEndOfStream;        /* frame end flag */
  RKADK_U32 u32CamId;
} RKADK_VIDEO_STREAM_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| astPack | Paketstruktur |
| u32Seq | Paket-Sequenz-ID |
| bEndOfStream | Reserviert |
| u32CamId | Kamera-ID |

**Verwandte Datentypen und Schnittstellen**

RKADK_VENC_DATA_PACK_S RKADK_VENC_DATA_PROC_FUNC

#### 6.3.4 RKADK_VENC_DATA_PACK_S

**Beschreibung**

Struktur des VENC-Pakets.

**Definition**

```text
typedef struct {
  RKADK_U8 *apu8Addr;                /* the virtual address of stream */
  RKADK_U32 au32Len;                 /* the length of stream */
  RKADK_U64 u64PTS;                  /* time stamp */
  RKADK_VENC_DATA_TYPE_S stDataType; /* the type of stream */
} RKADK_VENC_DATA_PACK_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| apu8Addr | Datenzeiger |
| au32Len | Datenlänge |
| u64PTS | Zeitstempel |
| stDataType | Datentyp |

**Verwandte Datentypen und Schnittstellen**

RKADK_VENC_DATA_TYPE_S RKADK_VIDEO_STREAM_S

#### 6.3.5 RKADK_VENC_DATA_TYPE_S

**Beschreibung**

VENC-Pakettyp.

**Definition**

```text
/* the nalu type of H264 */
typedef enum {
  RKADK_H264E_NALU_BSLICE = 0,   /* B SLICE types */
  RKADK_H264E_NALU_PSLICE = 1,   /* P SLICE types */
  RKADK_H264E_NALU_ISLICE = 2,   /* I SLICE types */
  RKADK_H264E_NALU_IDRSLICE = 5, /* IDR SLICE types */
  RKADK_H264E_NALU_SEI = 6,      /* SEI types */
  RKADK_H264E_NALU_SPS = 7,      /* SPS types */
  RKADK_H264E_NALU_PPS = 8,      /* PPS types */
  RKADK_H264E_NALU_BUTT
} RKADK_H264E_NALU_TYPE_E;
/* the nalu type of H265 */
typedef enum {
  RKADK_H265E_NALU_BSLICE = 0,    /* B SLICE types */
  RKADK_H265E_NALU_PSLICE = 1,    /* P SLICE types */
  RKADK_H265E_NALU_ISLICE = 2,    /* I SLICE types */
  RKADK_H265E_NALU_IDRSLICE = 19, /* IDR SLICE types */
  RKADK_H265E_NALU_VPS = 32,      /* VPS types */
  RKADK_H265E_NALU_SPS = 33,      /* SPS types */
  RKADK_H265E_NALU_PPS = 34,      /* PPS types */
  RKADK_H265E_NALU_SEI = 39,      /* SEI types */
  RKADK_H265E_NALU_BUTT
} RKADK_H265E_NALU_TYPE_E;

typedef struct {
  RKADK_CODEC_TYPE_E enPayloadType;      /* H.264/H.265/JPEG/MJPEG */
  union {
    RKADK_H264E_NALU_TYPE_E enH264EType; /* H264E NALU types */
    RKADK_H265E_NALU_TYPE_E enH265EType; /* H265E NALU types */
    RKADK_JPEGE_PACK_TYPE_E enJPEGEType; /* TODO: JPEGE PACK types*/
  };
} RKADK_VENC_DATA_TYPE_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enPayloadType | Kodierungstyp |
| enH264EType | H264-Pakettyp |
| enH265EType | H265-Pakettyp |
| enJPEGEType | Reserviert |

**Verwandte Datentypen und Schnittstellen**

RKADK_CODEC_TYPE_E RKADK_VENC_DATA_PACK_S

#### 6.3.6 RKADK_VIDEO_INFO_S

**Beschreibung**

Struktur der Videoinformationen.

**Definition**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32BitRate;
  RKADK_U32 u32FrameRate;
  RKADK_U32 u32Gop;
} RKADK_VIDEO_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enPayloadType | Kodierungstyp |
| u32Width | Bildbreite |
| u32Height | Bildhöhe |
| u32BitRate | Bitrate |
| u32FrameRate | Framerate |
| u32Gop | I-Frame-Intervall |

**Verwandte Datentypen und Schnittstellen**

RKADK_CODEC_TYPE_E RKADK_STREAM_GetVideoInfo

#### 6.3.7 RKADK_STREAM_VIDEO_ATTR_S

**Beschreibung**

Attributstruktur der Videoaufgabe.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_VENC_DATA_PROC_FUNC pfnDataCB;
} RKADK_STREAM_VIDEO_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamera-ID |
| pfnDataCB | Callback für die Videodatenausgabe |

**Verwandte Datentypen und Schnittstellen**

RKADK_VENC_DATA_PROC_FUNC RKADK_STREAM_VideoInit

#### 6.3.8 RKADK_AUDIO_DATA_PROC_FUNC

**Beschreibung**

Zeiger auf den AENC-Daten-Callback.

**Definition**

```text
typedef RKADK_S32 (*RKADK_AUDIO_DATA_PROC_FUNC)(RKADK_AUDIO_STREAM_S *pAStreamData);
```

**Verwandte Datentypen und Schnittstellen**

RKADK_AUDIO_STREAM_S

#### 6.3.9 RKADK_AUDIO_STREAM_S

**Beschreibung**

Struktur des Audiodatenstroms.

**Definition**

```text
typedef struct {
  RKADK_U8 *pStream;      /* the virtual address of stream */
  RKADK_U32 u32Len;       /* stream lenth, by bytes */
  RKADK_U64 u64TimeStamp; /* frame time stamp */
  RKADK_U32 u32Seq;       /* frame seq, if stream is not a valid frame,u32Seq is 0 */
  RKADK_CODEC_TYPE_E enType;
} RKADK_AUDIO_STREAM_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pStream | Datenzeiger |
| u32Len | Datenlänge |
| u64TimeStamp | Zeitstempel |
| u32Seq | Sequenznummer |
| enType | Kodierungstyp der Audiodaten |

**Verwandte Datentypen und Schnittstellen**

RKADK_AUDIO_DATA_PROC_FUNC

#### 6.3.10 RKADK_AUDIO_INFO_S

**Beschreibung**

Struktur der Audioinformationen.

**Definition**

```text
typedef struct {
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32ChnCnt;
  RKADK_U32 u32SampleRate;
  RKADK_U32 u32AvgBytesPerSec;
  RKADK_U32 u32SamplesPerFrame;
  RKADK_U16 u16SampleBitWidth;
} RKADK_AUDIO_INFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enPayloadType | Kodierungstyp |
| u32ChnCntt | Kanalanzahl |
| u32SampleRate | Abtastrate |
| u32AvgBytesPerSec | Byterate |
| u32SamplesPerFrame | Anzahl Samples pro Frame |
| u16SampleBitWidth | Bits pro Sample |

**Verwandte Datentypen und Schnittstellen**

RKADK_CODEC_TYPE_E RKADK_STREAM_GetAudioInfo

#### 6.3.11 RKADK_STREAM_AUDIO_ATTR_S

**Beschreibung**

Attributstruktur der Audioaufgabe.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_AUDIO_DATA_PROC_FUNC pfnPcmDataCB;
  RKADK_AUDIO_DATA_PROC_FUNC pfnAencDataCB;
} RKADK_STREAM_AUDIO_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamera-ID |
| enCodecType | Kodierungstyp |
| pfnPcmDataCB | Callback für die PCM-Datenausgabe |
| pfnAencDataCB | Callback für die Ausgabe kodierter Audiodaten |

**Verwandte Datentypen und Schnittstellen**

RKADK_AUDIO_DATA_PROC_FUNC RKADK_STREAM_AudioInit

## 7. Player

### 7.1 Überblick

Wiedergabe lokaler Audio-/Videodateien und von RTSP-Netzwerkstreams mit Wiedergabe, Pause, Suche und Bildschirmaufnahme. Player ist mit RV1109/RV1126, RV1103/RV1103, RK3308 und RK3506 kompatibel (Quellliste unverändert). RV1109/RV1126 verwenden Hardwaredekodierung, die anderen Plattformen Softwaredekodierung.

### 7.2 API-Referenz

#### 7.2.1 RKADK_PLAYER_Create

**Beschreibung**

Player erstellen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Create(RKADK_MW_PTR *ppPlayer, RKADK_PLAYER_CFG_S *pstPlayCfg);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| ppPlayer | Zeiger auf den erstellten Player | Ausgabe |
| pstPlayCfg | Player-Eigenschaften | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Wiederholtes Erstellen desselben Players wird nicht unterstützt.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Destroy

#### 7.2.2 RKADK_PLAYER_Destroy

**Beschreibung**

Player zerstören.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Destroy(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Das wiederholte Zerstören desselben Players wird nicht unterstützt.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Create

#### 7.2.3 RKADK_PLAYER_SetDataSource

**Beschreibung**

Pfad der wiederzugebenden Datei festlegen. Bei aktivierter externer Demuxer-Bibliothek in Player ist RKADK_PLAYER_SetDataParam zu verwenden.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SetDataSource(RKADK_MW_PTR pPlayer, const RKADK_CHAR *pszfilePath);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| pszfilePath | Pfad der wiederzugebenden Datei | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PLAYER_SetDataSource darf erst nach dem Erstellen des Players aufgerufen werden.

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.4 RKADK_PLAYER_SetDataParam

**Beschreibung**

Audio- und Videoparameter der wiederzugebenden Datei festlegen. Diese Schnittstelle bei aktivierter externer Demuxer-Bibliothek verwenden, andernfalls RKADK_PLAYER_SetDataSource.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SetDataParam(RKADK_MW_PTR pPlayer, RKADK_PLAYER_DATA_PARAM_S *pstDataParam);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| pstDataParam | Audio- und Videoparameter der wiederzugebenden Datei | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PLAYER_SetDataParam darf erst nach dem Erstellen des Players aufgerufen werden.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SendVideoPacket

#### 7.2.5 RKADK_PLAYER_Prepare

**Beschreibung**

Wiedergabe vorbereiten.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Prepare(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PLAYER_Prepare darf erst nach dem Erstellen des Players und dem Festlegen des Wiedergabepfads aufgerufen werden.

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.6 RKADK_PLAYER_GetCurrentPosition

**Beschreibung**

Aktuelle Wiedergabeposition abrufen.

**Syntax**

```c
RKADK_S64 RKADK_PLAYER_GetCurrentPosition(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| Wiedergabeposition in ms | Erfolg |
| -1 | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_player.h

Bibliothek: librkadk.so

**Hinweis**

Keine

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.7 RKADK_PLAYER_Play

**Beschreibung**

Wiedergabe starten.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Play(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PLAYER_Play darf erst nach RKADK_PLAYER_Prepare aufgerufen werden.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Stop

#### 7.2.8 RKADK_PLAYER_Stop

**Beschreibung**

Wiedergabe stoppen und Ressourcen freigeben.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Stop(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Play

#### 7.2.9 RKADK_PLAYER_Pause

**Beschreibung**

Wiedergabe pausieren.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Pause(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Play

#### 7.2.10 RKADK_PLAYER_Seek

**Beschreibung**

Seek.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Seek(RKADK_MW_PTR pPlayer, RKADK_S64 s64TimeInMs);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| s64TimeInMs | Zeitposition für den Suchlauf | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

RKADK_PLAYER_Seek darf erst nach RKADK_PLAYER_Play aufgerufen werden.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_Play

#### 7.2.11 RKADK_PLAYER_GetPlayStatus

**Beschreibung**

Aktuellen Wiedergabestatus abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_GetPlayStatus(RKADK_MW_PTR pPlayer, RKADK_PLAYER_STATE_E *penState);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| penState | Aktueller Wiedergabestatus | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.12 RKADK_PLAYER_GetDuration

**Beschreibung**

Dauer der aktuell wiedergegebenen Datei abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_GetDuration(RKADK_MW_PTR pPlayer, RKADK_U32 *pDuration);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| pDuration | Dauer der aktuell wiedergegebenen Datei in ms | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Keine

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.13 RKADK_PLAYER_Snapshot

**Beschreibung**

Player-Schnappschuss: Die Schnittstelle kodiert das aktuell angezeigte Bild als JPEG. Die Anwendung erhält die erzeugten JPEG-Daten über den registrierten Callback RKADK_PPLAYER_SNAPSHOT_RECV_FN.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_Snapshot(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Beispiel**

rkadk_player_test

**Siehe auch**

Keine

#### 7.2.14 RKADK_PLAYER_SendAudioPacket

**Beschreibung**

Bei aktivierter externer Demuxer-Bibliothek übergibt diese Schnittstelle demultiplexte Audiodaten an Player zur Dekodierung und Wiedergabe.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SendAudioPacket(RKADK_MW_PTR pPlayer, RKADK_PLAYER_PACKET *pstPacket);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| pstPacket | Zu sendendes Paket | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Vor Verwendung dieser Schnittstelle RKADK_PLAYER_SetDataParam aufrufen, um die Audio- und Videoparameter festzulegen.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_SendVideoPacket RKADK_PLAYER_SetDataParam

#### 7.2.15 RKADK_PLAYER_SendVideoPacket

**Beschreibung**

Bei aktivierter externer Demuxer-Bibliothek übergibt diese Schnittstelle demultiplexte Videodaten an Player zur Dekodierung und Wiedergabe.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SendVideoPacket(RKADK_MW_PTR pPlayer, RKADK_PLAYER_PACKET *pstPacket);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| pstPacket | Zu sendendes Paket | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweis**

Vor Verwendung dieser Schnittstelle RKADK_PLAYER_SetDataParam aufrufen, um die Audio- und Videoparameter festzulegen.

**Beispiel**

rkadk_player_test

**Siehe auch**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SetDataParam

#### 7.2.16 RKADK_PLAYER_GetSendFrameNum

**Beschreibung**

Anzahl erfolgreich dekodierter Frames abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_GetSendFrameNum(RKADK_MW_PTR pPlayer);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| Frame-Anzahl | Erfolg |
| -1 | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_player.h

Bibliothek: librkadk.so. Hinweis: Nach Pause/Stop wird der Zähler zurückgesetzt.

**Beispiel**

rkadk_player_test

**Verwandte Themen**

Keine

#### 7.2.17 RKADK_PLAYER_SetVdecWaterline

**Beschreibung**

VDEC-Pufferfüllstandsschwelle festlegen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SetVdecWaterline(RKADK_MW_PTR pPlayer, RKADK_U32 u32VdecWaterline);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Eingabe |
| u32VdecWaterline | Wert der Pufferfüllstandsschwelle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_player.h. Bibliothek: librkadk.so. Hinweis: Nach dem Einstellen der VDEC-Füllstandsschwelle beginnt die Wiedergabe erst, wenn der VDEC-Puffer diesen Füllstand erreicht.

**Beispiel**

rkadk_player_test

**Verwandte Themen**

Keine

#### 7.2.18 RKADK_PLAYER_SetAoVolume

**Beschreibung**

Wiedergabelautstärke festlegen.

**Syntax**

```c
RKADK_S32 RKADK_PLAYER_SetAoVolume(RKADK_MW_PTR pPlayer, RKADK_S32 s32Volume);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pPlayer | Zeiger auf den Player | Ausgabe |
| s32Volume | Lautstärkewert | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Headerdatei: rkadk_player.h. Bibliothek: librkadk.so.

**Hinweise**

Keine

**Beispiel**

rkadk_player_test

**Verwandte Themen**

Keine

### 7.3 Datentypen

Das Wiedergabemodul stellt hauptsächlich folgende Datentypen bereit: RKADK_PLAYER_EVENT_E: Aufzählung der Wiedergabeereignisse; RKADK_PLAYER_EVENT_FN: Funktionszeiger auf den Callback für Wiedergabeereignisse.

RKADK_PLAYER_CFG_S: Player-Attributstruktur; RKADK_VO_FORMAT_E: Aufzählung der Pixelformate; RKADK_VO_INTF_TYPE_E: Aufzählung der Display-Schnittstellen; RKADK_PLAYER_FRAME_INFO_S: Bildinformationsstruktur; RKADK_PLAYER_STATE_E: Aufzählung der Wiedergabezustände; RKADK_PLAYER_DATA_PARAM_S: Audio-/Videoparameterstruktur; RKADK_PLAYER_PACKET: Player-Datenpaket; RKADK_PLAYER_RTSP_CFG_S: RTSP-Attributstruktur; RKADK_PLAYER_VDEC_CFG_S: VDEC-Attributstruktur; RKADK_PLAYER_SNAPSHOT_CFG_S: Schnappschuss-Attributstruktur; RKADK_PLAYER_SNAPSHOT_S: Schnappschuss-Datenstruktur; RKADK_PPLAYER_SNAPSHOT_RECV_FN: Funktionszeiger auf den Schnappschuss-Daten-Callback.

#### 7.3.1 RKADK_PLAYER_EVENT_E

**Beschreibung**

Definiert die Aufzählung der Wiedergabeereignisse.

**Definition**

```text
typedef enum {
  RKADK_PLAYER_EVENT_STATE_CHANGED = 0x0,
  RKADK_PLAYER_EVENT_PREPARED,
  RKADK_PLAYER_EVENT_PLAY,
  RKADK_PLAYER_EVENT_PAUSED,
  RKADK_PLAYER_EVENT_STOPPED,
  RKADK_PLAYER_EVENT_EOF,
  RKADK_PLAYER_EVENT_SOF,
  RKADK_PLAYER_EVENT_SEEK_END,
  RKADK_PLAYER_EVENT_ERROR,
  RKADK_PLAYER_EVENT_BUTT
} RKADK_PLAYER_EVENT_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_PLAYER_EVENT_STATE_CHANGED | Statusänderung (reserviert) |
| RKADK_PLAYER_EVENT_PREPARED | Vorbereitung Prepared abgeschlossen |
| RKADK_PLAYER_EVENT_PLAY | Wiedergabe starten |
| RKADK_PLAYER_EVENT_PAUSED | Wiedergabe pausieren (reserviert) |
| RKADK_PLAYER_EVENT_STOPPED | Wiedergabe stoppen |
| RKADK_PLAYER_EVENT_EOF | Ende der Wiedergabe |
| RKADK_PLAYER_EVENT_SOF | Reserviert |
| RKADK_PLAYER_EVENT_SEEK_END | Suchlauf Seek abgeschlossen (reserviert) |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_EVENT_FN

#### 7.3.2 RKADK_PLAYER_EVENT_FN

**Beschreibung**

Funktionszeiger auf den Wiedergabeereignis-Callback definieren.

**Definition**

```text
typedef RKADK_VOID (*RKADK_PLAYER_EVENT_FN)(RKADK_MW_PTR pPlayer, RKADK_PLAYER_EVENT_E
enEvent, RKADK_VOID *pData);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pPlayer | Zeiger auf den Player |
| enEvent | Ereignistyp |
| pData | Ereignisbezogene Parameter |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_EVENT_E RKADK_PLAYER_CFG_S

#### 7.3.3 RKADK_PLAYER_CFG_S

**Beschreibung**

Player-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_BOOL bEnableVideo;
  RKADK_BOOL bEnableAudio;
  RKADK_BOOL bEnableThirdDemuxer;
  RKADK_PLAYER_FRAME_INFO_S stFrmInfo;
  RKADK_PLAYER_RTSP_CFG_S stRtspCfg;
  RKADK_PLAYER_VDEC_CFG_S stVdecCfg;
  RKADK_PLAYER_SNAPSHOT_CFG_S stSnapshotCfg;
  RKADK_BOOL bEnableBlackBackground;
  RKADK_PLAYER_EVENT_FN pfnPlayerCallback;
} RKADK_PLAYER_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bEnableVideo | Videowiedergabe aktivieren |
| bEnableAudio | Audiowiedergabe aktivieren |
| bEnableThirdDemuxer | Externe Demuxer-Bibliothek aktivieren |
| pfnPlayerCallback | Funktionszeiger auf den Player-Ereignis-Callback |
| stFrmInfo | Bildinformationen definieren |
| stRtspCfg | RTSP-Attribut |
| stVdecCfg | VDEC-Attribut |
| stSnapshotCfg | Schnappschuss-Attribut |
| bEnableBlackBackground | Ob der Bildschirm nach der Wiedergabe schwarz wird |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_EVENT_FN RKADK_PLAYER_FRAME_INFO_S RKADK_PLAYER_RTSP_CFG_S RKADK_PLAYER_VDEC_CFG_S RKADK_PLAYER_SNAPSHOT_CFG_S RKADK_PLAYER_Create

#### 7.3.4 RKADK_VO_FORMAT_E

**Beschreibung**

Definiert die Aufzählung der Bildpixelformate.

**Definition**

```text
typedef enum {
  VO_FORMAT_ARGB8888 = 0,
  VO_FORMAT_ABGR8888,
  VO_FORMAT_RGB888,
  VO_FORMAT_BGR888,
  VO_FORMAT_ARGB1555,
  VO_FORMAT_ABGR1555,
  VO_FORMAT_RGB565,
  VO_FORMAT_RGB444,
  VO_FORMAT_NV12,
  VO_FORMAT_NV21
} RKADK_VO_FORMAT_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.5 RKADK_VO_INTF_TYPE_E

**Beschreibung**

Definiert die Aufzählung der Display-Schnittstellen.

**Definition**

```text
typedef enum {
  DISPLAY_TYPE_HDMI = 0,
  DISPLAY_TYPE_EDP,
  DISPLAY_TYPE_VGA,
  DISPLAY_TYPE_DP,
  DISPLAY_TYPE_HDMI_EDP,
  DISPLAY_TYPE_MIPI,
  DISPLAY_TYPE_DEFAULT,
} RKADK_VO_INTF_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| DISPLAY_TYPE_HDMI | Display-Schnittstelle HDMI |
| DISPLAY_TYPE_EDP | Display-Schnittstelle EDP |
| DISPLAY_TYPE_VGA | Display-Schnittstelle VGA |
| DISPLAY_TYPE_MIPI | Display-Schnittstelle MIPI |
| DISPLAY_TYPE_DP | Display-Schnittstelle DP |
| DISPLAY_TYPE_HDMI_EDP | Display-Schnittstelle HDMI \| EDP |
| DISPLAY_TYPE_DEFAULT | Interne Erkennung; die Display-Schnittstelle entspricht der tatsächlich angeschlossenen Hardware |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.6 RKADK_VO_SPLICE_MODE_E

**Beschreibung**

Definiert die Aufzählung der Methoden zum Zusammenfügen von Ebenen.

**Definition**

```text
typedef enum {
  SPLICE_MODE_RGA = 0,
  SPLICE_MODE_GPU,
  SPLICE_MODE_BYPASS
} RKADK_VO_INTF_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| SPLICE_MODE_RGA | Zusammenfügen mit RGA |
| SPLICE_MODE_GPU | Zusammenfügen mit GPU |
| SPLICE_MODE_BYPASS | BYPASS, kein Zusammenfügen |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_FRAME_INFO_S

#### 7.3.7 RKADK_PLAYER_FRAME_INFO_S

**Beschreibung**

Bildinformationsstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32FrmInfoX;
  RKADK_U32 u32FrmInfoY;
  RKADK_U32 u32DispWidth;
  RKADK_U32 u32DispHeight;
  RKADK_U32 u32ImgWidth;
  RKADK_U32 u32ImgHeight;
  RKADK_U32 u32VoLay;
  RKADK_U32 u32VoDev;
  RKADK_U32 u32VoChn;
  RKADK_U32 u32BorderColor;
  RKADK_U32 u32BorderTopWidth;
  RKADK_U32 u32BorderBottomWidth;
  RKADK_U32 u32BorderLeftWidth;
  RKADK_U32 u32BorderRightWidth;
  RKADK_BOOL bMirror;
  RKADK_BOOL bFlip;
  RKADK_U32 u32Rotation; //0: 0, 1: 90, 2: 180, 3: 270
  RKADK_VO_FORMAT_E u32VoFormat;
  RKADK_VO_INTF_TYPE_E u32EnIntfType;
  RKADK_VO_INTF_SYNC_E enIntfSync;
  RKADK_VO_SYNC_INFO_S stSyncInfo;
  RKADK_VO_SPLICE_MODE_E enVoSpliceMode;
} RKADK_PLAYER_FRAMEINFO_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32FrmInfoX | x-Koordinate des Anzeigebereichs der Ebene |
| u32FrmInfoY | y-Koordinate des Anzeigebereichs der Ebene |
| u32DispWidth | Breite des Anzeigebereichs der Ebene |
| u32DispHeight | Höhe des Anzeigebereichs der Ebene |
| u32ImgWidth | Bildbreite der Ebene |
| u32ImgHeight | Bildhöhe der Ebene |
| u32VoLay | Nummer der Videoausgabeebene |
| u32VoDev | Nummer des Anzeigeausgabegeräts |
| u32VoChn | Nummer des Videoausgabekanals, Wertebereich: [0, VO_MAX_CHN_NUM(128)] |
| u32BorderColor | Rahmenattribut des Videoausgabekanals: Farbe (reserviert) |
| u32BorderTopWidth | Rahmenattribut des Videoausgabekanals: Breite oben (reserviert) |
| u32BorderBottomWidth | Rahmenattribut des Videoausgabekanals: Breite unten (reserviert) |
| u32BorderLeftWidth | Rahmenattribut des Videoausgabekanals: Breite links (reserviert) |
| u32BorderRightWidth | Rahmenattribut des Videoausgabekanals: Breite rechts (reserviert) |
| bMirror | Spiegelung aktivieren |
| bFlip | Umklappen aktivieren |
| u32Rotation | Drehung, Werte: [0: 0, 1: 90, 2: 180, 3: 270] |
| u32VoFormat | Bildpixelformat definieren |
| u32EnIntfType | Typ der Display-Schnittstelle |
| enIntfSync | Synchronisationsmodus der Bildschirmschnittstelle |
| stSyncInfo | Bildschirm-Attributstruktur |
| enVoSpliceMode | Modus zum Zusammenfügen von Ebenen |

**Hinweis**

Details zu Videoausgabeattributen stehen im VO-Kapitel des Rockit-Dokuments Rockchip_Developer_Guide_MPI.pdf.

**Verwandte Datentypen und Schnittstellen**

RKADK_VO_FORMAT_E RKADK_VO_INTF_TYPE_E RKADK_VO_SPLICE_MODE_E

RKADK_PLAYER_Create

#### 7.3.8 RKADK_PLAYER_STATE_E

**Beschreibung**

Definiert die Aufzählung der Wiedergabezustände.

**Definition**

```text
typedef enum {
  RKADK_PLAYER_STATE_IDLE = 0, /* The player state before init */
  RKADK_PLAYER_STATE_INIT,     /* The player is in the initial state. It changes
                                  to the initial state after being SetDataSource */
  RKADK_PLAYER_STATE_PREPARED, /* The player is in the prepared state */
  RKADK_PLAYER_STATE_PLAY,     /* The player is in the playing state */
  RKADK_PLAYER_STATE_TPLAY,    /* The player is in the trick playing state, Reserved */
  RKADK_PLAYER_STATE_PAUSE,    /* The player is in the pause state */
  RKADK_PLAYER_STATE_ERR,      /* The player is in the err state */
  RKADK_PLAYER_STATE_BUTT
} RKADK_PLAYER_STATE_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_GetPlayStatus

#### 7.3.9 RKADK_PLAYER_SNAPSHOT_S

**Beschreibung**

Schnappschuss-Datenstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_U32 u32DataLen;
  RKADK_U8 *pu8DataBuf;
} RKADK_PLAYER_SNAPSHOT_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32Width | Breite des Schnappschusses |
| u32Height | Höhe des Schnappschusses |
| u32DataLen | Datenlänge des Schnappschusses |
| pu8DataBuf | Datenzeiger des Schnappschusses |

**Verwandte Datentypen und Schnittstellen**

RKADK_PPLAYER_SNAPSHOT_RECV_FN

#### 7.3.10 RKADK_PPLAYER_SNAPSHOT_RECV_FN

**Beschreibung**

Definiert den Funktionszeiger auf den Schnappschuss-Daten-Callback.

**Definition**

```text
typedef void (*RKADK_PPLAYER_SNAPSHOT_RECV_FN)(RKADK_PLAYER_SNAPSHOT_S *pstData);
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pstData | Datenzeiger des Schnappschusses |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_SNAPSHOT_S RKADK_PLAYER_SNAPSHOT_CFG_S

#### 7.3.11 RKADK_PLAYER_SNAPSHOT_CFG_S

**Beschreibung**

Schnappschuss-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32VencChn;
  RKADK_U32 u32MaxWidth;    //Support snapshot max width, default 4096
  RKADK_U32 u32MaxHeight;   //Support snapshot max height, default 4096
  RKADK_PPLAYER_SNAPSHOT_RECV_FN pfnDataCallback;
} RKADK_PLAYER_SNAPSHOT_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32VencChn | JPEG-Kodierungskanal |
| u32MaxWidth | Maximale Schnappschussbreite, standardmäßig 4096 |
| u32MaxHeight | Maximale Schnappschusshöhe, standardmäßig 4096 |
| pfnDataCallback | Zeiger auf den Schnappschuss-Daten-Callback |

**Verwandte Datentypen und Schnittstellen**

RKADK_PPLAYER_SNAPSHOT_RECV_FN RKADK_PLAYER_CFG_S

#### 7.3.12 RKADK_PLAYER_VDEC_CFG_S

**Beschreibung**

VDEC-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32FrameBufCnt; //frame buffer cnt(output), default: 3
  RKADK_U32 u32StreamBufCnt; //stream buffer cnt(input), default: 3
} RKADK_PLAYER_VDEC_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32FrameBufCnt | Anzahl der Ausgabepuffer, standardmäßig 3 |
| u32StreamBufCnt | Anzahl der Eingabepuffer, standardmäßig 3 |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_CFG_S

#### 7.3.13 RKADK_PLAYER_RTSP_CFG_S

**Beschreibung**

RTSP-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  const char *transport; //udp or tcp, default: udp
  RKADK_U32 u32IoTimeout; //timeout (in microseconds) of socket I/O operations
} RKADK_PLAYER_RTSP_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| transport | Transportprotokoll, standardmäßig UDP |
| u32ITimeout | Zeitlimit für Socket-E/A in ms; standardmäßig kein Zeitlimit |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_CFG_S

#### 7.3.14 RKADK_PLAYER_PACKET

**Beschreibung**

Datenpaketstruktur für die Nutzung der externen Demuxer-Bibliothek definieren.

**Definition**

```text
typedef struct {
  bool bEofFlag;
  RKADK_S8 *s8PacketData;
  RKADK_S32 s32PacketSize;
  RKADK_U32 u32Seq;
  RKADK_S64 s64Pts;

  //if bypass, must set pFreeCB;
  bool bBypass;
  RKADK_MPI_MB_FREE_CB pFreeCB;
} RKADK_PLAYER_PACKET;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bEofFlag | Ob es sich um den letzten Datenframe handelt |
| s8PacketData | Datenzeiger |
| s32PacketSize | Datenlänge |
| u32Seq | Sequenznummer |
| s64Pts | Zeitstempel |
| bBypass | Datenübertragung: true bedeutet direkte Weitergabe, false bedeutet zusätzliche Kopie |
| pFreeCB | Funktionszeiger zum Freigeben von s8PacketData; bei bBypass=true erforderlich |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_SendAudioPacket RKADK_PLAYER_SendVideoPacket

#### 7.3.15 RKADK_PLAYER_DATA_PARAM_S

**Beschreibung**

Audio-/Videoparameterstruktur zur Verwendung mit aktivierter externer Demuxer-Bibliothek definieren.

**Definition**

```text
typedef struct {
  const RKADK_CHAR *pFilePath;
  RKADK_BOOL bIsRtsp;
  RKADK_BOOL bVideoExist;
  RKADK_BOOL bAudioExist;

  //video param
  RKADK_CODEC_TYPE_E enVCodecType;
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_FORMAT_E enPixFmt; //output pixel format
  RKADK_U32 u32FrameRate;

  //audio param
  RKADK_CODEC_TYPE_E enACodecType;
  RKADK_S32 u32BitWidth;
  RKADK_S32 u32SampleRate;
  RKADK_S32 u32Channel;
} RKADK_PLAYER_DATA_PARAM_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| pFilePath | Pfad der wiederzugebenden Datei |
| bIsRtsp | Ob es sich um einen RTSP-Netzwerkstream handelt |
| bVideoExist | Ob die wiederzugebende Datei einen Videostream enthält |
| bAudioExist | Ob die wiederzugebende Datei einen Audiostream enthält |
| enVCodecType | Dekodierungsformat des Videostreams |
| u32Width | Breite des Videostreams |
| u32Height | Höhe des Videostreams |
| u32FrameRate | Bildrate des Videostreams |
| enACodecType | Dekodierungsformat des Audiostreams |
| u32BitWidth | Bitbreite des Audiostreams |
| u32SampleRate | Abtastrate des Audiostreams |
| u32Channel | Anzahl der Audiostream-Kanäle |

**Verwandte Datentypen und Schnittstellen**

RKADK_PLAYER_SetDataParam

## 8. Live-Streaming

### 8.1 Überblick

Stellt grundlegende Dienste für standardmäßiges RTSP-Live-Streaming sowie RTMP-Live-Streaming bereit. RTSP und RTMP können nicht gleichzeitig gestartet werden.

### 8.2 API-Referenz

#### 8.2.1 RTSP

##### 8.2.1.1 RKADK_RTSP_Init

**Beschreibung**

RTSP-Modul initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_Init(RKADK_U32 u32CamId, RKADK_U32 port, const char *path, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| port | Portnummer | Eingabe |
| path | RTSP-Adresse | Eingabe |
| ppHandle | Erzeugtes RTSP-Handle | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h

Bibliothek: librkadk.so

**Hinweis**

Nach RKADK_RTSP_Init RKADK_RTSP_Start aufrufen, um das RTSP-Live-Streaming zu starten.

**Beispiel**

rkadk_rtsp_test

**Siehe auch**

RKADK_RTSP_DeInit

##### 8.2.1.2 RKADK_RTSP_DeInit

**Beschreibung**

RTSP-Modul deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_DeInit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTSP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_rtsp_test

**Siehe auch**

RKADK_RTSP_Init

##### 8.2.1.3 RKADK_RTSP_Start

**Beschreibung**

RTSP-Live-Streaming starten.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_Start(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTSP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle nach RKADK_RTSP_Init aufrufen.

**Beispiel**

rkadk_rtsp_test

**Siehe auch**

RKADK_RTSP_Stop

##### 8.2.1.4 RKADK_RTSP_Stop

**Beschreibung**

RTSP-Live-Streaming stoppen.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_Stop(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTSP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_rtsp_test

**Siehe auch**

RKADK_RTSP_Start

##### 8.2.1.5 RKADK_RTSP_VideoReset

**Beschreibung**

RTSP-Live-Streaming neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_VideoReset(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTSP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h

Bibliothek: librkadk.so

**Hinweis**

RKADK_RTSP_VideoReset ist erst nach RKADK_RTSP_Init verwendbar. Beim Ändern von Auflösung, Bildrate, Bitrate, Kodierungs- oder Aufzeichnungstyp die Live-Parameter in der ini-Datei über RKADK_PARAM_SetCamParam neu setzen. RV1126/RV1109 und RK3576 unterstützen keinen dynamischen Wechsel von Auflösung und Kodierungstyp: zuerst RKADK_RTSP_DeInit aufrufen, die neue Auflösung bzw. den Kodierungstyp einstellen und danach erneut RKADK_RTSP_Init aufrufen. Teilen Live und andere Module den VI-Kanal, müssen ihre Auflösungen gleichzeitig umgestellt werden, damit VI- und VENC-Auflösung übereinstimmen.

#### 8.2.2 RTMP

##### 8.2.2.1 RKADK_RTMP_Init

**Beschreibung**

RTMP-Modul initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_RTMP_Init(RKADK_U32 u32CamId, const char *path, RKADK_MW_PTR *ppHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| path | RTMP-Adresse | Eingabe |
| ppHandle | Erzeugtes RTMP-Handle | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtmp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_rtmp_test

**Siehe auch**

RKADK_RTMP_DeInit

##### 8.2.2.2 RKADK_RTMP_DeInit

**Beschreibung**

RTMP-Modul deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_RTMP_DeInit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTMP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtmp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_rtmp_test

**Siehe auch**

RKADK_RTMP_Init

##### 8.2.2.3 RKADK_RTSP_VideoReset

**Beschreibung**

RTSP-Live-Streaming neu konfigurieren.

**Syntax**

```c
RKADK_S32 RKADK_RTSP_VideoReset(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Erzeugtes RTSP-Handle | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_rtsp.h. Bibliothek: librkadk.so

**Hinweis**

RKADK_RTMP_VideoReset ist erst nach RKADK_RTMP_Init verwendbar. Beim Ändern von Auflösung, Bildrate, Bitrate, Kodierungs- oder Aufzeichnungstyp die Live-Parameter in der ini-Datei über RKADK_PARAM_SetCamParam neu setzen. RV1126/RV1109 und RK3576 unterstützen keinen dynamischen Wechsel von Auflösung und Kodierungstyp: zuerst RKADK_RTMP_DeInit aufrufen, die neue Auflösung bzw. den Kodierungstyp einstellen und danach erneut RKADK_RTMP_Init aufrufen. Teilen Live und andere Module den VI-Kanal, müssen ihre Auflösungen gleichzeitig umgestellt werden, damit VI- und VENC-Auflösung übereinstimmen.

## 9. Speicherung

### 9.1 Überblick

Stellt grundlegende Speicherfunktionen bereit: Dateien erkennen, speichern, abrufen und verwalten; Gerätekapazität und -status abfragen; Dateien automatisch löschen; formatieren.

### 9.2 API-Referenz

#### 9.2.1 RKADK_STORAGE_Init

**Beschreibung**

Speichermodul initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_Init(RKADK_MW_PTR *ppHandle, RKADK_STR_DEV_ATTR *pstDevAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| ppHandle | Erzeugtes Handle des Speichermoduls | Ausgabe |
| pstDevAttr | Zeiger auf die Attribute des eingehängten Geräts | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

Eine wiederholte Initialisierung wird nicht unterstützt. Wird RKADK_STR_DEV_ATTR als NULL übergeben, gelten die Standardattribute: zwei Ordner video_front und video_back, Sortierung nach Dateiname, automatische Löschschwelle 500~1000M, keine Begrenzung der Dateianzahl und ein Anteil von 50%.

**Beispiel**

rkadk_storage_test

**Siehe auch**

RKADK_STORAGE_Deinit

#### 9.2.2 RKADK_STORAGE_Deinit

**Beschreibung**

Speichermodul deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_Deinit(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

Wiederholte Deinitialisierung wird nicht unterstützt.

**Beispiel**

rkadk_storage_test

**Siehe auch**

RKADK_STORAGE_Init

#### 9.2.3 RKADK_STORAGE_GetDevAttr

**Beschreibung**

Attribute des eingehängten Geräts abrufen.

**Syntax**

```c
RKADK_STR_DEV_ATTR RKADK_STORAGE_GetDevAttr(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| RKADK_STR_DEV_ATTR | Attributstruktur des eingehängten Geräts |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

RKADK_STORAGE_GetDevAttr ist erst nach der Initialisierung des Speichermoduls verwendbar.

**Beispiel**

Keine

**Siehe auch**

Keine

#### 9.2.4 RKADK_STORAGE_GetMountStatus

**Beschreibung**

Einbindestatus des Geräts abrufen.

**Syntax**

```c
RKADK_MOUNT_STATUS RKADK_STORAGE_GetMountStatus(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| RKADK_MOUNT_STATUS | Aufzählung der Einbindestatuswerte |

**Voraussetzungen**

Header-Datei: rkadk_storage.h

Bibliothek: librkadk.so

**Beispiel**

rkadk_storage_test

**Siehe auch**

Keine

#### 9.2.5 RKADK_STORAGE_GetCapacity

**Beschreibung**

Gerätekapazität abrufen.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_GetCapacity(RKADK_MW_PTR *ppHandle, RKADK_S32 *totalSize, RKADK_S32 *freeSize);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| ppHandle | Erzeugtes Handle des Speichermoduls | Input/Output |
| totalSize | Zeiger auf die Gesamtkapazität des Geräts | Ausgabe |
| freeSize | Zeiger auf die verbleibende Gerätekapazität | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_storage_test

**Siehe auch**

Keine

#### 9.2.6 RKADK_STORAGE_GetFileList

**Beschreibung**

Dateiliste abrufen.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_GetFileList(RKADK_FILE_LIST *list, RKADK_MW_PTR pHandle, RKADK_SORT_TYPE sort);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| list | Zeiger auf die Dateilistenstruktur | Eingabe/Ausgabe |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |
| sort | Sortiertyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

Muss zusammen mit RKADK_STORAGE_FreeFileList verwendet werden.

**Beispiel**

rkadk_storage_test

**Siehe auch**

RKADK_STORAGE_FreeFileList

#### 9.2.7 RKADK_STORAGE_FreeFileList

**Beschreibung**

Dateiliste freigeben.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_FreeFileList(RKADK_FILE_LIST *list);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| list | Zeiger auf die Dateilistenstruktur | Eingabe/Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

Muss zusammen mit RKADK_STORAGE_GetFileList verwendet werden.

**Beispiel**

rkadk_storage_test

**Siehe auch**

RKADK_STORAGE_GetFileList

#### 9.2.8 RKADK_STORAGE_GetFileNum

**Beschreibung**

Anzahl der Dateien abrufen.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_GetFileNum(RKADK_CHAR *fileListPath, RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| fileListPath | Zeiger auf den Dateilistenpfad | Eingabe |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| non-negative | Anzahl der Dateien |
| -1 | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Beispiel**

Keine

**Siehe auch**

Keine

#### 9.2.9 RKADK_STORAGE_GetDevPath

**Beschreibung**

Pfad des eingehängten Geräts abrufen.

**Syntax**

```c
RKADK_CHAR *RKADK_STORAGE_GetDevPath(RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| RKADK_CHAR * | Zeiger auf den Pfad des eingehängten Geräts |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Hinweis**

RKADK_STORAGE_GetDevPath ist erst nach der Initialisierung des Speichermoduls verwendbar.

**Beispiel**

rkadk_storage_test

**Siehe auch**

Keine

#### 9.2.10 RKADK_STORAGE_Format

**Beschreibung**

Gerät formatieren.

**Syntax**

```c
RKADK_S32 RKADK_STORAGE_Format(RKADK_MW_PTR pHandle, RKADK_CHAR *cFormat);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| PHandle | Zeiger auf das Handle des Speichermoduls | Eingabe |
| cFormat | Dateisystemtyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_storage.h. Bibliothek: librkadk.so

**Beispiel**

Keine

**Siehe auch**

Keine

### 9.3 Datentypen

Das Speichermodul stellt hauptsächlich diese Datentypen bereit: RKADK_MOUNT_STATUS: Aufzählung der Einbindestatuswerte; RKADK_SORT_TYPE: Aufzählung der Sortiertypen; RKADK_SORT_CONDITION: Aufzählung der Sortierbedingungen.

RKADK_STR_FOLDER_ATTR: Ordner-Attributstruktur; RKADK_STR_DEV_ATTR: Geräte-Attributstruktur; RKADK_FILE_INFO: Dateiinformationsstruktur; RKADK_FILE_LIST: Dateilistenstruktur; RKADK_FILE_LIST_ARRAY: Struktur einer Gruppe von Dateilisten.

#### 9.3.1 RKADK_MOUNT_STATUS

**Beschreibung**

Definiert die Aufzählung der Einbindestatuswerte.

**Definition**

```text
typedef enum {
  DISK_UNMOUNTED = 0,
  DISK_NOT_FORMATTED,
  DISK_FORMAT_ERR,
  DISK_SCANNING,
  DISK_MOUNTED,
  DISK_MOUNT_BUTT,
} RKADK_MOUNT_STATUS;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| DISK_UNMOUNTED | Datenträger nicht eingehängt |
| DISK_NOT_FORMATTED | Datenträger nicht formatiert |
| DISK_FORMAT_ERR | Datenträgerformatfehler |
| DISK_SCANNING | Datenträger wird durchsucht |
| DISK_MOUNTED | Datenträger eingehängt |

**Verwandte Datentypen und Schnittstellen**

RKADK_STORAGE_GetMountStatus

#### 9.3.2 RKADK_SORT_TYPE

**Beschreibung**

Definiert die Aufzählung der Sortiertypen.

**Definition**

```text
typedef enum {
  LIST_ASCENDING = 0,
  LIST_DESCENDING,
  LIST_BUTT,
} RKADK_SORT_TYPE;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| LIST_ASCENDING | Liste aufsteigend sortieren |
| LIST_DESCENDING | Liste absteigend sortieren |

**Verwandte Datentypen und Schnittstellen**

RKADK_STORAGE_GetFileList

#### 9.3.3 RKADK_SORT_CONDITION

**Beschreibung**

Definiert die Aufzählung der Sortierbedingungen.

**Definition**

```text
typedef enum {
  SORT_MODIFY_TIME = 0,
  SORT_FILE_NAME,
  SORT_BUTT,
} RKADK_SORT_CONDITION;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| SORT_MODIFY_TIME | Liste nach Dateiänderungszeit sortieren |
| SORT_FILE_NAME | Liste nach Dateiname sortieren |

**Verwandte Datentypen und Schnittstellen**

RKADK_STR_FOLDER_ATTR

#### 9.3.4 RKADK_STR_FOLDER_ATTR

**Beschreibung**

Ordner-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_CHAR cFolderPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_SORT_CONDITION s32SortCond;
  RKADK_BOOL bNumLimit;
  RKADK_S32 s32Limit;
} RKADK_STR_FOLDER_ATTR;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| cFolderPath | Ordnerpfad |
| s32SortCond | Sortierbedingungen |
| bNumLimit | Option: Obergrenze anhand der Dateianzahl festlegen |
| s32Limit | Maximale Ordnerkapazität (Anteil/Anzahl) |

**Verwandte Datentypen und Schnittstellen**

RKADK_SORT_CONDITION RKADK_STR_DEV_ATTR

#### 9.3.5 RKADK_STR_DEV_ATTR

**Beschreibung**

Geräte-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_CHAR cDevPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_CHAR cMountPath[RKADK_MAX_FILE_PATH_LEN];
  RKADK_S32 s32FreeSizeDelMin;
  RKADK_S32 s32FreeSizeDelMax;
  RKADK_S32 s32AutoDel;
  RKADK_S32 s32FolderNum;
  RKADK_CHAR cFormatId[RKADK_MAX_FORMAT_ID_LEN];
  RKADK_CHAR cVolume[RKADK_MAX_VOLUME_LEN];
  RKADK_S32 s32CheckFormatId;
  RKADK_STR_FOLDER_ATTR *pstFolderAttr;
} RKADK_STR_DEV_ATTR;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| cDevPath | Gerätename (Gerätepfad) |
| cMountPath | Einhängepfad des Geräts |
| s32FreeSizeDelMin | Untere Schwelle für automatisches Löschen |
| s32FreeSizeDelMax | Obere Schwelle für automatisches Löschen |
| s32AutoDel | Option für automatisches Löschen |
| s32FolderNum | Anzahl der Ordner |
| cFormatId | Format-ID |
| cVolume | Datenträgerbezeichnung |
| s32CheckFormatId | Übereinstimmung der Format-ID prüfen |
| pstFolderAttr | Zeiger auf die Ordner-Attributstruktur |

**Verwandte Datentypen und Schnittstellen**

RKADK_STR_FOLDER_ATTR RKADK_STORAGE_Init RKADK_STORAGE_GetDevAttr

#### 9.3.6 RKADK_FILE_INFO

**Beschreibung**

Dateiinformationsstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_CHAR filename[RKADK_MAX_FILE_PATH_LEN];
  off_t stSize;
  time_t stTime;
  void *thumb;
} RKADK_FILE_INFO;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| filename | Dateiname |
| stSize | Dateigröße |
| stTime | Dateiänderungszeit |
| thumb | Zeiger auf das Vorschaubild |

**Verwandte Datentypen und Schnittstellen**

RKADK_FILE_LIST

#### 9.3.7 RKADK_FILE_LIST

**Beschreibung**

Dateilistenstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_CHAR path[RKADK_MAX_FILE_PATH_LEN];
  RKADK_S32 s32FileNum;
  RKADK_FILE_INFO *file;
} RKADK_FILE_LIST;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| path | Pfad der Dateiliste (des Ordners) |
| s32FileNum | Anzahl der Dateien |
| file | Zeiger auf die Dateiinformationsstruktur |

**Verwandte Datentypen und Schnittstellen**

RKADK_FILE_INFO RKADK_FILE_LIST_ARRAY

#### 9.3.8 RKADK_FILE_LIST_ARRAY

**Beschreibung**

Struktur einer Gruppe von Dateilisten definieren.

**Definition**

```text
typedef struct {
  RKADK_S32 s32ListNum;
  RKADK_FILE_LIST *list;
} RKADK_FILE_LIST_ARRAY;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| s32ListNum | Anzahl der Dateilisten (Ordner) |
| list | Zeiger auf die Dateilistenstruktur |

**Verwandte Datentypen und Schnittstellen**

RKADK_FILE_LIST

## 10. Anzeige

### 10.1 Überblick

Bietet lokale Vorschau sowie die Anzeige zweier horizontal oder vertikal zusammengefügter Streams. Unterstützt Bild-in-Bild mit mehreren Kamerastreams und dem Austausch des Inhalts zwischen Hauptbild und PIP-Bereich. Auch lokale Vorschau und externe H264/H265-Streams können gemeinsam mit umschaltbaren Bildbereichen als Bild-in-Bild angezeigt werden. Bis zu zwei PIP-Streamkanäle werden unterstützt.

### 10.2 API-Referenz

#### 10.2.1 RKADK_DISP_Init

**Beschreibung**

Modul für lokale Vorschau initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_DISP_Init(RKADK_U32 u32CamId);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_disp_test

**Siehe auch**

RKADK_DISP_DeInit

#### 10.2.2 RKADK_DISP_DeInit

**Beschreibung**

Modul für lokale Vorschau deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_DISP_DeInit(RKADK_U32 u32CamId);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h

Bibliothek: librkadk.so

**Beispiel**

rkadk_disp_test

**Siehe auch**

RKADK_DISP_Init

#### 10.2.3 RKADK_DISP_SetAttr

**Beschreibung**

Vorschauattribute festlegen.

**Syntax**

```c
RKADK_S32 RKADK_DISP_SetAttr(RKADK_U32 u32CamId, RKADK_DISP_ATTR_S *pstAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| pstAttr | Vorschauattribute | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

#### 10.2.4 RKADK_DISP_InitEx

**Beschreibung**

Lokale Vorschau und Nebenstream initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_DISP_InitEx(RKADK_DISP_CFG_S *pstAttr, RKADK_MW_PTR *ppHandle) ;
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pstAttr | Zeiger auf die Konfigurationsparameter für Vorschau und Nebenstream | Eingabe |
| ppHandle | Zeiger auf die erzeugte Vorschauaufgabe | Ausgabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Hinweise**

Beim Nebenstream-Typ RKADK_STREAM_TYPE_DISP werden die Initialisierungsparameter aus der ini-Datei gelesen.

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_disp_test

**Verwandte Themen**

RKADK_DISP_DeInitEx

#### 10.2.5 RKADK_DISP_DeInitEx

**Beschreibung**

Lokale Vorschau und Nebenstream deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_DISP_DeInitEx(RKADK_MW_PTR pHandle) ;
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Zeiger auf die Vorschauaufgabe | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_disp_test

**Verwandte Themen**

RKADK_DISP_InitEx

#### 10.2.6 RKADK_DISP_SetAttrEx

**Beschreibung**

Attribute für Vorschau und Nebenstream festlegen.

**Syntax**

```c
RKADK_S32 RKADK_DISP_SetAttrEx(RKADK_DISP_ATTR_S *pstAttr, RKADK_MW_PTR pHandle);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pstAttr | Attribute für Vorschau und Nebenstream | Eingabe |
| pHandle | Zeiger auf die Vorschauaufgabe | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

#### 10.2.7 RKADK_DISP_SendVideoStream

**Beschreibung**

Bei aktivierter Nebenstream-Anzeige übergibt diese Schnittstelle die Nebenstream-Daten an VDEC.

**Syntax**

```c
RKADK_S32 RKADK_DISP_SendVideoStream(RKADK_MW_PTR pHandle, RKADK_U32 u32VdecChn, RKADK_DISP_DATA_S *pstData);
```

**Parameter**

| Parametername | Beschreibung | Input/Output |
| --- | --- | --- |
| pHandle | Zeiger auf die Vorschauaufgabe | Eingabe |
| u32VdecChn | VDEC-Kanal | Eingabe |
| pstData | Zeiger auf die Nebenstream-Daten | Eingabe |

**Rückgabewerte**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_disp.h. Bibliothek: librkadk.so

### 10.3 Datentypen

Das Anzeigemodul stellt hauptsächlich folgende Datentypen bereit: RKADK_DISP_SUB_STREAM_NUM: Anzahl der Nebenstreams; RKADK_DISP_CFG_S: Konfigurationsstruktur für Vorschau und Nebenstreams; RKADK_DISP_STREAM_CFG_S: Konfigurationsstruktur für Nebenstream-Parameter; RKADK_DISP_VDEC_CFG_S: Konfigurationsstruktur für VDEC-Parameter des Nebenstreams; RKADK_DISP_VO_CFG_S: Konfigurationsstruktur für VO-Parameter des Nebenstreams; RKADK_DISP_ATTR_S: Attributstruktur für Vorschau und Nebenstreams; RKADK_DISP_STREAM_ATTR_S: Nebenstream-Attributstruktur; RKADK_DISP_VDEC_ATTR_S: VDEC-Attributstruktur des Nebenstreams.

RKADK_DISP_DATA_S: Datenstruktur des Nebenstreams

#### 10.3.1 RKADK_DISP_SUB_STREAM_NUM

**Beschreibung**

Anzahl der Nebenstreams.

**Definition**

```text
#define RKADK_DISP_SUB_STREAM_NUM 2
```

#### 10.3.2 RKADK_DISP_CFG_S

**Beschreibung**

Definiert die Konfigurationsstruktur für Vorschau und Nebenstream.

**Definition**

```text
typedef struct {
  RKADK_U32 u32CamId;
  RKADK_DISP_STREAM_CFG_S stSubStream[RKADK_DISP_SUB_STREAM_NUM];
} RKADK_DISP_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32CamId | Kamera-ID |
| stSubStream | Nebenstream-Parameter |

#### 10.3.3 RKADK_DISP_STREAM_CFG_S

**Beschreibung**

Definiert die Konfigurationsstruktur für Nebenstream-Parameter.

**Definition**

```text
typedef struct {
  RKADK_BOOL bEnable;                       /* enable subwindow */
  RKADK_S32 s32CamId;                       /* subwindow camera id, set to -1 when
RKADK_STREAM_TYPE_THIRD_STREAM */
  RKADK_STREAM_TYPE_E enStreamType;         /* subwindow stream type */
  RKADK_DISP_VO_CFG_S stVoCfg;              /* VO configuration read from ini when
RKADK_STREAM_TYPE_DISP */
  RKADK_DISP_VDEC_CFG_S stVdecCfg;          /* stream must set stVdecCfg when
RKADK_STREAM_TYPE_THIRD_STREAM */
} RKADK_DISP_STREAM_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bEnable | Ob der Nebenstream aktiviert werden soll |
| s32CamId | Kamera-ID des Nebenstreams; bei externem Stream auf -1 setzen |
| enStreamType | Nebenstream-Typ |
| stVoCfg | VO-Konfigurationsparameter des Nebenstreams; beim Typ RKADK_STREAM_TYPE_DISP aus der ini-Datei gelesen |
| stVdecCfg | VDEC-Konfigurationsparameter des Nebenstreams; beim Typ RKADK_STREAM_TYPE_THIRD_STREAM erforderlich |

#### 10.3.4 RKADK_DISP_VDEC_CFG_S

**Beschreibung**

Definiert die Konfigurationsstruktur für VDEC-Parameter des Nebenstreams.

**Definition**

```text
typedef struct {
  RKADK_U32 u32VdecChn;
  RKADK_U32 u32SrcWidth;
  RKADK_U32 u32SrcHeight;
  RKADK_CODEC_TYPE_E enCodecType;
  RKADK_U32 u32StreamBufCnt;                /* stream(input) buffer count, default: 8 */
  RKADK_U32 u32FrameBufCnt;                 /* frame(output) buffer count, default: 3 */
  RKADK_U32 u32FrameBufSize;                /* if not set, calculated internally */
  VIDEO_MODE_E u32DecodeMode;               /* decoding mode */
  VIDEO_OUTPUT_ORDER_E enOutputOrder;       /* frames output order */
} RKADK_DISP_VDEC_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32VdecChn | VDEC-Kanal |
| u32SrcWidth | Breite des Nebenstreams |
| u32SrcHeight | Höhe des Nebenstreams |
| enCodecType | Kodierungstyp des Nebenstreams (H264/H265) |
| u32StreamBufCnt | Anzahl der VDEC-Eingabepuffer, standardmäßig 8 |
| u32FrameBufCnt | Anzahl der VDEC-Ausgabepuffer, standardmäßig 3 |
| u32FrameBufSize | VDEC-Puffergröße; bei 0 intern von VDEC berechnet |
| u32DecodeMode | Methode der Stream-Übergabe |
| enOutputOrder | Dekodierausgabereihenfolge: bei Streams mit B-Frames Anzeigereihenfolge einstellen, sonst Dekodierreihenfolge |

#### 10.3.5 RKADK_DISP_VO_CFG_S

**Beschreibung**

Definiert die Konfigurationsstruktur für VO-Parameter des Nebenstreams.

**Definition**

```text
typedef struct {
  RKADK_U32 u32VoChn;
  RKADK_RECT_S stVoRect;
  RKADK_U32 rotation;     /* Range:[0,3], 0:0, 1:90, 2:180, 3:270 */
} RKADK_DISP_VO_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32VoChn | VO-Kanal |
| stVoRect | Ausgabeanzeigebereich des Nebenstreams |
| rotation | Drehung des Nebenstreams |

#### 10.3.6 RKADK_DISP_ATTR_S

**Beschreibung**

Attributstruktur für Vorschau und Nebenstream definieren.

**Definition**

```text
typedef struct {
  RKADK_RECT_S stVpssCropRect;
  RKADK_RECT_S stVoRect;
  RKADK_S32 s32Priority;  /* Overlay priority, higher value, higher priority, -1 is not
change */
  RKADK_DISP_STREAM_ATTR_S stSubStreamAttr[RKADK_DISP_SUB_STREAM_NUM];
} RKADK_DISP_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| stVpssCropRect | Eingabeanzeigebereich |
| stVoRect | Ausgabeanzeigebereich |
| s32Priority | Priorität des Vo-Kanals: höherer Wert bedeutet höhere Priorität; -1 bedeutet nicht setzen (Standardpriorität verwenden) |
| stSubStreamAttr | Nebenstream-Attribute |

#### 10.3.7 RKADK_DISP_STREAM_ATTR_S

**Beschreibung**

Definiert die Attributstruktur des Nebenstreams.

**Definition**

```text
typedef struct {
  RKADK_RECT_S stVpssCropRect;
  RKADK_RECT_S stVoRect;
  RKADK_S32 s32Priority;  /* Overlay priority, higher value, higher priority, -1 is not
change */
  RKADK_DISP_VDEC_ATTR_S stVdecAttr;
} RKADK_DISP_STREAM_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| stVpssCropRect | Eingabeanzeigebereich des Nebenstreams; nur beim Typ RKADK_STREAM_TYPE_DISP wirksam |
| stVoRect | Ausgabeanzeigebereich des Nebenstreams |
| s32Priority | Priorität des vo-Kanals: höherer Wert bedeutet höhere Priorität; -1 bedeutet nicht setzen (Standardpriorität verwenden) |
| stVdecAttr | VDEC-Attribute des Nebenstreams; nur beim Typ RKADK_STREAM_TYPE_THIRD_STREAM wirksam |

#### 10.3.8 RKADK_DISP_VDEC_ATTR_S

**Beschreibung**

Definiert die VDEC-Attributstruktur des Nebenstreams.

**Definition**

```text
typedef struct {
  RKADK_U32 u32SrcWidth;
  RKADK_U32 u32SrcHeight;
  RKADK_CODEC_TYPE_E enCodecType; // RKADK_CODEC_TYPE_BUTT is not change
} RKADK_DISP_VDEC_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32SrcWidth | Breite des Nebenstreams |
| u32SrcHeight | Höhe des Nebenstreams |
| enCodecType | Kodierungstyp des Nebenstreams (H264/H265) |

#### 10.3.9 RKADK_DISP_DATA_S

**Beschreibung**

Definiert die Datenstruktur des Nebenstreams.

**Definition**

```text
typedef struct {
  bool bEofFlag;
  char *data;
  RKADK_U32 u32Len;
  RKADK_U64 u64Pts;
  RKADK_U32 u32Seq;
  bool bBypass;             /* if bypass, must set pFreeCB; */
  RKADK_DISP_MB_FREE_CB pFreeCB;
} RKADK_DISP_DATA_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| bEofFlag | Gibt an, ob dies der letzte Datenframe ist |
| data | Datenzeiger |
| u32Len | Datenlänge |
| u32Seq | Sequenznummer |
| u64Pts | Zeitstempel |
| bBypass | Datenübertragung: true bedeutet Bypass, false bedeutet Kopieren |
| pFreeCB | Zeiger auf die Datenfreigabefunktion; bei bBypass=true erforderlich |

## 11. OSD

### 11.1 Überblick

Das OSD-Modul bietet grundlegende Wasserzeichenfunktionen

### 11.2 API-Referenz

#### 11.2.1 RKADK_OSD_Init

**Beschreibung**

Wasserzeichenaufgabe initialisieren.

**Syntax**

```c
RKADK_S32 RKADK_OSD_Init(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| pstOsdAttr | Zeiger auf die Attribute der Wasserzeichenaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

**Hinweis**

Wiederholte Initialisierung wird nicht unterstützt.

#### 11.2.2 RKADK_OSD_Deinit

**Beschreibung**

Wasserzeichenaufgabe deinitialisieren.

**Syntax**

```c
RKADK_S32 RKADK_OSD_Deinit(RKADK_U32 u32OsdId);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

**Hinweis**

Wiederholte Deinitialisierung wird nicht unterstützt.

#### 11.2.3 RKADK_OSD_UpdateBitMap

**Beschreibung**

Wasserzeicheninhalt aktualisieren.

**Syntax**

```c
RKADK_S32 RKADK_OSD_UpdateBitMap(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| pstOsdAttr | Zeiger auf die Attribute der Wasserzeichenaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

**Hinweis**

Muss nach Abschluss der Deinitialisierungsaufgabe verwendet werden.

#### 11.2.4 RKADK_OSD_AttachToStream

**Beschreibung**

Wasserzeichen dem Zielstream zuordnen.

**Syntax**

```c
RKADK_S32 RKADK_OSD_AttachToStream(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_OSD_STREAM_ATTR_S *pstOsdStreamAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Typ des Zielstreams | Eingabe |
| pstOsdStreamAttr | Zeiger auf die Positionsinformationen des Wasserzeichens | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

**Hinweis**

Dasselbe Wasserzeichen kann demselben Streamtyp nicht mehrfach zugeordnet werden.

#### 11.2.5 RKADK_OSD_DettachFromStream

**Beschreibung**

Wasserzeichen vom Zielstream entfernen.

**Syntax**

```c
RKADK_S32 RKADK_OSD_DettachFromStream(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Typ des Zielstreams | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

#### 11.2.6 RKADK_OSD_UpdateOsdSize

**Beschreibung**

Wasserzeichengröße aktualisieren.

**Syntax**

```c
RKADK_S32 RKADK_OSD_UpdateOsdSize(RKADK_U32 u32OsdId, RKADK_OSD_ATTR_S *pstOsdAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| pstOsdAttr | Zeiger auf die Attribute der Wasserzeichenaufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

#### 11.2.7 RKADK_OSD_UpdateDisplayAttr

**Beschreibung**

Anzeigebereich des Wasserzeichens aktualisieren.

**Syntax**

```c
RKADK_S32 RKADK_OSD_UpdateDisplayAttr(RKADK_U32 u32OsdId, RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType, RKADK_OSD_STREAM_ATTR_S *pstOsdStreamAttr);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32OsdId | Wasserzeichen-ID | Eingabe |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Streamtyp | Eingabe |
| pstOsdStreamAttr | Positionsinformationen des Wasserzeichens | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_osd.h. Bibliothek: librkadk.so

### 11.3 Datentypen

Das Wasserzeichenmodul stellt hauptsächlich folgende Datentypen bereit: RKADK_OSD_ATTR_S: Wasserzeichen-Attributstruktur; RKADK_OSD_STREAM_ATTR_S: Struktur der Positionsinformationen; RKADK_OSD_TYPE_E: Wasserzeichen-Überlagerungstyp.

#### 11.3.1 RKADK_OSD_ATTR_S

**Beschreibung**

Wasserzeichenattribute definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 Width;
  RKADK_U32 Height;
  RKADK_VOID *pData;
  RKADK_FORMAT_E Format;
  RKADK_OSD_TYPE_E enOsdType;
} RKADK_OSD_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| Breite | Wasserzeichenbreite |
| Höhe | Wasserzeichenhöhe |
| pData | Wasserzeicheninhalt |
| Format | Wasserzeichenformat |
| enOsdType | Wasserzeichen-Überlagerungstyp |

**Verwandte Datentypen und Schnittstellen**

RKADK_OSD_ATTR_S RKADK_OSD_TYPE_E

#### 11.3.2 RKADK_OSD_STREAM_ATTR_S

**Beschreibung**

Positionsinformationen des Wasserzeichens definieren.

**Definition**

```text
typedef struct {
  RKADK_BOOL bEnableShow;
  RKADK_U32 Origin_X;
  RKADK_U32 Origin_Y;
} RKADK_OSD_STREAM_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| Origin_X | X-Versatz der Wasserzeichen-Startposition |
| Origin_Y | Y-Versatz der Wasserzeichen-Startposition |
| bEnableShow | Ob das Wasserzeichen angezeigt werden soll |

**Verwandte Datentypen und Schnittstellen**

RKADK_OSD_STREAM_ATTR_S

### 11.4 RKADK_OSD_TYPE_E

**Beschreibung**

Wasserzeichen-Überlagerungstyp definieren.

**Definition**

```text
typedef enum {
  RKADK_OSD_TYPE_NORMAL = 0, //use encoder do osd
  RKADK_OSD_TYPE_EXTRA,      //use rga do osd
  RKADK_OSD_TYPE_BUTT
} RKADK_OSD_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_OSD_TYPE_NORMAL | OSD-Überlagerung im Encoder |
| RKADK_OSD_TYPE_EXTRA | Überlagerung mit RGA |

**Hinweis**

Die JPEG-Kodierung auf RV1109/RV1126 unterstützt keine Wasserzeichenüberlagerung über das Encoder-OSD; RKADK_OSD_TYPE_EXTRA muss eingestellt werden.

## 12. UI-Überlagerung

### 12.1 Überblick

Bietet die Überlagerung von UI und Videobild auf Plattformen mit einschichtigem VOP wie RV1103/RV1106.

### 12.2 API-Referenz

#### 12.2.1 RKADK_UI_Create

**Beschreibung**

UI-Überlagerungsmodul initialisieren

**Syntax**

```c
RKADK_S32 RKADK_UI_Create(RKADK_UI_ATTR_S *pstUiAttr, RKADK_MW_PTR *ppUi);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pstUiAttr | UI-Attribute | Eingabe |
| ppUi | Zeiger auf die erzeugte UI-Aufgabe | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_ui.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_ui_test

**Siehe auch**

RKADK_UI_Destroy

#### 12.2.2 RKADK_UI_Destroy

**Beschreibung**

UI-Überlagerungsmodul deinitialisieren

**Syntax**

```c
RKADK_S32 RKADK_UI_Destroy(RKADK_MW_PTR pUi);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pUi | Zeiger auf die UI-Aufgabe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_ui.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_ui_test

**Siehe auch**

RKADK_UI_Create

#### 12.2.3 RKADK_UI_Update

**Beschreibung**

UI-Daten aktualisieren.

**Syntax**

```c
RKADK_S32 RKADK_UI_Update(RKADK_MW_PTR pUi, RKADK_UI_FRAME_INFO *pstUiFrameInfo);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| pUi | Zeiger auf die UI-Aufgabe | Eingabe |
| pstUiFrameInfo | Zeiger auf die UI-Daten | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_ui.h. Bibliothek: librkadk.so

**Beispiel**

rkadk_ui_test

### 12.3 Datentypen

RKADK_UI_ATTR_S: UI-Attributstruktur; RKADK_UI_FRAME_INFO: UI-Datenstruktur

#### 12.3.1 RKADK_UI_ATTR_S

**Beschreibung**

UI-Attributstruktur definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32DispX;
  RKADK_U32 u32DispY;
  RKADK_U32 u32DispWidth;
  RKADK_U32 u32DispHeight;
  RKADK_U32 u32DispFrmRt;
  RKADK_U32 u32ImgWidth;
  RKADK_U32 u32ImgHeight;
  RKADK_U32 u32VoLay;
  RKADK_U32 u32VoDev;
  RKADK_U32 u32VoChn;
  RKADK_U32 u32Rotation; //0: 0, 1: 90, 2: 180, 3: 270
  RKADK_BOOL bMirror;
  RKADK_BOOL bFlip;
  RKADK_VO_FORMAT_E enUiVoFormat;
  RKADK_VO_INTF_TYPE_E enUiVoIntfTye;
  RKADK_VO_SPLICE_MODE_E enVoSpliceMode;
} RKADK_UI_ATTR_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32DispX | x-Koordinate des Anzeigebereichs der Ebene |
| u32DispY | y-Koordinate des Anzeigebereichs der Ebene |
| u32DispWidth | Breite des Anzeigebereichs der Ebene |
| u32DispHeight | Höhe des Anzeigebereichs der Ebene |
| u32ImgWidth | Bildbreite der Ebene |
| u32ImgHeight | Bildhöhe der Ebene |
| u32DispFrmRt | Bildwiederholrate |
| u32VoLay | Nummer der Videoausgabeebene |
| u32VoDev | Nummer des Anzeigeausgabegeräts |
| u32VoChn | Nummer des Videoausgabekanals, Wertebereich: [0, VO_MAX_CHN_NUM(128)] |
| u32Rotation | Drehung, Werte: [0: 0, 1: 90, 2: 180, 3: 270] |
| bMirror | Spiegelung aktivieren |
| bFlip | Umklappen aktivieren |
| enUiVoFormat | Bildpixelformat |
| enUiVoIntfTye | Typ der Display-Schnittstelle |
| enVoSpliceMode | Ebenen-Kompositionsmodus |

**Verwandte Datentypen und Schnittstellen**

RKADK_VO_FORMAT_E RKADK_VO_INTF_TYPE_E RKADK_VO_SPLICE_MODE_E RKADK_UI_Create

#### 12.3.2 RKADK_UI_FRAME_INFO

**Beschreibung**

UI-Dateninformationen definieren.

**Definition**

```text
typedef struct {
  RKADK_U32 u32Width;
  RKADK_U32 u32Height;
  RKADK_FORMAT_E Format;
  RKADK_VOID *pMblk;
  RKADK_S32 s32MilliSec; //update timeout in millisecond, default: 1000ms
} RKADK_UI_FRAME_INFO;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| u32Width | Breite der UI-Daten |
| u32Height | Höhe der UI-Daten |
| Format | Format der UI-Daten |
| pMblk | Zeiger auf die UI-Daten |
| s32MilliSec | Zeitlimit für UI-Aktualisierung, standardmäßig 1000ms; -1 bedeutet blockierend |

**Verwandte Datentypen und Schnittstellen**

RKADK_FORMAT_E RKADK_UI_Update

#### 12.3.3 RKADK_FORMAT_E

**Beschreibung**

Pixelformat definieren.

**Definition**

```text
typedef enum {
  RKADK_FMT_ARGB1555,                                   /* 16-bit RGB               */
  RKADK_FMT_ABGR1555,                                   /* 16-bit RGB               */
  RKADK_FMT_RGBA5551,                                   /* 16-bit RGB               */
  RKADK_FMT_BGRA5551,                                   /* 16-bit RGB               */
  RKADK_FMT_ARGB4444,                                   /* 16-bit RGB               */
  RKADK_FMT_ABGR4444,                                   /* 16-bit RGB               */
  RKADK_FMT_RGBA4444,                                   /* 16-bit RGB               */
  RKADK_FMT_BGRA4444,                                   /* 16-bit RGB               */
  RKADK_FMT_ARGB8888,                                   /* 32-bit RGB               */
  RKADK_FMT_ABGR8888,                                   /* 32-bit RGB               */
  RKADK_FMT_RGBA8888,                                   /* 32-bit RGB               */
  RKADK_FMT_BGRA8888,                                   /* 32-bit RGB               */
  RKADK_FMT_2BPP,
  RKADK_FMT_YUV420SP,
  RKADK_FMT_YUV420SP_10BIT,
  RKADK_FMT_YUV422SP,
  RKADK_FMT_BUTT,
} RKADK_FORMAT_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_UI_FRAME_INFO

## 13. Parametereinstellungen

### 13.1 Überblick

Das Parametermodul ist eng an die Produktform gekoppelt. Durch Kombination allgemeiner Komponenten-Datenstrukturen entsteht eine zur Produktform passende Struktur. Das Modul unterstützt das Abrufen und Speichern bestimmter Parameter sowie das Wiederherstellen der Standardwerte. Zur einfacheren Bearbeitung werden Parameter als ini-Dateien gespeichert. Der Standard-ini-Pfad lässt sich über die Umgebungsvariable rkadk_default_ini_path festlegen; standardmäßig ist dies /oem/usr/etc.

```text
export rkadk_default_ini_path=/oem/usr/etc
```

### 13.2 API-Referenz

#### 13.2.1 RKADK_PARAM_Init

**Beschreibung**

Parametermodul initialisieren

**Syntax**

```c
RKADK_S32 RKADK_PARAM_Init(char *globalSetting, char **sesnorSettingArrary);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| globalSetting | Pfad der globalen ini-Konfigurationsdatei | Eingabe |
| sesnorSettingArrary | Pfad der Sensor-ini-Konfigurationsdatei | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Vor dem Start eines Moduls zunächst das Parametermodul mit RKADK_PARAM_Init initialisieren. Ist globalSetting nicht gesetzt, wird RKADK_PARAM_PATH verwendet. Ist sesnorSettingArrary nicht gesetzt, gilt RKADK_PARAM_PATH_SENSOR_PREFIX. Das Standardnamensmuster der Sensorkonfiguration lautet rkadk_setting_sensor_n.ini; _n steht für die Kamera-ID des Sensors, beginnend bei 0.

**Beispiel**

rkadk_record_test

**Siehe auch**

Keine

#### 13.2.2 RKADK_PARAM_GetCamParam

**Beschreibung**

Kamerabezogene Parameter abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_GetCamParam(RKADK_S32 s32CamID, RKADK_PARAM_TYPE_E enParamType, RKADK_VOID *pvParam);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| s32CamID | Kamera-ID | Eingabe |
| enParamType | Parametertyp | Eingabe |
| pvParam | Zeiger auf den abgerufenen Parameter | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

rkadk_record_test

**Siehe auch**

RKADK_PARAM_SetCamParam

#### 13.2.3 RKADK_PARAM_SetCamParam

**Beschreibung**

Kamerabezogene Parameter festlegen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_SetCamParam(RKADK_S32 s32CamID, RKADK_PARAM_TYPE_E enParamType, const RKADK_VOID *pvParam);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| s32CamID | Kamera-ID | Eingabe |
| enParamType | Parametertyp | Eingabe |
| pvParam | Zeiger auf den zu setzenden Parameter | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

rkadk_record_test

**Siehe auch**

RKADK_PARAM_GetCamParam

#### 13.2.4 RKADK_PARAM_GetCommParam

**Beschreibung**

Allgemeine Parameter abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_GetCommParam(RKADK_PARAM_TYPE_E enParamType, RKADK_VOID *pvParam);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| enParamType | Parametertyp | Eingabe |
| pvParam | Zeiger auf den abgerufenen Parameter | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h

Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

rkadk_record_test

**Siehe auch**

RKADK_PARAM_SetCommParam

#### 13.2.5 RKADK_PARAM_SetCommParam

**Beschreibung**

Allgemeine Parameter festlegen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_SetCommParam(RKADK_PARAM_TYPE_E enParamType, const RKADK_VOID *pvParam);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| enParamType | Parametertyp | Eingabe |
| pvParam | Zeiger auf den zu setzenden Parameter | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

rkadk_record_test

**Siehe auch**

RKADK_PARAM_GetCommParam

#### 13.2.6 RKADK_PARAM_SetDefault

**Beschreibung**

Standardkonfiguration wiederherstellen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_SetDefault(RKADK_VOID);
```

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

#### 13.2.7 RKADK_PARAM_GetResolution

**Beschreibung**

RKADK_PARAM_RES_E in eine konkrete Auflösung umwandeln.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_GetResolution(RKADK_PARAM_RES_E type, RKADK_U32 *width, RKADK_U32 *height);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| type | Auflösungstyp | Eingabe |
| width | Breite der umgewandelten Auflösung | Ausgabe |
| height | Höhe der umgewandelten Auflösung | Ausgabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Anderer Wert | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

Keine

**Siehe auch**

RKADK_PARAM_GetResType

#### 13.2.8 RKADK_PARAM_GetResType

**Beschreibung**

Auflösung in RKADK_PARAM_RES_E umwandeln.

**Syntax**

```c
RKADK_PARAM_RES_E RKADK_PARAM_GetResType(RKADK_U32 width, RKADK_U32 height);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| width | Bildbreite | Eingabe |
| height | Bildhöhe | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| Entsprechender Wert von RKADK_PARAM_RES_E | Erfolg |
| RKADK_RES_BUTT | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

Keine

**Siehe auch**

RKADK_PARAM_GetResolution

#### 13.2.9 RKADK_PARAM_GetVencChnId

**Beschreibung**

Die Record, Photo und Stream zugeordnete VENC-Kanalnummer abrufen.

**Syntax**

```c
RKADK_S32 RKADK_PARAM_GetVencChnId(RKADK_U32 u32CamId, RKADK_STREAM_TYPE_E enStrmType);
```

**Parameter**

| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| u32CamId | Kamera-ID | Eingabe |
| enStrmType | Streamtyp | Eingabe |

**Rückgabewert**

| Rückgabewert | Beschreibung |
| --- | --- |
| Entsprechende VENC-Kanalnummer | Erfolg |
| -1 | Fehler |

**Voraussetzungen**

Header-Datei: rkadk_param.h. Bibliothek: librkadk.so

**Hinweis**

Diese Schnittstelle darf erst nach der Initialisierung des Parametermoduls durch RKADK_PARAM_Init aufgerufen werden.

**Beispiel**

Keine

**Siehe auch**

Keine

### 13.3 Datentypen

Das Parametermodul stellt hauptsächlich folgende Datentypen bereit: RKADK_DEFPARAM_PATH: Standardpfad der globalen ini-Datei; RKADK_DEFPARAM_PATH_SENSOR_PREFIX: Standardpfad der Sensor-ini-Datei; RKADK_PARAM_PATH: globaler ini-Pfad; RKADK_PARAM_PATH_SENSOR_PREFIX: Sensor-ini-Pfad; RKADK_PARAM_TYPE_E: Aufzählung der Parametertypen; RKADK_PARAM_RES_E: Aufzählung der Auflösungstypen; RKADK_STREAM_TYPE_E: Aufzählung der Datenstreamtypen; RKADK_PARAM_CODEC_CFG_S: Konfigurationsstruktur für Kodierungstypen; RKADK_PARAM_BITRATE_S: Bitratenkonfigurationsstruktur; RKADK_PARAM_REC_TIME_S: Konfigurationsstruktur der Aufnahmedauer; RKADK_PARAM_GOP_S: VENC-GOP-Konfigurationsstruktur; RKADK_VQE_MODE_E: Aufzählung der Klangverbesserungsmodi für den Audioeingang; RKADK_MIC_TYPE_E: Aufzählung der Audiogerät-Kanalmodi.

#### 13.3.1 RKADK_DEFPARAM_PATH

**Beschreibung**

Standardpfad der globalen ini-Datei: Sie speichert die gemeinsame Konfiguration aller Sensoren und dient zum Wiederherstellen der Standardkonfiguration.

**Definition**

```text
#define RKADK_DEFPARAM_PATH "/oem/usr/etc/rkadk_defsetting.ini"
```

#### 13.3.2 RKADK_DEFPARAM_PATH_SENSOR_PREFIX

**Beschreibung**

Standardpfad der Sensor-ini-Datei: Sie speichert die individuelle Konfiguration jedes Sensors und dient zum Wiederherstellen der Standardkonfiguration.

**Definition**

```text
#define RKADK_DEFPARAM_PATH_SENSOR_PREFIX "/oem/usr/etc/rkadk_defsetting_sensor"
```

**Hinweis**

Das Standardnamensmuster der Sensorkonfigurationsdatei ist rkadk_defsetting_sensor_n.ini; _n ist die Kamera-ID des Sensors, beginnend bei 0.

#### 13.3.3 RKADK_PARAM_PATH

**Beschreibung**

Pfad der globalen ini-Datei mit den gemeinsamen Konfigurationen aller Sensoren.

**Definition**

```text
#define RKADK_PARAM_PATH "/data/rkadk/rkadk_setting.ini"
```

#### 13.3.4 RKADK_PARAM_PATH_SENSOR_PREFIX

**Beschreibung**

Pfad der Sensor-ini-Datei mit der individuellen Konfiguration jedes Sensors. Speichert neue Einstellungen beim Wechsel der Aufnahmeauflösung, des Codec-Typs und bei anderen Vorgängen.

**Definition**

```text
#define RKADK_PARAM_PATH_SENSOR_PREFIX "/data/rkadk/rkadk_setting_sensor"
```

**Hinweis**

Das Standardnamensmuster der Sensorkonfigurationsdatei ist rkadk_setting_sensor_n.ini; _n ist die Kamera-ID des Sensors, beginnend bei 0.

#### 13.3.5 RKADK_PARAM_TYPE_E

**Beschreibung**

Aufzählung der Parametertypen definieren.

**Definition**

```text
typedef enum {
  /* Cam Dependent Param */
  RKADK_PARAM_TYPE_FPS,             /* framerate */
  RKADK_PARAM_TYPE_GOP,             /* gop */
  RKADK_PARAM_TYPE_RES,             /* specify RKADK_PARAM_RES_E(record) */
  RKADK_PARAM_TYPE_PHOTO_RES,       /* specify RKADK_PARAM_RES_E(photo) */
  RKADK_PARAM_TYPE_STREAM_RES,      /* specify RKADK_PARAM_RES_CFG_S(record_main,
record_sub, photo, stream, live) */
  RKADK_PARAM_TYPE_CODEC_TYPE,      /* specify RKADK_PARAM_CODEC_CFG_S(record) */
  RKADK_PARAM_TYPE_BITRATE,         /* encode bitrate,specify RKADK_PARAM_BITRATE_S */
  RKADK_PARAM_TYPE_FLIP,            /* bool */
  RKADK_PARAM_TYPE_MIRROR,          /* bool */
  RKADK_PARAM_TYPE_LDC,             /* ldc level [0,255] */
  RKADK_PARAM_TYPE_ANTIFOG,         /* antifog value, [0,10] */
  RKADK_PARAM_TYPE_WDR,             /* wdr level, [0,10] */
  RKADK_PARAM_TYPE_HDR,             /* 0: normal, 1: HDR2, 2: HDR3, [0,2] */
  RKADK_PARAM_TYPE_RECORD_TYPE,     /* specify RKADK_REC_TYPE_E */
  RKADK_PARAM_TYPE_RECORD_TIME,     /* specify RKADK_PARAM_REC_TIME_S, record time(s) */
  RKADK_PARAM_TYPE_PRE_RECORD_TIME, /* pre record time, unit in second(s) */
  RKADK_PARAM_TYPE_PRE_RECORD_MODE, /* pre record mode, specify MUXER_PRE_RECORD_MODE_E */
  RKADK_PARAM_TYPE_SPLITTIME,       /* specify RKADK_PARAM_REC_TIME_S, manual splite time(s)
*/
  RKADK_PARAM_TYPE_FILE_CNT,        /* record file count, maximum RECORD_FILE_NUM_MAX */
  RKADK_PARAM_TYPE_LAPSE_INTERVAL,  /* specify RKADK_PARAM_REC_TIME_S, lapse interval(s) */
  RKADK_PARAM_TYPE_LAPSE_MULTIPLE,  /* lapse multiple */
  RKADK_PARAM_TYPE_JPEG_SLICE,      /* enable/disable JPEG slice */
  RKADK_PARAM_TYPE_SLICE_HEIGHT,    /* set JPEG slice height */
  RKADK_PARAM_TYPE_INPUT_FMT,       /* set vi input format */
  RKADK_PARAM_TYPE_INPUT_BUFCNT,    /* set vi input buffer count */
  RKADK_PARAM_TYPE_ENABLE_AUDIO,    /* enable record audio */
  RKADK_PARAM_TYPE_MUTE,            /* mute specifies sensor, bool */

  /* COMM Dependent Param */
  RKADK_PARAM_TYPE_REC_MUTE,        /* record audio mute, bool */
  RKADK_PARAM_TYPE_VOLUME,          /* speaker volume, [0,100] */
  RKADK_PARAM_TYPE_MIC_VOLUME,      /* mic volume, [0,100] */
  RKADK_PARAM_TYPE_BUTT
} RKADK_PARAM_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_PARAM_TYPE_FPS | Framerate |
| RKADK_PARAM_TYPE_GOP | I-Frame-Intervall, RKADK_PARAM_GOP_S |
| RKADK_PARAM_TYPE_RES | Videoauflösung, RKADK_PARAM_RES_E |
| RKADK_PARAM_TYPE_PHOTO_RES | Fotoauflösung, RKADK_PARAM_RES_E |
| RKADK_PARAM_TYPE_STREAM_RES | Legt die Auflösung des durch RKADK_STREAM_TYPE_E angegebenen Streams fest |
| RKADK_PARAM_TYPE_CODEC_TYPE | Videokodierungstyp, RKADK_PARAM_CODEC_CFG_S |
| RKADK_PARAM_TYPE_BITRATE | Bitrate, RKADK_PARAM_BITRATE_S |
| RKADK_PARAM_TYPE_FLIP | Vertikal umklappen |
| RKADK_PARAM_TYPE_MIRROR | Horizontal spiegeln |
| RKADK_PARAM_TYPE_LDC | Verzeichnungskorrektur [0,255] |
| RKADK_PARAM_TYPE_ANTIFOG | Dunstentfernung [0,10] |
| RKADK_PARAM_TYPE_WDR | Großer Dynamikumfang [0,10] |
| RKADK_PARAM_TYPE_HDR | HDR-Bildgebung [0,10] |
| RKADK_PARAM_TYPE_RECORD_TYPE | Aufzeichnungstyp, RKADK_REC_TYPE_E |
| RKADK_PARAM_TYPE_RECORD_TIME | Aufzeichnungsdauer; Haupt- und Substream können unterschiedliche Dauern haben, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_PRE_RECORD_TIME | Voraufzeichnungsdauer |
| RKADK_PARAM_TYPE_PRE_RECORD_MODE | Voraufzeichnungsmodus: 0 - aus, 1 - bei manueller Aufteilung, 2 - erste Datei, 3 - alle Dateien |
| RKADK_PARAM_TYPE_SPLITTIME | Aufzeichnungsdauer bei manueller Aufteilung; Haupt- und Substream können unterschiedliche Dauern haben, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_FILE_CNT | Anzahl gleichzeitig aufgezeichneter Dateien, höchstens 2 |
| RKADK_PARAM_TYPE_LAPSE_INTERVAL | Zeitrafferaufzeichnungsdauer; Haupt- und Substream können unterschiedliche Dauern haben, RKADK_PARAM_REC_TIME_S |
| RKADK_PARAM_TYPE_LAPSE_MULTIPLE | Zeitverhältnis zwischen Wiedergabedauer der Zeitrafferdatei und tatsächlicher Dauer des aufgenommenen Inhalts |

| Membername | Beschreibung |
| --- | --- |
| RKADK_PARAM_TYPE_JPEG_SLICE | JPEG Slice aktivieren |
| RKADK_PARAM_TYPE_SLICE_HEIGHT | Höhe des JPEG-Slice-Segments |
| RKADK_PARAM_TYPE_INPUT_FMT | VI-Eingabeformat |
| RKADK_PARAM_TYPE_INPUT_BUFCNT | Anzahl der VI-Puffer |
| RKADK_PARAM_TYPE_ENABLE_AUDIO | Audioaufzeichnungskanal des angegebenen Sensors aktivieren |
| RKADK_PARAM_TYPE_MUTE | Aufzeichnung des angegebenen Sensors stummschalten |
| RKADK_PARAM_TYPE_REC_MUTE | Alle Aufzeichnungen stummschalten |
| RKADK_PARAM_TYPE_VOLUME | Lautsprecherlautstärke [0,100] |
| RKADK_PARAM_TYPE_MIC_VOLUME | Mikrofonlautstärke [0,100] |

**Hinweis**

Für kamerabezogene Hardwareeinstellungen wie Dunstentfernung, WDR und HDR reicht das Ändern der ini über RKADK_PARAM_SetCamParam nicht aus; zusätzlich die entsprechende ISP-Schnittstelle aufrufen, damit die Einstellung wirksam wird. RKADK_PARAM_TYPE_LAPSE_MULTIPLE: Das Verhältnis zwischen Wiedergabedauer und realer Dauer hängt von der Framerate ab. Bei normaler Aufnahme mit 30 fps und Zeitraffer mit 1 fps beträgt der Faktor beispielsweise 30. Beim Auflösungswechsel auf RV1126/RV1109 muss die Fotoauflösung der Auflösung des Record-Hauptstreams entsprechen, sofern nicht die maximale Sensorauflösung verwendet wird. RKADK_PARAM_TYPE_REC_MUTE zusammen mit RKADK_RECORD_GetAencChn und RK_MPI_AENC_SetMute verwenden.

**Verwandte Datentypen und Schnittstellen**

RKADK_PARAM_GetCamParam RKADK_PARAM_SetCamParam RKADK_PARAM_GetCommParam RKADK_PARAM_SetCommParam

#### 13.3.6 RKADK_PARAM_RES_E

**Beschreibung**

Definiert die Aufzählung der Wiedergabeereignisse.

**Definition**

```text
typedef enum {
  RKADK_RES_480P = 0, /* 848*480 */
  RKADK_RES_720P,     /* 1280*720 */
  RKADK_RES_1080P,    /* 1920*1080 */
  RKADK_RES_1296P,    /* 2304*1296 */
  RKADK_RES_1440P,    /* 2560*1440 */
  RKADK_RES_1520P,    /* 2688*1520 */
  RKADK_RES_1600P,    /* 2560*1600 */
  RKADK_RES_1620P,    /* 2880*1616, height 8 alignment */
  RKADK_RES_1944P,    /* 2592*1944 */
  RKADK_RES_2160P,    /* 3840*2160 */
  RKADK_RES_3456P,    /* 4608*3456 */
  RKADK_RES_4000P,    /* 6000*4000 */
  RKADK_RES_4480P,    /* 6720*4480 */
  RKADK_RES_4275P,    /* 7600*4275 */
  RKADK_RES_4320P,    /* 7680*4320 */
  RKADK_RES_3672P,    /* 6528*3672 */
  RKADK_RES_BUTT,
} RKADK_PARAM_RES_E;
```

**Verwandte Datentypen und Schnittstellen**

RKADK_PARAM_GetResolution RKADK_PARAM_GetResType

#### 13.3.7 RKADK_STREAM_TYPE_E

**Beschreibung**

Aufzählung der Streamtypen.

**Definition**

```text
typedef enum {
  RKADK_STREAM_TYPE_SENSOR,
  RKADK_STREAM_TYPE_VIDEO_MAIN,
  RKADK_STREAM_TYPE_VIDEO_SUB,
  RKADK_STREAM_TYPE_SNAP,
  RKADK_STREAM_TYPE_PREVIEW,
  RKADK_STREAM_TYPE_LIVE,
  RKADK_STREAM_TYPE_DISP,
  RKADK_STREAM_TYPE_BUTT
} RKADK_STREAM_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_STREAM_TYPE_VIDEO_MAIN | Video-Hauptstream |
| RKADK_STREAM_TYPE_VIDEO_SUB | Video-Substream |
| RKADK_STREAM_TYPE_SNAP | Fotoaufnahme |
| RKADK_STREAM_TYPE_PREVIEW | Remote-Vorschau |
| RKADK_STREAM_TYPE_LIVE | Liveübertragung |
| RKADK_STREAM_TYPE_DISP | Lokale Vorschau |
| RKADK_STREAM_TYPE_SENSOR | Sensor |

**Verwandte Datentypen und Schnittstellen**

RKADK_PARAM_GetVencChnId

#### 13.3.8 RKADK_PARAM_CODEC_CFG_S

**Beschreibung**

Konfigurationsstruktur des Kodierungstyps.

**Definition**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_CODEC_TYPE_E enCodecType;
} RKADK_PARAM_CODEC_CFG_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enStreamType | Streamtyp |
| enCodecType | Kodierungstyp |

**Verwandte Datentypen und Schnittstellen**

RKADK_CODEC_TYPE_E RKADK_STREAM_TYPE_E

#### 13.3.9 RKADK_PARAM_BITRATE_S

**Beschreibung**

Konfigurationsstruktur der Bitrate.

**Definition**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 u32Bitrate;
} RKADK_PARAM_BITRATE_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enStreamType | Streamtyp |
| u32Bitrate | Bitrate |

**Verwandte Datentypen und Schnittstellen**

RKADK_STREAM_TYPE_E

#### 13.3.10 RKADK_PARAM_REC_TIME_S

**Beschreibung**

Konfigurationsstruktur der Aufzeichnungsdauer.

**Definition**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 time;
} RKADK_PARAM_REC_TIME_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enStreamType | Streamtyp |
| time | Aufzeichnungsdauer |

**Verwandte Datentypen und Schnittstellen**

RKADK_STREAM_TYPE_E

#### 13.3.11 RKADK_PARAM_GOP_S

**Beschreibung**

Konfigurationsstruktur des VENC-I-Frame-Intervalls.

**Definition**

```text
typedef struct {
  RKADK_STREAM_TYPE_E enStreamType;
  RKADK_U32 u32Gop;
} RKADK_PARAM_GOP_S;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| enStreamType | Streamtyp |
| u32Gop | I-Frame-Intervall |

**Verwandte Datentypen und Schnittstellen**

RKADK_STREAM_TYPE_E

#### 13.3.12 RKADK_VQE_MODE_E

**Beschreibung**

Aufzählung der Klangverbesserungen für den Audioeingang

**Definition**

```text
typedef enum {
  RKADK_VQE_MODE_AI_TALK = 0,
  RKADK_VQE_MODE_AI_RECORD,
  RKADK_VQE_MODE_BUTT
} RKADK_VQE_MODE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_VQE_MODE_AI_TALK | AEC, ANR und AGC aktivieren |
| RKADK_VQE_MODE_AI_RECORD | ANR aktivieren |

#### 13.3.13 RKADK_MIC_TYPE_E

**Beschreibung**

Kanalmodus des Audiogeräts

**Definition**

```text
typedef enum {
  RKADK_MIC_TYPE_LEFT = 0,
  RKADK_MIC_TYPE_RIGHT,
  RKADK_MIC_TYPE_BOTH,
  RKADK_MIC_TYPE_BUTT
} RKADK_MIC_TYPE_E;
```

**Member**

| Membername | Beschreibung |
| --- | --- |
| RKADK_MIC_TYPE_LEFT | Ton des linken Kanals |
| RKADK_MIC_TYPE_RIGHT | Ton des rechten Kanals |
| RKADK_MIC_TYPE_BOTH | Dual-channel |

### 13.4 Einführung in INI-Dateien

#### 13.4.1 Globale INI-Konfigurationsdatei

```text
[version]
version                        = 2.2.0      /* Version */

/* common parameters */
[common]
sensor_count                   = 2          /* Number of Sensors*/
rec_mute                       = FALSE      /* Whether to enable video mute */
speaker_volume                 = 80         /* Speaker volume,[0,100] */
mic_volume                     = 80         /* Microphone volume,[0,100] */
vpss_devcie                    = 1          /* VPSS hardware device type, 0:GPU, 1:RGA */

/* Audio parameters */
[audio]
ai_audio_node                  = hw:0,0     /* AI device node */
ao_audio_node                  = hw:0,0     /* AO device node */
ai_depth                       = 1          /* AI depth */
bit_width                      = 1          /* Sampling accuracy */
channels                       = 1          /* Channels */
mic_type                       = 0          /* Audio device channel mode, specifically
RKADK_MIC_TYPE_E, 0: left channel, 1: right channel, 2: dual channel*/
samplerate                     = 16000      /* Sample rate   */
samples_per_frame              = 576        /* Number of samples per frame*/
bitrate                        = 64000      /* Bitrate */
vqe_mode                       = 1          /* Configure audio input sound quality
enhancement, specifically RKADK_VQE_MODE_E*/
vqe_config_path                = /oem/usr/share/vqefiles/config_aivqe.json /*vqe
configuration file path */
codec_type                     = 8          /* Record and Live Audio encoding types, adapted
to MP3 by default, specifically RKADK_CODEC_TYPE_E */
```

#### 13.4.2 INI-Konfigurationsdateien der Sensoren

```text
[sensor]
used_isp                       = TRUE       /* Has the Sensor used ISP? */
max_width                      = 2688       /* Max width */
max_height                     = 1520       /* Max height    */
framerate                      = 30         /* Framerate*/
flip                           = FALSE      /* Flip up and down*/
mirror                         = FALSE      /* Mirror left and right */
ldc                            = 0          /* Lens distortion correction, [0,255] */
wdr                            = 0          /* Wide dynamic range, [0,10] */
hdr                            = 0          /* High dynamic range imaging, [0,10] */
antifog                        = 0          /* Remove fog, [0,10] */
enable_wrap                    = FALSE      /* Whether the VI enables wrap */
wrap_buf_line                  = 1620       /* The line height of the wrap buffer */

/* VI channel configuration parameters */
[vi.0]
chn_id                         = 0                  /* Channel ID */
device_name                    = rkispp_m_bypass    /* Video node path*/
buf_cnt                        = 4                  /* The total number of buffer blocks in
the output channel */
depth                          = 0                  /* VI depth depth  */
width                          = 2688               /* Video width   */
height                         = 1520               /* Video height  */
pix_fmt                        = FBC0               /* VI output format*/
module                         = RECORD_MAIN|PHOTO  /* The usage module of this VI,Options:
NONE/RECORD_MAIN/RECORD_SUB/PREVIEW/PHOTO/LIVE/DISP */

[vi.1]
chn_id                         = 1
device_name                    = rkispp_scale0
buf_cnt                        = 4
depth                          = 0
width                          = 0
height                         = 0
pix_fmt                        = NV12
module                         = RECORD_MAIN|PHOTO

[vi.2]
chn_id                         = 2
device_name                    = rkispp_scale1
buf_cnt                        = 2
depth                          = 0
width                          = 0
height                         = 0
pix_fmt                        = NV12
module                         = NONE

[vi.3]
chn_id                         = 3
device_name                    = rkispp_scale2
buf_cnt                        = 4
depth                          = 0
width                          = 848
height                         = 480
pix_fmt                        = NV12
module                         = RECORD_SUB|PREVIEW|LIVE|DISP

/* Record parameters */
[record]
record_type                    = 0          /* Recording type, specifically
RKADK_REC_TYPE_E*/
file_type                      = 0          /* Video file type, specifically
RKADK_MUXER_FILE_TYPE_E */
pre_record_time                = 0          /* Pre-recording duration */
pre_record_mode                = 0          /* Pre-recorded mode */
lapse_multiple                 = 30         /* The multiple relationship between the
playback duration of a time-lapse video file and the actual screen content duration */
file_num                       = 1          /* Number of files recorded simultaneously,
maximum 2 */
switch_res                     = TRUE       /* Whether to switch resolution */
enable_audio                   = TRUE       /* Whether to enable recording */

/* Record 0 VENC parameters of Main stream  */
[record.0]
record_time                    = 60         /* Recording duration*/
splite_time                    = 60         /* Manually divide video duration */
lapse_interval                 = 60         /* Time-lapse recording duration */
width                          = 2688       /* Video width */
height                         = 1520       /* Video height */
bufsize                        = 10379776   /* The buffer size of the code stream */
framerate                      = 30         /* Venc framerate */
bitrate                        = 8294400    /* Bitrate */
gop                            = 30         /* I frame interval */
profile                        = 100        /* Encoder profile */
codec_type                     = 0          /* Encoding type, specificallyRKADK_CODEC_TYPE_E
*/
venc_chn                       = 0          /* VENC channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = CBR        /* Encoding protocol type, supports CBR, VBR,
AVBR*/
/* The following are advanced encoding parameters. If you need to adjust the encoder effect,
please add them according to your actual needs. For specific instructions, please refer to
the Rockit and MPP documents */
min_qp                         = 10
max_qp                         = 51
min_i_qp                       = 10
max_i_qp                       = 51
frame_min_i_qp                 = 25
frame_min_qp                   = 26
frame_max_i_qp                 = 45
frame_max_qp                   = 48
full_range                     = 1
scalinglist                    = 1
hier_qp_delta                  = -2,0,0,0
hier_frame_num                 = 3,0,0,0
enable_motion_deblur           = 1
motion_deblur_strength         = 0
enable_motion_static_switch    = 0
enable_debreath_effect         = 0
debreath_effect_strength       = 16
thrd_i                         = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
thrd_p                         = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
aq_step_i                      = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
aq_step_p                      = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
qbias_enable                   = 1
qbias_i                        = 171
qbias_p                        = 85
flt_str_i                      = 2
flt_str_p                      = 2
cu_dqp                         = 1
anti_ring                      = 3
anti_line                      = 3
lambda                         = 4
lambda_i                       = 7
atf_str                        = 2
tmvp_en                        = 0
static_frm_num                 = 5
madp16_th                      = 15
skip16_wgt                     = 6
skip32_wgt                     = 6
qbias_arr                     = 3,6,13,144,144,144,144,3,6,13,144,144,171,144,85,85,85,85
aq_rnge_arr                    = 8,8,12,12,12,8,8,12,12,12
lgt_chg_lvl                    = 0
sao_str_i                      = 0
sao_str_p                      = 0
speed                          = 1

/* VENC parameter of the substream Record 1, when file_num = 1, rec.1 does not need to be
configured*/
[record.1]
record_time                    = 60
splite_time                    = 60
lapse_interval                 = 60
width                          = 848
height                         = 480
bufsize                        = 2367488
bitrate                        = 407040
framerate                      = 30
gop                            = 30
profile                        = 100
codec_type                     = 0
venc_chn                       = 1
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = VBR

/* Photo VENC parameters */
[photo]
image_width                    = 3840       /* Image width */
image_height                   = 2160       /* Image_height  */
venc_chn                       = 2          /* VENC channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID*/
vpss_chn                       = 0          /* VPSS channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
enable_combo                   = FALSE      /* Enable the Combo attribute of the encoding
channel */
combo_venc_chn                 = 0          /* Combo data source channel */
qfactor                        = 50         /* For the detailed meaning, please refer to the
RFC2435 protocol. The system default value is 70 and the value range is [1, 99] */
switch_res                     = TRUE       /* Whether to switch resolution */
jpeg_slice                     = FALSE      /* Whether to enable JPEG Slice */
slice_height                   = 0          /* The height of JPEG Slice must not be greater
than max_slice_height*/
max_slice_width                = 0          /* Maximum width of JPEG Slice */
max_slice_height               = 0          /* Maximum height of JPEG Slice*/

/* Remote preview of VENC parameters */
[preview]
width                          = 848        /* Video width */
height                         = 480        /* Video height */
bufsize                        = 2367488
bitrate                        = 407040     /* Bitrate */
framerate                      = 30         /* Venc framerate  */
gop                            = 30         /* I frame interval */
profile                        = 100        /* Encoder profile */
codec_type                     = 0          /* Coding type, specifically RKADK_CODEC_TYPE_E
*/
venc_chn                       = 1          /* Venc channel ID */
vpss_grp                       = 0          /* VPSS GROUP ID */
vpss_chn                       = 0          /* VPSS  channel ID */
post_aiisp                     = FALSE      /* Whether to enbale Post AI ISP */
rc_mode                        = VBR        /* Encoding protocol type, supports CBR, VBR,
AVBR */

/* Live VENC parameters */
[live]
width                          = 1280
height                         = 720
bufsize                        = 2367488
bitrate                        = 4194304
framerate                      = 30
gop                            = 30
profile                        = 100
codec_type                     = 0
venc_chn                       = 1
vpss_grp                       = 0
vpss_chn                       = 0
post_aiisp                     = FALSE
rc_mode                        = VBR

/* Local preview parameters */
[display]
x                              = 0                /* Display X coordinate */
y                              = 0                /* Display y coordinate */
width                          = 720              /* Display the width  */
height                         = 1280             /* Display the height */
rotaion                        = 90               /* Degrees of rotation, Options: 0:0,
1:90, 2:180, 3:270 */
vpss_grp                       = 0                /* VPSS GROUP ID */
vpss_chn                       = 0                /* VPSS channel ID */
img_type                       = RGB888           /* Video output format */
vo_device                      = 0                /* Display output device number */
vo_layer                       = 0                /* Video output video layer number */
vo_chn                         = 0                /* VO channel ID */
frame_rate                     = 30               /* VO frame rate */
intf_type                      = default          /* Show interface type, Options:  MIPI,
HDMI, EDP, VGA, DP, HDMI_EDP, LCD, default*/
splice_mode                    = RGA              /* Splice mode, Options: RGA, GPU, BYPASS
*/
```

#### 13.4.3 Hinweise zur INI-Konfiguration

Den Standardpfad der INI-Dateien über eine Umgebungsvariable setzen, beispielsweise: export rkadk_default_ini_path=/oem/usr/etc. Der Pfad lässt sich auch über RKADK_PARAM_Init setzen. Die Versionen in rkadk_defsetting.ini und rkadk_setting.ini müssen übereinstimmen; andernfalls schlägt die Versionsprüfung fehl und die Standard-INI wird verwendet. Bei SDK-Updates kann sich der Parametersatz ändern. sensor_count bezeichnet die tatsächlich verwendete Sensoranzahl und darf RKADK_MAX_SENSOR_CNT nicht überschreiten; die Quelle berichtet von drei bereits erprobten Sensoren. Mit ISP used_isp=TRUE setzen: Skalierung über die Auflösung des ISP-Knotens, kein VPSS-Kanal nötig, vpss_grp und vpss_chn jeweils 0. Ohne ISP used_isp=FALSE und passende vpss_grp/vpss_chn einstellen; intern übernimmt VPSS die Skalierung. Bei gleicher Auflösung für Aufnahme, Remote-Vorschau und Liveübertragung VENC mit identischen Parametern gemeinsam nutzen, um Speicher und Speicherbandbreite zu sparen. Bei gemeinsam genutztem VENC oder gleicher VENC-Auflösung auch VPSS-Kanäle gemeinsam nutzen. gop sollte framerate entsprechen, damit jede Sekunde ein I-Frame entsteht.

## 14. Beispiele

Die folgenden Funktionsbeispiele setzen voraus, dass keine andere Anwendung wie mediaserver oder ispserver die benötigten Geräteknoten belegt. Die Standardparameter sind auf RK-EVBs abgestimmt. Bei anderer Hardware passende Befehlsparameter angeben oder den Code anpassen.

### 14.1 rkadk_record_test

**Beschreibung**

Aufzeichnungstest. Quellcode: rkadk/examples/rkadk_record_test.c. Schnellstart:

```text
./rkadk_record_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -m | Test mit zwei Sensoren: 0 - ISP-Sensor, 1 - alle ISP-Sensoren, 2 - ISP+AHD-Sensoren | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -k | Videodatei an I-Frames aufteilen | Nicht aufgeteilt |
| -P | Bild-in-Bild-Aufzeichnung aktivieren | Deaktiviert |
| -c | Anzahl der AVS-Puffer | 2 |
| -t | Verzögerung beim Abrufen des Vorschaubildes mit aktiviertem File Cache, ms | 3000ms |
| -e | EIS aktivieren | Deaktiviert |

### 14.2 rkadk_photo_test

**Beschreibung**

Fotoaufnahmetest. Quellcode: /rkadk/examples/rkadk_photo_test.c. Schnellstart:

```text
./rkadk_photo_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -t | Datentyp des erhaltenen JPG-Bildes | NV12 |
| -m | Test mit zwei Sensoren: 0 - ISP-Sensor, 1 - alle ISP-Sensoren, 2 - ISP+AHD-Sensoren | 0 |
| -o | OSD-Dateipfad | NULL |
| -W | OSD-Breite | 0 |
| -H | OSD-Höhe | 0 |

### 14.3 rkadk_stream_test

**Beschreibung**

Audiostream erfassen, kodieren und in eine Datei schreiben; Videostream erfassen, kodieren und in eine Datei schreiben. Quellcode: /rkadk/examples/rkadk_stream_test.c. Schnellstart:

```text
./rkadk_stream_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -M | Testmodus: audio, video | audio |
| -e | Kodierungstyp | pcm |
| -o | Ausgabedateipfad | /tmp/ai.pcm |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -m | Test mit zwei Sensoren: 0 - ISP-Sensor, 1 - alle ISP-Sensoren, 2 - ISP+AHD-Sensoren | 0 |

### 14.4 rkadk_player_test

**Beschreibung**

Test der lokalen Dateiwiedergabe. Quellcode: /rkadk/examples/rkadk_player_test.c. Schnellstart:

```text
./rkadk_player_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -i | Pfad der Wiedergabedatei | /etc/bsa_file/8k8bpsMono.wav |
| -x | X-Startkoordinate der Videoanzeige | 0 |
| -y | Y-Startkoordinate der Videoanzeige | 0 |
| -W | Breite der Videoanzeige | Physische Bildschirmbreite |
| -H | Höhe der Videoanzeige | Physische Bildschirmhöhe |
| -r | Videodrehwinkel: 0, 90, 180, 270 | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -m | Videospiegelung | Deaktiviert (disable) |
| -f | Vertikales Spiegeln des Videos | Deaktiviert (disable) |
| -a | Audiowiedergabe: 0 - aus, 1 - ein | 1 |
| -v | Videowiedergabe aktivieren | Deaktiviert (disable) |
| -s | Layer-Komposition: 0 - RGA, 1 - GPU, 2 - ByPass | 0 |
| -P | Bildschirmpixelformat: 0 - RGB888, 1 - NV12, 2 - RGB565 | 0 |
| -I | Displayschnittstelle: 0 - DEFAILT, 1 - MIPI, 2 - LCD | 1106: 0; andere Plattformen: 1 |
| -F | Bildwiederholrate | 30 |
| -t | RTSP-Übertragungsprotokoll: 0 - udp, 1 - tcp | 0 |
| -b | Schwarzes Bild nach der Wiedergabe aktivieren | Deaktiviert (disable) |
| -T | Timeout für RTSP-Socket-E/A in ms | Blockierend, ohne Timeout |
| -l | VO-Layer-ID | 0 |
| -O | Anzahl der VDEC-Ausgabepuffer | 3 [1, 8] |
| -D | Externe Demuxer-Bibliothek aktivieren | Deaktiviert (disable) |

**Hinweis**

Bei Videodateien ist -v zum Aktivieren der Videowiedergabe erforderlich. Spiegelung/vertikales Spiegeln lassen sich nicht gleichzeitig mit Drehung einstellen.

### 14.5 rkadk_thumb_test

Test zum Abrufen von Dateivorschaubildern. Quellcode: /rkadk/examples/rkadk_thumb_test.c. Schnellstart:

```text
Get MP4 thumbnail: ./rkadk_thumb_test -i test_file.mp4
Get JPG thumbnail: ./rkadk_thumb_test -i test_file.jpg -f jpg -t MPF1
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -i | Testdateipfad | Keine |
| -f | Dateiformat: mp4, jpg | mp4 |
| -t | JPG-Vorschaubildtypen: DCF, MPF1, MPF2 | DCF |
| -T | Ausgabevorschaubildtyp: JPG, NV12, RGB565, RGB888 | JPG |
| -W | Vorschaubildbreite | Aus ini übernehmen |
| -H | Vorschaubildhöhe | Aus ini übernehmen |

### 14.6 rkadk_rtsp_test

RTSP-Livetest. Quellcode: /rkadk/examples/rkadk_rtsp_test.c. Schnellstart:

```text
1. Start wifi on the board end
2. Run the board end./rkadk_rtsp_test
3. Open VLC on PC -> Media -> Open network streaming -> Enter the network URL: rtsp://board
end ip address/live/main_stream
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -o | OSD-Dateipfad | /userdata/rkadk_ARGB8888 |

### 14.7 rkadk_rtmp_test

RTMP-Livetest. Quellcode: /rkadk/examples/rkadk_rtmp_test.c. Schnellstart:

```text
1. Start wifi on the board
2. Run ./rkadk_rtmp_test on the board
3. Open VLC on the PC -> Media -> Open network streaming -> Enter the network URL:
rtmp://The ip address of the board::1935/live/substream
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |

### 14.8 rkadk_storage_test

**Beschreibung**

Test des Speichermoduls. Quellcode: /rkadk/examples/rkadk_storage_test.c. Schnellstart:

```text
./rkadk_storage_test
```

Optionen: keine

**Hinweis**

Der Test erzeugt eine mit Nullen gefüllte MP4-Datei zum Prüfen von automatischem Löschen, Dateilistenabruf und weiteren Schnittstellen. Die Datei enthält keine tatsächlichen Mediendaten und ist nicht abspielbar.

### 14.9 rkadk_disp_test

Test der lokalen Vorschau. Quellcode: /rkadk/examples/rkadk_disp_test.c. Schnellstart:

```text
./rkadk_disp_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |

### 14.10 rkadk_ui_test

Test der UI-Überlagerung. Quellcode: /rkadk/examples/rkadk_ui_test.c. Schnellstart:

```text
./rkadk_ui_test
```

Option

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -I | Kamera-ID | 0 |
| -p | Verzeichnispfad der INI-Konfiguration | /data/rkadk |
| -W | Breite des Anzeigebereichs | 720 |
| -H | Höhe des Anzeigebereichs | 1280 |
| -f | Bildschirmpixelformat: 0 - RGB888, 1 - NV12, 2 - RGB565, 3 - RGB444 | 0 |

### 14.11 rkadk_muxer_test

Muxer-Test. Quellcode: /rkadk/examples/rkadk_muxer_test.c. Schnellstart:

```text
./rkadk_muxer_test
```

Optionen

| Optionen | Beschreibung | Standard |
| --- | --- | --- |
| -a | Integrierte ISP-Funktion aktivieren. Ohne Argument gilt der Standardwert; das Argument ist der Pfad zum Ordner mit der aiq-Datei. | /etc/iqfiles |
| -W | Videobreite | 1920 |
| -H | Videohöhe | 1080 |
| -f | Framerate | 30 |
| -C | Codec-Typ: 0 - H264, 1 - H265 | H264 |
| -d | Audiogeräteknoten | hw:0,0 |
| -k | Aufteilung an Schlüsselframes | Deaktiviert |
| -c | Streamanzahl: 1 - Hauptstream, 2 - Haupt- und Substream | 1 |
| -t | Drittanbieter-Stream verarbeiten | Aktiviert |
| -A | Audio aktivieren | Aktiviert |
| -p | Voraufzeichnungsdauer, s | 0 |
| -I | Datei eines Drittanbieter-I-Frames | null |
| -P | Datei eines Drittanbieter-P-Frames | null |
| -n | Anzahl zu schreibender Streams | -1 |

{% endraw %}
