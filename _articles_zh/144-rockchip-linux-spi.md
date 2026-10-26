---
title: "Rockchip Linux SPI 开发指南：主从模式、设备驱动与性能调试"
description: "Rockchip Linux SPI 开发指南：主从模式、设备驱动与性能调试 — V3.7.0"
excerpt: "Rockchip Linux SPI 开发指南：主从模式、设备驱动与性能调试 — V3.7.0"
translation_key: "144-rockchip-linux-spi"
slug: "144-rockchip-linux-spi"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "Linux"]
---

{% raw %}

平台参考，原稿 RK-KF-YF-020 (CN) / RK-KF-YF-075 (EN) V3.7.0。适用于原稿表列 Rockchip SoC 的 Linux 4.4/4.19 及以上 BSP；各特性须逐项核对。尚未确认具体 ArmSoM 板卡和对应 SDK/BSP 支持，未进行硬件验证。须检查 SoC、内核、驱动补丁、控制器实例、IOMUX、电压和接线。命令及测试结果均为原厂示例，不是 ArmSoM 实测。四语以中文为共同技术主线，英文独有说明另补；原稿代码差异在末尾并列保留，未静默混用。中文用中文原图，英俄德用英文原图。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.6 -->

## 1. Rockchip SPI 功能特点

<!-- cn PDF p.6 -->

SPI (serial peripheral interface),以下是 linux 4.4 SPI 驱动支持的一些特性..默认采用摩托罗拉 SPI 协议支持 8 位和 16 位软件可编程时钟频率支持 SPI 4 种传输模式配置每个 SPI 控制器支持一个到两个片选支持 spi slave mode,有且仅有 SPI_CS0N 作为 CS 输入脚:传输过程不允许切换为 GPIO function不支持 CS1N 替代除以上支持,linux 4.19 新增以下特性:框架支持 slave 和 master 两种模式

<!-- cn PDF p.6 -->

### 1.1 SPI 接口速率

<!-- cn PDF p.6 -->

| SOC | Master Mode 接口最高速率 | Slave Mode 接口最高速率 |
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
| 其他芯片平台 | 50MHz | 16MHz |

<!-- cn PDF p.7 -->

说明:接口最高速率为理论速率,受设备走线 PCB 质量影响,以实测为准部分平台由于 PLL 策略原因无法准确分频到上限值,实际以最大分频值为准对RV1126B,不同SPI所支持的接口最高速率不一致,spi1m1支持最高50MHz,spi0m0支持最高25MHz,其余spi仅支持最高20MHz

<!-- cn PDF p.7 -->

## 2. 内核软件

<!-- cn PDF p.7 -->

### 2.1 代码路径

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

### 2.2 SPI 设备配置 —— RK 芯片作 Master 端

<!-- cn PDF p.7 -->

内核配置

<!-- cn PDF p.7 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        <*>   Rockchip SPI controller driver
```

<!-- cn PDF p.7 -->

DTS 节点配置

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

spiclk assigned-clock-rates 和 spi-max-frequency 的配置说明:spi-max-frequency 是 SPI 的输出时钟,由 SPI 工作时钟 spiclk assigned-clock-rates 内部分频后输出,由于内部至少 2 分频,所以关系是 spiclk assigned-clock-rates &gt;= 2*spi-max-frequency;假定需要 50MHz 的 SPI IO 速率,可以考虑配置(记住内部分频为偶数分频)spi_clk assigned-clock-rates =&lt;100000000&gt;,spi-max-frequency = &lt;50000000&gt;,即工作时钟 100 MHz(PLL 分频到一个不大于 100MHz但最接近的值),然后内部二分频最终 IO 接近 50 MHz;spiclk assigned-clock-rates 不要低于 24M,否则可能有问题;

<!-- cn PDF p.8 -->

### 2.3 SPI 设备配置 —— RK 芯片作 Slave 端

<!-- cn PDF p.8 -->

关键补丁推荐使用 SPI slave 源码 spi-rockchip-slave.c,由于 SDK 版本问题,建议先确认 SDK 是否有以下补丁:

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

说明:如无该补丁,客戶可直接通过 Redmine -&gt; FAE 项目 -&gt; 文档 -&gt; 开发配置文档 -&gt; SPI 路径获取。内核配置

<!-- cn PDF p.8 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   SPI slave protocol handlers
        [*]   Rockchip SPI Slave controller driver
```

