---
title: "Rockchip Linux DPDK: Konfiguration, Tests und Paketweiterleitung"
description: "Rockchip Linux DPDK: Konfiguration, Tests und Paketweiterleitung — V1.0.0"
excerpt: "Rockchip Linux DPDK: Konfiguration, Tests und Paketweiterleitung"
translation_key: "189-rockchip-linux-dpdk"
slug: "189-rockchip-linux-dpdk"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux DPDK: Konfiguration, Tests und Paketweiterleitung

ArmSoM-Plattformreferenz anhand der bereitgestellten chinesischen und englischen Rockchip-Quellen. Konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie einzeln abgleichen; keine allgemeine Unterstützung aller ArmSoM-Platinen. Quellbeispiele und Messwerte sind keine ArmSoM-Tests. Keine Befehle oder Hardwaretests ausgeführt.

Die Quelle nennt RK3588/RK3568/RK3566, Linux 4.19/5.10; Quelltestumgebung: Debian 11 und DPDK 21.11.

Beide Originale V1.0.0; 8 Kapitel, 6 technische Tabellen und Logs erhalten. §6 verweist auf §1.2, der Board-Build steht jedoch in §4.4. Ressourcenangaben wie `PCIe Gen3 x 1 lane` für RK3588S, PHY-Namen und Treiberverhalten anhand konkreter TRM/SDK prüfen; keine belegte Platinenunterstützung. Leistungswerte und 85%-Mehrkernhochrechnung stammen aus der Quelle, nicht aus ArmSoM-Tests. Keine separaten Abbildungen.

## 1. DPDK-Überblick

DPDK (Intel Data Plane Development Kit) ist ein Entwicklungswerkzeugsatz von Intel. Bibliotheken und Treiber ermöglichen effiziente Paketverarbeitung im Userspace auf ARM, X86 und PowerPC. Anders als das universell ausgelegte Linux konzentriert sich DPDK auf leistungsfähige Netzwerkpaketverarbeitung. Laut Quelle ist es unter den meisten Linux-Systemen geprüft und BSD-lizenziert, was eigene Protokollstacks und Anwendungen erleichtert. Leistungsfähige Netzwerkanwendungen lassen sich damit schneller bereitstellen und effizienter betreiben als mit dem üblichen interruptgesteuerten Kernel-Netzwerkstack.

## 2. DPDK-Funktionsprinzip

DPDK optimiert den Paketdurchsatz mit mehreren Techniken; entscheidend sind Kernel-Bypass und Polling Mode Driver (PMD).

- Kernel-Bypass: Ein Userspace-Pfad zwischen Netzwerkkarte und Anwendung umgeht den Kernel. Dadurch entfallen Kontextwechsel beim Übertragen von Frames zwischen Kernel und Userspace sowie der Aufwand des üblichen Netzwerktreibers und Kernel-Netzwerkstacks.
- Polling Mode Driver (PMD): Statt NIC-Interrupts läuft der PMD fortlaufend auf der CPU und fragt die Netzwerkkarte nach neuen Paketen ab.

Weitere Verfahren sind CPU-Affinität, CPU-Isolation, Huge Pages, Cacheline-Ausrichtung und gebündelte Operationen.

## 3. Plattformunterstützung

Rockchip-SoCs unterstützen GMAC/PCIe: bis zu zwei Gigabit-GMAC-Karten sowie PCIe-x1/x2/x4-Karten. Für RK3588 nennt die Quelle bis zu sechs externe Netzwerkkarten: 4 PCIe + 2 GMAC. Die Ressourcen der einzelnen Chips folgen.

### 3.1 RK3566

| Ressource | Modus | SoC-Verbindung | Lane-Aufteilung | DMA-Unterstützung | MMU-Unterstützung |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x<br>1 | Nur RC | Nein | Nein | Nein | Nein |
| GMAC<br>1000M (x2) | RGMII | / | / | / | Ja |

### 3.2 RK3568

| Ressourcen | Modus | SoC-Verbindung | Lane-Aufteilung | DMA-Unterstützung | MMU-Unterstützung |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x<br>1 lane | Nur RC | Nein | Nein | Nein | Nein |
| PCIe Gen3 x<br>2 lane | RC/EP | Ja | 1 lane RC + 1<br>lane RC | Ja | Nein |
| GMAC<br>1000M (x2) | RGMII | / | / | / | Ja |

### 3.3 RK3588

