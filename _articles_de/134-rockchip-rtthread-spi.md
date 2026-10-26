---
title: "Rockchip RT-Thread SPI: Entwicklerleitfaden"
description: "Rockchip RT-Thread SPI: Entwicklerleitfaden — V2.2.0"
excerpt: "Rockchip RT-Thread SPI: Entwicklerleitfaden — V2.2.0"
translation_key: "134-rockchip-rtthread-spi"
slug: "134-rockchip-rtthread-spi"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Rockchip-Plattformreferenz für das RK RT-Thread SDK mit RK2108/RK2118 (SPI2APB hauptsächlich RK2118). Unterstützung konkreter ArmSoM-Platinen ist unbestätigt; keine Hardwarevalidierung. Vor Anpassung SoC, SDK/BSP, RT-Thread-Version, Controller, IOMUX, Verdrahtung und Spannungsdomänen prüfen. Befehle und Testergebnisse stammen aus der Quelle, nicht aus ArmSoM-Messungen; keine Hardware- oder Flash-Operationen wurden ausgeführt. Nur das chinesische Original liegt vor; alle vier Sprachen verwenden dessen Abbildungen.

RK-KF-YF-093 · V2.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. Eigenschaften von Rockchip SPI

<!-- cn PDF p.4 -->

### 1.1 Eigenschaften des SPI-Controllers

<!-- cn PDF p.4 -->

SPI (Serial Peripheral Interface).
- Master unterstützt SPI-Modi 0/1/2/3, Slave ebenfalls 0/1/2/3. Für die höchste Slave-Rate wird Modus 0 empfohlen.
- Normalerweise zwei Chip-Select-Signale; Übertragung mit 8 und 16 Bit.
- Interrupt- und DMA-Übertragung; FIFO-Tiefe 32 oder 64.
- Einstellbarer Master-Abtasttakt RSD.
- Slave-Betrieb; manche Chips unterstützen externe Taktabtastung im Slave-Modus.
- LSB/MSB und Byte-Reihenfolge einstellbar.
- Einige Chips erkennen cs inactive und erzeugen beim Freigeben von CS einen Interrupt.
- Vierdrahtübertragung MOSI/MOSI (Wortlaut der Quelle): Master MOSI-Ausgang/MISO-Eingang; Slave MISO-Ausgang/MOSI-Eingang.

<!-- cn PDF p.4 -->

### 1.2 SPI-Schnittstelleneigenschaften

<!-- cn PDF p.4 -->

| SoC | Master max | Slave max | TX/RX FIFO | Rx Sample Delay unit |
| --- | --- | --- | --- | --- |
| RK2108 | 50MHz | 16MHz | 64 | \ |
| RK2118 | 50MHz | 50MHz (SPI mode 0) | 64 | 5ns |

<!-- cn PDF p.4 -->

Die maximale Schnittstellenrate ist theoretisch und hängt von Leitungsführung und PCB-Qualität ab; maßgeblich ist die Messung. Manche PLL-Strategien erlauben keine exakte Teilung bis zum Grenzwert; die höchste erreichbare geteilte Frequenz gilt. Rx Sample Delay wird im Abschnitt zur Abtastverzögerung beschrieben.

<!-- cn PDF p.4 -->

### 1.3 Hinweise zum SPI-Slave-Betrieb

<!-- cn PDF p.4 -->

#### 1.3.1 SPI2APB

<!-- cn PDF p.4 -->

Dieses Dokument behandelt RK SPI, einen anderen IP-Block als RK SPI2APB. RK SPI unterstützt Master/Slave ohne vorgeschriebenes Slave-Datenformat. RK SPI2APB unterstützt ausschließlich Slave mit festem Übertragungsformat.

<!-- cn PDF p.5 -->

Für SPI2APB, beispielsweise RK2118 SPI0 (SPI2APB), siehe das SPI2APB-Kapitel im TRM und Rockchip_Developer_Guide_RT-Thread_SPI2APB.

<!-- cn PDF p.5 -->

#### 1.3.2 Übertragungsablauf

<!-- cn PDF p.5 -->

Grundlegender Übertragungsablauf von RK SPI Slave:

<!-- cn PDF p.5 -->

![Abbildung des chinesischen Originals (p.5)](/docs/rockchip-rtthread-spi/assets/cn-p005-figure-01.png)

