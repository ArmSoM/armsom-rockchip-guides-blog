---
title: "Rockchip-Kamerasensortreiber: V4L2, MCU-Schnellstart, AOV und Synchronisation"
description: "Rockchip-Kamerasensortreiber: V4L2, MCU-Schnellstart, AOV und Synchronisation — V1.1.0"
excerpt: "Rockchip-Kamerasensortreiber: V4L2, MCU-Schnellstart, AOV und Synchronisation"
translation_key: "182-rockchip-camera-driver"
slug: "182-rockchip-camera-driver"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: [ArmSoM, Rockchip, Camera, V4L2, MCU, AOV]
---

{% raw %}

Vollständiger technischer Inhalt des chinesischen V1.1.0. Kein englisches PDF; EN/RU/DE sind vollständige Übersetzungen. Alle fünf Bilder stammen aus der chinesischen Quelle; interne Beschriftungen bleiben chinesisch. Quellengeltung: RV1109/RV1126 und RK356X Linux4.19; RK3588, RK3576, RV1106/RV1103, RV1106B/RV1103B Linux5.10; RV1126B Linux6.1. Nur ArmSoM-Plattformreferenz: Board, Kameramodul, SDK/BSP, Versorgung/IOMUX und Kernel-APIs einzeln anpassen. Keine pauschale Boardunterstützung. Startzeiten/Fehleranteile sind Quellenangaben, keine ArmSoM-Messungen. Keine Hardwarebefehle ausgeführt.

> Quellenfragen: probe/remove/ioctl-Signaturen unterscheiden sich zwischen Definitionen und Tabellen; beide bleiben erhalten. Doppeltes SC200AI_LGAIN, denominato/Ctrol/intput und falsche Querverweise nicht erraten. Vertikales Flip ist keine180°-Drehung.90%/9%/1%, MIPI-Grenzen sowie Augen-/Slew-/Abschlusswerte aus6.5 sind keine verifizierten Universalnormen. „50Ω nach Masse“ nicht direkt anwenden; Hardwareingenieure müssen PHY, Referenzdesign und Spezifikation prüfen, um Schäden zu vermeiden. Nennwerte einhalten, stromlos umstecken und temporäre power_off-Änderungen zurücknehmen. Interne Muster allein bestätigen keine optischen Pixelfehlerfreiheit.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 2. Vorbereitung der Fehlersuche

Vor der Fehlersuche am Camera-Treiber folgende Unterlagen vorbereiten:

### 2.1 Host-Spezifikationen prüfen

Maximale Auflösung, obere Eingangsfrequenz, maximale Datenrate je Lane, unterstützte Lane-Anzahl und Eingangs-Schnittstellentyp der Host-Plattform für diesen Sensor prüfen.

### 2.2 Sensor DataSheet

Datenblatt des Sensorherstellers beschaffen: Versorgungsspannungen und Ein-/Ausschaltfolge, Chip ID für die probe-Prüfung, Belichtungszeit-/Verstärkungseinstellung und Bildratenänderung, Slave-Unterstützung sowie Mehrkamera-Verkabelung und Register, Testmodus und HDR sowie Mirror/Flip-Konfiguration prüfen.

### 2.3 Sensor Initialize Settings

Registerliste normalerweise vom Sensorhersteller beschaffen. Auflösung, Bildrate, Lane-Anzahl, Rate je Lane, VTS, HTS, Bitbreite und Haupttakt festlegen. Mindestens Standardauflösungen vorbereiten; Binning-/Crop-Sequenzen nach Projektbedarf. SmartSens-Beispiel: cleaned_0x2b_SC530AI_27Minput_1080Mbps_2lane_10bit_1920x1080_60fps.ini. Dateiname: SC530AI, Host-MCLK 27Mhz, MIPI zum Host 1080Mbps je Lane, 2 Lanes, 10bit, 1920x1080 (1080p), Bildrate 60pfs (Originalschreibweise).

Folgende Vorlage dient zur Konfigurationsanfrage beim Sensorhersteller; Einträge nach Projektbedarf auswählen.

```text
sensor: XXXX
mclk: 24MHz/27Mhz/37.5Mhz
mode: raw8/raw10/raw12/raw16
output: 720p/1080p/1440p/... (Auflösung)
Schnittstelle: mipi 1/2/4 Lane
Bildrate: 30/60/120 fps
Host: RK3588/RV1106/RV1103B/RV1126B/...
Produkt: Türklingel/Türklingel/IPC/... (optional; Quellenwiederholung)
```

## 3. Treiberentwicklung

### 3.1 Treibercode schreiben

Einen neuen Sensortreiber auf einem ähnlich spezifizierten Sensor unter kernel/drivers/media/i2c/ oder einem ähnlichen Modell desselben Herstellers aufbauen. Die folgenden Kapitel erläutern den RK-Prozess anhand von SmartSens SC200AI.

#### 3.1.1 Wichtige Sensorparameter

Die mode-Struktur definiert wichtige Sensorparameter. Für jede Auflösung korrekt ausfüllen.

```text
struct XXXX_mode {
    u32 bus_fmt;    //输出像素格式
    u32 width;      //输出宽度
    u32 height;     //输出⾼度
    struct v4l2_fract max_fps; //最⼤输出帧率
    u32 hts_def;    //默认⾏总周期
    u32 vts_def;    //默认帧总周期
    u32 exp_def;    //默认曝光值
    u32 mipi_freq_idx;//链接频率索引值
    u32 bpp;        //每像素所⽤bit数
    const struct regval *reg_list; //寄存器列表
    u32 hdr_mode;   //宽动态模式
    u32 vc[PAD_MAX];//虚拟通道数组
};
```

Das Array supported_modes enthält mode-Strukturen unterstützter Auflösungen, die bei probe oder Auflösungswechsel durchlaufen und zugeordnet werden. SC200AI-Beispiel:

```text
static const struct sc200ai_mode supported_modes[] = {
    { // 1080p 30fps 线性配置参数
    .width = 1920,
    .height = 1080,
    .max_fps = {
        .numerator = 10000,
        .denominator = 300000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x44C * 2,
    .vts_def = 0x0465,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_linear_10_1920x1080_30fps_regs,
    .hdr_mode = NO_HDR,
    .bpp = 10,
    .mipi_freq_idx = 1,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
},
{ // 540p 120fps 线性配置参数
    .width = 960,
    .height = 540,
    .max_fps = {
        .numerator = 10000,
        .denominator = 1200000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x420,
    .vts_def = 0x249,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_linear_10_960x540_120fps_regs,
    .hdr_mode = NO_HDR,
    .bpp = 10,
    .mipi_freq_idx = 0,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
},
{ // 1080p 30fps 宽动态配置参数
    .width = 1920,
    .height = 1080,
    .max_fps = {
        .numerator = 10000,
        .denominator = 300000,
    },
    .exp_def = 0x0080,
    .hts_def = 0x44C * 2,
    .vts_def = 0x08CC,
    .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
    .reg_list = sc200ai_hdr_10_1920x1080_regs,
    .hdr_mode = HDR_X2,
    .bpp = 10,
    .mipi_freq_idx = 1,
    .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
    .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
    .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
    .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
},
}
```

Parameter:

bus_fmt beschreibt die Pixelausgabe. Die Herstellersequenz nennt gewöhnlich die Bitbreite (etwa 10bit); BGGR ist die Bayer-Reihenfolge. Eine falsche Reihenfolge verhindert das Bild nicht, verursacht aber einen Farbstich.

width und height sind die aktiven Ausgabemaße und wichtigsten Parameter, meist kleiner als hts und vts.

max_fps ist die maximale Bildrate des Modus: denominato / numerator (Originalschreibweise). numerator bleibt gewöhnlich unverändert; bei genau 30 Bildern/s ist denominator 300000.

exp_def ist die Standardbelichtung, hts_def die Gesamtpunktzahl je Zeile, vts_def die Gesamtzeilenzahl je Bild. Aus Initialisierungsregistern übernehmen. Ein falsches vts_def verändert die Bildrate.

global_reg_list enthält allgemeine Initialisierungsregister und darf leer sein; reg_list ist die Herstellersequenz. hdr_mode: NO_HDR für linear, HDR_X2/HDR_X3 für HDR-Fusion aus zwei/drei Bildern.

link_freq_idx indiziert link_freq_menu_items. Hersteller nennen gewöhnlich Mbps je Lane; MIPI tastet beide Flanken ab, daher ist die Frequenz die halbe Übertragungsrate. Erste lineare Sequenz: 720Mbps, somit MIPI/link_freq 360M. Falsche Werte verhindern leicht die Aufnahme; mehrfach prüfen. bpp ist Bit je Pixel.

Linear und HDR unterscheiden sich in hdr_mode und im virtuellen Kanalarray vc. Linear: hdr_mode = NO_HDR, vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0. HDR: hdr_mode = HDR_X2/HDR_X3; vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0; vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0; vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1; vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1.

#### 3.1.2 Wichtige Sensorregister

Folgende wichtige Register können bei der Treiberentwicklung verwendet werden; Einzelheiten variieren nach Hersteller und Modell.

##### 3.1.2.1 Chip id

Chip ID identifiziert den Sensor beim Treiberladen. probe prüft die ID; die Quelle wertet eine korrekte ID als Hinweis auf Erkennung, I2C-Kommunikation und Versorgungsspannungen.

```text
#define CHIP_ID                 0xcb1c
#define SC200AI_REG_CHIP_ID     0x3107
```

Manche Sensoren besitzen keine Chip ID. Zur Erkennungs-/Anbindungsprüfung ein oder mehrere Nur-Lese-Register auslesen und mit Standardwerten vergleichen.

##### 3.1.2.2 Ctrol mode

Das Stream-Start/Stopp-Register wird normalerweise nach erfolgreichem Schreiben aller anderen Sensorregister gesetzt.

```text
#define SC200AI_REG_CTRL_MODE       0x0100
#define SC200AI_MODE_SW_STANDBY     0x0
#define SC200AI_MODE_STREAMING      BIT(0)
```

Dieses Register nicht in der Registersequenz setzen. Start-/Stopp-Schnittstellen steuern es gesondert.

##### 3.1.2.3 Exposure reg

Belichtungsregister können sich zwischen linearem und HDR-Modus unterscheiden; Sensorhandbuch beachten.

```text
#define SC200AI_REG_EXPOSURE_H      0x3e00  //⻓曝光最⾼位
#define SC200AI_REG_EXPOSURE_M      0x3e01  //⻓曝光中间位
#define SC200AI_REG_EXPOSURE_L      0x3e02  //⻓曝光最低位
#define SC200AI_REG_SEXPOSURE_H     0x3e22  //短曝光最⾼位
#define SC200AI_REG_SEXPOSURE_M     0x3e04  //短曝光中间位
#define SC200AI_REG_SEXPOSURE_L     0x3e05  //短曝光最低位
#define SC200AI_EXPOSURE_MIN        1       //最新曝光⾏，⼀般不改，除⾮sensor有最⼩曝光限制
#define SC200AI_EXPOSURE_STEP       1       //曝光步进，⼀般不⽤修改
```

Belichtungsregister können mehr als 16bit umfassen: 24bit bestehen aus hohem, mittlerem und niedrigem Byte und erfordern mehrere Schreibvorgänge. Lange/kurze Bilder können gesonderte Werte benötigen. Verstärkungen können Formeln erfordern: analog linear oder tabelliert; digital ein Gleitkommafaktor, der als Festkomma etwa Q8.8 geschrieben wird.

##### 3.1.2.4 Gain reg

Register steuern analoge und digitale Verstärkung. Beide können Grobverstärkung (gewöhnlich Ganzzahlteil) und Feinverstärkung (gewöhnlich Bruchteil) besitzen.

Analogverstärkung verstärkt die Sensorspannung vor dem ADC. Sie beeinflusst das Rauschen weniger als digitale Verstärkung, hat aber einen begrenzten Bereich; zu hohe Werte erhöhen Rauschen und nichtlineare Verzerrung. Register: ANA_GAIN (grob), ANA_FINE_GAIN (fein).

Digitalverstärkung multipliziert Rohwerte wie 10bit/12bit nach dem ADC. Sie ist einfach und flexibel, verstärkt aber Rauschen und Quantisierungsfehler, besonders Farbrauschen bei wenig Licht. Register: DIG_GAIN (grob), DIG_FINE_GAIN (fein).

Ziele: Helligkeit bei wenig Licht erhöhen; AE passt Verstärkung und Belichtungszeit (shutter/line count) dynamisch an die Zielhelligkeit an; SNR und Dynamikbereich steuern.

```text
#define SC200AI_REG_DIG_GAIN        0x3e06  //数字主增益
#define SC200AI_REG_DIG_FINE_GAIN   0x3e07  //数组精增益
#define SC200AI_REG_ANA_GAIN        0x3e08  //模拟主增益
#define SC200AI_REG_ANA_FINE_GAIN   0x3e09  //模拟精增益
#define SC200AI_REG_SDIG_GAIN       0x3e10  //短帧的数字主增益
#define SC200AI_REG_SDIG_FINE_GAIN  0x3e11  //短帧的数组精增益
#define SC200AI_REG_SANA_GAIN       0x3e12  //短帧的模拟主增益
#define SC200AI_REG_SANA_FINE_GAIN  0x3e13  //短帧的模拟精增益
#define SC200AI_GAIN_MIN            0x0040  //增益最⼩值
#define SC200AI_GAIN_MAX            (54 * 32 * 64)       //53.975*31.75*64 增益最⼤值
#define SC200AI_GAIN_STEP           1   //增益步进
#define SC200AI_GAIN_DEFAULT        0x0800  //默认增益值
#define SC200AI_LGAIN               0   //⻓帧增益
#define SC200AI_SGAIN               1   //短帧增益
```

HDR kann getrennte Verstärkungen für lange/kurze Bilder benötigen. Die Quelle nennt beide SC200AI_LGAIN und SC200AI_LGAIN; die doppelte Kennung bleibt bis zur Prüfung erhalten.

##### 3.1.2.5 Group hold

Group Hold synchronisiert CMOS-Updates von Belichtung (shutter), Verstärkung und weiteren Parametern. Während eines Bildes müssen analoge/digitale Verstärkung und Zeilenbelichtung konsistent bleiben, sonst entstehen Streifen, ungleichmäßige Helligkeit oder teilweise Über-/Unterbelichtung. Registeränderungen wirken gewöhnlich erst an der nächsten Bild-/Zeilengrenze. Änderungen während der Aufnahme können Teile mit alten und neuen Werten erzeugen. Group Hold friert den Update-Zeitpunkt ein und aktiviert alle Änderungen gemeinsam zu einem festgelegten Zeitpunkt.

