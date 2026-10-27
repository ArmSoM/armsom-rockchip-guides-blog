---
title: "Leitfaden für Software- und Systemtests unter Rockchip Linux"
description: "Leitfaden für Software- und Systemtests unter Rockchip Linux — V2.0.2"
excerpt: "Leitfaden für Software- und Systemtests unter Rockchip Linux"
translation_key: "200-rockchip-linux-software-test"
slug: "200-rockchip-linux-software-test"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Test, Buildroot]
---

{% raw %}

# Leitfaden für Software- und Systemtests unter Rockchip Linux

Grundlage sind die chinesische und englische Fassung von RK-SM-YF-352 V2.0.2 vom 2024-05-16; Chinesisch bildet die technische Basis. Alle fünf Kapitel, Befehle, Parameter und Abbildungen bleiben erhalten. Dies ist eine ArmSoM-Plattformreferenz: konkrete Platine, SoC, SDK/BSP und Peripherie prüfen. Es wurden keine Gerätetests durchgeführt. Achtung: dd-Schreibzugriffe überschreiben Partitionen, SD-Erstellung/Aktualisierung umfasst Flash-Löschen und das recovery-Menü enthält wipe all. Daten sichern und Ziele prüfen; Beispiele nicht auf Geräten mit wertvollen Daten ausführen. killall bash beendet auch fremde Bash-Prozesse.

## 1. Funktionstests

### 1.1 Buildroot

#### 1.1.1 Videoaufnahme

Video aufnehmen:

```text
rkisp_demo --device=/dev/video1 --output=/tmp/isp.yuv --iqfile=/etc/iqfiles/OV5695.xml
```

Wiedergabe: /tmp/cif.yuv mit adb pull /tmp/cif.yuv /tmp/cif.yuv auf den PC kopieren und mit einem YUV-Werkzeug wiedergeben.

#### 1.1.2 Tonaufnahme

Syntax: arecord -c Kanäle -r Abtastrate -f Sampleformat -d Dauer /Pfad/Dateiname. Kanäle ch_tbl="2 4 6 8"; Abtastraten fs_tbl="8000 11025 16000 22050 32000 44100 48000 64000 88200 96000 176400 192000"; Formate bits_tbl="S16_LE S24_LE S32_LE". Die Quelle nennt „wmv, wav, mp3 usw.“ als Container; siehe Hinweis zur Formatunterstützung. Beispiel für begrenzte Aufnahme: nach 10 Sekunden automatisch beenden und speichern.

```text
arecord -c 2 -r 44100 -f S16_LE –d 10 /tmp/record.wav
```

Unbegrenzte Aufnahme: mit Strg+C beenden und speichern.

```text
arecord -c 2 -r 44100 -f S16_LE /tmp/record.wav
```

Aufgenommene Datei wiedergeben:

```text
aplay /tmp/record.wav
```

#### 1.1.3 Wi-Fi-Verbindung

Methode 1: Skript wifi_start.sh. Ist es im SDK enthalten, SSID und Passwort direkt als Argumente übergeben.

```text
wifi_start.sh WiFi-AP password
```

Methode 2: Konfigurationsdatei ändern.

```text
$ vi /data/cfg/wpa_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant #It is not recommended to modify by default!
ap_scan=1
update_config=1 #This configuration enables the hotspots configured by the wpa_cli command to be saved in the
conf file (wpa_cli save_config)
#Encrypted wi-fi
network={
    ssid="WiFi-AP"   # Wi-Fi name
    psk="password"   # Wi-Fi password
    key_mgmt=WPA-PSK # Authentication method
}
#Unencrypted Wi-Fi:
network={
    ssid="WiFi-AP"  # Wi-Fi name
    key_mgmt=NONE   # Authentication method
}

#Let the wpa_supplicant process re-read the above configuration:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconfigure
#Initiate connection:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconnect
```

Methode 3: Werkzeug wpa_cli.

```text
#EncryptedWi-Fi:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt WPA-PSK
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 psk '"password"'
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config #Save the above configuration to the conf file
#Unencrypted Wi-Fi:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt NONE
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config
```

Verbindungsstatus prüfen:

```text
wpa_cli -i wlan0 -p /var/run/wpa_supplicant status
```

Einzelheiten: Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf.

#### 1.1.4 Audiowiedergabe

