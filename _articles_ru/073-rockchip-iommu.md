---
title: "Rockchip Linux IOMMU V1/V2: таблицы страниц, DMA и диагностика"
description: "Полный китайский V1.2.0: таблицы V2, дамп RK3588, DMA/DRM/system heap и 18 разделов диагностики."
translation_key: "073-rockchip-iommu"
slug: "073-rockchip-iommu"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "IOMMU"]
keywords: "ArmSoM Rockchip rockchip iommu"
excerpt: "Полный китайский V1.2.0: таблицы V2, дамп RK3588, DMA/DRM/system heap и 18 разделов диагностики."
---

{% raw %}

# Rockchip Linux IOMMU V1/V2: таблицы страниц, DMA и диагностика

## Применимость к ArmSoM и область исходника

Справочный материал для адаптации ArmSoM на основе CN V1.2.0 baseline; EN V1.0.1 comparison. Сочетания платы, SDK/BSP, ядра и соединений аппаратно не проверялись. Область исходника ниже не означает поддержку каждой платой ArmSoM либо каждым ядром. Проверьте SoC, схему, SDK/BSP, драйвер и pinmux. Команды, патчи, журналы и измерения взяты из исходника и не являются тестами ArmSoM.

По подтверждению пользователя все языки следуют китайскому V1.2.0: добавлены отсутствующие в EN V1.0.1 структуры V2, дамп RK3588, system heap и FAQ 5.9–5.18 с китайскими страницами источника. Для четырёх общих рисунков английская и русская версии используют английские оригиналы; два рисунка V2 взяты из китайского, поскольку английских нет. Старый английский текст использует && вместо китайского &; применён китайский вариант, оба зафиксированы в примечаниях.

| SoC исходника | Ядра по исходнику |
| --- | --- |
| ROCKCHIP | 4.4/4.19/5.10/6.1 |

IOMMU преобразует 32-битные виртуальные адреса в физические, содержит биты разрешения чтения/записи и формирует исключения отсутствия страницы и ошибки шины.

