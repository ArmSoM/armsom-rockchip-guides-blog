---
title: "Rockchip RT-Thread SPI Flash: руководство разработчика"
description: "Rockchip RT-Thread SPI Flash: руководство разработчика — V1.4.0"
excerpt: "Rockchip RT-Thread SPI Flash: руководство разработчика — V1.4.0"
translation_key: "136-rockchip-rtthread-spiflash"
slug: "136-rockchip-rtthread-spiflash"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "SPI", "RT-Thread"]
---

{% raw %}

Справочник платформы Rockchip для RK RT-Thread SDK, чипов, перечисленных в оригинале, включая RK2108/RK2118. Поддержка конкретных плат ArmSoM не подтверждена, аппаратная проверка не проводилась. До адаптации проверьте SoC, SDK/BSP, версию RT-Thread, контроллер, IOMUX, проводку и напряжения. Команды и результаты — примеры оригинала, не измерения ArmSoM; аппаратные операции и доступ к flash не выполнялись. Есть только китайский оригинал; все четыре языка используют его рисунки.

RK-KF-YF-080 · V1.4.0

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

<!-- cn PDF p.5 -->

## 1. Введение

<!-- cn PDF p.5 -->

### 1.1 Поддерживаемые устройства

<!-- cn PDF p.5 -->

SPI NOR имеет малые корпуса, быстрое чтение по сравнению с другими малыми энергонезависимыми устройствами, мало выводов и простой протокол. Обычные чипы поддерживают 1/2/4 линии, устойчивы к инверсии битов, адресуют байты и читают без ожидания после команды/адреса, позволяя XIP (в источнике “Excute In Place”). RK RTOS предоставляет общие NOR-интерфейсы и автоматический XIP.
SPI NAND использует те же контроллеры и поддерживается SDK RT-Thread. Однако необходим FTL либо соответствующая файловая система, с заметным расходом RAM/кода и ограниченной стабильностью. Требования к питанию при отключении высоки; MCU без батареи особенно уязвимы. Поэтому источник не рекомендует NAND, кроме отдельных случаев расширения для прошивки только для чтения.

<!-- cn PDF p.5 -->

### 1.2 Контроллеры

<!-- cn PDF p.5 -->

RK SPI flash использует FSPI, SFC или SPI.
- FSPI (Flexible Serial Peripheral Interface): SPI NOR/NAND, SPI PSRAM/SRAM; Standard (1 линия), Dual, Quad, в некоторых версиях Octal; SDR, в некоторых версиях DTR; XIP; встроенный DMA.
- SFC (Serial Flash Controller): SPI NOR/NAND, SPI PSRAM/SRAM; Standard/Dual/Quad; SDR; встроенный DMA.
- Универсальный SPI: SPI NOR/NAND и SPI PSRAM; Standard с одной линией; SDR; внешний DMA.

<!-- cn PDF p.6 -->

### 1.3 XIP NOR flash

<!-- cn PDF p.6 -->

XIP (eXecute In Place) позволяет CPU выбирать инструкции из отображённой flash без копирования в RAM; адрес выполнения совпадает с адресом отображения. NOR XIP доступен только для чтения, поэтому там размещаются код и неизменяемые данные. FSPI позволяет также DSP и другим master обращаться к flash как к SRAM только для чтения; см. TRM FSPI.
API чтения NOR использует XIP (отображение, без лишней настройки регистров, предвыборка, высокая эффективность) либо CPU (настройка контроллера и перенос FIFO процессором). По умолчанию XIP. RT_SNOR_XIP_DATA_BEGIN задаёт начало: при 327680 диапазон [0:327680) читается CPU, [327680,конец] — XIP.

<!-- cn PDF p.6 -->

### 1.4 Архитектура драйвера SPI flash

<!-- cn PDF p.6 -->

Для FSPI/SFC/SPI выделен слой контроллера. Четыре слоя NOR: MTD; RTOS driver (регистрация устройства, контроллера/операций в HAL_SNOR, обёртка чтения/записи/стирания); протокол HAL_SNOR; контроллер. Оригинал называет три перечисленных типа «двумя».

