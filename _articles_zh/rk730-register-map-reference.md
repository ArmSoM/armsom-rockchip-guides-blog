---
title: "RK730 寄存器速查：65 个地址、复位值与关键控制域"
description: "完整恢复数据手册寄存器汇总，解释模拟电源、ADC/DAC、音量和 I2S 控制的核对方法。"
excerpt: "完整恢复数据手册寄存器汇总，解释模拟电源、ADC/DAC、音量和 I2S 控制的核对方法。"
translation_key: "rk730-register-map-reference"
slug: "rk730-register-map-reference"
lang: "zh"
date: "2026-11-10"
author: "ArmSoM Editorial"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK730", "datasheet", "hardware design", "ArmSoM"]
image: "/assets/datasheet-series-20261110/rk730-datasheet-p10.png"
---

本文基于指定版本数据手册整理。表中数值是原厂规格，不是 ArmSoM 实测；未新增硬件验证。使用前核对实际芯片版本、板卡原理图、SDK/BSP、内核和驱动。专题解释与可编辑表格用于辅助阅读，完整规范及未展开的位定义请查阅原始 PDF。

**RK730 · Rockchip RK730 Datasheet V1.0-20241118.pdf · PDF 20–43.**


[![RK730 寄存器速查：65 个地址、复位值与关键控制域](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)](/assets/datasheet-series-20261110/rk730-datasheet-p10.png)

*英文原图，来源 PDF 第 10.*


## 总线地址、寄存器地址与位域

CE 决定 0x16/0x17 的 I2C 地址；下表的 0x0000 等是寄存器偏移。B 表示 8-bit，不能因偏移写了四位十六进制就假设 16-bit 数据。复位值不是初始化完成值，读写属性也必须按位域章节检查。保留地址间隙，不假设所有中间地址都可写。

## 完整寄存器汇总



| 寄存器 | 偏移 | 宽度 | 复位值 |
|---|---|---|---|
| `CODEC_HK_TOP_0` | `0x0000` | `B` | `0x08` |
| `CODEC_HK_TOP_1` | `0x0001` | `B` | `0xC0` |
| `CODEC_HK_TOP_2` | `0x0002` | `B` | `0x00` |
| `CODEC_HK_TRIM` | `0x0003` | `B` | `0x00` |
| `CODEC_ADC_0` | `0x0004` | `B` | `0x03` |
| `CODEC_ADC_1` | `0x0005` | `B` | `0x42` |
| `CODEC_ADC_2` | `0x0006` | `B` | `0x02` |
| `CODEC_ADC_3` | `0x0007` | `B` | `0x05` |
| `CODEC_DAC_0` | `0x0008` | `B` | `0x07` |
| `CODEC_DAC_1` | `0x0009` | `B` | `0x70` |
| `CODEC_MIC_BOOST_0` | `0x000a` | `B` | `0x01` |
| `CODEC_MIC_BOOST_1` | `0x000b` | `B` | `0x01` |
| `CODEC_MIC_BOOST_2` | `0x000c` | `B` | `0x01` |
| `CODEC_MIC_BOOST_3` | `0x000d` | `B` | `0x01` |
| `CODEC_ADC_PGA_BLOCK_0` | `0x000e` | `B` | `0x01` |
| `CODEC_ADC_PGA_BLOCK_1` | `0x000f` | `B` | `0x01` |
| `CODEC_SYSPLL_0` | `0x0010` | `B` | `0xff` |
| `CODEC_SYSPLL_3` | `0x0013` | `B` | `0x04` |
| `CODEC_LDO` | `0x001f` | `B` | `0x11` |
| `CODEC_MIC_BIAS` | `0x0020` | `B` | `0x09` |
| `CODEC_HP_0` | `0x0021` | `B` | `0xAC` |
| `CODEC_HP_1` | `0x0022` | `B` | `0x80` |
| `CODEC_HP_2` | `0x0023` | `B` | `0x00` |
| `CODEC_SPK_0` | `0x0024` | `B` | `0xAC` |
| `CODEC_SPK_1` | `0x0025` | `B` | `0x80` |
| `CODEC_DTOP_DIGEN_CLKE` | `0x0040` | `B` | `0x00` |
| `CODEC_DTOP_SRT` | `0x0041` | `B` | `0x00` |
| `CODEC_DADC_SEL` | `0x0042` | `B` | `0x00` |
| `CODEC_DDAC_SEL` | `0x0043` | `B` | `0x88` |
| `CODEC_DTOP_VUCTL` | `0x0044` | `B` | `0x03` |
| `CODEC_DTOP_VUCTIME` | `0x0045` | `B` | `0xFF` |
| `CODEC_DADC_VOLL` | `0x0046` | `B` | `0x00` |
| `CODEC_DADC_VOLR` | `0x0047` | `B` | `0x00` |
| `CODEC_DDAC_VOLL` | `0x0048` | `B` | `0x00` |
| `CODEC_DDAC_VOLR` | `0x0049` | `B` | `0x00` |
| `CODEC_DADC_RVOLL` | `0x004a` | `B` | `0xFF` |
| `CODEC_DADC_RVOLR` | `0x004b` | `B` | `0xFF` |
| `CODEC_DDAC_RVOLL` | `0x004c` | `B` | `0xFF` |
| `CODEC_DDAC_RVOLR` | `0x004d` | `B` | `0xFF` |
| `CODEC_DADC_FILTER` | `0x004e` | `B` | `0x1E` |
| `CODEC_DDAC_FILTER` | `0x004f` | `B` | `0xF4` |
| `CODEC_DDAC_PREL` | `0x0050` | `B` | `0x00` |
| `CODEC_DDAC_PRER` | `0x0051` | `B` | `0x00` |
| `CODEC_DDAC_POSTL` | `0x0052` | `B` | `0x1F` |
| `CODEC_DDAC_POSTR` | `0x0053` | `B` | `0x1F` |
| `CODEC_DDAC_DRC0` | `0x005e` | `B` | `0x9A` |
| `CODEC_DDAC_DRC1` | `0x005f` | `B` | `0xCC` |
| `CODEC_DDAC_DRC2` | `0x0060` | `B` | `0x1F` |
| `CODEC_DDAC_DRC3` | `0x0061` | `B` | `0xCC` |
| `CODEC_DDAC_DRC4` | `0x0062` | `B` | `0x0E` |
| `CODEC_DDAC_DRC5` | `0x0063` | `B` | `0x08` |
| `CODEC_DDAC_DRC6` | `0x0064` | `B` | `0x06` |
| `CODEC_DDAC_DRC7` | `0x0065` | `B` | `0x02` |
| `CODEC_DDAC_DRC8` | `0x0066` | `B` | `0x05` |
| `CODEC_DDAC_DRC9` | `0x0067` | `B` | `0x01` |
| `CODEC_READ1` | `0x0068` | `B` | `0x00` |
| `CODEC_DI2S_CKM` | `0x0069` | `B` | `0x01` |
| `CODEC_DI2S_OFFSET` | `0x006a` | `B` | `0x00` |
| `CODEC_DI2S_RSD` | `0x006b` | `B` | `0x00` |
| `CODEC_DI2S_RXCR1` | `0x006c` | `B` | `0x00` |
| `CODEC_DI2S_RXCR2` | `0x006d` | `B` | `0x17` |
| `CODEC_DI2S_RXCMD_TSD` | `0x006e` | `B` | `0x00` |
| `CODEC_DI2S_TXCR1` | `0x006f` | `B` | `0x00` |
| `CODEC_DI2S_TXCR2` | `0x0070` | `B` | `0x17` |
| `CODEC_DI2S_TXCR3_TXCMD` | `0x0071` | `B` | `0x00` |



