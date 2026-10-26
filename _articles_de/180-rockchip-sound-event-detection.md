---
title: "Rockchip SED: APIs für AED, Babyweinen, Alarme und Glasbruch"
description: "Rockchip SED: APIs für AED, Babyweinen, Alarme und Glasbruch — V1.6.0"
excerpt: "Rockchip SED: APIs für AED, Babyweinen, Alarme und Glasbruch"
translation_key: "180-rockchip-sound-event-detection"
slug: "180-rockchip-sound-event-detection"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio, SED, RKNN]
---

{% raw %}

Vollständiger chinesischer V1.6.0-Inhalt, Geltung alle Serien/allgemein. Nur ArmSoM-Plattformreferenz: SoC, SDK/BSP, Audioeingang, Bibliotheken und RKNN/NPU-Modelle prüfen. Keine Zusage für alle Boards. Kein englisches PDF; vollständige Übersetzungen. Quellenlatenzen sind keine ArmSoM-Messungen; keine Befehle ausgeführt.

> Widersprüche bleiben erhalten: 8bit char beschreibt vier Statuswerte als Bytes; SedBuzParam/RKAGCParam/RKSedEnable weichen von späteren Typen ab; EN_BCD unterscheidet sich vom Enum EN_SED. Empfohlenes frm_len90 widerspricht buzzer_decision_len100, das kleiner sein soll; Header prüfen und gemeinsam konfigurieren. dB=20*log10(X) nennt keine Referenzamplitude, obwohl32767 als0dB gilt; Normierung prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Überblick

Diese Anleitung beschreibt Sound Event Detection: Baby Cry Detection, Abnormal Event Detection und Buzz Detection. Die drei Module teilen eine Schnittstelle, arbeiten aber unabhängig und sind einzeln schaltbar.

## 2. Funktionen

### 2.1 Abnormal Event Detection(AED)

AED erkennt auffällige Geräusche in Echtzeit: Lautstärke und SNR, mit 8k-/16k-Eingang. Oberhalb der dB-Lautstärkeschwelle wird 1 ausgegeben, sonst 0. SNR trennt das Signal von stationärem Umgebungs- und Aufnahmerauschen; oberhalb der Schwelle 1, sonst 0. Dezibel messen das Verhältnis gleichdimensionierter Größen; Amplitude ist der Absolutwert der Audiodaten. Originalformel:

`dB = 20 * log10(X)`

Amplitudenverhältnisse entsprechen dB-Addition/Subtraktion: Verdopplung ergibt 6dB. Die 16bit-Vollaussteuerung 32767 wird als 0dB definiert; Werte liegen daher unter 0dB. SNR ist das Signal/Rausch-Verhältnis: Bei Rauschen 0dB und Signal 6dB darüber beträgt es 6dB.

### 2.2 KI-KlangereigniserkennungSound Event Detection(SED)

SED erkennt Babyweinen, Summeralarme und Glasbruch in Echtzeit, nur mit 16k-Eingang. Ein RCNN mit Multi-Head-Attention analysiert etwa 1.5s Audio. Laut Quelle bessere Ergebnisse bei SNR über 6dB.

#### 2.2.1 Baby Cry Detection(BCD)

BCD erkennt Babyweinen per Deep Learning in Echtzeit. Hoher SNR verbessert das Ergebnis; etwa 2s Latenz ab Beginn.

#### 2.2.2 Buzz Detection(BUZ)

BUZ erkennt übliche Rauch-, Luftschutz- und Einbruchalarme per Deep Learning. Höherer SNR verbessert die Ergebnisse; etwa 2s Latenz ab Alarmbeginn.

#### 2.2.3 Glass broken Detection(GBS)

GBS erkennt Glasbruch per Deep Learning in Echtzeit. Höherer SNR verbessert die Ergebnisse; etwa 0.6s Latenz ab Beginn.

## 3. APIs

APIs: rkaudio_sed_init initialisiert SED; rkaudio_sed_destroy zerstört es; rkaudio_sed_process führt Erkennung aus; rkaudio_sed_init_res liefert Initialisierungsergebnisse.

### 3.1 rkaudio_sed_init