<!-- cn PDF p.6 -->

![Рисунок китайского оригинала (p.6)](/docs/rockchip-rtthread-spiflash/assets/cn-p006-figure-01.png)

*Рисунок китайского оригинала (p.6)*

<!-- cn PDF p.7 -->

FSPI: drv_snor.c оборачивает HAL чтение/запись в SPI_Xfer, регистрирует FSPI host и SPI_Xfer в HAL_SNOR, оборачивает чтение/запись/стирание и регистрирует OS-устройство в MTD. hal_snor.c реализует протокол NOR, hal_fspi.c — контроллер.
SPI: drv_snor.c оборачивает чтение/запись OS-драйвера в SPI_Xfer, регистрирует host и SPI_Xfer в HAL_SNOR, оборачивает операции протокола и регистрирует MTD. hal_snor.c реализует протокол, hal_spi.c — нижний уровень контроллера, SpiDevice.c — регистрацию и обёртку RTOS SPI. Примечания:

<!-- cn PDF p.7 -->

1. Реализации соответствуют диаграмме.

<!-- cn PDF p.7 -->

2. RK SPI DMA находится в OS-драйвере. SPI обслуживает другие устройства и требует защиты границ аппаратных ресурсов. Поэтому flash использует OS SPI, не напрямую hal_spi.c.

<!-- cn PDF p.7 -->

### 1.5 Возможности FSPI чипов

<!-- cn PDF p.7 -->

Перечислены только SoC с открытой реализацией хранения.

<!-- cn PDF p.7 -->

| SOC | FSPI/SFC IO max rate | FSPI/SFC data io lines | Support XIP |
| --- | --- | --- | --- |
| RK2108/Pisces | 150MHz | x1\x2\x4 SDR | Y |
| RK2206 | 150MHz | x1\x2\x4 SDR | Y |
| RK2118 | SDR:133MHz<br>DTR:80MHz | x1\x2\x4 SDR<br>x4 DDR with/without DQS<br>x8 DDR with/without DQS | Y |

<!-- cn PDF p.7 -->

Поддержка AP: Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.md. x1 — Standard, x2 Dual, x4 Quad, x8 Octal. Quad по умолчанию SDR, Octal — DDR with DQS.

<!-- cn PDF p.8 -->

## 2. SPI NOR

<!-- cn PDF p.8 -->

### 2.1 Настройка

<!-- cn PDF p.8 -->

#### 2.1.1 Архитектура

<!-- cn PDF p.8 -->

| Type | Memory | Controller driver | Flash framework |
| --- | --- | --- | --- |
| SPI NOR | SPI NOR | hal: lib/hal/src/hal_fspi.c<br>RT-Thread: bsp/rockchip/commob/drv_snor.c | hal: lib/hal/src/hal_snor.c |

<!-- cn PDF p.8 -->

Корень HAL: bsp/rockchip/common/hal. Поддерживаемые NOR указаны в lib/hal/src/hal_snor.c, другие файлы — в том же каталоге. Сопоставьте ID или маркировку. ПО определяет чип по ID и выбирает максимальную ширину контроллера; уменьшение задаётся макросами драйвера.

<!-- cn PDF p.8 -->

#### 2.1.2 Настройка драйвера

<!-- cn PDF p.8 -->

Сначала определите аппаратный контроллер SPI flash и выберите соответствующую схему. Основной пункт menuconfig:

<!-- cn PDF p.8 -->

```text
RT-Thread rockchip common drivers  --->
    [*] Enable ROCKCHIP SPI NOR Flash
    (80000000) Reset the speed of SPI Nor flash in Hz
    [ ]   Set SPI Host DUAL IO Lines /* 如果 FSPI 主控仅预留 IO0~1,应使用 Dual mode */
            Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) --->
```

<!-- cn PDF p.8 -->

Определения настроек:

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

#### 2.1.3 Таблица разделов

<!-- cn PDF p.9 -->

