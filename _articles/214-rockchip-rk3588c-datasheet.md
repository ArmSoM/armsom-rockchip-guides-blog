---
title: "Rockchip RK3588C datasheet: specifications, pins and electrical limits"
description: "Rockchip RK3588C datasheet: specifications, pins and electrical limits — Rev1.3"
excerpt: "Rockchip RK3588C datasheet: specifications, pins and electrical limits"
translation_key: "214-rockchip-rk3588c-datasheet"
slug: "214-rockchip-rk3588c-datasheet"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588C","datasheet"]
---

{% raw %}

# Rockchip RK3588C datasheet: specifications, pins and electrical limits

ArmSoM platform reference for RK3588C. Chip capabilities do not establish board compatibility: verify the actual device, schematic, rails and BSP. No hardware test was performed. Source figures and simulated thermal values are Rockchip material. No SDK/kernel version is specified. The sole supplied source is the English RK3588C Datasheet Rev1.3, dated 2024-12-12, 33 pages, stored in the CN directory; all figures are English originals.

## 1.1

RK3588C is a low-power, high-performance processor for NVR and edge-computing devices. It integrates four Cortex-A76 cores and four Cortex-A55 cores, each with a NEON coprocessor. Hardware engines accelerate demanding applications. Video decoding supports H.265 and VP9 at 8K@60fps, H.264 at 8K@30fps, and AV1 at 4K@60fps. H.264 and H.265 encoding supports 8K@30fps; high-quality JPEG encoding/decoding and dedicated image preprocessing and postprocessing are also integrated. The 3D GPU supports OpenGLES 1.1, 2.0 and 3.2, OpenCL up to 2.2, and Vulkan 1.2. A dedicated 2D engine with an MMU accelerates display operations.  The NPU supports mixed INT4/INT8/INT16/FP16 operations and up to 6 TOPS; models from TensorFlow, MXNet, PyTorch and Caffe can be converted. The four-channel external memory interface supports LPDDR4/LPDDR4X and demanding bandwidth requirements. A comprehensive peripheral interface set supports flexible applications.

## 1.2.1

Microprocessor. Four ARM Cortex-A76 MPCore and four ARM Cortex-A55 MPCore application processors combine high performance, low power and caches. DSU (DynamIQ Shared Unit) contains the L3 memory system, control logic and external interfaces for the DynamIQ cluster. The ARMv8-A instruction set is fully implemented, including ARM NEON Advanced SIMD for media/signal processing and ARMv8 Cryptography Extensions; TrustZone is supported. Each A76 has 64KB L1 instruction, 64KB L1 data and 512KB L2 cache; each A55 has 32KB L1 instruction, 32KB L1 data and 128KB L2 cache. All eight cores share 3MB L3. Eight independent power domains support internal power switches and externally controlled on/off operation for different applications: PD_CPU_0/1/2/3 correspond respectively to A55 cores 1/2/3/4, and PD_CPU_4/5/6/7 to A76 cores 1/2/3/4; each includes NEON, FPU and L1/L2 instruction/data caches. Three separate voltage domains support DVFS: A76_0+A76_1, A76_2+A76_3, and DSU+Cortex-A55.

## 1.2.2

Memory organization. On-chip BootROM boots through SPI, eMMC or SD/MMC and downloads system code through USB OTG. Shared memory is in VD_LOGIC; PMU SRAM in VD_PMU serves low-power applications. External dynamic memory complies with JEDEC LPDDR4/LPDDR4X, with four 16-bit channels, up to two ranks/chip selects per channel and up to 32GB total address space. SDRAM supports power-down and self-refresh. The eMMC interface fully complies with JEDEC eMMC 5.1/5.0 and is backward-compatible with 4.51 and earlier; HS400, HS200, DDR50 and legacy modes use 1-, 4- or 8-bit buses. SD/MMC supports SD3.0 and MMC 4.51 with a 4-bit bus. FSPI transfers data to/from serial flash using 1-, 2- or 4-bit buses and two chip selects.

## 1.2.3

System components. Three Cortex-M0 MCUs are integrated: VD_PMU has 16KB cache+16KB TCM, VD_NPU has 16KB cache+64KB TCM, and PD_CENTER has 32KB TCM. Their programmable interrupt controller connects all CPU GIC IRQ lines also to PMU_M0 and DDR_M0; a JTAG debug controller is integrated. CRU generates clocks with 18 PLLs and one 24MHz oscillator input, gates individual components, and supports global and individual software reset. PMU offers configurable operating modes using frequency adjustment, automatic clock gating and power-domain switching, multiple wake sources, 10 separate voltage domains and 45 software-switchable power domains. There are 12 secure and 18 non-secure timers, each with a 64-bit counter, interrupt operation, free-running/user-defined counting and readable working state. Sixteen PWMs (PWM0–PWM15) support interrupts, programmable bus-clock prescaling followed by further division, 32-bit timers/counters, capture, continuous/one-shot and reference modes and variable-duty waveforms. PWM3/7/11/15 are optimized for infrared. Five watchdogs serve CPU/MCU; each 32-bit counter counts a preset value down to zero. Timeout either resets immediately or first interrupts, then resets on a second timeout if software has not cleared it. The interrupt controller accepts 12 PPI and 480 SPI sources and 16 software-triggered interrupts; fixed polarity is high-level for SPI and low-level for PPI, with software-programmable priority per source. Three microcode-programmed DMACs support linked-list scatter/gather and memory-to-memory, memory-to-peripheral and peripheral-to-memory transfers. Each has 8 channels, 32 peripheral hardware requests, 2 interrupt outputs and TrustZone with per-channel programmable security. Two cipher engines support LLI DMA; hardware-padded SHA-1, SHA-256/224, SHA-512/384, MD5 and SM3; hardware-padded HMAC using SHA-1/SHA-256/SHA-512/MD5/SM3; AES-128/192/256 encryption/decryption; AES and SM4 modes ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC; DES/TDES in ECB/CBC/OFB/CFB; RSA/ECC/SM2 PKA operations up to 4096 bits; and random-number generation. Security includes key ladders, scrambling for all DDR types, secure OTP/debug/DFT/OS, and software-selectable secure/non-secure modes for non-CPU masters. Some slaves accept secure masters only, others accept either class as programmed. Part of shared SRAM is secure-only. External DDR divides into 16 regions with programmable access by each master. Three mailboxes connect CPU and MCU; each contains four elements comprising a data word, command-word register and interrupt flag. There are 32 software lock registers indicating occupancy. Hardware decompresses GZIP, LZ4 (general and legacy frame formats), DEFLATE and ZLIB, verifies LZ4 Hash32, and limits decompressed output size to prevent malicious memory destruction.

## 1.2.4

Video codec. Real-time decoding supports MPEG-1/2/4, H.263, H.264, H.265, VC-1, VP9, VP8, MVC and AV1, with an embedded MMU and parallel multichannel decoding at lower resolutions. The following capability tuples retain the source profile, level, resolution and rate, including the source marker ②. H.265/H.264 real-time encoding supports up to 8K@30fps and parallel multichannel operation at lower resolutions.

| Codec | Format | Resolution |  |
| --- | --- | --- | --- |
| H.264 AVC/MVC Main10 L6.0 | 8K@30fps | 7680x4320 | ② |
| VP9 Profile0/2 L6.1 | 8K@60fps | 7680x4320 |  |
| H.265 HEVC/MVC Main10 L6.1 | 8K@60fps | 7680x4320 |  |
| AVS2 Profile0/2 L10.2.6 | 8K@60fps | 7680x4320 |  |
| AV1 Main Profile 8/10bit L5.3 | 4K@60fps | 3840x2160 |  |
| MPEG-2 MP | 1080p@60fps | 1920x1088 |  |
| MPEG-1 MP | 1080p@60fps | 1920x1088 |  |
| VC-1 AP level 3 | 1080p@60fps | 1920x1088 |  |
| VP8 version2 | 1080p@60fps | 1920x1088 |  |

## 1.2.5

JPEG codec. Encoding uses baseline sequential DCT, sizes 96x96–8192x8192 (67Mpixels), up to 90 million pixels/s and four encoder units. Decoding accepts 48x48–65536x65536, YUV400/YUV411/YUV420/YUV422/YUV440/YUV444 and MJPEG, up to 1080P@280fps and 560 million pixels/s. The source also says 'four encoder units' under the decoder heading; that wording is retained as a source inconsistency, not silently corrected.

## 1.2.6

