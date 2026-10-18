---
title: "Rockchip RGMII Delayline 完整指南：窗口扫描、rgmii-rxid 与信号完整性"
description: "完整整理 RGMII delayline 扫描、回环命令、DTS、vendor storage、示波器时序与 PHY 选型。"
translation_key: "066-rockchip-rgmii-delayline"
slug: "066-rockchip-rgmii-delayline"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "RGMII"]
keywords: "ArmSoM Rockchip rockchip rgmii delayline"
excerpt: "完整整理 RGMII delayline 扫描、回环命令、DTS、vendor storage、示波器时序与 PHY 选型。"
---

{% raw %}

# Rockchip RGMII Delayline 完整指南：窗口扫描、rgmii-rxid 与信号完整性

## ArmSoM 适用说明与原文范围

本文为 ArmSoM 适配前的平台参考，依据 CN/EN V1.2.0。未进行板卡、SDK/BSP、内核或接线组合的硬件验证。下表沿用原稿范围，不表示所有 ArmSoM 板卡或所有内核均支持；请核对具体 SoC、板卡原理图、SDK/BSP、内核驱动和引脚复用。命令、补丁、日志、测试数字均为原文示例，不是 ArmSoM 实测。

中文使用中文原图，英文、俄文使用英文原图。

| 原文芯片 | 原文内核范围 |
| --- | --- |
| ALL chipset | All version |

Rockchip 芯片的千兆以太网使用 RGMII 接口。为兼容不同硬件带来的信号差异，芯片提供 TX/RX RGMII delayline 调整功能。本文完整介绍如何获得合适的一组 delayline，以及如何改善硬件以增大有效窗口。