## 按控制域建立驱动映射



| 项目 | 规格／原稿说明 |
|---|---|
| HK_TOP / 0x0000–0x0003 | 参考、振荡器、偏置与模拟控制 |
| ADC / 0x0004–0x0007 | 模拟 ADC 电源与控制 |
| DAC / 0x0008–0x0009 | 模拟 DAC 电源与控制 |
| MIC / PGA / 0x000a–0x000f | 麦克风增益与前置放大 |
| 0x0010 / 0x0013 / 0x001f | 系统 PLL、PLL 控制、偏置；不连续 |
| 0x0020–0x0025 | 耳机模拟输出控制 |
| 0x0040–0x0053 | 数字 ADC/DAC、采样率、音量与滤波 |
| 0x005e–0x0071 | AGC、混合与 I2S；以汇总表实际地址为准 |



## 示例：HK_TOP_0 并非一个整字节开关



| 项目 | 规格／原稿说明 |
|---|---|
| 0x0000[7] / [6] | VREF／OSC 测试控制 |
| 0x0000[5:4] | VAG: 0x0=1.6 V; 0x1=1.52 V; 0x2=1.7 V; 0x3=1.8 V |
| 0x0000[3] | 振荡器使能；复位为 1 |
| 0x0000[2] | 半电流模式控制 |
| 0x0000[1:0] | DAC chop: 0 / 200 / 400 / 800 kHz |
| 0x0001[7] / [6] | VAG／DAC 缓冲掉电位，复位为 1 |



## 如何安全地使用这张速查表

先确认寄存器可读写属性，再通过驱动的掩码更新逻辑修改目标位，保留其他位。表中复位值来自第 20–21 页，不能替代第 21–43 页完整位定义。麦克风增益编码并非线性步长，不能按“编码 × 固定 dB”推算；PLL、数字滤波和 AGC 也必须回查对应定义。建议在断电复位、驱动初始化和启停后分别记录寄存器差异，定位是哪一层控制改变了状态。本文不提供未经板级验证的整片寄存器写入脚本。

## ArmSoM 产品与应用边界

CM1 和 Forge1 可作为音频外设方案的平台参考。本文不宣称它们板载 RK730，也未验证 RK730 驱动可直接使用；须先核对连接器是否引出所需 I2S、I2C、时钟与电压。

- [CM1](https://www.armsom.org/cm1) · [Docs](https://docs.armsom.org/armsom-cm1)
- [Forge1](https://www.armsom.org/forge1) · [Docs](https://docs.armsom.org/armsom-forge1)

## 数据手册专题与原始 PDF

- [RK730 总览](/zh/articles/rk730-audio-codec-design/)
- [RK730 封装、引脚与供电：QFN28 音频 Codec 设计入口](/zh/articles/rk730-package-power-pinout/)
- [RK730 时钟与音频路径：PLL、I2S、侧音和 I2C 地址](/zh/articles/rk730-clocks-audio-i2c/)
- [RK730 寄存器速查：65 个地址、复位值与关键控制域](/zh/articles/rk730-register-map-reference/)
- [RK730 启停流程：系统电源、ADC 录音与 DAC 播放](/zh/articles/rk730-power-adc-dac-sequences/)
- [下载完整原始 PDF](/assets/datasheet-series-20261110/Rockchip-RK730-Datasheet-V1.0-20241118.pdf)
