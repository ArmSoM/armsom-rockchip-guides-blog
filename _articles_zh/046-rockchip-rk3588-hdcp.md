---
title: "RK3588 HDCP 完整开发指南：密钥、固件、HDMI/DP 配置与故障分析"
description: "完整整理 RK3588 HDCP 1.4/2.3 工具、libhdcp API、密钥与固件打包、HDMIRX/HDMITX/DPTX 配置、状态和常见故障。"
translation_key: "046-rockchip-rk3588-hdcp"
slug: "046-rockchip-rk3588-hdcp"
lang: "zh"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "HDCP"]
keywords: "ArmSoM Rockchip HDCP"
excerpt: "完整整理 RK3588 HDCP 1.4/2.3 工具、libhdcp API、密钥与固件打包、HDMIRX/HDMITX/DPTX 配置、状态和常见故障。"
---

{% raw %}

# RK3588 HDCP 完整开发指南：密钥、固件、HDMI/DP 配置与故障分析

本文完整整理 Rockchip V1.0.0 技术文档。原文适用范围为 RK3588、Linux 5.10、Android12/Android13。作为 ArmSoM 平台参考，使用前须核对实际板卡、SoC、SDK/BSP 分支、内核与外设配置；未完成板级硬件验证，不承诺所有 ArmSoM 板卡支持。

中文采用 19 页中文 PDF；英文采用 21 页英文 PDF，俄文完整翻译英文技术正文。中文用中文原图，英文/俄文用英文 PDF 原图；英文原图中仍有中文界面标签时如实保留。局部矛盾和提取修复见[校对记录](/docs/rockchip-rk3588-hdcp/EDITORIAL-NOTES.md)。代码注释和输出按源语言保留。

**操作风险**：密钥/固件烧写会改变设备存储与认证状态。文中十六进制密钥是原文示例，不是生产密钥；合法 HDCP 密钥须按授权获取。未执行任何烧写、OTP、认证或播放测试，不包含私有密钥。原文默认加密与额外 AES 的说明不能替代具体 SDK 和授权要求。

