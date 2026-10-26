---

title: "Rockchip Linux 5.10 Camera: Sensoren, MIPI, 3A, Schnellstart und AOV"

description: "Rockchip Linux 5.10 Camera: Sensoren, MIPI, 3A, Schnellstart und AOV · V1.0.3"

excerpt: "Rockchip Linux 5.10 Camera: Sensoren, MIPI, 3A, Schnellstart und AOV"

translation_key: 186-rockchip-linux510-camera-troubleshooting

slug: 186-rockchip-linux510-camera-troubleshooting

lang: de

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Plattformreferenz: Hersteller V1.0.3, RV1106/RV1103/RV1103B/RV1106B; Linux 5.10+. Die vollständigen Kapitel behandeln Kameratreiber, Sensoranbindung, Erfassung und Fehlersuche. Konkrete ArmSoM-Board/BSP/SDK/Kernel-Kombinationen sind nicht validiert; Schaltplan, Schnittstellen, Versorgung/Takte, Treiber und IQ-Dateien prüfen. Beispiele/Messwerte stammen vom Hersteller, nicht von ArmSoM; keine Hardwarebefehle ausgeführt. ZH nutzt chinesische Originalbilder, EN/RU/DE englische.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.5; unit 0 -->

## 1. Sensor in Betrieb nehmen

<!-- en PDF p.5; unit 1 -->

### 1.1 Sensor-ID fehlt: I2C-Kommunikationsfehler

<!-- en PDF p.5; unit 2 -->

Wird die Sensor-ID nicht erkannt, führt die Quelle dies nicht auf RKISP/RKCIF, sondern auf die Einschaltsequenz zurück. In folgender Reihenfolge prüfen:

<!-- en PDF p.5; unit 3 -->

1. Stimmt die 7-Bit-i2c-slave-id? Wurde versehentlich eine 8-Bit-Adresse eingetragen?

<!-- en PDF p.5; unit 4 -->

2. Gibt es mclk mit korrekter Amplitude? Üblich sind 24MHz, teils 27MHz.

<!-- en PDF p.5; unit 5 -->

3. Entspricht die Einschaltfolge für avdd, dovdd, dvdd, power down, reset usw. den Vorgaben?

<!-- en PDF p.5; unit 6 -->

#### 1.1.1 Was ist eine 7-Bit-Adresse?

<!-- en PDF p.5; unit 7 -->

Das niederwertigste Bit LSB der 8-Bit-Angabe bezeichnet R/W; die oberen sieben Bits sind die benötigte i2c slave id.

<!-- en PDF p.5; unit 8 -->

#### 1.1.2 Nach dem Einschalten fehlen 24M-mclk und vdd

<!-- en PDF p.5; unit 9 -->

Der Treiber aktiviert Takt und Versorgung normalerweise nur bei Bedarf; nach dem Booten sind sie standardmäßig aus. Zum Messen kann die Implementierung von power_off() vorübergehend auskommentiert werden, damit die Versorgung eingeschaltet bleibt.

<!-- en PDF p.5; unit 10 -->

#### 1.1.3 24M-mclk weiterhin nicht messbar

<!-- en PDF p.5; unit 11 -->

Die Oszilloskopbandbreite prüfen; die Quelle empfiehlt mindestens 48M.

<!-- en PDF p.5; unit 12 -->

1. Aktiviert der Sensor mclk nicht korrekt, die Taktoperationen in drivers/media/i2c/ov5695.c vergleichen.

<!-- en PDF p.5; unit 13 -->

2. Ein anderes Modul kann den GPIO belegen; normalerweise erscheint ein Hinweis im Kernel-Log. Mit io lassen sich pin-ctrl-Register prüfen.

<!-- en PDF p.6; unit 14 -->

#### 1.1.4 Einschaltsequenz prüfen

<!-- en PDF p.6; unit 15 -->

Das Datasheet beschreibt Reihenfolge und Abstände der Versorgungsspannungen; mit dem Oszilloskop prüfen. Manche Sensoren wie ov5695 verlangen keine Reihenfolge für vdd und verwenden regulator_bulk. Andere wie ov2685.c benötigen getrennte Regler, etwa avdd_regulator und dovdd_regulator. Nach tatsächlichen Anforderungen auswählen.

<!-- en PDF p.6; unit 16 -->

### 1.2 Standardwerte exp_def, hts_def und vts_def

<!-- en PDF p.6; unit 17 -->

<!-- en PDF p.6; unit 18 -->

Werte beim Sensorhersteller erfragen oder Register und Initialisierungswerte im Datasheet bzw. Registersatz suchen. Beispiel ov2685.c:

<!-- en PDF p.6; unit 19 -->

```text
#define OV2685_REG_VTS                  0x380e

...

        {0x380e, 0x05},
        {0x380f, 0x0e},

...

                .vts_def = 0x050e,
```

<!-- en PDF p.6; unit 20 -->

0x380e und 0x380f sind die vts-Register. Wird 0x050e initialisiert, ist vts_def=0x050e. exp und hts verwenden Standardwerte aus dem Datasheet. Soll die Anwendung Belichtung und Bildrate nicht ändern, sind exp, hts und vts unnötig; RAW-Sensoren benötigen sie normalerweise.

<!-- en PDF p.6; unit 21 -->

### 1.3 Werte für link_freq und pixel_rate

<!-- en PDF p.6; unit 22 -->

<!-- en PDF p.6; unit 23 -->

link_freq ist die reale MIPI-Taktfrequenz, nicht 24M-mclk, sondern MIPI dn/dp clk. Hersteller oder Datasheet prüfen. Der Wert ist normalerweise mindestens so groß wie das Ergebnis folgender Formel in Hz:

<!-- en PDF p.6; unit 24 -->

```text
link_freq = width * height * fps * bits_per_pixel / lanes / 2
```

<!-- en PDF p.7; unit 25 -->

Ist link_freq unbekannt, mit dem Oszilloskop messen. pixel_rate bezeichnet Pixel pro Sekunde und ergibt sich aus link_freq wie folgt:

<!-- en PDF p.7; unit 26 -->

```text
pclk = link_freq * 2 * lanes / bits_per_pixel
```

<!-- en PDF p.7; unit 27 -->

### 1.4 Erfolgreichen Sensorstart bestätigen

<!-- en PDF p.7; unit 28 -->

Zuerst muss die Sensor-ID lesbar sein, also I2C fehlerfrei arbeiten. media-ctl -p -d /dev/media0 sollte Name, Auflösung und weitere Sensordaten anzeigen. Beispiel:

<!-- en PDF p.7; unit 29 -->

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
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                <- "m00_b_sc450ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc450ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

<!-- en PDF p.7; unit 30 -->

Fehlen gebaute/installierte media-ctl/v4l2-ctl, per dmesg die Sensorerkennung prüfen. Bei Aufnahme muss MIPI ohne MIPI-/ISP-Fehler Daten liefern und die Anwendung Frames erhalten.

<!-- en PDF p.8; unit 31 -->

### 1.5 Sensor-Crop-Ausgabe einstellen

<!-- en PDF p.8; unit 32 -->

Für kleinere Ausgabe Sensortreiber und IQ-Datei ändern. Im Treiber xxxx_get_selection implementieren. Beispiel sc530ai: 2880x1616 auf 2560x1440 zuschneiden:

<!-- en PDF p.8; unit 33 -->

```text
  +++ b/drivers/media/i2c/sc530ai.c
  @@ -1593,8 +1593,8 @@ static int sc530ai_open(struct v4l2_subdev *sd, struct
v4l2_subdev_fh *fh)
   }
   #endif

  -#define DST_WIDTH 2880
  -#define DST_HEIGHT 1616
  +#define DST_WIDTH 2560
  +#define DST_HEIGHT 1440
```

<!-- en PDF p.8; unit 34 -->

IQ-Auflösung an die zugeschnittene Ausgabe anpassen; Anleitung im Abschnitt zur IQ-Auflösung (§4.6, Quellverweis nennt Abschnitt 4).

<!-- en PDF p.8; unit 35 -->

### 1.6 i2ctransfer verwenden

<!-- en PDF p.8; unit 36 -->

I2C-Sensorregister müssen bei der Fehlersuche gelesen/geschrieben werden. Übliche i2ctransfer-Verwendung folgt.

<!-- en PDF p.8; unit 37 -->

```text
# i2ctransfer -f -y 4 w3@0x32 0x43 0x24 0x18

4: Represents the I2C bus ID (which can be 0, 1, 2, 3, ...)
w: Represents write
3: Represents writing 3 Bytes
0x32: Represents the I2C device address
The following three data represent the data to be written, where 0x4324 is
assumed to be a 16-bit register address, and 0x18 is the value to be written.

# i2ctransfer -f -y 4 w1@0x30 0x08 r3

4: Represents the I2C bus number (which can be 0, 1, 2, 3, ...)
w: Indicates write
1: Indicates writing 1 Byte
0x30: Represents the I2C device address
r: Represents read
3: Represents reading 3 Bytes

This command means to read 3 Bytes from the address offset by 0x08 from 0x30,
where the number following r indicates the number of bytes to be read.
```

<!-- en PDF p.9; unit 38 -->

Weitere i2c-tools-Beispiele: https://blog.csdn.net/qq_42952079/article/details/125217208. Passende 32-/64-Bit-Version verwenden. Fehlt das Werkzeug, herunterladen oder vom Entwicklungsteam beziehen.

<!-- en PDF p.9; unit 39 -->

### 1.7 Sensor-AVL

<!-- en PDF p.9; unit 40 -->

RGB-Sensor-AVL: https://redmine.rockchip.com.cn/projects/rockchip_camera_module_support_list/camera. Dort stehen Moduldaten. Für andere Sensoren, etwa YUV, im Kernel unter drivers/media/i2c suchen; laut Quelle wurden diese Treiber von Rockchip abgestimmt.

<!-- en PDF p.9; unit 41 -->

### 1.8 Dokument zur Sensortreiberfehlersuche

<!-- en PDF p.9; unit 42 -->

Für neue Sensoren im RV1106-/RV1103-SDK siehe /docs/zh/isp/&lt;Rockchip_Driver_Guide_VI_CN_v1.1.5.pdf&gt;.

<!-- en PDF p.9; unit 43 -->

## 2. MIPI-/ISP-Fehler

<!-- en PDF p.9; unit 44 -->

Bei der ersten Sensorabstimmung treten häufig auf:

<!-- en PDF p.9; unit 45 -->

1. Keine Frames und keine ISP-/MIPI-Fehler.

<!-- en PDF p.9; unit 46 -->

2. Fortlaufende MIPI-Fehlermeldungen.

<!-- en PDF p.9; unit 47 -->

3. ISP meldet PIC_SIZE_ERROR.

<!-- en PDF p.9; unit 48 -->

4. Gelegentliche MIPI-Fehler.

<!-- en PDF p.9; unit 49 -->

5. MIPI-Fehler bis zum Systemabsturz.

<!-- en PDF p.9; unit 50 -->

### 2.1 Welche MIPI-Parameter einstellen?

<!-- en PDF p.9; unit 51 -->

Vier Parameter prüfen: Sensorauflösung; YUV/RGB RAW und 8/10/12 Bit; tatsächliches link_freq; Lane-Anzahl, korrekt an zwei Stellen im DTS.

<!-- en PDF p.10; unit 52 -->

### 2.2 Keine Frames und keine ISP-/MIPI-Fehler

<!-- en PDF p.10; unit 53 -->

1. Kernel-Log prüfen, etwa mit dmesg \| grep MIPI.

<!-- en PDF p.10; unit 54 -->

2. I2C-Lese-/Schreibfehler suchen. Fehlt die Registerkonfiguration, wurden Initialisierung und Ausgang eventuell nicht aktiviert.

<!-- en PDF p.10; unit 55 -->

3. MIPI-clk- und Datenleitungen messen. Fehlt ein Signal, Sensorinitialisierung und Hardware untersuchen.

<!-- en PDF p.10; unit 56 -->

