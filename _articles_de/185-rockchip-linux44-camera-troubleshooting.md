---

title: "Rockchip Linux 4.4 Camera: Fehlerbehebung"

description: "Rockchip Linux 4.4 Camera: Fehlerbehebung · V1.0.1"

excerpt: "Rockchip Linux 4.4 Camera: Fehlerbehebung"

translation_key: 185-rockchip-linux44-camera-troubleshooting

slug: 185-rockchip-linux44-camera-troubleshooting

lang: de

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Plattformreferenz: Hersteller V1.0.1, RK3xxx; Linux 4.4+. Die vollständigen Kapitel behandeln Kameratreiber, Sensoranbindung, Erfassung und Fehlersuche. Konkrete ArmSoM-Board/BSP/SDK/Kernel-Kombinationen sind nicht validiert; Schaltplan, Schnittstellen, Versorgung/Takte, Treiber und IQ-Dateien prüfen. Beispiele/Messwerte stammen vom Hersteller, nicht von ArmSoM; keine Hardwarebefehle ausgeführt. ZH nutzt chinesische Originalbilder, EN/RU/DE englische.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.5; unit 0 -->

## 1. Sensor in Betrieb nehmen

<!-- en PDF p.5; unit 1 -->

### 1.1 Sensor-ID fehlt: I2C-Kommunikationsfehler

<!-- en PDF p.5; unit 2 -->

<!-- en PDF p.5; unit 3 -->

Wird die Sensor-ID nicht erkannt, führt die Quelle dies nicht auf RKISP/RKCIF, sondern auf die Einschaltsequenz zurück. In folgender Reihenfolge prüfen:

<!-- en PDF p.5; unit 4 -->

1. Stimmt die 7-Bit-i2c-slave-id? Wurde versehentlich eine 8-Bit-Adresse eingetragen?

<!-- en PDF p.5; unit 5 -->

2. Liegt 24M-mclk mit korrekter Spannungsamplitude an?

<!-- en PDF p.5; unit 6 -->

3. Entspricht die Einschaltfolge für avdd, dovdd, dvdd, power down, reset usw. den Vorgaben?

<!-- en PDF p.5; unit 7 -->

#### 1.1.1 Was ist eine 7-Bit-Adresse?

<!-- en PDF p.5; unit 8 -->

Das niederwertigste Bit LSB der 8-Bit-Angabe bezeichnet R/W; die oberen sieben Bits sind die benötigte i2c slave id.

<!-- en PDF p.5; unit 9 -->

#### 1.1.2 Nach dem Einschalten fehlen 24M-mclk und vdd

<!-- en PDF p.5; unit 10 -->

<!-- en PDF p.5; unit 11 -->

Der Treiber aktiviert Takt und Versorgung normalerweise nur bei Bedarf; nach dem Booten sind sie standardmäßig aus. Zum Messen kann die Implementierung von power_off() vorübergehend auskommentiert werden, damit die Versorgung eingeschaltet bleibt.

<!-- en PDF p.5; unit 12 -->

#### 1.1.3 24M-mclk weiterhin nicht messbar

<!-- en PDF p.5; unit 13 -->

Die Oszilloskopbandbreite prüfen; die Quelle empfiehlt mindestens 48M.

<!-- en PDF p.5; unit 14 -->

1. Aktiviert der Sensor mclk nicht korrekt, die Taktoperationen in drivers/media/i2c/ov5695.c vergleichen.

<!-- en PDF p.5; unit 15 -->

2. Ein anderes Modul kann den GPIO belegen; normalerweise erscheint ein Hinweis im Kernel-Log. Mit io lassen sich pin-ctrl-Register prüfen.

<!-- en PDF p.6; unit 16 -->

#### 1.1.4 mclk vorhanden, aber falsche Spannungsamplitude

<!-- en PDF p.6; unit 17 -->

<!-- en PDF p.6; unit 18 -->

Ursache ist eine falsche io-domains-Konfiguration. Üblich sind 1.8v oder

<!-- en PDF p.6; unit 19 -->

3.3v, abhängig vom Schaltplan. Schaltplan prüfen und io-domains entsprechend anpassen:

<!-- en PDF p.6; unit 20 -->

```text
&io_domains {
    status = "okay";

    vccio1-supply = <&vcc1v8_soc>;
    vccio2-supply = <&vccio_sd>;
    vccio3-supply = <&vcc1v8_dvp>;
    vccio4-supply = <&vcc_3v0>;
    vccio5-supply = <&vcc_3v0>;
};
```

<!-- en PDF p.6; unit 21 -->

Im Beispiel wird vccio3 von vcc1v8_dvp versorgt. Seine Spannungsdomäne beträgt

