---
title: "Rockchip HDMI Complete Developer Guide: DRM, PHY, HDCP, Android and Troubleshooting"
description: "Rockchip HDMI Complete Developer Guide: DRM, PHY, HDCP, Android and Troubleshooting"
translation_key: "047-rockchip-hdmi"
slug: "047-rockchip-hdmi"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["HDMI", "Rockchip", "DRM", "HDCP", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip HDMI DRM PHY HDCP Android RK3588 RK3576"
excerpt: "Rockchip HDMI Complete Developer Guide: DRM, PHY, HDCP, Android and Troubleshooting"
---

{% raw %}

# Rockchip HDMI Complete Developer Guide: DRM, PHY, HDCP, Android and Troubleshooting

This is a Rockchip HDMI platform reference based on the Chinese V1.2.0 PDF (50 pages); no English original was supplied. English and Russian are full translations, and all languages use the Chinese PDF figures with localized alt text. The source product table lists RK322X/RK3328/RK3368/RK3399/RK3288/RK3528/RK356X/RK3588 and Linux 6.1/5.10/4.19/4.4; the body also discusses RK3576. This grouped table does not establish every SoC/kernel combination. Before use on ArmSoM, verify board HDMI routing and connector availability, SDK/BSP, kernel driver, PHY and Android/HWC versions. No ArmSoM hardware validation was performed. The 50kHz I2C measurement, 4K UI performance, logs and certification diagnostics belong to the source, not ArmSoM tests.

[Editorial notes](/docs/rockchip-hdmi/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. HDMI on Rockchip platforms

HDMI capabilities on the different Rockchip platforms are listed below:

| Feature | RK3288 | RK3368 | RK322X | RK3328 | RK3399 | RK3528 | RK356X | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Maximum output resolution | 3840x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 7680x4320p60 | 4096x2160p120 |
| Interlaced mode | N | N | Y | Y | Y | Y | Y | Y | Y |
| Color formats at 4K60/50Hz | RGB YCbCr444 YCbCr422 YCbCr420(RK3288W only) | YCbCr420 | YCbCr420 | YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 |
| 10-bit depth supported | Y | N | Y | Y | Y | Y | Y | Y | Y |
| HDMI version | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.1 | HDMI 2.1 |

DRM:

DRM (Direct Rendering Manager) is a component of DRI (Direct Rendering Infrastructure). Linux kernels 4.4 and later use DRM. HDMI driver paths are:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-Rockchip.c
kernel/drivers/gpu/drm/rockchip/inno_hdmi.c

kernel/drivers/gpu/drm/bridge/synopsys/
```

## 2. HDMI in the DRM framework

### 2.1 HDMI software configuration

#### 2.1.1 Enabling HDMI

To enable HDMI, add:

```text
&hdmi {
   status = "okay";

};
```

#### 2.1.2 Binding a VOP

On Rockchip platforms, image data for display interfaces such as HDMI, DP and CVBS comes from the VOP:

![Technical figure from the Chinese source, p. 5](/docs/rockchip-hdmi/assets/cn-p5-1.png)

Platforms with two VOPs, such as RK3288 and RK3399, provide VOPB (4K) and VOPL (2K only). They can be bound to two display interfaces and their assignments can be swapped. Each display interface can bind to only one VOP:

![Technical figure from the Chinese source, p. 6](/docs/rockchip-hdmi/assets/cn-p6-1.png)

Enabling the display node in DTS enables both VOPB and VOPL ports for that interface. Disable the unused VOP port. For example, when binding HDMI to VOPB, add:

```text
&hdmi_in_vopl {
   status = "disabled";
};
```

Conversely, when binding HDMI to VOPL, add:

```text
&hdmi_in_vopb {
   status = "disabled";
};
```

This step is unnecessary on platforms with only one VOP.

From VOP2 onward, a platform has one VOP containing multiple VP (Video Port) outputs rather than multiple VOPs.

The RK356X VOP-to-HDMI paths are shown below:

![Technical figure from the Chinese source, p. 6](/docs/rockchip-hdmi/assets/cn-p6-2.png)

HDMI can bind to VP0 or VP1. VP0 is recommended for 4K output:

```text
&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};
```

The RK3588 VOP-to-HDMI paths are shown below:

![Technical figure from the Chinese source, p. 7](/docs/rockchip-hdmi/assets/cn-p7-1.png)

RK3588 has two HDMITX instances with identical performance. Each can bind to VP0, VP1 or VP2.

If output up to 4K is sufficient, bind HDMI0 and HDMI1 to VP0 and VP1 respectively:

```text
&hdmi0_in_vp0 {
   status = "okay";
};


&hdmi0_in_vp1 {
   status = "disabled";
};

&hdmi0_in_vp2 {
   status = "disabled";
};

&hdmi1_in_vp1 {
   status = "okay";
};
&hdmi1_in_vp0 {
   status = "disabled";
};


&hdmi1_in_vp2 {
   status = "disabled";
};
```

8K output on RK3588 requires combining VP0 and VP1. In DTS, bind the HDMI interface producing 8K to VP0. HDMI0 example:

```text
&hdmi0_in_vp0 {
   status = "okay";
};


&hdmi0_in_vp1 {
   status = "disabled";
};

&hdmi0_in_vp2 {
   status = "disabled";
};
```

Also set VOP ACLK to 800M. The source refers to §3.1.4 (an outdated cross-reference; the clock configuration is in §2.1.4).

RK3588 HDMI and eDP share a COMBPHY. For HDMI0 and eDP0, hdptxphy_hdmi0 is the HDMI PHY node and hdptxphy0 is the eDP PHY node in DTS:

```text
hdptxphy0: phy@fed60000 {
   compatible = "rockchip,rk3588-hdptx-phy";

   reg = <0x0 0xfed60000 0x0 0x2000>;
   clocks = <&cru CLK_USB2PHY_HDPTXRXPHY_REF>, <&cru PCLK_HDPTX0>;
   clock-names = "ref", "apb";
   resets = <&cru SRST_P_HDPTX0>, <&cru SRST_HDPTX0_INIT>,
      <&cru SRST_HDPTX0_CMN>, <&cru SRST_HDPTX0_LANE>;
   reset-names = "apb", "init", "cmn", "lane";
   rockchip,grf = <&hdptxphy0_grf>;
   #phy-cells = <0>;
   status = "disabled";
};

hdptxphy_hdmi0: hdmiphy@fed60000 {
   compatible = "rockchip,rk3588-hdptx-phy-hdmi";

   reg = <0x0 0xfed60000 0x0 0x2000>;
   clocks = <&cru CLK_USB2PHY_HDPTXRXPHY_REF>, <&cru PCLK_HDPTX0>;
   clock-names = "ref", "apb";
   clock-output-names = "clk_hdmiphy_pixel0";
   #clock-cells = <0>;
   resets = <&cru SRST_HDPTX0>, <&cru SRST_P_HDPTX0>,
      <&cru SRST_HDPTX0_INIT>, <&cru SRST_HDPTX0_CMN>,
      <&cru SRST_HDPTX0_LANE>, <&cru SRST_HDPTX0_ROPLL>,
      <&cru SRST_HDPTX0_LCPLL>;
   reset-names = "phy", "apb", "init", "cmn", "lane", "ropll",
          "lcpll";
   rockchip,grf = <&hdptxphy0_grf>;
   #phy-cells = <0>;
   status = "disabled";
};
```

Therefore, when using HDMI, disable the corresponding eDP and eDP PHY. HDMI0 example:

```text
&hdmi0 {
   status = "okay";
};


&hdptxphy_hdmi0 {
   status = "okay";
};

&edp0 {
   status = "disabled";
};

&hdptxphy0 {
   status = "disabled";
};
```

#### 2.1.3 Enabling the boot logo

If the U-Boot logo is disabled, the kernel cannot display the boot logo either; an image appears only after the system boots and applications begin displaying. Enable route_hdmi in DTS to enable the U-Boot logo:

```text
&route_hdmi {
   status = "okay";

};
```

On dual-VOP platforms, the VOP specified by connect below must match the VOP bound to HDMI, otherwise image corruption may occur. The source refers to §3.1.2; the corresponding binding section here is §2.1.2.

```text
route_hdmi: route-hdmi {
   status = "disabled";
   logo,uboot = "logo.bmp";

   logo,kernel = "logo_kernel.bmp";
   logo,mode = "center";
   charge_logo,mode = "center";
   connect = <&vopb_out_hdmi>;
};
```

#### 2.1.4 Binding VOP dclk to a PLL

Specify a PLL clock source for the dclk of the VOP/VP bound to HDMI. RK322X, RK3328 and RK3528 HDMI are bound to fixed VOP/VP instances and always use the HDMI PHY PLL as the dclk source, so no configuration is needed.

##### 2.1.4.1 PLL binding on RK3288

RK3288 VOPB/VOPL dclk can use GPLL or CPLL. Neither PLL supports fractional division, so RK3288 HDMI can output only standard resolutions derived by integer division of 594M, such as 4K60, 1080P60 and 720P60. Example: VOPB dclk on GPLL and VOPL dclk on CPLL:

```text
&vopb {
      assigned-clocks = <&cru DCLK_VOP0>;
      assigned-clock-parents = <&cru PLL_GPLL>;

};

&vopl {
      assigned-clocks = <&cru DCLK_VOP1>;
      assigned-clock-parents = <&cru PLL_CPLL>;
};
```

##### 2.1.4.2 PLL binding on RK3399

On RK3399, bind the dclk of the HDMI VOP to VPLL. For dual displays, bind the other VOP dclk to CPLL. This allows arbitrary dclk frequencies and independent resolutions. Configuration when HDMI is bound to VOPB:

```text
&vopb {
   assigned-clocks = <&cru DCLK_VOP0_DIV>;
   assigned-clock-parents = <&cru PLL_VPLL>;

};
&vopl {
   assigned-clocks = <&cru DCLK_VOP1_DIV>;
   assigned-clock-parents = <&cru PLL_CPLL>;
}；
```

When HDMI is bound to VOPL:

```text
&vopb {
   assigned-clocks = <&cru DCLK_VOP0_DIV>;

   assigned-clock-parents = <&cru PLL_CPLL>;
};
&vopl {
   assigned-clocks = <&cru DCLK_VOP1_DIV>;
   assigned-clock-parents = <&cru PLL_VPLL>;
};
```

##### 2.1.4.3 PLL binding on RK356X

On RK356X, the dclk of the VP bound to HDMI must use HPLL. VP0 example:

```text
&vop {
      status = "okay";
      assigned-clocks = <&cru DCLK_VOP0>;

      assigned-clock-parents = <&pmucru PLL_HPLL>;
};
```

##### 2.1.4.4 PLL binding on RK3588/RK3576

For RK3588 output above 4K60, set VOP ACLK to 800MHz:

```text
&vop {
      assigned-clocks = <&cru ACLK_VOP>;
      assigned-clock-rates = <800000000>;

      status = "okay";
};
```

RK3576 VOP ACLK needs no dedicated configuration.

RK3588 HDMI0/1 can bind to VP0/1/2, as described in §2.1.2. Their dclk sources can be GPLL, HDMI0 PHY PLL, HDMI1 PHY PLL or V0PLL.

For allocation policies and restrictions, see §10.11 of Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

To support nonstandard resolutions on RK3588/RK3576, use the PHY PLL as the VOP dclk source.

RK3588 DTS configuration:

```text
&display_subsystem {
   clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;

   clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&hdptxphy_hdmi_clk0 {
   status = "okay";
};

&hdptxphy_hdmi_clk1 {
   status = "okay";
};
```

RK3576 DTS configuration:

```text
&display_subsystem {
   clocks = <&hdptxphy_hdmi>;
   clock-names = "hdmi0_phy_pll";

};
```

Run cat /sys/kernel/debug/clk/clk_summary to verify that DTS clock assignments took effect.

For example, when VP0 dclk is bound to HDMI0 PHY PLL, dclk_vop0 appears beneath clk_hdmiphy_pixel0 in the clock tree:

```text
xin24m                    26    28     0   24000000     0
  0 50000
  clk_usbdpphy_mipidcpphy_ref 2  2     0   24000000     0

  0 50000
  clk_usb2phy_hdptxrxphy_ref 11 11     0   24000000     0
  0 50000
    clk_hdmiphy_pixel0    2      3     0  594000000     0
  0 50000
      dclk_vop0           2      4     0  594000000     0
  0 50000
```

#### 2.1.5 Enabling HDCP on RK3288/RK3399/RK3528/RK356X

##### 2.1.5.1 Enabling HDCP 1.4

```text
&hdmi {
   hdcp1x-enable = <1>;

}
```

After enabling HDCP 1.4, provision the corresponding key with the tool in the SDK RKTools directory. The tool may vary with Android versions; consult the FAE and the tool README. Customers must obtain the key from Digital Content Protection LLC themselves.

The following node enables or disables HDCP:

```text
echo 1 > /sys/class/misc/hdmi_hdcp1x/enable
```

1 enables HDCP; 0 disables it.

After enabling HDCP, verify operation using the following methods:

Read HDCP status from the following node:

```text
cat /sys/class/misc/hdmi_hdcp1x/status
```

The status values mean:

| status node value | Description |
| --- | --- |
| hdcp disable | HDCP disabled. |
| hdcp_auth_start | HDCP authentication started. |
| hdcp_auth_success | Authentication succeeded; encrypted video transmission starts. |
| hdcp_auth_fail | HDCP authentication failed |

Test one TV without HDCP 1.4 support and another with support. The source considers HDCP operational if enabling it produces a pink screen on the unsupported TV while the supported TV displays normally.

##### 2.1.5.2 Enabling HDCP 2.2

RK3288/RK3399/RK3528/RK356X support HDCP 2.2 under DRM. HDCP 1.4 must first operate correctly. Enable HDCP 2.2 as follows:

Obtain the HDCP 2.2 key-packaging tool and patch package from the FAE. Package the key and apply the patches following the README.

Rebuild and flash the image, then enable or disable HDCP 2.2 through:

```text
echo 1 > /sys/class/misc/hdcp2_node/enable
```

After enabling it, verify HDCP 2.2 using the following methods:

Test one TV without HDCP 2.2 support and another with support. The source considers HDCP operational if enabling it produces a white screen on the unsupported TV and normal output on the supported TV.

Read HDCP 2.2 status from:

```text
cat /sys/class/misc/hdcp2_node/status
```

| status value | Description |
| --- | --- |
| hdcp2 auth sucess | Authentication succeeded. |
| no enable hdcp2 | HDCP 2.2 disabled. |
| hdcp2 no auth | HDMI disconnected or the device lacks HDCP 2.2 support. |
| no already auth sucess | Authentication failed. |

If authentication fails, upload the following log file to the source-described Redmine issue tracker:

```text
/cache/hdcp_tx0.log
```

Alternatively, capture logs with:

```text
logcat -s HDMI_HDCP2
dmesg | grep hdcp
```

#### 2.1.6 Enabling HDCP on RK3588/RK3576

RK3588/RK3576 support HDCP 1.4/2.3. Enable either through the DRM HDCP interface; DRM properties control enablement and report status. Obtain the hdcptest.c demo through the vendor business contact. modetest can be used during debugging.

Android modetest source path:

```text
external/libdrm/tests/modetest/
```

On Linux, use modetest built by Buildroot. After building rootfs, its source path is:

```text
buildroot/output/rockchip_rk3588/build/libdrm-2.4.115/testst/modetest/
```

HDCP testing with modetest uses these properties:

```text
Content Protection:
           flags: enum
           enums: Undesired=0 Desired=1 Enabled=2

           value: 2

Undesired：关闭hdcp
Desired：开启hdcp
Enabled：hdcp已经开启并认证成功

hdcp_encrypted:
           flags: range
           values: 0 2
           value: 2

hdcp认证等级：
   0：hdcp未认证。

   1：hdcp1.4。
   2：hdcp2.3。
```

Use modetest -w to enable or disable HDCP. Example:

```text
modetest -w 423:"Content Protection":1
------->开启hdcp，优先2.3，若电视不⽀持2.3或2.3认证失败，⾃动切换到1.4。


modetest -w 423:"Content Protection":0
------->关闭hdcp。
```

423 is the HDMI connector ID. Query it with modetest -c:

```text
rk3588_s:/ # modetest -c
trying to open device 'i915'...failed
trying to open device 'amdgpu'...failed

trying to open device 'radeon'...failed
trying to open device 'nouveau'...failed
trying to open device 'vmwgfx'...failed
trying to open device 'omapdrm'...failed
trying to open device 'exynos'...failed
trying to open device 'tilcdc'...failed
trying to open device 'msm'...failed
trying to open device 'sti'...failed
trying to open device 'tegra'...failed
trying to open device 'imx-drm'...failed
trying to open device 'rockchip'...done
Connectors:
id    encoder status   name        size (mm)  modes encoders

423   422  connected   HDMI-A-1    0x0        6     422
 modes:
      name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync,
pvsync; type: preferred
 1920x1080 50 1920 2448 2492 2640 1080 1084 1089 1125 148500 flags: phsync,

pvsync; type: driver
 1280x720 60 1280 1390 1430 1650 720 725 730 750 74250 flags: phsync, pvsync;
type: driver
 1280x720 50 1280 1720 1760 1980 720 725 730 750 74250 flags: phsync, pvsync;
type: driver
 720x576 50 720 732 796 864 576 581 586 625 27000 flags: nhsync, nvsync; type:
driver
 720x480 60 720 736 798 858 480 489 495 525 27000 flags: nhsync, nvsync; type:
driver
```

For detailed instructions, see Rockchip_RK3588_Developer_Guide_HDCP_CN.pdf.

#### 2.1.7 Configuring DDC I2C speed

If EDID reads fail during HDMI plug/unplug, try reducing DDC I2C speed.

```text
[ 163.026743] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.130075] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.233407] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!

