---
title: "Руководство Rockchip DSMC: DTS, PSRAM, Local Bus, доступ к памяти и отладка"
description: "Полный материал по Rockchip DSMC: драйвер и DTS, доступ из ядра и пользовательского режима, адресные пространства PSRAM/Local Bus, обмен через FIFO/регистры и диагностика."
translation_key: "055-rockchip-dsmc"
slug: "055-rockchip-dsmc"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip DSMC"
excerpt: "Полный материал по Rockchip DSMC: драйвер и DTS, доступ из ядра и пользовательского режима, адресные пространства PSRAM/Local Bus, обмен через FIFO/регистры и диагностика."
---

{% raw %}

# Руководство Rockchip DSMC: DTS, PSRAM, Local Bus, доступ к памяти и отладка

Этот полный технический материал следует документу Rockchip V1.2.0. Область исходника: RK3576 / RK3506 / RV1126B, kernel 6.10. Это справочник по платформе для ArmSoM; проверьте конкретную плату, SoC, ветку SDK/BSP, ядро и периферию. Аппаратная проверка платы не проводилась; поддержка всеми платами ArmSoM не подразумевается.

Китайская статья следует китайскому PDF из 17 страниц, английская — английскому PDF из 19 страниц; русская полностью переводит его технический текст. Для китайского использованы китайские рисунки, для английского и русского — рисунки английского PDF, включая китайские подписи интерфейса, присутствующие в оригинале. Противоречия и исправления извлечения отмечены в [редакционных записях](/docs/rockchip-dsmc/EDITORIAL-NOTES.md). Комментарии к коду и вывод сохраняют язык источника.

**Риск операций:** отображение DSMC, прямой доступ к памяти и DMA могут вызвать исключения шины, повреждение данных или отказ загрузки. Адреса, тайминги и код сохранены как примеры исходника; проверьте схему, ёмкость ведомого устройства, порядок питания/инициализации и SDK. Указанное исходником kernel 6.10 не заменяется другой версией. Сомнительные места кода отмечены в редакционных записях. Аппаратные чтения и записи не выполнялись.