```text
#define SC200AI_REG_GROUP_HOLD      0x3812 //group hold 控制寄存器
#define SC200AI_GROUP_HOLD_START    0x00  //开启Group Hold（冻结参数更新）即：Group Hold Start
#define SC200AI_GROUP_HOLD_END      0x30  //关闭Group Hold（释放参数更新)即：Group Hold End
```

##### 3.1.2.6 Test pattern

Ein Testmusterregister aktiviert einen CMOS-/CCD-Modus mit intern erzeugten Mustern statt optischer Aufnahmen. Das synthetische Bild dient Test, Fehlersuche und Verifikation. Typisch sind Farbbalken, Verläufe, Schachbrett, Rot/Grün/Blau/Schwarz/Weiß-Flächen, Raster und Fixed Pattern Noise (FPN).

###### 3.1.2.6.1 Anwendungen von Testmustern

1. Sensorprüfung/Fehlersuche. Testmuster prüfen schnell Datenausgabe, MIPI CSI-2/Datenpfad, Auflösung und RAW-/RGB-/YUV-Format sowie ISP-/nachgelagerten Empfang und Verarbeitung. Nach dem ersten Einschalten lässt sich der Sensor beispielsweise ohne Objektiv oder Lichtquelle prüfen.

Erscheinen nach Aktivierung Farbbalken oder Verläufe auf Display/Debug-Werkzeug, funktionieren Sensor und Datenpfad grundsätzlich.

2. ISP-Fehlersuche und Algorithmusprüfung. Demosaic, 3A, Gamma, CSC, Sharpening und weitere Blöcke, Verarbeitung verschiedener Eingaben sowie Farbwiedergabe, Helligkeit, Kontrast und Rauschunterdrückung prüfen. Bekannte steuerbare Eingaben eignen sich für quantitative Analyse und Abstimmung. Eine rote Fläche sollte rot bleiben und zeigt Weißabgleich-/Farbkorrekturprobleme; Verläufe prüfen Gamma, Dynamikbereich und Tone Mapping.

3. Kameramodul-Fehlersuche/Kalibrierung. Bei Fertigung/Kalibrierung den Pfad Objektivmodul + Sensor + ISP prüfen, AF-/AE-/AWB-Tests simulieren und Grundfunktionen ohne reale Beleuchtung prüfen.

4. Fehlereingrenzung. Bei Farbstich, Bildfehlern, Streifen oder ganz schwarzem/weißem Bild das Muster aktivieren. Ein normales Muster deutet auf Optik (schmutziges Objektiv/kein Licht) oder Szeneneingang; ein fehlerhaftes auf Sensor, MIPI, ISP oder Versorgung. So lassen sich optische von elektrischen/Datenverarbeitungsfehlern trennen.

5. Fertigungstest. Die Quelle nennt automatische Sensorausgabeprüfung, Prüfung toter/heißer Pixel und festen Rauschens sowie Datenintegrität, Farbgenauigkeit und Dynamikbereich.

###### 3.1.2.6.2 Übliche Testmustertypen

| Testmuster | Beschreibung | Verwendung |
| --- | --- | --- |
| Solid Color | Ganzes Bild rot/grün/blau/schwarz/weiß | Farbkanäle, defekte Pixel |
| Color Bars | TV-Farbbalken: Rot/Grün/Blau/Schwarz/Weiß-Kombinationen | Farbausgabe, ISP |
| Gradient | Glatter Schwarz-Weiß- oder RGB-Verlauf | Dynamikbereich, Gamma, Tone Mapping |
| Checkerboard | Schwarz-weiße Felder | Schärfe, Kantenverarbeitung, Kompression |
| Moving Pattern | Veränderliche Muster mancher Sensoren | Timing, Puffer, Latenz |
| Random / Noise Pattern | Simuliertes Rauschen | Rauschunterdrückung |
| Cross Hatch / Grid | Gekreuzte Linien | Geometrieverzerrung, Ausrichtung |

```text
#define SC200AI_REG_TEST_PATTERN        0x4501 //测试图案控制寄存器
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3) //测试图案开启掩码
```

##### 3.1.2.7 VTS

HTS und VTS sind zentrale Timingparameter von CMOS-Bildsensoren (CIS) und Kameramodulen. VTS bedeutet Vertical Total Time/Lines: gesamte Zeilen/Zeit eines Bildes einschließlich aktiver und Austastzeilen. Meist in Zeilen, anhand von Bildrate/VTS auch in Zeit (z. B. ms) umrechenbar. Bestandteile:

1. Active Lines: tatsächliche Bilddatenzeilen, etwa 1080 bei 1920x1080.

2. VSYNC (Vertikalsynchronisation)

3. Vertikale Austastung/vordere und hintere Schwarzschulter für Bildwechsel und interne Verarbeitung. VTS = aktive Zeilen + vertikale Austastzeilen. Zusammenhang mit Auflösung/Bildrate:

1. Bildratenberechnung (FPS). Grundformel:

`FPS = PCLK / (HTS × VTS)`

PCLK ist Pixel Clock, gewöhnlich in MHz oder Hz: übertragene Pixeltaktzyklen je Sekunde.

HTS ist die Gesamtzahl Takte je Zeile (Zeilendauer), VTS die Zeilenzahl je Bild. Gemeinsam bestimmen sie die Bildrate. FPS durch weniger VTS/Austastung oder höheren PCLK erhöhen. Für geringere FPS, etwa längere Belichtung bei wenig Licht, VTS erhöhen oder PCLK senken. Zentrale Unterschiede:

| Punkt | HTS (Horizontal Total) | VTS (Vertical Total) |
| --- | --- | --- |
| Richtung | Horizontal innerhalb einer Zeile | Vertikal innerhalb eines Bildes |
| Bedeutung | Zeilentakte: aktive Pixel + Austastung | Bildzeilen: aktiv + Austastung |
| Enthält | Aktive Pixel + HSYNC + horizontale Austastung | Aktive Zeilen + VSYNC + vertikale Austastung |
| Einfluss | Zeilenfrequenz, Datentiming | Bildrate, Bilddauer |
| Bildrate | FPS = PCLK / (HTS × VTS) | Mehr VTS senkt FPS; weniger erhöht FPS |
| Einheit | Taktzyklen/Pixeltakte | Zeilen |
| Konfiguration | Sensor-Zeilentimingregister | Sensor-Bildtimingregister |

```text
#define SC200AI_REG_VTS_H       0x320e
#define SC200AI_REG_VTS_L       0x320f
```

##### 3.1.2.8 Mirror / Flip

Mirror-/Flip-Register steuern die Sensorausgabeorientierung: geometrische Links/Rechts- oder Oben/Unten-Spiegelung.

1. Mirror vertauscht links und rechts entlang X wie ein Spiegel. Mirror/Horizontal Flip setzen, wenn horizontale Montage oder Objektivausrichtung das Bild umkehrt.

2. Flip vertauscht oben und unten entlang Y. Die Quelle vergleicht dies mit einer 180°-Drehung oder einem Blick von der Decke; die Analogie bleibt dokumentiert, reine vertikale Spiegelung ist jedoch keine 180°-Drehung. Sensorfunktion:

Flip/Vertical Flip aktiviert vertikale Spiegelung, typischerweise bei umgekehrter Montage oder zur Displayausrichtung. Kombinationen von Mirror/Flip:

| Einstellung | Effekt | Erscheinung |
| --- | --- | --- |
| Kein Mirror / Flip | Normal | Unverändert, normale Richtung (Standard) |
| Mirror | Links/rechts vertauscht | Wie ein Spiegel |
| Flip | Oben/unten vertauscht | Kopfüber stehendes Foto |
| Mirror + Flip | Beide Spiegelungen = 180°-Drehung | Alle Richtungen umgekehrt; 180° gedreht |

Die meisten CMOS-Sensoren, darunter Sony, OmniVision, SmartSens, GalaxyCore und Onsemi, konfigurieren Mirror/Flip über Register.

```text
#define SC200AI_FLIP_MIRROR_REG     0x3221 // 镜像翻转控制寄存器

#define SC200AI_FETCH_MIRROR(VAL, ENABLE)   (ENABLE ? VAL | 0x06 : VAL & 0xf9)//设置镜像
#define SC200AI_FETCH_FLIP(VAL, ENABLE)     (ENABLE ? VAL | 0x60 : VAL & 0x9f)//设置翻转
```

3. Spiegelung mit v4l2-ctl einstellen

```text
// /dev/v4l-subdev2节点对应 Sensor ⼦设备节点。参考5.4 章节
v4l2-ctl --set-ctrl=horizontal_flip=1 -d /dev/v4l-subdev2  # 启⽤⽔平镜像
v4l2-ctl --set-ctrl=horizontal_flip=0 -d /dev/v4l-subdev2  # 禁⽤⽔平镜像

v4l2-ctl --set-ctrl=vertical_flip=1 -d /dev/v4l-subdev2    # 启⽤垂直翻转
v4l2-ctl --set-ctrl=vertical_flip=0  -d /dev/v4l-subdev2   # 禁⽤垂直翻转

v4l2-ctl --set-ctrl=horizontal_flip=1 --set-ctrl=vertical_flip=1 -d /dev/v4l-subdev2
 # 同时启⽤镜像和翻转
v4l2-ctl --set-ctrl=horizontal_flip=0 --set-ctrl=vertical_flip=0  -d /dev/v4l-subdev2#
同时禁⽤镜像和翻转
```

### 3.2 Treiberframework

Der Sensor kommuniziert über I2C mit dem Host. Sein Treiber ist ein I2C-Gerätetreiber und verwendet V4L2 subdev zur Interaktion mit dem Host-Treiber.

#### 3.2.1 Datentypen

##### 3.2.1.1 struct i2c_driver

Beschreibung: I2C-Gerätetreiberinformationen. Definition:

```text
struct i2c_driver {
    ...

    /* Standard driver model interfaces */
    int (*probe)(struct i2c_client *client, const struct i2c_device_id *id);
    int (*remove)(struct i2c_client *client);
    ...
    struct device_driver driver;
    const struct i2c_device_id *id_table;
    ...
};
```

Wichtige Mitglieder:

| Mitglied | Datentyp | Beschreibung |
| --- | --- | --- |
| probe | int (*)(struct i2c_client *) | Geräteerkennung; wird aufgerufen, wenn Treiber und Gerät übereinstimmen |
| remove | void (*)(struct i2c_client *) | Bereinigung beim Entfernen des Geräts |
| driver | struct device_driver | Kerntreiberstruktur; .probe wird aufgerufen, wenn compatible in of_match_table mit compatible in der DTS-Datei übereinstimmt |
| id_table | const struct i2c_device_id * | Geräteabgleichstabelle; verwendet, wenn der Kernel nicht über of_match_table und DTS-registrierte Geräte abgleicht |

Beispiel:

```text
#if IS_ENABLED(CONFIG_OF)
static const struct of_device_id sc200ai_of_match[] = {
    { .compatible = "smartsens,sc200ai" },
    {},
};
MODULE_DEVICE_TABLE(of, sc200ai_of_match);
#endif

static const struct i2c_device_id sc200ai_match_id[] = {
    { "smartsens,sc200ai", 0 },
    { },
};

static struct i2c_driver sc200ai_i2c_driver = {
    .driver = {
        .name = SC200AI_NAME,
        .pm = &sc200ai_pm_ops,
        .of_match_table = of_match_ptr(sc200ai_of_match),
    },
    .probe      = &sc200ai_probe,
    .remove     = &sc200ai_remove,
    .id_table   = sc200ai_match_id,
};

static int __init sensor_mod_init(void)
{
    return i2c_add_driver(&sc200ai_i2c_driver);
}

static void __exit sensor_mod_exit(void)
{
    i2c_del_driver(&sc200ai_i2c_driver);
}
```

##### 3.2.1.2 struct v4l2_subdev_ops

Beschreibung: struct v4l2_subdev_ops ist die zentrale V4L2-Untergeräte-Operationsstruktur für Schnittstellen von Sensoren, ISPs und Decodern. Definition:

```text
struct v4l2_subdev_ops {
    const struct v4l2_subdev_core_ops   *core;
    const struct v4l2_subdev_video_ops  *video;
    const struct v4l2_subdev_pad_ops    *pad;
    ...
};
```

Wichtige Mitglieder:

| Mitgliedstyp | Struktur | Funktion | Hardware |
| --- | --- | --- | --- |
| Kernoperationen | const struct v4l2_subdev_core_ops *core | Grundsteuerung: Versorgung, Interrupts, Protokolle usw. | Alle Untergeräte |
| Videostreamsteuerung | const struct v4l2_subdev_video_ops *video | Streamparameter: Bildrate, Format, HDR usw. | Sensor/ISP/Encoder |
| Pad-Steuerung | const struct v4l2_subdev_pad_ops *pad | Pixelformat, Auflösung, Zuschnitt (entscheidend) | Sensor/ISP/MIPI-CSI-Empfänger |

Beispiel:

```text
static const struct v4l2_subdev_ops sc200ai_subdev_ops = {
    .core   = &sc200ai_core_ops,
    .video  = &sc200ai_video_ops,
    .pad    = &sc200ai_pad_ops,
};
```

##### 3.2.1.3 struct v4l2_subdev_core_ops

Beschreibung: Operationen für Kernsteuerfunktionen eines V4L2-Untergerätetreibers. Definition:

```text
struct v4l2_subdev_core_ops {
    ...
    long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
#ifdef CONFIG_COMPAT
    long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
                   unsigned long arg);
#endif
    int (*s_power)(struct v4l2_subdev *sd, int on);
    ...
};
```

Wichtige Mitglieder:

| Mitgliedsfunktion | Prototyp | Funktion | Typische RK-Sensor-Implementierung |
| --- | --- | --- | --- |
| s_power | int (*)(struct v4l2_subdev *sd, int on) | Versorgungszustand: Gerät ein-/ausschalten | PWDN-/RESET-Pegelfolgen und PMIC-Versorgungszeitfolge steuern: on=1 einschalten, on=0 ausschalten |
| compat_ioctl32 | long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd, unsigned long arg) |  | Private Funktionen für 32-Bit-Anwendungen auf einem 64-Bit-Kernel; Datenübertragung vom/zum Userspace behandeln |
| ioctl | int (*)(struct v4l2_subdev *sd, unsigned int cmd, void *arg) | Private benutzerdefinierte Befehle, keine Standard-V4L2-Befehle | Spezifische Funktionen implementieren und System-ioctl-Aufrufe beantworten |