4. Gibt es MIPI-Signal, aber weder Fehler noch Daten: Parameter aus §2.1 erneut prüfen; fehlerfreie I2C-Kommunikation und vollständige Registerinitialisierung sicherstellen. Erst s_stream() darf MIPI aktivieren; davor, insbesondere in s_power(), darf kein Signal anliegen. Der Empfänger ist vorher nicht bereit und kann den SOT-Protokollanfang verlieren. Sensor-clock-lane von continuous auf non-continuous umstellen.

<!-- en PDF p.10; unit 57 -->

### 2.3 Befehl korrekt, aber select timeout

<!-- en PDF p.10; unit 58 -->

Bei RAW-Aufnahme fehlen manchmal Daten und serielle Fehler, dennoch erscheint select timeout. Prüfungen:

<!-- en PDF p.10; unit 59 -->

1. DPHY-stop-state anhand TRM prüfen, um Eingangsdaten zu erkennen. Beispiel RK3588 CSI0:

<!-- en PDF p.10; unit 60 -->

```text
io -4 -l 0x100 0xfdd30000
```

<!-- en PDF p.10; unit 61 -->

Das Register zehnmal nacheinander lesen. Bei erkanntem MIPI-Signal sollte stop state zwischen 0 und 1 wechseln.

<!-- en PDF p.10; unit 62 -->

2. MIPI-Signale mit dem Oszilloskop messen.

<!-- en PDF p.10; unit 63 -->

3. Sensor-MIPI-Ausgaberegister prüfen; i2ctransfer zum Lesen empfohlen.

<!-- en PDF p.10; unit 64 -->

4. Sleep-/Reset-Pegel prüfen.

<!-- en PDF p.11; unit 65 -->

### 2.4 MIPI-Fehler

<!-- en PDF p.11; unit 66 -->

#### 2.4.1 MIPI-Fehlertabellen

<!-- en PDF p.11; unit 67 -->

Für RK3288/RK3399/RK3368:

<!-- en PDF p.11; unit 68 -->

| Fehlerbit | Kurzname | Beschreibung |
| --- | --- | --- |
| 25 | ADD_DATA_OVFLW | Zusatzdaten-FIFO übergelaufen |
| 24 | FRAME_END | Bild normal empfangen, kein Fehler |
| 23 | ERR_CS | Prüfsummenfehler |
| 22 | ERR_ECC1 | 1-Bit-ECC-Fehler |
| 21 | ERR_ECC2 | 2-Bit-ECC-Fehler |
| 20 | ERR_PROTOCOL | Paketbeginn innerhalb des aktuellen Pakets |
| 19:16 | ERR_CONTROL | PPI-Steuerfehler, ein Bit je Lane |
| 15:12 | ERR_EOT_SYNC | MIPI-EOT-Synchronisationsfehler (Übertragungsende), ein Bit je Lane |
| 11:8 | ERR_SOT_SYNC | MIPI-SOT-Synchronisationsfehler (Übertragungsbeginn), ein Bit je Lane |
| 7:4 | ERR_SOT | MIPI SOT (Übertragungsbeginn), ein Bit je Lane |
| 3:0 | SYNC_FIFO_OVFLW | Synchronisations-FIFO übergelaufen, ein Bit je Lane |

<!-- en PDF p.11; unit 69 -->

Für RK3326/PX30/RK1808 gelten drei Fehlertabellen:

<!-- en PDF p.11; unit 70 -->

| Fehlerbit ERR1 | Kurzname | Beschreibung |
| --- | --- | --- |
| 28 | ERR_ECC | ECC-Fehler |
| 27:24 | ERR_CRC | CRC-Fehler |
| 23:20 | ERR_FRAME_DATA | Bildübertragung abgeschlossen, jedoch mindestens ein CRC-Fehler |
| 19:16 | ERR_F_SEQ | Bildnummer nicht wie erwartet fortlaufend |
| 15:12 | ERR_F_BNDRY | Bildanfang und -ende passen nicht zusammen |
| 11:8 | ERR_SOT_SYNC | MIPI-SOT-Synchronisationsfehler (Übertragungsbeginn), ein Bit je Lane |
| 7:4 | ERR_EOT_SYNC | MIPI-EOT-Synchronisationsfehler (Übertragungsende), ein Bit je Lane |

<!-- en PDF p.12; unit 71 -->

| Fehlerbit ERR2 | Kurzname | Beschreibung |
| --- | --- | --- |
| 19:16 | ERR_CONTROL |  |
| 15:12 | ERR_ID |  |
| 11:8 | ERR_ECC_CORRECTED |  |
| 7:4 | ERR_SOTHS | PHY-SOTHS-Fehler |
| 3:0 | ERR_ESC | PHY-ESC-Fehler |

<!-- en PDF p.12; unit 72 -->

Typische Fehler werden nachfolgend erläutert.

<!-- en PDF p.12; unit 73 -->

#### 2.4.2 SOT/SOT_SYNC

<!-- en PDF p.12; unit 74 -->

SOT (Start of Transmission) und SOT_SYNC betreffen Start/Synchronisation von MIPI. SOT muss MIPI_D-PHY_Specification entsprechen. High-Speed Data Transmission, Start-of-Transmission Sequence, HS Data Transmission Burst, High-Speed Clock Transmission und Global Operation Timing Parameters prüfen. Lief der Sensor andernorts, ist ein grundlegender Protokollverstoß weniger wahrscheinlich. Erfolgreichen MIPI-Betrieb beim Hersteller bestätigen, link_freq für korrektes Ths-settle prüfen und eine statt mehrerer Lanes testen. Kabel, Stecker und Kontakte auf Lockerung/Beschädigung prüfen. Stabile Versorgung und spezifikationsgerechte Spannungen sicherstellen. Taktfrequenz und Leitungsverzögerungen anhand Dokumentation/Herstellerempfehlung abstimmen.

<!-- en PDF p.13; unit 75 -->

Protokollkonfiguration beider Geräte abgleichen, einschließlich Takt, Verzögerung und Modus. Logs nach Typ, Ort und Zeitpunkt von SOT/SOT_SYNC untersuchen. Logik-/Protokollanalysator oder Signalgenerator zur Beobachtung nutzen. Ursachen umfassen Verbindung, Versorgung und Protokoll; Hardware, Software und Kommunikation schrittweise prüfen.

<!-- en PDF p.13; unit 76 -->

#### 2.4.3 CRC/Checksum(CS), ECC/ECC1/ECC2

<!-- en PDF p.13; unit 77 -->

ECC/CS zeigen unvollständige oder beschädigte Daten. Zuerst Signale prüfen; eine Lane testen, da Mehrlane-Synchronisation ECC verursachen kann. Kabel/Stecker/Kontakte und Versorgung auf Stabilität bzw. richtige Spannung prüfen. Takt/Verzögerungen müssen im Gerätebereich liegen; D-PHY-/C-PHY-Einstellungen müssen zusammenpassen. Fehlerlogs nach Typ, Ort und Zeit untersuchen.

<!-- en PDF p.14; unit 78 -->

MIPI mit Analysatoren/Generatoren beobachten. Helfen die Prüfungen nicht, gerätespezifische Unterstützung beim Hersteller anfragen. ECC kann Hardwarefehler, Störungen oder falsche Konfiguration bedeuten; Hardware, Software und Kommunikation schrittweise prüfen.

<!-- en PDF p.14; unit 79 -->

#### 2.4.4 ERR_PROTOCOL/ERR_F_BNDRY

<!-- en PDF p.14; unit 80 -->

Erwartetes EOT/SOT fehlt; beide müssen paarweise auftreten. Wellenform messen. Protokoll, Takt, Verzögerungen und Modus anhand Spezifikation prüfen. Stabile Versorgung sowie Kabel/Stecker/Kontakte sicherstellen; Beschädigungen verursachen Übertragungsabbrüche. Timing nach Herstellerempfehlungen optimieren. Logs liefern Typ/Ort/Zeit von ERR_PROTOCOL/ERR_F_BNDRY; Logik-/Protokollanalysatoren und Signalgeneratoren helfen bei der Lokalisierung.

<!-- en PDF p.15; unit 81 -->

Mögliche Ursachen sind Protokollabweichung, Verbindung und Timing. Lösung nach konkreter Situation durch schrittweise Hardware-/Software-/Kommunikationsprüfung bestimmen.

<!-- en PDF p.15; unit 82 -->

#### 2.4.5 Frames vorhanden, gelegentliche MIPI-Fehler

<!-- en PDF p.15; unit 83 -->

<!-- en PDF p.15; unit 84 -->

Fehlertabellen beachten und Signalfehler hardwareseitig prüfen. Nur beim Aufnahmestart auftretende Fehler können von ungültigen MIPI-Signalen beim Einschalten stammen. Versuchen: 1. Vollständige Registerinitialisierung in s_power() verlegen: Der MIPI-Empfänger ignoriert zu diesem Zeitpunkt noch alle Daten. 2. Am Ende von s_power() den Ausgang mit stop_stream() ausschalten. 3. In start_stream() und stop_stream() ausschließlich MIPI-Ausgabe ein-/ausschalten.

<!-- en PDF p.15; unit 85 -->

#### 2.4.6 Viele MIPI-Fehler oder Absturz

<!-- en PDF p.15; unit 86 -->

Verschärfter Fall aus §2.4.5: Ungültige MIPI-Signale verursachen pegelgesteuerte Interrupts, Interrupt-Sturm und Absturz. Maßnahmen aus §2.4.5 prüfen.

<!-- en PDF p.15; unit 87 -->

#### 2.4.7 ISP PIC_SIZE_ERROR

<!-- en PDF p.15; unit 88 -->

Erwartete Zeilen/Spalten fehlen. Alle Auflösungsstufen prüfen, zuerst MIPI-Fehler beheben. Zu niedriger DDR-Takt kann mangelnde Reaktion verursachen; bei maximalem Takt testen:

<!-- en PDF p.15; unit 89 -->

```text
echo performance > /sys/class/devfreq/dmc/governor
```

<!-- en PDF p.16; unit 90 -->

2. Ist eine nachfolgende Stufe größer als die vorherige? media-ctl -p -d /dev/media0 zeigt die Topologie. Es muss Sensor == MIPI_DPHY &gt;= isp_sd input &gt;= isp_sd output gelten; ohne manuelle Änderung normalerweise erfüllt. 3. Gibt der Sensor die richtige Auflösung aus? Deklarierte Größe im Treiber verkleinern. Beispiel ov7251.c mit 640x480:

<!-- en PDF p.16; unit 91 -->

```text
static const struct ov7251_mode supported_modes[] = {
          {
                  .width = 640,
                  .height = 480,
```

<!-- en PDF p.16; unit 92 -->

width/height etwa auf 320x240 reduzieren, ohne Register zu ändern; damit prüfen, ob die konfigurierte Größe die tatsächliche Sensorausgabe übersteigt.

<!-- en PDF p.16; unit 93 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 320,
                .height = 240,
```

<!-- en PDF p.16; unit 94 -->

## 3. Bilder erfassen

<!-- en PDF p.16; unit 95 -->

Dieses Kapitel behandelt typische Fragen zur Bilderfassung.

<!-- en PDF p.16; unit 96 -->

### 3.1 Aufnahmemethoden

<!-- en PDF p.16; unit 97 -->

RKISP/RKCIF unterstützen V4L2. Zuerst mit v4l2-ctl aus v4l-utils die Ausgabe prüfen. Es speichert, zeigt aber nicht an; dafür mplayer unter Ubuntu/Debian oder 7yuv unter Windows nutzen. Details in Rockchip_Developer_Guide_Linux_Camera_CN.pdf und v4l2-ctl --help. Auch rockit-Demo-Binaries können Bilder erfassen/speichern:

<!-- en PDF p.17; unit 98 -->

```text
Common commands include:
# Capture raw image
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -n /dev/video0 -f 131076

# Capture yuv image from the mainpath channel and save it to a file. The file
directory is /data/test_0_0_0.bin, which can be opened with tools like 7yuv.
The file name is based on the dev id, pipe id, and chn id.
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -o 1