См. настройку таблицы разделов в rockchip/Rockchip_Developer_Guide_RT-Thread_CN.md. NOR регистрирует как устройства RT-Thread только разделы с FLAG [8,9] property 1, 2 или 3. Например root обычно Flag=0x305 и становится блочным устройством root.

<!-- cn PDF p.9 -->

#### 2.1.4 Создание, разбор и регистрация разделов

<!-- cn PDF p.9 -->

Упакованная прошивка RK RT-Thread размещает RK_PARTITION в первых 2KB flash. Данные меняются в setting.ini. После инициализации NOR таблица разбирается и регистрируется snor_partition_init в drv_snor.c. Проверка регистрации:

<!-- cn PDF p.9 -->

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
root     Block Device         1            /* 分区名 root，分区类型 block 设备，Nor flash 支持 setting.ini 修改设定为 MTD 设备 */
snor     MTD Device           0            /* SPI Nor 根存储设备，分区读写最终接入到该 节点完成读写擦除 */
```

<!-- cn PDF p.9 -->

#### 2.1.5 elm-fat и монтирование

<!-- cn PDF p.9 -->

Поддержка elm-fat RT-Thread:

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

При CONFIG_RT_USING_DFS_MNTTABLE добавьте регистрацию в mnt.c, например root в /:

<!-- cn PDF p.10 -->

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

<!-- cn PDF p.10 -->

Для собственной последовательности монтирования:

<!-- cn PDF p.10 -->

```text
dfs_mount("root", "/", "elm", 0, 0)
```

<!-- cn PDF p.10 -->

Команда монтирования:

<!-- cn PDF p.10 -->

```text
mount root / elm
```

<!-- cn PDF p.10 -->

Образы elm-fat: см. ./bsp/rockchip/tools/mkroot.sh, основная команда mkfs.fat.

<!-- cn PDF p.10 -->

### 2.2 Особенности XIP

<!-- cn PDF p.10 -->

NOR поддерживает XIP; решение FSPI включает его автоматически. Далее особенности использования в изделии.

<!-- cn PDF p.10 -->

#### 2.2.1 Включение XIP

<!-- cn PDF p.10 -->

FSPI flash по разделу настройки драйвера включает XIP по умолчанию. Для отключения выключите “Enable FSPI XIP”.

<!-- cn PDF p.10 -->

#### 2.2.2 Переключение XIP при работе

<!-- cn PDF p.10 -->

Платформа автоматически переключает XIP; пользователю не нужно вызывать переключение. XIP off:

<!-- cn PDF p.11 -->

Стирание/запись NOR длительны и не поддерживаются во время XIP. При запросах, включая запись ФС, ПО приостанавливает XIP и переводит FSPI в normal mode. XIP тогда недоступен. Последовательность:

<!-- cn PDF p.11 -->

1. Уведомить все затронутые master о приостановке XIP.

<!-- cn PDF p.11 -->

2. Отключить глобальные прерывания, чтобы CPU не исполнял по прерыванию XIP-код из NOR.

<!-- cn PDF p.11 -->

3. Отключить XIP.

XIP on: после завершения стирания/записи и перехода FSPI в idle драйвер восстанавливает XIP. Без этих операций он включён. Возобновление:

<!-- cn PDF p.11 -->

1. Включить XIP.

<!-- cn PDF p.11 -->

2. Включить глобальные прерывания (оригинал буквально пишет «глобальный терминал»; опечатка отмечена в записи сверки).

<!-- cn PDF p.11 -->

3. Уведомить приостановленные устройства о возобновлении XIP. Точки входа:

<!-- cn PDF p.11 -->

```text
static rt_base_t snor_xip_suspend(void)
static void snor_xip_resume(rt_base_t level)
```

<!-- cn PDF p.11 -->

Итого: NOR через FSPI включает XIP по умолчанию. При idle устройства читают NOR через отображённую XIP-память. Стирание/запись отключают XIP. Требуется уведомлять устройства о прекращении/возобновлении доступа. Отключение XIP также запрещает глобальные прерывания.

<!-- cn PDF p.11 -->

### 2.3 Примеры API

<!-- cn PDF p.11 -->

#### 2.3.1 Байтное устройство SNOR MTD

<!-- cn PDF p.11 -->

См. _at_snor_test в snor_test.c:

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

snor — байтное устройство. rt_mtd_nor_erase_block: Bytes, выравнивание минимум 4096Bytes (сектор flash). rt_mtd_nor_write/read: Bytes, минимум 1 Byte. Таблица RK использует секторы 512B; учитывайте преобразование.

<!-- cn PDF p.12 -->

#### 2.3.2 Байтное MTD-устройство раздела

<!-- cn PDF p.12 -->

Драйвер NOR разбирает таблицу и регистрирует разделы. MTD partition из setting.ini становится байтным устройством с API SNOR MTD:

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

#### 2.3.3 Блочное устройство раздела

<!-- cn PDF p.12 -->

Block partition из setting.ini регистрируется блочным устройством. Используйте стандартные read/write RT-Thread; сектор 4KB.

<!-- cn PDF p.12 -->

### 2.4 Тестовый драйвер

<!-- cn PDF p.12 -->

При разработке SPI flash включите следующие простые тесты чтения/записи.

<!-- cn PDF p.12 -->

#### 2.4.1 Настройка драйвера

<!-- cn PDF p.12 -->

```text
RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]   Enable BSP Common SNOR TEST (NEW)
```

<!-- cn PDF p.12 -->

После настройки в msh появляется snor_test.

<!-- cn PDF p.12 -->

#### 2.4.2 Команды теста

<!-- cn PDF p.12 -->

Введите snor_test для справки. Единицы команд ниже — байты.

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

offset: смещение в байтах внутри flash, не XIP; только десятичное. stress: возрастающие данные. io_stress width: последовательность состояний IO; 4 для Quad, 8 для Octal. rw: 1 только запись со стиранием, 2 чтение, 3 чтение/запись.

<!-- cn PDF p.13 -->

#### 2.4.3 Примеры команд

<!-- cn PDF p.13 -->

##### 2.4.3.1 Скорость чтения

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

##### 2.4.3.2 Сигналы Quad Flash

<!-- cn PDF p.13 -->

Тест сигнала записи:

<!-- cn PDF p.13 -->

```text
snor_test io_stress 2097152 2097152 5000 4 1
```

<!-- cn PDF p.13 -->

Тест сигнала чтения:

<!-- cn PDF p.13 -->

```text
snor_test io_stress 2097152 2097152 5000 4 2
```

<!-- cn PDF p.14 -->

##### 2.4.3.3 Сигналы Octal Flash

<!-- cn PDF p.14 -->

Тест сигнала записи:

<!-- cn PDF p.14 -->

```text
snor_test io_stress 2097152 2097152 5000 8 1
```

<!-- cn PDF p.14 -->

Тест сигнала чтения:

<!-- cn PDF p.14 -->

```text
snor_test io_stress 2097152 2097152 5000 8 2
```

<!-- cn PDF p.14 -->

### 2.5 Устранение неисправностей

<!-- cn PDF p.14 -->

Проверка регистрации: list_device должен показывать snor.

“Init adapte error ret= -19” выводит результат snor_adapt: -1 означает NOR ID 0xff, возможна плохая пайка, проверьте схему/сигналы; -19 — чип не поддерживается, обратитесь к RK для добавления; -22 — контроллер SPI не найден.

Потребляет ли постоянно включённый XIP лишнюю мощность? FSPI по таймауту idle отпускает CS, NOR переходит в малопотребляющий idle; большой разницы нет.

Несколько master XIP: шина арбитрирует и выполняет запросы последовательно, ожидающие остаются на шине.

Частая запись ФС: разместите код в SRAM/PSRAM и отключите XIP, иначе страдает реальное время RTOS. При исполнении XIP минимизируйте стирание/запись NOR.

Чтение ФС не отключает XIP: драйвер читает через него.

Без таблицы разделов монтирование невозможно: её нужно сохранить в начале flash; текущий драйвер RK NOR разбирает только такую таблицу.

<!-- cn PDF p.14 -->

## 3. SPI NAND

<!-- cn PDF p.15 -->

### 3.1 Примечания

<!-- cn PDF p.15 -->

#### 3.1.1 Хранение RK SPI NAND

<!-- cn PDF p.15 -->

| Filesystem | Update |
| --- | --- |
| FATFS | USB / programmer / OTA |

<!-- cn PDF p.15 -->

### 3.2 Настройка

<!-- cn PDF p.15 -->

#### 3.2.1 Архитектура

<!-- cn PDF p.15 -->

![Рисунок китайского оригинала (p.15)](/docs/rockchip-rtthread-spiflash/assets/cn-p015-figure-01.png)

*Рисунок китайского оригинала (p.15)*

<!-- cn PDF p.16 -->

| Type | Memory | Driver |
| --- | --- | --- |
| SPI Nand | SPI Nand | DHARA FTL: bsp/rockchip/common/dhara/<br>RTT Mini FTL: bsp/rockchip/common/mini_ftl.c<br>RTT SPI Nand: bsp/rockchip/common/drv_spinand.c<br>HAL SPI Nand: lib/hal/src/hal_spinand.c<br>HAL Controller: lib/hal/src/hal_fspi.c |

<!-- cn PDF p.16 -->

Корень HAL: bsp/rockchip/common/hal. Поддержка NAND — lib/hal/src/hal_spinand.c и соседние файлы. Сопоставьте ID/маркировку. Драйвер определяет ID и выбирает максимальную ширину IO; уменьшение задаётся макросами.

<!-- cn PDF p.16 -->

#### 3.2.2 Настройка драйвера

<!-- cn PDF p.16 -->

Определите аппаратный контроллер перед выбором решения. Пункт menuconfig:

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

Определения настроек:

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

Также отключите XIP: XIP = 'N' в rtconfig.py.

<!-- cn PDF p.17 -->

#### 3.2.3 Алгоритмы FTL

<!-- cn PDF p.17 -->

##### 3.2.3.1 DHARA FTL

<!-- cn PDF p.17 -->

Dhara (Dæ:ra) — открытый FTL для NAND-систем с ограниченными ресурсами, предоставляющий изменяемый блочный интерфейс чтения/записи.
- Износ: число стираний любых двух блоков отличается максимум на 1.
- Скорость GC настраивается коэффициентом GC за счёт резервного места.
- Запись/trim логического сектора атомарны. При потере питания возврат к последней синхронизации; она периодическая либо принудительная.
- При равномерных плохих блоках все операции, включая запуск, имеют худшую сложность O(log n) для размера чипа n.
При DHARA API блочного раздела используют DHARA, сектор равен странице, обычно 2KB/4KB. Ограничение: по умолчанию поддерживается только всё NAND как область FTL.
Применение: один FSPI с NAND для прошивки/данных; один FSPI с NOR на CS0 для прошивки без XIP и NAND на CSN1 для данных; несколько FSPI, NOR на FSPI0 и NAND на FSPI1.

<!-- cn PDF p.17 -->

##### 3.2.3.2 Драйвер Mini FTL

<!-- cn PDF p.17 -->

Mini FTL не стандартный FTL: только базовое управление плохими блоками, преимущественно для обновления прошивки разделов. Раздел root регистрируется одноимённым блочным устройством для ФС только для чтения.

<!-- cn PDF p.17 -->

#### 3.2.4 Настройка таблицы разделов

<!-- cn PDF p.17 -->

##### 3.2.4.1 Планирование разделов

<!-- cn PDF p.17 -->

Начало и размер кратны 256KB для блоков 128KB/256KB. Резерв замены плохих блоков: кроме раздела таблицы малым разделам 1–2 flash blocks, более 8MB — 1%. В конце рекомендуется 2MB: четыре блока таблицы плохих блоков и один хороший блок резервной таблицы, для 128KB/256KB. Для OTA рекомендуется A/B.

<!-- cn PDF p.18 -->

##### 3.2.4.2 Расширение RK Partition

<!-- cn PDF p.18 -->

Таблица RK похожа на GPT, но экономнее и быстрее инициализируется, преимущественно RV1107/8 и MCU. NAND по умолчанию регистрирует последний раздел для DHARA FTL, обычно пользовательский root для ФС.

<!-- cn PDF p.18 -->

##### 3.2.4.3 Расширение GPT

<!-- cn PDF p.18 -->

SDK RK поддерживает GPT; последний раздел по умолчанию управляется DHARA FTL, обычно root для ФС.

<!-- cn PDF p.18 -->

##### 3.2.4.4 Собственный ROOT

<!-- cn PDF p.18 -->

Без расширения таблицы рассмотрите одиночный ROOT в drv_spinand.c:

<!-- cn PDF p.18 -->

```text
RT_ROOT_PART_OFFSET
RT_ROOT_PART_SIZE
```

<!-- cn PDF p.18 -->

Единицы — секторы 512B. RK3308 RT-Thread build.sh показывает привязку определений к сборке.

<!-- cn PDF p.18 -->

#### 3.2.5 Разбор и регистрация разделов

<!-- cn PDF p.18 -->

После инициализации NAND разбирается таблица и регистрируется последний раздел. Проверка:

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

### 3.3 Прошивка с ПК

<!-- cn PDF p.18 -->

Используйте SocToolKit Windows/Linux; есть соответствующие массовые инструменты. Для OTA рекомендуется A/B.

<!-- cn PDF p.19 -->

И отдельные, и упакованные образы NAND в итоге прошиваются по разделам. RK Partition поддерживает отдельные, но не Firmware.img. GPT — отдельные и update.img. Остальные расширения — только отдельные.

<!-- cn PDF p.19 -->

### 3.4 Примеры API

<!-- cn PDF p.19 -->

![Рисунок китайского оригинала (p.19)](/docs/rockchip-rtthread-spiflash/assets/cn-p019-figure-01.png)

*Рисунок китайского оригинала (p.19)*

<!-- cn PDF p.19 -->

#### 3.4.1 Основной API байтного MTD

<!-- cn PDF p.19 -->

См. spinand_test в spinand_test.c:

<!-- cn PDF p.19 -->

```text
mtd_dev = (struct rt_mtd_nor_device *)rt_device_find("spinand0");
rt_mtd_nand_check_block(mtd_dev, block);
rt_mtd_nand_erase_block(mtd_dev, block);
rt_mtd_nand_write(mtd_dev, page_addr + i, (const rt_uint8_t *)buffer, mtd_dev->page_size, RT_NULL, 0);
rt_mtd_nand_read(mtd_dev, page_addr + i, (rt_uint8_t *)buffer, mtd_dev->page_size, RT_NULL, 0);
```

<!-- cn PDF p.19 -->

spinand0 — байтное устройство. rt_mtd_nand_check_block: true для плохого, false для хорошего блока. Здесь оригинал называет rt_mtd_nor_erase_block (блоки) и rt_mtd_nor_write/read (байты, выравнивание по странице, обычно 2KB/4KB; см. руководство flash); имена NOR сохранены. Таблица RK использует секторы 512B; преобразуйте единицы.

<!-- cn PDF p.20 -->

#### 3.4.2 Mini FTL: OTA/файловая система

<!-- cn PDF p.20 -->

OTA: mini_ftl_test_one_flash_block в spinand_test.c:

<!-- cn PDF p.20 -->

```text
rt_uint32_t block_size = mtd_dev->pages_per_block * mtd_dev->page_size;
mtd_dev = (struct rt_mtd_nor_device *)rt_device_find("spinand0");
mini_ftl_erase(mtd_dev, addr, block_size);
mini_ftl_write(mtd_dev, buffer, addr, block_size);
mini_ftl_read(mtd_dev, buffer, addr, block_size);
```

<!-- cn PDF p.20 -->

mini_ftl_erase: байты, выравнивание blocksize. mini_ftl_write: байты, pagesize, сначала стирание. mini_ftl_read: байты, pagesize. При OTA выровняйте buffer по block_size, одним вызовом завершите erase/write/read с проверкой; перед обновлением elm FatFs сотрите весь раздел. RK Partition: rk_partition_list; GPT: dfs_part_list, пока без name info.
После настройки раздел root регистрируется как root block через Mini FTL для ФС только для чтения. Только прошивка образа, без онлайн-форматирования.

<!-- cn PDF p.20 -->

#### 3.4.3 API файловой системы DHARA FTL

<!-- cn PDF p.20 -->

Последний раздел регистрируется одноимённым блоком DHARA FTL для ФС чтения/записи. Поддерживаются прошивка образа и онлайн-форматирование.

<!-- cn PDF p.20 -->

### 3.5 Файловые системы

<!-- cn PDF p.20 -->

#### 3.5.1 Поддержка elm FatFs

<!-- cn PDF p.20 -->

Блок Mini FTL только для чтения, монтирует FAT, прошивается FAT-образом, без онлайн-форматирования. DHARA FTL читает/пишет FAT, требует FAT-образ в оболочке DHARA и поддерживает онлайн-форматирование.

<!-- cn PDF p.21 -->

##### 3.5.1.1 Монтирование разделов

<!-- cn PDF p.21 -->

При CONFIG_RT_USING_DFS_MNTTABLE добавьте регистрацию в mnt.c, например root в /:

<!-- cn PDF p.21 -->

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

<!-- cn PDF p.21 -->

Для собственного монтирования:

<!-- cn PDF p.21 -->

```text
dfs_mount("root", "/", "elm", 0, 0)
```

<!-- cn PDF p.21 -->

Команда монтирования:

<!-- cn PDF p.21 -->

```text
mount root / elm
```

<!-- cn PDF p.21 -->

##### 3.5.1.2 Онлайн-форматирование раздела

<!-- cn PDF p.21 -->

```text
mkfs -t elm userdata
```

<!-- cn PDF p.21 -->

root только для чтения: монтирование, без онлайн-форматирования.

<!-- cn PDF p.21 -->

##### 3.5.1.3 Офлайн-образы elm-fat

<!-- cn PDF p.21 -->

См. ./bsp/rockchip/tools/mkroot.sh и mkfs.fat; -S задайте по page_size, обычно 2048/4096 согласно NAND.

<!-- cn PDF p.21 -->

##### 3.5.1.4 Офлайн-образы DHARA

<!-- cn PDF p.21 -->

Инструмент DHARA:

<!-- cn PDF p.21 -->

```text
Usage: ./dhara_utils <file_path> <flash_page_size> <num_blocks>
```

<!-- cn PDF p.21 -->

Пример: FAT16 DHARA офлайн, раздел 504 блока, страница NAND 2KB:

<!-- cn PDF p.21 -->

```text
mkfs.vfat -F 16 -s 1 -S 2048 fat.img
./rkbin/dhara_utils fat.img 2 504
```

<!-- cn PDF p.21 -->

Выход: fat.img.dhara.

<!-- cn PDF p.22 -->

Размер см. в планировании разделов.

<!-- cn PDF p.22 -->

### 3.6 Тестовый драйвер

<!-- cn PDF p.22 -->

#### 3.6.1 Основная настройка теста

<!-- cn PDF p.22 -->

```text
RT-Thread bsp test case  --->
    RT-Thread Common Test case  --->
        [*] Enable BSP Common TEST
        [*]   Enable BSP Common SPINAND TEST (NEW)