Официальные ресурсы: [ArmSoM](https://docs.armsom.org/)、[Rockchip Linux](https://github.com/rockchip-linux)。

| SoC | Kernel |
|---|---|
| RK3576 / RK3506 / RV1126B | kernel 6.10 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Термины

<!-- Source EN PDF p.4, block 1 -->

DSMC: Double Data Rate Serial Memory Controller — последовательный контроллер памяти с передачей данных по обоим фронтам такта.

<!-- Source EN PDF p.4, block 2 -->

PSRAM: Pseudo static random access memory — псевдостатическая оперативная память.

<!-- Source EN PDF p.4, block 3 -->

DPRAM: Dual Port Random Access Memory — двухпортовая оперативная память.

<!-- Source EN PDF p.4, block 4 -->

## 2. Обзор

<!-- Source EN PDF p.4, block 5 -->

Контроллер Double Data Rate Serial Memory Controller (DSMC) обеспечивает высокую пропускную способность при небольшом числе выводов за счёт временного мультиплексирования линий команд, адреса и данных и передачи данных по обоим фронтам такта. Поддерживаются ширина данных x8 и x16, до 4 сигналов выбора микросхемы. Поддерживаемые протоколы: Hyperbus PSRAM, Xccela PSRAM и Local bus. Для Local bus ведомое устройство должно использовать модель slave разработки Rockchip либо совместимый протокол передачи. Для HYPERBUS PSRAM и XCCELA PSRAM поддерживаются микросхемы PSRAM производителей Winbond, AP Memory, Cypress, ISSI и других.

<!-- Source EN PDF p.4, block 6 -->

## 3. Драйвер DSMC

<!-- Source EN PDF p.4, block 7 -->

### 3.1 Файлы драйвера

<!-- Source EN PDF p.4, block 8 -->

Расположение файлов драйвера DSMC:

<!-- Source EN PDF p.4, block 9 -->

```text
drivers/memory/rockchip/dsmc-host.c /* Main driver program */
drivers/memory/rockchip/dsmc-controller.c /* The DSMC controller behavior configuration */
drivers/memory/rockchip/dsmc-lb-device.c /* The DSMC Local bus device */
```

<!-- Source EN PDF p.4, block 10 -->

### 3.2 Настройка DTS

<!-- Source EN PDF p.4, block 11 -->

```text
    dsmc: dsmc@2a280000 {
        ...
        clock-frequency = <100000000>; /* DSMC interface frequency */
        ...
        /* Slave device properties */
        slave {
            rockchip,dqs-dll = <0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs0
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs1
*/
                   0x20 0x20 /* DQS0, DQS1 DLL delay for slave device cs2
*/
                   0x20 0x20>; /* DQS0, DQS1 DLL delay for slave device cs3
*/
            /*
             * rockchip,ranges: Base address and size of DSMC access to slave device memory;
             * If different CS have different memory space sizes, configure the largest.
             * rockchip,ranges = <0x0 0x10000000 0x0 0x2000000> means that if the slave is
             * PSRAM, allocate 0x2000000 memory size for each CS;
             * If the slave is Local Bus, allocate 0x2000000 memory size for each region
             */
            rockchip,ranges = <0x0 0x10000000 0x0 0x2000000>;
            rockchip,slave-dev = <&dsmc_slave>;
        };
    };
    dsmc_slave: dsmc_slave {
        compatible = "rockchip,dsmc-slave";
        rockchip,clk-mode = <0>; /* Clock mode, only for Local bus */
        status = "disabled";
        /*
         * Enable the corresponding slave device cs nodes when the slave
         * device is PSRAM (Hyperbus Psram or Xccela Psram).
         */
        psram {
            /*
             * When using PSRAM, there is no need to specify the bit width as
             * the driver automatically adapts it.
             */
            psram0 {
                status = "disabled"; /* If the slave device cs0 is PSRAM, change to "okay"
*/
            };
            psram1 {
                status = "disabled"; /* If the slave device cs1 is PSRAM, change to "okay"
*/
            };
            psram2 {
                status = "disabled"; /* If the slave device cs2 is PSRAM, change to "okay"
*/
            };
            psram3 {
                status = "disabled"; /* If the slave device cs3 is PSRAM, change to "okay"
*/
            };
        };
        /* Enable and configure the corresponding nodes if the slave is a Local bus device
*/
        lb-slave {
            rockchip,io-width = <16>; /* The data width of the local bus slave */
            dsmc_lb_slave0: lb-slave0 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x0>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If the cs0 slave is a Local bus, change to "okay" */
                dsmc_p0_region: region {
                    dsmc_p0_region0: region0 {/* Attributes of this slave region0 */
                        rockchip,attribute = "Merged FIFO";/* The region0 is merged FIFO */
                        rockchip,ca-addr-width = <0>;/* CA transfer format, 0: 32bit, 1:
16bit */
                        rockchip,dummy-clk-num = <1>;/* Write transfer dummy clk cycle
number */
                        rockchip,cs0-be-ctrled = <0>;/* cs0 is controlled by cs1, cs2, cs3
*/
                        rockchip,cs0-ctrl = <0>; /* cs0 controls cs1, cs2, cs3 */
                        status = "disabled";
                    };
                    dsmc_p0_region1: region1 {/* Attributes of this slave region1 */
                        rockchip,attribute = "No-Merge FIFO";/* region1 is unmerged FIFO */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region2: region2 {/* Attributes of this slave region2 */
                        rockchip,attribute = "DPRA";/* region2 is DPRAM */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p0_region3: region3 {/* Attributes of this slave region3 */
                        rockchip,attribute = "Register";/* region3 is register */
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave1: lb-slave1 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x1>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs1 slave is a Local bus, change to "okay" */
                dsmc_p1_region: region {
                    dsmc_p1_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p1_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave2: lb-slave2 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x2>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs2 slave is a Local bus, change to "okay" */
                dsmc_p2_region: region {
                    dsmc_p2_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p2_region3: region3 {
                        rockchip,attribute = "Register";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                };
            };
            dsmc_lb_slave3: lb-slave3 {
                rockchip,mtr-timing = <1 0 0 0 0 0 2 2>; /* The core timing, modifiable
according to slave design */
                rockchip,int-en = <0x3>; /* The current cs uses the interrupt sequence
number on the pin */
                status = "disabled";/* If cs3 slave is a Local bus, change to "okay" */
                dsmc_p3_region: region {
                    dsmc_p3_region0: region0 {
                        rockchip,attribute = "Merged FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region1: region1 {
                        rockchip,attribute = "No-Merge FIFO";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region2: region2 {
                        rockchip,attribute = "DPRA";
                        rockchip,ca-addr-width = <0>;
                        rockchip,dummy-clk-num = <1>;
                        rockchip,cs0-be-ctrled = <0>;
                        rockchip,cs0-ctrl = <0>;
                        status = "disabled";
                    };
                    dsmc_p3_region3: region3 {
                        rockchip,attribute = "Register";
                    rockchip,ca-addr-width = <0>;
                    rockchip,dummy-clk-num = <1>;
                    rockchip,cs0-be-ctrled = <0>;
                    rockchip,cs0-ctrl = <0>;
                    status = "disabled";
                };
            };
        };
    };
};
```

<!-- Source EN PDF p.9, block 21 -->

В зависимости от фактического типа ведомого устройства необходимо включить соответствующий узел. Для PSRAM включается psramx по номеру CS, подключённого на плате; Hyperbus или Xccela определяется драйвером автоматически. Для ведомой модели DSMC разработки RK включается lb_slavex по номеру подключённого CS, а конфигурация region изменяется согласно свойствам устройства. Параметр clk-mode задаёт три режима тактирования. При clk-mode = 0 тактирование отсутствует при высоком уровне CS и присутствует при низком. При clk-mode = 1 тактовый сигнал присутствует постоянно независимо от CS и может служить опорным для ведомого устройства; однако высокочастотная работа и настраиваемые параметры AC timing в этом режиме недоступны. При clk-mode = 2 тактирование присутствует при обоих уровнях CS, но несколько тактов отключаются до и после переключения CS.

<!-- Source EN PDF p.9, block 22 -->

Пространство памяти устройства Local bus:

<!-- Source EN PDF p.9, block 23 -->

![Технический рисунок исходника — PDF 9](/docs/rockchip-dsmc/assets/en-p09-figure1.png)

Редактируемая расшифровка рисунка:

| Region | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (merged) | FIFO (merged) | FIFO (merged) | FIFO (merged) |
| 1 | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.9, block 24 -->

Пространство доступа каждого CS можно разделить на 1, 2 или 4 равные области region. Достаточно включить соответствующие свойства status этих областей в DTS.

<!-- Source EN PDF p.9, block 25 -->

Свойство `rockchip,ranges`, например `rockchip,ranges = <0x0 0x10000000 0x0 0x2000000>`, задаёт начальный адрес и размер пространства памяти ведомого устройства. Смысл размера зависит от типа периферии.

<!-- Source EN PDF p.10, block 26 -->

Для PSRAM свойство rockchip,ranges задаёт максимальный размер пространства одного CS. Разделение пространства между CS показано ниже:

<!-- Source EN PDF p.10, block 27 -->

![Технический рисунок исходника — PDF 10](/docs/rockchip-dsmc/assets/en-p10-figure1.png)

Редактируемая расшифровка рисунка:

| CS | Начальная граница | Следующая граница |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.10, block 28 -->

Для Local Bus свойство rockchip,ranges задаёт максимальный размер одной области region. Если включены только две области Register и merged-FIFO, пространство каждого CS делится следующим образом:

<!-- Source EN PDF p.10, block 29 -->

![Технический рисунок исходника — PDF 10](/docs/rockchip-dsmc/assets/en-p10-figure2.png)

Редактируемая расшифровка рисунка:

| CS | Region | Начальная граница | Следующая граница |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.11, block 30 -->

### 3.3 Настройка ядра

<!-- Source EN PDF p.11, block 31 -->

```text
Symbol: ROCKCHIP_DSMC [=y]
       │
  │ Type : bool
       │
  │ Prompt: Rockchip DSMC(Double Data Rate Serial Memory Controller) driver
       │
  │ Depends on: MEMORY [=y]
       │
  │ Location:
       │
  │ -> Device Drivers
       │
  │ -> Memory Controller drivers (MEMORY [=y])
       │
  │ -> Rockchip DSMC(Double Data Rate Serial Memory Controller) driver (ROCKCHIP_DSMC
[=y])│
```

<!-- Source EN PDF p.11, block 32 -->

## 4. Доступ к DSMC из режима ядра

<!-- Source EN PDF p.11, block 33 -->

### 4.1 Вызов интерфейсов драйвера

<!-- Source EN PDF p.11, block 34 -->

Драйвер `drivers/memory/rockchip/dsmc-host.c` реализует следующие интерфейсы доступа:

<!-- Source EN PDF p.11, block 35 -->

```text
struct rockchip_dsmc_device *rockchip_dsmc_find_dev(void);
static struct dsmc_ops rockchip_dsmc_ops = {
    .read = dsmc_read,
    .write = dsmc_write,
    .copy_from = dsmc_copy_from,
    .copy_from_state = dsmc_copy_from_state,
    .copy_to = dsmc_copy_to,
    .copy_to_state = dsmc_copy_to_state,
};
```

<!-- Source EN PDF p.12, block 36 -->

Функция `rockchip_dsmc_find_device_by_compat()` находит устройство DSMC и возвращает его частные параметры. Через dsmc_dev.ops реализован доступ CPU и DMA к ведомой памяти. ops->read и ops->write выполняют чтение и запись CPU. ops->copy_from читает данные DMA из ведомой памяти в память ведущего устройства; ops->copy_to записывает данные DMA из памяти ведущего в память ведомого.

<!-- Source EN PDF p.12, block 37 -->

```text
static void test(void)
{
    u32 cs;
    struct rockchip_dsmc_device *dsmc_dev;
    dsmc_dev = rockchip_dsmc_find_device_by_compat(rockchip_dsmc_get_compat(0));
    if (dsmc_dev == NULL){
        printk("error: can not find dsmc device\n");
        return 0;
    }
    for (cs = 0; cs < DSMC_MAX_SLAVE_NUM; cs++) {
        if (dsmc_dev->dsmc.cfg.cs_cfg[i].device_type == DSMC_UNKNOWN_DEVICE)
            continue;
        dsmc_dev->ops->write(dsmc_dev, cs, 0, test_addr, test_data);
        /* TODO */
    }
}
```

<!-- Source EN PDF p.12, block 38 -->

### 4.2 Прямой доступ

<!-- Source EN PDF p.12, block 39 -->

CPU или другой ведущий блок может обращаться к памяти ведомого устройства напрямую. Поддерживается произвольный адресный доступ размером Byte, half-word и word, а также отображения cacheable, uncacheable и write-combine.

<!-- Source EN PDF p.12, block 40 -->

## 5. Доступ к DSMC из пользовательского режима

<!-- Source EN PDF p.12, block 41 -->

### 5.1 Доступ через специальные узлы

<!-- Source EN PDF p.12, block 42 -->

При включённом Local Bus драйвер создаёт в `/dev/dsmc/` узлы четырёх CS, а внутри каждого — четыре области памяти со свойствами, заданными в DTS. Для merged-FIFO используется region0; необходимо обращаться к соответствующему узлу region нужного CS. Порядок работы:

<!-- Source EN PDF p.12, block 43 -->

1\. Открыть узел области интерфейсом open() и получить файловый дескриптор.

<!-- Source EN PDF p.12, block 44 -->

2\. Системным вызовом mmap() отобразить память области в адресное пространство процесса и получить адрес отображения.

<!-- Source EN PDF p.12, block 45 -->

3\. Читать и записывать память устройства.

<!-- Source EN PDF p.12, block 46 -->

4\. Вызвать munmap() для удаления отображения.

<!-- Source EN PDF p.13, block 47 -->

5\. Закрыть файловый дескриптор вызовом close().

<!-- Source EN PDF p.13, block 48 -->

Пример кода:

<!-- Source EN PDF p.13, block 49 -->

```text
device_name = "/dev/dsmc/cs0/region0"
wantbytes = 0x200000;
memfd = open(device_name, O_RDWR | O_SYNC);
if (memfd == -1) {
    fprintf(stderr, "failed to open %s for physical memory: %s\n",
        device_name, strerror(errno));
    exit(EXIT_FAILURE);
}
/*
 * Open the file with O_SYNC flag and MAP_LOCKED flag to make the
 * memory space uncached for mmap operation.
 */
buf = (void volatile *) mmap(0, wantbytes, PROT_READ | PROT_WRITE,
                                 MAP_SHARED | MAP_LOCKED, memfd,
                                 0x0);
if (buf == MAP_FAILED) {
        fprintf(stderr, "failed to mmap %s for physical memory: %s\n",
                device_name, strerror(errno));
        exit(EXIT_FAILURE);
}
bufsize = wantbytes;
halflen = bufsize / 2;
count = halflen / sizeof(u32);
bufa = (u32v *) buf;
bufb = (u32v *) ((size_t) buf + halflen);
test_dsmc(bufa, bufb, count);/* Read or write DSMC slave memory */
if (munmap((void*)buf, wantbytes) == -1) {
    perror("munmap");
    close(memfd);
    exit(EXIT_FAILURE);
}
close(memfd);
```

<!-- Source EN PDF p.13, block 50 -->

### 5.2 Прямой доступ

<!-- Source EN PDF p.13, block 51 -->

CPU может напрямую обращаться к ведомой памяти DSMC, отображённой через dev/mem. Например, на RK3576 команда `io -4 0x10000000` обращается к region0 ведомой памяти.

<!-- Source EN PDF p.14, block 52 -->

## 6. Распределение ведомой памяти DSMC

<!-- Source EN PDF p.14, block 53 -->

Распределение пространства ведомой памяти управляется свойством rockchip,ranges, задающим начальный адрес и размер памяти устройства.

<!-- Source EN PDF p.14, block 54 -->

### 6.1 PSRAM

<!-- Source EN PDF p.14, block 55 -->

Например, при настройке `map, ranges = `<0x0 0x10000000 0x0 0x2000000>`;` для PSRAM параметр map, ranges означает максимальный размер пространства одного CS. Для контроллера DSMC все ведомые устройства имеют одинаковую ёмкость. Если фактически установлена PSRAM разной ёмкости, необходимо учитывать границы при доступе. Распределение пространства показано ниже:

<!-- Source EN PDF p.14, block 56 -->

![Технический рисунок исходника — PDF 14](/docs/rockchip-dsmc/assets/en-p14-figure1.png)

Редактируемая расшифровка рисунка:

| CS | Начальная граница | Следующая граница |
|---|---|---|
| cs0 | 0x10000000 | 0x12000000 |
| cs1 | 0x12000000 | 0x14000000 |
| cs2 | 0x14000000 | 0x16000000 |
| cs3 | 0x16000000 | 0x18000000 |

<!-- Source EN PDF p.14, block 57 -->

Примечание: теоретически разные ведомые устройства могут использовать PSRAM разных производителей и ёмкостей, но ширина данных (x8 или x16) у всех должна совпадать.

<!-- Source EN PDF p.14, block 58 -->

### 6.2 Local bus

<!-- Source EN PDF p.14, block 59 -->

Для Local Bus контроллер также рассматривает все ведомые устройства как имеющие одинаковую ёмкость. Каждое можно разделить на 1, 2 или 4 области со свойствами DPRAM, Register, merged FIFO и un-merged FIFO. Если реальные размеры областей различаются, при доступе следует учитывать их границы.

<!-- Source EN PDF p.15, block 60 -->

![Технический рисунок исходника — PDF 15](/docs/rockchip-dsmc/assets/en-p15-figure1.png)

Редактируемая расшифровка рисунка:

| Region | CS0 | CS1 | CS2 | CS3 |
|---|---|---|---|---|
| 0 | FIFO (merged) | FIFO (merged) | FIFO (merged) | FIFO (merged) |
| 1 | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) | FIFO (un-merged) |
| 2 | DPRA | DPRA | DPRA | DPRA |
| 3 | Register | Register | Register | Register |