[ 163.336741] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440074] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440110] dwhdmi-rockchip fdea0000.hdmi: failed to get edid
```

I2C speed is adjusted through the clock high and low durations. The following configuration corresponds to 50kHz measured in the source environment, not on ArmSoM hardware.

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <9625>;

   ddc-i2c-scl-low-time-ns = <10000>;
}
```

Scale both values proportionally to change the speed. For example, for 100kHz:

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <4812>;
   ddc-i2c-scl-low-time-ns = <5000>;

}
```

#### 2.1.8 Configuring HDMI signal strength

Different PCB routing can require different drive strengths. Adjustment may help when investigating TV compatibility problems.

##### 2.1.8.1 Signal configuration on RK322X/RK3328/RK3528/RK356X

###### 2.1.8.1.1 RK322X signal configuration

Configure RK322X HDMI signal strength using the DTS rockchip,phy-table property. Format:

```text
rockchip,phy-table =
     <165000000 0xaa 0x00 0x44 0x44 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0xaa 0x15 0x6a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0xaa 0x15 0x7a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Using the 340000000 row above as an example:

| Parameter | Description |
| --- | --- |
| 340000000 | Maximum TMDS clock for this row. The source also says this applies below 165MHz, contradicting the 340000000 value; both are retained pending verification. |
| 0xaa | data lane0 slew rate: bit[1:0] data lane1 slew rate: bit[3:2] data lane2 slew rate: bit[5:4] clock lane slew rate: bit[7:6] slew rate: adjusts rise/fall time; larger values shorten it. |
| 0x15 | data lane0 pre-emphasis: bit[1:0] data lane1 pre-emphasis: bit[3:2] data lane2 pre-emphasis: bit[5:4] pre-emphasis: larger values increase pre-emphasis. |
| 0x6a | data lane2 swing: bit[3:0] clock lane swing: bit[7:4] swing: larger values increase amplitude. |
| 0xaa | data lane0 swing: bit[3:0] data lane1 swing: bit[7:4] swing: larger values increase amplitude. |
| All subsequent zero values | Unused |

