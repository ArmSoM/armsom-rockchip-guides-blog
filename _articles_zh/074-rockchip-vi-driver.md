---
title: "Rockchip VI 驱动完整指南：ISP、VICAP、传感器与摄像头调试"
description: "完整整理 V1.0.7：Linux 4.19 摄像头链路、CIS/VCM/闪光灯与镜头驱动、内存和延迟优化、调试及全部五个附录。"
translation_key: "074-rockchip-vi-driver"
slug: "074-rockchip-vi-driver"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "VI", "ISP", "VICAP", "Camera", "Linux"]
keywords: "ArmSoM Rockchip VI ISP VICAP RK3568 RV1126 Linux camera"
excerpt: "完整整理 V1.0.7：Linux 4.19 摄像头链路、CIS/VCM/闪光灯与镜头驱动、内存和延迟优化、调试及全部五个附录。"
---

{% raw %}

# Rockchip VI 驱动完整指南：ISP、VICAP、传感器与摄像头调试

## ArmSoM 适用说明与来源范围

本文为 Rockchip 平台参考，不是 ArmSoM 硬件验证报告，介绍 RKISP 模块、摄像头整体工作流及相关 API，供摄像头驱动调试使用。原稿为 **Rockchip_Driver_Guide_VI_EN_v1.0.7.pdf**，V1.0.7，共 133 页。本次未提供对应中文 PDF；中文、俄文均完整翻译英文原稿，三语全部使用该英文原图。

封面产品表列 RV1126/RV1109、Linux 4.19；随后适用表还列 RK3566/RK3568，以下分别保留。这不能证明所有 ArmSoM 板卡或 BSP 均适用。适配前须核实具体 SoC、Linux 4.19 原厂 SDK/BSP、ISP/ISPP/VICAP 链路、摄像头连接器和通道布线、传感器/VCM/闪光灯供电及时钟、DTS、IQ/AIQ 版本。本次未做板卡硬件验证；以下测量、日志及命令均为原文示例，不是 ArmSoM 实测。

> 原稿疑点不静默修正：PDF 第 6、13 页能力表对 RK356x 最大分辨率的描述不一致；部分段落使用 RV1106，而产品范围为 RV1109。hsync-acitve、pclk-ative、hieght、/dev/medio0 等原稿拼写应与目标 BSP 核对。应用示例前请查看校对记录。延迟优化中的禁用 IOMMU、提高时钟为原文方案，不是适用于所有生产环境的建议。

[校对记录](/docs/rockchip-vi-driver/EDITORIAL-NOTES.md) · [ArmSoM 官方文档](https://docs.armsom.org/) · [Linux 媒体用户空间 API](https://www.kernel.org/doc/html/latest/userspace-api/media/index.html)

### 原文产品范围（PDF 第 1 页）

| 芯片 | 内核版本 |
| --- | --- |
| RV1126/RV1109 | Linux 4.19 |

### 原文适用矩阵（PDF 第 2 页）

| 平台 | Linux Kernel 4.19 |
| --- | --- |
| RV1126 | Y |
| RV1109 | Y |
| RK3566 | Y |
| RK3568 | Y |


## 不同芯片的 VI 差异

<!-- Source: English PDF p6, table unit 1 -->

| SOC | VI IP | VI 接口 | Bayer CIS 最大分辨率 | 特性 |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20（ISP + ISPP）：1；VICAP Full：1；VICAP Lite：1 | MIPI DPHY：2 × 4 Lanes，2.5Gbps/Lane；LVDS：2 × 4 Lanes，1.0Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 3072x2048 | 最多 3 帧 HDR |
| RK3566 | ISP21 Lite：1；VICAP Full：1 | MIPI DPHY：2 × 2 Lanes 或 1 × 4 Lanes，2.5Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4096x2304 | 不支持 HDR |
| RK3568 | ISP21：1；VICAP Full：1 | MIPI DPHY：2 × 2 Lanes 或 1 × 4 Lanes，2.5Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4096x2304 | 最多 2 帧 HDR |
| RV1126 | ISP20（ISP + ISPP）：1；VICAP Full：1；VICAP Lite：1 | MIPI DPHY：2 × 4 Lanes，2.5Gbps/Lane；LVDS：2 × 4 Lanes，1.0Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4416x3312 | 最多 3 帧 HDR |

## Camera 软件驱动目录说明

Linux Kernel-4.19

- `arch/arm/boot/dts` — DTS 配置文件

- `drivers/phy/rockchip`

- `drivers/phy/rockchip/phy-rockchip-mipi-rx.c` — MIPI DPHY 驱动

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-common.h`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy-hw.c`

- `drivers/phy/rockchip/phy-rockchip-csi2-dphy.c`

- `drivers/media`

- `drivers/media/platform/rockchip/cif`

- `drivers/media/platform/rockchip/isp`

- `drivers/media/platform/rockchip/isp/dev` — 包含 probe、异步注册、时钟、pipeline、iommu 和 media/v4l2 框架

- `drivers/media/platform/rockchip/isp/capture` — 包含 mp/sp/rawwr 配置、vb2 和帧中断处理

- `drivers/media/platform/rockchip/isp/dmarx` — 包含 rawrd 配置、vb2 和帧中断处理

- `drivers/media/platform/rockchip/isp/isp_params` — 3A 相关参数设置

- `drivers/media/platform/rockchip/isp/isp_stats` — 3A 相关统计

- `drivers/media/platform/rockchip/isp/isp_mipi_luma` — MIPI 数据亮度统计

- `drivers/media/platform/rockchip/isp/regs` — 寄存器相关读写操作

- `drivers/media/platform/rockchip/isp/rkisp` — ISP subdev 和 entity 注册

- `drivers/media/platform/rockchip/isp/csi` — CSI subdev 和 MIPI 配置

- `drivers/media/platform/rockchip/isp/bridge` — bridge subdev，ISP 与 ISPP 的交互桥

- `drivers/media/platform/rockchip/ispp`

- `drivers/media/platform/rockchip/ispp/dev` — 包含 probe、异步注册、时钟、pipeline、iommu 和 media/v4l2 框架

- `drivers/media/platform/rockchip/ispp/stream` — 包含 4 路视频输出配置、vb2 和帧中断处理

- `drivers/media/platform/rockchip/ispp/rkispp` — ISPP subdev 和 entity 注册

- `drivers/media/platform/rockchip/ispp/params` — TNR/NR/SHP/FEC/ORB 参数设置

- `drivers/media/platform/rockchip/ispp/stats` — ORB 统计

- `drivers/media/i2c`

- `drivers/media/i2c/os04a10.c` — CIS（CMOS 图像传感器）驱动

## ISP 与 VICAP 的链接关系

在 RV1126/RV1109 和 RK356X 平台上，VICAP 和 ISP 是两个独立的图像处理 IP。如果 VICAP 采集的图像需要由 ISP 处理，驱动层需要生成 VICAP 对应接口的 v4l2 子设备，与 ISP 对应节点链接，为 ISP 驱动提供所需参数。ISP 驱动说明见“RKISP 驱动”，VICAP 驱动说明见“RKVICAP 驱动”。各 VICAP 接口与 ISP 的总体链接框图如下：

![英文原图 1，PDF 第 7 页](/docs/rockchip-vi-driver/assets/en-p7-X177.jpg)

*英文原图 1，PDF 第 7 页*

## RKISP 驱动

### 框架简述

RKISP 驱动主要基于 v4l2/media 框架，实现硬件配置、中断处理、缓冲区轮转控制，以及 MIPI DPHY、sensor 等子设备的上下电控制。

下图描述 RKISP 驱动的拓扑结构：

![英文原图 2，PDF 第 8 页](/docs/rockchip-vi-driver/assets/en-p8-X184.jpg)

*英文原图 2，PDF 第 8 页*

<!-- Source: English PDF p9, table unit 41 -->

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| rkisp_mainpath | v4l2_vdevcapture | 格式：YUV、RAW Bayer；支持裁剪 |
| rkisp_selfpath | v4l2_vdevcapture | 格式：YUV、RGB；支持裁剪 |
| rkisp-isp-subdev | v4l2_subdev | ISP 内部模块，支持 source/sink pad 裁剪。sink pad 的格式、尺寸等于 sensor 输入格式、尺寸；若输出为 raw Bayer，source pad 格式应等于 vdev 输出格式，否则应为 YUYV2X8。source pad 尺寸应小于或等于 sink pad。 |
| rkisp-mipi-luma | v42_vdevcapture | 提供 raw 图像亮度 |
| rkisp-statistics | v4l2_vdevcapture | 提供图像颜色统计信息 |
| rkisp-input-params | v4l2_vdevoutput | 接收 AWB、BLC 等图像增强模块参数 |
| rkisp_rawrd0_m | v4l2_vdevoutput | 从 DDR 读取 raw 图像到 ISP，通常用于 HDR 中帧 |
| rkisp_rawrd1_l | v4l2_vdevoutput | 从 DDR 读取 raw 图像到 ISP，通常用于 HDR 长帧 |
| rkisp_rawrd2_s | v4l2_vdevoutput | 从 DDR 读取 raw 图像到 ISP，通常用于 HDR 短帧 |
| rkisp-csi-subdev | v4l2_subdev | 配置 MIPI CSI |
| rkisp_rawwr0 | v4l2_vdevcapture | 将 sensor raw 图像写入 DDR，通常用于 HDR 中帧 |
| rkisp_rawwr1 | v4l2_vdevcapture | 将 sensor raw 图像写入 DDR，通常用于 HDR 长帧 |
| rkisp_rawwr2 | v4l2_vdevcapture | 将 sensor raw 图像写入 DDR，通常用于 HDR 短帧 |
| rkisp_rawwr3 | v4l2_vdevcapture | 将 sensor raw 图像写入 DDR |
| rockchip-mipi-dphy-rx | v4l2_subdev | 配置 MIPI-DPHY |
| rkisp-bridge-ispp | v4l2_subdev | ISP 向 ISPP 输出 YUV 图像 |
| rkispp_input_image | v4l2_vdevoutput | 从 DDR 读取 YUV 图像到 ISPP |
| rkisp-isp-subdev | v4l2_subdev | sink pad 的格式与尺寸等于 ISP 输出。最大支持 4416x3312，最小 66x258。 |
| rkispp_m_bypass | v4l2_vdev<br>capture | 全分辨率 YUV 格式 |
| rkispp_scale0 | v4l2_vdev<br>capture | 全分辨率或缩放 YUV；缩放比例 [1 8]；YUV422 最大宽度 3264，YUV420 最大宽度 2080。 |
| rkispp_scale1 | v4l2_vdev<br>capture | 全分辨率或缩放 YUV；缩放比例 [2 8]；最大宽度 1280。 |
| rkispp_scale2 | v4l2_vdev<br>capture | 全分辨率或缩放 YUV；缩放比例 [2 8]；最大宽度 1280。 |

### ISP HDR 模式说明

RKISP2 支持接收 MIPI sensor 输出的 HDR 三帧或两帧模式。硬件通过 3 或 2 路 dmatx 将数据采集到 DDR，再通过 3 或 2 路 dmarx 读入 ISP，由 ISP 完成三帧或两帧合成。驱动链路如下：

![英文原图 3，PDF 第 10 页](/docs/rockchip-vi-driver/assets/en-p10-X190.png)

*英文原图 3，PDF 第 10 页*

![英文原图 4，PDF 第 10 页](/docs/rockchip-vi-driver/assets/en-p10-X191.png)

*英文原图 4，PDF 第 10 页*

CSI subdev 通过 get_fmt 获取 sensor 驱动以多个 pad format 提供的输出信息，这些信息对应 CSI 的 source pad。

MIPI sensor 驱动的具体配置请参见“驱动移植步骤”。

<!-- Source: English PDF p11, table unit 50 -->

| 名称 | 名称 | 说明 |
| --- | --- | --- |
| rkisp-isp-subdev | Sensor pad0 | ISP 采集 sensor vc0（默认）输出的宽、高、格式，常用于线性模式。 |
| rkisp_rawwr0 | Sensor<br>pad1 | Rawwr0 采集 sensor vcX 输出的宽、高与格式 |
| rkisp_rawwr1 | Sensor<br>pad2 | Rawwr1 采集 sensor vcX 输出的宽、高与格式 |
| rkisp_rawwr2 | Sensor<br>pad3 | Rawwr2 采集 sensor vcX 输出的宽、高与格式 |
| rkisp_rawwr3 | Sensor<br>pad4 | Rawwr3 采集 sensor vcX 输出的宽、高与格式 |

## RKVICAP 驱动

### 框架说明

RKVICAP 驱动主要基于 v4l2/media 框架，实现硬件配置、中断处理、缓冲区轮转控制，以及 MIPI DPHY、sensor 等子设备的上下电控制。

RV1126/RV1109 的 VICAP 有两个 IP 核，分别称为 VICAP FULL 和 VICAP LITE。VICAP FULL 有 dvp/mipi/lvds 三个接口；dvp 可以与 mipi 或 lvds 同时工作，但 mipi 与 lvds 不能同时工作。VICAP LITE 仅有 lvds 接口，可与 VICAP FULL 接口同时工作。VICAP FULL 的 dvp 接口对应 rkvicap_dvp 节点，mipi/lvds 接口对应 rkvicap_mipi_lvds 节点；VICAP LITE 对应 rkvicap_lite_mipi_lvds 节点。各节点可独立采集。

RK356X 的 VICAP 仅有单核，包含 dvp 和 mipi 两个接口。dvp 对应 rkvicap_dvp 节点，mipi 对应 rkvicap_mipi_lvds 节点（名称与 RV1126/RV1109 的 VICAP FULL 相同），各节点可以独立采集。

为将 VICAP 采集的数据同步给 ISP 驱动，需要把 VICAP 驱动生成的逻辑 sditf 节点连接到 ISP 生成的虚拟节点设备。DVP 对应 rkvicap_dvp_sditf，VICAP FULL 的 mipi/lvds 对应 rkvicap_mipi_lvds_sditf，VICAP LITE 对应 rkvicap_lite_sditf。

各接口的具体 DTS 链接方法请参见“CIS 设备注册（DTS）”。

下图描述 RKVICAP 驱动设备的拓扑结构：

![英文原图 5，PDF 第 12 页](/docs/rockchip-vi-driver/assets/en-p12-X201.jpg)

*英文原图 5，PDF 第 12 页*

## 芯片版本差异

<!-- Source: English PDF p13, table unit 61 -->

| SOC | VI IP | VI 接口 | Bayer CIS 最大分辨率 | 特性 |
| --- | --- | --- | --- | --- |
| RV1109 | ISP20（ISP + ISPP）：1；VICAP Full：1；VICAP Lite：1 | MIPI DPHY：2 × 4 Lanes，2.5Gbps/Lane；LVDS：2 × 4 Lanes，1.0Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 3072x2048 | 最多 3 帧 HDR |
| RK3566 | ISP21 Lite：1；VICAP Full：1 | MIPI DPHY：2 × 2 Lanes 或 1 × 4 Lanes，2.5Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4096x3072 | 不支持 HDR |
| RK3568 | ISP21：1；VICAP Full：1 | MIPI DPHY：2 × 2 Lanes 或 1 × 4 Lanes，2.5Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4096x3072 | 最多 2 帧 HDR |
| RV1126 | ISP20（ISP + ISPP）：1；VICAP Full：1；VICAP Lite：1 | MIPI DPHY：2 × 4 Lanes，2.5Gbps/Lane；LVDS：2 × 4 Lanes，1.0Gbps/Lane；DVP：BT601 / BT656 / BT1120；pclk：150MHz | 4416x3312 | 最多 3 帧 HDR |

## CIS（CMOS 图像传感器）驱动

### CIS 设备注册（DTS）

#### 单路注册

##### MIPI 接口

原文在此写 RV1126 和 RV1106 平台：有两个独立完整的标准物理 MIPI CSI2 DPHY，在 DTS 中对应 csi_dphy0 和 csi_dphy1（见 RV1126.dtsi），特性如下。RV1106 与前文 RV1109 的型号不一致，保留原稿并待核对。

最多 4 条数据 lane；

最高速率 2.5Gbps/lane；

RK356X 平台只有一个标准物理 MIPI CSI2 DPHY，可工作在 full mode 和 split mode，逻辑上分为 csi2_dphy0/csi2_dphy1/csi2_dphy2 三个 DPHY（见 rk3568.dtsi）。特性如下：

##### 完整模式（Full mode）

只使用 csi2_dphy0；csi2_dphy0 与 csi2_dphy1/csi2_dphy2 互斥，不能同时使用；

最多 4 条数据 lane；

最高速率 2.5Gbps/lane；

##### 拆分模式（Split mode）

只使用 csi2_dphy1 和 csi2_dphy2，与 csi2_dphy0 互斥，不能同时使用；

csi2_dphy1 和 csi2_dphy2 可同时使用；

csi2_dphy1 和 csi2_dphy2 各最多 2 条数据 lane；

csi2_dphy1 对应物理 DPHY 的 lane0/lane1；

csi2_dphy2 对应物理 DPHY 的 lane2/lane3；

最高速率为 2.5Gbps/lane。

具体 DTS 用例见下面的示例。

##### 连接到 ISP

##### RV1126/RV1106 平台（原文型号）

下面以 RV1126 ISP 与 os04a10 为例。

##### 链接关系：sensor->csi_dphy->isp->ispp

arch/arm/boot/dts/RV1126-evb-v10.dtsi

##### 配置要点

data-lanes 必须指定所用 lane 数量，否则无法识别为 MIPI 类型；

```text
  cam_ircut0: cam_ircut {
      status = "okay";
      compatible = "rockchip,ircut";
      ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
      ircut-close-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
  };
  os04a10: os04a10@36 {
      // Need to be consistent with the matching string in the driver
      compatible = "ovti,os04a10";
      reg = <0x36>;// sensor I2CDevice address, 7 bits
      clocks = <&cru CLK_MIPICSI_OUT>;// sensor clickinConfiguration
      clock-names = "xvclk";
      power-domains = <&power RV1126_PD_VI>;
      pinctrl-names = "rockchip,camera_default";
      pinctrl-0 = <&mipi_csi_clk0>;// pinctl Set up
      //power supply
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // power Pin assignment and effective level
      pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <1>;
      // Module orientation which are "back" and "front"
      rockchip,camera-module-facing = "front";
      // name of moudle
      rockchip,camera-module-name = "CMK-OT1607-FV1";
      // lens name
      rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
      //ir cut device
      ir-cut = <&cam_ircut0>;
      port {
          ucam_out0: endpoint {
              // mipi dphy port
              remote-endpoint = <&mipi_in_ucam0>;
              // number of mipi lane，1lane is <1>, 4lanei s <1 2 3 4>
              data-lanes = <1 2 3 4>;
          };
      };
   };
  &csi_dphy0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // mipi lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // name of isp port
                  remote-endpoint = <&isp_in>;
              };
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  // name of mipi dphy port
                  remote-endpoint = <&csidphy0_out>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_out: endpoint@1 {
                  reg = <1>;
                  // ispp port name, isp output to ispp
                  remote-endpoint = <&ispp0_in>;
              };
          };
      };
  };
  &rkispp {
      status = "okay";
  };
  &rkispp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          Ispp0_in: endpoint@0 {
              reg = <0>;
              // isp port name, ispp input
              remote-endpoint = <&isp0_out>;
          };
      };
  };
```

##### RK356X 平台

以下以 rk3566 ISP 与 gc8034 4lane 为例说明：

##### 链接关系：sensor->csi2_dphy0->isp。配置要点：

需要配置 data-lanes，并使能 csi2_dphy_hw 节点。

```text
      /* full mode: lane0-3 */
      gc8034: gc8034@37 {
          //Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc8034";
          status = "okay";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclk Source configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          //sensor mclk pinctl set up
          pinctrl-names = "default";
          pinctrl-0 = <&cif_clk>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio4 RK_PB2 GPIO_ACTIVE_LOW>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // moudle name
          rockchip,camera-module-name = "RK-CMK-8M-2-v1";
          // lens name
          rockchip,camera-module-lens-name = "CK8401";
          port {
              gc8034_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy0_in>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
      &csi2_dphy_hw {
         status = "okay";
      };
      &csi2_dphy0 {
          //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually exclusive
          status = "okay";
          /*
           * dphy0 only used for full mode,
           * full mode and split mode are mutually exclusive
           */
          ports {
              #address-cells = <1>;
              #size-cells = <0>;
              port@0 {
                  reg = <0>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_in: endpoint@1 {
                      reg = <1>;
                      // The port name of the sensor
                      remote-endpoint = <&gc8034_out>;
                      // csi2 dphy lane number
                      data-lanes = <1 2 3 4>;
                  };
              };
              port@1 {
                  reg = <1>;
                  #address-cells = <1>;
                  #size-cells = <0>;
                  dphy0_out: endpoint@1 {
                      reg = <1>;
                      // The port name of the isp
                      remote-endpoint = <&isp0_in>;
                  };
              };
          };
      };
  &rkisp {
      status = "okay";
  };
  &rkisp_mmu {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      port {
          #address-cells = <1>;
          #size-cells = <0>;
          isp0_in: endpoint@0 {
              reg = <0>;
              // The port name of csi2 dphy
              remote-endpoint = <&dphy0_out>;
          };
      };
  };
```

##### 连接到 VICAP

##### RV1126/RV1109 平台

以 MIPI os04a10 4lane 连接 VICAP 为例：

##### 链接关系：sensor->csi dphy->mipi csi host->vicap。配置要点：

data-lanes 必须指定所用 lane 数量，否则无法识别为 MIPI 类型；DPHY 需要连接到 CSI host 节点。

```text
  os04a10: os04a10@36 {
          // Need to be consistent with the matching string in the driver
          compatible = "ovti,os04a10";
          // sensor I2C device address, 7 bits
          reg = <0x36>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "rockchip,camera_default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio1 RK_PD4 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-40IRC-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // csi2 dphy lane number，1lane is <1>, 4lane is  <1 2 3 4>
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2 , mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // csi2 dphy lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&csidphy0_out>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // Port name on the vicap side
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2 3 4>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* sditf endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number, consistent with sensor
              data-lanes = <1 2 3 4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //Endpoint name of vicap sditf
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### RK356X 平台

以 gc5025 2lane 连接 rk3566 evb2 MIPI CSI2 DPHY 的 lane2/lane3 为例：

##### 链接关系：sensor->csi2 dphy->mipi csi host->vicap。配置要点：

data-lanes 必须指定所用 lane 数量，否则无法识别为 MIPI 类型；DPHY 需要连接到 CSI host 节点；需要使能 csi2 dphy hw 节点。

```text
  /* split mode: lane:2/3 */
  gc5025: gc5025@37 {
          status = "okay";
          // Need to be consistent with the matching string in the driver
          compatible = "galaxycore,gc5025";
          // sensor I2C device address, 7 bits
          reg = <0x37>;
          // sensor mclkSource configuration
          clocks = <&pmucru CLK_WIFI>;
          clock-names = "xvclk";
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&refclk_pins>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio3 RK_PA5 GPIO_ACTIVE_LOW>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PB0 GPIO_ACTIVE_LOW>;
          //sensor Related power domain enable
          power-domains = <&power RK3568_PD_VI>;
          /*power-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;*/
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "TongJu";
          // lens name
          rockchip,camera-module-lens-name = "CHT842-MD";
          port {
              gc5025_out: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_in>;
                  // csi2 dphy lane name，2lane is <1 2>, 4lane is <1 2 3 4>
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy2 {
      //csi2_dphy0 is not used simultaneously with csi2_dphy1/csi2_dphy2, mutually
  exclusivee;can be used in parallel with csi2_dphy1
      status = "okay";
      /*
       * dphy2 only used for split mode,
       * can be used  concurrently  with dphy1
       * full mode and split mode are mutually exclusive
       */
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&gc5025_out>;
                  // csi2 dphy lane name
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  // csi2 host port name
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  // csi2 dphy port name
                  remote-endpoint = <&dphy2_out>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  // vicapport name
                  remote-endpoint = <&cif_mipi_in>;
                  // csi2 host lane number
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              // csi2 hostport name
              remote-endpoint = <&mipi_csi2_output>;
              // vicap lane number
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          /* MIPI CSI-2 endpoint */
          mipi_lvds_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //mipi csi2 dphy lane number，consistent with sensor
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //vicap mipi sditf port name
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

##### LVDS 接口

##### 连接到 VICAP

##### RV1126/RV1109 平台

以 imx327 4lane 为例，链接关系如下：

##### 链接关系：sensor->csi dphy->vicap。配置要点：

DPHY 不需要连接 CSI host 节点，否则无法接收数据；data-lanes 必须指定实际所用 lane 数量，否则无法接收数据；bus-type 必须设为 3，否则无法识别为 LVDS 接口，导致链接建立失败。

```text
  imx327: imx327@1a {
          // Need to be consistent with the matching string in the driver
          compatible = "sony,imx327";
          // sensor I2C device address, 7 bits
          reg = <0x1a>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_MIPICSI_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          power-domains = <&power RV1126_PD_VI>;
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          //sensor mclk pinctlset up
          pinctrl-names = "default";
          pinctrl-0 = <&mipicsi_clk0>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio3 RK_PA6 GPIO_ACTIVE_HIGH>;
          // resetPin assignment and effective level
          reset-gpios = <&gpio1 RK_PD5 GPIO_ACTIVE_HIGH>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <1>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "front";
          // module name
          rockchip,camera-module-name = "CMK-OT1607-FV1";
          // lens name
          rockchip,camera-module-lens-name = "M12-4IR-4MP-F16";
          // ircut name
          ir-cut = <&cam_ircut0>;
          port {
              ucam_out0: endpoint {
                  // csi2 dphy port name
                  remote-endpoint = <&mipi_in_ucam0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
  };
  &csi_dphy0 {
      //csi2_dphy0 is not simultaneous use with csi2_dphy1/csi2_dphy2, mutually exclusive
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_in_ucam0: endpoint@1 {
                  reg = <1>;
                  // The port name of the sensor
                  remote-endpoint = <&ucam_out0>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              csidphy0_out: endpoint@0 {
                  reg = <0>;
                  // vicap liteport name
                  remote-endpoint = <&cif_lite_lvds_in>;
                  // lvds lane number，1lane is <1>, 4lane is <4>，must be specified
                  data-lanes = <4>;
                  // Type of lvds interface, must be specified
                  bus-type = <3>;
              };
          };
      };
  };
  &rkcif_lite_mipi_lvds {
      status = "okay";
      port {
          /* lvds endpoint */
          cif_lite_lvds_in: endpoint {
              // csi2 dphy port name
              remote-endpoint = <&csidphy0_out>;
              //csi2 dphy lvds lane name，1lane is <1>, 4lane is <4>，must be specified
              data-lanes = <4>;
              //Type of lvds interface, must be specified
              bus-type = <3>;
          };
      };
  };
  &rkcif_lite_sditf {
      status = "okay";
      port {
          /* lvds endpoint */
          lite_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //csi2 dphy lane number， consistent with sensor
              data-lanes = <4>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //lite vicap lvds sditf port name
                  remote-endpoint = <&lite_sditf>;
              };
          };
      };
  };
```

##### DVP 接口：连接到 VICAP

在 RV1126/RV1106/RK356X 平台上，DVP 各相关接口的 DTS 配置相同。此处 RV1106 为原文型号，需结合前述范围核对。

##### BT601

以 ar0230 BT601 为例，链接关系如下：

##### 链接关系：sensor->vicap。配置要点：

必须配置 hsync-active/vsync-active，v4l2 框架在异步注册时才能识别 BT601；未配置时会识别成 BT656。pclk-sample/bus-width 为可选项。sensor 驱动的 g_mbus_config 接口必须通过 flag 指明当前 sensor 的 hsync-acitve/vsync-active/pclk-ative 有效极性，否则无法接收数据（属性拼写按原文保留，待核）。必须引用 pinctrl，为 BT601 相关 GPIO 设置对应 IOMUX，否则无法接收数据。

g_mbus_config 接口示例代码如下：

```text
  static int ar0230_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_PARALLEL;
      config->flags = V4L2_MBUS_HSYNC_ACTIVE_HIGH |
              V4L2_MBUS_VSYNC_ACTIVE_HIGH |
              V4L2_MBUS_PCLK_SAMPLE_FALLING;
      return 0;
  }
```

DTS 配置示例如下：

```text
  ar0230: ar0230@10 {
          // Need to be consistent with the matching string in the driver
          compatible = "aptina,ar0230";
          // sensor I2C device address, 7 bits
          reg = <0x10>;
          // sensor mclkSource configuration
          clocks = <&cru CLK_CIF_OUT>;
          clock-names = "xvclk";
          //sensor Related power domain enable
          avdd-supply = <&vcc_avdd>;
          dovdd-supply = <&vcc_dovdd>;
          dvdd-supply = <&vcc_dvdd>;
          power-domains = <&power RV1126_PD_VI>;
          // powerdownPin assignment and effective level
          pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
          //Configure dvp related data pins and clock pins
          pinctrl-names = "default";
          pinctrl-0 = <&cifm0_dvp_ctl>;
          // Module number, this number should not be repeated
          rockchip,camera-module-index = <0>;
          // Module orientation, there are "back" and "front"
          rockchip,camera-module-facing = "back";
          // module name
          rockchip,camera-module-name = "CMK-OT0836-PT2";
          // lens name
          rockchip,camera-module-lens-name = "YT-2929";
          port {
              cam_para_out1: endpoint {
                  remote-endpoint = <&cif_para_in>;
              };
          };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out1>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              //Sensor configuration parameters
              bus-width = <12>;
              hsync-active = <1>;
              vsync-active = <1>;
              pclk-sample = <0>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

##### BT656/BT1120

BT656/BT1120 的 DTS 用法相同。

以 ava fpga bt1120 为例，链接关系如下：

##### 链接关系：sensor->vicap。配置要点：

不要配置 hsync-active/vsync-active，否则 v4l2 框架在异步注册时会识别为 BT601；

pclk-sample/bus-width 为可选项；

sensor 驱动的 g_mbus_config 接口必须通过 flag 指明当前 sensor 的 pclk-ative 有效极性，否则无法接收数据（pclk-ative 为原文拼写）。

必须实现 v4l2_subdev_video_ops 中的 querystd 接口，指明当前接口是 ATSC 接口，否则无法接收数据。

必须引用 pinctrl，为 bt656/bt1120 相关 GPIO 设置对应 IOMUX，否则无法接收数据。

g_mbus_config 接口示例代码如下：

```text
  static int avafpga_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
  {
      config->type = V4L2_MBUS_BT656;
      config->flags = V4L2_MBUS_PCLK_SAMPLE_RISING;
      return 0;
  }
```

querystd 接口示例如下：

```text
  static int avafpga_querystd(struct v4l2_subdev *sd, v4l2_std_id *std)
  {
      *std = V4L2_STD_ATSC;
      return 0;
  }
```

DTS 配置示例如下：

```text
  avafpga: avafpga@70 {
      // Need to be consistent with the matching string in the driver
      compatible = "ava,fpga";
      // sensor I2C device address, 7 bits
      reg = <0x10>;
      // sensor mclkSource configuration
      clocks = <&cru CLK_CIF_OUT>;
      clock-names = "xvclk";
      //sensor Related power domain enable
      avdd-supply = <&vcc_avdd>;
      dovdd-supply = <&vcc_dovdd>;
      dvdd-supply = <&vcc_dvdd>;
      // powerdownPin assignment and effective level
      power-domains = <&power RV1126_PD_VI>;
      pwdn-gpios = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
      /*reset-gpios = <&gpio2 RK_PC5 GPIO_ACTIVE_HIGH>;*/
      //Configure dvp related data pins and clock pins
      pinctrl-names = "default";
      pinctrl-0 = <&cifm0_dvp_ctl>;
      // Module number, this number should not be repeated
      rockchip,camera-module-index = <0>;
      // Module orientation, there are "back" and "front"
      rockchip,camera-module-facing = "back";
      // module name
      rockchip,camera-module-name = "CMK-OT0836-PT2";
      // lens name
      rockchip,camera-module-lens-name = "YT-2929";
      port {
          cam_para_out2: endpoint {
              remote-endpoint = <&cif_para_in>;
          };
      };
  };
  &rkcif_dvp {
      status = "okay";
      port {
          /* Parallel bus endpoint */
          cif_para_in: endpoint {
              //sensor port endpoint name
              remote-endpoint = <&cam_para_out2>;
              //Sensor configuration parameters，Optional
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkcif_dvp_sditf {
      status = "okay";
      port {
          /* parallel endpoint */
          dvp_sditf: endpoint {
              //isp Virtual device port name
              remote-endpoint = <&isp_in>;
              bus-width = <16>;
              pclk-sample = <1>;
          };
      };
  };
  &rkisp {
      status = "okay";
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp_in: endpoint@0 {
                  reg = <0>;
                  //dvp sditf port name
                  remote-endpoint = <&dvp_sditf>;
              };
          };
      };
  };
```

#### 多 sensor 注册

单个硬件 ISP 虚拟出多个设备，以时分复用方式处理多个 RAW sensor 的数据。

##### RV1126/RV1106 平台的链接关系中，isp0->ispp0 和 isp1->ispp1 在 RV1126.dtsi 中固定配置。可选择 MIPI 输入 ISP 或 CIF 输入 ISP。RV1106 按原文保留。

例如：

##### sensor0->csi_dphy0->csi2->vicap->isp0->ispp0

sensor1->csi_dphy1->isp1->ispp1

示例参见 arch/arm/boot/dts/RV1109-evb-ddr3-v12-facial-gate.dts。

gc2053->csi_dphy0->csi2->cif->isp1->ispp1

ov2718->csi_dphy1->isp0->ispp0

不同分辨率时下面的配置非常重要。max-input 取各 sensor 中最大的宽、高和帧率：

```dts
&rkispp {
    status = "okay";
    /* the max input w h and fps of mulit sensor */
    max-input = <2688 1520 30>;//Take the maximum width and height and frame rate of different sensors
};
```

##### RK3566/RK3568 平台

例如：

ov5695->dphy1->isp_vir0

gc5025->dphy2->csi2->vicap->isp_vir1

```text
  ov5695: ov5695@36 {
          status = "okay";
          ...
          port {
              ov5695_out: endpoint {
                  remote-endpoint = <&dphy1_in>;
                  data-lanes = <1 2>;
              };
          };
  };
  gc5025: gc5025@37 {
          status = "okay";
          ...
          port {
              gc5025_out: endpoint {
                  remote-endpoint = <&dphy2_in>;
                  data-lanes = <1 2>;
              };
          };
  };
   &csi2_dphy_hw {
          status = "okay";
   };
  &csi2_dphy1 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&ov5695_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy1_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&isp0_in>;
              };
          };
      };
  };
  &csi2_dphy2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_in: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&gc5025_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              dphy2_out: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&mipi_csi2_input>;
              };
          };
      };
  };
  &mipi_csi2 {
      status = "okay";
      ports {
          #address-cells = <1>;
          #size-cells = <0>;
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_input: endpoint@1 {
                  reg = <1>;
                  remote-endpoint = <&dphy2_out>;
                  data-lanes = <1 2>;
              };
          };
          port@1 {
              reg = <1>;
              #address-cells = <1>;
              #size-cells = <0>;
              mipi_csi2_output: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&cif_mipi_in>;
                  data-lanes = <1 2>;
              };
          };
      };
  };
  &rkcif_mipi_lvds {
      status = "okay";
      port {
          cif_mipi_in: endpoint {
              remote-endpoint = <&mipi_csi2_output>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkcif_mipi_lvds_sditf {
      status = "okay";
      port {
          mipi_lvds_sditf: endpoint {
              remote-endpoint = <&isp1_in>;
              data-lanes = <1 2>;
          };
      };
  };
  &rkisp {
      status = "okay";
      /* the max input w h and fps of mulit sensor */
      max-input = <2592 1944 30>;
  };
  &rkisp_vir0 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp0_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&dphy1_out>;
              };
          };
      };
  };
  &rkisp_vir1 {
      status = "okay";
      ports {
          port@0 {
              reg = <0>;
              #address-cells = <1>;
              #size-cells = <0>;
              isp1_in: endpoint@0 {
                  reg = <0>;
                  remote-endpoint = <&mipi_lvds_sditf>;
              };
          };
      };
  };
