---
title: "Rockchip RT-Thread SPI2APB 开发指南"
description: "Rockchip RT-Thread SPI2APB 开发指南 — V1.2.0"
excerpt: "Rockchip RT-Thread SPI2APB 开发指南 — V1.2.0"
translation_key: "135-rockchip-rtthread-spi2apb"
slug: "135-rockchip-rtthread-spi2apb"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

本篇为 Rockchip 平台参考：原稿适用于 RK RT-Thread SDK，文内涉及 RK2108/RK2118（SPI2APB 主要为 RK2118）。未确认对应 ArmSoM 板卡支持，未进行硬件验证。采用前须核对 SoC、SDK/BSP、RT-Thread 版本、控制器类型、IOMUX、接线和电压域。全部命令和测试结果均为原稿示例，不是 ArmSoM 实测；未执行任何硬件或 Flash 读写命令。仅有中文原稿，四语均使用中文原图，不伪称英文配图。

RK-KF-YF-498 · V1.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. 简介

<!-- cn PDF p.4 -->

### 1.1 须知

<!-- cn PDF p.4 -->

SPI2APB 控制器在标准的 SPI 通讯协议上叠加 RK 私有协议,不同于无叠加协议、更通用的的 RK SPI 模块,建议客户审图时关注该情况。

<!-- cn PDF p.4 -->

### 1.2 控制器特性

<!-- cn PDF p.4 -->

支持2种SPI模式,SPI mode 0/2,推荐使用 mode 0支持8bits 传输支持中断支持读写控制器内部寄存器支持 LSB/MSB 可配支持 Little Endian/Big Endian 可配仅支持单工传输仅支持 slave modeSPI master 应遵从 SPI2APB 协议发起特定数据的传输,协议基础框架 &lt;CMD-32bits&gt; [ADDR-32bits][DUMMY-32bits] [READ_BEGING-32bits] [DATA]支持以下具体数据传输协议:

<!-- cn PDF p.4 -->

| 简介 | Protocol | CMD-32bits Little Endian |
| --- | --- | --- |
| 读数据 | read data | &lt;0x00000077&gt; &lt;ADDR&gt; &lt;DUMMY&gt; &lt;READ_BEGING&gt; &lt;DATA&gt; |
| 写数据 | write data | &lt;0x00000011&gt; &lt;ADDR&gt; &lt;DATA&gt; |
| 写内部REG0 | write msg reg0 | &lt;0x00010011&gt; &lt;DATA-32bits&gt; |
| 写内部REG1并触发中断 | write msg reg1 | &lt;0x00020011&gt; &lt;DATA-32bits&gt; |
| 读取前次传输状态 | query state | &lt;0x000000ff&gt; &lt;DATA-32bits&gt; |
| 读内部REG2 | query msg reg2 | &lt;0x000001ff&gt; &lt;DATA-32bits&gt; |

<!-- cn PDF p.4 -->

说明:[ADDR-32bits] 为 SPI2APB 支持的内存地址,通常为 sram/dram[DUMMY-32bits] 值无要求,可以直接填 0[READ_BEGING-32bits] 值为 0x000000AAquery state 返回值参考 TRM SPI2APB 章节 “ State Register Information” 说明

<!-- cn PDF p.5 -->

### 1.3 接口特性

<!-- cn PDF p.5 -->

| SOC | 接口最高速率 |
| --- | --- |
| RK2118 | 50MHz |

<!-- cn PDF p.5 -->

说明:接口最高速率为理论速率,受设备走线 PCB 质量影响,以实测为准

<!-- cn PDF p.5 -->

## 2. 软件

<!-- cn PDF p.5 -->

### 2.1 代码路径

<!-- cn PDF p.5 -->

框架代码:

<!-- cn PDF p.5 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
```

<!-- cn PDF p.5 -->

驱动适配层:

<!-- cn PDF p.5 -->

```text
bsp/rockchip/common/drivers/drv_spi2apb.c
bsp/rockchip/common/hal/lib/hal/src/hal_spi2apb.c
```

<!-- cn PDF p.5 -->

测试命令,用户程序完全可以参照以下驱动:

<!-- cn PDF p.5 -->

```text
bsp/rockchip-common/tests/spi2apb_test.c
```

<!-- cn PDF p.5 -->

### 2.2 配置

<!-- cn PDF p.5 -->

打开配置带有 SPI2APB 字样的选项

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

板级配置 iomux。

<!-- cn PDF p.6 -->

### 2.3 使用配置

<!-- cn PDF p.6 -->

默认配置:LSB、Little Endiandrv_spi2apb.c 源码修改配置参考:

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

说明:建议只针对 LSB/MSB 做修改,其余配置默认配置

<!-- cn PDF p.6 -->

## 3. 测试

<!-- cn PDF p.6 -->

### 3.1 配置

<!-- cn PDF p.6 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI2APB TEST
```

