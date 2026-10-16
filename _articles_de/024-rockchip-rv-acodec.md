---
title: "Rockchip RV-ACodec: Vollständiger Leitfaden für Konfiguration, Aufnahme und Wiedergabe"
description: "Vollständige RV-ACodec-Referenz: Device Tree, Verstärkungsregler, digitales Loopback und Rockit-Testbefehle für RV1106/RV1103, B-Varianten und RV1126B/RV1126BP."
translation_key: "024-rockchip-rv-acodec"
slug: "024-rockchip-rv-acodec"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "media"
products: []
tags: ["RV1106", "RV1103", "RV1106B", "RV1103B", "RV1126B", "RV1126BP", "ACodec", "Rockit"]
keywords: "Rockchip RV-ACodec: Vollständiger Leitfaden für Konfiguration, Aufnahme und Wiedergabe, Linux, Rockchip, audio, ALSA, ASoC"
excerpt: "Vollständige RV-ACodec-Referenz: Device Tree, Verstärkungsregler, digitales Loopback und Rockit-Testbefehle für RV1106/RV1103, B-Varianten und RV1126B/RV1126BP."
---

{% raw %}
# Rockchip RV-ACodec: Vollständiger Leitfaden für Konfiguration, Aufnahme und Wiedergabe

<style>.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:24px auto}.article-content table{font-size:14px}.article-content th{min-width:90px}</style>

Dieser Artikel ist eine Rockchip-RV-Audioreferenz in der technischen ArmSoM-Bibliothek. Er behandelt den internen ACodec von RV1106/RV1103, RV1106B/RV1103B und RV1126B/RV1126BP. Die ersten beiden Gruppen verwenden den dokumentierten Kernelstand 5.10, RV1126B/RV1126BP verwendet 6.1. DTS-, GPIO- und Mixer-Einstellungen dürfen nicht auf Sige7 / AIM7 (RK3588) oder Sige5 / CM5 / AIM5 (RK3576) übertragen werden. Ein passendes ArmSoM-RV-Board wurde hier nicht geprüft. Verwenden Sie für ein eigenes RV-Design dessen genauen SoC, SDK, Schaltplan und erkannte Soundkarte. Spezifikationen und Testbeispiele stammen aus der Quelle.

Quelle: Rockchip_Developer_Guide_Linux_RV_Series_ACodec_EN.pdf, V1.6.0. Die technischen Kapitel bleiben erhalten; Deckblatterklärungen, Zielgruppenabschnitt und Versionshistorie wurden weggelassen. Korrekturen und offene Fragen stehen in den [redaktionellen Hinweisen](/docs/rockchip-rv-acodec/EDITORIAL-NOTES.md).

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://docs.armsom.org/armsom-sige7) · [Sige5](https://docs.armsom.org/armsom-sige5) · [CM5](https://docs.armsom.org/armsom-cm5)

<!-- source-page: 4; block: en-0000 -->

## 1. Überblick

<!-- source-page: 4; block: en-0001 -->

### 1.1 Funktionen

<!-- source-page: 4; block: en-0002 -->

Der hier beschriebene ACodec ist das in RV1106/RV1103/RV1106B/RV1103B integrierte Audio-IP-Modul. Er kann ein externes analoges Mikrofon anschließen und dessen Aufnahmesignal durch Analog-Digital-Wandlung an die CPU übertragen. Ebenso lassen sich lokale digitale PCM-Audiosignale durch Digital-Analog-Wandlung zur Wiedergabe ausgeben.

<!-- source-page: 4; block: en-0003 -->

RV1106 und RV1103 besitzen dieselbe ACodec-IP mit 2 ADCs und 1 DAC. Die 2024 eingeführten RV1106B/RV1103B verwenden untereinander ebenfalls dieselbe ACodec-IP. Gegenüber RV1106/RV1103 entfällt ein ADC; verfügbar sind 1 ADC und 1 DAC. Beim Betrieb begegnet Ihnen häufig die Konfiguration des Rückhol- beziehungsweise Referenzkanals, die später ausführlich erläutert wird.

<!-- source-page: 4; block: en-0004 -->

Die 2025 eingeführten RV1126B/RV1126BP unterstützen zwei stromsparende, leistungsfähige ADCs und eignen sich damit für Sprachaufnahmen mit einem oder zwei Mikrofonen. ADC0 unterstützt AOA (Always On Audio) für kontinuierliche Aufnahme mit sehr geringer Leistungsaufnahme und Aufwecken aus dem Schlafmodus. Einzelheiten stehen im AOA-Abschnitt der SDK-Dokumentation „Rockchip Developer Guide Linux AOV CN.pdf“ beziehungsweise „Rockchip Developer Guide Linux AOV EN.pdf“.

<!-- source-page: 4; block: en-0005 -->

## 2. ACodec im Überblick

<!-- source-page: 4; block: en-0006 -->

### 2.1 ACodec-Eigenschaften

<!-- source-page: 4; block: en-0007 -->

Grundlegende Eigenschaften des ACodec in RV1106/RV1103/RV1106B/RV1103B:

<!-- source-page: 4; block: en-0008 -->

24-Bit-DAC mit 93dB Signal-Rausch-Abstand (A-bewertet)

<!-- source-page: 4; block: en-0009 -->

Unterstützt 600Ω-Line-Ausgang

<!-- source-page: 4; block: en-0010 -->

Geringe Stromaufnahme: 2.5mA bei Wiedergabe

<!-- source-page: 4; block: en-0011 -->

24-Bit-ADC mit 92dB Signal-Rausch-Abstand (A-bewertet)

<!-- source-page: 4; block: en-0012 -->

Unterstützt differenziellen und unsymmetrischen Mikrofon- oder Line-Eingang

<!-- source-page: 4; block: en-0013 -->

Geringe Stromaufnahme: 5mA bei Stereoaufnahme

<!-- source-page: 4; block: en-0014 -->

Automatische Pegelregelung (ALC) für gleichmäßige Audioaufnahmen

<!-- source-page: 4; block: en-0015 -->

Geringe Stromaufnahme: weniger als 0.05mA im Standby

<!-- source-page: 4; block: en-0016 -->

Programmierbare analoge Ein- und Ausgangsverstärkung

<!-- source-page: 4; block: en-0017 -->

Integrierte digitale Interpolations- und Dezimationsfilter

<!-- source-page: 4; block: en-0018 -->

Abtastraten von 8kHz/12kHz/16kHz/24kHz/32kHz/44.1KHz/48KHz/96KHz

