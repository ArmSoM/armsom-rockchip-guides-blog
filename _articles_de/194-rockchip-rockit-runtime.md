---
title: "Entwicklerhandbuch zur Rockchip Rockit Runtime"
description: "Entwicklerhandbuch zur Rockchip Rockit Runtime - V2.28.0: RRT, VALLOC, VLOG, VSYS, VENC, IVS, VRGN, VRGA"
excerpt: "Entwicklerhandbuch zur Rockchip Rockit Runtime"
translation_key: "194-rockchip-rockit-runtime"
slug: "194-rockchip-rockit-runtime"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux, Rockit, VENC]
---

{% raw %}

# Entwicklerhandbuch zur Rockchip Rockit Runtime

Grundlage sind die bereitgestellten chinesischen und englischen Rockchip-Dokumente V2.28.0 vom 2025-04-27; die technischen Kapitel 3-13 bleiben erhalten. Im Englischen fehlende Angaben wurden aus dem chinesischen Text ergänzt; Abweichungen sind gekennzeichnet. Diese ArmSoM-Plattformreferenz erfordert die Prüfung von konkreter Platine, SoC, SDK/BSP, Kernel und Peripherie. Sie belegt keine Unterstützung aller ArmSoM-Platinen. Es wurden keine Befehle oder Hardwaretests ausgeführt.

| SoC | Kernelversion |
| --- | --- |
| RV1106/RV1103 | Linux 5.10 |
| RV1103B/RV1106B | Linux 5.10 |
| RK3308 | Linux 6.1 |
| RK3506 | Linux 6.1 / rt-thread 4.1 |
| RV1126B | Linux 6.1 |

## 3. Architektur

Zur einfacheren Portierung von Rockit wurde eine neue Laufzeitbibliothek im Kernel entwickelt, im Folgenden RRT. Ihre Architektur ist unten dargestellt.

![Entwicklerhandbuch zur Rockchip Rockit Runtime - RRT](/docs/rockchip-rockit-runtime/assets/en-p004-figure-01.png)



```text
.
├── isp.ko   ---- isp - Modul, Knoten /dev/mpi/rkisp-vir0
├── valloc.ko  --- Puffermanager, Knoten /dev/mpi/valloc
├── venc.ko    --- Encoder - Modul, Knoten /dev/mpi/venc
├── vmpi.ko    --- Medienframework, Knoten /dev/mpi/vmpi
├── vpss.ko    --- vpss - Modul, Knoten /dev/mpi/vpss
├── vrga.ko    --- rga - Modul, Knoten /dev/mpi/vrga
├── vrgn.ko    --- rgn - Modul, Knoten /dev/mpi/vrgn
├── vsys.ko    --- system - Modul, Knoten /dev/mpi/vsys
└── vvi.ko     --- vi - Modul, Knoten /dev/mpi/vvi
```



Vor der Verwendung der rockit-Schnittstellen müssen die aufgeführten ko-Module geladen werden. Alle diese Module wurden zu einem einzigen ko zusammengefasst, das mit folgendem Befehl geladen wird:



```text
insmod rockit.ko
```



Prüfen Sie das erfolgreiche Laden mit folgendem Befehl:



```text
# lsmod
Module                  Size  Used by    Tainted: G
rknpu                  21535  1
rockit                 90530 14
mpp_vcodec            350020  4 rockit
rga3                   76968  3 rockit
sc4336                  8940  2
phy_rockchip_csi2_dphy     7657  0
phy_rockchip_csi2_dphy_hw     7644  0
video_rkisp           138585  3 rockit,[permanent]
video_rkcif           107889  4
rk_dvbm                 5813  2 mpp_vcodec,video_rkisp
```



Nach erfolgreichem Laden können Programme ausgeführt werden, die von rockit.so abhängen.

### 3.1 Vom KO unterstützte Parameter

#### 3.1.1 mcu_fw_path

Pfad zur MCU-Firmware für den Wrapping-Modus. Standardmäßig leer; die MCU-Firmware wird nicht geladen.



```text
insmod rockit.ko mcu_fw_path=/oem/usr/ko/hpmcu_wrap.bin
```



#### 3.1.2 mcu_fw_addr

Adresse der MCU-Firmware für den Wrapping-Modus. Standard: 0xff6ff000 für RV1106 und 0x210f6000 für RV1103B.



```text
insmod rockit.ko mcu_fw_addr=0xff6ff000
```



#### 3.1.3 isp_max_h

Höhe des Eingangs vor dem ISP. Bei VICAP-Zuschnitt verlangt die Quelle die „Breite nach dem Zuschnitt“. Dies widerspricht der Definition als Höhe und muss anhand des SDK geprüft werden. Bei falscher Einstellung zeigt cat /dev/mpi/vlog den richtigen Wert. Diagnosezeile:

```text
mpi_log_err("isp input height config err, config h= %d, real h = %d", isp_max_h, isp_h);
```





```text
insmod rockit.ko isp_max_h=1920
```



#### 3.1.4 isp_max_w

Reserviert.

#### 3.1.5 en_mcu

Aktivierung des MCU-Treibers. Standardmäßig bei RV1106 aktiviert und bei RV1103B deaktiviert. Bei Deaktivierung wird der MCU-Treiber nicht geladen.



```text
insmod rockit.ko en_mcu=0
```



#### 3.1.6 rk_dma_heap_base

Die Startadresse des durch RK_MPI_SYS_RelasePhyMemory freizugebenden MMZ muss an 4K ausgerichtet sein und oberhalb des MMZ-Anfangs liegen. MMZ-Anfang = gesamter physischer Speicher - MMZ-Größe.



```text
insmod rockit.ko rk_dma_heap_base=0x40000
```



#### 3.1.7 rk_dma_heap_size

Die durch RK_MPI_SYS_RelasePhyMemory freizugebende MMZ-Größe darf die MMZ-Größe nicht überschreiten.



```text
insmod rockit.ko rk_dma_heap_size=0x40000
```



## 4. Plattformübergreifende Portierung

RRT wurde um die Betriebssystem-Abstraktionsschicht OSAL ergänzt und darauf umgestellt. Sie läuft im Linux-Kernelmodus, im Linux-Benutzermodus und unter RTOS. Auf RV1103B/RV1126B gibt es zwei RRT-Instanzen: eine im Benutzer- und eine im Kernelmodus. Zum Anzeigen der /dev/mpi/xxx-Knoten im Linux-Benutzermodus und unter RTOS wird dumpsys vor den ursprünglichen Befehl gesetzt:

```text
dumpsys cat /dev/mpi/valloc
dumpsys cat /dev/mpi/vsys
dumpsys cat /dev/mpi/vlog
dumpsys cat /dev/mpi/vrgn
```



## 5. Plattformübergreifende Kommunikation

