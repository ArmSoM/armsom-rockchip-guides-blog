---
title: "Rockchip Android 11 optimieren: Boot, Leistung, Speicher und Analyse"
description: "Rockchip Android 11 optimieren: Boot, Leistung, Speicher und Analyse — V1.0.0, ART, ZRAM, bootchart, Perfetto"
excerpt: "Rockchip Android 11 optimieren: Boot, Leistung, Speicher und Analyse"
translation_key: "242-rockchip-android11-optimization"
slug: "242-rockchip-android11-optimization"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android11", "optimization", "ART"]
---

{% raw %}

# Rockchip Android 11 optimieren: Boot, Leistung, Speicher und Analyse

Plattformreferenz für ArmSoM mit vollständigem Inhalt des chinesischen Rockchip Android Platform Optimization Guide 1.0.0 (Dokument 290, 10 Seiten). Der Dateiname nennt Android11, Beispiele umfassen aber auch RK3399 Android7.1/Linux4.4, Linux4.19, Android8.1+ und RK3568; kein einheitlicher BSP-Patchsatz. Englisch, Russisch und Deutsch übersetzen die einzige chinesische Quelle. Sie enthält keine technischen Abbildungen; keine wurden erfunden. Keine Hardwaretests auf ArmSoM oder anderen Platinen; Zeiten, Benchmarkwerte und Speicherangaben sind Quellbeispiele.

## Geltungsbereich und Quellenhinweise

- Keine englische Ausgabe zum Abgleich. Kernel, Governor, DTS, init-Syntax, ART und SDK jedes Altbeispiels prüfen; andere BSPs besitzen die Knoten möglicherweise nicht. In Produktion weder AVB abschalten noch SELinux für Leistung schwächen. Für CTS verlangt die Quelle ftrace. Treiber nur bei nicht vorhandener Hardware entfernen; asynchrone Initialisierung/.ko benötigt Abhängigkeits- und Reihenfolgeprüfung.
- Höherer Touch-Boost-Takt und geringere target_loads verändern Energieverbrauch und Wärme. Pinner belegt nicht zurückgewinnbaren Speicher; bei wenig DDR vorsichtig sein. „Ein Kern“ im Vergleich zu RK3399 big/LITTLE ist mehrdeutig: CPU-Policy-Topologie prüfen, nicht einen Cluster mit einem physischen Kern gleichsetzen.
- file_contexts/genfs_contexts sind ohne Prüfung von Dateisystem und Labelmechanismus nicht austauschbar. 32-Bit muss App-ABI, Zertifizierung und Produktanforderungen erfüllen.
- ART-Text nennt speed-profile, Kommentare zu PRODUCT_DEXPREOPT_SPEED_APPS/PRODUCT_SYSTEM_SERVER_APPS dagegen speed. Nicht gleichsetzen. `TARGET_ARCH_VARIANT := armv8-2a` bleibt erhalten; SDK-Unterstützung prüfen.
- Alle vier Tabellen sind Quellbeispiele, keine kontrollierten A/B-Tests. Bei Pinner ändert sich auch Android. Honor of Kings 1.9G: etwa 1:44→1:31; FilesGoogle bei DDR3G/630MHz: 2000ms→1100ms; 1GB-Optimierung nach einer Minute Leerlauf: 320MB→450M. Keine erfundene Messmethodik oder Erfolgsgarantie.
- Kommentare/Commits bleiben erhalten; zwei seitenübergreifende Patches wurden zusammengefügt und PDF-Umbrüche repariert. `...`, `do_something`, `xxxxx` sind Platzhalter, keine fertigen Patches. Erklärung im bootchart-Block wurde herausgenommen und übersetzt. Keine Flash-, Systemänderungs- oder monkey-Tests ausgeführt.

## 1. U-Boot

Nicht benötigte U-Boot-Funktionen entfernen, um die Ladezeit zu verkürzen. Die Quelle schlägt außerdem weniger serielle loader-/U-Boot-Logs und bei entsprechendem Bedarf Abschalten der AVB-Prüfung vor. Folgende Optionen aktivieren AVB. Abschalten schwächt die Verified-Boot-Vertrauenskette; keine Empfehlung für Produktions- oder zertifizierte Geräte.