Beschreibung: SED-Handle für rkaudio_sed_process initialisieren und zurückgeben. Nach Gebrauch mit rkaudio_sed_destroy zerstören. Syntax: void *rkaudio_sed_init(int fs, int bit, int chan, RKAudioSedParam *param). Parameter:

| Parameter | Beschreibung | Ein-/Ausgabe |
| --- | --- | --- |
| fs | Abtastrate: AED 8k/16k; BCD, BUZ, GBS nur16k. | Eingang |
| bit | Bits je Abtastwert, normalerweise16bit. | Eingang |
| chan | Kanalzahl; bei Mehrkanaleingang wird nur der erste verwendet. | Eingang |
| param | SED-Parameter, siehe RKAudioSedParam. Mit rkaudio_sed_param_init oder eigenen Funktionen/Initialwerten erzeugen. | Eingang |

Rückgabewert:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| NULL | Fehler. |
| non-NULL | Erfolg. |

### 3.2 rkaudio_sed_destroy

Beschreibung: SED-Handle zerstören. Syntax: void rkaudio_sed_destroy(void *st_). Parameter:

| Parameter | Beschreibung | Ein-/Ausgabe |
| --- | --- | --- |
| st_ | Von rkaudio_sed_init gelieferter Handle. | Eingang |

Kein Rückgabewert.

### 3.3 rkaudio_sed_init_res

Beschreibung: Initialisierungsergebnis des SED-Handles ausgeben. Syntax: char rkaudio_sed_init_res(void* st_). Parameter:

| Parameter | Beschreibung | Ein-/Ausgabe |
| --- | --- | --- |
| st_ | Von rkaudio_sed_init gelieferter Handle. | Eingang |

Liefert einen 8bit char. Vom niederwertigen Ende bezeichnet das Original das erste Feld als Byte für agc, das zweite für aed, dritte für sed und vierte für fir; 1 bedeutet Erfolg, 0 Fehler. Die Byte-Bezeichnung widerspricht dem 8bit-Rückgabetyp und muss im SDK geprüft werden.

### 3.4 rkaudio_sed_process

Beschreibung: Klangereignisse erkennen, Ergebnisse in res speichern. Syntax: int rkaudio_sed_process(void *st_, short *in, int in_size, RKAudioSedRes *res). Parameter:

| Parameter | Beschreibung | Ein-/Ausgabe |
| --- | --- | --- |
| st_ | Von rkaudio_sed_init gelieferter Handle. | Eingang |
| in | Eingangsdatenzeiger. | Eingang |
| in_size | Eingangslänge: Vielfaches von128 bei8k, von256 bei16k. | Eingang |
| res | Extern reservierter Ergebnisstrukturzeiger; siehe RKAudioSedRes. | Ausgang |

Rückgabewert:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| &gt;=0 | Erfolg; verarbeitete Datenlänge. |
| &lt;0 | Fehler. |

### 3.5 rkaudio_sed_param_init

SED-Parameter initialisieren, Untermodule aktivieren und deren Parameterinitialisierung aufrufen. Quellcode und Standardwerte sind offen und an Daten anpassbar. Nach Gebrauch rkaudio_sed_param_destroy aufrufen. Parameter-/Moduländerungen erfordern Zerstören und Neuinitialisieren von SED. Syntax: RKAudioSedParam *rkaudio_sed_param_init(). Liefert den Parameterzeiger; siehe RKAudioSedParam.

### 3.6 rkaudio_sed_param_destroy

SED-Parameter zerstören. Syntax: void rkaudio_sed_param_destroy(RKAudioSedParam *param). Parameter: SED-Parameterzeiger.

### 3.7 rkaudio_sed_param_aed

AED-Parameter initialisieren, von rkaudio_sed_param_init aufgerufen und durch rkaudio_sed_param_destroy zerstört. Syntax: SedAedParam *rkaudio_sed_param_aed(). Liefert den AED-Parameterzeiger.

### 3.8 rkaudio_sed_param

BCD/BUZ/GBS-Parameter initialisieren, von rkaudio_sed_param_init aufgerufen und durch rkaudio_sed_param_destroy zerstört. Originalsyntax: SedBuzParam *rkaudio_sed_param(). Originalrückgabe: BUZ-Parameterzeiger.

### 3.9 rkaudio_agc_param_init

