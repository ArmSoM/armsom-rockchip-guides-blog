---
title: "Rockchip Trust: полное руководство по TrustZone, PSCI, защищённому миру и PANIC"
description: "Rockchip Trust: полное руководство по TrustZone, PSCI, защищённому миру и PANIC — V1.1.1"
excerpt: "Rockchip Trust: полное руководство по TrustZone, PSCI, защищённому миру и PANIC"
translation_key: 148-rockchip-trust
slug: 148-rockchip-trust
lang: ru
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, TrustZone, PSCI, OP-TEE]
---

{% raw %}

# Rockchip Trust: полное руководство по TrustZone, PSCI, защищённому миру и PANIC

Оба оригинала — V1.1.1. Область: RK3036/RK3126C/RK3288/RK322X/RK3368/RK3328/RK3399/PX30/RK3308; ядра 3.10, 4.4, 4.19. Только справочник ArmSoM: сверяйте плату, SoC, SDK/BSP, trust/ATF/OP-TEE и ядро; поддержка всех плат не заявляется. Китайская версия использует китайские рисунки, EN/RU/DE — английские. Журналы взяты из источника; аппаратных испытаний и изменения безопасности не было.

> Области памяти, адреса входа и журналы относятся к примерам источника; не переносите их без проверки на другой BSP. Адреса и регистры сохранены. Историческое описание бинарной поставки не распространяется на все современные платформы.

Техническое предисловие: источник рассматривает Trust как прошивку SDK Rockchip, объясняет её роль и сбор сведений о сбоях. Полный код описан как доступный части внутренних инженеров; при этом базовые функции RK322x/RK3328/RK3368/RK3399/PX30 явно указаны как открытые. Это исторические сведения оригинала, не гарантия текущей доступности. Сохранён полный технический документ, а не краткое изложение.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. ARM TrustZone

ARM TrustZone [1] — базовая возможность Cortex-A, введённая расширениями безопасности ARM. Они обеспечивают единообразную модель программирования для производителей, платформ и приложений с аппаратно защищённой средой. TrustZone — общесистемный подход к защите высокопроизводительных приложений, включая платежи, DRM, корпоративные и веб-сервисы. Он интегрирован с Cortex-A и расширяется через AMBA AXI и специальные IP-блоки TrustZone, обеспечивая аппаратную защиту. Так защищаются память, криптоблоки, клавиатуры и экраны от программных атак. Распространённые открытые реализации — ARM Trusted Firmware и OP-TEE OS [2], низкоуровневые прошивки ARM, используемые совместно или отдельно.

### 1.1 Архитектура системы

Следующая 64-битная архитектура использует ARM TrustZone. Слева расположен незащищённый мир, справа — защищённый. Защищённый мир имеет доступ к ресурсам обоих; незащищённый — только к своим. Попытка доступа к защищённым ресурсам из незащищённого мира вызывает аппаратную ошибку шины или другое исключение, не предоставляя ресурс. ARM Trusted Firmware связывает миры. Для входа в защищённый мир CPU сначала выполняет SMC и входит в ARM Trusted Firmware; код Secure Monitor переключает его статус на защищённый, после чего выполняется переход. Обратный переход аналогичен. Это аппаратная смена статуса. Rockchip Trust объединяет ARM Trusted Firmware и OP-TEE OS, реализуя необходимые защищённые функции и Secure Monitor — основу переключения миров.

![Схема TrustZone из английского оригинала](/docs/rockchip-trust/assets/en-p006-figure-01.png)

*Схема TrustZone из английского оригинала*

![Схема TrustZone из английского оригинала](/docs/rockchip-trust/assets/en-p006-figure-02.png)

*Схема TrustZone из английского оригинала*

### 1.2 Уровни привилегий CPU

Диаграмма показывает режимы привилегий CPU с TrustZone. В 64-битном CPU есть EL0, EL1, EL2 и EL3; EL0/EL1 бывают защищёнными или незащищёнными в зависимости от мира. В 32-битном CPU есть Mon, Hyp, SVC, ABT, IRQ, FIQ, UND, SYS и USER; SVC, ABT, IRQ, FIQ, UND, SYS и USER также имеют защищённый и незащищённый варианты. Rockchip Trust можно понимать как EL3 плюс защищённый EL1.