[校对记录](/docs/rockchip-rgmii-delayline/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. RGMII Delayline 获取步骤

<!-- Source CN PDF p.4, unit 1 -->

如果你的项目具有千兆以太网功能，使用的是 RGMII 接口，只要有硬件差别，都需要重新做一次delayline 的配置。因为如果配置的 delayline 值与你项目的硬件不匹配，将会影响你千兆以太网的性能，甚至正常的网络功能。

<!-- Source CN PDF p.4, unit 2 -->

### 1.1 代码确认

<!-- Source CN PDF p.4, unit 3 -->

代码实现部分都在 drivers/net/ethernet/stmicro/stmmac/dwmac-rk-tool.c 文件，所以也比较方便移植。如果你手头上的工程没有这部分代码，请在 Redmine 上索要补丁，有 Kernel-4.4 和 Kernel-3.10 版本，Kernel-4.19 和之后的版本本身已经包含这部分代码，无需补丁。

<!-- Source CN PDF p.4, unit 5 -->

Kernel-4.4 补丁：Rockchip_RGMII_Delayline_Kernel4.4.tar.gz

<!-- Source CN PDF p.4, unit 6 -->

4.4 内核有优化过性能，补丁代码是基于当前代码生成的，如果有编译不过的问题，先打上kernel4.4_stmmac_optimize_output_performances_20191119.zip 。

<!-- Source CN PDF p.4, unit 7 -->

Kernel-3.10 补丁：Rockchip_RGMII_Delayline_Kernel3.10.tar.gz

<!-- Source CN PDF p.4, unit 8 -->

### 1.2 节点确认

<!-- Source CN PDF p.4, unit 9 -->

上一步的代码确认并编译后，新的固件会生成几个 sysfs 节点，如果没有生成则说明补打的有问题。以RK3399 为例，在 /sys/devices/platform/fe300000.ethernet 目录下可以看到这几个节点：

<!-- Source CN PDF p.4, unit 10 -->

![RGMII delayline sysfs 节点 — 来源 CN PDF p.4](/docs/rockchip-rgmii-delayline/assets/cn-p04-figure1.png)

*RGMII delayline sysfs 节点 — 来源 CN PDF p.4.*

图中技术输出的可复制摘录；边缘已截断文字和图形扫描行不猜补，完整原图仍保留在上方。

```text
rk3399_all:/ # ls -l /sys/devices/platform/fe300000.ethernet/
total 0
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 driver -> ../../../bus/platform/drivers/rk_gmac-dwmac
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 driver_override
--w------- 1 root root 4096 2013-01-18 20:21 mac_lb
drwxr-xr-x 3 root root    0 2013-01-18 08:50 mdio_bus
-r--r--r-- 1 root root 4096 2013-01-18 20:21 modalias
drwxr-xr-x 3 root root    0 2013-01-18 08:50 net
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 of_node -> ../../../firmware/devicetree/base/ethernet@fe300000
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb
--w------- 1 root root 4096 2013-01-18 20:21 phy_lb_scan
drwxr-xr-x 2 root root    0 2013-01-18 08:50 power
-rw-r--r-- 1 root root 4096 2013-01-18 20:21 rgmii_delayline
lrwxrwxrwx 1 root root    0 2013-01-18 20:21 subsystem -> ../../../bus/platform
-rw-r--r-- 1 root root 4096 2013-01-18 08:50 uevent
```

<!-- Source CN PDF p.4, unit 11 -->

### 1.3 使用方法

<!-- Source CN PDF p.4, unit 12 -->

注意，如果你使用的是 RTL8211E phy ，测试前需要拔掉网线。

<!-- Source CN PDF p.4, unit 13 -->

#### 1.3.1 扫描 delayline 窗口

<!-- Source CN PDF p.4, unit 14 -->

通过 phy_lb_scan 节点扫描到一个窗口，会得到一个中间坐标，需要使用千兆速度 1000 来扫描。

<!-- Source CN PDF p.4, unit 15 -->

```text
echo 1000 > phy_lb_scan
```

<!-- Source CN PDF p.5, unit 16 -->

横轴表示 TX 方向的 delayline(坐标范围 `<0x00, 0x7f>`)， 纵轴表示 RX 方向的 delayline， (坐标范围也是 `<0x00, 0x7f>`)。其中的 "O" 表示该点的坐标是可以 pass， 空白处都是 failed。以 RK3399 为例，通过千兆扫描命令，丢弃掉有空缺的行或列，可以得到一个矩形窗口，并得到其中间点坐标，纵轴的 RX 坐标已经有打印，横轴坐标因为打印的关系，没有显示出来，需要手动找下，从 RX(0xXX): 的 : 开始算起。

<!-- Source CN PDF p.5, unit 17 -->

![TX/RX 回环扫描窗口 — 来源 CN PDF p.5](/docs/rockchip-rgmii-delayline/assets/cn-p05-figure1.png)

*TX/RX 回环扫描窗口 — 来源 CN PDF p.5.*

<!-- Source CN PDF p.5, unit 18 -->

中心点坐标在扫描窗口的最后也会打印出来：

<!-- Source CN PDF p.5, unit 19 -->

![Delayline 扫描中心坐标 — 来源 CN PDF p.5](/docs/rockchip-rgmii-delayline/assets/cn-p05-figure2.png)

*Delayline 扫描中心坐标 — 来源 CN PDF p.5.*

图中技术输出的可复制摘录；边缘已截断文字和图形扫描行不猜补，完整原图仍保留在上方。

```text
[42055.560261] RX(0x7d):
[42055.711729] RX(0x7e):
[42055.857406] RX(0x7f):
[42056.002810]
[42056.002810] Find suitable tx_delay = 0x2e, rx_delay = 0x0f
```

<!-- Source CN PDF p.5, unit 20 -->

这里测试 RK3399 板子硬件信号并不是很好，所以窗口不是很大。同样百兆也可以得到一个窗口， echo100 > phy_lb_scan 可以看到的是百兆窗口很大，几乎占据所有的坐标，因为百兆对信号要求不如千兆的高。

<!-- Source CN PDF p.5, unit 21 -->

#### 1.3.2 测试扫描出来的中间值

<!-- Source CN PDF p.5, unit 22 -->

将扫描得到的值通过命令配置到 rgmii_delayline 节点，然后测试该配置下 TX/RX 数据传输是否正常，通过 phy_lb 节点测试，至少这个测试需要先 pass。

<!-- Source CN PDF p.5, unit 23 -->

```text
echo (tx delayline) (rx delayline) > rgmii_delayline
cat rgmii_delayline
echo 1000 > phy_lb
```

<!-- Source CN PDF p.6, unit 24 -->

![Delayline 配置与 PHY 回环结果 — 来源 CN PDF p.6](/docs/rockchip-rgmii-delayline/assets/cn-p06-figure1.png)

*Delayline 配置与 PHY 回环结果 — 来源 CN PDF p.6.*

图中技术输出的可复制摘录；边缘已截断文字和图形扫描行不猜补，完整原图仍保留在上方。

```text
[42265.031754] Set rgmii delayline tx: 0x2e, rx: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # cat rgmii_delayline
tx delayline: 0x2e, rx delayline: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # echo 1000 > phy_lb
[42270.042819] PHY loopback speed set to 1000
[42270.738739] PHY loopback: PASS
```

<!-- Source CN PDF p.6, unit 25 -->

测试 pass 后，将 delayline 分别填到 dts： tx_delay = `<0x2e>`; 和 rx_delay = `<0x0f>`; ，重新烧入固件，接着继续测试 ping 或者 iperf 性能测试，一般情况下到这一步就可以了。

<!-- Source CN PDF p.6, unit 26 -->

```text
&gmac {
        phy-supply = <&vcc_lan>;
        clock_in_out = "output";
        assigned-clocks = <&cru SCLK_MAC>, <&cru SCLK_RMII_SRC>;
        assigned-clock-parents = <&cru PLL_NPLL>, <&cru SCLK_MAC>;
        assigned-clock-rates = <0>, <125000000>;
        phy-mode = "rgmii";
        pinctrl-names = "default";
        pinctrl-0 = <&rgmii_pins>;
        snps,reset-gpio = <&gpio3 RK_PB7 GPIO_ACTIVE_LOW>;
        snps,reset-active-low;
        snps,reset-delays-us = <0 10000 50000>;
        tx_delay = <0x2e>;
        rx_delay = <0x0f>;
        status = "okay";
};
```

<!-- Source CN PDF p.6, unit 27 -->

#### 1.3.3 自动扫描

<!-- Source CN PDF p.6, unit 28 -->

如果遇到一组 delayline 的值无法适配所有硬件板子的时候，原因可能是硬件比较差，窗口很小冗余度差；可以打开自动扫描功能，menuconfig 上打开 CONFIG_DWMAC_RK_AUTO_DELAYLINE 。这边需要注意的是窗口很小的问题没有解决的话，打开这个宏也不能完全解决问题，一般来说不需要打开这个宏。

<!-- Source CN PDF p.6, unit 29 -->

```text
Device Drivers →
    Network device support →
        Ethernet driver support →
            [*] Auto search rgmii delayline
```

<!-- Source CN PDF p.6, unit 30 -->

该功能只会在第一次开机的时候做一次探测，做完后会将 delayline 值存储到 vendor storage，之后的每次开机都是直接从 vendor storage 出来并覆盖 dts 的配置。只有在 vendor storage 被擦除后，才会在下次开机后执行该操作一次。

<!-- Source CN PDF p.6, unit 31 -->

第一次开机的日志打印：

<!-- Source CN PDF p.6, unit 32 -->

```text
[ 23.532138] Find suitable tx_delay = 0x2f, rx_delay = 0x10
```

<!-- Source CN PDF p.6, unit 33 -->

之后开机的日志打印：

<!-- Source CN PDF p.6, unit 34 -->

```text
[ 23.092358] damac rk read rgmii dl from vendor tx: 0x2f, rx: 0x10
```

<!-- Source CN PDF p.7, unit 35 -->

### 1.4 rgmii-rxid 模式

<!-- Source CN PDF p.7, unit 36 -->

当硬件启用 PHY 的 RX delay，比如 RTL8211F:

<!-- Source CN PDF p.7, unit 37 -->

![PHY 内部 RX/TX 延迟选择 — 来源 CN PDF p.7](/docs/rockchip-rgmii-delayline/assets/cn-p07-figure1.png)

*PHY 内部 RX/TX 延迟选择 — 来源 CN PDF p.7.*

<!-- Source CN PDF p.7, unit 38 -->

就需要关闭主控的 RX delay， dts 配置的模式变成 “rgmii-rxid”, 例如。

<!-- Source CN PDF p.7, unit 39 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
}；
```

<!-- Source CN PDF p.7, unit 40 -->

通过上面方法扫描可得

<!-- Source CN PDF p.7, unit 41 -->

![rgmii-rxid 模式仅 TX 扫描 — 来源 CN PDF p.7](/docs/rockchip-rgmii-delayline/assets/cn-p07-figure2.png)

*rgmii-rxid 模式仅 TX 扫描 — 来源 CN PDF p.7.*

图中技术输出的可复制摘录；边缘已截断文字和图形扫描行不猜补，完整原图仍保留在上方。

```text
# echo 1000 > phy_lb_scan
[ 429.089639] Delayline scan speed set to 1000
[ 429.560194] dwmac4: Master AXI performs any burst length
[ 429.859831] Find available tx_delay = 0x43, rx_delay = disable
[ 430.104205] dwmac4: Master AXI performs any burst length
[ 430.104254] rk_gmac-dwmac fe1b0000.ethernet eth1: No Safety Features support found
[ 430.104282] rk_gmac-dwmac fe1b0000.ethernet eth1: IEEE 1588-2008 Advanced Timestamp supported
[ 430.104718] rk_gmac-dwmac fe1b0000.ethernet eth1: registered PTP clock
[ 430.104758] rk_gmac-dwmac fe1b0000.ethernet eth1: configuring for phy/rgmii-rxid link mode
```

<!-- Source CN PDF p.7, unit 42 -->

此时因为 RX delay 为 PHY 硬件固定，一般是 2ns，不会扫描 RX 的 delay，TX delay 被扫描后得到最合适的 delay，填入 dts gmac 节点中的 tx_delay 属性，同时注释关闭 rx_delay。

<!-- Source CN PDF p.7, unit 43 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
    tx_delay = <0x43>;
    /* rx_delay = <0x42>; */
    phy-handle = <&rgmii_phy>;
    status = "okay";
}；
```

