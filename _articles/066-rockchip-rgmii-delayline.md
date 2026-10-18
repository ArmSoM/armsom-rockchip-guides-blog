---
title: "Rockchip RGMII Delayline: Scan Windows, rgmii-rxid and Signal Integrity"
description: "Full RGMII delayline procedure, loopback commands, DTS, vendor storage, oscilloscope timing and PHY selection."
translation_key: "066-rockchip-rgmii-delayline"
slug: "066-rockchip-rgmii-delayline"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "RGMII"]
keywords: "ArmSoM Rockchip rockchip rgmii delayline"
excerpt: "Full RGMII delayline procedure, loopback commands, DTS, vendor storage, oscilloscope timing and PHY selection."
---

{% raw %}

# Rockchip RGMII Delayline: Scan Windows, rgmii-rxid and Signal Integrity

## ArmSoM applicability and source scope

Platform reference for adapting ArmSoM systems, based on CN/EN V1.2.0. No board, SDK/BSP, kernel or wiring combination has been hardware-validated here. The source scope below is not a claim that every ArmSoM board or kernel supports these features. Check the exact SoC, board schematic, SDK/BSP, kernel driver and pinmux. Commands, patches, logs and measurements are source examples, not ArmSoM test results.

Chinese figures are from the Chinese PDF; English/Russian figures are from the English PDF.

| Source SoC | Source kernel scope |
| --- | --- |
| ALL chipset | All version |

Rockchip Gigabit Ethernet uses RGMII. Adjustable TX/RX delaylines compensate for differences between hardware designs. This guide explains finding a suitable pair for Ethernet performance and improving hardware to enlarge the valid delayline window.