官方资料入口：[ArmSoM](https://docs.armsom.org/)、[Rockchip Linux](https://github.com/rockchip-linux)。

| SoC | Kernel | Android |
|---|---|---|
| RK3588 | Linux 5.10 | Android12 / Android13 |

<!-- Source CN PDF p.4, block 0 -->

## 1. HDCP 概述

<!-- Source CN PDF p.4, block 1 -->

RK3588 平台，HDMITX、HDMIRX、DPTX 分别支持 HDCP1.4 和 HDCP2.3.

<!-- Source CN PDF p.4, block 2 -->

RK3588 平台有两个独立的 HDCP2.3 控制器 (hdcp0 和 hdcp1)，每个 HDCP2.3 控制器都有 3 个Port：

<!-- Source CN PDF p.4, block 3 -->

hdcp0：DPTX0 和 DPTX1

<!-- Source CN PDF p.4, block 4 -->

hdcp1：HDMIRX、HDMITX0 和 HDMITX1

<!-- Source CN PDF p.4, block 5 -->

![原文技术图 — PDF 4](/docs/rockchip-rk3588-hdcp/assets/cn-p04-figure1.png)

原图内容的可编辑转录：

| Controller | Port | Interface |
|---|---|---|
| HDCP0 | Port0 | DPTX0 |
| HDCP0 | Port1 | DPTX1 |
| HDCP1 | Port0 | HDMIRX |
| HDCP1 | Port1 | HDMITX0 |
| HDCP1 | Port2 | HDMITX1 |

<!-- Source CN PDF p.4, block 6 -->

HDCP1.4 或是 HDCP2.3 KEY 都需要客户自行到 HDCP 官网购买，RK3588 没有内置 HDCP KEY.

<!-- Source CN PDF p.4, block 7 -->

## 2. HDCP 工具说明

<!-- Source CN PDF p.4, block 8 -->

### 2.1 HDCP 支持不同的烧写模式

<!-- Source CN PDF p.4, block 9 -->

1\. RK 提供对应的 KEY 转换工具和烧写工具，可以从 SDK 从获取：

<!-- Source CN PDF p.4, block 10 -->

Key 拆分和转换工具：

<!-- Source CN PDF p.4, block 11 -->

RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z 工具包下面有 KeyConvertor key
的拆分和转换工具，更新到 KeyConvertor-V2.0.5 可以拆分成一个bin文件只有一个key.

<!-- Source CN PDF p.4, block 12 -->

Key 烧写工具：

<!-- Source CN PDF p.4, block 13 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source CN PDF p.5, block 14 -->

2\. RK 提供加密烧写库 libhdcp.so，客户可以根据自己的需求开发对应的烧写工具，对应的 libhdcp.so 需要提 redmine 获取。

<!-- Source CN PDF p.5, block 15 -->

### 2.2 HDCP 两种不同烧写模式的区别

<!-- Source CN PDF p.5, block 16 -->

1\. RK 提供的烧写工具，在 KEY 的 SEED 加密基础上会再进行 AES 加密，然后写入 Vendor Storage。

<!-- Source CN PDF p.5, block 17 -->

2\. 加密烧写库 libhdcp.so 只支持 SEED 加密。

<!-- Source CN PDF p.5, block 18 -->

### 2.3 加密烧写库 libhdcp.so 接口

<!-- Source CN PDF p.5, block 19 -->

```text
enum HDCP_KEY_ID {
    HDCP1X_KEY_HDMITX_RK33 = 0,
    HDCP1X_KEY_HDMITX_RK3588,
    HDCP1X_KEY_HDMIRX_RK3588,
    HDCP1X_KEY_HDMIRX_RK628,
    HDCP1X_KEY_DP_RK3588,
    HDCP2X_KEY_HDMIRX_RK3588,
    HDCP2X_KEY_RKIV_RK3588,
};
/*
 * Encrypt the key, but is not written to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 * keyout: The encrypted key
 * keyout_size: HDCP1.x 314, HDCP2.x 1000
 */
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t
*keyout, int keyout_size);
/*
 * Encrypt key and write it to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int
keyin_size);
/*
 * Write key to vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * size: key size
 */
int hdcp_key_write(enum HDCP_KEY_ID id, uint8_t *key, int size);
/*
 * Read key from vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 314 Byte Key, HDCP2.x 1000 Byte Key
 * len: key length
 */
int hdcp_key_read(enum HDCP_KEY_ID id, uint8_t *key, int *len);
/*
 * Write rkiv to vendor
 *
 * rkiv: rkiv
 * len: must be 16
 */
int hdcp_rkiv_write(uint8_t *rkiv, int len);
```

<!-- Source CN PDF p.6, block 21 -->

### 2.4 HDCP 1.4 KEY 的加密说明

<!-- Source CN PDF p.6, block 22 -->

一个HDCP 1.4 KEY有308 Bytes，分别如下：
8 Bytes KSV: 5 Bytes KSV + 3 Bytes 0x0组成;
280 Bytes DPK;
20 Bytes SHA.

<!-- Source CN PDF p.6, block 23 -->

SEED 加密，只对 280 Bytes 的 DPK进行加密。

<!-- Source CN PDF p.6, block 24 -->

### 2.5 HDCP 2.3 固件打包说明

<!-- Source CN PDF p.6, block 25 -->

DWC_HDCP2_BASE_ESM_Firmware 固件打包工具没有随 SDK 发布，所以需要 redmine 或是邮件向 RK获取。

<!-- Source CN PDF p.6, block 26 -->

1\. 单独 HDMIRX 固件和 KEY

<!-- Source CN PDF p.6, block 27 -->

RX KEY 放到打包工具的根目录和 tools目录下：

<!-- Source CN PDF p.6, block 28 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source CN PDF p.6, block 29 -->

执行build_rockchip_fw.sh 脚本，选择 1 -build firmware for both HDMIRX and HDMITX，生成./firmware/hdpc2_hdmi.fw 固件：

<!-- Source CN PDF p.6, block 30 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source CN PDF p.6, block 31 -->

2\. HDMIRX + HDMITX 固件和 KEY

<!-- Source CN PDF p.7, block recovered-32 -->

RX + TX KEY 放到打包工具的根目录和 tools目录下：

<!-- Source CN PDF p.7, block 32 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source CN PDF p.7, block 33 -->

执行build_rockchip_fw.sh 脚本，选择 1 -build firmware for both HDMIRX and HDMITX，生成./firmware/hdpc2_dp.fw 固件：

<!-- Source CN PDF p.7, block 34 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source CN PDF p.7, block 35 -->

3\. 单独 HDMITX 固件

<!-- Source CN PDF p.7, block 36 -->

TX KEY 放到打包工具的根目录和 tools目录下：

<!-- Source CN PDF p.7, block 37 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source CN PDF p.7, block 38 -->

执行build_rockchip_fw.sh 脚本，选择 2 -build firmware for HDMITX only，生成./firmware/hdpc2_hdmi.fw 固件：

<!-- Source CN PDF p.7, block 39 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source CN PDF p.7, block 40 -->

4\. DPTX 固件

<!-- Source CN PDF p.7, block 41 -->

TX KEY 放到打包工具的根目录和 tools目录下：

<!-- Source CN PDF p.7, block 42 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source CN PDF p.7, block 43 -->

执行build_rockchip_fw.sh 脚本，选择 3 -build firmware for DP，生成./firmware/hdpc2_hdmi.fw 固件：

<!-- Source CN PDF p.7, block 44 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source CN PDF p.7, block 45 -->

### 2.6 Firmware 和 RX KEY 加密 (可选项，非必须)

<!-- Source CN PDF p.7, block 46 -->

Firmware 和 RX KEY 默认会有 PKf / DUK 加密，然后在 HDCP 控制器 load Firmware 和 RX KEY 之后用PKf / DUK 进行解密，PKf / DUK 在芯片出厂的时候烧录到 OTP 。

<!-- Source CN PDF p.8, block 47 -->

为了确保每个客户 Firmware 和 RX KEY 的唯一性，可以对 Firmware 和 RX KEY 在打包的时候用密钥 RKIV 多一层 AES 加密，然后 HDCP2 服务 load Firmware 和 RX KEY 之后会先进行 AES 解密，然后再传给 HDCP 控制器进行Kf / DUK 解密，具体配置如下：

<!-- Source CN PDF p.8, block 48 -->

1\. firmware.aic.nouart 配置16 bytes 的 RKIV，RKIV 为加密密钥，可自行定义，但长度必须是16bytes：

<!-- Source CN PDF p.8, block 49 -->

```text
--- a/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
+++ b/DWC_HDCP2_BASE_ESM_Firmware/firmware/firmware.aic.nouart
@@ -2,6 +2,7 @@ PKf = 0x00112233445566778899aabbccddeeff
 DUK = 0xffeeddccbbaa99887766554433221100
 IK = 0xffeeddccbbaa99887766554433221100
 IVc = 0xdeadbeeffedcba9876543210
+RKIV = 0x00112233445566778899aabbccddeeff
 BBRcode = 6144
 BBRdwb = 3072
 CLL = 64
```

<!-- Source CN PDF p.8, block 50 -->

2\. 调用 libhdcp.so 库接口，把 RKIV 烧录到 vendor storage：

<!-- Source CN PDF p.8, block 51 -->

```text
int main(void)
{
    uint8_t rkiv[] = {0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff};
    hdcp_rkiv_write(rkiv, 16);
    return 0;
}
```

<!-- Source CN PDF p.8, block 52 -->

3\. 如果烧录 HDCP2x RX KEY，需要重新再次烧录 RKIV.

<!-- Source CN PDF p.8, block 53 -->

4\. hdcp2_tx_rx 需要更新到 V3.4 及以上版本。

<!-- Source CN PDF p.8, block 54 -->

```text
rk3588_t:/ # logcat | grep HDCP2
03-16 07:36:03.988 347 347 D HDCP2 : hdcp2 version v3.4
03-16 07:36:03.988 347 347 D HDCP2 : HDCP Port: 1
03-16 07:36:03.991 347 347 D HDCP2 : Firmware: [1]
```

<!-- Source CN PDF p.8, block 55 -->

## 3. HDCP1.4 配置及说明

<!-- Source CN PDF p.8, block 56 -->

### 3.1 HDMIRX

<!-- Source CN PDF p.8, block 57 -->

#### 3.1.1 dts 配置

<!-- Source CN PDF p.8, block 58 -->

单独支持 HDCP1.4：

<!-- Source CN PDF p.9, block 59 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp1x-enable;
};
```

<!-- Source CN PDF p.9, block 60 -->

如果使能 HDCP2.3，也会默认使能HDCP1.4：

<!-- Source CN PDF p.9, block 61 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source CN PDF p.9, block 62 -->

#### 3.1.2 Key 烧写

<!-- Source CN PDF p.9, block 63 -->

##### 3.1.2.1 RK 工具烧写

<!-- Source CN PDF p.9, block 64 -->

Key 拆分和转换工具从SDK获取：

<!-- Source CN PDF p.9, block 65 -->

RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z 工具包下面有 KeyConvertor key 的拆
分和转换工具，更新到 KeyConvertor-V2.0.5 可以拆分成一个bin文件只有一个key.

<!-- Source CN PDF p.9, block 66 -->

Key 烧写工具从SDK获取：

<!-- Source CN PDF p.9, block 67 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source CN PDF p.9, block 68 -->

先用 Key 拆分和转换工具，从原始的 Key 文件中拆出部分 Key， 然后把该 Key 转成 .skf 后缀的烧写Key.

<!-- Source CN PDF p.9, block 69 -->

如果不用RK提供的工具烧写，需要把Key拆成一个文件只包含一个Key，可以在提取原始Key的"每文件KEY个数"填入 1 ，点提取即可生成单独的Key文件，不需要转成 .skf 格式。

<!-- Source CN PDF p.10, block 70 -->

![原文技术图 — PDF 10](/docs/rockchip-rk3588-hdcp/assets/cn-p10-figure1.png)

<!-- Source CN PDF p.10, block 71 -->

机器进入Loader模式，烧写工具勾选 "hdcp1.4Hdmirx" 和 "RK3588" 选项，RK3588 HDCP1.4Key 增加了 AES 加密，所以 "Do AES" 为可选项，不选的话只有 SEED 加密，选上的话会在 SEED加密的基础上再进行 AES 加密，更安全。然后导入上面的 .skf 文件，点击写入即可完成 Key 的烧写。

<!-- Source CN PDF p.10, block 72 -->

说明：工具写完一个 Key 之后自动会跳到下一个 Key。

<!-- Source CN PDF p.10, block 73 -->

![原文技术图 — PDF 10](/docs/rockchip-rk3588-hdcp/assets/cn-p10-figure2.png)

<!-- Source CN PDF p.11, block recovered-74 -->

##### 3.1.2.2 客户自行开发工具烧写

<!-- Source CN PDF p.11, block 74 -->

可以自己写应用，调用 libhdcp.so 接口，对 KEY 进行加密并烧写对 Vendor Storage.

<!-- Source CN PDF p.11, block 75 -->

### 3.2 HDMITX

<!-- Source CN PDF p.11, block 76 -->

HDMITX HDCP 1.4 不需要特别配置 dts，驱动默认注册。

<!-- Source CN PDF p.11, block 77 -->

要正常使用首先需要分割、转换 KEY，所用的工具与方法与 HDMIRX 一致，参考 3.1.2.1 章节。

<!-- Source CN PDF p.11, block 78 -->

![原文技术图 — PDF 11](/docs/rockchip-rk3588-hdcp/assets/cn-p11-figure1.png)

<!-- Source CN PDF p.11, block 79 -->

烧写 KEY 所用工具也与 RX 一致。机器进入Loader模式，烧写工具点击设置，勾选 "hdcp1.4Hdmitx" 、 "RK3588" 、 "强制写入" 、 "单次写入"选项。然后导入 key 转换后的 .skf 文件，点击写入即可完成 Key 的烧写。

<!-- Source CN PDF p.11, block 80 -->

说明：工具写完一个 Key 之后自动会跳到下一个 Key。

<!-- Source CN PDF p.11, block 81 -->

### 3.3 DPTX

<!-- Source CN PDF p.11, block 82 -->

#### 3.3.1 dts 配置

<!-- Source CN PDF p.11, block 83 -->

默认 DPTX 的驱动默认支持 HDCP1.4, 不需要额外的 dts 配置。

<!-- Source CN PDF p.12, block recovered-84 -->

#### 3.3.2 Key 烧写

<!-- Source CN PDF p.12, block 84 -->

Key 拆分和转换工具， 与 HDMI RX 一致， 参考 3.1.2.1 章节。

<!-- Source CN PDF p.12, block 85 -->

烧写 KEY 所用工具也与 HDMI RX 一致。机器进入 Loader 模式，烧写工具点击设置，勾选 "hdcp1.4dp" 、 "RK3588" 、 "强制写入" 、 "单次写入"选项。然后导入 key 转换后的 .skf 文件，点击写入即可完成 Key 的烧写。另外同 RK3588 HDCP1.4 Key，增加了 AES 加密，所以 "Do AES" 为可选项，不选的话只有 SEED 加密，选上的话会在 SEED 加密的基础上再进行 AES 加密。

<!-- Source CN PDF p.12, block 86 -->

![原文技术图 — PDF 12](/docs/rockchip-rk3588-hdcp/assets/cn-p12-figure1.png)

<!-- Source CN PDF p.12, block 87 -->

## 4. HDCP2.3 配置及说明

<!-- Source CN PDF p.12, block 88 -->

### 4.1 HDMIRX

<!-- Source CN PDF p.12, block 89 -->

#### 4.1.1 dts 配置

<!-- Source CN PDF p.12, block 90 -->

使能 HDCP2.3，也会默认使能HDCP1.4：

<!-- Source CN PDF p.12, block 91 -->

```text
&hdcp1 {
    status = "okay";
};
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source CN PDF p.13, block recovered-92 -->