| Ressource | Modus | Lane-Aufteilung | Verfügbarer PHY | Internes DMA |
| --- | --- | --- | --- | --- |
| PCIe Gen3 x 4<br>lane | RC/EP | Ja | pcie30phy | Ja |
| PCIe Gen2 x 1<br>lane (x3) | Nur RC | Nein | pcie30phy,<br>combphy1_ps | Nein |
| GMAC 1000M (x2) | RGMII | / | / | Ja |

### 3.4 RK3588S

| Ressource | Modus | Lane-Aufteilung | Verfügbarer PHY | Internes DMA |
| --- | --- | --- | --- | --- |
| PCIe Gen3 x 1 lane | Nur RC | Nein | combphy2_psu | Nein |
| PCIe Gen2 x 1 lane | Nur RC | Nein | combphy0_ps | Nein |
| GMAC 1000M (x2) | RGMII | / | / | Ja |

## 4. DPDK-Kernelkonfiguration

Hinweis:

- GMAC: Der zum Quellenstand aktuelle SDK unterstützt dies standardmäßig; ältere SDKs benötigen Patches. Siehe external/dpdk/gmac/README.txt im SDK; Patches passend zur Kernelversion anwenden.
- PCIe: Siehe external/dpdk/pcie/README.txt im SDK.

### 4.1 DTS

Für GMAC zunächst den UIO-Knoten im DTS aktivieren; Beispiel RK3568-evb1:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
index 0cb57e9d8529..c7729258e51d 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb1-ddr4-v10.dtsi
@@ -262,6 +262,14 @@
        status = "okay";
 };

