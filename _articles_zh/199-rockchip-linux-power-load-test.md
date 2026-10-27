---
title: "Rockchip Linux 功耗负载测试与优化"
description: "Rockchip Linux 功耗负载测试与优化 — RK3399, Buildroot / Debian 9, RK-SM-YF-385 V1.0.1"
excerpt: "Rockchip Linux 功耗负载测试与优化"
translation_key: "199-rockchip-linux-power-load-test"
slug: "199-rockchip-linux-power-load-test"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3399", "Linux", "Power"]
---

{% raw %}

# Rockchip Linux 功耗负载测试与优化

ArmSoM 平台参考。原稿 RK-SM-YF-385 V1.0.1 介绍 RK3399 的 Buildroot / Debian 9 功耗测试、初步排查和优化，旨在兼顾系统性能、功耗合理性与安全性。原稿没有给出内核或精确 SDK/BSP 版本，也没有确认适用的 ArmSoM 板卡；须核对实际板卡原理图、供电、显示器、驱动和 SDK 后再应用。以下是原厂测试示例，不是 ArmSoM 实测，未进行硬件验证。

只有中文原稿；英、俄、德文为完整翻译，三张图均沿用中文原图，未声称存在英文图。两张位图表另恢复为可编辑表。原稿支持状态：

| 芯片 | Buildroot | Debian 9 |
| --- | --- | --- |
| RK3399 | Y | Y |

## 1. 系统场景功耗分析

RK3399 测试条件：CPU 为 4xA53+2xA72，最高 1.8GHz；DDR 最高 856MHz；GPU 最高 800MHz。以下介绍 Buildroot / Debian 9 Linux 静态桌面、视频播放、压力测试与深度休眠数据。

### 1.1 Buildroot 系统场景功耗

![Buildroot 原始测量表（中文原图）](/docs/rockchip-linux-power-load-test/assets/cn-p4-1.png)

Buildroot 原始测量表（中文原图）

`RK_IND_EVB_RK3399_LP4D200P232SD8_V11_20190905` · `Sample:41810` · `693 Sample/S` · `00:01:00`

| 测试项目 | VCC_SOC (mW) | VCC12V_DCIN (V) | VCC12V_DCIN (mA) | VDD_CPU_B (V) | VDD_CPU_B (mA) | VDD_GPU (V) | VDD_GPU (mA) | VDD_LOG (V) | VDD_LOG (mA) | VDD_CENTER (V) | VDD_CENTER (mA) | VDD_CPU_L (V) | VDD_CPU_L (mA) | VCC_DDR (V) | VCC_DDR (mA) | VCC3V3_SYS (V) | VCC3V3_SYS (mA) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 静态桌面（带屏） | 1982.4726 | 11.932 | 907.6 | 0.856 | 16.5 | 0.862 | 60.5 | 0.96 | 276 | 0.924 | 531.7 | 0.832 | 18.5 | 1.088 | 58.1 | 3.26 | 331.7 |
| 静态桌面（去屏） | 1876.9895 | 12.02 | 708.9 | 0.853 | 14.8 | 0.86 | 57.5 | 0.963 | 227.6 | 0.921 | 496.8 | 0.829 | 10.2 | 1.091 | 57.2 | 3.259 | 327.5 |
| 1080p变形金刚3 | 2340.035 | 11.89 | 997.5 | 0.857 | 20.7 | 0.862 | 187.4 | 0.959 | 297.1 | 0.929 | 739.1 | 0.841 | 54.3 | 1.08 | 58.8 | 3.261 | 331.2 |
| 4K@30fps Birds | 2392.5669 | 11.881 | 1019.6 | 0.858 | 20.5 | 0.863 | 137.6 | 0.959 | 304.9 | 0.932 | 815.8 | 0.845 | 68.4 | 1.078 | 58.8 | 3.26 | 332 |
| Glmark2测试 | 2410.0431 | 11.887 | 1007.9 | 0.860 | 67.3 | 0.887 | 225.4 | 0.953 | 351 | 0.926 | 593.7 | 0.834 | 47.8 | 1.08 | 58.4 | 3.257 | 357.7 |
| 压力测试 | 4126.4532 | 11.736 | 1340 | 0.912 | 764.9 | 1.081 | 191.1 | 0.948 | 438.4 | 0.935 | 818.7 | 1.125 | 763.1 | 1.063 | 60.7 | 3.26 | 336.1 |
| 深度休眠测试 | 120.5585 | 12.325 | 22.1 | 0 | 0 | 0 | 0 | 0.979 | 35.1 | 0 | 0 | 0 | 0 | 1.093 | 53.6 | 3.287 | 8.4 |