# Capture yuv image from the mainpath channel, encode it, and write it to a
file. The file is saved in /data/venc_0.bin, and the file name is related to
the chn id.
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 1 -l 10 -o 1
...
```

<!-- en PDF p.17; unit 99 -->

Weitere Demos stehen in der rockit-Dokumentation und deren Hilfe. Für Echtzeitvorschau das einfache SDK-Demo nutzen:

<!-- en PDF p.17; unit 100 -->

```text
# Use the simple_vi_bind_venc_rtsp demo for real-time preview via rtsp
(configure the board-side IP with tools like vlc or potplayer).
simple_vi_bind_venc_rtsp -I 0 -w 1920 -h 1080 (rtsp://ip/live/0)
```

<!-- en PDF p.17; unit 101 -->

### 3.2 Falsche Farben und Helligkeit erfasster Bilder

<!-- en PDF p.17; unit 102 -->

Die Prüfung hängt vom Sensor ab:

<!-- en PDF p.17; unit 103 -->

1. Bei RAW RGB wie RGGB/BGGR müssen AE, AF und AWB korrekt arbeiten; siehe 3A-Abschnitt. Danach Interpretations-/Anzeigeformat und eine mögliche Vertauschung der UV-Komponenten prüfen.

<!-- en PDF p.17; unit 104 -->

2. Bei YUV, RGB565 oder RGB888 läuft der ISP im Bypass. Bei falschen Farben Sensorausgabeformat und UV-Reihenfolge prüfen. Sind diese korrekt, den Sensorhersteller kontaktieren; ebenso bei offensichtlich falscher Helligkeit.

<!-- en PDF p.18; unit 105 -->

### 3.3 ISP-Topologie und media-ctl

<!-- en PDF p.18; unit 106 -->

<!-- en PDF p.18; unit 107 -->

RKISP/RKCIF können mehrere Sensoren zeitmultiplexen. RKISP bietet außerdem mehrstufiges Cropping. Die Knoten bilden eine Kette und werden einzeln per media-ctl konfiguriert. Details: Rockchip_Developer_Guide_Linux_Camera_CN.pdf.

<!-- en PDF p.18; unit 108 -->

#### 3.3.1 Mehrere Sensoren an einem ISP

<!-- en PDF p.18; unit 109 -->

Nur Zeitmultiplexbetrieb ist möglich. Mehrere Sensoren im DTS an die MIPI DPHY anbinden und danach mit media-ctl umschalten.

<!-- en PDF p.18; unit 110 -->

### 3.4 Entspricht erfasstes RAW dem Original?

<!-- en PDF p.18; unit 111 -->

<!-- en PDF p.18; unit 112 -->

Beim RAW-Bypass (RGGB/BGGR) ist 8-Bit-Ausrichtung erforderlich. Fehlende niederwertige Bits werden mit Nullen gefüllt: 8-/16-Bit-Originale bleiben unverändert; 10-/12-Bit-Pixel werden unten mit Nullen auf 16 Bit ergänzt. Nur das MP-Videogerät unterstützt RAW-Ausgabe; SP nicht.

<!-- en PDF p.18; unit 113 -->

### 3.5 Gleichzeitige Ausgabe über MP und SP

<!-- en PDF p.18; unit 114 -->

Ein Sensorbild kann gleichzeitig getrennt über SP und MP beschnitten und formatkonvertiert werden. Die Fähigkeiten unterscheiden sich; siehe Rockchip_Developer_Guide_Linux_Camera_CN.pdf. Parallelausgabe ist nur mit RGB/YUV auf beiden Pfaden möglich. Gibt MP RAW aus, liefert SP kein Bild.

<!-- en PDF p.18; unit 115 -->

### 3.6 Vergrößerung im ISP

<!-- en PDF p.18; unit 116 -->

Hardwareseitig vorhanden, aber nicht empfohlen und im Treiber standardmäßig deaktiviert.

<!-- en PDF p.19; unit 117 -->

### 3.7 Rotation im ISP

<!-- en PDF p.19; unit 118 -->

Nein. Für Spiegelung/Umkehr zuerst die Sensorfunktion nutzen, falls vorhanden; dies ist am effizientesten. Andernfalls RGA verwenden: Code und Demos unter external/linux-rga/, Dokumentation unter docs/.

<!-- en PDF p.19; unit 119 -->

### 3.8 Graustufenbilder GREY erfassen

<!-- en PDF p.19; unit 120 -->

Bei YUV-Ausgabe des ISP oder Y8-Ausgabe des Sensors kann die Anwendung direkt V4L2_PIX_FMT_GREY (FourCC GREY) erfassen.

<!-- en PDF p.19; unit 121 -->

### 3.9 MP, SP und BP unterscheiden

<!-- en PDF p.19; unit 122 -->

Topologie mit media-ctl -p -d /dev/media0 prüfen; bei mehreren Geräten auch /dev/media1 und /dev/media2 testen. Auszug:

<!-- en PDF p.19; unit 123 -->

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              // Indicates that this
entity is MP (MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 // The corresponding
device node is /dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              // Indicates that this
entity is SP (SelfPath)
            type Node subtype V4L flags 0
            device node name /dev/video2                 // The corresponding
device node is /dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

<!-- en PDF p.19; unit 124 -->

Ohne media-ctl lässt sich unter /sys/ suchen:

<!-- en PDF p.20; unit 125 -->

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # MP node corresponds to
/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # SP node corresponds to
/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

<!-- en PDF p.20; unit 126 -->

RV1106/RV1103 besitzen BP und Downsampling-Kanäle für MP/BP. Die vollständige Knotenausgabe folgt; der englische Originalsatz erwähnt BP doppelt.

<!-- en PDF p.20; unit 127 -->

```text
# media-ctl -p -d /dev/media1
...
- entity 6: rkisp_mainpath (1 pad, 1 link)
            type Node subtype V4L flags 0
            device node name /dev/video11
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 12: rkisp_selfpath (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video12
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 18: rkisp_bypasspath (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video13
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 24: rkisp_mainpath_4x4sampling (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video14
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 30: rkisp_bypasspath_4x4sampling (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video15
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]
 ...
```

<!-- en PDF p.20; unit 128 -->

### 3.10 Geteiltes Bild

<!-- en PDF p.20; unit 129 -->

Störungen auf MIPI können Bildteilungen verursachen. Störungen auf Daten- oder Taktleitungen reproduzieren das Problem; die Trennposition variiert.

<!-- en PDF p.21; unit 130 -->

Zwei Fälle: Bildteilung beim Start entsteht, wenn das Gerät vor der Aufnahme nicht zurückgesetzt wurde; Soft- und Hard-Reset sind erforderlich. Beispiel RN6725V1 aus dem Original:

<!-- en PDF p.21; unit 131 -->

![Originalabbildung · EN PDF p.21](/docs/rockchip-linux510-camera-troubleshooting/assets/en-p021-figure-01.png)

```c
ret = rn6752_write(client, 0x80, 0x31);
usleep_range(200, 500);
ret |= rn6752_write(client, 0x80, 0x30);
if (ret)
{
    dev_err(&client->dev, "rn6752 soft reset failed\n");
    return ret;
}
```

<!-- en PDF p.21; unit 132 -->

Bildteilung im Betrieb kann bei Hardwarestörungen auftreten. Beispiel: CSI0 betroffen, CSI1 nicht, weil CSI0 über VICP läuft und CSI1 direkt zum ISP führt. Fehlt die Bildfehlererkennung in VICAP, diese für den CIF-Kanal ergänzen; siehe VICAP-Fehlerreset.

<!-- en PDF p.21; unit 133 -->

### 3.11 ISP-Takt erhöhen

<!-- en PDF p.21; unit 134 -->

Bei RV1106/RV1103 kann langsame Ausgabe, langsame ISP-Verarbeitung oder Systemverzögerung eine Takterhöhung erfordern. Vorgehen:

<!-- en PDF p.21; unit 135 -->

```text
# cat /proc/clk/summary | grep isp
        clk_core_isp3p2       1        1        0   339428572          0     0
 50000
        aclk_isp3p2           1        1        0   339428572          0     0
 50000
        hclk_isp3p2           1        1        0   148500000          0     0
 50000
        isp0clk_vicap         2        2        0           0          0     0
 50000
```

<!-- en PDF p.21; unit 136 -->

Takt setzen: echo [clk_name] [rate(Hz)] &gt; /proc/clk/rate. Beispiel:

<!-- en PDF p.22; unit 137 -->

```text
# echo clk_core_isp3p2 420000000 > /proc/clk/rate

# cat /proc/clk/summary | grep isp
            aclk_isp3p2           1        1        0   339428572          0
0  50000
            hclk_isp3p2           1        1        0   148500000          0
0  50000
            clk_core_isp3p2       1        1        0   420000000          0
0  50000
            isp0clk_vicap         2        2        0           0          0
0  50000
```

<!-- en PDF p.23; unit 138 -->

## 4. 3A-Fragen

<!-- en PDF p.23; unit 139 -->

RAW BAYER RGB wie RGGB/BGGR benötigt RKISP-Verarbeitung. 3A-Verhalten hängt von camera_engine_rkaiq ab; möglichst aktualisieren. Modulunterstützung prüfen: Unterstützte Module haben eine JSON-Datei unter media/isp/camera_engine_rkaiq/rkaiq/iqfiles/. Andernfalls Modultuning über den Lieferanten-Support anfordern.

<!-- en PDF p.23; unit 140 -->

### 4.1 Version von camera_engine_rkaiq prüfen

<!-- en PDF p.23; unit 141 -->

Im Quellcode:

<!-- en PDF p.23; unit 142 -->

```text
# grep RK_AIQ_VERSION_REAL media/isp/camera_engine_rkaiq/rkaiq/RkAiqVersion.h

#define RK_AIQ_VERSION_REAL_V "v5.0x5.0"
```

<!-- en PDF p.23; unit 143 -->

#### 4.1.1 Erforderliche rkisp-Treiberversion für camera_engine_rkaiq

<!-- en PDF p.23; unit 144 -->

<!-- en PDF p.23; unit 145 -->

Eine bestimmte rkisp-Version wird benötigt; den Treiber aktuell halten. Der Originalsatz nennt camera_engine_rkisp. ISP-Version im Kernelquellcode prüfen:

<!-- en PDF p.23; unit 146 -->

```text
# grep RKISP_DRIVER_VERSION drivers/media/platform/rockchip/isp/version.h
```

<!-- en PDF p.23; unit 147 -->

ISP-Version im Kernelprotokoll prüfen:

<!-- en PDF p.23; unit 148 -->

```text
  # dmesg | grep "version"

dmesg | grep "version"
[    0.848252] udevd[65]: starting version 3.2.7
[    3.889404] imx415 4-001a: driver version: 00.01.08
[    3.967388] os04a10 4-0036: driver version: 00.01.05
[    4.084418] sc4336 4-0030-3: driver version: 00.01.01
[    4.114867] sc3336 4-0030-1: driver version: 00.01.01
[    4.152066] sc530ai 4-0030: driver version: 00.01.01
[    4.180572] sc200ai 4-0030-6: driver version: 00.01.09
[    4.237776] rkcif rkcif-mipi-lvds: rkcif driver version: v00.02.00
[    4.260419] rkisp rkisp-vir0: rkisp driver version: v02.05.00
```

<!-- en PDF p.24; unit 149 -->

### 4.2 camera_engine_rkaiq aktualisieren

<!-- en PDF p.24; unit 150 -->

Das Original kündigt drei Teile an; tatsächlich aufgeführte Punkte folgen:

<!-- en PDF p.24; unit 151 -->

1. camera_engine_rkaiq liegt unter media/isp/camera_engine_rkaiq im SDK. Mit git/repo aktualisieren; nur dieses Verzeichnis kann ohne die übrigen SDK-Verzeichnisse aktualisiert werden.

<!-- en PDF p.24; unit 152 -->

2. Kernel entsprechend den Anforderungen aktualisieren. git log unter media/isp/camera_engine_rkaiq nennt die benötigte rkisp-Version. Beispiel:

<!-- en PDF p.24; unit 153 -->

```text
 # git log
commit 3d71d22e1e1cc080cd299b914e4e8daac2a58329
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Sun Feb 18 10:17:18 2024 +0800

    release v5.0x5.0

    cherry-pick:
    6227d46 Revert "fastboot: remove rk_aiq_uapi2_sysctl_preInit_tb_info"
    f8efdd6 Revert "fastboot: _first_awb_cfg use pointer replace struct"
```

<!-- en PDF p.24; unit 154 -->

### 4.3 Korrekte 3A-Funktion prüfen

<!-- en PDF p.24; unit 155 -->

Farbe und Belichtung erfasster Bilder prüfen sowie den Hintergrundprozess rkisp_3A_server:

<!-- en PDF p.24; unit 156 -->

```text
# ps -ef | grep rkisp_3A_server
  706 root      9176 S    /usr/bin/rkisp_3A_server --mmedia=/dev/media1
  746 root      2408 S    grep rkisp_3A_server
# pidof rkisp_3A_server
706
```

<!-- en PDF p.24; unit 157 -->

Hier hat rkisp_3A_server die PID 706.

<!-- en PDF p.24; unit 158 -->

#### 4.3.1 Kein rkisp_3A_server-Prozess

<!-- en PDF p.24; unit 159 -->

Existenz von /usr/bin/rkisp_3A_server prüfen; fehlt die Datei, Version und Build von camera_engine_rkaiq prüfen. In /var/log/syslog nach rkisp_3A-Fehlern suchen, insbesondere fehlenden/inkompatiblen IQ-Dateien xxx.json. rkisp_3A_server --mmedia=/dev/media0 in einer Shell ausführen; das zum /dev/video passende media-Gerät wählen. In einer zweiten Shell Bilder erfassen und Serverfehler auswerten.

<!-- en PDF p.25; unit 160 -->

#### 4.3.2 Start von rkisp_3A_server

<!-- en PDF p.25; unit 161 -->

Im Linux SDK startet /etc/init.d/S40rkisp_3A den Server im Hintergrund. Fehlt die Datei, camera_engine_rkisp-Version und buildroot-Paketbuildskript prüfen.

<!-- en PDF p.25; unit 162 -->

#### 4.3.3 Name und Pfad der Sensor-IQ-Datei

<!-- en PDF p.25; unit 163 -->

Der Name besteht aus Sensortyp (z. B. sc200ai), DTS-Modulname (rv1106g2 rk evb: rockchip,camera-module-name = "CMK-OT2115-PC1";) und Objektivname (rockchip,camera-module-lens-name = "30IRC-F16";). Daraus ergibt sich sc200ai_CMK-OT2115-PC1_30IRC-F16.json unter /etc/iqfiles/. Groß-/Kleinschreibung beachten.

<!-- en PDF p.25; unit 164 -->

### 4.4 Manuelle Belichtung

<!-- en PDF p.25; unit 165 -->

Zuerst rkisp_3A_server beenden. Danach rkisp_demo.cpp oder den Quellcode von librkisp_api.so als Referenz verwenden.

<!-- en PDF p.25; unit 166 -->

### 4.5 librkaiq-Protokoll aktivieren

<!-- en PDF p.25; unit 167 -->

Die Umgebungsvariable persist_camera_engine_log legt folgende Bits fest:

<!-- en PDF p.25; unit 168 -->

```text
bits:    23-20   19-16 15-12  11-8  7-4   3-0
module: [xcore]  [ISP] [AF]   [AWB] [AEC] [NO]

0: error
1: warning
2: info
3: verbose
4: debug
```

<!-- en PDF p.25; unit 169 -->

Beispiel für ISP- und AWB-Debugprotokolle:

<!-- en PDF p.25; unit 170 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x040400
# /usr/bin/rkisp_3A_server &
```

<!-- en PDF p.26; unit 171 -->

### 4.6 Auflösung in der IQ-Datei ändern

<!-- en PDF p.26; unit 172 -->

In einer vorhandenen IQ-Datei width und height im Feld sensor_calib auf die Zielgröße setzen. Alle Vorkommen der ursprünglichen Auflösung suchen und ersetzen. Für LSC unter lsc_v2 die Arrays ändern: alle 16 Elemente von lsc_sect_size_x = dst_width / 16; alle 16 Elemente von lsc_sect_size_y = dst_height / 16. Alle entsprechenden Arrays in sämtlichen Szenarien (Tag, Nacht, HDR) ändern.

<!-- en PDF p.26; unit 173 -->

## 5. Anwendungsentwicklung

<!-- en PDF p.26; unit 174 -->

C-Beispiel: Das Linux SDK enthält rkisp_demo samt Quellcode. Wie v4l2-ctl erfasst es Bilder ohne Anzeige und dient hauptsächlich als Codebeispiel. Pfad: &lt;SDK&gt;/media/isp/camera_engine_rkaiq/rkisp_demo. Das IPC SDK enthält außerdem sample demo und simple demo. Sample verwendet rockit und rkaiq für einzelne Module/Funktionen; Code unter &lt;SDK&gt;/media/samples/example.

<!-- en PDF p.26; unit 175 -->

```text
.
├── audio
│   ├── Makefile
│   ├── sample_ai_aenc.c
│   └── sample_ai.c
├── avs
│   ├── Makefile
│   ├── sample_avs.c
│   └── sample_multi_vi_avs.c
├── common
│   ├── fillimage.c
│   ├── isp2.x
```

<!-- en PDF p.27; unit 176 -->

```text
│   ├── isp3.x
│   ├── lib
│   ├── loadbmp.c
│   ├── loadbmp.h
│   ├── Makefile
│   ├── sample_comm_aenc.c
│   ├── sample_comm_ai.c
│   ├── sample_comm_ao.c
│   ├── sample_comm_avs.c
│   ├── sample_comm.c
│   ├── sample_comm.h
│   ├── sample_comm_iva.c
│   ├── sample_comm_ivs.c
│   ├── sample_comm.o
│   ├── sample_comm_rgn.c
│   ├── sample_comm_tde.c
│   ├── sample_comm_venc.c
│   ├── sample_comm_vi.c
│   ├── sample_comm_vo.c
│   ├── sample_comm_vpss.c
├── demo
│   ├── Makefile
│   ├── sample_demo_aiisp.c
│   ├── sample_demo_dual_aiisp.c
│   ├── sample_demo_dual_camera.c
│   ├── sample_demo_dual_camera_wrap.c
│   ├── sample_demo_multi_camera_eptz.c
│   ├── sample_demo_vi_avs_venc.c
│   ├── sample_demo_vi_venc.c
│   └── sample_rv1103_dual_memory_opt.c
├── Makefile
├── out
│   ├── bin
│   └── install_to_userdata
├── test
│   ├── Makefile
│   ├── sample_ai_aenc_adec_ao_stresstest.c
│   ├── sample_avs_stresstest.c
│   ├── sample_demo_aiisp_stresstest.c
│   ├── sample_demo_dual_aiisp_stresstest.c
│   ├── sample_demo_vi_avs_venc_stresstest.c
│   ├── sample_demo_vi_venc_stresstest.c
│   ├── sample_isp_stresstest.c
│   ├── sample_mulit_isp_stresstest.c
│   ├── sample_rgn_stresstest.c
│   ├── sample_venc_stresstest.c
│   ├── sample_vpss_stresstest.c
│   └── source
├── venc
│   ├── Makefile
│   ├── sample_multi_vi_avs_osd_venc.c
│   └── sample_vi_vpss_osd_venc.c
├── vi
│   ├── Makefile
│   ├── sample_multi_vi.c
│   ├── sample_vi.c
```

<!-- en PDF p.28; unit 177 -->

```text
│   └── sample_vi_eis.c
└── vo
    ├── Makefile
    └── sample_vi_vo.c
```

<!-- en PDF p.28; unit 178 -->

demo enthält Anwendungsbeispiele, test Stresstestbeispiele. Weitere Verzeichnisse sind nach common, VI, VO, VENC, AUDIO, AVS usw. aufgeteilt.

<!-- en PDF p.28; unit 179 -->

## 6. Schnellstart

<!-- en PDF p.28; unit 180 -->

### 6.1 DTS anpassen

<!-- en PDF p.28; unit 181 -->

1. Verbindungen, Ein-/Ausschaltpins und Versorgungsdomänen des Sensors entsprechend dem Platinenschaltplan konfigurieren.

<!-- en PDF p.28; unit 182 -->

2. rkisp_thunderboot-Speicher korrekt zuweisen. Größe und Offset von ramdisk_r/ramdisk_c nach Sensorauflösung und Anzahl der VICAP-Offline-Puffer bestimmen. RV1106/RV1103:

<!-- en PDF p.28; unit 183 -->

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
    * vicap, capture raw10, ceil(w*10/8/256)*256*h *4(buf num)
    * e.g. 2304x1296: 0xf30000
    */
 // 2560 x 1440: 0x1248000
    reg = <0x00860000 0x1248000>;

&ramdisk_r {
reg = <0x1aa8000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x24a8000 (5 * 0x00100000)>;
};
```

<!-- en PDF p.28; unit 184 -->

RV1103B/RV1106B:

<!-- en PDF p.28; unit 185 -->

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
     * vicap, capture raw10, ceil(w*10/8/256)*256*h *3(buf num) +
sizeof(rkisp_thunderboot_resmem_head)
     * In RV1103B the size of rkisp_thunderboot_resmem_head is 0x9000, and it
is 0x6000 in RV1103/RV1106
     * e.g. 2688x1520: 0xf96000(raw picture size) + 0x9000 = 0xf9f000
     */
```

<!-- en PDF p.29; unit 186 -->

```text
    reg = <0x00860000 0xf9f000>;
};

&ramdisk_r {
    reg = <0x17ff000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x21ff000 (4 * 0x00100000)>;
};
```

<!-- en PDF p.29; unit 187 -->

### 6.2 Kernel-Sensortreiber

<!-- en PDF p.29; unit 188 -->

1. Schnellstart-Unterstützung gemäß Rockchip_RV1106_RV1103_Quick_Start_Linux_Battery_IPC_Doorbell_CN.md ergänzen. Im Schnellstart schreibt start stream nicht die vollständige Registersequenz, sondern nur das Stream-Startregister.

<!-- en PDF p.29; unit 189 -->

```text
static int __sc401ai_start_stream(struct sc401ai *sc401ai)
{
    int ret;

    if (!sc401ai->is_thunderboot) {
        ret = sc401ai_write_array(sc401ai->client, sc401ai->cur_mode->reg_list);
        if (ret)
            return ret;

        /* In case these controls are set before streaming */
        ret = __v4l2_ctrl_handler_setup(&sc401ai->ctrl_handler);
        if (ret)
            return ret;
    }

    // Only write the start stream register.
    return sc401ai_write_reg(sc401ai->client,
                             SC401AI_REG_CTRL_MODE,
                             SC401AI_REG_VALUE_08BIT,
                             SC401AI_MODE_STREAMING);
}
```

<!-- en PDF p.29; unit 190 -->

2. Belichtung, Verstärkung und VBLANK korrekt implementieren, sonst können Bildfehler entstehen.

<!-- en PDF p.29; unit 191 -->

```text
static int sc401ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ......

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE:  // Exposure
        if (sc401ai->cur_mode->hdr_mode == NO_HDR) {
```

<!-- en PDF p.30; unit 192 -->

```text
        val = ctrl->val << 1;
        /* 4 least significant bits of exposure are fractional part */
        ret = sc401ai_write_reg(sc401ai->client,
                                 SC401AI_REG_EXPOSURE_H,
                                 SC401AI_REG_VALUE_08BIT,
                                 SC401AI_FETCH_EXP_H(val));
        ret |= sc401ai_write_reg(sc401ai->client,
                                  SC401AI_REG_EXPOSURE_M,
                                  SC401AI_REG_VALUE_08BIT,
                                  SC401AI_FETCH_EXP_M(val));
        ret |= sc401ai_write_reg(sc401ai->client,
                                  SC401AI_REG_EXPOSURE_L,
                                  SC401AI_REG_VALUE_08BIT,
                                  SC401AI_FETCH_EXP_L(val));
    }
    break;
case V4L2_CID_ANALOGUE_GAIN:  // Analog Gain
    if (sc401ai->cur_mode->hdr_mode == NO_HDR)
        ret = sc401ai_set_gain_reg(sc401ai, ctrl->val);
    break;
case V4L2_CID_VBLANK:  // VBLANK, affects frame rate
    ret = sc401ai_write_reg(sc401ai->client,
                             SC401AI_REG_VTS_H,
                             SC401AI_REG_VALUE_08BIT,
                             (ctrl->val + sc401ai->cur_mode->height)
                             >> 8);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_REG_VTS_L,
                              SC401AI_REG_VALUE_08BIT,
                              (ctrl->val + sc401ai->cur_mode->height)
                              & 0xff);
    if (!ret)
        sc401ai->cur_vts = ctrl->val + sc401ai->cur_mode->height;
    sc401ai_modify_fps_info(sc401ai);
    break;
case V4L2_CID_TEST_PATTERN:  // pattern test mode
    ret = sc401ai_enable_test_pattern(sc401ai, ctrl->val);
    break;
case V4L2_CID_HFLIP:  // Horizontal mirror
    ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                            SC401AI_REG_VALUE_08BIT, &val);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_FLIP_MIRROR_REG,
                              SC401AI_REG_VALUE_08BIT,
                              SC401AI_FETCH_MIRROR(val, ctrl->val));
    break;
case V4L2_CID_VFLIP:  // Vertical flip
    ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                            SC401AI_REG_VALUE_08BIT, &val);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_FLIP_MIRROR_REG,
                              SC401AI_REG_VALUE_08BIT,
                              SC401AI_FETCH_FLIP(val, ctrl->val));
    break;

    ......
```

<!-- en PDF p.31; unit 193 -->

```text
    }

    pm_runtime_put(&client->dev);
    return ret;
}
```

<!-- en PDF p.31; unit 194 -->

### 6.3 MCU-RTT-Sensortreiber

<!-- en PDF p.31; unit 195 -->

Bei der Entwicklung beachten:

<!-- en PDF p.31; unit 196 -->

1. Registerfolgen für kleine und große Auflösung dürfen MIPI oder den Sensorstream nicht einschalten. Sonst wird die AE-Konvergenz in RTT gestört und nach dem Wechsel zum Kernel ist kein hochauflösender Stream verfügbar.

<!-- en PDF p.31; unit 197 -->

```text
static const uint8_t g_sc401ai_2560x1440_30fps_reg_table[] = {
    ......
    0x3,  0x36,  0xf9,  0x14,
    // 0x3,  0x01,  0x00,  0x01,  // The 0x0100 register, which used to start
stream of the sensor, should not be configured
    0x3a,
}
```

<!-- en PDF p.31; unit 198 -->

2. Belichtungs-/Gain-Berechnung entsprechend dem Kernel-Sensortreiber implementieren.

<!-- en PDF p.31; unit 199 -->

### 6.4 Sensor-IQ-Dateien

<!-- en PDF p.31; unit 200 -->

Korrekte IQ-Datei verwenden und JSON nach BIN umwandeln:

<!-- en PDF p.31; unit 201 -->

```text
./media/isp/release_camera_engine_rkaiq_rv1106_arm-rockchip830-linux-
uclibcgnueabihf/host/j2s4b input_json_file output_bin_file
```

<!-- en PDF p.31; unit 202 -->

Für einen schnellen Build nach IQ-Änderungen die BIN direkt unter output/out/media_out/isp_iqfiles ablegen:

<!-- en PDF p.31; unit 203 -->

```text
cd output/out/media_out/isp_iqfiles
```

<!-- en PDF p.31; unit 204 -->

Konvertierung mit j2s4b:

<!-- en PDF p.31; unit 205 -->

```text
../host/j2s4b mis2032_CMK-OT2115-PC1_30IRC-F16.json mis2032_CMK-OT2115-
PC1_30IRC-F16.bin
```

<!-- en PDF p.31; unit 206 -->

Meta-Partition bauen und flashen:

<!-- en PDF p.31; unit 207 -->

```text
cd -
./build.sh meta
```

<!-- en PDF p.32; unit 208 -->

Alternativ IQ BIN aufs Board übertragen, sensor_iq_bin der Meta-Partition gemäß SDK-Dokumentation aktualisieren und neu starten. Bei grünen ersten Schnellstartbildern AWB/Belichtung prüfen und earlierAwbAct in JSON aktivieren:

<!-- en PDF p.32; unit 209 -->

```text
"earlierAwbAct": {
  "enable": 1,
  ...
}
```

<!-- en PDF p.32; unit 210 -->

Gleichzeitig das CAC-Modul deaktivieren:

<!-- en PDF p.32; unit 211 -->

```text
"cac_v11": {
  "SettingPara": {
    "enable": 0,
  }
}
```

<!-- en PDF p.32; unit 212 -->

### 6.5 Fehlerbehebung

<!-- en PDF p.32; unit 213 -->

#### 6.5.1 Hauptkamera-Sensorkonfiguration nicht gefunden

<!-- en PDF p.32; unit 214 -->

Beim Firmware-Build kann folgende fehlende Hauptsensor-Konfiguration gemeldet werden:

<!-- en PDF p.32; unit 215 -->

```text
[build_meta.sh:error] Not found main camera sensor config, please add
[support_sensors] in build_meta.sh
```

<!-- en PDF p.32; unit 216 -->

IQ-Datei und Sensorunterstützung in build_meta.sh prüfen. RK_CAMERA_SENSOR_IQFILES in der Boardkonfiguration auf die aktuelle Sensor-IQ-Datei setzen. Passende IQ BIN direkt unter output/out/media_out/isp_iqfiles ablegen, Kernel/Firmware bauen und boot erneut flashen.

<!-- en PDF p.32; unit 217 -->

#### 6.5.2 Konfiguration der Helligkeitserkennung

<!-- en PDF p.32; unit 218 -->

In RTT tritt folgender Fehler auf:

<!-- en PDF p.33; unit 219 -->

```text
Meta: ok
## Verified-boot: 0

iq_bin_mode=0
scene(day) frmRate: mode=0, val=25, keep fps
scene(night) frmRate: mode=1, val=25, update fps=15
load iq bin file finished!
gc5603-sensor_0 cur resolution, width 1480, height 832, fps 60!
gc5603-sensor_0 find dst resolution, width 2880, height 1616, fps 15!
[FASTAE]: fps/hts/vts: RTT=[60, 3223, 875], MainAIQ=[15, 3200, 3500]
[AELIB]: fastae: 3.0.5
[FASTAE]: ADC run failed! can't find rk_adc0 device!
Illegal instruction
```

<!-- en PDF p.33; unit 220 -->

Meist ist der Helligkeitserkennungstyp in meta falsch: Software, analog oder digital.

<!-- en PDF p.33; unit 221 -->

```text
typedef enum  {
    ALS_TYPE_NONE    = 0,   // Software Light Sensitivity
    ALS_TYPE_ANALOG  = 1,   // Analog Light Sensitivity
    ALS_TYPE_DIGITAL = 2,   // Digital Light Sensitivity
} eALS_TYPE;
```

<!-- en PDF p.33; unit 222 -->

Unter procject/make_meta/sensor_init/xxx_init.c den tatsächlich verwendeten Typ konfigurieren (Originalschreibweise procject beibehalten).

<!-- en PDF p.33; unit 223 -->

```text
.als_type = ALS_TYPE_ANALOG,
.als_value = FIX2INT16(10.0),
```

<!-- en PDF p.33; unit 224 -->

Für ALS_TYPE_ANALOG in der Sensor-Boardkonfiguration SDK/sysdrv/source/mcu/rt-thread/bsp/rockchip/xxx_mcu/board/ CONFIG_RT_USING_SARADC=y aktivieren. Für Softwaretyp ALS_TYPE_NONE muss dies deaktiviert sein: #CONFIG_RT_USING_SARADC is not set.

<!-- en PDF p.33; unit 225 -->

#### 6.5.3 Kernelabsturz

<!-- en PDF p.33; unit 226 -->

Nach RTT beim Kernelstart kann rk_csirx_irq1_handler abstürzen. Der Hosttreiber ist registriert, doch ein MIPI-Fehler während RTT löst err1 aus. RTT beendet sich und schaltet den Hosttakt ab; der Registerzugriff im Interrupt verursacht den Fehler.

<!-- en PDF p.34; unit 227 -->

```text
[    0.274655] [<b037486c>] (rk_csirx_irq1_handler) from [<b022e2a7>]
(__handle_irq_event_percpu+0x25/0x7e)
        [    0.275490] [<b022e2a7>] (__handle_irq_event_percpu) from [<b022e30f>]
(handle_irq_event_percpu+0xf/0x30)
        [    0.276334] [<b022e30f>] (handle_irq_event_percpu) from [<b022e34b>]
(handle_irq_event+0x1b/0x28)
        [    0.277121] [<b022e34b>] (handle_irq_event) from [<b02300d9>]
(handle_fasteoi_irq+0x57/0x90)
        [    0.277864] [<b02300d9>] (handle_fasteoi_irq) from [<b022df6f>]
(__handle_domain_irq+0x4b/0x64)
        [    0.278630] [<b022df6f>] (__handle_domain_irq) from [<b02ee983>]
(gic_handle_irq+0x41/0x4e)
        [    0.279375] [<b02ee983>] (gic_handle_irq) from [<b0208d13>]
(__irq_svc+0x53/0x7c)
```

<!-- en PDF p.34; unit 228 -->

Lösung: rkcif mit Interrupt-Ausnahmebehandlung aktualisieren.

<!-- en PDF p.34; unit 229 -->

#### 6.5.4 Sensor ohne Objektiv prüfen

<!-- en PDF p.34; unit 230 -->

Testpattern mit Farbbalken/Graustufen aktivieren. Konfiguration in der Stream-Startfunktion vor dem Startregister ergänzen. Beispiel SC200AI:

<!-- en PDF p.34; unit 231 -->

```text
#define SC200AI_REG_TEST_PATTERN    0x4501
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3)
...
static int sc200ai_enable_test_pattern(struct sc200ai *sc200ai, u32 pattern)
{
    u32 val = 0;
    int ret = 0;

    ret = sc200ai_read_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                           SC200AI_REG_VALUE_08BIT, &val);
    if (pattern)
        val |= SC200AI_TEST_PATTERN_BIT_MASK;
    else
        val &= ~SC200AI_TEST_PATTERN_BIT_MASK;

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                             SC200AI_REG_VALUE_08BIT, val);
    return ret;
}

static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ...
    case V4L2_CID_TEST_PATTERN:
        ret = sc200ai_enable_test_pattern(sc200ai, ctrl->val);
```

<!-- en PDF p.35; unit 232 -->

```text
        break;
    ...
}
```

<!-- en PDF p.35; unit 233 -->

#### 6.5.5 Fortlaufende MIPI SIZE ERROR nach Kernelstart

<!-- en PDF p.35; unit 234 -->

Tatsächliche RTT-Bildbreite/-höhe prüfen und Sensorregisterkonfiguration sorgfältig mit dem Handbuch vergleichen.

<!-- en PDF p.35; unit 235 -->

#### 6.5.6 Failed to stop decompress: decompress@ff520000

<!-- en PDF p.35; unit 236 -->

Bei Kernel-Dekompressionsfehler ret=-119 die maximale spi_nor-Frequenz in sysdrv/source/uboot/u-boot/arch/arm/dts/rv1106-evb2.dts versuchsweise auf 100MHz oder weniger reduzieren.

<!-- en PDF p.35; unit 237 -->

```text
&spi nor {
        spi-max-frequency = <125000000> to spi-max-frequency = <100000000>
```

<!-- en PDF p.35; unit 238 -->

#### 6.5.7 Failed to stop decompress: decompress@ff520000, ret=-110

<!-- en PDF p.35; unit 239 -->

Bei ret=-110 Größen von ramdisk und CMA prüfen/reduzieren; beide dürfen nicht zu groß sein.

<!-- en PDF p.35; unit 240 -->

#### 6.5.8 Autostart der Schnellstartanwendung deaktivieren

<!-- en PDF p.35; unit 241 -->

Autostart durch das Kernelstartskript kann beim Entwickeln stören. Folgender Meta-Befehl deaktiviert ihn:

<!-- en PDF p.35; unit 242 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline NoAuto=1
```

<!-- en PDF p.35; unit 243 -->

AE-Protokoll aktivieren und gleichzeitig Autostart deaktivieren:

<!-- en PDF p.35; unit 244 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline "persist_camera_engine_log=0x1ff4 NoAuto=1"
```

<!-- en PDF p.35; unit 245 -->

Hinweis: Nur SDKs für RV1106/RV1103/RV1103B/RV1106B unterstützen diesen Befehl.

<!-- en PDF p.36; unit 246 -->

#### 6.5.9 Kernelprotokoll beim Schnellstart

<!-- en PDF p.36; unit 247 -->

Methode 1: loglevel=8 in den Bootparametern des DTS setzen, Kernel neu bauen und boot flashen. Methode 2: Nach dem Start über die serielle Konsole eingeben:

<!-- en PDF p.36; unit 248 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline "loglevel=8"
```

<!-- en PDF p.36; unit 249 -->

#### 6.5.10 Vorzeitige Sensorausgabe nach RTT-Umschaltung auf große Bilder prüfen

<!-- en PDF p.36; unit 250 -->

<!-- en PDF p.36; unit 251 -->

Beim Umschalten auf die große Registersequenz prüfen, ob der Sensor vorzeitig Daten ausgibt. SPL mit while(1) anhalten, ohne den Kernel zu betreten, und MIPI mit dem Oszilloskop messen. Verzeichnis: cd sysdrv/source/uboot/u-boot:

<!-- en PDF p.36; unit 252 -->

```text
git diff common/spl/spl.c
diff --git a/common/spl/spl.c b/common/spl/spl.c
index 6836796b4e..070388c066 100644
--- a/common/spl/spl.c
+++ b/common/spl/spl.c
@@ -739,4 +739,5 @@ void spl_cleanup_before_jump(struct spl_image_info
*spl_image)

        us = (get_ticks() - gd->sys_start_tick) / 24UL;
        printf("Total: %ld.%ld ms\n\n", us / 1000, us % 1000);
+       while(1);
}
```

<!-- en PDF p.36; unit 253 -->

#### 6.5.11 Offline-Bildfehler im Schnellstart lokalisieren

<!-- en PDF p.36; unit 254 -->

<!-- en PDF p.36; unit 255 -->

Der VICAP-Debugschalter protokolliert FS/FE der ersten 15 Bilder sowie Pufferrotation. Bei zusammengesetzten oder fehlerhaften Bildern diese Logs auswerten. Aktivierung:

<!-- en PDF p.37; unit 256 -->

```text
diff --git a/drivers/media/platform/rockchip/cif/dev.c
b/drivers/media/platform/rockchip/cif/dev.c
index c3b59414eede3..bb616b1897b58 100644
--- a/drivers/media/platform/rockchip/cif/dev.c
+++ b/drivers/media/platform/rockchip/cif/dev.c
@@ -1957,7 +1957,7 @@ int rkcif_plat_init(struct rkcif_device *cif_dev, struct
device_node *node, int
        cif_dev->sensor_linetime = 0;
        cif_dev->early_line = 0;
        cif_dev->is_thunderboot = false;
-       cif_dev->rdbk_debug = 0;
+       cif_dev->rdbk_debug = 3;

        cif_dev->resume_mode = 0;
        memset(&cif_dev->channels[0].capture_info, 0, sizeof(cif_dev->channels[0].capture_info));
```

<!-- en PDF p.37; unit 257 -->

#### 6.5.12 Kleine RTT-Bilder erfassen und prüfen

<!-- en PDF p.37; unit 258 -->

<!-- en PDF p.37; unit 259 -->

Im DTS sämtliche rkisp/rkcif/mipi-Knoten deaktivieren: csi2_dphy_hw, csi2_dphy0, mipi0_csi2, rkcif, rkcif_mipi_lvds, rkcif_mipi_lvds_sditf, rkisp, rkisp_vir0 auf disabled. io -rf /tmp/1.yuv -l 393216 0x866000 0 speichert kleine Bilder; nur die letzten 5 sind verfügbar. fastae_max_run_frame=5 kann erzwungen werden.

<!-- en PDF p.37; unit 260 -->

```text
[STREAM]: L 0, 1, 0, 0x866000, 783360, 0x45d, 0x8000, tick:59
[STREAM]: L 1, 2, 0, 0x926000, 783360, 0x45d, 0x8000, tick:76
[STREAM]: L 2, 3, 0, 0x9e6000, 783360, 0x45d, 0x8000, tick:87
[STREAM]: L 3, 4, 0, 0xaa6000, 783360, 0x45d, 0x1828, tick:98
[STREAM]: L 4, 5, 0, 0xb66000, 783360, 0x45d, 0x48d, tick:109
```

<!-- en PDF p.37; unit 261 -->

Adressen wie 0x866000 und 0x926000 gehören zu den letzten in RTT gespeicherten Bildern.

<!-- en PDF p.37; unit 262 -->

#### 6.5.13 Falsche Farbe des ersten Bildes

<!-- en PDF p.37; unit 263 -->

Ein zu dunkles oder grünes erstes Bild entsteht meist durch eine falsche IQ-Datei und fehlerhaftes AWB. Im folgenden Log ist luma sehr klein, daher bleibt das erste Bild dunkel:

<!-- en PDF p.38; unit 264 -->

```text
[FASTTAE]: >>> als type: 1, als value: 0xa0000, night mode: 0
start_stream 278 tick 23
[isp_0]:rk_isr_hw_set_vicap_clk enable is 1
[FASTAE]: set_firstae 1733 tick 23
[STREAM]: L 0, 1, 0, 0x866000, 178r400, 0x2, 0x40, tick:43
[AELIB]: 1,luma=1.0000,setpoint=60.0000,curexp=0.0000,newexp=0.0000,T?
8.0000,G=1.0000,ispG=1.0000,regT=2,regG=64

[STREAM]: L 1, 2, 0, 0x9b80000 1382400, 0x2, 0x40, tick:62
[AELIB]:2,luma=1.0000,setpoint=60.0000,curexp=0.0000,newexp=0.0000,T=0.0000,G=1.0
000,ispG=1.0000 regT=2,regG=64

[STREAM]: L 2, 3, 0, 0xb0a000, 138r400, 0x2, 0x40, tick:80
[AELIB]: 3,luma=1.0000,setpoint=60.0000,curexp=0.0000 ==========fastae is
match===========
```

<!-- en PDF p.38; unit 265 -->

Aktivierung und Konfiguration von earlierAwbAct in der IQ-Datei prüfen:

<!-- en PDF p.38; unit 266 -->

```text
"earlierAwbAct":    {
        "enable":   1,
        "mode": "CALIB_AWB_EARLACT_XYREG_FIXED",
        "xyRegion": [{
        "normal":   [-161, 286, 81, -95],
        "big":  [-161, 286, 112, -125]
        }, {
        "normal":   [-803, -161, 135, -199],
        "big":  [-803, -161, 185, -224]
        }, {
        "normal":   [-1467, -796, 121, -78],
        "big":  [-1559, -796, 136, -93]
        }, {
        "normal":   [-2062, -1535, 65, -130],
        "big":  [-2017, -1535, 130, -130]
        }]
    }
```

<!-- en PDF p.38; unit 267 -->

Für Schnellstart earlierAwbAct in JSON aktivieren, um AWB früher anzupassen. Normalerweise benötigt AWB 2 Bilder. Ohne Fast-AWB wird der Startwert mit WB gain=1 verwendet, was grün wirkt. Beim Tuning earlierawb aktivieren, AUTO wählen und Parameter ausfüllen.

<!-- en PDF p.39; unit 268 -->

## 7. AOV

<!-- en PDF p.39; unit 269 -->

### 7.1 Hardware-Standby des Sensors

<!-- en PDF p.39; unit 270 -->

Standby reduziert Verbrauch durch Schlaf oder Reset. Im Schlaf stoppt der Datenstrom, Register bleiben erhalten. SC200AI bietet zwei Wege:

<!-- en PDF p.39; unit 271 -->

1. PWDN auf Low ziehen; I2C-Lesen/-Schreiben ist dann nicht möglich.

<!-- en PDF p.39; unit 272 -->

2. Stream-Steuerregister auf 0 setzen; I2C bleibt möglich. Im Reset stoppt der Stream, Verbrauch sinkt und alle Register werden zurückgesetzt. Bei SC200AI:

<!-- en PDF p.39; unit 273 -->

1. XSHUTDN auf Low ziehen; I2C ist nicht möglich.

<!-- en PDF p.39; unit 274 -->

2. Soft-Resetregister auf 1 setzen; der Reset dauert 150ns. Hardware-Standby bedeutet Schlaf über PWDN Low ohne I2C-Zugriff. Im SC200AI-DTS rockchip,camera-module-stb = &lt;1&gt; ergänzen; 1 aktiviert Unterstützung, 0 deaktiviert sie.

<!-- en PDF p.39; unit 275 -->

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

<!-- en PDF p.39; unit 276 -->

Im probe den Attributwert lesen und Unterstützung in sc200ai-&gt;standby_hw speichern.

<!-- en PDF p.40; unit 277 -->

Bei Hardware-Standby steuert ioctl quick_stream PWDN GPIO entsprechend Streamstart/-stopp. Beim Schlafen/Aufwachen setzt ein v4l2 ioctl Belichtung, Gain und weitere Register erneut.

<!-- en PDF p.40; unit 278 -->

```text
    case RKMODULE_SET_QUICK_STREAM:
        stream = *((u32 *)arg);
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit standby mode\n");
                sc200ai->is_standby = false;
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter standby mode\n");
                sc200ai->is_standby = true;
            }
        } else {    // software standby
            ...
        }
```

<!-- en PDF p.40; unit 279 -->

Details im SC200AI-Treiber. Software-Standby: Nach Schlaf/Aufwachen vollständige Sensorregisterkonfiguration schreiben; anschließend schaltet quick_stream im ioctl unmittelbar das Streamregister.

<!-- en PDF p.40; unit 280 -->

```text
......
} else {    // software standby
        if (stream) {
            ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

            ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
```

<!-- en PDF p.41; unit 281 -->

```text
            dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft standby mode\n");
       } else {
           ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                                   SC200AI_REG_VALUE_08BIT,
SC200AI_MODE_SW_STANDBY);

           ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                                    SC200AI_REG_VALUE_08BIT,
SC200AI_MIPI_CTRL_OFF);
           dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft standby mode\n");
        }
}
```

<!-- en PDF p.41; unit 282 -->

### 7.2 Zusatzlicht steuern

<!-- en PDF p.41; unit 283 -->

Im AOV-Modus kann jeder Sensor ein PWM- oder GPIO-Zusatzlicht steuern. Konfiguration:

<!-- en PDF p.41; unit 284 -->

1. light_ctl im Board-DTS ergänzen und PWM-Geräte/GPIO-Pins nach Schaltplan angeben. Der Beispieltext nennt pwm7, Index 0 und unbenutztes GPIO; das gezeigte DTS enthält dennoch light-gpios. Dieser Originalwiderspruch bleibt dokumentiert.

<!-- en PDF p.41; unit 285 -->

```text
/ {
    model = "Rockchip RV1106G EVB2 V10 Board";
    compatible = "rockchip,rv1106g-evb2-v10", "rockchip,rv1106";

    chosen {
        bootargs = "loglevel=0 rootfstype=erofs rootflags=dax console=ttyFIQ0 root=/dev/rd0 snd_soc_core.prealloc_buffer_size_kbytes=16 coherent_pool=0 driver_async_probe=dwmmc_rockchip";
    };
    ...
    light_ctrl: light-ctl {
        compatible = "rockchip,light-ctl";
        pwms=<&pwm7 0 25000 0>;
        light-gpios =<&gpio3 RK_PD2 GPIO_ACTIVE_HIGH>;
        rockchip,module-index = <0>;
        status = "okay";
    };
};
```

<!-- en PDF p.41; unit 286 -->

2. CONFIG_LIGHT_CTL im Kernel aktivieren.

<!-- en PDF p.41; unit 287 -->

3. Steuerschnittstellen im Sensortreiber ergänzen.

<!-- en PDF p.41; unit 288 -->

```text
 #include <linux/clk.h>
