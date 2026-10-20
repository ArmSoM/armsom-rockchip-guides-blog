---
title: "Rockchip HDMI-CEC vollständig erklärt: Android-HAL, Linux cec-ctl, Nachrichtenabläufe und Fehlersuche"
description: "Rockchip HDMI-CEC vollständig erklärt: Android-HAL, Linux cec-ctl, Nachrichtenabläufe und Fehlersuche"
translation_key: "048-rockchip-hdmi-cec"
slug: "048-rockchip-hdmi-cec"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["HDMI-CEC", "Rockchip", "Android", "HAL", "Linux", "cec-ctl"]
keywords: "ArmSoM Rockchip HDMI CEC Android HAL Linux cec-ctl"
excerpt: "Rockchip HDMI-CEC vollständig erklärt: Android-HAL, Linux cec-ctl, Nachrichtenabläufe und Fehlersuche"
---

{% raw %}

# Rockchip HDMI-CEC vollständig erklärt: Android-HAL, Linux cec-ctl, Nachrichtenabläufe und Fehlersuche

Dies ist eine Rockchip-HDMI-CEC-Plattformreferenz auf Grundlage der chinesischen PDF-Datei V1.1.0 (39 Seiten); ein englisches Original wurde nicht bereitgestellt. Die englische und russische Fassung übersetzen den vollständigen technischen Haupttext; alle drei bisherigen Sprachfassungen verwenden Abbildungen aus der chinesischen Quelle mit lokalisierten Alternativtexten. Die deutsche Fassung übersetzt den vollständigen englischen Artikel und übernimmt dieselben Abbildungen. Die Quelle behandelt Android 5.x und höher, Linux-Kernel 4.4/4.19 sowie RK322X/RK3328/RK3368/RK3399/RK3288. Daraus folgt keine Unterstützung durch alle aktuellen BSPs oder ArmSoM-Platinen. Prüfen Sie den tatsächlichen SoC, die HDMI-CEC-Verdrahtung, HAL, CEC-Treiber, Android-Dienste und Standby-Firmware. Es wurden keine ArmSoM-Hardwaretests oder TV-Kompatibilitätstests durchgeführt; Protokolle und Verfahren sind Beispiele aus der Quelle.

