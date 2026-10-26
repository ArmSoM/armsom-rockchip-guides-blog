---

title: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A und Anwendungen"

description: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A und Anwendungen · V2.0.0"

excerpt: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A und Anwendungen"

translation_key: 183-rockchip-linux44-camera

slug: 183-rockchip-linux44-camera

lang: de

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Plattformreferenz: Hersteller V2.0.0, RK3399, RK3326/PX30, RK3288, RK312x/PX3SE, RK180x; Linux 4.4. Die vollständigen Kapitel behandeln Kameratreiber, Sensoranbindung, Erfassung und Fehlersuche. Konkrete ArmSoM-Board/BSP/SDK/Kernel-Kombinationen sind nicht validiert; Schaltplan, Schnittstellen, Versorgung/Takte, Treiber und IQ-Dateien prüfen. Beispiele/Messwerte stammen vom Hersteller, nicht von ArmSoM; keine Hardwarebefehle ausgeführt. ZH nutzt chinesische Originalbilder, EN/RU/DE englische.



Technisches Vorwort: ISP/CIF-Struktur, Sensorentwicklung/-portierung, übergeordnete Fehlersuche, Anwendungs-APIs und 3A. Treiber orientieren sich an V4L2 und bieten Portierungs-/Anwendungsschnittstellen; Kenntnisse der V4L2-Werkzeuge und Konzepte werden vorausgesetzt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



| SoC | Kernel | ISP | CIF |
| --- | --- | --- | --- |
| RK3399 | 4.4 | 2 | — |
| RK3326/PX30 | 4.4 | 1 | 1 |
| RK3288 | 4.4 | 1 | 1 |
| RK312x/PX3SE | 4.4 | — | 1 |
| RK180x | 4.4 | 1 | 1 |



<!-- en PDF p.4; unit 0 -->

## 1. Versionen und Begriffe

<!-- en PDF p.4; unit 1 -->

### 1.1 Begriffe

<!-- en PDF p.4; unit 2 -->

3A: Autofokus AF, automatische Belichtung AE und Weißabgleich AWB beziehungsweise algorithms.so.

Async Sub Device: asynchrones V4L2-Untergerät im Media Controller, etwa Sensor/MIPI DPHY. Bayer Raw/Raw Bayer: RGGB-, BGGR-, GBRG-, GRBG-Frames von Sensor/ISP. Buildroot: darauf basierende Rockchip-Linux-SDKs. Camera: Gesamtsystem aus VIP/ISP, Sensor und Treibern. CIF: VIP-Modul zum Empfang in den Speicher, ohne ISP-Verarbeitung. DVP: paralleler Digital Video Port. Entity: Media-Controller-Knoten. FCC/FourCC: vier Zeichen zur Formatbeschreibung im Kernel, siehe FourCC-Abschnitt. HSYNC: DVP-Zeilensynchronisation. ISP: Image Signal Processing, Bildempfang/-verarbeitung einschließlich Hardware und Treiber. IOMMU: Input-Output Memory Management Unit; bildet verstreute physische Speicherseiten auf zusammenhängende CIF-/ISP-Adressen ab, einschließlich Hardware/Treiber. Englisch schreibt hier iohmu. IQ: Image Quality, abgestimmte Bayer-Raw-XML für 3A. Media Controller: Kernel-Medienframework zur Topologieverwaltung. MIPI: MIPI-Protokoll. MIPI-DPHY: D-PHY-Protokoll oder entsprechender Rockchip-Controller. MP: Main Path, ISP-Ausgang voller Auflösung für Fotos und RAW. PCLK: Sensor-Pixeltakt. Pipeline: Kette verbundener Entities. RKCIF: CIF-Treibername. RKISP1: ISP-Treibername.

<!-- en PDF p.5; unit 3 -->

SP: Self Path, ISP-Ausgang bis 1080p. Userspace: Linux-Benutzerraum gegenüber Kernelraum. V4L2: Video4Linux2, Kernel-Videosystem. VIP: Video Input Processor, früher auch Bezeichnung für CIF. VSYNC: DVP-Bildsynchronisation.

<!-- en PDF p.5; unit 4 -->

### 1.2 Historische ISP-/CIF-Treiber

<!-- en PDF p.5; unit 5 -->

RKISP1/RKCIF basieren auf Media Controller, V4L2 Framework und VB2; Sensoren werden asynchron als Sub Devices registriert. Code unter drivers/media/platform/rockchip/isp1/ und drivers/media/platform/rockchip/cif/, Sensoren unter drivers/media/i2c. Ältere Versionen werden nicht mehr regelmäßig aktualisiert oder unterstützt:

<!-- en PDF p.5; unit 6 -->

| Treiber | Typ | Kernel | Im Artikel behandelt | Codepfad |
| --- | --- | --- | --- | --- |
| RKISP1 | ISP | 4.4 | Ja | drivers/media/platform/rockchip/isp1 |
| RKCIF | CIF | 4.4 | Ja | drivers/media/platform/rockchip/cif |
| RK-ISP10 | ISP | 4.4 | Nein | drivers/media/platform/rk-isp10/ |
| RK-<br>CAMSYS | CIF | 4.4 | Nein | drivers/media/video |

<!-- en PDF p.5; unit 7 -->

### 1.3 FAQ-Dokument

<!-- en PDF p.5; unit 8 -->

Zur Sensorfehlersuche Rockchip_Trouble_Shooting_Linux4.4_Camera_CN heranziehen, normalerweise im selben Verzeichnis.

<!-- en PDF p.5; unit 9 -->

## 2. Sensortreiber entwickeln und portieren

<!-- en PDF p.5; unit 10 -->

Treiber liegen in drivers/media/i2c. Gemeint sind Media-Controller-Treiber, nicht drivers/media/i2c/soc_camera. Sensor und RKCIF/RKISP1 sind weitgehend unabhängig, werden asynchron registriert und über remote-endpoint im DTS verbunden. Der beschriebene Treiber passt zu beiden.

<!-- en PDF p.6; unit 11 -->

Der Sensor ist ein Sub Device, per Pad an Rkcif/Rkisp1/Mipi Dphy gebunden. Behandelt werden Code, DTS und Debugging. Fünf Aufgaben: vdd/reset/powerdown/clk-Sequenz nach Datasheet; Register für Format/Auflösung; struct v4l2_subdev_ops mit set_fmt/get_fmt/s_stream/s_power; V4L2 controls für fps/exposure/gain/test pattern; probe() mit Media-Control-/Sub-Device-Initialisierung. Dokumentation nach Documentation/devicetree/bindings/media/i2c/ ergänzen. Im Board-DTS clk/iomux, regulator/gpio nach Schaltplan und port-Unterknoten zur CIF-/ISP-Verbindung setzen. Beispiele: ov5695/ov2685.

<!-- en PDF p.6; unit 12 -->

### 2.1 Einschaltsequenz

<!-- en PDF p.6; unit 13 -->

Anforderungen unterscheiden sich. Viele OV-Sensoren benötigen nur korrekte mclk/vdd/reset/powerdown-Zustände ohne strikte Reihenfolge, OV2685 dagegen eine genaue Sequenz. Datasheet-Diagramm befolgen. Gekürztes Beispiel __ov5695_power_on() aus drivers/media/i2c/ov5695.c:

<!-- en PDF p.6; unit 14 -->

```text
static int __ov5695_power_on(struct ov5695 *ov5695)
{
  int ret;
  u32 delay_us;
  struct device *dev = &ov5695->client->dev;

  ret = clk_set_rate(ov5695->xvclk, OV5695_XVCLK_FREQ);

  if (clk_get_rate(ov5695->xvclk) != OV5695_XVCLK_FREQ)
   dev_warn(dev, "xvclk mismatched, modes are based on 24MHz\n");
  ret = clk_prepare_enable(ov5695->xvclk);
```

<!-- en PDF p.7; unit 15 -->

```text
  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 1);

  ret = regulator_bulk_enable(OV5695_NUM_SUPPLIES, ov5695->supplies);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 0);

  if (!IS_ERR(ov5695->pwdn_gpio))
   gpiod_set_value_cansleep(ov5695->pwdn_gpio, 1);

  /* 8192 cycles prior to first SCCB transaction */
  delay_us = ov5695_cal_delay(8192);
  usleep_range(delay_us, delay_us * 2);

  return 0;
}
```