Auf einem SoC können mehrere RRT-Instanzen laufen. Zur Vereinfachung der Zusammenarbeit zwischen Modulentwicklern unterstützt RRT plattformübergreifende Kommunikation: VALLOC verwaltet die plattformübergreifenden BUFFER-Referenzzähler, VSYS übernimmt Verbindungen und BUFFER-Übertragung. Voraussetzung ist, dass die RRT-Instanzen BUFFER über physischen Speicher gemeinsam nutzen können. Die Tabelle zeigt die unterstützten RRT-Instanzen und ihre Module je SoC.

| SOC | RRT (Linux-Kernelmodus) | RRT (Linux-Benutzermodus) | RRT (rt-thread) |
| --- | --- | --- | --- |
| RV1106/RV1103 | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | Nicht unterstützt | Nicht unterstützt |
| RV1103B/RV1106B | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | VDEC / VO / VRGN / AI / AO /<br>AENC / ADEC / AMIX / AF / TDE /<br>VALLOC / VSYS / TDE | Nicht unterstützt |
| RK3308 | Nicht unterstützt | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO | Nicht unterstützt |
| RK3506 | Nicht unterstützt | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO / TDE | VALLOC / VSYS / VRGN / VDEC /<br>AI / AO / ADEC / AENC / AMIX /<br>AF / VO / TDE |
| RV1126B | VI / VPSS / VENC / AVS /<br>VRGN / VALLC / VSYS /<br>GDC / IVS | VI / VALLOC / VSYS / VRGN / VDEC<br>/ AI / AO / ADEC / AENC / AMIX /<br>AF / VO / TDE | Nicht unterstützt |

## 6. VALLOC

VALLOC weist Speicher für das Medienframework zu und verwaltet ihn. Der aktuelle Speicherzustand lässt sich wie folgt anzeigen:



```text
cat /dev/mpi/valloc
```



Feldbeschreibung:

| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| module | Modulinformationen | Modulname |
| version | Versionsinformationen | Repository-Name: Commit: Versionsnummer |
| build | Build-Informationen | Compiler und Kompilierungsdatum |
| mpi buf<br>list | Trennzeile der Pufferliste | Es folgen Informationen zu BUF |
| buf_id | Auf dieser Plattform eindeutige ID | Identifiziert MPI BUF, entsprechend einem HANDLE. Zwei IDs werden angezeigt; die ID in Klammern ist plattformübergreifend eindeutig |
| pool | ID des Pufferpools | Pool, zu dem mpi buf gehört; -1 bedeutet kein Pool |
| ref | Nutzungszähler für MPI buf | +1 vor der Nutzung, -1 danach; bei Zählerstand 0 und ohne Pool wird mpi buf freigegeben (chinesischer Wortlaut; Englisch setzt 0 mit fehlendem Pool gleich) |
| dma | Nutzungszähler für DMA buf | +1 vor der Nutzung, -1 danach; bei 0 wird dma_buf freigegeben |
| use | Von anderen RRT-Instanzen hinzugefügte Referenzen | Bei ref - use == 0 verwendet diese RRT-Instanz den BUF nicht |
| basefd | Basis-fd von dma buf | Für RRT im Linux-Kernelmodus gilt basefd = -1 |
| status | Aktueller Pufferzustand | bit0: 1 - Objekt registriert, 0 - Ressource freigegeben; bit1: 1 - zugänglich, 0 - unzugänglich; bit2: 1 - gelöscht, 0 - nicht gelöscht; bit3: 1 - Löschen verboten, 0 - erlaubt; bit4: 1 - privates Objekt, 0 - öffentlich; bit5: 1 - ID bleibt beim Löschen erhalten, 0 - nicht erhalten; bit6: 1 - überwachbar, 0 - nicht überwachbar; bit7-9: reserviert; bit10: 1 - BUFFER gelöscht; bit11-31: reserviert |
| size | Puffergröße | Einheit: BYTE; 0 bedeutet Wrapping-Modus |
| handle | Puffer-Handle | Bei RV1106 ist dies die physische Adresse |
| vaddr | Virtuelle Adresse | Virtuelle RTOS-Adresse (gleich der physischen Adresse) |
| paddr | Physische Adresse | Peripherieadresse auf dem IC-Bus |
| memtype | Speicherpooltyp | cma: zusammenhängender Speicher; system: nicht zusammenhängender Speicher; memfd: gemeinsam genutzter Speicher zwischen Linux-Benutzerprozessen |
| create | Ersteller des Puffers | Erfasst die Zuweisung des BUFFER; deleted bedeutet, dass dessen Ersteller gelöscht wurde |
| user | Benutzer des Puffers | Für alle umlaufenden BUFFER wird der aktuelle Benutzer erfasst; hierzu zählen auch POOLs |
| total | Gesamtspeicher | Einheit: BYTE |
| mpi pool<br>list | Trennzeile der Poolliste | Es folgen Informationen zu POOL |
| poid | Global eindeutige ID | pool_id = poid bedeutet, dass BUFFER zu diesem POOL gehört |
| nkid | Benutzerdefinierte ID | Bei Import dieses POOL aus dem Benutzermodus ist dies die dortige POOL-ID |
| total | Gesamtzahl der BUFFER |  |

| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| free | Verbleibende Anzahl der BUFFER | Aktuell verfügbare BUFFER |
| min | Minimale Restanzahl | -1 zeigt einen Frameverlust an |
| size | BUFFER-Größe im Pool | Jeder BUFFER muss größer als dieser Wert sein |
| reflevel | REFCNT-Schwelle für freie BUF im POOL | MPI BUF gilt als frei, wenn REFCNT diesen Wert nicht überschreitet |
| status | Aktueller Poolzustand | bit0: 1 - registriert, 0 - Ressource freigegeben; bit1: 1 - zugänglich, 0 - unzugänglich; bit2: 1 - gelöscht, 0 - nicht gelöscht; bit3: 1 - Löschen verboten, 0 - erlaubt; bit4: 1 - privat, 0 - öffentlich; bit5: 1 - ID bleibt beim Löschen erhalten, 0 - nein; bit6: 1 - Überwachung unterstützt, 0 - nein; bit7-31: reserviert |
| create | Ersteller des Pools |  |
| user | Benutzer des Pools |  |

## 7. VLOG

Protokollmanager des Medienframeworks.

### 7.1 Kernelprotokoll anzeigen



```text
cat /dev/mpi/vlog
```



### 7.2 Protokollstufe eines Moduls einstellen

Der Befehl `echo module=level > /tmp/rt_log_level` ändert die Protokollstufe des Moduls gleichzeitig für rockit so und ko. Zulässige module: all cmpi mb sys vdec venc rgn vpss vgs tde avs wbc vo vi ai ao aenc adec. Stufen: 0,1,2,3,4,5,6; 2 - ERR (rot), 3 - WRN (gelb), 4 - INF (grün).

```text
echo module=level > /tmp/rt_log_level
```



### 7.3 Ausgabepfad und Größe des SO-Protokolls



```text
echo rt_log_path=/tmp/rockit.log > /tmp/rt_log_level

echo rt_log_size=1024000 > /tmp/rt_log_level
```