#### 4.1.2 打包 Firmware 和 启动服务

<!-- Source CN PDF p.13, block 92 -->

DWC_HDCP2_BASE_ESM_Firmware 解压到 Linux 环境下，然后把 hdcp_receivers.bin 拷贝到根目录和 tools/ 目录下，如果同时支持HDMITX的话，可以同时把 hdcp_transmitter.bin 也拷贝到相同的目录下。

<!-- Source CN PDF p.13, block 93 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source CN PDF p.13, block 94 -->

打包 Firmware 和 RX KEY，执行 build_rockchip_fw.sh 脚本

<!-- Source CN PDF p.13, block 95 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source CN PDF p.13, block 96 -->

打包过程会有几个步骤会提示输入的：

<!-- Source CN PDF p.13, block 97 -->

1\. 选择打包固件类型，选择: 1 -build firmware for both HDMIRX and HDMITX，生成./firmware/hdpc2_hdmi.fw 固件。

<!-- Source CN PDF p.13, block 98 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source CN PDF p.13, block 99 -->

2\. 需要创建 RX KEY 的数量，根据需求创建，比如10或是100等，生成单独的 KEY 存放到./rxkeys/hdcpkeys?-?/ 目录下的 fw_hdcp_receivers_\*.bin 文件，如果客户用自己的工具烧写的话，可以直接烧写 fw_hdcp_receivers_\*.bin 文件。