```text
CONFIG_ANDROID_AVB=y
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
```

## 2. Kernel

### Bootzeit optimieren

#### Vorbereitung: Kernelstart messen

Beginn bei der ersten Kernelmeldung:

```text
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
```

Ende beim Abschluss des Kernel-Ladens:

```text
[    1.259604] Freeing unused kernel memory: 3136K
```

Der Abstand der Meldungen nähert die Kernelstartzeit an. Standardmäßig verringert `CONFIG_RK_CONSOLE_THREAD` den Einfluss serieller Ausgabe; Zeitstempel sind deshalb nicht 100% exakt, zeigen aber die Gesamtdauer.

#### Treiberinitialisierung messen

`initcall_debug` in bootargs ergänzen. Dieser RK3568-Patch aktiviert die Diagnose:

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3568-android.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 initcall_debug loglevel=8";
        };
```

#### Langsame Treiber finden und optimieren

Zwei Möglichkeiten zum Entfernen eines Moduls:

1. Kernel-config deaktivieren. Für Module ohne DTS-Knoten, etwa manche Debug-Funktionen, ist dies die einzige Möglichkeit.

2. DTS-Knoten deaktivieren. Entfernen der config verkürzt Initialisierung und Kernelgröße, verhindert jedoch die Nutzung desselben Kernels für verschiedene Hardware mittels verschiedener Device Trees. Wird ein Modul sicher nie gebraucht, kann es aus dem Build entfallen. Folgende initcall-Logs zeigen langsame Treiber.

```text
[    3.723183] initcall rknand_driver_init+0x0/0x40 returned -1 after 2261968 usecs
```

NAND benötigt etwa 2.2s. Ohne NAND-Bedarf `CONFIG_RK_NAND` entfernen.

```text
[    3.212658] ov5695 4-0036-1: Unexpected sensor id(000000),ret(-5)
[    3.213655] probe of 4-0036-1 returned 0 after 599822 usecs

... ...

[    3.052600] gc8034 4-0037: gc8034 read reg:0xf0 failed !
[    3.852833] gc8034 4-0037: gc8034 read reg:0xf1 failed !
[    3.852874] gc8034 4-0037: Unexpected sensor id(000000), ret(-6)
[    3.853169] probe of 4-0037 returned 0 after 1598844 usecs
```

ID-Lesen von ov5695 und gc8034 schlägt fehl. Sind diese Sensoren nicht verbaut, `CONFIG_VIDEO_GC8034` und `CONFIG_VIDEO_OV5695` entfernen oder DTS-Knoten deaktivieren.

```text
[    0.412736] calling  tracer_init_tracefs+0x0/0x1d4 @ 1
[    0.524499] initcall tracer_init_tracefs+0x0/0x1d4 returned 0 after 109063 usecs
```

Dies entspricht `CONFIG_TRACING`. Tracing unterstützt Leistungsdiagnose, vergrößert jedoch Image und Initialisierungszeit. Die Quelle schlägt Entfernen von `CONFIG_FTRACE` und `CONFIG_TRACING` in Auslieferungsbuilds vor, wodurch auch andere Module schneller starten können. Für CTS-Nutzer gilt jedoch die folgende Warnung. Linux 4.19 benötigt danach diesen Patch gegen Buildfehler:

```text
diff --git a/drivers/staging/android/ion/ion_trace.h b/drivers/staging/android/ion/ion_trace.h
index 8233691a73eb..4ac3c3786448 100644
--- a/drivers/staging/android/ion/ion_trace.h
+++ b/drivers/staging/android/ion/ion_trace.h
@@ -14,6 +14,7 @@
 #include <linux/tracepoint.h>

 #ifndef __ION_PTR_TO_HASHVAL
+#ifdef CONFIG_FTRACE
 static unsigned int __ion_ptr_to_hash(const void *ptr)
 {
        unsigned long hashval;
@@ -24,6 +25,7 @@ static unsigned int __ion_ptr_to_hash(const void *ptr)
        /* The hashed value is only 32-bit */
        return (unsigned int)hashval;
 }
