---
title: "Rockchip Linux 4.19: USB-Gadget-UVC-Fehlersuche"
description: "Rockchip Linux 4.19: USB-Gadget-UVC-Fehlersuche — V1.0.0"
excerpt: "Rockchip Linux 4.19: USB-Gadget-UVC-Fehlersuche"
translation_key: "170-rockchip-linux419-usb-gadget-uvc"
slug: "170-rockchip-linux419-usb-gadget-uvc"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UVC, Linux, Gadget]
---

{% raw %}

# Rockchip Linux 4.19: USB-Gadget-UVC-Fehlersuche

ArmSoM-Plattformreferenz nach dem chinesischen RK-PC-YF-165 V1.0.0: RK1808, RK3399, RV1109, RV1126 und RK356X mit Linux 4.19. Konkrete ArmSoM-Platine, BSP, USB-Device-Port und UVC-SDK prüfen. Nicht für sämtliche Kernel und keine pauschale Platinenunterstützung. Keine englische Quelle vorhanden; Englisch, Russisch und Deutsch sind vollständige Übersetzungen mit den drei chinesischen PDF-Abbildungen. Quellenmessungen sind keine ArmSoM-Testergebnisse. Keine Befehle ausgeführt, keine Hardware getestet.

Voraussetzungen: Entfernen/Neuverknüpfen in ConfigFS und bind/unbind unterbrechen aktive Gadget-Dienste. Das nummerierte Wiederherstellungsverfahren ist Quellentext, kein direkt ausführbares Shellskript; zuerst Gerätenamen und Konfiguration prüfen. Die Patchkennung bleibt erhalten und muss im tatsächlichen SDK geprüft werden. Keine Garantie für neuere Kernel.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. UVC-Kommunikationsablauf unter Linux 4.19

Abbildung 1 zeigt den UVC-Datenfluss unter Linux 4.19. Links stehen die UVC-Module der USB-Device-Seite mit ihren Kernel-Codepfaden, rechts die entsprechenden USB-Host-Module. Dieses Handbuch behandelt die Fehlersuche auf der Device-Seite. Die Verfahren basieren auf Rockchip Linux 4.19, gelten nicht für jede Kernelversion und behandeln keine Fehler in UVC-Anwendungen.

![Technische Abbildung der chinesischen Quelle](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p004-figure-01.png)

Abbildung 1. UVC-Kommunikationsablauf unter Linux 4.19.

## 2. Übliche UVC-Debuggingverfahren

### 2.1 USB-Protokollanalysator

Ein USB-Protokollanalysator erfasst den Busverkehr in Echtzeit zur Paket- und Protokollanalyse. Abbildung 2 zeigt eine typische USB-2.0-Verbindung: Analysator zwischen Device und Host einschleifen und die zugehörige Software auf dem Rechner installieren. Dies ist die direkteste und wirksamste Methode zur Eingrenzung auf Device oder Host.

![Technische Abbildung der chinesischen Quelle](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p005-figure-01.png)

Abbildung 2. Anschluss des USB-Analysators. Er hilft bei folgenden UVC-Problemen:

1. Vorschau lässt sich nicht öffnen.

2. Verzögerte Vorschau.

3. Eingefrorene Vorschau.

4. Bildratenstatistik und Auswertung der Bilddaten.

5. Fehler beim Laden des UVC-Treibers.

Ein USB-Protokollanalysator eignet sich nicht für folgende Probleme:

1. USB-Signalqualität.

2. Unerwartete UVC-Trennung.

3. EMI-Fehler des USB-Controllers während der UVC-Kommunikation.

Für Signal-, Trennungs- und EMI-Probleme ein breitbandiges Oszilloskop verwenden: USB-Augendiagramm, High-Speed-Handshake und VBUS-Spannungseinbrüche messen.

### 2.2 Werkzeuge zur USB-Aufzeichnung und Analyse