<!-- source-page: 5; block: en-0019 -->

1.8V Analogversorgung und 0.9V Digitalversorgung

<!-- source-page: 5; block: en-0020 -->

Grundlegende Eigenschaften des ACodec in RV1126B/RV1126BP:

<!-- source-page: 5; block: en-0021 -->

Unterstützt eine APB-Bus-Slave-Schnittstelle

<!-- source-page: 5; block: en-0022 -->

Analoge Verstärkung zwischen 0~48dB in Schritten von 3dB

<!-- source-page: 5; block: en-0023 -->

Unterstützt 96dB Signal-Rausch-Abstand

<!-- source-page: 5; block: en-0024 -->

Unterstützt einen ADC-Kanal im differenziellen, unsymmetrischen oder pseudodifferenziellen Modus

<!-- source-page: 5; block: en-0025 -->

Unterstützt I2S-/PCM-Master- und -Slave-Modus

<!-- source-page: 5; block: en-0026 -->

Unterstützt serielle Audiodatenübertragung im normalen I2S-, links- und rechtsbündigen Modus

<!-- source-page: 5; block: en-0027 -->

Unterstützt serielle Audiodatenübertragung in PCM early, late1, late2 und late3

<!-- source-page: 5; block: en-0028 -->

Unterstützt serielle Übertragung mit MSB oder LSB zuerst

<!-- source-page: 5; block: en-0029 -->

Unterstützt 16~32bit Abtastauflösung

<!-- source-page: 5; block: en-0030 -->

Unterstützte Abtastraten: 8kHz, 16kHz, 32kHz, 64kHz, 128kHz, 11.025kHz, 22.05kHz, 44.1kHz, 88.2kHz, 176.4kHz, 12kHz, 24kHz, 48kHz, 96kHz, 192kHz

<!-- source-page: 5; block: en-0031 -->

Durchlassband der Filter: 0.45625 * FS

<!-- source-page: 5; block: en-0032 -->

Durchlassbandwelligkeit innerhalb von +/-0.1dB

<!-- source-page: 5; block: en-0033 -->

Sperrband der Filter: 0.5 * FS

<!-- source-page: 5; block: en-0034 -->

Sperrbanddämpfung von mindestens 60dB

<!-- source-page: 5; block: en-0035 -->

Unterstützt digitale Lautstärkeregelung des Audio-ADC

<!-- source-page: 5; block: en-0036 -->

Unterstützt programmierbare negative und positive Lautstärkeverstärkung

<!-- source-page: 6; block: en-0037 -->

### 2.2 ACodec-Blockdiagramm

<!-- source-page: 6; block: en-0038 -->

![Technische Originalabbildung: 2.2 ACodec-Blockdiagramm (S. 6)](/docs/rockchip-rv-acodec/assets/en-p006-fig01.png)

<!-- source-page: 6; block: en-0039 -->

ACodec-Blockdiagramm für RV1106/RV1103

<!-- source-page: 6; block: en-0040 -->

Das Blockdiagramm zeigt 2 ADC-Eingänge zur Aufnahme und 1 DAC-Ausgang zur Wiedergabe für RV1106 und RV1103. Im differenziellen Modus unterstützt RV1106 höchstens 2 Mikrofone, RV1103 dagegen nur 1 Mikrofon. Im unsymmetrischen Modus unterstützen beide höchstens 2 Mikrofone.

<!-- source-page: 7; block: en-0041 -->

![Technische Originalabbildung: 2.2 ACodec-Blockdiagramm (S. 7)](/docs/rockchip-rv-acodec/assets/en-p007-fig01.png)

<!-- source-page: 7; block: en-0042 -->

ACodec-Blockdiagramm für RV1106B/RV1103B

<!-- source-page: 7; block: en-0043 -->

Beim ACodec von RV1106B/RV1103B entfällt ein ADC. Er unterstützt einen ADC-Eingang zur Aufnahme und einen DAC-Ausgang zur Wiedergabe. Der ADC-Eingang behält differenzielle und unsymmetrische Anschlussmöglichkeiten bei.

<!-- source-page: 7; block: en-0044 -->

RV1126B/RV1126BP unterstützen standardmäßig zwei stromsparende, leistungsfähige ADCs, die beide standardmäßig differenzielle Eingänge verwenden. Das Blockdiagramm lautet:

<!-- source-page: 8; block: en-0045 -->

![Technische Originalabbildung: 2.2 ACodec-Blockdiagramm (S. 8)](/docs/rockchip-rv-acodec/assets/en-p008-fig01.png)

<!-- source-page: 8; block: en-0046 -->

ACodec-Blockdiagramm für RV1126B/RV1126BP

<!-- source-page: 8; block: en-0047 -->

Je nach SoC-ID bestehen daher folgende wesentliche Unterschiede beim Mikrofonanschluss:

<!-- source-page: 8; block: en-0048 -->

| SoC ID | Maximale Mikrofonanzahl im unsymmetrischen Modus | Maximale Mikrofonanzahl im differenziellen Modus |
| --- | --- | --- |
| RV1106 | 2 | 2 |
| RV1103 | 2 | 1 |
| RV1106B/RV1103B | 1 | 1 |
| RV1126B/RV1126BP | 2 | 2 |

<!-- source-page: 8; block: en-0049 -->

Typische Mikrofonanschlüsse finden Sie in den RK-EVB-Schaltplänen und dem Hardware-Design-Referenzleitfaden.

<!-- source-page: 8; block: en-0050 -->

## 3. ACodec-Softwarekonfiguration

<!-- source-page: 8; block: en-0051 -->

### 3.1 ACodec-Kernelkonfiguration für RV1106/RV1103

<!-- source-page: 8; block: en-0052 -->

Am Beispiel des Rockchip-SDK-Codes für kernel-5.10 dient folgende dtsi-Datei als Referenz:

<!-- source-page: 8; block: en-0053 -->

```text
arch/arm/boot/dts/rv1106-evb-v10.dtsi
```

<!-- source-page: 9; block: en-0054 -->

Definieren Sie zunächst einen acodec_sound-Knoten. Er beschreibt grundlegende Soundkarteninformationen und referenziert das controllerseitige DAI (Digital Audio Interface) i2s0_8ch sowie das peripherieseitige DAI acodec:

<!-- source-page: 9; block: en-0055 -->

```text
    acodec_sound: acodec-sound {
        compatible = "simple-audio-card";
        simple-audio-card,name = "rv1106-acodec";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
            sound-dai = <&i2s0_8ch>;
        };
        simple-audio-card,codec {
            sound-dai = <&acodec>;
        };
    };
```