### 7.4 Protokoll löschen



```text
echo 0 > /dev/mpi/vlog
```



## 8. VSYS

VSYS verwaltet die Verbindungen der Medienmodule. Aktuelle Verbindungen und Framerateninformationen zeigt folgender Befehl:

```text
cat /dev/mpi/vsys
```



| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| module | Modulinformationen | Modulname |
| version | Versionsinformationen | Repository-Name: Commit: Versionsnummer |
| build | Kompilierungsinformationen | Compiler - Kompilierungsdatum |
| mpi node list | Trennzeile der Knotenliste | Es folgen Knoteninformationen |
| id | Global eindeutige ID | Identifiziert einen MPI-Knoten, entsprechend einem HANDLE |
| name | Name des Geräts, das NODE erstellt hat | Mehrere NODE können denselben Namen haben |
| handle | NODE-Handle | Speicherzeiger auf die Knotenstruktur |
| nid | Benutzerdefinierte rockit-ID | Benutzerdefinierte ID zur NODE-Verwaltung durch ROCKIT |
| uid | Knoten-ID im Datenflussbaum | Mit dieser ID wird das Benutzerarray von MPI BUF abgefragt, um den aktuellen Besitzer von BUF zu bestimmen |
| ref | Nutzungszähler | +1 vor der Nutzung, -1 danach; Freigabe bei 0 |
| infa_cnt | Anzahl empfangener Frames | Gesamtzahl der vom Knoten empfangenen Frames |
| lcnt | Anzahl verlorener Eingangsframes | Verluste durch fehlende Verarbeitungsmöglichkeit oder Verarbeitungsfehler; Frameratenregelung zählt nicht dazu |
| frate | Empfangsframerate | Statistik pro Sekunde; nicht einstellbar |
| fbase | Verwerfungsfaktor für Eingangsframes | Von fbase empfangenen Frames wird der erste behalten, der Rest verworfen |
| wcnt | Tatsächliche Frameanzahl in der Benutzer-Empfangswarteschlange | Die Benutzerwarteschlange wird über depth dimensioniert; vom Benutzer abgerufene, noch nicht freigegebene Frames werden mitgezählt |
| depth | Tiefe der Benutzer-Empfangswarteschlange | Darf die Gesamtgröße der vorgelagerten BUF-Warteschlange nicht überschreiten, sonst kann die Vorstufe blockieren |
| timeout | Zeitlimit zum Abrufen von Daten aus der Benutzer-Empfangswarteschlange | Einheit: ms |
| onfa_cnt | Anzahl gesendeter Frames | Gesamtzahl der vom Knoten gesendeten Frames |
| lcnt | Anzahl verlorener Ausgangsframes | Verluste durch fehlende Verarbeitungsmöglichkeit oder Verarbeitungsfehler; Frameratenregelung zählt nicht dazu |
| frate | Sendeframerate | Statistik pro Sekunde; nicht einstellbar |
| fbase | Verwerfungsfaktor für Ausgangsframes | Von fbase Ausgangsframes wird der erste gesendet, der Rest verworfen |
| wcnt | Tatsächliche Frameanzahl in der Benutzer-Sendewarteschlange | Die Benutzerwarteschlange wird über depth dimensioniert; abgerufene, noch nicht freigegebene Frames werden mitgezählt |
| depth | Tiefe der Benutzer-Sendewarteschlange | Darf die Gesamtgröße der vorgelagerten BUF-Warteschlange nicht überschreiten, sonst kann die Vorstufe blockieren |
| timeout | Zeitlimit zum Abrufen von Daten aus der Benutzer-Sendewarteschlange | Einheit: ms |
| itime | Zeit zum Empfangen eines Frames | Einheit: us |

| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| otime | Zeit zum Senden eines Frames | Einheit: us |
| state | Aktueller Knotenzustand | bit0: 1 - registriert, 0 - Ressource freigegeben; bit1: 1 - zugänglich, 0 - unzugänglich; bit2: 1 - gelöscht, 0 - nein; bit3: 1 - Löschen verboten, 0 - erlaubt; bit4: 1 - privat, 0 - öffentlich; bit5: 1 - ID bleibt beim Löschen erhalten, 0 - nein; bit6: 1 - überwachbar, 0 - nein; bit7-9: reserviert; bit10: 1 - wird gelöscht; bit11: 1 - aktualisiert BUF; bit12: 1 - in Betrieb; bit13: 1 - mit Vorstufe verbunden; bit14: 1 - automatischer Betrieb bei Verbindung mit der Vorstufe; bit15-31: reserviert |
| next node | ID des nächsten NODE | Ein NODE kann mit mehreren NODE verbunden werden |
| mpi node<br>frame control | Tabelle zur Frameratenregelung des Knotens | Es folgen Informationen zur Frameratenregelung von NODE |
| id | Global eindeutige ID | Identifiziert einen MPI-Knoten, entsprechend einem HANDLE |
| name | Name des Geräts, das NODE erstellt hat | Mehrere NODE können denselben Namen haben |
| table | Tabelle zum Verwerfen von Frames | Größe entspricht der Framerate; n behält n Frames, 0 verwirft (chinesische Quelle). Englisch: 0 behalten, 1 verwerfen; SDK prüfen. |
| mpi dev list | ROCKIT-Geräteliste | Es folgen Geräteinformationen |
| id | Geräte-ID | Global eindeutiger Bezeichner |
| name | Gerätename | Zur einfachen Unterscheidung der Geräte |
| handle | Geräte-Handle | Speicheradresse der Gerätestruktur |
| ref | Referenzzähler | Wird für jede Referenz auf einen geöffneten Handle um 1 erhöht |
| node | NODE auf dem Gerät | Listet die IDs aller NODE des Geräts auf |

## 9. VENC

Die Kodierparameter können mit folgendem Befehl abgerufen werden:

```text
cat /proc/vcodec/enc/venc_info
```


### `venc thread status`

| Parameter | Beschreibung |
| --- | --- |
| last_runing (EN: last_running) | Zeitpunkt des letzten Aufweckens des Threads |
| run_cnt | Anzahl der Thread-Ausführungen |
| que_cnt | Anzahl der Thread-Auslösungen |

### `venc chn running status`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| runing (EN: running) | Ob der Kanal aktiv ist |
| combo_run | Ob kombinierte JPEG-Kodierung im Kanal aktiv ist |
| cfg_gap | Zeit zur Konfiguration der Kanalregister, ms |
| strm_cnt | Anzahl zwischengespeicherter Streams im Kanal |
| strm_out | Anzahl an die Anwendung übergebener Kanalstreams |
| gap_time | Intervall zwischen den letzten beiden Kodierstarts des Kanals, ms |
| cb_gap_time | Intervall zwischen zwei kombinierten JPEG-Kodierungen |
| last_cb_start | Letzter Startzeitpunkt der kombinierten JPEG-Kodierung |
| last_cb_end | Letzter Endzeitpunkt der kombinierten JPEG-Kodierung |
| queue_size | Größe der Pufferwarteschlange im Kanal |
| pkt_total_cnt | Gesamtzahl der Pakete im Kanal |
| pkt_user_get | Anzahl der von der Anwendung aus dem Kanal abgerufenen Pakete |
| pkt_user_put | Anzahl der von der Anwendung freigegebenen Kanalpakete |
| seq_user_get | Seq des aktuell von der Anwendung abgerufenen Streams |
| seq_user_put | Seq des aktuell von der Anwendung freigegebenen Streams |
| seq_encoded | Seq der bereits kodierten Kanaldaten |
| seq_encoding | Seq der aktuell im Kanal kodierten Daten |