![Схема TrustZone из английского оригинала](/docs/rockchip-trust/assets/en-p007-figure-01.png)

*Схема TrustZone из английского оригинала*

![Схема TrustZone из английского оригинала](/docs/rockchip-trust/assets/en-p007-figure-02.png)

*Схема TrustZone из английского оригинала*

## 2. Trust на платформах Rockchip

### 2.1 Реализация

Описанные 64-битные SoC Rockchip используют ARM Trusted Firmware вместе с OP-TEE OS; 32-битные — OP-TEE OS.

### 2.2 Последовательность загрузки

ARM Trusted Firmware описывает EL0, EL1, EL2, EL3 и этапы загрузки BL1, BL2, BL31, BL32, BL33. Его исходники реализуют BL1, BL2 и BL31. Rockchip использует только BL31, а BL1/BL2 реализует самостоятельно. Поэтому ARM Trusted Firmware на Rockchip обычно означает BL31; BL32 — OP-TEE OS. Соответствие: Maskrom (BL1), Loader (BL2), Trust (BL31: ARM Trusted Firmware + BL32: OP-TEE OS), U-Boot (BL33). Порядок загрузки Android:

```text
Maskrom -> Loader -> Trust -> U-Boot -> kernel -> Android
```

![Схема TrustZone из английского оригинала](/docs/rockchip-trust/assets/en-p008-figure-01.png)

*Схема TrustZone из английского оригинала*

### 2.3 Получение прошивки

Источник описывает поставку бинарных файлов без полного исходного кода. Файлы Trust находятся в проекте U-Boot:

```text
./tools/rk_tools/bin/rk30/
./tools/rk_tools/bin/rk31/
./tools/rk_tools/bin/rk32/
./tools/rk_tools/bin/rk33/
```

При сборке uboot.img платформы одновременно создаётся trust.img в корне U-Boot. Для упаковки trust.img бинарные файлы выбираются через ini-файл. Эти ini-файлы находятся в U-Boot:

```text
tools/rk_tools/RKTRUST/
```

Также можно загрузить отдельный репозиторий rkbin с bin-файлами платформ.

### 2.4 Включение через DTS

#### 2.4.1 Ядро 3.10

##### 2.4.1.1 32-битные платформы

(1) Добавьте узел psci:

```text
psci {
    compatible      = "arm,psci";
    method          = "smc";
    cpu_suspend     = <0x84000001>;
    cpu_off         = <0x84000002>;
    cpu_on          = <0x84000003>;
    affinity_info   = <0x84000004>;
};
```

(2) Добавьте psci=enable в chosen или parameter.

```text
chosen {
    bootargs = "psci=enable vmalloc=496M cma=4M rockchip_jtag";
};
```

##### 2.4.1.2 64-битные платформы

(1) Добавьте узел psci:

```text
psci {
        compatible = "arm,psci-0.2";
        method = "smc";
};
```

(2) Добавьте enable-method = "psci"; в узел cpu.

```text
cpus {
        #address-cells = <2>;
        #size-cells = <0>;

        cpu@0 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x0>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@1 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x1>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@2 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x2>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@3 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x3>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };

        .....
};
```

#### 2.4.2 Ядро 4.4+

##### 2.4.2.1 32-битные платформы

Добавьте узел psci:

```text
psci {
        compatible = "arm,psci-1.0";
        method = "smc";
};
```

##### 2.4.2.2 64-битные платформы

(1) Добавьте узел psci:

```text
psci {
        compatible = "arm,psci-1.0";
        method = "smc";
};
```

(2) Добавьте enable-method = "psci"; в узел cpu.

```text
cpus {
        #address-cells = <2>;
        #size-cells = <0>;

        cpu@0 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x0>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@1 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x1>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@2 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x2>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@3 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x3>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };

        .....
};
```

#### 2.4.3 Документация ядра

Документация ядра объясняет PSCI здесь:

```text
./Documentation/devicetree/bindings/arm/psci.txt
```