<!-- Source CN PDF p.13, block 100 -->

```text
Create Rx Key Number:
10
......
Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

<!-- Source CN PDF p.13, block 101 -->

3\. 如果需要用 RK 提供的工具烧写 KEY，需要打包成 .skf 文件，存放到./rxkeys/hdcpkeys?-?/目录下，如果不需要 RK 的工具烧写，这边可以选择 n.

<!-- Source CN PDF p.13, block 102 -->

```text
Do want to pack these keys to .skf file? [y/n]:
y
10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

<!-- Source CN PDF p.13, block 103 -->

HDCP2.3 RX KEY 的烧写

<!-- Source CN PDF p.13, block 104 -->

1\. 把 hdcp2_hdmi.fw 放到 device/rockchip/rk3588/ 工程目录下，编译的时候会拷贝到vendor/firmware/hdcp2_hdmi.fw。

<!-- Source CN PDF p.13, block 105 -->

2\. 用 RKDevInfoTool.exe 工具，选择 HDCP2X_HDMIRX 导入上面生成的 hdcprxkeys1-10.skf，进入Loader 模式进行烧写。写完一个 Key，工具会自动跳到下一个 Key 等待烧写。

<!-- Source CN PDF p.13, block 106 -->

3\. HDCP2.3 Key 不需要AES加密，所以这边只需要勾选 "RK3588" 和 "hdcp2x hdmirx"。

