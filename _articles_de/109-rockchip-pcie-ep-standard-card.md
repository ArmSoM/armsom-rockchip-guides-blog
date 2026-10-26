---

title: "Vollständiger Rockchip PCIe EP-Leitfaden: Chips Connect, DMA, Speicher und Abnahme"

description: "Vollständiger Rockchip PCIe EP-Leitfaden: Chips Connect, DMA, Speicher und Abnahme — V3.2.0, RK3588/RK3568/RK1820."

excerpt: "Vollständiger Rockchip PCIe EP-Leitfaden: Chips Connect, DMA, Speicher und Abnahme — V3.2.0, RK3588/RK3568/RK1820."

translation_key: 109-rockchip-pcie-ep-standard-card

slug: 109-rockchip-pcie-ep-standard-card

lang: de

date: "2026-10-23"

author: "ArmSoM Editorial · Rockchip source documentation"

category: interfaces

products: []

tags: [ArmSoM, Rockchip, PCIe, DMA, RK3588, RK3568, RK1820]

---

{% raw %}

> Abbildungsabweichungen: Einige Bitmaps des englischen PDFs enthalten chinesische Beschriftungen. Seite 19 wiederholt das Pufferdiagramm; die erste Grafik auf chinesischer Seite 18 zeigt die Softwarearchitektur. Die jeweiligen Originale bleiben erhalten; EN/RU/DE verwenden die Bilder des englischen PDFs, keine vollständig englisch lokalisierten Grafiken. Das Hugepage-Beispiel nennt 16 × 32768 kB, aber Hugetlb 1048576 kB; das widersprüchliche Quellprotokoll bleibt zur Prüfung erhalten.

# Vollständiger Rockchip PCIe EP-Leitfaden: Chips Connect, DMA, Speicher und Abnahme

Quelle V3.2.0: 44 chinesische und 46 englische Seiten. Versionen: RK3588 Linux 6.1/5.10, RT-Thread v5.1.x/v4.1.x; RK3568 Linux 6.1/5.10/4.19, RT-Thread v5.1.x/v4.1.x; RK1820 RT-Thread 5.1.x. RT-Thread ist nur auf der RK PCIe EP-Seite implementiert. Dies ist eine Plattformreferenz: EP-Fähigkeit, Pins, Versorgung, Takte, BSP und Kernel für die konkrete ArmSoM-Platine prüfen. EVB-Leistungs- und Kompatibilitätswerte des Herstellers sind keine ArmSoM-Messungen; Hardwareprüfungen wurden nicht durchgeführt. Verwendet werden Originalbilder der englischen PDF.

> Offene Quellenfragen: R+2056B überschneidet sich mit vorherigem R+2560B; loopback verweist auf speed_test README; CTRL+L wird als Windows-Ruhezustand genannt; Windows 10 2004, Build 19042.1052 und eq-Bedeutung sind zu prüfen. Secure-Boot- und Signatureinstellungen sind historische Entwicklungsanweisungen und wurden hier nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Überblick über die EP-Karte

Das Entwicklungspaket für die RK PCIe EP-Standardkarte umfasst Hardware- und Softwarematerialien für Produkte im Kartenformat RK PCIe EP. Es basiert auf der RK EP-Demoplatine (im Folgenden EP-Karte) und enthält:

- eine Kurzanleitung für die EP-Karte;
- Startverfahren, PCIe-Hardware- und Softwareentwicklung sowie OTA-Aktualisierung;
- Grundlagen der Anwendungsverarbeitung auf der EP-Karte;
- darauf aufbauende Anwendungsbeispiele.

## 2. Spezifikationen der EP-Karte

### 2.1 Grundlegende Spezifikationen

| Hauptchip | Startverfahren | SMBus-Erweiterung | Unabhängiger Takt |
| --- | --- | --- | --- |
| RK3568 | Unterstützt Flash Boot, Common Boot; kein PCIe Boot | N | Unterstützt SRNS; kein SRIS |
| RK3588 | Unterstützt Flash Boot, Common Boot; kein PCIe Boot | N | N |
| RK1820 | Unterstützt Flash Boot, Common Boot, EP Boot | Y | N |

Erläuterung: Flash Boot umfasst zwei Verfahren:

- Flash Boot mit integriertem PCIe Bin und EP Boot-Softwareverfahren;
- Flash Boot mit integriertem PCIe Bin.

Bei EP-Startverfahren ohne PCIe Boot muss die EP-Karte gemäß PCIe-Protokoll innerhalb von 20 ms nach Freigabe von PERST# in den Erkennungsmodus wechseln. Anschließend führt der RC fortlaufend Erkennung, Aushandlung und Enumeration durch; dieser Vorgang kann bis zu 100 ms dauern. Zur besseren Kompatibilität mit allgemeinen RCs sollte deshalb SPI Flash als Startspeicher für einen schnellen Start verwendet werden; üblicherweise wird SPI NOR empfohlen.

### 2.2 Softwareentwicklung

Das EP-Kartenpaket demonstriert die Funktionen eines PCIe-Produkts und ist keine fertige Komplettlösung. Kunden müssen darauf aufbauend PCIe und die darüberliegenden Anwendungen weiterentwickeln.

### 2.3 Betriebssysteme

EP-Geräte: Die Karte ist mit Linux, Android und RT-Thread kompatibel.

RC-Geräte:

- Die Linux-Kompatibilität wurde auf bestimmten RCs geprüft.
- Die Windows-Kompatibilität wurde auf bestimmten RCs geprüft; implementiert sind jedoch nur grundlegende Übertragungsfunktionen. Weitere Funktionen müssen Kunden anhand des Linux-Treibers selbst entwickeln.

### 2.4 Taktanforderungen

Empfohlen wird ein gemeinsamer Referenztakt: Der EP verwendet den vom RC bereitgestellten 100M-Referenztakt. Verwenden beide Seiten RK-Chips und unterstützt die EP-Karte unabhängige Takte, können RC und EP ihre internen 100M-Takte verwenden. Dadurch entfallen ein externer Taktgenerator und ein Taktpuffer.

### 2.5 PCI-Gerätekennung

Die RK PCIe EP-Karte verwendet standardmäßig eine von RK definierte Gerätekennung. Für externe Entwickler nennt die Quelldokumentation folgende Anforderungen:

- Bei ausschließlicher Nutzung in einer geschlossenen internen Umgebung kann der vorhandene RK PCIe-VID verwendet werden.
- Für Verkauf oder öffentliche Nutzung muss ein eigener VID bei PCI-SIG beantragt werden.

### 2.6 Hot-Plug

Die RK PCIe EP-Karte unterstützt kein Hot-Plug.

### 2.7 Hilfssignale

| Hilfssignal | Funktion | Standard-EP-Verfahren | RK-Verbindung mit unabhängiger Versorgung |
| --- | --- | --- | --- |
| PRSNT# | N |  |  |
| PERST# | GPIO-Eingang | Erforderlich; Systemreset der gesamten Platine | Erforderlich; GPIO-Eingang, Softwarereset, DTS reset-gpios; |
| CLKREQ# | FUNCTION-Eingang | Optional; für ASPM L1SS-Energieverwaltung. Noch nicht implementiert, Reservierung empfohlen; ohne Bedarf unbeschaltet möglich | Optional; für ASPM L1SS-Energieverwaltung. Noch nicht implementiert, Reservierung empfohlen; ohne Bedarf unbeschaltet möglich |
| JTAG | N |  |  |
| SMBus | N |  |  |
| WAKE# | GPIO-Ausgang | Erforderlich; Erweiterung zum Aufwachen, noch nicht implementiert, Reservierung empfohlen | Erforderlich; Aufwachen, DTS wake-gpios; |
| +3.3Vaux | N |  |  |

Erläuterungen:

- Bei unabhängig versorgten RK-Chips kann eine Seite stromlos werden, während die andere weiterhin Signale ausgibt. Ein IO-Schutz gegen Spannungs- und Stromeinspeisung in die stromlose Seite wird empfohlen.
- Als GPIO verwendete Pins dürfen in pinctrl nicht als PCIe konfiguriert werden; beliebige GPIO-Pins sind möglich. Signale mit FUNCTION benötigen die zugehörigen Funktionspins.
- Im Standardverfahren wird PERST# mit dem Systemreset der gesamten Platine verbunden. Es ist das letzte Mittel des RC zum physischen EP-Reset. Manche RCs wechseln unmittelbar nach der Enumeration nach L2 und setzen über PERST# zurück; dafür ist ein schneller Reset erforderlich.
- PERST am RC ist ein stark treibender PP-Ausgang, der PMIC-Pin am EP dagegen ein OD-Pin. Unabhängig von 3.3V oder 1.8V PERST muss RESET_L am EP über eine Anpassungsschaltung angesteuert werden.

### 2.8 Leistungsanforderungen

Zu bestimmen sind die benötigte PCIe-Bandbreite, die Datenflussrichtung (einseitig RC/EP oder bidirektional) sowie kleine Steuernachrichten und große Datenblöcke. Empfohlen wird:

- den Abschnitt zu gemessenen Leistungen zu lesen, um die Leistungsobergrenze des chips_connect-Pakets zu verstehen;
- den Abschnitt zum Userspace-Testbeispiel pcie_speed_test zu lesen, um die Übertragungsbandbreite für unterschiedliche Blockgrößen einzuschätzen.

## 3. Bedienungsanleitung für die EP-Karte

