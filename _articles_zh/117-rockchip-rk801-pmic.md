---
title: "Rockchip RK801 PMIC 开发指南：电源、DTS 与寄存器调试"
description: "Rockchip RK801 PMIC 开发指南：电源、DTS 与寄存器调试 — V1.1.0"
excerpt: "Rockchip RK801 PMIC 开发指南：电源、DTS 与寄存器调试 — V1.1.0"
translation_key: "117-rockchip-rk801-pmic"
slug: "117-rockchip-rk801-pmic"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK801", "PMIC", "Linux"]
---

{% raw %}

平台参考，原稿 RK-KF-YF-C57 V1.1.0，RK801 / Linux 6.1。介绍子模块、概念、功能、DTS 配置及常见问题定位。具体 ArmSoM 板卡须确认 PMIC 型号、SoC、SDK/BSP、内核、供电和引脚连线；不表示所有板卡适用。示例未经 ArmSoM 硬件验证。中文使用中文原图，英文/俄文/德文使用英文原图。调试命令仅展示，未执行硬件操作。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.4 -->

## 1. 基础

<!-- cn PDF p.4 -->

### 1.1 概述

<!-- cn PDF p.4 -->

RK801 是一款高性能 PMIC,RK801 集成 4 个大电流 DCDC、2 个 LDO、1 个开关SWITCH、1 个PWRON、可调上电时序等功能。系统中各路电源总体分为两种:DCDC 和 LDO。两种电源的总体特性如下(详细资料请自行搜索):

<!-- cn PDF p.4 -->

1. DCDC:输入输出压差大时,效率高,但是存在纹波比较大的问题,成本高,所以大压差,大电流负载时使用。一般有两种工作模式。PWM 模式:纹波瞬态响应好,效率低;PFM 模式:效率高,但是负载能力差。

<!-- cn PDF p.4 -->

2. LDO:输入输出压差大时,效率低,成本低,为了提高 LDO 的转换效率,系统上会进行相关优化如:LDO 输出电压为 1.1V,为了提高效率,其输入电压可以从 VCCIO_3.3V 的 DCDC 给出。所以电路上如果允许尽量将LDO 接到 DCDC 输出回路,但是要注意上电时序。

<!-- cn PDF p.4 -->

### 1.2 芯片功能

<!-- cn PDF p.4 -->

从使用者的⻆度看,RK801 的功能概况起来可以分为 2 个部分:

<!-- cn PDF p.4 -->

1. regulator 功能:控制各路 DCDC、LDO 电源状态;

<!-- cn PDF p.4 -->

2. pwrkey 功能:检测 power 按键的按下/释放,可以为 AP 节省一个 gpio。

<!-- cn PDF p.5 -->

### 1.3 芯片引脚

<!-- cn PDF p.5 -->

![中文原图 — p.5](/docs/rockchip-rk801-pmic/assets/cn-p005-figure-01.png)

*中文原图 — p.5*

<!-- cn PDF p.5 -->

下面描述中,PWRCTRL 和 INT 引脚需要重点关注:

<!-- cn PDF p.6 -->

![中文原图 — p.6](/docs/rockchip-rk801-pmic/assets/cn-p006-figure-01.png)

*中文原图 — p.6*

<!-- cn PDF p.6 -->

![中文原图 — p.6](/docs/rockchip-rk801-pmic/assets/cn-p006-figure-02.png)

*中文原图 — p.6*

<!-- cn PDF p.6 -->

引脚定义（由上述原图逐行转录；保留原稿名称和 I/O 标记）

