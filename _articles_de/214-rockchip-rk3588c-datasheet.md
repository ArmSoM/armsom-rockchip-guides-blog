---
title: "Rockchip RK3588C: Datenblatt, Pins und elektrische Grenzwerte"
description: "Rockchip RK3588C: Datenblatt, Pins und elektrische Grenzwerte — Rev1.3"
excerpt: "Rockchip RK3588C: Datenblatt, Pins und elektrische Grenzwerte"
translation_key: "214-rockchip-rk3588c-datasheet"
slug: "214-rockchip-rk3588c-datasheet"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588C","datasheet"]
---

{% raw %}

# Rockchip RK3588C: Datenblatt, Pins und elektrische Grenzwerte

ArmSoM-Referenz zum RK3588C. Chipfunktionen garantieren keine Platinenkompatibilität: Baustein, Schaltplan, Versorgung und BSP prüfen. Keine Hardwaretests durchgeführt. Abbildungen und thermische Simulation stammen von Rockchip. SDK/Kernel nicht vorgegeben. Einzige Quelle: englisches RK3588C Datasheet Rev1.3 vom 2024-12-12, 33 Seiten, im CN-Verzeichnis. Alle Abbildungen sind englische Originale.

## 1.1

Der RK3588C ist ein stromsparender, leistungsfähiger Prozessor für NVR und Edge-Computing-Geräte. Er integriert vier Cortex-A76- und vier Cortex-A55-Kerne mit NEON-Koprozessoren. Hardwareblöcke beschleunigen anspruchsvolle Anwendungen: H.265 und VP9 werden bis 8K@60fps, H.264 bis 8K@30fps und AV1 bis 4K@60fps dekodiert. Die H.264- und H.265-Kodierung erreicht 8K@30fps. Hinzu kommen hochwertige JPEG-Kodierung und -Dekodierung sowie spezielle Bildvor- und -nachverarbeitung. Die 3D-GPU unterstützt OpenGLES 1.1, 2.0 und 3.2, OpenCL bis 2.2 und Vulkan 1.2. Eine eigene 2D-Einheit mit MMU beschleunigt die Bildausgabe.  Die NPU unterstützt gemischte INT4/INT8/INT16/FP16-Operationen mit bis zu 6 TOPS; Modelle aus TensorFlow, MXNet, PyTorch und Caffe lassen sich konvertieren. Die vierkanalige externe Speicherschnittstelle unterstützt LPDDR4/LPDDR4X und hohe Bandbreitenanforderungen. Umfangreiche Peripherieschnittstellen ermöglichen vielseitige Anwendungen.

## 1.2.1

Mikroprozessor. Vier ARM Cortex-A76 MPCore und vier ARM Cortex-A55 MPCore verbinden hohe Leistung, niedrigen Verbrauch und Caches. Die DSU (DynamIQ Shared Unit) umfasst das L3-Speichersystem, Steuerlogik und externe Schnittstellen des DynamIQ-Clusters. Der ARMv8-A-Befehlssatz ist vollständig implementiert, einschließlich ARM NEON Advanced SIMD für Medien- und Signalverarbeitung, ARMv8-Kryptografieerweiterungen und TrustZone. Jeder A76 besitzt 64KB L1-Befehls-, 64KB L1-Daten- und 512KB L2-Cache; jeder A55 besitzt 32KB L1-Befehls-, 32KB L1-Daten- und 128KB L2-Cache. Alle acht Kerne teilen 3MB L3. Acht unabhängige Leistungsdomänen unterstützen interne Leistungsschalter und extern gesteuertes Ein-/Ausschalten je nach Anwendung: PD_CPU_0/1/2/3 entsprechen den A55-Kernen 1/2/3/4 und PD_CPU_4/5/6/7 den A76-Kernen 1/2/3/4; jeweils einschließlich NEON, FPU und L1/L2-Befehls-/Datencaches. Drei getrennte Spannungsdomänen unterstützen DVFS: A76_0+A76_1, A76_2+A76_3 und DSU+Cortex-A55.

## 1.2.2

Speicherorganisation. Das interne BootROM startet über SPI, eMMC oder SD/MMC und lädt Systemcode über USB OTG. Gemeinsamer Speicher liegt in VD_LOGIC; PMU SRAM in VD_PMU dient stromsparenden Anwendungen. Externer dynamischer Speicher entspricht JEDEC LPDDR4/LPDDR4X: vier 16-Bit-Kanäle, höchstens zwei Ranks/Chip-Selects pro Kanal und bis zu 32GB Adressraum insgesamt. SDRAM unterstützt Power-down und Selbstauffrischung. eMMC entspricht vollständig JEDEC eMMC 5.1/5.0 und ist zu 4.51 und früheren Versionen abwärtskompatibel; HS400, HS200, DDR50 und herkömmliche Modi verwenden 1/4/8-Bit-Busse. SD/MMC unterstützt SD3.0 und MMC 4.51 mit 4-Bit-Bus. FSPI überträgt Daten zur und von serieller Flash-Speicherung über 1/2/4-Bit-Busse mit zwei Chip-Selects.

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

Videoeingang. Ein standardmäßiger 8/10/12/16-Bit-DVP unterstützt bis 150MHz, BT.601/BT.656/BT.1120 und konfigurierbare pixel_clk/hsync/vsync-Polarität.

## 1.2.9

Displays. Ein HDMI2.1 TX unterstützt x3/x4 FRL, Abwärtskompatibilität mit HDMI2.1 TMDS und älteren Spezifikationen, 3/6/8/10/12Gbps, bis 7680x4320@60Hz, RGB/YUV bis 10bit, DSC1.2a und HDCP2.3. Ein HDMI2.0/eDP1.4-TX-Kombiinterface arbeitet jeweils nur in einer Betriebsart. eDP bietet x1/x2/x4 und 1.62/2.7/5.4Gbps. HDMI erreicht 4096x2160@60Hz mit RGB/YUV bis 10bit, DSC1.2a und HDCP2.3; eDP erreicht 4K@60Hz mit RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 Bit je Komponente und HDCP1.3. HDMI sollte CTA-861 folgen; nicht standardmäßige HSYNC/HBP/HFP sollten an 4 Pixeln ausgerichtet sein. Ein DP TX1.4a ist mit USB3.1 Gen1 kombiniert: 1/2/4 Lanes, 1.62/2.7/5.4/8.1Gbps, bis 7680x4320@30Hz, RGB/YUV bis 10bit, SST, Type-C DP Alt Mode, HDCP2.3/1.3. CTA-861 wird empfohlen; nicht standardmäßige HSYNC/HBP/HFP benötigen mindestens 16 Pixel. BT.1120 erreicht 1920x1080@60Hz und 150MHz.

## 1.2.10

