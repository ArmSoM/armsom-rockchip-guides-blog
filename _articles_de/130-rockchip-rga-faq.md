---
title: "Rockchip RGA FAQ: Versionen, Leistung, Bildverarbeitung und Fehlerdiagnose"
description: "Rockchip RGA FAQ: Versionen, Leistung, Bildverarbeitung und Fehlerdiagnose — V1.1.3"
excerpt: "Rockchip RGA FAQ: Versionen, Leistung, Bildverarbeitung und Fehlerdiagnose — V1.1.3"
translation_key: "130-rockchip-rga-faq"
slug: "130-rockchip-rga-faq"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["ArmSoM", "Rockchip", "RGA", "librga", "Linux"]
---

{% raw %}

Quelle RK-PC-YF-404 V1.1.3: RGA1/RGA2/RGA3, librga und RGA-Treiber. Kernel, SDK/BSP und Funktionsgrenzen anhand der Versionstabellen und des tatsächlichen Chips prüfen; keine universelle ArmSoM-Kompatibilität. Plattformreferenz ohne ArmSoM-Hardwarevalidierung. RK3566- und andere Quellmessungen sind keine ArmSoM-Testergebnisse. Chinesische Artikel verwenden chinesische, EN/RU/DE englische Originalbilder. Befehle wurden nur dokumentiert, nicht ausgeführt. check/slt sowie Frequenz-, Cache- und Speicherabbildungsänderungen können das System beeinflussen und müssen nach Plattformprüfung durch Entwickler bewertet werden.