### `venc chn attr 1`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Width | Breite des Kodierkanals |
| Height | Höhe des Kodierkanals |
| Type | Typ des Kodierkanals |
| ByFrame | Streamabruf nach Frames: n - nach Paketen (derzeit nicht unterstützt); y - nach Frames |
| Sequence | Sequenz-ID: bei Frameabruf die Framenummer, bei Paketabruf die Paketnummer |
| GOPMode | GOP-Modus |
| Prio | Kanalpriorität |
| MaxWidth | Maximale Breite des Kodierkanals |
| MaxHeight | Maximale Höhe des Kodierkanals |
| Online | Wrapping-Aktivierung (Schreibweise der Quelle) |
| RefShare | Gemeinsame Nutzung des rekonstruierten/Referenzframes |

### `venc chn attr 2`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Vestr | Ob die Kodierung aktiviert ist |
| SrcFr | Quellframerate der VENC-Frameratenregelung, also Eingangsframerate |
| TarFr | Zielframerate der VENC-Frameratenregelung |
| Timeref | VENC-Startzeit |
| PixFmt | Format des aktuell kodierten Frames |
| RealFps | Tatsächliche VENC-Framerate |
| Rotation | Ob VENC-Rotation aktiviert ist |
| Mirror | Ob VENC-Spiegelung aktiviert ist |

### `ring buf status`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| w_pos | Schreibposition im Bitstrompuffer |
| r_pos | Leseposition im Bitstrompuffer |
| used_len | Belegter Platz im Streampuffer |
| total_len | Gesamtgröße des Bitstrompuffers |
| min_size | Minimaler freier Speicher für die Zuweisung eines Frames (Chinesisch; Englisch nennt „zuletzt“) |
| l_w_pos | Zuletzt aktualisierte Schreibposition |
| l_r_pos | Zuletzt aktualisierte Leseposition |
| max_use_len | Maximal belegter Platz im Bitstrompuffer |

### `hw status`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| hw_run | Aktueller Kanal läuft |
| enc_status | Encoderzustand:<br>0: ENC_STATUS_CFG_IN,<br>1: ENC_STATUS_CFG_DONE,<br>2: ENC_STATUS_START_IN,<br>3: ENC_STATUS_START_DONE,<br>4: ENC_STATUS_RUN_TASK_IN,<br>5: ENC_STATUS_RUN_TASK_DONE,<br>6: ENC_STATUS_INT_IN,<br>7: ENC_STATUS_INT_DONE,<br>8: ENC_STATUS_SLICE_INFO_IN,<br>9: ENC_STATUS_SLICE_INFO_DONE |
| pkt_fail_cnt | Anzahl fehlgeschlagener Paketpool-Anforderungen des Encoders |
| ring_fail_cnt | Anzahl fehlgeschlagener Streampuffer-Zuweisungen |
| cfg_fail_cnt | Anzahl fehlgeschlagener Erzeugungen der Hardwarekonfiguration |
| start_fail_cnt | Anzahl fehlgeschlagener Starts der Hardwarekodierung |
| pkt_full_cnt | Anzahl verworfener Frames, weil PACKET 100 überschreitet |

### `hw param`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| qp_dlt_row_i | Maximale zeilenweise QP-Anpassung für I-Frames |
| qp_dlt_row | Maximale zeilenweise QP-Anpassung für P-Frames |
| qbias_en | Aktivierung der Bias-Anpassung |
| qbias_i | Bias-Wert für I-Blöcke |
| qbias_p | Bias-Wert für P-Blöcke |
| flt_str_i | Filterstärke für I-Frames |
| flt_str_p | Filterstärke für P-Frames |
| thrd_i | Tabelle der madi-Blockschwellen für I-Frames |
| thrd_p | Tabelle der madi-Blockschwellen für P-Frames |
| step_i | AQ-Nachschlagetabelle anhand von thrd_i für I-Frames |
| step_p | AQ-Nachschlagetabelle anhand von thrd_p für P-Frames |
| qbias_arr | Bias-Konfiguration |
| aq_rnge_arr | Konfiguration des AQ-Begrenzungsbereichs |

### `fine tunning param`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| scene_mode | Szenenmodus |
| md_swth_en | Umschaltung zwischen Bewegung und Stillstand |
| deblur_str | Stärke der Entunschärfung |
| atr_str | Stärke der Ringing-Unterdrückung |
| atl_str | Stärke der Linienunterdrückung |
| lambda_idx | Lambda-Index für P-Frames |
| lambda_i_idx | Lambda-Index für I-Frames |
| atf_str | Stärke der Flimmerunterdrückung |
| static_frm_num | Frameschwelle zur Erkennung eines unbewegten Blocks |
| madp16_th | madp16-Schwelle für unbewegte Blöcke |
| skip16_wgt | Verstärkung des skip16-Bias |
| skip32_wgt | Verstärkung des skip32-Bias |
| lgt_chg_lvl | Optimierungsstufe für Szenen mit Beleuchtungsänderungen |

### `venc roi attr`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| roi | ROI-Index |
| x | Horizontale Startkoordinate |
| y | Vertikale Startkoordinate |
| w | ROI-Breite |
| h | ROI-Höhe |
| quality | QP-Wert der ROI-Makroblöcke |
| intra | Erzwungene Intra-Kodierung der ROI-Makroblöcke |
| abs_qp | Aktivierung des absoluten QP |

### `hw session infos`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| device | Gerätename |
| hw_running | Hardware-Betriebszustand |
| online | Wrapping-Aktivierung (Schreibweise der Quelle) |
| wrap_ovfl | Anzahl der Wrapping-Überläufe |
| bs_ovfl | Anzahl der Streampuffer-Überläufe |
| wrap_src_mis | Anzahl der Wrapping-Quellabweichungen |
| enc_err_cnt | Anzahl der Encoderfehler |
| enc_err_irq | Wert des Interruptregisters beim Encoderfehler |
| enc_err_st | Wert des Statusregisters beim Encoderfehler |

### `bitstream buffer addr`

| Parameter | Beschreibung |
| --- | --- |
| top | Obere Grenze des Streampufferstapels |
| bot | Untere Grenze des Streampufferstapels |
| wr | Schreibadresse des Streampuffers |
| rd | Leseadresse des Streampuffers |

