---
title: "Rockchip UART FAQ: Baudrate, Pins, Interrupts, DMA und Boot-Diagnose"
description: "Rockchip UART FAQ: Baudrate, Pins, Interrupts, DMA und Boot-Diagnose"
excerpt: "Rockchip UART FAQ: Baudrate, Pins, Interrupts, DMA und Boot-Diagnose"
translation_key: 156-rockchip-uart-faq
slug: 156-rockchip-uart-faq
lang: de
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: interfaces
products: []
tags: [ArmSoM, Rockchip, UART, Linux, DMA]
---

{% raw %}

# Rockchip UART FAQ: Baudrate, Pins, Interrupts, DMA und Boot-Diagnose

Vollständige Übersetzung aller 13 Kapitel des chinesischen V1.1.0. Die Quelle behandelt Rockchip-Linux-Plattformen mit Beispielen zu kernel 3.10, 4.4, 4.19 und RK3568-Registern. Kein englisches Original liegt vor; Englisch, Russisch und Deutsch sind vollständige Übersetzungen aus dem Chinesischen.

Nur ArmSoM-Plattformreferenz: SoC, SDK/BSP, Kerneltreiber, DTS-Pinmux, Pegel und externe Schaltung prüfen. Keine pauschale Unterstützung aller Platinen. Keine separaten technischen Abbildungen; Code, Logs und Konfiguration bleiben kopierbar. Quelltests sind keine ArmSoM-Messungen. Keine Register-, Flash- oder anderen Hardwarebefehle ausgeführt.

> Direkte Registerzugriffe, Taktänderungen oder Abschalten der Konsole können Kommunikation, Debugzugriff und Booten verhindern. Mit dem konkreten TRM/BSP abgleichen; RK3568-Adressen nicht auf andere Chips übertragen. Die Quelle nennt in 2.1 115200 als Quarz-/PLL-Grenze, in 2.2.3 dagegen 1.5M. Der Widerspruch bleibt offen und ist keine allgemeine Treiberregel. Die Quellaussage zur RS232-Unterstützung bedeutet nicht, dass SoC-Pins RS232-Spannungen vertragen; Pegel und Transceiver prüfen.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Verwendung

### 1.1 Zugehörige Dokumente

Vor Verwendung dieses FAQ Rockchip_Developer_Guide_UART_CN (UART im Linux Kernel) und das UART-Kapitel von Rockchip_Developer_Guide_UBoot_Nextdev_CN (UART in U-Boot) zu Funktionen, Verwendung und Debugging lesen. Dasselbe Symptom kann je nach Anwendung und Hardware-/Softwareplattform andere Lösungen erfordern. Laut Quelle wurden grundlegendes Senden und Empfangen der UARTs im Rockchip SDK getestet. Bei älteren SDKs aktuelle Quellen beschaffen und UART-Treiber vergleichen. Bei Fragen den FAE über Rockchip Redmine kontaktieren.

### 1.2 Boot-Logs

Kennzeichnende Meldungen jeder Bootphase zeigen, in welcher Phase ein UART-Problem auftritt, und ermöglichen gezielte Diagnose. Nach Einschalten oder Reset einer Rockchip-Entwicklungsplatine sehen typische RK356x-Logs und wichtige Meldungen wie folgt aus.

```text
DDR Version <version information>        # DDR阶段(TPL阶段)打印
...
U-Boot SPL board init                    # Miniloader阶段(SPL阶段)打印
U-Boot SPL <version information>
...
INFO:    Preloader serial: 2             # Trust阶段(BL31阶段)打印
NOTICE:  BL31: <version information>
NOTICE:  BL31: Built : <version information>
...
I/TC: Rockchip release version: 1.0      # OP-TEE阶段(BL32阶段)打印
I/TC: OP-TEE version: <version information>
...
U-Boot <version information>             # U-Boot阶段打印
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM:  2 GiB
Sysmem: init
...
Starting kernel ...
[    0.000000] Booting Linux             # Linux Kernel earlycon打印
[    0.000000] Linux version <version information>
[    0.000000] Machine model: Rockchip RK3568 EVB2 LP4X V10 Board
[    0.000000] earlycon: uart8250 at MMIO32 0x00000000fe660000
[    0.000000] bootconsole [uart8250] enabled
...
[    0.193783] console [ttyFIQ0] enabled # 切换到fiq_debugger打印
[    0.194484] bootconsole [uart8250] disabled
...
[    0.411356] Serial: 8250/16550 driver # 普通UART初始化
[    0.412586] fe650000.serial: ttyS1 at MMIO 0xfe650000 (irq = 67, base_baud = 1500000) is a 16550A
[    0.413461] fe690000.serial: ttyS5 at MMIO 0xfe690000 (irq = 68, base_baud = 1500000) is a 16550A
```