[ArmSoM Docs](https://docs.armsom.org/) · [librga](https://github.com/airockchip/librga)

<!-- en PDF p.4 -->

## 1. Überblick

<!-- en PDF p.4 -->

Für den RGA-Treiber und die Userspace-API librga werden hier häufige Probleme bei der hardwarebeschleunigten OSD- (On Screen Display) und GUI-Darstellung (Graphics User Interface) auf RK-Plattformen behandelt.

<!-- en PDF p.5 -->

## 2. Versionsbeschreibung

<!-- en PDF p.5 -->

### 2.1 Hardwareversion

<!-- en PDF p.5 -->

Die Hardwareversionen sind RGA1, RGA2 und RGA3. Plattformzuordnung, Funktionen und Einschränkungen stehen im Einleitungskapitel von Rockchip_Developer_Guide_RGA_EN.

<!-- en PDF p.5 -->

### 2.2 Softwareversion

<!-- en PDF p.5 -->

Nachfolgend gebräuchliche Versionsabfragen. Details enthält das Kapitel Release Notes von Rockchip_Developer_Guide_RGA_EN.

<!-- en PDF p.5 -->

#### 2.2.1 librga

<!-- en PDF p.5 -->

Die API-Version besteht aus major, minor, revision und build; diese vier Ebenen kennzeichnen unterschiedlich umfangreiche Funktionsänderungen. Gebräuchliche Versionsabfrage:

<!-- en PDF p.5 -->

```text
strings librga.so |grep rga_api |grep version
```

<!-- en PDF p.5 -->

Versionsaktualisierung. Falls die Version nicht genügt, sind Quellcode oder vorkompilierte Bibliotheken hier erhältlich:

- GitHub: https://github.com/airockchip/librga
- Zbox Cloud: https://console.zbox.filez.com/l/fuGojC (Abrufcode: rkrga).

<!-- en PDF p.5 -->

RGA-Treiber. Die Version umfasst ebenfalls major, minor, revision und build für verschiedene Stufen funktionaler Änderungen. Im veröffentlichten SDK passen HAL und Treiber üblicherweise zusammen; librga prüft die Version intern. Tritt nach einem separaten librga-Update der folgende Fehler auf, den Treiber auf die passende Version aktualisieren. Versionsabfrage:

<!-- en PDF p.6 -->

Die Debug-Knotenpfade unterscheiden sich nach Chipplattform; üblich sind folgende zwei Pfade.

<!-- en PDF p.6 -->

```text
cat /sys/kernel/debug/rkrga/driver_version
cat /proc/rkrga/driver_version
```

<!-- en PDF p.6 -->

Aktualisierung: Falls die Version nicht genügt, sind Quellcode beziehungsweise vorkompilierte Dateien über Zbox Cloud erhältlich: https://console.zbox.filez.com/l/7oOrKO (Abrufcode: rkrga).

<!-- en PDF p.6 -->

#### 2.2.2 Versionszuordnung

<!-- en PDF p.6 -->

Vor der RGA-Nutzung die Funktionsfähigkeit der Umgebung prüfen. Die Tabelle ordnet gebräuchliche librga- und Treiberversionen einander zu.

<!-- en PDF p.6 -->

| librga-Version | Passender Treiber | Hardwareunterstützung |
| --- | --- | --- |
| ohne Version | SDK-Treiber | RGA1、RGA2 |
| 1.0.0 ~ 1.3.2 | RGA Device Driver(kernel - 4.4 und neuer)<br>RGA2 Device Driver(ohne Version or v2.1.0) | RGA1、RGA2 |
| > 1.4.0 | RGA multicore Device Driver(v1.2.0 und neuer) | RGA2、RGA3 |
| > 1.9.0 | RGA Device Driver(kernel-4.4 und neuer)<br>RGA2 Device Driver(ohne Version or v2.1.0)<br>RGA multicore Device Driver(v1.2.0 und neuer) | RGA1、RGA2、RGA3 |

<!-- en PDF p.6 -->

Die Versionen eines veröffentlichten SDK passen üblicherweise zusammen. Benötigt eine Anwendung eine neuere librga.so, ist das RGA-Updatepaket über https://console.zbox.filez.com/l/mu2SOR verfügbar (Abrufcode: rkrga).

- update-to-MULTI_RGA: für RGA Device Driver oder RGA2 Device Driver; aktualisiert auf RGA multicore Device Driver und die passende librga.
- MUTIL_RGA: für RGA multicore Device Driver; aktualisiert Treiber und passende librga.
- RGA2: für RGA2 Device Driver; aktualisiert Treiber und passende librga.
- RGA1:

<!-- en PDF p.7 -->

Ist der bisherige Treiber RGA Device Driver, aktualisiert dieses Paket den Treiber und die passende librga.

<!-- en PDF p.8 -->

## 3. Debugging

<!-- en PDF p.8 -->

### 3.1 HAL-Protokolle

<!-- en PDF p.8 -->

#### 3.1.1 Protokollschalter

<!-- en PDF p.8 -->

Android. Android-Properties steuern die HAL-Protokollausgabe von librga. Aktivieren:

<!-- en PDF p.8 -->

```text
setprop vendor.rga.log 1
logcat -s librga
```

<!-- en PDF p.8 -->

Protokollstufen: vollständige Ausgabe (0), DEFAULT (1), DEBUG (3), INFO (4), WRANING (5), ERROR (6). Einstellung:

<!-- en PDF p.8 -->

```text
setprop vendor.rga.log_level 6
```

<!-- en PDF p.8 -->

Linux. Ab librga 1.9.0 lässt sich die HAL-Protokollausgabe über Umgebungsvariablen ein-/ausschalten. Aktivieren:

<!-- en PDF p.8 -->

```text
export ROCKCHIP_RGA_LOG=1
```

<!-- en PDF p.8 -->

Protokollstufen: vollständige Ausgabe (0), DEFAULT (1), DEBUG (3), INFO (4), WRANING (5), ERROR (6). Einstellung:

<!-- en PDF p.8 -->

```text
export ROCKCHIP_RGA_LOG_LEVEL=6
```

<!-- en PDF p.8 -->

#### 3.1.2 Protokollbeschreibung

<!-- en PDF p.8 -->

Initialisierungsprotokoll. Beim ersten librga-Aufruf eines Prozesses wird ein Singleton initialisiert und unter anderem die aktuelle API-Version ausgegeben.

<!-- en PDF p.9 -->

```text
E rockchiprga: rga_api version 1.9.0_[0]
```

<!-- en PDF p.9 -->

Passen Treiber- und librga-Version nicht zusammen, erscheint eine Fehlermeldung. Bei älterem Treiber startet der Kompatibilitätsmodus mit folgender Ausgabe bei der Singleton-Initialisierung. Den Treiber auf die angegebene Version aktualisieren oder im Kompatibilitätsmodus weiterarbeiten.

<!-- en PDF p.9 -->

```text
librga fail to get driver version! Compatibility mode will be enabled.

29 im2d_rga_impl rga_version_below_minimun_range_user_driver(310): The driver may be
compatible, but it is best to update the driver to version 1.2.4. You can try to update the
SDK or update the <SDK>/kernel/drivers/video/rockchip/rga3 directory individually. current
version: librga 1.8.5, driver .
```

<!-- en PDF p.9 -->

Bei zu alter librga werden bestimmte Invalid-parameters-Fehler über imStrError() zurückgegeben; dann muss librga aktualisiert werden.

<!-- en PDF p.9 -->

```text
Invalid parameters: invaild GraphicBuffer, can not get fd and virtual address,
```

<!-- en PDF p.9 -->

Laufzeitprotokoll

<!-- en PDF p.9 -->

```text
D librga  : <<<<-------- print rgaLog -------->>>>                              //The parameters passed to librga are printed as follows.
D librga  : src->hnd = 0x0 , dst->hnd = 0x0 , src1->hnd = 0x0                   //The handle passed in by the three channels (src、src1、dst).
D librga  : src: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431ed6040         //Parameters passed in src channel, representing DMA_FD, physical address and virtual address respectively.
D librga  : dst: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431b4f040         //Parameters passed in dst channel, representing DMA_FD, physical address, and virtual address respectively.
D librga  : src: Fd = -01 , buf = 0xb400007431ed6040, mmuFlag = 1, mmuType = 0  //The src channel configures the value for the type of memory passed and whether or not MMU is enabled, where the HAL selects the virtual address to pass into the driver.
D librga  : dst: Fd = -01 , buf = 0xb400007431b4f040, mmuFlag = 1, mmuType = 0  //The dst channel configures the value for the type of memory passed and whether or not MMU is enabled, where HAL selects the virtual address to pass in the driver.
E librga  : blend = 0 , perpixelAlpha = 1                                       //Blending mode and whether the image format includes an Alpha value.
D librga  : scaleMode = 0 , stretch = 0;                                        //scale mode (RGA1).
E librga  : rgaVersion = 3.200000  , ditherEn =0                                //Hardware version, Y4 Dither enabled.
D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0                    //MMU enable flag, rotation mode.
D librga  : <<<<-------- rgaReg -------->>>>                                    //Parameters configuration of the driver are printed as follows.
E librga  : render_mode=0 rotate_mode=0                                         //RGA rendering mode, rotation mode.
E librga  : src:[0,b400007431ed6040,b400007431fb7040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of src channel.
E librga  : dst:[0,b400007431b4f040,b400007431c30040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of dst channel.
E librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0                        //Memory, image parameters, format information of pat/src1 channel. This channel is not used in current mode, therefore the parameters are set to 0. //The following are some of the parameters that developers usually don't have to care about, which is to configure for librga different modes of the driver.
E librga  : ROP:[0,0,0],LUT[0]                                                  //ROP and LUT configuration.
E librga  : color:[0,0,0,0,0]                                                   //Colorkey configuration（max color, min color）, color-filling configuration (foreground color, background color, color-filling).
E librga  : MMU:[1,0,80000521]                                                  //MMU configuration.
E librga  : mode[0,0,0,0]                                                       //Palette、 csc、colorkey configuration.
E librga  : Full CSC : en[0]                                                    //Full csc enabled flag.
E librga  : gr_color_x [0, 0, 0]                                                // Color-filling configuration, corresponding the value of R, G, B.
```

<!-- en PDF p.10 -->

### 3.2 Treiber-Debug-Knoten

<!-- en PDF p.10 -->

#### 3.2.1 Protokollschalter

<!-- en PDF p.10 -->

Adresse des Debug-Knotens. Die Kernelkonfiguration unterscheidet sich je SDK. RGA-Debug-Knoten liegen gewöhnlich in einem oder beiden folgenden Verzeichnissen. Bei standardmäßig aktivierter CONFIG_ROCKCHIP_RGA_DEBUG_FS:

<!-- en PDF p.10 -->

```text
/sys/kernel/debug
```

<!-- en PDF p.10 -->

Bei aktivierter Kerneloption ROCKCHIP_RGA_PROC_FS:

<!-- en PDF p.10 -->

```text
/proc
```

<!-- en PDF p.10 -->

Zusätzlich zur Standardeinstellung lässt sich der RGA-Debug-Pfad über die Kernel-Buildoptionen an das Projekt anpassen.

<!-- en PDF p.11 -->

#### 3.2.2 Namen der Debug-Knoten

<!-- en PDF p.11 -->

Die Knotennamen unterscheiden sich nach Treiber. In aktualisierten Treibern wird rkrga vereinheitlicht; rgax_debug ist veraltet.

<!-- en PDF p.11 -->

| Treibername | Knotenpfad |
| --- | --- |
| RGA Device Driver | rga_debug |
| RGA2 Device Driver(ohne Version) | rga2_debug |
| RGA2 Device Driver(v2.1.0) | rkrga |
| RGA multicore Device Driver | rkrga |

<!-- en PDF p.11 -->

#### 3.2.3 Funktionen der Debug-Knoten

<!-- en PDF p.11 -->

##### 3.2.3.1 Überblick

<!-- en PDF p.11 -->

rga_debug/rga2_debug unterstützen nur das Ein-/Ausschalten des Laufzeitprotokolls. rkrga bietet zusätzlich Last-, Versions- und Hardwareabfragen sowie Zustände der Speicher-/Auftragsverwaltung.

<!-- en PDF p.11 -->

##### 3.2.3.2 Laufzeitprotokoll

<!-- en PDF p.11 -->

###### 3.2.3.2.1 Protokollschalter

Name des Debug-Knotens

<!-- en PDF p.11 -->

| Treibername | Knotenpfad |
| --- | --- |
| RGA Device Driver | rga_debug/rga |
| RGA2 Device Driver(ohne Version) | rga2_debug/rga2 |
| RGA2 Device Driver(v2.1.0) | rkrga/debug |
| RGA multicore Device Driver | rkrga/debug |

<!-- en PDF p.11 -->

Debug-Beschreibung

<!-- en PDF p.12 -->

Die Protokollschaltung ist für verschiedene Treiberversionen identisch und erfolgt über rga/rga2/debug. Beispiel RGA multicore Device Driver: cat auf dem entsprechenden Knoten liefert die Funktionsbeschreibung:

<!-- en PDF p.12 -->

```text
/# cd /sys/kerne/debug/rkrga/
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
```

<!-- en PDF p.12 -->

- echo reg > debug: schaltet die Ausgabe der RGA-Registerkonfiguration um.
- echo msg > debug: schaltet die Ausgabe der von der höheren Ebene übergebenen Treiberparameter um.
- echo time > debug: schaltet die Laufzeitangabe jedes RGA-Aufrufs um.
- echo check > debug: schaltet interne Prüfungen insbesondere für Speicher und Ausrichtung um. Die gezeigte Ausgabe bedeutet Erfolg. Eine Grenzüberschreitung kann den Kernel abstürzen lassen; vorherige Protokolle helfen bei der Zuordnung zu src oder dst.
- echo stop > debug: schaltet den Arbeitszustand um; aktiviert kehrt RGA ohne Verarbeitung zurück, für Sonderfälle.
- echo int > debug: schaltet die Ausgabe aktueller Interrupt- und Zustandsregister nach Interrupt-Eintritt um.
- echo slt > debug: führt den internen Hardwaretest SLT aus; „rga slt success !“ bedeutet Erfolg.

Debug-Knoten umschalten:

<!-- en PDF p.13 -->

Ein- und Ausschaltbefehl sind gleich: Jeder Aufruf wechselt den Zustand. Über cat debug oder „open xxx“/„close xxx“ prüfen, ob der gewünschte Zustand erreicht ist. Beispiel: msg bei RGA multicore Device Driver aktivieren:

<!-- en PDF p.13 -->

```text
/# cd /sys/kernel/debug/rkrga/
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
/# echo msg > debug
/# cat debug
REG [DIS]
MSG [EN]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
/# echo msg > debug
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
'echo stop > debug' to enable/disable stop using hardware
```

<!-- en PDF p.14 -->

Protokollausgabe:

<!-- en PDF p.14 -->

```text
/# echo reg > /sys/kerne/debug/rkrga/debug
/# dmesg -c                     //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
/# echo reg > /sys/kernel/debug/rga2_debug/rga2
/# dmesg -c
[ 5096.412419] rga2: close rga2 reg!
```

<!-- en PDF p.14 -->

###### 3.2.3.2.2 Protokollbeschreibung

Zur Diagnose der RGA-Hardwarearbeit werden Protokolle benötigt. Nach der Übergabe der HAL-Parameter beschreiben folgende Meldungen die Parameter. Üblich sind msg, reg und time.

msg-Modus — RGA Device Driver, RGA2 Device Driver:

<!-- en PDF p.14 -->

```text
rga2: open rga2 test MSG!                               //Open 'msg' log printing.
rga2: cmd is RGA2_GET_VERSION                           //Get version number, which queries hardware version the first time each process calls librga.
rga2: cmd is RGA_BLIT_SYNC                              //Current working mode.
rga2: render_mode:bitblt,bitblit_mode=0,rotate_mode:0   //Render_mode: display calling interface, bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
rga2: src : y=0 uv=b4000072cc8bc040 v=b4000072cc99d040 aw=1280 ah=720 vw=1280 vh=720
xoff=0 yoff=0 format=RGBA8888
                                                        //Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself, xoff、yoff: offset in the x and y directions, format：image format.
rga2: dst : y=0 uv=b4000072cc535040 v=b4000072cc616040 aw=1280 ah=720 vw=1280 vh=720
xoff=0 yoff=0 format=RGBA8888
                                                        //Parameters of dst channel of image data.
rga2: mmu : src=01 src1=00 dst=01 els=00                //MMU enabled flag，0 for close，1 for open.
rga2: alpha : flag 0 mode0=0 mode1=0                    //Configuration of blending.
rga2: blend mode is no blend                            //Blend mode.
rga2: yuv2rgb mode is 0                                 //Csc mode.
rga2: *** rga2_blit_sync proc ***
```

<!-- en PDF p.14 -->

RGA multicore Device Driver — Speichermanagerprotokoll

<!-- en PDF p.15 -->

```text
rga: import buffer info:
rga_common: external: memory = 0xb400007458406000, type = virt_addr
                                                    //memory：memory value，type： memory type
rga_common: memory param: w = 1280, h = 720, f = RGBA8888(0x0), size = 0
                                                    //w/h/f：Describe the memory size in the form of image canvas, size: memory size
rga_dma_buf: iova_align size = 3686400
```

<!-- en PDF p.15 -->

Auftragsanforderungsprotokoll

<!-- en PDF p.15 -->

```text
rga: Blit mode: request id = 192732                 //running mode and request id
rga_debugger: render_mode = 0, bitblit_mode=0, rotate_mode = 0
                                                    //render_modedisplay calling interface，bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
rga_debugger: src: y = 19 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
                                                    //Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself.
rga_debugger: src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                                                    //, xoff、yoff: offset in the x and y directions, format：image format, rd_mode：Current channel read/write data mode（1：raster，2：FBC，3：tile 16*16）.
rga_debugger: dst: y=1a uv=0 v=e1000 aw=1280 ah=720 vw=1280 vh=720
                                                    //Parameters of dst channel of image data.
rga_debugger: dst: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
rga_debugger: mmu: mmu_flag=0 en=0                  //MMU enabled flag，0 for close，1 for open.This configuration is disabled when called with
rga_buffer_handle_t, and the driver chooses the optimal configuration.
rga_debugger: alpha: rop_mode = 0                   //alpha/ROP mode enable/disable.
rga_debugger: yuv2rgb mode is 0                     //CSC mode config
rga_debugger: set core = 0, priority = 0, in_fence_fd = -1
                                                    //set_core：user mode specified core，priority：user mode specified priority，in_fence_fd：acquire_fence fd passed by user mode.
```

<!-- en PDF p.15 -->

Hardwarezuordnungsprotokoll

<!-- en PDF p.16 -->

```text
rga_policy: start policy on core = 1
rga_policy: start policy on core = 2
rga_policy: start policy on core = 4                //Iterate over all core support cases.
rga_policy: RGA2 only support under 4G memory!      //Corresponding to the log of the reason why the core does not support.
rga_policy: optional_cores = 3                      //The current request can match the hardware core collection.
rga_policy: assign core: 1                          //The hardware core identifier bound after matching.
```

<!-- en PDF p.16 -->

Hardwarekonfigurationsprotokoll

<!-- en PDF p.16 -->

```text
rga3_reg: render_mode:bitblt, bitblit_mode=0, rotate_mode:0
rga3_reg: win0: y = ffc70000 uv = ffd51000 v = ffd89400 src_w = 1280 src_h = 720
rga3_reg: win0: vw = 1280 vh = 720 xoff = 0 yoff = 0 format = RGBA8888
rga3_reg: win0: dst_w = 1280, dst_h = 720, rd_mode = 0
rga3_reg: win0: rot_mode = 1, en = 1, compact = 1, endian = 0
rga3_reg: wr: y = ff8e0000 uv = ff9c1000 v = ff9f9400 vw = 1280 vh = 720
rga3_reg: wr: ovlp_xoff = 0 ovlp_yoff = 0 format = RGBA8888 rdmode = 0
rga3_reg: mmu: win0 = 00 win1 = 00 wr = 00
rga3_reg: alpha: flag 0 mode0=0 mode1=a0a
rga3_reg: blend mode is no blend
rga3_reg: yuv2rgb mode is 0
```

<!-- en PDF p.16 -->

reg-Modus

<!-- en PDF p.16 -->

```text
rga2: open rga2 reg!                                    //Open 'reg' log printing.
rga2: CMD_REG                                           //Configuration of command register.
rga2: 00000000 00000000 00000040 000e1040
rga2: 00119440 00000000 00000500 02cf04ff
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000040
rga2: 000e1040 00119440 00000500 02cf04ff
rga2: 00000000 00000000 0000ff00 ffffffff
rga2: 00000007 00000000 00000000 00000101
rga2: 07a80000 00000000 07a800e4 00000000
rga2: CSC_REG                                           //Configuration of full csc register.
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: CMD_READ_BACK_REG                                 //Read back of full command register.
rga2: 00000000 00000000 00000040 000e1040
rga2: 00119440 00000000 00000500 02cf04ff
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000040
rga2: 000e1040 00119440 00000500 02cf04ff
rga2: 00000000 00000000 0000ff00 ffffffff
rga2: 00000007 00000000 00000000 00000101
rga2: 07a80000 00000000 07a800e4 00000000
rga2: CSC_READ_BACK_REG                                 //Read back of full csc register.
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
```

<!-- en PDF p.17 -->

time-Modus — rga2

<!-- en PDF p.17 -->

```text
rga2: sync one cmd end time 2414                    //Print the RGA. hardware time of the work,in us.
```

<!-- en PDF p.17 -->

multi-rga: Versionen vor 1.3.0

<!-- en PDF p.17 -->

```text
rga3_reg: set cmd use time = 196                    //Time elapsed from start processing request to configuration register.
rga_job: hw use time = 554                          //Time-consuming from hardware startup to hardware interrupt return.
rga_job: (pid:3197) job done use time = 751         //Time-consuming from the start of processing the request to the completion of the request.
rga_job: (pid:3197) job clean use time = 933        //Time-consuming from the start of processing the request to the completion of the request resource processing.
```

<!-- en PDF p.17 -->

Version 1.3.0 und neuer

<!-- en PDF p.17 -->

```text
rga_mm: request[3300], get buffer_handle info cost 188 us
rga3_reg: request[3300], generate register cost time 2 us
rga3_reg: request[3300], set register cost time 301 us
rga_job: request[3300], hardware[RGA3_core0] cost time 539 us
rga_mm: request[3300], put buffer_handle info cost 153 us
rga_job: request[3300], job done total cost time 1023 us
rga_job: request[3300], job cleanup total cost time 1030 us
```

<!-- en PDF p.17 -->

##### 3.2.3.3 Versionsabfrage

<!-- en PDF p.17 -->

Folgende Befehle liefern Namen und Version des aktuellen Treibers:

<!-- en PDF p.17 -->

```text
/# cat driver_version
RGA multicore Device Driver: v1.2.23
```

<!-- en PDF p.18 -->

##### 3.2.3.4 Lastabfrage

<!-- en PDF p.18 -->

Folgender Befehl fragt die RGA-Auslastung ab:

<!-- en PDF p.18 -->

```text
/# cat load
num of scheduler = 3                                    //The number of hardware cores currently equipped.
================= load ==================
scheduler[0]: rga3_core0
         load = 0%                                      //Core load ratio.
-----------------------------------
scheduler[1]: rga3_core1
         load = 0%
-----------------------------------
scheduler[2]: rga2
         load = 0%
-----------------------------------
```

<!-- en PDF p.18 -->

##### 3.2.3.5 Abfrage des Speichermanagers

<!-- en PDF p.18 -->

Folgender Befehl fragt den Speicherzustand im Speichermanager ab:

<!-- en PDF p.18 -->

```text
/# cat mm_session
rga_mm dump:
buffer count = 3                                        //The number of buffers saved in the memory manager
===============================================================
handle = 34 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb400007286e1c000, pages = 0x00000000ae081f65, size = 3686400
         iova = 0xffc70000, offset = 0x0, sgt = 0x00000000cc976f9e, size = 3686400, map_core = 0x1
                                                        //memory information
---------------------------------------------------------------
handle = 35 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb400007286a95000, pages = 0x000000002f083efc, size = 3686400
         iova = 0xff8e0000, offset = 0x0, sgt = 0x0000000062bb1297, size = 3686400, map_core = 0x1
---------------------------------------------------------------
handle = 36 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb40000728670e000, pages = 0x00000000785fef63, size = 3686400
         iova = 0xff550000, offset = 0x0, sgt = 0x00000000cdd7688d, size = 3686400, map_core = 0x1
---------------------------------------------------------------
```

<!-- en PDF p.19 -->

##### 3.2.3.6 Auftragsabfrage

<!-- en PDF p.19 -->

Folgender Befehl fragt den Auftragszustand im Job manager ab:

<!-- en PDF p.19 -->

```text
/# cat request_manager
rga internal request dump:
request count = 1                                       //The number of job requests in the job manager.
===============================================================
------------------ request: 200073 ------------------
         set cmd num: 1, finish job: 0, failed job: 0, flags = 0x0, ref = 2
                                                        //Job request completion status.
         cmd dump:                                      //Job request information.
                 rotate_mode = 0
                 src: y = 25 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
                 src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                 dst: y=26 uv=0 v=e1000 aw=1280 ah=720 vw=1280 vh=720
                 dst: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                 mmu: mmu_flag=0 en=0
                 alpha: rop_mode = 0
                 yuv2rgb mode is 0
                 set core = 0, priority = 0, in_fence_fd = -1
```

<!-- en PDF p.19 -->

##### 3.2.3.7 Hardwareinformationen abfragen

<!-- en PDF p.19 -->

Folgender Befehl fragt die aktuellen Hardwareinformationen ab:

<!-- en PDF p.19 -->

```text
/# cat hardware
===================================
rga3_core0, core 1: version: 3.0.76831                  //Parameters such as the hardware version equipped with the core and supported function options.
input range: 68x2 ~ 8176x8176
output range: 68x2 ~ 8128x8128
scale limit: 1/8 ~ 8
byte_stride_align: 16
max_byte_stride: 32768
csc: RGB2YUV 0xf YUV2RGB 0xf
feature: 0x4
mmu: RK_IOMMU
-----------------------------------
rga3_core1, core 2: version: 3.0.76831
input range: 68x2 ~ 8176x8176
output range: 68x2 ~ 8128x8128
scale limit: 1/8 ~ 8
byte_stride_align: 16
max_byte_stride: 32768
csc: RGB2YUV 0xf YUV2RGB 0xf
feature: 0x4
mmu: RK_IOMMU
-----------------------------------
rga2, core 4: version: 3.2.63318
input range: 2x2 ~ 8192x8192
output range: 2x2 ~ 4096x4096
scale limit: 1/16 ~ 16
byte_stride_align: 4
max_byte_stride: 32768
csc: RGB2YUV 0x7 YUV2RGB 0x7
feature: 0x5f
mmu: RGA_MMU
-----------------------------------
```

<!-- en PDF p.20 -->

##### 3.2.3.8 Laufzeitdaten ausgeben

<!-- en PDF p.20 -->

Zur Diagnose können die nächsten RGA-Frames über den Debug-Knoten in ein angegebenes Verzeichnis geschrieben werden. Fehlt der Knoten, unterstützt der aktuelle Kernel diese Datenausgabe nicht. Den Dump-Pfad festlegen; bei Aktivierung werden die Daten dort gespeichert.

<!-- en PDF p.20 -->

```text
/# echo /data/rga_image > dump_path
/# dmesg -c
rga_debugger: dump path change to: /data/rga_image
```

<!-- en PDF p.20 -->

Die Anzahl auszugebender Frames festlegen.

<!-- en PDF p.20 -->

```text
/# echo 1 > dump_image
/# dmesg -c
rga_debugger: dump image 1

.... RGA running ....

/# dmesg -c
rga_debugger: dump image to:
/data/rga_image/1_core1_src_plane0_virt_addr_w1280_h720_RGBA8888.bin
rga_debugger: dump image to:
/data/rga_image/1_core1_dst_plane0_virt_addr_w1280_h720_RGBA8888.bin

/# ls /data/rga_image/
1_core1_dst_plane0_virt_addr_w1280_h720_RGBA8888.bin
1_core1_src_plane0_virt_addr_w1280_h720_RGBA8888.bin
                                                        //Input (src), output (dst) running image data
```

<!-- en PDF p.21 -->

## 4. Fragen und Antworten

<!-- en PDF p.21 -->

Nachfolgend häufige RGA-Fragen. Ist ein Problem nicht enthalten, Protokolle und erste Analyse zusammenstellen und über redmine an die RGA-Modulbetreuung übergeben.

<!-- en PDF p.21 -->

### 4.1 Leistung

<!-- en PDF p.21 -->

Q1.1: Wie lässt sich die RGA-Effizienz abschätzen?

A1.1: Beim Kopieren beträgt die theoretische Bildzeit width × height / Pixel pro Sekunde, also width × height / (Pixel pro Takt × RGA-Frequenz). Die Formel gilt nur für Datenkopien. Für 1920 × 1080 bei 300M:

- RGA1: 1920 × 1080 / (1 × 300000000) = 0.006912s
- RGA2: 1920 × 1080 / (2 × 300000000) = 0.003456s
- RGA3: 1920 × 1080 / (4 × 300000000) = 0.001728s

Die tatsächliche Zeit hängt vom Speichertyp ab. Absteigende Effizienz: physical address > dma_fd > virtual address. Ohne Systemlast benötigen physische Adressen etwa das 1.1–1.2-Fache, dma_fd das 1.3–1.5-Fache und virtuelle Adressen das 1.8–2.1-Fache der theoretischen Zeit; Letztere hängen stark von der CPU ab. dma_fd ist üblicherweise der empfohlene Kompromiss aus Zugänglichkeit und Effizienz. Virtuelle Adressen dienen vor allem dem einfachen Einstieg. Nachfolgend Quellmessungen auf RK3566 ohne Last bei verschiedenen RGA-Frequenzen. Testumgebung:

<!-- en PDF p.22 -->

| Chipplattform | RK3566 |
| --- | --- |
| Systemplattform | Android 11 |
| RGA-Frequenz | 300 M |
| CPU-Frequenz | 1.8 Ghz |
| GPU-Frequenz | 800 M |
| DDR-Frequenz | 1056 M |

<!-- en PDF p.22 -->

Testdaten:

<!-- en PDF p.22 -->

| Auflösung | Speichertyp | Theoretische Zeit(us) | Tatsächliche Zeit(us) |
| --- | --- | --- | --- |
| 1280 × 720 | GraphicBuffer(cache) | 1,536 | 2,620 |
| 1280 × 720 | GraphicBuffer(ohne Cache) | 1,536 | 2,050 |
| 1280 × 720 | Drm buffer(cache) | 1,536 | 2,190 |
| 1280 × 720 | Physische Adresse(Drm) | 1,536 | 2,000 |
| 1920 × 1080 | GraphicBuffer(cache) | 3,456 | 5,500 |
| 1920 × 1080 | GraphicBuffer(ohne Cache) | 3,456 | 4,180 |
| 1920 × 1080 | Drm buffer(cache) | 3,456 | 4,420 |
| 1920 × 1080 | Physische Adresse(Drm) | 3,456 | 4,100 |
| 3840 × 2160 | GraphicBuffer(cache) | 13,824 | 21,500 |
| 3840 × 2160 | GraphicBuffer(ohne Cache) | 13,824 | 15,850 |
| 3840 × 2160 | Drm buffer(cache) | 13,824 | 16,800 |
| 3840 × 2160 | Physische Adresse(Drm) | 13,824 | 15,600 |

<!-- en PDF p.22 -->

Q1.2: Wie werden andere Modi ohne eigene Formel bewertet?

A1.2: Verfügbar ist nur die Kopierformel. Bei Skalierung/Zuschnitt kann das größere der beiden Bildformate eingesetzt werden; die Zeit schwankt abhängig von Skalierung und Zuschnitt. Modi ohne Auflösungsänderung wie Blending benötigen etwa das 1.1–1.2-Fache einer Kopie. Wegen des DDR-Bandbreiteneinflusses sind Messungen im Zielszenario maßgeblich.

<!-- en PDF p.22 -->

Q1.3: Warum benötigt RGA in manchen Szenarien bis zu doppelt so lange wie die Demo?

<!-- en PDF p.23 -->

A1.3: RGA hat auf den beschriebenen RK-Plattformen die niedrigste Buspriorität. Bei knapper Bandbreite, etwa mehreren ISP-Kanälen, verzögern sich DDR-Lese-/Schreibzugriffe; Latenz steigt und Leistung sinkt.

<!-- en PDF p.23 -->

Q1.4: Wie lässt sich unzureichende RGA-Leistung verbessern?

A1.4: Manche Werksfirmwares vor 2021 verwenden nicht die maximale Frequenz. Beispielsweise erreichen 3399 und 1126 bis zu 400M. Möglich sind temporäre Befehle (nach Neustart zurückgesetzt) oder DTS-Änderungen. RGA-Frequenz abfragen:

<!-- en PDF p.23 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep rga                //Query rga frequency.
```

<!-- en PDF p.23 -->

RGA-Frequenz ändern:

<!-- en PDF p.23 -->

```text
echo 400000000 > /sys/kernel/debug/clk/aclk_rga/clk_rate        //Modify 400000000 to the needed frequency.
```

<!-- en PDF p.23 -->

Eine DTS-Änderung bleibt nach Neustart erhalten. Nachfolgend ein RK3288-Beispiel; andere Plattformen entsprechend im jeweiligen DTS ändern.

<!-- en PDF p.23 -->

```text
diff --git a/arch/arm/boot/dts/rk3288-android.dtsi b/arch/arm/boot/dts/rk3288-android.dtsi
index 02938b0..10a1dc4 100644
--- a/arch/arm/boot/dts/rk3288-android.dtsi
+++ b/arch/arm/boot/dts/rk3288-android.dtsi
@@ -450,6 +450,8 @@
        compatible = "rockchip,rga2";
        clocks = <&cru ACLK_RGA>, <&cru HCLK_RGA>, <&cru SCLK_RGA>;
        clock-names = "aclk_rga", "hclk_rga", "clk_rga";
+       assigned-clocks = <&cru ACLK_RGA>, <&cru SCLK_RGA>;
+       assigned-clock-rates = <300000000>, <300000000>;
        dma-coherent;
 };