<!-- source-page: 9; block: en-0056 -->

I2S0 aktivieren:

<!-- source-page: 9; block: en-0057 -->

```text
&i2s0_8ch {
    #sound-dai-cells = <0>;
    status = "okay";
};
```

<!-- source-page: 9; block: en-0058 -->

ACodec aktivieren und den GPIO-Pin zur Steuerung des externen Leistungsverstärkers definieren:

<!-- source-page: 9; block: en-0059 -->

```text
&acodec {
    #sound-dai-cells = <0>;
    pa-ctl-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- source-page: 9; block: en-0060 -->

Im obigen Beispiel kann der interne I2S0 von RV1106/RV1103 mit ACodec verbunden werden.

<!-- source-page: 9; block: en-0061 -->

RV1106/RV1103 besitzen nur einen I2S-Controller, I2S0. Wird der interne ACodec aktiviert, belegt er I2S0 und ist über interne SoC-Leitungen verbunden. Die externen I2S0-IO-Pins stehen in diesem Fall nicht zur Verfügung.

<!-- source-page: 9; block: en-0062 -->

### 3.2 ACodec-Kernelkonfiguration für RV1106B/RV1103B

<!-- source-page: 9; block: en-0063 -->

Die Konfiguration des ACodec für RV1106B/RV1103B orientiert sich an:

<!-- source-page: 9; block: en-0064 -->

```text
arch/arm/boot/dts/rv1103b-evb.dtsi
    acodec_sound: acodec-sound {
        compatible = "simple-audio-card";
        simple-audio-card,name = "rv1103b-acodec";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
            sound-dai = <&sai>;
        };
        simple-audio-card,codec {
            sound-dai = <&acodec>;
        };
    };