<!-- en PDF p.6; unit 22 -->

1.8v; daher muss mclk ebenfalls 1.8v haben. io_domains kann beim Booten später als der Sensor initialisiert werden. Schlägt die ID-Abfrage fehl, probe erneut versuchen:

<!-- en PDF p.6; unit 23 -->

```text
diff --git a/drivers/media/i2c/ov7251.c b/drivers/media/i2c/ov7251.c
index e0c608f..7842812 100644
--- a/drivers/media/i2c/ov7251.c
+++ b/drivers/media/i2c/ov7251.c
@@ -961,7 +961,8 @@ static int ov7251_check_sensor_id(struct ov7251 *ov7251,
                              OV7251_REG_VALUE_16BIT, &id);
        if (id != CHIP_ID) {
                dev_err(dev, "Unexpected sensor id(%06x), ret(%d)\n", id, ret);
-               return -ENODEV;
+               return -EPROBE_DEFER;
        }
```

<!-- en PDF p.6; unit 24 -->

Ist io_domains beim Sensorstart noch nicht initialisiert, gelten Standardwerte. Weichen diese von der realen Versorgung ab, stimmt mclk nicht. -EPROBE_DEFER lässt das System probe später erneut ausführen.

<!-- en PDF p.6; unit 25 -->

#### 1.1.5 Einschaltsequenz des Sensors prüfen

<!-- en PDF p.6; unit 26 -->

<!-- en PDF p.6; unit 27 -->

Das Datasheet beschreibt Reihenfolge und Abstände der Versorgungsspannungen; mit dem Oszilloskop prüfen. Manche Sensoren wie ov5695 verlangen keine Reihenfolge für vdd und verwenden regulator_bulk. Andere wie ov2685.c benötigen getrennte Regler, etwa avdd_regulator und dovdd_regulator. Nach tatsächlichen Anforderungen auswählen.

<!-- en PDF p.7; unit 28 -->

### 1.2 Standardwerte exp_def, hts_def und vts_def

<!-- en PDF p.7; unit 29 -->

<!-- en PDF p.7; unit 30 -->

Werte beim Sensorhersteller erfragen oder Register und Initialisierungswerte im Datasheet bzw. Registersatz suchen. Beispiel ov2685.c:

<!-- en PDF p.7; unit 31 -->

```text
#define OV2685_REG_VTS                  0x380e

...

        {0x380e, 0x05},
        {0x380f, 0x0e},

...

                .vts_def = 0x050e,
```

<!-- en PDF p.7; unit 32 -->

0x380e und 0x380f sind die vts-Register. Wird 0x050e initialisiert, ist vts_def=0x050e. exp und hts verwenden Standardwerte aus dem Datasheet. Soll die Anwendung Belichtung und Bildrate nicht ändern, sind exp, hts und vts unnötig; RAW-Sensoren benötigen sie normalerweise.

<!-- en PDF p.7; unit 33 -->

### 1.3 Werte für link_freq und pixel_rate

<!-- en PDF p.7; unit 34 -->

link_freq ist die reale MIPI-Taktfrequenz, nicht 24M-mclk, sondern MIPI dn/dp clk. Hersteller oder Datasheet prüfen. Der Wert ist normalerweise mindestens so groß wie das Ergebnis folgender Formel in Hz:

<!-- en PDF p.7; unit 35 -->

```text
width * height * fps * bits_per_pixel / lanes / 2
```

<!-- en PDF p.7; unit 36 -->

Ist link_freq unbekannt, mit dem Oszilloskop messen. pixel_rate bezeichnet Pixel pro Sekunde und ergibt sich aus link_freq wie folgt:

<!-- en PDF p.7; unit 37 -->

```text
link_freq * 2 * lanes / bits_per_pixel
```

<!-- en PDF p.7; unit 38 -->

### 1.4 Erfolgreichen Sensorstart bestätigen

<!-- en PDF p.7; unit 39 -->

Zuerst muss die Sensor-ID lesbar sein, also I2C fehlerfrei arbeiten. media-ctl -p -d /dev/media0 sollte Name, Auflösung und weitere Sensordaten anzeigen.

<!-- en PDF p.8; unit 40 -->

Beim Erfassen muss MIPI Daten ohne MIPI-/ISP-Fehler liefern und die Anwendung Frames empfangen.

<!-- en PDF p.8; unit 41 -->

### 1.5 Sensor-AVL

<!-- en PDF p.8; unit 42 -->

RGB-Sensor-AVL: https://redmine.rockchip.com.cn/projects/rockchip_camera_module_support_list/camera. Dort stehen Moduldaten. Für andere Sensoren, etwa YUV, im Kernel unter drivers/media/i2c suchen; laut Quelle wurden diese Treiber von Rockchip abgestimmt.

