---
title: "Rockchip RK806 数据手册：电源通道、寄存器与电气限制"
description: "Rockchip RK806 数据手册：电源通道、寄存器与电气限制 — Rev1.3"
excerpt: "Rockchip RK806 数据手册：电源通道、寄存器与电气限制"
translation_key: "219-rockchip-rk806-datasheet"
slug: "219-rockchip-rk806-datasheet"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK806","datasheet"]
---

{% raw %}

# Rockchip RK806 数据手册：电源通道、寄存器与电气限制

本文是ArmSoM平台的RK806芯片参考，不代表某款ArmSoM板卡已兼容。须核对RK806具体版本、原理图、电源轨及BSP。应用电路和性能数据来自Rockchip示例，不是ArmSoM硬件实测；原稿未指定SDK/内核版本。来源为英文122页RK806 Rev1.3，日期2023-10-19（封面Oct.2023）。33幅图均为独立裁切英文原图。移除封面、修订历史及非技术法律/联系信息，保留技术条件和原稿差异。

## 1.1 概述

RK806是复杂电源管理IC，可用少量外部元件提供完整方案。十路同步降压DC-DC采用纹波控制，实现快速负载瞬态响应；输出电压可随处理器工作状态动态调整以提高效率，大多数通道通过I2C或SPI配置。软启动降低浪涌电流，2MHz开关频率及控制方式减小外部电感、电容。六路LDO输入最低可至2V以提高转换效率，另集成五路NMOS LDO；全部LDO输出电压可经I2C/SPI配置。基于OTP的上/下电控制器支持定制时序。两个RK806可主从协同，同步上/下电。封装QFN68，7.0×7.0mm，间距0.35mm。

## 1.2 特性

输入2.7–5.5V，低待机电流10uA；所列全部输出范围0.5–3.4V。BUCK1最大6.5A，BUCK2/3/4为5A，BUCK5/6/7/8/9/10为3A，均为快速瞬态响应。NLDO1/2/5最大300mA，NLDO3/4最大500mA；PLDO1/4最大500mA，PLDO2/3/5最大300mA；VCCIO最大300mA。OTP可编程时序和电压，支持双PMIC协同及I2C/SPI通信，7×7mm QFN68封装。

## 1.3 框图

![图1-1 功能框图](/docs/rockchip-rk806-datasheet/images/figure-1-1.png)

图1-1 功能框图 — 英文原图，Rev1.3，PDF页 9.

## 1.4 典型应用

![单RK806应用](/docs/rockchip-rk806-datasheet/images/figure-1-2.png)

单RK806应用 — 英文原图，Rev1.3，PDF页 10.

![双RK806，I2C](/docs/rockchip-rk806-datasheet/images/figure-1-3.png)

双RK806，I2C — 英文原图，Rev1.3，PDF页 11.

![双RK806，SPI](/docs/rockchip-rk806-datasheet/images/figure-1-4.png)

双RK806，SPI — 英文原图，Rev1.3，PDF页 11.

## 2 封装信息

RK806-1/-2/-3均为RoHS QFN68(7×7)，每卷带2000颗、每箱5卷。丝印：Rockchip品牌，RKXXXX芯片名，ABC分包商代码，XXXXXX晶圆批号，DEFG日期，NXXXXXX FXX为OSAT子批信息；三幅丝印图均标出1脚。湿敏等级MSL3，端子镀层/引脚材料Sn。共面度适用于引线、角引线及芯片粘接焊盘。尺寸b为金属化端子宽度，在距端子尖端0.15–0.30mm处测量，若另一端有可选圆角，不在圆角区测量。

| 可订购器件 | RoHS | 封装 | 包装 |
| --- | --- | --- | --- |
| RK806-1 | RoHS | QFN68 (7×7) | 2000颗/卷带；5卷/箱；卷盘 |
| RK806-2 | RoHS | QFN68 (7×7) | 2000颗/卷带；5卷/箱；卷盘 |
| RK806-3 | RoHS | QFN68 (7×7) | 2000颗/卷带；5卷/箱；卷盘 |

![RK806-1顶面标记](/docs/rockchip-rk806-datasheet/images/figure-mark-1.png)

RK806-1顶面标记 — 英文原图，Rev1.3，PDF页 12.

![RK806-2顶面标记](/docs/rockchip-rk806-datasheet/images/figure-mark-2.png)

RK806-2顶面标记 — 英文原图，Rev1.3，PDF页 12.

![RK806-3顶面标记](/docs/rockchip-rk806-datasheet/images/figure-mark-3.png)

RK806-3顶面标记 — 英文原图，Rev1.3，PDF页 13.

![图2-1 QFN68尺寸](/docs/rockchip-rk806-datasheet/images/figure-2-1.png)

图2-1 QFN68尺寸 — 英文原图，Rev1.3，PDF页 13.

| 符号 | 最小 / mm | 标称 / mm | 最大 / mm |
| --- | --- | --- | --- |
| A | 0.80 | 0.85 | 0.90 |
| A1 | - | 0.02 | 0.05 |
| b | 0.10 | 0.15 | 0.20 |
| b1 | 0.08 REF |  |  |
| C | 0.18 | 0.20 | 0.25 |
| D | 6.90 | 7.00 | 7.10 |
| D2 | 5.39 | 5.49 | 5.59 |
| e | 0.35BSC |  |  |
| Nd | 5.60BSC |  |  |
| E | 6.90 | 7.00 | 7.10 |
| E2 | 5.39 | 5.49 | 5.59 |
| Ne | 5.60BSC |  |  |
| L | 0.35 | 0.40 | 0.45 |
| L1 | 0.10BSC |  |  |
| L2 | 0.35 | 0.40 | 0.45 |
| k | 0.20 | - | - |
| h | 0.30 | 0.35 | 0.40 |
| aaa | 0.07 |  |  |
| bbb | 0.08 |  |  |
| ccc | 0.10 |  |  |
| ddd | 0.10 |  |  |
| eee | 0.10 |  |  |
| fff | 0.05 |  |  |

原稿REF/BSC单值及形位公差跨最小/标称/最大列，本文单列一次，不代表独立最小值。

![图2-2 引脚分配，间距0.35mm](/docs/rockchip-rk806-datasheet/images/figure-2-2.png)

图2-2 引脚分配，间距0.35mm — 英文原图，Rev1.3，PDF页 14.

| 引脚 | 名称 | 说明 | I/O |
| --- | --- | --- | --- |
| 1 | VCC9 | buck9电源 | I |
| 2 | SYNC | 主从同步信号 | I/O |
| 3 | SYNC_CLK | 32k同步时钟 | I/O |
| 4 | PWRON | 开机按键，内部约45K上拉至VCCA | I |
| 5 | VOUT8 | buck8输出反馈电压 | I |
| 6 | SW8 | buck8开关节点 | O |
| 7 | VCC8 | buck8电源 | I |
| 8 | NLDO5 | NMOS LDO5输出 | O |
| 9 | VCC14 | NLDO4/5电源 | I |
| 10 | NLDO4 | NMOS LDO4输出 | O |
| 11 | NLDO3 | NMOS LDO3输出 | O |
| 12 | NLDO2 | NMOS LDO2输出 | O |
| 13 | VCC13 | NLDO1/2/3电源 | I |
| 14 | NLDO1 | NMOS LDO1输出 | O |
| 15 | MOSI/SDA | SPI MOSI；I2C SDA | I/O |
| 16 | MISO/PWRCRTL3 | SPI MISO；PWRCRTL3控制 | I/O |
| 17 | CLK/SCL | SPI CLK；I2C SCL | I |
| 18 | CS | 上电选择SPI/I2C：接VCCA为I2C，未接VCCA为SPI；SPI模式作为片选CS | I |
| 19 | INT | 中断 | O |
| 20 | VCCIO | I2C/SPI供电输出 | O |
| 21 | VCCA | 模拟电源，供PLDO6/RESETB/INT及系统逻辑 | I |
| 22 | VCC4 | buck4电源 | I |
| 23 | SW4 | buck4开关节点 | O |
| 24 | VOUT4 | buck4输出反馈电压 | I |
| 25 | VOUT10 | buck10输出反馈电压 | I |
| 26 | SW10 | buck10开关节点 | O |
| 27 | VCC10 | buck10电源 | I |
| 28 | VCC6 | buck6电源 | I |
| 29 | SW6 | buck6开关节点 | O |
| 30 | VOUT6 | buck6输出反馈电压 | I |
| 31 | FB6 | buck6外部分压电阻模式反馈电压 | I |
| 32 | VDC | VDC开机信号 | I |
| 33 | VCC2 | buck2电源 | I |
| 34 | VCC2 | buck2电源 | I |
| 35 | SW2 | buck2开关节点 | O |
| 36 | SW2 | buck2开关节点 | O |
| 37 | VOUT2 | buck2输出反馈电压 | I |
| 38 | FB2 | buck2外部分压电阻模式反馈电压 | I |
| 39 | EXT_EN | 外部DCDC使能控制；主从选择 | I/O |
| 40 | RESETB | 复位AP；该引脚对地等效电容不得超过0.3uF | I/O |
| 41 | VOUT7 | buck7输出反馈电压 | I |
| 42 | SW7 | buck7开关节点 | O |
| 43 | VCC7 | buck7电源 | I |
| 44 | VCC5 | buck5电源 | I |
| 45 | SW5 | buck5开关节点 | O |
| 46 | VOUT5 | buck5输出反馈电压 | I |
| 47 | FB5 | buck5外部分压电阻模式反馈电压 | I |
| 48 | FB1 | buck1外部分压电阻模式反馈电压 | I |
| 49 | VOUT1 | buck1输出反馈电压 | I |
| 50 | SW1 | buck1开关节点 | O |
| 51 | SW1 | buck1开关节点 | O |
| 52 | VCC1 | buck1电源 | I |
| 53 | VCC1 | buck1电源 | I |
| 54 | VCC3 | buck3电源 | I |
| 55 | SW3 | buck3开关节点 | O |
| 56 | VOUT3 | buck3输出反馈电压 | I |
| 57 | PLDO3 | PMOS LDO3输出 | O |
| 58 | PLDO2 | PMOS LDO2输出 | O |
| 59 | VCC11 | PLDO1/2/3电源 | I |
| 60 | PLDO1 | PMOS LDO1输出 | O |
| 61 | PWRCRTL2 | PWRCRTL2控制 | I/O |
| 62 | PWRCRTL1 | PWRCRTL1控制 | I/O |
| 63 | PLDO4 | PMOS LDO4输出 | O |
| 64 | VCC12 | PLDO4/5电源 | I |
| 65 | PLDO5 | PMOS LDO5输出 | O |
| 66 | FB9 | buck9外部分压电阻模式反馈电压 | I |
| 67 | VOUT9 | buck9输出反馈电压 | I |
| 68 | SW9 | buck9开关节点 | O |
| 裸露焊盘 | ePAD | 接地 |  |

## 3 电气特性

超过绝对最大额定值可能永久损伤器件，影响器件和系统可靠性、安全性；超出推荐条件不保证功能。未另注明时，电气典型值条件VCCA=5.0V、TA=25°C。VCCA模拟电源须≥VCC1–VCC14。电气表原拼写EST_EN、SYNS_CLK保留，与其它位置EXT_EN/SYNC_CLK区分。NLDO/PLDO精度行多为0.99/1/1.01V，而备注可能写不同标称电压，两者均保留不擅改。

### 3.1 绝对最大额定值

| 参数 | 最小 | 最大 | 单位 |
| --- | --- | --- | --- |
| 所有引脚电压范围 | -0.3 | 6.5 | V |
| 以下引脚电压范围 SWx | -0.3（-2V持续&lt;20ns及-3.5V持续&lt;10ns） | 6.5(7V持续&lt;20ns) | V |
| 存储温度范围, T S | -40 | 150 | ℃ |
| 工作温度范围, T J | -40 | 125 | ℃ |
| 最高焊接温度, T SOLDER |  | 300 | ℃ |

### 3.2 推荐工作条件

| 参数 | 最小 | 典型 | 最大 | 单位 |
| --- | --- | --- | --- | --- |
| 以下引脚电压范围 VCCx/VCCA/SYNC/ SYNC_CLK/VDC/PWRON/EST_EN/CS/RESETB/INT | 2.7 | 5 | 5.5 | V |
| 功耗 |  |  | 2 | W |
| 以下引脚电压范围 VCCIO/MOSI/MISO/ PWRCRTL1/ PWRCRTL2 | 1.62 |  | 3.4 | V |

| 参数 | 符号 | 条件/备注 | 最小 | 典型 | 最大 | 单位 |
| --- | --- | --- | --- | --- | --- | --- |
| I2C接口（7位地址：主0x23，从0x25） |  |  |  |  |  |  |
| SCL时钟频率 | f SCL |  |  |  | 1000 | KHz |
| 逻辑输入 |  |  |  |  |  |  |
| 输入低电平电压:PWRON,SYNC,SYNS_CLK | V IL |  |  |  | 0.3+VCCA | V |
| 输入低电平电压: VDC | V IL1 |  |  |  | 0.65 | V |
| 输入高电平电压: MOSI,MISO,CS,PWRCRTL1/2, RESETB,INT | V IH1 |  | VCCIO*0.7 |  | 0.3+VCCIO | V |
| 输入高电平电压: PWRON , VCCx,VCCA,SYNC, SYNC_CLK | V IH2 |  | VCCA*0.7 |  | 0.3+VCCA | V |
| 输入高电平电压: VDC | V IH3 |  | 0.88 |  |  | V |

### 3.3 直流特性

