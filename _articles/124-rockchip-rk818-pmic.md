---
title: "Complete Rockchip RK818 PMIC Guide: Pins, Power Sequencing, DTS and Debugging"
description: "Complete Rockchip RK818 PMIC Guide: Pins, Power Sequencing, DTS and Debugging — V1.0.1"
excerpt: "Complete Rockchip RK818 PMIC Guide: Pins, Power Sequencing, DTS and Debugging — V1.0.1"
translation_key: 124-rockchip-rk818-pmic
slug: 124-rockchip-rk818-pmic
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Complete Rockchip RK818 PMIC Guide: Pins, Power Sequencing, DTS and Debugging

Chinese source V1.0.1; kernel scope 3.10 / 4.4 / 4.19. Technical-preface scope includes module concepts, functions, configuration and troubleshooting. No English PDF exists in this input: all four languages are derived fully from the Chinese source and use its original technical figures where present. ArmSoM platform reference only: verify the actual board PMIC, SoC, SDK/BSP, kernel, power tree and battery specifications. No hardware tests or blanket board-support claims.

> Code, parameters and logs are manufacturer examples, not ArmSoM measurements. Power, charging-current, voltage or thermal changes can cause power loss, damage or battery hazards; do not apply examples blindly and never disable thermal protection in normal use. Source discrepancies are retained without guessing constants; see this article’s editorial notes. Source HDIM5V spelling, 0.737.5 step, RK808 shutdown reference and ramp-delay values remain pending verification.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Basics

### 1.1 Overview

RK818 is a high-performance PMIC integrating 4 high-current DCDCs, 1 high-current BOOST, 9 LDOs, 1 SWITCH, one HDIM5V output (source spelling), one OTG output, 1 RTC, adjustable sequencing, switching charging, intelligent power-path management and a coulomb counter. System supplies are generally DCDC or LDO; their characteristics follow (consult further material for details).

1. DCDC: efficient at a large input/output voltage difference, but with relatively high ripple and cost; therefore used for large voltage drops and high-current loads. Two common modes are PWM, with good ripple/transient response but lower efficiency, and PFM, with higher efficiency but weaker load capability.

2. LDO: low efficiency at a large input/output voltage difference, but low cost. Optimize the system to improve conversion efficiency: for a 1.1V LDO output, its input can be supplied by the VCCIO_3.3V DCDC. Where the circuit permits, connect the LDO input to a DCDC output, taking power-up sequencing into account.

### 1.2 Functions

From the user perspective, RK818 functions are described as four parts:

1. regulator: controls the state of individual DCDC and LDO supplies.

2. rtc: provides clockkeeping, timing and related functions.

3. clk: two 32.768KHZ clock outputs; one is always on and cannot be controlled, while the other is software-controlled.

4. Charging and fuel-gauge functions are not detailed here; see Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.

### 1.3 Pin functions

![Chinese-PDF original · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-01.png)

*Chinese-PDF original · p5*

Pay particular attention to the SLEEP and INT pins in the following descriptions.

![Chinese-PDF original · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-02.png)

*Chinese-PDF original · p5*

![Chinese-PDF original · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-01.png)

*Chinese-PDF original · p6*

![Chinese-PDF original · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-02.png)

*Chinese-PDF original · p6*

![Chinese-PDF original · p7](/docs/rockchip-rk818-pmic/assets/cn-p007-figure-01.png)

*Chinese-PDF original · p7*

Editable transcription of the original tables above.