<!-- Source EN PDF p.15, block 61 -->

Для Local Bus параметр map, ranges означает максимальный размер одной области region.

<!-- Source EN PDF p.15, block 62 -->

Если у ведомого устройства включены две области, размер каждой определяется настройкой DTS `map, ranges = 0x0 0x10000000 0x0 0x2000000` узла DSMC. Распределение областей каждого CS показано ниже:

<!-- Source EN PDF p.15, block 63 -->

![Технический рисунок исходника — PDF 15](/docs/rockchip-dsmc/assets/en-p15-figure2.png)

Редактируемая расшифровка рисунка:

| CS | Region | Начальная граница | Следующая граница |
|---|---|---|---|
| cs0 | merged-FIFO | 0x10000000 | 0x12000000 |
| cs0 | Register | 0x12000000 | 0x14000000 |
| cs1 | merged-FIFO | 0x14000000 | 0x16000000 |
| cs1 | Register | 0x16000000 | 0x18000000 |
| cs2 | merged-FIFO | 0x18000000 | 0x1a000000 |
| cs2 | Register | 0x1a000000 | 0x1c000000 |
| cs3 | merged-FIFO | 0x1c000000 | 0x1e000000 |
| cs3 | Register | 0x1e000000 | 0x20000000 |

<!-- Source EN PDF p.16, block 64 -->