@@ -40,8 +41,9 @@
 #include "../platform/rockchip/isp/rkisp_tb_helper.h"
```

<!-- en PDF p.42; unit 289 -->

```text
 #include "cam-tb-setup.h"
 #include "cam-sleep-wakeup.h"
+#include "light_ctl.h"

-#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x09)
+#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x10)

 #ifndef V4L2_CID_DIGITAL_GAIN
 #define V4L2_CID_DIGITAL_GAIN      V4L2_CID_GAIN
@@ -192,6 +194,7 @@ struct sc200ai {
    bool            is_standby;
    struct preisp_hdrae_exp_s init_hdrae_exp;
    struct cam_sw_info  *cam_sw_inf;
+   struct rk_light_param   light_ctl_param;
 };

 #define to_sc200ai(sd) container_of(sd, struct sc200ai, subdev)
@@ -1191,6 +1194,8 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
    u32 i, h, w;
    long ret = 0;
    u32 stream = 0;
+   int rt = 0;
+   struct rk_light_param *light_param;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1238,6 +1243,22 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)

        stream = *((u32 *)arg);

+       dev_err(&sc200ai->client->dev, "%s: quick_stream = %d\n",
+           __func__, stream);
+       // light control
+       if (stream) {
+           sc200ai->light_ctl_param.light_enable = true;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       } else {
+           sc200ai->light_ctl_param.light_enable = false;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       }
+
+       dev_err(&sc200ai->client->dev, "%s: light_ctl_write ret:%d\n",
+            __func__, rt);
+
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
@@ -1284,6 +1305,18 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
        ch_info = (struct rkmodule_channel_info *)arg;
        ret = sc200ai_get_channel_info(sc200ai, ch_info);
        break;
