---
title: "RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware"
description: "RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware"
translation_key: "rknn-v250-rk2118-firmware"
slug: "rknn-v250-rk2118-firmware"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Plattformreferenz für RK_EVB1_RK2118G_V20 (RK2118) und das passende RT-Thread SDK. Ein entsprechendes ArmSoM-Board ist nicht bestätigt; die Anleitung nicht direkt auf andere SoCs übertragen. Es werden weder ein geprüfter BSP noch ein Linux-Kernel festgelegt; ArmSoM-Hardwaretests fanden nicht statt.

Quelle: lokale chinesische und englische RKNN2 RK2118 QuickStart V2.5.0; ursprüngliche Abschnittsnummern bleiben erhalten. Chinesisch folgt seiner Quelle, die übrigen Sprachen der englischen. PDF-Zeilenumbrüche in Dateinamen, URLs, Kommentaren und Befehlen wurden zusammengeführt. Abschnitt 5.3 verweist für den RT-Thread-Download auf 3.1; die Schritte stehen tatsächlich in 3.3.1. Docker bindet /rt-thread ein, der spätere Befehl verwendet jedoch den relativen Pfad rt-thread/...; das Arbeitsverzeichnis des Containers prüfen. Diese Abweichung wurde nicht stillschweigend geändert. Protokolle, 45ms und Referenzausgaben stammen aus der Quelle, nicht aus ArmSoM-Tests. Installationsbefehle mit latest oder ohne feste Version garantieren nicht V2.5.0; mit dem tatsächlichen SDK abgleichen.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118-Einstiegsserie · 3/5**

[RK2118 NPU, Teil 1: Hardware, Anschluss und serielle Konsole](/de/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, Teil 2: Host-Umgebung und Toolkit2-Installation](/de/articles/rknn-v250-rk2118-host-environment/)

**RK2118 NPU, Teil 3: RT-Thread und DSP-Firmware**