| Pin no. | Name | Description |
| --- | --- | --- |
| 1 | INT | Interrupt request, active low |
| 2 | SLEEP | Input switching sleep/non-sleep states |
| 3 | H_5V | 5v supply output for HDMI |
| 4 | GND5 | Power ground |
| 5 | SW5 | Switch output |
| 6,7 | BOOST | BOOST output |
| 8,9 | USB | Power input from USB |
| 10 | MIDU | Middle point of USB supply |
| 11,12 | SW6 | Switch output |
| 13 | GND6 | Power ground |
| 14 | VLDO1 | LDO1 output |
| 15 | VCC6 | Power supply of LDO |
| 16 | VLDO2 | LDO2 output |
| 17 | XIN | 32.768KHz crystal oscillator input |
| 18 | XOUT | 32.768KHz crystal oscillator output |
| 19 | BOOT0 | Boot-sequence selection low bit |
| 20 | BOOT1 | Boot-sequence selection high bit |
| 21 | PWRON | Power on/off enable, active low; internal 100K pull-up to supply |
| 22 | VCC3 | Power supply of DCDC3 |
| 23 | SW3 | DCDC3 switch output |
| 24 | GND3 | Power ground |
| 25 | VFB3 | Output feedback voltage of DCDC3 |
| 26 | VFB2 | Output feedback voltage of DCDC2 |
| 27 | GND2 | Power ground |
| 28,29 | SW2 | DCDC2 switch output |
| 30 | VCC2 | Power supply of DCDC2 |
| 31 | CLK32K1 | 32.768K clock1 output, open drain |
| 32 | CLK32K2 | 32.768K clock2 output, open drain |
| 33 | VDDIO | Power supply of IO |
| 34 | NRESPWON | Reset after power-on, active low |
| 35 | SCL | I2C clock input |
| 36 | SDA | I2C data input/output |
| 37 | VPP | Test supply, floating in application |
| 38 | VFB1 | Output feedback voltage of DCDC1 |
| 39 | VCC1 | Power supply of DCDC1 |
| 40,41 | SW1 | DCDC1 switch output |
| 42,43 | GND1 | Power ground |
| 44 | VLDO7 | LDO7 output |
| 45 | VCC7 | Power supply of LDO |
| 46 | VLDO5 | LDO5 output |
| 47 | VLDO3 | LDO3 output |
| 48 | VLDO4 | LDO4 output |
| 49 | VLDO6 | LDO6 output |
| 50 | VCC8 | Power supply of SWITCH |
| 51 | VLDO8 | LDO8 output |
| 52 | VLDO9 | LDO9 output |
| 53 | VCC9 | Power supply of LDO |
| 54 | VSWOUT | Switch output |
| 55 | VREF | Internal reference voltage |
| 56 | REFGND | Reference ground |
| 57 | SNSN | Battery charge/discharge current-sense negative terminal |
| 58 | SNSP | Battery charge/discharge current-sense positive terminal |
| 59,60 | BAT | Battery positive terminal |
| 61,62 | SYS | DC-DC regulator output for system load and battery charging |
| 63 | VCC4 | Power supply of DCDC4 |
| 64 | SW4 | DCDC4 switch output |
| 65 | VFB4 | Output feedback voltage of DCDC4 |
| 66 | GND4 | Power ground |
| 67 | TS1 | Thermistor1 input; connect thermistor to ground, usually in battery pack |
| 68 | TS2 | Thermistor2 input to ground; can be internal ADC analog input when control bit selects ADC |
| Exposed pad | Exposed ground | Must connect to ground for thermal/electrical enhancement |

### 1.4 Important concepts

I2C 7-bit slave address: 0x1c. The PMIC has three operating modes.

1. PMIC normal mode: during normal system operation the PMIC is in normal mode and pmic_sleep is low.

2. PMIC sleep mode reduces PMIC consumption during system suspend. Depending on product requirements, some rail voltages are lowered or outputs disabled. During standby the AP configures pmic_sleep as sleep over I2C and raises it to enter sleep. When the SoC wakes, pmic_sleep returns low and the PMIC exits sleep.

3. PMIC shutdown mode: during shutdown, PMIC powers off the system. The AP selects shutdown for pmic_sleep over I2C, then raises pmic_sleep.

**pmic_sleep:** normally low in normal mode; raising it selects sleep or shutdown.

**pmic_int:** normally high, driven low on interrupt; remains low until handled.

**pmic_pwron:** the hardware power key must connect here; the driver detects press/release through this pin.

