---
title: "Rockchip Linux USB Gadget: Konfiguration, Audio, Netzwerk, Speicher und Verbundgeräte"
description: "Rockchip Linux USB Gadget: Konfiguration, Audio, Netzwerk, Speicher und Verbundgeräte — V1.0.0"
excerpt: "Rockchip Linux USB Gadget: Konfiguration, Audio, Netzwerk, Speicher und Verbundgeräte"
translation_key: "176-rockchip-linux-usb-gadget"
slug: "176-rockchip-linux-usb-gadget"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, Gadget, Linux]
---

{% raw %}

# Rockchip Linux USB Gadget: Konfiguration, Audio, Netzwerk, Speicher und Verbundgeräte

ArmSoM-Referenz nach CN/EN V1.0.0, RK-JC-YF-316, zur USB-Gadget-Grundnutzung. Quellenplattform Linux, Kernel v4.4. SoC, BSP, Kernel, OTG-Port und rkscript der konkreten Platine prüfen; keine universelle Unterstützung annehmen. ZH verwendet chinesische, EN/RU/DE englische Bilder, je acht. Quellenbeispiele, keine Hardwaremessungen.

Risiken/Quellenzweifel: USB-Neustart kann ADB/Netzwerk trennen; UMS benötigt exklusiven Blockzugriff. Keine Umschalt-/Mountbefehle ausgeführt. Der Text nennt teilweise S50usbdevce statt S50usbdevice in Befehlen. Letzter Abschnitt nennt ADB+RNDIS, Befehle aktivieren jedoch MTP+ADB; unverändert und kein direkt ausführbares RNDIS-Beispiel. Windows-/UAC-Aussagen gelten für die Quellenzeit, nicht als aktuelle Kompatibilitätsgarantie.

Kommentarerläuterung: S50usbdevice in /etc/init.d/ verwendet dortige .usb_config; usbdevice in /usr/bin/, Regeln in /lib/udev/rules.d/, /tmp/.usb_config automatisch erzeugt. ALSA-Gerät: -D "hw:${card},${device}", z.B. hw:2,0; plughw resampelt auf konfigurierte Rate. RNDIS-Beispiel setzt 169.254.216.1. UMS kann /userdata/ums_shared.img statt Partition nutzen, Beispiel erzeugt FAT/8M mit Automount. ACM sendet echo test vom PC, Device empfängt per cat; UVC standardmäßig 640x480.

