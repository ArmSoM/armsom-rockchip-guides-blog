---
title: "Rockchip RT-Thread SPI Flash: Entwicklerleitfaden"
description: "Rockchip RT-Thread SPI Flash: Entwicklerleitfaden — V1.4.0"
excerpt: "Rockchip RT-Thread SPI Flash: Entwicklerleitfaden — V1.4.0"
translation_key: "136-rockchip-rtthread-spiflash"
slug: "136-rockchip-rtthread-spiflash"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Rockchip-Plattformreferenz für das RK RT-Thread SDK mit den in der Quelle aufgeführten Chips einschließlich RK2108/RK2118. Unterstützung konkreter ArmSoM-Platinen ist unbestätigt; keine Hardwarevalidierung. Vor Anpassung SoC, SDK/BSP, RT-Thread-Version, Controller, IOMUX, Verdrahtung und Spannungsdomänen prüfen. Befehle und Testergebnisse stammen aus der Quelle, nicht aus ArmSoM-Messungen; keine Hardware- oder Flash-Operationen wurden ausgeführt. Nur das chinesische Original liegt vor; alle vier Sprachen verwenden dessen Abbildungen.

RK-KF-YF-080 · V1.4.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.5 -->

## 1. Einführung

<!-- cn PDF p.5 -->

### 1.1 Unterstützte Bausteine

<!-- cn PDF p.5 -->

SPI NOR bietet kleine Gehäuse, schnellere Lesezugriffe als andere kleine nichtflüchtige Speicher, wenige Pins und einfache Protokolle. Übliche Bausteine unterstützen 1/2/4 Leitungen, sind wenig anfällig für Bitfehler, byteadressierbar und lesen ohne Wartezeit nach Befehl/Adresse; dies ermöglicht XIP (Quelle: “Excute In Place”). RK RTOS bietet generische NOR-Schnittstellen und automatisches XIP.
SPI NAND verwendet dieselben Controller und wird im RT-Thread SDK unterstützt. Es benötigt aber FTL oder ein FTL-fähiges Dateisystem, mit beträchtlichem RAM-/Codebedarf und begrenzter Stabilität. Stabile Versorgung beim Abschalten ist wichtig; batterielose MCU-Produkte sind gefährdet. Daher rät die Quelle von NAND ab, außer begrenzten Erweiterungen für schreibgeschützte Firmware.

<!-- cn PDF p.5 -->

### 1.2 Host-Controller

<!-- cn PDF p.5 -->

RK SPI flash kann FSPI, SFC oder SPI verwenden.
- FSPI (Flexible Serial Peripheral Interface): SPI NOR/NAND und SPI-PSRAM/SRAM; Standard (eine Leitung), Dual, Quad, teils Octal; SDR, teils DTR; XIP; integriertes DMA.
- SFC (Serial Flash Controller): SPI NOR/NAND und SPI-PSRAM/SRAM; Standard/Dual/Quad; SDR; integriertes DMA.
- Allgemeines SPI: SPI NOR/NAND und SPI-PSRAM; Standard mit einer Leitung; SDR; externes DMA.

<!-- cn PDF p.6 -->

### 1.3 NOR-Flash-XIP

<!-- cn PDF p.6 -->

XIP (eXecute In Place) lässt die CPU Befehle direkt aus abgebildetem Flash holen, ohne Code ins RAM zu kopieren; Ausführungsadressen sind die Abbildungsadressen. NOR-XIP ist nur lesbar, daher nur Code und schreibgeschützte Daten dort ablegen. FSPI erlaubt auch DSP und anderen Mastern Zugriff wie auf schreibgeschütztes SRAM; siehe TRM FSPI.
Die NOR-Lese-API kann XIP (Abbildungszugriff, keine redundante Registerkonfiguration, Prefetch, hohe Effizienz) oder CPU (Controller konfigurieren, FIFO per CPU bewegen) nutzen. Standard ist XIP. RT_SNOR_XIP_DATA_BEGIN setzt den Beginn; bei 327680 liest [0:327680) per CPU und [327680,Ende] per XIP.

<!-- cn PDF p.6 -->

### 1.4 SPI-Flash-Treiberarchitektur

<!-- cn PDF p.6 -->

Für FSPI/SFC/SPI wird die Controllerschicht abstrahiert. Vier NOR-Schichten: MTD; RTOS-Treiber (Geräteregistrierung, Controller/Operationen bei HAL_SNOR registrieren, Lesen/Schreiben/Löschen kapseln); HAL_SNOR-Protokoll; Controller. Die Quelle nennt trotz drei Einträgen „zwei“ Controllertypen.

<!-- cn PDF p.6 -->

![Abbildung des chinesischen Originals (p.6)](/docs/rockchip-rtthread-spiflash/assets/cn-p006-figure-01.png)

*Abbildung des chinesischen Originals (p.6)*

<!-- cn PDF p.7 -->

FSPI: drv_snor.c kapselt HAL-Lesen/-Schreiben als SPI_Xfer, registriert FSPI-Host und SPI_Xfer bei HAL_SNOR, kapselt Lesen/Schreiben/Löschen und registriert das OS-Gerät bei MTD. hal_snor.c implementiert NOR, hal_fspi.c den Controller.
SPI: drv_snor.c kapselt OS-Treiber-Lesen/-Schreiben als SPI_Xfer, registriert Host und SPI_Xfer bei HAL_SNOR, kapselt Protokolloperationen und registriert MTD. hal_snor.c implementiert das Protokoll, hal_spi.c den Low-Level-Controller und SpiDevice.c Registrierung und Kapselung des RTOS-SPI-Treibers. Hinweise:

<!-- cn PDF p.7 -->