## 7. Обмен данными между ведущим и ведомым устройствами DSMC Local bus

<!-- Source EN PDF p.16, block 65 -->

### 7.1 FIFO

<!-- Source EN PDF p.16, block 66 -->

При использовании Local bus и ведомой модели Rockchip ведомое устройство содержит FIFO. При доступе к областям merged-FIFO или un-merged FIFO данные ведущего проходят через FIFO и затем записываются в память ведомого, например DDR или SRAM. Сам FIFO невидим: с точки зрения ведущего DSMC ведомой памятью является DDR или SRAM устройства. Все данные, переданные через DSMC, в итоге записываются туда. Необходимо управлять этим пространством и обеспечивать согласованность данных.

<!-- Source EN PDF p.16, block 67 -->

### 7.2 Register

<!-- Source EN PDF p.16, block 68 -->

При использовании Local bus и ведомой модели Rockchip имеется блок «SLAVE_CSR Register». Доступ к области со свойством Register означает доступ к этому блоку регистров, который служит для быстрого обмена информацией между ведущим и ведомым устройствами.

<!-- Source EN PDF p.16, block 69 -->

Регистры, доступные для обмена информацией:

<!-- Source EN PDF p.16, block 70 -->

![Технический рисунок исходника — PDF 16](/docs/rockchip-dsmc/assets/en-p16-figure1.png)