**DCDC modes:** PWM (force PWM) and PFM, with AUTO switching dynamically. The PMIC supports PWM and AUTO PWM/PFM. AUTO is efficient but has poorer ripple/transient response. For stability use PWM while running, switching to AUTO PWM/PFM during suspend.

**DCDC3 voltage:** cannot be changed via registers; external divider resistors set it. Change the external hardware for a different voltage. Rockchip commonly uses it for VCC_DDR.

**DCDC/LDO runtime voltage ranges:**

1. Continuous DCDC voltage ranges:

1. Continuous DCDC voltage ranges:

| Voltage range (V) | Step (mV) | Voltage settings (V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 3.3 | 100 | 1.8、1.9、2.0、2.2....、3.3 |

2. Continuous LDO voltages:

| Voltage range (V) | Step (mV) | Voltage settings (V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、0.9、1.0、1.1、1.2、 ...... 3.4 |

### 1.5 Power-on conditions and sequence

1. Power-on conditions: any one of the following powers on the PMIC:

- EN transitions from low to high.
- EN remains high and an RTC alarm interrupt occurs.
- EN remains high and the PWRON key is pressed.

2. Power-up sequencing: SoC platforms can require different rail sequences. The current sequences are shown below; consult the latest applicable datasheet for specifics.

![Chinese-PDF original · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-01.png)

*Chinese-PDF original · p9*

![Chinese-PDF original · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-02.png)

*Chinese-PDF original · p9*


AP mapping: BOOT11 = RK3188/RK3168/RK3188M/RK3168M/RK3028A/RK3028/RK2928; BOOT10 = partial OTP (BUCK1–4, LDO3/LDO4/LDO5/LDO7); BOOT01 = RK3066; BOOT00 RK818-1 = RK3288/RK3368; BOOT00 RK818-2 = S-Product.

| Rail | BOOT11 Voltage | BOOT11 Sequence | BOOT10 Voltage | BOOT10 Sequence | BOOT01 Voltage | BOOT01 Sequence | BOOT00 RK818-1 Voltage | BOOT00 RK818-1 Sequence | BOOT00 RK818-2 Voltage | BOOT00 RK818-2 Sequence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUCK1 | 1.1V | 3 | OTP | OTP | 1.2V | 3 | 1.1V | 3 | 1.0V | 12 |
| BUCK2 | 1.1V | 1 | OTP | OTP | 1.2V | 1 | 1.1V | 1 | 1.0V | 12 |
| BUCK3 | x | 4 | x | OTP | x | 4 | X | 3 | X | 13 |
| BUCK4 | 3.0V | 1 | OTP | OTP | 3.0V | 1 | 3.3V | 4 | 3.3V | 14 |
| LDO1 | 3.3V | x | 3.3V | x | 3.3V | x | 3.3V | x | 1.8V | 11 |
| LDO2 | 3.0V | x | 3V | x | 3.0V | x | 3.0V | x | X | X |
| LDO3 | 1.1V | 1 | OTP | OTP | 1.1V | 1 | 1.1V | x | 1.8V | 15 |
| LDO4 | 2.5V | 2 | OTP | OTP | 2.5V | 2 | 2.5V | x | 1.8V | 1 |
| LDO5 | 3V | 1 | OTP | OTP | 3.0V | 2 | 1.8V | 4 | 1.8V | 11 |
| LDO6 | 1.2V | x | 1.2V | x | 1.1V | x | 1.1V | x | X | X |
| LDO7 | 1.8V | 2 | OTP | OTP | 1.8V | 2 | 1.8V | 3 | 1.1V | 15 |
| LDO8 | 1.8V | x | 1.8V | x | 1.8V | x | 1.8V | x | 3.0V | 14 |
| LDO9 | 3.0V | 4 | 3.0V | 5 | 3.0V | 4 | 3.3V | 10 | 1.8V | 15 |
| SWITCH | x | x | x | x | x | x | x | 10 | x | x |
| OTG | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |
| HDMI_5V | 5V | x | 5V | x | 5V | x | 5V | x | 5V | x |

## 2. Configuration

### 2.1 Drivers and menuconfig

Kernel 3.10 configuration — RK818 driver files:

```text
drivers/mfd/rk818.c
drivers/mfd/rk818-irq.c
drivers/rtc/rtc-rk818.c
drivers/power/rk818-battery.c
```

Reference RK818 DTS file:

```text
arch/arm/boot/dts/rk818.dtsi
arch/arm64/boot/dts/rk3368-p9_818.dts
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK818
CONFIG_RTC_RK818
CONFIG_BATTERY_RK818
```

Kernel 4.4 configuration. RK818 driver files:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk818_charger.c
drivers/power/rk818_battery.c
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

Kernel 4.19 configuration. RK818 driver files:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/supply/rk818_battery.c
drivers/power/supply/rk818_charger.c
```

Corresponding menuconfig symbols:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

### 2.2 DTS configuration

Kernel 3.10 DTS configuration includes I2C attachment, main properties, regulator, RTC and poweroff.

```text
&i2c1 {
    rk818: rk818@1c {
        reg = <0x1c>;
        status = "okay";
    };
};

/include/ "../../../arm/boot/dts/rk818.dtsi"
&rk818 {
    gpios =<&gpio0 GPIO_A1 GPIO_ACTIVE_HIGH>,<&gpio0 GPIO_A0 GPIO_ACTIVE_LOW>;
    rk818,system-power-controller;
    pinctrl-names = "default";
    pinctrl-0 = <&gpio0_c1>;

    regulators {
        rk818_dcdc1_reg: regulator@0{
            regulator-name= "vdd_arm";/*vcc arm*/
            regulator-min-microvolt = <700000>;/*<725000>;*/
            regulator-max-microvolt = <1500000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-disabled;
                regulator-state-uv =<900000>;
            };
        };

        rk818_dcdc2_reg: regulator@1 {
            regulator-name= "vdd_logic";/*vcc gpu*/
            regulator-min-microvolt = <700000>;
            regulator-max-microvolt = <1200000>;
            regulator-initial-mode = <0x2>;
            regulator-initial-state = <3>;
            regulator-state-mem {
                regulator-state-mode = <0x2>;
                regulator-state-enabled;
                regulator-state-uv = <1200000>;
            };
        };
        rk818_dcdc3_reg: regulator@2 {
                    .............
        };
        .................................
    };
};
```

1. I2C attachment: place the complete RK818 node under the appropriate i2c node and set `status = "okay";`.

2. Main properties — do not change the following:

`rk818,system-power-controller` declares RK818 system power-off management.

Configurable: gpios specifies pmic_int first and pmic_sleep second.

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

5. poweroff: the source says the RK808 driver intercepts shutdown and writes I2C to disable PMIC outputs. rk818_shutdown is registered as syscore shutdown for preparatory actions, such as disabling RTC interrupts.

```text
static void rk818_shutdown(void)
{
    int ret;
    struct rk818 *rk818 = g_rk818;

    pr_info("%s\n", __func__);
    ret = rk818_set_bits(rk818, RK818_INT_STS_MSK_REG1,(0x3<<5),(0x3<<5));
//close rtc int when power off
    ret = rk818_clear_bits(rk818, RK818_RTC_INT_REG,(0x3<<2)); //close rtc int when power off
    /*disable otg_en*/
    ret = rk818_clear_bits(rk818, RK818_DCDC_EN_REG, (0x1<<7));

    mutex_lock(&rk818->io_lock);
    mdelay(100);
}

static struct syscore_ops rk818_syscore_ops = {
    .shutdown = rk818_shutdown,
};
```

rk808_device_shutdown performs the actual I2C writes to switch off PMIC outputs.

```text
void rk818_device_shutdown(void)
{
    int ret, i;
    u8 reg = 0;
    struct rk818 *rk818 = g_rk818;

    for (i = 0; i < 10; i++) {
        pr_info("%s\n", __func__);
        ret = rk818_i2c_read(rk818, RK818_DEVCTRL_REG, 1, &reg);
        if (ret < 0)
            continue;
        ret = rk818_i2c_write(rk818, RK818_DEVCTRL_REG, 1,
                     (reg | (0x1 << 0)));
        if (ret < 0) {
            pr_err("rk818 power off error!\n");
            continue;
        }
    }
    while(1) wfi();
}
EXPORT_SYMBOL_GPL(rk818_device_shutdown);
```

Kernel 4.4 DTS includes I2C attachment, main properties, RTC, clk, regulator, charger and battery.

```text
&i2c1 {
    status = "okay";
    rk818: pmic@1c {
        compatible = "rockchip,rk818";
        reg = <0x1c>;
        status = "okay";

        clock-output-names = "rk818-clkout1", "wifibt_32kin";
        interrupt-parent = <&gpio0>;
        interrupts = <1 IRQ_TYPE_LEVEL_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&pmic_int_l>;
        rockchip,system-power-controller;
        wakeup-source;
        #clock-cells = <1>;

        vcc1-supply = <&vcc_sys>;
        vcc2-supply = <&vcc_sys>;
        vcc3-supply = <&vcc_sys>;
        vcc4-supply = <&vcc_sys>;
        vcc6-supply = <&vcc_sys>;
        vcc7-supply = <&vcc_sys>;
        vcc8-supply = <&vcc_sys>;
        vcc9-supply = <&vcc_io>;

        regulators {
            vdd_logic: DCDC_REG1 {
                regulator-name = "vdd_logic";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <750000>;
                regulator-max-microvolt = <1450000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };

            vdd_gpu: DCDC_REG2 {
                regulator-name = "vdd_gpu";
                regulator-always-on;
                regulator-boot-on;
                regulator-min-microvolt = <800000>;
                regulator-max-microvolt = <1250000>;
                regulator-ramp-delay = <6001>;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1000000>;
                };
            };
            vcc_ddr: RK818_DCDC3@2 {
                .................
            };
            .............................
        };
    };
};
```

1. i2c attachment: place the complete RK818 node under the corresponding i2c node and set `status = "okay";`.

2. Main properties — do not change the following:

```text
compatible = "rockchip,rk818";
reg = <0x1c>;
rockchip,system-power-controller;
wakeup-source;
#clock-cells = <1>;
```

Configurable according to pinctrl rules:

- interrupt-parent: GPIO controller owning pmic_int.
- interrupts: pin index and polarity of pmic_int on that controller.
- pinctrl-names: do not modify; fixed as "default".
- pinctrl-0: reference to the pmic_int pin defined in pinctrl.

3. rtc: if selected in menuconfig but not needed, add an rtc node in DTS and explicitly set `status = "disabled"`. The driver will not be enabled; error logs at boot can be ignored in this case. To enable it, remove the node or set `status = "okay"`.

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

5. poweroff

Kernel 4.4 uses pm_power_off_prepare for preparatory actions such as disabling RTC interrupts and configuring special registers. The registered syscore shutdown performs the actual PMIC power-off.

6. clk: a node using a RK818 clock references it as follows:

`clocks = <&rk818 1>;`

First argument: &rk818, fixed. Second argument: clock index, only 0 or 1; 0 = rk818-clkout1, 1 = rk818-clkout2.

Kernel 4.19 DTS configuration

See the kernel 4.4 DTS configuration. Difference: kernel 4.19 no longer needs a gpio child node, but other modules still reference RK818 pins using `gpios = <&rk818 0 GPIO_ACTIVE_LOW>;`.

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

PMIC driver logic is relatively simple; the final register settings are central. A common debug method is to inspect RK818 registers via `/sys/rk818/rk818_test`.

Read: `echo r [addr] > /sys/rk818/rk818_test`

Write: `echo w [addr] [value] > /sys/rk818/rk818_test`

### 3.2 4.4 kernel

Command format is unchanged from kernel 3.10; only the path differs. Kernel 4.4 uses `/sys/rk8xx/rk8xx_dbg`.

### 3.3 4.19 kernel

Refer to the kernel 4.4 commands.

{% endraw %}
