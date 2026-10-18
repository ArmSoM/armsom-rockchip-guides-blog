---
title: "Rockchip GMAC DPDK：RK3568 编译、testpmd、l2fwd、l3fwd 与 Pktgen"
description: "完整整理 RK3568 Linux 4.19+ DPDK 21.11 编译、UIO 切换、巨页、转发测试和 Pktgen 配置。"
translation_key: "064-rockchip-gmac-dpdk"
slug: "064-rockchip-gmac-dpdk"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["Rockchip", "GMAC", "Ethernet", "Linux"]
keywords: "ArmSoM Rockchip GMAC Ethernet RGMII RMII PHY"
excerpt: "完整整理 RK3568 Linux 4.19+ DPDK 21.11 编译、UIO 切换、巨页、转发测试和 Pktgen 配置。"
---

{% raw %}

# Rockchip GMAC DPDK：RK3568 编译、testpmd、l2fwd、l3fwd 与 Pktgen

## ArmSoM 适用说明

本文是 Rockchip 平台参考，不是 ArmSoM 实测报告。必须结合具体板卡的以太网接口引出、PHY、供电、复位、IOMUX、参考时钟和目标 SDK/BSP 进行适配；不能推断所有 ArmSoM 板卡均支持。尚未进行硬件验证。原厂日志、吞吐量和延时均为原文示例，不是 ArmSoM 测试结果。

原文技术范围：RK3568、Linux 4.19+；原文测试系统 Debian 11、DPDK 21.11。中英文均 V1.0.0，分别 11/10 页，章节完整对应；中文按中文原稿，英文与俄文按英文原稿。两份原稿均无技术插图。

> 原文差异：中文编译目标是 rrk3568-evb1-ddr4-v10-linux.img，英文是 rk3568-evb1-ddr4-v10-linux.img。保留各自原值；中文双 r 疑为原稿错误。代码框混有“配置/烧写”说明、逗号分隔的 adb push 和占位目录，不是可直接整体执行的脚本。policy4/policy6、Pktgen 核心 6/7 与 RK3568 四核范围也需核对。运行 UIO、insmod/rmmod、刷写和网络负载测试会改变系统或中断网络；本文未执行。

[校对记录](/docs/rockchip-gmac-dpdk/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/)

## 原文产品范围

| 芯片 | 内核版本 |
| --- | --- |
| RK3568 | 4.19+ |

<!-- source: CN PDF p4; unit 0 -->

## 1.   代码编译

<!-- source: CN PDF p4; unit 1 -->

### 1.1   内核

<!-- source: CN PDF p4; unit 2 -->

首先使能 DTS 中 UIO 节点，以  RK3568-evb1 参考：

<!-- source: CN PDF p4; unit 3 -->

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
 * power-supply should switche to vcc3v3_lcd1_n
 * when mipi panel is connected to dsi1.
```

<!-- source: CN PDF p4; unit 4 -->

编译 KO

<!-- source: CN PDF p4; unit 5 -->

```text
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rockchip_linux_defconfig
make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 menuconfig, 配置 CONFIG_UIO=m,
CONFIG_STMMAC_UIO=m，CONFIG_HUGETLBFS=y

make CROSS_COMPILE=aarch64-linux-gnu- ARCH=arm64 rrk3568-evb1-ddr4-v10-linux.img -j8
烧写 boot.img
adb push drivers/uio/uio.ko, adb push drivers/net/ethernet/stmicro/stmmac/stmmac_uio.ko
```

<!-- source: CN PDF p4; unit 6 -->

### 1.2   DPDK 编译

<!-- source: CN PDF p4; unit 7 -->

DPDK 测试使用的开发板跑的系统是 Debian 11，DPDK 版本 21.11，编译参考 http://doc.dpdk.org/guides-21.11/linux_gsg/cross_build_dpdk_for_arm64.html

<!-- source: CN PDF p4; unit 8 -->

PC 交叉编译

<!-- source: CN PDF p5; unit 9 -->

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

<!-- source: CN PDF p5; unit 10 -->

开发板编译 DPDK

<!-- source: CN PDF p5; unit 11 -->

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

<!-- source: CN PDF p5; unit 12 -->

## 2.   运行 DPDK 程序

<!-- source: CN PDF p5; unit 13 -->

### 2.1   挂载巨页

<!-- source: CN PDF p5; unit 14 -->

```text
echo 1024 > /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

<!-- source: CN PDF p5; unit 15 -->

### 2.2   加载 KO

<!-- source: CN PDF p5; unit 16 -->

```text
insmod uio.ko
insmod stmmac_uio.ko
```

<!-- source: CN PDF p5; unit 17 -->

默认开机起来后的网络走的还是原生内核网络，这里我们通过 insmod stmmac_uio.ko 和 rmmod 该 ko来做到 DPDK 与内核原生网络的切换，即卸载 KO 后，会回到原来的内核网络状态。

<!-- source: CN PDF p5; unit 18 -->

进入 DPDK 网络控制：

<!-- source: CN PDF p6; unit 19 -->

