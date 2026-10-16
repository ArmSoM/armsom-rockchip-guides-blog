---
title: "Rockchip DSMC Developer Guide: DTS, PSRAM, Local Bus, Memory Access and Debugging"
description: "Complete Rockchip DSMC reference: driver and DTS, kernel and user-space access, PSRAM/Local Bus address spaces, FIFO/register interaction and debugging."
translation_key: "055-rockchip-dsmc"
slug: "055-rockchip-dsmc"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip DSMC"
excerpt: "Complete Rockchip DSMC reference: driver and DTS, kernel and user-space access, PSRAM/Local Bus address spaces, FIFO/register interaction and debugging."
---

{% raw %}

# Rockchip DSMC Developer Guide: DTS, PSRAM, Local Bus, Memory Access and Debugging

This complete technical reference follows Rockchip V1.2.0. The source scope is RK3576 / RK3506 / RV1126B, kernel 6.10. It is an ArmSoM platform reference: verify the actual board, SoC, SDK/BSP branch, kernel and peripheral configuration. No board-level hardware validation has been performed; support on every ArmSoM board is not implied.

Chinese follows the 17-page Chinese PDF; English follows the 19-page English PDF and Russian fully translates its technical text. Chinese uses Chinese-source figures; English and Russian use English-PDF figures, including any Chinese UI labels present in those originals. Source conflicts and extraction repairs are recorded in the [editorial notes](/docs/rockchip-dsmc/EDITORIAL-NOTES.md). Code comments and output retain their source language.

**Operational risk:** DSMC mappings, direct memory access and DMA can cause bus exceptions, data loss or boot failure. Addresses, timings and code are retained as source examples; verify the actual schematic, slave capacity, power/initialization sequence and SDK. The source kernel 6.10 is not silently changed to another version. Code issues requiring verification are recorded in the editorial notes. No hardware reads or writes were executed.