Редактируемая расшифровка рисунка:

| APP_CONx | LBC_CONx |
|---|---|
| APP_CON0 | LBC_CON0 |
| APP_CON1 | LBC_CON1 |
| ... | ... |
| APP_CON14 | LBC_CON14 |
| APP_CON15 | LBC_CON15 |

<!-- Source EN PDF p.16, block 71 -->

Регистры APP_CONx доступны ведомому для чтения и записи, а ведущему — только для чтения. Регистры LBC_CONx доступны ведомому только для чтения, а ведущему — для чтения и записи.

<!-- Source EN PDF p.16, block 72 -->

Запись ведущего в LBC_CONx вызывает прерывание host2slave у CPU ведомого устройства для обработки переданной информации.

<!-- Source EN PDF p.16, block 73 -->

Запись ведомого в APP_CONx вызывает прерывание slave2host через вывод INT, принимаемое ведущим. CPU ведущего может обработать прерывание и прочитать данные. После получения INT контроллер DSMC также может сформировать аппаратный запрос DMA и начать передачу; DMA необходимо настроить заранее.

<!-- Source EN PDF p.16, block 74 -->

Типовой сценарий 1

<!-- Source EN PDF p.16, block 75 -->

Ведущий записывает информацию в LBC_CONx, вызывая host2slave. Ведомый читает её из LBC_CONx. Затем ведомый записывает информацию в APP_CONx, вызывая slave2host, и ведущий читает её из APP_CONx.

