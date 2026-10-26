---
title: "Rockchip USB Gadget UAC: Audiokonfiguration, Tests und Gerätedeskriptoren"
description: "Rockchip USB Gadget UAC: Audiokonfiguration, Tests und Gerätedeskriptoren — V1.3.1"
excerpt: "Rockchip USB Gadget UAC: Audiokonfiguration, Tests und Gerätedeskriptoren"
translation_key: "163-rockchip-usb-gadget-uac"
slug: "163-rockchip-usb-gadget-uac"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UAC, Linux]
---

{% raw %}

# Rockchip USB Gadget UAC: Audiokonfiguration, Tests und Gerätedeskriptoren

ArmSoM-Plattformreferenz nach chinesischem RK-KF-YF-098 V1.3.1. Die Quelle umfasst Rockchip-Chips außer MCU und Linux ab 4.4; keine pauschale Anpassungszusage für alle ArmSoM-Platinen. Platine, SoC, SDK/BSP, Kernelpatches, USB und Codec prüfen. Logs/Tests sind Quellenbeispiele, keine ArmSoM-Messungen; keine Hardwarevalidierung erfolgt. Nur chinesisches PDF vorhanden; dessen Originalbilder werden in allen Sprachen verwendet.

Quellenzweifel beibehalten: Full/High Speed als 12/480 MHz; 176 kHz als 1056 bytes; 60×24×96 kHz als 132 Mbit/s; SOF-Periode als 128us. Einheiten/Berechnungen prüfen, Originalwerte nicht still ersetzen. Der Kernel-5.10-Lautstärkeabschnitt nennt uvc_app, andere uac_app. Windows-UAC2-Feature-Unit-Grenzen und neuere Kernelstandards am konkreten BSP prüfen. Beispiele entfernen configfs-Links und schalten USB um, was ADB unterbrechen kann; nichts ausgeführt.

Technisches Vorwort: UAC1/UAC2 unterstützen Aufnahme/Wiedergabe; UAC1 Legacy benötigt eine reale Soundkarte und bietet nur Wiedergabe; Audio Source bietet nur Aufnahme mit 15 Raten. Nach Produktbedarf auswählen. Physische Lautstärke-/Stummschalttasten benötigen zusätzliche HID-Steuerung, die im beschriebenen SDK fehlt. Entwicklungsreferenzen:

`Kernel/Documentation/usb/gadget-testing.txt` — 6. HID function

`Kernel/Documentation/ABI/testing/configfs-usb-gadget-hid`

Universal Serial Bus Audio Device Class Specification for Basic Audio Devices — 8 HID Support in Basic Audio Devices

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Kernel-UAC-Konfiguration

### 1.1 Kernel-Commits

Für den vollen Funktionsumfang den UAC1/UAC2-Code von Kernel-5.10 mindestens auf folgenden Commit aktualisieren.

```text
usb: gadget: u_audio: add uevent for ppm compensation
```

Für UAC1/UAC2 unter Kernel-4.4/4.19 zunächst die folgende Patchserie im Kernel prüfen. Fehlt sie, das Problem über Rockchip Redmine oder beim Autor des Quelldokuments melden. Patchliste:

```text
usb: gadget: f_uac1: set baInterfaceNr of ac_header_desc dynamically
usb: gadget: u_audio: fix dev_dbg information
usb: gadget: f_uac: fix volume control to uevent
usb: gadget: u_audio: disable eps when usb disconnect
usb: gadget: u_audio: add uevent for ppm compensation
usb: gadget: f_uac: update maxpacket in function bind
usb: gadget: f_uac: add pktsize calculating at setting playback srate
usb: gadget: f_uac: add volume and mute feature unit
UPSTREAM: usb: gadget: f_uac2: fix packet size calculation
usb: gadget: u_audio: fix the risk of strcpy out of bounds
usb: gadget: f_uac1: disable IN/OUT ep if unused
usb: gadget: u_audio: add uevent for set_alt and set_srate
FROMLIST: usb: gadget: f_uac*: Support multiple sampling rates
FROMLIST: usb: gadget: f_uac*: Reduce code duplication
FROMLIST: usb: gadget: f_uac1: Fix endpoint reading
```

### 1.2 Konfigurationsoptionen

CONFIG_USB_CONFIGFS_F_UAC1 aktiviert UAC1; CONFIG_USB_CONFIGFS_F_UAC2 UAC2; CONFIG_USB_CONFIGFS_F_UAC1_LEGACY UAC1 Legacy; CONFIG_USB_CONFIGFS_F_ACC wird von Audio Source benötigt; CONFIG_USB_CONFIGFS_F_AUDIO_SRC aktiviert Audio Source.

### 1.3 Dokumentation

`Documentation/usb/gadget_configfs.txt`

`Documentation/usb/gadget-testing.txt`

`Documentation/ABI/testing/configfs-usb-gadget-uac1`

`Documentation/ABI/testing/configfs-usb-gadget-uac1_legacy`

`Documentation/ABI/testing/configfs-usb-gadget-uac2`

### 1.4 Funktionsunterstützung

Tabelle 1-1. UAC1/UAC2-Gerätefunktionen auf Rockchip.

| Funktion | Uevent-Steuerung | Mehrere Abtastraten | Mehrere Kanäle | Feature-Unit-Lautstärke | Taktsynchronisation |
| --- | --- | --- | --- | --- | --- |
| UAC1 | YES | YES | YES | YES | YES |
| UAC2 | YES | YES | YES | YES | YES |

[1] Uevent-Steuerung: Der Kernel sendet UAC-Start/Stopp-, Abtastraten- und Lautstärkeereignisse an uac_app zur Soundkartensteuerung; siehe Uevent. [2] UAC2-Feature-Unit-Lautstärkeregelung ist mit Windows inkompatibel. Für UAC1 aktivieren, für UAC2 deaktivieren; siehe UAC-Nutzung. [3] Taktsynchronisation passt die Audiotaktfrequenz dynamisch an den USB-Hosttakt an. Im Quell-SDK unterstützt nur RV1126-Linux-4.19 dies; siehe PPM-Kompensation.

