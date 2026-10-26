---
title: "Rockchip RT-Thread SPI2APB: руководство разработчика"
description: "Rockchip RT-Thread SPI2APB: руководство разработчика — V1.2.0"
excerpt: "Rockchip RT-Thread SPI2APB: руководство разработчика — V1.2.0"
translation_key: "135-rockchip-rtthread-spi2apb"
slug: "135-rockchip-rtthread-spi2apb"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Справочник платформы Rockchip для RK RT-Thread SDK, RK2108/RK2118 (SPI2APB преимущественно RK2118). Поддержка конкретных плат ArmSoM не подтверждена, аппаратная проверка не проводилась. До адаптации проверьте SoC, SDK/BSP, версию RT-Thread, контроллер, IOMUX, проводку и напряжения. Команды и результаты — примеры оригинала, не измерения ArmSoM; аппаратные операции и доступ к flash не выполнялись. Есть только китайский оригинал; все четыре языка используют его рисунки.

RK-KF-YF-498 · V1.2.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.4 -->

## 1. Введение

<!-- cn PDF p.4 -->

### 1.1 Важные сведения

<!-- cn PDF p.4 -->

SPI2APB добавляет собственный протокол RK поверх стандартного SPI, в отличие от более универсального RK SPI без дополнительного протокола. Учитывайте различие при проверке схем.

<!-- cn PDF p.4 -->

### 1.2 Возможности контроллера

<!-- cn PDF p.4 -->

Поддерживаются SPI mode 0/2 (рекомендуется 0), 8-битная передача, прерывания и чтение/запись внутренних регистров. Настраиваются LSB/MSB и Little Endian/Big Endian. Только симплекс и slave. Master должен передавать данные по SPI2APB. Общий формат: `<CMD-32bits> [ADDR-32bits] [DUMMY-32bits] [READ_BEGING-32bits] [DATA]`. Варианты приведены ниже.

<!-- cn PDF p.4 -->

| Операция | Protocol | CMD-32bits Little Endian |
| --- | --- | --- |
| Чтение данных | read data | &lt;0x00000077&gt; &lt;ADDR&gt; &lt;DUMMY&gt; &lt;READ_BEGING&gt; &lt;DATA&gt; |
| Запись данных | write data | &lt;0x00000011&gt; &lt;ADDR&gt; &lt;DATA&gt; |
| Запись REG0 | write msg reg0 | &lt;0x00010011&gt; &lt;DATA-32bits&gt; |
| Запись REG1, прерывание | write msg reg1 | &lt;0x00020011&gt; &lt;DATA-32bits&gt; |
| Статус предыдущей передачи | query state | &lt;0x000000ff&gt; &lt;DATA-32bits&gt; |
| Чтение REG2 | query msg reg2 | &lt;0x000001ff&gt; &lt;DATA-32bits&gt; |

<!-- cn PDF p.4 -->

[ADDR-32bits] — поддерживаемый адрес памяти, обычно SRAM/DRAM. [DUMMY-32bits] произвольный, можно 0. [READ_BEGING-32bits] равен 0x000000AA. Значения query state см. в “State Register Information” главы SPI2APB TRM.

<!-- cn PDF p.5 -->

### 1.3 Характеристики интерфейса

<!-- cn PDF p.5 -->

| SoC | Max rate |
| --- | --- |
| RK2118 | 50MHz |

<!-- cn PDF p.5 -->

Максимальная скорость теоретическая; результат зависит от разводки и PCB и определяется измерением.

<!-- cn PDF p.5 -->

## 2. Программное обеспечение

<!-- cn PDF p.5 -->

### 2.1 Пути исходников

<!-- cn PDF p.5 -->

Код платформы:

<!-- cn PDF p.5 -->

```text
components/drivers/include/drivers/spi.h
components/drivers/spi/spi_core.c
components/drivers/spi/spi_dev.c
```

<!-- cn PDF p.5 -->

Слой адаптации драйвера:

<!-- cn PDF p.5 -->

```text
bsp/rockchip/common/drivers/drv_spi2apb.c
bsp/rockchip/common/hal/lib/hal/src/hal_spi2apb.c
```

<!-- cn PDF p.5 -->

