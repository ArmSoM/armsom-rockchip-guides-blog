---
title: "Rockchip Linux SPI Developer Guide: Master/Slave, Drivers and Performance"
description: "Rockchip Linux SPI Developer Guide: Master/Slave, Drivers and Performance — V3.7.0"
excerpt: "Rockchip Linux SPI Developer Guide: Master/Slave, Drivers and Performance — V3.7.0"
translation_key: "144-rockchip-linux-spi"
slug: "144-rockchip-linux-spi"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "Linux"]
---

{% raw %}

Platform reference, source RK-KF-YF-020 (CN) / RK-KF-YF-075 (EN) V3.7.0, for the listed Rockchip SoCs and Linux 4.4/4.19+ BSPs; verify each feature. Matching ArmSoM boards/SDKs are not confirmed and no hardware validation was performed. Check SoC, kernel, patches, controller instance, IOMUX, voltages and wiring. Commands/results are vendor examples, not ArmSoM measurements. All four languages follow the Chinese technical baseline with English-only notes added. Differing source examples are retained separately at the end, not silently mixed. Chinese figures serve ZH; English originals serve EN/RU/DE.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.6 -->

## 1. Feature of Rockchip SPI

<!-- cn PDF p.6 -->

SPI (serial peripheral interface). Linux 4.4 features: Motorola SPI by default; 8/16-bit words; programmable clock; four modes; one or two chip selects per controller. In slave mode only SPI_CS0N may serve as CS input, without GPIO switching during transfer or CS1N substitution. Linux 4.19 additionally supports both slave and master in the framework. (Chinese baseline; the English source’s “Only holding SPI slave mode” wording is not adopted.)

<!-- cn PDF p.6 -->

### 1.1 SPI interface rate

<!-- cn PDF p.6 -->

| SOC | Master Mode Interface maximum<br>speed | Slave Mode Interface maximum<br>speed |
| --- | --- | --- |
| RK3506 | 50MHz | 50MHz |
| RV1126B | 50MHz/25MHz/20MHz | 50MHz/25MHz/20MHz |
| RV1106B/RV1103B | 50MHz | 33MHz |
| RK3576 | 50MHz | 33MHz |
| RK3562 | 50MHz | 33MHz |
| RK3528 | 50MHz | 33MHz |
| RV1106/RV1103 | 50MHz | 33MHz |
| RK3588 | 50MHz | 33MHz |
| RV1126/RV1109 | 50MHz | 16MHz |
| RK3568 | 50MHz | 33MHz |
| RK1808 | 50MHz | 16MHz |
| RK3308 | 50MHz | 16MHz |
| Others | 50MHz | 16MHz |

<!-- cn PDF p.7 -->

Note: The maximum speed of the interface is the theoretical rate, which is affected by the quality of the device's PCB wiring. The actual measurement shall prevail Due to PLL strategy reasons, some platforms are unable to accurately divide the frequency to the upper limit value. In reality, the maximum frequency division value shall prevail For RV1126B, different SPI interfaces support varying maximum speed: spi1m1 supports up to 50MHz, spi0m0 supports up to 25MHz, while all other SPI interfaces are limited to 20MHz maximum speed.

<!-- cn PDF p.7 -->

## 2. Kernel Software

<!-- cn PDF p.7 -->

### 2.1 Code Path

<!-- cn PDF p.7 -->

```text
drivers/spi/spi.c                spi驱动框架
drivers/spi/spi-rockchip.c       rk spi各接⼝实现
drivers/spi/spi-rockchip-slave.c rk spi slave各接⼝实现
drivers/spi/spidev.c             创建spi设备节点，⽤⼾态使⽤。
drivers/spi/spi-rockchip-test.c  spi测试驱动，需要⾃⼰⼿动添加到Makefile编译
Documentation/spi/spidev_test.c  ⽤⼾态spi测试⼯具
```

<!-- cn PDF p.7 -->

### 2.2 SPI Device Configuration: RK SPI As Master Port

<!-- cn PDF p.7 -->

Kernel Configuration