1. Die Implementierungen entsprechen dem Diagramm.

<!-- cn PDF p.7 -->

2. RK SPI DMA liegt im OS-Treiber. SPI bedient weitere Geräte und benötigt Ressourcenschutz. Daher muss Flash die OS-SPI-Schnittstelle verwenden, nicht direkt hal_spi.c.

<!-- cn PDF p.7 -->

### 1.5 FSPI-Chipeigenschaften

<!-- cn PDF p.7 -->

Nur SoCs mit Open-Source-Speicherlösung sind aufgeführt.

<!-- cn PDF p.7 -->

| SOC | FSPI/SFC IO max rate | FSPI/SFC data io lines | Support XIP |
| --- | --- | --- | --- |
| RK2108/Pisces | 150MHz | x1\x2\x4 SDR | Y |
| RK2206 | 150MHz | x1\x2\x4 SDR | Y |
| RK2118 | SDR:133MHz<br>DTR:80MHz | x1\x2\x4 SDR<br>x4 DDR with/without DQS<br>x8 DDR with/without DQS | Y |

<!-- cn PDF p.7 -->

AP-Unterstützung: Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md. x1 heißt Standard, x2 Dual, x4 Quad, x8 Octal. Quad standardmäßig SDR, Octal DDR with DQS.

<!-- cn PDF p.8 -->

## 2. SPI NOR

<!-- cn PDF p.8 -->

### 2.1 Konfiguration

<!-- cn PDF p.8 -->

#### 2.1.1 Architektur

<!-- cn PDF p.8 -->

| Type | Memory | Controller driver | Flash framework |
| --- | --- | --- | --- |
| SPI NOR | SPI NOR | hal: lib/hal/src/hal_fspi.c<br>RT-Thread: bsp/rockchip/commob/drv_snor.c | hal: lib/hal/src/hal_snor.c |

<!-- cn PDF p.8 -->

HAL-Wurzel: bsp/rockchip/common/hal. NOR-Unterstützung in lib/hal/src/hal_snor.c, weitere Dateien im gleichen Verzeichnis. Flash-ID oder Gehäuseaufdruck zuordnen. Die Software erkennt IDs und wählt die größte Controller-Breite; per Treibermakro reduzieren.

<!-- cn PDF p.8 -->

#### 2.1.2 Treiberkonfiguration

<!-- cn PDF p.8 -->

Zuerst den tatsächlichen SPI-Flash-Controller bestimmen und passende Lösung wählen. Grundlegender menuconfig-Eintrag:

<!-- cn PDF p.8 -->

```text
RT-Thread rockchip common drivers  --->
    [*] Enable ROCKCHIP SPI NOR Flash
    (80000000) Reset the speed of SPI Nor flash in Hz
    [ ]   Set SPI Host DUAL IO Lines /* 如果 FSPI 主控仅预留 IO0~1,应使用 Dual mode */
            Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) --->
```

<!-- cn PDF p.8 -->

Konfigurationsdefinitionen:

<!-- cn PDF p.9 -->

```text
RT_USING_MTD_NOR=y
RT_USING_SNOR=y
RT_SNOR_SPEED=80000000 /* IO 接口速率 */
# RT_SNOR_DUAL_IO=n /* 默认不配置，Quad SPI 限制为 Duad SPI 使用 */
# RT_SNOR_XIP_DATA_BEGIN=0 /* 默认不配置，XIP 读接口实现起始地址，详细参考 “Nor Flash XIP 技术”说明 */
RT_USING_SNOR_FSPI_HOST=y /* FSPI 控制器方案 */
# RT_USING_SNOR_SFC_HOST=y /* SFC 控制器方案 */
# RT_USING_SNOR_SPI_HOST=y /* SPI 控制器方案 */
# RT_SNOR_SPI_DEVICE_NAME="spi2_0" /* SPI 控制器方案，指定目标控制器 */
RT_USING_DFS_MNTTABLE=y                # 启动 DFS mnt table 自动挂载支持
RT_USING_DFS_ELMFAT=y                  # 启用 elm FatFs
RT_DFS_ELM_MAX_SECTOR_SIZE=4096        # 设置 elm FatFs sector size，设定固定为 4KB
```

<!-- cn PDF p.9 -->

#### 2.1.3 Partitionstabelle

<!-- cn PDF p.9 -->

Siehe Partitionstabellenkonfiguration in rockchip/Rockchip_Developer_Guide_RT-Thread_CN.md. NOR registriert nur Partitionen mit FLAG [8,9] property 1, 2 oder 3 als RT-Thread-Geräte. root hat meist Flag=0x305 und wird als root-Blockgerät registriert.

<!-- cn PDF p.9 -->

#### 2.1.4 Partitionen erzeugen, lesen und registrieren

<!-- cn PDF p.9 -->

Gepackte RK-RT-Thread-Firmware legt RK_PARTITION in die ersten 2KB Flash. Angaben in setting.ini ändern. Nach NOR-Initialisierung liest und registriert snor_partition_init in drv_snor.c die Tabelle. Registrierung prüfen:

<!-- cn PDF p.9 -->

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
root     Block Device         1            /* 分区名 root，分区类型 block 设备，Nor flash 支持 setting.ini 修改设定为 MTD 设备 */
snor     MTD Device           0            /* SPI Nor 根存储设备，分区读写最终接入到该 节点完成读写擦除 */
```

<!-- cn PDF p.9 -->

#### 2.1.5 elm-fat und Einhängen

<!-- cn PDF p.9 -->

RT-Thread-elm-fat-Unterstützung:

<!-- cn PDF p.10 -->

```text
RT-Thread Components --->
    Device virtual file system  --->
    [*] Using device virtual file system
    [*]   Using mount table for file system /* 实现相应注册分区表，可实现分区上电自动挂 载 */
    [*]   Enable elm-chan fatfs /* fat 文件系统 */
        elm-chan's FatFs, Generic FAT Filesystem Module  --->
        (4096) Maximum sector size to be handled. /*对于 SPI Nor 产品必须修改为 4096 */