<!-- en PDF p.8; unit 43 -->

## 2. MIPI-/ISP-Fehler

<!-- en PDF p.8; unit 44 -->

Bei der ersten Sensorabstimmung treten häufig auf:

<!-- en PDF p.8; unit 45 -->

1. Keine Frames und keine ISP-/MIPI-Fehler.

<!-- en PDF p.8; unit 46 -->

2. Fortlaufende MIPI-Fehlermeldungen.

<!-- en PDF p.8; unit 47 -->

3. ISP meldet PIC_SIZE_ERROR.

<!-- en PDF p.8; unit 48 -->

4. Gelegentliche MIPI-Fehler.

<!-- en PDF p.8; unit 49 -->

5. MIPI-Fehler bis zum Systemabsturz.

<!-- en PDF p.8; unit 50 -->

### 2.1 Welche MIPI-Parameter einstellen?

<!-- en PDF p.8; unit 51 -->

Vier Parameter zwischen Sensor und ISP prüfen:

<!-- en PDF p.8; unit 52 -->

1. Sensor-Ausgabeauflösung.

<!-- en PDF p.8; unit 53 -->

2. Bildformat YUV oder RGB RAW und 8/10/12 Bit.

<!-- en PDF p.8; unit 54 -->

3. MIPI-Ausgangsfrequenz: Hier schreibt die Quelle ink_freq, sonst link_freq.

<!-- en PDF p.8; unit 55 -->

4. Anzahl der Sensor-MIPI-Lanes und richtige DTS-Konfiguration.

<!-- en PDF p.8; unit 56 -->

### 2.2 Keine Frames und keine ISP-/MIPI-Fehler

<!-- en PDF p.8; unit 57 -->

<!-- en PDF p.8; unit 58 -->

1. Kernel-Log prüfen, etwa mit dmesg \| grep MIPI.

<!-- en PDF p.8; unit 59 -->

2. I2C-Lese-/Schreibfehler suchen. Fehlt die Registerkonfiguration, wurden Initialisierung und Ausgang eventuell nicht aktiviert.

<!-- en PDF p.8; unit 60 -->

3. MIPI-clk- und Datenleitungen messen. Fehlt ein Signal, Sensorinitialisierung und Hardware untersuchen.

<!-- en PDF p.9; unit 61 -->

4. Gibt es MIPI-Signal, aber weder Fehler noch Daten: Parameter aus §2.1 erneut prüfen; fehlerfreie I2C-Kommunikation und vollständige Registerinitialisierung sicherstellen. Erst s_stream() darf MIPI aktivieren; davor, insbesondere in s_power(), darf kein Signal anliegen. Der Empfänger ist vorher nicht bereit und kann den SOT-Protokollanfang verlieren. Sensor-clock-lane von continuous auf non-continuous umstellen.

<!-- en PDF p.9; unit 62 -->

### 2.3 MIPI-Fehler

<!-- en PDF p.9; unit 63 -->

#### 2.3.1 MIPI-Fehlertabellen

<!-- en PDF p.9; unit 64 -->

Für RK3288/RK3399/RK3368:

<!-- en PDF p.9; unit 65 -->

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

<!-- en PDF p.9; unit 66 -->

Für RK3326/PX30/RK1808 gelten drei Fehlertabellen:

<!-- en PDF p.10; unit 67 -->

| Fehlerbit ERR1 | Kurzname | Beschreibung |
| --- | --- | --- |
| 28 | ERR_ECC | ECC-Fehler |
| 27:24 | ERR_CRC | CRC-Fehler |
| 23:20 | ERR_FRAME_DATA | Bildübertragung abgeschlossen, jedoch mindestens ein CRC-Fehler |
| 19:16 | ERR_F_SEQ | Bildnummer nicht wie erwartet fortlaufend |
| 15:12 | ERR_F_BNDRY | Bildanfang und -ende passen nicht zusammen |
| 11:8 | ERR_SOT_SYNC | MIPI-SOT-Synchronisationsfehler (Übertragungsbeginn), ein Bit je Lane |
| 7:4 | ERR_EOT_SYNC | MIPI-EOT-Synchronisationsfehler (Übertragungsende), ein Bit je Lane |

<!-- en PDF p.10; unit 68 -->

| Fehlerbit ERR2 | Kurzname | Beschreibung |
| --- | --- | --- |
| 19:16 | ERR_CONTROL |  |
| 15:12 | ERR_ID |  |
| 11:8 | ERR_ECC_CORRECTED |  |
| 7:4 | ERR_SOTHS | PHY-SOTHS-Fehler |
| 3:0 | ERR_ESC | PHY-ESC-Fehler |

