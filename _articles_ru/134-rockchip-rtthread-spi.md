---
title: "Rockchip RT-Thread SPI: руководство разработчика"
description: "Rockchip RT-Thread SPI: руководство разработчика — V2.2.0"
excerpt: "Rockchip RT-Thread SPI: руководство разработчика — V2.2.0"
translation_key: "134-rockchip-rtthread-spi"
slug: "134-rockchip-rtthread-spi"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Справочник платформы Rockchip для RK RT-Thread SDK, RK2108/RK2118 (SPI2APB преимущественно RK2118). Поддержка конкретных плат ArmSoM не подтверждена, аппаратная проверка не проводилась. До адаптации проверьте SoC, SDK/BSP, версию RT-Thread, контроллер, IOMUX, проводку и напряжения. Команды и результаты — примеры оригинала, не измерения ArmSoM; аппаратные операции и доступ к flash не выполнялись. Есть только китайский оригинал; все четыре языка используют его рисунки.

RK-KF-YF-093 · V2.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. Возможности Rockchip SPI

<!-- cn PDF p.4 -->

### 1.1 Возможности контроллера SPI

<!-- cn PDF p.4 -->

SPI (Serial Peripheral Interface).
- Master поддерживает режимы SPI 0/1/2/3; slave также 0/1/2/3. Для максимальной скорости slave рекомендуется mode 0.
- Обычно два сигнала выбора; передача 8 и 16 бит.
- Передача через прерывания и DMA; FIFO глубиной 32 или 64.
- Настраиваемая задержка тактирования выборки RSD в master.
- Режим slave; некоторые чипы поддерживают выборку по внешнему тактовому сигналу.
- Настройка LSB/MSB и порядка байтов.
- Некоторые чипы обнаруживают cs inactive и генерируют прерывание при отпускании CS.
- Четырёхпроводная передача MOSI/MOSI (формулировка источника): master выводит MOSI и принимает MISO; slave выводит MISO и принимает MOSI.

<!-- cn PDF p.4 -->

### 1.2 Характеристики интерфейса SPI

<!-- cn PDF p.4 -->

| SoC | Master max | Slave max | TX/RX FIFO | Rx Sample Delay unit |
| --- | --- | --- | --- | --- |
| RK2108 | 50MHz | 16MHz | 64 | \ |
| RK2118 | 50MHz | 50MHz (SPI mode 0) | 64 | 5ns |

<!-- cn PDF p.4 -->

Максимальная скорость теоретическая: результат зависит от разводки и качества PCB и определяется измерением. На некоторых платформах стратегия PLL не позволяет точно получить предел делением; используйте максимально достижимую частоту. Rx Sample Delay описан в разделе настройки задержки выборки.

<!-- cn PDF p.4 -->

### 1.3 Особенности SPI slave

<!-- cn PDF p.4 -->

#### 1.3.1 SPI2APB

<!-- cn PDF p.4 -->

Документ посвящён RK SPI, а не отдельному IP RK SPI2APB. RK SPI поддерживает master/slave без обязательного формата данных slave. RK SPI2APB поддерживает только slave с фиксированным форматом передачи.

<!-- cn PDF p.5 -->

Для SPI2APB, например RK2118 SPI0 (SPI2APB), см. раздел SPI2APB TRM и Rockchip_Developer_Guide_RT-Thread_SPI2APB.

<!-- cn PDF p.5 -->

#### 1.3.2 Последовательность передачи

<!-- cn PDF p.5 -->

Основная последовательность передачи RK SPI slave:

<!-- cn PDF p.5 -->

![Рисунок китайского оригинала (p.5)](/docs/rockchip-rtthread-spi/assets/cn-p005-figure-01.png)

*Рисунок китайского оригинала (p.5)*

<!-- cn PDF p.5 -->