### 3.1 Vorbereitung der Umgebung

Die EP-Karte unterstützt allgemeine RCs und RK RCs. Dieser Abschnitt beschreibt die grundlegende Funktionsprüfung beider Varianten.

#### 3.1.1 Hardwareumgebung

RK3588 EP-Standardplatine mit RK3588 RC:

- RC: RK3588-EVB1-V10. Stromversorgung, serielles Kabel, USB–Type-C-Kabel zum Firmwareladen und HDMI an HDMI_OUT0 anschließen.
- EP: RK3588-EVB4-V11. Die Versorgung erfolgt direkt durch den RC; kein separates Stromkabel. Hot-Plug wird nicht unterstützt: vor dem Einschalten des RC verbinden.

RK3588 EP-Standardplatine mit allgemeinem RC:

- RC: PC.
- EP: RK3588-EVB4-V11. Versorgung durch den RC, kein separates Stromkabel. Karte vor dem Einschalten verbinden.

RK3588-Verbindung mit unabhängiger Versorgung:

- RC: RK3588-EVB1-V10. Stromversorgung, serielles Kabel, USB–Type-C zum Firmwareladen und HDMI_OUT0 anschließen.
- EP: RK3588-EVB4-V12. Separate Versorgung; R8114 und R2005 werden nicht bestückt.

PERST# und WAKE# müssen verbunden und als GPIO verwendet werden. Stromversorgung, serielles Kabel und USB–Type-C zum Firmwareladen anschließen.

#### 3.1.2 Softwareumgebung

Die benötigten Dateien loader, uboot, boot und Dateisystem befinden sich im Verzeichnis images des Auslieferungspakets.

Flash Boot mit integriertem PCIe Bin: Die Startdateien für die RK3588 EP-Platine stehen in der folgenden Tabelle.

| Element | Dateiname | Beschreibung |
| --- | --- | --- |
| RC (für allgemeinen RC nicht erforderlich) | rk3588-update-rc-evb7-v11.img | In RC-Flash schreiben |
| EP | rk3588-update-ep-evb4-v11.img | In EP-Flash schreiben |

Hinweis: update.img enthält MiniLoaderAll.bin, uboot.img, boot.img, rootfs.img und weitere Dateien.

Flash Boot mit integriertem PCIe Bin und EP Boot: Die Startdateien für RK3588 EP stehen in der folgenden Tabelle.

| Element | Dateiname | Beschreibung |
| --- | --- | --- |
| RC (für allgemeinen RC nicht erforderlich) | rk3588-update-rc-evb7-v11.img | In RC-Flash schreiben |
| EP | RK3588_MiniLoaderAll.bin | In EP-Flash schreiben |
| EP | pcie_idb.img | In EP-Flash schreiben |
| EP | normal_idb.img | In EP-Flash schreiben |
| EP | uboot.img | RC lädt über PCIe in EP-DDR |
| EP | boot.img (enthält kernel+rootfs) | RC lädt über PCIe in EP-DDR |

Das Laden der Firmware vom RC zum EP über PCIe wird im folgenden Abschnitt zur Funktionsprüfung beschrieben.

### 3.2 Funktionsprüfung

Die PCIe EP-Testbeispiele liegen im Verzeichnis examples des SDK. Enthalten sind Programme für EP und RC sowie gekapselter Code für Nachrichten- und Datenkommunikation.

#### 3.2.1 Linux RC

Die bin-Dateien und Ressourcen für einen allgemeinen RC liegen in images und müssen manuell auf den RC kopiert werden (nur X86). Bei RK RC sind sie bereits im Stammverzeichnis der Firmware enthalten. Nach Vorbereitung der Hardware und Software folgen die nachstehenden Schritte. Ist kein Firmwaredownload zum EP nötig, kann Punkt 1 übersprungen werden.

1. Der RC lädt Firmware über PCIe auf den EP.

Schritt 1: Die Baudrate des seriellen EP-Ports beträgt 1500000, ebenso beim RC. Nach dem Anschluss erscheint fortlaufend das folgende Protokoll: Die PCIe-Verbindung besteht und der EP wartet auf Firmware vom RC.

```text
U-Boot SPL 2017.09-g614fe864bf-dirty #xyp (Apr 20 2023 - 11:19:22)
RKEP: 191277 - Link ready! Waiting RC to download Firmware:
RKEP: 191723 - Download uboot.img  to BAR2+0
RKEP: 192068 - Download boot.img   to BAR2+0x400000
RKEP: 192466 - Send CMD_LOADER_RUN to BAR0+0x400
RKEP: 1092850 - Waiting for FW, CMD: 0
RKEP: 2093146 - Waiting for FW, CMD: 0
RKEP: 3093443 - Waiting for FW, CMD: 0
RKEP: 4093740 - Waiting for FW, CMD: 0
RKEP: 5094036 - Waiting for FW, CMD: 0
```

Startet der EP unmittelbar sein System, enthält der Flash bereits eine vollständige Firmware. pcie_idb.img und normal_idb.img im maskrom-Modus erneut schreiben.

Schritt 2: Auf dem RC `./pcie_download_test_rc 0 ./uboot.img ./boot.img` ausführen. DMA überträgt die Firmware an die vorgegebene EP-Speicheradresse; anschließend löst ein Startbefehl das Booten aus DDR aus. Der EP zeigt das normale Startprotokoll und startet das System. Bei RC-Anwendungsfehlern siehe examples/pcie_download_test/README.

2. Beispiel zur Vorschau decodierter Videos.

Schritt 1: EP und RC verwenden die Baudrate 1500000. Auf dem RC `lspci -vvv \|grep 356a` und `ls /dev/pcie-rkep*` ausführen. Die folgenden Geräteausgaben bestätigen, dass der EP erkannt und der RC-Treiber korrekt geladen wurde.

```text
[root@RK3588:/userdata]# lspci -vvv |grep 356a
01:00.0 Processing accelerators: Rockchip Electronics Co., Ltd Device 356a (rev 01)
[root@RK3588:/userdata]# ls /dev/pcie-rkep*
/dev/pcie-rkep0000:01:00.0
```

Schritt 2: Nach dem normalen EP-Systemstart zeigt das Terminal das folgende Protokoll und wartet blockierend auf den Start der RC-Anwendung.

```text
00:00:05.330 I [cmp_pcie_ep: cc_cmp_pcie_device: 390] rk pcie version: v3.0.0 - 2024-12-11
00:00:05.330 D [chipscon: cc_kernel_api_prob: 398] open rkep: /dev/pcie_ep Success.
00:00:05.330 D [chipscon: cc_kernel_api_prob: 403] probe pcie_rkep, fd = 3
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar0 size=0x400000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar2 size=0x4000000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar4 size=0x100000
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 73] no bar1
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 86] no bar5
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 590]  - id=ffffffff
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 600]  - id=356a1d87
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 609]  - magic=524b4550, ver=1
......
00:00:05.331 D [cmp_pcie_ep: pcie_task_ep_msg_t: 264]  start
00:00:05.331 D [cmp_pcie_ep: stream_speed_threa: 352] stream_speed_thread tart
```

Schritt 3: Den RC-Speicher gemäß dem Abschnitt zur Userspace-Speicherkonfiguration einrichten.

Schritt 4: Für den Handshake mit dem EP und den Übertragungsstart ausführen:

- Allgemeiner RC: `./pcie_video_test_rc ./output1.h264 36 704 576 0 1`
- RK RC: `pcie_video_test_rc /root/output1.h264 36 704 576 0 1`

Der RC-Bildschirm zeigt 1080P60 mit 36 decodierten Videoströmen und NN-Personenerkennung im ersten Strom. Der RC verwendet DRM zur Anzeige. RK RC unterstützt dies standardmäßig; allgemeine RCs benötigen libdrm-dev. Vor dem Test mit Ctrl+F3 in ein Terminal ohne GUI wechseln.

Schritt 4 (Nummerierung der Quelle): Zum Beenden in der RC-Anwendung Enter drücken. Diese sendet dem EP eine Nachricht zur Freigabe der Anwendungsressourcen und beendet sich; der EP gibt nach Empfang ebenfalls seine Ressourcen frei und beendet sich. Ein reguläres Beenden ist erforderlich, sonst bleibt die EP-Verarbeitung aktiv und der nächste Lauf funktioniert nicht korrekt.

Die EP-Anwendung startet standardmäßig beim Booten automatisch und wiederholt. Für andere Tests den aktuellen Test im Startskript auskommentieren und RC sowie EP neu starten. Dazu den folgenden Code in /etc/init.d/S99_pcie_ep.sh auskommentieren.

```text
while true;
do
    cd /
    pcie_video_test_ep 1
done &
```

#### 3.2.2 Windows RC

Der mitgelieferte Windows-RC-Treiber unterstützt nur Systeme unter Windows 10 2004. Für neuere Systeme muss eine eigene Treiber-Buildumgebung eingerichtet und der Treiber selbst übersetzt werden. Siehe den Abschnitt zur Windows-Treiberumgebung, insbesondere Systemversion und Deaktivierung der Treibersignaturprüfung. Nach Vorbereitung die EP-Karte vor dem Einschalten des PCs einsetzen. Im Geräte-Manager das PCI-Gerät auswählen: „Treiber aktualisieren“ → „Auf meinem Computer nach Treibern suchen“ → Verzeichnis Win-Driver-RC → „Weiter“. Danach erscheint Rockchip RC PCIE Driver for the rk35xx Accelerator Card. Das Testwerkzeug als Administrator starten. Es unterstützt Firmwaredownload, Geschwindigkeitsprüfung, Videodecodierung und Objekterkennung. Bei Fehlern siehe Fehlerbehandlung.