### 1.3 Der Befehl io

Rockchip-Plattformen enthalten normalerweise io für direkte Registerzugriffe; die Quellen liegen unter external im Android SDK. Die folgenden Debug-Operationen verwenden RK3568 UART5_M0. Vor Registerzugriffen muss UART5 pclk aktiviert sein. Dazu entweder die passenden CRU-Register gemäß TRM konfigurieren oder folgenden Befehl verwenden.

```text
echo 1 > /sys/kernel/debug/clk/pclk_uart5/clk_enable_count
```

Alle UART5-Controllerregister lesen:

```text
io -4 -l 0x100 0xFE690000
```

UART5 sclk für den normalen Betrieb aktivieren:

```text
cat /sys/kernel/debug/clk/clk_summary | grep uart5    # UART5相关时钟
cat /sys/kernel/debug/clk/sclk_uart5/clk_rate         # UART5工作时钟频率
echo 24000000 > /sys/kernel/debug/clk/sclk_uart5/clk_rate
cat /sys/kernel/debug/clk/sclk_uart5/clk_enable_count # UART5工作时钟状态
echo 1 > /sys/kernel/debug/clk/sclk_uart5/clk_enable_count
```

UART5_M0 IOMUX prüfen, damit die Signale an den vorgesehenen Pins anliegen. Register im GRF-Kapitel des TRM nachschlagen:

```text
io -4 0xFDC60310    # uart5_iomux_sel,选择iomux group 0 或 group 1
fdc60310:  00000000 # bit 0为0,说明UART5_M0配置正确
io -4 0xFDC60020    # gpio2a1_sel和gpio2a2_sel,rx和tx的GPIO function
fdc60020:  00001331 # bit 7:4和bit 11:8均为3,说明UART5_M0 RX和TX配置正确
```

UART5-Register direkt für grundlegendes Senden und Empfangen mit 115200 Baud konfigurieren:

```text
io -4 0xFE690088 0x00000007 # SRR寄存器,对UART和FIFO进行reset
io -4 0xFE690010 0x00000010 # MCR寄存器,将UART配置成loopback模式
io -4 0xFE69000C 0x00000080 # LCR寄存器,div_lat_access置1
io -4 0xFE690000 0x0000000D # DLL寄存器,配置波特率分频系数
io -4 0xFE690004 0x00000000 # DLH寄存器,配置波特率分频系数
io -4 0xFE69000C 0x00000003 # LCR寄存器,div_lat_access清0和配置UART协议参数
io -4 0xFE690010 0x00000000 # MCR寄存器,将UART配置成一般模式
io -4 0xFE690004 0x00000001 # IER寄存器,打开接收中断
io -4 0xFE690008 0x00000041 # FCR寄存器,打开FIFO,FIFO触发阈值配置为1/4
io -4 0xFE69009C            # SRT寄存器,读写RX FIFO触发阈值
io -4 0xFE6900A0            # STET寄存器,读写TX FIFO触发阈值
io -4 0xFE690000 0x00000055 # THR寄存器,发送“U”,0x55
io -4 0xFE690000            # RBR寄存器,上位机发送“U”,读取到0x55
```

Vor der Konfiguration von DLL/DLH LCR-Bit 7 (div_lat_access) auf 1 setzen. Zuvor MCR-Bit 4 (loopback) auf 1 setzen, um Loopback zu aktivieren. Andernfalls können externe RX-Störungen während der DLL-/DLH-Konfiguration UART in den Busy-Zustand versetzen, sodass LCR-Bit 7 nicht mehr auf 0 zurückgesetzt werden kann und ein Fehler entsteht.

### 1.4 Andere Ausgaben unterdrücken

Während des Debuggings andere Ausgaben unterdrücken:

```text
su
echo 0 > /proc/sysrq-trigger
```

## 2. Baudrate