## 2. UAC1/UAC2-Nutzung und Tests

### 2.1 UAC1-Informationen

USB Audio Class 1 (1998): Die Quelle nennt maximal 24 Bit/96 kHz, obwohl der Standard selbst keine Abtastratengrenze festlegt. Class 1 ist an USB 1 Full Speed gebunden, in der Quelle als 12 MHz angegeben. Pro Millisekunde wird ein Paket mit höchstens 1023 Byte gesendet. Zwei Kanäle × 24 Bit × 96000 Hz = 4608000 Bit/s oder 576 Byte/ms und liegen innerhalb der Grenze.

Laut Quelle benötigt eine höhere übliche Rate wie 176 kHz 1056 Byte und überschreitet damit die Paketgrenze. Win, OSX und Linux unterstützen Class 1 nativ: keine Treiberinstallation, Plug-and-play, zwei Kanäle mit 24 Bit/96 kHz. Rockchip UAC1 implementiert USB Audio Class 1.0 für Aufnahme/Wiedergabe ohne physische Soundkarte und setzt bInterval=4. Standard: High Speed, Aufnahme/Wiedergabe jeweils 48 KHz, zwei Kanäle und 16 Bit. [1] Audio 1.0 entstand vor USB 2.0 und kennt High Speed nicht. Empirische Regeln wie bInterval=4 am isochronen Endpunkt ermöglichen High Speed unter bestimmten Betriebssystemen. Die Quelle berichtet Funktion auf verschiedenen Plattformen und bessere Windows-Kompatibilität als UAC2. [2] Abtastrate, Kanäle und Bittiefe sind über Kernel-Schnittstellen einstellbar; siehe UAC-Nutzung.

### 2.2 UAC2-Informationen

USB Audio Class 2 (2009) unterstützt zusätzlich 32 Bit und übliche Raten über 96 kHz. Verwendet wird High Speed, in der Quelle als 480 MHz bezeichnet, mit USB 2/3. Bei 40-facher Full-Speed-Rate beschreibt die Quelle 60 Kanäle × 24 Bit × 96 kHz (132 Mbit/s laut Original) als möglich, nennt keine Wiedergabeauflösungsgrenze und Abwärtskompatibilität zu Class 1. OSX 10.6.4 und Linux haben seit Mitte 2010 Class-2-Treiber mit bis zu 384 kHz. Microsoft unterstützte UAC2 zunächst nicht; ein Windows-10-Update im April 2017 ergänzte native Treiber. Ältere Windows-Versionen benötigen Fremdtreiber. Rockchip UAC2 implementiert Audio Class 2.0 für Aufnahme/Wiedergabe ohne physische Soundkarte. Standard: High Speed, jeweils 48 KHz und zwei Kanäle.

Bittiefe für Aufnahme/Wiedergabe: 16 Bit. [1] Native UAC2-Unterstützung beginnt mit Windows 10 Version 1703. [2] Windows und Linux reagieren etwas unterschiedlich auf Audioereignisse und benötigen Kompatibilitätsbehandlung; Linux verhält sich wie Android. [3] Windows merkt sich Gerätetreiber: nach Konfigurationsänderungen den Treiber möglichst deinstallieren, damit das Gerät neu erkannt wird. [4] Rate, Kanäle und Tiefe werden über Kernel-Schnittstellen gesetzt; siehe UAC-Nutzung.

### 2.3 UAC-Nutzung

Konfiguration und Funktionen von Rockchip UAC1/UAC2 sind weitgehend gleich; Protokoll und Kompatibilität unterscheiden sich. CONFIG_USB_CONFIGFS_F_UAC1=y für UAC1 oder CONFIG_USB_CONFIGFS_F_UAC2=y für UAC2 zum Kernel-defconfig hinzufügen. Linux-configfs-Beispiel für Kernel-4.4/4.19:

```text
#!/bin/sh

UAC=uac2

USB_ATTRIBUTE=0x409
USB_GROUP=rockchip
USB_SKELETON=b.1

CONFIGFS_DIR=/sys/kernel/config
USB_CONFIGFS_DIR=${CONFIGFS_DIR}/usb_gadget/${USB_GROUP}
USB_STRINGS_DIR=${USB_CONFIGFS_DIR}/strings/${USB_ATTRIBUTE}
USB_FUNCTIONS_DIR=${USB_CONFIGFS_DIR}/functions
USB_CONFIGS_DIR=${USB_CONFIGFS_DIR}/configs/${USB_SKELETON}

function_init()
{
    mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
}

configfs_init()
{
    echo "Debug: configfs_init"
    mkdir /dev/usb-ffs

    mount -t configfs none ${CONFIGFS_DIR}
    mkdir ${USB_CONFIGFS_DIR} -m 0770
    echo 0x2207 > ${USB_CONFIGFS_DIR}/idVendor
    echo 0x0310 > ${USB_CONFIGFS_DIR}/bcdDevice
    echo 0x0200 > ${USB_CONFIGFS_DIR}/bcdUSB
    mkdir ${USB_STRINGS_DIR}   -m 0770
    SERIAL=`cat /proc/cpuinfo | grep Serial | awk '{print $3}'`
    if [ -z $SERIAL ];then
        SERIAL=0123456789ABCDEF
    fi
    echo $SERIAL > ${USB_STRINGS_DIR}/serialnumber
    echo "rockchip"  > ${USB_STRINGS_DIR}/manufacturer
    echo "uac-test"  > ${USB_STRINGS_DIR}/product

    function_init

    mkdir ${USB_CONFIGS_DIR}  -m 0770
    mkdir ${USB_CONFIGS_DIR}/strings/${USB_ATTRIBUTE}  -m 0770
}

parameter_init()
{
    if [ "$UAC" == "uac2" ]; then
        CONFIG_STRING=uac2
        echo "parameter_init ${CONFIG_STRING}"
    elif [ "$UAC" == "uac1" ];then
        CONFIG_STRING=uac1
        echo "parameter_init ${CONFIG_STRING}"
    else
        echo "parameter_init ${UAC} is invalid"
    fi
}

config_init()
{
    UAC_GS0=${USB_FUNCTIONS_DIR}/$1.gs0
    echo 3 > ${UAC_GS0}/p_chmask
    echo 2 > ${UAC_GS0}/p_ssize
    echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate
    echo ${FU} > ${UAC_GS0}/p_feature_unit
    echo 3 > ${UAC_GS0}/c_chmask
    echo 2 > ${UAC_GS0}/c_ssize
    echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate
    echo ${FU} > ${UAC_GS0}/c_feature_unit
}

syslink_function()
{
    ln -s ${USB_FUNCTIONS_DIR}/$1 ${USB_CONFIGS_DIR}/f${USB_FUNCTIONS_CNT}
    let USB_FUNCTIONS_CNT=USB_FUNCTIONS_CNT+1
}

bind_functions()
{
    USB_FUNCTIONS_CNT=1

    if [ "$UAC" == "uac2" ]; then
        syslink_function uac2.gs0
    elif [ "$UAC" == "uac1" ];then
        syslink_function uac1.gs0
    else
        echo "parameter_init ${UAC} is invalid"
    fi

    echo ${CONFIG_STRING} > ${USB_CONFIGS_DIR}/strings/${USB_ATTRIBUTE}/configuration
}

program_kill()
{
    P_PID=`ps | grep $1 | grep -v grep | awk '{print $1}'`
    test -z ${P_PID} || kill -9 ${P_PID}
}

usb_device_stop()
{
    echo "none" > ${USB_CONFIGFS_DIR}/UDC
    program_kill adbd
    program_kill mtp-server
    ls ${USB_CONFIGS_DIR} | grep f[0-9] | xargs -I {} rm ${USB_CONFIGS_DIR}/{}
}

case "$1" in
start)
    echo "usb_config in $1"
    DIR=$(cd `dirname $0`; pwd)
    parameter_init
    if [ -z $CONFIG_STRING ]; then
        echo "$0: no function be selected"
        exit 0
    fi
    test -d ${USB_CONFIGFS_DIR} || configfs_init
    echo 0x0019 > ${USB_CONFIGFS_DIR}/idProduct
    config_init
    bind_functions
    sleep 1
    UDC=`ls /sys/class/udc/| awk '{print $1}'`
    echo $UDC > ${USB_CONFIGFS_DIR}/UDC
    ;;
stop)
    usb_device_stop
    ;;
restart|reload)
    # Do restart usb by udev
    echo "USB_FORCE_CHANGED" >> /tmp/.usb_config
    usb_device_stop
    sleep 1
    $0 start
    # Don't forget to clear "USB_FORCE_CHANGED"
    sed -i "/USB_FORCE_CHANGED/d" /tmp/.usb_config
    ;;
*)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
esac

exit 0
```

[1] uac.sh restart schaltet auf UAC1/UAC2 um. [2] ${UAC} wählt UAC1 oder UAC2. [3] idProduct produktspezifisch ohne Kollision mit anderen USB-Funktions-IDs wählen. [4] Windows speichert Treiber; nach Änderungen zur Neuerkennung deinstallieren. Kernel-5.10 integriert die Konfiguration in /oem/usr/bin/usb_config.sh:

```text
[...]

uac1_device_config()
{
  UAC=$1
  mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
  UAC_GS0=${USB_FUNCTIONS_DIR}/${UAC}.gs0
  echo 3 > ${UAC_GS0}/p_chmask
  echo 2 > ${UAC_GS0}/p_ssize
  echo 1 > ${UAC_GS0}/p_mute_present
  echo 1 > ${UAC_GS0}/p_volume_present
  echo -5120 > ${UAC_GS0}/p_volume_min #-20db min must > -96db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate

  echo 3 > ${UAC_GS0}/c_chmask
  echo 2 > ${UAC_GS0}/c_ssize
  echo 4 > ${UAC_GS0}/req_number
  echo 1 > ${UAC_GS0}/c_mute_present
  echo 1 > ${UAC_GS0}/c_volume_present
  echo -3200 > ${UAC_GS0}/c_volume_min #-12.5db
  echo 0 > ${UAC_GS0}/c_volume_max   #0db
  echo 32 > ${UAC_GS0}/c_volume_res #0.125db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate

  ln -s ${UAC_GS0} ${USB_CONFIGS_DIR}/f2
}
uac2_device_config()
{
  UAC=$1
  mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
  UAC_GS0=${USB_FUNCTIONS_DIR}/${UAC}.gs0
  echo 3 > ${UAC_GS0}/p_chmask
  echo 2 > ${UAC_GS0}/p_ssize
  echo 1 > ${UAC_GS0}/p_mute_present
  echo 1 > ${UAC_GS0}/p_volume_present
  echo -5120 > ${UAC_GS0}/p_volume_min #-20db min must > -96db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate

  echo 3 > ${UAC_GS0}/c_chmask
  echo 2 > ${UAC_GS0}/c_ssize
  echo 4 > ${UAC_GS0}/req_number
  echo 1 > ${UAC_GS0}/c_mute_present
  echo 1 > ${UAC_GS0}/c_volume_present
  echo -3200 > ${UAC_GS0}/c_volume_min #-12.5db
  echo 0 > ${UAC_GS0}/c_volume_max   #0db
  echo 32 > ${UAC_GS0}/c_volume_res #0.125db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate

  ln -s ${UAC_GS0} ${USB_CONFIGS_DIR}/f2
}

[...]
```

#### 2.3.1 Parameter

Das function-Verzeichnis von UAC1/UAC2 unter Kernel-4.4/4.19 bietet folgende Parameterschnittstellen:

```text
[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip/functions/uac1.gs0]# ls
c_chmask        c_srate  p_chmask        p_srate  req_number
c_feature_unit  c_ssize  p_feature_unit  p_ssize
```