Beispiel:

```text
static const struct v4l2_subdev_core_ops sc200ai_core_ops = {
    .s_power = sc200ai_s_power,
    .ioctl = sc200ai_ioctl,
#ifdef CONFIG_COMPAT
    .compat_ioctl32 = sc200ai_compat_ioctl32,
#endif
};c
```

Folgende private ioctl-Befehle fragen Modulinformationen ab und lesen/konfigurieren OTP-Informationen.

| Privater ioctl | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | Modulinformationen abfragen |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtung setzen |
| RKMODULE_SET_HDR_CFG | HDR-Modus setzen; normal/linear und HDR wechseln. Treiber muss beide Konfigurationen unterstützen |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen |
| RKMODULE_SET_CONVERSION_GAIN | Linearen Conversion Gain setzen, etwa imx347/os04a10; bei fehlender Sensorunterstützung optional |

##### 3.2.1.4 struct v4l2_subdev_video_ops

Beschreibung: Videogeräte-Steuerschnittstelle. Definition:

```text
struct v4l2_subdev_video_ops {
    ...
    int (*s_stream)(struct v4l2_subdev *sd, int enable);
    int (*g_frame_interval)(struct v4l2_subdev *sd,
                struct v4l2_subdev_frame_interval *interval);
    int (*s_frame_interval)(struct v4l2_subdev *sd,
                struct v4l2_subdev_frame_interval *interval);
    ...

};
```

Wichtige Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| .g_frame_interval | Callback für VIDIOC_SUBDEV_G_FRAME_INTERVAL ioctl |
| .s_stream | Zentrale Schnittstelle zum Video-Start/Stopp |
| .s_frame_interval | Sensorbildrate/-intervall dynamisch ändern; zentraler Anpassungscallback |

Beispiel:

```text
static const struct v4l2_subdev_video_ops sc200ai_video_ops = {
    .s_stream = sc200ai_s_stream,
    .g_frame_interval = sc200ai_g_frame_interval,
    .s_frame_interval = sc200ai_s_frame_interval,
};
```

##### 3.2.1.5 struct v4l2_subdev_pad_ops

Beschreibung: Rückrufe für Pixelformataushandlung, Zuschnitt, Skalierung und Bildlayout. In RK-Sensortreibern zentrale Schnittstelle zur Pipeline Sensor → ISP → Speicher. Definition:

```text
struct v4l2_subdev_pad_ops {
    ...
    int (*enum_mbus_code)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_mbus_code_enum *code);
    int (*enum_frame_size)(struct v4l2_subdev *sd,
                   struct v4l2_subdev_pad_config *cfg,
                   struct v4l2_subdev_frame_size_enum *fse);
    int (*enum_frame_interval)(struct v4l2_subdev *sd,
                   struct v4l2_subdev_pad_config *cfg,
                   struct v4l2_subdev_frame_interval_enum *fie);
    int (*get_fmt)(struct v4l2_subdev *sd,
               struct v4l2_subdev_pad_config *cfg,
               struct v4l2_subdev_format *format);
    int (*set_fmt)(struct v4l2_subdev *sd,
               struct v4l2_subdev_pad_config *cfg,
               struct v4l2_subdev_format *format);
    int (*get_selection)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_selection *sel);
    int (*set_selection)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_selection *sel);
    int (*get_edid)(struct v4l2_subdev *sd, struct v4l2_edid *edid);
    int (*set_edid)(struct v4l2_subdev *sd, struct v4l2_edid *edid);
    int (*dv_timings_cap)(struct v4l2_subdev *sd,
                  struct v4l2_dv_timings_cap *cap);
    int (*enum_dv_timings)(struct v4l2_subdev *sd,
                   struct v4l2_enum_dv_timings *timings);
    ...

    int (*get_mbus_config)(struct v4l2_subdev *sd, unsigned int pad,
                   struct v4l2_mbus_config *config);
    int (*set_mbus_config)(struct v4l2_subdev *sd, unsigned int pad,
                   struct v4l2_mbus_config *config);
};
```

Wichtige Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| enum_mbus_code | Medienbus-Pixelformate aufzählen; Sensor-RAW/YUV melden, z. B. MEDIA_BUS_FMT_SRGGB10_1X10. |
| get_fmt | Aktuelle Auflösung/Pixelformat, z. B. 1920x1080@SRGGB10. |
| set_fmt | Auflösung/Pixelformat setzen; wichtigste Funktion. Etwa 1920x1080 und NV12 konfigurieren; beeinflusst MIPI. |
| enum_frame_size | Auflösungen eines Pixelformats, etwa 640x480/1280x720 für UYVY. |
| enum_frame_interval | Bildraten für Format/Auflösung aufzählen; aktuelle Modusauflösungen/-raten melden. |
| get_selection | Zuschnitt-/Skalierregionen (Lese-/Schreibbereich, Ausgabegröße); Digitalzoom oder kleiner Stromsparbereich. |
| set_selection | Zuschnitt-/Skalierbereiche setzen;1080p-Vorschau verwenden. |
| get_edid/set_edid | EDID behandeln; HDMI-Empfänger, von Sensortreibern meist ignoriert. |
| dv_timings_cap | Unterstützte digitale Videotimingstandards; nur HDMITX/RX. |
| enum_dv_timings | Digitale Videotimings aufzählen; nur HDMITX/RX. |
| get_mbus_config | Medienbuskonfiguration, etwa MIPI D-PHY; Lane-Zahl V4L2_MBUS_CSI2_4LANE und Taktmodus V4L2_MBUS_CSI2_CONTINUOUS_CLOCK melden. |
| set_mbus_config | Buskonfiguration setzen; MIPI dynamisch ändern, z. B.2-lane/4-lane. |

Beispiel:

```text
static const struct v4l2_subdev_pad_ops sc200ai_pad_ops = {
    .enum_mbus_code = sc200ai_enum_mbus_code,
    .enum_frame_size = sc200ai_enum_frame_sizes,
    .enum_frame_interval = sc200ai_enum_frame_interval,
    .get_fmt = sc200ai_get_fmt,
    .set_fmt = sc200ai_set_fmt,
    .get_mbus_config = sc200ai_g_mbus_config,
};
```

##### 3.2.1.6 struct v4l2_ctrl_ops

Beschreibung: struct v4l2_ctrl_ops ist der Kernoperationssatz des V4L2-Steuerframeworks für dynamische Belichtung, Verstärkung, Weißabgleich und weitere Sensorparameter. Auf Rockchip standardisiert er Anwendungskonfigurationen und verbindet Userspace-Steuerung mit Hardwareregistern. Definition:

```text
struct v4l2_ctrl_ops {
    ...
    int (*s_ctrl)(struct v4l2_ctrl *ctrl);
};
```

Wichtige Mitglieder:

| Mitglied | Funktion | Typische Rockchip-Implementierung |
| --- | --- | --- |
| s_ctrl | Steuerwert setzen (wichtigste Funktion) | Userspace-Werte in Register schreiben, etwa Belichtung/Verstärkung |

Beispiel:

```text
static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    struct sc200ai *sc200ai = container_of(ctrl->handler,
                           struct sc200ai, ctrl_handler);
    struct i2c_client *client = sc200ai->client;

    ...

    if (!pm_runtime_get_if_in_use(&client->dev))
        return 0;

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE:
        dev_dbg(&client->dev, "set exposure value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_ANALOGUE_GAIN:
        dev_dbg(&client->dev, "set gain value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_VBLANK:
        dev_dbg(&client->dev, "set blank value 0x%x\n", ctrl->val);
        ...
        break;
    case V4L2_CID_TEST_PATTERN:
        ...
        break;
    case V4L2_CID_HFLIP:
        ...
        break;
    case V4L2_CID_VFLIP:
        ...
        break;
    default:
        dev_warn(&client->dev, "%s Unhandled id:0x%x, val:0x%x\n",
             __func__, ctrl->id, ctrl->val);
        break;
    }

    pm_runtime_put(&client->dev);

    return ret;
}

static const struct v4l2_ctrl_ops sc200ai_ctrl_ops = {
    .s_ctrl = sc200ai_set_ctrl,
};
```

#### 3.2.2 APIs

##### 3.2.2.1 xxxx_set_fmt

Beschreibung: Sensorausgabeformat setzen. Ein Treiber kann mehrere Auflösungen unterstützen; set_fmt übergibt die gewünschte, der Treiber sucht die beste Übereinstimmung. Linear/HDR wird über einen privaten ioctl-Befehl statt dieser Funktion umgeschaltet. Beide Modi müssen dieselbe Auflösung besitzen. Syntax:

```text
static int xxxx_set_fmt(struct v4l2_subdev *sd,
                        struct v4l2_subdev_pad_config *cfg,
                        struct v4l2_subdev_format *fmt)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *cfg | Zeiger auf subdev pad information | Eingabe |
| *fmt | Zeiger auf Pad-level media bus format | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.2 xxxx_get_fmt

Beschreibung: aktuelles Sensorausgabeformat abfragen. struct xxx_mode kann mehrere Auflösungen enthalten; Initialisierung oder set_fmt wählt eine aus. get_fmt bestätigt die aktuelle Konfiguration. Vor RK3588 meldet fmt-&gt;reserved[0] zusätzlich den virtuellen Kanal, der damit statt des Standardwerts angegeben werden kann. RK3588 und neuer verwenden ioctl RKMODULE_GET_CHANNEL_INFO. Syntax:

```text
static int xxxx_get_fmt(struct v4l2_subdev *sd,
                        struct v4l2_subdev_pad_config *cfg,
                        struct v4l2_subdev_format *fmt)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *cfg | Zeiger auf subdev pad information | Eingabe |
| *fmt | Zeiger auf Pad-level media bus format | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.3 xxxx_enum_mbus_code

Beschreibung: Sensorausgabe-Busformate aufzählen. Eine statische struct xxx_mode-Variable enthält unterstützte Auflösungen; die Funktion liefert deren Busformat als Aufzählungswert. Syntax:

```text
static int xxxx_enum_m bus_code(struct v4l2_subdev *sd,
                                struct v4l2_subdev_pad_config *cfg,
                                struct v4l2_subdev_mbus_code_enum *code)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *cfg | Zeiger auf subdev pad information | Eingabe |
| *code | Zeiger auf media bus format enumeration | Ausgabe c (Quellenschreibweise) |

Rückgabewerte:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *cfg | Zeiger auf subdev pad information | Eingabe |
| *code | Zeiger auf media bus format enumeration | Ausgabe |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.4 xxxx_enum_frame_sizes

Beschreibung: Sensorausgabegrößen aufzählen. Eine statische struct xxx_mode-Variable enthält unterstützte Auflösungen; die Funktion liefert die entsprechenden Aufzählungswerte. Syntax:

```text
static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                                struct v4l2_subdev_pad_config *cfg,
                                struct v4l2_subdev_frame_size_enum *fse)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *cfg | Zeiger auf subdev pad information | Eingabe |
| *fse | Zeiger auf media bus frame size | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.5 xxxx_g_frame_interval

Beschreibung: Sensorausgabe-Bildintervall abfragen. Die statische struct xxx_mode-Konfiguration nennt die maximale Bildrate. Der Treiber senkt sie durch erhöhtes vblank. Für die tatsächliche Rate Standard- und aktuelles vblank umrechnen und das aktualisierte Intervall an die Anwendung liefern. Syntax:

```text
static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                struct v4l2_subdev_frame_interval *fi)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| *fi | Zeiger auf pad-level frame rate | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

##### 3.2.2.6 xxxx_s_stream

Beschreibung: Stream-Ein-/Ausgabe konfigurieren. on wählt start_stream oder stop_stream. start_stream programmiert das Initialisierungsregisterarray, initialisiert Belichtungsparameter und startet den Datenstrom; stop_stream schreibt Stream-Off-Register. Syntax:

```text
static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Zeiger auf v4l2-subdev-Struktur | Eingabe |
| on | 1: Stream starten; 0: stoppen | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

##### 3.2.2.7 xxxx_runtime_resume

Beschreibung: Sensor-Einschaltcallback. So können andere Treiberteile oder übergeordnete Treiber den Sensor mit pm_runtime_get_sync einschalten. Syntax:

```text
static int xxxx_runtime_resume(struct device *dev)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Zeiger auf device-Struktur | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

##### 3.2.2.8 xxxx_runtime_suspend

Beschreibung: Sensor-Ausschaltcallback. Andere Treiberteile oder übergeordnete Treiber schalten über pm_runtime_put aus. Syntax:

```text
static int xxxx_runtime_suspend(struct device *dev)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Zeiger auf device-Struktur | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

##### 3.2.2.9 xxxx_set_ctrl

Beschreibung: V4L2-Steuerwerte setzen. Diesen Callback für Steuerbefehle registrieren; Anwendungsänderungen konfigurieren darüber den Sensor. Controls nach Abschnitt 3.2.1.6, struct v4l2_ctrl_ops, implementieren. Syntax:

```text
static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *ctrl | Zeiger auf v4l2_ctrl-Struktur | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

##### 3.2.2.10 xxx_enum_frame_interval

Beschreibung: unterstützte Bildintervalle der Auflösungen aus der statischen struct xxx_mode-Variable aufzählen. Meist begrenzter Nutzen; die eigentliche Bildratenanpassung erfolgt weiterhin über vblank. Syntax:

```text
static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                                    struct v4l2_subdev_pad_config *cfg,
                                    struct v4l2_subdev_frame_interval_enum *fie)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Untergeräteinstanz | Eingabe |
| *cfg | Pad-Konfiguration | Eingabe |
| *fie | Bildintervallparameter | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.11 xxxx_g_mbus_config

Beschreibung: Buskonfiguration abfragen. Busse umfassen parallel, MIPI und LVDS; parallel BT601/BT656/BT1120, MIPI DPHY/CPHY. Der Controller bestimmt anhand aktueller Sensorbusparameter den Aufnahmemodus. Bei mehreren MIPI-Modi die Parameter des aktiven Modus melden. Syntax:

```text
static int xxxx_g_m bus_config(struct v4l2_subdev *sd,
                                struct v4l2_m bus_config *config)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *config | Buskonfiguration | Ausgabe c (Quellenschreibweise) |

Rückgabewerte:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *config | Buskonfiguration | Ausgabe |

##### 3.2.2.12 xxxx_get_selection

Beschreibung: Zuschnitt konfigurieren. ISP-Eingangsbreite muss auf 16, Höhe auf 8 ausgerichtet sein. Nicht ausgerichtete oder nicht standardmäßige Sensorausgaben vor dem ISP mit dieser Funktion zuschneiden. Syntax:

```text
static int xxxx_get_selection(struct v4l2_subdev *sd,
                             struct v4l2_subdev_pad_config *cfg,
                             struct v4l2_subdev_selection *sel)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Untergeräteinstanz | Eingabe |
| *cfg | Pad-Konfiguration | Eingabe |
| *sel | Zuschnittparameter | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Hinweis: Kernel 6.1 ersetzt struct v4l2_subdev_pad_config *cfg durch struct v4l2_subdev_state *sd_state.

##### 3.2.2.13 xxxx_ioctl

Beschreibung: private ioctl-Befehle implementieren. Syntax:

```text
static long xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *sd | Untergeräteinstanz | Eingabe |
| cmd | Privater Befehlswert (Quelle: Namenswert) | Eingabe |
| * arg | Übergebene Parameter | Ein-/Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 |  |

### 3.3 Ablauf der Treiberportierung

#### 3.3.1 Standard-I2C-Untergerätetreiber

1. Diese struct i2c_driver-Mitglieder implementieren: struct driver.name, struct driver.pm, struct driver.of_match_table, probe und remove. Unterschiedliche Rückgabewerte zwischen Kernel 5.10 und 6.1 beachten.

2. probe: CIS-Ressourcen vor allem aus DTS ermitteln. Private RK-Ressourcen heißen rockchip,camera-module-xxx und werden an Userspace-camera_engine zur Auswahl passender IQ-Parameter übergeben. RK-Referenztreiber definieren gewöhnlich folgende CIS-Ressourcen:

| Mitglied | Beschreibung |
| --- | --- |
| CIS reference clock | Bei unabhängigem Quarz keine Ressource nötig. RK-Referenzdesigns verwenden meist AP-Ausgangstakt xvclk, der angefordert werden muss. |
| CIS control GPIO | Beispielsweise Resst (Quellenschreibweise) und Powerdown. |
| CIS power resources | Zur Hardware passende Software-Versorgungsressourcen anfordern, etwa gpio/regulator. |

Nach der Ressourcenabfrage wird das Lesen der CIS-ID zur Hardwareprüfung empfohlen, ist aber optional. CIS-V4L2-Gerät und Media-Entity initialisieren. Für das Untergerät v4l2_i2c_subdev_init verwenden. RK benötigt einen eigenen subdev-Geräteknoten für rk_aiq-Belichtungssteuerung. Media-Entity mit media_entity_init initialisieren.

#### 3.3.2 V4L2-Untergerätetreiber

Im Wesentlichen diese drei Mitglieder implementieren:

```text
struct v4l2_subdev_core_ops
struct v4l2_subdev_video_ops
struct v4l2_subdev_pad_ops
```

1. Callbacks gemäß struct v4l2_subdev_core_ops implementieren. s_power schaltet ein/aus. Bei langen Registerarrays gemeinsame Register nach dem Einschalten schreiben; s_stream setzt nur auflösungsspezifische Register für schnelleres Umschalten. Außerdem .compat_ioctl32 und .ioctl implementieren; ioctl stellt private RK-Steuerung bereit:

| Mitglied | Beschreibung |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | DTS-Modulinformationen wie Name zur Zuordnung an camera_engine übergeben. |
| RKMODULE_AWB_CFG | Bei aktivem OTP übergibt camera_engine typische AWB-Kalibrierung. CIS vergleicht aktuelle Modulkalibrierung und berechnet R/B Gain für MWB. |
| RKMODULE_LSC_CFG | Bei OTP aktiviert camera_engine die LSC-Kalibrierungsanwendung. |
| PREISP_CMD_SET_HDRAE_EXP | HDR-Belichtung |
| RKMODULE_SET_HDR_CFG | HDR/normal umschalten; Treiber unterstützt beide Konfigurationen. |
| RKMODULE_GET_HDR_CFG | Aktuellen HDR-Modus abfragen |
| RKMODULE_SET_CONVERSION_GAIN | Linearen Conversion Gain setzen, etwa imx347/os04a10. Hoher Conversion Gain verbessert Schwachlicht-SNR. Ohne Unterstützung optional. |
| RKMODULE_SET_QUICK_STREAM | Stream-On/Off-Register für Fehlerreset, synchronen Mehrkamerastart (siehe Mechanismus), Schnellstart und AOV setzen. |
| RKMODULE_GET_CHANNEL_INFO | Kanalinformationen abfragen. Standard vicap id0–id3 entspricht vc0–vc3; für SPD/EBD anpassbar. Vor RK3588 weiterhin get_fmt. |
| RKMODULE_GET_SYNC_MODE, RKMODULE_SET_SYNC_MODE | Synchronisationsmodus lesen/setzen; siehe Mehrkamera-Synchronisation. |

2. Nach struct v4l2_subdev_core_ops (Quellenverweis) folgende Callbacks implementieren:

| Mitglied | Beschreibung |
| --- | --- |
| .s_stream | Stream starten/stoppen. Bei kontinuierlichem MIPI CLK hier starten; früherer Start verhindert MIPI-LP-Erkennung. |
| .g_frame_interval | Bildintervall/-rate abfragen |
| .g_mbus_config | Buskonfiguration abfragen. Bei mehreren Lane-Zahlen/HDR MIPI-Werte des aktiven Modus melden. |

3. Nach struct v4l2_subdev_pad_ops folgende Callbacks implementieren:

| Mitglied | Beschreibung |
| --- | --- |
| .enum_mbus_code | Formate aufzählen; siehe xxxx_enum_mbus_code. |
| .enum_frame_size | Auflösungen aufzählen; siehe xxxx_enum_frame_sizes. |
| .get_fmt | Erforderlich: RKISP liest CIS-Format. MEDIA_BUS_FMT für Bayer raw/SoC YUV/BW raw, struct v4l2_mbus_framefmt für Field-Ausgabe; xxxx_get_fmt. |
| .set_fmt | Erforderlich: CIS-Format/Auflösung setzen; xxxx_set_fmt. |
| .enum_frame_interval | Bildintervalle einschließlich Auflösung aufzählen; xxx_enum_frame_interval. |
| .get_selection | Zuschnitt: ISP-Breite auf16, Höhe auf8 ausrichten; xxxx_get_selection. |

4. Nach struct v4l2_ctrl_ops folgende Callbacks implementieren:

| Mitglied | Beschreibung |
| --- | --- |
| .s_ctrl | RKISP-Treiber und camera_engine steuern CIS-Belichtung mit verschiedenen Befehlen. |

Folgende IDs liefern Informationen und werden als standard integer menu controls implementiert:

| Mitglied | Beschreibung |
| --- | --- |
| V4L2_CID_LINK_FREQ | Standarddefinition in CIS-V4L2-Controls; RKISP ermittelt damit MIPI-Frequenz. |
| V4L2_CID_PIXEL_RATE | MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_HBLANK | Siehe CIS-V4L2-Controls-Standarddefinition. |
| V4L2_CID_VBLANK | Siehe CIS-V4L2-Controls-Standarddefinition. |

RK camera_engine erhält über diese Befehle Informationen für die Belichtungsberechnung. Formeln:

line_time = HTS / PIXEL_RATE;

```text
PIXEL_RATE = HTS * VTS * FPS
```

HTS = sensor_width_out + HBLANK;

```text
VTS = sensor_height_out + VBLANK;
```

Über folgende Steuer-IDs konfiguriert RK camera_engine den CIS:

| Mitglied | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | VBLANK und damit Bildrate/maximale Belichtungszeit ändern. |
| V4L2_CID_EXPOSURE | Belichtungszeit in Belichtungszeilen. |
| V4L2_CID_ANALOGUE_GAIN | Belichtungsverstärkung; tatsächlich total gain = analog gain*digital gain, in Registereinheiten. |
| V4L2_CID_HFLIP | Horizontal spiegeln; ISP besitzt keine Spiegelung, Sensor verwenden. |
| V4L2_CID_VFLIP | Vertikal spiegeln; ISP besitzt keine Spiegelung, Sensor verwenden. |
| V4L2_CID_TEST_PATTERN | Optionales Testmuster zur Fehlersuche nach Bedarf. |

5. HDR-Anforderungen. Linear verwenden Belichtung/Verstärkung Standard-V4L2-Controls. HDR übergibt Parameter über PREISP_CMD_SET_HDRAE_EXP; V4L2_CID_EXPOSURE und V4L2_CID_ANALOGUE_GAIN werden nicht verwendet. Der private Befehl muss Parameter zwischenspeichern. Nach dem Initialisierungsarray in start_stream die Anfangsbelichtung erneut schreiben, um Standardwerte zu überschreiben; so passt das erste Bild zur Belichtung und AE konvergiert schnell. Stream-Enable-Register nicht ins Array aufnehmen, sondern vor Rückkehr von start_stream setzen. HDR-Sensoren müssen RKMODULE_SET_HDR_CFG/RKMODULE_GET_HDR_CFG für HDR/LINEAR-Austausch und Moduswechsel implementieren.

### 3.4 Makefile ändern

Neuen Sensor in kernel/drivers/media/i2c/Makefile zur Kompilierung hinzufügen. SC200AI-Beispiel:

```text
......
obj-$(CONFIG_VIDEO_SC200AI) += sc200ai.o
......
```

Einträge nach Hersteller gruppieren und Sensornamen alphabetisch sortieren.

### 3.5 Kconfig ändern

Konfiguration und Beschreibung des neuen Sensors in kernel/drivers/media/i2c/Kconfig hinzufügen. SC200AI-Beispiel:

```text
config VIDEO_SC200AI
    tristate "SmartSens SC200AI sensor support"
    depends on I2C && VIDEO_V4L2
    select MEDIA_CONTROLLER
    select VIDEO_V4L2_SUBDEV_API
    select V4L2_FWNODE
    help
      This is a Video4Linux2 sensor driver for the SmartSens
      SC200AI camera.
```

Einträge nach Hersteller gruppieren und Sensornamen alphabetisch sortieren.

## 4. Schnellstart

### 4.1 Konzept

Sensor-Schnellstart minimiert Einschalten, Initialisierung und Zeit bis zum gültigen Bild für schnellen Start, geringe Latenz und Echtzeit. Embedded-, Verbraucher-, Fahrzeug- und Industrieanwendungen benötigen sofortige Aufnahme, Ausgabe in &lt;100ms/300ms, schnelles Aufwachen, Mehrkamera-Umschaltung/Synchronstart oder Echtzeitkommunikation/Überwachung. Herkömmlicher Start kann Hunderte Millisekunden oder über eine Sekunde dauern, einschließlich:

1. Einschalten

2. Interne PLL-/Taktstabilisierung

3. Registerinitialisierung

4. Stabilisierung analoger Schaltungen

5. Aufbau des Zeilen-/Bildtimings

6. Erstes gültiges Bild. Schnellstart optimiert interne Abläufe, überspringt unnötige Initialisierung oder konfiguriert wichtige Register vorab. Vergleich typischer Startzeiten:

| Startmodus | Typische Zeit bis Bild | Anwendung |
| --- | --- | --- |
| Normal Boot | 300ms ~ 1000ms | Ohne strenge Startzeitforderung |
| Fast Boot | 10ms ~ 200ms | Schnelle Aufnahme, Echtzeitvorschau, geringe Latenz |
| Low-power Wakeup aus Standby | 10ms ~ 50ms | Schnelle Energiespar-Rückkehr, besser mit Fast Boot |

RK RV1103, RV1103B/RV1106B, RV1126B und verwandte Hosts besitzen einen leistungsfähigen RISC-V-MCU-Kern. Teile von ISP-AE/AWB laufen dort und unterstützen ARM-Kamera-/ISP-Initialisierung und schnelle Konvergenz. Während Linux startet, konvergiert der MCU parallel AE und bestimmt Tag-/Nachtmodus. Bei Registrierung des Kernel-ISP-Treibers verwendet der Sensor MCU-Belichtung und Bildparameter für ein erstes gültiges, weitgehend konvergiertes Bild. Grundablauf:

![Technische Abbildung aus chinesischer Quelle](/docs/rockchip-camera-driver/assets/cn-p039-figure-01.png)

MCU-gestützte schnelle Bildkonvergenz:

![Technische Abbildung aus chinesischer Quelle](/docs/rockchip-camera-driver/assets/cn-p039-figure-02.png)

Stream-Ausgabe in der ARM-Phase:

![Technische Abbildung aus chinesischer Quelle](/docs/rockchip-camera-driver/assets/cn-p039-figure-03.png)

### 4.2 Treiberänderungen

#### 4.2.1 Kerneltreiber

1. Diese beiden Header einbinden:

```text
#include "../platform/rockchip/isp/rkisp_tb_helper.h"
#include "cam-tb-setup.h"
```

2. is_thunderboot zur Sensorstruktur hinzufügen, um Schnellstart zu kennzeichnen.

```text
struct sc200ai {
    ......
    bool            is_thunderboot;
    ......
};
```

In probe CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP prüfen. Ist es im Kernel aktiviert, ist is_thunderboot true.

```text
sc200ai->is_thunderboot = IS_ENABLED(CONFIG_VIDEO_ROCKCHIP_THUNDER_BOOT_ISP);
```

3. Stream-Start/Stopp-Schnittstellen

```text
static int __sc200ai_start_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    ......
    if (!sc200ai->is_thunderboot) { //⾮快启，写⼊完整寄存器配置
        ret = sc200ai_write_array(sc200ai->client, sc200ai->cur_mode->reg_list);
        if (ret)
            return ret;
        ......
    }

    if (sc200ai->sync_mode == NO_SYNC_MODE)//否则，配置起流
        ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                     SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
    return ret;
}