###### 2.1.8.1.2 RK3328 signal configuration

Configure RK3328 HDMI signal strength using the DTS rockchip,phy-table property. Format:

```text
rockchip,phy-table =
     <165000000 0x07 0x0a 0x0a 0x0a 0x00 0x00 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>,

     <340000000 0x0b 0x0d 0x0d 0x0d 0x07 0x15 0x08
             0x08 0x08 0x3f 0xac 0xcc 0xcd 0xdd>,
     <594000000 0x10 0x1a 0x1a 0x1a 0x07 0x15 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>;
```

Using the 340000000 row above as an example:

| Parameter | Description |
| --- | --- |
| 340000000 | Maximum TMDS clock for this row. The source also says this applies below 165MHz, contradicting the 340000000 value; both are retained pending verification. |
| 0x0b | clock lane swing swing: larger values increase amplitude. |
| 0x0d | data lane2 swing swing: larger values increase amplitude. |
| 0x0d | data lane1 swing swing: larger values increase amplitude. |
| 0x0d | data lane0 swing swing: larger values increase amplitude. |
| 0x07 | data lane0 pre-emphasis mode: bit[0] data lane1 pre-emphasis mode: bit[1] data lane2 pre-emphasis mode: bit[2] pre-emphasis mode:0--full mode 1--half mode |
| 0x15 | data lane0 pre-emphasis level: bit[1:0] data lane1 pre-emphasis level: bit[3:2] data lane2 pre-emphasis level: bit[5:4] pre-emphasis level: larger values increase strength; zero disables it. |
| 0x08 | data lane2 pre-emphasis swing: bit[4:0] pre-emphasis swing: larger values increase amplitude. |
| 0x08 | data lane1 pre-emphasis swing: bit[4:0] pre-emphasis swing: larger values increase amplitude. |
| 0x08 | data lane0 pre-emphasis swing: bit[4:0] pre-emphasis swing: larger values increase amplitude. |
| 0x3f | data lane0 pre-emphasis driver path gate: bit[0], main driver path gate: bit[1] data lane1 pre-emphasis driver path gate: bit[2], main driver path gate: bit[3] data lane2 pre-emphasis driver path gate: bit[4], main driver path gate: bit[5] clock lane pre-emphasis driver path gate: bit[6], main driver path gate: bit[7] Write 1 to enable the path. |
| 0xac | data lane2 pre-emphasis second delay gate: bit[0], pre-emphasis first delay gate: bit[1] data lane2 main driver second delay gate: bit[2], main driver first delay gate: bit[3] clock lane pre-emphasis second delay gate: bit[4], pre-emphasis first delay gate: bit[5] clock lane main driver second delay gate: bit[6], main driver first delay gate: bit[7] Write 1 to enable delay. |

| Parameter | Description |
| --- | --- |
| 0xcc | data lane0 pre-emphasis second delay gate: bit[0], pre-emphasis first delay gate: bit[1] data lane0 main driver second delay gate: bit[2], main driver first delay gate: bit[3] data lane1 pre-emphasis second delay gate: bit[4], pre-emphasis first delay gate: bit[5] data lane1 main driver second delay gate: bit[6], main driver first delay gate: bit[7] Write 1 to enable delay. |
| 0xcd | data lane2 delay time: bit[3:0] clock lane delay time: bit[7:4] delay time: larger values increase delay. |
| 0xdd | data lane0 delay time: bit[3:0] data lane1 delay time: bit[7:4] delay time: larger values increase delay. |

###### 2.1.8.1.3 RK3528 signal configuration

Configure RK3528 HDMI signal strength using the DTS rockchip,phy-table property. Format:

```text
rockchip,phy-table =
     <165000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0x02 0x08 0x0d 0x18 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Using the 340000000 row above as an example:

| Parameter | Description |
| --- | --- |
| 340000000 | Maximum TMDS clock for this row. The source also says this applies below 165MHz, contradicting the 340000000 value; both are retained pending verification. |
| 0x03 | clock lane current bias control: 0x00:320uA 0x0f:920uA 40uA steps |
| 0x04 | data lane current bias control: 0x00:320uA 0x0f:920uA 40uA steps |
| 0x0c | clock lane swing: bit[4:0] swing: larger values increase amplitude. |
| 0x12 | data lane swing: bit[4:0] ESD event detection threshold: bit[7:5] swing: larger values increase amplitude. ESD event detection threshold: larger values increase the threshold. |
| 0x00 | Pre-cursor pre-emphasis:bit[2:0] Post-cursor pre-emphasis:bit[7:4] pre-emphasis: larger values increase strength; zero disables it. |
| All subsequent zero values | Unused |

##### 2.1.8.2 Signal configuration on RK3288/RK3368/RK3399/RK356X

Configure HDMI signal strength on RK3288/RK3368/RK3399/RK356X through DTS rockchip,phy-table. Format:

`<PIXELCLOCK PHY_CKSYMTXCTRL PHY_TXTERM PHY_VLEVCTRL>`.

PIXELCLOCK is the maximum pixel-clock frequency covered by that row.

PHY_CKSYMTXCTRL (register 0x09) adjusts HDMI pre-emphasis and edge slope. Increasing pre-emphasis or sloop boost increases the DATA rising/falling slope and reduces transition time:

Bit[0]: CLOCK enable. Bit[3:1]: DATA pre-emphasis. Bit[4:5]: DATA sloop boost (source bit-range notation retained).

PHY_TXTERM (register 0x19) adjusts termination resistance.

Bit[0:2]: a larger value gives greater termination resistance.

PHY_VLEVCTRL (register 0x0e) adjusts HDMI signal amplitude. Bit[0:4] controls tmds_clk +/- amplitude; a lower value gives a larger amplitude. Bit[5:9] controls tmds_data +/- amplitude with the same inverse relationship.

Example:

```text
&hdmi {
rockchip,phy-table =
   <74250000 0x8009 0x0004 0x0272>,

   <165000000 0x802b 0x0004 0x0209>,
   <297000000 0x8039 0x0005 0x028d>,
   <594000000 0x8039 0x0000 0x019d>,
   <000000000 0x0000 0x0000 0x0000>;
};
```

The row <74250000 0x8009 0x0004 0x0272> applies at pixel clocks up to 74.25MHz (720p): PHY_CKSYMTXCTRL=0x8009, PHY_TXTERM=0x0004 and PHY_VLEVCTRL=0x0272. After changing it, inspect register values with cat /sys/kernel/debug/dw-hdmi/phy to confirm the change.

#### 2.1.9 Adding special resolutions

##### 2.1.9.1 Adding timing definitions

DRM already supports most timings, but some special resolutions, for example rotated HDMI screens, may be missing. Append entries to drm_dmt_modes in kernel/drivers/gpu/drm/drm_edid.c:

```text
/* 0x58 - 4096x2160@59.94Hz RB */
{ DRM_MODE("4096x2160", DRM_MODE_TYPE_DRIVER, 556188, 4096, 4104,

     4136, 4176, 0, 2160, 2208, 2216, 2222, 0,
     DRM_MODE_FLAG_PHSYNC | DRM_MODE_FLAG_NVSYNC) },
