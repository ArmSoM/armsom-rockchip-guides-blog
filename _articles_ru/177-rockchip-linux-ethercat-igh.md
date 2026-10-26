---
title: "Rockchip EtherCAT IgH: ядро реального времени, мастер, TSN и измерения"
description: "Rockchip EtherCAT IgH: ядро реального времени, мастер, TSN и измерения — V1.0.3"
excerpt: "Rockchip EtherCAT IgH: ядро реального времени, мастер, TSN и измерения"
translation_key: "177-rockchip-linux-ethercat-igh"
slug: "177-rockchip-linux-ethercat-igh"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "industrial"
products: []
tags: [ArmSoM, Rockchip, EtherCAT, TSN, Linux]
---

{% raw %}

Пояснения китайских комментариев: включить модуль STMMAC EtherCAT; отключить сон CPU либо CONFIG_ARM_PSCI_CPUIDLE; примеры изолируют CPU3 или CPU7. gmac0 используется для EtherCAT, gmac1 — обычный Ethernet. Заменить инструментарий, архитектуру, каталог ядра и путь установки реальными значениями; MAC main_devices взять из ifconfig. performance включает измерения. PDO адаптировать по руководству сервопривода, не запускать неизвестный мотор; цикл app_run измеряет экстремумы временного джиттера.

# Rockchip EtherCAT IgH: ядро реального времени, мастер, TSN и измерения

Платформенная справка CN/EN V1.0.3, RK-YH-YF-A18. Область источника: RK3588/Linux5.10; RK3576/Linux6.1; RK3568/Linux5.10 или4.19; RK3506/Linux6.1. Проверяйте Ethernet, PHY, BSP и RT-патчи ArmSoM; аппаратной проверки нет, все платы не обещаны. ZH использует CN-рисунки, EN/RU/DE — EN. Производительность — примеры производителя, не измерения ArmSoM.