```

<!-- en PDF p.23 -->

Q1.5: Kann die RGA-Auslastung per Befehl/API abgefragt werden?

A1.5: RGA multicore Device Driver unterstützt Lastabfragen. Siehe „Debugging → Treiber-Debug-Knoten → Funktionen → Lastabfrage“.

<!-- en PDF p.23 -->

Q1.6: Warum sind asynchrone Aufrufe manchmal langsamer als synchrone?

<!-- en PDF p.24 -->

A1.6: Bei RGA Device Driver/RGA2 Device Driver ist der Bezeichner des asynchronen Modus der offene Geräteknoten. Das librga-Singleton öffnet pro Prozess nur einen fd; imsync() wartet deshalb auf alle asynchronen Arbeiten des Prozesses. RGA multicore Device Driver nutzt fence pro Anfrage und hat dieses Problem nicht.

<!-- en PDF p.24 -->

Q1.7: RGA-Kopieren über virtuelle Adressen ist langsamer als memcpy; ist Optimierung möglich?

A1.7: Virtuelle Adressen werden normalerweise nicht empfohlen, da ihre Effizienz bei hoher CPU-Last stark sinkt. Die CPU berechnet die virtuelle-zu-physische Adresstabelle, was bereits zeitaufwendig ist. Zudem fehlt gewöhnlich eine Userspace-Schnittstelle zur Cache-Synchronisierung; der Treiber erzwingt diese für jeden Frame. Physische Adressen oder dma_fd werden empfohlen.

<!-- en PDF p.24 -->

Q1.8: Warum verursacht ein RGA-Aufruf hohe CPU-Last?

A1.8: Neben der notwendigen Grundlast verursachen folgende Fälle zusätzliche Last:

<!-- en PDF p.24 -->

1) Virtuelle Adressen sind CPU-Zugriffsadressen; die CPU muss anhand der Prozessabbildung eine hardwarelesbare Tabelle physischer Adressen berechnen. Das erzeugt Zusatzlast. In Produkten dma-buf fd verwenden, sofern die Geschäftslogik nicht ausschließlich virtuelle Adressen besitzt und diese Last unerheblich ist.

<!-- en PDF p.24 -->

2) Bei cachebaren virtuellen Adressen synchronisiert der RGA-Treiber den Cache vor und nach Hardwarezugriffen zwangsweise. Dies belastet die CPU. Übliche virtuelle Speicherallokatoren sind nicht auf andere Hardwarezugriffe ausgelegt und bieten keine geeignete Synchronisationsschnittstelle; daher übernimmt der Treiber diese Aufgabe.

<!-- en PDF p.24 -->

3) Einige dma-buf-Allokatoren erzeugen standardmäßig cachebare Puffer. Die Kernelverarbeitung erzwingt die Cache-Synchronisierung bei jedem RGA-Aufruf und verursacht hohe CPU-Last. In diesem Fall dma-buf ohne Cache allozieren.

<!-- en PDF p.24 -->

Q1.9: Warum ist RGA mit 8G DDR langsamer als mit 4G?

A1.9: Die MMU von RGA1/RGA2 unterstützt höchstens 32-Bit-Physikadressen. Bei Geräten mit mindestens 4G DDR und Puffern oberhalb 4G kopiert der Treiber die Daten über DMA in swiotlb-reservierten Speicher und übergibt dessen Adresse an RGA. Anschließend wird das Ergebnis zurückkopiert. CPU-Beteiligung und librga-Laufzeit steigen stark. Bei ausschließlich RGA1/RGA2 und mehr als 4GB DDR

<!-- en PDF p.25 -->

Speicher unterhalb 4GB verwenden, um die Effizienz zu erhalten. RGA Multicore Device Driver deaktiviert swiotlb bei nicht zugänglichem Speicher und meldet einen Fehler, damit geeigneter Speicher alloziert und erneut aufgerufen wird. So bleibt die Effizienz erhalten. Übliche Protokolle, HAL:

<!-- en PDF p.25 -->

```text
RgaBlit(1483) RGA_BLIT fail: Invalid argument
Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
```

<!-- en PDF p.25 -->

Hardwarezuordnungsprotokoll:

<!-- en PDF p.25 -->

```text
rga_policy: invalid function policy                         //Indicates that there are invalid parameters, which means that no hardware can access the memory configured by the current request.
rga_job: job assign failed                                  //Failed to match hardware core
rga_job: failed to get scheduler, rga_job_commit(403)
rga_job: (pid:3524) job clean use time = 19
rga_job: request[282567] task[0] job_commit failed.
rga_job: rga request commit failed!
rga: request[282567] submit failed!
```

<!-- en PDF p.25 -->

Treiber-Laufzeitprotokoll:

<!-- en PDF p.25 -->

```text
rga_policy: start policy on core = 4
[82116.782252] rga_policy: RGA2 only support under 4G memory!
                                                            //Indicates that the currently equipped RGA2 core only supports memory within 4G. [82116.782256] rga_policy: optional_cores = 0 [82116.782258] rga_policy: invalid function policy [82116.782260] rga_policy: assign core: -1 [82116.782262] rga_job: job assign failed