Сторона slave:
1. Пользовательский уровень вызывает интерфейс передачи, задавая длину. Поддерживаются симплексное чтение/запись и полный дуплекс.
2. Ожидание передачи должно согласовываться с master. После настройки регистров контроллер ждёт удалённый master. Для каждой передачи slave необходимо заново вызвать интерфейс. Учитывайте максимальный интервал Tgap(max) в RT-Thread; master должен выдерживать не меньшую задержку. Нагрузка приложения различается, поэтому теоретическое рекомендуемое значение не задано: его измеряют. Необязательный ready обеспечивает оперативное уведомление; см. добавление сигнала ready.
3. Приём: если длина больше половины TX/RX FIFO, ПО автоматически применяет DMA против нестабильности передачи; при длине не больше половины FIFO используется IRQ.
4. Возврат: фиксированная длина (по умолчанию) игнорирует отпускание CS и возвращается лишь после получения заданного объёма, иначе блокируется. Переменная длина обнаруживает отпускание CS и возвращается при раннем отпускании CS либо получении заданного объёма, иначе блокируется. Настройка описана ниже.

Сторона master:
1. Пользовательский уровень вызывает интерфейс передачи.
2. Необязательно ожидается ready. Соблюдается Tgap(max) slave: две передачи не должны начинаться в пределах Tgap. Если slave поддерживает ready, задаётся прерывание по фронту, ready отмечается действительным и сбрасывается после передачи.
3. Контроллер начинает передачу.

<!-- cn PDF p.6 -->

#### 1.3.3 Временная диаграмма

<!-- cn PDF p.6 -->

![Рисунок китайского оригинала (p.6)](/docs/rockchip-rtthread-spi/assets/cn-p006-figure-01.png)

*Рисунок китайского оригинала (p.6)*

<!-- cn PDF p.6 -->

Шаг 1: вызов интерфейса пользователем. Шаг 2: ready (необязательно). Шаг 3: ожидание передачи. Шаг 4: передача данных. Шаг 5: возврат интерфейса.

<!-- cn PDF p.6 -->

#### 1.3.4 Передача переменной длины

<!-- cn PDF p.6 -->

По умолчанию RK SDK использует фиксированную длину SPI slave: интерфейс возвращается только после получения заданного объёма, иначе ждёт неограниченно. В режиме переменной длины он возвращает фактический объём при получении всей длины либо отпускании CS до завершения. Для этого включается аппаратное обнаружение cs inactive в slave. Поддержка указана ниже.

<!-- cn PDF p.6 -->

| SoC | cs inactive | Flexible Length |
| --- | --- | --- |
| RK2108 | Есть | Не адаптировано |
| RK2118 | Есть | BURST_SIZE=1: 25MHz; BURST_SIZE=2: 50MHz (max) |

<!-- cn PDF p.6 -->

См. настройку контроллера. Кроме включения функции задайте burst size:
- Меньший burst size снижает эффективность SPI/шины и может приводить к потере пакетов slave, но меньше ограничивает длину master. RK2118 при burst size 1 поддерживает master sclk до 25MHz; выше возможна потеря, зато длина master не ограничена.
- Больший burst size повышает эффективность и допустимую скорость IO, но сильнее ограничивает длину master. RK2118 с burst size 2 поддерживает master sclk 50MHz и требует выравнивания по 2 байтам.

<!-- cn PDF p.7 -->

## 2. Программное обеспечение

<!-- cn PDF p.7 -->

### 2.1 Пути исходников

<!-- cn PDF p.7 -->

Код платформы:

<!-- cn PDF p.7 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
components/drivers/spi/qspi_core.c
```

<!-- cn PDF p.7 -->

Слой адаптации драйвера:

<!-- cn PDF p.7 -->

```text
bsp/rockchip-common/drivers/drv_spi.c
bsp/rockchip-common/drivers/drv_spi.h
```

<!-- cn PDF p.7 -->

Команды тестирования; приложения могут использовать этот драйвер как пример:

<!-- cn PDF p.7 -->

```text
bsp/rockchip-common/tests/spi_test.c
```

<!-- cn PDF p.7 -->

### 2.2 Настройка

<!-- cn PDF p.7 -->

#### 2.2.1 Настройка контроллера

<!-- cn PDF p.7 -->

Включите настройку; создаются устройства /dev/spi0..2.

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

RT_USING_SPI_SLAVE_FLEXIBLE_LENGTH включает переменную длину; см. соответствующий раздел. RT_USING_SLAVE_DMA_RX_BURST_SIZE задаёт размер DMA burst, объяснённый там же. Переменная длина по умолчанию использует DMA, поэтому буферы и длины верхнего уровня должны быть выровнены по cache line size. SPI0 (SPI2APB) обозначает SPI2APB, не RK SPI; см. Rockchip_Developer_Guide_RT-Thread_SPI2APB.

<!-- cn PDF p.8 -->

#### 2.2.2 Настройка платы

<!-- cn PDF p.8 -->

Убедитесь, что добавлена настройка SPI iomux платы.

<!-- cn PDF p.8 -->

### 2.3 Настройки использования SPI

<!-- cn PDF p.8 -->

Параметры: MASTER поддерживает 0–50MHz (на некоторых платформах выше); для SLAVE источник указывает 0–50MHz и требует максимальную скорость для совместимости с master разных скоростей. rt_spi_configure() задаёт частоту, режим и разрядность передачи. Стандартные параметры RT-Thread:

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

Параметры расширения RK для RT-Thread:

<!-- cn PDF p.8 -->

```text
#define RK_SPI_RESERVED_RSD_0     (0)
#define RK_SPI_RESERVED_RSD_1     (1)
#define RK_SPI_RESERVED_RSD_2     (2)
#define RK_SPI_RESERVED_RSD_3     (3)
#define RK_SPI_RESERVED_RSD_MASK  (3)
```

<!-- cn PDF p.8 -->

RSD описан в настройке задержки выборки. Требуется drv_spi.h. Пример настройки:

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

## 3. Тестирование SPI

<!-- cn PDF p.9 -->

### 3.1 Настройка

<!-- cn PDF p.9 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI TEST
```

<!-- cn PDF p.9 -->

### 3.2 Команды тестирования

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

random_pattern: 0 = возрастающая последовательность, 1 = случайная. loops: число повторений операции.

<!-- cn PDF p.10 -->

### 3.3 Примеры тестов

<!-- cn PDF p.10 -->

#### 3.3.1 Петлевой тест

<!-- cn PDF p.10 -->

Соедините MOSI с MISO для полного дуплекса: spi1_0, master_mode, spi_mode_3, lsb, 24MHz.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 24000000 8
spi_test duplex spi1_0 1 256
```

<!-- cn PDF p.10 -->

При неудаче выводится test fail: MISO не получил корректные данные MOSI, сравнение не прошло. Отсутствие ошибок означает успех. Тест рекомендуется для проверки master-контроллера.

<!-- cn PDF p.10 -->

#### 3.3.2 Измерение скорости

<!-- cn PDF p.10 -->

Настройте spi1_0, master_mode, spi_mode_3, lsb, 50MHz.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test rate   spi1_0
```

<!-- cn PDF p.10 -->

#### 3.3.3 Соединение устройств

<!-- cn PDF p.10 -->

Демон SPI slave: spi2_0, slave_mode, spi_mode_3, lsb, 50MHz. 10 циклов по 256B без задержки между передачами, возрастающая последовательность (на другой стороне такая же).

<!-- cn PDF p.10 -->

```text
spi_test config spi2_0 1 3 0 50000000 8
spi_test duplex_thread spi2_0 10 256 0 0
```

<!-- cn PDF p.10 -->

Процесс теста SPI master: spi1_0, master_mode, spi_mode_3, lsb, 50MHz. 10 циклов по 256B; между передачами 10 ms для slave ready; возрастающая последовательность с обеих сторон.

