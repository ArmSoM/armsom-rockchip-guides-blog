---
title: "Rockchip RK818 PMIC 完整开发指南：引脚、电源时序、DTS与调试"
description: "Rockchip RK818 PMIC 完整开发指南：引脚、电源时序、DTS与调试 — V1.0.1"
excerpt: "Rockchip RK818 PMIC 完整开发指南：引脚、电源时序、DTS与调试 — V1.0.1"
translation_key: 124-rockchip-rk818-pmic
slug: 124-rockchip-rk818-pmic
lang: zh
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Rockchip RK818 PMIC 完整开发指南：引脚、电源时序、DTS与调试

中文原稿 V1.0.1，内核范围 3.10 / 4.4 / 4.19。保留技术前言涉及的模块概念、功能、配置和问题定位。本次无英文 PDF，四语均以中文稿完整整理，已有技术图均使用中文 PDF 原图。仅作 ArmSoM 平台参考：须核对具体板卡的 PMIC、SoC、SDK/BSP、内核、电源树及电池规格；未进行硬件测试，不宣称全部板卡支持。

> 以下代码、参数、日志均为原厂示例，未经ArmSoM实测。改变电源、充电电流、电压或温控可导致掉电、损坏或电池危险；不应直接套用示例，正常使用不得关闭温控保护。保留原稿疑点，不擅改常量，详见本篇校对记录。 原稿HDIM5V写法、0.737.5档位、RK808关机说明及ramp-delay值均保留待核对。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. 基础

### 1.1 概述

RK818 是一款高性能 PMIC,RK818 集成 4 个大电流 DCDC、1个大电流升压BOOST、9 个 LDO、1个SWITCH、一个HDIM5V输出、一个OTG输出、1 个 RTC、可调上电时序,而且还集成了开关充电,智能功率路径管理,库仑计等功能。

系统中各路电源总体分为两种:DCDC 和 LDO。

两种电源的总体特性如下(详细资料请自行搜索):

1. DCDC:输入输出压差大时,效率高,但是存在纹波比较大的问题,成本高,所以大压差,大电流负载时使用。

一般有两种工作模式。

PWM 模式:纹波瞬态响应好,效率低;PFM 模式:效率高,但是负载能力差。



2. LDO:输入输出压差大时,效率低,成本低,为了提高 LDO 的转换效率,系统上会进行相关优化如:LDO 输出电压为 1.1V,为了提高效率,其输入电压可以从 VCCIO_3.3V 的 DCDC 给出。

所以电路上如果允许尽量将 LDO 接到 DCDC 输出回路,但是要注意上电时序。



### 1.2 功能

从使用者的⻆度看,RK818 的功能概况起来可以分为 4 个部分:

1. regulator 功能:控制各路 DCDC、LDO 电源状态;

2. rtc 功能:提供时钟计时、定时等功能;

3. clk 功能:有两个32.768KHZ时钟输出,一个不可以控常开,一个是软件可控。



4. 充电功能和电量计功能,在本文中不做详细介绍,详细可以参考文档《Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN》

### 1.3 芯片引脚功能

![中文PDF原图 · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-01.png)

*中文PDF原图 · p5*

下面描述中,SLEEP 和 INT 引脚需要重点关注:

![中文PDF原图 · p5](/docs/rockchip-rk818-pmic/assets/cn-p005-figure-02.png)

*中文PDF原图 · p5*

![中文PDF原图 · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-01.png)

*中文PDF原图 · p6*

![中文PDF原图 · p6](/docs/rockchip-rk818-pmic/assets/cn-p006-figure-02.png)

*中文PDF原图 · p6*

![中文PDF原图 · p7](/docs/rockchip-rk818-pmic/assets/cn-p007-figure-01.png)

*中文PDF原图 · p7*

以下为上方原图的可编辑转录。