<!-- en PDF p.10; unit 69 -->

Typische Fehler werden nachfolgend erläutert.

<!-- en PDF p.10; unit 70 -->

#### 2.3.2 SOT/SOT_SYNC-Fehler

<!-- en PDF p.10; unit 71 -->

SOT muss MIPI_D-PHY_Specification entsprechen. Für tiefere Analyse die PDF-Spezifikation heranziehen, insbesondere:

<!-- en PDF p.10; unit 72 -->

1. High-Speed Data Transmission — Hochgeschwindigkeits-Datenübertragung.

<!-- en PDF p.10; unit 73 -->

2. Start-of-Transmission Sequence — Übertragungsstartsequenz.

<!-- en PDF p.10; unit 74 -->

3. HS Data Transmission Burst — HS-Datenburst.

<!-- en PDF p.10; unit 75 -->

4. High-Speed Clock Transmission — Hochgeschwindigkeits-Taktübertragung.

<!-- en PDF p.10; unit 76 -->

5. Global Operation Timing Parameters — globale Zeitparameter. Lief der Sensor auf anderen Plattformen bereits, ist ein grundsätzlicher MIPI-Protokollverstoß unwahrscheinlich. Empfehlungen:

<!-- en PDF p.10; unit 77 -->

1. Beim Hersteller erfolgreichen MIPI-Datentransfer bestätigen lassen.

<!-- en PDF p.10; unit 78 -->

2. link_freq erneut prüfen: Ths-settle der SOT-Sequenz muss am Empfänger richtig eingestellt sein.

<!-- en PDF p.11; unit 79 -->

3. Bei mehreren Lanes mit dem Hersteller einen Ein-Lane-Test durchführen.

<!-- en PDF p.11; unit 80 -->

#### 2.3.3 CRC/CheckSum(CS)- und ECC/ECC1/ECC2-Fehler

<!-- en PDF p.11; unit 81 -->

ECC- und CS-Fehler bedeuten unvollständige/fehlerhafte Übertragungsdaten. Empfehlungen:

<!-- en PDF p.11; unit 82 -->

1. Zuerst Hardware-Signale prüfen.

<!-- en PDF p.11; unit 83 -->

2. Bei mehreren Lanes eine Lane testen; unzureichende Synchronisation kann ECC verursachen.

<!-- en PDF p.11; unit 84 -->

#### 2.3.4 ERR_PROTOCOL/ERR_F_BNDRY

<!-- en PDF p.11; unit 85 -->

Erwartetes EOT/SOT fehlt; beide müssen paarweise auftreten. Signalverlauf prüfen.

<!-- en PDF p.11; unit 86 -->

#### 2.3.5 Frames vorhanden, aber gelegentliche MIPI-Fehler

<!-- en PDF p.11; unit 87 -->

Fehlertabellen beachten und Signalfehler hardwareseitig prüfen. Nur beim Aufnahmestart auftretende Fehler können von ungültigen MIPI-Signalen beim Einschalten stammen. Versuchen:

<!-- en PDF p.11; unit 88 -->

1. Vollständige Registerinitialisierung in s_power() verlegen: Der MIPI-Empfänger ignoriert zu diesem Zeitpunkt noch alle Daten.

<!-- en PDF p.11; unit 89 -->

2. Am Ende von s_power() den Ausgang mit stop_stream() ausschalten.

<!-- en PDF p.11; unit 90 -->

3. In start_stream() und stop_stream() ausschließlich MIPI-Ausgabe ein-/ausschalten.

<!-- en PDF p.11; unit 91 -->

#### 2.3.6 Viele MIPI-Fehler bis zum Absturz

<!-- en PDF p.11; unit 92 -->

Dies kann der verschärfte Fall aus §2.3.5 sein: Ungültige Signale verursachen pegelgesteuerte Interrupts, einen Interrupt-Sturm und schließlich den Absturz. Maßnahmen aus §2.3.5 testen. Das englische „voltage interruptions“ wird gemäß der chinesischen Erklärung als pegelgesteuerte Interrupts wiedergegeben.

<!-- en PDF p.12; unit 93 -->

#### 2.3.7 ISP PIC_SIZE_ERROR

<!-- en PDF p.12; unit 94 -->

Der ISP erhält nicht die erwartete Anzahl Zeilen/Spalten. Auflösung auf allen Stufen prüfen. Meldet bereits MIPI einen Fehler, zuerst diesen beheben. Prüfpunkte:

<!-- en PDF p.12; unit 95 -->