<!-- cn PDF p.8 -->

DTS 节点配置

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

说明:RK SPI 默认使能 DMA 传输,slave mode 不建议关闭 DMA 传输。当一笔传输超过控制器缓存数量,软件会配置为 DMA 传输,来避免中断传输相应不及时。

<!-- cn PDF p.9 -->

### 2.4 SPI Slave 须知

<!-- cn PDF p.9 -->

#### 2.4.1 建议设置 performance

<!-- cn PDF p.9 -->

当 master 速率超过一定频率后,建议传输过程设置 performance 模式,避免传输过程 DRAM 变频导致控制器缓存溢出:bits_per_word = 8btis,master io 速率超过 5MHzbits_per_word = 16btis,master io 速率超过 10MHz参考代码如下:

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

说明:建议所有 slave mode 传输行为都应在 performance mode 下运行set/clear performance 接口有一定的时间开销,所以建议业务上层设置,避免频繁调用如果缓存溢出,slave 无法完成 DMA 传输,会阻塞无法退出,通过打印 SPI-&gt;SPI_RISR 寄存器可以确认是否出现缓存溢出

<!-- cn PDF p.10 -->

#### 2.4.2 建议设置 16bits 宽度

<!-- cn PDF p.10 -->

最大限度利用 slave fifo 容量,加速且最小 burst 2,能加速 slave 端的 DMA 传输速率,避免 fifo 因为来不及搬移造成堆叠

<!-- cn PDF p.10 -->

#### 2.4.3 其他须知

<!-- cn PDF p.10 -->

SPI Slave 测试须知spi 做 slave,要先启动 slave read,再启动 master write,不然会导致 slave 还没读完,master 已经写完了。slave write,master read 也是需要先启动 slave write,因为只有 master 送出 clk 后,slave 才会工作,同时master 会立即发送或接收数据。例如:在第三章节的基础上:先 slave : echo write 0 1 16 &gt; /dev/spi_misc_test再 master: echo read 0 1 16 &gt; /dev/spi_misc_test

<!-- cn PDF p.10 -->

### 2.5 SPI 设备驱动介绍

<!-- cn PDF p.10 -->

设备驱动注册:

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

对 SPI 读写操作请参考 include/linux/spi/spi.h,以下简单列出几个

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

### 2.6 User mode SPI device 配置

<!-- cn PDF p.12 -->

User mode SPI device 指的是用戶空间直接操作 SPI 接口,这样方便众多的 SPI 外设驱动跑在用戶空间,不需要改到内核,方便驱动移植开发。内核配置