*Abbildung des chinesischen Originals (p.5)*

<!-- cn PDF p.5 -->

Slave-Seite:
1. Die Anwendung ruft die Übertragungsschnittstelle mit einer Länge auf. Simplex-Lesen/-Schreiben und Vollduplex werden unterstützt.
2. Auf Übertragung warten; der Master muss dazu passen. Nach der Registerkonfiguration wartet der Controller auf den entfernten Master. Für jede Slave-Übertragung ist die Schnittstelle erneut aufzurufen. Das maximale Intervall Tgap(max) unter RT-Thread ist zu beachten; der Master muss mindestens so lange warten. Wegen unterschiedlicher Anwendungslast gibt es keinen theoretischen Richtwert: messen. Optional liefert ready eine Echtzeitbenachrichtigung; siehe das Hinzufügen des Ready-Signals.
3. Daten empfangen: Bei mehr als einer halben TX/RX-FIFO-Länge verwendet die Software automatisch DMA, um Übertragungsjitter zu vermeiden; bis einschließlich einer halben FIFO-Länge IRQ.
4. Rückkehr: Feste Länge (Standard) ignoriert das Freigeben von CS und kehrt erst nach Empfang der eingestellten Datenmenge zurück, sonst blockiert sie. Flexible Länge erkennt CS-Freigabe und kehrt bei vorzeitiger Freigabe oder Empfang der eingestellten Menge zurück, sonst blockiert sie. Konfiguration siehe unten.

Master-Seite:
1. Die Anwendung ruft die Übertragungsschnittstelle auf.
2. Optional auf ready warten. Tgap(max) des Slaves einhalten, sodass innerhalb Tgap keine zwei Übertragungen beginnen. Unterstützt der Slave ready, einen Interrupt auf steigende Flanke konfigurieren, ready gültig setzen und nach der Übertragung zurücksetzen.
3. Der Controller startet die Übertragung.

<!-- cn PDF p.6 -->

#### 1.3.3 Übertragungszeitablauf

<!-- cn PDF p.6 -->

![Abbildung des chinesischen Originals (p.6)](/docs/rockchip-rtthread-spi/assets/cn-p006-figure-01.png)

*Abbildung des chinesischen Originals (p.6)*

<!-- cn PDF p.6 -->

Schritt 1: Schnittstellenaufruf der Anwendung. Schritt 2: ready (optional). Schritt 3: auf Übertragung warten. Schritt 4: Datenübertragung. Schritt 5: Rückkehr.

<!-- cn PDF p.6 -->

#### 1.3.4 Übertragung flexibler Länge

<!-- cn PDF p.6 -->

Das RK SDK nutzt standardmäßig feste SPI-Slave-Längen: Die Schnittstelle kehrt erst nach Empfang der angegebenen Menge zurück, sonst wartet sie unbegrenzt. Flexible Länge liefert die tatsächlich übertragene Menge, wenn die vollständige Länge empfangen oder CS vorzeitig freigegeben wird. Grundlage ist die aktivierte cs-inactive-Hardwareerkennung des Slaves. Unterstützung siehe Tabelle.

<!-- cn PDF p.6 -->

| SoC | cs inactive | Flexible Length |
| --- | --- | --- |
| RK2108 | Unterstützt | Nicht angepasst |
| RK2118 | Unterstützt | BURST_SIZE=1: 25MHz; BURST_SIZE=2: 50MHz (max) |

<!-- cn PDF p.6 -->

Siehe Controller-Konfiguration. Neben dem Einschalten ist burst size zu wählen:
- Kleinere Bursts senken die SPI-/Buseffizienz und können Slave-Paketverluste verursachen, beschränken aber die Master-Länge weniger. RK2118 mit burst size 1 unterstützt master sclk bis 25MHz; darüber sind Verluste möglich, die Master-Länge ist jedoch unbeschränkt.
- Größere Bursts erhöhen Effizienz und IO-Rate, schränken die Master-Länge stärker ein. RK2118 mit burst size 2 unterstützt master sclk 50MHz und verlangt 2-Byte-Ausrichtung.

<!-- cn PDF p.7 -->

## 2. Software

<!-- cn PDF p.7 -->

### 2.1 Quellcodepfade

<!-- cn PDF p.7 -->

Framework-Code:

<!-- cn PDF p.7 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
components/drivers/spi/qspi_core.c
```

<!-- cn PDF p.7 -->

Treiberanpassung:

<!-- cn PDF p.7 -->

```text
bsp/rockchip-common/drivers/drv_spi.c
bsp/rockchip-common/drivers/drv_spi.h
```

<!-- cn PDF p.7 -->

Testbefehle; Anwendungen können sich an diesem Treiber orientieren:

<!-- cn PDF p.7 -->

```text
bsp/rockchip-common/tests/spi_test.c
```

<!-- cn PDF p.7 -->

### 2.2 Konfiguration

<!-- cn PDF p.7 -->

#### 2.2.1 Controller-Konfiguration

<!-- cn PDF p.7 -->

Konfiguration aktivieren; Geräte /dev/spi0..2 werden erzeugt.

<!-- cn PDF p.7 -->

```text
RT-Thread bsp drivers  --->
    RT-Thread rockchip "project" drivers  --->
        [*] Enable SPI
        [ ]   Enable SPI0 (SPI2APB)
        [*]   Enable SPI1
        [*]   Enable SPI2
        [*] Support stop SPI slave transmission when cs inactive
              Enable SPI Slave flexible length  --->
```

<!-- cn PDF p.7 -->

RT_USING_SPI_SLAVE_FLEXIBLE_LENGTH aktiviert flexible Länge; siehe den entsprechenden Abschnitt. RT_USING_SLAVE_DMA_RX_BURST_SIZE setzt deren DMA-Burstgröße, dort ebenfalls erklärt. Flexible Länge verwendet standardmäßig DMA; Puffer und Längen der oberen Schicht müssen daher an der Cache-Zeilengröße ausgerichtet sein. SPI0 (SPI2APB) bezeichnet SPI2APB, nicht RK SPI; siehe Rockchip_Developer_Guide_RT-Thread_SPI2APB.

<!-- cn PDF p.8 -->

#### 2.2.2 Platinenkonfiguration

<!-- cn PDF p.8 -->

Sicherstellen, dass die SPI-iomux-Platinenkonfiguration vorhanden ist.

<!-- cn PDF p.8 -->

### 2.3 SPI-Nutzung konfigurieren

<!-- cn PDF p.8 -->

Parameter: Als MASTER unterstützt der Controller 0–50MHz (einige Plattformen höhere Frequenzen); für SLAVE nennt die Quelle 0–50MHz und empfiehlt die höchste Rate für Master unterschiedlicher Geschwindigkeiten. rt_spi_configure() setzt Frequenz, Modus und Übertragungsbreite. Standardparameter von RT-Thread:

<!-- cn PDF p.8 -->

```text
#define RT_SPI_CPHA     (1<<0)                             /* bit[0]:CPHA, clock phase */
#define RT_SPI_CPOL     (1<<1)                             /* bit[1]:CPOL, clock polarity */

#define RT_SPI_LSB      (0<<2)                             /* bit[2]: 0-LSB */
#define RT_SPI_MSB      (1<<2)                             /* bit[2]: 1-MSB */

#define RT_SPI_MASTER   (0<<3)                             /* SPI master device */
#define RT_SPI_SLAVE    (1<<3)                             /* SPI slave device */

#define RT_SPI_MODE_0       (0 | 0)                        /* CPOL = 0, CPHA = 0 */
#define RT_SPI_MODE_1       (0 | RT_SPI_CPHA)              /* CPOL = 0, CPHA = 1 */
#define RT_SPI_MODE_2       (RT_SPI_CPOL | 0)              /* CPOL = 1, CPHA = 0 */
#define RT_SPI_MODE_3       (RT_SPI_CPOL | RT_SPI_CPHA)    /* CPOL = 1, CPHA = 1 */
```

<!-- cn PDF p.8 -->

Parameter der RK-Erweiterung für RT-Thread:

<!-- cn PDF p.8 -->

```text
#define RK_SPI_RESERVED_RSD_0     (0)
#define RK_SPI_RESERVED_RSD_1     (1)
#define RK_SPI_RESERVED_RSD_2     (2)
#define RK_SPI_RESERVED_RSD_3     (3)
#define RK_SPI_RESERVED_RSD_MASK  (3)
```

<!-- cn PDF p.8 -->

RSD siehe Abtastverzögerung. drv_spi.h einbinden. Konfigurationsbeispiel:

<!-- cn PDF p.8 -->

```text
#include <drivers/spi.h>
#include "drv_spi.h"
struct rt_spi_configuration cfg;
struct rt_spi_device *spi_device = RT_NULL;

