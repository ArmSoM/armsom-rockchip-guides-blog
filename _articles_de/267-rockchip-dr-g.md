---
title: "Rockchip Dr.G: Display-Diagnose, Frequenzen und RGA/GPU/VOP-Tests"
description: "Rockchip Dr.G: Display-Diagnose, Frequenzen und RGA/GPU/VOP-Tests"
excerpt: "Rockchip Dr.G: Display-Diagnose, Frequenzen und RGA/GPU/VOP-Tests"
translation_key: "267-rockchip-dr-g"
slug: "267-rockchip-dr-g"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Diese Anleitung folgt der zweisprachigen Quelle Dr.G V1.5 für die aufgeführten Rockchip-Plattformen Android 7.1/8.1/9.0 mit Kernel 4.4. ArmSoM-Boards und neuere BSPs wurden nicht getestet: SoC, Kernel, 32-Bit-Bibliotheken, Werkzeug und Treiber prüfen. Sämtliche Ergebnisse sind Herstellerbeispiele, keine ArmSoM-Messungen. Das zweisprachige PDF verwendet gemeinsame Terminalbilder; alle Sprachen übernehmen diese Originale, ein separater englischer Bildsatz liegt nicht vor. Widersprüche zwischen Befehlen und Beschreibung werden direkt benannt. Siehe [ArmSoM-Dokumentation](https://docs.armsom.org/).

## 1 Hauptfunktionen

Dr.G bündelt Skripte und Anwendungen aus der Display-Diagnose: System- und Protokollerfassung, Frequenz- und Busprioritätsabfragen/-einstellungen, automatische RGA/GPU/VOP-Tests und Protokollanalyse. Nach Lesen der Anleitung lassen sich manche Probleme selbst untersuchen. Protokolle und Systemzustand verringern vorab nötige Rückfragen und Code-Synchronisation zwischen Kunden und Entwicklern.

## 2 Plattformabhängigkeiten

### 2.1 Unterstützte Plattformen

Die Quelle zielt auf Kernel 4.4. Plattformen und Android-Versionen stehen unten; Hilfebefehl:

| SoC | Android |
|---|---|
| RK3368 | 7.1, 8.1, 9.0 |
| RK3288 | 7.1, 8.1, 9.0 |
| RK3399 | 7.1, 8.1, 9.0 |
| RK3328 | 8.1, 9.0 |
| RK3126C | 8.1, 9.0 |
| RK3326 | 8.1, 9.0 |

```sh
dr-g -h
```

![Hilfebefehl (PDF 6)](/docs/rockchip-dr-g/images/bilingual-p006-1.png)

Hilfebefehl (PDF 6)

### 2.2 Android-Abhängigkeiten

Zur Plattformkompatibilität ist Dr.G eine 32-Bit-Binary, empfohlen unter `/system/bin`. Fehlt eine Bibliothek, etwa bei `librga.so not found`, die passende `.so` aus `/vendor/lib/` nach `/system/lib/` kopieren; das Push-Skript der Quelle erledigt dies automatisch.

![librga-Abhängigkeitsfehler (PDF 6)](/docs/rockchip-dr-g/images/bilingual-p006-2.png)

librga-Abhängigkeitsfehler (PDF 6)

### 2.3 Programmarchive

| Archive | Android |
|---|---|
| `dr-g-release_for_Android_7.1_v1.5.tar.gz` | 7.1 |
| `dr-g-release_for_Android_8.1_v1.5.tar.gz` | 8.1 |
| `dr-g-release_for_Android_9.0_v1.5.tar.gz` | 9.0 |

Passendes Archiv entpacken, ADB-Verbindung und `adb root`, `adb remount`, `adb shell` prüfen; anschließend `only_push_dr-g.bat` zur Installation und Diagnose auf dem Zielboard ausführen.

![Installationsskript (PDF 7)](/docs/rockchip-dr-g/images/bilingual-p007-1.png)

Installationsskript (PDF 7)

## 3 Verwendung

### 3.1 Systeminformationen und Protokolle

#### 3.1.1 Befehl

```sh
dr-g -dump-info
```

Erfasst `manifest.xml`, `commit_id.xml`, `build.prop`, `anr_trace`, `logcat`, `dmesg`, I/O-Prioritäten, aktuelle Frequenzen/Spannungen und Maximalfrequenzen von CPU/GPU/DDR, `vop_clk_summary`, Fence-Zustand, `dumpsys SurfaceFlinger` und Prozesse aus `ps`. Erzeugt `/data/dr-g-file/dumpInfo.tar`.

![Beispiel Systeminformationen (PDF 8)](/docs/rockchip-dr-g/images/bilingual-p008-1.png)

Beispiel Systeminformationen (PDF 8)

#### 3.1.2 Skripte

Doppelklick auf `push_and_pull_dr-g.bat` erfasst Informationen und speichert `dumpInfo.tar` in einem zeitbenannten Verzeichnis im aktuellen Pfad. Nur installieren: `only_push_dr-g.bat`; nur Archiv abholen: `only_pull_dr-g.bat`.

![Erfassung mit einem Schritt (PDF 9)](/docs/rockchip-dr-g/images/bilingual-p009-1.png)

Erfassung mit einem Schritt (PDF 9)

### 3.2 Frequenzen abfragen und einstellen

#### 3.2.1 Maximale Leistung

```sh
dr-g -sys-set perf
```

Setzt CPU, GPU und DDR auf Maximalfrequenz, deaktiviert die Temperaturregelung und zeigt Frequenzen zur Leistungsdiagnose. Da die Temperaturregelung abgeschaltet wird, Kühlung in kontrollierter Testumgebung prüfen.

![Maximalfrequenzen (PDF 9)](/docs/rockchip-dr-g/images/bilingual-p009-2.png)

Maximalfrequenzen (PDF 9)

#### 3.2.2 Aktuelle Frequenzen

```sh
dr-g -sys-set info
```

Zeigt aktuelle CPU/GPU/DDR-Frequenzen und Temperaturregelungszustand zur Diagnose.

![Frequenzabfrage (PDF 10)](/docs/rockchip-dr-g/images/bilingual-p010-1.png)

Frequenzabfrage (PDF 10)

#### 3.2.3 GPU-Frequenzstufen

```sh
dr-g -sys-set gpu low
dr-g -sys-set gpu mid
dr-g -sys-set gpu high
```

Zur Untersuchung eines GPU-Engpasses setzen die Befehle CPU und DDR auf Maximalfrequenz und wählen den niedrigen, mittleren oder hohen GPU-Tabelleneintrag zum Vergleich des Anwendungsverhaltens.

![GPU niedrig (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-1.png)

GPU niedrig (PDF 11)

![GPU mittel (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-2.png)

GPU mittel (PDF 11)

![GPU hoch (PDF 11)](/docs/rockchip-dr-g/images/bilingual-p011-3.png)

GPU hoch (PDF 11)

#### 3.2.4 CPU-Frequenzstufen

```sh
dr-g -sys-set cpu low
dr-g -sys-set cpu mid
dr-g -sys-set cpu high
```

Zur Untersuchung eines CPU-Engpasses setzen die Befehle GPU und DDR auf Maximalfrequenz und wählen den niedrigen, mittleren oder hohen CPU-Tabelleneintrag zum Vergleich des Anwendungsverhaltens.

![CPU niedrig (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-1.png)

CPU niedrig (PDF 12)

![CPU mittel (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-2.png)

CPU mittel (PDF 12)

![CPU hoch (PDF 12)](/docs/rockchip-dr-g/images/bilingual-p012-3.png)

CPU hoch (PDF 12)

#### 3.2.5 DDR-Frequenzstufen

```sh
dr-g -sys-set ddr low
dr-g -sys-set ddr mid
dr-g -sys-set ddr high
```

Zur Untersuchung eines DDR-Engpasses setzen die Befehle CPU und GPU auf Maximalfrequenz und wählen den niedrigen, mittleren oder hohen DDR-Tabelleneintrag zum Vergleich des Anwendungsverhaltens.

![DDR niedrig (PDF 13)](/docs/rockchip-dr-g/images/bilingual-p013-1.png)

DDR niedrig (PDF 13)

![DDR mittel (PDF 13)](/docs/rockchip-dr-g/images/bilingual-p013-2.png)

DDR mittel (PDF 13)

![DDR hoch (PDF 14)](/docs/rockchip-dr-g/images/bilingual-p014-1.png)

DDR hoch (PDF 14)

#### 3.2.6 Frequenzregelung wiederherstellen

```sh
dr-g -sys-set reset
```

Stellt die systemseitige CPU/DDR/GPU-Frequenzregelung und Temperaturregelung wieder her.

![Regelung wiederherstellen (PDF 14)](/docs/rockchip-dr-g/images/bilingual-p014-2.png)

Regelung wiederherstellen (PDF 14)

### 3.3 Buspriorität

#### 3.3.1 Abfrage

```sh
dr-g -io-qos get
```

Zeigt Busprioritäten und eine nummerierte name-Tabelle für spätere Einstellungen.

![I/O-Prioritäten (PDF 15)](/docs/rockchip-dr-g/images/bilingual-p015-1.png)

I/O-Prioritäten (PDF 15)

#### 3.3.2 Einstellen

Tabelleneintrag wählen; `pri_num` ist `0~3`. Erfolg: `io_qos set SUCCESS !!!`.

```sh
dr-g -io-qos set
dr-g -io-qos set 4 1
dr-g -io-qos set 1 2
dr-g -io-qos set 0 1
```

Die ersten Beispiele setzen `[4]` auf 1 und `[1]` auf 2. Der dritte Befehl `set 0 1` widerspricht beiden Originalkommentaren „[0] auf 0 setzen“. Beides bleibt erhalten; vor Ausführung mit der Werkzeughilfe abgleichen.

![I/O einstellen (PDF 16)](/docs/rockchip-dr-g/images/bilingual-p016-1.png)

I/O einstellen (PDF 16)

### 3.4 Automatische RGA-Tests

#### 3.4.1 Informationen

```sh
dr-g -rga info
```

Zeigt RGA-Version, Hardwareformate, Skalierungsfaktoren und maximale Ein-/Ausgabeauflösung.

![RGA-Informationen (PDF 16)](/docs/rockchip-dr-g/images/bilingual-p016-2.png)

RGA-Informationen (PDF 16)

#### 3.4.2 Selbsttest

```sh
dr-g -rga test
```

Prüft Konvertierung, Skalierung, Rotation und Komposition unterstützter Formate und vergleicht CRCs mit gespeicherten Werten. Abweichungen wertet die Quelle als Hinweis auf ein RGA-Problem.

![RGA-Selbsttest (PDF 17)](/docs/rockchip-dr-g/images/bilingual-p017-1.png)

RGA-Selbsttest (PDF 17)

#### 3.4.3 Effizienz

```sh
dr-g -rga perf
```

Berechnet anhand von DDR-Frequenz und RGA aclk theoretische Zeiten für 720p, 1080p und 4k und vergleicht sie mit Messzeiten.

![RGA-Effizienz (PDF 17)](/docs/rockchip-dr-g/images/bilingual-p017-2.png)

RGA-Effizienz (PDF 17)

#### 3.4.4 Demo

Parameter wählen RGA-Funktionen; Quell- und Zieldaten liegen im data-Verzeichnis. Die Parameterfolge nach `-rga demo` muss zusammenhängend ohne Leerzeichen sein.

```sh
dr-g -rga demo
dr-g -rga demo sw1280sh720sf0dw1280dh720df0rt2sx0sy0dx0dy0
```

![RGA-Quelldaten (PDF 18)](/docs/rockchip-dr-g/images/bilingual-p018-1.png)

RGA-Quelldaten (PDF 18)

![RGA-Zieldaten (PDF 18)](/docs/rockchip-dr-g/images/bilingual-p018-2.png)

RGA-Zieldaten (PDF 18)

Parametertabellen (Originalschreibweise `alpah` und blit-Werte 105/405 bleiben unverändert; Zahlenbasis wird nicht angenommen):

| alpah | blit | Formula |
|---|---|---|
| bd1 | 105 | `src + dst*(1-alpha)` |
| bd2 | 405 | `src*alpha + dst*(1-alpha)` |

| Parameter | Rotation |
|---|---|
| rt1 | rotate 90 |
| rt2 | rotate180 |
| rt3 | rotate270 |
| rt4 | mirrorH |
| rt5 | mirrorV |

| Parameter | Format |
|---|---|
| sf0 | RGBA8888 |
| sf1 | RGBX8888 |
| sf2 | BGRA8888 |
| sf3 | RGB888 |
| sf4 | RGB565 |
| sf5 | NV12 |
| sf6 | NV21 |
| sf7 | YV12 |
| sf8 | YV21 |
| sf9 | NV16 |
| sf10 | NV61 |
| sf11 | YV16 |
| sf12 | YV61 |

Das Beispiel dreht `/data/in0w1280-h720-rgba8888.bin` um 180° nach `/data/out0w1280-h720-rgba8888.bin`. Raw-Daten zur Ansicht abholen. Der Screenshot zeigt den entsprechenden Pfad `out0w1280-h720-rgba8888.bin`.

![RGA-Ausgabeprotokoll (PDF 19)](/docs/rockchip-dr-g/images/bilingual-p019-1.png)

RGA-Ausgabeprotokoll (PDF 19)

![RGA-Rotationsergebnis (PDF 20)](/docs/rockchip-dr-g/images/bilingual-p020-1.png)

RGA-Rotationsergebnis (PDF 20)

### 3.5 Automatische GPU-Tests

#### 3.5.1 Maximale Last

```sh
dr-g -gpu max-load
dr-g -gpu max-load 100
dr-g -gpu max-load-bg
```

Dauer in Sekunden anhängen: 100 bedeutet 100 Sekunden bei etwa 100% Last für Dauer- oder Systemlasttests. `max-load-bg` läuft im Hintergrund ohne Änderung des Vordergrundbilds; sonst wie `max-load`. Manche Quellzeilen trennen `max-load` zu `max -load`; anhand des zusammenhängenden Beispiels derselben Seite wieder verbunden.

![GPU-Maximallast (PDF 20)](/docs/rockchip-dr-g/images/bilingual-p020-2.png)

GPU-Maximallast (PDF 20)

#### 3.5.2 Maximale Bildrate

```sh
dr-g -gpu max-fps
```

Die Shell zeigt die maximale GPU-Anwendungsbildrate. Die Quelle setzt sie mit der Displayfrequenz gleich und empfiehlt bei deutlicher Abweichung von 60fps eine Konfigurationsprüfung. Das ist der Testkontext der Quelle, keine allgemeine 60Hz-Vorgabe.

![GPU-Maximalbildrate (PDF 21)](/docs/rockchip-dr-g/images/bilingual-p021-1.png)

GPU-Maximalbildrate (PDF 21)

#### 3.5.3 Leistung

```sh
dr-g -sys-set perf
dr-g -gpu perf
```

Vor dem Test CPU/DDR/GPU auf Maximalfrequenz setzen. Test- und Referenzzeit der Plattform werden angezeigt; mehr als 10% Überschreitung deutet laut Quelle auf nicht ausgeschöpfte GPU-Leistung.

![GPU-Leistung (PDF 21)](/docs/rockchip-dr-g/images/bilingual-p021-2.png)

GPU-Leistung (PDF 21)

#### 3.5.4 GLES-Versionen

```sh
dr-g -gpu gles11
```

![GLES 1.1 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-1.png)

GLES 1.1 (PDF 22)

```sh
dr-g -gpu gles20
```

![GLES 2.0 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-2.png)

GLES 2.0 (PDF 22)

```sh
dr-g -gpu gles30
```

![GLES 3.0 (PDF 22)](/docs/rockchip-dr-g/images/bilingual-p022-3.png)

GLES 3.0 (PDF 22)

Die Shell gibt EGL-Informationen für GLES 1.1, 2.0 und 3.0 aus. Im gles11-Absatz steht „GLES1.0 erfolgreich“, im Widerspruch zu Überschrift/Befehl 1.1. Dies ist ein mit tatsächlicher Ausgabe zu prüfender Quellenfehler.

#### 3.5.5 OpenCL

```sh
dr-g -cl
```

Die Quelle setzt `dr-g –cl` mit typografischem Strich; anhand des Terminalbilds zu ASCII `-cl` normalisiert. `OpenCL test OK !` bestätigt den OpenCL-Unterstützungstest der Quelle.

![OpenCL-Test (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-1.png)

OpenCL-Test (PDF 23)

#### 3.5.6 Vulkan

```sh
dr-g -vk info
```

Zeigt Vulkan-Version, unterstützte Erweiterungen und Funktionen.

![Vulkan-Informationen (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-2.png)

Vulkan-Informationen (PDF 23)

```sh
dr-g -vk test
```

Zeichnet ein Dreieck. Sichtbares Dreieck und `vulkan test ok` bestätigen die Treiberumgebung für diesen Test.

![Vulkan-Testergebnis (PDF 23)](/docs/rockchip-dr-g/images/bilingual-p023-3.png)

Vulkan-Testergebnis (PDF 23)

### 3.6 Automatische VOP-Tests

#### 3.6.1 Maximale DDR-Last

```sh
dr-g -vop -c chip-type
```

Konfiguriert VOP und erhöht DDR-Last zur Bildausgabeprüfung unter voreingestellten Bedingungen. `chip-type`: `rk3399`, `rk3326`, `rk3368`, `rk3328`, `rk3288`, `rk3128`, `rk3188`. Diese Liste weicht von §2.1 ab und belegt keine erweiterte Plattformunterstützung.

![VOP-Maximallast (PDF 24)](/docs/rockchip-dr-g/images/bilingual-p024-1.png)

VOP-Maximallast (PDF 24)

#### 3.6.2 VOP demo

Parameter konfigurieren die Ausgabe eines `win_id` zur Display-Diagnose. Syntax und Beispiel:

```sh
dr-g -vop -w <win_id>@<crtc_id>:<src_left>,<src_top>,<src_w>,<src_h>:<dst_left>,<dst_top>,<dst_w>,<dst_h>[#zpos][@<format>]
dr-g -vop -w 0@0:0,0,1536,2048:0,0,1536,2048#1@AR24 -f 1536x2048@AR24
```

![VOP-Quelle (PDF 25)](/docs/rockchip-dr-g/images/bilingual-p025-1.png)

VOP-Quelle (PDF 25)

![VOP-Ziel (PDF 25)](/docs/rockchip-dr-g/images/bilingual-p025-2.png)

VOP-Ziel (PDF 25)

### 3.7 Automatische Protokollanalyse

#### 3.7.1 Aktuelle Protokolle

```sh
dr-g -log-ans
```

Vergleicht logcat mit vorbereiteten Fehlerregeln, warnt bei Treffern und schlägt Änderungen vor. Vorbereitete Regeln ermöglichen direkte Zeilenausgabe und verringern manuelle Suche in komplexen Protokollen.

![Protokollanalyse (PDF 26)](/docs/rockchip-dr-g/images/bilingual-p026-1.png)

Protokollanalyse (PDF 26)

#### 3.7.2 XML-Regeln

`log_id` ist die Regelprotokoll-ID; `match_str` die Vergleichszeichenfolge; `advice` die Empfehlung.

![Originale XML-Regeln (PDF 26)](/docs/rockchip-dr-g/images/bilingual-p026-2.png)

Originale XML-Regeln (PDF 26)

```sh
<collection instructions="This is the rule of log analysis">
<rule>
  <log_id>1</log_id>
  <match_str>Kernel module may not have been loaded</match_str>
  <advice>此报错是由于kernel以module的形式加载mali驱动，且加载失败了，/dev/mali0节点并未被生成。建议：检查/system/lib/module下是否有该模块的.ko文件。或采用build_in的方式编译该驱动。</advice>
</rule>
<rule>
  <log_id>2</log_id>
  <match_str>Runtime and build version of gralloc private structure does not match for handle</match_str>
  <advice>Gralloc版本与预期版本对不上。建议：请同步SDK对应匹配的Gralloc版本。</advice>
</rule>
<rule>
  <log_id>3</log_id>
  <match_str>Failed to set damage region on surface</match_str>
  <advice>此报错多发生在安卓8.1系统，是hwui框架代码，在abandon之后，无返回直接报fatal导致的。可以参考redmine:189373</advice>
</rule>
<rule>
  <log_id>4</log_id>
  <match_str>beginning of crash</match_str>
  <advice>发现有Android Crash信息，可以搜索关键字：beginning of crash定位，查看堆栈</advice>
</rule>
</collection>
```

Screenshot-XML als kopierbarer Text, chinesische advice-Felder bleiben original. Empfehlungen: Mali-Modul prüfen oder fest einbauen; SDK-passendes Gralloc synchronisieren; Android8.1-hwui-fatal nach abandon siehe redmine:189373; beginning of crash für Stack suchen.

{% endraw %}