```

### CIS 驱动说明

Camera sensor 通过 I2C 与主控交互。当前 sensor 驱动按 I2C 设备驱动实现，同时通过 v4l2 subdev 方式与主控驱动交互。

#### 数据类型简述

##### struct i2c_driver

[说明]

定义 I2C 设备驱动信息。

[定义]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[关键成员]

<!-- Source: English PDF p36, table unit 176 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | 设备模型驱动主要包含驱动名和匹配 DTS 注册设备的 of_match_table。of_match_table 的 compatible 与 DTS 中 compatible 匹配时调用 .probe。 |
| @id_table | 驱动支持的 I2C 设备列表。内核不通过 of_match_table 和 DTS 注册设备匹配时，使用此表匹配。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  #if IS_ENABLED(CONFIG_OF)
  static const struct of_device_id os04a10_of_match[] = {
      { .compatible = "ovti,os04a10" },
      {},
  };
  MODULE_DEVICE_TABLE(of, os04a10_of_match);
  #endif
  static const struct i2c_device_id os04a10_match_id[] = {
      { "ovti,os04a10", 0 },
      { },
  };
  static struct i2c_driver os04a10_i2c_driver = {
      .driver = {
          .name = OS04A10_NAME,
          .pm = &os04a10_pm_ops,
          .of_match_table = of_match_ptr(os04a10_of_match),
      },
      .probe      = &os04a10_probe,
      .remove     = &os04a10_remove,
      .id_table   = os04a10_match_id,
  };
  static int __init sensor_mod_init(void)
  {
      return i2c_add_driver(&os04a10_i2c_driver);
  }
  static void __exit sensor_mod_exit(void)
  {
      i2c_del_driver(&os04a10_i2c_driver);
  }
  device_initcall_sync(sensor_mod_init);
  module_exit(sensor_mod_exit);
```

##### struct v4l2_subdev_ops

[说明]

定义 subdev 的 ops 回调。

[定义]

```text
  struct v4l2_subdev_ops {
      const struct v4l2_subdev_core_ops   *core;
      ……
      const struct v4l2_subdev_video_ops  *video;
      ……
      const struct v4l2_subdev_pad_ops    *pad;
  };
```

[关键成员]

<!-- Source: English PDF p37, table unit 186 -->

| 成员名称 | 说明 |
| --- | --- |
| .core | 定义 subdev 的 core ops 回调 |
| .video | v4l 设备以视频模式打开时使用的回调 |
| .pad | v4l2-subdev pad 级操作 |

[示例]

```text
  static const struct v4l2_subdev_ops os04a10_subdev_ops = {
      .core   = &os04a10_core_ops,
      .video  = &os04a10_video_ops,
      .pad    = &os04a10_pad_ops,
  };
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      int (*s_power)(struct v4l2_subdev *sd, int on);
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
          unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p38, table unit 195 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_power | 设置子设备进入省电模式（on == 0）或正常运行模式（on == 1）。 |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops os04a10_core_ops = {
      .s_power = os04a10_s_power,
      .ioctl = os04a10_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = os04a10_compat_ioctl32,
  #endif
  };
```

##### 目前通过以下私有 ioctl 查询模组信息，以及查询和设置 OTP 信息。

<!-- Source: English PDF p39, table unit 199 -->