```text
root@linaro-alip:/home/linaro#insmod stmmac_uio.ko
[  41.232761] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-1:00, irq=POLL)

[  41.236447] dwmac4: Master AXI performs any burst length
[  41.236497] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support
found
[  41.236886] rockchip_eth_uio_drv fe010000.uio: Registered uio_eth0 uio
devices, 3 register maps attached
[  41.241453] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-0:00, irq=POLL)
[  41.257084] dwmac4: Master AXI performs any burst length
[  41.257138] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support
found
[  41.257523] rockchip_eth_uio_drv fe2a0000.uio: Registered uio_eth1 uio
devices, 3 register maps attached
```

<!-- source: CN PDF p6; unit 20 -->

返回内核网络控制：

<!-- source: CN PDF p6; unit 21 -->

```text
root@linaro-alip:/home/linaro# rmmod stmmac_uio
[ 2200.304636] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-0:00, irq=POLL)

[ 2200.318163] dwmac4: Master AXI performs any burst length
[ 2200.318205] rk_gmac-dwmac fe2a0000.ethernet eth1: No Safety Features support
found
[ 2200.318227] rk_gmac-dwmac fe2a0000.ethernet eth1: IEEE 1588-2008 Advanced
Timestamp supported
[ 2200.318443] rk_gmac-dwmac fe2a0000.ethernet eth1: registered PTP clock
[ 2200.319414] IPv6: ADDRCONF(NETDEV_UP): eth1: link is not ready
[ 2200.322971] Generic PHY stmmac-1:00: attached PHY driver [Generic PHY]
(mii_bus:phy_addr=stmmac-1:00, irq=POLL)
[ 2200.324883] dwmac4: Master AXI performs any burst length
[ 2200.324921] rk_gmac-dwmac fe010000.ethernet eth0: No Safety Features support
found
[ 2200.324945] rk_gmac-dwmac fe010000.ethernet eth0: IEEE 1588-2008 Advanced

Timestamp supported
[ 2200.325468] rk_gmac-dwmac fe010000.ethernet eth0: registered PTP clock
[ 2200.325814] IPv6: ADDRCONF(NETDEV_UP): eth0: link is not ready
[ 2205.385406] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready
```

<!-- source: CN PDF p6; unit 22 -->

### 2.3   设置 performance 模式

<!-- source: CN PDF p6; unit 23 -->

```text
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor

echo performance > /sys/class/devfreq/dmc/governor
```

<!-- source: CN PDF p7; unit 24 -->

### 2.4   运行 testpmd

<!-- source: CN PDF p7; unit 25 -->

转发模式测试命令

<!-- source: CN PDF p7; unit 26 -->

--vdev=net_stmmac0 --vdev=net_stmmac1 表示指定的虚拟设备，目前是名字是固定的

<!-- source: CN PDF p7; unit 27 -->

--main-lcore=0 表示 0 核用作管理，2 和 3 核用于转发

<!-- source: CN PDF p7; unit 28 -->

--iova-mode=pa 因为设备不支持 iommu，故 iova-mode 规定为 pa 模式

<!-- source: CN PDF p7; unit 29 -->

-- 用于分隔 eal 参数与 testpmd 的参数

<!-- source: CN PDF p7; unit 30 -->

-i 表示进入 dpdk-testpmd 命令交互模式

<!-- source: CN PDF p7; unit 31 -->