```

<!-- en PDF p.25 -->

In diesem Szenario Speicher innerhalb 4G allozieren. Beispiele:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma32_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_graphicbuffer_demo.cpp`

<!-- en PDF p.25 -->

Q1.10: Warum dauert die API länger als die protokollierte Hardwarezeit?

Q1.10.1: TIME zeigt lange map/unmap-buffer-Zeiten.

Q1.10.2: Zwischen MSG- und REG-Zeitstempeln liegt ein großer Abstand.

Q1.10.3: Bei gleichen Parametern ergeben unterschiedliche Allokatoren stark unterschiedliche Laufzeiten.

<!-- en PDF p.26 -->

A1.10: Ursache ist map/unmap externer Puffer. Jeder externe Puffer muss für den Hardwarezugriff im RGA-Treiber abgebildet und gebunden werden. Unterschiedliche Allokatorimplementierungen verursachen verschiedene map/bind-Kosten; die API erscheint deshalb deutlich langsamer als die Hardware. ION und V4L2 haben häufig hohe Zusatzkosten, meist durch Cache-Synchronisierung. Ein Allokatorvergleich kann dies bestätigen. Optimierungen:

<!-- en PDF p.26 -->

1) Einen Allokator mit günstigeren map/unmap-Kosten wählen, etwa dma_heap, DRM oder entsprechende Wrapper. RGA-Beispiele:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_drm_demo.cpp`

<!-- en PDF p.26 -->

2) Problematisch ist rga_buffer_t über wrapbuffer_fd() oder importbuffer_fd für nur einen Frame mit sofortigem releasebuffer_handle. Für Tests oder ständig wechselnde Puffer ist das normal, wiederholte Allokation im Produkt jedoch ineffizient. Den gesamten Pufferablauf wie folgt optimieren:

<!-- en PDF p.26 -->

1. buffer_pool mit Umlaufpuffern anlegen; Größe nach Anwendung wählen.

<!-- en PDF p.26 -->

2. Puffer über importbuffer_fd() importieren und RGA-buffer_handle erhalten.

<!-- en PDF p.26 -->

3. Bildoperationen über wechselnde buffer_handle ausführen und die Puffer zyklisch wiederverwenden.

<!-- en PDF p.26 -->

4. Wird buffer_pool nicht mehr benötigt, mit releasebuffer_handle() die RGA-Referenzen freigeben, damit die Puffer anschließend zerstört werden können.

<!-- en PDF p.26 -->

5. Nicht mehr benötigte buffer_pool-Puffer freigeben. Selbst teures map/unmap fällt dann nur in importbuffer_fd()/releasebuffer_handle() an, nicht bei jedem Frame. Dadurch werden Leistungsunterschiede durch Allokatorimplementierungen vermieden.

<!-- en PDF p.26 -->

3) Können Allokator und Ablauf nicht geändert werden, bleibt nur eine Änderung seines map/unmap. Das ist gefährlich und setzt Kenntnis sämtlicher Nutzungen dieses Allokators voraus. Über redmine technische Unterstützung der zuständigen Allokatorbetreuung anfordern.

<!-- en PDF p.26 -->

Q1.11: Warum dauern importbuffer_fd()/importbuffer_virtualaddr() lange, und warum sind sie nötig?

<!-- en PDF p.27 -->

A1.11: Die Verwendung steht in docs/Rockchip_Developer_Guide_RGA_EN unter „Overview → Image Buffer Preprocessing“. importbuffer_xx() importiert externe Puffer in den Treiber, sodass spätere Frames über buffer_handle schnell darauf zugreifen. Der Import ist aufwendig: Puffer müssen abgebildet sowie physische Adressen und Pufferinformationen gespeichert werden. Dies ist für RGA unverzichtbar.

<!-- en PDF p.27 -->

Q1.12: Unterstützt RGA parallele Verarbeitung? Warum steigt oder verdoppelt sich die Framezeit bei mehreren Threads?

A1.12: Die API unterstützt parallele Thread-/Prozessaufrufe; die Hardwareparallelität ist jedoch durch die RGA-Kernzahl begrenzt. Zusätzliche Aufgaben warten auf freie Kerne und erhöhen damit die Framezeit. Kernzahl und Funktionen lassen sich über folgende Knoten abfragen; Details im Abschnitt Hardwareinformationen:

<!-- en PDF p.27 -->

```text
/# cat hardware
```

<!-- en PDF p.27 -->

### 4.2 Funktionen

<!-- en PDF p.27 -->

Q2.1: Wie werden RGA-Version und Funktionen des aktuellen Chips ermittelt?

A2.1: Siehe Rockchip_Developer_Guide_RGA_EN — Overview. librga-Quellpfade je SDK:

- Android 7.0 und neuer: hardware/rockchip/librga
- Android 7.0 und älter: hardware/rk29/librga
- Linux: external/linux-rga.

<!-- en PDF p.27 -->

Q2.2: Wie wird RGA zur Hardwarebeschleunigung aufgerufen? Gibt es eine Demo?

<!-- en PDF p.28 -->

A2.2: 1) Schnittstellen stehen in Rockchip_Developer_Guide_RGA_EN — API.

<!-- en PDF p.28 -->

2) Die Demo liegt in sample/rga_im2d_demo. Sie implementiert die meisten APIs und ruft Funktionen per Befehl auf; sie eignet sich auch als Funktionstest. Einsteigern wird empfohlen, sie auszuführen, Ergebnisse zu prüfen, Parameter anzupassen und erst danach APIs im eigenen Projekt einzusetzen.

<!-- en PDF p.28 -->

3) Typische Beispiele im Verzeichnis samples:

- allocator_demo: Speicherallokatoren

<!-- en PDF p.28 -->

- alpha_demo: Alpha-Blending und Überlagerung

<!-- en PDF p.28 -->

- async_demo: Asynchroner Modus

<!-- en PDF p.28 -->

- config_demo: Globale Threadkonfiguration

<!-- en PDF p.28 -->

- copy_demo: Bildtransfer und Kopieren

<!-- en PDF p.28 -->

- crop_demo: Bildzuschnitt und Zusammenfügen

<!-- en PDF p.28 -->

- cvtcolor_demo: Format- und Farbraumkonvertierung

<!-- en PDF p.28 -->

- fill_demo: Bildfüllung

<!-- en PDF p.28 -->

- mosaic_demo: Mosaik

<!-- en PDF p.28 -->

- padding_demo: Padding

<!-- en PDF p.28 -->

- resize_demo: Größenänderung

<!-- en PDF p.28 -->

- rop_demo: ROP

<!-- en PDF p.28 -->

- transform_demo: Bildverarbeitung

<!-- en PDF p.28 -->

Q2.3: Welche Fähigkeiten unterstützt RGA?

Q2.3.1: Welche Formate werden unterstützt?

A2.3.1: Siehe Rockchip_Developer_Guide_RGA_EN — Overview — Image Format Supported für die jeweilige Chipversion. Ein-/Ausgabeformate der aktuellen Hardware liefert querystring(RGA_INPUT_FORMAT \| RGA_OUTPUT_FORMAT);.

Q2.3.2: Welcher Skalierungsbereich wird unterstützt?

<!-- en PDF p.29 -->

A2.3.2: Siehe Rockchip_Developer_Guide_RGA_EN — Overview — Design Index oder querystring(RGA_SCALE_LIMIT);.

Q2.3.3: Was ist die maximale Auflösung?

A2.3.3: Siehe denselben Abschnitt Design Index oder querystring(RGA_MAX_INPUT \| RGA_MAX_OUTPUT); für maximale Ein-/Ausgabeauflösungen.

A2.3: Für Unterstützungseigenschaften generell das ausführliche Rockchip_Developer_Guide_RGA_EN heranziehen.

<!-- en PDF p.29 -->

Q2.4: Wie unterscheiden sich alte und neue librga?

A2.4: Die alte Version kann keine Versionsnummer abfragen und wird nicht mehr gepflegt. Sie ist meist in SDKs vor November 2020 enthalten, bei einzelnen Plattformen auch später, etwa RK3399 Linux SDK vor Juni 2021 (V2.5 und älter). Mit neuen Treibern können Farb- und Formatfehler auftreten; diese Kombination wird nicht empfohlen. Bei neuem Kernel librga aktualisieren und umgekehrt. Die hauptsächlich unterstützte Version erlaubt Versionsabfragen und enthält im2d_api. Sie integriert die alte librga, ergänzt die einfachere IM2D API und heißt auch IM2D librga. Neben IM2D werden alte RockchipRga/C_XXX unterstützt; Details in Rockchip_Developer_Guide_RGA_EN. querystring(RGA_VERSION); liefert die Softwareversion. Das gesamte SDK aktualisieren, um Abhängigkeitsprobleme zu vermeiden. Neue librga mit altem Treiber oder alte librga mit neuem Kernel werden ausdrücklich nicht empfohlen, da deutliche Fehler auftreten können.

<!-- en PDF p.29 -->

Q2.5: Gibt es Ausrichtungsanforderungen?

A2.5: Sie hängen vom Format ab. RGA liest Bildzeilen wortausgerichtet, also 4 Byte/32 Bit. RGBA benötigt 32 Bit (4 × 8bit) pro Pixel und keine zusätzliche Ausrichtung. RGB565 benötigt 16 Bit (5+6+5), daher Zweierausrichtung; RGB888 benötigt 24 Bit (3 × 8bit), daher Viererausrichtung für 32-Bit-Zugriffe. YUV verlangt formatbedingt Zweierausrichtung; der Y-Kanal hat 8 Bit pro Pixel und erfordert Viererausrichtung für RGA. UV-Speicher je vier Pixel hängt von 420/422 ab; insgesamt ist Viererausrichtung nötig. Für andere Formate gilt das gleiche Prinzip. Die genannte Ausrichtung betrifft

<!-- en PDF p.30 -->

width stride. Tatsächliche YUV-Breite, -Höhe und Offsets müssen formatbedingt zusätzlich zweierausgerichtet sein. Genaue Vorgaben: Rockchip_Developer_Guide_RGA_EN — Overview — Image Format Alignment Instructions.

<!-- en PDF p.30 -->

Q2.6: Können mehrere Rechtecke oder Operationen gleichzeitig bearbeitet werden?

A2.6: RGA-Hardwareaufgaben laufen sequenziell: Die nächste beginnt nach Abschluss der vorherigen. Statt mehrere Rechtecke auf einmal zu zeichnen, können Aufgaben asynchron an die Treiberwarteschlange übergeben und nacheinander ausgeführt werden. Vor weiterer Pufferverarbeitung prüft die höhere Ebene mit imsync() den Hardwareabschluss.

<!-- en PDF p.30 -->

Q2.7: Unterstützt die Füllfunktion YUV?

A2.7: Alte librga unterstützt dies nicht. Erforderlich ist eine neuere Version mit folgendem Commit; fehlt er, das SDK aktualisieren.

<!-- en PDF p.30 -->

```text
commit 8c526a6bb9d0e43b293b885245bb53a3fa8ed7f9
Author: Yu Qiaowei <cerf.yu@rock-chips.com>
Date:   Wed Dec 23 10:57:28 2020 +0800

    Color fill supports YUV format as input source.

    Signed-off-by: Yu Qiaowei <cerf.yu@rock-chips.com>
    Change-Id: I0073c31d770da513f81b9b64e4c27fee2650f30b