![Technische Originalabbildung, Seite 13](/docs/rockchip-pcie-ep-standard-card/assets/en-p013-figure-01.png)

*Technische Originalabbildung, Seite 13*

Nach Vorbereitung von Hardware und Software die vollständige PCIe-Funktionsprüfung wie folgt durchführen. Falls kein Firmwaredownload zum EP erforderlich ist, Punkt 1 überspringen.

1. Der RC lädt die Firmware über PCIe auf den EP.

Schritt 1: Die serielle Baudrate von EP und RC beträgt 1500000. Nach Anschluss wird das folgende Protokoll wiederholt ausgegeben: Die PCIe-Verbindung steht und der EP wartet auf die Firmwareübertragung vom RC.

```text
U-Boot SPL 2017.09-g614fe864bf-dirty #xyp (Apr 20 2023 - 11:19:22)
RKEP: 191277 - Link ready! Waiting RC to download Firmware:
RKEP: 191723 - Download uboot.img  to BAR2+0
RKEP: 192068 - Download boot.img   to BAR2+0x400000
RKEP: 192466 - Send CMD_LOADER_RUN to BAR0+0x400
RKEP: 1092850 - Waiting for FW, CMD: 0
RKEP: 2093146 - Waiting for FW, CMD: 0
RKEP: 3093443 - Waiting for FW, CMD: 0
RKEP: 4093740 - Waiting for FW, CMD: 0
RKEP: 5094036 - Waiting for FW, CMD: 0
```

Startet der EP direkt sein System, enthält der Flash bereits die vollständige Firmware; pcie_idb.img und normal_idb.img im maskrom-Modus erneut schreiben.

Schritt 2: Im Werkzeug uboot und boot laden und den Firmwaredownload starten. DMA überträgt die Dateien an die vorgegebenen EP-Speicheradressen. Danach startet ein Startbefehl den EP aus DDR; das normale Startprotokoll erscheint und das System wird gestartet.

2. Prüfung der Vorschau decodierter Videos.

Schritt 1: Nach dem Systemstart gibt der EP das folgende Protokoll aus und wartet blockierend auf die RC-Anwendung.

```text
00:00:05.330 I [cmp_pcie_ep: cc_cmp_pcie_device: 390] rk pcie version: v3.0.0 - 2024-12-11
00:00:05.330 D [chipscon: cc_kernel_api_prob: 398] open rkep: /dev/pcie_ep Success.
00:00:05.330 D [chipscon: cc_kernel_api_prob: 403] probe pcie_rkep, fd = 3
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar0 size=0x400000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar2 size=0x4000000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar4 size=0x100000
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 73] no bar1
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 86] no bar5
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 590]  - id=ffffffff
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 600]  - id=356a1d87
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 609]  - magic=524b4550, ver=1
......
00:00:05.331 D [cmp_pcie_ep: pcie_task_ep_msg_t: 264]  start
00:00:05.331 D [cmp_pcie_ep: stream_speed_threa: 352] stream_speed_thread tart
```

Schritt 2: Den Teststrom in das Werkzeugverzeichnis kopieren und in output1.h264 umbenennen. Das Werkzeug verwendet fest einen h264-Rohdatenstrom. Testdauer einstellen und den Videotest starten. Die Testanzeige folgt unten.

![Technische Originalabbildung, Seite 15](/docs/rockchip-pcie-ep-standard-card/assets/en-p015-figure-01.png)

*Technische Originalabbildung, Seite 15*

### 3.3 Gemessene Leistung

PCIe EP-Übertragungsleistung

| EP | RC | Hardwarekonfiguration | Szenario | Maximale Übertragungsrate |
| --- | --- | --- | --- | --- |
| RK3588 | RK3588 | PCIE 3.0x4 Lane | EP schreibt zum RC | 2.95GB/s |
|  |  |  | EP liest vom RC | 1.8GB/s |
|  |  |  | Gleichzeitiges EP-Lesen/Schreiben mit RC | Je 1.6GB/s |
| RK3588 | RK3588 (Using RC DMA aktiviert) | PCIE 3.0x4 Lane | EP schreibt zum RC | 2.95GB/s |
|  |  |  | EP liest vom RC | 2.95GB/s |
|  |  |  | Gleichzeitiges EP-Lesen/Schreiben mit RC | Je 2.85GB/s |
|  | X86 | PCIE 3.0x4 Lane | EP schreibt zum RC | 2.9GB/s |
|  |  |  | EP liest vom RC | 2.5GB/s |
|  |  |  | Gleichzeitiges EP-Lesen/Schreiben mit RC | Je 2.4GB/s |
|  | Windows | PCIE 3.0x4 Lane | EP schreibt zum RC | 650MB/s |
|  |  |  | EP liest vom RC | 700MB/s |
|  |  |  | Gleichzeitiges EP-Lesen/Schreiben mit RC | Je 320MB/s |

Die Leistung wird weiter optimiert. Windows unterstützt derzeit keinen Test mit verkettetem DMA. Die Übertragungsrate hängt stark von der Speicherstruktur ab; große zusammenhängende Blöcke ermöglichen höhere Raten.

### 3.4 Kompilieren der Beispiele