spi_device = (struct rt_spi_device *)rt_device_find("spi2_0");
if (spi_device ==  RT_NULL)
{
    rt_kprintf("Did not find device\n");
    return;
}

cfg.data_width = 8; /* 配置8bits传输模式 */
cfg.mode = RT_SPI_MASTER | RT_SPI_MSB | RT_SPI_MODE_0;
cfg.max_hz = 20 * 1000 * 1000; /* 配置频率 20Mhz */
spi_device->config.reserved = RT_SPI_RESERVED_RSD_1; /* 配置 rx sample delay 1 级 */
rt_spi_configure(spi_device, &cfg); /* 配置 SPI*/
```

<!-- cn PDF p.9 -->

## 3. SPI-Tests

<!-- cn PDF p.9 -->

### 3.1 Konfiguration

<!-- cn PDF p.9 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI TEST
```

<!-- cn PDF p.9 -->

### 3.2 Testbefehle

<!-- cn PDF p.9 -->

```text
msh >spi_test
1. spi_test config <spi_device> <is_slave> <spi_mode> <is_msb> <speed>
<data_width>
2. spi_test read   <spi_device> <loops> <size>
3. spi_test write  <spi_device> <loops> <size>
4. spi_test duplex <spi_device> <loops> <size>
5. spi_test cs     <spi_device> <cs_state:1-take, 0-release>
6. spi_test bus    <spi_device> <bus_state:1-take, 0-release>
7. spi_test rate   <spi_device>
8. spi_test loop_thread   <spi_device> <loops> <size> <gap_ms> <random_pattern>
like:
        spi_test config spi1_0 0 3 0 24000000
        spi_test read   spi1_0 1 256
        spi_test write  spi1_0 1 256
        spi_test duplex spi1_0 1 256
        spi_test cs     spi1_0 1
        spi_test bus    spi1_0 1
        spi_test rate   spi1_0
        spi_test loop_thread   spi1_0 1 256 10 1
```

<!-- cn PDF p.10 -->

random_pattern: 0 = aufsteigende Folge, 1 = Zufallsfolge. loops: Anzahl Wiederholungen derselben Operation.

<!-- cn PDF p.10 -->

### 3.3 Testbeispiele

<!-- cn PDF p.10 -->

#### 3.3.1 Loopback

<!-- cn PDF p.10 -->

MOSI mit MISO kurzschließen und Vollduplex verwenden: spi1_0, master_mode, spi_mode_3, lsb, 24MHz.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 24000000 8
spi_test duplex spi1_0 1 256
```

<!-- cn PDF p.10 -->

Bei Fehler erscheint test fail: MISO empfing keine gültigen MOSI-Daten, der Vergleich schlug fehl. Ohne Fehlerausgabe ist der Test erfolgreich. Er wird zur Prüfung des Controller-Master-Modus empfohlen.

<!-- cn PDF p.10 -->

#### 3.3.2 Geschwindigkeitsmessung

<!-- cn PDF p.10 -->

spi1_0, master_mode, spi_mode_3, lsb, 50MHz konfigurieren.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test rate   spi1_0
```

<!-- cn PDF p.10 -->

#### 3.3.3 Geräte verbinden

<!-- cn PDF p.10 -->

SPI-Slave-Daemon: spi2_0, slave_mode, spi_mode_3, lsb, 50MHz. 10 Durchläufe mit je 256B ohne Pause, aufsteigende Folge (auch auf der Gegenseite).

<!-- cn PDF p.10 -->

```text
spi_test config spi2_0 1 3 0 50000000 8
spi_test duplex_thread spi2_0 10 256 0 0
```

<!-- cn PDF p.10 -->

