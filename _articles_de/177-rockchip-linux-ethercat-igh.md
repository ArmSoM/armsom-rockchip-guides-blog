---
title: "Rockchip EtherCAT IgH: Echtzeitkernel, Masterentwicklung, TSN und Messungen"
description: "Rockchip EtherCAT IgH: Echtzeitkernel, Masterentwicklung, TSN und Messungen — V1.0.3"
excerpt: "Rockchip EtherCAT IgH: Echtzeitkernel, Masterentwicklung, TSN und Messungen"
translation_key: "177-rockchip-linux-ethercat-igh"
slug: "177-rockchip-linux-ethercat-igh"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "industrial"
products: []
tags: [ArmSoM, Rockchip, EtherCAT, TSN, Linux]
---

{% raw %}

Erläuterungen chinesischer Quellkommentare: STMMAC-EtherCAT-Modul aktivieren; CPU-Schlaf oder CONFIG_ARM_PSCI_CPUIDLE deaktivieren; Beispiele isolieren CPU3 bzw. CPU7. gmac0 dient EtherCAT, gmac1 bleibt normales Ethernet. Platzhalter für Toolchain, Architektur, Kernelverzeichnis und Installationspfad ersetzen; main_devices-MAC aus tatsächlichem ifconfig übernehmen. performance aktiviert Messungen. PDOs an das Servohandbuch anpassen, keinen unbekannten Motor starten; die app_run-Schleife misst Extremwerte des Timing-Jitters.

# Rockchip EtherCAT IgH: Echtzeitkernel, Masterentwicklung, TSN und Messungen

Plattformreferenz CN/EN V1.0.3, RK-YH-YF-A18. Quellenbereich: RK3588/Linux5.10; RK3576/Linux6.1; RK3568/Linux5.10 oder4.19; RK3506/Linux6.1. ArmSoM-Ethernet, PHY, BSP und RT-Patches prüfen; keine Hardwareprüfung oder universelle Zusage. ZH nutzt CN-Bilder, EN/RU/DE EN-Bilder. Leistungswerte sind Herstellerbeispiele, keine ArmSoM-Messungen.