| 引脚号 | 引脚名 | 描述 |
| --- | --- | --- |
| 1 | VCC4 | BUCK4 电源 |
| 2 | SCL | I2C 时钟输入（开漏输出） |
| 3 | SDA | I2C 数据输入输出（开漏输出） |
| 4 | RESETB | 上电后的复位引脚，低电平有效 |
| 5 | VCCA | inner circuit 电源 |
| 6 | BST2 | 高压 BUCK2 自举电容 |
| 7 | INT | 中断请求引脚（开漏输出） |
| 8 | SW2 | high voltage BUCK2 开关节点 |
| 9 | VCCH2 | high voltage BUCK2 电源 |
| 10 | VOUT2 | high voltage BUCK2 输出反馈电压 |
| 11 | PWRCTLR | PWRCTLR 控制输入 |
| 12 | VOUT1 | high voltage BUCK1 输出反馈电压 |
| 13 | VCCH1 | high voltage BUCK1 电源 |
| 14 | SW1 | high voltage BUCK1 开关节点 |
| 15 | BST1 | 高压 BUCK1 自举电容 |
| 16 | LDO2 | LDO2 输出 |
| 17 | VCC6 | LDO2 电源 |
| 18 | VCC5 | LDO1 电源 |
| 19 | LDO1 | LDO1 输出 |
| 20 | VDC | VDC 输入 |
| 21 | VCC3 | BUCK3 电源 |
| 22 | SW3 | BUCK3 开关节点 |
| 23 | VFB3 | BUCK3 输出反馈电压 |
| 24 | VSW | SWITCH 输出 |
| 25 | PWRON | 开机键输入，低电平有效，内部 22k 电阻上拉至 VCCA |
| 26 | VCC7 | SWITCH 电源 |
| 27 | VOUT4 | BUCK4 输出反馈电压 |
| 28 | SW4 | BUCK4 开关节点 |
| Exposed pad | Exposed ground | 地 |

### 1.4 重要概念

<!-- cn PDF p.6 -->

I2C 地址：7 位从机地址 0x27。PMIC 有 3 种工作模式。

<!-- cn PDF p.6 -->

1. PMIC normal 模式系统正常运行时 PMIC 处于 normal 模式,此时 pmic_pwrctrl 为低电平。

<!-- cn PDF p.6 -->

2. PMIC sleep 模式系统休眠时需要待机功耗尽量低,PMIC 会切到 sleep 模式减低自身功耗,这时候一般会降低某些路的输出电压,或者直接关闭输出,这可以根据实际产品需求进行配置。系统待机时 AP 通过 I2C 指令把pmic_pwrctrl 配置成 sleep 模式,然后拉高 pmic_pwrctrl 即可让 PMIC 进入 sleep 状态;当 SoC 唤醒时 pmic_pwrctrl 恢复为低电平,PMIC 退出休眠模式。

<!-- cn PDF p.7 -->

3. PMIC shutdown 模式当系统进入关机流程的时候,PMIC 需要完成整个系统的电源下电操作。AP 通过 I2C 指令把pmic_pwrctrl 配置成 shutdown 模式,然后拉高 pmic_pwrctrl 即可让 PMIC 进入 shutdown 状态。目前驱动会根据dts配置和场景自动切换上述的各种模式,用戶可以不关心。pmic_pwrctrl 引脚常态为低电平,PMIC 处于 normal 模式。当引脚拉高的时候会切换到 sleep 或者 shutdown 的模式。pmic_int 引脚常态为高电平,当有中断产生的时候变为低电平。如果中断没有被处理,则会一直维持低电平。pmic_pwron 引脚pwrkey 的功能需要硬件上将 power 按键接到这个引脚,驱动通过这个引脚来判断按下/释放。各路 DCDC 的工作模式DCDC 有 PWM(也叫 force PWM)、PFM 模式,但是 PMIC 有一种模式会动态切换 PWM、PFM,这就是我们通常所说的 AUTO 模式。PMIC 支持 PWM、AUTO PWM/PFM 两种模式,AUTO 模式效率高但是纹波瞬态响应会差。出于系统稳定性考虑,运行时都是设置为 PWM 模式,系统进入休眠时会选择切换到 AUTOPWM/PFM。DCDC3 电压调节DCDC3 这路电源比较特殊,不能通过寄存器修改电压,只能通过外部电路的分压电阻进行调节,所以如果需要修改电压请修改外围硬件,在 Rockchip 的方案上一般作为 VCC_DDR 使用。DCDC 和 LDO 的运行时电压调节范围DCDC 电压范围不连续(⻅注释或datasheet):

<!-- cn PDF p.7 -->

