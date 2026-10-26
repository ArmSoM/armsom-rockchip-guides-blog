---
title: "Rockchip Linux SPI: master/slave, драйверы и производительность"
description: "Rockchip Linux SPI: master/slave, драйверы и производительность — V3.7.0"
excerpt: "Rockchip Linux SPI: master/slave, драйверы и производительность — V3.7.0"
translation_key: "144-rockchip-linux-spi"
slug: "144-rockchip-linux-spi"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "Linux"]
---

{% raw %}

Справочник платформы RK-KF-YF-020 (CN) / RK-KF-YF-075 (EN) V3.7.0 для перечисленных SoC и BSP Linux 4.4/4.19+; проверяйте каждую функцию. Поддержка конкретных ArmSoM/SDK не подтверждена, аппаратная проверка не проводилась. Проверьте SoC, ядро, патчи, контроллер, IOMUX, напряжения и проводку. Команды/результаты — примеры производителя, не измерения ArmSoM. Четыре языка основаны на китайском тексте с дополнениями английского. Отличающиеся примеры кода отдельно сохранены в конце. ZH использует китайские, EN/RU/DE английские рисунки.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.6 -->

## 1. Возможности Rockchip SPI

<!-- cn PDF p.6 -->

SPI (serial peripheral interface), возможности драйвера Linux 4.4: Motorola SPI по умолчанию; 8/16 бит; программируемая частота; четыре режима; один-два CS на контроллер. В slave только SPI_CS0N используется как вход CS, без переключения на GPIO во время передачи и без замены CS1N. Linux 4.19 дополнительно поддерживает в платформе slave и master.

<!-- cn PDF p.6 -->

### 1.1 Скорость интерфейса SPI

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

Максимум теоретический, зависит от разводки PCB и проверяется измерением. PLL может не дать точный предел делением; берите максимальную достижимую частоту. RV1126B: spi1m1 до 50MHz, spi0m0 до 25MHz, прочие до 20MHz.

<!-- cn PDF p.7 -->

## 2. ПО ядра

<!-- cn PDF p.7 -->

### 2.1 Пути исходников

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

### 2.2 Настройка SPI: RK как Master

<!-- cn PDF p.7 -->

Настройка ядра

<!-- cn PDF p.7 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        <*>   Rockchip SPI controller driver
```

<!-- cn PDF p.7 -->

Узел DTS

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

spi-max-frequency — выходной такт после деления рабочего spiclk assigned-clock-rates. Внутренний делитель чётный и минимум 2: spiclk assigned-clock-rates &gt;= 2*spi-max-frequency. Для IO 50MHz задайте assigned-clock-rates = &lt;100000000&gt;, spi-max-frequency = &lt;50000000&gt;. PLL выбирает ближайшую частоту не выше 100MHz, деление на 2 даёт около 50MHz. Не задавайте spiclk ниже 24M.

<!-- cn PDF p.8 -->

### 2.3 Настройка SPI: RK как Slave

<!-- cn PDF p.8 -->

Рекомендуется spi-rockchip-slave.c. Проверьте наличие патча в вашей версии SDK:

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

Если патча нет: Redmine → FAE → документы → конфигурация разработки → SPI. Настройка ядра:

<!-- cn PDF p.8 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   SPI slave protocol handlers
        [*]   Rockchip SPI Slave controller driver
```

<!-- cn PDF p.8 -->

Узел DTS:

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

RK SPI включает DMA по умолчанию, отключать в slave не рекомендуется. При длине сверх буфера контроллера используется DMA, чтобы избежать несвоевременной обработки прерываний.

<!-- cn PDF p.9 -->

### 2.4 Особенности SPI Slave

<!-- cn PDF p.9 -->

#### 2.4.1 Рекомендуется performance

<!-- cn PDF p.9 -->

При master выше порога включите performance, чтобы смена частоты DRAM не переполняла буфер: bits_per_word = 8btis при IO &gt; 5MHz; 16btis при &gt; 10MHz. Пример:

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

