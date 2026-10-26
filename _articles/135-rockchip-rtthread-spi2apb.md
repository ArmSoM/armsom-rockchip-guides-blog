---
title: "Rockchip RT-Thread SPI2APB Developer Guide"
description: "Rockchip RT-Thread SPI2APB Developer Guide — V1.2.0"
excerpt: "Rockchip RT-Thread SPI2APB Developer Guide — V1.2.0"
translation_key: "135-rockchip-rtthread-spi2apb"
slug: "135-rockchip-rtthread-spi2apb"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Rockchip platform reference for the RK RT-Thread SDK, covering RK2108/RK2118 (SPI2APB mainly RK2118). Matching ArmSoM board support is unconfirmed; no hardware validation was performed. Check SoC, SDK/BSP, RT-Thread version, controller type, IOMUX, wiring and voltage domains before adaptation. Commands and test results are source examples, not ArmSoM measurements; no hardware or flash operations were executed. Only a Chinese original is available; all four languages use Chinese source figures.

RK-KF-YF-498 · V1.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. Introduction

<!-- cn PDF p.4 -->

### 1.1 Important notes

<!-- cn PDF p.4 -->

SPI2APB overlays an RK proprietary protocol on standard SPI, unlike the more general RK SPI without this extra protocol. Take this distinction into account when reviewing schematics.

<!-- cn PDF p.4 -->

### 1.2 Controller features

<!-- cn PDF p.4 -->

Supports SPI modes 0/2 (mode 0 recommended), 8-bit transfers and interrupts; reads/writes internal controller registers. LSB/MSB and Little Endian/Big Endian are configurable. Only simplex transfers and slave mode are supported. The SPI master must send data according to SPI2APB. Basic protocol: `<CMD-32bits> [ADDR-32bits] [DUMMY-32bits] [READ_BEGING-32bits] [DATA]`. Specific protocols follow.

<!-- cn PDF p.4 -->

| Operation | Protocol | CMD-32bits Little Endian |
| --- | --- | --- |
| Read data | read data | &lt;0x00000077&gt; &lt;ADDR&gt; &lt;DUMMY&gt; &lt;READ_BEGING&gt; &lt;DATA&gt; |
| Write data | write data | &lt;0x00000011&gt; &lt;ADDR&gt; &lt;DATA&gt; |
| Write internal REG0 | write msg reg0 | &lt;0x00010011&gt; &lt;DATA-32bits&gt; |
| Write internal REG1, trigger interrupt | write msg reg1 | &lt;0x00020011&gt; &lt;DATA-32bits&gt; |
| Previous transfer status | query state | &lt;0x000000ff&gt; &lt;DATA-32bits&gt; |
| Read internal REG2 | query msg reg2 | &lt;0x000001ff&gt; &lt;DATA-32bits&gt; |

<!-- cn PDF p.4 -->

[ADDR-32bits] is an SPI2APB-supported memory address, usually SRAM/DRAM. [DUMMY-32bits] is unrestricted and may be 0. [READ_BEGING-32bits] is 0x000000AA. For query state return values see “State Register Information” in the TRM SPI2APB chapter.

<!-- cn PDF p.5 -->

### 1.3 Interface characteristics

<!-- cn PDF p.5 -->

| SoC | Max rate |
| --- | --- |
| RK2118 | 50MHz |

<!-- cn PDF p.5 -->

The maximum rate is theoretical; routing and PCB quality affect the actual result, which must be measured.

<!-- cn PDF p.5 -->

## 2. Software

<!-- cn PDF p.5 -->

### 2.1 Source paths

<!-- cn PDF p.5 -->

Framework code:

<!-- cn PDF p.5 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
```

<!-- cn PDF p.5 -->

Driver adaptation layer:

<!-- cn PDF p.5 -->

```text
bsp/rockchip/common/drivers/drv_spi2apb.c
bsp/rockchip/common/hal/lib/hal/src/hal_spi2apb.c
```

<!-- cn PDF p.5 -->

Test commands; applications may follow this driver:

<!-- cn PDF p.5 -->

```text
bsp/rockchip-common/tests/spi2apb_test.c
```

<!-- cn PDF p.5 -->

### 2.2 Configuration

<!-- cn PDF p.5 -->

Enable the option whose name includes SPI2APB.

<!-- cn PDF p.5 -->

```text
RT-Thread bsp drivers  --->
    RT-Thread rockchip "project" drivers  --->
        [*] Enable SPI
        [*]   Enable SPI0 (SPI2APB)
        [ ]   Enable SPI1
        [ ]   Enable SPI2
```

<!-- cn PDF p.5 -->

Configure board-level iomux.

<!-- cn PDF p.6 -->

### 2.3 Usage configuration

<!-- cn PDF p.6 -->

Defaults: LSB, Little Endian. Example modification in drv_spi2apb.c:

<!-- cn PDF p.6 -->

```text
diff --git a/bsp/rockchip/common/drivers/drv_spi2apb.c b/bsp/rockchip/common/drivers/drv_spi2apb.c
index 15045270fe..ef055d8d03 100644
--- a/bsp/rockchip/common/drivers/drv_spi2apb.c
+++ b/bsp/rockchip/common/drivers/drv_spi2apb.c
@@ -45,7 +45,7 @@ struct rockchip_spi2apb

 static struct rockchip_spi2apb rk_spi2apb =
 {
-    .device.config.mode = (SPI2APB_LITTLE_ENDIAN | SPI2APB_LSB),
+    .device.config.mode = (SPI2APB_LITTLE_ENDIAN | SPI2APB_MSB),
     .device.config.clock_polarity = SPI2APB_TXCP_INVERT,
     .base = SPI2APB,
     .irq = SPISLV0_IRQn,
```

<!-- cn PDF p.6 -->

Only LSB/MSB changes are recommended; keep the other defaults.

<!-- cn PDF p.6 -->

## 3. Testing

<!-- cn PDF p.6 -->

### 3.1 Configuration

<!-- cn PDF p.6 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI2APB TEST
```

<!-- cn PDF p.6 -->

### 3.2 Test commands

<!-- cn PDF p.6 -->

```text
spi2apb_test config spi2apb 1 2         # <mode> <polarity>
spi2apb_test cb spi2apb                 # 注册 SPI2APB->REG1 中断回调
spi2apb_test read spi2apb 0             # 读取 SPI2APB->REG0 信息，建议调试方式，先主 设备端参考 'write msg reg0' 协议写，后从设备端执行该命令读
spi2apb_test read spi2apb 1             # 读取 SPI2APB->REG1 信息，建议调试方式，先主 端参考 'write msg reg1' 协议写，后从端执行该命令读
spi2apb_test query spi2apb              # 读取 SPI2APB->SR 信息
spi2apb_test write spi2apb 0x12345678   # 写入 SPI2APB->REG2 信息，建议调试方式，先从 端执行该命令，后主端参考 'query msg reg2' 协议读
```

<!-- cn PDF p.7 -->

Master = SPI master; slave = RK SPI2APB slave. Configurable mode: bit0 0-LSB/1-MSB; bit1 0-LittleEndian/1-BigEndian. Configurable polarity is for debugging only; retain TX invert/RX normal in actual use, i.e. polarity =

<!-- cn PDF p.7 -->

2. bit0: 0-RX normal, 1-RX invert; bit1: 0-TX normal, 1-TX invert.

<!-- cn PDF p.7 -->

## 4. Application integration

<!-- cn PDF p.7 -->

Both peers must implement data flow and control information according to SPI2APB. Master-side application code and drivers may be developed from RK reference code. Source location cited by the original: SPI development materials — FAE project — Rockchip Redmine (rock-chips.com).

<!-- cn PDF p.7 -->

### 4.1 Basic architecture

<!-- cn PDF p.7 -->

![Chinese source figure (p.7)](/docs/rockchip-rtthread-spi2apb/assets/cn-p007-figure-01.png)

*Chinese source figure (p.7)*

Figure API/sequence transcription (original identifiers and numbering; not executable code)

```text
spidev_rkspi2apb_app -> spidev_rkspi2apb.c -> SPI driver -> spi master
spi2apb_test.c <-> SPI2APB RTOS driver -> SPI2APB IP -> spi2apb slave
SPI2APB IP -> SRAM
```

<!-- cn PDF p.7 -->

Example: RV1106 SPI master connected to RK2118 SPI2APB. Source components:

<!-- cn PDF p.8 -->

| Layer | Master (Linux 5.10) | Slave (HAL + RTOS) |
| --- | --- | --- |
| Application | spidev_rkspi2apb_app: ioctl/read/write | test_spi2apb.c: REG |
| Kernel driver | spidev_rkspi2apb.c: SPI2APB ioctl/read/write |  |
| Controller driver | spi-rockchip.c | drv_spi2apb.c<br>hal_spi2apb.c |
| Controller | spi master | spi2apb slave |

<!-- cn PDF p.8 -->

spidev_rkspi2apb.c ioctl interface:

<!-- cn PDF p.8 -->

```text
#define SPIDEV_RKSPI2APB_GET_DEV_STATE      _IOR(SPIDEV_RKSPI2APB_BASE, 0, __u32)
/* 参考 'query msg reg2' 协议 */
#define SPIDEV_RKSPI2APB_SET_DST_ADDR       _IOW(SPIDEV_RKSPI2APB_BASE, 1, __u32)
/* 设置传输的目标内存地址，指向从设备端内存地址 */
#define SPIDEV_RKSPI2APB_SEND_MSG       _IOW(SPIDEV_RKSPI2APB_BASE, 2, __u32) /* 参考 'write msg reg0' 协议 */
#define SPIDEV_RKSPI2APB_INT_REQ        _IOW(SPIDEV_RKSPI2APB_BASE, 3, __u32) /* 参考 'write msg reg1' 协议 */
```

<!-- cn PDF p.8 -->

Read/write in spidev_rkspi2apbc.c (source spelling):

<!-- cn PDF p.8 -->

```text
write(spidev_fd, buffer_w, size); /* 参考 'write data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
read(spidev_fd, buffer_r, size); /* 参考 'read data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
```

<!-- cn PDF p.8 -->

Target-address agreement: presetting is recommended. Reserve a known SRAM address on the slave; set it on the master with ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR. RT-Thread generally reserves the memory through __spi2apb_buffer_start__ in the linker script. Alternatively allocate SRAM on the slave and implement a custom exchange to send its address to the master, as in the sequence below.

<!-- cn PDF p.9 -->

![Chinese source figure (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-01.png)

*Chinese source figure (p.9)*

Figure API/sequence transcription (original identifiers and numbering; not executable code)

```text
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_INT_REQ -> SPI master
SPI master -> write reg1 -> SPI2APB slave -> interrupt call back -> SPI2APB APP
SPI2APB APP -> write address info to reg2 -> SPI2APB slave
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_GET_DEV_STATE -> read reg2
```

<!-- cn PDF p.9 -->

### 4.2 Flash Object service

<!-- cn PDF p.9 -->

Flash Object transports requests through spi/spi2apb so the SPI master can read/write the SPI NOR attached to the SPI2APB slave.

<!-- cn PDF p.9 -->

#### 4.2.1 Basic architecture

<!-- cn PDF p.9 -->

![Chinese source figure (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-02.png)

*Chinese source figure (p.9)*

Figure API/sequence transcription (original identifiers and numbering; not executable code)

```text
spi2apb_flash_obj_mst.c -> drv_spi.c -> spi master
spi2apb_test.c -> SRAM_SPI2APB_BASE
spi2apb slave <-> SRAM_SPI2APB_BASE <-> spinor
```

<!-- cn PDF p.9 -->

NOR flash read sequence:

<!-- cn PDF p.10 -->

![Chinese source figure (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-01.png)

*Chinese source figure (p.10)*

Figure API/sequence transcription (original identifiers and numbering; not executable code)

```text
1. cmd (CMD_READ)
2. write reg1
3. set reg2 (SLAVE_BUSY)
4. rt_mtd_nor_read
5. set reg (SLAVE_SUCCESS)
6. wait status (SLAVE_SUCCESS)
7. read data
8. read data
```

<!-- cn PDF p.10 -->

NOR flash write sequence:

<!-- cn PDF p.10 -->

![Chinese source figure (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-02.png)

*Chinese source figure (p.10)*

Figure API/sequence transcription (original identifiers and numbering; not executable code)

```text
1. write data
2. write data
3. cmd (CMD_PROG)
4. write reg1
5. set reg2 (SLAVE_BUSY)
6. rt_mtd_nor_erase/write
6. set reg (SLAVE_SUCCESS)
7. wait status (SLAVE_SUCCESS)
```

<!-- cn PDF p.10 -->

#### 4.2.2 Interfaces

<!-- cn PDF p.10 -->

flash_obj master interface:

<!-- cn PDF p.10 -->

```text
rt_err_t spi2apb_flash_obj_mst_init(struct rt_spi_device *spi_device);
/**
  * @brief  Write sector from remote spinor device.
  * @param  sec: pointer to spinor 4KB sector offset.
  * @param  buffer: data buffer.
  * @return rt_err_t
  */
rt_err_t spi2apb_flash_obj_mst_write_sector(rt_uint32_t sec, void *buffer);
/**
  * @brief  Read sector from remote spinor device.
  * @param  sec: pointer to spinor 4KB sector offset.
  * @param  buffer: data buffer.
  * @return rt_err_t
  */
rt_err_t spi2apb_flash_obj_mst_read_sector(rt_uint32_t sec, void *buffer);
```

<!-- cn PDF p.10 -->

flash_obj master SPI2APB wrapper interface:

<!-- cn PDF p.10 -->

```text
/**
  * @brief  Write data to remote sram by spi2apb interface.
  * @param  addr: pointer to remote sram address.
  * @param  buffer: data buffer.
  * @param  size: data size.
  * @param  trigger: if valid write spi2apb reg1 to trigger a interrupt.
  * @return rt_err_t
  */
static rt_err_t spi2apb_flash_obj_mst_spi2apb_progsram(uint32_t addr, uint8_t
*buffer, uint32_t size, uint32_t trigger);
/**
  * @brief  Read data from remote sram by spi2apb interface.
  * @param  addr: pointer to remote sram address.
  * @param  buffer: data buffer.
  * @param  size: data size.
  * @param  trigger: if valid write spi2apb reg1 to trigger a interrupt.
  * @return rt_err_t
  */
static rt_err_t spi2apb_flash_obj_mst_spi2apb_readsram(uint32_t addr, uint8_t
*buffer, uint32_t size, uint32_t trigger);
/**
  * @brief  Write msg reg in spi2apb.
  * @param  index: reg index.
  * @param  val: reg value.
  * @param  status: if valid check write success.
  * @return rt_err_t
  */
static rt_err_t spi2apb_flash_obj_mst_spi2apb_writemsg(uint8_t index, uint32_t
value, bool status);
/**
  * @brief  Query msg reg2 in spi2apb.
  * @return rt_err_t
  */
static uint32_t spi2apb_flash_obj_mst_spi2apb_querymsg(void);
/**
  * @brief  Query state abort last transmission.
  * @return uint32_t status.
  */
static uint32_t spi2apb_flash_obj_mst_spi2apb_querystatus(void);
```

<!-- cn PDF p.11 -->

flash_obj slave interface:

<!-- cn PDF p.11 -->

```text
rt_err_t spi_test_spi2apb_flash_obj_init(void);
static void spi_test_spi2apb_flash_obj_work(struct rt_work *work, void
*work_data);
rt_err_t spi_test_spi2apb_flash_obj_write(rt_uint8_t index, rt_uint16_t addr,
void *buffer);
rt_err_t spi_test_spi2apb_flash_obj_read(rt_uint8_t index, rt_uint16_t addr, void
*buffer);
rt_err_t spi_test_spi2apb_flash_obj_set_status(rt_uint8_t index, rt_uint8_t
status);
```

<!-- cn PDF p.11 -->

After initialization, register the SPI2APB interrupt callback. The reg1 bottom-half workqueue parses transactions, performs spinor read/write and sets state-machine status bits.

<!-- cn PDF p.12 -->

#### 4.2.3 Flash obj configuration

<!-- cn PDF p.12 -->

```text
CONFIG_RT_USING_COMMON_TEST_SPI2APB_FLASH_OBJ = y
```

<!-- cn PDF p.12 -->

#### 4.2.4 Flash obj test commands

<!-- cn PDF p.12 -->

flash_obj slave commands:

<!-- cn PDF p.12 -->

```text
spi2apb_test flash_obj spi2apb
```

<!-- cn PDF p.12 -->

flash_obj master commands:

<!-- cn PDF p.12 -->

```text
1. spi2apb_flash_obj_mst spi2apb_progsram <spi_dev> <size>
2. spi2apb_flash_obj_mst spi2apb_readsram <spi_dev> <size>
3. spi2apb_flash_obj_mst spi2apb_writemsg <spi_dev> <reg> <val>
4. spi2apb_flash_obj_mst spi2apb_querymsg <spi_dev>
5. spi2apb_flash_obj_mst write_sector <spi_dev> <sector> <val> <loops>
6. spi2apb_flash_obj_mst read_sector <spi_dev> <sector> <loops>
7. spi2apb_flash_obj_mst stress <spi_dev> <sector> <n_sec>
like:
        spi2apb_flash_obj_mst spi2apb_progsram spi1_0 32
        spi2apb_flash_obj_mst spi2apb_readsram spi1_0 32
        spi2apb_flash_obj_mst spi2apb_writemsg spi1_0 1 55
        spi2apb_flash_obj_mst spi2apb_querymsg spi1_0
        spi2apb_flash_obj_mst write_sector spi1_0 512 1 10
        spi2apb_flash_obj_mst read_sector spi1_0 512 10
        spi2apb_flash_obj_mst stress spi1_0 512 32
```

<!-- cn PDF p.12 -->

spi2apb_progsram uses SPI2APB write data; after writing, write msg reg1 triggers the SPI2APB interrupt. spi2apb_readsram uses read data, first waiting for reg2 status SPI2APB_FLASH_OBJ_CMD_READ_SRAM_READY. spi2apb_writemsg uses write msg reg0/1; spi2apb_querymsg uses read msg reg2. write_sector writes NOR flash; read_sector reads NOR flash; stress writes then reads back for stress testing. All three use a 4KB sector unit.

<!-- cn PDF p.12 -->

## 5. Troubleshooting

<!-- cn PDF p.12 -->

### 5.1 SPI2APB transfer failure

<!-- cn PDF p.12 -->

Following “Testing”, configure SPI mode 0, lsb, little-endian and register the callback:

<!-- cn PDF p.13 -->

```text
spi2apb_test config spi2apb 1 2
spi2apb_test cb spi2apb
```

<!-- cn PDF p.13 -->

The master must follow the data-transfer protocol. First try write reg1 to trigger the SPI2APB interrupt. Check common ground, valid master csn/clock on an oscilloscope, slave wiring and unpopulated 0Ω resistors.
For incorrect received data, reduce speed. Check for LSB/MSB or endianness mismatch. If only some data is valid and the pattern correlates with cache line size, the slave probably omitted cache-coherency operations around data access: normally invalidate after read transfer and flush before write transfer. If the read buffer was cleared or written beforehand, flush before transfer too.


## Technical links from the source

- [PDF reference 1](https://redmine.rock-chips.com/documents/125)

{% endraw %}