<!-- cn PDF p.12 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   User mode SPI device driver support
```

<!-- cn PDF p.12 -->

DTS 配置

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

使用说明驱动设备加载注册成功后,会出现类似这个名字的设备:/dev/spidev1.1设备节点的读写操作例程请参照:内核 4.4 Documentation/spi/spidev_test.c内核 4.19 及以后 tools/spi/spidev_test.c可在内核工程编译后,进入对应路径,输入以下命令直接编译标准 SPI app 程序:

<!-- cn PDF p.12 -->

```text
make CROSS_COMPILE=~/path-to-toolchain/gcc-xxxxx-toolchain/bin/xxxx-linux-gnu-       # 选择 kernel 所⽤ CROSS_COMPILE
```

<!-- cn PDF p.12 -->

支持配置为 SPI slave 设备,参考 “SPI 设备配置 —— RK 芯片做 Slave 端”,其中 DTS 配置 sub node 应保持为"rockchip,spidev"

<!-- cn PDF p.13 -->

### 2.7 cs-gpios 支持

<!-- cn PDF p.13 -->

用戶可以通过 spi-bus 的 cs-gpios 属性来实现 gpio 模拟 cs 以扩展 SPI 片选信号,cs-gpios 属性详细信息可以查阅内核文档。Documentation/devicetree/bindings/spi/spi-bus.txt

<!-- cn PDF p.13 -->

#### 2.7.1 Linux 4.4 配置

<!-- cn PDF p.13 -->

该支持需要较多支持补丁,请联系 RK 工程师获取相应的补丁。

<!-- cn PDF p.13 -->

#### 2.7.2 Linux 4.19 及以上内核配置

<!-- cn PDF p.13 -->

以 SPI1 设定 GPIO0_C4 为 spi1_cs2n 扩展脚为例。设置 cs-gpio 脚并在 SPI 节点中引用

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

SPI 节点重新指定 cs 脚

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

注释:如果要扩展 cs-gpio,则所有 cs 都要转为 gpio function,用 cs-gpios 扩展来支持

<!-- cn PDF p.14 -->

## 3. 内核测试软件

<!-- cn PDF p.14 -->

### 3.1 代码路径

<!-- cn PDF p.14 -->

```text
drivers/spi/spi-rockchip-test.c
```

<!-- cn PDF p.15 -->

### 3.2 SPI 测试设备配置

<!-- cn PDF p.15 -->

内核补丁

<!-- cn PDF p.15 -->

```text
需要⼿动添加编译：
drivers/spi/Makefile
+obj-y                                  += spi-rockchip-test.o
```

<!-- cn PDF p.15 -->

DTS 配置

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

驱动 log

<!-- cn PDF p.15 -->

```text
[    0.457137]
rockchip_spi_test_probe:name=spi_test_bus0_cs0,bus_num=0,cs=0,mode=11,speed=16000000
[    0.457308]
rockchip_spi_test_probe:name=spi_test_bus0_cs1,bus_num=0,cs=1,mode=11,speed=16000000
```

<!-- cn PDF p.15 -->

### 3.3 测试命令

<!-- cn PDF p.15 -->

```text
echo write 0 10 255 > /dev/spi_misc_test
echo write 0 10 255 init.rc > /dev/spi_misc_test
echo read 0 10 255 > /dev/spi_misc_test
echo loop 0 10 255 > /dev/spi_misc_test
echo setspeed 0 1000000 > /dev/spi_misc_test
```

<!-- cn PDF p.15 -->

echo 类型 id 循环次数 传输⻓度 &gt; /dev/spi_misc_testecho setspeed id 频率(单位 Hz) &gt; /dev/spi_misc_test如果需要,可以自己修改测试 case。

<!-- cn PDF p.16 -->

## 4. 内核 SPI Slave 软件

<!-- cn PDF p.16 -->

### 4.1 简介

<!-- cn PDF p.16 -->

背景SPI 主从之间传输通常遵循特定协议,如 SPI Nor 兼容 JEDEC SDFP 协议,RK SPI slave 作为设备端传输也应遵循特定的协议,由于协议无范式,所以 RK 提供自定义的传输协议和设备驱动以供客戶参考。Linux SPI slave 驱动框架限制:使用传输队列,虽然队列唤醒后的线程优先级较高,但受调度影响不能完全保证实时性RK SPI slave mode 限制:每次传输需重新发起 SPI 控制器配置,因此为确保 SPI master 能够获知 RK SPI slave 完成传输配置从而发起数据传输,RK SPI slave 端需增加 side-band 信号做 ready 状态位,SPI master 建议设置 ready 信号为 GPIOIRQ 输入,且为下降沿信号边沿触发传输协议RK SPI slave 传输协议:RK SPI slave 传输要求指定 ready-gpios 来通知 SPI master,基本流程:step1:slave 主动发起 spi_syncstep2:slave ready,使能 GPIO_SLV_READY 信号step3:master 确认 slave ready 后发起传输step4:slave 接收来自 master 发出的足够的 clk 后完成传输

<!-- cn PDF p.16 -->

![中文原稿图 (p.16)](/docs/rockchip-linux-spi/assets/cn-p016-figure-01.png)

*中文原稿图 (p.16)*

<!-- cn PDF p.16 -->

定义两种包类型:ctrl packet:2B cmd,2B addr(RK slave 定义的 application buffer 偏移地址),4B data(通常用于指定之后data 包的传输⻓度)data packet定义两种传输类型:ctrl 传输,仅包含 1 ctrl packetdata 传输,包含 1 ctrl packet 和 1 data packet 的两笔 SPI 传输spidev_rkslv 支持 SPI_OBJ_APP_RAM_SIZE ⻓度的 application buffer 用于缓存传输数据,SPI master 发起的data 传输 1 ctrl packet 2B addr 指向该缓存偏移地址设备驱动关键补丁:

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

说明:由于 SDK 版本问题,建议先确认 SDK 是否有以下补丁,如无该补丁,客戶可直接通过 Redmine -&gt; FAE 项目 -&gt;文档 -&gt; 开发配置文档 -&gt; SPI 路径获取驱动源码:

<!-- cn PDF p.17 -->

```text
drivers/spi/spidev-rkslv.c
drivers/spi/spidev-rkmst.c
```

<!-- cn PDF p.17 -->

源码简介:drivers/spi/spidev-rkslv.c:

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

实现业务

<!-- cn PDF p.18 -->

![中文原稿图 (p.18)](/docs/rockchip-linux-spi/assets/cn-p018-figure-01.png)

*中文原稿图 (p.18)*

<!-- cn PDF p.18 -->

提供”内核 SPI slave 软件“的目的在于提供协议和设备驱动的参考,最终客戶还应在 slave 端的 application buffer 上定义自己的产品需求以实现业务。

<!-- cn PDF p.19 -->

### 4.2 SPI Slave 测试设备配置

<!-- cn PDF p.19 -->

defconfig 配置:

<!-- cn PDF p.19 -->

```text
CONFIG_SPI_SLAVE_ROCKCHIP_OBJ=y
```

<!-- cn PDF p.19 -->

RK SPI slave 端 dts 参考配置:

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

RK SPI master 端 dts 参考配置:

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

### 4.3 测试命令

<!-- cn PDF p.19 -->

SPI master 发起单包数据传输测试

<!-- cn PDF p.19 -->

```text
echo cmd addr length > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.19 -->