Anleitungen zum Kompilieren und Verwenden der einzelnen Beispiele stehen unter examples/*/README.

## 4. Grundlagen der EP-Anwendungsverarbeitung

### 4.1 Funktionsprinzip

Die EP-Anwendung überträgt Ausgangsdaten und vom Prozessor bearbeitete Daten zwischen den Seiten über PCIe. Wesentliche Ressourcen:

RC:

- Zugriff auf EP-Geräte über die offene Standardbibliothek libpci;
- pcie-rkep übernimmt BAR-Mapping (für Steuerdaten empfohlen), DMA (für Datenblöcke), MSI-Verarbeitung, ELBI-Auslösung und DMA-Speicherzuweisung;
- aktives MSI-Polling im Userspace verkürzt die Reaktion, mehrere Handshakes begrenzen jedoch das Echtzeitverhalten;
- mehrere Prozesse werden unterstützt, etwa mehrere pcie_speed_test-Instanzen.

EP:

- pcie_ep verwendet class id 0x1200 (Processing accelerators), bildet den eingehenden physischen BAR-Adressraum ab, führt DMA aus, sendet MSI und verarbeitet ELBI;
- aktives ELBI-Polling im Userspace verkürzt die Reaktion, mehrere Handshakes begrenzen jedoch das Echtzeitverhalten;
- Multithreading wird unterstützt;
- VDEC, VENC, RGA, GPU und NPU können über Rockit oder RKNN im Userspace angesprochen werden.

## 5. Einführung in Chips Connect

### 5.1 Funktionsprinzip

Chips Connect ist ein Userspace-Entwicklungspaket auf Basis der EP-Grundfunktionen. Es stellt Schnittstellen für RC/EP-Datenübertragung in beide Richtungen und Nachrichtenbenachrichtigungen sowie typische Anwendungsszenarien bereit.

BAR-Aufteilung für allgemeine Plattformen mit ausreichend Speicher in SPL und Kernel:

| BAR-Bereich | Startadresse | Endadresse | Funktion |
| --- | --- | --- | --- |
| BAR0 | 0 | 4KB | EP-Reserve: Treiberversion, Interruptstatus usw. |
|  | 12KB | 16KB | DEBUG-Konfiguration |
|  | 16KB | 128KB | EP-Gerätestatus |
|  | 128KB | 1M | Benutzerdefiniert |
|  | 1M | 4M | Framework-Befehlsaustausch und buff-Verwaltung |
| BAR1 (standardmäßig deaktiviert) | 0 | 1MB | Benutzerdefiniert; Aktivierung siehe „BAR-Größenkonfiguration“ |
| BAR2 (BAR2/3 Bar Repair) | 0 | 64MB | Verwendung durch RC-DMA |
| BAR4 | 0 | 4MB | Wired-Registerbereich zur DMA-Steuerung |
| BAR5 (standardmäßig deaktiviert) | 0 | 1MB | Benutzerdefiniert; Aktivierung siehe „BAR-Größenkonfiguration“ |

Erläuterung: Der benutzerdefinierte BAR-Bereich am EP kann erweitert werden; die übrigen Bereiche benötigt der Anwendungscode. BAR1 und BAR5 sind standardmäßig deaktiviert und vollständig benutzerdefiniert. Aktiviert dienen sie dem Steuerdatenfluss. Die eingehende CPU-Adresse des EP-BAR wird über die BAR-Mapping-Konfiguration vorgegeben und kann vom RC dynamisch angepasst werden.

BAR-Aufteilung für Plattformen mit knappem Speicher in SPL und Kernel:

| BAR-Bereich | Startadresse | Endadresse | Funktion |
| --- | --- | --- | --- |
| BAR0 | 0 | Reserved | Reserviert; standardmäßig 0 |
|  | R | R+2048B | EP-Reserve: Treiberversion, Interruptstatus usw. |
|  | R+2048B | R+2560B | DEBUG-Konfiguration |
|  | R+2056B | R+3072B | EP-Gerätestatus |
|  | R+3072B | R+4KB | Benutzerdefiniert |
|  | R+4KB | R+64KB | Framework-Befehlsaustausch und buff-Verwaltung |
| BAR1 (standardmäßig deaktiviert) |  | 1MB | Benutzerdefiniert; Aktivierung siehe „BAR-Größenkonfiguration“ |
| BAR2 (BAR2/3 Bar Repair) | 0 | 64MB | Verwendung durch RC-DMA |
| BAR4 | 0 | 4MB | Wired-Registerbereich zur DMA-Steuerung |
| BAR5 (standardmäßig deaktiviert) | 0 | 1MB | Benutzerdefiniert; Aktivierung siehe „BAR-Größenkonfiguration“ |

Erläuterung: Die minimale BAR-Ausrichtung beträgt 1MB; üblicherweise wird dafür 1MB Speicher zugewiesen. Bei knappem Speicher ist eine Reservierung möglich, deren Speicher Chips Connect verwendet. Benutzerdefinierte EP-BAR-Bereiche können erweitert werden; die übrigen Bereiche benötigt der Anwendungscode. BAR1 und BAR5 sind standardmäßig deaktiviert und benutzerdefiniert; aktiviert dienen sie Steuerdaten. Die eingehende CPU-Adresse wird durch die BAR-Konfiguration vorgegeben und kann vom RC dynamisch geändert werden.

### 5.2 Architektur des PCIe-Übertragungssystems

Blockschaltbild des PCIe RC- und EP-Systems

![Technische Originalabbildung, Seite 19](/docs/rockchip-pcie-ep-standard-card/assets/en-p019-figure-01.png)

*Technische Originalabbildung, Seite 19*

### 5.3 BUFF-Verwaltung und Datenübertragung

BUFF-Verwaltung

![Technische Originalabbildung, Seite 19](/docs/rockchip-pcie-ep-standard-card/assets/en-p019-figure-02.png)

*Technische Originalabbildung, Seite 19*

Im Folgenden wird der vollständige Ablauf von Initialisierung, Schreiben und Lesen aus Sicht des RC beschrieben.

#### 5.3.1 Initialisierung

Es werden zwei Hauptaufgaben ausgeführt:

1. Das PCIe-Gerät anhand von VENDOR_ID, DEVICE_ID und Busadresse initialisieren. Intern werden die PCIe-Geräte mit libpci durchlaufen und die BAR-Bereiche in die Anwendung abgebildet. rk_pcie_device_init kann zur Geräteinitialisierung wiederholt mit unterschiedlichen Gerätekennungen aufgerufen werden.

2. rk_pcie_task_create erstellt eine Task und initialisiert Speicher und BUFF-Zustände. Anzahl und Größe der Puffer werden über struct pcie_task_attr_st gesetzt. Die Konfiguration wird über BAR0 zum EP übertragen; der RC wartet auf dessen Initialisierung.

Der EP empfängt die Task-Erstellungsnachricht über rk_pcie_get_task_msg und startet die Initialisierung zum Konfigurationsabgleich. Der RC wählt Hugepage/RKEP/RKDRM anhand der Buildkonfiguration. Jede EP-Karte erzeugt auf dem RC einen Knoten /dev/pcie-rkep* und erhält bei aktivierter Konfiguration einen eigenen großen zusammenhängenden Speicherbereich. Nach Empfang der Konfiguration initialisiert der EP BUFF und weist über Hugepage/RKDRM physisch zusammenhängenden Speicher zu. Die BUFF-Informationen beider Seiten werden in einem bestimmten BAR0-Bereich zur Zustandsverwaltung abgelegt.

```text
#define VENDOR_ID                   0x1d87
#define DEVICE_ID                   0x356a

struct pcie_dev_bus dev_bus;
int ret;
//获取系统匹配的PCI设备总线地址
ret = rk_pcie_get_pci_bus_addresses(VENDOR_ID, DEVICE_ID, &rc_ctx.dev_bus);
if (ret != 0) {
    printf("get pci bus address fail\n");
    return -1;
}

printf("ep dev max num : %d\n", rc_ctx.dev_bus.dev_max_num);
if (rc_ctx.dev_bus.dev_max_num == 0) {
    printf("no ep device, exit ... \n");
} else {
    rc_ctx.dev_attr.using_rc_dma = 0;
    rc_ctx.dev_attr.rc_dma_chn = 0;
    rc_ctx.dev_attr.enable_speed = 1;
    rc_ctx.dev_attr.vendor_id = VENDOR_ID;
    rc_ctx.dev_attr.device_id = DEVICE_ID;
    rc_ctx.dev_attr.use_dma_only_in_rc = 0;
    rc_ctx.dev_attr.mem_type = E_MEM_TYPE_HUGEPAGE;
    memcpy(rc_ctx.dev_attr.pci_bus_address, pci_bus_address, strlen(pci_bus_address));

    //选择第⼀个匹配设备初始化
    rc_ctx.rk_handle = rk_pcie_device_init(&rc_ctx.dev_attr);
    //获取EP设备模式
    rk_pcie_get_ep_mode(rc_ctx.rk_handle, &rc_ctx.devmode);
    printf("ep device init, dev mode: %d, submode: %d\n", rc_ctx.devmode.mode,
rc_ctx.devmode.submode);
}
```

#### 5.3.2 Daten senden

Das Senden besteht aus drei Schritten:

1. Prüfen, ob ein BUFFER verfügbar ist.

2. BUFFER anfordern und Daten hineinschreiben.

3. Den BUFFER an die Gegenseite senden. Beispielsweise erlaubt send_buff_num = 5 höchstens fünf Sendepuffer. Der Sender fordert einen freien Puffer an und erhält über struct pcie_buff_node dessen physische und virtuelle Adresse sowie Größe. Nach der Anwendungsverarbeitung wird die Sendefunktion aufgerufen. Intern wird zuerst der Puffer-Cache geflusht, damit der physische Speicher aktuelle Daten enthält; anschließend überträgt DMA die Daten. Die Übertragungsgröße node->size darf die BUFFER-Kapazität nicht überschreiten.

Ein gesendeter Puffer wird erst nach Freigabe durch den Empfänger wieder verfügbar; andernfalls blockiert der Ablauf. rk_pcie_get_buff unterstützt noch keinen blockierenden Modus; daher in einer Schleife mit sleep warten.

```text
struct pcie_buff_node *node = rk_pcie_get_buff(rk_handle, E_SEND);
if(node) {
    node->size = rk_pcie_get_buff_max_size(rk_handle, E_SEND);
    //操作buff 写⼊数据
    rk_pcie_send_buff(ctx->rk_handle, node);
} else {
    usleep(1000);
}
```

Prinzip der Übertragung RC → EP:

![Technische Originalabbildung, Seite 22](/docs/rockchip-pcie-ep-standard-card/assets/en-p022-vector-01.png)

*Technische Originalabbildung, Seite 22*

Prinzip der Übertragung EP → RC:

![Technische Originalabbildung, Seite 23](/docs/rockchip-pcie-ep-standard-card/assets/en-p023-vector-02.png)

*Technische Originalabbildung, Seite 23*

#### 5.3.3 Daten empfangen

Der Empfang besteht aus drei Schritten:

1. Prüfen, ob ein BUFFER verfügbar ist.

2. Verfügbaren BUFFER anfordern und Daten lesen.

3. BUFFER freigeben. Die interne Empfangsimplementierung ähnelt dem Senden. recv_buff_num bestimmt bei der Initialisierung die Pufferanzahl; siehe den Sendeabschnitt. Die verfügbare Datenmenge beträgt node->size.

```text
struct pcie_buff_node *node = rk_pcie_get_buff(rk_handle, E_RECV);
if(node) {
    //操作buff 读取数据
    rk_pcie_release_buff(rk_handle, node);
} else {
    usleep(1000);
}
```

Prinzip des EP-Empfangs:

![Technische Originalabbildung, Seite 24](/docs/rockchip-pcie-ep-standard-card/assets/en-p024-vector-03.png)

*Technische Originalabbildung, Seite 24*

Prinzip des RC-Empfangs:

![Technische Originalabbildung, Seite 24](/docs/rockchip-pcie-ep-standard-card/assets/en-p024-vector-04.png)

*Technische Originalabbildung, Seite 24*

#### 5.3.4 BUFF-Konfiguration

1. Übertragung RC → EP. Bei einer Decoderkarte sendet der RC Rohdatenströme zum EP; die Datenmenge je Kanal ist relativ klein. Als BUFF-Größe kann 4KB × Anzahl der Videokanäle gewählt werden. Jeder Strom überträgt jeweils 4KB, sodass die Daten regelmäßig aktualisiert werden, ohne PCIe-Bandbreite durch zu kleine Pakete zu verschwenden. Empfohlen sind 3–5 umlaufend verwendete Puffer, mindestens drei. Für zusätzliche Verarbeitung die Anzahl erhöhen, sonst stockt der Umlauf und die Rate sinkt. Auch für Multithreading kann die Pufferanzahl erhöht werden.

2. Übertragung EP → RC. Meist werden große decodierte Daten übertragen: Ein 1080p-Bild in YUV422 benötigt ungefähr 3MB. Ein BUFF von 3MB–6MB kann Daten eines oder zweier Kanäle übertragen. Da mehrere Puffer umlaufen, sollte ein einzelner BUFF nicht übermäßig groß sein und zu viel Speicher belegen.

### 5.4 Userspace-Speicherkonfiguration

RC und EP unterstützen mehrere Speicherzuweisungsverfahren. RC-Seite:

1. pcie-rkep weist Speicher zu, das SDK greift über mmap darauf zu. Aktivierung: CONFIG_PCIE_FUNC_RKEP_USERPAGES=y (standardmäßig deaktiviert). Die Größe wird mit RKEP_USER_MEM_SIZE in pcie-rkep.c geändert; Standardwert 64M.

2. HugePages — empfohlenes Verfahren.

3. DRM-Treiber; CMA muss vorab im DTS reserviert werden. DMA-Speichergröße in arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi ändern:

```text
@@ -71,7 +71,7 @@ reserved-memory {
cma {
    compatible = "shared-dma-pool";
    reusable;
    reg = <0x0 0x50000000 0x0 0x10000000>; //从地址0x50000000开始256MB⼤⼩
    linux,cma-default;
};
```

4. Dummy: Der Benutzer verwaltet den Datenpuffer; das Framework verwaltet nur den Umlaufknoten und weist keinen Datenpuffer zu. Derzeit nur unter Windows unterstützt.

EP-Seite:

1. DRM-Treiber mit vorheriger CMA-Reservierung im DTS. DMA-Speichergröße in arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi ändern:

```text
@@ -71,7 +71,7 @@ reserved-memory {
cma {
    compatible = "shared-dma-pool";
    reusable;
    reg = <0x0 0x50000000 0x0 0x10000000>; //从地址0x50000000开始256MB⼤⼩
    linux,cma-default;
};
```

2. HugePages — empfohlenes Verfahren. Das Verfahren wird bei der Task-Initialisierung als Attribut gewählt:

- RC: E_MEM_TYPE_HUGEPAGE / E_MEM_TYPE_RKDRM / E_MEM_TYPE_RKEP.
- EP: E_MEM_TYPE_HUGEPAGE / E_MEM_TYPE_RKDRM.

HugePages erfordert eine Systemkonfiguration; siehe den HugePage-Abschnitt.

### 5.5 Vorteile des Userspace-Treibers

Der PCIe-Anwendungstreiber wird zur einfacheren Nutzung und Leistungsoptimierung in den Userspace verlagert.

Nutzung:

- Die Grundlage auf dem PCIe-Gerätetreiber erleichtert die Plattformportierung.
- Direkte Integration in Anwendungen ermöglicht Aufrufe von RK rockit oder externen gstreamer-Schnittstellen.

Gegenüber einem Kernel-Schnittstellentreiber:

- Polling statt Interrupts reduziert CPU-Moduswechsel bei häufigen Interrupts;
- Kernel/Userspace-Wechsel werden reduziert;
- CPU-Bindung wird empfohlen, um Mehrkern-Scheduling zu reduzieren;
- Kopieren zwischen Kernel und Userspace entfällt, wodurch Zero-Copy erreicht wird;
- Huge Pages reduzieren TLB-Cache-Misses.

### 5.6 Mehrere unabhängige Userspace-Anwendungen

RK chips_connect-Anwendungen basieren auf Tasks:

- Tasks sind unabhängig;
- RC-Benutzernachrichten sind unabhängig, RC Tasks unterstützen mehrere Prozesse;
- EP-Benutzernachrichten werden gemeinsam verwaltet, EP Tasks unterstützen keine mehreren Prozesse;
- innerhalb einer Task wird Multithreading unterstützt;
- Task-IDs werden in Anforderungsreihenfolge vergeben und können nicht gezielt gewählt werden.

Im Standardbeispiel ist die Anwendung nicht an Task und andere Ressourcen gebunden; deshalb sind parallele unabhängige Anwendungen nicht möglich. Empfohlen wird eine Erweiterung über Benutzernachrichten mit Anwendungs-ID und Task-Zuordnung. Beispiel für RK RT-Thread chips_connect:

1. Regeln für Benutzernachrichten festlegen und Anwendungsverwaltung ergänzen:

```text
struct task_user_cmd_st {
    unsigned int app_id;
    unsigned int cmd;
    unsigned char data[4];
};
```

2. Die EP-Anwendung registriert sich mit eindeutiger app_id.

3. Der RC sendet Nachrichten mit eindeutiger app_id.

4. Das EP-Hauptprogramm ruft anhand der app_id den Nachrichten-Callback der Anwendung auf.

5. Die EP-Anwendung verarbeitet Nachrichten einschließlich Task-Anforderung und -Freigabe.

![Technische Originalabbildung, Seite 27](/docs/rockchip-pcie-ep-standard-card/assets/en-p027-vector-05.png)

*Technische Originalabbildung, Seite 27*

## 6. Chips Connect-Konfiguration

### 6.1 Userspace-Gerätetreiber der EP-Karte

Dies bezeichnet den auf dem RC ausgeführten EP-Funktionstreiber einschließlich Kernelmodulen und Userspace-Anwendungen.

#### 6.1.1 Using-RC-DMA-Modus

Der Modus funktioniert nur mit einem RK RC und kann die PCIe-Bandbreite maximieren. Standardmäßig wird nur EP-DMA verwendet. Using-RC-DMA nutzt für EP → RC den EP-DMA und für RC → EP den RC-DMA ohne gegenseitige Beeinflussung. RC-DMA kann nur in physische Bereiche übertragen, die eingehend auf BAR abgebildet sind; dafür ist BAR2 vorgesehen. Standardgröße: 64M, im EP-DTS änderbar. Dieser Speicher dient nur RC → EP und muss mindestens so groß sein wie send_buff_size bei der Initialisierung.

Zum Aktivieren müssen RC/EP-Treiber nicht geändert werden; nur die Initialisierungsparameter der RC-Anwendung sind anzupassen.

```text
dev_attr.using_rc_dma = 1; //使⽤RC DMA
dev_attr.rc_dma_chn = 1; //通道1，⽀持0/1
```

Nach Aktivierung erscheint in der RC-Anwendung folgendes Protokoll:

```text
rk pcie version: v2.0.0 - 202300927
using rc dma: 1, chn: 1   //使能RC DMA，通道1
open rkrmd: /dev/pcie-rkep-0000:01:00.0 Success.
```

Beim Erstellen einer Task zeigt die EP-Anwendung folgendes Protokoll:

```text
task create id: 1
using rc dma: 1
```

Empfohlene Konfiguration:

- Ein EP: using_rc_dma aktivieren und Kanal 0 wählen.
- Mehrere EPs: using_rc_dma deaktivieren und jeweils den EP-eigenen DMA verwenden, damit die Karten ungefähr gleiche Übertragungsraten erreichen.

## 7. Typische Chips Connect-Anwendungen

### 7.1 EP-Videobeschleunigerkarte

Die Karte überträgt den RC-Videostrom über PCIe zum EP zur Decodierung und Verarbeitung und anschließend zur Anzeige zurück zum Hauptchip. Der grundlegende Datenfluss folgt unten.

![Technische Originalabbildung, Seite 29](/docs/rockchip-pcie-ep-standard-card/assets/en-p029-figure-01.png)

*Technische Originalabbildung, Seite 29*

Der Sender entnimmt Daten aus dem Videostrom, kopiert sie in den vorbereiteten send stream buffer und überträgt sie per PCIe DMA in den recv stream buffer der Gegenseite. Dort werden sie entnommen und über VDEC an VPSS übergeben. VPSS erzeugt zwei Ströme: einer geht zur Komposition an die GPU, der andere an RKNN. Die komponierten Daten werden in den vorbereiteten send stream buffer kopiert und per PCIe DMA zum recv stream buffer der Gegenseite übertragen. Der Empfänger entnimmt die Daten und übergibt sie an VO zur Anzeige. Das SDK implementiert die Sende- und Empfangspuffer; ihre Parameter werden bei der Initialisierung gesetzt, sodass der Benutzer sich auf die Anwendungsverarbeitung konzentrieren kann.

## 8. Chips Connect-Abnahmekriterien

Bei erstmaliger Verwendung des PCIe EP-Pakets sollten vor eigener Entwicklung Software, Hardware und grundlegende Anwendungsabläufe mit den folgenden Prüfungen bestätigt werden.

### 8.1 Inhalt des Entwicklungspakets

Verzeichnisstruktur

```text
.
├── bootloader                    # pcie ep bootloader源码⼯程
├── build                         # build编译脚本
├── core
│   ├── api                       # sdk对外api，包含rc和ep
│   └── component                 # pcie组件，主要是负责buf管理，消息通知等
│   └── framework                 # 框架层，主要负责和OS交互，对上提供系统能⼒以及PCIE功能
├── docs                          # PCIE EP SDK⽂档介绍
├── examples
│   ├── pcie_camera_test          # EP卡典型业务，抓取EP Camera数据数据处理，仅android端使⽤
│   ├── pcie_speed_test           # EP卡典型业务，PCIE传输速率测试Demo
│   └── pcie_video_test           # EP卡典型业务，视频卡Demo
│   └── pcie_download_test        # EP卡RC下载固件启动⽅案Demo
│   └── pcie_auto_test            # EP卡功能⾃动化测试Demo
│   └── windows                   # EP卡Windows测试Demo
└── images                        # 功能验证固件
└── patch*                        # 补丁⽬录
└── third-party                   # 第三⽅依赖
```



Wichtige Verzeichnisse:

core/framework implementiert gemeinsame RC/EP-Funktionen: Speicherverwaltung, Protokollierung, linked_list, DMA, PCIe CONFIG und weitere Komponenten.

- framework/core/pcie: DMA-Übertragung und Interaktion mit der Chip-DMA-Konfiguration.
- framework/core/mem: Speicherzuweisung und -freigabe für verschiedene Konfigurationen.
- framework/osal: kapselt Betriebssystemschnittstellen und verbirgt OS-Unterschiede vor höheren Schichten.
- framework/base: Grundstrukturen einschließlich Listen und Warteschlangen.

core/component kapselt RC/EP-Schnittstellen, buf-Verwaltung, Benachrichtigungen und Datenübertragung und stellt APIs ohne Aufruf über das OS bereit. Drei Teile:

- ep_pcie: buf-Verwaltung, Benachrichtigungen und Übertragung auf EP-Seite.
- rc_pcie: dieselben Funktionen auf RC-Seite.
- cc_pcie_type.h und cc_cmp_pcie_type.h: gemeinsame Datenstrukturen und Typen für RC/EP-Kommunikation.

core/api kapselt die Benutzerschnittstellen verschiedener Systeme. Die Quelle nennt vier Teile, listet aber drei:

- ep: RK EP benötigt nur arm; kapselt component/ep_pcie ohne Zusatzlogik.
- rc/windows: Treiberimplementierung mit ioctl-Aufrufen für Benutzer.
- rc/other: Andere Systeme benötigen keine Treiberform; kapselt component/rc_pcie ohne Zusatzlogik.

build: SDK-Build für Linux, Android und Windows.

docs: Dokumentation der EP-Standardplatine.

examples: Tests, Beschreibungen und Anleitungen; siehe README im jeweiligen Verzeichnis.

images: Firmware und Beispiele für direkte grundlegende Funktionstests.

patch*: SDK-Patches für Linux und Android; Anleitungen in patch*/README.