```text
// BUCK1
static const struct linear_range rk801_buck1_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5v - 1.5v, 步进12.5mV */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8v - 2.2v */
   REGULATOR_LINEAR_RANGE(3300000, 83, 83, 0), /* 3.3v */
   REGULATOR_LINEAR_RANGE(5000000, 84, 84, 0), /* 5.0v */
   REGULATOR_LINEAR_RANGE(5250000, 85, 85, 0), /* 5.25v */
};

// BUCK2
static const struct linear_range rk801_buck2_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(800000,  0, 2, 50000),   /* 0.8v - 0.9v */
   REGULATOR_LINEAR_RANGE(1800000, 3, 4, 400000),  /* 1.8v - 2.2v */
   REGULATOR_LINEAR_RANGE(3300000, 5, 5, 0),   /* 3.3v */
   REGULATOR_LINEAR_RANGE(5000000, 6, 6, 0),   /* 5.0v */
   REGULATOR_LINEAR_RANGE(5250000, 7, 7, 0),   /* 5.25v */
};

// BUCK4
static const struct linear_range rk801_buck4_voltage_ranges[] = {
   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5v - 1.5v */
   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8v - 2.2v */
   REGULATOR_LINEAR_RANGE(2500000, 83, 83, 0), /* 2.5v */
   REGULATOR_LINEAR_RANGE(2800000, 84, 84, 0), /* 2.8v */
   REGULATOR_LINEAR_RANGE(3000000, 85, 85, 0), /* 3.0v */
   REGULATOR_LINEAR_RANGE(3300000, 86, 86, 0), /* 3.3v */
};
```

<!-- cn PDF p.8 -->

LDO 电压连续:

<!-- cn PDF p.8 -->

| 电压范围(V) | 步进(mV) |
| --- | --- |
| 0.5 ~ 3.4 | 50 |

<!-- cn PDF p.8 -->

### 1.5 上电条件和时序

<!-- cn PDF p.8 -->

1. 上电条件只要满足下面任意一个条件即可以实现 PMIC 上电:VDC 引脚为高电平下电状态下按 PWRON 键触发

<!-- cn PDF p.8 -->

2. 上电时序每款 SOC 平台对各路电源上电时序要求可能不一样,目前上电时序有如下情况,具体请参考最新的datasheet。

<!-- cn PDF p.8 -->

## 2. 配置

<!-- cn PDF p.8 -->

### 2.1 驱动和 menuconfig

<!-- cn PDF p.8 -->

驱动文件:

<!-- cn PDF p.8 -->

```text
drivers/mfd/rk808.c
drivers/regulator/rk801-regulator.c
drivers/input/misc/rk805-pwrkey.c
```

<!-- cn PDF p.8 -->

menuconfig 配置:

<!-- cn PDF p.8 -->

```text
CONFIG_MFD_RK808
CONFIG_REGULATOR_RK801
CONFIG_INPUT_RK805_PWRKEY
```

<!-- cn PDF p.8 -->

### 2.2 驱动版本

<!-- cn PDF p.8 -->

请至少更新到如下版本确保驱动功能的完整性和稳定性。drivers/mfd/rk808.c:

<!-- cn PDF p.9 -->

```text
commit 0439f30ead1393813d69a01587530652908c9171
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Fri Jun 13 17:19:25 2025 +0800

    mfd: rk808: Print full chip id of rk801

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I195858d23c862d0f961acb4c04bb1102ab9954c9
```

<!-- cn PDF p.9 -->

drivers/regulator/rk801-regulator.c:

<!-- cn PDF p.9 -->

```text
commit 1a81f4f6344f7cd4203be508150daeedc00fbedb
Author: Joseph Chen <chenjh@rock-chips.com>
Date:   Thu May 29 11:39:58 2025 +0800

    mfd: rk801: Add support for pwrctrl active pol set and reboot rst

    - Don't require pwrctrl dvs if hw compatible version >= 3.
    - Auto parse pwrctrl active pol from GPIO_ACTIVE_{HIGH,LOW} flag.
    - Reset pmic and soc when system reboot if required.

    Signed-off-by: Joseph Chen <chenjh@rock-chips.com>
    Change-Id: I29e60c2a717cee5c9d1e3c6e46ee687352d4a1be
```

<!-- cn PDF p.9 -->

### 2.3 DTS 配置

<!-- cn PDF p.9 -->

DTS 的配置包括:I2C 挂载、主体、regulator等部分。如下以 arch/arm/boot/dts/rk3506-rk801.dts 为例。硬件设计:

<!-- cn PDF p.9 -->

