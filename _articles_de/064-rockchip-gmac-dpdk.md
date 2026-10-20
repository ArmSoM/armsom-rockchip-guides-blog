---
title: "Rockchip GMAC DPDK: RK3568-Build, testpmd, l2fwd, l3fwd und Pktgen"
description: "Vollständige Referenz für RK3568, Linux 4.19+ und DPDK 21.11: Kompilierung, UIO-Umschaltung, Hugepages, Weiterleitungstests und Pktgen-Konfiguration."
translation_key: "064-rockchip-gmac-dpdk"
slug: "064-rockchip-gmac-dpdk"
lang: "de"
date: "2026-10-18"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "Vollständige Referenz für RK3568, Linux 4.19+ und DPDK 21.11: Kompilierung, UIO-Umschaltung, Hugepages, Weiterleitungstests und Pktgen-Konfiguration."
---

{% raw %}

# Rockchip GMAC DPDK: RK3568-Build, testpmd, l2fwd, l3fwd und Pktgen

## Anwendbarkeit auf ArmSoM

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Hardwaretestbericht. Für eine Anpassung müssen die Ethernet-Schnittstelle, der PHY, Stromversorgung, Reset, IOMUX, Referenztakte und das Ziel-SDK/BSP des jeweiligen Boards geprüft werden. Daraus folgt keine Unterstützung auf jedem ArmSoM-Board. Es wurde keine Hardwareprüfung durchgeführt. Sämtliche Protokolle, Durchsatzwerte und Zeitmessungen sind Beispiele aus der Quelle und keine ArmSoM-Messungen.

Die Quelle nennt RK3568, Linux 4.19+ und als Testumgebung Debian 11 mit DPDK 21.11. Beide Ausgaben tragen V1.0.0; die chinesische umfasst 11, die englische 10 Seiten. Die technischen Kapitel entsprechen einander. Die chinesische Fassung folgt ihrer Quelle; die englische, russische und diese deutsche Fassung folgen der englischen Quelle. Keines der Originale enthält technische Abbildungen.

> Unterschied zwischen den Quellen: Das chinesische Build-Ziel lautet rrk3568-evb1-ddr4-v10-linux.img, das englische hingegen rk3568-evb1-ddr4-v10-linux.img. Beide bleiben in ihrer jeweiligen Fassung erhalten; das doppelte r ist vermutlich ein Tippfehler der Quelle. Die Codeblöcke mischen Konfigurations-/Flash-Anweisungen, durch Kommas getrennte adb-push-Beispiele und Platzhalterverzeichnisse und sind daher keine direkt ausführbaren Skripte. Auch policy4/policy6 sowie die Pktgen-Kerne 6/7 müssen angesichts des Vierkern-RK3568 geprüft werden. UIO, insmod/rmmod, Flashen und Verkehrstests können das System verändern oder die Netzwerkverbindung unterbrechen; nichts davon wurde ausgeführt.

[Redaktionelle Hinweise](/docs/rockchip-gmac-dpdk/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/)

## Produktgeltungsbereich der Quelle

| Chipsatz | Kernel-Version |
| --- | --- |
| RK3568 | 4.19+ |

<!-- source: EN PDF p3; unit 0 -->

## 1.   Kompilieren des Codes

<!-- source: EN PDF p3; unit 1 -->

### 1.1   Kernel

<!-- source: EN PDF p3; unit 2 -->

Aktivieren Sie zunächst den UIO-Knoten in DTS anhand des Beispiels RK3568-evb1:

<!-- source: EN PDF p3; unit 3 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi

index 0cb57e9d8529..c7729258e51d 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
@@ -262,6 +262,14 @@
      status = "okay";
 };