| 参数 | 符号 | 条件/备注 | 最小 | 典型 | 最大 | 单位 |
| --- | --- | --- | --- | --- | --- | --- |
| 功耗 |  |  |  |  |  |  |
| 关机电流 | Isd |  |  | 10 | 12 | uA |
| 开机电流1：全部BUCK/LDO开启，空载 | Iq1 |  |  | 1.8 |  | mA |
| 开机睡眠电流：全部BUCK/LDO开启，低功耗、睡眠模式、空载 | Isleep |  |  | 0.85 |  | mA |
| 系统特性 |  |  |  |  |  |  |
| VB_UV阈值：VCCx低于阈值时PMIC关机 | Vuv | 2.7V~3.4 V经I2C 可编程。 典型为 2.7V. VB_UV_SEL=0b000 | 2.646 | 2.7 | 2.754 | V |
|  |  | VB_UV_SEL=0b011 | 2.94 | 3.0 | 3.06 | V |
|  |  | VB_UV_SEL=0b111 | 3.332 | 3.4 | 3.468 | V |
| VB_LO阈值：VCCx低于阈值时关机或触发中断 | Vlo | 2.8V~3.5 V经I2C 可编程。 典型为 3.2V. VB_LO_SEL= 0b000 | 2.744 | 2.8 | 2.856 | V |
|  |  | VB_LO_SEL= 0b100 | 3.136 | 3.2 | 3.264 | V |
|  |  | VB_LO_SEL= 0b111 | 3.43 | 3.5 | 3.57 | V |
| VB_OV阈值：VCCx超过阈值时PMIC关机 | Vov |  | 5.8 | 6.0 | 6.2 | V |
| TSD阈值：温度超过阈值时PMIC关机 | Tsd | 140/160 ℃经I2C/SPI 可编程。 典型为 160℃. TSD_TEMP=0b0 | 135 | 140 | 145 | ℃ |
|  |  | TSD_TEMP=0b1 | 155 | 160 | 165 | ℃ |
| 温度告警阈值：超过时触发中断 | Twa | 85~115 ℃经I2C/SPI 可编程。 典型为 115℃. HOTDIE_TEMP[ 1:0]=0b00 | 80 | 85 | 90 | ℃ |
|  |  | HOTDIE_TEMP= 0b01 | 90 | 95 | 100 | ℃ |
|  |  | HOTDIE_TEMP= 0b10 | 100 | 105 | 110 | ℃ |
|  |  | HOTDIE_TEMP= 0b11 | 110 | 115 | 120 | ℃ |
| PWRON长按时间 | Tlp | 6s~12s经I2C/SPI 可编程。 典型为 6s. PWRON_LP_OFF_TIME=0b00 | 5.76 | 6 | 6.24 | s |
|  |  | PWRON_LP_OFF_TIME=0b01 | 7.68 | 8 | 8.32 | s |
|  |  | PWRON_LP_OFF_TIME=0b10 | 9.6 | 10 | 10.4 | s |
|  |  | PWRON_LP_OFF_TIME=0b11 | 11.52 | 12 | 12.48 | s |
| RC振荡器频率32.768kHz | 32KHz时钟 |  | 31.45 | 32.768 | 34.08 | kHz |
| PWRON短按时间 | Tst | 20ms/500ms经I2C/SPI 可编程并支持OTP编程。 典型为 500ms. PWRON_ON_TIME=0b0 | 480 | 500 | 520 | ms |
|  |  | PWRON_ON_TIME=0b1 | 19.2 | 20 | 20.8 | ms |
| 启动顺序 |  |  |  |  |  |  |
| 通道依次启动间隔1mS |  |  | 0.96 | 1 | 1.04 | mS |
| BUCK1: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc1 |  | 2.7 |  | 5.5 | V |
| 默认反馈电压 | Vfb1 | 选择外部分压电阻， R1=R2=100K | 0.99 | 1.0 | 1.01 | V |
| 内部反馈参考电压 | Vref_exfb | 默认禁用，以下寄存器使能： 0xFD&lt;0&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb1 | 选择内部分压时： 0.5V~3.4V经I2C/SPI 可编程。 典型为 0.8V.以下寄存器调整： 0x1A, 步进=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=0.22uH, Cout=66uF. | Vdrop1 | 0.65A至6.5A, 1A/uS, Vout=0.8V |  | 38 |  | mV |
| 额定输出电流 | Imax1 |  | 6.5 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw1 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=6.5A Iout=1.5A Iout=0.65A |  | 68 85 81 |  | % |
| BUCK2: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc2 |  | 2.7 |  | 5.5 | V |
| 默认反馈电压 | Vfb2 | 选择外部分压电阻， R1=R2=100K | 0.99 | 1.0 | 1.01 | V |
| 内部反馈参考电压 | Vref_exfb | 默认禁用，以下寄存器使能： 0xFD&lt;1&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb2 | 选择内部分压时： 0.5V~3.4V经I2C /SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x1B, 步进=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=0.22uH, Cout=66uF. | Vdrop2 | 0.5A至5A, 1A/uS, Vout=0.8V |  | 30 |  | mV |
| 额定输出电流 | Imax2 |  | 5 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw2 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 67 84 81 |  | % |
| BUCK3: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc3 |  | 2.7 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vbuck3 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x1C, 步进=6.25mV | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=0.22uH, Cout=66uF. | Vdrop3 | 0.5A至5.0A, 1A/uS, Vout=0.8V |  | 30 |  | mV |
| 额定输出电流 | Imax3 |  | 5 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw3 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 66 84 82 |  | % |
| BUCK4: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc4 |  | 2.7 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb4 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x1D, 步进=6.25mV | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=0.22uH, Cout=66uF. | Vdrop4 | 0.5A至5A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| 额定输出电流 | Imax4 |  | 5 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw4 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=5A Iout=1A Iout=0.5A |  | 66 84 82 |  | % |
| BUCK5: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc5 |  | 2.7 |  | 5.5 | V |
| 默认反馈电压 | Vfb5 | 选择外部分压电阻， R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| 内部反馈参考电压 | Vref_exfb | 默认禁用，以下寄存器使能： 0xFD&lt;4&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb5 | 选择内部分压时： 0.5V~3.4V经I2C /SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x1E, 步进=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop5 | 0.3A至3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| 额定输出电流 | Imax5 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw5 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK6: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc6 |  | 2.7 |  | 5.5 | V |
| 默认反馈电压 | Vfb6 | 选择外部分压电阻， R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| 内部反馈参考电压 | Vref_exfb | 默认禁用，以下寄存器使能： 0xFD&lt;5&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb6 | 选择内部分压时： 0.5V~3.4V经I2C/SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x1F, 步进=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop6 | 0.3A至3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| 额定输出电流 | Imax6 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw6 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=2.5A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK7: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc7 |  | 2.7 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb7 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x20, 步进=6.25mV. | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop7 | 0.3A至3A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| 额定输出电流 | Imax7 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw7 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK8: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc8 |  | 2.7 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb8 | 0.5V~3.4V经I2C / SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x21, 步进=6.25mV | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop8 | 0.3A至3A, 1A/uS, Vout=0.8V |  | 22 |  | mV |
| 额定输出电流 | Imax8 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw8 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK9: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc9 |  | 2.7 |  | 5.5 | V |
| 默认反馈电压 | Vfb9 | 选择外部分压电阻， R1=R2=100K. | 0.99 | 1.0 | 1.01 | V |
| 内部反馈参考电压 | Vref_exfb | 默认禁用，以下寄存器使能： 0xFE&lt;0&gt;=1. | 0.495 | 0.5 | 0.505 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb9 | 选择内部分压时： 0.5V~3.4V经I2C / SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x22, 步进=6.25mV | 0.784 | 0.8 | 0.816 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop9 | 0.3A至3A, 1A/uS, Vout=0.8V |  | 20 |  | mV |
| 额定输出电流 | Imax9 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw9 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| BUCK10: 快速负载瞬态响应降压转换器 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc10 |  | 2.7 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vfb10 | 0.5V~3.4V经I2C / SPI 可编程。 典型为 0.8V. 以下寄存器调整： 0x23, 步进=6.25mV | 0.792 | 0.8 | 0.808 | V |
| 负载瞬态响应 L=470nH, Cout=44uF. | Vdrop10 | 0.3A至3A, 0.5A/uS, Vout=0.8V |  | 22 |  | mV |
| 额定输出电流 | Imax10 |  | 3 |  |  | A |
| CCM模式开关频率 (Vin=3.8V,Vout=1.5V) | Fsw10 | Vin-Vout&gt;1.5V | 1.89 | 2.1 | 2.31 | MHz |
| 转换效率 (Vin=4.2V,Vout=0.8V) |  | Iout=3A Iout=1A Iout=0.25A |  | 65 82 81 |  | % |
| NLDO1 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc13 | VCCA-NLDO1&gt;1.5V | 0.6 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vnldo1 | 0.5V~3.4V经I2C / SPI 可编程。 典型为 1V. 以下寄存器调整： 0x43, 步进=12.5mV . | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl1 | Vcc13-Vnldo1&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO2 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc13 | VCCA-NLDO2&gt;1.5V | 0.6 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vnldo2 | 0.5V~3.4V经I2C SPI 可编程。 典型为 1.8V. 以下寄存器调整： 0x44, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl2 | Vcc13-Vnldo2&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO3 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc13 | VCCA-NLDO3&gt;1.5V | 0.6 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vnldo3 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1V. 以下寄存器调整： 0x45, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl3 | Vcc13-Vnldo3&gt;0.2V | 500 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO4 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc14 | VCCA-NLDO4&gt;1.5V | 0.6 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vnldo4 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1V. 以下寄存器调整： 0x46, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl4 | Vcc14-Vnldo4&gt;0.2V | 500 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| NLDO5 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc14 | VCCA-NLDO5&gt;1.5V | 0.6 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vnldo5 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 3V. 以下寄存器调整： 0x47, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl5 | Vcc14-Vnldo5&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO1 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc11 |  | 1.9 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vpldo1 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 3V. 以下寄存器调整： 0x4E, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl1 | Vcc11-Vpldo1&gt;0.2V VCC11≥2.0V | 500 |  |  | mA |
|  |  | Vcc11-Vpldo1&gt;0.1V | 250 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO2 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc11 |  | 1.9 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vpldo2 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 2.8V. 以下寄存器调整： 0x4F, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl2 | Vcc11-Vpldo2&gt;0.2V， VCC11≥2.0V | 300 |  |  | mA |
|  |  | Vcc11-Vpldo2&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO3 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc11 |  | 1.9 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vpldo3 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1.8V. 以下寄存器调整： 0x50, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl3 | Vcc11-Vpldo3&gt;0.2V， VCC11≥2.0V | 300 |  |  | mA |
|  |  | Vcc11-Vpldo3&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO4 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc12 |  | 1.9 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vpldo4 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1.5V. 以下寄存器调整： 0x51, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl4 | Vcc12-Vpldo4&gt;0.2V， Vcc12&gt;2.0 | 500 |  |  | mA |
|  |  | Vcc12-Vpldo4&gt;0.1V | 250 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| PLDO5 |  |  |  |  |  |  |
| 输入电源电压范围 | Vcc12 |  | 1.9 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vpldo5 | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1.8V. 以下寄存器调整： 0x52, 步进=12.5mV | 0.99 | 1 | 1.01 | V |
| 额定输出电流 | Imaxl5 | Vcc12-Vpldo5&gt;0.2V VCC12≥2.0V | 300 |  |  | mA |
|  |  | Vcc12-Vpldo5&gt;0.1V | 150 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |
| VCCIO |  |  |  |  |  |  |
| 输入电源电压范围[1] | VccA |  | 2.0 |  | 5.5 | V |
| 所有负载及输入电压范围下输出电压精度 | Vccio | 0.5V~3.4V经I2C /SPI 可编程。 典型为 1.8V. 以下寄存器调整： 0x53, 步进=12.5mV | 1.782 | 1.8 | 1.818 | V |
| 额定输出电流 | Imaxl6 | VccA-Vccio&gt;0.2V | 300 |  |  | mA |
| PSRR@ 1KHz |  | Vin rms=200mV |  | 65 |  | dB |
| PSRR@ 10KHz |  | Vin rms=200mV |  | 60 |  | dB |

## 4.1.1–4.1.2 状态机与开机

状态机有OFF、ACTIVE、SLEEP状态，通过上电、下电、复位、进入/退出睡眠转换。三种上电方式：（1）VCCA/VCC1/VCC2高于VB_OK时，PWRON保持低500/20ms，时间可经I2C/SPI配置；通道按预置顺序、默认电压启动，间隔1ms。各轨稳定后RESETB拉高。T1检查外部电源，图示3.5ms<T1<100ms，须100ms内满足要求，图还标10ms和≤16ms间隔。（2）上述电源高于VB_OK，VDC持续高超过2ms可上电，T1要求相同。（3）0x5F<7>=0时，上电后的OVP/UVLO故障触发自动重启，检测系统电压正常后完成上电。

![图4-1 状态/开机时序](/docs/rockchip-rk806-datasheet/images/figure-4-1.png)

图4-1 状态/开机时序 — 英文原图，Rev1.3，PDF页 25.

![图4-2 状态/开机时序](/docs/rockchip-rk806-datasheet/images/figure-4-2.png)

图4-2 状态/开机时序 — 英文原图，Rev1.3，PDF页 25.

![图4-3 状态/开机时序](/docs/rockchip-rk806-datasheet/images/figure-4-3.png)

图4-3 状态/开机时序 — 英文原图，Rev1.3，PDF页 26.

## 4.1.3 关机

ON或SLEEP下七种关机方式：（1）0x76<6>=0且PWRON低6/8/10/12s，去抖时间可经I2C配；RESETB先低，1ms后各通道按设定顺序关闭，图示通道间1ms、EXT_EN前6ms。（2）写0x72<0>=1，同一时序。（3）0x5F<7>=1时，VCCA/VCC1/VCC2任一低于VB_UV（典型2.7V）或高于VB_OV（典型6.0V），SYNC拉低并立即关机。（4）0x5E<3>=0时，任一电源低于VB_LO（典型3.2V）达1ms，按方式1关机。（5）PWRCTRLn_FUN=010且PWRCTRLn有效，极性可配，按方式1。（6）温度高于TSD（典型140°C），按方式1。（7）0x5F<7>=0时，监测电源低于VB_UV或高于VB_OV即立即关机；原稿同时称时序同方式1，两种表述保留。

![图4-4 PWRON关机时序](/docs/rockchip-rk806-datasheet/images/figure-4-4.png)

图4-4 PWRON关机时序 — 英文原图，Rev1.3，PDF页 26.

## 4.1.4 复位

原稿称四种复位方式，但实际列五种。0x72<7:6>=00表示重启PMIC，01表示复位寄存器、所有通道恢复默认。在ON/SLEEP下：（1）0x76<6>=1且PWRON低6/8/10/12s重启，去抖可经I2C/SPI配；波形标1ms通道间隔与244ms。（2）PWRCTRLn_FUN=011且PWRCTRLn有效，极性由PWRCTRLn_POL设置，按同一时序重启。（3）RESETB拉低立即重启，同一时序。（4）WDT有效且0x73<4:3>=11重启，同一时序。（5）写0x72<7:5>=001重启，同一时序。

![图4-5 PWRON重启时序](/docs/rockchip-rk806-datasheet/images/figure-4-5.png)

图4-5 PWRON重启时序 — 英文原图，Rev1.3，PDF页 27.

## 4.1.5–4.1.6 电源时序与睡眠

下列电源时序表区分RK806-1主、RK806-2主/从、RK806-3主，PWRON短按20ms。注[1][2][3]：OTP可在0.5–3.4V内改变默认电压及启动顺序；BUCK1/2/5/6/9可用外部反馈电阻定制。上电后B2–C3寄存器设置下电顺序。睡眠需PWRCTRLn_FUN=001，并按PWRCTRLn_POL极性激活PWRCTRLn；睡眠降低功耗，写0x0D=FF、0x0C=FF、0x61<1>=1可进一步降低静态电流。

### RK806-1（主）

| 通道 | 输出范围 | 最大电流 | 默认电压 | 启动顺序 |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 5 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 3 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 2 |
| BUCK4 | 0.5V-3.4V | 5A | 0.75V | 5 |
| BUCK5 | 0.5V-3.4V | 3A | 0.85V | 2 |
| BUCK6 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 3A | 0.5V | 4 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 1 |
| BUCK8 | 0.5V-3.4V | 3A | 3.3V | 6 |
| BUCK9 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 3A | 0.5V | 6 |
| BUCK10 | 0.5V-3.4V | 3A | 1.8V | 3 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.85V | 2 |
| NLDO5 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.8V | 3 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.8V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.2V | 4 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.3V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 3.3V | 6 |
| PLDO6 | 0.5V-3.4V | 300mA | 1.8V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 11 |

### RK806-2（主）

| 通道 | 输出范围 | 最大电流 | 默认电压 | 启动顺序 |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 7 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 7 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 2 |
| BUCK4 | 0.5V-3.4V | 5A | 0.75V | 7 |
| BUCK5 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK6 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 1 |
| BUCK8 | 0.5V-3.4V | 3A | 0.75V | 7 |
| BUCK9 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 3A | 0.5V | 4 |
| BUCK10 | 0.5V-3.4V | 3A | 1.10V | 1 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.90V | 5 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.75V | 2 |
| NLDO5 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.80V | 3 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.30V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 3.30V | 6 |
| PLDO6 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 20 |

### RK806-2（从）

| 通道 | 输出范围 | 最大电流 | 默认电压 | 启动顺序 |
| --- | --- | --- | --- | --- |
| BUCK1 | 0.5V-3.4V | 6.5A | 0.75V | 9 |
| BUCK2 | 0.5V-3.4V | 5A | 0.75V | 9 |
| BUCK3 | 0.5V-3.4V | 5A | 0.75V | 8 |
| BUCK4 | 0.5V-3.4V | 5A | 3.30V | 6 |
| BUCK5 | 0.5V-3.4V | 3A | 0.75V | 9 |
| BUCK6 | 0.5V-3.4V | 3A | 0.75V | 9 |
| BUCK7 | 0.5V-3.4V | 3A | 1.80V | 3 |
| BUCK8 | 0.5V-3.4V | 3A | 0.75V | 8 |
| BUCK9 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 3A | 0.5V | 6 |
| BUCK10 | 0.5V-3.4V | 3A | 0.85V | 2 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.75V | 2 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.85V | 2 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.85V | 2 |
| NLDO4 | 0.5V-3.4V | 500mA | 0.50V | OFF |
| NLDO5 | 0.5V-3.4V | 300mA | 1.20V | 4 |
| PLDO1 | 0.5V-3.4V | 500mA | 0.50V | OFF |
| PLDO2 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| PLDO4 | 0.5V-3.4V | 500mA | 3.30V | 6 |
| PLDO5 | 0.5V-3.4V | 300mA | 2.80V | OFF |
| PLDO6 | 0.5V-3.4V | 300mA | 1.80V | 3 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 20 |

### RK806-3（主）