SPI-Master-Testprozess: spi1_0, master_mode, spi_mode_3, lsb, 50MHz. 10 Durchläufe à 256B; 10 ms Abstand für slave ready; aufsteigende Folge auf beiden Seiten.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test duplex_thread spi1_0 10 256 10 0
```

<!-- cn PDF p.11 -->

#### 3.3.4 Signaltest

<!-- cn PDF p.11 -->

SPI-Signale verbinden, MOSI an MOSI, gemeinsame Masse. Befehle zuerst am Slave, dann Master ausführen. Slave-Daemon: spi2_0, slave_mode, spi_mode_3, lsb, 50MHz. 100000000 Durchläufe à 4096B ohne Abstand, Zufallsfolge ohne Prüfung.

<!-- cn PDF p.11 -->

```text
spi_test config spi2_0 1 3 0 50000000 8
spi_test duplex_thread spi2_0 100000000 4096 0 1
```

<!-- cn PDF p.11 -->

Master-Testprozess: spi1_0, master_mode, spi_mode_3, lsb, 50MHz. 100000000 Durchläufe à 4096B, 10 ms Abstand, Zufallsfolge ohne Prüfung.

<!-- cn PDF p.11 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test duplex_thread spi1_0 100000000 4096 10 1
```

<!-- cn PDF p.11 -->

Erfolgreiche Befehle prüfen. In MSH müssen zwei duplex-Prozesse vorhanden sein:

<!-- cn PDF p.11 -->

```text
msh >list_thread
thread   pri  status      sp     stack size max used left tick  error
-------- ---  ------- ---------- ----------  ------  ---------- ---
spi_dupl   5  suspend 0x000000c4 0x00000400    50%   0x00000009 OK
spi_dupl   5  suspend 0x00000120 0x00000400    38%   0x00000009 OK
```

<!-- cn PDF p.11 -->

Gleichzeitige MOSI-/MISO-Ausgabe prüfen.

<!-- cn PDF p.11 -->

## 4. Fehlerbehebung

<!-- cn PDF p.11 -->

### 4.1 SPI-Master-Übertragung schlägt fehl

<!-- cn PDF p.11 -->

Loopback im SPI-Testabschnitt verwenden. Bei Fehler ist meist iomux falsch konfiguriert.

<!-- cn PDF p.12 -->

### 4.2 SPI-Slave-Übertragung schlägt fehl

<!-- cn PDF p.12 -->

Nach dem SPI-Testabschnitt Modus 0 und 8-Bit-Übertragung von 256Bytes konfigurieren:

<!-- cn PDF p.12 -->

```text
# slave
spi_test config spi2_0 1 0 0 50000000 8
spi_test read spi2_0 1 256

# master（根据实际平台做验证）
spi_test config spi2_0 0 0 0 50000000 8
spi_test write spi2_0 1 256
```

<!-- cn PDF p.12 -->

Vor dem Master-Start blockiert ein normaler Slave-Aufruf wartend, ebenso die RT-Thread-Kommandozeile. Ohne Blockieren stimmt die Konfiguration nicht.

Bleibt der Slave nach der Master-Übertragung blockiert:
- Bei fester Länge prüfen, ob der Master genügend Daten entsprechend der Slave-Länge gesendet hat.
- Gemeinsame Masse prüfen.
- Gültige csn-/clock-Signale am Master mit Oszilloskop messen.
- Slave-Verdrahtung und unbestückte 0Ω-Brücken prüfen. Zum Messen von csn/clock kann er testweise als Master senden.
- Bei falschen Signalen ist meist iomux falsch; Konfiguration mit tatsächlichen IO abgleichen.
- Bei IO-Matrix prüfen, ob mehrere IO-Gruppen gleichzeitig SPI zugewiesen wurden, etwa RK2118 SPI1/2 RMIO.

Bei falschen Empfangsdaten:
- Master-IO-Rate reduzieren. Besserung deutet auf unzureichende Hochgeschwindigkeitssignalqualität.
- Muster suchen: LSB/MSB und Byte-Reihenfolge prüfen.
- Teilweise gültige Daten können einen zu kurzen Abstand bedeuten: Master startet vor abgeschlossener Slave-Neukonfiguration. Abstand erhöhen, siehe Übertragungsablauf.
- Bei verschobenen Master-Lesedaten prüfen, ob die Abtastverzögerung einstellbar ist.

<!-- cn PDF p.12 -->

### 4.3 SPI-Slave-Ready-Signal ergänzen

<!-- cn PDF p.12 -->

Ready-Steuerung nach folgendem Beispiel ergänzen:

<!-- cn PDF p.12 -->