```

<!-- en PDF p.43; unit 290 -->

```text
+
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = (struct rk_light_param *)arg;
+       dev_err(&sc200ai->client->dev,
+           "%s: RKCIS_CMD_FLASH_LIGHT_CTRL type: %s enable: %s\n",
+           __func__,
+           light_param->light_type == LIGHT_PWM ? "pwm" : "gpio",
+           light_param->light_enable ? "enable" : "disable");
+
+       memcpy(&sc200ai->light_ctl_param, light_param, sizeof(*light_param));
+
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1304,6 +1337,7 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
    struct rkmodule_channel_info *ch_info;
    long ret;
    u32 stream = 0;
+   struct rk_light_param *light_param = NULL;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1400,6 +1434,19 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
        }
        kfree(ch_info);
        break;
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
+       if (!light_param) {
+           ret = -ENOMEM;
+           return ret;
+       }
+       ret = copy_from_user(light_param, up, sizeof(*light_param));
+       if (!ret)
+           ret = sc200ai_ioctl(sd, cmd, light_param);
+       else
+           ret = -EFAULT;
+       kfree(light_param);
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1451,6 +1498,10 @@ static int __sc200ai_stop_stream(struct sc200ai
*sc200ai)
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
+   sc200ai->light_ctl_param.duty_cycle = 0;
+   sc200ai->light_ctl_param.light_enable = false;
+   light_ctl_write(sc200ai->module_index,
+           &sc200ai->light_ctl_param);
    return sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
