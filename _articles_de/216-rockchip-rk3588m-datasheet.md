---
title: "Rockchip RK3588M: Datenblatt, Pins und elektrische Grenzwerte"
description: "Rockchip RK3588M: Datenblatt, Pins und elektrische Grenzwerte — Rev1.3"
excerpt: "Rockchip RK3588M: Datenblatt, Pins und elektrische Grenzwerte"
translation_key: "216-rockchip-rk3588m-datasheet"
slug: "216-rockchip-rk3588m-datasheet"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588M","datasheet"]
---

{% raw %}

# Rockchip RK3588M: Datenblatt, Pins und elektrische Grenzwerte

Diese ArmSoM-Referenz beschreibt den Chip und garantiert keine Platinenkompatibilität. Baustein, Schaltplan, Versorgung und BSP prüfen. Abbildungen und Werte stammen von Rockchip; ArmSoM-Hardwaretests wurden nicht durchgeführt. SDK-/Kernel-Versionen sind nicht vorgegeben.

Quellen: englische RK3588M Rev1.3 vom2024-12-12, 35 Seiten in CN, und Rev1.1 vom2023-08-03, 34 Seiten in EN. Grundlage ist1.3; alle Bilder stammen aus dessen englischem Original.

## 1.1

RK3588M ist ein stromsparender Hochleistungsprozessor für Automotive-Anwendungen einschließlich Cockpits (Rev1.1 nannte zusätzlich Unterhaltung). Er integriert vier Cortex-A76- und vier Cortex-A55-Kerne mit NEON-Koprozessoren. Hardwareblöcke beschleunigen anspruchsvolle Anwendungen: H.265 und VP9 werden bis 8K@60fps, H.264 bis 8K@30fps und AV1 bis 4K@60fps dekodiert. Die H.264- und H.265-Kodierung erreicht 8K@30fps. Hinzu kommen hochwertige JPEG-Kodierung und -Dekodierung sowie spezielle Bildvor- und -nachverarbeitung. Die 3D-GPU unterstützt OpenGLES 1.1, 2.0 und 3.2, OpenCL bis 2.2 und Vulkan 1.2. Eine eigene 2D-Einheit mit MMU beschleunigt die Bildausgabe. Der vollständig in Hardware ausgeführte ISP verarbeitet bis zu 48 Megapixel und beschleunigt HDR, 3A, LSC, 3DNR, 2DNR, Schärfung, Dunstentfernung, Fischaugenkorrektur und Gammakorrektur. Die NPU unterstützt gemischte INT4/INT8/INT16/FP16-Operationen mit bis zu 6 TOPS; Modelle aus TensorFlow, MXNet, PyTorch und Caffe lassen sich konvertieren. Die vierkanalige externe Speicherschnittstelle unterstützt LPDDR4/LPDDR4X/LPDDR5/LPDDR5X und hohe Bandbreitenanforderungen. Umfangreiche Peripherieschnittstellen ermöglichen vielseitige Anwendungen.

## 1.2.1

Mikroprozessor. Vier ARM Cortex-A76 MPCore und vier ARM Cortex-A55 MPCore verbinden hohe Leistung, niedrigen Verbrauch und Caches. Die DSU (DynamIQ Shared Unit) umfasst das L3-Speichersystem, Steuerlogik und externe Schnittstellen des DynamIQ-Clusters. Der ARMv8-A-Befehlssatz ist vollständig implementiert, einschließlich ARM NEON Advanced SIMD für Medien- und Signalverarbeitung, ARMv8-Kryptografieerweiterungen und TrustZone. Jeder A76 besitzt 64KB L1-Befehls-, 64KB L1-Daten- und 512KB L2-Cache; jeder A55 besitzt 32KB L1-Befehls-, 32KB L1-Daten- und 128KB L2-Cache. Alle acht Kerne teilen 3MB L3. Acht unabhängige Leistungsdomänen unterstützen interne Leistungsschalter und extern gesteuertes Ein-/Ausschalten je nach Anwendung: PD_CPU_0/1/2/3 entsprechen den A55-Kernen 1/2/3/4 und PD_CPU_4/5/6/7 den A76-Kernen 1/2/3/4; jeweils einschließlich NEON, FPU und L1/L2-Befehls-/Datencaches. Drei getrennte Spannungsdomänen unterstützen DVFS: A76_0+A76_1, A76_2+A76_3 und DSU+Cortex-A55.

## 1.2.2

Speicherorganisation. Das interne BootROM startet über SPI, eMMC oder SD/MMC und lädt Systemcode über USB OTG. Gemeinsamer Speicher liegt in VD_LOGIC; PMU SRAM in VD_PMU dient stromsparenden Anwendungen. Externer dynamischer Speicher entspricht JEDEC LPDDR4/LPDDR4X/LPDDR5/LPDDR5X: vier 16-Bit-Kanäle, höchstens zwei Ranks/Chip-Selects pro Kanal und bis zu 32GB Adressraum insgesamt. SDRAM unterstützt Power-down und Selbstauffrischung. eMMC entspricht vollständig JEDEC eMMC 5.1/5.0 und ist zu 4.51 und früheren Versionen abwärtskompatibel; HS400, HS200, DDR50 und herkömmliche Modi verwenden 1/4/8-Bit-Busse. SD/MMC unterstützt SD3.0 und MMC 4.51 mit 4-Bit-Bus. FSPI überträgt Daten zur und von serieller Flash-Speicherung über 1/2/4-Bit-Busse mit zwei Chip-Selects. JEDEC-Geschwindigkeitsklassen: LPDDR4(4X)-4266/LPDDR5(5X)-4800.

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

Videoeingänge. Zwei kombinierte MIPI-PHYs arbeiten jeweils als DPHY 1.2 (4 Lanes, 2.5Gbps/Lane) oder CPHY 1.1 (3 Lanes, 2.5Gsps/Lane). Vier zusätzliche CSI-DPHY-1.2-Einheiten besitzen je 2 Lanes mit 2.5Gbps und lassen sich paarweise zu 4 Lanes kombinieren. Kamerakombinationen: 2 DCPHY+4 zweispurige CSI DPHY=6; 2 DCPHY+1 vierspurige+2 zweispurige=5; 2 DCPHY+2 vierspurige=4. Ein standardmäßiger 8/10/12/16-Bit-DVP unterstützt bis 150MHz, BT.601/BT.656/BT.1120 und konfigurierbare pixel_clk/hsync/vsync-Polarität. Der einportige HDMI-2.0-RX-PHY hat 4 Lanes ohne Seitenbandkanäle. HDMI 2.0: 3.4–6Gbps; HDMI 1.4: 250Mbps–3.4Gbps. TMDS-Scrambling ermöglicht 2160p@60Hz mit RGB/YCbCr4:4:4/YCbCr4:2:2; YCbCr4:2:0 ermöglicht dies bei niedrigerer Linkrate. HDMI 1.4b unterstützt alle CEA-861-E-Formate bis 1080p@120Hz, 3840x2160p@24/25/30Hz, 4096x2160p@24Hz und 3D bis 340MHz TMDS-Takt. HDCP2.3/1.4 wird unterstützt.

## 1.2.9

Bildsignalprozessor. VICAP unterstützt BT601/BT656/BT1120, sechs MIPI-CSI/DSI-Schnittstellen mit je vier IDs, RAW8/10/12/14 und YUV422, HDR über virtuelle Kanäle/Identifikationscodes/Zeilenzähler sowie RAW-Durchleitung zu ISP0/1. Maximal: zwei ISP mit 48M 8064x6048@15 oder 32M 6528x4898@30; ein ISP mit 16M 4672x3504@30. Funktionen: 3A-Statistik (AE/Histogramm, AF, AWB), FPN-Musterrauschentfernung, BLC-Schwarzpegelkorrektur, DPCC für statische/dynamische Defektpixelgruppen, PDAF-Phasenautofokus, LSC-Objektivabschattung, räumliches Bayer-2DNR/zeitliches Bayer-3DNR, CAC-Farbfehlerkorrektur, HDR aus drei Bildern, DRC-Dynamikkompression/Tonemapping, GIC-Grünabgleich, adaptive Debayer-Verarbeitung mit Farbfehlerkorrektur, CCM/CSM-Farbmatrizen und RGB2YUV, Ausgangsgamma, automatische Dunstentfernung/Effektverstärkung, kundenspezifische 3DLUT-Palette, ausschließlich horizontale LDCH-Verzeichnungskorrektur, räumliches YUV-2DNR, Schärfung/Grenzfilterung, CMSK-Privatsphärenmaske, lokales GAIN und gemeinsame ISP-Nutzung mehrerer Sensoren. FEC akzeptiert RASTER YUV422SP/YUV422I/YUV420SP und liefert dieselben RASTER-Formate oder FBCE YUV422SP/YUV420SP. Rasterdichten: 16x8/32x16; Verkleinerung bis Faktor 4; Auflösung 128x128–4095x4095; bikubische Y- und bilineare C-Interpolation.

## 1.2.10

Displays. Zwei kombinierte HDMI/eDP-TX-Schnittstellen unterstützen x1/x2/x4; HDMI und eDP schließen sich je Schnittstelle aus. HDMI FRL: 3/6/8/10/12Gbps, bis 7680x4320@60Hz, RGB/YUV bis 10bit, DSC1.2a und HDCP2.3. eDP: 1.62/2.7/5.4Gbps, bis 4K@60Hz, RGB/YCbCr4:4:4/YCbCr4:2:2 mit 8/10 Bit je Komponente und HDCP1.3. Zwei DP TX1.4a sind mit USB3.1 Gen1 kombiniert: 1/2/4 Lanes, 1.62/2.7/5.4/8.1Gbps, bis 8192x4320@30Hz, RGB/YUV bis 10bit, SST, Type-C DP Alt Mode und HDCP2.3/1.3. Zwei MIPI DPHY2.0 bieten je vier Daten-Lanes bis 4.5Gbps/Lane, 4K@60Hz, linken/rechten Doppel-MIPI-Betrieb, RGB bis 10bit und DSC1.1/1.2a. BT.1120 bietet 1920x1080@60Hz, RGB bis 8bit und bis 150MHz. HDMI-Timing sollte CTA-861 folgen; nicht standardmäßige HSYNC/HBP/HFP sollten an4 Pixeln ausgerichtet sein. Für DP wird CTA-861 empfohlen; nicht standardmäßige HSYNC/HBP/HFP benötigen mindestens16 Pixel. MIPI DSI verlangt mindestens4 Pixel für HSYNC/HBP/HFP; HTOTAL/HACTIVE müssen durch4 teilbar sein; für HSYNC/HBP/HFP wird dies empfohlen (letzte Quellenschreibweise HYSNC).