Quellenzweifel: alias -p 0 0 ist als Änderung auf1 beschrieben; ec_stmmac.ko wird nach /userdata/ kopiert, insmod nutzt /userdata/ethercat_out/; letzte stmmac-while-Zeile ohne vollständigen Rumpf/Abschluss. Doppelte Diff-Köpfe und Platzhalterpfade sind keine direkt anwendbaren Patches. [] erforderlich/<> optional ist Quellenkonvention. Preempt-RT-Hartechtzeitgarantie ist Quellenbeschreibung, reale Systeme benötigen Worst-Case-Latenzprüfung. Motorsteuerung birgt Bewegungsgefahr; keine Beispiele ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [IgH EtherCAT](https://docs.etherlab.org/ethercat/1.5/doxygen/index.html)

## 1. Überblick

IgH EtherCAT ist ein quelloffener EtherCAT-Master für Linux. Er erstellt ein Linux-Zeichengerät, über das Anwendungen mit dem Mastermodul kommunizieren. Der Entwicklungssatz enthält Userspace-Werkzeuge für Zugriff und Konfiguration der Slaves: Adressen, Buskonfiguration, PDO-Daten, Lesen/Schreiben von SDO-Parametern usw.

![Quellendiagramm](/docs/rockchip-linux-ethercat-igh/assets/en-p005-figure-01.png)

Details: https://docs.etherlab.org/ethercat/1.5/doxygen/index.html

## 2. EtherCAT-IgH-Softwareumgebung

EtherCAT besteht aus Kernel, Treibern, Userspace und Anwendung. Die Quelle stellt vorkompilierte Binärdateien bereit:

| Teil | Vorkompiliert | Dateien | Funktion |
| --- | --- | --- | --- |
| Treiber | Y | phylink.ko,pcs-xpcs.ko, ec_master.ko,ec_stmmac.ko | Echtzeit-Treiberumgebung |
| Userspace | Y | ethercat,libethercat.so | ethercat ist EtherCAT-IgH-Debugwerkzeug, libethercat.so liefert Userspace-Anwendungsschnittstellen |
| EtherCAT-Anwendung | N | libmadht1505ba1.so,rk_test,etc. | Anwendung |

### 2.1 Kernel

EtherCAT IgH benötigt hohe Echtzeitfähigkeit. Preempt-RT ist ein dafür optimierter Linux-Kernel. Die Quelle nennt folgende Vorteile gegenüber einem normalen Kernel:

1. Echtzeit: Zuverlässigere, präzisere Ausführung durch Echtzeit-Schedulingmechanismen mit strengen Zeitvorgaben, für Vorhersagbarkeit und geringe Latenz, etwa Industrieautomatisierung und Robotik.

2. Harte Echtzeit: Die Quelle beschreibt fristgerechten Abschluss ohne Beeinflussung durch andere Tasks/Interrupts als wichtig für strenge Zeitgrenzen, etwa Luft-/Raumfahrt und Medizintechnik. Dies ist die Quellenbeschreibung, keine Garantie für ein konkretes System.

3. Scheduling: Effizientere Algorithmen, etwa prioritätsbasiertes Echtzeit-Scheduling, ermöglichen rechtzeitige Reaktion hochpriorisierter Tasks ohne Störung durch niedrigere Prioritäten.

4. Interrupts: Optimierte Verarbeitung verkürzt die Reaktionszeit auf externe Ereignisse.

5. Timer: Präzisere, konfigurierbare Kernel-Timer ermöglichen Mikrosekundengenauigkeit bei besonders hohen Zeitanforderungen.

6. Echtzeiterweiterungen erlauben die Anpassung des Kernels an Anwendungsanforderungen. Insgesamt beschreibt die Quelle Preempt-RT als präziser, zuverlässiger und für hohe Echtzeitanforderungen geeignet. Rockchip stellt SDK-passende Preempt-RT-Patches bereit.

### 2.2 Userspace

Hauptdateien sind das Werkzeug ethercat und die dynamische Bibliothek libethercat.so mit Userspace-APIs. Quellen: https://gitlab.com/etherlab.org/ethercat/-/tree/master?ref_type=heads . Der Bau erzeugt ethercat, libethercat.so und Beispiele. Vorkompilierte Binärdatei/Bibliothek sind ebenfalls nutzbar.

| Userspace | Funktion | Pfad |
| --- | --- | --- |
| libethercat.so | EtherCAT-Standardimplementierung mit Anwendungsschnittstellen | SDK/external/rk_ethercat_release/ethercat_igh/lib/ |
| ethercat | ethercat ist das EtherCAT-IgH-Debugwerkzeug | SDK/external/rk_ethercat_release/ethercat_igh/bin/ |

### 2.3 Treiber

Treiberteil: ec_master.ko und mehrere von Rockchip optimierte ko-Module.

| Treiber | Funktion |
| --- | --- |
| ec_master.ko | Linux-Kernelmodul für EtherCAT-Master; verwaltet Buskommunikation, Datenaustausch und Master-/Slave-Synchronisation |
| ec_stmmac.ko | stmmac ist der von RK echtzeitoptimierte Ethernet-Treiber |
| pcs-xpcs.ko | EtherCAT-Netzwerkkartenunterstützung |
| phylink.ko | Verwaltet Kommunikation zwischen physischer und Verbindungsschicht sowie Medienparameter und Status |

### 2.4 EtherCAT-IgH-Anwendung

Die Anwendung hängt vom konkreten Servoantrieb ab und ist nicht universell. Rockchips Referenzbeispiel verwendet folgende Komponenten:

| Komponente | Name |
| --- | --- |
| Master | RK3588/RK3576/RK3568-Entwicklungsplatine |
| Slave-Antrieb | Panasonic MADHT1505BA1 |
| Servomotor | Panasonic MDMS012S1U |
| Verbindungskabel | Leistungs- und Encoderkabel |

## 3. EtherCAT IgH kompilieren und bereitstellen

### 3.1 Kernel

#### 3.1.1 Schritt 1: Preempt-RT-Patch

Preempt-RT wählen und Patch gemäß `SDK/docs/Patches/Real-Time-Performance/README.md` anwenden.

#### 3.1.2 Schritt 2: Kernelkonfiguration

 3.1.2.1 Kernel 5.10, Beispiel RK3568

```text
#修改内核配置 把stmmac驱动设置为模块编译
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -202,7 +202,7 @@ CONFIG_R8168=y
 # CONFIG_NET_VENDOR_SILAN is not set
 # CONFIG_NET_VENDOR_SIS is not set
 # CONFIG_NET_VENDOR_SMSC is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_NET_VENDOR_SUN is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_TEHUTI is not set

#把cpu休眠关闭（这⾥也可以通过关闭CONFIG_ARM_PSCI_CPUIDLE来阻⽌cpu休眠）
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
index 778752440303..dba79303e34b 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
@@ -74,7 +74,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                        #cooling-cells = <2>;
                        dynamic-power-coefficient = <187>;
                };
@@ -86,7 +86,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                cpu2: cpu@200 {
@@ -96,7 +96,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                cpu3: cpu@300 {
@@ -106,7 +106,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                idle-states {

#隔离cpu核⼼
--- a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
@@ -13,7 +13,7 @@
        };

        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 root=PARTUUID=614e0000-0000 rw rootwait";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 root=PARTUUID=614e0000-0000 isolcpus=3 nohz_full=3 rw rootwait";
        };

        fiq-debugger {
diff --git a/arch/arm64/configs/rockchip_linux_defconfig b/arch/arm64/configs/rockchip_linux_defconfig
index 1a342fe17a5d..1d3a939659b1 100644
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -649,3 +649,4 @@ CONFIG_RCU_CPU_STALL_TIMEOUT=60
 CONFIG_FUNCTION_TRACER=y
 CONFIG_BLK_DEV_IO_TRACE=y
 CONFIG_LKDTM=y
+CONFIG_NO_HZ_FULL=y
```

 3.1.2.2 Kernel 6.1, Beispiel RK3576

```text
#修改内核配置 把stmmac驱动设置为模块编译：
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -197,7 +197,7 @@ CONFIG_R8168=y
 # CONFIG_NET_VENDOR_SILAN is not set
 # CONFIG_NET_VENDOR_SIS is not set
 # CONFIG_NET_VENDOR_SMSC is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_NET_VENDOR_SUN is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_TEHUTI is not set

 --- a/arch/arm64/configs/rockchip_rt.config
+++ b/arch/arm64/configs/rockchip_rt.config
@@ -22,3 +22,4 @@ CONFIG_JUMP_LABEL=y
 CONFIG_HZ_PERIODIC=y
 CONFIG_HZ_1000=y
 CONFIG_PREEMPT_RT=y
+# CONFIG_DEBUG_PREEMPT is not set

#隔离cpu
--- a/arch/arm64/boot/dts/rockchip/rk3576-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3576-linux.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0x2ad40000 console=ttyFIQ0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
+               bootargs = "earlycon=uart8250,mmio32,0x2ad40000 console=ttyFIQ0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 isolcpus=7 nohz_full=7 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
        };

        fiq_debugger: fiq-debugger {
```

 3.1.2.3 Kernel 6.1, RK3506

```text
diff --git a/arch/arm/configs/rk3506_defconfig b/arch/arm/configs/rk3506_defconfig
index e6d3ba608a77..3029973ade8c 100644
--- a/arch/arm/configs/rk3506_defconfig
+++ b/arch/arm/configs/rk3506_defconfig
@@ -2,6 +2,7 @@
 CONFIG_KERNEL_XZ=y
 CONFIG_DEFAULT_HOSTNAME="localhost"
 CONFIG_SYSVIPC=y
+CONFIG_NO_HZ_FULL=y
 CONFIG_NO_HZ=y
 CONFIG_HIGH_RES_TIMERS=y
 CONFIG_PREEMPT=y
@@ -119,12 +120,13 @@ CONFIG_NETDEVICES=y
 # CONFIG_NET_VENDOR_SOLARFLARE is not set
 # CONFIG_NET_VENDOR_SMSC is not set
 # CONFIG_NET_VENDOR_SOCIONEXT is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_DWMAC_GENERIC is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_VIA is not set
 # CONFIG_NET_VENDOR_WIZNET is not set
 # CONFIG_NET_VENDOR_XILINX is not set
+CONFIG_PHYLIB=y
 CONFIG_MOTORCOMM_PHY=y
 CONFIG_PPP=y
 # CONFIG_WLAN is not set
```

 3.1.2.4 Zwei Netzwerkports

Bei zwei GMAC-Ports, einem für EtherCAT-Master und einem für normales Ethernet, folgende Konfiguration verwenden:

```text
gmac0⽤于ethercat，gmac1⽤于默认以太⽹：
    gmac0: ethernet@fe2a0000 {
-       compatible = "rockchip,rk3568-gmac", "snps,dwmac-4.20a";
+       compatible = "rockchip,rk3568-gmac-ethercat", "snps,dwmac-4.20a";
        reg = <0x0 0xfe2a0000 0x0 0x10000>;
```

#### 3.1.3 Schritt 3: Echtzeitkernel bauen

Echtzeitkernel nach rt-linux README.md erzeugen.

### 3.2 Userspace-Teil

Quellbau unter Linux:

```text
#进⼊源码⽬录
cd source

#指定编译链路径（编译链在SDK中有提供）
export PATH=SDK/prebuilts/gcc/linux-x86/(arch)/gcc-arm-10.3-2021.07-x86_64-(arch)-none-linux-gnu/bin:$PATH

#配置,指定内核⽬录，选择SDK下的kernel-6.1或者kernel-5.10，这⾥使⽤kernel-6.1。
./bootstrap
./configure --prefix=（编译后你需要存放的⽬录） --host=(arch)-none-linux-gnu --with-linux-dir=SDK/kernel-6.1 --enable-8139too=no --enable-stmmac=yes --enable-generic=no --enable-wildcards=yes

#编译
make -j8
make install systemdsystemunitdir=（编译后你需要存放的⽬录，和configure命令上的prefix下跟的参数需要⼀
直）

#部署，从你指定的输出⽬录中拷⻉⽂件到开发板上
cp libethercat.so*  /usr/lib/(开发板上)
cp ethercat  /usr/bin/(开发板上)
```

### 3.3 Treiberteil

```text
cp phylink.ko /userdata/(开发板上)  内核编译
cp pcs-xpcs.ko /userdata/(开发板上) 内核编译
cp ec_master.ko /userdata/(开发板上)
cp ec_stmmac.ko /userdata/(开发板上)

#加载驱动
insmod /userdata/phylink.ko
insmod /userdata/pcs-xpcs.ko
insmod /userdata/ec_master.ko main_devices=62:36:B8:01:5B:59（这个是你的⽹⼝的物理地址，可以通过
ifconfig命令查看，如果mac地址没有给对，ethercat ⽆法使⽤）
insmod /userdata/ethercat_out/ec_stmmac.ko

#调整soc为性能模式
echo performance | tee $(find /sys/ -name *governor)
```

Bei Fehlfunktion und ecdev = 0x0 im Protokoll beim Laden der ko-Dateien:

```text
[  585.900540] rk_gmac-dwmac fe1c0000.ethernet: stmmac_dvr_probe: ecdev: 0x0
[  585.927904] rk_gmac-dwmac fe1c0000.ethernet eth0: Register MEM_TYPE_PAGE_POOL RxQ-0
[  585.931176] rk_gmac-dwmac fe1c0000.ethernet eth0: yt8521_config_init done, phy addr: 0,
chip mode = 0, polling mode = 2
[  585.933386] rk_gmac-dwmac fe1c0000.ethernet eth0: PHY [stmmac-1:00] driver [YT8521
Ethernet] (irq=POLL)
[  585.934039] dwmac4: Master AXI performs any burst length
[  585.934057] rk_gmac-dwmac fe1c0000.ethernet eth0: No Safety Features support found
[  585.934075] rk_gmac-dwmac fe1c0000.ethernet eth0: IEEE 1588-2008 Advanced Timestamp
supported
[  585.934469] rk_gmac-dwmac fe1c0000.ethernet eth0: registered PTP clock
[  585.938567] rk_gmac-dwmac fe1c0000.ethernet eth0: FPE workqueue start
```

Dies deutet auf falsche MAC-Adresse hin; prüfen.

### 3.4 EtherCAT-IgH-Anwendungsteil

Anwendung für den konkreten Servoantrieb schreiben. Dessen Konfigurationsinformationen mit dem oben gebauten EtherCAT-IgH-Werkzeug ermitteln, dann Anwendung entwickeln. Details im nachfolgenden Anwendungsentwicklungsabschnitt.

## 4. EtherCAT-IgH-Werkzeuge

`ethercat --help` zeigt Werkzeuge für Informationen zu angeschlossenen Slaves, hilfreich bei der Masterentwicklung. Nachfolgend häufige Befehle; laut Quellenkonvention sind [] Pflichtparameter, <> optionale Parameter.

```text
#设置别名地址(下⾯的例⼦代表设置位置0的别名修改为1)
ethercat alias -p 0 0

#设置别名地址(下⾯的例⼦代表别名0的别名修改为1)
ethercat alias -a 0 1

#以c语⾔的形式输出pdo信息
ethercat cstruct

#输出识别到的从站
ethercat slaves
0  0(别名)):0（位置）  PREOP  +  MADHT1505BA1

#输出pdo信息
ethercat pdos
```

Weitere Werkzeuge: https://docs.etherlab.org/ethercat/1.5/doxygen/index.html

## 5. Anwendungsentwicklungsreferenz

Masterplatine und Slave verbinden und versorgen, Servomotor an Slave anschließen. Nach Laden des Platinentreibers Kommunikation mit folgenden Befehlen prüfen:

```text
#输出识别到的从站
ethercat slaves

#如果通讯成功，就会显⽰出识别到的从站位置信息，别名和型号，如下：
0  0(别名)):0（位置）  PREOP  +  MADHT1505BA1

#输出pdo信息，这些pdo信息只是默认的，具体要根据需求，参考伺服驱动器⼿册来编写
ethercat pdos

#以c语⾔的形式输出pdo信息
ethercat cstruct
```

Die Grunddaten erlauben eine einfache Anwendung. Siehe `ethercat_igh\examples\dc_user\main.c`. el3102_pdo_entries, el4102_pdos und weitere Beispiel-PDOs durch ethercat-cstruct-Daten ersetzen, um eine grundlegende Initialisierung zu erstellen. Hauptablauf:

![Quellendiagramm](/docs/rockchip-linux-ethercat-igh/assets/en-p015-figure-01.png)

Beispiel eines RK-eigenen Prototyps. Topologie:

![Quellendiagramm](/docs/rockchip-linux-ethercat-igh/assets/en-p016-figure-02.png)

Master per Netzwerkkabel mit MADHT1505BA1 verbinden, diesen mit einem zweiten MADHT1505BA1. Motoren sind über Leistungs- und Encoderkabel mit den Antrieben verbunden. Prototypanwendung hier verfügbar:

```text
SDK/external/rk_ethercat_release/demo
```

Als Referenz für eigene Anwendungen nutzbar. Zusätzlich stehen Motorsteuerungs-UI-Demos zur gemeinsamen Verwendung mit dem obigen Testprogramm bereit. Siehe:

```text
SDK/app/lvgl_demo/motor_demo
```

## 6. TSN

Laut Quelle unterstützen nur RK3576/RK3588 TSN. Treibercode muss folgende Commits enthalten:

```text
commit f6349faa5303de458a0b9dc23eba1baf5d3e2fd1 (HEAD -> last, origin/master, origin/HEAD)
Author: ZiHan Huang <zack.huang@rock-chips.com>
Date:   Tue Jul 22 16:37:07 2025 +0800

    Support dual network ports

    Change-Id: I719e2271d3417c1dc3ba95dca0b0207edfc47615
    Signed-off-by: ZiHan Huang <zack.huang@rock-chips.com>
```

TSN wird in Queue0 nicht unterstützt; Queue1 im Treiber-DTS aktivieren, z.B. arch/arm64/boot/dts/rockchip/rk3576.dtsi:

```text
gmac0: ethernet@2a220000 {
    ...
    gmac0_mtl_rx_setup: rx-queues-config {
        snps,rx-queues-to-use = <2>;
        queue0 {};
        queue1 {};
    };

    gmac0_mtl_tx_setup: tx-queues-config {
        snps,tx-queues-to-use = <2>;
        queue0 {};
        queue1 {};
    };
};
```

Anwendungsänderungen siehe `/demo/ec_master_test_RK3568_MADHT1505BA1.c` im Quellverzeichnis. TSN kann est oder tbs nutzen. est konfiguriert est_qopt: entry ist die Queue-Gate-Liste. gate_mask=0x2 (10), interval=800000 öffnet Queue1 und schließt0 für800us; gate_mask=0x1 (01), interval=200000 schließt1 und öffnet0 für200us. cycle_time ist die Gesamtdauer aller entries und Listenperiode, hier1ms. base_time ist der erste entry-Zeitpunkt; enable=1 aktiviert est. Nach Bedarf einstellen. Bei `est_qopt.base_time = TIMESPEC2NS(wakeupTime) + est_qopt.cycle_time+ 200000` müssen200us entries[1].interval entsprechen: erste Sendung200us nach cycletime-Schlaf, danach periodisch per cycle_time.

```text
 diff --git a/demo/ec_master_test_RK3568_MADHT1505BA1.c b/demo/ec_master_test_RK3568_MADHT1505BA1.c
index 5bd3cef..d2d5559 100644
--- a/demo/ec_master_test_RK3568_MADHT1505BA1.c
+++ b/demo/ec_master_test_RK3568_MADHT1505BA1.c
@@ -22,7 +22,7 @@
 // Application parameters
 // #define FREQUENCY 250
 #define FREQUENCY 1000
-#define CLOCK_TO_USE CLOCK_MONOTONIC
+#define CLOCK_TO_USE CLOCK_REALTIME
 #define MEASURE_TIMING  1
 #define TARGET_VELOCITY        1124000 /*target velocity*/
@@ -418,14 +418,30 @@ void cyclic_task_velocity_mode()
              latency_min_ns = 0, latency_max_ns = 0,
              period_min_ns = 0, period_max_ns = 0,
              exec_min_ns = 0, exec_max_ns = 0;
+
+    ec_est_sched_entry_t est_entries[2];
+    ec_est_qopt_offload_t est_qopt;

     period_max_ns = 0;
     period_min_ns = 0xffffffff;
     latency_max_ns = 0;
     latency_min_ns = 0xffffffff;
+
+    est_entries[0].gate_mask = 0x2;
+    est_entries[0].interval = 800000;
+    est_entries[1].gate_mask = 0x1;
+    est_entries[1].interval = 200000;
+    est_qopt.num_entries = 2;
+    est_qopt.enable = 1;
+    est_qopt.entries = est_entries;
+    est_qopt.cycle_time = TIMESPEC2NS(cycletime);

     clock_gettime(CLOCK_TO_USE, &lastStartTime);
     clock_gettime(CLOCK_TO_USE, &wakeupTime);
+
+    est_qopt.base_time = TIMESPEC2NS(wakeupTime) + est_qopt.cycle_time + 200000;
+    ecrt_master_set_est(master, &est_qopt);
+
     while(app_run) {
         wakeupTime = timespec_add(wakeupTime, cycletime);
         clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);
```

tbs nutzt tbs_qopt: enable=1 aktiviert die Funktion, queue=1 für Queue1. Gesendet wird zum von ecrt_master_application_time gesetzten app-Zeitpunkt. In `ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime) + 200000)` bedeutet200us Sendung nach200us und ist anpassbar. Nach jedem zyklischen Schlaf die Zeit setzen, um periodisch zu senden.

```text
 diff --git a/demo/ec_master_test_RK3568_MADHT1505BA1.c b/demo/ec_master_test_RK3568_MADHT1505BA1.c
index 5bd3cef..46b3588 100644
--- a/demo/ec_master_test_RK3568_MADHT1505BA1.c
+++ b/demo/ec_master_test_RK3568_MADHT1505BA1.c
@@ -22,7 +22,7 @@
 // Application parameters
 // #define FREQUENCY 250
 #define FREQUENCY 1000
-#define CLOCK_TO_USE CLOCK_MONOTONIC
+#define CLOCK_TO_USE CLOCK_REALTIME
 #define MEASURE_TIMING  1
 #define TARGET_VELOCITY        1124000 /*target velocity*/
@@ -419,13 +419,21 @@ void cyclic_task_velocity_mode()
              period_min_ns = 0, period_max_ns = 0,
              exec_min_ns = 0, exec_max_ns = 0;

+    ec_tbs_qopt_offload_t tbs_qopt;
+
     period_max_ns = 0;
     period_min_ns = 0xffffffff;
     latency_max_ns = 0;
     latency_min_ns = 0xffffffff;
+
+    tbs_qopt.enable = 1;
+    tbs_qopt.queue = 1;

     clock_gettime(CLOCK_TO_USE, &lastStartTime);
     clock_gettime(CLOCK_TO_USE, &wakeupTime);
+
+    ecrt_master_set_tbs(master, &tbs_qopt);
+
     while(app_run) {
         wakeupTime = timespec_add(wakeupTime, cycletime);
         clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);
@@ -435,7 +443,7 @@ void cyclic_task_velocity_mode()
         // It is a good idea to use the target time (not the measured time) as
         // application time, because it is more stable.
         //
-        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime));
+        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime) + 200000);

         /*Receive process data*/
         ecrt_master_receive(master);
```

Außerdem Systemzeit mit GMAC-PTP-Zeit synchronisieren; im folgenden Befehl steht ptp0 für gmac0.

```text
phc2sys -s /dev/ptp0 -c CLOCK_REALTIME -O 0
```

## 7. Leistungsdaten

### 7.1 Testmethode

`cyclic_task_velocity_mode` in `SDK/external/rk_ethercat_release/demo/ec_master_test_RK3568_MADHT1505BA1.c` erfasst maximale/minimale Zyklusdauer:

```text
static int clean_cycle = 0;//5 * 60 * FREQUENCY;
void cyclic_task_velocity_mode()
{
    static unsigned int timeout_error = 0;
    struct timespec wakeupTime, time;
    uint16_t    status;
    int8_t      opmode;
    int32_t     cur_velocity;
    bool        print = false;

    struct timespec startTime, endTime, lastStartTime = {};
    uint32_t period_ns = 0, exec_ns = 0, latency_ns = 0,
             latency_min_ns = 0, latency_max_ns = 0,
             period_min_ns = 0, period_max_ns = 0,
             exec_min_ns = 0, exec_max_ns = 0;

    period_max_ns = 0;
    period_min_ns = 0xffffffff;
    latency_max_ns = 0;
    latency_min_ns = 0xffffffff;

    clock_gettime(CLOCK_TO_USE, &lastStartTime);
    clock_gettime(CLOCK_TO_USE, &wakeupTime);
    while(app_run) {//这⾥会⼀直在循环
        wakeupTime = timespec_add(wakeupTime, cycletime);
        clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);

        // Write application time to master
        //
        // It is a good idea to use the target time (not the measured time) as
        // application time, because it is more stable.
        //
        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime));

        /*Receive process data*/
        ecrt_master_receive(master);
        ecrt_domain_process(domain);
        // check process data state (optional)
        check_domain_state();

        if (counter) {
            counter--;
        }else {
            counter = FREQUENCY;
            check_master_state();
            check_slave_config_states();
            /*Check process data state(optional)*/

            EC_WRITE_U16(domain_pd + control_word, 0x80);
            // EC_WRITE_U8(domain_pd + modes_of_operation, 9);
            /*Read inputs*/
            status = EC_READ_U16(domain_pd + status_word);
            opmode = EC_READ_U8(domain_pd + modes_of_operation_display);
            cur_velocity = EC_READ_S32(domain_pd + current_velocity);
            printf_debug("madht:  act velocity = %d ,  status = 0x%x, opmode = 0x%x\n",
cur_velocity,  status, opmode);
            if( (status & 0x004f) == 0x0040) {
                printf_debug("0x06\n");
                EC_WRITE_U16(domain_pd + control_word, 0x0006);
                EC_WRITE_U8(domain_pd + modes_of_operation, 9);
            }

            else if( (status & 0x006f) == 0x0021) {
                printf_debug("0x07\n");
                EC_WRITE_U16(domain_pd + control_word, 0x0007);
            }

            else if( (status & 0x006f) == 0x0023) {
                printf_debug("0x0f\n");
                EC_WRITE_U16(domain_pd + control_word, 0x000f);
                EC_WRITE_S32(domain_pd + target_velocity, TARGET_VELOCITY);
            }

            //operation enabled
            else if( (status & 0x006f) == 0x0027) {
                printf_debug("0x1f\n");
                EC_WRITE_U16(domain_pd + control_word, 0x001f);
            }
        }

        clock_gettime(CLOCK_TO_USE, &time);
        ecrt_master_sync_reference_clock_to(master, TIMESPEC2NS(time));
        ecrt_master_sync_slave_clocks(master);
        // send process data
        ecrt_domain_queue(domain);
        ecrt_master_send(master);

        clock_gettime(CLOCK_TO_USE, &startTime);
        latency_ns = DIFF_NS(wakeupTime, startTime);
        period_ns = DIFF_NS(lastStartTime, startTime);
        //exec_ns = DIFF_NS(lastStartTime, endTime);
    /* clean */
        if (clean_cycle >= (5 * 60 * 1000)) {
            clean_cycle = 0;
            period_max_ns = 0;
            period_min_ns = 0xffffffff;
            latency_max_ns = 0;
            latency_min_ns = 0xffffffff;
        }

//计算抖动最⼤最⼩值
        if (latency_ns > latency_max_ns) {
            latency_max_ns = latency_ns;
        }
        if (latency_ns < latency_min_ns) {
            latency_min_ns = latency_ns;
        }

        if (period_ns > period_max_ns) {
            period_max_ns = period_ns;
            print = true;
        }
        if (period_ns < period_min_ns) {
            period_min_ns = period_ns;
            print = true;
        }

        clean_cycle++;
        lastStartTime = startTime;
        // output timing stats
        if (print) {
            printf("period     %10u ... %10u\n",
                    period_min_ns, period_max_ns);
        //printf("exec       %10u ... %10u\n",
        //        exec_min_ns, exec_max_ns);
        printf("latency    %10u ... %10u\n",
                latency_min_ns, latency_max_ns);
        }
        print = false;
    }
}
```

Bei1ms-Periode ist maximaler Jitter Maximum minus Minimum und bewertet die Master-Echtzeitfähigkeit. TSN steuert Hardware-Queue-Zeit: Die tx-Funktion kehrt vor physischer Sendung zurück. Zeitmessung direkt nach der Sendefunktion verursacht daher größere Fehler. Für genaueres Jitter-Logging folgenden Patch in `devices/stmmac/stmmac_main-6.1-ethercat.c` einfügen. txen-Oszilloskopmessung ist genauer und benötigt den Patch nicht.

```text
diff --git a/devices/stmmac/stmmac_main-6.1-ethercat.c b/devices/stmmac/stmmac_main-6.1-ethercat.c
index d04856a..904c1eb 100644
--- a/devices/stmmac/stmmac_main-6.1-ethercat.c
+++ b/devices/stmmac/stmmac_main-6.1-ethercat.c
@@ -4628,6 +4628,11 @@ static netdev_tx_t stmmac_xmit(struct sk_buff *skb, struct net_device *dev)
        if (!priv->ecdev)
                stmmac_tx_timer_arm(priv, queue);

+       if (priv->ecdev && skb->tstamp) {
+               if ((priv->plat->est && priv->plat->est->enable) || (tx_q->tbs & STMMAC_TBS_EN))
+                       while(((readl(priv->ioaddr + 0x0114) & GENMASK(18,17)) >> 17) != 0x3)
+       }
+
        return NETDEV_TX_OK;

 dma_map_err:
```

### 7.2 Testdaten

Quellenmesswerte der Plattformen bei1ms-Regelperiode:

| SoC | Periode | Verzögerungsjitter | Verzögerungsjitter (TSN) |
| --- | --- | --- | --- |
| RK3588 | 1ms | 15us | 1us |
| RK3576 | 1ms | 30us | 1us |
| RK3568 | 1ms | 50us | N/A |
| RK3506 | 1ms | 100us | N/A |

{% endraw %}
