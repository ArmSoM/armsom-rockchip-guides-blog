---
title: "Complete Rockchip RK816 PMIC Guide: Pins, Sequencing, DTS, Power and Debugging"
description: "Complete Rockchip RK816 PMIC Guide: Pins, Sequencing, DTS, Power and Debugging — V1.0.1"
excerpt: "Complete Rockchip RK816 PMIC Guide: Pins, Sequencing, DTS, Power and Debugging — V1.0.1"
translation_key: 122-rockchip-rk816-pmic
slug: 122-rockchip-rk816-pmic
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, RK816, PMIC, DTS, regulator]
---

{% raw %}

# Complete Rockchip RK816 PMIC Guide: Pins, Sequencing, DTS, Power and Debugging

Chinese source V1.0.1, kernel scope 3.10 / 4.4 / 4.19. The technical preface introduces RK816 submodule concepts, functions, DTS configuration and troubleshooting; the full technical body is retained. No English PDF is available. All four languages use Chinese-PDF original figures, some already bearing English labels. Platform reference only: verify the actual ArmSoM PMIC, SoC, power tree, pins, SDK/BSP and kernel. Not a claim of support on every ArmSoM board; no hardware testing was performed.

> Voltage, pin-mode and register writes can power off or damage hardware; these are unexecuted source examples. Source `0.737.5`, differences between voltage/sequence tables, `regulator-ramp-delay` 12500 versus example 6001, and the claimed four functions versus actual list count are retained without guessing corrections. The main-property example reg = <0x18> differs from 0x1a in the full DTS and I2C address; retained from source and must be verified before use. Pin-table name NRESPWON is also retained from the original figure.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Basics

### 1.1 Overview

RK816 is a high-performance PMIC integrating 4 high-current DCDCs, 1 BOOST converter, 6 LDOs, 1 OTG output, 1 RTC and adjustable power-up sequencing, plus switching charging, intelligent power-path management and a coulomb counter. System supplies are divided into DCDC and LDO; their general characteristics follow, with further details available in other references.

1. DCDC: efficient at a large input/output voltage difference, but with relatively high ripple and cost; therefore used for large voltage drops and high-current loads. Two common modes are PWM, with good ripple/transient response but lower efficiency, and PFM, with higher efficiency but weaker load capability.

2. LDO: low efficiency at a large input/output voltage difference, but low cost. Optimize the system to improve conversion efficiency: for a 1.1V LDO output, its input can be supplied by the VCCIO_3.3V DCDC. Where the circuit permits, connect the LDO input to a DCDC output, taking power-up sequencing into account.

### 1.2 Functions

From the user perspective, RK816 functions are described as four parts:

1. regulator: controls the state of individual DCDC and LDO supplies.

2. rtc: provides clockkeeping, timing and related functions.

3. gpio: out1 and out2 are push-pull outputs usable as ordinary GPIOs, but output-only.

4. pwrkey: detects power-key press/release, saving one AP GPIO.

5. Charging and fuel-gauge functions are not detailed here; see Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Pin functions

![Chinese PDF original · p5](/docs/rockchip-rk816-pmic/assets/cn-p005-figure-01.png)

*Chinese PDF original · p5*

Pay particular attention to the SLEEP and INT pins in the following descriptions.

![Chinese PDF original · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-01.png)

*Chinese PDF original · p6*

![Chinese PDF original · p6](/docs/rockchip-rk816-pmic/assets/cn-p006-figure-02.png)

*Chinese PDF original · p6*

Editable transcription of the original tables above.