```

<!-- cn PDF p.10 -->

Mit CONFIG_RT_USING_DFS_MNTTABLE die Registrierung in mnt.c ergänzen, etwa root unter /:

<!-- cn PDF p.10 -->

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

<!-- cn PDF p.10 -->

Für einen eigenen Einhängeablauf:

<!-- cn PDF p.10 -->

```text
dfs_mount("root", "/", "elm", 0, 0)
```

<!-- cn PDF p.10 -->

Einhängebefehl:

<!-- cn PDF p.10 -->

```text
mount root / elm
```

<!-- cn PDF p.10 -->

elm-fat-Abbilder: ./bsp/rockchip/tools/mkroot.sh verwenden; zentraler Befehl mkfs.fat.

<!-- cn PDF p.10 -->

### 2.2 XIP-Hinweise

<!-- cn PDF p.10 -->

NOR unterstützt XIP; FSPI-NOR aktiviert es automatisch. Folgende Hinweise betreffen die Produktnutzung.

<!-- cn PDF p.10 -->

#### 2.2.1 XIP aktivieren

<!-- cn PDF p.10 -->

Nach Treiberkonfiguration eingerichtetes FSPI-Flash aktiviert XIP standardmäßig. Zum Abschalten “Enable FSPI XIP” deaktivieren.

<!-- cn PDF p.10 -->

#### 2.2.2 XIP im Betrieb umschalten

<!-- cn PDF p.10 -->

Das Framework schaltet XIP automatisch; Nutzer müssen die Schalter nicht aufrufen. XIP aus:

<!-- cn PDF p.11 -->

NOR-Löschen/-Schreiben dauert lange und ist während XIP nicht unterstützt. Bei solchen Anfragen, auch Dateisystemschreiben, suspendiert die Software XIP und schaltet FSPI auf normal mode. XIP ist dann nicht verfügbar. Ablauf:

<!-- cn PDF p.11 -->

1. Alle betroffenen Master zum Aussetzen des XIP-Zugriffs auffordern.

<!-- cn PDF p.11 -->

2. Globale Interrupts sperren, damit kein Interrupt NOR-XIP-Code ausführt.

<!-- cn PDF p.11 -->

3. XIP abschalten.

XIP ein: Nach Löschen/Schreiben und FSPI idle stellt der Treiber XIP wieder her. Ohne solche Operationen bleibt es aktiv. Wiederaufnahme:

<!-- cn PDF p.11 -->

1. XIP aktivieren.

<!-- cn PDF p.11 -->

2. Globale Interrupts freigeben (Quelle schreibt wörtlich „globales Terminal“; als Quellfehler dokumentiert).

<!-- cn PDF p.11 -->

3. Alle ausgesetzten Geräte zur Wiederaufnahme auffordern. Einstiegspunkte:

<!-- cn PDF p.11 -->

```text
static rt_base_t snor_xip_suspend(void)
static void snor_xip_resume(rt_base_t level)
```

<!-- cn PDF p.11 -->

Zusammenfassung: FSPI-NOR aktiviert XIP standardmäßig. Im Idle können Geräte NOR über die XIP-Abbildung lesen. Löschen/Schreiben deaktiviert XIP. Geräte müssen zum Stoppen/Fortsetzen benachrichtigt werden. XIP-Abschalten sperrt auch globale Interrupts.

<!-- cn PDF p.11 -->

### 2.3 API-Beispiele

<!-- cn PDF p.11 -->

#### 2.3.1 SNOR-MTD-Bytegerät

<!-- cn PDF p.11 -->

Siehe _at_snor_test in snor_test.c:

<!-- cn PDF p.11 -->

```text
snor_device = (struct rt_mtd_nor_device *)rt_device_find("snor");
rt_mtd_nor_erase_block(snor_device, test_lba * block_size, block_size);
rt_mtd_nor_write(snor_device, test_lba * block_size, (const rt_uint8_t
*)pwrite32, block_size);
rt_mtd_nor_read(snor_device, test_lba * block_size, (rt_uint8_t *)pread32,
block_size);
```

<!-- cn PDF p.11 -->

snor ist ein Bytegerät. rt_mtd_nor_erase_block: Bytes, mindestens 4096Bytes ausrichten (Flash-Sektor). rt_mtd_nor_write/read: Bytes, mindestens 1 Byte. RK-Partitionstabellen verwenden 512B-Sektoren; Einheiten umrechnen.

<!-- cn PDF p.12 -->

#### 2.3.2 MTD-Bytegerät einer Partition

<!-- cn PDF p.12 -->

Der NOR-Treiber liest die Tabelle und registriert Partitionen. Eine MTD partition in setting.ini wird als Bytegerät mit denselben SNOR-MTD-APIs registriert:

<!-- cn PDF p.12 -->

```text
snor_device = (struct rt_mtd_nor_device *)rt_device_find("xxxx");
rt_mtd_nor_erase_block(snor_device, test_lba * block_size, block_size);
rt_mtd_nor_write(snor_device, test_lba * block_size, (const rt_uint8_t
*)pwrite32, block_size);
rt_mtd_nor_read(snor_device, test_lba * block_size, (rt_uint8_t *)pread32,
block_size);
```

<!-- cn PDF p.12 -->

#### 2.3.3 Partitionsblockgerät

<!-- cn PDF p.12 -->

Eine Block partition aus setting.ini wird als Blockgerät registriert. Standard-RT-Thread-read/write verwenden; Sektoreinheit 4KB.

<!-- cn PDF p.12 -->

### 2.4 Testtreiber

<!-- cn PDF p.12 -->

Bei SPI-Flash-Entwicklung folgende einfache Lese-/Schreibtests einplanen.

<!-- cn PDF p.12 -->

#### 2.4.1 Treiberkonfiguration

<!-- cn PDF p.12 -->

```text
RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]   Enable BSP Common SNOR TEST (NEW)
```

<!-- cn PDF p.12 -->

Nach erfolgreicher Konfiguration ist snor_test in msh verfügbar.

<!-- cn PDF p.12 -->

#### 2.4.2 Testbefehle

<!-- cn PDF p.12 -->

snor_test zeigt Hilfe. Alle folgenden Befehlseinheiten sind Bytes.

<!-- cn PDF p.13 -->

```text
1. snor_test write offset size
2. snor_test read offset size loop
3. snor_test erase offset
4. snor_test stress offset size loop
5. snor_test io_stress offset size loop width rw
6. snor_test pm_test
like:
        snor_test write 2097152 4096
        snor_test read 2097152 4096 2000
        snor_test erase 2097152
        snor_test stress 2097152 2097152 5000
        snor_test io_stress 2097152 2097152 5000 4
        snor_test pm_test