Diese Werkzeuge laufen auf einem Computer und überwachen USB-Busdaten. Sie ersetzen keinen Analysator zur Beobachtung sämtlicher Transaktionen, reichen aber für viele Anwendungen aus.

#### 2.2.1 Windows-Werkzeuge

Bus Hound erfasst USB-Verkehr und ist einfach einzurichten, bietet aber keine detaillierte, anschauliche Protokollauswertung. Wireshark analysiert genauer, einschließlich UVC PROBE_CONTROL(SET_CUR) und COMMIT_CONTROL(SET_CUR). Usbview zeigt detaillierte Gerätedeskriptoren; Downloadadresse der Quelle: www.uwe-sieber.de.

#### 2.2.2 Linux-Werkzeuge

usbmon zeichnet USB-Verkehr auf; vusb-analyzer wertet usbmon-Aufzeichnungen aus; lsusb zeigt detaillierte USB-Gerätedeskriptoren.

#### 2.2.3 macOS-Werkzeuge

Wireshark zeichnet USB-Busverkehr auf.

### 2.3 UVC-Debugschnittstellen im Kernel

#### 2.3.1 USB-DWC2-OTG-Controllerschnittstelle

`/sys/kernel/debug/[dwc2_controller_base_addr].usb`

Beispiel: Linux 4.19 RK3328 DWC2 OTG [1].

```text
rk3328_box:/sys/kernel/debug/ff580000.usb # ls
ep0   ep2out ep4out ep6out ep8in  ep9in  fifo    state
ep1in ep3in  ep5in  ep7in  ep8out ep9out regdump testmode
```

`ep*in/out`: Endpunktstatus im Device-Modus. `fifo`: Hardware-FIFO-Konfiguration mit RXFIFO Size, NPTXFIFO Size und TXFIFO Size je Endpunkt. `state`: Interrupt-MASK sowie Steuer-/Konfigurationsregister im Device-Modus. `regdump`: sämtliche Controllerregister. `testmode`: USB-Testmodus, hauptsächlich für Augendiagramme.

#### 2.3.2 USB-DWC3-OTG-Controllerschnittstelle

`/sys/kernel/debug/[dwc3_controller_base_addr].dwc3`

Beispiel: Linux 4.19 RV1109/RV1126 DWC3 OTG [1–4].

```text
[root@RV1126_RV1109:/sys/kernel/debug/ffd00000.dwc3]# ls
ep0in   ep1in   ep2in   ep3in   ep4in   ep5in   ep6in       lsp_dump  regdump
ep0out  ep1out  ep2out  ep3out  ep4out  ep5out  link_state  mode      testmode
```

Übliche Knoten: `regdump` zeigt Controllerregister einschließlich TXFIFOSIZ je Endpunkt; `link_state` zeigt den USB3-Linkstatus; `mode` den Betriebsmodus; `testmode` aktiviert den HighSpeed-Testmodus für Augendiagramme.

Der DWC3-Treiber implementiert außerdem Tracepoints des Kernel-Trace-Frameworks [5] zur dynamischen Aktivierung und Aufzeichnung wichtiger Informationen. Folgende Kerneloptionen aktivieren:

```text
Kernel hacking  --->
    [*] Tracers  --->
        [*]   Trace process context switches and events
        [*]   Enable uprobes-based dynamic events
        [*]   Trace gpio events
```

DWC3 bietet folgende Trace-Ereignisse:

```text
/sys/kernel/debug/tracing/events/dwc3# ls
dwc3_alloc_request  dwc3_event              dwc3_gadget_generic_cmd  enable
dwc3_complete_trb   dwc3_free_request       dwc3_gadget_giveback     filter
dwc3_ctrl_req       dwc3_gadget_ep_cmd      dwc3_prepare_trb
dwc3_ep_dequeue     dwc3_gadget_ep_disable  dwc3_readl
dwc3_ep_queue       dwc3_gadget_ep_enable   dwc3_writel
```

Zur Verwendung siehe `/sys/kernel/debug/tracing/README`.