<!-- Source CN PDF p.8, unit 44 -->

## 2. 硬件

<!-- Source CN PDF p.8, unit 45 -->

### 2.1 测试 RGMII 接口的指标

<!-- Source CN PDF p.8, unit 46 -->

按照最新的 RGMII 协议，需要满足以下时序要求，请测试你的板子是否符合，如果不会测试或者没有能测试的示波器进行测试，请在 Redmine 上提出需求。

<!-- Source CN PDF p.8, unit 47 -->

![RGMII 时序要求及注释 — 来源 CN PDF p.8](/docs/rockchip-rgmii-delayline/assets/cn-p08-figure1.png)

*RGMII 时序要求及注释 — 来源 CN PDF p.8.*

| Symbol | 参数 | Min | Typical | Max | Units |
| --- | --- | --- | --- | --- | --- |
| TskewT | 发送端数据到时钟输出偏移，注 1 | -500 | 0 | 500 | ps |
| TskewR | 接收端数据到时钟输入偏移，注 1 | 1 | 1.8 | 2.6 | ns |
| TsetupT | 发送端数据到时钟输出建立时间，集成延迟，注 4 | 1.2 | 2.0 |  | ns |
| TholdT | 发送端时钟到数据输出保持时间，集成延迟，注 4 | 1.2 | 2.0 |  | ns |
| TsetupR | 接收端数据到时钟输入建立时间，集成延迟，注 4 | 1.0 | 2.0 |  | ns |
| TholdR | 接收端数据到时钟输入建立时间，集成延迟，注 4（原图重复 setup） | 1.0 | 2.0 |  | ns |
| Tcyc | 时钟周期，注 2 | 7.2 | 8 | 8.8 | ns |
| Duty_G | 千兆占空比，注 3 | 45 | 50 | 55 | % |
| Duty_T | 10/100T 占空比，注 3 | 40 | 50 | 60 | % |
| Tr / Tf | 上升/下降时间（20–80%） |  |  | .75 | ns |