| 引脚号 | 名称 | 描述 |
| --- | --- | --- |
| 1 | INT | 中断请求，低有效 |
| 2 | SLEEP | 睡眠/非睡眠状态切换输入 |
| 3 | H_5V | HDMI的5v供电输出 |
| 4 | GND5 | 电源地 |
| 5 | SW5 | 开关输出 |
| 6,7 | BOOST | BOOST输出 |
| 8,9 | USB | USB电源输入 |
| 10 | MIDU | USB电源中间节点 |
| 11,12 | SW6 | 开关输出 |
| 13 | GND6 | 电源地 |
| 14 | VLDO1 | LDO1输出 |
| 15 | VCC6 | LDO电源 |
| 16 | VLDO2 | LDO2输出 |
| 17 | XIN | 32.768KHz晶体振荡器输入 |
| 18 | XOUT | 32.768KHz晶体振荡器输出 |
| 19 | BOOT0 | 启动顺序选择低位 |
| 20 | BOOT1 | 启动顺序选择高位 |
| 21 | PWRON | 开关机使能，低有效，内部100K上拉至电源 |
| 22 | VCC3 | DCDC3电源 |
| 23 | SW3 | DCDC3 switch输出 |
| 24 | GND3 | 电源地 |
| 25 | VFB3 | DCDC3输出反馈电压 |
| 26 | VFB2 | DCDC2输出反馈电压 |
| 27 | GND2 | 电源地 |
| 28,29 | SW2 | DCDC2 switch输出 |
| 30 | VCC2 | DCDC2电源 |
| 31 | CLK32K1 | 32.768K时钟1输出，开漏 |
| 32 | CLK32K2 | 32.768K时钟2输出，开漏 |
| 33 | VDDIO | IO电源 |
| 34 | NRESPWON | 上电后的复位引脚，低有效 |
| 35 | SCL | I2C时钟输入 |
| 36 | SDA | I2C数据输入/输出 |
| 37 | VPP | 测试电源，应用中悬空 |
| 38 | VFB1 | DCDC1输出反馈电压 |
| 39 | VCC1 | DCDC1电源 |
| 40,41 | SW1 | DCDC1 switch输出 |
| 42,43 | GND1 | 电源地 |
| 44 | VLDO7 | LDO7输出 |
| 45 | VCC7 | LDO电源 |
| 46 | VLDO5 | LDO5输出 |
| 47 | VLDO3 | LDO3输出 |
| 48 | VLDO4 | LDO4输出 |
| 49 | VLDO6 | LDO6输出 |
| 50 | VCC8 | SWITCH电源 |
| 51 | VLDO8 | LDO8输出 |
| 52 | VLDO9 | LDO9输出 |
| 53 | VCC9 | LDO电源 |
| 54 | VSWOUT | 开关输出 |
| 55 | VREF | 内部参考电压 |
| 56 | REFGND | 参考地 |
| 57 | SNSN | 电池充放电电流检测负端 |
| 58 | SNSP | 电池充放电电流检测正端 |
| 59,60 | BAT | 电池正极 |
| 61,62 | SYS | DC-DC稳压输出，给系统负载供电及电池充电 |
| 63 | VCC4 | DCDC4电源 |
| 64 | SW4 | DCDC4 switch输出 |
| 65 | VFB4 | DCDC4输出反馈电压 |
| 66 | GND4 | 电源地 |
| 67 | TS1 | 热敏电阻1输入，电阻接地，通常位于电池包内 |
| 68 | TS2 | 热敏电阻2输入，电阻接地；控制位设ADC时可作内部ADC模拟输入 |
| Exposed pad | Exposed ground | 必须接地以改善散热及电气性能 |

### 1.4 重要概念

I2C 地址7 位从机地址:0x1cPMIC 有 3 种工作模式

1. PMIC normal 模式系统正常运行时 PMIC 处于 normal 模式,此时 pmic_sleep 为低电平。



2. PMIC sleep 模式系统休眠时需要待机功耗尽量低,PMIC 会切到 sleep 模式减低自身功耗,这时候一般会降低某些路的输出电压,或者直接关闭输出,这可以根据实际产品需求进行配置。

系统待机时 AP 通过 I2C指令把 pmic_sleep 配置成 sleep 模式,然后拉高 pmic_sleep 即可让 PMIC 进入 sleep 状态;当SoC 唤醒时 pmic_sleep 恢复为低电平,PMIC 退出休眠模式。



3. PMIC shutdown 模式当系统进入关机流程的时候,PMIC 需要完成整个系统的电源下电操作。

AP 通过 I2C 指令把pmic_sleep 配置成 shutdown 模式,然后拉高 pmic_sleep 即可让 PMIC 进入 shutdown 状态。

pmic_sleep 引脚常态为低电平,PMIC 处于 normal 模式。