![中文原图 — p.9](/docs/rockchip-rk801-pmic/assets/cn-p009-figure-01.png)

*中文原图 — p.9*

<!-- cn PDF p.9 -->

DTS配置:

<!-- cn PDF p.9 -->

```text
&i2c0 {
    status = "okay";
    ......

    rk801: rk801@27 {
        // 不可修改。
        compatible = "rockchip,rk801";
        status = "okay";
        reg = <0x27>;

        // PMIC_INT 引脚配置。此处是GPIO0_C2、低电平有效。
        interrupt-parent = <&gpio0>;
        interrupts = <RK_PC2 IRQ_TYPE_LEVEL_LOW>;

        // PWRCTRL 引脚配置。此处是GPIO0_C1、⾼电平有效。
        pwrctrl-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;

        // Pinctrl 配置。
        pinctrl-names = "default", "pmic-reset";
        // 初始化pmic_int脚状态。
        pinctrl-0 = <&pmic_int>;
        // 设置reboot时pwrctrl的状态。这样配置后，pmic会跟随SoC⼀起复位⾃⼰的各路电压。
        pinctrl-1 = <&soc_pwrctrl_reset>;

        // 不可修改。声明RK801具备管理系统下电的功能。
        rockchip,system-power-controller;

        // 不可修改。声明PMIC_INT作为唤醒源。
        wakeup-source;

        // 各路regulator的输⼊源。
        // vcc1~7分别对应：BUCK1/2/3/4, LDO1/2, SWTICH。
        vcc1-supply = <&vcc12v_dc>;
        vcc2-supply = <&vcc12v_dc>;
        vcc3-supply = <&vcc5v0_sys>;
        vcc4-supply = <&vcc5v0_sys>;
        vcc5-supply = <&vcc3v3_sys>;
        vcc6-supply = <&vcc3v3_sys>;
        vcc7-supply = <&vcc3v3_sys>;

        regulators {
            vcc3v3_sys: DCDC_REG1 {
                regulator-name = "vcc3v3_sys";
                regulator-min-microvolt = <3300000>;
                regulator-max-microvolt = <3300000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <3300000>;
                };
            };

            vcc5v0_sys: DCDC_REG2 {
                regulator-name = "vcc5v0_sys";
                regulator-min-microvolt = <5000000>;
                regulator-max-microvolt = <5000000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <5000000>;
                };
            };

            vcc_ddr: DCDC_REG3 {
                regulator-name = "vcc_ddr";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-on-in-suspend;
                };
            };

            vdd_cpu: DCDC_REG4 {
                regulator-name = "vdd_cpu";
                regulator-min-microvolt = <500000>;
                regulator-max-microvolt = <1500000>;
                regulator-initial-mode = <0x1>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-mode = <0x2>;
                    regulator-off-in-suspend;
                };
            };

            vdd0v9_sys: LDO_REG1 {
                regulator-name = "vdd0v9_sys";
                regulator-min-microvolt = <900000>;
                regulator-max-microvolt = <900000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <900000>;
                };
            };

            vcc_1v8: LDO_REG2 {
                regulator-name = "vcc_1v8";
                regulator-min-microvolt = <1800000>;
                regulator-max-microvolt = <1800000>;
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                    regulator-suspend-microvolt = <1800000>;
                };
            };

            vcc_3v3: SWITCH_REG {
                regulator-name = "vcc_3v3";
                regulator-boot-on;
                regulator-always-on;
                regulator-state-mem {
                    regulator-on-in-suspend;
                };
            };
        };
    };
};

&pinctrl {
    ......

    pmic {
        // pmic_int设置常态为⾼电平，即低电平有效。
        pmic_int: pmic-int {
            rockchip,pins = <0 RK_PC2 RK_FUNC_GPIO &pcfg_pull_up>;
        };

        // 系统复位时pwrctrl引脚应该保持的电平状态，必须跟SoC上电默认状态相反。
        // ⽐如：默认上电是down, 则配置为output hight；反之则为output low。
        soc_pwrctrl_reset: soc-pwrctrl-reset {
            rockchip,pins = <0 RK_PC1 RK_FUNC_GPIO &pcfg_output_high>;
        };
    };
};
```

<!-- cn PDF p.12 -->

regulator 配置项：