<!-- Source EN PDF p.16, block 76 -->

Типовой сценарий 2

<!-- Source EN PDF p.17, block 77 -->

После настройки DSMC и DMA на ведущей стороне ведущий уведомляет ведомого записью в LBC_CONx. Ведомый записывает APP_CONx, возвращая сигнал готовности через INT. После его получения ведущий DSMC формирует аппаратный запрос DMA для начала передачи.

<!-- Source EN PDF p.17, block 78 -->

Примечание: APP_CON15 и LBC_CON15 уже используются. Драйвер аппаратных запросов DMA реализован. После настройки DMA ведущий записывает в LBC_CON15 предыдущее значение плюс 1. Получив его, ведомый записывает 1 в APP_CON15, вызывая slave2host. После получения этого прерывания ведущий DSMC автоматически формирует заданное число аппаратных запросов DMA для передачи данных.

<!-- Source EN PDF p.17, block 79 -->

## 8. Примечания

<!-- Source EN PDF p.17, block 80 -->

### 8.1 Частота интерфейса на выводах DSMC

<!-- Source EN PDF p.17, block 81 -->

1\. Частота задаётся параметром `clock-frequency = `<100000000>`;` в узле dsmc DTS. Фактическая частота может отличаться от целевой из-за доступных выходов PLL или кварцевого генератора платформы; выбирается ближайшее достижимое значение.