```text
aplay /media/usb0/musicdemo.wmv
```

#### 1.1.5 Systemzeit

```text
date                               #check system time
date --set='2018-12-24 15:17:42'   #Set system time
hwclock --show                     #check hardware time
hwclock --systohc                  #synchronous display of hardware time and system time
```

#### 1.1.6 RTC-Uhr

Zeitänderung im laufenden Zustand sowie nach einem Neustart prüfen.

```text
cat /sys/class/rtc/rtc0/time
```

#### 1.1.7 Videowiedergabe

Wiedergabe in einem Fenster:

```text
gst-play-1.0 /oem/SampleVideo_1280x720_5mb.mp4
```

Wiedergabe in mehreren Fenstern:

```text
sh /rockchip-test/video/test_gst_multivideo.sh
```

#### 1.1.8 Aktualisierung und Start über SD-Karte

SD-Karte in den PC einsetzen, SD_Firmware_Tool.exe starten, Firmware-Aktualisierung/SD-Start und update.img auswählen und die Karte erstellen. Laut Quelle das Gerät in maskrom versetzen, Flash löschen und ausschalten. Vorbereitete Karte einsetzen und einschalten: Die Firmware wird automatisch geschrieben. Löschen vernichtet Daten; zuvor Platine und Sicherungen prüfen.

![Leitfaden für Software- und Systemtests unter Rockchip Linux — en 6](/docs/rockchip-linux-software-test/assets/en-p006-figure-01.png)

#### 1.1.9 Datei suchen

```text
find ./ -name ***
```

#### 1.1.10 Arbeitsspeicher anzeigen

```text
cat /proc/meminfo or free –h
```

#### 1.1.11 Datenträgerbelegung anzeigen

```text
df -h
```

### 1.2 Debian

#### 1.2.1 Terminal öffnen

Start → System Tools → LXTerminal öffnen.

#### 1.2.2 Wi-Fi-Verbindung

Folgenden Befehl in der seriellen Konsole eingeben:

```text
nmcli r wifi on  #steps 1：turn on Wi-Fi
nmcli dev wifi   #steps 2：scan nearby AP
#steps 3：connect AP
nmcli dev wifi connect "DIR-803" password "839919060" ifname wlan0
nmcli r wifi off #steps 4：turn off Wi-Fi
```

#### 1.2.3 Unterschiedliche Anzeige auf zwei Bildschirmen

Mit xrandr die angeschlossenen Anzeigen ermitteln. Das englische Beispiel erkennt HDMI-1 und DP-1, das chinesische HDMI-1 und DSI-1.

```text
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 1920, maximum 16384 x 16384
HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1920x1080     60.00 +  60.00*   50.00    30.00    24.00
   1920x1080i    60.00    50.00    50.00
   1280x1024     60.02
   1280x720      60.00    50.00    50.00
   720x576       50.00    50.00
   720x576i      50.00
   720x480       59.94    59.94
   720x480i      59.94
HDMI-2 disconnected (normal left inverted right x axis y axis)
```

```text
DSI-1 connected 1080x1920+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1080x1920     59.90*+
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
```

Mit xrandr die Anordnung der beiden Bildschirme festlegen:

```text
su linaro-c "DISPLAY=:0 xrandr--output HDMI-1--above DSI-1"
```

Statt --above nennt die Quelle right-of, left-of, below, same-as, preferred und off. Die jeweilige Optionssyntax beachten. Einzelheiten: Rockchip_Developer_Guide_Linux_Graphics_CN.pdf.

#### 1.2.4 Unterschiedlicher Ton für zwei Bildschirme

Methode 1: links unten Sound&amp;Video → PulseAudio Volume Control öffnen; die chinesische Quelle nennt zusätzlich den Reiter Playback.

![Leitfaden für Software- und Systemtests unter Rockchip Linux — en 7](/docs/rockchip-linux-software-test/assets/en-p007-figure-01.png)

Methode 2: mit aplay die Soundkarte ermitteln und für die Wiedergabe auswählen.

