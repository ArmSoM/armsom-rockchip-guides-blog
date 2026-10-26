---
title: "Rockchip RT-Thread SPI2APB: Entwicklerleitfaden"
description: "Rockchip RT-Thread SPI2APB: Entwicklerleitfaden — V1.2.0"
excerpt: "Rockchip RT-Thread SPI2APB: Entwicklerleitfaden — V1.2.0"
translation_key: "135-rockchip-rtthread-spi2apb"
slug: "135-rockchip-rtthread-spi2apb"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Rockchip-Plattformreferenz für das RK RT-Thread SDK mit RK2108/RK2118 (SPI2APB hauptsächlich RK2118). Unterstützung konkreter ArmSoM-Platinen ist unbestätigt; keine Hardwarevalidierung. Vor Anpassung SoC, SDK/BSP, RT-Thread-Version, Controller, IOMUX, Verdrahtung und Spannungsdomänen prüfen. Befehle und Testergebnisse stammen aus der Quelle, nicht aus ArmSoM-Messungen; keine Hardware- oder Flash-Operationen wurden ausgeführt. Nur das chinesische Original liegt vor; alle vier Sprachen verwenden dessen Abbildungen.

RK-KF-YF-498 · V1.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. Einführung

<!-- cn PDF p.4 -->

### 1.1 Wichtige Hinweise

<!-- cn PDF p.4 -->

SPI2APB legt ein proprietäres RK-Protokoll über Standard-SPI, anders als das allgemeinere RK SPI ohne Zusatzprotokoll. Dies bei der Schaltplanprüfung beachten.

<!-- cn PDF p.4 -->

### 1.2 Controller-Eigenschaften

<!-- cn PDF p.4 -->

Unterstützt SPI-Modi 0/2 (0 empfohlen), 8-Bit-Übertragungen, Interrupts und Lesen/Schreiben interner Register. LSB/MSB und Little Endian/Big Endian sind einstellbar. Nur Simplex und Slave werden unterstützt. Der Master muss SPI2APB-konform senden. Grundformat: `<CMD-32bits> [ADDR-32bits] [DUMMY-32bits] [READ_BEGING-32bits] [DATA]`. Varianten siehe Tabelle.

<!-- cn PDF p.4 -->

| Operation | Protocol | CMD-32bits Little Endian |
| --- | --- | --- |
| Daten lesen | read data | &lt;0x00000077&gt; &lt;ADDR&gt; &lt;DUMMY&gt; &lt;READ_BEGING&gt; &lt;DATA&gt; |
| Daten schreiben | write data | &lt;0x00000011&gt; &lt;ADDR&gt; &lt;DATA&gt; |
| REG0 schreiben | write msg reg0 | &lt;0x00010011&gt; &lt;DATA-32bits&gt; |
| REG1 schreiben, Interrupt | write msg reg1 | &lt;0x00020011&gt; &lt;DATA-32bits&gt; |
| Status der letzten Übertragung | query state | &lt;0x000000ff&gt; &lt;DATA-32bits&gt; |
| REG2 lesen | query msg reg2 | &lt;0x000001ff&gt; &lt;DATA-32bits&gt; |

<!-- cn PDF p.4 -->

[ADDR-32bits] ist eine unterstützte Speicheradresse, meist SRAM/DRAM. [DUMMY-32bits] ist beliebig und kann 0 sein. [READ_BEGING-32bits] ist 0x000000AA. Rückgaben von query state siehe “State Register Information” im SPI2APB-Kapitel des TRM.

<!-- cn PDF p.5 -->

### 1.3 Schnittstelleneigenschaften

<!-- cn PDF p.5 -->

| SoC | Max rate |
| --- | --- |
| RK2118 | 50MHz |

<!-- cn PDF p.5 -->

Die Maximalrate ist theoretisch; Leitungsführung und PCB-Qualität beeinflussen das zu messende Ergebnis.

<!-- cn PDF p.5 -->

## 2. Software

<!-- cn PDF p.5 -->

### 2.1 Quellcodepfade

<!-- cn PDF p.5 -->

Framework-Code:

<!-- cn PDF p.5 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
```

<!-- cn PDF p.5 -->

Treiberanpassung:

<!-- cn PDF p.5 -->

```text
bsp/rockchip/common/drivers/drv_spi2apb.c
bsp/rockchip/common/hal/lib/hal/src/hal_spi2apb.c
```

<!-- cn PDF p.5 -->

Testbefehle; Anwendungen können diesem Treiber folgen:

<!-- cn PDF p.5 -->

```text
bsp/rockchip-common/tests/spi2apb_test.c
```

<!-- cn PDF p.5 -->

### 2.2 Konfiguration

<!-- cn PDF p.5 -->

Option mit SPI2APB im Namen aktivieren.

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

Platinen-iomux konfigurieren.

<!-- cn PDF p.6 -->

### 2.3 Nutzungskonfiguration

<!-- cn PDF p.6 -->

Standard: LSB, Little Endian. Änderungsbeispiel in drv_spi2apb.c:

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

Nur LSB/MSB ändern; die übrigen Standardwerte beibehalten.

<!-- cn PDF p.6 -->

## 3. Tests

<!-- cn PDF p.6 -->

### 3.1 Konfiguration

<!-- cn PDF p.6 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI2APB TEST
```

<!-- cn PDF p.6 -->

### 3.2 Testbefehle

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

Master = SPI master; Slave = RK SPI2APB slave. mode: bit0 0-LSB/1-MSB; bit1 0-LittleEndian/1-BigEndian. polarity nur zum Debuggen ändern; im Betrieb TX invert/RX normal beibehalten, also polarity =

<!-- cn PDF p.7 -->

2. bit0: 0-RX normal, 1-RX invert; bit1: 0-TX normal, 1-TX invert.

<!-- cn PDF p.7 -->

## 4. Anwendungsintegration

<!-- cn PDF p.7 -->

Beide Seiten müssen Datenfluss und Steuerinformationen auf SPI2APB aufbauen. Master-Anwendung und Treiber können vom RK-Referenzcode abgeleitet werden. Quellenort laut Original: SPI-Entwicklungsmaterialien — FAE-Projekt — Rockchip Redmine (rock-chips.com).

<!-- cn PDF p.7 -->

### 4.1 Grundarchitektur

<!-- cn PDF p.7 -->

![Abbildung des chinesischen Originals (p.7)](/docs/rockchip-rtthread-spi2apb/assets/cn-p007-figure-01.png)

*Abbildung des chinesischen Originals (p.7)*

API-/Ablauftext der Abbildung (Originalnamen/Nummerierung; kein ausführbarer Code)

```text
spidev_rkspi2apb_app -> spidev_rkspi2apb.c -> SPI driver -> spi master
spi2apb_test.c <-> SPI2APB RTOS driver -> SPI2APB IP -> spi2apb slave
SPI2APB IP -> SRAM
```

<!-- cn PDF p.7 -->

Beispiel: RV1106 SPI master mit RK2118 SPI2APB. Quellcodekomponenten:

<!-- cn PDF p.8 -->

| Schicht | Master (Linux 5.10) | Slave (HAL + RTOS) |
| --- | --- | --- |
| Anwendung | spidev_rkspi2apb_app: ioctl/read/write | test_spi2apb.c: REG |
| Kerneltreiber | spidev_rkspi2apb.c: SPI2APB ioctl/read/write |  |
| Controllertreiber | spi-rockchip.c | drv_spi2apb.c<br>hal_spi2apb.c |
| Controller | spi master | spi2apb slave |

<!-- cn PDF p.8 -->

ioctl-Schnittstelle von spidev_rkspi2apb.c:

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

Lesen/Schreiben in spidev_rkspi2apbc.c (Quellenschreibweise):

<!-- cn PDF p.8 -->

```text
write(spidev_fd, buffer_w, size); /* 参考 'write data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
read(spidev_fd, buffer_r, size); /* 参考 'read data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
```

<!-- cn PDF p.8 -->

Zieladresse vereinbaren: Vorbelegung wird empfohlen. Bekannte SRAM-Adresse im Slave reservieren und am Master per ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR setzen. RT-Thread reserviert meist über __spi2apb_buffer_start__ im Linkerskript. Alternativ SRAM im Slave allozieren und die Adresse durch einen eigenen Austausch an den Master senden, wie im folgenden Ablauf.

<!-- cn PDF p.9 -->