```

| Parameter | Description |
| --- | --- |
| "4096x2160" | mode name: hdisplay x vdisplay |
| DRM_MODE_TYPE_DRIVER | mode type: set DRM_MODE_TYPE_DRIVER |
| 556188 | Pixel clock |
| 4096 | Horizontal active pixels |
| 4104 | Horizontal sync start |
| 4136 | Horizontal sync end |
| 4176 | Total pixels per line |
| 0 | hskew, normally 0 |
| 2160 | Active lines per frame |
| 2208 | Vertical sync start |
| 2216 | Vertical sync end |
| 2222 | Total lines per frame |
| 0 | vscan, normally 0 |
| vrefresh | Display frame rate |
| DRM_MODE_FLAG_PHSYNC \| DRM_MODE_FLAG_NVSYNC | hsync/vsync polarity; flags are: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |

The table above describes each parameter. The source refers to §3.2.4 for timing definitions; that reference does not match this edition's numbering and requires checking.

##### 2.1.9.2 Adding PLL settings on RK322X/RK3328/RK3528

Adding special resolutions on RK322X/RK3328/RK3528 also requires HDMI-PHY-PLL settings. The source refers to §2.1.5.2 for their calculation; that section now concerns HDCP, so the cross-reference is unresolved.

When adding a PHY configuration under DRM, add a row to the PRE-PLL table pre_pll_cfg_table. The POST-PLL table post_pll_cfg_table already covers all PHY-supported resolutions and needs no additional row. Path:

```text
kernel/drivers/phy/rockchip/phy-Rockchip-inno-hdmi-phy.c
```

```text
static const struct pre_pll_config pre_pll_cfg_table[] = {
   { 27000000, 27000000, 1, 90, 3, 2, 2, 10, 3, 3, 4, 0, 0},
   { 27000000, 33750000, 1, 90, 1, 3, 3, 10, 3, 3, 4, 0, 0},
   { 40000000, 40000000, 1, 80, 2, 2, 2, 12, 2, 2, 2, 0, 0},
   { 40000000, 50000000, 1, 100, 2, 2, 2, 1, 0, 0, 15, 0, 0},
   { 59341000, 59341000, 1, 98, 3, 1, 2, 1, 3, 3, 4, 0, 0xE6AE6B},

   { 59400000, 59400000, 1, 99, 3, 1, 1, 1, 3, 3, 4, 0, 0},
   { 59341000, 74176250, 1, 98, 0, 3, 3, 1, 3, 3, 4, 0, 0xE6AE6B},
   { 59400000, 74250000, 1, 99, 1, 2, 2, 1, 3, 3, 4, 0, 0},
   { 65000000, 65000000, 1, 130, 2, 2, 2, 1, 0, 0, 12, 0, 0},
   { 65000000, 81250000, 3, 325, 0, 3, 3, 1, 0, 0, 10, 0, 0},
   { 71000000, 71000000, 3, 284, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 71000000, 88750000, 3, 355, 0, 3, 3, 1, 0, 0, 10, 0, 0},
   { 74176000, 74176000, 1, 98, 1, 2, 2, 1, 2, 3, 4, 0, 0xE6AE6B},
   { 74250000, 74250000, 1, 99, 1, 2, 2, 1, 2, 3, 4, 0, 0},
   { 74176000, 92720000, 4, 494, 1, 2, 2, 1, 3, 3, 4, 0, 0x816817},
   { 74250000, 92812500, 4, 495, 1, 2, 2, 1, 3, 3, 4, 0, 0},
   { 83500000, 83500000, 2, 167, 2, 1, 1, 1, 0, 0, 6, 0, 0},

   { 83500000, 104375000, 1, 104, 2, 1, 1, 1, 1, 0, 5, 0, 0x600000},
   { 85750000, 85750000, 3, 343, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 88750000, 88750000, 3, 355, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 88750000, 110937500, 1, 110, 2, 1, 1, 1, 1, 0, 5, 0, 0xF00000},
   {108000000, 108000000, 1, 90, 3, 0, 0, 1, 0, 0, 5, 0, 0},
   {108000000, 135000000, 1, 90, 0, 2, 2, 1, 0, 0, 5, 0, 0},
   {119000000, 119000000, 1, 119, 2, 1, 1, 1, 0, 0, 6, 0, 0},
   {119000000, 148750000, 1, 99, 0, 2, 2, 1, 0, 0, 5, 0, 0x2AAAAA},
   {148352000, 148352000, 1, 98, 1, 1, 1, 1, 2, 2, 2, 0, 0xE6AE6B},
   {148500000, 148500000, 1, 99, 1, 1, 1, 1, 2, 2, 2, 0, 0},
   {148352000, 185440000, 4, 494, 0, 2, 2, 1, 3, 2, 2, 0, 0x816817},
   {148500000, 185625000, 4, 495, 0, 2, 2, 1, 3, 2, 2, 0, 0},
   {162000000, 162000000, 1, 108, 0, 2, 2, 1, 0, 0, 4, 0, 0},

   {162000000, 202500000, 1, 135, 0, 2, 2, 1, 0, 0, 5, 0, 0},
   {296703000, 296703000, 1, 98, 0, 1, 1, 1, 0, 2, 2, 0, 0xE6AE6B},
   {297000000, 297000000, 1, 99, 0, 1, 1, 1, 0, 2, 2, 0, 0},
   {296703000, 370878750, 4, 494, 1, 2, 0, 1, 3, 1, 1, 0, 0x816817},
   {297000000, 371250000, 4, 495, 1, 2, 0, 1, 3, 1, 1, 0, 0},
   {593407000, 296703500, 1, 98, 0, 1, 1, 1, 0, 2, 1, 0, 0xE6AE6B},
   {594000000, 297000000, 1, 99, 0, 1, 1, 1, 0, 2, 1, 0, 0},
   {593407000, 370879375, 4, 494, 1, 2, 0, 1, 3, 1, 1, 1, 0x816817},
   {594000000, 371250000, 4, 495, 1, 2, 0, 1, 3, 1, 1, 1, 0},
   {593407000, 593407000, 1, 98, 0, 2, 0, 1, 0, 1, 1, 0, 0xE6AE6B},
   {594000000, 594000000, 1, 99, 0, 2, 0, 1, 0, 1, 1, 0, 0},
   {    ~0UL,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}

};

static const struct post_pll_config post_pll_cfg_table[] = {
   {33750000, 1, 40, 8, 1},
   {33750000, 1, 80, 8, 2},
   {33750000, 1, 10, 2, 4},
   {74250000, 1, 40, 8, 1},
   {74250000, 18, 80, 8, 2},
   {74250000, 1, 20, 4, 8},
   {148500000, 2, 40, 4, 3},
   {148500000, 1, 10, 2, 8},
   {297000000, 4, 40, 2, 3},
   {297000000, 2, 20, 2, 8},

   {594000000, 8, 40, 1, 3},
   {594000000, 4, 20, 1, 8},
   {    ~0UL, 0, 0, 0, 0}
};
```

Definitions of struct pre_pll_config and struct post_pll_config follow. In Linux 4.4/4.19 they effectively split struct ext_pll_config_tab from Linux 3.10.

```text
struct pre_pll_config {
   unsigned long pixclock;

   unsigned long tmdsclock;
   u8 prediv;
   u16 fbdiv;
   u8 tmds_div_a;
   u8 tmds_div_b;
   u8 tmds_div_c;
   u8 pclk_div_a;
   u8 pclk_div_b;
   u8 pclk_div_c;
   u8 pclk_div_d;
   u8 vco_div_5_en;
   u32 fracdiv;
};