```

<!-- cn PDF p.13 -->

offset: Byteversatz im Flash, keine XIP-Adresse; nur dezimal. stress: aufsteigende Daten. io_stress width: Folge zum Prüfen der IO-Zustände; 4 für Quad, 8 für Octal. rw: 1 nur Schreiben inklusive Löschen, 2 nur Lesen, 3 Lesen/Schreiben.

<!-- cn PDF p.13 -->

#### 2.4.3 Befehlsbeispiele

<!-- cn PDF p.13 -->

##### 2.4.3.1 Leserate

<!-- cn PDF p.13 -->

```text
msh >snor_test read 2097152 4096 2000
[SNOR TEST] read:  30219d00 + 0x0:0x00000200,0x0000000f,0x000000ff,0x00000000,
[SNOR TEST] read:  30219d00 + 0x10:0x000000ff,0x000000cc,0x000000c3,0x000000cc,
[SNOR TEST] read:  30219d00 + 0x20:0x000000c3,0x0000003c,0x000000cc,0x000000ff,
[SNOR TEST] read:  30219d00 + 0x30:0x000000fe,0x000000ff,0x000000fe,0x000000ef,
snor read speed: 143719 KB/s
```

<!-- cn PDF p.13 -->

##### 2.4.3.2 Quad-Flash-Signaltest

<!-- cn PDF p.13 -->

Schreibsignaltest:

<!-- cn PDF p.13 -->

```text
snor_test io_stress 2097152 2097152 5000 4 1
```

<!-- cn PDF p.13 -->

Lesesignaltest:

<!-- cn PDF p.13 -->

```text
snor_test io_stress 2097152 2097152 5000 4 2
```

<!-- cn PDF p.14 -->

##### 2.4.3.3 Octal-Flash-Signaltest

<!-- cn PDF p.14 -->

Schreibsignaltest:

<!-- cn PDF p.14 -->

```text
snor_test io_stress 2097152 2097152 5000 8 1
```

<!-- cn PDF p.14 -->

Lesesignaltest:

<!-- cn PDF p.14 -->

```text
snor_test io_stress 2097152 2097152 5000 8 2
```

<!-- cn PDF p.14 -->

### 2.5 Fehlerbehebung

<!-- cn PDF p.14 -->

Registrierung prüfen: list_device muss snor zeigen.

“Init adapte error ret= -19” meldet snor_adapt: -1 bedeutet NOR-ID 0xff, eventuell schlechte Lötstelle; Schaltung/Signale prüfen. -19 bedeutet nicht unterstützten Baustein; RK um Ergänzung bitten. -22 bedeutet fehlenden SPI-Controller.

Mehrverbrauch durch dauerhaftes XIP? FSPI gibt nach Idle-Timeout CS frei; NOR geht in stromsparendes Idle. Der Unterschied ist nicht groß.

Mehrere XIP-Master: Der Bus arbitriert und serialisiert; wartende Anfragen bleiben am Bus.

Häufige Dateisystemschreibzugriffe: Code in SRAM/PSRAM legen und XIP deaktivieren, sonst leidet RTOS-Echtzeitverhalten. Bei XIP-Code NOR-Löschen/-Schreiben minimieren.

Dateisystemlesen schaltet XIP nicht ab; der Treiber liest darüber.

Ohne gespeicherte Partitionstabelle ist Einhängen nicht möglich. Die Tabelle muss am Flash-Anfang liegen; der aktuelle RK-NOR-Treiber liest nur diese Tabelle.

<!-- cn PDF p.14 -->

## 3. SPI NAND

<!-- cn PDF p.15 -->

### 3.1 Hinweise

<!-- cn PDF p.15 -->

#### 3.1.1 RK-SPI-NAND-Speicher

<!-- cn PDF p.15 -->

| Filesystem | Update |
| --- | --- |
| FATFS | USB / programmer / OTA |

<!-- cn PDF p.15 -->

### 3.2 Konfiguration

<!-- cn PDF p.15 -->

#### 3.2.1 Architektur

<!-- cn PDF p.15 -->

![Abbildung des chinesischen Originals (p.15)](/docs/rockchip-rtthread-spiflash/assets/cn-p015-figure-01.png)

*Abbildung des chinesischen Originals (p.15)*

<!-- cn PDF p.16 -->

| Type | Memory | Driver |
| --- | --- | --- |
| SPI Nand | SPI Nand | DHARA FTL: bsp/rockchip/common/dhara/<br>RTT Mini FTL: bsp/rockchip/common/mini_ftl.c<br>RTT SPI Nand: bsp/rockchip/common/drv_spinand.c<br>HAL SPI Nand: lib/hal/src/hal_spinand.c<br>HAL Controller: lib/hal/src/hal_fspi.c |

<!-- cn PDF p.16 -->

HAL-Wurzel: bsp/rockchip/common/hal. NAND-Unterstützung in lib/hal/src/hal_spinand.c und Nachbardateien. ID/Aufdruck zuordnen. Der Treiber erkennt IDs und wählt maximale IO-Breite; per Makro reduzieren.

<!-- cn PDF p.16 -->

#### 3.2.2 Treiberkonfiguration

<!-- cn PDF p.16 -->

Vor Auswahl den tatsächlichen SPI-Flash-Controller bestimmen. menuconfig-Eintrag:

<!-- cn PDF p.16 -->

```text
RT-Thread rockchip common drivers  --->
    [*] Enable ROCKCHIP SPI Nand Flash
    (80000000) Reset the speed of SPI Nand flash in Hz
    (y)   Support mini ftl
          Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) --->
            Attach FSPI controller to SPINAND
    [ ]     extend fspi cs1 as SPINAND device (NEW)
