---
title: "RK3588 HDCP Developer Guide: Keys, Firmware, HDMI/DP Configuration and Troubleshooting"
description: "Complete RK3588 HDCP 1.4/2.3 reference covering tools, libhdcp APIs, key and firmware packaging, HDMIRX/HDMITX/DPTX, status and troubleshooting."
translation_key: "046-rockchip-rk3588-hdcp"
slug: "046-rockchip-rk3588-hdcp"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["Rockchip", "HDCP"]
keywords: "ArmSoM Rockchip HDCP"
excerpt: "Complete RK3588 HDCP 1.4/2.3 reference covering tools, libhdcp APIs, key and firmware packaging, HDMIRX/HDMITX/DPTX, status and troubleshooting."
---

{% raw %}

# RK3588 HDCP Developer Guide: Keys, Firmware, HDMI/DP Configuration and Troubleshooting

This complete technical reference follows Rockchip V1.0.0. The source scope is RK3588, Linux 5.10, Android12/Android13. It is an ArmSoM platform reference: verify the actual board, SoC, SDK/BSP branch, kernel and peripheral configuration. No board-level hardware validation has been performed; support on every ArmSoM board is not implied.

Chinese follows the 19-page Chinese PDF; English follows the 21-page English PDF and Russian fully translates its technical text. Chinese uses Chinese-source figures; English and Russian use English-PDF figures, including any Chinese UI labels present in those originals. Source conflicts and extraction repairs are recorded in the [editorial notes](/docs/rockchip-rk3588-hdcp/EDITORIAL-NOTES.md). Code comments and output retain their source language.

**Operational risk:** key/firmware programming changes device storage and authentication state. Hexadecimal keys are source examples, not production keys; obtain legitimate HDCP keys under the applicable licensing terms. No programming, OTP, authentication or playback tests were performed, and no private keys are included. Source encryption descriptions do not replace SDK-specific or licensing requirements.