```text
root@linaro-alip:/# aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: rockchipdp0 [rockchip,dp0], device 0: rockchip,dp0 spdif-hifi-0 [rockchip,dp0 spdif-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: rockchipes8388 [rockchip-es8388], device 0: dailink-multicodecs ES8323.7-0011-0 [dailink-multicodecs
ES8323.7-0011-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 2: rockchiphdmi0 [rockchip-hdmi0], device 0: rockchip-hdmi0 i2s-hifi-0 [rockchip-hdmi0 i2s-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0

dp0: aplay-Dplughw:0,0/dev/urandom
es8388: aplay-Dplughw:1,0/dev/urandom
hdmi0: aplay-Dplughw:2,0/dev/urandom
```

Methode 3: ein Lied öffnen und vom Haupt- auf den Nebenbildschirm ziehen; anschließend auf dem Hauptbildschirm auf dieselbe Weise eine Soundkarte auswählen. So wird getrennte Audiowiedergabe erreicht. Einzelheiten: Rockchip_Developer_Guide_Linux_Graphics_CN.pdf.

#### 1.2.5 Bildschirm drehen

Drehung normal/left/right:

```text
vi /etc/X11/xorg.conf.d/20-modesetting.conf
```

normal durch left oder right ersetzen; die Änderung gilt nach dem Neustart.

## 2. Leistungstests

### 2.1 Datenträger lesen und schreiben

Zuerst Gerätenamen mit fdisk -l prüfen. Die Quelle nutzt die letzte Partition mmcblk0p8 (14.6G) als schreibbares userdata für eMMC-Leistungstests. Daraus folgt nicht, dass die letzte Partition jeder Platine beschreibbar ist; der folgende Schreibtest überschreibt ihre Daten.

```text
root@linaro-alip:~# fdisk -l
Disk /dev/mmcblk0: 29.1 GiB, 31268536320 bytes, 61071360 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 1124E418-9008-41F8-9E3D-8D872216C8A1
Device           Start      End  Sectors  Size Type
/dev/mmcblk0p1    16384    24575     8192    4M unknown
/dev/mmcblk0p2    24576    32767     8192    4M unknown
/dev/mmcblk0p3    32768   163839   131072   64M unknown
/dev/mmcblk0p4   163840   425983   262144  128M unknown
/dev/mmcblk0p5   425984   491519    65536   32M unknown
/dev/mmcblk0p6   491520 29851647 29360128   14G unknown
/dev/mmcblk0p7 29851648 30113791   262144  128M unknown
/dev/mmcblk0p8 30507008 61071295 30564288 14.6G unknown
```

#### 2.1.1 eMMC lesen und schreiben

Schreiben:

```text
dd if=/dev/zero of=/dev/mmcblk0p8 bs=1M count=2000 oflag=direct,nonblock
```

Lesen:

```text
dd if=/dev/mmcblk0p8 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

#### 2.1.2 USB-Datenträger lesen und schreiben

Schreiben:

```text
dd if=/dev/zero of=/dev/sda1 bs=1M count=2000 oflag=direct,nonblock
```

Lesen:

```text
dd if=/dev/sda1 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

### 2.2 Leistungsmodus einstellen

```text
echo performance | tee $(find /sys/ -name *governor)
```

### 2.3 CPU- und DDR-Frequenz anzeigen

```text
cat /sys/kernel/debug/clk/clk_summary |grep -E "cpu|arm|ddr"
```

### 2.4 Leistungsmessung mit glmark2

Buildroot glmark2: Test mit Bildschirmausgabe.

```text
sh /rockchip-test/gpu/test_fullscreen_glmark2.sh
```

Test ohne Bildschirmausgabe:

```text
sh /rockchip-test/gpu/test_offscreen_glmark2.sh
```

## 3. Hardware-Stabilität

### 3.1 IO-DOMAINS

Die tatsächliche Versorgungsspannung aller GPIO-Domänen muss der Softwarekonfiguration entsprechen. Vor Serienfertigung Spannungen erneut prüfen, insbesondere die IO-Versorgung von Wi-Fi, FLASH und Ethernet. Bei Einstellung 1.8 V und Versorgung 3.3 V werden Niederspannungsschaltungen überlastet und langfristig beschädigt. Bei Einstellung 3.3 V und Versorgung 1.8 V funktioniert die Schaltung nicht ordnungsgemäß. Prüfmethoden stehen in der jeweiligen Chipdokumentation; für RK3568: Rockchip_RK356X_Introduction_IO_Power_Domains_Configuration_CN.pdf.

### 3.2 Stromversorgung