<!-- en PDF p.7; unit 16 -->

OV5695: zuerst xvclk/mclk, dann Reset, anschließend vdd-Versorgungen. regulator_bulk genügt, weil vdd/vodd/avdd keine feste Reihenfolge verlangen; andernfalls separat wie OV2685 steuern. Reset/powerdown gemäß Gehäuse und Schaltplan aktiv setzen; eventuell ist nur einer nötig. Abschließend 8192 Taktzyklen warten. Auch wenn ein Sensor anders funktioniert, ist die Herstellersequenz zuverlässiger. Ebenso die Abschaltsequenz implementieren.

<!-- en PDF p.7; unit 17 -->

#### 2.1.1 Einschalten prüfen

<!-- en PDF p.7; unit 18 -->

In .probe() wird die Chip-ID gelesen, etwa durch ov5695_check_sensor_id(). Eine korrekte ID bestätigt normalerweise die Einschaltsequenz und I2C-Kommunikation.

<!-- en PDF p.8; unit 19 -->

### 2.2 Initialisierungsregister

<!-- en PDF p.8; unit 20 -->

struct ov5695_mode/struct ov2685_mode beschreiben Modi mit Auflösung, Mbus Code, fps und Registerliste. Herstellerwerte übernehmen. REG_NULL beendet die Liste und darf nicht mit einer Registeradresse kollidieren.

<!-- en PDF p.8; unit 21 -->

### 2.3 v4l2_subdev_ops-Callbacks

<!-- en PDF p.8; unit 22 -->

Kern der Sensorsteuerung; vollständiger Umfang in include/media/v4l2-subdev.h. Empfohlen: .open() beim Öffnen von /dev/v4l-subdev? aus Userspace, nötig für separate Controls; .s_power() ein/aus; .s_stream() Stream ein/aus mit Registerkonfiguration; .enum_mbus_code() Formate; .enum_frame_size() Größen; .get_fmt() aktuelles Format/Größe, sonst fehlt diese Angabe in media-ctl; .set_fmt() Einstellung. OV5695 nutzt pm_runtime für Versorgung und v4l2_ctrl_handler_setup() in .s_stream(), um möglicherweise im ausgeschalteten Zustand geänderte Controls tatsächlich in Register zu schreiben.

<!-- en PDF p.8; unit 23 -->

### 2.4 V4L2 controls

<!-- en PDF p.8; unit 24 -->

Für dynamische Belichtung, Gain und Blanking, besonders RAW Bayer, Controls implementieren. ov5695_initialize_controls() legt unterstützte Controls und Grenzen fest; struct v4l2_ctrl_ops benennt ov5695_set_ctrl() zur Werteinstellung durch Anwendungen.

<!-- en PDF p.9; unit 25 -->

### 2.5 Probe, Media Entity und v4l2 subdev

<!-- en PDF p.9; unit 26 -->

<!-- en PDF p.9; unit 27 -->

probe liest regulator/gpio/clk aus DTS für die Versorgung und registriert Media Entity, Subdev und Controls. Subdev-Registrierung ist asynchron. v4l2_i2c_subdev_init() setzt Subdev/Callbacks; ov5695_initialize_controls() die Controls; media_entity_init() die Entity, bei OV5695 mit einem Source Pad; v4l2_async_register_subdev() ist wegen asynchroner RKISP1-/RKCIF-Registrierung erforderlich.

<!-- en PDF p.9; unit 28 -->

### 2.6 DTS-Beispiel: MIPI-Sensor

<!-- en PDF p.9; unit 29 -->

pinctrl/iomux, clk, gpio und Remote-Port nach Hardware konfigurieren. OV5695-Beispiel aus rk3326-evb-lp3-v10-linux.dts:

<!-- en PDF p.9; unit 30 -->

```text
ov5695: ov5695@36 {
  compatible = "ovti,ov5695";
  reg = <0x36>;

  clocks = <&cru SCLK_CIF_OUT>;
  clock-names = "xvclk";

  avdd-supply = <&vcc2v8_dvp>;
  dovdd-supply = <&vcc1v8_dvp>;
  dvdd-supply = <&vdd1v5_dvp>;

  /*reset-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;*/
  pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;

  rockchip,camera-module-index = <0>;
  rockchip,camera-module-facing = "back";
  rockchip,camera-module-name = "TongJu";
  rockchip,camera-module-lens-name = "CHT842-MD";

  port {
   ucam_out: endpoint {
     remote-endpoint = <&mipi_in_ucam>;
     data-lanes = <1 2>;
   };
  };
};
```

<!-- en PDF p.10; unit 31 -->

pinctrl setzt Reset und clk-iomux. Der Treiber erwartet den Taktnamen xvclk mit 24M. OV5695 benötigt drei Versorgungen. port/endpoint verbindet mipi_in_wcam; MIPI DPHY verweist zurück auf wcam_out. data-lanes gibt zwei Lanes an und muss in wcam_out dazu passen.

<!-- en PDF p.10; unit 32 -->

### 2.7 DTS-Beispiel: DVP-Sensor

<!-- en PDF p.10; unit 33 -->

Anders als MIPI benötigt DVP keine data-lanes; endpoint verbindet CIF. Beispiel gc2155 in arch/arm64/boot/dts/rockchip/rk3326-evb-lp3-v10-linux.dts: remote-endpoint zeigt auf cif_in; restliche Angaben entsprechen MIPI.

<!-- en PDF p.10; unit 34 -->

### 2.8 Sensor debuggen

<!-- en PDF p.10; unit 35 -->

Nach dem Portieren die Funktion prüfen; bei Problemen zuerst die FAQ nutzen.

<!-- en PDF p.10; unit 36 -->

#### 2.8.1 Registrierung erfolgreich?

<!-- en PDF p.10; unit 37 -->

Zunächst I2C und Chip-ID prüfen; eine richtige ID bestätigt normalerweise die Einschaltsequenz. Treiberlogs sind sensorspezifisch. Anschließend muss der Sensor als Entity in media-ctl erscheinen; dann ist er registriert.

<!-- en PDF p.10; unit 38 -->

#### 2.8.2 Aufnahme liefert Bilder?

<!-- en PDF p.10; unit 39 -->

Mit v4l2-ctl, GStreamer oder Kamera-App erfassen.

<!-- en PDF p.11; unit 40 -->

#### 2.8.3 Controls wirksam?

<!-- en PDF p.11; unit 41 -->

Gain/Exposure/Blanking mit v4l2-ctl einstellen und Bilder prüfen: höhere Helligkeit bei Gain/Exposure, niedrigere Bildrate bei mehr Blanking.

<!-- en PDF p.11; unit 42 -->

## 3. Debugwerkzeuge und Befehle

<!-- en PDF p.11; unit 43 -->

Lange Befehle sind mit Backslash \ fortgesetzt. So können sie kopiert werden; beim Zusammenziehen auf eine Zeile die Fortsetzungszeichen entfernen.

<!-- en PDF p.11; unit 44 -->

### 3.1 v4l-utils

<!-- en PDF p.11; unit 45 -->

In Rockchip-SDKs standardmäßig integriert; über Buildroot ein-/ausschaltbar:

<!-- en PDF p.11; unit 46 -->

```text
# grep -rn LIBV4L_UTILS - buildroot/configs/rockchip/camera.config
BR2_PACKAGE_LIBV4L_UTILS=y
```

<!-- en PDF p.11; unit 47 -->

Quellcode auf www.linuxtv.org; unter Ubuntu per apt installierbar:

<!-- en PDF p.11; unit 48 -->

```text
# sudo apt-get install v4l-utils
```

<!-- en PDF p.11; unit 49 -->

### 3.2 Topologie mit media-ctl

<!-- en PDF p.11; unit 50 -->

media-ctl gehört zu v4l-utils und prüft/konfiguriert Format, Crop und Linkstatus jeder Entity. Für übliche Anwendungen genügen die Vorgaben; das Werkzeug ermöglicht flexiblere Nutzung.

<!-- en PDF p.11; unit 51 -->

#### 3.2.1 Topologie anzeigen

