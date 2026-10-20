---
title: "Rockchip GMAC PTP1588: Hardwarezeitstempel, Uhrensynchronisation und PPS"
description: "Vollständige PTP1588-Referenz: Verzögerungs-/Offsetgleichungen, GMAC-Zeitstempelregister, ptp4l, phc2sys, gPTP, festes/flexibles PPS, RT-Thread und Master-Modus-Patch für Linux 4.19."
translation_key: "062-rockchip-gmac-ptp1588"
slug: "062-rockchip-gmac-ptp1588"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "GMAC", "PTP1588", "PPS", "RK3576", "RK3588"]
keywords: "ArmSoM Rockchip GMAC PTP1588 PPS RK3576 RK3588"
excerpt: "Vollständige PTP1588-Referenz: Verzögerungs-/Offsetgleichungen, GMAC-Zeitstempelregister, ptp4l, phc2sys, gPTP, festes/flexibles PPS, RT-Thread und Master-Modus-Patch für Linux 4.19."
---

{% raw %}

# Rockchip GMAC PTP1588: Hardwarezeitstempel, Uhrensynchronisation und PPS

## Anwendbarkeit auf ArmSoM

Dieses Dokument beschreibt die Nutzung der PTP1588-Funktion der Ethernet-GMAC-Schnittstelle auf der Rockchip-Plattform. Der vollständige Artikel folgt dem englischen PDF V1.0.0 mit 16 Seiten; ein entsprechendes chinesisches PDF wurde nicht bereitgestellt. Chinesisch, Russisch und diese deutsche Fassung übersetzen diese Quelle vollständig. Alle sechs Abbildungen sämtlicher Sprachfassungen stammen aus dem englischen PDF; dessen Diagramme und Messgerätescreenshots enthalten teilweise chinesische Beschriftungen.

Dies ist eine ArmSoM-Plattformreferenz, kein Bericht über die Validierung eines Boards. Die folgende Produkttabelle der Quelle nennt SoCs und gibt für Kernel-Versionen „ALL“ an. Dies beschreibt den Geltungsbereich der Quelle und ist keine geprüfte Aussage, dass jeder Kernel oder jedes ArmSoM-Board alle Funktionen unterstützt. Prüfen Sie das konkrete Board, Ethernet-/PHY-Verdrahtung, SDK/BSP, Treiber, `clk_ptp_ref`, PPS-Pinmux und die verfügbare PTP-Uhr. Abschnitt 4 behandelt gesondert RT-Thread auf RK2118. Es wurden weder Hardwarebefehle noch Uhrensynchronisationen oder Patches ausgeführt. Protokolle, Signalverläufe und Ergebnisse unter einer Mikrosekunde sind Beispiele aus der Quelle, keine ArmSoM-Messungen.

| Chipsatz der Quelle | Kernel-Geltungsbereich der Quelle |
| --- | --- |
| RK3588, RK3576, RK3568, RK3506, RV1126, RK2118 | Alle (Quellangabe: ALL) |

Folgende Quellprobleme bleiben erhalten und sind dokumentiert: die IPv6-Adresszeichenfolgen in §1.3, der Name `phy2sys` in §2, die CST-/UTC-Formulierung in §2.2, die ausgeschriebene Bedeutung von gPTP und der anfänglich große RMS-Protokollwert. Behandeln Sie diese nicht stillschweigend als geprüfte Konfigurationswerte. Quellseiten und auf Extraktion/Layout begrenzte Korrekturen stehen in den redaktionellen Hinweisen.