```text
diff --git a/bsp/rockchip/common/drivers/drv_spi.c b/bsp/rockchip/common/drivers/drv_spi.c
index b73ada2fbf..c42b93890c 100644
--- a/bsp/rockchip/common/drivers/drv_spi.c
+++ b/bsp/rockchip/common/drivers/drv_spi.c
@@ -555,6 +555,10 @@ static rt_uint32_t rockchip_spi_xfer(struct rt_spi_device *device, struct rt_spi
     }
     else
     {
+        HAL_GPIO_SetPinLevel(GPIOn, pin, GPIO_LOW);
+        HAL_DelayUs(1);
+        HAL_GPIO_SetPinLevel(GPIOn, pin, GPIO_HIGH);
+
         /* Use IT mode for slave while less fifo length. */
         if (spi->dma && HAL_SPI_CanDma(pSPI))
         {
@@ -585,6 +589,8 @@ static rt_uint32_t rockchip_spi_xfer(struct rt_spi_device *device, struct rt_spi
                 rockchip_spi_wait_idle(spi, true);
             }
         }
+
+        HAL_GPIO_SetPinLevel(GPIOn, pin, GPIO_LOW);
     }

 complete:
```

<!-- cn PDF p.13 -->

### 4.4 SPI-Debug-Makros

<!-- cn PDF p.13 -->

SPI-Master-Debug-Makro:

<!-- cn PDF p.13 -->

```text
diff --git a/bsp/rockchip/common/drivers/drv_spi.c b/bsp/rockchip/common/drivers/drv_spi.c
index 3562abffda..76e7268baf 100644
--- a/bsp/rockchip/common/drivers/drv_spi.c
+++ b/bsp/rockchip/common/drivers/drv_spi.c
@@ -39,7 +39,7 @@
 #include "dma.h"
 #include "hal_bsp.h"

-#define SPI_DEBUG 0
+#define SPI_DEBUG 1

 #if SPI_DEBUG
 #define spi_dbg(dev, fmt, ...) \
```

<!-- cn PDF p.13 -->

SPI-Master-Debug-Makro (wiederholte Quellenbeschriftung):

<!-- cn PDF p.14 -->

```text
diff --git a/bsp/rockchip/common/drivers/drv_spi.c b/bsp/rockchip/common/drivers/drv_spi.c
index 3562abffda..76e7268baf 100644
--- a/bsp/rockchip/common/drivers/drv_spi.c
+++ b/bsp/rockchip/common/drivers/drv_spi.c
@@ -39,7 +39,7 @@
 #include "dma.h"
 #include "hal_bsp.h"

-#define SPI_DEBUG 0
+#define SPI_DEBUG 2

 #if SPI_DEBUG
 #define spi_dbg(dev, fmt, ...) \
```

<!-- cn PDF p.14 -->

### 4.5 SPI-Übertragungsmodi

<!-- cn PDF p.14 -->

Master verwendet bei folgenden Bedingungen DMA, andernfalls CPU:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) pSPI->len > HAL_SPI_DMA_SIZE_MIN # HAL_SPI_DMA_SIZE_MIN 默认值为 512
```

<!-- cn PDF p.14 -->

Slave mit fester Länge (Standard) nutzt unter folgenden Bedingungen DMA, sonst IRQ. DMA wird empfohlen; für bessere DMA-Bursts die Länge an 8Bytes ausrichten:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) pSPI->len > HAL_SPI_FIFO_LENGTH / 2 # HAL_SPI_FIFO_LENGTH 参考 “SPI 控制器特性”
```

<!-- cn PDF p.14 -->

Flexible Länge (per Makro aktiviert) unterstützt nur DMA und verlangt daher:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) # HAL_SPI_DMA_SIZE_MIN 默认值为 512
```

<!-- cn PDF p.14 -->

### 4.6 Abtastverzögerung konfigurieren

<!-- cn PDF p.14 -->

Bei hohen SPI-IO-Raten passt der normale SPI-Modus eventuell nicht zur Ausgangsverzögerung des Peripheriegeräts, sodass Master-Lesen ungültig ist. SPI rsd verzögert den Abtasttakt. RSD (read sample delay) besitzt folgende Eigenschaften:

<!-- cn PDF p.15 -->

Werte: 0, 1, 2, 3. Verzögerungseinheit: eine spi_clk-Periode, also der Controller-Arbeitstakt. Chipspezifische Werte siehe Controller-Eigenschaften.

{% endraw %}