1. Ist die DDR-Frequenz zu niedrig? Fehlende Reaktionsgeschwindigkeit kann den Fehler verursachen. Bei maximaler Frequenz testen: echo performance &gt; /sys/class/devfreq/dmc/governor.

<!-- en PDF p.12; unit 96 -->

2. Ist eine nachfolgende Stufe größer als die vorherige? media-ctl -p -d /dev/media0 zeigt die Topologie. Es muss Sensor == MIPI_DPHY &gt;= isp_sd input &gt;= isp_sd output gelten; ohne manuelle Änderung normalerweise erfüllt.

<!-- en PDF p.12; unit 97 -->

3. Gibt der Sensor die richtige Auflösung aus? Deklarierte Größe im Treiber verkleinern. Beispiel ov7251.c mit 640x480:

<!-- en PDF p.12; unit 98 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 640,
                .height = 480,
```

<!-- en PDF p.12; unit 99 -->

width/height etwa auf 320x240 reduzieren, ohne Register zu ändern; damit prüfen, ob die konfigurierte Größe die tatsächliche Sensorausgabe übersteigt.

<!-- en PDF p.12; unit 100 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 320,
                .height = 240,
```

<!-- en PDF p.12; unit 101 -->

## 3. Bilder erfassen

<!-- en PDF p.12; unit 102 -->

Dieses Kapitel behandelt typische Fragen zur Bilderfassung.

<!-- en PDF p.12; unit 103 -->

### 3.1 Aufnahmemethoden

<!-- en PDF p.12; unit 104 -->

RKISP/RKCIF unterstützen V4L2. Folgende Wege sind möglich:

<!-- en PDF p.12; unit 105 -->

1. v4l2-ctl aus v4l-utils. Bei der Fehlersuche zuerst damit die Bildausgabe prüfen. Das Werkzeug speichert Frames, dekodiert oder zeigt sie aber nicht. Zur Anzeige mplayer unter Ubuntu/Debian oder 7yuv unter Windows nutzen.

<!-- en PDF p.13; unit 106 -->

Details stehen in Rockchip_Developer_Guide_Linux_Camera_CN.pdf; außerdem v4l2-ctl --help.

<!-- en PDF p.13; unit 107 -->

2. qcamera aus dem Linux-SDK: Kamera-App auf dem Desktop öffnen, Videogerät wählen und Vorschau starten. Es handelt sich um ein Qt-Beispiel; für Produkte eine eigene Anwendung entwickeln.

<!-- en PDF p.13; unit 108 -->

3. GStreamer v4l2src erfasst /dev/video und zeigt die Bilder. Zuerst SDK-Skripte unter /rockchip_test/camera/ ansehen. Alte rkisp-/rkv4l2src-Plug-ins werden nicht mehr unterstützt; das normale v4l2src verwenden. Gründe: 3A muss nicht mehr in diesen Plug-ins angepasst werden (Kapitel 4), und die rkisp-V4L2-Schnittstelle ist standardkonformer.

<!-- en PDF p.13; unit 109 -->

4. Unter Debian können VLC und andere Open-Source-Werkzeuge genutzt werden. Nach apt-Installation zeigt folgender Befehl die Kamera:

<!-- en PDF p.13; unit 110 -->

```text
vlc v4l2:///dev/video1:width=640:height=480
```

<!-- en PDF p.13; unit 111 -->

Berechtigung der Gruppe video oder root ist erforderlich.

<!-- en PDF p.13; unit 112 -->

### 3.2 Falsche Farben, zu dunkles oder helles Bild

<!-- en PDF p.13; unit 113 -->

<!-- en PDF p.13; unit 114 -->

Nach Sensortyp unterscheiden:

<!-- en PDF p.13; unit 115 -->

1. RAW RGB wie RGGB/BGGR benötigt funktionierendes 3A, siehe Kapitel 4. Läuft 3A, Dekodier-/Anzeigeformat und vertauschte UV-Komponenten prüfen.

<!-- en PDF p.13; unit 116 -->

2. Bei YUV oder RGB565/RGB888 läuft ISP im Bypass. Bei falscher Farbe Sensor-Ausgabeformat und UV-Reihenfolge prüfen; sind diese korrekt, den Sensorhersteller kontaktieren. Bei deutlich falscher Helligkeit ebenfalls den Hersteller fragen.

<!-- en PDF p.14; unit 117 -->

### 3.3 ISP-Topologie und media-ctl

<!-- en PDF p.14; unit 118 -->

<!-- en PDF p.14; unit 119 -->

RKISP/RKCIF können mehrere Sensoren zeitlich abwechselnd nutzen; RKISP bietet zudem mehrstufiges Cropping. Die Knoten bilden eine Topologie und lassen sich einzeln mit media-ctl konfigurieren. Details in Rockchip_Developer_Guide_Linux_Camera_CN.pdf.