原稿分析值如下（保留原文舍入值，不用表值重新计算）：

| 场景 | 符号 | 功耗 |
| --- | --- | --- |
| 屏幕 | Pd | 2.3W |
| 静态桌面总功耗 | Pui | 10.8W |
| 1080P视频总功耗 | Pl | 11.86W |
| 4K@30fps视频总功耗 | Pb | 12.1W |
| Glmark2总功耗 | Pg | 11.98W |
| 压力测试总功耗 | Ps | 15.72W |
| 静态桌面SoC | Psui | 1.88W |
| 1080P视频SoC | Psl | 2.34W |
| 4K视频SoC | Psb | 2.39W |
| Glmark2 SoC | Psg | 2.41W |
| 压力测试SoC | Pss | 4.13W |
| 深度休眠SoC | Ps2 | 120.5mW |

### 1.2 Debian 9 系统场景功耗

![Debian 9 原始测量表（中文原图）](/docs/rockchip-linux-power-load-test/assets/cn-p4-2.png)

Debian 9 原始测量表（中文原图）

`RK_IND_EVB_RK3399_LP4D200P232SD8_V11_20190905` · `Sample:41810` · `693 Sample/S` · `00:01:00`

| 测试项目 | VCC_SOC (mW) | VCC12V_DCIN (V) | VCC12V_DCIN (mA) | VDD_CPU_B (V) | VDD_CPU_B (mA) | VDD_GPU (V) | VDD_GPU (mA) | VDD_LOG (V) | VDD_LOG (mA) | VDD_CENTER (V) | VDD_CENTER (mA) | VDD_CPU_L (V) | VDD_CPU_L (mA) | VCC_DDR (V) | VCC_DDR (mA) | VCC3V3_SYS (V) | VCC3V3_SYS (mA) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 静态桌面（带屏） | 1966.9842 | 11.927 | 909.3 | 0.856 | 15 | 0.866 | 52.3 | 0.961 | 270.7 | 0.924 | 525.7 | 0.833 | 14 | 1.088 | 59.2 | 3.261 | 333.3 |
| 静态桌面（去屏） | 1894.8035 | 12.021 | 700.9 | 0.853 | 17 | 0.863 | 55.6 | 0.963 | 228.7 | 0.921 | 499.8 | 0.83 | 15.1 | 1.09 | 57.9 | 3.259 | 330.2 |
| 1080p变形金刚3 | 2231.3292 | 11.907 | 959.9 | 0.857 | 18.3 | 0.864 | 61.1 | 0.952 | 356.5 | 0.927 | 701.5 | 0.832 | 25.6 | 1.085 | 58.4 | 3.26 | 333.9 |
| 4K@30fps Birds | 2381.1659 | 11.887 | 1006.8 | 0.857 | 25.8 | 0.864 | 66 | 0.951 | 366.7 | 0.931 | 815.8 | 0.836 | 32.7 | 1.078 | 58.4 | 3.259 | 338.6 |
| Glmark2测试 | 2342.1851 | 11.887 | 1006.8 | 0.866 | 84.7 | 0.954 | 231 | 0.953 | 351.2 | 0.926 | 591.4 | 0.833 | 19.6 | 1.083 | 58.7 | 3.26 | 333.2 |
| 压力测试 | 4057.176 | 11.729 | 1360 | 1.01 | 805.7 | 0.867 | 147.5 | 0.948 | 445.5 | 0.938 | 814.4 | 1.123 | 683.5 | 1.057 | 60 | 3.261 | 336.8 |
| 深度休眠测试 | 111.6261 | 12.325 | 20.9 | 0 | 0 | 0 | 0 | 0.979 | 32.3 | 0 | 0 | 0 | 0 | 1.094 | 53.3 | 3.287 | 6.6 |

