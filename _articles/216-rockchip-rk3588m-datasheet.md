---
title: "Rockchip RK3588M datasheet: specifications, pins and electrical limits"
description: "Rockchip RK3588M datasheet: specifications, pins and electrical limits — Rev1.3"
excerpt: "Rockchip RK3588M datasheet: specifications, pins and electrical limits"
translation_key: "216-rockchip-rk3588m-datasheet"
slug: "216-rockchip-rk3588m-datasheet"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588M","datasheet"]
---

{% raw %}

# Rockchip RK3588M datasheet: specifications, pins and electrical limits

This ArmSoM platform reference describes the RK3588M chip, not a board compatibility claim. Verify the exact device, schematic, power rails and BSP. Figures and performance data are Rockchip reference material; no ArmSoM hardware tests were performed. No SDK or kernel version is specified.

Sources: English RK3588M Rev1.3, 2024-12-12, 35 pages in CN, and Rev1.1, 2023-08-03, 34 pages in EN. Rev1.3 is primary; all figures come from its English original.

## 1.1

RK3588M is a low-power high-performance processor for automotive applications including cockpits (Rev1.1 also named entertainment). It integrates four Cortex-A76 cores and four Cortex-A55 cores, each with a NEON coprocessor. Hardware engines accelerate demanding applications. Video decoding supports H.265 and VP9 at 8K@60fps, H.264 at 8K@30fps, and AV1 at 4K@60fps. H.264 and H.265 encoding supports 8K@30fps; high-quality JPEG encoding/decoding and dedicated image preprocessing and postprocessing are also integrated. The 3D GPU supports OpenGLES 1.1, 2.0 and 3.2, OpenCL up to 2.2, and Vulkan 1.2. A dedicated 2D engine with an MMU accelerates display operations. The fully hardware-based ISP supports up to 48 megapixels and accelerates HDR, 3A, LSC, 3DNR, 2DNR, sharpening, dehaze, fisheye correction and gamma correction. The NPU supports mixed INT4/INT8/INT16/FP16 operations and up to 6 TOPS; models from TensorFlow, MXNet, PyTorch and Caffe can be converted. The four-channel external memory interface supports LPDDR4/LPDDR4X/LPDDR5/LPDDR5X and demanding bandwidth requirements. A comprehensive peripheral interface set supports flexible applications.

## 1.2.1

Microprocessor. Four ARM Cortex-A76 MPCore and four ARM Cortex-A55 MPCore application processors combine high performance, low power and caches. DSU (DynamIQ Shared Unit) contains the L3 memory system, control logic and external interfaces for the DynamIQ cluster. The ARMv8-A instruction set is fully implemented, including ARM NEON Advanced SIMD for media/signal processing and ARMv8 Cryptography Extensions; TrustZone is supported. Each A76 has 64KB L1 instruction, 64KB L1 data and 512KB L2 cache; each A55 has 32KB L1 instruction, 32KB L1 data and 128KB L2 cache. All eight cores share 3MB L3. Eight independent power domains support internal power switches and externally controlled on/off operation for different applications: PD_CPU_0/1/2/3 correspond respectively to A55 cores 1/2/3/4, and PD_CPU_4/5/6/7 to A76 cores 1/2/3/4; each includes NEON, FPU and L1/L2 instruction/data caches. Three separate voltage domains support DVFS: A76_0+A76_1, A76_2+A76_3, and DSU+Cortex-A55.

## 1.2.2

Memory organization. On-chip BootROM boots through SPI, eMMC or SD/MMC and downloads system code through USB OTG. Shared memory is in VD_LOGIC; PMU SRAM in VD_PMU serves low-power applications. External dynamic memory complies with JEDEC LPDDR4/LPDDR4X/LPDDR5/LPDDR5X, with four 16-bit channels, up to two ranks/chip selects per channel and up to 32GB total address space. SDRAM supports power-down and self-refresh. The eMMC interface fully complies with JEDEC eMMC 5.1/5.0 and is backward-compatible with 4.51 and earlier; HS400, HS200, DDR50 and legacy modes use 1-, 4- or 8-bit buses. SD/MMC supports SD3.0 and MMC 4.51 with a 4-bit bus. FSPI transfers data to/from serial flash using 1-, 2- or 4-bit buses and two chip selects. JEDEC speed grades: LPDDR4(4X)-4266/LPDDR5(5X)-4800.

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

Video inputs. Two MIPI DPHY/CPHY combo PHYs each use either DPHY 1.2 (4 lanes, 2.5Gbps/lane) or CPHY 1.1 (3 lanes, 2.5Gsps/lane). Four additional CSI DPHY 1.2 units each provide 2 lanes at 2.5Gbps/lane; pairs combine into 4 lanes. Camera combinations are 2 DCPHY+4 two-lane CSI DPHY=6 cameras; 2 DCPHY+1 four-lane+2 two-lane CSI DPHY=5; or 2 DCPHY+2 four-lane CSI DPHY=4. One standard 8/10/12/16-bit DVP accepts up to 150MHz, BT.601/BT.656/BT.1120, with configurable pixel_clk/hsync/vsync polarity. The single-port HDMI 2.0 RX PHY has 4 lanes without sideband channels. HDMI 2.0 rates span 3.4–6Gbps; HDMI 1.4 spans 250Mbps–3.4Gbps. HDMI 2.0 uses TMDS scrambling for 2160p@60Hz RGB/YCbCr4:4:4/YCbCr4:2:2 and supports YCbCr4:2:0 for 2160p@60Hz at lower link speeds. HDMI 1.4b supports all CEA-861-E formats through 1080p@120Hz, 3840x2160p@24/25/30Hz, 4096x2160p@24Hz, and 3D modes up to 340MHz TMDS clock. HDCP2.3/1.4 is supported.

## 1.2.9

Image signal processor. VICAP supports BT601/BT656/BT1120 and six MIPI CSI/DSI interfaces with up to four IDs each; CSI formats RAW8/10/12/14 and YUV422; HDR virtual-channel, identification-code and line-counter modes; and RAW pass-through to ISP0/1. Maximum input is 48M 8064x6048@15 with dual ISP, 32M 6528x4898@30 with dual ISP, or 16M 4672x3504@30 with one ISP. Processing includes 3A statistics (AE/histogram, AF, AWB), FPN fixed-pattern-noise removal, BLC black-level correction, DPCC static/dynamic defective-pixel-cluster correction, PDAF phase-detection autofocus, LSC lens shading, Bayer-2DNR spatial/Bayer-3DNR temporal raw denoising, CAC chromatic-aberration correction, three-frame HDR merging, DRC dynamic-range compression/tone mapping, GIC green-imbalance correction, advanced adaptive Debayer with chromatic-aberration correction, CCM/CSM color matrices and RGB2YUV, output gamma correction, automatic dehaze/effect enhancement, customer 3DLUT palette, horizontal-only LDCH lens-distortion correction, YUV-2DNR spatial denoising, sharpening and boundary filtering, CMSK privacy masking, local GAIN and ISP reuse by multiple sensors. Fisheye correction accepts RASTER YUV422SP/YUV422I/YUV420SP and outputs the same RASTER formats or FBCE YUV422SP/YUV420SP. Grid densities are 16x8 or 32x16, reduction factor up to 4, resolution 128x128–4095x4095, bicubic Y and bilinear C interpolation.

## 1.2.10

Display interfaces. Two HDMI/eDP TX combo interfaces support x1/x2/x4, with HDMI and eDP mutually exclusive on each interface. HDMI FRL supports 3/6/8/10/12Gbps, up to 7680x4320@60Hz, RGB/YUV up to 10bit, DSC1.2a and HDCP2.3. eDP supports 1.62/2.7/5.4Gbps, up to 4K@60Hz, RGB/YCbCr4:4:4/YCbCr4:2:2 with 8/10 bits per component, and HDCP1.3. Two DP TX1.4a interfaces combine with USB3.1 Gen1, support 1/2/4 lanes at 1.62/2.7/5.4/8.1Gbps, up to 8192x4320@30Hz, RGB/YUV up to 10bit, SST, Type-C DP Alt Mode and HDCP2.3/1.3. Two MIPI DPHY2.0 interfaces each offer four data lanes at up to 4.5Gbps per lane, 4K@60Hz, left/right dual-MIPI display, RGB up to 10bit and DSC1.1/1.2a. BT.1120 output supports 1920x1080@60Hz, RGB up to 8bit and up to 150MHz. HDMI timing should follow CTA-861; nonstandard HSYNC/HBP/HFP should align to 4 pixels. DP timing should follow CTA-861; nonstandard HSYNC/HBP/HFP minima are 16 pixels. For MIPI DSI, HSYNC/HBP/HFP minima are 4 pixels, HTOTAL/HACTIVE must align to 4 pixels, and HSYNC/HBP/HFP should also align to 4 pixels (last source spelling HYSNC).

## 1.2.11

Video output processor. Maximum outputs: Video Port0 7680x4320@60Hz; Port1 and Port2 each 4096x2304@60Hz; Port3 1920x1080@60Hz. Cluster0/1/2/3 each support 4096x2304 input/output, AFBCD, RGB/YUV/YUYV, scaling 4–1/4 and rotation. ESMART0/1/2/3 each support 4096x2304 input/output, RGB/YUV/YUYV, scaling 8–1/8 and four regions. Overlay combines up to eight layers (four clusters+four ESMART) in RGB or YUV. Postprocessing supports HDR10/HLG, HDR2SDR/SDR2HDR and 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Writeback uses ARGB8888/RGB888/RGB565/YUV420 up to 1920x1080. VOP timing requires HACTIVE aligned to 4 pixels. In split mode, MIPI dual-channel mode or YUV420, POST HSYNC/HBP/HFP must align to 2 pixels. MIPI DSC video mode requires POST HSYNC/HBP/HFP at least 16 pixels and DSC_SYS_CTRL HSYNC/HBP/HFP at least 8 pixels.

## 1.2.12