## 1.2.11

Videoausgabeprozessor. Maximalwerte: Video Port0 7680x4320@60Hz; Port1 und Port2 je 4096x2304@60Hz; Port3 1920x1080@60Hz. Cluster0/1/2/3 unterstützen je 4096x2304 Ein-/Ausgang, AFBCD, RGB/YUV/YUYV, Skalierung 4–1/4 und Drehung. ESMART0/1/2/3 unterstützen je 4096x2304 Ein-/Ausgang, RGB/YUV/YUYV, Skalierung 8–1/8 und vier Bereiche. RGB-/YUV-Überlagerung kombiniert bis zu acht Ebenen (vier Cluster+vier ESMART). Nachverarbeitung: HDR10/HLG, HDR2SDR/SDR2HDR und 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Rückschreiben: ARGB8888/RGB888/RGB565/YUV420 bis 1920x1080. HACTIVE muss an 4 Pixeln ausgerichtet sein. Im Split-, MIPI-Doppelkanal- oder YUV420-Modus müssen POST HSYNC/HBP/HFP durch 2 teilbar sein. MIPI-DSC-Videomodus verlangt mindestens 16 Pixel für POST HSYNC/HBP/HFP und 8 Pixel für DSC_SYS_CTRL HSYNC/HBP/HFP.

## 1.2.12

Audioschnittstellen. I2S0/I2S1 bieten bis zu 8 TX- und 8 RX-Kanäle. Beide: 16–32 Bit, bis 192kHz, programmierbarer Master/Slave, I2S normal/links-/rechtsbündig, PCM early/late1/late2/late3 sowie TDM normal, Linksverschiebung um einen halben/einen/zwei Takte oder Rechtsverschiebung. I2S/PCM/TDM sind nicht gleichzeitig nutzbar. I2S2/I2S3 bieten je 2 TX und 2 RX, 16–32 Bit, bis 192kHz, Master/Slave und dieselben drei I2S-/vier PCM-Formate; I2S/PCM sind nicht gleichzeitig nutzbar. SPDIF0/1 speichern zwei 16-Bit-Werte in einem 32-Bit-Wort, geben Biphase-Stereo aus, richten 16–31-Bit-Daten links/rechts im 32-Bit-Puffer aus und unterstützen lineares PCM mit 16/20/24 Bit sowie nichtlineares PCM. PDM0/1: bis 8 Kanäle, 16–24 Bit, bis 192kHz, Master-Empfang. Der digitale Audiocodec besitzt zwei digitale DAC-Kanäle, I2S/PCM-Master/Slave, 16-Bit-Abtastung, drei Mischmodi je DAC und Lautstärkeregelung. VAD liest Sprache aus I2S/PDM, erkennt deren Amplitude, speichert Mikrofonarraydaten und unterstützt einen kombinierten Pegelinterrupt.

## 1.2.13

Verbindungen. SDIO unterstützt SDIO3.0 mit 4-Bit-Bus. Zwei GMACs unterstützen RGMII mit 10/100/1000Mbps und RMII mit 10/100Mbps, Voll-/Halbduplex. USB3.1 Gen1 entspricht USB3.2 Gen1 und USB3.0 und erreicht 5Gbps. Zwei OTG-Schnittstellen USB3OTG_0/1 sind mit DP TX kombiniert; ein Host USB3OTG_2 mit PIPE PHY2. Kompatibilität: USB3.0 Revision1.0, USB2.0 außer USB3OTG_2 sowie xHCI1.1. Unterstützt werden Control-, Bulk- einschließlich Stream-, Interrupt- und isochrone Transfers sowie gleichzeitige IN/OUT-Übertragung. Deskriptorcache und Datenvorabruf verbessern Systeme mit hoher Latenz. Energiemanagement: USB2.0 LPM außer USB3OTG_2 und USB3.1 U0/U1/U2/U3. Gerätefunktionen: bis 10 IN- und 6 OUT-Endpunkte, jeweils einschließlich Control-Endpunkt0; bis 16 Transferressourcen, eine je Endpunkt; flexible Endpunktkonfiguration für Anwendungen/USB-set-configuration-Modi; ERDY/Burst in Hardware; Stream-Bulk-Endpunkte mit automatisch angestoßener Datenbewegung; isochrone Endpunkte mit Datenpuffern; flexible Deskriptoren für Pufferinterruptmoderation, Mehrfachtransfers, isochrone/Control-Transfers und verteilte Puffer. xHCI-Host: bis 64 Geräte, ein Interrupter, ein USB2.0-Port außer USB3OTG_2, ein SuperSpeed-Port, Standard-/Open-Source-xHCI- und Klassentreiber. DRD unterstützt feste Geräte-/Hostrollen und ID-basierte USB3.1/USB2.0-OTG-A/B-Rollen; USB3OTG_2 bietet nur USB3.1 Gen1. SRP/HNP/RSP werden nicht unterstützt. USB2.0-PHY bietet Batterieladeerkennung; USB3OTG_0/1 unterstützen Type-C/DP Alt Mode; USB3OTG_2 teilt seinen PHY mit PCIe/SATA. Zwei USB2.0-Hosts unterstützen USB2.0, High-/Full-/Low-Speed mit 480/12/1.5Mbps und EHCI1.0/OHCI1.0a. Drei Combo-PIPE-PHYs unterstützen PCIe2.1/SATA3.0/USB3.1: PHY0/1 wählen jeweils SATA oder PCIe2.1; PHY2 SATA, PCIe2.1 oder USB3.1 Gen1. Jede PCIe2.1-Schnittstelle besitzt eine Lane mit 5Gbps, entspricht PCI Express Base2.1 und unterstützt nur RC. SATA: je ein Port mit 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. PCIe3.0 entspricht Base3.0, unterstützt RC/EP, 2.5Gbps (1.1), 5Gbps (2.1), 8Gbps (3.0; Quelle schreibt 8Gps) und Bündelung/Aufteilung in 1x4, 2x2, 4x1 oder 1x2+2x1 Lanes. Es gibt fünf SPI-Controller (SPI0–SPI4). Zwei Chip-Select-Ausgänge und programmierbarer serieller Master/Slave werden unterstützt. Neun I2C-Master I2C0–I2C8 bieten 7/10-Bit-Adressen und programmierbaren Takt bis 100kbit/s im Standard- oder 400kbit/s im Fast-Modus. Zehn UARTs UART0–UART9 besitzen getrennte 64-Byte-TX/RX-FIFOs, 5/6/7/8-Bit-Senden/Empfangen, Start-/Stopp-/Paritätsbits, verschiedene Eingangstakte für bis 4Mbps und automatische Flusssteuerung für alle UARTs.

## 1.2.14

Weitere Funktionen. Mehrere GPIO-Gruppen bieten Interrupts an jedem GPIO, Pegel-/Flankenauslösung, konfigurierbare Pegelpolarität, steigende/fallende/beide Flanken, schwache Pull-up-/Pull-down-Wahl und Treiberstärke. TS-ADC unterstützt benutzerdefinierte und automatische Modi. Im benutzerdefinierten Modus wird start_of_conversion vollständig durch Software gesteuert oder durch Hardware erzeugt. Automatisch lassen sich Hoch-/Tieftemperatur-Interruptschwellen und die Systemresettemperatur konfigurieren. Sieben Kanäle besitzen eigene Temperaturkriterien; Bereich −40–125°C, Auflösung 1°C. SARADC: 12 Bit, bis 1MS/s, acht unsymmetrische Eingänge. OTP bietet 32Kbit; der obere 4k-Adressbereich ist nicht sicher (Quellenbezeichnung beibehalten). Der sichere Modus unterstützt Wortmasken für Lesen/Programmieren; maximal 32 Bit programmieren und 16 Wörter lesen; Lese-/Programmierstatus sind abfragbar, fehlgeschlagene Programmieradressen werden gespeichert. Gehäuse FCBGA1088L: Körper 23mm x 23mm, Kugeldurchmesser 0.36mm, Raster 0.65mm. Genannte Automotive-Qualifikation: AEC-Q100 Grade3.

## 1.3 Blockdiagramm