### `h264e chn attr`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Width | Breite in Pixeln |
| Height | Höhe in Pixeln |
| Profile | Profil des Kodierkanals: Base - baseline; Mp - main profile; Hp - high profile |

### `Syntax INFO1`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Slcsplten | Ob Slice-Aufteilung verwendet wird |
| SplitMode | Slice-Aufteilungsmodus: 1 - nach Bytes; 2 - nach Makroblöcken |
| Slcsize | Slice-Größe; die Bedeutung von slice_size hängt von split_mode ab |
| IntraRefresh | Ob I-Makroblöcke in P-Frames aufgefrischt werden |
| RefreshMode | Auffrischungsmodus für I-Makroblöcke: row - zeilenweise; column - spaltenweise |
| RefreshNum | Anzahl der pro Frame aufgefrischten I-Makroblockzeilen oder -spalten |

### `Syntax INFO2`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Profile | Profil des Kodierkanals: Base - Baseline; MP - Main profile; HP - High profile |
| Cabac | Entropiekodiermodus: cavlc oder cabac |
| Trans8 | Transformationsmodus: standardmäßig nur trans4x4; Y aktiviert trans8x8 |
| ScalingMode | Skalierungslistenmodus |
| Poc | Wert des Syntaxelements pic_order_cnt_type |
| Alpha | Wert des Syntaxelements slice_alpha_c0_offset_div2 |
| Beta | Wert des Syntaxelements slice_beta_offset_div2 |

### `h265e chn attr`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Width | Breite in Pixeln |
| Height | Höhe in Pixeln |
| Profile | Profil des Kodierkanals: main - Hauptprofil |

### `Syntax INFO1`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Slcsplten | Ob Slice-Aufteilung verwendet wird |
| SplitMode | Slice-Aufteilungsmodus: 1 - nach Bytes; 2 - nach Makroblöcken |
| Slcsize | Slice-Größe; die Bedeutung von slice_size hängt von split_mode ab |
| IntraRefresh | Ob I-Makroblöcke in P-Frames aufgefrischt werden |
| RefreshMode | Auffrischungsmodus für I-Makroblöcke: row - zeilenweise; column - spaltenweise |
| RefreshNum | Anzahl der pro Frame aufgefrischten I-Makroblockzeilen oder -spalten |

### `Syntax INFO2`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| Dblken | Negierter Wert von slice_deblocking_filter_disabled_flag |
| Tc | Wert des Syntaxelements slice_tc_offset_div2 |
| Beta | Wert des Syntaxelements slice_beta_offset_div2 |
| Saoluma | Wert des Syntaxelements slice_sao_luma_flag |
| Saochroma | Wert des Syntaxelements slice_sao_chroma_flag |
| IntraSmoothing | Wert des Syntaxelements strong_intra_smoothing_enabled_flag |
| ScalingMode | Skalierungslistenmodus |
| TmvpEn | TMVP-Aktivierung |

### `Trans Info`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| CbQpoffset | Wert des Syntaxelements pps_cb_qp_offset |
| CrQpoffset | Wert des Syntaxelements pps_cr_qp_offset |

### `jpege chn attr`

| Parameter | Beschreibung |
| --- | --- |
| ID | ID des Kodierkanals |
| width | Bildbreite in Pixeln |
| height | Bildhöhe in Pixeln |
| quant | Quantisierungsparameter qp des Kanals |
| qfactor | Vom Kanal verwendeter qfactor |
| qfmax | Maximaler qfactor des Kanals |
| qfmin | Minimaler qfactor des Kanals |

### `RC base param1`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| Gop | Bildgruppe der Kodierung (GOP) |
| StatTm | Statistikzeit der Bitratenregelung in Sekunden |
| ViFr | VI-Framerate (Videoeingang) |
| TrgFr | Zielframerate der Kodierung |
| RcMode | Bitratenregelmodus (cbr/fixqp/vbr/avbr/smart) |
| Br(kbps) | Bitrate in kbps |
| IQp | QP für I-Frames, gültig im FixQp-Modus |
| PQp | QP für P-Frames, gültig im FixQp-Modus |

### `RC base param2`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| MinQp | Minimaler QP für P-Frames |
| MaxQp | Maximaler QP für P-Frames |
| MinIQp | Minimaler QP für I-Frames |
| MaxIQp | Maximaler QP für I-Frames |
| EnableIdr | IDR-Aktivierung: Y - aktiviert; N - deaktiviert |

### `RC run comm param1`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| bLost | Ob Frames verworfen werden, wenn die momentane Bitrate die Schwelle überschreitet |
| LostThr | Schwelle zum Verwerfen von Frames |
| LostFrmstr | Statistik der verworfenen Frames |
| EncGap | Abstand zwischen kodierten Frames |

### `RC run comm param2`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| SprFrmMod | Verarbeitungsmodus für übergroße Frames |
| SprIFrm | Schwelle für übergroße I-Frames |
| SprPFrm | Schwelle für übergroße P-Frames |
| RCPriority | Priorität der Bitratenregelung: bitrate - Zielbitrate; framebits - Schwelle für übergroße Frames |

### `RC gop mode attr`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| GopMode | Typ von gop_mode |
| IpQpDelta | QP-Differenz zwischen I- und P-Frames; bei SmartP zwischen Bg- und P-Frames. Bereich: [-10, 30] |
| BgInterval | Intervall spezieller P-Frames. Höchstens Gop |
| ViQpDelta | QP-Differenz virtueller I- und P-Frames. Bereich: [-10, 30] |

### `RC run vbr common param`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| ChgPs | Verhältnis der Bitrate beim Beginn der VBR-QP-Anpassung zur maximalen Bitrate: bitrate/max_bitrate * 100 |
| MinIprop | Minimales I/P-Bitratenverhältnis. Bereich: [1,100]; Standard: 1 |
| MaxIprop | Maximales I/P-Bitratenverhältnis. Bereich: [MinIprop, 100]; Standard: 100 |
| MaxQp | Maximaler QP für P-Frames. Bereich: [0, 51]; Standard: 51 |
| MinQp | Minimaler QP für P-Frames. Bereich: [0, MaxQp]; Standard: 24 |
| MaxIQp | Maximaler QP für I-Frames. Bereich: [0, 51]; Standard: 51 |
| MinIQp | Minimaler QP für I-Frames. Bereich: [0, MaxIQp]; Standard: 24 |
| FrmMaxQp | Maximaler QP für P-Frames auf Frameebene |
| FrmMinQp | Minimaler QP für P-Frames auf Frameebene |
| FrmMaxIQp | Maximaler QP für I-Frames auf Frameebene |
| FrmMinIQp | Minimaler QP für I-Frames auf Frameebene |
| MaxReEncTimes | Anzahl erneuter Kodierungen pro Frame; 0 - keine. Bereich: [0, 3]; Standard: 1 |

