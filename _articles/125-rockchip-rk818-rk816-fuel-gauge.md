---
title: "Complete Rockchip RK818/RK816 Fuel-Gauge Guide: Charging, DTS, Calibration and Troubleshooting"
description: "Complete Rockchip RK818/RK816 Fuel-Gauge Guide: Charging, DTS, Calibration and Troubleshooting — V2.2.0"
excerpt: "Complete Rockchip RK818/RK816 Fuel-Gauge Guide: Charging, DTS, Calibration and Troubleshooting — V2.2.0"
translation_key: 125-rockchip-rk818-rk816-fuel-gauge
slug: 125-rockchip-rk818-rk816-fuel-gauge
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Complete Rockchip RK818/RK816 Fuel-Gauge Guide: Charging, DTS, Calibration and Troubleshooting

Chinese source V2.2.0; kernel scope 3.10 / 4.4 / 4.19. Technical-preface scope includes module concepts, functions, configuration and troubleshooting. No English PDF exists in this input: all four languages are derived fully from the Chinese source and use its original technical figures where present. ArmSoM platform reference only: verify the actual board PMIC, SoC, SDK/BSP, kernel, power tree and battery specifications. No hardware tests or blanket board-support claims.

> Code, parameters and logs are manufacturer examples, not ArmSoM measurements. Power, charging-current, voltage or thermal changes can cause power loss, damage or battery hazards; do not apply examples blindly and never disable thermal protection in normal use. Source discrepancies are retained without guessing constants; see this article’s editorial notes. The original contains joined OCV values 38163836/39714002, compatible missing semicolons/curly quotes and 21IRQ_TYPE_LEVEL_LOW. Other discrepancies: bat_res says ohms but example 120, NTC count/range, design_qmax 4100 versus ×1.1, and temperature_chrg_table parameter3 direction. Retained as source, not a compilable or safe configuration.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Overview RK818/RK816 fuel gauge

RK818/RK816 is a high-performance PMIC integrating multiple high-current DCDCs and LDOs, one linear switch, one USB 5V and boost output, switching charging, intelligent power-path management, a coulomb counter, RTC and adjustable power-up sequencing. This document covers switching charging, intelligent power-path management and the fuel gauge (coulomb counter).

1. Charging management includes input-current limiting, trickle charge, constant-current/constant-voltage charge, charge termination and charging-timeout safety protection.

2. Intelligent power-path management adjusts the output voltage to supply the system load while charging the battery. When input current is limited, input power serves the system first and only the remainder charges the battery. If system demand exceeds the limited input power or input is disconnected, it automatically closes the battery-to-system switch so the battery can supply additional power.

3. The fuel gauge (coulomb counter) uses the manufacturer’s patented algorithm and battery-specific charging/discharging curves to measure charge and report it to the system chip over I2C. Functions also include low-current charging of over-discharged batteries, battery-temperature detection, a charging safety timer and chip thermal protection.

## 2. Fuel-gauge principles

1. Three basic principles:

(1) The open-circuit-voltage/state-of-charge curve (OCV-SOC) mainly depends on battery materials and manufacturing. The source states that temperature and aging have little influence, so the SOC-OCV curve is essentially fixed after manufacture.

(2) Polarization during operation makes OCV difficult to infer from terminal voltage. Usable OCV is obtained only when the battery is not polarized, such as after a long shutdown or extended low-current operation; SOC can then be inferred from OCV.

(3) A coulomb counter measures charge flowing in/out. Knowing total battery capacity makes SOC easy to calculate, but accumulated counter error is large and capacity varies with temperature and aging. Coulomb counting therefore gives good short-term accuracy only, and total capacity must be updated periodically.

Good fuel gauges combine OCV estimation and coulomb counting to obtain real-time remaining capacity.

2. Coulomb counting

A current-sense resistor is connected in series at the battery terminals. Current produces V_delta across it, from which battery current is calculated. The source claims accurate tracking of charge changes with up to 1% accuracy. Combining battery voltage and temperature greatly reduces the influence of aging and other factors.

3. Current-signal conditioning

Sample current with a 20 or 10 milliohm resistor. A constant-current-source offset shifts negative current signals positive; an op amp amplifies them into the Vref range, and an ADC converts them to digital values.