<!-- Source EN PDF p.17, block 82 -->

2\. В DSMC имеется фиксированный делитель на 2: частота от PLL или кварцевого генератора на входе контроллера вдвое больше частоты интерфейса DSMC IO.

<!-- Source EN PDF p.17, block 83 -->

### 8.2 Ширина данных DSMC

<!-- Source EN PDF p.17, block 84 -->

1\. Ширина данных внешнего ведомого устройства DSMC автоматически не определяется. По умолчанию код предполагает x16. Если ведомым является RK3506, поддерживающий только x8, ширину необходимо исправить вручную.

<!-- Source EN PDF p.17, block 85 -->

В новой версии ширину данных ведомого можно изменить в DTS:

<!-- Source EN PDF p.17, block 86 -->

```text
&dsmc_slave {
    status = "okay";
    lb-slave {
        rockchip,io-width = <8>;
        ...
    };
};
```

<!-- Source EN PDF p.17, block 87 -->

В старой версии требуется изменение кода:

<!-- Source EN PDF p.18, block 88 -->

```text
diff --git a/drivers/memory/rockchip/dsmc-host.c b/drivers/memory/rockchip/dsmc-host.c
index 44182923acc9..5214c9128320 100644
--- a/drivers/memory/rockchip/dsmc-host.c
+++ b/drivers/memory/rockchip/dsmc-host.c
@@ -782,7 +782,7 @@ static void dsmc_data_init(struct rockchip_dsmc *dsmc)
                        cs_cfg->rd_bdr_xfer_en = 1;
                        cs_cfg->wr_bdr_xfer_en = 1;
                } else {
- cs_cfg->io_width = MCR_IOWIDTH_X16;
+ cs_cfg->io_width = MCR_IOWIDTH_X8;
                        cs_cfg->wrap_size = DSMC_BURST_WRAPSIZE_16CLK;
                        cs_cfg->wrap2incr_en = 1;
                        cs_cfg->acs = 1;
```

<!-- Source EN PDF p.18, block 89 -->

2\. Для PSRAM ширина данных определяется автоматически, ручная настройка не нужна. Если микросхема поддерживает и x8, и x16, по умолчанию используется x16.

<!-- Source EN PDF p.18, block 90 -->

### 8.3 Система не загружается после включения DSMC

<!-- Source EN PDF p.18, block 91 -->

После включения DSMC выполняет обращения на чтение и запись к ведомому. При ошибке, например отсутствии DQS при чтении, DSMC сообщает об ошибке шине, и система переходит в состояние исключения. Типичный журнал:

<!-- Source EN PDF p.18, block 92 -->

```text
...
[ 1.391589] dsmc 21ca0000.dsmc: init cs0 LB device # After being loaded, the DSMC driver
will access the slave.
[ 1.394238] 8<--- cut here ---
[ 1.394243] Unhandled fault: external abort on non-linefetch (0x1008) at 0xf0600100
[ 1.394250] [f0600100] *pgd=40b0f811, *pte=10000653, *ppte=10000453
[ 1.394267] Internal error: Oops - BUG: 1008 [#1] PREEMPT SMP THUMB2
...
```

<!-- Source EN PDF p.18, block 93 -->

При такой проблеме проверьте аппаратное соединение ведущего и ведомого DSMC.

<!-- Source EN PDF p.18, block 94 -->

Примечание: до инициализации ведущего DSMC ведомое устройство уже должно быть включено и инициализировано; иначе возможны исключения доступа.

<!-- Source EN PDF p.18, block 95 -->

### 8.4 Ошибочный статус самопроверки DSMC

<!-- Source EN PDF p.18, block 96 -->

После инициализации драйвер проверяет регистры состояния DSMC. Следующие сообщения указывают на ошибку во время инициализации:

<!-- Source EN PDF p.18, block 97 -->

```text
dsmc ff8b0000.dsmc: DSMC: csr status error(0x800)! #The specific status error value may vary
dsmc ff8b0000.dsmc: DSMC status error, please check hardware matched(io, slave etc.)
```

<!-- Source EN PDF p.18, block 98 -->

При такой проблеме проверьте аппаратное соединение ведущего и ведомого DSMC.

<!-- Source EN PDF p.19, block 99 -->

Примечание: до инициализации ведущего DSMC ведомое устройство уже должно быть включено и инициализировано; иначе возможны исключения доступа.

{% endraw %}