c bedeutet capture der virtuellen USB-Soundkarte und entspricht Host-Wiedergabe; p bezeichnet deren playback und entspricht Host-Aufnahme. Beide Richtungen sind unabhängig. Abtastrate: p_srate/c_srate standardmäßig einmal 48000; mehrere Raten durch Kommas trennen, z. B. `echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate`. Kanäle: c_chmask/p_chmask standardmäßig 3 (Stereo); Mehrkanalbetrieb oder Abschalten einer Richtung sind möglich. Für 5.1-Aufnahme ohne Wiedergabe: `echo 0x3F > p_chmask`, danach `echo 0 > c_chmask`. Bittiefe: p_ssize/c_ssize standardmäßig 2 Byte (16 Bit). Lautstärke: c_feature_unit/p_feature_unit standardmäßig 0 (aus), Schreiben von 1 aktiviert die Regelung.

UAC2-Feature-Unit-Lautstärkeregelung ist mit Windows inkompatibel: für UAC1 aktivieren, für UAC2 deaktivieren. req_number ist die Anzahl der vom UAC-Treiber an den USB-Controller übergebenen Puffer. USB erlaubt NO-DATA-Pakete bei noch nicht vorbereiteten isochronen Daten; macOS ist damit inkompatibel. Bei hoher CPU-Last verbessert ein größeres req_number durch mehr Puffer die OS-Kompatibilität. Das Kernel-5.10-function-Verzeichnis unterscheidet sich von 4.4/4.19 wie folgt:

```text
#ls /sys/kernel/config/usb_gadget/rockchip/functions/uac1.gs0/
c_chmask          p_ssize           p_volume_max      c_volume_max
c_srate           req_number        p_volume_res      c_volume_res
c_ssize           p_mute_present    c_mute_present    function_name
p_chmask          p_volume_present  c_volume_present
p_srate           p_volume_min      c_volume_min
```

Die volume/mute-Aktivierung wechselt von c_feature_unit/p_feature_unit zu p_mute_present/p_volume_present und c_mute_present/c_volume_present. Der Kernel aktiviert volume/mute standardmäßig; die SDK-uac_app muss sie standardmäßig nicht steuern. MIN_DB/MAX_DB/RES_DB werden -100 dB/0 dB/1 dB. p_volume_max/p_volume_min/p_volume_res und c_volume_max/c_volume_min/c_volume_res erlauben codecgerechte Produktwerte. [1] uac_app für eine linearere Codec-Ausgabe entsprechend dem PC-Regler anpassen; siehe Windows Audio-Tapered Volume Controls. [2] Das Gerät meldet MIN_DB/MAX_DB bei der Enumeration; der PC ordnet Reglerposition 0/100 diesen Grenzen zu.

#### 2.3.2 Uevent

Für exaktes Audio-Start/Stopp, mehrere Abtastraten und Lautstärke muss uac_app Kernelereignisse empfangen und verarbeiten. Uevents benachrichtigen den Userspace; den uac-Knoten überwachen und Schlüsselzeichenfolgen extrahieren. Start/Stopp:

```text
g_audio_work: sent uac uevent USB_STATE=SET_INTERFACE STREAM_DIRECTION=IN STREAM_STATE=OFF
g_audio_work: sent uac uevent USB_STATE=SET_INTERFACE STREAM_DIRECTION=OUT STREAM_STATE=ON
```

Mehrere Abtastraten:

```text
g_audio_work: sent uac uevent USB_STATE=SET_SAMPLE_RATE STREAM_DIRECTION=OUT SAMPLE_RATE=44100
```

Lautstärke/Stummschaltung:

```text
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=-1154
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=-350
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=0
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=1739
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=2612
```

[1] IN bedeutet Host-Aufnahme, OUT Host-Wiedergabe. [2] UAC1/UAC2 unter Kernel-4.4/4.19 wandelt den PC-Lautstärkerohwert in Prozent um und meldet ihn per uevent an uac_app. [3] Kernel-5.10 meldet direkt den Rohwert; uvc_app (Quellschreibweise) muss ihn anhand folgender Referenzformel in den Codec-dB-Wert umrechnen:

```text
// volume control 与 db 的转换公式
#define VOLUME_USB_TO_DB(v_usb) (v_usb <= 0x7FFF) ? v_usb : (-(((rt_int16_t)0xFFFF - v_usb) + 1))

// uac_app 将 db 转化为⾳量的⽅法
P：百分⽐；a：当前⾳量分⻉值；m：最⼤⾳量分⻉值
P = 10 ^ [(a - m)/10]
a = 10 * lg(P) + m
```

#### 2.3.3 PPM-Kompensation

USB-Takt stammt vom Host, Codec-Takt vom Gerät. Unabhängige Takte verursachen Audioverluste mit periodischen ALSA-underrun/overrun-Meldungen. PPM-Kompensation vergleicht die alle 128us gesendeten Host-SOF-Pakete (Quellenwert) mit der Systemzeit, berechnet die PPM-Differenz über ein Intervall und meldet sie per uevent:

```text
g_audio_work: sent uac uevent USB_STATE=SET_AUDIO_CLK PPM=12
g_audio_work: sent uac uevent USB_STATE=SET_AUDIO_CLK PPM=-1
```

PPM wird bei bestehender USB-Verbindung fortlaufend berechnet. Die Anwendung empfängt uevents und passt den Codec-Takt über dessen Schnittstelle an. Die Schätzung stabilisiert sich; normalerweise werden nach zehn Minuten keine neuen Werte gemeldet. Nach USB-Trennung beginnt die SOF-Zählung neu: PPM fällt auf 0 und stabilisiert sich erneut. Anwendungen ohne strenge Echtzeitanforderungen dürfen die Kompensationsmeldungen ignorieren.

#### 2.3.4 Kompatibilität

Für UAC2 unter Windows Lautstärkeregelung durch c_feature_unit=0 und p_feature_unit=0 deaktivieren; sonst lädt Windows den Treiber nicht korrekt. Tabelle 2-1: UAC-Lautstärkeregelung je Hostsystem.