```

<!-- cn PDF p.16 -->

Konfigurationsdefinitionen:

<!-- cn PDF p.16 -->

```text
RT_USING_SNOR=n                        # 关闭 SPI Nor 驱动，通常外设仅有一种 SPI Flash
RT_USING_MTD_NAND=y
RT_USING_SPINAND=y
RT_SPINAND_SPEED=80000000              # IO 接口速率
RT_USING_SPINAND_FSPI_HOST=y           # FSPI 控制器方案
RT_USING_FTL=y                         # 启用 SPI Nand FTL 存储管理算法
RT_USING_DHARA=y                       # 启用 SPI Nand DHARA FTL 存储管理算法（与 Mini FTL 兼容）
RT_USING_DFS_MNTTABLE=y                # 启动 DFS mnt table 自动挂载支持
RT_USING_DFS_ELMFAT=y                  # 启用 elm FatFs
RT_DFS_ELM_MAX_SECTOR_SIZE=2048        # 设置 elm FatFs sector size，设定为 flash pagesize，通常为 2KB/4KB，参考颗粒手册
```

<!-- cn PDF p.16 -->

Auch XIP deaktivieren: XIP = 'N' in rtconfig.py.

<!-- cn PDF p.17 -->

#### 3.2.3 FTL-Algorithmen

<!-- cn PDF p.17 -->

##### 3.2.3.1 DHARA FTL

<!-- cn PDF p.17 -->

Dhara (Dæ:ra) ist Open-Source-FTL für ressourcenarme NAND-Systeme mit veränderlicher Block-Lese-/Schreibschnittstelle.
- Wear Leveling: Löschzähler zweier Blöcke unterscheiden sich höchstens um 1.
- GC-Geschwindigkeit lässt sich über das GC-Verhältnis zulasten freien Platzes anpassen.
- Logisches Sektorschreiben/Trim ist atomar. Stromausfall rollt zum letzten Synchronisationspunkt zurück; Synchronisation periodisch oder explizit.
- Bei gleichmäßig verteilten schlechten Blöcken benötigen alle Operationen einschließlich Start im schlechtesten Fall O(log n) für Chipgröße n.
Mit DHARA nutzen Partitionsblock-APIs DHARA, Sektorgröße gleich Seitengröße, meist 2KB/4KB. Einschränkung: Standardmäßig nur der gesamte NAND als FTL-Bereich.
Anwendungen: ein FSPI mit NAND für Firmware/Daten; ein FSPI mit CS0-NOR-Firmware ohne XIP und CSN1-NAND-Daten; mehrere FSPI mit FSPI0-NOR-Firmware und FSPI1-NAND-Daten.

<!-- cn PDF p.17 -->

##### 3.2.3.2 Mini-FTL-Treiber

<!-- cn PDF p.17 -->

Mini FTL ist keine normale FTL-Schicht: nur grundlegende Bad-Block-Verwaltung, hauptsächlich für Firmwareupdates. Die Partition root wird als gleichnamiges Blockgerät für ein schreibgeschütztes Dateisystem registriert.

<!-- cn PDF p.17 -->

#### 3.2.4 Partitionstabelle konfigurieren

<!-- cn PDF p.17 -->

##### 3.2.4.1 Partitionsplanung

<!-- cn PDF p.17 -->

Beginn und Größe an 256KB ausrichten für 128KB/256KB-Blöcke. Ersatzplatz: außer Tabellenpartition brauchen kleine Partitionen 1–2 Flash-Blöcke, über 8MB 1%. Am Ende 2MB für vier Bad-Block-Tabellenblöcke und einen guten Backup-Tabellenblock reservieren, passend für 128KB/256KB. Für OTA A/B empfohlen.

<!-- cn PDF p.18 -->

##### 3.2.4.2 RK-Partition-Erweiterung

<!-- cn PDF p.18 -->

RKs Tabelle ähnelt GPT, braucht weniger Ressourcen und startet schneller, vor allem RV1107/8 und MCU. NAND registriert standardmäßig die letzte Partition für DHARA FTL, meist root für das Dateisystem.

<!-- cn PDF p.18 -->

##### 3.2.4.3 GPT-Erweiterung

<!-- cn PDF p.18 -->

Das RK SDK unterstützt auch GPT; die letzte Partition wird standardmäßig DHARA FTL zugeordnet, meist root für ein Dateisystem.

<!-- cn PDF p.18 -->

##### 3.2.4.4 Eigene ROOT-Partition

<!-- cn PDF p.18 -->

Ohne Partitionstabellenerweiterung diese einzelne ROOT-Definition in drv_spinand.c verwenden:

<!-- cn PDF p.18 -->

```text
RT_ROOT_PART_OFFSET
RT_ROOT_PART_SIZE
```

<!-- cn PDF p.18 -->

Einheiten: Sektoren mit 512B. RK3308 RT-Thread build.sh zeigt die Anbindung dieser Definitionen an das Buildskript.

<!-- cn PDF p.18 -->

#### 3.2.5 Partitionen lesen und registrieren

<!-- cn PDF p.18 -->

Nach NAND-Initialisierung die Tabelle auswerten und letzte Partition registrieren. Prüfung:

<!-- cn PDF p.18 -->

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
userdata Block Device         0            /* DHARA FTL 实现，分区类型 block 设备， 通常为可读写 FAT 文件系统 */
root     Block Device         1            /* Mini FTL 实现，分区类型 block 设备，通 常为只读 FAT 文件系统 */
spinand  MTD Device           0            /* SPI Nand MTD 设备，分区读写最终接入到该 节点完成读写擦除 */
```