当引脚拉高的时候会切换到 sleep 或者 shutdown 的模式。

pmic_int 引脚常态为高电平,当有中断产生的时候变为低电平。

如果中断没有被处理,则会一直维持低电平。



pmic_pwron 引脚pwrkey 的功能需要硬件上将 power 按键接到这个引脚,驱动通过这个引脚来判断按下/释放。

各路 DCDC 的工作模式DCDC 有 PWM(也叫 force PWM)、PFM 模式,但是 PMIC 有一种模式会动态切换 PWM、PFM,这就是我们通常所说的 AUTO 模式。

PMIC 支持 PWM、AUTO PWM/PFM 两种模式,AUTO模式效率高但是纹波瞬态响应会差。

出于系统稳定性考虑,运行时都是设置为 PWM 模式,系统进入休眠时会选择切换到 AUTO PWM/PFM。

DCDC3 电压调节DCDC3 这路电源比较特殊,不能通过寄存器修改电压,只能通过外部电路的分压电阻进行调节,所以如果需要修改电压请修改外围硬件,在 Rockchip 的方案上一般作为 VCC_DDR 使用。

DCDC 和 LDO 的运行时电压调节范围

1. DCDC 电压范围连续:

1. DCDC 电压范围连续:

| 电压范围(V) | 步进值(mV) | 具体档位值(V) |
| --- | --- | --- |
| 0.7125 ~ 1.45 | 12.5 | 0.7125、0.725、0.737.5、 ......、1.45 |
| 1.8 ~ 3.3 | 100 | 1.8、1.9、2.0、2.2....、3.3 |

2. LDO 电压连续:

| 电压范围(V) | 步进值(mV) | 具体档位值(V) |
| --- | --- | --- |
| 0.8 ~ 3.4 | 100 | 0.8、0.9、1.0、1.1、1.2、 ...... 3.4 |

### 1.5 上电条件和时序

1. 上电条件只要满足下面任意一个条件即可以实现 PMIC 上电:EN 信号从低电平变高电平触发EN 信号保持高电平,且 RTC 闹钟中断触发EN 信号保持高电平,按 PWRON 键触发

2. 上电时序每款 SOC 平台对各路电源上电时序要求可能不一样,目前上电时序有如下情况,具体请参考最新的datasheet:

![中文PDF原图 · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-01.png)

*中文PDF原图 · p9*

![中文PDF原图 · p9](/docs/rockchip-rk818-pmic/assets/cn-p009-figure-02.png)

*中文PDF原图 · p9*


AP对应：BOOT11为RK3188/RK3168/RK3188M/RK3168M/RK3028A/RK3028/RK2928；BOOT10为部分OTP（BUCK1–4、LDO3/LDO4/LDO5/LDO7）；BOOT01为RK3066；BOOT00 RK818-1为RK3288/RK3368；BOOT00 RK818-2为S-Product。

| Rail | BOOT11 电压 | BOOT11 顺序 | BOOT10 电压 | BOOT10 顺序 | BOOT01 电压 | BOOT01 顺序 | BOOT00 RK818-1 电压 | BOOT00 RK818-1 顺序 | BOOT00 RK818-2 电压 | BOOT00 RK818-2 顺序 |
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

## 2. 配置

### 2.1 驱动和 menuconfig

3.10 内核配置RK818 驱动文件:

```text
drivers/mfd/rk818.c
drivers/mfd/rk818-irq.c
drivers/rtc/rtc-rk818.c
drivers/power/rk818-battery.c
```

RK818 dts文件可参考:

```text
arch/arm/boot/dts/rk818.dtsi
arch/arm64/boot/dts/rk3368-p9_818.dts
```

menuconfig 里对应的宏配置:

```text
CONFIG_MFD_RK818
CONFIG_RTC_RK818
CONFIG_BATTERY_RK818
```

