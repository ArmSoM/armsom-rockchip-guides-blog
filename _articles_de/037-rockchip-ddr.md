---
title: "Rockchip DDR-Entwicklerleitfaden: Frequenz, Kapazität, Validierung, Augendiagramme und ECC"
description: "Vollständige technische Referenz zu Rockchip DDR V2.7.2: Entwicklung, Fehlersuche, Speicherprüfung, Augenscans, Bandbreite, Lötstellenprüfung und HAL-ECC."
translation_key: "037-rockchip-ddr"
slug: "037-rockchip-ddr"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DDR", "ECC", "RK3588", "RK3576", "Rockchip"]
keywords: "ArmSoM Rockchip DDR LPDDR4 LPDDR5 ECC RK3588 RK3576"
excerpt: "Vollständige technische Referenz zu Rockchip DDR V2.7.2: Entwicklung, Fehlersuche, Speicherprüfung, Augenscans, Bandbreite, Lötstellenprüfung und HAL-ECC."
---

{% raw %}

# Rockchip DDR-Entwicklerleitfaden: Frequenz, Kapazität, Validierung, Augendiagramme und ECC

Dies ist eine Plattformreferenz auf Grundlage von Rockchip DDR V2.7.2, kein ArmSoM-Testbericht und keine Zusage, dass jedes Board alle Funktionen unterstützt. Die Quelle umfasst mehrere SoC-Generationen, Linux 3.0/3.10/4.4 und spätere Kernel, Android, U-Boot, Loader, Trust/ATF und HAL. Prüfen Sie die konkrete Kombination aus Board, DRAM-Baustein und Leiterbahnführung, SoC, SDK-/BSP-Zweig, DDR-Binärdatei, Trust und Kernel. Eine boardspezifische ArmSoM-Anpassung wurde nicht auf Hardware validiert.

Der chinesische Artikel folgt dem 110-seitigen chinesischen PDF, der englische dem 115-seitigen englischen PDF. Die russische und deutsche Fassung übersetzen den vollständigen englischen Text. Beide Quellen tragen V2.7.2. Die englische Fassung enthält zusätzlich §6.2.1 zur englischen Werkzeugoberfläche, wodurch sich die folgenden Abschnittsnummern in Kapitel 6 verschieben. Weitere Unterschiede betreffen Kapazitätsberechnungen, Augenmarkierungen, Versionsangaben und Pfade. Sie bleiben ausdrücklich im Text und in den [Redaktionsnotizen](/docs/rockchip-ddr/EDITORIAL-NOTES.md) dokumentiert und werden nicht stillschweigend vereinheitlicht.

**Betriebsrisiko:** Firmwareprogrammierung, Änderungen von Spannung, Frequenz oder Kapazität, Entfernen von RZQ, ECC-Fehlerinjektion und Speicherbelastungstests können Hardware oder Daten beschädigen und Resets verursachen. Quellbefehle und Debugwerte wie 1.6V sind Beispiele, keine Empfehlungen für beliebige ArmSoM-Boards. Prüfen Sie DRAM-Spezifikationen, Schaltpläne, elektrische Grenzwerte und das passende SDK; sichern Sie Daten und verwenden Sie kontrollierte Testhardware. Es wurden keine Hardwarebefehle ausgeführt. Alle beschriebenen Beobachtungen und Messwerte stammen aus Quellbeispielen. Genannte Werkzeug- und Ressourcenpfade bedeuten nicht, dass die Binärdateien mit dieser Website verteilt werden.