[Editorial notes](/docs/rockchip-rgmii-delayline/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, unit 0 -->

## 1. How To Get RGMII Delayline

<!-- Source EN PDF p.5, unit 1 -->

If your project features a Gigabit Ethernet and uses the RGMII interface, as long as there is a hardware difference, you need to reset the delayline configuration. Because if the configured delayline value does not match the hardware of your project, it will affect your Gigabit Ethernet performance and even normal network functions.

<!-- Source EN PDF p.5, unit 2 -->

### 1.1 Checking Code

<!-- Source EN PDF p.5, unit 3 -->

The implementation code is all in the file drivers/net/ethernet/stmicro/stmmac/dwmac-rk-tool.c , so it is also more convenient to transplant. If your project does not have this part of the code, please request a patch on Redmine, which has kernel-4.4 and kernel-3.10 versions, the others after kernel-4.4 should have supported it.

<!-- Source EN PDF p.5, unit 4 -->

Kernel-4.4 patch: Rockchip_RGMII_Delayline_Kernel4.4.tar.gz The kernel-4.4 performance has been optimized, the patch code is generated based on the current code. If there is a problem that it cannot be compiled, please try to patch kernel4.4_stmmac_optimize_output_performances_20191119.zip at first.

<!-- Source EN PDF p.5, unit 5 -->

Kernel-3.10 patch: Rockchip_RGMII_Delayline_Kernel3.10.tar.gz

<!-- Source EN PDF p.5, unit 6 -->

### 1.2 Checking Node

<!-- Source EN PDF p.5, unit 7 -->

After the code in the previous step is confirmed and compiled, it will generate several sysfs nodes. If it is not generated, it means there is a problem with the patch. Taking RK3399 as an example, you can see these nodes in the directory /sys/devices/platform/fe300000.ethernet :

<!-- Source EN PDF p.5, unit 8 -->

![RGMII delayline sysfs nodes — source EN PDF p.5](/docs/rockchip-rgmii-delayline/assets/en-p05-figure1.png)

*RGMII delayline sysfs nodes — source EN PDF p.5.*

Copyable technical excerpt from the image; clipped edge text and graphical scan rows are not guessed. The full source image remains above.

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

<!-- Source EN PDF p.5, unit 9 -->

### 1.3 Usage

<!-- Source EN PDF p.5, unit 10 -->

Note that if you are using RTL8211E phy , you need to remove the network cable before testing.

<!-- Source EN PDF p.6, unit 11 -->

#### 1.3.1 Scanning Delayline Window

<!-- Source EN PDF p.6, unit 12 -->

Scanning through the phy_lb_scan node will get an window, then get the coordinates in the center of this window, which needs to be scanned with a Gigabit speed of 1000.

<!-- Source EN PDF p.6, unit 13 -->

```text
echo 1000 > phy_lb_scan
```

<!-- Source EN PDF p.6, unit 14 -->

The horizontal axis represents the delayline in the TX direction (coordinate range `<0x00, 0x7f>`), and the vertical axis represents the delayline in the RX direction (coordinate range is also `<0x00, 0x7f>`). The "O" indicates that the coordinates of the point can be Okay, and all the other blank spaces indicate loopback failed. Taking RK3399 as an example, through the Gigabit scan command, discard rows or columns with blank spaces in between, you can get a rectangular window, and get the coordinates of the center point. The RX coordinates of the vertical axis have been printed, and the horizontal axis coordinates are not printing due to screen width. It is not displayed, you need to find it manually, starting from RX(0xXX): of:.

<!-- Source EN PDF p.6, unit 15 -->

![TX/RX loopback scan window — source EN PDF p.6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure1.png)

*TX/RX loopback scan window — source EN PDF p.6.*

<!-- Source EN PDF p.6, unit 16 -->

And the center point of coordinate will be printed after the scanning window:

<!-- Source EN PDF p.6, unit 17 -->

![Delayline scan center coordinates — source EN PDF p.6](/docs/rockchip-rgmii-delayline/assets/en-p06-figure2.png)

*Delayline scan center coordinates — source EN PDF p.6.*

Copyable technical excerpt from the image; clipped edge text and graphical scan rows are not guessed. The full source image remains above.

```text
[42055.560261] RX(0x7d):
[42055.711729] RX(0x7e):
[42055.857406] RX(0x7f):
[42056.002810]
[42056.002810] Find suitable tx_delay = 0x2e, rx_delay = 0x0f
```

<!-- Source EN PDF p.6, unit 18 -->

The hardware signal of the RK3399 board tested in this picture is not very good, so the window is not very large. Similarly, RGMII 100M can also get a window. Echo 100 > phy_lb_scan can see that the 100M window is very large, occupying almost all the coordinates, because 100M is not as demanding as Gigabit on the signal.

<!-- Source EN PDF p.7, unit 19 -->

#### 1.3.2 Testing Scanned Result

<!-- Source EN PDF p.7, unit 20 -->

Secondly, configure the scanned value to the rgmii_delayline node through the command, and then test whether the TX/RX data transmission under this configuration is normal through the phy_lb node test, at least this test needs pass first.

<!-- Source EN PDF p.7, unit 21 -->

```text
echo (tx delayline) (rx delayline) > rgmii_delayline
cat rgmii_delayline
echo 1000 > phy_lb
```

<!-- Source EN PDF p.7, unit 22 -->

![Configured delayline and PHY loopback result — source EN PDF p.7](/docs/rockchip-rgmii-delayline/assets/en-p07-figure1.png)

*Configured delayline and PHY loopback result — source EN PDF p.7.*

Copyable technical excerpt from the image; clipped edge text and graphical scan rows are not guessed. The full source image remains above.

```text
[42265.031754] Set rgmii delayline tx: 0x2e, rx: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # cat rgmii_delayline
tx delayline: 0x2e, rx delayline: 0xf
rk3399_all:/sys/devices/platform/fe300000.ethernet # echo 1000 > phy_lb
[42270.042819] PHY loopback speed set to 1000
[42270.738739] PHY loopback: PASS
```

<!-- Source EN PDF p.7, unit 23 -->

After testing pass, fill the delayline into dts respectively: tx_delay = `<0x2e>`; and rx_delay = `<0x0f>`; , re-burn the firmware, and then continue to test the ping or iperf performance test, generally test to this step will be enough.

<!-- Source EN PDF p.7, unit 24 -->

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

<!-- Source EN PDF p.7, unit 25 -->

#### 1.3.3 Auto Scanning

<!-- Source EN PDF p.7, unit 26 -->

If a set of delayline values cannot be adapted to all hardware, the reason may be poor hardware and a small window with poor redundancy; you can turn on the automatic function scanning and open CONFIG_DWMAC_RK_AUTO_DELAYLINE on menuconfig. It should be noted here that if the problem of the small window is not resolved, opening this macro will not completely solve the problem. Generally speaking, it is not necessary to open this macro.

<!-- Source EN PDF p.7, unit 27 -->

```text
Device Drivers →
    Network device support →
        Ethernet driver support →
            [*] Auto search rgmii delayline
```

<!-- Source EN PDF p.8, unit 28 -->

This function will only make a detection at the first boot, and will store the delayline value to vendor storage after detection. Each subsequent boot will directly obtain the value from vendor storage and override the dts configuration. Only after the vendor storage is erased，the operation will be performed once after the next boot.

<!-- Source EN PDF p.8, unit 29 -->

Log printing for the first boot:

<!-- Source EN PDF p.8, unit 30 -->

```text
[ 23.532138] Find suitable tx_delay = 0x2f, rx_delay = 0x10
```

<!-- Source EN PDF p.8, unit 31 -->

Log printing for subsequent boot:

<!-- Source EN PDF p.8, unit 32 -->

```text
[ 23.092358] damac rk read rgmii dl from vendor tx: 0x2f, rx: 0x10
```

<!-- Source EN PDF p.8, unit 33 -->

### 1.4 rgmii-rxid mode

<!-- Source EN PDF p.8, unit 34 -->

When the hardware enables the RX delay of the PHY, such as RTL8211F:

<!-- Source EN PDF p.8, unit 35 -->

![PHY internal RX/TX delay selection — source EN PDF p.8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure1.png)

*PHY internal RX/TX delay selection — source EN PDF p.8.*

<!-- Source EN PDF p.8, unit 36 -->

Need to turn off the RX delay of the GMAC, and the dts configuration mode becomes "rgmii-rxid", for example:

<!-- Source EN PDF p.8, unit 37 -->

```text
&gmac0 {
    /* Use rgmii-rxid mode to disable rx delay inside Soc */
    phy-mode = "rgmii-rxid";
    clock_in_out = "output";
    ......
}；
```

<!-- Source EN PDF p.8, unit 38 -->

Scan through the above method to get:

<!-- Source EN PDF p.8, unit 39 -->

![TX-only scan in rgmii-rxid mode — source EN PDF p.8](/docs/rockchip-rgmii-delayline/assets/en-p08-figure2.png)

*TX-only scan in rgmii-rxid mode — source EN PDF p.8.*

Copyable technical excerpt from the image; clipped edge text and graphical scan rows are not guessed. The full source image remains above.

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

<!-- Source EN PDF p.8, unit 40 -->

At this time, because the RX delay is fixed by the PHY hardware, usually 2ns, the RX delay will not be scanned. After the TX delay is scanned, the most suitable delay will be obtained. Fill in the "tx_delay" property in the dts gmac node, and comment to turn off rx_delay.

<!-- Source EN PDF p.9, unit 41 -->

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

<!-- Source EN PDF p.9, unit 42 -->

## 2. Hareware Checking

<!-- Source EN PDF p.9, unit 43 -->

### 2.1 Test RGMII Timing Specifics

<!-- Source EN PDF p.9, unit 44 -->

According to the latest RGMII protocol, you need to meet the following timing requirements. Please test your board for compliance. If you know nothing about test or do not have an oscilloscope to test, please make a request on Redmine.

<!-- Source EN PDF p.9, unit 45 -->

![RGMII timing requirements and notes — source EN PDF p.9](/docs/rockchip-rgmii-delayline/assets/en-p09-figure1.png)

*RGMII timing requirements and notes — source EN PDF p.9.*

| Symbol | Parameter | Min | Typical | Max | Units |
| --- | --- | --- | --- | --- | --- |
| TskewT | Data-to-clock output skew at transmitter, note 1 | -500 | 0 | 500 | ps |
| TskewR | Data-to-clock input skew at receiver, note 1 | 1 | 1.8 | 2.6 | ns |
| TsetupT | Data-to-clock output setup at transmitter, integrated delay, note 4 | 1.2 | 2.0 |  | ns |
| TholdT | Clock-to-data output hold at transmitter, integrated delay, note 4 | 1.2 | 2.0 |  | ns |
| TsetupR | Data-to-clock input setup at receiver, integrated delay, note 4 | 1.0 | 2.0 |  | ns |
| TholdR | Data-to-clock input setup at receiver, integrated delay, note 4 (source repeats setup) | 1.0 | 2.0 |  | ns |
| Tcyc | Clock cycle duration, note 2 | 7.2 | 8 | 8.8 | ns |
| Duty_G | Gigabit duty cycle, note 3 | 45 | 50 | 55 | % |
| Duty_T | 10/100T duty cycle, note 3 | 40 | 50 | 60 | % |
| Tr / Tf | Rise/fall time (20–80%) |  |  | .75 | ns |

Note 1: Before RGMII 2.0, PCB routing must add more than 1.5 ns and less than 2.0 ns delay to the corresponding clock. For 10/100 the maximum is unspecified.

Note 2: At 10 Mbps and 100 Mbps, Tcyc scales to 400 ns ±40 ns and 40 ns ±4 ns respectively.

Note 3: Duty cycle may stretch/shrink during speed changes or transition to the received packet clock domain, provided the minimum is respected and stretching lasts no more than three Tcyc of the lower speed.

Note 4: TsetupT/TholdT allows internal TXC/RXC delay in the transmitter, termed RGMII-ID. Devices may optionally enable/disable it while remaining compliant. The TholdR parameter description repeats Setup in the image; it is not silently rewritten.

<!-- Source EN PDF p.9, unit 46 -->

For example, to confirm the signal quality of CLK at Gigabit, you should measure the waveforms of the signals at where close to the receiving end (do not measure at the sending end, the signal reflection at the sending end is serious, and the waveform cannot reflect the actual signal quality). Measuring the signal MAC_CLK, TX_CLK, RX_CLK, you should focus on duty cycle, amplitude, and rise and fall time, the bandwidth of the measuring oscilloscope and probe must be more than 5 times of 125M. For single-ended probes, the ground loop should be as short as possible. It is best to use a differential probe to control the duty cycle at 45 % ~ 55%. When the test environment is normal, the signal measured should be a square wave instead of a sine wave. Generally, the customer self-test is a positive sine wave with a 50% duty cycle, which is basically incorrect.

<!-- Source EN PDF p.10, unit 47 -->

#### 2.1.1 RX_CLK/MAC_CLK

<!-- Source EN PDF p.10, unit 48 -->

MAC_CLK or RXCLK is provided by PHY. If the integrity of the received CLK measurement signal have defects, there is generally no register to regulate on the PHY side, it may only be adjusted by hardware. You can string high-frequency inductance at the transmitting end to improve the edge too slow （the bandwidth is only available if it meets the requirement so here cannot use ordinary inductance), and regulate the duty ratio and reduce the amplitude by modify voltage by resistance at the transmitting end.