4.4 内核配置RK818 驱动文件:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c
drivers/clk/clk-rk808.c
drivers/power/rk818_charger.c
drivers/power/rk818_battery.c
```

menuconfig 里对应的宏配置:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

4.19 内核配置RK818 驱动文件:

```text
drivers/mfd/rk808.c
drivers/rtc/rtc-rk808.c
drivers/regulator/rk808-regulator.c     // 跟4.4内核不同
drivers/clk/clk-rk808.c
drivers/power/supply/rk818_battery.c
drivers/power/supply/rk818_charger.c
```

menuconfig 里对应的宏配置:

```text
CONFIG_MFD_RK808
CONFIG_RTC_RK808
CONFIG_REGULATOR_RK808
CONFIG_BATTERY_RK818
CONFIG_CHARGER_RK818
CONFIG_COMMON_CLK_RK808
```

### 2.2 DTS 配置

3.10 内核 DTS 配置DTS 的配置包括:I2C 挂载、主体、regulator、rtc、poweroff 等部分。



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

1. I2C 挂载整个完整的 rk818 节点挂在对应的 i2c 节点下面,并且配置 status = "okay";

2. 主体部分不可修改部分

rk818,system-power-controller：声明RK818具备管理系统下电的功能；

可修改部分gpios:指定 pmic_int(第一个)和 pmic_sleep(第二个)引脚;

3. regulator 部分

- `regulator-name`: 电源名字,建议和硬件图上保持一致,使用 regulator_get 接口时需要匹配这个名字;

- `regulator-min-microvolt`:运行时可调节的最小电压;

- `regulator-max-microvolt`:运行时可调节的最大电压;

- `regulator-initial-mode`:运行时 DCDC 工作模式,一般配置为 1。

 1:force pwm,2:autopwm/pfm;

- `regulator-state-mode`: 休眠时 DCDC 工作模式,一般配置为 2。

1:force pwm, 2:autopwm/pfm;

- `regulator-initial-state`:suspend 时的模式,必须配置成 3;

- `regulator-boot-on`:存在这个属性时,在注册 regulator 的时候就会使能这路电源;

- `regulator-always-on`:存在这个属性时,运行时不允许关闭这路电源且会在注册的时候使能这路电源;

- `regulator-state-enabled`:休眠时保持上电状态,想要关闭该路电源,则改成”regulator-state-disabled”;

- `regulator-state-uv`:休眠不断电情况下的待机电压。



说明:

如果 regulator-min-microvolt 和 regulator-max-microvolt 的电压相等，则在注册这个
regulator 的时候系统框架默认会把这个电压设置下去并使能这路电源，不需要使⽤者⼲预。



如果 regulator-boot-on 或者 regulator-always-on 存在，则系统框架在注册这路 regulator 的
时候默认会进⾏ enable，此时的这路 regulator 的电压有 2 种情况：如果 regulator-min-
microvolt 和 regulator-max-microvolt 的电压相等，则系统框架会把这路电压设置为当前这个电压
值；如果 regulator-min-microvolt 和 regulator-max-microvolt 的电压不相等，则此时的电压是
PMIC 的本⾝的硬件默认上电电压。



4. rtc 部分如果不想使能 RTC 的功能(如 box 产品上),则需要像上面那样增加节点,显式指明为 status ="disabled"。

如果需要使能的的话则可以把整个 RTC 节点去掉或者设置状态为 status = "okay"即可。



5. poweroff 部分因为 RK808 驱动自动拦截关机命令,执行写I2C关闭PMIC输出。

rk818_shutdown是注册syscore shutdown,用于一些准备工作,如关闭RTC中断等特殊操作。



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

rk818_device_shutdown是真正写I2C关闭PMIC输出。



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

4.4 内核 DTS 配置DTS 的配置包括:i2c 挂载、主体、rtc、clk、regulator、 charger、 battery 等部分。



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

1. i2c 挂载整个完整的 rk818 节点挂在对应的 i2c 节点下面,并且配置 status = "okay";

2. 主体部分不可修改:

```text
compatible = "rockchip,rk818";
reg = <0x1c>;
rockchip,system-power-controller;
wakeup-source;
#clock-cells = <1>;
```

可修改(按照 pinctrl 规则)interrupt-parent:pmic_int 隶属于哪个 gpio;interrupts:pmic_int 在 interrupt-parent 的 gpio 上的引脚索引编号和极性;pinctrl-names:不修改,固定为 "default";pinctrl-0:引用 pinctrl 里定义好的 pmic_int 引脚;

3. rtc如果 menuconfig 选中了这个模块,但是实际又不需要使能这几个驱动,那么可以在 dts 里增加 rtc节点,并且显式指明状态为 status = "disabled",这样就不会使能驱动,但是开机信息会有错误 log 报出,可以忽略;如果要使能驱动,则可以去掉相应的节点,或者设置状态为 status = "okay"。



4. regulatorregulator-compatible :驱动注册时需要匹配的名字,不能改动,否则会加载失败;

- `regulator-name`:电源的名字,建议和硬件图上保持一致,使用 regulator_get 接口时需要匹配这个名字;

- `regulator-init-microvolt`:u-boot阶段的初始化电压,kernel阶段无效;

- `regulator-min-microvolt`:运行时可以调节的最小电压;

- `regulator-max-microvolt`:运行时可以调节的最大电压;

- `regulator-initial-mode`:运行时 DCDC 的工作模式,一般配置为 1。

 1:force pwm,2:auto pwm/pfm;

- `regulator-mode`:休眠时 DCDC 的工作模式,一般配置为 2。

1:force pwm, 2:autopwm/pfm;

- `regulator-initial-state`:suspend 时的模式,必须配置成 3;

- `regulator-boot-on`:存在这个属性时,在注册 regulator 的时候就会使能这路电源;

- `regulator-always-on`:存在这个属性时,表示运行时不允许关闭这路电源且会在注册的时候使能这路电源;

- `regulator-ramp-delay`:DCDC 的电压上升时间,固定配置为 12500;

- `regulator-on-in-suspend`:休眠时保持上电状态,想要关闭该路电源,则改成”regulator-off-in-suspend”;

- `regulator-suspend-microvolt`:休眠不断电情况下的待机电压。



5. poweroff 部分

4.4上使用pm_power_off_prepare,实现PMIC关机前的准备工作,如关闭RTC中断,配置一些特殊寄存器等。

注册syscore shutdown, 真正用于PMIC关机。



6. clk 部分如果某个节个需要引用 RK808 的 clk 进行使用,引用格式如下:

clocks = <&rk818 1>;第一个参数: &rk818 固定,不可改动;第二个参数: 引用 rk818 的哪个 clk,只能是 0 或者 1,其中 0:rk818-clkout1, 1:rk818-clkout2;

4.19 内核 DTS 配置请参考4.4内核DTS配置。

差异点:4.19内核的DTS配置不再需要gpio子节点,但其他模块依然使用gpios = <&rk818 0 GPIO_ACTIVE_LOW>; 的方式引用和使用rk818的pin脚。



### 2.3 函数接口

如下几个接口基本可以满足日常使用,包括 regulator 开、关、电压设置、电压获取等:

1. 获取 regulator:struct regulator *regulator_get(struct device *dev, const char *id)dev 默认填写 NULL 即可,id 对应 dts 里的 regulator-name 属性。



2. 释放 regulatorvoid regulator_put(struct regulator *regulator)

3. 打开 regulatorint regulator_enable(struct regulator *regulator)

4. 关闭 regulatorint regulator_disable(struct regulator *regulator)

5. 获取 regulator 电压int regulator_get_voltage(struct regulator *regulator)

6. 设置 regulator 电压int regulator_set_voltage(struct regulator *regulator, int min_uV, int max_uV)传入的参数时保证 min_uV = max_uV,由调用者保证。



7. 范例

```text
struct regulator *rdev_logic;

rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
regulator_enable(rdev_logic);                           // 使能vdd_logic
regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
regulator_disable(rdev_logic);                          // 关闭vdd_logic
regulator_put(rdev_logic);                              // 释放vdd_logic
```

说明:4.4或者4.19内核还提供了 devm_ 开头的regulator接口帮开发者管理要申请的资源。



## 3. Debug

### 3.1 3.10内核

因为 PMIC 涉及的驱动在使用逻辑上都不复杂,重点都体现在最后的寄存器设置上。

所以目前常用的debug 方式就是直接查看 rk818 的寄存器,通过如下节点:/sys/rk818/rk818_test读寄存器:echo r [addr] > /sys/rk818/rk818_test写寄存器:echo w [addr] [value] > /sys/rk818/rk818_test

### 3.2 4.4内核

命令格式同 3.10 内核一样,只是节点路径不同,4.4 内核上的 debug 节点路径是:/sys/rk8xx/rk8xx_dbg

### 3.3 4.19内核

请参考4.4内核命令。



{% endraw %}