```

<!-- source-page: 10; block: en-0066 -->

Der digitale Audiocontroller von RV1106B/RV1103B wurde von I2S auf SAI umgestellt und muss aktiviert werden:

<!-- source-page: 10; block: en-0067 -->

```text
&sai {
    status = "okay";
};
```

<!-- source-page: 10; block: en-0068 -->

Aktivieren Sie außerdem den acodec-Knoten:

<!-- source-page: 10; block: en-0069 -->

```text
&acodec {
    pa-ctl-gpios = <&gpio0 RK_PA3 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- source-page: 10; block: en-0070 -->

### 3.3 ACodec-Konfiguration im Userspace für RV1106/RV1103

<!-- source-page: 10; block: en-0071 -->

Üblicherweise lassen sich die vom Codec im Userspace bereitgestellten Steuerelemente mit tinymix abfragen und einstellen. Da tinymix im SDK entfällt, integriert Rockit das gleichwertige Werkzeug rk_mpi_amix_test. Damit lassen sich sämtliche Inhalte auflisten:

<!-- source-page: 10; block: en-0072 -->

```text
# rk_mpi_amix_test --list_contents
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
Number of controls: 26
ctl     type    num     name                                    value
0       ENUM    1       I2STDM Digital Loopback Mode            , DisabledMode1Mode2Mode2 Swap
1       INT     1       ADC MIC Left Gain                       2 (range 0->3)
2       INT     1       ADC MIC Right Gain                      2 (range 0->3)
3       INT     1       ADC ALC Left Volume                     6 (range 0->31)
4       INT     1       ADC ALC Right Volume                    6 (range 0->31)
5       INT     1       ADC Digital Left Volume                 195 (range 0->255)
6       INT     1       ADC Digital Right Volume                195 (range 0->255)
7       ENUM    1       ADC HPF Cut-off                         , OffOn
8       INT     1       ALC AGC Left Volume                     12 (range 0->31)
9       INT     1       ALC AGC Right Volume                    12 (range 0->31)
10      INT     1       ALC AGC Left Max Volume                 7 (range 0->7)
11      INT     1       ALC AGC Right Max Volume                7 (range 0->7)
12      INT     1       ALC AGC Left Min Volume                 0 (range 0->7)
13      INT     1       ALC AGC Right Min Volume                0 (range 0->7)
14      ENUM    1       ALC AGC Left Switch                     , OffOn
15      ENUM    1       ALC AGC Right Switch                    , OffOn
16      ENUM    1       AGC Left Approximate Sample Rate        , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
17      ENUM    1       AGC Right Approximate Sample Rate       , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
18      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
19      ENUM    1       ADC MICBIAS Voltage VREFx0_8VREFx0_825VREFx0_85VREFx0_875, VREFx0_9VREFx0_925VREFx0_95VREFx0_975
20      ENUM    1       ADC Main MICBIAS                        Off, On
21      ENUM    1       ADC MIC Left Switch                     , WorkMute
22      ENUM    1       ADC MIC Right Switch                    , WorkMute
23      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
24      INT     1       DAC HPMIX Volume                        1 (range 0->2)
25      ENUM    1       DAC Control Manually                    , NoneOffOn
```

<!-- source-page: 11; block: en-0074 -->

Es gibt zahlreiche Steuerelemente. Im Folgenden werden häufig verwendete erläutert:

<!-- source-page: 11; block: en-0075 -->

```text
0       ENUM    1       I2STDM Digital Loopback Mode            , DisabledMode1Mode2Mode2 Swap
```

<!-- source-page: 11; block: en-0076 -->

Dieses Steuerelement wird von I2S0 bereitgestellt und steht in engem Zusammenhang mit ACodec. Es gibt an, ob der I2STDM-Controller im Rückholmodus arbeitet. Die Optionen bedeuten:

<!-- source-page: 11; block: en-0077 -->

Disabled: Standardzustand; der Rückholmodus ist deaktiviert.

<!-- source-page: 11; block: en-0078 -->

Mode1: Für 4-Kanal-Anwendungen. Kanäle 1-2 enthalten Mikrofondaten; Kanäle 3-4 enthalten Referenzdaten.

<!-- source-page: 11; block: en-0079 -->

Mode2: Für 2-Kanal-Anwendungen. Links liegen Mikrofondaten, rechts die Wiedergabedaten des rechten Kanals.

<!-- source-page: 11; block: en-0080 -->

Mode2 Swap: Für 2-Kanal-Anwendungen. Links liegen Referenzdaten des linken Wiedergabekanals, rechts die Mikrofondaten. Die Kanalreihenfolge ist gegenüber Mode2 vertauscht.

<!-- source-page: 11; block: en-0081 -->

Bei Wiedergabe von 2-Kanal-Daten mit Mode2 oder Mode2 Swap sollte daher vor der Übertragung an den ACodec-DAC ein Software-MIX erfolgen. Dadurch entspricht das Referenzsignal eher dem tatsächlichen Echopfad.

<!-- source-page: 11; block: en-0082 -->

Hinweis: Im tinymix-Ausgabeformat kennzeichnet ein vorangestelltes Komma "," die ausgewählte Option. Beispielsweise bedeutet ", Disabled", dass aktuell "Disabled" ausgewählt ist.

<!-- source-page: 12; block: en-0083 -->

```text
1       INT     1       ADC MIC Left Gain                       2 (range 0->3)
2       INT     1       ADC MIC Right Gain                      2 (range 0->3)
```

<!-- source-page: 12; block: en-0084 -->

ACodec ADC Boost Gain steuert die analoge Codec-Lautstärke. Der tatsächlich gültige Wertebereich ist 1 ~ 3:

<!-- source-page: 12; block: en-0085 -->

vol 0: Deaktiviert; nicht empfohlen

<!-- source-page: 12; block: en-0086 -->

vol 1: 0dB

<!-- source-page: 12; block: en-0087 -->

vol 2: 20dB

<!-- source-page: 12; block: en-0088 -->

vol 3: 12dB

<!-- source-page: 12; block: en-0089 -->

```text
3       INT     1       ADC ALC Left Volume                     6 (range 0->31)
4       INT     1       ADC ALC Right Volume                    6 (range 0->31)
```

<!-- source-page: 12; block: en-0090 -->

ACodec ADC ALC PGA Gain steuert die analoge Codec-Lautstärke. Wertebereich: 0~31:

<!-- source-page: 12; block: en-0091 -->

Minimum: -9dB (vol: 0)

<!-- source-page: 12; block: en-0092 -->

Maximum: +37.5dB (vol: 31)

<!-- source-page: 12; block: en-0093 -->

Schrittweite: +1.5dB

<!-- source-page: 12; block: en-0094 -->

Nullpunkt: 0dB (vol: 6)

<!-- source-page: 12; block: en-0095 -->

```text
5       INT     1       ADC Digital Left Volume                 195 (range 0->255)
6       INT     1       ADC Digital Right Volume                195 (range 0->255)
```

<!-- source-page: 12; block: en-0096 -->

ACodec ADC Digital Gain steuert die digitale Codec-Lautstärke. Wertebereich: 0~255:

<!-- source-page: 12; block: en-0097 -->

Minimum: -97.5dB (vol: 0)

<!-- source-page: 12; block: en-0098 -->

Maximum: +30dB (vol: 255)

<!-- source-page: 12; block: en-0099 -->

Schrittweite: +0.5dB

<!-- source-page: 12; block: en-0100 -->

Nullpunkt: 0dB (vol: 195)

<!-- source-page: 12; block: en-0101 -->

```text
18      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
```

<!-- source-page: 12; block: en-0102 -->

"Diff" steht für "Differential", "Sing" für "Single-end". Damit wird der ADC auf differenziellen oder unsymmetrischen Betrieb eingestellt. Standard ist der differenzielle Modus "Diff". Um die Leistungsaufnahme zu minimieren, wird nur der linke ADC-Kanal L aktiviert; die Standardauswahl lautet daher "DiffadcL".

<!-- source-page: 12; block: en-0103 -->

Aufgrund der unterschiedlichen Chipauslegung unterstützt RV1103 keine Zweikanalaufnahme im differenziellen Modus und damit nicht die Option "DiffadcLR".

<!-- source-page: 12; block: en-0104 -->

```text
23      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
```

<!-- source-page: 12; block: en-0105 -->

ACodec DAC Lineout Gain hat den Lautstärkewertebereich 0~30:

<!-- source-page: 12; block: en-0106 -->

Minimum: -39dB (vol: 0)

<!-- source-page: 12; block: en-0107 -->

Maximum: +6dB (vol: 30)

<!-- source-page: 13; block: en-0108 -->

Schrittweite: +1.5dB

<!-- source-page: 13; block: en-0109 -->

Nullpunkt: 0dB (vol: 26)

<!-- source-page: 13; block: en-0110 -->

```text
24      INT     1       DAC HPMIX Volume                        1 (range 0->2)
```

<!-- source-page: 13; block: en-0111 -->

ACodec DAC HPMIX Gain ist die Vorverstärkung für Lineout und wird gewöhnlich nicht eingestellt. Tatsächlich gültige Lautstärkewerte sind 1 und 2:

<!-- source-page: 13; block: en-0112 -->

vol 0: Deaktiviert; nicht empfohlen

<!-- source-page: 13; block: en-0113 -->

vol 1: 0dB

<!-- source-page: 13; block: en-0114 -->

vol 2: 6dB

<!-- source-page: 13; block: en-0115 -->

```text
25      ENUM    1       DAC Control Manually                    , NoneOffOn
```

<!-- source-page: 13; block: en-0116 -->

Entwickler verwenden das Medienframework häufig mit dauerhaft aktivem AO Stream, also ständig aktivierter Soundkarte. Beim Anhalten der Wiedergabe muss dann nur der externe PA rasch aus- und wieder eingeschaltet werden. Dafür wurde das Steuerelement "DAC Control Manually" ergänzt:

<!-- source-page: 13; block: en-0117 -->

None: Standardzustand. Das Medienframework muss den AO Stream tatsächlich schließen beziehungsweise aktivieren, um die Soundkarte aus- oder einzuschalten.

<!-- source-page: 13; block: en-0118 -->

Off: Bei dauerhaft aktivem AO Stream kann der externe PA manuell abgeschaltet werden, um den Lautsprecher stummzuschalten.

<!-- source-page: 13; block: en-0119 -->

On: Bei dauerhaft aktivem AO Stream und vorherigem Zustand Off kann der externe PA manuell wieder eingeschaltet werden, um die Wiedergabe fortzusetzen.

<!-- source-page: 13; block: en-0120 -->

Dies sind die während der Entwicklung häufig verwendeten Codec-Steuerelemente. Weitere Optionen lassen sich anhand ihrer Namen und Auswahlmöglichkeiten für das jeweilige Projekt einstellen.

<!-- source-page: 13; block: en-0121 -->

### 3.4 ACodec-Konfiguration im Userspace für RV1106B/RV1103B

<!-- source-page: 13; block: en-0122 -->

Auch die ACodec-Steuerelemente von RV1106B/RV1103B lassen sich mit rk_mpi_amix_test auflisten:

<!-- source-page: 13; block: en-0123 -->

```text
# rk_mpi_amix_test --list_contents
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
Number of controls: 54
ctl     type    num     name                                    value
0       ENUM    1       SAI Transmit Start Mode Sel             , StandaloneChained
1       ENUM    1       SAI Receive Start Mode Sel              , StandaloneChained
2       ENUM    1       SAI Transmit SDOx Select                , AutoSDOx1SDOx2SDOx3SDOx4
3       ENUM    1       SAI Receive SDIx Select                 , AutoSDIx1SDIx2SDIx3SDIx4
4       INT     1       SAI Receive Mono Slot Select            0 (range 0->128)
5       ENUM    1       SAI Receive Mono Switch                 , DisableEnable
6       ENUM    1       SAI Transmit Mono Switch                , DisableEnable
7       ENUM    1       SAI SDI3 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
8       ENUM    1       SAI SDI2 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
9       ENUM    1       SAI SDI1 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
10      ENUM    1       SAI SDI0 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
11      ENUM    1       SAI SDI3 Loopback I2S LR Switch         , DisableEnable
12      ENUM    1       SAI SDI2 Loopback I2S LR Switch         , DisableEnable
13      ENUM    1       SAI SDI1 Loopback I2S LR Switch         , DisableEnable
14      ENUM    1       SAI SDI0 Loopback I2S LR Switch         , DisableEnable
15      ENUM    1       SAI SDI3 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
16      ENUM    1       SAI SDI2 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
17      ENUM    1       SAI SDI1 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
18      ENUM    1       SAI SDI0 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
19      ENUM    1       SAI SDI3 Loopback Switch                , DisableEnable
20      ENUM    1       SAI SDI2 Loopback Switch                , DisableEnable
21      ENUM    1       SAI SDI1 Loopback Switch                , DisableEnable
22      ENUM    1       SAI SDI0 Loopback Switch                , DisableEnable
23      ENUM    1       SAI Sync Out Switch                     , From CRUFrom IO
24      ENUM    1       SAI Sync In Switch                      , From IOFrom Sync Port
25      ENUM    1       SAI Receive PATH3 Source Select         From SDI0From SDI1From SDI2, From SDI3
26      ENUM    1       SAI Receive PATH2 Source Select         From SDI0From SDI1, From SDI2From SDI3
27      ENUM    1       SAI Receive PATH1 Source Select         From SDI0, From SDI1From SDI2From SDI3
28      ENUM    1       SAI Receive PATH0 Source Select         , From SDI0From SDI1From SDI2From SDI3
29      ENUM    1       SAI Transmit SDO3 Source Select         From PATH0From PATH1From PATH2, From PATH3
30      ENUM    1       SAI Transmit SDO2 Source Select         From PATH0From PATH1, From PATH2From PATH3
31      ENUM    1       SAI Transmit SDO1 Source Select         From PATH0, From PATH1From PATH2From PATH3
32      ENUM    1       SAI Transmit SDO0 Source Select         , From PATH0From PATH1From PATH2From PATH3
33      BOOL    1       SAI Clk Auto Switch                     Off
34      INT     1       SAI PCM Read Wait Time MS               0 (range 0->10000)
35      INT     1       SAI PCM Write Wait Time MS              0 (range 0->10000)
36      INT     1       ADC MIC Left Gain                       2 (range 0->3)
37      INT     1       ADC ALC Left Volume                     6 (range 0->31)
38      INT     1       ADC Digital Left Volume                 195 (range 0->255)
39      ENUM    1       ADC HPF Cut-off                         , OffOn
40      INT     1       ALC AGC Left Volume                     12 (range 0->31)
41      INT     1       ALC AGC Left Max Volume                 7 (range 0->7)
42      INT     1       ALC AGC Left Min Volume                 0 (range 0->7)
43      ENUM    1       ALC AGC Left Switch                     , OffOn
44      ENUM    1       AGC Left Approximate Sample Rate        , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
45      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
46      ENUM    1       ADC MICBIAS Voltage VREFx0_8VREFx0_825VREFx0_85VREFx0_875, VREFx0_9VREFx0_925VREFx0_95VREFx0_975
47      ENUM    1       ADC Main MICBIAS                        Off, On
48      ENUM    1       ADC MIC Left Switch                     , WorkMute
49      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
50      INT     1       DAC HPMIX Volume                        1 (range 0->2)
51      ENUM    1       DAC Control Manually                    , NoneOffOn
52      ENUM    1       DAC VCM Manually                        , NoneOffOn
53      ENUM    1       Audio Mux Select                        , Path0Path1Path2Path3Path4Path5
```

<!-- source-page: 15; block: en-0126 -->

Da der ACodec von RV1106B/RV1103B nur einen ADC-Eingang besitzt, entfällt gegenüber RV1106/RV1103 der ADC-Teil "Right"; übrig bleibt "Left" mit identischer Funktionskonfiguration. Neu ist "Audio Mux Select" zum Umschalten des SAI-Controllers zwischen internem ACodec und externen IO-Kanälen:

<!-- source-page: 15; block: en-0127 -->

```text
53      ENUM    1       Audio Mux Select                        , Path0Path1Path2Path3Path4Path5
```

<!-- source-page: 15; block: en-0128 -->

Für die Kanalumschaltung gibt es 6 Path-Zustände:

<!-- source-page: 15; block: en-0129 -->

Path0: Wiedergabe nur über ACodec Lineout; Aufnahme nur über ACodec Mic (Standard).

<!-- source-page: 15; block: en-0130 -->

Path1: Wiedergabe nur über ACodec Lineout; Aufnahme nur über SAI SDI IO.

<!-- source-page: 15; block: en-0131 -->

Path2: Wiedergabe gleichzeitig über ACodec Lineout und SAI SDO IO; Aufnahme nur über ACodec Mic.

<!-- source-page: 15; block: en-0132 -->

Path3: Wiedergabe gleichzeitig über ACodec Lineout und SAI SDO IO; Aufnahme nur über SAI SDI IO.

<!-- source-page: 15; block: en-0133 -->

Path4: Wiedergabe nur über SAI SDO IO; Aufnahme nur über ACodec Mic.

<!-- source-page: 15; block: en-0134 -->

Path5: Wiedergabe nur über SAI SDO IO; Aufnahme nur über SAI SDI IO (nur für Tests, gewöhnlich ungenutzt).

<!-- source-page: 15; block: en-0135 -->

Durch den Wechsel zu SAI unterscheidet sich der Controller deutlich vom I2S-Teil des RV1106/RV1103. Hier steht die digitale Loopback-Konfiguration von RV1106B/RV1103B im Vordergrund. Da deren ACodec nur einen ADC-Eingang besitzt, ist für die SAI-Eingangsdaten nur die Lane SDI0 relevant:

<!-- source-page: 15; block: en-0136 -->

```text
10      ENUM    1       SAI SDI0 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
```

<!-- source-page: 15; block: en-0137 -->

L:MIC R:LP: Auswahl der linken und rechten Kanäle von SAI SDI0 im Loopback-Modus: links Mikrofon, rechts Loopback.

<!-- source-page: 15; block: en-0138 -->

L:LP R:MIC: Auswahl der linken und rechten Kanäle von SAI SDI0 im Loopback-Modus: rechts Mikrofon, links Loopback.

<!-- source-page: 15; block: en-0139 -->

```text
14      ENUM    1       SAI SDI0 Loopback I2S LR Switch         , DisableEnable
```

<!-- source-page: 16; block: en-0140 -->

Der Schalter zur Auswahl der linken und rechten Kanäle der SAI-SDI0-Lane im Aufnahmemodus ist standardmäßig deaktiviert; die Daten werden durchgereicht. Aktivieren Sie ihn für digitale Referenzaufnahme.

<!-- source-page: 16; block: en-0141 -->

```text
18      ENUM    1       SAI SDI0 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
```

<!-- source-page: 16; block: en-0142 -->

Auswahl der Referenz-Ausgangsdaten-Lane, nachdem SAI SDI0 die digitale Referenzaufnahme startet. Da RV1106B/RV1103B nur Monoaufnahme und Monowiedergabe unterstützen, ist hier ausschließlich SDO0 als Referenz unterstützt. Behalten Sie den Standardzustand bei.

<!-- source-page: 16; block: en-0143 -->

```text
22      ENUM    1       SAI SDI0 Loopback Switch                , DisableEnable
```

<!-- source-page: 16; block: en-0144 -->

Schalter für die digitale Referenzaufnahme der SAI-SDI0-Lane. Standardmäßig deaktiviert; bei Bedarf aktivieren.

<!-- source-page: 16; block: en-0145 -->

Für die vollständige Konfiguration eines Mikrofons und eines Referenzkanals verwenden Sie folgende Befehle:

<!-- source-page: 16; block: en-0146 -->

```text
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Channel Sel" --value "L:MIC R:LP"
rk_mpi_amix_test --control "SAI SDI0 Loopback Src Select" --value "From SDO0"
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Switch" --value "Enable"
rk_mpi_amix_test --control "SAI SDI0 Loopback Switch" --value "Enable"
```

<!-- source-page: 16; block: en-0147 -->

Da die Register "SAI SDI0 Loopback I2S LR Channel Sel" und "SAI SDI0 Loopback Src Select" nach dem Einschalten bereits den benötigten Zustand behalten, lässt sich die Konfiguration zur Aktivierung der digitalen Referenzaufnahme gewöhnlich wie folgt verkürzen:

<!-- source-page: 16; block: en-0148 -->

```text
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Switch" --value "Enable"
rk_mpi_amix_test --control "SAI SDI0 Loopback Switch" --value "Enable"
```

<!-- source-page: 16; block: en-0149 -->

Beispiel für eine Zweikanalaufnahme auf RV1106B/RV1103B: links Mikrofon, rechts Loopback:

<!-- source-page: 16; block: en-0150 -->

![Technische Originalabbildung: 3.4 ACodec-Userspace-Konfiguration für RV1106B/RV1103B (S. 16)](/docs/rockchip-rv-acodec/assets/en-p016-fig01.png)

<!-- source-page: 16; block: en-0151 -->

### 3.5 ACodec-Konfiguration im Userspace für RV1126B/RV1126BP

<!-- source-page: 16; block: en-0152 -->

Der in der Quelle als aktuell bezeichnete SDK-Kernelcode aktiviert ADC0 und ADC1 standardmäßig:

<!-- source-page: 17; block: en-0153 -->

```text
commit b69407b9ad1232f35ae108fd8755d962fcdeda84
Author: Xing Zheng <zhengxing@rock-chips.com>
Date:   Tue Jul 1 18:44:24 2025 +0800
    arm64: dts: rockchip: rv1126b-evb: enable both acodec_pmu and acodec for 4ch capture by
default
```

<!-- source-page: 17; block: en-0154 -->

Prüfen Sie anhand des folgenden Patches im Projektcode, ob die Funktion aktiviert ist:

<!-- source-page: 17; block: en-0155 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
index 1ca72d41c5ab..cf6b5788ea5e 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
@@ -445,7 +445,6 @@ &rtc {
 };
 &sai2 {
-       rockchip,sai-rx-route = <1 0 2 3>;
        status = "okay";
        /delete-property/ pinctrl-names;
        /delete-property/ pinctrl-0;
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
index eb3879ca4c5f..8ca9b5b9a32c 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
@@ -20,7 +20,7 @@ acodec_sound: acodec-sound {
                rockchip,format = "i2s";
                rockchip,mclk-fs-mapping = <256 1024>;
                rockchip,cpu = <&sai2>;
-               rockchip,codec = <&audio_codec>, <&acdcdig_dsm>;
+               rockchip,codec = <&audio_codec_pmu>, <&audio_codec>, <&acdcdig_dsm>;
        };
        adc-keys {
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
index 31faaa3ad88b..da82560304cd 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
@@ -132,6 +132,10 @@ &acodec_sound {
        status = "okay";
 };
+&audio_codec_pmu {
+       status = "okay";
+};
+
 &audio_codec {
        status = "okay";
 };
```

<!-- source-page: 18; block: en-0157 -->

Der Inhalt einer Standard-Soundkarte sieht daher üblicherweise so aus:

<!-- source-page: 18; block: en-0158 -->

```text
# rk_mpi_amix_test --list_contents 1
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
ctl     type    num     name                            value
0       BOOL    1       Headphone Switch                1
1       BOOL    1       ACodec ADC Switch               0
2       INTE    1       ACodec Digital Gain Volume      0(0->127)
3       ENUM    1       ACodec HPF Cutoff               ,"3.79Hz" "60Hz" "243Hz" "493Hz"
4       BOOL    1       ACodec HPF Switch               0
5       INTE    1       ACodec PGA Gain Volume          16(0->31)
6       BOOL    1       ACodec_LP ADC Switch            0
7       INTE    1       ACodec_LP Digital Gain Volume   0(0->127)
8       ENUM    1       ACodec_LP HPF Cutoff            ,"3.79Hz" "60Hz" "243Hz" "493Hz"
9       BOOL    1       ACodec_LP HPF Switch            0
10      INTE    1       ACodec_LP PGA Gain Volume       16(0->31)
11      INTE    2       DAC Digital Volume              255(0->510) 255(0->510)
12      ENUM    1       DAC HPF Cutoff                  ,"80Hz" "100Hz" "120Hz" "140Hz"
13      BOOL    1       DAC HPF Switch                  0
14      BOOL    1       Headset Mic Switch              1
15      BOOL    1       Main Mic Switch                 1
16      ENUM    1       Power Amplifier                 ,"Off" "On"
17      BOOL    1       SAI2 Clk Auto Switch            0
18      INTE    1       SAI2 Receive Mono Slot Select   0(0->128)
19      ENUM    1       SAI2 Receive Mono Switch        ,"Disable" "Enable"
20      ENUM    1       SAI2 Receive PATH0 Source Sele  ,"From SDI0" "From SDI1" "From SDI2" "From SDI3"
21      ENUM    1       SAI2 Receive PATH1 Source Sele  "From SDI0" ,"From SDI1" "From SDI2" "From SDI3"
22      ENUM    1       SAI2 Receive PATH2 Source Sele  "From SDI0" "From SDI1" ,"From SDI2" "From SDI3"
23      ENUM    1       SAI2 Receive PATH3 Source Sele  "From SDI0" "From SDI1" "From SDI2" ,"From SDI3"
24      ENUM    1       SAI2 Receive SDIx Select        ,"Auto" "SDIx1" "SDIx2" "SDIx3" "SDIx4"
25      ENUM    1       SAI2 Receive Start Mode Sel     ,"Standalone" "Chained"
26      ENUM    1       SAI2 SDI0 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
27      ENUM    1       SAI2 SDI0 Loopback I2S LR Swit  ,"Disable" "Enable"
28      ENUM    1       SAI2 SDI0 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
29      ENUM    1       SAI2 SDI0 Loopback Switch       ,"Disable" "Enable"
30      ENUM    1       SAI2 SDI1 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
31      ENUM    1       SAI2 SDI1 Loopback I2S LR Swit  ,"Disable" "Enable"
32      ENUM    1       SAI2 SDI1 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
33      ENUM    1       SAI2 SDI1 Loopback Switch       ,"Disable" "Enable"
34      ENUM    1       SAI2 SDI2 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
35      ENUM    1       SAI2 SDI2 Loopback I2S LR Swit  ,"Disable" "Enable"
36      ENUM    1       SAI2 SDI2 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
37      ENUM    1       SAI2 SDI2 Loopback Switch       ,"Disable" "Enable"
38      ENUM    1       SAI2 SDI3 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
39      ENUM    1       SAI2 SDI3 Loopback I2S LR Swit  ,"Disable" "Enable"
40      ENUM    1       SAI2 SDI3 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
41      ENUM    1       SAI2 SDI3 Loopback Switch       ,"Disable" "Enable"
42      ENUM    1       SAI2 Sync In Switch             ,"From IO" "From Sync Port"
43      ENUM    1       SAI2 Sync Out Switch            ,"From CRU" "From IO"
44      ENUM    1       SAI2 Transmit Mono Switch       ,"Disable" "Enable"
45      ENUM    1       SAI2 Transmit SDO0 Source Sele  ,"From PATH0" "From PATH1" "From PATH2" "From PATH3"
46      ENUM    1       SAI2 Transmit SDO1 Source Sele  "From PATH0" ,"From PATH1" "From PATH2" "From PATH3"
47      ENUM    1       SAI2 Transmit SDO2 Source Sele  "From PATH0" "From PATH1" ,"From PATH2" "From PATH3"
48      ENUM    1       SAI2 Transmit SDO3 Source Sele  "From PATH0" "From PATH1" "From PATH2" ,"From PATH3"
49      ENUM    1       SAI2 Transmit SDOx Select       ,"Auto" "SDOx1" "SDOx2" "SDOx3" "SDOx4"
50      ENUM    1       SAI2 Transmit Start Mode Sel    ,"Standalone" "Chained"
51      BOOL    1       Speaker Switch                  1
52      BOOL    1       hp switch                       0
53      BOOL    1       spk switch                      0
54      INTE    1       SAI2 PCM Read Wait Time MS      0(0->10000)
55      INTE    1       SAI2 PCM Write Wait Time MS     0(0->10000)
```

<!-- source-page: 19; block: en-0160 -->

ADC0 und ADC1 des RV1126B belegen jeweils eine I2S-Datenleitung, SDI0 beziehungsweise SDI1. Jede SDI-Leitung empfängt bei der Aufnahme zwei identische Datenkanäle. Beispielsweise enthalten links und rechts auf SDI0 MIC0-Daten von ADC0; links und rechts auf SDI1 enthalten MIC1-Daten von ADC1.

<!-- source-page: 19; block: en-0161 -->

Aktivieren Sie daher sowohl bei einem als auch bei zwei Mikrofonen die Referenzaufnahmefunktion für SDI0 und SDI1:

<!-- source-page: 19; block: en-0162 -->

```text
rk_mpi_amix_test --control 'SAI2 SDI0 Loopback I2S LR Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI0 Loopback Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI1 Loopback I2S LR Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI1 Loopback Switch' --value 'Enable'
```

<!-- source-page: 19; block: en-0163 -->

So lassen sich die standardmäßig über SAI2 SDO0 wiedergegebenen digitalen Audiodaten direkt aus dem rechten Kanal von SDI0 und SDI1 gewinnen.

<!-- source-page: 19; block: en-0164 -->

Für ein übliches Szenario mit 2 Mikrofonkanälen und 1 Referenzkanal verwendet RV1126B standardmäßig die vollständige alsa-lib-Architektur und unterstützt asound.conf. Die Datei asound.conf muss im Verzeichnis /etc liegen:

<!-- source-page: 19; block: en-0165 -->

```text
# Copyright (c) 2025 Rockchip Electronics Co. Ltd.
# Author: Xing Zheng <zhengxing@rock-chips.com>
pcm.!default {
    type asym
    playback.pcm "play_plug"
    capture.pcm "capt_softvol"
}
ctl.!default {
    type hw
    card 0
}
# ---------- Capture ----------
pcm.cap_multi {
    type multi
    slaves.a.pcm "hw:0,0"
    slaves.a.channels 4
    bindings.0.slave a
    bindings.0.channel 0
    bindings.1.slave a
    bindings.1.channel 2
    bindings.2.slave a
    bindings.2.channel 1
}
pcm.capt_plug {
    type plug
    slave.pcm "cap_multi"
}
pcm.capt_softvol {
    type softvol
    slave.pcm "capt_plug"
    control.name "Master Capture Volume"
    control.card 0
    min_dB -51.0
    max_dB 0.0
    resolution 101
}
# ---------- Playback ----------
pcm.play_softvol {
    type softvol
    slave.pcm "hw:0,0"
    control.name "Master Playback Volume"
    control.card 0
    min_dB -51.0
    max_dB 0.0
    resolution 101
}
pcm.play_plug {
    type plug
    slave.pcm "play_softvol"
}
```

<!-- source-page: 21; block: en-0168 -->

Passen Sie anschließend auf Anwendungsseite test_mpi_ai.cpp wie folgt an, um bei einer 3-Kanal-Aufnahme die Layout-Bitmaps für Rec 2ch und Ref 1ch festzulegen:

<!-- source-page: 21; block: en-0169 -->

```text
diff --git a/src/tests/rt_mpi/mod/test_mpi_ai.cpp b/src/tests/rt_mpi/mod/test_mpi_ai.cpp
index 682467c03..798907c0d 100644
--- a/src/tests/rt_mpi/mod/test_mpi_ai.cpp
+++ b/src/tests/rt_mpi/mod/test_mpi_ai.cpp
@@ -757,9 +760,13 @@ RK_S32 test_init_ai_vqe(TEST_AI_CTX_S *params) {
     stAiVqeConfig.s32WorkSampleRate = params->s32SampleRate;
     stAiVqeConfig.s32FrameSample = params->s32SampleRate * params->s32VqeGapMs / 1000;
+    /* FIXME: for capture with more channel */
     if (params->s32DeviceChannel == 4) {
         stAiVqeConfig.s64RefChannelType = 0x0c;
         stAiVqeConfig.s64RecChannelType = 0x03;
+    } else if (params->s32DeviceChannel == 3) {
+        stAiVqeConfig.s64RefChannelType = 0x04;
+        stAiVqeConfig.s64RecChannelType = 0x03;
     } else {
         stAiVqeConfig.s64RefChannelType = 0x02;
         stAiVqeConfig.s64RecChannelType = 0x01;
```

<!-- source-page: 21; block: en-0170 -->

Verwenden Sie rk_mpi_ai_test für 3-Kanal-Aufnahme und geben Sie für sound_card_name den Einstiegsknoten "default" an:

<!-- source-page: 21; block: en-0171 -->

```text
export rt_dump_skv_inout=true
rk_mpi_ai_test --sound_card_name=default --device_rate 8000 --device_ch 3 --out_rate 8000 --out_ch 1 --output /tmp --vqe_enable 1 --vqe_cfg /tmp/config_aivqe.json
```

<!-- source-page: 21; block: en-0172 -->

Die erwartete Reihenfolge der Daten ist MIC0/MIC1/Loopback0. Die folgenden Diagramme zeigen Zeit- und Frequenzbereich dieser drei Kanäle:

<!-- source-page: 21; block: en-0173 -->

![Technische Originalabbildung: 3.5 ACodec-Userspace-Konfiguration für RV1126B/RV1126BP (S. 21)](/docs/rockchip-rv-acodec/assets/en-p021-fig01.png)

<!-- source-page: 22; block: en-0174 -->

## 4. Häufig verwendete ACodec-Testbefehle

<!-- source-page: 22; block: en-0175 -->

Da die Betriebsumgebung von RV1106/RV1103/RV1106B/RV1103B gewöhnlich auf Rockit basiert, verbinden die folgenden Beispiele grundlegende Schritte mit Rockit-Befehlen.

<!-- source-page: 22; block: en-0176 -->

### 4.1 Häufige Testbefehle für die Wiedergabe

<!-- source-page: 22; block: en-0177 -->

Das folgende Beispiel verwendet PCM-Audio mit 16kHz/2ch/16bit als Wiedergabequelle. rk_mpi_ao_test verarbeitet standardmäßig 16bit. Gleiche Werte für "device_rate=16000" und "input_rate=16000" bedeuten, dass kein Resampling benötigt wird. "input_ch=2" muss den 2 Kanälen der ursprünglichen Audioquelle entsprechen:

<!-- source-page: 22; block: en-0178 -->

```text
rk_mpi_ao_test -i /tmp/sine_16k_500_1000_0dbfs.wav --sound_card_name=hw:0,0 --device_ch=2 --device_rate=16000 --input_rate=16000 --input_ch=2
```

<!-- source-page: 22; block: en-0179 -->

Die Datei sine_16k_500_1000_0dbfs.wav steht unter https://redmine.rock-chips.com/attachments/2297743 zum Download bereit.

<!-- source-page: 22; block: en-0180 -->

Weitere Befehlsparameter sind in den "MPI"-Dokumenten im SDK-Rockit-Projektverzeichnis und den Testfällen im mpi-Beispielverzeichnis beschrieben.

<!-- source-page: 22; block: en-0181 -->

### 4.2 Häufige Testbefehle für die Aufnahme

<!-- source-page: 22; block: en-0182 -->

Das folgende Beispiel nimmt PCM mit 16kHz/2ch/16bit auf. Auch rk_mpi_ai_test verarbeitet standardmäßig 16bit. Gleiche Werte für "device_rate=16000" und "input_rate=16000" bedeuten, dass kein Resampling erforderlich ist. Gleiche Werte für "device_ch=2" und "input_ch=2" bedeuten, dass keine Kanalverarbeitung nötig ist. Die Aufnahme erzeugt die Datei cap_out.pcm im Verzeichnis /tmp.

<!-- source-page: 22; block: en-0183 -->

```text
rk_mpi_ai_test --sound_card_name=hw:0,0 --device_rate=16000 --device_ch=2 --out_rate=16000 --out_ch=2 --output=/tmp
```

<!-- source-page: 22; block: en-0184 -->

Weitere Befehlsparameter erläutert das Kapitel "AO/AI debugging steps" in "Rockchip_Developer_Guide_MPI_FAQ.pdf".

{% endraw %}
