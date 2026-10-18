---
title: "Rockchip I2C: Controller Flow, Timing, DTS and NACK/Timeout Debugging"
description: "Full i2c-rk3x/i2c-rockchip configuration, I2C tools, GPIO simulation and detailed bus fault analysis."
translation_key: "071-rockchip-i2c"
slug: "071-rockchip-i2c"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "I2C"]
keywords: "ArmSoM Rockchip rockchip i2c"
excerpt: "Full i2c-rk3x/i2c-rockchip configuration, I2C tools, GPIO simulation and detailed bus fault analysis."
---

{% raw %}

# Rockchip I2C: Controller Flow, Timing, DTS and NACK/Timeout Debugging

## ArmSoM applicability and source scope

Platform reference for adapting ArmSoM systems, based on CN/EN V2.2.0. No board, SDK/BSP, kernel or wiring combination has been hardware-validated here. The source scope below is not a claim that every ArmSoM board or kernel supports these features. Check the exact SoC, board schematic, SDK/BSP, kernel driver and pinmux. Commands, patches, logs and measurements are source examples, not ArmSoM test results.

Chinese figures are from the Chinese PDF; English/Russian figures are from the English PDF.

| Source SoC | Source kernel scope |
| --- | --- |
| All chips | All version |

Rockchip I2C transfers data between external devices using SDA and SCL. Each device has a unique address and may transmit or receive according to its function, including MCU, LCD, memory and keyboard interfaces. The controller supports I2C/SMBus, master mode only, programmable rates up to 400kbps (some chips 1000kbps), 7-bit/10-bit addressing and up to 32 bytes per interrupt or polling operation. The bus requires pull-up resistors; their values determine pull-up strength. Different SoCs and kernels use i2c-rk3x.c or i2c-rockchip.c, the latter on kernel 3.10. The source gives a typical maximum frequency of 1000K; verify the actual SoC and electrical timing.