Offizielle Ressourcen: [ArmSoM-Dokumentation](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux), [rkbin](https://github.com/rockchip-linux/rkbin).

Das Quellvorwort beschreibt die DDR-SDRAM-Entwicklung für alle Rockchip-Chips. Die Produktversionstabelle nennt alle Chipsätze und alle Kernelversionen. Dies ist der von der Quelle beanspruchte Umfang, keine geprüfte Kompatibilität jeder Kombination.

| Chipsatz | Kernelversion |
|---|---|
| Alle Chipsätze | Alle Kernelversionen |

<!-- Source EN PDF p.7, block 0 -->

## 1. Kapitel 1: Häufige Fragen zur DDR-Entwicklung

<!-- Source EN PDF p.7, block 1 -->

### 1.1 Bedeutung der DDR-Protokolle

<!-- Source EN PDF p.7, block 2 -->

DDR-Protokolle werden im Loader und im Kernel ausgegeben. Das Loader-Protokoll wird wie folgt erläutert:

<!-- Source EN PDF p.7, block 3 -->

```text
DDR Version 1.05 20170712//Version information of the DDR initialization code used to check
the version. From this line, you have entered the DDR initialization code.
In
SRX //If it prints SRX, means hot restart; without SRX, it means that it is cold boot. While
some chipset does not have this feature, there will not show SRX.
Channel a: DDR3 400MHz //The following log are the details of the DDR capacity. For more
explanation,please see the chapter"How to Check the Capacity of DDR".
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Channel b: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Memory OK //This is the result of DDR self-test, the first "Memroy OK" is the self-test
result of Channel a.
Memory OK //It is the self-test result of Channel b.If Channel a or b shows an error,
turning out that something wrong with the welding; no error, indicating that the current
self-test is good.But whether the entire DDR can work stably or not,also depends on the
subsequent stages of operation results.
OUT //After this line, the DDR initialization code is exited.
```

<!-- Source EN PDF p.7, block 4 -->

Nachfolgend das DDR-Protokoll von Kernel 3.0 und 3.10:

<!-- Source EN PDF p.7, block 5 -->

```text
[ 0.528564] DDR DEBUG: version 1.00 20150126 //Version information
[ 0.528690] DDR DEBUG: Channel a: //The details of the DDR capacity
[ 0.528701] DDR DEBUG: DDR3 Device
[ 0.528716] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528727] DDR DEBUG: Channel b:
[ 0.528736] DDR DEBUG: DDR3 Device
[ 0.528750] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
//The following information about DDR specialize for DDR engineer debug, please ignore it.
//After "DDR DEBUG" print end, which means DDR initialization finishes in kernel.
```

<!-- Source EN PDF p.7, block 6 -->

Kernel 3.10 gibt außerdem das folgende Protokoll des DDR-Frequenzskalierungsmoduls aus.

<!-- Source EN PDF p.8, block 7 -->

```text
[ 1.473637] ddrfreq: verion 1.2 20140526 //DDR frequency scaling module version
[ 1.473653] ddrfreq: normal 396MHz video_1080p 240MHz video_4k 396MHz dualview 396MHz
idle 0MHz suspend 200MHz reboot 396MHz //The frequencies which read from dts table are
corresponding to the different scenarios.
[ 1.473661] ddrfreq: auto-freq=1 //This line reflects load scaling functon is enable or
not,"1" means on,"0" means off.
[ 1.473667] ddrfreq: auto-freq-table[0] 240MHz //the table of the load scaling
[ 1.473673] ddrfreq: auto-freq-table[1] 324MHz
[ 1.473678] ddrfreq: auto-freq-table[2] 396MHz
[ 1.473683] ddrfreq: auto-freq-table[3] 528MHz
//If crash or block in this print porcedure,it is most likely DDR frequency scaling bug.
```

<!-- Source EN PDF p.8, block 8 -->

In Versionen nach Kernel 3.10 werden keine DDR-Kapazitätsinformationen mehr im Kernel ausgegeben.

<!-- Source EN PDF p.8, block 9 -->

### 1.2 Rockchip-DDR-Binärdateien in einen vollständigen nutzbaren Loader integrieren

<!-- Source EN PDF p.8, block 10 -->

1\. Legen Sie die DDR-Binärdatei im passenden Unterverzeichnis von rk\rkbin\bin\ des U-Boot-Projekts ab.

<!-- Source EN PDF p.8, block 11 -->

2\. Löschen Sie die ursprüngliche DDR-Binärdatei.

<!-- Source EN PDF p.8, block 12 -->

3\. Benennen Sie die neue DDR-Binärdatei auf den Namen der gelöschten Datei um.

<!-- Source EN PDF p.8, block 13 -->

4\. Kompilieren Sie U-Boot, siehe „Rockchip-Developer-Guide-UBoot-nextdev.pdf“. Dadurch wird die passende Loader-Datei erzeugt.

<!-- Source EN PDF p.8, block 14 -->

5\. Prüfen Sie anhand des Loader-Protokolls, ob der Loader korrekt aktualisiert wurde.

<!-- Source EN PDF p.8, block 15 -->

Übersicht der DDR-Binärdateipfade aller Plattformen:

<!-- Source EN PDF p.9, block 16 -->

| Chiptyp | Pfad | Hinweis |
|---|---|---|
| PX30 | rk\rkbin\bin\rk33\px30_ddr_333MHz_vX.XX.bin |  |
| PX3SE | rk\rkbin\bin\rk31\px3se_ddr_300MHz_vX.XX_uartX.bin |  |
| RK1808 | rk\rkbin\bin\rk1x\rk1808_ddr_XXXMHz_vX.XX.bin |  |
| RK3036 | rk\rkbin\bin\rk30\rk3036_ddr_XXXMHz_vX.XX.bin | 1 |
| RK3126<br>RK3126B<br>RK3126C | rk\rkbin\bin\rk31\rk3126_ddr3_300MHz_vX.XX.bin |  |
| RK3128 | rk\rkbin\bin\rk31\rk3128_ddr_300MHz_vX.XX.bin |  |
| RK3288 | rk\rkbin\bin\rk32\rk3288_ddr_400MHz_vX.XX.bin |  |
| RK322x | rk\rkbin\bin\rk32\rk322x_ddr_XXXMHz_vX.XX.bin |  |
| RK322xh | rk\rkbin\bin\rk33\rk322xh_ddr_333MHz_vX.XX.bin |  |
| RK3308 | rk\rkbin\bin\rk33\rk3308_ddr_XXXMHz_uartX_mX_vX.XX.bin |  |
| RK3326 | rk\rkbin\bin\rk33\rk3326_ddr_333MHz_vX.XX.bin |  |
| RK3328 | rk\rkbin\bin\rk33\rk3328_ddr_XXXMHz_vX.XX.bin |  |
| RK3368 | rk\rkbin\bin\rk33\rk3368_ddr_600MHz_vX.XX.bin |  |
| RK3399 | rk\rkbin\bin\rk33\rk3399_ddr_XXXMHz_vX.XX.bin | 2 |
| RK3399PRO | rk\rkbin\bin\rk33\rk3399pro_ddr_XXXMHz_vX.XX.bin |  |
| RK3528 | rk\rkbin\bin\rk35\rk3528_ddr_XXXMHz_vX.XX.bin | 3 |
| RK3562 | rk\rkbin\bin\rk35\rk3562_ddr_XXXMHz_vX.XX.bin |  |
| RK3566 | rk\rkbin\bin\rk35\rk3566_ddr_XXXMHz_vX.XX.bin |  |
| RK3568 | rk\rkbin\bin\rk35\rk3568_ddr_XXXMHz_vX.XX.bin |  |
| RK3576 | rk\rkbin\bin\rk35\rk3576_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin |  |
| RK3588 | rk\rkbin\bin\rk35\rk3588_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin |  |
| RV1106 | rk\rkbin\bin\rv11\rv1106_ddr_XXXMHz_vX.XX.bin |  |
| RV1108 | rk\rkbin\bin\rv11\rv1108_ddr_vX.XX.bin |  |
| RV1126 | rk\rkbin\bin\rv11\rv1126_ddr_XXXMHz_vX.XX.bin |  |
| Künftige neue<br>Plattformen | Dateien werden nach ähnlichem Namensschema im Verzeichnis rk\rkbin\bin abgelegt<br>und können dort gesucht werden. |  |

<!-- Source EN PDF p.9, block 17 -->

Hinweis 1: Die Frequenz wird in rk\rkbin\RKBOOT\RK3036_ECHOMINIALL.ini oder RK3036MINIALL.ini festgelegt. RK3036_ECHOMINIALL.ini ist speziell für ECHO-Produkte bestimmt; andere RK3036-Produkte verwenden RK3036MINIALL.ini. Zur Identifikation eines ECHO-Geräts verweist die Quelle auf die Rockchip-Systemproduktabteilung.

<!-- Source EN PDF p.9, block 18 -->

Hinweis 2: Die Frequenz wird in rk\rkbin\RKBOOT\RK3399MINIALL.ini festgelegt.

<!-- Source EN PDF p.9, block 19 -->

Hinweis 3: Die angegebene RK3528-Hardwarekonfiguration gilt für nicht zweilagige Leiterplatten und DDR mit anderer Breite als 4BIT. Für zweilagige Leiterplatten oder 4BIT-DDR siehe die folgenden besonderen Hinweise zu DDR-Binärdateien.

<!-- Source EN PDF p.10, block 20 -->

Hinweis 4: Neue Plattformen werden nach ähnlichen Namensregeln unter rk\rkbin\bin\ abgelegt und können dort gesucht werden.

<!-- Source EN PDF p.10, block 21 -->

### 1.3 Plattformen mit vier Frequenzpunkten in der DDR-Binärdatei

<!-- Source EN PDF p.10, block 22 -->

Die DDR-Binärdateien der folgenden Plattformen enthalten jeweils vier DDR-Frequenzen. Die höchste ist im Dateinamen angegeben: Bei rv1126_ddr_924MHz_v1.05.bin beträgt der letzte Frequenzpunkt beispielsweise 924M.

<!-- Source EN PDF p.10, block 23 -->

Im Kernel können nur diese vier Frequenzen verwendet werden. Zur Änderung siehe das Kapitel zur Bearbeitung der DDR-Binärdatei.

<!-- Source EN PDF p.10, block 24 -->

Die vier Standardfrequenzen sind üblicherweise:

<!-- Source EN PDF p.10, block 25 -->

| Plattform | Datei | Enthaltene Frequenzen (MHz) |
|---|---|---|
| RK3528 | rk3528_ddr_XXXMHz_vX.XX.bin | 324,528,780,und die Frequenz im Dateinamen |
| RK3562 | rk3562_ddr_XXXMHz_vX.XX.bin | 324,528,780,und die Frequenz im Dateinamen |
| RK3566 | rk3566_ddr_XXXMHz_vX.XX.bin | 324,528,780,und die Frequenz im Dateinamen |
| RK3568 | rk3568_ddr_XXXMHz_vX.XX.bin | 324,528,780,und die Frequenz im Dateinamen |
| RK3576 | rk3576_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin | LP4/LP4X:528,1068,1560,und die Frequenz im<br>Dateinamen<br>LP5/LP5X:534,1320,1968,und die Frequenz im<br>Dateinamen |
| RK3588 | rk3588_ddr_lp4_XXXXMHz_lp5_XXXXMHz_vX.XX.bin | LP4/LP4X:528,1068,1560,und die Frequenz im<br>Dateinamen<br>LP5/LP5X:534,1320,1968,und die Frequenz im<br>Dateinamen |
| RV1126 | rv1126_ddr_XXXMHz_vX.XX.bin | 328,528,784,und die Frequenz im Dateinamen |

<!-- Source EN PDF p.10, block 26 -->

Die vier Frequenzpunkte lassen sich im seriellen Loader-Protokoll anzeigen, beispielsweise:

<!-- Source EN PDF p.10, block 27 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies */
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.10, block 28 -->

Sie können die aktuellen vier Frequenzen auch mit rkbin/tools/ddrbin_tool auslesen, beispielsweise:

<!-- Source EN PDF p.10, block 29 -->

```text
./ddrbin_tool px30 -g gen_param.txt px30_ddr_333MHz_v1.15.bin
```

<!-- Source EN PDF p.10, block 30 -->

Weitere Informationen enthält die ausführliche Anleitung zu ddrbin_tool.

<!-- Source EN PDF p.11, block 31 -->

### 1.4 Besondere Hinweise zu DDR-Binärdateien

<!-- Source EN PDF p.11, block 32 -->

Für einige DDR-Binärdateien unter rk\rkbin\bin gelten besondere Hinweise.

<!-- Source EN PDF p.11, block 33 -->

RK3399

<!-- Source EN PDF p.11, block 34 -->

RK3399 unterstützt je nach DDR-Typ unterschiedliche Frequenzen. Da der Dateiname die Frequenz nicht nach Speichertyp unterscheidet, kann dies zu Verwechslungen führen. Die folgende Tabelle erläutert die Zuordnung.

<!-- Source EN PDF p.11, block 35 -->

| Datei | DDR3/LP3: Frequenz beim Verlassen des Loaders (MHz) | DDR3/LP3: Kernelfrequenzen (MHz) | LP4: Frequenz beim Verlassen des Loaders (MHz) | LP4: Kernelfrequenzen (MHz) |
|---|---|---|---|---|
| rk33\rk3399_ddr_666MHz_v1.30.bin | 666 | <=666 | 416 | 328, 416, 666, 856 |
| rk33\rk3399_ddr_800MHz_v1.30.bin | 800 | <=800 | 856 | 328,416, 666, 856 |
| rk33\rk3399_ddr_933MHz_v1.30.bin | 933 | <=933 | 856 | 328, 416, 666, 856,<br>933 |

<!-- Source EN PDF p.11, block 36 -->

Binärdateien mit Suffix „eyescan“

<!-- Source EN PDF p.11, block 37 -->

DDR-Binärdateien mit eyescan-Suffix erzeugen einen Loader, mit dem sich zweidimensionale Augendiagramme der DDR-Signale erfassen lassen, beispielsweise:

<!-- Source EN PDF p.11, block 38 -->

```text
rk\rkbin\bin\rk35\rk3566_ddr_1056MHz_eyescan_v1.16.bin
```

<!-- Source EN PDF p.11, block 39 -->

```text
rk\rkbin\bin\rk35\rk3588_ddr_lp4_2112MHz_lp5_2736MHz_eyescan_v1.11.bin
```

<!-- Source EN PDF p.11, block 40 -->

```text
rk\rkbin\bin\rk35\rk3562_ddr_1332MHz_eyescan_v1.04.bin
```

<!-- Source EN PDF p.11, block 41 -->

```text
rk\rkbin\bin\rk35\rk3568_ddr_1560MHz_eyescan_v1.16.bin
```

<!-- Source EN PDF p.11, block 42 -->

Binärdateien mit Suffix „ultra“

<!-- Source EN PDF p.11, block 43 -->

Für besonders stromsparenden E-Book-Betrieb mit entsprechender E-Book-Hardware, beispielsweise:

<!-- Source EN PDF p.11, block 44 -->

```text
rk\rkbin\bin\rk35\rk3566_ddr_XXXMHz_ultra_v1.10.bin
```

<!-- Source EN PDF p.11, block 45 -->

```text
rk\rkbin\bin\rk35\rk3562_ddr_XXXMHz_ultra_v1.05.bin
```

<!-- Source EN PDF p.11, block 46 -->

Binärdateien mit Suffix „tb“

<!-- Source EN PDF p.11, block 47 -->

Für Schnellstart. Wählen Sie die zum DDR-Typ passende Binärdatei, beispielsweise:

<!-- Source EN PDF p.11, block 48 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_ddr4_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 49 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_ddr3_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 50 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_lp3_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 51 -->

```text
rk\rkbin\bin\rv11\rv1126_tpl_XXXMHz_lp4_tb_v1.08.bin
```

<!-- Source EN PDF p.11, block 52 -->

Für RV1106-Schnellstart mit DDR3

<!-- Source EN PDF p.11, block 53 -->

```text
rk\rkbin\bin\rv11\rv1106_ddr_924MHz_tb_v1.13.bin
```

<!-- Source EN PDF p.12, block 54 -->

3528-Dateien mit „PCB“

<!-- Source EN PDF p.12, block 55 -->

Für Designs mit 4BIT-DDR

<!-- Source EN PDF p.12, block 56 -->

```text
rk\rkbin\bin\rk35\rk3528_ddr_1056MHz_4BIT_PCB_v1.07.bin
```

<!-- Source EN PDF p.12, block 57 -->

Für Designs mit zweilagiger Leiterplatte

<!-- Source EN PDF p.12, block 58 -->

```text
rk\rkbin\bin\rk35\rk3528_ddr_1056MHz_2L_PCB_v1.07.bin
```

<!-- Source EN PDF p.12, block 59 -->

### 1.5 DDR-Binärdatei bearbeiten

<!-- Source EN PDF p.12, block 60 -->

Die zuvor beschriebenen DDR-Binärdateien initialisieren DDR beim Start. Mit Rockchip-Werkzeugen lassen sich darin Initialisierungsparameter, DDR-Frequenz, serielle Ausgabe, Baudrate und weitere Einstellungen verändern.

<!-- Source EN PDF p.12, block 61 -->

rk_ddrBin_tool_windows

<!-- Source EN PDF p.12, block 62 -->

Empfohlen wird rk_ddrBin_tool_windows, ein einfach bedienbares Werkzeug mit grafischer Oberfläche.

<!-- Source EN PDF p.12, block 63 -->

Die Werkzeuge sind unter folgendem Pfad verfügbar:

<!-- Source EN PDF p.12, block 64 -->

```text
https://redmine.rock-chips.com/documents/49 -> rk_ddrBin_tool_windows_Vx.xx.7z
```

<!-- Source EN PDF p.12, block 65 -->

Üblicherweise gibt es mehrere Archivteile. Laden Sie alle herunter und entpacken Sie sie anschließend.

<!-- Source EN PDF p.12, block 66 -->

Unter Help enthält das Werkzeug eine Bedienungsanleitung.

<!-- Source EN PDF p.12, block 67 -->

```text
rkbin/tools/ddrbin_tool
```

<!-- Source EN PDF p.12, block 68 -->

Die Kommandozeilenvariante befindet sich im rkbin-Projekt unter rkbin/tools/ddrbin_tool.

<!-- Source EN PDF p.12, block 69 -->

Die Dokumentation liegt unter rkbin/tools/ddrbin_tool_user_guide.txt.

<!-- Source EN PDF p.12, block 70 -->

Häufige Anpassungen:

<!-- Source EN PDF p.12, block 71 -->

DDR-Frequenz ändern

<!-- Source EN PDF p.12, block 72 -->

Für SoCs mit nur vier unterstützten DDR-Frequenzen siehe den Abschnitt über Plattformen mit vier Frequenzpunkten.

<!-- Source EN PDF p.12, block 73 -->

Die vier Frequenzen können entsprechend dem DDR-Typ geändert werden. Das folgende Beispiel zeigt die vier LPDDR4-Frequenzen.

<!-- Source EN PDF p.12, block 74 -->

![Technische Originalabbildung — PDF S. 12](/docs/rockchip-ddr/assets/en-p12-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| lp4_freq | 2112 | 300-2133 | MHz | DDR-Initialfrequenz (FSP_0) |
| lp4_f1_freq_mhz | 528 | 300-2133 | MHz | DDR-FSP_1-Frequenz für die Skalierung |
| lp4_f2_freq_mhz | 1068 | 300-2133 | MHz | DDR-FSP_2-Frequenz für die Skalierung |
| lp4_f3_freq_mhz | 1560 | 300-2133 | MHz | DDR-FSP_3-Frequenz für die Skalierung |

<!-- Source EN PDF p.12, block 75 -->

Seriellen Anschluss ändern

<!-- Source EN PDF p.12, block 76 -->

![Technische Originalabbildung — PDF S. 12](/docs/rockchip-ddr/assets/en-p12-figure2.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| uart id | 0 |  | — | UART-ID; 0xf deaktiviert die UART-Ausgabe |

<!-- Source EN PDF p.12, block 77 -->

Serielle Baudrate ändern

<!-- Source EN PDF p.13, block 78 -->

![Technische Originalabbildung — PDF S. 13](/docs/rockchip-ddr/assets/en-p13-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| uart id | 0 |  | — | UART-ID; 0xf deaktiviert die UART-Ausgabe |
| uart iomux | 0 |  | — | UART IOMUX |
| uart baudrate | 1500000 |  | bps | Unterstützt 115200 oder 1500000 |

<!-- Source EN PDF p.13, block 79 -->

### 1.6 DDR-Frequenz in U-Boot ändern

<!-- Source EN PDF p.13, block 80 -->

RK322x

<!-- Source EN PDF p.13, block 81 -->

Die folgende Methode wird nur von RK322x unterstützt. Ändern Sie dazu arch/arm/boot/dts/rk322x.dtsi im Kernel-3.10-Code.

<!-- Source EN PDF p.13, block 82 -->

```text
dram: dram {
    compatible = "rockchip,rk322x-dram";
    status = "okay";
    dram_freq = <786000000>;
    rockchip,dram_timing = <&dram_timing>;
};
```

<!-- Source EN PDF p.13, block 83 -->

Ändern Sie lediglich „dram_freq“ im obigen Codeblock; die Einheit ist Hz. Die Frequenz kann frei gewählt werden.

<!-- Source EN PDF p.13, block 84 -->

U-Boot wertet diese DTS automatisch aus und schaltet auf die entsprechende Frequenz um.

<!-- Source EN PDF p.13, block 85 -->

RK3576/RK3588

<!-- Source EN PDF p.13, block 86 -->

Die folgende Methode wird nur von RK3576 und RK3588 unterstützt. Bei der DDR-Initialisierung legt der Loader auf diesen Plattformen vier DDR-Frequenzen für die spätere Kernelverwendung an. Standardmäßig verlässt er den Loader mit der höchsten Frequenz und setzt den Start fort.

<!-- Source EN PDF p.13, block 87 -->

F1, F2, F3 und F0 bezeichnen diese vier Frequenzen. Standardmäßig wird der Loader mit F0 verlassen.

<!-- Source EN PDF p.13, block 88 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies */
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.13, block 89 -->

Um die DDR-Frequenz unter U-Boot zu ändern, ändern Sie lediglich die Frequenz beim Verlassen des Loaders.

<!-- Source EN PDF p.14, block 90 -->

Suchen Sie im Werkzeug aus dem Abschnitt zur Bearbeitung der DDR-Binärdatei den Parameter boot_fsp. Damit wählen Sie F0/F1/F2/F3 als Frequenz beim Verlassen des Loaders und ändern so die DDR-Frequenz in U-Boot.

<!-- Source EN PDF p.14, block 91 -->

![Technische Originalabbildung — PDF S. 14](/docs/rockchip-ddr/assets/en-p14-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| boot_fsp | 0 |  | — | DDR-Frequenz beim Eintritt ins System nach Initialisierung: 0=fsp0, 1=fsp1, 2=fsp2, 3=fsp3 |

<!-- Source EN PDF p.14, block 92 -->

### 1.7 DDR-Frequenzskalierung im Kernel aktivieren oder deaktivieren

<!-- Source EN PDF p.14, block 93 -->

Prüfen Sie zunächst, ob der Chip DDR-Frequenzskalierung im Kernel unterstützt. Danach lässt sich die Funktion wie folgt aktivieren oder deaktivieren:

<!-- Source EN PDF p.14, block 94 -->

Ab Kernel 4.4 suchen Sie den letztlich wirksamen dmc-Knoten in DTS. status = "disabled" deaktiviert die DDR-Frequenzskalierung, status = "okay" aktiviert sie.

<!-- Source EN PDF p.14, block 95 -->

Hinweis 1: Prüfen Sie bei RK3576 und RK3588 nach Aktivierung über den DTS-dmc-Knoten die Eigenschaften "center-supply" und "mem-supply" anhand der tatsächlichen Stromversorgungsverdrahtung. Die Werte nennen die Regulatorknoten zur Versorgung des DDR-Moduls auf der

<!-- Source EN PDF p.14, block 96 -->

SoC-Seite sowie von LOGIC.

<!-- Source EN PDF p.14, block 97 -->

Standard für RK3576: center-supply = `<&vdd_ddr_s0>`, mem-supply = `<&vdd_logic_s0>`.

<!-- Source EN PDF p.14, block 98 -->

Standard für RK3588: center-supply = `<&vdd_ddr_s0>`, mem-supply = `<&vdd_log_s0>`.

<!-- Source EN PDF p.14, block 99 -->

Fehlt diese Eigenschaft im dmc-Knoten, kann der dmc-Treiber nicht geladen werden. Das Kernelprotokoll lautet:

<!-- Source EN PDF p.14, block 100 -->

```text
rockchip-dmc dmc: Cannot get the regulator "center"
```

<!-- Source EN PDF p.14, block 101 -->

Hinweis 2: Prüfen Sie bei anderen Plattformen nach Aktivierung über den DTS-dmc-Knoten die Eigenschaft "center-supply" anhand der tatsächlichen Stromversorgungsverdrahtung. Ihr Wert nennt den Regulatorknoten zur Versorgung des DDR-Moduls auf der SoC-Seite.

<!-- Source EN PDF p.14, block 102 -->

Standard für RK3399: center-supply = `<&vdd_center>`.

<!-- Source EN PDF p.14, block 103 -->

Für andere Plattformen wie PX30/RK3568/RV1126 ist der Standard center-supply=`<&vdd_logic>`.

<!-- Source EN PDF p.14, block 104 -->

Fehlt diese Eigenschaft im dmc-Knoten, kann der dmc-Treiber nicht geladen werden. Das Kernelprotokoll lautet:

<!-- Source EN PDF p.14, block 105 -->

```text
rockchip-dmc dmc: Cannot get the regulator "center"
```

<!-- Source EN PDF p.14, block 106 -->

Hinweis 3: Halten Sie den Status des dfi-Knotens möglichst konsistent mit dmc. In älterem Code hängt dmc von dfi ab; ein auf "disabled" gesetzter dfi-Knoten macht dmc unwirksam.

<!-- Source EN PDF p.14, block 107 -->

Beim RK3399-EVB befindet sich der letztlich wirksame dmc-Knoten beispielsweise in arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi.

<!-- Source EN PDF p.15, block 108 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    center-supply = <&vdd_center>; /* This requires the customer to configure it according
to the actual hardware circuit*/
    status = "okay"; /* enable kernel DDR scaling function */
    ...
};
```

<!-- Source EN PDF p.15, block 109 -->

```text
&dfi {
    status = "disabled";
};
&dmc {
    status = "disabled"; /* disable kernel DDR scaling function */
    ...
};
```

<!-- Source EN PDF p.15, block 110 -->

Bei Kernel 3.10 suchen Sie den wirksamen clk_ddr_dvfs_table-Knoten in DTS. status = "disabled" deaktiviert die DDR-Frequenzskalierung im Kernel, status = "okay" aktiviert sie.

<!-- Source EN PDF p.15, block 111 -->

Beim RK3288-SDK-Board liegt clk_ddr_dvfs_table beispielsweise in arch/arm/boot/dts/rk3288-tb_8846.dts.

<!-- Source EN PDF p.15, block 112 -->

```text
&clk_ddr_dvfs_table {
    ...
    status="okay"; /* enable kernel DDR scaling function */
};
```

<!-- Source EN PDF p.15, block 113 -->

```text
&clk_ddr_dvfs_table {
    ...
    status="disabled"; /* disable kernel DDR scaling function */
};
```

<!-- Source EN PDF p.15, block 114 -->

Bei Kernel 3.0 ändern Sie dvfs_ddr_table in der boardspezifischen Datei borad-\*\*.c. Lassen Sie nur eine DDR_FREQ_NORMAL-Frequenz in der Tabelle stehen, sodass DDR die Frequenz nicht wechseln kann.

<!-- Source EN PDF p.15, block 115 -->

Die Boarddatei des RK3066-SDK-Boards liegt beispielsweise unter arch/arm/mach-rk30/board-rk30-sdk.c:

<!-- Source EN PDF p.15, block 116 -->

```text
/* This table enable DDR scaling function */
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
/* This table disable DDR scaling function */
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    //{.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    //{.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.16, block 118 -->

### 1.8 DDR-Frequenzwechsel einschließlich Initialisierung verhindern

<!-- Source EN PDF p.16, block 119 -->

Der vorherige Abschnitt beschreibt das Aktivieren und Deaktivieren der Frequenzskalierung im laufenden Betrieb. Während der Initialisierung gibt es jedoch eine Ausnahme: Beim Einschalten kann ddr_init einmal die Frequenz ändern, um das DDR-Timing für höhere Leistung zu aktualisieren. Soll auch dies unterbleiben, führen Sie sowohl die Änderungen aus dem Abschnitt zur Kernel-Frequenzskalierung als auch die folgenden aus:

<!-- Source EN PDF p.16, block 120 -->

Für Kernel 4.4 und spätere Versionen:

<!-- Source EN PDF p.16, block 121 -->

Die Änderungen aus dem Abschnitt zum Aktivieren/Deaktivieren der DDR-Frequenzskalierung im Kernel genügen. Damit wird auch die Skalierung in ddr_init unterbunden.

<!-- Source EN PDF p.16, block 122 -->

Für Kernel 3.10:

<!-- Source EN PDF p.16, block 123 -->

Chiptyp: RK322X

<!-- Source EN PDF p.16, block 124 -->

Codeposition: kein entsprechender Code im Kernel

<!-- Source EN PDF p.16, block 125 -->

Vorgehen: Nur den dram-Knoten auf "disabled" setzen.

<!-- Source EN PDF p.16, block 126 -->

```text
dram: dram {
    compatible = "rockchip,rk322x-dram";
    status = "disabled"; /* Please,modify here! */
    dram_freq = <786000000>;
    rockchip,dram_timing = <&dram_timing>;
};
```

<!-- Source EN PDF p.16, block 127 -->

Chiptyp: RK3188

<!-- Source EN PDF p.16, block 128 -->

Codeposition: Funktion ddr_init() in arch/arm/mach-rockchip/ddr_rk30.c

<!-- Source EN PDF p.16, block 129 -->

Chiptyp: RK3288

<!-- Source EN PDF p.16, block 130 -->

Codeposition: Funktion ddr_init() in arch/arm/mach-rockchip/ddr_rk32.c

<!-- Source EN PDF p.16, block 131 -->

Chiptypen: RK3126B und RK3126C mit Firmware ohne trust.img

<!-- Source EN PDF p.16, block 132 -->

Codeposition: Funktion ddr_init() in arch/arm/mach-rockchip/ddr_rk3126b.c

<!-- Source EN PDF p.16, block 133 -->

Chiptypen: RK3126/RK3128

<!-- Source EN PDF p.16, block 134 -->

Codeposition: Funktion ddr_init() in ./arch/arm/mach-rockchip/ddr_rk3126.c

<!-- Source EN PDF p.16, block 135 -->

Vorgehen: Kommentieren Sie die folgenden Zeilen in ddr_init() aus:

<!-- Source EN PDF p.17, block 136 -->

```text
if(freq != 0)
    value = clk_set_rate(clk, 1000*1000*freq);
else
    value = clk_set_rate(clk, clk_get_rate(clk));
```

<!-- Source EN PDF p.17, block 137 -->

Chiptyp: RV1108

<!-- Source EN PDF p.17, block 138 -->

Codeposition: Funktion ddr_init() in arch/arm/mach-rockchip/ddr_rv1108.c

<!-- Source EN PDF p.17, block 139 -->

Vorgehen: Kommentieren Sie die folgenden Zeilen in ddr_init() aus:

<!-- Source EN PDF p.17, block 140 -->

```text
if (freq == 0)
_ddr_change_freq(ddr_freq_current);
else
_ddr_change_freq(freq);
```

<!-- Source EN PDF p.17, block 141 -->

Bei anderen Chips, einschließlich RK3126B und RK3126C mit trust.img, genügen die Änderungen aus dem Abschnitt zum Aktivieren/Deaktivieren der DDR-Frequenzskalierung im Kernel. Damit wird auch ddr_init erfasst. Für Kernel 3.0 gilt:

<!-- Source EN PDF p.17, block 142 -->

```text
Code Path
```

<!-- Source EN PDF p.17, block 143 -->

| Chiptyp | Codepfad |
|---|---|
| RK3066 | arch/arm/mach-rk30/ddr.c, Funktion ddr_init() |
| RK3026, RK3028A | arch/arm/mach-rk2928/ddr.c, Funktion ddr_init() |

<!-- Source EN PDF p.17, block 144 -->

```text
arch/arm/mach-rk2928/ddr.c, ddr_init() function
```

<!-- Source EN PDF p.17, block 145 -->

Vorgehen: Kommentieren Sie die folgenden Zeilen in ddr_init() aus:

<!-- Source EN PDF p.17, block 146 -->

```text
if(freq != 0)
    value=ddr_change_freq(freq);
else
    value=ddr_change_freq(clk_get_rate(clk_get(NULL, "ddr"))/1000000);
```

<!-- Source EN PDF p.17, block 147 -->

### 1.9 DDR-Kapazität überprüfen

<!-- Source EN PDF p.17, block 148 -->

Für eine grobe Kapazitätsprüfung lesen Sie MemTotal mit dem folgenden Befehl aus. Dieser Wert ist etwas kleiner als die tatsächliche Kapazität und sollte auf eine übliche Kapazitätsstufe aufgerundet werden.

<!-- Source EN PDF p.17, block 149 -->

```text
root@rk3399:/ # cat /proc/meminfo
MemTotal: 3969804 kB
```

<!-- Source EN PDF p.17, block 150 -->

Für detaillierte Kapazitätsangaben gehen Sie wie folgt vor:

<!-- Source EN PDF p.17, block 151 -->

DDR-Kapazitätsangaben werden bei der Initialisierung im Loader und teilweise im Kernel ausgegeben. Ab Kernel 4.4 gibt es keine Kernel-Ausgabe mehr; bei Kernel 3.10 besitzen einige Chips entsprechende Angaben, siehe Tabelle. Im Loader sind Details für alle Chips verfügbar. Diese Ausgabe muss über die serielle Schnittstelle erfasst werden; mit ADB wird sie verpasst.

<!-- Source EN PDF p.18, block 152 -->

| Chiptyp | Loader | Kernel 3.0/3.10/<br>Kernel 4.4 und später |
|---|---|---|
| RK3026 | √ | √ |
| RK3028A | √ | √ |
| RK3036 | √ | × |
| RK3066 | √ | √ |
| RK3126 | √ | √ |
| RK3126B, RK3126C mit trust.img | √ | × |
| RK3126B, RK3126C ohne trust.img | √ | √ |
| RK3128 | √ | √ |
| RK3188 | √ | √ |
| RK322x | √ | × |
| RK322xh | √ | × |
| RK3288 | √ | √ |
| RK3328 | √ | × |
| RK3368 | √ | × |
| RK3399 | √ | × |
| RV1108 | √ | × |
| Andere SoCs | √ | × |

<!-- Source EN PDF p.18, block 153 -->

√ bedeutet: Kapazitätsausgabe vorhanden.

<!-- Source EN PDF p.18, block 154 -->

× bedeutet: keine Kapazitätsausgabe.

<!-- Source EN PDF p.18, block 155 -->

Die DDR-Details umfassen Typ, Frequenz, Kanal (channel a/channel b), Busbreite BW, Zeilen row, Spalten col, Bänke BK, CS, Die-Busbreite die BW und Gesamtkapazität size.

<!-- Source EN PDF p.18, block 156 -->

Bei einem SoC mit einem DDR-Kanal entspricht die Gesamtkapazität "Size" bzw. "Total capacity". Bei zwei Kanälen ist sie die Summe dieser Werte beider Kanäle.

<!-- Source EN PDF p.18, block 157 -->

Die detaillierte Loader-Kapazitätsausgabe lautet:

<!-- Source EN PDF p.19, block 158 -->

```text
DDR Version 1.05 20170712
In
Channel a: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Channel b: DDR3 400MHz
Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Die Bus-Width=16 Size=1024MB
Memory OK
Memory OK
OUT
```

<!-- Source EN PDF p.19, block 159 -->

Die detaillierte Kapazitätsausgabe im Kernel lautet:

<!-- Source EN PDF p.19, block 160 -->

```text
[ 0.528564] DDR DEBUG: version 1.00 20150126
[ 0.528690] DDR DEBUG: Channel a:
[ 0.528701] DDR DEBUG: DDR3 Device
[ 0.528716] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528727] DDR DEBUG: Channel b:
[ 0.528736] DDR DEBUG: DDR3 Device
[ 0.528750] DDR DEBUG: Bus Width=32 Col=10 Bank=8 Row=15 CS=1 Total Capability=1024MB
[ 0.528762] DDR DEBUG: addr=0xd40000
```

<!-- Source EN PDF p.19, block 161 -->

### 1.10 DDR-Kapazität ändern

<!-- Source EN PDF p.19, block 162 -->

Die DDR-Kapazität wird derzeit auf allen Rockchip-Plattformen automatisch erkannt und muss nicht manuell konfiguriert werden. Die hier beschriebenen Änderungen dienen hauptsächlich zur Leistungsbewertung oder zur Untersuchung der Auswirkungen einer geringeren Kapazität.

<!-- Source EN PDF p.19, block 163 -->

Eine weitere Methode ist in Rockchip_Developer_Guide_UBoot_Nextdev_CN unter „CH08 Debugging Methods“ → „Modify DDR Capacity“ beschrieben.

<!-- Source EN PDF p.19, block 164 -->

Beim Start übergibt der DDR-Initialisierungscode die Kapazität an U-Boot. U-Boot zieht reservierten Sicherheitsspeicher ab und reicht die Angaben an den Kernel weiter. Die an den Kernel übergebene Kapazität kann während der U-Boot-Phase geändert werden.

<!-- Source EN PDF p.19, block 165 -->

Codeposition:

<!-- Source EN PDF p.19, block 166 -->

```text
./arch/arm/mach-rockchip/param.c
```

<!-- Source EN PDF p.19, block 167 -->

Änderungsschritte:

<!-- Source EN PDF p.19, block 168 -->

1\. Ergänzen Sie eine Ausgabe der aktuellen DDR-Kapazitätsinformationen.

<!-- Source EN PDF p.19, block 169 -->

```text
struct memblock *param_parse_ddr_mem(int *out_count)
{
    ...
    for (i = 0, n = 0; i < count; i++, n++) {
        base = t->u.ddr_mem.bank[i];
        size = t->u.ddr_mem.bank[i + count];
        printf("base:0x%llx, size:0x%llx\n", base, size); //Add this line to print
        /* 0~4GB */
        if (base < SZ_4GB) {
            mem[n].base = base;
            mem[n].size = ddr_mem_get_usable_size(base, size);
    ...
}
```

<!-- Source EN PDF p.20, block 171 -->

Kompilieren und programmieren Sie U-Boot nach dieser Änderung erneut. Das neue Startprotokoll enthält folgende Ausgabe:

<!-- Source EN PDF p.20, block 172 -->

```text
U-Boot 2017.09-g0236dc3682-220712-dirty #hcy (Aug 04 2022 - 10:46:07 +0800)
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM: base:0x0, size:0x40000000 //This line is the output we added
```

<!-- Source EN PDF p.20, block 173 -->

Dabei gilt:

<!-- Source EN PDF p.20, block 174 -->

```text
base:0x0, size:0x40000000
```

<!-- Source EN PDF p.20, block 175 -->

Wie unten dargestellt, gibt es einen DRAM-Bereich mit Basisadresse 0x0 und Größe 0x40000000.

<!-- Source EN PDF p.20, block 176 -->

![Technische Originalabbildung — PDF S. 20](/docs/rockchip-ddr/assets/en-p20-figure1.png)

<!-- Source EN PDF p.20, block 177 -->

Vor dem Kernelstart zieht U-Boot reservierten Sicherheitsspeicher ab und übergibt die DDR-Kapazität wie folgt an den Kernel.

<!-- Source EN PDF p.20, block 178 -->

```text
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000) //After removing the secure memory
block
Adding bank: 0x09400000 - 0x40000000 (size: 0x36c00000) //After removing the secure memory
block
Total: 1182.666 ms
Starting kernel ...
[ 0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

<!-- Source EN PDF p.21, block 179 -->

2\. Nachdem Sie diese Darstellung verstanden haben, können Sie die Angaben ändern.

<!-- Source EN PDF p.21, block 180 -->

Angenommen, ein weiterer DRAM-Bereich wird an der in der folgenden Abbildung als Region 1 bezeichneten Position hinzugefügt. Dafür sind folgende Änderungen möglich:

<!-- Source EN PDF p.21, block 181 -->

![Technische Originalabbildung — PDF S. 21](/docs/rockchip-ddr/assets/en-p21-figure1.png)

<!-- Source EN PDF p.21, block 182 -->

```text
struct memblock *param_parse_ddr_mem(int *out_count)
{
    ...
    /* extend top ram size */
    if (t->u.ddr_mem.flags & DDR_MEM_FLG_EXT_TOP)
        gd->ram_top_ext_size = t->u.ddr_mem.data[0];
    //Modify DDR capacity information,starting here
    count = 2;
    t->u.ddr_mem.count = count;
    t->u.ddr_mem.bank[0] = 0x0; //Region 0 base address
    t->u.ddr_mem.bank[0 + count] = 0x40000000 - 0x0; //Region 0 size
    t->u.ddr_mem.bank[1] = 0x70000000; //Region 1 base address
    t->u.ddr_mem.bank[1 + count] = 0x80000000 - 0x70000000; //Region 1 size
    t->u.ddr_mem.hash = 0;
    ///Modify DDR capacity information, end here
    /* normal ram size */
    count = t->u.ddr_mem.count;
    mem = calloc(count + MEM_RESV_COUNT, sizeof(*mem));
    if (!mem) {
        printf("Calloc ddr memory failed\n");
        return 0;
    }
    ...
    for (i = 0, n = 0; i < count; i++, n++) {
        base = t->u.ddr_mem.bank[i];
        size = t->u.ddr_mem.bank[i + count];
        printf("base:0x%llx, size:0x%llx\n", base, size);
        /* 0~4GB */
        if (base < SZ_4GB) {
            mem[n].base = base;
            mem[n].size = ddr_mem_get_usable_size(base, size);
    ...
}
```

<!-- Source EN PDF p.22, block 184 -->

Betrachten wir insbesondere den folgenden Code:

<!-- Source EN PDF p.22, block 185 -->

```text
    count = 2; //Indicates that there are 2 blocks of DRAM space
    t->u.ddr_mem.count = count; //Must be written like this
    t->u.ddr_mem.bank[0] = 0x0;
    t->u.ddr_mem.bank[0 + count] = 0x40000000 - 0x0; //The array index must have "+count"
    //Region base address plus Region size is One group, how many groups there are, must be
the same as the "count" above
    t->u.ddr_mem.bank[1] = 0x70000000;
    t->u.ddr_mem.bank[1 + count] = 0x80000000 - 0x70000000; //The array index must have
"+count"
    t->u.ddr_mem.hash = 0; //Must be written like this
```

<!-- Source EN PDF p.22, block 186 -->

Kompilieren und programmieren Sie U-Boot erneut. Im neuen Startprotokoll lässt sich erkennen, dass die Änderungen wirksam sind.

<!-- Source EN PDF p.22, block 187 -->

```text
...
U-Boot 2017.09-g0236dc3682-220712-dirty #hcy (Aug 04 2022 - 10:46:07 +0800)
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM: base:0x0, size:0x40000000
base:0x70000000, size:0x10000000 //this is what we have added
...
Adding bank: 0x00200000 - 0x08400000 (size: 0x08200000)
Adding bank: 0x09400000 - 0x40000000 (size: 0x36c00000)
Adding bank: 0x70000000 - 0x80000000 (size: 0x10000000) //this is what we have added
Total: 1182.666 ms
Starting kernel ...
[ 0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

<!-- Source EN PDF p.22, block 188 -->

Wenn weiterhin nur ein DRAM-Bereich vorhanden ist, dessen Größe aber auf 0x80000000 geändert werden soll, kann folgender Code ergänzt werden.

<!-- Source EN PDF p.23, block 189 -->

```text
count = 1; //Indicates that there is 1 block
t->u.ddr_mem.count = count; //Must be written like this
t->u.ddr_mem.bank[0] = 0x0;
t->u.ddr_mem.bank[0 + count] = 0x80000000 - 0x0; //The array index must have "+count"
t->u.ddr_mem.hash = 0; //Must be written like this
```

<!-- Source EN PDF p.23, block 190 -->

==Hinweis: Die DRAM-Kapazität darf nicht beliebig erhöht werden. Ohne tatsächlich vorhandenen Speicher arbeitet das System fehlerhaft. Üblicherweise wird die Größe für Tests reduziert. Region1 wird hier nur zur Veranschaulichung hinzugefügt.==

<!-- Source EN PDF p.23, block 191 -->

### 1.11 DDR-Frequenz überprüfen

<!-- Source EN PDF p.23, block 192 -->

Über devfreq:

<!-- Source EN PDF p.23, block 193 -->

Bei aktivierter DDR-Frequenzskalierung lässt sich die aktuelle Frequenz über folgende Knoten auslesen:

<!-- Source EN PDF p.23, block 194 -->

```text
cat /sys/class/devfreq/dmc/cur_freq
```

<!-- Source EN PDF p.23, block 195 -->

```text
console:/ # cat /sys/class/devfreq/dmc/cur_freq
780000000
```

<!-- Source EN PDF p.23, block 196 -->

Über clk_summary:

<!-- Source EN PDF p.23, block 197 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep scmi_clk_ddr
```

<!-- Source EN PDF p.23, block 198 -->

oder

<!-- Source EN PDF p.23, block 199 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep sclk_ddrc
```

<!-- Source EN PDF p.23, block 200 -->

oder

<!-- Source EN PDF p.23, block 201 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep sclk_ddr
```

<!-- Source EN PDF p.23, block 202 -->

Je nach Kernelversion.

<!-- Source EN PDF p.23, block 203 -->

```text
console:/ # cat /sys/kernel/debug/clk/clk_summary | grep scmi_clk_ddr
scmi_clk_ddr 0 0 0 2736000000 0 0 50000
/*2736000000 is the DDR frequency in Hz, that is, 2736MHz*/
```

<!-- Source EN PDF p.23, block 204 -->

### 1.12 DDR-Frequenz ändern

<!-- Source EN PDF p.23, block 205 -->

Der Kernel bietet zwei Strategien: szenarioabhängige und lastabhängige Frequenzskalierung. Kernel 4.4 und spätere Versionen unterscheiden sich dabei von Kernel 3.10.

<!-- Source EN PDF p.23, block 206 -->

Kernel 4.4 und spätere Versionen:

<!-- Source EN PDF p.24, block 207 -->

Szenarioabhängige Skalierung: Beim Eintritt in ein definiertes Szenario wird die durch SYS_STATUS_XXX festgelegte Frequenz verwendet, sofern die lastabhängige Skalierung deaktiviert ist. Ist sie aktiviert, wird die Frequenz anhand des tatsächlichen DDR-Zustands und der Werte upthreshold/downdifferential erhöht oder gesenkt, jedoch nicht unter SYS_STATUS_XXX.

<!-- Source EN PDF p.24, block 208 -->

Lastabhängige Skalierung: In allen Szenarien richtet sich die Frequenz nach der Last, bleibt jedoch oberhalb der durch SYS_STATUS_XXX festgelegten Untergrenze. Nur SYS_STATUS_NORMAL wird vollständig durch die Lastregelung ersetzt; dessen Mindestfrequenz wird durch auto-min-freq statt SYS_STATUS_NORMAL bestimmt.

<!-- Source EN PDF p.24, block 209 -->

Kernel 3.10:

<!-- Source EN PDF p.24, block 210 -->

Szenarioabhängige Skalierung: Beim Eintritt in ein definiertes Szenario wird die Frequenz auf SYS_STATUS_XXX gesetzt und bleibt dort, auch wenn die lastabhängige Funktion aktiviert ist.

<!-- Source EN PDF p.24, block 211 -->

Lastabhängige Skalierung: Ersetzt ausschließlich SYS_STATUS_NORMAL. Nur in diesem Szenario richtet sich die DDR-Frequenz nach der Last.

<!-- Source EN PDF p.24, block 212 -->

Die Änderung der DDR-Frequenz muss daher je nach Kernelzweig getrennt behandelt werden.

<!-- Source EN PDF p.24, block 213 -->

Für PX30S/RK3326S siehe den späteren Abschnitt zur DDR-Frequenzauswahl dieser Plattformen.

<!-- Source EN PDF p.24, block 214 -->

Für Plattformen mit vier Frequenzpunkten in der DDR-Binärdatei siehe den späteren entsprechenden Abschnitt zur Frequenzauswahl.

<!-- Source EN PDF p.24, block 215 -->

Bei Kernel 4.4 suchen Sie den dmc-Knoten in DTS. Beim RK3399-EVB befindet er sich beispielsweise in arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi und arch/arm64/boot/dts/rockchip/rk3399.dtsi.

<!-- Source EN PDF p.24, block 216 -->

```text
&dmc {
    status = "okay";
    center-supply = <&vdd_center>;
    upthreshold = <40>;
    downdifferential = <20>;
    system-status-freq = <
        /*system status freq(KHz)*/
        SYS_STATUS_NORMAL 800000
        SYS_STATUS_REBOOT 528000
        SYS_STATUS_SUSPEND 200000
        SYS_STATUS_VIDEO_1080P 200000
        SYS_STATUS_VIDEO_4K 600000
        SYS_STATUS_VIDEO_4K_10B 800000
        SYS_STATUS_PERFORMANCE 800000
        SYS_STATUS_BOOST 400000
        SYS_STATUS_DUALVIEW 600000
        SYS_STATUS_ISP 600000
    >;
    /* Each line is used as a group of data, "min_bw "and "max_bw" represent the bandwidth
requirement corresponded by vop.When the requirement value fallling between the range of
"min_bw" and "max_bw", the DDR frequency needs to increase the frequency specified by
"freq", and is valid at "auto-freq-en=1" */
    vop-bw-dmc-freq = <
    /* min_bw(MB/s) max_bw(MB/s) freq(KHz) */
        0 577 200000
        578 1701 300000
        1702 99999 400000
    >;
    auto-min-freq = <200000>;
};
```

<!-- Source EN PDF p.25, block 218 -->

```text
dmc: dmc {
    compatible = "rockchip,rk3399-dmc";
    devfreq-events = <&dfi>;
    interrupts = <GIC_SPI 1 IRQ_TYPE_LEVEL_HIGH 0>;
    clocks = <&cru SCLK_DDRCLK>;
    clock-names = "dmc_clk";
    ddr_timing = <&ddr_timing>;
    /* DDR utilization exceeds 40%, starts to increase frequency when "auto-freq-en=1 " */
    upthreshold = <40>;
    /* DDR utilization less than 20%, start to reduce frequency when "auto-freq-en=1 " */
    downdifferential = <20>;
    system-status-freq = <
    /*system status freq(KHz)*/
    /* It is valid when "auto-freq-en=0". It indicates that this scene is in common use
except for the following scenes */
    SYS_STATUS_NORMAL 800000
    /* It means the DDR frequency before reboot. When auto-freq-en=1, this frequency will be
used as the min value and increased according to the load status */
    SYS_STATUS_REBOOT 528000
    /* It means the DDR frequency at early suspend. When auto-freq-en=1, this frequency will
be used as the min value and increased according to the load status */
    SYS_STATUS_SUSPEND 200000
    /* It means the DDR frequency at playing 1080P video.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_1080P 300000
    /* It means the DDR frequency at playing 4K video When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_4K 600000
    /* It means the DDR frequency at playing 4K 10bit video. When auto-freq-en=1, this
frequency will be used as the min value and increased according to the load status */
    SYS_STATUS_VIDEO_4K_10B 800000
    /* It means the DDR frequency at performance mode.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_PERFORMANCE 800000
    /* It means the DDR frequency at touching,getting higher frequency from low in order to
improve touching respond.When auto-freq-en=1, this frequency will be used as the min value
and increased according to the load status */
    SYS_STATUS_BOOST 400000
    /* It means the DDR frequency at dual display mode.When auto-freq-en=1, this frequency
will be used as the min value and increased according to the load status */
    SYS_STATUS_DUALVIEW 600000
    /* It means the DDR frequency at ISP mode.When auto-freq-en=1, this frequency will be
used as the min value and increased according to the load status */
    SYS_STATUS_ISP 600000
    >;
    /* When auto-freq-en=1, this frequency will be used as the min value of
SYS_STATUS_NORMAL scenario */
    auto-min-freq = <400000>;
    /* The value equals to 1,which indicates this function is on, to 0,which means off.If it
is on, "SYS_STATUS_NORMAL" will be taken by the load frequency completely and the lowest
frequency is" auto-min-freq" instead of "SYS_STATUS_NORMAL".That means,it takes the
frequency defined by this scene as the lowest frequency and the system will increase or
reduece DDR frequency through "upthreshold/downdifferential" according to DDR utilization */
    auto-freq-en = <1>;
    status = "disabled";
};
```

<!-- Source EN PDF p.26, block 220 -->

==Hinweis 1==: Die Frequenz-/Spannungsbehandlung von Kernel 4.4 unterscheidet sich von Kernel 3.10. Exakt wird nur eine in dmc_opp_table als opp-hz aufgeführte Frequenz verwendet. Zwischenwerte werden auf die passende höhere Stufe gerundet; Werte oberhalb der maximalen Stufe werden auf diese begrenzt. Beachten Sie daher dmc_opp_table, wenn diese Begrenzung unerwünscht ist.

<!-- Source EN PDF p.26, block 221 -->

```text
dmc_opp_table: opp-table3 {
    opp-200000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <200000000>;
        opp-microvolt = <825000>; //vdd_center voltage
    };
    ...
    opp-800000000 {
        opp-hz = /bits/ 64 <800000000>;
        opp-microvolt = <900000>;
    };
};
```

<!-- Source EN PDF p.26, block 222 -->

Nachdem Sie die Konfiguration verstanden haben, ändern Sie die Frequenzdefinition des gewünschten Szenarios. Bei auto-freq-en=1 lässt sich die Frequenz nicht direkt festhalten. Zur Fehlersuche durch Frequenzsenkung setzen Sie auto-freq-en auf 0 und passen anschließend die Frequenzen der einzelnen Szenarien an.

<!-- Source EN PDF p.26, block 223 -->

==Hinweis 2==: Bei RK3399 mit LPDDR4 und RV1126 werden die unterstützten Skalierungsfrequenzen bereits im Loader festgelegt und während der DDR-Initialisierung seriell ausgegeben. Die Frequenzen in dmc_opp_table müssen damit übereinstimmen.

<!-- Source EN PDF p.26, block 224 -->

Beim RV1126-Beispiel gibt der Loader 328MHz, 528MHz, 784MHz und 924MHz aus. dmc_opp_table darf daher nur diese vier Frequenzen enthalten.

<!-- Source EN PDF p.26, block 225 -->

```text
change to: 328MHz
change to: 528MHz
change to: 784MHz
change to: 924MHz(final freq)
```

<!-- Source EN PDF p.26, block 226 -->

```text
dmc_opp_table: dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <800000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <800000>;
    };
    opp-784000000 {
        opp-hz = /bits/ 64 <784000000>;
        opp-microvolt = <800000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <800000>;
    };
};
```

<!-- Source EN PDF p.27, block 228 -->

Stimmen dmc_opp_table und Loader nicht überein, tritt beim Frequenzwechsel durch den Kernel-dmc-Treiber ein Frequenzzuordnungsfehler auf. Das Protokoll lautet:

<!-- Source EN PDF p.27, block 229 -->

```text
rockchip-dmc dmc: Get wrong frequency, Request 1056000000, Current 924000000
```

<!-- Source EN PDF p.27, block 230 -->

Bei Kernel 3.10 suchen Sie clk_ddr_dvfs_table in DTS. Beim RK3288-SDK liegt der letztlich wirksame Knoten beispielsweise in arch/arm/boot/dts/rk3288-tb_8846.dts.

<!-- Source EN PDF p.27, block 231 -->

```text
&clk_ddr_dvfs_table {
    /* The logic voltage corresponding to the DDR frequency, if the frequency in "freq-
table" or "bd-freq-table" is larger than the maximum frequency here, the corresponding
voltage cannot be found and can not switched to the corresponding frequency. At this time,
you need to add frequency voltage table here */
    operating-points = <
        /* KHz uV */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    freq-table = <
        /*status freq(KHz)*/
        /* It is valid only when "auto-freq-en=0".And it indicates that this scene is common
use scene except for the following scenes */
        SYS_STATUS_NORMAL 400000
        /* DDR frequency at the early suspend */
        SYS_STATUS_SUSPEND 200000
        /* DDR frequency at playing 1080P video */
        SYS_STATUS_VIDEO_1080P 240000
        /* DDR frequency at playing 4K video */
        SYS_STATUS_VIDEO_4K 400000
        /* DDR frequency at playing 60FPS video */
        SYS_STATUS_VIDEO_4K_60FPS 400000
        /* DDR frequency at performance mode */
        SYS_STATUS_PERFORMANCE 528000
        /* DDR frequency at dual display */
        SYS_STATUS_DUALVIEW 400000
        /* DDR frequency at touching,getting higher frequency from low in order to improve
touching respond */
        SYS_STATUS_BOOST 324000
        /* DDR frequency at ISP */
        SYS_STATUS_ISP 400000
        >;
    bd-freq-table = <
        /* bandwidth freq */
        5000 800000
        3500 456000
        2600 396000
        2000 324000
    >;
    /* After the load frequency scaling turned on,where the "SYS_STATUS_NORMAL" scenario, it
will switch between several frequencies listed by this table according to the DDR bandwidth
utilization */
    auto-freq-table = <
        240000
        324000
        396000
        528000
        >;
    /* The value equals to "1", indicating that the load frequency conversion function is
enabled; equals to 0, means disabled. After the load frequency conversion function turning
on, the "SYS_STATUS_NORMAL" scene frequency scaling will be completely replaced by the load
scaling frequency */
    auto-freq=<1>;
    /*
     * 0: use standard flow
     * 1: vop dclk never divided
     * 2: vop dclk always divided
     */
    vop-dclk-mode = <0>;
    status="okay";
};
```

<!-- Source EN PDF p.28, block 233 -->

Nachdem Sie die Konfiguration verstanden haben, ändern Sie die Frequenzdefinition des gewünschten Szenarios. Bei auto-freq-en=1 lässt sich die Frequenz nicht direkt festhalten. Zur Fehlersuche durch Frequenzsenkung setzen Sie auto-freq-en auf 0 und passen anschließend die Frequenzen der einzelnen Szenarien an.

<!-- Source EN PDF p.28, block 234 -->

==Hinweis: Stellen Sie sicher, dass die Spannung für die gewählte Frequenz geeignet ist.== Zur Spannungsänderung siehe den Abschnitt zur Spannung einer bestimmten DDR-Frequenz.

<!-- Source EN PDF p.28, block 235 -->

Laut dieser Quellzeile ist bei kernel3.10 dvfs_ddr_table in der Boarddatei borad-\*\*.c zu suchen. Beim RK3066-SDK liegt es beispielsweise in arch/arm/mach-rk30/board-rk30-sdk.c.

<!-- Source EN PDF p.29, block 236 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    /* DDR frequency at the early suspend */
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    /* DDR frequency at playing video */
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    /* it indicates that this scene is common use scene except for above two scenes */
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.29, block 237 -->

Kernel 3.0 besitzt nur drei Szenarien. Ändern Sie den Wert "200 \* 1000" von .frequency; die Einheit ist KHz. Der Zusatz "+ DDR_FREQ_SUSPEND" kann dabei ignoriert werden.

<!-- Source EN PDF p.29, block 238 -->

==Hinweis: Stellen Sie sicher, dass die Spannung für die gewählte Frequenz geeignet ist.== Zur Spannungsänderung siehe den Abschnitt zur Spannung einer bestimmten DDR-Frequenz.

<!-- Source EN PDF p.29, block 239 -->

#### 1.12.1 RK3399 mit LPDDR4 für 928MHz konfigurieren

<!-- Source EN PDF p.29, block 240 -->

1\. Ändern Sie RKBOOT/RK3399MINIALL.ini im rkbin-Verzeichnis, wählen Sie die 933MHz-DDR-Binärdatei und packen Sie den Loader.

<!-- Source EN PDF p.29, block 241 -->

```text
diff --git a/RKBOOT/RK3399MINIALL.ini b/RKBOOT/RK3399MINIALL.ini
index d8e71dd7..3e20f255 100755
--- a/RKBOOT/RK3399MINIALL.ini
+++ b/RKBOOT/RK3399MINIALL.ini
@@ -5,7 +5,7 @@ MAJOR=1
 MINOR=26
 [CODE471_OPTION]
 NUM=1
-Path1=bin/rk33/rk3399_ddr_800MHz_v1.27.bin
+Path1=bin/rk33/rk3399_ddr_933MHz_v1.27.bin
 Sleep=1
 [CODE472_OPTION]
 NUM=1
@@ -14,7 +14,7 @@ Path1=bin/rk33/rk3399_usbplug_v1.26.bin
 NUM=2
 LOADER1=FlashData
 LOADER2=FlashBoot
-FlashData=bin/rk33/rk3399_ddr_800MHz_v1.27.bin
+FlashData=bin/rk33/rk3399_ddr_933MHz_v1.27.bin
 FlashBoot=bin/rk33/rk3399_miniloader_v1.26.bin
 [OUTPUT]
 PATH=rk3399_loader_v1.27.126.bin
```

<!-- Source EN PDF p.29, block 242 -->

Nach Programmierung des gepackten Loaders zeigt das serielle Protokoll fünf unterstützte Frequenzen: 416MHz, 856MHz, 328MHz, 666MHz und 928MHz. Die aktuell laufende DDR-Frequenz beträgt 856MHz.

<!-- Source EN PDF p.30, block 243 -->

```text
DDR Version 1.27 20211018
In
...
support 416 856 328 666 928 MHz, current 856MHz
OUT
```

<!-- Source EN PDF p.30, block 244 -->

2\. Ändern Sie im Kernel-DTS-Knoten dmc_opp_table die Eigenschaft status = "disabled" von opp-928000000 auf status = "okay", oder entfernen Sie die status-Eigenschaft.

<!-- Source EN PDF p.30, block 245 -->

```text
                opp-928000000 {
                        opp-hz = /bits/ 64 <928000000>;
                        opp-microvolt = <900000>;
- status = "disabled";
                };
```

<!-- Source EN PDF p.30, block 246 -->

3\. Ersetzen Sie im Kernel-DTS-dmc-Knoten alle "856000" der Tabelle system-status-freq durch "928000". Alternativ passen Sie die SYS_STATUS_XXX-Szenarien gemäß dem Abschnitt zur DDR-Frequenzänderung gezielt an den Bandbreitenbedarf des Projekts an.

<!-- Source EN PDF p.30, block 247 -->

#### 1.12.2 DDR-Frequenzauswahl für PX30S/RK3326S

<!-- Source EN PDF p.30, block 248 -->

RK3326S/PX30S unterstützt nur vier Frequenzpunkte. Diese werden im Knoten ddrx_params von arch/arm64/boot/dts/rockchip/px30s-dram-default-timing.dtsi und im Knoten px30s_dmc_opp_table von arch/arm64/boot/dts/rockchip/px30.dtsi konfiguriert.

<!-- Source EN PDF p.30, block 249 -->

Bei DDR3 konfigurieren Sie freq_0, freq_1, freq_2 und freq_3 in ddr3_params; bei DDR4 entsprechend in ddr4_params.

<!-- Source EN PDF p.30, block 250 -->

Alle DDR-Typen teilen sich die Frequenzliste in px30s_dmc_opp_table. Aktivierte Frequenzen müssen zu freq_0, freq_1, freq_2 und freq_3 des jeweiligen ddrx_params-Knotens passen. Bei LPDDR4 müssen sie also den Werten in lpddr4_params entsprechen. Beispiel:

<!-- Source EN PDF p.30, block 251 -->

```text
px30s_dmc_opp_table: px30s-dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <1000000>;
    };
    opp-666000000 {
        opp-hz = /bits/ 64 <666000000>;
        opp-microvolt = <1000000>;
    };
    opp-786000000 {
        opp-hz = /bits/ 64 <786000000>;
        opp-microvolt = <1000000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <1000000>;
    };
    /* 1056M only for LP4 */
    opp-1056000000 {
        opp-hz = /bits/ 64 <1056000000>;
        opp-microvolt = <1000000>;
        status = "disabled";
    };
};
```

<!-- Source EN PDF p.31, block 253 -->

```text
/ {
    ...
    lpddr4_params: lpddr4-params {
        ...
        /* freq info, freq_0 is final frequency, unit: MHz */
        freq_0 = <924>;
        freq_1 = <328>;
        freq_2 = <666>;
        freq_3 = <786>;
        ...
    };
};
```

<!-- Source EN PDF p.31, block 254 -->

Soll LPDDR4 mit 1056 MHz laufen, ändern Sie einen der Werte freq_0, freq_1, freq_2 oder freq_3 in lpddr4_params auf 1056. Deaktivieren Sie außerdem den alten Frequenzpunkt in px30s_dmc_opp_table und ergänzen Sie 1056000000.

<!-- Source EN PDF p.31, block 255 -->

Die neue Konfiguration lautet:

<!-- Source EN PDF p.31, block 256 -->

```text
px30s_dmc_opp_table: px30s-dmc-opp-table {
    compatible = "operating-points-v2";
    opp-328000000 {
        opp-hz = /bits/ 64 <328000000>;
        opp-microvolt = <1000000>;
    };
    opp-666000000 {
        opp-hz = /bits/ 64 <666000000>;
        opp-microvolt = <1000000>;
    };
    opp-786000000 {
        opp-hz = /bits/ 64 <786000000>;
        opp-microvolt = <1000000>;
    };
    opp-924000000 {
        opp-hz = /bits/ 64 <924000000>;
        opp-microvolt = <1000000>;
        status = "disabled";
    };
    /* 1056M only for LP4 */
    opp-1056000000 {
        opp-hz = /bits/ 64 <1056000000>;
        opp-microvolt = <1000000>;
    };
};
```

<!-- Source EN PDF p.32, block 258 -->

```text
/ {
    ...
    lpddr4_params: lpddr4-params {
        ...
        /* freq info, freq_0 is final frequency, unit: MHz */
        freq_0 = <1056>;
        freq_1 = <328>;
        freq_2 = <666>;
        freq_3 = <786>;
        ...
    };
};
```

<!-- Source EN PDF p.32, block 259 -->

#### 1.12.3 Frequenzauswahl bei DDR-Binärdateien mit vier Frequenzpunkten

<!-- Source EN PDF p.32, block 260 -->

Dieser Abschnitt gilt für die zuvor aufgeführten Plattformen mit vier Frequenzpunkten, mit Ausnahme von RV1126.

<!-- Source EN PDF p.32, block 261 -->

Der Loader dieser Plattformen führt vier Frequenzwechsel aus und speichert die zugehörigen Trainingsergebnisse.

<!-- Source EN PDF p.32, block 262 -->

F1, F2, F3 und F0 bezeichnen diese vier Frequenzen. Standardmäßig wird der Loader mit F0 verlassen.

<!-- Source EN PDF p.32, block 263 -->

```text
DDR ... v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=8 CS0 Row=16/0 CS1 Row=16/0 CS=2 Die BW=16 Size=2048MB
...
change to F1: 528MHz /* 4 DDR frequencies*/
change to F2: 1068MHz
change to F3: 1560MHz
change to F0: 2112MHz
out
```

<!-- Source EN PDF p.32, block 264 -->

Obwohl die unterstützten Frequenzen bereits im Loader festgelegt werden, liest der Kernel-dmc-Treiber sie automatisch aus. Deshalb besteht kein Zuordnungsproblem mit dmc_opp_table. Die Kernel-dmc-Knoten lauten:

<!-- Source EN PDF p.32, block 265 -->

```text
dmc: dmc {
    ...
    system-status-freq = <
    /*system status freq(KHz)*/
    SYS_STATUS_NORMAL DMC_FREQ_LEVEL_MID_HIGH
    SYS_STATUS_REBOOT DMC_FREQ_LEVEL_MID_LOW
    ...
    SYS_STATUS_SUSPEND DMC_FREQ_LEVEL_LOW
    ...
    SYS_STATUS_PERFORMANCE DMC_FREQ_LEVEL_HIGH
    ...
    >;
    ...
};
```

<!-- Source EN PDF p.33, block 267 -->

Die Frequenzen der Szenarien werden nicht mehr direkt angegeben, sondern durch Makros wie DMC_FREQ_LEVEL_HIGH. Diese ordnen sich automatisch den vier Loader-Frequenzen zu. Werden diese mit dem Werkzeug zur DDR-Binärdateibearbeitung geändert, folgen die Makros automatisch den neuen Werten. Für das obige Loader-Beispiel gilt:

<!-- Source EN PDF p.33, block 268 -->

| Makrodefinition | Frequenz | Erläuterung |
|---|---|---|
| DMC_FREQ_LEVEL_HIGH | F0 2112MHz | Höchste Frequenz |
| DMC_FREQ_LEVEL_MID_HIGH | F3 1560MHz | Zweithöchste Frequenz |
| DMC_FREQ_LEVEL_MID_LOW | F2 1068MHz | Zweitniedrigste Frequenz |
| DMC_FREQ_LEVEL_LOW | F1 528MHz | Niedrigste Frequenz |

<!-- Source EN PDF p.33, block 269 -->

Zur Änderung der Frequenzwerte F0, F1, F2 und F3 siehe den Abschnitt zur Bearbeitung der DDR-Binärdatei.

<!-- Source EN PDF p.33, block 270 -->

Um die Frequenz eines Szenarios wie SYS_STATUS_NORMAL oder SYS_STATUS_REBOOT zu ändern, ersetzen Sie dessen Frequenzdefinition durch DMC_FREQ_LEVEL_HIGH, DMC_FREQ_LEVEL_MID_HIGH, DMC_FREQ_LEVEL_MID_LOW oder DMC_FREQ_LEVEL_LOW.

<!-- Source EN PDF p.33, block 271 -->

### 1.13 Spannung einer bestimmten DDR-Frequenz ändern

<!-- Source EN PDF p.33, block 272 -->

Zur Fehlersuche durch befehlsbasierte Spannungsänderung gilt: Nach Kernel 4.4 kann die Spannung eines Regulators direkt über /sys/kernel/debug/regulator/ angepasst werden. Fixieren Sie zuvor die DDR-Frequenz, da sonst Konflikte mit der Spannungsregelung der Frequenzskalierung entstehen. Siehe den Abschnitt zum Fixieren der DDR-Frequenz.

<!-- Source EN PDF p.33, block 273 -->

Beispiel für die Spannungsanpassung auf RK3588:

<!-- Source EN PDF p.33, block 274 -->

```text
cat /sys/kernel/debug/regulator/vdd_ddr_s0/voltage
echo 700000 > /sys/kernel/debug/regulator/vdd_ddr_s0/voltage
```

<!-- Source EN PDF p.34, block 275 -->

Je nach Plattform müssen folgende Regulatoren angepasst werden:

<!-- Source EN PDF p.34, block 276 -->

| Plattform | Anzupassende Knoten |
|---|---|
| RK3308/RK3308B | "vdd_core" oder "vdd_log" |
| RK3576 | "vdd_logic_s0" und "vdd_ddr_s0" |
| RK3588 | "vdd_log_s0" und "vdd_ddr_s0" |
| Andere SoCs | "vdd_center" oder "vdd_logic" |

<!-- Source EN PDF p.34, block 277 -->

Kernel 4.4: Kompilieren Sie den Kernel mit aktivierter Option "pm_tests": make ARCH=arm64 menuconfig → Device Drivers → SOC (System On Chip) specific Drivers → Rockchip pm_test support.

<!-- Source EN PDF p.34, block 278 -->

Kernel 3.10: Kompilieren Sie den Kernel mit aktivierter Option "pm_tests": make menuconfig → System Type → /sys/pm_tests/ support.

<!-- Source EN PDF p.34, block 279 -->

Befehl zur Änderung der DDR-Spannung:

<!-- Source EN PDF p.34, block 280 -->

RK3399

<!-- Source EN PDF p.34, block 281 -->

```text
echo set vdd_center 900000 > /sys/pm_tests/clk_volt
```

<!-- Source EN PDF p.34, block 282 -->

Andere Chips

<!-- Source EN PDF p.34, block 283 -->

```text
echo set vdd_logic 1200000 > /sys/pm_tests/clk_volt
```

<!-- Source EN PDF p.34, block 284 -->

Fehlt "pm_tests" oder genügt der Befehl nicht, muss die Kernel-Firmware wie folgt geändert werden:

<!-- Source EN PDF p.34, block 285 -->

Bei Kernel 4.4 suchen Sie dmc_opp_table in DTS. Beim RK3399-EVB liegt der Knoten in arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi, beim RK3368 in arch/arm64/boot/dts/rockchip/rk3368.dtsi.

<!-- Source EN PDF p.34, block 286 -->

Beispiel RK3399:

<!-- Source EN PDF p.34, block 287 -->

```text
/* it runs in this frequency only when frequency equals to "opp-hz"listed by
"dmc_opp_table".If the frequency less than "opp-hz", the frequency will getting
higher,otherwise, it exceeds "opp-hz" the upper limited,it will restricted by "opp-hz".It is
different from kernel 3.10 */
dmc_opp_table: opp-table3 {
    compatible = "operating-points-v2";
    opp-200000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <200000000>;
        opp-microvolt = <825000>; //vdd_center voltage
    };
    opp-300000000 {
        opp-hz = /bits/ 64 <300000000>;
        opp-microvolt = <850000>;
    };
    opp-400000000 {
        opp-hz = /bits/ 64 <400000000>;
        opp-microvolt = <850000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <900000>;
    };
    opp-600000000 {
        opp-hz = /bits/ 64 <600000000>;
        opp-microvolt = <900000>;
    };
    opp-800000000 {
        opp-hz = /bits/ 64 <800000000>;
        opp-microvolt = <900000>;
    };
};
```

<!-- Source EN PDF p.35, block 289 -->

Beispiel RK3368:

<!-- Source EN PDF p.35, block 290 -->

```text
/* it runs in this frequency only when frequency equals to "opp-hz"listed by
"dmc_opp_table".If the frequency less than "opp-hz", the frequency will getting
higher,otherwise, it exceeds "opp-hz" the upper limited,it will restricted by "opp-hz".It is
different from kernel 3.10 */
dmc_opp_table: opp_table2 {
    compatible = "operating-points-v2";
    opp-192000000 {
        /* When the DDR frequency equals to 200MHz,this voltage is effective;less than
200MHz,running at 200MHz */
        opp-hz = /bits/ 64 <192000000>;
        opp-microvolt = <1100000>; //vdd_logic voltage
    };
    opp-300000000 {
        opp-hz = /bits/ 64 <300000000>;
        opp-microvolt = <1100000>;
    };
    opp-396000000 {
        opp-hz = /bits/ 64 <396000000>;
        opp-microvolt = <1100000>;
    };
    opp-528000000 {
        opp-hz = /bits/ 64 <528000000>;
        opp-microvolt = <1100000>;
    };
    opp-600000000 {
        opp-hz = /bits/ 64 <600000000>;
        opp-microvolt = <1100000>;
    };
};
```

<!-- Source EN PDF p.36, block 291 -->

Die zur Frequenz gehörende Spannung kann geändert werden. Die Frequenz-/Spannungstabelle liefert nur Zuordnungen innerhalb ihres definierten Frequenzbereichs. Für eine neue Frequenz oberhalb der Tabellengrenze fehlt eine passende Spannung, sodass der DDR-Wechsel scheitert. Ergänzen Sie in diesem Fall einen entsprechenden Frequenz-/Spannungseintrag.

<!-- Source EN PDF p.36, block 292 -->

Bei Kernel 3.10 suchen Sie clk_ddr_dvfs_table in DTS. Beim RK3288-SDK liegt der wirksame Knoten beispielsweise in arch/arm/boot/dts/rk3288-tb_8846.dts.

<!-- Source EN PDF p.36, block 293 -->

```text
&clk_ddr_dvfs_table {
    /* This is Frequency-voltage table */
    operating-points = <
        /* KHz uV */
        /* it is show when DDR frequency less than or equals to 200MHz,logic voltage uses
1050mV.Other lines mean the same here */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    ...
    status="okay";
};
```

<!-- Source EN PDF p.36, block 294 -->

Die zur Frequenz gehörende Spannung kann geändert werden. Die Frequenz-/Spannungstabelle liefert nur Zuordnungen innerhalb ihres definierten Frequenzbereichs. Für eine neue Frequenz oberhalb der Tabellengrenze fehlt eine passende Spannung, sodass der DDR-Wechsel scheitert. Ergänzen Sie in diesem Fall einen entsprechenden Frequenz-/Spannungseintrag.

<!-- Source EN PDF p.36, block 295 -->

Bei Kernel 3.0 ändern Sie dvfs_ddr_table in borad-\*\*.c. Beim RK3066-SDK

<!-- Source EN PDF p.36, block 296 -->

liegt diese Boarddatei unter arch/arm/mach-rk30/board-rk30-sdk.c.

<!-- Source EN PDF p.36, block 297 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    {.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    {.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.36, block 298 -->

".index" in dvfs_ddr_table bezeichnet die zugehörige Spannung in uV.

<!-- Source EN PDF p.36, block 299 -->

### 1.14 Lastabhängige Skalierung deaktivieren und nur Szenarioskalierung beibehalten

<!-- Source EN PDF p.36, block 300 -->

Ab Kernel 4.4 suchen Sie auto-freq-en im DTS-dmc-Knoten. Beim RK3399-EVB liegt es beispielsweise in arch/arm64/boot/dts/rockchip/rk3399.dtsi.

<!-- Source EN PDF p.37, block 301 -->

```text
dmc: dmc {
    compatible = "rockchip,rk3399-dmc";
    ...
    auto-min-freq = <400000>;
    /* Set this value to 0 to close the load DDR Frequency scaling with leaving only the
scene frequency scaling */
    auto-freq-en = <0>;
    ...
};
```

<!-- Source EN PDF p.37, block 302 -->

Bei Kernel 3.10 suchen Sie clk_ddr_dvfs_table in DTS. Beim RK3288-EVB liegt es beispielsweise in arch/arm/boot/dts/rk3288-tb_8846.dts.

<!-- Source EN PDF p.37, block 303 -->

```text
&clk_ddr_dvfs_table {
    ...
    /* Set this value to 0 to close the load DDR Frequency scaling with leaving only the
scene frequency scaling */
    auto-freq=<0>;
    ...
    status="okay";
};
```

<!-- Source EN PDF p.37, block 304 -->

Kernel 3.0 unterstützt keine lastabhängige Frequenzskalierung; sie muss daher nicht deaktiviert werden.

<!-- Source EN PDF p.37, block 305 -->

### 1.15 DDR-Frequenz fixieren

<!-- Source EN PDF p.37, block 306 -->

Zur Fehlersuche können Sie die DDR-Frequenz mit folgenden Befehlen fixieren:

<!-- Source EN PDF p.37, block 307 -->

Kernel 4.4 und spätere Versionen:

<!-- Source EN PDF p.37, block 308 -->

Verfügbare DDR-Frequenzen abfragen: cat /sys/class/devfreq/dmc/available_frequencies

<!-- Source EN PDF p.37, block 309 -->

Frequenz setzen:

<!-- Source EN PDF p.37, block 310 -->

```text
echo userspace > /sys/class/devfreq/dmc/governor
echo 300000000 > /sys/class/devfreq/dmc/min_freq //This line purposes to prevent the frequency to be set lower than "min_freq", cause operation failed.
echo 300000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

<!-- Source EN PDF p.37, block 311 -->

Kernel 3.10:

<!-- Source EN PDF p.37, block 312 -->

Kompilieren Sie den Kernel mit aktivierter Option "pm_tests": make menuconfig → System Type → /sys/pm_tests/ support. Der Befehl zum Fixieren der DDR-Frequenz lautet:

<!-- Source EN PDF p.37, block 313 -->

```text
echo set clk_ddr 300000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.37, block 314 -->

Die Frequenzeinheit ist Hz; der Befehlsparameter kann nach Bedarf geändert werden.

<!-- Source EN PDF p.37, block 315 -->

Ist diese Methode nicht möglich, müssen Code oder DTS angepasst werden.

<!-- Source EN PDF p.37, block 316 -->

Ab Kernel 4.4 liegt ein Fehlschlag meist daran, dass die Zielfrequenz nicht in der Ausgabe von cat /sys/class/devfreq/dmc/available_frequencies enthalten ist.

<!-- Source EN PDF p.38, block 317 -->

Ergänzen Sie die Zielfrequenz in dmc_opp_table der boardspezifischen DTS-Datei. Beim RK3399-EVB liegt diese in arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi. Beispiel für 666MHz:

<!-- Source EN PDF p.38, block 318 -->

```text
dmc_opp_table: opp-table3 {
compatible = "operating-points-v2";
opp-200000000 {
    opp-hz = /bits/ 64 <200000000>;
    opp-microvolt = <825000>;
};
...
opp-666000000 {
    /* When DDR frequency equals to 666MHz,use this voltage */
    opp-hz = /bits/ 64 <666000000>;
    opp-microvolt = <900000>; //vdd_center voltage
};
opp-800000000 {
    opp-hz = /bits/ 64 <800000000>;
    opp-microvolt = <900000>;
};
};
```

<!-- Source EN PDF p.38, block 319 -->

Anschließend kann die Frequenz mit dem vorherigen Befehl fixiert werden.

<!-- Source EN PDF p.38, block 320 -->

Soll das Gerät ohne manuelle Befehlseingabe bereits mit einer festen Frequenz starten, ändern Sie DTS wie folgt:

<!-- Source EN PDF p.38, block 321 -->

Angenommen, die Zielfrequenz beträgt 666MHz. Der dmc-Knoten des RK3399-EVB liegt beispielsweise in arch/arm64/boot/dts/rockchip/rk3399-evb.dtsi.

<!-- Source EN PDF p.38, block 322 -->

```text
/* Here "dfi" status must be "okay", it is due to lagacy code, the dmc node is
restriced by the dfi node. If the "dfi" node is disabled, it will also invalidate the
dmc node. So it is best to keep the status of the "dfi" node consistent with dmc */
&dfi {
    status = "okay";
};
&dmc {
status = "okay";
...
system-status-freq = <
    /*system status freq(KHz)*/
    SYS_STATUS_NORMAL 666000
    /* Remove the rest scenario */
    /*
    SYS_STATUS_REBOOT 528000
    SYS_STATUS_SUSPEND 200000
    SYS_STATUS_VIDEO_1080P 200000
    SYS_STATUS_VIDEO_4K 600000
    SYS_STATUS_VIDEO_4K_10B 800000
    SYS_STATUS_PERFORMANCE 800000
    SYS_STATUS_BOOST 400000
    SYS_STATUS_DUALVIEW 600000
    SYS_STATUS_ISP 600000
    */
>;
...
auto-min-freq = <666000>;
/* The value of "auto-freq-en" shall be 0 to disable load DDR Frequency scaling */
auto-freq-en = <0>;
};
```

<!-- Source EN PDF p.39, block 324 -->

Bei Kernel 3.10 suchen Sie clk_ddr_dvfs_table. Beim RK3288-SDK liegt es beispielsweise in arch/arm/boot/dts/rk3288-tb_8846.dts.

<!-- Source EN PDF p.39, block 325 -->

```text
&clk_ddr_dvfs_table {
    operating-points = <
        /* KHz uV */
        /* step 3,if the target frequency exceeds the maximun of this table,you shall add
the voltage table corresponding to the target frequency */
        200000 1050000
        300000 1050000
        400000 1100000
        533000 1150000
        >;
    freq-table = <
        /*status freq(KHz)*/
        /* step 2, Comment out the other scenario,keep "SYS_STATUS_NORMAL" and define it to
you target frequency, for example you need 400MHz as below */
        SYS_STATUS_NORMAL 400000
        /*
        SYS_STATUS_SUSPEND 200000
        SYS_STATUS_VIDEO_1080P 240000
        SYS_STATUS_VIDEO_4K 400000
        SYS_STATUS_VIDEO_4K_60FPS 400000
        SYS_STATUS_PERFORMANCE 528000
        SYS_STATUS_DUALVIEW 400000
        SYS_STATUS_BOOST 324000
        SYS_STATUS_ISP 400000
        */
        >;
    bd-freq-table = <
        /* bandwidth freq */
        5000 800000
        3500 456000
        2600 396000
        2000 324000
    >;
    auto-freq-table = <
        240000
        324000
        396000
        528000
        >;
    /* setp 1，set 0 to disable load DDR Frequency scaling */
    auto-freq=<0>;
    /*
     * 0: use standard flow
     * 1: vop dclk never divided
     * 2: vop dclk always divided
     */
    vop-dclk-mode = <0>;
    status="okay";
};
```

<!-- Source EN PDF p.40, block 327 -->

Drei Schritte ergeben eine Firmware mit fester Frequenz:

<!-- Source EN PDF p.40, block 328 -->

1\. Setzen Sie die lastabhängige Frequenzregelung auf 0.

<!-- Source EN PDF p.40, block 329 -->

2\. Kommentieren Sie die anderen Szenarien aus; behalten Sie nur "SYS_STATUS_NORMAL" und setzen Sie es auf die Zielfrequenz.

<!-- Source EN PDF p.40, block 330 -->

3\. Überschreitet die Zielfrequenz das Tabellenmaximum, ergänzen Sie den passenden Spannungseintrag.

<!-- Source EN PDF p.40, block 331 -->

Bei Kernel 3.0 ändern Sie dvfs_ddr_table in borad-\*\*.c. Beim RK3066-SDK liegt die Boarddatei unter arch/arm/mach-rk30/board-rk30-sdk.c.

<!-- Source EN PDF p.40, block 332 -->

```text
static struct cpufreq_frequency_table dvfs_ddr_table[] = {
    /* */
    /* step 1. Comment out the other scene with leaving "DDR_FREQ_NORMAL" only */
    //{.frequency = 200 * 1000 + DDR_FREQ_SUSPEND, .index = 1050 * 1000},
    //{.frequency = 300 * 1000 + DDR_FREQ_VIDEO, .index = 1050 * 1000},
    /* step 2, Define "DDR_FREQ_NORMAL" to your target frequency,meanwhile pay attention to
whether the voltage match the frequency or not */
    {.frequency = 400 * 1000 + DDR_FREQ_NORMAL, .index = 1125 * 1000},
    {.frequency = CPUFREQ_TABLE_END},
};
```

<!-- Source EN PDF p.40, block 333 -->

Zwei Schritte ergeben eine Firmware mit fester Frequenz:

<!-- Source EN PDF p.40, block 334 -->

1\. Kommentieren Sie alle anderen Szenarien aus und behalten Sie nur "DDR_FREQ_NORMAL".

<!-- Source EN PDF p.40, block 335 -->

2\. Setzen Sie "DDR_FREQ_NORMAL" auf die Zielfrequenz und prüfen Sie, ob die Spannung dazu passt.

<!-- Source EN PDF p.40, block 336 -->

### 1.16 DDR-Bandbreitenauslastung ermitteln

<!-- Source EN PDF p.40, block 337 -->

Kernel 4.4 und spätere Versionen bieten einen Befehl zur Anzeige der gesamten DDR-Bandbreitenauslastung.

<!-- Source EN PDF p.40, block 338 -->

```text
rk3288:/sys/class/devfreq/dmc # cat load
11@396000000Hz
```

<!-- Source EN PDF p.40, block 339 -->

"11" bedeutet eine aktuelle Auslastung von 11%.

<!-- Source EN PDF p.40, block 340 -->

Rockchip stellt außerdem ein spezielles Programm zur Beobachtung der DDR-Bandbreite bereit. Einzelheiten siehe das Kapitel zum DDR-Bandbreitenwerkzeug.

<!-- Source EN PDF p.41, block 341 -->

### 1.17 DDR-Zuverlässigkeit testen

<!-- Source EN PDF p.41, block 342 -->

Siehe das Dokument "DDR-Verification-Process".

<!-- Source EN PDF p.41, block 343 -->

### 1.18 Maximale DDR-Betriebsfrequenz bestimmen

<!-- Source EN PDF p.41, block 344 -->

1\. Ergänzen Sie zunächst die passende Frequenz-/Spannungszuordnung. Siehe die Abschnitte zur Änderung der DDR-Frequenz und der zugehörigen Spannung.

<!-- Source EN PDF p.41, block 345 -->

2\. Prüfen Sie auf Plattformen mit Augendiagrammwerkzeug das Augendiagramm gemäß dem entsprechenden Kapitel.

<!-- Source EN PDF p.41, block 346 -->

3\. Führen Sie Google stressapptest von hohen zu niedrigeren Frequenzen aus. Bei einem Fehler senken Sie die Frequenz und wiederholen den Test. Ohne Fehler verlängern Sie die Testdauer; bleibt der Betrieb stabil, fahren Sie mit dem nächsten Schritt fort.

<!-- Source EN PDF p.41, block 347 -->

Google stressapptest befindet sich unter https://redmine.rock-chips.com/documents/49 → DDR related information_VerX.XX.7z → DDR particle verification_DDR test resource file → static_stressapptest. Zur Verwendung siehe das Kapitel Guide_DDR_Verification_Process.

<!-- Source EN PDF p.41, block 348 -->

4\. Die vorherigen Schritte grenzen die höchste Frequenz grob ein. Führen Sie nun memtester aus. Bei einem Fehler senken Sie die Frequenz und wiederholen den Test. Ohne Fehler verlängern Sie die Testdauer; bleibt der Betrieb stabil, kann dieser höchste Frequenzpunkt bestätigt werden.

<!-- Source EN PDF p.41, block 349 -->

memtester befindet sich unter https://redmine.rock-chips.com/documents/49 → DDR related information_VerX.XX.7z → DDR particle verification_DDR test resource file → static_memtester. Zur Verwendung siehe das Kapitel Guide_DDR_Verification_Process.

<!-- Source EN PDF p.41, block 350 -->

Google stressapptest prüft grob und meldet Fehler oft schnell. memtester arbeitet gründlicher und benötigt für Fehlermeldungen entsprechend länger. Es dient vor allem der Signalprüfung und deckt Bereiche ab, die stressapptest möglicherweise nicht erfasst.

<!-- Source EN PDF p.41, block 351 -->

Diese softwarebasierten Verfahren dienen der schnellen Ermittlung einer Maximalfrequenz. Sie garantieren nicht, dass die tatsächliche DDR-Signalintegrität dort den JEDEC-Anforderungen genügt. Dafür sind Signalmessungen und Belastungstests erforderlich.

<!-- Source EN PDF p.41, block 352 -->

### 1.19 DDR-Self-Refresh erkennen

<!-- Source EN PDF p.41, block 353 -->

Der Zustand lässt sich durch Messen von CKE erkennen. Dafür ist kein Oszilloskop mit besonders hoher Bandbreite erforderlich.

<!-- Source EN PDF p.41, block 354 -->

| CKE-Zustand | Bedeutung |
|---|---|
| Low-Pegel (Dauer >7.8us) | Self-Refresh-Zustand |
| High-Pegel | Normalzustand |

<!-- Source EN PDF p.42, block 355 -->

Wechselt CKE zwischen längeren Low- und High-Phasen, gilt dieselbe Zuordnung: DDR tritt in Self-Refresh ein und kehrt später in den Normalzustand zurück.

<!-- Source EN PDF p.42, block 356 -->

Hinweis: CKE muss länger als 7.8 us Low sein, um Self-Refresh anzuzeigen. Auch Power-Down hat einen Low-Pegel, jedoch kürzer als 7.8 us. Verwechseln Sie diese Zustände nicht.

<!-- Source EN PDF p.42, block 357 -->

### 1.20 Automatischen DDR-Power-Down erkennen

<!-- Source EN PDF p.42, block 358 -->

Der Zustand lässt sich durch Messen von CKE erkennen. Dafür ist kein Oszilloskop mit besonders hoher Bandbreite erforderlich.

<!-- Source EN PDF p.42, block 359 -->

| CKE-Zustand | Bedeutung |
|---|---|
| Low-Pegel (Dauer <7.8us) | Power-Down-Zustand |
| High-Pegel | Normalzustand |

<!-- Source EN PDF p.42, block 360 -->

Im automatischen Power-Down bleibt CKE knapp 7.8us bei DDR3/DDR4 bzw. 3.9us bei LPDDR2/LPDDR3/LPDDR4 Low, wird kurz High und kehrt wieder für diese Zeitspanne auf Low zurück.

<!-- Source EN PDF p.42, block 361 -->

Hinweis: Für automatischen Power-Down muss die Low-Dauer unter 7.8us bei DDR3/DDR4 bzw. unter 3.9us bei LPDDR2/LPDDR3/LPDDR4 liegen.

<!-- Source EN PDF p.42, block 362 -->

### 1.21 Self-Refresh und Power-Down deaktivieren

<!-- Source EN PDF p.42, block 363 -->

Alle DDR-Bausteine besitzen grundlegende Stromsparfunktionen wie Self-Refresh und Power-Down. Diese sind auch softwareseitig aktiviert. Je nach Leerlaufdauer tritt DDR in einen dieser Zustände ein.

<!-- Source EN PDF p.42, block 364 -->

Wenn Stromsparfunktionen nicht benötigt werden, allein die Leistung zählt oder die DDR-Bausteine Probleme mit diesen Zuständen haben, können sie wie folgt deaktiviert werden.

<!-- Source EN PDF p.42, block 365 -->

Setzen Sie sr_idle in der folgenden Abbildung auf 0, um den leerlaufabhängigen Eintritt in Self-Refresh zu deaktivieren.

<!-- Source EN PDF p.42, block 366 -->

![Technische Originalabbildung — PDF S. 42](/docs/rockchip-ddr/assets/en-p42-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| uart id | 2 |  | — | UART-ID; 0xf deaktiviert die UART-Ausgabe |
| uart iomux | 0 |  | — | UART IOMUX |
| uart baudrate | 1500000 |  | bps | Unterstützt 115200 oder 1500000 |
| sr_idle | 93 | 0-1023 | 32clk | DRAM-Leerlauftakte vor Self-Refresh; 0 deaktiviert |
| pd_idle | 13 | 0-127 | 32clk | DRAM-Leerlauftakte vor Power-Down; 0 deaktiviert |

<!-- Source EN PDF p.42, block 367 -->

Setzen Sie pd_idle in der folgenden Abbildung auf 0, um den leerlaufabhängigen Eintritt

<!-- Source EN PDF p.42, block 368 -->

in Power-Down zu deaktivieren.

<!-- Source EN PDF p.43, block 369 -->

![Technische Originalabbildung — PDF S. 43](/docs/rockchip-ddr/assets/en-p43-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| uart id | 2 |  | — | UART-ID; 0xf deaktiviert die UART-Ausgabe |
| uart iomux | 0 |  | — | UART IOMUX |
| uart baudrate | 1500000 |  | bps | Unterstützt 115200 oder 1500000 |
| sr_idle | 93 | 0-1023 | 32clk | DRAM-Leerlauftakte vor Self-Refresh; 0 deaktiviert |
| pd_idle | 13 | 0-127 | 32clk | DRAM-Leerlauftakte vor Power-Down; 0 deaktiviert |

<!-- Source EN PDF p.43, block 370 -->

### 1.22 De-Skew von DQ/DQS/CA/CLK anpassen

<!-- Source EN PDF p.43, block 371 -->

Unterschiedliche DDR-Leiterbahnlängen auf der Leiterplatte können durch Skew-Anpassung ähnlich wie durch Längenabgleich kompensiert werden. Dazu enthält die DDR-PHY seriell geschaltete Verzögerungselemente in den Signalleitungen. Über Skew-Register wird deren Anzahl und damit die Verzögerung jeder Leitung gesteuert.

<!-- Source EN PDF p.43, block 372 -->

#### 1.22.1 De-Skew im Kernel anpassen

<!-- Source EN PDF p.43, block 373 -->

Nur RK322Xh/RK3328 unterstützen die Änderung von De-Skew im Kernel. Dazu wird DTS angepasst.

<!-- Source EN PDF p.43, block 374 -->

Chiptypen: RK322xh, RK3328

<!-- Source EN PDF p.43, block 375 -->

Codeposition:

<!-- Source EN PDF p.43, block 376 -->

```text
arch/arm64/boot/dts/rk322xh-dram-default-timing.dtsi
```

<!-- Source EN PDF p.43, block 377 -->

```text
arch/arm64/boot/dts/rk322xh-dram-2layer-timing.dtsi
```

<!-- Source EN PDF p.43, block 378 -->

Falls eine neue Datei die genannte ersetzt, ändern Sie stattdessen diese neue Datei.

<!-- Source EN PDF p.43, block 379 -->

Vorgehen:

<!-- Source EN PDF p.43, block 380 -->

Wählen Sie anhand des Ergebnisses des bereitgestellten „deskew automatic scanning tool“ den Wert "mid" und tragen Sie ihn in die entsprechende DTS-Definition ein.

<!-- Source EN PDF p.43, block 381 -->

Zur Verwendung siehe "3228H deskew automatic scanning tool instruction.pdf".

<!-- Source EN PDF p.43, block 382 -->

#### 1.22.2 De-Skew im Loader anpassen

<!-- Source EN PDF p.43, block 383 -->

Nur RK3308 unterstützt die De-Skew-Anpassung im Loader.

<!-- Source EN PDF p.43, block 384 -->

Chiptyp: RK3308

<!-- Source EN PDF p.43, block 385 -->

Benötigte Dateien:

<!-- Source EN PDF p.43, block 386 -->

deskew automatic scanning tool, 3308_deskew.exe, RK3308_DDRXPXXXXXX_Template_VXX_de-skew.txt, rk3308_ddr_XXXMHz_uartX_mX_vX.XX.bin

<!-- Source EN PDF p.43, block 387 -->

Vorgehen:

<!-- Source EN PDF p.44, block 388 -->

Wählen Sie anhand des Ergebnisses des „deskew automatic scanning tool“ den Wert "mid" und tragen Sie ihn in die passende Definition in RK3308_DDRXPXXXXXX_Template_VXX_de-skew.txt ein. Übertragen Sie anschließend mit 3308_deskew.exe die De-Skew-Definitionen aus rk3308_ddrxpxxxxxx_template_vxx_de-skew.txt in rk3308_ddr_xxxmhz_uartx_mx_vx.xx.bin.

<!-- Source EN PDF p.44, block 389 -->

Zur Verwendung des Werkzeugs siehe "deskew automatic scanning tool instruction.pdf".

<!-- Source EN PDF p.44, block 390 -->

### 1.23 DDR-Belastungstests unter U-Boot ausführen

<!-- Source EN PDF p.44, block 391 -->

Die verbreiteten DDR-Belastungstests stressapptest und memtester wurden auf U-Boot portiert.

<!-- Source EN PDF p.44, block 392 -->

Haupteinsatzfälle:

<!-- Source EN PDF p.44, block 393 -->

Wenn der Kernel nicht startet, kann ein DDR-Test unter U-Boot Speicherprobleme ausschließen.

<!-- Source EN PDF p.44, block 394 -->

Der Kernel bietet keine geeigneten Bedingungen für stressapptest oder memtester.

<!-- Source EN PDF p.44, block 395 -->

Beispielsweise können unvollständige Kernelmodule Instabilität verursachen und verhindern, dass die Tests lange genug laufen.

<!-- Source EN PDF p.44, block 396 -->

Größeren DDR-Bereich testen

<!-- Source EN PDF p.44, block 397 -->

Im Kernel ist nur der vom System nicht belegte Speicher testbar. U-Boot belegt wesentlich weniger Speicher und erlaubt daher größere Testbereiche.

<!-- Source EN PDF p.44, block 398 -->

Gezielte physische Adressen testen

<!-- Source EN PDF p.44, block 399 -->

#### 1.23.1 stressapptest

<!-- Source EN PDF p.44, block 400 -->

Aktivieren Sie:

<!-- Source EN PDF p.44, block 401 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool

<!-- Source EN PDF p.44, block 402 -->

und zusätzlich:

<!-- Source EN PDF p.44, block 403 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool -> Enable stressapptest for ddr

<!-- Source EN PDF p.44, block 404 -->

Kompilieren Sie U-Boot und programmieren Sie uboot.img.

<!-- Source EN PDF p.44, block 405 -->

Starten Sie das Gerät neu und drücken Sie im seriellen PC-Terminal wiederholt CTRL+C, bis U-Boot in den Kommandozeilenmodus wechselt:

<!-- Source EN PDF p.44, block 406 -->

```text
  pclk_top_root 100000 KHz
  aclk_low_top_root 396000 KHz
Net: No ethernet found.
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.44, block 407 -->

Geben Sie stressapptest -h ein und führen Sie den Test gemäß den Parameterhinweisen aus.

<!-- Source EN PDF p.45, block 408 -->

#### 1.23.2 memtester

<!-- Source EN PDF p.45, block 409 -->

Aktivieren Sie:

<!-- Source EN PDF p.45, block 410 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool

<!-- Source EN PDF p.45, block 411 -->

und zusätzlich:

<!-- Source EN PDF p.45, block 412 -->

make ARCH=arm64 menuconfig ->Command line interface -> DDR Tool -> Enable DDR Tool -> Enable memtester for ddr

<!-- Source EN PDF p.45, block 413 -->

Kompilieren Sie U-Boot und programmieren Sie uboot.img.

<!-- Source EN PDF p.45, block 414 -->

Starten Sie das Gerät neu und drücken Sie im seriellen PC-Terminal wiederholt CTRL+C, bis U-Boot in den Kommandozeilenmodus wechselt:

<!-- Source EN PDF p.45, block 415 -->

```text
  pclk_top_root 100000 KHz
  aclk_low_top_root 396000 KHz
Net: No ethernet found.
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.45, block 416 -->

Geben Sie memtester -h ein und führen Sie den Test gemäß den Parameterhinweisen aus.

<!-- Source EN PDF p.45, block 417 -->

### 1.24 ECC auf RK3568 aktivieren

<!-- Source EN PDF p.45, block 418 -->

ECC steht für Error Correcting Code. DDR-ECC prüft DDR-Daten auf Fehler und korrigiert sie.

<!-- Source EN PDF p.45, block 419 -->

RK3568 unterstützt Sideband-ECC: Neben dem DDR-Datenkanal wird ein zusätzlicher DDR-Baustein ausschließlich für ECC-Daten verwendet.

<!-- Source EN PDF p.45, block 420 -->

Es korrigiert Einbitfehler und erkennt Zweibitfehler, also SEC/DED-ECC (Single Error Correction/Double Error Detection).

<!-- Source EN PDF p.45, block 421 -->

1\. ECC aktivieren: Sobald an DDR_ECC_DQ0-7 ein DDR-Baustein angeschlossen ist, wird ECC automatisch aktiviert.

<!-- Source EN PDF p.45, block 422 -->

2\. Funktion von DDR_ECC_DQ0-7: Die Implementierung verwendet 32 Bit DQ-Daten plus 7 Bit ECC-Daten.

<!-- Source EN PDF p.45, block 423 -->

DDR_ECC_DQ0-7 speichert die aus DQ0–DQ31 berechneten ECC-Daten. Dafür muss dort ein zusätzlicher DDR-Baustein angeschlossen werden.

<!-- Source EN PDF p.45, block 424 -->

3\. Anforderungen an den zusätzlichen Baustein: DRAM-Typ sowie Anzahl von Zeilen, Spalten und Bänken müssen mit den Bausteinen an DQ0–31 übereinstimmen.

<!-- Source EN PDF p.45, block 425 -->

4\. Unterstützte DRAM-Typen: Alle DRAM-Typen unterstützen ECC.

<!-- Source EN PDF p.46, block 426 -->

### 1.25 DDR-ECC-Informationen im Kernel abrufen

<!-- Source EN PDF p.46, block 427 -->

DDR-ECC-Informationen werden über die EDAC-Architektur des Kernels bereitgestellt. Bei unterstützten Plattformen wie RK3568 muss die Hardware-ECC-Funktion aktiviert sein, siehe vorherigen Abschnitt. Aktivieren Sie anschließend das edac-Modul in DTSI. Fehlt dort ein edac-Knoten, unterstützt die Plattform diese Funktion nicht.

<!-- Source EN PDF p.46, block 428 -->

```text
edac: edac {
    ...
    status = "okay";
};
```

<!-- Source EN PDF p.46, block 429 -->

RK EDAC wird an folgender Stelle im System registriert:

<!-- Source EN PDF p.46, block 430 -->

```text
sys/devices/system/edac/mc/mc0
or
sys/bus/edac/devices/mc/mc0/
```

<!-- Source EN PDF p.46, block 431 -->

RK-EDAC-Namen abrufen:

<!-- Source EN PDF p.46, block 432 -->

```text
# cat sys/devices/system/edac/mc/mc0/mc_name
rk_edac_ecc
```

<!-- Source EN PDF p.46, block 433 -->

Anzahl der seit diesem Start aufgelaufenen korrigierbaren Einbitfehler (ce) abrufen:

<!-- Source EN PDF p.46, block 434 -->

```text
# cat sys/devices/system/edac/mc/mc0/ce_count
0
```

<!-- Source EN PDF p.46, block 435 -->

Anzahl der seit diesem Start aufgelaufenen unkorrigierbaren Mehrbitfehler (ue) abrufen:

<!-- Source EN PDF p.46, block 436 -->

```text
# cat sys/devices/system/edac/mc/mc0/ue_count
0
```

<!-- Source EN PDF p.46, block 437 -->

Beim Neustart initialisiert der Kernel die EDAC-Module und Zähler erneut. Zuvor erfasste Fehlerzahlen werden gelöscht; die Zählung beginnt wieder bei null.

<!-- Source EN PDF p.46, block 438 -->

### 1.26 DDR-ECC-Fehler im Kernel injizieren

<!-- Source EN PDF p.46, block 439 -->

Zur ECC-Fehlerinjektion muss der "edac"-Knoten in der plattformspezifischen DTS-Datei aktiviert sein; außerdem muss die Hardware DDR-ECC unterstützen.

<!-- Source EN PDF p.46, block 440 -->

```text
edac: edac {
        ...
        status = "okay";
    };
```

<!-- Source EN PDF p.47, block 441 -->

Nach dem Start wählen Sie den zu injizierenden Fehlertyp über folgenden Knoten:

<!-- Source EN PDF p.47, block 442 -->

```text
echo ce > /sys/module/rockchip_edac/parameters/edac_poison_mode
echo ue > /sys/module/rockchip_edac/parameters/edac_poison_mode
```

<!-- Source EN PDF p.47, block 443 -->

edac_poison_mode unterstützt zwei Werte:

<!-- Source EN PDF p.47, block 444 -->

1\. ce: Injiziert korrigierbare Einbitfehler.

<!-- Source EN PDF p.47, block 445 -->

2\. ue: Injiziert unkorrigierbare Mehrbitfehler.

<!-- Source EN PDF p.47, block 446 -->

Lösen Sie die Fehler über folgenden Knoten aus. Die mit echo geschriebene Zahl bestimmt die Anzahl auszulösender DDR-ECC-Fehler.

<!-- Source EN PDF p.47, block 447 -->

```text
echo 10 > /sys/module/rockchip_edac/parameters/rockchip_edac_trigger
```

<!-- Source EN PDF p.47, block 448 -->

Hinweise:

<!-- Source EN PDF p.47, block 449 -->

1\. Bei folgender Fehlermeldung prüfen Sie, ob EDAC im Kernel aktiviert ist und die Hardware DDR-ECC unterstützt:

<!-- Source EN PDF p.47, block 450 -->

```text
echo 1 > /sys/module/rockchip_edac/parameters/rockchip_edac_trigger
sh: echo: write error: Operation not permitted
```

<!-- Source EN PDF p.47, block 451 -->

2\. Unkorrigierbare Mehrbitfehler ue führen standardmäßig zum Neustart. Bei korrigierbaren Einbitfehlern ce protokolliert der Kernel eine Warnung und erhöht den Zähler in /sys/devices/system/edac/mc/mc0/ce_count.

<!-- Source EN PDF p.47, block 452 -->

Zur ECC-Fehlerinjektion über HAL siehe den Abschnitt Rockchip_Developer_Guide_HAL_DDR_ECC.

<!-- Source EN PDF p.47, block 453 -->

### 1.27 DDR-Herstellerkennung auslesen

<!-- Source EN PDF p.47, block 454 -->

Nur LPDDR-Typen wie LPDDR2, LPDDR3, LPDDR4, LPDDR4X, LPDDR5 und LPDDR5X besitzen Herstellerkennungen. DDR-Typen wie DDR2, DDR3 und DDR4 besitzen keine.

<!-- Source EN PDF p.47, block 455 -->

#### 1.27.1 Über den dmcdbg-Kernelknoten

<!-- Source EN PDF p.47, block 456 -->

Folgende Plattformen unterstützen das Auslesen der DDR-Herstellerkennung über proc/dmcdbg/dmcinfo:

<!-- Source EN PDF p.47, block 457 -->

RK3566

<!-- Source EN PDF p.47, block 458 -->

RK3568

<!-- Source EN PDF p.47, block 459 -->

RK3326

<!-- Source EN PDF p.47, block 460 -->

RK3326S

<!-- Source EN PDF p.47, block 461 -->

Aktivieren Sie zunächst dmcdbg in der jeweiligen Plattform-DTSI. Fehlt der Knoten, wird die Funktion nicht unterstützt. Für RK356X aktivieren Sie ihn beispielsweise in arch/arm64/boot/dts/rockchip/rk3568.dtsi:

<!-- Source EN PDF p.48, block 462 -->

```text
dmcdbg: dmcdbg {
    compatible = "rockchip,rk3568-dmcdbg";
    status = "okay";
};
```

<!-- Source EN PDF p.48, block 463 -->

Kompilieren und aktualisieren Sie die Kernel-Firmware und starten Sie das Gerät. Mit cat proc/dmcdbg/dmcinfo lassen sich die Herstellerkennung und weitere DDR-Informationen auslesen.

<!-- Source EN PDF p.48, block 464 -->

```text
console:/ # cat proc/dmcdbg/dmcinfo
DramType: LPDDR4
Dram ID: MR5=0x1,MR6=0x0,MR7=0x1 /* The MR5 is the manufacturer ID, and MR6 and MR7
are the version IDs reserved for the manufacturer definition */
DramCapacity:
CS Count: 1
Bus Width: 32 bit
Column: 10
Bank: 8
CS0_Row: 16
CS1_Row: 0
DieBusWidth: 16 bit
TotalSize: 2048 MB
devfreq/dmc: Enable
governor: dmc_ondemand
cur_freq: 780000000
NOTE:
more information about dmc can get from /sys/class/devfreq/dmc.
```

<!-- Source EN PDF p.48, block 465 -->

#### 1.27.2 Über die Loader-Ausgabe

<!-- Source EN PDF p.48, block 466 -->

Die Loader-Ausgabe von RK3576/RK3588 enthält die Herstellerkennung.

<!-- Source EN PDF p.48, block 467 -->

```text
DDR ... v1.14
LPDDR5, 2736MHz
channel[0] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
channel[3] BW=16 Col=10 Bk=16 CS0 Row=15 CS1 Row=15 CS=2 Die BW=16 Size=2048MB
Manufacturer ID:0xff /* This is the manufacturer ID */
...
change to F0: 2736MHz
out
```

<!-- Source EN PDF p.48, block 468 -->

Die Loader-Ausgabe von RK3399 enthält die Herstellerkennung.

<!-- Source EN PDF p.49, block 469 -->

```text
DDR Version ...
In
channel 0
...
MR5=0xFF /* This is the manufacturer ID */
...
change freq to 416MHz 0,1
Channel 0: LPDDR4,416MHz
Bus Width=32 Col=10 Bank=8 Row=16 CS=1 Die Bus-Width=16 Size=2048MB
Channel 1: LPDDR4,416MHz
Bus Width=32 Col=10 Bank=8 Row=16 CS=1 Die Bus-Width=16 Size=2048MB
...
OUT
```

<!-- Source EN PDF p.49, block 470 -->

#### 1.27.3 Wichtige Hinweise

<!-- Source EN PDF p.49, block 471 -->

Beachten Sie Folgendes:

<!-- Source EN PDF p.49, block 472 -->

1\. Nur LPDDR-Typen wie LPDDR2, LPDDR3, LPDDR4, LPDDR4X, LPDDR5 und LPDDR5X besitzen Herstellerkennungen. DDR2, DDR3 und DDR4 besitzen keine.

<!-- Source EN PDF p.49, block 473 -->

2\. Die Kennung bezeichnet den Waferhersteller, nicht die Marke des verpackten DDR-Bausteins. Viele DDR-Anbieter stellen selbst keine Wafer her.

<!-- Source EN PDF p.49, block 474 -->

3\. Bei allen LPDDR-Typen lässt sich die auf dem Gehäuse aufgedruckte Modellnummer nicht auslesen. Dies unterscheidet sie von NAND-Flash und eMMC.

<!-- Source EN PDF p.49, block 475 -->

4\. Die Zuordnung der Waferherstellerkennung folgt dem JEDEC-Standard JEP166.

<!-- Source EN PDF p.49, block 476 -->

#### 1.27.4 Herstellerkennungstabellen

<!-- Source EN PDF p.49, block 477 -->

Die folgenden Tabellen entsprechen dem Stand bei Fertigstellung des Quelldokuments.

<!-- Source EN PDF p.49, block 478 -->

Künftige Aktualisierungen sind möglich. Suchen Sie auf https://www.jedec.org nach JEP166, um die aktuelle Tabelle zu finden.

<!-- Source EN PDF p.49, block 479 -->

Herstellerkennungen für LPDDR2 und LPDDR3:

<!-- Source EN PDF p.50, block 480 -->

| MR5-Wert | Herstellername |
|---|---|
| 0x1 | Samsung |
| 0x2 | Qimonda |
| 0x3 | Elpida |
| 0x4 | Etron |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x7 | Mosel |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0xa | Zentel |
| 0xb | Spansion |
| 0xc | SST |
| 0xd | ZMOS |
| 0xe | Intel |
| 0x12 | Being Advanced Memory Corp |
| 0x1a | Xi'an UniIC Semiconductors Co., Ltd |
| 0x1b | ISSI |
| 0x1c | JSC |
| 0xaa | Tezzaron |
| 0xc2 | Macronix |
| 0xf8 | Fidelix |
| 0xfc | eveRAM |
| 0xfd | AP Memory |
| 0xfe | Numonyx |
| 0xff | Micron |

<!-- Source EN PDF p.50, block 481 -->

Herstellerkennungen für LPDDR4:

<!-- Source EN PDF p.51, block 482 -->

| MR5-Wert | Herstellername |
|---|---|
| 0x1 | Samsung |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0x13 | CXMT |
| 0x1a | Xi'an UniIC Semiconductors Co., Ltd |
| 0x1c | JSC |
| 0xf8 | Fidelix |
| 0xf9 | Ultra Memory |
| 0xfd | AP Memory |
| 0xff | Micron |

<!-- Source EN PDF p.51, block 483 -->

Herstellerkennungen für LPDDR5:

<!-- Source EN PDF p.51, block 484 -->

| MR5-Wert | Herstellername |
|---|---|
| 0x1 | Samsung |
| 0x5 | Nanya |
| 0x6 | SK hynix |
| 0x8 | Winbond |
| 0x9 | ESMT |
| 0x13 | CXMT |
| 0xe5 | Dosilicon |
| 0xff | Micron |

<!-- Source EN PDF p.52, block 485 -->

### 1.28 Häufige Fragen zu Signalen

<!-- Source EN PDF p.52, block 486 -->

#### 1.28.1 tINIT3 erfüllt die Protokollanforderung nicht

<!-- Source EN PDF p.52, block 487 -->

Ursache: Während der DDR-Initialisierung setzt die Rockchip-Plattform RESET mehrfach. Wird irrtümlich die erste steigende RESET-Flanke als Ausgangspunkt für tINIT3 verwendet, erscheint die gemessene Zeit protokollwidrig.

<!-- Source EN PDF p.52, block 488 -->

Korrekt ist die letzte steigende RESET-Flanke als Messpunkt für tINIT3, wie unten dargestellt.

<!-- Source EN PDF p.52, block 489 -->

Verwenden Sie nicht M2, sondern M3 als Messpunkt.

<!-- Source EN PDF p.52, block 490 -->

![Technische Originalabbildung — PDF S. 52](/docs/rockchip-ddr/assets/en-p52-figure1.png)

<!-- Source EN PDF p.52, block 491 -->

#### 1.28.2 Hinweise zur Aktivierung von DDR-ODT

<!-- Source EN PDF p.52, block 492 -->

Nach den in der Quelle genannten JEDEC-Anforderungen darf ODT bei LPDDR4/LPDDR4X unterhalb von 800MHz nicht aktiviert werden.

<!-- Source EN PDF p.52, block 493 -->

Nach den in der Quelle genannten JEDEC-Anforderungen darf ODT bei DDR4 unterhalb von 625MHz nicht aktiviert werden.

<!-- Source EN PDF p.53, block 494 -->

### 1.29 Refresh-Rate bei hoher Temperatur

<!-- Source EN PDF p.53, block 495 -->

Oberhalb von 85°C benötigt DDR die doppelte Refresh-Rate.

<!-- Source EN PDF p.53, block 496 -->

Dies ist insbesondere bei Industrie- und Automotive-Produkten zu beachten.

<!-- Source EN PDF p.53, block 497 -->

Rockchip-Plattformen bieten folgende Verfahren zur Verdoppelung der Refresh-Rate:

<!-- Source EN PDF p.53, block 498 -->

LPDDR4, LPDDR4X, LPDDR5 und LPDDR5X besitzen eigene Temperatursensoren und melden die temperaturabhängig erforderliche Refresh-Rate über MR4. Einige Rockchip-Plattformen implementieren Automatic Temperature Derating, kurz derate. Damit wird die Refresh-Rate anhand der MR4-Angaben des DRAM-Bausteins automatisch an die Temperatur angepasst.

<!-- Source EN PDF p.53, block 499 -->

LPDDR3 unterstützt derate aus Hardwaregründen nicht; dort wird die doppelte Refresh-Rate erzwungen.

<!-- Source EN PDF p.53, block 500 -->

DDR3 und DDR4 besitzen weder Temperatursensoren noch die MR4-Meldung der erforderlichen Refresh-Rate. Daher kann derate nicht verwendet werden; die doppelte Refresh-Rate muss erzwungen werden.

<!-- Source EN PDF p.53, block 501 -->

Über ext_temp_ref in der DDR-Binärdatei lässt sich die Refresh-Rate verdoppeln.

<!-- Source EN PDF p.53, block 502 -->

![Technische Originalabbildung — PDF S. 53](/docs/rockchip-ddr/assets/en-p53-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| Parameter | Wert | Gültiger Bereich | Einheit | Beschreibung |
|---|---|---|---|---|
| ext_temp_ref | 0 |  | — | 0: Entscheidung durch Code (1x für normale Chips, 2x für 3568M/3568J); 1: fest 2x; 2: fest 4x; 3: fest 1x Refresh |

<!-- Source EN PDF p.53, block 503 -->

Zur Änderung siehe den Abschnitt zur Bearbeitung der DDR-Binärdatei.

<!-- Source EN PDF p.53, block 504 -->

Hinweis: Bei Rockchip-Industrie-, Automotive- und erweiterten Temperaturvarianten ist die Refresh-Rate bereits angepasst. Eine zusätzliche Verdoppelung mit diesem Werkzeug ist nicht erforderlich.

<!-- Source EN PDF p.53, block 505 -->

Im Werkzeug gelten für festes 2x/4x/1x-Refresh folgende Zuordnungen:

<!-- Source EN PDF p.53, block 506 -->

| ext_temp_ref | DDR2/DDR3/DDR4 | LPDDR3/LPDDR4/LPDDR4x/LPDDR5 |
|---|---|---|
| Festes 1x-Refresh | tREFI=7.8us | tREFI=3.9us |
| Festes 2x-Refresh | tREFI=3.9us | tREFI=1.95us |
| Festes 4x-Refresh | tREFI=1.95us | tREFI=0.975us |

<!-- Source EN PDF p.53, block 507 -->

Normale Plattformen außerhalb der Industrie-, Automotive- und erweiterten Temperaturvarianten verwenden standardmäßig 1x-Refresh, außer bei DRAM mit aktiviertem derate.

<!-- Source EN PDF p.53, block 508 -->

Für die genannten Spezialvarianten gelten folgende Verfahren und DDR-Binärversionen:

<!-- Source EN PDF p.54, block 509 -->

| Plattform | DDR-Typ | Verfahren und erforderliche DDR-Binärversion |
|---|---|---|
| RK3308J/M<br>RK3308K<br>RK3308GK | Alle DDR-Typen | rk3308_ddr_XXXMHz_uartX_mX_v1.26.bin oder neuer<br>Standard: 4x-Refresh, also 0.25x tREFI |
| RK3568J/M | LPDDR3<br>DDR3<br>DDR4 | rk3568_ddr_XXXXMHz_v1.16.bin oder neuer<br>Standard: 2x-Refresh, also 0.5x tREFI |
| RK3568J/M | LPDDR4<br>LPDDR4X | rk3568_ddr_XXXXMHz_v1.18.bin oder neuer<br>derate standardmäßig aktiviert |
| RK3588J/M | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3588_ddr_XXXXMHz_v1.13.bin oder neuer<br>derate standardmäßig aktiviert |
| RV1126K | Alle DDR-Typen | rv1126_ddr_XXXXMHz_v1.03.bin oder neuer<br>Standard: 2x-Refresh, also 0.5x tREFI |

<!-- Source EN PDF p.54, block 510 -->

Folgende Plattformen aktivieren derate standardmäßig in ihrer DDR-Binärdatei:

<!-- Source EN PDF p.54, block 511 -->

| Plattform | DDR-Typ | Verfahren und erforderliche DDR-Binärversion |
|---|---|---|
| RK3528 | LPDDR4<br>LPDDR4X | rk3528_ddr_XXXXMHz_v1.07.bin<br>oder rk3528_ddr_XXXXMHz_2L_PCB_v1.07.bin<br>oder rk3528_ddr_XXXXMHz_4BIT_PCB_v1.07.bin`<br>und neuere Versionen<br>derate standardmäßig aktiviert |
| RK3562 | LPDDR4<br>LPDDR4X | rk3562_ddr_XXXXMHz_v1.05.bin<br>oder rk3562_ddr_XXXXMHz_ultra_v1.05.bin<br>und neuere Versionen<br>derate standardmäßig aktiviert |
| RK3568 | LPDDR4<br>LPDDR4X | rk3568_ddr_XXXXMHz_v1.18.bin oder neuer<br>derate standardmäßig aktiviert |
| RK3576 | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3576_ddr_XXXXMHz_v1.00.bin oder neuer<br>derate standardmäßig aktiviert |
| RK3588 | LPDDR4<br>LPDDR4X<br>LPDDR5<br>LPDDR5X | rk3588_ddr_XXXXMHz_v1.13.bin oder neuer<br>derate standardmäßig aktiviert |

<!-- Source EN PDF p.55, block 512 -->

## 2. Kapitel 2: DDR-Fehlersuche

<!-- Source EN PDF p.55, block 513 -->

### 2.1 Feststellen, ob ein DDR-Problem vorliegt

<!-- Source EN PDF p.55, block 514 -->

1\. UART-Protokoll prüfen

<!-- Source EN PDF p.55, block 515 -->

1\. Meldet der DDR-Initialisierungsabschnitt des Loaders einen Fehler, liegt ein DDR-Problem vor.

<!-- Source EN PDF p.55, block 516 -->

2\. Prüfen Sie im Loader-Protokoll DDR-Kapazität, Zeilen, Spalten, Bänke, DRAM-Typ und Busbreite. Falsche Angaben können DDR-Probleme verursachen.

<!-- Source EN PDF p.55, block 517 -->

3\. Bei einem System-Panic wiederholen Sie den Versuch und vergleichen die Panic-Adressen. Sind sie gleich, ist DDR normalerweise nicht die Ursache. Unterschiedliche Adressen können auf DDR oder Versorgungsintegrität hinweisen.

<!-- Source EN PDF p.55, block 518 -->

2\. Prüfen Sie die Bildausgabe. Bei fehlerhafter Darstellung ist ein DDR-Problem wahrscheinlich.

<!-- Source EN PDF p.55, block 519 -->

3\. Eingrenzungstests durchführen:

<!-- Source EN PDF p.55, block 520 -->

1\. Senken Sie ARM-/GPU-Frequenzen und erhöhen Sie bei fester Frequenz die Spannung angemessen. Hilft dies, liegt wahrscheinlich kein DDR-, sondern ein Versorgungsproblem vor.

<!-- Source EN PDF p.55, block 521 -->

2\. Deaktivieren Sie die DDR-Frequenzskalierung. Hilft dies, ist sie wahrscheinlich die Ursache.

<!-- Source EN PDF p.55, block 522 -->

3\. Senken Sie DDR auf eine sichere Frequenz, beispielsweise 324M. Hilft dies, liegt mit hoher Wahrscheinlichkeit ein Problem der DDR-Signalqualität vor.

<!-- Source EN PDF p.55, block 523 -->

### 2.2 Hauptursachen von DDR-Problemen

<!-- Source EN PDF p.55, block 524 -->

1\. Stromversorgungsprobleme:

<!-- Source EN PDF p.55, block 525 -->

1\. Zu wenige Kondensatoren im Layout, zu großer Abstand zum Chip oder ungeeignete Verteilung.

<!-- Source EN PDF p.55, block 526 -->

2\. Die Versorgungsrückkopplung wird nicht wie gefordert vom Lastende zur PMU bzw. zum DC/DC-Wandler zurückgeführt.

<!-- Source EN PDF p.55, block 527 -->

3\. Prüfen Sie die Kupferflächen auf Einhaltung der RK-Layoutregeln.

<!-- Source EN PDF p.55, block 528 -->

4\. Die Massefläche direkt unter einem LQFP-Chip muss verlötet sein, um eine gute Masseverbindung sicherzustellen. Andernfalls leiden interne Versorgungsqualität und Wärmeabfuhr.

<!-- Source EN PDF p.55, block 529 -->

2\. Signalintegritätsprobleme:

<!-- Source EN PDF p.55, block 530 -->

1\. Unterschiedliche Leiterbahnlängen. Einige RK-Plattformen verfügen nicht über sämtliche Lese-/Schreibtrainings; Längenunterschiede verringern dort direkt die Setup-/Hold-Reserve.

<!-- Source EN PDF p.55, block 531 -->

2\. Zu geringe Leiterbahnabstände verursachen starkes Übersprechen.

<!-- Source EN PDF p.55, block 532 -->

3\. Ungleich lange Äste einer T-Topologie

<!-- Source EN PDF p.56, block 533 -->

verschlechtern die Signalflanken und können nichtmonotone Verläufe erzeugen.

<!-- Source EN PDF p.56, block 534 -->

4\. Unterbrochene Rückstrompfade der Referenzlage. Zu große Freistellungen beim Kupferaufbau können durch Vias die Referenzlage unterbrechen und die Signalintegrität beeinträchtigen.

<!-- Source EN PDF p.56, block 535 -->

3\. Fehlerhafte DRAM-Bausteine:

<!-- Source EN PDF p.56, block 536 -->

1\. Manche nicht eindeutig spezifizierten Handelsbausteine wurden nicht geprüft oder stammen sogar aus Ausschuss; ihre Ausbeute ist nicht gewährleistet.

<!-- Source EN PDF p.56, block 537 -->

2\. Bei solchen Bausteinen kann die Treiberimpedanz ungeeignet bzw. die Treiberstärke zu gering sein.

<!-- Source EN PDF p.56, block 538 -->

3\. Hynix-4Gb-C-Die-DDR3, beispielsweise H5TQ4G63CFR, benötigt bei frühem Kernel-3.10-Code einen Patch.

<!-- Source EN PDF p.56, block 539 -->

### 2.3 Verfahren zur Behebung von DDR-Problemen

<!-- Source EN PDF p.56, block 540 -->

Suchen Sie zunächst nach Mustern: Tritt der Stillstand bei einer bestimmten Frequenz auf? Hängt ein Absturz nach dem Aufwachen von der Schlafdauer ab? Prüfen Sie systematisch feste und unterschiedliche Frequenzen, Spannungsänderungen sowie Treiberstärken, um die Ursache schrittweise einzugrenzen.

<!-- Source EN PDF p.56, block 541 -->

1\. Fehlermeldungen während der DDR-Initialisierung

<!-- Source EN PDF p.56, block 542 -->

1\. Meldungen wie "rd addr 0x... = 0x...", "16bit error!!!" oder "unknow device" weisen meist auf Lötprobleme hin. Das Rockchip-DDR-Testwerkzeug kann diese gezielt prüfen.

<!-- Source EN PDF p.56, block 543 -->

2\. Besondere Kapazitäten, die keine Zweierpotenz sind, etwa 768MB, 1.5GB oder 3GB, werden von manchen Codeversionen nicht unterstützt. Aktualisieren Sie den Loader. Bleiben Fehler bestehen, sollte die DDR-Entwicklung sie analysieren.

<!-- Source EN PDF p.56, block 544 -->

3\. Die meisten DDR-Loaderfehler sind Lötprobleme. Verwenden Sie die Lötprüfoption des DDR-Testwerkzeugs und wählen Sie die zur Kapazität passenden Tests.

<!-- Source EN PDF p.56, block 545 -->

2\. Prüfen Sie im Loader-Initialisierungsprotokoll Kapazität, Zeilen, Spalten, Bänke, Busbreite und DRAM-Typ.

<!-- Source EN PDF p.56, block 546 -->

Im folgenden Beispiel enthält die erste Zeile die DDR-Codeversion, die dritte die Frequenz und die vierte den Typ. Die fünfte nennt von links nach rechts DRAM-Busbreite, Spalten, Bänke, Zeilen, Chip-Select-Anzahl, Die-Busbreite und Gesamtkapazität. "OUT" in Zeile sieben zeigt den erfolgreichen Abschluss der Initialisierung; danach folgt die Ausgabe von usbplug oder miniloader. Eine erkannte Die-Busbreite oberhalb der tatsächlichen ist laut Quelle unproblematisch, eine kleinere führt zum Absturz.

<!-- Source EN PDF p.56, block 547 -->

![Technische Originalabbildung — PDF S. 56](/docs/rockchip-ddr/assets/en-p56-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

```text
DDR Version V1.06 20171026
In
300MHz
DDR3
Bus Width=32 Col=10 Bank=8 Row=15 CS=2 Die Bus-Width=16 Size=2048MB
mach:14
OUT
Boot1 Release Time: 2017-06-12, version: 2.37
```

<!-- Source EN PDF p.56, block 548 -->

3\. Prüfen Sie die Bildausgabe.

<!-- Source EN PDF p.56, block 549 -->

Bei einem Systemabsturz stoppt die CPU, während VOP weiterhin wiederholt Daten aus DDR liest

<!-- Source EN PDF p.57, block 550 -->

und anzeigt. Deshalb kann die Bildausgabe einen ersten Hinweis auf den DDR-Zustand liefern.

<!-- Source EN PDF p.57, block 551 -->

1\. Normale Bildausgabe bedeutet, dass DDR weiterhin zugänglich ist. Sie schließt DDR als Ursache des Absturzes jedoch nicht aus.

<!-- Source EN PDF p.57, block 552 -->

2\. Fehlerhafte Bildausgabe:

<!-- Source EN PDF p.57, block 553 -->

Das folgende Beispiel kann durch einen Absturz während des DDR-Frequenzwechsels entstehen, wodurch DDR unzugänglich wird. Versuchen Sie eine feste Frequenz. Auch Versorgungsprobleme können die DDR-Controllerlogik stören.

<!-- Source EN PDF p.57, block 554 -->

![Technische Originalabbildung — PDF S. 57](/docs/rockchip-ddr/assets/en-p57-figure1.png)

<!-- Source EN PDF p.57, block 555 -->

Im folgenden Beispiel führen PCB-Layoutfehler zu Problemen der Versorgungs- und Signalintegrität, wodurch die DDR3-DLL ihre Verriegelung verliert. Die Quelle nennt als Debugversuch eine Erhöhung von VCC_DDR auf 1.6V oder DLL-Bypass; dies ist keine allgemeine Spannungsempfehlung.

<!-- Source EN PDF p.58, block 556 -->

![Technische Originalabbildung — PDF S. 58](/docs/rockchip-ddr/assets/en-p58-figure1.png)

<!-- Source EN PDF p.58, block 557 -->

4\. Stromversorgungsprobleme prüfen

<!-- Source EN PDF p.58, block 558 -->

1\. Fixieren Sie CPU/GPU auf eine niedrigere Frequenz und erhöhen Sie arm/logic-Spannungen. Eine Verbesserung deutet auf ein Versorgungsproblem hin.

<!-- Source EN PDF p.58, block 559 -->

2\. Prüfen Sie das Layout auf Versorgungsprobleme.

<!-- Source EN PDF p.58, block 560 -->

3\. Messen Sie die Versorgungswelligkeit.

<!-- Source EN PDF p.58, block 561 -->

5\. Signalintegrität prüfen

<!-- Source EN PDF p.58, block 562 -->

1\. Senken Sie die DDR-Frequenz. Eine Verbesserung deutet auf ein Signalintegritätsproblem hin.

<!-- Source EN PDF p.58, block 563 -->

2\. Prüfen Sie Layout und Gerberdateien auf sinnvolle Leiterbahnführung und durchgehende Referenzlagen.

<!-- Source EN PDF p.58, block 564 -->

3\. Erhöhen oder verringern Sie Treiberstärke/ODT angemessen und prüfen Sie die Wirkung.

<!-- Source EN PDF p.58, block 565 -->

4\. Ändern Sie den RZQ-Widerstand und prüfen Sie die Wirkung. Die Quelle beschreibt einzelne 220-Ball-LPDDR3-Bausteine, bei denen RZQ verkleinert oder entfernt werden musste, um die Treiberstärke zu erhöhen.

<!-- Source EN PDF p.58, block 566 -->

6\. Nicht eindeutig spezifizierte Handelsbausteine

<!-- Source EN PDF p.58, block 567 -->

Sind Versorgungs- und Signalintegrität unauffällig, kommen DRAM-Speicherzellen als Ursache infrage. Folgende Versuche können helfen:

<!-- Source EN PDF p.58, block 568 -->

1\. Deaktivieren Sie pd_idle und sr_idle und prüfen Sie die Wirkung.

<!-- Source EN PDF p.58, block 569 -->

2\. Verwenden Sie bei DDR3 DRAM-DLL-Bypass.

<!-- Source EN PDF p.58, block 570 -->

3\. Manche Speicherzellenfehler lassen sich mit DDR-Testwerkzeugen erkennen. Diese sind jedoch nur Hilfsmittel: Ein bestandener Test beweist weder Fehlerfreiheit des DRAM noch Boardstabilität.

<!-- Source EN PDF p.59, block 571 -->

## 3. Kapitel 3: DDR-Verifikationsablauf

<!-- Source EN PDF p.59, block 572 -->

HINWEISE

<!-- Source EN PDF p.59, block 573 -->

1\. Für Android mit Linux 4.19, 5.10, 6.1 oder später siehe den Android-Verifikationsablauf. Für Systeme wie Buildroot, Yocto und Debian siehe den Linux-Verifikationsablauf.

<!-- Source EN PDF p.59, block 574 -->

2\. Für Kernel Linux 3.10 siehe den entsprechenden Linux-3.10-Verifikationsablauf.

<!-- Source EN PDF p.59, block 575 -->

3\. RV1108 und RK3308 verwenden abweichende Abläufe. Siehe die jeweiligen Abschnitte in diesem Dokument.

<!-- Source EN PDF p.59, block 576 -->

4\. Die im Dokument beschriebenen Testdateien werden für die Verifikation benötigt und laut Quelle zusammen mit dem Originaldokument bereitgestellt.

<!-- Source EN PDF p.59, block 577 -->

### 3.1 DDR-Verifikation unter Android

<!-- Source EN PDF p.59, block 578 -->

#### 3.1.1 Android-Testfirmware kompilieren

<!-- Source EN PDF p.59, block 579 -->

Aktivieren Sie zunächst die DDR-Frequenzskalierung. Setzen Sie in der boardspezifischen DTS-Datei die Knoten dfi und dmc auf status = "okay".

<!-- Source EN PDF p.59, block 580 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    status = "okay";
    ...
};
```

<!-- Source EN PDF p.59, block 581 -->

Dies ist nur eine kurze Einführung zur Testfirmware. Einzelheiten siehe den Abschnitt zum Aktivieren/Deaktivieren der DDR-Frequenzskalierung in Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.59, block 582 -->

#### 3.1.2 Android-Testumgebung einrichten

<!-- Source EN PDF p.59, block 583 -->

##### 3.1.2.1 Firmware programmieren

<!-- Source EN PDF p.59, block 584 -->

Ermitteln Sie vor dem Test:

<!-- Source EN PDF p.59, block 585 -->

1\. 32-Bit- oder 64-Bit-Betriebssystem

<!-- Source EN PDF p.60, block 586 -->

2\. Gesamte DDR-Kapazität des Testgeräts, beispielsweise 512MB, 1GB oder 2GB

<!-- Source EN PDF p.60, block 587 -->

3\. Maximale DDR-Frequenz für den Festfrequenztest, beispielsweise 533MHz, 1560MHz oder 2112MHz

<!-- Source EN PDF p.60, block 588 -->

##### 3.1.2.2 Umgebung automatisch einrichten

<!-- Source EN PDF p.60, block 589 -->

1\. Öffnen Sie das Verzeichnis "android_ddr_test_files" der Testdateien und starten Sie push_files.bat per Doppelklick. Wählen Sie gemäß Skripthinweis und Firmwaretyp 1 oder 2 und warten Sie auf den automatischen Abschluss.

<!-- Source EN PDF p.60, block 590 -->

Hinweis: Prüfen Sie danach anhand der Protokollausgabe, ob alle Schritte normal ausgeführt wurden und keine Fehlermeldungen vorliegen.

<!-- Source EN PDF p.60, block 591 -->

2\. Bei fehlerfreier automatischer Einrichtung können Sie den Abschnitt zur manuellen Einrichtung überspringen.

<!-- Source EN PDF p.60, block 592 -->

##### 3.1.2.3 Umgebung manuell einrichten

<!-- Source EN PDF p.60, block 593 -->

Wenn die automatische Einrichtung scheitert, richten Sie die Umgebung manuell ein. Wählen und installieren Sie die folgenden Dateien aus "android_ddr_test_files".

<!-- Source EN PDF p.60, block 594 -->

1\. Installieren Sie fishingjoy.

<!-- Source EN PDF p.60, block 595 -->

Hinweis: fishingjoy ist eine Drittanbieter-APK und muss separat beschafft werden. Alternativ können Sie eine andere während des Tests automatisch laufende APK oder eine Videoschleife verwenden.

<!-- Source EN PDF p.60, block 596 -->

```text
<adb_tool> adb.exe install fishingjoy1.apk
```

<!-- Source EN PDF p.60, block 597 -->

2\. Übertragen Sie stressapptest.

<!-- Source EN PDF p.60, block 598 -->

Wählen Sie aus "static_stressapptest" die zur 32- oder 64-Bit-Linux-Firmware des Testgeräts passende Version.

<!-- Source EN PDF p.60, block 599 -->

Beispiel:

<!-- Source EN PDF p.60, block 600 -->

Für Linux 32 Bit übertragen Sie stressapptest_32bit.

<!-- Source EN PDF p.60, block 601 -->

```text
<adb_tool> adb.exe push stressapptest_32bit /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.60, block 602 -->

Für Linux 64 Bit übertragen Sie stressapptest_64bit.

<!-- Source EN PDF p.60, block 603 -->

```text
<adb_tool> adb.exe push stressapptest_64bit /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.60, block 604 -->

3\. Übertragen Sie memtester.

<!-- Source EN PDF p.60, block 605 -->

Wählen Sie aus "static_memtester" die zur 32- oder 64-Bit-Linux-Firmware des Testgeräts passende Version.

<!-- Source EN PDF p.61, block 606 -->

Beispiel:

<!-- Source EN PDF p.61, block 607 -->

Für Linux 32 Bit übertragen Sie memtester_32bit.

<!-- Source EN PDF p.61, block 608 -->

```text
<adb_tool> adb.exe push memtester_32bit /data/memtester
<adb_tool> adb.exe shell chmod 0777 /data/memtester
```

<!-- Source EN PDF p.61, block 609 -->

Für Linux 64 Bit übertragen Sie memtester_64bit.

<!-- Source EN PDF p.61, block 610 -->

```text
<adb_tool> adb.exe push memtester_64bit /data/memtester
<adb_tool> adb.exe shell chmod 0777 /data/memtester
```

<!-- Source EN PDF p.61, block 611 -->

4\. Übertragen Sie ddr_freq_scan.sh.

<!-- Source EN PDF p.61, block 612 -->

```text
<adb_tool> adb.exe push ddr_freq_scan.sh /data/ddr_freq_scan.sh
<adb_tool> adb.exe shell chmod 0777 /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.61, block 613 -->

5\. Schreiben Sie gepufferte Dateisystemdaten aus dem Arbeitsspeicher auf den Datenträger.

<!-- Source EN PDF p.61, block 614 -->

```text
<adb_tool> adb.exe shell sync
```

<!-- Source EN PDF p.61, block 615 -->

##### 3.1.2.4 Testumgebung über USB-Stick und serielle Schnittstelle einrichten

<!-- Source EN PDF p.61, block 616 -->

Wenn ADB nicht verbunden werden kann, kopieren Sie die Testdateien über einen USB-Stick auf das Board und richten die Umgebung über die serielle Schnittstelle ein.

<!-- Source EN PDF p.61, block 617 -->

1\. Vorbereitung

<!-- Source EN PDF p.61, block 618 -->

Verhindern Sie nach dem Einschalten den Suspend durch echo 1 > /sys/power/wake_lock. Alternativ wählen Sie Setting → Display → Sleep → Never sleep.

<!-- Source EN PDF p.61, block 619 -->

Verbinden Sie den USB-Stick mit dem Computer und kopieren Sie "android_ddr_test_files" darauf.

<!-- Source EN PDF p.61, block 620 -->

Wechseln Sie zum Benutzer root, um die erforderlichen Rechte zu erhalten.

<!-- Source EN PDF p.61, block 621 -->

```text
<rk3399:/ $> su
```

<!-- Source EN PDF p.61, block 622 -->

Verbinden Sie den USB-Stick mit dem Testboard und kopieren Sie die Dateien aus "android_ddr_test_files", "static_memtester" und "static_stressapptest" nach /data. Der Stick wird üblicherweise unter /mnt/media_rw/\*\*\* eingehängt. Der konkrete Knotenname variiert; verwenden Sie TAB zur Vervollständigung.

<!-- Source EN PDF p.61, block 623 -->

Beispiel:

<!-- Source EN PDF p.61, block 624 -->

Bei Einhängepunkt /mnt/media_rw/B4FE-5315 führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.61, block 625 -->

```text
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/android_ddr_test_files /data/
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/static_memtester /data/
<rk3399:/ #> cp -rf /mnt/media_rw/B4FE-5315/static_stressapptest /data/
```

<!-- Source EN PDF p.62, block 626 -->

2\. Testumgebung automatisch einrichten

<!-- Source EN PDF p.62, block 627 -->

Für Linux 32 Bit wählen Sie test_files_install_32bit.sh.

<!-- Source EN PDF p.62, block 628 -->

```text
<rk3399:/ #> chmod 0777 /data/android_ddr_test_files/test_files_install_32bit.sh
<rk3399:/ #> /data/android_ddr_test_files/test_files_install_32bit.sh
```

<!-- Source EN PDF p.62, block 629 -->

Für Linux 64 Bit wählen Sie test_files_install_64bit.sh.

<!-- Source EN PDF p.62, block 630 -->

```text
<rk3399:/ #> chmod 0777 /data/android_ddr_test_files/test_files_install_64bit.sh
<rk3399:/ #> /data/android_ddr_test_files/test_files_install_64bit.sh
```

<!-- Source EN PDF p.62, block 631 -->

Prüfen Sie anhand der Protokolle jeden Schritt auf erfolgreiche Ausführung. Bei fehlerfreier automatischer Einrichtung können Sie den Abschnitt zur manuellen Einrichtung überspringen.

<!-- Source EN PDF p.62, block 632 -->

3\. Testumgebung manuell einrichten

<!-- Source EN PDF p.62, block 633 -->

Wenn die automatische Einrichtung scheitert, führen Sie sie manuell aus.

<!-- Source EN PDF p.62, block 634 -->

Kopieren Sie für Linux 32 Bit die entsprechenden Testdateien.

<!-- Source EN PDF p.62, block 635 -->

```text
<rk3399:/ #> cp /data/static_stressapptest/stressapptest_32bit /data/stressapptest
<rk3399:/ #> cp /data/static_memtester/memtester_32bit /data/memtester
<rk3399:/ #> cp /data/android_ddr_test_files/ddr_freq_scan.sh /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 636 -->

Kopieren Sie für Linux 64 Bit die entsprechenden Testdateien.

<!-- Source EN PDF p.62, block 637 -->

```text
<rk3399:/ #> cp /data/static_stressapptest/stressapptest_64bit /data/stressapptest
<rk3399:/ #> cp /data/static_memtester/memtester_64bit /data/memtester
<rk3399:/ #> cp /data/android_ddr_test_files/ddr_freq_scan.sh /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 638 -->

Ändern Sie die Dateiberechtigungen.

<!-- Source EN PDF p.62, block 639 -->

```text
<rk3399:/ #> chmod 777 /data/memtester /data/stressapptest /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.62, block 640 -->

Installieren Sie fishingjoy.

<!-- Source EN PDF p.62, block 641 -->

Hinweis: fishingjoy ist eine Drittanbieter-APK und muss separat beschafft werden. Alternativ können Sie eine andere während des Tests automatisch laufende APK oder eine Videoschleife verwenden.

<!-- Source EN PDF p.62, block 642 -->

```text
<rk3399:/ #> pm install /data/fishingjoy1.apk
```

<!-- Source EN PDF p.62, block 643 -->

Schreiben Sie gepufferte Dateisystemdaten aus dem Arbeitsspeicher auf den Datenträger.

<!-- Source EN PDF p.62, block 644 -->

```text
<rk3399:/ #> sync
```

<!-- Source EN PDF p.63, block 645 -->

#### 3.1.3 DDR-Kapazität unter Android überprüfen

<!-- Source EN PDF p.63, block 646 -->

Prüfen Sie mit `<rkxxxx:/ #>` cat /proc/meminfo, ob MemTotal zur tatsächlichen Kapazität des Testgeräts passt.

<!-- Source EN PDF p.63, block 647 -->

Protokollbeispiel:

<!-- Source EN PDF p.63, block 648 -->

```text
rkxxxx:/ # cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.63, block 649 -->

512MB entsprechen näherungsweise 533504kB.

<!-- Source EN PDF p.63, block 650 -->

1GB entspricht näherungsweise 1048576kB.

<!-- Source EN PDF p.63, block 651 -->

1.5GB entsprechen näherungsweise 1582080kB.

<!-- Source EN PDF p.63, block 652 -->

2GB entsprechen näherungsweise 2097152kB.

<!-- Source EN PDF p.63, block 653 -->

3GB entsprechen näherungsweise 3145728kB.

<!-- Source EN PDF p.63, block 654 -->

4GB entsprechen näherungsweise 4194304kB.

<!-- Source EN PDF p.63, block 655 -->

Kleine Abweichungen sind aufgrund unterschiedlicher Speicherverwaltung normal.

<!-- Source EN PDF p.63, block 656 -->

#### 3.1.4 Android-Test bei fester DDR-Frequenz

<!-- Source EN PDF p.63, block 657 -->

1\. Starten Sie fishingjoy.

<!-- Source EN PDF p.63, block 658 -->

2\. Wechseln Sie zu root.

<!-- Source EN PDF p.63, block 659 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.63, block 660 -->

3\. Fixieren Sie die DDR-Frequenz.

<!-- Source EN PDF p.63, block 661 -->

Verwenden Sie die höchste vom Testgerät unterstützte DDR-Frequenz.

<!-- Source EN PDF p.63, block 662 -->

Beispiel:

<!-- Source EN PDF p.63, block 663 -->

Für 2112MHz:

<!-- Source EN PDF p.63, block 664 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 2112000000
```

<!-- Source EN PDF p.63, block 665 -->

Für 1056MHz:

<!-- Source EN PDF p.63, block 666 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 1056000000
```

<!-- Source EN PDF p.63, block 667 -->

Für 600MHz:

<!-- Source EN PDF p.63, block 668 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 600000000
```

<!-- Source EN PDF p.63, block 669 -->

4\. Prüfen Sie anhand des Protokolls die korrekte Frequenz.

<!-- Source EN PDF p.64, block 670 -->

Protokollbeispiel:

<!-- Source EN PDF p.64, block 671 -->

```text
<rkxxxx:/ #> /data/ddr_freq_scan.sh 1560000000
already change to 1560000000 done.
change frequency to available max frequency done.
```

<!-- Source EN PDF p.64, block 672 -->

5\. Ermitteln Sie den für den DDR-Test verfügbaren freien Speicher.

<!-- Source EN PDF p.64, block 673 -->

Prüfen Sie die Speichernutzung mit free -m. Üblicherweise werden 90% des für neue Anwendungen verfügbaren Speichers, also des Werts "available", getestet.

<!-- Source EN PDF p.64, block 674 -->

Protokollbeispiel:

<!-- Source EN PDF p.64, block 675 -->

```text
<rkxxxx:/ #> free -m
               total used free shared buff/cache available
Mem: 3909 433 3294 9 181 3427
Swap: 0 0 0
```

<!-- Source EN PDF p.64, block 676 -->

Beträgt "available" 3427MB, werden 3427MB \* 0.9 = 3084MB für den DDR-Test gewählt.

> Quellenvergleich: Der chinesische Absatz nennt 3427MB verfügbar, rechnet jedoch mit 3294MB*0.9=3084MB. Die englische Quelle verwendet 3427MB*0.9. Die Abweichung wird dokumentiert, nicht stillschweigend vereinheitlicht.

<!-- Source EN PDF p.64, block 677 -->

6\. Führen Sie stressapptest länger als 12 Stunden aus.

<!-- Source EN PDF p.64, block 678 -->

stressapptest ausführen:

<!-- Source EN PDF p.64, block 679 -->

Wichtige stressapptest-Parameter:

<!-- Source EN PDF p.64, block 680 -->

-M mbytes: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.64, block 681 -->

-s seconds: Testdauer in Sekunden. Für 12 Stunden verwenden Sie 43200 Sekunden.

<!-- Source EN PDF p.64, block 682 -->

Beispiel:

<!-- Source EN PDF p.64, block 683 -->

Bei 3084MB verfügbarem Testspeicher und einer Dauer von 12 Stunden (43200 Sekunden) führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.64, block 684 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 3084
```

<!-- Source EN PDF p.64, block 685 -->

Testergebnis prüfen

<!-- Source EN PDF p.64, block 686 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb, fishingjoy und das PASS-/FAIL-Ergebnis von stressapptest. Das Programm gibt alle 10 Sekunden die verbleibende Testzeit aus. Abschließend lautet die Erfolgsmeldung "Status: PASS - please verify no corrected errors", die Fehlermeldung "Status: FAIL - test discovered HW problems".

<!-- Source EN PDF p.64, block 687 -->

7\. Führen Sie memtester länger als 12 Stunden aus.

<!-- Source EN PDF p.64, block 688 -->

memtester ausführen:

<!-- Source EN PDF p.64, block 689 -->

Wichtiger memtester-Parameter:

<!-- Source EN PDF p.64, block 690 -->

`<mem>`m: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.64, block 691 -->

Beispiel:

<!-- Source EN PDF p.65, block 692 -->

Bei 3084MB verfügbarem Testspeicher führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.65, block 693 -->

```text
<rkxxxx:/ #> /data/memtester 3084m
```

<!-- Source EN PDF p.65, block 694 -->

Testergebnis prüfen.

<!-- Source EN PDF p.65, block 695 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb, fishingjoy und mögliche memtester-Fehler. Die mit den Testdateien bereitgestellte Version wurde so geändert, dass sie bei einem Fehler automatisch stoppt. Läuft sie länger als 12 Stunden weiter, wurde während dieser Zeit kein Fehler erkannt.

<!-- Source EN PDF p.65, block 696 -->

Ohne Fehler gibt memtester fortlaufend folgende Meldungen aus:

<!-- Source EN PDF p.65, block 697 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.65, block 698 -->

Bei einem Fehler stoppt memtester automatisch und beendet den Test. Die Ausgabe lautet dann:

<!-- Source EN PDF p.65, block 699 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.65, block 700 -->

#### 3.1.5 DDR-Frequenzwechseltest unter Android

<!-- Source EN PDF p.65, block 701 -->

1\. Starten Sie fishingjoy.

<!-- Source EN PDF p.65, block 702 -->

2\. Wechseln Sie zu root.

<!-- Source EN PDF p.65, block 703 -->

```text
<rkxxxx:/$> su
```

<!-- Source EN PDF p.65, block 704 -->

3\. Starten Sie memtester im Hintergrund.

<!-- Source EN PDF p.65, block 705 -->

Wichtiger memtester-Parameter:

<!-- Source EN PDF p.65, block 706 -->

`<mem>`m: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.66, block 707 -->

Beispiel:

<!-- Source EN PDF p.66, block 708 -->

Zur Ermittlung des verfügbaren Testspeichers siehe den vorherigen Abschnitt zum Festfrequenztest.

<!-- Source EN PDF p.66, block 709 -->

Bei 3084MB verfügbarem Testspeicher führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.66, block 710 -->

```text
<rkxxxx:/ #> /data/memtester 3084m
```

<!-- Source EN PDF p.66, block 711 -->

4\. Führen Sie die Testskripte aus.

<!-- Source EN PDF p.66, block 712 -->

```text
<rkxxxx9:/ #> /data/ddr_freq_scan.sh
```

<!-- Source EN PDF p.66, block 713 -->

Hinweis: Erzwungene Frequenzwechsel können beispielsweise wegen zeitweise unzureichender Bandbreite Bildschirmflackern verursachen. Dies ist während dieses Tests normal.

<!-- Source EN PDF p.66, block 714 -->

5\. Prüfen Sie das Ergebnis nach mehr als 12 Stunden Testdauer.

<!-- Source EN PDF p.66, block 715 -->

Prüfen Sie den normalen Betrieb von fishingjoy und des Geräts.

<!-- Source EN PDF p.66, block 716 -->

Prüfen Sie, ob das Frequenzwechselprogramm läuft und seine Protokolle normal ausgibt.

<!-- Source EN PDF p.66, block 717 -->

Protokollbeispiel:

<!-- Source EN PDF p.66, block 718 -->

```text
DDR freq will change to 600000000 8786
already change to 600000000 done
DDR freq will change to 800000000 8787
already change to 800000000 done
DDR freq will change to 200000000 8788
already change to 200000000 done
```

<!-- Source EN PDF p.66, block 719 -->

Prüfen Sie, ob memtester weiterhin normal läuft.

<!-- Source EN PDF p.66, block 720 -->

Mit `<rkxxxx:/ #>` ps \| grep memtester prüfen Sie, ob der Prozess noch aktiv ist.

<!-- Source EN PDF p.66, block 721 -->

Beispiel:

<!-- Source EN PDF p.66, block 722 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.66, block 723 -->

#### 3.1.6 Android-Neustarttest

<!-- Source EN PDF p.66, block 724 -->

Neustarttest über Calculator

<!-- Source EN PDF p.66, block 725 -->

==Verhindern Sie den Schlafmodus: Wählen Sie Settings → Security → Set screen lock → None, damit das Gerät direkt zur Hauptansicht wechselt. Wählen Sie außerdem Settings → Display → Sleep → Never sleep.==

<!-- Source EN PDF p.66, block 726 -->

Öffnen Sie Calculator, geben Sie "83991906=" ein und wählen Sie "RebootTest". Testen Sie länger als 12 Stunden.

<!-- Source EN PDF p.67, block 727 -->

#### 3.1.7 Android-Suspend-Test

<!-- Source EN PDF p.67, block 728 -->

Für RK3399 mit LPDDR4 ist dieser Test erforderlich; für andere DDR-Typen und Plattformen ist er optional.

<!-- Source EN PDF p.67, block 729 -->

Suspend-Test über Calculator

<!-- Source EN PDF p.67, block 730 -->

Trennen Sie das für ADB angeschlossene USB-Kabel. Öffnen Sie Calculator, geben Sie "83991906=" ein und wählen Sie "SleepTest". Testen Sie länger als 12 Stunden.

<!-- Source EN PDF p.67, block 731 -->

### 3.2 DDR-Verifikation unter Linux

<!-- Source EN PDF p.67, block 732 -->

#### 3.2.1 Linux-Testfirmware kompilieren

<!-- Source EN PDF p.67, block 733 -->

Aktivieren Sie zunächst die DDR-Frequenzskalierung. Setzen Sie in der boardspezifischen DTS-Datei die Knoten dfi und dmc auf status = "okay".

<!-- Source EN PDF p.67, block 734 -->

```text
&dfi {
    status = "okay";
};
&dmc {
    status = "okay";
    ...
};
```

<!-- Source EN PDF p.67, block 735 -->

Dies ist nur eine kurze Einführung zur Testfirmware. Einzelheiten siehe den Abschnitt zum Aktivieren/Deaktivieren der DDR-Frequenzskalierung in Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.67, block 736 -->

#### 3.2.2 Linux-Testumgebung einrichten

<!-- Source EN PDF p.67, block 737 -->

##### 3.2.2.1 Firmware programmieren

<!-- Source EN PDF p.67, block 738 -->

Ermitteln Sie vor dem Test:

<!-- Source EN PDF p.67, block 739 -->

1\. 32-Bit- oder 64-Bit-Betriebssystem

<!-- Source EN PDF p.67, block 740 -->

2\. Gesamte DDR-Kapazität des Testgeräts, beispielsweise 512MB, 1GB oder 2GB

<!-- Source EN PDF p.67, block 741 -->

3\. Maximale DDR-Frequenz für den Festfrequenztest, beispielsweise 533MHz, 1560MHz oder 2112MHz

<!-- Source EN PDF p.67, block 742 -->

##### 3.2.2.2 Umgebung einrichten

<!-- Source EN PDF p.67, block 743 -->

Die SDK-Firmware enthält "ROCKCHIPS TEST TOOLS" im Verzeichnis /rockchip-test.

<!-- Source EN PDF p.68, block 744 -->

Fehlen diese Werkzeuge bei einem portierten Drittanbieterbetriebssystem, also insbesondere /rockchip-test, kopieren Sie die folgenden Dateien aus den DDR-Testressourcen manuell auf das Gerät. Einige Skripte müssen gegebenenfalls portiert und angepasst werden.

<!-- Source EN PDF p.68, block 745 -->

```text
1. linux_ddr_test_files/ddr_freq_scaling.sh
```

<!-- Source EN PDF p.68, block 746 -->

```text
2. linux_ddr_test_files/test_stress_glmark2.sh
```

<!-- Source EN PDF p.68, block 747 -->

```text
3. linux_ddr_test_files/auto_reboot.sh
```

<!-- Source EN PDF p.68, block 748 -->

```text
4. linux_ddr_test_files/suspend_resume.sh
```

<!-- Source EN PDF p.68, block 749 -->

5\. Für Linux 64 Bit wählen Sie static_stressapptest/stressapptest_64bit und static_stressapptest/memtester_64bit. Für Linux 32 Bit wählen Sie static_stressapptest/stressapptest_32bit und static_stressapptest/memtester_32bit.

<!-- Source EN PDF p.68, block 750 -->

#### 3.2.3 DDR-Kapazität unter Linux überprüfen

<!-- Source EN PDF p.68, block 751 -->

Prüfen Sie mit root@rkxxxx:/# cat /proc/meminfo, ob MemTotal zur tatsächlichen Kapazität passt.

<!-- Source EN PDF p.68, block 752 -->

Protokollbeispiel:

<!-- Source EN PDF p.68, block 753 -->

```text
root@rkxxxx:/# cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.68, block 754 -->

512MB entsprechen näherungsweise 533504kB.

<!-- Source EN PDF p.68, block 755 -->

1GB entspricht näherungsweise 1048576kB.

<!-- Source EN PDF p.68, block 756 -->

1.5GB entsprechen näherungsweise 1582080kB.

<!-- Source EN PDF p.68, block 757 -->

2GB entsprechen näherungsweise 2097152kB.

<!-- Source EN PDF p.68, block 758 -->

3GB entsprechen näherungsweise 3145728kB.

<!-- Source EN PDF p.68, block 759 -->

4GB entsprechen näherungsweise 4194304kB.

<!-- Source EN PDF p.68, block 760 -->

Kleine Abweichungen sind aufgrund unterschiedlicher Speicherverwaltung normal.

<!-- Source EN PDF p.68, block 761 -->

#### 3.2.4 Linux-Test bei fester DDR-Frequenz

<!-- Source EN PDF p.68, block 762 -->

1\. Starten Sie glmark2 oder eine andere dauerhaft laufende Anwendung, die GPU oder NPU belastet.

<!-- Source EN PDF p.68, block 763 -->

```text
root@rkxxxx:/# /rockchip-test/gpu/test_stress_glmark2.sh > /dev/null &
```

<!-- Source EN PDF p.68, block 764 -->

2\. Fixieren Sie die DDR-Frequenz.

<!-- Source EN PDF p.68, block 765 -->

Verwenden Sie die höchste vom Testgerät unterstützte DDR-Frequenz.

<!-- Source EN PDF p.68, block 766 -->

Beispiel:

<!-- Source EN PDF p.68, block 767 -->

Für 1332MHz:

<!-- Source EN PDF p.69, block 768 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh 1332000000
```

<!-- Source EN PDF p.69, block 769 -->

Für 1056MHz:

<!-- Source EN PDF p.69, block 770 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh 1056000000
```

<!-- Source EN PDF p.69, block 771 -->

3\. Prüfen Sie die korrekte Frequenz.

<!-- Source EN PDF p.69, block 772 -->

Protokollbeispiel:

<!-- Source EN PDF p.69, block 773 -->

```text
root@rkxxxx:/# cat /sys/class/devfreq/dmc/cur_freq
1332000000
```

<!-- Source EN PDF p.69, block 774 -->

4\. Ermitteln Sie den für den DDR-Test verfügbaren freien Speicher.

<!-- Source EN PDF p.69, block 775 -->

Prüfen Sie die Speichernutzung mit free -m. Üblicherweise werden 90% des für neue Anwendungen verfügbaren Speichers, also des Werts "available", getestet.

<!-- Source EN PDF p.69, block 776 -->

Protokollbeispiel:

<!-- Source EN PDF p.69, block 777 -->

```text
root@rkxxxx:/# free -m
               total used free shared buff/cache available
Mem: 3909 433 3294 9 181 3427
Swap: 0 0 0
```

<!-- Source EN PDF p.69, block 778 -->

Beträgt "available" 3427MB, werden 3427MB \* 0.9 = 3084MB für den DDR-Test gewählt.

> Quellenvergleich: Der chinesische Absatz nennt 3427MB verfügbar, rechnet jedoch mit 3294MB*0.9=3084MB. Die englische Quelle verwendet 3427MB*0.9. Die Abweichung wird dokumentiert, nicht stillschweigend vereinheitlicht.

<!-- Source EN PDF p.69, block 779 -->

5\. Führen Sie stressapptest länger als 12 Stunden aus.

<!-- Source EN PDF p.69, block 780 -->

stressapptest ausführen:

<!-- Source EN PDF p.69, block 781 -->

Wichtige stressapptest-Parameter:

<!-- Source EN PDF p.69, block 782 -->

-M mbytes: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.69, block 783 -->

-s seconds: Testdauer in Sekunden. Für 12 Stunden verwenden Sie 43200 Sekunden.

<!-- Source EN PDF p.69, block 784 -->

Beispiel:

<!-- Source EN PDF p.69, block 785 -->

Bei 3084MB verfügbarem Testspeicher und einer Dauer von 12 Stunden (43200 Sekunden) führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.69, block 786 -->

```text
root@rkxxxx:/# stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 3084
```

<!-- Source EN PDF p.69, block 787 -->

Testergebnis prüfen

<!-- Source EN PDF p.69, block 788 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb, glmark2 und das PASS-/FAIL-Ergebnis von stressapptest. Das Programm gibt alle 10 Sekunden die verbleibende Testzeit aus. Abschließend lautet die Erfolgsmeldung "Status: PASS - please verify no corrected errors", die Fehlermeldung "Status: FAIL - test discovered HW problems".

<!-- Source EN PDF p.70, block 789 -->

6\. Führen Sie memtester länger als 12 Stunden aus.

<!-- Source EN PDF p.70, block 790 -->

memtester ausführen:

<!-- Source EN PDF p.70, block 791 -->

Wichtiger memtester-Parameter:

<!-- Source EN PDF p.70, block 792 -->

`<mem>`m: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.70, block 793 -->

Beispiel:

<!-- Source EN PDF p.70, block 794 -->

Bei 3084MB verfügbarem Testspeicher führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.70, block 795 -->

```text
root@rkxxxx:/# memtester 3084m
```

<!-- Source EN PDF p.70, block 796 -->

Testergebnis prüfen.

<!-- Source EN PDF p.70, block 797 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb, glmark2 und mögliche memtester-Fehler. Die mit den Testdateien bereitgestellte Version wurde so geändert, dass sie bei einem Fehler automatisch stoppt. Läuft sie länger als 12 Stunden weiter, wurde während dieser Zeit kein Fehler erkannt.

<!-- Source EN PDF p.70, block 798 -->

Ohne Fehler gibt memtester fortlaufend folgende Meldungen aus:

<!-- Source EN PDF p.70, block 799 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.70, block 800 -->

Bei einem Fehler stoppt memtester automatisch und beendet den Test. Die Ausgabe lautet dann:

<!-- Source EN PDF p.70, block 801 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.71, block 802 -->

#### 3.2.5 DDR-Frequenzwechseltest unter Linux

<!-- Source EN PDF p.71, block 803 -->

1\. Starten Sie glmark2 oder eine andere dauerhaft laufende Anwendung, die GPU oder NPU belastet.

<!-- Source EN PDF p.71, block 804 -->

```text
root@rkxxxx:/# /rockchip-test/gpu/test_stress_glmark2.sh > /dev/null &
```

<!-- Source EN PDF p.71, block 805 -->

2\. Starten Sie memtester im Hintergrund.

<!-- Source EN PDF p.71, block 806 -->

Wichtiger memtester-Parameter:

<!-- Source EN PDF p.71, block 807 -->

`<mem>`m: Größe des für den Test zuzuweisenden Speichers in MB.

<!-- Source EN PDF p.71, block 808 -->

Beispiel:

<!-- Source EN PDF p.71, block 809 -->

Zur Ermittlung des verfügbaren Testspeichers siehe den vorherigen Abschnitt zum Festfrequenztest.

<!-- Source EN PDF p.71, block 810 -->

Bei 3084MB verfügbarem Testspeicher führen Sie folgenden Befehl aus:

<!-- Source EN PDF p.71, block 811 -->

```text
root@rkxxxx:/# memtester 3084m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.71, block 812 -->

3\. Führen Sie die Testskripte aus.

<!-- Source EN PDF p.71, block 813 -->

```text
root@rkxxxx:/# /rockchip-test/ddr/ddr_freq_scaling.sh
```

<!-- Source EN PDF p.71, block 814 -->

Hinweis: Erzwungene Frequenzwechsel können beispielsweise wegen zeitweise unzureichender Bandbreite Bildschirmflackern verursachen. Dies ist während dieses Tests normal.

<!-- Source EN PDF p.71, block 815 -->

4\. Prüfen Sie das Ergebnis nach mehr als 12 Stunden Testdauer.

<!-- Source EN PDF p.71, block 816 -->

Prüfen Sie den normalen Betrieb von glmark2 und des Geräts.

<!-- Source EN PDF p.71, block 817 -->

Prüfen Sie, ob das Frequenzwechselprogramm läuft und seine Protokolle normal ausgibt.

<!-- Source EN PDF p.71, block 818 -->

Protokollbeispiel:

<!-- Source EN PDF p.71, block 819 -->

```text
cnt: 2315, ddr freq: success change to 528000000 Hz
cnt: 2316, ddr freq: success change to 528000000 Hz
cnt: 2317, ddr freq: success change to 1332000000 Hz
```

<!-- Source EN PDF p.71, block 820 -->

Prüfen Sie, ob memtester weiterhin normal läuft.

<!-- Source EN PDF p.71, block 821 -->

Mit root@rkxxxx:/# ps \| grep memtester prüfen Sie, ob der Prozess noch aktiv ist.

<!-- Source EN PDF p.71, block 822 -->

Beispiel:

<!-- Source EN PDF p.71, block 823 -->

```text
root@rkxxxx:/# ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.72, block 824 -->

#### 3.2.6 Linux-Neustarttest

<!-- Source EN PDF p.72, block 825 -->

1\. Führen Sie die Testskripte aus.

<!-- Source EN PDF p.72, block 826 -->

```text
root@rkxxxx:/# /rockchip-test/auto_reboot/auto_reboot.sh
```

<!-- Source EN PDF p.72, block 827 -->

2\. Testen Sie länger als 12 Stunden und prüfen Sie den normalen Gerätebetrieb. Mit folgendem Befehl lässt sich der Test beenden.

<!-- Source EN PDF p.72, block 828 -->

```text
root@rkxxxx:/# echo off > /userdata/rockchip-test/reboot_cnt
```

<!-- Source EN PDF p.72, block 829 -->

#### 3.2.7 Linux-Suspend-Test

<!-- Source EN PDF p.72, block 830 -->

1\. Führen Sie die Testskripte aus.

<!-- Source EN PDF p.72, block 831 -->

```text
root@rkxxxx:/# /rockchip-test/suspend_resume/suspend_resume.sh
```

<!-- Source EN PDF p.72, block 832 -->

2\. Testen Sie länger als 12 Stunden und prüfen Sie den normalen Gerätebetrieb.

<!-- Source EN PDF p.72, block 833 -->

### 3.3 DDR-Verifikation mit Linux 3.10

<!-- Source EN PDF p.72, block 834 -->

#### 3.3.1 Linux-3.10-Testfirmware kompilieren

<!-- Source EN PDF p.72, block 835 -->

Öffnen Sie menuconfig des Kernels, wechseln Sie zu System Type und aktivieren Sie DDR Test sowie pm_tests.

<!-- Source EN PDF p.72, block 836 -->

```text
menuconfig
System Type --->
  [*] /sys/pm_tests/ support
  [*] DDR Test
```

<!-- Source EN PDF p.72, block 837 -->

Fehlt die Option [] /sys/pm_tests/ support in menuconfig, kompilieren Sie eine Firmware mit fester oder skalierter DDR-Frequenz gemäß den entsprechenden Abschnitten in Rockchip_Developer_Guide_DDR_EN.

<!-- Source EN PDF p.72, block 838 -->

#### 3.3.2 Linux-3.10-Testumgebung einrichten

<!-- Source EN PDF p.72, block 839 -->

##### 3.3.2.1 Firmware programmieren

<!-- Source EN PDF p.72, block 840 -->

Ermitteln Sie vor dem Test:

<!-- Source EN PDF p.72, block 841 -->

1\. Android-Version der Testfirmware, beispielsweise android4.4, android5.0, android6.0 oder android7.1

<!-- Source EN PDF p.73, block 842 -->

2\. 32-Bit- oder 64-Bit-Betriebssystem

<!-- Source EN PDF p.73, block 843 -->

3\. Gesamte DDR-Kapazität, beispielsweise 512MB, 1GB oder 2GB

<!-- Source EN PDF p.73, block 844 -->

4\. Maximale DDR-Frequenz für den Festfrequenztest, beispielsweise 456MHz oder 533MHz

<!-- Source EN PDF p.73, block 845 -->

5\. Frequenzbereich für den Wechseltest, beispielsweise 200MHz–456MHz oder 200MHz–533MHz

<!-- Source EN PDF p.73, block 846 -->

##### 3.3.2.2 Testumgebung automatisch einrichten

<!-- Source EN PDF p.73, block 847 -->

Öffnen Sie "linux3.10_ddr_test_files", starten Sie push_files.bat per Doppelklick und wählen Sie gemäß Skripthinweis und Firmwaretyp 1 oder 2. Warten Sie auf die automatische Einrichtung. Ohne Fehlermeldung können Sie die manuelle Einrichtung überspringen.

<!-- Source EN PDF p.73, block 848 -->

##### 3.3.2.3 Testumgebung manuell einrichten

<!-- Source EN PDF p.73, block 849 -->

Wenn die automatische Einrichtung scheitert, wählen und installieren Sie die folgenden Dateien aus "linux3.10_ddr_test_files" manuell.

<!-- Source EN PDF p.73, block 850 -->

1\. Installieren Sie fishingjoy.

<!-- Source EN PDF p.73, block 851 -->

```text
<adb_tool> adb.exe install fishingjoy1.apk
```

<!-- Source EN PDF p.73, block 852 -->

2\. Übertragen Sie Google stressapptest.

<!-- Source EN PDF p.73, block 853 -->

Wählen Sie die zur Firmwareversion passende stressapptest-Variante.

<!-- Source EN PDF p.73, block 854 -->

```text
<adb_tool> adb.exe root
<adb_tool> adb.exe remount
<adb_tool> adb.exe push libstlport.so /system/lib/libstlport.so
<adb_tool> adb.exe shell chmod 644 /system/lib/libstlport.so
```

<!-- Source EN PDF p.73, block 855 -->

Für android4.4 übertragen Sie stressapptest_android4.4.

<!-- Source EN PDF p.73, block 856 -->

```text
<adb_tool> adb.exe push stressapptest_android4.4 /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.73, block 857 -->

Für andere Android-Versionen übertragen Sie stressapptest.

<!-- Source EN PDF p.73, block 858 -->

```text
<adb_tool> adb.exe push stressapptest /data/stressapptest
<adb_tool> adb.exe shell chmod 0777 /data/stressapptest
```

<!-- Source EN PDF p.73, block 859 -->

3\. Übertragen Sie memtester.

<!-- Source EN PDF p.73, block 860 -->

Wählen Sie die zur Firmwareversion passende memtester-Variante.

<!-- Source EN PDF p.73, block 861 -->

Beispiel:

<!-- Source EN PDF p.73, block 862 -->

Für Linux 32 Bit übertragen Sie memtester_32bit.

<!-- Source EN PDF p.74, block 863 -->

```text
<adb_tool> adb.exe push memtester_32bit /data/memtester
<adb_tool> adb.exe shell chmod 644 /data/memtester
```

<!-- Source EN PDF p.74, block 864 -->

Für Linux 64 Bit übertragen Sie memtester_64bit.

<!-- Source EN PDF p.74, block 865 -->

```text
<adb_tool> adb.exe push memtester_64bit /data/memtester
<adb_tool> adb.exe shell chmod 644 /data/memtester
```

<!-- Source EN PDF p.74, block 866 -->

4\. Synchronisieren Sie die Dateisystempuffer.

<!-- Source EN PDF p.74, block 867 -->

```text
<adb_tool> adb.exe shell sync
```

<!-- Source EN PDF p.74, block 868 -->

#### 3.3.3 DDR-Kapazität mit Linux 3.10 überprüfen

<!-- Source EN PDF p.74, block 869 -->

Prüfen Sie mit `<rkxxxx:/ $>` cat /proc/meminfo, ob MemTotal zur tatsächlichen Kapazität passt.

<!-- Source EN PDF p.74, block 870 -->

Protokollbeispiel:

<!-- Source EN PDF p.74, block 871 -->

```text
<rkxxxx:/ $> cat /proc/meminfo
MemTotal: 2038904 kB
```

<!-- Source EN PDF p.74, block 872 -->

512MB entsprechen näherungsweise 533504kB.

<!-- Source EN PDF p.74, block 873 -->

1GB entspricht näherungsweise 1048576kB.

<!-- Source EN PDF p.74, block 874 -->

1.5GB entsprechen näherungsweise 1582080kB.

<!-- Source EN PDF p.74, block 875 -->

2GB entsprechen näherungsweise 2097152kB.

<!-- Source EN PDF p.74, block 876 -->

3GB entsprechen näherungsweise 3145728kB.

<!-- Source EN PDF p.74, block 877 -->

4GB entsprechen näherungsweise 4194304kB.

<!-- Source EN PDF p.74, block 878 -->

Kleine Abweichungen sind aufgrund unterschiedlicher Speicherverwaltung normal.

<!-- Source EN PDF p.74, block 879 -->

#### 3.3.4 Festfrequenztest mit Linux 3.10

<!-- Source EN PDF p.74, block 880 -->

1\. Starten Sie fishingjoy.

<!-- Source EN PDF p.74, block 881 -->

2\. Geben Sie su in der seriellen Konsole ein.

<!-- Source EN PDF p.74, block 882 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.74, block 883 -->

3\. Fixieren Sie die DDR-Frequenz.

<!-- Source EN PDF p.74, block 884 -->

Verwenden Sie die höchste vom Testgerät unterstützte DDR-Frequenz.

<!-- Source EN PDF p.74, block 885 -->

Beispiel:

<!-- Source EN PDF p.74, block 886 -->

Bei maximaler DDR-Frequenz von 533MHz:

<!-- Source EN PDF p.75, block 887 -->

```text
<rkxxxx:/ #> echo set clk_ddr 533000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.75, block 888 -->

4\. Führen Sie Google stressapptest länger als 12 Stunden aus.

<!-- Source EN PDF p.75, block 889 -->

Bei 512MB Gesamtkapazität weisen Sie stressapptest 64MB zu.

<!-- Source EN PDF p.75, block 890 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 64
```

<!-- Source EN PDF p.75, block 891 -->

Bei 1GB Gesamtkapazität weisen Sie stressapptest 128MB zu.

<!-- Source EN PDF p.75, block 892 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 128
```

<!-- Source EN PDF p.75, block 893 -->

Bei 2GB Gesamtkapazität weisen Sie stressapptest 256MB zu.

<!-- Source EN PDF p.75, block 894 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 256
```

<!-- Source EN PDF p.75, block 895 -->

Bei laut Quelle 4MB Gesamtkapazität weisen Sie stressapptest 512MB zu.

<!-- Source EN PDF p.75, block 896 -->

```text
<rkxxxx:/ #> /data/stressapptest -s 43200 -i 4 -C 4 -W --stop_on_errors -M 512
```

<!-- Source EN PDF p.75, block 897 -->

5\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.75, block 898 -->

Prüfen Sie nach dem Test Gerätebetrieb, fishingjoy und das PASS-/FAIL-Ergebnis von stressapptest. Alle 10 Sekunden wird die verbleibende Testzeit ausgegeben. Abschließend erscheint Status: PASS bei Erfolg oder Status: FAIL bei Fehlern.

<!-- Source EN PDF p.75, block 899 -->

6\. Führen Sie memtester länger als 12 Stunden aus.

<!-- Source EN PDF p.75, block 900 -->

Bei 512MB Gesamtkapazität weisen Sie memtester 64MB zu.

<!-- Source EN PDF p.75, block 901 -->

```text
<rkxxxx:/ #> /data/memtester 64m
```

<!-- Source EN PDF p.75, block 902 -->

Bei 1GB Gesamtkapazität weisen Sie memtester 128MB zu.

<!-- Source EN PDF p.75, block 903 -->

```text
<rkxxxx:/ #> /data/memtester 128m
```

<!-- Source EN PDF p.75, block 904 -->

Bei 2GB Gesamtkapazität weisen Sie memtester 256MB zu.

<!-- Source EN PDF p.75, block 905 -->

```text
<rkxxxx:/ #> /data/memtester 256m
```

<!-- Source EN PDF p.75, block 906 -->

Bei 4GB Gesamtkapazität weisen Sie memtester 512MB zu.

<!-- Source EN PDF p.75, block 907 -->

```text
<rkxxxx:/ #> /data/memtester 512m
```

<!-- Source EN PDF p.75, block 908 -->

7\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.76, block 909 -->

Prüfen Sie nach dem Test Gerätebetrieb, fishingjoy und mögliche memtester-Fehler. Die bereitgestellte Version stoppt automatisch beim ersten erkannten Fehler. Läuft sie länger als 12 Stunden weiter, wurde während dieser Zeit kein Fehler erkannt.

<!-- Source EN PDF p.76, block 910 -->

Ohne Fehler gibt memtester fortlaufend folgende Meldungen aus:

<!-- Source EN PDF p.76, block 911 -->

```text
Loop 10:
    Stuck Address : ok
    Random Value : ok
    Compare XOR : ok
    Compare SUB : ok
    Compare MUL : ok
    Compare DIV : ok
    Compare OR : ok
    Compare AND : ok
    Sequential Increment: ok
    Solid Bits : ok
    Block Sequential : ok
    Checkerboard : ok
    Bit Spread : ok
    Bit Flip : ok
    Walking Ones : ok
    Walking Zeroes : ok
```

<!-- Source EN PDF p.76, block 912 -->

Bei einem Fehler stoppt memtester automatisch und beendet den Test. Die Ausgabe lautet dann:

<!-- Source EN PDF p.76, block 913 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.76, block 914 -->

#### 3.3.5 Frequenzwechseltest mit Linux 3.10

<!-- Source EN PDF p.76, block 915 -->

Starten Sie das Gerät nach einem zuvor ausgeführten Festfrequenztest neu. Andernfalls kann der folgende Frequenzwechselbefehl nicht ausgeführt werden.

<!-- Source EN PDF p.76, block 916 -->

1\. Starten Sie fishingjoy.

<!-- Source EN PDF p.76, block 917 -->

2\. Geben Sie su in der seriellen Konsole ein.

<!-- Source EN PDF p.76, block 918 -->

```text
<rkxxxx:/ $> su
```

<!-- Source EN PDF p.76, block 919 -->

3\. Starten Sie memtester im Hintergrund.

<!-- Source EN PDF p.76, block 920 -->

Bei 512MB Gesamtkapazität weisen Sie memtester 64MB zu.

<!-- Source EN PDF p.76, block 921 -->

```text
<rkxxxx:/ #> /data/memtester 64m > /data/_log.txt &
```

<!-- Source EN PDF p.76, block 922 -->

Bei 1GB Gesamtkapazität weisen Sie memtester 128MB zu.

<!-- Source EN PDF p.77, block 923 -->

```text
<rkxxxx:/ #> /data/memtester 128m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 924 -->

Bei 2GB Gesamtkapazität weisen Sie memtester 256MB zu.

<!-- Source EN PDF p.77, block 925 -->

```text
<rkxxxx:/ #> /data/memtester 256m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 926 -->

Bei 4GB Gesamtkapazität weisen Sie memtester 512MB zu.

<!-- Source EN PDF p.77, block 927 -->

```text
<rkxxxx:/ #> /data/memtester 512m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.77, block 928 -->

4\. Führen Sie den Frequenzwechselbefehl aus.

<!-- Source EN PDF p.77, block 929 -->

Wählen Sie den vom Testgerät unterstützten DDR-Frequenzbereich.

<!-- Source EN PDF p.77, block 930 -->

Beispiel:

<!-- Source EN PDF p.77, block 931 -->

Beispiel für 200MHz bis 533MHz:

<!-- Source EN PDF p.77, block 932 -->

```text
<rkxxxx:/ #> echo 'a:200M-533M-1000000T' > proc/driver/ddr_ts
```

<!-- Source EN PDF p.77, block 933 -->

5\. Prüfen Sie das Ergebnis nach mehr als 12 Stunden Testdauer.

<!-- Source EN PDF p.77, block 934 -->

Prüfen Sie den normalen Betrieb von fishingjoy und des Geräts.

<!-- Source EN PDF p.77, block 935 -->

Prüfen Sie, ob das Frequenzwechselprogramm läuft und seine Protokolle normal ausgibt.

<!-- Source EN PDF p.77, block 936 -->

Prüfen Sie den normalen memtester-Betrieb. Mit `<rkxxxx:/ #>` ps \| grep memtester stellen Sie fest, ob der Prozess noch aktiv ist.

<!-- Source EN PDF p.77, block 937 -->

Beispiel:

<!-- Source EN PDF p.77, block 938 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.77, block 939 -->

#### 3.3.6 Neustarttest mit Linux 3.10

<!-- Source EN PDF p.77, block 940 -->

Öffnen Sie Calculator, geben Sie "83991906=" ein und wählen Sie "RebootTest". Testen Sie länger als 12 Stunden.

<!-- Source EN PDF p.77, block 941 -->

### 3.4 DDR-Verifikation auf RV1108

<!-- Source EN PDF p.77, block 942 -->

#### 3.4.1 RV1108-Testfirmware kompilieren

<!-- Source EN PDF p.77, block 943 -->

Öffnen Sie menuconfig des Kernels, wechseln Sie zu System Type und aktivieren Sie DDR Test sowie pm_tests.

<!-- Source EN PDF p.78, block 944 -->

```text
menuconfig
System Type --->
  [*] /sys/pm_tests/ support
  [*] DDR Test
```

<!-- Source EN PDF p.78, block 945 -->

Fehlt die Option [] /sys/pm_tests/ support in menuconfig, kompilieren Sie eine Firmware mit fester oder skalierter DDR-Frequenz gemäß den entsprechenden Abschnitten in Rockchip_Developer_Guide_DDR.

<!-- Source EN PDF p.78, block 946 -->

#### 3.4.2 RV1108-Testumgebung einrichten

<!-- Source EN PDF p.78, block 947 -->

Kopieren Sie stressapptest und memtester_32bit aus "rv1108_ddr_test_files" in das Stammverzeichnis der SD-Karte und stecken Sie diese in das Testboard.

<!-- Source EN PDF p.78, block 948 -->

#### 3.4.3 DDR-Kapazität auf RV1108 überprüfen

<!-- Source EN PDF p.78, block 949 -->

Prüfen Sie mit `<rv1108:/ #>` cat /proc/meminfo, ob MemTotal zur tatsächlichen Kapazität passt.

<!-- Source EN PDF p.78, block 950 -->

Protokollbeispiel:

<!-- Source EN PDF p.78, block 951 -->

```text
<rv1108:/ #> cat /proc/meminfo
MemTotal: 133376 kB
```

<!-- Source EN PDF p.78, block 952 -->

64MB entsprechen näherungsweise 66688kB.

<!-- Source EN PDF p.78, block 953 -->

128MB entsprechen näherungsweise 133376kB.

<!-- Source EN PDF p.78, block 954 -->

256MB entsprechen näherungsweise 266752kB.

<!-- Source EN PDF p.78, block 955 -->

512MB entsprechen näherungsweise 533504kB.

<!-- Source EN PDF p.78, block 956 -->

Kleine Abweichungen sind aufgrund unterschiedlicher Speicherverwaltung normal.

<!-- Source EN PDF p.78, block 957 -->

#### 3.4.4 Festfrequenztest auf RV1108

<!-- Source EN PDF p.78, block 958 -->

1\. Fixieren Sie die DDR-Frequenz.

<!-- Source EN PDF p.78, block 959 -->

Verwenden Sie die höchste vom Testgerät unterstützte DDR-Frequenz.

<!-- Source EN PDF p.78, block 960 -->

Beispiel:

<!-- Source EN PDF p.78, block 961 -->

Bei maximal unterstützter DDR-Frequenz von 800MHz:

<!-- Source EN PDF p.78, block 962 -->

```text
<rv1108:/ #> echo set clk_ddr 800000000 > /sys/pm_tests/clk_rate
```

<!-- Source EN PDF p.78, block 963 -->

2\. Führen Sie Google stressapptest länger als 12 Stunden aus.

<!-- Source EN PDF p.78, block 964 -->

Bei 128MB Gesamtkapazität weisen Sie stressapptest 16MB zu, üblicherweise ein Achtel der Gesamtkapazität.

<!-- Source EN PDF p.79, block 965 -->

```text
<rv1108:/ #> /mnt/sdcard/stressapptest -s 500 -i 1 -C 1 -W --stop_on_errors -M 16
```

<!-- Source EN PDF p.79, block 966 -->

3\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.79, block 967 -->

Prüfen Sie nach dem Test den Gerätebetrieb und das PASS-/FAIL-Ergebnis von stressapptest. Alle 10 Sekunden wird die verbleibende Testzeit ausgegeben. Abschließend erscheint Status: PASS bei Erfolg oder Status: FAIL bei Fehlern.

<!-- Source EN PDF p.79, block 968 -->

4\. Führen Sie memtester länger als 12 Stunden aus.

<!-- Source EN PDF p.79, block 969 -->

Bei 128MB Gesamtkapazität weisen Sie stressapptest 16MB zu, üblicherweise ein Achtel der Gesamtkapazität.

<!-- Source EN PDF p.79, block 970 -->

```text
<rv1108:/ #> /mnt/sdcard/memtester_32bit 16m
```

<!-- Source EN PDF p.79, block 971 -->

5\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.79, block 972 -->

Prüfen Sie nach dem Test Gerätebetrieb und memtester-Fehler. Die bereitgestellte Version stoppt automatisch beim ersten erkannten Fehler. Läuft sie länger als 12 Stunden weiter, wurde während dieser Zeit kein Fehler erkannt.

<!-- Source EN PDF p.79, block 973 -->

Ohne Fehler gibt memtester fortlaufend folgende Meldungen aus:

<!-- Source EN PDF p.79, block 974 -->

```text
Loop 10:
     Stuck Address : ok
     Random Value : ok
     Compare XOR : ok
     Compare SUB : ok
     Compare MUL : ok
     Compare DIV : ok
     Compare OR : ok
     Compare AND : ok
     Sequential Increment: ok
     Solid Bits : ok
     Block Sequential : ok
     Checkerboard : ok
     Bit Spread : ok
     Bit Flip : ok
     Walking Ones : ok
     Walking Zeroes : ok
```

<!-- Source EN PDF p.79, block 975 -->

Bei einem Fehler stoppt memtester automatisch und beendet den Test. Die Ausgabe lautet dann:

<!-- Source EN PDF p.79, block 976 -->

```text
FAILURE: 0xffffffff != 0xffffbfff at offset 0x03b7d9e4.
EXIT_FAIL_OTHERTEST
```

<!-- Source EN PDF p.80, block 977 -->

#### 3.4.5 Frequenzwechseltest auf RV1108

<!-- Source EN PDF p.80, block 978 -->

Starten Sie das Gerät nach einem zuvor ausgeführten Festfrequenztest neu. Andernfalls kann der folgende Frequenzwechselbefehl nicht ausgeführt werden.

<!-- Source EN PDF p.80, block 979 -->

1\. Starten Sie memtester im Hintergrund.

<!-- Source EN PDF p.80, block 980 -->

Bei 128MB Gesamtkapazität weisen Sie memtester 16MB zu, üblicherweise ein Achtel der Gesamtkapazität.

<!-- Source EN PDF p.80, block 981 -->

```text
<rv1108:/ #> /mnt/sdcard/memtester_32bit 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.80, block 982 -->

2\. Führen Sie den Frequenzwechselbefehl aus.

<!-- Source EN PDF p.80, block 983 -->

Der Testbereich reicht von 400MHz bis zur maximalen Gerätefrequenz.

<!-- Source EN PDF p.80, block 984 -->

Beispiel:

<!-- Source EN PDF p.80, block 985 -->

Bei maximaler DDR-Frequenz von 800MHz:

<!-- Source EN PDF p.80, block 986 -->

```text
<rv1108:/ #> echo 'a:400M-800M-1000000T' > proc/driver/ddr_ts
```

<!-- Source EN PDF p.80, block 987 -->

3\. Prüfen Sie das Ergebnis nach mehr als 12 Stunden Testdauer.

<!-- Source EN PDF p.80, block 988 -->

Prüfen Sie den normalen Gerätebetrieb.

<!-- Source EN PDF p.80, block 989 -->

Prüfen Sie, ob das DDR-Frequenzwechselprogramm läuft und seine Protokolle normal ausgibt.

<!-- Source EN PDF p.80, block 990 -->

Prüfen Sie den normalen memtester-Betrieb. Mit `<rkxxxx:/ #>` ps \| grep memtester stellen Sie fest, ob der Prozess noch aktiv ist.

<!-- Source EN PDF p.80, block 991 -->

Beispiel:

<!-- Source EN PDF p.80, block 992 -->

```text
<rkxxxx:/ #> ps | grep memtester
root 14309 1730 74332 68156 0 5e980bf564 R /data/memtester
```

<!-- Source EN PDF p.80, block 993 -->

#### 3.4.6 Neustarttest auf RV1108

<!-- Source EN PDF p.80, block 994 -->

Verwenden Sie die integrierte Funktion: menu → debug → reboot test.

<!-- Source EN PDF p.80, block 995 -->

### 3.5 DDR-Verifikation auf RK3308

<!-- Source EN PDF p.80, block 996 -->

#### 3.5.1 DDR-Kapazität auf RK3308 überprüfen

<!-- Source EN PDF p.80, block 997 -->

Prüfen Sie mit `<rk3308:/ #>` cat /proc/meminfo, ob MemTotal zur tatsächlichen Kapazität passt.

<!-- Source EN PDF p.80, block 998 -->

Protokollbeispiel:

<!-- Source EN PDF p.81, block 999 -->

```text
<rk3308:/ #> cat /proc/meminfo
MemTotal: 246832 kB
MemFree: 201800 kB
```

<!-- Source EN PDF p.81, block 1000 -->

64MB entsprechen näherungsweise 66688kB.

<!-- Source EN PDF p.81, block 1001 -->

128MB entsprechen näherungsweise 133376kB.

<!-- Source EN PDF p.81, block 1002 -->

256MB entsprechen näherungsweise 266752kB.

<!-- Source EN PDF p.81, block 1003 -->

512MB entsprechen näherungsweise 533504kB.

<!-- Source EN PDF p.81, block 1004 -->

Kleine Abweichungen sind aufgrund unterschiedlicher Speicherverwaltung normal.

<!-- Source EN PDF p.81, block 1005 -->

#### 3.5.2 Festfrequenztest auf RK3308

<!-- Source EN PDF p.81, block 1006 -->

RK3308 unterstützt keine DDR-Frequenzskalierung. Die bei der Initialisierung vom Loader gesetzte Frequenz bleibt unverändert. Verwenden Sie den Loader mit maximaler Frequenz: 800MHz für DDR3, 533MHz für DDR2 und LPDDR2.

<!-- Source EN PDF p.81, block 1007 -->

1\. Führen Sie memtester länger als 12 Stunden aus.

<!-- Source EN PDF p.81, block 1008 -->

Prüfen Sie zunächst, ob die Testdatei vorhanden ist:

<!-- Source EN PDF p.81, block 1009 -->

```text
<rk3308:/ #> ls usr/bin/memtester
usr/bin/memtester
```

<!-- Source EN PDF p.81, block 1010 -->

Ist memtester vorhanden, verwenden Sie folgenden Befehl. Bei 128MB Gesamtkapazität werden 16MB getestet, üblicherweise ein Achtel.

<!-- Source EN PDF p.81, block 1011 -->

```text
<rk3308:/ #> memtester 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.81, block 1012 -->

Fehlt die Datei, übertragen Sie memtester_32bit.32bit bzw. memtester_64bit.64bit mit ADB nach /data/. Linux-32 verwendet die 32-Bit-, Linux-64 die 64-Bit-Datei.

<!-- Source EN PDF p.81, block 1013 -->

Befehl für Linux-32:

<!-- Source EN PDF p.81, block 1014 -->

```text
adb push \*file path*\memtester_32bit.32bit data/memtester
```

<!-- Source EN PDF p.81, block 1015 -->

Befehl für Linux-64:

<!-- Source EN PDF p.81, block 1016 -->

```text
adb push \*file path*\memtester_64bit.64bit data/memtester
```

<!-- Source EN PDF p.81, block 1017 -->

Berechtigungen ändern:

<!-- Source EN PDF p.81, block 1018 -->

```text
<rk3308:/ #> chmod 777 /data/memtester
```

<!-- Source EN PDF p.81, block 1019 -->

memtester-Befehl: Bei 128MB Gesamtkapazität werden 16MB getestet, üblicherweise ein Achtel.

<!-- Source EN PDF p.82, block 1020 -->

```text
<rk3308:/ #> /data/memtester 16m > /data/memtester_log.txt &
```

<!-- Source EN PDF p.82, block 1021 -->

2\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.82, block 1022 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb.

<!-- Source EN PDF p.82, block 1023 -->

Prüfen Sie memtester auf Fehlermeldungen. Hinweis: Diese Variante stoppt bei Fehlern ==nicht automatisch==; kontrollieren Sie die gesamte Ausgabe.

<!-- Source EN PDF p.82, block 1024 -->

Ohne Fehler gibt memtester fortlaufend folgende Meldungen aus:

<!-- Source EN PDF p.82, block 1025 -->

```text
Loop 1:
  Stuck Address : ok
  Random Value : ok
  Compare XOR : ok
  Compare SUB : ok
  Compare MUL : ok
  Compare DIV : ok
  Compare OR : ok
  Compare AND : ok
  Sequential Increment: ok
  Solid Bits : ok
  Block Sequential : ok
  Checkerboard : ok
  Bit Spread : ok
  Bit Flip : ok
  Walking Ones : ok
  Walking Zeroes : ok
  8-bit Writes : ok
  16-bit Writes : ok
```

<!-- Source EN PDF p.82, block 1026 -->

Bei Fehlern stoppt memtester nicht automatisch. Die Ausgabe lautet:

<!-- Source EN PDF p.82, block 1027 -->

```text
Loop 92:
  Stuck Address : ok
  Random Value : FAILURE: 0x37fe0f4190f6b999 != 0x37fe0f4196f6b999 at offset
0x0027a958.
FAILURE: 0x2823d0d6f62a4b01 != 0x2823d0d6f02a4b01 at offset 0x0027a958.
  Compare XOR : FAILURE: 0x4c4f418e764340e8 != 0x4c4f418e704340e8 at offset
0x0027a958.
  Compare SUB : FAILURE: 0x2856fb8ee22bd230 != 0xfe5ee503ee2bd230 at offset
0x0027a958.
  Compare MUL : FAILURE: 0x00000000 != 0x00000001 at offset 0x0027a958.
  Compare DIV : FAILURE: 0xefb2eceaffbf9604 != 0xefb2eceaffbf9605 at offset
0x0027a958.
  Compare OR : FAILURE: 0xcbb2a0e8cfbb8200 != 0xcbb2a0e8cfbb8201 at offset
0x0027a958.
  Compare AND : Sequential Increment: ok
  Solid Bits : ok
  Block Sequential : ok
  Checkerboard : ok
  Bit Spread : ok
  Bit Flip : ok
Walking Ones : ok
Walking Zeroes : ok
8-bit Writes : ok
16-bit Writes : ok
```

<!-- Source EN PDF p.83, block 1029 -->

3\. Führen Sie Google stressapptest länger als 12 Stunden aus.

<!-- Source EN PDF p.83, block 1030 -->

Prüfen Sie zunächst, ob die Testdatei vorhanden ist:

<!-- Source EN PDF p.83, block 1031 -->

```text
<rk3308:/ #> ls usr/bin/stressapptest
usr/bin/stressapptest
```

<!-- Source EN PDF p.83, block 1032 -->

Ist stressapptest vorhanden, verwenden Sie folgenden Befehl. Bei 256MB Gesamtkapazität werden 32MB getestet, üblicherweise ein Achtel. Der Parameter nach -s bestimmt die Dauer in Sekunden; das folgende Beispiel läuft 24 Stunden.

<!-- Source EN PDF p.83, block 1033 -->

```text
<rk3308:/ #> stressapptest -s 86400 -i 4 -C 4 -W --stop_on_errors -M 32
```

<!-- Source EN PDF p.83, block 1034 -->

Fehlt die Datei, übertragen Sie stressapptest_32bit bzw. stressapptest_64bit mit ADB nach /data/. Linux-32 verwendet die 32-Bit-, Linux-64 die 64-Bit-Datei.

<!-- Source EN PDF p.83, block 1035 -->

Befehl für Linux-32:

<!-- Source EN PDF p.83, block 1036 -->

```text
adb push \*file path*\stressapptest_32bit data/stressapptest
```

<!-- Source EN PDF p.83, block 1037 -->

Befehl für Linux-64:

<!-- Source EN PDF p.83, block 1038 -->

```text
adb push \*file path*\stressapptest_64bit data/stressapptest
```

<!-- Source EN PDF p.83, block 1039 -->

Berechtigungen ändern:

<!-- Source EN PDF p.83, block 1040 -->

```text
<rk3308:/ #> chmod 777 /data/stressapptest
```

<!-- Source EN PDF p.83, block 1041 -->

stressapptest-Befehl: Bei 256MB Gesamtkapazität werden 32MB getestet, üblicherweise ein Achtel. Das folgende Beispiel läuft 24 Stunden.

<!-- Source EN PDF p.83, block 1042 -->

```text
<rk3308:/ #> /data/stressapptest -s 86400 -i 4 -C 4 -W --stop_on_errors -M 32
```

<!-- Source EN PDF p.83, block 1043 -->

4\. Prüfen Sie das Testergebnis.

<!-- Source EN PDF p.83, block 1044 -->

Prüfen Sie nach dem Test den normalen Gerätebetrieb.

<!-- Source EN PDF p.83, block 1045 -->

Prüfen Sie das PASS-/FAIL-Ergebnis von stressapptest. Alle 10 Sekunden wird die verbleibende Testzeit ausgegeben. Abschließend erscheint Status: PASS bei Erfolg oder Status: FAIL bei Fehlern.

<!-- Source EN PDF p.84, block 1046 -->

#### 3.5.3 Suspend-Test auf RK3308

<!-- Source EN PDF p.84, block 1047 -->

Aktivieren Sie für diesen Test die automatische Aufweckfunktion im Kernel. Öffnen Sie rk3308.dtsi, suchen Sie rockchip_suspend und verknüpfen Sie RKPM_TIMEOUT_WAKEUP_EN bitweise per ODER wie folgt:

<!-- Source EN PDF p.84, block 1048 -->

```text
rockchip_suspend: rockchip-suspend {
                ...
                rockchip,wakeup-config = <
                        (0
                        | RKPM_GPIO0_WAKEUP_EN
                        | RKPM_TIMEOUT_WAKEUP_EN
                        )
                >;
        };
```

<!-- Source EN PDF p.84, block 1049 -->

Nach Kompilierung der Firmware wird die Verwendung des Testskripts empfohlen. Prüfen Sie zunächst dessen Vorhandensein:

<!-- Source EN PDF p.84, block 1050 -->

```text
<rk3308:/ #> ls rockchip_test/rockchip_test.sh
rockchip_test/rockchip_test.sh
```

<!-- Source EN PDF p.84, block 1051 -->

Ist die Datei vorhanden, lautet der Testbefehl:

<!-- Source EN PDF p.84, block 1052 -->

```text
<rk3308:/ #> /rockchip_test/rockchip_test.sh
...
please input your test moudle: //the serial console first input 8<enter>, then 1<enter>
8
1
```

<!-- Source EN PDF p.84, block 1053 -->

Andernfalls können Sie den Suspend-Test direkt über die serielle Konsole starten:

<!-- Source EN PDF p.84, block 1054 -->

```text
<rk3308:/ #> while true; do echo mem > /sys/power/state; sleep 5; done
```

<!-- Source EN PDF p.84, block 1055 -->

Testen Sie länger als 12 Stunden und prüfen Sie anschließend den normalen Gerätebetrieb.

<!-- Source EN PDF p.84, block 1056 -->

#### 3.5.4 Neustarttest auf RK3308

<!-- Source EN PDF p.84, block 1057 -->

Empfohlen wird das RK3308-Testskript. Prüfen Sie zunächst dessen Vorhandensein:

<!-- Source EN PDF p.84, block 1058 -->

```text
<rk3308:/ #> ls rockchip_test/rockchip_test.sh
rockchip_test/rockchip_test.sh
```

<!-- Source EN PDF p.84, block 1059 -->

Ist die Datei vorhanden, lautet der Neustartbefehl:

<!-- Source EN PDF p.85, block 1060 -->

```text
<rk3308:/ #> /rockchip_test/rockchip_test.sh
...
please input your test moudle: //the serial console input 13<enter>
13
```

<!-- Source EN PDF p.85, block 1061 -->

Andernfalls übertragen Sie auto_reboot_test.sh nach /data/:

<!-- Source EN PDF p.85, block 1062 -->

```text
adb push \*file path*\auto_reboot_test.sh data/.
```

<!-- Source EN PDF p.85, block 1063 -->

Berechtigungen ändern:

<!-- Source EN PDF p.85, block 1064 -->

```text
<rk3308:/ #> chmod 777 /data/auto_reboot_test.sh
```

<!-- Source EN PDF p.85, block 1065 -->

Neustartbefehl:

<!-- Source EN PDF p.85, block 1066 -->

```text
<rk3308:/ #> /data/auto_reboot_test.sh
```

<!-- Source EN PDF p.85, block 1067 -->

Testen Sie länger als 12 Stunden und prüfen Sie anschließend den normalen Gerätebetrieb.

<!-- Source EN PDF p.86, block 1068 -->

## 4. Kapitel 4: Rockchip-DDR-DQ-Augendiagrammwerkzeug

<!-- Source EN PDF p.86, block 1069 -->

### 4.1 Zweidimensionale Augendiagramme scannen

<!-- Source EN PDF p.86, block 1070 -->

#### 4.1.1 Unterstützte Plattformen

<!-- Source EN PDF p.86, block 1071 -->

RK3528, RK3562, RK3566, RK3568, RK3588，RK3576

<!-- Source EN PDF p.86, block 1072 -->

#### 4.1.2 Verwendung

<!-- Source EN PDF p.86, block 1073 -->

Der Loader muss mit einer eye_scan-DDR-Binärdatei erzeugt werden. Diese enthält "eyescan" im Namen und liegt wie normale DDR-Dateien unter rkbin/bin/rkxx, beispielsweise rkbin/bin/rk35/rk3568_ddr_1560MHz_eyescan_v1.16.bin. Zur Loader-Erzeugung siehe den DDR-Entwicklerleitfaden.

<!-- Source EN PDF p.86, block 1074 -->

Für andere Frequenzen ändern Sie die eye_scan-DDR-Datei mit rkbin/tools/ddrbin_tool und erzeugen anschließend den Loader. Einzelheiten enthält rkbin/tools/ddrbin_tool_user_guide.txt.

<!-- Source EN PDF p.86, block 1075 -->

Wechseln Sie in Maskrom-Modus und laden Sie den Loader mit RKDevTool. Ergebnisse werden seriell ausgegeben. Nach dem 2D-Augenscan stoppt der Loader automatisch; das Werkzeug meldet deshalb einen Fehlschlag.

<!-- Source EN PDF p.86, block 1076 -->

![Technische Originalabbildung — PDF S. 86](/docs/rockchip-ddr/assets/en-p86-figure1.png)

<!-- Source EN PDF p.86, block 1077 -->

Im Loader-Modus kann der Loader erfolgreich programmiert werden. Danach scannt er bei jedem Start das 2D-Auge, gibt das Ergebnis seriell aus und stoppt. Ein normaler Systemstart ist dann nicht möglich. Zur Wiederherstellung wechseln Sie in Maskrom-Modus und programmieren einen normalen Loader.

<!-- Source EN PDF p.87, block 1078 -->

##### 4.1.2.1 Ergebnisauswertung

<!-- Source EN PDF p.87, block 1079 -->

Am Anfang des 2D-Augenprotokolls wird die Verzögerung pro Schritt in fs (0.001ps) angegeben. "Unit: 1913 fs" in der ersten Zeile des folgenden Beispiels bedeutet 1.913 ps pro Schritt.

<!-- Source EN PDF p.87, block 1080 -->

Die zweite Zeile 'margin: rx:22-8,tx:26-32' bedeutet, dass beim Lesen mindestens 22 Schritte Setup- und 8 Schritte Hold-Reserve, beim Schreiben mindestens 26 bzw. 32 Schritte erforderlich sind. Diese frequenzabhängigen Werte wurden von ps in die Schrittweite des Software-Augendiagramms umgerechnet. Im folgenden RX-DQ0-Diagramm markieren '\|' die Mindestanforderungen von 22 Setup- und 8 Hold-Schritten. '[33 ~ -1 ~-35]' rechts bedeutet bei diesem Vref 33 Setup- und 35 Hold-Schritte. Gegenüber der Mindestanforderung bleiben somit zusätzlich 33-22=11 Schritte Setup- und 35-8=27 Schritte Hold-Reserve.

<!-- Source EN PDF p.87, block 1081 -->

![Technische Originalabbildung — PDF S. 87](/docs/rockchip-ddr/assets/en-p87-figure1.png)

<!-- Source EN PDF p.87, block 1082 -->

Die obige Abbildung zeigt das Augendiagramm einer einzelnen DQ-Leitung.

<!-- Source EN PDF p.87, block 1083 -->

Links bezeichnet "vref" die zur Referenzspannung gehörende Augenbreite. "`*`" vor vref markiert die Referenzspannung mit maximaler Augenbreite, "+" die von der aktuellen Firmware verwendete Spannung. Der angegebene vref-Wert ist nicht exakt; intern wird der nächstliegende verfügbare Wert verwendet. Bei angezeigten 30.4% und nächstem internem Wert 30.2% sind tatsächlich 30.2% wirksam.

<!-- Source EN PDF p.87, block 1084 -->

In der Mitte bezeichnet "-" einen ungültigen Phasenpunkt, "" einen gültigen Phasenpunkt und "+" den Standardabtastpunkt. Der Bereich zwischen "\|" ist die erforderliche Mindestreserve für Setup/Hold. Von "+" bis zum äußersten linken "" reicht die Setup-Reserve, bis zum äußersten rechten "`*`" die Hold-Reserve. Dringt die tatsächliche Augengrenze in den Mindestbereich ein, wird der Punkt durch "o" ersetzt. Ein "o" zeigt unzureichende Signalreserve an, wie folgt:

> Quelltypografie: Im PDF stehen in diesem Absatz zwei leere Anführungszeichen. Der letzte Satz und der entsprechende chinesische Absatz verwenden `*`. Die russische Übersetzung deutet die beiden leeren Markierungen mit ausdrücklichem redaktionellem Hinweis als `*`; diese deutsche Fassung bewahrt die leeren Quellmarkierungen. Prüfen Sie sie anhand der Werkzeugausgabe.

<!-- Source EN PDF p.88, block 1085 -->

![Technische Originalabbildung — PDF S. 88](/docs/rockchip-ddr/assets/en-p88-figure1.png)

<!-- Source EN PDF p.88, block 1086 -->

Rechts stehen in "[]" von links nach rechts die linke Augengrenze, der Mittelwert, die rechte Augengrenze und die gesamte Augenbreite.

<!-- Source EN PDF p.88, block 1087 -->

![Technische Originalabbildung — PDF S. 88](/docs/rockchip-ddr/assets/en-p88-figure2.png)

<!-- Source EN PDF p.88, block 1088 -->

Die obige Abbildung zeigt das zusammengefasste Auge aller DQ-Leitungen.

<!-- Source EN PDF p.89, block 1089 -->

![Technische Originalabbildung — PDF S. 89](/docs/rockchip-ddr/assets/en-p89-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

| cs0 RD | Feld | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Maximales Auge | links | -42 | -42 | -44 | -46 | -39 | -44 | -44 | -39 | -45 | -44 | -47 | -44 | -46 | -47 | -44 | -49 |
| Maximales Auge | Mitte | 0 | 0 | -2 | -4 | 1 | -2 | -3 | 0 | 3 | 3 | 0 | 3 | 3 | 1 | 2 | -1 |
| Maximales Auge | rechts | 41 | 43 | 39 | 38 | 42 | 40 | 38 | 40 | 51 | 51 | 48 | 51 | 52 | 50 | 49 | 47 |
| Maximales Auge | Breite | 83 | 85 | 83 | 84 | 81 | 84 | 82 | 79 | 96 | 95 | 95 | 95 | 98 | 97 | 93 | 96 |
| Aktuelles Auge | links | -39 | -44 | -44 | -43 | -39 | -44 | -41 | -39 | -44 | -43 | -45 | -41 | -45 | -46 | -40 | -47 |
| Aktuelles Auge | Mitte | 0 | -1 | -2 | -1 | 1 | -2 | 0 | 0 | 3 | 4 | 1 | 5 | 3 | 2 | 6 | 0 |
| Aktuelles Auge | rechts | 38 | 41 | 39 | 40 | 41 | 40 | 40 | 40 | 51 | 52 | 48 | 52 | 52 | 51 | 52 | 48 |
| Aktuelles Auge | Breite | 77 | 85 | 83 | 83 | 80 | 84 | 81 | 79 | 95 | 95 | 93 | 93 | 97 | 97 | 92 | 95 |

<!-- Source EN PDF p.89, block 1090 -->

Zur Prüfung aller einzelnen DQ-Leitungen fasst die obige Tabelle deren Ergebnisse zusammen.

<!-- Source EN PDF p.89, block 1091 -->

"max eye" listet linke Grenze, Mitte, rechte Grenze und Gesamtbreite des breitesten Auges aller DQ-Leitungen auf. Laut dieser Quellbeschreibung ist dessen Vref mit "+" markiert. Von links nach rechts folgen DQ0, DQ1 usw.

<!-- Source EN PDF p.89, block 1092 -->

"current eye" listet die Augenbreite beim aktuell verwendeten Vref auf, laut dieser Quellbeschreibung mit "`*`" markiert. Das Format entspricht "max eye".

> Quellenwiderspruch: Zuvor wird * dem Vref mit maximaler Augenbreite und + dem aktuellen Vref zugeordnet; die Erklärung von max/current vertauscht dies. Beide Aussagen bleiben erhalten. Prüfen Sie Werkzeugversion und tatsächliche Ausgabe.

<!-- Source EN PDF p.89, block 1093 -->

Endergebnis: "all result: pass" am Protokollende bedeutet, dass alle DQ-Reserven genügen. Andernfalls erscheint "all result: err".

<!-- Source EN PDF p.89, block 1094 -->

### 4.2 Eindimensionale Augendiagramme scannen

<!-- Source EN PDF p.89, block 1095 -->

Verwenden Sie auf unterstützten Plattformen vorzugsweise den 2D-Scan, da er zusätzlich Vref berücksichtigt. 1D-Scans dienen besonderen Anforderungen.

<!-- Source EN PDF p.89, block 1096 -->

#### 4.2.1 Unterstützte Plattformen

<!-- Source EN PDF p.89, block 1097 -->

RV1109, RV1126, RK3566, RK3568, RK3528, RK3562

<!-- Source EN PDF p.89, block 1098 -->

#### 4.2.2 Verwendung

<!-- Source EN PDF p.89, block 1099 -->

##### 4.2.2.1 Vorbereitung

<!-- Source EN PDF p.89, block 1100 -->

1\. Prüfen Sie die DDR-Binärversion: RV1126 benötigt V1.09 oder neuer, RK3568/RK3566 V1.07 oder neuer. Aktualisieren Sie bei älteren Versionen das rkbin-Projekt.

<!-- Source EN PDF p.89, block 1101 -->

2\. Öffnen Sie vor dem U-Boot-Build menuconfig im Projektstamm. Aktivieren Sie unter "Command line interface" die Option "Enable ddr test tool" und speichern Sie die Konfiguration. Das DQ-Augendiagrammwerkzeug ist Bestandteil des DDR-Testwerkzeugs.

<!-- Source EN PDF p.90, block 1102 -->

![Technische Originalabbildung — PDF S. 90](/docs/rockchip-ddr/assets/en-p90-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

```text
[ ] Enable memtester for ddr
[*] Enable ddr test tool
    Misc commands --->
```

<!-- Source EN PDF p.90, block 1103 -->

3\. Kompilieren Sie U-Boot und programmieren Sie Loader und uboot; Einzelheiten siehe die U-Boot-Dokumentation.

<!-- Source EN PDF p.90, block 1104 -->

4\. Verbinden Sie die serielle Schnittstelle des Boards mit dem Host und prüfen Sie die Kommunikation. Drücken Sie beim Einschalten länger Ctrl+C, damit das Board in U-Boot bleibt. "`<INTERRUPT>`" zeigt diesen Zustand an.

<!-- Source EN PDF p.90, block 1105 -->

![Technische Originalabbildung — PDF S. 90](/docs/rockchip-ddr/assets/en-p90-figure2.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

```text
hclk_top 150000 KHz
pclk_top 100000 KHz
aclk_perimid 300000 KHz
hclk_perimid 150000 KHz
pclk_pmu 100000 KHz
Net: eth0: ethernet@fe010000
Hit key to stop autoboot('CTRL+C'): 0
=> <INTERRUPT>
=> <INTERRUPT>
=> <INTERRUPT>
```

<!-- Source EN PDF p.90, block 1106 -->

##### 4.2.2.2 DDR-DQ-Lese- und Schreibaugen in U-Boot anzeigen

<!-- Source EN PDF p.90, block 1107 -->

Geben Sie in U-Boot folgenden Befehl ein:

<!-- Source EN PDF p.90, block 1108 -->

```text
ddr_dq_eye <DDR frequency in MHz>
```

<!-- Source EN PDF p.90, block 1109 -->

Der Parameter `<DDR frequency in MHz>` legt die DDR-Taktfrequenz für die DQ-Augenanzeige in MHz fest. Ohne Angabe wird die höchste Frequenz verwendet.

<!-- Source EN PDF p.90, block 1110 -->

Beispiel für DQ-Augendiagramme bei 1056MHz:

<!-- Source EN PDF p.90, block 1111 -->

```text
ddr_dq_eye 1056
```

<!-- Source EN PDF p.90, block 1112 -->

Beispiel für DQ-Augendiagramme bei maximaler Frequenz:

<!-- Source EN PDF p.90, block 1113 -->

```text
ddr_dq_eye
```

<!-- Source EN PDF p.91, block 1114 -->

##### 4.2.2.3 Ergebnisauswertung

<!-- Source EN PDF p.91, block 1115 -->

![Technische Originalabbildung — PDF S. 91](/docs/rockchip-ddr/assets/en-p91-figure1.png)

<!-- Source EN PDF p.91, block 1116 -->

![Technische Originalabbildung — PDF S. 91](/docs/rockchip-ddr/assets/en-p91-figure2.png)

<!-- Source EN PDF p.91, block 1117 -->

Das Werkzeug zeigt zunächst Version, DDR-Typ und Frequenz an.

<!-- Source EN PDF p.92, block 1118 -->

Anschließend werden Lese- und Schreibaugen für jedes CS angezeigt.

<!-- Source EN PDF p.92, block 1119 -->

Im Augendiagramm liegt "-" außerhalb, "`*`" innerhalb des Auges. "\|" markiert den Abtastpunkt.

<!-- Source EN PDF p.92, block 1120 -->

Rechts werden linke und rechte Reserve (Margin_L, Margin_R), Abtastposition und Augenbreite angezeigt. Eckige Klammern markieren Breiten unterhalb des Mindestwerts, wie bei Lese-DQ0 im Beispiel.

<!-- Source EN PDF p.92, block 1121 -->

Am Ende zeigt das Werkzeug die kleinsten Lese- und Schreibaugenbreiten sowie die Mindestanforderungen für eine ähnliche Frequenz.

<!-- Source EN PDF p.92, block 1122 -->

#### 4.2.3 Mindestbreiten der DDR-DQ-Augen

<!-- Source EN PDF p.92, block 1123 -->

Die Grenzwerte beruhen auf Demo-Tests und Projekterfahrung. Unterschreitet die minimale Lese- oder Schreibaugenbreite den Grenzwert, kann DDR instabil arbeiten.

<!-- Source EN PDF p.92, block 1124 -->

Das Einhalten dieser Grenze zeigt lediglich, dass die DQ-Augenbreite im aktuellen Design vergleichsweise zuverlässig ist. Es schließt andere DDR-Designprobleme nicht aus. Führen Sie weitere Zuverlässigkeitstests entsprechend den Einsatzanforderungen durch.

<!-- Source EN PDF p.92, block 1125 -->

##### 4.2.3.1 RV1126

<!-- Source EN PDF p.92, block 1126 -->

| DDR-Typ | DDR-Taktfrequenz | Minimale Leseaugenbreite | Minimale Schreibaugenbreite |
|---|---|---|---|
| LPDDR4 | 1056MHz | 12 | 13 |
| LPDDR4 | 924MHz | 15 | 15 |
| DDR4 | 1056MHz | 13 | 9 |
| DDR4 | 924MHz | 15 | 11 |
| LPDDR3 | 1056MHz | 15 | 13 |
| LPDDR3 | 924MHz | 16 | 15 |
| DDR3 | 1056MHz | 14 | 14 |
| DDR3 | 924MHz | 17 | 17 |

<!-- Source EN PDF p.93, block 1127 -->

##### 4.2.3.2 RK3568/RK3566

<!-- Source EN PDF p.93, block 1128 -->

| DDR-Typ | DDR-Taktfrequenz | Minimale Leseaugenbreite | Minimale Schreibaugenbreite |
|---|---|---|---|
| LPDDR4 | 1560MHz | 25 | 24 |
| LPDDR4 | 1184MHz | 30 | 29 |
| DDR4 | 1560MHz | 30 | 22 |
| DDR4 | 1184MHz | 32 | 26 |
| LPDDR3 | 1184MHz | 34 | 25 |
| LPDDR3 | 1056MHz | 39 | 28 |
| DDR3 | 1184MHz | 32 | 31 |
| DDR3 | 1056MHz | 39 | 34 |

<!-- Source EN PDF p.94, block 1129 -->

## 5. Kapitel 5: Rockchip-DDR-Bandbreitenwerkzeug

<!-- Source EN PDF p.94, block 1130 -->

### 5.1 Begriffe

<!-- Source EN PDF p.94, block 1131 -->

Die wichtigsten Begriffe werden wie folgt verwendet:

<!-- Source EN PDF p.94, block 1132 -->

monitor: Funktion zur Überwachung und statistischen Erfassung verschiedener DDR-Befehle.

<!-- Source EN PDF p.94, block 1133 -->

### 5.2 Werkzeug beziehen

<!-- Source EN PDF p.94, block 1134 -->

```text
https://redmine.rock-chips.com/documents/49 -> DDR Related Materials_VerX.XX.7z -> Tools ->DDR Bandwidth Tool
```

<!-- Source EN PDF p.94, block 1135 -->

### 5.3 Unterstützte Plattformen

<!-- Source EN PDF p.94, block 1136 -->

Die unterstützten Plattformen lassen sich mit folgendem Befehl anzeigen:

<!-- Source EN PDF p.94, block 1137 -->

```text
# rk-msch-probe_vx.xx -h
```

<!-- Source EN PDF p.94, block 1138 -->

Folgende Informationen werden ausgegeben. Welche Plattformen tatsächlich unterstützt werden, hängt von der Werkzeugversion ab.

<!-- Source EN PDF p.94, block 1139 -->

```text
Usage: [-c chip_name -d msecs -f freq -h help]
-c <chip_name>:
'rk312x' include rk3126,rk3128 and px3se
'rk322x' include rk3128h,rk3228a,rk3228b and rk3229
...
[option] -d <msecs>: Sets the sampling interval in milliseconds.
[option] -f <freq>: Specifies the mean current DDR frequency in MHz.
[option] -h: Displays help information.
```

<!-- Source EN PDF p.94, block 1140 -->

### 5.4 Parameter

<!-- Source EN PDF p.94, block 1141 -->

Das DDR-Bandbreitenwerkzeug rk_msch_probe_vx.xx unterstützt folgende Parameter:

<!-- Source EN PDF p.94, block 1142 -->

-c: Chipname. Geben Sie nach Prüfung der Plattformunterstützung den Namen ein, beispielsweise rk3326.

<!-- Source EN PDF p.94, block 1143 -->

-d: Überwachungsintervall in ms, optional. Standard ist 1000ms.

<!-- Source EN PDF p.94, block 1144 -->

-f: Aktuelle DDR-Frequenz in MHz, optional. Das Werkzeug versucht in jedem Messintervall, die Frequenz selbst zu ermitteln. Schlägt dies fehl, muss sie angegeben werden.

<!-- Source EN PDF p.94, block 1145 -->

Fixieren Sie die DDR-Frequenz vorher, da Änderungen

<!-- Source EN PDF p.95, block 1146 -->

zu ungenauen Ergebnissen führen. -t test_loop: Anzahl der Testschleifen; anschließend beendet sich das Werkzeug. Standardmäßig läuft es unbegrenzt.

<!-- Source EN PDF p.95, block 1147 -->

-h: Hilfe.

<!-- Source EN PDF p.95, block 1148 -->

### 5.5 Voraussetzungen

<!-- Source EN PDF p.95, block 1149 -->

Der DMC-devfreq-Governor darf nicht dmc_ondemand sein. Empfohlen wird der Wechsel zu userspace mit folgendem Befehl:

<!-- Source EN PDF p.95, block 1150 -->

```text
# echo userspace > /sys/class/devfreq/dmc/governor
```

<!-- Source EN PDF p.95, block 1151 -->

Fixieren Sie anschließend die DDR-Frequenz, beispielsweise auf 780MHz:

<!-- Source EN PDF p.95, block 1152 -->

```text
# echo 780000000 > /sys/class/devfreq/dmc/userspace/set_freq
```

<!-- Source EN PDF p.95, block 1153 -->

Die folgende Ausgabe bedeutet, dass diese Voraussetzungen nicht erfüllt sind:

<!-- Source EN PDF p.95, block 1154 -->

```text
Error: The DDR monitor time gets error!!!
Please check the devfreq governor is not 'dmc_ondemand'!!!
For example:
# cat sys/class/devfreq/dmc/governor
# dmc_ondemand
Please switch the devfreq governor to others, such as 'userspace'.
For example:
# echo userspace > /sys/class/devfreq/dmc/governor
Delete the result of this time!
```

<!-- Source EN PDF p.95, block 1155 -->

### 5.6 Ausgabe erläutern

<!-- Source EN PDF p.95, block 1156 -->

rk_msch_probe_vx.xx überwacht und protokolliert DDR-Bandbreite und -Auslastung.

<!-- Source EN PDF p.95, block 1157 -->

Ausgabe allgemeiner Plattformen:

<!-- Source EN PDF p.95, block 1158 -->

```text
V1.06_20200629
ddr freq: 928Mhz
CH0:
ddr monitor statistics:
ddr load = 3251.23MB/s(43.76%) [RD:1859.93MB/s(25.03%), WR:1391.30MB/s(18.72%), ACT(access :
active): 3.34, srex:0.54%, pdex:1.27%, clkstp:0.00%, lp:1.81%]
```

<!-- Source EN PDF p.95, block 1159 -->

Ausgabe für RK3588:

<!-- Source EN PDF p.96, block 1160 -->

```text
ddr freq: 2133Mhz
===========ALL=============CH0===============CH1==============CH2===============CH3========
LOAD: 4.51MB/s(0.03%), 1.23MB/s(0.04%), 1.13MB/s(0.03%), 1.16MB/s(0.04%),
 1.00MB/s(0.03%)
RD: 2.57MB/s(0.02%), 0.74MB/s(0.02%), 0.65MB/s(0.02%), 0.67MB/s(0.02%),
 0.51MB/s(0.02%)
WR: 1.94MB/s(0.01%), 0.49MB/s(0.02%), 0.48MB/s(0.01%), 0.49MB/s(0.02%),
 0.48MB/s(0.01%)
===========================================================================================
```

<!-- Source EN PDF p.96, block 1161 -->

Bedeutung der Statistikfelder:

<!-- Source EN PDF p.96, block 1162 -->

| Ausgabe | Bedeutung |
|---|---|
| ALL | Gesamte Bandbreitenstatistik aller Kanäle |
| CHx | Bandbreitenstatistik des DDR-Kanals x |
| recorded LOAD<br>（max, min, avg） | Während der Werkzeugausführung erfasste maximale, minimale und mittlere<br>Bandbreite und Auslastung über alle DDR-Bänke |
| load/LOAD | Bandbreite und Auslastung dieses Kanals über alle DDR-Bänke |
| RD | Lesebandbreite und Leseanteil über alle DDR-Bänke |
| WR | Schreibbandbreite und Schreibanteil über alle DDR-Bänke |
| PRE | Anteil der Precharge-Befehle an allen Befehlen über alle DDR-Bänke.<br>Precharge und Activate treten paarweise auf. Da keine eigene Hardwarestatistik<br>vorliegt, wird direkt die Activate-Statistik verwendet. |
| ACT(access :<br>active) | Mittlere Anzahl von Lese-/Schreibzugriffen nach jedem Activate-Befehl<br>über alle DDR-Bänke. Höhere Werte bedeuten zusammenhängendere<br>Adresszugriffe und sind günstiger. |
| srex | Zeitanteil im Self-Refresh-Zustand |
| pdex | Zeitanteil im Power-Down-Zustand |
| clkstp | Zeitanteil im Clock-Stop-Zustand |
| srpdex | Zeitanteil im Self-Refresh-Power-Down-Zustand |
| dsmex | Zeitanteil im Deep-Sleep-Modus |
| lp/ LOW POWER | Zeitanteil in Stromsparzuständen wie Self-Refresh,<br>Power-Down und Clock-Stop |

<!-- Source EN PDF p.97, block 1163 -->

### 5.7 Häufige Fragen

<!-- Source EN PDF p.97, block 1164 -->

1) Bei fehlendem "/dev/mem" erscheint folgende Fehlermeldung:

<!-- Source EN PDF p.97, block 1165 -->

```text
rk3568:/ # rk-msch-probe_vx.xx -c rk356x
open /dev/mem error: No such file or directory
```

<!-- Source EN PDF p.97, block 1166 -->

Ursache ist die deaktivierte Kerneloption CONFIG_DEVMEM. Dadurch kann das Werkzeug nicht auf Geräteregister zugreifen.

<!-- Source EN PDF p.97, block 1167 -->

Lösung 1: Ergänzen Sie CONFIG_DEVMEM=y in der passenden Kernel-Konfigurationsdatei, beispielsweise android-11.config, und kompilieren Sie die Firmware erneut.

<!-- Source EN PDF p.97, block 1168 -->

Lösung 2: Führen Sie make menuconfig aus, suchen und aktivieren Sie DEVMEM und kompilieren Sie den Kernel erneut. Achten Sie darauf, die Konfiguration nicht zu überschreiben.

<!-- Source EN PDF p.97, block 1169 -->

```text
Symbol: DEVMEM [=y]
Type : bool
Prompt: /dev/mem virtual device support
Location:
    -> Device Drivers
(1) -> Character devices
  Defined at drivers/char/Kconfig:10
...
[*] /dev/mem virtual device support
...
```

<!-- Source EN PDF p.98, block 1170 -->

## 6. Kapitel 6: DDR_UserTool zur DDR-Lötstellenprüfung

<!-- Source EN PDF p.98, block 1171 -->

### 6.1 Übersicht

<!-- Source EN PDF p.98, block 1172 -->

DDR_UserTool prüft DDR-Lötverbindungen.

<!-- Source EN PDF p.98, block 1173 -->

Das Werkzeug wird unter https://redmine.rock-chips.com/documents/49 bereitgestellt: DDR相关资料_Verx.xx.7z → 工具 → DDR_UserTool_vx.xx.

<!-- Source EN PDF p.98, block 1174 -->

Die Versionsnummer von DDR_UserTool kann lange unverändert bleiben, während interne Konfigurationsdateien etwa für neue Plattformen aktualisiert werden. Laden Sie deshalb für jedes neue Projekt die aktuelle Version aus Redmine.

<!-- Source EN PDF p.98, block 1175 -->

### 6.2 Testschritte

<!-- Source EN PDF p.98, block 1176 -->

#### 6.2.1 DDR_UserTool auf Englisch umstellen

<!-- Source EN PDF p.98, block 1177 -->

Öffnen Sie resource/config.ini und ändern Sie "Selected=1" auf "Selected=2", um Englisch einzustellen.

<!-- Source EN PDF p.98, block 1178 -->

![Technische Originalabbildung — PDF S. 98](/docs/rockchip-ddr/assets/en-p98-figure1.png)

<!-- Source EN PDF p.99, block 1179 -->

![Technische Originalabbildung — PDF S. 99](/docs/rockchip-ddr/assets/en-p99-figure1.png)

Editierbare Screenshot-Abschrift mit Originalfeldern und -werten:

```text
[Language]
Kinds=2
Selected=2
LangPath=Language\
Lang1File=Chinese.ini
Lang1FontName=宋体
Lang1FontSize=9
Lang1Tag=CHN
Lang1CHNTitle=中文
Lang1ENGTitle=Chinese
Lang2File=English.ini
Lang2FontName=Arial
Lang2FontSize=9
Lang2Tag=ENG
Lang2CHNTitle=英文
Lang2ENGTitle=English
[System]
```

<!-- Source EN PDF p.99, block 1180 -->

#### 6.2.2 DDR_UserTool.exe öffnen

<!-- Source EN PDF p.99, block 1181 -->

Hinweis für Windows 7: Rechtsklick und „Als Administrator ausführen“ wählen.

<!-- Source EN PDF p.100, block 1182 -->

#### 6.2.3 TestFile auswählen

<!-- Source EN PDF p.100, block 1183 -->

![Technische Originalabbildung — PDF S. 100](/docs/rockchip-ddr/assets/en-p100-figure1.png)

<!-- Source EN PDF p.100, block 1184 -->

TestFiles liegen als .cfg-Dateien im Unterordner "TestFile" des Werkzeugs. Wählen Sie die Datei passend zu Plattform und DDR-Kapazitätsaufbau.

<!-- Source EN PDF p.100, block 1185 -->

Beachten Sie:

<!-- Source EN PDF p.100, block 1186 -->

DDR4-x16-DDP-Bausteine (Dual Die Package) sind wie zwei x8-Bausteine zu behandeln. Verwendet ein nominell als "4GB DDR4(1CS x 2pcs x 1Gb×16bit)" beschriebenes Gerät x16-DDP-Bausteine, wählen Sie die TestFile für "4GB DDR4(1CS x 4pcs x 1Gb×8bit)". Zur Erkennung siehe den entsprechenden Abschnitt.

<!-- Source EN PDF p.100, block 1187 -->

TestFiles für LPDDR4 und LPDDR4X sind nicht austauschbar.

<!-- Source EN PDF p.100, block 1188 -->

Für DDR3L verwenden Sie die DDR3-TestFile.

<!-- Source EN PDF p.100, block 1189 -->

#### 6.2.4 TestFile signieren

<!-- Source EN PDF p.100, block 1190 -->

Nur für Geräte mit Secure Boot erforderlich; andere Geräte überspringen diesen Schritt.

<!-- Source EN PDF p.101, block 1191 -->

![Technische Originalabbildung — PDF S. 101](/docs/rockchip-ddr/assets/en-p101-figure1.png)

<!-- Source EN PDF p.101, block 1192 -->

Signieren Sie die TestFile mit SecureBootTool, ebenfalls verfügbar unter https://redmine.rock-chips.com/documents/49. Konfigurieren Sie Chip, Key und weitere Optionen und klicken Sie auf "Sign DDR File". Einzelheiten siehe SecureBootTool_UserManual.

<!-- Source EN PDF p.101, block 1193 -->

#### 6.2.5 Zielgerät in den Testzustand versetzen

<!-- Source EN PDF p.101, block 1194 -->

Verbinden Sie den OTG-Anschluss des Zielgeräts. Wenn möglich, verbinden Sie zusätzlich die serielle Schnittstelle.

<!-- Source EN PDF p.101, block 1195 -->

Es gibt mehrere Wege in den Testzustand:

<!-- Source EN PDF p.101, block 1196 -->

Geräte ohne programmierte Firmware

<!-- Source EN PDF p.101, block 1197 -->

Diese befinden sich bereits im Maskrom-Zustand und können direkt getestet werden.

<!-- Source EN PDF p.101, block 1198 -->

Gerät in Maskrom-Zustand versetzen

<!-- Source EN PDF p.101, block 1199 -->

Beim Einschalten werden CLK und GND des Speichergeräts kurzgeschlossen. Welche Pins dafür vorgesehen sind, entnehmen Sie dem RK-Schaltplan. Üblicherweise gibt es eine reservierte Taste oder Testpunkte für Maskrom.

<!-- Source EN PDF p.101, block 1200 -->

Gerät in Loader-Modus versetzen

<!-- Source EN PDF p.101, block 1201 -->

Nach Eintritt in den Testzustand zeigt das Werkzeug "Found one device".

<!-- Source EN PDF p.102, block 1202 -->

![Technische Originalabbildung — PDF S. 102](/docs/rockchip-ddr/assets/en-p102-figure1.png)

<!-- Source EN PDF p.102, block 1203 -->

#### 6.2.6 Test starten

<!-- Source EN PDF p.102, block 1204 -->

![Technische Originalabbildung — PDF S. 102](/docs/rockchip-ddr/assets/en-p102-figure2.png)

<!-- Source EN PDF p.103, block 1205 -->

Klicken Sie auf "StartTest". Der Fortschrittsbalken läuft an, und das Protokoll wird gleichzeitig angezeigt. Der Test dauert üblicherweise weniger als zwei Minuten.

<!-- Source EN PDF p.103, block 1206 -->

Bei aktivierter Option "AutoTest" startet der Test automatisch beim Anschluss eines Geräts.

<!-- Source EN PDF p.103, block 1207 -->

#### 6.2.7 Testergebnis auswerten

<!-- Source EN PDF p.103, block 1208 -->

##### 6.2.7.1 Test bestanden

<!-- Source EN PDF p.103, block 1209 -->

![Technische Originalabbildung — PDF S. 103](/docs/rockchip-ddr/assets/en-p103-figure1.png)

<!-- Source EN PDF p.103, block 1210 -->

##### 6.2.7.2 Test fehlgeschlagen

<!-- Source EN PDF p.103, block 1211 -->

Löten Sie entsprechend den Fehlermeldungen die betroffenen DDR-Bausteine und den SoC nach. Zur Zuordnung der konkreten Leitungen siehe den Abschnitt über Fehlermeldungen und Hardwaresignale.

<!-- Source EN PDF p.103, block 1212 -->

Nach Reparatur eines fehlgeschlagenen Geräts muss erneut getestet werden, bis es den Test besteht.

<!-- Source EN PDF p.104, block 1213 -->

![Technische Originalabbildung — PDF S. 104](/docs/rockchip-ddr/assets/en-p104-figure1.png)

<!-- Source EN PDF p.104, block 1214 -->

##### 6.2.7.3 Test unterbrochen

<!-- Source EN PDF p.104, block 1215 -->

![Technische Originalabbildung — PDF S. 104](/docs/rockchip-ddr/assets/en-p104-figure2.png)

<!-- Source EN PDF p.105, block 1216 -->

Zur Fehlersuche siehe den Abschnitt über Ursachen eines Testabbruchs.

<!-- Source EN PDF p.105, block 1217 -->

### 6.3 Häufige Fragen

<!-- Source EN PDF p.105, block 1218 -->

#### 6.3.1 Kann DDR_UserTool die DDR-Stabilität prüfen?

<!-- Source EN PDF p.105, block 1219 -->

Nein. DDR_UserTool bietet derzeit nur eine Lötstellenprüfung. Zur Stabilitätsprüfung siehe den DDR-Verifikationsablauf.

<!-- Source EN PDF p.105, block 1220 -->

#### 6.3.2 Erkennt DDR_UserTool Lötprobleme an allen Pins?

<!-- Source EN PDF p.105, block 1221 -->

Nein. Die softwarebasierte Prüfung ist schnell und bequem, hat aber Grenzen. Sie erfasst weder alle DDR-Pins noch Pins anderer Module.

<!-- Source EN PDF p.105, block 1222 -->

Üblicherweise lassen sich Lötprobleme an DQ und den meisten CA-Pins erkennen. Versorgungspins sowie CKE und ODT werden nicht erfasst.

<!-- Source EN PDF p.105, block 1223 -->

#### 6.3.3 DDR4-x16-DDP-Bausteine erkennen

<!-- Source EN PDF p.105, block 1224 -->

1\. Prüfen Sie den Schaltplan: Ist M9 des DDR4-Bausteins mit BG1 auf SoC-Seite verbunden, handelt es sich um x16 DDP. Bei Verbindung mit VSS nicht.

<!-- Source EN PDF p.106, block 1225 -->

![Technische Originalabbildung — PDF S. 106](/docs/rockchip-ddr/assets/en-p106-figure1.png)

<!-- Source EN PDF p.106, block 1226 -->

2\. Prüfen Sie das Loader-Protokoll eines normal startenden Geräts. "Die BW=8" in den Kapazitätsangaben bestätigt x16 DDP.

<!-- Source EN PDF p.106, block 1227 -->

3\. Prüfen Sie das Datenblatt auf eine ausdrückliche DDP-Kennzeichnung (Dual Die Package). Alternativ gilt: M9 = BG1 bedeutet x16 DDP, M9 = VSS bedeutet kein x16 DDP.

<!-- Source EN PDF p.106, block 1228 -->

#### 6.3.4 Keine passende TestFile gefunden

<!-- Source EN PDF p.106, block 1229 -->

Prüfen Sie auf Aktualisierungen.

<!-- Source EN PDF p.106, block 1230 -->

Fehlt für eine neue Plattform noch eine TestFile, warten Sie auf ein Werkzeugupdate.

<!-- Source EN PDF p.106, block 1231 -->

Für bereits unterstützte Plattformen sind die üblichen DDR-Konfigurationen normalerweise abgedeckt. Prüfen Sie die zahlreichen Dateien sorgfältig. Bei einer besonderen Konfiguration ohne passende Datei stellen Sie eine Anfrage auf Redmine.

<!-- Source EN PDF p.106, block 1232 -->

#### 6.3.5 Ursachen eines Testabbruchs

<!-- Source EN PDF p.106, block 1233 -->

1\. Unter Windows 7 nicht als Administrator gestartet

<!-- Source EN PDF p.106, block 1234 -->

2\. Falsche TestFile, etwa unpassende Plattform, DDR-Typ oder Kapazitätskonfiguration

<!-- Source EN PDF p.107, block 1235 -->

3\. Wiederholung des Tests ohne erneuten Eintritt in den Testzustand

<!-- Source EN PDF p.107, block 1236 -->

4\. Nicht signierte TestFile bei Secure-Boot-Geräten

<!-- Source EN PDF p.107, block 1237 -->

5\. Veraltetes Werkzeug oder veraltete TestFile

<!-- Source EN PDF p.107, block 1238 -->

6\. Versorgungsproblem, beispielsweise unzureichende USB-Stromversorgung

<!-- Source EN PDF p.107, block 1239 -->

7\. USB-Verbindungsproblem; anderes Kabel oder anderen Computer versuchen

<!-- Source EN PDF p.107, block 1240 -->

8\. Bei Loader-Modus stattdessen Maskrom-Modus versuchen

<!-- Source EN PDF p.107, block 1241 -->

#### 6.3.6 Fehlermeldungen den Hardwareleitungen zuordnen

<!-- Source EN PDF p.107, block 1242 -->

CA-Leitungen dürfen nicht vertauscht werden; ihre Zuordnung ist daher normalerweise eindeutig.

<!-- Source EN PDF p.107, block 1243 -->

DQ-Fehler beziehen sich auf die Pinnamen der SoC-Seite. Maßgeblich ist der gemeinsame Namensteil, nicht der DDR-typabhängige Teil. Im folgenden RK3528-DDR4-Schaltplanausschnitt ist der gemeinsame Teil grün markiert. DQ1_B bezeichnet ein Problem an DDRPHY_B_DQ1 des SoC, also an der Leitung DDR4_DQU0_B.

<!-- Source EN PDF p.108, block 1244 -->

![Technische Originalabbildung — PDF S. 108](/docs/rockchip-ddr/assets/en-p108-figure1.png)

<!-- Source EN PDF p.108, block 1245 -->

#### 6.3.7 Test fehlgeschlagen, aber Röntgenprüfung unauffällig

<!-- Source EN PDF p.108, block 1246 -->

Röntgenaufnahmen erkennen nicht alle Lötprobleme. Ein Nachlöten von DDR-Bausteinen und SoC wird weiterhin empfohlen.

<!-- Source EN PDF p.109, block 1247 -->

#### 6.3.8 Trotz Nachlöten weiterhin Testfehler

<!-- Source EN PDF p.109, block 1248 -->

1\. Falsche TestFile oder veraltetes Werkzeug bzw. TestFile

<!-- Source EN PDF p.109, block 1249 -->

2\. Kalte Lötstellen sowohl am DDR-Baustein als auch am SoC; beide Seiten nachlöten

<!-- Source EN PDF p.109, block 1250 -->

3\. Leiterplattenfertigungsfehler, beispielsweise unterbrochene Leiterbahnen

<!-- Source EN PDF p.109, block 1251 -->

4\. Andere Ursachen als DDR-Lötstellen: Bausteinfehler, Hardwaredesign oder Versorgung

<!-- Source EN PDF p.109, block 1252 -->

#### 6.3.9 Viele Geräte bestehen den Test nicht

<!-- Source EN PDF p.109, block 1253 -->

1\. Falsche TestFile oder veraltetes Werkzeug bzw. TestFile

<!-- Source EN PDF p.109, block 1254 -->

2\. Probleme beim Bestücker oder im Leiterplattenfertigungsprozess

<!-- Source EN PDF p.109, block 1255 -->

3\. Andere Ursachen als DDR-Lötstellen: Bausteinfehler, Hardwaredesign oder Versorgung

<!-- Source EN PDF p.109, block 1256 -->

#### 6.3.10 Weitere Fragen auf Redmine stellen

<!-- Source EN PDF p.109, block 1257 -->

Beschreiben Sie das Problem eindeutig und stellen Sie zur effizienten Analyse folgende Informationen bereit:

<!-- Source EN PDF p.109, block 1258 -->

1\. DDR-Teilenummer und Datenblatt

<!-- Source EN PDF p.109, block 1259 -->

2\. Anzahl der DDR-Bausteine auf dem Board, möglichst mit Schaltplan

<!-- Source EN PDF p.109, block 1260 -->

3\. Verwendete TestFile

<!-- Source EN PDF p.109, block 1261 -->

4\. Anteil fehlerhafter Geräte

<!-- Source EN PDF p.109, block 1262 -->

5\. DDR_Test_Log.txt aus dem Werkzeugverzeichnis, zugehörige Datei in resource\Log und serielles Testprotokoll. Falls funktionsfähige Geräte vorhanden sind, auch deren Protokolle bereitstellen.

<!-- Source EN PDF p.109, block 1263 -->

6\. Serielles Einschaltprotokoll; nach Möglichkeit ebenfalls von funktionsfähigen Vergleichsgeräten

<!-- Source EN PDF p.110, block 1264 -->

## 7. Kapitel 7: Rockchip-HAL-DDR-ECC

<!-- Source EN PDF p.110, block 1265 -->

### 7.1 Geltungsbereich

<!-- Source EN PDF p.110, block 1266 -->

Dieser Abschnitt gilt ausschließlich für Systeme mit HAL, nicht für Linux-Systeme.

<!-- Source EN PDF p.110, block 1267 -->

### 7.2 Begriffe

<!-- Source EN PDF p.110, block 1268 -->

| Abkürzung | Beschreibung |
|---|---|
| ECC | Fehlerkorrekturcode |
| SEC ECC | Korrektur eines einzelnen Bitfehlers |
| DED ECC | Erkennung von Doppelbitfehlern |
| DDR | Double Data Rate SDRAM |
| CE | Korrigierbarer Fehler |
| UE | Nicht korrigierbarer Fehler |
| cs | Chip-Select |
| Row | DDR-Zeilenadresse |
| Chip ID | DDR-Chipkennung; derzeit nicht aktiviert, ignorieren |
| BankGroup | DDR4-Bankgruppenadresse; bei anderen DDR-Typen ignorieren |
| Bank | DDR-Bankadresse |
| Col | DDR-Spaltenadresse |
| Bit position | Durch CE korrigierte Bitposition |

<!-- Source EN PDF p.110, block 1269 -->

### 7.3 Einführung

<!-- Source EN PDF p.110, block 1270 -->

ECC steht für Error Correcting Code und dient der Erkennung und Korrektur von DDR-Datenfehlern. RK3568 unterstützt Sideband-ECC mit einem zusätzlichen Kanal zur Speicherung der ECC-Daten neben dem Nutzdatenkanal. Es korrigiert Einbitfehler und erkennt Zweibitfehler: SEC/DED-ECC (Single Error Correction/Double Error Detection).

<!-- Source EN PDF p.111, block 1271 -->

### 7.4 DDR-ECC aktivieren

<!-- Source EN PDF p.111, block 1272 -->

1\. ECC wird automatisch aktiviert, wenn ein Baustein an DDR_ECC_DQ0-7 angeschlossen ist.

<!-- Source EN PDF p.111, block 1273 -->

2\. DDR_ECC_DQ0-7: ECC verwendet 32 Bit DQ-Daten plus 7 Bit ECC-Daten. Die aus DQ0–DQ31 berechneten ECC-Daten werden über DDR_ECC_DQ0-7 in einem zusätzlichen Baustein gespeichert.

<!-- Source EN PDF p.111, block 1274 -->

3\. Der zusätzliche ECC-Baustein muss hinsichtlich Typ, Zeilen, Spalten und Bänken mit den Bausteinen an DQ0–31 übereinstimmen.

<!-- Source EN PDF p.111, block 1275 -->

4\. Alle DDR-Typen unterstützen ECC.

<!-- Source EN PDF p.111, block 1276 -->

### 7.5 DDR-ECC-Informationen über HAL abrufen

<!-- Source EN PDF p.111, block 1277 -->

Die eigentliche Fehlererkennung und -korrektur erfolgt durch die IP-Hardware. Software kann die zugehörigen Informationen auslesen.

<!-- Source EN PDF p.111, block 1278 -->

#### 7.5.1 Konfiguration

<!-- Source EN PDF p.111, block 1279 -->

Aktivieren Sie das DDR-ECC-Modul in hal_conf.h des Projekts. Für RK3568 ergänzen Sie beispielsweise folgenden Code in project/rk3568/src/hal_conf.h.

<!-- Source EN PDF p.111, block 1280 -->

```text
#define HAL_DDR_ECC_MODULE_ENABLED
```

<!-- Source EN PDF p.111, block 1281 -->

#### 7.5.2 Code und API

<!-- Source EN PDF p.111, block 1282 -->

```text
lib/hal/src/hal_ddr_ecc.c
```

<!-- Source EN PDF p.111, block 1283 -->

```text
lib/hal/inc/hal_ddr_ecc.h
```

<!-- Source EN PDF p.111, block 1284 -->

```text
/* Initialize DDR ECC related information */
HAL_Status HAL_DDR_ECC_Init(struct DDR_ECC_CNT *p);
/*
 * Get cumulative statistical information of DDR ECC, including the number of single-bit
 * correctable errors and double-bit detectable but uncorrectable errors
 */
HAL_Status HAL_DDR_ECC_GetInfo(struct DDR_ECC_CNT *p);
```

<!-- Source EN PDF p.111, block 1285 -->

#### 7.5.3 Anwendungsbeispiele

<!-- Source EN PDF p.111, block 1286 -->

Übergeordnete Software kann ECC-Informationen durch Software-Polling oder Hardware-Interrupts abrufen.

<!-- Source EN PDF p.111, block 1287 -->

Software-Polling

<!-- Source EN PDF p.112, block 1288 -->

Beispiel:

<!-- Source EN PDF p.112, block 1289 -->

```text
struct DDR_ECC_CNT eccInfo;
void HAL_DDR_ECC_TEST_POLL(void)
{
    uint32_t cpuID;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) { /* Use a CPU, thread, or other method to
initialize and poll DDR ECC status */
        HAL_DDR_ECC_Init(&eccInfo);
        while (1) { /* After initializing DDR ECC information,
poll to get DDR ECC information */
            HAL_DDR_ECC_GetInfo(&eccInfo); /* Cumulative CE and UE counts are stored
in the eccInfo structure */
            HAL_DelayMs(50);/* Polling interval, or other APIs to let the CPU idle */
        }
    }
}
```

<!-- Source EN PDF p.112, block 1290 -->

Hardware-Interrupts

<!-- Source EN PDF p.112, block 1291 -->

Beispiel:

<!-- Source EN PDF p.112, block 1292 -->

```text
struct DDR_ECC_CNT eccInfo;
void HAL_DDR_ECC_IRQHandler(uint32_t irq)
{
    HAL_DDR_ECC_GetInfo(&eccInfo);
}
void HAL_DDR_ECC_TEST_INT(void)
{
    uint32_t cpuID;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) { /* Use a CPU, thread, or other method to initialize DDR ECC
related */
        HAL_DDR_ECC_Init(&eccInfo);
        HAL_GIC_SetHandler(DDR_ECC_CE_IRQn, HAL_DDR_ECC_IRQHandler); /* Attach CE
interrupt service routine */
        HAL_GIC_SetHandler(DDR_ECC_UE_IRQn, HAL_DDR_ECC_IRQHandler); /* Attach UE
interrupt service routine */
        HAL_GIC_Enable(DDR_ECC_CE_IRQn); /* Enable CE interrupt
service */
        HAL_GIC_Enable(DDR_ECC_UE_IRQn); /* Enable UE interrupt
service */
    }
}
```

<!-- Source EN PDF p.112, block 1293 -->

Bei erkanntem ECC-Fehler werden die erfassten Informationen ausgegeben.

<!-- Source EN PDF p.113, block 1294 -->

```text
# 2 CE (correctable errors) detected
[HAL WARNING] DDR ECC error: CE, 2 errors, the last is in DDR cs 0, Row 0xa0, ChipID
0x0, BankGroup 0x0, Bank 0x5, Col 0x318, Bit position 0x10000000
# 1 UE (uncorrectable error) detected
[HAL ERROR] DDR ECC error: UE, 1 errors, the last is in DDR cs 0, Row 0xa0, ChipID
0x0, bankGroup 0x0, Bank 0x5, Col 0x354
```

<!-- Source EN PDF p.113, block 1295 -->

### 7.6 DDR-ECC-Fehlerinjektion (Data Poison)

<!-- Source EN PDF p.113, block 1296 -->

Zur Funktionsprüfung kann DDR-ECC-Data-Poison aktiviert werden. Schreiben und Lesen einer bestimmten physischen Adresse lösen anschließend DDR-ECC-CE/UE aus.

<!-- Source EN PDF p.113, block 1297 -->

#### 7.6.1 Code und API

<!-- Source EN PDF p.113, block 1298 -->

```text
lib/hal/src/hal_ddr_ecc.c
```

<!-- Source EN PDF p.113, block 1299 -->

```text
lib/hal/inc/hal_ddr_ecc.h
```

<!-- Source EN PDF p.113, block 1300 -->

```text
/* Enable DDR ECC error injection */
HAL_Status HAL_DDR_ECC_PoisonEnable(struct DDR_ECC_CNT *p);
/* Disable DDR ECC error injection */
HAL_Status HAL_DDR_ECC_PoisonDisable(struct DDR_ECC_CNT *p);
```

<!-- Source EN PDF p.113, block 1301 -->

Standardmäßig erzeugt Data Poison erkennbare und korrigierbare Einbitfehler (CE). Zur Umstellung auf

<!-- Source EN PDF p.113, block 1302 -->

erkennbare, aber nicht korrigierbare Doppelbitfehler (UE) ändern Sie Folgendes:

<!-- Source EN PDF p.113, block 1303 -->

```text
static HAL_Status DDR_ECC_SMCPoison(uint32_t eccPoisonEn,
                                    struct DDR_ECC_CNT *priv)
{
    ...
    pShareMemCfg->eccPoisonMode = DDR_ECC_UE_DATA_POISON;
    ...
}
```

<!-- Source EN PDF p.113, block 1304 -->

#### 7.6.2 Anwendungsbeispiel

<!-- Source EN PDF p.113, block 1305 -->

```text
struct DDR_ECC_CNT eccInfo;
void DDR_ECC_PoisonTriger(struct DDR_ECC_CNT *priv)
{
    uint32_t volatile *p = NULL;
    printf("DDR_ECC debug: eccPoisonAddr = 0x%llx\n", priv->eccPoisonAddr);
    if (priv->eccPoisonAddr) {
        p = (uint32_t volatile *)priv->eccPoisonAddr;
        *p = 0x5aa5f00f; /* Write to the DDR ECC data poison physical address */
        HAL_DCACHE_CleanInvalidate(); /* If the address attribute is cacheable, flush Dcache
to ensure the write is successful */
        printf("DDR_ECC debug: %p = 0x%x, reread = 0x%x\n", p, *p, *p);
    }
}
void DDR_ECC_GetInfo(void)
{
    HAL_DDR_ECC_GetInfo(&eccInfo);
}
void HAL_DDR_ECC_TEST_POLL(void)
{
    uint32_t cpuID;
    uint32_t i = 10;
    cpuID = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpuID == 0) {
        HAL_DDR_ECC_Init(&eccInfo);
        HAL_DDR_ECC_PoisonEnable(&eccInfo);/* Enable DDR ECC data poison, the physical
address for data poison will be saved in eccInfo.eccPoisonAddr */
        while (i) {
            DDR_ECC_GetInfo();
            HAL_DelayMs(50);
            i--;
            if (i == 5) {
                DDR_ECC_PoisonTriger(&eccInfo); /* Trigger DDR ECC error */
            }
        }
        HAL_DDR_ECC_PoisonDisable(&eccInfo);
    }
}
```

<!-- Source EN PDF p.114, block 1307 -->

### 7.7 Hinweise

<!-- Source EN PDF p.114, block 1308 -->

1\. DDR-ECC verwendet den Speicherbereich [0x100000, 0x1F0000]. Fehlt seine MMU-Abbildung, muss sie ergänzt werden.

<!-- Source EN PDF p.114, block 1309 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
@@ -41,6 +41,8 @@ void MMU_CreateTranslationTable(void)
     // Define dram address space
    ...
+ MMU_TTSection(MMUTable, 0x100000, 0x100000 >> 20, Sect_Normal);
    ...
```