<!-- cn PDF p.18 -->

### 3.3 PC-Flashwerkzeuge

<!-- cn PDF p.18 -->

SocToolKit für Windows/Linux verwenden; passende Serienwerkzeuge existieren. Für OTA A/B empfohlen.

<!-- cn PDF p.19 -->

Separate wie gepackte NAND-Abbilder werden letztlich partitionsweise geschrieben. RK Partition unterstützt Einzelabbilder, nicht Firmware.img. GPT unterstützt Einzelabbilder und update.img. Andere Erweiterungen nur Einzelabbilder.

<!-- cn PDF p.19 -->

### 3.4 API-Beispiele

<!-- cn PDF p.19 -->

![Abbildung des chinesischen Originals (p.19)](/docs/rockchip-rtthread-spiflash/assets/cn-p019-figure-01.png)

*Abbildung des chinesischen Originals (p.19)*

<!-- cn PDF p.19 -->

#### 3.4.1 MTD-Bytegerät: Basis-API

<!-- cn PDF p.19 -->

Siehe spinand_test in spinand_test.c:

<!-- cn PDF p.19 -->

```text
mtd_dev = (struct rt_mtd_nor_device *)rt_device_find("spinand0");
rt_mtd_nand_check_block(mtd_dev, block);
rt_mtd_nand_erase_block(mtd_dev, block);
rt_mtd_nand_write(mtd_dev, page_addr + i, (const rt_uint8_t *)buffer, mtd_dev->page_size, RT_NULL, 0);
rt_mtd_nand_read(mtd_dev, page_addr + i, (rt_uint8_t *)buffer, mtd_dev->page_size, RT_NULL, 0);
```

<!-- cn PDF p.19 -->

spinand0 ist ein Bytegerät. rt_mtd_nand_check_block: true für schlechte, false für gute Blöcke. Die Quelle nennt hier rt_mtd_nor_erase_block (Blöcke) und rt_mtd_nor_write/read (Bytes, Seitenausrichtung, meist 2KB/4KB; Flash-Handbuch beachten); NOR-Namen bleiben erhalten. RK-Tabellen verwenden 512B-Sektoren; Einheiten umrechnen.

<!-- cn PDF p.20 -->

#### 3.4.2 Mini FTL: OTA-/Dateisystem-API

<!-- cn PDF p.20 -->

Für OTA siehe mini_ftl_test_one_flash_block in spinand_test.c:

<!-- cn PDF p.20 -->

```text
rt_uint32_t block_size = mtd_dev->pages_per_block * mtd_dev->page_size;
mtd_dev = (struct rt_mtd_nor_device *)rt_device_find("spinand0");
mini_ftl_erase(mtd_dev, addr, block_size);
mini_ftl_write(mtd_dev, buffer, addr, block_size);
mini_ftl_read(mtd_dev, buffer, addr, block_size);
```

<!-- cn PDF p.20 -->

mini_ftl_erase: Bytes, blocksize-Ausrichtung. mini_ftl_write: Bytes, pagesize-Ausrichtung, vorher löschen. mini_ftl_read: Bytes, pagesize-Ausrichtung. Bei OTA buffer an block_size ausrichten und erase/write/read-Prüfung in einem Aufruf abschließen; vor elm-FatFs-Update gesamte Partition löschen. RK Partition: rk_partition_list; GPT: dfs_part_list, noch ohne name info.
Nach Partitionskonfiguration wird root als root-Blockgerät über Mini FTL für ein schreibgeschütztes Dateisystem registriert. Nur Abbild-Flashen, kein Online-Formatieren.

<!-- cn PDF p.20 -->

#### 3.4.3 DHARA-FTL-Dateisystem-API

<!-- cn PDF p.20 -->

Die letzte Partition wird gleichnamiges DHARA-FTL-Blockgerät für ein les-/schreibbares Dateisystem. Abbild-Flashen und Online-Formatieren werden unterstützt.

<!-- cn PDF p.20 -->

### 3.5 Dateisysteme

<!-- cn PDF p.20 -->

#### 3.5.1 elm-FatFs-Unterstützung

<!-- cn PDF p.20 -->

Mini-FTL-Blockgeräte sind schreibgeschützt, hängen FAT ein, verwenden FAT-Firmwareabbilder und erlauben kein Online-Formatieren. DHARA-FTL-Geräte lesen/schreiben FAT, benötigen ein als DHARA verpacktes FAT-Abbild und unterstützen Online-Formatieren.

<!-- cn PDF p.21 -->

