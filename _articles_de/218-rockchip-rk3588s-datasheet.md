---
title: "Rockchip RK3588S: Datenblatt, Pins und elektrische Grenzwerte"
description: "Rockchip RK3588S: Datenblatt, Pins und elektrische Grenzwerte — Rev1.5"
excerpt: "Rockchip RK3588S: Datenblatt, Pins und elektrische Grenzwerte"
translation_key: "218-rockchip-rk3588s-datasheet"
slug: "218-rockchip-rk3588s-datasheet"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588S","datasheet"]
---

{% raw %}

# Rockchip RK3588S: Datenblatt, Pins und elektrische Grenzwerte

Diese ArmSoM-Referenz beschreibt den Chip und garantiert keine Platinenkompatibilität. Baustein, Schaltplan, Versorgung und BSP prüfen. Abbildungen und Werte stammen von Rockchip; ArmSoM-Hardwaretests wurden nicht durchgeführt. SDK-/Kernel-Versionen sind nicht vorgegeben.

Quellen: zwei bytegleiche englische RK3588S Rev1.5 vom2023-01-17 mit je35 Seiten in CN/EN. Die elektrischen und thermischen Kapitelzeilen nennen Rev1.2. Alle Bilder sind englisch.

## 1.1

Der RK3588S ist ein stromsparender, leistungsfähiger Prozessor für ARM-PCs, Edge-Computing-Geräte, persönliche mobile Internetgeräte und weitere digitale Multimediaanwendungen. Er integriert vier Cortex-A76- und vier Cortex-A55-Kerne mit NEON-Koprozessoren. Hardwareblöcke beschleunigen anspruchsvolle Anwendungen: H.265 und VP9 werden bis 8K@60fps, H.264 bis 8K@30fps und AV1 bis 4K@60fps dekodiert. Die H.264- und H.265-Kodierung erreicht 8K@30fps. Hinzu kommen hochwertige JPEG-Kodierung und -Dekodierung sowie spezielle Bildvor- und -nachverarbeitung. Die 3D-GPU unterstützt OpenGLES 1.1, 2.0 und 3.2, OpenCL bis 2.2 und Vulkan 1.2. Eine eigene 2D-Einheit mit MMU beschleunigt die Bildausgabe. Der vollständig in Hardware ausgeführte ISP verarbeitet bis zu 48 Megapixel und beschleunigt HDR, 3A, LSC, 3DNR, 2DNR, Schärfung, Dunstentfernung, Fischaugenkorrektur und Gammakorrektur. Die NPU unterstützt gemischte INT4/INT8/INT16/FP16-Operationen mit bis zu 6 TOPS; Modelle aus TensorFlow, MXNet, PyTorch und Caffe lassen sich konvertieren. Die vierkanalige externe Speicherschnittstelle unterstützt LPDDR4/LPDDR4X/LPDDR5 und hohe Bandbreitenanforderungen. Umfangreiche Peripherieschnittstellen ermöglichen vielseitige Anwendungen.

## 1.2.1

Mikroprozessor. Vier ARM Cortex-A76 MPCore und vier ARM Cortex-A55 MPCore verbinden hohe Leistung, niedrigen Verbrauch und Caches. Die DSU (DynamIQ Shared Unit) umfasst das L3-Speichersystem, Steuerlogik und externe Schnittstellen des DynamIQ-Clusters. Der ARMv8-A-Befehlssatz ist vollständig implementiert, einschließlich ARM NEON Advanced SIMD für Medien- und Signalverarbeitung, ARMv8-Kryptografieerweiterungen und TrustZone. Jeder A76 besitzt 64KB L1-Befehls-, 64KB L1-Daten- und 512KB L2-Cache; jeder A55 besitzt 32KB L1-Befehls-, 32KB L1-Daten- und 128KB L2-Cache. Alle acht Kerne teilen 3MB L3. Acht unabhängige Leistungsdomänen unterstützen interne Leistungsschalter und extern gesteuertes Ein-/Ausschalten je nach Anwendung: PD_CPU_0/1/2/3 entsprechen den A55-Kernen 1/2/3/4 und PD_CPU_4/5/6/7 den A76-Kernen 1/2/3/4; jeweils einschließlich NEON, FPU und L1/L2-Befehls-/Datencaches. Drei getrennte Spannungsdomänen unterstützen DVFS: A76_0+A76_1, A76_2+A76_3 und DSU+Cortex-A55.

## 1.2.2

Speicherorganisation. Das interne BootROM startet über SPI, eMMC oder SD/MMC und lädt Systemcode über USB OTG. Gemeinsamer Speicher liegt in VD_LOGIC; PMU SRAM in VD_PMU dient stromsparenden Anwendungen. Externer dynamischer Speicher entspricht JEDEC LPDDR4/LPDDR4X/LPDDR5: vier 16-Bit-Kanäle, höchstens zwei Ranks/Chip-Selects pro Kanal und bis zu 32GB Adressraum insgesamt. SDRAM unterstützt Power-down und Selbstauffrischung. eMMC entspricht vollständig JEDEC eMMC 5.1/5.0 und ist zu 4.51 und früheren Versionen abwärtskompatibel; HS400, HS200, DDR50 und herkömmliche Modi verwenden 1/4/8-Bit-Busse. SD/MMC unterstützt SD3.0 und MMC 4.51 mit 4-Bit-Bus. FSPI überträgt Daten zur und von serieller Flash-Speicherung über 1/2/4-Bit-Busse mit zwei Chip-Selects.

## 1.2.3

Systemkomponenten. Drei Cortex-M0 sind integriert: VD_PMU mit 16KB Cache und 16KB TCM, VD_NPU mit 16KB Cache und 64KB TCM, PD_CENTER mit 32KB TCM. Der programmierbare Interruptcontroller führt sämtliche CPU-GIC-IRQ-Leitungen auch zu PMU_M0 und DDR_M0; ein JTAG-Debugcontroller ist vorhanden. Die CRU erzeugt Takte mit 18 PLLs und einem 24MHz-Oszillatoreingang, schaltet Komponententakte einzeln ab und unterstützt globale sowie individuelle Softwareresets. Die PMU bietet konfigurierbare Sparmodi durch Frequenzänderung, automatische Taktabschaltung und Leistungsschaltung, mehrere Aufweckquellen, 10 Spannungsdomänen und 45 per Software schaltbare Leistungsdomänen. Es gibt 12 sichere und 18 nicht sichere Timer, jeweils mit 64-Bit-Zähler, Interruptbetrieb, freiem/benutzerdefiniertem Zählen und lesbarem Betriebszustand. 16 PWMs (PWM0–PWM15) unterstützen Interrupts, programmierbare Vorteiler des Bustakts mit weiterer Teilung, 32-Bit-Timer/Zähler, Erfassung, Dauer-/Einmal- und Referenzmodus sowie variable Tastverhältnisse; PWM3/7/11/15 sind für Infrarot optimiert. Fünf Watchdogs dienen CPU/MCU: Ein 32-Bit-Zähler zählt vom Vorgabewert auf null. Danach erfolgt entweder sofort ein Reset oder zunächst ein Interrupt und beim zweiten Ablauf ein Reset, falls die Software den Zustand nicht gelöscht hat. Der Interruptcontroller akzeptiert 12 PPI, 480 SPI und 16 Softwareinterrupts; SPI sind fest aktiv-high, PPI aktiv-low, die Priorität jeder Quelle ist programmierbar. Drei mikrocodegesteuerte DMACs unterstützen verkettetes Scatter/Gather und Speicher–Speicher-, Speicher–Peripherie- und Peripherie–Speicher-Transfers. Jeder besitzt 8 Kanäle, 32 Hardwareanforderungen, 2 Interruptausgänge und TrustZone mit kanalweiser Sicherheitseinstellung. Zwei Kryptografieeinheiten bieten LLI-DMA; Hardware-Padding für SHA-1, SHA-256/224, SHA-512/384, MD5, SM3 sowie HMAC mit SHA-1/SHA-256/SHA-512/MD5/SM3; AES-128/192/256-Ver-/Entschlüsselung; AES und SM4 mit ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC; DES/TDES mit ECB/CBC/OFB/CFB; PKA-Operationen RSA/ECC/SM2 bis 4096 Bit und Zufallszahlen. Sicherheitsfunktionen umfassen Schlüsselhierarchien, Scrambling aller DDR-Typen, sichere OTP/Debug/DFT/OS und programmierbare sichere/nicht sichere Betriebsarten anderer Master als der CPU. Manche Slaves erlauben nur sichere Master, andere programmierbar beide Klassen. Ein Teil der gemeinsamen SRAM ist ausschließlich sicher zugänglich. Externes DDR lässt sich in 16 Bereiche mit Zugriffsrechten je Master teilen. Drei Mailboxen verbinden CPU und MCU; jede enthält vier Elemente aus Datenwort, Befehlswortregister und Interruptflag. 32 Software-Sperrregister zeigen die Belegung. GZIP, LZ4 (allgemeines und älteres Frameformat), DEFLATE und ZLIB werden dekomprimiert; LZ4 Hash32 wird geprüft und die Ergebnisgröße zum Schutz vor böswilliger Speicherbeschädigung begrenzt.

## 1.2.4

Videocodec. Echtzeitdekodierung unterstützt MPEG-1/2/4, H.263, H.264, H.265, VC-1, VP9, VP8, MVC und AV1. Eine MMU ist integriert; bei geringerer Auflösung ist parallele Mehrkanaldekodierung möglich. Die folgenden Einträge bewahren Profil, Level, Auflösung und Bildrate einschließlich der Quellenmarkierung ②. H.265/H.264-Echtzeitkodierung erreicht 8K@30fps und unterstützt parallele Kanäle bei geringerer Auflösung.

| Codec | Format | Auflösung |  |
| --- | --- | --- | --- |
| H.264 AVC/MVC Main10 L6.0 | 8K@30fps | 7680x4320 | ② |
| VP9 Profile0/2 L6.1 | 8K@60fps | 7680x4320 |  |
| H.265 HEVC/MVC Main10 L6.1 | 8K@60fps | 7680x4320 |  |
| AVS2 Profile0/2 L10.2.6 | 8K@60fps | 7680x4320 |  |
| AV1 Main Profile 8/10bit L5.3 | 4K@60fps | 3840x2160 |  |
| MPEG-2 MP | 1080p@60fps | 1920x1088 |  |
| MPEG-1 MP | 1080p@60fps | 1920x1088 |  |
| VC-1 AP level 3 | 1080p@60fps | 1920x1088 |  |
| VP8 version2 | 1080p@60fps | 1920x1088 |  |

## 1.2.5

JPEG-Codec. Die Kodierung verwendet sequenzielles Baseline-DCT, 96x96–8192x8192 (67 Millionen Pixel), bis zu 90 Millionen Pixel/s und vier Kodiereinheiten. Dekodierung unterstützt 48x48–65536x65536, YUV400/YUV411/YUV420/YUV422/YUV440/YUV444 und MJPEG, bis 1080P@280fps und 560 Millionen Pixel/s. Auch unter Dekodierung nennt die Quelle vier Kodiereinheiten; diese Unstimmigkeit bleibt ausdrücklich erhalten.

## 1.2.6

Neuralprozessor. Der Beschleuniger erreicht bis zu 6 TOPS. Drei NPU-Kerne arbeiten gemeinsam zu dritt, zu zweit oder unabhängig. Unterstützt werden integer 4/8/16, float16, Bfloat16 und tf32. Der interne Puffer umfasst 384KBx3; mehrere Aufgaben und Szenarien laufen parallel. Unterstützte Frameworks sind TensorFlow, Caffe, Tflite, Pytorch, Onnx NN und Android NN. Eine eigene Spannungsdomäne ermöglicht DVFS.

## 1.2.7

Grafik. ARM Mali-G610 MP4 unterstützt OpenGLES 1.1/2.0/3.2, OpenCL 2.2 und Vulkan 1.2. Vier Shaderkerne teilen einen hierarchischen Tiler; MMU und 4x256KB L2 sind integriert. Verwendet werden Valhall, AFBC 1.3, Serial-Wire-Debugging des eingebetteten MCU und eine eigene DVFS-Domäne. 2D-Eingang: ARGB/RGB888/RGB565/YUV420/YUV422/BPP; Ausgang: ARGB/RGB888/RGB565/YUV420/YUV422. Maximale Quell-/Zielgröße: 8192x8192/4096x4096. Unterstützt werden Blocktransfer, Transparenz, Farbverlauf-/Musterfüllung, globale und pixelweise Alpha-Mischung (Farb-/Alphakanal getrennt), Überblendung, beliebige nicht ganzzahlige Skalierung 1/8–8, Drehung 0/90/180/270 Grad, X/Y-Spiegelung mit Drehung, ROP2/ROP3/ROP4 und MMU-Seiten 4k/64k. Die Bildverbesserung verarbeitet planares/semiplanares YUV420/YUV422 mit UV-Tausch, gibt semiplanares YUV420/YUV422 mit UV-Tausch und Kachelmodus aus, reduziert 422 auf 420 und bietet Deinterlacing für Bewegtbilder bis 1920x1080.