Все передачи slave рекомендуется выполнять в performance. set/clear имеет накладные расходы; устанавливайте на уровне приложения, не вызывайте часто. При переполнении slave не завершает DMA и блокируется без выхода; проверяйте SPI-&gt;SPI_RISR.

<!-- cn PDF p.10 -->

#### 2.4.2 Рекомендуется 16bits

<!-- cn PDF p.10 -->

Используйте ёмкость FIFO максимально: 16bits и минимум burst 2 ускоряют DMA slave, не позволяя FIFO накопиться из-за медленного переноса.

<!-- cn PDF p.10 -->

#### 2.4.3 Другие замечания

<!-- cn PDF p.10 -->

При slave сначала запускайте slave read, затем master write; иначе master завершит раньше готовности slave. Аналогично slave write до master read: slave работает лишь после clk master, который сразу передаёт/принимает. На базе главы 3: сначала `echo write 0 1 16 > /dev/spi_misc_test` на slave, затем `echo read 0 1 16 > /dev/spi_misc_test` на master.

<!-- cn PDF p.10 -->

### 2.5 Драйвер устройства SPI

<!-- cn PDF p.10 -->

Регистрация драйвера:

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

Чтение/запись SPI: include/linux/spi/spi.h, несколько примеров ниже.

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

### 2.6 SPI из пользовательского пространства

<!-- cn PDF p.12 -->

User mode позволяет обращаться к SPI из userspace, переносить периферийные драйверы без изменения ядра. Настройка ядра:

<!-- cn PDF p.12 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   User mode SPI device driver support
```

<!-- cn PDF p.12 -->

Настройка DTS:

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

После регистрации появляется устройство наподобие /dev/spidev1.1. Примеры: Linux 4.4 Documentation/spi/spidev_test.c; Linux 4.19+ tools/spi/spidev_test.c. После сборки ядра перейдите туда и соберите стандартное SPI-приложение командой:

<!-- cn PDF p.12 -->

```text
make CROSS_COMPILE=~/path-to-toolchain/gcc-xxxxx-toolchain/bin/xxxx-linux-gnu-       # 选择 kernel 所⽤ CROSS_COMPILE
```

<!-- cn PDF p.12 -->

Поддерживается SPI slave по соответствующему разделу, но подузел DTS должен оставаться "rockchip,spidev".

<!-- cn PDF p.13 -->

### 2.7 Поддержка cs-gpios

<!-- cn PDF p.13 -->

cs-gpios в spi-bus эмулирует CS через GPIO для расширения выбора. См. Documentation/devicetree/bindings/spi/spi-bus.txt.

<!-- cn PDF p.13 -->

#### 2.7.1 Linux 4.4

<!-- cn PDF p.13 -->

Нужны дополнительные патчи; запросите у инженера RK.

<!-- cn PDF p.13 -->

#### 2.7.2 Linux 4.19 и новее

<!-- cn PDF p.13 -->

Пример SPI1: GPIO0_C4 как spi1_cs2n. Задайте cs-gpio и сошлитесь из SPI:

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

Повторно назначьте CS в SPI:

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

Для расширения cs-gpio все CS должны перейти в GPIO function и поддерживаться через cs-gpios.

<!-- cn PDF p.14 -->

## 3. Тестовое ПО ядра

<!-- cn PDF p.14 -->

### 3.1 Пути исходников

<!-- cn PDF p.14 -->

```text
drivers/spi/spi-rockchip-test.c
```

<!-- cn PDF p.15 -->

### 3.2 Настройка тестового SPI

<!-- cn PDF p.15 -->

Патч ядра:

<!-- cn PDF p.15 -->

```text
需要⼿动添加编译：
drivers/spi/Makefile
+obj-y                                  += spi-rockchip-test.o
```

<!-- cn PDF p.15 -->

DTS:

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

Журнал драйвера:

<!-- cn PDF p.15 -->

```text
[    0.457137]
rockchip_spi_test_probe:name=spi_test_bus0_cs0,bus_num=0,cs=0,mode=11,speed=16000000
[    0.457308]
rockchip_spi_test_probe:name=spi_test_bus0_cs1,bus_num=0,cs=1,mode=11,speed=16000000
```

<!-- cn PDF p.15 -->

### 3.3 Тестовые команды

<!-- cn PDF p.15 -->

```text
echo write 0 10 255 > /dev/spi_misc_test
echo write 0 10 255 init.rc > /dev/spi_misc_test
echo read 0 10 255 > /dev/spi_misc_test
echo loop 0 10 255 > /dev/spi_misc_test
echo setspeed 0 1000000 > /dev/spi_misc_test
```

<!-- cn PDF p.15 -->

Формат: `echo тип id число_циклов длина > /dev/spi_misc_test`; `echo setspeed id частота_Hz > /dev/spi_misc_test`. При необходимости измените тесты.

<!-- cn PDF p.16 -->

## 4. ПО SPI Slave ядра

<!-- cn PDF p.16 -->

### 4.1 Введение

<!-- cn PDF p.16 -->

SPI master/slave обычно используют определённый протокол, например SPI NOR с JEDEC SDFP (написание источника). Для RK slave без общего стандарта RK предоставляет пример протокола/драйвера. Ограничение Linux: очередь передач и высокий приоритет после пробуждения не гарантируют реальное время из-за планировщика. RK slave заново конфигурируется перед каждой передачей; нужен боковой ready, чтобы master знал о готовности. Master рекомендуется GPIO IRQ по спаду.
Протокол требует ready-gpios: 1) slave вызывает spi_sync; 2) выводит GPIO_SLV_READY; 3) master подтверждает готовность и начинает; 4) достаточное число clk от master завершает передачу.

<!-- cn PDF p.16 -->

![Рисунок английского оригинала (p.19)](/docs/rockchip-linux-spi/assets/en-p019-figure-01.png)

*Рисунок английского оригинала (p.19)*

<!-- cn PDF p.16 -->

Два пакета: ctrl = 2B cmd, 2B addr (смещение application buffer slave), 4B data (обычно длина следующего пакета); data packet. Два типа передачи: ctrl — один ctrl packet; data — две SPI-передачи, ctrl затем data. spidev_rkslv имеет буфер SPI_OBJ_APP_RAM_SIZE Bytes; 2B addr ctrl указывает смещение в нём. Ключевой патч:

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

Проверьте SDK на патч; при отсутствии Redmine → FAE → документы → конфигурация разработки → SPI. Исходники:

<!-- cn PDF p.17 -->

```text
drivers/spi/spidev-rkslv.c
drivers/spi/spidev-rkmst.c
```

<!-- cn PDF p.17 -->

Описание исходников: drivers/spi/spidev-rkslv.c:

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

Реализация приложения

<!-- cn PDF p.18 -->

![Рисунок английского оригинала (p.21)](/docs/rockchip-linux-spi/assets/en-p021-figure-01.png)

*Рисунок английского оригинала (p.21)*

<!-- cn PDF p.18 -->

ПО slave — пример протокола и драйверов; заказчик должен определить собственные требования к application buffer slave для приложения.

<!-- cn PDF p.19 -->

### 4.2 Настройка тестового SPI Slave

<!-- cn PDF p.19 -->

defconfig:

<!-- cn PDF p.19 -->

```text
CONFIG_SPI_SLAVE_ROCKCHIP_OBJ=y
```

<!-- cn PDF p.19 -->

Пример DTS slave:

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

Пример DTS master:

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

### 4.3 Команды теста

<!-- cn PDF p.19 -->

Master: тест одного пакета

<!-- cn PDF p.19 -->

```text
echo cmd addr length > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.19 -->

cmd: read/write/duplex.

<!-- cn PDF p.20 -->

addr: смещение буфера удалённого slave, Bytes, только десятичное. length: длина data packet, Bytes, только десятичное. Пример:

<!-- cn PDF p.20 -->

```text
echo write 128 128 > /dev/spidev_rkmst_misc
echo read 128 128 > /dev/spidev_rkmst_misc
echo duplex 128 128 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

Автотест master

<!-- cn PDF p.20 -->

```text
echo autotest length loops compare > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