<!-- en PDF p.11; unit 52 -->

Der Befehl zeigt die Topologie. Bei CIF+ISP, mehreren ISPs oder USB-Kamera gibt es möglicherweise /dev/media0, /dev/media1 und /dev/media2.

<!-- en PDF p.12; unit 53 -->

```text
# media-ctl -p -d /dev/media0
```

<!-- en PDF p.12; unit 54 -->

Entscheidend ist die Sensor-Entity. Fehlt sie, Registrierung gemäß FAQ prüfen. Gekürztes OV5695-Beispiel auf RK3326:

<!-- en PDF p.12; unit 55 -->

```text
# media-ctl -p -d /dev/media1
- entity 9: m00_b_ov5695 2-0036 (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR10_1X10/2592x1944@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]
```

<!-- en PDF p.12; unit 56 -->

m00_b_ov5695 2-0036 ist ein V4L2-Subdev-Sensor mit /dev/v4l-subdev2 für Anwendungen/v4l2-ctl. Ein Source-Ausgang pad0; Format [fmt:SBGGR10_1X10/2592x1944@10000/300000 field:none]. SBGGR10_1X10 ist mbus-code. Source pad0 ist mit pad0 von "rockchip-mipi-dphy-rx" verbunden und ENABLED. DYNAMIC erlaubt DISABLED. Sind zwei Sensoren an einem ISP/CIF angeschlossen, ist nur einer aktiv. Beispiel:

<!-- en PDF p.12; unit 57 -->

```text
[root@rk3326_64:/]# media-ctl -p -d /dev/media1
-entity 9: irs16x5c 1-003d (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]

-entity 10: irs16x5c 2-003d (1 pad, 1 link)
      type V4L2 subdev subtype Sensor flags 0
      device node name /dev/v4l-subdev3
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [DYNAMIC]
```

<!-- en PDF p.12; unit 58 -->

Im Beispiel:

<!-- en PDF p.13; unit 59 -->

Beide irs16x5c sind mit "rockchip-mipi-dphy-rx":0 verbunden, aber nur Entity 9 ist ENABLED. Sensorwechsel nur bei gestoppter Pipeline; während der Aufnahme keine Entity-Konfiguration ändern.

<!-- en PDF p.13; unit 60 -->

#### 3.2.2 Sensor wechseln

<!-- en PDF p.13; unit 61 -->

Mehrere Sensoren lassen sich mit folgenden Befehlen umschalten:

<!-- en PDF p.13; unit 62 -->

```text
# media-ctl -d /dev/media0 \
  -l '"ov5695 7-0036":0->"rockchip-sy-mipi-dphy":0[0]'
# media-ctl -d /dev/media0 \
  -l '"ov2685 7-003c":0->"rockchip-sy-mipi-dphy":0[1]'
```

<!-- en PDF p.13; unit 63 -->

Format: media-ctl -l'"entity name":pad-&gt;"entity name":pad[Status]'. Den Link wegen &gt; [ ] in einfache, Entity-Namen wegen Leerzeichen in doppelte Anführungszeichen setzen. Status 0/1 schaltet aus/ein; konkreten Wert mit Beispiel und media-ctl prüfen.

<!-- en PDF p.13; unit 64 -->

#### 3.2.3 Entity-Format und Größe

<!-- en PDF p.13; unit 65 -->

Beispiel 1: OV5695 von standardmäßig 2592x1944 auf 1920x1080 ändern.

<!-- en PDF p.13; unit 66 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"m00_b_ov5695 2-0036":0[fmt:SBGGR10_1X10/1920x1080]'
```

<!-- en PDF p.13; unit 67 -->

Danach rkisp1-isp-subdev und Video-Crop anpassen: Nachfolgende Stufen dürfen nicht größer als vorherige sein.

<!-- en PDF p.13; unit 68 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/1920x1080]'
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
# v4l2-ctl -d /dev/video1 \
  --set-selection=target=crop,top=0,left=0,width=1920,height=1080
```

<!-- en PDF p.13; unit 69 -->

Beispiel 2: Bayer RAW wird standardmäßig als YUV ausgegeben. fmt von rkisp1-isp-subdev an den Sensor anpassen, um RAW über MP auszugeben.

<!-- en PDF p.13; unit 70 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10/2592x1944]'
```

<!-- en PDF p.13; unit 71 -->

Zu beachten:

<!-- en PDF p.14; unit 72 -->

Sonderzeichen korrekt in einfache/doppelte Anführungszeichen setzen; Leerzeichen darin nicht ändern. Details: media-ctl --help.

<!-- en PDF p.14; unit 73 -->

#### 3.2.4 Übliche mbus-code-Formate

<!-- en PDF p.14; unit 74 -->

Media Bus Pixel Codes beschreiben den Transport auf physischer Busverbindung, etwa Sensor→ISP über MIPI DPHY oder zwischen ISP-Modulen. FourCC dagegen beschreibt Speicherformate. Definitionen: include/uapi/linux/media-bus-format.h. Verwendete Codes:

<!-- en PDF p.14; unit 75 -->

| Kernel-Makro | Mbus-code-Kurzform | Typ | Bpp | Busbreite | Samples |
| --- | --- | --- | --- | --- | --- |
| MEDIA_BUS_FMT_SBGGR8_1X8 | SBGGR8_1X8 | Bayer<br>Raw | 8 | 8 | 1 |
| MEDIA_BUS_FMT_SRGGB8_1X8 | SRGGB8_1X8 | Bayer<br>Raw | 8 | 8 | 1 |
| MEDIA_BUS_FMT_SBGGR10_1X10 | SBGGR10_1X10 | Bayer<br>Raw | 10 | 10 | 1 |
| MEDIA_BUS_FMT_SRGGB10_1X10 | SRGGB10_1X10 | Bayer<br>Raw | 10 | 10 | 1 |
| MEDIA_BUS_FMT_SBGGR12_1X12 | SBGGR12_1X12 | Bayer<br>Raw | 12 | 12 | 1 |
| MEDIA_BUS_FMT_SRGGB12_1X12 | SRGGB12_1X12 | Bayer<br>Raw | 12 | 12 | 1 |
| MEDIA_BUS_FMT_YUYV8_2X8 | YVYU8_2X8 | YUV<br>422 | 16 | 8 | 2 |
| MEDIA_BUS_FMT_UYUV8_2X8 | UYUV8_2X8 | YUV<br>422 | 16 | 8 | 2 |
| MEDIA_BUS_FMT_Y8_1X8 | Y8_1X8 | YUV<br>GREY | 8 | 8 | 1 |
| MEDIA_BUS_FMT_RGB888_1X24 | RGB888_1X24 | RGB<br>888 | 24 | 24 | 1 |

<!-- en PDF p.14; unit 76 -->

Unterstützte mbus-codes auflisten:

<!-- en PDF p.14; unit 77 -->

```text
# media-ctl --known-mbus-fmts
```

<!-- en PDF p.15; unit 78 -->

#### 3.2.5 Videogeräte finden

<!-- en PDF p.15; unit 79 -->

Sub Devices entsprechen /dev/v4l-subdev, Video Devices /dev/video. Bei mehreren Geräten den bildliefernden Knoten bestimmen.

<!-- en PDF p.15; unit 80 -->

```text
# media-ctl -d /dev/media1 -e "rkisp1_selfpath"
/dev/video2
# media-ctl -d /dev/media1 -e "rkisp1_mainpath"
/dev/video1
```

<!-- en PDF p.15; unit 81 -->

Die beiden Befehle zeigen SP-/MP-Pfade in /dev/media1. RKISP1 besitzt zwei Bildausgänge. Für RKCIF entsprechend:

<!-- en PDF p.15; unit 82 -->

```text
# media-ctl -d /dev/media0 -e "stream_cif"
/dev/video0
```

<!-- en PDF p.15; unit 83 -->

Der Befehl zeigt RKCIF in /dev/media0. RKCIF besitzt einen Videoausgang.

<!-- en PDF p.15; unit 84 -->

```text
# v4l2-ctl -d /dev/video1 --all
```

<!-- en PDF p.15; unit 85 -->

Der Befehl zeigt /dev/video1-Parameter wie crop, fmt und Controls.

<!-- en PDF p.15; unit 86 -->

### 3.3 Aufnahme mit v4l2-ctl

<!-- en PDF p.15; unit 87 -->

media-ctl verwaltet über /dev/media0 Format/Größe/Links der Topologie; Englisch schreibt /dev/medio0. v4l2-ctl arbeitet auf /dev/video0/1 mit set_fmt/reqbuf/qbuf/dqbuf/stream_on/stream_off. Hier dient es zur Aufnahme und Exposure-/Gain-/VTS-Einstellung. Zuerst Hilfe lesen, insbesondere streaming und vidcap. Kurzfassung:

<!-- en PDF p.15; unit 88 -->

```text
# v4l2-ctl --help
```

<!-- en PDF p.15; unit 89 -->

Vollständige Hilfe:

<!-- en PDF p.15; unit 90 -->

```text
# v4l2-ctl --help-all
```

<!-- en PDF p.15; unit 91 -->

Streaming-Parameter:

<!-- en PDF p.16; unit 92 -->

```text
# v4l2-ctl --help-streaming
```

<!-- en PDF p.16; unit 93 -->

Vidcap-Parameter, insbesondere get-fmt/set-fmt:

<!-- en PDF p.16; unit 94 -->

```text
# v4l2-ctl --help-vidcap
```

<!-- en PDF p.16; unit 95 -->

#### 3.3.1 Frames mit v4l2-ctl erfassen

<!-- en PDF p.16; unit 96 -->

Beispiel 1: Ein NV12-Frame 640x480 von RKCIF nach /tmp/nv12.bin. Die ersten drei Frames werden an Userspace geliefert, aber nicht gespeichert.

<!-- en PDF p.16; unit 97 -->

```text
# v4l2-ctl -d /dev/video0 \
  --set-fmt-video=width=640,height=480,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-skip=3 \
  --stream-to=/tmp/nv12.bin \
  --stream-count=1 \
  --stream-poll