说明:cmd :支持 read/write/duplex

<!-- cn PDF p.20 -->

addr:为对端 slave application buffer 偏移,单位 Bytes,仅支持 10 进制输入length:为 data packet ⻓度,单位 Bytes,仅支持 10 进制输入实例如下:

<!-- cn PDF p.20 -->

```text
echo write 128 128 > /dev/spidev_rkmst_misc
echo read 128 128 > /dev/spidev_rkmst_misc
echo duplex 128 128 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

SPI master 发起自动化测试

<!-- cn PDF p.20 -->

```text
echo autotest length loops compare > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

说明:autotest:固定输入,先测试全双工数据传输,再测试读写数据传输,并输出速率结果测试默认使用对端 slave application buffer 偏移地址 0length:为 data packet ⻓度,单位 Bytes,仅支持 10 进制输入loops:设定压测循环次数compare:1 - 开启数据校验;0 - 关闭数据校验(支持特定场景,如持续输出数据进行信号测试)实例如下:

<!-- cn PDF p.20 -->

```text
echo autotest 1024 64 1 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

SPI slave 测试

<!-- cn PDF p.20 -->

```text
echo appmem 0 256 > ./dev/spidev_rkslv_misc      #打印 application buffer 数据
echo verbose 1 > ./dev/spidev_rkslv_misc         #开启传输传输过程 debug log，echo verbose 0 关 闭打印
```

<!-- cn PDF p.20 -->

## 5. 常⻅问题

<!-- cn PDF p.20 -->

### 5.1 SPI 无信号

<!-- cn PDF p.20 -->

调试前确认驱动有跑起来确保 SPI 4 个引脚的 IOMUX 配置无误确认 TX 送时,TX 引脚有正常的波形,CLK 有正常的 CLOCK 信号,CS 信号有拉低如果 clk 频率较高,可以考虑提高驱动强度来改善信号如何简单判断 SPI DMA 是否使能,串口打印如无以下关键字则 DMA 使能成功:

<!-- cn PDF p.20 -->

```text
[    0.457137] Failed to request TX DMA channel
[    0.457237] Failed to request RX DMA channel
```

<!-- cn PDF p.21 -->

### 5.2 如何编写 SPI 应用代码

<!-- cn PDF p.21 -->

请选择合适的目标函数接口再编写驱动。自定义 SPI 设备驱动参考 “SPI 设备驱动介绍” 编写,实例如: drivers/spi/spi-rockchip-test.c。基于 spidev 标准设备节点编写的应用程序参考 “User mode SPI device 配置” 章节。

<!-- cn PDF p.21 -->

### 5.3 延时采样时钟配置方案

<!-- cn PDF p.21 -->

对于 SPI io 速率较高的情形,正常 SPI mode 可能依旧无法匹配外接器件输出延时,RK SPI master read 可能无法采到有效数据,需要启用 SPI rsd 逻辑来延迟采样时钟。RK SPI rsd(read sample delay)控制逻辑有以下特性:可配值为 0,1,2,3延时单位为 1 spi_clk cycle,即控制器工作时钟,详⻅ "SPI 设备配置章节“rx-sample-delay 实际延时为 dts 设定值最接近的 rsd 有效值为准,以 spi_clk 200MHz,周期 5ns 为例:rsd 实际可配延迟为 0,5ns,10ns,15ns,rx-sample-delay 设定 12ns,接近有效值 10ns,所以最终为 10ns 延时。

<!-- cn PDF p.21 -->

### 5.4 SPI 传输方式说明

<!-- cn PDF p.21 -->

默认传输模式master mode 支持 IRQ、DMA 和 CPU 传输,slave mode 支持 IRQ 和 DMA 传输,默认都为 IRQ/DMA 组合传输方式:当传输⻓度 &lt; fifo 深度时,使用 IRQ 传输,默认使用 4.19 及以上内核版本的 SOC,fifo 深度为 64当传输⻓度 &gt;= fifo 深度时,使用 DMA 传输修改传输模式master mode 支持:默认 IRQ/DMA 组合传输方式参考 ”关闭 DMA 支持,仅支持 IRQ 传输“ 说明,关闭 DMA,配置后仅支持 IRQ 传输参考 ”rockchip,poll-only“ 说明,配置后仅支持 CPU 传输slave mode 不支持修改传输模式。IRQ 传输特性当数据 &lt; fifo 深度时,一次传触发 1 个中断

<!-- cn PDF p.22 -->

当数据 &gt;= fifo 深度且使用 IRQ 传输时,fifo 水线设置为半 fifo,通常为 32 item,一次传输大致上触发 items /32 次中断DMA 传输特性不触发 spi 控制器中断,使用 DMA 传输 finished call back 回调

<!-- cn PDF p.22 -->

### 5.5 SPI 传输速率及 CPU 占用率高优化方向

<!-- cn PDF p.22 -->

通常 SPI 传输速率慢、IO 高负载下 CPU 占用率高的原因是因为:SPI 传输粒度小,且传输次数多,频繁发起传输从而涉及较多的调度,例如:SPI 线程调度中断调度,参考 “SPI 传输方式说明” 章节先确认是否使用到中断传输CPU idle 调度建议优化方向:

<!-- cn PDF p.22 -->

1. 开启 auto runtime,延时设置为 500ms,具体值以实测为准,修改点为 dts 节点添加 rockchip,autosuspend-delay-ms 属性

<!-- cn PDF p.22 -->

2. 降低 CPU 负载:改用 IRQ 传输,相对 DMA 可能会有优势,补丁参考 “改为 IRQ 传输” 小节

<!-- cn PDF p.22 -->

3. 降低 CPU 负载:如为 DMA 传输,可修改 TX DMA 水线来降低 CPU 在 DMA 回调函数中等待 fifo 传输完成的时间,补丁参考 “修改 SPI 水线”修改补丁参考:改为 IRQ 传输

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

修改 SPI 水线

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

## 原稿差异补充：英文代码与说明

以下英文原稿代码与中文主线存在注释、换行或示例差异，保留英文原样供追溯，不表示可直接互换配置。英文原稿末尾另提醒：补丁针对 Rockchip SPI 驱动和 RV1126-EVB-V10 DTS，其他软硬件可能需要调整。中文明确的偶数分频、PLL 向下取最接近值和缓存溢出后阻塞无法退出，已作为共同基准；英文“block and exit”与中文相反，未采用该译法。

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