```

<!-- en PDF p.30 -->

Der Aufruf entspricht der RGB-Füll-API: Die Farbe wird als RGB-Wert angegeben, die Ausgabe kann jedoch YUV sein.

<!-- en PDF p.30 -->

Q2.8: Wird YUYV unterstützt?

A2.8: Alte librga aus SDKs vor Oktober 2020 unterstützt YUYV nicht. Benötigt wird eine neue Version mit im2d_API im Quellverzeichnis und folgendem Commit. Fehlt er, das SDK aktualisieren.

<!-- en PDF p.30 -->

```text
commit db278db815d147c0ff7a80faae0ea795ceffd341
Author: Yu Qiaowei <cerf.yu@rock-chips.com>
Date:   Tue Nov 24 19:50:17 2020 +0800

    Add support for Y4/YUV400/YUYV in imcheck().

    Signed-off-by: Yu Qiaowei <cerf.yu@rock-chips.com>
    Change-Id: I3cfea7c8bb331b65b5bc741956da47924eeda6e1
```

<!-- en PDF p.31 -->

Q2.9: Wird Skalierung mit Graustufenein-/ausgabe unterstützt?

A2.9: Alte librga aus SDKs vor Oktober 2020 unterstützt das Format nicht; Graustufeneingaben werden ab neuer librga 1.2.2 mit im2d_API unterstützt. Ältere Versionen aktualisieren. Die Hardware hat kein eigenes Graustufenformat: RK_FORMAT_Y400 ist YUV ohne UV; allein Y liefert 256 Graustufen. Den Farbbereich beachten: CSC nach YUV nutzt standardmäßig BT.601 limited range, dessen Y nicht 0–255 umfasst. Bei RGB→YUV mit Y400-Ausgabe full range für die Farbraumkonvertierung konfigurieren.

<!-- en PDF p.31 -->

Q2.10: Warum liefert RK3399-ROP-Code auf RV1126 kein entsprechendes Ergebnis?

A2.10: Beide nutzen RGA2-ENHANCE, jedoch unterschiedliche Unterversionen; bei RV1126 entfällt ROP. Unterstützung in Rockchip_Developer_Guide_RGA_EN oder mit querystring(RGA_FEATURE); prüfen.

<!-- en PDF p.31 -->

Q2.11: Warum erzeugt RGB↔YUV starke Rosa-/Grünstiche, obwohl andere Funktionen normal arbeiten? Erwartetes Ergebnis:

<!-- en PDF p.31 -->

![Originalabbildung aus englischem PDF — p.31](/docs/rockchip-rga-faq/assets/en-p031-figure-01.png)

*Originalabbildung aus englischem PDF — p.31*

<!-- en PDF p.31 -->

Tatsächliches Ergebnis:

<!-- en PDF p.32 -->

![Originalabbildung aus englischem PDF — p.32](/docs/rockchip-rga-faq/assets/en-p032-figure-01.png)

*Originalabbildung aus englischem PDF — p.32*

<!-- en PDF p.32 -->

A2.11: Meist passen librga- und Kernelversion nicht zusammen; siehe A2.4. Typisch ist librga von GitHub in einem SDK vor November

<!-- en PDF p.32 -->

2020. Die neue librga passt nicht zum alten Treiber; geänderte Farbraumeinstellungen erzeugen deutliche Farbfehler. Lösungen: SDK/Treiber aktualisieren und Versionen abstimmen oder die mitgelieferte librga verwenden, falls neue Funktionen nicht benötigt werden.

<!-- en PDF p.32 -->

Q2.12: Wie werden OSD-Untertitel überlagert? Erwartetes Ergebnis:

<!-- en PDF p.33 -->

![Originalabbildung aus englischem PDF — p.33](/docs/rockchip-rga-faq/assets/en-p033-figure-01.png)

*Originalabbildung aus englischem PDF — p.33*

<!-- en PDF p.33 -->

A2.12: Für RGB-Ausgabe imblend(), gewöhnlich src over, verwenden: src liegt über dst. Für YUV imcomposite(), gewöhnlich dst over: src1 liegt über src, Ausgabe nach dst. Grundlage ist Porter–Duff; Details in Rockchip_Developer_Guide_RGA_EN — API — Image Blending. Die Konfiguration unterscheidet sich wegen der drei RGA2-Kanäle: src unterstützt YUV2RGB, src1/pat und dst nur RGB2YUV. Intern wird in RGB gemischt. Für RGB über YUV muss deshalb YUV-Hintergrund an src und RGB-Vordergrund an src1 liegen; dst konvertiert das gemischte RGB nach YUV. Beispiele:

`<librga_souce_path>/samples/alpha_demo/src/rga_alpha_osd_demo.cpp`

`<librga_souce_path>/samples/alpha_demo/src/rga_alpha_yuv_demo.cpp`

<!-- en PDF p.33 -->

Q2.13: Warum unterscheiden sich Helligkeit oder Zahlenwerte bei YUV↔RGB?

A2.13: Zwei Hauptursachen:

<!-- en PDF p.33 -->

1) Bei gleichen Einstellungen können einzelne Pixel meist um 1 abweichen, bedingt durch die CSC-Rechengenauigkeit. RGA1/RGA2 verwenden 8bit Nachkommagenauigkeit, RGA3 10bit; Rundung verursacht ±1 Fehler.

<!-- en PDF p.34 -->

2) Unterschiedliche CSC-Modi für RGB2YUV und YUV2RGB. Neue librga nutzt standardmäßig in beiden Richtungen BT.601-limit_range; falsches color_space_mode verursacht große Unterschiede. Alte librga verwendet standardmäßig RGB2YUV BT.601-full_range und YUV2RGB BT.709-limit_range, wodurch Hin-/Rückkonvertierung stark abweichen.

<!-- en PDF p.34 -->

Q2.14: Wie wird der Farbraum konfiguriert?

A2.14: Beide librga-Versionen unterstützen dies.

<!-- en PDF p.34 -->

1) Neue Version: Rockchip_Developer_Guide_RGA_EN — API — Image Format Conversion; insbesondere mode konfigurieren.

<!-- en PDF p.34 -->

2) Alte Version: yuvToRgbMode im Quellcode Normal/NormaRga.cpp ändern. Parameter:

<!-- en PDF p.34 -->

| Formatkonvertierung | Farbraum | Parameter |
| --- | --- | --- |
| YUV2RGB | BT.601-limit_range | yuvToRgbMode = 0x1 &lt;&lt; 0; |
| YUV2RGB | BT.601-full_range | yuvToRgbMode = 0x2 &lt;&lt; 0; |
| YUV2RGB | BT.709-limit_range | yuvToRgbMode = 0x3 &lt;&lt; 0; |
| RGB2YUV | BT.601-limit_range | yuvToRgbMode = 0x2 &lt;&lt; 4; |
| RGB2YUV | BT.601-full_range | yuvToRgbMode = 0x1 &lt;&lt; 4; |
| RGB2YUV | BT.709-limit_range | yuvToRgbMode = 0x3 &lt;&lt; 4; |

<!-- en PDF p.34 -->

Q2.15: Warum zeigt Alpha-Überlagerung keinen Effekt?

A2.15: Prüfen, ob beide Alpha-Werte 0xFF sind. Bei Vordergrund-Alpha 0xFF überdeckt dieser den Hintergrund vollständig. Das wirkt wie fehlender Effekt, ist aber korrekt.

<!-- en PDF p.34 -->

Q2.16: Warum ist der Vordergrund bei alpha=0x0 nicht vollständig transparent? Vordergrundbild: Schwarz, Weiß und rockchip haben alpha=0x00.

<!-- en PDF p.35 -->

![Originalabbildung aus englischem PDF — p.35](/docs/rockchip-rga-faq/assets/en-p035-figure-01.png)

*Originalabbildung aus englischem PDF — p.35*

<!-- en PDF p.35 -->

Erwartetes Ergebnis:

<!-- en PDF p.35 -->

![Originalabbildung aus englischem PDF — p.35](/docs/rockchip-rga-faq/assets/en-p035-figure-02.png)

*Originalabbildung aus englischem PDF — p.35*

<!-- en PDF p.35 -->

Tatsächliches Ergebnis:

<!-- en PDF p.36 -->

![Originalabbildung aus englischem PDF — p.36](/docs/rockchip-rga-faq/assets/en-p036-figure-01.png)

*Originalabbildung aus englischem PDF — p.36*

<!-- en PDF p.36 -->

A2.16: Die Standardkonfiguration setzt voraus, dass Farbwerte bereits mit Alpha vormultipliziert sind. Direkt gelesene Originalbilder sind nicht vormultipliziert; imblend benötigt daher ein zusätzliches Flag für diese nicht vormultiplizierten Farbwerte. Aufrufdetails: Rockchip_Developer_Guide_RGA_EN — API — Image Blending.

<!-- en PDF p.36 -->

Q2.17: Kann IM2D API mehrere Funktionen mit einem RGA-Aufruf ausführen?

A2.17: Ja. Siehe Rockchip_Developer_Guide_RGA_EN — API — Image process und Implementierungen anderer IM2D-APIs zur Verwendung von improcess().

<!-- en PDF p.36 -->

Q2.18: Warum ist das gedrehte Bild gestreckt? Erwartetes Ergebnis:

<!-- en PDF p.37 -->

![Originalabbildung aus englischem PDF — p.37](/docs/rockchip-rga-faq/assets/en-p037-figure-01.png)

*Originalabbildung aus englischem PDF — p.37*

<!-- en PDF p.37 -->

Tatsächliches Ergebnis:

<!-- en PDF p.38 -->

![Originalabbildung aus englischem PDF — p.38](/docs/rockchip-rga-faq/assets/en-p038-figure-01.png)

*Originalabbildung aus englischem PDF — p.38*

<!-- en PDF p.38 -->

A2.18: Bei 90°/270° ohne Skalierung Breite und Höhe vertauschen. Andernfalls führt der Treiber standardmäßig Drehung plus Skalierung aus, was wie Streckung aussieht.

<!-- en PDF p.38 -->

Q2.19: Warum ist skaliertes RGB888 schräg und zeigt schwarze Linien? Eingang (1920 × 1080):

<!-- en PDF p.38 -->

![Originalabbildung aus englischem PDF — p.38](/docs/rockchip-rga-faq/assets/en-p038-figure-02.png)

*Originalabbildung aus englischem PDF — p.38*

<!-- en PDF p.38 -->

Ausgang (1282 × 720):

<!-- en PDF p.39 -->

![Originalabbildung aus englischem PDF — p.39](/docs/rockchip-rga-faq/assets/en-p039-figure-01.png)

*Originalabbildung aus englischem PDF — p.39*

<!-- en PDF p.39 -->

A2.19: Ausrichtungsfehler: Die virtuelle RGB888-Breite muss viererausgerichtet sein. Parameter prüfen; Anforderungen siehe Q2.5.

<!-- en PDF p.39 -->

Q2.20: Warum ist die RGA-Ausgabe in manchen Systemprozessen gestört?

A2.20: RGA-Fehler verursachen gewöhnlich kein solches gestörtes Bild; zuerst klären, ob RGA die Ursache ist. Eingang prüfen: Vor dem Aufruf Speicher mit fwrite() sichern und Quelldaten kontrollieren. Schreibbeispiel: output_buf_data_to_file() in core/rgautils.cpp.

<!-- en PDF p.39 -->

Q2.21: Warum erscheinen nach der Verarbeitung kurze schwarze oder grüne Streifen?

<!-- en PDF p.40 -->

![Originalabbildung aus englischem PDF — p.40](/docs/rockchip-rga-faq/assets/en-p040-figure-01.png)

*Originalabbildung aus englischem PDF — p.40*

<!-- en PDF p.40 -->

A2.21: Bei Aufrufen ohne virtuelle Adresse ist der Puffercache aktiviert, wird aber vor/nach CPU-Zugriffen nicht synchronisiert. Beispiel: samples/allocator_demo/src/rga_allocator_dma_cache_demo.cpp.

<!-- en PDF p.40 -->

Q2.22: Warum zittert die RGA-Skalierung im gleichen Anzeigebereich auf RK3588?

A2.22: RK3588 enthält zwei Kerntypen: einen RGA2 und zwei RGA3. Unterschiedliches Sampling ihrer Skalierungsalgorithmen verschiebt das Bild nach links oben oder rechts unten. Bei wichtigen Qualitätsanforderungen einen festen Kern wählen. Beispiele:

`<librga_souce_path>/samples/config_demo/src/rga_config_single_core_demo.cpp`

`<librga_souce_path>/samples/config_demo/src/rga_config_thread_core_demo.cpp`

<!-- en PDF p.40 -->

### 4.3 HAL-Fehler

<!-- en PDF p.40 -->

#### 4.3.1 IM2D_API-Fehler

<!-- en PDF p.40 -->

Q3.1.1: Wie wird ein imcheck()-Fehler behandelt?

<!-- en PDF p.40 -->

```text
check error! Invalid parameters: dst, Error yuv not align to 2, rect[x,y,w,h] = [0, 0, 1281,
720], wstride = 1281, hstride = 720, format = 0xa00(nv12)
output support format : RGBA_8888 RGB_888 RGB_565 RGBA_4444 RGBA_5551 YUV420/YUV422
YUV420_10bit/YUV422_10bit YUYV420 YUYV422 YUV400/Y4
```

<!-- en PDF p.41 -->

A3.1.1: imcheck() prüft Strukturparameter für librga, Funktionsunterstützung, Hardwaregrenzen usw. Den Fehlerwert an IMStrError() übergeben, um verletzte Bedingungen oder falsche Parameter ausführlich zu sehen. Im Beispiel ist die YUV-Ausrichtung verletzt: Breite 1281 ist nicht durch 2 teilbar.

<!-- en PDF p.41 -->

Q3.1.2: Was bedeutet eine imstrError()-Meldung ohne konkrete Parameterdetails?

<!-- en PDF p.41 -->

```text
Fatal error: Failed to call RockChipRga interface, please use 'dmesg' command to view driver
error log.
```

<!-- en PDF p.41 -->

A3.1.2: Die Konfiguration hat die im2d-api-Prüfung bestanden und wurde an den Treiber übergeben. Treiberfehler mit dmesg prüfen.

<!-- en PDF p.41 -->

#### 4.3.2 RockchipRga-API-Fehler

<!-- en PDF p.41 -->

Q3.2.1: Wie wird “Try to use uninit rgaCtx=(nil)” behoben?

A3.2.1: 1) Die API findet ein nicht initialisiertes librga-Modul. Meist verwaltet alter Code die Initialisierung über RgaInit/RgaDeInit/c_RkRgaInit/c_RkRgaDeInit und deinitialisiert damit das Singleton der aktuellen API falsch. Diese Init-/DeInit-Aufrufe entfernen.

<!-- en PDF p.41 -->

2) Der Fehler tritt auch bei fehlgeschlagenem Treiber-Probe oder eingeschränktem Zugriff auf /dev/rga auf.

<!-- en PDF p.41 -->

Q3.2.2: Was bedeuten “RgaBlit(1027) RGA_BLIT fail:” und “RGA_COLORFILL(1027) RGA_BLIT fail:”?

A3.2.2: Der Auftrag kehrt nach einem Treiberfehler zurück; die genaue Ursache steht in dmesg.

Q3.2.2.1: “RgaBlit(1027) RGA_BLIT fail: Not a typewriter”?

A3.2.2.1: Meist falsche Parameter. Skalierung, virtuelle Breite gegenüber tatsächlicher Breite plus Offset und Ausrichtung prüfen. Für neue Projekte wird IM2D API mit umfassenderer Fehlerprüfung empfohlen.

Q3.2.2.2: “RgaBlit(1349) RGA_BLIT fail: Bad file descriptor”?

<!-- en PDF p.42 -->

A3.2.2.2: ioctl-Fehler: Der dem Geräteknoten übergebene fd ist ungültig. librga aktualisieren oder Änderungen der RGA-Initialisierung prüfen.

Q3.2.2.3: “RgaBlit(1360) RGA_BLIT fail: Bad address”?

A3.2.2.3: Meist falsche Speicheradressen des an den Kernel übergebenen src/src1/dst, häufig Grenzüberschreitungen. Treiberprotokolle gemäß Debug-Knotenabschnitt aktivieren und problematischen Speicher lokalisieren.

Q3.2.2.4: “RgaBlit(1466) RGA BIIT fail: Invalid argument”?

A3.2.2.4: Parameter erfüllen die Funktionen oder Einschränkungen des aktuellen RGA-Kerns nicht. Auftragsparameter mit den Fähigkeiten des verbauten Kerns abgleichen.

<!-- en PDF p.42 -->

Q3.2.3: Was bedeuten “err ws[100,1280,1280]” und “Error srcRect”?

A3.2.3: width-stride-Parameterfehler. [] enthält [X_offeset, width, width_stride]. X-Offset plus Arbeitsbreite überschreitet width_stride. stride auf 1380 oder width auf 1180 ändern. Danach erscheinen folgende Parameter in logcat:

<!-- en PDF p.42 -->

```text
E librga  : err ws[100,1280,1280]                                           //Represent the width stride error.
E librga  : [RgaBlit,731]Error srcRect                                      //Represent the src channel error.
E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb6ea9040, 0x0, 0x0, 0]    //Input address (fd, virtual address, physical address, handle) of  corresponding src channel.
E rockchiprga: rect[100, 0, 1280, 720, 1280, 720, 1, 0]                     //Image parameters of corresponding src channel are: X direction offset, Y direction offset, width of the actual operation area, height of the actual operation area, image width (virtual width), image height (virtual height), image format, size ( parameters currently not used) respectively.
E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]       //Represents the mode configuration in the call.
E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb2ea6040, 0x0, 0x0, 0]    //Parameters of corresponding dst channel.
E rockchiprga: rect[0, 0, 1920, 1080, 1920, 1080, 1, 0]
E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]
E rockchiprga: This output the user parameters when rga call blit fail      //Error information.
```

<!-- en PDF p.43 -->

### 4.4 Kernel-Fehler

<!-- en PDF p.43 -->

Q4.1: Was verursacht “RGA2 failed to get vma, result = 32769, pageCount = 65537”?

A4.1: Bei virtuellen Adressen ist der tatsächlich allozierte Puffer meist kleiner als die anhand der Kanalparameter benötigte Bildgröße. Puffergröße prüfen. Sind Allokation und Aufruf getrennt, vor dem Aufruf memset über die Bildgröße ausführen, um unzureichenden Speicher zu erkennen. “rga2 map src0 memory failed” identifiziert den Kanal; im Beispiel hat src nur die halbe benötigte Puffergröße.

<!-- en PDF p.43 -->

Q4.2: Was verursacht “rga2_reg_init, [868] set mmu info error”?

A4.2: Fehler beim Umsetzen von fd oder virtueller Adresse in eine physische Adresstabelle, meist aufgrund der Puffergröße wie in Q4.1.

<!-- en PDF p.43 -->

Q4.3: Auf welches Pufferproblem weist “rga:dma_buf_get fail fd[328]” hin?

A4.3: Der Fehler entsteht in der DMA-Kernelschnittstelle. fd-Allokation prüfen und vor RGA-Nutzung außerhalb librga verifizieren.

<!-- en PDF p.43 -->

Q4.4: Nach Q4.1/Q4.2 bleiben “RGA2 failed to get pte, result = -14, pageCount = 112” und “rga2_reg_init, [868] set mmu info error”. DRM-Physikspeicher wird verwendet, memset über die MMAP-Adresse funktioniert. Warum?

A4.4: Ursache ist der DRM-Allokator: Erhält Userspace eine physische Adresse, benötigt der Kernel gewöhnlich keine virtuelle; DRM gibt deshalb kmap bei der Allokation frei. Userspace-Mapping bleibt funktionsfähig. Wird die virtuelle Adresse jedoch an RGA übergeben, kann die physische Seitentabellensuche abstürzen, keinen Eintrag finden oder falsch zugreifen, weil kmap freigegeben ist. DRM bietet ein Flag zur Steuerung der kmap-Freigabe, also ob die gemappte virtuelle Adresse an den Kernel übergeben wird:

<!-- en PDF p.44 -->

```text
(1) drm buffer application options add ROCKCHIP_BO_ALLOC_KMAP definition.
+   /* keep kmap for cma buffer or alloc kmap for other type memory */
+   ROCKCHIP_BO_ALLOC_KMAP  = 1 << 4,
(2) When applying for drm memory, add drm buffer option ROCKCHIP_BO_ALLOC_KMAP.
    struct drm_mode_create_dumb arg;
    ...