```text
root@linaro-alip:/home/linaro# ./dpdk-testpmd --iova-mode=pa --vdev=net_stmmac0
--vdev=net_stmmac1 -l 0,2,3 --main-lcore=0 -- -i

EAL: Detected CPU lcores: 4
EAL: Detected NUMA nodes: 1
EAL: Detected static linkage of DPDK
EAL: Multi-process socket /var/run/dpdk/rte/mp_socket
EAL: Selected IOVA mode 'PA'
TELEMETRY: No legacy callbacks, legacy socket not created
Interactive-mode selected
Warning: NUMA should be configured manually by using --port-numa-config and --
ring-numa-config parameters along with --numa.
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

<!-- source: CN PDF p7; unit 32 -->

开启转发模式测试

<!-- source: CN PDF p7; unit 33 -->

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

<!-- source: CN PDF p8; unit 34 -->

<!-- source: CN PDF p8; unit 35 -->

查看转发数据：

<!-- source: CN PDF p8; unit 36 -->

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

<!-- source: CN PDF p9; unit 37 -->

<!-- source: CN PDF p9; unit 38 -->

其它常用设置：

<!-- source: CN PDF p9; unit 39 -->

--nb-cores 表示指定 dpdk-testpmd 用作转发工作的核的数量

<!-- source: CN PDF p9; unit 40 -->

--rxd 接收队列描述符

<!-- source: CN PDF p9; unit 41 -->

--txd 发送队列描述符

<!-- source: CN PDF p9; unit 42 -->

--rxq 表示指定 dpdk-testpmd 接收队列数，RK3568 队列数为1

<!-- source: CN PDF p9; unit 43 -->

--txq 表示指定 dpdk-testpmd 发送队列数，RK3568 队列数为1

<!-- source: CN PDF p9; unit 44 -->

### 2.5   运行 l2fwd

<!-- source: CN PDF p9; unit 45 -->

l2fwd 默认至少要有两个核才能测试转发

<!-- source: CN PDF p9; unit 46 -->

```text
./dpdk-l2fwd -l 0,2,3 --main-lcore=0 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -q 1 -p 0x3
```

<!-- source: CN PDF p9; unit 47 -->

l2fwd 运行的串口信息每隔10s钟会刷新一次，考虑可能会导致丢包，建议将串口信息重定向到文件。

<!-- source: CN PDF p9; unit 48 -->

### 2.6   运行 l3fwd

<!-- source: CN PDF p9; unit 49 -->

```text
./dpdk-l3fwd -l 3 -n 1 --iova-mode=pa --vdev=net_stmmac0 --vdev=net_stmmac1 -- -p
0x3 -P --config="(0,0,3),(1,0,3)" --parse-ptype
```

<!-- source: CN PDF p9; unit 50 -->

-p PortMask 参数指定使用的网口掩码

<!-- source: CN PDF p9; unit 51 -->

-P 参数表示将所有网口设置为混杂模式，以便收到所有数据包

<!-- source: CN PDF p9; unit 52 -->

--config (port,queue,lcore)，[(port,queue,lcore)] 参数用以配置网口、队列、核之间的对应关系，例如，--config (0,0,3) 表示网口 0 的队列 0 由核 3 进行处理

<!-- source: CN PDF p9; unit 53 -->

值得注意的是，上述输出中打印了 l3fwd 的默认路由规则，即

<!-- source: CN PDF p9; unit 54 -->

```text
LPM: Adding route 198.18.0.0 / 24 (0) [net_stmmac0]
LPM: Adding route 198.18.1.0 / 24 (1) [net_stmmac1]
LPM: Adding route 2001:200:: / 64 (0) [net_stmmac0]

LPM: Adding route 2001:200:0:1:: / 64 (1) [net_stmmac1]
```

<!-- source: CN PDF p9; unit 55 -->

也就是说，目的 IP 为 198.18.0.0/24 段的数据包将会通过网口 0 进行转发，目的 IP 为 198.18.1.0 / 24段的数据包将会通过网口 1 进行转发。上述默认路由规则是在源码中配置的，所以在l3fwd测试的时候，需要设置好测试数据的目标ip和源ip。

<!-- source: CN PDF p10; unit 56 -->

## 3.   Pktgen

<!-- source: CN PDF p10; unit 57 -->

在板子上跑Pktgen ，是基于 dpdk，所以需要先编译和安装好 DPDK，编译参考1.2章节的开发板编译DPDK。

<!-- source: CN PDF p10; unit 58 -->

### 3.1   下载 pktgen-dpdk 源码

<!-- source: CN PDF p10; unit 59 -->

```text
git clone http://dpdk.org/git/apps/pktgen-dpdk
apt-get install libpcap-dev

apt-get install libnuma-dev
apt install meson
apt install ninja-build pkg-config
```

<!-- source: CN PDF p10; unit 60 -->

### 3.2   DPDK 编译

<!-- source: CN PDF p10; unit 61 -->

```text
cd build
ninja
ninja install

ldconfig
export PKG_CONFIG_PATH=/usr/local/lib/aarch64-linux-gnu/pkgconfig/
```

<!-- source: CN PDF p10; unit 62 -->

### 3.3   Pktgen 编译

<!-- source: CN PDF p10; unit 63 -->

```text
cd pktgen-dpdk
meson build

cd build
ninja
```

<!-- source: CN PDF p10; unit 64 -->

### 3.4   运行 Pktgen 程序

<!-- source: CN PDF p10; unit 65 -->

```text
./build/app/pktgen --iova-mode=pa --vdev=net_stmmac0 -l 6,7 --proc-type auto --
log-level debug -- -P -m 7.0
```

<!-- source: CN PDF p10; unit 66 -->

其中，EAL options 参数部分可以参看 DPDK EAL parameters，最重要的一个参数就是 -l 参数，用它来指定使用的核列表，比如：-l 1,2 或者 -l 1-2，表示使用核 1 和核 2。

<!-- source: CN PDF p10; unit 67 -->

值得注意的是，pktgen 至少要指定两个核，因为 pktgen 需要一个核与用戶进行交互，比如响应测试过程中用戶的输入。pktgen 自有参数部分最重要的是 -m 参数，用它来指定网口与核之间的对应关系，比如：-m 2.0：表示让核 2 来处理网口 0。值得注意的是，若要指定多个对应关系（使用多个网卡和多个核），则需多次使用 -m 参数。如果要收包，最好也指定一下 -P 参数，表示让所有网口进入混杂模式，以便接收到所有数据包。

<!-- source: CN PDF p10; unit 68 -->

设置数据包格式并开启 Pktgen：

<!-- source: CN PDF p11; unit 69 -->

```text
set 0 size 64
set 0 src ip 198.18.0.100/24
set 0 dst ip 198.18.1.101

set 0 dst mac ba:a0:3f:fd:b2:8c
start 0
```

{% endraw %}