struct post_pll_config {
   unsigned long tmdsclock;
   u8 prediv;
   u16 fbdiv;
   u8 postdiv;
   u8 version;
};
```

pre_pll_config parameters:

| Parameter | Description |
| --- | --- |
| pixclock | Pixel clock of the HDMI output mode |
| tmdsclock | TMDS clock of the HDMI output mode |
| prediv | pre-pll-pre-divider |
| fbdiv | pre-pll-feedback-divider |
| tmds_div_a | tmds-dividera |
| tmds_div_b | tmds-dividerb |
| tmds_div_c | tmds-dividerc |
| pclk_div_a | pclk-dividera |
| pclk_div_b | pclk-dividerb |
| pclk_div_c | pclk-dividerc |
| pclk_div_d | pclk-dividerd |
| vco_div_5_en | Whether pin_hd20_pclk comes directly from VCO / 5; used for specific clocks |
| fracdiv | pre-pll-fractional-feedback-divider |

post_pll_config parameters:

| Parameter | Description |
| --- | --- |
| tmdsclock | TMDS clock of the HDMI output mode |
| prediv | post-pll-pre-divider |
| fbdiv | post-pll-feedback-divider |
| postdiv | post-pll-post-divider |
| version | Chip revision: choose POST-PLL by clock and revision. 1: RK322X and early RK322XH samples at TMDS &lt;=74.25MHz. 2: production RK322XH at TMDS &lt;=74.25MHz. 3: RK322X/RK322XH at TMDS >74.25MHz, using identical settings. 4: some RK322X parts are unstable at POST VCO=1080MHz but stable at 270MHz and need separate handling. 8: RK3528-specific settings. |

For TMDS CLOCK=74.25MHz on production RK3328 silicon, select POST-PLL settings as follows:

(1) Find the TMDS CLOCK interval in post_pll_cfg_table. At 74.25MHz, 33.75MHz < TMDS CLOCK <= 74.25MHz selects these two entries:

```text
{74250000, 1, 40, 8, 1},
{74250000, 18, 80, 8, 2},
```

(2) Select by chip revision. For production RK3328 with TMDS CLOCK <= 74.25MHz, choose version=2, giving:

```text
{74250000, 18, 80, 8, 2},
```

(3) The final values are prediv=18, fbdiv=80 and postdiv=8. In the Linux 3.10 driver these correspond to ppll_nd, ppll_nf and ppll_no in struct ext_pll_config_tab. Because this is production RK3328 and TMDS CLOCK <= 74.25MHz, add the entry to RK322XH_V1_PLL_TABLE.

##### 2.1.9.3 Adding PLL settings on RK3288/RK3368/RK3399/RK356X

HDMI-PHY-PLL settings for RK3288/RK3368/RK3399/RK356X are stored in rockchip_mpll_cfg and rockchip_mpll_cfg_420:

```text
static const struct dw_hdmi_mpll_config rockchip_mpll_cfg[] = {
   {

      30666000, {
         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40f3, 0x0000 },
      },
   }, {
      36800000, {
         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40a2, 0x0001 },
      },
   }, {

      46000000, {
         { 0x00b3, 0x0000 },
         { 0x2142, 0x0001 },
         { 0x40a2, 0x0001 },
      },
   }, {
```

Path:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
```

rockchip_mpll_cfg configures RGB/YUV444/YUV422; rockchip_mpll_cfg_420 configures YUV420.

Definition of dw_hdmi_mpll_config:

```text
struct dw_hdmi_mpll_config {
      unsigned long mpixelclock;

      struct {
           u16 cpce;
           u16 gmp;
      } res[DW_HDMI_RES_MAX];
};
```

Parameter descriptions:

| Parameter | Description |
| --- | --- |
| mpixelclock | Pixel clock |
| cpce | OPMODE_PLLCFG register value |
| gmp | PLLGMPCTRL register value |

Using the first rockchip_mpll_cfg entry as an example:

```text
static const struct dw_hdmi_mpll_config rockchip_mpll_cfg[] = {
   {
      30666000, {

         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40f3, 0x0000 },
      },
   }, {
```

The HDMI driver first checks whether the color format is YUV420. If so, it selects rockchip_mpll_cfg_420; otherwise it selects rockchip_mpll_cfg. 30666000 means the entry applies to pixel clocks at or below 30666000. {0x00b3, 0x0000}, {0x2153, 0x0000} and {0x40f3, 0x0000} correspond to 8-, 10- and 12-bit depth respectively; the source implementation actually supports only 8- and 10-bit modes.

Parameter values require the PHY datasheet. To add HDMI-PHY-PLL settings, provide the required pixel clock to the FAE, then add the supplied configuration to rockchip_mpll_cfg or rockchip_mpll_cfg_420 according to the rules above.

##### 2.1.9.4 Adding PLL settings on RK3588/RK3576

RK3588/RK3576 drivers calculate PLL frequencies automatically; adding a resolution needs no separate PLL configuration.

See §2.1.4 for PLL allocation.

#### 2.1.10 Enabling audio

On RK3368 and RK3288, the HDMI sound card and codec are shared by default. Verify this configuration:

```text
&hdmi_analog_sound {
      status = "okay";

}
```

On RK3399, HDMI and DP share the sound card:

```text
&hdmi_dp_sound {
         status = "okay";

};
```

### 2.2 Android display-framework configuration

Rockchip adds system properties to the Android display framework to configure displays for product requirements.

#### 2.2.1 Primary and secondary display interfaces

| Property | Function |
| --- | --- |
| sys.hwc.device.primary vendor.hwc.device.primary (used after Android 9.0) | Assign primary display interface |
| sys.hwc.device.extend vendor.hwc.device.extend (used after Android 9.0) | Assign secondary display interface |

Add these two properties to system.prop in the product configuration directory, for example:

```text
device/rockchip/rk3368/rk3368_box/system.prop
```

By default, when these properties are unset, interfaces without hotplug support, such as CVBS/MIPI/LVDS, become primary and hotpluggable HDMI/DP interfaces become secondary. Typically each role has one interface. For example, RK3399 BOX SDK defaults to HDMI primary and DP secondary.

```text
sys.hwc.device.primary=HDMI-A
sys.hwc.device.extend=DP
```

After Android 9.0, the properties change to:

```text
vendor.hwc.device.primary=HDMI-A
vendor.hwc.device.extend=DP
```

When several interfaces are assigned to a primary or secondary role, hotpluggable devices take priority. For example, the default RK3368 BOX SDK configuration is:

```text
sys.hwc.device.primary=HDMI-A,TV
```

After Android 9.0, the properties change to:

```text
vendor.hwc.device.primary=HDMI-A,TV
```

With HDMI connected, the primary display uses HDMI; with it disconnected, it uses CVBS. Because the primary framebuffer resolution cannot change dynamically, explicitly set it when two or more interfaces serve as primary. Interface names are defined in hardware/rockchip/hwcomposer/drmresources.cpp:

```text
struct type_name connector_type_names[] = {
   { DRM_MODE_CONNECTOR_Unknown, "unknown" },//未知接⼝
   { DRM_MODE_CONNECTOR_VGA, "VGA" }, //VGA

   { DRM_MODE_CONNECTOR_DVII, "DVI-I" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_DVID, "DVI-D" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_DVIA, "DVI-A" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_Composite, "composite" },//不⽀持
   { DRM_MODE_CONNECTOR_SVIDEO, "s-video" },//S端⼦

   { DRM_MODE_CONNECTOR_LVDS, "LVDS" },//LVDS
   { DRM_MODE_CONNECTOR_Component, "component" },//分量信号YPbPr
   { DRM_MODE_CONNECTOR_9PinDIN, "9-pin DIN" },//不⽀持
   { DRM_MODE_CONNECTOR_DisplayPort, "DP" },//DP
   { DRM_MODE_CONNECTOR_HDMIA, "HDMI-A" },//HDMI A型⼝
   { DRM_MODE_CONNECTOR_HDMIB, "HDMI-B" },//HDMI B型⼝，不⽀持
   { DRM_MODE_CONNECTOR_TV, "TV" },// CVBS
   { DRM_MODE_CONNECTOR_eDP, "eDP" },//EDP
   { DRM_MODE_CONNECTOR_VIRTUAL, "Virtual" },//不⽀持
   { DRM_MODE_CONNECTOR_DSI, "DSI" },//MIPI
};
```

#### 2.2.2 Querying primary and secondary interfaces

These read-only properties return the names of the primary and secondary output interfaces respectively:

| Property | Function |
| --- | --- |
| sys.hwc.device.main vendor.hwc.device.main(used after Android 9.0) | Query primary output interface |
| sys.hwc.device.aux vendor.hwc.device.main (used after Android 9.0) | Query secondary output interface |

#### 2.2.3 Framebuffer resolution

Framebuffer resolution is the resolution used to draw the UI, not the HDMI output resolution. When they differ, scaling is applied. Configure framebuffer resolution with:

```text
persist.sys.framebuffer.main=1920x1080
```

After Android 9.0, the properties change to:

```text
persist.vendor.framebuffer.main=1920x1080
```

#### 2.2.4 Resolution filtering

The initial resolution list can be unnecessarily large. The SDK HWC module therefore filters it using an allowlist:

```text
device/rockchip/common/resolution_white.xml
```

HWC filters the initial list using this configuration file before passing it upward. Each resolution block in the XML defines an allowed resolution. Fields are:

| Field | Description |
| --- | --- |
| clock | Pixel clock |
| hdisplay | Horizontal active pixels |
| hsync_start | Horizontal sync start |
| hsync_end | Horizontal sync end |
| htotal | Total pixels per line |
| hskew | Horizontal skew, normally 0 |
| vdisplay | Active lines per frame |
| vsync_start | Vertical sync start |
| vsync_end | Vertical sync end |
| vtotal | Total lines per frame |
| vscan | Frame scan value, normally 0 |
| vrefresh | Display frame rate |
| flags | Flag definitions: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |
| vic | VIC defined by HDMI; use 0 if undefined |

The timing definitions are illustrated below:

![Technical figure from the Chinese source, p. 31](/docs/rockchip-hdmi/assets/cn-p31-1.png)

#### 2.2.5 HDMI settings options

The system Settings app can change HDMI resolution and other properties through its UI.

Android 7.x shows HDMI settings by default. For Android 8.x and later, add this property in the product directory under device:

```text
BOARD_SHOW_HDMI_SETTING := true
```

By default, the UI shows only secondary-display settings. To change this, edit HdmiSettings.java in package/apps/Settings:

```text
int value = SystemProperties.getInt("persist.hdmi.ui.state", ???);
```

Replace ??? with 0 for the secondary-display UI, 1 for the primary-display UI, or 2 for both.

### 2.3 Common debugging methods

#### 2.3.1 Inspecting VOP status

Inspect VOP status with:

```text
cat /sys/kenrel/debug/dri/0/summary
```

![Technical figure from the Chinese source, p. 32](/docs/rockchip-hdmi/assets/cn-p32-1.png)

The log above is source output from an RK3399 connected to HDMI. It provides three kinds of information:

VOP status: VOPB is enabled and VOPL is disabled.

Connector state: VOPB feeds HDMI. bus_format=0x2025 means YUV444 8-bit; output_mode=0x0f means the VOP output bus uses ROCKCHIP_OUT_MODE_AAAA, outputting 1920x1080P60. Common bus_format values are defined in kernel uapi/linux/media-bus-format.h:

```text
#define MEDIA_BUS_FMT_RGB888_1X24  0x100a //RGB888
#define MEDIA_BUS_FMT_RGB101010_1X30 0x1018 //RGB101010
#define MEDIA_BUS_FMT_YUV8_1X24    0x2025 //YUV444 8bit

#define MEDIA_BUS_FMT_YUV10_1X30   0x2016 //YUV444 10bit
#define MEDIA_BUS_FMT_UYYVYY8_0_5X24 0x2026 //YUV420 8bit
#define MEDIA_BUS_FMT_UYYVYY10_0_5X30 0x2027 //YUV420 10bit
```

Common output_mode values are defined in drivers/gpu/drm/rockchip/rockchip_drm_vop.h:

```text
#define ROCKCHIP_OUT_MODE_P888 0
#define ROCKCHIP_OUT_MODE_P666 1
#define ROCKCHIP_OUT_MODE_P565 2

#define ROCKCHIP_OUT_MODE_S888 8
#define ROCKCHIP_OUT_MODE_S888_DUMMY 12
#define ROCKCHIP_OUT_MODE_YUV420 14
/* for use special outface */
#define ROCKCHIP_OUT_MODE_AAAA 15
```

Layer configuration: win0 and win2 are enabled. win2 uses an ARGB buffer of 29x37, a 29x37 destination window and top-left coordinate (385,543). win0 uses an NV12 buffer of 3840x2160, a 1920x1080 destination window and top-left coordinate (0,0).

#### 2.3.2 Inspecting connector status

/sys/class/drm lists graphics devices registered by the driver. The RK3399 BOX directory example below contains card0-HDMI-A-1 and card0-DP-1, representing HDMI and DP.

![Technical figure from the Chinese source, p. 33](/docs/rockchip-hdmi/assets/cn-p33-1.png)

For example, card0-HDMI-A-1 contains:

Enabled: enable state.

Status: connection state.

Mode: current output resolution.

Modes: resolutions supported by the attached device.

Audioformat: audio formats supported by the attached device.

Edid: attached-device EDID; save it with cat edid > /data/edid.bin.

#### 2.3.3 Inspecting HDMI operation

HDMI operation can be inspected if the following commit is present:

```text
commit eaca91814449199b1e6ad0b9fe0bba2215497c97
Author: Zheng Yang <zhengyang@rock-chips.com>

Date: Mon Nov 27 16:56:21 2017 +0800

      drm: bridge: dw-hdmi: add hdmi status debugfs node
```

Read current HDMI output status with:

```text
cat /sys/kernel/debug/dw-hdmi/status
```

![Technical figure from the Chinese source, p. 33](/docs/rockchip-hdmi/assets/cn-p33-2.png)

![Technical figure from the Chinese source, p. 34](/docs/rockchip-hdmi/assets/cn-p34-1.png)

HDMI Output Status reports PHY state. Further details appear only when the PHY is enabled.

Pixel Clk is the current output pixel clock.

TMDS Clk is the current HDMI character rate.

Color Format is RGB, YUV444, YUV422 or YUV420.

Color Depth is 8bit, 10bit, 12bit or 16bit.

Colorimery identifies the color standard: ITU.BT601, ITU.BIT709 or ITU.BT2020 (source spellings retained).

EOTF identifies the HDR electro-optical transfer function:

| EOTF | Meaning |
| --- | --- |
| Unsupported | HDMI cannot send HDR information |
| Not Defined | Undefined |
| Off | No HDR information sent |
| SDR | SDR curve |
| ST2084 | ST2084 EOTF |
| HLG | HLG EOTF |

(x0,y0), (x1,y1), (x2,y2), (white x,white y), max lum, min lum, max cll and maxfall are static HDR descriptor values. The source states they appear only for EOTF values SDR, ST2084 or HLG.

Read HDMI controller registers with:

```text
cat /sys/kenrel/debug/dw-hdmi/ctrl
```

Registers can also be modified. To write 0xF8 to register 0x1000:

```text
echo 1000 f8 > /sys/kenrel/debug/dw-hdmi/ctrl
```

On RK3288/RK3368/RK3399, read HDMI PHY registers with:

```text
cat /sys/kenrel/debug/dw-hdmi/phy
```

PHY writes are similar to controller writes. To write 0x8002 to register 0x06:

```text
echo 06 8002 > /sys/kenrel/debug/dw-hdmi/phy
```

#### 2.3.4 Inspecting HDMI CEC status

Read HDMI CEC status with:

```text
cat /sys/kernel/debug/cec/cec0/status
```

![Technical figure from the Chinese source, p. 35](/docs/rockchip-hdmi/assets/cn-p35-1.png)

The output above means:

configured: whether the CEC adapter is configured; 1=yes, 0=no.

configuring: whether configuration is in progress; 1=in progress, 0=finished or not started.

phys_addr: CEC physical address; f.f.f.f means no physical address has been obtained.

number of LAs: logical-address count, usually 1 and rarely 2.

LA mask represents bound logical addresses as (1 << logical_address). For example, 0x0010 shifted right by 4 becomes 1, indicating address 4; 0x0800 shifted right by 11 becomes 1, indicating address 11. 0x0000 means none is bound.

has CEC follower means received CEC messages are handled by userspace. in passthrough mode means the kernel does not handle CEC core messages but forwards all of them to userspace.

pending transmits is the number of CEC messages waiting to be sent.

#### 2.3.5 Forcing HDMI on or off

Force HDMI on:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status
```

Force HDMI off:

```text
echo off > /sys/class/drm/card0-HDMI-A-1/status
```

Restore hotplug detection:

```text
echo detect > /sys/class/drm/card0-HDMI-A-1/status
```

#### 2.3.6 Setting resolution from the command line

Android resolution can be changed by setting properties from the command line. Changing resolution in Settings also updates the corresponding properties, as explained below.

##### 2.3.6.1 Resolution on Android 7.x and 8.x

| Property | Description |
| --- | --- |
| persist.sys.resolution.main | Set primary resolution using its timing; source reference §3.2.4 (here §2.2.4). |
| persist.sys.resolution.aux | Set secondary resolution using its timing; source reference §3.2.4 (here §2.2.4). |
| sys.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Set primary/secondary resolution through persist.sys.resolution.main and persist.sys.resolution.aux. After each change, increment sys.display.timeline by 1 and trigger a UI update, such as moving the mouse, to apply it. Examples:

Set 4K60:

```text
setprop persist.sys.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5
setprop sys.display.timeline 1
```

Set 1080p60:

```text
setprop persist.sys.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5
setprop sys.display.timeline 2
```

Set 720P60:

```text
setprop persist.sys.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5

setprop sys.display.timeline 3
```

Set 480P60:

```text
setprop persist.sys.resolution.main 720x480@59.94-736-798-858-489-495-525-a
setprop sys.display.timeline 4
```

##### 2.3.6.2 Resolution on Android 9.0 and later

Old and new Android 9.0 releases use different resolution properties, depending on the HWC version. New Android 9.0 SDKs and later Android versions use the new properties.

```text
commit 6f772a162893dd0242b6644fa32166e1ac15b2c0
Author: libin <bin.li@rock-chips.com>
Date: Wed May 12 15:00:05 2021 +0800


   DrmConnector : Add UpdateDisplayMode function

   In order to adapt to the three-screen version.

   The hwc switching resolution will be in accordance with
the following priority:
 1.persist.vendor.resolution.<Connector-type>-<Connector-ID>
 2.persist.vendor.resolution.main(aux)

 3.baseparameter(if exist)
 4.use "Auto"

Version: 1.1.137

Signed-off-by: libin <bin.li@rock-chips.com>
Change-Id: I73e216047ed5423929d7a091572d717c4ffdf50c
```

HWC containing the commit above uses the new properties:

| Property | Description |
| --- | --- |
| persist.vendor.resolution.HDMI-A-0 | Set HDMI0 resolution; use HDMI-A-1 for HDMI1. The value is its timing; source reference §3.2.4 (here §2.2.4). |
| vendor.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Without the above change, HWC uses the old properties:

| Property | Description |
| --- | --- |
| persist.vendor.resolution.main | Set primary resolution using its timing; source reference §3.2.4 (here §2.2.4). |
| persist.vendor.resolution.aux | Set secondary resolution using its timing; source reference §3.2.4 (here §2.2.4). |
| vendor.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Set primary/secondary resolution through persist.vendor.resolution.main and persist.vendor.resolution.aux. After each change, increment vendor.display.timeline by 1 and trigger a UI update, for example by moving the mouse. Examples:

Set 4K60:

```text
setprop persist.vendor.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5

setprop vendor.display.timeline 1
```

Set 1080p60:

```text
setprop persist.vendor.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5

setprop vendor.display.timeline 2
```

Set 720P60:

```text
setprop persist.vendor.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5
setprop vendor.display.timeline 3
```

Set 480P60:

```text
setprop persist.vendor.resolution.main 720x480@59.94-736-798-858-489-495-525-
a
setprop vendor.display.timeline 4
```

#### 2.3.7 Setting color from the command line

Android color output can be configured through command-line properties. Changing color in Settings also updates those properties, as explained below.

##### 2.3.7.1 Color on Android 7.x and 8.x

| Property | Description |
| --- | --- |
| persist.sys.color.main | Set primary color as format-depth, e.g. RGB-8bit for RGB with 8-bit components (24-bit RGB). Formats: RGB, YCBCR444, YCBCR422, YCBCR420. Depths: 8bit, 10bit. |
| persist.sys.color.aux | Set secondary color; parameters match primary. |
| sys.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Set primary/secondary color using persist.sys.color.main and persist.sys.color.aux. Increment sys.display.timeline by 1 after each change, then trigger a UI update, such as moving the mouse. Example:

```text
setprop persist.sys.color.main RGB-8bit
setprop sys.display.timeline 1
```

Set output to RGB with 8-bit component depth (24-bit RGB).

##### 2.3.7.2 Color on Android 9.0 and later

As with resolution settings in §2.3.6.2 (the source says §3.3.6.2), old and new Android versions use different color properties.

```text
commit 6f772a162893dd0242b6644fa32166e1ac15b2c0
Author: libin <bin.li@rock-chips.com>

Date: Wed May 12 15:00:05 2021 +0800

   DrmConnector : Add UpdateDisplayMode function

   In order to adapt to the three-screen version.
The hwc switching resolution will be in accordance with
the following priority:

 1.persist.vendor.resolution.<Connector-type>-<Connector-ID>
 2.persist.vendor.resolution.main(aux)
 3.baseparameter(if exist)
 4.use "Auto"

Version: 1.1.137

Signed-off-by: libin <bin.li@rock-chips.com>
Change-Id: I73e216047ed5423929d7a091572d717c4ffdf50c
```

HWC containing the commit above uses the new properties:

| Property | Description |
| --- | --- |
| persist.vendor.color.HDMI-A-0 | Set HDMI0 color; use HDMI-A-1 for HDMI1. Format: color-depth, e.g. RGB-8bit for RGB with 8-bit components (24-bit RGB). Formats: RGB, YCBCR444, YCBCR422, YCBCR420. Depths: 8bit, 10bit. |
| vendor.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Without the above change, HWC uses the old properties:

| Property | Description |
| --- | --- |
| persist.vendor.color.main | Set primary color as format-depth, e.g. RGB-8bit for RGB with 8-bit components (24-bit RGB). Formats: RGB, YCBCR444, YCBCR422, YCBCR420. Depths: 8bit, 10bit. |
| persist.vendor.color.aux | Set secondary color; parameters match primary. |
| vendor.display.timeline | Refresh the display timeline; increment by one for each new resolution. |

Set primary/secondary color using persist.vendor.color.main and persist.vendor.color.aux. After each change, increment vendor.display.timeline by 1 and trigger a UI update, such as moving the mouse. Example:

```text
setprop persist.vendor.color.main RGB-8bit
setprop vendor.display.timeline 1
```

Set RGB output with 8-bit component depth (24-bit RGB).

#### 2.3.8 Overscan settings

TV differences can cause the image to extend beyond the screen or leave black borders. Adjust overscan scaling to correct this.

On Android, overscan can be changed through command-line properties or Settings. Settings also updates the corresponding properties, as described below.

##### 2.3.8.1 Overscan on Android 7.x and 8.x

| Property | Description |
| --- | --- |
| persist.sys.overscan.main | Set primary overscan. Format: overscan left,top,right,bottom. These specify left, top, right and bottom overscan values. Minimum=1; maximum is persist.sys.overscan.max, or 100 if unset. |
| persist.sys.overscan.aux | Set secondary overscan; parameters match primary. |

Example:

```text
setprop persist.sys.overscan.main "overscan 70,70,70,70"
```

Set overscan to 70 in all four directions.

##### 2.3.8.2 Overscan on Android 9.0 and later

Select properties according to the Android version, as in §2.3.6.2 (source reference: §3.3.6.2).

New properties:

| Property | Description |
| --- | --- |
| persist.vendor.overscan.HDMI-A-0 | Set HDMI0 overscan (the source says color); use HDMI-A-1 for HDMI1. Format: overscan left,top,right,bottom. These specify left, top, right and bottom overscan values. Minimum=1; maximum is persist.vendor.overscan.max, or 100 if unset. |

Old properties:

| Property | Description |
| --- | --- |
| persist.vendor.overscan.main | Set primary overscan. Format: overscan left,top,right,bottom. These specify left, top, right and bottom overscan values. Minimum=1; maximum is persist.vendor.overscan.max, or 100 if unset. |
| persist.vendor.overscan.aux | Set secondary overscan; parameters match primary. |

Example:

```text
setprop persist.vendor.overscan.main "overscan 70,70,70,70"
```

Set overscan to 70 in all four directions.

#### 2.3.9 Brightness, contrast, saturation and hue

Android supports these parameters through command-line properties and Settings. Settings updates the corresponding properties, as explained below.

##### 2.3.9.1 Brightness, contrast, saturation and hue on Android 7.x and 8.x

| BCSH | Range | Description |
| --- | --- | --- |
| Brightness | Integer 0–100, default 50 | persist.sys.brightness.main persist.sys.brightness.aux |
| Contrast | Integer 0–100, default 50 | persist.sys.contrast.main persist.sys.contrast.aux |
| Saturation | Integer 0–100, default 50 | persist.sys.saturation.main persist.sys.saturation.aux |
| Hue | Integer 0–100, default 50 | persist.sys.hue.main persist.sys.hue.aux |

Example:

```text
setprop persist.sys.brightness.main 70
setprop vendor.display.timeline 1
```

Set primary-display brightness through persist.sys.brightness.main. After each change, increment vendor.display.timeline by 1 and trigger a UI update, such as moving the mouse. The source's vendor property in this older-Android section is retained pending verification.

##### 2.3.9.2 Brightness, contrast, saturation and hue on Android 9.0 and later

Select properties according to Android version, as in §2.3.6.2 (source reference: §3.3.6.2).

New properties:

| BCSH | Range | Description |
| --- | --- | --- |
| Brightness | Integer 0–100, default 50 | persist.vendor.brightness.HDMI-A-0 |
| Contrast | Integer 0–100, default 50 | persist.vendor.contrast.HDMI-A-0 |
| Saturation | Integer 0–100, default 50 | persist.vendor.saturation.HDMI-A-0 |
| Hue | Integer 0–100, default 50 | persist.vendor.hue.HDMI-A-0 |

Old properties:

| BCSH | Range | Description |
| --- | --- | --- |
| Brightness | Integer 0–100, default 50 | persist.vendor.brightness.main persist.vendor.brightness.aux |
| Contrast | Integer 0–100, default 50 | persist.vendor.contrast.main persist.vendor.contrast.aux |
| Saturation | Integer 0–100, default 50 | persist.vendor.saturation.main persist.vendor.saturation.aux |
| Hue | Integer 0–100, default 50 | persist.vendor.hue.main persist.vendor.hue.aux |

Example:

```text
setprop persist.vendor.brightness.main 70
setprop sys.display.timeline 1
```

Set primary-display brightness using persist.vendor.brightness.main, increment vendor.display.timeline by 1 after each change, then trigger a UI update such as moving the mouse.

### 2.4 Troubleshooting

#### 2.4.1 No signal, unsupported format, unstable picture or colored dots/lines after connection or resolution changes

(1) Check the current HDMI resolution (§2.3.2; source reference §3.3.2).

(2) Lower HDMI resolution and check whether the TV displays normally (§2.3.6; source reference §3.3.6).

(3) Try a known-good HDMI cable.

(4) If steps 2 or 3 restore the image, physical-signal compatibility is usually involved. Inspect the hardware and measure HDMI signals for further analysis.

(5) If HDMI signals fail requirements, adjust HDMI PHY settings (§2.1.8; the source refers to §3.1.7).

#### 2.4.2 No signal or unsupported format during video playback

Check whether kernel DTS enables video-related DDR frequency scaling. If so, set auto-freq-en = <0>; to disable automatic scaling for this diagnostic test.

```text
dmc: dmc {
     compatible = "rockchip,rk3328-dmc";

     devfreq-events = <&dfi>;
     clocks = <&cru SCLK_DDRCLK>;
     clock-names = "dmc_clk";
     operating-points-v2 = <&dmc_opp_table>;
     ddr_timing = <&ddr_timing>;
     upthreshold = <40>;
     downdifferential = <20>;
     system-status-freq = <
           /*system status   freq(KHz)*/
           SYS_STATUS_NORMAL 786000
           SYS_STATUS_REBOOT 786000
           SYS_STATUS_SUSPEND 786000
           SYS_STATUS_VIDEO_1080P 786000

           SYS_STATUS_VIDEO_4K 786000
           SYS_STATUS_VIDEO_4K_10B 933000
           SYS_STATUS_PERFORMANCE 933000
           SYS_STATUS_BOOST  933000
     >;
     auto-min-freq = <786000>;
     auto-freq-en = <0>;
     #cooling-cells = <2>;
     status = "disabled";
```

#### 2.4.3 No signal, black screen or corruption on some TVs

(1) Check current HDMI resolution (§2.3.2; source reference §3.3.2).

(2) Lower HDMI resolution and check the display (§2.3.6; source reference §3.3.6).

(3) Try a known-good HDMI cable.

(4) Recovery after step 2 or 3 usually points to HDMI physical-signal compatibility. Inspect hardware and test HDMI signals.

(5) If signals fail requirements, adjust HDMI PHY settings (§2.1.8; source reference §3.1.7).

(6) If HDMI signals meet requirements, try changing these register values:

```text
kernel\drivers\gpu\drm\bridge\synopsys\dw-hdmi.c
/* HDMI Initialization Step B.4 */
static void dw_hdmi_enable_video_path(struct dw_hdmi *hdmi)
{

   /* control period minimum duration */
   hdmi_writeb(hdmi, 12, HDMI_FC_CTRLDUR);
```

Gradually increase HDMI_FC_CTRLDUR, up to 223, and check whether normal display returns.

#### 2.4.4 Default resolution when EDID reads fail

```text
Commit 727e0fe68d8f422698f4e257cb7c04f90b8692c0
Author: xuhuicong xhc@rock-chips.com

Date: Tue Sep 26 17:32:56 2017 +0800
drm/edid: output common tv resolution and hdmi mode if no read the correct edid
Change-Id: Ib7379340e8c1d59382553d21b60165fe5fb371e8
Signed-off-by: xuhuicong xhc@rock-chips.com
```

With the above commit present, change def_modes to the required VIC. In the example below, 4 corresponds to 720P60.

```text
kernel\drivers\gpu\drm\bridge\synopsys\dw-hdmi.c
```

```text
static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
{
   struct dw_hdmi *hdmi = container_of(connector, struct dw_hdmi,

                  connector);
   struct edid *edid;
   struct drm_display_mode *mode;
   const u8 def_modes[6] = {4, 16, 31, 19, 17, 2};
   struct drm_display_info *info = &connector->display_info;
```

#### 2.4.5 Forcing a specific output resolution

To ignore EDID restrictions and force a resolution on RK3288/RK3368/RK3399/RK356X, check for this commit:

```text
commit b318f175080ca98173d75fcf436beeee64092303
Author: Algea Cao <algea.cao@rock-chips.com>
Date: Fri Nov 17 09:55:52 2023 +0800


   drm/bridge: synopsys: Support hdmi force output

   Support hdmi output specific resolution and color format
   regardless of whether hdmi is connected.

   Signed-off-by: Algea Cao <algea.cao@rock-chips.com>
   Change-Id: I228a74d128aa818166f589798897729473d97610
```

On RK3588/RK3576, check for this commit:

```text
commit ed5631fa515a297b45cef5a1330b516f56e113dc
Author: Algea Cao <algea.cao@rock-chips.com>

Date: Thu Dec 28 10:16:17 2023 +0800

   drm/bridge: dw-hdmi-qp: Support hdmi force output

   Support hdmi output specific resolution and color format
   regardless of whether hdmi is connected.

   Signed-off-by: Algea Cao <algea.cao@rock-chips.com>
   Change-Id: I3f18aeb04427846e06b6a4397a4c6df77bbbcab2
```

With these commits, configure the required resolution and color format directly in DTS:

```text
&hdmi {
      status = "okay";

      force-output;
      force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      force_timing {
           clock-frequency = <594000000>;
           hactive = <3840>;
           vactive = <2160>;
           hback-porch = <296>;
           hfront-porch = <176>;
           vback-porch = <72>;
           vfront-porch = <8>;
           hsync-len = <88>;
           vsync-len = <10>;
           hsync-active = <1>;

           vsync-active = <1>;
           de-active = <0>;
           pixelclk-active = <0>;
      };
};
```

(1) force-output: flag forcing HDMI output.

(2) force-bus-format: force the specified color format.

(3) force_timing: force the specified resolution timing.

If those commits are absent, apply the following changes:

![Technical figure from the Chinese source, p. 46](/docs/rockchip-hdmi/assets/cn-p46-1.png)

Transcription of legible source code. The screenshot itself is cropped; this is not a complete applicable patch.

```text
diff --git a/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c b/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
index 5ed021b..9a7f18c 100644
--- a/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
+++ b/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
@@ -2497,7 +2497,7 @@ static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
                                             connector);
        struct edid *edid;
        struct drm_display_mode *mode;
-       const u8 def_modes[6] = {4, 16, 31, 19, 17, 2};
+       const u8 def_modes[6] = {107, 16, 31, 19, 17, 2};
        struct hdr_static_metadata *metadata =
                        &connector->display_info.hdmi.hdr_panel_metadata;
        int i, ret = 0;
@@ -2506,6 +2506,7 @@ static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
                return 0;

        edid = drm_get_edid(connector, hdmi->ddc);
+       edid = NULL;
        if (edid) {
                dev_dbg(hdmi->dev, "got edid: width[%d] x height[%d]\n",
                        edid->width_cm, edid->height_cm);
diff --git a/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c b/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
index bdc96cd4..6653dfa 100644
--- a/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
+++ b/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
@@ -488,10 +488,12 @@ dw_hdmi_rockchip_mode_valid(struct drm_connector *connector,
         * If sink max TMDS Clock < 340MHz, we should check the mode pixel
         * clock > 340MHz is YCbCr420 or not.
         */
+#if 0
        if (mode->clock > 340000 &&
            connector->display_info.max_tmds_clock < 340000 &&
            !drm_mode_is_420(&connector->display_info, mode))
                return MODE_BAD;
+#endif

        if (!encoder) {
```

(1) Set the first def_mode array element to the desired resolution's VIC.

(2) Set edid = NULL; to force the EDID-failure path and use def_modes regardless of whether EDID was read.

(3) For forced 4K, also comment out the code indicated in the figure to remove the 4K restriction.

When forcing HDMI 2.0 resolutions above 4K30 or higher modes, verify whether the sink requires SCDC communication. If it does, HDMI DDC must work. Forced output does not support HDMI hotplug.

#### 2.4.6 No HDMI display in Recovery

Recovery supports neither dual displays nor hotplug. For HDMI output, add the change below if absent and boot with HDMI already connected.

![Technical figure from the Chinese source, p. 46](/docs/rockchip-hdmi/assets/cn-p46-2.png)

Transcription of legible source code. The screenshot itself is cropped; this is not a complete applicable patch.

```text
diff --git a/minui/graphics_drm.cpp b/minui/graphics_drm.cpp
index 03e33b7..f4d5fc7 100644
--- a/minui/graphics_drm.cpp
+++ b/minui/graphics_drm.cpp
@@ -295,6 +295,7 @@ static drmModeConnector *find_main_monitor(int fd, drmModeRes *resources,
    int modes;
    /* Look for LVDS/eDP/DSI connectors. Those are the main screens. */
    unsigned kConnectorPriority[] = {
+       DRM_MODE_CONNECTOR_HDMIA,
        DRM_MODE_CONNECTOR_LVDS,
        DRM_MODE_CONNECTOR_eDP,
        DRM_MODE_CONNECTOR_DSI,
```

#### 2.4.7 Settings cannot change HDMI resolution

(1) Verify primary/secondary assignment and Settings configuration (§2.2.1 and §2.2.5; source references §3.2.1 and §3.2.5).

(2) Verify resolution properties (§2.3.6; source reference §3.3.6).

(3) Android 9.x and later require RkOutputManager. Update RK3399 code to this commit:

![Technical figure from the Chinese source, p. 47](/docs/rockchip-hdmi/assets/cn-p47-1.png)

Transcription of legible source code. The screenshot itself is cropped; this is not a complete applicable patch.

```text
commit 3550c7dd16aea55c67b58e45d42301d94216f665
Author: Wh <wanghang@rock-chips.com>
Date:   Wed Apr 3 15:56:06 2019 +0800

    rk3399: mid add hdmi config

    Change-Id: I0705b537f9fe110bb06ae6390caaa8886f8d36a6
    Signed-off-by: wh <wanghang@rock-chips.com>

wh@ubuntu:~/3399_9.0/device/rockchip/rk3399$
```

(4) Other Android 9.0 platforms need the corresponding patch. After running the project's source and lunch commands, run get_build_var DEVICE_MANIFEST_FILE to identify the active manifest. If it prints device/rockchip/common/manifest.xml, add the following to that file:

```text
<hal format="hidl">
   <name>rockchip.hardware.outputmanager</name>
   <transport>hwbinder</transport>

   <version>1.0</version>
   <interface>
      <name>IRkOutputManager</name>
      <instance>default</instance>
   </interface>
</hal>
```

#### 2.4.8 Insufficient DDR bandwidth

For flicker or flashing green lines at high resolutions such as 4K, check the kernel log for:

```text
[drm:vop_isr] ERROR POST_BUF_EMPTY irq err
```

This log indicates insufficient DDR bandwidth. See §9.7 of Rockchip_RK3399_Developer_Guide_Android7.1_Software_CN&EN.pdf.

#### 2.4.9 4K UI issues

(1) Is a 4K UI necessary?

The source discourages 4K UI because of resource use and reports a limit of approximately 4K25Hz in its environment. This is not an ArmSoM benchmark. A 4K UI is unnecessary merely to play 4K video or view 4K images: the default player and image viewer support those uses.

(2) How is 4K UI configured?

Set framebuffer resolution to 4K as in §2.2.3 (source reference §3.2.3).

(3) Flicker after enabling 4K UI: investigate DDR bandwidth. The source refers to §3.4.10; the bandwidth troubleshooting section here is §2.4.8.

#### 2.4.10 No 4K resolution in the HDMI Settings list

(1) Confirm that the TV supports 4K.

(2) Check whether the kernel HDMI mode list contains 4K:

```text
cat /sys/class/drm/card0-HDMI-A-1/modes
```

(3) If not, check that HDMI binds to VOPB on dual-VOP RK3288/RK3399. Alternatively, the TV may not support YUV420 for 4K50/60, exceeding the platform's capabilities; see the maximum-resolution table in chapter 1.

(4) If the kernel lists 4K but Settings does not, check the resolution allowlist (§2.2.4; source reference §3.2.4).

#### 2.4.11 No 8K mode in RK3588 HDMI Settings

(1) Check whether the TV uses HDMI 2.1 mode or game mode. Most 8K TVs require manual selection before exposing 8K modes.

(2) Verify VOP ACLK=800MHz (§2.1.4.4; source reference §3.1.5).

#### 2.4.12 Flicker or abnormal output at 8K/4K120 on RK3588/RK3576

(1) Verify the HDMI cable. The source requires an HDMI 2.1 cable for HDMI 2.1 modes.

(2) Provide HDMI schematics and PCB drawings to Rockchip hardware support for review.

(3) Arrange SI testing with an external laboratory or request testing by the Rockchip hardware lab through the business contact.

#### 2.4.13 Completing an HDMI certification application

HDMI certification bodies normally provide an application form, usually an Excel workbook.

First inspect the worksheet tabs at the bottom, for example:

![Technical figure from the Chinese source, p. 48](/docs/rockchip-hdmi/assets/cn-p48-1.png)

Each HDMI feature requires information in its respective sheet. Unsupported features need not have their sheets completed. Common sheets are:

General is normally mandatory and contains basic device information: HDMI input/output counts and HDCP/CEC support. These answers determine which later sheets are required. For example, HDMI_input_count=0 means no HDMI input, so Sink CDF is unnecessary.

![Technical figure from the Chinese source, p. 49](/docs/rockchip-hdmi/assets/cn-p49-1.png)

Source CDF is required for devices with HDMI outputs, whose count is entered in General. It typically asks for supported output resolutions, color formats and related capabilities.

![Technical figure from the Chinese source, p. 49](/docs/rockchip-hdmi/assets/cn-p49-2.png)

Sink CDF is required for devices with HDMI inputs. It normally asks for supported input resolutions, color formats and EDID information.

Repeater CDF is required if the device acts as an HDMI repeater. The source notes that Rockchip solutions generally do not use this product form.

Each sheet usually contains several tables, completed like ordinary Excel tables. Example: the Video table in Source CDF:

![Technical figure from the Chinese source, p. 50](/docs/rockchip-hdmi/assets/cn-p50-1.png)

Complete every field according to the actual device. For Source_HDMI_YCbCr above, columns identify the field, its description, allowed values and the applicant's answer. It asks whether HDMI can output YCbCr. Select Y if supported, otherwise N.

The form contains too many fields to describe individually here. Raise questions about specific fields in the vendor's Redmine tracker.

{% endraw %}