|  | Windows10 | Linux(ubuntu) | MacOS |
| --- | --- | --- | --- |
| UAC1 | Unterstützt | Nicht unterstützt | Unterstützt |
| UAC2 | Treiberfehler | Nicht unterstützt | Unterstützt |

### 2.4 UAC-Tests

UAC1 und UAC2 werden identisch getestet; das Beispiel verwendet UAC1. Nach erfolgreicher Konfiguration USB mit dem PC verbinden. Er erkennt USB Audio wie in Abbildung 2-1 (Windows), 2-2 (Ubuntu-Ausgang) und 2-3 (Ubuntu-Eingang).

![Quellenabbildung — PDF p16](/docs/rockchip-usb-gadget-uac/assets/cn-p016-figure-01.png)

Abbildung 2-1. Windows USB Audio Class 1.

![Quellenabbildung — PDF p17](/docs/rockchip-usb-gadget-uac/assets/cn-p017-figure-01.png)

Abbildung 2-2. Ubuntu USB Audio Class 1, Ausgang.

![Quellenabbildung — PDF p17](/docs/rockchip-usb-gadget-uac/assets/cn-p017-figure-02.png)

Abbildung 2-3. Ubuntu USB Audio Class 1, Eingang. RK3308 meldet über UART folgende erfolgreiche UAC1-Enumeration:

```text
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 19
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

UAC1-Soundkarteninformationen prüfen. Im Beispiel ist es card2 (UAC1Gadget) mit Wiedergabeknoten pcmC2D0p und Aufnahmeknoten pcmC2D0c.

```text
# cat /proc/asound/cards
 0 [rockchiprk3308v]: rockchip_rk3308 - rockchip,rk3308-vad
                      rockchip,rk3308-vad
 1 [rockchiprk3308p]: rockchip_rk3308 - rockchip,rk3308-pcm
                      rockchip,rk3308-pcm
 2 [UAC1Gadget     ]: UAC1_Gadget - UAC1_Gadget
                      UAC1_Gadget 0
 7 [Loopback       ]: Loopback - Loopback
                      Loopback 1

# ls -lh /proc/asound/card2
-r--r--r--    1 root     root           0 Dec 31 19:14 id
dr-xr-xr-x    3 root     root           0 Dec 31 19:14 pcm0c
dr-xr-xr-x    3 root     root           0 Dec 31 19:14 pcm0p

# ls /dev/snd/
controlC0  controlC7  pcmC1D0c   pcmC2D0p   pcmC7D1c
controlC1  pcmC0D0c   pcmC1D0p   pcmC7D0c   pcmC7D1p
controlC2  pcmC0D0p   pcmC2D0c   pcmC7D0p   timer
```

#### 2.4.1 Windows-UAC-Tests

Windows-Soundeinstellungen öffnen und USB Audio als Ausgabe sowie Eingang/Mikrofon auswählen, siehe Abbildung 2-4.

![Quellenabbildung — PDF p19](/docs/rockchip-usb-gadget-uac/assets/cn-p019-figure-01.png)

Abbildung 2-4. Windows-Audioeinstellungen. Für UAC1-Wiedergabe folgenden Befehl über RK3308-UART ausführen:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 | aplay -f dat -r 48000 -c 2 -D hw:0,0
```

Der Befehl nimmt von Card2 (USB Audio) auf und gibt über die lokale Card0 wieder. Musik unter Windows abspielen; RK3308 gibt sie in Echtzeit aus. Für die UAC1-Aufnahmeprüfung eine abspielbare Datei mit ADB push oder arecord vorbereiten: 48 KHz, zwei Kanäle, 16 Bit.

Beispielsweise arecord über RK3308-UART zum Speichern von test.wav ausführen:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 /tmp/test.wav
```

Nach dem Speichern von test.wav den UAC1-Aufnahmebefehl ausführen:

```text
aplay /tmp/test.wav -c 2 -r 48000 -D hw:2,0
```

Danach die Aufnahme mit dem integrierten Windows Voice Recorder speichern, siehe Abbildung 2-5.

![Quellenabbildung — PDF p20](/docs/rockchip-usb-gadget-uac/assets/cn-p020-figure-01.png)

Abbildung 2-5. Windows Voice Recorder. Alternativ die Aufnahme live abhören: Soundeinstellungen → Sound-Systemsteuerung → Aufnahme → Eigenschaften → Abhören; Dieses Gerät als Wiedergabequelle verwenden aktivieren und Lautsprecher auswählen. Siehe Abbildungen 2-6 und 2-7.

![Quellenabbildung — PDF p21](/docs/rockchip-usb-gadget-uac/assets/cn-p021-figure-01.png)

Abbildung 2-6. Windows-Aufnahmeabhören, Schritt 1.

![Quellenabbildung — PDF p22](/docs/rockchip-usb-gadget-uac/assets/cn-p022-figure-01.png)

Abbildung 2-7. Windows-Aufnahmeabhören, Schritt 2.

#### 2.4.2 Ubuntu-UAC-Tests

Ubuntu-Soundeinstellungen öffnen und USB Audio als Ausgang sowie Eingang/Mikrofon auswählen; siehe Abbildungen 2-8 und 2-9.

![Quellenabbildung — PDF p23](/docs/rockchip-usb-gadget-uac/assets/cn-p023-figure-01.png)

Abbildung 2-8. Ubuntu-Audioausgabe.

![Quellenabbildung — PDF p23](/docs/rockchip-usb-gadget-uac/assets/cn-p023-figure-02.png)

Abbildung 2-9. Ubuntu-Audioeingang. Für UAC1-Wiedergabe folgenden Befehl über RK3308-UART ausführen:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 | aplay -f dat -r 48000 -c 2 -D hw:0,0
```