```

<!-- en PDF p.16; unit 98 -->

Beispiel 2: Zehn NV12-Frames 1920x1080 von RKISP nach /tmp/nv12.bin.

<!-- en PDF p.16; unit 99 -->

```text
# v4l2-ctl -d /dev/video1 \
  --set-selection=target=crop,top=0,left=0,width=1920,height=1080
  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-to=/tmp/nv12.bin \
  --stream-count=10 \
  --stream-poll
```

<!-- en PDF p.16; unit 100 -->

Parameter: -d wählt /dev/video0. --set-selection setzt Crop, nicht größer als die vorherige RKISP1-Stufe; RKCIF nutzt --set-crop. --set-fmt-video bestimmt Breite/Höhe und FourCC-Pixelformat, hier NV12. --stream-mmap wählt einen vom Kernel physisch zusammenhängend oder per IOMMU angelegten Puffer. --stream-skip verwirft die ersten drei Frames. --stream-to setzt die Datei. --stream-count zählt gespeicherte Frames ohne verworfene. --stream-poll nutzt asynchrones IO/select vor dqbuf, sodass dqbuf nicht blockiert; ohne Option wartet dqbuf auf den Frame.

<!-- en PDF p.17; unit 101 -->

#### 3.3.2 Exposure, Gain und weitere Controls

<!-- en PDF p.17; unit 102 -->

Implementiert der Sensortreiber Controls, lassen sich Exposure/Gain vor der Aufnahme setzen. RKCIF/RKISP erben Subdevice-Controls, sichtbar etwa über /dev/video3. OV5695 auf RK3326 mit Exposure/Gain/Blanking/Testpattern:

<!-- en PDF p.17; unit 103 -->

```text
# v4l2-ctl -d /dev/video1 -l

User Controls

    exposure 0x00980911 (int) : min=4 max=2228 step=1 default=1104 value=1104
      gain 0x00980913 (int) : min=0 max=16383 step=1 default=1024 value=1024

Image Source Controls

vertical_blanking 0x009e0901 (int) : min=1152 max=31687 step=1 default=1152 value=1152
  analogue_gain 0x009e0903 (int) : min=16 max=248 step=1 default=248 value=248

Image Processing Controls

   test_pattern 0x009f0903 (menu): min=0 max=4 default=0 value=0
```

<!-- en PDF p.17; unit 104 -->

Exposure und analogue_gain ändern:

<!-- en PDF p.17; unit 105 -->

```text
# v4l2-ctl -d /dev/video3 --set-ctrl'exposure=1216,analogue_gain=10'
```

<!-- en PDF p.17; unit 106 -->

#### 3.3.3 RAW erfassen

<!-- en PDF p.17; unit 107 -->

MP von RKISP1 erfasst RAW im ISP-Bypass ohne Bildabstimmung. Beispiel OV5695: SBGGR10_1X10, 2592x1944.

<!-- en PDF p.17; unit 108 -->

```text
# media-ctl -d /dev/media0 \
  --set-v4l2 '"ov5695 7-0036":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]'
# v4l2-ctl -d /dev/video4 \
  --set-ctrl 'exposure=1216,analogue_gain=10' \
```

<!-- en PDF p.18; unit 109 -->

```text
--set-selection=target=crop,top=0,left=0,width=2592,height=1944 \
--set-fmt-video=width=2592,height=1944,pixelformat=BG10 \
--stream-mmap=3 \
--stream-to=/tmp/mp.raw.out \
--stream-count=1 \
--stream-poll
```

<!-- en PDF p.18; unit 110 -->

Zeile 4 gleicht isp-subdev-Format an den Sensor an. Zeilen 3/5 setzen Crop gleich Sensorgröße, ohne Beschneiden. In Zeile 6 können Exposure/Gain bei dunklem Bild erhöht werden, sofern Controls implementiert sind. Zeilen 7/8 setzen Selection ohne Crop und FourCC BG10. 10-/12-Bit-RAW wird trotz Bypass unten mit Nullen auf 16 Bit aufgefüllt. Ein dreizeiliger PGM-Header macht RAW unter Ubuntu direkt sichtbar. Beispiel:

<!-- en PDF p.18; unit 111 -->

```text
# cat > /tmp/raw.pgm << EOF
P5
2592 1944
65535
EOF

# cat /tmp/mp.raw.out >> /tmp/raw.pgm
```

<!-- en PDF p.18; unit 112 -->

Zeile 2: feste Kennung P5. Zeile 3: Breite/Höhe durch Leerzeichen getrennt. Zeile 4: Tiefe 65535 für 16 Bit beziehungsweise 255 für 8 Bit. Zeile 7 hängt RAW an. Der Header hat genau drei Zeilen, keine zusätzlichen Leerzeilen.

<!-- en PDF p.18; unit 113 -->

#### 3.3.4 FourCC-Formate

<!-- en PDF p.18; unit 114 -->

Four Character Codes benennt ein Format mit vier Zeichen, also 32 Bit. Linux-Makro:

<!-- en PDF p.18; unit 115 -->

```text
#define v4l2_fourcc(a,b,c,d) \
  (((__u32)(a)<<0)|((__u32)(b)<<8)|((__u32)(c)<<16)|((__u32)(d)<<24))
```

<!-- en PDF p.19; unit 116 -->

FourCC beschreibt Bild-/Videospeicherung im Speicher, nicht den Bus wie mbus-code. Gebräuchliche Formate unten; vollständig in videodev2.h.

<!-- en PDF p.19; unit 117 -->

| Kernel-Makro | FourCC |
| --- | --- |
| V4L2_PIX_FMT_NV12 | NV12 |
| V4L2_PIX_FMT_NV21 | NV21 |
| V4L2_PIX_FMT_NV16 | NV16 |
| V4L2_PIX_FMT_NV61 | NV61 |
| V4L2_PIX_FMT_NV12M | NM12 |
| V4L2_PIX_FMT_YUYV | YUYV |
| V4L2_PIX_FMT_YUV420 | YU12 |
| V4L2_PIX_FMT_SBGGR10 | BG10 |
| V4L2_PIX_FMT_SGBRG10 | GB10 |
| V4L2_PIX_FMT_SGRBG10 | BA10 |
| V4L2_PIX_FMT_SRGGB10 | RG10 |
| V4L2_PIX_FMT_GREY | GREY |

<!-- en PDF p.19; unit 118 -->

### 3.4 YUV mit mplayer unter Ubuntu anzeigen

<!-- en PDF p.19; unit 119 -->

Gespeicherte Frames können mit mplayer betrachtet werden. Installation per apt:

<!-- en PDF p.19; unit 120 -->

```text
# sudo apt-get install mplayer
```

<!-- en PDF p.19; unit 121 -->

NV12 640x480:

<!-- en PDF p.19; unit 122 -->

```text
# W=640; H=480; mplayer /tmp/nv12.bin -loop 0 -demuxer rawvideo -fps 30 \
  -rawvideo w=${W}:h=${H}:size=$((${W}*${H}*3/2)):format=NV12