<!-- cn PDF p.7 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        <*>   Rockchip SPI controller driver
```

<!-- cn PDF p.7 -->

DTS Node Configuration

<!-- cn PDF p.7 -->

```text
&spi1 {                                             //引⽤spi 控制器节点
    status = "okay";
    //assigned-clocks = <CLK_SPI1>;                 //默认不⽤配置，CLK_SPIn 请从 soc 对应的 dtsi ⾥确认
    //assigned-clock-rates = <200000000>;           //默认不⽤配置，SPI 设备⼯作时钟值
    //dma-names;                                    //默认不⽤配置，关闭 DMA ⽀持，仅⽀持 IRQ 传输
    //rockchip,poll-only;                           //默认不⽤配置，开启后强制使⽤ CPU 传输，仅⽀持 master mode 下配置
    //rx-sample-delay-ns = <10>;                    //默认不⽤配置，读采样延时，详细参考 “常⻅问 题”“延时采样时钟配置⽅案” 章节
    //rockchip,autosuspend-delay-ms = <500>;        //默认不⽤配置，Runtime PM autosuspend 延 时，详细参考 “SPI 传输速率及 CPU 负载优化”
    //rockchip,rt;                                  //默认不⽤配置，将spi数据传输进程放到 SCHED_FIFO类中，其优先级为50
    spi_test@10 {
        compatible ="rockchip,spi_test_bus1_cs0";   //与驱动对应的名字
        reg = <0>;                                  //⽚选0或者1
        spi-cpha;                                   //设置 CPHA = 1，不配置则为 0
        spi-cpol;                                   //设置 CPOL = 1，不配置则为 0
        spi-lsb-first;                              //IO 先传输 lsb
        spi-max-frequency = <24000000>;             //spi clk输出的时钟频率，不超过50M
        status = "okay";                            //使能设备节点
    };
};
```

<!-- cn PDF p.8 -->

spi-max-frequency is the output clock divided from spiclk assigned-clock-rates. Internal division is even and at least 2: spiclk assigned-clock-rates &gt;= 2*spi-max-frequency. For 50MHz IO use assigned-clock-rates = &lt;100000000&gt;, spi-max-frequency = &lt;50000000&gt;. PLL selects the nearest value not exceeding 100MHz; divide by 2 for approximately 50MHz. Do not set spiclk below 24M. (Even division and PLL rounding are explicit in the Chinese baseline.)

<!-- cn PDF p.8 -->

### 2.3 SPI Device Configuration: RK SPI As Slave Port

<!-- cn PDF p.8 -->

Key Patch Recommended to use the SPI slave source code spi-rockchip-slave.c, as the SDK version issue, please confirm that the SDK has the following patch:

<!-- cn PDF p.8 -->

```text
commit 10cbf3c2c93fca6e5ec6c99b5bdb319ca0494d45
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Tue Nov 21 10:58:57 2023 +0800

    spi: rockchip-slave: Add code

    1.Implement one msg mechanism
    2.Support SRAM extension by dts rockchip,sram property

    Change-Id: I0fccc5d4347294488b5382ad3ba5ae72b35610f2
    Signed-Off-By: Jon Lin <jon.lin@rock-chips.com>
```

<!-- cn PDF p.8 -->

Instructions If no such patch, the customer can directly refer to Redmine FAE Project -&gt; Document -&gt; Development Configuration -&gt; SPI Path. Kernel Configuration

<!-- cn PDF p.8 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   SPI slave protocol handlers
        [*]   Rockchip SPI Slave controller driver
```

<!-- cn PDF p.8 -->

DTS Node Configuration

<!-- cn PDF p.8 -->

```text
&spi1 {
    compatible = "rockchip,spi-slave";       //优先使⽤ SPI slave 专⽤驱动
    status = "okay";
    //ready-gpios = <&gpio1 RK_PD2 GPIO_ACTIVE_LOW>;//建议配置，SPI slave 完成传输配置的信号，详细 参考“内核 SPI Slave 软件”章节
    //rockchip,cs-inactive-disable;                 //默认不⽤配置，当 SPI master 时序 tod_cs （Clk Rise To CS Rise Time） 超过多个 io 时钟周期，应开启配置来屏蔽检测 cs 释放动作
    slave {                                         //按照框架要求，SPI slave ⼦节点的命名需以 "slave" 开始
        compatible ="rockchip,spi_test_bus1_cs0";
        reg = <0>;                                  //⽚选仅⽀持 0
        spi-cpha;                                   //设置 CPHA = 1，不配置则为 0
        spi-cpol;                                   //设置 CPOL = 1，不配置则为 0
        spi-lsb-first;                              //IO 先传输 lsb
        status = "okay";                            //使能设备节点
    };
};
```

<!-- cn PDF p.9 -->

Note: RK SPI enables DMA transmission by default, and slave mode does not recommend turning off DMA transmission. When a transfer exceeds the controller's cache count, the software will configure it for DMA transfer to avoid interrupting the corresponding transmission in a timely manner.

<!-- cn PDF p.9 -->

### 2.4 SPI Slave Notice

<!-- cn PDF p.9 -->

#### 2.4.1 Suggest Performance Mode

<!-- cn PDF p.9 -->

When the master rate exceeds a certain frequency, it is recommended to set the transfer process in performance mode to avoid DRAM frequency conversion causing controller cache overflow: bits_per_word = 8btis, master io rate exceeds 5MHz bits_per_word = 16btis, master io rate exceeds 10MHz Reference code:

<!-- cn PDF p.9 -->

```text
diff --git a/drivers/spi/spi-rockchip-test.c b/drivers/spi/spi-rockchip-test.c
index 544d6038919a..c1037153ff86 100644
--- a/drivers/spi/spi-rockchip-test.c
+++ b/drivers/spi/spi-rockchip-test.c
@@ -36,6 +36,8 @@
 #include <linux/platform_data/spi-rockchip.h>
 #include <linux/uaccess.h>
 #include <linux/syscalls.h>
+#include <soc/rockchip/rockchip-system-status.h>
+#include <dt-bindings/soc/rockchip-system-status.h>

 #define MAX_SPI_DEV_NUM 10
 #define SPI_MAX_SPEED_HZ       12000000 @@ -242,8 +244,10 @@ static ssize_t spi_test_write(struct file *file,
                }

                start_time = ktime_get();
+               rockchip_set_system_status(SYS_STATUS_PERFORMANCE);
                for (i = 0; i < times; i++)
                        spi_read_slt(id, rxbuf, size);
+               rockchip_clear_system_status(SYS_STATUS_PERFORMANCE);
                end_time = ktime_get();
                cost_time = ktime_sub(end_time, start_time);
                us = ktime_to_us(cost_time);
```

<!-- cn PDF p.10 -->

Run all slave transfers in performance mode if possible. set/clear has overhead; configure at application level to avoid frequent calls. On overflow the slave cannot finish DMA and blocks without returning; inspect SPI-&gt;SPI_RISR. Chinese baseline says it cannot exit; English source says “block and exit”, a contradiction retained in the editorial record.