<!-- cn PDF p.6 -->

### 3.2 测试命令

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

说明:主设备端 - SPI master,从端 - RK SPI2APB slavemode,支持可配:bit0:0-LSB 1-MSBbit1:0-LittleEndian 1-BigEndianpolarity,支持可配(仅做调试使用,实际请保持 TX invert/RX nornal 的默认配置,即 polarity =

<!-- cn PDF p.7 -->

2):bit0:0-RX normal 1-RX invertbit1:0-TX normal 1-TX invert

<!-- cn PDF p.7 -->

## 4. 业务搭建说明

<!-- cn PDF p.7 -->

SPI2APB 业务要求主从两端基于 SPI2APB 协议原理搭建数据流、控制信息等业务行为,其中运行在 SPImaster 主设备端的业务代码、设备驱动可以基于 RK 参考代码进一步开发,源码获取:SPI开发资料 -FAE 项目 - Rockchip Redmine (rock-chips.com)

<!-- cn PDF p.7 -->

### 4.1 业务基础原理

<!-- cn PDF p.7 -->

![中文原稿配图 (p.7)](/docs/rockchip-rtthread-spi2apb/assets/cn-p007-figure-01.png)

*中文原稿配图 (p.7)*

图中API/流程文字转录（原标识符与步骤编号保留，不是可运行代码）

```text
spidev_rkspi2apb_app -> spidev_rkspi2apb.c -> SPI driver -> spi master
spi2apb_test.c <-> SPI2APB RTOS driver -> SPI2APB IP -> spi2apb slave
SPI2APB IP -> SRAM
```

<!-- cn PDF p.7 -->

以 RV1106 SPI master 对接 RK2118 SPI2APB 为例,从源码认识业务实现:

<!-- cn PDF p.8 -->

| 所属层次 | 主设备(Linux 5.10) | 从设备(HAL + RTOS) |
| --- | --- | --- |
| 用户层业<br>务 | spidev_rkspi2apb_app c 程序,调用 spi2apb 设备节<br>点的 ioctl/read/write 接口 | test_spi2apb.c 程序,获取<br>REG 寄存器信息 |
| 内核态设<br>备驱动 | spidev_rkspi2apb.c 源码,依旧 spi2apb 协议实现<br>ioctl/read/write 接口 |  |
| 控制器驱<br>动 | spi-rockchip.c 源码 | drv_spi2apb.c<br>hal_spi2apb.c |
| 控制器 | spi master | spi2apb slave |

<!-- cn PDF p.8 -->

说明:spidev_rkspi2apb.c ioctl 接口说明:

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

spidev_rkspi2apbc.c 读写说明:

<!-- cn PDF p.8 -->

```text
write(spidev_fd, buffer_w, size); /* 参考 'write data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
read(spidev_fd, buffer_r, size); /* 参考 'read data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
```

<!-- cn PDF p.8 -->

如何协定 SPI2APB 传输的目标内存地址:预设定(推荐使用该方案),通常需要在从设备预留一块已知的目标 sram 地址作为传输地址,主设备端使用 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定,通常 RT-Thread 方案会在连接脚本中通过宏 __spi2apb_buffer_start__ 预留该内存自定义,从设备端申请一段 sram 地址空间,两端自定义业务,将地址信息最终传输到主设备端,例如以下参考流程:

<!-- cn PDF p.9 -->