| 私有 ioctl | 说明 |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | 获取模组信息，参见 struct rkmodule_inf。 |
| RKMODULE_AWB_CFG | 切换 sensor AWB 补偿；模组未烧录 golden AWB 时可在此设置，详见 struct rkmodule awb_cfg（原文标识）。 |
| RKMODULE_LSC_CFG | 切换 sensor LSC 补偿，参见 struct rkmodule_lsc_cfg。 |
| PREISP_CMD_SET_HDRAE_EXP | HDR 曝光设置，参见 struct preisp_hdrae_exp_s。 |
| RKMODULE_SET_HDR_CFG | 设置 HDR 模式，实现普通/HDR 切换。驱动须适配普通和 HDR 两组配置，详见 struct rkmodule_hdr_cfg。 |
| RKMODULE_GET_HDR_CFG | 获取当前 HDR 模式，详见 struct rkmodule_hdr_cfg。 |
| RKMODULE_SET_CONVERSION_GAIN | 设置线性模式转换增益，如支持该功能的 imx347、os04a10；sensor 不支持时可不实现。 |

##### struct v4l2_subdev_video_ops

[说明]

v4l 设备以视频模式打开时使用的回调。

[定义]

```text
  struct v4l2_subdev_video_ops {
      ……
      int (*s_stream)(struct v4l2_subdev *sd, int enable);
      ……
      int (*g_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_frame_interval *interval);
      int (*g_mbus_config)(struct v4l2_subdev *sd,
                 struct v4l2_mbus_config *cfg);
   ……
  };
```

[关键成员]

<!-- Source: English PDF p40, table unit 206 -->

| 成员名称 | 说明 |
| --- | --- |
| .g_frame_interval | VIDIOC_SUBDEV_G_FRAME_INTERVAL ioctl 的处理回调 |
| .s_stream | 通知驱动视频流即将开始或已经停止 |
| .g_mbus_config | 获取支持的 mediabus 配置 |

[示例]

```text
  static const struct v4l2_subdev_video_ops os04a10_video_ops = {
      .s_stream = os04a10_s_stream,
      .g_frame_interval = os04a10_g_frame_interval,
      .g_mbus_config = os04a10_g_mbus_config,
  };
```

##### struct v4l2_subdev_pad_ops

[说明]

v4l2-subdev 的 pad 级操作。

[定义]

```text
  struct v4l2_subdev_pad_ops {
      ……
      int (*enum_mbus_code)(struct v4l2_subdev *sd,
                 struct v4l2_subdev_pad_config *cfg,
                 struct v4l2_subdev_mbus_code_enum *code);
      int (*enum_frame_size)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_size_enum *fse);
      int (*get_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*set_fmt)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_format *format);
      int (*enum_frame_interval)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_frame_interval_enum *fie);
      int (*get_selection)(struct v4l2_subdev *sd,
                  struct v4l2_subdev_pad_config *cfg,
                  struct v4l2_subdev_selection *sel);
      ……
  };
```

[关键成员]

<!-- Source: English PDF p41, table unit 215 -->

| 成员名称 | 说明 |
| --- | --- |
| . enum_mbus_code | VIDIOC_SUBDEV_ENUM_MBUS_CODE ioctl 的处理回调 |
| . enum_frame_size | VIDIOC_SUBDEV_ENUM_FRAME_SIZE ioctl 的处理回调 |
| .s_fmt | VIDIOC_SUBDEV_S_FMT ioctl 的处理回调 |
| .g_fmt | VIDIOC_SUBDEV_G_FMT ioctl 的处理回调 |
| .enum_frame_interval | VIDIOC_SUBDEV_ENUM_FRAME_INTERVAL() ioctl 的处理回调 |
| .get_selection | VIDIOC_SUBDEV_G_SELECTION() ioctl 的处理回调 |

[示例]

```text
  static const struct v4l2_subdev_pad_ops os04a10_pad_ops = {
      .enum_mbus_code = os04a10_enum_mbus_code,
      .enum_frame_size = os04a10_enum_frame_sizes,
      .enum_frame_interval = os04a10_enum_frame_interval,
      .get_fmt = os04a10_get_fmt,
      .set_fmt = os04a10_set_fmt,
  };
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p41, table unit 224 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_ctrl | 实际设置新的 control 值 |

[示例]

```text
  static const struct v4l2_ctrl_ops os04a10_ctrl_ops = {
      .s_ctrl = os04a10_set_ctrl,
  };
```

RKISP 驱动要求使用框架提供的用户控制。Camera sensor 驱动必须实现以下控制功能，参见“CIS 驱动 V4L2-controls 列表”（原文引用末尾带 1）。

##### struct xxxx_mode

[说明]

sensor 支持的各模式信息。

此结构常见于 sensor 驱动，但不是 v4l2 标准的强制要求。

[定义]

```text
  struct xxxx_mode {
      u32 bus_fmt;
      u32 width;
      u32 height;
      struct v4l2_fract max_fps;
      u32 hts_def;
      u32 vts_def;
      u32 exp_def;
      const struct regval *reg_list;
      u32 hdr_mode;
      u32 vc[PAD_MAX];
  };
```

[关键成员]

<!-- Source: English PDF p42, table unit 235 -->

| 成员名称 | 说明 |
| --- | --- |
| .bus_fmt | Sensor 输出格式，参见 MEDIA_BUS_FMT 表 |
| .width | 有效图像宽度，须与当前 sensor 配置输出宽度一致。 |
| .height | 有效图像高度，须与当前 sensor 配置输出高度一致。 |
| .max_fps | 图像 FPS，denominator/numerator 即 fps。 |
| hts_def | 默认 HTS，等于有效图像宽度 + HBLANK。 |
| vts_def | 默认 VTS，等于有效图像高度 + VBLANK。 |
| exp_def | 默认曝光时间 |
| *reg_list | 寄存器列表 |
| .hdr_mode | Sensor 工作模式：线性、两帧合成 HDR、三帧合成 HDR。 |
| .vc[PAD_MAX] | 配置 MIPI VC 通道 |

[示例]

```text
   enum os04a10_max_pad {
      PAD0, /* link to isp */
      PAD1, /* link to csi rawwr0 | hdr x2:L x3:M */
      PAD2, /* link to csi rawwr1 | hdr    x3:L */
      PAD3, /* link to csi rawwr2 | hdr x2:M x3:S */
      PAD_MAX,
  };
  static const struct os04a10_mode supported_modes[] = {
      {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 300372,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0984,
          .reg_list = os04a10_linear12bit_2688x1520_regs,
          .hdr_mode = NO_HDR,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_0,
      }, {
          .bus_fmt = MEDIA_BUS_FMT_SBGGR12_1X12,
          .width = 2688,
          .height = 1520,
          .max_fps = {
              .numerator = 10000,
              .denominator = 225000,
          },
          .exp_def = 0x0240,
          .hts_def = 0x05c4 * 2,
          .vts_def = 0x0658,
          .reg_list = os04a10_hdr12bit_2688x1520_regs,
          .hdr_mode = HDR_X2,
          .vc[PAD0] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD1] = V4L2_MBUS_CSI2_CHANNEL_0,//L->csi wr0
          .vc[PAD2] = V4L2_MBUS_CSI2_CHANNEL_1,
          .vc[PAD3] = V4L2_MBUS_CSI2_CHANNEL_1,//M->csi wr2
      },
  };
```

##### struct v4l2_mbus_framefmt

[说明]

媒体总线上的帧格式。

[定义]

```text
  struct v4l2_mbus_framefmt {
      __u32           width;
      __u32           height;
      __u32           code;
      __u32           field;
      __u32           colorspace;
      __u16           ycbcr_enc;
      __u16           quantization;
      __u16           xfer_func;
      __u16           reserved[11];
  };
