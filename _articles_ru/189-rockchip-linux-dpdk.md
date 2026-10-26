---
title: "Rockchip Linux DPDK: настройка, тесты и пересылка пакетов"
description: "Rockchip Linux DPDK: настройка, тесты и пересылка пакетов — V1.0.0"
excerpt: "Rockchip Linux DPDK: настройка, тесты и пересылка пакетов"
translation_key: "189-rockchip-linux-dpdk"
slug: "189-rockchip-linux-dpdk"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux DPDK: настройка, тесты и пересылка пакетов

Платформенная справка ArmSoM по предоставленным китайскому и английскому оригиналам Rockchip. Проверяйте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры и измерения источника не являются испытаниями ArmSoM. Команды и аппаратные тесты не выполнялись.

Источник перечисляет RK3588/RK3568/RK3566, Linux 4.19/5.10; среда исходных тестов — Debian 11, DPDK 21.11.

Оба оригинала V1.0.0; сохранены 8 глав, 6 технических таблиц и журналы. §6 ссылается на §1.2, но сборка на плате — в §4.4. Ресурсы вроде `PCIe Gen3 x 1 lane` в таблице RK3588S, имена PHY и поведение драйвера нужно сверять с TRM/SDK конкретного чипа; поддержка платы этим не доказана. Производительность и 85% многоядерная оценка взяты из источника, не измерены ArmSoM. Отдельных рисунков нет.

## 1. Обзор DPDK

DPDK (Intel Data Plane Development Kit) — набор средств разработки Intel. Он предоставляет библиотеки и драйверы для эффективной обработки пакетов в пользовательском пространстве на ARM, X86 и PowerPC. В отличие от универсальной Linux-системы, DPDK ориентирован на высокопроизводительную обработку сетевых пакетов. По исходнику он проверен на большинстве Linux-систем и использует лицензию BSD, что упрощает создание собственных стеков протоколов и приложений. Это позволяет быстрее развёртывать производительные сетевые приложения и эффективнее обрабатывать данные, чем стандартный сетевой стек ядра с прерываниями.

## 2. Принцип работы DPDK

DPDK использует несколько методов повышения пропускной способности; основные — обход ядра и драйвер опроса PMD.

- Kernel Bypass: путь между сетевой картой и приложением создаётся в пользовательском пространстве, минуя ядро. Это исключает переключения контекста при перемещении кадров между ядром и пользовательским пространством, а также накладные расходы обычного драйвера и сетевого стека ядра.
- Polling Mode Driver (PMD): вместо прерывания от сетевой карты процессор постоянно выполняет PMD и опрашивает карту о новых пакетах.

Также применяются привязка и изоляция CPU, огромные страницы памяти, выравнивание по строкам кэша и пакетные операции.

## 3. Поддерживаемые платформы

Платформы Rockchip SoC поддерживают GMAC/PCIe: до двух гигабитных GMAC-карт и карты PCIe x1/x2/x4. Для RK3588 исходник указывает до шести внешних сетевых карт: 4 PCIe + 2 GMAC. Ресурсы отдельных чипов приведены ниже.

### 3.1 RK3566

| Ресурс | Режим | Связь между SoC | Разделение линий | Поддержка DMA | Поддержка MMU |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x<br>1 | Только RC | Нет | Нет | Нет | Нет |
| GMAC<br>1000M (x2) | RGMII | / | / | / | Да |

### 3.2 RK3568

| Ресурсы | Режим | Связь между SoC | Разделение линий | Поддержка DMA | Поддержка MMU |
| --- | --- | --- | --- | --- | --- |
| PCIe Gen2 x<br>1 lane | Только RC | Нет | Нет | Нет | Нет |
| PCIe Gen3 x<br>2 lane | RC/EP | Да | 1 lane RC + 1<br>lane RC | Да | Нет |
| GMAC<br>1000M (x2) | RGMII | / | / | / | Да |

### 3.3 RK3588

