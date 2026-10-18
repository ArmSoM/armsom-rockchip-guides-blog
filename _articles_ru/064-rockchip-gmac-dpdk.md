---
title: "Rockchip GMAC DPDK: сборка для RK3568, testpmd, l2fwd, l3fwd и Pktgen"
description: "Полный материал о RK3568 Linux 4.19+, DPDK 21.11, сборке, переключении UIO, hugepages, тестах пересылки и Pktgen."
translation_key: "064-rockchip-gmac-dpdk"
slug: "064-rockchip-gmac-dpdk"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "Полный материал о RK3568 Linux 4.19+, DPDK 21.11, сборке, переключении UIO, hugepages, тестах пересылки и Pktgen."
---

{% raw %}

# Rockchip GMAC DPDK: сборка для RK3568, testpmd, l2fwd, l3fwd и Pktgen

## Применимость к ArmSoM

Это справочный материал по платформе Rockchip, а не отчёт об испытаниях ArmSoM. Адаптация требует проверки интерфейса Ethernet конкретной платы, PHY, питания, сброса, IOMUX, опорных частот и целевого SDK/BSP. Поддержка всех плат ArmSoM не предполагается. Аппаратная проверка не проводилась. Журналы, пропускная способность и временные результаты взяты из исходника, а не измерены на ArmSoM.

Исходник задаёт RK3568, Linux 4.19+ и тестовую среду Debian 11 с DPDK 21.11. Обе версии — V1.0.0: 11 китайских и 10 английских страниц; технические главы соответствуют друг другу. Китайский текст следует своему оригиналу, английский и русский — английскому. Технических иллюстраций нет.

> Различие исходников: китайская цель сборки — rrk3568-evb1-ddr4-v10-linux.img, английская — rk3568-evb1-ddr4-v10-linux.img. Значения сохранены; двойная r предположительно является опечаткой. Блоки содержат инструкции настройки/прошивки, разделённые запятыми примеры adb push и шаблонные каталоги: это не готовые скрипты. policy4/policy6 и ядра 6/7 Pktgen требуют проверки для четырёхъядерного RK3568. UIO, insmod/rmmod, прошивка и нагрузочные тесты могут менять систему или прерывать сеть; здесь они не выполнялись.

[Редакторский протокол](/docs/rockchip-gmac-dpdk/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)

## Область применения исходника

| Микросхема | Версия ядра |
| --- | --- |
| RK3568 | 4.19+ |

<!-- source: EN PDF p3; unit 0 -->

## 1. Сборка кода

<!-- source: EN PDF p3; unit 1 -->

### 1.1 Ядро

<!-- source: EN PDF p3; unit 2 -->

Сначала включите узлы UIO в DTS. Пример для RK3568-evb1:

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

Сборка модуля ядра (KO)

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

### 1.2 Сборка DPDK

<!-- source: EN PDF p4; unit 7 -->

В исходном тесте DPDK на плате используется Debian 11 и DPDK 21.11. Инструкция по сборке: http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html

<!-- source: EN PDF p4; unit 8 -->

Кросс-компиляция на PC

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

Сборка DPDK на плате

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

## 2. Запуск программ DPDK

<!-- source: EN PDF p5; unit 13 -->

### 2.1 Настройка HugePages

<!-- source: EN PDF p5; unit 14 -->

```text
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

<!-- source: EN PDF p5; unit 15 -->

### 2.2 Загрузка KO

<!-- source: EN PDF p5; unit 16 -->

```text
insmod uio.ko
insmod stmmac_uio.ko
```

<!-- source: EN PDF p5; unit 17 -->

После загрузки системы трафик по умолчанию обрабатывается штатной сетью ядра. Переключение между DPDK и сетью ядра выполняется загрузкой stmmac_uio.ko через insmod и выгрузкой через rmmod. После выгрузки модуля восстанавливается исходное управление сетью со стороны ядра.

<!-- source: EN PDF p5; unit 18 -->

Переход под управление DPDK:

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

Возврат под управление сети ядра:

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

### 2.3 Установка режима performance

<!-- source: EN PDF p6; unit 24 -->

```text
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor

echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor
echo performance > /sys/class/devfreq/dmc/governor
```

<!-- source: EN PDF p6; unit 25 -->

### 2.4 Запуск testpmd

<!-- source: EN PDF p6; unit 26 -->

Команды тестирования режима пересылки

<!-- source: EN PDF p6; unit 27 -->

--vdev=net_stmmac0 --vdev=net_stmmac1 задают виртуальные устройства; их имена в данном примере фиксированы.

<!-- source: EN PDF p6; unit 28 -->

--main-lcore=0 назначает ядро 0 для управления, а ядра 2 и 3 — для пересылки.

<!-- source: EN PDF p6; unit 29 -->

--iova-mode=pa: поскольку устройство не поддерживает iommu, используется режим pa.

<!-- source: EN PDF p6; unit 30 -->

-- отделяет параметры eal от параметров testpmd.

<!-- source: EN PDF p6; unit 31 -->

-i включает интерактивный режим dpdk-testpmd.

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

Запуск теста пересылки

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

Просмотр статистики пересылки:

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

Другие распространённые настройки:

<!-- source: EN PDF p8; unit 40 -->

--nb-cores задаёт число ядер, используемых dpdk-testpmd для пересылки.

<!-- source: EN PDF p8; unit 41 -->

--rxd задаёт дескрипторы очереди приёма.

<!-- source: EN PDF p8; unit 42 -->

--txd задаёт дескрипторы очереди передачи.

<!-- source: EN PDF p8; unit 43 -->

--rxq задаёт число очередей приёма dpdk-testpmd; для RK3568 оно равно 1.

<!-- source: EN PDF p8; unit 44 -->

--txq задаёт число очередей передачи dpdk-testpmd; для RK3568 оно равно 1.

<!-- source: EN PDF p8; unit 45 -->

### 2.5 Запуск l2fwd

<!-- source: EN PDF p8; unit 46 -->

По умолчанию l2fwd требует не менее двух ядер для тестирования пересылки пакетов.

<!-- source: EN PDF p8; unit 47 -->

```text
./dpdk-l2fwd -l 0,2,3 --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -q 1 -p 0x3
```

<!-- source: EN PDF p9; unit 48 -->

Консольный вывод l2fwd обновляется каждые 10 секунд, что может приводить к потере пакетов. Рекомендуется перенаправить вывод в файл.

<!-- source: EN PDF p9; unit 49 -->

### 2.6 Запуск l3fwd

<!-- source: EN PDF p9; unit 50 -->

```text
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -p 0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

<!-- source: EN PDF p9; unit 51 -->

Параметр -p PortMask задаёт маску используемых сетевых портов.

<!-- source: EN PDF p9; unit 52 -->

Параметр -P переводит все интерфейсы в неразборчивый режим (promiscuous mode) для приёма всех пакетов.

<!-- source: EN PDF p9; unit 53 -->

--config (port,queue,lcore),[(port,queue,lcore)] задаёт соответствие сетевых портов, очередей и ядер. Например, --config (0,0,3) означает, что очередь 0 порта 0 обрабатывается ядром 3.

<!-- source: EN PDF p9; unit 54 -->

Обратите внимание: вывод выше содержит стандартные правила маршрутизации l3fwd:

<!-- source: EN PDF p9; unit 55 -->

```text
LPM: Adding route 198.18.0.0 / 24 (0) [net_stmmac0]
LPM: Adding route 198.18.1.0 / 24 (1) [net_stmmac1]

LPM: Adding route 2001:200:: / 64 (0) [net_stmmac0]
LPM: Adding route 2001:200:0:1:: / 64 (1) [net_stmmac1]
```

<!-- source: EN PDF p9; unit 56 -->

Пакеты с адресами назначения в диапазоне 198.18.0.0/24 пересылаются через порт 0, а в диапазоне 198.18.1.0/24 — через порт 1. Эти стандартные правила заданы в исходном коде. Поэтому при тестировании l3fwd необходимо правильно задавать адреса источника и назначения тестовых данных.

<!-- source: EN PDF p9; unit 57 -->

## 3. Pktgen

<!-- source: EN PDF p9; unit 58 -->

Pktgen на плате работает поверх DPDK, поэтому сначала нужно собрать и установить DPDK. См. инструкции по сборке DPDK на плате в разделе 1.2.

<!-- source: EN PDF p9; unit 59 -->

### 3.1 Получение исходного кода pktgen-dpdk

<!-- source: EN PDF p9; unit 60 -->

```text
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev

apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

<!-- source: EN PDF p10; unit 61 -->

### 3.2 Сборка DPDK

<!-- source: EN PDF p10; unit 62 -->

```text
cd build
ninja
ninja install

ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

<!-- source: EN PDF p10; unit 63 -->

### 3.3 Сборка Pktgen

<!-- source: EN PDF p10; unit 64 -->

```text
cd pktgen-dpdk
meson build

cd build
ninja
```

<!-- source: EN PDF p10; unit 65 -->

### 3.4 Запуск Pktgen

<!-- source: EN PDF p10; unit 66 -->

```text
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto --log-level debug -- -P -m 7.0
```

<!-- source: EN PDF p10; unit 67 -->

Параметры EAL описаны в документации DPDK. Наиболее важен -l, задающий список используемых ядер: например, -l 1,2 или -l 1-2 означает использование ядер 1 и 2.

<!-- source: EN PDF p10; unit 68 -->

Для pktgen необходимо задать как минимум два ядра: одно требуется для взаимодействия с пользователем, например обработки ввода во время тестирования. Среди собственных параметров pktgen наиболее важен -m, задающий соответствие сетевых портов и ядер. Например, -m 2.0 означает обработку порта 0 ядром 2. Для нескольких соответствий (нескольких сетевых карт и ядер) параметр -m указывается несколько раз. Для приёма пакетов рекомендуется также -P: все сетевые порты переводятся в promiscuous mode и принимают все пакеты.

<!-- source: EN PDF p10; unit 69 -->

Настройка формата пакетов и запуск Pktgen:

<!-- source: EN PDF p10; unit 70 -->

```text
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101

set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

{% endraw %}