Der Befehl nimmt Card2 (USB Audio) auf und gibt über die lokale Card0 wieder. Ubuntu-Musik wird in Echtzeit auf RK3308 ausgegeben. Für Aufnahme eine abspielbare Datei mit 48 KHz, zwei Kanälen und 16 Bit über ADB push oder arecord vorbereiten. Beispiel: test.wav mit arecord über RK3308-UART speichern.

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 /tmp/test.wav
```

Nach dem Speichern von test.wav den UAC1-Aufnahmebefehl ausführen:

```text
aplay /tmp/test.wav -c 2 -r 48000 -D hw:2,0
```

Nach dem Befehl unter Ubuntu ein Aufnahmeprogramm wie audacity zum Test öffnen. Installation:

```text
sudo apt install audacity
```

Abbildung 2-10 zeigt die audacity-Aufnahmeoberfläche.

![Quellenabbildung — PDF p24](/docs/rockchip-usb-gadget-uac/assets/cn-p024-figure-01.png)

Abbildung 2-10. Ubuntu audacity.

## 3. UAC1-Legacy-Nutzung und Tests

### 3.1 UAC1-Legacy-Nutzung

Parameterstandards: audio_buf_size ist Audiopuffergröße 48000; fn_cap Aufnahme-PCM `/dev/snd/pcmC0D0c`; fn_cntl Steuergerät `/dev/snd/controlC0`; fn_play Wiedergabe-PCM `/dev/snd/pcmC0D0p`; req_buf_size ISO-OUT-Anforderungspuffergröße 200; req_count ISO-OUT-Anforderungszahl 256.

Rockchip UAC1 Legacy implementiert Audio Class 1.0 nur zur Wiedergabe und benötigt eine physische Soundkarte, standardmäßig /dev/snd/pcmC0D0p. Standard: High Speed, 48 KHz und zwei Kanäle (beides nicht konfigurierbar), 16 Bit. CONFIG_USB_CONFIGFS_F_UAC1_LEGACY=y zum Kernel-defconfig hinzufügen. RK3308-EVB-Beispiel:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/uac1_legacy.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Läuft beim RK3308-Start ein ADB-Konfigurationsskript, schlägt die obige Konfiguration fehl. Beim Debuggen UAC1 Legacy mit folgenden Befehlen manuell konfigurieren. Im Endprodukt ADB und UAC1 Legacy bedarfsgerecht zusammenführen.

```text
rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/ffs.adb

mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
echo "USB Audio Device" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1
ln -s ../../functions/uac1_legacy.gs0

echo ff400000.usb > ../../UDC
```

idProduct darf produktspezifisch sein, aber nicht mit anderen USB-Funktionen kollidieren. UDC ist der Controllername unter /sys/class/udc/. Windows speichert Treiber; nach Änderungen zur Neuerkennung deinstallieren. Nach erfolgreicher Konfiguration USB anschließen; der PC erkennt USB Audio wie in Abbildung 3-1.

![Quellenabbildung — PDF p26](/docs/rockchip-usb-gadget-uac/assets/cn-p026-figure-01.png)

Abbildung 3-1. Windows USB Audio Class 1 Legacy. Erfolgreiche Enumeration im RK3308-UART-Log:

```text
configfs-gadget gadget: Hardware params: access 3, format 2, channels 2, rate 48000
dwc2 ff400000.usb: bound driver configfs-gadget
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 25
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

UAC1 Legacy bietet folgende Konfigurationsschnittstellen. Änderungen wirken nicht dynamisch und müssen im UAC-Konfigurationsskript ausgeführt werden.

```text
# ls -lh /sys/kernel/config/usb_gadget/g1/functions/uac1_legacy.gs0/
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 audio_buf_size
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_cap
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_cntl
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_play
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 req_buf_size
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 req_count

audio_buf_size - audio buffer size 默认设置为 48000
fn_cap - capture pcm device file name 默认设置为 /dev/snd/pcmC0D0c
fn_cntl - control device file name 默认设置为 /dev/snd/controlC0
fn_play - playback pcm device file name 默认设置为 /dev/snd/pcmC0D0p
req_buf_size - ISO OUT endpoint request buffer size 默认设置为 200
req_count - ISO OUT endpoint request count 默认设置为 256
```

UAC1 Legacy erzeugt auf RK3308 keinen zugehörigen Soundkarten-Geräteknoten.

### 3.2 UAC1-Legacy-Tests

PC-Wiedergabeeinstellungen siehe Windows-/Ubuntu-UAC-Test. Auf RK3308 ist kein Befehl nötig: Nach USB-Verbindung öffnet UAC1 Legacy automatisch die lokale Card0 zur Wiedergabe.

## 4. Audio-Source-Nutzung und Tests

### 4.1 Audio-Source-Nutzung

Rockchip Audio Source implementiert Audio Class 1.0 nur für Aufnahme. Standard: High Speed; playback-Abtastrate 44.1 KHz, mit folgenden 15 durch den PC dynamisch einstellbaren Raten.

```text
8000, 11025, 16000, 22050, 24000,
32000, 40000, 44100, 48000, 56000,
64000, 72000, 80000, 88200, 96000,
```

Playback verwendet zwei nicht konfigurierbare Kanäle und 16 Bit. CONFIG_USB_CONFIGFS_F_ACC=y als Audio-Source-Abhängigkeit und CONFIG_USB_CONFIGFS_F_AUDIO_SRC=y zum Kernel-defconfig hinzufügen.

Audio-Source-Konfigurationsbeispiel für RK3308 EVB:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "audio" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/audio_source.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Startet RK3308 automatisch ein ADB-Skript, schlägt die obige Konfiguration fehl. Zum Debuggen Audio Source mit folgenden Befehlen manuell konfigurieren. ADB und Audio Source für das Endprodukt passend integrieren.

```text
rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/ffs.adb

mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
echo "USB Audio Device" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
echo "audio" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1
ln -s ../../functions/audio_source.gs0

echo ff400000.usb > ../../UDC
```

idProduct produktspezifisch ohne Konflikte mit anderen USB-Funktionen wählen. UDC ist der Controllername unter /sys/class/udc/. Nach Änderungen zwischengespeicherte Windows-Treiber zur Neuerkennung deinstallieren. Nach Konfiguration USB anschließen: Erkennung wie in Abbildungen 4-1 und 4-2.

![Quellenabbildung — PDF p29](/docs/rockchip-usb-gadget-uac/assets/cn-p029-figure-01.png)