Команды тестирования; приложения могут использовать этот драйвер как образец:

<!-- cn PDF p.5 -->

```text
bsp/rockchip-common/tests/spi2apb_test.c
```

<!-- cn PDF p.5 -->

### 2.2 Настройка

<!-- cn PDF p.5 -->

Включите опцию с SPI2APB в названии.

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

Настройте iomux платы.

<!-- cn PDF p.6 -->

### 2.3 Настройки использования

<!-- cn PDF p.6 -->

По умолчанию LSB, Little Endian. Пример изменения drv_spi2apb.c:

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

Рекомендуется менять только LSB/MSB, остальные значения оставить по умолчанию.

<!-- cn PDF p.6 -->

## 3. Тестирование

<!-- cn PDF p.6 -->

### 3.1 Настройка

<!-- cn PDF p.6 -->

```text
RT-Thread bsp test case  --->
    [*] RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]  Enable BSP Common SPI2APB TEST
```

<!-- cn PDF p.6 -->

### 3.2 Тестовые команды

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

Master = SPI master; slave = RK SPI2APB slave. mode: bit0 0-LSB/1-MSB; bit1 0-LittleEndian/1-BigEndian. polarity настраивается только для отладки; при работе оставьте TX invert/RX normal, то есть polarity =

<!-- cn PDF p.7 -->

2. bit0: 0-RX normal, 1-RX invert; bit1: 0-TX normal, 1-TX invert.

<!-- cn PDF p.7 -->

## 4. Построение приложения

<!-- cn PDF p.7 -->

Обе стороны реализуют поток данных и управление согласно SPI2APB. Код приложения и драйверы master можно развивать на основе примера RK. Место исходников по оригиналу: материалы разработки SPI — проект FAE — Rockchip Redmine (rock-chips.com).

<!-- cn PDF p.7 -->

### 4.1 Основная архитектура

<!-- cn PDF p.7 -->

![Рисунок китайского оригинала (p.7)](/docs/rockchip-rtthread-spi2apb/assets/cn-p007-figure-01.png)

*Рисунок китайского оригинала (p.7)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
spidev_rkspi2apb_app -> spidev_rkspi2apb.c -> SPI driver -> spi master
spi2apb_test.c <-> SPI2APB RTOS driver -> SPI2APB IP -> spi2apb slave
SPI2APB IP -> SRAM
```

<!-- cn PDF p.7 -->

Пример: RV1106 SPI master подключён к RK2118 SPI2APB. Компоненты исходников:

<!-- cn PDF p.8 -->

| Уровень | Master (Linux 5.10) | Slave (HAL + RTOS) |
| --- | --- | --- |
| Приложение | spidev_rkspi2apb_app: ioctl/read/write | test_spi2apb.c: REG |
| Драйвер ядра | spidev_rkspi2apb.c: SPI2APB ioctl/read/write |  |
| Драйвер контроллера | spi-rockchip.c | drv_spi2apb.c<br>hal_spi2apb.c |
| Контроллер | spi master | spi2apb slave |

<!-- cn PDF p.8 -->

Интерфейс ioctl spidev_rkspi2apb.c:

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

Чтение/запись spidev_rkspi2apbc.c (написание источника):

<!-- cn PDF p.8 -->

```text
write(spidev_fd, buffer_w, size); /* 参考 'write data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
read(spidev_fd, buffer_r, size); /* 参考 'read data' 协议，addr 由 ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR 设定 */
```

<!-- cn PDF p.8 -->

Согласование адреса: рекомендуется заранее резервировать известный SRAM-адрес slave и задавать его master через ioctl SPIDEV_RKSPI2APB_SET_DST_ADDR. RT-Thread обычно резервирует память через __spi2apb_buffer_start__ в linker script. Альтернатива: выделить SRAM на slave и разработать обмен, сообщающий адрес master, как на диаграмме.

<!-- cn PDF p.9 -->

![Рисунок китайского оригинала (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-01.png)

*Рисунок китайского оригинала (p.9)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_INT_REQ -> SPI master
SPI master -> write reg1 -> SPI2APB slave -> interrupt call back -> SPI2APB APP
SPI2APB APP -> write address info to reg2 -> SPI2APB slave
SPI Master APP -> ioctl SPIDEV_RKSPI2APB_GET_DEV_STATE -> read reg2
```