##### 3.5.1.1 Partitionen einhängen

<!-- cn PDF p.21 -->

Mit CONFIG_RT_USING_DFS_MNTTABLE Registrierung in mnt.c ergänzen, etwa root unter /:

<!-- cn PDF p.21 -->

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

<!-- cn PDF p.21 -->

Für einen eigenen Einhängeablauf:

<!-- cn PDF p.21 -->

```text
dfs_mount("root", "/", "elm", 0, 0)
```

<!-- cn PDF p.21 -->

Einhängebefehl:

<!-- cn PDF p.21 -->

```text
mount root / elm
```

<!-- cn PDF p.21 -->

##### 3.5.1.2 Online-Partitionsformatierung

<!-- cn PDF p.21 -->

```text
mkfs -t elm userdata
```

<!-- cn PDF p.21 -->

root ist schreibgeschützt: nur Einhängen, kein Online-Formatieren.

<!-- cn PDF p.21 -->

##### 3.5.1.3 elm-fat-Abbilder offline erstellen

<!-- cn PDF p.21 -->

./bsp/rockchip/tools/mkroot.sh mit mkfs.fat verwenden; -S entsprechend page_size, meist 2048/4096 laut NAND-Handbuch.

<!-- cn PDF p.21 -->

##### 3.5.1.4 DHARA-Abbilder offline erstellen

<!-- cn PDF p.21 -->

DHARA-Werkzeug:

<!-- cn PDF p.21 -->

```text
Usage: ./dhara_utils <file_path> <flash_page_size> <num_blocks>
```

<!-- cn PDF p.21 -->

Beispiel: FAT16-DHARA offline, Partition 504 Blöcke, NAND-Seite 2KB:

<!-- cn PDF p.21 -->

```text
mkfs.vfat -F 16 -s 1 -S 2048 fat.img
./rkbin/dhara_utils fat.img 2 504
```

<!-- cn PDF p.21 -->

Ausgabe: fat.img.dhara.

<!-- cn PDF p.22 -->

Partitionsgröße siehe Partitionsplanung.

<!-- cn PDF p.22 -->

### 3.6 Testtreiber

<!-- cn PDF p.22 -->

#### 3.6.1 Grundlegende Testkonfiguration

<!-- cn PDF p.22 -->

```text
RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]   Enable BSP Common SPINAND TEST (NEW)
```

<!-- cn PDF p.22 -->

Nach Konfiguration ist spinand_test in msh verfügbar:

<!-- cn PDF p.22 -->

```text
msh />spinand_test
1. spinand_test write <page_addr> <page_num>
2. spinand_test read <page_addr> <page_nun>
3. spinand_test erase <blk_addr>
4. spinand_test erase_all <blk_addr>
5. spinand_test stress <loop>
6. spinand_test bbt
7. spinand_test markbad <blk_addr>
8. spinand_test mini_ftl_test <byte_offset>
9. spinand_test part_list
like:
        spinand_test write 1024 1
        spinand_test read 1024 1
        spinand_test erase 16
        spinand_test erase_all 512
        spinand_test stress 5000
        spinand_test bbt
        spinand_test mini_ftl_test 67108864
        spinand_test part_list
```

<!-- cn PDF p.22 -->

#### 3.6.2 flash_stress_test-Lese-/Schreiblast

<!-- cn PDF p.22 -->

Ziel: NAND-Stabilität unter Lese-/Schreiblast. 10 Zielgeräte vorbereiten. Testbereich: Offset 512 Blöcke, Länge 256 Flash-Blöcke.

<!-- cn PDF p.22 -->

1. Nach Start spinand_test stress 5000 512 256 ausführen und Versorgung ununterbrochen halten.

<!-- cn PDF p.22 -->

2. Testprotokolle aufzeichnen.

<!-- cn PDF p.22 -->

3. Bestanden bei normalem Betrieb nach 24 Stunden, sonst fehlgeschlagen.

<!-- cn PDF p.23 -->

#### 3.6.3 power_lost_test bei Stromausfall

<!-- cn PDF p.23 -->

Ziel: Robustheit bei Stromausfällen, besonders häufig bei batterielosen NAND-Produkten. 10 Geräte vorbereiten. Verfahren:

<!-- cn PDF p.23 -->

1. Dateikopierlast erzeugen.

<!-- cn PDF p.23 -->

2. 2 Sekunden einschalten, 3 Sekunden ausschalten: 5-Sekunden-Zyklus über 8 Stunden, etwa 5760 Unterbrechungen. Nach jeder Unterbrechung innerhalb 5 Sekunden hochfahren und Kopieren ausführen.

<!-- cn PDF p.23 -->

3. Testprotokolle aufzeichnen.

<!-- cn PDF p.23 -->

4. Die Quelle verlangt normalen Betrieb nach 24 Stunden (Widerspruch zu 8 Stunden oben; beide Werte bleiben), sonst fehlgeschlagen. Siehe Referenzquellcode für Stromausfälle.

<!-- cn PDF p.23 -->

### 3.7 Fehlerbehebung

<!-- cn PDF p.23 -->

#### 3.7.1 RK2118 hängt mit aktiviertem NAND

<!-- cn PDF p.23 -->

Symptom:

<!-- cn PDF p.23 -->

```text
FW data_offset:2048
FW data_size:  195584
FW load_addr:  0x1060800
copy 1090000 20a200 400
hash_256 fail! ret:-1
MemBoot fali!

SoftReset...
```

<!-- cn PDF p.23 -->

XIP versuchsweise deaktivieren:

<!-- cn PDF p.23 -->

