---
title: "Rockchip Linux SPI: Master/Slave, Treiber und Leistung"
description: "Rockchip Linux SPI: Master/Slave, Treiber und Leistung — V3.7.0"
excerpt: "Rockchip Linux SPI: Master/Slave, Treiber und Leistung — V3.7.0"
translation_key: "144-rockchip-linux-spi"
slug: "144-rockchip-linux-spi"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "Linux"]
---

{% raw %}

Plattformreferenz RK-KF-YF-020 (CN) / RK-KF-YF-075 (EN) V3.7.0 für aufgeführte SoCs und Linux-4.4/4.19+-BSPs; jede Funktion prüfen. Konkrete ArmSoM-/SDK-Unterstützung unbestätigt, keine Hardwarevalidierung. SoC, Kernel, Patches, Controller, IOMUX, Spannungen und Verdrahtung prüfen. Befehle/Ergebnisse sind Herstellerbeispiele, keine ArmSoM-Messungen. Alle vier Sprachen folgen der chinesischen technischen Basis mit englischen Ergänzungen. Abweichende Codebeispiele stehen separat am Ende. ZH nutzt chinesische, EN/RU/DE englische Originalbilder.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

<!-- cn PDF p.6 -->

## 1. Rockchip-SPI-Eigenschaften

<!-- cn PDF p.6 -->

SPI (serial peripheral interface), Linux-4.4-Treiber: standardmäßig Motorola SPI; 8/16 Bit; programmierbarer Takt; vier Modi; ein bis zwei CS je Controller. Im Slave nur SPI_CS0N als CS-Eingang, während Übertragung nicht auf GPIO umschalten und kein CS1N-Ersatz. Linux 4.19 ergänzt Framework-Unterstützung für Slave und Master.

<!-- cn PDF p.6 -->

### 1.1 SPI-Schnittstellenrate

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

Maximalrate theoretisch, abhängig vom PCB und zu messen. PLL-Teilung erreicht eventuell nicht exakt den Grenzwert; höchste erreichbare Rate gilt. RV1126B: spi1m1 bis 50MHz, spi0m0 bis 25MHz, andere bis 20MHz.

<!-- cn PDF p.7 -->

## 2. Kernelsoftware

<!-- cn PDF p.7 -->

### 2.1 Quellcodepfade

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

### 2.2 SPI konfigurieren: RK als Master

<!-- cn PDF p.7 -->

Kernelkonfiguration

<!-- cn PDF p.7 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        <*>   Rockchip SPI controller driver
```

<!-- cn PDF p.7 -->

DTS-Knoten

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

spi-max-frequency ist der Ausgangstakt nach Teilung von spiclk assigned-clock-rates. Der interne Teiler ist gerade und mindestens 2: spiclk assigned-clock-rates &gt;= 2*spi-max-frequency. Für IO 50MHz assigned-clock-rates = &lt;100000000&gt;, spi-max-frequency = &lt;50000000&gt;. PLL wählt den nächsten Wert nicht über 100MHz; Teilung durch 2 ergibt etwa 50MHz. spiclk nicht unter 24M setzen.

<!-- cn PDF p.8 -->

### 2.3 SPI konfigurieren: RK als Slave

<!-- cn PDF p.8 -->

spi-rockchip-slave.c empfohlen. Folgenden Patch in der SDK-Version prüfen:

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

Falls fehlend: Redmine → FAE → Dokumente → Entwicklungskonfiguration → SPI. Kernelkonfiguration:

<!-- cn PDF p.8 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   SPI slave protocol handlers
        [*]   Rockchip SPI Slave controller driver
```

<!-- cn PDF p.8 -->

DTS-Knoten:

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

RK SPI aktiviert DMA standardmäßig; im Slave nicht deaktivieren. Übersteigt die Länge den Controllerpuffer, wird DMA gegen verspätete Interruptbearbeitung eingesetzt.

<!-- cn PDF p.9 -->

### 2.4 SPI-Slave-Hinweise

<!-- cn PDF p.9 -->

#### 2.4.1 Performance-Modus empfohlen

<!-- cn PDF p.9 -->

Oberhalb folgender Master-Raten performance aktivieren, damit DRAM-Taktwechsel keinen Überlauf verursachen: bits_per_word = 8btis bei IO &gt; 5MHz; 16btis bei &gt; 10MHz. Beispiel:

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