Die Quelle empfiehlt das Rockchip-Referenzdesign der Stromversorgung. Bei Änderungen an Schaltung oder Bauteilen, insbesondere diskreter Versorgung statt des vorgesehenen PMIC, alle für den Chipstart wichtigen Schienen prüfen: VDD_LOGIC, VDD_ARM, VCC_PMU, VCC_DDR usw. Dazu gehören Einschaltreihenfolge bei Kaltstart und Neustart, Spannungen sowie Restwelligkeit unter hoher Last.

### 3.3 Signale

Nach Fertigstellung der Schaltung empfiehlt die Quelle eine Prüfung durch Rockchip-Ingenieure über Redmine; besonders DDR muss strikt dem Referenzdesign folgen. DDR-, EMMC- und FLASH-Bausteine aus der über Redmine erhältlichen AVL auswählen.

### 3.4 Hohe und niedrige Temperaturen

Zusätzlich zur Raumtemperatur CPU-, DDR-, Neustart- und Kaltstarttests bei hohen und niedrigen Temperaturen des tatsächlichen Produkt-Arbeitsbereichs durchführen, um die Stabilität zu prüfen.

## 4. Software-Stabilität

Dieser Abschnitt beschreibt die Grundwerkzeuge von Rockchip test und deren Anwendung zur Prüfung der Software-Stabilität eines Produkts.

### 4.1 Grundwerkzeuge

#### 4.1.1 stressapptest

##### 4.1.1.1 Überblick

stressapptest (Stressful Application Test) erstellt Kopierthreads und direkte Lese-/Schreibzugriffe auf Datenträger, um den Speicher möglichst stark und wirksam zu belasten. Zufällige Daten vom Prozessor und IO zum Speicher simulieren reale Bedingungen zur Stabilitätsprüfung der Hardware. Das bei Google eingesetzte Werkzeug ist unter Apache 2.0 verfügbar. Anwendungen: Belastungstests, Hardware-Qualifizierung und Fehlersuche, Speicherinterface- und Datenträgertests.

##### 4.1.1.2 Verwendung

Typischer Aufruf:

```text
stressapptest -s 20 -M 256 -m 8 -W    # Test 256MB, running 8 "warm copy" threads. Exit after 20 seconds.
stressapptest --help                  # list the available arguments.
```

Häufige Parameter:

| Parameter | Bedeutung / Standard |
|---|---|
| `-M mbytes` | Zu prüfende RAM-Menge in MB; verfügbaren Speicher automatisch erkennen |
| `-s seconds` | Laufzeit in Sekunden; 20 |
| `-m threads` | Speicherkopierthreads; automatisch nach CPU-Anzahl |
| `-W` | CPU-intensiveres Kopieren; false |
| `-n ipaddr` | Netzwerkthread zu ipaddr; keiner |
| `--listen` | Netzwerkthreads abhören und beantworten; 0 |
| `-f filename` | Datenträgerthread mit temporärem filename; keiner |
| `-F` | Nicht jede Transaktion prüfen, libc memcpy verwenden; false |
| `-l logfile` | Protokolldatei; keine |
| `-v level` | Ausführlichkeit 0–20; Standard 8 |

#### 4.1.2 memtester

##### 4.1.2.1 Überblick

Portables Benutzerraum-Werkzeug zum Finden von Fehlern im Speichersubsystem. Es lässt sich auf 32- und 64-Bit-Unix-artigen Systemen einschließlich proprietärer Unix-Systeme und Mac OS X kompilieren. Seit Version 4.1.0 können Entwickler eingebetteter Systeme eine physische Startadresse für den Speichertest angeben.

##### 4.1.2.2 Verwendung

```text
memtester [-p physaddrbase [-d device]] <mem>[B|K|M|G] [loops]
```

Einzelprüfungen innerhalb der Schleife:

```text
Stuck Address
Random Value
Compare XOR
Compare SUB
Compare MUL
Compare DIV
Compare OR
Compare AND
Sequential Increment
Solid Bits
Block Sequential
Checkerboard
Bit Spread
Bit Flip
Walking Ones
Walking Zeroes
8-bit Writes
16-bit Writes
```

### 4.2 Rockchip Test

Belastungstest-Protokolle liegen unter /userdata/rockchip-test; vor dem Start Lese- und Schreibrechte sicherstellen. Ein vollständiges serielles Protokoll hilft bei der Fehleranalyse: den seriellen Port des Produkts anschließen und auf dem Host alle Meldungen speichern.