[RK2118 NPU, Teil 4: Modellkonvertierung, USB-Eingaben und Inferenzergebnisse](/de/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU, Teil 5: Docker, häufige Fragen und Referenzen](/de/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

### 3.3 RK2118 SDK vorbereiten

Das NPU-Beispiel ist im RK2118 SDK enthalten. Deshalb zunächst dessen Quellcode bereitstellen.

#### 3.3.1 Projekt herunterladen

- Das Werkzeug repo herunterladen. Wenn es bereits installiert ist, diesen Schritt überspringen.

```text
git clone ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -b stable
export PATH=/path/to/repo:$PATH
```

- Repository herunterladen:

```text
mkdir rt-thread
cd rt-thread
repo init --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -u ssh://git@www.rockchip.com.cn/rtos/rt-thread/rk/platform/release/manifests -b master -m rk2118.xml
.repo/repo/repo sync
```

Hinweis: Der Zugriff auf dieses Projekt erfordert eine Berechtigung. Diese bei Rockchip beantragen.

#### 3.3.2 Build-Umgebung vorbereiten

Die Entwicklungsumgebung nach Rockchip_Developer_Guide_RK2118_CN.pdf im Verzeichnis rt-thread/Rockchips-docs/manuals/rk2118 einrichten.

#### 3.3.3 RK2118-Firmware bauen

##### 3.3.3.1 RKNPU-Unterstützung aktivieren

Zum Bauen der Firmware und Aktivieren von RKNPU siehe Kapitel 4 „CPU Firmware Compilation“ in Rockchip_Developer_Guide_RK2118_CN.pdf. Zum Hauptverzeichnis des Projekts rt-thread zurückkehren und Folgendes ausführen:

```text
cd bsp/rockchip/rk2118
cp board/evb1_v20/defconfig_npu_demo .config
scons --menuconfig
```

Sicherstellen, dass folgende Optionen aktiviert sind:

```text
RT-Thread Components --->
  [*] DFS: device virtual file system --->
       [*] Using posix-like functions, open/read/write/close
       [*] Using working directory
       (4) The maximal number of mounted file system
       (4) The maximal number of file system type
       (16) The maximal number of opened files
       [*] Using mount table for file system
       [*] Enable elm-chan fatfs
RT-Thread board config --->
  [*] using DRAM, only available for RK2118B or RK2118G
  [*] Enable hifi4 driver
  HIFI4 Project --->
    [*] HIFI4 Projects
    (X) npu Demo
  rknn dsp communication config --->
    [*] Enable rknn dsp demo communication for rk2118
RT-Thread rockchip RK2118 drivers --->
  Enable RKNPU Driver --->
    [*] Enable RKNPU Driver
    (X) RKNPU Driver in DSP
```

Hinweise:

- board/evb1_v20/defconfig_npu_demo enthält bereits alle genannten Optionen. Eine manuelle Konfiguration ist daher normalerweise nicht erforderlich. scons --menuconfig nur zur vorübergehenden Prüfung oder für Experimente verwenden.

- Als Position des NPU-Treibers „RKNPU Driver in DSP“ (RT_USING_RKNPU_DSP_DRIVER) wählen. In diesem SDK führt die NPU-Demo die RKNN-Firmware auf HIFI4 DSP0 aus (components/hifi4/samples/rk2118/npu_demo); CPU0 kommuniziert über rknn_demo_server mit dem DSP. Der direkte CPU-Pfad „RKNPU Driver in RTT“ ist mit dieser Demo nicht kompatibel.

- Nach Auswahl von „npu Demo“ werden die RKNN-DSP-Kommunikationskomponenten automatisch ausgewählt und die DSP-Speicherlayoutdatei components/hifi4/samples/rk2118/npu_demo/mem_layout.h automatisch festgelegt. Eine manuelle Konfiguration ist nicht nötig.

- Bei jedem Aufruf von build.sh wird .config mit der zugehörigen defconfig überschrieben. Dauerhafte Änderungen direkt in board/evb1_v20/defconfig_npu_demo vornehmen.

- Befehl zum Bauen und Verpacken der Firmware dieses Boards: ./build.sh board/evb1_v20/package-file npu_demo

Dadurch entsteht Image/update.img mit den Firmwarepartitionen dsp0, dsp1 und dsp2 für npu_demo.

##### 3.3.3.2 Firmware bauen und verpacken

```text
cd bsp/rockchip/rk2118
./build.sh board/evb1_v20/package-file npu_demo
```

Dieser Befehl erledigt Build und Verpackung in einem Vorgang:

1. .config mit board/evb1_v20/defconfig_npu_demo überschreiben und die CPU0-/CPU1-Firmware bauen.

2. Über mkimage.sh die Dateien dsp0.bin, dsp1.bin und dsp2.bin aus components/hifi4/rtt/dsp_fw/npu_demo/ als DSP-Firmwarepartitionen (Type=0x400) in das Image aufnehmen.

3. Das endgültige Image unter Image/update.img erzeugen.

Hinweise:

- Wurde nur CPU-Code geändert, kann die Firmware mit scons -j32 neu gebaut und anschließend mit ./mkimage.sh board/evb1_v20/package-file npu_demo verpackt werden.

- Wurde das DSP-Projekt geändert, beispielsweise components/hifi4/samples/rk2118/npu_demo/npu_demo_dsp0, zuerst das Xtensa-Projekt neu bauen, um dsp0.bin unter rtt/dsp_fw/npu_demo/ neu zu erzeugen. Erst danach verpacken. Andernfalls enthält das Image weiterhin die alte DSP-Firmware.

- Der Pfad der DSP-Firmwarepartitionen wird über das zweite Argument von mkimage.sh (npu_demo) automatisch aktualisiert. package-file nicht manuell ändern.

##### 3.3.3.3 Firmware flashen

Die Firmware nach Abschnitt 4.1.3.4 „Firmware Burning“ in Rockchip_Developer_Guide_RK2118_CN.pdf auf das Board schreiben. Alternativ update.img mit dem im SDK enthaltenen Upgrade-Werkzeug flashen:

```text
upgrade_tool uf Image/update.img
```

{% endraw %}
