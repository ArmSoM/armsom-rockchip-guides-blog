---
title: "Rockchip 时钟框架：PLL、DTS、驱动 API 与调试"
description: "基于原厂资料整理的 Rockchip Linux 时钟树、PLL、DTS 配置、驱动 API 与 debugfs 参考。"
translation_key: "033-rockchip-clock-framework"
slug: "033-rockchip-clock-framework"
lang: "zh"
date: "2026-10-15"
author: "ArmSoM 编辑部 · Rockchip 原厂资料"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "时钟", "PLL", "设备树", "Linux 内核"]
keywords: "ArmSoM Rockchip 瑞芯微 时钟框架 PLL DTS Linux RK3588 RK3576"
excerpt: "Rockchip Linux 时钟树、设备树分配与时钟 API 的完整工程参考。"
---

# Rockchip 时钟框架：PLL、DTS、驱动 API 与调试

本文按《Rockchip Clock Developer Guide》V1.2.0（2024-08-02）整理，是平台级参考，不是 ArmSoM 实测报告。适用于文档列出的 RK303X、RK312X、RK322X、RK3288X、RK3328、RK3368、RK3399、RV1108、PX30、RV1126、RK356X、RK3588、RK3576、RV1103B 和 RK3506 的对应 Linux BSP。使用前必须核对具体 ArmSoM 板卡的 SoC、已发布 BSP、CRU/PMUCRU 寄存器、DTS 和启动链；本文未进行 ArmSoM 频率、抖动或功耗实测。

中英文源文件均为 24 页。中文文章使用中文原图；封面法律声明、联系人、读者对象和修订记录已按编辑规则移除。[校对记录](/docs/rockchip-clock/EDITORIAL-NOTES.md)。

## 1. 时钟树与软件结构

这里的 CLOCK 是向 USB、外设等 SoC 模块供时的层级框架，不是 Linux 计时器。时钟树由晶振/有源振荡器、PLL、分频器、MUX、门控和消费者构成。平台方案决定 PLL、父时钟、分频和 MUX，不能跨 SoC 照搬。

![时钟树原图](/docs/rockchip-clock/assets/Rockchip_Developer_Guide_Clock_CN-p6-X70.png)

时钟工作通常是：开关时钟、设置频率、选择父时钟。原厂路径为 `drivers/clk/rockchip/clk-rk3xxx.c`（寄存器和树关系）、`include/dt-bindings/clock/rk3xxx-cru.h` / `include/dt-bindings/clock/rockchip,rk3xxx-cru.h`（ID）、`drivers/clk/rockchip/clk-xxx.c`（SoC 特殊时钟）和 `drivers/clk/`（通用 API）。

## 2. PLL、总线与门控

| PLL | 原文用途 | 原文典型值 |
|---|---|---|
| APLL | CPU，`CLOCK_CORE` | 随 CPU 频率变化 |
| DPLL | DDR，`CLOCK_DDR` | 随 DDR 需求变化 |
| GPLL | 总线/外设后备 | 594 MHz 或 1200 MHz |
| CPLL | GMAC/其他后备或 LCDC | 400/500/800/1000 MHz |
| NPLL | 其他后备或 LCDC | 1188 MHz |

ACLK 用于数据传输，PCLK/HCLK 通常用于寄存器读写。原文给出的设计范围：ACLK 100–300 MHz、PCLK 50–150 MHz、HCLK 37–150 MHz；BUS 多为 I2C/I2S/SPI 等低速设备，PERI 常含 eMMC/GMAC/USB。具体芯片会不同，部分高速设备有独立 ACLK。RK3399 区分高性能 `ACLK_PERIHP/HCLK_PERIHP/PCLK_PERIHP` 和低功耗 `ACLK_PERILP0/HCLK_PERILP0/PCLK_PERILP0/HCLK_PERILP1/PCLK_PERILP1`。

门控按父子树和引用计数工作：使能末级时钟会自动打开父级；只有所有子节点关闭后父级才关闭。因此驱动应控制自己声明的叶子时钟，不能强行关闭共享父时钟。

## 3. DTS 初始配置

Linux 4.4 后，时钟初始化经 `of_clk_set_defaults()` 解析 `assigned-clocks`、`assigned-clock-parents` 与 `assigned-clock-rates`。后三者必须按位置与 `assigned-clocks` 一一对应，否则会给错误的 ID 配置父时钟或频率。

```dts
&cru {
        assigned-clocks = <&cru ACLK_VOP0>, <&cru HCLK_VOP0>,
                          <&cru PLL_GPLL>, <&cru PLL_CPLL>;
        assigned-clock-parents = <&cru VPLL>, <&cru VPLL>,
                                 <&cru GPLL>, <&cru GPLL>;
        assigned-clock-rates = <400000000>, <200000000>,
                               <594000000>, <800000000>;
};
```