static int __sc200ai_stop_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    sc200ai->has_init_exp = false;

    if (sc200ai->is_thunderboot) {
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
    ......

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
    return ret;
}
```

#### 4.2.2 MCU-Treiber

Siehe Kameratreiber-Portierung.

### 4.3 MCU-Schnellstart konfigurieren

#### 4.3.1 Treiberframework

Die folgenden Abschnitte zeigen RK-MCU-Sensortreiberentwicklung anhand von SmartSens SC450AI.

##### 4.3.1.1 Datentypen

###### 4.3.1.1.1 struct rk_camera_ops

Beschreibung: struct rk_camera_ops definiert Kamerageräte-Operationen. Definition:

```text
struct rk_camera_ops {
    ret_err_t (*init)(struct rk_camera_device *dev);  // 初始化相机设备
    ret_err_t (*open)(struct rk_camera_device *dev, rt_uint16_t oflag);  // 打开相机设备
    ret_err_t (*close)(struct rk_camera_device *dev);  // 关闭相机设备
    ret_err_t (*control)(struct rk_camera_device *dev, int cmd, void *args);  // 控制相机设备
};
```

Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| init | Gerät initialisieren |
| open | Gerät öffnen |
| close | Gerät schließen |
| control | Gerät steuern |

Beispiel:

```text
struct rk_camera_ops rk_sc450ai_ops =
{
    rk_sc450ai_init,
    rk_sc450ai_open,
    NULL,
    rk_sc450ai_control
};
```

###### 4.3.1.1.2 struct xxx_mode

Beschreibung: Informationen unterstützter Sensormodi; Mitglieder nach Bedarf ergänzen. Definition:

```text
struct xxxx_mode
{
    struct v4l2_fract max_fps;
    uint16_t bus_fmt;
    uint16_t width;
    uint16_t height;
    uint16_t hts_def;
    uint16_t vts_def;
    uint16_t exp_def;
    uint32_t xvclk;
    uint32_t link_freq;
#ifndef REG_LIST_CONVERSION_DEBUG
    const uint8_t *reg_list;
#else
    const struct sc450ai_sensor_reg *reg_list;
#endif
    const int reg_list_size;
    uint8_t hdr_mode;
} __attribute__((__packed__));
```

Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| .max_fps | Bildrate: denominator/numerator = fps |
| .bus_fmt | Sensorausgabeformat |
| .width | Aktive Breite; muss aktueller Sensorausgabe entsprechen. |
| .height | Aktive Höhe; muss aktueller Sensorausgabe entsprechen. |
| .hts_def | Standard-HTS = aktive Breite + HBLANK |
| .vts_def | Standard-VTS = aktive Höhe + VBLANK |
| .exp_def | Standardbelichtungszeit |
| .xvclk | Externer Sensortakt/MCLK |
| .link_freq | MIPI_DPHY-Abtastfrequenz in MHz, halbe MIPI-Rate |
| *reg_list | Registerliste |
| .reg_list_size | Registerarraygröße |
| .hdr_mode | Linearer, Zwei-/Drei-Bild-HDR-Modus |

Beispiel:

```text
static const struct sc450ai_mode supported_modes_4lane[] =
{
    {
        .bus_fmt = MEDIA_BUS_FMT_SBGGR10_1X10,
        .width = 1344,
        .height = 760,
        .max_fps = {
            .numerator = 10000,
            .denominator = 1200000,
        },
        .exp_def = 0x80,
        .hts_def = 0x03a8,
        .vts_def = 0x030c,
        .xvclk = 27000000,
        .link_freq = 360000000,
        .reg_list = g_sc450ai_1344x760_4lane_120fps_reg_table,
        .reg_list_size = ARRAY_SIZE(g_sc450ai_1344x760_4lane_120fps_reg_table),
        .hdr_mode = NO_HDR,
    },
    {/* */}，
}
```

###### 4.3.1.1.3 struct xxx_dev

Beschreibung: zentrale Kameragerätestruktur mit Konfiguration, Status und Funktionszeigern. In rk_xxx_init konfiguriert. Definition:

```text
struct xxx_dev
{
    struct rk_camera_device parent;
    char name[RK_CAMERA_DEVICE_NAME_SIZE];
    uint8_t time_valid_delay;
    uint8_t gain_valid_delay;
    char i2c_name[RK_CAMERA_I2C_NAME_SIZE];
    struct rt_i2c_bus_device *i2c_bus;
    uint8_t i2c_addr;
    uint8_t flip;
    struct rt_mutex mutex_lock;
    struct rk_camera_exp_val init_exp;
    uint8_t modes_num;
    const struct sc450ai_mode *supported_modes;
    const struct sc450ai_mode *cur_mode;
    const struct sc450ai_mode *pdst_mode;
    struct sc450ai_mode dst_mode;
    bool has_init_exp;
    bool streaming;
};
```

Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| parent | Kamera-Elterngerät |
| name[RK_CAMERA_DEVICE_NAME_SIZE] | Kameraname |
| time_valid_delay | Belichtungszeit wirkt in Bild N + time_valid_delay |
| gain_valid_delay | Verstärkung wirkt in Bild N + gain_valid_delay |
| i2c_name[RK_CAMERA_I2C_NAME_SIZE] | I2C-Busname |
| *i2c_bus | I2C-Busgerät |
| i2c_addr | I2C-Adresse |
| flip | Flip-/Mirror-Einstellung |
| mutex_lock | Mutex |
| init_exp | Anfangsbelichtung |
| modes_num | Zahl Initialisierungskonfigurationen |
| *supported_modes | Modusliste entsprechend Lane-Zahl //todo (Quelle) |
| *cur_mode | Aktuelle Modusparameter |
| *dst_mode | Zielmodusparameter |
| has_init_exp | Anfangsbelichtung gesetzt? |
| streaming | Stream aktiv? |

##### 4.3.1.2 APIs

###### 4.3.1.2.1 rk_xxx_control

Beschreibung: allgemeine Schnittstelle für Gerätesteuerbefehle von Anwendungen/ISP. Syntax:

```text
ret_err_t rk_sc450ai_control(struct rk_camera_device *dev,
                             dt_cmd_t cmd,
                             void *args);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| cmd | Kamerasteuerbefehl | Eingabe |
| *args | Befehlsargumente | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

Beispiel:

```text
ret_err_t rk_sc450ai_control(struct rk_camera_device *dev,
                             dt_cmd_t cmd,
                             void *args)
{
    ...
    switch (cmd)
    {
    case RK_DEVICE_CTRL_DEVICE_INIT:
    {
        ret = rk_sc450ai_init(dev);
    }
    break;
    ...
    default:
        sc450ai_dbg("exit CMD %d\n", cmd);
        break;
    }

    return ret;
}
```

###### 4.3.1.2.2 rk_xxx_init

Beschreibung: Controller fragt Kamerabusparameter ab, um den Aufnahmemodus festzulegen. Syntax:

```text
ret_err_t rk_xxx_init(struct rk_camera_device *dev);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.3 xxx_stream_on

Beschreibung: Kamera-Initialisierungsregister programmieren; RT_USING_CAM_STREAM_ON_LATE bestimmt frühe Stream-Aktivierung. Syntax:

```text
static void xxx_stream_on(struct xxx_dev *dev);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.4 xxx_stream_off

Beschreibung: Kamerastream stoppen. Syntax:

```text
static void xxx_stream_off(struct xxx_dev *dev);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.5 rk_xxx_get_expinf

Beschreibung: Belichtungsinformationen abfragen. Syntax:

```text
static ret_err_t rk_xxx_get_expinf(struct xxx_dev *dev, struct rk_camera_exp_info *exp);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| *exp | Kamerabelichtungsparameter | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.6 rk_xxx_set_expval

Beschreibung: Belichtungszeit und Verstärkung setzen. Syntax:

```text
static ret_err_t rk_xxx_set_expval(struct xxx_dev *dev, struct rk_camera_exp_val *exp);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| *exp | Kamerabelichtungsparameter | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.7 rk_xxx_set_vts

Beschreibung: Kamera-VTS setzen. Syntax:

```text
static ret_err_t rk_xxx_set_vts(struct xxx_dev *dev, uint32_t dst_vts);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| dst_vts | Ziel-VTS | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.8 rk_xxx_get_intput_fmt

Beschreibung: aktuelles Kameraausgabeformat abfragen. struct xxx_mode kann mehrere Auflösungen enthalten, eine wird initial ausgewählt. Nach set_intput_fmt bestätigt get_intput_fmt das aktive Format. Syntax:

```text
static ret_err_t rk_xxx_get_intput_fmt(struct xxx_dev *dev, struct rk_camera_mbus_framefmt
*mbus_fmt);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| *mbus_fmt | Kameraausgabeformat | Ausgabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.9 rk_xxx_set_intput_fmt

Beschreibung: Kameraausgabeformat und Controller-Aufnahmeparameter setzen. Syntax:

```text
static ret_err_t rk_xxx_set_intput_fmt(struct xxx_dev *dev, struct rk_camera_mbus_framefmt
*mbus_fmt);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| *mbus_fmt | Kameraausgabeformat | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.10 rk_xxx_match_dst_config

Beschreibung: supported_modes nach Zielauflösung/-format durchsuchen. Bei reduzierter Bildrate Ziel-VTS anpassen. Syntax:

```text
static ret_err_t rk_xxx_match_dst_config(struct xxx_dev *dev, struct rk_camera_dst_config
*dst_config);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| *dst_config | Zielausgabeformat | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.11 rk_xxx_set_flip_mirror

Beschreibung: Kamera-Flip/Mirror setzen. Syntax:

```text
static ret_err_t rk_xxx_set_flip_mirror(struct xxx_dev *dev, uint32_t flip)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| flip | 0: keines; 1: nur Flip; 2: nur Mirror; 3: beide | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.12 xxx_stream_on_late

Beschreibung: Anfangsbelichtung, Mirror und Flip setzen und Kamerastream starten. Syntax:

```text
static void xxx_stream_on_late(struct xxx_dev *dev);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.13 xxx_quick_stream

Beschreibung: Kamerastream ein-/ausschalten. Syntax:

```text
static void xxx_quick_stream(struct xxx_dev *dev, int on);
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |
| on | 1: Stream starten; 0: stoppen | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

###### 4.3.1.2.14 rk_camera_xxx_init

Beschreibung: Sensor-I2C-Gerät gemäß Einschaltfolge im Datenblatt registrieren. Syntax:

```text
int rk_xxx_check_sensor_id(struct xxx_dev *dev)
```

Parameter:

| Parameter | Beschreibung | Richtung |
| --- | --- | --- |
| *dev | Kameragerätedeskriptor | Eingabe |

Rückgabewerte:

| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Nicht 0 | Fehler |

#### 4.3.2 Kameratreiber portieren

Neuen Treiber auf ähnlich spezifiziertem Sensor in rt-thread/bsp/rockchip/camera/ oder ähnlichem Modell desselben Herstellers aufbauen.

##### 4.3.2.1 Build-Optionen ergänzen

Folgende Ergänzungen in rt-thread/bsp/rockchip/common/drivers/Kconfig vornehmen.

```text
@@ -506,6 +506,8 @@ menu "supported camera"
        bool "Enable GC2053"
    config RT_USING_F37
        bool "Enable F37"
    config RT_USING_SC230AI
        bool "Enable SC230AI"
+   config RT_USING_SC450AI
+       bool "Enable SC450AI"
    config RT_USING_SC850SL
        bool "Enable SC850SL"
```

##### 4.3.2.2 Registersequenz konvertieren

MCU-Schnellstarttreiber initialisieren über kontinuierliche I2C-Schreibvorgänge. Herstellersequenzen sind gewöhnlich nicht kontinuierlich und müssen per Skript ins Treiberformat konvertiert werden.

###### 4.3.2.2.1 Konvertierungsschritte

1. Initialisierungssequenz nach &lt;sdk&gt;/sysdrv/source/mcu/project/scripts/camera_reg_convert/reg.txt formatieren.

2. Inhalt von &lt;sdk&gt;/sysdrv/source/mcu/project/scripts/camera_reg_convert/reg.txt durch die Sequenz ersetzen.

3. Mit diesem Befehl konvertieren:

```text
cd <sdk>/sysdrv/source/mcu/project/scripts/camera_reg_convert/
python2 reg_conver.py
```

4. Entsprechende Treiberregistersequenz durch das Ergebnis ersetzen. Beispiel:

```text
/*
 * Xclk 27Mhz
 * max_framerate 30fps
 * mipi_datarate per lane 720Mbps, 4lane
 * full resolution
 */
static const uint8_t g_sc450ai_2688x1520_4lane_30fps_reg_table[] =
{
    0x3, 0x01, 0x00, 0x00,
    0x3, 0x36, 0xe9, 0x80,
    0x3, 0x36, 0xf9, 0x80,
    0x3, 0x30, 0x1c, 0x78,
    0x3, 0x30, 0x1f, 0x01,
    0x3, 0x30, 0x2e, 0x00,
    0xa, 0x32, 0x08, 0x0a, 0x80, 0x05, 0xf0, 0x02, 0xee, 0x06, 0x18,
    0x4, 0x32, 0x14, 0x11, 0x11,
    0x8,
};
```

Kontinuierliches Format: Spalte 1 ist I2C-DATA-Bytezahl je Schreibvorgang, 2–3 Registeradresse, 4–n aufeinanderfolgende Registerwerte. Letzte Zeile: Gesamtzahl I2C-Schreibvorgänge. Stream nicht in der Sequenz aktivieren, sondern separat in xxx_stream_on_late.

##### 4.3.2.3 Grundfunktionen

Alle rk_camera_ops-Funktionen einschließlich sämtlicher Controls in rk_xxx_control sowie rk_camera_xxx_init implementieren.

#### 4.3.3 MCU-Boardkonfiguration

##### 4.3.3.1 CIS (CMOS image sensor) registrieren

###### 4.3.3.1.1 struct gpio_desc

Definition:

```text
struct gpio_desc
{
    uint32_t gpio_pin;
    struct GPIO_REG *gpio_group;
};
```

###### 4.3.3.1.2 camera_board_desc

Beschreibung: boardhardwarebezogene Sensorkonfiguration. Definition:

```text
struct camera_board_desc
{
    struct gpio_desc rst_gpio;
    struct gpio_desc pwdn_gpio;
    struct gpio_desc pwren_gpio;
    eCLOCK_Name mclk_id;
    uint32_t mclk_out_gate_id;
    char isp_subdev_name[RK_CAMERA_DEVICE_NAME_SIZE];
    char i2c_bus[RK_CAMERA_I2C_NAME_SIZE];
    uint8_t i2c_addr;
    uint8_t time_valid_delay;
    uint8_t gain_valid_delay;
    uint8_t mode_id;
    uint32_t width;
    uint32_t height;
    uint32_t pixelcode;
    uint32_t maxfps;
    uint32_t lanes;
    uint32_t hdr_mode;
    uint32_t dst_width;
    uint32_t dst_height;
    uint32_t dst_pixelcode;
    uint32_t dst_maxfps;
    uint32_t dst_hdr_mode;
    bool rst_active;
    bool pwdn_active;
    bool pwren_active;
};
```