<!-- en PDF p.14; unit 120 -->

#### 3.3.1 Mehrere Sensoren an einem ISP

<!-- en PDF p.14; unit 121 -->

Nur zeitlich abwechselnder Betrieb ist möglich. Sensoren in DTS mit MIPI DPHY verbinden und über media-ctl umschalten.

<!-- en PDF p.14; unit 122 -->

### 3.4 Entsprechen RAW-Aufnahmen exakt dem Original?

<!-- en PDF p.14; unit 123 -->

<!-- en PDF p.14; unit 124 -->

Im RAW-Bypass (RGGB/BGGR) ist 8-Bit-Ausrichtung erforderlich; fehlende niederwertige Bits werden mit null ergänzt. Originale 8-/16-Bit-Bilder bleiben unverändert. Bei 10/12 Bit wird jeder Pixel unten auf 16 Bit aufgefüllt. Nur MP kann RAW ausgeben, SP nicht.

<!-- en PDF p.14; unit 125 -->

### 3.5 MP und SP gleichzeitig ausgeben

<!-- en PDF p.14; unit 126 -->

<!-- en PDF p.14; unit 127 -->

SP und MP können dasselbe Sensorbild unabhängig zuschneiden und umformatieren. Fähigkeiten siehe Rockchip_Developer_Guide_Linux_Camera_CN.pdf. Gleichzeitige Ausgabe ist nur bei RGB/YUV auf beiden Pfaden möglich. Gibt MP RAW aus, entfällt SP.

<!-- en PDF p.14; unit 128 -->

### 3.6 Vergrößerung durch ISP

<!-- en PDF p.14; unit 129 -->

Hardwareseitig vorhanden, aber nicht empfohlen und im Treiber standardmäßig deaktiviert.

<!-- en PDF p.15; unit 130 -->

### 3.7 Drehung durch ISP

<!-- en PDF p.15; unit 131 -->

Nicht unterstützt. Für Flip/Mirror zunächst die Sensorfunktion prüfen; dies ist am effizientesten. Andernfalls RGA nutzen: Code/Beispiele unter external/linux-rga/, Dokumentation unter docs/.

<!-- en PDF p.15; unit 132 -->

### 3.8 Graubild GREY aufnehmen

<!-- en PDF p.15; unit 133 -->

Bei YUV-Ausgabe des ISP oder Y8 des Sensors kann die Anwendung direkt V4L2_PIX_FMT_GREY (FourCC GREY) aufnehmen.

<!-- en PDF p.15; unit 134 -->

### 3.9 Unterstützte RGB-Formate

<!-- en PDF p.15; unit 135 -->

Nur SP unterstützt RGB: V4L2_PIX_FMT_XBGR32 und V4L2_PIX_FMT_RGB565. XBGR32 (FourCC XR24) enthält R/G/B/X; X ist immer 0. RGB888 beziehungsweise 24-Bit-Ausgabe wird nicht unterstützt.

<!-- en PDF p.15; unit 136 -->

### 3.10 Vorschau ohne Bildschirm

<!-- en PDF p.15; unit 137 -->

SDK external/uvc_app/ lässt das Board als UVC-Kamera auftreten. Beschreibung und Code im Verzeichnis beachten. Am PC wird es als USB-Kamera erkannt und kann Vorschau liefern.

<!-- en PDF p.15; unit 138 -->

### 3.11 SP und MP unterscheiden

<!-- en PDF p.15; unit 139 -->

Topologie mit media-ctl -p -d /dev/media0 anzeigen; bei mehreren Geräten /dev/media1 oder /dev/media2 versuchen. Auszug:

<!-- en PDF p.15; unit 140 -->

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //Means the entity is
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //The corresponding
device node is/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //Means the entity is
SP(SelfPath)
            type Node subtype V4L flags 0
```

<!-- en PDF p.16; unit 141 -->

```text
            device node name /dev/video2                 //The corresponding
device node is/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

<!-- en PDF p.16; unit 142 -->

Fehlt media-ctl, kann über /sys/ gesucht werden:

<!-- en PDF p.16; unit 143 -->

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # Corresponding MP
node/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # Corresponding SP
Node/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

<!-- en PDF p.16; unit 144 -->

## 4. 3A-Verarbeitung

<!-- en PDF p.16; unit 145 -->

RAW BAYER RGB wie RGGB/BGGR benötigt 3A und RKISP-Bildverarbeitung. Das Verfahren hängt von camera_engine_rkisp ab; eine aktuelle kompatible Version ist empfohlen. Modul in der Unterstützungsliste prüfen: Unterstützte Module haben XML unter external/camera_engine_rkisp/iqfiles/. Andernfalls Modul-Tuning über den geschäftlichen Herstellerkontakt anfragen.