-   arg.flags = ROCKCHIP_BO_CONTIG;
+   arg.flags = ROCKCHIP_BO_CONTIG | ROCKCHIP_BO_ALLOC_KMAP;    //ROCKCHIP_BO_ALLOC_KMAP is valid only when used together with ROCKCHIP_BO_CONTIG.
    ret = drmIoctl(drm_fd, DRM_IOCTL_MODE_CREATE_DUMB, &arg);
```

<!-- en PDF p.44 -->

Prüfen, ob der Kernel folgenden Commit enthält; andernfalls SDK aktualisieren:

<!-- en PDF p.44 -->

```text
commit 1a81ee3e2d3726b9382ff2c48d08f4d837bc0143
Author: Sandy Huang <hjc@rock-chips.com>
Date:   Mon May 10 16:52:04 2021 +0800

    drm/rockchip: gem: add flag ROCKCHIP_BO_ALLOC_KMAP to assign kmap

    RGA need to access CMA buffer at kernel space, so add this flag to keep kernel
    line mapping for RGA.

    Change-Id: Ia59acee3c904a495792229a80c42f74ae34200e3
    Signed-off-by: Sandy Huang <hjc@rock-chips.com>
```

<!-- en PDF p.44 -->

Q4.5: Wie wird “RGA_MMU unsupported Memory larger than 4G!” behoben?

A4.5: Meist entspricht dies folgendem HAL-Fehler:

<!-- en PDF p.44 -->

```text
RgaBlit(1483) RGA_BLIT fail: Invalid argument
Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
```

<!-- en PDF p.44 -->

Der konfigurierte Auftragsspeicher erfüllt die Anforderungen des zugeordneten Kerns nicht. Die IOMMU verschiedener RGA-Versionen hat unterschiedliche Adressbreitengrenzen; Überschreitung führt zum Fehler. Grenzen: Rockchip_Developer_Guide_RGA_CN — Overview — Design Indicators. Typische Fälle und Lösungen:

<!-- en PDF p.44 -->

1) Auf Multicore-Plattformen (etwa RK3588: 2 RGA3 + 1 RGA2) wird wrapbuffer_xx direkt für im2d verwendet, ohne importbuffer_xx. Ohne Vorabimport kennt die Auftragszuordnung die Speicherkompatibilität des Kerns nicht; bei hoher Last kann der Fehler auftreten. Externe Puffer vorher mit importbuffer_xx importieren.

<!-- en PDF p.45 -->

2) importbuffer_xx wird genutzt, der Fehler bleibt jedoch. Prüfen, ob Funktionen/Formate gewählt sind, die ausschließlich der adressbeschränkte RGA2 unterstützt. Auf RK3588 gehören Füllen und YUV422/420 planar zu RGA2; daher ist Speicher unter 4G nötig. Beispiele:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma32_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_graphicbuffer_demo.cpp`