<!-- Source CN PDF p.14, block 107 -->

![原文技术图 — PDF 14](/docs/rockchip-rk3588-hdcp/assets/cn-p14-figure1.png)

<!-- Source CN PDF p.14, block 108 -->

hdcp2_rx_tx 服务

<!-- Source CN PDF p.14, block 109 -->

开机自动加载服务，如果出现认证异常，可以logcat \| grep HDCP2 查看对应的log.

<!-- Source CN PDF p.14, block 110 -->

### 4.2 HDMITX

<!-- Source CN PDF p.14, block 111 -->

#### 4.2.1 dts 配置

<!-- Source CN PDF p.14, block 112 -->

HDMITX 与 HDMIRX 共用一个 HDCP 模块，使能 HDCP2.3，也会默认使能HDCP1.4：

<!-- Source CN PDF p.14, block 113 -->

```text
&hdcp1 {
    status = "okay";
};
```

<!-- Source CN PDF p.14, block 114 -->

HDMI 的使能请参考《Rockchip_Developer_Guide_HDMI_CN》。

<!-- Source CN PDF p.14, block 115 -->

#### 4.2.2 打包 Firmware 和 启动服务

<!-- Source CN PDF p.14, block 116 -->

DWC_HDCP2_BASE_ESM_Firmware 解压到 Linux 环境下，然后把 hdcp_transmitter.bin 拷贝到根目录和 tools/ 目录下，如果同时支持 HDMIRX 的话，可以同时把 hdcp_receivers.bin 也拷贝到相同的目录下。