#### 4.2.1 Konfiguration aktivieren

Zum Aktivieren des Pakets Rockchip-test in Buildroot folgende Einstellungen einschalten:

```text
#  - stress test on cpu and memory
BR2_PACKAGE_STRESSAPPTEST=y
#  - memtest used to testing the memory subsystem for faults
BR2_PACKAGE_MEMTESTER=y
#  - audio, reboot, bluetooth, ddr, dvfs, flash, suspend/resume, wifi
BR2_PACKAGE_ROCKCHIP_TEST=y
```

#### 4.2.2 Testliste

Unterstützte Belastungstests:

```text
# bash /rockchip-test/rockchip_test.sh
"******************************************************"
"***                                                ***"
"***          *****************************         ***"
"***          *     ROCKCHIP TEST TOOLS    *         ***"
"***          *  V2.0 updated on 20220928  *         ***"
"***          *****************************         ***"
"***                                                ***"
"*****************************************************"

"*****************************************************"
"ddr test:              1 (ddr stress test)"
"cpu test:              2 (cpu stress test)"
"gpu test:              3 (gpu stress test)"
"npu test:              4 (npu stress test)"
"suspend_resume test:   5 (suspend resume test)"
"reboot test:           6 (auto reboot test)"
"power lost test:       7 (power lost test)"
"flash stress test:     8 (flash stress test)"
"recovery test:         9 (recovery wipe all test)"
"audio test:           10 (audio test)"
"camera test:          11 (camera test)"
"video test:           12 (video test)"
"bluetooth test:       13 (bluetooth on off test)"
"wifi test:            14 (wifi on off test)"
"chromium test:        15 (chromium with video test)"
"*****************************************************"
```

#### 4.2.3 Testumfang

Für jeden Test werden mindestens 10 Geräte × 24 Stunden empfohlen; den Umfang an die Stabilitätsanforderungen des Projekts anpassen.

#### 4.2.4 Testmethoden

Der Start einzelner Tests wird anhand von memtester im DDR-Belastungstest gezeigt. Möglich sind das Menü rockchip_test oder der direkte Aufruf des jeweiligen Skripts.

##### 4.2.4.1 Rockchip Test

```text
bash rockchip-test/rockchip_test.sh
```

In der Belastungstestliste 1 für DDR Test eingeben.

```text
"*****************************************************"
"***                                               ***"
"***            DDR TEST                           ***"
"***                                               ***"
"*****************************************************"
"*****************************************************"
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"ddr auto scaling:                               4"
"stressapptest + memtester + ddr auto scaling:   5"
"*****************************************************"
```

Danach 1 für memtester eingeben, um den Test zu starten.

##### 4.2.4.2 Direkter Aufruf

```text
bash /rockchip-test/ddr/memtester_test.sh
```

#### 4.2.5 Einzelheiten der Tests

##### 4.2.5.1 DDR-Test

Der DDR-Belastungstest unterstützt fünf Szenarien:

```text
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"DDR auto scaling:                               4"
"stressapptest + memtester + DDR auto scaling:   5"
```

Ohne Frequenzänderung Option 3 wählen: stressapptest + memtester. Mit Frequenzänderung Option 5 wählen: stressapptest + memtester + automatische DDR-Frequenzänderung. Einstieg ist ddr_test.sh mit den drei folgenden Skripten. Beide Quellen nennen hier irrtümlich CPU-Belastung; gemeint ist DDR.

```text
/rockchip-test/ddr/ddr_freq_scaling.sh
/rockchip-test/ddr/memtester_test.sh
/rockchip-test/ddr/stressapptest_test.sh
```

###### 4.2.5.1.1 DDR-Frequenzänderung

Ohne Argumente ändert das Skript die Frequenz automatisch.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh
cnt: 0, ddr freq: success change to 528000000 Hz
..
cnt:100, ddr freq: success change to 324000000 Hz
```

Bei Angabe einer unterstützten Frequenz wird auf diese umgeschaltet.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 528000000
ddr freq: success change to 528000000 Hz
```