```

<!-- en PDF p.19; unit 123 -->

YUYV 640x480:

<!-- en PDF p.19; unit 124 -->

```text
# W=640; H=480; mplayer /tmp/yuyv.bin -loop 0 -demuxer rawvideo -fps 30 \
  -rawvideo w=${W}:h=${H}:size=$((${W}*${H}*2)):format=YUY2
```

<!-- en PDF p.19; unit 125 -->

W/H sind Breiten-/Höhenvariablen für spätere Referenz.

<!-- en PDF p.20; unit 126 -->

fps bestimmt die Wiedergaberate, 1 entspricht einem Frame pro Sekunde. size ist die Framegröße, format das Format; mplayer -rawvideo format=help listet Varianten. Unter Windows beispielsweise 7yuv verwenden.

<!-- en PDF p.20; unit 127 -->

### 3.5 GStreamer

<!-- en PDF p.20; unit 128 -->

Im SDK ermöglicht GStreamer Vorschau und Kodierung. v4l2src liest Videogeräte; rkisp_3A_server sorgt standardmäßig für richtige Helligkeit/Farbe.

<!-- en PDF p.20; unit 129 -->

#### 3.5.1 GStreamer-Anzeige

<!-- en PDF p.20; unit 130 -->

Folgender Befehl zeigt die Kamera:

<!-- en PDF p.20; unit 131 -->

```text
# export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/lib/gstreamer-1.0
# export XDG_RUNTIME_DIR=/tmp/.xdg
# gst-launch-1.0 v4l2src device=/dev/video1 ! \
  video/x-raw,format=NV12,width=2592,height=1944,framerate=30/1 ! kmssink
```

<!-- en PDF p.20; unit 132 -->

#### 3.5.2 Video-/Bildkodierung

<!-- en PDF p.20; unit 133 -->

Das SDK unterstützt Hardwarekodierung. Die Befehle kodieren und speichern den Kamerastrom:

<!-- en PDF p.20; unit 134 -->

```text
# gst-launch-1.0 v4l2src device=/dev/video1 num-buffers=100 ! \
  video/x-raw,format=NV12,width=1920,height=1088,framerate=30/1 ! \
  videoconvert ! mpph264enc ! h264parse ! mp4mux ! \
  filesink location=/tmp/h264.mp4
```

<!-- en PDF p.20; unit 135 -->

```text
# gst-launch-1.0 -v v4l2src device=/dev/video1 num-buffers=10 ! \
  video/x-raw,format=NV12,width=1920,height=1080 ! mppjpegenc ! \
  multifilesink location=/tmp/test%05d.jpg
```

<!-- en PDF p.20; unit 136 -->

mppjpegenc/mpph264enc sind Hardwareencoder aus rockchipmpp. MPP verlangt 16er-Höhenausrichtung; Kernelpatch fea937b015e7 media: rockchip: isp1/cif: set height alignment to 16 in queue_setup erforderlich.

<!-- en PDF p.21; unit 137 -->

### 3.6 Boards ohne Bildschirm debuggen

<!-- en PDF p.21; unit 138 -->

librkuvc.so macht das Board zur UVC-Kamera am PC über USB OTG. Beispielcode im Anwendungskapitel.

<!-- en PDF p.21; unit 139 -->

### 3.7 Debugausgabe aktivieren

<!-- en PDF p.21; unit 140 -->

RKISP1/RKCIF enthalten v4l2_dbg()-Ausgaben. Aktivierung:

<!-- en PDF p.21; unit 141 -->

```text
# echo 1 > /sys/module/video_rkcif/parameters/debug
```

<!-- en PDF p.21; unit 142 -->

Oder:

<!-- en PDF p.21; unit 143 -->

```text
# echo 1 > /sys/module/video_rkisp1/parameters/debug
```

<!-- en PDF p.21; unit 144 -->

VB2/V4L2 haben ebenfalls Schalter. VB2-Log:

<!-- en PDF p.21; unit 145 -->

```text
# echo 7 > /sys/module/videobuf2_core/parameters/debug
```

<!-- en PDF p.21; unit 146 -->

VB2 protokolliert reqbuf/qbuf/dqbuf und Pufferzustände. Der Schalter ist global und aktiviert auch andere VB2-Nutzer wie VPU/ISP. Danach vollständige V4L2-Ausgabe, etwa ioctl:

<!-- en PDF p.21; unit 147 -->

```text
# echo 0x1f > /sys/class/video4linux/video0/dev_debug
```

<!-- en PDF p.21; unit 148 -->

Auch einzelne Meldungsgruppen lassen sich über Bits aus include/media/v4l2-ioctl.h aktivieren:

<!-- en PDF p.21; unit 149 -->

```text
/* Just log the ioctl name + error code */
#define V4L2_DEV_DEBUG_IOCTL     0x01
/* Log the ioctl name arguments + error code */
#define V4L2_DEV_DEBUG_IOCTL_ARG   0x02
/* Log the file operations open, release, mmap and get_unmapped_area */
#define V4L2_DEV_DEBUG_FOP      0x04
/* Log the read and write file operations and the VIDIOC_(D)QBUF ioctls */
#define V4L2_DEV_DEBUG_STREAMING   0x08
/* Log poll() */
#define V4L2_DEV_DEBUG_POLL      0x10
```

<!-- en PDF p.22; unit 150 -->

## 4. 3A integrieren

<!-- en PDF p.22; unit 151 -->

Gilt nur für RKISP1; RKCIF besitzt keine ISP-Funktion und benötigt kein 3A. Frühere Lösungen banden librkisp.so ein oder nutzten rkisp/rkv4l2src-Plug-ins, erschwerten aber Anwendungen und VLC/Chrome-Kompatibilität. Ab RKISP1 v0.1.5 und camera_engine_rkisp v2.2.0 übernimmt rkisp_3A_server die Abstimmung automatisch. Anwendungen behandeln nur Datenströme, ohne librkisp.so; normales v4l2src/VLC liefert korrekte Bilder.

<!-- en PDF p.22; unit 152 -->

### 4.1 rkisp_3A_server

<!-- en PDF p.22; unit 153 -->

Besteht aus RKISP1-Kerneltreiber, camera_engine_rkisp und Startskripten. Im entsprechenden SDK standardmäßig integriert: RKISP1 v0.1.5+ (kernel/drivers/media/platform/rockchip/isp1/version.h); camera_engine_rkisp v2.2.0+ unter external/camera_engine_rkisp; Build-/Autostartskripte unter buildroot/package/rockchip/camera_engine_rkisp. Erzeugte Dateien:

<!-- en PDF p.22; unit 154 -->

```text
/usr/bin/rkisp_3A_server
/usr/lib/librkisp.so
/usr/lib/librkisp_api.so
/usr/lib/rkisp/
      ├── ae
      │ └── librkisp_aec.so
      ├── af
      │ └── librkisp_af.so
      └── awb
        └── librkisp_awb.so