autotest — фиксированная команда: сначала полный дуплекс, затем чтение/запись с выводом скорости. По умолчанию смещение slave 0. length: Bytes, десятичное; loops: число циклов нагрузки; compare: 1 проверка, 0 без проверки (например непрерывный сигнал). Пример:

<!-- cn PDF p.20 -->

```text
echo autotest 1024 64 1 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

Тест slave

<!-- cn PDF p.20 -->

```text
echo appmem 0 256 > ./dev/spidev_rkslv_misc      #打印 application buffer 数据
echo verbose 1 > ./dev/spidev_rkslv_misc         #开启传输传输过程 debug log，echo verbose 0 关 闭打印
```

<!-- cn PDF p.20 -->

## 5. Частые вопросы

<!-- cn PDF p.20 -->

### 5.1 Нет сигнала SPI

<!-- cn PDF p.20 -->

Убедитесь в запуске драйвера и IOMUX четырёх выводов. При TX должны быть форма сигнала TX, CLOCK CLK и CS low. При высокой частоте увеличьте drive strength. Если в UART нет следующих ключевых слов, DMA включён:

<!-- cn PDF p.20 -->

```text
[    0.457137] Failed to request TX DMA channel
[    0.457237] Failed to request RX DMA channel
```

<!-- cn PDF p.21 -->

### 5.2 Разработка приложения SPI

<!-- cn PDF p.21 -->

Выберите интерфейс перед разработкой: собственный драйвер по разделу SPI Device Driver, например drivers/spi/spi-rockchip-test.c; приложение spidev по разделу User mode SPI device.

<!-- cn PDF p.21 -->

### 5.3 Задержка выборки

<!-- cn PDF p.21 -->

На высокой скорости SPI задержка выхода периферии может мешать чтению master. Включите RSD: значения 0/1/2/3, единица один spi_clk cycle. rx-sample-delay округляется к ближайшему допустимому RSD. При spi_clk 200MHz период 5ns: допустимы 0/5/10/15ns; запрос 12ns даёт 10ns.

<!-- cn PDF p.21 -->

### 5.4 Способы передачи

<!-- cn PDF p.21 -->

Master поддерживает IRQ/DMA/CPU, slave IRQ/DMA. По умолчанию IRQ при длине &lt; FIFO, DMA при &gt;= FIFO; FIFO обычно 64 у SoC с ядром 4.19+. Master можно оставить комбинированным, отключить DMA для IRQ или задать rockchip,poll-only для CPU. Slave не допускает смены режима. При длине &lt; FIFO одна передача вызывает одно прерывание.

<!-- cn PDF p.22 -->

При &gt;= FIFO и IRQ водяной знак равен половине FIFO, обычно 32 элемента; около items / 32 прерываний. DMA не вызывает прерывания SPI-контроллера, используется callback завершения DMA.

<!-- cn PDF p.22 -->

### 5.5 Скорость SPI и нагрузка CPU

<!-- cn PDF p.22 -->

Низкая скорость и высокая CPU-нагрузка при IO часто вызваны мелкими частыми передачами: планирование SPI-потоков, прерываний (проверьте режим) и CPU idle. Рекомендации:

<!-- cn PDF p.22 -->

1. Включите auto runtime с задержкой 500ms, уточните измерением; добавьте rockchip,autosuspend-delay-ms в DTS.

<!-- cn PDF p.22 -->

2. Снижение CPU: IRQ может быть выгоднее DMA; патч ниже.

<!-- cn PDF p.22 -->

3. При DMA измените TX DMA watermark, сокращая ожидание CPU завершения FIFO в callback. Патчи ниже. Переключение на IRQ:

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

Изменение SPI watermark:

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

## Различия источников: английские примеры и примечание

Ниже английские примеры отличаются комментариями, переносами или содержанием. Они сохранены для сверки, не как взаимозаменяемые настройки. Английское заключение уточняет: патчи для Rockchip SPI и RV1126-EVB-V10 DTS, другие платформы требуют адаптации. За основу приняты китайские уточнения чётного делителя, округления PLL вниз и блокировки без выхода при переполнении; противоположное “block and exit” не принято.

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
