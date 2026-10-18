---
title: "Руководство Rockchip SLAVE DSMC: Local Bus, резервирование памяти и прерывания"
description: "Руководство Rockchip SLAVE DSMC: Local Bus, резервирование памяти и прерывания с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
translation_key: "056-rockchip-slave-dsmc"
slug: "056-rockchip-slave-dsmc"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["Rockchip", "DSMC"]
keywords: "ArmSoM Rockchip rockchip-slave-dsmc"
excerpt: "Руководство Rockchip SLAVE DSMC: Local Bus, резервирование памяти и прерывания с полными техническими разделами, кодом, параметрами и замечаниями к исходнику."
---

{% raw %}

# Руководство Rockchip SLAVE DSMC: Local Bus, резервирование памяти и прерывания

Это полный технический материал на основе исходника, справочник по платформе для ArmSoM. Область исходника: RK3506, Linux kernel 6.1. Перед применением проверьте плату, SoC, ветку SDK/BSP, выводы и периферию. Аппаратная проверка не проводилась; поддержка всеми платами ArmSoM не подразумевается. Вывод и числовые результаты — примеры исходника, а не испытания ArmSoM.

Китайская статья следует китайскому исходнику, английская — английскому; русская полностью переводит английский технический текст. Код, комментарии и вывод команд сохраняют язык источника. Китайская статья использует рисунки китайского PDF, английская и русская — английского PDF.

Версии: китайская V1.0.0, английская V1.0.1; английская редакция указывает исправление китайских символов. Техническое содержание соответствует; раздел прерываний имеет номер 2.4 в китайском и 3 в английском/русском. Нумерация и идентификаторы кода сохранены.

**Осторожно:** резервирование памяти, DMA, мультиплексирование выводов и запись в устройства влияют на оборудование. Команды приведены для изучения; аппаратные операции не выполнялись. Проверьте схему, питание, тайминги и устройство. xxx и многоточия в DTS — заполнители исходника, а не готовая конфигурация.

Источники и исправления: [EDITORIAL-NOTES](/docs/rockchip-slave-dsmc/EDITORIAL-NOTES.md)。Официальные материалы: [ArmSoM](https://docs.armsom.org/), [Rockchip Linux](https://github.com/rockchip-linux).

Таблица версий продукта из исходника (PDF p.2; область исходника, не результат проверки платы):

| SoC | Версия ядра |
| --- | --- |
| RK3506 | kernel 6.1 |

<!-- Source EN PDF p.4, block 0 -->

## 1. Обзор

<!-- Source EN PDF p.4, block 1 -->

Slave Double Data Rate Serial Memory Controller (SLAVE DSMC) работает как ведомое устройство DSMC, поддерживает только протокол Local bus и требует контроллера DSMC host разработки Rockchip либо контроллера с таким же протоколом передачи. Например, можно соединить две платы RK3506 EVB: одна работает как DSMC host, другая — как ведомое устройство DSMC local bus. Схема соединения показана ниже.

<!-- Source EN PDF p.4, block 2 -->

![Соединение двух RK3506 EVB в исходнике](/docs/rockchip-slave-dsmc/assets/en-p04-figure1.png)

<!-- Source EN PDF p.4, block 3 -->

## 2. Драйвер SLAVE DSMC

<!-- Source EN PDF p.4, block 4 -->

### 2.1 Файлы драйвера

<!-- Source EN PDF p.4, block 5 -->

Драйвер SLAVE DSMC расположен по следующему пути:

<!-- Source EN PDF p.4, block 6 -->

```text
drivers/memory/rockchip/dsmc-lb-slave.c /* DSMC local bus slave driver */
```

<!-- Source EN PDF p.4, block 7 -->

### 2.2 Настройка DTS

<!-- Source EN PDF p.4, block 8 -->

```text
&dsmc_lb_slave {
    memory-region = <&dsmc_lb_slave_mem>; /* Memory region for dsmc local bus
slave */
    status = "okay"; /* Enable dsmc local bus slave */
};
&reserved_memory {
    /*
     * Memory region for dsmc local bus slave, generally occupying a continuous
space in DDR
     */
    dsmc_lb_slave_mem: dsmc-lb-slave-mem@6000000 {
        compatible = "rockchip,dsmc-lb-slave-mem";
        /* Define the start address and size of the memory space for dsmc local
bus slave */
        reg = <0x6000000 0x2000000>;
    };
};
```

<!-- Source EN PDF p.5, block 10 -->

По умолчанию выделенная память DSMC local bus slave используется хостом DSMC как область Merged FIFO. Поэтому диапазон памяти ведомого устройства должен соответствовать настройке свойства rockchip,ranges на стороне DSMC host.

<!-- Source EN PDF p.5, block 11 -->

### 2.3 Настройка ядра

<!-- Source EN PDF p.5, block 12 -->

```text
Symbol: ROCKCHIP_DSMC_SLAVE [=y]
                             │
  │ Type : tristate
                             │
  │ Prompt: Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver
                                 │
  │ Depends on: MEMORY [=y] && ARCH_ROCKCHIP
                             │
  │ Location:
                           │
  │ -> Device Drivers
                           │
  │ -> Memory Controller drivers (MEMORY [=y])
                             │
  │ -> Rockchip Double Data Rate Serial Memory Controller(DSMC) slave
driver (ROCKCHIP_DSMC_SLAVE [=y])
                    │
```

<!-- Source EN PDF p.6, block 13 -->

## 3. Прерывания

<!-- Source EN PDF p.6, block 14 -->

Драйвер DSMC slave регистрирует обработчик прерывания. Запись хостом DSMC в регистр LBC_CONx ведомого устройства вызывает прерывание SLAVE_DSMC (host2slave). Получив его, процессор ведомого устройства выполняет обработчик rockchip_dsmc_lb_slave_irq. Если в LBC_CON15 записано ненулевое значение, записью в APP_CON15 вызывается прерывание slave2host. Получив его, DSMC host автоматически формирует определённое число аппаратных запросов DMA, запускающих перенос данных.

{% endraw %}