+#endif
```

Warnung: Für CTS ftrace nicht verändern. Entfernen verhindert systrace und verwandte Funktionen und verursacht CTS-Fehler.

Kernelanpassungen auf die tatsächliche Hardware abstimmen; die Beispiele betreffen optionale Module. Für erforderliche, aber langsame Module zwei Ansätze prüfen.

1. Aufwendige Vorgänge in Linux-work-Aufgaben parallel ausführen, ohne die Treiberinitialisierung zu blockieren.

2. Laden des Treibers als `.ko`-Modul prüfen.

### Leistung optimieren

### Touch boost

Touch-/Mausaktivität erhöht den CPU-Takt. Standardwerte vermeiden meist den Höchsttakt zugunsten des Energie-Leistungs-Ausgleichs. Bei latenzkritischen Aufgaben schlägt die Quelle den jeweiligen Höchsttakt vor; Beispiel RK3399 Linux 4.4. Zuerst Temperatur- und Leistungsgrenzen prüfen.

```text
diff --git a/drivers/cpufreq/cpufreq_interactive.c b/drivers/cpufreq/cpufreq_interactive.c
index 7a627216ac39..cad6026da0f5 100644
--- a/drivers/cpufreq/cpufreq_interactive.c
+++ b/drivers/cpufreq/cpufreq_interactive.c
@@ -1329,9 +1329,9 @@ static void rockchip_cpufreq_policy_init(struct cpufreq_policy *policy)
        if (policy->cpu == 0) {
                tunables->hispeed_freq = 1008000;
                tunables->touchboostpulse_duration_val = 500 * USEC_PER_MSEC;
-               tunables->touchboost_freq = 1200000;
+               tunables->touchboost_freq = 1416000;
        } else {
-               tunables->hispeed_freq = 816000;
+               tunables->hispeed_freq = 1800000;
        }

        index = (policy->cpu == 0) ? 0 : 1;
```

RK3399 besitzt große und kleine Kerne, daher zwei Änderungen. Für den in der Quelle beschriebenen Einzelkern-/Einzel-Policy-Fall diesen Zweig ändern:

```text
if (policy->cpu == 0)
```

Die Änderung innerhalb dieses Zweigs vornehmen.

### CPU target_loads

Zusätzlich zum gewählten Governor skaliert Linux nach Last. `target_loads` definiert die Lastschwelle an diesem Knoten:

```text
/sys/devices/system/cpu/cpufreq/policy0/interactive/target_loads
```

Kleinere Werte erleichtern höhere Taktraten. Beschriebener Standard: 90, also Takterhöhung ab 90% Last je Stufe. Niedrigere Werte bevorzugen Reaktion auf Kosten der Energie. Meist sind beide wichtig; dafür Lastziele für mehrere Taktpunkte definieren. Beispiel RK3399 Android 7.1:

```text
commit 0d73bc800b4fdd9a4b5d4a31d521e1e897b107e2
Author: Wenping Zhang <wenping.zhang@rock-chips.com>
Date:   Tue Dec 25 15:21:29 2018 +0800

    change the target_loads of cpu frequence policy for cpuB.

    previous target_loads is 65, which will cause cpu increase to
    high freqence when load is low, so we change the target_loads
    to make sure cpu will transmit to high frequence when cpu load
    is high and make sure cpu will stay in low frequence when load
    is low.

    Change-Id: I3c99039ac79d5915f1186994d7c2f58ffcbdd581
    Signed-off-by: Wenping Zhang <wenping.zhang@rock-chips.com>

diff --git a/init.tablet.rc b/init.tablet.rc
index faac269..8b535ec 100755
--- a/init.tablet.rc
+++ b/init.tablet.rc
@@ -19,7 +19,7 @@ on boot
     write /dev/cpuset/background/cpus 0
     write /dev/cpuset/system-background/cpus 0-3
     write /dev/cpuset/top-app/cpus 0-5
-    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads 65
+    write /sys/devices/system/cpu/cpufreq/policy4/interactive/target_loads "65 1008000:70 1200000:75 1416000:80 1608000:90"
     ioprio rt 4