<!-- Source EN PDF p.10, unit 49 -->

#### 2.1.2 TX_CLK

<!-- Source EN PDF p.10, unit 50 -->

If there is a problem with TX_CLK, the edge is too slow, you can read the corresponding register through IO to check if the IO drive strength has been adjusted to the maximum, you can connect it with an oscilloscope; at the same time, directly regulate the drive strength through the IO command to observe the waveform change. If the improvement is not obvious by regulating driver, you can try for the string high-frequency inductance, or change and increase the series 22ohm resistor; if the duty cycle is not within the specification and TX_CLK bypass from MAC_CLK, you can adjust the TX_CLK duty cycle by dividing the MAC_CLK amplitude, the divided value is 100 ohm, the ground resistance value varies with the layout, different board have different value, you can regulate up from 100, until the oscilloscope observes that the duty cycle meets the requirements. If the above methods are not significant, and the IO currently used is 3.3V, in the case that both the PHY and RK platform support 1.8V IO, you can change the IO power to 1.8V and then observe the signal integrity because 1.8V IO signal indicator stronger than 3.3V, 1.8V IO is recommended.

<!-- Source EN PDF p.10, unit 51 -->

## 3. FAQ

<!-- Source EN PDF p.10, unit 52 -->

### 3.1 Scanning Window size