<!-- Source CN PDF p.14, block 117 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source CN PDF p.14, block 118 -->

打包 Firmware 和 TX KEY，执行 build_rockchip_fw.sh 脚本

<!-- Source CN PDF p.15, block 119 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source CN PDF p.15, block 120 -->

打包过程会有几个步骤会提示输入的：

<!-- Source CN PDF p.15, block 121 -->

选择打包固件类型，如果同时支持 HDMI TX/RX 选择: 1 -build firmware for both HDMIRX andHDMITX，如果只支持 HDMITX，选择：2 -build firmware for HDMITX only。最终生成./firmware/hdpc2_hdmi.fw 固件。

<!-- Source CN PDF p.15, block 122 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source CN PDF p.15, block 123 -->

hdcp2_rx_tx 服务

<!-- Source CN PDF p.15, block 124 -->

开机自动加载服务，如果出现认证异常，可以logcat \| grep HDCP2 查看对应的log。

<!-- Source CN PDF p.15, block 125 -->

### 4.3 DPTX

<!-- Source CN PDF p.15, block 126 -->

#### 4.3.1 dts 配置

<!-- Source CN PDF p.15, block 127 -->

DPTX 使用 HDCP0 模块，来使用 HDCP2.3 功能：

<!-- Source CN PDF p.15, block 128 -->

```text
&hdcp0 {
    status = "okay";
};
```

<!-- Source CN PDF p.15, block 129 -->

使能 HDCP2.3，也会默认使能HDCP1.4：

<!-- Source CN PDF p.15, block 130 -->

#### 4.3.2 打包 Firmware 和 启动服务

<!-- Source CN PDF p.15, block 131 -->

DWC_HDCP2_BASE_ESM_Firmware 解压到 Linux 环境下，然后把 hdcp_transmitter.bin 拷贝到根目录和 tools/ 目录下。

<!-- Source CN PDF p.15, block 132 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source CN PDF p.15, block 133 -->

打包 Firmware 和 TX KEY，执行 build_rockchip_fw.sh 脚本

<!-- Source CN PDF p.15, block 134 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source CN PDF p.15, block 135 -->

打包过程会提示输入：

<!-- Source CN PDF p.15, block 136 -->

选择打包固件类型，选择: 3 -build firmware for DP，生成 ./firmware/hdpc2_dp.fw 固件。

<!-- Source CN PDF p.16, block 137 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source CN PDF p.16, block 138 -->

对于 android 系统，要把 hdcp2_dp.fw 拷贝到 /vendor/firmware/hdcp2_dp.fw，可以在hardware/rockchip/hdcp2 下加入如下补丁:

<!-- Source CN PDF p.16, block 139 -->

```text
diff --git a/device.mk b/device.mk
index 6d6c328..d7ba0a2 100644
--- a/device.mk
+++ b/device.mk
@@ -82,6 +82,12 @@ ifeq ($(strip $(USE_PRODUCT_HDCP2_HDMI_FW)), true)
         $(LOCAL_PATH)/hdcp2_hdmi.fw:vendor/firmware/hdcp2_hdmi.fw
 endif
+USE_PRODUCT_HDCP2_DP_FW := $(shell test -f $(LOCAL_PATH)/hdcp2_dp.fw && echo true)
+ifeq ($(strip $(USE_PRODUCT_HDCP2_DP_FW)), true)
+ PRODUCT_COPY_FILES += \
+ $(LOCAL_PATH)/hdcp2_dp.fw:vendor/firmware/hdcp2_dp.fw
+endif
+
 #
 # add Rockchip properties here
 #
```