Neural processing unit. The accelerator reaches up to 6 TOPS. Three NPU cores operate together as three, as two, or independently. Supported arithmetic is integer 4/8/16, float16, Bfloat16 and tf32. Internal buffering is 384KBx3. Multiple tasks and scenarios run in parallel. Supported frameworks include TensorFlow, Caffe, Tflite, Pytorch, Onnx NN and Android NN. One separate voltage domain supports DVFS.

## 1.2.7

Graphics engine. The ARM Mali-G610 MP4 3D engine supports OpenGLES 1.1/2.0/3.2, OpenCL 2.2 and Vulkan 1.2. Four shader cores share a hierarchical tiler; MMU and 4x256KB L2 cache are included. It uses Valhall, AFBC 1.3, Serial Wire debugging for its embedded MCU and a separate DVFS voltage domain. The 2D engine accepts ARGB/RGB888/RGB565/YUV420/YUV422/BPP and outputs ARGB/RGB888/RGB565/YUV420/YUV422; maximum source/destination sizes are 8192x8192/4096x4096. It supports block transfer, transparency, gradient/pattern fills, global and per-pixel alpha (color and alpha channels separately), fading, arbitrary noninteger scaling from 1/8 to 8, rotations 0/90/180/270 degrees, X/Y mirroring with rotation, ROP2/ROP3/ROP4 and 4k/64k-page MMU. The image-enhancement processor accepts planar/semi-planar YUV420/YUV422 with UV swapping; outputs semi-planar YUV420/YUV422 with UV swapping and tile mode; downsamples YUV422 to YUV420; handles moving images up to 1920x1080 and deinterlaces.

## 1.2.8

Video input. One 8/10/12/16-bit standard DVP interface accepts up to 150MHz, supports BT.601/BT.656/BT.1120, and has configurable pixel_clk/hsync/vsync polarity.

## 1.2.9

Display interfaces. One HDMI2.1 TX supports x3/x4 FRL, backward compatibility with HDMI2.1 TMDS and earlier specifications, FRL rates 3/6/8/10/12Gbps, up to 7680x4320@60Hz, RGB/YUV up to 10bit, DSC1.2a and HDCP2.3. One HDMI2.0/eDP1.4 TX combo permits either HDMI or eDP at a time. eDP supports x1/x2/x4 and 1.62/2.7/5.4Gbps. HDMI reaches 4096x2160@60Hz with RGB/YUV up to 10bit, DSC1.2a and HDCP2.3; eDP reaches 4K@60Hz with RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 bits per component and HDCP1.3. HDMI timing should follow CTA-861; nonstandard HSYNC/HBP/HFP should align to 4 pixels. One DP TX1.4a combines with USB3.1 Gen1, supports 1/2/4 lanes, 1.62/2.7/5.4/8.1Gbps, up to 7680x4320@30Hz, RGB/YUV up to 10bit, SST, Type-C DP Alt Mode and HDCP2.3/1.3. DP timing should follow CTA-861; nonstandard HSYNC/HBP/HFP minimum is 16 pixels. BT.1120 output reaches 1920x1080@60Hz and 150MHz.

## 1.2.10

Video output processor. Maximum outputs: Video Port0 7680x4320@60Hz; Port1 and Port2 each 4096x4320@60Hz; Port3 2048x1080@60Hz. Cluster0/1/2/3 each support 4096x4320 input/output, AFBCD, RGB/YUV/YUYV, scaling 4–1/4 and rotation. ESMART0/1/2/3 each support 4096x4320 input/output, RGB/YUV/YUYV, scaling 8–1/8 and four regions. Overlay combines up to eight layers (four clusters+four ESMART) in RGB or YUV. Postprocessing supports HDR10/HLG, HDR2SDR/SDR2HDR and 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Writeback uses ARGB8888/RGB888/RGB565/YUV420 up to 1920x1080. VOP timing requires HACTIVE aligned to 4 pixels. In split mode, MIPI dual-channel mode or YUV420, POST HSYNC/HBP/HFP must align to 2 pixels. MIPI DSC video mode requires POST HSYNC/HBP/HFP at least 16 pixels and DSC_SYS_CTRL HSYNC/HBP/HFP at least 8 pixels.

## 1.2.11

Audio interfaces. Four-channel I2S0 supports up to 4 TX or 4 RX channels; I2S1 supports up to 8 TX and 8 RX channels. Both use 16–32-bit resolution, up to 192kHz, software-selectable master/slave, I2S normal/left-/right-justified, PCM early/late1/late2/late3 and TDM normal, half-cycle/one-cycle/two-cycle left shift or right shift. I2S/PCM/TDM cannot operate simultaneously. I2S2/I2S3 each support 2 TX and 2 RX channels, 16–32 bits, up to 192kHz, programmable master/slave, the same three I2S and four PCM formats; I2S and PCM cannot run simultaneously. SPDIF0/1 pack two 16-bit samples into one 32-bit location, output biphase stereo, align 16–31-bit data left/right in 32-bit buffers, transfer linear PCM at 16/20/24 bits and support nonlinear PCM. PDM0/1 offer up to 8 channels, 16–24-bit resolution, up to 192kHz and master receive mode. The digital audio codec has two digital DAC channels, I2S/PCM master/slave, 16-bit sampling, three mixing modes per DAC channel and volume control. VAD reads I2S/PDM voice data, detects amplitude, stores microphone-array data and supports a combined level interrupt.

## 1.2.12

Connectivity. SDIO supports SDIO3.0 with a 4-bit bus. Two GMACs support RGMII at 10/100/1000Mbps and RMII at 10/100Mbps, full or half duplex. USB3.1 Gen1 (equivalent to USB3.2 Gen1 and USB3.0) reaches 5Gbps. One OTG interface, USB3OTG_0, combines with DP TX; one Host interface, USB3OTG_2, combines with PIPE PHY2. Compliance: USB3.0 revision1.0, USB2.0 except USB3OTG_2, and xHCI1.1. Transfers include control, bulk with streams, interrupt and isochronous; simultaneous IN/OUT is supported. Descriptor caching and data prefetch improve high-latency-system performance. Power management supports USB2.0 LPM except on USB3OTG_2 and USB3.1 U0/U1/U2/U3. Device functions provide up to 10 IN and 6 OUT endpoints, each count including control endpoint0; up to 16 transfer resources, one per endpoint; flexible endpoint configuration for applications/USB set-configuration modes; hardware ERDY and burst handling; stream-based bulk endpoints with automatic controller data movement; isochronous endpoints using data buffers; and flexible descriptors supporting buffer-interrupt moderation, multiple transfers, isochronous/control transfers and scattered buffering. xHCI host supports up to 64 devices, one interrupter, one USB2.0 port except USB3OTG_2, one SuperSpeed port and standard/open-source xHCI/class drivers. DRD features include static device/host operation and ID-based USB3.1/USB2.0 OTG A/B operation; USB3OTG_2 supports USB3.1 Gen1 only. SRP, HNP and RSP are not supported. USB2.0 PHY supports battery-charge detection; USB3OTG_0 support Type-C/DP Alt Mode; USB3OTG_2 PHY shares PCIe/SATA. Two USB2.0 hosts comply with USB2.0, support high/full/low speeds 480/12/1.5Mbps and EHCI1.0/OHCI1.0a. Three Combo PIPE PHYs support PCIe2.1/SATA3.0/USB3.1 controllers: PHY0 and PHY1 each select SATA or PCIe2.1; PHY2 selects SATA, PCIe2.1 or USB3.1 Gen1. Each PCIe2.1 interface has one lane at 5Gbps, follows PCI Express Base2.1 and supports Root Complex only. Each SATA interface has one 6Gbps port, supports eSATA and complies with Serial ATA3.1/AHCI1.3.1. PCIe3.0 follows Base3.0, supports RC/EP, rates 2.5Gbps (1.1), 5Gbps (2.1) and 8Gbps (3.0; source prints 8Gps), and aggregation/bifurcation as 1x2 or 2x1 lanes. Five SPI controllers (SPI0–SPI4) provide two chip-select outputs and software-selectable serial master/slave operation. Nine I2C masters I2C0–I2C8 support 7/10-bit addressing and programmable clocks up to 100kbit/s Standard-mode or 400kbit/s Fast-mode. Ten UARTs UART0–UART9 each have separate 64-byte TX/RX FIFOs, 5/6/7/8-bit transmit/receive, standard start/stop/parity, selectable input clocks for up to 4Mbps and automatic flow control on all UARTs. Separate USB2.0 OTG supports USB2.0 (source excludes USB3OTG_2), xHCI1.1, control/bulk including streams/interrupt/isochronous transfers, descriptor caching, data prefetch and battery-charge detection. It offers static device/host and ID-based OTG A/B roles, without SRP/HNP/RSP; up to 10 IN and 6 OUT endpoints including endpoint0, 16 transfer resources, flexible configuration, and an xHCI host with 64 devices, one interrupter and one USB2.0 port.