Der Betrieb bei einer Baudrate hängt vor allem vom internen UART-Teiler und der CRU-Taktteilung ab. DLL/DLH steuern den internen Teiler. Der CRU-Arbeitstakt heißt gewöhnlich uart_sclk und muss die 16-fache Baudrate haben. Für Genauigkeit gängige Werte wie 115200, 460800, 921600, 1.5M, 3M oder 4M verwenden; ungewöhnliche Werte werden nicht garantiert. Weitere Standardwerte stehen in include/uapi/asm-generic/termbits.h. Das Rockchip-UART-IP unterstützt stabil bis 4M; höhere Werte sind nicht garantiert und erfordern Framework-Änderungen. Die Backend-sign_off-Grenze von uart_sclk beträgt normalerweise 100MHz; auch Sonderfälle sollten 6M Baud nicht überschreiten. Bei alten SDKs aktualisierte UART-Quellen von Rockchip anfordern.

### 2.1 Taktteilung

Unter Linux kernel 4.19 folgende Treiberdateien und Funktionen prüfen:

```text
drivers/tty/serial/8250/8250_dw.c    # dw8250_set_termios
drivers/clk/clk-fractional-divider.c # clk_fd_set_rate
drivers/clk/rockchip/clk.c           # rockchip_fractional_approximation
```

dw8250_set_termios in drivers/tty/serial/8250/8250_dw.c wählt bis einschließlich 115200 den 24M-Quarz, darüber die CRU-gesteuerte PLL. Bei speziellen Baudraten kann die CRU-Teilung größere Fehler erzeugen; eine doppelte Taktanforderung kann helfen: sclk_rate = baud_rate x 16 x 2. Zur Jitter-Reduktion besitzt der fraktionale CRU-Teiler eine 20-fach-Verhältnisgrenze. Dank internem UART-Teiler kann das Signal auch nach Aufheben der Grenze allgemeine Anforderungen erfüllen. Siehe CLK_FRAC_DIVIDER_NO_LIMIT in rockchip_fractional_approximation in drivers/clk/rockchip/clk.c. Ältere SDKs enthalten den Patch möglicherweise nicht; beim Rockchip FAE anfordern.

### 2.2 Beispiele

#### 2.2.1 Falsche Baudratenmessung

Bei Fehlern die Baudrate immer mit einem Oszilloskop an der UART-TX-Wellenform messen. Logikanalysator oder USB-UART-Adapter können unzuverlässige Ergebnisse liefern. Drei Werte vergleichen: gemessene TX-Baudrate, ausgegebene UART-Arbeitstaktfrequenz und theoretische Frequenz aus der Taktteilung. Ist der ausgegebene Takt korrekt, die Messung aber falsch, das Messverfahren prüfen. Weichen berechneter und tatsächlicher Eingangstakt ab, Taktteilungsstrategie oder Baudrate ändern.

#### 2.2.2 Fehler im Betrieb, nach Neustart normal

Treten Übertragungsfehler erst nach längerer Laufzeit, etwa beim Alterungstest, auf, die gewählte Taktquelle prüfen. Bei einer CRU-PLL deren Zustand vor und nach dem Fehler vergleichen. Die UART-Baudrate hängt vom Arbeitstakt ab; Suspend/Resume oder Frequenzwechsel können die PLL-Frequenz und damit die Baudrate während der Übertragung verändern.

#### 2.2.3 Fehler beim Wechsel von hoher zu niedriger Baudrate

Funktioniert der Wechsel von niedriger zu hoher Baudrate, aber nicht zurück, die Umschaltung zwischen CRU und Quarz prüfen. Rockchip verwendet normalerweise 24MHz; bei 16:1 nutzen Baudraten bis 1.5M den Quarz, darüber die CRU-PLL. Die UART-Taktausgaben vor und nach dem Fehler vergleichen.

## 3. Pin-Multiplexing

UART-Signale haben gewöhnlich mehrere IOMUX-Gruppen. Beide GRF-Einstellungen konfigurieren und bei Fehlern per io zurücklesen: Die GPIO-Pinfunktion muss UART unter den gemultiplexten Modulen auswählen; uart_iomux_sel muss die gewünschte Gruppe für den gesamten Controller setzen. Die Einstellungen stehen meist im GRF-pinctrl-Code, werden jedoch manuell ergänzt. Rockchip garantiert deshalb nicht Vollständigkeit und Richtigkeit jeder Gruppe; tatsächliche Registerwerte prüfen.

### 3.1 Beispiele