Сохранены сомнения: alias -p 0 0 описан как изменение на1; ec_stmmac.ko копируется в /userdata/, но insmod использует /userdata/ethercat_out/; последний while патча stmmac не имеет полного тела/завершения. Повторные diff-заголовки и пути-заглушки не являются готовыми патчами. [] обязательные/<> необязательные — условность источника. Гарантия жёсткого времени Preempt-RT — описание источника, нужна проверка худшей задержки системы. Управление мотором опасно движением; примеры не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [IgH EtherCAT](https://docs.etherlab.org/ethercat/1.5/doxygen/index.html)

## 1. Обзор

IgH EtherCAT — открытый EtherCAT-мастер для Linux. Он создаёт символьное устройство Linux, через которое приложения взаимодействуют с модулем мастера. Пакет включает инструменты пользовательского уровня для доступа/настройки ведомых устройств: адреса, конфигурация шины, данные PDO, чтение/запись параметров SDO и другое.

![Схема источника](/docs/rockchip-linux-ethercat-igh/assets/en-p005-figure-01.png)

Подробности: https://docs.etherlab.org/ethercat/1.5/doxygen/index.html

## 2. Программная среда EtherCAT IgH

Четыре части EtherCAT: ядро, драйверы, пользовательская часть и приложение. Источник предоставляет предварительно собранные бинарные файлы:

| Раздел | Предварительно собрано | Файлы | Назначение |
| --- | --- | --- | --- |
| Драйверы | Y | phylink.ko,pcs-xpcs.ko, ec_master.ko,ec_stmmac.ko | Драйверная среда реального времени |
| Пользовательская часть | Y | ethercat,libethercat.so | ethercat — отладчик EtherCAT IgH, libethercat.so — интерфейсы пользовательских приложений |
| Приложение EtherCAT | N | libmadht1505ba1.so,rk_test,etc. | Прикладная программа |

### 2.1 Ядро

EtherCAT IgH требует высокой оперативности реального времени. Preempt-RT — оптимизированное для этого ядро Linux. Источник перечисляет следующие преимущества перед обычным ядром:

1. Реальное время: более надёжное и точное выполнение благодаря политикам/механизмам планирования со строгими временными требованиями, для предсказуемости и низкой задержки, например промышленной автоматизации и робототехники.

2. Жёсткое реальное время: источник утверждает, что задачи могут завершаться вовремя без влияния других задач/прерываний; это важно для строгих ограничений, например авиационно-космических и медицинских систем. Это описание источника, не гарантия конкретной системы.

3. Планирование: более эффективные алгоритмы, например приоритетное реальное время, обеспечивают своевременную реакцию высокоприоритетных задач без влияния низкоприоритетных.

4. Прерывания: оптимизация обработки сокращает время реакции на внешние события.

5. Таймеры: более точные и настраиваемые таймеры позволяют микросекундную точность для особенно строгих требований.

6. Расширения реального времени позволяют адаптировать ядро к требованиям приложения. В целом источник характеризует Preempt-RT как более точный, надёжный и подходящий для высоких требований реального времени. Rockchip предоставляет патчи Preempt-RT к SDK.

### 2.2 Пользовательское пространство

Основные файлы — инструмент ethercat и динамическая библиотека libethercat.so с пользовательскими API. Исходники: https://gitlab.com/etherlab.org/ethercat/-/tree/master?ref_type=heads . Сборка создаёт ethercat, libethercat.so и examples. Можно использовать предварительно собранные бинарный файл и библиотеку.

| Пользовательская часть | Назначение | Путь |
| --- | --- | --- |
| libethercat.so | Реализация стандарта EtherCAT с интерфейсами приложений | SDK/external/rk_ethercat_release/ethercat_igh/lib/ |
| ethercat | ethercat — отладчик EtherCAT IgH | SDK/external/rk_ethercat_release/ethercat_igh/bin/ |

### 2.3 Драйверы

Драйверная часть включает ec_master.ko и несколько оптимизированных Rockchip модулей ko.

| Драйверы | Назначение |
| --- | --- |
| ec_master.ko | Модуль ядра Linux для EtherCAT-мастера; управляет шиной, обменом данными и синхронизацией master/slave |
| ec_stmmac.ko | stmmac — сетевой драйвер RK, оптимизированный для реального времени |
| pcs-xpcs.ko | Поддержка сетевой карты EtherCAT |
| phylink.ko | Управляет обменом физического/канального уровней сетевого интерфейса, настройками и состоянием физической среды |

### 2.4 Приложение EtherCAT IgH

Приложение зависит от конкретного сервопривода и не является универсальным. Пример Rockchip использует следующие компоненты:

| Компонент | Название |
| --- | --- |
| Master | Плата RK3588/RK3576/RK3568 |
| Slave-привод | Panasonic MADHT1505BA1 |
| Сервомотор | Panasonic MDMS012S1U |
| Соединительные кабели | Силовой и энкодерный кабели |

## 3. Сборка и развёртывание EtherCAT IgH

### 3.1 Ядро

#### 3.1.1 Шаг 1: патч Preempt-RT

Выберите Preempt-RT и примените патч по `SDK/docs/Patches/Real-Time-Performance/README.md`.

#### 3.1.2 Шаг 2: конфигурация ядра

 3.1.2.1 Ядро 5.10, пример RK3568

```text
#修改内核配置 把stmmac驱动设置为模块编译
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -202,7 +202,7 @@ CONFIG_R8168=y
 # CONFIG_NET_VENDOR_SILAN is not set
 # CONFIG_NET_VENDOR_SIS is not set
 # CONFIG_NET_VENDOR_SMSC is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_NET_VENDOR_SUN is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_TEHUTI is not set

#把cpu休眠关闭（这⾥也可以通过关闭CONFIG_ARM_PSCI_CPUIDLE来阻⽌cpu休眠）
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
index 778752440303..dba79303e34b 100644
--- a/arch/arm64/boot/dts/rockchip/rk3568.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568.dtsi
@@ -74,7 +74,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                        #cooling-cells = <2>;
                        dynamic-power-coefficient = <187>;
                };
@@ -86,7 +86,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                cpu2: cpu@200 {
@@ -96,7 +96,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                cpu3: cpu@300 {
@@ -106,7 +106,7 @@
                        enable-method = "psci";
                        clocks = <&scmi_clk 0>;
                        operating-points-v2 = <&cpu0_opp_table>;
-                       cpu-idle-states = <&CPU_SLEEP>;
+                       //cpu-idle-states = <&CPU_SLEEP>;
                };

                idle-states {

#隔离cpu核⼼
--- a/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3568-linux.dtsi
@@ -13,7 +13,7 @@
        };

        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 root=PARTUUID=614e0000-0000 rw rootwait";
+               bootargs = "earlycon=uart8250,mmio32,0xfe660000 console=ttyFIQ0 root=PARTUUID=614e0000-0000 isolcpus=3 nohz_full=3 rw rootwait";
        };

        fiq-debugger {
diff --git a/arch/arm64/configs/rockchip_linux_defconfig b/arch/arm64/configs/rockchip_linux_defconfig
index 1a342fe17a5d..1d3a939659b1 100644
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -649,3 +649,4 @@ CONFIG_RCU_CPU_STALL_TIMEOUT=60
 CONFIG_FUNCTION_TRACER=y
 CONFIG_BLK_DEV_IO_TRACE=y
 CONFIG_LKDTM=y
+CONFIG_NO_HZ_FULL=y
```

 3.1.2.2 Ядро 6.1, пример RK3576

```text
#修改内核配置 把stmmac驱动设置为模块编译：
--- a/arch/arm64/configs/rockchip_linux_defconfig
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -197,7 +197,7 @@ CONFIG_R8168=y
 # CONFIG_NET_VENDOR_SILAN is not set
 # CONFIG_NET_VENDOR_SIS is not set
 # CONFIG_NET_VENDOR_SMSC is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_NET_VENDOR_SUN is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_TEHUTI is not set

 --- a/arch/arm64/configs/rockchip_rt.config
+++ b/arch/arm64/configs/rockchip_rt.config
@@ -22,3 +22,4 @@ CONFIG_JUMP_LABEL=y
 CONFIG_HZ_PERIODIC=y
 CONFIG_HZ_1000=y
 CONFIG_PREEMPT_RT=y
+# CONFIG_DEBUG_PREEMPT is not set

#隔离cpu
--- a/arch/arm64/boot/dts/rockchip/rk3576-linux.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3576-linux.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0x2ad40000 console=ttyFIQ0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
+               bootargs = "earlycon=uart8250,mmio32,0x2ad40000 console=ttyFIQ0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 isolcpus=7 nohz_full=7 rw rootwait rcupdate.rcu_expedited=1 rcu_nocbs=all";
        };

        fiq_debugger: fiq-debugger {
```

 3.1.2.3 Ядро 6.1, RK3506

```text
diff --git a/arch/arm/configs/rk3506_defconfig b/arch/arm/configs/rk3506_defconfig
index e6d3ba608a77..3029973ade8c 100644
--- a/arch/arm/configs/rk3506_defconfig
+++ b/arch/arm/configs/rk3506_defconfig
@@ -2,6 +2,7 @@
 CONFIG_KERNEL_XZ=y
 CONFIG_DEFAULT_HOSTNAME="localhost"
 CONFIG_SYSVIPC=y
+CONFIG_NO_HZ_FULL=y
 CONFIG_NO_HZ=y
 CONFIG_HIGH_RES_TIMERS=y
 CONFIG_PREEMPT=y
@@ -119,12 +120,13 @@ CONFIG_NETDEVICES=y
 # CONFIG_NET_VENDOR_SOLARFLARE is not set
 # CONFIG_NET_VENDOR_SMSC is not set
 # CONFIG_NET_VENDOR_SOCIONEXT is not set
-CONFIG_STMMAC_ETH=y
+CONFIG_STMMAC_ETH=m
 # CONFIG_DWMAC_GENERIC is not set
 # CONFIG_NET_VENDOR_SYNOPSYS is not set
 # CONFIG_NET_VENDOR_VIA is not set
 # CONFIG_NET_VENDOR_WIZNET is not set
 # CONFIG_NET_VENDOR_XILINX is not set
+CONFIG_PHYLIB=y
 CONFIG_MOTORCOMM_PHY=y
 CONFIG_PPP=y
 # CONFIG_WLAN is not set
```

 3.1.2.4 Два сетевых порта

Если устройство имеет два GMAC и один нужен EtherCAT-мастеру, другой обычному Ethernet, используйте следующую схему конфигурации:

```text
gmac0⽤于ethercat，gmac1⽤于默认以太⽹：
    gmac0: ethernet@fe2a0000 {
-       compatible = "rockchip,rk3568-gmac", "snps,dwmac-4.20a";
+       compatible = "rockchip,rk3568-gmac-ethercat", "snps,dwmac-4.20a";
        reg = <0x0 0xfe2a0000 0x0 0x10000>;
```

#### 3.1.3 Шаг 3: сборка ядра реального времени

Соберите ядро реального времени по rt-linux README.md.

### 3.2 Пользовательская часть

Сборка из исходников в Linux:

```text
#进⼊源码⽬录
cd source

#指定编译链路径（编译链在SDK中有提供）
export PATH=SDK/prebuilts/gcc/linux-x86/(arch)/gcc-arm-10.3-2021.07-x86_64-(arch)-none-linux-gnu/bin:$PATH

#配置,指定内核⽬录，选择SDK下的kernel-6.1或者kernel-5.10，这⾥使⽤kernel-6.1。
./bootstrap
./configure --prefix=（编译后你需要存放的⽬录） --host=(arch)-none-linux-gnu --with-linux-dir=SDK/kernel-6.1 --enable-8139too=no --enable-stmmac=yes --enable-generic=no --enable-wildcards=yes

#编译
make -j8
make install systemdsystemunitdir=（编译后你需要存放的⽬录，和configure命令上的prefix下跟的参数需要⼀
直）

#部署，从你指定的输出⽬录中拷⻉⽂件到开发板上
cp libethercat.so*  /usr/lib/(开发板上)
cp ethercat  /usr/bin/(开发板上)
```

### 3.3 Драйверная часть

```text
cp phylink.ko /userdata/(开发板上)  内核编译
cp pcs-xpcs.ko /userdata/(开发板上) 内核编译
cp ec_master.ko /userdata/(开发板上)
cp ec_stmmac.ko /userdata/(开发板上)

#加载驱动
insmod /userdata/phylink.ko
insmod /userdata/pcs-xpcs.ko
insmod /userdata/ec_master.ko main_devices=62:36:B8:01:5B:59（这个是你的⽹⼝的物理地址，可以通过
ifconfig命令查看，如果mac地址没有给对，ethercat ⽆法使⽤）
insmod /userdata/ethercat_out/ec_stmmac.ko

#调整soc为性能模式
echo performance | tee $(find /sys/ -name *governor)
```

Если работа нарушена и при загрузке ko журнал показывает ecdev = 0x0:

```text
[  585.900540] rk_gmac-dwmac fe1c0000.ethernet: stmmac_dvr_probe: ecdev: 0x0
[  585.927904] rk_gmac-dwmac fe1c0000.ethernet eth0: Register MEM_TYPE_PAGE_POOL RxQ-0
[  585.931176] rk_gmac-dwmac fe1c0000.ethernet eth0: yt8521_config_init done, phy addr: 0,
chip mode = 0, polling mode = 2
[  585.933386] rk_gmac-dwmac fe1c0000.ethernet eth0: PHY [stmmac-1:00] driver [YT8521
Ethernet] (irq=POLL)
[  585.934039] dwmac4: Master AXI performs any burst length
[  585.934057] rk_gmac-dwmac fe1c0000.ethernet eth0: No Safety Features support found
[  585.934075] rk_gmac-dwmac fe1c0000.ethernet eth0: IEEE 1588-2008 Advanced Timestamp
supported
[  585.934469] rk_gmac-dwmac fe1c0000.ethernet eth0: registered PTP clock
[  585.938567] rk_gmac-dwmac fe1c0000.ethernet eth0: FPE workqueue start
```

Это указывает на неверный MAC-адрес; проверьте его.

### 3.4 Прикладная часть EtherCAT IgH

Приложение пишется под конкретный сервопривод. Получите его конфигурацию инструментом EtherCAT IgH из пользовательской сборки, затем разработайте приложение. Подробности см. в разделе разработки приложения ниже.

## 4. Инструменты EtherCAT IgH

`ethercat --help` показывает инструменты для получения информации о подключённых slave-устройствах, полезной при написании мастера. Ниже основные команды; по обозначению источника [] — обязательные параметры, <> — необязательные.

```text
#设置别名地址(下⾯的例⼦代表设置位置0的别名修改为1)
ethercat alias -p 0 0

#设置别名地址(下⾯的例⼦代表别名0的别名修改为1)
ethercat alias -a 0 1

#以c语⾔的形式输出pdo信息
ethercat cstruct

#输出识别到的从站
ethercat slaves
0  0(别名)):0（位置）  PREOP  +  MADHT1505BA1

#输出pdo信息
ethercat pdos
```

Остальные инструменты: https://docs.etherlab.org/ethercat/1.5/doxygen/index.html

## 5. Пример разработки приложения

Соедините и включите master-плату и slave, подключите сервомотор к slave. Загрузив драйвер платы, проверьте обмен командами:

```text
#输出识别到的从站
ethercat slaves

#如果通讯成功，就会显⽰出识别到的从站位置信息，别名和型号，如下：
0  0(别名)):0（位置）  PREOP  +  MADHT1505BA1

#输出pdo信息，这些pdo信息只是默认的，具体要根据需求，参考伺服驱动器⼿册来编写
ethercat pdos

#以c语⾔的形式输出pdo信息
ethercat cstruct
```

Полученных данных достаточно для простого приложения. См. `ethercat_igh\examples\dc_user\main.c`. Замените el3102_pdo_entries, el4102_pdos и другие PDO примера сведениями от ethercat cstruct для базовой инициализации. Основной процесс:

![Схема источника](/docs/rockchip-linux-ethercat-igh/assets/en-p015-figure-01.png)

Пример собственного прототипа RK. Его топология:

![Схема источника](/docs/rockchip-linux-ethercat-igh/assets/en-p016-figure-02.png)

Master подключён сетевым кабелем к MADHT1505BA1, тот — к второму MADHT1505BA1. Моторы связаны с приводами силовыми и энкодерными кабелями. Приложение прототипа доступно здесь:

```text
SDK/external/rk_ethercat_release/demo
```

Это образец для собственного приложения. Также предоставляются демонстрационные UI управления мотором, совместимые с приведённой тестовой программой. См.:

```text
SDK/app/lvgl_demo/motor_demo
```

## 6. TSN

По источнику TSN поддерживается только RK3576/RK3588. Драйвер должен содержать следующие коммиты:

```text
commit f6349faa5303de458a0b9dc23eba1baf5d3e2fd1 (HEAD -> last, origin/master, origin/HEAD)
Author: ZiHan Huang <zack.huang@rock-chips.com>
Date:   Tue Jul 22 16:37:07 2025 +0800

    Support dual network ports

    Change-Id: I719e2271d3417c1dc3ba95dca0b0207edfc47615
    Signed-off-by: ZiHan Huang <zack.huang@rock-chips.com>
```

TSN не поддерживается очередью0; включите очередь1 в DTS, например arch/arm64/boot/dts/rockchip/rk3576.dtsi:

```text
gmac0: ethernet@2a220000 {
    ...
    gmac0_mtl_rx_setup: rx-queues-config {
        snps,rx-queues-to-use = <2>;
        queue0 {};
        queue1 {};
    };

    gmac0_mtl_tx_setup: tx-queues-config {
        snps,tx-queues-to-use = <2>;
        queue0 {};
        queue1 {};
    };
};
```

Изменения приложения см. `/demo/ec_master_test_RK3568_MADHT1505BA1.c` в исходниках. TSN реализуется через est либо tbs. est использует est_qopt: entry — список управления воротами очередей. gate_mask=0x2 (10), interval=800000 открывает очередь1 и закрывает0 на 800us; gate_mask=0x1 (01), interval=200000 закрывает1 и открывает0 на 200us. cycle_time — суммарная длительность entries и период списка, в примере1ms. base_time — момент первого entry; enable=1 включает est. Настраивайте по требованиям. В `est_qopt.base_time = TIMESPEC2NS(wakeupTime) + est_qopt.cycle_time+ 200000` значение200us должно совпадать с entries[1].interval: первая отправка через200us после сна cycletime, затем периодически по cycle_time.

```text
 diff --git a/demo/ec_master_test_RK3568_MADHT1505BA1.c b/demo/ec_master_test_RK3568_MADHT1505BA1.c
index 5bd3cef..d2d5559 100644
--- a/demo/ec_master_test_RK3568_MADHT1505BA1.c
+++ b/demo/ec_master_test_RK3568_MADHT1505BA1.c
@@ -22,7 +22,7 @@
 // Application parameters
 // #define FREQUENCY 250
 #define FREQUENCY 1000
-#define CLOCK_TO_USE CLOCK_MONOTONIC
+#define CLOCK_TO_USE CLOCK_REALTIME
 #define MEASURE_TIMING  1
 #define TARGET_VELOCITY        1124000 /*target velocity*/
@@ -418,14 +418,30 @@ void cyclic_task_velocity_mode()
              latency_min_ns = 0, latency_max_ns = 0,
              period_min_ns = 0, period_max_ns = 0,
              exec_min_ns = 0, exec_max_ns = 0;
+
+    ec_est_sched_entry_t est_entries[2];
+    ec_est_qopt_offload_t est_qopt;

     period_max_ns = 0;
     period_min_ns = 0xffffffff;
     latency_max_ns = 0;
     latency_min_ns = 0xffffffff;
+
+    est_entries[0].gate_mask = 0x2;
+    est_entries[0].interval = 800000;
+    est_entries[1].gate_mask = 0x1;
+    est_entries[1].interval = 200000;
+    est_qopt.num_entries = 2;
+    est_qopt.enable = 1;
+    est_qopt.entries = est_entries;
+    est_qopt.cycle_time = TIMESPEC2NS(cycletime);

     clock_gettime(CLOCK_TO_USE, &lastStartTime);
     clock_gettime(CLOCK_TO_USE, &wakeupTime);
+
+    est_qopt.base_time = TIMESPEC2NS(wakeupTime) + est_qopt.cycle_time + 200000;
+    ecrt_master_set_est(master, &est_qopt);
+
     while(app_run) {
         wakeupTime = timespec_add(wakeupTime, cycletime);
         clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);
```

tbs использует tbs_qopt: enable=1 включает функцию, queue=1 включает её для очереди1. Отправка идёт по app-времени ecrt_master_application_time. В `ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime) + 200000)` 200us означает отправку через200us и настраивается пользователем. Устанавливайте время после сна каждого цикла для периодической отправки.

```text
 diff --git a/demo/ec_master_test_RK3568_MADHT1505BA1.c b/demo/ec_master_test_RK3568_MADHT1505BA1.c
index 5bd3cef..46b3588 100644
--- a/demo/ec_master_test_RK3568_MADHT1505BA1.c
+++ b/demo/ec_master_test_RK3568_MADHT1505BA1.c
@@ -22,7 +22,7 @@
 // Application parameters
 // #define FREQUENCY 250
 #define FREQUENCY 1000
-#define CLOCK_TO_USE CLOCK_MONOTONIC
+#define CLOCK_TO_USE CLOCK_REALTIME
 #define MEASURE_TIMING  1
 #define TARGET_VELOCITY        1124000 /*target velocity*/
@@ -419,13 +419,21 @@ void cyclic_task_velocity_mode()
              period_min_ns = 0, period_max_ns = 0,
              exec_min_ns = 0, exec_max_ns = 0;

+    ec_tbs_qopt_offload_t tbs_qopt;
+
     period_max_ns = 0;
     period_min_ns = 0xffffffff;
     latency_max_ns = 0;
     latency_min_ns = 0xffffffff;
+
+    tbs_qopt.enable = 1;
+    tbs_qopt.queue = 1;

     clock_gettime(CLOCK_TO_USE, &lastStartTime);
     clock_gettime(CLOCK_TO_USE, &wakeupTime);
+
+    ecrt_master_set_tbs(master, &tbs_qopt);
+
     while(app_run) {
         wakeupTime = timespec_add(wakeupTime, cycletime);
         clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);
@@ -435,7 +443,7 @@ void cyclic_task_velocity_mode()
         // It is a good idea to use the target time (not the measured time) as
         // application time, because it is more stable.
         //
-        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime));
+        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime) + 200000);

         /*Receive process data*/
         ecrt_master_receive(master);
```

Кроме того, синхронизируйте системное время с GMAC PTP следующей командой; ptp0 соответствует gmac0.

```text
phc2sys -s /dev/ptp0 -c CLOCK_REALTIME -O 0
```

## 7. Производительность

### 7.1 Метод испытания

В `cyclic_task_velocity_mode` файла `SDK/external/rk_ethercat_release/demo/ec_master_test_RK3568_MADHT1505BA1.c` реализован сбор максимальной/минимальной длительности цикла:

```text
static int clean_cycle = 0;//5 * 60 * FREQUENCY;
void cyclic_task_velocity_mode()
{
    static unsigned int timeout_error = 0;
    struct timespec wakeupTime, time;
    uint16_t    status;
    int8_t      opmode;
    int32_t     cur_velocity;
    bool        print = false;

    struct timespec startTime, endTime, lastStartTime = {};
    uint32_t period_ns = 0, exec_ns = 0, latency_ns = 0,
             latency_min_ns = 0, latency_max_ns = 0,
             period_min_ns = 0, period_max_ns = 0,
             exec_min_ns = 0, exec_max_ns = 0;

    period_max_ns = 0;
    period_min_ns = 0xffffffff;
    latency_max_ns = 0;
    latency_min_ns = 0xffffffff;

    clock_gettime(CLOCK_TO_USE, &lastStartTime);
    clock_gettime(CLOCK_TO_USE, &wakeupTime);
    while(app_run) {//这⾥会⼀直在循环
        wakeupTime = timespec_add(wakeupTime, cycletime);
        clock_nanosleep(CLOCK_TO_USE, TIMER_ABSTIME, &wakeupTime, NULL);

        // Write application time to master
        //
        // It is a good idea to use the target time (not the measured time) as
        // application time, because it is more stable.
        //
        ecrt_master_application_time(master, TIMESPEC2NS(wakeupTime));

        /*Receive process data*/
        ecrt_master_receive(master);
        ecrt_domain_process(domain);
        // check process data state (optional)
        check_domain_state();

        if (counter) {
            counter--;
        }else {
            counter = FREQUENCY;
            check_master_state();
            check_slave_config_states();
            /*Check process data state(optional)*/

            EC_WRITE_U16(domain_pd + control_word, 0x80);
            // EC_WRITE_U8(domain_pd + modes_of_operation, 9);
            /*Read inputs*/
            status = EC_READ_U16(domain_pd + status_word);
            opmode = EC_READ_U8(domain_pd + modes_of_operation_display);
            cur_velocity = EC_READ_S32(domain_pd + current_velocity);
            printf_debug("madht:  act velocity = %d ,  status = 0x%x, opmode = 0x%x\n",
cur_velocity,  status, opmode);
            if( (status & 0x004f) == 0x0040) {
                printf_debug("0x06\n");
                EC_WRITE_U16(domain_pd + control_word, 0x0006);
                EC_WRITE_U8(domain_pd + modes_of_operation, 9);
            }

            else if( (status & 0x006f) == 0x0021) {
                printf_debug("0x07\n");
                EC_WRITE_U16(domain_pd + control_word, 0x0007);
            }

            else if( (status & 0x006f) == 0x0023) {
                printf_debug("0x0f\n");
                EC_WRITE_U16(domain_pd + control_word, 0x000f);
                EC_WRITE_S32(domain_pd + target_velocity, TARGET_VELOCITY);
            }

            //operation enabled
            else if( (status & 0x006f) == 0x0027) {
                printf_debug("0x1f\n");
                EC_WRITE_U16(domain_pd + control_word, 0x001f);
            }
        }

        clock_gettime(CLOCK_TO_USE, &time);
        ecrt_master_sync_reference_clock_to(master, TIMESPEC2NS(time));
        ecrt_master_sync_slave_clocks(master);
        // send process data
        ecrt_domain_queue(domain);
        ecrt_master_send(master);

        clock_gettime(CLOCK_TO_USE, &startTime);
        latency_ns = DIFF_NS(wakeupTime, startTime);
        period_ns = DIFF_NS(lastStartTime, startTime);
        //exec_ns = DIFF_NS(lastStartTime, endTime);
    /* clean */
        if (clean_cycle >= (5 * 60 * 1000)) {
            clean_cycle = 0;
            period_max_ns = 0;
            period_min_ns = 0xffffffff;
            latency_max_ns = 0;
            latency_min_ns = 0xffffffff;
        }

//计算抖动最⼤最⼩值
        if (latency_ns > latency_max_ns) {
            latency_max_ns = latency_ns;
        }
        if (latency_ns < latency_min_ns) {
            latency_min_ns = latency_ns;
        }

        if (period_ns > period_max_ns) {
            period_max_ns = period_ns;
            print = true;
        }
        if (period_ns < period_min_ns) {
            period_min_ns = period_ns;
            print = true;
        }

        clean_cycle++;
        lastStartTime = startTime;
        // output timing stats
        if (print) {
            printf("period     %10u ... %10u\n",
                    period_min_ns, period_max_ns);
        //printf("exec       %10u ... %10u\n",
        //        exec_min_ns, exec_max_ns);
        printf("latency    %10u ... %10u\n",
                latency_min_ns, latency_max_ns);
        }
        print = false;
    }
}
```

Для периода1ms максимальный джиттер равен максимуму минус минимум и оценивает реальное время мастера. TSN управляет временем аппаратной очереди: tx драйвера возвращается до физической отправки. Поэтому измерение времени сразу после функции отправки даёт большую погрешность. Для более точного журнального джиттера добавьте следующий патч в `devices/stmmac/stmmac_main-6.1-ethercat.c`. Измерение формы txen осциллографом точнее и патча не требует.

```text
diff --git a/devices/stmmac/stmmac_main-6.1-ethercat.c b/devices/stmmac/stmmac_main-6.1-ethercat.c
index d04856a..904c1eb 100644
--- a/devices/stmmac/stmmac_main-6.1-ethercat.c
+++ b/devices/stmmac/stmmac_main-6.1-ethercat.c
@@ -4628,6 +4628,11 @@ static netdev_tx_t stmmac_xmit(struct sk_buff *skb, struct net_device *dev)
        if (!priv->ecdev)
                stmmac_tx_timer_arm(priv, queue);

+       if (priv->ecdev && skb->tstamp) {
+               if ((priv->plat->est && priv->plat->est->enable) || (tx_q->tbs & STMMAC_TBS_EN))
+                       while(((readl(priv->ioaddr + 0x0114) & GENMASK(18,17)) >> 17) != 0x3)
+       }
+
        return NETDEV_TX_OK;

 dma_map_err:
```

### 7.2 Данные испытаний

Исходные результаты платформ при управляющем периоде1ms:

| SoC | Период | Джиттер задержки | Джиттер задержки (TSN) |
| --- | --- | --- | --- |
| RK3588 | 1ms | 15us | 1us |
| RK3576 | 1ms | 30us | 1us |
| RK3568 | 1ms | 50us | N/A |
| RK3506 | 1ms | 100us | N/A |

{% endraw %}