原稿分析值如下（保留原文舍入值，不用表值重新计算）：

| 场景 | 符号 | 功耗 |
| --- | --- | --- |
| 屏幕 | Pd | 2.4W |
| 静态桌面总功耗 | Pui | 10.84W |
| 1080P视频总功耗 | Pl | 11.43W |
| 4K@30fps视频总功耗 | Pb | 11.96W |
| Glmark2总功耗 | Pg | 11.97W |
| 压力测试总功耗 | Ps | 15.95W |
| 静态桌面SoC | Psui | 1.89W |
| 1080P视频SoC | Psl | 2.23W |
| 4K视频SoC | Psb | 2.38W |
| Glmark2 SoC | Psg | 2.34W |
| 压力测试SoC | Pss | 4.06W |
| 深度休眠SoC | Ps2 | 111.6mW |

## 2. 系统功耗优化

### 2.1 功耗初步排查步骤

#### 2.1.1 对比总功耗

首先对比同一场景的总功耗，初步确认板子功耗是否正常，可参考上章数据。若客户板和 Rockchip SDK 板参考值相差较大，进一步分解功耗。测试时除硬件差异外，其余条件须一致；例如对比 1080P/4K 播放时采用相同片源，去除 eDP 屏和 HDMI 显示等。

#### 2.1.2 分解各路功耗

熟悉项目 Power Tree。下图为 RK3399 挖掘机板 Power Tree。优化时按原理图列出电源树，在对应电路串入电阻（原稿一般推荐 20mR），测量电流。原稿分解 VCC3V3_SYS、VDD_CPU_B、VDD_CPU_L、VDD_GPU、VDD_LOG、VDD_0V9、VDD_CENTER、VCC_DDR、VCC_1V8。先比较 CPU 大小核、GPU、DDR 的功耗及变频是否正常；若抬电压，确认增量是否为 12.5mv 的整数倍。变频策略正常后，再比较其他外设功耗。

![RK3399 挖掘机电源树（中文原图）](/docs/rockchip-linux-power-load-test/assets/cn-p5-1.png)

RK3399 挖掘机电源树（中文原图）

#### 2.1.3 Clock 的检查

查看各子系统 clock 状态，包括频率、enable_count、prepare_count、父子关系。以下以 saradc 为例；代码内注释保留原稿：

```text
# 获取总的Clock状态：
cat /sys/kernel/debug//clk/clk_summary
# 设置频率（单位 HZ）：
echo 24000000 > /sys/kernel/debug/clk_saradc/clk_rate
# 获取频率：
cat /sys/kernel/debug/clk_saradc/clk_rate
# 打开 clock：
echo 1 > /sys/kernel/debug/clk_saradc/clk_enable_count
# 关闭 clock：
echo 0 > /sys/kernel/debug/clk_saradc/clk_enable_count
```

enable_count 在驱动通过 clk_enable 主动申请打开时加 1。部分默认常开时钟的计数可以是 1 或 0，功耗排查不必过度关注。重点检查未使用设备的 CLK enable_cnt 是否为 0；若不是，可按原稿手动关钟调试，但须先确认不会影响在用硬件。

#### 2.1.4 Power domain (PD) 的检查

确认各 PD 当前状态。未使用模块应 suspend，PD 下全部 devices 都 suspend 后该 PD 才会关闭。原始查询输出跨页续接如下：

```text
# cat /sys/kernel/debug/pm_genpd/pm_genpd_summary
domain status slaves
/device runtime status
----------------------------------------------------------------------
pd_vopl on
/devices/platform/ff8f3f00.iommu active
/devices/platform/ff8f0000.vop active
pd_vopb off
/devices/platform/ff903f00.iommu suspended
/devices/platform/ff900000.vop suspended
pd_vo on pd_vopb, pd_vopl
pd_tcpc1 on
/devices/platform/ff800000.phy active
pd_tcpc0 on
/devices/platform/ff7c0000.phy active
pd_isp1 on
/devices/platform/ff924000.iommu active
/devices/platform/ff920000.rkisp1 suspended
pd_isp0 on
/devices/platform/ff914000.iommu active
/devices/platform/ff910000.rkisp1 suspended
pd_hdcp on
/devices/platform/ff940000.hdmi active
```