AGC-Parameter in rkaudio_sed_param_init initialisieren; Zerstörung durch rkaudio_sed_param_destroy. Syntax: RKAGCParam* rkaudio_agc_param_init().

Liefert den AGC-Parameterzeiger.

### 3.10 rkaudio_sed_lsd_db

AED-Lautstärke in dB zurückgeben. Syntax: float rkaudio_sed_lsd_db(void *st_). Rückgabe: dbfs-Wert.

### 3.11 rkaudio_sed_bcd_model_set

RKNN-Modellpfad für Babyweinen setzen. Syntax: int rkaudio_sed_bcd_model_set(char *model_path). 0 bei Erfolg, -1 bei Fehler.

## 4. Parameter

### 4.1 JUMP_FRAME

SED-Erkennungsintervall in Frames. Größere Werte senken Erkennungsfrequenz und Rechenlast. Bei 20 Frames beträgt das Intervall

0.016*20 = 0.32s, ungefähr drei Erkennungen je Sekunde. Empfohlen: 15-25. Übersprungene Frames behalten das vorherige Ergebnis. Definition:

```text
#define JUMP_FRAME 20
```

### 4.2 RKAudioSedParam

SED-Algorithmusparameter. Definition:

```text
typedef struct RKAudioSedParam_
{
    int model_en;
    RKSEDAGCParam *agc_param;
    SedAedParam   *aed_param;
    SedParam      *sed_param;
    RKFIRParam    *fir_param;
} RKAudioSedParam;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| model_en | Untermodule per Bits aktivieren; siehe RKSedEnable. Für AED+BCD: EN_AED &#124; EN_BCD (Originalnamen). |
| SedAedParam | Modulparameter; siehe SedAedParam. |
| SedParam | Modulparameter; siehe SedParam. |
| RKSEDAGCParam | Modulparameter; siehe RKSEDAGCParam. |
| RKFIRParam | Modulparameter; siehe RKFIRParam. |

### 4.3 SedAedParam

AED-Algorithmusparameter. Definition:

```text
typedef struct SedAedParam_
{
    float    snr_db;
    float    lsd_db;
    int      policy;
    float    smooth_param;
} SedAedParam;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| snr_db | Sprach-SNR-Schwelle; darüber1. |
| lsd_db | Lautstärkeschwelle; darüber1. Maximum0dB. |
| policy | SNR-Empfindlichkeit [0,2], Standard1. Höher ist empfindlicher und erreicht die Schwelle leichter. |
| smooth_param | Lautstärkeglättung (0,1); höher bedeutet größeres Fenster. |

### 4.4 SedParam

BCD/BUZ/GBS-Parameter. Definition:

```text
typedef struct SedParam_
{
    int      frm_len;
    int      nclass;
    int      babycry_decision_len;
    int      buzzer_decision_len;
    int      glassbreaking_decision_len;
    float    babycry_confirm_prob;
    float    buzzer_confirm_prob;
    float    glassbreaking_confirm_prob;
} SedParam;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| frm_len | Gesamtzahl statistischer Frames [60,120], empfohlen90. Länger erhöht Latenz; kürzer erhöht Fehl-/Nichterkennungen. |
| nclass | Zahl aktivierter SED-Klassen; nur Babyweinen:1. |
| babycry_decision_len | Bestätigungsframes für Weinen, unter frm_len, [40,80], empfohlen60. Länger erhöht Latenz/Nichterkennung; kürzer Fehlalarme. |
| buzzer_decision_len | Summer-Bestätigungsframes, unter frm_len, empfohlen100. Länger erhöht Latenz/Nichterkennung; kürzer Fehlalarme. |
| glassbreaking_decision_len | Glasbruch-Bestätigungsframes, unter frm_len und über JUMP_FRAME, empfohlen25-50. Länger erhöht Latenz/Nichterkennung; kürzer Fehlalarme. |
| babycry_confirm_prob | Bestätigungswahrscheinlichkeit [0.75,0.95], empfohlen0.85. Höher senkt Fehlalarme, erhöht Nichterkennungen. |
| buzzer_confirm_prob | Bestätigungswahrscheinlichkeit (0,1), empfohlen0.5. Höher senkt Fehlalarme, erhöht Nichterkennungen. |
| glassbreaking_confirm_prob | Bestätigungswahrscheinlichkeit (0,1), empfohlen0.8. Höher senkt Fehlalarme, erhöht Nichterkennungen. |

### 4.5 RKAudioSedRes

SED-Ergebnisstruktur. Definition:

```text
typedef struct RKAudioSedRes_
{
    int snr_res;
    int lsd_res;
    int bcd_res;
    int buz_res;
    int gbs_res;
} RKAudioSedRes;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| snr_res | Ergebnis SNR threshold: 1 erkannt/Schwelle erfüllt, 0 nicht. |
| lsd_res | Ergebnis loud-sound threshold: 1 erkannt/Schwelle erfüllt, 0 nicht. |
| bcd_res | Ergebnis baby crying: 1 erkannt/Schwelle erfüllt, 0 nicht. |
| buz_res | Ergebnis alarm: 1 erkannt/Schwelle erfüllt, 0 nicht. |
| gbs_res | Ergebnis glass breaking: 1 erkannt/Schwelle erfüllt, 0 nicht. |