/etc/iqfiles/
/etc/init.d/S40rkisp_3A
```

<!-- en PDF p.22; unit 155 -->

Hinweise:

<!-- en PDF p.23; unit 156 -->

rkisp_3A_server überwacht und startet 3A nach Bedarf. librkisp.so stellt Haupt-APIs bereit und ruft nichtoffene aec-/af-/awb-Bibliotheken auf. iqfiles enthält Sensor-IQ-XML. S40rkisp_3A startet den Server beim Booten. Rockchip-Debian verwendet dieselbe Logik mit anderem Startmechanismus.

<!-- en PDF p.23; unit 157 -->

### 4.2 rkisp_3A_server-Log

<!-- en PDF p.23; unit 158 -->

Per Umgebungsvariable aktivieren, Beispiel AEC:

<!-- en PDF p.23; unit 159 -->

```text
# export persist_camera_engine_log=0x40
```

<!-- en PDF p.23; unit 160 -->

Zeile in /etc/init.d/S40rkisp_3A ergänzen; Ausgabe landet in /var/log/messages. Bei Rotation messages.0/messages.1 mit sichern:

<!-- en PDF p.23; unit 161 -->

```text
# tar zcvf /tmp/camera-log.tar.gz /var/log/messages*
```

<!-- en PDF p.23; unit 162 -->

Modulbezogene Logauswahl:

<!-- en PDF p.23; unit 163 -->

```text
bits: 31-28 27-24 23-20 19-16 15-12 11-8 7-4 3-0
module: [u]  [u]  [xcore] [ISP] [AF] [AWB] [AEC] [NO]
   *[u] means unused now.
each module log has following ascending levels:
   0: error
   1: warning
   2: info
   3: verbose
   4: debug
   5: low1
   6-7: unused, now the same as debug
```

<!-- en PDF p.23; unit 164 -->

Bei manuellem Serverstart Logs in eine Datei umleiten: Die Menge ist für langsame serielle Anschlüsse oder normale Shellausgabe zu groß.

<!-- en PDF p.23; unit 165 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x40
# /usr/bin/rkisp_3A_server --mmedia=/dev/media0 > /tmp/log 2>&1
```

<!-- en PDF p.23; unit 166 -->

Zuerst Service stoppen, Umgebung setzen und Server manuell mit Ausgabe nach /tmp/log starten.

<!-- en PDF p.24; unit 167 -->

![Technische Originalabbildung · EN PDF p.24](/docs/rockchip-linux44-camera/assets/en-p024-vector-01.png)

### 4.3 XML-Laden beschleunigen

<!-- en PDF p.24; unit 168 -->

Für schnellen Bildstart kann XML-Ladebeschleunigung aktiviert werden:

<!-- en PDF p.24; unit 169 -->

```text
# make menuconfig

│ │ --- Rockchip BSP packages                    │ │
│ │ [*] Rockchip Camera Engine for linux               │ │
│ │ [*] Rockchip Camera Engine 3A service run in booting       │ │
│ │   Specify a directory to store xml speed up bin (disabled) ---> │ │
│ │ ()  Rockchip Camera Engine IQ xml file             │ │
```

<!-- en PDF p.24; unit 170 -->

Specify a directory to store xml speed up bin je nach Schreibbarkeit der rootfs wählen.

<!-- en PDF p.24; unit 171 -->

```text
│ │       (X) disabled             │ │
│ │       ( ) /etc/iqfiles-db          │ │
│ │       ( ) /userdata/iqfiles-db        │ │
```

<!-- en PDF p.24; unit 172 -->

Bei read-only rootfs /userdata/iqfiles-db wählen. Das XML-Bin-Verzeichnis muss auf einem beschreibbaren Dateisystem liegen.

<!-- en PDF p.24; unit 173 -->

### 4.4 Ablauf von rkisp_3A_server

<!-- en PDF p.24; unit 174 -->

Sequenzdiagramm:

<!-- en PDF p.24; unit 175 -->

Teilnehmer: userspace_app, kernel_rkisp1_driver, rkisp_3A_server, 3A_Tunning_Thread. Aufnahme starten.

<!-- en PDF p.24; unit 176 -->

Sequenz: Aufnahme → RAW benötigt 3A → Tuning-Thread starten → Start erfolgreich → Nachricht/Timeout setzt Aufnahme fort; kontinuierliche Bilder und Tuning; Aufnahmeende → bereit zum Beenden → Thread beenden → Tuning beendet → Nachricht/Timeout beendet Aufnahme.

<!-- en PDF p.24; unit 177 -->

Beenden vorbereiten; Tuning-Thread beenden; Tuning beendet; nach Threadmeldung oder Timeout Aufnahme abschließen.

<!-- en PDF p.24; unit 178 -->

Teilnehmer: userspace_app, kernel_rkisp1_driver, rkisp_3A_server, 3A_Tunning_Thread.

<!-- en PDF p.25; unit 179 -->

## 5. Anwendungsentwicklung

<!-- en PDF p.25; unit 180 -->

Neben v4l2-ctl/GStreamer/VLC können eigene V4L2-Anwendungen erfassen und verarbeiten. Mit librkisp.so erhalten sie manuelle Exposure-/Gain-Steuerung, regionale Gewichte/Spotmessung, Helligkeitsstatistik und Histogramm sowie Begrenzung von fps/Gain. Dafür zuerst rkisp_3A_server stoppen; die Anwendung initialisiert und startet 3A selbst.

<!-- en PDF p.25; unit 181 -->

```text
# /etc/init.d/S40rkisp_3A stop
```

<!-- en PDF p.25; unit 182 -->

Alternativ S40rkisp_3A direkt entfernen.

<!-- en PDF p.25; unit 183 -->

```text
# rm /etc/init.d/S40rkisp_3A
```

<!-- en PDF p.25; unit 184 -->

### 5.1 librkisp_api.so verwenden

<!-- en PDF p.25; unit 185 -->

camera_engine_rkisp bietet rkisp_api in librkisp_api.so zur direkten Verwendung oder als Vorlage. Deklarationen in rkisp_api.h. Beispiel 1: 1920x1080 öffnen und erfassen.

<!-- en PDF p.25; unit 186 -->

```text
int test_capture_mmap_quick()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  int count = 10;

  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  rkisp_set_fmt(ctx, 1920, 1080, ctx->fcc);

  if (rkisp_start_capture(ctx))
   return -1;

  do {
   buf = rkisp_get_frame(ctx, 0);
```

<!-- en PDF p.26; unit 187 -->

```text
   /* Deal with the buffer */

   rkisp_put_frame(ctx, buf);
  } while (count--);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

<!-- en PDF p.26; unit 188 -->

Hier übernimmt weiterhin rkisp_3A_server das 3A. Für zusätzliche Statistik den Öffnungsparameter ändern:

<!-- en PDF p.26; unit 189 -->

```text
ctx = rkisp_open_device("/dev/video1", 1);
```

<!-- en PDF p.26; unit 190 -->

buf enthält anschließend weitere Statistik. Beispiel 2: OV5695-Ausgabe auf 1920x1080 ändern.

<!-- en PDF p.26; unit 191 -->

```text
const struct rkisp_api_ctx *ctx;

ctx = rkisp_open_device("/dev/video1", 0);
if (ctx == NULL)
  return -1;
rkisp_set_sensor_fmt(ctx, 1920, 1080, MEDIA_BUS_FMT_SBGGR10_1X10);
```

<!-- en PDF p.26; unit 192 -->

### 5.2 DMA Buffer gemeinsam nutzen

<!-- en PDF p.26; unit 193 -->

Gemeinsame Puffer reduzieren Kopien zwischen Camera/RGA/DRM/MPP. rkisp_api allokiert standardmäßig per mmap Kernelpuffer und kann sie als DMA Buffer exportieren. Umgekehrt nimmt es fremde Puffer entgegen und schreibt Frames direkt hinein. Beispiel 1: MMAP-Puffer exportieren.

<!-- en PDF p.26; unit 194 -->

```text
const struct rkisp_api_ctx *ctx;
const struct rkisp_api_buf *buf;

ctx = rkisp_open_device("/dev/video1", 0);
if (ctx == NULL || rkisp_start_capture(ctx))
  return -1;