4. Voltage acquisition

A divider with ratio 0.5 brings battery voltage into the Vref range, then the ADC produces a digital output.

5. Average-current acquisition

The digital section adds the corrected current to a multi-bit accumulator 256 times per second. At the end of each second, dividing the accumulator by 256 yields average current.

6. Coulomb-counter update

The counter accumulates automatically once whenever average current is updated.

## 3. Important concepts

**OCV voltage:** open-circuit voltage. The PMIC samples during power-up sequencing, when load is extremely small and approximates an open circuit, so the source treats this voltage as accurate. After at least 30 minutes off, polarization is considered largely eliminated; the OCV is treated as valid and used to look up ocv_table, update charge and correct the coulomb counter.

**ocv_table:** every battery has its own characteristic curve. Divide 0%–100% charge into 21 points at 5% increments, pairing each with an OCV. This voltage-to-charge table corrects the counter on first boot after battery connection, after a long shutdown and after long sleep. Example:

```text
ocv_table = <3400 3599 3671 3701 3728 3746 3762  ......  4088 4132 4183>;
```

Mapping: 3400mv → 0%, 3599mv → 5%, 3671mv → 10%, …, 4183mv → 100%.

**Maximum input and charging current:** the maximum current software allows from the adapter is “maximum input current”; a 5V/2A adapter is generally configured for 2A, or e.g. 1.8A. RK818/816 intelligent power-path management supplies the system first and charges with the remainder. The maximum allowed remaining current into the battery is “maximum charging current”.

**Input current limiting:** demand from system and battery exceeds the maximum input current, so there is insufficient input. Equivalently, the battery cannot be charged at maximum charging current under its required conditions. This is one of three charge-termination checks, alongside termination voltage and current.

**Relax mode:** under very low load (currently only second-level standby), if load current stays below a threshold for a configurable period, the fuel gauge enters relax mode, approximating open circuit.

**Relax voltage:** in relax mode a voltage set is sampled every 8 minutes. Because second-level standby load is small, it approximates OCV. When waking and meeting certain conditions, the driver uses this voltage with ocv_table to correct the coulomb counter.

**finish:** when charging terminates, a register status signal named finish is generated. Only after receiving it does software consider hardware charge termination genuine and run the corresponding displayed-charge adjustment algorithm.

**Chip thermal protection:**

This is a PMIC self-protection feedback mechanism. Above the configured temperature threshold, hardware gradually reduces input current to reduce load and heat. Software does not participate, and there is no fixed temperature/current ratio; extreme conditions may stop charging.

**Charge-termination conditions:** charging current reaches termination current, voltage reaches termination voltage, and no input limiting occurs. A termination signal is generated and charging stops; the battery is considered full. Checking input limiting distinguishes genuinely falling charging current from low current caused by a heavy system load.

## 4. Drivers and menuconfig

### 4.1 Fuel-gauge driver functions

1. Account for and display battery charge.

2. Configure charging current/voltage according to battery and charger type; support single/dual charging ports.

3. Supply 5V to OTG devices.

4. Detect battery temperature.

### 4.2 kernel 3.10

RK818 driver and configuration symbols:

```text
CONFIG_BATTERY_RK818
drivers/power/rk818_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

RK816 driver and configuration symbols:

```text
CONFIG_BATTERY_RK816
drivers/power/rk816_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

### 4.3 kernel 4.4

RK818 drivers and configuration symbols (split into two drivers because of the large functionality):

```text
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
drivers/power/rk818_battery.c           // 负责处理电量显⽰
drivers/power/rk818_charger.c           // 负责处理充电器检测、充电电压、电流设置
```

RK816 driver and configuration symbols:

```text
CONFIG_BATTERY_RK816
drivers/power/rk816_battery.c           // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

### 4.4 kernel 4.19

RK818 driver and configuration symbols:

```text
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
drivers/power/supply/rk818_battery.c    // 负责处理电量显⽰
drivers/power/supply/rk818_charger.c    // 负责处理充电器检测、充电电压、电流设置
```

RK816 driver and configuration symbols:

```text
CONFIG_BATTERY_RK816
drivers/power/supply/rk816_battery.c    // 负责处理电量显⽰ + 充电器检测、充电电压、电流设置
```

## 5. DTS configuration

### 5.1 kernel 3.10

RK816 and RK818 nodes are largely identical, with only a few property differences. The following RK818 example is a complete battery node placed inside the RK818 node. ntc_table, ntc_degree_from, dc_det_gpio and dc_det_adc are optional; the others are mandatory.

```text
battery {
    compatible = "rk818-battery"  // 如果是rk816，则改成"rk816-battery"
    ocv_table = <3400 3599 3671 3701 3728 3746 3762
                 3772 3781 3792 38163836 3866 3910
                 3942 39714002 4050 4088 4132 4183>;
    ntc_table = <43662 41676 39793 38005 36308 34696 33164
                 31709 30326 29011 27760 26570 25438 24361
                 23335 22358 21427 20540 19695 18890 18121
                 17389 16690 16022  14778 14197 13642 13113
                 12606 12122 11659 11216 10793 10388 10000
                 9629 9273 8933 8607 8295>;
    ntc_degree_from = <1 10>;
    design_capacity = <4000>;
    design_qmax = <4100>;
    bat_res = <120>;
    max_input_current = <2000>;
    max_chrg_current = <1800>;
    max_chrg_voltage = <4200>;
    sleep_enter_current = <300>;
    sleep_exit_current = <300>;
    sleep_filter_current = <100>;   // rk818不需要这个属性
    power_off_thresd = <3400>;
    zero_algorithm_vol = <3850>;
    energy_mode = <0>;
    fb_temperature = <105>;
    max_soc_offset = <60>;
    monitor_sec = <5>;
    virtual_power = <0>;
    power_dc2otg = <1>;
    dc_det_gpio = <&gpio0 GPIO_C1 GPIO_ACTIVE_LOW>;
    dc_det_adc = <1>;   // rk818不需要这个属性，rk816才可能需要
};
```

### 5.2 kernel 4.4

RK818 DTS configuration

1. battery: mandatory. Place the following complete node inside RK818. Both battery and charger child drivers use its information. ntc_table, ntc_degree_from, temperature_chrg_table and dc_det_gpio are optional; the others are mandatory.

```text
battery {
    compatible = “rk818-battery”
    ocv_table = <3400 3599 3671 3701 3728 3746 3762
                3772 3781 3792 38163836 3866 3910
                3942 39714002 4050 4088 4132 4183>;
    ntc_table = <43662 41676 39793 38005 36308 34696 33164
                 31709 30326 29011 27760 26570 25438 24361
                 23335 22358 21427 20540 19695 18890 18121
                 17389 16690 16022  14778 14197 13642 13113
                 12606 12122 11659 11216 10793 10388 10000
                 9629 9273 8933 8607 8295>;
    ntc_degree_from = <1 10>;
    temperature_chrg_table = <0 10 1000 1>, <0 20 1200 2>, <1 30 1400 5>, <0 40
700 3>;
    design_capacity = <4000>;
    design_qmax = <4100>;
    bat_res = <120>;
    max_input_current = <2000>;
    max_chrg_current = <1800>;
    max_chrg_voltage = <4200>;
    sleep_enter_current = <300>;
    sleep_exit_current = <300>;
    power_off_thresd = <3400>;
    zero_algorithm_vol = <3850>;
    energy_mode = <0>;
    fb_temperature = <105>;
    sample_res = <10>;
    max_soc_offset = <60>;
    monitor_sec = <5>;
    virtual_power = <0>;
    power_dc2otg = <1>;
    dc_det_gpio = <&gpio0 GPIO_C1 GPIO_ACTIVE_LOW>;
};
```

2. charger: optional. Without Type-C charging, omit this configuration. For Type-C charging add the reference `extcon = <&fusbn>` below the RK818 root node, where n=0,1,… follows actual hardware. rk818_charger.c uses it to register the Type-C notifier chain and obtain charger-type detection information. Example:

```text
rk818: pmic@1c {
    compatible= "rockchip,rk818";
    status= "okay";
    reg= <0x1c>;
    clock-output-names= "xin32k", "wifibt_32kin";
    interrupt-parent= <&gpio1>;
    interrupts = <21IRQ_TYPE_LEVEL_LOW>;
    pinctrl-names= "default";
    pinctrl-0= <&pmic_int_l>;
    rockchip,system-power-controller;
    rk818,support_dc_chg= <1>;/*1: dc chg; 0:usb chg*/
    wakeup-source;
    extcon = <&fusb0>;      // 重要！！！
    #clock-cells= <1>;

    battery {
            ...........
            ...........
    };
};
```

RK816 DTS: refer to RK818 above. Difference: RK816 needs only the battery node, not charger-related configuration.

### 5.3 kernel 4.19

Refer to the kernel 4.4 configuration.

### 5.4 DTS parameter descriptions

The following descriptions apply across kernel versions, but consult the version-specific DTS examples for supported properties.

**ocv_table:** open-circuit voltage-to-charge table with 21 voltages for 0%–100%, in 5% charge steps. The battery manufacturer can supply it, or Rockchip Shenzhen can measure it; consult the relevant engineers.

**ntc_table:**

Battery NTC resistance table, in ohms. Populate it when measuring battery temperature. One value represents one temperature; adjacent values advance by 1°C from left to right. Remove the property if temperature detection is not needed. The example covers -10°C to 30°C.

**ntc_degree_from / ntc_degree_from_v2:** starting temperature of ntc_table[0], in °C; configure with ntc_table.

- Kernels 3.10/4.4 use ntc_degree_from: two fields, sign (1 negative, 0 positive) then magnitude. Source examples `ntc_degree_from = <1, 10>` mean -10°C and `<0, 10>` mean 10°C.
- Kernel 4.19 uses one-field ntc_degree_from_v2: `ntc_degree_from_v2 = <(-10)>` means -10°C and `<10>` means 10°C.

**temperature_chrg_table / temperature_chrg_table_v2:** one or more temperature/charging-current ranges. Outside the ranges, use max_input_current and max_chrg_current. Remove if unused. This feature was added later: verify that the actual driver parses the property.

Kernel 4.4 uses temperature_chrg_table, RK818 only. Format: `temperature_chrg_table = <parameter1 parameter2 parameter3 parameter4>, ...`. Parameter1: sign (1 negative, 0 positive); parameter2: temperature magnitude; parameter3: charging current; parameter4: temperature offset. The source says a positive parameter3 offsets upward and a negative parameter3 downward (see source discrepancy note). Example `temperature_chrg_table = <0 10 1000 2>, <1 30 1400 5>;`: `<0 10 1000 2>` gives [10, 12] at 1000mA; `<1 30 1400 5>` gives [-35, -30] at 1400mA.

Kernel 4.19 uses temperature_chrg_table_v2 for RK818/RK816. Format: `<parameter1 parameter2 parameter3>`, with lower temperature, upper temperature and charging current. Example `temperature_chrg_table_v2 = <(-40) 10 850>, <22 33 1000>, <40 55 1400>;`: [-40, 10] → 850mA; [22, 33] → 1000mA; [40, 55] → 1400mA.

**design_capacity:** measured usable battery capacity. For a nominal 4000mah battery measuring only 3850mah, enter 3850.

**design_qmax:** maximum capacity, used as a software error-correction condition. Set to nominal capacity ×1.1.

**bat_res:** battery internal resistance, stated by the source in ohms. Important in the discharge algorithm; measure it together with ocv_table and do not omit it.

**max_input_current:** maximum input current, with these steps (mA):

```text
RK818: <450, 80, 850, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000>
RK816: <450, 80, 850, 1000, 1250, 1500, 1750, 2000>
```

The second step is 80, not 800! The 80mA step is generally not selected in ordinary use.

**max_chrg_current:** maximum charging current, steps (mA):

```text
RK818: <1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400, 2600, 2800, 3000>
RK816: <1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400>
```

**max_chrg_voltage:** maximum charging voltage, the full-charge termination voltage. Steps (mV):

```text
RK818: <4050, 4100, 4150, 4200, 4250, 4300, 4350>
RK816: <4050, 4100, 4150, 4200, 4250, 4300, 4350>
```

**sleep_enter_current:** one relax-mode entry condition; currently 300, do not change.

**sleep_exit_current:** one exit condition; currently 300, do not change.

**sleep_filter_current:** filters invalid relax current; currently 100, do not change.

**power_off_thresd — read carefully:** desired shutdown voltage in mV. This is instantaneous VSYS voltage, not vbat voltage, although the gauge samples vbat! Vbat passes through a roughly 50-milliohm MOS transistor plus PCB-trace resistance before becoming VSYS for the system, so VSYS is the shutdown reference. At the same vbat, greater load current means lower VSYS; at the same VSYS, greater load current requires higher vbat. Rockchip does not recommend VSYS below 3.4v because downstream VCC_IO may become unstable (normally 3.3v). If the hardware’s highest downstream VSYS-derived rail is 3.0v, shutdown may be below 3.4v.

**zero_algorithm_vol:** threshold in mV for combined voltage-plus-coulomb-counter discharge mode; below it the software uses both. Recommendation in the source: 3850mv for 4.2v batteries, 3950mv for 4.3v and higher batteries.

**energy_mode:**

Some users prioritize a smooth curve, others complete discharge; balancing them is difficult. Set 1 to favor using all charge, 0 to favor curve smoothness (e.g. a configured 3.4v shutdown may sometimes occur at 3.5v). The driver already balances smoothness and shutdown voltage, so 0 is recommended. If testing shows an unacceptable shutdown threshold, try 1 or contact the driver maintainer for optimization.

**fb_temperature:** chip thermal-protection threshold, four steps (°C):

```text
< 85, 95, 105, 115>
```

The source selects 115 for VR and 105 elsewhere. Setting 0 disables thermal feedback and is mentioned only for fault isolation (source cross-reference “1.5 Common problem analysis”). Thermal feedback must never be disabled in normal use.

**sample_res — read carefully:** battery-side sense resistance, in milliohms. The coulomb counter derives current from this resistor; enter the actual fitted value. Only 20mR (default) and 10mR (driver support required) are supported. Kernel 4.4/4.19 RK818/RK816 drivers support both. Kernel 3.10 requires these commits:

```text
fdc31b1 power: rk818-battery: support different ohm sample resistor
0f23c4b power: rk816-battery: support different ohm sample resistor
```

The default is usually 20mR. Using 10mR doubles the range supported by max_chrg_current:

```text
// rk816
10mR: [2000, 2400, 2800, 3200, 3600, 4000, 4500, 4800]
20mR: [1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400]
// rk818
10mR: [2000, 2400, 2800, 3200, 3600, 4000, 4500, 4800, 5200, 5600, 6000]
20mR: [1000, 1200, 1400, 1600, 1800, 2000, 2250, 2400, 2600, 2800, 3000]
```

Even when the range doubles, configure max_chrg_current for the actual requirement: for 4000mA enter 4000. A 10mR resistor doubles the charging-current range but also doubles current/charge (mAh) measurement error. Doubled currents are theoretical; some are unattainable because of power conversion. For a 5V/2A charger:

```text
5V * 2A = U_bat * I_bat
```

At minimum U_bat=3.4v, maximum I_bat is 2.94A, attainable only with no losses and all current allocated to the battery. In reality the adapter supplies the system first and only the remainder charges; battery saturation must also be considered.

**max_soc_offset:**

Maximum allowed charge discrepancy at boot correction. After at least 30 minutes off, boot queries OCV and compares charge with the previous shutdown value. If discrepancy exceeds max_soc_offset, force the displayed charge to the OCV-derived value. For example, displayed 20% becomes 80% if OCV implies 80%. Large discrepancies often follow crashes. Choose based on acceptable behavior; values below 60 are not recommended.

**monitor_sec:** polling interval in seconds. The gauge requires continuous polling and many I2C accesses; because I2C robustness differs across platforms, this is configurable. Recommended 5–10s, preferably 5s.

**virtual_power:** fake-battery test mode. A batteryless product may use a 5V/2A adapter, but the gauge integrates current over time, not just voltage. Even with constant 5V input the displayed charge can decline to 0%. During stress tests one may want to avoid shutdown or supply issues from charge/current limits. Set 1 to release charging-current restrictions and keep system input at max_input_current; Android is always told it is charging at 66%.

**power_dc2otg:** allow OTG 5v directly from DC. On dual-port hardware supporting this path, DC supplies OTG instead of RK818’s additional 5v output. Set 1 if supported, otherwise 0, including without a DC port.

**dc_det_gpio:** GPIO for the DC-detect pin; remove if unused.

**dc_det_adc:** SARADC-based DC detection, 1 enabled, 0 disabled. Normally choose this or dc_det_gpio, not both; only RK816 uses it.

### 5.5 Important cautions

**Battery charging cannot be completely disabled.** RK818/RK816 CHRG_CTRL_REG1[7]:CHRG_EN nominally enables/disables charging, but this hardware function has a problem and cannot be used normally. Developers must never configure 0, or inadequate supply may cause instability. Source workarounds: RK818 — set input current to 80mA to minimize charging, without eliminating the issue; RK816 — set 80mA, or configure BAT_CTRL_REG[6]:USB_SYS_EN=0 to disable adapter input entirely.

Different kernels use different DTS properties: ntc_degree_from, ntc_degree_from_v2, temperature_chrg_table, temperature_chrg_table_v2.

Temperature/current policy (only where temperature_chrg_table_v2 is supported):

1. With ntc_table configured, a battery temperature above/below its limits caps input current at 80mA. CHRG_EN cannot disable charging, so this only minimizes it.

2. With temperature_chrg_table or temperature_chrg_table_v2, configure charging current by range. If below the lowest supported PMIC step, limit maximum input current instead. Outside temperature-limited ranges, configure according to max_input_current, max_chrg_current and adapter type.

3. Temperature requirements vary; users may modify the driver for their requirements.

## 6. Fuel-gauge development

### 6.1 Preparation

1. Measure the battery OCV curve and internal resistance. Each battery has its own voltage/charge curve (ocv_table) and resistance; the source says Rockchip Shenzhen can measure these.

2. Populate DTS parameters using the preceding sections.

3. Calibrate the battery as described in the relevant sections.

4. Begin normal use.

### 6.2 Problem handling

1. On an abnormality, immediately enable debugging and capture the incident log, then analyze it.

2. For charging/discharging curve issues such as jumps or excessive/sluggish changes, capture a complete charge/discharge log (0%–100% or 100%–0%; cover as large a range as possible).

3. If you cannot identify the cause, capture the incident or reproduction log and file it in Redmine.

Enable fuel-gauge debug output before capturing logs! For common issues, see “Common problem analysis”.

## 7. Battery calibration

### 7.1 Battery-calibration principles

1. Shutdown disables the PMIC’s DCDC/LDO rails but does not remove all PMIC power; it remains active at very low load. Spare data registers store the last shutdown’s charge, coulomb-counter capacity and full-charge capacity (design_capacity). On boot, gauge initialization reads and reuses these retained values rather than replacing them from DTS.

2. Correcting those three values requires complete PMIC power removal to clear the data. At the next power-up GGSTS_REG[4] (“first power-on”) is set. Disconnecting the battery achieves this.

3. Reconnecting the battery makes the driver detect first power-on, reload related DTS data and recalculate capacity/charge, yielding the calibrated initial state.

4. Before reconnecting, ensure polarization has largely dissipated; let the disconnected battery rest if needed. Removing it under heavy discharge leaves polarization, and voltage slowly recovers. Immediate reconnection samples inaccurate OCV. Calibration requires a substantially depolarized battery so first-boot OCV and charge are accurate.

### 7.2 Battery-calibration methods

Choose one of two calibration methods. Hardware: remove the battery for about 10s, then reconnect. Software: perform the following through the serial console.

1. Locate the bat node: `busybox find /sys/ -name bat`, e.g. `/sys/rk818/bat`. For RK816 use `/sys/rk816/bat` throughout.

2. Execute: `echo m > /sys/rk818/bat`.

3. Read back: `echo r > /sys/rk818/bat`; returned BIT(4) must be 1 (RK816: BIT(1) must be 1).

4. Shut down normally and wait at least 30 minutes before booting for accurate OCV. To clear step 2, execute `echo c > /sys/rk818/bat`.

### 7.3 When calibration is needed

1. When the battery capacity configured in DTS changes.

2. When charge is clearly inaccurate, e.g. after crashes or special stress tests unrelated to the gauge.

3. Once before the complete fuel-gauge stress-test campaign, so testing starts from an accurate state. Calibrate at the beginning of all tests, not before each case.

## 8. Common problem analysis

1. How to enable debug and capture logs? Before compilation, change the driver’s first-line `static int dbg_enable = 0` to 1. Alternatively toggle at runtime over serial: enable `echo 1 > /sys/module/rk818_battery/parameters/dbg_level`; disable `echo 0 > /sys/module/rk818_battery/parameters/dbg_level`. For RK816 use `/sys/module/rk816_battery/parameters/dbg_level`.

2. Why does the system immediately reboot after shutdown with adapter/USB connected? The PMIC is designed not to remain shut down while a charger is connected.

3. Why does GGSTS[4] battery-present status disagree after hot-plugging a battery while running? The PMIC does not support battery hot-plug detection; it checks only once at power-up.

4. Why shut down at a voltage higher than the DTS setting? Use the final live log voltage, referring to VSYS. The aim is to keep instantaneous voltage above the configured threshold. After shutdown removes load, lithium-battery polarization fades and voltage recovers; this is a battery characteristic.

5. Why does charge barely change while voltage falls in power-cycle, reboot or second-level-standby stress tests? The driver cannot poll normally in these conditions, so these tests are unsupported for gauge evaluation. The source says quality/customer fuel-gauge tests need not include these three cases.

6. Why is charging current always low with battery and charger connected? (a) Check whether a poor, high-resistance cable leaves VBUS far below 5v. The source proposes a regulated external supply and a cautious voltage increase to observe current. (b) Turn the screen off (first-level standby) and check whether current rises, indicating runtime power consumption. (c) A nearly full battery naturally takes low current; check voltage. (d) High temperature/heavy load may cause PMIC input limiting. The source suggests raising fb_temperature for diagnosis, then temporarily setting fb_temperature=0 if necessary. This is source troubleshooting, not authorization to disable normal thermal protection.

7. Why does charge change after removing the battery and restarting? Can removal leave the display unchanged? (a) Full PMIC power loss leaves OCV lookup as the only way to infer charge; this normal behavior recalibrates the battery. (b) Avoiding a jump is nearly impossible without a software workaround: save pre-shutdown charge to a file and reload it at power-up. Customers needing this must add that code.

8. How to read internal PMIC temperature while thermal feedback adjusts current? It cannot be read; the design does not expose that function.

9. Why are logged current sign or magnitude implausible? Verify a sufficiently accurate 20/10-milliohm sense resistor and clean solder joints. The resistor belongs between BAT- and GND.

10. Why report finish before full charge, e.g. at 3.9v? Usually poor battery quality together with excessive configured charging current triggers battery-board protection, making the PMIC falsely report finish.

11. Why does a small current alternate positive/negative in finish state? This is current zero-point error after full charge; the source considers it harmless.

12. Why does finish arrive while displayed charge is only above 90%, not 100%? Coulomb counting accumulates error, while hardware terminates charging independently; exact agreement is not possible. This is normal. Software gradually moves the display toward 100%, imperceptibly to the end user, without affecting use.

13. Why does runtime charge disagree greatly with ocv_table?

This confuses concepts: ocv_table maps voltage/charge at open circuit without load and is used only at boot and sleep correction. Comparing it directly to loaded operation is meaningless in principle.

14. Can a battery of different specifications be substituted? Not without remeasuring and configuring OCV curve, resistance, capacity and other parameters for the new battery.

15. What makes the PMIC decide charging is complete? All three: termination voltage reached, finish current reached, and no input-current limiting.

16. Why always show 50% charging? Disable the test_power driver.

17. Why always show 66% charging? No battery is connected, or DTS virtual_power is 1; configure 0.

18. Why are charger connection/removal events not recognized? (a) Kernel 4.4: rk818_charger.c detects chargers; USB charger/OTG events depend on the USB notifier chain. Look for serial logs such as "rk818-charger: recieve xxx notifier event: xxx". If absent, registration may have failed (unlikely), or the USB driver has a problem. (b) Kernel 3.10: rk818_battery.c handles both charger detection and charge. USB charger/OTG events also depend on the notifier chain. Look for "rk818-bat: recieve xxx notifier event: xxx"; absence likewise suggests registration failure (unlikely) or a USB-driver problem.

{% endraw %}