[Redaktionelle Hinweise](/docs/rockchip-hdmi-cec/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Einführung in CEC

### 1.1 Bedeutung von CEC

CEC steht für Consumer Electronics Control. Es ermöglicht die erweiterte Steuerung von über HDMI verbundenen Heim-Audio-/Videogeräten, sodass Benutzer die miteinander verbundenen Geräte mit einer einzigen Fernbedienung bedienen können.

![Technische Abbildung aus der chinesischen Quelle, S. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-1.png)

Wie dargestellt, kann sowohl die TV-Fernbedienung als auch die Fernbedienung der Set-Top-Box den Fernseher und die Box steuern.

### 1.2 Überblick über das CEC-Protokoll

CEC setzt voraus, dass alle audiovisuellen Quellen direkt oder indirekt mit einem zentralen Anzeigegerät verbunden sind. Die HDMI-Verbindungen bilden einen hierarchischen Baum: Das Anzeigegerät ist die Wurzel, Umschaltgeräte bilden Zweige und Quellen die Blätter. Jedes Gerät benötigt genau eine physische Adresse, damit CEC es adressieren und steuern kann. Die Software weist die physischen Adressen im gesamten CEC-Netz mithilfe von EDID zu.

![Technische Abbildung aus der chinesischen Quelle, S. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-2.png)

Jedes Gerät am CEC-Bus muss eine logische Adresse binden, die seinen Typ kennzeichnet. Mit Ausnahme der Adresse 15 darf jede logische Adresse nur einem Gerät zugeordnet sein. Die meisten Geräte verwenden eine logische Adresse; einige wenige können bis zu zwei verwenden.

![Technische Abbildung aus der chinesischen Quelle, S. 5](/docs/rockchip-hdmi-cec/assets/cn-p5-1.png)

| Adresse | Gerät |
| --- | --- |
| 0 | TV |
| 1 | Aufnahmegerät 1 |
| 2 | Aufnahmegerät 2 |
| 3 | Tuner 1 |
| 4 | Wiedergabegerät 1 |
| 5 | Audiosystem |
| 6 | Tuner 2 |
| 7 | Tuner 3 |
| 8 | Wiedergabegerät 2 |
| 9 | Aufnahmegerät 3 |
| 10 | Tuner 4 |
| 11 | Wiedergabegerät 3 |
| 12 | Reserviert |
| 13 | Reserviert |
| 14 | Besondere Verwendung |
| 15 | Nicht registriert (Initiator) / Broadcast (Ziel) |

Die Zuweisung logischer Adressen ist nachfolgend dargestellt. Eine POLL MSG mit identischer SRC- und DST-Adresse prüft, ob ein anderes Gerät diese Adresse bereits belegt.

![Technische Abbildung aus der chinesischen Quelle, S. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-1.png)

CEC-Geräte kommunizieren durch das Senden von CEC-Nachrichten.

![Technische Abbildung aus der chinesischen Quelle, S. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-2.png)

Eine CEC-Nachricht besteht aus einem oder mehreren Blöcken. Jeder Block enthält 8 Header-/Datenbits, ein EOM-Bit und ein ACK-Bit. EOM=1 kennzeichnet den letzten Block, nach dem keine weiteren Daten folgen. Der Sender setzt ACK auf 1; ein Empfänger, der die Nachricht erfolgreich empfangen hat, setzt es zur Bestätigung auf 0.

![Technische Abbildung aus der chinesischen Quelle, S. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-3.png)

Der Header Block ist der erste Block. Seine oberen vier Informationsbits enthalten die logische Adresse des Senders, die unteren vier die Zieladresse. Ein Data Block enthält in seinen Informationsbits einen Opcode oder Parameter.

## 2. CEC-Implementierung

### 2.1 Android-CEC-Framework

#### 2.1.1 Framework-Überblick

Viele Hersteller implementieren HDMI-CEC und ermöglichen damit einen herstellerübergreifenden Betrieb. Unterschiede in Implementierung und Funktionsumfang verhindern jedoch vollständige Kompatibilität; zwei als CEC-fähig beworbene Produkte sind nicht zwangsläufig miteinander kompatibel. Zusammen mit Android TIF (TV Input Framework) ermöglicht HDMI-CEC die Kommunikation zwischen verbundenen Geräten und soll Kompatibilitätsprobleme minimieren. Android führte dafür HdmiControlService ein. Als Bestandteil des Android-Ökosystems soll dieser Dienst allen Herstellern eine standardisierte HDMI-CEC-Implementierung bereitstellen und Inkompatibilitäten reduzieren. Zuvor entwickelten Hersteller eigene Implementierungen oder nutzten Drittanbieterlösungen. Die Quelle beschreibt HdmiControlService als einen Android-Dienst, der mit weit verbreiteten HDMI-CEC-Geräten getestet wurde und Erkenntnisse aus Kompatibilitätsuntersuchungen sowie Vorschläge erfahrener Industriepartner berücksichtigt. Er verbindet die Standardvorgaben mit Anpassungen für bereits in Haushalten eingesetzte Produkte. Dies sind Aussagen der Quelle, keine für diesen Artikel durchgeführten Kompatibilitätstests.

##### 2.1.1.1 HdmiControlService

HdmiControlService arbeitet mit TIF, Audiodiensten, Energieverwaltung und weiteren Systemkomponenten zusammen, um CEC umzusetzen. Das Diagramm zeigt den Übergang von einem angepassten CEC-Controller zu einer einfacheren HDMI-CEC-Hardwareabstraktionsschicht und erläutert den HDMI-Steuerdienst. Die wichtigsten Komponenten folgen:

HdmiControlManager stellt APIs für autorisierte Anwendungen bereit. Systemdienste wie TV Input Manager und Audiodienste können diese Klasse direkt verwenden.

Quellcodepfad:

```text
frameworks/base/core/java/android/hardware/hdmi
```

Der Dienst ist für die Unterstützung mehrerer logischer Gerätetypen ausgelegt.

Quellcodepfad:

```text
frameworks/base/services/core/java/com/android/server/hdmi
```

HDMI-CEC greift über eine HAL auf die Hardware zu und abstrahiert damit gerätespezifische Unterschiede in Protokoll und Signalisierung. Hersteller können auf Grundlage der vorhandenen Schnittstellendefinition eine eigene HAL implementieren.

![Technische Abbildung aus der chinesischen Quelle, S. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-1.png)

![Technische Abbildung aus der chinesischen Quelle, S. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-2.png)

##### 2.1.1.2 HDMI-CEC-HAL

Damit der CEC-Dienst funktioniert, muss die HDMI-CEC-HAL entsprechend der Android-Definition implementiert werden. Sie abstrahiert Hardwareunterschiede und stellt grundlegende Operationen wie Zuweisung, Lesen und Schreiben über APIs bereit. Gerätehersteller müssen diese APIs unterstützen. TX/RX/Ereignisse:

send_message

register_event_callback

Informationen:

get_physical_address

get_version

get_vendor_id

get_port_info

Logische Adressen:

add_logical_address

clear_logical_address

Zustand:

is_connected; set_option

set_audio_return_channel

Auszug aus der API-Definition der HDMI-CEC-HAL:

```text
#ifndef ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H
#define ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H


...

/*
 * HDMI-CEC HAL interface definition.
 */
typedef struct hdmi_cec_device {
   /**
   * Common methods of the HDMI-CEC device. This *must* be the first member of
   * hdmi_cec_device as users of this structure will cast a hw_device_t to
hdmi_cec_device
   * pointer in contexts where it's known the hw_device_t references a
hdmi_cec_device.

   */
   struct hw_device_t common;

   /*
   * (*add_logical_address) passes the logical address that will be used
   * in this system.
   *
   * HAL may use it to configure the hardware so that the CEC commands
addressed
   * the given logical address can be filtered in. This method can be called
   * as many times as necessary in order to support multiple logical devices.
   * addr should be in the range of valid logical addresses for the call
   * to succeed.

   *
   * Returns 0 on success or -errno on error.
   */
   int (*add_logical_address)(const struct hdmi_cec_device* dev,
cec_logical_address_t addr);

   /*
   * (*clear_logical_address) tells HAL to reset all the logical addresses.
   *
   * It is used when the system doesn't need to process CEC command any more,
   * hence to tell HAL to stop receiving commands from the CEC bus, and change
    * the state back to the beginning.
    */
   void (*clear_logical_address)(const struct hdmi_cec_device* dev);


   /*
    * (*get_physical_address) returns the CEC physical address. The
    * address is written to addr.
    *
    * The physical address depends on the topology of the network formed
    * by connected HDMI devices. It is therefore likely to change if the cable
    * is plugged off and on again. It is advised to call get_physical_address
    * to get the updated address when hot plug event takes place.
    *
    * Returns 0 on success or -errno on error.
    */

   int (*get_physical_address)(const struct hdmi_cec_device* dev, uint16_t*
addr);

   /*
    * (*send_message) transmits HDMI-CEC message to other HDMI device.
    *
    * The method should be designed to return in a certain amount of time not
    * hanging forever, which can happen if CEC signal line is pulled low for
    * some reason. HAL implementation should take the situation into account
    * so as not to wait forever for the message to get sent out.
    *
    * It should try retransmission at least once as specified in the standard.
    *

    * Returns error code. See HDMI_RESULT_SUCCESS, HDMI_RESULT_NACK, and
    * HDMI_RESULT_BUSY.
    */
   int (*send_message)(const struct hdmi_cec_device* dev, const cec_message_t*);

   /*
    * (*register_event_callback) registers a callback that HDMI-CEC HAL
    * can later use for incoming CEC messages or internal HDMI events.
    * When calling from C++, use the argument arg to pass the calling object.
    * It will be passed back when the callback is invoked so that the context
    * can be retrieved.
    */

   void (*register_event_callback)(const struct hdmi_cec_device* dev,
         event_callback_t callback, void* arg);

   /*
    * (*get_version) returns the CEC version supported by underlying hardware.
    */
   void (*get_version)(const struct hdmi_cec_device* dev, int* version);

   /*
    * (*get_vendor_id) returns the identifier of the vendor. It is
    * the 24-bit unique company ID obtained from the IEEE Registration
    * Authority Committee (RAC).
    */

   void (*get_vendor_id)(const struct hdmi_cec_device* dev, uint32_t*
vendor_id);
   /*
   * (*get_port_info) returns the hdmi port information of underlying hardware.
   * info is the list of HDMI port information, and 'total' is the number of

   * HDMI ports in the system.
   */
   void (*get_port_info)(const struct hdmi_cec_device* dev,
         struct hdmi_port_info* list[], int* total);

   /*
   * (*set_option) passes flags controlling the way HDMI-CEC service works down
   * to HAL implementation. Those flags will be used in case the feature needs
   * update in HAL itself, firmware or microcontroller.
   */
   void (*set_option)(const struct hdmi_cec_device* dev, int flag, int value);


   /*
   * (*set_audio_return_channel) configures ARC circuit in the hardware logic
   * to start or stop the feature. Flag can be either 1 to start the feature
   * or 0 to stop it.
   *
   * Returns 0 on success or -errno on error.
   */
   void (*set_audio_return_channel)(const struct hdmi_cec_device* dev, int
flag);

   /*
   * (*is_connected) returns the connection status of the specified port.
   * Returns HDMI_CONNECTED if a device is connected, otherwise

HDMI_NOT_CONNECTED.
   * The HAL should watch for +5V power signal to determine the status.
   */
   int (*is_connected)(const struct hdmi_cec_device* dev, int port);

   /* Reserved for future use to maximum 16 functions. Must be NULL. */
   void* reserved[16 - 11];
} hdmi_cec_device_t;

#endif /* ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H */
```

Über diese APIs nutzt der CEC-Dienst Hardwareressourcen zum Senden und Empfangen von HDMI-CEC-Befehlen, zum Konfigurieren von Einstellungen und optional zur Kommunikation mit einem systemnahen Mikroprozessor, der die CEC-Steuerung übernimmt, während Android im Standby ist.

#### 2.1.2 Zugehörige Quellcodepfade

CEC-bezogene Codepfade und ihre Funktionen:

| Pfad | Beschreibung |
| --- | --- |
| kernel/drivers/media/cec/cec-adap.c | CEC-Kerntreiber: bindet physische/logische Adressen und verwaltet CEC-Ereignisse sowie Nachrichtensenden und -empfang. |
| kernel/drivers/media/cec/cec-api.c | Stellt IOCTL-Aufrufe für den Benutzerraum bereit. |
| kernel/drivers/media/cec/cec-core.c | Registriert CEC-Geräte. |
| kernel/drivers/media/cec/cec-notifier.c | Benachrichtigt den CEC-Treiber über Änderungen der physischen Adresse. |
| kernel/drivers/media/cec/cec-edid.c | EDID-Hilfsfunktionen, hauptsächlich zum Auslesen der physischen Adresse. |
| kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c | DW-HDMI-CEC-Treiber, hauptsächlich für Zugriffe auf DW-HDMI-CEC-Register. |

Android-Quellcodepfade:

| Pfad | Beschreibung |
| --- | --- |
| hardware/rockchip/hdmicec/hdmi_cec.cpp | Implementiert die standardisierte CEC-HAL-Schnittstelle. |
| hardware/rockchip/hdmicec/hdmicec_event.cpp | Ein Thread überwacht CEC-Nachrichten/-Ereignisse des Kernels und meldet sie an höhere Schichten. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java | Dienst zum Senden und Verarbeiten von HDMI-Steuernachrichten und CEC-Befehlen. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecController.java | Verwaltet CEC-Befehle und -Operationen. Wandelt Benutzerbefehle für die HAL in CEC um; analysiert eingehende Nachrichten und verteilt sie an Module. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java | Modelliert und initialisiert ein logisches CEC-Gerät und ruft gerätespezifische Handler für empfangene Nachrichten auf. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java | Abstrahiert ein PLAYBACK-Gerät und stellt dessen Schnittstellen bereit. |

### 2.2 HDMI-CEC-Anwendungen unter Linux

Unter Linux steuert cec-ctl aus v4l-utils die CEC-Geräte über die Kommandozeile.

#### 2.2.1 Installieren von v4l-utils

Installieren Sie v4l-utils unter Debian mit:

```text
sudo apt-get install v4l-utils
```

Aktivieren Sie unter Buildroot diese Build-Optionen:

```text
BR2_PACKAGE_LIBV4L=y
BR2_PACKAGE_LIBV4L_UTILS=y
```

#### 2.2.2 Befehle

Playback-Befehl:

```text
[root@rk3288:/]#cec-ctl --playback -o Rockchip -V 0xaabbcc -M -T
```

Auszug aus der Ausgabe:

```text
CEC_ADAP_G_CAPS returned 0 (Success)
CEC_ADAP_G_PHYS_ADDR returned 0 (Success)

CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_G_LOG_ADDRS returned 0 (Success)
Driver Info:
Driver Name : dwhdmi-rockchip
Adapter Name : dw_hdmi
Capabilities : 0x0000000e
Logical Addresses
Transmit
Passthrough
Driver version : 4.4.167
Available Logical Addresses: 4
Physical Address : 1.0.0.0

Logical Address Mask : 0x0010
CEC Version : 2.0
Vendor ID : 0xaabbcc
Logical Address : 4 (Playback Device 1)
Primary Device Type : Playback
Logical Address Type : Playback
All Device Types : Playback
RC TV Profile : None
Device Features : None
Monitor All mode is not supported, falling back to regular monitoring
CEC_S_MODE returned 0 (Success)
CEC_DQEVENT returned 0 (Success)
```

Bei der CEC-Initialisierung werden grundlegende Informationen wie Hersteller-ID, OSD-Name und CEC-Version ausgetauscht:

```text
Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_DEVICE_VENDOR_ID
(0x8c)
CEC_RECEIVE returned 0 (Success)

Transmitted by Playback Device 1 to all (4 to 15): CEC_MSG_DEVICE_VENDOR_ID
(0x87):
vendor-id: 11189196 (0x00aabbcc)
CEC_RECEIVE returned 0 (Success)

Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_OSD_NAME (0x46)
CEC_RECEIVE returned 0 (Success)
Transmitted by Playback Device 1 to TV (4 to 0): CEC_MSG_SET_OSD_NAME (0x47):
name: Rockchip
CEC_RECEIVE returned 0 (Success)
```

Wenn der Fernseher in den Standby wechselt, sendet er eine Standby-Nachricht an den SoC:

```text
Received from TV to all (0 to 15): CEC_MSG_STANDBY (0x36)
CEC_RECEIVE returned 0 (Success)
```

Beim Umschalten der Eingangsquelle sendet der Fernseher folgende Nachrichten:

```text
Received from TV to all (0 to 15): CEC_MSG_SET_STREAM_PATH (0x86):
phys-addr: 2.0.0.0

CEC_RECEIVE returned 0 (Success)
Received from TV to all (0 to 15): CEC_MSG_ROUTING_CHANGE (0x80):
orig-phys-addr: 0.0.0.0
new-phys-addr: 2.0.0.0
CEC_RECEIVE returned 0 (Success)
```

Befehl für One-Touch-Play:

```text
[root@rk3288:/]# cec-ctl --help-one-touch-play
One Touch Play Feature:

--active-source=phys-addr=<val> Send ACTIVE_SOURCE message (0x82)
--image-view-on Send IMAGE_VIEW_ON message (0x04)
--text-view-on Send TEXT_VIEW_ON message (0x0d)
```

Fernseher aufwecken:

```text
[root@rk3288:/]#cec-ctl --image-view-on -to 0
```

Standby-Befehl:

```text
[root@rk3288:/]# cec-ctl --standby --to 0
```

Weitere Benutzerraumbefehle finden Sie unter cec-ctl --help.

Hinweise

Die Quellimplementierung unterstützt noch nicht, den SoC durch Standby beziehungsweise Aufwecken des Fernsehers in Suspend zu versetzen oder aufzuwecken.

Folgen Sie für Suspend dem Playback-Beispiel in §2.2.2: Rufen Sie nach dem Empfang von CEC_MSG_STANDBY echo mem > /sys/power/state auf, um den SoC synchron in Suspend zu versetzen. Das Aufwecken erfordert die Behandlung von trust, cec-clk und HDMI PHY während Standby und wird von der Quellimplementierung nicht ausreichend unterstützt.

Nicht jedes HDMI-Gerät unterstützt CEC. Prüfen Sie zunächst, ob der Fernseher beziehungsweise das HDMI-Display CEC und den konkreten Befehl unterstützt.

### 2.3 CEC-Softwareabläufe

#### 2.3.1 CEC-Initialisierung

##### 2.3.1.1 Registrierung des CEC-Treibers

![Technische Abbildung aus der chinesischen Quelle, S. 15](/docs/rockchip-hdmi-cec/assets/cn-p15-1.png)

Das obige Diagramm zeigt die Registrierung des CEC-Treibers.

dw_hdmi_cec_probe:

Initialisiert den CEC-Treiber und verbindet das abstrakte Systemgerät mit der tatsächlichen CEC-Hardware. Initialisiert außerdem die CEC-Register und registriert den Interrupt für das Senden und Empfangen von Nachrichten (cec->irq).

cec_allocate_adapter:

(1) Erstellt und konfiguriert den Adapter.

Adapterstruktur:

```text
struct cec_adapter {
      struct module *owner;

      char name[32];
      struct cec_devnode devnode;
      struct mutex lock;
      struct rc_dev *rc;
      struct list_head transmit_queue;
      unsigned int transmit_queue_sz;

      struct list_head wait_queue;
      struct cec_data *transmitting;

      struct task_struct *kthread_config;
      struct completion config_completion;

      struct task_struct *kthread;
      wait_queue_head_t kthread_waitq;
      wait_queue_head_t waitq;

      const struct cec_adap_ops *ops;
      void *priv;

      u32 capabilities;
      u8 available_log_addrs;
     u32 monitor_all_cnt;
      u32 monitor_pin_cnt;
      u32 follower_cnt;
      struct cec_fh *cec_follower;
      struct cec_fh *cec_initiator;
      bool passthrough;
      struct cec_log_addrs log_addrs;

      u32 tx_timeouts;

#ifdef CONFIG_CEC_NOTIFIER

      struct cec_notifier *notifier;
#endif
#ifdef CONFIG_CEC_PIN
      struct cec_pin *pin;
#endif

      struct dentry *cec_dir;
      struct dentry *status_file;

      u16 phys_addrs[15];
      u32 sequence;


      char input_name[32];
      char input_phys[32];
      char input_drv[32];
};
```

Die wichtigsten Strukturmitglieder werden nachfolgend beschrieben:

| Name | Beschreibung |
| --- | --- |
| transmit_queue | Warteschlange ausstehender CEC-Sendungen. |
| transmit_queue_sz | Länge der Warteschlange ausstehender Sendungen. |
| wait_queue | Speichert Nachrichten, die auf eine Antwort warten, sofern dies angefordert wurde; in dieser Version ungenutzt. |
| transmitting | Gerade gesendete CEC-Nachricht. |
| kthread_config | Thread zur Durchführung der CEC-Initialisierungskonfiguration. |
| config_completion | Completion-Objekt zum Warten auf die CEC-Initialisierung (in der Quelle als Semaphor bezeichnet). |
| kthread | Deskriptor für cec_thread_func zur Verwaltung der CEC-Sendewarteschlange. |
| kthread_waitq | Warteschlange für cec_thread_func. |
| ops | Adapter-Callbacks; siehe kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c. |
| capabilities | Konfigurierte Adapterfähigkeiten. |
| available_log_addrs | Maximale Anzahl zuweisbarer logischer Adressen. |
| phys_addr | Aktuelle physische Adresse. |
| is_configuring | Initialisierungskonfiguration läuft. |
| is_configured | Initialisierungskonfiguration abgeschlossen. |
| follower_cnt | Anzahl der Follower; 1 in der Lösung der Quelle. |
| cec_follower | Aktueller cec_follower; in dieser Version fh. |
| cec_initiator | Aktueller cec_initiator; in dieser Version fh. |
| passthrough | Gibt an, ob der aktuelle cec_follower Passthrough verwendet. |
| log_addrs | Eine oder mehrere derzeit zugewiesene logische Adressen. |
| tx_timeouts | Anzahl der CEC-Sendezeitüberschreitungen; normalerweise selten. |
| notifier | CEC-Notifier. |
| phys_addrs | Physische Adressen für den Fall mehrerer logischer Adressen. |
| sequence | Sendesequenznummer des Adapters zur Nachverfolgung auf Antworten wartender Nachrichten. |

(2) Startet cec_thread_func zur Verwaltung der CEC-Sendewarteschlange.

(3) Konfiguriert die nachfolgend beschriebenen Adapterfähigkeiten:

| Name | Beschreibung |
| --- | --- |
| CEC_CAP_PHYS_ADDR | Der Benutzerraum muss die physische Adresse setzen. |
| CEC_CAP_LOG_ADDRS | Der Benutzerraum muss logische Adressen setzen. |
| CEC_CAP_TRANSMIT | Erlaubt dem Benutzerraum das Senden von CEC-Nachrichten. |
| CEC_CAP_PASSTHROUGH | Der Treiber leitet empfangene Nachrichten unverarbeitet direkt an den Benutzerraum weiter. |
| CEC_CAP_RC | Unterstützt die CEC-Steuerung durch den Fernbedienungstreiber. |
| CEC_CAP_MONITOR_ALL | Empfängt alle CEC-Nachrichten einschließlich fremd adressierter Nachrichten, normalerweise zur Fehlersuche. |
| CEC_CAP_NEEDS_HPD | Aktiviert CEC nur bei High-Pegel von HDMI HPD. |
| CEC_CAP_MONITOR_PIN | Überwacht Änderungen am CEC-Pin. |

cec_register_adapter:

(1) Registriert den CEC-Geräteknoten.

(2) Registriert die CEC-Debug-Knoten.

cec_register_cec_notifier:

Registriert einen CEC-Notifier und bindet ihn an den Adapter.

##### 2.3.1.2 CEC-Initialisierungseinstellungen

CEC muss korrekt initialisiert werden: Die entsprechenden Schalter müssen aktiviert, die logische Adresse gebunden und gespeichert sowie die Treiberkonfiguration abgeschlossen werden. Die Abläufe in FRAMEWORK, JNI und HAL sind nachfolgend dargestellt:

![Technische Abbildung aus der chinesischen Quelle, S. 19](/docs/rockchip-hdmi-cec/assets/cn-p19-1.png)

Wichtige Phasen:

initializeCec:

initializeCec ist die zentrale Initialisierungsphase. Sie wird beim Systemstart, nach dem Resume und beim Aktivieren von CEC in den Einstellungen ausgeführt. Sie initialisiert lokale Geräte, weist logische Adressen zu und aktiviert CEC-Schalter. In der Android-Implementierung der Quelle werden nur TV- und PLAYBACK-Geräte unterstützt; Rockchip verwendet hauptsächlich PLAYBACK.

initializeLocalDevices:

(1) Erstellt und initialisiert das lokale CEC-Gerät HdmiCecLocalDevicePlayback. (2) localDevice.init ruft getPreferredAddress auf, um persist.sys.hdmi.addr.playback zu lesen. Eine zuvor zugewiesene Adresse wird zuerst versucht; andernfalls beginnt die Zuweisung mit der ersten Adresse des Gerätetyps, bei PLAYBACK mit 0x4. (3) localDevices.add fügt das initialisierte Gerät der Liste localDevices hinzu.

hdmi_cec_set_option:

Die Initialisierung ruft die HAL auf, um folgende CEC-Optionen zu aktivieren:

| Name | Beschreibung |
| --- | --- |
| HDMI_OPTION_WAKEUP | Bei false wecken Image View On/Text View On und andere Aufwecknachrichten das System nicht auf. Dieser Schalter hat in der Quellversion keine praktische Wirkung, da das Aufwecken des Systems per CEC nicht implementiert ist. |
| HDMI_OPTION_ENABLE_CEC | CEC-Hauptschalter. Bei false sendet und empfängt die HAL keine CEC-Nachrichten. Gesteuert durch den CEC-Hauptschalter in den Einstellungen. |
| HDMI_OPTION_SYSTEM_CEC_CONTROL | Beim Suspend auf false, beim Resume auf true setzen. False bedeutet, dass Android die Verarbeitung gemeldeter CEC-Nachrichten einstellt und systemnahe Software übernimmt. Derzeit ohne praktische Wirkung; eine zukünftige CEC-Aufweckfunktion könnte ihn verwenden. |

allocateLogicalAddress:

Weist hauptsächlich die logische Adresse zu.

(1) Ruft hdmi_cec_send_message der HAL auf, um POLL-Nachrichten zu senden. Erhalten alle Versuche NACK, wird diese Adresse ausgewählt. Die Anzahl der Versuche ist HdmiConfig.ADDRESS_ALLOCATION_RETRY.

(2) Ruft hdmi_cec_add_logical_address der HAL auf, um die ausgewählte Adresse an den Treiber zu übergeben.

(3) Nach der Zuweisung sendet onAddressAllocated mehrere CEC-Nachrichten, darunter ReportPhysicalAddress.

Dabei entsteht ein Unterschied zwischen den Abläufen. Die Zuweisung logischer CEC-Adressen erfordert POLL-Nachrichten: NACK bedeutet, dass die Adresse nicht belegt ist und ausgewählt werden darf.

Das Android-FRAMEWORK ruft hdmi_cec_send_message der HAL auf, um mehrere POLL-Nachrichten direkt zu senden. Wird keine bestätigt, wählt es die Adresse aus und übergibt sie erst danach an den Treiber. Der CEC-Kerneltreiber verlangt dagegen zunächst eine Initialisierung/Konfiguration, schließt die Adresszuweisung laut Quelle über IOCTL CEC_ADAP_S_PHYS_ADDR ab und meldet die Adresse nach oben. Zuvor untersagt er das direkte Senden von POLL über send_message. Der später detailliert beschriebene Ablauf der Quelle verwendet CEC_ADAP_S_LOG_ADDRS; diese Abweichung bleibt zur Überprüfung erhalten.

Die HAL vermittelt zwischen diesen unterschiedlichen Abläufen. Fordert FRAMEWORK über hdmi_cec_send_message ein POLL an, fragt die HAL mit CEC_ADAP_G_LOG_ADDRS die Kerneladresse ab. Ist keine Adresse zugewiesen (CEC_LOG_ADDR_INVALID), weist sie über CEC_ADAP_S_LOG_ADDRS eine zu. Stimmt die Kerneladresse mit der angefragten POLL-Adresse überein, gibt die HAL NACK zurück; andernfalls meldet sie Erfolg. FRAMEWORK fragt daraufhin die nächste Adresse ab, bis seine Auswahl mit der Kerneladresse übereinstimmt.

Ablauf der CEC-Initialisierung im Kernel:

![Technische Abbildung aus der chinesischen Quelle, S. 21](/docs/rockchip-hdmi-cec/assets/cn-p21-1.png)

Die HAL ruft cec_adap_s_log_addrs über IOCTL CEC_ADAP_S_LOG_ADDRS auf.

cec_claim_log_addrs startet cec_config_thread_func und wartet mit wait_for_completion(&adap->config_completion) auf den Abschluss.

```text
static void cec_claim_log_addrs(struct cec_adapter *adap, bool block)
{

   if (WARN_ON(adap->is_configuring || adap->is_configured))
      return;
   init_completion(&adap->config_completion);

   /* Ready to kick off the thread */

   adap->is_configuring = true;
   adap->kthread_config = kthread_run(cec_config_thread_func, adap,
                 "ceccfg-%s", adap->name);
   if (IS_ERR(adap->kthread_config)) {
      adap->kthread_config = NULL;
   } else if (block) {
      mutex_unlock(&adap->lock);
      wait_for_completion(&adap->config_completion);
      mutex_lock(&adap->lock);
   }
}
```

cec_config_thread_func reiht POLL über cec_transmit_msg_fh ein und sendet es. Wird keine Bestätigung empfangen, weist es diese Adresse zu.

Der Callback adap->ops->adap_log_addr ruft dw_hdmi_cec_log_addr auf, um die zugewiesene Adresse in die CEC-Register zu schreiben.

Die Initialisierung ist nun abgeschlossen (adap->is_configured=true). cec_post_state_event meldet die Änderung des Treiberzustands an höhere Schichten.

cec_msg_report_physical_addr erstellt eine report physical addr-Nachricht, reiht sie ein und sendet sie.

complete(&adap->config_completion) weckt den auf die Konfiguration wartenden Thread.

#### 2.3.2 Senden von CEC-Nachrichten

Das Senden aus der oberen Schicht ist einfach: Rufen Sie wie dargestellt sendCecCommand auf.

![Technische Abbildung aus der chinesischen Quelle, S. 22](/docs/rockchip-hdmi-cec/assets/cn-p22-1.png)

Zum Parameter HdmiCecMessage von sendCecCommand siehe:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

Kernelablauf:

![Technische Abbildung aus der chinesischen Quelle, S. 23](/docs/rockchip-hdmi-cec/assets/cn-p23-1.png)

Schließlich ruft die HAL cec_transmit des Treibers über IOCTL CEC_TRANSMIT auf.

```text
static long cec_transmit(struct cec_adapter *adap, struct cec_fh *fh,
         bool block, struct cec_msg __user *parg)
{

   struct cec_msg msg = {};
   long err = 0;

   if (!(adap->capabilities & CEC_CAP_TRANSMIT))
      return -ENOTTY;
   if (copy_from_user(&msg, parg, sizeof(msg)))
      return -EFAULT;

   /* A CDC-Only device can only send CDC messages */
   if ((adap->log_addrs.flags & CEC_LOG_ADDRS_FL_CDC_ONLY) &&
      (msg.len == 1 || msg.msg[1] != CEC_MSG_CDC_MESSAGE))
      return -EINVAL;


   mutex_lock(&adap->lock);
   if (adap->log_addrs.num_log_addrs == 0)
      err = -EPERM;
   else if (adap->is_configuring)
      err = -ENONET;
   else if (!adap->is_configured &&
      (adap->needs_hpd || msg.msg[0] != 0xf0))
      err = -ENONET;
   else if (cec_is_busy(adap, fh))
      err = -EBUSY;
   else
      err = cec_transmit_msg_fh(adap, &msg, fh, block);
   mutex_unlock(&adap->lock);
   if (err)

      return err;
   if (copy_to_user(parg, &msg, sizeof(msg)))
      return -EFAULT;
   return 0;
}
```

Zunächst wird durch mehrere Prüfungen festgestellt, ob der Treiber eine Nachricht senden kann. Anschließend fügt cec_transmit_msg_fh sie der Warteschlange ausstehender Sendungen hinzu. Nachrichtenstruktur:

```text
struct cec_msg {
      __u64 tx_ts;

      __u64 rx_ts;
      __u32 len;
      __u32 timeout;
      __u32 sequence;
      __u32 flags;
      __u8 msg[CEC_MAX_MSG_SIZE];
      __u8 reply;
      __u8 rx_status;
      __u8 tx_status;
      __u8 tx_arb_lost_cnt;
      __u8 tx_nack_cnt;
      __u8 tx_low_drive_cnt;
      __u8 tx_error_cnt;

};
```

Strukturfelder:

| Name | Beschreibung |
| --- | --- |
| tx_ts | Nach Abschluss des Sendens gesetzter Nanosekunden-Zeitstempel. |
| rx_ts | Nach Abschluss des Empfangs gesetzter Nanosekunden-Zeitstempel. |
| len | Nachrichtenlänge. |
| sequence | Vom Framework zugewiesene Sendesequenznummer zur Zuordnung von Antworten zu früheren Nachrichten. |
| msg | Speichert die Nutzdaten der CEC-Nachricht. |
| reply | Nur TX: Ein Wert ungleich null fordert das Warten auf eine Antwort an; beispielsweise erwartet give device power status ein report power status. Die Quellimplementierung setzt immer 0 und wartet innerhalb des Treibers nicht auf Antworten. |
| rx_status | Nach Abschluss gesetzter Empfangsstatus: CEC_RX_STATUS_OK, CEC_RX_STATUS_TIMEOUT, CEC_RX_STATUS_FEATURE_ABORT. |
| tx_status | Nach Abschluss gesetzter Sendestatus: CEC_TX_STATUS_OK, CEC_TX_STATUS_ARB_LOST, CEC_TX_STATUS_NACK, CEC_TX_STATUS_LOW_DRIVE, CEC_TX_STATUS_ERROR, CEC_TX_STATUS_MAX_RETRIES. |
| tx_arb_lost_cnt | Anzahl der Fehler Arbitration Lost nach dem Senden. |
| tx_nack_cnt | Anzahl der Fehler Not Acknowledged nach dem Senden. |
| tx_low_drive_cnt | Anzahl der Fehler Low Drive Detected nach dem Senden. |
| tx_error_cnt | Fehleranzahl nach dem Senden. |

cec_thread_func verwaltet die Sendewarteschlange. Wird gerade keine Nachricht gesendet, wartet der Thread auf neue Nachrichten.

```text
wait_event_interruptible(adap->kthread_waitq,
  kthread_should_stop ||
  (!adap->transmitting &&

   !list_empty(&adap->transmit_queue)));
```

Nachdem cec_transmit_msg_fh eine Nachricht eingereiht hat, weckt es cec_thread_func, sofern keine Übertragung läuft. Andernfalls wartet die Nachricht in der Warteschlange, bis die laufende Übertragung abgeschlossen ist.

```text
if (fh)
   list_add_tail(&data->xfer_list, &fh->xfer_list);
list_add_tail(&data->list, &adap->transmit_queue);
adap->transmit_queue_sz++;
if (!adap->transmitting)

   wake_up_interruptible(&adap->kthread_waitq);

/* All done if we don't need to block waiting for completion */
if (!block)
   return 0;

/*
* If we don't get a completion before this time something is really
* wrong and we time out.
*/
timeout = CEC_XFER_TIMEOUT_MS;
/* Add the requested timeout if we have to wait for a reply as well */

if (msg->timeout)
   timeout += msg->timeout;

/*
* Release the lock and wait, retake the lock afterwards.
*/
mutex_unlock(&adap->lock);
res = wait_for_completion_killable_timeout(&data->c,
                msecs_to_jiffies(timeout));
mutex_lock(&adap->lock);

if (data->completed) {
   /* The transmit completed (possibly with an error) */

   *msg = data->msg;
   kfree(data);
   return 0;
}
```

Der Callback adap->ops->adap_transmit ruft dw_hdmi_cec_transmit auf, um die CEC-Register zu programmieren und die Übertragung zu starten.

Nach Übertragungsende tritt ein CEC-Interrupt auf. dw_hdmi_cec_hardirq liest Register und hält den Erfolg oder den Fehlertyp in tx_status fest.

cec_transmit_done_ts sammelt Fehler und wiederholt die Übertragung bei Bedarf entsprechend attempts. Liegt kein Fehler vor, schließt cec_data_completed die Übertragung ab und weckt cec_thread_func für die nächste Nachricht.

#### 2.3.3 Empfangen von CEC-Nachrichten

![Technische Abbildung aus der chinesischen Quelle, S. 27](/docs/rockchip-hdmi-cec/assets/cn-p27-1.png)

Eine eingehende CEC-Nachricht löst einen Interrupt aus. dw_hdmi_cec_hardirq liest die CEC RX DATA-Register, um sie abzurufen.

cec_received_msg_ts prüft, ob die empfangene Nachricht verwendbar ist.

Sofern der Passthrough-Modus nicht aktiviert ist, antwortet cec_receive_notify automatisch entsprechend CEC. Die Quellimplementierung verwendet stets Passthrough; deshalb reiht sie die empfangene Nachricht mit cec_queue_msg_fh ein und weckt poll_wait, um den Benutzerraum zu benachrichtigen.

```text
 */
static void cec_queue_msg_fh(struct cec_fh *fh, const struct cec_msg *msg)

{
   static const struct cec_event ev_lost_msgs = {
      .event = CEC_EVENT_LOST_MSGS,
      .lost_msgs.lost_msgs = 1,
   };
   struct cec_msg_entry *entry;

   mutex_lock(&fh->lock);
   entry = kmalloc(sizeof(*entry), GFP_KERNEL);
   if (entry) {
      entry->msg = *msg;
      /* Add new msg at the end of the queue */
      list_add_tail(&entry->list, &fh->msgs);


      if (fh->queued_msgs < CEC_MAX_MSG_RX_QUEUE_SZ) {
         /* All is fine if there is enough room */
         fh->queued_msgs++;
         mutex_unlock(&fh->lock);
         wake_up_interruptible(&fh->wait);
         return;
      }
      /*
      * if the message queue is full, then drop the oldest one and

      * send a lost message event.
      */
      entry = list_first_entry(&fh->msgs, struct cec_msg_entry, list);
      list_del(&entry->list);
      kfree(entry);
   }
   mutex_unlock(&fh->lock);

   /*
   * We lost a message, either because kmalloc failed or the queue
   * was full.
   */

   cec_queue_event_fh(fh, &ev_lost_msgs, ktime_get_ns);
}
```

Wenn der Ereignisüberwachungsthread uevent_loop der HAL das Nachrichtenereignis empfängt, ruft er die eingereihten Nachrichten über IOCTL CEC_RECEIVE ab.

![Technische Abbildung aus der chinesischen Quelle, S. 28](/docs/rockchip-hdmi-cec/assets/cn-p28-1.png)

FRAMEWORK reicht die empfangenen Nachrichten durch die Schichten nach oben; onMessage verteilt schließlich jeden Opcode wie dargestellt an den zugehörigen Handler.

#### 2.3.4 Behandlung von CEC-Ereignissen

Der Treiber meldet Zustandsänderungen über folgende Ereignistypen:

| Name | Beschreibung |
| --- | --- |
| CEC_EVENT_STATE_CHANGE | Adapterzustand geändert, etwa von konfiguriert zu unkonfiguriert. |
| CEC_EVENT_LOST_MSGS | Nachrichtenverlust, weil die Empfangswarteschlange nicht rechtzeitig ausgelesen wurde. |
| CEC_EVENT_PIN_CEC_LOW | CEC-Pin wechselt auf Low; in der Quellversion ungenutzt. |
| CEC_EVENT_PIN_CEC_HIGH | CEC-Pin wechselt auf High; in der Quellversion ungenutzt. |
| CEC_EVENT_PIN_HPD_LOW | Laut Quelle wechselt HPD auf High, normalerweise beim Einstecken von HDMI. Dies widerspricht dem Ereignisnamen LOW und bleibt bis zur Überprüfung erhalten. |
| CEC_EVENT_PIN_HPD_HIGH | Laut Quelle wechselt HPD auf Low, normalerweise beim Abziehen von HDMI. Dies widerspricht dem Ereignisnamen HIGH und bleibt bis zur Überprüfung erhalten. |

HDMI-Hotplug-Beispiel:

![Technische Abbildung aus der chinesischen Quelle, S. 29](/docs/rockchip-hdmi-cec/assets/cn-p29-1.png)

Das Einstecken beziehungsweise Abziehen von HDMI löst einen HDMI-Interrupt aus. Dieser ruft cec_queue_pin_hpd_event auf, um ein HPD-CEC-Ereignis zu erzeugen.

cec_queue_event_fh reiht das Ereignis ein und weckt poll_wait, um es zu melden.

Die HAL ruft cec_dqevent über IOCTL CEC_DQEVENT auf, um das Ereignis abzurufen und die Benachrichtigung abzuschließen.

![Technische Abbildung aus der chinesischen Quelle, S. 30](/docs/rockchip-hdmi-cec/assets/cn-p30-1.png)

Die HAL behandelt unterschiedliche Ereignistypen getrennt; HPD wird weiter nach oben gereicht.

onHotplug übernimmt die abschließende Verarbeitung. Beim Einstecken ruft es allocateLogicalAddress auf, um die logische Adresse neu zuzuweisen. Der Ablauf entspricht im Wesentlichen §2.3.1.2 (die Quelle verweist irrtümlich auf §2.2.1.2).

### 2.4 Schnittstellen zum Ergänzen von CEC-Funktionen

Der ursprüngliche Android-Code unterstützt bereits zahlreiche CEC-Funktionen. Ergänzen Sie nicht unterstützte Funktionen über die folgenden Schnittstellen:

Auslösen einer CEC-Nachricht:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

```text
   /**
   * Transmit a CEC command to CEC bus.
   *

   * @param command CEC command to send out
   * @param callback interface used to the result of send command
   */
   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command, @Nullable SendMessageCallback
callback) {
      assertRunOnServiceThread;
      if (mMessageValidator.isValid(command) == HdmiCecMessageValidator.OK) {
         mCecController.sendCommand(command, callback);
      } else {
         HdmiLogger.error("Invalid message type:" + command);
         if (callback != null) {

           callback.onSendCompleted(SendMessageResult.FAIL);
         }
      }
   }

   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command) {
      assertRunOnServiceThread;
      sendCecCommand(command, null);
}
```

Erstellen Sie den Befehlsparameter HdmiCecMessage über die entsprechende Schnittstelle unter:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

```text
  @Override
   @ServiceThreadOnly
   protected void onStandby(boolean initiatedByCec, int standbyAction) {

      assertRunOnServiceThread;
      if (!mService.isControlEnabled || initiatedByCec || !mAutoTvOff) {
         return;
      }
      switch (standbyAction) {
         case HdmiControlService.STANDBY_SCREEN_OFF:
           Slog.e(TAG, "send standby eee");
           /* cec cts specification requires that standby message must be
broadcast */
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;

         case HdmiControlService.STANDBY_SHUTDOWN:
           // ACTION_SHUTDOWN is taken as a signal to power off all the
devices.
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;
      }
}
```

Damit die Box den Fernseher in Standby versetzt, verlangt CEC eine Standby-Nachricht. Das Beispiel ruft sendCecCommand mit einer durch HdmiCecMessageBuilder.buildStandby erstellten Nachricht auf.

Ergänzen der CEC-Nachrichtenverarbeitung:

Das System empfängt und meldet Nachrichten bereits. Fehlt ein Handler für eine eingehende Nachricht, ergänzen Sie ihn. Empfangene Nachrichten gelangen zu onMessage, wo message.getOpcode den Opcode ausliest und handlexxxxx-Funktionen die entsprechenden Nachrichten verarbeiten.

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java
```

```text
@ServiceThreadOnly
 protected final boolean onMessage(HdmiCecMessage message) {
    assertRunOnServiceThread;

    if (dispatchMessageToAction(message)) {
   return true;
}
switch (message.getOpcode) {

   case Constants.MESSAGE_ACTIVE_SOURCE:
      return handleActiveSource(message);
   case Constants.MESSAGE_INACTIVE_SOURCE:
      return handleInactiveSource(message);
   case Constants.MESSAGE_REQUEST_ACTIVE_SOURCE:
      return handleRequestActiveSource(message);
   case Constants.MESSAGE_GET_MENU_LANGUAGE:
      return handleGetMenuLanguage(message);
   case Constants.MESSAGE_SET_MENU_LANGUAGE:
      return handleSetMenuLanguage(message);
   case Constants.MESSAGE_GIVE_PHYSICAL_ADDRESS:
      return handleGivePhysicalAddress;

   case Constants.MESSAGE_GIVE_OSD_NAME:
      return handleGiveOsdName(message);
   case Constants.MESSAGE_GIVE_DEVICE_VENDOR_ID:
      return handleGiveDeviceVendorId;
   case Constants.MESSAGE_GET_CEC_VERSION:
      return handleGetCecVersion(message);
   case Constants.MESSAGE_REPORT_PHYSICAL_ADDRESS:
      return handleReportPhysicalAddress(message);
   case Constants.MESSAGE_ROUTING_CHANGE:
      return handleRoutingChange(message);
   case Constants.MESSAGE_ROUTING_INFORMATION:
      return handleRoutingInformation(message);
   case Constants.MESSAGE_INITIATE_ARC:

      return handleInitiateArc(message);
   case Constants.MESSAGE_TERMINATE_ARC:
      return handleTerminateArc(message);
   case Constants.MESSAGE_SET_SYSTEM_AUDIO_MODE:
      return handleSetSystemAudioMode(message);
   case Constants.MESSAGE_SYSTEM_AUDIO_MODE_STATUS:
      return handleSystemAudioModeStatus(message);
   case Constants.MESSAGE_REPORT_AUDIO_STATUS:
      return handleReportAudioStatus(message);
   case Constants.MESSAGE_STANDBY:
      return handleStandby(message);
   case Constants.MESSAGE_TEXT_VIEW_ON:

      return handleTextViewOn(message);
   case Constants.MESSAGE_IMAGE_VIEW_ON:
      return handleImageViewOn(message);
   case Constants.MESSAGE_USER_CONTROL_PRESSED:
      return handleUserControlPressed(message);
   case Constants.MESSAGE_USER_CONTROL_RELEASED:
      return handleUserControlReleased;
   case Constants.MESSAGE_SET_STREAM_PATH:
      return handleSetStreamPath(message);
   case Constants.MESSAGE_GIVE_DEVICE_POWER_STATUS:
      return handleGiveDevicePowerStatus(message);
   case Constants.MESSAGE_MENU_REQUEST:
      return handleMenuRequest(message);

   case Constants.MESSAGE_MENU_STATUS:
      return handleMenuStatus(message);
   case Constants.MESSAGE_VENDOR_COMMAND:
        return handleVendorCommand(message);
      case Constants.MESSAGE_VENDOR_COMMAND_WITH_ID:
        return handleVendorCommandWithId(message);

      case Constants.MESSAGE_SET_OSD_NAME:
        return handleSetOsdName(message);
      case Constants.MESSAGE_RECORD_TV_SCREEN:
        return handleRecordTvScreen(message);
      case Constants.MESSAGE_TIMER_CLEARED_STATUS:
        return handleTimerClearedStatus(message);
      case Constants.MESSAGE_REPORT_POWER_STATUS:
        return handleReportPowerStatus(message);
      case Constants.MESSAGE_TIMER_STATUS:
        return handleTimerStatus(message);
      case Constants.MESSAGE_RECORD_STATUS:
        return handleRecordStatus(message);

      default:
        return false;
   }
}
```

Fügen Sie daher dem switch den passenden Handler hinzu, um eine neue CEC-Nachricht zu unterstützen.

## 3. Gängige Verfahren zur Fehlersuche

Wenn CEC nicht korrekt funktioniert, gehen Sie bei der Fehlersuche in dieser Reihenfolge vor:

Führen Sie das Debug-Skript aus, um Zustände der Debug-Knoten und Protokolle zu erfassen.

Prüfen Sie anhand der Knotenzustände die korrekte Initialisierung und den normalen Betrieb.

Prüfen Sie die Kernelprotokolle, um erfolgreiches Senden und Empfangen von CEC-Nachrichten zu bestätigen.

Prüfen Sie die Android-Protokolle auf korrekte Verarbeitung der Funktionen.

### 3.1 Debug-Skript

CEC-Debug-Skript:

```text
#!/system/bin/sh

log ************start cec debug script**************

echo 2 > sys/module/cec/parameters/debug

if [ -f "/data/cec_status.txt" ]
then
rm /data/cec_status.log
fi

if [ -f "/data/cec_log.txt" ]
then
rm /data/cec_log.txt
fi
cat /sys/kernel/debug/cec/cec0/status >> /data/cec_status.txt
cat /sys/kernel/debug/dw-hdmi/ctrl >> /data/cec_status.txt


logcat -b all -f /data/cec_log.txt
```

Verwendung:

Übertragen Sie cec_debug.sh nach /system/bin.

Führen Sie ./system/bin/cec_debug.sh aus, bevor Sie den Fehler reproduzieren; der relative Pfad der Quelle bleibt erhalten.

Die Protokollmarkierung ****start cec debug script****** kennzeichnet den Start des Skripts.

Führen Sie die Schritte aus, die den Fehler reproduzieren.

Der Zustand der CEC-Debug-Knoten wird unter /data/cec_status.txt gespeichert.

Synchronisierte Kernel- und logcat-Ausgaben werden unter /data/cec_log.txt gespeichert.

#### 3.1.1 Verstehen der Protokolle

Das Skript erfasst Zustände der Debug-Knoten und Protokolle. Einzelheiten zu den Knoten stehen in §3.1.2. Beachten Sie insbesondere diese drei Protokollkategorien:

Nachrichten mit cec-dw_hdmi sind Kernelprotokolle:

```text
04-11 11:44:50.969 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
```

Manuell lassen sie sich so erfassen:

```text
dmesg | grep cec-dw_hdmi
```

Nachrichten mit hdmicec sind HAL-Protokolle:

```text
04-11 12:39:59.015 281 281 I hdmicec : hdmi_cec_set_option: system_control:
value: 0
```

Manuell lassen sie sich so erfassen:

```text
logcat | grep hdmicec
```

Nachrichten mit Hdmi sind Framework-Protokolle:

```text
04-11 11:44:50.565 391 494 W HdmiCecController: Failed to send <Give Device
Power Status> src: 4, dst: 0 with errorCode=-1
```

Manuell lassen sie sich so erfassen:

```text
logcat | grep Hdmi
```

Beispiele zur Protokollanalyse finden Sie in §3.2.

#### 3.1.2 CEC-Debug-Knoten

Pfad des CEC-Status-Debug-Knotens:

```text
/sys/kernel/debug/cec/cec0/status
```

Das Auslesen mit cat ergibt:

![Technische Abbildung aus der chinesischen Quelle, S. 35](/docs/rockchip-hdmi-cec/assets/cn-p35-1.png)

```text
configured: 0
configuring: 0
phys_addr: f.f.f.f
number of LAs: 1
LA mask: 0x0000
has CEC follower (in passthrough mode)
pending transmits: 0
```

Parameterbeschreibungen:

| Name | Beschreibung |
| --- | --- |
| configured | 1: korrekt konfiguriert. 0: nicht korrekt konfiguriert. |
| configuring | 1: Konfiguration läuft. 0: nicht gestartet oder abgeschlossen. |
| phys_addr | Aus dem TV-EDID gelesene physische Adresse. f.f.f.f bedeutet nicht initialisiertes CEC oder fehlgeschlagene Adressermittlung. |
| LA mask | Maske der logischen Adresse: vor der Initialisierung 0x0000. Die Verschiebung, die 0x1 ergibt, kennzeichnet die Adresse; beispielsweise bedeutet 0x0010 >> 4 = 0x1 die logische Adresse 0x4. |
| has CEC follower (in passthrough mode) | Der CEC-Treiber verarbeitet Nachrichten nicht direkt. |
| pending transmits | Anzahl der auf Übertragung wartenden CEC-Nachrichten. |

Registerknoten des HDMI-Controllers:

```text
/d/dw-hdmi/ctrl
```

cat auf diesem Knoten zeigt die Register des HDMI-Controllers an. Prüfen Sie die CEC-bezogenen Register und ziehen Sie für ihre Definitionen das Datenblatt des HDMI-Controllers heran.

#### 3.1.3 Aktivieren der CEC-Kernelprotokolle

```text
echo 2 > /sys/module/cec/parameters/debug
```

Aktiviert Protokolle zum Senden und Empfangen von CEC-Nachrichten.

```text
echo 1 > /sys/module/cec/parameters/debug
```

Aktiviert weitere CEC-Protokolle.

### 3.2 Beheben häufiger Fehler

#### 3.2.1 Sämtliche CEC-Funktionen fallen aus

Führen Sie diese Prüfungen auch dann durch, wenn nur einzelne CEC-Funktionen ausfallen.

Prüfen Sie, ob der CEC-Schalter unter Einstellungen/Eingang aktiviert ist.

Suchen Sie in den Protokollen nach hdmi_cec_device_open open error! und führen Sie ls -l /dev/cec0 aus.

```text
130|rk3328_box:/ # ls -l /dev/cec0

crw-rw---- 1 system system 250, 0 2016-01-21 08:50 /dev/cec0
```

Prüfen Sie, ob cec0 mindestens die gezeigten Berechtigungen besitzt. Sind diese unzureichend, prüfen Sie die folgende Änderung:

```text
diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index a7d1356..9eb824d 100755

--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -96,6 +96,7 @@

 #for hdmi cec
 /dev/cec 0666 system system
+/dev/cec0 0660 system system
 #sofia
 /dev/dcc 0666 system system
 /dev/pmem_gfx 0666 system system
```

Prüfen Sie /sys/kernel/debug/cec/cec0/status auf einen normalen Zustand (§3.1.2; die Quelle verweist auf §3.1.1 und trennt das Wort status). Typische Fehler folgen:

(1) phys_addr=f.f.f.f: Prüfen Sie das Auslesen von EDID und die CEC-Unterstützung des Fernsehers. (2) LA mask=0x0000: Die Zuweisung einer logischen Adresse ist fehlgeschlagen. Suchen Sie zunächst nach:

```text
04-11 08:56:51.764 296 296 E hdmicec : can't make kernel addr done
```

Falls vorhanden, prüfen Sie das korrekte Auslesen von EDID. Andernfalls suchen Sie nach:

```text
04-11 08:56:51.764 296 296 D hdmicec : kernel logic addr:ff, preferred logic
addr:04
04-11 08:56:51.764 296 296 I hdmicec : kernel logaddr is not existing

04-11 08:56:51.764 296 296 D hdmicec : set_kernel_logical_address, logic
addr:04
```

logic addr muss nicht 04 sein, aber einer der Werte 04, 08 oder 0b. Fehlt dieses Protokoll, verfolgen Sie den Code unter:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

Sobald das obige Protokoll vorhanden ist, prüfen Sie auf:

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: new physical address 3.0.0.0
04-11 08:35:37.297 0 0 I cec-dw_hdmi: physical address: 3.0.0.0, claim 1

logical addresses
```

Falls nicht vorhanden, verfolgen Sie cec_adap_s_log_addrs unter:

```text
Kernel/drivers/media/cec/cec-api.c
```

Prüfen Sie anschließend diese Protokolle. 44 in der ersten Zeile ist die POLL-Adresse; sie kann auch 88 oder bb lauten, und Protokolle für alle drei Werte können auftreten. Vergleichen Sie die Anzahl der am Fernseher angeschlossenen CEC-Geräte mit den Adressen; den vollständigen Ablauf beschreibt das CEC-Kapitel der HDMI-Spezifikation. Prüfen Sie status in der zweiten Zeile. Ist die Adresse nachweislich frei, status jedoch nicht 04 (NACK), analysieren Sie die Register des HDMI-Controllers gemeinsam mit dem CEC-Signalverlauf.

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
04-11 08:35:37.326 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 04
```

#### 3.2.2 Fernseher geht in Standby, aber die Box bleibt aktiv

Android deaktiviert standardmäßig den durch CEC ausgelösten Standby der Box. Setzen Sie persist.sys.hdmi.keep_awake auf false oder ändern Sie dessen Standardwert wie folgt auf false:

```text
diff --git
--- a/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java

+++ b/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
@@ -210,7 +210,7 @@
   private ActiveWakeLock getWakeLock {
      assertRunOnServiceThread;
      if (mWakeLock == null) {
-        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
true)) {
+        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
false)) {
            mWakeLock = new SystemWakeLock;
         } else {
            // Create a dummy lock object that doesn't do anything about
wake lock,
```

Prüfen Sie in den erfassten Protokollen, ob die Box standby (0x36) empfangen hat:

```text
[ 3465.670484] cec-dw_hdmi: cec_received_msg_ts: 0f 36
[ 3465.670617] cec-dw_hdmi: cec_receive_notify: 0f 36
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_received_msg_ts: 0f 36

04-11 09:16:32.963 299 342 D hdmicec : poll revent:41
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_receive_notify: 0f 36
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[0]:0f
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[1]:36
```

Falls nicht, prüfen Sie mit einem Oszilloskop am CEC-Bus, ob der Fernseher tatsächlich standby gesendet hat.

#### 3.2.3 Box geht in Standby, aber der Fernseher bleibt aktiv

Tritt dies unmittelbar nach dem Einschalten des Fernsehers auf, warten Sie 15 Sekunden und versuchen Sie es erneut. Manche Fernseher ignorieren Standby-Nachrichten für kurze Zeit nach dem Einschalten.

Prüfen Sie diese Protokolle, um den Standby-Ablauf zu bestätigen:

```text
04-11 08:37:13.823 394 394 V HdmiControlService: On standby-action cleared:4
04-11 08:37:13.823 394 394 V HdmiControlService: onStandbyCompleted

04-11 08:37:13.927 296 296 I hdmicec : send msg LEN:2,opcode:36,addr:4f
```

Fehlen sie oder erscheinen nur die ersten beiden Zeilen, verfolgen Sie den Code unter:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

Prüfen Sie anschließend diese Protokolle, um das erfolgreiche Senden der Standby-Nachricht zu bestätigen:

```text
04-11 08:37:13.928 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 36
04-11 08:37:13.991 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

Falls sie fehlen, prüfen Sie, ob hdmi_cec_send_message unter folgendem Pfad korrekt aufgerufen wird und IOCTL CEC_TRANSMIT erfolgreich aufruft:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

Erscheinen beide Protokolle, ist cec_transmit_done_ts status jedoch nicht 01, ist beim Senden ein CEC-Busfehler aufgetreten. Analysieren Sie die Register des HDMI-Controllers und die CEC-Signale gemeinsam.

#### 3.2.4 Box wacht auf, aber der Fernseher nicht

Prüfen Sie, ob die Box normal aus Suspend zurückkehrt, und prüfen Sie die CEC-Initialisierung wie in §3.2.1.

Prüfen Sie, ob die CEC-Aufwecknachricht erfolgreich gesendet wurde:

```text
04-11 09:27:37.540 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 40 0d
04-11 09:27:37.593 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
04-11 09:27:37.594 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 82 30 00

04-11 09:27:37.707 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

Erscheinen beide Protokolle, schlägt das Senden aber fehl (status ist nicht 01), analysieren Sie die Register des HDMI-Controllers und die CEC-Signale. Fehlen sie, verfolgen Sie den Sendeablauf von ActiveSource und TextViewOn ausgehend von onAddressAllocated unter:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
```

#### 3.2.5 TV-Fernbedienung kann die Benutzeroberfläche der Box nicht steuern

TV-Marken und -Modelle unterscheiden sich erheblich; daher gibt es keine universelle Lösung. Die folgenden erfahrungsbasierten Empfehlungen gelten möglicherweise nicht für jeden Fernseher.

Prüfen Sie, ob eine eigene CEC-Eingangsquelle vorhanden ist. Bei manchen Samsung-Fernsehern muss für diese Funktion auf den Anynet-Eingang umgeschaltet werden.

Senden Sie ActiveSource, nachdem der Fernseher einen stabilen Betriebszustand erreicht hat, beispielsweise über die Systemschnittstelle onetouchplay:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/OneTouchPlayAction.java
```

## 4. Referenzen

HDMISpecification1_4b.pdf

RockchipAndroid5.x_HDMI_CEC_软件说明.doc (Dateiname der Quelle)

[HDMI-CEC-Steuerdienst (Android-Dokumentation)](https://source.android.google.cn/devices/tv/hdmi-cec)

{% endraw %}