## 1.2.8

Videoeingänge. Zwei kombinierte MIPI-DPHY/CPHY unterstützen DPHY1.2 mit vier Lanes zu2.5Gbps oder CPHY1.1 mit drei Trios zu2.5Gsps. Zwei CSI-DPHY1.2 bieten je zwei Lanes zu2.5Gbps; Paare ergeben vier Lanes. Zwei DCPHY plus zwei zweispurige CSI-DPHY erlauben vier Kameras; zwei DCPHY plus ein vierspuriger erlauben drei. Ein Standard-DVP mit8/10/12/16 Bit unterstützt bis150MHz, BT.601/BT.656/BT.1120 und konfigurierbare pixel_clk/hsync/vsync-Polarität.

## 1.2.9

Bildsignalprozessor. VICAP unterstützt BT601/BT656/BT1120, sechs MIPI-CSI/DSI-Schnittstellen mit je vier IDs, RAW8/10/12/14 und YUV422, HDR über virtuelle Kanäle/Identifikationscodes/Zeilenzähler sowie RAW-Durchleitung zu ISP0/1. Maximal: zwei ISP mit 48M 8064x6048@15 oder 32M 6528x4898@30; ein ISP mit 16M 4672x3504@30. Funktionen: 3A-Statistik (AE/Histogramm, AF, AWB), FPN-Musterrauschentfernung, BLC-Schwarzpegelkorrektur, DPCC für statische/dynamische Defektpixelgruppen, PDAF-Phasenautofokus, LSC-Objektivabschattung, räumliches Bayer-2DNR/zeitliches Bayer-3DNR, CAC-Farbfehlerkorrektur, HDR aus drei Bildern, DRC-Dynamikkompression/Tonemapping, GIC-Grünabgleich, adaptive Debayer-Verarbeitung mit Farbfehlerkorrektur, CCM/CSM-Farbmatrizen und RGB2YUV, Ausgangsgamma, automatische Dunstentfernung/Effektverstärkung, kundenspezifische 3DLUT-Palette, ausschließlich horizontale LDCH-Verzeichnungskorrektur, räumliches YUV-2DNR, Schärfung/Grenzfilterung, CMSK-Privatsphärenmaske, lokales GAIN und gemeinsame ISP-Nutzung mehrerer Sensoren. FEC akzeptiert RASTER YUV422SP/YUV422I/YUV420SP und liefert dieselben RASTER-Formate oder FBCE YUV422SP/YUV420SP. Rasterdichten: 16x8/32x16; Verkleinerung bis Faktor 4; Auflösung 128x128–4095x4095; bikubische Y- und bilineare C-Interpolation.

## 1.2.10

Displayschnittstellen. Eine HDMI/eDP-TX-Kombischnittstelle unterstützen je x1/x2/x4; HDMI und eDP können innerhalb derselben Schnittstelle nicht gleichzeitig arbeiten. HDMI FRL: 3/6/8/10/12Gbps; eDP: 1.62/2.7/5.4Gbps. HDMI erreicht 7680x4320@60Hz, eDP 4K@60Hz. HDMI unterstützt RGB/YUV bis 10 Bit, DSC1.2a und HDCP2.3; eDP RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 Bit je Komponente und HDCP1.3. Eine DP-TX1.4a-Schnittstelle sind mit USB3.1 Gen1 kombiniert: 1/2/4 Lanes, 1.62/2.7/5.4/8.1Gbps, bis 7680x4320@30Hz, RGB/YUV bis 10 Bit, SST, Type-C DP Alt Mode und HDCP2.3/1.3. Zwei MIPI-Schnittstellen bieten DPHY2.0 mit 4 Lanes bis 4.5Gbps/Lane oder CPHY1.1 mit 3 Trios bis 2.0Gsps/Trio, bis 4K@60Hz, linken/rechten Doppelanzeigemodus, RGB bis 10 Bit und DSC1.1/1.2a. BT.1120-Ausgabe erreicht 1920x1080@60Hz und 150MHz. BT.1120 unterstützt außerdem RGB bis8bit.

## 1.2.11

Videoausgabeprozessor. Maximalwerte: Video Port0 7680x4320@60Hz; Port1 und Port2 je 4096x4320@60Hz; Port3 2048x1080@60Hz. Cluster0/1/2/3 unterstützen je 4096x4320 Ein-/Ausgang, AFBCD, RGB/YUV/YUYV, Skalierung 4–1/4 und Drehung. ESMART0/1/2/3 unterstützen je 4096x4320 Ein-/Ausgang, RGB/YUV/YUYV, Skalierung 8–1/8 und vier Bereiche. RGB-/YUV-Überlagerung kombiniert bis zu acht Ebenen (vier Cluster+vier ESMART). Nachverarbeitung: HDR10/HLG, HDR2SDR/SDR2HDR und 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Rückschreiben: ARGB8888/RGB888/RGB565/YUV420 bis 1920x1080.

## 1.2.12

Audioschnittstellen. I2S0/I2S1 bieten bis zu 8 TX- und 8 RX-Kanäle. Beide: 16–32 Bit, bis 192kHz, programmierbarer Master/Slave, I2S normal/links-/rechtsbündig, PCM early/late1/late2/late3 sowie TDM normal, Linksverschiebung um einen halben/einen/zwei Takte oder Rechtsverschiebung. I2S/PCM/TDM sind nicht gleichzeitig nutzbar. I2S2/I2S3 bieten je 2 TX und 2 RX, 16–32 Bit, bis 192kHz, Master/Slave und dieselben drei I2S-/vier PCM-Formate; I2S/PCM sind nicht gleichzeitig nutzbar. SPDIF0/1 speichern zwei 16-Bit-Werte in einem 32-Bit-Wort, geben Biphase-Stereo aus, richten 16–31-Bit-Daten links/rechts im 32-Bit-Puffer aus und unterstützen lineares PCM mit 16/20/24 Bit sowie nichtlineares PCM. PDM0/1: bis 8 Kanäle, 16–24 Bit, bis 192kHz, Master-Empfang. Der digitale Audiocodec besitzt zwei digitale DAC-Kanäle, I2S/PCM-Master/Slave, 16-Bit-Abtastung, drei Mischmodi je DAC und Lautstärkeregelung. VAD liest Sprache aus I2S/PDM, erkennt deren Amplitude, speichert Mikrofonarraydaten und unterstützt einen kombinierten Pegelinterrupt.

## 1.2.13

Verbindungen. SDIO unterstützt SDIO3.0 mit 4-Bit-Bus. Ein GMAC unterstützt RGMII mit 10/100/1000Mbps und RMII mit 10/100Mbps, Voll-/Halbduplex. USB3.1 Gen1 entspricht USB3.2 Gen1 und USB3.0 und erreicht 5Gbps. Eine OTG-Schnittstelle USB3OTG_0 ist mit DP TX kombiniert; ein Host USB3OTG_2 mit PIPE PHY2. Kompatibilität: USB3.0 Revision1.0, USB2.0 außer USB3OTG_2 sowie xHCI1.1. Unterstützt werden Control-, Bulk- einschließlich Stream-, Interrupt- und isochrone Transfers sowie gleichzeitige IN/OUT-Übertragung. Deskriptorcache und Datenvorabruf verbessern Systeme mit hoher Latenz. Energiemanagement: USB2.0 LPM außer USB3OTG_2 und USB3.1 U0/U1/U2/U3. Gerätefunktionen: bis 10 IN- und 6 OUT-Endpunkte, jeweils einschließlich Control-Endpunkt0; bis 16 Transferressourcen, eine je Endpunkt; flexible Endpunktkonfiguration für Anwendungen/USB-set-configuration-Modi; ERDY/Burst in Hardware; Stream-Bulk-Endpunkte mit automatisch angestoßener Datenbewegung; isochrone Endpunkte mit Datenpuffern; flexible Deskriptoren für Pufferinterruptmoderation, Mehrfachtransfers, isochrone/Control-Transfers und verteilte Puffer. xHCI-Host: bis 64 Geräte, ein Interrupter, ein USB2.0-Port außer USB3OTG_2, ein SuperSpeed-Port, Standard-/Open-Source-xHCI- und Klassentreiber. DRD unterstützt feste Geräte-/Hostrollen und ID-basierte USB3.1/USB2.0-OTG-A/B-Rollen; USB3OTG_2 bietet nur USB3.1 Gen1. SRP/HNP/RSP werden nicht unterstützt. USB2.0-PHY bietet Batterieladeerkennung; USB3OTG_0 unterstützen Type-C/DP Alt Mode; USB3OTG_2 teilt seinen PHY mit PCIe/SATA. Zwei USB2.0-Hosts unterstützen USB2.0, High-/Full-/Low-Speed mit 480/12/1.5Mbps und EHCI1.0/OHCI1.0a. Zwei Combo-PIPE-PHYs unterstützen PCIe2.1/SATA3.0/USB3.1: PHY0 wählt SATA oder PCIe2.1; PHY2 SATA, PCIe2.1 oder USB3.1 Gen1. Jede PCIe2.1-Schnittstelle besitzt eine Lane mit 5Gbps, entspricht PCI Express Base2.1 und unterstützt nur RC. SATA: je ein Port mit 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. Es gibt fünf SPI-Controller (SPI0–SPI4). Zwei Chip-Select-Ausgänge und programmierbarer serieller Master/Slave werden unterstützt. Neun I2C-Master I2C0–I2C8 bieten 7/10-Bit-Adressen und programmierbaren Takt bis 100kbit/s im Standard- oder 400kbit/s im Fast-Modus. Zehn UARTs UART0–UART9 besitzen getrennte 64-Byte-TX/RX-FIFOs, 5/6/7/8-Bit-Senden/Empfangen, Start-/Stopp-/Paritätsbits, verschiedene Eingangstakte für bis 4Mbps und automatische Flusssteuerung für alle UARTs.

## 1.2.14

Weitere Funktionen. Mehrere GPIO-Gruppen bieten Interrupts an jedem GPIO, Pegel-/Flankenauslösung, konfigurierbare Pegelpolarität, steigende/fallende/beide Flanken, schwache Pull-up-/Pull-down-Wahl und Treiberstärke. TS-ADC unterstützt benutzerdefinierte und automatische Modi. Im benutzerdefinierten Modus wird start_of_conversion vollständig durch Software gesteuert oder durch Hardware erzeugt. Automatisch lassen sich Hoch-/Tieftemperatur-Interruptschwellen und die Systemresettemperatur konfigurieren. Sieben Kanäle besitzen eigene Temperaturkriterien; Bereich −40–125°C, Auflösung 1°C. SARADC: 12 Bit, bis 1MS/s, sechs unsymmetrische Eingänge. OTP bietet 32Kbit; der obere 4k-Adressbereich ist nicht sicher (Quellenbezeichnung beibehalten). Der sichere Modus unterstützt Wortmasken für Lesen/Programmieren; maximal 32 Bit programmieren und 16 Wörter lesen; Lese-/Programmierstatus sind abfragbar, fehlgeschlagene Programmieradressen werden gespeichert. Gehäuse FCCSP1253L: Körper 17mm x 17mm, Kugeldurchmesser 0.26mm, Raster 0.4mm.

## 1.3 Blockdiagramm

