---
title: "Rockchip I2C 完整指南：控制器流程、时序、DTS 与 NACK/超时排障"
description: "完整整理 i2c-rk3x/i2c-rockchip 配置、I2C tools、GPIO 模拟及逐类总线故障分析。"
translation_key: "071-rockchip-i2c"
slug: "071-rockchip-i2c"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "I2C"]
keywords: "ArmSoM Rockchip rockchip i2c"
excerpt: "完整整理 i2c-rk3x/i2c-rockchip 配置、I2C tools、GPIO 模拟及逐类总线故障分析。"
---

{% raw %}

# Rockchip I2C 完整指南：控制器流程、时序、DTS 与 NACK/超时排障

## ArmSoM 适用说明与原文范围

本文为 ArmSoM 适配前的平台参考，依据 CN/EN V2.2.0。未进行板卡、SDK/BSP、内核或接线组合的硬件验证。下表沿用原稿范围，不表示所有 ArmSoM 板卡或所有内核均支持；请核对具体 SoC、板卡原理图、SDK/BSP、内核驱动和引脚复用。命令、补丁、日志、测试数字均为原文示例，不是 ArmSoM 实测。

中文使用中文原图，英文、俄文使用英文原图。

| 原文芯片 | 原文内核范围 |
| --- | --- |
| All chips | All version |

Rockchip I2C 控制器通过 SDA 和 SCL 与外接设备通信，每个器件有唯一地址，可按功能充当发送器或接收器，如 MCU、LCD、存储器和键盘接口。控制器兼容 I2C/SMBus，仅支持主模式；软件可编程频率至 400kbps，部分芯片至 1000kbps；支持 7 位/10 位寻址，一次中断或轮询最多传输 32 字节。总线需要上拉电阻，可通过阻值调整上拉强度。不同芯片和内核使用 i2c-rk3x.c 或 i2c-rockchip.c，后者用于 3.10 内核。原文称最高频率一般为 1000K，实际应核对芯片与电气时序。