Abbildung 4-1. Windows USB Audio Source.

![Quellenabbildung — PDF p29](/docs/rockchip-usb-gadget-uac/assets/cn-p029-figure-02.png)

Abbildung 4-2. Ubuntu USB Audio Source. Reguläre Audio-Source-Enumeration im RK3308-UART-Log:

```text
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 23
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

Audio Source bietet keine konfigurierbaren Kernel-Schnittstellen. Informationen wie folgt prüfen: Im Beispiel card2 (audiosource) mit ausschließlich playback-Knoten pcmC2D0p.

```text
# cat /proc/asound/cards
 0 [rockchiprk3308v]: rockchip_rk3308 - rockchip,rk3308-vad
                      rockchip,rk3308-vad
 1 [rockchiprk3308p]: rockchip_rk3308 - rockchip,rk3308-pcm
                      rockchip,rk3308-pcm
 2 [audiosource    ]: audio_source - audio_source
                      USB accessory audio source
 7 [Loopback       ]: Loopback - Loopback
                      Loopback 1

# ls -lh /proc/asound/card2
-r--r--r--    1 root     root           0 Dec 31 19:06 id
dr-xr-xr-x    3 root     root           0 Dec 31 19:06 pcm0p

# ls /dev/snd/
controlC0  controlC2  pcmC0D0c   pcmC1D0c   pcmC2D0p   pcmC7D0p   pcmC7D1p
controlC1  controlC7  pcmC0D0p   pcmC1D0p   pcmC7D0c   pcmC7D1c   timer
```

### 4.2 Audio-Source-Tests

Für Audio-Source-Aufnahme die zuvor beschriebenen Windows-/Ubuntu-Einstellungen verwenden. RK3308-Testbefehl bei standardmäßigen 44.1 KHz:

```text
aplay /tmp/test.wav -r 44100 -c 2 -D hw:2,0
```

test.wav muss dieselbe Abtastrate wie die Aufnahme haben, sonst drohen Rauschen oder Stille. Der PC kann dynamisch zwischen 15 Raten wählen: Soundeinstellungen → Sound-Systemsteuerung → Aufnahme → Eigenschaften → Erweitert; Rate auswählen (Abbildung 4-3).

![Quellenabbildung — PDF p31](/docs/rockchip-usb-gadget-uac/assets/cn-p031-figure-01.png)

Abbildung 4-3. Windows-USB-Audio-Source-Einstellungen.

## 5. Kombinierte Nutzung und Tests von UAC1 Legacy und Audio Source

### 5.1 Nutzung des zusammengesetzten Geräts

UAC1 Legacy und Audio Source können ein zusammengesetztes USB-Gerät mit Aufnahme/Wiedergabe bilden. CONFIG_USB_CONFIGFS_F_UAC1_LEGACY=y, CONFIG_USB_CONFIGFS_F_ACC=y (Audio-Source-Abhängigkeit) und CONFIG_USB_CONFIGFS_F_AUDIO_SRC=y zum Kernel-defconfig hinzufügen. Zusätzlich support_uac1_legacy_and_audio_source.patch anwenden. RK3308-EVB-Beispiel:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/uac1_legacy.gs0
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/audio_source.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Weitere Konfiguration und Fehlersuche siehe UAC1-Legacy- und Audio-Source-Nutzung.

### 5.2 Tests des zusammengesetzten Geräts

Siehe UAC1-Legacy-Test und Audio-Source-Test.

## 6. Quellen

USB-Protokolle von USB-IF:

- Universal Serial Bus Specification, Revision 2.0
- Universal Serial Bus Audio Device Class Specification for Basic Audio Devices
- Universal Serial Bus Device Class Definition for Audio Devices, Release 1.0
- Universal Serial Bus Device Class Definition for Audio Devices, Release 2.0
- Universal Serial Bus Device Class Definition for Audio Data Formats (USB Audio Data Formats)
- Universal Serial Bus Device Class Definition for Terminal Types (USB Audio Terminal Types)

Weitere Quellen:

- The Well-Tempered Computer (An introduction to computer audio) — USB
- Windows USB Audio 2.0 Drivers
- Windows Audio-Tapered Volume Controls

## 7. Anhang A: UAC1-Gerätedeskriptor

```text
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  idVendor           0x2207
  idProduct          0x0019
  bcdDevice            1.00
  iManufacturer           1 rockchip
  iProduct                2 USB Audio Device
  iSerial                 3 0123456789ABCDEF
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength          174
    bNumInterfaces          3
    bConfigurationValue     1
    iConfiguration          4 audio
    bmAttributes         0x80
      (Bus Powered)
    MaxPower              500mA
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      1 Control Device
      bInterfaceProtocol      0
      iInterface              5 AC Interface
      AudioControl Interface Descriptor:
        bLength                10
        bDescriptorType        36
        bDescriptorSubtype      1 (HEADER)
        bcdADC               1.00
        wTotalLength           52
        bInCollection           2
        baInterfaceNr( 0)       1
        baInterfaceNr( 1)       2
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             1
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bNrChannels             2
        wChannelConfig     0x0003
          Left Front (L)
          Right Front (R)
        iChannelNames           7 Playback Channels
        iTerminal               6 Playback Input terminal
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             2
        wTerminalType      0x0301 Speaker
        bAssocTerminal          0
        bSourceID               1
        iTerminal               8 Playback Output terminal
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             3
        wTerminalType      0x0201 Microphone
        bAssocTerminal          0
        bNrChannels             2
        wChannelConfig     0x0003
          Left Front (L)
          Right Front (R)
        iChannelNames          10 Capture Channels
        iTerminal               9 Capture Input terminal
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             4
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bSourceID               3
        iTerminal              11 Capture Output terminal
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             12 Playback Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             13 Playback Active
      AudioStreaming Interface Descriptor:
        bLength                 7
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           1
        bDelay                  1 frames
        wFormatTag              1 PCM
      AudioStreaming Interface Descriptor:
        bLength                11
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bNrChannels             2
        bSubframeSize           2
        bBitResolution         16
        bSamFreqType            1 Discrete
        tSamFreq[ 0]        48000
      Endpoint Descriptor:
        bLength                 9
        bDescriptorType         5
        bEndpointAddress     0x02  EP 2 OUT
        bmAttributes            9
          Transfer Type            Isochronous
          Synch Type               Adaptive
          Usage Type               Data
        wMaxPacketSize     0x00c8  1x 200 bytes
        bInterval               4
        bRefresh                0
        bSynchAddress           0
        AudioControl Endpoint Descriptor:
          bLength                 7
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x01
            Sampling Frequency
          bLockDelayUnits         1 Milliseconds
          wLockDelay              1 Milliseconds
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             14 Capture Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             15 Capture Active
      AudioStreaming Interface Descriptor:
        bLength                 7
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           4
        bDelay                  1 frames
        wFormatTag              1 PCM
      AudioStreaming Interface Descriptor:
        bLength                11
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bNrChannels             2
        bSubframeSize           2
        bBitResolution         16
        bSamFreqType            1 Discrete
        tSamFreq[ 0]        48000
      Endpoint Descriptor:
        bLength                 9
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes            5
          Transfer Type            Isochronous
          Synch Type               Asynchronous
          Usage Type               Data
        wMaxPacketSize     0x00c8  1x 200 bytes
        bInterval               4
        bRefresh                0
        bSynchAddress           0
        AudioControl Endpoint Descriptor:
          bLength                 7
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x01
            Sampling Frequency
          bLockDelayUnits         0 Undefined
          wLockDelay              0 Undefined