<!-- Source EN PDF p.114, block 1310 -->

2\. Auch der physische Data-Poison-Adressbereich ist möglicherweise nicht in HAL abgebildet. Ergänzen Sie die Abbildung, beispielsweise für 0x13576c20 wie folgt.

<!-- Source EN PDF p.115, block 1311 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/mmu_rk3568.c
@@ -41,6 +41,8 @@ void MMU_CreateTranslationTable(void)
     // Define dram address space
    ...
+ MMU_TTSection(MMUTable, 0x13500000, 0x100000 >> 20, Sect_Normal);
    ...
```

<!-- Source EN PDF p.115, block 1312 -->

3\. DED-ECC löst eine CPU-Data-Abort-Ausnahme aus. HAL behandelt diese standardmäßig nicht. Ergänzen Sie folgende Änderung, wenn DDR-ECC-UE-Informationen ausgegeben werden sollen.

<!-- Source EN PDF p.115, block 1313 -->

```text
--- a/lib/CMSIS/Device/RK3568/Source/Templates/GCC/startup_rk3568.c
+++ b/lib/CMSIS/Device/RK3568/Source/Templates/GCC/startup_rk3568.c
@@ -237,6 +237,7 @@ void Reset_Handler(void)
  *----------------------------------------------------------------------------*/
 void Default_Handler(void)
 {
+ DDR_ECC_GetInfo();
     while(1);
 }
```

{% endraw %}