Alle Slave-Transfers möglichst in performance. set/clear kostet Zeit; auf Anwendungsebene setzen, nicht häufig aufrufen. Bei Überlauf kann Slave DMA nicht abschließen und bleibt blockiert; SPI-&gt;SPI_RISR prüfen.

<!-- cn PDF p.10 -->

#### 2.4.2 16bits empfohlen

<!-- cn PDF p.10 -->

FIFO-Kapazität ausnutzen: 16bits und mindestens burst 2 beschleunigen Slave-DMA und vermeiden Rückstau durch zu langsamen Transport.

<!-- cn PDF p.10 -->

#### 2.4.3 Weitere Hinweise

<!-- cn PDF p.10 -->

Zuerst Slave-Lesen, dann Master-Schreiben starten, sonst schreibt Master vor Slave-Bereitschaft. Ebenso Slave-Schreiben vor Master-Lesen: Slave läuft erst mit Master-clk, Master sendet/empfängt sofort. Auf Basis Kapitel 3 zuerst Slave `echo write 0 1 16 > /dev/spi_misc_test`, dann Master `echo read 0 1 16 > /dev/spi_misc_test`.

<!-- cn PDF p.10 -->

### 2.5 SPI-Gerätetreiber

<!-- cn PDF p.10 -->

Treiberregistrierung:

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

SPI-Lesen/-Schreiben: include/linux/spi/spi.h, einige Beispiele unten.

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

### 2.6 SPI im Benutzerraum

<!-- cn PDF p.12 -->

User mode greift aus Userspace auf SPI zu und erleichtert Peripherietreiber ohne Kerneländerung. Kernelkonfiguration:

<!-- cn PDF p.12 -->

```text
Device Drivers  --->
    [*] SPI support  --->
        [*]   User mode SPI device driver support
```

<!-- cn PDF p.12 -->

DTS-Konfiguration:

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

Nach Registrierung erscheint etwa /dev/spidev1.1. Beispiele: Linux 4.4 Documentation/spi/spidev_test.c; Linux 4.19+ tools/spi/spidev_test.c. Nach Kernelbuild dort die Standard-SPI-Anwendung kompilieren:

<!-- cn PDF p.12 -->

```text
make CROSS_COMPILE=~/path-to-toolchain/gcc-xxxxx-toolchain/bin/xxxx-linux-gnu-       # 选择 kernel 所⽤ CROSS_COMPILE
```

<!-- cn PDF p.12 -->

SPI-Slave nach entsprechendem Abschnitt möglich; DTS-Unterknoten muss "rockchip,spidev" bleiben.

<!-- cn PDF p.13 -->

### 2.7 cs-gpios-Unterstützung

<!-- cn PDF p.13 -->

cs-gpios in spi-bus erweitert CS über GPIO. Siehe Documentation/devicetree/bindings/spi/spi-bus.txt.

<!-- cn PDF p.13 -->

#### 2.7.1 Linux 4.4

<!-- cn PDF p.13 -->

Zusätzliche Patches beim RK-Ingenieur anfordern.

<!-- cn PDF p.13 -->

#### 2.7.2 Linux 4.19 und neuer

<!-- cn PDF p.13 -->

Beispiel SPI1: GPIO0_C4 als spi1_cs2n. cs-gpio setzen und im SPI referenzieren:

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

CS im SPI neu zuweisen:

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

Für cs-gpio-Erweiterung müssen alle CS GPIO-Funktion und cs-gpios verwenden.

<!-- cn PDF p.14 -->

## 3. Kernel-Testsoftware

<!-- cn PDF p.14 -->

### 3.1 Quellcodepfade

<!-- cn PDF p.14 -->

```text
drivers/spi/spi-rockchip-test.c
```

<!-- cn PDF p.15 -->

### 3.2 SPI-Testgerät konfigurieren

<!-- cn PDF p.15 -->

Kernelpatch:

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

Treiberprotokoll:

<!-- cn PDF p.15 -->

```text
[    0.457137]
rockchip_spi_test_probe:name=spi_test_bus0_cs0,bus_num=0,cs=0,mode=11,speed=16000000
[    0.457308]
rockchip_spi_test_probe:name=spi_test_bus0_cs1,bus_num=0,cs=1,mode=11,speed=16000000
```

<!-- cn PDF p.15 -->

### 3.3 Testbefehle

<!-- cn PDF p.15 -->