## 1.2.13

Other features. Multiple GPIO groups support interrupts on every GPIO, level/edge triggering, configurable level polarity, rising/falling/both edges, selectable weak pull-up/pull-down and drive strength. TS-ADC supports user-defined and automatic modes. In user-defined mode start_of_conversion is fully software-controlled or hardware-generated. Automatic mode provides programmable high/low alarm interrupt thresholds and system-reset temperature. Seven TS-ADC channels have independently configurable temperature criteria; range is −40–125°C, resolution 1°C. SARADC has 12-bit resolution, up to 1MS/s and four single-ended inputs. OTP offers 32Kbit, with the higher 4k address space non-secure (source terminology retained). Secure mode supports read and program word masks; programming is at most 32 bits, reads at most 16 words; read/program status is readable and failed-program addresses are recorded. Package: FCCSP766L, body 17mm x 19mm, ball diameter 0.3mm, pitch 0.6mm & 0.65mm.

## 1.3 Block diagram

![1-1. Block diagram (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-1-1.png)

1-1. Block diagram (English original).

The diagram additionally labels 1MB shared memory, six PVTM units, two SPDIF units marked 8ch, system registers and embedded SRAM/ROM/OTP. It says six SPI units and eDP1.3, while the text says five SPI controllers and eDP1.4; these source contradictions remain explicit. SD3.0/MMC4.5 in the diagram differs from MMC4.51 in the text.

## 2. Package

### 2.1 Ordering

RK3588C: RoHS, ED-FCCSP 17x19 766L, 840PCS by tray, application processor.

### 2.2 Markings

Rockchip is the brand; RKXXXX the chip name; ABC the subcontractor code; XXXXXX the die lot; YYWW the date code; NXXXXXX FXX the OSAT sub-lot. The corner mark identifies the first pin.

![2-1. Package markings (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-1.png)

2-1. Package markings (English original).

![2-2. Package top view (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-2.png)

2-2. Package top view (English original).

### 2.3 Dimensions

![2-3. Package bottom view (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-3.png)

2-3. Package bottom view (English original).

![2-4. Package side view (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-4.png)

2-4. Package side view (English original).

![2-5. Package dimensions (English original).](/docs/rockchip-rk3588c-datasheet/images/figure-2-5.png)

2-5. Package dimensions (English original).

| Symbol | Min mm | Typ mm | Max mm | Min inch | Typ inch | Max inch |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.04 | 1.150 | 1.221 | 0.041 | 0.045 | 0.048 |
| A1 | 0.160 | 0.210 | 0.260 | 0.006 | 0.008 | 0.010 |
| A2 | 0.860 | 0.940 | 0.990 | 0.034 | 0.037 | 0.039 |
| A3 | 0.570 | 0.600 | 0.630 | 0.022 | 0.024 | 0.025 |
| c | 0.300 | 0.340 | 0.380 | 0.012 | 0.013 | 0.015 |
| D | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| E | 18.900 | 19.000 | 19.100 | 0.744 | 0.748 | 0.752 |
| D1 | — | 16.200 | — | — | 0.638 | — |
| E1 | — | 18.000 | — | — | 0.709 | — |
| e1 | — | 0.600 | — | — | 0.024 | — |
| e2 | — | 0.650 | — | — | 0.026 | — |
| b | 0.260 | 0.310 | 0.360 | 0.010 | 0.012 | 0.014 |

Unsplit tolerances (mm/inch): aaa 0.150/0.006; ccc 0.200/0.008; ddd 0.150/0.006; eee 0.150/0.006; fff 0.080/0.003. Typ corresponds to source NOM.

### 2.4–2.5

Moisture sensitivity MSL3; lead finish/ball material SnAgCu.

### 2.6 Complete pin table

| Pin Name | Pin | Pin Name | Pin |
| --- | --- | --- | --- |
| VSS_1 | A1 | RFU3 | F22 |
| DDR_CH1_DQ10_C | A2 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/GPIO1_D1 | F23 |
| DDR_CH1_DQ8_C | A3 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3 | F24 |
| DDR_CH1_DQ14_C | A4 | VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2 | F25 |
| DDR_CH1_DQ12_C | A5 | VSS_40 | F26 |
| DDR_CH1_DM0_C | A6 | PCIE30_PORT0_TX0N | F27 |
| DDR_CH1_DQ5_C | A7 | PCIE30_PORT0_TX0P | F28 |
| DDR_CH1_DQ0_C | A8 | VSS_39 | F21 |
| DDR_CH1_DQ2_C | A9 | DDR_CH0_DQ13_B | G1 |
| VSS_2 | A10 | DDR_CH0_DQ14_B | G2 |
| DDR_CH1_A2_D | A13 | VSS_41 | G3 |
| DDR_CH1_DQ2_D | A15 | DDR_CH0_DQS1N_B | G5 |
| DDR_CH1_DQ0_D | A16 | VSS_42 | G6 |
| DDR_CH1_DQ12_D | A17 | VSS_43 | G7 |
| DDR_CH1_DQ14_D | A18 | DDR_CH1_A2_C | G8 |
| DDR_CH1_DQ8_D | A19 | VSS_44 | G9 |
| DDR_CH1_DQ10_D | A20 | VSS_45 | G10 |
| DDR_CH1_DM0_D | A21 | DDR_CH1_A5_C | G11 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7 | A23 | VSS_46 | G12 |
| I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7 | A25 | VSS_47 | G13 |
| I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6 | A26 | DDR_CH1_A1_D | G14 |
| SPDIF0_TX_M0/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6 | A27 | VSS_48 | G15 |
| VSS_3 | A28 | VSS_49 | G16 |
| DDR_CH0_DQ9_A | AA1 | DDR_CH1_LP4/4X_CS0_D | G17 |
| DDR_CH0_DQ8_A | AA2 | VSS_50 | G18 |
| VSS_117 | AA3 | VSS_51 | G19 |
| VSS_118 | AA4 | DDR_CH1_DQ6_D | G20 |
| DDR_CH0_DQ13_A | AA5 | RFU1 | G21 |
| DDR_CH0_DQ12_A | AA6 | RFU4 | G22 |
| VSS_119 | AA7 | VSS_52 | G23 |
| VSS_120 | AA8 | VSS_53 | G24 |
| VSS_121 | AA21 | VSS_54 | G25 |
| VCCIO5_1V8 | AA22 | VSS_55 | G26 |
| GMAC1_MDC/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2 | AA23 | PCIE30_PORT0_RX1N | G27 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3 | AA24 | PCIE30_PORT0_RX1P | G28 |
| EMMC_CLKOUT/GPIO2_A1 | AA25 | DDR_CH0_DQ7_B | H1 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3 | AA26 | DDR_CH0_DQ12_B | H2 |
| EMMC_D7/FSPI_CS1N_M0/GPIO2_D7 | AA27 | VSS_56 | H3 |
| I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5 | AA28 | DDR_CH0_DQS0P_B | H4 |
| DDR_CH0_DM1_A | AB1 | DDR_CH0_DQS0N_B | H5 |
| DDR_CH0_DQ11_A | AB2 | VSS_57 | H6 |
| VSS_122 | AB3 | VSS_58 | H7 |
| VSS_123 | AB5 | DDR_CH1_ZQ_C | H8 |
| AVSS_2 | AB8 | VSS_59 | H9 |
| VCCIO3_1V8 | AB21 | VSS_60 | H10 |
| EMMC_D6/FSPI_CS0N_M0/GPIO2_D6 | AB26 | VSS_61 | H11 |
| EMMC_D2/FSPI_D2_M0/GPIO2_D2 | AB27 | VSS_62 | H12 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | H13 |
| VSS_124 | AC2 | VSS_64 | H14 |
| VSS_125 | AC3 | VSS_65 | H15 |
| DDR_CH0_DQS1N_A | AC4 | VSS_66 | H16 |
| DDR_CH0_DQS1P_A | AC5 | VSS_67 | H17 |
| VSS_126 | AC6 | VSS_68 | H18 |
| AVSS_3 | AC7 | DDR_CH1_ZQ_D | H19 |
| HDMI_TX0_VDD_0V75 | AC8 | VSS_69 | H20 |
| VCCIO6_1V8 | AC21 | VSS_70 | H21 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3 | AC22 | VSS_71 | H22 |
| EMMC_CMD/FSPI_CLK_M0/GPIO2_A0 | AC23 | VSS_72 | H23 |
| VSS_127 | AC24 | PCIE30_PORT0_REF_CLKP | H24 |
| EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2 | AC25 | PCIE30_PORT0_REF_CLKN | H25 |
| EMMC_D1/FSPI_D1_M0/GPIO2_D1 | AC26 | VSS_73 | H26 |
| EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4 | AC27 | PCIE30_PORT0_RX0N | H27 |
| EMMC_D0/FSPI_D0_M0/GPIO2_D0 | AC28 | PCIE30_PORT0_RX0P | H28 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0 | AD2 | DDR_CH0_DQ1_B | J1 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1 | AD3 | DDR_CH0_DQ0_B | J2 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4 | AD4 | DDR_CH0_DQ2_B | J3 |
| VSS_128 | AD5 | VSS_74 | J4 |
| VSS_129 | AD6 | DDR_CH0_LP4/4X_CS0_B | J5 |
| AVSS_4 | AD7 | VSS_75 | J6 |
| HDMI_TX0_VDD_IO_1V8 | AD8 | DDR_CH0_ZQ_B | J7 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | J8 |
| HDMI/eDP_TX1_AVDD_0V75 | AD10 | VSS_77 | J21 |
| VSS_130 | AD11 | PCIE30_PORT0_RESREF | J22 |
| VSS_131 | AD12 | AVSS1_1 | J23 |
| VDD_GPU_9 | AD13 | PCIE20_2_REFCLKP | J24 |
| VDD_GPU_10 | AD14 | PCIE20_2_REFCLKN | J25 |
| VSS_132 | AD15 | AVSS1_2 | J26 |
| VSS_133 | AD16 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | J27 |
| VSS_134 | AD17 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | J28 |
| VSS_135 | AD18 | DDR_CH0_DQ3_B | K2 |
| VSS_136 | AD19 | VSS_78 | K3 |
| VSS_137 | AD20 | VSS_79 | K5 |
| VSS_138 | AD21 | VSS_80 | K7 |
| VSS_139 | AD22 | DDR_CH01_VDDQ_CKE | K8 |
| VSS_140 | AD23 | VSS_81 | K21 |
| RFU8 | AD24 | PCIE30_PORT0_AVDD0V75 | K22 |
| GMAC0_TXD2/SDIO_D3_M0/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1 | AD25 | AVSS1_3 | K23 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3 | AD26 | AVSS1_4 | K24 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5 | AD27 | AVSS1_5 | K25 |
| HDMI_TX0_D3N | AE1 | AVSS1_6 | K26 |
| AVSS_5 | AE2 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | K27 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5 | AE3 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | K28 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3 | AE4 | DDR_CH0_CKB_B | L1 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2 | AE5 | DDR_CH0_CK_B | L2 |
| AVSS_6 | AE6 | VSS_82 | L3 |
| AVSS_7 | AE7 | DDR_CH0_A3_B | L4 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AE8 | DDR_CH0_A2_B | L5 |
| HDMI_TX0_VDD_CMN_1V8 | AE10 | VSS_83 | L6 |
| VSS_141 | AE11 | DDR_CH0_LP4/4X_CS1_B | L7 |
| VSS_142 | AE12 | VSS_84 | L8 |
| VSS_143 | AE13 | PCIE30_PORT0_AVDD1V8 | L21 |
| VSS_144 | AE14 | PCIE20_SATA30_USB30_2_AVDD_0V85 | L22 |
| VSS_145 | AE15 | AVSS1_7 | L23 |
| VSS_146 | AE16 | PCIE20_1_REFCLKP | L24 |
| VDD_LOGIC_10 | AE17 | PCIE20_1_REFCLKN | L25 |
| VDD_LOGIC_11 | AE18 | AVSS1_8 | L26 |
| VDD_LOGIC_12 | AE19 | PCIE20_1_RXP/SATA30_1_RXP | L27 |
| VDD_LOGIC_13 | AE20 | PCIE20_1_RXN/SATA30_1_RXN | L28 |
| VSS_147 | AE21 | DDR_CH0_CKB_A | M1 |
| VSS_148 | AE22 | DDR_CH0_CK_A | M2 |
| RFU7 | AE23 | VSS_85 | M3 |
| GMAC0_RXD2/SDIO_D0_M0/UART6_RX_M0/GPIO2_A6 | AE24 | VSS_86 | M4 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2 | AE25 | DDR_CH0_A1_B | M5 |
| LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3 | AE26 | DDR_CH0_A0_B | M6 |
| I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/SATA_CPDET/GPIO0_D4 | AE27 | VSS_87 | M7 |
| I2S1_LRCK0_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7 | AE28 | VSS_88 | M8 |
| AVSS_8 | AF1 | PCIE20_SATA30_1_AVDD_1V8 | M21 |
| HDMI_TX0_D3P | AF2 | PCIE20_SATA30_1_AVDD_0V85 | M22 |
| AVSS_9 | AF3 | AVSS1_9 | M23 |
| AVSS_10 | AF4 | PCIE20_0_REFCLKP | M24 |
| AVSS_11 | AF5 | PCIE20_0_REFCLKN | M25 |
| AVSS_12 | AF6 | AVSS1_10 | M26 |
| AVSS_13 | AF7 | PCIE20_1_TXN/SATA30_1_TXN | M27 |
| AVSS_14 | AF8 | PCIE20_1_TXP/SATA30_1_TXP | M28 |
| AVSS_15 | AF9 | DDR_CH0_A4_A | N2 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AF10 | DDR_CH0_A5_A | N3 |
| USB20_AVDD_3V3 | AF11 | VSS_89 | N5 |
| AVSS_16 | AF12 | VSS_90 | N7 |
| AVSS_17 | AF13 | VSS_91 | N8 |
| AVSS_18 | AF14 | PCIE20_SATA30_0_AVDD_1V8 | N21 |
| TYPEC0_DP0_VDDH_1V8 | AF15 | PCIE20_SATA30_0_AVDD_0V85 | N22 |
| SARADC_AVDD_1V8 | AF17 | TVSS | N23 |
| VSS_149 | AF18 | AVSS1_11 | N24 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3 | AF20 | AVSS1_12 | N25 |
| VCCIO6 | AF21 | AVSS1_13 | N26 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4 | AF22 | PCIE20_0_TXP/SATA30_0_TXP | N27 |
| SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1 | AF23 | PCIE20_0_TXN/SATA30_0_TXN | N28 |
| GMAC0_RXCLK/SDIO_D2_M0/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0 | AF24 | VSS_92 | P2 |
| CIF_D15/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3 | AF25 | DDR_CH0_DQ3_A | P3 |
| I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7 | AF26 | DDR_CH0_A4_B | P4 |
| I2S1_LRCK1_M1/PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4 | AF27 | DDR_CH0_A5_B | P5 |
| HDMI_TX0_D0P | AG1 | VSS_93 | P6 |
| HDMI_TX0_D0N | AG2 | DDR_CH0_LP4/4X_CKE0_B | P7 |
| AVSS_19 | AG3 | VSS_94 | P8 |
| HDMI_TX0_REXT | AG4 | OSC_1V8 | P21 |
| HDMI_TX1_SBDN/EDP_TX1_AUXN | AG5 | VSS_95 | P22 |
| USB20_HOST0_REXT | AG6 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1 | P23 |
| AVSS_20 | AG7 | PMIC_SLEEP1/GPIO0_A2 | P24 |
| USB20_HOST0_DP | AG8 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6 | P25 |
| USB20_AVDD_1V8 | AG9 | AVSS1_14 | P26 |
| USB20_DVDD_0V75 | AG10 | PCIE20_0_RXN/SATA30_0_RXN | P27 |
| TYPEC0_USB20_VBUSDET | AG11 | PCIE20_0_RXP/SATA30_0_RXP | P28 |
| TYPEC0_USB20_OTG_ID | AG12 | DDR_CH0_DQ2_A | R1 |
| TYPEC0_DP0_VDD_0V85 | AG14 | DDR_CH0_DQ1_A | R2 |
| TYPEC0_DP0_VDDA_0V85 | AG15 | DDR_CH0_DQ5_A | R3 |
| AVSS_21 | AG17 | VSS_96 | R4 |
| BT1120_D11/PCIE30X4_WAKEN_M1/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5 | AG18 | DDR_CH0_LP4/4X_CKE1_A | R5 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0 | AG20 | DDR_CH0_LP4/4X_CKE1_B | R6 |
| BT1120_D12/PCIE30X4_PERSTN_M1/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6 | AG21 | VSS_97 | R7 |
| RFU6 | AG22 | VSS_98 | R8 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2 | AG23 | PMU_0V75 | R21 |
| GMAC0_TXCLK/SDIO_CLK_M0/I2C3_SDA_M3/GPIO2_B3 | AG24 | PMUIO2 | R22 |
| RFU5 | AG25 | PMIC_INT_L/GPIO0_A7 | R23 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0 | AG26 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3 | R24 |
| I2S1_SCLK0_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6 | AG27 | SDMMC_DET/GPIO0_A4 | R25 |
| I2S1_SCLK1_M1/PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0 | AG28 | VSS_99 | R26 |
| HDMI_TX0_D1P | AH1 | XOUT_24M | R27 |
| HDMI_TX0_D1N | AH2 | XIN_24M | R28 |
| AVSS_22 | AH3 | DDR_CH0_DQ4_A | T2 |
| HDMI/eDP_TX1_REXT | AH4 | VSS_100 | T3 |
| HDMI_TX1_SBDP/EDP_TX1_AUXP | AH5 | VSS_101 | T5 |
| USB20_HOST1_REXT | AH6 | VSS_102 | T7 |
| USB20_HOST0_DM | AH8 | VSS_103 | T8 |
| USB20_OTG1_REXT | AH9 | PMUIO1_1V8 | T21 |
| TYPEC0_USB20_OTG0_REXT | AH11 | REFCLK_OUT/GPIO0_A0 | T27 |
| TYPEC0_DP0_REXT | AH12 | DDR_CH0_DQS0N_A | U1 |
| SARADC_IN1 | AH14 | DDR_CH0_DQS0P_A | U2 |
| SARADC_IN3 | AH15 | VSS_104 | U3 |
| SARADC_IN2 | AH17 | DDR_CH0_LP4/4X_CKE0_A | U4 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4 | AH18 | DDR_CH0_A3_A | U5 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0 | AH20 | VSS_105 | U6 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1 | AH21 | DDR_CH0_A1_A | U7 |
| VSS_150 | AH22 | VSS_106 | U8 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0 | AH23 | PMUIO2_1V8 | U21 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1 | AH24 | VSS_107 | U22 |
| CIF_D14/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2 | AH25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/SPI3_MOSI_M2/HDMI_TX1_CEC_M1/GPIO0_D2 | U23 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4 | AH26 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0 | U24 |
| PMIC_SLEEP_3/GPIO0_C1 | AH27 | PMIC_SLEEP_5/GPIO0_C3 | U25 |
| HDMI_TX0_D2P | AJ1 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1 | U26 |
| HDMI_TX0_D2N | AJ2 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0 | U27 |
| AVSS_23 | AJ3 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5 | U28 |
| AVSS_24 | AJ4 | DDR_CH0_DQ0_A | V2 |
| AVSS_25 | AJ5 | DDR_CH0_DM0_A | V3 |
| AVSS_26 | AJ6 | VSS_108 | V4 |
| AVSS_27 | AJ7 | DDR_CH0_LP4/4X_CS1_A | V5 |
| AVSS_28 | AJ8 | DDR_CH0_LP4/4X_CS0_A | V6 |
| AVSS_29 | AJ9 | DDR_CH0_RESET_A | V7 |
| AVSS_30 | AJ10 | VSS_109 | V8 |
| AVSS_31 | AJ11 | VSS_110 | V21 |
| AVSS_32 | AJ12 | EMMCIO_1V8 | V22 |
| AVSS_33 | AJ14 | GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0 | V23 |
| SARADC_IN0_BOOT | AJ15 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6 | V24 |
| VSS_151 | AJ17 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6 | V25 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7 | AJ18 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5 | V26 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6 | AJ19 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2 | V27 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2 | AJ20 | DDR_CH0_DQ7_A | W1 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1 | AJ21 | DDR_CH0_DQ6_A | W2 |
| GMAC0_RXD3/SDIO_D1_M0/UART6_TX_M0/GPIO2_A7 | AJ22 | VSS_111 | W3 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2 | AJ23 | VSS_112 | W5 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7 | AJ24 | DDR_CH0_ZQ_A | W8 |
| GMAC1_PPSCLK/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1 | AJ25 | VSS_113 | W21 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7 | AJ26 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5 | W26 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2 | AJ27 | PMIC_SLEEP2/GPIO0_A3 | W27 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1 | AJ28 | NPOR | W28 |
| HDMI_TX1_D3N/EDP_TX1_D3N | AK1 | DDR_CH0_DQ14_A | Y1 |
| HDMI_TX1_D3P/EDP_TX1_D3P | AK2 | DDR_CH0_DQ15_A | Y2 |
| HDMI_TX1_D0P/EDP_TX1_D0P | AK3 | VSS_114 | Y3 |
| HDMI_TX1_D1P/EDP_TX1_D1P | AK4 | DDR_CH0_A2_A | Y4 |
| HDMI_TX1_D2P/EDP_TX1_D2P | AK5 | DDR_CH0_A0_A | Y5 |
| USB20_HOST1_DM | AK6 | VSS_115 | Y6 |
| USB20_OTG1_DM | AK7 | VSS_116 | Y7 |
| TYPEC0_USB20_OTG_DM | AK8 | VCCIO2_1V8 | Y8 |
| TYPEC0_SSRX1N/DP0_TX0N | AK9 | VCCIO5 | Y21 |
| TYPEC0_SSTX1P/DP0_TX1P | AK10 | CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4 | Y22 |
| TYPEC0_SBU1/DP0_AUXP | AK11 | GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6 | Y23 |
| TYPEC0_SSRX2N/DP0_TX2N | AK12 | GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3 | Y24 |
| TYPEC0_SSTX2P/DP0_TX3P | AK13 | ETH1_REFCLKO_25M/I2C4_SCL_M0/GPIO3_A6 | Y25 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5 | AK14 | PMIC_SLEEP_4/GPIO0_C2 | Y26 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4 | AK15 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/SPI0_CS0_M0/HDMI_TX0_CEC_M1/GPIO0_D1 | Y27 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3 | AK16 | DDR_CH0_VDDQ_0 | 1E1 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7 | AK17 | DDR_CH01_PLL_AVDD1V8 | 1E2 |
| GMAC0_RXDV_CRS/PWM2_M2/GPIO4_C2 | AK18 | VSS_175 | 1E3 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/GPIO4_C3 | AK19 | DDR_CH1_VDD_5 | 1E4 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7 | AK20 | VDD_LOGIC_0 | 1E5 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5 | AK21 | VSS_176 | 1E6 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1 | AK22 | VDD_CPU_BIG_3 | 1E7 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5 | AK23 | VDD_CPU_BIG_4 | 1E8 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6 | AK24 | VDD_CPU_BIG_5 | 1E9 |
| GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0 | AK25 | VDD_CPU_BIG_6 | 1E10 |
| GMAC1_RXD1/PWM9_M0/GPIO3_B0 | AK26 | PLL_AVDD1V8 | 1E11 |
| GMAC1_RXCLK/SDIO_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5 | AK27 | VSS_153 | 1A1 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4 | AK28 | VSS_154 | 1A2 |
| AVSS_34 | AL1 | VSS_155 | 1A3 |
| HDMI_TX1_D0N/EDP_TX1_D0N | AL2 | VSS_156 | 1A4 |
| HDMI_TX1_D1N/EDP_TX1_D1N | AL3 | VSS_157 | 1A5 |
| HDMI_TX1_D2N/EDP_TX1_D2N | AL4 | VSS_158 | 1A6 |
| AVSS_35 | AL5 | VSS_159 | 1A7 |
| USB20_HOST1_DP | AL6 | VSS_160 | 1A8 |
| USB20_OTG1_DP | AL7 | VSS_161 | 1A9 |
| TYPEC0_USB20_OTG_DP | AL8 | VSS_162 | 1A10 |
| TYPEC0_SSRX1P/DP0_TX0P | AL9 | VSS_163 | 1A11 |
| TYPEC0_SSTX1N/DP0_TX1N | AL10 | VSS_164 | 1B1 |
| TYPEC0_SBU2/DP0_AUXN | AL11 | DDR_CH1_VDDQ_0 | 1B2 |
| TYPEC0_SSRX2P/DP0_TX2P | AL12 | DDR_CH1_VDDQ_1 | 1B3 |
| TYPEC0_SSTX2N/DP0_TX3N | AL13 | DDR_CH1_VDDQ_2 | 1B4 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0 | AL14 | DDR_CH1_VDDQ_3 | 1B5 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6 | AL15 | DDR_CH1_VDDQ_4 | 1B6 |
| GMAC0_MDIO/UART9_CTSN_M0/PWM6_M2/GPIO4_C5 | AL16 | DDR_CH01_PLL_AVSS_2 | 1B7 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/GPIO4_C4 | AL18 | VSS_165 | 1B8 |
| HDMI_TX0_HPD_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4 | AL20 | VCCIO4 | 1B9 |
| GMAC1_MDIO/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3 | AL21 | VCCIO4_1V8 | 1B10 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5 | AL23 | VCCIO1_1V8 | 1B11 |
| GMAC1_RXDV_CRS/UART2_TX_M2/PWM2_M1/GPIO3_B1 | AL25 | VSS_166 | 1C1 |
| GMAC1_RXD0/PWM8_M0/GPIO3_A7 | AL26 | DDR_CH01_PLL_DVDD | 1C2 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2 | AL27 | DDR_CH1_VDD_0 | 1C3 |
| VSS_152 | AL28 | DDR_CH1_VDD_1 | 1C4 |
| DDR_CH0_DM0_B | B1 | DDR_CH1_VDD_2 | 1C5 |
| DDR_CH1_DQ11_C | B2 | DDR_CH1_VDD_3 | 1C6 |
| DDR_CH1_DQ9_C | B3 | DDR_CH1_VDDQ_CK | 1C7 |
| DDR_CH1_DQ15_C | B4 | VSS_167 | 1C8 |
| DDR_CH1_DQ13_C | B5 | VSS_168 | 1C9 |
| DDR_CH1_DQ7_C | B6 | VSS_169 | 1C10 |
| DDR_CH1_DQ6_C | B7 | VSS_170 | 1C11 |
| DDR_CH1_DQ4_C | B8 | DDR_CH0_VDDQ_CK | 1D1 |
| DDR_CH1_DQ3_C | B9 | DDR_CH01_PLL_AVSS_1 | 1D2 |
| DDR_CH1_CK_C | B10 | VSS_171 | 1D3 |
| VSS_4 | B11 | DDR_CH1_VDD_4 | 1D4 |
| DDR_CH1_CK_D | B12 | VSS_172 | 1D5 |
| DDR_CH1_A3_D | B13 | VSS_173 | 1D6 |
| DDR_CH1_A4_D | B14 | VSS_174 | 1D7 |
| DDR_CH1_DQ3_D | B15 | VDD_CPU_BIG_0 | 1D8 |
| DDR_CH1_DQ1_D | B16 | VDD_CPU_BIG_1 | 1D9 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_BIG_2 | 1D10 |
| DDR_CH1_DQ13_D | B18 | PCIE20_SATA30_USB30_2_AVDD_1V8 | 1D11 |
| DDR_CH1_DQ15_D | B19 | DDR_CH0_VDDQ_1 | 1F1 |
| DDR_CH1_DQ9_D | B20 | DDR_CH0_VDD_0 | 1F2 |
| DDR_CH1_DQ11_D | B21 | DDR_CH0_VDD_1 | 1F3 |
| VSS_5 | B22 | VSS_177 | 1F4 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4 | B23 | VDD_LOGIC_1 | 1F5 |
| PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4 | B24 | VSS_178 | 1F6 |
| SPDIF1_TX_M0/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7 | B25 | VDD_CPU_BIG_7 | 1F7 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6 | B26 | VDD_CPU_BIG_8 | 1F8 |
| PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2 | B27 | VDD_CPU_BIG_9 | 1F9 |
| PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1 | B28 | VDD_CPU_BIG_10 | 1F10 |
| DDR_CH0_DQ5_B | C1 | PLL_AVSS | 1F11 |
| DDR_CH0_DQ6_B | C2 | DDR_CH0_VDDQ_2 | 1G1 |
| VSS_6 | C3 | DDR_CH0_VDD_2 | 1G2 |
| VSS_7 | C4 | DDR_CH0_VDD_3 | 1G3 |
| VSS_8 | C5 | VSS_179 | 1G4 |
| VSS_9 | C6 | VDD_LOGIC_2 | 1G5 |
| VSS_10 | C7 | VSS_180 | 1G6 |
| VSS_11 | C8 | VSS_181 | 1G7 |
| DDR_CH1_DQ1_C | C9 | VSS_182 | 1G8 |
| DDR_CH1_CKB_C | C10 | VSS_183 | 1G9 |
| VSS_12 | C11 | VSS_184 | 1G10 |
| DDR_CH1_CKB_D | C12 | PLL_DVDD0V75 | 1G11 |
| DDR_CH1_A5_D | C13 | DDR_CH0_VDDQ_3 | 1H1 |
| VSS_13 | C14 | DDR_CH0_VDD_4 | 1H2 |
| VSS_14 | C15 | VSS_185 | 1H3 |
| VSS_15 | C17 | VSS_186 | 1H4 |
| VSS_16 | C18 | VDD_LOGIC_3 | 1H5 |
| VSS_17 | C20 | VSS_187 | 1H6 |
| DDR_CH1_DM1_D | C21 | VSS_188 | 1H7 |
| PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5 | C22 | VDD_CPU_LIT_0 | 1H8 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0 | C23 | VDD_CPU_LIT_1 | 1H9 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0 | C24 | VSS_189 | 1H10 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5 | C25 | VSS_190 | 1H11 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3 | C26 | DDR_CH0_VDDQ_4 | 1J1 |
| I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7 | C27 | DDR_CH0_VDD_5 | 1J2 |
| PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6 | C28 | VSS_191 | 1J3 |
| DDR_CH0_DQ11_B | D1 | VDD_LOGIC_4 | 1J4 |
| DDR_CH0_DQ4_B | D2 | VDD_LOGIC_5 | 1J5 |
| VSS_18 | D3 | VSS_192 | 1J6 |
| DDR_CH1_DM1_C | D5 | VDD_CPU_LIT_2 | 1J7 |
| DDR_CH1_DQS1N_C | D6 | VDD_CPU_LIT_3 | 1J8 |
| DDR_CH1_DQS0N_C | D8 | VDD_CPU_LIT_4 | 1J9 |
| VSS_19 | D9 | VDD_CPU_LIT_5 | 1J10 |
| DDR_CH1_LP4/4X_CS1_C | D11 | VSS_193 | 1J11 |
| VSS_20 | D12 | VSS_194 | 1K1 |
| DDR_CH1_LP4/4X_CKE0_C | D14 | VSS_195 | 1K2 |
| VSS_21 | D15 | VSS_196 | 1K3 |
| DDR_CH1_A0_D | D17 | VDD_LOGIC_6 | 1K4 |
| VSS_22 | D18 | VDD_LOGIC_7 | 1K5 |
| DDR_CH1_DQS0N_D | D20 | VDD_LOGIC_8 | 1K6 |
| DDR_CH1_DQS1N_D | D21 | VSS_197 | 1K7 |
| RFU0 | D22 | VSS_198 | 1K8 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1 | D23 | VSS_199 | 1K9 |
| I2S0_LRCK/UART4_RTSN/GPIO1_C5 | D24 | VSS_200 | 1K10 |
| I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0 | D25 | VSS_201 | 1K11 |
| I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3 | D26 | VCCIO2 | 1L1 |
| VSS_23 | D27 | VSS_202 | 1L2 |
| DDR_CH0_DQ9_B | E1 | VSS_203 | 1L3 |
| DDR_CH0_DQ10_B | E2 | VSS_204 | 1L4 |
| VSS_24 | E3 | VSS_205 | 1L5 |
| DDR_CH0_DM1_B | E4 | VDD_LOGIC_9 | 1L6 |
| DDR_CH1_DQS1P_C | E6 | VSS_206 | 1L7 |
| VSS_25 | E7 | VSS_207 | 1L8 |
| DDR_CH1_DQS0P_C | E8 | VDD_NPU_0 | 1L9 |
| DDR_CH1_A3_C | E9 | VDD_NPU_1 | 1L10 |
| VSS_26 | E10 | VSS_208 | 1L11 |
| DDR_CH1_LP4/4X_CS0_C | E11 | OTP_VDDOTP_0V75 | 1M1 |
| DDR_CH1_A1_C | E12 | VSS_209 | 1M2 |
| VSS_27 | E13 | VDD_GPU_0 | 1M3 |
| DDR_CH1_LP4/4X_CKE1_C | E14 | VDD_GPU_1 | 1M4 |
| DDR_CH1_LP4/4X_CKE0_D | E15 | VDD_GPU_2 | 1M5 |
| VSS_28 | E16 | VSS_210 | 1M6 |
| DDR_CH1_LP4/4X_CS1_D | E17 | VSS_211 | 1M7 |
| DDR_CH1_DQ5_D | E18 | VSS_212 | 1M8 |
| VSS_29 | E19 | VDD_NPU_2 | 1M9 |
| DDR_CH1_DQS0P_D | E20 | VDD_NPU_3 | 1M10 |
| DDR_CH1_DQS1P_D | E21 | VSS_213 | 1M11 |
| RFU2 | E22 | VSS_214 | 1N1 |
| I2S0_SDI0/GPIO1_D4 | E23 | VSS_215 | 1N2 |
| I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1 | E24 | VSS_216 | 1N3 |
| I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2 | E25 | VDD_GPU_3 | 1N4 |
| VSS_30 | E26 | VDD_GPU_4 | 1N5 |
| PCIE30_PORT0_TX1N | E27 | VDD_GPU_5 | 1N6 |
| PCIE30_PORT0_TX1P | E28 | VSS_217 | 1N7 |
| DDR_CH0_DQ15_B | F1 | VSS_218 | 1N8 |
| DDR_CH0_DQ8_B | F2 | VDD_NPU_4 | 1N9 |
| VSS_31 | F3 | VDD_NPU_5 | 1N10 |
| VSS_32 | F4 | VSS_219 | 1N11 |
| DDR_CH0_DQS1P_B | F5 | HDMI_TX0_AVDD_0V75 | 1P1 |
| VSS_33 | F7 | AVSS_1 | 1P2 |
| VSS_34 | F8 | VSS_220 | 1P3 |
| DDR_CH1_A4_C | F9 | VDD_GPU_6 | 1P4 |
| VSS_35 | F11 | VDD_GPU_7 | 1P5 |
| DDR_CH1_A0_C | F12 | VDD_GPU_8 | 1P6 |
| VSS_36 | F14 | VSS_221 | 1P7 |
| DDR_CH1_LP4/4X_CKE1_D | F15 | VSS_222 | 1P8 |
| VSS_37 | F17 | VSS_223 | 1P9 |
| DDR_CH1_DQ4_D | F18 | VSS_224 | 1P10 |
| VSS_38 | F20 | VSS_225 | 1P11 |

## 3. Electrical specifications

### 3.1 Absolute ratings

Exceeding absolute maximum/minimum ratings can permanently damage the chip; prolonged exposure to absolute maximum conditions can reduce reliability. These are not recommended operating limits.

| Parameters | Related Power Group | Min | Max | Unit |
| --- | --- | --- | --- | --- |
| Supply voltage for CPU | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Supply voltage for CPU memory | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Supply voltage for GPU | VDD_GPU | -0.3 | 1.1 | V |
| Supply voltage for GPU memory | VDD_GPU | -0.3 | 1.1 | V |
| Supply voltage for NPU | VDD_NPU | -0.3 | 1.1 | V |
| Supply voltage for NPU memory | VDD_NPU | -0.3 | 1.1 | V |
| Supply voltage for core logic, VCODEC and VCODEC Memory | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V supply voltage | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI_TX0_VDD_0V75 HDMI_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 PCIE30_PORT0_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V supply voltage | DDR_CH0_VDD DDR_CH1_VDD DDR_CH01_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.8V supply voltage | DDR_CH01_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 HDMI_TX0_VDD_CMN_1V8 HDMI_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V supply voltage | USB20_AVDD_3V3 | -0.5 | 3.63 | V |
| 1.8V only GPIO supply voltage | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| 1.8V/3.3V GPIO supply voltage | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Supply voltage for DDR IO (LPDDR4/4X 0.6V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Supply voltage for DDR IO (LPDDR4/4X 1.1V) | DDR_CH01_VDDQ_CKE | -0.3 | 1.25 | V |
| Storage Temperature | Tstg | -40 | 125 | ℃ |
| Max Conjunction Temperature | Tj | NA | 125 | ℃ |

### 3.2 Recommended operating conditions

| Parameters | Symbol | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- |
| Voltage for CPU BigCore 0/1 and Memory | VDD_CPU_BIG | 0.75 | 0.75 | 0.95 | V |
| Voltage for CPU LitCore, DSU and their Memory | VDD_CPU_LIT | 0.75 | 0.75 | 0.95 | V |
| Voltage for GPU and Memory | VDD_GPU | 0.75 | 0.75 | 0.85 | V |
| Voltage for NPU and Memory | VDD_NPU | 0.75 | 0.75 | 0.85 | V |
| Voltage for Logic, VCODEC and VCODEC Memory | VDD_LOGIC | 0.675 | 0.75 | 0.825 | V |
| Voltage for PMU | PMU_0V75 | 0.675 | 0.75 | 0.825 | V |
| Digital GPIO Power (1.8V only) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.95 | V |
| Digital GPIO Power (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| eMMC IO Power (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Logic power(0.85V) | DDR_CH0_VDD, DDR_CH1_VDD, | 0.675 | 0.85 | 0.935 | V |
| DDR CH01_PLL power(0.85V) | DDR_CH01_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
| DDR CH01_PLL power(1.8V) | DDR_CH01_PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| LPDDR4 IO VDDQ power | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 Retention IO VDDQ Power | DDR_CH01_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| PLL Analog Power(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Analog Power(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB 2.0 Analog Power (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Analog Power (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB 2.0 Analog Power (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Analog Power (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Analog Power (1.8V) | TYPEC0_DP0_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Analog Power(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Analog Power(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| PCIe30 Analog Power(0.75V) | PCIE30_PORT0_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Analog Power(1.8V) | PCIE30_PORT0_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI/eDP TX Digital Power (0.75V) | HDMI_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analog Power (0.75V) | HDMI_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analog Power (1.8V) | HDMI_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Analog Power (1.8V) | HDMI_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Analog Power(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Analog Power(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Analog Power(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| OSC input clock frequency |  | NA | 24 | NA | MHz |
| Max CPU frequency |  | NA | NA | 2.2-2.4 | GHz |
| Max GPU frequency |  | NA | NA | 1000 | MHz |
| Max NPU frequency |  | NA | NA | 1000 | MHz |
| Ambient Operating Temperature | TA | 0 | NA | 80 | ℃ |

### 3.3 DC characteristics

|  | Parameters | Symbol | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Digital 3.3V/1.8V GPIO @3.3V | Input Low Voltage | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 3.3V/1.8V GPIO @3.3V | Input High Voltage | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 3.3V/1.8V GPIO @3.3V | Output Low Voltage | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 3.3V/1.8V GPIO @3.3V | Output High Voltage | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 3.3V/1.8V GPIO @3.3V | Pullup Resistor | RRPU | 10 | NA | 100 | Kohm |
| Digital 3.3V/1.8V GPIO @3.3V | Pulldown Resistor | RRPD | 10 | NA | 100 | Kohm |
| Digital 3.3V/1.8V GPIO @1.8V | Input Low Voltage | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 3.3V/1.8V GPIO @1.8V | Input High Voltage | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 3.3V/1.8V GPIO @1.8V | Output Low Voltage | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 3.3V/1.8V GPIO @1.8V | Output High Voltage | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 3.3V/1.8V GPIO @1.8V | Pullup Resistor | RRPU | 10 | NA | 50 | Kohm |
| Digital 3.3V/1.8V GPIO @1.8V | Pulldown Resistor | RRPD | 10 | NA | 50 | Kohm |
| Digital 1.8V only GPIO @1.8V | Input Low Voltage | VIL | VSS | NA | 0.3*VDDO | V |
| Digital 1.8V only GPIO @1.8V | Input High Voltage | VIH | 0.7*VDDO | NA | VDDO | V |
| Digital 1.8V only GPIO @1.8V | Output Low Voltage | VOL | VSS | NA | 0.25*DVDD | V |
| Digital 1.8V only GPIO @1.8V | Output High Voltage | VOH | 0.75*DVDD | NA | DVDD | V |
| Digital 1.8V only GPIO @1.8V | Pullup Resistor | RRPU | 10 | NA | 50 | Kohm |
| Digital 1.8V only GPIO @1.8V | Pulldown Resistor | RRPD | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Input Low Voltage | VIL | VSS | NA | 0.35*DVDD | V |
| eMMC IO @1.8V | Input High Voltage | VIH | 0.65*DVDD | NA | DVDD | V |
| eMMC IO @1.8V | Output Low Voltage | VOL | VSS | NA | 0.45 | V |
| eMMC IO @1.8V | Output High Voltage | VOH | DVDD-0.45 | NA | DVDD | V |
| eMMC IO @1.8V | Pullup Resistor | RRPU | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Pulldown Resistor | RRPD | 10 | NA | 50 | Kohm |
| DDR IO | Input Low Voltage | VIL | NA | NA | Vref-0.14 | V |
| DDR IO | Input High Voltage | VIH | Vref+0.14 | NA | NA | V |
| DDR IO | Output Log Voltage | VOL | NA | NA | 0.2 | V |
| DDR IO | Output High Voltage | VOH | 0.25 | NA | NA | V |
| DDR IO | Input Low Current | IIL | -100/-500 | NA | 100/500 | Room/Hot uA |
| DDR IO | Input High Current | IIH | -100/-500 | NA | 100/500 | Room/Hot uA |

### 3.4 General IO

|  | Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Digital 3.3V/1.8V GPIO @3.3V | Input leakage current | IPAD | DVDD=Max, VPAD=0V or DVDD | -10 | NA | 10 | uA |
| Digital 3.3V/1.8V GPIO @3.3V | Input Hysteresis for Schmitt Trigger Operation | VH |  | 0.08* VDDO | NA | NA | V |
| Digital 3.3V/1.8V GPIO @3.3V | Input pullup resistor current | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Digital 3.3V/1.8V GPIO @3.3V | Input pulldown resistor current | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Input leakage current | IPAD | DVDD=Max, VPAD=0V or DVDD | -10 | NA | 10 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Input Hysteresis for Schmitt Trigger Operation | VH |  | 0.1* VDDO | NA | NA | V |
| Digital 3.3V/1.8V GPIO @1.8V | Input pullup resistor current | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Digital 3.3V/1.8V GPIO @1.8V | Input pulldown resistor current | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Digital 1.8V only GPIO @1.8V | Input leakage current | IPAD | DVDD=Max, VPAD=0V or DVDD | -10 | NA | 10 | uA |
| Digital 1.8V only GPIO @1.8V | Input Hysteresis for Schmitt Trigger Operation | VH |  | 0.1* VDDO | NA | NA | V |
| Digital 1.8V only GPIO @1.8V | Input pullup resistor current | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| Digital 1.8V only GPIO @1.8V | Input pulldown resistor current | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |
| eMMC IO @1.8V | Input leakage current | IPAD | DVDD=Max, VPAD=0V or DVDD | -10 | NA | 10 | uA |
| eMMC IO @1.8V | Input Hysteresis for Schmitt Trigger Operation | VH |  | 0.1* DVDD | NA | NA | V |
| eMMC IO @1.8V | Input pullup resistor current | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| eMMC IO @1.8V | Input pulldown resistor current | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |

VDDO and DVDD both denote IO supplies. Negative pull-up current MIN/MAX positions are retained. Dual-voltage GPIO values list the 3.3V mode first, then 1.8V.

### 3.5.1 INT PLL

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Input clock frequency | FFIN |  | 4.5 | - | 300 | MHz |
| Reference frequency(FFIN/p) | FFREE |  | 4.5 | 7 | 12 | MHz |
| Frequency of PLL’s output | FFOUT |  | 35.2 | - | 4500 | MHz |
| Frequency of VCO’s output | FFVCO |  | 2250 | - | 4500 | MHz |
| Lock time | TLT | Measured at all FFIN and FFOUT range. RESETB=High | - | - | 150 | Cycles |

### 3.5.2 FRAC PLL

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Input clock frequency | FFIN |  | 6 | - | 300 | MHz |
| Reference frequency(FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| Frequency of PLL’s output | FFOUT |  | 35.2 | - | 4500 | MHz |
| Frequency of VCO’s output | FFVCO |  | 2250 | - | 4500 | MHz |
| Lock time | TLT | Measured at all FFIN and FFOUT range. RESETB=High | - | - | 500 | Cycles |

### 3.5.3 DDR PLL

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Input clock frequency | FFIN |  | 6 | - | 300 | MHz |
| Reference frequency(FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| Frequency of PLL’s output | FFOUT |  | 51.6 | - | 6600 | MHz |
| Frequency of VCO’s output | FFVCO |  | 3300 | - | 6600 | MHz |
| Lock time | TLT | Measured at all FFIN and FFOUT range. RESETB=High | - | - | 500 | Cycles |

PLL note ①: p is the input-divider value.

### 3.6 PCIe2/SATA

| Parameters | Symbol | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- |
| Transmitter |  |  |  |  |  |
| Differential Peak-Peak TX Output Voltage Swing | VTX_DIFF_PP | 800 | 1000 | 1200 | mV |
| Differential Peak-Peak Low Power TX Output Voltage Swing | VTX_DIFF_PP_LOW | 400 | NA | 1200 | mV |
| The output impedance | RTX_DIFF_DC | 80 | 100 | 120 | ohm |
| Single Ended Output Resistance Matching | RTX_DC_OFFSET | NA | NA | 5 | % |
| Transmitter output common mode voltage | VTX_DC_CM | 400 | NA | 800 | mV |
| Maximum mismatch between TXP and TXM for both time and amp | VTX_CM_AC_PP_ACTIVE | NA | NA | 50 | mV |
| The amount of voltage change allowed during Receiver Detection | VTX_RCV_DETECT | NA | NA | 600 | mV |
| TX de-emphasis | VTX_DE_RATIO | 3.0 | 3.5 | 4.0 | dB |
| AC Coupling Capacitor(USB3.1/PCIe) | CAC_COUPLING | 75 | NA | 200 | nF |
| AC Coupling Capacitor(SATA) | CAC_COUPLING | 6 | NA | 12 | nF |
| Output rising time for 20% to 80% | Tr | 25 | NA | NA | ps |
| Output falling time for 20% to 80% | Tf | 25 | NA | NA | ps |
| Transmitter short circuit limit | ITX_SHORT | NA | NA | 20 | mA |
| Output differential skew | TSKEW_DIFF | -15 | NA | 15 | ps |
| Receiver |  |  |  |  |  |
| Input Voltage Swing | VRXDPP_C | 250 | NA | 1200 | mVpp |
| The input differential impedance | RRXD_C | 80 | 100 | 120 | Ohm |
| Single Ended input Resistance Matching | RRXD_C_MS | NA | NA | 5 | % |

### 3.7 SARADC

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Resolution |  |  | NA | 12 | NA | Bit |
| Anglog Input Range | AIN |  | AVSS18 | NA | AVDD18 | V |
| Differential Non-Linearity | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±1.0 | ±3.0 | LSB |
| Integral Non-Linearity | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±2.0 | ±6.0 | LSB |
| Top Offset Voltage Error | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±10 | ±20 | LSB |
| Bottom Offset Voltage Error | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±10 | ±20 | LSB |

### 3.8 TSADC

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Accuracy from -40℃ to 125℃ | TJACC | Temp: -40 ~ 125℃ Supply: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Sensing Temperature Range | TRANGE |  | -40 | NA | 125 | ℃ |
| Resolution | TLSB |  | NA | 1 | NA | ℃ |

## 4. Thermal management

For reliability and operability, the absolute maximum junction temperature must remain below 125°C. The values below are simulation references; physical tests take precedence. Reference PCB: JEDEC 2S2P, 114.3mm x 76.2mm x 1.6mm, ambient 25°C.

| Parameter | Symbol | Typical | Unit |
| --- | --- | --- | --- |
| Junction-to-ambient thermal resistance | 𝜽 𝑱𝑨 | 15.6 | (℃/𝑾) |
| Junction-to-board thermal resistance | 𝜽 𝑱𝑩 | 4.6 | (℃/𝑾) |
| Junction-to-case thermal resistance | 𝜽 𝑱𝑪 | 0.03 | (℃/𝑾) |

## Source qualifications

The VOP text retains MIPI dual-channel/DSC timing conditions although this variant lists no MIPI display interface; this is a source inconsistency, not proof of an accessible MIPI port. The feature list states 0.3mm ball size, while the drawing gives 0.310mm nominal. The source uses FCCSP766L in features and ED-FCCSP 17x19 766L for ordering. The absolute table lists 125°C maximum junction temperature; the thermal text says below 125°C. No register-map chapter is provided.

## Official references

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