![1-1. Blockdiagramm (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-1-1.png)

1-1. Blockdiagramm (englisches Original).

Zusätzliche Beschriftungen: 1MB gemeinsamer Speicher, sechs PVTM, zwei SPDIF mit „8ch“, Systemregister und SRAM/ROM/OTP. Die Grafik nennt SD3.0/MMC4.5, Abschnitt 1.2.2 MMC4.51; beide Angaben bleiben erhalten.

## 2. Gehäuse

### 2.1 Bestellung

RK3588M: RoHS, FCBGA1088L, 600PCS je Tray, Anwendungsprozessor.

### 2.2 Oberseitenmarkierung

Rockchip = Marke; RKXXXX = Chipname; ABC = Auftragnehmercode; XXXXXX = Die-Charge; DEFG = Datumscode; NXXXXXX FXX = OSAT-Untercharge. Die Eckmarkierung kennzeichnet den ersten Pin.

![2-1. Gehäusemarkierung (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-1.png)

2-1. Gehäusemarkierung (englisches Original).

![2-2. Gehäuseoberansicht (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-2.png)

2-2. Gehäuseoberansicht (englisches Original).

### 2.3 Abmessungen

![2-3. Gehäuseunteransicht (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-3.png)

2-3. Gehäuseunteransicht (englisches Original).

![2-4. Gehäuseseitenansicht (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-4.png)

2-4. Gehäuseseitenansicht (englisches Original).

![2-5. Gehäuseabmessungen (englisches Original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-5.png)

2-5. Gehäuseabmessungen (englisches Original).

| Symbol | Minimum mm | Typisch mm | Maximum mm | Minimum Zoll | Typisch Zoll | Maximum Zoll |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.727 | 1.885 | 2.043 | 0.068 | 0.074 | 0.080 |
| A1 | 0.20 | 0.25 | 0.30 | 0.008 | 0.010 | 0.012 |
| A2 | 1.485 | 1.635 | 1.785 | 0.058 | 0.064 | 0.070 |
| c | 0.56 | 0.66 | 0.76 | 0.022 | 0.026 | 0.030 |
| D | 22.80 | 23.00 | 23.20 | 0.898 | 0.906 | 0.913 |
| E | 22.80 | 23.00 | 23.20 | 0.898 | 0.906 | 0.913 |
| D1 | — | 21.45 | — | — | 0.844 | — |
| E1 | — | 21.45 | — | — | 0.844 | — |
| e | — | 0.65 | — | — | 0.026 | — |
| b | 0.31 | 0.36 | 0.41 | 0.012 | 0.014 | 0.016 |

Ungeteilte Toleranzangaben (mm/inch): aaa 0.20/0.008; ccc 0.35/0.014; ddd 0.15/0.006; eee 0.20/0.008; fff 0.08/0.003; MD/ME=34/34. Die typische Maßspalte entspricht NOM im Original.

### 2.4–2.5 Feuchtigkeit und Kugelmaterial

MSL3; Anschluss-/Kugelmaterial SnAgCu.

### 2.6 Vollständige Pinliste

Tabelle 2-1, Quellseiten 21–28. Signalnamen und Multiplexalternativen bleiben unveränderte Kennungen.

| Pinname | Pin | Pinname | Pin |
| --- | --- | --- | --- |
| VSS_1 | A1 | VSS_12 | C5 |
| DDR_CH1_DQ10_C | A2 | VSS_13 | C6 |
| DDR_CH1_DQ8_C | A3 | VSS_14 | C7 |
| DDR_CH1_DQ14_C | A4 | VSS_15 | C8 |
| DDR_CH1_DQ12_C | A5 | VSS_16 | C9 |
| DDR_CH1_DQ4_C | A6 | DDR_CH0_DQ15_B | D1 |
| DDR_CH1_DQ6_C | A7 | DDR_CH0_DQ8_B | D2 |
| DDR_CH1_DQ0_C | A8 | VSS_34 | D3 |
| DDR_CH1_DQ2_C | A9 | DDR_CH1_DM1_C | D4 |
| DDR_CH1_A4_C | A10 | DDR_CH1_DQS1N_C | D5 |
| VSS_2 | A11 | DDR_CH1_WCK1P_C | D7 |
| DDR_CH1_CKB_C | A12 | DDR_CH1_DQS0N_C | D9 |
| DDR_CH1_CKB_D | A13 | DDR_CH1_A6_C | D10 |
| VSS_3 | A14 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_C | D11 |
| DDR_CH1_A4_D | A15 | DDR_CH1_A3_C | D13 |
| DDR_CH1_DQ2_D | A16 | DDR_CH1_A6_D | D14 |
| DDR_CH1_DQ0_D | A17 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_D | D16 |
| DDR_CH1_DQ6_D | A18 | DDR_CH1_WCK0N_D | D17 |
| DDR_CH1_DQ4_D | A19 | DDR_CH1_LP4/4X_CS1_D | D19 |
| DDR_CH1_DQ12_D | A20 | DDR_CH1_DM0_D | D20 |
| DDR_CH1_DQ14_D | A21 | DDR_CH1_DQS1P_D | D21 |
| DDR_CH1_DQ8_D | A22 | DDR_CH1_DM1_D | D22 |
| DDR_CH1_DQ10_D | A23 | VSS_35 | D23 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0_d | A24 | VSS_36 | D24 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1_d | A25 | PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1_d | D25 |
| VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2_d | A26 | PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2_d | D26 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3_d | A27 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3_d | D27 |
| PCIE30_PORT1_REF_CLKP | A28 | I2S0_SDI0/GPIO1_D4_d | D28 |
| PCIE30_PORT1_TX0N | A30 | PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6_d | D29 |
| PCIE30_PORT1_RX0N | A32 | I2S0_LRCK/I2C2_SCL_M3/UART4_RTSN/GPIO1_C5_d | D30 |
| PCIE30_PORT1_RESREF | A33 | VSS_37 | D31 |
| VSS_4 | A34 | PCIE30_PORT0_TX0P | D32 |
| DDR_CH0_DQ14_A | AA1 | PCIE30_PORT0_TX0N | D33 |
| DDR_CH0_DQ15_A | AA2 | DDR_CH0_DQ13_B | E1 |
| VSS_248 | AA3 | DDR_CH0_DQ14_B | E2 |
| DDR_CH0_DQS1N_A | AA4 | VSS_38 | E3 |
| DDR_CH0_DQS1P_A | AA5 | DDR_CH0_DM1_B | E4 |
| VSS_249 | AA6 | DDR_CH1_DQS1P_C | E5 |
| VCCIO2_1V8 | AA7 | VSS_39 | E6 |
| AVSS_15 | AA8 | DDR_CH1_WCK1N_C | E7 |
| HDMI/eDP_TX0_VDD_0V75 | AA9 | VSS_40 | E8 |
| AVSS_16 | AA10 | DDR_CH1_DQS0P_C | E9 |
| VSS_250 | AA11 | DDR_CH1_RESET_C | E10 |
| VDD_GPU_MEM_0 | AA12 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_C | E11 |
| VDD_GPU_0 | AA13 | VSS_41 | E12 |
| VDD_GPU_7 | AA14 | DDR_CH1_A2_C | E13 |
| VDD_GPU_11 | AA15 | DDR_CH1_A3_D | E14 |
| VSS_251 | AA16 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_D | E16 |
| VSS_252 | AA17 | DDR_CH1_WCK0P_D | E17 |
| VSS_253 | AA18 | VSS_42 | E18 |
| VSS_254 | AA19 | DDR_CH1_LP4/4X_CS0_D | E19 |
| VSS_255 | AA20 | VSS_43 | E20 |
| VSS_256 | AA21 | DDR_CH1_DQS1N_D | E21 |
| VSS_257 | AA22 | VSS_44 | E22 |
| VSS_258 | AA23 | VSS_45 | E23 |
| VSS_259 | AA24 | PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4_u | E24 |
| MIPI_CSI1_AVCC0V75 | AA25 | PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5_u | E25 |
| MIPI_CSI1_AVCC1V8 | AA26 | MIPI_CAMERA1_CLK_M0/SPDIF0_TX_M0/PCIE30X2_WAKEN_M3/HDMI_RX_HPDIN_M2/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6_d | E26 |
| HDMI_TX0_HPD_M1/PCIE30X2_PERSTN_M2/HDMI_RX_HPDIN_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4_d | AA27 | MIPI_CAMERA2_CLK_M0/SPDIF1_TX_M0/PCIE30X2_PERSTN_M3/HDMI_RX_CEC_M2/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7_u | E27 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7_d | AA28 | I2S0_SDI1/PDM0_SDI3_M0/I2C1_SDA_M4/UART4_RX_M0/PWM1_M1/SPI1_CS0_M2/GPIO1_D3_d | E28 |
| GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0_u | AA29 | I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7_d | E29 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1_u | AA30 | PDM0_CLK1_M0/I2C2_SDA_M3/PWM11_IR_M2/SPI4_CS1_M0/GPIO1_C4_d | E30 |
| VSS_260 | AA31 | I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3_d | E31 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5_u | AA32 | VSS_46 | E32 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3_u | AA33 | PCIE30_PORT0_REF_CLKP | E33 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3_d | AA34 | PCIE30_PORT0_REF_CLKN | E34 |
| DDR_CH0_DQ9_A | AB1 | DDR_CH0_DQ4_B | F1 |
| DDR_CH0_DQ8_A | AB2 | DDR_CH0_DQ12_B | F2 |
| VSS_261 | AB3 | VSS_47 | F3 |
| DDR_CH0_DM1_A | AB4 | DDR_CH0_DQS1N_B | F4 |
| VSS_262 | AB5 | DDR_CH0_DQS1P_B | F5 |
| AVSS_17 | AB6 | VSS_48 | F7 |
| AVSS_18 | AB7 | DDR_CH1_DM0_C | F8 |
| AVSS_19 | AB8 | VSS_49 | F9 |
| HDMI/eDP_TX0_AVDD_0V75 | AB9 | VSS_50 | F10 |
| AVSS_20 | AB10 | VSS_51 | F11 |
| VSS_263 | AB11 | DDR_CH1_A1_C | F12 |
| VDD_GPU_MEM_1 | AB12 | VSS_52 | F13 |
| VDD_GPU_1 | AB13 | VSS_53 | F14 |
| VDD_GPU_6 | AB14 | VSS_54 | F15 |
| VDD_GPU_10 | AB15 | VSS_55 | F16 |
| VSS_264 | AB16 | DDR_CH1_ZQ_D | F18 |
| VSS_265 | AB17 | VSS_56 | F19 |
| VSS_266 | AB18 | VSS_57 | F20 |
| VSS_267 | AB19 | VSS_58 | F21 |
| VSS_268 | AB20 | VSS_59 | F22 |
| VDD_NPU_6 | AB21 | VSS_60 | F23 |
| VDD_NPU_5 | AB22 | MIPI_CAMERA3_CLK_M0/HDMI_RX_SCL_M2/I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6_u | F24 |
| VDD_NPU_2 | AB23 | MIPI_CAMERA4_CLK_M0/PCIE30X2_CLKREQN_M3/HDMI_RX_SDA_M2/I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7_u | F25 |
| VSS_269 | AB24 | I2S0_SDO1/I2C7_SCL_M0/UART6_TX_M2/SPI1_MISO_M2/GPIO1_D0_d | F26 |
| MIPI_CSI0_AVCC0V75 | AB25 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/I2C7_SDA_M0/UART6_RX_M2/SPI1_MOSI_M2/GPIO1_D1_d | F27 |
| MIPI_CSI0_AVCC1V8 | AB26 | I2S0_SDO3/I2S0_SDI2/PDM0_SDI2_M0/I2C1_SCL_M4/UART4_TX_M0/PWM0_M1/SPI1_CLK_M2/GPIO1_D2_d | F28 |
| VSS_270 | AB27 | I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2__d | F30 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5_d | AB28 | VSS_61 | F31 |
| VSS_271 | AB29 | PCIE30_PORT0_RX1P | F32 |
| GMAC0_PPSTRING/FSPI_CS1N_M1/HDMI_TX1_SCL_M0/I2C4_SCL_M1/UART7_TX_M0/GPIO2_B5_u | AB30 | PCIE30_PORT0_RX1N | F33 |
| GMAC0_PTP_REFCLK/FSPI_CS0N_M1/HDMI_TX1_SDA_M0/I2C4_SDA_M1/UART7_RX_M0/GPIO2_B4_u | AB31 | DDR_CH0_DQ6_B | G1 |
| VSS_272 | AB32 | DDR_CH0_DQ5_B | G2 |
| GMAC0_MDIO/I2C0_SCL_M1/UART9_CTSN_M0/PWM6_M2/SPI3_MOSI_M0/GPIO4_C5_d | AB33 | VSS_62 | G3 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/SPI3_MISO_M0/GPIO4_C4_d | AB34 | DDR_CH0_DM0_B | G4 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | G6 |
| DDR_CH0_DQ11_A | AC2 | DDR_CH1_ZQ_C | G8 |
| VSS_273 | AC3 | DDR_CH1_WCK0P_C | G9 |
| VSS_274 | AC4 | VSS_64 | G10 |
| AVSS_21 | AC5 | DDR_CH1_LP4/4X_CS0_C | G11 |
| HDMI/eDP_TX0_VDD_CMN_1V8 | AC6 | DDR_CH1_A0_C | G12 |
| HDMI/eDP_TX0_VDD_IO_1V8 | AC7 | DDR_CH1_A2_D | G13 |
| AVSS_22 | AC8 | DDR_CH1_A1_D | G14 |
| HDMI/eDP_TX1_AVDD_0V75 | AC9 | VSS_65 | G15 |
| AVSS_23 | AC10 | DDR_CH1_DQS0N_D | G16 |
| VSS_275 | AC11 | DDR_CH1_WCK1N_D | G18 |
| VSS_276 | AC12 | VSS_66 | G19 |
| VDD_GPU_2 | AC13 | VCCIO1_1V8 | G20 |
| VDD_GPU_5 | AC14 | VSS_67 | G21 |
| VDD_GPU_9 | AC15 | VSS_68 | G22 |
| VSS_277 | AC16 | PCIE30_PORT0_AVDD1V8 | G23 |
| VDD_LOGIC_5 | AC17 | PCIE30_PORT0_AVDD0V75 | G24 |
| VDD_LOGIC_4 | AC18 | VSS_69 | G25 |
| VDD_LOGIC_3 | AC19 | PDM0_SDI0_M0/SPI1_CS1_M2/GPIO1_D5_d | G26 |
| VSS_278 | AC20 | I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1_z | G27 |
| VSS_279 | AC21 | I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0_z | G29 |
| VDD_NPU_4 | AC22 | PCIE20_2_REFCLKN | G30 |
| VDD_NPU_1 | AC23 | PCIE20_2_REFCLKP | G31 |
| VSS_280 | AC24 | VSS_70 | G32 |
| VCCIO6_1V8 | AC25 | PCIE30_PORT0_RX0P | G33 |
| VCCIO6 | AC26 | PCIE30_PORT0_RX0N | G34 |
| VSS_281 | AC27 | DDR_CH0_DQ0_B | H1 |
| GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3_u | AC28 | DDR_CH0_DQ7_B | H2 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4_u | AC29 | VSS_71 | H3 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4_d | AC30 | DDR_CH0_WCK1P_B | H4 |
| GMAC0_RXD3/SDIO_D1_M0/FSPI_D1_M1/UART6_TX_M0/GPIO2_A7_u | AC31 | DDR_CH0_WCK1N_B | H5 |
| GMAC0_RXD2/SDIO_D0_M0/FSPI_D0_M1/UART6_RX_M0/GPIO2_A6_u | AC32 | VSS_72 | H6 |
| GMAC0_TXD2/SDIO_D3_M0/FSPI_D3_M1/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1_u | AC33 | DDR_CH0_ZQ_B | H7 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2_u | AC34 | DDR_CH1_WCK0N_C | H9 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1_u | AD1 | VSS_73 | H10 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0_u | AD2 | DDR_CH1_LP4/4X_CS1_C | H11 |
| OTP_VDDOTP_0V75 | AD3 | VSS_74 | H12 |
| NC | AD4 | DDR_CH1_VDDQ_CKE | H13 |
| AVSS_24 | AD5 | VSS_75 | H14 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AD6 | DDR_CH1_A0_D | H15 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AD7 | DDR_CH1_DQS0P_D | H16 |
| AVSS_25 | AD8 | DDR_CH1_WCK1P_D | H18 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | H19 |
| AVSS_26 | AD10 | VCCIO4_1V8 | H20 |
| VSS_282 | AD11 | VCCIO4 | H21 |
| VSS_283 | AD12 | VSS_77 | H22 |
| VDD_GPU_3 | AD13 | PCIE30_PORT1_AVDD1V8 | H23 |
| VDD_GPU_4 | AD14 | PCIE30_PORT1_AVDD0V75 | H24 |
| VDD_GPU_8 | AD15 | VSS_78 | H25 |
| VSS_284 | AD16 | VSS_79 | H26 |
| VDD_LOGIC_0 | AD17 | AVSS_1 | H28 |
| VDD_LOGIC_1 | AD18 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | H29 |
| VDD_LOGIC_2 | AD19 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | H30 |
| VSS_285 | AD20 | AVSS_2 | H31 |
| VSS_286 | AD21 | PCIE20_1_REFCLKP | H32 |
| VDD_NPU_3 | AD22 | PCIE20_1_REFCLKN | H33 |
| VDD_NPU_0 | AD23 | DDR_CH0_DQ2_B | J1 |
| VSS_287 | AD24 | DDR_CH0_DQ1_B | J2 |
| VSS_288 | AD25 | VSS_80 | J3 |
| VSS_289 | AD26 | VSS_81 | J4 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2_u | AD27 | VSS_82 | J5 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4_d | AD28 | VSS_83 | J6 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5_u | AD29 | DDR_CH0_DQS0N_B | J7 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3_d | AD30 | DDR_CH0_DQS0P_B | J8 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2_d | AD31 | VSS_84 | J10 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1_d | AD32 | VSS_85 | J11 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6_d | AD33 | VSS_86 | J12 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7_d | AD34 | VSS_87 | J13 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5_d | AE1 | VSS_88 | J14 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4_u | AE2 | VSS_89 | J15 |
| VSS_290 | AE3 | VSS_90 | J16 |
| HDMI_RX_VPH3V3 | AE4 | VSS_91 | J18 |
| HDMI_RX_DVDD3V3 | AE5 | VSS_92 | J19 |
| AVSS_27 | AE6 | VSS_93 | J20 |
| AVSS_28 | AE7 | VSS_94 | J21 |
| HDMI_RX_AVDD0V75 | AE8 | VSS_95 | J22 |
| AVSS_29 | AE9 | VSS_96 | J23 |
| VSS_291 | AE11 | VSS_97 | J24 |
| VSS_292 | AE12 | VSS_98 | J25 |
| VSS_293 | AE13 | AVSS_3 | J27 |
| VSS_294 | AE14 | AVSS_4 | J28 |
| VSS_295 | AE15 | AVSS_5 | J29 |
| VSS_296 | AE16 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | J30 |
| VSS_297 | AE18 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | J31 |
| VSS_298 | AE19 | AVSS_6 | J32 |
| VSS_299 | AE20 | PCIE20_1_RXP/SATA30_1_RXP | J33 |
| VSS_300 | AE21 | PCIE20_1_RXN/SATA30_1_RXN | J34 |
| VDD_NPU_MEM_0 | AE22 | DDR_CH0_A4_B | K1 |
| VDD_NPU_MEM_1 | AE23 | DDR_CH0_DQ3_B | K2 |
| VSS_301 | AE24 | VSS_99 | K3 |
| VSS_302 | AE26 | DDR_CH0_WCK0N_B | K4 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3_u | AE27 | DDR_CH0_WCK0P_B | K5 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2_d | AE28 | VSS_100 | K6 |
| GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6_d | AE29 | DDR_CH0_RESET_B | K7 |
| CLK32K_OUT1/GPIO2_C5_d | AE30 | VSS_101 | K8 |
| GMAC0_RXDV_CRS/UART7_RTSN_M0/PWM2_M2/SPI3_CS0_M0/GPIO4_C2_d | AE31 | VSS_102 | K9 |
| GMAC0_RXCLK/SDIO_D2_M0/FSPI_D2_M1/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0_u | AE32 | DDR_CH1_VDDQ_0 | K11 |
| GMAC0_TXCLK/SDIO_CLK_M0/FSPI_CLK_M1/I2C3_SDA_M3/GPIO2_B3_d | AE33 | DDR_CH1_VDDQ_1 | K12 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0_d | AE34 | DDR_CH1_VDDQ_2 | K13 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3_u | AF1 | DDR_CH1_VDDQ_3 | K14 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2_u | AF2 | DDR_CH1_VDDQ_4 | K15 |
| HDMI_RX_REXT | AF3 | DDR_CH1_PLL_AVDD1V8 | K16 |
| AVSS_30 | AF4 | VSS_103 | K18 |
| HDMI_RX_CLKN | AF5 | VDD_LOGIC_8 | K19 |
| HDMI_RX_CLKP | AF6 | VDD_LOGIC_9 | K20 |
| AVSS_31 | AF7 | VSS_104 | K21 |
| AVSS_32 | AF8 | VSS_105 | K22 |
| AVSS_33 | AF11 | VDD_CPU_BIG1_9 | K23 |
| AVSS_34 | AF12 | VDD_CPU_BIG1_0 | K24 |
| AVSS_35 | AF13 | AVSS_7 | K26 |
| AVSS_36 | AF14 | PCIE20_SATA30_USB30_2_AVDD_1V8 | K27 |
| AVSS_37 | AF15 | PCIE20_SATA30_USB30_2_AVDD_0V85 | K28 |
| AVSS_38 | AF16 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2_u | K29 |
| TSADC_TEST_OUT_TS | AF18 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1_z | K30 |
| MIPI_D/C_PHY1_VREG | AF19 | AVSS_8 | K31 |
| MIPI_D/C_PHY0_VREG | AF20 | AVSS_9 | K32 |
| AVSS_39 | AF21 | PCIE20_1_TXP/SATA30_1_TXP | K33 |
| VSS_303 | AF22 | PCIE20_1_TXN/SATA30_1_TXN | K34 |
| VSS_304 | AF24 | VSS_106 | L1 |
| VSS_305 | AF25 | DDR_CH0_A5_B | L2 |
| VSS_306 | AF27 | VSS_107 | L3 |
| VSS_307 | AF28 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_B | L4 |
| VSS_308 | AF29 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_B | L5 |
| VSS_309 | AF30 | VSS_108 | L6 |
| VSS_310 | AF31 | DDR_CH0_LP4/4X_CS0_B | L7 |
| VSS_311 | AF32 | DDR_CH0_LP4/4X_CS1_B | L8 |
| GMAC0_TXER/I2C0_SDA_M1/UART7_CTSN_M0/PWM7_IR_M3/SPI3_CLK_M0/GPIO4_C6_d | AF33 | VSS_109 | L9 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/SPI3_CS1_M0/GPIO4_C3_d | AF34 | DDR_CH0_VDDQ_CK | L10 |
| HDMI_TX0_SBDN/eDP_TX0_AUXN | AG1 | DDR_CH1_VDD_0 | L11 |
| HDMI_TX0_SBDP/eDP_TX0_AUXP | AG2 | DDR_CH1_VDD_1 | L12 |
| AVSS_40 | AG3 | DDR_CH1_VDD_2 | L13 |
| HDMI_RX_D0N | AG4 | DDR_CH1_VDD_3 | L14 |
| HDMI_RX_D0P | AG5 | DDR_CH1_PLL_DVDD | L15 |
| AVSS_41 | AG6 | DDR_CH1_PLL_AVSS | L16 |
| AVSS_42 | AG7 | DDR_CH1_VDD_MIF_0 | L17 |
| USB20_HOST0_REXT | AG9 | DDR_CH1_VDD_MIF_1 | L18 |
| AVSS_43 | AG10 | VSS_110 | L19 |
| USB20_AVDD_1V8 | AG11 | VSS_111 | L20 |
| AVSS_44 | AG12 | VSS_112 | L21 |
| TYPEC1_DP1_VDDH_1V8 | AG13 | VSS_113 | L22 |
| TYPEC0_DP0_VDDH_1V8 | AG14 | VDD_CPU_BIG1_8 | L23 |
| AVSS_45 | AG15 | VDD_CPU_BIG1_1 | L24 |
| TYPEC1_DP1_REXT | AG16 | VSS_114 | L25 |
| AVSS_46 | AG18 | AVSS_10 | L26 |
| MIPI_D/C_PHY1_VDD | AG19 | PCIE20_SATA30_1_AVDD_1V8 | L27 |
| MIPI_D/C_PHY0_VDD | AG20 | PCIE20_SATA30_1_AVDD_0V85 | L28 |
| AVSS_47 | AG21 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3_z | L29 |
| AVSS_48 | AG22 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0_z | L30 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/HDMI_RX_CEC_M1/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1_d | AG23 | AVSS_11 | L31 |
| CIF_D15/PCIE30X2_WAKEN_M2/HDMI_RX_SDA_M1/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3_d | AG24 | PCIE20_0_REFCLKP | L32 |
| CIF_D14/PCIE30X2_CLKREQN_M2/HDMI_RX_SCL_M1/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2_d | AG25 | PCIE20_0_REFCLKN | L33 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6_u | AG26 | DDR_CH0_CKB_B | M1 |
| GMAC1_RXD1/MIPI_CAMERA3_CLK_M1/PWM9_M0/GPIO3_B0_u | AG28 | DDR_CH0_CK_B | M2 |
| GMAC1_RXD0/MIPI_CAMERA2_CLK_M1/PWM8_M0/GPIO3_A7_u | AG29 | VSS_115 | M3 |
| VSS_312 | AG30 | DDR_CH0_A1_B | M5 |
| MIPI_CSI1_D0P | AG31 | VSS_116 | M6 |
| MIPI_CSI1_D0N | AG32 | DDR_CH0_A6_B | M7 |
| MIPI_CSI0_D0P | AG33 | DDR_CH0_A0_B | M8 |
| MIPI_CSI0_D0N | AG34 | VSS_117 | M9 |
| HDMI_TX0_D3N/eDP_TX0_D3N | AH2 | DDR_CH0_VDDQ_0 | M10 |
| HDMI_TX0_D3P/eDP_TX0_D3P | AH3 | DDR_CH0_PLL_AVSS | M11 |
| AVSS_49 | AH4 | DDR_CH0_PLL_AVDD1V8 | M12 |
| HDMI_RX_D1N | AH5 | DDR_CH1_VDDQ_CK | M13 |
| HDMI_RX_D1P | AH6 | VSS_118 | M14 |
| AVSS_50 | AH8 | VSS_119 | M15 |
| USB20_HOST1_REXT | AH9 | VDD_CPU_BIG0_0 | M16 |
| USB20_DVDD_0V75 | AH10 | VDD_CPU_BIG0_9 | M17 |
| AVSS_51 | AH11 | VSS_120 | M18 |
| AVSS_52 | AH12 | VDD_CPU_BIG0_MEM_0 | M19 |
| TYPEC1_DP1_VDD_0V85 | AH13 | VSS_121 | M20 |
| TYPEC0_DP0_VDDA_0V85 | AH14 | VDD_CPU_BIG1_MEM_0 | M21 |
| AVSS_53 | AH15 | VSS_122 | M22 |
| TYPEC0_DP0_REXT | AH16 | VDD_CPU_BIG1_7 | M23 |
| SARADC_AVDD_1V8 | AH18 | VDD_CPU_BIG1_2 | M24 |
| MIPI_D/C_PHY1_VDD_1V2 | AH19 | VSS_123 | M25 |
| MIPI_D/C_PHY0_VDD_1V2 | AH20 | AVSS_12 | M26 |
| AVSS_54 | AH21 | PCIE20_SATA30_0_AVDD_1V8 | M27 |
| AVSS_55 | AH22 | PCIE20_SATA30_0_AVDD_0V85 | M28 |
| AVSS_56 | AH23 | TVSS | M29 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0_u | AH24 | PMIC_INT_L/GPIO0_A7_u | M30 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5_u | AH25 | NPOR_u | M31 |
| CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4_u | AH26 | AVSS_13 | M32 |
| ETH1_REFCLKO_25M/MIPI_CAMERA1_CLK_M1/I2C4_SCL_M0/GPIO3_A6_d | AH27 | PCIE20_0_TXN/SATA30_0_TXN | M33 |
| GMAC1_RXDV_CRS/MIPI_CAMERA4_CLK_M1/UART2_TX_M2/PWM2_M1/GPIO3_B1_d | AH29 | PCIE20_0_TXP/SATA30_0_TXP | M34 |
| GMAC1_RXCLK/SDIO_CLK_M1/MIPI_CAMERA0_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5_d | AH30 | DDR_CH0_CKB_A | N1 |
| MIPI_CSI1_D1P | AH31 | DDR_CH0_CK_A | N2 |
| MIPI_CSI1_D1N | AH32 | VSS_124 | N3 |
| MIPI_CSI0_D1P | AH33 | DDR_CH0_A3_B | N4 |
| MIPI_CSI0_D1N | AH34 | DDR_CH0_A2_B | N5 |
| HDMI_TX0_D0N/eDP_TX0_D0N | AJ1 | VSS_125 | N6 |
| HDMI_TX0_D0P/eDP_TX0_D0P | AJ2 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_A | N7 |
| AVSS_57 | AJ3 | DDR_CH0_VDDQ_CKE | N8 |
| HDMI_RX_D2N | AJ4 | VSS_126 | N9 |
| HDMI_RX_D2P | AJ5 | DDR_CH0_VDDQ_1 | N10 |
| AVSS_58 | AJ7 | VSS_127 | N11 |
| AVSS_59 | AJ8 | DDR_CH0_PLL_DVDD | N12 |
| AVSS_60 | AJ9 | DDR_CH0_VDD_MIF_0 | N13 |
| USB20_AVDD_3V3 | AJ10 | VSS_128 | N14 |
| AVSS_61 | AJ11 | VSS_129 | N15 |
| AVSS_62 | AJ12 | VDD_CPU_BIG0_1 | N16 |
| TYPEC1_DP1_VDDA_0V85 | AJ13 | VDD_CPU_BIG0_8 | N17 |
| TYPEC0_DP0_VDD_0V85 | AJ14 | VSS_130 | N18 |
| AVSS_63 | AJ15 | VDD_CPU_BIG0_MEM_1 | N19 |
| AVSS_64 | AJ16 | VSS_131 | N20 |
| AVSS_65 | AJ18 | VDD_CPU_BIG1_MEM_1 | N21 |
| MIPI_D/C_PHY1_VDD_1V8 | AJ19 | VSS_132 | N22 |
| MIPI_D/C_PHY0_VDD_1V8 | AJ20 | VDD_CPU_BIG1_6 | N23 |
| AVSS_66 | AJ21 | VDD_CPU_BIG1_3 | N24 |
| AVSS_67 | AJ22 | VSS_133 | N25 |
| AVSS_68 | AJ23 | VSS_134 | N26 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7_u | AJ24 | OSC_1V8 | N27 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0_u | AJ25 | PMUIO1_1V8 | N28 |
| BT1120_D11/PCIE30X4_WAKEN_M1/HDMI_RX_CEC_M0/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5_d | AJ26 | VSS_135 | N29 |
| BT1120_D12/PCIE30X4_PERSTN_M1/HDMI_RX_HPDIN_M0/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6_d | AJ27 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6_z | N30 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7_u | AJ28 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5_d | N31 |
| VSS_313 | AJ30 | AVSS_14 | N32 |
| MIPI_CSI1_CLK0P | AJ31 | PCIE20_0_RXP/SATA30_0_RXP | N33 |
| MIPI_CSI1_CLK0N | AJ32 | PCIE20_0_RXN/SATA30_0_RXN | N34 |
| MIPI_CSI0_CLK0P | AJ33 | VSS_136 | P1 |
| MIPI_CSI0_CLK0N | AJ34 | DDR_CH0_A5_A | P2 |
| HDMI_TX0_D1N/eDP_TX0_D1N | AK2 | VSS_137 | P3 |
| HDMI_TX0_D1P/eDP_TX0_D1P | AK3 | DDR_CH0_A2_A | P4 |
| AVSS_69 | AK4 | DDR_CH0_A3_A | P5 |
| AVSS_70 | AK5 | VSS_138 | P6 |
| USB20_HOST0_DP | AK6 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_A | P7 |
| AVSS_71 | AK7 | VSS_139 | P8 |
| TYPEC1_USB20_OTG_ID | AK8 | VSS_140 | P9 |
| TYPEC1_USB20_OTG_DP | AK9 | DDR_CH0_VDDQ_2 | P10 |
| AVSS_72 | AK10 | VSS_141 | P11 |
| AVSS_73 | AK11 | DDR_CH0_VDD_3 | P12 |
| AVSS_74 | AK12 | DDR_CH0_VDD_MIF_1 | P13 |
| AVSS_75 | AK13 | VSS_142 | P14 |
| AVSS_76 | AK14 | VSS_143 | P15 |
| SARADC_IN5 | AK15 | VDD_CPU_BIG0_2 | P16 |
| SARADC_IN2 | AK16 | VDD_CPU_BIG0_7 | P17 |
| SARADC_IN7 | AK17 | VSS_144 | P18 |
| MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B | AK18 | VSS_145 | P19 |
| MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A | AK19 | VSS_146 | P20 |
| MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C | AK20 | VSS_147 | P21 |
| MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B | AK21 | VSS_148 | P22 |
| MIPI_DPHY1_RX_D3P/NO_USE | AK22 | VDD_CPU_BIG1_5 | P23 |
| AVSS_77 | AK23 | VDD_CPU_BIG1_4 | P24 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1_d | AK24 | VSS_149 | P25 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2_u | AK25 | VSS_150 | P26 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/PCIE30X2_PERSTN_M1/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0_d | AK26 | PMU_0V75 | P27 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5_d | AK27 | PMUIO2 | P28 |
| VSS_314 | AK28 | I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5_d | P29 |
| VSS_315 | AK29 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5_u | P30 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0_d | AK30 | SDMMC_DET/GPIO0_A4_u | P31 |
| MIPI_CSI1_D2P | AK31 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1_z | P32 |
| MIPI_CSI1_D2N | AK32 | REFCLK_OUT/GPIO0_A0_d | P33 |
| MIPI_CSI0_D2P | AK33 | VSS_151 | P34 |
| MIPI_CSI0_D2N | AK34 | DDR_CH0_A4_A | R1 |
| HDMI_TX0_D2N/eDP_TX0_D2N | AL1 | DDR_CH0_DQ3_A | R2 |
| HDMI_TX0_D2P/eDP_TX0_D2P | AL2 | VSS_152 | R3 |
| AVSS_78 | AL3 | VSS_153 | R5 |
| AVSS_79 | AL4 | DDR_CH0_LP4/4X_CS0_A | R6 |
| AVSS_80 | AL5 | DDR_CH0_LP4/4X_CS1_A | R7 |
| USB20_HOST0_DM | AL6 | VSS_154 | R8 |
| USB20_HOST1_DP | AL7 | VSS_155 | R9 |
| TYPEC1_USB20_VBUSDET | AL8 | DDR_CH0_VDDQ_3 | R10 |
| TYPEC1_USB20_OTG_DM | AL9 | VSS_156 | R11 |
| TYPEC1_SBU1/DP1_AUXP | AL10 | DDR_CH0_VDD_2 | R12 |
| AVSS_81 | AL11 | VSS_157 | R13 |
| TYPEC0_USB20_OTG_DP | AL12 | VDD_VDENC_0 | R14 |
| AVSS_82 | AL13 | VSS_158 | R15 |
| TYPEC0_USB20_OTG_ID | AL14 | VDD_CPU_BIG0_3 | R16 |
| TYPEC0_SBU1/DP0_AUXP | AL15 | VDD_CPU_BIG0_6 | R17 |
| SARADC_IN1 | AL16 | VSS_159 | R18 |
| SARADC_IN6 | AL17 | VSS_160 | R19 |
| MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A | AL18 | VSS_161 | R20 |
| MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C | AL19 | VSS_162 | R21 |
| MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B | AL20 | VSS_163 | R22 |
| MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A | AL21 | VSS_164 | R23 |
| MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C | AL22 | VSS_165 | R24 |
| AVSS_83 | AL23 | VSS_166 | R25 |
| MIPI_CAMERA0_CLK_M0/SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1_u | AL24 | VSS_167 | R26 |
| VSS_316 | AL25 | PMUIO2_1V8 | R27 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4_u | AL26 | VSS_168 | R28 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/PCIE30X2_CLKREQN_M1/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6_d | AL27 | I2S1_SCLK_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6_d | R29 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4_d | AL28 | PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4_d | R30 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3_d | AL29 | PMIC_SLEEP2/GPIO0_A3_d | R31 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1_d | AL30 | PMIC_SLEEP1/GPIO0_A2_d | R32 |
| MIPI_CSI1_D3P | AL31 | VSS_169 | R33 |
| MIPI_CSI1_D3N | AL32 | XIN_24M | R34 |
| MIPI_CSI0_D3P | AL33 | DDR_CH0_DQ2_A | T1 |
| MIPI_CSI0_D3N | AL34 | DDR_CH0_DQ1_A | T2 |
| HDMI/eDP_TX0_REXT | AM2 | VSS_170 | T3 |
| HDMI_TX1_D3P/eDP_TX1_D3P | AM3 | DDR_CH0_RESET_A | T4 |
| AVSS_84 | AM4 | DDR_CH0_A6_A | T5 |
| HDMI_TX1_D1P/eDP_TX1_D1P | AM5 | VSS_171 | T6 |
| USB20_HOST1_DM | AM7 | DDR_CH0_A0_A | T7 |
| AVSS_85 | AM8 | DDR_CH0_A1_A | T8 |
| AVSS_86 | AM9 | VSS_172 | T9 |
| TYPEC1_SBU2/DP1_AUXN | AM10 | DDR_CH0_VDDQ_4 | T10 |
| TYPEC0_USB20_OTG_DM | AM12 | VSS_173 | T11 |
| TYPEC0_USB20_VBUSDET | AM14 | DDR_CH0_VDD_1 | T12 |
| TYPEC0_SBU2/DP0_AUXN | AM15 | VSS_174 | T13 |
| SARADC_IN0_BOOT | AM16 | VDD_VDENC_1 | T14 |
| SARADC_IN4 | AM17 | VSS_175 | T15 |
| AVSS_87 | AM18 | VDD_CPU_BIG0_4 | T16 |
| AVSS_88 | AM20 | VDD_CPU_BIG0_5 | T17 |
| AVSS_89 | AM22 | VSS_176 | T18 |
| AVSS_90 | AM23 | VSS_177 | T19 |
| AVSS_91 | AM24 | VSS_178 | T20 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3_u | AM25 | VDD_CPU_LIT_MEM_1 | T21 |
| AVSS_92 | AM26 | VDD_CPU_LIT_MEM_0 | T22 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/PCIE30X2_WAKEN_M1/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7_d | AM27 | VSS_179 | T23 |
| AVSS_93 | AM28 | VSS_180 | T24 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2_d | AM29 | VSS_181 | T25 |
| VSS_317 | AM30 | VSS_182 | T26 |
| MIPI_CSI1_CLK1P | AM31 | VSS_183 | T27 |
| MIPI_CSI1_CLK1N | AM32 | I2S1_LRCK_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7_d | T28 |
| MIPI_CSI0_CLK1P | AM33 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6_u | T29 |
| MIPI_CSI0_CLK1N | AM34 | PMIC_SLEEP5/GPIO0_C3_d | T30 |
| HDMI/eDP_TX1_REXT | AN1 | PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0_d | T31 |
| HDMI_TX1_SBDP/eDP_TX1_AUXP | AN2 | PMIC_SLEEP4/GPIO0_C2_d | T32 |
| HDMI_TX1_D0P/eDP_TX1_D0P | AN4 | VSS_184 | T33 |
| HDMI_TX1_D1N/eDP_TX1_D1N | AN5 | XOUT_24M | T34 |
| HDMI_TX1_D2P/eDP_TX1_D2P | AN6 | DDR_CH0_DQ0_A | U1 |
| AVSS_94 | AN7 | DDR_CH0_DQ7_A | U2 |
| TYPEC1_SSRX1P/DP1_TX0P | AN8 | VSS_185 | U3 |
| TYPEC1_SSTX1N/DP1_TX1N | AN9 | DDR_CH0_DQS0N_A | U4 |
| TYPEC1_SSRX2P/DP1_TX2P | AN10 | DDR_CH0_DQS0P_A | U5 |
| TYPEC1_SSTX2N/DP1_TX3N | AN11 | DDR_CH0_VDD_0 | U11 |
| AVSS_95 | AN12 | VSS_186 | U12 |
| TYPEC0_SSRX1P/DP0_TX0P | AN13 | VSS_187 | U13 |
| TYPEC0_SSTX1N/DP0_TX1N | AN14 | VDD_VDENC_2 | U14 |
| TYPEC0_SSRX2P/DP0_TX2P | AN15 | VSS_188 | U15 |
| TYPEC0_SSTX2N/DP0_TX3N | AN16 | VSS_189 | U16 |
| SARADC_IN3 | AN17 | VSS_190 | U17 |
| MIPI_DPHY1_TX_D0P/MIPI_CPHY1_TX_TRIO0_B | AN18 | PLL_AVDD1V8 | U18 |
| MIPI_DPHY1_TX_D1P/MIPI_CPHY1_TX_TRIO1_A | AN19 | PLL_AVSS | U19 |
| MIPI_DPHY1_TX_CLKP/MIPI_CPHY1_TX_TRIO1_C | AN20 | VSS_191 | U20 |
| MIPI_DPHY1_TX_D2P/MIPI_CPHY1_TX_TRIO2_B | AN21 | VDD_CPU_LIT_7 | U21 |
| MIPI_DPHY1_TX_D3P/NO_USE | AN22 | VDD_CPU_LIT_0 | U22 |
| AVSS_96 | AN23 | VSS_192 | U23 |
| MIPI_DPHY0_TX_D0P/MIPI_CPHY0_TX_TRIO0_B | AN24 | VSS_193 | U24 |
| MIPI_DPHY0_TX_D1P/MIPI_CPHY0_TX_TRIO1_A | AN25 | VSS_194 | U30 |
| MIPI_DPHY0_TX_CLKP/MIPI_CPHY0_TX_TRIO1_C | AN26 | VSS_195 | U31 |
| MIPI_DPHY0_TX_D2P/MIPI_CPHY0_TX_TRIO2_B | AN27 | PMIC_SLEEP3/GPIO0_C1_d | U32 |
| MIPI_DPHY0_TX_D3P/NO_USE | AN28 | LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3_u | U33 |
| MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B | AN29 | VSS_196 | U34 |
| HDMI_TX1_D3N/eDP_TX1_D3N | AN3 | DDR_CH0_DQ6_A | V1 |
| MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A | AN30 | DDR_CH0_DQ5_A | V2 |
| AVSS_97 | AN31 | VSS_197 | V3 |
| MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C | AN32 | VSS_198 | V4 |
| MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B | AN33 | VSS_199 | V5 |
| MIPI_DPHY0_RX_D3P/NO_USE | AN34 | DDR_CH0_WCK0N_A | V6 |
| AVSS_98 | AP1 | DDR_CH0_WCK0P_A | V7 |
| HDMI_TX1_D0N/eDP_TX1_D0N | AP4 | VSS_200 | V8 |
| HDMI_TX1_D2N/eDP_TX1_D2N | AP6 | VSS_201 | V9 |
| TYPEC1_USB20_OTG1_REXT | AP7 | VSS_202 | V10 |
| TYPEC1_SSRX1N/DP1_TX0N | AP8 | VSS_203 | V11 |
| TYPEC1_SSTX1P/DP1_TX1P | AP9 | VDD_VDENC_MEM_0 | V12 |
| TYPEC1_SSRX2N/DP1_TX2N | AP10 | VDD_VDENC_MEM_1 | V13 |
| TYPEC1_SSTX2P/DP1_TX3P | AP11 | VDD_VDENC_3 | V14 |
| TYPEC0_USB20_OTG0_REXT | AP12 | VSS_204 | V15 |
| TYPEC0_SSRX1N/DP0_TX0N | AP13 | VDD_LOGIC_6 | V16 |
| TYPEC0_SSTX1P/DP0_TX1P | AP14 | VDD_LOGIC_7 | V17 |
| TYPEC0_SSRX2N/DP0_TX2N | AP15 | VSS_205 | V18 |
| TYPEC0_SSTX2P/DP0_TX3P | AP16 | VSS_206 | V19 |
| AVSS_99 | AP17 | PLL_DVDD0V75 | V20 |
| MIPI_DPHY1_TX_D0N/MIPI_CPHY1_TX_TRIO0_A | AP18 | VDD_CPU_LIT_6 | V21 |
| MIPI_DPHY1_TX_D1N/MIPI_CPHY1_TX_TRIO0_C | AP19 | VDD_CPU_LIT_1 | V22 |
| HDMI_TX1_SBDN/eDP_TX1_AUXN | AP2 | VSS_207 | V23 |
| MIPI_DPHY1_TX_CLKN/MIPI_CPHY1_TX_TRIO1_B | AP20 | VSS_208 | V24 |
| MIPI_DPHY1_TX_D2N/MIPI_CPHY1_TX_TRIO2_A | AP21 | VSS_209 | V25 |
| MIPI_DPHY1_TX_D3N/MIPI_CPHY1_TX_TRIO2_C | AP22 | EMMCIO_1V8 | V26 |
| AVSS_100 | AP23 | VSS_210 | V27 |
| MIPI_DPHY0_TX_D0N/MIPI_CPHY0_TX_TRIO0_A | AP24 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5_u | V28 |
| MIPI_DPHY0_TX_D1N/MIPI_CPHY0_TX_TRIO0_C | AP25 | I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/PCIE30X2_PERSTN_M0/SATA_CPDET/GPIO0_D4_u | V29 |
| MIPI_DPHY0_TX_CLKN/MIPI_CPHY0_TX_TRIO1_B | AP26 | VSS_211 | V30 |
| MIPI_DPHY0_TX_D2N/MIPI_CPHY0_TX_TRIO2_A | AP27 | I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7_d | V31 |
| MIPI_DPHY0_TX_D3N/MIPI_CPHY0_TX_TRIO2_C | AP28 | EMMC_D2/FSPI_D2_M0/GPIO2_D2_u | V32 |
| MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A | AP29 | EMMC_D7/FSPI_CS1N_M0/GPIO2_D7_u | V33 |
| MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C | AP30 | EMMC_CLKOUT/GPIO2_A1_d | V34 |
| MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B | AP31 | DDR_CH0_DQ4_A | W1 |
| MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A | AP32 | VSS_212 | W2 |
| MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C | AP33 | VSS_213 | W3 |
| AVSS_101 | AP34 | DDR_CH0_WCK1P_A | W4 |
| DDR_CH0_DQ11_B | B1 | DDR_CH0_WCK1N_A | W5 |
| DDR_CH1_DQ11_C | B2 | VSS_214 | W6 |
| DDR_CH1_DQ9_C | B3 | VSS_215 | W7 |
| DDR_CH1_DQ15_C | B4 | DDR_CH0_ZQ_A | W8 |
| DDR_CH1_DQ13_C | B5 | VSS_216 | W9 |
| VSS_5 | B6 | VSS_217 | W10 |
| DDR_CH1_DQ5_C | B7 | VSS_218 | W11 |
| DDR_CH1_DQ7_C | B8 | VSS_219 | W12 |
| DDR_CH1_DQ1_C | B9 | VDD_VDENC_5 | W13 |
| DDR_CH1_DQ3_C | B10 | VDD_VDENC_4 | W14 |
| DDR_CH1_A5_C | B11 | VSS_220 | W15 |
| DDR_CH1_CK_C | B12 | VSS_221 | W16 |
| DDR_CH1_CK_D | B13 | VSS_222 | W17 |
| DDR_CH1_A5_D | B14 | VSS_223 | W18 |
| DDR_CH1_DQ3_D | B15 | VSS_224 | W19 |
| DDR_CH1_DQ1_D | B16 | VSS_225 | W20 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_LIT_5 | W21 |
| DDR_CH1_DQ5_D | B18 | VDD_CPU_LIT_2 | W22 |
| VSS_6 | B19 | VSS_226 | W23 |
| DDR_CH1_DQ13_D | B20 | VSS_227 | W24 |
| DDR_CH1_DQ15_D | B21 | VCCIO5_1V8 | W25 |
| DDR_CH1_DQ9_D | B22 | VCCIO5 | W26 |
| DDR_CH1_DQ11_D | B23 | VSS_228 | W27 |
| VSS_7 | B24 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6_d | W28 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4_d | B25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/HDMI_RX_SCL_M0/SPI3_MOSI_M2/PCIE30X2_WAKEN_M0/HDMI_TX1_CEC_M1/GPIO0_D2_u | W29 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5_d | B26 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/HDMI_RX_SDA_M0/SPI0_CS0_M0/PCIE30X2_CLKREQN_M0/HDMI_TX0_CEC_M1/GPIO0_D1_u | W30 |
| VSS_8 | B27 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0_d | W31 |
| PCIE30_PORT1_REF_CLKN | B28 | EMMC_D6/FSPI_CS0N_M0/GPIO2_D6_u | W32 |
| PCIE30_PORT1_TX1N | B29 | EMMC_D1/FSPI_D1_M0/GPIO2_D1_u | W33 |
| PCIE30_PORT1_TX0P | B30 | EMMC_CMD/FSPI_CLK_M0/GPIO2_A0_u | W34 |
| PCIE30_PORT1_RX1N | B31 | DDR_CH0_DQ12_A | Y1 |
| PCIE30_PORT1_RX0P | B32 | DDR_CH0_DQ13_A | Y2 |
| VSS_9 | B33 | VSS_229 | Y3 |
| PCIE30_PORT0_RESREF | B34 | DDR_CH0_DM0_A | Y4 |
| DDR_CH0_DQ9_B | C1 | VSS_230 | Y5 |
| DDR_CH0_DQ10_B | C2 | VSS_231 | Y6 |
| VSS_10 | C3 | VCCIO2 | Y7 |
| VSS_11 | C4 | VSS_232 | Y8 |
| VSS_17 | C10 | VSS_233 | Y9 |
| VSS_18 | C11 | VSS_234 | Y10 |
| VSS_19 | C12 | VSS_235 | Y11 |
| VSS_20 | C13 | VSS_236 | Y12 |
| VSS_21 | C14 | VSS_237 | Y13 |
| VSS_22 | C15 | VSS_238 | Y14 |
| VSS_23 | C16 | VSS_239 | Y15 |
| VSS_24 | C17 | VSS_240 | Y16 |
| VSS_25 | C18 | VSS_241 | Y17 |
| DDR_CH1_RESET_D | C19 | VSS_242 | Y18 |
| VSS_26 | C20 | VSS_243 | Y19 |
| VSS_27 | C21 | VSS_244 | Y20 |
| VSS_28 | C22 | VDD_CPU_LIT_4 | Y21 |
| VSS_29 | C23 | VDD_CPU_LIT_3 | Y22 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6_d | C24 | VSS_245 | Y23 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7_u | C25 | VSS_246 | Y24 |
| VSS_30 | C26 | VCCIO3_1V8 | Y26 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0_u | C27 | GMAC1_PPSCLK/PCIE30X2_BUTTON_RSTN/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1_d | Y27 |
| VSS_31 | C28 | VSS_247 | Y28 |
| PCIE30_PORT1_TX1P | C29 | GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0_d | Y29 |
| VSS_32 | C30 | GMAC1_MDIO/MIPI_TE1/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3_d | Y30 |
| PCIE30_PORT1_RX1P | C31 | GMAC1_MDC/MIPI_TE0/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2_d | Y31 |
| VSS_33 | C32 | EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4_u | Y32 |
| PCIE30_PORT0_TX1P | C33 | EMMC_D0/FSPI_D0_M0/GPIO2_D0_u | Y33 |
| PCIE30_PORT0_TX1N | C34 | EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2_d | Y34 |

## 3. Elektrische Daten

### 3.1 Absolute Grenzwerte

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
| 0.75V Versorgungsspannung | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI/eDP_TX0_VDD_0V75 HDMI/eDP_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 HDMI_RX_AVDD0V75 MIPI_CSI0_AVCC0V75 MIPI_CSI1_AVCC0V75 PCIE30_PORT0_AVDD0V75 PCIE30_PORT1_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V Versorgungsspannung | DDR_CH0_VDD DDR_CH0_VDD_MIF DDR_CH0_PLL_DVDD DDR_CH1_VDD DDR_CH1_VDD_MIF DDR_CH1_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 TYPEC1_DP1_VDD_0V85 TYPEC1_DP1_VDDA_0V85 MIPI_D/C_PHY0_VDD MIPI_D/C_PHY1_VDD PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.2V Versorgungsspannung | MIPI_D/C_PHY0_VDD_1V2 MIPI_D/C_PHY1_VDD_1V2 | -0.3 | 1.35 | V |
| 1.8V Versorgungsspannung | DDR_CH0_PLL_AVDD1V8 DDR_CH1_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 TYPEC1_DP1_VDDH_1V8 HDMI/eDP_TX0_VDD_CMN_1V8 HDMI/eDP_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 MIPI_CSI0_AVCC1V8 MIPI_CSI1_AVCC1V8 MIPI_D/C_PHY0_VDD_1V8 MIPI_D/C_PHY1_VDD_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 PCIE30_PORT1_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V Versorgungsspannung | USB20_AVDD_3V3 HDMI_RX_DVDD3V3 HDMI_RX_VPH3V3 | -0.5 | 3.63 | V |
| GPIO-Versorgung nur 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| GPIO-Versorgung 1.8V/3.3V | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Versorgung DDR IO (LPDDR4/4X 0.6V; LPDDR5/5X 0.5V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Versorgung DDR IO (LPDDR4/4X 1.1V; LPDDR5/5X 1.05V) | DDR_CH0_VDDQ_CKE DDR_CH1_VDDQ_CKE | -0.3 | 1.25 | V |
| Lagertemperatur | Tstg | -40 | 125 | ℃ |
| Maximale Sperrschichttemperatur (Quelle: Conjunction) | Tj | NA | 125 | ℃ |

Das Über-/Unterschreiten absoluter Grenzwerte kann dauerhaft schädigen; längerer Betrieb an absoluten Maximalwerten beeinträchtigt die Zuverlässigkeit.

### 3.2 Empfohlene Betriebsbedingungen

| Parameter | Symbol | Minimum | Typisch | Maximum① | Einheit |
| --- | --- | --- | --- | --- | --- |
| Spannung CPU-BigCore 0 & Speicher | VDD_CPU_BIG0 & VDD_CPU_BIG0_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung CPU-BigCore 1 & Speicher | VDD_CPU_BIG1 & VDD_CPU_BIG1_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung CPU-LitCore/DSU | VDD_CPU_LIT & VDD_CPU_LIT_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung GPU & Speicher | VDD_GPU & VDD_GPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung NPU & Speicher | VDD_NPU & VDD_NPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Spannung VCODEC & Speicher | VDD_VDENC | 0.675 | 0.75 | 0.825 | V |
| Logikspannung | VDD_LOGIC | 0.65 | 0.75 | 0.8 | V |
| PMU-Spannung | PMU_0V75 | 0.7 | 0.75 | 0.8 | V |
| Digitale GPIO-Versorgung (1.8V nur) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.89 | V |
| Digitale GPIO-Versorgung (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Versorgung eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.89 | V |
| DDR CH0 Logikversorgung(0.85V) | DDR_CH0_VDD, DDR_CH0_VDD_MIF, DDR_CH1_VDD, DDR_CH1_VDD_MIF, | 0.675 | 0.85 | 0.935 | V |
| DDR CH0_PLL Versorgung(0.85V) | DDR_CH0_PLL_DVDD, DDR_CH1_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
| DDR CH0_PLL Versorgung(1.8V) | DDR_CH0_PLL_AVDD1V8, DDR_CH1_PLL_AVDD1V8 | 1.62 | 1.8 | 1.89 | V |
| LPDDR4 IO-VDDQ-Versorgung | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 IO-VDDQ-Retention-Versorgung | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| LPDDR5 IO-VDDQ-Versorgung | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.475 | 0.5 | 0.525 | V |
| LPDDR5 IO-VDDQ-Retention-Versorgung | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.0 | 1.05 | 1.1 | V |
| PLL Analogversorgung(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Analogversorgung(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.89 | V |
| USB 2.0 Analogversorgung (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Analogversorgung (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.89 | V |
| USB 2.0 Analogversorgung (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Analogversorgung (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85, TYPEC1_DP1_VDD_0V85, TYPEC1_DP1_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Analogversorgung (1.8V) | TYPEC0_DP0_VDDH_1V8, TYPEC1_DP1_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Analogversorgung(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Analogversorgung(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.89 | V |
| PCIe30 Analogversorgung(0.75V) | PCIE30_PORT0_AVDD0V75, PCIE30_PORT1_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Analogversorgung(1.8V) | PCIE30_PORT0_AVDD1V8, PCIE30_PORT1_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| MIPI CSI DPHY Analogversorgung(0.75V) | MIPI_CSI0_AVCC0V75, MIPI_CSI1_AVCC0V75 | 0.675 | 0.75 | 0.825 | V |
| MIPI CSI DPHY Analogversorgung(1.8V) | MIPI_CSI0_AVCC1V8, MIPI_CSI1_AVCC1V8 | 1.62 | 1.8 | 1.89 | V |
| MIPI DCPHY Analogversorgung (0.85V) | MIPI_D/C_PHY0_VDD, MIPI_D/C_PHY1_VDD | 0.7125 | 0.85 | 0.8925 | V |
| MIPI DCPHY Analogversorgung (1.2V) | MIPI_D/C_PHY0_VDD_1V2, MIPI_D/C_PHY1_VDD_1V2 | 1.14 | 1.2 | 1.26 | V |
| MIPI DCPHY Analogversorgung (1.8V) | MIPI_D/C_PHY0_VDD_1V8, MIPI_D/C_PHY1_VDD_1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI RX Analogversorgung(0.75V) | HDMI_RX_AVDD0V75 | 0.675 | 0.75 | 0.825 | V |
| HDMI RX Analogversorgung(3.3V) | HDMI_RX_DVDD3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI RX Analogversorgung(3.3V) | HDMI_RX_VPH3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI/eDP TX Digitalversorgung (0.75V) | HDMI/eDP_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (0.75V) | HDMI/eDP_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI/eDP_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.89 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI/eDP_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.89 | V |
| SARADC Analogversorgung(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.89 | V |
| OTP Analogversorgung(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Analogversorgung(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| OSC-Eingangstakt |  | NA | 24 | NA | MHz |
| Maximale CPU-A76-Frequenz |  | NA | NA | 2.0 | GHz |
| Maximale CPU-A55-Frequenz |  | NA | NA | 1.7 | GHz |
| Maximale GPU-Frequenz |  | NA | NA | 1.0 | GHz |
| Maximale NPU-Frequenz |  | NA | NA | 950 | MHz |
| Umgebungsbetriebstemperatur① | TA | -40 | NA | 85 | ℃ |

Hinweis①: Die Spannung hängt von der Frequenz ab; SDK und Referenzschaltung strikt beachten. CPU/GPU/NPU-Maximum im Normalbetrieb0.75V; Welligkeit innerhalb ±5%.

### 3.3 Gleichstromkennwerte

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

### 3.4 Elektrische GPIO-Kennwerte

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

Hinweise zu 3.3/3.4: VDDO und DVDD sind IO-Versorgungen. Negative Pull-up-Ströme bleiben in den ursprünglichen MIN/MAX-Spalten; kein Spaltentausch.

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

PLL-Hinweis ①: p ist der Eingangsteilerwert.

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
| Gleichtaktstörung 50MHz–450MHz | ΔVCMRX(LF) | -50 | NA | 50 | mV |
| Gleichtaktstörung 50MHz–450MHz | ΔVCMRX(LF) | -25 | NA | 25 | mV |
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
| Temperaturmessbereich | TRANGE |  | -40 | NA | 125 | ℃ |
| Auflösung | TLSB |  | NA | 1 | NA | ℃ |

## 4. Wärmemanagement

Für zuverlässigen Betrieb muss die absolute maximale Sperrschichttemperatur unter 125°C bleiben. Die thermischen Werte sind Simulationsergebnisse und müssen praktisch überprüft werden. Referenzplatine: 10 Lagen, 114mm x 101mm, 25°C Umgebung.

| Parameter | Symbol | Typisch | Einheit |
| --- | --- | --- | --- |
| Wärmewiderstand Sperrschicht–Umgebung | 𝜽 𝑱𝑨 | 8.7 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Platine | 𝜽 𝑱𝑩 | 3.5 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Gehäuse | 𝜽 𝑱𝑪 | 0.12 | (℃/𝑾) |

## Versionsabgleich

Rev1.1 nannte kein LPDDR5X; Speicherklassen: LPDDR4-4266/LPDDR4X-4266/LPDDR5-4800. Rev1.3 ergänzt LPDDR5X und HDMI-/DP-/MIPI-/VOP-Timing. Alte absolute/empfohlene Versorgungsnamen PMUIO2_1V8/VCCIO2_1V8/VCCIO4_1V8/VCCIO5_1V8/VCCIO6_1V8 heißen nun PMUIO2/VCCIO2/VCCIO4/VCCIO5/VCCIO6 bei gleichen Zahlenwerten. Dies sind Versionsbezeichnungen, keine Erlaubnis zum Austausch von Platinenversorgungen. Die ältere Automotive-Unterhaltung bleibt im Überblick erwähnt. Die neue Grafik ergänzt LPDDR5X; übrige Blöcke sind abgedeckt.

## Quellenhinweise

Die Grafik nennt sechs SPI, §1.2.13 fünf SPI0–SPI4. Zwei HF-Maxima und zwei LF-Bereiche der Gleichtaktstörung bleiben ohne zusätzliche Bedingungen erhalten. Grenzwerttabelle: maximal125°C Sperrschicht; Wärmetext: unter125°C. Kein Registerkartenkapitel vorhanden.

## Offizielle Referenzen

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