| Pin no. | Name | Description |
| --- | --- | --- |
| 1 | SCL | I2C clock input |
| 2 | SDA | I2C data input/output |
| 3 | INT | Interrupt request |
| 4 | SW5 | Charger/boost switching node |
| 5 | MIDU | USB-supply middle point/boost output |
| 6 | USB | Power supply of USB |
| 7 | VCC3 | Power supply of BUCK3 |
| 8 | SW3 | Switching node of BUCK3 |
| 9 | VFB3 | Output feedback voltage of BUCK3 |
| 10 | XIN | 32.768KHz crystal oscillator input |
| 11 | XOUT | 32.768KHz crystal oscillator output |
| 12 | PWRON | Power on/off enable, active low; internal 20k pull-up to supply |
| 13 | VCC2 | Power supply of BUCK2 |
| 14 | SW2 | Switching node of BUCK2 |
| 15 | VFB2 | Output feedback voltage of BUCK2 |
| 16 | VCC1 | Power supply of BUCK1 |
| 17 | SW1 | Switching node of BUCK1 |
| 18 | VFB1 | Output feedback voltage of BUCK1 |
| 19 | NRESPWON | Reset after power-on, active low |
| 20 | CLK32K | 32.768KHz clock output, open drain |
| 21 | LDO3 | LDO3 output |
| 22 | VCC5 | Power supply of LDO1/2/3 |
| 23 | LDO1 | LDO1 output |
| 24 | LDO2 | LDO2 output |
| 25 | REFGND | Reference ground |
| 26 | VREF | Internal reference voltage |
| 27 | LDO4 | LDO4 output |
| 28 | LDO5 | LDO5 output |
| 29 | VCC6 | Power supply of LDO4/5/6 |
| 30 | LDO6 | LDO6 output |
| 31 | VCCRTC | RTC supply; decouple to GND with 1uF capacitor |
| 32 | SNSN | Battery charge/discharge current-sense negative terminal |
| 33 | SNSP | Battery charge/discharge current-sense positive terminal |
| 34 | TS(GPIO1) | Thermistor input; connect thermistor to ground, usually inside battery pack; multifunction GPIO1 |
| 35 | BAT | Battery positive terminal |
| 36 | SYS | System terminal |
| 37 | SW4 | Switching node of BUCK4 |
| 38 | VFB4 | Output feedback voltage of BUCK4 |
| 39 | VCC4 | Power supply of BUCK4 |
| 40 | SLEEP | Sleep-mode control input |
| Exposed pad | Exposed ground | Ground |

### 1.4 Important concepts

I2C address: 7-bit slave address `0x1a`. The PMIC has three operating modes.

1. PMIC normal mode: during normal system operation the PMIC is in normal mode and pmic_sleep is low.

2. PMIC sleep mode reduces PMIC consumption during system suspend. Depending on product requirements, some rail voltages are lowered or outputs disabled. During standby the AP configures pmic_sleep as sleep over I2C and raises it to enter sleep. When the SoC wakes, pmic_sleep returns low and the PMIC exits sleep.

3. PMIC shutdown mode: during system shutdown, the PMIC powers down the entire system. The AP configures pmic_sleep for shutdown over I2C, then raises pmic_sleep to enter shutdown.

pmic_sleep pin:

Normally low, keeping the PMIC in normal mode; raising it switches to sleep or shutdown.

**pmic_int:** normally high; an interrupt drives it low, and it stays low until the interrupt is handled.

**pmic_pwron:** connect the hardware power key to this pin; the driver detects press/release through it.

**DCDC modes:** besides PWM (force PWM) and PFM, AUTO dynamically switches between PWM and PFM. The PMIC supports PWM and AUTO PWM/PFM. AUTO has higher efficiency but poorer ripple/transient response. For stability, use PWM during operation and switch to AUTO PWM/PFM during suspend.

**DCDC3 voltage:** this special rail cannot change voltage through registers; external divider resistors set it. Change the external hardware to change voltage. Rockchip designs generally use it for VCC_DDR.

**Runtime voltage adjustment ranges of DCDC and LDO:**

**out1/out2:** these are ordinary push-pull GPIOs supporting output mode only.

1. Discontinuous DCDC voltage ranges:

| Voltage range (V) | Step (mV) | Voltage settings (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 2.2 | 200 | 1.8、 2.0、2.2 |
| 2.3 | None | 2.3 |

2. Continuous LDO voltages:

| Voltage range (V) | Step (mV) | Voltage settings (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、 0.9、1.0、1.1、 1.2、 ...... 3.4 |

### 1.5 Power-on conditions and sequence

1. Power-on conditions: any one of the following powers on the PMIC:

- EN transitions from low to high.
- EN remains high and an RTC alarm interrupt occurs.
- EN remains high and the PWRON key is pressed.

2. Power-up sequencing: SoC platforms can require different rail sequences. The current sequences are shown below; consult the latest applicable datasheet for specifics.

![Chinese PDF original · p8](/docs/rockchip-rk816-pmic/assets/cn-p008-figure-01.png)

*Chinese PDF original · p8*


Sequence table transcribed from the original image; blanks, x, OTP and ON/OFF are retained.

| Rail | Output range | Maximum current | 1 (RK816B-1) Default voltage | 1 (RK816B-1) Sequence | 0 (RK816B-2) Default voltage | 0 (RK816B-2) Sequence | 0 (RK816B-3) Default voltage | 0 (RK816B-3) Sequence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 0.7125V-2.3V (0.7125-1.45V, step 12.5mV) | 2A | 1.1V | 2 | 1.0V | 3 | 1.1V | 2 |
| BUCK2 | 0.7125V-2.3V (0.7125-1.45V, step 12.5mV) | 2A | 1.1V | 1 | 2.2V | 1 | 1.1V | 1 |
| BUCK3 | external resistors | 1A | x | 3 | x | 4 | x | 3 |
| BUCK4 | 0.8V-3.5V (step 0.1V) | 1A | 3.3V | 1 | 3.3V | 6 | 3.3V | 1 |
| BOOST | 4.7V-5.4V (step 0.1V) | 2A | 5V | OFF | 5V | OFF | 5V | OFF |
| LDO1 | 0.8V-3.4V (step 0.1V) | 300mA | 1.0V | OFF | 1.0V | 2 | 1.8V | OFF |
| LDO2 | 0.8V-3.4V (step 0.1V) | 300mA | 1.8V | 1 | 1.8V | 5 | 1.8V | 1 |
| LDO3 | 0.8V-3.4V (step 0.1V) | 100mA | 1.1V | 1 | 1.0V | 2 | 1.1V | 1 |
| LDO4 | 0.8V-3.4V (step 0.1V) | 300mA | 1.0V | OFF | 3.3V | 6 | 3.3V | OFF |
| LDO5 | 0.8V-3.4V (step 0.1V) | 300mA | 3.0V | 4 | 1.8V | OFF | 3.3V | 4 |
| LDO6 | 0.8V-3.4V (step 0.1V) | 300mA | 3.0V | 4 | 2.8V | OFF | 3.3V | 4 |

## 2. Configuration

### 2.1 Drivers and menuconfig

Kernel 3.10 configuration. RK816 driver files (reusing the RK816 driver):

```text
drivers/mfd/rk816.c
drivers/input/misc/rk816-pwrkey.c
drivers/rtc/rtc-rk816.c
drivers/gpio/gpio-rk816.c
drivers/regulator/rk816-regulator.c
drivers/power/rk816_battery.c
```

Reference RK816 DTS file:

```text
arch/arm/boot/dts/rk816.dtsi
arch/arm/boot/dts/rk3126-86v-rk816.dts
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK816
CONFIG_GPIO_RK816
CONFIG_RTC_RK816
CONFIG_REGULATOR_RK816
CONFIG_INPUT_RK816_PWRKEY
CONFIG_BATTERY_RK816
```

Kernel 4.4 configuration. RK816 driver files:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk8xx-pwrkey.c
drivers/rtc/rtc-rk808.c
drivers/gpio/gpio-rk8xx.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_GPIO_RK8XX
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK8XX_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

Kernel 4.19 configuration. RK816 driver files:

```text
drivers/mfd/rk808.c
drivers/input/misc/rk816-pwrkey.c       // 跟4.4内核不同
drivers/rtc/rtc-rk808.c
drivers/pinctrl/pinctrl-rk816.c         // 跟4.4内核不同
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/rk816_battery.c
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_PINCTRL_RK816
CONFIG_REGULATOR_RK808
CONFIG_INPUT_RK816_PWRKEY
CONFIG_COMMON_CLK_RK808
CONFIG_BATTERY_RK816
```

### 2.2 DTS configuration

Kernel 3.10 configuration

DTS configuration consists of I2C attachment, main properties, regulator, rtc and poweroff sections.

```text
&i2c1 {
    rk816: rk816@1a {
        reg = <0x1a>;
        status = "okay";
    };
};

/include/ "rk816.dtsi"
&rk816 {
    gpios = <&gpio1 GPIO_A5 GPIO_ACTIVE_HIGH>, <&gpio1 GPIO_A1 GPIO_ACTIVE_LOW>;
    rk816,system-power-controller;
    rk816,support_dc_chg = <1>;/*1: dc chg; 0:usb chg*/
    io-channels = <&adc 0>;
    gpio-controller;
    #gpio-cells = <2>;
    rtc {
        status = "okay";
    };

    regulators {
        rk816_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv = <900000>;
            };
        };

        rk816_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x1>;
            regulator-initial-state = <3>;
            regulator-always-on;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1000000>;
            };
        };
        rk816_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. I2C attachment: place the complete RK816 node under the appropriate i2c node and set `status = "okay";`.

2. Main properties — do not change the following:

`rk816,system-power-controller`: declares that RK816 manages system power-off.

`gpio-controller`: declares RK816 GPIO functionality.

`#gpio-cells`: number of arguments required when referencing RK816 GPIOs.

To reference a RK816 GPIO, use `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;`. First argument: &rk816, fixed. Second: GPIO index, 0 = out1 or 1 = out2 only. Third: GPIO polarity. Configurable main gpios property: first pmic_int, then pmic_sleep.

3. regulator

- `regulator-name`: Supply name; match the schematic. regulator_get uses this name.

- `regulator-min-microvolt`: Minimum adjustable voltage during operation.

- `regulator-max-microvolt`: Maximum adjustable voltage during operation.

- `regulator-initial-mode`: DCDC runtime mode, normally 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-state-mode`: DCDC suspend mode, normally 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Suspend state; must be 3.

- `regulator-boot-on`: Enable the rail when registering the regulator.

- `regulator-always-on`: Disallow disabling the rail during operation and enable it at registration.

- `regulator-state-enabled`: Keep powered during suspend; replace with regulator-state-disabled to power off.

- `regulator-state-uv`: Standby voltage when the rail remains powered.

Notes:

When regulator-min-microvolt equals regulator-max-microvolt, the framework sets that voltage and enables the rail at registration, without user intervention.

With regulator-boot-on or regulator-always-on present, the framework enables the rail at registration. If the minimum and maximum voltages are equal, it sets that voltage. If they differ, the rail remains at the PMIC hardware-default power-up voltage.

4. rtc: if RTC is not needed (for example on a box product), add the node shown above and explicitly set `status = "disabled"`. To enable RTC, remove the entire RTC node or set `status = "okay"`.

5. poweroff

```text
gpio_poweroff {
    compatible = "gpio-poweroff";
    gpios = <&gpio2 GPIO_D2 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

RK816 can power down the entire PMIC by raising pmic_sleep, so add this node at the root. The configurable gpios property identifies pmic_sleep. Without registering this function, RK816 software shutdown is also available, following the same process as RK808 and RK818.

Kernel 4.4 DTS configuration: i2c attachment, main properties, rtc, pwrkey, gpio and regulator.

```text
&pinctrl {
    pmic {
        pmic_int_l: pmic-int-l {
        rockchip,pins =
            <2 6 RK_FUNC_GPIO &pcfg_pull_up>;   /* gpio2_a6 */
        };
    };
};
&i2c1 {
    status = "okay";
    rk816: pmic@1a {
        compatible = "rockchip,rk816";
        reg = <0x1a>;
        interrupt-parent = <&gpio0>;
        interrupts = <2 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        gpio-controller;
        #gpio-cells = <2>;
        #clock-cells = <1>;
        clock-output-names = "rk816-clkout1", "rk816-clkout2";
        extcon = <&u2phy>;
        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc5-supply = <&vcc_io>;
        vcc6-supply = <&vcc_sys>;
        gpio {
            status = "okay";
        };
        pwrkey {
            status = "okay";
        };
        rtc {
            status = "okay";
        };
        battery {
            compatible = "rk816-battery";
            ocv_table = < 3500 3625 3685 3697 3718 3735 3748
                    3760 3774 3788 3802 3816 3834 3853
                    3877 3908 3946 3975 4018 4071 4106>;
            design_capacity = <2500>;
            design_qmax = <2750>;
            bat_res = <100>;
            max_input_current = <1500>;
            max_chrg_current = <1300>;
            max_chrg_voltage = <4200>;
            sleep_enter_current = <300>;
            sleep_exit_current = <300>;
            sleep_filter_current = <100>;
            power_off_thresd = <3500>;
            zero_algorithm_vol = <3850>;
            max_soc_offset = <60>;
            monitor_sec = <5>;
            virtual_power = <0>;
            power_dc2otg = <0>;
            dc_det_adc = <0>;
        };

        regulators {

            vdd_arm: DCDC_REG1{
                regulator-name= "vdd_arm";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-off-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vdd_log: DCDC_REG2 {
                regulator-name= "vdd_logic";
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1500000>;
                regulator-ramp-delay = <6001>;
                regulator-initial-mode = <1>;
                regulator-always-on;
                regulator-boot-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK816_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. i2c attachment: place the complete RK816 node under the corresponding i2c node and set `status = "okay";`.

2. Main properties — do not change the following:

```text
compatible = "rockchip,rk816";
reg = <0x18>;
rockchip,system-power-controller;
wakeup-source;
gpio-controller;
#gpio-cells = <2>;
```

Configurable according to pinctrl rules:

- interrupt-parent: GPIO controller owning pmic_int.
- interrupts: pin index and polarity of pmic_int on that controller.
- pinctrl-names: do not modify; fixed as "default".
- pinctrl-0: reference to the pmic_int pin defined in pinctrl.

3. rtc, pwrkey and gpio: when selected in menuconfig but not needed, add the corresponding nodes in DTS and explicitly set `status = "disabled"`. The drivers will not load; resulting boot error logs may be ignored in this case. To enable them, remove the nodes or set `status = "okay"`.

4. regulator

- `regulator-compatible`: Name required for driver matching; changing it causes loading to fail.

- `regulator-name`: Supply name; match the schematic. regulator_get uses this name.

- `regulator-init-microvolt`: Initial voltage in U-Boot; ineffective in the kernel.

- `regulator-min-microvolt`: Minimum adjustable voltage during operation.

- `regulator-max-microvolt`: Maximum adjustable voltage during operation.

- `regulator-initial-mode`: DCDC runtime mode, normally 1: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-mode`: DCDC suspend mode, normally 2: 1 = force PWM; 2 = auto PWM/PFM.

- `regulator-initial-state`: Suspend state; must be 3.

- `regulator-boot-on`: Enable the rail when registering the regulator.

- `regulator-always-on`: Disallow disabling the rail during operation and enable it at registration.

- `regulator-ramp-delay`: DCDC voltage rise time; source fixed value 12500.

- `regulator-on-in-suspend`: Keep powered during suspend; replace with regulator-off-in-suspend to power off.

- `regulator-suspend-microvolt`: Standby voltage when the rail remains powered.

Kernel 4.19 DTS configuration

See the kernel 4.4 DTS configuration. Difference: kernel 4.19 no longer needs a gpio child node, but other modules still reference RK816 pins using `gpios = <&rk816 0 GPIO_ACTIVE_LOW>;`.

### 2.3 Function interfaces

The following interfaces cover common regulator operations: enable, disable, set voltage and get voltage.

1. Get a regulator:

`struct regulator *regulator_get(struct device *dev, const char *id)`

Use NULL for dev by default; id matches regulator-name in DTS.

2. Release regulator:

`void regulator_put(struct regulator *regulator)`

3. Enable regulator:

`int regulator_enable(struct regulator *regulator)`

4. Disable regulator:

`int regulator_disable(struct regulator *regulator)`

5. Get voltage regulator:

`int regulator_get_voltage(struct regulator *regulator)`

6. Set regulator voltage:

`int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)`

The caller must ensure min_uV = max_uV.

7. Example

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

Kernel 4.4 and 4.19 also provide regulator interfaces prefixed devm_ to manage allocated resources for developers.

## 3. Debug

### 3.1 3.10 kernel

PMIC driver logic is relatively simple; final register settings are the main focus. A common debug method is to inspect RK816 registers through `/sys/rk816/rk816_test`.

Read: `echo r [addr] > /sys/rk816/rk816_test`

Write: `echo w [addr] [value] > /sys/rk816/rk816_test`

Example: `echo r 0x2f > /sys/rk816/rk816_test` reads register 0x2f; the source result is 0x9b.

![Chinese PDF original · p16](/docs/rockchip-rk816-pmic/assets/cn-p016-figure-01.png)

*Chinese PDF original · p16*

`echo w 0x2f 0x9c > /sys/rk816/rk816_test` sets register 0x2f to 0x9c. After writing, read back to verify success.

![Chinese PDF original · p17](/docs/rockchip-rk816-pmic/assets/cn-p017-figure-01.png)

*Chinese PDF original · p17*

> Source check: the write example specifies 0x9c, but the following original image still reads 0x9b and repeats the previous screenshot. It does not demonstrate a successful write; verify separately on real hardware using a safe procedure.

### 3.2 4.4 kernel

Command format is unchanged from kernel 3.10; only the path differs. Kernel 4.4 uses `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 kernel

Refer to the kernel 4.4 commands.

{% endraw %}