Videoausgabeprozessor. Maximalwerte: Video Port0 7680x4320@60Hz; Port1 und Port2 je 4096x4320@60Hz; Port3 2048x1080@60Hz. Cluster0/1/2/3 unterstützen je 4096x4320 Ein-/Ausgang, AFBCD, RGB/YUV/YUYV, Skalierung 4–1/4 und Drehung. ESMART0/1/2/3 unterstützen je 4096x4320 Ein-/Ausgang, RGB/YUV/YUYV, Skalierung 8–1/8 und vier Bereiche. RGB-/YUV-Überlagerung kombiniert bis zu acht Ebenen (vier Cluster+vier ESMART). Nachverarbeitung: HDR10/HLG, HDR2SDR/SDR2HDR und 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Rückschreiben: ARGB8888/RGB888/RGB565/YUV420 bis 1920x1080. HACTIVE muss an 4 Pixeln ausgerichtet sein. Im Split-, MIPI-Doppelkanal- oder YUV420-Modus müssen POST HSYNC/HBP/HFP durch 2 teilbar sein. MIPI-DSC-Videomodus verlangt mindestens 16 Pixel für POST HSYNC/HBP/HFP und 8 Pixel für DSC_SYS_CTRL HSYNC/HBP/HFP.

## 1.2.11

Audioschnittstellen. I2S0 bietet bis zu 4 TX- oder 4 RX-Kanäle; I2S1 bis zu 8 TX- und 8 RX-Kanäle. Beide: 16–32 Bit, bis 192kHz, programmierbarer Master/Slave, I2S normal/links-/rechtsbündig, PCM early/late1/late2/late3 sowie TDM normal, Linksverschiebung um einen halben/einen/zwei Takte oder Rechtsverschiebung. I2S/PCM/TDM sind nicht gleichzeitig nutzbar. I2S2/I2S3 bieten je 2 TX und 2 RX, 16–32 Bit, bis 192kHz, Master/Slave und dieselben drei I2S-/vier PCM-Formate; I2S/PCM sind nicht gleichzeitig nutzbar. SPDIF0/1 speichern zwei 16-Bit-Werte in einem 32-Bit-Wort, geben Biphase-Stereo aus, richten 16–31-Bit-Daten links/rechts im 32-Bit-Puffer aus und unterstützen lineares PCM mit 16/20/24 Bit sowie nichtlineares PCM. PDM0/1: bis 8 Kanäle, 16–24 Bit, bis 192kHz, Master-Empfang. Der digitale Audiocodec besitzt zwei digitale DAC-Kanäle, I2S/PCM-Master/Slave, 16-Bit-Abtastung, drei Mischmodi je DAC und Lautstärkeregelung. VAD liest Sprache aus I2S/PDM, erkennt deren Amplitude, speichert Mikrofonarraydaten und unterstützt einen kombinierten Pegelinterrupt.

## 1.2.12

Verbindungen. SDIO unterstützt SDIO3.0 mit 4-Bit-Bus. Zwei GMACs unterstützen RGMII mit 10/100/1000Mbps und RMII mit 10/100Mbps, Voll-/Halbduplex. USB3.1 Gen1 entspricht USB3.2 Gen1 und USB3.0 und erreicht 5Gbps. Eine OTG-Schnittstelle USB3OTG_0 ist mit DP TX kombiniert; ein Host USB3OTG_2 mit PIPE PHY2. Kompatibilität: USB3.0 Revision1.0, USB2.0 außer USB3OTG_2 sowie xHCI1.1. Unterstützt werden Control-, Bulk- einschließlich Stream-, Interrupt- und isochrone Transfers sowie gleichzeitige IN/OUT-Übertragung. Deskriptorcache und Datenvorabruf verbessern Systeme mit hoher Latenz. Energiemanagement: USB2.0 LPM außer USB3OTG_2 und USB3.1 U0/U1/U2/U3. Gerätefunktionen: bis 10 IN- und 6 OUT-Endpunkte, jeweils einschließlich Control-Endpunkt0; bis 16 Transferressourcen, eine je Endpunkt; flexible Endpunktkonfiguration für Anwendungen/USB-set-configuration-Modi; ERDY/Burst in Hardware; Stream-Bulk-Endpunkte mit automatisch angestoßener Datenbewegung; isochrone Endpunkte mit Datenpuffern; flexible Deskriptoren für Pufferinterruptmoderation, Mehrfachtransfers, isochrone/Control-Transfers und verteilte Puffer. xHCI-Host: bis 64 Geräte, ein Interrupter, ein USB2.0-Port außer USB3OTG_2, ein SuperSpeed-Port, Standard-/Open-Source-xHCI- und Klassentreiber. DRD unterstützt feste Geräte-/Hostrollen und ID-basierte USB3.1/USB2.0-OTG-A/B-Rollen; USB3OTG_2 bietet nur USB3.1 Gen1. SRP/HNP/RSP werden nicht unterstützt. USB2.0-PHY bietet Batterieladeerkennung; USB3OTG_0 unterstützen Type-C/DP Alt Mode; USB3OTG_2 teilt seinen PHY mit PCIe/SATA. Zwei USB2.0-Hosts unterstützen USB2.0, High-/Full-/Low-Speed mit 480/12/1.5Mbps und EHCI1.0/OHCI1.0a. Drei Combo-PIPE-PHYs unterstützen PCIe2.1/SATA3.0/USB3.1: PHY0/1 wählen jeweils SATA oder PCIe2.1; PHY2 SATA, PCIe2.1 oder USB3.1 Gen1. Jede PCIe2.1-Schnittstelle besitzt eine Lane mit 5Gbps, entspricht PCI Express Base2.1 und unterstützt nur RC. SATA: je ein Port mit 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. PCIe3.0 entspricht Base3.0, unterstützt RC/EP, 2.5Gbps (1.1), 5Gbps (2.1), 8Gbps (3.0; Quelle schreibt 8Gps) und Bündelung/Aufteilung in 1x2 oder 2x1 Lanes. Es gibt fünf SPI-Controller (SPI0–SPI4). Zwei Chip-Select-Ausgänge und programmierbarer serieller Master/Slave werden unterstützt. Neun I2C-Master I2C0–I2C8 bieten 7/10-Bit-Adressen und programmierbaren Takt bis 100kbit/s im Standard- oder 400kbit/s im Fast-Modus. Zehn UARTs UART0–UART9 besitzen getrennte 64-Byte-TX/RX-FIFOs, 5/6/7/8-Bit-Senden/Empfangen, Start-/Stopp-/Paritätsbits, verschiedene Eingangstakte für bis 4Mbps und automatische Flusssteuerung für alle UARTs. Separates USB2.0 OTG unterstützt USB2.0 (Quelle schließt USB3OTG_2 aus), xHCI1.1, Control-/Bulk- inklusive Streams-/Interrupt-/isochrone Transfers, Deskriptorcache, Vorabruf und Ladeerkennung. Feste Geräte-/Hostrollen und ID-basierte OTG-A/B-Rollen ohne SRP/HNP/RSP; bis 10 IN- und 6 OUT-Endpunkte einschließlich Endpunkt0, 16 Transferressourcen und flexible Konfiguration; xHCI-Host für 64 Geräte, einen Interrupter und einen USB2.0-Port.

## 1.2.13