### 2.5 Память выполнения и жизненный цикл

#### 2.5.1 Память выполнения

ARM Trusted Firmware работает по смещениям DRAM 0M–2M, адрес входа — 0x10000 (64KB). OP-TEE OS занимает смещения 132M–148M; конечный адрес зависит от платформы, адрес входа — 0x08400000 (132M).

#### 2.5.2 Жизненный цикл

После инициализации при включении Trust постоянно остаётся в памяти и выполняет свои функции.

### 2.6 Security

При TrustZone прошивки распределены между мирами. На Rockchip Loader и Trust работают в защищённом мире; U-Boot, ядро и Android — в незащищённом, кроме защищённых драйверов и приложений.

### 2.7 Функции

#### 2.7.1 PSCI(Power State Coordination Interface)

Проекты SoC существенно различаются, особенно управлением питанием CPU. Последовательности производителей фрагментируют код ядра и затрудняют унификацию. Обычным разработчикам редко нужны детали, тесно связанные с архитектурой CPU и схемой IC и сложные для полного понимания или реализации. Поэтому ядро предпочитает переносить управление питанием CPU в прошивку производителя, оставляя себе политику управления и унифицируя код. Для этого введён PSCI (Power State Coordination Interface) [3]. Интерфейсы управления ядрами CPU используют инструкции ARM SMC для входа в Trust и включения/отключения CPU, глубокого сна, сброса, выключения системы и других операций. Основные интерфейсы:

```text
PSCI_VERSION
PSCI_FEATURES
CPU_ON
CPU_OFF
CPU_SUSPEND
SYSTEM_SUSPEND
AFFINITY_INFO
SYSTEM_OFF
SYSTEM_RESET
......
```

Пути кода ядра 4.4+

```text
./arch/arm/kvm/psci.c
./arch/arm/kernel/smccc-call.S
./arch/arm64/kernel/psci.c
./arch/arm64/kernel/smccc-call.S
./drivers/firmware/psci.c
./drivers/firmware/rockchip_sip.c
```

Пути кода ядра 3.10

```text
./arch/arm/kernel/psci.c
./arch/arm64/kernel/psci.c
./arch/arm/mach-rockchip/psci.c
```

#### 2.7.2 Secure Monitor

Secure Monitor обеспечивает смену состояния CPU между защищённым и незащищённым мирами. Он реализован в Trust; без него смена состояния невозможна и TrustZone теряет смысл. Вход выполняется инструкцией SMC. Руководство ARM поясняет: исключение Secure Monitor Call реализовано только в расширениях безопасности; SMC запрашивает функцию Secure Monitor и переводит процессор в Monitor mode.

#### 2.7.3 Настройка безопасности

Помимо интеграции с Cortex-A, TrustZone расширяется через AMBA AXI и специальные IP-блоки. Поэтому необходимо настроить безопасность связанных модулей, обычно в Trust.

#### 2.7.4 Защита данных

Защита данных включает защиту хранения сведений безопасных платежей, DRM, корпоративных и веб-сервисов.

## 3. Диагностика Rockchip Trust

Источник описывает публичную поставку Trust только бинарными файлами. Возможности отладки ограничены и часто требуют специальных JTAG-инструментов. Обычный пользователь обычно не может самостоятельно устранить ошибку Trust; сохраните состояние сбоя и соберите достаточно сведений для сопровождающего Trust. Нужно уметь распознавать сообщения, версии и PANIC.

### 3.1 Пример журнала загрузки