#### 3.1.1 TX funktioniert in mehreren IOMUX-Gruppen, RX nicht

IOMUX nutzt Pins effizienter; ein UART-Controller kann nur eine Gruppe wählen. Den erfolgreichen Gruppenwechsel über RX prüfen. Die TX-Pins von UART M0 und M1 besitzen keinen Auswahlschalter und können daher beide Daten ausgeben, wenn beide auf UART gesetzt sind. RX besitzt einen Schalter; beide RX-Pins können nicht gleichzeitig empfangen.

#### 3.1.2 UART-Fehler nach Aktivierung anderer Module

Andere Module können gemeinsam genutzte IOMUX-Register umkonfigurieren und UART stören. Typische Konflikte entstehen mit PWM-Hintergrundbeleuchtung, SDMMC-Bootspeicher und JTAG; force jtag muss deaktiviert bleiben. Besonders Module mit gemeinsamen Konsolen-UART-Pins beachten, da Konflikte die Konsolenausgabe stören. Zur Diagnose die IOMUX-Funktionsregister der Pins lesen.

## 4. Pinpegel

Falsche UART-Pegel verhindern Kommunikation. TX/RX verwenden normalerweise interne Pull-ups; auf älteren Rockchip-Plattformen kann RX hochgezogen sein, während TX seine Standard-Pull-Einstellung behält. RX-/TX-Konfiguration im Kernel-DTS, I/O-Domain (1v8 oder 3v0) anhand des Datenblatts und direkt gemessene High-Pegel samt Spannung prüfen. Hardwareunterstützung bieten Rockchip-Hardwareingenieure.

### 4.1 Beispiele

#### 4.1.1 Platinenfehler

Sind die Softwareeinstellungen korrekt, die Platine prüfen, unter anderem auf vertauschte RX-/TX-Leitungen oder feste High-/Low-Verbindungen, aktivierte Flusssteuerung bei extern erzwungenem CTS=High sowie unpassende Peripheriepegel, falsche Spannungen und fehlenden Leckstromschutz.

#### 4.1.2 Hardwareentwurf passt nicht zur Chipvariante

Rockchip-Chipfamilien enthalten durch Namenssuffixe bezeichnete Varianten. Prüfen, ob das für den Hardwareentwurf verwendete Handbuch zur tatsächlich eingesetzten Variante passt. Bei solchen Problemen denselben Test auf einer Rockchip-EVB wiederholen und Pinpegel prüfen.

#### 4.1.3 Peripherie-TX kann Host-RX nicht auf Low ziehen

Kann Peripherie-TX den Host-RX nicht zum Übertragungsstart auf Low ziehen, zuerst prüfen, ob andere GPIOs auf Low gezogen werden können. Danach Pegelwandler zwischen Host und Peripherie sowie die Treiberstärke des Peripheriepins prüfen.

## 5. Interrupts

UART-Interrupts umfassen TX/RX; wegen der FIFOs müssen sie gemeinsam mit deren Konfiguration untersucht werden. Hauptregister: IER aktiviert Interrupts. 0x80 PTIME (Programmable THRE Interrupt Mode Enable) verbessert das Senden durch vorzeitiges THRI am TX-FIFO-Schwellwert, um die nächste Übertragung vorzubereiten. 0x08 MSI (Modem Status Interrupt) hat vierte Priorität, kommt vom UART-Modem und betrifft MCR/MSR. 0x04 RLSI (Receive Line Status Interrupt) hat höchste Priorität: Overrun-/Parity-/Framing-Fehler, Break- und Address-received-Interrupt; zugehörig sind LCR/LSR. 0x02 THRI (Transmitter Holding Register Interrupt), dritte Priorität, tritt ohne PTIME bei leerem TX-FIFO auf, mit PTIME beim Erreichen oder Unterschreiten der TX-Schwelle. 0x01 RDI (Receive Data Interrupt), zweite Priorität, entsteht beim Erreichen/Überschreiten der RX-Schwelle oder durch Timeout, wenn Daten im RX-FIFO liegen, aber vier Zeichenzeiten keine neuen eintreffen. IIR identifiziert den auslösenden Unterinterrupt. Neben den vier IER-Typen gibt es Busy Detect Indication als fünften Typ mit niedrigster Priorität.

FCR ist das FIFO-Steuerregister für RX-/TX-Schwellen und weitere Einstellungen.