| 通道 | 输出范围 | 最大电流 | 默认电压 | 启动顺序 |
| --- | --- | --- | --- | --- |
| BUCK1 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 6.5A | X | 40 |
| BUCK2 | X（外部分压电阻）或0.5V–3.4v（内部分压电阻） | 5A | X | 40 |
| BUCK3 | 0.5V-3.4V | 5A | 0.8V | 0 |
| BUCK4 | 0.5V-3.4V | 5A | 0.8V | 5 |
| BUCK5 | 0.5V-3.4V | 3A | 0.8V | 40 |
| BUCK6 | 0.5V-3.4V | 3A | 0.8V | 45 |
| BUCK7 | 0.5V-3.4V | 3A | 2.0V | 5 |
| BUCK8 | 0.5V-3.4V | 3A | 1.0V | 5 |
| BUCK9 | 0.5V-3.4V | 3A | 1.8V | 45 |
| BUCK10 | 0.5V-3.4V | 3A | 1.8V | 10 |
| NLDO1 | 0.5V-3.4V | 300mA | 0.8V | 40 |
| NLDO2 | 0.5V-3.4V | 300mA | 0.8V | 15 |
| NLDO3 | 0.5V-3.4V | 500mA | 0.8V | 25 |
| NLDO4 | 0.5V-3.4V | 500mA | 1.8V | 20 |
| NLDO5 | 0.5V-3.4V | 300mA | 1.8V | 43 |
| PLDO1 | 0.5V-3.4V | 500mA | 1.8V | 30 |
| PLDO2 | 0.5V-3.4V | 300mA | 1.8V | 35 |
| PLDO3 | 0.5V-3.4V | 300mA | 1.8V | 35 |
| PLDO4 | 0.5V-3.4V | 500mA | 1.8V | 43 |
| PLDO5 | 0.5V-3.4V | 300mA | 1.8V | 55 |
| PLDO6 | 0.5V-3.4V | 300mA | 3.3V | 55 |
| VB_OK | 2.8V-3.6V | x | 2.8V | x |
| RESETB | x | x | x | 63 |

## 4.1.7 主从协同

两个RK806可主从协同。首次上电时EXT_EN接VCCA选择从片，悬空或电阻下拉选择主片。连接双方SYNC_CLK及SYNC；主片经SYNC_CLK供时钟，SYNC脉冲同步启动、关机、复位和电源状态变化。双方PWRON分别相连，RESETB分别相连，用于上电和外部按键复位。VDC可互连，也可将从片VDC接主片EXT_EN。主控IO不足时INT也可互连，软件读取各自寄存器区分中断来源。

## 4.1.8 I2C与SPI

主/从总线地址为0x23/0x25（原稿称寄存器地址）。首次上电CS接VCCA选择I2C，否则SPI。VCCIO须高于1.62V，待机不可关闭此通道。SPI默认三线，四线初始化设E8<2>=1，从端SO需E9<5>=1；CLK下降沿准备数据，高电平锁存，最高20MHz。MISO复用SLEEP3时只可三线；主控MOSI/MISO相连，通过PMIC MOSI交换数据。SPI发送数据后另发两个空字节，下文CRC波形另列不同空包数量，分别保留。

| 信号 | 符号 | 参数 | 最小 | 典型 | 最大 | 单位 |
| --- | --- | --- | --- | --- | --- | --- |
| CLK | Fsclk | 时钟频率 | — | — | 20 | MHz |
| CLK | th_sclk | 时钟高时间 | 5 | 25 | — | ns |
| CLK | tl_sclk | 时钟低时间 | 5 | 25 | — | ns |
| CS | tsu_cs | CS输入建立 | 10 | — | — | ns |
| CS | thold_cs | CS输入保持 | 20 | — | — | ns |
| MOSI | tsu_mosi | 数据输入建立 | 2 | — | — | ns |
| MOSI | thold_mosi | 数据输入保持 | 2 | — | — | ns |
| MISO | tod_miso | 时钟低至输出有效 | — | 20 | 23 | ns |

## 4.1.9 SPI命令格式

每次传输先发CMD、REG_L、REG_H。CMD包含R/W[7]（0读，1写）、CRC_EN[6]（1启用，0禁用）、Len[3:0]。带CRC时Len=n−1，数据最多16字节，主/从在Len+1位置发送CRC；无CRC时忽略Len，从端地址在0–255内递增。REG_L是地址低8位；REG_H是高8位，但RK806始终按0处理。三线读在REG_H时主端MO切输入，避免从端SI转SO与其冲突；两端均输入时从端强制接收0。CRC多项式X⁸+X⁴+X+1，初值0x00。前段称计算时REG_L=REG_H=0，后段称CRC覆盖REG_L、REG_H和数据，保留两处表述，不擅自统一。带CRC写完CRC后须另发CRC_CLK_DATA空字节，用于内部计算/传输；此8位之后若仍有从端无法识别的时钟，将置CRC_ERR且RK806停止工作。带CRC读无需该空包，CRC后继续时钟无响应或返回无效数据。波形：无CRC单字节写不论Len，每8时钟地址加1；单字节CRC写加Dummy1；多字节CRC写≤8字节至少1空包，>8字节2空包。四线CRC读在MISO返回数据和CRC，三线读REG_H空阶段强制0；无CRC读每8时钟地址加1。以上详细空包数与4.1.8的两个空字节说法分别保留。

![SPI波形：spi-command](/docs/rockchip-rk806-datasheet/images/figure-spi-command.png)

SPI波形：spi-command — 英文原图，Rev1.3，PDF页 33.

![SPI波形：spi-write-no-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-no-crc.png)

SPI波形：spi-write-no-crc — 英文原图，Rev1.3，PDF页 34.

![SPI波形：spi-write-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-crc.png)

SPI波形：spi-write-crc — 英文原图，Rev1.3，PDF页 34.

![SPI波形：spi-write-multi-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-write-multi-crc.png)

SPI波形：spi-write-multi-crc — 英文原图，Rev1.3，PDF页 34.

![SPI波形：spi-read-four-wire](/docs/rockchip-rk806-datasheet/images/figure-spi-read-four-wire.png)

SPI波形：spi-read-four-wire — 英文原图，Rev1.3，PDF页 34.

![SPI波形：spi-read-three-wire](/docs/rockchip-rk806-datasheet/images/figure-spi-read-three-wire.png)

SPI波形：spi-read-three-wire — 英文原图，Rev1.3，PDF页 35.

![SPI波形：spi-read-no-crc](/docs/rockchip-rk806-datasheet/images/figure-spi-read-no-crc.png)

SPI波形：spi-read-no-crc — 英文原图，Rev1.3，PDF页 35.

## 4.2.1 降压转换器

10路同步BUCK提供最高6.5A、5A或3A。增强恒定导通时间COT控制改善瞬态响应，2MHz开关与控制架构降低外部电感、电容需求。运行中DVS实现线性渐变调压，具备短路等保护。原稿BUCK1示例：Vout=0.8V，Vin=5V，L=0.22uH，Cout=66uF，负载0.065→6.5A，MOSFET切换实现3A/uS，负载上升压降约38mV；其余BUCK架构相同。电气表另列0.65→6.5A、1A/uS，属于不同原稿条件，不是ArmSoM实测。下方原图保留上升/下降瞬态及效率曲线和图示条件。

![图4-6 BUCK1负载瞬态](/docs/rockchip-rk806-datasheet/images/figure-4-6.png)

图4-6 BUCK1负载瞬态 — 英文原图，Rev1.3，PDF页 35.

![图4-7 BUCK1负载瞬态](/docs/rockchip-rk806-datasheet/images/figure-4-7.png)

图4-7 BUCK1负载瞬态 — 英文原图，Rev1.3，PDF页 36.

![图4-8 BUCK1效率](/docs/rockchip-rk806-datasheet/images/figure-4-8.png)

图4-8 BUCK1效率 — 英文原图，Rev1.3，PDF页 36.

![图4-9 BUCK2效率](/docs/rockchip-rk806-datasheet/images/figure-4-9.png)

图4-9 BUCK2效率 — 英文原图，Rev1.3，PDF页 36.

![图4-10 BUCK3效率](/docs/rockchip-rk806-datasheet/images/figure-4-10.png)

图4-10 BUCK3效率 — 英文原图，Rev1.3，PDF页 37.

![图4-11 BUCK4效率](/docs/rockchip-rk806-datasheet/images/figure-4-11.png)

图4-11 BUCK4效率 — 英文原图，Rev1.3，PDF页 37.

![图4-12 BUCK5效率](/docs/rockchip-rk806-datasheet/images/figure-4-12.png)

图4-12 BUCK5效率 — 英文原图，Rev1.3，PDF页 37.

![图4-13 BUCK6效率](/docs/rockchip-rk806-datasheet/images/figure-4-13.png)

图4-13 BUCK6效率 — 英文原图，Rev1.3，PDF页 38.

![图4-14 BUCK7效率](/docs/rockchip-rk806-datasheet/images/figure-4-14.png)

图4-14 BUCK7效率 — 英文原图，Rev1.3，PDF页 38.

![图4-15 BUCK8效率](/docs/rockchip-rk806-datasheet/images/figure-4-15.png)

图4-15 BUCK8效率 — 英文原图，Rev1.3，PDF页 38.

![图4-16 BUCK9效率](/docs/rockchip-rk806-datasheet/images/figure-4-16.png)

图4-16 BUCK9效率 — 英文原图，Rev1.3，PDF页 39.

![图4-17 BUCK10效率](/docs/rockchip-rk806-datasheet/images/figure-4-17.png)

图4-17 BUCK10效率 — 英文原图，Rev1.3，PDF页 39.

## 4.2.2 LDO

效率测试曲线使用BUCK默认输出电压（图示0.8V），对比PFM下5500/4200/3000mV输入。5路NLDO中NLDO3/4最高500mA，NLDO1/2/5最高300mA；6路PLDO中PLDO1/4最高500mA。本段列PLDO2/3/VCCIO为300mA而漏列PLDO5，特性及电气表另明确PLDO5为300mA。所有LDO可用1.0uF输出电容降低成本，不同模式的输出电压等参数可经I2C/SPI调整。

## 5.1 寄存器汇总

| 名称 | 偏移 | 大小 | 复位值 | 说明 |
| --- | --- | --- | --- | --- |
| POWER_EN0 | 0x0000 | B | OTP |  |
| POWER_EN1 | 0x0001 | B | OTP |  |
| POWER_EN2 | 0x0002 | B | OTP |  |
| POWER_EN3 | 0x0003 | B | OTP |  |
| POWER_EN4 | 0x0004 | B | OTP |  |
| POWER_EN5 | 0x0005 | B | OTP |  |
| POWER_SLP_EN0 | 0x0006 | B | OTP |  |
| POWER_SLP_EN1 | 0x0007 | B | OTP |  |
| POWER_SLP_EN2 | 0x0008 | B | OTP |  |
| POWER_DISCHRG_EN0 | 0x0009 | B | 0xff |  |
| POWER_DISCHRG_EN1 | 0x000a | B | 0xdf |  |
| POWER_DISCHRG_EN2 | 0x000b | B | 0x3f |  |
| BUCK_FB_CONFIG | 0x000c | B | 0x01 |  |
| SLP_LP_CONFIG | 0x000d | B | 0x00 |  |
| POWER_FPWM_EN0 | 0x000e | B | 0x00 |  |
| POWER_FPWM_EN1 | 0x000f | B | 0x00 |  |
| BUCK1_CONFIG | 0x0010 | B | 0x64 |  |
| BUCK2_CONFIG | 0x0011 | B | 0x64 |  |
| BUCK3_CONFIG | 0x0012 | B | 0x64 |  |
| BUCK4_CONFIG | 0x0013 | B | 0x64 |  |
| BUCK5_CONFIG | 0x0014 | B | 0x64 |  |
| BUCK6_CONFIG | 0x0015 | B | 0x64 |  |
| BUCK7_CONFIG | 0x0016 | B | 0x64 |  |
| BUCK8_CONFIG | 0x0017 | B | 0x64 |  |
| BUCK9_CONFIG | 0x0018 | B | 0x64 |  |
| BUCK10_CONFIG | 0x0019 | B | 0x64 |  |
| BUCK1_ON_VSEL | 0x001a | B | OTP |  |
| BUCK2_ON_VSEL | 0x001b | B | OTP |  |
| BUCK3_ON_VSEL | 0x001c | B | OTP |  |
| BUCK4_ON_VSEL | 0x001d | B | OTP |  |
| BUCK5_ON_VSEL | 0x001e | B | OTP |  |
| BUCK6_ON_VSEL | 0x001f | B | OTP |  |
| BUCK7_ON_VSEL | 0x0020 | B | OTP |  |
| BUCK8_ON_VSEL | 0x0021 | B | OTP |  |
| BUCK9_ON_VSEL | 0x0022 | B | OTP |  |
| BUCK10_ON_VSEL | 0x0023 | B | OTP |  |
| BUCK1_SLP_VSEL | 0x0024 | B | OTP |  |
| BUCK2_SLP_VSEL | 0x0025 | B | OTP |  |
| BUCK3_SLP_VSEL | 0x0026 | B | OTP |  |
| BUCK4_SLP_VSEL | 0x0027 | B | OTP |  |
| BUCK5_SLP_VSEL | 0x0028 | B | OTP |  |
| BUCK6_SLP_VSEL | 0x0029 | B | OTP |  |
| BUCK7_SLP_VSEL | 0x002a | B | OTP |  |
| BUCK8_SLP_VSEL | 0x002b | B | OTP |  |
| BUCK9_SLP_VSEL | 0x002c | B | OTP |  |
| BUCK10_SLP_VSEL | 0x002d | B | OTP |  |
| BUCK_DEBUG13 | 0x003c | B | 0x44 |  |
| BUCK_DEBUG14 | 0x003d | B | 0x44 |  |
| BUCK_DEBUG15 | 0x003e | B | 0x44 |  |
| BUCK_DEBUG16 | 0x003f | B | 0x44 |  |
| BUCK_DEBUG17 | 0x0040 | B | 0x44 |  |
| NLDO_IMAX | 0x0042 | B | 0x00 |  |
| NLDO1_ON_VSEL | 0x0043 | B | OTP |  |
| NLDO2_ON_VSEL | 0x0044 | B | OTP |  |
| NLDO3_ON_VSEL | 0x0045 | B | OTP |  |
| NLDO4_ON_VSEL | 0x0046 | B | OTP |  |
| NLDO5_ON_VSEL | 0x0047 | B | OTP |  |
| NLDO1_SLP_VSEL | 0x0048 | B | OTP |  |
| NLDO2_SLP_VSEL | 0x0049 | B | OTP |  |
| NLDO3_SLP_VSEL | 0x004a | B | OTP |  |
| NLDO4_SLP_VSEL | 0x004b | B | OTP |  |
| NLDO5_SLP_VSEL | 0x004c | B | OTP |  |
| PLDO_IMAX | 0x004d | B | 0x00 |  |
| PLDO1_ON_VSEL | 0x004e | B | OTP |  |
| PLDO2_ON_VSEL | 0x004f | B | OTP |  |
| PLDO3_ON_VSEL | 0x0050 | B | OTP |  |
| PLDO4_ON_VSEL | 0x0051 | B | OTP |  |
| PLDO5_ON_VSEL | 0x0052 | B | OTP |  |
| PLDO6_ON_VSEL | 0x0053 | B | OTP |  |
| PLDO1_SLP_VSEL | 0x0054 | B | OTP |  |
| PLDO2_SLP_VSEL | 0x0055 | B | OTP |  |
| PLDO3_SLP_VSEL | 0x0056 | B | OTP |  |
| PLDO4_SLP_VSEL | 0x0057 | B | OTP |  |
| PLDO5_SLP_VSEL | 0x0058 | B | OTP |  |
| PLDO6_SLP_VSEL | 0x0059 | B | OTP |  |
| CHIP_NAME | 0x005a | B | 0x80 |  |
| CHIP_VER | 0x005b | B | 0x62 |  |
| OTP_VER | 0x005c | B | OTP |  |
| SYS_STS | 0x005d | B | 0x00 |  |
| SYS_CFG0 | 0x005e | B | 0x0c |  |
| SYS_CFG1 | 0x005f | B | 0x00 |  |
| SYS_OPTION | 0x0061 | B | 0x00 |  |
| PWRCTRL_CONFIG0 | 0x0062 | B | 0x88 |  |
| PWRCTRL_CONFIG1 | 0x0063 | B | 0x08 |  |
| VSEL_CTR_SEL0 | 0x0064 | B | 0x00 |  |
| VSEL_CTR_SEL1 | 0x0065 | B | 0x00 |  |
| VSEL_CTR_SEL2 | 0x0066 | B | 0x00 |  |
| VSEL_CTR_SEL3 | 0x0067 | B | 0x00 |  |
| VSEL_CTR_SEL4 | 0x0068 | B | 0x00 |  |
| VSEL_CTR_SEL5 | 0x0069 | B | 0x00 |  |
| DVS_CTRL_SEL0 | 0x006a | B | 0x00 |  |
| DVS_CTRL_SEL1 | 0x006b | B | 0x00 |  |
| DVS_CTRL_SEL2 | 0x006c | B | 0x00 |  |
| DVS_CTRL_SEL3 | 0x006d | B | 0x00 |  |
| DVS_CTRL_SEL3 | 0x006e | B | 0x00 |  |
| DVS_START_CTRL | 0x0070 | B | 0x00 |  |
| PWRCTRL_GPIO | 0x0071 | B | 0x00 |  |
| SYS_CFG3 | 0x0072 | B | 0x00 |  |
| WDT_REG | 0x0073 | B | 0x00 |  |
| ON_SOURCE | 0x0074 | B | 0x00 |  |
| OFF_SOURCE | 0x0075 | B | 0x00 |  |
| PWRON_KEY | 0x0076 | B | 0x06<br>bit7：OTP |  |
| INT_STS0 | 0x0077 | B | 0x00 |  |
| INT_MSK0 | 0x0078 | B | 0x00 |  |
| INT_STS1 | 0x0079 | B | 0x00 |  |
| INT_MSK1 | 0x007a | B | 0x00 |  |
| GPIO_INT_CONFIG | 0x007b | B | 0x02 |  |
| DATA_REG0 | 0x007c | B | 0x00 |  |
| DATA_REG1 | 0x007d | B | 0x00 |  |
| DATA_REG2 | 0x007e | B | 0x00 |  |
| DATA_REG3 | 0x007f | B | 0x00 |  |
| DATA_REG4 | 0x0080 | B | 0x00 |  |
| DATA_REG5 | 0x0081 | B | 0x00 |  |
| DATA_REG6 | 0x0082 | B | 0x00 |  |
| DATA_REG7 | 0x0083 | B | 0x00 |  |
| DATA_REG8 | 0x0084 | B | 0x00 |  |
| DATA_REG9 | 0x0085 | B | 0x00 |  |
| DATA_REG10 | 0x0086 | B | 0x00 |  |
| DATA_REG11 | 0x0087 | B | 0x00 |  |
| DATA_REG12 | 0x0088 | B | 0x00 |  |
| DATA_REG13 | 0x0089 | B | 0x00 |  |
| DATA_REG14 | 0x008a | B | 0x00 |  |
| DATA_REG15 | 0x008b | B | 0x00 |  |
| BUCK_SEQ_REG0 | 0x00B2 | B | 0x00 |  |
| BUCK_SEQ_REG1 | 0x00B3 | B | 0x00 |  |
| BUCK_SEQ_REG2 | 0x00B4 | B | 0x00 |  |
| BUCK_SEQ_REG3 | 0x00B5 | B | 0x00 |  |
| BUCK_SEQ_REG4 | 0x00B6 | B | 0x00 |  |
| BUCK_SEQ_REG5 | 0x00B7 | B | 0x00 |  |
| BUCK_SEQ_REG6 | 0x00B8 | B | 0x00 |  |
| BUCK_SEQ_REG7 | 0x00B9 | B | 0x00 |  |
| BUCK_SEQ_REG8 | 0x00BA | B | 0x00 |  |
| BUCK_SEQ_REG9 | 0x00BB | B | 0x00 |  |
| BUCK_SEQ_REG10 | 0x00BC | B | 0x00 |  |
| BUCK_SEQ_REG11 | 0x00BD | B | 0x00 |  |
| BUCK_SEQ_REG12 | 0x00BE | B | 0x00 |  |
| BUCK_SEQ_REG13 | 0x00BF | B | 0x00 |  |
| BUCK_SEQ_REG14 | 0x00C0 | B | 0x00 |  |
| BUCK_SEQ_REG15 | 0x00C1 | B | 0x00 |  |
| BUCK_SEQ_REG16 | 0x00C2 | B | 0x00 |  |
| BUCK_SEQ_REG17 | 0x00C3 | B | 0x00 |  |
| BACKUP_REG7 | 0x00DC | B | 0x00 |  |
| BACKUP_REG6 | 0x00E6 | B | 0x00 |  |
| BACKUP_REG5 | 0x00E7 | B | 0x00 |  |
| BACKUP_REG1 | 0x00E8 | B | 0x00 |  |
| BACKUP_REG2 | 0x00E9 | B | 0x00 |  |
| BACKUP_REG3 | 0x00EA | B | 0x00 |  |
| BACKUP_REG4 | 0x00EB | B | 0x00 |  |
| BUCK_RSERVE_REG3 | 0x00FD | B | 0x00 |  |
| BUCK_RSERVE_REG4 | 0x00FE | B | 0x00 |  |