```text
NOTICE:  BL31: v1.3(debug):4c793da
NOTICE:  BL31: Built : 18:13:44, Dec 25 2017
NOTICE:  BL31:Rockchip release version: v1.3
INFO:    ARM GICv2 driver initialized
INFO:    Using opteed sec cpu_context!
INFO:    boot cpu mask: 1
INFO:    plat_rockchip_pmu_init: pd status 0xe
INFO:    BL31: Initializing runtime services
INFO:    BL31: Initializing BL32
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-127-g27532f4 #54
Mon Dec 18 02:01:14 UTC 2017 aarch64)
INF [0x0] TEE-CORE:init_primary_helper:338: Release version: 1.4
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

### 3.2 Распознавание сообщений

Помимо загрузочного журнала, ARM Trusted Firmware обычно использует такой формат без временных меток:

```text
INFO: *********
```

Формат OP-TEE OS без временных меток:

```text
INF [0x0] TEE-CORE: *********
```

### 3.3 Определение версии прошивки

Версия ARM Trusted Firmware: 4c793da.

```text
NOTICE:  BL31: v1.3(debug):4c793da
```

Версия OP-TEE OS: 27532f4 (начальный g не учитывается).

```text
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-127-g27532f4 #54
Mon Dec 18 02:01:14 UTC 2017 aarch64)
```

### 3.4 Распознавание PANIC

#### 3.4.1 Panic ARM Trusted Firmware

```text
Unhandled Exception in EL3.
x30 =           0x00000000ff00fff0
x0 =            0x00000000000101c0
x1 =            0x0000000000000000
x2 =            0x0000000000000000
x3 =            0x0000000000000000
x4 =            0x0000000000cd383b
x5 =            0x0000000000080001
x6 =            0x0000000080803520
x7 =            0x00000000000342a0
x8 =            0x00000000000101c0
x9 =            0x0000000000000000
x10 =           0x0000000000000000
x11 =           0x0000000000000000
x12 =           0x0000000000000001
x13 =           0x00000000000101b8
x14 =           0x000000000001a950
x15 =           0x0000000000000000
x16 =           0x00000000000101c0
x17 =           0x0000000000000000
x18 =           0x0000000000000000
x19 =           0x0000000000000000
x20 =           0x0000000040000000
x21 =           0x0000000000000040
x22 =           0x00000000000305b0
x23 =           0x000000000001016c
x24 =           0x00000000000101c0
x25 =           0x0000000000000000
x26 =           0x0000000000000000
x27 =           0x0000000000000000
x28 =           0x0000000000035bf8
x29 =           0x0000000000000000
scr_el3 =       0x00000000000101c0
sctlr_el3 =     0x0000000000000000
cptr_el3 =      0x0000000000000000
tcr_el3 =       0x0000000000000000
daif =          0x0000000000000238
mair_el3 =      0x0000000000cd383b
spsr_el3 =      0x0000000000000000
elr_el3 =       0x0000000080803520
ttbr0_el3 =     0x00000000000101c0
esr_el3 =       0x0000000000000000
far_el3 =       0x0000000000000000
spsr_el1 =      0x00000000000101c0
elr_el1 =       0x0000000000000000
spsr_abt =      0x0000000000000000
......
```

#### 3.4.2 Panic OP-TEE OS

```text
core data-abort at address 0xc121b16c

 fsr 0x00000805  ttbr0 0x6847446a  ttbr1 0x6847006a  cidr 0x2
 cpu #0          cpsr 0x200001d1
 r0 0x20068000      r4 0x68407195    r8 0x00000000   r12 0x00000000
 r1 0x00000049      r5 0x6848068b    r9 0x6840a3bd    sp 0xc121b1a4
 r2 0x6848068c      r6 0x6848068c   r10 0x684808cc    lr 0x684296a6
 r3 0x0000001f      r7 0x00000001   r11 0x68404f9d    pc 0x6840041c

ERR [0x0] TEE-CORE:tee_pager_handle_fault:125: Unexpected page fault! Trap CPU
PANIC: tee_pager_handle_fault core/arch/arm/include/mm/tee_pager.h:126
```

## 4. Приложение: источники

[0] Открытые исходники:

ARM Trusted Firmware:https://github.com/ARM-software/arm-trusted-firmware

OP-TEE OS:https://github.com/OP-TEE/optee_os

[1] ARM TrustZone:

https://www.arm.com/products/security-on-arm/trustzone

https://developer.arm.com/technologies/trustzone

[2] Сайт OP-TEE: https://www.op-tee.org/

[3] PSCI:http://infocenter.arm.com/help/topic/com.arm.doc.den0022c/DEN0022C_Power_State_Coordination_Interface.pdf "Power State Coordination Interface PDD (ARM DEN 0022C)"

{% endraw %}