### 5.1 Beispiele

#### 5.1.1 Empfangsinterrupt-Schwelle

Der RX FIFO Trigger Level im FCR ist entscheidend. Rockchip-RX-FIFOs haben meist 64 oder 32 Bytes und vier Schwellen: 2'b00: 1 Zeichen; 2'b01: 1/4 voll; 2'b10: 1/2 voll; 2'b11: 2 Zeichen unter voll. Niedrigere Schwellen verarbeiten Daten schneller, belasten aber durch mehr Interrupts die CPU. Standard ist meist halbvoll. UART_FCR_R_TRIG_10 in serial8250_do_set_termios() unter drivers/tty/serial/8250/8250_port.c ändern. Bei Empfangsfehlern 2'b00 versuchen, sodass jedes Zeichen einen Interrupt auslöst.

## 6. DMA

Rockchip verwendet meist PL330-DMA, einige Chips DW; das TRM prüfen. Ohne anderen Hinweis gilt dieser Abschnitt für PL330. Variable UART-Datenlängen erfordern eine besondere Strategie. Standard ist Burst-Modus mit Burst-Länge 1: jedes Byte löst eine DMA-Anforderung aus, bedingt durch PL330. Die Interruptmodus-Standardschwelle 2'b10 (halbes FIFO) passt nicht dazu; FCR muss auf 2'b00 (ein Byte) gesetzt werden, siehe Interruptabschnitt. Für höhere Effizienz können beide Seiten streng auf Burst-Länge ausgerichtete Daten mit aufgefülltem Endpaket senden; Burst-Länge und FIFO-Schwelle müssen zusammenpassen. Überschreiten beide ein Byte und fehlt das Padding des letzten Pakets, wird dieses beim DMA-Empfang über den Timeout-CPU-Interrupt empfangen. CPU- und DMA-Empfang konkurrieren dann und können Daten verlieren. DW-DMA hat dieses Problem nicht, nutzt aber zur Vereinheitlichung dasselbe Verfahren. Anfang/Ende jeder DMA-Übertragung und den Aktivierungszustand des Controllers vor der nächsten Übertragung prüfen.

### 6.1 Beispiele

#### 6.1.1 DMA-Konfiguration je Kernelversion

Nach Systemupdates können ungeprüft übernommene DTS-DMA-Einstellungen Fehler verursachen. Kernelversionen unterscheiden sich: Burst-Modus heißt etwa in kernel 4.4 peripherals-req-type-burst und in 4.19 arm,pl330-periph-burst.

#### 6.1.2 Sporadischer DMA-Empfangsverlust bei hoher Baudrate

Bei hohen Baudraten überschreibt DMA-RX seinen Ringpuffer zyklisch. Ein kleiner Puffer kann ungelesene Daten überschreiben und sporadische Verluste verursachen. rx_size in serial8250_request_dma unter drivers/tty/serial/8250/8250_dma.c erhöhen; PAGE_SIZE beträgt 4k.

## 7. Hardware-Flusssteuerung

Ab 1.5M Baud oder bei großen Datenmengen automatische Hardware-Flusssteuerung mit Vierdraht-UART verwenden. RTS/CTS bieten höhere Zuverlässigkeit als DMA allein. Auf Rockchip-UART keine Software-Flusssteuerung verwenden.

### 7.1 Beispiele

#### 7.1.1 Kein Senden nach Aktivierung der Flusssteuerung

Dies ist meist ein Hardwareproblem. Prüfen, ob Platinenfehler CTS auf High zwingen oder ob das RTS der Gegenstelle nicht schalten kann und nach Anschluss das lokale CTS dauerhaft auf High hält.

## 8. Empfangsfehler

Empfangsfehler bedeuten fehlende oder verfälschte Daten. Hardware: internen RX-Pull-up, externe Spannungen/Ströme und Pinpegel prüfen, gegebenenfalls besseren USB-Serial-Adapter/Kabel verwenden. Treiber: IER-Interrupts per io deaktivieren, Empfangstest starten, RFL auf liegengebliebene Daten und FCR auf passende RX-Schwelle prüfen. Anwendung: FIFO-Datenabholung, andere UART-Nutzer, zur RX-Schwelle passende Verarbeitung und ausreichenden Empfangspuffer prüfen.

