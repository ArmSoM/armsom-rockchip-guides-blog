---
title: "Rockchip SLAVE DSMC Guide: Local Bus, Reserved Memory and Interrupts"
description: "Rockchip SLAVE DSMC Guide: Local Bus, Reserved Memory and Interrupts with complete technical sections, code, parameters and source caveats."
translation_key: "056-rockchip-slave-dsmc"
slug: "056-rockchip-slave-dsmc"
lang: "en"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip rockchip-slave-dsmc"
excerpt: "Rockchip SLAVE DSMC Guide: Local Bus, Reserved Memory and Interrupts with complete technical sections, code, parameters and source caveats."
---

{% raw %}

# Rockchip SLAVE DSMC Guide: Local Bus, Reserved Memory and Interrupts

This complete source-based technical article is an ArmSoM platform reference. Source scope: RK3506, Linux kernel 6.1. Verify the actual board, SoC, SDK/BSP branch, pins and peripherals before use. No board-level hardware validation has been performed, and support on all ArmSoM boards is not implied. Outputs and measurements are source examples, not ArmSoM test results.

Chinese follows the Chinese source; English follows the English source; Russian fully translates the English technical body. Code, comments and command output retain their source language. Chinese uses figures from the Chinese PDF; English and Russian use figures from the English PDF.

Versions: Chinese V1.0.0 and English V1.0.1; the English revision records Chinese-character fixes. Technical content corresponds; the interrupt section is 2.4 in Chinese and 3 in English/Russian. Original numbering and code identifiers are retained.

**Operational caution:** reserved memory, DMA, pin multiplexing and device writes affect hardware. Commands are provided for reading; no hardware operations were executed. Verify the schematic, power, timing and actual device. Any xxx or ellipsis in DTS is a source placeholder, not a complete usable configuration.

Sources and repairs: [EDITORIAL-NOTES](/docs/rockchip-slave-dsmc/EDITORIAL-NOTES.md)。Official references: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Source product-version table (PDF p.2; source scope, not board-level validation):

| Chipset | Kernel Version |
| --- | --- |
| RK3506 | kernel 6.1 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Overview

<!-- Source EN PDF p.4, block 1 -->

The Slave Double Data Rate Serial Memory Controller (SLAVE DSMC) acts as a slave to the DSMC, only supporting the Local bus protocol, and needs to be used in conjunction with the RK- developed DSMC host controller or a controller with the same transmission protocol. For example, two RK3506 EVBs can be connected, with one EVB acting as the DSMC host and the other EVB acting as the DSMC local bus slave. The connection method is shown in the following figure:

<!-- Source EN PDF p.4, block 2 -->

![Source connection example with two RK3506 EVBs](/docs/rockchip-slave-dsmc/assets/en-p04-figure1.png)

<!-- Source EN PDF p.4, block 3 -->

## 2. SLAVE DSMC Driver

<!-- Source EN PDF p.4, block 4 -->

### 2.1 Driver Files

<!-- Source EN PDF p.4, block 5 -->

The driver files for SLAVE DSMC are located as follows:

<!-- Source EN PDF p.4, block 6 -->

```text
drivers/memory/rockchip/dsmc-lb-slave.c /* DSMC local bus slave driver */
```

<!-- Source EN PDF p.4, block 7 -->

### 2.2 DTS Configuration

<!-- Source EN PDF p.4, block 8 -->

```text
&dsmc_lb_slave {
    memory-region = <&dsmc_lb_slave_mem>; /* Memory region for dsmc local bus
slave */
    status = "okay"; /* Enable dsmc local bus slave */
};
&reserved_memory {
    /*
     * Memory region for dsmc local bus slave, generally occupying a continuous
space in DDR
     */
    dsmc_lb_slave_mem: dsmc-lb-slave-mem@6000000 {
        compatible = "rockchip,dsmc-lb-slave-mem";
        /* Define the start address and size of the memory space for dsmc local
bus slave */
        reg = <0x6000000 0x2000000>;
    };
};
```

<!-- Source EN PDF p.5, block 10 -->

By default, the memory space allocated for the DSMC local bus slave serves as the Merged FIFO space for the DSMC host. Therefore, the memory space range of the DSMC local bus slave needs to be consistent with the rockchip,ranges property configuration on the DSMC host side.

<!-- Source EN PDF p.5, block 11 -->

### 2.3 Kernel Configuration

<!-- Source EN PDF p.5, block 12 -->

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

<!-- Source EN PDF p.6, block 13 -->

## 3. Interrupts

<!-- Source EN PDF p.6, block 14 -->

The DSMC slave driver registers an interrupt service routine. When the DSMC host writes to the LBC_CONx register of the DSMC slave, it will trigger the SLAVE_DSMC interrupt (host2slave interrupt). After the DSMC slave CPU receives the interrupt, it executes the rockchip_dsmc_lb_slave_irq interrupt service routine. If a non-zero value is written to LBC_CON15, it will trigger the slave2host interrupt by writing to APP_CON15. After the DSMC host receives the interrupt, it will automatically initiate a certain number of DMA hardware requests, triggering DMA transfer.

{% endraw %}