<!-- cn PDF p.10 -->

#### 2.4.2 Suggest 16bits Width

<!-- cn PDF p.10 -->

Make full use of slave fifo capacity to accelerate and minimize burst 2, which can accelerate the slave end DMA transmission rate and avoid fifo being stacked due to insufficient movement.

<!-- cn PDF p.10 -->

#### 2.4.3 Other Notes

<!-- cn PDF p.10 -->

SPI Slave Test Notes Spi is a slave, first start the slave read, then start the master write, otherwise the slave will not have read yet and the master has already written. Slave write, master read also needs to start the slave write first, because only after the master sends clk, the slave will work, and the master will immediately send or receive data. Example: On the basis of Chapter 3: First slave: echo write 0 1 16 &gt; /dev/spi_misc_test Then master: echo read 0 1 16 &gt; /dev/spi_misc_test

<!-- cn PDF p.10 -->

### 2.5 SPI Device Driver

<!-- cn PDF p.10 -->

Register device driver:

<!-- cn PDF p.10 -->

```text
#include <linux/init.h>
#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/spi/spi.h>

static int spi_test_probe(struct spi_device *spi)
{
    int ret;
    if(!spi)
        return -ENOMEM;
    spi->bits_per_word= 8;
    ret= spi_setup(spi);
    if(ret < 0) {
        dev_err(&spi->dev,"ERR: fail to setup spi\n");
        return-1;
    }

    return ret;
}

static int spi_test_remove(struct spi_device *spi)
{
    printk("%s\n",__func__);
    return 0;
}

static const struct of_device_id spi_test_dt_match[]= {
    {.compatible = "rockchip,spi_test_bus1_cs0", },
    {.compatible = "rockchip,spi_test_bus1_cs1", },
    {},
};
MODULE_DEVICE_TABLE(of, spi_test_dt_match);

static struct spi_driver spi_test_driver = {
    .driver = {
        .name  = "spi_test",
        .owner = THIS_MODULE,
        .of_match_table = of_match_ptr(spi_test_dt_match),
    },
    .probe = spi_test_probe,
    .remove = spi_test_remove,
};

static int __init spi_test_init(void)
{
    int ret = 0;
    ret = spi_register_driver(&spi_test_driver);
    return ret;
}
module_init(spi_test_init);

static void __exit spi_test_exit(void)
{
    return spi_unregister_driver(&spi_test_driver);
}
module_exit(spi_test_exit);
```

<!-- cn PDF p.11 -->

For SPI read and write operations, please refer to include/linux/spi/spi.h .

<!-- cn PDF p.12 -->

```text
static inline int
spi_write(struct spi_device *spi,const void *buf, size_t len)
static inline int
spi_read(struct spi_device *spi,void *buf, size_t len)
static inline int
spi_write_and_read(structspi_device *spi, const void *tx_buf, void *rx_buf, size_t len)
```

<!-- cn PDF p.12 -->

### 2.6 User mode SPI device Configuration

<!-- cn PDF p.12 -->

User mode SPI device means operating the SPI interface in user space directly, which makes it convenient for many SPI peripheral drivers run in user space. There is no need to change the kernel to facilitate driver development. Kernel Configuration

<!-- cn PDF p.12 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   User mode SPI device driver support
```

<!-- cn PDF p.12 -->

DTS Configuration

<!-- cn PDF p.12 -->

```text
&spi0 {
    status = "okay";
    max-freq = <50000000>;
    spi_test@0 {
        compatible = "rockchip,spidev";
        reg = <0>;
        spi-max-frequency = <5000000>;
    };
};
```

<!-- cn PDF p.12 -->

Using Instruction After the driver device is successfully registered, a device like this name will be displayed: /dev/spidev1.1 For the demo of spidev operation, please refer to: Kernel 4.4 Documentation/spi/spidev_test.c Kernel 4.19 and later tools/spi/spidev_test.c After the kernel project is compiled, enter the corresponding path and enter the following command to directly compile the standard SPI app program:

<!-- cn PDF p.12 -->

```text
make CROSS_COMPILE=~/path-to-toolchain/gcc-xxxxx-toolchain/bin/xxxx-linux-gnu-       # 选择 kernel 所⽤ CROSS_COMPILE
```

<!-- cn PDF p.12 -->

It supports the configuration of SPI slave devices. Refer to "SPI Device Configuration: RK SPI As Slave Port", in which the DTS configuration sub node should remain "rockchip, spidev"

<!-- cn PDF p.13 -->

### 2.7 Support cs-gpios

<!-- cn PDF p.13 -->

Users can use the cs-gpios attribute of spi-bus to implement gpio simulation cs to extend SPI chip selection signal. Users can refer to the kernel document Documentation/devicetree/bindings/spi/spi-bus.txt to learn more about cs-gpios.

<!-- cn PDF p.13 -->

#### 2.7.1 Configuration of Linux 4.4

<!-- cn PDF p.13 -->

This support needs more support patches. Please contact RK Engineer for the corresponding patches.

<!-- cn PDF p.13 -->

#### 2.7.2 Configuration of Linux 4.19 and above

<!-- cn PDF p.13 -->

Take spi1_cs2n in GPIO0_C4 for example: Set the cs-gpio pin and reference it in the SPI node

<!-- cn PDF p.13 -->

```text
diff --git a/arch/arm/boot/dts/rv1126-evb-v10.dtsi b/arch/arm/boot/dts/rv1126-evb-v10.dtsi
index 144e9edf1831..c17ac362289e 100644
--- a/arch/arm/boot/dts/rv1126-evb-v10.dtsi
+++ b/arch/arm/boot/dts/rv1126-evb-v10.dtsi