### 8.2 Patchaktualisierung: Quellcode des Aktualisierungspakets in einem Schritt übernehmen

Ziel: Treiberversion der Standardkarte aktualisieren und Patches aus dem Aktualisierungsverzeichnis in einem Schritt anwenden. Verfahren für RK3588:

```text
./ep_patch.sh release patch-kernel5.10/更新包 ./path-to-dst/
```

RK3568:

```text
./ep_patch.sh release patch-kernel4.19/更新包 ./path-to-dst/
```

Ergänzung: Patchpakete erzeugen:

```text
./ep_patch.sh release ./.. patch-kernel5.10/更新包
cd ./../kernel/
git checkout develop-4.19
cd -
./ep_patch.sh kernel ./.. patch-kernel4.19/更新包
```

### 8.3 Funktion: wesentliche Protokollinformationen

#### 8.3.1 Wesentliche lspci-Informationen am RC

Prüfen: BARs sind aktiviert und korrekt zugewiesen.

MSI ist aktiviert und korrekt zugewiesen; LnkCap unterstützt Gen3x4, ASPM wird nicht unterstützt; LnkSta zeigt Gen3x4; Kernel driver in use: pcie-rkep. Beispielprotokoll:

```text
01:00.0 Class 1200: Device 1d87:356a (rev 01)
        Control: I/O- Mem+ BusMaster+ SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR-
FastB2B- DisINTx+
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort-
>SERR- <PERR- INTx-
        Latency: 0
        Interrupt: pin A routed to IRQ 157
        Region 0: Memory at f0400000 (32-bit, non-prefetchable) [size=4M]
        Region 2: Memory at 900000000 (64-bit, prefetchable) [size=64M]
        Region 4: Memory at f0200000 (32-bit, non-prefetchable) [size=1M]
        Capabilities: [40] Power Management version 3
                Flags: PMEClk- DSI- D1+ D2+ AuxCurrent=375mA PME(D0+,D1+,D2-,D3hot+,D3cold-)
                Status: D0 NoSoftRst+ PME-Enable- DSel=0 DScale=0 PME-
        Capabilities: [50] MSI: Enable+ Count=4/32 Maskable+ 64bit+
                Address: 00000000fe670040  Data: 0000
                Masking: fffffff0  Pending: 00000000
        Capabilities: [70] Express (v2) Endpoint, MSI 08
                DevCap: MaxPayload 256 bytes, PhantFunc 0, Latency L0s unlimited, L1
unlimited
                        ExtTag+ AttnBtn- AttnInd- PwrInd- RBE+ FLReset- SlotPowerLimit
0.000W
                DevCtl: Report errors: Correctable- Non-Fatal- Fatal- Unsupported-
                        RlxdOrd+ ExtTag+ PhantFunc- AuxPwr- NoSnoop-
                        MaxPayload 256 bytes, MaxReadReq 256 bytes
                DevSta: CorrErr- UncorrErr- FatalErr- UnsuppReq- AuxPwr- TransPend-
                LnkCap: Port #0, Speed 8GT/s, Width x4, ASPM not supported, Exit Latency L0s
<4us, L1 <16us
                        ClockPM- Surprise- LLActRep- BwNot- ASPMOptComp+
```