Device Qualifier (for other device speed):
  bLength                10
  bDescriptorType         6
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  bNumConfigurations      1
Device Status:     0x0000
  (Bus Powered)
```

## 8. Anhang B: UAC2-Gerätedeskriptor

```text
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  idVendor           0x2207
  idProduct          0x0019
  bcdDevice            2.00
  iManufacturer           1 rockchip
  iProduct                2 USB Audio Device
  iSerial                 3 0123456789ABCDEF
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength          219
    bNumInterfaces          3
    bConfigurationValue     1
    iConfiguration          4 audio
    bmAttributes         0x80
      (Bus Powered)
    MaxPower              500mA
    Interface Association:
      bLength                 8
      bDescriptorType        11
      bFirstInterface         0
      bInterfaceCount         3
      bFunctionClass          1 Audio
      bFunctionSubClass       0
      bFunctionProtocol      32
      iFunction               5 Source/Sink
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      1 Control Device
      bInterfaceProtocol     32
      iInterface              6 Topology Control
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      1 (HEADER)
        bcdADC               2.00
        bCategory               8
        wTotalLength           83
        bmControl            0x00
      AudioControl Interface Descriptor:
        bLength                 8
        bDescriptorType        36
        bDescriptorSubtype     10 (CLOCK_SOURCE)
        bClockID                6
        bmAttributes         0x01 Internal fixed Clock
        bmControls           0x01
          Clock Frequency Control (read-only)
        bAssocTerminal          0
        iClockSource            7 48000Hz
      AudioControl Interface Descriptor:
        bLength                 8
        bDescriptorType        36
        bDescriptorSubtype     10 (CLOCK_SOURCE)
        bClockID                5
        bmAttributes         0x01 Internal fixed Clock
        bmControls           0x01
          Clock Frequency Control (read-only)
        bAssocTerminal          0
        iClockSource            8 64000Hz
      AudioControl Interface Descriptor:
        bLength                17
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             1
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bCSourceID              5
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        bmControls    0x0003
          Copy Protect Control (read/write)
        iChannelNames           0
        iTerminal               9 USBH Out
      AudioControl Interface Descriptor:
        bLength                17
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             2
        wTerminalType      0x0201 Microphone
        bAssocTerminal          0
        bCSourceID              6
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        bmControls    0x0003
          Copy Protect Control (read/write)
        iChannelNames           0
        iTerminal              10 USBD Out
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             4
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bSourceID               2
        bCSourceID              6
        bmControls         0x0003
          Copy Protect Control (read/write)
        iTerminal              11 USBH In
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             3
        wTerminalType      0x0301 Speaker
        bAssocTerminal          0
        bSourceID               1
        bCSourceID              5
        bmControls         0x0003
          Copy Protect Control (read/write)
        iTerminal              12 USBD In
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             13 Playback Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             14 Playback Active
      AudioStreaming Interface Descriptor:
        bLength                16
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           1
        bmControls           0x00
        bFormatType             1
        bmFormats         0x00000001
          PCM
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        iChannelNames           0
      AudioStreaming Interface Descriptor:
        bLength                 6
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bSubslotSize            2
        bBitResolution         16
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x02  EP 2 OUT
        bmAttributes            9
          Transfer Type            Isochronous
          Synch Type               Adaptive
          Usage Type               Data
        wMaxPacketSize     0x0100  1x 256 bytes
        bInterval               4
        AudioControl Endpoint Descriptor:
          bLength                 8
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x00
          bmControls           0x00
          bLockDelayUnits         0 Undefined
          wLockDelay              0
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             15 Capture Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             16 Capture Active
      AudioStreaming Interface Descriptor:
        bLength                16
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           4
        bmControls           0x00
        bFormatType             1
        bmFormats         0x00000001
          PCM
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        iChannelNames           0
      AudioStreaming Interface Descriptor:
        bLength                 6
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bSubslotSize            2
        bBitResolution         16
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes           13
          Transfer Type            Isochronous
          Synch Type               Synchronous
          Usage Type               Data
        wMaxPacketSize     0x00c0  1x 192 bytes
        bInterval               4
        AudioControl Endpoint Descriptor:
          bLength                 8
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x00
          bmControls           0x00
          bLockDelayUnits         0 Undefined
          wLockDelay              0
Device Qualifier (for other device speed):
  bLength                10
  bDescriptorType         6
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  bNumConfigurations      1
Device Status:     0x0000
  (Bus Powered)
```

{% endraw %}