&pinctrl {
        ...
+
+       spi1 {
+               spi1_cs0n: spi1-cs1n {
+                       rockchip,pins =
+                               <0 RK_PC2 RK_FUNC_GPIO &pcfg_pull_up_drv_level_0>;
+               };
+               spi1_cs1n: spi1-cs1n {
+                       rockchip,pins =
+                               <0 RK_PC3 RK_FUNC_GPIO &pcfg_pull_up_drv_level_0>;
+               };
+               spi1_cs2n: spi1-cs2n {
+                       rockchip,pins =
+                               <0 RK_PC4 RK_FUNC_GPIO &pcfg_pull_up_drv_level_0>;
+               };
+       };
};

diff --git a/arch/arm/boot/dts/rv1126.dtsi b/arch/arm/boot/dts/rv1126.dtsi
index 351bc668ea42..986a85f13832 100644
--- a/arch/arm/boot/dts/rv1126.dtsi
+++ b/arch/arm/boot/dts/rv1126.dtsi

spi1: spi@ff5b0000 {
        compatible = "rockchip,rv1126-spi", "rockchip,rk3066-spi";
        reg = <0xff5b0000 0x1000>;
        interrupts = <GIC_SPI 11 IRQ_TYPE_LEVEL_HIGH>;
        #address-cells = <1>;
        #size-cells = <0>;
        clocks = <&cru CLK_SPI1>, <&cru PCLK_SPI1>;
        clock-names = "spiclk", "apb_pclk";
        dmas = <&dmac 3>, <&dmac 2>;
        dma-names = "tx", "rx";
        pinctrl-names = "default", "high_speed";
-       pinctrl-0 = <&spi1m0_clk &spi1m0_cs0n &spi1m0_cs1n &spi1m0_miso &spi1m0_mosi>;
-       pinctrl-1 = <&spi1m0_clk_hs &spi1m0_cs0n &spi1m0_cs1n &spi1m0_miso_hs &spi1m0_mosi_hs>;
+       pinctrl-0 = <&spi1m0_clk &spi1_cs0n &spi1_cs1n &spi1_cs2n &spi1m0_miso &spi1m0_mosi>;
+       pinctrl-1 = <&spi1m0_clk_hs &spi1_cs0n &spi1_cs1n &spi1_cs2n &spi1m0_miso_hs &spi1m0_mosi_hs>
        status = "disabled";
};
```

<!-- cn PDF p.14 -->

SPI node reassigns CS pin

<!-- cn PDF p.14 -->

```text
+&spi1 {
+       status = "okay";
+       max-freq = <48000000>;
+       cs-gpios = <&gpio0 RK_PC2 GPIO_ACTIVE_LOW>, <&gpio0 RK_PC3 GPIO_ACTIVE_LOW>, <&gpio0 RK_PC4 GPIO_ACTIVE_LOW>;
        spi_test@0 {
                compatible = "rockchip,spi_test_bus1_cs0";
...
+       spi_test@2 {
+               compatible = "rockchip,spi_test_bus1_cs2";
+               id = <2>;
+               reg = <0x2>;
+               spi-cpha;
+               spi-cpol;
+               spi-lsb-first;
+               spi-max-frequency = <16000000>;
+       };
};
```

<!-- cn PDF p.14 -->

Note: If you want to extend cs with gpio, all cs should be converted to gpio function and supported by cs-gpios property.

<!-- cn PDF p.14 -->

## 3. SPI Testing Driver in Kernel

<!-- cn PDF p.14 -->

### 3.1 Code Path

<!-- cn PDF p.14 -->

```text
drivers/spi/spi-rockchip-test.c
```

<!-- cn PDF p.15 -->

### 3.2 SPI Testing Device Configuration

<!-- cn PDF p.15 -->

Kernel patch:

<!-- cn PDF p.15 -->

```text
需要⼿动添加编译：
drivers/spi/Makefile
+obj-y                                  += spi-rockchip-test.o
```

<!-- cn PDF p.15 -->

DTS Configuraion

<!-- cn PDF p.15 -->

```text
&spi0 {
    status = "okay";
    spi_test@0 {
        compatible = "rockchip,spi_test_bus0_cs0";
        id = <0>;                                       //这个属性spi-rockchip-test.c⽤来区分不 同的spi从设备的
        reg = <0>;                                      //chip select  0:cs0  1:cs1
        spi-max-frequency = <24000000>;                 //spi output clock
    };
    spi_test@1 {
        compatible = "rockchip,spi_test_bus0_cs1";
        id = <1>;
        reg = <1>;
        spi-max-frequency = <24000000>;
    };
};
```

<!-- cn PDF p.15 -->

Driver log

<!-- cn PDF p.15 -->

```text
[    0.457137]
rockchip_spi_test_probe:name=spi_test_bus0_cs0,bus_num=0,cs=0,mode=11,speed=16000000
[    0.457308]
rockchip_spi_test_probe:name=spi_test_bus0_cs1,bus_num=0,cs=1,mode=11,speed=16000000
```

<!-- cn PDF p.15 -->

### 3.3 Test Command

<!-- cn PDF p.15 -->

```text
echo write 0 10 255 > /dev/spi_misc_test
echo write 0 10 255 init.rc > /dev/spi_misc_test
echo read 0 10 255 > /dev/spi_misc_test
echo loop 0 10 255 > /dev/spi_misc_test
echo setspeed 0 1000000 > /dev/spi_misc_test
```

<!-- cn PDF p.15 -->

The above means: Echo type id number of loops transfer length &gt; /dev/spi_misc_test Echo setspeed id frequency (in Hz) &gt; /dev/spi_misc_test You can modify the test case by yourself if you want.

<!-- cn PDF p.16 -->

## 4. SPI Slave Software In Kernel

<!-- cn PDF p.16 -->

### 4.1 Introduction

<!-- cn PDF p.16 -->

SPI master/slave normally use a protocol, e.g. SPI NOR with JEDEC SDFP (source spelling). RK supplies a custom reference protocol/driver where no universal scheme exists. Linux uses a transfer queue: high priority after wake-up cannot guarantee real time because of scheduling. RK slave needs controller reconfiguration for every transfer, so a sideband ready signal informs the master; GPIO IRQ on falling edge is recommended. The protocol requires ready-gpios: 1) slave calls spi_sync; 2) enables GPIO_SLV_READY; 3) master confirms ready and starts; 4) sufficient master clocks complete the transfer.

<!-- cn PDF p.16 -->

![English source figure (p.19)](/docs/rockchip-linux-spi/assets/en-p019-figure-01.png)

*English source figure (p.19)*

<!-- cn PDF p.16 -->

Define two types of packages: Ctrl packet: 2B cmd, 2B addr (application buffer offset address defined by RK slave), 4B data (usually used to specify the transmission length of subsequent data packets) data packet Define two types of transmission: Ctrl transmission, only containing 1 ctrl packet Data transfer, including two SPI transfers of 1 ctrl packet and 1 data packet spidev_rkslv support SPI_OBJ_APP_RAM_SIZE Bytes application buffer for transmission buffer, The data transmission 1 ctrl packet 2B addr initiated by the SPI master points to the cache offset address Device Driver Key Patch:

<!-- cn PDF p.17 -->

```text
commit d2fef34977c1a7aab3837d29ac8dc3b5378a2754 (HEAD -> develop-4.19)
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Wed Dec 20 12:02:14 2023 +0800

    spi: spidev_rkslv: Support dynamic adjustment of system performance

    If the DRAM frequency conversion jitters during the transmission process,
    it will cause the DMA to be unable to transport SPI FIFO data in a timely
    manner, resulting in FIFO overflow/underflow.

    Clear performance status for short cmd packet and Set the performance
    status for data packet.

    Change-Id: I65532ba309677a8d98c8277875a3bd358ca44e44
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- cn PDF p.17 -->

Note: If no such patch, the customer can directly refer to Redmine FAE Project -&gt; Document -&gt; Development Configuration -&gt; SPI Path. Driver source code:

<!-- cn PDF p.17 -->

```text
drivers/spi/spidev-rkslv.c
drivers/spi/spidev-rkmst.c
```

<!-- cn PDF p.17 -->

Source description: drivers/spi/spidev-rkslv.c:

<!-- cn PDF p.17 -->

```text
static int spidev_rkslv_ctrl_receiver_thread(void *p)                   //建⽴线程，线程内重复发 起传输
{
    while (1)
        spidev_rkslv_xfer(spidev);
}

static int spidev_rkslv_xfer(struct spidev_rkslv_data *spidev)          //传输⼊⼝
{
    spidev_slv_read(spidev, spidev->ctrlbuf, SPI_OBJ_CTRL_MSG_SIZE);    //1 ctrl packet，获取 并解析传输类型
    switch (ctrl->cmd) {                                                //1 data packet，根据 传输类型，定义 data packet 并完成收发
    case SPI_OBJ_CTRL_CMD_INIT:
        /* to-do */
    case SPI_OBJ_CTRL_CMD_READ:
        /* to-do */
    case SPI_OBJ_CTRL_CMD_WRITE:
        /* to-do */
    case SPI_OBJ_CTRL_CMD_DUPLEX:
        /* to-do */
    }
}
static const struct file_operations spidev_rkslv_misc_fops = {}          //注册 misc device 测试接⼝
```

<!-- cn PDF p.18 -->

drivers/spi/spidev-rkmst.c:

<!-- cn PDF p.18 -->

```text
static int spidev_rkmst_xfer(struct spidev_rkmst_data *spidev, void *tx, void *rx, u16 addr,
u32 len)  //传输⼊⼝
{
    spidev_rkmst_ctrl(spidev, cmd, addr, len);                           //1 ctrl packet，定 义传输类型
    switch (cmd) {                                                       //1 data packet，根 据传输类型，定义 data packet 并完成收发
    case SPI_OBJ_CTRL_CMD_READ:
        /* to-do */
    case SPI_OBJ_CTRL_CMD_WRITE:
        /* to-do */
    case SPI_OBJ_CTRL_CMD_DUPLEX:
        /* to-do */
    }
}

static const struct file_operations spidev_rkmst_misc_fops = {}          //注册 misc device 测试接⼝
```

<!-- cn PDF p.18 -->

Implement business

<!-- cn PDF p.18 -->

![English source figure (p.21)](/docs/rockchip-linux-spi/assets/en-p021-figure-01.png)

*English source figure (p.21)*

<!-- cn PDF p.18 -->

The purpose of providing "SPI Slave Software In Kernel" is to provide reference for protocol and device drivers, and the end customer should also define their product requirements on the application buffer of the slave end to achieve business.

<!-- cn PDF p.19 -->

### 4.2 SPI Slave Testing Device Configuration

<!-- cn PDF p.19 -->

Defconfig configuration:

<!-- cn PDF p.19 -->

```text
CONFIG_SPI_SLAVE_ROCKCHIP_OBJ=y
```

<!-- cn PDF p.19 -->

RK SPI slave end dts reference configuration:

<!-- cn PDF p.19 -->

```text
&spi1 {
    compatible = "rockchip,spi-slave";
    status = "okay";
    rockchip,cs-inactive-disable;                             //RK 内部互联使⽤ RK Linux SPI master 驱动，tod_cs 较⻓
    ready-gpios = <&gpio1 RK_PD3 GPIO_ACTIVE_LOW>;            //请设置为实际所⽤ GPIO
    slave {
        compatible = "rockchip,spi-obj-slave";
        reg = <0x0>;
        spi-cpha;
        spi-cpol;
        spi-lsb-first;
        spi-max-frequency = <50000000>;
    };
};
```

<!-- cn PDF p.19 -->

RK SPI master dts reference configuration:

<!-- cn PDF p.19 -->

```text
&spi0 {
    status = "okay";
    spi_test@00 {
        compatible = "rockchip,spi-obj-master";
        reg = <0x0>;
        spi-cpha;
        spi-cpol;
        spi-lsb-first;
        spi-max-frequency = <16000000>;
        ready-gpios = <&gpio1 RK_PD2 GPIO_ACTIVE_LOW>;         //请设置为实际所⽤ GPIO
    };
};
```

<!-- cn PDF p.19 -->

### 4.3 Test Command

<!-- cn PDF p.19 -->

SPI master initiates single packet data transmission testing

<!-- cn PDF p.19 -->

```text
echo cmd addr length > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.19 -->

cmd supports read/write/duplex.

<!-- cn PDF p.20 -->

addr: peer slave application-buffer offset in Bytes, decimal only. length: data-packet length in Bytes, decimal only. Example:

<!-- cn PDF p.20 -->

```text
echo write 128 128 > /dev/spidev_rkmst_misc
echo read 128 128 > /dev/spidev_rkmst_misc
echo duplex 128 128 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

SPI master initiates Test automation

<!-- cn PDF p.20 -->

```text
echo autotest length loops compare > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

Note: autotest: Fixed input, test full duplex data transmission first, then test read and write data transmission, and output rate results The test defaults to using the opposite slave application buffer offset address 0 length: The length of the data packet, in Bytes, only supports decimal input loops: Set the number of pressure testing cycles compare: 1 - enable verification, 0 - disable verification(support specific scenarios, such as continuous output data for signal testing) The strength is as follows:

<!-- cn PDF p.20 -->

```text
echo autotest 1024 64 1 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

SPI slave testing

<!-- cn PDF p.20 -->

```text
echo appmem 0 256 > ./dev/spidev_rkslv_misc      #打印 application buffer 数据
echo verbose 1 > ./dev/spidev_rkslv_misc         #开启传输传输过程 debug log，echo verbose 0 关 闭打印
```

<!-- cn PDF p.20 -->

## 5. FAQ

<!-- cn PDF p.20 -->

### 5.1 SPI no signal

<!-- cn PDF p.20 -->

Confirm that the driver is running before debugging Ensure that the IOMUX configuration of the SPI 4 pins is correct . Confirm that during the TX sending, the TX pin has a normal waveform, CLK has a normal CLOCK signal, and the CS signal is pulled low. If the clock frequency is high, considering increasing the drive strength to improve the signal. How to simply judge whether SPI DMA is enabled or not? If the serial port printing does not have the following keywords, DMA is enabled successfully:

<!-- cn PDF p.20 -->

```text
[    0.457137] Failed to request TX DMA channel
[    0.457237] Failed to request RX DMA channel
```

<!-- cn PDF p.21 -->

### 5.2 How to design application code in SPI

<!-- cn PDF p.21 -->

Please select the appropriate object function interface before writing the driver. Custom SPI device driver Refer to "SPI Device Driver", for example: drivers/spi/spi-rockchip-test.c. Application program based on spidev standard device node Refer to "User mode SPI device Configuration"

<!-- cn PDF p.21 -->

### 5.3 Delay sampling clock configuration

<!-- cn PDF p.21 -->

In the case of high SPI IO rate, the normal SPI mode may still not match the output delay of external devices, and RK SPI master read may not be able to sample valid data. SPI RSD logic needs to be enabled to delay the sampling clock. RK SPI RSD (read sample delay) control logic has the following characteristics: The assignable values are 0, 1, 2, 3 The delay unit is 1 spi_clk cycle, i.e. the working clock of the controller, see "SPI Device Configuration" for details rx-sample-delay actual delay is the RSD effective value closest to the DTS set value, subject to spi_clk 200MHz, cycle 5ns, for example: The actual configurable delay of RSD is 0, 5ns, 10ns and 15ns. RX sample delay is set to 12ns, which is close to the effective value of 10ns, so the final delay is 10ns.

<!-- cn PDF p.21 -->

### 5.4 SPI transmission method description

<!-- cn PDF p.21 -->

Master supports IRQ/DMA/CPU; slave supports IRQ/DMA. Default: IRQ for length &lt; FIFO depth, DMA for length &gt;= FIFO depth. FIFO depth is normally 64 for SoCs on kernel 4.19+. Master may keep combined mode, disable DMA for IRQ-only, or use rockchip,poll-only for CPU-only. Slave cannot change modes. Below FIFO depth, one transfer generates one interrupt.

<!-- cn PDF p.22 -->

At &gt;= FIFO depth with IRQ transfer, the watermark is half FIFO, usually 32 items, producing roughly items / 32 interrupts. DMA does not generate a SPI-controller interrupt; it uses the DMA-finished callback.

<!-- cn PDF p.22 -->

### 5.5 SPI Transfer Rate and CPU Usage Optimization Directions

<!-- cn PDF p.22 -->

The reasons for slow SPI transfer rates and high CPU usage under heavy IO load are usually related to small transfer granularity and frequent transfer requests, which involve the following: SPI thread scheduling Interrupt scheduling (refer to the "SPI Transfer Mode Explanation" section to confirm if interrupt transfers are used) CPU idle scheduling Recommended optimization directions:

<!-- cn PDF p.22 -->

1. Enable auto runtime suspend with a delay of 500ms (specific value may vary based on actual testing). Modify the DTS node by adding the rockchip,autosuspend-delay-ms property.

<!-- cn PDF p.22 -->

2. Reduce CPU load: Switch to IRQ-based transfers, which may have advantages over DMA. Refer to the "Switch to IRQ Transfers" subsection for patch reference.

<!-- cn PDF p.22 -->

3. Reduce CPU load: If using DMA transfers, modify the TX DMA waterline to reduce the time CPU spends waiting for FIFO transfers to complete in the DMA callback function. Refer to the "Modify SPI Waterline" patch. Patch references: Switch to IRQ Transfers

<!-- cn PDF p.22 -->

```text
diff --git a/arch/arm/boot/dts/rv1126-evb-v10.dtsi b/arch/arm/boot/dts/rv1126-evb-v10.dtsi
index 86dd23482d97..2cea93d2423f 100644
--- a/arch/arm/boot/dts/rv1126-evb-v10.dtsi
+++ b/arch/arm/boot/dts/rv1126-evb-v10.dtsi
@@ -1367,6 +1367,7 @@
        status = "okay";
        max-freq = <48000000>;
        cs-gpios = <0>, <0>, <&gpio0 RK_PC4 GPIO_ACTIVE_LOW>;
+       dma-names;
        spi_test@00 {
```

<!-- cn PDF p.22 -->

Modify SPI Waterline

<!-- cn PDF p.22 -->

```text
diff --git a/drivers/spi/spi-rockchip.c b/drivers/spi/spi-rockchip.c
index 27fd6f671b12..bd0fa8c5f8c3 100644
--- a/drivers/spi/spi-rockchip.c
+++ b/drivers/spi/spi-rockchip.c
@@ -616,7 +616,8 @@ static void rockchip_spi_config(struct rockchip_spi *rs,
        else
                writel_relaxed(rs->fifo_len / 2 - 1, rs->regs + ROCKCHIP_SPI_RXFTLR);

-       writel_relaxed(rs->fifo_len / 2 - 1, rs->regs + ROCKCHIP_SPI_DMATDLR);
+       // writel_relaxed(rs->fifo_len / 2 - 1, rs->regs + ROCKCHIP_SPI_DMATDLR);
+       writel_relaxed(11, rs->regs + ROCKCHIP_SPI_DMATDLR);
        writel_relaxed(rockchip_spi_calc_burst_size(xfer->len / rs->n_bytes) - 1,
                       rs->regs + ROCKCHIP_SPI_DMARDLR);
        writel_relaxed(dmacr, rs->regs + ROCKCHIP_SPI_DMACR);
```

## Source differences: English examples and note

The following English examples differ from the Chinese baseline in comments, wrapping or example content. They are retained verbatim for traceability, not as interchangeable configurations. The English-only final note says patches target the Rockchip SPI driver and RV1126-EVB-V10 DTS; other hardware/software may need adaptation. Chinese explicit even division, downward PLL rounding and blocking without exit on overflow are the common baseline; the English “block and exit” contradiction is not adopted.

### EN p.8 / source unit 38

```text
drivers/spi/spi.c               /* SPI Driver framework */
drivers/spi/spi-rockchip.c      /* RK SPI Slave implement of interface */
drivers/spi/spi-rockchip-slave.c      /* RK SPI Slave implement of interface */
drivers/spi/spidev.c            /* Create SPI device node for using */
```

### EN p.9 / source unit 39

```text
drivers/spi/spi-rockchip-test.c /* SPI test driver, it needs to add to Makefile compiler manually. */
Documentation/spi/spidev_test.c /* SPI test tool in user state */
```

### EN p.9 / source unit 44

```text
&spi1 {                                  //Quote SPI controller node
    status = "okay";
    //assigned-clocks = <CLK_SPI1>;      //Not configured by default, depend on soc dtsi
    //assigned-clock-rates = <200000000>;//Not configured by default, spi controller work clock
    //dma-names;                         //Not configured by default, turn off DMA support, only supports IRQ transmission
    //rockchip,poll-only;                //Not configured by default,  turn to use CPU transmission, only master mode supported
    //rx-sample-delay-ns = <10>;         //Not configured by default, Read sampling delay. Please refer to "FAQ" and "Delay sampling clock configuration" for details
    //rockchip, autosuspend-delay-ms = <500>; //Not configured by default, Runtime PM autosuspend delay, refer to "SPI Transfer Rate and CPU Usage Optimization Directions" for details.
    //rockchip,rt;                       //Not configured by default,Place SPI data transfer process into SCHED_FIFO, its priority is 50
    spi_test@10 {
        compatible ="rockchip,spi_test_bus1_cs0";   //The name corresponding to the driver
        reg = <0>;                       //Chip select 0 or 1
        spi-cpha;                        //If configure it, cpha is 1
        spi-cpol;                        //If configure it,cpol is 1, the clk pin remains high level.
        spi-lsb-first;                   //IO firstly transfer lsb
        status = "okay";                 //Enable device node
        spi-max-frequency = <24000000>;  //This is clock frequency of SPI clk output,witch does not exceed 50M.
    };
};
```

### EN p.10 / source unit 53

```text
&spi1 {
    compatible = "rockchip,spi-slave";       //priority use SPI slave dedicated driver
    status = "okay";
    //ready-gpios = <&gpio1 RK_PD2 GPIO_ACTIVE_LOW>;//recommend configuring, SPI slave complete transmission flag, refer to "kernel SPI Slave Software" chapter
    //rockchip,cs-inactive-disable;                 //default do not configure, when SPI master timing tod_cs (Clock Rise To CS Rise Time) is over multiple io clock cycles, should open config to detect cs release action
    slave {                                         //according to framework requirement, SPI slave sub node's name should start with "slave"
        compatible ="rockchip,spi_test_bus1_cs0";
        reg = <0>;                                  //only support single chip select
```

### EN p.11 / source unit 54

```text
        spi-cpha;                                   //set CPHA = 1, do not configure otherwise
        spi-cpol;                                   //set CPOL = 1, do not configure otherwise
        spi-lsb-first;                              //IO Input lsb first
        status = "okay";                            //enable device node
    };
};
```

### EN p.14 / source unit 78

```text
make CROSS_COMPILE=~/path-to-toolchain/gcc-xxxxx-toolchain/bin/xxxx-linux-gnu-       # Choose kernel toolchain
```

### EN p.17 / source unit 98

```text
&spi0 {
    status = "okay";
    spi_test@0 {
        compatible = "rockchip,spi_test_bus0_cs0";
        id = <0>;       //This attribute is used to distinguish different SPI slave devices in "spi-rockchip-test.c".
        reg = <0>;      //chip select  0:cs0  1:cs1
        spi-max-frequency = <24000000>;                 //spi output clock
    };
    spi_test@1 {
        compatible = "rockchip,spi_test_bus0_cs1";
        id = <1>;
        reg = <1>;
        spi-max-frequency = <24000000>;
    };
};
```

### EN p.20 / source unit 115

```text
static int spidev_rkslv_ctrl_receiver_thread(void *p)                   //Establish a thread and repeatedly initiate transfers within the thread
{
    while (1)
        spidev_rkslv_xfer(spidev);
}

static int spidev_rkslv_xfer(struct spidev_rkslv_data *spidev)          //Transmission entrance
{
    spidev_slv_read(spidev, spidev->ctrlbuf, SPI_OBJ_CTRL_MSG_SIZE);    //1 ctrl packet to obtain and parse the transmission type
    switch (ctrl->cmd) {                                                //1 data packet, define data packets based on the transmission type and complete sending and receiving
    case SPI_OBJ_CTRL_CMD_INIT:
            /* to-do */
    case SPI_OBJ_CTRL_CMD_READ:
            /* to-do */
    case SPI_OBJ_CTRL_CMD_WRITE:
            /* to-do */
    case SPI_OBJ_CTRL_CMD_DUPLEX:
            /* to-do */
    }
}

static const struct file_operations spidev_rkslv_misc_fops = {}          //Register misc device test interface
```

### EN p.20 / source unit 117

```text
static int spidev_rkmst_xfer(struct spidev_rkmst_data *spidev, void *tx, void *rx, u16 addr,
u32 len)  //Transmission entrance
{
    spidev_rkmst_ctrl(spidev, cmd, addr, len);                           //1 ctrl packet, defining the transmission type
    switch (cmd) {                                                       //1 data packet, define data packets based on the transmission type and complete sending and receiving
    case SPI_OBJ_CTRL_CMD_READ:
            /* to-do */
    case SPI_OBJ_CTRL_CMD_WRITE:
            /* to-do */
    case SPI_OBJ_CTRL_CMD_DUPLEX:
            /* to-do */
    }
}

static const struct file_operations spidev_rkmst_misc_fops = {}          //Register misc device test interface
```

### EN p.21 / source unit 125

```text
&spi1 {
    status = "okay";
    spi-slave;
    rockchip,cs-inactive-disable;                             //RK internal interconnection using RK Linux SPI master driver, and the tod_cs takes a long time
    ready-gpios = <&gpio1 RK_PD3 GPIO_ACTIVE_LOW>;            //Please set to the actual GPIO used
    slave {
        compatible = "rockchip,spi-obj-slave";
        reg = <0x0>;
        spi-cpha;
        spi-cpol;
        spi-lsb-first;
        spi-max-frequency = <50000000>;
    };
};
```

### EN p.22 / source unit 127

```text
&spi0 {
    status = "okay";
    spi_test@00 {
        compatible = "rockchip,spi-obj-master";
        reg = <0x0>;
        spi-cpha;
        spi-cpol;
        spi-lsb-first;
        spi-max-frequency = <16000000>;
        ready-gpios = <&gpio1 RK_PD2 GPIO_ACTIVE_LOW>;
    };
};
```

### EN p.23 / source unit 138

```text
echo appmem 0 256 > ./dev/spidev_rkslv_misc      #Print application buffer data
echo verbose 1 > ./dev/spidev_rkslv_misc         #Enable the transmission process debug log,
echo verbose 0, and close printing
```

{% endraw %}