Bei alten SDKs aktualisierte UART-Quellen beim Rockchip FAE anfordern. Die übrigen Abschnitte zusammen mit den Debug-Verfahren in Rockchip_Developer_Guide_UART_CN verwenden.

### 8.1 Beispiele

#### 8.1.1 Fehlerhaftes Senden der Gegenstelle

Mit Oszilloskop oder USB-UART klären, ob der lokale Empfang oder die Gegenstelle falsch sendet. Ist der lokale Empfang nach den Prüfungen korrekt, die Daten der Gegenstelle sorgfältig prüfen.

#### 8.1.2 Große Empfangsdaten werden segmentiert

Interruptmodus verwenden und FIFO-Schwelle im FCR prüfen. Der Empfang liest die IIR-ID und behandelt/meldet 4'b0100 (RX-Schwelle) sowie 4'b1100 (RX-Timeout) getrennt. Die Meldelogik muss zur Anwendung passen. max_count mit der Zahl der Zeichenempfangsschleifen abgleichen: kernel 3.10, receive_chars in drivers/tty/serial/rk_serial.c; kernel 4.4/4.19, serial8250_rx_chars in drivers/tty/serial/8250/8250_port.c.

#### 8.1.3 Verzögertes Lesen in Anwendungen

Linux ist kein Echtzeitsystem. UART meldet Daten über eine Work Queue an Anwendungen; eine blockierte Queue verzögert Lesezugriffe. Kernel 3.10 bietet interruptbasierte Meldung für bessere Reaktionszeiten mit folgendem Patch:

```text
diff --git a/drivers/tty/serial/rk_serial.c b/drivers/tty/serial/rk_serial.c
index 9870873c1200..ff81be78a53a 100644
--- a/drivers/tty/serial/rk_serial.c
+++ b/drivers/tty/serial/rk_serial.c
@@ -2074,6 +2074,9 @@ static int serial_rk_probe(struct platform_device *pdev)
        up->port.uartclk = 24000000;
 #endif

+       /* update recv data quickly instead of workqueue */
+       up->port.flags |= UPF_LOW_LATENCY;
```

Kernel 4.4 und 4.19 unterstützen im UART-Framework nur Work-Queue-Meldungen. Bei hohen Echtzeitanforderungen ein RTOS verwenden.

## 9. Peripherie und andere Controller

Bei Bluetooth, WIFI, NFC oder anderen Controllern zunächst die fehlerhafte Seite bestimmen. Mit Protokollanalysator oder zwei USB-UART-Adaptern an Host-RX/TX den Verkehr erfassen. Bei Hostfehlern lokal weiterprüfen, sonst mit dem Geräteanbieter arbeiten. Position, Anzahl und Werte falscher Bytes auf Muster untersuchen. Zusätzliche Bytes können von Prozessen unter Sonderbedingungen stammen, besonders von frühen Bootausgaben nach Umwandlung eines Konsolen-UART in einen normalen Port. Bei Verlusten prüfen, ob andere Module/Prozesse Daten lesen und ob UART korrekt konfiguriert ist. DMA-Einstellungen gemäß DMA-Abschnitt prüfen.

### 9.1 Beispiele

#### 9.1.1 Bluetooth-Übertragungsfehler

Für Bluetooth ab 1.5M Baud und große Datenmengen Vierdraht-Bluetooth mit Hardware-Flusssteuerung wählen. Laut Quelle zeigten Langzeittests bei Zweidraht-Bluetooth selbst mit DMA Wiedergabestörungen an Headsets/Lautsprechern. Der Engpass liegt meist im Bluetooth-Modul und lässt sich hostseitig nicht beheben. Zuerst Anbieterfirmware prüfen und bei OS-Upgrades mitaktualisieren. Hostdiagnose gemäß Pinpegel-/IOMUX-Abschnitten durchführen. Bei Vierdraht-Bluetooth wird RTS-pinctrl im Bluetooth-Knoten, CTS-pinctrl im UART-Knoten umgeschaltet. Dies folgt der Suspend-/Resume-Strategie und verbessert die Empfangsstabilität beim Aufwachen. Zweidraht-DMA-Bluetooth kann vor einem fehlenden Ringpuffer warnen; den DMA-Puffer passend zum Einsatz konfigurieren.

#### 9.1.2 RS485-Fehler

Laut Quelle unterstützt Rockchip UART RS485 nicht nativ, sondern nur RS232. Für RS485 ist deshalb ein externer Wandler erforderlich. Bei Fehlern Schaltung und Signalpegel prüfen.