Weitere Funktionen. Mehrere GPIO-Gruppen bieten Interrupts an jedem GPIO, Pegel-/Flankenauslösung, konfigurierbare Pegelpolarität, steigende/fallende/beide Flanken, schwache Pull-up-/Pull-down-Wahl und Treiberstärke. TS-ADC unterstützt benutzerdefinierte und automatische Modi. Im benutzerdefinierten Modus wird start_of_conversion vollständig durch Software gesteuert oder durch Hardware erzeugt. Automatisch lassen sich Hoch-/Tieftemperatur-Interruptschwellen und die Systemresettemperatur konfigurieren. Sieben Kanäle besitzen eigene Temperaturkriterien; Bereich −40–125°C, Auflösung 1°C. SARADC: 12 Bit, bis 1MS/s, vier unsymmetrische Eingänge. OTP bietet 32Kbit; der obere 4k-Adressbereich ist nicht sicher (Quellenbezeichnung beibehalten). Der sichere Modus unterstützt Wortmasken für Lesen/Programmieren; maximal 32 Bit programmieren und 16 Wörter lesen; Lese-/Programmierstatus sind abfragbar, fehlgeschlagene Programmieradressen werden gespeichert. Gehäuse FCCSP766L: Körper 17mm x 19mm, Kugeldurchmesser 0.3mm, Raster 0.6mm & 0.65mm.

## 1.3 Blockdiagramm