```text
diff --git a/bsp/rockchip/rk2118/rtconfig.py b/bsp/rockchip/rk2118/rtconfig.py
index 2b6e696e2b..32b5117513 100644
--- a/bsp/rockchip/rk2118/rtconfig.py
+++ b/bsp/rockchip/rk2118/rtconfig.py
@@ -29,8 +29,8 @@ if os.getenv('RTT_EXEC_PATH'):
 #BUILD = 'debug'
 BUILD = 'release'

-XIP = 'Y'
-#XIP = 'N'
+#XIP = 'Y'
+XIP = 'N'
 if os.getenv('RTT_BUILD_XIP'):
     XIP = os.getenv('RTT_BUILD_XIP').upper()
```

<!-- cn PDF p.24 -->

#### 3.7.2 NAND unterstützt RK Firmware.img nicht

<!-- cn PDF p.24 -->

RK Firmware.img füllt ungenutzten Partitionsplatz mit Nullen, außer die letzte Partition darf leer sein. Bei gleichen Nutzabbildern wächst das Padding mit größeren Partitionen stark; alles wird als ein Update übertragen. NAND erlaubt werkseitige Bad Blocks und braucht Ersatzraum. Ein aufgefülltes “one firmware” widerspricht dem; selbst ein einzelnes Paket muss entpackt und nur Nutzabbilder partitionsweise geschrieben werden. Auch Programmiergeräte können kein monolithisches Abbild verwenden.

<!-- cn PDF p.24 -->

#### 3.7.3 NAND-Stromausfallprobleme

<!-- cn PDF p.24 -->

Abnormales Abschalten umgeht die normale Deinitialisierung und kann NAND bei instabiler Spannung betreiben. Vor allem Löschen (mehrere Millisekunden) und Programmieren (Hunderte Mikrosekunden) sind betroffen. 3V3-Bausteine benötigen meist mindestens 2.7V; Datenblatt beachten.
Zwei Fehlerarten: unvollständige Schreibdaten; zufällige Befehlsfehler bei instabiler Spannung.
Dateisystem-Recovery schützt vor unvollständigen Daten, Datenverlust bleibt möglich. Schutz gegen instabile Spannung:
- PMIC überwacht VCC IO und setzt CPU meist unter 2.91V zurück, sodass keine neuen Lösch-/Schreibbefehle kommen. Die Entladung muss etwa 1ms Betriebsspannung für den letzten Zugriff halten.
- Reset IC ähnlich, typischer Schwellwert 2.93V.
- RK NPOR überwacht VCCIO und setzt bei seinem Schwellwert zurück.
NAND-Produkte möglichst mit Batterie oder Dauerstrom auslegen. Sonst Hardware verbessern: PMIC/Reset IC/RK NPOR erkennt fallendes VCC IO und setzt CPU vor Niederspannungsbefehlen zurück.

<!-- cn PDF p.25 -->

Kapazität nach RK-Demoplatinen ergänzen, damit VCCIO flash gültig bleibt, normalerweise für tBERS (Blocklöschzeit). Stromausfälle bei Flash-Zugriffen vermeiden. Backups/Recovery: doppelte Firmware, kritische Daten im schreibgeschützten Dateisystem, Wiederherstellung beschädigter Schreibpartitionen für Betrieb oder OTA.
Zeitablauf am realen Produkt unter realer Last mit power_lost_test prüfen und VCC3V3/RESETn erfassen:

<!-- cn PDF p.25 -->

![Abbildung des chinesischen Originals (p.25)](/docs/rockchip-rtthread-spiflash/assets/cn-p025-figure-01.png)

*Abbildung des chinesischen Originals (p.25)*

<!-- cn PDF p.25 -->

Das Oszilloskop muss RESETn-/Reset-IC-Auslösung (Y1), VCC3V3-Abfall auf 2V7 (Y2) und ΔY1Y2-Zeit zeigen. Wiederholen und kleinstes Intervall analysieren. Bei RV1106 und ähnlichem RKNPOR ist RESETn intern: GPIO high mit externem Pull-down als Näherung verwenden. CPU-Reset deaktiviert GPIO, Pull-down zieht es low; diese Flanke entspricht näherungsweise dem Reset.

<!-- cn PDF p.26 -->

#### 3.7.4 NAND-Stromausfall-Referenzcode

<!-- cn PDF p.26 -->

```text
#include <dfs_file.h>

static void readwrite_test(void *param)
{
    int fd, size, len = 2048, loops = 0;
    char *pwrite, *pread;

    pwrite = rt_malloc(len);
    if (!pwrite) {
        rt_kprintf("malloc pwrite failed\n");
        return;
    }
    pread = rt_malloc(len);
    if (!pread) {
        rt_kprintf("malloc pread failed\n");
        rt_free(pwrite);
        return;
    }

    fd = open("/file_stress.txt", O_RDWR | O_CREAT);
    if (fd < 0)
    {
        rt_kprintf("%s open file failed\n", __func__);
        goto err_open;
    }

    while (1) {
        rt_kprintf("file_stress, loops=%d\n", loops);
        rt_memset(pwrite, loops & 0xff, len);

        lseek(fd, 0, SEEK_SET);
        write(fd, pwrite, len);
        lseek(fd, 0, SEEK_SET);
        size = read(fd, pread, len);
        if (size < 0) {
            break;
        }

        if (rt_memcmp(pwrite, pread, len)) {
            rt_kprintf("%s compare failed, %x\n", __func__, pread[0]);
            break;
        }
        loops++;
    }

    close(fd);
err_open:
    rt_free(pread);
    rt_free(pwrite);
}

void file_stress(void)
{
    rt_thread_t thread;

    thread = rt_thread_create("file_stresss",
                              readwrite_test, NULL,
                              2048,
                              21, 20);
    rt_thread_startup(thread);
}
```

{% endraw %}
