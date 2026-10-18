---
title: "Rockchip SLAVE DSMC 完整指南：Local Bus、预留内存与中断"
description: "Rockchip SLAVE DSMC 完整指南：Local Bus、预留内存与中断：保留完整技术章节、代码、参数及原文疑点。"
translation_key: "056-rockchip-slave-dsmc"
slug: "056-rockchip-slave-dsmc"
lang: "zh"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip rockchip-slave-dsmc"
excerpt: "Rockchip SLAVE DSMC 完整指南：Local Bus、预留内存与中断：保留完整技术章节、代码、参数及原文疑点。"
---

{% raw %}

# Rockchip SLAVE DSMC 完整指南：Local Bus、预留内存与中断

本文完整整理原厂技术正文，作为 ArmSoM 平台参考。原文适用范围：RK3506，Linux kernel 6.1。使用前须核对实际板卡、SoC、SDK/BSP 分支、引脚与外设配置；未做板级硬件验证，不代表所有 ArmSoM 板卡均支持。文中输出和数值为原文示例，不是 ArmSoM 实测。

中文保留中文原稿正文，英文保留英文原稿，俄文完整翻译英文正文；代码、注释和命令输出保留源语言。 中文使用中文 PDF 原图，英文和俄文使用英文 PDF 原图。

版本说明：中文 V1.0.0，英文 V1.0.1；英文修订项为中文字形错误修复。技术内容对应，中文中断节为 2.4，英文/俄文为 3，保留各自章号和代码标识。

**操作注意**：预留内存、DMA、引脚复用和设备写操作会影响实际硬件。所有命令仅供阅读，未执行硬件读写；先核对原理图、供电、时序和实际设备。DTS 中 xxx 和省略号是原文占位示例，不能直接当作完整配置。

来源与修复详见 [EDITORIAL-NOTES](/docs/rockchip-slave-dsmc/EDITORIAL-NOTES.md)。官方参考：[ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

原文产品版本表（PDF p.2；仅表示原稿范围，非板级验证结论）：

| 芯片名称 | 内核版本 |
| --- | --- |
| RK3506 | kernel 6.1 |

<!-- Source CN PDF p.4, block 0 -->

## 1. 概述

<!-- Source CN PDF p.4, block 1 -->

Slave Double Data Rate Serial Memory Controller（SLAVE DSMC）作为DSMC的slave，仅支持Localbus协议，且需配合使用RK 开发的DSMC host 控制器，或者传输协议相同。如2块RK3506 EVB对接，一块EVB做DSMC host，一块EVB做DSMC local bus的slave。如下图连接方式：

<!-- Source CN PDF p.4, block 2 -->

![原文双 RK3506 EVB 连接示例](/docs/rockchip-slave-dsmc/assets/cn-p04-figure1.png)

<!-- Source CN PDF p.4, block 3 -->

## 2. SLAVE DSMC 驱动

<!-- Source CN PDF p.4, block 4 -->

### 2.1 驱动文件

<!-- Source CN PDF p.4, block 5 -->

SALVE DSMC 的驱动文件位置如下：

<!-- Source CN PDF p.4, block 6 -->

```text
drivers/memory/rockchip/dsmc-lb-slave.c /* DSMC local bus slave 驱动程序 */
```

<!-- Source CN PDF p.4, block 7 -->

### 2.2 DTS节点配置

<!-- Source CN PDF p.4, block 8 -->

```text
&dsmc_lb_slave {
    memory-region = <&dsmc_lb_slave_mem>; /* dsmc local bus slave的内存空间 */
    status = "okay"; /* 开启dsmc local bus slave */
};
&reserved_memory {
    /*
     * dsmc local bus slave的内存空间，一般占用DDR一段连续的空间
     */
    dsmc_lb_slave_mem: dsmc-lb-slave-mem@6000000 {
        compatible = "rockchip,dsmc-lb-slave-mem";
        reg = <0x6000000 0x2000000>;/* 定义dsmc local bus slave的起始地址，空间大小
*/
    };
};
```

<!-- Source CN PDF p.5, block 10 -->

DSMC local bus slave定义的内存空间，在默认情况下作为DSMC host的Merged FIFO 空间使用。所以DSMC local bus slave的内存空间范围需要与DSMC host端属性 rockchip,ranges 配置一致 。

<!-- Source CN PDF p.5, block 11 -->

### 2.3 内核配置

<!-- Source CN PDF p.5, block 12 -->

```text
Symbol: ROCKCHIP_DSMC_SLAVE [=y]
                             │
  │ Type : tristate
                             │
  │ Prompt: Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver
                                 │
  │ Depends on: MEMORY [=y] && ARCH_ROCKCHIP
                             │
  │ Location:
                           │
  │ -> Device Drivers
                           │
  │ -> Memory Controller drivers (MEMORY [=y])
                             │
  │ -> Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver (ROCKCHIP_DSMC_SLAVE [=y])
                    │
```

<!-- Source CN PDF p.5, block 13 -->

### 2.4 中断

<!-- Source CN PDF p.5, block 14 -->

DSMC slave的驱动注册了一个中断服务程序，当DSMC host通过写入DSMC slave的LBC_CONx寄存器，将触发SLAVE_DSMC中断（host2slave中断），DSMC slave端CPU收到中断后执行rockchip_dsmc_lb_slave_irq 中断服务程序，若LBC_CON15 写入非零值，则通过写入APP_CON15的方式触发slave2host中断，DSMC host接收后自动发起一定数量的DMA 硬件请求，触发DMA搬移。

{% endraw %}