<!-- Source CN PDF p.16, block 140 -->

并把 hdcp2_dp.fw 放到 device/rockchip/rk3588/ 工程目录下，编译的时候会拷贝到/vendor/firmware/hdcp2_dp.fw。

<!-- Source CN PDF p.16, block 141 -->

对于 linux 系统，要把 hdcp2_dp.fw 拷贝到 /system/etc/firmware/hdcp2_dp.fw。

<!-- Source CN PDF p.16, block 142 -->

hdcp2_rx_tx 服务

<!-- Source CN PDF p.16, block 143 -->

对于 android 系统， 在 hardware/rockchip/hdcp2 下加入如下补丁:

<!-- Source CN PDF p.16, block 144 -->

```text
diff --git a/init.hdcp2-host.rc b/init.hdcp2-host.rc
index 5a9bee8..57eef7e 100644
--- a/init.hdcp2-host.rc
+++ b/init.hdcp2-host.rc
@@ -1,7 +1,14 @@
 #on early-boot
 on post-fs
+ start hdcp2_dp
     start hdcp2_hdmi
+service hdcp2_dp /vendor/bin/hdcp2_tx_rx 0
+ class core
+ oneshot
+ disabled
+ group root system net_admin net_bt
+ capabilities DAC_OVERRIDE
 service hdcp2_hdmi /vendor/bin/hdcp2_tx_rx 1
class core
```

<!-- Source CN PDF p.17, block 146 -->

即可在系统开机时自动加载服务，如果出现认证异常，可以logcat \| grep HDCP2 查看对应的log.

<!-- Source CN PDF p.17, block 147 -->

## 5. HDCP 状态查看

<!-- Source CN PDF p.17, block 148 -->

### 5.1 HDMIRX

<!-- Source CN PDF p.17, block 149 -->

```text
cat /sys/class/misc/hdmirx_hdcp/status
```

<!-- Source CN PDF p.17, block 150 -->

```text
HDCP Disable: HDCP 没使能
HDCP1.4: Authenticated start: 认证过程中
HDCP1.4: Authenticated success: 认证成功
HDCP1.4: Authenticated failed: 认证失败
HDCP1.4: Unknown status: 未知状态
```

<!-- Source CN PDF p.17, block 151 -->

```text
HDCP Disable: HDCP 没使能
HDCP2.3: Authenticated success: 认证成功
HDCP2.3: Authenticated failed: 认证失败
HDCP2.3: No dectypted: 源端没有开启HDCP2.x
```

<!-- Source CN PDF p.17, block 152 -->

Source 没有开启 HDCP 加密，或是没有接入信号源：

<!-- Source CN PDF p.17, block 153 -->

```text
HDCP2.3: No dectypted
HDCP1.4: Unknown status
```

<!-- Source CN PDF p.17, block 154 -->

### 5.2 HDMITX

<!-- Source CN PDF p.17, block 155 -->

HDMITX 状态需要通过 DRM PROPERTY 进行查看，以 modetest -c 命令查看属性举例：

<!-- Source CN PDF p.17, block 156 -->

```text
---------------------------------------------------------------------
Content Protection:
                flags: enum
                enums: Undesired=0 Desired=1 Enabled=2
                value: 2
Undesired：关闭hdcp。
Desired：开启hdcp。
Enabled：hdcp已经开启并认证成功。
---------------------------------------------------------------------
HDCP Content Type:
                flags: enum
                enums: HDCP Type0=0 HDCP Type1=1
                value: 0
HDCP Type0:HDCP1.4 或 HDCP2.3 任一等级认证成功，都允许输出正常画面。
HDCP Type1：必须HDCP2.3 认证成功，才能够输出正常画面。
注：该功能目前版本驱动未实际支持，默认任何等级认证成功都能输出正常，所以无需配置。
---------------------------------------------------------------------
hdcp_encrypted:
                flags: range
                values: 0 2
                value: 2
hdcp认证等级：
    0：hdcp未认证。
    1：hdcp1.4。
    2：hdcp2.3。
---------------------------------------------------------------------
```

<!-- Source CN PDF p.18, block 158 -->

### 5.3 DPTX

<!-- Source CN PDF p.18, block 159 -->

查看方式同 HDMITX

<!-- Source CN PDF p.18, block 160 -->