<!-- cn PDF p.10 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test duplex_thread spi1_0 10 256 10 0
```

<!-- cn PDF p.11 -->

#### 3.3.4 Проверка сигналов

<!-- cn PDF p.11 -->

Соедините сигналы SPI, MOSI с MOSI, и общую землю. Команды запускайте сначала на slave, затем master. Демон slave: spi2_0, slave_mode, spi_mode_3, lsb, 50MHz. 100000000 циклов по 4096B без задержки, случайная последовательность без проверки.

<!-- cn PDF p.11 -->

```text
spi_test config spi2_0 1 3 0 50000000 8
spi_test duplex_thread spi2_0 100000000 4096 0 1
```

<!-- cn PDF p.11 -->

Процесс master: spi1_0, master_mode, spi_mode_3, lsb, 50MHz. 100000000 циклов по 4096B, интервал 10 ms, случайная последовательность без проверки.

<!-- cn PDF p.11 -->

```text
spi_test config spi1_0 0 3 0 50000000 8
spi_test duplex_thread spi1_0 100000000 4096 10 1
```

<!-- cn PDF p.11 -->

Проверьте успешное выполнение команд. В MSH должны быть два процесса duplex:

<!-- cn PDF p.11 -->

```text
msh >list_thread
thread   pri  status      sp     stack size max used left tick  error
-------- ---  ------- ---------- ----------  ------  ---------- ---
spi_dupl   5  suspend 0x000000c4 0x00000400    50%   0x00000009 OK
spi_dupl   5  suspend 0x00000120 0x00000400    38%   0x00000009 OK
```

<!-- cn PDF p.11 -->

Проверьте одновременный вывод MOSI/MISO.

<!-- cn PDF p.11 -->

## 4. Устранение неисправностей

<!-- cn PDF p.11 -->

### 4.1 Ошибка передачи SPI master

<!-- cn PDF p.11 -->

Используйте петлевой тест раздела тестирования SPI. При неудаче обычно неверно настроен iomux.

<!-- cn PDF p.12 -->

### 4.2 Ошибка передачи SPI slave

<!-- cn PDF p.12 -->

По разделу тестирования SPI настройте mode 0, 8-битную передачу 256Bytes:

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

До начала передачи master обычный вызов slave блокируется в ожидании, блокируя и командную строку RT-Thread. Если блокировки нет, настройка неверна.

Если после передачи master slave остаётся заблокирован:
- При фиксированной длине проверьте, что master передал достаточно данных согласно длине slave.
- Проверьте общую землю.
- Осциллографом проверьте csn/clock master.
- Проверьте проводку slave и неустановленные перемычки 0Ω. Для проверки csn/clock можно запустить его передачу как master.
- Если сигналы неверны, обычно ошибочен iomux; сопоставьте настройку с физическими IO.
- При матрице IO проверьте, не назначены ли одновременно несколько групп на SPI, например RK2118 SPI1/2 RMIO.

Если данные master/slave неверны:
- Уменьшите скорость IO master. Улучшение означает недостаточное качество высокоскоростного сигнала.
- Ищите закономерность: проверьте LSB/MSB и порядок байтов.
- Частично корректные данные могут означать слишком короткий интервал: master начинает снова до завершения перенастройки slave. Увеличьте интервал; см. последовательность передачи.
- При сдвиге данных чтения master проверьте регулировку задержки выборки.

<!-- cn PDF p.12 -->

### 4.3 Добавление ready для SPI slave

<!-- cn PDF p.12 -->

Добавьте управление ready по примеру:

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

### 4.4 Макросы отладки SPI

<!-- cn PDF p.13 -->

Макрос отладки SPI master:

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

Макрос отладки SPI master (повтор заголовка источника):

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

### 4.5 Режимы передачи SPI

<!-- cn PDF p.14 -->

Master использует DMA при следующих условиях, иначе CPU:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) pSPI->len > HAL_SPI_DMA_SIZE_MIN # HAL_SPI_DMA_SIZE_MIN 默认值为 512
```

<!-- cn PDF p.14 -->

Slave фиксированной длины (по умолчанию) использует DMA при следующих условиях, иначе IRQ. Для slave рекомендуется DMA; для лучшего DMA burst size выравнивайте длину по 8Bytes:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) pSPI->len > HAL_SPI_FIFO_LENGTH / 2 # HAL_SPI_FIFO_LENGTH 参考 “SPI 控制器特性”
```

<!-- cn PDF p.14 -->

Переменная длина (включается макросом) поддерживает только DMA и требует:

<!-- cn PDF p.14 -->

```text
spi->dma # 支持 DMA HAL_IS_CACHELINE_ALIGNED(pSPI->pRxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->pTxBuffer) HAL_IS_CACHELINE_ALIGNED(pSPI->len) # HAL_SPI_DMA_SIZE_MIN 默认值为 512
```

<!-- cn PDF p.14 -->

### 4.6 Настройка задержки выборки чтения

<!-- cn PDF p.14 -->

При высокой скорости IO SPI обычный режим может не соответствовать задержке выхода периферии, мешая чтению RK SPI master. Включите SPI rsd для задержки такта выборки. RSD (read sample delay) имеет свойства:

<!-- cn PDF p.15 -->

Значения: 0, 1, 2, 3. Единица задержки: один период spi_clk, то есть рабочего такта контроллера. Значения для чипов см. в характеристиках контроллера.

{% endraw %}