## 5.2 寄存器说明

以下150个地址完整保留476个位域行、属性和复位值。原稿有描述引用其它BUCK/LDO、字段拼写不一、BUCK9限流编码重复010、BUCK10速率高低位说明不一致等，均保留。0xEA原图未列bit2，已目视确认，不补造定义。RW/R/W1C和标识符原样保留。“Decode”为原稿交叉引用，本PDF未附该表。

### 0x00 — POWER_EN0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK4_EN_MASK BUCK4_EN_MASK：要修改BUCK4_EN位必须写1；写入BUCK4_EN后应清除BUCK4_EN_MASK位。 |
| 6 | RW | 0x0 | BUCK3_EN_MASK BUCK3_EN_MASK：要修改BUCK3_EN位必须写1；写入BUCK3_EN后应清除BUCK3_EN_MASK位。 |
| 5 | RW | 0x0 | BUCK2_EN_MASK BUCK2_EN_MASK：要修改BUCK2_EN位必须写1；写入BUCK2_EN后应清除BUCK2_EN_MASK位。 |
| 4 | RW | 0x0 | BUCK1_EN_MASK BUCK1_EN_MASK：要修改BUCK1_EN位必须写1；写入BUCK1_EN后应清除BUCK1_EN_MASK位。 |
| 3 | RW | OTP | BUCK4_EN BUCK4_EN：BUCK4在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | BUCK3_EN BUCK3_EN：BUCK3在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | BUCK2_EN BUCK2_EN：BUCK2在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | BUCK1_EN BUCK1_EN：BUCK1在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x01 — POWER_EN1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_EN_MASK BUCK8_EN_MASK：要修改BUCK8_EN位必须写1；写入BUCK8_EN后应清除BUCK8_EN_MASK位。 |
| 6 | RW | 0x0 | BUCK7_EN_MASK BUCK7_EN_MASK：要修改BUCK7_EN位必须写1；写入BUCK7_EN后应清除BUCK7_EN_MASK位。 |
| 5 | RW | 0x0 | BUCK6_EN_MASK BUCK6_EN_MASK：要修改BUCK6_EN位必须写1；写入BUCK6_EN后应清除BUCK6_EN_MASK位。 |
| 4 | RW | 0x0 | BUCK5_EN_MASK BUCK5_EN_MASK：要修改BUCK5_EN位必须写1；写入BUCK5_EN后应清除BUCK5_EN_MASK位。 |
| 3 | RW | OTP | BUCK8_EN BUCK8_EN：BUCK8在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | BUCK7_EN BUCK7_EN：BUCK7在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | BUCK6_EN BUCK6_EN：BUCK6在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | BUCK5_EN BUCK5_EN：BUCK5在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x02 — POWER_EN2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5 | RW | 0x0 | BUCK10_EN_MASK BUCK10_EN_MASK：要修改BUCK10_EN位必须写1；写入BUCK10_EN后应清除BUCK10_EN_MASK位。 |
| 4 | RW | 0x0 | BUCK9_EN_MASK BUCK9_EN_MASK：要修改BUCK9_EN位必须写1；写入BUCK9_EN后应清除BUCK9_EN_MASK位。 |
| 3:2 | RW | 0x0 | RESV：保留 |
| 1 | RW | OTP | BUCK10_EN BUCK10_EN：BUCK10在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | BUCK9_EN BUCK9_EN：BUCK9在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x03 — POWER_EN3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | NLDO4_EN_MASK NLDO4_EN_MASK：要修改NLDO4_EN位必须写1；写入NLDO4_EN后应清除NLDO4_EN_MASK位。 |
| 6 | RW | 0x0 | NLDO3_EN_MASK NLDO3_EN_MASK：要修改NLDO3_EN位必须写1；写入NLDO3_EN后应清除NLDO3_EN_MASK位。 |
| 5 | RW | 0x0 | NLDO2_EN_MASK NLDO2_EN_MASK：要修改NLDO2_EN位必须写1；写入NLDO2_EN后应清除NLDO2_EN_MASK位。 |
| 4 | RW | 0x0 | NLDO1_EN_MASK NLDO1_EN_MASK：要修改NLDO1_EN位必须写1；写入NLDO1_EN后应清除NLDO1_EN_MASK位。 |
| 3 | RW | OTP | NLDO4_EN NLDO4_EN：NLDO4在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | NLDO3_EN NLDO3_EN：NLDO3在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | NLDO2_EN NLDO2_EN：NLDO2在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | NLDO1_EN NLDO1_EN：NLDO1在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x04 — POWER_EN4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | PLDO3_EN_MASK PLDO3_EN_MASK：要修改PLDO3_EN位必须写1；写入PLDO3_EN后应清除PLDO3_EN_MASK位。 |
| 6 | RW | 0x0 | PLDO2_EN_MASK PLDO2_EN_MASK：要修改PLDO2_EN位必须写1；写入PLDO2_EN后应清除PLDO2_EN_MASK位。 |
| 5 | RW | 0x0 | PLDO1_EN_MASK PLDO1_EN_MASK：要修改PLDO1_EN位必须写1；写入PLDO1_EN后应清除PLDO1_EN_MASK位。 |
| 4 | RW | 0x0 | PLDO6_EN_MASK PLDO6_EN_MASK：要修改PLDO6_EN位必须写1；写入PLDO6_EN后应清除PLDO6_EN_MASK位。 |
| 3 | RW | OTP | PLDO3_EN PLDO3_EN：PLDO3在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | PLDO2_EN PLDO2_EN：PLDO2在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | PLDO1_EN PLDO1_EN：PLDO1在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | PLDO6_EN PLDO6_EN：PLDO6在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x05 — POWER_EN5

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV：保留 |
| 6 | RW | 0x0 | NLDO5_EN_MASK NLDO5_EN_MASK：要修改NLDO5_EN位必须写1；写入NLDO5_EN后应清除NLDO5_EN_MASK位。 |
| 5 | RW | 0x0 | PLDO5_EN_MASK PLDO5_EN_MASK：要修改PLDO5_EN位必须写1；写入PLDO5_EN后应清除PLDO5_EN_MASK位。 |
| 4 | RW | 0x0 | PLDO4_EN_MASK PLDO4_EN_MASK：要修改PLDO4_EN位必须写1；写入PLDO4_EN后应清除PLDO4_EN_MASK位。 |
| 3 | RW | 0x0 | RESV：保留 |
| 2 | RW | OTP | NLDO5_EN NLDO5_EN：NLDO5在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | PLDO5_EN PLDO5_EN：PLDO5在活动模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | PLDO4_EN PLDO4_EN：PLDO4在活动模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x06 — POWER_SLP_EN0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | OTP | BUCK8_SLP_EN BUCK8_SLP_EN：BUCK8在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 6 | RW | OTP | BUCK7_SLP_EN BUCK7_SLP_EN：BUCK7在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 5 | RW | OTP | BUCK6_SLP_EN BUCK6_SLP_EN：BUCK6在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 4 | RW | OTP | BUCK5_SLP_EN BUCK5_SLP_EN：BUCK5在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 3 | RW | OTP | BUCK4_SLP_EN BUCK4_SLP_EN：BUCK4在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | BUCK3_SLP_EN BUCK3_SLP_EN：BUCK3在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | BUCK2_SLP_EN BUCK2_SLP_EN：BUCK2在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | BUCK1_SLP_EN BUCK1_SLP_EN：BUCK1在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x07 — POWER_SLP_EN1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | OTP | BUCK10_SLP_EN BUCK10_SLP_EN：BUCK10在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 6 | RW | OTP | BUCK9_SLP_EN BUCK9_SLP_EN：BUCK9在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 5 | RW | OTP | RESV：保留 |
| 4 | RW | OTP | NLDO5_SLP_EN NLDO5_SLP_EN：NLDO5在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 3 | RW | OTP | NLDO4_SLP_EN NLDO4_SLP_EN：NLDO4在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | NLDO3_SLP_EN NLDO3_SLP_EN：NLDO3在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | NLDO2_SLP_EN NLDO2_SLP_EN：NLDO2在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | NLDO1_SLP_EN NLDO1_SLP_EN：NLDO1在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x08 — POWER_SLP_EN2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5 | RW | OTP | PLDO5_SLP_EN PLDO5_SLP_EN：PLDO5在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 4 | RW | OTP | PLDO4_SLP_EN PLDO4_SLP_EN：PLDO4在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 3 | RW | OTP | PLDO3_SLP_EN PLDO3_SLP_EN：PLDO3在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 2 | RW | OTP | PLDO2_SLP_EN PLDO2_SLP_EN：PLDO2在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 1 | RW | OTP | PLDO1_SLP_EN PLDO1_SLP_EN：PLDO1在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |
| 0 | RW | OTP | PLDO6_SLP_EN PLDO6_SLP_EN：PLDO6在睡眠模式使能；1启用，0禁用，默认由OTP设定。 |

### 0x09 — POWER_DISCHRG_EN0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK8_DISCHG_EN BUCK8_DISCHG_EN：BUCK8通道关闭时放电使能，0禁用，1启用。 |
| 6 | RW | 0x1 | BUCK7_DISCHG_EN BUCK7_DISCHG_EN：BUCK7通道关闭时放电使能，0禁用，1启用。 |
| 5 | RW | 0x1 | BUCK6_DISCHG_EN BUCK6_DISCHG_EN：BUCK6通道关闭时放电使能，0禁用，1启用。 |
| 4 | RW | 0x1 | BUCK5_DISCHG_EN BUCK5_DISCHG_EN：BUCK5通道关闭时放电使能，0禁用，1启用。 |
| 3 | RW | 0x1 | BUCK4_DISCHG_EN BUCK4_DISCHG_EN：BUCK4通道关闭时放电使能，0禁用，1启用。 |
| 2 | RW | 0x1 | BUCK3_DISCHG_EN BUCK3_DISCHG_EN：BUCK3通道关闭时放电使能，0禁用，1启用。 |
| 1 | RW | 0x1 | BUCK2_DISCHG_EN BUCK2_DISCHG_EN：BUCK2通道关闭时放电使能，0禁用，1启用。 |
| 0 | RW | 0x1 | BUCK1_DISCHG_EN BUCK1_DISCHG_EN：BUCK1通道关闭时放电使能，0禁用，1启用。 |

### 0x0A — POWER_DISCHRG_EN1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | BUCK10_DISCHG_EN BUCK10_DISCHG_EN：BUCK10通道关闭时放电使能，0禁用，1启用。 |
| 6 | RW | 0x1 | BUCK9_DISCHG_EN BUCK9_DISCHG_EN：BUCK9通道关闭时放电使能，0禁用，1启用。 |
| 5 | RW | 0x0 | RESV：保留 |
| 4 | RW | 0x1 | NLDO5_DISCHG_EN NLDO5_DISCHG_EN：NLDO5通道关闭时放电使能，0禁用，1启用。 |
| 3 | RW | 0x1 | NLDO4_DISCHG_EN NLDO4_DISCHG_EN：NLDO4通道关闭时放电使能，0禁用，1启用。 |
| 2 | RW | 0x1 | NLDO3_DISCHG_EN NLDO3_DISCHG_EN：NLDO3通道关闭时放电使能，0禁用，1启用。 |
| 1 | RW | 0x1 | NLDO2_DISCHG_EN NLDO2_DISCHG_EN：NLDO2通道关闭时放电使能，0禁用，1启用。 |
| 0 | RW | 0x1 | NLDO1_DISCHG_EN NLDO1_DISCHG_EN：NLDO1通道关闭时放电使能，0禁用，1启用。 |

### 0x0B — POWER_DISCHRG_EN2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5 | RW | 0x1 | PLDO6_DISCHG_EN PLDO6_DISCHG_EN：PLDO6通道关闭时放电使能，0禁用，1启用。 |
| 4 | RW | 0x1 | PLDO5_DISCHG_EN PLDO5_DISCHG_EN：PLDO5通道关闭时放电使能，0禁用，1启用。 |
| 3 | RW | 0x1 | PLDO4_DISCHG_EN PLDO4_DISCHG_EN：PLDO4通道关闭时放电使能，0禁用，1启用。 |
| 2 | RW | 0x1 | PLDO3_DISCHG_EN PLDO3_DISCHG_EN：PLDO3通道关闭时放电使能，0禁用，1启用。 |
| 1 | RW | 0x1 | PLDO2_DISCHG_EN PLDO2_DISCHG_EN：PLDO2通道关闭时放电使能，0禁用，1启用。 |
| 0 | RW | 0x1 | PLDO1_DISCHG_EN PLDO1_DISCHG_EN：PLDO1通道关闭时放电使能，0禁用，1启用。 |