这是原文 RK3399 示例的缩略片段，必须改成目标 SoC 的完整 binding 名称与列表。未默认打开、且没有消费者引用的时钟，初始化后可能被关闭。需要保留时可：加入 `*_critical_clocks`；在门控定义加 `CLK_IGNORE_UNUSED`；或在 6.1 使用 `CLK_IS_CRITICAL`。`clk_gate.always_on=1 pm_domains.always_on=1` 会保持全部时钟开启，适合定位问题但会提高功耗。

ID 来自目标 SoC binding 头文件。`clk-rk3xxx.c` 常用 `GATE`（门控）、`MUX`（父级选择）和 `COMPOSITE`（MUX、DIV、GATE）描述时钟，禁止复用其他 SoC 的数字 ID。

## 4. 驱动引用与 API

优先从 DTS 以名称引用时钟：

```dts
clocks = <&cru SCLK_TSADC>, <&cru PCLK_TSADC>;
clock-names = "tsadc", "apb_pclk";
assigned-clocks = <&cru SCLK_TSADC>;
assigned-clock-rates = <750000>;
```

```c
#include <linux/clk.h>
dev->pclk = devm_clk_get(&pdev->dev, "tsadc");
dev->clk = devm_clk_get(&pdev->dev, "apb_pclk");
```

可用 API 包括 `devm_clk_get()`、`clk_get()/clk_put()`、`devm_clk_get_optional()`、`devm_clk_bulk_get()`、`devm_clk_bulk_get_all()`、`clk_prepare()/clk_unprepare()`、`clk_enable()/clk_disable()`、`clk_prepare_enable()/clk_disable_unprepare()`、`clk_get_rate()`、`clk_round_rate()` 和以 Hz 为单位的 `clk_set_rate()`。尽可能使用 managed/bulk 接口。

`prepare/unprepare` 可能休眠，不能在原子上下文调用；`enable/disable` 是原子操作。所有 enable/disable、get/put 必须成对处理，包括 probe 失败和 remove 路径。

## 5. 调试与验证

```sh
cat /sys/kernel/debug/clk/clk_summary
cat /sys/kernel/debug/clk_saradc/clk_rate
echo 24000000 > /sys/kernel/debug/clk_saradc/clk_rate
echo 1 > /sys/kernel/debug/clk_saradc/clk_enable_count
echo 0 > /sys/kernel/debug/clk_saradc/clk_enable_count
```

6.1 示例使用 `clk_prepare_enable` 节点。debugfs 节点依内核配置而定，不能作为量产脚本的固定前提。原文还通过 `TEST_CLK_OUT` 输出测量时钟：RK3399 图示中 MUX、DIV、GATE 对应 CRU 偏移为 `0x050c`、`0x01e8`、`0x0334`。实际操作前必须确认 pinmux、原理图和 TRM。

## 6. PLL 与特定时钟限制

```text
VCO  = 24 MHz × FBDIV / REFDIV（原文范围：450–2200 MHz）
FOUT = VCO / POSTDIV1 / POSTDIV2
POSTDIV1 >= POSTDIV2
```

原文例子：`24 MHz × 99 / 2 = 1188 MHz`，再经 `/2/1` 得到 594 MHz。VCO 越大抖动越小但功耗越高；REFDIV 越小锁定时间越短。自动计算参数不保证最大 VCO，原文不建议用于对抖动有要求的 PLL。

显示 DCLK 通常占用独立 PLL。原文列出：RK303X/RK312X/RK322X/RK3288X 用 CPLL，RK3368 用 NPLL，RK3399 双显示用 CPLL/VPLL，RK3568 用 HPLL/VPLL，RK3588 用 V0PLL 和两个 HDMIPHY PLL，RK3576 用 VPLL 和一个 HDMIPHY PLL，RK3506 使用最近分频。RK3399 HDMI VOP DCLK 应绑定 VPLL，另一 VOP 绑定 CPLL，但仍须以实际显示拓扑为准。

I2S、UART 等分数分频时，原文要求分数分频时钟为父时钟的 20 倍；否则会有较大抖动和频偏。千兆以太网通常需精确 50 MHz，10G 需精确 125 MHz；PLL 方案无法提供时应使用外部晶振。RK3576/RK3506 支持晶振或新增 IO 参考输入用于音频同步，需查阅目标 BSP 的实现。

## 7. 安全流程

1. 从板卡已发布 DTS/时钟驱动出发，不能复制其他 SoC 寄存器地址。
2. 列出消费者、目标频率、容差、候选父级和共享消费者。
3. 保证 assigned 三组属性位置严格对齐，修改前用 `clk_round_rate()` 评估。
4. 通过 `clk_summary` 确认父级、实际频率、引用计数；仅在硬件允许时测量测试输出。
5. 覆盖 suspend/resume、外设传输、显示模式、以太网与串口精度测试。