```text
echo write 0 10 255 > /dev/spi_misc_test
echo write 0 10 255 init.rc > /dev/spi_misc_test
echo read 0 10 255 > /dev/spi_misc_test
echo loop 0 10 255 > /dev/spi_misc_test
echo setspeed 0 1000000 > /dev/spi_misc_test
```

<!-- cn PDF p.15 -->

Format: `echo Typ id Schleifen Länge > /dev/spi_misc_test`; `echo setspeed id Frequenz_Hz > /dev/spi_misc_test`. Tests bei Bedarf anpassen.

<!-- cn PDF p.16 -->

## 4. Kernel-SPI-Slave-Software

<!-- cn PDF p.16 -->

### 4.1 Einführung

<!-- cn PDF p.16 -->

SPI-Master/Slave nutzen normalerweise ein Protokoll, etwa SPI NOR mit JEDEC SDFP (Quellenschreibweise). RK liefert mangels allgemeinem Schema ein Protokoll-/Treiberbeispiel. Linux-Grenze: Transferqueue und hohe Priorität nach Aufwecken garantieren wegen Scheduling keine Echtzeit. RK-Slave muss jede Übertragung neu konfigurieren; ein Sideband-ready informiert den Master. GPIO-IRQ auf fallende Flanke empfohlen.
ready-gpios-Ablauf: 1) Slave ruft spi_sync; 2) gibt GPIO_SLV_READY aus; 3) Master bestätigt Bereitschaft und startet; 4) genügend Master-clk schließen die Übertragung ab.

<!-- cn PDF p.16 -->

![Abbildung des englischen Originals (p.19)](/docs/rockchip-linux-spi/assets/en-p019-figure-01.png)

*Abbildung des englischen Originals (p.19)*

<!-- cn PDF p.16 -->

Zwei Pakete: ctrl = 2B cmd, 2B addr (Slave-application-buffer-Versatz), 4B data (meist Länge des Folgepakets); data packet. Zwei Transfers: ctrl nur ein ctrl packet; data zwei SPI-Transfers, ctrl dann data. spidev_rkslv hat SPI_OBJ_APP_RAM_SIZE Bytes Puffer; 2B addr adressiert dessen Versatz. Wichtiger Patch:

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

SDK auf Patch prüfen; sonst Redmine → FAE → Dokumente → Entwicklungskonfiguration → SPI. Quellen:

<!-- cn PDF p.17 -->

```text
drivers/spi/spidev-rkslv.c
drivers/spi/spidev-rkmst.c
```

<!-- cn PDF p.17 -->

Quellenbeschreibung: drivers/spi/spidev-rkslv.c:

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

Anwendung implementieren

<!-- cn PDF p.18 -->

![Abbildung des englischen Originals (p.21)](/docs/rockchip-linux-spi/assets/en-p021-figure-01.png)

*Abbildung des englischen Originals (p.21)*

<!-- cn PDF p.18 -->

Slave-Software ist Protokoll-/Treiberreferenz; Kunden müssen Produktanforderungen auf dem Slave-application-buffer selbst definieren.

<!-- cn PDF p.19 -->

### 4.2 SPI-Slave-Testgerät konfigurieren

<!-- cn PDF p.19 -->

defconfig:

<!-- cn PDF p.19 -->

```text
CONFIG_SPI_SLAVE_ROCKCHIP_OBJ=y
```

<!-- cn PDF p.19 -->

Slave-DTS-Beispiel:

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

Master-DTS-Beispiel:

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

### 4.3 Testbefehle

<!-- cn PDF p.19 -->

Master: Einzelpakettest

<!-- cn PDF p.19 -->

```text
echo cmd addr length > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.19 -->

cmd: read/write/duplex.

<!-- cn PDF p.20 -->

addr: Versatz im entfernten Slave-Puffer, Bytes, nur dezimal. length: data-packet-Länge, Bytes, nur dezimal. Beispiel:

<!-- cn PDF p.20 -->

```text
echo write 128 128 > /dev/spidev_rkmst_misc
echo read 128 128 > /dev/spidev_rkmst_misc
echo duplex 128 128 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

Master-Autotest

<!-- cn PDF p.20 -->