Bei einer nicht unterstützten Frequenz zeigt das Skript verfügbare und aktuelle Frequenzen an.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 1
ddr freq: 1 is not in available frequencies: 324000000 528000000
ddr freq: now 528000000 Hz
```

Test beenden:

```text
killall bash
```

###### 4.2.5.1.2 stressapptest_test

Standardmäßig nutzt das stressapptest-Skript die Hälfte des verfügbaren Speichers und endet nach 24 Stunden. Test beenden:

```text
killall stressapptest
```

###### 4.2.5.1.3 memtester_test

Standardmäßig nutzt memtester die Hälfte des verfügbaren Speichers. Test beenden:

```text
killall memtester
```

Hinweis: memtester beendet den Test bei Fehlern nicht automatisch; seine Protokollausgabe muss überwacht werden.

##### 4.2.5.2 CPU-Test

Der CPU-Belastungstest unterstützt drei Szenarien:

```text
"stressapptest test:                               1"
"cpu auto scaling:                                 2"
"stressapptest + cpu auto scaling:                 3"
```

Ohne Frequenzänderung Option 2 wählen: stressapptest. Mit Frequenzänderung Option 3 wählen: stressapptest plus automatische CPU-Frequenzänderung. Der Test besteht aus dem Einstiegsskript cpu_test.sh und cpu_freq_scaling.sh.

###### 4.2.5.2.1 CPU-Frequenzänderung

Ohne Argumente ändert das Skript die Frequenz automatisch.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh
cnt: 0, cpu freq policy:0 success change to 816000 KHz
...
cnt: 100, cpu freq policy:0 success change to 1104000 KHz
```

Bei Angabe einer unterstützten Frequenz wird auf diese umgeschaltet.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1104000
cpu freq policy:0 success change to 1104000 KHz
```

Bei einer nicht unterstützten Frequenz werden verfügbare und aktuelle Frequenzen ausgegeben.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1
cpu freq: 1 is not in available frequencies: 600000 816000 1008000 1104000 1416000
cpu freq: now 1104000 Hz
```

Test beenden:

```text
killall bash
```

##### 4.2.5.3 Flash-Test

7 zufällige Quelldateien mit jeweils bis zu 5 MB unter $test_dir/src_test_data erzeugen, in fünf Unterverzeichnisse von $test_dir/des_test_data kopieren und MD5 vergleichen. 200 Durchläufe ausführen.

##### 4.2.5.4 Standby und Aufwachen

Automatisches Standby/Aufwachen benötigt eine funktionierende RTC. Standardmäßig endet der Test nach 10.000 Zyklen; die Zeit bis zum Aufwachen ist zufällig zwischen 3 und 6 Sekunden.

##### 4.2.5.5 Neustarttest

Standardmäßig endet der Test nach 10.000 Neustarts. Nach jedem Start wird das System nach 8 Sekunden automatisch heruntergefahren. Vorzeitig beenden:

```text
echo off > /userdata/rockchip_test/reboot_cnt
```

Ist CONFIG_PSTORE_RAM aktiviert, prüft das Skript nach jedem Start das Protokoll des vorherigen Herunterfahrens auf Abstürze oder andere Auffälligkeiten und beendet den Test bei einem Fund automatisch.

##### 4.2.5.6 GPU-Test

Der GPU-Belastungstest basiert auf glmark-es2 und test_stress_glmark2.sh, das glmark-es2 mit run-forever ausführt. glmark-es2 ist ein Benchmark für OpenGL ES 2.0 und verwendet nur das damit kompatible Teilset der OpenGL-2.0-API.

##### 4.2.5.7 Kameratest

Für Kamerabelastungstests stehen zwei Methoden bereit:

1. camera_stresstest_rkisp_demo.sh. In Buildroot müssen folgende Einstellungen aktiviert sein:

```text
BR2_PACKAGE_CAMERA_ENGINE_RKAIQ_RKISP_DEMO=y
```

rkisp_demo benötigt keine ISP-Pipeline-Konfiguration über media-ctl. USB-Kameras werden damit nicht belastet. Von ISP- und CIF-Schnittstellen werden zyklisch jeweils 100 Frames aufgenommen; die Dateigröße wird nicht geprüft.

2. camera_stresstest_v4l2.sh. In Buildroot müssen folgende Einstellungen aktiviert sein:

```text
BR2_PACKAGE_LIBV4L_UTILS=y
```