Audio interfaces. I2S0/I2S1 support up to 8 TX and 8 RX channels. Both use 16–32-bit resolution, up to 192kHz, software-selectable master/slave, I2S normal/left-/right-justified, PCM early/late1/late2/late3 and TDM normal, half-cycle/one-cycle/two-cycle left shift or right shift. I2S/PCM/TDM cannot operate simultaneously. I2S2/I2S3 each support 2 TX and 2 RX channels, 16–32 bits, up to 192kHz, programmable master/slave, the same three I2S and four PCM formats; I2S and PCM cannot run simultaneously. SPDIF0/1 pack two 16-bit samples into one 32-bit location, output biphase stereo, align 16–31-bit data left/right in 32-bit buffers, transfer linear PCM at 16/20/24 bits and support nonlinear PCM. PDM0/1 offer up to 8 channels, 16–24-bit resolution, up to 192kHz and master receive mode. The digital audio codec has two digital DAC channels, I2S/PCM master/slave, 16-bit sampling, three mixing modes per DAC channel and volume control. VAD reads I2S/PDM voice data, detects amplitude, stores microphone-array data and supports a combined level interrupt.

## 1.2.13

Connectivity. SDIO supports SDIO3.0 with a 4-bit bus. Two GMACs support RGMII at 10/100/1000Mbps and RMII at 10/100Mbps, full or half duplex. USB3.1 Gen1 (equivalent to USB3.2 Gen1 and USB3.0) reaches 5Gbps. Two OTG interfaces, USB3OTG_0/1, combine with DP TX; one Host interface, USB3OTG_2, combines with PIPE PHY2. Compliance: USB3.0 revision1.0, USB2.0 except USB3OTG_2, and xHCI1.1. Transfers include control, bulk with streams, interrupt and isochronous; simultaneous IN/OUT is supported. Descriptor caching and data prefetch improve high-latency-system performance. Power management supports USB2.0 LPM except on USB3OTG_2 and USB3.1 U0/U1/U2/U3. Device functions provide up to 10 IN and 6 OUT endpoints, each count including control endpoint0; up to 16 transfer resources, one per endpoint; flexible endpoint configuration for applications/USB set-configuration modes; hardware ERDY and burst handling; stream-based bulk endpoints with automatic controller data movement; isochronous endpoints using data buffers; and flexible descriptors supporting buffer-interrupt moderation, multiple transfers, isochronous/control transfers and scattered buffering. xHCI host supports up to 64 devices, one interrupter, one USB2.0 port except USB3OTG_2, one SuperSpeed port and standard/open-source xHCI/class drivers. DRD features include static device/host operation and ID-based USB3.1/USB2.0 OTG A/B operation; USB3OTG_2 supports USB3.1 Gen1 only. SRP, HNP and RSP are not supported. USB2.0 PHY supports battery-charge detection; USB3OTG_0/1 support Type-C/DP Alt Mode; USB3OTG_2 PHY shares PCIe/SATA. Two USB2.0 hosts comply with USB2.0, support high/full/low speeds 480/12/1.5Mbps and EHCI1.0/OHCI1.0a. Three Combo PIPE PHYs support PCIe2.1/SATA3.0/USB3.1 controllers: PHY0 and PHY1 each select SATA or PCIe2.1; PHY2 selects SATA, PCIe2.1 or USB3.1 Gen1. Each PCIe2.1 interface has one lane at 5Gbps, follows PCI Express Base2.1 and supports Root Complex only. Each SATA interface has one 6Gbps port, supports eSATA and complies with Serial ATA3.1/AHCI1.3.1. PCIe3.0 follows Base3.0, supports RC/EP, rates 2.5Gbps (1.1), 5Gbps (2.1) and 8Gbps (3.0; source prints 8Gps), and aggregation/bifurcation as 1x4, 2x2, 4x1 or 1x2+2x1 lanes. Five SPI controllers (SPI0–SPI4) are provided; two chip-select outputs and software-selectable serial master/slave are supported. Nine I2C masters I2C0–I2C8 support 7/10-bit addressing and programmable clocks up to 100kbit/s Standard-mode or 400kbit/s Fast-mode. Ten UARTs UART0–UART9 each have separate 64-byte TX/RX FIFOs, 5/6/7/8-bit transmit/receive, standard start/stop/parity, selectable input clocks for up to 4Mbps and automatic flow control on all UARTs.

## 1.2.14

Other features. Multiple GPIO groups support interrupts on every GPIO, level/edge triggering, configurable level polarity, rising/falling/both edges, selectable weak pull-up/pull-down and drive strength. TS-ADC supports user-defined and automatic modes. In user-defined mode start_of_conversion is fully software-controlled or hardware-generated. Automatic mode provides programmable high/low alarm interrupt thresholds and system-reset temperature. Seven TS-ADC channels have independently configurable temperature criteria; range is −40–125°C, resolution 1°C. SARADC has 12-bit resolution, up to 1MS/s and eight single-ended inputs. OTP offers 32Kbit, with the higher 4k address space non-secure (source terminology retained). Secure mode supports read and program word masks; programming is at most 32 bits, reads at most 16 words; read/program status is readable and failed-program addresses are recorded. Package: FCBGA1088L, body 23mm x 23mm, ball diameter 0.36mm, pitch 0.65mm. Automotive qualification listed by the source: AEC-Q100 Grade3.

## 1.3 Block diagram