## 10. Konsolenausgabe

Rockchip-Konsolenausgaben verwenden fiq_debugger. Da FIQ globale Interrupts deaktiviert, erfolgt die Ausgabe in einem Thread: Daten werden zuerst im Speicher abgelegt. CONFIG_RK_CONSOLE_THREAD=y aktivieren. Code und Konfiguration siehe Rockchip_Developer_Guide_UART_CN; bei alten SDKs fiq_debugger-Updates beim FAE anfordern. Alle Phasen müssen dieselbe Baudrate nutzen, siehe Abschnitt zum Abschalten/Verlegen der Ausgabe. Für große Ausgaben FIFO_SIZE im Treiber erhöhen, um den Thread-Puffer zu vergrößern.

### 10.1 Beispiele

#### 10.1.1 Shell hängt bei vielen Konsolen-Testbefehlen

Bei automatischen Stresstests mit vielen Konsolenbefehlen kann die Android-Shell hängen. Stattdessen eine BusyBox-basierte Shell oder bash verwenden.

#### 10.1.2 Wagenrücklauf und Zeilenumbruch

Konsolenausgaben behandeln Wagenrücklauf `\r` (0x0D) und Zeilenumbruch `\n` (0x0A) meist speziell. Vor einem an das Terminal gesendeten Zeilenumbruch fügt UART gewöhnlich einen Wagenrücklauf ein. Bei ASCII-Verkehr daher besonders auf 0x0D und 0x0A achten.

## 11. Suspend, Aufwecken und Verbrauch

Rockchip-UART-Suspend/Wakeup ist in trust implementiert. Im Kernel eine wakeup source ergänzen, damit UART im Suspend aktiv bleibt. Probleme sowohl in trust als auch im Kernel untersuchen. trust-Firmware auf den aktuellen SDK-Stand bringen; bei fortbestehenden Problemen den Rockchip-Trust-Ingenieur kontaktieren. Bei strengen Verbrauchsgrenzen den Wakeup-UART mit einem Quarz takten, um den Verbrauch des fraktionalen CRU-Teilers zu vermeiden.

## 12. Alle Ausgaben abschalten oder auf anderen UART verlegen

UART-Ausgaben umfassen gewöhnlich DDR, Miniloader, TF-A (Trusted Firmware-A), OP-TEE, U-Boot und Kernel. Phasenkennzeichen siehe Boot-Log-Abschnitt. Zwei Verfahren schalten alle Ausgaben ab oder verlegen sie auf einen anderen UART:

Spezialfirmware für jede Phase deaktiviert oder verlegt Ausgaben; frühe Plattformen unterstützen meist nur diesen Weg, entsprechende Firmware bei Rockchip anfordern. Alternativ Parameterübergabe verwenden: UART-Ausgabeparameter im DDR Loader ändern wirkt auf alle frühen Phasen; der Kernel wird separat angepasst. Dies ist heute das Hauptverfahren. Ältere SDKs können in einzelnen Phasen keine Parameterübergabe unterstützen; Rockchip kontaktieren.

### 12.1 DDR Loader anpassen

Zum Abschalten oder Verlegen der DDR-Loader-Ausgabe diese UART-Parameter in rkbin/tools/ddrbin_param.txt ändern:

```text
uart id=         # UART控制器id,配置为0xf为关闭打印
uart iomux=      # 复用的IOMUX引脚
uart baudrate=   # 115200 or 1500000
```

Details siehe ddrbin_tool_user_guide.txt. Nach der Änderung ddr.bin mit folgendem Befehl neu erzeugen; den tatsächlich im SDK verwendeten Dateinamen einsetzen.

```text
./ddrbin_tool ddrbin_param.txt path/to/ddr.bin
```

### 12.2 U-Boot anpassen

Zum Abschalten der U-Boot-Ausgabe CONFIG_DISABLE_CONSOLE in menuconfig aktivieren und in .config speichern.

```text
console  --->
    disable console in&out
```

Die U-Boot-Ausgabeumleitung folgt der Parameterübergabe ohne weitere Änderungen. Auswertung durch board_init_f_init_serial() in arch/arm/mach-rockchip/board.c.

### 12.3 Kernel anpassen

#### 12.3.1 Kernel-Ausgabe deaktivieren

CONFIG_SERIAL_8250_CONSOLE in menuconfig deaktivieren.