Bei v4l2-ctl kann eine ISP-Pipeline-Konfiguration über media-ctl nötig sein. Diese Methode umfasst USB-Kameras. Zyklisch werden jeweils 5 Frames mit 640x480 von USB, ISP und CIF aufgenommen und die Dateigröße geprüft. Die Methode entsprechend dem tatsächlichen Einsatz wählen.

##### 4.2.5.8 Videotest

Videos werden fortlaufend aus /mnt/udisk/videos oder /userdata/videos abgespielt. Testdateien zuvor in eines der Verzeichnisse legen; /userdata/videos wird zuerst geprüft. Fehlen beide Verzeichnisse, wird eine Meldung ausgegeben und der Test beendet.

##### 4.2.5.9 Wi-Fi- und BT-Test

Wi-Fi und BT werden automatisch ein- und ausgeschaltet.

### 4.3 Anwendungsszenarien

Zusätzlich zu einzelnen Funktionstests lassen sich reale Produktabläufe als ergänzende Stabilitäts-Belastungstests simulieren. Beispiel für einen Wörterbuchstift:

Einschalten → scannen und erkennen → Übersetzung abspielen → bis zum Standby der zweiten Stufe liegen lassen → aufwecken und erneut nutzen; dazwischen zufälliges Wi-Fi-/BT-Umschalten.

Mit den Befehlen der Grundskripte lässt sich dieser reale Ablauf nachbilden:

Einschalten → Schleife (v4l2-Aufnahme → aplay-Wiedergabe → pm-suspend → RTC-Aufwachen); im Wachzustand Wi-Fi/BT zufällig umschalten.

## 5. Geplante Ergänzungen

### 5.1 Analyse häufiger Probleme ergänzen

### 5.2 Tests für NPU, recovery, Audio, Browser und Stromausfall ergänzen

## Quellenunterschiede, Fehler und Ausführungsgrenzen

- Beide Quellen sind V2.0.2: Chinesisch 20 Seiten, Englisch 14. Nur Englisch enthält Dateisuche 1.1.9; danach sind Speicher-/Datenträgernummern um eins verschoben. Die Überschrift zu df -h nennt fälschlich Arbeitsspeicher; Chinesisch korrekt Datenträgerplatz.
- Die zwei Szenarioabläufe auf englischer Seite 14 überschreiten den Satzbereich und fehlen im extrahierten Text. Sie wurden anhand chinesischer Seite 20 als Fließtext ergänzt. Kapitel 5 enthält geplante Ergänzungen, keine fertigen Anleitungen zu NPU, recovery, Audio, Browser oder Stromausfall.
- Aufnahme schreibt /tmp/isp.yuv, Wiedergabe liest /tmp/cif.yuv: Dateinamen abstimmen. Gedrucktes –d bei arecord und –h bei free durch ASCII -d und -h ersetzen; “or” ist kein Shell-Operator. wmv/mp3 und aplay musicdemo.wmv sind Quellenbeispiele, keine Zusage der Formatunterstützung.
- Chinesischer Text und xrandr-Ausgabe nennen HDMI-1 und DSI-1; englischer Text fälschlich DP-1. Englischen xrandr- und aplay-Dplughw-Beispielen fehlen Leerzeichen. Chinesische Beispiele: su linaro -c "DISPLAY=:0 xrandr --output HDMI-1 --above DSI-1" und aplay -Dplughw:0,0 /dev/urandom (ggf. Karte 1 oder 2). --preferred/--off sind keine Anordnungsoptionen und nicht mechanisch austauschbar.
- Der DDR-Absatz nennt irrtümlich CPU-Belastung. CPU-Menü: 1=stressapptest, 2=cpu auto scaling, 3=kombiniert; beide Texte empfehlen jedoch 2 ohne Frequenzänderung. Das tatsächliche Menü prüfen. CPU-Beispiele verwenden meist KHz, die letzte Ausgabe bei ungültiger Frequenz nennt Hz; DDR verwendet Hz. Einheiten nicht verwechseln.
- stressapptest -W und -F sind standardmäßig false; Chinesisch übersetzt dies irrtümlich als „falsch“. Die Tabelle stellt den deaktivierten Zustand klar. /userdata/rockchip-test und /userdata/rockchip_test/reboot_cnt unterscheiden sich durch Bindestrich/Unterstrich: Skripte prüfen. Originalkommentare, Diagnoseausgaben, SSIDs und Passwörter bleiben unbenutzte Quellenbeispiele.

{% endraw %}