Official resources: [ArmSoM](https://docs.armsom.org/)、[Rockchip Linux](https://github.com/rockchip-linux)。

| SoC | Kernel | Android |
|---|---|---|
| RK3588 | Linux 5.10 | Android12 / Android13 |

<!-- Source EN PDF p.4, block 0 -->

## 1. HDCP Overview

<!-- Source EN PDF p.4, block 1 -->

The RK3588 platform supports HDCP1.4 and HDCP2.3 for HDMITX, HDMIRX, and DPTX respectively.

<!-- Source EN PDF p.4, block 2 -->

The RK3588 platform has two independent HDCP2.3 controllers (hdcp0 and hdcp1), each of which has 3 Ports:

<!-- Source EN PDF p.4, block 3 -->

hdcp0: DPTX0 and DPTX1

<!-- Source EN PDF p.4, block 4 -->

hdcp1: HDMIRX, HDMITX0, and HDMITX1

<!-- Source EN PDF p.4, block 5 -->

![Source technical figure — PDF 4](/docs/rockchip-rk3588-hdcp/assets/en-p04-figure1.png)

Editable transcription of the figure:

| Controller | Port | Interface |
|---|---|---|
| HDCP0 | Port0 | DPTX0 |
| HDCP0 | Port1 | DPTX1 |
| HDCP1 | Port0 | HDMIRX |
| HDCP1 | Port1 | HDMITX0 |
| HDCP1 | Port2 | HDMITX1 |

<!-- Source EN PDF p.4, block 6 -->

HDCP1.4 or HDCP2.3 keys must be purchased by customers directly from the HDCP official website and RK3588 does not have built-in HDCP keys.

<!-- Source EN PDF p.4, block 7 -->

## 2. HDCP Tool Instruction

<!-- Source EN PDF p.4, block 8 -->

### 2.1 HDCP Support for Different Flashing Modes

<!-- Source EN PDF p.4, block 9 -->

1\. RK provides the corresponding KEY conversion tool and flashing tool, which can be obtained from the SDK:

<!-- Source EN PDF p.4, block 10 -->

Key Splitting and Conversion Tool:

<!-- Source EN PDF p.4, block 11 -->

The RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z toolkit contains split and conversion
tools for KeyConvertor key. Updating to KeyConvertor-V2.0.5 allows splitting into a single
bin file with one key.

<!-- Source EN PDF p.5, block 12 -->

Key Flashing Tool:

<!-- Source EN PDF p.5, block 13 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.5, block 14 -->

2\. RK provides an encrypted flashing library libhdcp.so. Customers can develop corresponding flashing tools based on their specific requirements. The libhdcp.so library can be obtained via Redmine.

<!-- Source EN PDF p.5, block 15 -->

### 2.2 Differences Between the Two HDCP Flashing Modes

<!-- Source EN PDF p.5, block 16 -->

1\. The RK-provided flashing tool applies an additional AES encryption on top of the KEY's SEED encryption, then writes it into the Vendor Storage.

<!-- Source EN PDF p.5, block 17 -->

2\. The encrypted flashing library libhdcp.so only supports SEED encryption.

<!-- Source EN PDF p.5, block 18 -->

### 2.3 Encrypted Flashing Library libhdcp.so Interface

<!-- Source EN PDF p.5, block 19 -->

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
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t *keyout,
int keyout_size);
/*
 * Encrypt key and write it to vendor
 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size);
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

<!-- Source EN PDF p.6, block 21 -->

### 2.4 HDCP 1.4 Key Encryption

<!-- Source EN PDF p.6, block 22 -->

A HDCP 1.4 KEY consists of 308 bytes, as follows:
8 Bytes KSV: 5 Bytes KSV + 3 Bytes 0x0;
280 Bytes DPK;
20 Bytes SHA.

<!-- Source EN PDF p.6, block 23 -->

SEED encryption only encrypts the DPK with 280 bytes.

<!-- Source EN PDF p.6, block 24 -->

### 2.5 HDCP 2.3 Firmware Packaging Instruction

<!-- Source EN PDF p.6, block 25 -->

The DWC_HDCP2_BASE_ESM_Firmware packaging tool is not included in the SDK, so it requires requesting via Redmine or email from RK.

<!-- Source EN PDF p.6, block 26 -->

1\. Separate HDMIRX Firmware and Key

<!-- Source EN PDF p.6, block 27 -->

Place the RX KEY in the root directory of the packaging tool and the tools directory:

<!-- Source EN PDF p.6, block 28 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.7, block 29 -->

Execute build_rockchip_fw.sh script, and select option 1 - build firmware for both HDMIRX and HDMITX, to generate the ./firmware/hdpc2_hdmi.fw firmware:

<!-- Source EN PDF p.7, block 30 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 31 -->

2\. HDMIRX + HDMITX Firmware and Key

<!-- Source EN PDF p.7, block 32 -->

Place the RX + TX KEY in the root directory of the packaging tool and the tools directory:

<!-- Source EN PDF p.7, block 33 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 34 -->

Execute the build_rockchip_fw.sh script, and select 1 - build firmware for both HDMIRX and HDMITX, to generate the ./firmware/hdpc2_dp.fw firmware:

<!-- Source EN PDF p.7, block 35 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.7, block 36 -->

3\. HDMITX Firmware

<!-- Source EN PDF p.7, block 37 -->

Place the TX KEY in the root directory of the packaging tool and the tools directory:

<!-- Source EN PDF p.7, block 38 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.7, block 39 -->

Execute build_rockchip_fw.sh script, and select 2 - build firmware for HDMITX only, to generate ./firmware/hdpc2_hdmi.fw firmware:

<!-- Source EN PDF p.7, block 40 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.7, block 41 -->

4\. DPTX Firmware

<!-- Source EN PDF p.7, block 42 -->

Place the TX KEY in the root directory of the packaging tool and the tools directory:

<!-- Source EN PDF p.7, block 43 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_transmitter.bin .
cp ../hdcp_transmitter.bin tools/
```

<!-- Source EN PDF p.8, block 44 -->

Execute the build_rockchip_fw.sh script, and select 3 - build firmware for DP, to generate the ./firmware/hdpc2_hdmi.fw firmware:

<!-- Source EN PDF p.8, block 45 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.8, block 46 -->

### 2.6 Firmware and RX KEY Encryption (Optional, not mandatory)

<!-- Source EN PDF p.8, block 47 -->

Firmware and RX KEY are encrypted by default using PKf/ DUK. Subsequently, after the HDCP controller loads the Firmware and RX KEY, they are decrypted using PKf/ DUK. The PKf/ DUK is flashed into the OTP at the time of chip production.

<!-- Source EN PDF p.8, block 48 -->

To ensure the uniqueness of each customer's Firmware and RX KEY, the Firmware and RX KEY can be encrypted with an additional layer of AES encryption using the key RKIV during packaging. After the HDCP2 service loads the Firmware and RX KEY, it first performs AES decryption, then transfers the data to the HDCP controller for Kf/ DUK decryption. Specific configurations are as follows:

<!-- Source EN PDF p.8, block 49 -->

1\. firmware.aic.nouart configuration of the 16-byte RKIV: The RKIV acts as the encryption key, user- definable but must maintain a length of exactly 16 bytes:

<!-- Source EN PDF p.8, block 50 -->

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

<!-- Source EN PDF p.8, block 51 -->

2\. Call the libhdcp.so library interface to flash RKIV into the vendor storage:

<!-- Source EN PDF p.8, block 52 -->

```text
int main(void)
{
    uint8_t rkiv[] = {0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff};
    hdcp_rkiv_write(rkiv, 16);
    return 0;
}
```

<!-- Source EN PDF p.8, block 53 -->

3\. If flashing the HDCP2x RX KEY, need to reflash RKIV again.

<!-- Source EN PDF p.8, block 54 -->

4\. hdcp2_tx_rx must be updated to version 3.4 or higher.

<!-- Source EN PDF p.9, block 55 -->

```text
rk3588_t:/ # logcat | grep HDCP2
03-16 07:36:03.988 347 347 D HDCP2 : hdcp2 version v3.4
03-16 07:36:03.988 347 347 D HDCP2 : HDCP Port: 1
03-16 07:36:03.991 347 347 D HDCP2 : Firmware: [1]
```

<!-- Source EN PDF p.9, block 56 -->

## 3. HDCP1.4 Configuration and Description

<!-- Source EN PDF p.9, block 57 -->

### 3.1 HDMIRX

<!-- Source EN PDF p.9, block 58 -->

#### 3.1.1 dts Configuration

<!-- Source EN PDF p.9, block 59 -->

Only support HDCP 1.4:

<!-- Source EN PDF p.9, block 60 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp1x-enable;
};
```

<!-- Source EN PDF p.9, block 61 -->

Enabling HDCP2.3 also enables HDCP1.4 by default:

<!-- Source EN PDF p.9, block 62 -->

```text
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.9, block 63 -->

#### 3.1.2 Key Flashing

<!-- Source EN PDF p.9, block 64 -->

##### 3.1.2.1 RK Tool Flashing

<!-- Source EN PDF p.9, block 65 -->

Key Split and Conversion Tool obtained from SDK:

<!-- Source EN PDF p.9, block 66 -->

The RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z toolkit contains split and conversion
tools for KeyConvertor key. Updating to KeyConvertor-V2.0.5 allows splitting into a single
bin file with one key.

<!-- Source EN PDF p.9, block 67 -->

Key flashing tool obtained from SDK:

<!-- Source EN PDF p.9, block 68 -->

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

<!-- Source EN PDF p.9, block 69 -->

First, use the Key Splitting and Conversion Tool to extract specific Keys from the original Key file, then convert the Key into a .skf-suffixed flashing Key.

<!-- Source EN PDF p.10, block 70 -->

If not using the tools provided by RK to flash/write, the Key needs to be split into individual files containing one Key each. This can be achieved by entering 1 in the "Number of Keys per file" field during extraction, then clicking Extract to generate individual Key files. No conversion to the .skf format is required.

<!-- Source EN PDF p.10, block 71 -->

![Source technical figure — PDF 10](/docs/rockchip-rk3588-hdcp/assets/en-p10-figure1.png)

<!-- Source EN PDF p.10, block 72 -->

The device enters Loader mode, and the flashing tool selects the "hdcp1.4Hdmirx" and "RK3588" options. The RK3588 HDCP1.4 Key has added AES encryption, so "Do AES" is an optional feature. If unselected, only SEED encryption is applied. Selecting it will perform AES encryption on top of SEED encryption for enhanced security. Then import the above .skf file and click write to complete the Key flashing process.

<!-- Source EN PDF p.10, block 73 -->

Note: The tool automatically jumps to the next Key after completing one Key.

<!-- Source EN PDF p.11, block 74 -->

![Source technical figure — PDF 11](/docs/rockchip-rk3588-hdcp/assets/en-p11-figure1.png)

<!-- Source EN PDF p.11, block 75 -->

##### 3.1.2.2 Customer Self-developed Tool Flashing

<!-- Source EN PDF p.11, block 76 -->

You can develop your own application to invoke the libhdcp.so interface, encrypt the KEY, and flash-write to the Vendor Storage.

<!-- Source EN PDF p.11, block 77 -->

### 3.2 HDMITX

<!-- Source EN PDF p.11, block 78 -->

HDMI TX HDCP 1.4 does not require special configuration for dts, and the driver is registered by default.

<!-- Source EN PDF p.11, block 79 -->

To use normally, the KEY must first be split and converted. The tools and methods used are the same as those for HDMIRX, referring to Section 3.1.2.1.

<!-- Source EN PDF p.12, block 80 -->

![Source technical figure — PDF 12](/docs/rockchip-rk3588-hdcp/assets/en-p12-figure1.png)

<!-- Source EN PDF p.12, block 81 -->

Flashing the KEY uses the same tool as RX. The device enters Loader mode, then click "Settings" in the flashing tool and check the options: "hdcp1.4 Hdmitx", "RK3588", "Force Write", "Single Write". Afterwards, import the converted .skf file and click "Write" to complete the KEY flashing process.

<!-- Source EN PDF p.12, block 82 -->

Note: After completing a Key, the tool automatically jumps to the next Key.

<!-- Source EN PDF p.12, block 83 -->

### 3.3 DPTX

<!-- Source EN PDF p.12, block 84 -->

#### 3.3.1 dts Configuration

<!-- Source EN PDF p.12, block 85 -->

The DPTX driver natively supports HDCP1.4, and no additional dts configuration is required.

<!-- Source EN PDF p.12, block 86 -->

#### 3.3.2 Key Flashing

<!-- Source EN PDF p.12, block 87 -->

Key Splitting and Conversion Tool is consistent with HDMI RX, referring to Section 3.1.2.1.

<!-- Source EN PDF p.12, block 88 -->

The tools used for flashing the KEY are the same as those for HDMI RX. The device enters Loader mode. The flashing tool clicks Settings and selects the options "hdcp1.4 dp", "RK3588", "Force Write", and "Single Write". Then import the converted .skf file of the key and click Write to complete the flashing process. Additionally, similar as the RK3588 HDCP1.4 Key, AES encryption has been added, so the "Do AES" option is optional. If unselected, only SEED encryption is applied. If selected, AES encryption is performed on top of the SEED encryption.

<!-- Source EN PDF p.13, block 89 -->

![Source technical figure — PDF 13](/docs/rockchip-rk3588-hdcp/assets/en-p13-figure1.png)

<!-- Source EN PDF p.13, block 90 -->

## 4. HDCP2.3 Configuration and Description

<!-- Source EN PDF p.13, block 91 -->

### 4.1 HDMIRX

<!-- Source EN PDF p.13, block 92 -->

#### 4.1.1 dts Configuration

<!-- Source EN PDF p.13, block 93 -->

Enabling HDCP2.3 will also enable HDCP1.4 by default:

<!-- Source EN PDF p.13, block 94 -->

```text
&hdcp1 {
    status = "okay";
};
&hdmirx_ctrler {
    status = "okay";
    hdcp2x-enable;
};
```

<!-- Source EN PDF p.14, block 95 -->

#### 4.1.2 Packaging Firmware and Boot Services

<!-- Source EN PDF p.14, block 96 -->

Decompress DWC_HDCP2_BASE_ESM_Firmware into a Linux environment, then copy hdcp_receivers.bin to the root directory and tools/ directory. If HDMI TX support is also required, hdcp_transmitter.bin can be copied to the same directories as well.

<!-- Source EN PDF p.14, block 97 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.14, block 98 -->

Package Firmware and RX KEY, and execute the build_rockchip_fw.sh script

<!-- Source EN PDF p.14, block 99 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.14, block 100 -->

The packaging process will have several steps that prompt for input:

<!-- Source EN PDF p.14, block 101 -->

1\. Select the firmware type for packaging, choose: 1 -build firmware for both HDMIRX and HDMITX, generating the ./firmware/hdpc2_hdmi.fw firmware.

<!-- Source EN PDF p.14, block 102 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 1
```

<!-- Source EN PDF p.14, block 103 -->

2\. The number of RX KEYs to be created should be determined based on requirements, such as 10 or 100, etc. Generate individual KEYs and store them in the fw_hdcp_receivers_\*.bin file under the ./rxkeys/hdcpkeys?-?/ directory. If customers use their own tools for flashing, the fw_hdcp_receivers_\*.bin file can be directly flashed.

<!-- Source EN PDF p.14, block 104 -->

```text
Create Rx Key Number:
10
......
Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

<!-- Source EN PDF p.14, block 105 -->

3\. If RK’s tools are used to flash the KEY, the files must be packaged into a .skf format and stored in the ./rxkeys/hdcpkeys?-?/ directory. If RK’s tool is not needed for flashing, you can select 'n' here.

<!-- Source EN PDF p.14, block 106 -->

```text
Do want to pack these keys to .skf file? [y/n]:
y
10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

<!-- Source EN PDF p.14, block 107 -->

HDCP2.3 Receiver Key Flashing

<!-- Source EN PDF p.14, block 108 -->

1\. Place hdcp2_hdmi.fw into the device/rockchip/rk3588/ project directory, which will be copied to vendor/firmware/hdcp2_hdmi.fw during compilation.

<!-- Source EN PDF p.15, block 109 -->

2\. Use the RKDevInfoTool.exe tool, select HDCP2X_HDMIRX to import the generated hdcprxkeys1-10.skf, and enter Loader mode for flashing. After flashing one Key, the tool will automatically proceed to the next Key awaiting flashing.

<!-- Source EN PDF p.15, block 110 -->

3\. The HDCP2.3 Key does not require AES encryption, so only "RK3588" and "hdcp2x hdmirx" need to be selected here.

<!-- Source EN PDF p.15, block 111 -->

![Source technical figure — PDF 15](/docs/rockchip-rk3588-hdcp/assets/en-p15-figure1.png)

<!-- Source EN PDF p.15, block 112 -->

hdcp2_rx_tx service

<!-- Source EN PDF p.15, block 113 -->

Automatically load services at startup. If authentication exceptions occur, you can use logcat \| grep HDCP2 to view the corresponding logs.

<!-- Source EN PDF p.15, block 114 -->

### 4.2 HDMITX

<!-- Source EN PDF p.15, block 115 -->

#### 4.2.1 dts Configuration

<!-- Source EN PDF p.15, block 116 -->

The HDMITX and HDMIRX share a common HDCP module. Enabling HDCP 2.3 will also enable HDCP 1.4 by default:

<!-- Source EN PDF p.15, block 117 -->

```text
&hdcp1 {
    status = "okay";
};
```

<!-- Source EN PDF p.15, block 118 -->

Enabling HDMI refers to《Rockchip_Developer_Guide_HDMI_CN》.

<!-- Source EN PDF p.16, block 119 -->

#### 4.2.2 Packaging Firmware and Boot Services

<!-- Source EN PDF p.16, block 120 -->

Unzip DWC_HDCP2_BASE_ESM_Firmware into a Linux environment, then copy hdcp_transmitter.bin to the root directory and the tools/ directory. If HDMI RX support is also required, hdcp_receivers.bin should also be copied to the same directories.

<!-- Source EN PDF p.16, block 121 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.16, block 122 -->

Package Firmware and TX KEY, and execute build_rockchip_fw.sh script.

<!-- Source EN PDF p.16, block 123 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.16, block 124 -->

The packaging process will have several steps that prompt for input:

<!-- Source EN PDF p.16, block 125 -->

Select firmware type for packaging. If supporting both HDMI TX/RX, choose: 1 -build firmware for both HDMIRX and HDMITX. If supporting HDMITX only, choose: 2 -build firmware for HDMITX only. The final generated firmware will be ./firmware/hdpc2_hdmi.fw.

<!-- Source EN PDF p.16, block 126 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 2
```

<!-- Source EN PDF p.16, block 127 -->

hdcp2_rx_tx service

<!-- Source EN PDF p.16, block 128 -->

Automatically load services at startup. If authentication exceptions occur, you can use logcat \| grep HDCP2 to view the corresponding logs.

<!-- Source EN PDF p.16, block 129 -->

### 4.3 DPTX

<!-- Source EN PDF p.16, block 130 -->

#### 4.3.1 dts Configuration

<!-- Source EN PDF p.16, block 131 -->

DPTX uses the HDCP0 module to enable HDCP2.3 functionality:

<!-- Source EN PDF p.16, block 132 -->

```text
&hdcp0 {
    status = "okay";
};
```

<!-- Source EN PDF p.16, block 133 -->

Enabling HDCP2.3 will also enable HDCP1.4 by default.

<!-- Source EN PDF p.17, block 134 -->

#### 4.3.2 Packaging Firmware and Boot Services

<!-- Source EN PDF p.17, block 135 -->

Unzip DWC_HDCP2_BASE_ESM_Firmware to a Linux environment, then copy hdcp_transmitter.bin to the root directory and tools/ directory.

<!-- Source EN PDF p.17, block 136 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .
cp ../hdcp_receivers.bin tools/
```

<!-- Source EN PDF p.17, block 137 -->

Package Firmware and TX KEY, and execute build_rockchip_fw.sh script.

<!-- Source EN PDF p.17, block 138 -->

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

<!-- Source EN PDF p.17, block 139 -->

The packaging process will prompt for input:

<!-- Source EN PDF p.17, block 140 -->

Select the firmware packaging type: 3 - build firmware for DP, to generate ./firmware/hdpc2_dp.fw firmware.

<!-- Source EN PDF p.17, block 141 -->

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP
Choose the fw type: 3
```

<!-- Source EN PDF p.17, block 142 -->

For Android systems, to copy hdcp2_dp.fw to /vendor/firmware/hdcp2_dp.fw, the following patch can be added under hardware/rockchip/hdcp2:

<!-- Source EN PDF p.17, block 143 -->

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

<!-- Source EN PDF p.17, block 144 -->

Place hdcp2_dp.fw into the device/rockchip/rk3588/ project directory. It will be copied to /vendor/firmware/hdcp2_dp.fw during compilation.

<!-- Source EN PDF p.17, block 145 -->

For Linux systems, copy hdcp2_dp.fw to /system/etc/firmware/hdcp2_dp.fw.

<!-- Source EN PDF p.17, block 146 -->

hdcp2_rx_tx service

<!-- Source EN PDF p.18, block 147 -->

For Android systems, the following patches should be added under the hardware/rockchip/hdcp2:

<!-- Source EN PDF p.18, block 148 -->

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

<!-- Source EN PDF p.18, block 149 -->

The service can be automatically loaded at system startup. If authentication anomalies occur, you can use logcat \| grep HDCP2 to view the corresponding logs.

<!-- Source EN PDF p.18, block 150 -->

## 5. HDCP Status Check

<!-- Source EN PDF p.18, block 151 -->

### 5.1 HDMIRX

<!-- Source EN PDF p.18, block 152 -->

```text
cat /sys/class/misc/hdmirx_hdcp/status
```

<!-- Source EN PDF p.18, block 153 -->

```text
HDCP Disable: HDCP is not enabled
HDCP1.4: Authenticated start: during authentication process
HDCP1.4: Authentication success: Authentication successful
HDCP1.4: Authentication failed: Authentication failed
HDCP1.4: Unknown status: Unknown status
```

<!-- Source EN PDF p.18, block 154 -->

```text
HDCP Disable: HDCP is not enabled
HDCP2.3: Authentication success: Authentication successful
HDCP2.3: Authenticated failed: Authentication failed
HDCP2.3: No dectypted: Source end did not enable HDCP2.x
```

<!-- Source EN PDF p.18, block 155 -->

Source has not enabled HDCP encryption or has not connected to a signal source:

<!-- Source EN PDF p.19, block 156 -->

```text
HDCP2.3: No dectypted
HDCP1.4: Unknown status
```

<!-- Source EN PDF p.19, block 157 -->

### 5.2 HDMITX

<!-- Source EN PDF p.19, block 158 -->

The HDMITX status needs to be checked via the DRM PROPERTY. An example of viewing properties using the

<!-- Source EN PDF p.19, block 159 -->

modetest -c command:

<!-- Source EN PDF p.19, block 160 -->

```text
---------------------------------------------------------------------
Content Protection:
                flags: enum
                enums: Undesired=0 Desired=1 Enabled=2
                value: 2
Undesired: Disable HDCP.
Desired: Enable HDCP.
Enabled: HDCP has been enabled and authenticated successfully.
---------------------------------------------------------------------
HDCP Content Type:
                flags: enum
                enums: HDCP Type0=0 HDCP Type1=1
                value: 0
HDCP Type0: If either HDCP 1.4 or HDCP 2.3 authentication succeeds at any level, normal
video output is permitted.
HDCP Type1: Must be successfully authenticated with HDCP2.3 to output a normal display.
Note: The current version of the driver does not actually support this feature. By default,
any level of successful authentication can output normally, so no configuration is required.
---------------------------------------------------------------------
hdcp_encrypted:
                flags: range
                values: 0 2
                value: 2
HDCP Authentication Level:
    0: HDCP unauthorized.
    1: hdcp1.4.
    2: hdcp2.3.
---------------------------------------------------------------------
```

<!-- Source EN PDF p.19, block 161 -->

### 5.3 DPTX

<!-- Source EN PDF p.19, block 162 -->

The viewing method is the same as HDMITX.

<!-- Source EN PDF p.20, block 163 -->

## 6. Common Issues Analysis

<!-- Source EN PDF p.20, block 164 -->

### 6.1 hdcp2_tx_rx Initialization Failure

<!-- Source EN PDF p.20, block 165 -->

View log:

<!-- Source EN PDF p.20, block 166 -->

```text
logcat | grep HDCP
```

<!-- Source EN PDF p.20, block 167 -->

```text
Failed to open firmware file [vendor/firmware/hdcp2_hdmi.fw] // indicating the firmware was
not imported
```

<!-- Source EN PDF p.20, block 168 -->

```text
Failed to open firmware driver /dev/hl_dev1 // indicating the hdcp driver is not loaded. The
DTS needs to enable the corresponding hdcp1 node.
```

<!-- Source EN PDF p.20, block 169 -->

```text
07-14 10:53:17.033 2042 2042 D HDCP2 : hdcp2 version v3.0
07-14 10:53:17.033 2042 2042 D HDCP2 : HDCP Port: 1
07-14 10:53:17.034 2042 2042 D HDCP2 : Firmware: [1]
07-14 10:53:17.034 2042 2042 D HDCP2 : 223664 bytes
07-14 10:53:17.034 2042 2042 D HDCP2 : check rx key ok
07-14 10:53:17.034 2042 2042 D HDCP2 : rxkey read from vendor success, rxkey_len = 1000
07-14 10:53:17.034 2042 2042 D HDCP2 : Host Library version V0201
07-14 10:53:17.035 2042 2042 D HDCP2 : Exiting with err=1
```

<!-- Source EN PDF p.20, block 170 -->

If the program exits directly without any error messages, you can manually execute it to check the corresponding error:

<!-- Source EN PDF p.20, block 171 -->

```text
console:/ # ./vendor/bin/hdcp2_tx_rx 1 &
[1] 2799
console:/ # device name = /dev/hl_dev1
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1199] [PID:2799] hlInst->driver->instance [0xee2401d0]
<INFO> [external/hdcp/host_library/core_lib/host_lib_core.c:1200] [PID:2799] hlInst->driver
[0xff8088f0:223664]
<WARN> [external/hdcp/host_library/core_lib/host_lib_core.c:1206] [PID:2799] Error in
file:external/hdcp/host_library/core_lib/host_lib_core.c, functio]
<ERROR> [external/hdcp/host_library/core_lib/host_lib_core.c:137] [PID:2799]
hostlib_init_mem failed
Failed HLC_Initialize, error -6
The logs of this type are caused by firmware packaging issues, which may be due to incorrect
KEY, improper DUK/PKf configuration, or incorrect packaging method. Refer to [HDCP 2.3
Firmware Packaging Instruction].
```

<!-- Source EN PDF p.20, block 172 -->

```text
HLC_HDCPRX_LoadRxDwb failed // Indicates RX KEY is incorrect
```

<!-- Source EN PDF p.21, block 173 -->

### 6.2 HDMIRX Black Screen or Green Screen Unrecoverable After Unplug-and-Plug

<!-- Source EN PDF p.21, block 175 -->

First confirm whether the hdcp2x-enable in the dts is enabled. Check the value by running cat /sys/class/misc/hdmirx_hdcp/enable to see if it is set to 2.

<!-- Source EN PDF p.21, block 176 -->

If hdcp2x-enable is enabled, the hdcp2_tx_rx service must be loaded, otherwise, it may result in black screen or green screen. You can confirm this by executing logcat \| grep HDCP2 .

<!-- Source EN PDF p.21, block 177 -->

If hdcp2_tx_rx has already been loaded, it is necessary to confirm whether it exited abnormally. Also use logcat \| grep HDCP2 to verify.

<!-- Source EN PDF p.21, block 178 -->

echo 0 > /sys/class/misc/hdmirx_hdcp/enable resumes normal operation afterward, confirming the issue mentioned above.

<!-- Source EN PDF p.21, block 179 -->

### 6.3 Simultaneously enabling HDCP2.3 on HDMITX + HDMIRX, when unplugging RX, TX flashes a distorted screen

<!-- Source EN PDF p.21, block 180 -->

Because HDMIRX and HDMITX share the HDCP2.3 controller, unplugging RX during preview will reset the controller, causing an HDCP2.3 controller abnormality. Upon detecting the controller abnormality, hdcp2_tx_rx will reinitialize and perform re-authentication, resulting in a short screen artifact. It is recommended not to enable HDCP2.3 for both TX and RX simultaneously.

{% endraw %}