- regulator-compatible：驱动注册时需要匹配的名字，不能改动，否则加载失败。
- regulator-name：电源名称，建议与原理图一致，regulator_get 接口需要匹配。
- regulator-init-microvolt：u-boot 阶段初始化电压，kernel 阶段无效。
- regulator-min-microvolt / regulator-max-microvolt：运行时允许调节的最低/最高电压。
- regulator-initial-mode：运行时 DCDC 模式，通常为 1；1 为 force pwm，2 为 auto pwm/pfm。
- regulator-mode：休眠时 DCDC 模式，通常为 2；数值含义同上。
- regulator-boot-on：注册 regulator 时使能电源。
- regulator-always-on：运行时不允许关闭，并在注册时使能。
- regulator-on-in-suspend：休眠保持供电；要关闭则改成 regulator-off-in-suspend。
- regulator-suspend-microvolt：休眠不断电时的待机电压。

<!-- cn PDF p.12 -->

说明:如果 regulator-min-microvolt 和 regulator-max-microvolt 的电压相等,则在注册这个 regulator 的时候系统框架默认会把这个电压设置下去并使能这路电源,不需要使用者干预。

<!-- cn PDF p.13 -->

如果存在 regulator-boot-on 或 regulator-always-on，系统框架注册时默认使能电源。如果 regulator-min-microvolt 与 regulator-max-microvolt 相等，则设为该电压；如果不相等，则采用 PMIC 硬件默认上电电压。

<!-- cn PDF p.13 -->

pwrkey 配置项：rk801 节点下没有 pwrkey 节点等效于使能。确定要关闭时，手动添加节点并指定 status = "disabled"。

<!-- cn PDF p.13 -->

```text
rk801: rk801@27 {

    ......

    pwrkey {
        status = "disabled";
    };
};
```

<!-- cn PDF p.13 -->

### 2.4 函数接口

<!-- cn PDF p.13 -->

如下几个接口基本可以满足日常使用,包括 regulator 开、关、电压设置、电压获取等:

<!-- cn PDF p.13 -->

1. 获取 regulator:struct regulator *regulator_get(struct device *dev, const char *id)dev 默认填写 NULL 即可,id 对应 dts 里的 regulator-name 属性。

<!-- cn PDF p.13 -->

2. 释放 regulatorvoid regulator_put(struct regulator *regulator)

<!-- cn PDF p.13 -->

3. 打开 regulatorint regulator_enable(struct regulator *regulator)

<!-- cn PDF p.13 -->

4. 关闭 regulatorint regulator_disable(struct regulator *regulator)

<!-- cn PDF p.13 -->

5. 获取 regulator 电压int regulator_get_voltage(struct regulator *regulator)

<!-- cn PDF p.13 -->

6. 设置 regulator 电压int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)传入的参数时保证 min_uV = max_uV,由调用者保证。

<!-- cn PDF p.13 -->

7. 范例

<!-- cn PDF p.14 -->

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

<!-- cn PDF p.14 -->

说明：4.4 和更高版本内核还提供以 devm_ 开头的 regulator 接口，帮助开发者管理申请的资源。

<!-- cn PDF p.14 -->

## 3. 调试

<!-- cn PDF p.14 -->

PMIC 驱动使用逻辑不复杂，重点是最终寄存器配置。可使用内核自带 i2cdump 命令或以下方法。节点：/sys/rk8xx/rk8xx_dbg。

<!-- cn PDF p.14 -->

```text
# 读寄存器
echo r [addr]  > /sys/rk8xx/rk8xx_dbg
# 写寄存器
echo w [addr] [value] > /sys/rk8xx/rk8xx_dbg
```

<!-- cn PDF p.14 -->

使用范例:

<!-- cn PDF p.14 -->

```text
echo r 0x2f > /sys/rk8xx/rk8xx_dbg          # 读取0x2f寄存器的值
echo w 0x2f 0x9c > /sys/rk8xx/rk8xx_dbg     # 设置0x2f寄存器的值为0x9c
```

<!-- cn PDF p.14 -->

建议写操作执行完之后最好再读一遍确认是否写成功。

校对注：引脚表使用 PWRCTLR，正文使用 PWRCTRL；保留原稿写法，适配前核对硬件资料。

{% endraw %}