![Abbildung des chinesischen Originals (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-01.png)

*Abbildung des chinesischen Originals (p.9)*

API-/Ablauftext der Abbildung (Originalnamen/Nummerierung; kein ausführbarer Code)

```text
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_INT_REQ -> SPI master
SPI master -> write reg1 -> SPI2APB slave -> interrupt call back -> SPI2APB APP
SPI2APB APP -> write address info to reg2 -> SPI2APB slave
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_GET_DEV_STATE -> read reg2
```

<!-- cn PDF p.9 -->

### 4.2 Flash-Object-Dienst

<!-- cn PDF p.9 -->

Flash Object überträgt Anfragen über spi/spi2apb, damit der SPI-Master den SPI NOR am SPI2APB-Slave lesen/schreiben kann.

<!-- cn PDF p.9 -->

#### 4.2.1 Grundprinzip

<!-- cn PDF p.9 -->

![Abbildung des chinesischen Originals (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-02.png)

*Abbildung des chinesischen Originals (p.9)*

API-/Ablauftext der Abbildung (Originalnamen/Nummerierung; kein ausführbarer Code)

```text
spi2apb_flash_obj_mst.c -> drv_spi.c -> spi master
spi2apb_test.c -> SRAM_SPI2APB_BASE
spi2apb slave <-> SRAM_SPI2APB_BASE <-> spinor
```

<!-- cn PDF p.9 -->

NOR-Flash-Leseablauf:

<!-- cn PDF p.10 -->

![Abbildung des chinesischen Originals (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-01.png)

*Abbildung des chinesischen Originals (p.10)*

API-/Ablauftext der Abbildung (Originalnamen/Nummerierung; kein ausführbarer Code)

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

NOR-Flash-Schreibablauf:

<!-- cn PDF p.10 -->

![Abbildung des chinesischen Originals (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-02.png)

*Abbildung des chinesischen Originals (p.10)*

API-/Ablauftext der Abbildung (Originalnamen/Nummerierung; kein ausführbarer Code)

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

#### 4.2.2 Schnittstellen

<!-- cn PDF p.10 -->

flash_obj-Master-Schnittstelle:

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

SPI2APB-Wrapper des flash_obj-Masters:

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

flash_obj-Slave-Schnittstelle:

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

Nach Initialisierung den SPI2APB-Interrupt-Callback registrieren. Die reg1-Bottom-Half-Workqueue analysiert Transaktionen, liest/schreibt spinor und setzt Statusbits der Zustandsmaschine.

<!-- cn PDF p.12 -->

#### 4.2.3 Flash-obj-Konfiguration

<!-- cn PDF p.12 -->

```text
CONFIG_RT_USING_COMMON_TEST_SPI2APB_FLASH_OBJ = y
```

<!-- cn PDF p.12 -->

#### 4.2.4 Flash-obj-Testbefehle

<!-- cn PDF p.12 -->

flash_obj-Slave-Befehle:

<!-- cn PDF p.12 -->

```text
spi2apb_test flash_obj spi2apb
```

<!-- cn PDF p.12 -->

flash_obj-Master-Befehle:

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

spi2apb_progsram verwendet write data; anschließend löst write msg reg1 den SPI2APB-Interrupt aus. spi2apb_readsram verwendet read data und wartet zuvor auf reg2-Status SPI2APB_FLASH_OBJ_CMD_READ_SRAM_READY. spi2apb_writemsg entspricht write msg reg0/1, spi2apb_querymsg read msg reg2. write_sector schreibt NOR flash, read_sector liest, stress schreibt und liest für einen Belastungstest zurück. Alle drei verwenden 4KB-Sektoren.

<!-- cn PDF p.12 -->

## 5. Fehlerbehebung

<!-- cn PDF p.12 -->

### 5.1 SPI2APB-Übertragungsfehler

<!-- cn PDF p.12 -->

Nach dem Testabschnitt SPI-Modus 0, lsb, Little Endian konfigurieren und Callback registrieren:

<!-- cn PDF p.13 -->

```text
spi2apb_test config spi2apb 1 2
spi2apb_test cb spi2apb
```

<!-- cn PDF p.13 -->

Der Master muss dem Übertragungsprotokoll folgen. Zuerst write reg1 versuchen, um einen SPI2APB-Interrupt auszulösen. Gemeinsame Masse, Master-csn/clock per Oszilloskop, Slave-Verdrahtung und unbestückte 0Ω-Widerstände prüfen.
Bei falschen Empfangsdaten Geschwindigkeit reduzieren. LSB/MSB und Byte-Reihenfolge prüfen. Sind nur Teile gültig und hängt das Muster mit der Cache-Zeilengröße zusammen, fehlen wahrscheinlich Slave-Kohärenzoperationen: normalerweise invalidate nach Lesen und flush vor Schreiben. Wurde der Lesepuffer zuvor gelöscht oder beschrieben, auch vor der Übertragung flush ausführen.


## Technische Quellenlinks

- [PDF reference 1](https://redmine.rock-chips.com/documents/125)

{% endraw %}