<!-- Source EN PDF p.10, unit 53 -->

We hope that the larger the window, the better, indicating that the hardware signal is good and the redundancy is large. If the window cannot be scanned or the window scanned is too small, there are generally hardware problems, please refer to the hardware section.

<!-- Source EN PDF p.10, unit 54 -->

### 3.2 PHY Selection

<!-- Source EN PDF p.10, unit 55 -->

There are no special requirements for the selection of PHY, as long as it conforms to RGMII. However, there are two points to note:

<!-- Source EN PDF p.10, unit 56 -->

If your project plans to use the RTL8211E Gigabit PHY, it is recommended that you change to RTL8211F or other PHY, for reasons explained in section 2.1 above.

<!-- Source EN PDF p.10, unit 57 -->

If the PHY you are using does not have a loopback function, please refer to the following method to obtain the delayline:

<!-- Source EN PDF p.11, unit 58 -->

PHY can be debugged based on the oscilloscope measurement signal. Use an oscilloscope with a bandwidth greater than 125M and 5 times the bandwidth to measure the phase difference between TXC and TXD near the PHY end. Regulate the phase within the range of

<!-- Source EN PDF p.11, unit 59 -->

1.5ns ~ 2ns by IO command (the specification is 1 ~ 2.6 ns should be left in a certain amount), TX will be fine; and due to RX delayed inside the SoC, as loopback is not used, it can only be judged with the help of throughput. When the tx_delay register is determined, firstly set rx_delay to 0x10. After the change, use iperf to run the down link throughput. The result may be unsatisfactory at the beginning, continue to use the IO command to change the register rxdelay and increase it in steps of 5 (0x10 ~ 0x7f interval). After the IO writes the register, when it is measured that the throughput is greater than 900M, then narrow down by 2 steps to find the register interval that can go up to 900M, and then take the intermediate value and set it to dts.

<!-- Source EN PDF p.11, unit 60 -->

TXC&TXD phase waveform figure：

<!-- Source EN PDF p.11, unit 61 -->

![TXC/TXD phase measurement waveform — source EN PDF p.11](/docs/rockchip-rgmii-delayline/assets/en-p11-figure1.png)

*TXC/TXD phase measurement waveform — source EN PDF p.11.*

{% endraw %}