+&gmac_uio0 {
+       status = "okay";
+};
+
+&gmac_uio1 {
+       status = "okay";
+};
+
 /*
  * The power-supply should switch to vcc3v3_lcd1_n
  * when the MIPI panel is connected to DSI1.
```

### 4.2 Kernelkonfiguration

In defconfig folgende Optionen aktivieren:

```text
CONFIG_UIO=m
CONFIG_STMMAC_UIO=m
CONFIG_HUGETLBFS=y
```

### 4.3 Kernelmodul (KO) bauen

```text
# Modify according to the actual situation for different platforms
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rockchip_linux_defconfig
# Open the configuration for section 4.2
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 menuconfig
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rk3568-evb1-ddr4-v10-linux.img -j8

# Flash boot.img and push related ko
adb push igb_uio.ko  #Refer to the SDK's external/dpdk/pcie/README.txt
adb push drivers/uio/uio.ko
adb push drivers/net/ethernet/stmicro/stmmac/stmmac_uio.ko
```

### 4.4 DPDK bauen

Die Quelltests verwenden ein Entwicklungsboard mit Debian 11 und DPDK 21.11. Build-Anleitung: http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html

Cross-Compilation auf dem PC:

```text
wget https://developer.arm.com/-/media/Files/downloads/gnu-a/9.2-2019.12/binrel/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz
tar -xvf gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu.tar.xz

export PATH=$PATH:<cross_install_dir>/gcc-arm-9.2-2019.12-x86_64-aarch64-none-linux-gnu/bin

apt install build-essential
apt install pkg-config-aarch64-linux-gnu
apt-get install python3 python3-pip
apt install meson
apt install ninja-build

#Special attention: Modify the name of the compilation chain in the file below to be consistent with the one downloaded and installed. If not, change it to be consistent, otherwise it cannot be compiled!
config/arm/arm64_armv8_linux_gcc

meson aarch64-build-gcc --cross-file config/arm/arm64_armv8_linux_gcc
meson --reconfigure aarch64-build-gcc --cross-file config/arm/arm64_armv8_linux_gcc -Dbuildtype=debug -Dplatform=arm64 -Dexamples=l2fwd,l3fwd
ninja -C aarch64-build-gcc
```

DPDK auf einem Debian-Entwicklungsboard bauen:

```text
apt-get install python3 python3-pip
apt install meson
apt install ninja-build
pip3 install meson ninja
apt-get install libdpkg-perl
apt-get install build-essential
apt-get install python3-pyelftools
apt install libnuma-dev
apt install libpcap-dev

meson setup -Dplatform=generic build
cd build
ninja
ninja install
```

## 5. DPDK ausführen

### 5.1 Huge Pages einrichten

```text
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

### 5.2 KO laden

```text
# Load UIO modules
insmod uio.ko
insmod stmmac_uio.ko  # GMAC
insmod igb_uio.ko     # PCIe

# Load GMAC PMD network card driver
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.0
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.1

# Load PCIe PMD network card driver (replace 0000:01:00.X with actual values)
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.0
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.1
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.2
dpdk/usertools/dpdk-devbind.py -b igb_uio 0000:01:00.3
... ...

# Enable performance mode (ignore any error messages)
echo performance | tee $(find /sys/ -name *governor) /dev/null || true

# Start huge page support
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages

# Start testing, --txpkts=1500 can set the packet size
dpdk-testpmd -l 5,6,7,8 -n 4 -- -i --nb-cores=1 --forward-mode=flowgen --txpkts=1500
```

Nach dem Booten verarbeitet standardmäßig der normale Kernel-Netzwerkstack den Verkehr. Mit insmod stmmac_uio.ko wird auf DPDK umgeschaltet; rmmod des .ko-Moduls stellt die ursprüngliche Kernelverwaltung wieder her. Wechsel zur DPDK-Verwaltung:

```text
// Taking GMAC as an example:
root@linaro-alip:/home/linaro# insmod stmmac_uio.ko
[   41.232761] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-1:00, irq=POLL)
[   41.236447] dwmac4: Master AXI performs any burst length
[   41.236497] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support found
[   41.236886] rockchip_eth_uio_drv fe010000.uio: Registered uio_eth0 uio devices, 3 register maps attached
[   41.241453] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-0:00, irq=POLL)
[   41.257084] dwmac4: Master AXI performs any burst length
[   41.257138] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support found
[   41.257523] rockchip_eth_uio_drv fe2a0000.uio: Registered uio_eth1 uio devices, 3 register maps attached
```

Zur Kernelverwaltung zurückkehren:

```text
// Taking GMAC as an example:
root@linaro-alip:/home/linaro# rmmod stmmac_uio
[ 2200.304636] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-0:00, irq=POLL)
[ 2200.318163] dwmac4: Master AXI performs any burst length
[ 2200.318205] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support found
[ 2200.318227] rk_gmac-dwmac fe2a0000.ethernet eth1: IEEE 1588-2008 Advanced Timestamp supported
[ 2200.318443] rk_gmac-dwmac fe2a0000.ethernet eth1: registered PTP clock
[ 2200.319414] IPv6: ADDRCONF(NETDEV_UP): eth1: link is not ready
[ 2200.322971] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-1:00, irq=POLL)
[ 2200.324883] dwmac4: Master AXI performs any burst length
[ 2200.324921] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support found
[ 2200.324945] rk_gmac-dwmac fe010000.ethernet eth0: IEEE 1588-2008 Advanced Timestamp supported
[ 2200.325468] rk_gmac-dwmac fe010000.ethernet eth0: registered PTP clock
[ 2200.325814] IPv6: ADDRCONF(NETDEV_UP): eth0: link is not ready
[ 2205.385406] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready
```

### 5.3 Performance-Modus setzen

```text
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor
echo performance > /sys/class/devfreq/dmc/governor
#or
echo performance | tee $(find /sys/ -name *governor) /dev/null || true
```

### 5.4 testpmd ausführen

Befehl für den Weiterleitungstest:

- `--vdev=net_stmmac0 --vdev=net_stmmac1`: virtuelle Geräte mit festen Namen; für PCIe nicht erforderlich.
- `--main-lcore=0`: Kern 0 verwaltet, Kerne 2 und 3 leiten Pakete weiter.
- `--iova-mode=pa`: Modus pa, da das Gerät kein IOMMU unterstützt.
- `--`: trennt EAL- und testpmd-Parameter.
- `-i`: interaktiver Modus von dpdk-testpmd.

```text
# Taking GMAC as an example:
root@linaro-alip:/home/linaro# ./dpdk-testpmd  --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -l 0,2,3 --main-lcore=0 -- -i
EAL: Detected CPU lcores: 4
EAL: Detected NUMA nodes: 1
EAL: Detected static linkage of DPDK
EAL: Multi-process socket /var/run/dpdk/rte/mp_socket
EAL: Selected IOVA mode 'PA'
TELEMETRY: No legacy callbacks, legacy socket not created
Interactive-mode selected
Warning: NUMA should be configured manually by using --port-numa-config and --ring-numa-config parameters along with --numa.
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

Weiterleitungstest starten:

```text
testpmd> start
io packet forwarding - ports=2 - cores=1 - streams=2 - NUMA support enabled, MP
allocation mode: native
Logical Core 2 (socket 0) forwards packets on 2 streams:
  RX P=0/Q=0 (socket 0) -> TX P=1/Q=0 (socket 0) peer=02:00:00:00:00:01
  RX P=1/Q=0 (socket 0) -> TX P=0/Q=0 (socket 0) peer=02:00:00:00:00:00

  io packet forwarding packets/burst=32
  nb forwarding cores=1 - nb forwarding ports=2
  port 0: RX queue number: 1 Tx queue number: 1
    Rx offloads=0x0 Tx offloads=0x0
    RX queue: 0
      RX desc=0 - RX free threshold=0
      RX threshold registers: pthresh=0 hthresh=0  wthresh=0
      RX Offloads=0x0
    TX queue: 0
      TX desc=0 - TX free threshold=0
      TX threshold registers: pthresh=0 hthresh=0  wthresh=0
      TX offloads=0x0 - TX RS bit threshold=0
  port 1: RX queue number: 1 Tx queue number: 1
    Rx offloads=0x0 Tx offloads=0x0
    RX queue: 0
      RX desc=0 - RX free threshold=0
      RX threshold registers: pthresh=0 hthresh=0  wthresh=0
      RX Offloads=0x0
    TX queue: 0
      TX desc=0 - TX free threshold=0
      TX threshold registers: pthresh=0 hthresh=0  wthresh=0
      TX offloads=0x0 - TX RS bit threshold=0
```

Weiterleitungsstatistik anzeigen:

```text
testpmd> show port stats all

######################## NIC statistics for port 0  ########################
RX-packets: 5240160    RX-missed: 0          RX-bytes:  314409600
RX-errors: 0
RX-nombuf:  0
TX-packets: 0          TX-errors: 0          TX-bytes:  0

Throughput (since last show)
Rx-pps:            0          Rx-bps:            0
Tx-pps:            0          Tx-bps:            0
############################################################################

######################## NIC statistics for port 1  ########################
RX-packets: 0          RX-missed: 0          RX-bytes:  0
RX-errors: 0
RX-nombuf:  0
TX-packets: 5180224    TX-errors: 0          TX-bytes:  310813440
Throughput (since last show)
Rx-pps:            0          Rx-bps:            0
Tx-pps:            0          Tx-bps:            0
############################################################################
testpmd> show port stats all

######################## NIC statistics for port 0  ########################
RX-packets: 6382336    RX-missed: 0          RX-bytes:  382940160
RX-errors: 0
RX-nombuf:  0
TX-packets: 0          TX-errors: 0          TX-bytes:  0

Throughput (since last show)
Rx-pps:       681809          Rx-bps:    327268480
Tx-pps:            0          Tx-bps:            0
############################################################################

######################## NIC statistics for port 1  ########################
RX-packets: 0          RX-missed: 0          RX-bytes:  0
RX-errors: 0
RX-nombuf:  0
TX-packets: 6322397    TX-errors: 0          TX-bytes:  379343820

Throughput (since last show)
Rx-pps:            0          Rx-bps:            0
Tx-pps:       681810          Tx-bps:    327269160
############################################################################
```

Weitere Parameter:

- `--nb-cores`: Anzahl der Weiterleitungskerne für dpdk-testpmd.
- `--rxd`: Empfangsqueue-Deskriptoren.
- `--txd`: Sendequeue-Deskriptoren.
- `--rxq`: Anzahl der Empfangsqueues; RK3568 hat eine.
- `--txq`: Anzahl der Sendequeues; RK3568 hat eine.

### 5.5 l2fwd ausführen

l2fwd benötigt standardmäßig mindestens zwei Kerne für den Weiterleitungstest.

```text
./dpdk-l2fwd -l 0,2,3  --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -q 1 -p 0x3
```

Die l2fwd-Konsolenausgabe wird alle 10 Sekunden aktualisiert und kann Paketverluste verursachen. Ausgabe möglichst in eine Datei umleiten.

Hinweis: `--vdev=net_stmmac0 --vdev=net_stmmac1` bezeichnet virtuelle Geräte mit festen Namen; für PCIe nicht angeben.

### 5.6 l3fwd ausführen

```text
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -p 0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

Parameter:

- `-p PortMask`: Portmaske.
- `--vdev=net_stmmac0 --vdev=net_stmmac1`: virtuelle Geräte mit festen Namen, für PCIe nicht erforderlich.
- `-P`: alle Ports empfangen im Promiscuous-Modus sämtliche Pakete.
- `--config (port,queue,lcore),[(port,queue,lcore)]`: Zuordnung von Port, Queue und Kern; `--config (0,0,3)` weist Queue 0 von Port 0 Kern 3 zu.

Die Ausgabe zeigt außerdem die Standardrouten von l3fwd:

```text
LPM: Adding route 198.18.0.0 / 24 (0) [net_stmmac0]
LPM: Adding route 198.18.1.0 / 24 (1) [net_stmmac1]
LPM: Adding route 2001:200:: / 64 (0) [net_stmmac0]
LPM: Adding route 2001:200:0:1:: / 64 (1) [net_stmmac1]
```

Pakete mit Ziel-IP in 198.18.0.0/24 werden über Port 0, solche in 198.18.1.0/24 über Port 1 weitergeleitet. Diese Standardrouten sind im Quellcode konfiguriert. Beim l3fwd-Test daher Quell- und Ziel-IP der Testdaten passend setzen.

## 6. Pktgen

Pktgen basiert auf DPDK; vor dem Einsatz auf dem Board DPDK bauen und installieren. Die Quelle verweist hierfür auf Abschnitt 1.2 zum Board-Build; die entsprechende Anleitung steht tatsächlich in §4.4.

### 6.1 pktgen-dpdk-Quellcode herunterladen

```text
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev
apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

### 6.2 DPDK bauen

```text
cd build
ninja
ninja install
ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

### 6.3 Pktgen bauen

```text
cd pktgen-dpdk
meson build
cd build
ninja
```

### 6.4 Pktgen ausführen

```text
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto --log-level debug -- -P -m 7.0
```

EAL-Parameter sind in der DPDK-Dokumentation beschrieben. Hier ist `-l` besonders wichtig: die Kernliste, beispielsweise `-l 1,2` oder `-l 1-2` für Kerne 1 und 2. pktgen benötigt mindestens zwei Kerne; einer bearbeitet die Benutzerinteraktion einschließlich Eingaben während des Tests.

Wichtigster pktgen-eigener Parameter ist `-m` für die Zuordnung von Ports zu Kernen. `-m 2.0` weist Port 0 Kern 2 zu. Für mehrere Karten/Kerne `-m` mehrfach angeben. Für den Empfang empfiehlt die Quelle zusätzlich `-P`: alle Ports empfangen im Promiscuous-Modus sämtliche Pakete.

Paketformat festlegen und Pktgen starten:

```text
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101
set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

## 7. Leistungswerte der Quelle

| Umgebung (ein Kern) | L2-Weiterleitung | L3-Weiterleitung |
| --- | --- | --- |
| RK3588 GMAC + 64 Byte | 650Mbit/s | 530Mbit/s |
| RK3588 GMAC + 1500 Byte | 940Mbit/s | 940Mbit/s |
| RK3588 Intel I210/350 PCIe + 64 Byte | N/A | 737Mbit/s |
| RK3588 Intel I210/350 PCIe + 1500 Byte | 940Mbit/s | 940Mbit/s |
| RK3568 GMAC + 64 Byte | 600Mbit/s | 580Mbit/s |
| RK3568 GMAC + 1500 Byte | 940Mbit/s | 940Mbit/s |

Quellenhinweise:

1. Die Quelle schätzt für mehrere Kerne einen Faktor von 85%: Bei 1000 Mbps für einen Kern ergeben acht Kerne 1000 × 8 × 0.85 = 6.8 Gbit/s. Dies ist eine Quellschätzung, kein ArmSoM-Messwert.

2. N/A: Tatsächliche Testdaten fehlen noch. Laut Quelle ist L2 meist schneller als L3, da keine Routingtabelle durchsucht wird.

## 8. Unterstützte Netzwerkkarten

| Modul | Schnittstelle | Datenrate |
| --- | --- | --- |
| GMAC+PHY | GMII | 1000M |
| Intel I210 | PCIe x1 | 1000M |
| Intel I350 | PCIe x4 | 1000M x4 |
| RTL8111H | PCIe x1 | 1000M |

## Quellverweise

[ArmSoM Docs](https://docs.armsom.org/)

[http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html](http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html)

{% endraw %}