rkisp_get_frame(ctx, 0);
printf("size: %d, dmabuf fd: %d\n", buf->size, buf->fd);
```

<!-- en PDF p.27; unit 195 -->

buf-&gt;fd ist der DMA-Buffer-Deskriptor für andere Module. Solange diese ihn nutzen, rkisp_put_frame() nicht aufrufen; danach den Aufruf nicht vergessen. Beispiel 2: Kameradaten direkt in fremden Puffer schreiben.

<!-- en PDF p.27; unit 196 -->

```text
int test_capture_ext_dmabuf()
{
  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  for (i = 0, ret = 0; i < buf_count; i++) {
   if (drmGetBuffer(dev.drm_fd, width, height, FORMAT, &buf[i]))
     goto out;
   dmabuf_fd[i] = buf[i].dmabuf_fd;
  }
  rkisp_set_fmt(ctx, width, height, ctx->fcc);
  rkisp_set_buf(ctx, buf_count, dmabuf_fd, buf[0].size);

  if (rkisp_start_capture(ctx))
   goto out;

  buf = rkisp_get_frame(ctx, 0);
  printf("The ext buf fd is: %d\n", buf->fd);
  rkisp_put_frame(ctx, buf);

  rkisp_stop_capture(ctx);

out:
  while (--i >= 0)
   drmPutBuffer(dev.drm_fd, &buf[i]);

  rkisp_close_device(ctx);
}
```

<!-- en PDF p.27; unit 197 -->

rkisp_set_buf() übergibt einen von DRM allokierten DMA Buffer an die Kamera. Gezeigt wird rkisp_api; drmGetBuffer()/drmPutBuffer() sind im Original nicht näher ausgeführt.

<!-- en PDF p.27; unit 198 -->

### 5.3 Regionale Belichtungsgewichte

<!-- en PDF p.27; unit 199 -->

Globale Belichtung ist nicht immer optimal. Höhere Gewichtung einer wichtigen Region verbessert dort die Helligkeit, kann andere Bereiche über-/unterbelichten. Beispiel Gesichtserkennung bei Gegenlicht ohne HDR: erkannte Gesichtsregion höher gewichten.

<!-- en PDF p.28; unit 200 -->

Beispiel Saugroboter: Gegenstände am Boden betreffen vor allem den unteren Bildteil; unterschiedliche Reflexion verursacht Helligkeitsunterschiede. Unteren Bereich stärker gewichten. API-Aufruf:

<!-- en PDF p.28; unit 201 -->

```text
unsigned char weights[] = {
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
};
rkisp_set_expo_weights(ctx, weights, 81);
```

<!-- en PDF p.28; unit 202 -->

Das 9×9-Array beschreibt 81 Regionen. Jeder Wert liegt in [1, 31]; größer bedeutet höheres Gewicht.

<!-- en PDF p.28; unit 203 -->

### 5.4 UVC-Kamera mit librkuvc.so

<!-- en PDF p.28; unit 204 -->

SDK enthält librkuvc.so unter external/uvc_app. Kamerabilder lassen sich komprimieren und an den PC übertragen. Beispiel:

<!-- en PDF p.28; unit 205 -->

```text
#include "uvc_control.h"
#include "uvc_video.h"

int test_uvc_mmap()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  uint32_t flags = 0;
  int extra_cnt = 0;

  ctx = rkisp_open_device("/dev/video1", 0);

  if (ctx == NULL)
   return -1;

  if (rkisp_set_fmt(ctx, 640, 480, V4L2_PIX_FMT_NV12))
   return -1;

  if (rkisp_start_capture(ctx))
   return -1;
```

<!-- en PDF p.29; unit 206 -->

```text
  flags = UVC_CONTROL_LOOP_ONCE;
  uvc_control_run(flags);

  do {
   buf = rkisp_get_frame(ctx, 0);
   extra_cnt++;
   uvc_read_camera_buffer(buf->buf, buf->fd, buf->size, &extra_cnt, sizeof(extra_cnt));

   rkisp_put_frame(ctx, buf);
  } while (1);

  uvc_control_join(flags);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

<!-- en PDF p.29; unit 207 -->

Der Kameratreiber allokiert den Speicher und übergibt DMA Buffer an die UVC-Kodierung.

<!-- en PDF p.29; unit 208 -->

```text
# GCC=buildroot/output/rockchip_rk3326_64/host/bin/aarch64-buildroot-linux-gnu-gcc
# SYSROOT=buildroot/output/rockchip_rk3326_64/staging
# ENGINE=external/camera_engine_rkisp
# $GCC --sysroot=$SYSROOT camera_uvc.c \
   -L$ENGINE/build/lib/ -lrkisp -lrkisp_api \
   -L $SYSROOT/usr/lib/ -lrkuvc \
   -I $SYSROOT/usr/include/uvc/ \
   -I./ \
   -o camera_uvc
```

<!-- en PDF p.29; unit 209 -->

camera_uvc bauen, nach /usr/bin kopieren und auf dem Board starten:

<!-- en PDF p.29; unit 210 -->

```text
# /usr/bin/uvc_MJPEG.sh
# /usr/bin/camera_uvc
```

<!-- en PDF p.29; unit 211 -->

uvc_MJPEG.sh einmal pro Boot initialisieren. Auflösungen 640x480, 1280x720, 1920x1080, 2560x1440; aktuellen Stand in /usr/bin/uvc_MJPEG.sh prüfen. MPP benötigt eine durch 16 teilbare Pufferhöhe, sonst drohen Speichergrenzüberschreitungen.

<!-- en PDF p.30; unit 212 -->

## 6. RKISP1-Treiber

<!-- en PDF p.30; unit 213 -->

Code unter drivers/media/platform/rockchip/isp1. Auf V4L2/Media Framework basierend werden Hardware, Interrupts, Pufferwechsel und Versorgung von MIPI-DPHY-/Sensor-Subdevices gesteuert. Dateien:

<!-- en PDF p.30; unit 214 -->

```text
# tree drivers/media/platform/rockchip/isp1/
drivers/media/platform/rockchip/isp1/
├── capture.c  #Contains the configuration of mp/sp and vb2, frame interrupt processing
├── dev.c   #Include probe, sensor registration, clock, pipeline, iommu
├── isp_params.c #3A Related parameter settings
├── isp_stats.c #3A related statistics
├── regs.c   #register related read and write operations
├── rkisp1.c  #corresponding to rkisp-isp-sd entity, including receiving data from mipi/dvp and crop
function
```

<!-- en PDF p.30; unit 215 -->

MIPI DPHY unter drivers/phy/rockchip/phy-rockchip-mipi-rx.c ist ebenfalls V4L2-Subdevice. Das Diagramm zeigt Sensor bis ISP-Ausgabe.

<!-- en PDF p.31; unit 216 -->

![Technische Originalabbildung · EN PDF p.31](/docs/rockchip-linux44-camera/assets/en-p031-vector-01.png)

Userspace-Anwendung.

<!-- en PDF p.31; unit 217 -->

MP: Main-Path-Videogerät; SP: Self-Path-Videogerät; jeweils Speicherschnittstelle.

<!-- en PDF p.31; unit 218 -->

Skalierung MpOutResize / SpOutResize.

<!-- en PDF p.31; unit 219 -->

Main-Path-/Self-Path-Eingangscrop.

<!-- en PDF p.31; unit 220 -->

Isp Sub Device und ISP Out Crop.

<!-- en PDF p.31; unit 221 -->

ISP In Crop.

<!-- en PDF p.31; unit 222 -->

DVP-Sensor und MIPI DPHY.

<!-- en PDF p.31; unit 223 -->

MIPI-Sensor A / MIPI-Sensor B.

<!-- en PDF p.31; unit 224 -->

RKISP1 unterstützt DVP/MIPI; MIPI benötigt DPHY. Mehrere Sensoren sind anschließbar, nur einer ist aktiv. Ein Bild wird auf MP/SP aufgeteilt und unabhängig gleichzeitig ausgegeben. MP unterstützt bis 4416x3312, YUV oder RAW; RAW nur über MP.

<!-- en PDF p.32; unit 225 -->

SP unterstützt bis 1920x1080, YUV/RGB, kein RAW. Crop/Resize beider Pfade sind unabhängig. Vergleich:

<!-- en PDF p.32; unit 226 -->

| Ausgabegerät | Max. Auflösung | Formate | Crop/Resize |
| --- | --- | --- | --- |
| SP | 1920x1080 | YUV, RGB | Unterstützt |
| MP | 4416x3312 | YUV, RAW | Unterstützt |

<!-- en PDF p.32; unit 227 -->

rkisp1-input-params und rkisp1-statistics dienen 3A. rkisp1_rawpath/rkisp1_dmapath sind Sonderfälle und für normale Anwendungen meist irrelevant.

<!-- en PDF p.32; unit 228 -->