[Redaktionelle Hinweise](/docs/rockchip-gmac-ptp1588/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.4, unit 0 -->

## 1. Funktionsprinzip von PTP1588

<!-- Source EN PDF p.4, unit 1 -->

PTP1588, der Precision-Time-Protocol-Standard für vernetzte Mess- und Steuerungssysteme, dient grundsätzlich dazu, alle Uhren eines verteilten Netzwerks mit dessen genauester Uhr zu synchronisieren. Er definiert PTP (Precision Time Protocol) zur Uhrensynchronisation in Standard-Ethernet oder anderen multicastfähigen Endgeräten mit einer Genauigkeit unter einer Mikrosekunde. IEEE PTP1588 wird in lokalen verteilten Systemen eingesetzt, die eine höhere Uhrengenauigkeit benötigen, als NTP bietet. Der GMAC-Controller unterstützt PTP1588 v1 und v2.

<!-- Source EN PDF p.4, unit 2 -->

Gängiger PTP1588-Synchronisationsablauf: Delay-Request-Response-Verfahren.

<!-- Source EN PDF p.4, unit 3 -->

### 1.1 Senden und Empfangen von Nachrichten beim Delay-Response-Verfahren

<!-- Source EN PDF p.4, unit 4 -->

![Zeitdiagramm des Delay-Request-Response-Verfahrens](/docs/rockchip-gmac-ptp1588/assets/en-p04-figure1.png)

*Zeitdiagramm des Delay-Request-Response-Verfahrens — englisches PDF, S.4.*

<!-- Source EN PDF p.4, unit 5 -->

1. Das Master-Gerät sendet regelmäßig PTP-Synchronisationsnachrichten an alle seine Knoten. Die Nachricht verlässt das Master-System zum Zeitpunkt t1. Erfasst wird t1 beim Verlassen des Ethernet-Ports an GMII oder MII.
2. Das Slave-Gerät empfängt die Synchronisationsnachricht und erfasst anhand seiner Zeitreferenz den genauen Zeitpunkt t2.
3. Das Master-Gerät sendet eine Follow_up-Nachricht mit t1 zur späteren Verwendung an das Slave-Gerät. Da die Sync-Nachricht ihren genauen Abgangszeitpunkt nicht mitführen kann, wird ihr präziser Sendezeitstempel t1 in der nachfolgenden Follow_up-Nachricht an die Slave-Uhr übermittelt.
4. Das Slave-Gerät sendet eine Delay_Req-Nachricht an den Master und erfasst den genauen Zeitpunkt t3, zu dem das Paket die GMII- oder MII-Schnittstelle verlässt.
5. Das Master-Gerät empfängt die Nachricht und erfasst den genauen Zeitpunkt t4 ihres Eintritts in sein System.
6. Das Master-Gerät übermittelt t4 in der Delay_Resp-Nachricht an das Slave-Gerät.
7. Das Slave-Gerät synchronisiert seine lokale Zeitreferenz mithilfe der vier Werte t1, t2, t3 und t4 mit der Zeitreferenz des Masters.

<!-- Source EN PDF p.5, unit 12 -->

### 1.2 Uhrenversatz und Netzwerklatenz

<!-- Source EN PDF p.5, unit 13 -->

offset: Uhrenversatz, also die Zeitdifferenz zwischen Master- und Slave-Uhr.

<!-- Source EN PDF p.5, unit 14 -->

delay: Netzwerklatenz, also die durch die Nachrichtenübertragung im Netzwerk verursachte Verzögerung.

<!-- Source EN PDF p.5, unit 15 -->

Aus den vier präzisen Zeitstempeln t1, t2, t3 und t4 kann die Slave-Uhr den Master-Slave-Zeitversatz offset und die Übertragungsverzögerung delay berechnen:

<!-- Source EN PDF p.5, unit 16 -->

![Gleichungen für Verzögerung und Zeitversatz](/docs/rockchip-gmac-ptp1588/assets/en-p05-figure1.png)

*Gleichungen für Verzögerung und Zeitversatz — englisches PDF, S.5.*

```text
delay  = ((t2 - t1) + (t4 - t3)) / 2
offset = ((t2 - t1) - (t4 - t3)) / 2
```

<!-- Source EN PDF p.5, unit 17 -->

Nach der Ermittlung von offset und delay kann die Slave-Uhr durch Korrektur ihrer lokalen Uhr die Zeit synchronisieren.

<!-- Source EN PDF p.5, unit 18 -->

### 1.3 PTP-Nachrichten

<!-- Source EN PDF p.5, unit 19 -->

PTP-Pakete über IPv4

<!-- Source EN PDF p.5, unit 20 -->

IP-Multicast-Adresse (IEEE 1588 Version 1): Zulässige IPv4-Multicast-Adressen sind:

- `224.0.1.129`
- `224.0.1.130`
- `224.0.1.131`
- `224.0.1.132`

<!-- Source EN PDF p.6, unit 22 -->

IP-Multicast-Adresse (IEEE 1588 Version 2):

- Primäre PTP-Multicast-Adresse: `224.0.1.129`
- PTP-Pdelay-Multicast-Adresse: `224.0.0.107`

PTP-Frames über IPv6 — die Quelle nennt diese hexadezimalen Zeichenfolgen:

- Primäre PTP-Multicast-Adresse: `FF0x:0:0:0:0:0:0:0:0:181`
- PTP-Pdelay-Multicast-Adresse: `FF02:0:0:0:0:0:0:0:0:6B`

<!-- Source EN PDF p.6, unit 23 -->

PTP-Pakete über Ethernet

<!-- Source EN PDF p.6, unit 24 -->

Alle PTP-Nachrichten können eine der folgenden Multicast-Adressen verwenden:

- `01-1B-19-00-00-00`
- `01-80-C2-00-00-0E`

<!-- Source EN PDF p.6, unit 25 -->

### 1.4 Funktionsprinzip von GMAC PTP1588

<!-- Source EN PDF p.6, unit 26 -->

Der Systemzeitgenerator von GMAC PTP1588 wird mit dem Referenztakt `clk_ptp_ref` aktualisiert. Er bildet die Grundlage für die Erfassung von Momentaufnahmen (Zeitstempeln) der über die \*GMII-/RMII-Schnittstelle gesendeten oder empfangenen Ethernet-Pakete.

<!-- Source EN PDF p.6, unit 27 -->

Die Systemzeit besteht aus zwei Teilen in den Registern `MAC_System_Time_Seconds` und `MAC_System_Time_Nanoseconds`. Das Nanosekundenfeld unterstützt zwei Modi:

<!-- Source EN PDF p.6, unit 28 -->

Digitaler Überlaufmodus: Der Maximalwert des Nanosekundenfeldes beträgt `0x3B9A_C9FF`, entsprechend (10^9-1) Nanosekunden.

<!-- Source EN PDF p.6, unit 29 -->

Binärer Überlaufmodus: Nach `0x7FFF_FFFF` läuft das Nanosekundenfeld über und erhöht das übergeordnete Feld; die Auflösung beträgt ungefähr 0.466 ns pro Bit.

<!-- Source EN PDF p.6, unit 30 -->

Die Systemzeit wird durch Setzen des Bits `TSUPDT` aktualisiert. Zuvor müssen die zu addierenden oder subtrahierenden Werte in `MAC_System_Time_Seconds_Update` und `MAC_System_Time_Nanoseconds_Update` eingetragen werden.

<!-- Source EN PDF p.6, unit 31 -->

Wird nur die Systemzeit aktualisiert, weist dieses Verfahren einen relativ großen Jitterfehler auf. Deshalb wird ein genaueres Verfahren zur Zeitaktualisierung bereitgestellt.

<!-- Source EN PDF p.7, unit 32 -->

![GMAC-Systemzeitakkumulator und Inkrementregister](/docs/rockchip-gmac-ptp1588/assets/en-p07-figure1.png)

*GMAC-Systemzeitakkumulator und Inkrementregister — englisches PDF, S.7.*

<!-- Source EN PDF p.7, unit 33 -->

Wie oben dargestellt, korrigiert dieses Verfahren die Frequenzabweichung bzw. Frequenzdrift des Takts `clk_ptp_ref` gegenüber der Master-Uhr (definiert in IEEE 1588-2002) über einen Zeitraum. So bleibt der Zeitverlauf linear, ohne starke Änderungen oder großen Jitter der Referenzzeit zwischen PTP-Synchronisationsnachrichten zu erzeugen. Der Akkumulator addiert den Inhalt des Addend-Registers; sein arithmetischer Übertrag dient als Impuls zum Erhöhen des Systemzeitzählers. Der Akkumulator ist ein 32-Bit-Register und wirkt als hochpräziser Frequenzvervielfacher oder -teiler.

<!-- Source EN PDF p.7, unit 34 -->

Üblicherweise wird ein Standard-Addend gesetzt, etwa `0x80000000`, sodass der 32-Bit-Akkumulator nach jeweils zwei `clk_ptp_ref`-Takten überläuft. Beim Überlauf wird das Sub-second-Register um die im Register `incr_sub_sec` konfigurierte Einheit erhöht. Bei einem 100M-Takt muss `MAC_Sub_Second_Increment` daher auf die doppelte Taktperiode gesetzt werden: `0x14`. Dies gilt für den digitalen Modus; für den binären Modus ist eine Umrechnung nötig. Im digitalen Modus erhöht sich beim Erreichen von `0x3B9A_C9FF` das Second-Register um 1, entsprechend einer verstrichenen Sekunde. Im binären Modus geschieht dies bei `0x7FFF_FFFF`.

<!-- Source EN PDF p.8, unit 35 -->

Bei der PTP1588-Synchronisation wird in jedem `clk_ptp_ref`-Takt der Addend zum Akkumulator addiert. Eine Änderung des Addend-Registerwerts beeinflusst die Sub-second-Akkumulation; vereinfacht wird damit der PTP-Takt und letztlich der Verlauf der Systemzeit verändert. Die Software muss anhand der Synchronisationsnachrichten die Frequenzdrift berechnen und das Addend-Register entsprechend aktualisieren.

<!-- Source EN PDF p.8, unit 36 -->

### 1.5 Zeitstempelerfassung bei GMAC PTP1588

<!-- Source EN PDF p.8, unit 37 -->

Für das Senden und Empfangen beim PTP1588-Delay-Response-Verfahren ist der genaue Zeitpunkt an der Netzwerkkarte entscheidend. Die GMAC-Hardware speichert beim Senden und Empfangen von Paketen den jeweiligen Systemzeitstempel an einer festgelegten Speicherstelle. Dies ist der zum Paket gehörende Sende- oder Empfangsdeskriptor, beispielsweise der folgende TX-Deskriptor:

<!-- Source EN PDF p.8, unit 38 -->

![Zeitstempelbelegung des TX-Deskriptors](/docs/rockchip-gmac-ptp1588/assets/en-p08-figure1.png)

*Zeitstempelbelegung des TX-Deskriptors — englisches PDF, S.8.*

| Deskriptorwort | Bits | Bedeutung |
| --- | --- | --- |
| TDES0 | 31:0 | Niederwertiger Zeitstempelteil |
| TDES1 | 31:0 | Höherwertiger Zeitstempelteil |
| TDES2 | 31:0 | Reserviert |
| TDES3 | 31 | OWN |
| TDES3 | 30:0 | Status[30:0] |

<!-- Source EN PDF p.8, unit 39 -->

Codeausschnitt:

<!-- Source EN PDF p.8, unit 40 -->

```c
static inline void dwmac4_get_timestamp(void *desc, u32 ats, u64 *ts)
{
    struct dma_desc *p = (struct dma_desc *)desc;
    u64 ns;
    ns = le32_to_cpu(p->des0);
    /* convert high/sec time stamp value to nanosecond */
    ns += le32_to_cpu(p->des1) * 1000000000ULL;
    *ts = ns;
}
```

<!-- Source EN PDF p.8, unit 41 -->

Im Register `MAC_Timestamp_Control` muss eingestellt werden, für welche Nachrichtentypen die Hardware beim Empfangen und Senden Zeitstempel speichert.

<!-- Source EN PDF p.9, unit 42 -->

## 2. PTP1588-Tests

<!-- Source EN PDF p.9, unit 43 -->

Prüfen Sie mit ethtool die Unterstützung von Hardwarezeitstempeln. Die Parameterliste muss dafür Folgendes enthalten:

<!-- Source EN PDF p.9, unit 44 -->

- `SOF_TIMESTAMPING_RAW_HARDWARE`

<!-- Source EN PDF p.9, unit 45 -->

- `SOF_TIMESTAMPING_TX_HARDWARE`

<!-- Source EN PDF p.9, unit 46 -->

- `SOF_TIMESTAMPING_RX_HARDWARE`

<!-- Source EN PDF p.9, unit 47 -->

```text
root@linaro-alip:/# ethtool -T eth0
Time stamping parameters for eth0:
Capabilities:
        hardware-transmit (SOF_TIMESTAMPING_TX_HARDWARE)
        software-transmit (SOF_TIMESTAMPING_TX_SOFTWARE)
        hardware-receive (SOF_TIMESTAMPING_RX_HARDWARE)
        software-receive (SOF_TIMESTAMPING_RX_SOFTWARE)
        software-system-clock (SOF_TIMESTAMPING_SOFTWARE)
        hardware-raw-clock (SOF_TIMESTAMPING_RAW_HARDWARE)
PTP Hardware Clock: 0
Hardware Transmit Timestamp Modes:
        off
        on
Hardware Receive Filter Modes:
        none
        all
        ptpv1-l4-event
        ptpv1-l4-sync
        ptpv1-l4-delay-req
        ptpv2-l4-event
        ptpv2-l4-sync
        ptpv2-l4-delay-req
        ptpv2-event
        ptpv2-sync
```

<!-- Source EN PDF p.9, unit 48 -->

Gängige Testprogramme sind ptp4l und das in der Quelle als phy2sys bezeichnete Werkzeug aus Linuxptp. ptp4l synchronisiert die PTP-Hardwareuhr mittels Hardwarezeitstempeln mit der Master-Uhr oder die Systemuhr mittels Softwarezeitstempeln. phc2sys synchronisiert Systemuhr und Hardwareuhr der Netzwerkkarte, ausschließlich im Hardwarezeitstempelmodus. Weitere Testprogramme sind etwa ptpd2.

<!-- Source EN PDF p.9, unit 49 -->

### 2.1 Tests mit ptp4l

<!-- Source EN PDF p.9, unit 50 -->

Slave:

<!-- Source EN PDF p.9, unit 51 -->

```text
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.9, unit 52 -->

Master:

<!-- Source EN PDF p.10, unit 53 -->

```text
ptp4l -i eth0 -m -H
```

<!-- Source EN PDF p.10, unit 54 -->

```text
ptp4l[420.071]: selected /dev/ptp0 as PTP clock
ptp4l[420.077]: port 1 (eth0): new foreign master 54e1ad.fffe.dfa454-1
ptp4l[424.077]: selected best master clock 54e1ad.fffe.dfa454
ptp4l[424.078]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[425.084]: master offset -1466 s2 freq -20216 path delay 13117
ptp4l[425.084]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[426.084]: master offset -6 s2 freq -19196 path delay 13117
ptp4l[427.085]: master offset 491 s2 freq -18701 path delay 13020
ptp4l[428.084]: master offset 330 s2 freq -18714 path delay 13026
ptp4l[429.084]: master offset 365 s2 freq -18580 path delay 13041
ptp4l[430.084]: master offset 116 s2 freq -18720 path delay 13050
ptp4l[431.084]: master offset 30 s2 freq -18771 path delay 13041
ptp4l[432.084]: master offset 24 s2 freq -18768 path delay 13032
ptp4l[433.084]: master offset 29 s2 freq -18756 path delay 13032
ptp4l[434.084]: master offset 39 s2 freq -18737 path delay 13032
ptp4l[435.084]: master offset -71 s2 freq -18836 path delay 13032
ptp4l[437.085]: master offset 201 s2 freq -18585 path delay 13015
ptp4l[438.085]: master offset -70 s2 freq -18796 path delay 13021
ptp4l[439.085]: master offset -30 s2 freq -18777 path delay 13041
ptp4l[440.085]: master offset 29 s2 freq -18727 path delay 13032
ptp4l[441.085]: master offset -41 s2 freq -18788 path delay 13037
ptp4l[442.085]: master offset -61 s2 freq -18820 path delay 13037
ptp4l[443.085]: master offset 54 s2 freq -18723 path delay 13007
ptp4l[444.085]: master offset -31 s2 freq -18792 path delay 13007
ptp4l[445.085]: master offset -6 s2 freq -18777 path delay 13007
ptp4l[446.085]: master offset 61 s2 freq -18711 path delay 13045
ptp4l[447.085]: master offset -89 s2 freq -18843 path delay 13045
ptp4l[448.085]: master offset 41 s2 freq -18740 path delay 13030
ptp4l[449.085]: master offset -4 s2 freq -18772 path delay 13030
ptp4l[450.085]: master offset -47 s2 freq -18817 path delay 13023
ptp4l[451.085]: master offset 5 s2 freq -18779 path delay 13026
ptp4l[452.085]: master offset 55 s2 freq -18727 path delay 13026
ptp4l[453.085]: master offset 93 s2 freq -18673 path delay 13023
ptp4l[454.085]: master offset -57 s2 freq -18795 path delay 13023
ptp4l[455.086]: master offset -32 s2 freq -18787 path delay 13023
ptp4l[456.085]: master offset 33 s2 freq -18732 path delay 13023
ptp4l[457.086]: master offset -26 s2 freq -18781 path delay 13037
ptp4l[458.086]: master offset -55 s2 freq -18817 path delay 13026
ptp4l[459.086]: master offset -5 s2 freq -18784 path delay 13026
ptp4l[460.086]: master offset -33 s2 freq -18813 path delay 13024
```

<!-- Source EN PDF p.10, unit 55 -->

master offset bezeichnet die Zeitdifferenz zwischen Master und Slave in Nanosekunden (ns). s0, s1 und s2 sind Zustände des 1588-Protokolls: s0 bedeutet nicht eingerastet, s1 laufende Synchronisation und s2 eingerastet. freq gibt die Frequenzkorrektur der Uhr in parts per billion (ppb) an. path delay ist die erwartete Laufzeit der von der Master-Uhr gesendeten Synchronisationsnachricht in Nanosekunden. Sie kann über E2E oder P2P gemessen werden; Standard ist E2E.

<!-- Source EN PDF p.11, unit 56 -->

### 2.2 Systemuhren synchronisieren

<!-- Source EN PDF p.11, unit 57 -->

Uhr der Netzwerkkarte mit dem Betriebssystem synchronisieren:

<!-- Source EN PDF p.11, unit 58 -->

Master-Uhr

<!-- Source EN PDF p.11, unit 59 -->

```text
sudo phc2sys -m -s CLOCK_REALTIME -c end0 -w &
sudo ptp4l -i end0 -m -H
```

<!-- Source EN PDF p.11, unit 60 -->

Slave-Uhr

<!-- Source EN PDF p.11, unit 61 -->

```text
phc2sys -m -s eth0 -c CLOCK_REALTIME -w --step_threshold=1 &
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.11, unit 62 -->

Zeit auf beiden Boards vor der Synchronisation:

<!-- Source EN PDF p.11, unit 63 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:48:25 CST
root@buildroot:/# date
Thu Jan 1 00:14:02 UTC 1970
```

<!-- Source EN PDF p.11, unit 64 -->

Zeit auf beiden Boards nach der Synchronisation (laut Quelle liegt China Standard Time CST genau 8 Zeitzonen hinter Coordinated Universal Time UTC): Das Wort „hinter“ widerspricht dem folgenden Beispiel. Dies bleibt als Quellproblem dokumentiert und wird nicht stillschweigend korrigiert.

<!-- Source EN PDF p.11, unit 65 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:51:52 CST
root@buildroot:/# date
Mon Jul 8 11:51:52 UTC 2024
```

<!-- Source EN PDF p.11, unit 66 -->

### 2.3 Tests mit gPTP

<!-- Source EN PDF p.11, unit 67 -->

gPTP, in der Quelle als Abkürzung für „general precise time protocol“ angegeben, ist eine Ableitung von PTP und auch als 802.1AS bekannt. gPTP soll alle Knoten eines lokalen Netzwerks zeitlich exakt synchronisieren. Das Protokoll basiert auf Übertragung auf Schicht L2 und kann daher nur innerhalb eines lokalen Netzwerks weitergegeben werden.

<!-- Source EN PDF p.11, unit 68 -->

Slave:

<!-- Source EN PDF p.11, unit 69 -->

```text
ptp4l -i eth0 -m -H -f ./gPTP.cfg --step_threshold=1 -s
```

<!-- Source EN PDF p.11, unit 70 -->

Master:

<!-- Source EN PDF p.11, unit 71 -->

```text
ptp4l -i end0 -m -H -f ./gPTP.cfg --step_threshold=1
```

<!-- Source EN PDF p.12, unit 73 -->

```text
ptp4l[196.636]: selected /dev/ptp0 as PTP clock -f gPTP.cfg --step_threshold=1 -s
ptp4l[196.670]: port 1 (eth0): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4l): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4lro): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[200.262]: port 1 (eth0): new foreign master 9ae370.fffe.1cb4e0-1
ptp4l[200.547]: selected local clock 568583.fffe.b70879 as best master
ptp4l[202.262]: selected best master clock 9ae370.fffe.1cb4e0
ptp4l[202.262]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[202.942]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[203.568]: rms 853264659523145600 max 1706529319046291712 freq -4554 +/- 1736 delay 15780 +/- 0
ptp4l[204.570]: rms 305 max 360 freq -5595 +/- 53 delay 15780 +/- 0
ptp4l[205.571]: rms 205 max 290 freq -5713 +/- 37 delay 15770 +/- 0
ptp4l[206.573]: rms 53 max 129 freq -5592 +/- 58 delay 15769 +/- 0
ptp4l[207.574]: rms 46 max 85 freq -5572 +/- 63 delay 15765 +/- 0
ptp4l[208.576]: rms 62 max 115 freq -5510 +/- 73 delay 15765 +/- 0
ptp4l[209.577]: rms 52 max 95 freq -5502 +/- 66 delay 15765 +/- 0
ptp4l[210.579]: rms 49 max 75 freq -5545 +/- 66 delay 15765 +/- 0
ptp4l[211.580]: rms 56 max 115 freq -5506 +/- 75 delay 15765 +/- 0
ptp4l[212.582]: rms 42 max 65 freq -5552 +/- 53 delay 15765 +/- 0
ptp4l[213.584]: rms 53 max 114 freq -5553 +/- 72 delay 15774 +/- 0
ptp4l[214.585]: rms 51 max 106 freq -5513 +/- 66 delay 15774 +/- 0
ptp4l[215.587]: rms 59 max 74 freq -5552 +/- 81 delay 15774 +/- 0
ptp4l[216.588]: rms 57 max 96 freq -5503 +/- 71 delay 15764 +/- 0
ptp4l[217.590]: rms 50 max 99 freq -5566 +/- 62 delay 15779 +/- 0
ptp4l[218.591]: rms 68 max 101 freq -5538 +/- 93 delay 15779 +/- 0
ptp4l[219.593]: rms 66 max 106 freq -5538 +/- 91 delay 15774 +/- 0
ptp4l[220.595]: rms 56 max 106 freq -5551 +/- 78 delay 15774 +/- 0
ptp4l[221.596]: rms 55 max 84 freq -5575 +/- 72 delay 15784 +/- 0
ptp4l[222.598]: rms 36 max 71 freq -5539 +/- 47 delay 15789 +/- 0
ptp4l[223.599]: rms 53 max 76 freq -5561 +/- 74 delay 15784 +/- 0
ptp4l[224.601]: rms 65 max 116 freq -5533 +/- 87 delay 15784 +/- 0
ptp4l[225.602]: rms 64 max 136 freq -5577 +/- 86 delay 15784 +/- 0
ptp4l[226.604]: rms 66 max 136 freq -5538 +/- 88 delay 15784 +/- 0
ptp4l[227.606]: rms 46 max 61 freq -5553 +/- 63 delay 15779 +/- 0
ptp4l[228.607]: rms 58 max 139 freq -5547 +/- 80 delay 15779 +/- 0
ptp4l[229.609]: rms 42 max 61 freq -5553 +/- 58 delay 15779 +/- 0
```

<!-- Source EN PDF p.12, unit 74 -->

Für eine ruhigere Darstellung wird hier der quadratische Mittelwert (RMS) des Zeitversatzes angezeigt.

<!-- Source EN PDF p.12, unit 75 -->

## 3. PPS

<!-- Source EN PDF p.12, unit 76 -->

### 3.1 Festes PPS

<!-- Source EN PDF p.12, unit 77 -->

PPS bedeutet Pulse-Per-Second. Standardmäßig arbeitet GMAC mit einer festen Pulsausgabe im Abstand von 1 Sekunde. Die PPS-Ausgabefrequenz kann über das Feld `PPSCTRL0` im Register `MAC_PPS_Control` geändert werden. Bei korrekt konfiguriertem iomux lässt sich das PPS-Ausgangssignal in diesem Modus prüfen. Der Standardwert von `PPSCTRL` ist 0000: ein Puls pro Sekunde mit einer Pulsbreite von einem `clk_ptp_ref`-Takt.

<!-- Source EN PDF p.13, unit 79 -->

![Oszilloskopaufnahme des verbleibenden PPS-Jitters aus der Quelle](/docs/rockchip-gmac-ptp1588/assets/en-p13-figure1.png)

*Oszilloskopaufnahme des verbleibenden PPS-Jitters aus der Quelle — englisches PDF, S.13.*

<!-- Source EN PDF p.13, unit 80 -->

Die obige Abbildung zeigt, dass nach der PTP1588-Synchronisation der verbleibende zeitliche Jitter der PPS-Signale zweier Geräte bei längerer Oszilloskopbeobachtung im Wesentlichen dem von ptp4l gemessenen master offset entspricht.

<!-- Source EN PDF p.13, unit 81 -->

### 3.2 Binärer und digitaler Modus im Vergleich

<!-- Source EN PDF p.13, unit 82 -->

Wie zuvor beschrieben, unterscheidet sich die Systemzeitaktualisierung zwischen diesen beiden Modi. Auch Frequenz und Tastgrad der PPS-Ausgabe sind unterschiedlich. Für weitere Werte von `PPSCTRL` entstehen folgende Taktfrequenzen:

<!-- Source EN PDF p.13, unit 83 -->

| PPSCTRL | Binärer Überlaufmodus | Digitaler Überlaufmodus |
| --- | --- | --- |
| 0001 | 2 Hz | 1 Hz |
| 0010 | 4 Hz | 2 Hz |
| 0011 | 8 Hz | 4 Hz |
| 0100 | 16 Hz | 8 Hz |
| ... | ... | ... |
| 1111 | 32.768 KHz | 16.384 KHz |

<!-- Source EN PDF p.14, unit 89 -->

Im binären Überlaufmodus hat der PPS-Ausgang `ptp_pps_o` bei diesen Frequenzen einen Tastgrad von 50%.

<!-- Source EN PDF p.14, unit 90 -->

Im digitalen Überlaufmodus ist die PPS-Ausgabefrequenz ein Mittelwert. Die tatsächliche Taktfrequenz variiert und wird jede Sekunde synchronisiert. Beispiele:

<!-- Source EN PDF p.14, unit 91 -->

Bei `PPSCTRL` = 0001 beträgt für PPS (1 Hz) die Low-Phase 537 Millisekunden und die High-Phase 463 Millisekunden.

<!-- Source EN PDF p.14, unit 92 -->

Bei `PPSCTRL` = 0010 besteht PPS (2 Hz) aus folgender Folge: ein Takt mit 50% Tastgrad und 537 Millisekunden Periodendauer, anschließend ein Takt mit 463 Millisekunden Periodendauer (268 Millisekunden Low, 195 Millisekunden High).

<!-- Source EN PDF p.14, unit 93 -->

Bei `PPSCTRL` = 0011 besteht PPS (4 Hz) aus drei Takten mit 50% Tastgrad und 268 Millisekunden Periodendauer; der vierte Takt dauert 195 Millisekunden (134 Millisekunden Low, 61 Millisekunden High).

<!-- Source EN PDF p.14, unit 94 -->

Im digitalen Modus ist die PPS-Periodendauer somit nicht gleichmäßig. Für eine gleichmäßige Periodendauer muss der binäre Modus eingestellt werden.

<!-- Source EN PDF p.14, unit 95 -->

Beachten Sie, dass bei `PPSCTRL` >= 1 das PPS-Signal hier mit einem Low-Pegel beginnt, also an der fallenden Flanke ausgerichtet ist:

<!-- Source EN PDF p.14, unit 96 -->

![Originalsignalverlauf zur Ausrichtung an der fallenden PPS-Flanke](/docs/rockchip-gmac-ptp1588/assets/en-p14-figure1.png)

*Originalsignalverlauf zur Ausrichtung an der fallenden PPS-Flanke — englisches PDF, S.14.*

<!-- Source EN PDF p.15, unit 97 -->

### 3.3 Flexibles PPS

<!-- Source EN PDF p.15, unit 98 -->

Im Vergleich zum festen PPS mit Pulsen zu festen Sekundenzeitpunkten bietet flexibles PPS Einstellmöglichkeiten für Startzeit, Tastgrad, Frequenz usw.

<!-- Source EN PDF p.15, unit 99 -->

PPS aktivieren:

<!-- Source EN PDF p.15, unit 100 -->

```text
echo "0 0 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 101 -->

Alternativ kann eine PPS-Startzeit festgelegt werden, beispielsweise 100s:

<!-- Source EN PDF p.15, unit 102 -->

```text
echo "0 100 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 103 -->

Nach der Zeitsynchronisation beider Geräte PPS starten.

<!-- Source EN PDF p.15, unit 104 -->

ptp4l im Hintergrund ausführen:

<!-- Source EN PDF p.15, unit 105 -->

```text
ptp4l -i eth0 -m -H &
ptp4l -i eth0 -m -H -s &
```

<!-- Source EN PDF p.15, unit 106 -->

Vereinbaren Sie für beide Geräte denselben PPS-Startzeitpunkt, etwa 200s, und geben Sie auf beiden jeweils Folgendes ein:

<!-- Source EN PDF p.15, unit 107 -->

```text
echo "0 200 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 108 -->

Führen Sie die PPS-Signale beider Geräte demselben Oszilloskop zu. Wenn die GMAC-Systemzeit 200s erreicht, werden die PPS-Signale gleichzeitig ausgegeben. Der in der Quelle gemessene Jitter zwischen beiden liegt im Bereich von Hunderten Nanosekunden und stimmt mit den ptp4l-Testdaten überein.

<!-- Source EN PDF p.15, unit 109 -->

### 3.4 Chips mit PPS-Unterstützung

<!-- Source EN PDF p.15, unit 110 -->

Laut dem Stand der Quelle unterstützen unter den PTP1588-fähigen Chips alle außer RK3568 und RV1126 die PPS-Funktion.

<!-- Source EN PDF p.15, unit 111 -->

## 4. PTP1588 unter RT-Thread

<!-- Source EN PDF p.15, unit 112 -->

Neben Linux kann auch RT-Thread PTP1588 unterstützen; beispielsweise verwendet der RK2118 RT-Thread.

<!-- Source EN PDF p.16, unit 113 -->

## 5. Häufige Probleme

<!-- Source EN PDF p.16, unit 114 -->

### 5.1 TX-Zeitüberschreitung

<!-- Source EN PDF p.16, unit 115 -->

Bei bestimmten ptp4l-Versionen mit der Meldung „timed out while polling for tx timestamp“ kann tx_timestamp_timeout in ptp4l.conf auf 400 gesetzt werden. Geben Sie die geänderte Konfigurationsdatei anschließend mit -f an oder konfigurieren Sie den Wert direkt per Befehl:

<!-- Source EN PDF p.16, unit 116 -->

```text
--tx_timestamp_timeout=400
```

<!-- Source EN PDF p.16, unit 117 -->

### 5.2 Kernel 4.19 unterstützt den Master-Modus nicht

<!-- Source EN PDF p.16, unit 118 -->

Patch anwenden:

<!-- Source EN PDF p.16, unit 119 -->

```diff
diff --git a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
index 0511062a9e0d..1e6078a17511 100644
--- a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
+++ b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
@@ -644,7 +644,8 @@ static int stmmac_hwtstamp_set(struct net_device *dev, struct ifreq *ifr)
 			config.rx_filter = HWTSTAMP_FILTER_PTP_V2_EVENT;
 			ptp_v2 = PTP_TCR_TSVER2ENA;
 			snap_type_sel = PTP_TCR_SNAPTYPSEL_1;
-			ts_event_en = PTP_TCR_TSEVNTENA;
+			if (priv->synopsys_id < DWMAC_CORE_4_10)
+				ts_event_en = PTP_TCR_TSEVNTENA;
 			ptp_over_ipv4_udp = PTP_TCR_TSIPV4ENA;
 			ptp_over_ipv6_udp = PTP_TCR_TSIPV6ENA;
 			ptp_over_ethernet = PTP_TCR_TSIPENA;
```

{% endraw %}