Mitglieder:

| Mitglied | Beschreibung |
| --- | --- |
| rst_gpio | Hardware-Reset-Pin gemäß gpio_desc |
| pwdn_gpio | Stromspar-Pin gemäß gpio_desc |
| pwren_gpio | Einschalt-Pin gemäß gpio_desc |
| mclk_id | 0 wählt mclk0; 1 mclk1 |
| isp_subdev_name | ISP-Hauptsensor: RK_ISP_MAIN_SUBDEV_NAME; Assistenz: RK_ISP_ASSIST_SUBDEV_NAME |
| i2c_bus | Sensor-I2C-Bus wählen |
| i2c_addr | 7-Bit-Sensor-I2C-Adresse |
| time_valid_delay | Bilder bis Belichtungszeit wirkt |
| gain_valid_delay | Bilder bis Verstärkung wirkt |
| mode_id | Sensorauflösung gemäß camera.h |
| width | MCU-Kleinbildbreite |
| height | MCU-Kleinbildhöhe |
| pixelcode | MCU-Kleinbildformat |
| maxfps | Maximale FPS aller Kleinbild-Initialisierungskonfigurationen |
| lanes | Sensor-Lane-Zahl |
| hdr_mode | Kleinbild-HDR (NO_HDR: 0 HDR_X2: 5 HDR_X3: 6) |
| dst_width | MCU-Großbildbreite |
| dst_height | MCU-Großbildhöhe |
| dst_pixelcode | MCU-Großbildformat |
| dst_maxfps | Maximale FPS aller Großbild-Initialisierungskonfigurationen |
| dst_hdr_mode | Großbild-HDR (NO_HDR: 0 HDR_X2: 5 HDR_X3: 6) |
| rst_active | Aktiver Hardware-Reset-Pegel |
| pwdn_active | Aktiver Stromspar-Pegel |
| pwren_active | Aktiver Einschaltpegel |

###### 4.3.3.1.3 cif_hw_config

data_lanes: Sensor-Lane-Anzahl. Verbindungen Sensor/csi_dphy/csi_host:

| Hauptkamera–DPHY-Verdrahtung | dphy1.enable | dphy2.enable | csi_host_0.enable | csi_host_1.enable |
| --- | --- | --- | --- | --- |
| lane0 &lt; - &gt; MIPI_CSI_RX_D0N/P | 1 | 0 | 1 | 0 |
| lane1 &lt; - &gt; MIPI_CSI_RX_D1N/P | 1 | 0 | 1 | 0 |
| lane2 &lt; - &gt; MIPI_CSI_RX_D2N/P | 0 | 1 | 0 | 1 |
| lane3 &lt; - &gt; MIPI_CSI_RX_D3N/P | 0 | 1 | 0 | 1 |

###### 4.3.3.1.4 Einzelkamera registrieren

Beispiel:

```text
const struct camera_board_desc camera_sc450ai =
{
    .i2c_addr = 0x30,
    .rst_gpio =
    {
        .gpio_pin = GPIO_PIN_A7,
        .gpio_group = GPIO4,
    },
    .pwdn_gpio =
    {
        .gpio_pin = GPIO_PIN_A2,
        .gpio_group = GPIO4,
    },
    .time_valid_delay = 2,
    .gain_valid_delay = 2,
    .width = 1344,
    .height = 760,
    .maxfps = 120,
    .lanes = 4,
    .pixelcode = MEDIA_BUS_FMT_SBGGR10_1X10,
    .hdr_mode = NO_HDR,
    .dst_width = 2688,
    .dst_height = 1520,
    .dst_maxfps = 60,
    .dst_pixelcode = MEDIA_BUS_FMT_SBGGR10_1X10,
    .dst_hdr_mode = NO_HDR,
    .isp_subdev_name = RK_ISP_MAIN_SUBDEV_NAME,
    .i2c_bus = "i2c3",
    .rst_active = 0,
    .pwdn_active = 1,
    .mclk_id = CLK_MIPI0_OUT2IO,
    .mclk_out_gate_id = CLK_MIPI0_OUT2IO_GATE,
};
void cif_hw_config(void)
{
    struct dphy_board_desc *csi2_dphy = (struct dphy_board_desc *)&csi2_dphy_board;
    struct csi2_board_desc *csi_host_0 = (struct csi2_board_desc *)&csi2_host0_board;
    struct vicap_board_desc *vicap = (struct vicap_board_desc *)&vicap_board;
    csi2_dphy->enable = true;
    csi2_dphy->csi2_dphy1.enable = true;
    csi2_dphy->csi2_dphy1.csi_host_idx = 0;
    csi2_dphy->csi2_dphy1.isp_subdev_name = RK_ISP_MAIN_SUBDEV_NAME;

    csi_host_0->enable = true;

    vicap->enable = true;
}
```

#### 4.3.4 Boardkonfiguration ergänzen

1. camera_board_desc und cif_hw_config in bsp/rockchip/xxx_mcu/board/xxx/board.c implementieren; siehe CIS-Registrierung.

2. Peripherie-IOMUX in bsp/rockchip/xxx_mcu/board/xxx/iomux.c gemäß Schaltplan ergänzen.

## 5. Neue Funktionen

### 5.1 AOV

AOV (Always On Video) verwendet Schlaf-/Aufwachzyklen für durchgehende 24-Stunden-Aufzeichnung mit niedriger Bildrate. KI-, PIR- oder WLAN-Ereignisse können zur normalen Rate zurückschalten.

#### 5.1.1 Szenarien

Drei Szenarien: normale Bildrate für Fernvorschau, PIR oder Personenerkennung mit Aufnahme/Netzwerk; AOV bei Leerlauf und ausreichendem Akku mit niedrigfrequenter Hauptstream-Aufzeichnung und WLAN-/4G-Keepalive; energiesparendes Keepalive bei niedrigem Akku, SoC aus und WLAN/4G aktiv.

![Technische Abbildung aus chinesischer Quelle](/docs/rockchip-camera-driver/assets/cn-p059-figure-01.png)

#### 5.1.2 Ablauf

![Technische Abbildung aus chinesischer Quelle](/docs/rockchip-camera-driver/assets/cn-p059-figure-02.png)

#### 5.1.3 Begriffe

AOV nutzt Sensor-Standby als Schlaf oder Reset zur Verbrauchssenkung. Schlaf stoppt Bilddaten, reduziert Leistung und erhält Register. SC200AI bietet zwei Wege:

1. PWDN auf Low ziehen; I2C-Lesen/Schreiben ist nicht verfügbar.

2. 0 ins Stream-Steuerregister schreiben; I2C bleibt verfügbar. Reset stoppt Bilddaten, senkt Verbrauch und setzt alle Register zurück. Zwei SC200AI-Resetwege:

1. XSHUTDN auf Low ziehen; I2C ist nicht verfügbar.

2. 1 ins Software-Reset-Enable-Register schreiben; Reset dauert 150ns.

##### 5.1.3.1 Hardware-Standby

Hardware-Standby zieht PWDN auf Low für stromsparenden Schlaf; I2C ist nicht nutzbar. Für SC200AI rockchip,camera-module-stb = &lt;1&gt; im DTS-Sensorknoten ergänzen. 1 bedeutet Unterstützung, 0 keine Unterstützung.

```text
sc200ai: sc200ai@30 {
    compatible = "smartsens,sc200ai";
    status = "okay";
    reg = <0x30>;
    ...
    rockchip,camera-module-stb = <1>;
    port {
        sc200ai_out: endpoint {
            remote-endpoint = <&csi_dphy_input1>;
            data-lanes = <1 2>;
        };
    };
};
```

Eigenschaft in probe auswerten und in sc200ai-&gt;standby_hw speichern. Bei Unterstützung steuert ioctl RKMODULE_SET_QUICK_STREAM PWDN GPIO gemäß Streamzustand. Schlaf/Aufwachen setzt Belichtung/Verstärkung per V4L2 ioctl neu. Treiberreferenz:

Die Quelle verweist auf „4.2.4 Treiberimplementierung“, Hardware-Standby-Beispiel.

##### 5.1.3.2 Software-Standby

Nach dem Aufwachen schreibt Software-Standby die gesamte Sensorregisterkonfiguration neu. Sensor-ioctl RKMODULE_SET_QUICK_STREAM setzt anschließend direkt das Streamregister. Quellenverweis: „4.2.4 Treiberimplementierung“, Software-Standby-Beispiel.

#### 5.1.4 Treiberimplementierung

Hardware-Standby-Referenzcode:

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    switch (cmd) {
    case RKMODULE_SET_QUICK_STREAM:
            stream = *((u32 *)arg);

            if (sc200ai->standby_hw) { // hardware standby
                if (stream) {
                    if (!IS_ERR(sc200ai->pwdn_gpio))
                        gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                    // Make sure __v4l2_ctrl_handler_setup can be called correctly
                    sc200ai->is_standby = false;
                    ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                    #if IS_REACHABLE(CONFIG_VIDEO_CAM_SLEEP_WAKEUP)
                    if (__v4l2_ctrl_handler_setup(&sc200ai->ctrl_handler))
                        dev_err(&sc200ai->client->dev, "__v4l2_ctrl_handler_setup fail!");
                    if (sc200ai->cur_mode->hdr_mode != NO_HDR) {
                        if (sc200ai->cam_sw_inf) {
                            ret = sc200ai_ioctl(&sc200ai->subdev,
                                        PREISP_CMD_SET_HDRAE_EXP,
                                        &sc200ai->cam_sw_inf->hdr_ae);
                            if (ret) {
                                dev_err(&sc200ai->client->dev,
                                    "init exp fail in hdr mode\n");
                                return ret;
                            }
                        }
                    }
                    #endif

                    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                    dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit hw
standby mode\n");
                } else {
                    ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                        SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                    if (!IS_ERR(sc200ai->pwdn_gpio))
                        gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                    dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter hw
standby mode\n");
                    sc200ai->is_standby = true;
                }
            }
        ......
}
```

Software-Standby-Referenzimplementierung:

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    switch (cmd) {
    case RKMODULE_SET_QUICK_STREAM:
            stream = *((u32 *)arg);
            ......
            else {  // software standby
            if (stream) {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft
standby mode\n");
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);
                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft
standby mode\n");
            }
        }

        break;
        ......
    }
```

#### 5.1.5 Referenzen

Für AOV-Entwicklung siehe Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf und Rockchip_RV1106_Developer_Guide_Linux_AOV_CN.pdf.

### 5.2 Synchronisation (Master/Slave)

Ein einzelner Sensor arbeitet meist einfach als Master. Zwei oder mehr Sensoren mit synchroner Ausgabe/Belichtung benötigen eine Moduskonfiguration, gewöhnlich Master/Slave. Folgende Anwendungen erfordern gleichzeitige Belichtung/Ausgabe mit strenger zeitlicher Ausrichtung:

| Mitglied | Beschreibung |
| --- | --- |
| 3D / binocular / stereo vision | Synchronisation zwingend, sonst falsche Tiefe. |
| Multicamera stitching / panorama | Bildsynchronisation für genaue Ausrichtung. |
| Machine vision / industrial inspection | Synchrone Abtastung mehrerer Blickwinkel. |
| Autonomous driving / ADAS | Zeitliche Synchronisation entscheidend. |
| Video conferencing / multiple cameras | Strenge Synchronisation meist unnötig, verbessert aber Nutzung. |

Üblich ist ein globales FSYNC/EFSYNC/TRIGGER/SYNC_IN-Signal. Der Host-SoC löst Belichtung/Auslesen aller Sensoren gleichzeitig aus und richtet die Bildströme zeitlich aus.

#### 5.2.1 Sensor-Slave-Modus

Im Slave-Modus steuert ein externer MCU/SoC/DSP Kommunikation, Timing und Übertragung durch Takt, Synchronisation und I2C/MIPI. Der Sensor reagiert, statt selbst zu initiieren. Bei mehreren Sensoren sendet SoC/FPGA FSYNC gleichzeitig an alle; Belichtung oder Bildauslesen beginnen gemeinsam für gleiche Zeitstempel und synchronen Inhalt.

| Mitglied | Beschreibung |
| --- | --- |
| FSYNC (Frame SYNC) | Bildsync-Eingang: externes Digitalsignal, meist GPIO/CMOS, startet Belichtung/Auslesen mehrerer Sensoren gemeinsam. |
| EFSYNC (External Frame SYNC) | Externer Bildsync, Herstellerbezeichnung variiert. Wie FSYNC: Host sendet, alle Slaves reagieren synchron. |
| TRIGGER / SYNC_IN / STROBE | Alternative Sensornamen für externe Trigger-Synchronisationseingänge. |

RK konfiguriert aktuell einen Master und die übrigen Sensoren als Slaves. Nach Abschluss des Masterbildes startet externes FSYNC/EFSYNC Belichtung/Auslesen der Slaves gleichzeitig zur zeitlichen Ausrichtung.

#### 5.2.2 Treiberimplementierung

1. Master-/Slave-Register aus Datenblatt oder vom Hersteller-FAE beschaffen.

```text
/* sync mode regs */
static __maybe_unused const struct regval sc200ai_interal_sync_master_start_regs[] = {
    {0x300a, 0x24}, //sync as output PAD
    {0x3032, 0xa0},
    {0x3222, 0x00}, //master mode
    {0x3216, 0x00},
    {0x3217, 0x04},
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_master_stop_regs[] = {
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_slaver_start_regs[] = {
    {0x3222, 0x02}, //slave mode
    {0x3230, 0x00},
    {0x3231, 0x04}, //Rows Before Read
    {0x3224, 0x82}, //fsync trigger
    {REG_NULL, 0x00},
};

static __maybe_unused const struct regval sc200ai_interal_sync_slaver_stop_regs[] = {
    {REG_NULL, 0x00},
};
```

2. Synchronisationsmodusvariablen ergänzen

```text
struct sc200ai {
    ......
    enum rkmodule_sync_mode sync_mode;
    ......
};
```

Übliche Synchronisationsmodusdefinitionen:

```text
/*
 * sensor exposure sync mode
 */
enum rkmodule_sync_mode {
    NO_SYNC_MODE = 0,
    EXTERNAL_MASTER_MODE,
    INTERNAL_MASTER_MODE,
    SLAVE_MODE,
    SOFT_SYNC_MODE,
};
```