```text
echo autotest length loops compare > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

autotest fest vorgeben: erst Vollduplex, dann Lesen/Schreiben mit Ratenanzeige. Slave-Versatz standardmäßig 0. length: Bytes, dezimal; loops: Lastzyklen; compare: 1 prüfen, 0 nicht prüfen (etwa Dauersignal). Beispiel:

<!-- cn PDF p.20 -->

```text
echo autotest 1024 64 1 > /dev/spidev_rkmst_misc
```

<!-- cn PDF p.20 -->

Slave-Test

<!-- cn PDF p.20 -->

```text
echo appmem 0 256 > ./dev/spidev_rkslv_misc      #打印 application buffer 数据
echo verbose 1 > ./dev/spidev_rkslv_misc         #开启传输传输过程 debug log，echo verbose 0 关 闭打印
```

<!-- cn PDF p.20 -->

## 5. Häufige Fragen

<!-- cn PDF p.20 -->

### 5.1 Kein SPI-Signal

<!-- cn PDF p.20 -->

Treiberstart und IOMUX aller vier Pins prüfen. Bei TX müssen TX-Wellenform, CLK-Takt und CS low vorhanden sein. Bei hoher Frequenz Treiberstärke erhöhen. Fehlen folgende UART-Schlüsselwörter, ist DMA aktiviert:

<!-- cn PDF p.20 -->

```text
[    0.457137] Failed to request TX DMA channel
[    0.457237] Failed to request RX DMA channel
```

<!-- cn PDF p.21 -->

### 5.2 SPI-Anwendung entwickeln

<!-- cn PDF p.21 -->

Vor Entwicklung Schnittstelle wählen: eigener Treiber nach SPI Device Driver, etwa drivers/spi/spi-rockchip-test.c; spidev-Anwendung nach User mode SPI device.

<!-- cn PDF p.21 -->

### 5.3 Abtastverzögerung

<!-- cn PDF p.21 -->

Bei hoher SPI-Rate kann Peripherie-Ausgangsverzögerung Master-Lesen stören. RSD aktivieren: 0/1/2/3, Einheit ein spi_clk cycle. rx-sample-delay wird auf nächsten gültigen RSD gerundet. Bei 200MHz, 5ns Periode: 0/5/10/15ns; 12ns ergibt 10ns.

<!-- cn PDF p.21 -->

### 5.4 Übertragungsverfahren

<!-- cn PDF p.21 -->

Master unterstützt IRQ/DMA/CPU, Slave IRQ/DMA. Standard: IRQ bei Länge &lt; FIFO, DMA bei &gt;= FIFO; FIFO meist 64 bei Kernel 4.19+. Master kombiniert lassen, DMA für IRQ deaktivieren oder rockchip,poll-only für CPU setzen. Slave-Modus nicht änderbar. Unter FIFO-Länge erzeugt ein Transfer einen Interrupt.

<!-- cn PDF p.22 -->

Bei &gt;= FIFO und IRQ liegt die Schwelle bei halbem FIFO, meist 32 Einträgen; ungefähr items / 32 Interrupts. DMA erzeugt keinen SPI-Controller-Interrupt, sondern einen DMA-Abschlusscallback.

<!-- cn PDF p.22 -->

### 5.5 SPI-Rate und CPU-Last optimieren

<!-- cn PDF p.22 -->

Niedrige Rate und hohe CPU-Last kommen oft von kleinen häufigen Transfers: SPI-Thread-, Interrupt- (Modus prüfen) und CPU-Idle-Scheduling. Empfehlungen:

<!-- cn PDF p.22 -->

1. Auto runtime mit 500ms Verzögerung aktivieren, per Messung anpassen; rockchip,autosuspend-delay-ms in DTS.

<!-- cn PDF p.22 -->

2. CPU senken: IRQ kann günstiger als DMA sein; Patch unten.

<!-- cn PDF p.22 -->

3. Bei DMA TX-Watermark ändern, um CPU-Wartezeit auf FIFO-Abschluss im Callback zu senken. Patches unten. Auf IRQ wechseln:

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

SPI-Watermark ändern:

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

## Quellenunterschiede: englische Beispiele und Hinweis

Folgende englische Beispiele unterscheiden sich in Kommentaren, Umbrüchen oder Inhalt. Sie bleiben zur Nachvollziehbarkeit, nicht als austauschbare Konfigurationen. Englischer Schlusshinweis: Patches gelten für Rockchip SPI und RV1126-EVB-V10 DTS; andere Systeme benötigen Anpassung. Chinesische Angaben zu gerader Teilung, PLL-Abrundung und Blockieren ohne Rückkehr bei Überlauf gelten; das widersprüchliche “block and exit” wird nicht übernommen.

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