[Editorial notes](/docs/rockchip-i2c/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

![I2C SDA/SCL pull-up wiring — source EN PDF p.2](/docs/rockchip-i2c/assets/en-p02-bus.png)

*I2C SDA/SCL pull-up wiring — source EN PDF p.2.*

<!-- Source EN PDF p.5, unit 0 -->

## 1. I2C flow

<!-- Source EN PDF p.5, unit 1 -->

The flow of I2C is roughly the same on both drivers about kernel 4.4 and kernel 3.10 . The write is a simple TX mode (I2C_CON[1:0] = 2'b00), while the read generally uses the TRX mode (I2C_CON[1:0] = 2'b01). The following I2C controller operational flow diagram describes how the software configures and performs I2C tasks by this I2C controller register. The description consists 3 parts, transfer mode, mixed mode and receive mode.

<!-- Source EN PDF p.6, unit 2 -->

### 1.1 Trasmint only mode(I2C_CON[1:0]=2’b00)

<!-- Source EN PDF p.6, unit 3 -->

![I2C transmit-only controller flow — source EN PDF p.6](/docs/rockchip-i2c/assets/en-p06-figure1.png)

*I2C transmit-only controller flow — source EN PDF p.6.*

<!-- Source EN PDF p.7, unit 4 -->

### 1.2 Mix mode (I2C_CON[1:0]=2’b01 or I2C_CON[1:0]=2’b11)

<!-- Source EN PDF p.7, unit 5 -->

![I2C mixed-mode controller flow — source EN PDF p.7](/docs/rockchip-i2c/assets/en-p07-figure1.png)

*I2C mixed-mode controller flow — source EN PDF p.7.*

<!-- Source EN PDF p.8, unit 6 -->

### 1.3 Receive only mode (I2C_CON[1:0]=2’b10)

<!-- Source EN PDF p.8, unit 7 -->

![I2C receive-only controller flow — source EN PDF p.8](/docs/rockchip-i2c/assets/en-p08-figure1.png)

*I2C receive-only controller flow — source EN PDF p.8.*

<!-- Source EN PDF p.8, unit 8 -->

The above is the main flow of I2C, and please refer to driver code to get the further implement.

<!-- Source EN PDF p.9, unit 9 -->

## 2. I2C Driver Parameter Configuration

<!-- Source EN PDF p.9, unit 10 -->

The mainly part of parameter configuration I2C is the configuration of I2C frequency. The I2C frequency can be matched not only related to the chip but also I2C SCL and SDA rise time, because the I2C standard protocol has requirements for rising and falling edge time, especially rising time. If the maximum value specified by the protocol is exceeded, the I2C communication may fail. The following is the maximum and minimum value specified in the protocol and figure shows the relationship between them:

<!-- Source EN PDF p.9, unit 11 -->

![I2C frequency and rise/fall limits — source EN PDF p.9](/docs/rockchip-i2c/assets/en-p09-figure1.png)

*I2C frequency and rise/fall limits — source EN PDF p.9.*

| Symbol | Parameter | Standard min | Standard max | Fast min | Fast max | Fast Plus min | Fast Plus max | Unit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fSCL | SCL clock frequency |  | 100 |  | 400 |  | 1000 | KHZ |
| Tr | SDA/SCL rise time |  | 1000 | 20 | 300 |  | 120 | ns |
| Tf | SDA/SCL fall time |  | 300 | 20×(VDD/5.5V | 300 | 20×(VDD/5.5V | 300 | ns |

The image omits closing parentheses in the Tf minimum formulas; the literal source text is retained. Blank cells are blank in the source, not zero.

<!-- Source EN PDF p.9, unit 12 -->

The rising edge Tr and the falling edge Tf need to be measured with an oscilloscope, refer to the following diagram:

<!-- Source EN PDF p.9, unit 13 -->

![I2C rise/fall oscilloscope measurement — source EN PDF p.9](/docs/rockchip-i2c/assets/en-p09-figure2.png)

*I2C rise/fall oscilloscope measurement — source EN PDF p.9.*

<!-- Source EN PDF p.9, unit 14 -->

The I2C driver i2c-rk3x.c and i2c-rockchip.c are not the same. The differences are as follows:

<!-- Source EN PDF p.9, unit 15 -->

### 2.1 Configuration for drive i2c-rk3x.c

<!-- Source EN PDF p.9, unit 16 -->

The configuration of the i2c-rk3x.c driver is in DTS, reference file is Documentation/devicetree/bindings/i2c/i2c-rk3x.txt . Here highlight the configuration items, i2c-scl-rising-time-ns , i2c-scl-falling-time-ns :

<!-- Source EN PDF p.9, unit 17 -->

clock-frequency: The default frequency is 100k, the default frequency can be remained, the other I2C frequencies need to do configuration. The maximum configurable frequency is determined by i2c-scl-rising-time-ns. For example to configure 400k, set clock-frequency= `<400000>`; at dts.

<!-- Source EN PDF p.9, unit 18 -->

i2c-scl-rising-time-ns: The rise time of SCL is determined by hardware and changing the pull- up resistor can adjust the time. It needs to be measured by oscilloscope, refer to the above figure; for example, measure the rise edge of SCL is 265ns, set i2c-scl-rising-time-ns= `<265>`; at dts. (The default rising time can be remained, but the current rising edge time must be ensured that it is under the maximum rising edge time which defined by the I2C standard for the configured frequency).

<!-- Source EN PDF p.9, unit 19 -->

i2c-scl-falling-time-ns: The SCL fall edge time, which has no change generally , is equivalent to i2c-sda-falling-time-ns. (The default is also no need to configure).

<!-- Source EN PDF p.10, unit 20 -->

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

<!-- Source EN PDF p.10, unit 21 -->

### 2.2 Configuration for driver i2c-rockchip.c

<!-- Source EN PDF p.10, unit 22 -->

The i2c-rockchip.c driver still follows the constraint relationship between the I2C frequency and the rise edge of SCL. Whether the higher frequency can be used depends on i2c-scl-rising-time-ns; the I2C frequency is configured on the code scl_rate member at the i2c_msg structure directly. The default frequency is still 100k, such as the following 200K configuration:

<!-- Source EN PDF p.10, unit 23 -->

```text
struct i2c_msg xfer_msg;
xfer_msg[0].addr = client->addr;
xfer_msg[0].len = num;
xfer_msg[0].flags = client->flags;
xfer_msg[0].buf = buf;
xfer_msg[0].scl_rate = 200 * 1000; /* 200K i2c clock frequency */
```

<!-- Source EN PDF p.10, unit 24 -->

## 3. I2C usage

<!-- Source EN PDF p.10, unit 25 -->

The further instructions for using I2C are in Documentation/i2c/\* . The following sections focus on the read and write sections:

<!-- Source EN PDF p.10, unit 26 -->

### 3.1 Kernel space

<!-- Source EN PDF p.10, unit 27 -->

Rockchip I2C sending and receiving communication uses the standard interface of Linux. Please refer to the Documentation/i2c/writing-clients under kernel for a description of the sending and receiving section.

<!-- Source EN PDF p.11, unit 28 -->

### 3.2 User space

<!-- Source EN PDF p.11, unit 29 -->

Typically, I2C devices are controlled by the kernel driver. However, all devices on the bus can also be accessed from the user mode through the /dev/i2c-%d interface. Documentation/i2c/dev-interface under the kernel has further descriptions and examples.

<!-- Source EN PDF p.11, unit 30 -->

## 4. I2C tools

<!-- Source EN PDF p.11, unit 31 -->

I2C tool is an open source tool, you can download it and cross-compile. The code download address is: https://www.kernel.org/pub/software/utils/i2c-tools/ OR `<git clone git://git.kernel.org/pub/scm/utils/i2c-tools/i2c-tools.git>`

<!-- Source EN PDF p.11, unit 32 -->

After compiling, it will generate tools such as i2cdetect, i2cdump, i2cset, i2cget, i2ctransfer, which can be used directly on the command line. The I2C tool are all open source. Please refer to the README and help instructions for compilation and using.

Supplement from Chinese PDF p.11: `i2cdetect` lists I2C buses and scans their devices; `i2cdump` reads all register values of an I2C device; `i2cget` reads one register; `i2cset` writes a register.

<!-- Source EN PDF p.11, unit 33 -->

## 5. GPIO simulation as I2C

<!-- Source EN PDF p.11, unit 34 -->

I2C is simulated with GPIO and the kernel has been implemented. Please refer to the documentation: Documentation/devicetree/bindings/i2c/i2c-gpio.txt

<!-- Source EN PDF p.11, unit 35 -->

The following is an example of using I2C nodes at dts.

<!-- Source EN PDF p.11, unit 36 -->

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

<!-- Source EN PDF p.12, unit 38 -->

GPIO method is generally not recommended due to low efficient.

<!-- Source EN PDF p.12, unit 39 -->

## 6. I2C FAQ

<!-- Source EN PDF p.12, unit 40 -->

Because we have two i2c drivers, so this chapter still have two parts:

<!-- Source EN PDF p.12, unit 41 -->

### 6.1 i2c-rk3x.c Driver

<!-- Source EN PDF p.12, unit 42 -->

#### 6.1.1 NACK Error

<!-- Source EN PDF p.12, unit 43 -->

If the return value of the I2C transport interface is -6 (-ENXIO) , it is indicated as a NACK error, that is, the slave device does not respond, this problem usually is located at peripheral. The following are common cases:

<!-- Source EN PDF p.12, unit 44 -->

I2C address is incorrect;

<!-- Source EN PDF p.12, unit 45 -->

The I2C slave device is in an error working state, such as no power-on, incorrect power-on sequence, and device error.

<!-- Source EN PDF p.12, unit 46 -->

The I2C timing does not meet the requirements of the slave device , which also generates a NACK signal. For example, the slave device needs the stop signal while receives the repeat start signal, NACK signal will occur.

<!-- Source EN PDF p.12, unit 47 -->

The I2C bus bug caused by external signal can be seen when measured with an oscilloscope.

<!-- Source EN PDF p.12, unit 48 -->

#### 6.1.2 Timeout Error

<!-- Source EN PDF p.12, unit 49 -->

##### 6.1.2.1 Case 1

<!-- Source EN PDF p.12, unit 50 -->

When I2C log is timeout, ipd: 0x00, state: 1 occurs, the I2C controller is working irregularly and it cannot generate an interrupt status, the start timing cannot be sent. There are several possibilities:

<!-- Source EN PDF p.12, unit 51 -->

I2C SCL or SDA Pin IO-MUX error;

<!-- Source EN PDF p.12, unit 52 -->

The pull-up voltage of I2C is incorrect, such as insufficient voltage or with no pull-up power supply;

<!-- Source EN PDF p.12, unit 53 -->

The I2C pin is held by the peripheral hardware and the voltage is incorrect;

<!-- Source EN PDF p.12, unit 54 -->

The I2C clock is not enabled, or the clock source is too small;

<!-- Source EN PDF p.12, unit 55 -->

I2C is configured with both the CON_START and CON_STOP bits.

<!-- Source EN PDF p.13, unit 56 -->

##### 6.1.2.2 Case 2

<!-- Source EN PDF p.13, unit 57 -->

When the I2C log is timeout, ipd: 0x10, state: 1 occurs, the I2C controller is working properly, but the CPU cannot respond to the I2C interrupt. At this time, cpu0 may be blocked (generally the I2C interrupt is on cpu0, It can be viewed by command cat /proc/interrups ), or the I2C interrupt source may be turned off make the irq can not trigger cpu to handle it.

<!-- Source EN PDF p.13, unit 58 -->

##### 6.1.2.3 Case 3

<!-- Source EN PDF p.13, unit 59 -->

When the I2C log is timeout, ipd: 0x80, state: 1 occurs, the ipd is 0x80, which means that the current SCL is held by the slave, you need to find it was held by which slave for more slave case:

<!-- Source EN PDF p.13, unit 60 -->

The first method is exclusion, which is applicable to the case where there are not many peripherals, and the probability of recurrence is high;

<!-- Source EN PDF p.13, unit 61 -->

Second method, the hardware needs to be modified. The resistor is serially connected to the SCL bus. The voltage difference generated across the resistor is used to determine that the lower-side peripheral is the slave that is pulled low. The selection of the resistor can not affect the I2C transmission, which also should generate voltage difference. Generally, it can be 1/20 of the pull-up resistor or more. And the voltage difference can also be seen if the host pulled down the voltage. In addition, based on this, it is more intuitive to capture the waveform through the oscilloscope. Compare the low level voltage of different slaves and host, find the low level voltage which matches the value while problem occurring. The corresponding slave devices or host which equals the low level voltage value is the reason to pull down the voltage of the bus.

<!-- Source EN PDF p.13, unit 62 -->

The common situation is that SDA is pulled down. To prove who is pulling down, also refer to the above method of "SCL is pulled down".

<!-- Source EN PDF p.13, unit 63 -->

### 6.2 i2c-rockchip.c Driver

<!-- Source EN PDF p.13, unit 64 -->

#### 6.2.1 NACK Error

<!-- Source EN PDF p.13, unit 65 -->

If the return value of the I2C transport interface is -11(-EAGAIN) , it is indicated as a NACK error, that is, the other device does not respond. This problem usually is located at slave devices. The following are common cases:

<!-- Source EN PDF p.13, unit 66 -->

I2C address is incorrect;

<!-- Source EN PDF p.13, unit 67 -->

The I2C slave device is in an error working state, such as no power-on, incorrect power-on sequence, and device error.

<!-- Source EN PDF p.13, unit 68 -->

The I2C timing does not meet the requirements of the slave device, which also generates a NACK signal. For example, the slave device needs the stop signal while receives the repeat start signal, NACK signal will occur.

<!-- Source EN PDF p.13, unit 69 -->

The I2C bus bug caused by external signal can be seen when measured with an oscilloscope.

<!-- Source EN PDF p.14, unit 70 -->

#### 6.2.2 Timeout Error

<!-- Source EN PDF p.14, unit 71 -->

##### 6.2.2.1 Case 1

<!-- Source EN PDF p.14, unit 72 -->

When I2C log is timeout, ipd: 0x00, state: 1 occurs, the I2C controller is working irregularly and it cannot generate an interrupt status, the start timing cannot be sent. There are several possibilities:

<!-- Source EN PDF p.14, unit 73 -->

I2C SCL or SDA Pin IO-MUX error;

<!-- Source EN PDF p.14, unit 74 -->

The pull-up voltage of I2C is incorrect, such as insufficient voltage or with no pull-up power supply;

<!-- Source EN PDF p.14, unit 75 -->

The I2C pin is held by the peripheral hardware and the voltage is incorrect.

<!-- Source EN PDF p.14, unit 76 -->

The I2C clock is not enabled, or the clock source is too small;

<!-- Source EN PDF p.14, unit 77 -->

I2C is configured with both the CON_START and CON_STOP bits.

<!-- Source EN PDF p.14, unit 78 -->

##### 6.2.2.2 Case 2

<!-- Source EN PDF p.14, unit 79 -->

When the I2C log is timeout, ipd: 0x10, state: 1 occurs, the I2C controller is working properly, but the CPU cannot respond to the I2C interrupt. At this time, cpu0 may be blocked (generally the I2C interrupt is on cpu0, It can be viewed by command cat /proc/interrups), or the I2C interrupt source may be turned off make the irq can not trigger cpu to handle it.

<!-- Source EN PDF p.14, unit 80 -->

##### 6.2.2.3 Case 3

<!-- Source EN PDF p.14, unit 81 -->

When the I2C log timeout, ipd: 0x80, state: 1 occurs, here ipd is 0x80, or the printed scl was hold by slave , which means that the current SCL is held by the slave, you need to find it was held by which slave for more slave case:

<!-- Source EN PDF p.14, unit 82 -->

The firtst method is exclusion, which is applicable to the case where there are not many peripherals, and the probability of recurrence is high;

<!-- Source EN PDF p.14, unit 83 -->

Second method, the hardware needs to be modified. The resistor is serially connected to the SCL bus. The voltage difference generated across the resistor is used to determine that the lower-side peripheral is the slave that is pulled low. The selection of the resistor can not affect the I2C transmission, which also should generate voltage difference. Generally, it can be 1/20 of the pull-up resistor or more. And the voltage difference can also be seen if the host pulled down the voltage. In addition, based on this, it is more intuitive to capture the waveform through the oscilloscope. Compare the low level voltage of different slaves and host, find the low level voltage which matches the value while problem occurring. The corresponding slave devices or host which equals the low level voltage value is the reason to pull down the voltage of the bus.

<!-- Source EN PDF p.14, unit 84 -->

The common situation is that SDA is pulled down. To prove who is pulling down, also refer to the above method of SCL is pulled down .

<!-- Source EN PDF p.14, unit 85 -->

When the log is i2c is not in idle (state =x) occurs, it indicates that at least one I2C bus is low. For the solution, refer to the above:

<!-- Source EN PDF p.14, unit 86 -->

"state=1" means SDA is low;

<!-- Source EN PDF p.15, unit 87 -->

"state=2" means SCL is low;

<!-- Source EN PDF p.15, unit 88 -->

"state=3" means SCL and SDA are both low.

<!-- Source EN PDF p.15, unit 89 -->

### 6.3 I2C waveform

<!-- Source EN PDF p.15, unit 90 -->

If the I2C problem you meet is not mentioned here, the best way is to grab the waveform when the I2C error occurs and analyze the I2C problem through the waveform. The waveform of I2C is very useful, which can figure out most of the problems; You can operate to stuck the current i2c task(sch as while(1), etc.) while error occurring, the finally captured in oscilloscope is the waveform for the error. If you need to filter, you can also add the condition such as the device I2C address, etc.

{% endraw %}