Synchronisationseigenschaften im DTS-Sensorknoten auswerten, um den aktiven Modus zu bestimmen.

```text
static int sc200ai_probe(struct i2c_client *client,
             const struct i2c_device_id *id)
    ......
    ret = of_property_read_string(node, RKMODULE_CAMERA_SYNC_MODE,
                      &sync_mode_name);
    if (ret) {
        sc200ai->sync_mode = NO_SYNC_MODE;
        dev_err(dev, "could not get sync mode!\n");
    } else {
        if (strcmp(sync_mode_name, RKMODULE_EXTERNAL_MASTER_MODE) == 0) {
            sc200ai->sync_mode = EXTERNAL_MASTER_MODE;
            dev_info(dev, "sync_mode = [EXTERNAL_MASTER_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_INTERNAL_MASTER_MODE) == 0) {
            sc200ai->sync_mode = INTERNAL_MASTER_MODE;
            dev_info(dev, "sync_mode = [INTERNAL_MASTER_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_SLAVE_MODE) == 0) {
            sc200ai->sync_mode = SLAVE_MODE;
            dev_info(dev, "sync_mode = [SLAVE_MODE]\n");
        } else if (strcmp(sync_mode_name, RKMODULE_SOFT_SYNC_MODE) == 0) {
            sc200ai->sync_mode = SOFT_SYNC_MODE;
            dev_info(dev, "sync_mode = [SOFT_SYNC_MODE]\n");
        } else {
            dev_info(dev, "sync_mode = [NO_SYNC_MODE]\n");
        }
    }
    ......
```

Zugehörige Makros:

```text
#define RKMODULE_CAMERA_SYNC_MODE       "rockchip,camera-module-sync-mode"
#define RKMODULE_INTERNAL_MASTER_MODE   "internal_master"
#define RKMODULE_EXTERNAL_MASTER_MODE   "external_master"
#define RKMODULE_SLAVE_MODE             "slave"
#define RKMODULE_SOFT_SYNC_MODE         "soft_sync"
```

3. Beim Streamstart Register passend zum Synchronisationsmodus programmieren.

```text
static int __sc200ai_start_stream(struct sc200ai *sc200ai)
{
    int ret = 0;
    ......
    if (!sc200ai->is_thunderboot) {
        ret = sc200ai_write_array(sc200ai->client, sc200ai->cur_mode->reg_list);
        if (ret)
            return ret;

        ......

        if (sc200ai->sync_mode == INTERNAL_MASTER_MODE ||
            sc200ai->sync_mode == SOFT_SYNC_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_master_start_regs);
        } else if (sc200ai->sync_mode == EXTERNAL_MASTER_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_slaver_start_regs);
        } else if (sc200ai->sync_mode == SLAVE_MODE) {
            ret |= sc200ai_write_array(sc200ai->client,
                           sc200ai_interal_sync_slaver_start_regs);
        }
        if (ret) {
            dev_err(&sc200ai->client->dev,
                "write sync regs failed\n");
            return ret;
        }
    }

    if (sc200ai->sync_mode == NO_SYNC_MODE)
        ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                     SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
    return ret;
}
```

4. Synchronisationsmodus in RKAIQ setzen/abfragen. Ohne DTS-Konfiguration können RKAIQ-Schnittstellen Mehrkamera-Synchronisation über ioctl setzen.

```text
static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
{
    ......
    case RKMODULE_GET_SYNC_MODE:
        sync_mode = (u32 *)arg;
        *sync_mode = sc200ai->sync_mode;
        break;
    case RKMODULE_SET_SYNC_MODE:
        sync_mode = (u32 *)arg;
        if (sync_mode) {
            sc200ai->sync_mode = *sync_mode;
            dev_info(&sc200ai->client->dev, "set sync mode is: %s\n",
                 ((*sync_mode == EXTERNAL_MASTER_MODE) ||
                  (*sync_mode == SLAVE_MODE)) ? "secondary" : "primary");
        } else {
            dev_info(&sc200ai->client->dev, "set sync mode is: NO_SYNC_MODE\n");
        }
        break;
    ......
}
```

### 5.3 Blitzsteuerung

Der Sensortreiber kann PWM-/GPIO-Blitze steuern. Zugehörige Parameter für Ein-/Ausschalten aus der Anwendung korrekt konfigurieren.

#### 5.3.1 Treiberimplementierung

1. Header

```text
#include "light_ctl.h"
```

2. Steuervariablen ergänzen

```text
struct xxxx {
    ......
    bool                    enable_light_ctl;
    struct rk_light_param   light_param;
    ......
}；
```

3. ioctl RKCIS_CMD_FLASH_LIGHT_CTRL behandeln

```text
static long xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
    ......
    struct rk_light_param *light_param;
    ......
    case RKCIS_CMD_FLASH_LIGHT_CTRL:
        dev_info(&mis5001->client->dev, "set flash light param\n");
        light_param = (struct rk_light_param *)arg;
        if (light_param->light_enable) {
            memcpy(&mis5001->light_param, light_param, sizeof(struct rk_light_param));
            mis5001->enable_light_ctl = true;
        } else {
            mis5001->enable_light_ctl = false;
        }
        ret = light_ctl_write(mis5001->module_index, light_param);
        break;

    ......
};

static long xxxx_compat_ioctl32(struct v4l2_subdev *sd,
                   unsigned int cmd, unsigned long arg)
{
        ......
        struct rk_light_param *light_param;
        ......
        switch (cmd) {
        ......
        case RKCIS_CMD_FLASH_LIGHT_CTRL:
            light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
            if (!light_param) {
                ret = -ENOMEM;
                return ret;
            }

            ret = copy_from_user(light_param, up, sizeof(*light_param));
            if (!ret)
                ret = mis5001_ioctl(sd, cmd, light_param);
            else
                ret = -EFAULT;
            kfree(light_param);
            break;
        }
        .....
}
```

#### 5.3.2 Referenzen

Implementierungsdetails in Abschnitt 7.2 zur Zusatzlichtsteuerung in Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf.

### 5.4 Auflösung wechseln

Anwendungen können je nach Szenario unterschiedliche Auflösungen verwenden. Der Treiber schaltet auf Befehl der oberen Ebene um.

#### 5.4.1 Treiberimplementierung

Referenzcode:

```text
static int sc200ai_set_setting(struct sc200ai *sc200ai, struct rk_sensor_setting *setting)
{
    int i = 0;
    int cur_fps = 0;
    s64 h_blank, vblank_def;
    u64 pixel_rate = 0;
    const struct sc200ai_mode *mode = NULL;
    const struct sc200ai_mode *match = NULL;

    dev_info(&sc200ai->client->dev,
        "sensor setting: %d x %d, fps:%d fmt:%d, mode:%d\n",
        setting->width, setting->height,
        setting->fps, setting->fmt, setting->mode);

    for (i = 0; i < ARRAY_SIZE(supported_modes); i++) {
        mode = &supported_modes[i];
        if (mode->width == setting->width &&
            mode->height == setting->height &&
            mode->hdr_mode == setting->mode &&
            mode->bus_fmt == setting->fmt) {
            cur_fps = DIV_ROUND_CLOSEST(mode->max_fps.denominator, mode->max_fps.numerator);
            if (cur_fps == setting->fps) {
                match = mode;
                break;
            }
        }
    }

    if (match) {
        dev_info(&sc200ai->client->dev, "-----%s: match the support mode, mode idx:%d-----
\n",
            __func__, i);
        sc200ai->cur_mode = mode;

        h_blank = mode->hts_def - mode->width;
        __v4l2_ctrl_modify_range(sc200ai->hblank, h_blank,
                     h_blank, 1, h_blank);
        vblank_def = mode->vts_def - mode->height;
        __v4l2_ctrl_modify_range(sc200ai->vblank, vblank_def,
                     SC200AI_VTS_MAX - mode->height,
                     1, vblank_def);
        __v4l2_ctrl_s_ctrl(sc200ai->link_freq, mode->mipi_freq_idx);
        pixel_rate = (u32)link_freq_menu_items[mode->mipi_freq_idx] /
                 mode->bpp * 2 * SC200AI_LANES;
        __v4l2_ctrl_s_ctrl_int64(sc200ai->pixel_rate, pixel_rate);
        dev_info(&sc200ai->client->dev, "freq_idx:%d pixel_rate:%lld\n",
            mode->mipi_freq_idx, pixel_rate);
        sc200ai->cur_vts = mode->vts_def;
        sc200ai->cur_fps = mode->max_fps;

        dev_info(&sc200ai->client->dev, "hts_def:%d cur_vts:%d cur_fps:%d\n",
            mode->hts_def, mode->vts_def,
            sc200ai->cur_fps.denominator / sc200ai->cur_fps.numerator);
    } else {
        dev_err(&sc200ai->client->dev, "couldn't match the support modes\n");
        return -EINVAL;
    }

    return 0;
}

static long sc200ai_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
    ......
    struct rk_sensor_setting *setting;
    ......

    switch (cmd) {
    ......
    case RKCIS_CMD_SELECT_SETTING:
        setting = (struct rk_sensor_setting *)arg;
        ret = sc200ai_set_setting(sc200ai, setting);
        break;

    ......
    }
}
```

### 5.5 Mehrere Lane-Konfigurationen unterstützen

Host-Plattform, Sensoranzahl, Leistung und Verkabelung können Sequenzen für unterschiedliche Lane-Zahlen erfordern. Der Treiber unterstützt dies.

#### 5.5.1 Treiberimplementierung

Referenzcode:

```text
// 4 Lane 寄存器配置⽀持列表
static const struct sc450ai_mode supported_modes_4lane[] = {
    {
        ...
    },
    {
        ...
    },
};
// 2 Lane 寄存器配置⽀持列表
static const struct sc450ai_mode supported_modes_2lane[] = {
    {
        ...
    },
    {
        ...
    },
}
static int sc450ai_probe(struct i2c_client *client,
             const struct i2c_device_id *id)
{
    struct device_node *node = dev->of_node;
    struct device_node *endpoint;
    ......
    endpoint = of_graph_get_next_endpoint(dev->of_node, NULL);
    if (!endpoint) {
        dev_err(dev, "Failed to get endpoint\n");
        return -EINVAL;
    }
    ret = v4l2_fwnode_endpoint_parse(of_fwnode_handle(endpoint),
        &sc450ai->bus_cfg);
    of_node_put(endpoint);
    if (ret) {
        dev_err(dev, "Failed to get bus config\n");
        return -EINVAL;
    }

    // 根据dts配置的lane数选择不同的寄存器⽀持列表数组
    if (sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes == 4) {
        sc450ai->supported_modes = supported_modes_4lane;
        sc450ai->cfg_num = ARRAY_SIZE(supported_modes_4lane);
        dev_info(dev, "detect sc450ai lane: %d\n",
             sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes);
    } else {
        sc450ai->supported_modes = supported_modes_2lane;
        sc450ai->cfg_num = ARRAY_SIZE(supported_modes_2lane);
        dev_info(dev, "detect sc450ai lane: %d\n",
             sc450ai->bus_cfg.bus.mipi_csi2.num_data_lanes);
    }
    ......
}
```

Für 2Lane-/4Lane-supported_modes liest probe die DTS-Lane-Zahl nach bus_cfg.bus.mipi_csi2.num_data_lanes und initialisiert passende Modi und cfg_num-Anzahl.

### 5.6 Sonstiges

## 6. Fehleranalyse und Lösungen

### 6.1 Sensor nicht erkannt, probe-/I2C-Fehler

Die Quelle führt eine nicht erkannte Sensor-ID auf Einschaltanforderungen statt RKISP/RKCIF zurück. In dieser Reihenfolge prüfen:

1. Korrekte 7-Bit-I2C-Slave-ID statt 8-Bit-Wert.

2. MCLK-Ausgabe und korrekte Amplitude; meist 24Mhz, teils 27Mhz.

3. Einschaltfolge: avdd, dovdd, dvdd gemäß Datenblatt und korrekte PWDN-/RESET-GPIO-Konfiguration.

#### 6.1.1 MCLK/VDD nicht messbar

Treiber aktivieren MCLK/Versorgung gewöhnlich nur bei Bedarf; nach dem Boot sind sie aus. Für Messungen schlägt die Quelle vor, power_off() vorübergehend auszukommentieren. Oszilloskopbandbreite prüfen; mindestens 48M empfohlen.

1. MCLK nicht korrekt aktiviert: siehe drivers/media/i2c/ov5695.c.

2. GPIO von anderem Modul belegt: normalerweise im Kernelprotokoll gemeldet. Mit io lassen sich pin-ctrl-Register prüfen.

#### 6.1.2 Sensor-Einschaltfolge prüfen

Mit dem Oszilloskop Reihenfolge und Verzögerungen jeder Versorgung gemäß Datenblatt prüfen. Manche Sensoren wie ov5695 benötigen keine VDD-Reihenfolge und verwenden regulator_bulk. Andere wie ov2685.c benötigen einzeln geordnete avdd_regulator/dovdd_regulator. Nach tatsächlichen Anforderungen wählen.

### 6.2 Standardwerte exp_def, hts_def und vts_def

Wenn möglich Hersteller fragen. Andernfalls Register im Datenblatt und Initialisierungswerte in der Registerliste ermitteln. SC200AI-Beispiel:

```text
#define SC200AI_REG_VTS_H       0x320e
#define SC200AI_REG_VTS_L       0x320f
...
static const struct regval sc200ai_linear_10_1920x1080_30fps_regs[] = {
    ...
    //HTS=1100*2=2200
    {0x320c, 0x04},
    {0x320d, 0x4c},
    //VTS=1125
    {0x320e, 0x04},
    {0x320f, 0x65},
    ...
};

static const struct sc200ai_mode supported_modes[] = {
    {
        .width = 1920,
        .height = 1080,
        .max_fps = {
            .numerator = 10000,
            .denominator = 300000,
        },
        .exp_def = 0x0080,  // exp曝光默认值，⼀般应⼩于vts默认值，最⼤vts_def - 8 (曝光⾏，具体减去
多少，参考 Sensor ⼿册，可能4/8/10)
        .hts_def = 0x44C * 2,// hts默认值填写对应寄存器列表中给出的默认值(可乘倍数)
        .vts_def = 0x0465,  // vts默认值填对应寄存器列表中给出的默认值
        ...
    },
    ...
};
```