```

<!-- cn PDF p.22 -->

После настройки в msh появляется spinand_test:

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

#### 3.6.2 Нагрузка flash_stress_test

<!-- cn PDF p.22 -->

Цель: стабильность NAND при чтении/записи. Подготовьте 10 устройств. Пример области: смещение 512 блоков, размер 256 flash blocks.

<!-- cn PDF p.22 -->

1. После загрузки spinand_test stress 5000 512 256, питание не отключать.

<!-- cn PDF p.22 -->

2. Запишите журнал.

<!-- cn PDF p.22 -->

3. Успех при нормальной работе после 24 часов, иначе неудача.

<!-- cn PDF p.23 -->

#### 3.6.3 power_lost_test отключения питания

<!-- cn PDF p.23 -->

Цель: устойчивость к отключению, особенно частому в NAND без батареи. Подготовьте 10 устройств. Метод:

<!-- cn PDF p.23 -->

1. Создайте нагрузку копирования файлов.

<!-- cn PDF p.23 -->

2. Питание 2 секунды, отключение 3 секунды: цикл 5 секунд, 8 часов, около 5760 отключений. После каждого отключения устройство должно включиться и запустить копирование в пределах 5 секунд.

<!-- cn PDF p.23 -->

3. Запишите журнал.

<!-- cn PDF p.23 -->

4. Оригинал требует нормальную работу после 24 часов (это противоречит 8 часам выше; оба значения сохранены), иначе неудача. См. раздел примера исходников отключения.

<!-- cn PDF p.23 -->

### 3.7 Устранение неисправностей

<!-- cn PDF p.23 -->

#### 3.7.1 Зависание RK2118 с NAND

<!-- cn PDF p.23 -->

Симптом:

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

Попробуйте отключить XIP:

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

#### 3.7.2 NAND не поддерживает RK Firmware.img

<!-- cn PDF p.24 -->

RK Firmware.img заполняет неиспользуемые части разделов нулями, кроме допускаемого пустого последнего раздела. При тех же полезных образах рост разделов резко увеличивает заполнение; всё передаётся одним обновлением. NAND допускает заводские плохие блоки и требует резерв замены. Поэтому “one firmware” с заполнением несовместим: даже единый пакет нужно распаковать и записать только полезные образы по разделам. Программатор также не поддерживает монолитный образ.

<!-- cn PDF p.24 -->

#### 3.7.3 Проблемы отключения NAND

<!-- cn PDF p.24 -->

Аварийное отключение обходит штатную деинициализацию и может оставить NAND при нестабильном напряжении. Главным образом страдают стирание (несколько миллисекунд) и программирование (сотни микросекунд). Для 3V3 обычно требуется минимум 2.7V; уточняйте по документации.
Два типа отказов: неполная запись; случайные ошибки команд при нестабильном напряжении.
Восстановление ФС защищает от неполных данных, но данные могут потеряться. Защита от нестабильного напряжения:
- PMIC контролирует VCC IO, обычно сбрасывает CPU ниже 2.91V, прекращая новые команды. Разряд внешней схемы должен сохранять питание около 1ms для последней операции.
- Reset IC аналогичен, обычный порог 2.93V.
- RK NPOR контролирует VCCIO и сбрасывает CPU по порогу.
Предпочтительны батарея или постоянное питание. Иначе улучшите схему: PMIC/Reset IC/RK NPOR должны обнаружить спад VCC IO и сбросить CPU до команд при низком напряжении.

<!-- cn PDF p.25 -->

Добавьте ёмкость по demo RK, чтобы VCCIO flash оставалось нормальным обычно в течение tBERS (стирание блока). Снижайте отключения при доступе к flash. Предусмотрите восстановление: две копии прошивки, важные данные в read-only ФС, восстановление повреждённых записываемых разделов для работы или OTA.
Для проверки времени выполните power_lost_test в реальном изделии/нагрузке и снимите VCC3V3/RESETn:

<!-- cn PDF p.25 -->

![Рисунок китайского оригинала (p.25)](/docs/rockchip-rtthread-spiflash/assets/cn-p025-figure-01.png)

*Рисунок китайского оригинала (p.25)*

<!-- cn PDF p.25 -->

Осциллограф должен показывать точку RESETn/Reset IC (Y1), падение VCC3V3 до 2V7 (Y2) и время ΔY1Y2. Повторите и анализируйте минимум. Для RV1106 и подобных RKNPOR RESETn внутренний; используйте GPIO высокого уровня с внешней подтяжкой вниз. При сбросе GPIO отключается и падает; переход приблизительно соответствует сбросу CPU.

<!-- cn PDF p.26 -->

#### 3.7.4 Пример исходников отключения NAND

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