### 0x0C — BUCK_FB_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK10_LP_EN BUCK10_LP_EN：BUCK10低功耗功能使能，0禁用，1启用。 |
| 6 | RW | 0x0 | BUCK9_LP_EN BUCK9_LP_EN：BUCK9低功耗功能使能，0禁用，1启用。 |
| 5 | RW | 0x0 | RESV：保留 |
| 4 | RW | 0x0 | PLDO_SLP_LP_EN PLDO_SLP_LP_EN：PLDO低功耗功能使能，0禁用，1启用。 |
| 3 | RW | 0x0 | NLDO_SLP_LP_EN NLDO_SLP_LP_EN：NLDO低功耗功能使能，0禁用，1启用。 |
| 2 | RW | 0x0 | BK_LDO3V_LPEN BUCK3_LP_EN：3VLDO低功耗功能使能，0禁用，1启用。 |
| 1 | RW | 0x0 | BK_LDO3V_BPEN BK_LDO3V_BPEN: 禁用3V LDO并短接VDD的使能位 0禁用，1启用 |
| 0 | RW | 0X1 | BK_LDO3V_EN BK_LDO3V_EN: 使能位： BK_LDO3V 0禁用，1启用 |

### 0x0D — SLP_LP_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_LP_EN BUCK8_LP_EN：BUCK8低功耗功能使能，0禁用，1启用。 |
| 6 | RW | 0x0 | BUCK7_LP_EN BUCK7_LP_EN：BUCK7低功耗功能使能，0禁用，1启用。 |
| 5 | RW | 0x0 | BUCK6_LP_EN BUCK6_LP_EN：BUCK6低功耗功能使能，0禁用，1启用。 |
| 4 | RW | 0x0 | BUCK5_LP_EN BUCK5_LP_EN：BUCK5低功耗功能使能，0禁用，1启用。 |
| 3 | RW | 0x0 | BUCK4_LP_EN BUCK4_LP_EN：BUCK4低功耗功能使能，0禁用，1启用。 |
| 2 | RW | 0x0 | BUCK3_LP_EN BUCK3_LP_EN：BUCK3低功耗功能使能，0禁用，1启用。 |
| 1 | RW | 0x0 | BUCK2_LP_EN BUCK2_LP_EN：BUCK2低功耗功能使能，0禁用，1启用。 |
| 0 | RW | 0X1 | BUCK1_LP_EN BUCK1_LP_EN：BUCK1低功耗功能使能，0禁用，1启用。 |

### 0x0E — POWER_FPWM_EN0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_ON_FPWM BUCK8_ON_FPWM：BUCK8强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 6 | RW | 0x0 | BUCK7_ON_FPWM BUCK7_ON_FPWM：BUCK7强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 5 | RW | 0x0 | BUCK6_ON_FPWM BUCK6_ON_FPWM：BUCK6强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 4 | RW | 0x0 | BUCK5_ON_FPWM BUCK5_ON_FPWM：BUCK5强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 3 | RW | 0x0 | BUCK4_ON_FPWM BUCK4_ON_FPWM：BUCK4强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 2 | RW | 0x0 | BUCK3_ON_FPWM BUCK3_ON_FPWM：BUCK3强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 1 | RW | 0x0 | BUCK2_ON_FPWM BUCK2_ON_FPWM：BUCK2强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 0 | RW | 0X1 | BUCK1_ON_FPWM BUCK1_ON_FPWM：BUCK1强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |

### 0x0F — POWER_FPWM_EN1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:2 | RW | 0x0 | RESV：保留 |
| 1 | RW | 0x0 | BUCK10_ON_FPWM BUCK10_ON_FPWM：BUCK10强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |
| 0 | RW | 0X1 | BUCK9_ON_FPWM BUCK9_ON_FPWM：BUCK9强制PWM选择；1在活动模式强制PWM，0自动切换PWM/PFM。 |

### 0x10 — BUCK1_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK1_RATE BUCK1_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK1_ILPK BUCK1_ILPK：BUCK1峰值限流选择，必须与BUCK1_ ILVL联动调整，写入相同编码。000:6.4A 001:7.0A 010:7.6A 011:8.3A 100:9A 101:9.8A 110:10.7A 111:11.6A |
| 2:0 | RW | 0x4 | BUCK1_ILVL BUCK1_ILVL：BUCK1谷值限流选择，与BUCK1_ ILPK联动调整，写入相同编码。000:5.0A 001:5.4A 010:5.9A 011:6.4A 100:7A 101:7.6A 110:8.3A 111:9.0A |

### 0x11 — BUCK2_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK2_RATE BUCK2_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK2_ILPK BUCK2_ILPK：BUCK1峰值限流选择，必须与BUCK2_ILVL联动调整，写入相同编码。000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK2_ILVL BUCK2_ILVL：BUCK2谷值限流选择，与BUCK2_ILPK联动调整，写入相同编码。000:3.4A 001:3.8A 010:4.1A 011:4.5A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x12 — BUCK3_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK3_RATE BUCK3_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK3_ILPK BUCK3_ILPK：BUCK3峰值限流选择，必须与BUCK3_ILVL联动调整，写入相同编码。000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK3_ILVL BUCK3_ILVL：BUCK3谷值限流选择，与BUCK3_ILPK联动调整，写入相同编码。000:3.4A 001:3.8A 010:4.1A 011:4.6A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x13 — BUCK4_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK4_RATE BUCK4_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK4_ILPK BUCK4_ILPK：BUCK4峰值限流选择，必须与BUCK4_ILVL联动调整，写入相同编码。000:4.8A 001:5.3A 010:5.8A 011:6.4A 100:7A 101:7.7A 110:8.5A 111:9.3A |
| 2:0 | RW | 0x4 | BUCK4_ILVL BUCK4_ILVL：BUCK4谷值限流选择，与BUCK4_ILPK联动调整，写入相同编码。000:3.4A 001:3.8A 010:4.1A 011:4.5A 100:5A 101:5.5A 110:6.1A 111:6.7A |

### 0x14 — BUCK5_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK5_RATE BUCK5_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK5_ILPK BUCK5_ILPK：BUCK5峰值限流选择，必须与BUCK5_ILVL联动调整，写入相同编码。000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK5_ILVL BUCK5_ILVL：BUCK5谷值限流选择，与BUCK5_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x15 — BUCK6_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK6_RATE BUCK6_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK6_ILPK BUCK6_ILPK：BUCK6峰值限流选择，必须与BUCK6_ILVL联动调整，写入相同编码。000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK6_ILVL BUCK6_ILVL：BUCK6谷值限流选择，与BUCK6_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x16 — BUCK7_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK7_RATE BUCK7_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK7_ILPK BUCK7_ILPK：BUCK7峰值限流选择，必须与BUCK1_ILVL联动调整，写入相同编码。000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK7_ILVL BUCK7_ILVL：BUCK7谷值限流选择，与BUCK7_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x17 — BUCK8_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK8_RATE BUCK8_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EB寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK8_ILPK BUCK8_ILPK：BUCK8峰值限流选择，必须与BUCK8_ILVL联动调整，写入相同编码。000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK8_ILVL BUCK8_ILVL：BUCK8谷值限流选择，与BUCK8_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x18 — BUCK9_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK9_RATE BUCK9_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EA寄存器。000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK9_ILPK BUCK9_ILPK：BUCK9峰值限流选择，必须与BUCK9_ILVL联动调整，写入相同编码。000:2.7A 010:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK9_ILVL BUCK9_ILVL：BUCK9谷值限流选择，与BUCK9_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x19 — BUCK10_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x1 | BUCK10_RATE BUCK10_RATE：DVS后的电压变化速率（原稿2M clack），3位，其中BIT&lt;2&gt;位于EA寄存器。000: 4lsb/1clk;001: 2lsb/4clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5:3 | RW | 0x4 | BUCK10_ILPK BUCK10_ILPK：BUCK10峰值限流选择，必须与BUCK10_ILVL联动调整，写入相同编码。000:2.7A 001:3A 010:3.3A 011:3.6A 100:4A 101:4.4A 110:4.8A 111:5.3A |
| 2:0 | RW | 0x4 | BUCK10_ILVL BUCK10_ILVL：BUCK10谷值限流选择，与BUCK10_ILPK联动调整，写入相同编码。000:2.2A 001:2.4A 010:2.6A 011:2.9A 100:3.2A 101:3.5A 110:3.9A 111:4.3A |

### 0x1A — BUCK1_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK1_ON_VSEL BUCK1_ON_VSEL：BUCK1活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x1B — BUCK2_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK2_ON_VSEL BUCK2_ON_VSEL：BUCK2活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x1C — BUCK3_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK3_ON_VSEL BUCK3_ON_VSEL：BUCK3活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x1D — BUCK4_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK4_ON_VSEL BUCK4_ON_VSEL：BUCK4活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x1E — BUCK5_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK5_ON_VSEL BUCK5_ON_VSEL：BUCK5活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x1F — BUCK6_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK6_ON_VSEL BUCK6_ON_VSEL：BUCK1活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x20 — BUCK7_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK7_ON_VSEL BUCK7_ON_VSEL：BUCK7活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x21 — BUCK8_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK8_ON_VSEL BUCK8_ON_VSEL：BUCK8活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x22 — BUCK9_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK9_ON_VSEL BUCK9_ON_VSEL：BUCK9活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x23 — BUCK10_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK10_ON_VSEL BUCK10_ON_VSEL：BUCK10活动模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x24 — BUCK1_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK1_SLP_VSEL BUCK1_SLP_VSEL：BUCK1睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x25 — BUCK2_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK2_SLP_VSEL BUCK2_SLP_VSEL：BUCK2睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x26 — BUCK3_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK3_SLP_VSEL BUCK3_SLP_VSEL：BUCK3睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x27 — BUCK4_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK4_SLP_VSEL BUCK4_SLP_VSEL：BUCK4睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x28 — BUCK5_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK5_SLP_VSEL BUCK5_SLP_VSEL：BUCK5睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x29 — BUCK6_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK6_SLP_VSEL BUCK6_SLP_VSEL：BUCK6睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x2A — BUCK7_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK7_SLP_VSEL BUCK7_SLP_VSEL：BUCK7睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x2B — BUCK8_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK8_SLP_VSEL BUCK8_SLP_VSEL：BUCK8睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x2C — BUCK9_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK9_SLP_VSEL BUCK9_SLP_VSEL：BUCK9睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x2D — BUCK10_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | BUCK10_SLP_VSEL BUCK10_SLP_VSEL：BUCK10睡眠模式电压选择，0.5V~1.5V(步进=6.25mV), 1.5~3.4V(步进=25mV)。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x3C — BUCK_DEBUG13

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK2_CMIN_ENB BUCK2_CMIN_ENB: BUCK2 最小电流限制 启用。 0启用，1禁用 |
| 6:4 | RW | 0x4 | BUCK2_CMIN_SEL BUCK2_CMIN_SEL：BUCK2最小电流限制选择。000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |
| 3 | RW | 0x0 | BUCK1_CMIN_ENB BUCK1_CMIN_ENB: BUCK1 最小电流限制 启用。 0启用，1禁用 |
| 2:0 | RW | 0x4 | BUCK1_CMIN_SEL BUCK1_CMIN_SEL：BUCK1最小电流限制选择。000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |

### 0x3D — BUCK_DEBUG14

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK4_CMIN_ENB BUCK4_CMIN_ENB: BUCK4 最小电流限制 启用。 0启用，1禁用 |
| 6:4 | RW | 0x4 | BUCK4_CMIN_SEL BUCK4_CMIN_SEL：BUCK4最小电流限制选择。000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |
| 3 | RW | 0x0 | BUCK3_CMIN_ENB BUCK3_CMIN_ENB: BUCK3 最小电流限制 启用。 0启用，1禁用 |
| 2:0 | RW | 0x4 | BUCK3_CMIN_SEL BUCK3_CMIN_SEL：BUCK3最小电流限制选择。000:1.1A; 001:1A; 010:0.906A; 011:0.805A; 100:0.716A; 101:0.636A; 110:0.566A; 111:0.503A |

### 0x3E — BUCK_DEBUG15

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK6_CMIN_ENB BUCK6_CMIN_ENB: BUCK6 最小电流限制 启用。 0启用，1禁用 |
| 6:4 | RW | 0x4 | BUCK6_CMIN_SEL BUCK6_CMIN_SEL：BUCK6最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK5_CMIN_ENB BUCK5_CMIN_ENB: BUCK5 最小电流限制 启用。 0启用，1禁用 |
| 2:0 | RW | 0x4 | BUCK5_CMIN_SEL BUCK5_CMIN_SEL：BUCK5最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x3F — BUCK_DEBUG16

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_CMIN_ENB BUCK8_CMIN_ENB: BUCK8 最小电流限制 启用。 0启用，1禁用 |
| 6:4 | RW | 0x4 | BUCK8_CMIN_SEL BUCK8_CMIN_SEL：BUCK8最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK7_CMIN_ENB BUCK7_CMIN_ENB: BUCK7 最小电流限制 启用。 0启用，1禁用 |
| 2:0 | RW | 0x4 | BUCK7_CMIN_SEL BUCK7_CMIN_SEL：BUCK7最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x40 — BUCK_DEBUG17

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK10_CMIN_ENB BUCK10_CMIN_ENB: BUCK10 最小电流 限制使能。 0启用，1禁用 |
| 6:4 | RW | 0x4 | BUCK10_CMIN_SEL BUCK10_CMIN_SEL：BUCK10最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |
| 3 | RW | 0x0 | BUCK9_CMIN_ENB BUCK9_CMIN_ENB: BUCK9 最小电流限制 启用。 0启用，1禁用 |
| 2:0 | RW | 0x4 | BUCK9_CMIN_SEL BUCK9_CMIN_SEL：BUCK9最小电流限制选择。000:0.57A; 001:0.506A; 010:0.45A; 011:0.4A; 100:0.356A; 101:0.316A; 110:0.281A; 111:0.25A |

### 0x42 — NLDO_IMAX

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV：保留 |
| 6 | RW | 0x0 | RESV：保留 |
| 5 | RW | 0x0 | RESV：保留 |
| 4 | RW | 0x0 | NLDO5_IMAX NLDO5_IMAX：NLDO5限流设置，0正常，1为正常值的130%。 |
| 3 | RW | 0x0 | NLDO4_IMAX NLDO4_IMAX：NLDO4限流设置，0正常，1为正常值的130%。 |
| 2 | RW | 0x0 | NLDO3_IMAX NLDO3_IMAX：NLDO3限流设置，0正常，1为正常值的130%。 |
| 1 | RW | 0x0 | NLDO2_IMAX NLDO2_IMAX：NLDO2限流设置，0正常，1为正常值的130%。 |
| 0 | RW | 0x0 | NLDO1_IMAX NLDO1_IMAX：NLDO1限流设置，0正常，1为正常值的130%。 |

### 0x43 — NLDO1_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO1_ON_VSEL NLDO1_ON_VSEL：NLDO1活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x44 — NLDO2_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO2_ON_VSEL NLDO2_ON_VSEL：NLDO2活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x45 — NLDO3_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO3_ON_VSEL NLDO3_ON_VSEL：NLDO3活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x46 — NLDO4_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO4_ON_VSEL NLDO4_ON_VSEL：NLDO4活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x47 — NLDO5_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO5_ON_VSEL NLDO5_ON_VSEL：NLDO5活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x48 — NLDO1_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO1_SLP_VSEL NLDO1_SLP_VSEL：NLDO1睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x49 — NLDO2_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO2_SLP_VSEL NLDO2_SLP_VSEL：NLDO2睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x4A — NLDO3_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO3_SLP_VSEL NLDO3_SLP_VSEL：NLDO3睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x4B — NLDO4_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO4_SLP_VSEL NLDO4_SLP_VSEL：NLDO4睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x4C — NLDO5_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | NLDO5_SLP_VSEL NLDO5_SLP_VSEL：NLDO5睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x4D — PLDO_IMAX

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5 | RW | 0x0 | PLDO6_IMAX PLDO6_IMAX：PLDO6限流设置，0正常，1为正常值的130%。 |
| 4 | RW | 0x0 | PLDO5_IMAX PLDO5_IMAX：PLDO5限流设置，0正常，1为正常值的130%。 |
| 3 | RW | 0x0 | PLDO4_IMAX PLDO4_IMAX：PLDO4限流设置，0正常，1为正常值的130%。 |
| 2 | RW | 0x0 | PLDO3_IMAX PLDO3_IMAX：PLDO3限流设置，0正常，1为正常值的130%。 |
| 1 | RW | 0x0 | PLDO2_IMAX PLDO2_IMAX：PLDO2限流设置，0正常，1为正常值的130%。 |
| 0 | RW | 0x0 | PLDO1_IMAX PLDO1_IMAX：PLDO1限流设置，0正常，1为正常值的130%。 |