```

[关键成员]

<!-- Source: English PDF p44, table unit 245 -->

| 成员名称 | 说明 |
| --- | --- |
| width | 帧宽度 |
| height | 帧高度 |
| code | 参见 MEDIA_BUS_FMT 表 |
| field | V4L2_FIELD_NONE：帧输出模式；V4L2_FIELD_INTERLACED：场输出模式。 |

[示例]

##### struct rkmodule_base_inf

[说明]

模组基础信息，上层使用它匹配 IQ。

[定义]

```text
  struct rkmodule_base_inf {
      char sensor[RKMODULE_NAME_LEN];
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p44, table unit 253 -->

| 成员名称 | 说明 |
| --- | --- |
| sensor | Sensor 名称，从 sensor 驱动获取。 |
| module | 模组名称，从 DTS 配置获取，以模组资料为准。 |
| lens | 镜头名称，从 DTS 配置获取，以模组资料为准。 |

[示例]

##### struct rkmodule_fac_inf

[说明]

模组 OTP 出厂信息。

[定义]

```text
  struct rkmodule_fac_inf {
      __u32 flag;
      char module[RKMODULE_NAME_LEN];
      char lens[RKMODULE_NAME_LEN];
      __u32 year;
      __u32 month;
      __u32 day;
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p45, table unit 261 -->

| 成员名称 | 说明 |
| --- | --- |
| flag | 该组信息是否有效 |
| module | 模组名：从 OTP 读取编号，再由编号确定名称。 |
| lens | 镜头名：从 OTP 读取编号，再由编号确定名称。 |
| year | 生产年份，例如 12 表示 2012 年。 |
| month | 生产月份 |
| day | 生产日期 |

[示例]

##### struct rkmodule_awb_inf

[说明]

模组 OTP AWB 测量信息。

[定义]

```text
  struct rkmodule_awb_inf {
      __u32 flag;
      __u32 r_value;
      __u32 b_value;
      __u32 gr_value;
      __u32 gb_value;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p46, table unit 269 -->

| 成员名称 | 说明 |
| --- | --- |
| flag | 该组信息是否有效 |
| r_value | 当前模组 AWB R 测量信息 |
| b_value | 当前模组 AWB B 测量信息 |
| gr_value | 当前模组 AWB GR 测量信息 |
| gb_value | 当前模组 AWB GB 测量信息 |
| golden_r_value | 典型模组 AWB R 测量信息，未烧录则设为 0。 |
| golden_b_value | 典型模组 AWB B 测量信息，未烧录则设为 0。 |
| golden_gr_value | 典型模组 AWB GR 测量信息，未烧录则设为 0。 |
| golden_gb_value | 典型模组 AWB GB 测量信息，未烧录则设为 0。 |

[示例]

##### struct rkmodule_lsc_inf

[说明]

模组 OTP LSC 测量信息。

[定义]

```text
  struct rkmodule_lsc_inf {
      __u32 flag;
      __u16 lsc_w;
      __u16 lsc_h;
      __u16 decimal_bits;
      __u16 lsc_r[RKMODULE_LSCDATA_LEN];
      __u16 lsc_b[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gr[RKMODULE_LSCDATA_LEN];
      __u16 lsc_gb[RKMODULE_LSCDATA_LEN];
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p47, table unit 277 -->

| 成员名称 | 说明 |
| --- | --- |
| flag | 该组信息是否有效 |
| lsc_w | LSC 表实际宽度 |
| lsc_h | LSC 表实际高度 |
| decimal_bits | LSC 测量信息的小数位数，无此信息则设为 0。 |
| lsc_r | LSC R 测量信息 |
| lsc_b | LSC B 测量信息 |
| lsc_gr | LSC GR 测量信息 |
| lsc_gb | LSC GB 测量信息 |

[示例]

##### struct rkmodule_af_inf

[说明]

模组 OTP AF 测量信息。

[定义]

```text
  struct rkmodule_af_inf {
      __u32 flag; // Whether this group of information is a valid flag
      __u32 vcm_start; // vcm start current
      __u32 vcm_end; // vcm termination current
      __u32 vcm_dir; // vcm measurement direction
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p47, table unit 285 -->

| 成员名称 | 说明 |
| --- | --- |
| flag | 该组信息是否有效 |
| vcm_start | VCM 起始电流 |
| vcm_end | VCM 终止电流 |
| vcm_dir | VCM 判定方向 |

[示例]

##### struct rkmodule_inf

[说明]

模组信息。

[定义]

```text
  struct rkmodule_inf {
      struct rkmodule_base_inf base;
      struct rkmodule_fac_inf fac;
      struct rkmodule_awb_inf awb;
      struct rkmodule_lsc_inf lsc;
      struct rkmodule_af_inf af;
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p48, table unit 293 -->

| 成员名称 | 说明 |
| --- | --- |
| base | 模组基本信息 |
| fac | 模组 OTP 出厂信息 |
| awb | 模组 OTP AWB 测量信息 |
| lsc | 模组 OTP LSC 测量信息 |
| af | 模组 OTP AF 测量信息 |

[示例]

##### struct rkmodule_awb_cfg

[说明]

模组 OTP AWB 配置信息。

[定义]

```text
  struct rkmodule_awb_cfg {
      __u32 enable;
      __u32 golden_r_value;
      __u32 golden_b_value;
      __u32 golden_gr_value;
      __u32 golden_gb_value;
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p48, table unit 301 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | 是否启用 AWB 校正 |
| golden_r_value | 典型模组 AWB R 测量信息 |
| golden_b_value | 典型模组 AWB B 测量信息 |
| golden_gr_value | 典型模组 AWB GR 测量信息 |
| golden_gb_value | 典型模组 AWB GB 测量信息 |

[示例]

##### struct rkmodule_lsc_cfg

[说明]

模组 OTP LSC 配置信息。

[定义]

```text
  struct rkmodule_lsc_cfg {
      __u32 enable;
  } __attribute__ ((packed));
```

[关键成员]

<!-- Source: English PDF p49, table unit 309 -->

| 成员名称 | 说明 |
| --- | --- |
| enable | 是否启用 LSC 校正 |

[示例]

##### struct rkmodule_hdr_cfg

[说明]

HDR 配置信息。

[定义]

```text
  struct rkmodule_hdr_cfg {
      __u32 hdr_mode;
      struct rkmodule_hdr_esp esp;
  } __attribute__ ((packed));
  struct rkmodule_hdr_esp {
      enum hdr_esp_mode mode;
      union {
          struct {
              __u32 padnum;
              __u32 padpix;
          } lcnt;
          struct {
              __u32 efpix;
              __u32 obpix;
          } idcd;
      } val;
  };
```

[关键成员]

<!-- Source: English PDF p50, table unit 317 -->

| 成员名称 | 说明 |
| --- | --- |
| hdr_mode | NO_HDR=0 //普通模式<br>HDR_X2=5 //HDR 两帧模式<br>HDR_X3=6 //HDR 三帧模式 |
| struct rkmodule_hdr_esp | HDR 特殊模式 |
| enum hdr_esp_mode | HDR_NORMAL_VC=0 //普通虚拟通道模式<br>HDR_LINE_CNT=1 //行计数模式 (AR0239)<br>HDR_ID_CODE=2 //标识码模式 (IMX327) |

[示例]

##### struct preisp_hdrae_exp_s

[说明]

HDR 曝光参数。

[定义]

```text
  struct preisp_hdrae_exp_s {
      unsigned int long_exp_reg;
      unsigned int long_gain_reg;
      unsigned int middle_exp_reg;
      unsigned int middle_gain_reg;
      unsigned int short_exp_reg;
      unsigned int short_gain_reg;
      unsigned int long_exp_val;
      unsigned int long_gain_val;
      unsigned int middle_exp_val;
      unsigned int middle_gain_val;
      unsigned int short_exp_val;
      unsigned int short_gain_val;
      unsigned char long_cg_mode;
      unsigned char middle_cg_mode;
      unsigned char short_cg_mode;
  };
```

[关键成员]

<!-- Source: English PDF p51, table unit 325 -->

| 成员名称 | 说明 |
| --- | --- |
| long_exp_reg | 长帧曝光寄存器值 |
| long_gain_reg | 长帧增益寄存器值 |
| middle_exp_reg | 中帧曝光寄存器值 |
| middle_gain_reg; | 中帧增益寄存器值 |
| short_exp_reg | 短帧曝光寄存器值 |
| short_gain_reg | 短帧增益寄存器值 |
| long_cg_mode | 长帧转换增益：0 LCG，1 HCG |
| middle_cg_mode | 中帧转换增益：0 LCG，1 HCG |
| short_cg_mode | 短帧转换增益：0 LCG，1 HCG |

[说明]

preisp_hdrae_exp_s 结构中只需关注“关键成员”所述的几个参数。曝光和增益值转换为寄存器值的公式在 IQ XML 中，具体转换请参考 IQ XML 格式说明。转换增益功能要求 sensor 自身支持；不支持时无需关注 conversion 参数。对于 HDR2X，应将传入的中帧和短帧参数设置到 sensor 两帧输出对应的曝光参数寄存器。

[示例]

#### API 简述

##### xxxx_set_fmt

[说明]

设置 sensor 输出格式。

[语法]

```text
  static int xxxx_set_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[参数]

<!-- Source: English PDF p51, table unit 337 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| *cfg | subdev pad 信息结构指针 | 输入 |
| *fmt | pad 级 media bus 格式结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p52, table unit 339 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_get_fmt

[说明]

获取 sensor 输出格式。

[语法]

```text
  static int xxxx_get_fmt(struct v4l2_subdev *sd,
                          struct v4l2_subdev_pad_config *cfg,
                          struct v4l2_subdev_format *fmt)
```

[参数]

<!-- Source: English PDF p52, table unit 346 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| *cfg | subdev pad 信息结构指针 | 输入 |
| *fmt | pad 级 media bus 格式结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p52, table unit 348 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

参见 MEDIA_BUS_FMT 表。

##### xxxx_enum_mbus_code

[说明]

枚举 sensor 输出总线格式。

[语法]

```text
  static int xxxx_enum_mbus_code(struct v4l2_subdev *sd,
                                 struct v4l2_subdev_pad_config *cfg,
                                 struct v4l2_subdev_mbus_code_enum *code)
```

[参数]

<!-- Source: English PDF p53, table unit 356 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| *cfg | subdev pad 信息结构指针 | 输入 |
| *code | media bus 格式枚举结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p53, table unit 358 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

下表汇总各种图像类型的对应格式，参见 MEDIA_BUS_FMT 表。

##### xxxx_enum_frame_sizes

[说明]

枚举 sensor 输出尺寸。

[语法]

```text
  static int xxxx_enum_frame_sizes(struct v4l2_subdev *sd,
                              struct v4l2_subdev_pad_config *cfg,
                              struct v4l2_subdev_frame_size_enum *fse)
```

[参数]

<!-- Source: English PDF p53, table unit 366 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| *cfg | subdev pad 信息结构指针 | 输入 |
| *fse | media bus 帧尺寸结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p53, table unit 368 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_g_frame_interval

[说明]

获取 sensor 输出帧率。

[语法]

```text
  static int xxxx_g_frame_interval(struct v4l2_subdev *sd,
                                   struct v4l2_subdev_frame_interval *fi)
```

[参数]

<!-- Source: English PDF p54, table unit 375 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| *fi | pad 级帧率结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p54, table unit 377 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_s_stream

[说明]

设置流的输入和输出。

[语法]

```text
  static int xxxx_s_stream(struct v4l2_subdev *sd, int on)
```

[参数]

<!-- Source: English PDF p54, table unit 384 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| on | 1：开启流输出；0：停止流输出。 | 输入 |

[返回值]

<!-- Source: English PDF p54, table unit 386 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_runtime_resume

[说明]

sensor 上电时的回调函数。

[语法]

```text
  static int xxxx_runtime_resume(struct device *dev)
```

[参数]

<!-- Source: English PDF p55, table unit 393 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *dev | device 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p55, table unit 395 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_runtime_suspend

[说明]

sensor 下电时的回调函数。

[语法]

```text
  static int xxxx_runtime_suspend(struct device *dev)
```

[参数]

<!-- Source: English PDF p55, table unit 402 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *dev | device 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p55, table unit 404 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_set_ctrl

[说明]

设置各个 control 的值。

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p56, table unit 411 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2_ctrl 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p56, table unit 413 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxx_enum_frame_interval

[说明]

枚举传感器支持的帧间隔参数。

[语法]

```text
  static int xxxx_enum_frame_interval(struct v4l2_subdev *sd,
                      struct v4l2_subdev_pad_config *cfg,
                      struct v4l2_subdev_frame_interval_enum *fie)
```

[参数]

<!-- Source: English PDF p56, table unit 420 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | 子设备实例 | 输入 |
| *cfg | pad 配置参数 | 输入 |
| *fie | 帧间隔参数 | 输出 |

[返回值]

<!-- Source: English PDF p56, table unit 422 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_g_mbus_config

[说明]

获取支持的总线配置。例如使用 MIPI 且传感器支持多种 MIPI 传输模式时，可根据传感器当前使用的 MIPI 模式上报参数。

[语法]

```text
  static int xxxx_g_mbus_config(struct v4l2_subdev *sd,
                  struct v4l2_mbus_config *config)
```

[参数]

<!-- Source: English PDF p57, table unit 429 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *config | 总线配置参数 | 输出 |

[返回值]

<!-- Source: English PDF p57, table unit 431 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_get_selection

[说明]

配置裁剪参数。ISP 输入宽度要求 16 对齐，高度要求 8 对齐。若传感器输出分辨率不满足对齐要求或不是标准分辨率，可实现此函数裁剪输入 ISP 的分辨率。

[语法]

```text
  static int xxxx_get_selection(struct v4l2_subdev *sd,
  struct v4l2_subdev_pad_config *cfg,
  struct v4l2_subdev_selection *sel)
```

[参数]

<!-- Source: English PDF p57, table unit 438 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | 子设备实例 | 输入 |
| *cfg | pad 配置参数 | 输入 |
| *sel | 裁剪参数 | 输出 |

[返回值]

<!-- Source: English PDF p57, table unit 440 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

##### 1. 实现标准 I2C 子设备驱动部分。

1.1 按照 struct i2c_driver 的说明实现以下成员：

struct driver.name

struct driver.pm

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：1). 获取 CIS 设备资源，主要解析 DTS 文件定义的资源，参见 CIS 设备注册（DTS）。

1.1) RK 私有资源定义采用 rockchip, camera-module-xxx 命名。驱动将这部分资源上报给用户态 camera_engine，以确定 IQ 效果参数的匹配关系。

1.2) CIS 设备资源定义：RK 相关参考驱动通常包含以下项目：

<!-- Source: English PDF p58, table unit 452 -->

| 成员名称 | 说明 |
| --- | --- |
| CIS 工作参考时钟 | 外部独立晶振方案不必获取；RK 参考设计通常由 AP 输出时钟，此方案须获取，通常名为 xvclk。 |
| CIS 控制 GPIO | 例如 Resst 引脚、Powerdown 引脚（Resst 为原文拼写）。 |
| CIS 控制电源 | 按实际硬件设计获取匹配的软件电源控制资源，如 gpio、regulator。 |

1.3) CIS 设备 ID 检查。通过上述步骤获取必要资源后，建议驱动读取设备 ID，检查硬件是否正确；但此步骤不是必需的。

1.4) 初始化 CIS v4l2 设备和媒体实体；

v4l2 子设备：v4l2_i2c_subdev_init。RK CIS 驱动要求 subdev 具有独立设备节点，供用户态 rk_aiq 访问并通过该节点控制曝光；

媒体实体：media_entity_init

2\. 按 struct v4l2_subdev_ops 的说明实现 v4l2 子设备驱动，主要实现以下 3 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_subdev_video_ops
  struct v4l2_subdev_pad_ops
```

2.1 按 struct v4l2_subdev_core_ops 的说明实现其回调函数，主要包含以下回调：

```text
.s_power.ioctl
.compat_ioctl32
```

ioctl 主要实现的 RK 私有控制命令包括：

<!-- Source: English PDF p59, table unit 464 -->

| 成员名称 | 描述 |
| --- | --- |
| RKMODULE_GET_MODULE_INFO | 将 DTS 定义的模组信息（如名称）通过该命令上传 camera_engine。 |
| RKMODULE_AWB_CFG | 启用模组 OTP 时，camera_engine 通过此命令传入典型模组 AWB 标定值；CIS 驱动与当前模组 AWB 值比较，生成 R/B Gain 并写入 CIS MWB 模块。 |
| RKMODULE_LSC_CFG | 启用模组 OTP 时，camera_engine 通过该命令控制启用 LSC 标定值。 |
| PREISP_CMD_SET_HDRAE_EXP | HDR 曝光设置参见本文 struct preisp_hdrae_exp_s。 |
| RKMODULE_SET_HDR_CFG | 设置 HDR 模式，实现普通/HDR 切换。驱动须适配两组配置，详见本文 struct rkmodule_hdr_cfg。 |
| RKMODULE_GET_HDR_CFG | 获取当前 HDR 模式，参见 struct rkmodule_hdr_cfg。 |
| RKMODULE_SET_CONVERSION_GAIN | 设置线性模式转换增益，如 imx347、os04a10。高转换增益可改善低照度信噪比；sensor 不支持时可不实现。 |

2.2 按 struct v4l2_subdev_video_ops 的说明实现其回调函数，主要包含以下回调：

<!-- Source: English PDF p60, table unit 466 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_stream | 切换数据流。MIPI CLK 为连续模式时必须在该回调开启流；提前开启会导致无法识别 MIPI LP 状态。 |
| .g_frame_interval | 获取帧间隔（帧率） |
| .g_mbus_config | 获取总线配置。MIPI sensor 支持不同 lane 配置或 HDR 时，返回当前工作模式的 MIPI 配置。 |

2.3 按 struct v4l2_subdev_pad_ops 的说明实现其回调函数，主要包含以下回调：

<!-- Source: English PDF p60, table unit 468 -->

| 成员名称 | 说明 |
| --- | --- |
| .enum_mbus_code | 枚举当前 CIS 驱动支持的数据格式 |
| .enum_frame_size | 枚举当前 CIS 驱动支持的分辨率 |
| .get_fmt | RKISP 通过此必需回调获取 CIS 输出格式。Bayer raw、SOC yuv、BW raw sensor 的类型参见 MEDIA_BUS_FMT 表；场输出支持参见 struct v4l2_mbus_framefmt。 |
| .set_fmt | 设置 CIS 驱动输出格式和分辨率，必须实现。 |
| .enum_frame_interval | 枚举 sensor 支持的帧间隔，包含分辨率信息。 |
| .get_selection | 配置裁剪；ISP 输入宽度须 16 对齐，高度须 8 对齐。 |

2.4 按 struct v4l2_ctrl_ops 的说明实现，主要包含以下回调：

<!-- Source: English PDF p60, table unit 470 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_ctrl | RKISP 和 camera_engine 通过不同命令实现 CIS 曝光控制。 |

参照 CIS 驱动 V4L2-controls 列表实现各个 control ID。以下 ID 属于信息获取类，按标准整数菜单控件实现：

<!-- Source: English PDF p61, table unit 472 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_LINK_FREQ | 参见 CIS 驱动 V4L2 controls 标准定义；RKISP 通过此命令获取 MIPI 总线频率。 |
| V4L2_CID_PIXEL_RATE | MIPI 总线：pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample。 |
| V4L2_CID_HBLANK | 参见 CIS 驱动 V4L2 controls 的标准定义。 |
| V4L2_CID_VBLANK | 参见 CIS 驱动 V4L2 controls 的标准定义。 |

RK camera_engine 通过上述命令获取计算曝光所需的信息，涉及以下公式：

##### 公式

```text
line_time = HTS / PIXEL_RATE;
PIXEL_RATE = HTS * VTS * FPS
HTS = sensor_width_out + HBLANK;
VTS = sensor_height_out + VBLANK;
```

以下 ID 属于控制类，RK camera_engine 通过此类命令控制 CIS：

<!-- Source: English PDF p61, table unit 480 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_VBLANK | 调整 VBLANK，从而调整帧率和最大曝光时间。 |
| V4L2_CID_EXPOSURE | 设置曝光时间，单位为曝光行数。 |
| V4L2_CID_ANALOGUE_GAIN | 设置曝光增益，实际总增益 = 模拟增益 × 数字增益；单位为增益寄存器值。 |

##### 3. CIS 驱动不涉及硬件数据接口信息的定义。CIS 设备与 AP 之间的接口连接关系通过 DTS 设备节点的 port 表示，参见 CIS 设备注册（DTS）中的 Port 信息说明。

4. CIS 参考驱动列表。

## VCM 驱动

### VCM 设备注册（DTS）

##### RK VCM 驱动私有参数说明：

<!-- Source: English PDF p62, table unit 485 -->

| 名称 | 说明 |
| --- | --- |
| 起始电流 | VCM 刚好推动镜头从可动行程近端开始运动（模组远焦）时，驱动 IC 输出的电流定义为起始电流。 |
| 额定电流 | VCM 刚好将镜头推至可动行程远端（模组近焦）时，驱动 IC 输出电流定义为额定电流。 |
| VCM 电流输出模式 | VCM 运动产生振荡。驱动 IC 电流变化须考虑振荡周期，以尽量减小振荡；输出模式决定电流达到目标值所需时间。 |

```text
  vm149c: vm149c@0c { // vcm driver configuration, this set up is required when supporting AF
      compatible = "silicon touch,vm149c";
      status = "okay";
      reg = <0x0c>;
      rockchip,vcm-start-current = <0>;// Starting current of the motor
      rockchip,vcm-rated-current = <100>; // Motor rated current
      rockchip,vcm-step-mode = <4>; // Current output mode of motor drive IC
      rockchip,camera-module-index = <0>; // Module number
      rockchip,camera-module-facing = "back"; // Module orientation, there are "back" and "front"
  };
  ov13850: ov13850@10 {
      ......
      lens-focus = <&vm149c>; // vcm driver set up, need to have this set up when supporting AF
      ......
  };
```

### VCM 驱动说明

#### 数据类型简述

##### struct i2c_driver

[说明]

定义 I2C 设备驱动信息。

[定义]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[关键成员]

<!-- Source: English PDF p63, table unit 495 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | 设备模型驱动主要包含驱动名和匹配 DTS 注册设备的 of_match_table。of_match_table 的 compatible 与 DTS 中 compatible 匹配时调用 .probe。 |
| @id_table | 驱动支持的 I2C 设备列表。内核不通过 of_match_table 和 DTS 注册设备匹配时，使用此表匹配。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  static const struct i2c_device_id vm149c_id_table[] = {
      { VM149C_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, vm149c_id_table);
  static const struct of_device_id vm149c_of_table[] = {
      { .compatible = "silicon touch,vm149c" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, vm149c_of_table);
  static const struct dev_pm_ops vm149c_pm_ops = {
      SET_SYSTEM_SLEEP_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume)
      SET_RUNTIME_PM_OPS(vm149c_vcm_suspend, vm149c_vcm_resume, NULL)
  };
  static struct i2c_driver vm149c_i2c_driver = {
      .driver = {
          .name = VM149C_NAME,
          .pm = &vm149c_pm_ops,
          .of_match_table = vm149c_of_table,
      },
      .probe = &vm149c_probe,
      .remove = &vm149c_remove,
      .id_table = vm149c_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
                             unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p64, table unit 504 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops vm149c_core_ops = {
      .ioctl = vm149c_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = vm149c_compat_ioctl32
  #endif
  };
```

当前使用以下私有 ioctl 查询电机运动的时间信息。

```text
RK_VIDIOC_VCM_TIMEINFO
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
     int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
     int (*try_ctrl)(struct v4l2_ctrl *ctrl);
     int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p65, table unit 515 -->

| 成员名称 | 说明 |
| --- | --- |
| .g_volatile_ctrl | 获取 control 新值，通常用于持续变化的 volatile（通常只读）control，例如当前信号强度。 |
| .s_ctrl | 实际设置新 control 值，s_ctrl 必须实现。调用时持有 ctrl-&gt;handler-&gt;lock，其他调用者不能访问该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops vm149c_vcm_ctrl_ops = {
      .g_volatile_ctrl = vm149c_get_ctrl,
      .s_ctrl = vm149c_set_ctrl,
  };
```

vm149c_get_ctrl 和 vm149c_set_ctrl 支持以下控件：

```text
V4L2_CID_FOCUS_ABSOLUTE
```

#### API 简述

##### xxxx_get_ctrl

[说明]

获取电机的移动位置。

[语法]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p65, table unit 527 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p66, table unit 529 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_set_ctrl

[说明]

设置电机的移动位置。

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p66, table unit 536 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p66, table unit 538 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

自定义 ioctl 的实现函数，主要包括获取电机运动的时间信息。

实现自定义的 RK_VIDIOC_COMPAT_VCM_TIMEINFO。

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p66, table unit 546 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p67, table unit 548 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

##### 1. 实现标准 i2c 子设备驱动部分。

1.1 按照 struct i2c_driver 的说明，主要实现以下部分：

struct driver.name

struct driver.pm

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1\. 获取 VCM 设备资源，主要获取 DTS 资源，参见 VCM 设备注册（DTS）。

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数，与 Camera 设备进行匹配。

1.2) VCM 参数采用 rockchip, vcm-xxx 等命名，主要包括起始电流、额定电流、运动模式等硬件参数，关联电机的运动范围和速度。

2\. 初始化 VCM v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。RK VCM 驱动要求 subdev 具有独立设备节点，供用户态 camera_engine 访问，并通过该节点控制对焦；

媒体实体：media_entity_init；

3\. RK AF 算法将模组镜头整个可移动行程的位置参数定义为 [0,64]。整个行程对应的 VCM 驱动电流变化范围为 [起始电流, 额定电流]。建议在函数中实现二者之间的映射换算。

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按照 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
.ioctl.compat_ioctl32
```

此回调主要实现 RK 私有控制命令，包括：

<!-- Source: English PDF p68, table unit 572 -->

| 成员名称 | 说明 |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | camera_engine 获取镜头运动所需时间，判断停止时刻及 CIS 帧曝光与镜头运动时间是否重叠。运动时间与距离、VCM IC 电流输出模式有关。 |

2.2 按照 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl 和 .s_ctrl 使用标准 v4l2 control 实现以下命令：

<!-- Source: English PDF p68, table unit 576 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | camera_engine 设置/获取镜头绝对位置；RK AF 算法将整个可动行程位置定义为 [0,64]。 |

## FlashLight 驱动

### FLASHLight 设备注册（DTS）

##### SGM378 DTS 参考：

```text
  &i2c1 {
      ...
      sgm3784: sgm3784@30 {//Flash equipment
          #address-cells = <1>;
          #size-cells = <0>;
          compatible = "sgmicro,gsm3784";
          reg = <0x30>;
          rockchip,camera-module-index = <0>;//The flash corresponds to the camera module number
          rockchip,camera-module-facing = "back";//The flash corresponds to the orientation of the camera module
          enable-gpio = <&gpio2 RK_PB4 GPIO_ACTIVE_HIGH>;//enable gpio
          strobe-gpio = <&gpio1 RK_PA3 GPIO_ACTIVE_HIGH>;//flash trigger gpio
          status = "okay";
          sgm3784_led0: led@0 {//led0 device information
              reg = <0x0>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
          sgm3784_led1: led@1 {//led1 device information
              reg = <0x1>;//index
              led-max-microamp = <299200>;//Torch mode maximum current
              flash-max-microamp = <1122000>;//flash mode maximum current
              flash-max-timeout-us = <1600000>;//maximum flash time
          };
      };
      ...
      ov13850: ov13850@10 {
          ...
          flash-leds = <&sgm3784_led0 &sgm3784_led1>;//The flash device is hooked to the camera
          ...
      };
      ...
  }
```

##### GPIO、PWM 控制的 dts 参考：

```text
  flash_ir: flash-ir {
          status = "okay";
          compatible = "led,rgb13h";
          label = "pwm-flash-ir";
          led-max-microamp = <20000>;
          flash-max-microamp = <20000>;
          flash-max-timeout-us = <1000000>;
          pwms=<&pwm3 0 25000 0>;
          //enable-gpio = <&gpio0 RK_PA1 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx415: imx415@1a {
          ...
          flash-leds = <&flash_ir>;
          ...
      }
  }
```

##### 注意：

1\. 软件需根据补光灯类型区分处理流程。若为红外补光灯，dts 补光灯节点标签必须包含 ir，以标识硬件类型；LED 补光灯可移除 ir 字段。

2\. 对于这种单引脚控制电路，有两种情况：固定亮度时直接使用 gpio；亮度可控时使用 pwm，通过占空比调节亮度。dts 的 pwms 或 enable-gpio 两种配置选择其一。

### FLASHLight 驱动说明

#### 数据类型简述

##### struct i2c_driver

[说明]

定义 I2C 设备驱动信息。

[定义]

```text
  struct i2c_driver {
      ……
      /* Standard driver model interfaces */
      int (*probe)(struct i2c_client *, const struct i2c_device_id *);
      int (*remove)(struct i2c_client *);
      ……
      struct device_driver driver;
      const struct i2c_device_id *id_table;
      ……
  };
```

[关键成员]

<!-- Source: English PDF p70, table unit 597 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | 设备模型驱动主要包含驱动名和匹配 DTS 注册设备的 of_match_table。of_match_table 的 compatible 与 DTS 中 compatible 匹配时调用 .probe。 |
| @id_table | 驱动支持的 I2C 设备列表。内核不通过 of_match_table 和 DTS 注册设备匹配时，使用此表匹配。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  static const struct i2c_device_id sgm3784_id_table[] = {
      { SGM3784_NAME, 0 },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(i2c, sgm3784_id_table);
  static const struct of_device_id sgm3784_of_table[] = {
      { .compatible = "sgmicro,sgm3784" },
      { { 0 } }
  };
  MODULE_DEVICE_TABLE(of, sgm3784_of_table);
  static const struct dev_pm_ops sgm3784_pm_ops = {
      SET_RUNTIME_PM_OPS(sgm3784_runtime_suspend, sgm3784_runtime_resume, NULL)
  };
  static struct i2c_driver sgm3784_i2c_driver = {
      .driver = {
          .name = sgm3784_NAME,
          .pm = &sgm3784_pm_ops,
          .of_match_table = sgm3784_of_table,
      },
      .probe = &sgm3784_probe,
      .remove = &sgm3784_remove,
      .id_table = sgm3784_id_table,
  };
  module_i2c_driver(vm149c_i2c_driver);
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p71, table unit 607 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops sgm3784_core_ops = {
      .ioctl = sgm3784_ioctl,
  #ifdef CONFIG_COMPAT
      .compat_ioctl32 = sgm3784_compat_ioctl32
  #endif
  };
```

当前通过以下私有 ioctl 查询闪光灯点亮的时间信息。

```text
RK_VIDIOC_FLASH_TIMEINFO
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p72, table unit 618 -->

| 成员名称 | 说明 |
| --- | --- |
| .g_volatile_ctrl | 获取 control 新值，通常用于持续变化的 volatile（通常只读）control，例如当前信号强度。 |
| .s_ctrl | 实际设置新 control 值，s_ctrl 必须实现。调用时持有 ctrl-&gt;handler-&gt;lock，其他调用者不能访问该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops sgm3784_ctrl_ops[LED_MAX] = {
      [LED0] = {
          .g_volatile_ctrl = sgm3784_led0_get_ctrl,
          .s_ctrl = sgm3784_led0_set_ctrl,
      },
      [LED1] = {
          .g_volatile_ctrl = sgm3784_led1_get_ctrl,
          .s_ctrl = sgm3784_led1_set_ctrl,
      }
  };
```

#### API 简述

##### xxxx_set_ctrl

[说明]

设置闪光模式、电流和闪光超时时间。

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p72, table unit 628 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p72, table unit 630 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_get_ctrl

[说明]

获取闪光灯故障状态。

[语法]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p73, table unit 637 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p73, table unit 639 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

自定义 ioctl 的实现函数，主要包括获取闪光灯的时间信息。

实现自定义的 RK_VIDIOC_COMPAT_FLASH_TIMEINFO。

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p73, table unit 647 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p73, table unit 649 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

对于直接由普通 gpio 控制的 LED，参见 kernel/drivers/leds/leds-rgb13h.c 和 kernel/Documentation/devicetree/bindings/leds/leds-rgb13h.txt。

闪光灯驱动 IC 可按以下方式移植：

##### 1. 实现标准 i2c 子设备驱动部分。

1.1 按照 struct i2c_driver 的说明，主要实现以下部分：

struct driver.name

struct driver.pm

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1\. 获取闪光灯设备资源，主要获取 DTS 资源，参见 FLASHLIGHT 设备注册（DTS）；

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数，与 Camera 设备进行匹配。

2\. 闪光灯设备名称：

双 LED 闪光灯使用 led0 和 led1 设备名区分。

```text
  /* NOTE: to distinguish between two led
   * name: led0 meet the main led
   * name: led1 meet the secondary led
   */
  snprintf(sd->name, sizeof(sd->name),
           "m%02d_%s_%s_led%d %s",
           flash->module_index, facing,
           SGM3784_NAME, i, dev_name(sd->dev));
```

3\. 初始化 FLASH v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。RK 闪光灯驱动要求 subdev 具有独立设备节点，供用户态 camera_engine 访问并通过该节点控制 LED；

媒体实体：media_entity_init；

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按照 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
.ioctl.compat_ioctl32
```

此回调主要实现 RK 私有控制命令，包括：

<!-- Source: English PDF p75, table unit 676 -->

| 成员名称 | 说明 |
| --- | --- |
| RK_VIDIOC_FLASH_TIMEINFO | camera_engine 获取 LED 点亮时刻，判断 CIS 帧曝光是否在闪光开启之后。 |

2.2 按照 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl 和 .s_ctrl 使用标准 v4l2 control 实现以下命令：

<!-- Source: English PDF p75, table unit 680 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_FLASH_FAULT | 获取闪光故障信息 |
| V4L2_CID_FLASH_LED_MODE | 设置 LED 模式：V4L2_FLASH_LED_MODE_NONE、V4L2_FLASH_LED_MODE_TORCH、V4L2_FLASH_LED_MODE_FLASH。 |
| V4L2_CID_FLASH_STROBE | 控制开启闪光 |
| V4L2_CID_FLASH_STROBE_STOP | 控制关闭闪光 |
| V4L2_CID_FLASH_TIMEOUT | 设置 flash 模式最大连续点亮时间 |
| V4L2_CID_FLASH_INTENSITY | 设置 flash 模式电流 |
| V4L2_CID_FLASH_TORCH_INTENSITY | 设置 torch 模式电流 |

## FOCUS、ZOOM、P-IRIS 驱动

此处驱动指步进电机控制的自动对焦（FOCUS）、变焦（ZOOM）和自动光圈（P-IRIS）。由于步进电机控制方式相同及硬件设计因素，三项功能集成为一个驱动。根据使用的驱动芯片（如 SPI 控制芯片），可将驱动封装为 SPI 框架子设备。本章以 MP6507 和 MS41908 为例，说明驱动需实现的数据结构、框架与注意事项。

### MP6507 设备注册（DTS）

```text
  mp6507: mp6507 {
      status = "okay";
      compatible = "monolithicpower,mp6507";
      #pwm-cells = <3>;
      pwms = <&pwm6 0 25000 0>,
             <&pwm10 0 25000 0>,
             <&pwm9 0 25000 0>,
             <&pwm8 0 25000 0>;
      pwm-names = "ain1","ain2","bin1","bin2";
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      iris_en-gpios  = <&gpio0 RK_PC2 GPIO_ACTIVE_HIGH>;
      focus_en-gpios  = <&gpio0 RK_PC3 GPIO_ACTIVE_HIGH>;
      zoom_en-gpios  = <&gpio0 RK_PC0 GPIO_ACTIVE_HIGH>;
      iris-step-max = <80>;
      focus-step-max = <7500>;
      zoom-step-max = <7500>;
      iris-start-up-speed = <1200>;
      focus-start-up-speed = <1200>;
      focus-max-speed = <2500>;
      zoom-start-up-speed = <1200>;
      zoom-max-speed = <2500>;
      focus-first-speed-step = <8>;
      zoom-first-speed-step = <8>;
      focus-speed-up-table = < 1176 1181 1188 1196
                               1206 1217 1231 1246
                               1265 1286 1309 1336
                               1365 1396 1429 1464
                               1500 1535 1570 1603
                               1634 1663 1690 1713
                               1734 1753 1768 1782
                               1793 1803 1811 1818>;
      focus-speed-down-table = < 1796 1788 1779 1768
                                 1756 1743 1728 1712
                                 1694 1674 1653 1630
                                 1605 1580 1554 1527
                                 1500 1472 1445 1419
                                 1394 1369 1346 1325
                                 1305 1287 1271 1256
                                 1243 1231 1220 1211
                                 1203 1195 1189 1184
                                 1179 1175>;
      zoom-speed-up-table = < 1198 1205 1212 1220
                              1228 1238 1249 1260
                              1272 1285 1299 1313
                              1328 1343 1359 1375
                              1390 1406 1421 1436
                              1450 1464 1477 1489
                              1500 1511 1521 1529
                              1537 1544 1551>;
      zoom-speed-down-table = < 1547 1540 1531 1522
                                1511 1499 1487 1473
                                1458 1443 1426 1409
                                1392 1375 1357 1340
                                1323 1306 1291 1276
                                1262 1250 1238 1227
                                1218 1209 1202 1195
                                1189 1184 1179 1175
                                1171 1168>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&mp6507>;
          ...
      }
  }
  &pwm6 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm6m1_pins_pull_up>;
  };
  &pwm8 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm8m1_pins_pull_down>;
      center-aligned;
  };
  &pwm9 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm9m1_pins_pull_down>;
      center-aligned;
  };
  &pwm10 {
      status = "okay";
      pinctrl-names = "active";
      pinctrl-0 = <&pwm10m1_pins_pull_down>;
  };
```

##### RK 私有定义说明：

<!-- Source: English PDF p78, table unit 688 -->

| 成员名称 | 说明 |
| --- | --- |
| rockchip,<br>camera-module-index | 摄像头序号，用于字段匹配摄像头。 |
| rockchip,<br>camera-module-facing | 摄像头朝向，用于字段匹配摄像头。 |
| iris_en-gpios | IRIS 使能 GPIO |
| focus_en-gpios | 对焦使能 GPIO |
| zoom_en-gpios | 变焦使能 GPIO |
| rockchip,iris-step-max | P-IRIS 步进电机最大移动步数 |
| rockchip,focus-step-max | 对焦步进电机最大移动步数 |
| zoom-step-max | 变焦步进电机最大移动步数 |
| iris-start-up-speed | IRIS 步进电机起始速度 |
| focus-start-up-speed | 对焦步进电机起始速度 |
| focus-max-speed | 对焦步进电机最大运行速度 |
| zoom-start-up-speed | 变焦步进电机起始速度 |
| zoom-max-speed | 变焦步进电机最大运行速度 |
| focus-first-speed-step | 对焦起始速度阶段步数；之后加速区间的步数按比例增加，使各速度阶段运行时间尽可能相同。 |
| zoom-first-speed-step | 变焦起始速度阶段步数；之后加速区间步数按比例增加，使各速度阶段运行时间尽可能相同。 |
| focus-speed-up-table | 对焦加速曲线采用查表法，调整参数后配置生成的梯形或 S 形加速数据表。未配置或仅一个数据时按起始速度匀速运行；曲线最小值不超过电机最大起始速度，最大值不超过步进电机最大运行速度。 |
| focus-speed-down-table | 对焦减速曲线最大值必须小于加速曲线最大值。加速曲线无效时减速也无效，全程按起始速度匀速；未配置减速曲线时，由加速曲线对称生成。 |
| zoom-speed-up-table | 变焦加速采用查表法，配置生成的梯形或 S 形曲线；未配置或只有一个数据时按起始速度匀速。最小值不超过最大起始速度，最大值不超过步进电机最大运行速度。 |
| zoom-speed-down-table | 变焦减速曲线最大值须小于加速最大值；加速曲线无效则减速也无效，全程按起始速度匀速。未配置减速曲线时，由加速曲线对称生成。 |

#### 数据类型简述

##### struct platform_driver

[说明]

定义 platform 设备驱动信息。

[定义]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[关键成员]

<!-- Source: English PDF p80, table unit 698 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | struct device_driver 主要包含驱动名称及匹配 DTS 设备的 of_match_table；compatible 匹配时调用 .probe。 |
| @id_table | 内核不通过 of_match_table 与 DTS 注册设备匹配时，使用此表。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "monolithicpower,mp6507", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p81, table unit 707 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p81, table unit 716 -->

| 成员名称 | 说明 |
| --- | --- |
| .g_volatile_ctrl | 获取 control 新值，通常用于持续变化的 volatile（通常只读）control，例如当前信号强度。 |
| .s_ctrl | 实际设置新 control 值，s_ctrl 必须实现。调用时持有 ctrl-&gt;handler-&gt;lock，其他调用者不能访问该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### API 简述

##### xxxx_set_ctrl

[说明]

调用标准 v4l2_control 设置对焦、变焦和 P 光圈位置。

实现以下 v4l2 标准命令：

<!-- Source: English PDF p82, table unit 724 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | 控制对焦；0 表示最小焦距，近处清晰。 |
| V4L2_CID_ZOOM_ABSOLUTE | 控制变焦倍数；0 表示最小倍数、最大视场。 |
| V4L2_CID_IRIS_ABSOLUTE | 控制 P 光圈开口；0 表示关闭光圈。 |

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p82, table unit 728 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p82, table unit 730 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

##### xxxx_get_ctrl

[说明]

调用标准 v4l2_control 获取对焦、变焦和 P 光圈的当前位置。

实现以下 v4l2 标准命令：

<!-- Source: English PDF p82, table unit 735 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | 控制对焦；0 表示最小焦距，近处清晰。 |
| V4L2_CID_ZOOM_ABSOLUTE | 控制变焦倍数；0 表示最小倍数、最大视场。 |
| V4L2_CID_IRIS_ABSOLUTE | 控制 P 光圈开口；0 表示关闭光圈。 |

[语法]

```text
  static int xxxx_get_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p83, table unit 739 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输出 |

[返回值]

<!-- Source: English PDF p83, table unit 741 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

自定义 ioctl 的实现主要包括获取对焦、变焦和 P 光圈的时间信息（运动开始与结束时间戳）。由于使用的镜头没有定位装置，必要时需重置镜头电机位置。

##### 实现的自定义项：

<!-- Source: English PDF p83, table unit 746 -->

| 成员名称 | 说明 |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | 对焦时间信息，用于判断当前帧是否为对焦完成后的有效帧。 |
| RK_VIDIOC_ZOOM_TIMEINFO | 变焦时间信息，用于判断当前帧是否为变焦完成后的有效帧。 |
| RK_VIDIOC_IRIS_TIMEINFO | 光圈时间信息，用于判断当前帧是否为光圈调整后的有效帧。 |
| RK_VIDIOC_FOCUS_CORRECTION | 对焦位置校正（复位） |
| RK_VIDIOC_ZOOM_CORRECTION | 变焦位置校正（复位） |
| RK_VIDIOC_IRIS_CORRECTION | 光圈位置校正（复位） |

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p84, table unit 750 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p84, table unit 752 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

SPI 控制的驱动芯片可使用 SPI 框架移植。RK 参考驱动采用 MP6507，直接由 pwm 输出控制波形，经 MP6507 功率放大，因此直接基于 platform 框架移植。参考驱动：/kernel/drivers/media/i2c/mp6507.c。

移植步骤如下：

##### 1. 实现标准 platform 子设备驱动部分。

1.1 根据 struct platform_driver 的说明，主要实现以下部分：

struct driver.name

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1\. 获取设备资源，主要获取 DTS 资源，参见 MP6507 设备注册（DTS）；

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数以匹配 Camera 设备。

1.2) 获取 pwm 配置。按电机控制方式，AB 相的相位差为 90 度，可通过将 B 相 PWM 配置为中心对齐实现。在 dts 的 pwm 节点配置 center-aligned；详细参见 MP6507 设备注册（DTS）。

![英文原图 6，PDF 第 85 页](/docs/rockchip-vi-driver/assets/en-p85-X457.png)

*英文原图 6，PDF 第 85 页*

激励序列；输出轴顺时针（CW）旋转。

| 相位 / 步骤 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| A | + | + | − | − |
| A̅ | − | − | + | + |
| B | − | + | + | − |
| B̅ | + | − | − | + |

1.3) 获取使能引脚。MP6507 需要 4 路 PWM 生成步进电机控制波形。由于硬件 PWM 有限，对焦、变焦和 P 光圈电机分别采用一颗 MP6507，通过 gpio 使能对应芯片，实现 PWM 分时复用。缺点是同一时间只能驱动一个步进电机，另外两个必须等待上一次操作结束。

1.4) 获取各电机的最大步数、最大启动速度、最大运行速度、加速曲线数据等硬件约束与资源。

2\. hrtimer_init 初始化定时器。pwm 使用连续模式，需要定时器计时；输出指定数量的 pwm 波形后，定时器中断关闭 pwm。加速过程中也需在指定波形数后进入定时器中断修改 pwm 频率，实现步进电机加速。

3\. init_completion 通过 completion 实现同步，前一电机运动结束后才能执行下一次电机操作。

4\. 初始化 v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。驱动要求 subdev 具有独立设备节点，供用户态 rkaiq 访问，并通过该节点控制电机；

媒体实体：media_entity_init；

5\. 闪光灯设备名称：

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按照 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
  .ioctl
  .compat_ioctl32
```

此回调主要实现 RK 私有控制命令，包括：

<!-- Source: English PDF p86, table unit 783 -->

| 成员名称 | 说明 |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | 对焦时间信息，用于判断当前帧是否为对焦完成后的有效帧。 |
| RK_VIDIOC_ZOOM_TIMEINFO | 变焦时间信息，用于判断当前帧是否为变焦完成后的有效帧。 |
| RK_VIDIOC_IRIS_TIMEINFO | 光圈时间信息，用于判断当前帧是否为光圈调整后的有效帧。 |
| RK_VIDIOC_FOCUS_CORRECTION | 对焦位置校正（复位） |
| RK_VIDIOC_ZOOM_CORRECTION | 变焦位置校正（复位） |
| RK_VIDIOC_IRIS_CORRECTION | 光圈位置校正（复位） |

2.2 按照 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.g_volatile_ctrl
.s_ctrl
```

.g_volatile_ctrl 和 .s_ctrl 使用标准 v4l2 control 实现以下命令：

<!-- Source: English PDF p86, table unit 788 -->

| 参数名称 | 说明 |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | 控制对焦；0 表示最小焦距，近处清晰。 |
| V4L2_CID_ZOOM_ABSOLUTE | 控制变焦倍数；0 表示最小倍数、最大视场。 |
| V4L2_CID_IRIS_ABSOLUTE | 控制 P 光圈开口；0 表示关闭（原文末尾含 **）。 |

##### 3. 步进电机加速曲线参考：

3.1 梯形曲线：可如图按相等时间间隔和速度增量进行加减速。

![英文原图 7，PDF 第 86 页](/docs/rockchip-vi-driver/assets/en-p86-X460.png)

*英文原图 7，PDF 第 86 页*

3.2 S 曲线

若梯形加速不理想，可考虑 S 形加速，参考以下公式：

`Speed = Vmin + ((Vmax-Vmin) / (1 + exp(-fac * (i-Num) / Num)));`

其中 Vmin 为电机启动速度，Vmax 为目标速度；fac 为曲线系数，一般取 4~6，值越大曲线中部越陡；i 为速度分段序号，分 32 段加速时取 0~31；Num 为速度段数的一半，32 段时 num 为 16。

![英文原图 8，PDF 第 87 页](/docs/rockchip-vi-driver/assets/en-p87-X463.png)

*英文原图 8，PDF 第 87 页*

### MS41908 设备注册（DTS）

部分镜头支持 PIRIS、FOCUS、ZOOM、ZOOM1，或 DC-IRIS、FOCUS、ZOOM 的组合，因此 MS41908 将 PIRIS、FOCUS、ZOOM、ZOOM1、DC-IRIS 设计为可配置功能，并可多次加载驱动来组合多个驱动芯片。这使 dts 较复杂，请仔细阅读各参数说明。

```text
  &spi0 {
      status = "okay";
      pinctrl-names = "default";
      pinctrl-0 = <&spi0m0_clk &spi0m0_cs0n &spi0m0_miso &spi0m0_mosi>;
      //If pinctrl is not configured, confirm whether the default pinctrl is the actual pin group
      assigned-clocks = <&pmucru CLK_SPI0>;
      assigned-clock-rates = <100000000>;
      ms41908: ms41908@00 {
          status = "okay";
          compatible = "relmon,ms41908";
          reg = <0>;
          pinctrl-names = "default";
          focus-start-up-speed = <800>;
          zoom-start-up-speed = <800>;
          focus-step-max = <3160>;
          zoom-step-max = <1520>;
          focus-backlash = <18>;
          vd_fz-period-us = <10000>;
          vd_fz-gpios = <&gpio3 RK_PC6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
          use-focus;
          use-zoom;
          focus-used-pin = "cd";
          zoom-used-pin = "ab";
      };
  };
  &i2c1 {
      imx335: imx335@1a{
          ...
          lens-focus = <&ms41908>;
          //Multiple device registration，lens-focus = <&ms41908_0 &ms41908_1>;
          ...
      };
  };
```

#### 基本说明：

<!-- Source: English PDF p88, table unit 800 -->

| 成员名称 | 说明 |
| --- | --- |
| pinctrl-0 | SPI 引脚定义，按硬件配置映射 SPI 功能，例如 pinctrl-0 = &lt;&amp;spi0m0_clk &amp;spi0m0_cs0n &amp;spi0m0_miso &amp;spi0m0_mosi&gt;;。 |
| assigned-clocks<br>assigned-clock-rates | SPI 时钟配置，建议 100MHz。 |
| reg | reg = &lt;0&gt;; 使用 cs0；reg = &lt;1&gt;; 使用 cs1。 |
| rockchip,camera-module-index | 摄像头序号，用于匹配摄像头。 |
| rockchip,camera-module-facing | 摄像头朝向，用于匹配摄像头。 |
| reset-gpios | ms41908 复位引脚，硬件固定上拉时可不配置。 |
| vd_fz-period-us | 步进驱动寄存器更新所需脉冲周期，两电机共用同一脉冲。电机运行时间超过 vd 周期会失步，驱动保证单次运动周期在 vd 周期内。 |

#### FOCUS 说明：

<!-- Source: English PDF p89, table unit 802 -->

| 成员名称 | 说明 |
| --- | --- |
| use-focus | 是否使用对焦功能 |
| focus-used-pin | 每颗 ms41908 可驱动两电机，对应引脚组为 ab、cd，按实际硬件接线配置。 |
| focus-backlash | 齿轮间隙造成的误差，电机换向时补偿的步数，由实际镜头测试确定。 |
| focus-start-up-speed | 步进电机起始速度，单位 PPS。 |
| focus-step-max | 电机有效行程，单位为步数。 |
| focus-ppw | 设置 ms41908 输出 PWM 占空比 0–255，值越大驱动能力越强，按电机负载调整。 |
| focus-phmode | 设置 ms41908 输出 PWM 波形相位校正，通常不配置，依实际情况确定。 |
| focus-micro | 微步细分为 64、128、256，默认 256。 |
| focus-reback-distance | 对焦曲线须沿同一方向运动才能定位准确。例如当前位置 100，要退到 90，须先退至 80 再到 90；此参数为额外回退步数。 |
| focus-1-2phase-excitation | 默认 2-2 相励磁，可配置 1-2 相，例如 focus-1-2phase-excitation;。 |
| focus-dir-opposite | 电机方向与实际对焦曲线相反时可反转，例如 focus-dir-opposite;。 |

##### 光耦说明：

<!-- Source: English PDF p90, table unit 804 -->

| 成员名称 | 说明 |
| --- | --- |
| focus-pic | 光耦 C 引脚检测电平跳变，跳变交界点为光耦原点。 |
| focus-pia | 光耦 A 引脚驱动光电二极管，校准时拉高、正常工作拉低，否则影响成像。 |
| focus-pie | 硬件可直接接地；若由 GPIO 控制，须配置为低电平。 |
| focus-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |
| focus-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |

注意：无光耦定位的镜头无需配置光耦参数。

#### ZOOM 说明：

<!-- Source: English PDF p91, table unit 807 -->

| 成员名称 | 说明 |
| --- | --- |
| use-zoom | 是否使用变焦功能 |
| zoom-used-pin | 每颗 ms41908 可驱动两电机，对应引脚组为 ab、cd，按实际硬件接线配置。 |
| zoom-backlash | 齿轮间隙误差，电机换向补偿步数，按测试确定。 |
| zoom-start-up-speed | 步进电机起始速度，单位 PPS。 |
| zoom-step-max | 电机有效行程，单位为步数。 |
| zoom-ppw | 设置 ms41908 输出 PWM 占空比 0–255，值越大驱动能力越强，按电机负载调整。 |
| zoom-phmode | 设置 ms41908 输出 PWM 波形相位校正，通常不配置，依实际情况确定。 |
| zoom-micro | 微步细分为 64、128、256，默认 256。 |
| zoom-1-2phase-excitation | 默认 2-2 相励磁，可用 zoom-1-2phase-excitation; 配置 1-2 相。 |
| zoom-dir-opposite | 运动方向与实际对焦曲线相反时，用 zoom-dir-opposite; 反转。 |

##### 光耦说明：

<!-- Source: English PDF p91, table unit 809 -->

| 成员名称 | 说明 |
| --- | --- |
| zoom-pic | 光耦 C 引脚检测电平跳变，跳变交界点为光耦原点。 |
| zoom-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |
| zoom-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |

注意：无光耦定位的镜头无需配置光耦参数。

#### ZOOM1 说明：

<!-- Source: English PDF p92, table unit 812 -->

| 成员名称 | 说明 |
| --- | --- |
| use-zoom1 | 是否启用 zoom1；部分镜头支持两组变焦控制。 |
| zoom1-used-pin | 每颗 ms41908 可驱动两电机，对应引脚组为 ab、cd，按实际硬件接线配置。 |
| zoom1-backlash | 齿轮间隙误差，电机换向补偿步数，按测试确定。 |
| zoom1-start-up-speed | 步进电机起始速度，单位 PPS。 |
| zoom1-step-max | 电机有效行程，单位为步数。 |
| zoom1-ppw | 设置 ms41908 输出 PWM 占空比 0–255，值越大驱动能力越强，按电机负载调整。 |
| zoom1-phmode | 设置 ms41908 输出 PWM 波形相位校正，通常不配置，依实际情况确定。 |
| zoom1-micro | 微步细分为 64、128、256，默认 256。 |
| zoom1-1-2phase-excitation | 默认 2-2 相励磁，可用 zoom1-1-2phase-excitation; 配置 1-2 相。 |
| zoom1-dir-opposite | 运动方向与实际对焦曲线相反时，用 zoom1-dir-opposite; 反转。 |

##### 光耦说明：

<!-- Source: English PDF p93, table unit 814 -->

| 成员名称 | 说明 |
| --- | --- |
| zoom1-pic | 光耦 C 引脚检测电平跳变，跳变交界点为光耦原点。 |
| zoom1-pia | 光耦 A 引脚驱动光电二极管，校准时拉高、正常工作拉低，否则影响成像。 |
| zoom1-pie | 硬件可直接接地；若由 GPIO 控制，须配置为低电平。 |
| zoom1-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |
| zoom1-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |

注意：无光耦定位的镜头无需配置光耦参数。

#### PIRIS 说明：

<!-- Source: English PDF p94, table unit 817 -->

| 成员名称 | 说明 |
| --- | --- |
| use-p-iris | 是否使用 P-IRIS |
| piris-used-pin | 每颗 ms41908 可驱动两电机，对应引脚组为 ab、cd，按实际硬件接线配置。 |
| piris-backlash | 齿轮间隙造成的误差，电机换向时补偿的步数，由实际镜头测试确定。 |
| piris-start-up-speed | 步进电机起始速度，单位 PPS。 |
| piris-step-max | 电机有效行程，单位为步数。 |
| piris-ppw | 设置 ms41908 输出 PWM 占空比 0–255，值越大驱动能力越强，按电机负载调整。 |
| piris-phmode | 设置 ms41908 输出 PWM 波形相位校正，通常不配置，依实际情况确定。 |
| piris-micro | 微步细分为 64、128、256，默认 256。 |
| piris-1-2phase-excitation | 默认 2-2 相励磁，可用 piris-1-2phase-excitation; 配置 1-2 相。 |
| piris-dir-opposite | 运动方向与实际对焦曲线相反时，用 piris-dir-opposite; 反转。 |

##### 光耦说明：

<!-- Source: English PDF p95, table unit 819 -->

| 成员名称 | 说明 |
| --- | --- |
| piris-pic | 光耦 C 引脚检测电平跳变，跳变交界点为光耦原点。 |
| piris-pia | 光耦 A 引脚驱动光电二极管，校准时拉高、正常工作拉低，否则影响成像。 |
| piris-pie | 硬件可直接接地；若由 GPIO 控制，须配置为低电平。 |
| piris-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |
| piris-min-pos | 测量光耦原点左右步数并填入 DTS，可大于实际值。 |

注意：无光耦定位的镜头无需配置光耦参数。

#### DCIRIS 说明：

<!-- Source: English PDF p95, table unit 822 -->

| 成员名称 | 说明 |
| --- | --- |
| use-dc-iris | 是否使用 DC-IRIS |
| vd_iris-gpios | 使 DC 光圈相关寄存器生效的同步脉冲引脚。 |
| dc-iris-reserved-polarity | DC 光圈极性；若 0 表示全开，可设置此属性反转。 |
| dc-iris-max-log | DC 光圈目标范围为 0~1023，实际有效范围可能更小，可用此参数限制。 |

#### 数据类型简述

##### struct spi_driver

[说明]

定义 platform 设备驱动信息。

[定义]

```text
  struct spi_driver {
          int (*probe)(struct spi_device *spi);
          int (*remove)(struct spi_device *spi);
          struct device_driver driver;
          const struct spi_device_id *id_table;
  };
```

[关键成员]

<!-- Source: English PDF p96, table unit 830 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | struct device_driver 主要包含驱动名称及匹配 DTS 设备的 of_match_table；compatible 匹配时调用 .probe。 |
| @id_table | 内核不通过 of_match_table 与 DTS 注册设备匹配时，使用此表。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  static const struct spi_device_id motor_match_id[] = {
      {"relmon,ms41908", 0 },
      { }
  };
  static struct spi_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe      = &motor_dev_probe,
      .remove     = &motor_dev_remove,
      .id_table   = motor_match_id,
  };
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p97, table unit 839 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*g_volatile_ctrl)(struct v4l2_ctrl *ctrl);
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p97, table unit 848 -->

| 成员名称 | 说明 |
| --- | --- |
| .g_volatile_ctrl | 获取 control 新值，通常仅用于持续变化的 volatile、常为只读的 control，如信号强度。 |
| .s_ctrl | 实际设置新 control 值，s_ctrl 必须实现。调用时持有 ctrl-&gt;handler-&gt;lock，其他调用者不能访问该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### API 简述

##### xxxx_set_ctrl

[说明]

调用标准 v4l2_control 设置对焦、变焦和 P 光圈位置。

驱动实现以下 v4l2 标准命令：

<!-- Source: English PDF p98, table unit 856 -->

| 参数名称 | 说明 |
| --- | --- |
| V4L2_CID_FOCUS_ABSOLUTE | 控制对焦，0 为最小焦距，近处清晰。 |
| V4L2_CID_ZOOM_ABSOLUTE | 控制变焦倍数，0 为最小倍数和最大视角。 |
| V4L2_CID_IRIS_ABSOLUTE | 控制光圈开口，0 为关闭。 |
| V4L2_CID_ZOOM_CONTINUOUS | 控制 zoom1 倍数，用于多组变焦控制。 |

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p98, table unit 860 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

自定义 ioctl 的实现主要包括获取对焦、变焦和 P 光圈的时间信息（运动开始与结束时间戳）。由于使用的镜头没有定位装置，必要时需重置镜头电机位置。

##### 驱动实现的自定义命令：

<!-- Source: English PDF p99, table unit 865 -->

| 参数名称 | 说明 |
| --- | --- |
| RK_VIDIOC_VCM_TIMEINFO | 对焦时间，用于判断当前帧是否为对焦后的有效帧。 |
| RK_VIDIOC_ZOOM_TIMEINFO | 变焦时间，用于判断当前帧是否为变焦完成后的有效帧。 |
| RK_VIDIOC_IRIS_TIMEINFO | 光圈时间，用于判断当前帧是否为 P 光圈调整后的有效帧。 |
| RK_VIDIOC_ZOOM1_TIMEINFO | 多变焦组时 zoom1 的时间，用于判断当前帧是否为变焦完成后的有效帧。 |
| RK_VIDIOC_IRIS_CORRECTION | 光圈位置复位，仅用于 P-IRIS。 |
| RK_VIDIOC_FOCUS_CORRECTION | 对焦位置复位 |
| RK_VIDIOC_ZOOM_CORRECTION | 变焦位置复位 |
| RK_VIDIOC_ZOOM1_CORRECTION | 双变焦镜头第二组变焦位置复位 |
| RK_VIDIOC_FOCUS_SET_POSITION | 设置对焦位置 |
| RK_VIDIOC_ZOOM_SET_POSITION | 设置跟焦参数，按变焦曲线实现多步变焦与对焦联动。 |

注意：

1\. 为解决齿隙导致的电机绝对位置不准确，固定一个方向为正方向，另一个为负方向，初始时使齿轮在正方向贴紧。负向运动时额外走超过齿隙的 n 步，再正向走 n 步，使齿轮始终贴紧正方向，称为回调。回调保证绝对位置准确，但回调步数大于齿隙；手动或自动对焦连续负向运动时，每次回调会产生抖动感，因此不能每次负向运动都回调。新增 RK_VIDIOC_FOCUS_SET_POSITION 和 RK_VIDIOC_ZOOM_SET_POSITION 由 af 算法决定是否回调。标准 v4l2 命令 V4L2_CID_FOCUS_ABSOLUTE 和 V4L2_CID_ZOOM_ABSOLUTE 不回调，仅用于手动模式。RK_VIDIOC_ZOOM_SET_POSITION 包含 focus 和 zoom 参数，变焦时同步调整对焦，使画面自然过渡。

2\. 早期通过配置 focus-backlash，在负向运动时增加齿隙对应步数以抵消齿隙。但各镜头齿隙存在差异，标定有误差且工作量较大，因此该参数已弃用。驱动仍保留其设计，对电机位置精度要求不高时仍可使用。

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p100, table unit 874 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p100, table unit 876 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

SPI 控制的驱动芯片可采用 SPI 框架移植，以 MS41908 为参考。参考驱动：/kernel/drivers/media/spi/ms41908.c。

移植步骤如下：

##### 1. 实现标准 spi 子设备驱动部分。

1.1 根据 struct spi_driver 的说明，主要实现以下部分：

struct driver.name

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1）获取设备资源，主要获取 DTS 资源，参见 MS41908 设备注册（DTS）；

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数以匹配 Camera 设备。

1.2) 获取电机相关配置参数，依据芯片功能需求定义，尽量将电机运动相关参数设计为可配置。

2\. hrtimer_init 初始化定时器。ms41908 使用 vd 信号作为触发信号，通过定时器固定各 vd 周期以便操作。ms41908 寄存器在 vd 信号之后生效，每次需修改寄存器时可提前在 vd 信号前配置。注意寄存器设置的运动速度和步数必须处于 vd 周期范围内，超出 vd 周期的步数会丢失。

3）init_completion 通过 completion 实现同步；同一电机必须在前一次操作结束后才能执行下一次操作。

4\. 初始化 v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。驱动要求 subdev 具有独立设备节点，供用户态 rkaiq 访问，并通过该节点控制电机；

媒体实体：media_entity_init；

5\. 设备名称：

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
  .ioctl
  .compat_ioctl32
```

2.2 按 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.g_volatile_ctrl
.s_ctrl
```

## DC-IRIS 驱动

与 P-IRIS 相比，DC-IRIS 无法准确获知光圈开度。通常默认全开；曝光调至最小仍过曝时再调整光圈，曝光调至最大仍欠曝时也进入光圈调整。DC-IRIS 电机为直流电机，通过霍尔器件负反馈缓冲调节速度。驱动只需一个 PWM 控制电机：占空比小于 20% 时光圈缓慢闭合直至完全关闭，越小关闭越快；大于 40% 时缓慢开启，越大开启越快；20%~40% 保持不动。这里的 20% 和 40% 并非固定值，与 pwm 频率及实际硬件器件精度有关。参考驱动：/kernel/drivers/media/i2c/hall-dc-motor.c。

### DC-IRIS 设备注册（DTS）

```text
  hal_dc_motor: hal_dc_motor{
          status = "okay";
          compatible = "rockchip,hall-dc";
          pwms = <&pwm6 0 2500 0>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &pwm6 {
          status = "okay";
          pinctrl-names = "active";
          pinctrl-0 = <&pwm6m0_pins_pull_down>;
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          lens-focus = <&hal_dc_motor>;
          ...
      }
  }
```

#### 数据类型简述

##### struct platform_driver

[说明]

定义 platform 设备驱动信息。

[定义]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[关键成员]

<!-- Source: English PDF p103, table unit 917 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | struct device_driver 主要包含驱动名称及匹配 DTS 设备的 of_match_table；compatible 匹配时调用 .probe。 |
| @id_table | 内核不通过 of_match_table 与 DTS 注册设备匹配时，使用此表。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id motor_dev_of_match[] = {
      { .compatible = "rockchip,hall-dc", },
      {},
  };
  #endif
  static struct platform_driver motor_dev_driver = {
      .driver = {
          .name = DRIVER_NAME,
          .owner = THIS_MODULE,
          .of_match_table = of_match_ptr(motor_dev_of_match),
      },
      .probe = motor_dev_probe,
      .remove = motor_dev_remove,
  };
  module_platform_driver(motor_dev_driver);
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p104, table unit 926 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops motor_core_ops = {
      .ioctl = motor_ioctl,
  };
  static const struct v4l2_subdev_ops motor_subdev_ops = {
      .core   = &motor_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p104, table unit 935 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_ctrl | 实际设置 control 新值；s_ctrl 必须实现。调用持有 ctrl-&gt;handler-&gt;lock，其他访问者不能操作该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops motor_ctrl_ops = {
      .s_ctrl = motor_s_ctrl,
  };
```

#### API 简述

##### xxxx_set_ctrl

[说明]

调用标准 v4l2_control 设置光圈位置。实际上 DC 光圈无法获知具体位置，此处设置的是 pwm 占空比。

实现以下 v4l2 标准命令：

<!-- Source: English PDF p105, table unit 943 -->

| 参数名称 | 说明 |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | 设置控制光圈的 PWM 占空比，范围 0~100。 |

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p105, table unit 947 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p105, table unit 949 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

目前无需实现私有定义；为满足 v4l2 框架注册要求实现空函数。

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p105, table unit 956 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p105, table unit 958 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

参考驱动：/kernel/drivers/media/i2c/hall-dc-motor.c。

移植步骤如下：

##### 1. 实现标准 platform 子设备驱动部分。

1.1 根据 struct platform_driver 的说明，主要实现以下部分：

struct driver.name

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1\. 获取设备资源，主要获取 DTS 资源，参见 DC-IRIS 设备注册（DTS）；

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数以匹配 Camera 设备。

1.2) 获取 pwm 资源，注意 pwm 节点是否已启用。

2\. 初始化 v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。驱动要求 subdev 具有独立设备节点，供用户态 rkaiq 访问，并通过该节点控制电机；

媒体实体：media_entity_init；

3\. 闪光灯设备名称：

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           motor->module_index, facing,
           DRIVER_NAME);
```

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按照 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
  ioctl
  .compat_ioctl32
```

此回调目前不需实现具体命令，但作为 v4l2 子设备必须实现操作函数，因此此处实现空函数。

2.2 按照 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.g_volatile_ctrl.s_ctrl
```

.g_volatile_ctrl 和 .s_ctrl 使用标准 v4l2 control 实现以下命令：

<!-- Source: English PDF p107, table unit 985 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_IRIS_ABSOLUTE | 设置控制光圈的 PWM 占空比，范围 0~100。 |

## RK-IRCUT 驱动

IRCUT 由两根线控制，施加 3.5v~6v 电源。反转电源正负极并满足 100ms±10% 通电时间即可切换 IRCUT。驱动通过两个 gpio 控制电机驱动器电流输出方向，gpio 命令为 open（红线）和 close（黑线）。电流从 open 流向 close 时为红外截止滤光片，供白天使用；从 close 流向 open 时为白玻璃片，供夜间使用。

### RK-IRCUT 设备注册（DTS）

```text
  cam_ircut0: cam_ircut {
          status = "okay";
          compatible = "rockchip,ircut";
          ircut-open-gpios = <&gpio2 RK_PA7 GPIO_ACTIVE_HIGH>;
          ircut-close-gpios  = <&gpio2 RK_PA6 GPIO_ACTIVE_HIGH>;
          rockchip,camera-module-index = <1>;
          rockchip,camera-module-facing = "front";
  };
  &i2c1 {
      imx334: imx334@1a {
          ...
          ir-cut = <&cam_ircut0>;
          ...
      }
  }
```

#### 数据类型简述

##### struct platform_driver

[说明]

定义 platform 设备驱动信息。

[定义]

```text
  struct platform_driver {
          int (*probe)(struct platform_device *);
          int (*remove)(struct platform_device *);
          void (*shutdown)(struct platform_device *);
          int (*suspend)(struct platform_device *, pm_message_t state);
          int (*resume)(struct platform_device *);
          struct device_driver driver;
          const struct platform_device_id *id_table;
          bool prevent_deferred_probe;
  };
```

[关键成员]

<!-- Source: English PDF p108, table unit 997 -->

| 成员名称 | 说明 |
| --- | --- |
| @driver | struct device_driver 主要包含驱动名称及匹配 DTS 设备的 of_match_table；compatible 匹配时调用 .probe。 |
| @id_table | 内核不通过 of_match_table 与 DTS 注册设备匹配时，使用此表。 |
| @probe | 设备绑定回调 |
| @remove | 设备解绑回调 |

[示例]

```text
  #if defined(CONFIG_OF)
  static const struct of_device_id ircut_of_match[] = {
      { .compatible = "rockchip,ircut", },
      {},
  };
  #endif
  static struct platform_driver ircut_driver = {
      .driver = {
          .name = RK_IRCUT_NAME,
          .of_match_table = of_match_ptr(ircut_of_match),
      },
      .probe = ircut_probe,
      .remove = ircut_drv_remove,
  };
  module_platform_driver(ircut_driver);
```

##### struct v4l2_subdev_core_ops

[说明]

定义 subdev 的 core ops 回调。

[定义]

```text
  struct v4l2_subdev_core_ops {
      ……
      long (*ioctl)(struct v4l2_subdev *sd, unsigned int cmd, void *arg);
  #ifdef CONFIG_COMPAT
      long (*compat_ioctl32)(struct v4l2_subdev *sd, unsigned int cmd,
               unsigned long arg);
  #endif
      ……
  };
```

[关键成员]

<!-- Source: English PDF p109, table unit 1006 -->

| 成员名称 | 说明 |
| --- | --- |
| .ioctl | 在 V4L2 core 的 ioctl() 系统调用处理末尾调用，支持驱动私有 ioctl。 |
| .compat_ioctl32 | 32 位程序使用 64 位内核时调用，以调整用户空间与内核间传递的数据。原文重复该说明。 |

[示例]

```text
  static const struct v4l2_subdev_core_ops ircut_core_ops = {
      .ioctl = ircut_ioctl,
  };
  static const struct v4l2_subdev_ops ircut_subdev_ops = {
      .core   = &ircut_core_ops,
  };
```

##### struct v4l2_ctrl_ops

[说明]

驱动需要提供的 control 操作。

[定义]

```text
  struct v4l2_ctrl_ops {
      int (*s_ctrl)(struct v4l2_ctrl *ctrl);
  };
```

[关键成员]

<!-- Source: English PDF p110, table unit 1015 -->

| 成员名称 | 说明 |
| --- | --- |
| .s_ctrl | 实际设置 control 新值；s_ctrl 必须实现。调用持有 ctrl-&gt;handler-&gt;lock，其他访问者不能操作该 handler 的 controls。 |

[示例]

```text
  static const struct v4l2_ctrl_ops ircut_ctrl_ops = {
      .s_ctrl = ircut_s_ctrl,
  };
```

#### API 简述

##### xxxx_set_ctrl

[说明]

调用标准 v4l2_control 切换 IRCUT。

实现以下 v4l2 标准命令：

<!-- Source: English PDF p110, table unit 1023 -->

| 参数名称 | 说明 |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 为 CLOSE，红外光可进入；3 为 OPEN，红外光不能进入。 |

[语法]

```text
  static int xxxx_set_ctrl(struct v4l2_ctrl *ctrl)
```

[参数]

<!-- Source: English PDF p110, table unit 1027 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *ctrl | v4l2 control 结构指针 | 输入 |

[返回值]

<!-- Source: English PDF p110, table unit 1029 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

```text
xxxx_ioctl xxxx_compat_ioctl
```

[说明]

目前无需实现私有定义；为满足 v4l2 框架注册要求实现空函数。

[语法]

```text
  static int xxxx_ioctl(struct v4l2_subdev *sd, unsigned int cmd, void *arg)
  static long xxxx_compat_ioctl32(struct v4l2_subdev *sd, unsigned int cmd,
  unsigned long arg)
```

[参数]

<!-- Source: English PDF p111, table unit 1036 -->

| 参数名称 | 说明 | 输入/输出 |
| --- | --- | --- |
| *sd | v4l2 subdev 结构指针 | 输入 |
| cmd | ioctl 命令 | 输入 |
| *arg/arg | 参数指针 | 输出 |

[返回值]

<!-- Source: English PDF p111, table unit 1038 -->

| 返回值 | 说明 |
| --- | --- |
| 0 | 成功 |
| 非 0 | 失败 |

#### 驱动移植步骤

参考驱动：/kernel/drivers/media/i2c/rk_ircut.c。

移植步骤如下：

##### 1. 实现标准 platform 子设备驱动部分。

1.1 根据 struct platform_driver 的说明，主要实现以下部分：

struct driver.name

struct driver. of_match_table

probe 函数

remove 函数

1.2 probe 函数实现详解：

1\. 获取设备资源，主要获取 DTS 资源，参见 RK-IRCUT 设备注册（DTS）；

1.1) RK 私有资源采用 rockchip, camera-module-xxx 等命名，主要提供设备参数以匹配 Camera 设备。

1.2) 获取 open 和 close gpio 资源；

2\. init_completion 通过 completion 实现同步。切换 IRCUT 约需 100ms，因此必须通过 completion 保证上一次切换完成后才能再次操作；

3\. 创建工作队列，将切换操作放入工作队列，避免长时间阻塞；

4\. 初始化 v4l2 设备和媒体实体。

v4l2 子设备：v4l2_i2c_subdev_init。驱动要求 subdev 具有独立设备节点，供用户态 rkaiq 访问，并通过该节点控制 IRCUT；

媒体实体：media_entity_init；

```text
  sd->entity.function = MEDIA_ENT_F_LENS;
  sd->entity.flags = 1;//flag is fixed to 1, used to distinguish other sub-devices of MEDIA_ENT_F_LENS type
```

5\. 设备名称：

```text
  snprintf(sd->name, sizeof(sd->name), "m%02d_%s_%s",
           ircut->module_index, facing,
           RK_IRCUT_NAME);
```

##### 2. 实现 v4l2 子设备驱动，主要实现以下 2 个成员：

```text
  struct v4l2_subdev_core_ops
  struct v4l2_ctrl_ops
```

2.1 按照 v4l2_subdev_core_ops 的说明实现回调函数，主要包含以下回调：

```text
  .ioctl
  .compat_ioctl32
```

此回调目前无需实现私有命令，但 v4l2 框架注册需要它，因此实现空函数，后续可按需补充函数内容。

2.2 按照 v4l2_ctrl_ops 的说明实现回调函数，主要包含以下回调：

```text
.s_ctrl
```

.s_ctrl 使用标准 v4l2 control 实现以下命令：

<!-- Source: English PDF p112, table unit 1072 -->

| 成员名称 | 说明 |
| --- | --- |
| V4L2_CID_BAND_STOP_FILTER | 0 为 CLOSE，红外光可进入；3 为 OPEN，红外光不能进入。 |

## media-ctl 与 v4l2-ctl 工具

media-ctl 通过 /dev/medio0 等 media 设备操作，管理 Media 拓扑中各节点的格式、尺寸和连接。（原稿写作 /dev/medio0，疑为 /dev/media0，保留原始信息待核对。）

v4l2-ctl 面向 /dev/video0、/dev/video1 等视频设备，执行 set_fmt、reqbuf、qbuf、dqbuf、stream_on、stream_off 等操作。

具体用法参见命令帮助，以下列出常用方式。

1\. 打印拓扑

```text
  media-ctl -p -d /dev/media0
```

注意：isp2 设备节点较多，可能存在 media0/media1/media2，需逐一枚举检查设备信息。

2\. 连接

```text
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
  media-ctl -l'"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

注意：断开 ispp 路径，连接 main_path，从 main_path 抓取 RAW 图像。media-ctl 不加 -d 指定设备时默认为 /dev/media0；需确认 rkisp-isp-subdev 挂在哪个设备节点，通常为 /dev/media1。

3\. 修改 fmt/size

```text
  media-ctl -d /dev/media0 \
  --set-v4l2'"ov5695 7-0036":0[fmt:SBGGR10_1X10/640x480]'
```

注意：需确认摄像头设备节点（ov5695 7-0036）属于哪个 media 设备。

4\. 设置 fmt 并抓帧

```text
  v4l2-ctl -d /dev/video0 \
  --set-fmt-video=width=720,height=480,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-skip=3 \
  --stream-to=/tmp/cif.out \
  --stream-count=1 \
  --stream-poll
```

5\. 设置曝光、增益等 controls

```text
  v4l2-ctl -d /dev/video3 --set-ctrl'exposure=1216,analogue_gain=10'
```

注意：isp 驱动会调用摄像头子设备控制命令，因此指定 video3（main_path 或 self_path）即可设置曝光。vicap 不会调用摄像头子设备控制命令，直接在采集节点设置会失败。正确方式是找到摄像头设备节点 /dev/v4l-subdevX，直接配置该终端节点。

## RV1109/RV1126 内存优化指南

```text
MIPI -> DDR_1 -> ISP -> DDR_2 -> ISPP(TNR) -> DDR_3 -> ISPP(NR&Sharp) -> DDR_4 -> ISPP(FEC) -> DDR_5
```

1\. DDR_1：Vicap RAW 数据或 isp MIPI RAW 数据写入 ddr，isp 再从 ddr 读取 RAW 数据进行处理。

占用内存：buf_cnt * buf_size * N，其中 N = 1 为线性模式，2 为 hdr2 帧模式，3 为 hdr3 帧模式。

buf_size: `ALIGN(width * bpp / 8, 256) * height;`，bpp 为位宽，即 raw8、raw10 或 raw12。

buf_cnt：默认为 4，在 aiq 库代码 hwi/isp20/CamHwIsp20.h 中定义，最小为 3。

```text
#define ISP_TX_BUF_NUM 4
#define VIPCAP_TX_BUF_NUM 4
```

2\. DDR_2：isp 的 fbc yuv420 和 gain 数据写入 ddr，ispp 从 ddr 读取处理。

占用内存：buf_size * buf_cnt。

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt：tnr 3to1 模式使用 4 个 buf，2to1 模式使用 3 个；模式在 iq xml 中配置。

3\. DDR_3：ispp tnr 的 fbc yuv420 和 gain 数据写入 ddr，ispp NR&Sharp 再从 ddr 读取处理。

占用内存：buf_size * buf_cnt。

```text
buf_size: ALIGN(width, 64) * ALIGN(height, 128) / 16 + ALIGN(width, 16) * ALIGN(hieght, 16) * 1.5625
```

buf_cnt：2，为最小值。

4\. DDR_4：ispp NR&Sharp 的 yuyv 数据写入 ddr，ispp fec 从 ddr 读取处理。

占用内存：buf_size * buf_cnt（未开启 fec 功能时不占用内存）。

```text
buf_size: width * height * 2
```

buf_cnt：2，为最小值。

5\. DDR_5：ispp 的 4 路输出图像缓冲区，大小按用户设置的分辨率、格式和 buf_cnt 计算。

上述 buf_cnt 是可进行内存优化配置的位置。

isp cma 预留内存大小：可先配置较大的内存，运行 camera app 后获取实际使用量。

```text
  isp_reserved: isp {
      compatible = "shared-dma-pool";
      inactive;
      reusable;
      size = <0x10000000>;//256M and need 4M align
  };
  enable cma debug
  +++ b/arch/arm/configs/rv1126_defconfig
  @@ -62,6 +62,8 @@ CONFIG_IOSCHED_BFQ=y
   CONFIG_KSM=y
   CONFIG_DEFAULT_MMAP_MIN_ADDR=32768
   CONFIG_CMA=y
  +CONFIG_CMA_DEBUG=y
  +CONFIG_CMA_DEBUGFS=y
  one page is 4K, 26091 page is 104364K and need 4M align, so config 104M to
  isp_reserved
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# ls
  alloc  base_pfn  bitmap  count free  maxchunk order_per_bit  used
  [root@RV1126_RV1109:/sys/kernel/debug/cma/cma-isp@0]# cat used
  26091
```

内存示例说明：启用 cma 调试。每页为 4K，26091 页为 104364K，且需 4M 对齐，因此为 isp_reserved 配置 104M。

## RV1109/RV1126 延迟优化指南

##### 1、配置 vicap wait-line

在 dts 的 vicap 节点配置 wait-line。例如高度为 1520，wait-line 为 760，采集半幅图像后即提前将缓冲区输出给 isp。根据 isp 读取缓冲区的速度调整 wait-line。

```text
&rkcif_mipi_lvds {
      wait-line = <760>;
};
```

也可使用以下命令配置，支持动态配置。

```text
  echo 1000 > /sys/devices/platform/rkcif_mipi_lvds/wait_line
```

注意：wait-line 过小会导致 isp 过早访问缓冲内存，此时部分数据尚未采集，未更新部分仍是上一帧。画面剧烈变化时，图像尾部可能异常、呈现分裂。需依据实际测试选择合适的 wait-line。

##### 2、配置 isp wait-line

在 dts 的 isp 节点配置 wait-line。例如高度为 1520，wait-line 为 760，处理到第 760 行时即输出给 ispp。根据 ISP 与 ISPP 的处理时间调整 wait-line。

```text
&rkisp_vir0 {
      wait-line = <760>;
};
```

也可通过 /sys/module/video_rkisp/parameters/wait_line 调试，须在打开 isp video 之前配置。

注意：wait-line 过小且 ISPP 快于 ISP 时，由于使用 FBC 压缩格式，会发生 hold 情况。Motion 功能和多传感器不支持此方式。

##### 3、配置 ispp 四路输出的 wait-line

在 dts 的 ispp 节点配置 wait-line。例如高度为 1520，wait-line 为 896，处理至第 896 行时即输出给后端。根据 ISPP（nr 或 fec）与后端的处理时间调整 wait-line。

```text
&rkispp_vir0 {
     status = "okay";
     wait-line = <896>;
};
```

也可通过 /sys/module/video_rkispp/parameters/wait_line 调试，须在打开 ispp video 之前配置。

注意：wait-line 过小且后端快于 ISPP 时，后端图像处理会异常。不支持多传感器。

##### 4、提高硬件处理速度

1）提高 isp/ispp clk

drivers/media/platform/rockchip/isp/hw.c

```text
static const struct isp_clk_info rv1126_isp_clk_rate[] = {
{
.clk_rate = 20,
.refer_data = 0,
}, {
.clk_rate = 600,
.refer_data = 1920, //width
}, {
.clk_rate = 600,
.refer_data = 2688,
}, {
.clk_rate = 600,
.refer_data = 3072,
}, {
.clk_rate = 600,
.refer_data = 3840,
}
};
```

drivers/media/platform/rockchip/ispp/hw.c

```text
static const struct ispp_clk_info rv1126_ispp_clk_rate[] = {
{
.clk_rate = 150,
.refer_data = 0,
}, {
.clk_rate = 500,
.refer_data = 1920 //width
}, {
.clk_rate = 500,
.refer_data = 2688,
}, {
.clk_rate = 500,
.refer_data = 3072,
}, {
.clk_rate = 500,
.refer_data = 3840,
}
};
```

2）禁用 iommu，使用预留内存

```text
   &rkisp_mmu {          status = "disabled";    };
  &rkisp {
        memory-region = <&isp_reserved>;
  };
  &rkispp_mmu {          status = "disabled";   };
  &rkispp {
        memory-region = <&isp_reserved>;
  };
```

## 常见问题

### 如何获取驱动版本号

从内核启动日志获取

```text
  rkisp ffb50000.rkisp: rkisp driver version: v00.01.00
  rkispp ffb60000.rkispp: rkispp driver version: v00.01.00
```

通过以下方式获取

```text
  cat /sys/module/video_rkisp/parameters/version
  cat /sys/module/video_rkispp/parameters/version
```

### 如何判断 RKISP 驱动加载状态

RKISP 驱动成功加载后，/dev/ 下会存在 video 和 media 设备。系统可能有多个 /dev/video，可通过 /sys 查询 RKISP 注册的视频节点。

```text
  localhost ~ # grep'' /sys/class/video4linux/video*/name
```

也可用 media-ctl 打印拓扑，检查 pipeline 是否正常。

判断摄像头驱动是否成功加载：所有摄像头注册完成时，内核会打印以下日志。

```text
  localhost ~ # dmesg | grep Async
  [0.682982] RKISP: Async subdev notifier completed
```

若内核中没有 Async subdev notifier completed 这一行日志，先检查传感器是否报错、I2C 通信是否成功。

### 如何抓取 CIS 输出的 RAW 和 YUV 数据

驱动开发完成后，可通过标准 v4l2-ctl 命令直接操作驱动，获取 CIS 输出数据。用法帮助：https://www.mankier.com/1/v4l2-ctl。

##### 示例：

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

-d：指定设备名称。

--set-fmt-video：设置分辨率，必须与传感器输出一致。可通过 media-ctl -p -d /dev/mediaX 查看传感器当前分辨率。

pixelformat：输出数据格式，如 BG12、NV12。

--stream-mmap：mmap 缓冲区数量。

--stream-count：抓取帧数，多帧也存入同一文件。

--stream-to：指定存储路径。

--stream-skip：跳过的帧数。

#### 设备支持列表

##### RV1109/RV1126

<!-- Source: English PDF p119, table unit 1185 -->

| 设备 | 接口 | 格式 | 设备节点名称 | 输出 Raw | 输出 YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | 非紧凑 Raw | 无 |
| VICAP | MIPI/LVDS | RAW | video0~video3 | 非紧凑 Raw；紧凑 Raw | 无 |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | 无 | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | 非紧凑 Raw；紧凑 Raw | 无 |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | 非紧凑 Raw | nv12<br>nv16 |
| ISPP | 仅从 DDR 读取 | YUV | rkispp_m_bypass<br>rkispp_scale0<br>rkispp_scale1<br>rkispp_scale2 | 无 | nv12<br>nv16 |

##### RK356X

<!-- Source: English PDF p119, table unit 1187 -->

| 设备 | 接口 | 格式 | 设备节点名称 | 输出 Raw | 输出 YUV |
| --- | --- | --- | --- | --- | --- |
| VICAP | DVP | RAW | video0~video3 | 非紧凑 Raw | 无 |
| VICAP | MIPI/LVDS | RAW | video0~video3 | 非紧凑 Raw；紧凑 Raw | 无 |
| VICAP | DVP / MIPI /<br>LVDS | YUV | video0~video3 | 无 | nv12<br>nv16 |
| ISP | DVP / MIPI /<br>LVDS | RAW | rkisp_rawwr0<br>rkisp_rawwr1<br>rkisp_rawwr2<br>rkisp_rawwr3 | 非紧凑 Raw；紧凑 Raw | 无 |
| ISP | MIPI / LVDS | YUV | rkisp_mainpath | 非紧凑 Raw | nv12<br>nv16 |

注意：

1\. 设备节点名称查询命令：media-ctl -p -d /dev/mediaX（X 为 0、1、2、3...）。

#### RAW 数据存储格式

##### 非紧凑 RAW 存储格式

非紧凑格式将传感器输出的 raw10、raw12 存储为 16 位并高位对齐。以 4 字节内存段为例，raw12 在内存中的排列如下：

![英文原图 9，PDF 第 120 页](/docs/rockchip-vi-driver/assets/en-p120-X579.png)

*英文原图 9，PDF 第 120 页*

##### 紧凑 RAW 存储格式

以 4 字节内存段为例，raw12 数据在内存中的排列如下：

![英文原图 10，PDF 第 120 页](/docs/rockchip-vi-driver/assets/en-p120-X580.png)

*英文原图 10，PDF 第 120 页*

##### 重要提醒：

ISP mainpath 设备输入为 Raw10 或 Raw12 时，统一输出 Raw12 的非紧凑 RAW 存储格式。

#### 参考用例：

##### VICAP 输出 RAW

1、默认使用紧凑格式，可通过以下命令切换紧凑/非紧凑格式：

```text
      echo 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

其中 0 表示非紧凑，1 表示紧凑；同时使用多通道时，命令可改为：

```text
      echo 0 0 0 0 > /sys/devices/platform/rkcif_mipi_lvds/compact_test
```

echo 后的数字依次对应 vc0、vc1、vc2、vc3 通道的数据存储类型。

2、video0~3 对应 vc0~vc3。

3、v4l2-ctl 命令

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### ISP maipath 输出非紧凑 RAW（原稿标题拼写保留）

1、抓取 mainpath 图像时，默认 isp 输出链接为 rkisp-bridge-ispp，需用以下命令切换为 mainpath：

```text
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[0]'
      media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[1]'
```

注意：不使用 -d 时默认使用 media0。若 rkisp-isp-subdev 不在 media0，需用 -d 指定其所在 media 节点。

"rkisp-bridge-ispp" 后的 0 表示 pad0、sink；详细说明参见 v4l2 文档。

2、isp 输出格式默认为 YUYV8_2X8，使用以下命令切换到 Bayer RAW 格式：

```text
      media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
```

注意：rkisp-isp-subdev 不一定在 media0。-d 用于指定设备，需确认其所在 media 节点。

"rkisp-isp-subdev" 后的 2 表示 pad2、source；详细说明参见 v4l2 文档。

修改后必须通过 media-ctl -p -d /dev/mediaX（X=0,1,2,...）检查是否生效；生效后抓取的 RAW 才是原始 RAW 数据。

3、v4l2-ctl 命令

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=RG10 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### VICAP 输出 YUV：

输入必须是 YUV 格式；输入为 RAW 时，vicap 无法输出 YUV。

```text
  v4l2-ctl -d /dev/video0  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

##### ISP 输出 YUV：

```text
  v4l2-ctl -d /dev/video5  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=4 --stream-count=1 --stream-to=/tmp/cap.raw  --stream-skip=2
```

注意：

1\. 对于 isp，可抓取 mainpath 或 selfpath。video5 仅为示例，请按实际参数设置。

2\. ISP 输入为 RAW 时可转换为 YUV，并执行各类图像处理。这些处理需要 RK AIQ 控制 ISP 各模块。此处命令仅涉及数据流，图像处理参数采用驱动默认值，因此图像效果通常异常。

##### ISPP 输出 YUV：

ispp 输入数据源为 rkisp-bridge-ispp；

需关闭 rkisp_mainpath、rkisp_selfpath 和 rkispp_input_image 链接。

rkisp-isp-subdev pad2: Source 格式必须为 fmt:YUYV8_2X8。

isp 默认连接 ispp，参考命令如下：

```text
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_mainpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp_selfpath":0[0]'
  media-ctl -l '"rkisp-isp-subdev":2->"rkisp-bridge-ispp":0[1]'
  media-ctl -d /dev/media1 -l '"rkispp_input_image":0->"rkispp-subdev":0[1]'
  v4l2-ctl -d /dev/video13 \
  --set-fmt-video=width=2688,height=1520,pixelformat=NV12 \
  --stream-mmap=3 --stream-to=/tmp/nv12.out --stream-count=20 --stram-poll
```

注意：-d 设备名可按抓图需求选择以下节点；对应节点名称可通过 media-ctl -p -d /dev/mediaX 查询。

<!-- Source: English PDF p122, table unit 1235 -->

| 节点 | 输出能力 |
| --- | --- |
| rkispp_m_bypass | 全分辨率 YUV 格式 |
| rkispp_scale0 | 全分辨率或缩放 YUV；缩放比例 [1 8]，最大宽度 3264。 |
| rkispp_scale1 | 全分辨率或缩放 YUV；缩放比例 [2 8]，最大宽度 1280。 |
| rkispp_scale2 | 全分辨率或缩放 YUV；缩放比例 [2 8]，最大宽度 1280。 |

### 如何切换 CIS 驱动输出分辨率

1、对于支持多分辨率的传感器驱动，抓取其他分辨率 RAW 时可用以下命令切换当前分辨率：

```text
  media-ctl -d /dev/media0 --set-v4l2 '"m01_f_os04a10 1-0036-1":0[fmt:SBGGR12_1X12/2688x1520]'
```

注意：m01_f_os04a10 1-0036-1 是传感器节点名，后接所需格式，前提是驱动支持该格式配置。

2、vicap 只需设置传感器节点；isp 还需设置自身输入输出格式，参考命令如下：

```text
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":0[crop:(0,0)/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[fmt:SBGGR12_1X12/2688x1520]'
  media-ctl -d /dev/media0 --set-v4l2 '"rkisp-isp-subdev":2[crop:(0,0)/2688x1520]'
```

### 如何设置 CIS 曝光参数

1、通过 media-ctl -p -d /dev/mediaX 找到传感器节点，名称格式为 /dev/v4l-subdevX。参考命令如下：

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl 'exposure=1216,analogue_gain=10'
```

也可分别设置：

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl exposure=1216
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl analogue_gain=10
```

2、最大曝光受传感器 vts 限制，可能为 vts-4 或 vts-10，具体以传感器手册为准。假设当前 30fps，最大曝光 33.3ms；若需设置 40ms，必须增大 vts。可按比例 vts_30fps * 30fps = vts_25fps * 25fps 换算 25fps 对应的 vts，(vts-height) 即 vblank。将换算的 vblank 设置给传感器驱动，即可设置更大的曝光。参考命令如下：

vts 为帧长度，包含有效行与消隐行。

```text
  v4l2-ctl -d /dev/v4l-subdev4 --set-ctrl vertical_blanking=200
```

### 如何支持黑白摄像头

CIS 驱动需将黑白传感器输出格式改为以下三种之一：

```text
  MEDIA_BUS_FMT_Y8_1X8 (sensor 8bit output)
  MEDIA_BUS_FMT_Y10_1X10 (sensor 10bit output)
  MEDIA_BUS_FMT_Y12_1X12 (sensor 12bit output)
```

即在 xxxx_get_fmt 和 xxxx_enum_mbus_code 中返回上述格式。

RKISP 驱动会针对这三种格式做特殊配置，支持黑白图像采集。

若应用层需获取 Y8 图像，只能使用 SP Path，因为仅 SP Path 支持 Y8 输出。

### 如何支持奇偶场合成

RKISP 驱动支持奇偶场合成，限制条件如下：

1\. MIPI 接口：支持输出帧计数（来自帧开始和帧结束短包），RKISP 以此判断当前场奇偶；

2\. BT656 接口：支持标准 SAV/EAV 输出，其中 bit6 为奇偶场标志，RKISP 据此判断当前场奇偶；

3\. 仅 RKISP 驱动中的 RKISP1_selfpath 视频设备节点具有此功能，其他节点不支持。应用层误用其他节点时，驱动提示以下错误：

```text
"Only selfpath support interlaced"
```

可用 media-ctl -p 查看 RKISP_selfpath 信息：

```text
  entity 3: rkisp_selfpath (1 pad, 1 link)
       type Node subtype V4L flags 0
        device node name /dev/video1
      pad0: Sink
         <- "rkisp-isp-subdev":2 [ENABLED]
```

##### 设备驱动实现如下：

设备驱动的 format.field 需设置为 V4L2_FIELD_INTERLACED，表示当前输出为奇偶场；即 xxxx_get_fmt 返回该 format.field。可参考 driver/media/i2c/tc35874x.c 驱动。

### 如何查看调试信息

1\. 检查 media pipeline 信息，与 dts 摄像头配置对应。

```text
  media-ctl -p -d /dev/mediaX (X = 0, 1, 2 ..)
```

2\. 查看 proc 信息，其中包括当前 isp/ispp 状态及帧输入输出信息，可多次执行 cat。

```text
  cat /proc/rkisp*
```

3\. 查看驱动调试信息，为 isp 和 ispp 节点设置 debug 级别；数值越大，信息越多。

```text
  echo n> /sys/module/video_rkisp/parameters/debug (n = 0, 1, 2, 3; 0 is off)
  echo n> /sys/module/video_rkispp/parameters/debug
  echo 8 > /proc/sys/kernel/printk
```

4\. 检查寄存器信息并导出 reg 文件。

适用于 RV1109/RV1126

```text
      io -4 -l 0x10000 0xffb50000> /tmp/isp.reg
      io -4 -l 0x1000 0xffb60000> /tmp/ispp.reg
```

适用于 RK3566/RK3568

```text
      io -4 -l 0x10000 0xfdff0000> /tmp/isp.reg
```

5\. 提供调试信息的步骤

1\. 问题现场：1->2->4->3。

2\. 复现问题：3->启动->复现->1->2->4。

6、proc 信息说明

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkisp-vir0 Version:v01.06.00
  clk_isp    400000000
  aclk_isp   500000000
  hclk_isp   250000000
  Interrupt  Cnt:7521 ErrCnt:0
  Input      rkcif_mipi_lvds Format:SBGGR10_1X10 Size:2688x1520@30fps Offset(0,0)
  Isp Read   mode:frame2 (frame:1522 rate:33ms idle time:10ms) cnt(total:1522
  X1:1503 X2:18 X3:-1)
  Output     rkispp0 Format:FBC420 Size:2688x1520 (frame:1522 rate:32ms)
  DPCC0      ON(0x5)
  DPCC1      ON(0x5)
  DPCC2      ON(0x5)
  BLS        ON(0x1)
  SDG        OFF(0x80446197)
  LSC        ON(0x1)
  AWBGAIN    ON(0x80446197) (gain: 0x01110111, 0x028a0202)
  DEBAYER    ON(0x7000111)
  CCM        ON(0x80000001)
  GAMMA_OUT  ON(0x80000001)
  CPROC      ON(0xf)
  IE         OFF(0x0) (effect: BLACKWHITE)
  WDR        OFF(0x30cf0)
  HDRTMO     ON(0xa4f05a27)
  HDRMGE     ON(0x80000005)
  RAWNR      ON(0x80100001)
  GIC        OFF(0x0)
  DHAZ       ON(0x80101119)
  3DLUT      OFF(0x2)
  GAIN       ON(0x80010111)
  LDCH       OFF(0x0)
  CSM        FULL(0x80446197)
  SIAF       OFF(0x0)
  SIAWB      OFF(0x0)
  YUVAE      ON(0x400100f3)
  SIHST      ON(0x38000107)
  RAWAF      ON(0x7)
  RAWAWB     ON(0x776887)
  RAWAE0     ON(0x40000003)
  RAWAE1     ON(0x400000f5)
  RAWAE2     ON(0x400000f5)
  RAWAE3     ON(0x400000f5)
  RAWHIST0   ON(0x40000501)
  RAWHIST1   ON(0x60000501)
  RAWHIST2   ON(0x60000501)
  RAWHIST3   ON(0x60000501)
  Monitor    OFF Cnt:0
```

clk_isp：isp 时钟频率。

Interrupt：包含 mipi 中断和 isp 各模块中断，计数增加表示有数据进入 isp；ErrCnt 为错误中断统计。

Input：输入源、输入格式、分辨率及裁剪信息。

Isp read：mode 为 one 或 hdr2/3；frame 为序号；rate 为帧间隔；idle/working 为 isp 状态；time 为 isp 硬件工作时间；cnt 为回读总次数、一次、两次、三次的次数。

Output：输出对象、输出格式、分辨率；frame 为序号，rate 为帧间隔。

Other：isp 各模块开关状态。

Monitor：异常检测与复位。

```text
  [root@RV1126_RV1109:/]# cat /proc/rkisp*
  rkispp-vir0 Version:v01.06.00
  clk_ispp   350000000
  aclk_ispp  500000000
  hclk_ispp  250000000
  Interrupt  Cnt:79532 ErrCnt:0
  Input      rkisp0 Format:FBC420 Size:2688x1520 (frame:26510 rate:32ms
  delay:13ms)
  Output     rkispp_m_bypass Format:NV12 Size:2688x1520 (frame:26509 rate:32ms
  delay:30ms)
  TNR        ON(0xf00000f) (mode: 3to1) (global gain: disable) (frame:26510
  time:8ms idle) CNT:0x0 STATE:0x1e000000
  NR         ON(0x57) (external gain: enable) (frame:26510 time:6ms working)
  0x5f0:0x19 0x5f4:0x780f
  SHARP      ON(0x19) (YNR input filter: ON) (local ratio: OFF) 0x630:0x19
  FEC        OFF(0x2) (frame:0 time:0ms idle) 0xc90:0x0
  ORB        OFF(0x0)
  Monitor    ON Cnt:0
```

clk_ispp：ispp 时钟频率。

Interrupt：ispp 处理中断，计数增加表示有数据进入 ispp；ErrCnt 为错误中断统计。

Input：输入源、格式、分辨率；frame 为序号，rate 为帧间隔，delay 为输入帧时间减去 mipi 帧时间。

Output：输出对象、格式、分辨率；frame 为序号，rate 为帧间隔，delay 为输出帧时间减去 mipi 帧时间，也与输出帧缓冲区有关。

Other：ispp 各模块开关状态；frame 为序号，time 为模块硬件工作时间，idle/working 为模块工作状态。

Monitor：异常检测与复位。

```text
  [root@RV1126_RV1109:/]# cat /proc/rkcif_mipi_lvds
  Driver Version:v00.01.0a
  Work Mode:ping pong
  Monitor Mode:idle
  aclk_cif:500000000
  hclk_cif:250000000
  dclk_cif:297000000
  Input Info:
          src subdev:m01_f_os04a10 1-0036-1
          interface:mipi csi2
          lanes:4
          vc channel: 0 1
          hdr mode: hdr_x2
          format:SBGGR10_1X10/2688x1520@30
          crop.bounds:(0, 0)/2688x1520
  Output Info:
          format:BG10/2688x1520(0,0)
          compact:enable
          frame amount:264
          early:10 ms
          single readout:30 ms
          total readout:30 ms
          rate:33 ms
          fps:30
          irq statistics:
                          total:515
                          csi over flow:0
                          csi bandwidth lack:0
                          all err count:0
                          frame dma end:515
```

Work Mode：rv1109 之后默认使用 ping pong，推荐该模式。

Monitor Mode：监控模式。开启后，mipi 检测到异常时复位 vicap。

Input Info：输入信息汇总。

src subdev：输入设备，通常指传感器，包括摄像头方向、索引号、设备名、i2c 总线、7bit 从地址等。

interface：物理数据接口，如 mipi、lvds、dvp。

vc channel：实际使用的 vc 通道，即 MIPI 协议多通道传输中的虚拟通道。

hdr mode：传感器工作模式，分为 normal、hdr_x2、hdr_x3。

format：输入数据类型。

crop.bounds：可在传感器驱动 .get_selection 中配置裁剪参数，适当裁剪输入数据。

Output Info：输出信息汇总。

format：输出数据类型。

compact：默认紧凑输出，相关定义参见“如何抓取 CIS 输出的 RAW 和 YUV 数据”。

frame amount：

early：唤醒模式下，采集到 wait_line 行后即提前将缓冲区交给 isp；默认模式在完整帧采集后才发送。early 表示完整帧采集前提前发送缓冲区所节省的时间。唤醒模式配置参见 RV1109/RV1126 延迟优化指南。

single readout：hdr 模式下，单帧传输时间即长帧的传输时间。

total readout：hdr 模式下，从长帧开始到短帧结束的时间差，即一个合成帧原始传输时间。

rate：帧间隔时间。

fps：帧率。

irq statistics：中断信息。

total：中断总数，包括 frame end 和 err。

csi over flow：溢出中断次数。

csi bandwidth lack：带宽不足中断次数。

frame dma end：帧结束中断次数，等于从 stream start 起传感器输出的帧数。

## 附录 A：CIS 驱动 V4L2-controls 列表

<!-- Source: English PDF p129, table unit 1327 -->

| CID | 说明 |
| --- | --- |
| V4L2_CID_VBLANK | 垂直消隐：每帧后无图像数据的空闲期，单位为行。每行长度为图像宽度加水平消隐，以同一子设备 V4L2_CID_PIXEL_RATE 定义的像素率计时。 |
| V4L2_CID_HBLANK | 水平消隐：每行图像后无数据的空闲期，单位为像素。 |
| V4L2_CID_EXPOSURE | 决定 sensor 曝光时间，受帧间隔限制。 |
| V4L2_CID_ANALOGUE_GAIN | 模拟增益作用于像素矩阵全部颜色分量，在 A/D 转换之前于模拟域执行。 |
| V4L2_CID_PIXEL_RATE | subdev source pad 像素率，只读，单位像素/秒。MIPI 示例：pixel_rate = link_freq * 2 * nr_of_lanes / bits_per_sample。 |
| V4L2_CID_LINK_FREQ | 数据总线频率与 media bus 像素码、总线类型（每样本时钟周期数）共同决定像素阵列的 V4L2_CID_PIXEL_RATE，非 sensor 设备也可能在其他位置定义。帧率可由像素时钟、宽高和水平/垂直消隐计算。虽然 pixel rate 可定义在不含像素阵列的 subdev，但不能据此求帧率，因为只有像素阵列上的消隐信息精确且不允许其他消隐。通过选择水平和垂直消隐来选择帧率。本 control 单位 Hz。 |

## 附录 B：MEDIA_BUS_FMT 表

<!-- Source: English PDF p130, table unit 1329 -->

| CIS sensor 类型 | Sensor 输出格式 |
| --- | --- |
| Bayer RAW | MEDIA_BUS_FMT_SBGGR10_1X10<br>MEDIA_BUS_FMT_SRGGB10_1X10<br>MEDIA_BUS_FMT_SGBRG10_1X10<br>MEDIA_BUS_FMT_SGRBG10_1X10<br>MEDIA_BUS_FMT_SRGGB12_1X12<br>MEDIA_BUS_FMT_SBGGR12_1X12<br>MEDIA_BUS_FMT_SGBRG12_1X12<br>MEDIA_BUS_FMT_SGRBG12_1X12<br>MEDIA_BUS_FMT_SRGGB8_1X8<br>MEDIA_BUS_FMT_SBGGR8_1X8<br>MEDIA_BUS_FMT_SGBRG8_1X8<br>MEDIA_BUS_FMT_SGRBG8_1X8 |
| YUV | MEDIA_BUS_FMT_YUYV8_2X8<br>MEDIA_BUS_FMT_YVYU8_2X8<br>MEDIA_BUS_FMT_UYVY8_2X8<br>MEDIA_BUS_FMT_VYUY8_2X8<br>MEDIA_BUS_FMT_YUYV10_2X10<br>MEDIA_BUS_FMT_YVYU10_2X10<br>MEDIA_BUS_FMT_UYVY10_2X10<br>MEDIA_BUS_FMT_VYUY10_2X10<br>MEDIA_BUS_FMT_YUYV12_2X12<br>MEDIA_BUS_FMT_YVYU12_2X12<br>MEDIA_BUS_FMT_UYVY12_2X12<br>MEDIA_BUS_FMT_VYUY12_2X12 |
| 仅输出 Y（黑白）的 raw bw sensor | MEDIA_BUS_FMT_Y8_1X8<br>MEDIA_BUS_FMT_Y10_1X10<br>MEDIA_BUS_FMT_Y12_1X12 |

## 附录 C：CIS 参考驱动列表

<!-- Source: English PDF p131, table unit 1331 -->

| CIS 数据接口 | CIS 输出数据类型 | 帧/场 | 参考驱动 |
| --- | --- | --- | --- |
| MIPI | Bayer RAW | 帧 | 0.3M<br>ov7750.c<br>gc0403.c<br>1.2M<br>ov9750.c<br>jx-h65.c<br>2M<br>ov2685.c<br>ov2680.c<br>ov2735.c<br>gc2385.c<br>gc2355.c<br>gc2053.c<br>sc2239.c<br>sc210iot.c<br>4M<br>gc4c33.c<br>5M<br>ov5695.c<br>ov5648.c<br>ov5670.c<br>gc5024.c<br>gc5025.c<br>gc5035.c<br>8M<br>ov8858.c<br>imx378.c<br>imx317.c<br>imx219.c<br>gc8034.c<br>13M<br>ov13850.c<br>imx258.c |
| MIPI | Bayer raw HDR | 帧 | 2M<br>imx307.c<br>imx327.c<br>gc2093.c<br>ov02k10<br>ov2718.c<br>sc200ai.c<br>sc2310.c<br>jx-f37.c<br>4M<br>ov4689.c<br>os04a10.c<br>imx347.c<br>sc4238.c<br>5M<br>imx335.c<br>8M<br>imx334.c<br>imx415.c |
| MIPI | YUV | 帧 | 2M<br>gc2145.c |
| MIPI | RAW BW | 帧 | 0.3M<br>ov7251.c<br>1M<br>ov9281.c<br>1.3M<br>sc132gs.c |
| MIPI | YUV | field | tc35874x.c |
| ITU.BT601 | Bayer RAW |  | 2M<br>imx323.c<br>ar0230.c |
| ITU.BT601 | YUV |  | 0.3M<br>gc0329.c<br>gc0312.c<br>gc032a.c<br>2M<br>gc2145.c<br>gc2155.c<br>gc2035.c<br>bf3925.c |
| ITU.BT601 | RAW BW |  |  |
| ITU.BT656 | Bayer RAW |  | 2M：imx323（可支持） |

## 附录 D：VCM 驱动 IC 参考驱动列表

##### 参考驱动

vm149c.c

dw9714.c

fp5510.c

## 附录 E：闪光灯驱动 IC 参考驱动列表

##### 参考驱动

sgm3784.c

leds-rgb13h.c（GPIO 控制）

{% endraw %}