注 1：RGMII 2.0 之前，PCB 时钟走线需额外引入大于 1.5 ns、小于 2.0 ns 的延迟。10/100 模式最大值未指定。

注 2：10 Mbps、100 Mbps 时，Tcyc 分别为 400 ns ±40 ns、40 ns ±4 ns。

注 3：速度切换或切入接收包时钟域时占空比可伸缩，但不得违反最小占空比要求，且伸展不超过切换两速度中较低速度的三个 Tcyc。

注 4：TsetupT/TholdT 允许发送端内部对 TXC/RXC 添加延迟，称为 RGMII-ID；器件可提供开启/关闭内部延迟的选项并保持规范兼容。TholdR 原图说明重复写成 Setup，未擅自修正。

<!-- Source CN PDF p.8, unit 48 -->

比如确认千兆时 CLK 的信号质量，分别在靠近接收端的位置（不要在发送端量取，发送端信号反射严重，波形不能反应实际信号质量），测量 MAC_CLK、TX_CLK、RX_CLK 信号的波形，重点看占空比、幅度、以及上升下降时间，测量示波器及探头带宽需大于 125M 的 5 倍，如是单端探头注意接地回路要尽可能的短，最好是用差分探头测度，占空比控制在 45% ~ 55% 之间。在测试环境没问题时测出的信号应为方波，而非正弦波，一般客戶自测是正玄波，且占空比 为50%，基本都是测量不正确。