#### 2.3.3 USB-UDC-Core-Schnittstelle

UDC-Core-Tracepoints verfolgen den USB-Request-Datenfluss zwischen UVC Function Driver und USB Controller Driver. Kernel-Tracing wie im DWC3-Abschnitt aktivieren. Verfügbare Ereignisse:

```text
/sys/kernel/debug/tracing/events/gadget# ls
enable                usb_ep_free_request           usb_gadget_disconnect
filter                usb_ep_queue                  usb_gadget_frame_number
usb_ep_alloc_request  usb_ep_set_halt               usb_gadget_giveback_request
usb_ep_clear_halt     usb_ep_set_maxpacket_limit    usb_gadget_set_selfpowered
usb_ep_dequeue        usb_ep_set_wedge              usb_gadget_vbus_connect
usb_ep_disable        usb_gadget_activate           usb_gadget_vbus_disconnect
usb_ep_enable         usb_gadget_clear_selfpowered  usb_gadget_vbus_draw
usb_ep_fifo_flush     usb_gadget_connect            usb_gadget_wakeup
usb_ep_fifo_status    usb_gadget_deactivate
```

Siehe `/sys/kernel/debug/tracing/README`. Besonders wichtig sind die Request-Ereignisse `usb_ep_alloc_request`, `usb_ep_free_request`, `usb_ep_queue` und `usb_ep_dequeue`.

#### 2.3.4 UVC-Treiberschnittstelle

Der UVC-Function-Treiber bietet eine Systemmodul-Schnittstelle zur dynamischen Verfolgung von Control Requests: `/sys/module/usb_f_uvc/parameters/trace`. Standardmäßig deaktiviert; einschalten mit `echo 4 > /sys/module/usb_f_uvc/parameters/trace`. Meldungen haben KERN_DEBUG und sind mit `dmesg` lesbar. Das folgende Quellenbeispiel zeigt den RV1109-Vorschaustart:

```text
[root@RV1126_RV1109:/]# dmesg
[  426.441316] uvcvideo: setup request a1 81 value 0100 index 0003 001a
[  426.450280] uvcvideo: uvc_send_response: req len 26
[  426.450444] uvcvideo: event_setup_out 0, data len 26
[  426.451545] uvcvideo: setup request 21 01 value 0100 index 0003 001a
[  426.460862] uvcvideo: uvc_send_response: req len 26
[  426.461014] uvcvideo: event_setup_out 1, data len 26
[  426.461173] uvcvideo: setup request a1 81 value 0100 index 0003 001a
[  426.485791] uvcvideo: uvc_send_response: req len 26
[  426.486672] uvcvideo: event_setup_out 0, data len 26
[  426.487145] uvcvideo: setup request a1 83 value 0100 index 0003 001a
[  426.496529] uvcvideo: uvc_send_response: req len 26
[  426.496655] uvcvideo: event_setup_out 0, data len 26
[  426.497485] uvcvideo: setup request a1 82 value 0100 index 0003 001a
[  426.506737] uvcvideo: uvc_send_response: req len 26
[  426.507195] uvcvideo: event_setup_out 0, data len 26
```

#### 2.3.5 V4L2-Schnittstelle

Linux-4.19-UVC verwendet V4L2 für queue buf/dequeue buf mit der Anwendung. V4L2-Tracepoints verfolgen queue buf, dequeue buf und buf done. Tracing wie im DWC3-Abschnitt aktivieren. Ereignisse:

```text
/sys/kernel/debug/tracing/events/vb2# ls
enable  filter  vb2_buf_done  vb2_buf_queue  vb2_dqbuf  vb2_qbuf

/sys/kernel/debug/tracing/events/v4l2]# ls
enable  v4l2_dqbuf  vb2_v4l2_buf_done   vb2_v4l2_dqbuf
filter  v4l2_qbuf   vb2_v4l2_buf_queue  vb2_v4l2_qbuf
```

Verwendung siehe `/sys/kernel/debug/tracing/README`.