Bei mpp_buffer, v4l2_buffer, drm_buffer und anderen Allokatoren deren Unterstützung für Speicher unter 4G prüfen und entsprechend allozieren.

<!-- en PDF p.45 -->

3) Bei nur einem adressbeschränkten RGA, etwa RK3399/RK3568/RK3566 mit RGA2, stets kompatiblen Speicher allozieren. Lösung wie in Punkt 2.

<!-- en PDF p.45 -->

4) Unterstützen DRM, malloc, new oder andere Allokatoren keine Begrenzung unter 4G, kann der U-Boot-Speicherabbildungsbereich global auf 0–4G begrenzt werden. Siehe SDK-Dokumentation: uboot开发文档 → Chapter-8 调试手段 → 修改DDR容量.

<!-- en PDF p.45 -->

Q4.6: Was verursacht “rga_policy: invalid function policy” und “rga_job: job assign failed”?

A4.6: Treiber-Laufzeitprotokoll aktivieren, um die genaue Ursache zu sehen. Beispiel; Details im Debug-Knotenabschnitt:

<!-- en PDF p.45 -->

```text
/# echo msg > /sys/kerne/debug/rkrga/debug
/# dmesg       //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
```

<!-- en PDF p.45 -->

Anhand des Debug-Knoten-Protokollstatus prüfen, ob MSG eingeschaltet ist:

<!-- en PDF p.45 -->

```text
/# cat /sys/kerne/debug/rkrga/debug
REG [DIS]
MSG [EN]
TIME [DIS]
INT [DIS]
MM [DIS]
```

<!-- en PDF p.45 -->

Problem reproduzieren: Im Protokoll der Kernzuordnung erscheint die konkrete Ablehnungsursache:

<!-- en PDF p.46 -->

```text
rga_policy: start policy on core = 4
rga_policy: RGA2 only support under 4G memory! //Indicates that the current RGA2 core only supports memory within 4G.
rga_policy: optional_cores = 0
rga_policy: invalid function policy
rga_policy: assign core: -1
rga_job: job assign failed
rga_policy: start policy on core = 1
rga_policy: core = 1, break on rga_check_dst //Corresponding to the core unsupported reason log, here is the image parameter of the dst channel does not meet the current core requirements (you can check the document to confirm the core support, here core 0x1, 0x2 are RGA3 core, 0x4 is RGA2 core)
rga_policy: start policy on core = 2
rga_policy: core = 2, break on rga_check_dst //Corresponding to the log of reasons not supported by the core, same as above.
rga_policy: start policy on core = 4
rga_policy: RGA2 only support under 4G memory! //Corresponding to the reason log that the core does not support, it indicates that the reason for the current mismatch is that the core does not support memory other than 4G memory space.
  rga_policy: optional_cores = 0
rga_policy: invalid function policy
rga_policy: assign core: -1 // After traversing all cores, if there is no matching core, a matching failure error will be reported.
rga_job: job assign failed
```

<!-- en PDF p.46 -->

In beiden Beispielen die Konfiguration anhand der Protokolle prüfen und gezielt korrigieren.

<!-- en PDF p.46 -->

Q4.7: Was verursacht “rga:Rga err irq! INT[701],STATS[1]”?

A4.7: Eine Ausnahme während der Hardwareausführung, etwa Speichergrenzüberschreitung oder falsche Konfiguration. Zuerst die Grenzen des übergebenen Speichers prüfen.

<!-- en PDF p.46 -->

Q4.8: Was verursacht “rga: Rga sync pid 1001 wait 1 task done timeout”?

A4.8: Hardware-Timeouts haben viele Ursachen. Prüfreihenfolge:

<!-- en PDF p.46 -->

1) Prüfen, ob andere Module/Anwendungen den Puffer sperren oder unzulässig belegen. Sonst kann RGA nicht lesen/schreiben; nach 200ms ohne Abschluss meldet der Treiber einen Fehler.

<!-- en PDF p.46 -->

2) DDR-Bandbreite und Auslastung prüfen. Wegen niedriger RGA-Priorität kann bei voller DDR-Last der Abschluss länger als 200ms dauern und einen Fehler auslösen.

<!-- en PDF p.47 -->

3) Prüfen, ob ISP, vpu oder andere IPs vor RGA Fehler gemeldet haben. Fehlerhafte Hardware am gleichen Bus kann RGA behindern; über 200ms folgt ein Fehler.

<!-- en PDF p.47 -->

4) RGA-Frequenz prüfen, siehe Q1.4. Ein Modul am gemeinsamen Bus kann die Frequenz senken und RGA beeinflussen. Sinkende Leistung kann die 200ms-Grenze überschreiten.

<!-- en PDF p.47 -->

5) Übertaktung mancher Chips erhöht die Frequenz ohne passende Spannung; die Leistung kann stark einbrechen und das Zeitlimit überschreiten. Eine geeignete Frequenz wiederherstellen. Übertaktung beeinträchtigt Stabilität und Lebensdauer und wird ausdrücklich nicht empfohlen.

<!-- en PDF p.47 -->

6) Ist die Quelle kein FBC, der Kanal aber als FBC konfiguriert, scheitert die Dekodierung und verursacht einen Timeout. Bei vorhandener FBC-Konfiguration zum Vergleich FBC deaktivieren.

<!-- en PDF p.47 -->

7) Ist keiner der Fälle bestätigt, Zielspeicher nach dem Timeout sichern und prüfen, ob RGA teilweise Daten geschrieben hat. Falls ja, Punkte 1–5 erneut prüfen: Leistung reicht nicht aus. Falls keine Daten geschrieben wurden, Protokolle und Versuchsergebnisse sammeln und die RGA-Betreuung kontaktieren.

<!-- en PDF p.47 -->

Q4.9: Warum erscheint beim Timeout “rga_job: hardware has finished, but the software has timeout!”?

A4.9: Der für Interrupts zuständige CPU-Kern wurde verdrängt: Nach dem Hardwareinterrupt der oberen Hälfte wartet der Treiber zu lange auf die untere Softirq-Hälfte. Häufig beansprucht ein Echtzeitprozess die CPU. Erzwungene CPU-Verdrängung durch Echtzeitprozesse wird nicht empfohlen. CPU-seitig verhindern, dass Belegung des Interruptkerns Softirqs anderer Treiber blockiert.

<!-- en PDF p.47 -->

Q4.10: Warum erscheinen bei normalem oder abnormalem Prozessende:

`rga_mm: [tgid:500] Decrement the reference of handle[622] when the user exits`

`rga_mm: [tgid:500] Decrement the reference of handle[623] when the user exits`

A4.10: Prozess 500 hat RGA-buffer_handle-Lecks für 622 und 623. Typische Ursachen:

<!-- en PDF p.47 -->

1) Nach importbuffer_xx() fehlt releasebuffer_handle(); der Handle wird nicht rechtzeitig freigegeben.

<!-- en PDF p.48 -->

2) Derselbe Speicherblock wurde mehrfach importiert, releasebuffer_handle() aber nur einmal aufgerufen.

<!-- en PDF p.48 -->

3) Abnormaler Anwendungsabbruch verhindert die Nachbearbeitung und entspricht einem fehlenden releasebuffer_handle(). In allen Fällen sind importbuffer_xx() und releasebuffer_handle() nicht gepaart; beim Prozessende bleiben Handle-Instanzen bestehen. Zum Speicherschutz zerstört der Treiber sie und meldet das auffällige Verhalten.

Q4.11: Was bedeutet:

`rga: 12491 12491 : ID[58447384]: Only get buffer 1382400 byte from handle[555], but current required 3686400 byte`

A4.11: Bildparameter benötigen 3686400 Byte, buffer_handle enthält nur 1382400. Meist stimmt die importbuffer_xx()-Größe nicht mit der Verarbeitung überein. Hier wurde 1280 * 720 * 1.5 (NV12) = 1382400 Byte importiert, derselbe Handle dann aber für 1280 * 720 RGBA8888 mit 1280 * 720 * 4 = 3686400 Byte verwendet. Dieser Größenunterschied verursacht den Fehler.

Redaktionshinweis: Beide Quellen sind V1.1.3; Chinesisch nummeriert RGA driver als 2.2.2 und Versionszuordnung als 2.2.3. Englisch lässt RGA Driver unnummeriert und nutzt 2.2.2 für die Zuordnung. Quellnummerierung bleibt erhalten. Ergänzung aus der chinesischen Quelle: Die RK3566-Testtabelle nennt zusätzlich RGA2-EHANCE (Originalschreibweise); diese Zeile fehlt auf Englisch. Außerdem steht dort `echo <cmd> > <节点名>` (letzter Platzhalter: Knotenname) vor denselben konkreten Beispielen. Quellbefehle mischen /sys/kerne/ und /sys/kernel/; zur Nachverfolgbarkeit beibehalten, tatsächliche Geräteknoten prüfen. Keine Debug-Befehle oder Hardwareänderungen wurden ausgeführt.

{% endraw %}