[校对记录](/docs/rockchip-i2c/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

![I2C SDA/SCL 上拉接线 — 来源 CN PDF p.2](/docs/rockchip-i2c/assets/cn-p02-bus.png)

*I2C SDA/SCL 上拉接线 — 来源 CN PDF p.2.*

<!-- Source CN PDF p.5, unit 0 -->

## 1. I2C 流程

<!-- Source CN PDF p.5, unit 1 -->

I2C 的流程在两个驱动上大致是一样，写是单纯的 TX 模式 (I2C_CON[1:0]=2’b00)，而读一般使用 TRX模式(I2C_CON[1:0]=2’b01)。下面的 I2C 控制器操作流程图是描述软件如何通过这个 I2C 控制器寄存器来配置和执行 I2C 任务。描述分为 3 部分,传输模式，混合模式和接收模式。

<!-- Source CN PDF p.6, unit 2 -->

### 1.1 Trasmint only mode(I2C_CON[1:0]=2’b00)

<!-- Source CN PDF p.6, unit 3 -->

![I2C 仅发送控制器流程 — 来源 CN PDF p.6](/docs/rockchip-i2c/assets/cn-p06-figure1.png)

*I2C 仅发送控制器流程 — 来源 CN PDF p.6.*

<!-- Source CN PDF p.7, unit 4 -->

### 1.2 Mix mode (I2C_CON[1:0]=2’b01 or I2C_CON[1:0]=2’b11)

<!-- Source CN PDF p.7, unit 5 -->

![I2C 混合模式控制器流程 — 来源 CN PDF p.7](/docs/rockchip-i2c/assets/cn-p07-figure1.png)

*I2C 混合模式控制器流程 — 来源 CN PDF p.7.*

<!-- Source CN PDF p.8, unit 6 -->

### 1.3 Receive only mode (I2C_CON[1:0]=2’b10)

<!-- Source CN PDF p.8, unit 7 -->

![I2C 仅接收控制器流程 — 来源 CN PDF p.8](/docs/rockchip-i2c/assets/cn-p08-figure1.png)

*I2C 仅接收控制器流程 — 来源 CN PDF p.8.*

<!-- Source CN PDF p.8, unit 8 -->

以上为 I2C 的主要流程，详细实现参考驱动代码。

<!-- Source CN PDF p.9, unit 9 -->

## 2. I2C 驱动参数配置

<!-- Source CN PDF p.9, unit 10 -->

I2C 的参数配置最主要就是 I2C 频率的配置，可配 I2C frequency 除了与芯片有关外，主要是由 I2C SCLrise time 决定的，因为 I2C 协议标准里面对上升沿和下降沿时间有规定要求特别是上升沿时间，如果超过了协议规定的最大值，则 I2C 通讯可能失败，下面是协议里面规定的最大最小值范围，下图表示了二者之间的关系：

<!-- Source CN PDF p.9, unit 11 -->

![I2C 频率及上升下降时间限值 — 来源 CN PDF p.9](/docs/rockchip-i2c/assets/cn-p09-figure1.png)

*I2C 频率及上升下降时间限值 — 来源 CN PDF p.9.*

| Symbol | 参数 | Standard min | Standard max | Fast min | Fast max | Fast Plus min | Fast Plus max | Unit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fSCL | SCL 时钟频率 |  | 100 |  | 400 |  | 1000 | KHZ |
| Tr | SDA/SCL 上升时间 |  | 1000 | 20 | 300 |  | 120 | ns |
| Tf | SDA/SCL 下降时间 |  | 300 | 20×(VDD/5.5V | 300 | 20×(VDD/5.5V | 300 | ns |

原图 Tf 最小值公式缺少右括号，按原图保留；空单元格在原图为空，不代表 0。

<!-- Source CN PDF p.9, unit 12 -->

上升沿 Tr 和下降沿 Tf，需要用示波器测量，参考下面示图：

<!-- Source CN PDF p.9, unit 13 -->

![I2C 上升下降沿示波器测量 — 来源 CN PDF p.9](/docs/rockchip-i2c/assets/cn-p09-figure2.png)

*I2C 上升下降沿示波器测量 — 来源 CN PDF p.9.*

<!-- Source CN PDF p.9, unit 14 -->

I2C 的驱动 i2c-rk3x.c 与 i2c-rockchip.c 两个配置方式是不一样的，区别如下：

<!-- Source CN PDF p.9, unit 15 -->

### 2.1 i2c-rk3x.c 配置

<!-- Source CN PDF p.9, unit 16 -->

i2c-rk3x.c 驱动的配置都在 DTS，参考文件 Documentation/devicetree/bindings/i2c/i2c-rk3x.txt。重点说明其中配置项，i2c-scl-rising-time-ns，i2c-scl-falling-time-ns：

<!-- Source CN PDF p.9, unit 17 -->

clock-frequency： 默认 frequency 为 100k 可不配置，其它 I2C 频率需要配置，最大可配置频率由 i2c-scl-rising-time-ns 决定；例如配置 400k，clock-frequency=`<400000>`。

<!-- Source CN PDF p.9, unit 18 -->

i2c-scl-rising-time-ns：SCL 上升沿时间由硬件决定，改变上拉电阻可调节该时间，需通过示波器量测，参考上图；例如测得 SCL 上升沿 365ns，i2c-scl-rising-time-ns=`<365>`。(默认可以不配置，但必须保证当前的上升沿时间不能超过所配置频率下的 I2C 标准所定义的最大上升沿时间)

<!-- Source CN PDF p.9, unit 19 -->

i2c-scl-falling-time-ns: SCL 下降沿时间, 一般不变, 等同于 i2c-sda-falling-time-ns。(默认也可以不配置）

<!-- Source CN PDF p.9, unit 20 -->

```text
&i2c1 {
    status = "okay";
    i2c-scl-rising-time-ns = <265>;
    i2c-scl-falling-time-ns = <11>;
    clock-frequency = <400000>;
    es8316: es8316@10 {
        #sound-dai-cells = <0>;
        compatible = "everest,es8316";
        reg = <0x10>;
        clocks = <&cru SCLK_I2S_8CH_OUT>;
        clock-names = "mclk";
        spk-con-gpio = <&gpio0 11 GPIO_ACTIVE_HIGH>;
        hp-det-gpio = <&gpio4 28 GPIO_ACTIVE_LOW>;
    };
};
```

<!-- Source CN PDF p.10, unit 22 -->

### 2.2 i2c-rockchip.c 配置

<!-- Source CN PDF p.10, unit 23 -->

i2c-rockchip.c 驱动仍然遵循 I2C frequency 与 SCL 上升沿的约束关系，能否用更高的频率取决于 i2c-scl-rising-time-ns；I2C 频率在代码上面配置，直接配置 i2c_msg 结构体上的 scl_rate 成员， 默认frequency 仍为 100k，例如下面的 200K 配置配置：

<!-- Source CN PDF p.10, unit 24 -->

```text
struct i2c_msg xfer_msg;
xfer_msg[0].addr = client->addr;
xfer_msg[0].len = num;
xfer_msg[0].flags = client->flags;
xfer_msg[0].buf = buf;
xfer_msg[0].scl_rate = 200 * 1000; /* 200K i2c clock frequency */
```

<!-- Source CN PDF p.10, unit 25 -->

## 3. I2C 使用

<!-- Source CN PDF p.10, unit 26 -->

对于 I2C 的使用说明在 Documentation/i2c/ 有比较详细的，查阅，下面重点提下读写部分：

<!-- Source CN PDF p.10, unit 27 -->

### 3.1 Kernel space

<!-- Source CN PDF p.10, unit 28 -->

Rockchip I2C 的读写通信都是使用的是 linux 的标准接口，请参考 kernel 下面的Documentation/i2c/writing-clients 文档说明，里面的 Sending and receiving 部分有系统的介绍。

<!-- Source CN PDF p.10, unit 29 -->

### 3.2 User space

<!-- Source CN PDF p.10, unit 30 -->

通常, I2C 设备由内核驱动程序控制。但也可以从用戶态访问总线上的所有设备，通过 “/dev/i2c-%d” 接口来访问，kernel 下面的 Documentation/i2c/dev-interface 文档有详细说明与示例。

<!-- Source CN PDF p.10, unit 31 -->

## 4. I2C tools

<!-- Source CN PDF p.10, unit 32 -->

I2C tool 是一个开源工具，需自行下载进行交叉编译，代码下载地址：https://www.kernel.org/pub/software/utils/i2c-tools/或者`<git clone git://git.kernel.org/pub/scm/utils/i2c-tools/i2c-tools.git>`

<!-- Source CN PDF p.11, unit 33 -->

编译后会生成 i2cdetect，i2cdump，i2cset，i2cget 等工具，可以直接在命令行上调试使用：

<!-- Source CN PDF p.11, unit 34 -->

i2cdetect – 用来列举 I2C bus 和上面所有的设备

<!-- Source CN PDF p.11, unit 35 -->

i2cdump – 显示 i2c 设备所有 register 的值

<!-- Source CN PDF p.11, unit 36 -->

i2cget – 读取 i2c 设备某个 register 的值

<!-- Source CN PDF p.11, unit 37 -->

i2cset – 写入 i2c 设备某个 register 的值

<!-- Source CN PDF p.11, unit 38 -->

I2C tool 都是开源的，编译与使用请参考里面的 README 与帮助说明。

<!-- Source CN PDF p.11, unit 39 -->

## 5. GPIO 模拟 I2C

<!-- Source CN PDF p.11, unit 40 -->

I2C 用 GPIO 模拟，内核已经有实现，请参考文档：Documentation/devicetree/bindings/i2c/i2c-gpio.txt

<!-- Source CN PDF p.11, unit 41 -->

下面是使用的例子，dts 下配置 I2C 节点。

<!-- Source CN PDF p.11, unit 42 -->

```text
i2c@4 {
        compatible = "i2c-gpio";
        gpios = <&gpio5 9 GPIO_ACTIVE_HIGH>, /* sda */
                <&gpio5 8 GPIO_ACTIVE_HIGH>; /* scl */
        i2c-gpio,delay-us = <2>; /* ~100 kHz */
        #address-cells = <1>;
        #size-cells = <0>;
        pinctrl-names = "default";
        pinctrl-0 = <&i2c4_gpio>;
        status = "okay";
        gt9xx: gt9xx@14 {
                compatible = "goodix,gt9xx";
                reg = <0x14>;
                touch-gpio = <&gpio5 11 IRQ_TYPE_LEVEL_LOW>;
                reset-gpio = <&gpio5 10 GPIO_ACTIVE_HIGH>;
                max-x = <1200>;
                max-y = <1900>;
                tp-size = <911>;
                tp-supply = <&vcc_tp>;
                status = "okay";
        };
};
```

<!-- Source CN PDF p.11, unit 43 -->

一般不推荐使用 GPIO，效率不高。

<!-- Source CN PDF p.11, unit 44 -->

## 6. I2C 常见问题

<!-- Source CN PDF p.11, unit 45 -->

因为我们有两个 i2c 驱动，所以仍然分两部分：

<!-- Source CN PDF p.12, unit 46 -->

### 6.1 i2c-rk3x.c 驱动

<!-- Source CN PDF p.12, unit 47 -->

如果调用 I2C 传输接口返回值为 -6(-ENXIO)时候，表示为 NACK 错误，即对方设备无应答响应，这种情况一般为外设的问题，常见的有以下几种情况：

<!-- Source CN PDF p.12, unit 48 -->

I2C 地址错误；

<!-- Source CN PDF p.12, unit 49 -->

I2C slave 设备处于不正常工作状态，比如没有上电，错误的上电时序以及设备异常等；

<!-- Source CN PDF p.12, unit 50 -->

I2C 时序不符合 slave 设备所要求也会产生 NACK 信号，比如 slave 设备需要的是 stop 信号,而不是 repeat start 信号的时候；

<!-- Source CN PDF p.12, unit 51 -->

I2C 总线受外部干扰导致的，用示波器测量可以看到是一个 ACK 波形。

<!-- Source CN PDF p.12, unit 52 -->

当出现 I2C 的 log："timeout, ipd: 0x00, state: 1"时，此时 I2C 控制器工作异常，无法产生中断状态，start 时序无法发出，有以下几种可能：

<!-- Source CN PDF p.12, unit 53 -->

I2C SCL 或者 SDA Pin 脚 iomux 错误；

<!-- Source CN PDF p.12, unit 54 -->

I2C 的上拉电压不对，如电压不够或者上拉电源没有等；

<!-- Source CN PDF p.12, unit 55 -->

I2C Pin 脚被外设拉住，电压不对；

<!-- Source CN PDF p.12, unit 56 -->

I2C 时钟未开，或者时钟源太小；

<!-- Source CN PDF p.12, unit 57 -->

I2C 同时配置了 CON_START 和 CON_STOP 位。

<!-- Source CN PDF p.12, unit 58 -->

当出现 I2C 的 log："timeout, ipd: 0x10, state: 1"时，此时 I2C 控制器工作正常，但是 cpu 无法响应I2C 中断，此时可能 cpu0 被阻塞了（一般 I2C 中断都在 cpu0 上面，通过 cat /proc/interrups 可以查看），或者可能是 I2C 中断位被关闭了。

<!-- Source CN PDF p.12, unit 59 -->

当出现 I2C 的 log 类似："timeout, ipd: 0x80, state: 1"时，看到 ipd 为 0x80 打印，可以说明当前 SCL被 slave 拉住，要判断被哪个 slave 拉住：

<!-- Source CN PDF p.12, unit 60 -->

一是排除法，适用于外设不多的情况，而且复现概率高；

<!-- Source CN PDF p.12, unit 61 -->

二是需要修改硬件，在 SCL 总线上串入电阻，通过电阻两端产生的压差来确定，电压更低的那端外设为拉低的 slave，电阻的选取以不影响 I2C 传输且可以看出压差为标准，一般上拉电阻的 1/20 以上都可以，如果是 host 拉低也可以看出。另外在此基础上通过示波器来抓取波形更加直观，比较不同 slave 和 host 的低电平大小，与最后出问题时的低电平大小比较，相等的就是拉低总线的”元凶“。

<!-- Source CN PDF p.12, unit 62 -->

常见的情况是 sda 被拉低，证明是谁拉低的，同样参考上面 “SCL 被拉低" 的方法两种。

<!-- Source CN PDF p.12, unit 63 -->

### 6.2 i2c-rockchip.c 驱动

<!-- Source CN PDF p.12, unit 64 -->

如果调用 I2C 传输接口返回值为 -11(-EAGAIN )时候，表示为 NACK 错误，即对方设备无应答响应，这种情况一般为外设的问题，常见的有以下几种情况：

<!-- Source CN PDF p.12, unit 65 -->

I2C 地址错误；

<!-- Source CN PDF p.12, unit 66 -->

I2C slave 设备处于不正常工作状态，比如没有上电，错误的上电时序以及设备异常等；

<!-- Source CN PDF p.12, unit 67 -->

I2C 时序不符合 slave 设备所要求也会产生 NACK 信号，比如 slave 设备需要的是 stop 信号,而不是 repeat start 信号的时候；

<!-- Source CN PDF p.12, unit 68 -->

I2C 总线受外部干扰导致的，用示波器测量可以看到是一个 ACK 波形。

<!-- Source CN PDF p.12, unit 69 -->

当出现 I2C 的 log："timeout, ipd: 0x00, state: 1"时，此时 I2C 控制器工作异常，无法产生中断状态，start 时序无法发出，有以下几种可能：

<!-- Source CN PDF p.13, unit 70 -->

I2C SCL 或者 SDA Pin 脚 iomux 错误；

<!-- Source CN PDF p.13, unit 71 -->

I2C 的上拉电压不对，如电压不够或者上拉电源没有等；

<!-- Source CN PDF p.13, unit 72 -->

I2C Pin 脚被外设拉住，电压不对；

<!-- Source CN PDF p.13, unit 73 -->

I2C 时钟未开，或者时钟源太小；

<!-- Source CN PDF p.13, unit 74 -->

I2C 同时配置了 CON_START 和 CON_STOP 位。

<!-- Source CN PDF p.13, unit 75 -->

当出现 I2C 的 log："timeout, ipd: 0x10, state: 1"时，此时 I2C 控制器工作正常，但是 cpu 无法响应I2C 中断，此时可能 cpu0 被阻塞了（一般 I2C 中断都在 cpu0 上面，通过 cat /proc/interrups 可以查看），或者可能是 I2C 中断位被关闭了。

<!-- Source CN PDF p.13, unit 76 -->

当出现 I2C 的 log 类似："timeout, ipd: 0x80, state: 1"时，看到 ipd 为 0x80 打印，或者看到"scl washold by slave”的打印，可以说明当前 SCL 被 slave 拉住，要判断被哪个 slave 拉住：

<!-- Source CN PDF p.13, unit 77 -->

一是排除法，适用于外设不多的情况，而且复现概率高；二是需要修改硬件，在 SCL 总线上串入电阻，通过电阻两端产生的压差来确定，电压更低的那端外设为拉低的 slave，电阻的选取以不影响 I2C 传输且可以看出压差为标准，一般上拉电阻的 1/20 以上都可以，如果是 host 拉低也可以看出。另外在此基础上通过示波器来抓取波形更加直观，比较不同 slave 和host 的低电平大小，与最后出问题时的低电平大小比较，相等的就是拉低总线的”元凶“。

<!-- Source CN PDF p.13, unit 78 -->

常见的情况是 SDA 被拉低，证明是谁拉低的，同样参考上面 “ scl was hold by slave"的方法两种。

<!-- Source CN PDF p.13, unit 79 -->

当出现 log “i2c is not in idle(state = ×)”的 log 时，表示 I2C 总线至少一个为低，解决办法参考上面：

<!-- Source CN PDF p.13, unit 80 -->

“state=1” 表示 SDA 为低；

<!-- Source CN PDF p.13, unit 81 -->

“state=2” 表示 SCL 为低；

<!-- Source CN PDF p.13, unit 82 -->

“state=3” 表示 SCL 和 SDA 都为低。

<!-- Source CN PDF p.13, unit 83 -->

### 6.3 Debug 之 I2C 波形

<!-- Source CN PDF p.13, unit 84 -->

如果遇到的 I2C 问题以上情况都不是，最好的办法是抓取 I2C 出错时候的波形，通过波形来分析 I2C 问题，I2C 的波形非常有用，大部分的问题都能分析出来；可以在出错的地方让 cpu 卡住（比如 while(1)等），不发起新的 I2C 任务，最后抓到的波形应该就是出错的波形，如果需要过滤还可以加入设备 I2C 地址的判断条件等。

{% endraw %}