### `RC run cbr param`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| MinIprop | Minimales I/P-Verhältnis. Bereich: [1, 100] |
| MaxIprop | Maximales I/P-Verhältnis. Bereich: [MinIprop, 100] |
| MaxQp | Maximaler QP für P-Frames zur Qualitätsbegrenzung. Bereich: [0, 51] |
| MinQp | Minimaler QP für P-Frames zur Begrenzung von Bitratenschwankungen. Bereich: [0, MaxQp] |
| MaxIQp | Maximaler QP für I-Frames zur Steuerung ihrer minimalen Bitanzahl. Bereich: [0, 51] |
| MinIQp | Minimaler QP für I-Frames zur Steuerung ihrer maximalen Bitanzahl. Bereich: [0, MaxIQp] |
| FrmMaxQp | Maximaler QP für P-Frames auf Frameebene |
| FrmMinQp | Minimaler QP für P-Frames auf Frameebene |
| FrmMaxIQp | Maximaler QP für I-Frames auf Frameebene |
| FrmMinIQp | Minimaler QP für I-Frames auf Frameebene |
| MaxReEncTimes | Anzahl erneuter Kodierungen pro Frame; 0 - keine. Bereich: [0, 3] |

### `RC run avbr param`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| MaxStillQP | Maximaler QP für unbewegte Szenen |
| MotionSensi | Bewegungsempfindlichkeit |
| MinPercent | Minimaler Prozentsatz für unbewegte Szenen |

### `RC HierarchicalQp INFO`

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| bEnable | Ob hierarchisches QP aktiviert ist |
| FrameNum[0] | Anzahl der QP-Frames in Ebene 1 |
| FrameNum[1] | Anzahl der QP-Frames in Ebene 2 |
| FrameNum[2] | Anzahl der QP-Frames in Ebene 3 |
| FrameNum[3] | Anzahl der QP-Frames in Ebene 4 |
| QpDelta[0] | QpDelta der Frames in Ebene 1 |
| QpDelta[1] | QpDelta der Frames in Ebene 2 |
| QpDelta[2] | QpDelta der Frames in Ebene 3 |
| QpDelta[3] | QpDelta der Frames in Ebene 4 |

RC debreath_effect info

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| bEnable | Ob die Unterdrückung des Pumpeffekts aktiviert ist |
| Strength0 | Stärke 0 der Pumpeffekt-Unterdrückung |
| DeBrthEfctCnt | Anzahl der auf das Bild angewendeten Pumpeffekt-Unterdrückungen |

RC run CBR/VBR info1

| Parameter | Beschreibung |
| --- | --- |
| ChnId | ID des Kodierkanals |
| InsBr(kbps) | Momentane Bitrate, kbps |
| InsFr | Momentane Framerate |
| WatL | Bitratenschwelle |
| CfgBt(kb) | Zielgröße des vorherigen Frames, kb |
| RealBt(kb) | Tatsächliche Größe des vorherigen Frames, kb |
| IPRatio | Verhältnis der mittleren Größen von I- und P-Frames |
| StartQp | Anfangs-QP |
| MinQp | Minimaler QP |
| MaxQp | Maximaler QP |

### `mpp_packet pool`

| Parameter | Beschreibung |
| --- | --- |
| unused_cnt | Anzahl unbenutzter Pakete |
| used_cnt | Anzahl benutzter Pakete |
| total_cnt | Gesamtzahl der Pakete |
| max_cnt | Maximale Anzahl der Pakete |

### `mpp_buffer pool`

| Parameter | Beschreibung |
| --- | --- |
| unused_cnt | Anzahl unbenutzter Puffer |
| used_cnt | Anzahl benutzter Puffer |
| total_cnt | Gesamtzahl der Puffer |
| max_cnt | Maximale Anzahl der Puffer |

### `mpp_frame pool`

| Parameter | Beschreibung |
| --- | --- |
| unused_cnt | Anzahl unbenutzter Frames |
| used_cnt | Anzahl benutzter Frames |
| total_cnt | Gesamtzahl der Frames |
| max_cnt | Maximale Anzahl der Frames |

## 10. Zuordnung zwischen venc_info und rockit-API

venc_info enthält die vom Kernel ausgegebenen Encoder-Konfigurationsparameter. Unterstützt werden nur RV1103B/RV1106B und RV1103/RV1106. Dieses Kapitel ordnet die wesentlichen Einstellungen für die subjektive Bildwirkung und die objektive Kompression.

| venc_info | rockit-API | rockit-API-Member | Hinweis |
| --- | --- | --- | --- |
| qbias_en<br>qbias_i<br>qbias_p | RK_MPI_VENC_SetH264Qbias<br>RK_MPI_VENC_SetH265Qbias | bEnable<br>u32QbiasI<br>u32QbiasP | RV1103/RV1106 unterstützt; RV1103B/RV1106B nicht unterstützt |
| qbias_en<br>qbias_arr[18] | RK_MPI_VENC_SetH264Qbias2<br>RK_MPI_VENC_SetH265Qbias2 | bEnable<br>u32Qbias2[18] | RV1103/RV1106 nicht unterstützt; erweiterte Version für RV1103B/RV1106B |
| StartQp<br>MaxQp<br>MinQp<br>MaxIQp<br>MinIQp<br>IpQpDelta<br>MaxReEncTimes<br>FrmMaxQp<br>FrmMinQp<br>FrmMaxIQp<br>FrmMinIQp<br>md_switch_qp | RK_MPI_VENC_SetRcParam | s32FirstFrameStartQp<br>u32MaxQp<br>u32MinQp<br>u32MaxIQp<br>u32MinIQp<br>s32DeltIpQp<br>s32MaxReEncodeTimes<br>u32FrmMaxQp<br>u32FrmMinQp<br>u32FrmMaxIQp<br>u32FrmMinIQp<br>u32MotionStaticSwitchFrmQp | Anfangs-QP, Block-, Zeilen- und Frame-QP sowie Anzahl erneuter Kodierungen |
| thrd_i[16]<br>thrd_p[16]<br>step_i[16]<br>step_p[16]<br>qp_dlt_row_i<br>qp_dlt_row | RK_MPI_VENC_SetRcParam2 | u32ThrdI[16]<br>u32ThrdP[16]<br>s32AqStepI[16]<br>s32AqStepP[16]<br>u32RowQpDelta<br>u32RowIQpDelta | AQ-Parameter, zeilenweise QP-Anpassung |
| aq_rnge_arr[10] | RK_MPI_VENC_SetRcParam3 | u32AqRange[10] | RV1103/RV1106 nicht unterstützt; erweiterte Version für RV1103B/RV1106B |
| scene_mode | RK_MPI_VENC_SetSceneMode | enSceneMode | Szenenmodus |
| flt_str_i<br>flt_str_p | RK_MPI_VENC_SetFilter | u32StrengthI<br>u32StrengthP | Filterstärke |
| md_swth_en | RK_MPI_VENC_EnableMotionStaticSwitch | bEnable | Sehr niedrige Bitrate für statische Szenen aktivieren (Bewegung/Stillstand) |
| deblur_str | RK_MPI_VENC_SetMotionDeblurStrength | u32Strength | Nachzieheffekte und Bewegungsunschärfe entfernen |
| atr_str | RK_MPI_VENC_SetAntiRing | u32AntiRing | Stärke der Ringing-Unterdrückung |
| atl_str | RK_MPI_VENC_SetAntiLine | u32AntiLine | Stärke der Linienunterdrückung |
| atf_str | RK_MPI_VENC_SetAntiFlick | u32AntiFlick | Rauschzittern/-kriechen entfernen (Flimmerunterdrückung) |
| lambda_i_idx<br>lambda_idx | RK_MPI_VENC_SetLambda | u32LambdaI<br>u32Lambda | Lambda-Konfiguration |
| static_frm_num<br>madp16_th<br>skip16_wgt<br>skip32_wgt | RK_MPI_VENC_SetStaticWeight | u32FrmNum<br>u32Madp16Th<br>u32Skip16Weight<br>u32Skip32Weight | Skip-Tendenz bei unbewegten Szenen |