![中文原稿配图 (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-01.png)

*中文原稿配图 (p.9)*

图中API/流程文字转录（原标识符与步骤编号保留，不是可运行代码）

```text
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_INT_REQ -> SPI master
SPI master -> write reg1 -> SPI2APB slave -> interrupt call back -> SPI2APB APP
SPI2APB APP -> write address info to reg2 -> SPI2APB slave
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_GET_DEV_STATE -> read reg2
```

<!-- cn PDF p.9 -->

### 4.2 Flash Object 业务

<!-- cn PDF p.9 -->

Flash object 业务通过 spi/spi2apb 接口传输数据请求最终实现 spi 主设备端读写 spi2apb 从设备端设备上spinor。

<!-- cn PDF p.9 -->

#### 4.2.1 基础原理

<!-- cn PDF p.9 -->

![中文原稿配图 (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-02.png)

*中文原稿配图 (p.9)*

图中API/流程文字转录（原标识符与步骤编号保留，不是可运行代码）

```text
spi2apb_flash_obj_mst.c -> drv_spi.c -> spi master
spi2apb_test.c -> SRAM_SPI2APB_BASE
spi2apb slave <-> SRAM_SPI2APB_BASE <-> spinor
```

<!-- cn PDF p.9 -->

读 nor flash 流程:

<!-- cn PDF p.10 -->

![中文原稿配图 (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-01.png)

*中文原稿配图 (p.10)*

图中API/流程文字转录（原标识符与步骤编号保留，不是可运行代码）

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

写 nor flash 流程:

<!-- cn PDF p.10 -->

![中文原稿配图 (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-02.png)

*中文原稿配图 (p.10)*

图中API/流程文字转录（原标识符与步骤编号保留，不是可运行代码）

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

#### 4.2.2 接口

<!-- cn PDF p.10 -->

flash_obj master 端接口:

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

flash_obj master 端 spi2apb 封装接口:

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

flash_obj slave 端接口:

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

说明:完成初始化后注册 spi2apb 中断 callback,reg1 下半文 workqueue 解析事务,完成 spinor read/write和状态机状态位设置

<!-- cn PDF p.12 -->

#### 4.2.3 Flash obj 配置

<!-- cn PDF p.12 -->

```text
CONFIG_RT_USING_COMMON_TEST_SPI2APB_FLASH_OBJ = y
```

<!-- cn PDF p.12 -->

#### 4.2.4 Flash obj 测试命令

<!-- cn PDF p.12 -->

flash_obj slave 端命令:

<!-- cn PDF p.12 -->

```text
spi2apb_test flash_obj spi2apb
```

<!-- cn PDF p.12 -->

flash_obj master 端命令:

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

说明:spi2apb_progsram 对应 spi2apb 协议 write data,完成写后 write msg reg1 触发 spi2apb 中断spi2apb_readsram 对应 spi2apb 协议 read data,读之前先等待 reg2 置位为 statusSPI2APB_FLASH_OBJ_CMD_READ_SRAM_READYspi2apb_writemsg 对应 spi2apb 协议 write msg reg0/1spi2apb_querymsg 对应 spi2apb 协议 read msg reg2write_sector 为 flash_obj 写 nor flash 操作,单位 sector 4KBread_sector 为 flash_obj 读 nor flash 操作,单位 sector 4KBstress 为 flash_obj 写回读拷机测试,单位 sector 4KB

<!-- cn PDF p.12 -->

## 5. 常见问题

<!-- cn PDF p.12 -->

### 5.1 SPI2APB 传输失败

<!-- cn PDF p.12 -->

建议参考 “测试” 章节,配置控制器为 SPI mode 0,lsb,小端,注册回调函数,命令如下:

<!-- cn PDF p.13 -->

```text
spi2apb_test config spi2apb 1 2
spi2apb_test cb spi2apb
```

<!-- cn PDF p.13 -->

说明:master 参考 “数据传输协议” 说明,发起传输,建议先尝试 "write reg1",触发 SPI2APB 中断,常规调试流程:互联设备是否已经共地示波器 master 设备测量 csn/clock 是否有有效信号slave 硬件线路是否连接正确,线路上是否有 0Ω 电阻未贴片master 传输后,slave 或 master 接收到错误的数据,常规调试流程:降速确认数据是否存在规律:是否匹配 LSB/MSB 或者大小端配置问题是否仅接收到部分有效数据,且数据是否与 cache line size 有关,如果是,大概率为 slave操作数据前后未添加 cache 一致性操作通常为在读传输后添加 cache invalid,在写传输前添加 cache flush如果读传输所用 buffer 有清零、写数据等动作,建议 传输前添加 cache flush


## 原稿技术参考链接

- [PDF reference 1](https://redmine.rock-chips.com/documents/125)

{% endraw %}