```text
Device Drivers  --->
    Character devices  --->
        Serial drivers  --->
            [ ] Console on 8250/16550 and compatible serial port
```

Entsprechende DTS-Einstellungen suchen und UART-Basisadresse sowie console-Parameter entfernen.

```text
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio";
}
```

Im fiq-debugger serial-id auf 0xffffffff setzen und UART-Pinmux entfernen. Den Knoten aktiviert lassen: Der fiq-debugger-Ablauf wird weiterhin für den normalen Systemstart benötigt.

```text
fiq-debugger {
    compatible = "rockchip,fiq-debugger";
    rockchip,serial-id = <0xffffffff>;
    rockchip,wake-irq = <0>;
    /* If enable uart uses irq instead of fiq */
    rockchip,irq-mode-enable = <1>;
    rockchip,baudrate = <1500000>;  /* Only 115200 and 1500000 */
    interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
    status = "okay";
    };
```

#### 12.3.2 Kernel-Ausgabe verlegen

Um beispielsweise Kernel-Ausgaben von UART2 nach UART3 zu verlegen, in entsprechenden DTS-Einstellungen die UART2-Basisadresse durch UART3 ersetzen.

```text
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio32,0xfe670000 console=ttyFIQ0";
}
```

fiq-debugger serial-id auf 3 setzen und UART3-Pinmux anpassen. Gleichzeitig den normalen UART3-Knoten deaktivieren, da UART3 nun Konsolenausgaben übernimmt.

```text
fiq-debugger {
    compatible = "rockchip,fiq-debugger";
    rockchip,serial-id = <3>;
    rockchip,wake-irq = <0>;
    /* If enable uart uses irq instead of fiq */
    rockchip,irq-mode-enable = <1>;
    rockchip,baudrate = <1500000>;  /* Only 115200 and 1500000 */
    interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&uart3m0_xfer>;
    status = "okay";
    };
```

#### 12.3.3 Konsolen-UART als normalen UART verwenden

Nach Deaktivierung/Verlegung der Konsole den UART als normalen Port wieder aktivieren. Im DTS zuerst die Konsole abschalten/verlegen und UART freigeben, danach den normalen UART-Knoten aktivieren.

### 12.4 Android anpassen

Android-Recovery darf console nicht mehr verwenden, sonst hängt der Werksreset. console in android/device/rockchip/common/recovery/etc/init.rc auskommentieren.

```text
service recovery /sbin/recovery
    #console
    seclabel u:r:recovery:s0
```

### 12.5 Beispiele

#### 12.5.1 Probleme nach Umwandlung der Konsole in normalen UART

Bei Problemen eines umgewandelten Konsolen-UART denselben Test an einem anderen UART wiederholen. Funktioniert dieser, spezielle Rockchip-Firmware mit direkt im Quellcode deaktivierter UART-Ausgabe anfordern und weiterprüfen. Frühe Sonderoperationen wie DDR-Frequenzwechsel können zusätzliche oder verlorene Daten am früheren Konsolen-UART verursachen.

## 13. Weitere Probleme

### 13.1 Beispiele

#### 13.1.1 Kernel startet mit manchen Hostprogrammen nicht

Manche PC-Terminalprogramme wie MobaXterm oder Putty aktivieren Xon/Xoff standardmäßig. Beim Booten können etwa DDR-Frequenzwechsel mehr Ausgabe erzeugen, als der Hostpuffer aufnimmt. Die Software-Flusssteuerung sendet dann wiederholt Xoff (Control+S) an UART RX. Beim Rockchip-Start aktiviert Control+S den U-Boot-Debugmodus und verhindert normales Booten. Laut Quelle ist diese Voreinstellung ungeeignet, da Software-Flusssteuerung unzuverlässig ist und auf Rockchip nicht verwendet wird. Einstellungen des Hostprogramms prüfen.

#### 13.1.2 UART-Gerätenummern ändern

Zum Ändern der UART-Gerätenummern, etwa Vertauschen von ttyS3 und ttyS4, den DTS wie folgt ändern:

```text
aliases {
    serial3 = &uart4;
    serial4 = &uart3;
}
```

Zum Vertauschen der Gerätenummern von Konsolen- und normalem UART tty_line_name() in drivers/tty/tty_io.c direkt anpassen und die betreffenden Nummern abfragen.

{% endraw %}