service lan_bridge_on /system/bin/sh /system/bin/lan_bridge_on.sh
```

Details zu target_loads: `Documentation/cpu-freq/governors.txt` im Kernel.

## 3. Android

### Bootzeit optimieren

`init.rc` unterstützt standardmäßig feste CPU-/DDR-Takte beim Booten; laut Quelle verbessert dies den Start merklich.

Weitere Aktionen in `init.rc` ergänzen:

```text
on early-init
    do_something

on property:sys.boot_completed=1
    do_some_resume
```

### I/O-Effizienz verbessern

Beim Booten entsteht viel sequenzielles I/O. Read-ahead-Tuning kann Durchsatz und Bootzeit verbessern. Das SDK-Beispiel nutzt `mmcblk2` und stark gelesene Partitionen. Tatsächliche Partitionen prüfen und zusätzliche stark gelesene Partitionen entsprechend anpassen.

```text
on late-fs
    # boot time fs tune
    write /sys/block/mmcblk2/queue/iostats 0
    write /sys/block/mmcblk2/queue/read_ahead_kb 2048
    write /sys/block/mmcblk2/queue/nr_requests 256
    write /sys/block/dm-0/queue/read_ahead_kb 2048

on property:sys.boot_completed=1
    # end boot time fs tune
    write /sys/block/mmcblk2/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/nr_requests 128
    write /sys/block/dm-0/queue/read_ahead_kb 128
    write /sys/block/mmcblk2/queue/iostats 1
```

DTS kann die EMMC-Initialisierungsreihenfolge festlegen:

```text
aliases {
    mmc0 = &sdmmc0;
    mmc1 = &sdmmc1;
    mmc2 = &sdhci;
    mmc3 = &sdmmc2;
};
```

#### Ungewöhnliche Dienstwartezeiten prüfen

bootchart mit Bootlogs abgleichen. Läuft eine Aufgabe nur in einem Thread, prüfen, ob sie den Bootablauf blockiert.

### SELinux-Richtlinien optimieren

Die Quelle beschreibt Geräteknoten-Labels über file_contexts oder genfs_contexts und vergleicht sie wie folgt. Die Anwendbarkeit hängt von Dateisystem und Richtlinie ab; sie sind nicht beliebig austauschbar.

1. file_contexts unterstützt reguläre Ausdrücke, ist laut Quelle jedoch langsamer.

2. genfs_contexts unterstützt keine regulären Ausdrücke und wird als schneller beschrieben. Unnötige Wildcards vermeiden und genfs_contexts nur dort einsetzen, wo zulässig, um das Richtlinienladen zu verkürzen.

### Leistung optimieren

### Pinner Service

Android ab 7.1 kann ausgewählte Module im Speicher fixieren und wiederholtes Verdrängen/Nachladen vermeiden. Rockchip Android 11 konfiguriert häufig verwendete Module unter:

```text
vendor/rockchip/common/apps:
RockchipPinnerService
```

Diese App ist ein Overlay-Modul; der Build unterscheidet 32- und 64-Bit automatisch. Zum Aktivieren in `device.mk` ergänzen:

```text
PRODUCT_PACKAGES += RockchipPinnerService
```

1. Für Android 10.0 und älter den APK-Quellcode heranziehen und `config.xml` in frameworks/base direkt ändern; 32-/64-Bit-Dateien selbst zuordnen.

2. Bibliotheksnutzung mit `lsof` prüfen. Die Referenzbibliotheken werden von system_server und anderen Prozessen häufig genutzt, weshalb Fixierung hilft. Blindes Hinzufügen verschwendet Speicher und kann Leistung mindern; auf die Anwendung abstimmen.

3. Fixierung belegt Speicher; auf Geräten mit wenig DDR möglichst vermeiden.

4. Die Quelle berichtet höhere AnTuTu-Werte und empfiehlt die Option bei genügend RAM. Vergleich mit PinnerService auf RK3399 „Excavator“ unten; unterschiedliche Android-Versionen erlauben keine isolierte Aussage zur Wirkung des Dienstes.

| Android-Version | AnTuTu-Wert |
| --- | --- |
| android 10.0 | etwa 13w (130,000) |
| android 11.0 | etwa 14.3w (143,000) |

#### Anwendungsspezifisch optimieren

AOSP-Quellenverweis: https://source.android.com/devices/bootloader/boot-image-profiles

Warnung: Profiländerungen nach nur einem Nutzerszenario können Geräte- und APK-Start verlangsamen.

### 32-Bit-System verwenden

Laut Quelle reagiert 32-Bit-Android bei wenig oder langsamem DDR flüssiger. Nach Prüfung der Plattform- und App-Anforderungen in `BoardConfig.mk` ergänzen:

```text
TARGET_ARCH := arm
TARGET_ARCH_VARIANT := armv8-2a
TARGET_CPU_ABI := armeabi-v7a
TARGET_CPU_ABI2 := armeabi