| venc_info | rockit-API | rockit-API-Member | Hinweis |
| --- | --- | --- | --- |
| lgt_chg_lvl | RK_MPI_VENC_SetLightChange | u32Level | RV1103/RV1106 nicht unterstützt; RV1103B/RV1106B unterstützt |
| DblkEn<br>alpha<br>beta | RK_MPI_VENC_SetH264Dblk | disable_deblocking_filter_idc<br>slice_alpha_c0_offset_div2<br>slice_beta_offset_div2 | H.264-Deblocking-Filter |
| DblkEn<br>Tc<br>Beta | RK_MPI_VENC_SetH265Dblk | slice_deblocking_filter_disabled_flag<br>slice_tc_offset_div2<br>slice_beta_offset_div2 | H.265-Deblocking-Filter |
| Saoluma<br>Saochroma | RK_MPI_VENC_SetH265Sao | slice_sao_luma_flag<br>slice_sao_chroma_flag | H.265-SAO-Parameter |
| IntraSmoothing | RK_MPI_VENC_SetH265PredUnit | strong_intra_smoothing_enabled_flag | Starke H.265-Intra-Filterung |
| TmvpEn | RK_MPI_VENC_EnableTmvp | bEnable | H.265-TMVP-Schalter |
| StatTm<br>GopMode<br>Gop | RK_MPI_VENC_SetChnAttr | u32StatTime<br>enGopMode<br>u32Gop | Statistikzeit der Bitratenregelung, GOP-Modus und GOP-Länge |
| ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH265Trans | bScalingListEnabled<br>cb_qp_offset<br>cr_qp_offset | H.265-Quantisierungsparameter |
| trans8<br>ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH264Trans | u32TransMode<br>bScalingListValid<br>chroma_qp_index_offset | In H.264 verwenden CbQpOffset und CrQpOffset gemeinsam chroma_qp_index_offset |
| RcMode<br>MinBr(kbps)<br>MaxBr(kbps) | RK_MPI_VENC_SetChnAttr<br>RK_MPI_VENC_EnableSvc | enRcMode<br>u32MinBitRate<br>u32MaxBitRate | enRcMode auf VBR setzen, u32MinBitRate und u32MaxBitRate konfigurieren und SVC aktivieren, um den smart-Modus auszulösen |
| bEnable<br>Strength0 | RK_MPI_VENC_SetDeBreathEffect | bEnable<br>s32Strength0 | Parameter der Pumpeffekt-Unterdrückung |
| cu_dqp | RK_MPI_VENC_SetH265CuDqp | u32CuDqp | H.265<br>diff_cu_qp_delta_depth |

## 11. IVS

Die Parameter der intelligenten Videoüberwachung können mit folgendem Befehl abgerufen werden:

```text
cat /proc/vcodec/ivs/ivs_info
```


### `ivs channel attr`

| Parameter | Beschreibung |
| --- | --- |
| ID | Kanal-ID der intelligenten Videoüberwachung |
| width | Kanalbreite |
| height | Kanalhöhe |
| smear_en | Aktivierung von smear |
| weightp_en | Aktivierung von weightp |
| max_width | Maximale Kanalbreite |
| max_height | Maximale Kanalhöhe |
| md_en | Aktivierung der Bewegungserkennung |
| od_en | Aktivierung der Verdeckungserkennung |

### `ivs common cfg`

| Parameter | Beschreibung |
| --- | --- |
| ID | Kanal-ID der intelligenten Videoüberwachung |
| fmt | Bildformattyp |
| frm_acc_intval | Intervall der Frameakkumulation |
| frm_acc_gop | GOP der Frameakkumulation |

### `ivs md cfg`

| Parameter | Beschreibung |
| --- | --- |
| ID | Kanal-ID der intelligenten Videoüberwachung |
| switch_sad | Bewegungs-SAD-Modus: 0 - SAD vor Mittelwertkompensation; 1 - mittelwertkompensierte SAD; 2 - Minimum beider Werte; 3 - Maximum beider Werte |
| thres_sad | Bewegungs-SAD-Schwelle für 4x4-Blöcke |
| thres_move | Bewegungserkennungsschwelle für 8x8-Blöcke |
| night_mode | Aktivierung des Nachtmodus |
| filter_sw | Aktivierung des Filters für fliegende Pollen/Flocken |
| thres_dust_mv | Schwelle der Pollen-/Flockenblöcke unter den acht 8x8-Nachbarblöcken des aktuellen 8x8-Blocks |
| thres_dust_blk | Schwelle der Pollen-/Flockenblöcke unter den vier 4x4-Blöcken innerhalb des aktuellen 8x8-Blocks |
| thres_dust_chng | Schwelle der mittleren Helligkeitsdifferenz zwischen dem aktuellen 8x8-Block und dem entsprechenden Block im vorherigen Frame |

### `ivs od cfg`

| Parameter | Beschreibung |
| --- | --- |
| ID | Kanal-ID der intelligenten Videoüberwachung |
| thres_complex | Komplexitätsschwelle bei der Verdeckungserkennung |
| thres_complex_cnt | Zählschwelle der Komplexität bei der Verdeckungserkennung |
| thres_sad | SAD-Schwelle |

## 12. VRGN

VRGN verwaltet RGN im Medienframework. Aktuelle RGN-Informationen zeigt folgender Befehl:

```text
cat /dev/mpi/vrgn
```



| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| module | Modulinformationen | Modulname |
| version | Versionsinformationen | Repository-Name: Commit: Versionsnummer |
| build | Build-Informationen | Compiler - Kompilierungsdatum |
| rgn list | Trennzeile der RGN-Liste | Es folgen RGN-Informationen |
| handle | RGN-Handle | Identifiziert RGN |
| type | RGN-Typ | RGN-Typ: OVERLAY, COVER, MOSAIC |
| width | Breite des RGN-Bereichs |  |
| heigth (EN: height) | Höhe des RGN-Bereichs |  |
| format | Format des RGN-Bereichs | Gültig für OVERLAY und COVER; -1 bedeutet nicht unterstützter Eingangstyp |
| buf_id | ID des aktuell verwendeten RGN-Puffers | Gültig für OVERLAY; bei anderen Typen -1 |
| refcnt | Nutzungszähler des MPI-Puffers |  |
| channel_num | Anzahl der RGN-Anbindungen | Anzahl der RGN-ATTACH-Kanäle (Module) |
| node_rgn list | Trennzeile der node_rgn-Liste | Es folgen NODE_RGN-Informationen |
| id | Eindeutige Knoten-ID | Identifiziert einen MPI-Knoten |
| name | Name des Geräts, das den Knoten erstellt hat | Mehrere Knoten können denselben Namen haben |
| h | RGN-Handle | Identifiziert RGN, ähnlich einem HANDLE |
| x | x-Koordinate des RGN-Bereichs | X-Versatz der RGN-Startposition |
| y | y-Koordinate des RGN-Bereichs | Y-Versatz der RGN-Startposition |
| h x y | Position des RGN-Bereichs | Wertegruppe aus h, x und y zur Angabe der RGN-Position; insgesamt 8 Gruppen |

## 13. VRGA

VRGA verwaltet den RGA-Treiber in Rockit. Den aktuellen Zustand der RGA-NODE zeigt folgender Befehl:

```text
cat /dev/mpi/vrga
```



| Feld | Beschreibung | Hinweise |
| --- | --- | --- |
| id | Global eindeutige ID | Identifiziert den MPI-Knoten, entsprechend einem HANDLE |
| name | Name des Geräts, das NODE erstellt hat | Mehrere NODE können denselben Namen haben |
| ctx | Steuer-Handle des rga-Knotens | Virtuelle Adresse; mit LOG vergleichbar, um den betroffenen NODE zu bestimmen |
| nid | Benutzerdefinierte Rockit-ID | Benutzerdefinierte ID zur NODE-Verwaltung durch Rockit |
| ref | Nutzungszähler | +1 vor der Nutzung, -1 danach; Freigabe bei 0 |
| bypass | Bypass-Kennzeichen | 1 bedeutet, dass der RGA-Knoten Daten ohne Verarbeitung direkt weiterleitet |
| csnt | Zähler der CROP-Parametereinstellungen | Einfügeposition der CROP-Parameterwarteschlange |
| cgnt | Zähler der CROP-Parameterabrufe | Entnahmeposition der CROP-Parameterwarteschlange |
| ssnt | Zähler der SCALL-Parametereinstellungen | Einfügeposition der SCALL-Parameterwarteschlange |
| sgnt | Zähler der SCALL-Parameterabrufe | Entnahmeposition der SCALL-Parameterwarteschlange |
| type | Typ des RGA-Auftrags | 0 - allgemein; 1 - OSD |
| swidth | Ausgabebreite | Tatsächliche Breite des Ausgabebilds |
| sheight | Ausgabehöhe | Tatsächliche Höhe des Ausgabebilds |
| svwidth | Speicherbreite des Ausgabebilds | Vom Ausgabebild im Speicher belegte Breite zur Ausrichtung |
| svheight | Speicherhöhe des Ausgabebilds | Vom Ausgabebild im Speicher belegte Höhe zur Ausrichtung |
| sfmt | Format des Ausgabebilds | Details: rk_comm_video.h |
| cenalbe | Kennzeichen zur Aktivierung des Zuschnitts | 1 bedeutet Zuschnitt der Eingangsquelle |
| coordinate | Zuschnittparameter in Prozent | 1 - Prozentwerte; 0 - absolute Koordinaten |
| cxpos | X-Koordinate des Zuschnittbereichs | Bei coordinate = 1 Prozentwerte; bei coordinate = 0 absolute Koordinaten |
| cypos | Y-Koordinate des Zuschnittbereichs | Bei coordinate = 1 Prozentwerte; bei coordinate = 0 absolute Koordinaten |
| cwidth | Breite des Zuschnittbereichs | Bei coordinate = 1 Prozentwerte; bei coordinate = 0 absolute Breite |
| cheight | Höhe des Zuschnittbereichs | Bei coordinate = 1 Prozentwerte; bei coordinate = 0 absolute Höhe |
| job | Aufträge des aktuellen NODE | Listet die IDs der unbearbeiteten Aufträge des aktuellen NODE auf |

## Quellenabweichungen und Prüfhinweise

- Beide Quellen nennen V2.28.0 und 2025-04-27. Chinesisch enthält zusätzlich `memtype` und `nkid`; beide Felder stehen in allen Sprachfassungen. Die Seitenzahl allein belegt keine Aktualität.
- VSYS `table`: Chinesisch nennt die Framerate als Größe, n behält n Frames und 0 verwirft Frames; Englisch sagt 0 behalten und 1 verwerfen. Der Haupttext folgt der chinesischen Fassung; dieser Widerspruch muss am SDK geprüft werden.
- `isp_max_h` ist als Eingangshöhe definiert, beide Quellen nennen aber die „Breite nach dem Zuschnitt“. SDK-Implementierung und originale Diagnose prüfen; die Dimension wurde nicht stillschweigend geändert.
- Die RV1126B-Kernelmodulliste enthält `VALLC`; auch `cenalbe`, `SCALL` und `RK_MPI_SYS_RelasePhyMemory` bleiben unverändert. Chinesisch verwendet `last_runing`, `runing`, `heigth`, Englisch `last_running`, `running`, `height`; beide Schreibweisen sind am jeweiligen Feld angegeben.
- Beide API-Tabellen ordnen `qp_dlt_row_i` dem Member `u32RowQpDelta` und `qp_dlt_row` dem Member `u32RowIQpDelta` zu. Ein möglicher Widerspruch zur I/P-Bedeutung wurde nicht durch Vertauschen beseitigt.
- Chinesisch unterscheidet `mpp_packet pool` und `mpp_buffer pool`; Englisch nennt beide Tabellen `mpp_buffer pool`. Hier gelten die chinesischen Überschriften; alle drei Tabellen für packet, buffer und frame bleiben erhalten.
- Englisch ergänzt bei VRGN `h x y` „insgesamt 8 Gruppen“; dies steht in allen Fassungen. Bei `wcnt` nennt Chinesisch eine Frameanzahl, Englisch eine Framerate; die Frameanzahl gilt als Grundlage. Bei `min_size` gilt chinesisch „minimaler freier Speicher für einen Frame“ statt englisch „zuletzt“.
- Englisch Warp wird gemäß Chinesisch als Wrapping verstanden; Bezeichner bleiben erhalten. Die chinesischen Details zu ROI-Makroblöcken, Mittelwertkompensation bei SAD, sehr niedriger Bitrate statischer Szenen, Nachzieheffekten und Rauschzittern/-kriechen wurden übernommen.

{% endraw %}