<!-- en PDF p.16; unit 146 -->

### 4.1 Version von camera_engine_rkisp

<!-- en PDF p.16; unit 147 -->

1. Aus dem Quellcode:

<!-- en PDF p.16; unit 148 -->

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.16; unit 149 -->

2. Aus dem Laufzeit-Log:

<!-- en PDF p.16; unit 150 -->

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.17; unit 151 -->

Unter v2.2.0 ein Update auf v2.2.0 oder neuer erwägen.

<!-- en PDF p.17; unit 152 -->

#### 4.1.1 Erforderliche rkisp-Kerneltreiberversion

<!-- en PDF p.17; unit 153 -->

<!-- en PDF p.17; unit 154 -->

camera_engine_rkisp stellt Anforderungen an den Kerneltreiber; rkisp muss ausreichend aktuell sein.

<!-- en PDF p.17; unit 155 -->

1. ISP-Version aus dem Kernelquellcode:

<!-- en PDF p.17; unit 156 -->

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # The output v0.1.5 is
the version number of the rkisp driver
```

<!-- en PDF p.17; unit 157 -->

2. ISP-Version aus dem Kernel-Log:

<!-- en PDF p.17; unit 158 -->

```text
# dmesg  | grep "rkisp1 driver version"
[    0.867864] rkisp1 ff4a0000.rkisp1: rkisp1 driver version: v00.01.05
```

<!-- en PDF p.17; unit 159 -->

### 4.2 camera_engine_rkisp aktualisieren

<!-- en PDF p.17; unit 160 -->

Drei Teile:

<!-- en PDF p.17; unit 161 -->

1. Hauptcode unter external/camera_engine_rkisp separat mit git/repo aktualisieren, ohne die übrigen SDK-Verzeichnisse anzutasten.

<!-- en PDF p.17; unit 162 -->

2. Kernel passend zu camera_engine_rkisp aktualisieren. Benötigte rkisp-Version über git log dieses Verzeichnisses ermitteln. Beispiel:

<!-- en PDF p.17; unit 163 -->

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729
```

<!-- en PDF p.18; unit 164 -->

```text
matched rkisp1 driver version:
  v0.1.5                 # The needed kernel driver version is v0.1.5

Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
Signed-off-by: ZhongYichong <zyc@rock-chips.com>
Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

<!-- en PDF p.18; unit 165 -->

3. Buildroot-Bauskript unter buildroot/package/rockchip/camera_engine_rkisp. Ist ein komplettes Buildroot-Update unpraktisch, nur dieses Verzeichnis aktualisieren.

<!-- en PDF p.18; unit 166 -->

### 4.3 Funktion von 3A prüfen

<!-- en PDF p.18; unit 167 -->

Nach Bestätigung von camera_engine_rkisp v2.2.0 oder neuer ein Bild erfassen und Farbe/Belichtung prüfen. Zusätzlich nach rkisp_3A_server im Hintergrund suchen:

<!-- en PDF p.18; unit 168 -->

```text
# ps -ef | grep rkisp_3A_server
  706 root      9176 S    /usr/bin/rkisp_3A_server --mmedia=/dev/media1
  746 root      2408 S    grep rkisp_3A_server