#### 2.3.6 Geräteverbindungsstatus

Aktuelle Enumerationsgeschwindigkeit: `/sys/class/udc/[usb_controller_name]/current_speed`. Zustand (z. B. not attached/configured): `/sys/class/udc/[usb_controller_name]/state`. Platzhalter durch den tatsächlichen USB-Device-Controllernamen des Chips ersetzen.

#### 2.3.7 Dynamische Controller-Neuinitialisierung

Schnittstellen: `/sys/bus/platform/drivers/[usb_controller_name]/bind` und `unbind`; tatsächlichen Namen einsetzen. Kann sich eine gestörte Übertragung nicht selbst erholen, hilft eine manuelle Neuinitialisierung bei der Eingrenzung auf den Controller. Es folgt das Wiederherstellungsverfahren des RV1109/RV1126-UVC-SDK:

```text
1. kill uvc_app /* 杀掉 uvc 应⽤*/
2. rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/f* /* 移除已绑定的 usb function */
3. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/unbind /* unbind usb 控制器 */
4. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/bind /* bind usb 控制器 */
5. cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1 /* 绑定 usb function */
   ln -s ../../functions/rndis.gs0 f1
   ln -s ../../functions/uvc.gs6/ f2
6. echo ffd00000.dwc3 > /sys/kernel/config/usb_gadget/rockchip/UDC /* 使能 usb 控制器连接 */
7. restart uvc_app /* 重新启动 uvc 应⽤ */
```

#Die sieben Quellenschritte: UVC-Anwendung stoppen; gebundene Funktionslinks entfernen; Controller lösen; erneut binden; RNDIS/UVC-Links wiederherstellen; UDC aktivieren; Anwendung neu starten. Die ursprünglichen Kommentare im obigen Code bleiben erhalten.

### 2.3.8 USB Gadget ConfigFS

Linux 4.19 implementiert und konfiguriert die UVC-Funktion über ConfigFS. Dokumentation zu ConfigFS Gadgets:

```text
Documentation/ABI/testing/configfs-usb-gadget-xxxx.txt
Documentation/filesystems/configfs/configfs.txt
Documentation/usb/gadget_configfs.txt
Documentation/usb/gadget-testing.txt
```

Siehe außerdem Kernel USB Gadget Configfs Interface. Beispiel des RV1109/RV1126-UVC-SDK:

```text
[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip]# ls
UDC              bDeviceSubClass  bcdUSB     idProduct  strings
bDeviceClass     bMaxPacketSize0  configs    idVendor
bDeviceProtocol  bcdDevice        functions  os_desc

[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip/functions/uvc.gs6]#
control    streaming_bulk      streaming_maxburst   uvc_num_request
streaming  streaming_interval  streaming_maxpacket
```

Wichtige Parameter: `uvc_num_request` bestimmt die Anzahl von Requests/Puffern zwischen UVC- und USB-Controllertreiber; `streaming_maxpacket` die Paketgröße je USB-2.0-Mikroframe, maximal 3072; `streaming_bulk` wählt Bulk statt des standardmäßigen isoc.

### 2.4 Fehlersuche bei üblichen UVC-Problemen

#### 2.4.1 Treiber lässt sich nicht laden

Ladefehler treten meist unter Windows in zwei Varianten auf:

1. Meldet Windows ein unbekanntes USB-Gerät, kann die Signalqualität ursächlich sein. Zunächst ein anderes USB-Kabel testen, anschließend bei Bedarf das Augendiagramm mit einem Oszilloskop untersuchen.

2. Wird das Gerät nicht als unbekannt gemeldet, zeigt der Geräte-Manager aber ein gelbes Ausrufezeichen bei UVC, erfüllen die Composite-Deskriptoren meist nicht die Windows-Anforderungen. UVC lässt sich mit RNDIS, ADB und UAC kombinieren, doch die ConfigFS-Reihenfolge (`ln -s`) ist einzuhalten: bei UVC/RNDIS/ADB RNDIS, UVC, ADB, damit RNDIS zuerst steht; bei UVC/UAC UAC, UVC. Andernfalls kann der Windows-Treiber nicht geladen werden.