### 0x4E — PLDO1_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO1_ON_VSEL PLDO1_ON_VSEL：PLDO1活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x4F — PLDO2_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO2_ON_VSEL PLDO2_ON_VSEL：PLDO2活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x50 — PLDO3_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO3_ON_VSEL PLDO3_ON_VSEL：PLDO3活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x51 — PLDO4_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO4_ON_VSEL PLDO4_ON_VSEL：PLDO4活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x52 — PLDO5_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO5_ON_VSEL PLDO5_ON_VSEL：PLDO5活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x53 — PLDO6_ON_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO6_ON_VSEL PLDO6_ON_VSEL：PLDO6活动模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x54 — PLDO1_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO1_ON_VSEL PLDO1_ON_VSEL：PLDO1睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x55 — PLDO2_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO2_ON_VSEL PLDO2_ON_VSEL：PLDO2睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x56 — PLDO3_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO3_ON_VSEL PLDO3_ON_VSEL：PLDO3睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x57 — PLDO4_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO4_ON_VSEL PLDO4_ON_VSEL：PLDO4睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x58 — PLDO5_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO5_ON_VSEL PLDO5_ON_VSEL：PLDO5睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x59 — PLDO6_SLP_VSEL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | OTP | PLDO6_ON_VSEL PLDO6_ON_VSEL：PLDO6睡眠模式电压选择，0.5V~3.4V(步进=12.5mV).。详细位解码见原稿引用的“Decode”表，默认由OTP设定。 |

### 0x5A — CHIP_VER

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RO | 0x80 | CHIP_NAME&lt;11:4&gt; CHIP_NAME&lt;11:4&gt;: RK806 |

### 0x5B — CHIP_VER

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:4 | RO | 0x6 | CHIP_NAME&lt;3:0&gt; CHIP_NAME&lt;3:0&gt;: RK806 |
| 3:0 | RO | 0x2 | CHIP_VER&lt;3:0&gt; CHIP_VER&lt;3:0&gt;:芯片版本 |

### 0x5C — OTP_VER

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:4 | RO | 0x0 | RESV：保留 |
| 3:0 | RO | OTP | OTP_VER&lt;3:0&gt; OTP_VER&lt;3:0&gt;: OTP版本 |

### 0x5D — SYS_STS

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RO | 0x0 | PWRON_STS PWRON_STS : PWRON按键状态：0未按，1按下 |
| 6 | RO | 0x0 | VDC_STS VDC_STS: 0低电平；1高电平 |
| 5 | RO | 0x0 | VB_UV_STS VB_UV_STS: VCC1欠压锁定状态（该位1时关机） |
| 4 | RO | 0x0 | VB_LO_STS VB_LO_STS: 电池低压状态 0: VCC1&gt;VB_LO_SEL 1: VCC1&lt;VB_LO_SEL |
| 3 | RO | 0x0 | HOTDIE_STS HOTDIE_STS: 芯片过热告警 |
| 2 | RO | 0x0 | TSD_STS TSD_STS: 热关机 |
| 1 | RO | 0x0 | RESV：保留 |
| 0 | RO | 0x0 | VB_OV_STS VB_OV_STS: 发生SYS过压 |

### 0x5E — SYS_CFG0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_UV_DLY VB_UV_DLY: VCC1欠压系统关机生效时间 0:5us 1:50us |
| 6:4 | RW | 0x0 | VB_UV_SEL VB_UV_SEL: :系统关机电压选择 000~111:2.7v~3.4v |
| 3 | RW | 0x1 | VB_LO_ACT VB_LO_ACT: VCC1低压动作：0关机，1触发中断 |
| 2:0 | RW | 0x4 | VB_LO_SEL VB_LO_SEL: VCC1低压阈值 000~111: 2.8V~ 3.5V, 步进=100mV |

### 0x5F — SYS_CFG1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | ABNORDET_ENB ABNORDET_ENB: 异常检测使能 0启用，1禁用 |
| 6 | RW | 0x0 | TSD_TEMP TSD_TEMP: TSD_TEMP: 热关机温度阈值 0: 140℃; 1: 160℃ |
| 5:4 | RW | 0x0 | HOTDIE_TEMP HOTDIE_TEMP: 芯片过热温度阈值 00:85℃ 01:95℃ 10:105℃ 11:115℃ |
| 3 | RW | 0x0 | SYS_OV_SD_EN SYS_OV_SD_EN: VCC1过压时关闭BUCK1~10 0禁用，1启用 |
| 2 | RW | 0x0 | SYS_OV_SD_DLY_SEL SYS_OV_SD_DLY_SEL: SYS过压比较器延时选择 0: 8uS 1:30uS |
| 1:0 | RW | 0x0 | DLY_ABN_SHORT DLY_ABN_SHORT: 异常检测延时 00:x1 01:x0.875 10:x0.75 11:x0.625 |

### 0x61 — SYS_OPTION

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0  | VBUVLOCK_EN VBUVLOCK_EN: 启动后锁定UV 0禁用，1启用 |
| 6 | RW | 0x0 | BG_PW_SEL BG_PW_SEL : 内部电源选择 0：VCCRTC 1:LDO3V |
| 5:4 | RW | 0x0 | VCCXDET_DIS VCCXDET_DIS：OVP/UVLO/VB_LO作用于 00:VCCA,VCC1,VCC2 01: VCCA, VCC2 10:VCCA,VCC1 11: VCCA |
| 3 | RW | 0x0 | RESV：保留 |
| 2 | RW | 0x0 | TDLY_ABN_LONG TDLY_ABN_LONG: 异常检测延时 0: x1 1:x1.5 |
| 1 | RW | 0x0 | 2M_ENB2 2M_ENB2: 数字输出2MHz时钟强制使能 0启用，1禁用 |
| 0 | RW | 0x0 | 32K_ENB 32K_ENB: 数字输出32KHz时钟强制使能 0启用，1禁用 |

### 0x62 — PWRCTRL_CONFIG0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x1 | PWRCTRL2_POL PWRCTRL2_POL: PWRCTRL2引脚极性 0低有效，1高有效 |
| 6:4 | RW | 0x0 | PWRCTRL2_FUN PWRCTRL2_FUN：PWRCTRL2功能选择，响应需100us。000无作用；001：有效进入SLEEP，无效退出；010：有效关机；011：有效重启；100：有效将第n组电源切至XX_SLP_VSEL，无效切至XX_ON_VSEL；退出此调压功能前必须复位XX_VSEL_CTR_SEL；101：GPIO。 |
| 3 | RW | 0x1 | PWRCTRL1_POL PWRCTRL1_POL: PWRCTRL1引脚极性 0低有效，1高有效 |
| 2:0 | RW | 0x0 | PWRCTRL1_FUN PWRCTRL1_FUN：PWRCTRL1功能选择，响应需100us。000无作用；001：有效进入SLEEP，无效退出；010：有效关机；011：有效重启；100：有效将第n组电源切至XX_SLP_VSEL，无效切至XX_ON_VSEL；退出此调压功能前必须复位XX_VSEL_CTR_SEL；101：GPIO。 |

### 0x63 — PWRCTRL_CONFIG1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV：保留 |
| 3 | RW | 0x1 | PWRCTRL3_POL PWRCTRL3_POL: PWRCTRL3引脚极性 0低有效，1高有效 |
| 2:0 | RW | 0x0 | PWRCTRL3_FUN PWRCTRL3_FUN：PWRCTRL3功能选择，响应需100us。000无作用；001：有效进入SLEEP，无效退出；010：有效关机；011：有效重启；100：有效将第n组电源切至XX_SLP_VSEL，无效切至XX_ON_VSEL；退出此调压功能前必须复位XX_VSEL_CTR_SEL；101：GPIO。 |