# pidof rkisp_3A_server
706
```

<!-- en PDF p.18; unit 169 -->

Im Beispiel gehört PID 706 zu rkisp_3A_server.

<!-- en PDF p.18; unit 170 -->

#### 4.3.1 rkisp_3A_server fehlt

<!-- en PDF p.18; unit 171 -->

1. /usr/bin/rkisp_3A_server prüfen. Fehlt die Datei, Version und Build von camera_engine_rkisp prüfen.

<!-- en PDF p.18; unit 172 -->

2. /var/log/syslog nach rkisp_3A-Fehlern durchsuchen, insbesondere fehlendem oder unpassendem Sensor-XML.

<!-- en PDF p.18; unit 173 -->

3. In einer Shell rkisp_3A_server --mmedia=/dev/media0 starten, das zu /dev/video passende media-Gerät wählen. In einer anderen Shell Bilder erfassen, um Serverfehler zu erhalten.

<!-- en PDF p.18; unit 174 -->

#### 4.3.2 rkisp_3A_server starten

<!-- en PDF p.18; unit 175 -->

Im SDK startet /etc/init.d/S40rkisp_3A den Server im Hintergrund. Fehlt das Skript, camera_engine_rkisp und Buildroot-Paketbauskripte prüfen.

<!-- en PDF p.19; unit 176 -->

#### 4.3.3 Name und Pfad der IQ-XML-Datei

<!-- en PDF p.19; unit 177 -->

<!-- en PDF p.19; unit 178 -->

Der Name hat drei Bestandteile:

<!-- en PDF p.19; unit 179 -->

1. Sensortyp, etwa ov5695 oder imx327.

<!-- en PDF p.19; unit 180 -->

2. Modulname aus DTS. RK3326/PX30-EVB-Beispiel: rockchip,camera-module-name = "TongJu";

<!-- en PDF p.19; unit 181 -->

3. Objektivname aus DTS: rockchip,camera-module-lens-name = "CHT842-MD"; Daraus entsteht ov5695_TongJu_CHT842-MD.xml unter /etc/iqfiles/. Groß-/Kleinschreibung beachten.

<!-- en PDF p.19; unit 182 -->

### 4.4 Manuelle Belichtung

<!-- en PDF p.19; unit 183 -->

Zuerst rkisp_3A_server beenden, dann rkisp_demo.cpp oder den librkisp_api.so-Quellcode verwenden.

<!-- en PDF p.19; unit 184 -->

### 4.5 librkisp-Log aktivieren

<!-- en PDF p.19; unit 185 -->

Umgebungsvariable persist_camera_engine_log setzen. Bitbelegung:

<!-- en PDF p.19; unit 186 -->

```text
bits:    23-20   19-16 15-12  11-8  7-4   3-0
module: [xcore]  [ISP] [AF]   [AWB] [AEC] [NO]

0: error
1: warning
2: info
3: verbose
4: debug
```

<!-- en PDF p.19; unit 187 -->

Beispiel: Debug für ISP und AWB:

<!-- en PDF p.19; unit 188 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x040400
# /usr/bin/rkisp_3A_server --mmedia=/dev/media0
```

<!-- en PDF p.20; unit 189 -->

![Technische Originalabbildung · EN PDF p.20](/docs/rockchip-linux44-camera-troubleshooting/assets/en-p020-vector-01.png)

## 5. Anwendungsentwicklung

<!-- en PDF p.20; unit 190 -->

### 5.1 C-Beispiel

<!-- en PDF p.20; unit 191 -->

1. Das SDK enthält rkisp_demo samt Quellcode. Wie v4l2-ctl erfasst es Bilder, zeigt sie aber nicht; es dient vor allem als Codevorlage. Code unter external/camera_engine_rkisp/apps, bei älteren Versionen unter external/camera_engine_rkisp/tests.

<!-- en PDF p.20; unit 192 -->

2. SDK enthält rkisp_api.so samt Quellcode zum Anpassen oder zur direkten C-Entwicklung. Code unter external/camera_engine_rkisp/apps; fehlt der Ordner in einem alten Stand, aktualisieren.

<!-- en PDF p.20; unit 193 -->

### 5.2 DMA buffer und Vorteile

<!-- en PDF p.20; unit 194 -->

DMA buffer ist vom Treiber allokierter Speicher, den mehrere Kernelmodule gemeinsam nutzen können. Dies reduziert Kopien, verbessert Bildverarbeitung und entlastet DDR. Beispiel: Kamera über MPP kodieren:

<!-- en PDF p.20; unit 195 -->

RKISP → gemeinsam genutzter DMA buffer → MPP-Kodierung.

<!-- en PDF p.20; unit 196 -->

RKISP kann DMA buffer von MPP/RGA übernehmen oder Speicher selbst allokieren und an andere Module exportieren. Details im Quellcode von librkisp_api.so.

## Unterschiede des Quellcodes

Der Haupttext folgt der jeweiligen Sprachquelle, RU/DE dem EN-Original. Abweichende Fragmente der anderen Quelle einschließlich Kommentar-/Layoutabweichungen bleiben unten erhalten. Unabhängige Beispiele, kein zusammenhängendes Skript; Quellparameter wurden nicht stillschweigend überschrieben.

**CN PDF p.13 · 108**

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
```

**CN PDF p.14 · 109**

```text
...
```

**CN PDF p.14 · 111**

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

**CN PDF p.14 · 116**

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # 输出的v2.2.0是
librkisp.so的版本号
```

**CN PDF p.14 · 118**

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # 输出的v2.2.0是librkisp.so
的版本号
```

**CN PDF p.15 · 122**

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # 输出的v0.1.5是rkisp驱动的
版本号
```

**CN PDF p.15 · 129**

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729

    matched rkisp1 driver version:
      v0.1.5                 # 所需要的kernel驱动版本为v0.1.5

    Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
    Signed-off-by: ZhongYichong <zyc@rock-chips.com>
    Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

{% endraw %}