```

<!-- en PDF p.44; unit 291 -->

```text
 }
@@ -1973,6 +2024,7 @@ static int sc200ai_initialize_controls(struct sc200ai
*sc200ai)
    sc200ai->subdev.ctrl_handler = handler;
    sc200ai->has_init_exp = false;
    sc200ai->is_standby = false;
+   sc200ai->light_ctl_param.duty_cycle = 0;

    return 0;
```

<!-- en PDF p.44; unit 292 -->

4. Anwendungsbeispiel:

<!-- en PDF p.44; unit 293 -->

```text
--- a/sample_aov_vi.c
+++ b/sample_aov_vi.c
@@ -572,6 +572,19 @@ int main(int argc, char *argv[]) {
        if (!ctx->vi.bIfQuickStart) {
                RK_MPI_VI_StartPipe(ctx->vi.u32PipeId);
        }
+
+       // Enable VI light
+       VI_LIGHT_CTL_PARAM_S tLightCtlParam;
+       printf("%s - VI_LIGHT_CTL_PARAM_S size:%d\n", __func__,
sizeof(VI_LIGHT_CTL_PARAM_S));
+       memset(&tLightCtlParam, 0, sizeof(tLightCtlParam));
+       tLightCtlParam.light_enable = RK_TRUE;
+       tLightCtlParam.light_type = LIGHT_TYPE_PWM;
+       tLightCtlParam.duty_cycle = 25000;
+       tLightCtlParam.period = 25000;
+       tLightCtlParam.polarity = 0;
+
+       RK_MPI_VI_DevEnableLight(ctx->vi.s32DevId, ctx->vi.s32DevId,
&tLightCtlParam);
+
        if (s32ViFrameMode == 0)
                pthread_create(&vi_thread_id, 0, vi_get_stream, (void *)
(&ctx->vi));
```

<!-- en PDF p.44; unit 294 -->

### 7.3 AOV-Entwicklungsdokumentation

<!-- en PDF p.44; unit 295 -->

Details: Rockchip_RV1106_Developer_Guide_Linux_AOV_CN.md.

## Unterschiede des Quellcodes

Der Haupttext folgt der jeweiligen Sprachquelle, RU/DE dem EN-Original. Abweichende Fragmente der anderen Quelle einschließlich Kommentar-/Layoutabweichungen bleiben unten erhalten. Unabhängige Beispiele, kein zusammenhängendes Skript; Quellparameter wurden nicht stillschweigend überschrieben.

**CN PDF p.6 · 28**

```text
# media-ctl -p -d /dev/media0 | tail -n 30
                -> "rkcif_tools_id2":0 []
        pad11: Source
                -> "stream_cif_mipi_id0":0 []
                -> "stream_cif_mipi_id1":0 []
                -> "stream_cif_mipi_id2":0 []
```

**CN PDF p.7 · 29**

```text
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
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                <- "m00_b_sc450ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc450ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

**CN PDF p.7 · 33**

```text
+++ b/drivers/media/i2c/sc530ai.c
@@ -1593,8 +1593,8 @@ static int sc530ai_open(struct v4l2_subdev *sd, struct
v4l2_subdev_fh *fh)
 }
 #endif

-#define DST_WIDTH 2880
-#define DST_HEIGHT 1616
+#define DST_WIDTH 2560
+#define DST_HEIGHT 1440
```

**CN PDF p.8 · 37**

```text
# i2ctransfer -f -y 4 w3@0x32 0x43 0x24 0x18

4：代表 IIC 的总线号(对应的可为0,1,2,3...)
w：代表写
3：代表写 3 Byte
0x32：代表 IIC 设备地址
后边三个数据代表要写的数据,这⾥0x4324假如为16bit的寄存器地址，0x18为要写⼊的值。

# i2ctransfer -f -y 4 w1@0x30 0x08 r3

4：代表 IIC 的总线号(对应的可为0,1,2,3...)
w：表⽰写
1：表⽰写 1 Byte
0x30：代表 IIC 设备地址
r：代表读取
3：代表读取 3 Byte

这句代表的意思是从0x30地址上偏移0x08之后读取3个Byte，r后数字表⽰读取的个数。
```

**CN PDF p.14 · 84**

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 640,
                .height = 480,
```

**CN PDF p.15 · 91**

```text
常⻅命令有：
# 取 raw 图
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -n /dev/video0 -f 131076

# 从 mainpath 通道取 yuv 图，并保存在⽂件中。⽂件⽬录 /data/test_0_0_0.bin,可使⽤
7yuv等⼯具打开。⽂件命名根据 dev id， pipe id， chn id相关。
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -o 1

# 从 mainpath 通道取 yuv 图，并并编码，写⽂件。⽂件保存在/data/venc_0.bin,⽂件命名跟
chn id 有关。
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 1 -l 10 -o 1
...
```

**CN PDF p.15 · 93**

```text
# 使⽤ simple_vi_bind_venc_rtsp demo，通过rtsp 实时预览(使⽤vlc 或 potplayer⼯具配
置板端IP).
simple_vi_bind_venc_rtsp -I 0 -w 1920 -h 1080 (rtsp://ip/live/0)
```

**CN PDF p.17 · 116**

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //表⽰该entity是
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //对应的设备节点
是/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //表⽰该entity是
SP(SelfPath)
            type Node subtype V4L flags 0
            device node name /dev/video2                 //对应的设备节点
是/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

**CN PDF p.17 · 118**

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # MP节点对应/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # SP节点对应/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

**CN PDF p.20 · 134**

```text
#grep RK_AIQ_VERSION_REAL media/isp/camera_engine_rkaiq/rkaiq/RkAiqVersion.h

#define RK_AIQ_VERSION_REAL_V "v5.0x5.0"
```

**CN PDF p.20 · 139**

```text
  # dmesg  | grep "version"

dmesg | grep "version"
[    0.848252] udevd[65]: starting version 3.2.7
[    3.889404] imx415 4-001a: driver version: 00.01.08
[    3.967388] os04a10 4-0036: driver version: 00.01.05
[    4.084418] sc4336 4-0030-3: driver version: 00.01.01
[    4.114867] sc3336 4-0030-1: driver version: 00.01.01
[    4.152066] sc530ai 4-0030: driver version: 00.01.01
[    4.180572] sc200ai 4-0030-6: driver version: 00.01.09
[    4.237776] rkcif rkcif-mipi-lvds: rkcif driver version: v00.02.00
[    4.260419] rkisp rkisp-vir0: rkisp driver version: v02.05.00
```

**CN PDF p.24 · 166**

```text
.
├── audio
│   ├── Makefile
│   ├── sample_ai_aenc.c
│   └── sample_ai.c
├── avs
│   ├── Makefile
│   ├── sample_avs.c
│   └── sample_multi_vi_avs.c
├── common
│   ├── fillimage.c
│   ├── isp2.x
│   ├── isp3.x
│   ├── lib
│   ├── loadbmp.c
│   ├── loadbmp.h
│   ├── Makefile
│   ├── sample_comm_aenc.c
│   ├── sample_comm_ai.c
│   ├── sample_comm_ao.c
│   ├── sample_comm_avs.c
│   ├── sample_comm.c
│   ├── sample_comm.h
│   ├── sample_comm_iva.c
│   ├── sample_comm_ivs.c
│   ├── sample_comm.o
│   ├── sample_comm_rgn.c
│   ├── sample_comm_tde.c
│   ├── sample_comm_venc.c
│   ├── sample_comm_vi.c
│   ├── sample_comm_vo.c
│   ├── sample_comm_vpss.c
├── demo
│   ├── Makefile
│   ├── sample_demo_aiisp.c
│   ├── sample_demo_dual_aiisp.c
│   ├── sample_demo_dual_camera.c
```

**CN PDF p.25 · 167**

```text
│   ├── sample_demo_dual_camera_wrap.c
│   ├── sample_demo_multi_camera_eptz.c
│   ├── sample_demo_vi_avs_venc.c
│   ├── sample_demo_vi_venc.c
│   └── sample_rv1103_dual_memory_opt.c
├── Makefile
├── out
│   ├── bin
│   └── install_to_userdata
├── test
│   ├── Makefile
│   ├── sample_ai_aenc_adec_ao_stresstest.c
│   ├── sample_avs_stresstest.c
│   ├── sample_demo_aiisp_stresstest.c
│   ├── sample_demo_dual_aiisp_stresstest.c
│   ├── sample_demo_vi_avs_venc_stresstest.c
│   ├── sample_demo_vi_venc_stresstest.c
│   ├── sample_isp_stresstest.c
│   ├── sample_mulit_isp_stresstest.c
│   ├── sample_rgn_stresstest.c
│   ├── sample_venc_stresstest.c
│   ├── sample_vpss_stresstest.c
│   └── source
├── venc
│   ├── Makefile
│   ├── sample_multi_vi_avs_osd_venc.c
│   └── sample_vi_vpss_osd_venc.c
├── vi
│   ├── Makefile
│   ├── sample_multi_vi.c
│   ├── sample_vi.c
│   └── sample_vi_eis.c
└── vo
    ├── Makefile
    └── sample_vi_vo.c
```

**CN PDF p.26 · 175**

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
     * vicap, capture raw10, ceil(w*10/8/256)*256*h *3(buf num) +
sizeof(rkisp_thunderboot_resmem_head)
     * In RV1103B the size of rkisp_thunderboot_resmem_head is 0x9000, and it
is 0x6000 in RV1103/RV1106
     * e.g. 2688x1520: 0xf96000(raw picture size) + 0x9000 = 0xf9f000
     */
    reg = <0x00860000 0xf9f000>;
};

&ramdisk_r {
    reg = <0x17ff000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x21ff000 (4 * 0x00100000)>;
};
```

**CN PDF p.27 · 178**

```text
static int __sc401ai_start_stream(struct sc401ai *sc401ai)
{
    int ret;

    if (!sc401ai->is_thunderboot) {
        ret = sc401ai_write_array(sc401ai->client, sc401ai->cur_mode->reg_list);
        if (ret)
            return ret;

        /* In case these controls are set before streaming */
        ret = __v4l2_ctrl_handler_setup(&sc401ai->ctrl_handler);
        if (ret)
            return ret;
    }

    // 仅写⼊起流寄存器。
    return sc401ai_write_reg(sc401ai->client,
                SC401AI_REG_CTRL_MODE,
                SC401AI_REG_VALUE_08BIT,
                SC401AI_MODE_STREAMING);
}
```

**CN PDF p.27 · 180**

```text
static int sc401ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ......

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE: // 曝光
        if (sc401ai->cur_mode->hdr_mode == NO_HDR) {
            val = ctrl->val << 1;
            /* 4 least significant bits of expsoure are fractional part */
            ret = sc401ai_write_reg(sc401ai->client,
                        SC401AI_REG_EXPOSURE_H,
                        SC401AI_REG_VALUE_08BIT,
                        SC401AI_FETCH_EXP_H(val));
            ret |= sc401ai_write_reg(sc401ai->client,
                         SC401AI_REG_EXPOSURE_M,
                         SC401AI_REG_VALUE_08BIT,
                         SC401AI_FETCH_EXP_M(val));
            ret |= sc401ai_write_reg(sc401ai->client,
                         SC401AI_REG_EXPOSURE_L,
                         SC401AI_REG_VALUE_08BIT,
                         SC401AI_FETCH_EXP_L(val));
```

**CN PDF p.28 · 181**

```text
        }
        break;
    case V4L2_CID_ANALOGUE_GAIN:    //模拟Gain
        if (sc401ai->cur_mode->hdr_mode == NO_HDR)
            ret = sc401ai_set_gain_reg(sc401ai, ctrl->val);
        break;
    case V4L2_CID_VBLANK:       // VBLANK, 影响帧率
        ret = sc401ai_write_reg(sc401ai->client,
                    SC401AI_REG_VTS_H,
                    SC401AI_REG_VALUE_08BIT,
                    (ctrl->val + sc401ai->cur_mode->height)
                    >> 8);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_REG_VTS_L,
                     SC401AI_REG_VALUE_08BIT,
                     (ctrl->val + sc401ai->cur_mode->height)
                     & 0xff);
        if (!ret)
            sc401ai->cur_vts = ctrl->val + sc401ai->cur_mode->height;
        sc401ai_modify_fps_info(sc401ai);
        break;
    case V4L2_CID_TEST_PATTERN: // pattern 测试模式
        ret = sc401ai_enable_test_pattern(sc401ai, ctrl->val);
        break;
    case V4L2_CID_HFLIP:    // ⽔平镜像
        ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                       SC401AI_REG_VALUE_08BIT, &val);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_FLIP_MIRROR_REG,
                     SC401AI_REG_VALUE_08BIT,
                     SC401AI_FETCH_MIRROR(val, ctrl->val));
        break;
    case V4L2_CID_VFLIP:    // 垂直翻转
        ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                       SC401AI_REG_VALUE_08BIT, &val);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_FLIP_MIRROR_REG,
                     SC401AI_REG_VALUE_08BIT,
                     SC401AI_FETCH_FLIP(val, ctrl->val));
        break;

      ......
    }

    pm_runtime_put(&client->dev);
    return ret;
}
```

**CN PDF p.29 · 185**

```text
static const uint8_t g_sc401ai_2560x1440_30fps_reg_table[] = {
    ......
    0x3,  0x36,  0xf9,  0x14,
    // 0x3,  0x01,  0x00,  0x01,    // 0x0100 寄存器起流控制寄存器不能配置
    0x3a,
}
```

**CN PDF p.29 · 189**

```text
./media/isp/release_camera_engine_rkaiq_rv1106_arm-rockchip830-linux-
uclibcgnueabihf/host/j2s4b   json⽂件   bin⽂件
```

**CN PDF p.29 · 197**

```text
"earlierAwbAct ":{
    "enable":   1,
    ......
```

**CN PDF p.29 · 199**

```text
"cac_v11":  {
                "SettingPara":  {
                    "enable":   0,
            }
```

**CN PDF p.30 · 207**

```text
Meta: ok
## Verified-boot: 0

iq_bin_mode=0
scene(day) frmRate: mode=0, val=25, keep fps
scene(night) frmRate: mode=1, val=25, update fps=15
load iq bin file finished!
gc5603-sensor_0 cur resulotion, width 1480, height 832, fps 60!
gc5603-sensor_0 find dst resulotion, width 2880, height 1616, fps 15!
[FASTAE]: fps/hts/vts: RTT=[60, 3223, 875], MainAIQ=[15, 3200, 3500]
[AELIB]: fastae: 3.0.5
[FASTAE]: ADC run failed! can't find rk_adc0 device!
Illegal instruction
```

**CN PDF p.30 · 209**

```text
typedef enum  {
    ALS_TYPE_NONE    = 0,   // 软光敏
    ALS_TYPE_ANALOG  = 1,   // 模拟光敏
    ALS_TYPE_DIGITAL = 2,   // 数字光敏
} eALS_TYPE;
```

**CN PDF p.31 · 219**

```text
#define SC200AI_REG_TEST_PATTERN    0x4501
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3)
...
static int sc200ai_enable_test_pattern(struct sc200ai *sc200ai, u32 pattern)
```

**CN PDF p.32 · 220**

```text
{
    u32 val = 0;
    int ret = 0;

    ret = sc200ai_read_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                   SC200AI_REG_VALUE_08BIT, &val);
    if (pattern)
        val |= SC200AI_TEST_PATTERN_BIT_MASK;
    else
        val &= ~SC200AI_TEST_PATTERN_BIT_MASK;

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                 SC200AI_REG_VALUE_08BIT, val);
    return ret;
}

static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ...
    case V4L2_CID_TEST_PATTERN:
        ret = sc200ai_enable_test_pattern(sc200ai, ctrl->val);
        break;
    ...
}
```

**CN PDF p.32 · 225**

```text
&spi nor {
        spi-max-frequency = <125000000> 为 spi-max-frequency = <100000000>
```

**CN PDF p.36 · 262**

```text
case RKMODULE_SET_QUICK_STREAM:
```

**CN PDF p.37 · 263**

```text
        stream = *((u32 *)arg);
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit standby mode\n");
                sc200ai->is_standby = false;
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter standby mode\n");
                sc200ai->is_standby = true;
            }
        } else {    // software standby
            ...
        }
```

**CN PDF p.37 · 265**

```text
......
} else {    // software standby
        if (stream) {
            ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

            ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
            dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft standby mode\n");
       } else {
           ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                                   SC200AI_REG_VALUE_08BIT,
SC200AI_MODE_SW_STANDBY);

           ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
```

**CN PDF p.38 · 266**

```text
                                    SC200AI_REG_VALUE_08BIT,
SC200AI_MIPI_CTRL_OFF);
           dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft standby mode\n");
        }
}
```

**CN PDF p.38 · 273**

```text
 #include <linux/clk.h>
@@ -40,8 +41,9 @@
 #include "../platform/rockchip/isp/rkisp_tb_helper.h"
 #include "cam-tb-setup.h"
 #include "cam-sleep-wakeup.h"
+#include "light_ctl.h"

-#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x09)
+#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x10)

 #ifndef V4L2_CID_DIGITAL_GAIN
 #define V4L2_CID_DIGITAL_GAIN      V4L2_CID_GAIN
@@ -192,6 +194,7 @@ struct sc200ai {
    bool            is_standby;
```

**CN PDF p.39 · 274**

```text
    struct preisp_hdrae_exp_s init_hdrae_exp;
    struct cam_sw_info  *cam_sw_inf;
+   struct rk_light_param   light_ctl_param;
 };

 #define to_sc200ai(sd) container_of(sd, struct sc200ai, subdev)
@@ -1191,6 +1194,8 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
    u32 i, h, w;
    long ret = 0;
    u32 stream = 0;
+   int rt = 0;
+   struct rk_light_param *light_param;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1238,6 +1243,22 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)

        stream = *((u32 *)arg);

+       dev_err(&sc200ai->client->dev, "%s: quick_stream = %d\n",
+           __func__, stream);
+       // light control
+       if (stream) {
+           sc200ai->light_ctl_param.light_enable = true;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       } else {
+           sc200ai->light_ctl_param.light_enable = false;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       }
+
+       dev_err(&sc200ai->client->dev, "%s: light_ctl_write ret:%d\n",
+            __func__, rt);
+
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
@@ -1284,6 +1305,18 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
        ch_info = (struct rkmodule_channel_info *)arg;
        ret = sc200ai_get_channel_info(sc200ai, ch_info);
        break;
+
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = (struct rk_light_param *)arg;
+       dev_err(&sc200ai->client->dev,
+           "%s: RKCIS_CMD_FLASH_LIGHT_CTRL type: %s enable: %s\n",
+           __func__,
+           light_param->light_type == LIGHT_PWM ? "pwm" : "gpio",
+           light_param->light_enable ? "enable" : "disable");
+
+       memcpy(&sc200ai->light_ctl_param, light_param, sizeof(*light_param));
+
```

**CN PDF p.40 · 275**

```text
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1304,6 +1337,7 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
    struct rkmodule_channel_info *ch_info;
    long ret;
    u32 stream = 0;
+   struct rk_light_param *light_param = NULL;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1400,6 +1434,19 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
        }
        kfree(ch_info);
        break;
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
+       if (!light_param) {
+           ret = -ENOMEM;
+           return ret;
+       }
+       ret = copy_from_user(light_param, up, sizeof(*light_param));
+       if (!ret)
+           ret = sc200ai_ioctl(sd, cmd, light_param);
+       else
+           ret = -EFAULT;
+       kfree(light_param);
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1451,6 +1498,10 @@ static int __sc200ai_stop_stream(struct sc200ai
*sc200ai)
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
+   sc200ai->light_ctl_param.duty_cycle = 0;
+   sc200ai->light_ctl_param.light_enable = false;
+   light_ctl_write(sc200ai->module_index,
+           &sc200ai->light_ctl_param);
    return sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
 }
@@ -1973,6 +2024,7 @@ static int sc200ai_initialize_controls(struct sc200ai
*sc200ai)
    sc200ai->subdev.ctrl_handler = handler;
    sc200ai->has_init_exp = false;
    sc200ai->is_standby = false;
+   sc200ai->light_ctl_param.duty_cycle = 0;

    return 0;
```

{% endraw %}