### 6.1 RKISP1-Board-DTS

<!-- en PDF p.32; unit 229 -->

Im SDK sind ISP-Knoten bereits definiert: rkisp1 in rk3288-rkisp1.dtsi sowie rkisp1_0/rkisp1_1 in rk3399.dtsi. Tabelle:

<!-- en PDF p.32; unit 230 -->

| Chip | DTS-Knoten | MIPI DPHY | IOMMU |
| --- | --- | --- | --- |
| RK3399 | rkisp1_0 | mipi_dphy_rx0 | isp0_mmu |
| RK3399 | rkisp1_1 | mipi_dphy_tx1rx1 | isp1_mmu |
| RK3288 | rkisp1 | mipi_phy_rx0 or mipi_phy_tx1rx1 | isp_mmu |
| PX30/RK3326 | rkisp1 | mipi_dphy_rx0 | isp_mmu |
| RK1808 | rkisp1 | mipi_dphy_rx | isp_mmu |

<!-- en PDF p.32; unit 231 -->

RK3399 hat zwei ISPs mit getrenntem DPHY/MMU. RK3288 hat einen ISP und wählbar rx0/tx1rx1. Boardseitig passende Knoten aktivieren und remote-endpoint verbinden. Beispiel arch/arm64/boot/dts/rockchip/rk3326-evb-lp3-v10-linux.dts: sensor, mipi_dphy_rx0, rkisp1, isp_mmu. data-lane von Sensor und mipi_dphy_rx0 muss bei MIPI korrekt und identisch sein.

<!-- en PDF p.33; unit 232 -->

## 7. RKCIF-Treiber

<!-- en PDF p.33; unit 233 -->

TODO — dieser Abschnitt ist im Original nicht ausgearbeitet.

## Unterschiede des Quellcodes

Der Haupttext folgt der jeweiligen Sprachquelle, RU/DE dem EN-Original. Abweichende Fragmente der anderen Quelle einschließlich Kommentar-/Layoutabweichungen bleiben unten erhalten. Unabhängige Beispiele, kein zusammenhängendes Skript; Quellparameter wurden nicht stillschweigend überschrieben.

**CN PDF p.6 · 13**

```text
static int __ov5695_power_on(struct ov5695 *ov5695)
{
  int ret;
  u32 delay_us;
  struct device *dev = &ov5695->client->dev;

  ret = clk_set_rate(ov5695->xvclk, OV5695_XVCLK_FREQ);

  if (clk_get_rate(ov5695->xvclk) != OV5695_XVCLK_FREQ)
   dev_warn(dev, "xvclk mismatched, modes are based on 24MHz\n");
  ret = clk_prepare_enable(ov5695->xvclk);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 1);

  ret = regulator_bulk_enable(OV5695_NUM_SUPPLIES, ov5695->supplies);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 0);

  if (!IS_ERR(ov5695->pwdn_gpio))
   gpiod_set_value_cansleep(ov5695->pwdn_gpio, 1);

  /* 8192 cycles prior to first SCCB transaction */
  delay_us = ov5695_cal_delay(8192);
  usleep_range(delay_us, delay_us * 2);

  return 0;
}
```

**CN PDF p.8 · 28**

```text
ov5695: ov5695@36 {
  compatible = "ovti,ov5695";
  reg = <0x36>;

  clocks = <&cru SCLK_CIF_OUT>;
  clock-names = "xvclk";

  avdd-supply = <&vcc2v8_dvp>;
  dovdd-supply = <&vcc1v8_dvp>;
  dvdd-supply = <&vdd1v5_dvp>;

  /*reset-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;*/
  pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;

  rockchip,camera-module-index = <0>;
  rockchip,camera-module-facing = "back";
  rockchip,camera-module-name = "TongJu";
  rockchip,camera-module-lens-name = "CHT842-MD";

  port {
   ucam_out: endpoint {
     remote-endpoint = <&mipi_in_ucam>;
```

**CN PDF p.9 · 29**

```text
     data-lanes = <1 2>;
   };
  };
};
```

**CN PDF p.10 · 45**

```text
# grep -rn LIBV4L_UTILS -- buildroot/configs/rockchip/camera.config
BR2_PACKAGE_LIBV4L_UTILS=y
```

**CN PDF p.11 · 56**

```text
[root@rk3326_64:/]# media-ctl -p -d /dev/media1
- entity 9: irs16x5c 1-003d (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]

- entity 10: irs16x5c 2-003d (1 pad, 1 link)
      type V4L2 subdev subtype Sensor flags 0
      device node name /dev/v4l-subdev3
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [DYNAMIC]
```

**CN PDF p.16 · 103**

```text
# v4l2-ctl -d /dev/video3 --set-ctrl 'exposure=1216,analogue_gain=10'
```

**CN PDF p.16 · 106**

```text
# media-ctl -d /dev/media0 \
  --set-v4l2 '"ov5695 7-0036":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]'
# v4l2-ctl -d /dev/video4 \
  --set-ctrl 'exposure=1216,analogue_gain=10' \
  --set-selection=target=crop,top=0,left=0,width=2592,height=1944 \
  --set-fmt-video=width=2592,height=1944,pixelformat=BG10 \
  --stream-mmap=3 \
  --stream-to=/tmp/mp.raw.out \
  --stream-count=1 \
  --stream-poll
```

**CN PDF p.24 · 182**

```text
int test_capture_mmap_quick()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  int count = 10;

  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  rkisp_set_fmt(ctx, 1920, 1080, ctx->fcc);

  if (rkisp_start_capture(ctx))
   return -1;

  do {
   buf = rkisp_get_frame(ctx, 0);

   /* Deal with the buffer */

   rkisp_put_frame(ctx, buf);
  } while (count--);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

**CN PDF p.25 · 191**

```text
int test_capture_ext_dmabuf()
{
  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  for (i = 0, ret = 0; i < buf_count; i++) {
   if (drmGetBuffer(dev.drm_fd, width, height, FORMAT, &buf[i]))
     goto out;
   dmabuf_fd[i] = buf[i].dmabuf_fd;
  }
  rkisp_set_fmt(ctx, width, height, ctx->fcc);
  rkisp_set_buf(ctx, buf_count, dmabuf_fd, buf[0].size);

  if (rkisp_start_capture(ctx))
   goto out;

  buf = rkisp_get_frame(ctx, 0);
  printf("The ext buf fd is: %d\n", buf->fd);
  rkisp_put_frame(ctx, buf);

  rkisp_stop_capture(ctx);

out:
  while (--i >= 0)
   drmPutBuffer(dev.drm_fd, &buf[i]);
```

**CN PDF p.26 · 192**

```text
  rkisp_close_device(ctx);
}
```

**CN PDF p.26 · 200**

```text
#include "uvc_control.h"
#include "uvc_video.h"

int test_uvc_mmap()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
```

**CN PDF p.27 · 201**

```text
  uint32_t flags = 0;
  int extra_cnt = 0;

  ctx = rkisp_open_device("/dev/video1", 0);

  if (ctx == NULL)
   return -1;

  if (rkisp_set_fmt(ctx, 640, 480, V4L2_PIX_FMT_NV12))
   return -1;

  if (rkisp_start_capture(ctx))
   return -1;

  flags = UVC_CONTROL_LOOP_ONCE;
  uvc_control_run(flags);

  do {
   buf = rkisp_get_frame(ctx, 0);
   extra_cnt++;
   uvc_read_camera_buffer(buf->buf, buf->fd, buf->size, &extra_cnt, sizeof(extra_cnt));

   rkisp_put_frame(ctx, buf);
  } while (1);

  uvc_control_join(flags);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

**CN PDF p.28 · 210**

```text
# tree drivers/media/platform/rockchip/isp1/
drivers/media/platform/rockchip/isp1/
├── capture.c  #包含 mp/sp 的配置及 vb2,帧中断处理
├── dev.c   #包含 probe、Sensor注册、clock、pipeline、iommu
├── isp_params.c #3A 相关参数设置
├── isp_stats.c #3A 相关统计
├── regs.c   #寄存器相关的读写操作
├── rkisp1.c  #对应 rkisp-isp-sd entity，包含从mipi/dvp接收数据及crop功能
```

{% endraw %}