```text
                LnkCtl: ASPM Disabled; RCB 64 bytes Disabled- CommClk-
                        ExtSynch- ClockPM- AutWidDis- BWInt- AutBWInt-
                LnkSta: Speed 8GT/s, Width x4, TrErr- Train- SlotClk+ DLActive- BWMgmt-
ABWMgmt-
                DevCap2: Completion Timeout: Not Supported, TimeoutDis+, LTR+, OBFF Via
message/WAKE#
                DevCtl2: Completion Timeout: 50us to 50ms, TimeoutDis-, LTR+, OBFF Disabled
                LnkCtl2: Target Link Speed: 8GT/s, EnterCompliance- SpeedDis-
                         Transmit Margin: Normal Operating Range, EnterModifiedCompliance-
ComplianceSOS-
                         Compliance De-emphasis: -6dB
                LnkSta2: Current De-emphasis Level: -6dB, EqualizationComplete+,
EqualizationPhase1+
                         EqualizationPhase2+, EqualizationPhase3+, LinkEqualizationRequest-
        Capabilities: [b0] MSI-X: Enable- Count=128 Masked-
                Vector table: BAR=4 offset=00020000
                PBA: BAR=4 offset=00028000
        Capabilities: [100 v2] Advanced Error Reporting
                UESta:  DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP-
ECRC- UnsupReq- ACSViol-
                UEMsk:  DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP-
ECRC- UnsupReq- ACSViol-
                UESvrt: DLP+ SDES+ TLP- FCP+ CmpltTO- CmpltAbrt- UnxCmplt- RxOF+ MalfTLP+
ECRC- UnsupReq- ACSViol-
                CESta:  RxErr- BadTLP- BadDLLP- Rollover- Timeout- NonFatalErr-
                CEMsk:  RxErr- BadTLP- BadDLLP- Rollover- Timeout- NonFatalErr+
                AERCap: First Error Pointer: 00, GenCap+ CGenEn- ChkCap+ ChkEn-
        Capabilities: [148 v1] #19
        Capabilities: [168 v1] Address Translation Service (ATS)
                ATSCap: Invalidate Queue Depth: 00
                ATSCtl: Enable-, Smallest Translation Unit: 00
        Capabilities: [178 v1] Page Request Interface (PRI)
                PRICtl: Enable- Reset-
                PRISta: RF- UPRGI- Stopped+
                Page Request Capacity: 00000001, Page Request Allocation: 00000000
        Capabilities: [188 v1] Latency Tolerance Reporting
                Max snoop latency: 0ns
                Max no snoop latency: 0ns
        Capabilities: [190 v1] L1 PM Substates
                L1SubCap: PCI-PM_L1.2+ PCI-PM_L1.1+ ASPM_L1.2+ ASPM_L1.1+ L1_PM_Substates+
                          PortCommonModeRestoreTime=10us PortTPowerOnTime=10us
        Capabilities: [1a0 v1] #16
        Capabilities: [1d0 v1] Vendor Specific Information: ID=0002 Rev=4 Len=100 <?>
        Capabilities: [2d0 v1] Vendor Specific Information: ID=0006 Rev=0 Len=018 <?>
        Capabilities: [2e8 v1] #15
        Kernel driver in use: pcie-rkep
```

#### 8.3.2 spl.bin-Startprotokoll am EP

Die Ausgabe „already linkup“ in der Kernel-Phase prüfen. Beispiel:

```text
... #spl关键打印

U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: 188259 - PHY Mode 0x4
RKEP: 189537 - RKEP: GRF:904=7, a04=7...
RKEP: 190138 - RKEP: GRF:904=7, a04=f...
RKEP: 190487 - RKEP: GRF:904=f, a04=f...
RKEP: 190827 - RefClock in common clock_mode
RKEP: 200593 - BAR0: 0x3c000000
RKEP: 200864 - BAR2: 0x010000000
RKEP: 201247 - init PCIe fast Link up
RKEP: 218243 - Link up 230011
RKEP: 259699 - Done

... #内核关键打印

[00-06-34.831][    3.148198] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[00-06-34.834][    3.149015] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[00-06-34.834][    3.149027] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[00-06-34.837][    3.149046] rk-pcie-ep fe150000.pcie: already linkup
[00-06-34.837][    3.149320] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
```



#### 8.3.3 pcie.bin-Startprotokoll am EP

Die Laufzeit von pcie.bin prüfen und festhalten.