+&gmac_uio0 {
+     status = "okay";
+};
+
+&gmac_uio1 {
+     status = "okay";

+};
+
 /*
 * power-supply should switch to vcc3v3_lcd1_n
 * when mipi panel is connected to dsi1.
```

<!-- source: EN PDF p4; unit 4 -->

Kompilieren des Kernel-Moduls (KO)

<!-- source: EN PDF p4; unit 5 -->

```text
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rockchip_linux_defconfig
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 menuconfig, configure CONFIG_UIO=m,
CONFIG_STMMAC_UIO=m, CONFIG_HUGETLBFS=y

make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rk3568-evb1-ddr4-v10-linux.img -j8
Flash boot.img
adb push drivers/uio/uio.ko, adb push drivers/net/ethernet/stmicro/stmmac/stmmac_uio.ko
```

<!-- source: EN PDF p4; unit 6 -->

### 1.2   Kompilieren von DPDK

<!-- source: EN PDF p4; unit 7 -->

Auf dem für die DPDK-Tests verwendeten Entwicklungsboard läuft Debian 11 mit DPDK 21.11. Hinweise zur Kompilierung finden Sie unter http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html

<!-- source: EN PDF p4; unit 8 -->

Cross-Kompilierung auf dem PC

<!-- source: EN PDF p4; unit 9 -->

```text
wget https://developer.arm.com/-/media/Files/downloads/gnu-a/9.2-2019.12/binrel/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz
tar -xvf gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz

export PATH=$PATH:<cross_install_dir>/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu/bin

apt install build-essential
apt install pkg-config-aarch64-linux-gnu
apt-get install python3 python3-pip
apt install meson
apt install ninja-build

meson aarch64-build-gcc --cross-file config/arm/arm64_armv8_linux_gcc
meson --reconfigure aarch64-build-gcc --cross-file config/arm/arm64_armv8_linux_gcc -Dbuildtype=debug -Dplatform=arm64 -Dexamples=l2fwd,l3fwd
ninja -C aarch64-build-gcc
```

<!-- source: EN PDF p4; unit 10 -->

Kompilieren von DPDK auf dem Entwicklungsboard

<!-- source: EN PDF p4; unit 11 -->

```text
apt-get install python3 python3-pip
apt install meson

apt install ninja-build
apt-get install libdpkg-perl
apt-get install build-essential
apt-get install python3-pyelftools

meson -Ddisable_drivers='common/cnxk' build
cd build
ninja
ninja install
```

<!-- source: EN PDF p5; unit 12 -->

## 2.   Ausführen von DPDK-Programmen

<!-- source: EN PDF p5; unit 13 -->

### 2.1   Einhängen von HugePages

<!-- source: EN PDF p5; unit 14 -->

```text
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

<!-- source: EN PDF p5; unit 15 -->

### 2.2   Laden des KO-Moduls

<!-- source: EN PDF p5; unit 16 -->

```text
insmod uio.ko
insmod stmmac_uio.ko
```

<!-- source: EN PDF p5; unit 17 -->

Nach dem Start verwendet der Netzwerkverkehr standardmäßig weiterhin den nativen Netzwerk-Stack des Kernels. Hier erfolgt die Umschaltung zwischen DPDK und dem Kernel-Netzwerk durch Laden und Entfernen des Moduls stmmac_uio.ko mit insmod und rmmod. Nach dem Entladen des KO-Moduls wird also der ursprüngliche Zustand des Kernel-Netzwerks wiederhergestellt.

<!-- source: EN PDF p5; unit 18 -->

Übergabe der Netzwerksteuerung an DPDK:

<!-- source: EN PDF p5; unit 19 -->

```text
root@linaro-alip:/home/linaro# insmod stmmac_uio.ko
[  41.232761] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]

(mii_bus:phy_addr=stmmac-1:00, irq=POLL)
[  41.236447] dwmac4: Master AXI performs any burst length
[  41.236497] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support found
[  41.236886] rockchip_eth_uio_drv fe010000.uio: Registered uio_eth0 uio devices, 3
register maps attached
[  41.241453] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-0:00, irq=POLL)
[  41.257084] dwmac4: Master AXI performs any burst length
[  41.257138] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support found
[  41.257523] rockchip_eth_uio_drv fe2a0000.uio: Registered uio_eth1 uio devices, 3
register maps attached
```

<!-- source: EN PDF p5; unit 20 -->

Rückgabe der Netzwerksteuerung an den Kernel:

<!-- source: EN PDF p5; unit 21 -->

```text
root@linaro-alip:/home/linaro# rmmod stmmac_uio
[ 2200.304636] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]

(mii_bus:phy_addr=stmmac-0:00, irq=POLL)
[ 2200.318163] dwmac4: Master AXI performs any burst length
[ 2200.318205] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support found
[ 2200.318227] rk_gmac-dwmac fe2a0000.ethernet eth1: IEEE 1588-2008 Advanced Timestamp
supported
[ 2200.318443] rk_gmac-dwmac fe2a0000.ethernet eth1: registered PTP clock
[ 2200.319414] IPv6: ADDRCONF(NETDEV_UP): eth1: link is not ready
[ 2200.322971] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-1:00, irq=POLL)
[ 2200.324883] dwmac4: Master AXI performs any burst length
[ 2200.324921] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support found
[ 2200.324945] rk_gmac-dwmac fe010000.ethernet eth0: IEEE 1588-2008 Advanced Timestamp
supported
[ 2200.325468] rk_gmac-dwmac fe010000.ethernet eth0: registered PTP clock

[ 2200.325814] IPv6: ADDRCONF(NETDEV_UP): eth0: link is not ready
[ 2205.385406] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready
```

<!-- source: EN PDF p6; unit 22 -->

<!-- source: EN PDF p6; unit 23 -->

### 2.3   Einstellen des Performance-Modus

<!-- source: EN PDF p6; unit 24 -->

```text
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor

echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor
echo performance > /sys/class/devfreq/dmc/governor
```

<!-- source: EN PDF p6; unit 25 -->

### 2.4   Ausführen von testpmd

<!-- source: EN PDF p6; unit 26 -->

Testbefehle für den Weiterleitungsmodus

<!-- source: EN PDF p6; unit 27 -->

--vdev=net_stmmac0 --vdev=net_stmmac1  gibt die virtuellen Geräte an, deren Namen derzeit fest vorgegeben sind.

<!-- source: EN PDF p6; unit 28 -->

--main-lcore=0  bedeutet, dass Kern 0 für die Verwaltung und die Kerne 2 und 3 für die Weiterleitung verwendet werden.

<!-- source: EN PDF p6; unit 29 -->

--iova-mode=pa  setzt iova-mode auf pa, da das Gerät keine iommu unterstützt.

<!-- source: EN PDF p6; unit 30 -->

--  trennt die eal-Parameter von den testpmd-Parametern.

<!-- source: EN PDF p6; unit 31 -->

-i  aktiviert den interaktiven Modus des Befehls dpdk-testpmd.

<!-- source: EN PDF p6; unit 32 -->

```text
root@linaro-alip:/home/linaro# ./dpdk-testpmd --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -l 0,2,3 --main-lcore=0 -- -i

EAL: Detected CPU lcores: 4
EAL: Detected NUMA nodes: 1
EAL: Detected static linkage of DPDK
EAL: Multi-process socket /var/run/dpdk/rte/mp_socket
EAL: Selected IOVA mode 'PA'
TELEMETRY: No legacy callbacks, legacy socket not created
Interactive-mode selected
Warning: NUMA should be configured manually by using --port-numa-config and --ring-numa-
config parameters along with --numa.
testpmd: create a new mbuf pool <mb_pool_0>: n=163456, size=2176, socket=0
testpmd: preferred mempool ops selected: ring_mp_mc
Configuring Port 0 (socket 0)
stmmac_net: stmmac_eth_link_update()Port (0) link is Up

Port 0: BA:A0:3F:FD:B2:8C
Configuring Port 1 (socket 0)
stmmac_net: stmmac_eth_link_update()Port (1) link is Up
Port 1: B6:A0:3F:FD:B2:8C
Checking link statuses...
stmmac_net: stmmac_eth_link_update()Port (0) link is Up
stmmac_net: stmmac_eth_link_update()Port (1) link is Up
Done
```

<!-- source: EN PDF p7; unit 33 -->

<!-- source: EN PDF p7; unit 34 -->

Starten des Tests im Weiterleitungsmodus

<!-- source: EN PDF p7; unit 35 -->

```text
testpmd> start
io packet forwarding - ports=2 - cores=1 - streams=2 - NUMA support enabled, MP allocation
mode: native

Logical Core 2 (socket 0) forwards packets on 2 streams:
 RX P=0/Q=0 (socket 0) -> TX P=1/Q=0 (socket 0) peer=02:00:00:00:00:01
 RX P=1/Q=0 (socket 0) -> TX P=0/Q=0 (socket 0) peer=02:00:00:00:00:00

 io packet forwarding packets/burst=32
 nb forwarding cores=1 - nb forwarding ports=2
 port 0: RX queue number: 1 Tx queue number: 1
   Rx offloads=0x0 Tx offloads=0x0
   RX queue: 0
    RX desc=0 - RX free threshold=0
    RX threshold registers: pthresh=0 hthresh=0 wthresh=0
    RX Offloads=0x0
   TX queue: 0

    TX desc=0 - TX free threshold=0
    TX threshold registers: pthresh=0 hthresh=0 wthresh=0
    TX offloads=0x0 - TX RS bit threshold=0
 port 1: RX queue number: 1 Tx queue number: 1
   Rx offloads=0x0 Tx offloads=0x0
   RX queue: 0
    RX desc=0 - RX free threshold=0
    RX threshold registers: pthresh=0 hthresh=0 wthresh=0
    RX Offloads=0x0
   TX queue: 0
    TX desc=0 - TX free threshold=0
    TX threshold registers: pthresh=0 hthresh=0 wthresh=0

    TX offloads=0x0 - TX RS bit threshold=0
```

<!-- source: EN PDF p7; unit 36 -->

Anzeigen der Weiterleitungsdaten:

<!-- source: EN PDF p7; unit 37 -->

```text
testpmd> show port stats all


######################## NIC statistics for port 0 ########################
RX-packets: 5240160 RX-missed: 0 RX-bytes: 314409600
RX-errors: 0
RX-nombuf: 0
TX-packets: 0    TX-errors: 0    TX-bytes: 0

Throughput (since last show)
Rx-pps:       0       Rx-bps:       0
Tx-pps:       0       Tx-bps:       0
############################################################################

######################## NIC statistics for port 1 ########################
RX-packets: 0    RX-missed: 0    RX-bytes: 0

RX-errors: 0
RX-nombuf: 0
TX-packets: 5180224 TX-errors: 0 TX-bytes: 310813440


Throughput (since last show)
Rx-pps:       0       Rx-bps:       0
Tx-pps:       0       Tx-bps:       0
############################################################################
testpmd> show port stats all

######################## NIC statistics for port 0 ########################
RX-packets: 6382336 RX-missed: 0 RX-bytes: 382940160
RX-errors: 0
RX-nombuf: 0
TX-packets: 0    TX-errors: 0    TX-bytes: 0


Throughput (since last show)
Rx-pps:   681809      Rx-bps: 327268480
Tx-pps:       0       Tx-bps:       0
############################################################################

######################## NIC statistics for port 1 ########################
RX-packets: 0    RX-missed: 0    RX-bytes: 0
RX-errors: 0
RX-nombuf: 0
TX-packets: 6322397 TX-errors: 0 TX-bytes: 379343820

Throughput (since last show)
Rx-pps:       0       Rx-bps:       0

Tx-pps:   681810      Tx-bps: 327269160
############################################################################
```

<!-- source: EN PDF p8; unit 38 -->

<!-- source: EN PDF p8; unit 39 -->

Weitere häufig verwendete Einstellungen:

<!-- source: EN PDF p8; unit 40 -->

--nb-cores  gibt die Anzahl der von dpdk-testpmd für die Weiterleitung verwendeten Kerne an.

<!-- source: EN PDF p8; unit 41 -->

--rxd  betrifft die Deskriptoren der Empfangswarteschlange.

<!-- source: EN PDF p8; unit 42 -->

--txd  betrifft die Deskriptoren der Sendewarteschlange.

<!-- source: EN PDF p8; unit 43 -->

--rxq  gibt die Anzahl der Empfangswarteschlangen für dpdk-testpmd an; beim RK3568 beträgt sie 1.

<!-- source: EN PDF p8; unit 44 -->

--txq  gibt die Anzahl der Sendewarteschlangen für dpdk-testpmd an; beim RK3568 beträgt sie 1.

<!-- source: EN PDF p8; unit 45 -->

### 2.5   Ausführen von l2fwd

<!-- source: EN PDF p8; unit 46 -->

l2fwd benötigt standardmäßig mindestens zwei Kerne für den Test der Paketweiterleitung.

<!-- source: EN PDF p8; unit 47 -->

```text
./dpdk-l2fwd -l 0,2,3 --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -q 1 -p 0x3
```

<!-- source: EN PDF p9; unit 48 -->

Die Konsolenausgabe von l2fwd wird alle 10 Sekunden aktualisiert, was Paketverluste verursachen kann. Es wird empfohlen, die Konsolenausgabe in eine Datei umzuleiten.

<!-- source: EN PDF p9; unit 49 -->

### 2.6   Ausführen von l3fwd

<!-- source: EN PDF p9; unit 50 -->

```text
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -p 0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

<!-- source: EN PDF p9; unit 51 -->

Der Parameter -p PortMask legt die Portmaske der verwendeten Netzwerkschnittstellen fest.

<!-- source: EN PDF p9; unit 52 -->

Der Parameter -P versetzt alle Netzwerkschnittstellen in den Promiscuous-Modus, damit sie sämtliche Pakete empfangen.

<!-- source: EN PDF p9; unit 53 -->

Der Parameter --config (port,queue,lcore),[(port,queue,lcore)] konfiguriert die Zuordnung zwischen Netzwerkschnittstellen, Warteschlangen und Kernen. Beispielsweise bedeutet --config (0,0,3), dass Kern 3 die Warteschlange 0 der Netzwerkschnittstelle 0 verarbeitet.

<!-- source: EN PDF p9; unit 54 -->

Die obige Ausgabe zeigt die Standard-Routingregeln von l3fwd, nämlich:

<!-- source: EN PDF p9; unit 55 -->

```text
LPM: Adding route 198.18.0.0 / 24 (0) [net_stmmac0]
LPM: Adding route 198.18.1.0 / 24 (1) [net_stmmac1]

LPM: Adding route 2001:200:: / 64 (0) [net_stmmac0]
LPM: Adding route 2001:200:0:1:: / 64 (1) [net_stmmac1]
```

<!-- source: EN PDF p9; unit 56 -->

Das bedeutet, dass Pakete mit einem Ziel im IP-Bereich 198.18.0.0/24 über Netzwerkschnittstelle 0 und Pakete mit einem Ziel im Bereich 198.18.1.0 / 24 über Netzwerkschnittstelle 1 weitergeleitet werden. Diese Standard-Routingregeln sind im Quellcode konfiguriert. Deshalb müssen beim Test von l3fwd die Ziel- und Quell-IP-Adressen der Testdaten korrekt eingestellt werden.

<!-- source: EN PDF p9; unit 57 -->

## 3.   Pktgen

<!-- source: EN PDF p9; unit 58 -->

Pktgen auf dem Board basiert auf DPDK; deshalb muss DPDK zuerst kompiliert und installiert werden. Siehe dazu Abschnitt 1.2 über das Kompilieren von DPDK für das Entwicklungsboard.

<!-- source: EN PDF p9; unit 59 -->

### 3.1   Herunterladen des pktgen-dpdk-Quellcodes

<!-- source: EN PDF p9; unit 60 -->

```text
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev

apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

<!-- source: EN PDF p10; unit 61 -->

### 3.2   Kompilieren von DPDK

<!-- source: EN PDF p10; unit 62 -->

```text
cd build
ninja
ninja install

ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

<!-- source: EN PDF p10; unit 63 -->

### 3.3   Kompilieren von Pktgen

<!-- source: EN PDF p10; unit 64 -->

```text
cd pktgen-dpdk
meson build

cd build
ninja
```

<!-- source: EN PDF p10; unit 65 -->

### 3.4   Ausführen von Pktgen

<!-- source: EN PDF p10; unit 66 -->

```text
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto --log-level debug -- -P -m 7.0
```

<!-- source: EN PDF p10; unit 67 -->

Für den Abschnitt mit EAL-Optionen können Sie die DPDK-EAL-Parameter heranziehen. Der wichtigste Parameter ist -l; er legt die Liste der zu verwendenden Kerne fest. Beispielsweise wählen -l 1,2 oder -l 1-2 die Kerne 1 und 2 aus.

<!-- source: EN PDF p10; unit 68 -->

Für pktgen müssen mindestens zwei Kerne angegeben werden, da ein Kern für die Benutzerinteraktion benötigt wird, etwa zum Reagieren auf Eingaben während des Tests. Der wichtigste pktgen-eigene Parameter ist -m; er ordnet Netzwerkports den Kernen zu. Beispielsweise bedeutet -m 2.0, dass Kern 2 Netzwerkport 0 verarbeitet. Für mehrere Zuordnungen mit mehreren Netzwerkkarten und Kernen muss -m mehrfach angegeben werden. Sollen Pakete empfangen werden, empfiehlt sich zusätzlich -P, damit sämtliche Netzwerkports im Promiscuous-Modus alle Datenpakete empfangen.

<!-- source: EN PDF p10; unit 69 -->

Paketformat einstellen und Pktgen starten:

<!-- source: EN PDF p10; unit 70 -->

```text
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101

set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

{% endraw %}