Official resources: [ArmSoM](https://docs.armsom.org/)、[Rockchip Linux](https://github.com/rockchip-linux)。

| SoC | Kernel |
|---|---|
| RK3576 / RK3506 / RV1126B | kernel 6.10 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Terminology

<!-- Source EN PDF p.4, block 1 -->

DSMC: Double Data Rate Serial Memory Controller.

<!-- Source EN PDF p.4, block 2 -->

PSRAM: Pseudo static random access memory.

<!-- Source EN PDF p.4, block 3 -->

DPRAM: Dual Port Random Access Memory.

<!-- Source EN PDF p.4, block 4 -->

## 2. Overview

<!-- Source EN PDF p.4, block 5 -->

The Double Data Rate Serial Memory Controller(DSMC) features high bandwidth with fewer pins by time- division multiplexing the command, address, and data lines, with data transmitted on both the rising and falling edges. The data width supports x8, x16, and up to 4 chip selects. The protocol supports Hyperbus PSRAM, Xccela PSRAM, and Local bus. If using the Local bus protocol, the slave device must use the rockchips designed slave model or a device with a similar transmission protocol. If using HYPERBUS PSRAM or XCCELA PSRAM protocols, the slave device supports PSRAM chips from manufacturers such as Winbond, AP Memory, Cypress, and ISSI.

<!-- Source EN PDF p.4, block 6 -->

## 3. DSMC Driver

<!-- Source EN PDF p.4, block 7 -->

### 3.1 Driver Files

<!-- Source EN PDF p.4, block 8 -->

The DSMC driver file locations:

<!-- Source EN PDF p.4, block 9 -->

```text
drivers/memory/rockchip/dsmc-host.c /* Main driver program */
drivers/memory/rockchip/dsmc-controller.c /* The DSMC controller behavior configuration */
drivers/memory/rockchip/dsmc-lb-device.c /* The DSMC Local bus device */
```

<!-- Source EN PDF p.4, block 10 -->

### 3.2 DTS Configuration

<!-- Source EN PDF p.4, block 11 -->

```text
    dsmc: dsmc@2a280000 {
        ...
        clock-frequency = <100000000>; /* DSMC interface frequency */
        ...
        /* Slave device properties */
        slave {
            rockchip,dqs-dll = <0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs0
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs1
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs2
*/
                   0x20 0x20>; /* DQS0, DQS1 DLL delay for slave device cs3
*/
            /*
             * rockchip,ranges: Base address and size of DSMC access to slave device memory;
             * If different CS have different memory space sizes, configure the largest.
             * rockchip,ranges = <0x0 0x10000000 0x0 0x2000000> means that if the slave is
             * PSRAM, allocate 0x2000000 memory size for each CS;
             * If the slave is Local Bus, allocate 0x2000000 memory size for each region
             */
            rockchip,ranges = <0x0 0x10000000 0x0 0x2000000>;
            rockchip,slave-dev = <&dsmc_slave>;
        };
    };
    dsmc_slave: dsmc_slave {
        compatible = "rockchip,dsmc-slave";
        rockchip,clk-mode = <0>; /* Clock mode, only for Local bus */
        status = "disabled";
        /*
         * Enable the corresponding slave device cs nodes when the slave
         * device is PSRAM (Hyperbus Psram or Xccela Psram).
         */
        psram {
            /*
             * When using PSRAM, there is no need to specify the bit width as
             * the driver automatically adapts it.
             */
            psram0 {
                status = "disabled"; /* If the slave device cs0 is PSRAM, change to "okay"
*/
            };
            psram1 {
                status = "disabled"; /* If the slave device cs1 is PSRAM, change to "okay"
*/
            };
            psram2 {
                status = "disabled"; /* If the slave device cs2 is PSRAM, change to "okay"
*/
            };
            psram3 {
                status = "disabled"; /* If the slave device cs3 is PSRAM, change to "okay"
*/
            };
        };
        /* Enable and configure the corresponding nodes if the slave is a Local bus device
*/
        lb-slave {
            rockchip,io-width = <16>; /* The data width of the local bus slave */
            dsmc_lb_slave0: lb-slave0 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x0>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If the cs0 slave is a Local bus, change to "okay" */
                dsmc_p0_region: region {
                    dsmc_p0_region0: region0 {/* Attributes of this slave region0 */
                        rockchip,attribute = "Merged FIFO";/* The region0 is merged FIFO */
                        rockchip,ca-addr-width = <0>;/* CA transfer format, 0: 32bit, 1:
16bit */
                        rockchip,dummy-clk-num = <1>;/* Write transfer dummy clk cycle
number */
                        rockchip,cs0-be-ctrled = <0>;/* cs0 is controlled by cs1, cs2, cs3
*/
                        rockchip,cs0-ctrl = <0>; /* cs0 controls cs1, cs2, cs3 */
                        status = "disabled";
                    };
                    dsmc_p0_region1: region1 {/* Attributes of this slave region1 */
                        rockchip,attribute = "No-Merge FIFO";/* region1 is unmerged FIFO */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region2: region2 {/* Attributes of this slave region2 */
                        rockchip,attribute = "DPRA";/* region2 is DPRAM */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region3: region3 {/* Attributes of this slave region3 */
                        rockchip,attribute = "Register";/* region3 is register */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave1: lb-slave1 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x1>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs1 slave is a Local bus, change to "okay" */
                dsmc_p1_region: region {
                    dsmc_p1_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave2: lb-slave2 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x2>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs2 slave is a Local bus, change to "okay" */
                dsmc_p2_region: region {
                    dsmc_p2_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave3: lb-slave3 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x3>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs3 slave is a Local bus, change to "okay" */
                dsmc_p3_region: region {
                    dsmc_p3_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region3: region3 {
                        rockchip,attribute = "Register";
                    rockchip,ca-addr-width = <0>;
                    rockchip,dummy-clk-num = <1>;
                    rockchip,cs0-be-ctrled = <0>;
                    rockchip,cs0-ctrl = <0>;
                    status = "disabled";
                };
            };
        };
    };
};
```

<!-- Source EN PDF p.9, block 21 -->

Based on the type of the actual slave device, the user needs to enable the corresponding node. For PSRAM devices, the corresponding psramx node should be enabled based on the sequential number of the CS connected to the PCB. Whether it is Hyperbus or Xccela PSRAM, it will be automatically detected by the driver. When the slave device is an RK-designed DSMC slave, the corresponding lb_slavex node should be enabled based on the sequential number of the CS connected to the PCB. Additionally, the configuration of the corresponding region needs to be modified according to the attributes of the slave device. The clk-mode parameter controls the three supported clock behaviors: The clk-mode = 0 indicates no clock during CS high level, but clock is present during CS low level; The clk-mode = 1 indicates the clock is always present regardless of CS changes, allowing the slave device to use it as a reference clock. However, in this mode, high- frequency operation is not possible and various adjustable AC timing parameters are not available. The clk- mode = 2 indicates that there is a clock during both CS high and low levels, but several clocks will be disabled before and after the CS transition edge.

<!-- Source EN PDF p.9, block 22 -->

For the Local bus device, memory space is as follows:

<!-- Source EN PDF p.9, block 23 -->

![Source technical figure — PDF 9](/docs/rockchip-dsmc/assets/en-p09-figure1.png)

Editable transcription of the figure:

| Region | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (merged) | FIFO (merged) | FIFO (merged) | FIFO (merged) |
| 1 | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.9, block 24 -->

Each slave device's chip select (CS) access space can be divided into 1, 2, or 4 regions (equally divided). Only the corresponding "status" attribute of the region needs to be enabled in the Device Tree Source (DTS) file.

<!-- Source EN PDF p.9, block 25 -->

For the rockchip,ranges property, such as rockchip,ranges = `<0x0 0x10000000 0x0 0x2000000>` it configures the starting address and size of the memory space in the slave device. The meaning of these values varies depending on the type of peripheral.

<!-- Source EN PDF p.10, block 26 -->

If the slave is PSRAM, the rockchip,ranges property configures the size of the maximum CS space. The memory space division for each CS is as follows:

<!-- Source EN PDF p.10, block 27 -->

![Source technical figure — PDF 10](/docs/rockchip-dsmc/assets/en-p10-figure1.png)

Editable transcription of the figure:

| CS | Start boundary | Next boundary |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.10, block 28 -->

If the slave is Local Bus, the rockchip,ranges property configures the size of the maximum region space. In the case of only enabling the Register and merged-FIFO 2 regions, the region space division for each CS is as follows:

<!-- Source EN PDF p.10, block 29 -->

![Source technical figure — PDF 10](/docs/rockchip-dsmc/assets/en-p10-figure2.png)

Editable transcription of the figure:

| CS | Region | Start boundary | Next boundary |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.11, block 30 -->

### 3.3 kernel Configuration

<!-- Source EN PDF p.11, block 31 -->

```text
Symbol: ROCKCHIP_DSMC [=y]
       │
  │ Type : bool
       │
  │ Prompt: Rockchip DSMC(Double Data Rate Serial Memory Controller) driver
       │
  │ Depends on: MEMORY [=y]
       │
  │ Location:
       │
  │ -> Device Drivers
       │
  │ -> Memory Controller drivers (MEMORY [=y])
       │
  │ -> Rockchip DSMC(Double Data Rate Serial Memory Controller) driver (ROCKCHIP_DSMC
[=y])│
```

<!-- Source EN PDF p.11, block 32 -->

## 4. Kernel Mode Access to DSMC

<!-- Source EN PDF p.11, block 33 -->

### 4.1 Driver Interface Invocation

<!-- Source EN PDF p.11, block 34 -->

The DSMC driver in drivers/memory/rockchip/dsmc-host.c implements the following access interfaces:

<!-- Source EN PDF p.11, block 35 -->

```text
struct rockchip_dsmc_device *rockchip_dsmc_find_dev(void);
static struct dsmc_ops rockchip_dsmc_ops = {
    .read = dsmc_read,
    .write = dsmc_write,
    .copy_from = dsmc_copy_from,
    .copy_from_state = dsmc_copy_from_state,
    .copy_to = dsmc_copy_to,
    .copy_to_state = dsmc_copy_to_state,
};
```

<!-- Source EN PDF p.12, block 36 -->

By calling the function rockchip_dsmc_find_device_by_compat() , the DSMC device is searched for, and the private parameters of this device are obtained. CPU and DMA access to the DSMC slave device is implemented through dsmc_dev.ops . The ops->read and ops->write are used for CPU read and write operations to the DSMC slave device's memory space. The ops->copy_from is used for DMA to read from the slave device memory and write to the host's memory. The ops->copy_to is used for DMA to write from the host's memory to the slave device memory.

<!-- Source EN PDF p.12, block 37 -->

```text
static void test(void)
{
    u32 cs;
    struct rockchip_dsmc_device *dsmc_dev;
    dsmc_dev = rockchip_dsmc_find_device_by_compat(rockchip_dsmc_get_compat(0));
    if (dsmc_dev == NULL){
        printk("error: can not find dsmc device\n");
        return 0;
    }
    for (cs = 0; cs < DSMC_MAX_SLAVE_NUM; cs++) {
        if (dsmc_dev->dsmc.cfg.cs_cfg[i].device_type == DSMC_UNKNOWN_DEVICE)
            continue;
        dsmc_dev->ops->write(dsmc_dev, cs, 0, test_addr, test_data);
        /* TODO */
    }
}
```

<!-- Source EN PDF p.12, block 38 -->

### 4.2 Direct Access

<!-- Source EN PDF p.12, block 39 -->

The CPU or master can directly access the DSMC slave memory space (supporting random address access for Byte, half-word, and word; supporting cacheable, uncacheable, and write-combine mapping methods).

<!-- Source EN PDF p.12, block 40 -->

## 5. User Mode Access to DSMC

<!-- Source EN PDF p.12, block 41 -->

### 5.1 Access through Specific Nodes

<!-- Source EN PDF p.12, block 42 -->

In the case of Local Bus enabled, the DSMC driver will create 4 slave device chip select (CS) nodes under /dev/dsmc/ , and under each CS, 4 memory regions will be created, with each attribute corresponding to the descriptions in the DTS. If there is a need to access the merged-FIFO, it corresponds to region0, and the corresponding region node under the respective CS needs to be operated. The process is as follows:

<!-- Source EN PDF p.12, block 43 -->

1\. Use the open() interface to open the corresponding region device node and obtain the file descriptor.

<!-- Source EN PDF p.12, block 44 -->

2\. Use the mmap() system call to map the aforementioned region device memory into the process address space and obtain the mapped address.

<!-- Source EN PDF p.12, block 45 -->

3\. Read and write device memory.

<!-- Source EN PDF p.12, block 46 -->

4\. Use munmap() to unmap the memory.

<!-- Source EN PDF p.13, block 47 -->

5\. Use close() to close the file descriptor.

<!-- Source EN PDF p.13, block 48 -->

The code example is as follows:

<!-- Source EN PDF p.13, block 49 -->

```text
device_name = "/dev/dsmc/cs0/region0"
wantbytes = 0x200000;
memfd = open(device_name, O_RDWR | O_SYNC);
if (memfd == -1) {
    fprintf(stderr, "failed to open %s for physical memory: %s\n",
        device_name, strerror(errno));
    exit(EXIT_FAILURE);
}
/*
 * Open the file with O_SYNC flag and MAP_LOCKED flag to make the
 * memory space uncached for mmap operation.
 */
buf = (void volatile *) mmap(0, wantbytes, PROT_READ | PROT_WRITE,
                                 MAP_SHARED | MAP_LOCKED, memfd,
                                 0x0);
if (buf == MAP_FAILED) {
        fprintf(stderr, "failed to mmap %s for physical memory: %s\n",
                device_name, strerror(errno));
        exit(EXIT_FAILURE);
}
bufsize = wantbytes;
halflen = bufsize / 2;
count = halflen / sizeof(u32);
bufa = (u32v *) buf;
bufb = (u32v *) ((size_t) buf + halflen);
test_dsmc(bufa, bufb, count);/* Read or write DSMC slave memory */
if (munmap((void*)buf, wantbytes) == -1) {
    perror("munmap");
    close(memfd);
    exit(EXIT_FAILURE);
}
close(memfd);
```

<!-- Source EN PDF p.13, block 50 -->

### 5.2 Direct Access

<!-- Source EN PDF p.13, block 51 -->

The CPU can directly access the DSMC slave memory space mapped by dev/mem . For example, on RK3576, use the io command to access region0 of the DSMC slave memory: io -4 0x10000000 .

<!-- Source EN PDF p.14, block 52 -->

## 6. DSMC Slave Memory Allocation

<!-- Source EN PDF p.14, block 53 -->

The allocation of memory space for DSMC slaves is controlled by the rockchip,ranges attribute, which configure the starting address and size of the device's memory space.

<!-- Source EN PDF p.14, block 54 -->

### 6.1 PSRAM

<!-- Source EN PDF p.14, block 55 -->

For example, if configuring map, ranges = `<0x0 0x10000000 0x0 0x2000000>`; and the slave is PSRAM, the map, ranges configuration represents the size of the maximum CS (Chip Select) space. For the DSMC controller, each slave has the same capacity. If different slaves are populated with PSRAM of different capacities, it is important to pay attention to the boundaries when accessing them. The memory space allocation for each slave is as follows:

<!-- Source EN PDF p.14, block 56 -->

![Source technical figure — PDF 14](/docs/rockchip-dsmc/assets/en-p14-figure1.png)

Editable transcription of the figure:

| CS | Start boundary | Next boundary |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.14, block 57 -->

Note: In theory, DSMC supports different slave with PSRAM from different manufacturers, allowing for different capacities. However, the bit width (x8 or x16) of different slave must be the same.

<!-- Source EN PDF p.14, block 58 -->

### 6.2 Local bus

<!-- Source EN PDF p.14, block 59 -->

If the slave is the Local Bus, each slave has the same capacity for the DSMC controller as well. Each slave can be divided into 1, 2, or 4 regions, with each region having attributes such as DPRAM, Register, merged FIFO, and un-merged FIFO. If the actual capacities of the regions in each slave are different, attention should be paid to the boundaries when accessing them.

<!-- Source EN PDF p.15, block 60 -->

![Source technical figure — PDF 15](/docs/rockchip-dsmc/assets/en-p15-figure1.png)

Editable transcription of the figure:

| Region | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (merged) | FIFO (merged) | FIFO (merged) | FIFO (merged) |
| 1 | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.15, block 61 -->

For the Local Bus, the map, ranges configuration represents the size of the maximum region space.

<!-- Source EN PDF p.15, block 62 -->

If the slave has 2 regions enabled, the size of each region is determined by the DTS (Device Tree Source) with map, ranges = 0x0 0x10000000 0x0 0x2000000 for the DSMC node of the slave device. The memory space allocation for each region in each CS is as follows:

<!-- Source EN PDF p.15, block 63 -->

![Source technical figure — PDF 15](/docs/rockchip-dsmc/assets/en-p15-figure2.png)

Editable transcription of the figure:

| CS | Region | Start boundary | Next boundary |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.16, block 64 -->

## 7. DSMC Local bus data interaction between the host and slave

<!-- Source EN PDF p.16, block 65 -->

### 7.1 FIFO

<!-- Source EN PDF p.16, block 66 -->

When the DSMC uses the Local bus protocol and is connected to an rockchips designed slave, the slave has a FIFO. When accessing a region with the attributes "merged-FIFO" or "un-merged FIFO", the data transmitted from the host passes through the FIFO and is then written into the slave's memory, such as DDR or SRAM. This FIFO is not visible, and for the DSMC host, the memory space of the slave's DDR or SRAM is considered the slave's memory space. Any data written through DSMC will ultimately be written into the slave's memory. It is important to manage the slave's memory space and ensure data consistency when using it.

<!-- Source EN PDF p.16, block 67 -->

### 7.2 Register

<!-- Source EN PDF p.16, block 68 -->

When the DSMC uses the Local bus protocol and is connected to an rockchips designed slave, there is a register called "SLAVE_CSR Register". When accessing a region with the attribute "Register", it refers to accessing this segment of the SLAVE_CSR Register. This segment can be used for fast information exchange between the host and slave.

<!-- Source EN PDF p.16, block 69 -->

The registers available for information exchange:

<!-- Source EN PDF p.16, block 70 -->

![Source technical figure — PDF 16](/docs/rockchip-dsmc/assets/en-p16-figure1.png)

Editable transcription of the figure:

| APP_CONx | LBC_CONx |
|---|---|
| APP_CON0 | LBC_CON0 |
| APP_CON1 | LBC_CON1 |
| ... | ... |
| APP_CON14 | LBC_CON14 |
| APP_CON15 | LBC_CON15 |

<!-- Source EN PDF p.16, block 71 -->

Among them, the APP_CONx registers have read and write permissions for the slave, while the host only has read permissions. The LBC_CONx registers have read permissions for the slave, while the host has read and write permissions.

<!-- Source EN PDF p.16, block 72 -->

When the host writes to the LBC_CONx registers, it triggers a host2slave interrupt to the slave's CPU, which is used to process the data transmitted from the host.

<!-- Source EN PDF p.16, block 73 -->

When the slave writes to the APP_CONx registers, it triggers a slave2host interrupt through the INT pin, which is then received by the host. The host's CPU can also respond to the interrupt and retrieve the data passed from the slave. After receiving the INT signal, DSMC can also initiate a DMA hardware request to start data transfer (DMA needs to be configured in advance).

<!-- Source EN PDF p.16, block 74 -->

Typical Scenario 1

<!-- Source EN PDF p.16, block 75 -->

The host writes information to the LBC_CONx registers, triggering a host2slave interrupt. The slave reads the information from the LBC_CONx registers. The slave writes information to the APP_CONx registers, triggering a slave2host interrupt. The host reads the information from the APP_CONx registers.

<!-- Source EN PDF p.16, block 76 -->

Typical Scenario 2

<!-- Source EN PDF p.17, block 77 -->

After the DSMC and DMA on the host side are configured, the host notifies the slave by writing to the LBC_CONx registers. The slave then writes to the APP_CONx registers to return a valid signal to the host through the INT pin. After receiving this signal, DSMC host initiates a DMA hardware request to start the data transfer.

<!-- Source EN PDF p.17, block 78 -->

Note: APP_CON15 and LBC_CON15 are already in use. The DSMC driver for DMA hardware request has been implemented. When the host's DMA configuration is completed, the host writes the original value of LBC_CON15 plus 1 to the LBC_CON15 register. The slave, upon receiving this data, writes 1 to the APP_CON15 register to trigger a slave2host interrupt. DSMC host automatically initiates a certain number of DMA hardware requests upon receiving this interrupt, initiating the data transfer.

<!-- Source EN PDF p.17, block 79 -->

## 8. Note

<!-- Source EN PDF p.17, block 80 -->

### 8.1 Interface Frequency on DSMC IO

<!-- Source EN PDF p.17, block 81 -->

1\. It is configured by the parameter clock-frequency = `<100000000>`; in the dsmc node of the dts. However, the actual frequency may not exactly match the target frequency due to dependencies on the PLL or crystal oscillator output of the current platform. The final frequency will be set to the closest achievable value.

<!-- Source EN PDF p.17, block 82 -->

2\. The DSMC controller has an inherent fixed 2-divider, meaning the frequency provided by the PLL or crystal oscillator to the DSMC controller is twice the frequency on the DSMC IO interface.

<!-- Source EN PDF p.17, block 83 -->

### 8.2 Regarding DSMC Bit Width

<!-- Source EN PDF p.17, block 84 -->

1\. The bit width of an externally connected DSMC slave cannot be auto-detected. By default, the code assumes a x16 bit width. If an RK3506 is connected as a DSMC slave (which only supports x8 bit width), the bit width must be manually corrected.

<!-- Source EN PDF p.17, block 85 -->

In the new version, the io-width of the slave can be modified in the dts.

<!-- Source EN PDF p.17, block 86 -->

```text
&dsmc_slave {
    status = "okay";
    lb-slave {
        rockchip,io-width = <8>;
        ...
    };
};
```

<!-- Source EN PDF p.17, block 87 -->

For the old version, it needs to be modified in the code.

<!-- Source EN PDF p.18, block 88 -->

```text
diff --git a/drivers/memory/rockchip/dsmc-host.c b/drivers/memory/rockchip/dsmc-host.c
index 44182923acc9..5214c9128320 100644
--- a/drivers/memory/rockchip/dsmc-host.c
+++ b/drivers/memory/rockchip/dsmc-host.c
@@ -782,7 +782,7 @@ static void dsmc_data_init(struct rockchip_dsmc *dsmc)
                        cs_cfg->rd_bdr_xfer_en = 1;
                        cs_cfg->wr_bdr_xfer_en = 1;
                } else {
- cs_cfg->io_width = MCR_IOWIDTH_X16;
+ cs_cfg->io_width = MCR_IOWIDTH_X8;
                        cs_cfg->wrap_size = DSMC_BURST_WRAPSIZE_16CLK;
                        cs_cfg->wrap2incr_en = 1;
                        cs_cfg->acs = 1;
```

<!-- Source EN PDF p.18, block 89 -->

2\. If connected to PSRAM, the bit width is auto-detected and does not require manual modification. If the PSRAM supports both x8 and x16 modes, the x16 mode is used by default.

<!-- Source EN PDF p.18, block 90 -->

### 8.3 System Boot Failure After Enabling DSMC

<!-- Source EN PDF p.18, block 91 -->

After DSMC is enabled, it attempts to read/write from/to the slave. If an access error occurs (e.g., no DQS signal returned during read), DSMC reports an error to the bus, causing the system to enter an exception state. A typical error log is as follows:

<!-- Source EN PDF p.18, block 92 -->

```text
...
[ 1.391589] dsmc 21ca0000.dsmc: init cs0 LB device # After being loaded, the DSMC driver
will access the slave.
[ 1.394238] 8<--- cut here ---
[ 1.394243] Unhandled fault: external abort on non-linefetch (0x1008) at 0xf0600100
[ 1.394250] [f0600100] *pgd=40b0f811, *pte=10000653, *ppte=10000453
[ 1.394267] Internal error: Oops - BUG: 1008 [#1] PREEMPT SMP THUMB2
...
```

<!-- Source EN PDF p.18, block 93 -->

If this issue occurs, check the hardware connectivity between the DSMC master and slave.

<!-- Source EN PDF p.18, block 94 -->

Note: During DSMC master initialization, the slave must already be powered on and initialized; otherwise, access exceptions may occur.

<!-- Source EN PDF p.18, block 95 -->

### 8.4 DSMC Self-Test Status Abnormal

<!-- Source EN PDF p.18, block 96 -->

After the DSMC driver initialization is completed, it checks the DSMC status registers to confirm whether any abnormalities occurred during initialization. When the following abnormal messages appear, it indicates that there was an exception during initialization.

<!-- Source EN PDF p.18, block 97 -->

```text
dsmc ff8b0000.dsmc: DSMC: csr status error(0x800)! #The specific status error value may vary
dsmc ff8b0000.dsmc: DSMC status error, please check hardware matched(io, slave etc.)
```

<!-- Source EN PDF p.18, block 98 -->

If this issue occurs, check the hardware connectivity between the DSMC master and slave.

<!-- Source EN PDF p.19, block 99 -->

Note: During DSMC master initialization, the slave must already be powered on and initialized; otherwise, access exceptions may occur.

{% endraw %}