#### 2.4.2 Unerwartete Trennung

Drei häufige Ursachen:

1. Spannungseinbruch an USB VBUS oder OTG_VBUS. Unterhalb der PHY-Bvalid-Schwelle löst der PHY disconnect aus. VBUS mit dem Oszilloskop in Echtzeit überwachen. Bei DWC3-Geräten wie RV1109/RV1126/RK1808/RK3399/RK356X weist `dwc3 ffd00000.dwc3: dwc3 device disconnect` im seriellen Log während des Ereignisses auf diese Problemklasse hin.

Den Spannungseinbruch durch Schaltungsänderung beheben. Softwareseitig kann die Leistungsaufnahme unter Last reduziert oder die PHY-Bvalid-Schwelle angepasst werden; RV1109/RV1126 unterstützen diese Schwellenanpassung nicht.

2. Die Device-Anwendung konfiguriert/aktiviert USB erneut über ConfigFS. `/sys/kernel/config/usb_gadget/rockchip/UDC` steuert den Controller direkt über `udc_start()`/`udc_stop()` und trennt UVC ohne PHY-disconnect-Signal. Anwendungslogik prüfen; USB während der UVC-Kommunikation nicht neu konfigurieren/aktivieren.

3. Der Host trennt UVC aktiv. Host-Verhalten mit Analysator oder Host-Aufzeichnung und Host-Logs untersuchen.

#### 2.4.3 Vorschau startet nicht

Fünf häufige Ursachen:

1. Fehlgeschlagener High-Speed-Handshake. UVC benötigt high-speed oder super-speed; ein signalbedingter Rückfall auf full-speed verhindert die Vorschau. Auf `configfs-gadget gadget: full-speed config #1: b` im Enumerationslog prüfen oder die Statusschnittstelle abfragen. Handshake mit dem Oszilloskop analysieren und die Hardwareursache beheben.

2. Fehlerhafte Bandbreitenaushandlung per probe control/commit control. Vor der Vorschau handeln Host und Device die Bandbreite aus [6], siehe Abbildung 3.

![Technische Abbildung der chinesischen Quelle](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p012-figure-01.png)

Abbildung 3. Parameteraushandlung: (1) Host sendet gewünschte Einstellungen (PROBE). (2) Device passt sie an seine Fähigkeiten an und antwortet (PROBE). (3) Host bestätigt mit COMMIT. (4) Device setzt Format, Auflösung und Bandbreite.

Quellenbeispiel: macOS 10.14 und älter funktionieren nicht mit der RV1109-Konfiguration 3KB/Mikroframe. Analysator oder Wireshark zeigen wMaxPacketSize = 3 * 1024 bytes im Endpunktdeskriptor, aber dwMaxPayloadTransferSize = 1024 in der Antwort auf PROBE_CONTROL(GET_CUR). macOS fordert daher 1KB/Mikroframe an; die Vorschau scheitert. Probe-Antwort und Mikroframe-Deskriptor müssen übereinstimmen. RV1109 UVC APP verwendet standardmäßig 1024. Die Anwendung muss die tatsächliche maximale Endpunktpaketgröße lesen und bei PROBE_CONTROL(GET_CUR) dwMaxPayloadTransferSize = 3072 zurückgeben.

3. USB-Controllerfehler. Der Device-Controller überträgt Steueranfragen und Video zum Host; ein Fehler verhindert die Vorschau. Fehlerhaften Busverkehr aufzeichnen und mit dem Treibercode abgleichen. Ist ein Analysator unpraktisch, Controller-Tracing über die Kernel-UVC-Schnittstellen aktivieren und Registerzustände beim Fehler prüfen.

Siehe die Abschnitte zu USB DWC2 OTG und USB DWC3 OTG.