DTS 配置，以 vopb 为例：

```text
vopb: vop@ff900000 {
    power-domains = <&power RK3399_PD_VOPB>;
};
```

若 DTS 节点不引用 PD，框架认为无设备使用它，会在启动后关闭。若引用了 PD 但 vop 驱动没有 runtime 操作，设备状态为 unsupported，该 PD 常开。若 DTS 引用了 PD 且驱动有 runtime 操作，则由驱动主动申请开启或关闭。降低运行功耗时查询 PD summary 与 clock tree，关闭未使用模块的 PD、CLK，避免内部 MOS 管漏电。

### 2.2 功耗初步优化步骤

#### 2.2.1 修改默认背光值

```text
[root@rk3399:/]# cat /sys/class/backlight/backlight/brightness
200
```

默认可设 0–255，值越大越亮，可先设为 100，再按实际情况进一步降低。

```text
echo 100 > /sys/class/backlight/backlight/brightness
```

#### 2.2.2 降低刷新率

按使用场景，若实际 GPU 刷新率仅在 30fps 以下，可修改 DSI 刷新率。下面保留原稿局部 diff；原稿没有提供完整节点结尾，不能单独当作完整 DTS 使用。

```text
native-mode= <&mipi_1280x800>;
mipi_1280x800: mipi-1280x800 {
-clock-frequency = <76000000>;
+ clock-frequency = <60000000>;//45fps
hactive = <800>;
vactive = <1280>;
hsync-len = <10>;
```

#### 2.2.3 关闭 ISP

在 DTS 中关闭未用模块。例如使用 USB camera 时，原稿建议关闭 ISP：

```text
+&isp0{
+    status = "disabled";
+};
+
+&isp1 {
+    status = "disabled";
+};
+
+&isp0_mmu {
+    status = "disabled";
+};
+
+&isp1_mmu {
+    status = "disabled";
+};
```

#### 2.2.4 修改调频策略

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-opp.dtsi
@@ -50,6 +50,8 @@
rockchip,temp-hysteresis = <5000>;
rockchip,low-temp = <10000>;
rockchip,low-temp-min-volt = <900000>;
+ rockchip,high-temp = <45000>;
+ rockchip,high-temp-max-volt = <1000000>;
nvmem-cells = <&cpul_leakage>, <&specification_serial_number>;
nvmem-cell-names = "cpu_leakage",
@@ -141,6 +143,8 @@
rockchip,temp-hysteresis = <5000>;
rockchip,low-temp = <10000>;
rockchip,low-temp-min-volt = <900000>;
+ rockchip,high-temp = <45000>;
+ rockchip,high-temp-max-volt = <1025000>;
nvmem-cells = <&cpub_leakage>, <&specification_serial_number>;
nvmem-cell-names = "cpu_leakage",
```

#### 2.2.5 调整 target load

默认 load 是 90。原稿将命令折成两行，这里仅合并同一条 cat 命令：

```text
[root@rk3399:/sys/devices/system/cpu/cpufreq/policy4/interactive]# cat target_loads
90
```

原稿建议改成下面的值；注意示例仍是 cat 读取结果，没有提供写入命令，不能把 cat 误认为设置操作：

```text
[root@rk3399:/sys/devices/system/cpu/cpufreq/policy4/interactive]# cat target_loads
65 1008000:70 1200000:75 1416000:80 1608000:90
```

## 校对与适配说明

保留原稿 `20mR`、`12.5mv` 写法，通常分别指毫欧和毫伏，应用前核对原理图与 PMIC。保留 `/sys/kernel/debug//clk/clk_summary` 双斜杠和原始 `clk_saradc` 路径，须按实际内核 debugfs 核对。测量表 SoC 功耗、整板电源输入及去屏条件不同，不可混用；正文舍入值未据图表改写。第 2.2.4 温度/电压配置不是所有 SDK 通用安全值。

官方参考：[Rockchip](https://www.rock-chips.com/)；[ArmSoM 文档](https://docs.armsom.org/)。

{% endraw %}