### 4.6 RKAudioSedEnable

model_en zuweisen, um das Modul einzuschalten. Mehrere Flags kombinieren, z. B. EN_AED &#124; EN_BCD gemäß Original. Definition:

```text
typedef enum RKAudioSedEnable_
{
    EN_AGC = 1 << 0,
    EN_AED = 1 << 1,
    EN_SED = 1 << 2,
    EN_FIR = 1 << 3,
} RKAudioSedEnable;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| EN_AGC | AGC aktivieren. Bei niedriger Eingangslautstärke empfohlen. |
| EN_AED | AED aktivieren. |
| EN_SED | SED aktivieren. |
| EN_FIR | FIR aktivieren. |

### 4.7 RKSEDAGCParam

AGC-Parameter; Änderungen nicht empfohlen. Definition:

```text
typedef struct RKSEDAGCParam_
{
    float    attack_time;
    float    release_time;
    float    max_gain;
    float    max_peak;
    float    fRth0;
    float    fRk0;
    float    fRth1;
    int      fs;
    int      frmlen;
    float    attenuate_time;
    float    fRth2;
    float    fRk1;
    float    fRk2;
    float    fLineGainDb;
    int      swSmL0;
    int      swSmL1;
    int      swSmL2;
} RKSEDAGCParam;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| attack_time | Zeit zum Absenken der AGC-Verstärkung. |
| release_time | Zeit zum Erhöhen der AGC-Verstärkung. |
| max_gain | Maximale und lineare Verstärkung, dB. |
| max_peak | Maximale Sprachenergie nach AGC, dB; Bereich im Original nicht angegeben. |
| fRth0 | Energieschwelle Expansionsende/Linearbeginn, dB. |
| fRk0 | Expansionssteigung (ungenutzt). |
| fRth1 | Energieschwelle Kompressionsbeginn/Linearende, dB. |
| fs | Abtastrate (ungenutzt). |
| frmlen | Verarbeitungsframelänge (ungenutzt). |
| attenuate_time | Rauschabsenkzeit bis Verstärkung1 (ungenutzt). |
| fRth2 | Energieschwelle Kompressionsbeginn, dB. |
| fRk1 | Expansionssteigung (ungenutzt). |
| fRk2 | Expansionssteigung (ungenutzt). |
| fLineGainDb | Verstärkungserhöhung im linearen Bereich, dB (ungenutzt). |
| swSmL0 | Zeitbereichs-Glättungspunkte Expansion (ungenutzt). |
| swSmL1 | Zeitbereichs-Glättungspunkte linearer Bereich (ungenutzt). |
| swSmL2 | Zeitbereichs-Glättungspunkte Kompression (ungenutzt). |

### 4.8 RKFIRParam

FIR-Parameter; Änderungen nicht empfohlen. Definition:

```text
typedef struct RKFIRParam_
{
    int fir_len;
    float* fir_coeffs;
} RKFIRParam;
```

Felder:

| Feld / Rückgabewert | Beschreibung |
| --- | --- |
| fir_len | FIR-Länge. |
| fir_coeffs | FIR-Koeffizienten. |

{% endraw %}