4. Die Device-Anwendung verarbeitet Class Requests fehlerhaft. Der Kernel leitet Host-Anfragen per V4L2-Ereignis an die Anwendung weiter. Diese analysiert sie und antwortet per ioctl über den UVC-Treiber. Fehler können die Enumeration verhindern. Der Analysator allein zeigt nur die fehlende Antwort, unterscheidet aber nicht Anwendung und Controller. UVC-Control-Request-Tracing aktivieren: Fehlt nach `setup request` ein `uvc_send_response`, liegt das Problem in der Anwendung. Die Class-Request-Verarbeitung für korrekte und rechtzeitige Antworten korrigieren.

5. Host-Fehler. Alle USB-2.0-Transaktionen werden vom Host gestartet; das Device sendet nicht selbstständig. Fehlt streaming-on SetInterface oder folgen keine IN-Pakete zum Streaming-Endpunkt, werden keine Bilder übertragen. Vollständige Transaktionen mit Analysator erfassen. Ohne Analysator Host-Aufzeichnungswerkzeuge verwenden; bei DWC3 (RV1109/RV1126/RK1808/RK3399/RK356X) zusätzlich Device-Treiberinformationen über die Debugschnittstelle erfassen. Host-Reparaturen liegen außerhalb dieses Handbuchs.

#### 2.4.4 Eingefrorene Vorschau

Einfrieren hängt stark vom Szenario ab; Reproduktion und Debugaufbau sind schwierig. Sichtbar liefert der USB-Controller keinen kontinuierlichen Bildstrom mehr, muss aber nicht die Ursache sein. Den konkreten Fall untersuchen. Drei häufige Ursachen:

1. Fehler im Bildkodierungsmodul des Device.

2. Fehlerhaftes queue buf/dequeue buf der Anwendung; dem UVC-Treiber fehlen eingereihte Puffer.

3. UVC-Controllerfehler.

Bei Ursache 2 und 3 queue buf, dequeue buf und buf done über V4L2 verfolgen, den Controllertreiber über UDC core und DWC3. Es gibt keine allgemeine Lösung. Falls keine wirksame Korrektur verfügbar ist, kann die dynamische Neuinitialisierung zur Wiederherstellung dienen.

#### 2.4.5 Vorschauverzögerung

Der UVC-Bildpfad ist lang; jedes Modul kann Verzögerung hinzufügen. Zunächst den vollständigen Start-Bildstrom mit einem Analysator erfassen. Liegt die Ursache auf der Device-Seite, jede Stufe separat messen: Sensor -&gt; ISP -&gt; UVC APP -&gt; V4L2 -&gt; UVC-Treiber -&gt; USB-Device-Controller.

1. Der Treiber überträgt einen ersten Frame voller Nullen. Die Anwendung reiht beim Start eventuell vor Bildbereitschaft einen Puffer mit bytesused = 0 ein. V4L2 ersetzt dies standardmäßig durch die aus der Auflösung berechnete Framegröße; der Controller sendet dann einen Null-Frame. Das kostet Zehn- bis Hunderte Millisekunden. Rockchip-Device-Controller können Pakete der Länge null senden; allow_zero_bytesused = 1 im UVC-Treiber vermeidet den Null-Frame. Es folgt der Linux-4.19-Quellencommit:

```text
commit 124b7feb0eeff964978842322f0b1e6faab1f742
Author: William Wu <william.wu@rock-chips.com>
Date:   Thu Jun 18 18:26:35 2020 +0800

    usb: gadget: uvc: allow zero bytesused for rockchip uvc

    For rockchip platforms, the userspace uvc application use
    bytesused == 0 as a way to indicate that the data is all
    zero and unused. In that case, the uvc driver should use
    the allow_zero_bytesused flag to keep bytesused 0 rather
    than use the buf actual size instead. This can help to
    preview 1080P@MJPG faster.

    Change-Id: Ic4d561f18e85d759b5a2405db4f6fb48533e1781
    Signed-off-by: William Wu <william.wu@rock-chips.com>
```