### 6.3 Werte für link_freq und pixel_rate

link_freq ist die tatsächliche MIPI-Taktfrequenz, nicht 24M-MCLK, sondern MIPI dn/dp clk. Hersteller-/Datenblattangaben bevorzugen. Der tatsächliche Wert ist gewöhnlich nicht kleiner als folgendes Ergebnis in Hz:

```text
link_freq = width * height * fps * bits_per_pixel / lanes / 2
```

Unbekanntes link_freq mit dem Oszilloskop messen. pixel_rate sind übertragene Pixel je Sekunde; nach Ermittlung von link_freq wie folgt berechnen:

```text
pclk = link_freq * 2 * lanes / bits_per_pixel
```

### 6.4 Wann funktioniert ein Sensor?

Zuerst Sensor-ID und I2C-Lesen/Schreiben prüfen. media-ctl -p -d /dev/media0 sollte Name, Auflösung und weitere Angaben zeigen:

```text
# media-ctl -p -d /dev/media0 | tail -n 30
                -> "rkcif_tools_id2":0 []
        pad11: Source
                -> "stream_cif_mipi_id0":0 []
                -> "stream_cif_mipi_id1":0 []
                -> "stream_cif_mipi_id2":0 []
                -> "stream_cif_mipi_id3":0 []
                -> "rkcif_scale_ch0":0 []
                -> "rkcif_scale_ch1":0 []
                -> "rkcif_scale_ch2":0 []
                -> "rkcif_scale_ch3":0 []
                -> "rkcif_tools_id0":0 []
                -> "rkcif_tools_id1":0 []
                -> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
        pad0: Sink
                [fmt:SBGGR10_1X10/1920x1080@10000/300000 field:none]
                <- "m00_b_sc200ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc200ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/1920x1080@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

Fehlen media-ctl/v4l2-ctl im System, Sensorerkennung per dmesg prüfen. Bei Aufnahme muss MIPI Daten ohne MIPI-/ISP-Fehler liefern und die Anwendung Bilder empfangen.

### 6.5 Stream mit CRC-/ECC-Fehlern

#### 6.5.1 Fehlerquelle und Protokolldetails

In dmesg/Kernelprotokollen gezielt ERR1, ERR2, CRC, ECC, mipi, csi2 und phy suchen. Rockchip-CSI-/PHY-Treiber protokollieren gewöhnlich Registerzustände. ERR1-/ERR2-Fehlercodes und VC-Nummern (Virtual Channel) notieren. Typisches Protokoll:

```text
[  126.741234] rockchip-mipi-csi2 feaa0000.csi2-dphy: ERR1: 0x00000040 (ECC Error,
VC1), FIFO overflow? Check timings!
[  126.741259] rockchip-mipi-csi2 feaa0000.csi2-dphy: ERR2: 0x00000010 (CRC Error,
VC0)
```

Fehlertypen: ERR1 (CSIS_ERR1) meist Protokollfehler wie ECC, Bildformat oder Paketheaderprüfung. ERR2 (CSIS_ERR2) meist Transportfehler: FIFO-Überlauf, Timeout, Synchroncode. CRC Error: falsche Prüfsumme/Bitfehler. ECC Error: fehlgeschlagene Header-Fehlererkennung/-korrektur, meist schwerwiegender und physikalisch bedingt. Overflow: Empfangs-FIFO-Überlauf, meist Timingabweichung.

#### 6.5.2 Softwarekonfiguration (Treiber/DTS)

Sensortiming abgleichen: HTS (Total Width) und VTS (Total Height) müssen zur SoC-CSI2-DPHY-Empfangskonfiguration passen. Abweichungen können ERR2 Overflow verursachen. Prüfen mit:

```text
media-ctl -p -d /dev/mediaX  # 查看 Entity 之间的链路和当前格式
v4l2-ctl -d /dev/v4l-subdevY --get-fmt-video # 查看 Sensor 输出格式
v4l2-ctl -d /dev/v4l-subdevZ --get-fmt-video # 查看 CSI-DPHY 输⼊格式
```

MIPI-Ausgaberate innerhalb des SoC-CSI-DPHY-Maximums halten; die Quelle nennt etwa 2.5Gbps/lane für RK3566/RK3588. Sensor-VC (etwa 0/1) muss zu csi2_dphy/rkcif_mipi_lvds in DTS passen; die Quelle verbindet Abweichungen mit CRC-Fehlern. csi2_dphy-Knoten prüfen:

```text
csi2_dphy_hw: csi2-dphy@fedc0000 {
    compatible = "rockchip,rk3588-csi2-dphy-hw";
    clocks = ...; // 时钟配置必须正确
    resets = ...;
    rockchip,hw = <&csi2_dphy0>; // 硬件版本
};
csi2_dphy0: csi2-dphy0 {
    compatible = "rockchip,rk3568-csi2-dphy";
    phys = <&mipi_dphy0>; // 指向正确的PHY
    phy-names = "dphy";
    ports {
        port@0 {
            reg = <0>;
            #address-cells = <1>;
            #size-cells = <0>;
            // 关键点: CSI 接收 VC 设置
            endpoint {
                remote-endpoint = <&sensor_out>;
                data-lanes = <1 2 3 4>; // Lane数量必须匹配Sensor
                virtual-channel-index = <0>; // 必须等于Sensor输出VC
            };
        };
    };
};
```

Takt/Versorgung prüfen: korrekte konfliktfreie Frequenzen von Sensor, MIPI DPHY und CSI2 Host Controller. DOVDD/AVDD/DVDD innerhalb Spezifikation; Ripple &lt;50mV mit Oszilloskop messen.

#### 6.5.3 Hardwarepfad (Quelle behauptet über 90% physikalische Ursachen)

Verbindungen: FPC neu einsetzen und verriegeln, anschließend bekannt gutes Kabel testen. Kontakte auf Oxidation/Schmutz prüfen und mit Elektronikreiniger reinigen. Quellenwert für Differenzimpedanz: 100Ω ±10%; schlechte Kabel sind häufige Ursachen.

Signalintegrität mit Oszilloskop/Protokollanalysator prüfen. Alle Sensorversorgungen, besonders 1.2V-/1.8V-DVDD: Rauschen &lt;50mV pk-pk. An CLK+/CLK- und DATA+/DATA- nennt die Quelle: Augenhöhe ≥100mV, Breite ≥0.4 UI, klare monotone Flanken (geschlossenes/unscharfes Auge kritisch); Slew Rate 1.5–4V/ns je D-PHY-Version; Überschwingen/Ringing &lt;20% Vdiff pp; Gleichtaktrauschen &lt;100mV; Data-to-Clock-Skew &lt;0.3 UI. Niedrige MIPI-Rate etwa 500Mbps testen.

MCLK meist 24MHz/27MHz: Stabilität ±50ppm, Phasenjitter &lt;50ps RMS. Geschirmte Kabel und minimale Tastkopf-Masseschleifen verwenden. Quellenwert für Masseimpedanz Sensorboard–SoC-Board: &lt;1Ω. Abstand zu WLAN/DC-DC, Motoren und starken Magnetfeldern.

#### 6.5.4 Systemprüfung/Fehlersuche

data-lanes-Reihenfolge/-Zahl mit Verdrahtung abgleichen, besonders Polaritätsumkehr und lane-polarities. Auf etwa 320x240 @10fps reduzieren; verschwindende Fehler deuten auf Bandbreite/Signalqualität. Internes Color Bar/Checkerboard umgeht analoge Aufnahme und testet MIPI direkt. rkisp_3A_server in /etc/init.d/ für ausführliche Logs aktivieren. Mit v4l2-ctl überwachen:

```text
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=100 --stream-skip=100
```

Temperatur: hohe Temperaturen verschlechtern Signalqualität. Prüfen, ob Fehlerrate steigt (Quellenbeispiel Umgebung &gt;85°C).

#### 6.5.5 Sofortige Fehlersuchmaßnahmen

1. Zuerst MIPI für Tests auf &lt;1.5Gbps/lane reduzieren.

2. Nur 1 Lane testen.

3. Unbeteiligte Peripherie entfernen und CPU-/GPU-Takte senken.

4. Sensormodul, Core-Board oder Hauptplatine tauschen, besonders bei Verdacht auf PCB-Impedanz.

#### 6.5.6 Typische Abhilfen

Physikalische Ursachen (Quelle 90%): hochwertiges 100Ω±5%-MIPI-Kabel, kürzere Differenzleitungen, keine Via-Stubs, mehr Paarabstand; Quelle schlägt außerdem 50Ω-Abschluss nach Masse vor. Software (9%): VTS/HTS/Pixel Clock exakt abgleichen, VC/Lane-Map korrigieren, Treiber/Firmware besonders MIPI PHY aktualisieren.

Hardwarefehler (Quelle 1%): Versorgungsbaum überarbeiten/LDO-Filterung ergänzen, präzisen Quarz/Taktpuffer verwenden, ESD-Schutz/TVS-Auswahl verbessern.

#### 6.5.7 Sensorindex

rockchip,camera-module-index in DTS setzen. librkaiq/rockit bevorzugen diesen Geräteindex; auch tool_server sucht danach. Ohne explizites -d gilt 0. Empfehlung: Einzelkamera 0, zwei 0/1, mehrere 0/1/2/3…

## 7. Referenzdokumente

Sensortreibercode ist nur ein Schritt. Für Plattform-DTS, Schnellstart/AOV und Bildprobleme siehe:

1. Rockchip_Driver_Guide_VI_CN.pdf, last ver: v1.2.0

2. Rockchip Quick Start For Camera.pdf, last ver: v1.0.0

3. Rockchip_Trouble_Shooting_Linux5.10_Camera_CN.pdf

4. Rockchip_Developer_Guide_Linux_AOV_CN.pdf

## 8. Anhänge

### 8.1 CIS-V4L2-Controls

| Mitglied | Beschreibung |
| --- | --- |
| V4L2_CID_VBLANK | Vertikale Austastung: Leerlauf nach jedem Bild ohne Daten, Einheit Zeilen. Zeilenlänge ist Bildbreite plus horizontale Austastung bei V4L2_CID_PIXEL_RATE desselben Untergeräts. |

| Mitglied | Beschreibung |
| --- | --- |
| V4L2_CID_HBLANK | Horizontale Austastung: Leerlauf nach jeder Datenzeile ohne Ausgabe, Einheit Pixel. |
| V4L2_CID_EXPOSURE | Sensorbelichtungszeit, durch Bildintervall begrenzt. |
| V4L2_CID_ANALOGUE_GAIN | Verstärkung aller Farbkomponenten der Pixelmatrix im Analogbereich vor A/D-Wandlung. |
| V4L2_CID_PIXEL_RATE | Nur lesbare Pixelrate an subdev-Quellpads, Pixel/s. MIPI: pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample |
| V4L2_CID_LINK_FREQ | Datenbusfrequenz in Hz. Mit Medienbus-Pixelcode und Bustyp (Takte/Abtastung) definiert sie V4L2_CID_PIXEL_RATE im Pixelarray bzw. anderswo bei Nicht-Sensoren. Bildrate folgt Pixeltakt, Breite/Höhe und beiden Austastungen. Pixelrate außerhalb des Array-Untergeräts reicht nicht zur Bildratenberechnung: Nur im Array sind Austastwerte exakt, da dort keine weitere Austastung zulässig ist. Bildrate über gewünschte horizontale/vertikale Austastung wählen. |

### 8.2 MEDIA_BUS_FMT-Liste

| CIS-Sensortyp | Sensorausgabeformat |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| Nur Y (monochrom), Raw-BW-Sensor | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

### 8.3 Kamera-Referenztreiber

| CIS-Datenschnittstelle | CIS-Ausgabedatentyp | Frame/Field | Referenztreiber |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | frame | 0.3M<br>ov7750.c<br>gc0403.c<br>0.9M<br>jx_h62.c<br>jx_h63p<br>1.2M<br>ov9750.c<br>jx-h65.c<br>mia1321.c<br>2M<br>jx_f37.c<br>mis20s1.c<br>mis2031.c<br>ov2685.c<br>ov2680.c<br>ov2735.c<br>ov02g10.c<br>ov02b10.c<br>gc2385.c<br>gc2355.c<br>gc2053.c<br>gc2093.c<br>sc2232.c<br>sc2239.c<br>sc223a.c<br>sc2310.c<br>sc2336.c<br>sc2336p.c<br>sc230ai.c<br>sc231hai.c<br>sc235hai.c<br>sc210iot.c<br>sp250a.c<br>4M<br>gc4c33.c<br>jx_k04.c<br>jx_k17.c<br>mis4001.c<br>mis40c1.c<br>mis40h1.c<br>ov4686.c<br>ov4688.c<br>ov4689.c<br>os04c10.c<br>os04a10.c<br>sc401ai.c<br>sc4236.c<br>sc450ai.c<br>sc485sl.c<br>imx347.c<br>5M<br>mis5001.c<br>os05a20.c<br>ov5695.c<br>ov5648.c<br>ov5670.c<br>gc5024.c<br>gc5025.c<br>gc5035.c<br>hm5040.c<br>sc5239.c<br>hynix_hi556.c<br>8M<br>ar0822.c<br>gc8613.c<br>mis8001.c<br>ov8858.c<br>os08a10.c<br>os08a20.c<br>sc8220.c<br>sc830ai.c<br>sc835hai.c<br>sc850sl.c<br>imx378.c<br>imx317.c<br>imx219.c<br>gc8034.c<br>hynix_hi846.c<br>s5kgm1sp.c<br>s5k4h7yx.c<br>13M<br>ov13850.c<br>ov13b10.c<br>imx258.c<br>ov12d2q.c |
| MIPI | Bayer raw hdr | frame | 2M<br>imx307.c<br>imx327.c<br>imx462.c<br>gc2093.c<br>ov02k10.c<br>ov2718.c<br>sc200ai.c<br>sc2310.c<br>jx-f37.c<br>4M<br>ov4689.c<br>os04a10.c<br>imx347.c<br>imx464.c<br>sc4238.c<br>5M<br>imx335.c<br>os05a20.c<br>sc500ai.c<br>8M<br>imx334.c<br>imx415.c |
| MIPI | YUV | frame | 2M<br>gc2145.c |
| MIPI | RAW BW | frame | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT60 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  | 0.3M<br>sc031gs.c<br>1.3M<br>sc032gs.c |
| ITU.BT656 | Bayer RAW |  | 2M<br>imx323.c (kann unterstützt werden) |

{% endraw %}