TARGET_2ND_ARCH :=
TARGET_2ND_ARCH_VARIANT :=
TARGET_2ND_CPU_ABI :=
TARGET_2ND_CPU_ABI2 :=
TARGET_2ND_CPU_VARIANT :=
```

### ART-Kompilierung konfigurieren

Die Quelle schlägt eine Kern-App-Liste und profilgesteuerte `speed-profile`-Kompilierung vor. Die Beispiele wählen jedoch `speed` für gelistete Apps; den Unterschied beachten. Kommentare erläutern Kern-Apps, residente Apps wie SystemUI mit neuer Profilkompilierungsmöglichkeit erst nach Neustart und mögliche Vorteile dauerhafter AOT-Kompilierung. System-Server-Apps verwenden ebenfalls standardmäßig speed.

```text
# ⼀个应⽤列表，⽤于列出哪些应⽤已被确定为产品的核⼼应⽤。
# 添加后将使⽤ speed 编译过滤器对其进⾏编译。
# 注意，常驻应⽤（如 SystemUI）只有在下次系统重新启动时才有机会使⽤配置⽂件引导型编译。
# 因此对于产品来说，让这些应⽤始终采⽤ AOT 编译可能会更好。
PRODUCT_DEXPREOPT_SPEED_APPS += \
    Settings \
    Camera2 \
    ...

# 系统服务器加载的应⽤的列表。这些应⽤将默认使⽤ speed 编译过滤器进⾏编译
PRODUCT_SYSTEM_SERVER_APPS += \
    FilesGoogle \
    Settings \
    ...
```

Quellvergleich der Startzeit vorher/nachher, DDR 3G/630MHz:

| FilesGoogle | Startzeit: am start -S -W |
| --- | --- |
| PRODUCT_DEXPREOPT_SPEED_APPS nicht ergänzt | etwa 2000ms |
| PRODUCT_DEXPREOPT_SPEED_APPS ergänzt | etwa 1100ms |

Laut Quelle wirkt PRODUCT_SYSTEM_SERVER_APPS bei niedrigem DDR-Takt besser mit einem 32-Bit-System.

Andernfalls steigt möglicherweise nur der System-Speicherbedarf ohne deutlichen Nutzen.

#### Kompilierung manuell testen

```text
adb shell cmd package compile -m speed-profile -f com.android.settings
```

#### Compilerthreads und CPU-Affinität

Ab Android 11 ermöglichen Optionen mehrere Compilerthreads auf ausgewählten CPUs:

1. `dalvik.vm.boot-dex2oat-cpu-set`: CPUs für dex2oat während des Bootens.

2. `dalvik.vm.image-dex2oat-cpu-set`: CPUs für dex2oat beim Kompilieren von Boot-Images.

3. `dalvik.vm.dex2oat-cpu-set`: CPUs für dex2oat nach dem Booten.

4. `dalvik.vm.dex2oat-threads`: mehrfädige Kompilierung. Beispiel:

```text
PRODUCT_PRODUCT_PROPERTIES += \
    dalvik.vm.dex2oat-cpu-set=0,1,2,3 \
    dalvik.vm.boot-dex2oat-threads=4 \
    dalvik.vm.dex2oat-threads=4