2. Bildpufferung auf Device oder Host.

Quellenfall 1: RV1109 verwendet 3KB/Mikroframe; PotPlayer auf dem Host zeigt große Verzögerung. 1KB verbessert sie. Ursache ist Host-Pufferung: iq ist standardmäßig 0, sodass ISP zunächst mit dem Treiberstandard 60fps startet und innerhalb 1s nach der UVC-Vorgabe auf 30fps umschaltet. Bei 3KB dauert ein Frame 13ms; der Host empfängt mehr als 30fps, PotPlayer zeigt aber nur 30fps. Bei 1KB dauert ein Frame etwa 33ms; die Bandbreite begrenzt auf 30fps, ohne Pufferung und merkliche Verzögerung. Lösung: iq-Standard so ändern, dass strikt 30fps gemäß UVC ausgegeben werden.

Quellenfall 2: Ein Dauer-Ausgabebefehl an ein Structured-Light-Modul verursacht Verzögerung.

Der Quellenversuch ergab bei einem/drei Kanälen mit Dauer-Ausgabebefehl etwa 180ms mehr als ohne. Das Modul synchronisiert danach drei Videokanäle und verzögert den nächsten Frame um etwa 180ms; CIF puffert vier vollständige Frames. Ist Dreikanalsynchronisation unnötig, diese im Modul deaktivieren oder den Befehl in der APK weglassen. Wird Synchronisation benötigt, die CIF-gepufferten Bilder gezielt behandeln.

Quellenfall 3: Structured-Light-MJPEG-1080P-Verzögerung. Ein Kanal ohne Dauerbefehl ist bei 1080P etwa 180ms langsamer als bei 480P. Host-APK-libuvc kopiert Kerneldaten per memcpy in eine eigene Framequeue, asynchron zu den 10 rotierenden Empfangs-URBs. Softwaredekodierung/Anzeige von 1080P sind langsam; vor Anzeige des ersten Frames haben Kernel und libuvc bereits 6–7 Frames empfangen. Die Pufferung erzeugt Verzögerung. Host-Softwaredekodierung beschleunigen und Pufferung vermeiden. Dies sind Quellenversuche, keine ArmSoM-Messungen.

#### 2.4.6 UVC-EMI-Probleme

EMI hängt oft mit der Device-Schaltung zusammen und verhindert die Vorschau oder friert sie ein. Linux-Hosts melden typischerweise `usb usb1-port1: disabled by hub (EMI?), re-enabling...`. Der Treiber vermutet EMI, weil ein Controller wie EHCI port enable fortlaufend prüft und einen Wechsel zu disable bei weiterhin gemeldeter Verbindung erkennt. Das Log ist daher ein Hinweis, kein EMI-Beweis. Maßnahmen:

1. USB-Augendiagramm messen und Bericht an Hardware-/USB-Treiberentwickler geben. Damit Schaltung und PHY-Register zur Verbesserung der Signalqualität und EMI-Problematik anpassen.

2. Gleichtaktrauschen mit dem Oszilloskop messen. Zu viel Rauschen verschlechtert DP/DM und kann EMI-Fehler auslösen. Gleichtaktdrosseln in DP/DM und verbesserte gemeinsame Masseverbindungen können helfen.

## 3. Referenzen

1. Rockchip_Developer_Guide_USB_CN

2. kernel/Documentation/devicetree/bindings/usb/generic.txt

3. kernel/Documentation/devicetree/bindings/usb/dwc3.txt

4. kernel/Documentation/devicetree/bindings/usb/rockchip,dwc3.txt

5. kernel/Documentation/trace/ftrace.rst

6. USB Video Class v1.1

### Technische Links der Quelle

- [1](https://www.uwe-sieber.de/usbtreeview_e.html)
- [2](https://events.static.linuxfound.org/sites/events/files/slides/USB%20Gadget%20Configfs%20API_0.pdf)
- [3](https://usb.org/document-library/video-class-v11-document-set)

{% endraw %}