[ArmSoM Docs](https://docs.armsom.org/) · [Linux Gadget](https://www.kernel.org/doc/htmldocs/gadget/intro.html)

## 1. Linux-USB Gadget API Framework

USB Gadget läuft auf einem USB-Peripheral und konfiguriert USB-Funktionen. Ein enumerierbares Gerät hat normalerweise mindestens drei Kernel-Logikebenen, gegebenenfalls zusätzlichen Userspace-Code. Gadget API vermittelt zwischen Funktion und Hardware. Von unten nach oben:

- USB Controller spricht direkt mit Hardware, stellt Endpoints für IN-/OUT-Datenströme bereit und bietet sie Gadget an.
- USB Gadget kapselt den Controller für hardwareunabhängige Funktionen, etwa class-specific Protokolle über ep0, Funktionsstart und IN-/OUT-Endpointverwaltung.
- Upper Level verbindet die meisten Gadget-Treiber mit konkreten Linux-Treibern oder Frameworks.
- Additional Layers können Kernel-Netzwerkstacks oder Userspace-Anwendungen mit POSIX-APIs `open()`, `close()`, `read()` und `write()` sein.

![Quellenabbildung — PDF p5](/docs/rockchip-linux-usb-gadget/assets/en-p005-figure-01.png)

Referenz: https://www.kernel.org/doc/htmldocs/gadget/intro.html

### 1.1 Kernelkonfiguration

USB-Gadget-Konfigurationspfad in menuconfig:

```text
Location:
  -> Device Drivers
    -> USB support
      -> USB Gadget Support
        -> USB Gadget Drivers
```

RK Linux stellt Skripte zur automatischen Konfiguration folgender Funktionen bereit:

```text
CONFIG_USB_CONFIGFS_ACM
CONFIG_USB_CONFIGFS_RNDIS
CONFIG_USB_CONFIGFS_MASS_STORAGE
CONFIG_USB_CONFIGFS_F_FS
CONFIG_USB_CONFIGFS_F_MTP
CONFIG_USB_CONFIGFS_F_UAC1
CONFIG_USB_CONFIGFS_F_UAC2
CONFIG_USB_CONFIGFS_F_UVC
```

### 1.2 USB configfs

configfs ist ein speicherbasiertes Dateisystem, ähnlich sysfs, jedoch mit anderer Lebenszyklusverwaltung. sysfs-Knoten erstellt und registriert der Kernel; Nutzer lesen Attribute per readdir/read und ändern sie per write. Erstellung, Löschung und Lebensdauer steuert allein der Kernel; sysfs ist das Zugriffsfenster. Bei configfs erstellt der Nutzer Knoten per mkdir und löscht sie per rmdir. Nach mkdir entstehen per read/write änderbare Attribute. Wie bei sysfs zeigt readdir Inhalte, symlink verwaltet Verknüpfungen. Die Lebensdauer bestimmt aber der Nutzer; das zuständige Kernelmodul muss auf seine Operationen reagieren.

## 2. USB Gadget verwenden

### 2.1 USB-Verwaltungsablauf

RKScript enthält drei USB-bezogene Dateien:

```text
S50usbdevice # /etc/init.d/ 使⽤时，配合同级⽬录的.usb_config使⽤
usbdevice # /usr/bin/
61-usbdevice.rules # /lib/udev/rules.d/
#还有两个相关⽂件需要⽤⼾⾃建或修改
.usb_config # /etc/init.d/
/tmp/.usb_config # S50usbdevice ⾃动⽣成
```

![Quellenabbildung — PDF p7](/docs/rockchip-linux-usb-gadget/assets/en-p007-figure-01.png)

Durch Ändern von .usb_config und Ausführen von S50usbdevce lassen sich USB-Funktionen wählen. Folgendes Protokoll zeigt bei erfolgreicher Einrichtung USB Ready:

```text
[   66.178517] android_work: sent uevent USB_STATE=CONNECTED
[   66.179977] configfs-gadget gadget: high-speed config #1: b
[   66.180663] android_work: sent uevent USB_STATE=CONFIGURED
```

### 2.2 Funktionskonfiguration

Konfiguration liegt in `/etc/init.d/.usb_config`. Zur Laufzeit `/tmp/.usb_config` ändern und `/etc/init.d/S50usbdevice restart` ausführen. Die Gadget-Automatik unterstützt folgende .usb_config-Optionen:

```text
usb_adb_en
usb_uac1_en
usb_uac2_en
usb_rndis_en
usb_mtp_en
usb_ums_en
usb_acm_en
usb_uvc_en
```

Dateiunterschied: `/etc/init.d/.usb_config` ist die Startkonfiguration. Bei schreibgeschütztem System ist sie eventuell nicht änderbar; zur Laufzeit ohne besonderen Grund nicht bearbeiten.

`/tmp/.usb_config` ist die beim Start von S50usbdevice angelegte Kopie von `/etc/init.d/.usb_config`. /tmp liegt im RAM und ist änderbar. Für vorübergehende Umschaltung diese Datei ändern und USB mit `/etc/init.d/S50usbdevice restart` neu konfigurieren.

#### 2.2.1 ADB (Android Debug Bridge)

ADB ist ein vielseitiges Kommandozeilen-Debugwerkzeug für Dateiübertragung, Unix-Shell-Anmeldung usw. Benötigt wird adbd; dessen Buildroot-Bauoption aktivieren.

```text
BR2_PACKAGE_ANDROID_TOOLS_ADBD
```

Wenn adbd vorhanden ist, folgende Befehle ausführen und USB mit dem PC verbinden:

```text
echo usb_adb_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

Das Gerät erscheint auf dem PC in `adb devices`. Falls unter Linux nicht sichtbar, ausführen:

```text
adb kill-server
sudo adb devices
```

Unter Windows ADB-Treiber installieren und ADB nötigenfalls mit Administratorrechten ausführen.

#### 2.2.2 UAC (USB Audio Class)

UAC stellt dem Host eine virtuelle Standard-PCM-Schnittstelle über USB für Audio zwischen Host und Device bereit. Varianten: UAC1/UAC2. UAC2 bietet höhere Bandbreite, abhängig von Plattformimplementierung und Messung. Windows7 und manche Windows10 benötigen laut Quelle einen separaten UAC2-Treiber, unterstützen aber UAC1. Aktivierungsbefehle:

```text
echo usb_uac1_en > /tmp/.usb_config # or usb_uac2_en
/etc/init.d/S50usbdevice restart
```

Für Tests ALSA verwenden. `aplay -l` bzw. `arecord -l` zeigt Wiedergabe-/Aufnahmekarten:

```text
# aplay -l
card 2: rk3xxx [rk3xxx], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0

# 指定设备设⽤ -D "hw:${card},${device}" (上述信息即可写为 -D "hw:2,0")
```

Audiostrom zur Schleife verbinden, um Playback und Capture gleichzeitig zu prüfen:

![Quellenabbildung — PDF p9](/docs/rockchip-linux-usb-gadget/assets/en-p009-figure-01.png)

(1) PC spielt Audiodatei auf Device ab. Linux:

```text
aplay -D "plughw:2,0" -f S16_LE -r 48000 -c 2 /userdata/test.wav
# plughw 如果⾳频采样率和设置的不符，alsa将对⾳频进⾏重采样，保证输出⾳频采样率和设置的⼀致
```

Windows: Rechtsklick auf Lautsprechersymbol unten rechts → Open Sound Settings → Device als Ausgabe wählen (meist Source/Sink, Name versionsabhängig), Player öffnen und Musik abspielen.

![Quellenabbildung — PDF p9](/docs/rockchip-linux-usb-gadget/assets/en-p009-figure-02.png)

(2) Device leitet UAC Playback nach Capture um.

```text
arecord -D "hw:3,0" -f S16_LE -r 48000 -c 2 -t raw -N |  aplay -D "hw:3,0" -f S16_LE -r 48000 -c 2 -t raw -N
```

(3) PC leitet UAC Capture auf normalen Lautsprecher um. Linux:

```text
arecord -D "hw:2,0" -f S16_LE -r 44100 -c 2 -t raw -N | aplay -D "hw:1,0" -f S16_LE -r 44100 -c 2 -t raw -N
```

Windows: Rechtsklick auf Lautsprechersymbol → Open Sound Settings → Device als Eingabe wählen (meist Source/Sink, versionsabhängig).

![Quellenabbildung — PDF p10](/docs/rockchip-linux-usb-gadget/assets/en-p010-figure-01.png)

Device properties → Additional device properties öffnen, Listen to this device aktivieren und unter Playthrough this device das ursprüngliche PC-Wiedergabegerät auswählen.

![Quellenabbildung — PDF p10](/docs/rockchip-linux-usb-gadget/assets/en-p010-figure-02.png)

Nun ist das Testaudio über den PC-Lautsprecher hörbar.

#### 2.2.3 RNDIS (Remote Network Driver Interface Specification)

RNDIS stellt eine USB-Netzwerkschnittstelle bereit; Netzwerkbefehle wie SSH tauschen Host-/Device-Daten aus. Aktivierung:

```text
echo usb_rndis_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

`ifconfig` zeigt auf Host und Device je einen zusätzlichen Netzwerkadapter:

```text
# Host Linux
ifconfig
enp0s20u3u4u4 Link encap:Ethernet  HWaddr d6:11:03:17:c3:97
          inet6 addr: fe80::3fa6:da84:77bd:122a/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:61 errors:0 dropped:0 overruns:0 frame:0
          TX packets:187 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:7198 (7.1 KB)  TX bytes:41844 (41.8 KB)
# Device
ifconfig
usb0      Link encap:Ethernet  HWaddr 46:26:71:47:E3:9F
          inet addr:169.254.216.27  Bcast:169.254.255.255  Mask:255.255.0.0
          inet6 addr: fe80::9e72:7f20:cc68:4a34/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:606 errors:606 dropped:0 overruns:0 frame:606
          TX packets:125 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:100024 (97.6 KiB)  TX bytes:30346 (29.6 KiB)
```

Auf dem Host ist keine IPv4-Adresse zugewiesen; mit ifconfig manuell setzen:

```text
#固定RNDIS地址为169.254.216.1
ifconfig enp0s20u3u4u4 down
ifconfig enp0s20u3u4u4 169.254.216.1
ifconfig enp0s20u3u4u4 up
```

Danach ist ping in beide Richtungen möglich. Unter Windows wird nach Erkennung IPv4 automatisch vergeben; keine manuelle Zuweisung nötig.

#### 2.2.4 MTP (Media Transfer Protocol)

MTP ist Microsofts Protokoll zum Austausch von Mediendateien zwischen Host und Device. mtp-server wird benötigt; dessen Buildroot-Bauoption aktivieren.

```text
BR2_PACKAGE_MTP
```

Bei vorhandenem mtp-server Befehle ausführen und OTG-Kabel mit dem PC verbinden:

```text
echo usb_mtp_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

Linux/Windows zeigt Gerät "---MODEL---". MTP-Name lässt sich anhand des Patches in buildroot/package/rockchip/mtp ändern. Standardfreigabe: /userdata.

#### 2.2.5 UMS (USB Mass Storage)

UMS stellt dem Host externen Massenspeicher bereit. UMS arbeitet blockweise, MTP dateiweise. UMS-Blöcke werden exklusiv verwendet; paralleler Zugriff verursacht Fehler. MTP unterstützt mehrere Nutzer. UMS aktivieren:

```text
echo usb_ums_en > /tmp/.usb_config
echo "ums_block=/dev/block/by-name/userdata" >> /tmp/.usb_config # 可⽤镜像⽂件替换具体分区，例如/userdata/ums_shared.img
/etc/init.d/S50usbdevice restart
```

Auf dem PC erscheint ein neues USB-Laufwerk. Für exklusiven Zugriff bietet S50usbdevice ein Attribut: Bei PC-Anschluss wird der Block auf Device ausgehängt, um Fehlzugriffe zu verhindern; nach Trennung unter /mnt/ums erneut eingebunden. In .usb_config ergänzen:

```text
echo "ums_block_auto_mount=on" >> /tmp/.usb_config
```

Statt einer logischen Partition lässt sich eine Image-Datei verwenden, selbst erstellt oder automatisch durch S50usbdevice erzeugt:

```text
# ⾃动⽣成⼀个 fat 格式， 8M ⼤⼩的image⽂件，并开启UMS⾃动挂载
echo usb_ums_en > /tmp/.usb_config
echo "ums_block=/userdata/ums_shared.img" >> /tmp/.usb_config
echo "ums_block_size=8" >> /tmp/.usb_config #Unit M
echo "ums_block_type=fat" >> /tmp/.usb_config
echo "ums_block_auto_mount=on" >> /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

In Buildroot unter Target packages → Rockchip BSP packages → rockchip usb mass storage konfigurieren. Danach rkscript neu bauen; /etc/init.d/.usb_config wird automatisch erzeugt.

![Quellenabbildung — PDF p12](/docs/rockchip-linux-usb-gadget/assets/en-p012-figure-01.png)

#### 2.2.6 ACM (CDC - ACM: Communication Device Class - Abstract Control Model)

ACM ist ein virtueller serieller USB-Port mit TTY-Geräten auf Device/Host. Aktivierung:

```text
echo usb_acm_en > /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

Nach Aktivierung: Device /dev/ttyGS0, PC /dev/ttyACM0.

```text
#PC上运⾏
echo test > /dev/ttyACM0
#Device上运⾏
cat /dev/ttyGS0 #得到 test 输出
```

#### 2.2.7 UVC (USB Video Class)

UVC benötigt eine Anwendung. Buildroot liefert uvc_app als Testdemo; entsprechende Bauoption aktivieren.

```text
BR2_PACKAGE_UVC_APP
```

S50usbdevice manuell ändern und ergänzen:

```text
-       # Add uvc app here with start-stop-daemon
+       if [ $UVC_EN = on ];then
+               start-stop-daemon --start --quiet --background --exec
/usr/bin/uvc_app -- 640 480
+       fi
```

UVC mit folgenden Befehlen aktivieren:

```text
echo usb_uvc_en > /tmp/.usb_config #默认输出640x480格式图像
/etc/init.d/S50usbdevice restart
```

Host-Anzeige: Unter Linux guvcview, Windows Amcap; Device → UVC Camera / Options → Preview auswählen.

![Quellenabbildung — PDF p13](/docs/rockchip-linux-usb-gadget/assets/en-p014-figure-01.png)

Unten links steht die Bildrate. uvc_app ist nur Testdemo, keine fertige Anwendung; es zeigt vier einfarbige Balken und kann angepasst werden. UVC benötigt zwingend eine Anwendung; Aktivierung ohne sie stört USB. Bei schreibgeschütztem System S50usbdevice vor Image-Erstellung ändern. Hot-Unplug ist problematisch: Nach Gadget-unbind funktioniert UVC wegen des V4L2-Knotenregistrierungsmechanismus nicht mehr.

### 2.3 Zusammengesetzte USB-Geräte

Wenn Port- und Bandbreitenbedingungen erfüllt sind, können mehrere Gadget-Funktionen auf einem USB-Port kombiniert werden. Beispiel ADB + RNDIS:

```text
echo usb_mtp_en > /tmp/.usb_config
echo usb_adb_en >> /tmp/.usb_config
/etc/init.d/S50usbdevice restart
```

{% endraw %}