<!-- cn PDF p.9 -->

### 4.2 Сервис Flash Object

<!-- cn PDF p.9 -->

Flash Object передаёт запросы через spi/spi2apb, позволяя SPI master читать/писать SPI NOR на SPI2APB slave.

<!-- cn PDF p.9 -->

#### 4.2.1 Основной принцип

<!-- cn PDF p.9 -->

![Рисунок китайского оригинала (p.9)](/docs/rockchip-rtthread-spi2apb/assets/cn-p009-figure-02.png)

*Рисунок китайского оригинала (p.9)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

```text
spi2apb_flash_obj_mst.c -> drv_spi.c -> spi master
spi2apb_test.c -> SRAM_SPI2APB_BASE
spi2apb slave <-> SRAM_SPI2APB_BASE <-> spinor
```

<!-- cn PDF p.9 -->

Последовательность чтения NOR flash:

<!-- cn PDF p.10 -->

![Рисунок китайского оригинала (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-01.png)

*Рисунок китайского оригинала (p.10)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

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

Последовательность записи NOR flash:

<!-- cn PDF p.10 -->

![Рисунок китайского оригинала (p.10)](/docs/rockchip-rtthread-spi2apb/assets/cn-p010-figure-02.png)

*Рисунок китайского оригинала (p.10)*

Текст API/последовательности рисунка (имена и нумерация оригинала; не исполняемый код)

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

#### 4.2.2 Интерфейсы

<!-- cn PDF p.10 -->

Интерфейс flash_obj master:

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

Обёртка SPI2APB для flash_obj master:

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

Интерфейс flash_obj slave:

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

После инициализации зарегистрируйте callback прерывания SPI2APB. Нижняя половина reg1 в workqueue разбирает транзакции, выполняет spinor read/write и задаёт биты состояния автомата.

<!-- cn PDF p.12 -->

#### 4.2.3 Настройка Flash obj

<!-- cn PDF p.12 -->

```text
CONFIG_RT_USING_COMMON_TEST_SPI2APB_FLASH_OBJ = y
```

<!-- cn PDF p.12 -->

#### 4.2.4 Команды тестирования Flash obj

<!-- cn PDF p.12 -->

Команды flash_obj slave:

<!-- cn PDF p.12 -->

```text
spi2apb_test flash_obj spi2apb
```

<!-- cn PDF p.12 -->

Команды flash_obj master:

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

spi2apb_progsram использует write data; затем write msg reg1 вызывает прерывание SPI2APB. spi2apb_readsram использует read data, предварительно ожидая в reg2 состояние SPI2APB_FLASH_OBJ_CMD_READ_SRAM_READY. spi2apb_writemsg соответствует write msg reg0/1; spi2apb_querymsg — read msg reg2. write_sector записывает NOR flash; read_sector читает; stress записывает и читает обратно для нагрузочного теста. Во всех трёх единица — сектор 4KB.

<!-- cn PDF p.12 -->

## 5. Устранение неисправностей

<!-- cn PDF p.12 -->

### 5.1 Ошибка передачи SPI2APB

<!-- cn PDF p.12 -->

По разделу тестирования настройте SPI mode 0, lsb, little-endian и зарегистрируйте callback:

<!-- cn PDF p.13 -->

```text
spi2apb_test config spi2apb 1 2
spi2apb_test cb spi2apb
```

<!-- cn PDF p.13 -->

Master должен соблюдать протокол. Сначала попробуйте write reg1 для прерывания SPI2APB. Проверьте общую землю, csn/clock master осциллографом, проводку slave и неустановленные резисторы 0Ω.
При неверных данных уменьшите скорость. Проверьте LSB/MSB и порядок байтов. Если корректна только часть данных и закономерность связана с cache line size, вероятно, slave пропустил операции когерентности: обычно invalidate после чтения и flush перед записью. Если буфер чтения предварительно очищался или записывался, также выполните flush перед передачей.


## Технические ссылки оригинала

- [PDF reference 1](https://redmine.rock-chips.com/documents/125)

{% endraw %}