![1-1. Blockdiagramm (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-1-1.png)

1-1. Blockdiagramm (englisches Original).

Die Grafik nennt zusätzlich 1MB gemeinsamen Speicher, sechs PVTM, zwei SPDIF mit 8ch, Systemregister und SRAM/ROM/OTP. Sie nennt sechs SPI und eDP1.3, der Text fünf SPI und eDP1.4; die Widersprüche bleiben sichtbar. SD3.0/MMC4.5 in der Grafik weicht von MMC4.51 im Text ab.

## 2. Gehäuse

### 2.1 Bestellung

RK3588C: RoHS, ED-FCCSP 17x19 766L, 840PCS je Tray, Anwendungsprozessor.

### 2.2 Markierung

Rockchip = Marke; RKXXXX = Chip; ABC = Auftragnehmercode; XXXXXX = Die-Charge; YYWW = Datum; NXXXXXX FXX = OSAT-Untercharge. Die Eckmarkierung bezeichnet den ersten Pin.

![2-1. Gehäusemarkierung (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-1.png)

2-1. Gehäusemarkierung (englisches Original).

![2-2. Gehäuseoberansicht (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-2.png)

2-2. Gehäuseoberansicht (englisches Original).

### 2.3 Maße

![2-3. Gehäuseunteransicht (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-3.png)

2-3. Gehäuseunteransicht (englisches Original).

![2-4. Gehäuseseitenansicht (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-4.png)

2-4. Gehäuseseitenansicht (englisches Original).

![2-5. Gehäuseabmessungen (englisches Original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-5.png)

2-5. Gehäuseabmessungen (englisches Original).

| Symbol | Minimum mm | Typisch mm | Maximum mm | Minimum Zoll | Typisch Zoll | Maximum Zoll |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.04 | 1.150 | 1.221 | 0.041 | 0.045 | 0.048 |
| A1 | 0.160 | 0.210 | 0.260 | 0.006 | 0.008 | 0.010 |
| A2 | 0.860 | 0.940 | 0.990 | 0.034 | 0.037 | 0.039 |
| A3 | 0.570 | 0.600 | 0.630 | 0.022 | 0.024 | 0.025 |
| c | 0.300 | 0.340 | 0.380 | 0.012 | 0.013 | 0.015 |
| D | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| E | 18.900 | 19.000 | 19.100 | 0.744 | 0.748 | 0.752 |
| D1 | — | 16.200 | — | — | 0.638 | — |
| E1 | — | 18.000 | — | — | 0.709 | — |
| e1 | — | 0.600 | — | — | 0.024 | — |
| e2 | — | 0.650 | — | — | 0.026 | — |
| b | 0.260 | 0.310 | 0.360 | 0.010 | 0.012 | 0.014 |

Ungeteilte Toleranzen (mm/inch): aaa 0.150/0.006; ccc 0.200/0.008; ddd 0.150/0.006; eee 0.150/0.006; fff 0.080/0.003. Typisch entspricht NOM.

### 2.4–2.5

Feuchtigkeitsempfindlichkeit MSL3; Anschluss-/Kugelmaterial SnAgCu.

### 2.6 Vollständige Pintabelle

| Pinname | Pin | Pinname | Pin |
| --- | --- | --- | --- |
| VSS_1 | A1 | RFU3 | F22 |
| DDR_CH1_DQ10_C | A2 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/GPIO1_D1 | F23 |
| DDR_CH1_DQ8_C | A3 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3 | F24 |
| DDR_CH1_DQ14_C | A4 | VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2 | F25 |
| DDR_CH1_DQ12_C | A5 | VSS_40 | F26 |
| DDR_CH1_DM0_C | A6 | PCIE30_PORT0_TX0N | F27 |
| DDR_CH1_DQ5_C | A7 | PCIE30_PORT0_TX0P | F28 |
| DDR_CH1_DQ0_C | A8 | VSS_39 | F21 |
| DDR_CH1_DQ2_C | A9 | DDR_CH0_DQ13_B | G1 |
| VSS_2 | A10 | DDR_CH0_DQ14_B | G2 |
| DDR_CH1_A2_D | A13 | VSS_41 | G3 |
| DDR_CH1_DQ2_D | A15 | DDR_CH0_DQS1N_B | G5 |
| DDR_CH1_DQ0_D | A16 | VSS_42 | G6 |
| DDR_CH1_DQ12_D | A17 | VSS_43 | G7 |
| DDR_CH1_DQ14_D | A18 | DDR_CH1_A2_C | G8 |
| DDR_CH1_DQ8_D | A19 | VSS_44 | G9 |
| DDR_CH1_DQ10_D | A20 | VSS_45 | G10 |
| DDR_CH1_DM0_D | A21 | DDR_CH1_A5_C | G11 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7 | A23 | VSS_46 | G12 |
| I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7 | A25 | VSS_47 | G13 |
| I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6 | A26 | DDR_CH1_A1_D | G14 |
| SPDIF0_TX_M0/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6 | A27 | VSS_48 | G15 |
| VSS_3 | A28 | VSS_49 | G16 |
| DDR_CH0_DQ9_A | AA1 | DDR_CH1_LP4/4X_CS0_D | G17 |
| DDR_CH0_DQ8_A | AA2 | VSS_50 | G18 |
| VSS_117 | AA3 | VSS_51 | G19 |
| VSS_118 | AA4 | DDR_CH1_DQ6_D | G20 |
| DDR_CH0_DQ13_A | AA5 | RFU1 | G21 |
| DDR_CH0_DQ12_A | AA6 | RFU4 | G22 |
| VSS_119 | AA7 | VSS_52 | G23 |
| VSS_120 | AA8 | VSS_53 | G24 |
| VSS_121 | AA21 | VSS_54 | G25 |
| VCCIO5_1V8 | AA22 | VSS_55 | G26 |
| GMAC1_MDC/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2 | AA23 | PCIE30_PORT0_RX1N | G27 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3 | AA24 | PCIE30_PORT0_RX1P | G28 |
| EMMC_CLKOUT/GPIO2_A1 | AA25 | DDR_CH0_DQ7_B | H1 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3 | AA26 | DDR_CH0_DQ12_B | H2 |
| EMMC_D7/FSPI_CS1N_M0/GPIO2_D7 | AA27 | VSS_56 | H3 |
| I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5 | AA28 | DDR_CH0_DQS0P_B | H4 |
| DDR_CH0_DM1_A | AB1 | DDR_CH0_DQS0N_B | H5 |
| DDR_CH0_DQ11_A | AB2 | VSS_57 | H6 |
| VSS_122 | AB3 | VSS_58 | H7 |
| VSS_123 | AB5 | DDR_CH1_ZQ_C | H8 |
| AVSS_2 | AB8 | VSS_59 | H9 |
| VCCIO3_1V8 | AB21 | VSS_60 | H10 |
| EMMC_D6/FSPI_CS0N_M0/GPIO2_D6 | AB26 | VSS_61 | H11 |
| EMMC_D2/FSPI_D2_M0/GPIO2_D2 | AB27 | VSS_62 | H12 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | H13 |
| VSS_124 | AC2 | VSS_64 | H14 |
| VSS_125 | AC3 | VSS_65 | H15 |
| DDR_CH0_DQS1N_A | AC4 | VSS_66 | H16 |
| DDR_CH0_DQS1P_A | AC5 | VSS_67 | H17 |
| VSS_126 | AC6 | VSS_68 | H18 |
| AVSS_3 | AC7 | DDR_CH1_ZQ_D | H19 |
| HDMI_TX0_VDD_0V75 | AC8 | VSS_69 | H20 |
| VCCIO6_1V8 | AC21 | VSS_70 | H21 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3 | AC22 | VSS_71 | H22 |
| EMMC_CMD/FSPI_CLK_M0/GPIO2_A0 | AC23 | VSS_72 | H23 |
| VSS_127 | AC24 | PCIE30_PORT0_REF_CLKP | H24 |
| EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2 | AC25 | PCIE30_PORT0_REF_CLKN | H25 |
| EMMC_D1/FSPI_D1_M0/GPIO2_D1 | AC26 | VSS_73 | H26 |
| EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4 | AC27 | PCIE30_PORT0_RX0N | H27 |
| EMMC_D0/FSPI_D0_M0/GPIO2_D0 | AC28 | PCIE30_PORT0_RX0P | H28 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0 | AD2 | DDR_CH0_DQ1_B | J1 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1 | AD3 | DDR_CH0_DQ0_B | J2 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4 | AD4 | DDR_CH0_DQ2_B | J3 |
| VSS_128 | AD5 | VSS_74 | J4 |
| VSS_129 | AD6 | DDR_CH0_LP4/4X_CS0_B | J5 |
| AVSS_4 | AD7 | VSS_75 | J6 |
| HDMI_TX0_VDD_IO_1V8 | AD8 | DDR_CH0_ZQ_B | J7 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | J8 |
| HDMI/eDP_TX1_AVDD_0V75 | AD10 | VSS_77 | J21 |
| VSS_130 | AD11 | PCIE30_PORT0_RESREF | J22 |
| VSS_131 | AD12 | AVSS1_1 | J23 |
| VDD_GPU_9 | AD13 | PCIE20_2_REFCLKP | J24 |
| VDD_GPU_10 | AD14 | PCIE20_2_REFCLKN | J25 |
| VSS_132 | AD15 | AVSS1_2 | J26 |
| VSS_133 | AD16 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | J27 |
| VSS_134 | AD17 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | J28 |
| VSS_135 | AD18 | DDR_CH0_DQ3_B | K2 |
| VSS_136 | AD19 | VSS_78 | K3 |
| VSS_137 | AD20 | VSS_79 | K5 |
| VSS_138 | AD21 | VSS_80 | K7 |
| VSS_139 | AD22 | DDR_CH01_VDDQ_CKE | K8 |
| VSS_140 | AD23 | VSS_81 | K21 |
| RFU8 | AD24 | PCIE30_PORT0_AVDD0V75 | K22 |
| GMAC0_TXD2/SDIO_D3_M0/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1 | AD25 | AVSS1_3 | K23 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3 | AD26 | AVSS1_4 | K24 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5 | AD27 | AVSS1_5 | K25 |
| HDMI_TX0_D3N | AE1 | AVSS1_6 | K26 |
| AVSS_5 | AE2 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | K27 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5 | AE3 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | K28 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3 | AE4 | DDR_CH0_CKB_B | L1 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2 | AE5 | DDR_CH0_CK_B | L2 |
| AVSS_6 | AE6 | VSS_82 | L3 |
| AVSS_7 | AE7 | DDR_CH0_A3_B | L4 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AE8 | DDR_CH0_A2_B | L5 |
| HDMI_TX0_VDD_CMN_1V8 | AE10 | VSS_83 | L6 |
| VSS_141 | AE11 | DDR_CH0_LP4/4X_CS1_B | L7 |
| VSS_142 | AE12 | VSS_84 | L8 |
| VSS_143 | AE13 | PCIE30_PORT0_AVDD1V8 | L21 |
| VSS_144 | AE14 | PCIE20_SATA30_USB30_2_AVDD_0V85 | L22 |
| VSS_145 | AE15 | AVSS1_7 | L23 |
| VSS_146 | AE16 | PCIE20_1_REFCLKP | L24 |
| VDD_LOGIC_10 | AE17 | PCIE20_1_REFCLKN | L25 |
| VDD_LOGIC_11 | AE18 | AVSS1_8 | L26 |
| VDD_LOGIC_12 | AE19 | PCIE20_1_RXP/SATA30_1_RXP | L27 |
| VDD_LOGIC_13 | AE20 | PCIE20_1_RXN/SATA30_1_RXN | L28 |
| VSS_147 | AE21 | DDR_CH0_CKB_A | M1 |
| VSS_148 | AE22 | DDR_CH0_CK_A | M2 |
| RFU7 | AE23 | VSS_85 | M3 |
| GMAC0_RXD2/SDIO_D0_M0/UART6_RX_M0/GPIO2_A6 | AE24 | VSS_86 | M4 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2 | AE25 | DDR_CH0_A1_B | M5 |
| LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3 | AE26 | DDR_CH0_A0_B | M6 |
| I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/SATA_CPDET/GPIO0_D4 | AE27 | VSS_87 | M7 |
| I2S1_LRCK0_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7 | AE28 | VSS_88 | M8 |
| AVSS_8 | AF1 | PCIE20_SATA30_1_AVDD_1V8 | M21 |
| HDMI_TX0_D3P | AF2 | PCIE20_SATA30_1_AVDD_0V85 | M22 |
| AVSS_9 | AF3 | AVSS1_9 | M23 |
| AVSS_10 | AF4 | PCIE20_0_REFCLKP | M24 |
| AVSS_11 | AF5 | PCIE20_0_REFCLKN | M25 |
| AVSS_12 | AF6 | AVSS1_10 | M26 |
| AVSS_13 | AF7 | PCIE20_1_TXN/SATA30_1_TXN | M27 |
| AVSS_14 | AF8 | PCIE20_1_TXP/SATA30_1_TXP | M28 |
| AVSS_15 | AF9 | DDR_CH0_A4_A | N2 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AF10 | DDR_CH0_A5_A | N3 |
| USB20_AVDD_3V3 | AF11 | VSS_89 | N5 |
| AVSS_16 | AF12 | VSS_90 | N7 |
| AVSS_17 | AF13 | VSS_91 | N8 |
| AVSS_18 | AF14 | PCIE20_SATA30_0_AVDD_1V8 | N21 |
| TYPEC0_DP0_VDDH_1V8 | AF15 | PCIE20_SATA30_0_AVDD_0V85 | N22 |
| SARADC_AVDD_1V8 | AF17 | TVSS | N23 |
| VSS_149 | AF18 | AVSS1_11 | N24 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3 | AF20 | AVSS1_12 | N25 |
| VCCIO6 | AF21 | AVSS1_13 | N26 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4 | AF22 | PCIE20_0_TXP/SATA30_0_TXP | N27 |
| SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1 | AF23 | PCIE20_0_TXN/SATA30_0_TXN | N28 |
| GMAC0_RXCLK/SDIO_D2_M0/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0 | AF24 | VSS_92 | P2 |
| CIF_D15/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3 | AF25 | DDR_CH0_DQ3_A | P3 |
| I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7 | AF26 | DDR_CH0_A4_B | P4 |
| I2S1_LRCK1_M1/PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4 | AF27 | DDR_CH0_A5_B | P5 |
| HDMI_TX0_D0P | AG1 | VSS_93 | P6 |
| HDMI_TX0_D0N | AG2 | DDR_CH0_LP4/4X_CKE0_B | P7 |
| AVSS_19 | AG3 | VSS_94 | P8 |
| HDMI_TX0_REXT | AG4 | OSC_1V8 | P21 |
| HDMI_TX1_SBDN/EDP_TX1_AUXN | AG5 | VSS_95 | P22 |
| USB20_HOST0_REXT | AG6 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1 | P23 |
| AVSS_20 | AG7 | PMIC_SLEEP1/GPIO0_A2 | P24 |
| USB20_HOST0_DP | AG8 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6 | P25 |
| USB20_AVDD_1V8 | AG9 | AVSS1_14 | P26 |
| USB20_DVDD_0V75 | AG10 | PCIE20_0_RXN/SATA30_0_RXN | P27 |
| TYPEC0_USB20_VBUSDET | AG11 | PCIE20_0_RXP/SATA30_0_RXP | P28 |
| TYPEC0_USB20_OTG_ID | AG12 | DDR_CH0_DQ2_A | R1 |
| TYPEC0_DP0_VDD_0V85 | AG14 | DDR_CH0_DQ1_A | R2 |
| TYPEC0_DP0_VDDA_0V85 | AG15 | DDR_CH0_DQ5_A | R3 |
| AVSS_21 | AG17 | VSS_96 | R4 |
| BT1120_D11/PCIE30X4_WAKEN_M1/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5 | AG18 | DDR_CH0_LP4/4X_CKE1_A | R5 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0 | AG20 | DDR_CH0_LP4/4X_CKE1_B | R6 |
| BT1120_D12/PCIE30X4_PERSTN_M1/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6 | AG21 | VSS_97 | R7 |
| RFU6 | AG22 | VSS_98 | R8 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2 | AG23 | PMU_0V75 | R21 |
| GMAC0_TXCLK/SDIO_CLK_M0/I2C3_SDA_M3/GPIO2_B3 | AG24 | PMUIO2 | R22 |
| RFU5 | AG25 | PMIC_INT_L/GPIO0_A7 | R23 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0 | AG26 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3 | R24 |
| I2S1_SCLK0_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6 | AG27 | SDMMC_DET/GPIO0_A4 | R25 |
| I2S1_SCLK1_M1/PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0 | AG28 | VSS_99 | R26 |
| HDMI_TX0_D1P | AH1 | XOUT_24M | R27 |
| HDMI_TX0_D1N | AH2 | XIN_24M | R28 |
| AVSS_22 | AH3 | DDR_CH0_DQ4_A | T2 |
| HDMI/eDP_TX1_REXT | AH4 | VSS_100 | T3 |
| HDMI_TX1_SBDP/EDP_TX1_AUXP | AH5 | VSS_101 | T5 |
| USB20_HOST1_REXT | AH6 | VSS_102 | T7 |
| USB20_HOST0_DM | AH8 | VSS_103 | T8 |
| USB20_OTG1_REXT | AH9 | PMUIO1_1V8 | T21 |
| TYPEC0_USB20_OTG0_REXT | AH11 | REFCLK_OUT/GPIO0_A0 | T27 |
| TYPEC0_DP0_REXT | AH12 | DDR_CH0_DQS0N_A | U1 |
| SARADC_IN1 | AH14 | DDR_CH0_DQS0P_A | U2 |
| SARADC_IN3 | AH15 | VSS_104 | U3 |
| SARADC_IN2 | AH17 | DDR_CH0_LP4/4X_CKE0_A | U4 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4 | AH18 | DDR_CH0_A3_A | U5 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0 | AH20 | VSS_105 | U6 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1 | AH21 | DDR_CH0_A1_A | U7 |
| VSS_150 | AH22 | VSS_106 | U8 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0 | AH23 | PMUIO2_1V8 | U21 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1 | AH24 | VSS_107 | U22 |
| CIF_D14/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2 | AH25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/SPI3_MOSI_M2/HDMI_TX1_CEC_M1/GPIO0_D2 | U23 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4 | AH26 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0 | U24 |
| PMIC_SLEEP_3/GPIO0_C1 | AH27 | PMIC_SLEEP_5/GPIO0_C3 | U25 |
| HDMI_TX0_D2P | AJ1 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1 | U26 |
| HDMI_TX0_D2N | AJ2 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0 | U27 |
| AVSS_23 | AJ3 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5 | U28 |
| AVSS_24 | AJ4 | DDR_CH0_DQ0_A | V2 |
| AVSS_25 | AJ5 | DDR_CH0_DM0_A | V3 |
| AVSS_26 | AJ6 | VSS_108 | V4 |
| AVSS_27 | AJ7 | DDR_CH0_LP4/4X_CS1_A | V5 |
| AVSS_28 | AJ8 | DDR_CH0_LP4/4X_CS0_A | V6 |
| AVSS_29 | AJ9 | DDR_CH0_RESET_A | V7 |
| AVSS_30 | AJ10 | VSS_109 | V8 |
| AVSS_31 | AJ11 | VSS_110 | V21 |
| AVSS_32 | AJ12 | EMMCIO_1V8 | V22 |
| AVSS_33 | AJ14 | GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0 | V23 |
| SARADC_IN0_BOOT | AJ15 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6 | V24 |
| VSS_151 | AJ17 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6 | V25 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7 | AJ18 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5 | V26 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6 | AJ19 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2 | V27 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2 | AJ20 | DDR_CH0_DQ7_A | W1 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1 | AJ21 | DDR_CH0_DQ6_A | W2 |
| GMAC0_RXD3/SDIO_D1_M0/UART6_TX_M0/GPIO2_A7 | AJ22 | VSS_111 | W3 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2 | AJ23 | VSS_112 | W5 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7 | AJ24 | DDR_CH0_ZQ_A | W8 |
| GMAC1_PPSCLK/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1 | AJ25 | VSS_113 | W21 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7 | AJ26 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5 | W26 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2 | AJ27 | PMIC_SLEEP2/GPIO0_A3 | W27 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1 | AJ28 | NPOR | W28 |
| HDMI_TX1_D3N/EDP_TX1_D3N | AK1 | DDR_CH0_DQ14_A | Y1 |
| HDMI_TX1_D3P/EDP_TX1_D3P | AK2 | DDR_CH0_DQ15_A | Y2 |
| HDMI_TX1_D0P/EDP_TX1_D0P | AK3 | VSS_114 | Y3 |
| HDMI_TX1_D1P/EDP_TX1_D1P | AK4 | DDR_CH0_A2_A | Y4 |
| HDMI_TX1_D2P/EDP_TX1_D2P | AK5 | DDR_CH0_A0_A | Y5 |
| USB20_HOST1_DM | AK6 | VSS_115 | Y6 |
| USB20_OTG1_DM | AK7 | VSS_116 | Y7 |
| TYPEC0_USB20_OTG_DM | AK8 | VCCIO2_1V8 | Y8 |
| TYPEC0_SSRX1N/DP0_TX0N | AK9 | VCCIO5 | Y21 |
| TYPEC0_SSTX1P/DP0_TX1P | AK10 | CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4 | Y22 |
| TYPEC0_SBU1/DP0_AUXP | AK11 | GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6 | Y23 |
| TYPEC0_SSRX2N/DP0_TX2N | AK12 | GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3 | Y24 |
| TYPEC0_SSTX2P/DP0_TX3P | AK13 | ETH1_REFCLKO_25M/I2C4_SCL_M0/GPIO3_A6 | Y25 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5 | AK14 | PMIC_SLEEP_4/GPIO0_C2 | Y26 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4 | AK15 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/SPI0_CS0_M0/HDMI_TX0_CEC_M1/GPIO0_D1 | Y27 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3 | AK16 | DDR_CH0_VDDQ_0 | 1E1 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7 | AK17 | DDR_CH01_PLL_AVDD1V8 | 1E2 |
| GMAC0_RXDV_CRS/PWM2_M2/GPIO4_C2 | AK18 | VSS_175 | 1E3 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/GPIO4_C3 | AK19 | DDR_CH1_VDD_5 | 1E4 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7 | AK20 | VDD_LOGIC_0 | 1E5 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5 | AK21 | VSS_176 | 1E6 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1 | AK22 | VDD_CPU_BIG_3 | 1E7 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5 | AK23 | VDD_CPU_BIG_4 | 1E8 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6 | AK24 | VDD_CPU_BIG_5 | 1E9 |
| GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0 | AK25 | VDD_CPU_BIG_6 | 1E10 |
| GMAC1_RXD1/PWM9_M0/GPIO3_B0 | AK26 | PLL_AVDD1V8 | 1E11 |
| GMAC1_RXCLK/SDIO_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5 | AK27 | VSS_153 | 1A1 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4 | AK28 | VSS_154 | 1A2 |
| AVSS_34 | AL1 | VSS_155 | 1A3 |
| HDMI_TX1_D0N/EDP_TX1_D0N | AL2 | VSS_156 | 1A4 |
| HDMI_TX1_D1N/EDP_TX1_D1N | AL3 | VSS_157 | 1A5 |
| HDMI_TX1_D2N/EDP_TX1_D2N | AL4 | VSS_158 | 1A6 |
| AVSS_35 | AL5 | VSS_159 | 1A7 |
| USB20_HOST1_DP | AL6 | VSS_160 | 1A8 |
| USB20_OTG1_DP | AL7 | VSS_161 | 1A9 |
| TYPEC0_USB20_OTG_DP | AL8 | VSS_162 | 1A10 |
| TYPEC0_SSRX1P/DP0_TX0P | AL9 | VSS_163 | 1A11 |
| TYPEC0_SSTX1N/DP0_TX1N | AL10 | VSS_164 | 1B1 |
| TYPEC0_SBU2/DP0_AUXN | AL11 | DDR_CH1_VDDQ_0 | 1B2 |
| TYPEC0_SSRX2P/DP0_TX2P | AL12 | DDR_CH1_VDDQ_1 | 1B3 |
| TYPEC0_SSTX2N/DP0_TX3N | AL13 | DDR_CH1_VDDQ_2 | 1B4 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0 | AL14 | DDR_CH1_VDDQ_3 | 1B5 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6 | AL15 | DDR_CH1_VDDQ_4 | 1B6 |
| GMAC0_MDIO/UART9_CTSN_M0/PWM6_M2/GPIO4_C5 | AL16 | DDR_CH01_PLL_AVSS_2 | 1B7 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/GPIO4_C4 | AL18 | VSS_165 | 1B8 |
| HDMI_TX0_HPD_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4 | AL20 | VCCIO4 | 1B9 |
| GMAC1_MDIO/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3 | AL21 | VCCIO4_1V8 | 1B10 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5 | AL23 | VCCIO1_1V8 | 1B11 |
| GMAC1_RXDV_CRS/UART2_TX_M2/PWM2_M1/GPIO3_B1 | AL25 | VSS_166 | 1C1 |
| GMAC1_RXD0/PWM8_M0/GPIO3_A7 | AL26 | DDR_CH01_PLL_DVDD | 1C2 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2 | AL27 | DDR_CH1_VDD_0 | 1C3 |
| VSS_152 | AL28 | DDR_CH1_VDD_1 | 1C4 |
| DDR_CH0_DM0_B | B1 | DDR_CH1_VDD_2 | 1C5 |
| DDR_CH1_DQ11_C | B2 | DDR_CH1_VDD_3 | 1C6 |
| DDR_CH1_DQ9_C | B3 | DDR_CH1_VDDQ_CK | 1C7 |
| DDR_CH1_DQ15_C | B4 | VSS_167 | 1C8 |
| DDR_CH1_DQ13_C | B5 | VSS_168 | 1C9 |
| DDR_CH1_DQ7_C | B6 | VSS_169 | 1C10 |
| DDR_CH1_DQ6_C | B7 | VSS_170 | 1C11 |
| DDR_CH1_DQ4_C | B8 | DDR_CH0_VDDQ_CK | 1D1 |
| DDR_CH1_DQ3_C | B9 | DDR_CH01_PLL_AVSS_1 | 1D2 |
| DDR_CH1_CK_C | B10 | VSS_171 | 1D3 |
| VSS_4 | B11 | DDR_CH1_VDD_4 | 1D4 |
| DDR_CH1_CK_D | B12 | VSS_172 | 1D5 |
| DDR_CH1_A3_D | B13 | VSS_173 | 1D6 |
| DDR_CH1_A4_D | B14 | VSS_174 | 1D7 |
| DDR_CH1_DQ3_D | B15 | VDD_CPU_BIG_0 | 1D8 |
| DDR_CH1_DQ1_D | B16 | VDD_CPU_BIG_1 | 1D9 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_BIG_2 | 1D10 |
| DDR_CH1_DQ13_D | B18 | PCIE20_SATA30_USB30_2_AVDD_1V8 | 1D11 |
| DDR_CH1_DQ15_D | B19 | DDR_CH0_VDDQ_1 | 1F1 |
| DDR_CH1_DQ9_D | B20 | DDR_CH0_VDD_0 | 1F2 |
| DDR_CH1_DQ11_D | B21 | DDR_CH0_VDD_1 | 1F3 |
| VSS_5 | B22 | VSS_177 | 1F4 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4 | B23 | VDD_LOGIC_1 | 1F5 |
| PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4 | B24 | VSS_178 | 1F6 |
| SPDIF1_TX_M0/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7 | B25 | VDD_CPU_BIG_7 | 1F7 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6 | B26 | VDD_CPU_BIG_8 | 1F8 |
| PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2 | B27 | VDD_CPU_BIG_9 | 1F9 |
| PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1 | B28 | VDD_CPU_BIG_10 | 1F10 |
| DDR_CH0_DQ5_B | C1 | PLL_AVSS | 1F11 |
| DDR_CH0_DQ6_B | C2 | DDR_CH0_VDDQ_2 | 1G1 |
| VSS_6 | C3 | DDR_CH0_VDD_2 | 1G2 |
| VSS_7 | C4 | DDR_CH0_VDD_3 | 1G3 |
| VSS_8 | C5 | VSS_179 | 1G4 |
| VSS_9 | C6 | VDD_LOGIC_2 | 1G5 |
| VSS_10 | C7 | VSS_180 | 1G6 |
| VSS_11 | C8 | VSS_181 | 1G7 |
| DDR_CH1_DQ1_C | C9 | VSS_182 | 1G8 |
| DDR_CH1_CKB_C | C10 | VSS_183 | 1G9 |
| VSS_12 | C11 | VSS_184 | 1G10 |
| DDR_CH1_CKB_D | C12 | PLL_DVDD0V75 | 1G11 |
| DDR_CH1_A5_D | C13 | DDR_CH0_VDDQ_3 | 1H1 |
| VSS_13 | C14 | DDR_CH0_VDD_4 | 1H2 |
| VSS_14 | C15 | VSS_185 | 1H3 |
| VSS_15 | C17 | VSS_186 | 1H4 |
| VSS_16 | C18 | VDD_LOGIC_3 | 1H5 |
| VSS_17 | C20 | VSS_187 | 1H6 |
| DDR_CH1_DM1_D | C21 | VSS_188 | 1H7 |
| PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5 | C22 | VDD_CPU_LIT_0 | 1H8 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0 | C23 | VDD_CPU_LIT_1 | 1H9 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0 | C24 | VSS_189 | 1H10 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5 | C25 | VSS_190 | 1H11 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3 | C26 | DDR_CH0_VDDQ_4 | 1J1 |
| I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7 | C27 | DDR_CH0_VDD_5 | 1J2 |
| PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6 | C28 | VSS_191 | 1J3 |
| DDR_CH0_DQ11_B | D1 | VDD_LOGIC_4 | 1J4 |
| DDR_CH0_DQ4_B | D2 | VDD_LOGIC_5 | 1J5 |
| VSS_18 | D3 | VSS_192 | 1J6 |
| DDR_CH1_DM1_C | D5 | VDD_CPU_LIT_2 | 1J7 |
| DDR_CH1_DQS1N_C | D6 | VDD_CPU_LIT_3 | 1J8 |
| DDR_CH1_DQS0N_C | D8 | VDD_CPU_LIT_4 | 1J9 |
| VSS_19 | D9 | VDD_CPU_LIT_5 | 1J10 |
| DDR_CH1_LP4/4X_CS1_C | D11 | VSS_193 | 1J11 |
| VSS_20 | D12 | VSS_194 | 1K1 |
| DDR_CH1_LP4/4X_CKE0_C | D14 | VSS_195 | 1K2 |
| VSS_21 | D15 | VSS_196 | 1K3 |
| DDR_CH1_A0_D | D17 | VDD_LOGIC_6 | 1K4 |
| VSS_22 | D18 | VDD_LOGIC_7 | 1K5 |
| DDR_CH1_DQS0N_D | D20 | VDD_LOGIC_8 | 1K6 |
| DDR_CH1_DQS1N_D | D21 | VSS_197 | 1K7 |
| RFU0 | D22 | VSS_198 | 1K8 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1 | D23 | VSS_199 | 1K9 |
| I2S0_LRCK/UART4_RTSN/GPIO1_C5 | D24 | VSS_200 | 1K10 |
| I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0 | D25 | VSS_201 | 1K11 |
| I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3 | D26 | VCCIO2 | 1L1 |
| VSS_23 | D27 | VSS_202 | 1L2 |
| DDR_CH0_DQ9_B | E1 | VSS_203 | 1L3 |
| DDR_CH0_DQ10_B | E2 | VSS_204 | 1L4 |
| VSS_24 | E3 | VSS_205 | 1L5 |
| DDR_CH0_DM1_B | E4 | VDD_LOGIC_9 | 1L6 |
| DDR_CH1_DQS1P_C | E6 | VSS_206 | 1L7 |
| VSS_25 | E7 | VSS_207 | 1L8 |
| DDR_CH1_DQS0P_C | E8 | VDD_NPU_0 | 1L9 |
| DDR_CH1_A3_C | E9 | VDD_NPU_1 | 1L10 |
| VSS_26 | E10 | VSS_208 | 1L11 |
| DDR_CH1_LP4/4X_CS0_C | E11 | OTP_VDDOTP_0V75 | 1M1 |
| DDR_CH1_A1_C | E12 | VSS_209 | 1M2 |
| VSS_27 | E13 | VDD_GPU_0 | 1M3 |
| DDR_CH1_LP4/4X_CKE1_C | E14 | VDD_GPU_1 | 1M4 |
| DDR_CH1_LP4/4X_CKE0_D | E15 | VDD_GPU_2 | 1M5 |
| VSS_28 | E16 | VSS_210 | 1M6 |
| DDR_CH1_LP4/4X_CS1_D | E17 | VSS_211 | 1M7 |
| DDR_CH1_DQ5_D | E18 | VSS_212 | 1M8 |
| VSS_29 | E19 | VDD_NPU_2 | 1M9 |
| DDR_CH1_DQS0P_D | E20 | VDD_NPU_3 | 1M10 |
| DDR_CH1_DQS1P_D | E21 | VSS_213 | 1M11 |
| RFU2 | E22 | VSS_214 | 1N1 |
| I2S0_SDI0/GPIO1_D4 | E23 | VSS_215 | 1N2 |
| I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1 | E24 | VSS_216 | 1N3 |
| I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2 | E25 | VDD_GPU_3 | 1N4 |
| VSS_30 | E26 | VDD_GPU_4 | 1N5 |
| PCIE30_PORT0_TX1N | E27 | VDD_GPU_5 | 1N6 |
| PCIE30_PORT0_TX1P | E28 | VSS_217 | 1N7 |
| DDR_CH0_DQ15_B | F1 | VSS_218 | 1N8 |
| DDR_CH0_DQ8_B | F2 | VDD_NPU_4 | 1N9 |
| VSS_31 | F3 | VDD_NPU_5 | 1N10 |
| VSS_32 | F4 | VSS_219 | 1N11 |
| DDR_CH0_DQS1P_B | F5 | HDMI_TX0_AVDD_0V75 | 1P1 |
| VSS_33 | F7 | AVSS_1 | 1P2 |
| VSS_34 | F8 | VSS_220 | 1P3 |
| DDR_CH1_A4_C | F9 | VDD_GPU_6 | 1P4 |
| VSS_35 | F11 | VDD_GPU_7 | 1P5 |
| DDR_CH1_A0_C | F12 | VDD_GPU_8 | 1P6 |
| VSS_36 | F14 | VSS_221 | 1P7 |
| DDR_CH1_LP4/4X_CKE1_D | F15 | VSS_222 | 1P8 |
| VSS_37 | F17 | VSS_223 | 1P9 |
| DDR_CH1_DQ4_D | F18 | VSS_224 | 1P10 |
| VSS_38 | F20 | VSS_225 | 1P11 |

## 3. Elektrische Daten

### 3.1 Absolute Grenzwerte

Über-/Unterschreiten kann dauerhaft schädigen; längerer Betrieb an absoluten Maximalwerten mindert die Zuverlässigkeit. Dies sind keine empfohlenen Betriebsgrenzen.

| Parameter | Versorgungsgruppe | Minimum | Maximum | Einheit |
| --- | --- | --- | --- | --- |
| Versorgung CPU | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Versorgung CPU-Speicher | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Versorgung GPU | VDD_GPU | -0.3 | 1.1 | V |
| Versorgung GPU-Speicher | VDD_GPU | -0.3 | 1.1 | V |
| Versorgung NPU | VDD_NPU | -0.3 | 1.1 | V |
| Versorgung NPU-Speicher | VDD_NPU | -0.3 | 1.1 | V |
| Versorgung Kernlogik, VCODEC und dessen Speicher | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V Versorgungsspannung | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI_TX0_VDD_0V75 HDMI_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 PCIE30_PORT0_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V Versorgungsspannung | DDR_CH0_VDD DDR_CH1_VDD DDR_CH01_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.8V Versorgungsspannung | DDR_CH01_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 HDMI_TX0_VDD_CMN_1V8 HDMI_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V Versorgungsspannung | USB20_AVDD_3V3 | -0.5 | 3.63 | V |
| GPIO-Versorgung nur 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| GPIO-Versorgung 1.8V/3.3V | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Versorgung DDR IO (LPDDR4/4X 0.6V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Versorgung DDR IO (LPDDR4/4X 1.1V) | DDR_CH01_VDDQ_CKE | -0.3 | 1.25 | V |
| Lagertemperatur | Tstg | -40 | 125 | ℃ |
| Maximale Sperrschichttemperatur (Quelle: Conjunction) | Tj | NA | 125 | ℃ |

### 3.2 Empfohlene Bedingungen

| Parameter | Symbol | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- |
| Spannung CPU-BigCore 0/1 und Speicher | VDD_CPU_BIG | 0.75 | 0.75 | 0.95 | V |
| Spannung CPU-LitCore, DSU und deren Speicher | VDD_CPU_LIT | 0.75 | 0.75 | 0.95 | V |
| Spannung GPU und Speicher | VDD_GPU | 0.75 | 0.75 | 0.85 | V |
| Spannung NPU und Speicher | VDD_NPU | 0.75 | 0.75 | 0.85 | V |
| Spannung Logik, VCODEC und dessen Speicher | VDD_LOGIC | 0.675 | 0.75 | 0.825 | V |
| PMU-Spannung | PMU_0V75 | 0.675 | 0.75 | 0.825 | V |
| Digitale GPIO-Versorgung (1.8V nur) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.95 | V |
| Digitale GPIO-Versorgung (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Versorgung eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Logikversorgung(0.85V) | DDR_CH0_VDD, DDR_CH1_VDD, | 0.675 | 0.85 | 0.935 | V |
| DDR CH01_PLL Versorgung(0.85V) | DDR_CH01_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
| DDR CH01_PLL Versorgung(1.8V) | DDR_CH01_PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| LPDDR4 IO-VDDQ-Versorgung | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 IO-VDDQ-Retention-Versorgung | DDR_CH01_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| PLL Analogversorgung(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Analogversorgung(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB 2.0 Analogversorgung (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Analogversorgung (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB 2.0 Analogversorgung (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Analogversorgung (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Analogversorgung (1.8V) | TYPEC0_DP0_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Analogversorgung(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Analogversorgung(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| PCIe30 Analogversorgung(0.75V) | PCIE30_PORT0_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Analogversorgung(1.8V) | PCIE30_PORT0_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI/eDP TX Digitalversorgung (0.75V) | HDMI_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (0.75V) | HDMI_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Analogversorgung (1.8V) | HDMI_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Analogversorgung(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Analogversorgung(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Analogversorgung(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| OSC-Eingangstakt |  | NA | 24 | NA | MHz |
| Maximale CPU-Frequenz |  | NA | NA | 2.2-2.4 | GHz |
| Maximale GPU-Frequenz |  | NA | NA | 1000 | MHz |
| Maximale NPU-Frequenz |  | NA | NA | 1000 | MHz |
| Umgebungsbetriebstemperatur | TA | 0 | NA | 80 | ℃ |

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

VDDO und DVDD sind IO-Versorgungen. Negative Pull-up-Ströme behalten ihre MIN/MAX-Position. GPIO-Werte nennen zuerst 3.3V, dann 1.8V.

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

### 3.7 SARADC

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Auflösung |  |  | NA | 12 | NA | Bit |
| Analoger Eingangsbereich (Quelle: Anglog) | AIN |  | AVSS18 | NA | AVDD18 | V |
| Differenzielle Nichtlinearität | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±1.0 | ±3.0 | LSB |
| Integrale Nichtlinearität | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±2.0 | ±6.0 | LSB |
| Oberer Spannungsoffsetfehler | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±10 | ±20 | LSB |
| Unterer Spannungsoffsetfehler | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz Rampensignal | NA | ±10 | ±20 | LSB |

### 3.8 TSADC

| Parameter | Symbol | Prüfbedingung | Minimum | Typisch | Maximum | Einheit |
| --- | --- | --- | --- | --- | --- | --- |
| Genauigkeit von −40°C bis 125°C | TJACC | Temperatur: -40 ~ 125℃ Versorgung: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Temperaturmessbereich | TRANGE |  | -40 | NA | 125 | ℃ |
| Auflösung | TLSB |  | NA | 1 | NA | ℃ |

## 4. Wärmemanagement

Für zuverlässigen Betrieb muss die Sperrschichttemperatur unter 125°C bleiben. Die Werte sind Simulationsergebnisse; reale Tests sind maßgeblich. Referenzplatine: JEDEC 2S2P, 114.3mm x 76.2mm x 1.6mm, Umgebung 25°C.

| Parameter | Symbol | Typisch | Einheit |
| --- | --- | --- | --- |
| Wärmewiderstand Sperrschicht–Umgebung | 𝜽 𝑱𝑨 | 15.6 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Platine | 𝜽 𝑱𝑩 | 4.6 | (℃/𝑾) |
| Wärmewiderstand Sperrschicht–Gehäuse | 𝜽 𝑱𝑪 | 0.03 | (℃/𝑾) |

## Quellenhinweise

Der VOP-Text enthält MIPI-Doppelkanal-/DSC-Timing, obwohl diese Variante keine MIPI-Displayschnittstelle nennt; dies ist ein Quellenwiderspruch und kein Nachweis eines nutzbaren Ports. Die Merkmale nennen 0.3mm Kugeln, die Zeichnung 0.310mm nominal. Gehäusebezeichnungen: FCCSP766L in Merkmalen, ED-FCCSP 17x19 766L bei Bestellung. Die Grenzwerttabelle nennt maximal 125°C, der Wärmetext unter 125°C. Ein Registerkartenkapitel fehlt.

## Offizielle Referenzen

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