| Ресурс | Режим | Разделение линий | Доступный PHY | Внутренний DMA |
| --- | --- | --- | --- | --- |
| PCIe Gen3 x 4<br>lane | RC/EP | Да | pcie30phy | Да |
| PCIe Gen2 x 1<br>lane (x3) | Только RC | Нет | pcie30phy,<br>combphy1_ps | Нет |
| GMAC 1000M (x2) | RGMII | / | / | Да |

### 3.4 RK3588S

| Ресурс | Режим | Разделение линий | Доступный PHY | Внутренний DMA |
| --- | --- | --- | --- | --- |
| PCIe Gen3 x 1 lane | Только RC | Нет | combphy2_psu | Нет |
| PCIe Gen2 x 1 lane | Только RC | Нет | combphy0_ps | Нет |
| GMAC 1000M (x2) | RGMII | / | / | Да |

## 4. Конфигурация ядра для DPDK

Примечание:

- GMAC: актуальный на момент исходника SDK поддерживает его по умолчанию; старым SDK нужны патчи. См. external/dpdk/gmac/README.txt в SDK; выбирайте патчи по версии ядра.
- PCIe: см. external/dpdk/pcie/README.txt в SDK.

### 4.1 DTS

Для GMAC сначала включите узел UIO в DTS; пример для RK3568-evb1:

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

### 4.2 Конфигурация ядра

В defconfig включаются следующие параметры:

```text
CONFIG_UIO=m
CONFIG_STMMAC_UIO=m
CONFIG_HUGETLBFS=y
```

### 4.3 Сборка модуля ядра (KO)

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

### 4.4 Сборка DPDK

Исходные испытания проводились на отладочной плате с Debian 11 и DPDK 21.11. Инструкция по сборке: http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html

Кросс-компиляция на ПК:

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

Сборка DPDK на отладочной плате с Debian:

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

## 5. Запуск DPDK

### 5.1 Подключение огромных страниц

```text
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

### 5.2 Загрузка KO

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

После загрузки системы сетевой трафик по умолчанию обрабатывается обычным стеком ядра. Для переключения на DPDK загрузите stmmac_uio.ko через insmod; выгрузка этого .ko через rmmod возвращает исходное управление ядром. Переход под управление DPDK:

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

Возврат под управление ядра:

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

### 5.3 Режим performance

```text
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor
echo performance > /sys/class/devfreq/dmc/governor
#or
echo performance | tee $(find /sys/ -name *governor) /dev/null || true
```

### 5.4 Запуск testpmd

Команда теста пересылки:

- `--vdev=net_stmmac0 --vdev=net_stmmac1`: виртуальные устройства с фиксированными именами; для PCIe не требуются.
- `--main-lcore=0`: ядро 0 управляет, ядра 2 и 3 пересылают пакеты.
- `--iova-mode=pa`: режим pa, поскольку устройство не поддерживает IOMMU.
- `--`: разделяет параметры EAL и testpmd.
- `-i`: интерактивный режим dpdk-testpmd.

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

Начало теста пересылки:

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

Просмотр статистики пересылки:

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

Другие параметры:

- `--nb-cores`: количество ядер для пересылки в dpdk-testpmd.
- `--rxd`: дескрипторы очереди приёма.
- `--txd`: дескрипторы очереди передачи.
- `--rxq`: число очередей приёма; у RK3568 одна.
- `--txq`: число очередей передачи; у RK3568 одна.

### 5.5 Запуск l2fwd

По умолчанию l2fwd требует как минимум два ядра для теста пересылки.

```text
./dpdk-l2fwd -l 0,2,3  --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -q 1 -p 0x3
```

Консоль l2fwd обновляется каждые 10 секунд, что может приводить к потере пакетов. Рекомендуется перенаправить вывод в файл.

Примечание: `--vdev=net_stmmac0 --vdev=net_stmmac1` задаёт виртуальные устройства с фиксированными именами; для PCIe указывать их не нужно.

### 5.6 Запуск l3fwd

```text
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -p 0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

Параметры:

- `-p PortMask`: маска портов.
- `--vdev=net_stmmac0 --vdev=net_stmmac1`: виртуальные устройства с фиксированными именами, не нужны для PCIe.
- `-P`: все порты принимают все пакеты в promiscuous-режиме.
- `--config (port,queue,lcore),[(port,queue,lcore)]`: соответствие порта, очереди и ядра; `--config (0,0,3)` назначает очередь 0 порта 0 ядру 3.

Вывод также содержит стандартные маршруты l3fwd:

```text
LPM: Adding route 198.18.0.0 / 24 (0) [net_stmmac0]
LPM: Adding route 198.18.1.0 / 24 (1) [net_stmmac1]
LPM: Adding route 2001:200:: / 64 (0) [net_stmmac0]
LPM: Adding route 2001:200:0:1:: / 64 (1) [net_stmmac1]
```

Пакеты с IP назначения 198.18.0.0/24 пересылаются через порт 0, с 198.18.1.0/24 — через порт 1. Эти стандартные маршруты заданы в исходном коде. Поэтому при тесте l3fwd правильно задавайте IP источника и назначения тестовых данных.

## 6. Pktgen

Pktgen основан на DPDK; перед его запуском на плате нужно собрать и установить DPDK. Исходник отсылает к разделу 1.2 о сборке на плате; фактически соответствующая инструкция находится в §4.4.

### 6.1 Загрузка исходников pktgen-dpdk

```text
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev
apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

### 6.2 Сборка DPDK

```text
cd build
ninja
ninja install
ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

### 6.3 Сборка Pktgen

```text
cd pktgen-dpdk
meson build
cd build
ninja
```

### 6.4 Запуск Pktgen

```text
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto --log-level debug -- -P -m 7.0
```

Параметры EAL описаны в документации DPDK. Главный здесь `-l`: список ядер, например `-l 1,2` или `-l 1-2` использует ядра 1 и 2. Для pktgen нужно не менее двух ядер: одно обслуживает взаимодействие с пользователем, включая ввод во время теста.

Среди собственных параметров pktgen основной — `-m`, соответствие сетевых портов ядрам. Например, `-m 2.0` назначает порт 0 ядру 2. Для нескольких карт и ядер укажите `-m` несколько раз. Для приёма пакетов желательно также `-P`: все порты переходят в promiscuous-режим и принимают любые пакеты.

Настройка формата пакетов и запуск Pktgen:

```text
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101
set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

## 7. Показатели производительности из исходника

| Среда (одно ядро) | Пересылка L2 | Пересылка L3 |
| --- | --- | --- |
| RK3588 GMAC + 64 Byte | 650Mbit/s | 530Mbit/s |
| RK3588 GMAC + 1500 Byte | 940Mbit/s | 940Mbit/s |
| RK3588 Intel I210/350 PCIe + 64 Byte | N/A | 737Mbit/s |
| RK3588 Intel I210/350 PCIe + 1500 Byte | 940Mbit/s | 940Mbit/s |
| RK3568 GMAC + 64 Byte | 600Mbit/s | 580Mbit/s |
| RK3568 GMAC + 1500 Byte | 940Mbit/s | 940Mbit/s |

Примечания исходника:

1. Для нескольких ядер исходник использует оценочный коэффициент 85%: если одно ядро даёт 1000 Mbps, для восьми получается 1000 × 8 × 0.85 = 6.8 Gbit/s. Это оценка исходника, не результат испытаний ArmSoM.

2. N/A: фактические данные теста ещё не предоставлены. По исходнику L2 обычно быстрее L3, поскольку не выполняет поиск по таблице маршрутизации.

## 8. Поддерживаемые сетевые карты

| Модуль | Интерфейс | Скорость |
| --- | --- | --- |
| GMAC+PHY | GMII | 1000M |
| Intel I210 | PCIe x1 | 1000M |
| Intel I350 | PCIe x4 | 1000M x4 |
| RTL8111H | PCIe x1 | 1000M |

## Ссылки исходника

[ArmSoM Docs](https://docs.armsom.org/)

[http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html](http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html)

{% endraw %}