| Version | Dauer |
| --- | --- |
| V1.00 | 360ms |

SPL gibt „already link up“ aus, der Kernel „already linkup“. Beispielprotokoll:

```text
#pcie.bin关键打印
PCIe_EP Release Time: Jan  2 2025 V2.20
Gen3x4
```

```text
phyMode4
HW
controlelr initialed
GRF:904=0007, a04=0007...
GRF:904=004F, a04=004F...
phy locked
phy initialed
vid=0x1D87 did=0x356A
ms=000C
Linking, ltssm:
00000001
00000002
00000007
00210022
00210023
00230011
Link up
rst_fun1
Link stable, ltssm
00230011
out

... #spl关键打印

U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: already link up

... #内核关键打印

[00-06-34.831][    3.148198] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[00-06-34.834][    3.149015] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[00-06-34.834][    3.149027] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[00-06-34.837][    3.149046] rk-pcie-ep fe150000.pcie: already linkup
[00-06-34.837][    3.149320] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
```

### 8.4 Funktion: Firmware schreiben

Anhand des Abschnitts zur einzelnen EP-Karte am allgemeinen RC feststellen, ob ein schneller Start nötig ist und welches Speicherverfahren verwendet wird. Dann PC-Updates für Einzelspeicher, Doppelspeicher oder EP Boot prüfen. Details im Abschnitt zum EP-Firmwarebuild.

### 8.5 Leistung: Userspace-Beispiel pcie_speed_test

#### 8.5.1 Testziele

Geprüft werden die Grundfunktionen:

- Wired DMA auf RC-Seite zum EP, DMA-Rate und bidirektionales DMA;
- Local DMA auf RC-Seite zum RC, DMA-Rate und bidirektionales DMA;
- BAR-Mapping und normaler Zugriff;
- ELBI: RC benachrichtigt EP durch ein Interrupt-Ereignis;
- MSI: EP benachrichtigt RC durch ein Interrupt-Ereignis.

Je nach Anforderungen zusätzlich Local DMA RC → EP mit DMA-fähigem RK RC, dessen Rate sowie Firmwaredownload prüfen. Die Richtungsbegriffe wurden aus der Quelle beibehalten.

#### 8.5.2 Testverfahren

Details: examples/pcie_speed_test/README.md.

#### 8.5.3 Ergebnisse RK3588 Gen3x4

Hardware:

- RC: RK3588-EVB1-LP4X-V10, PCIe 3.0 4 lanes; großer Kern 2.4G, kleiner Kern 1.8G, CPU/DRAM fest auf hoher Frequenz.
- EP: RK3588-EVB4-LP4X-V10, PCIe 3.0 4 lanes; großer Kern 2.4G, kleiner Kern 1.8G, CPU/DRAM fest auf hoher Frequenz.

Version: Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz. EP-DMA, task_num = 1. Ergebnisse der Quelle:

| DMA-Größe | 64B | 256B | 4K | 64KB | 1MB | 4MB |
| --- | --- | --- | --- | --- | --- | --- |
| RC-Lesen (DMA-Schreiben) | 0.16MB/S | 0.65MB/S | 10.4MB/S | 165.8MB/S | 1898.7MB/S | 3271.3MB/s |
| RC-Schreiben (DMA-Lesen) | 0.17MB/S | 0.73MB/S | 11.0MB/S | 171.1MB/S | 1630.6MB/S | 1735.6MB/s |

Bei vom RC gestartetem Test mit standardmäßigem EP-DMA entspricht Schreiben einem EP-DMA-Lesen und Lesen einem EP-DMA-Schreiben. Kleinere Blöcke verursachen mehr Scheduling und geringere Leistung; Multithreading kann den Gesamtdurchsatz erhöhen.

#### 8.5.4 Ergebnisse RK3588 Gen2x1

Hardware: RC RK3588-EVB1-LP4X-V10, PCIe 3.0 4 lanes, großer Kern 2.4G, kleiner Kern 1.8G. EP RK3588-EVB4-LP4X-V10, PCIe 3.0 4 lanes auf Gen2 1 lane reduziert, gleiche Frequenzen. Version: Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz. Parameter:

EP-DMA, task_num = 1. Ergebnisse:

| DMA-Größe | 64B | 256B | 4K | 64KB | 1MB | 4MB |
| --- | --- | --- | --- | --- | --- | --- |
| Schreiben | 0.16MB/S | 0.64MB/S | 10.2MB/S | 147.6MB/S | 394.0MB/S | 396.2MB/s |
| Lesen | 0.17MB/S | 0.70MB/S | 11.0MB/S | 149.2MB/S | 384.0MB/S | 384.1MB/s |

Beim RC-Test mit EP-DMA entspricht Schreiben einem EP-DMA-Lesen und Lesen einem EP-DMA-Schreiben. Kleinere Granularität erhöht das Scheduling und senkt die Rate; Multithreading kann die Gesamtleistung steigern.

#### 8.5.5 Ergebnisse RK1820 Gen2x1

Hardware: RC RK3588-EVB1-LP4X-V10, PCIe 3.0 4 lanes, großer Kern 2.4G, kleiner Kern 1.8G; EP RK1820, PCIe 2.0 1 lane. RC-Version: Rockchip_PCIE_EP_Standard_Card_20250523_V3.1.0.tar.gz. EP: RK RT-Thread SDK, Zweig develop-v5.1.x. EP-DMA, task_num = 1. Ergebnisse für RK1820-DRAM:

| DMA-Größe | 64B | 256B | 4K | 8K | 64KB | 512KB |
| --- | --- | --- | --- | --- | --- | --- |
| RC-Schreiben (EP-DMA-Lesen) | 3MB/S | 10MB/S | 136MB/S | 188MB/s | 303MB/s | 317MB/s |
| RC-Lesen (EP-DMA-Schreiben) | 3MB/S | 11MB/S | 143MB/S | 237MB/S | 363MB/s | 382MB/s |

Beim RC-Test mit EP-DMA entspricht Schreiben einem EP-DMA-Lesen und Lesen einem EP-DMA-Schreiben. Kleine Blöcke erhöhen das Scheduling und senken die Rate; mehrere Threads können den Gesamtdurchsatz steigern. Anders als Linux ist RT-Thread ein Echtzeitsystem, in dem Userspace-Programme schnell

auf Interrupts reagieren können, sodass auch kleine Blöcke einen hohen Durchsatz behalten.

### 8.6 Leistung: Userspace-Beispiel pcie_loopback_test

#### 8.6.1 Testziel

Für einen typischen Paket-Sende- und Empfangsvorgang wird die Antwortdauer des seriellen Ablaufs gemessen.

![Technische Originalabbildung, Seite 38](/docs/rockchip-pcie-ep-standard-card/assets/en-p038-vector-06.png)

*Technische Originalabbildung, Seite 38*

#### 8.6.2 Testverfahren

Die Quelle verweist für Details auf examples/pcie_speed_test/README.md.

#### 8.6.3 Ergebnisse RK3588 Gen2x1

Hardware: RC RK3588-EVB1-LP4X-V10, PCIe 3.0 4 lanes, großer Kern 2.4G, kleiner Kern 1.8G.

EP RK3588-EVB4-LP4X-V10, PCIe 3.0 4 lanes auf Gen2 1 lane reduziert, großer Kern 2.4G, kleiner Kern 1.8G. Version: Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz. EP-DMA, task_num = 1. Ergebnisse:

| DMA-Größe | 4K |
| --- | --- |
| min/max | 105us/724us |

Beim RC-Test mit EP-DMA entspricht Schreiben einem EP-DMA-Lesen und Lesen einem EP-DMA-Schreiben. Die Statistik wird nach der ersten Testsekunde erhoben, um Initialisierungseinflüsse auszuschließen. Sie beschreibt den besten Fall kontinuierlicher Übertragung; für den schlechtesten Fall passende Pausen und weitere Lasten einstellen.

#### 8.6.4 Ergebnisse RK1820 Gen2x1

RC RK3588-EVB1-LP4X-V10, PCIe 3.0 4 lanes, großer Kern 2.4G, kleiner Kern 1.8G. EP RK1820, PCIe 2.0 1 lane. RC-Version: Rockchip_PCIE_EP_Standard_Card_20250523_V3.1.0.tar.gz; EP: RK RT-Thread SDK, Zweig develop-v5.1.x. EP-DMA, task_num = 1. Ergebnisse für RK1820-DRAM:

| DMA-Größe | 4K |
| --- | --- |
| min/max | 83us/139us |

Hinweise:

Bei Initiierung durch den RC mit EP-DMA ist Schreiben tatsächlich EP-DMA-Lesen und Lesen EP-DMA-Schreiben. Die Statistik nach der ersten Sekunde schließt die Initialisierung aus. Gezeigt wird der beste Fall kontinuierlicher Übertragung; Pausen und Zusatzlasten sind für die Modellierung des schlechtesten Falls erforderlich.

### 8.7 Kompatibilität: Enumeration

Ziel: Kompatibilität und Robustheit von Erkennung, Identifizierung und Enumeration der EP-Platine auf verschiedenen RCs prüfen. Wichtige RCs für RK EP:

| EP-Gerät | RC-Gerät | Kaltstart | Aufwachen | Warmstart | Prüfmethode |
| --- | --- | --- | --- | --- | --- |
| RK3588 EVB4 V11 | RK3588 EVB1 V10 | 20/20 | 20/20 | 20/20 | Linux: lspci \| grep 356a |
| RK3588 EVB4 V11 | PC ubuntu | 20/20 | 20/20 | 20/20 | Linux: lspci \| grep 356a |
| RK3588 EVB4 V11 | PC windows | 20/20 | 20/20 | 20/20 | Geräte im Geräte-Manager prüfen |
| RK3568 iotest-Gerät | RK3588 EVB1 V10 | 20/20 | 20/20 | 20/20 | Linux: lspci \| grep 356a |
| RK3568 iotest-Gerät | PC ubuntu | 20/20 | 20/20 | 20/20 | Linux: lspci \| grep 356a |

Hinweise: Das Endprodukt sollte möglichst viele Ziel-RCs abdecken.

PC-Kaltstart: Strom ausschalten, einschalten, POWER drücken.

Aufwachen:

- RK RC: mit POWER in den Ruhezustand und zurück.
- Ubuntu: Desktopversion über die Oberfläche; andere Fälle sind zu klären.
- Windows: Die Quelle nennt CTRL+L; andere Fälle sind zu klären.

RK3588-Warmstart: root-Rechte erhalten und reboot in der Shell ausführen.

Ubuntu: reboot mit root-Rechten ausführen. Windows: ALT+F4 auf dem Desktop öffnet Neustartoptionen; manche PCs unterstützen Neustart über die Einschalttaste.

### 8.8 Kompatibilität: EP-Reset und erneute RC-Enumeration

Ziel: Robustheit bei eigenständigem EP-Reset — PCIe remove/rescan, Wiederherstellung der Kommunikation und normaler Anwendungsbetrieb. Erst nach erfolgreichen vorherigen Funktionstests prüfen. examples/pcie_auto_test kompilieren und die Umgebung nach examples/pcie_auto_test/README.md einrichten.

Für Gerät 0 auf dem RC `./pcie_auto_test_rc 2 0` und `./pcie_auto_test_rc 3 0` für Remove und Rescan ausführen. Zur Prüfung von Kommunikationswiederherstellung und Anwendung `./pcie_auto_test_rc 0 0` für die API-Stabilität von Gerät 0 ausführen.

### 8.9 Funktion: OTA

Anhand des Abschnitts zur einzelnen EP am allgemeinen RC Schnellstartbedarf und Speicherverfahren bestimmen. Anschließend OTA für Einzelspeicher, Doppelspeicher oder EP Boot prüfen. Details im Abschnitt EP-Karten-OTA.

## 9. Chips Connect-Fehlerbehandlung

### 9.1 mmap failed, Operation not permitted bei PCIe-Initialisierung auf x86 RC

```text
root@rk:/home/rc-sample# ./pcie_test 10240
resource path = /sys/bus/pci/devices/0000:01:00.0/enable
resource path = /sys/bus/pci/devices/0000:01:00.0/resource0
mmap failed, ret = 0, Operation not permitted
ep dev num : 1
Segmentation fault (core dumped)
```

Antwort der Quelle: Ab Ubuntu 20.04 wird Kernel-Lockdown verwendet. Aktiviertes Secure Boot im BIOS aktiviert Lockdown und führt zum mmap-Fehler. Die Quelle schlägt vor, Secure Boot im BIOS zu deaktivieren. Das verändert den Systemschutz und wurde hier nicht ausgeführt; die Anwendbarkeit ist für das konkrete System zu prüfen.

### 9.2 HugePage-Konfiguration

RK unterstützt Hugepages mit 2M, 32M und 1GB; andere Plattformen hängen vom System ab. Eine Hugepage muss größer als ein einzelner Sende- und Empfangspuffer des SDK sein; die Seitenzahl muss alle BUFFs abdecken. Beispiel: fünf Sendepuffer mit je 4M und fünf Empfangspuffer mit je 8M. 2M reicht nicht; mindestens 32M einstellen.

Sendeseiten: (int) (5 / (32M / 4M)) + 1 = 1.
Empfangsseiten: (int) (5 / (32M / 8M)) + 1 = 2.
Ergebnis: default_hugepagesz=32M, hugepagesz=32M, hugepages=3.

#### 9.2.1 X86-Plattform

Hugepagesize prüfen.

```text
rk@debian:~$ cat /proc/meminfo | grep Huge
HugePages_Total:       2
HugePages_Free:        2
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:    2048 kB
Hugetlb:         4096 kB
```

Größe auf 1GB ändern.

cmdline ändern: In /etc/default/grub default_hugepagesz=1G hinzufügen.

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet default_hugepagesz=1G hugepagesz=1G hugepages=1"
GRUB_CMDLINE_LINUX=""
```

Konfiguration erzeugen.

```text
/usr/sbin/grub-mkconfig -o /boot/grub/grub.cfg
```

Gerät neu starten: reboot oder systemctl poweroff. Größe und Anzahl prüfen: cat /proc/meminfo \| grep Hugepagesize.

```text
rk@debian:~$ cat /proc/meminfo | grep Huge
HugePages_Total:       1
HugePages_Free:        1
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:    1048576 kB
Hugetlb:         1048576 kB
```

#### 9.2.2 RK-Plattform

Hugepage im Kernel aktivieren:

```text
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -1,5 +1,10 @@
 CONFIG_DEFAULT_HOSTNAME="localhost"
 CONFIG_SYSVIPC=y
+CONFIG_HUGETLBFS=y
 CONFIG_NO_HZ=y
 CONFIG_HIGH_RES_TIMERS=y
 CONFIG_PREEMPT_VOLUNTARY=y
```

Für 16 Seiten mit je 32M drei Eigenschaften zur cmdline hinzufügen: default_hugepagesz=32M hugepagesz=32M hugepages=16.

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait";
+               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait default_hugepagesz=32M hugepagesz=32M hugepages=16";
        };

        cspmu: cspmu@fd10c000 {
```

Kernel neu kompilieren und schreiben. Nach dem Start /proc/meminfo prüfen.

```text
[root@RK3588:/userdata]# cat /proc/meminfo | grep Huge
HugePages_Total:      16
HugePages_Free:       16
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:      32768 kB
Hugetlb:         1048576 kB
```

### 9.3 Kernelfehler oder Bus error beim Zugriff auf user cmd oder ep info nach Abruf über die API

Zwei Hauptursachen:

1. Verwendung von memset oder memcpy für diesen Speicherbereich.

2. Optimierungsstufe der Anwendung oberhalb -O1. Im ersten Fall memset/memcpy entfernen und eine for-Schleife verwenden.

Im zweiten Fall die Optimierungsstufe senken oder -fno-tree-loop-optimize zum Abschalten der Schleifenoptimierung hinzufügen.

### 9.4 Windows-Treiber-Buildumgebung

Entwicklungs- und Testumgebung der Quelle: Windows 10 2004, WDK 10.0.19041.685.

1. Systemversion prüfen.

Computereigenschaften öffnen oder Win+R → winver verwenden. Die Quelle nennt insbesondere Build 19042.1052.

```text
版本                Windows 10 专业版
版本号              20H2
安装⽇期            2021/6/5
操作系统内部版本     19042.1052
```

2. VS2019 und WDK anhand ihrer Installationsanleitungen installieren.

3. Die Quelle nennt drei Verfahren zum Deaktivieren der Treibersignaturprüfung:

- Erweiterte Startoptionen nach Neustart (üblicherweise F8): Deaktivierung der Signaturerzwingung wählen, sofern verfügbar.
- Administrator-Eingabeaufforderung: bcdedit /set testsigning on. Die Quelle nennt dies vorübergehende Deaktivierung.
- Lokale Gruppenrichtlinie für Windows Pro und höher: gpedit.msc → Computerkonfiguration → Administrative Vorlagen → System → Treiberinstallation; Zulassung unsignierter Treiber prüfen.

Nach Neustart nennt die Quelle Test Mode unten rechts als Kennzeichen und erklärt, andernfalls lasse sich der Treiber nicht installieren. Diese Schutzänderungen wurden hier nicht ausgeführt; Test Mode und deaktivierte Signaturprüfung dürfen nicht automatisch gleichgesetzt werden.

4. build/windows/rk_projects/rk_projects.sln öffnen. rc_pcie ist das Treiberprojekt. Wegen veralteter APIs nach Windows 10 2004 gibt es vier in der Quelle beschriebene Konfigurationen:

- Debug_eq_win10_2004: Debug, Systeme neuer als Windows 10 2004.
- Debug_less_win10_2004: Debug, Systeme bis einschließlich Windows 10 2004.
- Release_eq_win10_2004: Release, Systeme neuer als Windows 10 2004.
- Release_less_win10_2004: Release, Systeme bis einschließlich Windows 10 2004.

examples ist das Testprojekt mit Debug und Release. Treiber und Tests werden nach erfolgreichem Build unter build/windows/rk_projects/x64 ausgegeben.

### 9.5 MSVCP140.dll und vcruntime140.dll nicht gefunden

Visual C++ Redistributable for Visual Studio 2015 installieren.

### 9.6 Windows-Debugging-Einstellung durch Secure Boot geschützt und nicht änderbar oder löschbar

Die Quelle schlägt vor, im BIOS für Windows 10 secure boot auf disable zu setzen. Dies verändert den Systemschutz und wurde hier nicht ausgeführt.

## 10. Chips Connect-API-Referenz

Siehe Rockchip_Developer_Guide_PCIE_EP_Standard_Card_APIs.

{% endraw %}