![1-1. Blockdiagramm (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-1-1.png)

1-1. Blockdiagramm (englisches Original).

Zusätzliche Beschriftungen: 1MB gemeinsamer Speicher, sechs PVTM, zwei SPDIF mit „8ch“, Systemregister und SRAM/ROM/OTP. Die Grafik nennt SD3.0/MMC4.5, Abschnitt 1.2.2 MMC4.51; beide Angaben bleiben erhalten.

## 2. Gehäuse

### 2.1 Bestellung

RK3588S und RK3588S-D sind RoHS-konforme FCCSP1253L-Anwendungsprozessoren, 900pcs je Tray. D unterstützt Dolby Audio; andere Varianten erhalten dadurch keine Kompatibilitätszusage.

### 2.2 Kennzeichnung

Rockchip bezeichnet die Marke, RKXXXX den Chip, ABC den Unterauftragnehmer, XXXXXX das Die-Los, DEFG das Datum und NXXXXXX FXX das OSAT-Unterlos. Der Punkt markiert Pin1. Das Bild zeigt YYWW, die Legende DEFG; beide Angaben bleiben erhalten.

![2-1. Gehäusemarkierung (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-1.png)

2-1. Gehäusemarkierung (englisches Original).

![2-2. Gehäusemarkierung (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-2.png)

2-2. Gehäusemarkierung (englisches Original).

### 2.3 Abmessungen

Die Quelle vergibt2-4 doppelt für Unter-/Seitenansicht; Dateinamen unterscheiden sie. Maße bleiben in mm/Zoll.

![2-3. Gehäuseoberansicht (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-3.png)

2-3. Gehäuseoberansicht (englisches Original).

![2-4-bottom. Gehäuseunteransicht (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-4-bottom.png)

2-4-bottom. Gehäuseunteransicht (englisches Original).

![2-4-side. Gehäuseseitenansicht (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-4-side.png)

2-4-side. Gehäuseseitenansicht (englisches Original).

![2-5. Gehäuseabmessungen (englisches Original).](/docs/rockchip-rk3588s-datasheet/images/figure-2-5.png)

2-5. Gehäuseabmessungen (englisches Original).

| Symbol | mm Minimum | mm Nom | mm Maximum | Zoll Minimum | Zoll Nom | Zoll Maximum |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.163 | 1.240 | 1.317 | 0.046 | 0.049 | 0.052 |
| A1 | 0.120 | 0.170 | 0.220 | 0.005 | 0.007 | 0.009 |
| A2 | 1.012 | 1.070 | 1.128 | 0.040 | 0.042 | 0.044 |
| A3 | 0.570 | 0.600 | 0.630 | 0.022 | 0.024 | 0.025 |
| c | 0.420 | 0.470 | 0.520 | 0.017 | 0.019 | 0.020 |
| D | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| E | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| D1 | — | 16.400 | — | — | 0.646 | — |
| E1 | — | 16.400 | — | — | 0.646 | — |
| e | — | 0.400 | — | — | 0.016 | — |
| b | 0.210 | 0.260 | 0.310 | 0.008 | 0.010 | 0.012 |
| aaa |  | 0.100 |  |  | 0.004 |  |
| ccc |  | 0.150 |  |  | 0.006 |  |
| ddd |  | 0.130 |  |  | 0.005 |  |
| eee |  | 0.150 |  |  | 0.006 |  |
| fff |  | 0.050 |  |  | 0.002 |  |
| MD/ME |  | 42/42 |  |  |  |  |

### 2.4 Vollständige Pinliste

| Pinname | Pin | Pinname | Pin |
| --- | --- | --- | --- |
| VSS_1 | A1 | AVSS_98 | AY9 |
| VSS_2 | A2 | DDR_CH0_DQS0N_B | B1 |
| DDR_CH1_DQS1P_C | A3 | DDR_CH0_DQS0P_B | B2 |
| DDR_CH1_DQS1N_C | A4 | VSS_4 | B3 |
| DDR_CH1_ZQ_C | A5 | VSS_5 | B5 |
| DDR_CH1_WCK1N_C | A6 | DDR_CH1_WCK1P_C | B6 |
| DDR_CH1_A3_C | A7 | DDR_CH1_A6_C | B7 |
| DDR_CH1_DQS0P_C | A9 | VSS_6 | B8 |
| DDR_CH1_A4_C | A10 | DDR_CH1_DQS0N_C | B9 |
| DDR_CH1_DQ10_C | A12 | VSS_7 | B10 |
| DDR_CH1_LP4/4X_CKE1/LP5_CS1_C | A13 | VSS_8 | B11 |
| DDR_CH1_A5_C | A15 | DDR_CH1_DQ9_C | B12 |
| DDR_CH1_DQ14_C | A16 | DDR_CH1_RESET_C | B13 |
| DDR_CH1_LP4/4X_CKE0/LP5_CS0_C | A18 | VSS_9 | B14 |
| DDR_CH1_LP4/4X_CS1_C | A19 | DDR_CH1_LP4/4X_CS0_C | B15 |
| DDR_CH1_DQ2_C | A20 | DDR_CH1_DQ15_C | B16 |
| DDR_CH1_A1_C | A21 | VSS_10 | B17 |
| DDR_CH1_LP4/4X_CS1_D | A23 | DDR_CH1_A0_C | B18 |
| DDR_CH1_DQ0_D | A24 | VSS_11 | B19 |
| DDR_CH1_A0_D | A26 | DDR_CH1_DQ0_C | B20 |
| DDR_CH1_A1_D | A27 | VSS_12 | B21 |
| DDR_CH1_DQ3_D | A28 | DDR_CH1_A2_C | B22 |
| DDR_CH1_A2_D | A30 | VSS_13 | B23 |
| DDR_CH1_LP4/4X_CKE1/LP5_CS1_D | A31 | DDR_CH1_DQ2_D | B24 |
| DDR_CH1_DQ15_D | A32 | DDR_CH1_RESET_D | B25 |
| DDR_CH1_A6_D | A33 | VSS_14 | B26 |
| DDR_CH1_LP4/4X_CKE0/LP5_CS0_D | A35 | VSS_15 | B27 |
| DDR_CH1_A3_D | A36 | DDR_CH1_DQ5_D | B28 |
| DDR_CH1_WCK1P_D | A37 | VSS_16 | B29 |
| DDR_CH1_A5_D | A38 | DDR_CH1_LP4/4X_CS0_D | B30 |
| DDR_CH1_WCK0N_D | A39 | VSS_17 | B31 |
| DDR_CH1_ZQ_D | A40 | DDR_CH1_DQ12_D | B32 |
| DDR_CH1_DQS0N_D | A41 | DDR_CH1_A4_D | B33 |
| VSS_3 | A42 | VSS_18 | B34 |
| DDR_CH0_CKB_A | AA1 | VSS_19 | B35 |
| DDR_CH0_CK_A | AA2 | VSS_20 | B36 |
| VSS_296 | AA3 | DDR_CH1_WCK1N_D | B37 |
| DDR_CH0_DQ1_B | AA5 | VSS_21 | B38 |
| VSS_297 | AA6 | DDR_CH1_WCK0P_D | B39 |
| VSS_298 | AA7 | VSS_22 | B40 |
| VSS_299 | AA8 | DDR_CH1_DQS0P_D | B41 |
| VSS_300 | AA9 | VSS_23 | B42 |
| VSS_301 | AA10 | HDMI_TX0_SBDP/EDP_TX0_AUXP | BA1 |
| VSS_302 | AA11 | HDMI_TX0_D3P/EDP_TX0_D3P | BA2 |
| VSS_303 | AA12 | AVSS_116 | BA3 |
| DDR_CH0_PLL_AVSS | AA14 | HDMI_TX0_D0N/EDP_TX0_D0N | BA4 |
| VSS_304 | AA19 | HDMI_TX0_D1P/EDP_TX0_D1P | BA5 |
| VSS_305 | AA22 | AVSS_117 | BA6 |
| VSS_306 | AA23 | HDMI_TX0_D2N/EDP_TX0_D2N | BA7 |
| PLL_AVSS | AA26 | TYPEC0_SBU1/DP0_AUXP | BA8 |
| VDD_CPU_LIT_MEM_1 | AA28 | AVSS_118 | BA9 |
| VDD_CPU_LIT_MEM_2 | AA29 | TYPEC0_SSRX1N/DP0_TX0N | BA10 |
| VDD_CPU_LIT_MEM_3 | AA30 | TYPEC0_SSTX1N/DP0_TX1N | BA11 |
| VSS_307 | AA31 | AVSS_119 | BA12 |
| VSS_308 | AA37 | TYPEC0_SSRX2N/DP0_TX2N | BA13 |
| VSS_309 | AA38 | TYPEC0_SSTX2N/DP0_TX3N | BA14 |
| VSS_310 | AA39 | AVSS_120 | BA15 |
| VSS_311 | AA40 | MIPI_DPHY1_TX_D0N/MIPI_CPHY1_TX_TRIO0_A | BA16 |
| EMMC_D2/FSPI_D2_M0/GPIO2_D2_u | AA41 | MIPI_DPHY1_TX_D1P/MIPI_CPHY1_TX_TRIO1_A | BA17 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3_u | AA42 | AVSS_121 | BA18 |
| VSS_312 | AB2 | MIPI_DPHY1_TX_CLKN/MIPI_CPHY1_TX_TRIO1_B | BA19 |
| DDR_CH0_DQ3_A | AB3 | MIPI_DPHY1_TX_D2P/MIPI_CPHY1_TX_TRIO2_B | BA20 |
| DDR_CH0_DQ1_A | AB4 | AVSS_122 | BA21 |
| DDR_CH0_DQ4_A | AB5 | MIPI_DPHY1_TX_D3N/MIPI_CPHY1_TX_TRIO2_C | BA22 |
| VSS_313 | AB6 | MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B | BA23 |
| VSS_314 | AB9 | AVSS_123 | BA24 |
| VSS_315 | AB10 | MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C | BA25 |
| VSS_316 | AB11 | MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C | BA26 |
| VSS_317 | AB12 | AVSS_124 | BA27 |
| DDR_CH0_PLL_DVDD | AB14 | MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A | BA28 |
| VSS_318 | AB19 | MIPI_DPHY1_RX_D3P/NO_USE | BA29 |
| VSS_319 | AB20 | AVSS_125 | BA30 |
| VSS_320 | AB21 | MIPI_DPHY0_TX_D0N/MIPI_CPHY0_TX_TRIO0_A | BA31 |
| VSS_321 | AB22 | MIPI_DPHY0_TX_D1P/MIPI_CPHY0_TX_TRIO1_A | BA32 |
| VSS_322 | AB23 | AVSS_126 | BA33 |
| VSS_323 | AB24 | MIPI_DPHY0_TX_CLKN/MIPI_CPHY0_TX_TRIO1_B | BA34 |
| PLL_AVDD1V8 | AB25 | MIPI_DPHY0_TX_D2P/MIPI_CPHY0_TX_TRIO2_B | BA35 |
| VDD_CPU_LIT_1 | AB31 | AVSS_127 | BA36 |
| VSS_324 | AB32 | MIPI_DPHY0_TX_D3N/MIPI_CPHY0_TX_TRIO2_C | BA37 |
| VSS_325 | AB33 | MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B | BA38 |
| VSS_326 | AB34 | MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A | BA40 |
| EMMCIO_1V8_1 | AB35 | MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B | BA41 |
| VSS_327 | AB36 | MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A | BA42 |
| VSS_328 | AB37 | AVSS_128 | BB1 |
| VSS_329 | AB38 | HDMI_TX0_D3N/EDP_TX0_D3N | BB2 |
| VSS_330 | AB39 | HDMI_TX0_D0P/EDP_TX0_D0P | BB4 |
| VSS_331 | AB40 | HDMI_TX0_D1N/EDP_TX0_D1N | BB5 |
| EMMC_CLKOUT/GPIO2_A1_d | AB41 | HDMI_TX0_D2P/EDP_TX0_D2P | BB7 |
| EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4_u | AB42 | TYPEC0_SBU2/DP0_AUXN | BB8 |
| DDR_CH0_LP4/4X_CS1_A | AC1 | TYPEC0_SSRX1P/DP0_TX0P | BB10 |
| DDR_CH0_A1_A | AC2 | TYPEC0_SSTX1P/DP0_TX1P | BB11 |
| VSS_332 | AC3 | TYPEC0_SSRX2P/DP0_TX2P | BB13 |
| VSS_333 | AC4 | TYPEC0_SSTX2P/DP0_TX3P | BB14 |
| VSS_334 | AC5 | MIPI_DPHY1_TX_D0P/MIPI_CPHY1_TX_TRIO0_B | BB16 |
| VSS_335 | AC6 | MIPI_DPHY1_TX_D1N/MIPI_CPHY1_TX_TRIO0_C | BB17 |
| VDD_VDENC_6 | AC16 | MIPI_DPHY1_TX_CLKP/MIPI_CPHY1_TX_TRIO1_C | BB19 |
| VSS_336 | AC17 | MIPI_DPHY1_TX_D2N/MIPI_CPHY1_TX_TRIO2_A | BB20 |
| VSS_337 | AC18 | MIPI_DPHY1_TX_D3P/NO_USE | BB22 |
| VSS_338 | AC22 | MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A | BB23 |
| VSS_339 | AC23 | MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A | BB25 |
| VSS_340 | AC24 | MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B | BB26 |
| VSS_341 | AC25 | MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B | BB28 |
| VSS_342 | AC26 | MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C | BB29 |
| VDD_CPU_LIT_2 | AC27 | MIPI_DPHY0_TX_D0P/MIPI_CPHY0_TX_TRIO0_B | BB31 |
| VDD_CPU_LIT_3 | AC28 | MIPI_DPHY0_TX_D1N/MIPI_CPHY0_TX_TRIO0_C | BB32 |
| VDD_CPU_LIT_4 | AC29 | MIPI_DPHY0_TX_CLKP/MIPI_CPHY0_TX_TRIO1_C | BB34 |
| VDD_CPU_LIT_5 | AC30 | MIPI_DPHY0_TX_D2N/MIPI_CPHY0_TX_TRIO2_A | BB35 |
| VDD_CPU_LIT_6 | AC31 | MIPI_DPHY0_TX_D3P/NO_USE | BB37 |
| VCCIO5_1 | AC33 | MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A | BB38 |
| VCCIO5_2 | AC34 | MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C | BB41 |
| EMMCIO_1V8_2 | AC35 | AVSS_129 | BB42 |
| SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0_z | AC37 | DDR_CH0_ZQ_B | C1 |
| SDMMC_DET/GPIO0_A4_u | AC38 | VSS_24 | C2 |
| TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1_z | AC39 | DDR_CH0_WCK0N_B | C3 |
| EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2_d | AC40 | DDR_CH0_WCK0P_B | C4 |
| VSS_343 | AC41 | VSS_25 | C6 |
| DDR_CH0_LP4/4X_CKE1/LP5_CS1_A | AD1 | VSS_26 | C7 |
| VSS_344 | AD2 | DDR_CH1_WCK0P_C | C8 |
| VSS_345 | AD3 | VSS_27 | C9 |
| VSS_346 | AD5 | DDR_CH1_DQ11_C | C10 |
| VSS_347 | AD6 | VSS_28 | C11 |
| VSS_348 | AD8 | VSS_29 | C12 |
| VSS_349 | AD9 | DDR_CH1_DQ12_C | C13 |
| VSS_350 | AD10 | VSS_30 | C14 |
| VSS_351 | AD11 | VSS_31 | C15 |
| VSS_352 | AD12 | DDR_CH1_DQ5_C | C16 |
| VSS_353 | AD13 | DDR_CH1_DQ4_C | C17 |
| VSS_354 | AD14 | VSS_32 | C18 |
| VDD_VDENC_7 | AD15 | VSS_33 | C19 |
| VSS_355 | AD19 | VSS_34 | C20 |
| VSS_356 | AD20 | DDR_CH1_CK_C | C21 |
| VSS_357 | AD22 | VSS_35 | C22 |
| VSS_358 | AD23 | DDR_CH1_CK_D | C23 |
| VSS_359 | AD24 | VSS_36 | C24 |
| VSS_360 | AD25 | DDR_CH1_DQ1_D | C25 |
| VDD_CPU_LIT_7 | AD26 | VSS_37 | C26 |
| VDD_CPU_LIT_8 | AD27 | DDR_CH1_DQ6_D | C27 |
| CLK32K_IN/CLK32K_OUT0/GPIO0_B2_u | AD38 | VSS_38 | C28 |
| PMIC_SLEEP2/GPIO0_A3_d | AD39 | DDR_CH1_DQ7_D | C29 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3_d | AD40 | VSS_39 | C30 |
| EMMC_D6/FSPI_CS0N_M0/GPIO2_D6_u | AD41 | DDR_CH1_DQ14_D | C32 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5_u | AD42 | DDR_CH1_DM1_D | C33 |
| DDR_CH0_DM0_A | AE1 | DDR_CH1_DQ13_D | C34 |
| DDR_CH0_DQ6_A | AE2 | VSS_40 | C35 |
| DDR_CH0_DQ5_A | AE5 | DDR_CH1_DQS1N_D | C36 |
| VSS_361 | AE6 | VSS_41 | C37 |
| VSS_362 | AE7 | VSS_42 | C39 |
| VSS_363 | AE8 | AVSS_1 | C41 |
| VSS_364 | AE9 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | C42 |
| VSS_365 | AE10 | DDR_CH0_A3_B | D2 |
| VSS_366 | AE11 | VSS_43 | D3 |
| VSS_367 | AE12 | VSS_44 | D4 |
| VSS_368 | AE13 | VSS_45 | D7 |
| VSS_369 | AE14 | DDR_CH1_WCK0N_C | D8 |
| VSS_370 | AE15 | DDR_CH1_DQ8_C | D10 |
| VSS_371 | AE16 | VSS_46 | D11 |
| VSS_372 | AE19 | DDR_CH1_DM1_C | D13 |
| VSS_373 | AE20 | VSS_47 | D14 |
| VSS_374 | AE22 | VSS_48 | D15 |
| VSS_375 | AE23 | DDR_CH1_DQ7_C | D16 |
| VSS_376 | AE24 | DDR_CH1_DQ6_C | D17 |
| VSS_377 | AE25 | VSS_49 | D18 |
| VSS_378 | AE26 | VSS_50 | D19 |
| VDD_CPU_LIT_9 | AE27 | DDR_CH1_CKB_C | D21 |
| VSS_379 | AE38 | VSS_51 | D22 |
| VSS_380 | AE39 | DDR_CH1_CKB_D | D23 |
| VSS_381 | AE40 | DDR_CH1_DQ4_D | D25 |
| EMMC_D7/FSPI_CS1N_M0/GPIO2_D7_u | AE41 | VSS_52 | D26 |
| EMMC_CMD/FSPI_CLK_M0/GPIO2_A0_u | AE42 | DDR_CH1_DM0_D | D27 |
| DDR_CH0_A2_A | AF1 | DDR_CH1_DQ9_D | D29 |
| VSS_382 | AF2 | VSS_53 | D30 |
| DDR_CH0_DQ7_A | AF3 | VSS_54 | D31 |
| DDR_CH0_DQ14_A | AF4 | VSS_55 | D32 |
| DDR_CH0_DQ15_A | AF5 | DDR_CH1_DQ8_D | D34 |
| VSS_383 | AF6 | DDR_CH1_DQS1P_D | D36 |
| VSS_384 | AF7 | VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2_d | D38 |
| VSS_385 | AF8 | SPI2_CLK_M0/GPIO1_A6_d | D39 |
| VSS_386 | AF9 | UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5_u | D40 |
| VSS_387 | AF10 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | D41 |
| VDD_LOGIC_5 | AF12 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | D42 |
| VDD_LOGIC_6 | AF13 | DDR_CH0_A4_B | E1 |
| VSS_388 | AF16 | VSS_56 | E2 |
| VSS_389 | AF17 | DDR_CH0_WCK1P_B | E3 |
| VSS_390 | AF19 | DDR_CH0_WCK1N_B | E4 |
| VSS_391 | AF20 | VSS_57 | E5 |
| VSS_392 | AF21 | VSS_58 | E6 |
| VSS_393 | AF26 | VSS_59 | E8 |
| VSS_394 | AF27 | VSS_60 | E9 |
| VSS_395 | AF28 | VSS_61 | E10 |
| VSS_396 | AF29 | VSS_62 | E12 |
| VSS_397 | AF30 | DDR_CH1_DQ13_C | E13 |
| VSS_398 | AF31 | VSS_63 | E16 |
| VSS_399 | AF32 | DDR_CH1_DM0_C | E17 |
| VSS_400 | AF33 | VSS_64 | E18 |
| VSS_401 | AF34 | VSS_65 | E19 |
| RESERVED | AF35 | DDR_CH1_DQ1_C | E20 |
| VCCIO5_1V8 | AF36 | VSS_66 | E21 |
| VSS_402 | AF37 | VSS_67 | E23 |
| VSS_403 | AF38 | VSS_68 | E25 |
| VSS_404 | AF39 | VSS_69 | E27 |
| VSS_405 | AF40 | DDR_CH1_DQ10_D | E29 |
| VSS_406 | AF41 | VSS_70 | E30 |
| DDR_CH0_RESET_A | AG1 | VSS_71 | E31 |
| DDR_CH0_A5_A | AG2 | DDR_CH1_DQ11_D | E32 |
| VSS_407 | AG3 | VSS_72 | E33 |
| VSS_408 | AG4 | VSS_73 | E34 |
| VSS_409 | AG5 | VSS_74 | E37 |
| VSS_410 | AG6 | VSS_75 | E38 |
| VSS_411 | AG7 | VSS_76 | E39 |
| VSS_412 | AG8 | AVSS_2 | E40 |
| VSS_413 | AG15 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | E41 |
| VSS_414 | AG16 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_B | F1 |
| VSS_415 | AG17 | VSS_77 | F2 |
| VSS_416 | AG18 | VSS_78 | F3 |
| VSS_417 | AG19 | VSS_79 | F4 |
| VSS_418 | AG20 | VSS_80 | F8 |
| VSS_419 | AG21 | VSS_81 | F9 |
| VSS_420 | AG22 | VSS_82 | F10 |
| VSS_421 | AG23 | VSS_83 | F13 |
| VSS_422 | AG24 | VSS_84 | F14 |
| VSS_423 | AG25 | VSS_85 | F15 |
| VSS_424 | AG28 | VSS_86 | F16 |
| VSS_425 | AG29 | VSS_87 | F19 |
| VSS_426 | AG31 | DDR_CH1_DQ3_C | F20 |
| VSS_427 | AG32 | VSS_88 | F21 |
| VSS_428 | AG33 | VSS_89 | F23 |
| VSS_429 | AG34 | VSS_90 | F29 |
| VSS_430 | AG35 | VSS_91 | F31 |
| PMIC_SLEEP4/GPIO0_C2_d | AG36 | VSS_92 | F33 |
| LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3_u | AG37 | VSS_93 | F34 |
| I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/PWM4_M0/GPIO0_C5_u | AG38 | VSS_94 | F35 |
| I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/GPIO0_D0_d | AG39 | VSS_95 | F36 |
| VSS_431 | AG40 | MIPI_CAMERA2_CLK_M0/SPDIF1_TX_M0/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7_u | F37 |
| I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/SPI3_MOSI_M2/GPIO0_D2_u | AG41 | VSS_96 | F38 |
| PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6_d | AG42 | VSS_97 | F39 |
| VSS_432 | AH2 | AVSS_3 | F40 |
| VSS_433 | AH3 | PCIE20_2_REFCLKP | F41 |
| VSS_435 | AH5 | PCIE20_2_REFCLKN | F42 |
| VSS_436 | AH7 | DDR_CH0_DM1_B | G2 |
| VSS_437 | AH8 | VSS_98 | G3 |
| VSS_438 | AH9 | DDR_CH0_DQ10_B | G4 |
| VSS_439 | AH10 | DDR_CH0_DQ8_B | G5 |
| VDD_LOGIC_7 | AH11 | VSS_99 | G6 |
| VDD_LOGIC_8 | AH12 | VSS_100 | G8 |
| VDD_LOGIC_9 | AH13 | VSS_101 | G9 |
| VDD_LOGIC_10 | AH14 | VSS_102 | G10 |
| VDD_LOGIC_11 | AH15 | VSS_103 | G12 |
| VSS_440 | AH16 | VSS_104 | G20 |
| VSS_441 | AH17 | VSS_105 | G21 |
| VDD_GPU_1 | AH18 | VSS_106 | G22 |
| VDD_GPU_2 | AH19 | DDR_CH1_VDDQ_CKE | G24 |
| VDD_GPU_3 | AH20 | VSS_107 | G25 |
| VDD_GPU_4 | AH21 | VSS_108 | G26 |
| VDD_LOGIC_12 | AH23 | VCCIO4_1V8_1 | G27 |
| VDD_LOGIC_13 | AH24 | VCCIO4_1V8_2 | G28 |
| VDD_NPU_MEM_1 | AH25 | VSS_109 | G29 |
| VDD_NPU_MEM_2 | AH26 | VCCIO4 | G31 |
| VSS_442 | AH28 | PCIE20_SATA30_0_AVDD_1V8 | G34 |
| VSS_443 | AH29 | AVSS_4 | G36 |
| VSS_444 | AH36 | SPI2_MISO_M0/GPIO1_A4_d | G37 |
| TSADC_TEST_OUT_TS | AH37 | MIPI_CAMERA4_CLK_M0/I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7_u | G38 |
| PMIC_SLEEP5/GPIO0_C3_d | AH38 | PDM1_SDI2_M1/SPI0_MISO_M2/GPIO1_B1_d | G39 |
| I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE20X1_1_CLKREQN_M0/GPIO0_B5_d | AH39 | PCIE20X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0_d | G40 |
| VSS_434 | AH4 | AVSS_5 | G41 |
| I2S1_SCLK_TX_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE20X1_1_WAKEN_M0/GPIO0_B6_d | AH40 | DDR_CH0_A6_B | H1 |
| I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/SPI0_CS0_M0/HDMI_TX0_CEC_M1/GPIO0_D1_u | AH41 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_B | H2 |
| I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/SATA_CP_POD/GPIO0_C6_u | AH42 | VSS_110 | H3 |
| DDR_CH0_DQ2_A | AJ1 | VSS_111 | H4 |
| DDR_CH0_DQ0_A | AJ2 | VSS_112 | H5 |
| DDR_CH0_DQ12_A | AJ3 | VSS_113 | H6 |
| VSS_445 | AJ5 | VSS_114 | H11 |
| DDR_CH0_DQ11_A | AJ6 | VSS_115 | H12 |
| VSS_446 | AJ7 | DDR_CH1_VDDQ_1 | H14 |
| VSS_447 | AJ8 | DDR_CH1_VDDQ_2 | H15 |
| VSS_448 | AJ9 | DDR_CH1_VDDQ_3 | H16 |
| VSS_449 | AJ10 | DDR_CH1_VDDQ_4 | H18 |
| VSS_450 | AJ11 | DDR_CH1_VDDQ_5 | H20 |
| VSS_451 | AJ12 | VSS_116 | H22 |
| VDD_LOGIC_14 | AJ15 | DDR_CH1_VDDQ_CK | H24 |
| VSS_452 | AJ16 | VSS_117 | H25 |
| VDD_GPU_MEM_1 | AJ18 | VDD_LOGIC_1 | H27 |
| VDD_GPU_5 | AJ19 | VSS_118 | H29 |
| VDD_GPU_6 | AJ20 | VCCIO1_1V8 | H31 |
| VDD_GPU_7 | AJ21 | PCIE20_SATA30_USB30_2_AVDD_1V8 | H34 |
| VDD_NPU_MEM_3 | AJ25 | PCIE20_SATA30_0_AVDD_0V85 | H36 |
| VSS_453 | AJ26 | AVSS_6 | H37 |
| VSS_454 | AJ27 | PDM1_SDI0_M1/PCIE20X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7_u | H38 |
| VSS_455 | AJ28 | PDM1_SDI1_M1/SPI2_CS1_M0/GPIO1_B0_u | H39 |
| VSS_456 | AJ29 | AVSS_7 | H40 |
| VSS_457 | AJ30 | PCIE20_0_TXP/SATA30_0_TXP | H41 |
| VDD_LOGIC_15 | AJ31 | PCIE20_0_TXN/SATA30_0_TXN | H42 |
| VDD_LOGIC_16 | AJ32 | DDR_CH0_LP4/4X_CS0_B | J1 |
| VCCIO6_1V8 | AJ34 | VSS_119 | J2 |
| VSS_458 | AJ35 | DDR_CH0_DQ9_B | J3 |
| PMU_0V75_1 | AJ36 | DDR_CH0_DQ11_B | J4 |
| PMU_0V75_2 | AJ37 | DDR_CH0_DQ14_B | J5 |
| VSS_459 | AJ38 | VSS_120 | J6 |
| VSS_460 | AJ39 | VSS_121 | J7 |
| VSS_461 | AJ40 | VSS_122 | J8 |
| VSS_462 | AJ41 | VSS_123 | J9 |
| DDR_CH0_LP4/4X_CKE0/LP5_CS0_A | AK1 | VSS_124 | J10 |
| VSS_463 | AK2 | VSS_125 | J12 |
| DDR_CH0_DQ13_A | AK3 | VSS_126 | J14 |
| DDR_CH0_DM1_A | AK4 | VSS_127 | J15 |
| DDR_CH0_DQ8_A | AK5 | VSS_128 | J16 |
| VSS_464 | AK6 | DDR_CH1_VDD_1 | J18 |
| VSS_465 | AK7 | DDR_CH1_VDD_MIF_1 | J20 |
| NC | AK9 | VSS_129 | J22 |
| VCCIO2 | AK10 | VSS_130 | J24 |
| VCCIO2_1V8 | AK11 | VSS_131 | J26 |
| HDMI/eDP_TX0_VDD_IO_1V8 | AK12 | VDD_LOGIC_2 | J27 |
| VDD_LOGIC_17 | AK15 | VSS_132 | J29 |
| VSS_466 | AK16 | VSS_133 | J30 |
| VDD_GPU_MEM_2 | AK18 | VSS_134 | J31 |
| VDD_GPU_8 | AK21 | PCIE20_SATA30_USB30_2_AVDD_0V85 | J36 |
| VSS_467 | AK22 | AVSS_8 | J38 |
| VDD_NPU_MEM_4 | AK25 | AVSS_9 | J39 |
| VSS_468 | AK26 | AVSS_10 | J40 |
| VDD_NPU_1 | AK27 | PCIE20_0_RXN/SATA30_0_RXN | J41 |
| VDD_NPU_2 | AK28 | PCIE20_0_RXP/SATA30_0_RXP | J42 |
| VDD_NPU_3 | AK29 | DDR_CH0_DQS1P_B | K1 |
| VSS_469 | AK30 | DDR_CH0_DQS1N_B | K2 |
| I2S1_LRCK_TX_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE20X1_1_PERSTN_M0/GPIO0_B7_d | AK39 | VSS_135 | K3 |
| VSS_470 | AK40 | VSS_136 | K6 |
| MIPI_CSI0_D1P | AK41 | VSS_137 | K7 |
| MIPI_CSI0_D1N | AK42 | DDR_CH0_VDDQ_CK_1 | K9 |
| DDR_CH0_A3_A | AL2 | VSS_138 | K10 |
| VSS_471 | AL3 | VSS_139 | K11 |
| VSS_472 | AL4 | VSS_140 | K12 |
| VSS_473 | AL5 | VSS_141 | K14 |
| HDMI/eDP_TX0_VDD_CMN_1V8 | AL14 | VSS_142 | K17 |
| AVSS_24 | AL15 | DDR_CH1_VDD_2 | K18 |
| VSS_474 | AL16 | DDR_CH1_VDD_MIF_2 | K20 |
| VDD_GPU_MEM_3 | AL18 | VSS_143 | K22 |
| VDD_GPU_9 | AL21 | VSS_144 | K23 |
| VSS_475 | AL22 | VSS_145 | K25 |
| VDD_NPU_4 | AL28 | VSS_146 | K26 |
| VDD_NPU_5 | AL29 | VDD_CPU_BIG0_MEM_1 | K27 |
| VDD_NPU_6 | AL30 | VDD_CPU_BIG0_MEM_2 | K28 |
| VDD_LOGIC_18 | AL31 | VDD_CPU_BIG0_MEM_3 | K29 |
| VCCIO6_1 | AL33 | VDD_CPU_BIG0_MEM_4 | K30 |
| VSS_476 | AL35 | VSS_147 | K31 |
| I2S1_LRCK_RX_M1/PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/GPIO0_C4_d | AL38 | VSS_148 | K32 |
| I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/SATA_CPDET/GPIO0_D4_u | AL39 | VSS_149 | K33 |
| I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/GPIO0_C7_d | AL40 | AVSS_11 | K34 |
| MIPI_CSI0_D0N | AL41 | AVSS_12 | K35 |
| MIPI_CSI0_D0P | AL42 | AVSS_13 | K36 |
| DDR_CH0_ZQ_A | AM1 | AVSS_14 | K37 |
| DDR_CH0_A6_A | AM2 | AVSS_15 | K38 |
| VSS_477 | AM4 | AVSS_16 | K39 |
| VSS_478 | AM5 | AVSS_17 | K40 |
| HDMI/eDP_TX0_VDD_0V75_1 | AM13 | PCIE20_0_REFCLKN | K41 |
| AVSS_25 | AM14 | DDR_CH0_A5_B | L1 |
| AVSS_26 | AM15 | VSS_150 | L2 |
| VSS_479 | AM16 | VSS_151 | L3 |
| VSS_480 | AM17 | VSS_152 | L5 |
| VDD_GPU_10 | AM21 | VSS_153 | L6 |
| VDD_GPU_11 | AM22 | DDR_CH0_VDDQ_CK_2 | L9 |
| VSS_481 | AM23 | VSS_154 | L10 |
| VSS_482 | AM25 | VSS_155 | L11 |
| VSS_483 | AM27 | VSS_156 | L12 |
| VDD_NPU_7 | AM30 | VSS_157 | L14 |
| VSS_484 | AM31 | DDR_CH1_PLL_AVDD1V8 | L15 |
| VSS_485 | AM32 | DDR_CH1_VDD_3 | L18 |
| VCCIO6_2 | AM33 | DDR_CH1_VDD_MIF_3 | L20 |
| MIPI_CSI0_AVCC1V8 | AM35 | VSS_158 | L22 |
| MIPI_CSI0_AVCC0V75 | AM37 | VSS_159 | L23 |
| PMIC_SLEEP3/GPIO0_C1_d | AM38 | VSS_160 | L24 |
| I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5_u | AM39 | VSS_161 | L32 |
| I2S1_SCLK_RX_M1/PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/GPIO0_C0_d | AM40 | VSS_162 | L33 |
| VSS_486 | AM41 | AVSS_18 | L34 |
| DDR_CH0_DQS0P_A | AN1 | AVSS_19 | L35 |
| DDR_CH0_DQS0N_A | AN2 | VSS_163 | L36 |
| VSS_487 | AN3 | MIPI_CAMERA3_CLK_M0/I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6_u | L37 |
| DDR_CH0_DQ10_A | AN4 | MIPI_CAMERA1_CLK_M0/SPDIF0_TX_M0/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6_u | L38 |
| DDR_CH0_DQ9_A | AN5 | I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3_d | L39 |
| VSS_488 | AN6 | PCIE20X1_1_WAKEN_M2/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1_d | L40 |
| VSS_489 | AN7 | AVSS_20 | L41 |
| OTP_VDDOTP_0V75 | AN8 | PCIE20_0_REFCLKP | L42 |
| HDMI/eDP_TX0_AVDD_0V75 | AN10 | DDR_CH0_LP4/4X_CS1_B | M1 |
| AVSS_27 | AN11 | VSS_164 | M2 |
| HDMI/eDP_TX0_VDD_0V75_2 | AN12 | VSS_165 | M5 |
| AVSS_28 | AN13 | DDR_CH0_VDDQ_CKE_1 | M6 |
| AVSS_29 | AN14 | DDR_CH0_VDDQ_CKE_2 | M7 |
| AVSS_30 | AN15 | VSS_166 | M8 |
| VSS_490 | AN17 | VSS_167 | M9 |
| AVSS_31 | AN18 | VSS_168 | M10 |
| VDD_GPU_12 | AN21 | VSS_169 | M12 |
| VDD_GPU_13 | AN22 | VSS_170 | M14 |
| VSS_491 | AN23 | DDR_CH1_PLL_DVDD | M16 |
| VSS_492 | AN25 | VSS_171 | M17 |
| VDD_NPU_8 | AN30 | VSS_172 | M19 |
| VSS_493 | AN31 | VSS_173 | M21 |
| VSS_494 | AN32 | VSS_174 | M22 |
| VSS_495 | AN33 | VSS_175 | M23 |
| VSS_496 | AN34 | VDD_CPU_BIG0_1 | M24 |
| VSS_497 | AN35 | VDD_CPU_BIG0_2 | M25 |
| VSS_498 | AN37 | VDD_CPU_BIG0_3 | M28 |
| VSS_499 | AN38 | VDD_CPU_BIG0_4 | M29 |
| VSS_500 | AN39 | VDD_CPU_BIG0_5 | M30 |
| VSS_501 | AN40 | AVSS_21 | M33 |
| MIPI_CSI0_CLK0N | AN41 | AVSS_22 | M34 |
| MIPI_CSI0_CLK0P | AN42 | VSS_176 | M35 |
| VSS_502 | AP2 | VSS_177 | M36 |
| VSS_503 | AP5 | PDM1_CLK1_M1/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3_d | M37 |
| VSS_504 | AP6 | PDM1_SDI3_M1/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2_d | M38 |
| AVSS_32 | AP7 | PDM1_CLK0_M1/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4_u | M39 |
| AVSS_33 | AP8 | HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5_d | M40 |
| AVSS_34 | AP9 | I2S0_LRCK_RX/PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6_d | M41 |
| AVSS_35 | AP10 | I2S0_SCLK_TX/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3_d | M42 |
| AVSS_36 | AP11 | DDR_CH0_DQ2_B | N1 |
| AVSS_37 | AP16 | DDR_CH0_DQ13_B | N2 |
| TYPEC0_DP0_VDDA_0V85_1 | AP18 | VSS_178 | N3 |
| AVSS_38 | AP22 | DDR_CH0_DQ12_B | N5 |
| SARADC_AVDD_1V8 | AP23 | DDR_CH0_DQ15_B | N6 |
| VSS_505 | AP25 | VSS_179 | N7 |
| VSS_506 | AP27 | VSS_180 | N9 |
| VDD_NPU_9 | AP30 | VSS_181 | N11 |
| AVSS_39 | AP31 | VSS_182 | N12 |
| AVSS_40 | AP32 | DDR_CH1_PLL_AVSS | N15 |
| VSS_507 | AP33 | VSS_183 | N16 |
| VSS_508 | AP34 | VSS_184 | N17 |
| VSS_509 | AP35 | VSS_185 | N18 |
| VSS_510 | AP37 | VSS_186 | N21 |
| VSS_511 | AP38 | VSS_187 | N22 |
| VSS_512 | AP39 | VDD_CPU_BIG0_6 | N24 |
| VSS_513 | AP40 | VDD_CPU_BIG0_7 | N25 |
| MIPI_CSI0_D3N | AP41 | AVSS_23 | N33 |
| MIPI_CSI0_D3P | AP42 | VSS_188 | N34 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5_d | AR1 | OSC_1V8_1 | N35 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1_u | AR2 | OSC_1V8_2 | N36 |
| VSS_514 | AR3 | PMUIO1_1V8_1 | N37 |
| VSS_515 | AR4 | VSS_189 | N38 |
| DDR_CH0_WCK0N_A | AR5 | VSS_190 | N39 |
| DDR_CH0_WCK0P_A | AR6 | VSS_191 | N40 |
| AVSS_41 | AR9 | I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1_z | N41 |
| AVSS_42 | AR16 | I2S0_SDI0/GPIO1_D4_d | N42 |
| AVSS_43 | AR18 | DDR_CH0_RESET_B | P1 |
| TYPEC0_DP0_VDDA_0V85_2 | AR19 | VSS_192 | P2 |
| AVSS_44 | AR20 | DDR_CH0_DQ5_B | P3 |
| AVSS_45 | AR21 | DDR_CH0_DQ4_B | P4 |
| AVSS_46 | AR22 | DDR_CH0_DQ7_B | P5 |
| TYPEC0_DP0_VDDH_1V8 | AR23 | VSS_193 | P6 |
| AVSS_47 | AR25 | VSS_194 | P7 |
| MIPI_D/C_PHY1_VDD | AR27 | VSS_195 | P8 |
| MIPI_D/C_PHY1_VDD_1V8_1 | AR30 | VSS_196 | P9 |
| MIPI_D/C_PHY0_VDD | AR33 | DDR_CH0_VDDQ_1 | P10 |
| MIPI_D/C_PHY1_VDD_1V2_1 | AR34 | VSS_197 | P12 |
| MIPI_D/C_PHY0_VDD_1V2_2 | AR35 | VDD_VDENC_1 | P15 |
| GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0_d | AR36 | VSS_198 | P16 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D2_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1_u | AR37 | VSS_199 | P17 |
| GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0_u | AR38 | VSS_200 | P18 |
| GMAC1_RXD1/I2S2_SCLK_RX_M1/MIPI_CAMERA3_CLK_M1/PWM9_M0/GPIO3_B0_u | AR39 | VSS_201 | P19 |
| VSS_516 | AR40 | VDD_CPU_BIG0_8 | P23 |
| VSS_517 | AR41 | VSS_202 | P25 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3_u | AT1 | VSS_203 | P26 |
| VSS_518 | AT2 | VSS_204 | P27 |
| DDR_CH0_WCK1N_A | AT3 | VSS_205 | P28 |
| DDR_CH0_WCK1P_A | AT4 | VSS_206 | P29 |
| VSS_519 | AT5 | VSS_207 | P30 |
| VSS_520 | AT6 | VSS_208 | P31 |
| AVSS_48 | AT7 | VSS_209 | P32 |
| AVSS_49 | AT8 | VSS_210 | P33 |
| USB20_AVDD_3V3 | AT10 | VSS_211 | P34 |
| USB20_DVDD_0V75_1 | AT11 | PDM0_SDI0_M0/SPI1_CS1_M2/GPIO1_D5_d | P38 |
| USB20_DVDD_0V75_2 | AT12 | I2S0_LRCK_TX/I2C2_SCL_M3/UART4_RTSN/GPIO1_C5_d | P39 |
| USB20_AVDD_1V8_1 | AT13 | I2S0_SDO3/I2S0_SDI2/PDM0_SDI2_M0/I2C1_SCL_M4/UART4_TX_M0/PWM0_M1/SPI1_CLK_M2/GPIO1_D2_d | P40 |
| USB20_AVDD_1V8_2 | AT14 | I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7_d | P41 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE20X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2_u | AT15 | DDR_CH0_A2_B | R1 |
| AVSS_50 | AT16 | DDR_CH0_A1_B | R2 |
| TYPEC0_DP0_VDD_0V85 | AT18 | VSS_212 | R3 |
| AVSS_51 | AT19 | VSS_213 | R4 |
| AVSS_52 | AT20 | VSS_214 | R8 |
| AVSS_53 | AT21 | DDR_CH0_VDDQ_2 | R10 |
| AVSS_54 | AT22 | VDD_VDENC_2 | R15 |
| AVSS_55 | AT23 | VSS_215 | R16 |
| MIPI_D/C_PHY1_VREG | AT27 | VSS_216 | R20 |
| AVSS_56 | AT29 | VSS_217 | R21 |
| MIPI_D/C_PHY0_VDD_1V8_2 | AT30 | VDD_CPU_BIG0_9 | R23 |
| MIPI_D/C_PHY0_VREG | AT33 | VDD_CPU_BIG0_10 | R24 |
| VSS_521 | AT36 | VSS_218 | R25 |
| GMAC1_RXD0/MIPI_CAMERA2_CLK_M1/PWM8_M0/GPIO3_A7_u | AT37 | VDD_CPU_BIG1_1 | R26 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2_u | AT38 | VDD_CPU_BIG1_2 | R27 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4_d | AT39 | VDD_CPU_BIG1_3 | R28 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3_u | AT40 | VDD_CPU_BIG1_4 | R29 |
| MIPI_CSI0_D2P | AT41 | VDD_CPU_BIG1_5 | R30 |
| MIPI_CSI0_D2N | AT42 | VDD_CPU_BIG1_6 | R31 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4_u | AU1 | VDD_CPU_BIG1_7 | R32 |
| VSS_522 | AU2 | VDD_CPU_BIG1_8 | R33 |
| VSS_523 | AU3 | VSS_219 | R35 |
| VSS_524 | AU4 | PMUIO1_1V8_2 | R36 |
| USB20_HOST1_REXT | AU6 | I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0_z | R38 |
| TYPEC0_USB20_OTG0_REXT | AU7 | I2S0_SDI1/PDM0_SDI3_M0/I2C1_SDA_M4/UART4_RX_M0/PWM1_M1/SPI1_CS0_M2/GPIO1_D3_d | R39 |
| AVSS_57 | AU8 | VSS_220 | T2 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5_d | AU15 | VSS_221 | T3 |
| AVSS_58 | AU16 | VSS_222 | T4 |
| AVSS_59 | AU18 | DDR_CH0_VDDQ_3 | T10 |
| AVSS_60 | AU19 | DDR_CH0_VDD_1 | T12 |
| AVSS_61 | AU21 | DDR_CH0_VDD_2 | T13 |
| MIPI_CAMERA0_CLK_M0/SPDIF1_TX_M1/I2S1_SDO0_M0/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1_u | AU22 | VDD_VDENC_3 | T15 |
| BT1120_D11/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5_d | AU23 | VSS_224 | T16 |
| AVSS_62 | AU24 | VSS_225 | T17 |
| AVSS_63 | AU25 | VSS_226 | T18 |
| AVSS_64 | AU27 | VSS_227 | T20 |
| AVSS_65 | AU28 | VSS_228 | T21 |
| AVSS_66 | AU29 | VSS_229 | T24 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7_u | AU30 | VSS_230 | T25 |
| AVSS_67 | AU31 | VDD_CPU_BIG1_9 | T26 |
| CIF_D8/FSPI_CS0N_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4_u | AU34 | VSS_231 | T35 |
| VSS_525 | AU35 | VSS_232 | T36 |
| VSS_526 | AU38 | VSS_233 | T37 |
| VSS_527 | AU39 | VSS_234 | T38 |
| VSS_528 | AU40 | VSS_235 | T39 |
| MIPI_CSI0_CLK1P | AU41 | VSS_236 | T40 |
| MIPI_CSI0_CLK1N | AU42 | XIN_24M | T41 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2_u | AV1 | XOUT_24M | T42 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0_u | AV2 | VSS_223 | T7 |
| DDR_CH0_DQS1N_A | AV3 | DDR_CH0_A0_A | U1 |
| DDR_CH0_DQS1P_A | AV4 | DDR_CH0_A0_B | U2 |
| VSS_529 | AV5 | DDR_CH0_DQ0_B | U3 |
| USB20_HOST0_DM | AV6 | DDR_CH0_DQ6_B | U4 |
| USB20_HOST1_DP | AV7 | DDR_CH0_DQ3_B | U5 |
| AVSS_68 | AV8 | VSS_237 | U6 |
| AVSS_69 | AV9 | VSS_238 | U7 |
| TYPEC0_USB20_VBUSDET | AV10 | VSS_239 | U8 |
| SARADC_IN2 | AV11 | DDR_CH0_VDD_3 | U12 |
| AVSS_70 | AV12 | DDR_CH0_VDD_4 | U13 |
| SARADC_IN3 | AV13 | VDD_VDENC_4 | U15 |
| AVSS_71 | AV14 | VSS_240 | U16 |
| AVSS_72 | AV15 | VSS_241 | U17 |
| AVSS_73 | AV16 | VSS_242 | U18 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6_d | AV18 | VSS_243 | U20 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE20X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0_d | AV19 | VSS_244 | U21 |
| AVSS_74 | AV21 | VSS_245 | U22 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7_u | AV22 | VSS_246 | U23 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3_u | AV23 | VSS_247 | U24 |
| AVSS_75 | AV25 | VSS_248 | U25 |
| CIF_D2/BT1120_D2/I2S1_LRCK_TX_M0/PCIE20X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2_d | AV26 | VDD_CPU_BIG1_10 | U26 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4_u | AV27 | I2S0_SCLK_RX/PDM0_CLK1_M0/I2C2_SDA_M3/PWM11_IR_M2/SPI4_CS1_M0/GPIO1_C4_d | U35 |
| AVSS_76 | AV29 | I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2_d | U36 |
| CIF_D10/SPI3_MISO_M3/GPIO3_C6_u | AV30 | I2S0_SDO1/I2C7_SCL_M0/UART6_TX_M2/SPI1_MISO_M2/GPIO1_D0_d | U37 |
| HDMI_TX0_HPD_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4_d | AV31 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/I2C7_SDA_M0/UART6_RX_M2/SPI1_MOSI_M2/GPIO1_D1_d | U38 |
| AVSS_77 | AV32 | VSS_249 | U39 |
| AVSS_78 | AV33 | VSS_250 | U40 |
| CIF_D9/FSPI_CS1N_M2/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5_u | AV34 | VSS_251 | U41 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4_u | AV35 | DDR_CH0_CKB_B | V1 |
| VSS_530 | AV36 | DDR_CH0_CK_B | V2 |
| ETH1_REFCLKO_25M/MIPI_CAMERA1_CLK_M1/I2C4_SCL_M0/GPIO3_A6_d | AV37 | VSS_252 | V3 |
| GMAC1_RXCLK/SDIO_CLK_M1/MIPI_CAMERA0_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5_d | AV38 | DDR_CH0_DM0_B | V5 |
| GMAC1_RXDV_CRS/I2S2_LRCK_RX_M1/MIPI_CAMERA4_CLK_M1/UART2_TX_M2/PWM2_M1/GPIO3_B1_d | AV39 | VSS_253 | V6 |
| GMAC1_MDC/MIPI_TE0/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2_d | AV40 | VSS_254 | V7 |
| VSS_531 | AV41 | VSS_255 | V8 |
| VSS_532 | AW3 | DDR_CH0_VDDQ_4 | V10 |
| VSS_533 | AW4 | DDR_CH0_VDD_MIF_1 | V12 |
| USB20_HOST0_REXT | AW5 | DDR_CH0_VDD_MIF_2 | V13 |
| USB20_HOST0_DP | AW6 | DDR_CH0_VDD_MIF_3 | V14 |
| USB20_HOST1_DM | AW7 | VSS_256 | V16 |
| AVSS_79 | AW8 | VSS_257 | V17 |
| AVSS_80 | AW9 | VSS_258 | V19 |
| TYPEC0_USB20_OTG_ID | AW10 | VSS_259 | V23 |
| TYPEC0_DP0_REXT | AW11 | VSS_260 | V24 |
| AVSS_81 | AW12 | VSS_261 | V25 |
| SARADC_IN5 | AW13 | VDD_CPU_BIG1_MEM_1 | V26 |
| AVSS_82 | AW14 | VDD_CPU_BIG1_MEM_2 | V27 |
| SARADC_IN0_BOOT | AW15 | VDD_CPU_BIG1_MEM_3 | V28 |
| AVSS_83 | AW16 | VDD_CPU_BIG1_MEM_4 | V29 |
| AVSS_84 | AW17 | VSS_262 | V30 |
| CIF_D1/BT1120_D1/I2S1_SCLK_TX_M0/PCIE20X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1_d | AW18 | VSS_263 | V31 |
| CIF_D4/BT1120_D4/I2S1_LRCK_RX_M0/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4_d | AW19 | VSS_264 | V32 |
| AVSS_85 | AW21 | VSS_265 | V33 |
| BT1120_D12/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6_d | AW22 | VSS_266 | V34 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0_u | AW23 | PMUIO2_1 | V35 |
| AVSS_86 | AW25 | PMUIO2_2 | V36 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7_d | AW26 | PMUIO2_1V8_1 | V37 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0_d | AW27 | VSS_267 | V38 |
| AVSS_87 | AW28 | VSS_268 | V39 |
| AVSS_88 | AW29 | VSS_269 | V40 |
| MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5_d | AW30 | TVSS | V41 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0_u | AW31 | NPOR | V42 |
| AVSS_89 | AW32 | VSS_270 | W2 |
| AVSS_90 | AW33 | VSS_271 | W5 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2_d | AW34 | VSS_272 | W7 |
| GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3_u | AW35 | VSS_273 | W8 |
| AVSS_91 | AW36 | VSS_274 | W9 |
| GMAC1_MCLKINOUT/I2S2_LRCK_TX_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6_d | AW37 | DDR_CH0_VDDQ_5 | W10 |
| GMAC1_PPSCLK/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1_d | AW38 | VDD_VDENC_5 | W16 |
| GMAC1_MDIO/MIPI_TE1/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3_d | AW39 | VDD_VDENC_MEM_1 | W17 |
| AVSS_92 | AW40 | VSS_275 | W18 |
| MIPI_DPHY0_RX_D3P/NO_USE | AW41 | VSS_276 | W19 |
| MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C | AW42 | VSS_277 | W22 |
| HDMI_TX0_SBDN/EDP_TX0_AUXN | AY1 | VSS_278 | W23 |
| AVSS_93 | AY2 | VSS_279 | W24 |
| HDMI/eDP_TX0_REXT | AY3 | VSS_280 | W26 |
| AVSS_94 | AY4 | VDD_LOGIC_3 | W33 |
| AVSS_95 | AY5 | REFCLK_OUT/GPIO0_A0_d | W38 |
| AVSS_96 | AY7 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6_z | W39 |
| AVSS_97 | AY8 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1_z | W40 |
| TYPEC0_USB20_OTG_DM | AY10 | PMIC_SLEEP1/GPIO0_A2_d | W41 |
| TYPEC0_USB20_OTG_DP | AY11 | PMIC_INT_L/GPIO0_A7_u | W42 |
| AVSS_99 | AY12 | DDR_CH0_A4_A | Y1 |
| SARADC_IN1 | AY13 | DDR_CH0_LP4/4X_CS0_A | Y2 |
| AVSS_100 | AY14 | VSS_281 | Y3 |
| SARADC_IN4 | AY15 | VSS_282 | Y4 |
| AVSS_101 | AY16 | VSS_283 | Y5 |
| AVSS_102 | AY17 | VSS_284 | Y6 |
| AVSS_103 | AY18 | DDR_CH0_VDDQ_6 | Y10 |
| CIF_D3/BT1120_D3/I2S1_SCLK_RX_M0/UART0_TX_M2/GPIO4_A3_d | AY19 | VSS_285 | Y11 |
| AVSS_104 | AY21 | DDR_CH0_PLL_AVDD1V8 | Y14 |
| AVSS_105 | AY22 | VDD_VDENC_MEM_2 | Y17 |
| AVSS_106 | AY23 | VSS_286 | Y18 |
| AVSS_107 | AY25 | VSS_287 | Y19 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1_d | AY26 | VSS_288 | Y22 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1_d | AY27 | VSS_289 | Y23 |
| AVSS_108 | AY28 | VSS_290 | Y24 |
| AVSS_109 | AY29 | PLL_DVDD0V75 | Y26 |
| CIF_D14/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2_d | AY30 | VSS_291 | Y28 |
| CIF_D15/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3_d | AY31 | VSS_292 | Y29 |
| AVSS_110 | AY32 | VSS_293 | Y30 |
| AVSS_111 | AY33 | VSS_294 | Y31 |
| GMAC1_PTP_REF_CLK/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7_d | AY34 | VSS_295 | Y32 |
| GMAC1_TXEN/I2S2_SCLK_TX_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5_u | AY35 | VDD_LOGIC_4 | Y33 |
| AVSS_112 | AY36 | PMUIO2_1V8_2 | Y37 |
| AVSS_113 | AY37 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3_z | Y38 |
| AVSS_114 | AY39 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5_d | Y39 |
| MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C | AY40 | EMMC_D1/FSPI_D1_M0/GPIO2_D1_u | Y40 |
| AVSS_115 | AY41 | EMMC_D0/FSPI_D0_M0/GPIO2_D0_u | Y41 |
| MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B | AY42 |  |  |

## 3. Elektrische Daten

### 3.1 Absolute Grenzwerte

Überschreitung kann dauerhaft schädigen; längere Belastung an Maximalwerten mindert die Zuverlässigkeit.

| Parameter | Versorgungsgruppe | Minimum | Maximum | Einheit |
| --- | --- | --- | --- | --- |
| Versorgung CPU | VDD_CPU_BIG0 VDD_CPU_BIG1 VDD_CPU_LIT | -0.3 | 1.1 | V |
| Versorgung CPU-Speicher | VDD_CPU_BIG0_MEM VDD_CPU_BIG1_MEM VDD_CPU_LIT_MEM | -0.3 | 1.1 | V |
| Versorgung GPU | VDD_GPU | -0.3 | 1.1 | V |
| Versorgung GPU-Speicher | VDD_GPU_MEM | -0.3 | 1.1 | V |
| Versorgung NPU | VDD_NPU | -0.3 | 1.1 | V |
| Versorgung NPU-Speicher | VDD_NPU_MEM | -0.3 | 1.1 | V |
| Versorgung VCODEC | VDD_VDENC | -0.3 | 0.95 | V |
| Versorgung VCODEC-Speicher | VDD_VDENC_MEM | -0.3 | 0.95 | V |
| Versorgung Kernlogik | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V Versorgungsspannung | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI/eDP_TX0_VDD_0V75 HDMI/eDP_TX0_AVDD_0V75 MIPI_CSI0_AVCC0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V Versorgungsspannung | DDR_CH0_VDD DDR_CH0_VDD_MIF DDR_CH0_PLL_DVDD DDR_CH1_VDD DDR_CH1_VDD_MIF DDR_CH1_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 MIPI_D/C_PHY0_VDD MIPI_D/C_PHY1_VDD PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.2V Versorgungsspannung | MIPI_D/C_PHY_VDD_1V2 | -0.3 | 1.35 | V |
| 1.8V Versorgungsspannung | DDR_CH0_PLL_AVDD1V8 DDR_CH1_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 HDMI/eDP_TX0_VDD_CMN_1V8 HDMI/eDP_TX0_VDD_IO_1V8 MIPI_CSI0_AVCC1V8 MIPI_D/C_PHY_VDD_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V Versorgungsspannung | USB20_AVDD_3V3 | -0.5 | 3.63 | V |
| GPIO-Versorgung nur 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 | -0.5 | 1.98 | V |
| GPIO-Versorgung 1.8V/3.3V | PMUIO2_1V8 VCCIO2_1V8 VCCIO4_1V8 VCCIO5_1V8 VCCIO6_1V8 | -0.5 | 3.63 | V |
| Versorgung DDR IO (LPDDR4/4X 0.6V; LPDDR5 0.5V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Versorgung DDR IO (LPDDR4/4X 1.1V; LPDDR5 1.05V) | DDR_CH0_VDDQ_CKE DDR_CH1_VDDQ_CKE | -0.3 | 1.25 | V |
| Lagertemperatur | Tstg | -40 | 125 | ℃ |
| Maximale Sperrschichttemperatur (Quelle: Conjunction) | Tj | NA | 125 | ℃ |

### 3.2 Empfohlener Betrieb

| Parameter | Symbol | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- |
| Spannung CPU-BigCore 0 | VDD_CPU_BIG0 | 0.55 | 0.75 | 1.05 | V |
| Spannung CPU-BigCore-0-Speicher | VDD_CPU_BIG0_MEM | 0.675 | 0.75 | 1.05 | V |
| Spannung CPU-BigCore 1 | VDD_CPU_BIG1 | 0.55 | 0.75 | 1.05 | V |
| Spannung CPU-BigCore-1-Speicher | VDD_CPU_BIG1_MEM | 0.675 | 0.75 | 1.05 | V |
| Spannung CPU-LitCore/DSU | VDD_CPU_LIT | 0.55 | 0.75 | 0.95 | V |
| Spannung CPU-LitCore-/DSU-Speicher | VDD_CPU_LIT_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung GPU | VDD_GPU | 0.55 | 0.75 | 0.95 | V |
| Spannung GPU-Speicher | VDD_GPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung NPU | VDD_NPU | 0.55 | 0.75 | 0.95 | V |
| Spannung NPU-Speicher | VDD_NPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung VCODEC | VDD_VDENC | 0.675 | 0.75 | 0.825 | V |
| Spannung VCODEC-Speicher | VDD_VDENC_MEM | 0.675 | 0.75 | 0.825 | V |
| Logikspannung | VDD_LOGIC | 0.675 | 0.75 | 0.825 | V |
| PMU-Spannung | PMU_0V75 | 0.675 | 0.75 | 0.825 | V |
| Digitale GPIO-Versorgung (1.8V nur) | PMUIO1_1V8, VCCIO1_1V8 | 1.65 | 1.8 | 1.95 | V |
| Digitale GPIO-Versorgung (3.3V/1.8V) | PMUIO2_1V8, VCCIO2_1V8, VCCIO4_1V8, VCCIO5_1V8, VCCIO6_1V8 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Versorgung eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Logikversorgung(0.85V) | DDR_CH0_VDD, DDR_CH0_VDD_MIF, DDR_CH1_VDD, DDR_CH1_VDD_MIF | 0.675 | 0.85 | 0.935 | V |
| DDR CH0_PLL Versorgung(0.85V) | DDR_CH0_PLL_DVDD, DDR_CH1_PLL_DVDD | 0.675 | 0.75 | 0.8925 | V |
| DDR CH0_PLL Versorgung(1.8V) | DDR_CH0_PLL_AVDD1V8, DDR_CH1_PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| LPDDR4 IO-VDDQ-Versorgung | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 IO-VDDQ-Retention-Versorgung | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| LPDDR5 IO-VDDQ-Versorgung | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.475 | 0.5 | 0.525 | V |
| LPDDR5 IO-VDDQ-Retention-Versorgung | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.0 | 1.05 | 1.1 | V |
| PLL Analogversorgung(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Analogversorgung(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB 2.0 Analogversorgung (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Analogversorgung (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB 2.0 Analogversorgung (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Analogversorgung (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Analogversorgung (1.8V) | TYPEC0_DP0_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Analogversorgung(0.9V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Analogversorgung(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| MIPI CSI DPHY Analogversorgung(0.75V) | MIPI_CSI0_AVCC0V75 | 0.675 | 0.75 | 0.825 | V |
| MIPI CSI DPHY Analogversorgung(1.8V) | MIPI_CSI0_AVCC1V8 | 1.62 | 1.8 | 1.98 | V |
| MIPI DCPHY Analogversorgung (0.85V) | MIPI_D/C_PHY_VDD, MIPI_D/C_PHY1_VDD | 0.7125 | 0.85 | 0.8925 | V |
| MIPI DCPHY Analogversorgung (1.2V) | MIPI_D/C_PHY_VDD_1V2 | 1.14 | 1.2 | 1.26 | V |
| MIPI DCPHY Analogversorgung (1.8V) | MIPI_D/C_PHY_VDD_1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI/eDP TX Digitalversorgung (0.75V) | HDMI/eDP_TX0_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (0.75V) | HDMI/eDP_TX0_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI/eDP_TX0_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI/eDP_TX0_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Analogversorgung(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Analogversorgung(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Analogversorgung(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| OSC-Eingangstakt |  | NA | 24 | NA | MHz |
| Maximale CPU-Frequenz |  | NA | NA | 2.2-2.4 | GHz |
| Maximale GPU-Frequenz |  | NA | NA | 1000 | MHz |
| Maximale NPU-Frequenz |  | NA | NA | 1000 | MHz |
| Umgebungsbetriebstemperatur | TA | 0 | NA | 80 | ℃ |

### 3.3 Gleichstrom

|  | Parameter | Symbol | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Digital 3.3V/1.8V GPIO @3.3V | Low-Eingangsspannung | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 3.3V/1.8V GPIO @3.3V | High-Eingangsspannung | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 3.3V/1.8V GPIO @3.3V | Low-Ausgangsspannung | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 3.3V/1.8V GPIO @3.3V | High-Ausgangsspannung | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 3.3V/1.8V GPIO @3.3V | Pull-up-Widerstand | RRPU | 10 | NA | 100 | Kohm |
| Digital 3.3V/1.8V GPIO @3.3V | Pull-down-Widerstand | RRPD | 10 | NA | 100 | Kohm |
| Digital 3.3V/1.8V GPIO @1.8V | Low-Eingangsspannung | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 3.3V/1.8V GPIO @1.8V | High-Eingangsspannung | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 3.3V/1.8V GPIO @1.8V | Low-Ausgangsspannung | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 3.3V/1.8V GPIO @1.8V | High-Ausgangsspannung | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 3.3V/1.8V GPIO @1.8V | Pull-up-Widerstand | RRPU | 10 | NA | 50 | Kohm |
| Digital 3.3V/1.8V GPIO @1.8V | Pull-down-Widerstand | RRPD | 10 | NA | 50 | Kohm |
| Digital 1.8V nur GPIO @1.8V | Low-Eingangsspannung | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 1.8V nur GPIO @1.8V | High-Eingangsspannung | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 1.8V nur GPIO @1.8V | Low-Ausgangsspannung | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 1.8V nur GPIO @1.8V | High-Ausgangsspannung | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 1.8V nur GPIO @1.8V | Pull-up-Widerstand | RRPU | 10 | NA | 50 | Kohm |
| Digital 1.8V nur GPIO @1.8V | Pull-down-Widerstand | RRPD | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Low-Eingangsspannung | VIL | VSS | NA | 0.35*DVDD | V |
| eMMC IO @1.8V | High-Eingangsspannung | VIH | 0.65*DVDD | NA | DVDD | V |
| eMMC IO @1.8V | Low-Ausgangsspannung | VOL | VSS | NA | 0.45 | V |
| eMMC IO @1.8V | High-Ausgangsspannung | VOH | DVDD-0.45 | NA | DVDD | V |
| eMMC IO @1.8V | Pull-up-Widerstand | RRPU | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Pull-down-Widerstand | RRPD | 10 | NA | 50 | Kohm |
| DDR IO | Low-Eingangsspannung | VIL | NA | NA | Vref-0.14 | V |
| DDR IO | High-Eingangsspannung | VIH | Vref+0.14 | NA | NA | V |
| DDR IO | Low-Ausgangsspannung (Quelle: Log) | VOL | NA | NA | 0.2 | V |
| DDR IO | High-Ausgangsspannung | VOH | 0.25 | NA | NA | V |
| DDR IO | Low-Eingangsstrom | IIL | -100/-500 | NA | 100/500 | Raum-/Heißtemperatur uA |
| DDR IO | High-Eingangsstrom | IIH | -100/-500 | NA | 100/500 | Raum-/Heißtemperatur uA |

### 3.4 Allgemeine IO

|  | Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Digital 3.3V/1.8V GPIO @3.3V | Eingangsleckstrom | IPAD | DVDD=Max, VPAD=0V oder DVDD | -10 | NA | 10 | uA |
| Digital 3.3V/1.8V GPIO @3.3V | Eingangshysterese Schmitt-Trigger | VH |  | 0.08* VDDO | NA | NA | V |
| Digital 3.3V/1.8V GPIO @3.3V | Eingangs-Pull-up-Strom | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Digital 3.3V/1.8V GPIO @3.3V | Eingangs-Pull-down-Strom | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Eingangsleckstrom | IPAD | DVDD=Max, VPAD=0V oder DVDD | -10 | NA | 10 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Eingangshysterese Schmitt-Trigger | VH |  | 0.1* VDDO | NA | NA | V |
| Digital 3.3V/1.8V GPIO @1.8V | Eingangs-Pull-up-Strom | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Eingangs-Pull-down-Strom | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Digital 1.8V nur GPIO @1.8V | Eingangsleckstrom | IPAD | DVDD=Max, VPAD=0V oder DVDD | -10 | NA | 10 | uA |
| Digital 1.8V nur GPIO @1.8V | Eingangshysterese Schmitt-Trigger | VH |  | 0.1* VDDO | NA | NA | V |
| Digital 1.8V nur GPIO @1.8V | Eingangs-Pull-up-Strom | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| Digital 1.8V nur GPIO @1.8V | Eingangs-Pull-down-Strom | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |
| eMMC IO @1.8V | Eingangsleckstrom | IPAD | DVDD=Max, VPAD=0V oder DVDD | -10 | NA | 10 | uA |
| eMMC IO @1.8V | Eingangshysterese Schmitt-Trigger | VH |  | 0.1* DVDD | NA | NA | V |
| eMMC IO @1.8V | Eingangs-Pull-up-Strom | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| eMMC IO @1.8V | Eingangs-Pull-down-Strom | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |

VDDO und DVDD bezeichnen IO-Versorgung. MIN/MAX negativer Pull-up-Ströme bleiben wie in der Quelle.

### 3.5.1 INT PLL

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Eingangstaktfrequenz | FFIN |  | 4.5 | - | 300 | MHz |
| Referenzfrequenz (FFIN/p) | FFREE |  | 4.5 | 7 | 12 | MHz |
| PLL-Ausgangsfrequenz | FFOUT |  | 35.2 | - | 4500 | MHz |
| VCO-Ausgangsfrequenz | FFVCO |  | 2250 | - | 4500 | MHz |
| Einrastzeit | TLT | Über den gesamten FFIN-/FFOUT-Bereich gemessen; RESETB=High | - | - | 150 | Takte |

### 3.5.2 FRAC PLL

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Eingangstaktfrequenz | FFIN |  | 6 | - | 300 | MHz |
| Referenzfrequenz (FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| PLL-Ausgangsfrequenz | FFOUT |  | 35.2 | - | 4500 | MHz |
| VCO-Ausgangsfrequenz | FFVCO |  | 2250 | - | 4500 | MHz |
| Einrastzeit | TLT | Über den gesamten FFIN-/FFOUT-Bereich gemessen; RESETB=High | - | - | 500 | Takte |

### 3.5.3 DDR PLL

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Eingangstaktfrequenz | FFIN |  | 6 | - | 300 | MHz |
| Referenzfrequenz (FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| PLL-Ausgangsfrequenz | FFOUT |  | 51.6 | - | 6600 | MHz |
| VCO-Ausgangsfrequenz | FFVCO |  | 3300 | - | 6600 | MHz |
| Einrastzeit | TLT | Über den gesamten FFIN-/FFOUT-Bereich gemessen; RESETB=High | - | - | 500 | Takte |

Hinweis①: p ist der Eingangsteiler.

### 3.6 PCIe2/SATA

| Parameter | Symbol | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- |
| Sender |  |  |  |  |  |
| Differenzieller TX-Spannungshub | VTX_DIFF_PP | 800 | 1000 | 1200 | mV |
| Differenzieller TX-Spannungshub bei geringer Leistung | VTX_DIFF_PP_LOW | 400 | NA | 1200 | mV |
| Ausgangsimpedanz | RTX_DIFF_DC | 80 | 100 | 120 | ohm |
| Abgleich unsymmetrischer Ausgangswiderstände | RTX_DC_OFFSET | NA | NA | 5 | % |
| Sender-Gleichtaktausgangsspannung | VTX_DC_CM | 400 | NA | 800 | mV |
| Maximale TXP/TXM-Abweichung in Zeit und Amplitude | VTX_CM_AC_PP_ACTIVE | NA | NA | 50 | mV |
| Erlaubte Spannungsänderung bei Empfängererkennung | VTX_RCV_DETECT | NA | NA | 600 | mV |
| TX-Deemphasis | VTX_DE_RATIO | 3.0 | 3.5 | 4.0 | dB |
| AC-Koppelkondensator(USB3.1/PCIe) | CAC_COUPLING | 75 | NA | 200 | nF |
| AC-Koppelkondensator(SATA) | CAC_COUPLING | 6 | NA | 12 | nF |
| Ausgangsanstiegszeit 20–80% | Tr | 25 | NA | NA | ps |
| Ausgangsabfallzeit 20–80% | Tf | 25 | NA | NA | ps |
| Sender-Kurzschlussgrenze | ITX_SHORT | NA | NA | 20 | mA |
| Differenzieller Ausgangsversatz | TSKEW_DIFF | -15 | NA | 15 | ps |
| Empfänger |  |  |  |  |  |
| Eingangsspannungshub | VRXDPP_C | 250 | NA | 1200 | mVpp |
| Differenzielle Eingangsimpedanz | RRXD_C | 80 | 100 | 120 | Ohm |
| Abgleich unsymmetrischer Eingangswiderstände | RRXD_C_MS | NA | NA | 5 | % |

### 3.7 MIPI CDPHY

| Parameter | Symbol | Beschreibung | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LP-RX | VIH | Logik-1-Eingangsspannung | Alle Bedingungen | 880 | NA | NA | mV |
| LP-RX | VIL | Logik-0-Eingangsspannung außerhalb ULPS | Alle Bedingungen | NA | NA | 550 | mV |
| Versatzkalibrierung | Tskewcal (initial) | Dauer des Sender-Kalibriermusters bei anfänglicher Versatzkalibrierung | >1.5Gbps | NA | NA | 100 | us |
| Versatzkalibrierung | Tskewcal (initial) | Dauer des Sender-Kalibriermusters bei anfänglicher Versatzkalibrierung | >1.5Gbps | 2^15 | NA | NA | UI |
| Versatzkalibrierung | Tskewcal (periodic) | Dauer des Sender-Kalibriermusters bei periodischer Versatzkalibrierung | >1.5Gbps (optional) | NA | NA | 10 | us |
| Versatzkalibrierung | Tskewcal (periodic) | Dauer des Sender-Kalibriermusters bei periodischer Versatzkalibrierung | >1.5Gbps (optional) | 2^13 | NA | NA | UI |

### 3.8 MIPI CSI DPHY

| Parameter | Symbol | Minimum | Typisch | Maximum | Einheiten |
| --- | --- | --- | --- | --- | --- |
| Gleichtaktstörung oberhalb 450MHz | ΔVCMRX(HF) | NA | NA | 100 | mV |
| Gleichtaktstörung oberhalb 450MHz | ΔVCMRX(HF) | NA | NA | 50 | mV |
| Common-mode interference 50MHz- 450MHz | ΔVCMRX(LF) | -50 | NA | 50 | mV |
| Common-mode interference 50MHz- 450MHz | ΔVCMRX(LF) | -25 | NA | 25 | mV |
| Gleichtaktabschluss | CCM | NA | NA | 60 | pF |
| Eingangsimpulsunterdrückung | eSPIKE | NA | NA | 300 | V.ps |
| Minimale Impulsbreitenreaktion | TMIN-RX | 20 | NA | NA | ns |
| Spitzenstöramplitude | VINT | NA | NA | 200 | mV |
| Störfrequenz | fINT | 450 | NA | NA | MHz |

### 3.9 SARADC

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Auflösung |  |  | NA | 12 | NA | Bit |
| Analoger Eingangsbereich (Quelle: Anglog) | AIN |  | AVSS18 | NA | AVDD18 | V |
| Differenzielle Nichtlinearität | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±1.0 | ±3.0 | LSB |
| Integrale Nichtlinearität | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±2.0 | ±6.0 | LSB |
| Oberer Spannungsoffsetfehler | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±10 | ±20 | LSB |
| Unterer Spannungsoffsetfehler | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±10 | ±20 | LSB |

### 3.10 TSADC

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Genauigkeit von −40°C bis 125°C | TJACC | Temperatur: -40 ~ 125℃ Versorgung: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Temperaturmessbereich | TRANGE |  | -40 | 25 | 125 | ℃ |
| Auflösung | TLSB |  | NA | 1 | NA | ℃ |

## 4. Wärmemanagement

Für zuverlässigen Betrieb muss die absolute maximale Sperrschichttemperatur unter 125°C bleiben. Die thermischen Werte sind Simulationsergebnisse und müssen praktisch überprüft werden. Referenzplatine: 10 Lagen, 200mm x 130mm, 25°C Umgebung.

| Parameter | Symbol | Typisch | Einheit |
| --- | --- | --- | --- |
| Wärmewiderstand Sperrschicht–Umgebung | 𝜽 𝑱𝑨 | 8.2 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Platine | 𝜽 𝑱𝑩 | 3.7 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Gehäuse | 𝜽 𝑱𝑪 | 0.01 | (℃/𝑾) |

## Quellenhinweise

Funktionen hängen von der Produktkonfiguration ab; Lizenzen Dritter können erforderlich sein. LPDDR5X und spätere Display-/VOP-Timingregeln fehlen. Die Grafik nennt Mali-G610 MC4, der Text vier Shader-Kerne; die Beschriftung bleibt unverändert. Ein Abschnitt zu Feuchteklasse/Kugelmaterial fehlt in dieser Version.

## Quellenhinweise

Die Grafik nennt sechs SPI, §1.2.13 fünf SPI0–SPI4. Zwei HF-Maxima und zwei LF-Bereiche der Gleichtaktstörung bleiben ohne zusätzliche Bedingungen erhalten. Grenzwerttabelle: maximal125°C Sperrschicht; Wärmetext: unter125°C. Kein Registerkartenkapitel vorhanden.

## Offizielle Referenzen

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