<!-- Source CN PDF p.8, unit 49 -->

#### 2.1.1 RX_CLK / MAC_CLK

<!-- Source CN PDF p.8, unit 50 -->

MAC_CLK 或 RXCLK 由 PHY 提供，如果接收的 CLK 测量信号完整性有问题，因为一般 PHY 端没有寄存器可调，可能只能通过硬件手段调整，可以在发送端串高频电感来改善边沿过缓（不能用普通电感，带宽要满足才可用），通过发送端电阻分压，降低幅值调整占空比。

<!-- Source CN PDF p.8, unit 51 -->

#### 2.1.2 TX_CLK

<!-- Source CN PDF p.8, unit 52 -->

TX_CLK 有问题，出现边沿过缓，可以通过 IO 读取相应寄存器，看 IO 驱动强度是否有调整到最大，可以接上示波器看；同时，直接通过 IO 命令来调整驱动强度观察波形的变化，驱动调整改善不明显也可偿试串高频电感，或将串接 22ohm 电阻改大；如出现占空比不在规范内，可以通过分压 MAC_CLK的幅度来调整 TX_CLK 占空比，分压值为串接 100ohm，下地电阻值因布板而异，不同的板子值不一样，可以从100 向上调，直到示波器观察到占空比符合要求为止。如果以上收效都不大，并且现在使用的 IO 是3.3V，在 PHY 与 RK 平台端都支持 1.8V IO 的情况下，可以将 IO 电源改为 1.8V 再看信号完整性，1.8VIO 信号指标强于 3.3V，推荐使用1.8V IO。

<!-- Source CN PDF p.9, unit 54 -->

## 3. FAQ

<!-- Source CN PDF p.9, unit 55 -->

### 3.1 窗口大小

<!-- Source CN PDF p.9, unit 56 -->

我们希望能 pass 的窗口越大越好，表明硬件信号好，冗余度大。如果扫描不到窗口或者扫到的窗口太小，一般是硬件问题，请参考硬件部分章节。

<!-- Source CN PDF p.9, unit 57 -->

### 3.2 PHY 的选型

<!-- Source CN PDF p.9, unit 58 -->

这里对 PHY 的选择没有特别的要求，只要符合 RGMII。但有以下两点需要注意下:

<!-- Source CN PDF p.9, unit 59 -->

如果你项目计划使用的是 RTL8211E 千兆 PHY，建议你改成 RTL8211F 或者其他的PHY，原因上文2.1 章节有阐明。

<!-- Source CN PDF p.9, unit 61 -->

如果你所使用的 PHY 没有 loopback 功能，请参照下面的方法获取 delayline:

<!-- Source CN PDF p.9, unit 62 -->

可以基于示波器测信号来调试，用大于 125M 5倍带宽的示波器，在靠近 PHY 端测量 TXC 与 TXD之间的相位差，通过 IO 命令将相位调整在 1.5ns ~ 2ns 区间内（规范为 1 ~ 2.6ns 要留一定量），TX 问题就不大；RX 由于是在主控内部做延时，在 loopback 没用起来的情况下，只能借助于吞吐量来判 断，在 tx_delay 寄存器确定的情况下，先将 rx_delay 设为 0x10, 改完后用 iperf 跑下行吞吐量，刚开始结果可能是不理想的，继续用 IO 命令去改 rxdelay寄存器，以 5 为步进向上加（0x10 ~ 0x7f 的区间），IO 写完寄存器后，当测到吞吐量大于 900M 以后，再缩小以 2 为步进，找出能上 900M 的寄存器区间,然后取中间值设定到 dts。

<!-- Source CN PDF p.9, unit 63 -->

TXC&TXD 相位测试波形如下图：

<!-- Source CN PDF p.9, unit 64 -->

![TXC/TXD 相位测量波形 — 来源 CN PDF p.9](/docs/rockchip-rgmii-delayline/assets/cn-p09-figure1.png)

*TXC/TXD 相位测量波形 — 来源 CN PDF p.9.*

{% endraw %}