### 0x64 — VSEL_CTR_SEL0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK2_DVS_CTR_SEL BUCK2_DVS_CTR_SEL: 电源受以下控制： PWRCRTL(1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | BUCK2_VSEL_CTR_SEL BUCK2_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK2_VSEL选择BUCK2_ON_VSEL或BUCK2_SLP_VSEL，以及O_ BUCK2_EN选择BUCK2_EN或BUCK2_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK2_VSEL选择BUCK2_ON_VSEL或BUCK2_SLP_VSEL，以及O_ BUCK2_EN选择BUCK2_EN或BUCK2_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK2_VSEL选择BUCK2_ON_VSEL或BUCK2_SLP_VSEL，以及O_ BUCK2_EN选择BUCK2_EN或BUCK2_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | BUCK1_DVS_CTR_SEL BUCK1_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | BUCK1_VSEL_CTR_SEL BUCK1_ VSEL _CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK1_VSEL选择BUCK1_ON_VSEL或BUCK1_SLP_VSEL，以及O_ BUCK1_EN选择BUCK1_EN或BUCK1_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK1_VSEL选择BUCK1_ON_VSEL或BUCK1_SLP_VSEL，以及O_ BUCK1_EN选择BUCK1_EN或BUCK1_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK1_VSEL选择BUCK1_ON_VSEL或BUCK1_SLP_VSEL，以及O_ BUCK1_EN选择BUCK1_EN或BUCK1_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x65 — VSEL _CTR_SEL1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK4_DVS_CTR_SEL BUCK4_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | BUCK4_VSEL_CTR_SEL BUCK4_ VSEL _CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK4_VSEL选择BUCK4_ON_VSEL或BUCK4_SLP_VSEL，以及O_ BUCK4_EN选择BUCK4_EN或BUCK4_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK4_VSEL选择BUCK4_ON_VSEL或BUCK4_SLP_VSEL，以及O_ BUCK4_EN选择BUCK4_EN或BUCK4_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK4_VSEL选择BUCK4_ON_VSEL或BUCK4_SLP_VSEL，以及O_ BUCK4_EN选择BUCK4_EN或BUCK2_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 \ |
| 3:2 | RW | 0x0 | BUCK3_DVS_CTR_SEL BUCK3_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | BUCK3_VSEL_CTR_SEL BUCK3_ VSEL _CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK3_VSEL选择BUCK3_ON_VSEL或BUCK3_SLP_VSEL，以及O_ BUCK3_EN选择BUCK3_EN或BUCK3_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK3_VSEL选择BUCK3_ON_VSEL或BUCK3_SLP_VSEL，以及O_ BUCK3_EN选择BUCK3_EN或BUCK3_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK3_VSEL选择BUCK3_ON_VSEL或BUCK3_SLP_VSEL，以及O_ BUCK3_EN选择BUCK3_EN或BUCK3_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x66 — VSEL_CTR_SEL2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK6_DVS_CTR_SEL BUCK6_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | BUCK6_VSEL_CTR_SEL BUCK6_ VSEL _CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK6_VSEL选择BUCK6_ON_VSEL或BUCK6_SLP_VSEL，以及O_ BUCK6_EN选择BUCK6_EN或BUCK6_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK6_VSEL选择BUCK6_ON_VSEL或BUCK6_SLP_VSEL，以及O_ BUCK6_EN选择BUCK6_EN或BUCK6_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK6_VSEL选择BUCK6_ON_VSEL或BUCK6_SLP_VSEL，以及O_ BUCK6_EN选择BUCK6_EN或BUCK6_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | BUCK5_DVS_CTR_SEL BUCK5_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | BUCK5_VSEL_CTR_SEL BUCK5_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK5_VSEL选择BUCK5_ON_VSEL或BUCK5_SLP_VSEL，以及O_ BUCK5_EN选择BUCK5_EN或BUCK5_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK5_VSEL选择BUCK5_ON_VSEL或BUCK5_SLP_VSEL，以及O_ BUCK5_EN选择BUCK5_EN或BUCK5_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK5_VSEL选择BUCK5_ON_VSEL或BUCK5_SLP_VSEL，以及O_ BUCK5_EN选择BUCK5_EN或BUCK5_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x67 — VSEL_CTR_SEL3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK8_DVS_CTR_SEL BUCK8_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | BUCK8_VSEL_CTR_SEL BUCK8_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK8_VSEL选择BUCK8_ON_VSEL或BUCK8_SLP_VSEL，以及O_ BUCK8_EN选择BUCK8_EN或BUCK8_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK8_VSEL选择BUCK8_ON_VSEL或BUCK8_SLP_VSEL，以及O_ BUCK8_EN选择BUCK8_EN或BUCK8_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK8_VSEL选择BUCK8_ON_VSEL或BUCK8_SLP_VSEL，以及O_ BUCK8_EN选择BUCK8_EN或BUCK8_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | BUCK7_DVS_CTR_SEL BUCK7_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | BUCK7_VSEL_CTR_SEL BUCK7_VSE _CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK7_VSEL选择BUCK7_ON_VSEL或BUCK7_SLP_VSEL，以及O_ BUCK7_EN选择BUCK7_EN或BUCK7_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK7_VSEL选择BUCK7_ON_VSEL或BUCK7_SLP_VSEL，以及O_ BUCK7_EN选择BUCK7_EN或BUCK7_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK7_VSEL选择BUCK7_ON_VSEL或BUCK7_SLP_VSEL，以及O_ BUCK7_EN选择BUCK7_EN或BUCK7_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x68 — VSEL_CTR_SEL4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK10_DVS_CTR_SEL BUCK10_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | BUCK10_VSEL_CTR_SEL BUCK10_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK10_VSEL选择BUCK10_ON_VSEL或BUCK10_SLP_VSEL，以及O_ BUCK10_EN选择BUCK10_EN或BUCK10_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK10_VSEL选择BUCK10_ON_VSEL或BUCK10_SLP_VSEL，以及O_ BUCK10_EN选择BUCK10_EN或BUCK10_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK10_VSEL选择BUCK10_ON_VSEL或BUCK10_SLP_VSEL，以及O_ BUCK10_EN选择BUCK10_EN或BUCK10_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | BUCK9_DVS_CTR_SEL BUCK9_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | BUCK9_VSEL_CTR_SEL BUCK9_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCTRL1:（PWRCTRL1 信号控制 O_BUCK9_VSEL选择BUCK9_ON_VSEL或BUCK9_SLP_VSEL，以及O_ BUCK9_EN选择BUCK9_EN或BUCK9_SLP_EN） 10：受控于 PWRCTRL2:（PWRCTRL2 信号控制 O_BUCK9_VSEL选择BUCK9_ON_VSEL或BUCK9_SLP_VSEL，以及O_ BUCK9_EN选择BUCK9_EN或BUCK9_SLP_EN） 11：受控于 PWRCTRL3:（S PWRCTRL3 信号控制 O_BUCK9_VSEL选择BUCK9_ON_VSEL或BUCK9_SLP_VSEL，以及O_ BUCK9_EN选择BUCK9_EN或BUCK9_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x69 — VSEL_CTR_SEL5

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | NLDO2_DVS_CTR_SEL NLDO2_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | NLDO2_VSEL_CTR_SEL NLDO2_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL:（PWRCRTL1 信号控制 O_ NLDO2_VSEL选择NLDO2_ON_VSEL或NLDO2_SLP_VSEL，以及O_ NLDO2_EN选择NLDO2_EN或NLDO2_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ NLDO2_VSEL选择O_ NLDO2_VSEL或NLDO2_SLP_VSEL，以及O_ NLDO2_EN选择NLDO2_EN或NLDO2_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ NLDO2_VSEL选择NLDO2_ON_VSEL或NLDO2_SLP_VSEL，以及O_ NLDO2_EN选择NLDO2_EN或NLDO2_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | NLDO1_DVS_CTR_SEL NLDO1_DVS_CTR_SEL: 电源受以下控制： PWRCRTL(1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | NLDO1_VSEL_CTR_SEL NLDO1_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ NLDO1_VSEL选择NLDO1_ON_VSEL或NLDO1_SLP_VSEL，以及O_ NLDO1_EN选择NLDO1_EN或NLDO1_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ NLDO1_VSEL选择O_ NLDO1_VSEL或NLDO1_SLP_VSEL，以及O_ NLDO1_EN选择NLDO1_EN或NLDO1_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ NLDO1_VSEL选择NLDO1_ON_VSEL或NLDO1_SLP_VSEL，以及O_ NLDO1_EN选择NLDO1_EN或NLDO1_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x6A — DVS_CTRL_SEL0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | NLDO4_DVS_CTR_SEL NLDO4_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | NLDO4_VSEL_CTR_SEL NLDO4_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ NLDO4_VSEL选择NLDO4_ON_VSEL或NLDO4_SLP_VSEL，以及O_ NLDO4_EN选择NLDO4_EN或NLDO4_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ NLDO4_VSEL选择O_ NLDO4_VSEL或NLDO4_SLP_VSEL，以及O_ NLDO4_EN选择NLDO4_EN或NLDO4_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ NLDO4_VSEL选择NLDO4_ON_VSEL或NLDO4_SLP_VSEL，以及O_ NLDO4_EN选择NLDO4_EN或NLDO4_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | NLDO3_DVS_CTR_SEL NLDO3_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | NLDO3_VSEL_CTR_SEL NLDO3_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ NLDO3_VSEL选择NLDO3_ON_VSEL或NLDO3_SLP_VSEL，以及O_ NLDO1_EN选择NLDO3_EN或NLDO3_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ NLDO3_VSEL选择O_ NLDO3_VSEL或NLDO3_SLP_VSEL，以及O_ NLDO3_EN选择NLDO3_EN或NLDO3_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ NLDO3_VSEL选择NLDO3_ON_VSEL或NLDO3_SLP_VSEL，以及O_ NLDO3_EN选择NLDO3_EN或NLDO3_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x6B — DVS_CTRL_SEL1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV：保留 |
| 3:2 | RW | 0x0 | NLDO5_DVS_CTR_SEL NLDO5_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | NLDO5_VSEL_CTR_SEL NLDO5_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ NLDO5_VSEL选择NLDO5_ON_VSEL或NLDO5_SLP_VSEL，以及O_ NLDO5_EN选择NLDO5_EN或NLDO5_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ NLDO5_VSEL选择O_ NLDO5_VSEL或NLDO5_SLP_VSEL，以及O_ NLDO5_EN选择NLDO5_EN或NLDO5_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ NLDO5_VSEL选择NLDO5_ON_VSEL或NLDO5_SLP_VSEL，以及O_ NLDO5_EN选择NLDO5_EN或NLDO5_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x6C — DVS_CTRL_SEL2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_DVS_CTR_SEL PLDO2_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | PLDO2_VSEL_CTR_SEL PLDO2_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD02_VSEL选择PLDO2_ON_VSEL或PLDO2_SLP_VSEL，以及O_ PLDO2_EN选择PLDO2_EN或PLDO2_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO2_VSEL选择PLDO2_ON_VSEL或PLDO2_SLP_VSEL，以及O_ PLDO2_EN选择PLDO2_EN或PLDO2_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO2_VSEL选择PLDO2_ON_VSEL或PLDO2_SLP_VSEL，以及O_ PLDO2_EN选择PLDO2_EN或PLDO2_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | PLDO1_DVS_CTR_SEL PLDO1_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | PLDO1_VSEL_CTR_SEL PLDO1_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD01_VSEL选择PLDO1_ON_VSEL或PLDO1_SLP_VSEL，以及O_ PLDO1_EN选择PLDO1_EN或PLDO1_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO1_VSEL选择PLDO1_ON_VSEL或PLDO1_SLP_VSEL，以及O_ PLDO1_EN选择PLDO1_EN或PLDO1_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO1_VSEL选择PLDO1_ON_VSEL或PLDO1_SLP_VSEL，以及O_ PLDO1_EN选择PLDO1_EN或PLDO1_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x6D — DVS_CTRL_SEL3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO4_DVS_CTR_SEL PLDO4_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | PLDO4_VSEL_CTR_SEL PLDO4_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD04_VSEL选择PLDO4_ON_VSEL或PLDO4_SLP_VSEL，以及O_ PLDO4_EN选择PLDO4_EN或PLDO4_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO4_VSEL选择PLDO4_ON_VSEL或PLDO4_SLP_VSEL，以及O_ PLDO4_EN选择PLDO4_EN或PLDO4_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO4_VSEL选择PLDO4_ON_VSEL或PLDO4_SLP_VSEL，以及O_ PLDO4_EN选择PLDO4_EN或PLDO4_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | PLDO3_DVS_CTR_SEL PLDO3_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | PLDO3_VSEL_CTR_SEL PLDO3_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD03_VSEL选择PLDO3_ON_VSEL或PLDO3_SLP_VSEL，以及O_ PLDO3_EN选择PLDO3_EN或PLDO3_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO3_VSEL选择PLDO3_ON_VSEL或PLDO3_SLP_VSEL，以及O_ PLDO3_EN选择PLDO3_EN或PLDO3_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO3_VSEL选择PLDO3_ON_VSEL或PLDO3_SLP_VSEL，以及O_ PLDO3_EN选择PLDO3_EN或PLDO3_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x6E — DVS_CTRL_SEL4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_DVS_CTR_SEL PLDO6_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 5:4 | RW | 0x0 | PLDO6_VSEL_CTR_SEL PLDO6_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD02_VSEL选择PLDO6_ON_VSEL或PLDO6_SLP_VSEL，以及O_ PLDO2_EN选择PLDO6_EN或PLDO6_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO6_VSEL选择PLDO6_ON_VSEL或PLDO6_SLP_VSEL，以及O_ PLDO6_EN选择PLDO6_EN或PLDO6_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO6_VSEL选择PLDO6_ON_VSEL或PLDO6_SLP_VSEL，以及O_ PLDO6_EN选择PLDO6_EN或PLDO6_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |
| 3:2 | RW | 0x0 | PLDO5_DVS_CTR_SEL PLDO5_DVS_CTR_SEL: 电源受以下控制： PWRCRTL (1~3)引脚 00：无作用: 写寄存器调压 01：受控于 DVS_START1:写寄存器不能调压，除非 DVS_START1写1 10：受控于 DVS_START2:写寄存器不能调压，除非 DVS_START2写1 11：受控于 DVS_START3:写寄存器不能调压，除非 DVS_START3写1 |
| 1:0 | RW | 0x0 | PLDO5_VSEL_CTR_SEL PLDO5_VSEL_CTR_SEL: 00：无作用 01：受控于 PWRCRTL1:（PWRCRTL1 信号控制 O_ PLD05_VSEL选择PLDO5_ON_VSEL或PLDO5_SLP_VSEL，以及O_ PLDO5_EN选择PLDO5_EN或PLDO5_SLP_EN） 10：受控于 PWRCRTL2:（PWRCRTL2 信号控制 O_ PLDO5_VSEL选择PLDO5_ON_VSEL或PLDO5_SLP_VSEL，以及O_ PLDO5_EN选择PLDO5_EN或PLDO5_SLP_EN） 11：受控于 PWRCRTL3:（PWRCRTL3 信号控制 O_ PLDO5_VSEL选择PLDO5_ON_VSEL或PLDO5_SLP_VSEL，以及O_ PLDO5_EN选择PLDO5_EN或PLDO5_SLP_EN） 注：无论由哪个引脚控制，进入SLEEP后所有通道O_XX_VSEL切为SLP_VSEL，O_XX_EN同理。 |

### 0x70 — DVS_START_CTRL

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:4 | RW | 0x0 | RESV：保留 |
| 3 | RW | 0x0 | DVS_READ_DATA DVS_READ_DATA：DVS_START未写1时，0：读取XX_ON_VSEL返回新写入值；1：返回实际电压对应编码。 |
| 2 | RW | 0x0 | DVS_START3 DVS_START3：写1触发配置到本组电源的同步DVS调压。 |
| 1 | RW | 0x0 | DVS_START2 DVS_START2：写1触发配置到本组电源的同步DVS调压。 |
| 0 | RW | 0x0 | DVS_START1 DVS_START1：写1触发配置到本组电源的同步DVS调压。 |

### 0x71 — PWRCTRL_GPIO

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | RESV：保留 |
| 6 | RW | 0x0 | PWRCTRL3_DATA PWRCTRL3_DATA：PWRCTRL3作GPIO时的数据位。 |
| 5 | RW | 0x0 | PWRCTRL2 _DATA PWRCTRL2 _DATA：PWRCTRL2作GPIO时的数据位。 |
| 4 | RW | 0x0 | SLP1_DATA SLP1_DATA：PWRCTRL1作GPIO时的数据位。 |
| 3 | RW | 0x0 | RESV：保留 |
| 2 | RW | 0x0 | PWRCTRL3_DR PWRCTRL3_DR：作为GPIO：0输入，1输出。 |
| 1 | RW | 0x0 | PWRCTRL2_DR PWRCTRL2_DR：作为GPIO：0输入，1输出。 |
| 0 | RW | 0x0 | PWRCTRL1_DR PWRCTRL1_DR：作为GPIO：0输入，1输出。 |

### 0x72 — SYS_CFG3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RST_FUN RST_FUN：00重启PMU；01复位全部掉电复位寄存器，强制切入ACTIVE；1X同01，并将RESETB拉低5mS后释放。 |
| 5 | RW | 0x0 | DEV_RST DEV_RST：写1复位PMIC，模式由RST_FUN决定。原稿称两种触发方法但列三项：DEV_RST写1；PWRCTRL有效且SLP_FUN=011；RESETB低。 |
| 4:2 | RW | 0x0 | RESV：保留 |
| 1 | RW | 0x0 | SLAVE_RESTART_FUN SLAVE_RESTART_FUN：1：从芯片执行关机后延时500ms自动触发重启；0无作用。 |
| 0 | RW | 0x0 | DEV_OFF DEV_OFF：写1启动ACTIVE→OFF或SLEEP→OFF关机转换，进入OFF清零。 |

### 0x73 — WDT_REG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:5 | RW | 0x0 | RESV：保留 |
| 4 | RW | 0x0 | WDT_ACT WDT_ACT：0只发送中断，1重启。 |
| 3 | RW | 0x0 | WDT_EN WDT_EN：看门狗使能：0禁用，1启用。 |
| 2:0 | RW | 0x0 | WDT_SET WDT_SET：看门狗时间：000=50ms；001=100ms；010=500ms；011保留；100=2S；101=10s；110=1min；111=10min。后四档100~111设置时间后须清除WDT中断，否则提前1S。 |

### 0x74 — ON_SOURCE

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | ON_PWRON ON_PWRON：按PWRON开机 |
| 6 | RW | 0x0 | ON_VDC ON_VDC：DVC置高开机（原文DVC） |
| 5 | RW | 0x0 | ON_ABNORMAL ON_ABNORMAL：ABNORMAL重启 |
| 4 | RW | 0x0 | RESTART_RESETB RESTART_RESETB：拉低NRESPWRON重启 |
| 3 | RW | 0x0 | RESTART_PWRON_LP RESTART_PWRON_LP：长按PWRON重启 |
| 2 | RW | 0x0 | RESTART_ PWRCTRL RESTART_ PWRCTRL：PWRCTRL有效重启 |
| 1 | RW | 0x0 | RESTART_DEV_RST RESTART_DEV_RST：DEV_RST置1且ST_FUN=00重启 |
| 0 | RW | 0x0 | RESTART_WDT RESTART_WDT：看门狗溢出重启 |

### 0x75 — OFF_SOURCE

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | OFF_ PWRCTRL OFF_ PWRCTRL：PWRCTRL有效关机 |
| 6 | RW | 0x0 | VB_SYS_OV VB_SYS_OV：SYS过压关机 |
| 5 | RW | 0x0 | OFF_TSD OFF_TSD：TSD关机 |
| 4 | RW | 0x0 | OFF_SYNC OFF_SYNC：SYNC低电平关机 |
| 3 | RW | 0x0 | OFF_DEV_OFF OFF_DEV_OFF：I2C写DEV_OFF关机 |
| 2 | RW | 0x0 | OFF_PWRON_LP OFF_PWRON_LP：长按PWRON关机 |
| 1 | RW | 0x0 | OFF_ABNORMAL OFF_ABNORMAL：ABNORMAL关机 |
| 0 | RW | 0x0 | OFF_VB_LO OFF_VB_LO：SYS低压且VB_LO_ACT=0关机 |

### 0x76 — PWRON_KEY

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | PWRON_ON_TIME PWRON_ON_TIME: 0：500mS; 1:20mS |
| 6 | RW | 0x0 | PWRON_LP_ACT PWRON_LP_ACT：PWRON长按动作：0关机（但USB有效则再次开机）；1关机后重启。 |
| 5:4 | RW | 0x0 | PWRON_LP_OFF_TIME PWRON_LP_OFF_TIME：PWRON长按关机时间：00=6s，01=8s，10=10s，11=12s。 |
| 3:2 | RW | 0x0 | PWRON_LP_TM_SEL&lt;1:0&gt; PWRON_LP_TM_SEL&lt;1:0&gt;：PWRON长按中断时间：00=0.5S，01=1S，10=1.5S，11=2S。 |
| 1:0 | RW | 0x0 | PWRON_DB_SEL&lt;1:0&gt; PWRON_DB_SEL&lt;1:0&gt;：PWRON中断去抖时间：00=32uS，01=10mS，10=20mS，11=40mS。 |

### 0x77 — INT_STS0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_LO_INT VB_LO_INT: VCC1欠压告警中断状态。 |
| 6 | RW | 0x0 | VDC_FALL_INT VDC_FALL_INT: VDC下降沿中断 |
| 5 | RW | 0x0 | VDC_RISE_INT VDC_RISE_INT: VDC上升沿中断 |
| 4 | RW | 0x0 | HOTDIE_INT HOTDIE_INT: 过热事件中断状态。 |
| 3 | RW | 0x0 | PWRON_LP_INT PWRON_LP_INT: PWRON长按事件中断状态。 |
| 2 | RW | 0x0 | PWRON_INT PWRON_INT: PWRON事件中断状态。 |
| 1 | RW | 0x0 | PWRON_RISE_INT PWRON_RISE_INT: PWRON上升沿中断 |
| 0 | RW | 0x0 | PWRON_FALL_INT PWRON_FALL_INT: PWRON下降沿中断 |

### 0x78 — INT_MSK0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | VB_LO_IM VB_LO_IM: 0：不屏蔽中断；1：屏蔽 VCC1欠压告警中断 |
| 6 | RW | 0x0 | VDC_FALL_INT_IM VDC_FALL_INT_IM: 0：不屏蔽中断；1：屏蔽 VDC下降沿中断 |
| 5 | RW | 0x0 | VDC_RISE_IM VDC_RISE_IM: 0：不屏蔽中断；1：屏蔽 VDC上升沿中断 |
| 4 | RW | 0x0 | HOTDIE_IM HOTDIE_IM: 0：不屏蔽中断；1：屏蔽 过热中断 |
| 3 | RW | 0x0 | PWRON_LP_IM PWRON_LP_IM: 0：不屏蔽中断；1：屏蔽 PWRON长按中断 |
| 2 | RW | 0x0 | PWRON_IM PWRON_IM: 0：不屏蔽中断；1：屏蔽 PWRON事件中断 |
| 1 | RW | 0x0 | PWRON_RISE_INT_IM PWRON_RISE_INT_IM: 0：不屏蔽中断；1：屏蔽 PWRON上升沿中断 |
| 0 | RW | 0x0 | PWRON_FALL_INT_IM PWRON_FALL_INT_IM: 0：不屏蔽中断；1：屏蔽 PWRON下降沿中断 |

### 0x79 — INT_STS1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | WDT_INT WDT_INT: 看门狗有效事件中断 |
| 6 | RW | 0x0 | PWRCTRL1_GPIO_INT PWRCTRL1_GPIO_INT: PWRCTRL1引脚作为GPIO的事件中断 |
| 5 | RW | 0x0 | PWRCTRL2_GPIO_INT PWRCTRL2_GPIO_INT: PWRCTRL2引脚作为GPIO的事件中断 |
| 4 | RW | 0x0 | PWRCTRL3_GPIO_INT PWRCTRL3_GPIO_INT: PWRCTRL3引脚作为GPIO的事件中断 |
| 3 | RW | 0x0 | CRC_ERROR_INT CRC_ERROR_INT: CRC校验错误中断 |
| 2:0 | RW | 0x0 | RESV：保留 |

### 0x7A — INT_MSAK1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | WDT_INT_ IM WDT_INT_ IM: 0：不屏蔽中断；1：屏蔽 看门狗有效事件中断 |
| 6 | RW | 0x0 | PWRCTRL1_GPIO_ IM PWRCTRL1_GPIO_ IM: 0：不屏蔽中断；1：屏蔽 PWRCTRL1引脚作为GPIO的有效事件中断 |
| 5 | RW | 0x0 | PWRCTRL2_GPIO_ IM PWRCTRL2_GPIO_ IM: 0：不屏蔽中断；1：屏蔽 PWRCTRL2引脚作为GPIO的有效事件中断 |
| 4 | RW | 0x0 | PWRCTRL3_GPIO_ IM PWRCTRL3_GPIO_ IM: 0：不屏蔽中断；1：屏蔽 PWRCTRL3引脚作为GPIO的有效事件中断 |
| 3 | RW | 0x0 | CRC_ERROR_ IM CRC_ERROR_ IM: 0：不屏蔽中断；1：屏蔽 CRC校验错误中断 |
| 2:0 | RW | 0x0 | RESV：保留 |

### 0x7B — GPIO_INT_CONFIG

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:2 | RW | 0x0 | RESV：保留 |
| 1 | RW | 0x0 | INT_POL INT_POL: INT引脚极性 0低有效，1高有效 |
| 0 | RW | 0x0 | INT_FC_EN INT_FC_EN: 中断看门狗功能使能 0禁用，1启用 |

### 0x7C — DATA_REG0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG0 DATA_REG0:数据缓冲 |

### 0x7D — DATA_REG1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG1 DATA_REG1:数据缓冲 |

### 0x7E — DATA_REG2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG2 DATA_REG2:数据缓冲 |

### 0x7F — DATA_REG3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG3 DATA_REG3:数据缓冲 |

### 0x80 — DATA_REG4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG4 DATA_REG4:数据缓冲 |

### 0x81 — DATA_REG5

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG5 DATA_REG5:数据缓冲 |

### 0x82 — DATA_REG6

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG6 DATA_REG6:数据缓冲 |

### 0x83 — DATA_REG7

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG7 DATA_REG7:数据缓冲 |

### 0x84 — DATA_REG8

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG8 DATA_REG8:数据缓冲 |

### 0x85 — DATA_REG9

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG9 DATA_REG9:数据缓冲 |

### 0x86 — DATA_REG10

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG10 DATA_REG10:数据缓冲 |

### 0x87 — DATA_REG11

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG11 DATA_REG11:数据缓冲 |

### 0x88 — DATA_REG12

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG12 DATA_REG12:数据缓冲 |

### 0x89 — DATA_REG13

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG13 DATA_REG13:数据缓冲 |

### 0x8A — DATA_REG14

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG14 DATA_REG14:数据缓冲 |

### 0x8B — DATA_REG15

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:0 | RW | 0x0 | DATA_REG15 DATA_REG15:数据缓冲 |

### 0xB2 — BUCK_SEQ_REG0

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV：保留 |
| 5:0 | RW | 0x0 | BUCK1_SEQ&lt;5:0&gt; BUCK1_SEQ&lt;5:0&gt;:BUCK1 关机顺序，每步1MS |

### 0xB3 — BUCK_SEQ_REG1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV：保留 |
| 5:0 | RW | 0x0 | BUCK2_SEQ&lt;5:0&gt; BUCK2_SEQ&lt;5:0&gt;:BUCK2 关机顺序，每步1MS |

### 0xB4 — BUCK_SEQ_REG2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 |  |  | RESV：保留 |
| 5:0 | RW | 0x0 | BUCK3_SEQ&lt;5:0&gt; BUCK3_SEQ&lt;5:0&gt;:BUCK3 关机顺序，每步1MS |

### 0xB5 — BUCK_SEQ_REG3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;5:4&gt; PLDO6_SEQ&lt;5:4&gt;:PLDO6 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK4_SEQ&lt;5:0&gt; BUCK4_SEQ&lt;5:0&gt;:BUCK4 关机顺序，每步1MS |

### 0xB6 — BUCK_SEQ_REG4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;3:2&gt; PLDO6_SEQ&lt;3:2&gt;:PLDO6 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK5_SEQ&lt;5:0&gt; BUCK5_SEQ&lt;5:0&gt;:BUCK5 关机顺序，每步1MS |

### 0xB7 — BUCK_SEQ_REG5

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO6_SEQ&lt;1:0&gt; PLDO6_SEQ&lt;1:0&gt;:PLDO6 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK6_SEQ&lt;5:0&gt; BUCK6_SEQ&lt;5:0&gt;:BUCK6 关机顺序，每步1MS |

### 0xB8 — BUCK_SEQ_REG6

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;5:4&gt; PLDO1_SEQ&lt;5:4&gt;:PLDO1 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK7_SEQ&lt;5:0&gt; BUCK7_SEQ&lt;5:0&gt;:BUCK7 关机顺序，每步1MS |

### 0xB9 — BUCK_SEQ_REG7

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;3:2&gt; PLDO1_SEQ&lt;3:2&gt;:PLDO1 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK8_SEQ&lt;5:0&gt; BUCK8_SEQ&lt;5:0&gt;:BUCK8 关机顺序，每步1MS |

### 0xBA — BUCK_SEQ_REG8

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO1_SEQ&lt;1:0&gt; PLDO1_SEQ&lt;1:0&gt;:PLDO1 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK9_SEQ&lt;5:0&gt; BUCK9_SEQ&lt;5:0&gt;:BUCK9 关机顺序，每步1MS |

### 0xBB — BUCK_SEQ_REG9

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;5:4&gt; PLDO2_SEQ&lt;5:4&gt;:PLDO2 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | BUCK10_SEQ&lt;5:0&gt; BUCK10_SEQ&lt;5:0&gt;:BUCK10 关机顺序，每步1MS |

### 0xBC — BUCK_SEQ_REG10

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;3:2&gt; PLDO2_SEQ&lt;3:2&gt;:PLDO2 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | NLDO1_SEQ&lt;5:0&gt; NLDO1_SEQ&lt;5:0&gt;:NLDO1 关机顺序，每步1MS |

### 0xBD — BUCK_SEQ_REG11

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO2_SEQ&lt;1:0&gt; PLDO2_SEQ&lt;1:0&gt;:PLDO2 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | NLDO2_SEQ&lt;5:0&gt; NLDO2_SEQ&lt;5:0&gt;:NLDO2 关机顺序，每步1MS |

### 0xBE — BUCK_SEQ_REG12

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;5:4&gt; PLDO3_SEQ&lt;5:4&gt;:PLDO3 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | NLDO3_SEQ&lt;5:0&gt; NLDO3_SEQ&lt;5:0&gt;:NLDO3 关机顺序，每步1MS |

### 0xBF — BUCK_SEQ_REG13

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;3:2&gt; PLDO3_SEQ&lt;3:2&gt;:PLDO3 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | NLDO4_SEQ&lt;5:0&gt; NLDO4_SEQ&lt;5:0&gt;:NLDO4 关机顺序，每步1MS |

### 0xC0 — BUCK_SEQ_REG14

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | PLDO3_SEQ&lt;1:0&gt; PLDO3_SEQ&lt;1:0&gt;:PLDO3 关机顺序，每步1MS |
| 5:0 | RW | 0x0 | NLDO5_SEQ&lt;5:0&gt; NLDO5_SEQ&lt;5:0&gt;:NLDO5 关机顺序，每步1MS |

### 0xC1 — BUCK_SEQ_REG15

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5:0 | RW | 0x0 | PLDO4_SEQ&lt;5:0&gt; PLDO4_SEQ&lt;5:0&gt;:PLDO4 关机顺序，每步1MS |

### 0xC2 — BUCK_SEQ_REG16

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5:0 | RW | 0x0 | PLDO5_SEQ&lt;5:0&gt; PLDO5_SEQ&lt;5:0&gt;:PLDO5 关机顺序，每步1MS |

### 0xC3 — BUCK_SEQ_REG17

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5:0 | RW | 0x0 | SESET&lt;5:0&gt; SESET&lt;5:0&gt;:PLDO4 关机顺序，每步1MS |

### 0xDC — BACKUP_REG7

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK10_SET_SST BUCK10_SET_SST:BUCK10 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | BUCK9_SET_SST BUCK9_SET_SST:BUCK9 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 3:2 | RW | 0x0 | BUCK8_SET_SST BUCK8_SET_SST:BUCK8 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 1:0 | RW | 0x0 | BUCK7_SET_SST BUCK7_SET_SST:BUCK7 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |

### 0xE6 — BACKUP_REG6

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK4_SET_SST BUCK4_SET_SST:BUCK4 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | BUCK3_SET_SST BUCK3_SET_SST:BUCK3 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 3:2 | RW | 0x0 | BUCK2_SET_SST BUCK2_SET_SST:BUCK2 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 1:0 | RW | 0x0 | BUCK1_SET_SST BUCK1_SET_SST:BUCK1 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |

### 0xE7 — BACKUP_REG5

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | BUCK5_SET_SST BUCK5_SET_SST:BUCK4 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 5:4 | RW | 0x0 | RESV：保留 |
| 3:2 | RW | 0x0 | VCC14_UVSEL VCC14_UVSEL:VCC14 输入阈值选择 0:0.6v 1:0.8v 10:1.0v 11:1.2V |
| 1:0 | RW | 0x0 | VCC13_UVSEL VCC13_UVSEL:VCC13 输入阈值选择 0:0.6v 1:0.8v 10:1.0v 11:1.2V |

### 0xE8 — BACKUP_REG1

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK6_SET_SST BUCK6_SET_SST:BUCK4 软启动时间 00:400uS 01:200uS 10:100uS 11:50uS |
| 6:5 | RW | 0x0 | RESV：保留 |
| 4 | RW | 0x0 | VBOVLOCK_DIS VBOVLOCK_DIS: PMIC开机后VBOV锁定 0启用，1禁用 |
| 3 | RW | 0x0 | SYSOV_SEL SYSOV_SEL: VCCx 过压保护阈值 0:5.8V 1:5.6V |
| 2 | RW | 0x0 | SPI_4WIRE SPI_4WIRE:SPI模式：0三线，1四线 |
| 1:0 |  |  | RESV：保留 |

### 0xE9 — BACKUP_REG2

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK_DVS_FPWM_EN BUCK_DVS_FPWM_EN: BUCK执行DVS时开启FPWM 1启用，0禁用 |
| 6 | RW | 0x0 | LDO_DVS_RLOAD_EN LDO_DVS_RLOAD_EN: LDO执行DVS时开启内部放电电阻 1启用，0禁用 |
| 5 | RW | 0x0 | MISO_PAD_OE MISO_PAD_OE: 将MISO设为输出引脚 1启用，0禁用 |
| 4 | RW | 0x0 | WDT_CLR_mask: 修改WDT_CLR前必须向屏蔽位写1；写完WDT_CLR后应清除WDT_CLR_MASK。 |
| 3:1 | RW | 0x0 | RESV：保留 |
| 0 | RW | 0x0 | WDT_CLR: 延后WDT触发 1启用，0禁用 注：延时时间由看门狗时间设置决定，在设定时间内再次写1会再次推迟看门狗触发。 |

### 0xEA — BACKUP_REG3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5:3 | RW | 0x0 | LDO_RATE&lt;2:0&gt; LDO_RATE&lt;2:0&gt;:DVS后的电压变化速率（原稿2M clack） 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; 注：改变LDO电压时禁用0XX速率。 |
| 1 | RW | 0x0 | BUCK10_RATE&lt;2&gt; BUCK10_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于19寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 0 | RW | 0x0 | BUCK9_RATE&lt;2&gt; BUCK9_RATE&lt;2&gt;: DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于18寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |

### 0xEB — BACKUP_REG4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7 | RW | 0x0 | BUCK8_RATE&lt;2&gt; BUCK8_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于17寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 6 | RW | 0x0 | BUCK7_RATE&lt;2&gt; BUCK7_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于16寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 5 | RW | 0x0 | BUCK6_RATE&lt;2&gt; BUCK6_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于15寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 4 | RW | 0x0 | BUCK5_RATE&lt;2&gt; BUCK5_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于14寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 3 | RW | 0x0 | BUCK4_RATE&lt;2&gt; BUCK4_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于13寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 2 | RW | 0x0 | BUCK3_RATE&lt;2&gt; BUCK3_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于12寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 1 | RW | 0x0 | BUCK2_RATE&lt;2&gt; BUCK2_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于11寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |
| 0 | RW | 0x0 | BUCK1_RATE&lt;2&gt; BUCK1_RATE&lt;2&gt;:DVS后的电压变化速率（原稿2M clack），3位， BIT&lt;1:0&gt;位于10寄存器 000: 4lsb/1clk;001: 2lsb/1clk;010:1lsb/1clk; 011:1lsb/2clk;100:1lsb/4clk;101: 1lsb/8clk; 110:1lsb/13clk;111:1lsb/32clk; |

### 0xFD — BUCK_RSERVE_REG3

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:6 | RW | 0x0 | RESV：保留 |
| 5 | RW | 0x0 | BUCK6_EX_RES_SET BUCK6_EX_RES_SET:BUCK6 外部反馈电阻使能。 0禁用，1启用 |
| 4 | RW | 0x0 | BUCK5_EX_RES_SET BUCK5_EX_RES_SET:BUCK5 外部反馈电阻使能。 0禁用，1启用 |
| 3:2 | RW | 0x0 | RESV：保留 |
| 1 | RW | 0x0 | BUCK2_EX_RES_SET BUCK2_EX_RES_SET:BUCK2 外部反馈电阻使能。 0禁用，1启用 |
| 0 | RW | 0x0 | BUCK1_EX_RES_SET BUCK1_EX_RES_SET:BUCK1 外部反馈电阻使能。 0禁用，1启用 |

### 0xFE — BUCK_RSERVE_REG4

| 位 | 属性 | 复位 | 说明 |
| --- | --- | --- | --- |
| 7:1 | RW | 0x0 | RESV：保留 |
| 0 | RW | 0x0 | BUCK9_EX_RES_SET BUCK9_EX_RES_SET:BUCK9 外部反馈电阻使能。 0禁用，1启用 |

## 6. 热管理

### 6.1 概述

为保证可靠性及可工作性，RK806绝对最大结温必须低于125°C。智能手机、平板、个人导航设备等产品的热机械设计、系统热管理软件及最坏热工况应用可能使结温超过上述值。建议使用设备最坏用例的实测功耗，开展整机级热仿真。

### 6.2 封装热特性

| QFN7×7-68 | 功耗 / W | θJA / °C/W | θJB / °C/W | θJC / °C/W |
| --- | --- | --- | --- | --- |
| RK806 | 2 | 21.99 | 12 | 6.58 |

测试PCB：4层，114×76mm，厚1.6mm，环境85°C。下方无铅表原图体积列标题已损坏（mmcess-C / mmcess-Class / mmcess-Cl），本PDF无法确认范围，不推测补写。

表6-2：SnPb共晶工艺分类温度（TC）

| 封装厚度 | 体积&lt;350 mms | 体积≥350 mms |
| --- | --- | --- |
| &lt;2.5 mm | 235°C | 220°C |
| ≥2.5 mm | 220°C | 220°C |

表6-3：无铅工艺分类温度（TC）

| 封装厚度 | Volume mmcess-C | Volume mmcess-Class | Volume mmcess-Cl |
| --- | --- | --- | --- |
| &lt;1.6 mm | 260°C | 260°C | 260°C |
| 1.6 mm–2.5 mm | 260°C | 250°C | 245°C |
| &gt;2.5 mm | 250°C | 245°C | 245°C |

1. 器件制造商可自行决定允许最高封装本体峰值温度TP超过原稿所引表6-2或6-3的值，但板级装配方/用户无此权限。采用更高Tp不会改变分类温度Tc。
2. 封装体积不包含焊球、凸点、焊盘、引线等外部端子及非一体化散热器。
3. 回流焊期间器件最高温度取决于封装厚度和体积。对流回流焊可降低封装间温度梯度，但SMD热质量差异仍可能造成梯度。
4. 用于无铅装配的器件，其湿敏等级须按原稿所引“表4.2和6-4”的无铅分类温度和曲线评估，无论器件本身是否无铅。这些交叉引用存在不一致，须核对。
5. 已按早期J-STD-020、JESD22-A112（已撤销）或IPC-SM-786（已撤销）程序/判据确定湿敏等级的SMD封装，不必重新分类，除非需要改变等级或提高峰值分类温度。

表6-4：分类回流焊曲线

| 曲线特征 | Sn-Pb共晶装配 | 无铅装配 |
| --- | --- | --- |
| 预热/浸润最低Tsmin | 100°C | 150°C |
| 预热/浸润最高Tsmax | 150°C | 200°C |
| Tsmin至Tsmax时间ts | 60–120 s | 60–120 s |
| Tsmax至Tp平均升温速率 | ≤3°C/s | ≤3°C/s |
| 液相线温度TL | 183°C | 217°C |
| 液相线时间tL | 60–150 s | 60–150 s |
| 封装本体峰值温度Tp* | 表6-2 | 表6-3 |
| 距指定分类温度Tc 5°C范围内时间tp** | 20** s | 30** s |
| Tp至Tsmax平均降温速率 | ≤6°C/s | ≤6°C/s |
| 25°C至峰值时间 | ≤6 min | ≤8 min |

* 峰值曲线温度Tp的容差，对供应商为下限，对用户为上限。

** 峰值曲线温度Tp处持续时间的容差，对供应商为下限，对用户为上限。

1. 所有温度均指回流焊时朝上的封装本体表面中心温度（live-bug；原稿误拼为“ive-bug”）。若使用其他朝向，例如dead-bug，Tp须在live-bug Tp的±2°C内且仍满足Tc；否则须调整曲线。准确测量封装峰值温度时，参考JEP140的热电偶建议。
2. 本文曲线用于分类/预处理，不是板级装配工艺规范。实际装配曲线应按工艺需求及板卡设计制定，且不超过原引表6-4的参数。例如Tc=260°C、Tp时间30秒：供应商的峰温至少260°C，255°C以上至少30秒；用户的峰温不得超过260°C，255°C以上不得超过30秒。
3. 测试负载中的所有元件都必须满足分类曲线要求。
4. 已按早期J-STD-020、JESD22-A112（已撤销）或IPC-SM-786（已撤销）程序/判据确定湿敏等级的SMD封装，无需重新分类，除非要改变等级或提高峰值分类温度。

{% endraw %}