```

dex2oat-Threadzahl an die Anzahl gewählter CPUs anpassen, um unnötige CPU-/I/O-Konkurrenz zu vermeiden.

Mehrere Threads können die APK-Installation beschleunigen, besonders bei großen APKs. Quellvergleich:

| Honor of Kings (1.9G) | time adb install *.apk |
| --- | --- |
| N/A | etwa 1:44 |
| 4 Threads | etwa 1:31 |

## 4. Geräte mit wenig Speicher optimieren

Für 1GB-Geräte ZRAM besser nutzen und Dateicaches/anonyme Seiten von Hintergrundprozessen regelmäßig zurückgewinnen. Laut Quelle ergibt dies ein brauchbares Speicherniveau für typische 1GB-Szenarien. Folgendes Patcharchiv nach README einspielen.

```text
RKDocs/android/patches/memory_optimization/MemoryReclaim_*.tar.gz
```

| Freier Speicher nach Boot und einer Minute Leerlauf | adb shell dumpsys meminfo |
| --- | --- |
| N/A | etwa 320MB |
| Nach Optimierung | etwa 450M |

Das Archiv enthält Funktionskürzungen; an den Produktbedarf anpassen.

## 5. Analysewerkzeuge

### bootchart

bootchart analysiert Linux-Starts, erfasst Prozessstartzeiten und CPU-/I/O-Nutzung und erzeugt eine Grafik. Auch Android kann es nutzen. Mit folgenden Befehlen manuell aktivieren, aufwendige Dienste finden und Bootzeiten gezielt verbessern; die Quelle erwähnt auch CPU-/ROM-Ressourcen.

```text
adb shell 'touch /data/bootchart/enabled'
adb reboot
# 开机后，pull出相关数据⽂件
adb shell 'tar -czf /sdcard/bootchart.tgz /data/bootchart'
adb pull /sdcard/bootchart.tgz .
bootchart bootchart.tgz -o bootchart.png
```

Die Befehle erzeugen eine Grafik der Dienstressourcen. Alternativ SDK-Skript `./system/extras/boottime_tools/bootanalyze/bootanalyze.py -h` nutzen; `-b` erfasst bootchart.

### CPU-/I/O-Priorität und Startreihenfolge gegen gleichzeitige Lastspitzen

Mit `priority` und `ioprio` in init.rc die CPU-/I/O-Priorität anpassen. Folgendes privilegiertes Quellbeispiel ist kein allgemein sicherer Standard.

```text
service xxxxx /vendor/bin/hw/xxxx
    user root
    group root system
    priority -20
    ioprio rt 0
    writepid /dev/cpuset/foreground/tasks
```

### Speicheranalyse

Android-11-Kernel können dmabuf-Daten zur DMA-Speicheranalyse sammeln:

```text
cat /d/dma_buf/bufinfo
cat /d/dma_buf/bufprocs
```

Das SDK ergänzt eine monkey-Option zur dmabuf-Erfassung bei Speichermangel. Mit folgendem Patch als Referenz monkey für verwertbare Fehlerdaten anpassen.

```text
development:
commit f82c5582bfc5f1fb9fcf46c9716e5f414bf89c84
Author: Bian Jin chen <kenjc.bian@rock-chips.com>
Date:   Fri Apr 2 16:20:38 2021 +0800

    Capture dmabuf info when the device is in low memory.

    Use: monkey ** --dump-dmabuf
    Example: monkey --throttle 200 --ignore-crashes \
            --ignore-timeouts --ignore-security-exceptions --dump-dmabuf -v -v 5000000

    Signed-off-by: Bian Jin chen <kenjc.bian@rock-chips.com>
    Change-Id: Ic0c0629158ef45db2cea4bbe30b9147cf4023363
```

### Traces mit Perfetto erfassen

Android ab 9.0 unterstützt geräteseitige Traces mit anschließendem Kopieren und Browseransicht.

1. System Tracing in den Entwickleroptionen aktivieren. Optional mit Show Quick Setting tile einen Aufnahmeschalter in den Schnelleinstellungen ergänzen.

2. Nach der Aufnahme Trace-Datei mit adb kopieren:

```text
adb pull data/local/traces .
```

3. https://ui.perfetto.dev/#!/ öffnen.

4. Trace-Datei zur Datenanalyse öffnen.

5. Die Quelloption Open with legacy UI zeigt altes systrace-Format. Die Oberfläche kann vom Stand 2021 abweichen.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