![1-1. Block diagram (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-1-1.png)

1-1. Block diagram (English original).

Additional diagram labels: 1MB shared memory; six PVTM blocks; two SPDIF blocks labelled “8ch”; system registers; embedded SRAM, ROM and OTP. The diagram labels the memory interface SD3.0/MMC4.5, while §1.2.2 specifies MMC4.51. These labels remain distinct.

## 2. Package information

### 2.1 Ordering

RK3588M: RoHS, FCBGA1088L, 600PCS by tray, application processor.

### 2.2 Top marking

Rockchip = brand; RKXXXX = chip name; ABC = subcontractor code; XXXXXX = die lot number; DEFG = date code; NXXXXXX FXX = OSAT sub-lot information. The corner marker identifies the first pin.

![2-1. Package markings (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-1.png)

2-1. Package markings (English original).

![2-2. Package top view (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-2.png)

2-2. Package top view (English original).

### 2.3 Dimensions

![2-3. Package bottom view (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-3.png)

2-3. Package bottom view (English original).

![2-4. Package side view (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-4.png)

2-4. Package side view (English original).

![2-5. Package dimensions (English original).](/docs/rockchip-rk3588m-datasheet/images/figure-2-5.png)

2-5. Package dimensions (English original).

| Symbol | Min mm | Typ mm | Max mm | Min inch | Typ inch | Max inch |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.727 | 1.885 | 2.043 | 0.068 | 0.074 | 0.080 |
| A1 | 0.20 | 0.25 | 0.30 | 0.008 | 0.010 | 0.012 |
| A2 | 1.485 | 1.635 | 1.785 | 0.058 | 0.064 | 0.070 |
| c | 0.56 | 0.66 | 0.76 | 0.022 | 0.026 | 0.030 |
| D | 22.80 | 23.00 | 23.20 | 0.898 | 0.906 | 0.913 |
| E | 22.80 | 23.00 | 23.20 | 0.898 | 0.906 | 0.913 |
| D1 | — | 21.45 | — | — | 0.844 | — |
| E1 | — | 21.45 | — | — | 0.844 | — |
| e | — | 0.65 | — | — | 0.026 | — |
| b | 0.31 | 0.36 | 0.41 | 0.012 | 0.014 | 0.016 |

The drawing gives these unsplit tolerances (mm / inch): aaa 0.20/0.008; ccc 0.35/0.014; ddd 0.15/0.006; eee 0.20/0.008; fff 0.08/0.003; MD/ME=34/34. The nominal dimension column above corresponds to NOM in the original.

### 2.4–2.5 Moisture sensitivity and ball material

MSL3; lead finish/ball material SnAgCu.

### 2.6 Complete pin list

Table 2-1, source pages 21–28. Signal names and multiplexing alternatives are literal identifiers.

| Pin Name | Pin | Pin Name | Pin |
| --- | --- | --- | --- |
| VSS_1 | A1 | VSS_12 | C5 |
| DDR_CH1_DQ10_C | A2 | VSS_13 | C6 |
| DDR_CH1_DQ8_C | A3 | VSS_14 | C7 |
| DDR_CH1_DQ14_C | A4 | VSS_15 | C8 |
| DDR_CH1_DQ12_C | A5 | VSS_16 | C9 |
| DDR_CH1_DQ4_C | A6 | DDR_CH0_DQ15_B | D1 |
| DDR_CH1_DQ6_C | A7 | DDR_CH0_DQ8_B | D2 |
| DDR_CH1_DQ0_C | A8 | VSS_34 | D3 |
| DDR_CH1_DQ2_C | A9 | DDR_CH1_DM1_C | D4 |
| DDR_CH1_A4_C | A10 | DDR_CH1_DQS1N_C | D5 |
| VSS_2 | A11 | DDR_CH1_WCK1P_C | D7 |
| DDR_CH1_CKB_C | A12 | DDR_CH1_DQS0N_C | D9 |
| DDR_CH1_CKB_D | A13 | DDR_CH1_A6_C | D10 |
| VSS_3 | A14 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_C | D11 |
| DDR_CH1_A4_D | A15 | DDR_CH1_A3_C | D13 |
| DDR_CH1_DQ2_D | A16 | DDR_CH1_A6_D | D14 |
| DDR_CH1_DQ0_D | A17 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_D | D16 |
| DDR_CH1_DQ6_D | A18 | DDR_CH1_WCK0N_D | D17 |
| DDR_CH1_DQ4_D | A19 | DDR_CH1_LP4/4X_CS1_D | D19 |
| DDR_CH1_DQ12_D | A20 | DDR_CH1_DM0_D | D20 |
| DDR_CH1_DQ14_D | A21 | DDR_CH1_DQS1P_D | D21 |
| DDR_CH1_DQ8_D | A22 | DDR_CH1_DM1_D | D22 |
| DDR_CH1_DQ10_D | A23 | VSS_35 | D23 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0_d | A24 | VSS_36 | D24 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1_d | A25 | PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1_d | D25 |
| VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2_d | A26 | PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2_d | D26 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3_d | A27 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3_d | D27 |
| PCIE30_PORT1_REF_CLKP | A28 | I2S0_SDI0/GPIO1_D4_d | D28 |
| PCIE30_PORT1_TX0N | A30 | PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6_d | D29 |
| PCIE30_PORT1_RX0N | A32 | I2S0_LRCK/I2C2_SCL_M3/UART4_RTSN/GPIO1_C5_d | D30 |
| PCIE30_PORT1_RESREF | A33 | VSS_37 | D31 |
| VSS_4 | A34 | PCIE30_PORT0_TX0P | D32 |
| DDR_CH0_DQ14_A | AA1 | PCIE30_PORT0_TX0N | D33 |
| DDR_CH0_DQ15_A | AA2 | DDR_CH0_DQ13_B | E1 |
| VSS_248 | AA3 | DDR_CH0_DQ14_B | E2 |
| DDR_CH0_DQS1N_A | AA4 | VSS_38 | E3 |
| DDR_CH0_DQS1P_A | AA5 | DDR_CH0_DM1_B | E4 |
| VSS_249 | AA6 | DDR_CH1_DQS1P_C | E5 |
| VCCIO2_1V8 | AA7 | VSS_39 | E6 |
| AVSS_15 | AA8 | DDR_CH1_WCK1N_C | E7 |
| HDMI/eDP_TX0_VDD_0V75 | AA9 | VSS_40 | E8 |
| AVSS_16 | AA10 | DDR_CH1_DQS0P_C | E9 |
| VSS_250 | AA11 | DDR_CH1_RESET_C | E10 |
| VDD_GPU_MEM_0 | AA12 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_C | E11 |
| VDD_GPU_0 | AA13 | VSS_41 | E12 |
| VDD_GPU_7 | AA14 | DDR_CH1_A2_C | E13 |
| VDD_GPU_11 | AA15 | DDR_CH1_A3_D | E14 |
| VSS_251 | AA16 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_D | E16 |
| VSS_252 | AA17 | DDR_CH1_WCK0P_D | E17 |
| VSS_253 | AA18 | VSS_42 | E18 |
| VSS_254 | AA19 | DDR_CH1_LP4/4X_CS0_D | E19 |
| VSS_255 | AA20 | VSS_43 | E20 |
| VSS_256 | AA21 | DDR_CH1_DQS1N_D | E21 |
| VSS_257 | AA22 | VSS_44 | E22 |
| VSS_258 | AA23 | VSS_45 | E23 |
| VSS_259 | AA24 | PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4_u | E24 |
| MIPI_CSI1_AVCC0V75 | AA25 | PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5_u | E25 |
| MIPI_CSI1_AVCC1V8 | AA26 | MIPI_CAMERA1_CLK_M0/SPDIF0_TX_M0/PCIE30X2_WAKEN_M3/HDMI_RX_HPDIN_M2/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6_d | E26 |
| HDMI_TX0_HPD_M1/PCIE30X2_PERSTN_M2/HDMI_RX_HPDIN_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4_d | AA27 | MIPI_CAMERA2_CLK_M0/SPDIF1_TX_M0/PCIE30X2_PERSTN_M3/HDMI_RX_CEC_M2/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7_u | E27 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7_d | AA28 | I2S0_SDI1/PDM0_SDI3_M0/I2C1_SDA_M4/UART4_RX_M0/PWM1_M1/SPI1_CS0_M2/GPIO1_D3_d | E28 |
| GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0_u | AA29 | I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7_d | E29 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1_u | AA30 | PDM0_CLK1_M0/I2C2_SDA_M3/PWM11_IR_M2/SPI4_CS1_M0/GPIO1_C4_d | E30 |
| VSS_260 | AA31 | I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3_d | E31 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5_u | AA32 | VSS_46 | E32 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3_u | AA33 | PCIE30_PORT0_REF_CLKP | E33 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3_d | AA34 | PCIE30_PORT0_REF_CLKN | E34 |
| DDR_CH0_DQ9_A | AB1 | DDR_CH0_DQ4_B | F1 |
| DDR_CH0_DQ8_A | AB2 | DDR_CH0_DQ12_B | F2 |
| VSS_261 | AB3 | VSS_47 | F3 |
| DDR_CH0_DM1_A | AB4 | DDR_CH0_DQS1N_B | F4 |
| VSS_262 | AB5 | DDR_CH0_DQS1P_B | F5 |
| AVSS_17 | AB6 | VSS_48 | F7 |
| AVSS_18 | AB7 | DDR_CH1_DM0_C | F8 |
| AVSS_19 | AB8 | VSS_49 | F9 |
| HDMI/eDP_TX0_AVDD_0V75 | AB9 | VSS_50 | F10 |
| AVSS_20 | AB10 | VSS_51 | F11 |
| VSS_263 | AB11 | DDR_CH1_A1_C | F12 |
| VDD_GPU_MEM_1 | AB12 | VSS_52 | F13 |
| VDD_GPU_1 | AB13 | VSS_53 | F14 |
| VDD_GPU_6 | AB14 | VSS_54 | F15 |
| VDD_GPU_10 | AB15 | VSS_55 | F16 |
| VSS_264 | AB16 | DDR_CH1_ZQ_D | F18 |
| VSS_265 | AB17 | VSS_56 | F19 |
| VSS_266 | AB18 | VSS_57 | F20 |
| VSS_267 | AB19 | VSS_58 | F21 |
| VSS_268 | AB20 | VSS_59 | F22 |
| VDD_NPU_6 | AB21 | VSS_60 | F23 |
| VDD_NPU_5 | AB22 | MIPI_CAMERA3_CLK_M0/HDMI_RX_SCL_M2/I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6_u | F24 |
| VDD_NPU_2 | AB23 | MIPI_CAMERA4_CLK_M0/PCIE30X2_CLKREQN_M3/HDMI_RX_SDA_M2/I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7_u | F25 |
| VSS_269 | AB24 | I2S0_SDO1/I2C7_SCL_M0/UART6_TX_M2/SPI1_MISO_M2/GPIO1_D0_d | F26 |
| MIPI_CSI0_AVCC0V75 | AB25 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/I2C7_SDA_M0/UART6_RX_M2/SPI1_MOSI_M2/GPIO1_D1_d | F27 |
| MIPI_CSI0_AVCC1V8 | AB26 | I2S0_SDO3/I2S0_SDI2/PDM0_SDI2_M0/I2C1_SCL_M4/UART4_TX_M0/PWM0_M1/SPI1_CLK_M2/GPIO1_D2_d | F28 |
| VSS_270 | AB27 | I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2__d | F30 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5_d | AB28 | VSS_61 | F31 |
| VSS_271 | AB29 | PCIE30_PORT0_RX1P | F32 |
| GMAC0_PPSTRING/FSPI_CS1N_M1/HDMI_TX1_SCL_M0/I2C4_SCL_M1/UART7_TX_M0/GPIO2_B5_u | AB30 | PCIE30_PORT0_RX1N | F33 |
| GMAC0_PTP_REFCLK/FSPI_CS0N_M1/HDMI_TX1_SDA_M0/I2C4_SDA_M1/UART7_RX_M0/GPIO2_B4_u | AB31 | DDR_CH0_DQ6_B | G1 |
| VSS_272 | AB32 | DDR_CH0_DQ5_B | G2 |
| GMAC0_MDIO/I2C0_SCL_M1/UART9_CTSN_M0/PWM6_M2/SPI3_MOSI_M0/GPIO4_C5_d | AB33 | VSS_62 | G3 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/SPI3_MISO_M0/GPIO4_C4_d | AB34 | DDR_CH0_DM0_B | G4 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | G6 |
| DDR_CH0_DQ11_A | AC2 | DDR_CH1_ZQ_C | G8 |
| VSS_273 | AC3 | DDR_CH1_WCK0P_C | G9 |
| VSS_274 | AC4 | VSS_64 | G10 |
| AVSS_21 | AC5 | DDR_CH1_LP4/4X_CS0_C | G11 |
| HDMI/eDP_TX0_VDD_CMN_1V8 | AC6 | DDR_CH1_A0_C | G12 |
| HDMI/eDP_TX0_VDD_IO_1V8 | AC7 | DDR_CH1_A2_D | G13 |
| AVSS_22 | AC8 | DDR_CH1_A1_D | G14 |
| HDMI/eDP_TX1_AVDD_0V75 | AC9 | VSS_65 | G15 |
| AVSS_23 | AC10 | DDR_CH1_DQS0N_D | G16 |
| VSS_275 | AC11 | DDR_CH1_WCK1N_D | G18 |
| VSS_276 | AC12 | VSS_66 | G19 |
| VDD_GPU_2 | AC13 | VCCIO1_1V8 | G20 |
| VDD_GPU_5 | AC14 | VSS_67 | G21 |
| VDD_GPU_9 | AC15 | VSS_68 | G22 |
| VSS_277 | AC16 | PCIE30_PORT0_AVDD1V8 | G23 |
| VDD_LOGIC_5 | AC17 | PCIE30_PORT0_AVDD0V75 | G24 |
| VDD_LOGIC_4 | AC18 | VSS_69 | G25 |
| VDD_LOGIC_3 | AC19 | PDM0_SDI0_M0/SPI1_CS1_M2/GPIO1_D5_d | G26 |
| VSS_278 | AC20 | I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1_z | G27 |
| VSS_279 | AC21 | I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0_z | G29 |
| VDD_NPU_4 | AC22 | PCIE20_2_REFCLKN | G30 |
| VDD_NPU_1 | AC23 | PCIE20_2_REFCLKP | G31 |
| VSS_280 | AC24 | VSS_70 | G32 |
| VCCIO6_1V8 | AC25 | PCIE30_PORT0_RX0P | G33 |
| VCCIO6 | AC26 | PCIE30_PORT0_RX0N | G34 |
| VSS_281 | AC27 | DDR_CH0_DQ0_B | H1 |
| GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3_u | AC28 | DDR_CH0_DQ7_B | H2 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4_u | AC29 | VSS_71 | H3 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4_d | AC30 | DDR_CH0_WCK1P_B | H4 |
| GMAC0_RXD3/SDIO_D1_M0/FSPI_D1_M1/UART6_TX_M0/GPIO2_A7_u | AC31 | DDR_CH0_WCK1N_B | H5 |
| GMAC0_RXD2/SDIO_D0_M0/FSPI_D0_M1/UART6_RX_M0/GPIO2_A6_u | AC32 | VSS_72 | H6 |
| GMAC0_TXD2/SDIO_D3_M0/FSPI_D3_M1/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1_u | AC33 | DDR_CH0_ZQ_B | H7 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2_u | AC34 | DDR_CH1_WCK0N_C | H9 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1_u | AD1 | VSS_73 | H10 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0_u | AD2 | DDR_CH1_LP4/4X_CS1_C | H11 |
| OTP_VDDOTP_0V75 | AD3 | VSS_74 | H12 |
| NC | AD4 | DDR_CH1_VDDQ_CKE | H13 |
| AVSS_24 | AD5 | VSS_75 | H14 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AD6 | DDR_CH1_A0_D | H15 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AD7 | DDR_CH1_DQS0P_D | H16 |
| AVSS_25 | AD8 | DDR_CH1_WCK1P_D | H18 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | H19 |
| AVSS_26 | AD10 | VCCIO4_1V8 | H20 |
| VSS_282 | AD11 | VCCIO4 | H21 |
| VSS_283 | AD12 | VSS_77 | H22 |
| VDD_GPU_3 | AD13 | PCIE30_PORT1_AVDD1V8 | H23 |
| VDD_GPU_4 | AD14 | PCIE30_PORT1_AVDD0V75 | H24 |
| VDD_GPU_8 | AD15 | VSS_78 | H25 |
| VSS_284 | AD16 | VSS_79 | H26 |
| VDD_LOGIC_0 | AD17 | AVSS_1 | H28 |
| VDD_LOGIC_1 | AD18 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | H29 |
| VDD_LOGIC_2 | AD19 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | H30 |
| VSS_285 | AD20 | AVSS_2 | H31 |
| VSS_286 | AD21 | PCIE20_1_REFCLKP | H32 |
| VDD_NPU_3 | AD22 | PCIE20_1_REFCLKN | H33 |
| VDD_NPU_0 | AD23 | DDR_CH0_DQ2_B | J1 |
| VSS_287 | AD24 | DDR_CH0_DQ1_B | J2 |
| VSS_288 | AD25 | VSS_80 | J3 |
| VSS_289 | AD26 | VSS_81 | J4 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2_u | AD27 | VSS_82 | J5 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4_d | AD28 | VSS_83 | J6 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5_u | AD29 | DDR_CH0_DQS0N_B | J7 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3_d | AD30 | DDR_CH0_DQS0P_B | J8 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2_d | AD31 | VSS_84 | J10 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1_d | AD32 | VSS_85 | J11 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6_d | AD33 | VSS_86 | J12 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7_d | AD34 | VSS_87 | J13 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5_d | AE1 | VSS_88 | J14 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4_u | AE2 | VSS_89 | J15 |
| VSS_290 | AE3 | VSS_90 | J16 |
| HDMI_RX_VPH3V3 | AE4 | VSS_91 | J18 |
| HDMI_RX_DVDD3V3 | AE5 | VSS_92 | J19 |
| AVSS_27 | AE6 | VSS_93 | J20 |
| AVSS_28 | AE7 | VSS_94 | J21 |
| HDMI_RX_AVDD0V75 | AE8 | VSS_95 | J22 |
| AVSS_29 | AE9 | VSS_96 | J23 |
| VSS_291 | AE11 | VSS_97 | J24 |
| VSS_292 | AE12 | VSS_98 | J25 |
| VSS_293 | AE13 | AVSS_3 | J27 |
| VSS_294 | AE14 | AVSS_4 | J28 |
| VSS_295 | AE15 | AVSS_5 | J29 |
| VSS_296 | AE16 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | J30 |
| VSS_297 | AE18 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | J31 |
| VSS_298 | AE19 | AVSS_6 | J32 |
| VSS_299 | AE20 | PCIE20_1_RXP/SATA30_1_RXP | J33 |
| VSS_300 | AE21 | PCIE20_1_RXN/SATA30_1_RXN | J34 |
| VDD_NPU_MEM_0 | AE22 | DDR_CH0_A4_B | K1 |
| VDD_NPU_MEM_1 | AE23 | DDR_CH0_DQ3_B | K2 |
| VSS_301 | AE24 | VSS_99 | K3 |
| VSS_302 | AE26 | DDR_CH0_WCK0N_B | K4 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3_u | AE27 | DDR_CH0_WCK0P_B | K5 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2_d | AE28 | VSS_100 | K6 |
| GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6_d | AE29 | DDR_CH0_RESET_B | K7 |
| CLK32K_OUT1/GPIO2_C5_d | AE30 | VSS_101 | K8 |
| GMAC0_RXDV_CRS/UART7_RTSN_M0/PWM2_M2/SPI3_CS0_M0/GPIO4_C2_d | AE31 | VSS_102 | K9 |
| GMAC0_RXCLK/SDIO_D2_M0/FSPI_D2_M1/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0_u | AE32 | DDR_CH1_VDDQ_0 | K11 |
| GMAC0_TXCLK/SDIO_CLK_M0/FSPI_CLK_M1/I2C3_SDA_M3/GPIO2_B3_d | AE33 | DDR_CH1_VDDQ_1 | K12 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0_d | AE34 | DDR_CH1_VDDQ_2 | K13 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3_u | AF1 | DDR_CH1_VDDQ_3 | K14 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2_u | AF2 | DDR_CH1_VDDQ_4 | K15 |
| HDMI_RX_REXT | AF3 | DDR_CH1_PLL_AVDD1V8 | K16 |
| AVSS_30 | AF4 | VSS_103 | K18 |
| HDMI_RX_CLKN | AF5 | VDD_LOGIC_8 | K19 |
| HDMI_RX_CLKP | AF6 | VDD_LOGIC_9 | K20 |
| AVSS_31 | AF7 | VSS_104 | K21 |
| AVSS_32 | AF8 | VSS_105 | K22 |
| AVSS_33 | AF11 | VDD_CPU_BIG1_9 | K23 |
| AVSS_34 | AF12 | VDD_CPU_BIG1_0 | K24 |
| AVSS_35 | AF13 | AVSS_7 | K26 |
| AVSS_36 | AF14 | PCIE20_SATA30_USB30_2_AVDD_1V8 | K27 |
| AVSS_37 | AF15 | PCIE20_SATA30_USB30_2_AVDD_0V85 | K28 |
| AVSS_38 | AF16 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2_u | K29 |
| TSADC_TEST_OUT_TS | AF18 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1_z | K30 |
| MIPI_D/C_PHY1_VREG | AF19 | AVSS_8 | K31 |
| MIPI_D/C_PHY0_VREG | AF20 | AVSS_9 | K32 |
| AVSS_39 | AF21 | PCIE20_1_TXP/SATA30_1_TXP | K33 |
| VSS_303 | AF22 | PCIE20_1_TXN/SATA30_1_TXN | K34 |
| VSS_304 | AF24 | VSS_106 | L1 |
| VSS_305 | AF25 | DDR_CH0_A5_B | L2 |
| VSS_306 | AF27 | VSS_107 | L3 |
| VSS_307 | AF28 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_B | L4 |
| VSS_308 | AF29 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_B | L5 |
| VSS_309 | AF30 | VSS_108 | L6 |
| VSS_310 | AF31 | DDR_CH0_LP4/4X_CS0_B | L7 |
| VSS_311 | AF32 | DDR_CH0_LP4/4X_CS1_B | L8 |
| GMAC0_TXER/I2C0_SDA_M1/UART7_CTSN_M0/PWM7_IR_M3/SPI3_CLK_M0/GPIO4_C6_d | AF33 | VSS_109 | L9 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/SPI3_CS1_M0/GPIO4_C3_d | AF34 | DDR_CH0_VDDQ_CK | L10 |
| HDMI_TX0_SBDN/eDP_TX0_AUXN | AG1 | DDR_CH1_VDD_0 | L11 |
| HDMI_TX0_SBDP/eDP_TX0_AUXP | AG2 | DDR_CH1_VDD_1 | L12 |
| AVSS_40 | AG3 | DDR_CH1_VDD_2 | L13 |
| HDMI_RX_D0N | AG4 | DDR_CH1_VDD_3 | L14 |
| HDMI_RX_D0P | AG5 | DDR_CH1_PLL_DVDD | L15 |
| AVSS_41 | AG6 | DDR_CH1_PLL_AVSS | L16 |
| AVSS_42 | AG7 | DDR_CH1_VDD_MIF_0 | L17 |
| USB20_HOST0_REXT | AG9 | DDR_CH1_VDD_MIF_1 | L18 |
| AVSS_43 | AG10 | VSS_110 | L19 |
| USB20_AVDD_1V8 | AG11 | VSS_111 | L20 |
| AVSS_44 | AG12 | VSS_112 | L21 |
| TYPEC1_DP1_VDDH_1V8 | AG13 | VSS_113 | L22 |
| TYPEC0_DP0_VDDH_1V8 | AG14 | VDD_CPU_BIG1_8 | L23 |
| AVSS_45 | AG15 | VDD_CPU_BIG1_1 | L24 |
| TYPEC1_DP1_REXT | AG16 | VSS_114 | L25 |
| AVSS_46 | AG18 | AVSS_10 | L26 |
| MIPI_D/C_PHY1_VDD | AG19 | PCIE20_SATA30_1_AVDD_1V8 | L27 |
| MIPI_D/C_PHY0_VDD | AG20 | PCIE20_SATA30_1_AVDD_0V85 | L28 |
| AVSS_47 | AG21 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3_z | L29 |
| AVSS_48 | AG22 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0_z | L30 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/HDMI_RX_CEC_M1/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1_d | AG23 | AVSS_11 | L31 |
| CIF_D15/PCIE30X2_WAKEN_M2/HDMI_RX_SDA_M1/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3_d | AG24 | PCIE20_0_REFCLKP | L32 |
| CIF_D14/PCIE30X2_CLKREQN_M2/HDMI_RX_SCL_M1/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2_d | AG25 | PCIE20_0_REFCLKN | L33 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6_u | AG26 | DDR_CH0_CKB_B | M1 |
| GMAC1_RXD1/MIPI_CAMERA3_CLK_M1/PWM9_M0/GPIO3_B0_u | AG28 | DDR_CH0_CK_B | M2 |
| GMAC1_RXD0/MIPI_CAMERA2_CLK_M1/PWM8_M0/GPIO3_A7_u | AG29 | VSS_115 | M3 |
| VSS_312 | AG30 | DDR_CH0_A1_B | M5 |
| MIPI_CSI1_D0P | AG31 | VSS_116 | M6 |
| MIPI_CSI1_D0N | AG32 | DDR_CH0_A6_B | M7 |
| MIPI_CSI0_D0P | AG33 | DDR_CH0_A0_B | M8 |
| MIPI_CSI0_D0N | AG34 | VSS_117 | M9 |
| HDMI_TX0_D3N/eDP_TX0_D3N | AH2 | DDR_CH0_VDDQ_0 | M10 |
| HDMI_TX0_D3P/eDP_TX0_D3P | AH3 | DDR_CH0_PLL_AVSS | M11 |
| AVSS_49 | AH4 | DDR_CH0_PLL_AVDD1V8 | M12 |
| HDMI_RX_D1N | AH5 | DDR_CH1_VDDQ_CK | M13 |
| HDMI_RX_D1P | AH6 | VSS_118 | M14 |
| AVSS_50 | AH8 | VSS_119 | M15 |
| USB20_HOST1_REXT | AH9 | VDD_CPU_BIG0_0 | M16 |
| USB20_DVDD_0V75 | AH10 | VDD_CPU_BIG0_9 | M17 |
| AVSS_51 | AH11 | VSS_120 | M18 |
| AVSS_52 | AH12 | VDD_CPU_BIG0_MEM_0 | M19 |
| TYPEC1_DP1_VDD_0V85 | AH13 | VSS_121 | M20 |
| TYPEC0_DP0_VDDA_0V85 | AH14 | VDD_CPU_BIG1_MEM_0 | M21 |
| AVSS_53 | AH15 | VSS_122 | M22 |
| TYPEC0_DP0_REXT | AH16 | VDD_CPU_BIG1_7 | M23 |
| SARADC_AVDD_1V8 | AH18 | VDD_CPU_BIG1_2 | M24 |
| MIPI_D/C_PHY1_VDD_1V2 | AH19 | VSS_123 | M25 |
| MIPI_D/C_PHY0_VDD_1V2 | AH20 | AVSS_12 | M26 |
| AVSS_54 | AH21 | PCIE20_SATA30_0_AVDD_1V8 | M27 |
| AVSS_55 | AH22 | PCIE20_SATA30_0_AVDD_0V85 | M28 |
| AVSS_56 | AH23 | TVSS | M29 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0_u | AH24 | PMIC_INT_L/GPIO0_A7_u | M30 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5_u | AH25 | NPOR_u | M31 |
| CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4_u | AH26 | AVSS_13 | M32 |
| ETH1_REFCLKO_25M/MIPI_CAMERA1_CLK_M1/I2C4_SCL_M0/GPIO3_A6_d | AH27 | PCIE20_0_TXN/SATA30_0_TXN | M33 |
| GMAC1_RXDV_CRS/MIPI_CAMERA4_CLK_M1/UART2_TX_M2/PWM2_M1/GPIO3_B1_d | AH29 | PCIE20_0_TXP/SATA30_0_TXP | M34 |
| GMAC1_RXCLK/SDIO_CLK_M1/MIPI_CAMERA0_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5_d | AH30 | DDR_CH0_CKB_A | N1 |
| MIPI_CSI1_D1P | AH31 | DDR_CH0_CK_A | N2 |
| MIPI_CSI1_D1N | AH32 | VSS_124 | N3 |
| MIPI_CSI0_D1P | AH33 | DDR_CH0_A3_B | N4 |
| MIPI_CSI0_D1N | AH34 | DDR_CH0_A2_B | N5 |
| HDMI_TX0_D0N/eDP_TX0_D0N | AJ1 | VSS_125 | N6 |
| HDMI_TX0_D0P/eDP_TX0_D0P | AJ2 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_A | N7 |
| AVSS_57 | AJ3 | DDR_CH0_VDDQ_CKE | N8 |
| HDMI_RX_D2N | AJ4 | VSS_126 | N9 |
| HDMI_RX_D2P | AJ5 | DDR_CH0_VDDQ_1 | N10 |
| AVSS_58 | AJ7 | VSS_127 | N11 |
| AVSS_59 | AJ8 | DDR_CH0_PLL_DVDD | N12 |
| AVSS_60 | AJ9 | DDR_CH0_VDD_MIF_0 | N13 |
| USB20_AVDD_3V3 | AJ10 | VSS_128 | N14 |
| AVSS_61 | AJ11 | VSS_129 | N15 |
| AVSS_62 | AJ12 | VDD_CPU_BIG0_1 | N16 |
| TYPEC1_DP1_VDDA_0V85 | AJ13 | VDD_CPU_BIG0_8 | N17 |
| TYPEC0_DP0_VDD_0V85 | AJ14 | VSS_130 | N18 |
| AVSS_63 | AJ15 | VDD_CPU_BIG0_MEM_1 | N19 |
| AVSS_64 | AJ16 | VSS_131 | N20 |
| AVSS_65 | AJ18 | VDD_CPU_BIG1_MEM_1 | N21 |
| MIPI_D/C_PHY1_VDD_1V8 | AJ19 | VSS_132 | N22 |
| MIPI_D/C_PHY0_VDD_1V8 | AJ20 | VDD_CPU_BIG1_6 | N23 |
| AVSS_66 | AJ21 | VDD_CPU_BIG1_3 | N24 |
| AVSS_67 | AJ22 | VSS_133 | N25 |
| AVSS_68 | AJ23 | VSS_134 | N26 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7_u | AJ24 | OSC_1V8 | N27 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0_u | AJ25 | PMUIO1_1V8 | N28 |
| BT1120_D11/PCIE30X4_WAKEN_M1/HDMI_RX_CEC_M0/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5_d | AJ26 | VSS_135 | N29 |
| BT1120_D12/PCIE30X4_PERSTN_M1/HDMI_RX_HPDIN_M0/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6_d | AJ27 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6_z | N30 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7_u | AJ28 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5_d | N31 |
| VSS_313 | AJ30 | AVSS_14 | N32 |
| MIPI_CSI1_CLK0P | AJ31 | PCIE20_0_RXP/SATA30_0_RXP | N33 |
| MIPI_CSI1_CLK0N | AJ32 | PCIE20_0_RXN/SATA30_0_RXN | N34 |
| MIPI_CSI0_CLK0P | AJ33 | VSS_136 | P1 |
| MIPI_CSI0_CLK0N | AJ34 | DDR_CH0_A5_A | P2 |
| HDMI_TX0_D1N/eDP_TX0_D1N | AK2 | VSS_137 | P3 |
| HDMI_TX0_D1P/eDP_TX0_D1P | AK3 | DDR_CH0_A2_A | P4 |
| AVSS_69 | AK4 | DDR_CH0_A3_A | P5 |
| AVSS_70 | AK5 | VSS_138 | P6 |
| USB20_HOST0_DP | AK6 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_A | P7 |
| AVSS_71 | AK7 | VSS_139 | P8 |
| TYPEC1_USB20_OTG_ID | AK8 | VSS_140 | P9 |
| TYPEC1_USB20_OTG_DP | AK9 | DDR_CH0_VDDQ_2 | P10 |
| AVSS_72 | AK10 | VSS_141 | P11 |
| AVSS_73 | AK11 | DDR_CH0_VDD_3 | P12 |
| AVSS_74 | AK12 | DDR_CH0_VDD_MIF_1 | P13 |
| AVSS_75 | AK13 | VSS_142 | P14 |
| AVSS_76 | AK14 | VSS_143 | P15 |
| SARADC_IN5 | AK15 | VDD_CPU_BIG0_2 | P16 |
| SARADC_IN2 | AK16 | VDD_CPU_BIG0_7 | P17 |
| SARADC_IN7 | AK17 | VSS_144 | P18 |
| MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B | AK18 | VSS_145 | P19 |
| MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A | AK19 | VSS_146 | P20 |
| MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C | AK20 | VSS_147 | P21 |
| MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B | AK21 | VSS_148 | P22 |
| MIPI_DPHY1_RX_D3P/NO_USE | AK22 | VDD_CPU_BIG1_5 | P23 |
| AVSS_77 | AK23 | VDD_CPU_BIG1_4 | P24 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1_d | AK24 | VSS_149 | P25 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2_u | AK25 | VSS_150 | P26 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/PCIE30X2_PERSTN_M1/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0_d | AK26 | PMU_0V75 | P27 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5_d | AK27 | PMUIO2 | P28 |
| VSS_314 | AK28 | I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5_d | P29 |
| VSS_315 | AK29 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5_u | P30 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0_d | AK30 | SDMMC_DET/GPIO0_A4_u | P31 |
| MIPI_CSI1_D2P | AK31 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1_z | P32 |
| MIPI_CSI1_D2N | AK32 | REFCLK_OUT/GPIO0_A0_d | P33 |
| MIPI_CSI0_D2P | AK33 | VSS_151 | P34 |
| MIPI_CSI0_D2N | AK34 | DDR_CH0_A4_A | R1 |
| HDMI_TX0_D2N/eDP_TX0_D2N | AL1 | DDR_CH0_DQ3_A | R2 |
| HDMI_TX0_D2P/eDP_TX0_D2P | AL2 | VSS_152 | R3 |
| AVSS_78 | AL3 | VSS_153 | R5 |
| AVSS_79 | AL4 | DDR_CH0_LP4/4X_CS0_A | R6 |
| AVSS_80 | AL5 | DDR_CH0_LP4/4X_CS1_A | R7 |
| USB20_HOST0_DM | AL6 | VSS_154 | R8 |
| USB20_HOST1_DP | AL7 | VSS_155 | R9 |
| TYPEC1_USB20_VBUSDET | AL8 | DDR_CH0_VDDQ_3 | R10 |
| TYPEC1_USB20_OTG_DM | AL9 | VSS_156 | R11 |
| TYPEC1_SBU1/DP1_AUXP | AL10 | DDR_CH0_VDD_2 | R12 |
| AVSS_81 | AL11 | VSS_157 | R13 |
| TYPEC0_USB20_OTG_DP | AL12 | VDD_VDENC_0 | R14 |
| AVSS_82 | AL13 | VSS_158 | R15 |
| TYPEC0_USB20_OTG_ID | AL14 | VDD_CPU_BIG0_3 | R16 |
| TYPEC0_SBU1/DP0_AUXP | AL15 | VDD_CPU_BIG0_6 | R17 |
| SARADC_IN1 | AL16 | VSS_159 | R18 |
| SARADC_IN6 | AL17 | VSS_160 | R19 |
| MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A | AL18 | VSS_161 | R20 |
| MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C | AL19 | VSS_162 | R21 |
| MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B | AL20 | VSS_163 | R22 |
| MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A | AL21 | VSS_164 | R23 |
| MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C | AL22 | VSS_165 | R24 |
| AVSS_83 | AL23 | VSS_166 | R25 |
| MIPI_CAMERA0_CLK_M0/SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1_u | AL24 | VSS_167 | R26 |
| VSS_316 | AL25 | PMUIO2_1V8 | R27 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4_u | AL26 | VSS_168 | R28 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/PCIE30X2_CLKREQN_M1/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6_d | AL27 | I2S1_SCLK_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6_d | R29 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4_d | AL28 | PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4_d | R30 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3_d | AL29 | PMIC_SLEEP2/GPIO0_A3_d | R31 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1_d | AL30 | PMIC_SLEEP1/GPIO0_A2_d | R32 |
| MIPI_CSI1_D3P | AL31 | VSS_169 | R33 |
| MIPI_CSI1_D3N | AL32 | XIN_24M | R34 |
| MIPI_CSI0_D3P | AL33 | DDR_CH0_DQ2_A | T1 |
| MIPI_CSI0_D3N | AL34 | DDR_CH0_DQ1_A | T2 |
| HDMI/eDP_TX0_REXT | AM2 | VSS_170 | T3 |
| HDMI_TX1_D3P/eDP_TX1_D3P | AM3 | DDR_CH0_RESET_A | T4 |
| AVSS_84 | AM4 | DDR_CH0_A6_A | T5 |
| HDMI_TX1_D1P/eDP_TX1_D1P | AM5 | VSS_171 | T6 |
| USB20_HOST1_DM | AM7 | DDR_CH0_A0_A | T7 |
| AVSS_85 | AM8 | DDR_CH0_A1_A | T8 |
| AVSS_86 | AM9 | VSS_172 | T9 |
| TYPEC1_SBU2/DP1_AUXN | AM10 | DDR_CH0_VDDQ_4 | T10 |
| TYPEC0_USB20_OTG_DM | AM12 | VSS_173 | T11 |
| TYPEC0_USB20_VBUSDET | AM14 | DDR_CH0_VDD_1 | T12 |
| TYPEC0_SBU2/DP0_AUXN | AM15 | VSS_174 | T13 |
| SARADC_IN0_BOOT | AM16 | VDD_VDENC_1 | T14 |
| SARADC_IN4 | AM17 | VSS_175 | T15 |
| AVSS_87 | AM18 | VDD_CPU_BIG0_4 | T16 |
| AVSS_88 | AM20 | VDD_CPU_BIG0_5 | T17 |
| AVSS_89 | AM22 | VSS_176 | T18 |
| AVSS_90 | AM23 | VSS_177 | T19 |
| AVSS_91 | AM24 | VSS_178 | T20 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3_u | AM25 | VDD_CPU_LIT_MEM_1 | T21 |
| AVSS_92 | AM26 | VDD_CPU_LIT_MEM_0 | T22 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/PCIE30X2_WAKEN_M1/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7_d | AM27 | VSS_179 | T23 |
| AVSS_93 | AM28 | VSS_180 | T24 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2_d | AM29 | VSS_181 | T25 |
| VSS_317 | AM30 | VSS_182 | T26 |
| MIPI_CSI1_CLK1P | AM31 | VSS_183 | T27 |
| MIPI_CSI1_CLK1N | AM32 | I2S1_LRCK_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7_d | T28 |
| MIPI_CSI0_CLK1P | AM33 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6_u | T29 |
| MIPI_CSI0_CLK1N | AM34 | PMIC_SLEEP5/GPIO0_C3_d | T30 |
| HDMI/eDP_TX1_REXT | AN1 | PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0_d | T31 |
| HDMI_TX1_SBDP/eDP_TX1_AUXP | AN2 | PMIC_SLEEP4/GPIO0_C2_d | T32 |
| HDMI_TX1_D0P/eDP_TX1_D0P | AN4 | VSS_184 | T33 |
| HDMI_TX1_D1N/eDP_TX1_D1N | AN5 | XOUT_24M | T34 |
| HDMI_TX1_D2P/eDP_TX1_D2P | AN6 | DDR_CH0_DQ0_A | U1 |
| AVSS_94 | AN7 | DDR_CH0_DQ7_A | U2 |
| TYPEC1_SSRX1P/DP1_TX0P | AN8 | VSS_185 | U3 |
| TYPEC1_SSTX1N/DP1_TX1N | AN9 | DDR_CH0_DQS0N_A | U4 |
| TYPEC1_SSRX2P/DP1_TX2P | AN10 | DDR_CH0_DQS0P_A | U5 |
| TYPEC1_SSTX2N/DP1_TX3N | AN11 | DDR_CH0_VDD_0 | U11 |
| AVSS_95 | AN12 | VSS_186 | U12 |
| TYPEC0_SSRX1P/DP0_TX0P | AN13 | VSS_187 | U13 |
| TYPEC0_SSTX1N/DP0_TX1N | AN14 | VDD_VDENC_2 | U14 |
| TYPEC0_SSRX2P/DP0_TX2P | AN15 | VSS_188 | U15 |
| TYPEC0_SSTX2N/DP0_TX3N | AN16 | VSS_189 | U16 |
| SARADC_IN3 | AN17 | VSS_190 | U17 |
| MIPI_DPHY1_TX_D0P/MIPI_CPHY1_TX_TRIO0_B | AN18 | PLL_AVDD1V8 | U18 |
| MIPI_DPHY1_TX_D1P/MIPI_CPHY1_TX_TRIO1_A | AN19 | PLL_AVSS | U19 |
| MIPI_DPHY1_TX_CLKP/MIPI_CPHY1_TX_TRIO1_C | AN20 | VSS_191 | U20 |
| MIPI_DPHY1_TX_D2P/MIPI_CPHY1_TX_TRIO2_B | AN21 | VDD_CPU_LIT_7 | U21 |
| MIPI_DPHY1_TX_D3P/NO_USE | AN22 | VDD_CPU_LIT_0 | U22 |
| AVSS_96 | AN23 | VSS_192 | U23 |
| MIPI_DPHY0_TX_D0P/MIPI_CPHY0_TX_TRIO0_B | AN24 | VSS_193 | U24 |
| MIPI_DPHY0_TX_D1P/MIPI_CPHY0_TX_TRIO1_A | AN25 | VSS_194 | U30 |
| MIPI_DPHY0_TX_CLKP/MIPI_CPHY0_TX_TRIO1_C | AN26 | VSS_195 | U31 |
| MIPI_DPHY0_TX_D2P/MIPI_CPHY0_TX_TRIO2_B | AN27 | PMIC_SLEEP3/GPIO0_C1_d | U32 |
| MIPI_DPHY0_TX_D3P/NO_USE | AN28 | LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3_u | U33 |
| MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B | AN29 | VSS_196 | U34 |
| HDMI_TX1_D3N/eDP_TX1_D3N | AN3 | DDR_CH0_DQ6_A | V1 |
| MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A | AN30 | DDR_CH0_DQ5_A | V2 |
| AVSS_97 | AN31 | VSS_197 | V3 |
| MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C | AN32 | VSS_198 | V4 |
| MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B | AN33 | VSS_199 | V5 |
| MIPI_DPHY0_RX_D3P/NO_USE | AN34 | DDR_CH0_WCK0N_A | V6 |
| AVSS_98 | AP1 | DDR_CH0_WCK0P_A | V7 |
| HDMI_TX1_D0N/eDP_TX1_D0N | AP4 | VSS_200 | V8 |
| HDMI_TX1_D2N/eDP_TX1_D2N | AP6 | VSS_201 | V9 |
| TYPEC1_USB20_OTG1_REXT | AP7 | VSS_202 | V10 |
| TYPEC1_SSRX1N/DP1_TX0N | AP8 | VSS_203 | V11 |
| TYPEC1_SSTX1P/DP1_TX1P | AP9 | VDD_VDENC_MEM_0 | V12 |
| TYPEC1_SSRX2N/DP1_TX2N | AP10 | VDD_VDENC_MEM_1 | V13 |
| TYPEC1_SSTX2P/DP1_TX3P | AP11 | VDD_VDENC_3 | V14 |
| TYPEC0_USB20_OTG0_REXT | AP12 | VSS_204 | V15 |
| TYPEC0_SSRX1N/DP0_TX0N | AP13 | VDD_LOGIC_6 | V16 |
| TYPEC0_SSTX1P/DP0_TX1P | AP14 | VDD_LOGIC_7 | V17 |
| TYPEC0_SSRX2N/DP0_TX2N | AP15 | VSS_205 | V18 |
| TYPEC0_SSTX2P/DP0_TX3P | AP16 | VSS_206 | V19 |
| AVSS_99 | AP17 | PLL_DVDD0V75 | V20 |
| MIPI_DPHY1_TX_D0N/MIPI_CPHY1_TX_TRIO0_A | AP18 | VDD_CPU_LIT_6 | V21 |
| MIPI_DPHY1_TX_D1N/MIPI_CPHY1_TX_TRIO0_C | AP19 | VDD_CPU_LIT_1 | V22 |
| HDMI_TX1_SBDN/eDP_TX1_AUXN | AP2 | VSS_207 | V23 |
| MIPI_DPHY1_TX_CLKN/MIPI_CPHY1_TX_TRIO1_B | AP20 | VSS_208 | V24 |
| MIPI_DPHY1_TX_D2N/MIPI_CPHY1_TX_TRIO2_A | AP21 | VSS_209 | V25 |
| MIPI_DPHY1_TX_D3N/MIPI_CPHY1_TX_TRIO2_C | AP22 | EMMCIO_1V8 | V26 |
| AVSS_100 | AP23 | VSS_210 | V27 |
| MIPI_DPHY0_TX_D0N/MIPI_CPHY0_TX_TRIO0_A | AP24 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5_u | V28 |
| MIPI_DPHY0_TX_D1N/MIPI_CPHY0_TX_TRIO0_C | AP25 | I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/PCIE30X2_PERSTN_M0/SATA_CPDET/GPIO0_D4_u | V29 |
| MIPI_DPHY0_TX_CLKN/MIPI_CPHY0_TX_TRIO1_B | AP26 | VSS_211 | V30 |
| MIPI_DPHY0_TX_D2N/MIPI_CPHY0_TX_TRIO2_A | AP27 | I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7_d | V31 |
| MIPI_DPHY0_TX_D3N/MIPI_CPHY0_TX_TRIO2_C | AP28 | EMMC_D2/FSPI_D2_M0/GPIO2_D2_u | V32 |
| MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A | AP29 | EMMC_D7/FSPI_CS1N_M0/GPIO2_D7_u | V33 |
| MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C | AP30 | EMMC_CLKOUT/GPIO2_A1_d | V34 |
| MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B | AP31 | DDR_CH0_DQ4_A | W1 |
| MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A | AP32 | VSS_212 | W2 |
| MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C | AP33 | VSS_213 | W3 |
| AVSS_101 | AP34 | DDR_CH0_WCK1P_A | W4 |
| DDR_CH0_DQ11_B | B1 | DDR_CH0_WCK1N_A | W5 |
| DDR_CH1_DQ11_C | B2 | VSS_214 | W6 |
| DDR_CH1_DQ9_C | B3 | VSS_215 | W7 |
| DDR_CH1_DQ15_C | B4 | DDR_CH0_ZQ_A | W8 |
| DDR_CH1_DQ13_C | B5 | VSS_216 | W9 |
| VSS_5 | B6 | VSS_217 | W10 |
| DDR_CH1_DQ5_C | B7 | VSS_218 | W11 |
| DDR_CH1_DQ7_C | B8 | VSS_219 | W12 |
| DDR_CH1_DQ1_C | B9 | VDD_VDENC_5 | W13 |
| DDR_CH1_DQ3_C | B10 | VDD_VDENC_4 | W14 |
| DDR_CH1_A5_C | B11 | VSS_220 | W15 |
| DDR_CH1_CK_C | B12 | VSS_221 | W16 |
| DDR_CH1_CK_D | B13 | VSS_222 | W17 |
| DDR_CH1_A5_D | B14 | VSS_223 | W18 |
| DDR_CH1_DQ3_D | B15 | VSS_224 | W19 |
| DDR_CH1_DQ1_D | B16 | VSS_225 | W20 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_LIT_5 | W21 |
| DDR_CH1_DQ5_D | B18 | VDD_CPU_LIT_2 | W22 |
| VSS_6 | B19 | VSS_226 | W23 |
| DDR_CH1_DQ13_D | B20 | VSS_227 | W24 |
| DDR_CH1_DQ15_D | B21 | VCCIO5_1V8 | W25 |
| DDR_CH1_DQ9_D | B22 | VCCIO5 | W26 |
| DDR_CH1_DQ11_D | B23 | VSS_228 | W27 |
| VSS_7 | B24 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6_d | W28 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4_d | B25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/HDMI_RX_SCL_M0/SPI3_MOSI_M2/PCIE30X2_WAKEN_M0/HDMI_TX1_CEC_M1/GPIO0_D2_u | W29 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5_d | B26 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/HDMI_RX_SDA_M0/SPI0_CS0_M0/PCIE30X2_CLKREQN_M0/HDMI_TX0_CEC_M1/GPIO0_D1_u | W30 |
| VSS_8 | B27 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0_d | W31 |
| PCIE30_PORT1_REF_CLKN | B28 | EMMC_D6/FSPI_CS0N_M0/GPIO2_D6_u | W32 |
| PCIE30_PORT1_TX1N | B29 | EMMC_D1/FSPI_D1_M0/GPIO2_D1_u | W33 |
| PCIE30_PORT1_TX0P | B30 | EMMC_CMD/FSPI_CLK_M0/GPIO2_A0_u | W34 |
| PCIE30_PORT1_RX1N | B31 | DDR_CH0_DQ12_A | Y1 |
| PCIE30_PORT1_RX0P | B32 | DDR_CH0_DQ13_A | Y2 |
| VSS_9 | B33 | VSS_229 | Y3 |
| PCIE30_PORT0_RESREF | B34 | DDR_CH0_DM0_A | Y4 |
| DDR_CH0_DQ9_B | C1 | VSS_230 | Y5 |
| DDR_CH0_DQ10_B | C2 | VSS_231 | Y6 |
| VSS_10 | C3 | VCCIO2 | Y7 |
| VSS_11 | C4 | VSS_232 | Y8 |
| VSS_17 | C10 | VSS_233 | Y9 |
| VSS_18 | C11 | VSS_234 | Y10 |
| VSS_19 | C12 | VSS_235 | Y11 |
| VSS_20 | C13 | VSS_236 | Y12 |
| VSS_21 | C14 | VSS_237 | Y13 |
| VSS_22 | C15 | VSS_238 | Y14 |
| VSS_23 | C16 | VSS_239 | Y15 |
| VSS_24 | C17 | VSS_240 | Y16 |
| VSS_25 | C18 | VSS_241 | Y17 |
| DDR_CH1_RESET_D | C19 | VSS_242 | Y18 |
| VSS_26 | C20 | VSS_243 | Y19 |
| VSS_27 | C21 | VSS_244 | Y20 |
| VSS_28 | C22 | VDD_CPU_LIT_4 | Y21 |
| VSS_29 | C23 | VDD_CPU_LIT_3 | Y22 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6_d | C24 | VSS_245 | Y23 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7_u | C25 | VSS_246 | Y24 |
| VSS_30 | C26 | VCCIO3_1V8 | Y26 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0_u | C27 | GMAC1_PPSCLK/PCIE30X2_BUTTON_RSTN/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1_d | Y27 |
| VSS_31 | C28 | VSS_247 | Y28 |
| PCIE30_PORT1_TX1P | C29 | GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0_d | Y29 |
| VSS_32 | C30 | GMAC1_MDIO/MIPI_TE1/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3_d | Y30 |
| PCIE30_PORT1_RX1P | C31 | GMAC1_MDC/MIPI_TE0/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2_d | Y31 |
| VSS_33 | C32 | EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4_u | Y32 |
| PCIE30_PORT0_TX1P | C33 | EMMC_D0/FSPI_D0_M0/GPIO2_D0_u | Y33 |
| PCIE30_PORT0_TX1N | C34 | EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2_d | Y34 |

## 3. Electrical specifications

### 3.1 Absolute ratings

| Parameters | Related Power Group | Min | Max | Unit |
| --- | --- | --- | --- | --- |
| Supply voltage for CPU | VDD_CPU_BIG0 VDD_CPU_BIG1 VDD_CPU_LIT | -0.3 | 1.1 | V |
| Supply voltage for CPU memory | VDD_CPU_BIG0_MEM VDD_CPU_BIG1_MEM VDD_CPU_LIT_MEM | -0.3 | 1.1 | V |
| Supply voltage for GPU | VDD_GPU | -0.3 | 1.1 | V |
| Supply voltage for GPU memory | VDD_GPU_MEM | -0.3 | 1.1 | V |
| Supply voltage for NPU | VDD_NPU | -0.3 | 1.1 | V |
| Supply voltage for NPU memory | VDD_NPU_MEM | -0.3 | 1.1 | V |
| Supply voltage for VCODEC | VDD_VDENC | -0.3 | 0.95 | V |
| Supply voltage for VCODEC memory | VDD_VDENC_MEM | -0.3 | 0.95 | V |
| Supply voltage for core logic | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V supply voltage | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI/eDP_TX0_VDD_0V75 HDMI/eDP_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 HDMI_RX_AVDD0V75 MIPI_CSI0_AVCC0V75 MIPI_CSI1_AVCC0V75 PCIE30_PORT0_AVDD0V75 PCIE30_PORT1_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V supply voltage | DDR_CH0_VDD DDR_CH0_VDD_MIF DDR_CH0_PLL_DVDD DDR_CH1_VDD DDR_CH1_VDD_MIF DDR_CH1_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 TYPEC1_DP1_VDD_0V85 TYPEC1_DP1_VDDA_0V85 MIPI_D/C_PHY0_VDD MIPI_D/C_PHY1_VDD PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.2V supply voltage | MIPI_D/C_PHY0_VDD_1V2 MIPI_D/C_PHY1_VDD_1V2 | -0.3 | 1.35 | V |
| 1.8V supply voltage | DDR_CH0_PLL_AVDD1V8 DDR_CH1_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 TYPEC1_DP1_VDDH_1V8 HDMI/eDP_TX0_VDD_CMN_1V8 HDMI/eDP_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 MIPI_CSI0_AVCC1V8 MIPI_CSI1_AVCC1V8 MIPI_D/C_PHY0_VDD_1V8 MIPI_D/C_PHY1_VDD_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 PCIE30_PORT1_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V supply voltage | USB20_AVDD_3V3 HDMI_RX_DVDD3V3 HDMI_RX_VPH3V3 | -0.5 | 3.63 | V |
| 1.8V only GPIO supply voltage | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| 1.8V/3.3V GPIO supply voltage | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Supply voltage for DDR IO (LPDDR4/4X 0.6V; LPDDR5/5X 0.5V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Supply voltage for DDR IO (LPDDR4/4X 1.1V; LPDDR5/5X 1.05V) | DDR_CH0_VDDQ_CKE DDR_CH1_VDDQ_CKE | -0.3 | 1.25 | V |
| Storage Temperature | Tstg | -40 | 125 | ℃ |
| Max Conjunction Temperature | Tj | NA | 125 | ℃ |

Exceeding an absolute maximum or minimum can permanently damage the device. Prolonged exposure to absolute maximum conditions can impair reliability.

### 3.2 Recommended operating conditions

| Parameters | Symbol | Min | Typ | Max① | Unit |
| --- | --- | --- | --- | --- | --- |
| Voltage for CPU BigCore 0 & memory | VDD_CPU_BIG0 & VDD_CPU_BIG0_MEM | 0.675 | 0.75 | 0.95 | V |
| Voltage for CPU BigCore 1 & memory | VDD_CPU_BIG1 & VDD_CPU_BIG1_MEM | 0.675 | 0.75 | 0.95 | V |
| Voltage for CPU LitCore and DSU | VDD_CPU_LIT & VDD_CPU_LIT_MEM | 0.675 | 0.75 | 0.95 | V |
| Voltage for GPU & memory | VDD_GPU & VDD_GPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Voltage for NPU & memory | VDD_NPU & VDD_NPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Voltage for VCODEC & memory | VDD_VDENC | 0.675 | 0.75 | 0.825 | V |
| Voltage for Logic | VDD_LOGIC | 0.65 | 0.75 | 0.8 | V |
| Voltage for PMU | PMU_0V75 | 0.7 | 0.75 | 0.8 | V |
| Digital GPIO Power (1.8V only) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.89 | V |
| Digital GPIO Power (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| eMMC IO Power (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.89 | V |
| DDR CH0 Logic power(0.85V) | DDR_CH0_VDD, DDR_CH0_VDD_MIF, DDR_CH1_VDD, DDR_CH1_VDD_MIF, | 0.675 | 0.85 | 0.935 | V |
| DDR CH0_PLL power(0.85V) | DDR_CH0_PLL_DVDD, DDR_CH1_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
| DDR CH0_PLL power(1.8V) | DDR_CH0_PLL_AVDD1V8, DDR_CH1_PLL_AVDD1V8 | 1.62 | 1.8 | 1.89 | V |
| LPDDR4 IO VDDQ power | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 Retention IO VDDQ Power | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| LPDDR5 IO VDDQ power | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.475 | 0.5 | 0.525 | V |
| LPDDR5 Retention IO VDDQ Power | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.0 | 1.05 | 1.1 | V |
| PLL Analog Power(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Analog Power(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.89 | V |
| USB 2.0 Analog Power (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Analog Power (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.89 | V |
| USB 2.0 Analog Power (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Analog Power (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85, TYPEC1_DP1_VDD_0V85, TYPEC1_DP1_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Analog Power (1.8V) | TYPEC0_DP0_VDDH_1V8, TYPEC1_DP1_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Analog Power(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Analog Power(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.89 | V |
| PCIe30 Analog Power(0.75V) | PCIE30_PORT0_AVDD0V75, PCIE30_PORT1_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Analog Power(1.8V) | PCIE30_PORT0_AVDD1V8, PCIE30_PORT1_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| MIPI CSI DPHY Analog Power(0.75V) | MIPI_CSI0_AVCC0V75, MIPI_CSI1_AVCC0V75 | 0.675 | 0.75 | 0.825 | V |
| MIPI CSI DPHY Analog Power(1.8V) | MIPI_CSI0_AVCC1V8, MIPI_CSI1_AVCC1V8 | 1.62 | 1.8 | 1.89 | V |
| MIPI DCPHY Analog Power (0.85V) | MIPI_D/C_PHY0_VDD, MIPI_D/C_PHY1_VDD | 0.7125 | 0.85 | 0.8925 | V |
| MIPI DCPHY Analog Power (1.2V) | MIPI_D/C_PHY0_VDD_1V2, MIPI_D/C_PHY1_VDD_1V2 | 1.14 | 1.2 | 1.26 | V |
| MIPI DCPHY Analog Power (1.8V) | MIPI_D/C_PHY0_VDD_1V8, MIPI_D/C_PHY1_VDD_1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI RX Analog Power(0.75V) | HDMI_RX_AVDD0V75 | 0.675 | 0.75 | 0.825 | V |
| HDMI RX Analog Power(3.3V) | HDMI_RX_DVDD3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI RX Analog Power(3.3V) | HDMI_RX_VPH3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI/eDP TX Digital Power (0.75V) | HDMI/eDP_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analog Power (0.75V) | HDMI/eDP_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Analog Power (1.8V) | HDMI/eDP_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.89 | V |
| HDMI/eDP TX Analog Power (1.8V) | HDMI/eDP_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.89 | V |
| SARADC Analog Power(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.89 | V |
| OTP Analog Power(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Analog Power(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| OSC input clock frequency |  | NA | 24 | NA | MHz |
| Max CPU A76 frequency |  | NA | NA | 2.0 | GHz |
| Max CPU A55 frequency |  | NA | NA | 1.7 | GHz |
| Max GPU frequency |  | NA | NA | 1.0 | GHz |
| Max NPU frequency |  | NA | NA | 950 | MHz |
| Ambient Operating Temperature① | TA | -40 | NA | 85 | ℃ |

Note①: Voltage depends on frequency; strictly follow the SDK configuration and hardware reference design. The normal-mode maximum CPU/GPU/NPU voltage is0.75V; supply ripple should remain within ±5%.

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

### 3.4 General IO electrical characteristics

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

Notes to 3.3 and 3.4: VDDO and DVDD both denote IO power supplies. Negative pull-up currents retain their original MIN/MAX placement; do not swap the columns.

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

### 3.7 MIPI CDPHY

| Parameters | Symbol | Description | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LP-RX | VIH | Logic1 input voltage | All conditions | 880 | NA | NA | mV |
| LP-RX | VIL | Logic0 input voltage, not in ULPS state | All conditions | NA | NA | 550 | mV |
| Skew Calibration | Tskewcal (initial) | Duration for which the transmitter drives the skew-calibration pattern in the initial skew calibration mode | >1.5Gbps | NA | NA | 100 | us |
| Skew Calibration | Tskewcal (initial) | Duration for which the transmitter drives the skew-calibration pattern in the initial skew calibration mode | >1.5Gbps | 2^15 | NA | NA | UI |
| Skew Calibration | Tskewcal (periodic) | Duration for which the transmitter drives the skew-calibration pattern in the periodic skew calibration mode | >1.5Gbps (optional) | NA | NA | 10 | us |
| Skew Calibration | Tskewcal (periodic) | Duration for which the transmitter drives the skew-calibration pattern in the periodic skew calibration mode | >1.5Gbps (optional) | 2^13 | NA | NA | UI |

### 3.8 MIPI CSI DPHY

| Parameters | Symbol | Min | Typ | Max | Units |
| --- | --- | --- | --- | --- | --- |
| Common-mode interference beyond 450 MHz | ΔVCMRX(HF) | NA | NA | 100 | mV |
| Common-mode interference beyond 450 MHz | ΔVCMRX(HF) | NA | NA | 50 | mV |
| Common-mode interference 50MHz-450MHz | ΔVCMRX(LF) | -50 | NA | 50 | mV |
| Common-mode interference 50MHz-450MHz | ΔVCMRX(LF) | -25 | NA | 25 | mV |
| Common-mode termination | CCM | NA | NA | 60 | pF |
| Input pulse rejection | eSPIKE | NA | NA | 300 | V.ps |
| Minimum pulse width response | TMIN-RX | 20 | NA | NA | ns |
| Peak interference amplitude | VINT | NA | NA | 200 | mV |
| Interference frequency | fINT | 450 | NA | NA | MHz |

### 3.9 SARADC

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Resolution |  |  | NA | 12 | NA | Bit |
| Anglog Input Range | AIN |  | AVSS18 | NA | AVDD18 | V |
| Differential Non-Linearity | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±1.0 | ±3.0 | LSB |
| Integral Non-Linearity | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±2.0 | ±6.0 | LSB |
| Top Offset Voltage Error | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±10 | ±20 | LSB |
| Bottom Offset Voltage Error | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz ramp wave | NA | ±10 | ±20 | LSB |

### 3.10 TSADC

| Parameters | Symbol | Test condition | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Accuracy from -40℃ to 125℃ | TJACC | Temp: -40 ~ 125℃ Supply: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Sensing Temperature Range | TRANGE |  | -40 | NA | 125 | ℃ |
| Resolution | TLSB |  | NA | 1 | NA | ℃ |

## 4. Thermal management

For reliability and operation, the absolute maximum junction temperature must remain below 125°C. The package thermal values are simulation references and must be checked against physical testing. The reference PCB has 10 layers, dimensions 114mm x 101mm, at 25°C ambient.

| Parameter | Symbol | Typical | Unit |
| --- | --- | --- | --- |
| Junction-to-ambient thermal resistance | 𝜽 𝑱𝑨 | 8.7 | (℃/𝑾) |
| Junction-to-board thermal resistance | 𝜽 𝑱𝑩 | 3.5 | (℃/𝑾) |
| Junction-to-case thermal resistance | 𝜽 𝑱𝑪 | 0.12 | (℃/𝑾) |

## Version reconciliation

Rev1.1 did not list LPDDR5X; its memory grades were LPDDR4-4266/LPDDR4X-4266/LPDDR5-4800. Rev1.3 adds LPDDR5X and HDMI/DP/MIPI/VOP timing requirements. Rev1.1 names PMUIO2_1V8/VCCIO2_1V8/VCCIO4_1V8/VCCIO5_1V8/VCCIO6_1V8 in absolute and recommended supplies; Rev1.3 names PMUIO2/VCCIO2/VCCIO4/VCCIO5/VCCIO6 with unchanged numeric limits. These are versioned labels, not instructions to substitute rails on a board. Older automotive entertainment wording is retained in the overview. The newer diagram adds LPDDR5X; its other technical blocks remain covered here.

## Source qualifications

The block diagram labels six SPI blocks; §1.2.13 specifies five SPI controllers SPI0–SPI4. The source gives two HF common-mode-interference maxima and two LF ranges without conditions; all rows remain. Absolute maximum junction temperature is 125°C in the table, while thermal prose requires below125°C. This datasheet provides no register-map chapter.

## Official references

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