[Редакционные примечания](/docs/rockchip-iommu/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. Структура IOMMU

<!-- Source CN PDF p.4, unit 1 -->

Используется двухуровневая таблица страниц:

<!-- Source CN PDF p.4, unit 2 -->

![Двухуровневая таблица IOMMU — источник EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure1.png)

*Двухуровневая таблица IOMMU — источник EN PDF p.6.*

<!-- Source CN PDF p.4, unit 3 -->

![Поля 32-битного адреса IOMMU — источник EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure2.png)

*Поля 32-битного адреса IOMMU — источник EN PDF p.6.*

<!-- Source CN PDF p.4, unit 4 -->

32-битный адрес содержит 10-битное смещение в таблице первого уровня, 10-битное смещение второго уровня и 12-битное смещение внутри страницы.

<!-- Source CN PDF p.4, unit 5 -->

Структура DTE:

<!-- Source CN PDF p.4, unit 6 -->

![Структура DTE IOMMU V1 — источник EN PDF p.6](/docs/rockchip-iommu/assets/en-p06-figure3.png)

*Структура DTE IOMMU V1 — источник EN PDF p.6.*

<!-- Source CN PDF p.4, unit 7 -->

Структура DTE V2 (китайский исходник V1.2.0):

<!-- Source CN PDF p.4, unit 8 -->

![Структура DTE IOMMU V2 — источник CN PDF p.4](/docs/rockchip-iommu/assets/cn-p04-figure4.png)

*Структура DTE IOMMU V2 — источник CN PDF p.4.*

<!-- Source CN PDF p.4, unit 9 -->

bit0: наличие таблицы страниц следующего уровня.

<!-- Source CN PDF p.4, unit 10 -->

Структура PTE:

<!-- Source CN PDF p.5, unit 11 -->

![Структура и права PTE IOMMU V1 — источник EN PDF p.7](/docs/rockchip-iommu/assets/en-p07-figure1.png)

*Структура и права PTE IOMMU V1 — источник EN PDF p.7.*

<!-- Source CN PDF p.5, unit 12 -->

bit0: наличие физической страницы.

<!-- Source CN PDF p.5, unit 13 -->

bit1: разрешение чтения.

<!-- Source CN PDF p.5, unit 14 -->

bit2: разрешение записи.

<!-- Source CN PDF p.5, unit 15 -->

Структура PTE V2 (китайский исходник V1.2.0):

<!-- Source CN PDF p.5, unit 16 -->

![Структура PTE IOMMU V2 — источник CN PDF p.5](/docs/rockchip-iommu/assets/cn-p05-figure2.png)

*Структура PTE IOMMU V2 — источник CN PDF p.5.*

Предыдущий текст V1 указывает bit1=чтение и bit2=запись, но рисунок V2 подписывает bit2=read permission и bit1=write permission (bit0=page present). Расхождение версий сохранено по исходнику. Не переносите права V1 на V2 без проверки соответствующего драйвера/TRM; аппаратная проверка не проводилась.

<!-- Source CN PDF p.5, unit 17 -->

## 2. Драйвер IOMMU

<!-- Source CN PDF p.5, unit 18 -->

### 2.1 Файл драйвера

<!-- Source CN PDF p.5, unit 19 -->

Расположение файла драйвера:

<!-- Source CN PDF p.5, unit 20 -->

```text
drivers/iommu/rockchip-iommu.c
```

<!-- Source CN PDF p.5, unit 21 -->

### 2.2 Настройка узла DTS

<!-- Source CN PDF p.5, unit 22 -->

Описание настройки DTS находится в `Documentation/devicetree/bindings/iommu/rockchip,iommu.txt`. Основные параметры:

<!-- Source CN PDF p.5, unit 23 -->

`compatible = "rockchip,iommu";`

<!-- Source CN PDF p.5, unit 24 -->

`compatible = "rockchip,iommu-v2";` — V2, из китайского исходника V1.2.0.

<!-- Source CN PDF p.6, unit 25 -->

Исходник указывает общее значение compatible для IOMMU устройств и приводит `interrupts = <GIC_SPI 119 IRQ_TYPE_LEVEL_HIGH 0>;` для исключений, например page fault. Пример сохранён; проверьте его по binding конкретного DTS, учитывая два compatible для V1/V2 выше.

<!-- Source CN PDF p.6, unit 26 -->

`clocks = <&cru ACLK_VOP1>, <&cru HCLK_VOP1>;`

<!-- Source CN PDF p.6, unit 27 -->

`clock-names = "aclk", "hclk";` — IOMMU и master используют общие часы; записи позволяют драйверу IOMMU отдельно управлять ими.

<!-- Source CN PDF p.6, unit 28 -->

`power-domains = <&power RK3399_PD_VOPL>;` — позволяет драйверу IOMMU управлять доменом питания.

<!-- Source CN PDF p.6, unit 29 -->

`iommu-cells = <0>;` — исходник требует 0, см. iommu.txt. Написание без `#` сохранено как сомнительное место исходника.

<!-- Source CN PDF p.6, unit 30 -->

## 3. Использование IOMMU

<!-- Source CN PDF p.6, unit 31 -->

Драйвер Rockchip IOMMU зависит от инфраструктуры IOMMU:

<!-- Source CN PDF p.6, unit 32 -->

```text
drivers/iommu/iommu.c
```

<!-- Source CN PDF p.6, unit 33 -->

В основном он реализует обратные вызовы в:

<!-- Source CN PDF p.6, unit 34 -->

```text
struct iommu_ops rk_iommu_ops
```

<!-- Source CN PDF p.6, unit 35 -->

Master управляет IOMMU через API инфраструктуры:

<!-- Source CN PDF p.6, unit 36 -->

**1. iommu attach**

<!-- Source CN PDF p.6, unit 37 -->

```text
iommu_attach_device -> rk_iommu_attach_device /* enable iommu */
```

<!-- Source CN PDF p.6, unit 38 -->

**2. iommu detach**

<!-- Source CN PDF p.6, unit 39 -->

```text
iommu_detach_device -> rk_iommu_detach_device /* disable iommu */
```

<!-- Source CN PDF p.6, unit 40 -->

**3. iommu map**

<!-- Source CN PDF p.6, unit 41 -->

```text
iommu_map -> rk_iommu_map
```

<!-- Source CN PDF p.6, unit 42 -->

Создаёт таблицы страниц и соответствие виртуальных и физических адресов. Для отладки включите dbg-вывод внутри iommu_map и наблюдайте отображение.

<!-- Source CN PDF p.6, unit 43 -->

**4. iommu unmap**

<!-- Source CN PDF p.6, unit 44 -->

```text
iommu_unmap -> rk_iommu_unmap
```

<!-- Source CN PDF p.7, unit 45 -->

Удаляет отображения виртуальных адресов на физические и освобождает виртуальное пространство. Включите dbg внутри iommu_unmap для наблюдения.

<!-- Source CN PDF p.7, unit 46 -->

**5. domain alloc**

<!-- Source CN PDF p.7, unit 47 -->

```text
iommu_domain_alloc -> rk_iommu_domain_alloc
```

<!-- Source CN PDF p.7, unit 48 -->

Выделяет базовый адрес таблицы страниц для attach/detach.

<!-- Source CN PDF p.7, unit 49 -->

**6. domain free**

<!-- Source CN PDF p.7, unit 50 -->

```text
iommu_domain_free -> rk_iommu_domain_free
```

<!-- Source CN PDF p.7, unit 51 -->

Освобождает пространство таблиц страниц.

<!-- Source CN PDF p.7, unit 52 -->

**7. Дамп таблиц IOMMU. Для RK3399 vopl_iommu и виртуального адреса VA=0x00001000 выполните следующую последовательность. a. Получите базу первого уровня DT:**

<!-- Source CN PDF p.7, unit 53 -->

```text
io -4 0xff8f3f00
```

<!-- Source CN PDF p.7, unit 54 -->

b. Вычислите смещение первого уровня:

<!-- Source CN PDF p.7, unit 55 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.7, unit 56 -->

c. Вычислите физический адрес записи первого уровня DTE:

<!-- Source CN PDF p.7, unit 57 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.7, unit 58 -->

d. Получите базу второго уровня PT:

<!-- Source CN PDF p.7, unit 59 -->

```text
PT = io -4 DTE
```

<!-- Source CN PDF p.7, unit 60 -->

e. Вычислите смещение второго уровня:

<!-- Source CN PDF p.7, unit 61 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.7, unit 62 -->

f. Вычислите физический адрес записи второго уровня PTE:

<!-- Source CN PDF p.7, unit 63 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.7, unit 64 -->

g. Получите физический адрес страницы page:

<!-- Source CN PDF p.7, unit 65 -->

```text
page = io -4 PTE
```

<!-- Source CN PDF p.7, unit 66 -->

h. Вычислите адрес с внутристpаничным смещением offset:

<!-- Source CN PDF p.7, unit 67 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 68 -->

Исходник называет offset физическим адресом, соответствующим 0x00001000; master может проверить данные по нему. Китайский V1.2.0 добавляет следующую последовательность для RK3588 vop_mmu с VA=0x00001000. a. Получите базу первого уровня DT:

<!-- Source CN PDF p.8, unit 69 -->

```text
DT = io -4 0xfdd97e00
DT = ((DT & 0xf0) << 32) | ((DT & 0xf00) << 24) | (DT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 71 -->

b. Вычислите смещение первого уровня:

<!-- Source CN PDF p.8, unit 72 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.8, unit 73 -->

c. Вычислите физический адрес DTE:

<!-- Source CN PDF p.8, unit 74 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.8, unit 75 -->

d. Получите базу таблицы второго уровня PT:

<!-- Source CN PDF p.8, unit 76 -->

```text
PT = io -4 DTE
PT = ((PT & 0xf0) << 32) | ((PT & 0xf00) << 24) | (PT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 78 -->

e. Вычислите смещение второго уровня:

<!-- Source CN PDF p.8, unit 79 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.8, unit 80 -->

f. Вычислите физический адрес PTE:

<!-- Source CN PDF p.8, unit 81 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.8, unit 82 -->

g. Получите физический адрес страницы page:

<!-- Source CN PDF p.8, unit 83 -->

```text
page = io -4 PTE
page = ((page & 0xf0) << 32) | ((page & 0xf00) << 24) | (page & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 85 -->

h. Вычислите offset:

<!-- Source CN PDF p.8, unit 86 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 87 -->

Исходник называет offset физическим адресом, соответствующим VA=0x00001000; master может проверить данные. Формулы воспроизведены буквально и не проверялись на оборудовании.

<!-- Source CN PDF p.8, unit 88 -->

**8. dma-mapping. a. Для устройства без IOMMU:**

<!-- Source CN PDF p.9, unit 89 -->

```text
ARM32: dev->dma_ops = arm_dma_ops;
ARM64: dev->dma_ops = arm64_swiotlb_dma_ops;
```

<!-- Source CN PDF p.9, unit 90 -->

b. Для устройства с IOMMU:

<!-- Source CN PDF p.9, unit 91 -->

```text
ARM32: dev->dma_ops = iommu_ops;
ARM64: dev->dma_ops = iommu_dma_ops;
```

<!-- Source CN PDF p.9, unit 92 -->

На примере dma_alloc_attrs:

<!-- Source CN PDF p.9, unit 93 -->

**1. Для устройства без IOMMU alloc из dma_ops пункта (a) выделяет непрерывную физическую память и виртуальный адрес ядра.**

<!-- Source CN PDF p.9, unit 94 -->

**2. Для устройства с IOMMU alloc из dma_ops пункта (b) выделяет физическую память и через инфраструктуру вызывает iommu_map для создания таблиц и отображений. Возвращаются начальный виртуальный адрес IOMMU и виртуальный адрес ядра.**

<!-- Source CN PDF p.9, unit 95 -->

Минимальная последовательность использования IOMMU:

<!-- Source CN PDF p.9, unit 96 -->

```text
1. domain = iommu_domain_alloc(&platform_bus_type);
2. iommu_map(domain, iova, paddr, size, prot)；
3. iommu_attach_device(domain, dev)；
4. master启动访问iommu
```

<!-- Source CN PDF p.9, unit 97 -->

IOMMU — базовый компонент, который встраивается в распределители памяти, например ion/drm. Полная последовательность выделения и отображения буфера в ARM64 DRM:

<!-- Source CN PDF p.9, unit 98 -->

```text
rockchip_gem_alloc_buf ->
rockchip_gem_get_pages ->
rockchip_gem_iommu_map ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 99 -->

Отображение IOMMU при передаче fd:

<!-- Source CN PDF p.9, unit 100 -->

Путь DRM:

<!-- Source CN PDF p.9, unit 101 -->

```text
1. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> drm_gem_map_dma_buf ->
dma_map_sg_attrs -> map_sg ->
__iommu_map_sg_attrs ->
iommu_dma_map_sg ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 102 -->

Путь SYSTEM HEAP:

<!-- Source CN PDF p.10, unit 103 -->

```text
2. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> system_heap_map_dma_buf ->
dma_map_sgtable -> __dma_map_sg_attrs ->
map_sg -> iommu_dma_map_sg ->
iommu_map_sg_atomic ->
__iommu_map_sg ->
__iommu_map
```

<!-- Source CN PDF p.10, unit 104 -->

## 4. Конфигурация ядра

<!-- Source CN PDF p.10, unit 105 -->

```text
Symbol: ROCKCHIP_IOMMU [=y]
Type : boolean
Prompt: Rockchip IOMMU Support
    Location:
        -> Device Drivers
            -> IOMMU Hardware Support (IOMMU_SUPPORT [=y])
    Defined at drivers/iommu/Kconfig:211
    Depends on: IOMMU_SUPPORT [=y] && (ARM || ARM64 [=y]) && (ARCH_ROCKCHIP [=y] ||
                COMPILE_TEST [=n])
    Selects: IOMMU_API [=y] && ARM_DMA_USE_IOMMU
```

<!-- Source CN PDF p.10, unit 106 -->

## 5. Частые вопросы по IOMMU

<!-- Source CN PDF p.10, unit 107 -->

### 5.1 Прерывание page fault

<!-- Source CN PDF p.10, unit 108 -->

Page fault означает отсутствие отображения для текущего виртуального адреса. В master встречались три причины: доступ к уже unmapped-адресу, выход за границы и начало доступа до map.

<!-- Source CN PDF p.10, unit 109 -->

### 5.2 Ошибка iommu enable stall

<!-- Source CN PDF p.10, unit 110 -->

Возможно, IOMMU уже выдала page fault, но master продолжает доступ без обработки ошибки; проверьте журнал.

<!-- Source CN PDF p.10, unit 111 -->

Другая причина — неверное управление CLK. Для проверки временно оставьте PD и CLK включёнными.

<!-- Source CN PDF p.11, unit 112 -->

### 5.3 Недоступны регистры IOMMU

<!-- Source CN PDF p.11, unit 113 -->

Master может неправильно использовать pm_runtime_get_sync/pm_runtime_put_sync и обращаться к регистрам до включения домена питания IOMMU.

<!-- Source CN PDF p.11, unit 114 -->

### 5.4 Непрерывные прерывания IOMMU

<!-- Source CN PDF p.11, unit 115 -->

В DTS может быть указан неверный номер прерывания.

<!-- Source CN PDF p.11, unit 116 -->

Master может непрерывно обращаться к неотображённой IOVA; это часто наблюдается при сбоях дисплея.

<!-- Source CN PDF p.11, unit 117 -->

### 5.5 Мерцание при загрузке

<!-- Source CN PDF p.11, unit 118 -->

Включение IOMMU во время вывода VOP может нарушить выборку данных. На SoC без применения по границе кадра включайте IOMMU, когда VOP не выполняет выборку.

<!-- Source CN PDF p.11, unit 119 -->

### 5.6 Неверные значения регистров IOMMU

<!-- Source CN PDF p.11, unit 120 -->

Причиной может быть выход master за границы регистров IOMMU.

<!-- Source CN PDF p.11, unit 121 -->

Сброс всего IP master также сбрасывает IOMMU, встроенную в этот IP.

<!-- Source CN PDF p.11, unit 122 -->

После сброса master восстановите настройки регистров IOMMU.

<!-- Source CN PDF p.11, unit 123 -->

### 5.7 Интеграция IOMMU с device link

<!-- Source CN PDF p.11, unit 124 -->

Управление PD передаётся master; правильно используйте pm_runtime_get/pm_runtime_put.

<!-- Source CN PDF p.11, unit 125 -->

Вызов pm_runtime_get в master включает IOMMU.

<!-- Source CN PDF p.11, unit 126 -->

Вызов pm_runtime_put в master выключает IOMMU.

<!-- Source CN PDF p.11, unit 127 -->

### 5.8 Обслуживание таблиц страниц

<!-- Source CN PDF p.11, unit 128 -->

В ARM32 master, совместно использующие IOMMU, например vepu и vdpu, должны иметь отдельные таблицы и выполнять attach перед каждым доступом. В ARM64 таблицы общие, повторный attach не нужен.

<!-- Source CN PDF p.11, unit 129 -->

### 5.9 Сброс при высокой тактовой частоте

<!-- Source CN PDF p.11, unit 130 -->

При стресс-тесте перезагрузки RK3288 возможен VOP page fault. При разгоне VOP операция force reset IOMMU может завершиться некорректно. Исходный workaround — пропустить force reset при attach VOP IOMMU.

<!-- Source CN PDF p.12, unit 131 -->

### 5.10 Нельзя читать VOP IOMMU RK3128/RK3126

<!-- Source CN PDF p.12, unit 132 -->

Регистры VOP IOMMU этих SoC нельзя читать. Добавьте в DTS следующий workaround:

<!-- Source CN PDF p.12, unit 133 -->

```text
rockchip,skip-mmu-read
```

<!-- Source CN PDF p.12, unit 134 -->

Драйвер пропускает соответствующие чтения; флаг — iommu->skip_read.

<!-- Source CN PDF p.12, unit 135 -->

### 5.11 Операция reset

<!-- Source CN PDF p.12, unit 136 -->

После сброса ISP IOMMU регистр состояния может не подтверждать завершение, хотя сброс выполнен. Добавьте workaround в узел DTS ISP IOMMU:

<!-- Source CN PDF p.12, unit 137 -->

```text
rockchip,disable-mmu-reset
```

<!-- Source CN PDF p.12, unit 138 -->

Это отключает reset ISP IOMMU; флаг драйвера — iommu->reset_disabled.

<!-- Source CN PDF p.12, unit 139 -->

### 5.12 Выполнение команд записи

<!-- Source CN PDF p.12, unit 140 -->

Исходник указывает, что rkvenc IOMMU RK1126 и RV1109 может терять команды записи; рекомендуется повторять запись несколько раз. Написание RK1126 сохранено и требует проверки.

<!-- Source CN PDF p.12, unit 141 -->

### 5.13 Отключение автоматического attach VOP IOMMU

<!-- Source CN PDF p.12, unit 142 -->

Начиная с ядра 4.19 VOP сама выполняет attach IOMMU вместо автоматического attach при регистрации узла, чтобы избежать ошибок вывода при переходе от U-Boot к ядру.

<!-- Source CN PDF p.12, unit 143 -->

### 5.14 Потеря производительности при очистке IOMMU TLB

<!-- Source CN PDF p.12, unit 144 -->

Отображение требует очистки TLB. Фрагментированный буфер вызывает множество очисток и снижает производительность; флаг позволяет выполнить очистку только один раз.

<!-- Source CN PDF p.12, unit 145 -->

### 5.15 Отображение один-к-одному для VOP IOMMU

<!-- Source CN PDF p.12, unit 146 -->

Отображение один-к-одному позволяет избежать ошибок при ожидании применения кадра во время перехода U-Boot/ядро. Например, в RK356X master больше, чем IOMMU, и ожидание применения кадра недоступно; тождественное отображение обходит проблему.

<!-- Source CN PDF p.13, unit 147 -->

### 5.16 Один master и две IOMMU

<!-- Source CN PDF p.13, unit 148 -->

Если нет особых требований, настройте драйвер master так, чтобы обе IOMMU использовали одну таблицу страниц.

<!-- Source CN PDF p.13, unit 149 -->

Описанный в исходнике новый драйвер автоматически использует общую таблицу для нескольких IOMMU одного master; вмешательство драйвера master не требуется.

<!-- Source CN PDF p.13, unit 150 -->

### 5.17 Переключение H.264/H.265 на PX30

<!-- Source CN PDF p.13, unit 151 -->

Порядок переключения:

<!-- Source CN PDF p.13, unit 152 -->

1. Убедитесь, что все часы включены.
2. Убедитесь, что все PD включены.
3. Выключите все IOMMU.
4. Переключите GRF.
5. Включите текущую IOMMU.

<!-- Source CN PDF p.13, unit 157 -->

### 5.18 Ошибки одновременной работы VPU и HEVC RK3368

<!-- Source CN PDF p.13, unit 158 -->

VPU и HEVC RK3368 используют общую IOMMU TLB. Операции TLB и отображения должны быть сериализованы, иначе возможны сбои.

{% endraw %}