## 6. 常见问题分析

<!-- Source CN PDF p.18, block 161 -->

### 6.1 hdcp2_tx_rx 启动失败

<!-- Source CN PDF p.18, block 162 -->

查看 log:

<!-- Source CN PDF p.18, block 163 -->

```text
logcat | grep HDCP
```

<!-- Source CN PDF p.18, block 164 -->

```text
Failed to open firmware file [vendor/firmware/hdcp2_hdmi.fw] //说明firmware没有导入
```

<!-- Source CN PDF p.18, block 165 -->

```text
Failed to open firmware driver /dev/hl_dev1 //说明 hdcp 驱动没有加载，dts 需要使能对应
的 hdcp1节点
```

<!-- Source CN PDF p.18, block 166 -->

```text
07-14 10:53:17.033 2042 2042 D HDCP2 : hdcp2 version v3.0
07-14 10:53:17.033 2042 2042 D HDCP2 : HDCP Port: 1
07-14 10:53:17.034 2042 2042 D HDCP2 : Firmware: [1]
07-14 10:53:17.034 2042 2042 D HDCP2 : 223664 bytes
07-14 10:53:17.034 2042 2042 D HDCP2 : check rx key ok
07-14 10:53:17.034 2042 2042 D HDCP2 : rxkey read from vendor success,
rxkey_len = 1000
07-14 10:53:17.034 2042 2042 D HDCP2 : Host Library version V0201
07-14 10:53:17.035 2042 2042 D HDCP2 : Exiting with err=1
```

<!-- Source CN PDF p.18, block 167 -->

如果出现上面这种没有报错，直接退出的情况，可以手动执行，看下对应的报错：

<!-- Source CN PDF p.19, block 168 -->

```text
console:/ # ./vendor/bin/hdcp2_tx_rx 1 &
[1] 2799
console:/ # device name = /dev/hl_dev1
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1199] [PID:2799]
hlInst->driver->instance [0xee2401d0]
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1200] [PID:2799]
hlInst->driver [0xff8088f0:223664]
<WARN> [external/hdcp/host_library/core_lib/host_lib_core.c:1206] [PID:2799]
Error in file:external/hdcp/host_library/core_lib/host_lib_core.c, functio]
<ERROR> [external/hdcp/host_library/core_lib/host_lib_core.c:137] [PID:2799]
hostlib_init_mem failed
Failed HLC_Initialize, error -6
两面上面这种log，是固件打包问题，可能是 KEY 不对或是 DUK/PKf配置不对，又或是打包的方式不对，参
考[HDCP 2.3 固件打包说明]
```

<!-- Source CN PDF p.19, block 169 -->

```text
HLC_HDCPRX_LoadRxDwb failed //说明是RX KEY 不对
```

<!-- Source CN PDF p.19, block 170 -->

### 6.2 HDMIRX 黑屏或是绿屏插拔无法恢复

<!-- Source CN PDF p.19, block 171 -->

先确认 dts 的 hdcp2x-enable 是否打开，可以 cat /sys/class/misc/hdmirx_hdcp/enable 看值是否为 2。

<!-- Source CN PDF p.19, block 172 -->

如果 hdcp2x-enable 打开的话，那 hdcp2_tx_rx 这个服务必须要加载，不然就可能会出现黑屏或是绿屏，可以 logcat \| grep HDCP2 进行确认。

<!-- Source CN PDF p.19, block 173 -->

如果 hdcp2_tx_rx 已经加载，那需要确认是否异常退出，同样 logcat \| grep HDCP2 确认。

<!-- Source CN PDF p.19, block 174 -->

echo 0 > /sys/class/misc/hdmirx_hdcp/enable 之后恢复正常，可以确定是上面所说的问题。

<!-- Source CN PDF p.19, block 175 -->

### 6.3 同时打开 HDMITX + HDMIRX 的 HDCP2.3, 拔出 RX 的时候 TX会闪一下花屏

<!-- Source CN PDF p.19, block 176 -->

因为 HDMIRX 和 HDMITX 共用 HDCP2.3 控制器，RX 在预览的时候拔出，会复位控制器，导致HDCP2.3 控制器异常，hdcp2_tx_rx 检测到控制器异常之后，会重新初始化，重新做认证，所以会闪一下花屏，建议 TX + RX 的 HDCP2.3 不要同时打开。

{% endraw %}

