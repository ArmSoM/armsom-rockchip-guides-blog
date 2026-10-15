# ArmSoM Rockchip AMP: полное руководство разработчика

Руководство предназначено для адаптации AMP на ArmSoM с соответствующими SoC Rockchip: Sige7 / AIM7 (RK3588), Sige5 / CM5 / AIM5 (RK3576). Нужны согласованные AMP SDK, U-Boot, ядро Linux, Device Tree и проекты RT-Thread / RK HAL. Настройте их по схеме платы, реальной организации DDR и распределению периферии. Сохранены все 11 глав, примеры конфигурации, исходные результаты тестов и иллюстрации. Приведённые измерения принадлежат руководству Rockchip и не являются тестами ArmSoM.

Редакционная заметка: техническая основа — обновлённый китайский документ; английский текст сверяется с официальной версией того же выпуска. Таблицы и отступы кода восстановлены. Таблицы поддержки RK3588 в предисловии и 1.2.1 расходятся по 32/64 битам; исходные значения сохранены. Смещения MCU и соответствие GPIO0 / GPIO1_IRQn проверяйте по BSP/TRM. Аппаратные константы не заменялись предположениями. Исправления перечислены в EDITORIAL-NOTES.md.

[中文](README.zh-CN.md) | [English](README.md) | [Русский](README.ru.md)

[Sige7](https://docs.armsom.org/armsom-sige7) · [Sige5](https://docs.armsom.org/armsom-sige5) · [CM5](https://docs.armsom.org/armsom-cm5) · [AIM7](https://docs.armsom.org/armsom-aim7) · [AIM5](https://docs.armsom.org/armsom-aim5)

### Руководство разработчика Rockchip AMP

ID: RK-KF-YF-160

Версия: V1.2.0

Предисловие

Обзор

Документ помогает инженерам разрабатывать проекты на основе гетерогенной многоядерной системы Rockchip AMP.

Поддерживаемые платформы

| Модель SoC | Процессорное ядро | Linux | RTOS | Bare-metal |
| --- | --- | --- | --- | --- |
| RK3588 | 4 x ARM Cortex-A76 | Kernel 5.10 | N/A | N/A |
| RK3588 | 4 x ARM Cortex-A55 | Kernel 5.10 | RTT 3.1-32 RTT 4.1-64 | HAL-32 HAL-64 |
| RK3588 | 1 x ARM Cortex-M0 | N/A | RTT 3.1 RTT 4.1 | HAL |
| RK3576 | 4 x ARM Cortex-A72 | Kernel 6.1 | N/A | N/A |
| RK3576 | 4 x ARM Cortex-A53 | Kernel 6.1 | RTT 4.1-32 | HAL-32 |
| RK3576 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3568 | 4 x ARM Cortex-A55 | Kernel 4.19 Kernel 5.10 | RTT 3.1-32 | HAL-32 |
| RK3568 | 1 x RISC-V | N/A | RTT 3.1 | HAL |
| RK3562 | 4 x ARM Cortex-A53 | Kernel 5.10 | RTT 4.1-32 | HAL-32 |
| RK3562 | 1 x ARM Cortex-M0 | N/A | RTT 4.1 | HAL |
| RK3358 | 4 x ARM Cortex-A35 | N/A | RTT 3.1-32 | HAL-32 |
| RK3308 | 4 x ARM Cortex-A35 | Kernel 5.10 | RTT 3.1-32 RTT 4.1-32 | HAL-32 |

## 1. Гетерогенные многоядерные системы

### 1.1 Обзор

#### 1.1.1 Введение в гетерогенные многоядерные системы

Многопроцессорная гетерогенная система позволяет независимо запускать разные программные платформы на разных ядрах одного SoC. Она поддерживает как симметричную многопроцессорную обработку SMP, так и асимметричную обработку AMP.

Такая архитектура объединяет две традиционно раздельные системы. Обычно Linux и система реального времени требуют двух процессоров и двух комплектов периферийных цепей. При грамотном распределении ядер, периферии и других ресурсов обе системы могут независимо работать на одном SoC, сохраняя богатые функции Linux и возможности периферии вместе с требованиями реального времени.

![Иллюстрация из руководства Rockchip AMP: 1.1.1 Введение в гетерогенные многоядерные системы — 9](assets/en-p009-fig01.png)

На одном SoC можно также независимо запускать несколько систем реального времени одновременно.

![Иллюстрация из руководства Rockchip AMP: 1.1.1 Введение в гетерогенные многоядерные системы — 10](assets/en-p010-fig01.png)

Допускается сочетание SMP + AMP в пределах одного SoC.

![Иллюстрация из руководства Rockchip AMP: 1.1.1 Введение в гетерогенные многоядерные системы — 10](assets/en-p010-fig02.png)

При проектировании изделий такая архитектура даёт преимущества по стоимости и габаритам. Она применяется в энергетике, промышленной автоматизации, потребительской и автомобильной электронике.

#### 1.1.2 Гетерогенная система Rockchip

Rockchip предлагает универсальное решение, дополняющее существующий SMP поддержкой AMP. Настоящее руководство описывает прежде всего загрузку AMP и межъядерную связь; подробности реализации приведены в соответствующих разделах.

Для Linux предоставляется стандартное ядро Linux, для RTOS — открытая RT-Thread, для bare metal — библиотека на основе аппаратного уровня абстракции RK HAL. Разработчик может адаптировать и другую платформу, например собственную RTOS поверх RK HAL.

![Иллюстрация из руководства Rockchip AMP: 1.1.2 Гетерогенная система Rockchip — 11](assets/en-p011-fig01.png)

Решение поддерживает независимую работу каждого однородного ядра ARM Cortex-A, а также гетерогенных ядер Cortex-M или RISC-V. Рациональное распределение задач между подходящими ядрами помогает использовать вычислительные ресурсы и энергию SoC эффективнее.

![Иллюстрация из руководства Rockchip AMP: 1.1.2 Гетерогенная система Rockchip — 11](assets/en-p011-fig02.png)

Основной вариант, описанный в руководстве, — AMP без гипервизора. Отсутствие управления виртуализацией позволяет сократить задержку обработки прерываний в системе реального времени для приложений энергетики и промышленной автоматизации с жёсткими временными требованиями.

В руководстве виртуализация описана как будущая опция: стандартный OpenAMP на базе RPMsg и RemoteProc, гипервизор первого типа Jailhouse для промышленности и аппаратная изоляция ресурсов в последующих SoC. Это планы из документа, а не подтверждение наличия этих функций в текущем BSP.

### 1.2 Поддерживаемые платформы

#### 1.2.1 RK3588

##### 1.2.1.1 Процессорные ядра

| Тип процессора | Процессорные ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A76 + 4 x ARM Cortex-A55 |
| MCU | 1 x ARM Cortex-M0 |

##### 1.2.1.2 Поддержка программных платформ

| Процессорные ядра | ARM Cortex-A76 | ARM Cortex-A55 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Поддержка Linux | Kernel 5.10 | Kernel 5.10 | N/A |
| Поддержка RTOS | N/A | RT-Thread 3.1-32 RT-Thread 4.1-32 | RT-Thread 3.1 RT-Thread 4.1 |
| Поддержка bare metal | N/A | HAL-32 | HAL |

#### 1.2.2 RK3576

##### 1.2.2.1 Процессорные ядра

```text
Processor Cores
```

| Тип процессора | Процессорные ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A72 + 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

```text
1 x ARM Cortex-M0
```

##### 1.2.2.2 Поддержка программных платформ

| Процессорное ядро | ARM Cortex-A72 | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- | --- |
| Поддержка Linux | Kernel 6.1 | Kernel 6.1 | N/A |
| Поддержка RTOS | N/A | RTT 4.1-32 | RTT 4.1 |
| Поддержка bare metal | N/A | HAL-32 | HAL |

#### 1.2.3 RK3568

##### 1.2.3.1 Процессорные ядра

| Тип процессора | Конфигурация ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A55 |
| MCU | 1 x RISC-V |

##### 1.2.3.2 Поддержка программных платформ

```text
Processor Cores
```

| Процессорные ядра | ARM Cortex-A55 | RISC-V |
| --- | --- | --- |
| Поддержка Linux | Kernel 4.19 Kernel 5.10 | N/A |
| Поддержка RTOS | RTT 3.1-32 | RTT 3.1 |
| Поддержка bare metal | HAL-32 | HAL |

#### 1.2.4 RK3562

##### 1.2.4.1 Процессорные ядра

```text
Processor Type
```

| Тип процессора | Процессорные ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A53 |
| MCU | 1 x ARM Cortex-M0 |

```text
MCU
```

##### 1.2.4.2 Поддерживаемые программные платформы

| Процессорные ядра | ARM Cortex-A53 | ARM Cortex-M0 |
| --- | --- | --- |
| Поддержка Linux | Kernel 5.10 | N/A |
| Поддержка RTOS | RTT 4.1-32 | RTT 4.1 |
| Поддержка bare metal | HAL-32 | HAL |

#### 1.2.5 RK3358

##### 1.2.5.1 Процессорное ядро

| Тип процессора | Процессорные ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.5.2 Поддержка программных платформ

| Процессорные ядра | ARM Cortex-A35 |
| --- | --- |
| Поддержка Linux | N/A |
| Поддержка RTOS | RTT 3.1-32 |
| Поддержка bare metal | HAL-32 |

#### 1.2.6 RK3308

##### 1.2.6.1 Процессорные ядра

| Тип процессора | Процессорные ядра |
| --- | --- |
| AP | 4 x ARM Cortex-A35 |

##### 1.2.6.2 Поддерживаемые программные платформы

| Процессорное ядро | ARM Cortex-A35 |
| --- | --- |
| Поддержка Linux | Kernel 5.10 |
| Поддержка RTOS | RTT 3.1-32 RTT 4.1-32 |
| Поддержка bare metal | HAL-32 |

### 1.3 Примеры применения

#### 1.3.1 AP + AP: устройство релейной защиты

Устройство релейной защиты должно в реальном времени измерять электрические величины, анализировать данные и реагировать на управляющие сигналы. Одновременно ему нужны дисплей, USB, Ethernet и сложные программные функции. Решение Rockchip позволяет объединить две системы на одной плате, независимо запустив Linux и систему реального времени.

![Иллюстрация из руководства Rockchip AMP: 1.3.1 AP + AP: устройство релейной защиты — 15](assets/en-p015-fig01.png)

Производительность AP полезна и для вычислительно сложных задач системы реального времени.

#### 1.3.2 AP + MCU: робот-пылесос

Роботу-пылесосу нужен Linux для Wi-Fi, камеры, звука, подключения к сети, хранения карт и алгоритмов. PWM, SPI, UART, ADC и GPIO обслуживают восприятие среды, движение и контроль состояния в системе реального времени. Использование гетерогенной системы Rockchip позволяет выполнять обе роли на одном SoC без внешнего MCU.

![Иллюстрация из руководства Rockchip AMP: 1.3.2 AP + MCU: робот-пылесос — 16](assets/en-p016-fig01.png)

Встроенный MCU как процессор реального времени или сопроцессор также освобождает ресурсы Linux для его основных задач.

## 2. AMP SDK

### 2.1 Структура каталогов

Ниже показана структура исходного кода AMP SDK. Звёздочкой отмечены основные каталоги SDK.

```text
.
├── app        # Linux system user interface example
├── buildroot  # Buildroot system compilation directory
├── debian     # Debian system compilation directory
├── device     # * AMP SDK compilation scripts and configuration files
├── docs       # * AMP SDK documentation
├── external   # Supplementary applications for Buildroot system
├── hal        # * Bare-metal system compilation directory
├── kernel-*   # * Compilation directories for different versions of the Linux Kernel
├── prebuilts  # * Pre-installed compilation toolchains
├── rkbin      # * Binary files used by the AMP SDK
├── rtos       # * RTOS system compilation directory
├── tools      # Tool set used by the AMP SDK
├── u-boot     # * U-Boot compilation directory
├── uefi       # UEFI compilation directory
└── yocto      # Yocto system compilation directory
```

### 2.2 Каталог device

Каталог device содержит сценарии сборки и конфигурации по умолчанию. Основные файлы для RK3562 показаны ниже.

```text
device/rockchip
├── common
│   ├── build.sh                       # Common compilation script for AMP SDK
│   └── scripts
│       └── mk-amp.sh                  # Common compilation script for RTOS / Bare-metal
└── rk3562
    ├── amp.its                        # Firmware packaging configuration file for RTOS + Bare-metal
    ├── amp_linux.its                  # Firmware packaging configuration file for Linux +
RTOS / Bare-metal
    ├── amp_mcu.its                    # Firmware packaging configuration file for Linux +
RTOS / Bare-metal MCU
    └── rockchip_rk3562_xxx_defconfig  # Board-level compilation configuration file
```

Связанные разделы:

Глава 3: Конфигурация сборки

### 2.3 Каталог kernel

Каталог kernel содержит исходный код Linux. AMP SDK предоставляет стандартное ядро Linux.

Поддержка платформ SoC приведена в таблице.

| SOC | Kernel 4.19 | Kernel 5.10 | Kernel 6.1 |
| --- | --- | --- | --- |
| RK3588 |  | ✔ |  |
| RK3576 |  |  | ✔ |
| RK3568 | ✔ | ✔ |  |
| RK3562 |  | ✔ |  |
| RK3308 |  | ✔ |  |

Основные файлы для RK3562:

```text
kernel
├── arch/arm64/boot/dts/rockchip
│   ├── rk3562-amp.dtsi                # AMP dtsi file
│   └── rk3562-xxx-amp.dts             # AMP dts board-level configuration file
├── drivers
│   ├── mailbox                        # Mailbox inter-core communication solution
│   ├── rpmsg                          # RPMsg inter-core communication solution
│   ├── soc/rockchip
│   │   └── rockchip_amp.c             # Resource partitioning, lifecycle management of the
slave core, etc.
└── include
```

В конфигурации Linux + RTOS / bare metal ядро с Linux обязательно выступает ведущим (Master Core). Оно распределяет ресурсы всей системы и управляет удалённым ядром (Remote Core).

Связанные разделы:

Глава 3: Конфигурация сборки

Глава 4: Распределение ресурсов

Глава 5: Схемы загрузки

Глава 6: Межъядерная связь

### 2.4 Каталог hal

Каталог hal содержит исходный код bare-metal системы. SDK предоставляет библиотеку разработки на основе RK HAL.

RK HAL — аппаратный уровень абстракции на основе ARM CMSIS (Cortex Microcontroller Software Interface Standard). Его можно использовать непосредственно для bare-metal разработки либо для адаптации выбранной RTOS.

Поддержка платформ SoC приведена в таблице.

| SOC | AP HAL-32 | MCU HAL |
| --- | --- | --- |
| RK3588 | ✔ | ✔ |
| RK3576 | ✔ | ✔ |
| RK3568 | ✔ | ✔ |
| RK3562 | ✔ | ✔ |
| RK3358 | ✔ | N/A |
| RK3308 | ✔ | N/A |

Основные файлы для RK3562:

```text
├── doc
│   └── Rockchip_User_Guide_HAL_CN.md    # RK HAL Development Documentation
├── lib
│   ├── bsp                              # Board Support Package
│   ├── CMSIS                            # ARM Microcontroller Software Interface Standard Library
│   ├── Core                             # MCU Related Files
│   ├── Core_A                           # AP 32-bit Related Files
│   ├── Core_A_64                        # AP 64-bit Related Files
│   ├── Device/RK3562
│   │   ├── Include
│   │   │   ├── rk3562.h                 # RK3562 Register Definition
│   │   │   ├── soc.h                    # RK3562 SOC Related Definition
│   │   │   └── system_rk3562.h
│   │   └── Source/Templates
│   │       ├── GCC                      # Using GCC Cross-Compilation Toolchain
│   │       │   ├── gcc_arm.ld           # Linker Script Example
│   │       │   ├── start_m0.S           # MCU Startup File
│   │       │   └── startup_rk3562.c     # AP Startup File
│   │       ├── mmu_rk3562.c             # AP MMU Map Configuration File
│   │       ├── system_rk3562.c
│   │       └── system_rk3562_mcu.c
│   ├── DSP                              # DSP Related Files
│   └── RISCV                            # RISC-V Related Files
│   └── hal
│       ├── inc                          # Module Driver Header Files
│       └── src                          # Module Driver Files
├── middleware                           # Bare-metal System Middleware
│   ├── benchmark                        # Performance Testing
│   ├── rpmsg-lite                       # RPMsg Inter-Processor Communication Solution
│   └── simple_console                   # Console
├── project                              # Bare-metal System Project Examples
│   ├── common
│   │   └── GCC
│   │       ├── Cortex-A.mk              # AP Common Compilation File
│   │       ├── Cortex-M.mk              # MCU Common Compilation File
│   │       └── riscv.mk                 # RISC-V Common Compilation File
│   ├── rk3562
│   │   ├── GCC
│   │   │   ├── build.sh                 # AP Compilation Script
│   │   │   ├── gcc_arm.ld.S             # AP Linker Script
│   │   │   └── Makefile                 # AP Compilation File
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged Bare-metal System Firmware
│   │   │   ├── amp.its                  # RTOS + Bare-metal Firmware Packaging Configuration File
│   │   │   ├── amp_linux.its            # Linux + RTOS / Bare-metal Firmware Packaging Configuration File
│   │   │   ├── halx.bin
│   │   │   ├── halx.elf
│   │   │   └── parameter.txt            # Partition Table Configuration File
│   │   ├── mkimage.sh                   # AP Firmware Packaging Script
│   │   └── src
│   │       ├── hal_conf.h               # RK HAL Configuration File
│   │       ├── main.c                   # Bare-metal System Example
│   │       └── test_demo.c              # Bare-metal System Module and Function Example
│   └── rk3562-mcu
│       ├── GCC
│       │   ├── gcc_bus_m0.ld            # MCU Linker Script
│       │   └── Makefile                 # MCU Compilation File
│       ├── Image
│       │   ├── amp.img                  # Packaged Bare-metal System Firmware
│       │   ├── amp_mcu.its              # Linux + RTOS / Bare-metal MCU Firmware Packaging Configuration File
│       │   ├── mcu.bin
│       │   ├── mcu.elf
│       │   └── parameter.txt            # Partition Table Configuration File
│       ├── mkimage.sh                   # MCU Firmware Packaging Script
│       └── src
│           ├── hal_conf.h               # RK HAL Configuration File
│           ├── main.c                   # Bare-metal System Example
│           └── test_demo.c              # Bare-metal System Module and Function Example
├── test                                 # Bare-metal System Module Test Files
└── tools                                # Bare-metal System Tool Set
```

Связанные разделы:

Глава 3: Конфигурация сборки

Глава 4: Распределение ресурсов

Глава 5: Схемы загрузки

Глава 6: Межъядерная связь

### 2.5 Каталог rtos

Каталог rtos содержит исходный код системы RTOS. SDK предоставляет открытую RT-Thread.

RT-Thread — зрелая открытая RTOS, разработанная в Китае. Платформа объединяет ядро операционной системы реального времени, компоненты промежуточного ПО и сообщество разработчиков. Техническое руководство доступно в RT-Thread Documentation Center.

Версия RT-Thread в решении Rockchip адаптирована на базе RK HAL. Файлы HAL находятся в bsp/rockchip/common/hal/lib, а драйверы RTOS — в bsp/rockchip/common/drivers.

Поддержка платформ SoC приведена в таблице.

| SOC | AP RTT 3.1-32 | AP RTT 4.1-32 | AP RTT 4.1-64 | MCU RTT 3.1 | MCU RTT 4.1 |
| --- | --- | --- | --- | --- | --- |
| RK3588 | ✔ |  | ✔ | ✔ | ✔ |
| RK3576 |  |  | ✔ |  | ✔ |
| RK3568 | ✔ |  |  | ✔ |  |
| RK3562 |  | ✔ |  |  | ✔ |
| RK3358 | ✔ |  |  | N/A | N/A |
| RK3308 | ✔ | ✔ |  | N/A | N/A |

Основные файлы RT-Thread V4.1 для RK3562:

```text
├── applications                         # Common application files
├── bsp/rockchip                         # Board Support Package
│   ├── common                           # Common modules and feature-related files
│   │   ├── drivers                      # RTOS Device Driver files
│   │   ├── fwmgr                        # Firmware management related files
│   │   ├── hal                          # RK HAL files
│   │   └── test                         # Module and feature test files
│   ├── rk3562-32                        # RK3562 AP 32-bit
│   │   ├── applications                 # Application files
│   │   ├── board                        # Board configuration files
│   │   ├── driver                       # Driver files
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged RTOS / Bare-metal firmware
│   │   │   ├── amp.its                  # RTOS + Bare-metal firmware packaging configuration file
│   │   │   ├── amp_linux.its            # Linux + RTOS / Bare-metal firmware packaging configuration file
│   │   │   ├── rttx.bin
│   │   │   ├── rttx.elf
│   │   │   ├── parameter.txt            # Partition table configuration file
│   │   │   └── smp.its                  # RTOS SMP firmware packaging configuration file
│   │   ├── test                         # Test files
│   │   ├── build.sh                     # AP compilation script
│   │   ├── gcc_arm.ld.S                 # AP linking script
│   │   ├── hal_conf.h                   # RK HAL configuration file
│   │   ├── Kconfig
│   │   ├── mkimage.sh                   # AP firmware packaging script
│   │   ├── rtconfig.h
│   │   ├── rtconfig.py
│   │   ├── SConscript
│   │   └── SConstruct
│   ├── rk3562-mcu                       # RK3562 MCU
│   │   ├── applications                 # Application files
│   │   ├── board                        # Board configuration files
│   │   ├── driver                       # Driver files
│   │   ├── Image
│   │   │   ├── amp.img                  # Packaged RTOS system firmware
│   │   │   ├── amp_mcu.its              # Linux + RTOS / Bare-metal MCU firmware packaging configuration file
│   │   │   ├── mcu.bin
│   │   │   └── mcu.elf
│   │   ├── gcc_arm.ld.S                 # MCU linking script
│   │   ├── hal_conf.h                   # RK HAL configuration file
│   │   ├── Kconfig
│   │   ├── mkimage.sh                   # MCU firmware packaging script
│   │   ├── rtconfig.h
│   │   ├── rtconfig.py
│   │   ├── SConscript
│   │   └── SConstruct
│   └── tools                            # Toolset
├── components
├── examples
├── include
├── libcpu
├── src
├── third_party
└── tools
```

Связанные разделы:

Глава 3: Конфигурация сборки

Глава 4: Распределение ресурсов

Глава 5: Схемы загрузки

Глава 6: Межъядерная связь

### 2.6 Каталог u-boot

Каталог u-boot содержит исходный код U-Boot. Для AMP необходимо добавить rk-amp.config и включить следующие параметры.

```text
CONFIG_AMP=y
CONFIG_ROCKCHIP_AMP=y
```

Основные файлы AMP SDK для RK3562:

```text
arch/arm/mach-rockchip/rk3562/rk3562.c   # SOC initialization file
drivers/cpu/rockchip_amp.c               # AMP startup solution
include/configs/rk3562_common.h          # Common chip configuration file
```

Связанные разделы:

Глава 3: Конфигурация сборки

Глава 5: Схемы загрузки

### 2.7 Каталог rkbin

Каталог rkbin содержит двоичные файлы AMP SDK и используется совместно с u-boot.

Основные файлы AMP SDK для RK3562:

```text
bin/rk35/rk3562_bl31_xxx.elf             # Common bl31 file
bin/rk35/rk3562_bl31_cpu3_xxx.elf        # bl31 file for pre-level running on CPU3
RKTRUST/RK3562TRUST.ini                  # Common configuration file
RKTRUST/RK3562TRUST_CPU3.ini             # Configuration file for pre-level running on CPU3
```

Связанные разделы:

Глава 3: Конфигурация сборки

Глава 5: Схемы загрузки

## 3. Конфигурация сборки

### 3.1 Конфигурационный файл

Перед сборкой AMP SDK выберите и измените соответствующие конфигурационные файлы.

#### 3.1.1 Общая конфигурация сборки

Конфигурация сборки AMP SDK сообщает сценарию расположение проектов RTOS и bare metal и их параметры. Конфигурация по умолчанию находится в <AMP_SDK>/device/rockchip/.chip/rockchip_xxx_defconfig; основные параметры приведены ниже.

```text
RK_AMP=y                                          # Support for AMP RTOS / Bare-metal
RK_AMP_ARCH="arm"                                 # 32-bit is used for RTOS / Bare-metal
                                                  # Use "arm64" for 64-bit
RK_AMP_HAL_TARGET="rk3562"                        # The project directory name corresponding to AP Bare-metal
RK_AMP_RTT_TARGET="rk3562-32"                     # The project directory name corresponding to AP RTOS
RK_AMP_MCU_HAL_TARGET="rk3562-mcu"                # The project directory name corresponding to MCU Bare-metal
RK_AMP_MCU_RTT_TARGET="rk3562-mcu"                # The project directory name corresponding to MCU RTOS
RK_AMP_CFG is not set                             # Auxiliary configuration file
RK_AMP_FIT_ITS="amp_linux.its"                    # Configuration file for AMP firmware packaging
RK_UBOOT_CFG_FRAGMENTS="rk-amp"                   # Add configuration file for AMP U-Boot config
RK_UBOOT_TRUST_INI is not set                     # Configuration file required when using a special rkbin
RK_PARAMETER="parameter.txt"                      # Partition table configuration file
```

Для настройки SDK рекомендуется make menuconfig: этот способ автоматически учитывает зависимости между параметрами сборки и предотвращает недопустимые комбинации.

![Иллюстрация из руководства Rockchip AMP: 3.1.1 Общая конфигурация сборки — 25](assets/en-p025-fig01.png)

#### 3.1.2 Конфигурация упаковки прошивки AMP

Прошивки AMP упаковываются в стандартный FIT, который поддерживается и рекомендуется U-Boot. ITS позволяет задавать конфигурацию каждого ядра AMP с RTOS или bare metal. Для RK3562 предусмотрены три типовые схемы.

amp_linux.its: совместное развёртывание Linux + RTOS / bare metal.

amp.its: совместное развёртывание RTOS + bare metal.

amp_mcu.its: совместное развёртывание Linux + MCU с RTOS / bare metal.

##### 3.1.2.1 amp_linux.its

В примере Linux + RTOS / bare metal ядро CPU3 RK3562 независимо выполняет RTOS, а остальные ядра работают под Linux SMP.

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMP";
    #address-cells = <1>;
    images {
        // amp3 node configures CPU3, other processor cores are similar.
        amp3 {
            description  = "RTOS core3";          // Firmware description information
            data         = /incbin/("rtt3.bin"); // Specifies the firmware location to be
packaged (with path)
            type         = "firmware";           // AP is set to firmware
            compression  = "none";               // Keep the default none
            arch         = "arm";                // Specifies the processor architecture
            cpu          = <0x3>;                // Specifies the processor's hardware ID
            thumb        = <0>;                  // Specifies the processor's instruction set
            hyp          = <0>;                  // Specifies whether the processor runs the Hypervisor
            load         = <0x01800000>;         // Specifies the firmware load and run address
            compile {                            // Configuration at compile time, automatically cleared after compilation
                size     = <0x00800000>;         // Running memory size
                sys      = "rtt";                // RTOS (rtt) or Bare-metal (hal)
                core     = "ap";                 // Processor core type: ap or mcu
                rtt_config   = "board/rk3562_evb1_lp4x/amp_defconfig";
            };
            udelay       = <10000>;              // Delay to start the next processor core
            hash {
                algo = "sha256";                 // Specifies the algorithm for firmware integrity check
            };
        };
    };
    share {                                           // Shared memory configuration at
compile time, automatically cleared after compilation
        shm_base         = <0x07800000>;          // Shared memory start address
        shm_size         = <0x00400000>;          // Shared memory size
        rpmsg_base       = <0x07c00000>;          // RPMsg shared memory start address
        rpmsg_size       = <0x00500000>;          // RPMsg shared memory size
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "amp3";                   // Specifies the firmware to be loaded, as well as the loading and startup order
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
            /* - run linux on cpu0 * - it is brought up by amp(that run on U-Boot) * - it is boot entry depends on U-Boot */
            linux {                               // Supports Linux hybrid deployment
                description  = "linux-os";
                arch         = "arm64";
                cpu          = <0x000>;
                thumb        = <0>;
                hyp          = <0>;
                udelay       = <0>;
                // If the AMP firmware load location conflicts with the Linux Kernel load location, it needs to be adjusted
                load         = <0x2000000>;        // Linux Kernel load location
                load_c       = <0x4880000>;        // Compressed Linux Kernel load location
            };
        };
    };
};
```

##### 3.1.2.2 amp.its

В примере RTOS + bare metal ядро CPU1 RK3562 независимо выполняет RTOS, а остальные три ядра — отдельные bare-metal системы.

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMPAK";
    #address-cells = <1>;
    images {
        amp0 {
            description  = "Bare-metal-core0";
            data         = /incbin/("rtt0.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x0>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x02000000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
        amp1 {
            description  = "RTOS-core1";
            data         = /incbin/("rtt1.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x1>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x00800000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "rtos";
            };
            hash {
                algo = "sha256";
            };
        };
        amp2 {
            description  = "Bare-metal-core2";
            data         = /incbin/("rtt2.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x2>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01000000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
        amp3 {
            description  = "Bare-metal-core3";
            data         = /incbin/("rtt3.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";
            cpu          = <0x3>;
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01800000>;
            udelay       = <10000>;
            compile {
                size    = <0x00800000>;
                sys     = "hal";
            };
            hash {
                algo = "sha256";
            };
        };
    }
    share {
        shm_base         = <0x07800000>;
        shm_size         = <0x00400000>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMPAK images";
            rollback-index = <0x0>;
            loadables = "amp0", "amp1", "amp2", "amp3";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

##### 3.1.2.3 amp_mcu.its

В примере Linux + MCU с RTOS / bare metal AP RK3562 работает под Linux SMP, а MCU независимо выполняет bare-metal AMP.

```text
/dts-v1/;
/ {
    description = "Rockchip AMP FIT Image";
    #address-cells = <1>;
    images {
        mcu {
            description  = "mcu";
            data         = /incbin/("./rtt.bin");
            type         = "standalone";          // MCU is set to standalone
            compression  = "none";
            arch         = "arm";
            load         = <0x08200000>;
            udelay       = <1000000>;
            compile {
                size     = <0x00800000>;
                sys      = "hal";
                core     = "mcu";                 // Processor core type: ap or mcu
            };
            hash {
                algo = "sha256";
            };
        };
    };
    share {
        shm_base         = <0x07800000>;
        shm_size         = <0x00400000>;
        rpmsg_base       = <0x07c00000>;
        rpmsg_size       = <0x00500000>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "mcu";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

Рабочую и общую память необходимо спланировать так, чтобы области не пересекались.

Связанные разделы:

Глава 4: Распределение ресурсов

#### 3.1.3 Вспомогательная конфигурация

Некоторым SoC дополнительно нужен вспомогательный конфигурационный файл <AMP_SDK>/device/rockchip/.chip/$RK_AMP_CFG. Его параметры экспортируются непосредственно в переменные среды и используются при сборке.

Например, для общего журнала LOG на RK3308 добавляют следующие настройки.

```text
## Chapter-3 RTT config
## Chapter-3 Share Memory config
RTT_SHLOG0_SIZE=0x00001000
RTT_SHLOG1_SIZE=0x00001000
RTT_SHLOG2_SIZE=0x00001000
RTT_SHLOG3_SIZE=0x00001000
## Chapter-3 HAL config
## Chapter-3 Share Memory config same as RTT
SHLOG0_SIZE=$RTT_SHLOG0_SIZE
SHLOG1_SIZE=$RTT_SHLOG1_SIZE
SHLOG2_SIZE=$RTT_SHLOG2_SIZE
SHLOG3_SIZE=$RTT_SHLOG3_SIZE
```

#### 3.1.4 Конфигурация таблицы разделов

Таблицу разделов следует менять с учётом ёмкости используемого накопителя и размера прошивки AMP.

Файл таблицы разделов parameter.txt расположен в <AMP_SDK>/device/rockchip/.chip/$RK_PARAMETER. В строке mtdparts раздел записывается как size@start(part_name); единица — сектор 512 байт. Ниже приведён пример раздела amp размером 2 MiB.

```text
CMDLINE:
mtdparts=:0x00002000@0x00004000(uboot),0x00002000@0x00006000(misc),0x00020000@0x00008000(boot),0x00001000@0x00028000(amp),0x00040000@0x00029000(recovery),0x00010000@0x00069000(backup),0x01c00000@0x00079000(rootfs),0x00040000@0x01c79000(oem),-@0x01cb9000(userdata:grow)
```

Добавление раздела amp с помощью сценария:

```text
./build.sh list-parts
==========================================
          Partition table
==========================================
1:        uboot at 0x00004000 size=0x00002000(4M)
2:         misc at 0x00006000 size=0x00002000(4M)
3:         boot at 0x00008000 size=0x00020000(64M)
4:     recovery at 0x00028000 size=0x00040000(128M)
5:       backup at 0x00068000 size=0x00010000(32M)
6:       rootfs at 0x00078000 size=0x01c00000(14G)
7:          oem at 0x01c78000 size=0x00040000(128M)
8:     userdata at 0x01cb8000 size=-(grow)
./build.sh insert-part:4:amp:2M
./build.sh list-parts
==========================================
          Partition table
==========================================
1:        uboot at 0x00004000 size=0x00002000(4M)
2:         misc at 0x00006000 size=0x00002000(4M)
3:         boot at 0x00008000 size=0x00020000(64M)
4:          amp at 0x00028000 size=0x00001000(2M)
5:     recovery at 0x00029000 size=0x00040000(128M)
6:       backup at 0x00069000 size=0x00010000(32M)
7:       rootfs at 0x00079000 size=0x01c00000(14G)
8:          oem at 0x01c79000 size=0x00040000(128M)
9:     userdata at 0x01cb9000 size=-(grow)
```

### 3.2 Команды сборки

#### 3.2.1 Общая команда сборки

Ниже приведены общие команды SDK для сборки и упаковки компонентов и полного образа.

```text
./build.sh chip         # Select the SoC platform
./build.sh lunch        # Select the default configuration file
./build.sh              # One-click compilation and packaging
./build.sh uboot        # Compile U-Boot separately
./build.sh kernel       # Compile the Linux Kernel separately
./build.sh amp          # Compile RTOS / Bare-metal separately
./build.sh cleanall     # Clean all
./build.sh help         # Get help
```

Команда ./build.sh amp читает конфигурацию упаковки AMP и автоматически собирает и упаковывает amp.img.

#### 3.2.2 Сборка отдельных компонентов

Команды отдельной сборки компонентов можно найти в build_info.txt базовой прошивки, поставляемой с AMP SDK.

##### 3.2.2.1 Сборка ядра Linux

Пример отдельной сборки ядра Linux для AP RK3562:

```text
cd <AMP_SDK>/kernel
export ARCH=arm64                              # Specify the architecture of the processor
export CROSS_COMPILE="path to compiler"        # Specify the cross-compilation toolchain
## Chapter-3 For example:
export CROSS_COMPILE=../prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu-
make rockchip_linux_defconfig                  # Specify the compilation configuration
make rk3562-evb1-lp4x-v10-linux-amp.img -j8    # Compile the specified dts board-level configuration
```

##### 3.2.2.2 Сборка RT-Thread

Пример отдельной сборки RT-Thread для AP RK3562:

```text
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
./build.sh <cpu_id 0~3 or all>
./mkimage.sh
scons -j8
scons -c
```

##### 3.2.2.3 Сборка RK HAL

Пример отдельной сборки RK HAL для AP RK3562:

```text
cd <AMP_SDK>/hal/project/rk3562/GCC
./build.sh <cpu_id 0~3 or all>
cd ..
./mkimage.sh
make -j8
make clean
```

##### 3.2.2.4 Сборка U-Boot

Пример отдельной сборки U-Boot для RK3562:

```text
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh
```

Для специального rkbin, например с предыдущей стадией загрузки на CPU3, используется следующая команда.

```text
cd <AMP_SDK>/u-boot/
make rk3562_defconfig rk-amp.config
./make.sh ../rkbin/RKTRUST/RK3562TRUST_CPU3.ini
```

Связанные разделы:

Глава 5: Схемы загрузки

## 4. Распределение ресурсов

### 4.1 Архитектура системы

#### 4.1.1 Архитектура AP + AP

Архитектура AP + AP включает Linux + RTOS / bare metal и RTOS + bare metal. В первом случае ведущее ядро выполняет Linux, удалённые ядра — RTOS или bare metal. Во втором ведущим становится первое запущенное ядро. Оно распределяет и управляет общими ресурсами всей системы и выполняет сервис ведущей стороны.

![Иллюстрация из руководства Rockchip AMP: 4.1.1 Архитектура AP + AP — 34](assets/en-p034-fig01.png)

![Иллюстрация из руководства Rockchip AMP: 4.1.1 Архитектура AP + AP — 35](assets/en-p035-fig01.png)

#### 4.1.2 Архитектура AP + MCU

В архитектуре AP + MCU AP выполняет Linux и выступает ведущим, а MCU выполняет RTOS или bare metal как удалённая сторона. Ведущий AP распределяет общие ресурсы, управляет ими и выполняет сервис ведущей стороны.

![Иллюстрация из руководства Rockchip AMP: 4.1.2 Архитектура AP + MCU — 36](assets/en-p036-fig01.png)

### 4.2 Ресурсы ядра Linux

#### 4.2.1 Конфигурационные файлы Linux

##### 4.2.1.1 Файлы DTS

Ресурсы ядра Linux задаются в DTS. Файлы гетерогенной системы называются rkxxxx-evbxxxxx-amp.dts и включают rkxxxx-amp.dtsi, например:

```text
arch/arm64/boot/dts/rockchip/rk3562-amp.dtsi
arch/arm64/boot/dts/rockchip/rk3562-evb1-lp4x-v10-linux-amp.dts
```

Файл rk3562-amp.dtsi используется Linux для централизованного управления общими ресурсами гетерогенной системы.

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                /* Clock resources used by AMP */
                clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
                        <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
                        <&cru SCLK_UART7>, <&cru PCLK_UART7>,
                        <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
                /* Pin resources used by AMP */
                pinctrl-names = "default";
                pinctrl-0 = <&uart7m1_xfer>;
                /* Interrupt resources used by AMP */
                amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
                amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))>;
                status = "okay";
        };
};
```

##### 4.2.1.2 Файлы драйвера AMP

Файл драйвера AMP: <AMP_SDK>/kernel/drivers/soc/rockchip/rockchip_amp.c.

```text
// ...
// Centralized management of AMP's interrupt resources, called by the GIC driver
static void amp_gic_get_irqs_config(struct device_node *np, struct amp_gic_ctrl_s *amp_ctrl)
{
    // ....
}
static int rockchip_amp_probe(struct platform_device *pdev)
{
    // ...
    // Centralized management of AMP's clock resources
    rkamp_dev->num_clks = devm_clk_bulk_get_all(&pdev->dev, &rkamp_dev->clks);
    // Centralized management of AMP's power supply resources
    rkamp_dev->num_pds =
        of_count_phandle_with_args(pdev->dev.of_node, "power-domains",
                                   "#power-domain-cells");
    // Centralized management of AMP's core resources, lifecycle management of the core, such as open, close, restart, etc.
    cpus_node = of_get_child_by_name(pdev->dev.of_node, "amp-cpus");
    // ...
}
// Pin resources, processed by the pinctrl driver before calling rockchip_amp_probe.
static const struct of_device_id rockchip_amp_match[] = {
    { .compatible = "rockchip,amp" }, // Corresponds to the property in the DTS file
    // ...
};
```

#### 4.2.2 Выделение ядер Linux

Узел ядра, выделенного HAL/RTOS, необходимо исключить из Linux DTS. Ядра платформ уже определены в rkxxxx.dtsi; включите подходящий DTSI и удалите выделяемые узлы. Пример: Core3 кластера A55 RK3588 для HAL/RTOS.

```text
/ {
    model = "Rockchip RK3588 EVB1 LP4 V10 Board";
    compatible = "rockchip,rk3588-evb1-lp4-v10", "rockchip,rk3588";
    cpus {
        cpu-map {
            cluster0 {
                /delete-node/ core3;
            };
        };
    };
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        amp_reserved: amp@800000 {
            reg = <0x0 0x00800000 0x0 0x01800000>;
            no-map;
        };
    };
};
&arm_pmu {
    interrupt-affinity = <&cpu_l0>, <&cpu_l1>, <&cpu_l2>,
                 <&cpu_b0>, <&cpu_b1>, <&cpu_b2>, <&cpu_b3>;
};
/delete-node/ &cpu_l3;
```

Пример выделения Core3 кластера A76 RK3588 для HAL/RTOS:

```text
/ {
    model = "Rockchip RK3588 EVB1 LP4 V10 Board";
    compatible = "rockchip,rk3588-evb1-lp4-v10", "rockchip,rk3588";
    cpus {
        cpu-map {
            cluster2 {
                /delete-node/ core1;
            };
        };
    };
    reserved-memory {
        #address-cells = <2>;
        #size-cells = <2>;
        ranges;
        amp_reserved: amp@800000 {
            reg = <0x0 0x00800000 0x0 0x01800000>;
            no-map;
        };
    };
};
&arm_pmu {
    interrupt-affinity = <&cpu_l0>, <&cpu_l1>, <&cpu_l2>, <&cpu_l3>,
                 <&cpu_b0>, <&cpu_b1>, <&cpu_b2>;
};
/delete-node/ &cpu_b3;
```

#### 4.2.3 Ресурсы памяти Linux

##### 4.2.3.1 Конфигурация рабочей памяти

DRAM — частная рабочая память системы. По умолчанию Linux использует весь DDR, поэтому рабочие области других систем необходимо зарезервировать в Linux DTS.

Пример для RK3562:

```text
/ {
    reserved-memory {
        /* rk3588-amp.dtsi */
        /* MCU address */
        mcu_reserved: mcu@8200000 {
            reg = <0x0 0x8200000 0x0 0x100000>;
            no-map;
        };
        /* rk3588-evb1-lp4-v10-linux-amp.dts */
        /* AP address */
        amp_reserved: amp@800000 {
            reg = <0x0 0x01800000 0x0 0x00800000>;
            no-map;
        };
    };
};
```

##### 4.2.3.2 Конфигурация общей памяти

Общая память предназначена для обмена данными между системами. Поскольку Linux по умолчанию использует весь DDR как рабочую память, область обмена нужно зарезервировать в Linux DTS.

Способ резервирования аналогичен настройке DRAM в Linux DTS; имена узлов должны отличаться.

Пример для RK3562:

```text
/ {
    reserved-memory {
        /* rk3588-amp.dtsi */
        rpmsg_reserved: rpmsg@7c00000 {
            reg = <0x0 0x07c00000 0x0 0x400000>;
            no-map;
        };
    };
};
```

#### 4.2.4 Периферийные ресурсы Linux

Ресурсы SoC определены в Linux DTS. Когда периферия нужна другой системе AMP, соответствующий модуль следует отключить в DTS Linux и передать удалённой системе.

Пример передачи I2C1 из Linux в RTOS на RK3562 EVB1:

Сначала найдите определение I2C1 в rk3562.dtsi.

```text
i2c1: i2c@ffa00000 {                                                 /* Module Name */
        compatible = "rockchip,rk3562-i2c", "rockchip,rk3399-i2c";
        reg = <0x0 0xffa00000 0x0 0x1000>;
        clocks = <&cru CLK_I2C1>, <&cru PCLK_I2C1>;                  /* Clock References */
        clock-names = "i2c", "pclk";
        interrupts = <GIC_SPI 13 IRQ_TYPE_LEVEL_HIGH>;               /* Interrupt Reference */
        pinctrl-names = "default";
        pinctrl-0 = <&i2c1m0_xfer>;                                  /* Pin Reference */
        #address-cells = <1>;
        #size-cells = <0>;
        status = "disabled";
};
```

Из определения I2C1 видно, что контроллеру нужны следующие ресурсы:

Прерывания.

Выводы.

Тактирование.

Сначала отключите I2C1 в Linux DTS.

```text
&i2c1 {
       status = "disabled";
};
```

##### 4.2.4.1 Настройка прерываний

Добавьте прерывание I2C1 в amp-irqs узла rockchip-amp.

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Interrupt resources used by AMP */
-               amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))>;
+               amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
+                                     GIC_AMP_IRQ_CFG_ROUTE(45, 0xd0, CPU_GET_AFFINITY(3, 0))>;
                                      // Add I2C1: 45 = I2C1 interrupt 13 + fixed offset 32
                // ......
        };
};
```

Номер SPI в описании модуля и полный номер прерывания для amp-irqs отличаются на 32.

##### 4.2.4.2 Настройка выводов

Добавьте выводы I2C1 в узел rockchip-amp.

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Pin resources used by AMP */
                pinctrl-names = "default";
-               pinctrl-0 = <&uart7m1_xfer>;
+               pinctrl-0 = <&uart7m1_xfer>, <&i2c1m0_xfer>;
                // ......
        };
};
```

Модуль может иметь несколько вариантов групп выводов; выберите реально используемую группу.

##### 4.2.4.3 Настройка тактирования

Добавьте ресурсы тактирования I2C1 в узел rockchip-amp.

```text
/ {
        rockchip_amp: rockchip-amp {
                compatible = "rockchip,amp";
                // ......
                /* Clock resources used by AMP */
                clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
                        <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
                        <&cru SCLK_UART7>, <&cru PCLK_UART7>,
-                       <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
+                       <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>,
+                       <&cru CLK_I2C1>, <&cru PCLK_I2C1>;
                // ......
        };
};
```

### 4.3 Настройка ресурсов RTOS

#### 4.3.1 Конфигурация RT-Thread

В проекте SoC обычно уже есть несколько конфигураций плат. Параметр CONFIG_RT_BOARD_NAME меняют через scons --menuconfig, чтобы один проект мог обслуживать разные платы.

Конфигурация RT-Thread включает:

```text
<AMP_SDK>/internal/rk3588/rtos/bsp/rockchip/rk3562-32/
├── applications
├── board
│   ├── common                  # Common configuration
│   ├── Kconfig
│   ├── rk3562_evb1_lp4x        # Board-level configuration
│   └── SConscript
├── build.sh                    # Build script, containing some build configurations
└── ...
```

Общую конфигурацию: обязательные базовые настройки SoC для всех проектов плат.

Конфигурацию платы: GPIO, UART, I2C и другие функции конкретной платы.

Команды сборки: параметры можно передавать при сборке, определить в build.sh либо экспортировать в среду перед запуском scons.

##### 4.3.1.1 Файлы уровня платы

Настройка ресурсов RT-Thread включает общую конфигурацию и конфигурацию платы.

Файлы общей конфигурации:

```text
## Chapter-4 General Configuration
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/iomux_base.c
```

Общая конфигурация определяет порядок инициализации и ресурсы оборудования по умолчанию. Многочисленные определения RT_WEAK позволяют переопределять нужные функции в конфигурации конкретной платы.

```text
RT_WEAK const struct clk_init clk_inits[];            // Weak definition of structure, can
be redefined in board-level configuration
RT_WEAK  void rt_hw_iomux_config(void);               // Weak definition of function, can be
redefined in board-level configuration
// ...                                                // Weak definition resources vary with different SoCs, not listed one by one
void rt_hw_board_init(void)
{
    // ... Initialization sequence, do not modify
}
```

Файлы конфигурации платы:

```text
## Chapter-4 Board-Level Configuration
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/board.c
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
```

На уровне платы переопределяются необходимые ресурсы RT_WEAK.

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
void rt_hw_iomux_config(void)
{
    // ...
}
```

##### 4.3.1.2 Файлы сборки

RT-Thread использует SCons. В сборке участвуют следующие файлы.

```text
cd <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/
rk3562-32/rtconfig.h               # Configuration file used for compilation
rtconfig.py                        # Compilation script, determining the location of the
compilation chain, and the input parameters of the compilation command, etc.
SConscript                         # SCONS link file
SConstruct                         # SCONS link file
build.sh                           # RT-Thread AP Core quick compilation script, MCU Core does not have this script
```

AP собирается через ./build.sh, а MCU — командой make.

#### 4.3.2 Ресурсы памяти RT-Thread

Память RT-Thread распределяется скриптом компоновщика.

```text
<AMP_SDK>/rtos/bsp/rockchip/rk3562-32/gcc_arm.ld.S
<AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S
```

##### 4.3.2.1 Рабочая память AP

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/gcc_arm.ld.S */
MEMORY
{
    SRAM  (rxw) : ORIGIN = 0xfe480000, LENGTH = 64K            /* SYSTEM SRAM */
    DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE   /* DRAM */
    SHMEM (rxw) : ORIGIN = SHMEM_BASE, LENGTH = SHMEM_SIZE     /* shared memory for all cpu */
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
## Chapter-4 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/rtconfig.py
## Chapter-4 variable conversion, connecting the build.sh script and gcc_arm.ld.S file
CFLAGS += ' -DFIRMWARE_BASE={a} -DDRAM_SIZE={b} -DSHMEM_BASE={c} -DSHMEM_SIZE={d} -DLINUX_RPMSG_BASE={e} -DLINUX_RPMSG_SIZE={f}'.format(a=PRMEM_BASE, b=PRMEM_SIZE, c=SHMEM_BASE, d=SHMEM_SIZE, e=LINUX_RPMSG_BASE, f=LINUX_RPMSG_SIZE)
## Chapter-4 cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/build.sh
export RTT_PRMEM_BASE=$(eval echo \$CPU$1_MEM_BASE)            /* DRAM start location */
export RTT_PRMEM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)            /* DRAM capacity size */
export RTT_SHMEM_BASE=0x07800000                               /* shared memory start location */
export RTT_SHMEM_SIZE=0x00400000                               /* shared memory capacity size */
export LINUX_RPMSG_BASE=0x07c00000                             /* rpmsg start location */
export LINUX_RPMSG_SIZE=0x00500000                             /* rpmsg capacity size */
```

Конфигурация памяти AP находится в gcc_arm.ld.S. Для удобства часть параметров переносится через rtconfig.py в build.sh, где их проще менять при сборке.

Адреса в конфигурации AP соответствуют реальным физическим адресам DDR.

Параметры DRAM можно задать в build.sh:

```text
CPU3_MEM_BASE=0x01800000
CPU3_MEM_SIZE=0x00800000
export RTT_PRMEM_BASE=$(eval echo \$CPU$1_MEM_BASE)             /* DRAM start location */
export RTT_PRMEM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)             /* DRAM capacity size */
```

Соответствие имён переменных преобразуется в rtconfig.py.

##### 4.3.2.2 Общая память AP

Для области LINUX_RPMSG добавьте следующие определения в gcc_arm.ld.S.

```text
MEMORY {
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
```

Указатель на физический адрес LINUX_RPMSG можно получить непосредственно в коде.

```text
/* [AMP_SDK]/rtos/bsp/rockchip/rk3562-32/board/common/rpmsg_base.h */
/* RPMSG shared memory information */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end__[];
#define RPMSG_MEM_BASE      ((uint32_t)&__share_rpmsg_start__)
#define RPMSG_MEM_END       ((uint32_t)&__share_rpmsg_end__)
```

##### 4.3.2.3 Рабочая память MCU

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

Память MCU RT-Thread задаётся совместно файлами gcc_link.ld.S и amp.its.

У MCU адрес запуска соответствует его собственному адресу 0. Поэтому между адресами, видимыми MCU, и реальными физическими адресами существует постоянное смещение.

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

В примере DRAM MCU RT-Thread расположен по физическому адресу 0x08200000 и имеет объём 512 KiB.

##### 4.3.2.4 Общая память MCU

Пример добавления LINUX_RPMSG в RT-Thread MCU RK3562; соответствующие определения скрипта компоновщика показаны ниже.

```text
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/gcc_link.ld.S */
MEMORY {
    // ...
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
/* cat <AMP_SDK>/rtos/bsp/rockchip/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
0x08300000 = 0x08200000 + 0x00100000
```

В примере физический адрес LINUX_RPMSG равен 0x08300000 = 0x08200000 + 0x00100000. MCU видит относительный адрес 0x00100000. Размер области — 0x00500000 байт (5 MiB).

Информацию о LINUX_RPMSG можно получить в коде. Все адреса MCU учитывают смещение относительно адреса загрузки прошивки.

```text
/* RPMSG share memory information */
extern uint32_t __share_rpmsg_start__[];
extern uint32_t __share_rpmsg_end__[];
#define RPMSG_MEM_BASE      ((uint32_t)&__share_rpmsg_start__)      /* 0x00100000 */
#define RPMSG_MEM_END       ((uint32_t)&__share_rpmsg_end__)        /* 0x00500000 */
```

#### 4.3.3 Периферия RT-Thread

Добавление I2C1 на RK3562 иллюстрирует подключение периферийного модуля в RT-Thread.

##### 4.3.3.1 Прерывания AP

При использовании MCU этот раздел следует пропустить: MCU имеет отдельный NVIC и не требует данной настройки GIC.

Добавьте прерывание I2C1 в irqsConfig.

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/common/board_base.c
// The system runs on CPU3, so CPU3 needs to respond to I2C1 interrupts.
#define CUR_CPU       3
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
{
    // ...
    GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, 0xd0, CPU_GET_AFFINITY(CUR_CPU, 0)),
    // ...
}
```

##### 4.3.3.2 Прерывания MCU

Прерывания, непосредственно подключённые к MCU, обрабатываются через NVIC; остальные — через INTMUX.

```text
<AMP_SDK>/hal/project/rk3562/src/test_demo.c
// NVIC interface example
/************************************************/
/*                                              */
/*                SOFTIRQ_TEST                  */
/*                                              */
/************************************************/
#ifdef SOFTIRQ_TEST
static void soft_isr(void)
{
    printf("softirq_test: enter isr\n");
}
static void softirq_test(void)
{
    printf("softirq_test start\n");
    HAL_NVIC_SetIRQHandler(RSVD0_MCU_IRQn, soft_isr);
    HAL_NVIC_EnableIRQ(RSVD0_MCU_IRQn);
    HAL_DelayMs(4000);
    HAL_NVIC_SetPendingIRQ(RSVD0_MCU_IRQn);
}
#endif
// INTMUX interface example
/************************************************/
/*                                              */
/*                  GPIO_TEST                   */
/*                                              */
/************************************************/
#ifdef GPIO_TEST
    //......
static void gpio_test(void)
{
    //......
    /* Test GPIO interrupt */
    HAL_GPIO_SetPinDirection(GPIO1, GPIO_PIN_B7, GPIO_IN);
    HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio1_isr, NULL);
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK1, GPIO_PIN_B7, b7_call_back, NULL);
    HAL_INTMUX_EnableIRQ(GPIO1_IRQn);
    HAL_GPIO_SetIntType(GPIO1, GPIO_PIN_B7, GPIO_INT_TYPE_EDGE_BOTH);
    HAL_GPIO_EnableIRQ(GPIO1, GPIO_PIN_B7);
    printf("test_gpio interrupt ready\n");
}
#endif
```

##### 4.3.3.3 Настройка выводов

Настройте выводы I2C1 в rt_hw_iomux_config.

```text
// <AMP_SDK>/rtos/bsp/rockchip/rk3562-32/board/rk3562_evb1_lp4x/iomux.c
void i2c1_m0_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void rt_hw_iomux_config(void)
{
    // ...
    i2c1_m0_iomux_config();
    // ...
}
```

##### 4.3.3.4 Настройка тактирования

В RT-Thread уже включён модуль CRU, поэтому дополнительная настройка переключения тактирования не требуется.

После этого I2C1 можно использовать через интерфейс I2C RT-Thread.

### 4.4 Ресурсы bare metal

#### 4.4.1 Конфигурация RK HAL

##### 4.4.1.1 Файлы уровня платы

Ресурсы RK HAL определены непосредственно в main.c; разработчик самостоятельно задаёт их распределение.

##### 4.4.1.2 Файлы сборки

Файлы, участвующие в сборке RK HAL, приведены ниже.

```text
cd <AMP_SDK>/hal/project/rk3562/GCC
Makefile                           # Configuration file used for compilation
build.sh                           # Quick compilation script for RT-Thread AP Core, MCU Core does not have this script
```

AP собирается через ./build.sh, MCU — командой make.

#### 4.4.2 Ресурсы памяти RK HAL

Память HAL распределяется скриптом компоновщика.

```text
<AMP_SDK>/hal/project/rk3562/GCC/gcc_arm.ld.S
<AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld
```

##### 4.4.2.1 Рабочая память AP

```text
/* cat <AMP_SDK>/hal/project/rk3562/GCC/gcc_arm.ld.S */
MEMORY
{
    SRAM  (rxw) : ORIGIN = SRAM_BASE, LENGTH = SRAM_SIZE            /* SYSTEM SRAM */
    DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE   /* DRAM */
    SHMEM (rxw) : ORIGIN = SHMEM_BASE, LENGTH = SHMEM_SIZE     /* shared memory for all cpu */
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
## Chapter-4 cat <AMP_SDK>/hal/lib/CMSIS/Device/RK3562/Source/Templates/mmu_rk3562.c
## Chapter-4 Memory mapping, connect build.sh script and gcc_arm.ld.S file
## Chapter-4 if defined(NC_MEM_BASE) && defined(NC_MEM_SIZE)
    MMU_TTSection(MMUTable, FIRMWARE_BASE, (DRAM_SIZE - NC_MEM_SIZE) >> 20, Sect_Normal);
    MMU_TTSection(MMUTable, NC_MEM_BASE, NC_MEM_SIZE >> 20, Sect_Normal_NC);
#else
    MMU_TTSection(MMUTable, FIRMWARE_BASE, DRAM_SIZE >> 20, Sect_Normal);
#endif
    MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_SH);
//    MMU_TTSection(MMUTable, SHMEM_BASE, SHMEM_SIZE >> 20, Sect_Normal_NC_SH);
#ifdef LINUX_RPMSG_BASE
    MMU_TTSection(MMUTable, LINUX_RPMSG_BASE, LINUX_RPMSG_SIZE >> 20, Sect_Normal_NC_SH);
#endif
## Chapter-4 cat <AMP_SDK>/hal/project/rk3562/GCC/build.sh
export FIRMWARE_CPU_BASE=$(eval echo \$CPU$1_MEM_BASE)            /* DRAM start position */
export DRAM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)                    /* DRAM capacity size */
export SHMEM_BASE=0x07800000                                      /* shared memory start position */
export SHMEM_SIZE=0x00400000                                   /* shared memory capacity size */
export LINUX_RPMSG_BASE=0x07c00000                             /* rpmsg start position */
export LINUX_RPMSG_SIZE=0x00500000                             /* rpmsg capacity size */
```

Настройка памяти AP HAL находится в gcc_arm.ld.S. Часть параметров передаётся через mmu_rk3562.c в build.sh для удобства изменения конфигурации сборки.

Адреса в конфигурации AP соответствуют реальным физическим адресам DDR.

Параметры DRAM можно задать в build.sh:

```text
CPU3_MEM_BASE=0x01800000
CPU3_MEM_SIZE=0x00800000
export FIRMWARE_CPU_BASE=$(eval echo \$CPU$1_MEM_BASE)             /* DRAM start position */
export DRAM_SIZE=$(eval echo \$CPU$1_MEM_SIZE)                     /* DRAM capacity size */
```

Указанные переменные соответствуют области DRAM в gcc_arm.ld.S.

```text
DRAM  (rxw) : ORIGIN = FIRMWARE_BASE, LENGTH = DRAM_SIZE    /* DRAM */
```

Соответствие имён переменных преобразуется в mmu_rk3562.c.

##### 4.4.2.2 Общая память AP

Для общей памяти LINUX_RPMSG добавьте следующие определения в gcc_arm.ld.S.

```text
MEMORY {
    LINUX_RPMSG (rxw) : ORIGIN = LINUX_RPMSG_BASE, LENGTH = LINUX_RPMSG_SIZE
}
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
```

Указатель на физический адрес LINUX_RPMSG можно получить непосредственно в коде.

```text
/* <AMP_SDK>/hal/project/rk3562/src/test_demo.c */
extern uint32_t __linux_share_rpmsg_start__[];
extern uint32_t __linux_share_rpmsg_end__[];
#define RPMSG_LINUX_MEM_BASE ((uint32_t)&__linux_share_rpmsg_start__)
#define RPMSG_LINUX_MEM_END  ((uint32_t)&__linux_share_rpmsg_end__)
#define RPMSG_LINUX_MEM_SIZE (2UL * RL_VRING_OVERHEAD)
```

##### 4.4.2.3 Рабочая память MCU

```text
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld */
MEMORY
{
    DDR   (rxw) : ORIGIN = 0x00000000, LENGTH = 512K               /* DRAM */
}
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
```

Конфигурация памяти MCU HAL задаётся совместно gcc_bus_m0.ld и amp.its.

MCU запускается по собственному адресу 0; между его адресным пространством и реальными физическими адресами существует постоянное смещение.

##### 4.4.2.4 Общая память MCU

Пример добавления общей памяти LINUX_RPMSG в HAL MCU RK3562; определения в gcc_bus_m0.ld:

```text
/* cat <AMP_SDK>/hal/project/rk3562-mcu/GCC/gcc_bus_m0.ld */
MEMORY {
    // ...
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
//...
.linux_share_rpmsg (NOLOAD):
{
    PROVIDE(__linux_share_rpmsg_start__ = .);
    . += LINUX_RPMSG_SIZE;
    PROVIDE(__linux_share_rpmsg_end__ = .);
} > LINUX_RPMSG
/* cat <AMP_SDK>/hal/project/rk3562-mcu/Image/amp.its */
/ {
    images {
        mcu {
            //...
            load         = <0x08200000>;
            //...
        };
    };
};
0x08300000 = 0x08200000 + 0x00100000
```

В примере физический адрес LINUX_RPMSG равен 0x08300000 = 0x08200000 + 0x00100000. MCU видит относительный адрес 0x00100000. Размер — 0x00500000 байт (5 MiB).

Информацию о LINUX_RPMSG можно получить в коде, учитывая смещение относительно адреса загрузки MCU.

#### 4.4.3 Периферия RK HAL

##### 4.4.3.1 Прерывания AP

Ресурсы HAL задаются в main.c. Добавление I2C1 на RK3562 иллюстрирует подключение периферии в RK HAL.

```text
/* ------------------ I2C1 Interrupt Configuration --------------------*/
/* RK HAL bare CORE*/
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
    GIC_AMP_IRQ_CFG_ROUTE(I2C1_IRQn, 0xd0, CPU_GET_AFFINITY(3, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)), /* sentinel */
};
static struct GIC_IRQ_AMP_CTRL irqConfig = {
    .cpuAff = CPU_GET_AFFINITY(1, 0),
    .defPrio = 0xd0,
    .defRouteAff = CPU_GET_AFFINITY(1, 0),
    .irqsCfg = &irqsConfig[0],
};
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    uint32_t freq;
    struct I2C_HANDLE instance;
    /* HAL BASE Init */
    HAL_Init();
    /* BSP Init */
    BSP_Init();
    /* Interrupt Init */
    HAL_GIC_Init(&irqConfig);
    HAL_IOMUX_I2C1M0_Config();
    freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
    HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
    // i2c operations ...
    while (1);
}
```

##### 4.4.3.2 Прерывания MCU

Ресурсы HAL задаются в main.c. Ниже показано добавление I2C1 на MCU RK3562.

```text
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    uint32_t freq;
    struct I2C_HANDLE instance;
    /* HAL BASE Init, MCU Core uses NVIC controller, HAL_Init completes NVIC initialization */
    HAL_Init();
    /* BSP Init */
    BSP_Init();
    HAL_IOMUX_I2C1M0_Config();
    freq = HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
    HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
    // i2c operations ...
    while (1);
}
```

##### 4.4.3.3 Настройка выводов

Выводы I2C1 на MCU и AP настраиваются одинаково: нужную функцию задаёт HAL_PINCTRL_SetIOMUX.

```text
/* ------------------ I2C1 Pin Resources --------------------*/
static void HAL_IOMUX_I2C1M0_Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_B3 | GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC1);
}
void main(void)
{
    //......
    HAL_IOMUX_I2C1M0_Config();
    //......
}
```

##### 4.4.3.4 Настройка тактирования

Тактирование I2C1 на MCU и AP настраивается одинаково: HAL_CRU_ClkGetFreq получает частоту, HAL_I2C_Init инициализирует устройство.

```text
void main(void)
{
   uint32_t freq;
   struct I2C_HANDLE instance;
   //......
   HAL_CRU_ClkGetFreq(g_i2c1dev.clkID);
   HAL_I2C_Init(&instance, g_i2c1dev.pReg, freq, I2C_100K);
   //......
}
```

### 4.5 Согласованность кэшей

#### 4.5.1 Три способа обеспечения согласованности кэшей

Согласованность кэшей можно обеспечить тремя способами.

1. Отключить кэш. Это самый простой способ, но производительность CPU может значительно снизиться.

2. Программно поддерживать согласованность: записывать изменённые данные из кэша в память и инвалидировать устаревшие строки. Частые обращения к таким интерфейсам расходуют ресурсы системы.

3. Использовать аппаратную согласованность: данные кэша с атрибутом shared автоматически согласуются. Все процессоры в общем домене и периферия, подключённая к шине согласованности CPU (например ACP), видят одни и те же данные.

#### 4.5.2 Между AP и MCU

Между AP и MCU аппаратной согласованности нет; доступны только способы 1 и 2.

#### 4.5.3 Между ядрами AP

Процессоры Cortex-A обычно поддерживают аппаратную согласованность; точные возможности следует проверить в руководстве SoC. Для AP применимы все три способа.

Внутри кластера DynamIQ согласованность поддерживает DSU (DynamIQ System Unit), в big.LITTLE — SCU (Snoop Control Unit). Между кластерами используется CCI (Cache Coherent Interconnect). Эти блоки работают по протоколам MOESI/MESI.

При аппаратной согласованности в описанной схеме нужно настроить атрибуты shareable и cacheable для общей памяти в таблицах MMU.

Влияние атрибутов shareable и cacheable на согласованность кэшей:

|  | non-shareable | inner-shareable | outer-shareable |
| --- | --- | --- | --- |
| non-<br>cacheable | Данные не кэшируются | Данные не кэшируются | Данные не кэшируются |
| write-back<br>cacheable | Аппаратная согласованность не обеспечивается | Аппаратная согласованность ядер одного кластера | Аппаратная согласованность между кластерами |
| write-through<br>cacheable | Как выше | Как выше | Как выше |

## 5. Схемы загрузки

### 5.1 Архитектура процессоров Rockchip SoC

Архитектура процессоров Rockchip SoC в гетерогенной системе показана на следующей схеме.

AP (Application Processor): обычно ядра ARM Cortex-A.

MCU (Micro Controller Unit): обычно ядра ARM Cortex-M или RISC-V.

![Иллюстрация из руководства Rockchip AMP: 5.1 Архитектура процессоров Rockchip SoC — 58](assets/en-p058-fig01.png)

### 5.2 Загрузка AP + AP

Для примера RK3562 имеет четыре ядра Cortex-A53, обозначенные CPU0–CPU3. Решение поддерживает разные сочетания режимов работы.

#### 5.2.1 Linux + RTOS / bare metal

##### 5.2.1.1 Пример прошивки: Kernel + RT-Thread / HAL

В схеме Kernel + RT-Thread / HAL RTOS по умолчанию работает на CPU3. Загрузчик запускается на CPU0 и передаёт управление U-Boot. U-Boot читает и запускает AMP-прошивку CPU3, затем на CPU0 запускает Linux. Ядро Linux запускает CPU1 и CPU2. Последовательность показана на схеме.

![Иллюстрация из руководства Rockchip AMP: 5.2.1.1 Пример прошивки: Kernel + RT-Thread / HAL — 59](assets/en-p059-fig01.png)

Конфигурация amp_linux.its для Kernel + RT-Thread / HAL:

```text
/dts-v1/;
/ {
    description = "FIT source file for Rockchip AMP";
    #address-cells = <1>;
    images {
        amp3 {
            description  = "bare-metal-core3";
            data         = /incbin/("cpu3.bin");
            type         = "firmware";
            compression  = "none";
            arch         = "arm";         // arm or arm64, it is arm by default
            cpu          = <0x3>;         // CPU ID
            thumb        = <0>;
            hyp          = <0>;
            load         = <0x01800000>;  // DRAM start address
            // Compilation configuration, automatically cleared by the compilation script after compilation
            compile {
                size         = <0x00800000>; // DRAM size
                srambase     = <0xfe480000>; // SRAM start address
                sramsize     = <0x00010000>; // SRAM size
                sys          = "rtt"; // CPU running system: HAL or RT-Thread
                // RT-Thread compilation configuration file
                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
            };
            udelay       = <10000>; // CPU startup delay, the delay time when multiple CPUs start in sequence
            hash {
                algo = "sha256";
            };
        };
        // An images can contain multiple sub-nodes, SDK will traverse all nodes under images and compile and package automatically according to node information
    };
    // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
    share {
        shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
        shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
        rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
        rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
        // Main system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
        // In pure RTOS AMP, it defaults to "0x01"
        // When an AMP system includes linux, the linux cpu0 is configured as the main core by default
        primary = <0x0>;
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "amp3"; // Loadable image, only "amp3" in this example
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
            /* - run linux on cpu0 * - it is brought up by amp (that run on U-Boot) * - it is boot entry depends on U-Boot */
            linux {
                description  = "linux-os";
                arch         = "arm64";
                cpu          = <0x000>;
                thumb        = <0>;
                hyp          = <0>;
                udelay       = <0>;
                // If the AMP system conflicts with the Kernel loading position, adjust the Kernel loading position
                load         = <0x2000000>; // Kernel loading position
                load_c       = <0x4880000>; // Compressed Kernel loading position
            };
        };
    };
};
```

##### 5.2.1.2 Пример прошивки: Kernel + 3 × HAL

В схеме Kernel + 3 × HAL Linux работает на CPU0. U-Boot читает amp.img, загружает bare-metal прошивки в порядке loadables = "amp1", "amp2", "amp3" и запускает CPU1, CPU2, CPU3. Затем U-Boot на CPU0 загружает Linux. Последовательность показана на схеме.

![Иллюстрация из руководства Rockchip AMP: 5.2.1.2 Пример прошивки: Kernel + 3 × HAL — 61](assets/en-p061-fig01.png)

Конфигурация amp_linux.its для Kernel + 3 × HAL / RT-Thread:

```text
description = "FIT source file for Rockchip AMP";
#address-cells = <1>;
images {
    amp1 {
    // ......
    }
    amp2 {
    // ......
    }
    amp3 {
        description  = "bare-metal-core3";
        data         = /incbin/("cpu3.bin");
        type         = "firmware";
        compression  = "none";
        arch         = "arm";         // arm or arm64, default arm
        cpu          = <0x3>;         // CPU ID
        thumb        = <0>;
        hyp          = <0>;
        load         = <0x01800000>;  // DRAM start address
        // Compile configuration, automatically cleared by the compile script after compilation
        compile {
            size         = <0x00800000>; // DRAM size
            srambase     = <0xfe480000>; // SRAM start address
            sramsize     = <0x00010000>; // SRAM size
            sys          = "hal"; // CPU running system: HAL or RT-Thread
            // RT-Thread compilation configuration file
            rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
        };
        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
        hash {
            algo = "sha256";
        };
    };
    // An images can contain multiple sub-nodes, and the SDK will traverse all nodes under images, automatically compiling and packaging based on node information
};
## Chapter-5 Shared memory information, compile configuration, automatically cleared by the
compile script after compilation
share {
    shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
    shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
    rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
    rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
    // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
    // In pure RTOS AMP, it is default to "0x01"
    // When the AMP system contains Linux, the Linux cpu0 is configured as the main core by default
    primary = <0x0>;
};
configurations {
    default = "conf";
    conf {
        description = "Rockchip AMP images";
        rollback-index = <0x0>;
        // Image load list: When there are multiple amp images,
        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
        // When CPU0 is the boot core, the actual loading order is: amp1-->amp2-->amp3->...-
>amp0
        // And so on, the boot core is occupied during the boot phase and will be the last to start
        // Load the image, in this example, there are "amp1", "amp2", "amp3"
        loadables = "amp1", "amp2", "amp3";
        signature {
            algo = "sha256,rsa2048";
            padding = "pss";
            key-name-hint = "dev";
            sign-images = "loadables";
        };
        /* - run linux on cpu0 * - it is brought up by amp(that run on U-Boot) * - it is boot entry depends on U-Boot */
        linux {
            description  = "linux-os";
            arch         = "arm64";
            cpu          = <0x000>;
            thumb        = <0>;
            hyp          = <0>;
            udelay       = <0>;
            // If the AMP system conflicts with the Kernel loading position, adjust the Kernel loading position
            load         = <0x2000000>; // Kernel loading position
            load_c       = <0x4880000>; // Compressed Kernel loading position
        };
    };
};
```

#### 5.2.2 RTOS + bare metal

##### 5.2.2.1 Пример прошивки: HAL + HAL

В схеме HAL + HAL загрузчик работает на CPU0, переходит в U-Boot, читает amp.img и загружает cpu1.bin, cpu2.bin, cpu3.bin, запуская соответствующие ядра. Затем CPU0 загружает собственную bare-metal прошивку cpu0.bin.

![Иллюстрация из руководства Rockchip AMP: 5.2.2.1 Пример прошивки: HAL + HAL — 63](assets/en-p063-fig01.png)

Пример ITS-конфигурации для HAL + HAL:

```text
description = "FIT source file for Rockchip AMP";
        #address-cells = <1>;
        images {
                amp0 {
                // ......
                }
                amp1 {
                        description  = "Bare-metal core3";
                        data         = /incbin/("cpu1.bin");
                        type         = "firmware";
                        compression  = "none";
                        arch         = "arm";         // arm or arm64, default arm
                        cpu          = <0x1>;         // CPU ID
                        thumb        = <0>;
                        hyp          = <0>;
                        load         = <0x00800000>;  // DRAM start address
                        // Compilation configuration, automatically cleared by the compilation script after Compilation
                        compile {
                                size         = <0x00800000>; // DRAM size
                                srambase     = <0xfe480000>; // SRAM start address
                                sramsize     = <0x00010000>; // SRAM size
                                sys          = "hal"; // CPU running system: HAL or RT-Thread
                                // RT-Thread compilation configuration file
                                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
                        };
                        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
                        hash {
                                algo = "sha256";
                        };
                }
                amp2 {
                // ......
                }
                amp3 {
                // ......
                };
                // Multiple sub-nodes can be included under one images, SDK will traverse all nodes under images, and automatically compile and package according to the node information
        };
        // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
        share {
                shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
                shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
                rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
                rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
                // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the primary system
                // In pure RTOS AMP, it is defaulted to "0x01"
                // When the AMP system contains Linux, the Linux cpu0 is configured as the primary core by default
                primary = <0x0>;
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Image load list: when there are multiple amp images,
                        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
                        // When CPU0 is the boot core, the actual loading order is: amp1--
>amp2-->amp3-->...-->amp0
                        // And so on, the boot core is occupied during the boot phase and will be the last to start in the AMP
                        // Load image, in this example there are "amp1", "amp2", "amp3"
                        loadables = "amp0", "amp1", "amp2", "amp3";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
```

##### 5.2.2.2 Пример прошивки: RT-Thread + HAL

В схеме RTOS + bare metal загрузчик на CPU0 переходит в U-Boot. U-Boot читает amp.img, запускает cpu1.bin с RTOS и две bare-metal прошивки cpu2.bin и cpu3.bin. Последним на CPU0 запускается cpu0.bin.

![Иллюстрация из руководства Rockchip AMP: 5.2.2.2 Пример прошивки: RT-Thread + HAL — 66](assets/en-p066-fig01.png)

Пример ITS-конфигурации для RT-Thread + HAL:

```text
description = "FIT source file for Rockchip AMP";
        #address-cells = <1>;
        images {
                amp0 {
                // ......
                }
                amp1 {
                        description  = "Bare-metal core3";
                        data         = /incbin/("cpu1.bin");
                        type         = "firmware";
                        compression  = "none";
                        arch         = "arm";         // arm or arm64, default arm
                        cpu          = <0x1>;         // CPU ID
                        thumb        = <0>;
                        hyp          = <0>;
                        load         = <0x00800000>;  // DRAM start address
                        // Compilation configuration, automatically cleared by the compilation script after compilation
                        compile {
                                size         = <0x00800000>; // DRAM size
                                srambase     = <0xfe480000>; // SRAM start address
                                sramsize     = <0x00010000>; // SRAM size
                                sys          = "rtt"; // CPU running system: HAL or RT-Thread
                                // RT-Thread compilation configuration file
                                rtt_config   = "board/rk3562_evb1_lp4x/defconfig";
                        };
                        udelay       = <10000>; // CPU startup delay, delay time when multiple CPUs start in sequence
                        hash {
                                algo = "sha256";
                        };
                }
                amp2 {
                // ......
                }
                amp3 {
                // ......
                };
                // Under one images, multiple sub-nodes can be included, and the SDK will traverse all nodes under images, automatically compiling and packaging based on node information
        };
        // Shared memory information, compilation configuration, automatically cleared by the compilation script after compilation
        share {
                shm_base         = <0x07800000>; // Multi-core CPU shared SDRAM memory start address
                shm_size         = <0x00400000>; // Multi-core CPU shared SDRAM memory allocation size
                rpmsg_base       = <0x07C00000>; // RPMSG shared memory start address
                rpmsg_size       = <0x00500000>; // RPMSG shared memory allocation size
                // Master system core ID, when multiple AMPs contain multiple systems, this parameter sets the CPU ID of the main system
                // In pure RTOS AMP, it is defaulted to "0x01"
                // When the AMP system contains Linux, the Linux cpu0 is configured as the main core by default
                primary = <0x0>;
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Image load list: when there are multiple amp images,
                        // For example: loadables = "amp0", "amp1", "amp2", "amp3"...
                        // When CPU0 is the boot core, the actual load order is: amp1-->amp2-
->amp3-->...-->amp0
                        // And so on, the boot core is occupied during the boot phase and will be the last to start in the AMP
                        // Load image, this example has "amp1", "amp2", "amp3"
                        loadables = "amp0", "amp1", "amp2", "amp3";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
```

### 5.3 Загрузка AP + MCU

#### 5.3.1 Linux + MCU RTOS / bare metal

##### 5.3.1.1 Пример прошивки: Kernel + MCU RT-Thread / HAL

В схеме Linux + MCU загрузчик работает на CPU0 и переходит в U-Boot. U-Boot читает и запускает AMP-прошивку MCU, затем запускает Linux на CPU0. Linux запускает CPU1, CPU2 и CPU3.

![Иллюстрация из руководства Rockchip AMP: 5.3.1.1 Пример прошивки: Kernel + MCU RT-Thread / HAL — 68](assets/en-p068-fig01.png)

Пример ITS-конфигурации для Kernel + MCU RT-Thread / HAL:

```text
/dts-v1/;
/ {
        description = "Rockchip AMP FIT Image";
        #address-cells = <1>;
        images {
                mcu {
                        description  = "mcu"; // The firmware compiled from the hal, rtt
system is unified as mcu.bin
                        data         = /incbin/("./mcu.bin");
                        type         = "standalone"; // must be "standalone"
                        compression  = "none";
                        arch         = "arm"; // "arm64" or "arm", the same as U-Boot state
                        load         = <0x08200000>; // MCU program RAM start address
                        udelay       = <1000000>; // Boot delay time
                        hash {
                                algo = "sha256";
                        };
                };
        };
        configurations {
                default = "conf";
                conf {
                        description = "Rockchip AMP images";
                        rollback-index = <0x0>;
                        // Load image, only "mcu" in this example
                        loadables = "mcu";
                        signature {
                                algo = "sha256,rsa2048";
                                padding = "pss";
                                key-name-hint = "dev";
                                sign-images = "loadables";
                        };
                };
        };
};
```

### 5.4 Загрузка с разных накопителей

SDK поддерживает загрузку с eMMC, Flash, SD-карт и других носителей. Выбор носителя определяется требованиями проекта и особенностями накопителя.

#### 5.4.1 Загрузка с eMMC / Flash

В решениях Rockchip основной загрузочный носитель обычно eMMC или Flash. В нём находятся загрузчик и ядро операционной системы. Основные этапы:

1. Включение питания.

После подачи питания выполняется встроенный код Boot ROM.

Boot ROM загружает загрузчик в память.

2. Загрузчик.

Загрузчик — специальный код в загрузочном разделе eMMC / Flash.

Обычно используется U-Boot или собственный загрузчик Rockchip.

Загрузчик инициализирует аппаратную часть, загружает ядро и файловую систему и передаёт управление ядру.

3. Загрузка ядра.

Загрузчик считывает образ Linux из загрузочного раздела eMMC / Flash в память.

Он также может загрузить DTB и другие необходимые файлы.

4. Запуск ядра.

Образ ядра распаковывается в памяти и начинает выполняться.

Ядро инициализирует оборудование, прерывания и планировщик.

Устройства определяются и настраиваются по данным Device Tree Blob (DTB).

При загрузке ядро монтирует корневую файловую систему. 5. Монтирование файловой системы.

Корневая файловая система монтируется с eMMC / Flash согласно конфигурации загрузки, описанной в руководстве.

Корневая файловая система может иметь формат ext4, FAT и другие.

После монтирования становятся доступны файлы и каталоги.

6. Инициализация пространства пользователя.

Сценарии инициализации или системные службы запускают пользовательские процессы и сервисы.

Они запускают приложения и сетевые службы согласно требованиям системы.

Подробности настройки см. в разделе Storage документа Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf.

### 5.5 Загрузка с SD-карты

#### 5.5.1 Загрузка с SD-карты

Загрузочную SD-карту создают средствами RK. Она позволяет запускать новую прошивку без перезаписи внутреннего накопителя. Прошивка и временные файлы размещаются на SD-карте, используемой как основное хранилище; система может работать независимо от наличия внутреннего основного накопителя.

Подробности см. в разделах загрузки с SD-карты документов Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf и Rockchip_Developer_Guide_SD_Boot_CN.pdf.

### 5.6 Ускоренная загрузка

SDK поддерживает ускоренную загрузку. Встроенный MCU может выполнять простые операции на ранних стадиях запуска, помогая стороне AP быстрее начать необходимые задачи.

#### 5.6.1 Загрузка через SPL

В варианте SPL прошивка MCU загружается и запускается уже на стадии SPL, что уменьшает задержку между включением питания и запуском MCU.

В руководстве приведён пример RK3562: время от включения питания до завершения первой управляющей операции MCU может достигать 200 мс. Это результат исходного примера, а не измерение на ArmSoM.

Конфигурация загрузки на стадии SPL:

В rkbin измените RKTRUST/RK3562TRUST.ini, включив MCU. Адрес прошивки по умолчанию — 0x08200000.

```text
MCU=bin/rk35/rk3562_mcu_v1.00.bin,0x08200000,okay
```

В каталоге u-boot выполните следующую команду сборки.

```text
./make.sh rk3562 --spl-new
```

Прошивка MCU упаковывается в uboot.img; её загрузку и запуск выполняет SPL.

#### 5.6.2 Загрузка с двух накопителей

Два носителя — NOR + eMMC: прошивка MCU находится в небольшой Flash, прошивка AP — в eMMC. Более короткая инициализация Flash при подаче питания позволяет раньше запустить MCU.

Подробную настройку см. в Rockchip_Developer_Guide_Dual_Storage_CN.pdf.

## 6. Межъядерная связь

### 6.1 Генерация межъядерных прерываний

Связь AMP реализована как общая память плюс прерывание. Отправитель обновляет данные в памяти, затем уведомляет получателя прерыванием. Поддерживаются Mailbox, программное прерывание и SGI. Для надёжных атомарных операций также предусмотрен Hardware Spinlock.

#### 6.1.1 Прерывания Mailbox

Модуль RK Mailbox при генерации прерывания передаёт 32-битное значение регистра Command и 32-битное значение регистра Data.

```text
#ifdef PRIMARY_CPU
// Master interrupt handling, the function will be callback here
static void mbox_master_isr(int vector, void *param)
{
    HAL_MBOX_IrqHandler(vector, pMBox);
    HAL_GIC_EndOfInterrupt(vector);
}
//  Interrupt Callback in the Mailbox
static void mbox_master_cb(struct MBOX_CMD_DAT *msg, void *args)
{
    uint32_t cpu_id;
    struct MBOX_CMD_DAT rx_msg = *msg;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    // Process the received 32-bit Command data and a 32-bit Data
    printf("mbox master: receive cpu-%ld cmd=0x%lx data=0x%lx\n", cpu_id, rx_msg.CMD, rx_msg.DATA);
}
#else
// Remote interrupt handling, the function will be callback here
static void mbox_remote_isr(int vector, void *param)
{
    HAL_MBOX_IrqHandler(vector, pMBox);
    HAL_GIC_EndOfInterrupt(vector);
}
static void mbox_remote_cb(struct MBOX_CMD_DAT *msg, void *args)
{
    uint32_t cpu_id;
    struct MBOX_CMD_DAT rx_msg = *msg;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    // Process the received 32-bit Command data and a 32-bit Data
    printf("mbox remote: receive cpu-%ld cmd=0x%lx data=0x%lx\n", cpu_id, rx_msg.CMD, rx_msg.DATA);
}
#endif
#ifdef PRIMARY_CPU
// Master side channel registration
static struct MBOX_CLIENT mbox_client2_m = { "mbox-cl2m", MBOX0_CH2_B2A_IRQn,
mbox_master_cb, (void *)MBOX_CH_2 };
static void mbox_master_test(void)
{
    struct MBOX_CLIENT *mbox_cl2m;
    struct MBOX_CMD_DAT tx_msg;
    uint32_t cpu_id;
    int ret = 0;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    mbox_cl2m = &mbox_client2_m;
    tx_msg.CMD = cpu_id & 0xFU;
    tx_msg.DATA = 0x12345678;
    /* Master core uses MBOX_A2B and remote core uses MBOX_B2A */
    HAL_MBOX_Init(pMBox, MBOX_A2B);
    ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2m);
    if (ret) {
        printf("mbox_cl2m register failed, ret=%d\n", ret);
    }
    HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_B2A_IRQn, mbox_master_isr, NULL);
    HAL_GIC_Enable(MBOX0_CH2_B2A_IRQn);
    HAL_DelayMs(4000);
    printf("mbox master: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
    // Send data, 32-bit Command data and a 32-bit Data
    HAL_MBOX_SendMsg(pMBox, MBOX_CH_2, &tx_msg);
}
#endif
#ifdef CPU2
// Remote side channel registration
static struct MBOX_CLIENT mbox_client2_r = { "mbox-cl2r", MBOX0_CH2_A2B_IRQn,
mbox_remote_cb, (void *)MBOX_CH_2 };
static void mbox_remote_test(void)
{
    struct MBOX_CLIENT *mbox_cl2r;
    struct MBOX_CMD_DAT tx_msg;
    uint32_t cpu_id;
    int ret = 0;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    mbox_cl2r = &mbox_client2_r;
    tx_msg.CMD = cpu_id & 0xFU;
    tx_msg.DATA = 0x98765432;
    /* Master core uses MBOX_A2B and remote core uses MBOX_B2A */
    HAL_MBOX_Init(pMBox, MBOX_B2A);
    ret = HAL_MBOX_RegisterClient(pMBox, MBOX_CH_2, mbox_cl2r);
    if (ret) {
        printf("mbox_cl2r register failed, ret=%d\n", ret);
    }
    HAL_IRQ_HANDLER_SetIRQHandler(MBOX0_CH2_A2B_IRQn, mbox_remote_isr, NULL);
    HAL_GIC_Enable(MBOX0_CH2_A2B_IRQn);
    HAL_DelayMs(2000);
    printf("mbox remote: send cmd=0x%lx data=0x%lx\n", tx_msg.CMD, tx_msg.DATA);
    // Send data, 32-bit Command data and a 32-bit Data
    HAL_MBOX_SendMsg(pMBox, MBOX_CH_2, &tx_msg);
}
#endif
```

#### 6.1.2 Программные прерывания

Программное уведомление реализуется установкой pending для зарезервированного GIC SPI.

```text
static void soft_isr(int vector, void *param)
{
    printf("soft_isr, vector = %d\n", vector);
    HAL_GIC_EndOfInterrupt(vector);
}
static void softirq_test(void)
{
    HAL_IRQ_HANDLER_SetIRQHandler(RSVD0_IRQn, soft_isr, NULL);
    HAL_GIC_Enable(RSVD0_IRQn);
    // Trigger the software interrupt
    HAL_GIC_SetPending(RSVD0_IRQn);
}
```

#### 6.1.3 Генерация SGI

SGI — программно генерируемое прерывание GIC. Linux SMP занимает восемь non-secure SGI; ещё восемь secure SGI требуют специального согласования. Поэтому SGI обычно используются для синхронизации удалённых ядер между собой.

```text
#define IPI_CPU0               0x01
#define IPI_CPU1               0x02
#define IPI_CPU2               0x04
#define IPI_CPU3               0x08
#define IPI_TO_TARGETLIST      0
#define IPI_TO_ALL_EXCEPT_SELF 1
static void ipi_sgi_isr(int vector, void *param)
{
    uint32_t cpu_id;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    if (cpu_id == 2) {
        HAL_DelayMs(1000);
    } else if (cpu_id == 3) {
        HAL_DelayMs(2000);
    }
    printf("ipi sgi: cpu_id=%ld vector = %d\n", cpu_id, vector);
    HAL_GIC_EndOfInterrupt(vector);
}
static void ipi_sgi_test(void)
{
    uint32_t cpu_id;
    cpu_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    HAL_IRQ_HANDLER_SetIRQHandler(IPI_SGI7, ipi_sgi_isr, NULL);
    HAL_GIC_Enable(IPI_SGI7);
    if (cpu_id == 1) {
        printf("ipi sgi: cpu_id=%ld test start\n", cpu_id);
        HAL_DelayMs(2000);
        // Trigger CPU0 SGI7 interrupt
        HAL_GIC_SendSGI(IPI_SGI7, 0, IPI_TO_ALL_EXCEPT_SELF);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3, IPI_TO_TARGETLIST);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 | IPI_CPU2, IPI_TO_TARGETLIST);
        HAL_DelayMs(4000);
        HAL_GIC_SendSGI(IPI_SGI7, IPI_CPU3 | IPI_CPU2 | IPI_CPU0, IPI_TO_TARGETLIST);
    }
}
```

### 6.2 Низкоуровневые интерфейсы

Rockchip предоставляет низкоуровневые интерфейсы межъядерных прерываний и общей памяти. При переносе существующей гетерогенной системы можно заменить соответствующий низкоуровневый драйвер.

В описанной базовой реализации RK AMP поддерживает Mailbox и программные прерывания. Здесь для Linux указана некэшируемая общая память; вариант с cacheable buffer pool описан далее в разделе 6.5.1.1.

Реализация Mailbox для Linux: drivers/rpmsg/rockchip_rpmsg_mbox.c.

Реализация программных прерываний для Linux: drivers/rpmsg/rockchip_rpmsg_softirq.c.

RPMsg-Lite для bare metal: hal/middleware/rpmsg-lite/lib/rpmsg_lite/porting/platform/RKXX/rpmsg_platform.c.

RPMsg-Lite для RTOS: rtos/rockchip/common/drivers/rpmsg-lite/lib/rpmsg_lite/porting/platform/RKXX/rpmsg_platform.c.

### 6.3 Протокол RPMsg

#### 6.3.1 Стандартная инфраструктура

Rockchip предоставляет стандартную инфраструктуру RPMsg для межъядерной связи: в Linux используется RPMsg, в RTOS и bare metal — RPMsg-Lite. Они задают двоичный интерфейс обмена между ядрами AMP.

RPMsg работает поверх VirtIO — общей архитектуры виртуального ввода-вывода, также используемой виртуальными сетевыми и дисковыми устройствами. VirtIO-Ring организует обмен через общую память. Каждое кольцо vring однонаправленное: одно передаёт данные Remote Core, другое принимает данные от него.

В целом RPMsg состоит из межъядерных прерываний между Master Core и Remote Core и трёх областей общей памяти: vring0, vring1 и vdev buffer.

![Иллюстрация из руководства Rockchip AMP: 6.3.1 Стандартная инфраструктура — 76](assets/en-p076-fig01.png)

#### 6.3.2 Процесс обмена

Master и Remote взаимодействуют через прерывания и общую память. Памятью управляет Master. Для каждого направления обмена используются очереди USED и AVAIL и блоки буферов, организованные в кольца.

![Иллюстрация из руководства Rockchip AMP: 6.3.2 Процесс обмена — 77](assets/en-p077-fig01.png)

В исходном руководстве обмен от ведущего ядра описан следующей последовательностью:

1. Master получает буфер из vring0(USED) и заполняет сообщение по протоколу RPMsg.

2. Подготовленный буфер связывается с vring1(AVAIL).

3. Прерывание сообщает Remote Core о данных для обработки.

![Иллюстрация из руководства Rockchip AMP: 6.3.2 Процесс обмена — 77](assets/en-p077-fig02.png)

Для обратного направления руководство приводит следующие шаги:

1. Remote получает буфер из vring1(AVAIL) и заполняет сообщение по протоколу RPMsg.

2. Подготовленный буфер связывается с vring0(USED).

3. Прерывание уведомляет Master Core о данных для обработки.

![Иллюстрация из руководства Rockchip AMP: 6.3.2 Процесс обмена — 78](assets/en-p078-fig01.png)

После передачи буфер освобождается для следующего обмена. Отправка удалённым ядром выполняется в обратном направлении. Сами общие данные находятся в vdev buffer.

Стандартный размер буфера сообщения в SDK — 512 байт. Заголовок RPMsg занимает 16 байт, поэтому максимум полезных данных за одну передачу — 496 байт. Подробности см. в drivers/rpmsg/virtio_rpmsg_bus.c.

![Иллюстрация из руководства Rockchip AMP: 6.3.2 Процесс обмена — 78](assets/en-p078-fig02.png)

#### 6.3.3 Адаптация RPMsg

##### 6.3.3.1 RPMsg в Linux

Основные файлы Linux RPMsg:

![Иллюстрация из руководства Rockchip AMP: 6.3.3.1 RPMsg в Linux — 79](assets/en-p079-fig01.png)

kernel/drivers/rpmsg/rockchip_rpmsg_mbox.c регистрирует драйвер на Platform Bus и устройство на VirtIO Bus. Физический уровень реализован через Mailbox и общую память.

kernel/drivers/rpmsg/rockchip_rpmsg_softirq.c также регистрирует драйвер на Platform Bus и устройство на VirtIO Bus. Физический уровень использует программные прерывания и общую память.

kernel/drivers/rpmsg/virtio_rpmsg_bus.c регистрирует драйвер на VirtIO Bus и устройство на RPMsg Bus. В терминологии руководства VirtIO и Virtqueue образуют уровень MAC.

kernel/drivers/rpmsg/rpmsg_core.c создаёт RPMsg Bus и предоставляет интерфейс транспортного уровня.

kernel/drivers/rpmsg/rockchip_rpmsg_test.c содержит пример создания канала и обмена сообщениями между ядрами.

Поддержка RPMsg TTY.

Linux может представить RPMsg как TTY-устройство. Linux обычно выполняет роль Master; при соединении создаются endpoints. Канал может иметь несколько конечных точек. Когда объявленное Remote имя сервиса соответствует имени, ожидаемому Linux, драйвер привязывается к каналу и создаёт интерфейс связи.

Пример в kernel/drivers/rpmsg/rockchip_rpmsg_test.c:

```text
static struct rpmsg_device_id rockchip_rpmsg_test_id_table[] = {
    { .name = "rpmsg-ap3-ch0" },
    { .name = "rpmsg-mcu0-test" },
    { .name = "rpmsg-perf-bw-test" },
    { .name = "rpmsg-perf-pingpong-bw-test" },
    { .name = "rpmsg-latency-test" },
    { /* sentinel */ },
};
```

В rockchip_rpmsg_test.c объявлены имена сервисов. После установления связи Remote объявляет соответствующее имя; при совпадении вызывается probe.

RPMsg TTY действует аналогично: Remote объявляет подходящее имя, Linux вызывает probe и регистрирует TTY. После регистрации появляется узел /dev/ttyRPMSG.

Пример создания TTY:

После создания endpoint Remote объявляет сервис "rpmsg-tty" через rpmsg_ns_announce.

```text
ept = rpmsg_lite_create_ept(instance, RPMSG_HAL_REMOTE_TEST3_EPT, remote_ept_cb, info);
rpmsg_ns_announce(instance, ept, "rpmsg-tty", RL_NS_CREATE);
```

kernel/drivers/tty/rpmsg_tty.c

```text
static struct rpmsg_device_id rpmsg_driver_tty_id_table[] = {
    { .name = "rpmsg-tty" },
    { },
};
```

##### 6.3.3.2 Адаптация RPMsg-Lite

RPMsg-Lite — стороннее открытое решение, по структуре похожее на Linux RPMsg.

Основные файлы RPMsg-Lite:

![Иллюстрация из руководства Rockchip AMP: 6.3.3.2 Адаптация RPMsg-Lite — 81](assets/en-p081-fig01.png)

RPMsg-Lite состоит из основного компонента rpmsg_lite.c и двух необязательных: rpmsg_queue.c реализует блокирующий приём, rpmsg_ns.c — Name Service для создания и объявления endpoints.

Доступ к общей памяти реализован в virtqueue.c. Здесь определены структуры vring и virtqueue, управляющие буферами.

Перенос состоит из слоёв environment и platform. Первый адаптирует среду: rpmsg_env_bm.c для bare metal, rpmsg_env_rt_thread.c для RT-Thread; по их примеру можно поддержать другую RTOS. Второй реализован в rpmsg_platform.c и отвечает за настройку и генерацию Mailbox или программных прерываний, а также необходимые операции с кэшем и смещениями адресов.

![Иллюстрация из руководства Rockchip AMP: 6.3.3.2 Адаптация RPMsg-Lite — 82](assets/en-p082-fig01.png)

##### 6.3.3.3 RPMsg-Lite на MCU

MCU тоже использует RPMsg-Lite. При изменении адреса общей памяти нужно согласовать U-Boot и rpmsg_platform.c. В описанной базовой конфигурации RPMsg-память некэшируемая, поэтому операции обновления кэша не требуются. Отображение адресов MCU обычно инициализируется в U-Boot.

Начальный адрес RAM MCU задаётся в ITS. Между адресами MCU и физическими адресами есть смещение, включая общую память. Руководство рекомендует располагать общую память после памяти MCU.

В примере RK3562 общая память SDK начинается с 0x07C00000 и имеет размер 0x500000. Начало RAM MCU, переданное ITS в U-Boot, — 0x07b00000. Регистры описаны в TRM; код находится в u-boot/arch/arm/mach-rockchip/rk3562/rk3562.c.

```text
int fit_standalone_release(char *id, uintptr_t entry_point)
{
    /* bus m0 configuration: */
    /* open hclk_dcache / hclk_icache / clk_bus m0 rtc / fclk_bus_m0_core */
    writel(0x03180000, TOP_CRU_BASE + TOP_CRU_GATE_CON23);
    /* open bus m0 sclk / bus m0 hclk / bus m0 dclk */
    writel(0x00070000, TOP_CRU_BASE + TOP_CRU_CM0_GATEMASK);
    /* * mcu_cache_peripheral_addr * The uncache area ranges from 0x7c00000 to 0xffb400000 * and contains rpmsg shared memory */
    /* Here, 0x07c00000 to 0xffb40000 are all set to uncache to ensure shared memory is in uncache */
    writel(0x07c00000, SYS_GRF_BASE + SYS_GRF_SOC_CON5);
    writel(0xffb40000, SYS_GRF_BASE + SYS_GRF_SOC_CON6);
    /* Configure the starting address of MCU RAM */
    sip_smc_mcu_config(ROCKCHIP_SIP_CONFIG_BUSMCU_0_ID,
               ROCKCHIP_SIP_CONFIG_MCU_CODE_START_ADDR,
               0xffff0000 | (entry_point >> 16));
    /* release dcache / icache / bus m0 jtag / bus m0 */
    writel(0x03280000, TOP_CRU_BASE + TOP_CRU_SOFTRST_CON23);
    /* release pmu m0 jtag / pmu m0 */
    /* writel(0x00050000, PMU1_CRU_BASE + PMU1_CRU_SOFTRST_CON02); */
    return 0;
}
```

ITS-конфигурация MCU:

```text
/* * Copyright (C) 2023 Rockchip Electronics Co., Ltd * * SPDX-License-Identifier: GPL-2.0 */
/dts-v1/;
/ {
    description = "Rockchip AMP FIT Image";
    #address-cells = <1>;
    images {
        mcu {
            description  = "mcu";
            data         = /incbin/("./mcu.bin");
            type         = "standalone";    // must be "standalone"
            compression  = "none";
            arch         = "arm";        // "arm64" or "arm", the same as U-Boot state
            load         = <0x07b00000>; //MCU RAM starting address
            udelay       = <1000000>;
            hash {
                algo = "sha256";
            };
        };
    };
    configurations {
        default = "conf";
        conf {
            description = "Rockchip AMP images";
            rollback-index = <0x0>;
            loadables = "mcu";
            signature {
                algo = "sha256,rsa2048";
                padding = "pss";
                key-name-hint = "dev";
                sign-images = "loadables";
            };
        };
    };
};
```

В gcc_bus_m0.ld видно, что адрес общей памяти задаётся со смещением:

```text
/* SPDX-License-Identifier: BSD-3-Clause */
/* * Copyright (c) 2023 Rockchip Electronics Co., Ltd. */
MEMORY
{
    # RAM starting address, actual physical address 0x07b00000
    RAM(rxw) : ORIGIN = 0x00000000, LENGTH = 0x100000
    # RPMsg shared memory address, actual physical address 0x07c00000
    LINUX_RPMSG (rxw) : ORIGIN = 0x00100000, LENGTH = 0x00500000
}
```

Памятью управляет Master, а MCU как Remote получает из vring физические адреса буферов. При приёме и передаче нужно преобразовать их с учётом смещения; см. rpmsg_platform.c.

```text
#ifdef HAL_MCU_CORE
/* MCU offset address */
#ifdef HAL_CACHE_DECODED_ADDR_BASE
#define RL_PHY_MCU_OFFSET HAL_CACHE_DECODED_ADDR_BASE
#else
#define RL_PHY_MCU_OFFSET (0U)
#endif
#endif
/** * platform_patova * * Dummy implementation * */
void *platform_patova(uint32_t addr)
{
#ifdef HAL_MCU_CORE
    addr -= RL_PHY_MCU_OFFSET;
#endif
    return ((void *)(char *)addr);
}
```

### 6.4 Конфигурация сборки RPMsg

#### 6.4.1 Kernel + RT-Thread

Конфигурация ядра Linux:

```text
## Chapter-6 Enable MailBox support
CONFIG_MAILBOX=y
CONFIG_ROCKCHIP_MBOX=y
## Chapter-6 MailBox interrupt triggering
CONFIG_RPMSG_ROCKCHIP_MBOX=y
CONFIG_RPMSG_VIRTIO=y
```

Включение TTY:

```text
CONFIG_RPMSG_TTY=y
```

Конфигурация RT-Thread: выполните scons --menuconfig.

```text
## Chapter-6 Enable RPMsg-Lite support
CONFIG_RT_USING_RPMSG_LITE=y
## Chapter-6 Enable Linux+RTT RPMsg
CONFIG_RT_USING_LINUX_RPMSG=y
```

#### 6.4.2 Kernel + HAL

Конфигурация ядра Linux:

```text
## Chapter-6 Enable MailBox support
CONFIG_MAILBOX=y
CONFIG_ROCKCHIP_MBOX=y
## Chapter-6 MailBox interrupt trigger
CONFIG_RPMSG_ROCKCHIP_MBOX=y
CONFIG_RPMSG_VIRTIO=y
```

Конфигурация HAL: RPMsg включён по умолчанию. Активация тестового примера описана в разделе тестирования RPMsg.

```text
// Enable in test_demo.c
#define RPMSG_LINUX_TEST
```

#### 6.4.3 RT-Thread + HAL

Конфигурация RT-Thread: выполните scons --menuconfig.

```text
## Chapter-6 Enable RPMsg-Lite support
CONFIG_RT_USING_RPMSG_LITE=y
```

### 6.5 Пример тестирования RPMsg

#### 6.5.1 Kernel + RT-Thread

В инфраструктуре межъядерной связи Linux RPMsg используется VirtIO. Основные пути исходного кода приведены ниже.

```text
kernel/drivers/rpmsg/rpmsg_core.c
kernel/drivers/rpmsg/virtio_rpmsg_bus.c
kernel/drivers/rpmsg/rockchip_rpmsg_softirq.c
kernel/include/linux/rpmsg/rockchip_rpmsg.h
```

##### 6.5.1.1 Общая память

В демонстрации SDK для RPMsg выделено 5 MiB общей памяти: 4 MiB для области VRING BUFFER и 1 MiB для VDEV BUFFER.

По умолчанию общая память Linux RPMsg некэшируемая; обе стороны примера используют uncacheable.

Путь Linux DTS: SDK/kernel/arch/arm64/boot/dts/rockchip/rkxxxx-amp.dtsi.

```text
reserved-memory {
    #address-cells = <2>;
    #size-cells = <2>;
    ranges;
    /* remote amp core address */
    amp_reserved: amp@2e00000 {
        reg = <0x0 0x2e00000 0x0 0x1200000>;
        no-map;
    };
    rpmsg_reserved: rpmsg@7c00000 {
        reg = <0x0 0x07c00000 0x0 0x400000>;
        no-map;
    };
    rpmsg_dma_reserved: rpmsg-dma@8000000 {
        compatible = "shared-dma-pool";
        reg = <0x0 0x08000000 0x0 0x100000>;
        no-map;
    };
};
```

Путь RTT: SDK/rtos/bsp/rockchip/rk3308-32/board/common/board_base.c.

```text
1.MMU is mapped as unCache
    {LINUX_SHMEM_BASE, LINUX_SHMEM_BASE + LINUX_SHMEM_SIZE - 1, LINUX_SHMEM_BASE,
UNCACHED_MEM},
```

Для повышения скорости область данных можно сделать cacheable. В исходном примере RK3576 при CPU 1416 МГц и DDR 2112 МГц передача Linux → RTT дала 77 MB/s для uncacheable и 1880 MB/s для cacheable. Эти числа относятся к условиям примера Rockchip и не являются результатами тестирования ArmSoM.

Атрибуты кэша общей памяти на двух сторонах желательно согласовать. Если Linux использует cacheable, а RTT — uncacheable, после записи Linux нужен clean, чтобы RTT увидел данные; перед чтением изменённых RTT данных Linux должен инвалидировать устаревшие строки своего кэша. Границы передачи владения буфером следует согласовать с реализацией SDK.

Для cacheable общей памяти требуется изменить инфраструктуру драйвера Linux RPMsg.

Путь: SDK/kernel/drivers/rpmsg/virtio_rpmsg_bus.c.

В приведённом примере dma_alloc_coherent заменяется на ioremap_cache, где addr — адрес rpmsg_dma_reserved.

```text
--- a/drivers/rpmsg/virtio_rpmsg_bus.c
+++ b/drivers/rpmsg/virtio_rpmsg_bus.c
@@ -913,9 +913,7 @@ static int rpmsg_probe(struct virtio_device *vdev)
        total_buf_space = vrp->num_bufs * vrp->buf_size;
        /* allocate coherent memory for the buffers */
-       bufs_va = dma_alloc_coherent(vdev->dev.parent,
-                                    total_buf_space, &vrp->bufs_dma,
-                                    GFP_KERNEL);
+       bufs_va = ioremap_cache(addr, total_buf_space);
```

Путь RTT: SDK/rtos/bsp/rockchip/rkxxxx/board/common/board_base.c.

```text
struct mem_desc platform_mem_desc[] =
{
#if (defined(LINUX_RPMSG_VRING_BASE) && defined(LINUX_RPMSG_BUFF_BASE))
    {LINUX_RPMSG_VRING_BASE, LINUX_RPMSG_VRING_BASE + LINUX_RPMSG_VRING_SIZE,
LINUX_RPMSG_VRING_BASE, NORMAL_NOCACHE_MEM},
    {LINUX_RPMSG_BUFF_BASE, LINUX_RPMSG_BUFF_BASE + LINUX_RPMSG_BUFF_SIZE,
LINUX_RPMSG_BUFF_BASE, NORMAL_MEM},
#endif
}
```

Область vring хранит адреса буферов для управления, buff_pool — сами пакеты. Основные обращения к данным происходят в buff_pool; здесь cacheable делают только эту область. LINUX_RPMSG_VRING_BASE соответствует rpmsg_reserved, LINUX_RPMSG_BUFF_BASE — rpmsg_dma_reserved.

##### 6.5.1.2 Тестовый пример

###### 6.5.1.2.1 Пример Linux

Измените конфигурацию ядра kernel/arch/arm64/configs/xxxx_defconfig.

```text
CONFIG_RPMSG_ROCKCHIP_TEST
```

Либо настройте параметры через menuconfig:

```text
## Chapter-6 Open the configuration interface
make ARCH=arm64 rkxxxx_linux_defconfig
make ARCH=arm64 menuconfig
    # Enable the following macro switch
    CONFIG_RPMSG_ROCKCHIP_TEST
## Chapter-6 Save the configuration
make ARCH=arm64 savedefconfig
cp defconfig arch/arm64/configs/rkxxxx_linux_defconfig
```

Тест Linux: kernel/drivers/rpmsg/rockchip_rpmsg_test.c.

```text
1. Main process of the demo
static struct rpmsg_driver rockchip_rpmsg_test = {
    .drv.name   = KBUILD_MODNAME,
    .drv.owner  = THIS_MODULE,
    .id_table   = rockchip_rpmsg_test_id_table,
    .probe      = rockchip_rpmsg_test_probe,
    .callback   = rockchip_rpmsg_test_cb,
    .remove     = rockchip_rpmsg_test_remove,
};
2. rockchip_rpmsg_test_id_table
/* Wait for remote core announce a new ept name from the master core, and if it matches the name in the following list, enter the probe function */
static struct rpmsg_device_id rockchip_rpmsg_test_id_table[] = {
    { .name = "rpmsg-ap3-ch0" },
    { .name = "rpmsg-mcu0-test" },
    { /* sentinel */ },
};
3. rockchip_rpmsg_test_probe
static int rockchip_rpmsg_test_probe(struct rpmsg_device *rp)
{
    int ret, size;
    uint32_t master_ept_id, remote_ept_id;
    struct instance_data *idata;
    master_ept_id = rp->src;
    remote_ept_id = rp->dst;
    dev_info(&rp->dev, "new channel: 0x%x -> 0x%x!\n", master_ept_id,
             remote_ept_id);
    /* probe send a message to the remote to let it know the master ept id */
    ret = rpmsg_send(rp->ept, LINUX_TEST_MSG_1, strlen(LINUX_TEST_MSG_1));
    if (ret) {
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
    /* Run the test */
    ret = rpmsg_sendto(rp->ept, LINUX_TEST_MSG_2, strlen(LINUX_TEST_MSG_2),
                       remote_ept_id);
    if (ret) {
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
    return 0;
}
4. rockchip_rpmsg_test_cb
static int rockchip_rpmsg_test_cb(struct rpmsg_device *rp, void *payload,
                                  int payload_len, void *priv, u32 src)
{
    int ret, size;
    uint32_t remote_ept_id;
    struct instance_data *idata = dev_get_drvdata(&rp->dev);
    /* After the master sends a message to the remote, the remote will also send a message back */
    remote_ept_id = src;
    dev_info(&rp->dev, "rx msg %s rx_count %d(remote_ept_id: 0x%x)\n",
            (char *)payload, ++idata->rx_count, remote_ept_id);
    /* Test to stop after receiving and sending 10000 messages */
    if (idata->rx_count >= MSG_LIMIT) {
        dev_info(&rp->dev, "Rockchip rpmsg test exit!\n");
        return 0;
    }
    /* After receiving data, send another message to the remote */
    ret = rpmsg_sendto(rp->ept, LINUX_TEST_MSG_2, strlen(LINUX_TEST_MSG_2),
                       remote_ept_id);
    if (ret)
        dev_err(&rp->dev, "rpmsg_send failed: %d\n", ret);
        return ret;
    }
```

Описание интерфейсных функций:

| Функция | Описание |
| --- | --- |
| rpmsg_send() | Отправка сообщения удалённому процессору |
| rpmsg_sendto() | Отправка сообщения на заданный удалённый endpoint |

В вызовах обмена src обозначает локальный endpoint, dst — удалённый. Для Master локальным является master ept id, удалённым — remote ept id; для Remote — наоборот. В исходном пояснении src/dst были перепутаны.

###### 6.5.1.2.2 Пример RTT

Настройка через scons --menuconfig.

```text
CONFIG_RT_USING_RPMSG_LITE=y
CONFIG_RT_USING_LINUX_RPMSG=y
CONFIG_RT_USING_COMMON_TEST_LINUX_RPMSG_LITE=y
```

Тест RTT: rtos/bsp/rockchip/common/tests/rpmsg_test.c.

```text
static void rpmsg_linux_test(void)
{
    int j;
    uint32_t master_id, remote_id;
    struct rpmsg_info_t *info;
    struct rpmsg_block_t *block;
    rpmsg_queue_handle remote_queue;
    char *rx_msg = (char *)rt_malloc(RL_BUFFER_PAYLOAD_SIZE);
    uint32_t master_ept_id;
    uint32_t ept_flags;
    void *ns_cb_data;
    rpmsg_share_mem_check();
    master_id = MASTER_ID;
    remote_id = HAL_CPU_TOPOLOGY_GetCurrentCpuId();
    rt_kprintf("rpmsg remote: remote core cpu_id-%ld\n", remote_id);
    rt_kprintf("rpmsg remote: shmem_base-0x%lx shmem_end-%lx\n",
    RPMSG_LINUX_MEM_BASE, RPMSG_LINUX_MEM_END);
    info = malloc(sizeof(struct rpmsg_info_t));
    if (info == NULL) {
        rt_kprintf("info malloc error!\n");
        while (1) {
            ;
        }
    }
    info->private = malloc(sizeof(struct rpmsg_block_t));
    if (info->private == NULL) {
        rt_kprintf("info malloc error!\n");
        while (1) {
            ;
        }
    }
    /* Initialize rpmsg endpoint */
    info->instance = rpmsg_lite_remote_init((void *)RPMSG_LINUX_MEM_BASE,
    RL_PLATFORM_SET_LINK_ID(master_id, remote_id), RL_NO_FLAGS);
    rpmsg_lite_wait_for_link_up(info->instance);
    rt_kprintf("rpmsg remote: link up! link_id-0x%lx\n",
               info->instance->link_id);
    rpmsg_ns_bind(info->instance, rpmsg_ns_cb, &ns_cb_data);
    remote_queue  = rpmsg_queue_create(info->instance);
    info->ept = rpmsg_lite_create_ept(info->instance,
    RPMSG_RTT_REMOTE_TEST3_EPT_ID, rpmsg_queue_rx_cb, remote_queue);
    /* The remote core announce a new ept name corresponding to the master end */
    ept_flags = RL_NS_CREATE;
    rpmsg_ns_announce(info->instance, info->ept,
    RPMSG_RTT_REMOTE_TEST_EPT3_NAME, ept_flags);
    /****************** rpmsg test run **************/
    for (j = 0; j < 100; j++)
    {
        rpmsg_queue_recv(info->instance, remote_queue,
                         (uint32_t *)&master_ept_id, rx_msg,
                         RL_BUFFER_PAYLOAD_SIZE, RL_NULL, RL_BLOCK);
    //    rpmsg_queue_recv_nocopy(remote_rpmsg, remote_queue, (uint32_t *)&src,
                                  (char **)&rx_msg, RL_NULL, RL_BLOCK);
        rt_kprintf("rpmsg remote: master_ept_id-0x%lx rx_msg: %s\n",
                   master_ept_id, rx_msg);
        rpmsg_lite_send(info->instance, info->ept, master_ept_id,
        RPMSG_RTT_TEST_MSG, strlen(RPMSG_RTT_TEST_MSG), RL_BLOCK);
    }
}
```

Описание интерфейсных функций:

| Функция | Описание |
| --- | --- |
| rpmsg_lite_remote_init() | Инициализация удалённой стороны RPMsg-Lite |
| rpmsg_queue_create() | Создание очереди RPMsg-Lite |
| rpmsg_lite_create_ept() | Создание endpoint |
| rpmsg_queue_recv() | Принятые данные копируются в буфер |
| rpmsg_ns_bind() | Привязка Name Service: endpoint 0x35 передаёт имена новых каналов |
| rpmsg_ns_announce() | Объявление имени нового удалённого endpoint |
| rpmsg_lite_send() | Отправка сообщения |

###### 6.5.1.2.3 Журнал успешного теста

После успешной инициализации Linux RPMsg в журнале ведущего ядра появляются следующие строки из исходного примера.

```text
[    1.105178] rockchip-rpmsg 7c00000.rpmsg: Rockchip RPMSG platform probe.
[    1.105228] rockchip-rpmsg 7c00000.rpmsg: assigned reserved memory node rpmsg_dma@8000000
[    1.105239] rockchip-rpmsg 7c00000.rpmsg: rpdev vdev0: vring0 0x7c00000, vring1 0x7c08000
[    1.105720] virtio_rpmsg_bus virtio0: RPMSG host is online
```

После объявления Name Service удалённым ядром Linux выводит следующие строки.

```text
[    1.105808] virtio_rpmsg_bus virtio0: creating channel rpmsg-ap3-ch0 addr 0xc3
[    1.105980] rockchip_rpmsg_test virtio0.rpmsg-ap3-ch0.-1.195: RPMSG master: new channel:
0x400 -> 0xc3!
```

rpmsg-ap3-ch0 — имя endpoint; 0x400 — endpoint Master, 0xc3 — endpoint Remote.

Журнал запуска RT-Thread в исходном примере:

```text
[(3)0.101.712] rpmsg remote: remote core cpu_id-3
[(3)0.101.890] rpmsg remote: shmem_base-0x7c00000 shmem_end-8100000
[(3)0.506.840] rpmsg remote: link up! link_id-0x3
```

Определения флагов RPMsg:

```text
/* RPMSG flag bit definition * bit 0: Set 1 to indicate remote processor is ready * bit 1: Set 1 to use reserved memory region as shared DMA pool * bit 2: Set 1 to use cached share memory as vring buffer */
#define RPMSG_REMOTE_IS_READY            BIT(0)
#define RPMSG_SHARED_DMA_POOL            BIT(1)
#define RPMSG_CACHED_VRING                BIT(2)
```

#### 6.5.2 RT-Thread + HAL

Связь RPMsg-Lite в RTOS основана на общей памяти и межъядерных прерываниях. По умолчанию CPU1 выступает Master, остальные CPU — Remote.

##### 6.5.2.1 Общая память

Начальный адрес и размер общей памяти RT-Thread:

Распределение общей области памяти:

Путь: rtos/bsp/rockchip/rkxxxx-32/gcc_arm.ld.S.

```text
.share_lock (NOLOAD):
    {
        . = ALIGN(64);
        PROVIDE(__spinlock_mem_start__ = .);
        . += __SPINLOCK_MEM_SIZE;
        PROVIDE(__spinlock_mem_end__ = .);
        . = ALIGN(64);
    } > SHMEM
   .share_rpmsg (NOLOAD):
    {
        . = ALIGN(0x1000);
        PROVIDE(__share_rpmsg_start__ = .);
        . += __SHARE_RPMSG_SIZE;
        PROVIDE(__share_rpmsg_end__ = .);
        . = ALIGN(0x1000);
    } > SHMEM
    .share_data :
    {
        . = ALIGN(64);
        PROVIDE(__share_data_start__ = .);
        KEEP(*(.share_data))
        PROVIDE(__share_data_end__ = .);
        . = ALIGN(64);
    } > SHMEM AT > DRAM
```

Начальный адрес и размер общей памяти HAL:

Распределение общей области памяти:

Путь: hal/project/rkxxxx/GCC/gcc_arm.ld.S.

```text
.share_lock (NOLOAD) :
     {
         . = ALIGN(64);
         PROVIDE(__spinlock_mem_start__ = .);
         . += __SPINLOCK_MEM_SIZE;
         PROVIDE(__spinlock_mem_end__ = .);
         . = ALIGN(64);
     } > SHMEM
     .share_rpmsg (NOLOAD):
     {
         . = ALIGN(0x1000);
         PROVIDE(__share_rpmsg_start__ = .);
         . += SHRPMSG_SIZE; // Assuming SHRPMSG_SIZE is a typo and should be
__SHARE_RPMSG_SIZE
         PROVIDE(__share_rpmsg_end__ = .);
         . = ALIGN(0x1000);
     } > SHMEM
     .share_ramfs (NOLOAD):
     {
         . = ALIGN(0x1000);
         PROVIDE(__share_ramfs_start__ = .);
         . += SHRAMFS_SIZE;
         PROVIDE(__share_ramfs_end__ = .);
         . = ALIGN(0x1000);
     } > SHMEM
     .share_log (NOLOAD):
     {
         . = ALIGN(64);
         PROVIDE(__share_log0_start__ = .);
         . += SHLOG0_SIZE;
         PROVIDE(__share_log0_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log1_start__ = .);
         . += SHLOG1_SIZE;
         PROVIDE(__share_log1_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log2_start__ = .);
         . += SHLOG2_SIZE;
         PROVIDE(__share_log2_end__ = .);
         . = ALIGN(64);
         PROVIDE(__share_log3_start__ = .);
         . += SHLOG3_SIZE;
         PROVIDE(__share_log4_end__ = .); // Assuming there was a typo and the correct
symbol should be __share_log4_end__
         . = ALIGN(64);
     } > SHMEM
```

##### 6.5.2.2 Тестовый пример

###### 6.5.2.2.1 Пример RTT

Путь: SDK/rtos/bsp/rockchip/rkxxxx-32.

Настройка меню: scons --menuconfig.

```text
CONFIG_RT_USING_RPMSG_LITE=y
CONFIG_RT_USING_COMMON_TEST_RPMSG_LITE=y
```

Тест RTT: rtos/bsp/rockchip/common/tests/rpmsg_test.c.

Основной код RPMsg-Lite находится в rtos/bsp/rockchip/common/drivers/rpmsg-lite. Описание интерфейсов приведено ниже.

| Функция | Описание |
| --- | --- |
| rpmsg_lite_master_init() | Инициализация ведущей стороны RPMsg-Lite |
| rpmsg_lite_remote_init() | Инициализация удалённой стороны RPMsg-Lite |
| rpmsg_lite_wait_for_link_up() | Ожидание установления связи удалённой стороной RPMsg-Lite |
| rpmsg_queue_create() | Создание очереди RPMsg-Lite |
| rpmsg_lite_create_ept() | Создание endpoint |
| rpmsg_queue_recv() | Копирование принятых данных в локальный буфер |
| rpmsg_queue_recv_nocopy() | Возврат указателя на принятые данные без копирования |
| rpmsg_lite_send() | Отправка сообщения |

```text
Send a message
```

###### 6.5.2.2.2 Пример HAL

Файл: SDK/hal/project/rkxxxx/src/main.c.

```text
#define TEST_DEMO
#define TEST_USE_RPMSG_INIT
```

Файл: SDK/hal/project/rkxxxx/src/test_demo.c.

```text
#define RPMSG_TEST
```

Тест HAL: hal/project/rkxxxx/src/test_demo.c.

Основной код RPMsg-Lite находится в hal/middleware/rpmsg-lite/. Описание интерфейсов приведено ниже.

| Функция | Описание |
| --- | --- |
| rpmsg_lite_master_init() | Инициализация ведущей стороны RPMsg-Lite |
| rpmsg_lite_remote_init() | Инициализация удалённой стороны RPMsg-Lite |
| rpmsg_lite_wait_for_link_up() | Ожидание установления связи удалённой стороной RPMsg-Lite |
| rpmsg_lite_create_ept() | Создание endpoint |
| rpmsg_lite_send() | Отправка сообщения |

###### 6.5.2.2.3 Результаты исходного теста

Для просмотра журнала введите команду в последовательном терминале.

```text
## Chapter-6 RPMSG Test Command
msh >rpmsg_master_test
## Chapter-6 Test Results
[(1)21.952.622] rpmsg probe remote cpu(0) ept(0x80008000) success!
[(1)22.031.235] rpmsg probe remote cpu(2) ept(0x80008002) success!
[(1)22.086.368] rpmsg probe remote cpu(3) ept(0x80008003) success!
[(1)22.086.410] rpmsg_master_send: master[1]-->remote[0], remote ept addr = 0x80008000
[(0)22.152.780]rpmsg_remote_recv: remote[0]<--master[1], master ept addr = 0x80000000
[(0)22.152.959]rpmsg_remote_send: remote[0]-->master[1], master ept addr = 0x80000000
[(1)22.153.616] rpmsg_master_recv: master[1]<--remote[0], remote ept addr = 0x80008000
[(1)22.154.272] rpmsg_master_send: master[1]-->remote[2], remote ept addr = 0x80008002
[(2)22.231.397]rpmsg_remote_recv: remote[2]<--master[1], master ept addr = 0x80000002
[(2)22.231.580]rpmsg_remote_send: remote[2]-->master[1], master ept addr = 0x80000002
[(1)22.232.237] rpmsg_master_recv: master[1]<--remote[2], remote ept addr = 0x80008002
[(1)22.232.893] rpmsg_master_send: master[1]-->remote[3], remote ept addr = 0x80008003
[(3)22.286.525]rpmsg_remote_recv: remote[3]<--master[1], master ept addr = 0x80000003
[(3)22.286.706]rpmsg_remote_send: remote[3]-->master[1], master ept addr = 0x80000003
[(1)22.287.363] rpmsg_master_recv: master[1]<--remote[3], remote ept addr = 0x80008003
[(1)22.288.017] rpmsg test OK!
```

## 7. Прерывания

### 7.1 Cortex-A GIC

Cortex-A GIC (Generic Interrupt Controller) управляет запросами прерываний, распределяет их и направляет соответствующему ядру для выполнения обработчика.

Используются GICv2 и GICv3. Поддержка распространённых SoC приведена в таблице.

```text
SoC
```

| SoC | GICv2 | GICv3 |
| --- | --- | --- |
| RK3588 |  | ✔ |
| Rk3576 | ✔ |  |
| RK3568 |  | ✔ |
| RK3562 | ✔ |  |
| RK3358 | ✔ |  |
| RK3308 | ✔ |  |

```text
RK3308
```

GIC имеет три типа прерываний:

1. SGI: номера 0–15, программно генерируемые прерывания, частные для каждого CPU.

2. PPI: номера 16–31, частные периферийные прерывания каждого CPU.

3. SPI: номера от 32, общие периферийные прерывания для CPU.

Эти типы позволяют реализовать разные сценарии. В конфигурационных файлах для групп прерываний используются соответствующие смещения номеров.

Порядок использования прерываний:

1. Настройте приоритет GIC и ядро CPU, которое должно выполнять обработчик данного прерывания.

2. Зарегистрируйте обработчик для заданного номера прерывания.

3. Разрешите прерывание, чтобы система могла принять и обработать его.

4. Настройте прерывание самого периферийного модуля.

Ниже GPIO-прерывание RK3562 в bare metal и RTOS используется как пример настройки.

#### 7.1.1 Настройка GIC

Найдите структуру irqsConfig в проекте bare metal или RTOS.

RTOS: <AMP_SDK>/rtos/bsp/rockchip/rk3562/board/common/board_base.c.

Bare metal: <AMP_SDK>/hal/project/rk3562/src/main.c или <AMP_SDK>/hal/project/rk3308/src/main.c; конфигурация зависит от макросов сборки.

Структура кода:

```text
#define DEFAULT_IRQ_CPU 1 /* Points to the core of main system, modify according to actual situation */
struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
    GIC_AMP_IRQ_CFG_ROUTE(GPIO0_IRQn, 0xd0, CPU_GET_AFFINITY(0, 0)), /* Add a path for CPU0 to respond to CPU0 interrupts */
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0)),   /* sentinel */
};
struct GIC_IRQ_AMP_CTRL irqConfig = {
    .cpuAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
    .defPrio = 0xd0,
    .defRouteAff = CPU_GET_AFFINITY(DEFAULT_IRQ_CPU, 0),
    .irqsCfg = &irqsConfig[0],
};
int main()
{
    HAL_GIC_Init(&irqConfig);
    // ......
}
```

В многосистемной конфигурации bare metal и RTOS эта таблица общая для всех систем.

Параметры, изменяемые пользователем:

DEFAULT_IRQ_CPU — ядро, обслуживающее по умолчанию все прерывания, не перечисленные в irqsConfig.

Параметры GIC_AMP_IRQ_CFG_ROUTE(irqNum, Priority, CPU_GET_AFFINITY(cpuID, cpuCluster)):

```text
Description
```

| Параметр | Описание |
| --- | --- |
| irqNum | Номер прерывания |
| Priority | Приоритет (оставить значение по умолчанию) |
| cpuID | Номер CPU, обслуживающего прерывание |
| cpuCluster | Кластер CPU; для RK3562 всегда 0 |

#### 7.1.2 Обработчики GIC

##### 7.1.2.1 Обработчики GIC в bare metal

Пример использования прерывания по нарастающему фронту на GPIO0 C4.

```text
// Main entry point for GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO0, GPIO_BANK0);
    // ......
}
// Interrupt callback function for GPIO0 C4 pin
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the GIC (GPIO0) interrupt service routine, enable the interrupt, and allow the system to receive module interrupts */
    HAL_IRQ_HANDLER_SetIRQHandler(GPIO0_IRQn, gpio_isr, NULL);
    HAL_GIC_Enable(GPIO0_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO0 C4 as an input pin */
    HAL_GPIO_SetPinDirection(GPIO0, GPIO_PIN_C4, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO0 C4, and enable the IO interrupt for GPIO0 C4 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK0, GPIO_PIN_C4, c4_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO0, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt to allow the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO0, GPIO_PIN_C4);
}
```

Настройка в примере делится на две части.

Настройка GIC: зарегистрировать gpio_isr и разрешить приём прерываний системой. Этот интерфейс общий для всех прерываний.

Настройка модуля: разрешить периферийному устройству генерировать сигнал в GIC. Здесь нужны правила конкретного модуля и его документация.

Поскольку 32 вывода GPIO используют одно общее прерывание, HAL_GPIO_IRQHandler распределяет вызовы по callbacks конкретных выводов.

##### 7.1.2.2 Обработчики GIC в RTOS

В RTOS можно использовать интерфейс bare metal или собственную обёртку RTOS. Ниже показана настройка нарастающего фронта GPIO0 C4 через интерфейс RTOS.

```text
// Example of using GPIO pin interrupts
void irq_callback(void *args)
{
    // .......
}
static void gpio_test(void)
{
    struct rt_device_pin_mode   pin_mode;
    rt_device_t pin_dev = rt_device_find("pin");
    rt_device_open(pin_dev, RT_DEVICE_FLAG_RDWR);
    pin_mode.pin = BANK_PIN(0, GPIO_PIN_C4); /* GPIO0_C4 */
    pin_mode.mode = PIN_MODE_INPUT;
    rt_device_control(pin_dev, 0, &pin_mode);
    rt_pin_attach_irq(pin_mode.pin, PIN_IRQ_MODE_RISING, irq_callback, RT_NULL);
    rt_pin_irq_enable(pin_mode.pin, PIN_IRQ_ENABLE);
}
```

Подробности зависят от модуля; см. официальную документацию RT-Thread.

### 7.2 Cortex-M NVIC

Cortex-M NVIC (Nested Vectored Interrupt Controller) управляет внутренними и внешними запросами прерываний и направляет их обработчикам соответствующего ядра.

Поддерживаемые платформы: RK3588, RK3576 и RK3562 с ядром MCU Cortex-M0.

Cortex-M0 поддерживает до 32 внешних прерываний. Дополнительные источники обслуживаются через второй уровень обработки INTMUX.

Порядок использования NVIC:

1. Инициализируйте таблицу векторов и контроллер NVIC.

2. Зарегистрируйте обработчик для заданного номера прерывания.

3. Разрешите приём прерывания системой.

4. Разрешите генерацию прерывания в периферийном модуле.

Ниже приведён пример GPIO-прерывания RK3562 MCU в bare metal и RTOS.

#### 7.2.1 Инициализация NVIC

Инициализация NVIC уже входит в HAL_Init(). Можно вызвать HAL_Init() или отдельно выполнить необходимые операции NVIC.

```text
/* <AMP_SDK>/hal/lib/hal/src/hal_base.c */
HAL_Status HAL_Init(void)
{
#ifdef __CORTEX_M
#ifdef HAL_NVIC_MODULE_ENABLED
    /* Set Interrupt Group Priority */
    HAL_NVIC_Init();
    /* Set Interrupt Group Priority */
    HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_DEFAULT);
#endif
#endif
    // .......
    return HAL_OK;
}
```

#### 7.2.2 Обработчики NVIC

##### 7.2.2.1 Обработчики GIC в bare metal

Пример прерывания по нарастающему фронту GPIO0 C4.

```text
// Main entry point for the GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO0, GPIO_BANK0);
    // ......
}
// Interrupt callback function for the GPIO0 C4 pin
static HAL_Status c4_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO pin interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the NVIC (GPIO0) interrupt service routine and enable the interrupt to allow the system to receive module interrupts */
    HAL_INTMUX_SetIRQHandler(GPIO1_IRQn, gpio_isr, NULL);
    HAL_INTMUX_EnableIRQ(GPIO1_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO0 C4 as an input pin */
    HAL_GPIO_SetPinDirection(GPIO0, GPIO_PIN_C4, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO0 C4, and enable the IO interrupt for GPIO0 C4 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK0, GPIO_PIN_C4, c4_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO0, GPIO_PIN_C4, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt to allow the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO0, GPIO_PIN_C4);
}
```

Настройка в примере состоит из двух частей.

Настройка NVIC: зарегистрировать gpio_isr и разрешить системный приём. Из-за INTMUX соответствующие операции NVIC обёрнуты интерфейсами HAL_INTMUX; принцип использования остаётся тем же.

Настройка модуля: разрешить генерацию сигнала для NVIC по правилам конкретного периферийного устройства.

Поскольку 32 вывода GPIO имеют общий сигнал прерывания, HAL_GPIO_IRQHandler вызывает callback нужного вывода.

##### 7.2.2.2 Обработчики NVIC в RTOS

См. раздел обработчиков GIC в RTOS.

### 7.3 Контроллер прерываний RISC-V

RISC-V IPIC (Integrated Programmable Interrupt Controller) управляет внутренними и внешними запросами прерываний и направляет их соответствующему ядру.

Поддерживаемая платформа: RK3568 с MCU RISC-V.

Описанный контроллер обслуживает до 32 прерываний. Для дополнительных источников применяется второй уровень INTMUX.

Порядок использования IPIC:

1. Инициализируйте таблицу векторов и IPIC.

2. Зарегистрируйте обработчик заданного прерывания.

3. Разрешите приём прерывания системой.

4. Разрешите генерацию прерывания в периферийном модуле.

Пример: GPIO-прерывание MCU RISC-V RK3568 в bare metal и RTOS.

#### 7.3.1 Инициализация IPIC

Инициализация IPIC входит в HAL_INTMUX_Init(). Можно вызвать эту функцию или отдельно выполнить операции IPIC.

```text
/* <AMP_SDK>/hal/lib/hal/src/hal_intmux.c */
HAL_Status HAL_INTMUX_Init(void)
{
    // .......
#ifdef HAL_RISCVIC_MODULE_ENABLED
    HAL_RISCVIC_Init();
#endif
    // .......
    return HAL_OK;
}
```

#### 7.3.2 Обработчики IPIC

##### 7.3.2.1 Обработчики GIC в bare metal

Пример прерывания по нарастающему фронту GPIO4 C5.

```text
// The main entry for the GPIO0 interrupt service routine
static void gpio_isr(int vector, void *param)
{
    // ......
    HAL_GPIO_IRQHandler(GPIO4, GPIO_BANK4);
    // ......
}
// The interrupt callback function for the GPIO0 C4 pin
static HAL_Status c5_call_back(eGPIO_bankId bank, uint32_t pin, void *args)
{
    // ......
    return HAL_OK;
}
// Example of using GPIO interrupts
static void gpio_test(void)
{
    // ......
    /* Step 1: GIC Configuration */
    /* Set the interrupt service routine for IPIC (GPIO4), enable the interrupt, and allow the system to receive module interrupts */
    HAL_INTMUX_SetIRQHandler(GPIO4_IRQn, gpio_isr, NULL);
    HAL_INTMUX_EnableIRQ(GPIO4_IRQn);
    /* Step 2: Module Configuration */
    /* Set GPIO4 C5 as an input */
    HAL_GPIO_SetPinDirection(GPIO4, GPIO_PIN_C5, GPIO_IN);
    /* Set the interrupt type and callback function for GPIO4 C5, and enable the IO interrupt for GPIO4 C5 */
    HAL_IRQ_HANDLER_SetGpioIRQHandler(GPIO_BANK4, GPIO_PIN_C5, c5_call_back, NULL);
    HAL_GPIO_SetIntType(GPIO4, GPIO_PIN_C5, GPIO_INT_TYPE_EDGE_RISING);
    /* Enable the GPIO interrupt, allowing the module to generate an interrupt */
    HAL_GPIO_EnableIRQ(GPIO4, GPIO_PIN_C5);
}
```

Настройка делится на две части.

Настройка IPIC: зарегистрировать gpio_isr и разрешить системный приём. Использование обёртки HAL_INTMUX_Init над IPIC сохраняет принцип работы исходного интерфейса.

Настройка модуля: разрешить генерацию прерывания для IPIC согласно документации конкретного периферийного устройства.

Для 32 выводов GPIO используется общий сигнал; HAL_GPIO_IRQHandler направляет вызов обработчику конкретного вывода.

##### 7.3.2.2 Обработчики IPIC в RTOS

См. раздел обработчиков GIC в RTOS.

## 8. Модули

### 8.1 eMMC

#### 8.1.1 HAL

Драйверы eMMC делятся на SDIO и SDHCI в зависимости от контроллера. Код находится в hal/lib/src/ и hal/middleware/sdhci/. HAL предоставляет базовые операции чтения и записи. Пример для RK3568:

```text
#include "mmc_api.h"
#define TestSector   8
#define maxTestSector (TestSector * 4)
static int pWriteBuf[maxTestSector * 128];
static int pReadBuf[maxTestSector * 128];
static int userCapSize;
static int SdhciInit(void)
{
    int ioctlParam[5] = {0, 0, 0, 0, 0};
    int ret;
    sdmmc_init((void *)0xFE310000);
    ret = sdmmc_ioctrl(SDM_IOCTRL_REGISTER_CARD, ioctlParam);
    if (ret) {
        printf("eMMC init error!\n");
        return -1;
    }
    ret = sdmmc_ioctrl(SDM_IOCTR_GET_CAPABILITY, ioctlParam);
    if (ret) {
        printf("eMMC get capability error!\n");
        return -1;
    }
    userCapSize = ioctlParam[1];
}
static int SdhciTest(void)
{
    int i, j, loop = 0;
    int testEndLBA;
    int testLBA = 0;
    int testSecCount = 1;
    int printFlag;
    testEndLBA = userCapSize / 32;
    for (i = 0; i < (maxTestSector * 128); i++)
        pWriteBuf[i] = i;
    for (loop = 0; loop < 2; loop++) {
        HAL_DBG("---------Test loop = %d---------\n", loop);
        HAL_DBG("---------Test ftl write [Start]---------\n", "");
        testSecCount = 1;
        HAL_DBG("testEndLBA = %x\n", testEndLBA);
        HAL_DBG("testLBA = %x\n", testLBA);
        for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
            sdmmc_write(testLBA, testSecCount, pWriteBuf);
            sdmmc_read(testLBA, testSecCount, pReadBuf);
            printFlag = testLBA & 0x1FF;
            if (printFlag < testSecCount)
                HAL_DBG("testLBA = %x\n", testLBA);
            for (j = 0; j < testSecCount * 128; j++) {
                if (pWriteBuf[j] != pReadBuf[j]) {
                    printf("write not match:row=%x, num=%x, write=%x, read=%x\n", testLBA, j, pWriteBuf[j], pReadBuf[j]);
                    while (1);
                }
            }
            testLBA += testSecCount;
            testSecCount++;
            if (testSecCount > maxTestSector)
                testSecCount = 1;
        }
        HAL_DBG("---------Test ftl check [Start]---------%s\n", "");
        testSecCount = 1;
        for (testLBA = 0x10000 + loop; (testLBA + testSecCount) < testEndLBA;) {
            sdmmc_read(testLBA, testSecCount, pReadBuf);
            printFlag = testLBA & 0x7FF;
            if (printFlag < testSecCount)
                HAL_DBG("testLBA = %x\n", testLBA);
            for (j = 0; j < testSecCount * 128; j++) {
                if (pWriteBuf[j] != pReadBuf[j]) {
                    printf("check not match:row=%x, num=%x, write=%x, read=%x\n", testLBA, j, pWriteBuf[j], pReadBuf[j]);
                    while (1);
                }
            }
            testLBA += testSecCount;
            testSecCount++;
            if (testSecCount > maxTestSector)
                testSecCount = 1;
        }
    }
    HAL_DBG("---------Test end---[End]------\n", "");
    return 0;
}
```

#### 8.1.2 RT-Thread

RT-Thread поддерживает файловую систему для SDIO; SDHCI предоставляет базовые операции чтения и записи блоков.

Конфигурация SDIO: пункт menuconfig:

```text
RT-Thread Components  -->
    Device Drivers  -->
    [*] Using SD/MMC device drivers
RT_USING_SDIO=y
RT_USING_SDIO0=y
RT_USING_DMA=y
RT_USING_DMA_PL330=y
RT_USING_DMA0=y
```

Конфигурация SDHCI:

```text
RT_USING_SDHCI=y
```

Поддержка файловой системы elm-fat RT-Thread: пункт menuconfig:

```text
RT-Thread Components -->
    Device virtual file system  -->
    [*] Using device virtual file system
    [*]   Using mount table for file system /* Implement the corresponding registration partition table to enable automatic mounting of partitions on power-up */
    [*]   Enable elm-chan fatfs /* FAT file system */
      elm-chan's FatFs, Generic FAT Filesystem Module  -->
      (4096) Maximum sector size to be handled. /* Must be changed to 4096 for products with SPI Nor */
RT_USING_DFS=y
RT_SDCARD_MOUNT_POINT="/"
DFS_FILESYSTEMS_MAX=4
DFS_FILESYSTEM_TYPES_MAX=4
RT_USING_DFS_MNTTABLE=y
RT_USING_DFS_ELMFAT=y
RT_DFS_ELM_MAX_SECTOR_SIZE=4096
```

RT-Thread монтирует файловые системы по mount_table. При автоматическом монтировании разделов добавьте запись в mnt.c, например для раздела root в каталог /.

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

Собственную процедуру монтирования можно реализовать следующим кодом.

```text
dfs_mount("root", "/", "elm", 0, 0)
```

Если eMMC ещё не содержит нужной файловой системы, её можно форматировать и смонтировать следующими командами.

```text
mkfs -t elm sd0      # Format sd0 as an elm-FAT file system
mount sd0 / elm      # Mount sd0 as elm-FAT in the / directory
```

После монтирования проверьте файловую систему командами последовательной консоли.

```text
## Chapter-8 Create a file in the root directory
echo "This is a test!" /test.txt
## Chapter-8 Check the directory
ls
Directory /:
test.txt
## Chapter-8 Check the file content
cat test.txt
This is a test!
```

#### 8.1.3 Kernel

Подробности Linux eMMC см. в Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_EN.pdf.

### 8.2 UART

#### 8.2.1 UART в HAL

Настройка UART в HAL включает:

1. Настройку IOMUX.

2. Назначение UART-прерывания в таблице.

3. Вызов интерфейса инициализации.

Пример для RK3562:

```text
static void HAL_IOMUX_Uart7M1Config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B3,
                         PIN_CONFIG_MUX_FUNC3);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC3);
}
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
/* TODO: Config the irqs here. * GIC version: GICv2 */
    GIC_AMP_IRQ_CFG_ROUTE(UART7_IRQn, 0xd0, CPU_GET_AFFINITY(1, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)),   /* sentinel */
};
void main(void)
{
    struct HAL_UART_CONFIG hal_uart_config = {
        .baudRate = UART_BR_1500000,
        .dataBit = UART_DATA_8B,
        .stopBit = UART_ONE_STOPBIT,
        .parity = UART_PARITY_DISABLE,
    };
    HAL_IOMUX_Uart7M1Config();
    HAL_UART_Init(&g_uart7Dev, &hal_uart_config);
}
```

#### 8.2.2 UART в RT-Thread

Настройка UART в RT-Thread включает:

1. Включение UART через scons --menuconfig.

2. Настройку нужного IOMUX.

3. Настройку g_uart_board, включая скорость порта.

4. Назначение UART-прерывания в таблице.

Некоторые UART в RT-Thread уже полностью настроены; их можно включить через scons --menuconfig. Пример для RK3562:

Пункт menuconfig:

```text
RT-Thread rockchip RK3562 drivers  -->
    Enable UART  -->
    [*] Enable UART
    [*]   Enable UART0
## Chapter-8 UART0
RT_CONSOLE_DEVICE_NAME="uart0"
RT_USING_UART=y
RT_USING_UART0=y
## Chapter-8 UART7
RT_CONSOLE_DEVICE_NAME="uart7"
RT_USING_UART=y
RT_USING_UART7=y
/* Configure the corresponding IOMUX */
#ifdef RT_USING_UART0
RT_WEAK void uart0_m0_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK0,
                         GPIO_PIN_D0 |
                         GPIO_PIN_D1,
                         PIN_CONFIG_MUX_FUNC1);
}
#endif
#ifdef RT_USING_UART7
RT_WEAK void uart7_m1_iomux_config(void)
{
    HAL_PINCTRL_SetIOMUX(GPIO_BANK1,
                         GPIO_PIN_B3 |
                         GPIO_PIN_B4,
                         PIN_CONFIG_MUX_FUNC3);
}
#endif
/* Call IOMUX */
void rt_hw_iomux_config(void)
{
    rt_hw_iodomain_config();
#ifdef RT_USING_UART0
    uart0_m0_iomux_config();
#endif
#ifdef RT_USING_UART7
    uart7_m1_iomux_config();
#endif
#ifdef RT_USING_GMAC
#ifdef RT_USING_GMAC0
    gmac0_m0_iomux_config();
#endif
#endif
/* Configure `g_uart_board` information */
#if defined(RT_USING_UART0)
RT_WEAK const struct uart_board g_uart0_board =
{
    .baud_rate = UART_BR_1500000,
    .dev_flag = ROCKCHIP_UART_SUPPORT_FLAG_DEFAULT,
    .bufer_size = RT_SERIAL_RB_BUFSZ,
    .name = "uart0",
};
#endif /* RT_USING_UART0 */
/* Configure UART interrupt in the interrupt table */
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] =
{
    /* Config the irqs here. */
    // todo...
    GIC_AMP_IRQ_CFG_ROUTE(UART0_IRQn, 0xd0, CPU_GET_AFFINITY(3, 0)),
    GIC_AMP_IRQ_CFG_ROUTE(0, 0, CPU_GET_AFFINITY(1, 0)),   /* sentinel */
};
```

#### 8.2.3 Kernel

Все UART определены в kernel/arch/arm64/boot/dts/rockchip/rkxxxx.dtsi и могут включаться по необходимости. Подробности см. в Rockchip_Developer_Guide_UART_CN.pdf.

Чтобы исключить конфликт ресурсов AMP, в Linux DTS следует отключить UART, занятые другой системой, и назначить их прерывания нужному CPU через rkxxxx-amp.dtsi.

```text
/* In the DTS, route the UART7 interrupt (69) to CPU3, and declare the clock for UART7. If other DTSs use the clock, an error will be reported, to achieve resource isolation */
/ {
    rockchip_amp: rockchip-amp {
        compatible = "rockchip,amp";
        clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
            <&cru PCLK_MAILBOX>, <&cru PCLK_INTC>,
            <&cru SCLK_UART7>, <&cru PCLK_UART7>,
            <&cru PCLK_TIMER>, <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
        pinctrl-names = "default";
        pinctrl-0 = <&uart7m1_xfer>;
        amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
        amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
                            GIC_AMP_IRQ_CFG_ROUTE(69, 0xd0, CPU_GET_AFFINITY(3, 0))>;
        status = "okay";
    };
    /* Disable UART7 in the DTS */
    &uart7 {
        status = "disabled";
    }
}
```

### 8.3 SPI FLASH

Подробности SPI Flash см. в Rockchip_Developer_Guide_RT-Thread_SPIFLASH_EN.pdf.

В Rockchip используются контроллеры SPI Flash FSPI, SFC и SPI.

FSPI (Flexible Serial Peripheral Interface) имеет следующие возможности:

SPI NOR, SPI NAND, PSRAM и SRAM с протоколом SPI.

Standard SPI, Dual SPI, Quad SPI; отдельные версии поддерживают Octal SPI.

SDR; отдельные версии поддерживают DTR.

Технология XIP.

Передача DMA с встроенным DMA.

SFC (Serial Flash Controller) имеет следующие возможности:

SPI NOR, SPI NAND, PSRAM и SRAM с протоколом SPI.

Standard SPI, Dual SPI, Quad SPI.

SDR, передача по одному фронту.

Передача со встроенным DMA.

SPI (Serial Peripheral Interface) имеет следующие возможности:

SPI NOR, SPI NAND и PSRAM с протоколом SPI.

Standard SPI, одна линия данных.

SDR, передача по одному фронту.

Передача с внешним DMA.

#### 8.3.1 Аппаратный уровень абстракции (HAL)

RK HAL предоставляет протокольный уровень HAL_SNOR для SPI NOR. Исходный код находится в hal/lib/hal/src/. Примеры чтения и записи SPI Flash — в hal/test/hal/.

Из-за разнообразия SPI Flash конкретная микросхема определяется по flash ID. Список поддерживаемых моделей приведён в исходном коде.

```text
HAL_SECTION_SRAM_CODE static const struct FLASH_INFO s_spiFlashbl[] = {
    /* GD25LQ16E */
    { 0xc86015, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 12, 9, 0 },
    /* GD25Q32B */
    { 0xc84016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
    /* GD25Q64B */
    { 0xc84017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
    /* GD25Q127C and GD25Q128C */
    { 0xc84018, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0C, 15, 9, 0 },
    /* GD25Q256B/C/D */
    { 0xc84019, 128, 8, 0x13, 0x12, 0x6C, 0x3E, 0x21, 0xDC, 0x1C, 16, 6, 0 },
    /* GD55LT01GE */
    { 0xc8661b, 128, 8, 0x13, 0x12, 0x6B, 0x32, 0x20, 0xD8, 0x3C, 18, 0, 0 },
    /* GD25LQ64C */
    { 0xc86017, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 14, 9, 0 },
    /* GD25LQ32E */
    { 0xc86016, 128, 8, 0x03, 0x02, 0x6B, 0x32, 0x20, 0xD8, 0x0D, 13, 9, 0 },
    /* GD25LX256E */
    { 0xc86819, 128, 8, 0x13, 0x12, 0x00, 0x00, 0x21, 0xDC, 0x10, 16, 0, 0x0D },
}
```

Описание конфигурации:

```text
#define HAL_SNOR_MODULE_ENABLED    /* SNOR support */
#define HAL_SFC_MODULE_ENABLED     /* SFC controller support */
#define HAL_SNOR_SFC_HOST          /* SFC controller support */
```

#### 8.3.2 RT-Thread

Базовая конфигурация, пункт menuconfig:

```text
RT-Thread rockchip common drivers  --->
    [*] Enable ROCKCHIP SPI NOR Flash
    (80000000) Reset the speed of SPI Nor flash in Hz
    [ ]   Set SPI Host DUAL IO Lines /* If the FSPI master only reserves IO0~1, Dual mode should be used */
            Choose SPI Nor Flash Adapter (Attach FSPI controller to SNOR) --->
```

Описание конфигурации:

```text
RT_USING_MTD_NOR=y
RT_USING_SNOR=y
RT_SNOR_SPEED=80000000 /* I/O interface speed */
## Chapter-8 RT_SNOR_DUAL_IO=n /* It is not configured by Default, Quad SPI is limited to Duad SPI usage */
## Chapter-8 RT_SNOR_XIP_DATA_BEGIN=0 /* It is not configured by Default, XIP read interface implementation starting address, refer to "Nor Flash XIP Technology" for details */
RT_USING_SNOR_FSPI_HOST=y /* FSPI controller solution */
## Chapter-8 RT_USING_SNOR_SFC_HOST=y /* SFC controller solution */
## Chapter-8 RT_USING_SNOR_SPI_HOST=y /* SPI controller solution */
## Chapter-8 RT_SNOR_SPI_DEVICE_NAME="spi2_0" /* SPI controller solution, specify the target controller */
```

Поддержка elm-fat в RT-Thread:

```text
RT-Thread Components --->
    Device virtual file system  --->
    [*] Using device virtual file system
    [*]   Using mount table for file system /* Implement the corresponding registration partition table to enable automatic mounting of partitions at power-up */
    [*]   Enable elm-chan fatfs /* FAT file system */
        elm-chan's FatFs, Generic FAT Filesystem Module  --->
        (4096) Maximum sector size to be handled. /* Must be changed to 4096 for SPI Nor products */
```

Для автоматического монтирования добавьте запись раздела в mnt.c, например root для каталога /.

```text
const struct dfs_mount_tbl mount_table[] =
{
    {"root", "/", "elm", 0, 0},
    {0}
};
```

Собственную процедуру монтирования можно реализовать следующим кодом.

```text
dfs_mount("root", "/", "elm", 0, 0)
```

Регистрацию раздела можно проверить следующей командой.

```text
msh />list_device
device          type         ref count
------- -------------------- ----------
root     Block Device         1            /* Partition name is root, partition type is block device, Nor flash supports setting.ini to modify the setting to MTD device */
snor     MTD Device           0            /* SPI Nor root storage device, partition read and write ultimately access this node to complete read, write, and erase */
```

#### 8.3.3 Kernel

Подробности Linux SPI Flash см. в Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_EN.pdf.

### 8.4 GMAC

#### 8.4.1 HAL

RK HAL предоставляет базовый драйвер GMAC и операции чтения/записи стандартных регистров PHY. Исходный код: hal/lib/hal/src/gmac.

Настройка определяется конфигурацией GMAC соответствующего SoC в TRM.

```text
#define HAL_GMAC_MODULE_ENABLED        /* GMAC driver support*/
#define HAL_GMAC1000_MODULE_ENABLED    /* GMAC1000 driver support*/
```

Пример интерфейса: hal/test/hal/test_gmac.c.

Настройка GMAC в HAL:

1. Настроить IOMUX.

2. Настроить таблицу GMAC_ETH_CONFIG.

3. Назначить GMAC0_IRQn в таблице прерываний.

Пример для RK3562:

```text
/* Configure IOMUX */
static void GMAC_Iomux_Config(uint8_t id)
{
    /* GMAC0 iomux */
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_A0 | /* RGMII_RSTn */
                         GPIO_PIN_A1 , /* RGMII_INT/PMEB_M0 */
                         PIN_CONFIG_MUX_FUNC0);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A1, GPIO_IN);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A0, GPIO_OUT);
    HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_A0, GPIO_HIGH);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_D4 | /* RGMII_TXD2_M0 */
                         GPIO_PIN_D5 | /* RGMII_TXD3_M0 */
                         GPIO_PIN_D6 | /* RGMII_TXCLK_M0 */
                         GPIO_PIN_D7 , /* RGMII_RXD2_M0 */
                         PIN_CONFIG_MUX_FUNC2);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK4,
                         GPIO_PIN_A0 | /* RGMII_RXD3_M0 */
                         GPIO_PIN_A1 | /* RGMII_RXCLK_M0 */
                         GPIO_PIN_A2 | /* RGMII_TXD0_M0 */
                         GPIO_PIN_A3 | /* RGMII_TXD1_M0 */
                         GPIO_PIN_A4 | /* RGMII_TXEN_M0 */
                         GPIO_PIN_A5 | /* RGMII_RXD0_M0 */
                         GPIO_PIN_A6 | /* RGMII_RXD1_M0 */
                         GPIO_PIN_A7 | /* RGMII_RXDV_M0 */
                         GPIO_PIN_B1 | /* ETH_CLK_25M_OUT_M0 */
                         GPIO_PIN_B2 | /* RGMII_MDC_M0 */
                         GPIO_PIN_B3 | /* RGMII_MDIO_M0 */
                         GPIO_PIN_B7 , /* RGMII_CLK_M0 */
                         PIN_CONFIG_MUX_FUNC2);
}
/* Configure the GMAC_ETH_CONFIG table */
static struct GMAC_ETH_CONFIG ethConfigTable[] =
{
    {
        .halDev = &g_gmac0Dev,
        .mode = PHY_INTERFACE_MODE_RGMII,
        .maxSpeed = 1000,
        .phyAddr = 0,                        /* PHY address */
        .extClk = false,                     /* true if clock input is provided by PHY */
        .resetGpioBank = GPIO3,              /* PHY reset pin */
        .resetGpioNum = GPIO_PIN_A0,
        .resetDelayMs = { 0, 20, 100 },      /* PHY reset timing */
        .txDelay = 0x3C,
        .rxDelay = 0,
    },
};
/* Configure the GMAC0_IRQn interrupt in the interrupt table */
static struct GIC_AMP_IRQ_INIT_CFG irqsConfig[] = {
/* TODO: Config the irqs here. * GIC version: GICv2 * The priority higher than 0x80 is non-secure interrupt. */
    GIC_AMP_IRQ_CFG_ROUTE(GMAC0_IRQn, 0xd0, CPU_GET_AFFINITY(0, 0)),
};
```

#### 8.4.2 RT-Thread

Описание конфигурации, пункт menuconfig:

```text
RT-Thread rockchip RK3562 drivers  --->
    Enable GMAC  --->
    [*] Enable GMAC
    [*]   Enable GMAC0
RT_USING_GMAC=y          /* Enable GMAC configuration */
RT_USING_GMAC0=y         /* Enable GMAC0 configuration */
```

Настройка GMAC в RT-Thread:

1. Настроить IOMUX.

2. Настроить таблицу rockchip_eth_config.

3. Назначить GMAC0_IRQn в таблице прерываний; для SMP это не требуется.

Пример для RK3562:

```text
/* Configure IOMUX */
RT_WEAK void gmac0_m0_iomux_config(void)
{
    /* GMAC0 iomux */
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_A0 | /* RGMII_RSTn */
                         GPIO_PIN_A1,  /* RGMII_INT/PMEB_M0 */
                         PIN_CONFIG_MUX_FUNC0);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A1, GPIO_IN);
    HAL_GPIO_SetPinDirection(GPIO3, GPIO_PIN_A0, GPIO_OUT);
    HAL_GPIO_SetPinLevel(GPIO3, GPIO_PIN_A0, GPIO_HIGH);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK3,
                         GPIO_PIN_D4 | /* RGMII_TXD2_M0 */
                         GPIO_PIN_D5 | /* RGMII_TXD3_M0 */
                         GPIO_PIN_D6 | /* RGMII_TXCLK_M0 */
                         GPIO_PIN_D7,  /* RGMII_RXD2_M0 */
                         PIN_CONFIG_MUX_FUNC2);
    HAL_PINCTRL_SetIOMUX(GPIO_BANK4,
                         GPIO_PIN_A0 | /* RGMII_RXD3_M0 */
                         GPIO_PIN_A1 | /* RGMII_RXCLK_M0 */
                         GPIO_PIN_A2 | /* RGMII_TXD0_M0 */
                         GPIO_PIN_A3 | /* RGMII_TXD1_M0 */
                         GPIO_PIN_A4 | /* RGMII_TXEN_M0 */
                         GPIO_PIN_A5 | /* RGMII_RXD0_M0 */
                         GPIO_PIN_A6 | /* RGMII_RXD1_M0 */
                         GPIO_PIN_A7 | /* RGMII_RXDV_M0 */
                         GPIO_PIN_B1 | /* ETH_CLK_25M_OUT_M0 */
                         GPIO_PIN_B2 | /* RGMII_MDC_M0 */
                         GPIO_PIN_B3 | /* RGMII_MDIO_M0 */
                         GPIO_PIN_B7,  /* RGMII_CLK_M0 */
                         PIN_CONFIG_MUX_FUNC2);
}
/* Configure the rockchip_eth_config table */
const struct rockchip_eth_config rockchip_eth_config_table[] =
{
    {
        .halDev = &g_gmac0Dev,
        .mode = PHY_INTERFACE_MODE_RGMII,
        .maxSpeed = 1000,
        .phyAddr = 0,                        /* PHY address */
        .extClk = false,                     /* true if clock input is provided by PHY */
        .resetGpioBank = GPIO3,              /* PHY reset pin */
        .resetGpioNum = GPIO_PIN_A0,
        .resetDelayMs = { 0, 20, 100 },      /* PHY reset timing */
        .txDelay = 0x3C,
        .rxDelay = 0,
    },
};
```

RT-Thread поддерживает LWIP. Включите нужные функции через scons --menuconfig.

Пункт menuconfig:

```text
RT-Thread Components  --->
    Network  --->
    [*] LwIP: light weight TCP/IP stack  --->
    --- LwIP: light weight TCP/IP stack
    [ ]   Use LwIP local version only (NEW)
    LwIP version (LwIP v2.0.3)  --->
    [ ]   IPV6 protocol (NEW)
    (4)   Memory alignment (NEW)
    [*]   IGMP protocol (NEW)
    -*-   ICMP protocol
    [ ]   SNMP protocol (NEW)
    [*]   Enable DNS for name resolution (NEW)
    [*]   Enable alloc IP address through DHCP (NEW)
    (1)     SOF broadcast (NEW)
    (1)     SOF broadcast recv (NEW)
    Static IPv4 Address  --->
NETDEV_USING_PING=y
RT_USING_LWIP=y
RT_USING_LWIP203=y
RT_USING_LWIP_VER_NUM=0x20003
RT_LWIP_MEM_ALIGNMENT=4
RT_LWIP_IGMP=y
RT_LWIP_ICMP=y
RT_LWIP_DNS=y
#Enable DHCP, static IP does not need to be configured
RT_LWIP_DHCP=y
IP_SOF_BROADCAST=1
IP_SOF_BROADCAST_RECV=1
/* Static IPv4 Address */
RT_LWIP_IPADDR="XXX.XXX.XXX.XXX"
RT_LWIP_GWADDR="XXX.XXX.XXX.XXX"
RT_LWIP_MSKADDR="XXX.XXX.XXX.XXX"
RT_LWIP_UDP=y
RT_LWIP_TCP=y
RT_LWIP_RAW=y
RT_MEMP_NUM_NETCONN=8
RT_LWIP_PBUF_NUM=16
RT_LWIP_RAW_PCB_NUM=4
RT_LWIP_UDP_PCB_NUM=4
RT_LWIP_TCP_PCB_NUM=4
RT_LWIP_TCP_SEG_NUM=40
RT_LWIP_TCP_SND_BUF=8196
RT_LWIP_TCP_WND=8196
RT_LWIP_TCPTHREAD_PRIORITY=10
RT_LWIP_TCPTHREAD_MBOX_SIZE=8
RT_LWIP_TCPTHREAD_STACKSIZE=1024
RT_LWIP_ETHTHREAD_PRIORITY=12
RT_LWIP_ETHTHREAD_STACKSIZE=1024
RT_LWIP_ETHTHREAD_MBOX_SIZE=8
LWIP_NETIF_STATUS_CALLBACK=1
LWIP_NETIF_LINK_CALLBACK=1
SO_REUSE=1
LWIP_SO_RCVTIMEO=1
LWIP_SO_SNDTIMEO=1
LWIP_SO_RCVBUF=1
LWIP_SO_LINGER=0
LWIP_NETIF_LOOPBACK=0
RT_LWIP_USING_PING=y
```

После включения ping подключите сетевой кабель и проверьте связь следующей командой.

```text
## Chapter-8 Successful network connection log information
[(1)3.357.573] e0: 100M
[(1)3.357.592] e0: full duplex
[(1)3.357.610] e0: flow control off
[(1)3.357.811] e0: link up.
## Chapter-8 Sending ping packets to the gateway and execution results
msh >ping 192.168.31.1
[(1)52.351.270] 60 bytes from 192.168.31.1 icmp_seq=0 ttl=64 time=0 ms
[(1)53.355.786] 60 bytes from 192.168.31.1 icmp_seq=1 ttl=64 time=0 ms
[(1)54.361.215] 60 bytes from 192.168.31.1 icmp_seq=2 ttl=64 time=0 ms
[(1)55.366.645] 60 bytes from 192.168.31.1 icmp_seq=3 ttl=64 time=0 ms
```

#### 8.4.3 Kernel

Подробности Linux GMAC см. в Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_CN.pdf.

При Linux + RT-Thread, если GMAC использует RT-Thread, Linux должен отключить соответствующий узел DTS и объявить его clock-ресурсы. Пример для RK3562:

```text
/ {
       rockchip_amp: rockchip-amp {
           compatible = "rockchip,amp";
           clocks = <&cru FCLK_BUS_CM0_CORE>, <&cru CLK_BUS_CM0_RTC>,
           # GMAC clock declaration
           <&cru PCLK_GMAC>, <&cru ACLK_GMAC>, <&cru CLK_GMAC_125M_CRU_I>,
           <&cru CLK_GMAC_50M_CRU_I>, <&cru CLK_GMAC_ETH_OUT2IO>,
           <&cru SCLK_UART7>, <&cru PCLK_UART7>, <&cru PCLK_TIMER>,
           <&cru CLK_TIMER4>, <&cru CLK_TIMER5>;
           pinctrl-names = "default";
           pinctrl-0 = <&uart7m1_xfer>;
           amp-cpu-aff-maskbits = /bits/ 64 <0x0 0x1 0x1 0x2 0x2 0x4 0x3 0x8>;
           amp-irqs = /bits/ 64 <GIC_AMP_IRQ_CFG_ROUTE(147, 0xd0, CPU_GET_AFFINITY(3, 0))
                             # GMAC interrupt configuration
                             GIC_AMP_IRQ_CFG_ROUTE(105, 0xd0, CPU_GET_AFFINITY(3, 0))>;
           status = "okay";
        };
&gmac0 {
       status = "disabled";
};
```

### 8.5 PCIE

Для bare metal и RT-Thread поддерживаются следующие базовые функции PCIe:

Доступ к регистрам контроллера.

Доступ CPU к периферии, прежде всего пространствам BAR и CFG.

Передача uDMA.

Традиционные прерывания INTx.

#### 8.5.1 HAL / RT-Thread

Тестовый код: hal/test/hal/test_pcie.c.

Подробности: hal/doc/guides/Rockchip_User_Guide_HAL_PCIe_CN.md.

### 8.6 CPU Cache ECC

RK3568 поддерживает Cache ECC: обнаружение и исправление однобитных ошибок, обнаружение и регистрация неисправляемых двухбитных ошибок. Для проверки можно вводить ошибки вручную.

#### 8.6.1 RT-Thread

Операции Cache ECC выполняются в secure-среде и требуют оценки разработчиком. Подробности см. в Rockchip_Developer_Guide_RT-Thread_CacheECC_EN.pdf.

### 8.7 DDR ECC

RK3568 поддерживает DDR Sideband ECC, SEC/DED: исправление однобитных ошибок и обнаружение с регистрацией двухбитных, которые не исправляются. Предусмотрен ручной ввод ошибок для проверки.

#### 8.7.1 HAL

Настройка HAL: Rockchip_Developer_Guide_HAL_DDR_ECC_EN.pdf.

#### 8.7.2 Kernel

Настройка Linux: Rockchip-Developer-Guide-DDR-CN.pdf.

## 9. Отладка

### 9.1 Отладка по UART

Параметры последовательного порта для отладки по умолчанию приведены в таблице.

| Скорость UART | Биты данных | Стоп-биты | Чётность | Управление потоком |
| --- | --- | --- | --- | --- |
| 1500000 | 8 | 1 | Нет | Нет |

Связанный раздел: глава 8, модули.

#### 9.1.1 Журнал запуска U-Boot

В примере запуска RK3562 прошивка CPU3 загружается в RAM по адресу 0x01800000.

```text
AMP: Brought up cpu[3] with state 0x10, entry 0x01800000 ...OK
```

#### 9.1.2 Журнал запуска RK HAL

```text
*****************************************
  Hello RK3562 Bare-metal using RK_HAL!
       Rockchip Electronics Co.Ltd
              CPI_ID(3)
*****************************************
[(3)0.671.983] CPU(3) Initial OK!
```

#### 9.1.3 Журнал запуска RT-Thread

```text
 \ | /
- RT -     Thread Operating System
 / | \     4.1.1 build Apr 12 2024 20:28:35
 2006 - 2022 Copyright by RT-Thread team
```

### 9.2 Отладка AP через OpenOCD

Для AP поддерживается OpenOCD с небольшой JTAG-платой Rockchip: пошаговое выполнение, точки останова, data watch и выгрузка регистров/памяти. Подробности см. в руководстве подключения и отладки JTAG & SWD.

#### 9.2.1 Подготовка среды Windows

##### 9.2.1.1 Установка программ

1. Установите среду OpenOCD.

Пакет openocd_eclipse-2020-09.zip нужно распаковать в выбранный каталог. Структура пакета:

```text
.
├── eclipse-workspace        # Workspace directory, Eclipse has set the workspace directory to this folder by default
├── OpenOCD                  # OpenOCD related files
│   ├── bat                  # Windows batch files, double-click to connect to the SoC directly
│   ├── bin                  # Contains openocd.exe and *gdb.exe
│   ├── doc                  # Driver installation documentation and usage documentation
│   └── tcl                  # Script files
└── SVD                      # Mainly used to view SoC registers
```

2. Установите JRE, необходимую Eclipse.

Пакет JRE: /Environment Setup Software/jdk_8.0.1310.11_64.exe в загруженном комплекте. Подробности установки и настройки — в Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf этого комплекта.

3. Установите драйвер JTAG.

Утилита драйвера: /Environment Setup Software/zadig-2.7.exe. Инструкции — в Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf комплекта.

##### 9.2.1.2 Подключение оборудования

FT232H компании Future Technology Devices International Ltd подключается к компьютеру через USB и предоставляет интерфейсы JTAG и SWD.

![Иллюстрация из руководства Rockchip AMP: 9.2.1.2 Подключение оборудования — 125](assets/en-p125-fig01.png)

Плата FT232H показана на иллюстрации выше.

LED1 — питание; LED2 выключен при отсутствии соединения и мигает при соединении; LED3 пока не назначен.

Разъём ARM 20-pin JTAG.

USB: варианты Type-C и mini-USB.

DIP-переключатель.

Режим SWD: 1, 3, 5 выключены; 2, 4, 6 включены.

Режим JTAG: 1, 3, 5 включены; 2, 4, 6 выключены.

Контакты VCC, TCS, TCK, GND для подключения проводами к плате; обозначения следует сверить с самой JTAG-платой.

На контактах 3.3V, VCCIO и 1.8V обязательно соедините VCCIO перемычкой с подходящим напряжением 3.3V или 1.8V, иначе связь JTAG не работает.

#### 9.2.2 Пример использования

Пример подготовки OpenOCD для RK3562:

1. По Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf создайте конфигурацию целевого SoC.

2. Запустите eclipse.exe, откройте Debug Configurations → Debugger и добавьте следующие параметры в Config options.

```text
-c "set SMPMASK 0x8"                   # 0x8 represents CPU3, configure CPU3 to run
RT_Thread
-r rk3562                              # Specify the SoC
-c "cpu3 configure -rtos RT_Thread"    # Specify CPU3 to run RT_Thread
-c "adapter speed 15000"               # JTAG TCK rate, unit KHz
```

![Иллюстрация из руководства Rockchip AMP: 9.2.2 Пример использования — 126](assets/en-p126-fig01.png)

3. В Debug Configurations → Source измените Path Mapping: New Mapping, указав пути проекта RK356x AMP SDK.

```text
<AMP_SDK>/hal/         # Project path for GCC compilation
D:<AMP_SDK>\hal        # Project path for source code debugging tracking under Windows
```

![Иллюстрация из руководства Rockchip AMP: 9.2.2 Пример использования — 126](assets/en-p126-fig02.png)

Оба пути обозначают один проект: <AMP_SDK>/rk3562/hal/ используется при разрешении символов, D:<AMP_SDK>\hal\ — для исходного кода под Windows. Прошивка на плате должна соответствовать отлаживаемому коду.

4. Нажмите Debug в Debug Configurations. Информация появится в Debugger Console.

![Иллюстрация из руководства Rockchip AMP: 9.2.2 Пример использования — 127](assets/en-p127-fig01.png)

В Console добавьте ELF-файлы четырёх CPU следующими командами.

```text
    # ......
    For help, type "help".
    Type "apropos word" to search for commands related to "word".
    # ......
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/0_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/1_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/2_TestDemo.elf
    add-symbol-file D:/rk3562/hal/project/rk3562/GCC/3_TestDemo.elf
```

### 9.3 Отладка MCU через Ozone

#### 9.3.1 Подготовка среды Windows

Ozone — графический инструмент отладки встроенных систем. С J-Link он поддерживает трассировку, пошаговое выполнение и несколько точек останова. Сайт: Ozone – The Performance Analyzer (segger.com). Доступны коммерческая и некоммерческая лицензии; выберите подходящую вашему использованию.

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 128](assets/en-p128-fig01.png)

Пример для RK3562:

1. Подключите J-Link и отладочную плату, откройте Ozone. Используйте начальный мастер проекта либо File → New → New Project Wizard.

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 129](assets/en-p129-fig01.png)

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 130](assets/en-p130-fig01.png)

Выберите подключённый J-Link в области, выделенной красной рамкой.

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 131](assets/en-p131-fig01.png)

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 132](assets/en-p132-fig01.png)

2. Загрузите целевой исполняемый файл в отладчик. Если исходный проект RK HAL находится в Linux, а Ozone — в Windows, сначала сопоставьте Linux-путь с сетевым диском Windows, например /home/xxx с Z:. В командной строке нижнего левого угла Ozone задайте замену пути следующей командой; её аргументы — исходный Linux-путь и соответствующий диск Windows.

```text
Project.AddPathSubstitute "/home/xxx" "Z:"
```

После этих шагов появится следующий интерфейс Ozone.

![Иллюстрация из руководства Rockchip AMP: 9.3.1 Подготовка среды Windows — 133](assets/en-p133-fig01.png)

Элементы в красной рамке управляют пошаговой отладкой. Точки останова можно ставить прямо в окне кода.

## 10. Демонстрации

### 10.1 Тестирование производительности

#### 10.1.1 Целочисленная производительность

CoreMark измеряет целочисленную производительность CPU и MCU. Результат — одно числовое значение, позволяющее сравнивать процессоры. Данные исходного руководства для разных платформ приведены в таблице.

| Процессор | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Частота | 816MHZ | 816MHZ |  |  |
| Режим работы | DDR4 1560MHZ | DDR4 1332MHZ |  |  |
| Кэш | Включён | Включён |  |  |
| TCM | Нет | Нет |  |  |
| Coremark | 3273 | 2387 |  |  |
| Coremark /MHz | 4.0 | 2.92 |  |  |

Метод тестирования в bare metal:

Включите тестовый код следующими макросами.

Путь: hal/project/rkxxx/src/main.c.

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Путь: hal/project/rkxxx/src/test_demo.c.

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Путь: /hal/middleware/benchmark/benchmark.

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/coremark" -
I"$(BENCHMARK_PATH)/coremark/barebones" SRC_DIRS += $(BENCHMARK_PATH)
$(BENCHMARK_PATH)/coremark $(BENCHMARK_PATH)/coremark/barebones
```

Путь: /hal/middleware/benchmark/benchmark.h.

```text
#define HAL_BENCHMARK_COREMARK
//#define HAL_BENCHMARK_LINPACK
//#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.2 Производительность с плавающей точкой

Linpack измеряет вычисления с плавающей точкой. Основной показатель — FLOPS, число операций в секунду; обычно он выражается в MFLOPS, миллионах операций в секунду. Данные исходного руководства приведены в таблице.

| Процессор | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Частота | 816MHZ | 816MHZ |  |  |
| Режим работы | DDR4 1560MHZ | DDR4 1332MHZ |  |  |
| Кэш | Включён | Включён |  |  |
| TCM | Нет | Нет |  |  |
| Linpack<br>MFLOPS | 154.7 | 79.38 |  |  |

Метод тестирования в bare metal:

Включите следующие тестовые макросы.

Путь: hal/project/rkxxx/src/main.c.

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Путь: hal/project/rkxxx/src/test_demo.c.

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Путь: /hal/middleware/benchmark/benchmark.mk.

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/linpack" SRC_DIRS +=
$(BENCHMARK_PATH) $(BENCHMARK_PATH)/linpack
```

Путь: /hal/middleware/benchmark/benchmark.h.

```text
//#define HAL_BENCHMARK_COREMARK
#define HAL_BENCHMARK_LINPACK
//#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.3 Производительность памяти

В RTOS и bare metal tinymembench измеряет пропускную способность, задержку памяти и случайный доступ. Это простой тест производительности памяти. Результаты исходного руководства приведены в таблице.

| Процессор | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Частота | 816MHZ | 816MHZ |  |  |
| Режим работы | DDR4 1560MHZ | DDR4 1332MHZ |  |  |
| Кэш | Включён | Включён |  |  |
| TCM | Нет | Нет |  |  |
| Тест пропускной способности памяти | Подробные данные ниже | Нет |  |  |
| Тест задержки памяти | Подробные данные ниже | Нет |  |  |

Данные RK3568 AP HAL.

```text
==========================================================================
== Memory bandwidth tests                                               ==
==                                                                      ==
== Note 1: 1MB = 1000000 bytes                                          ==
== Note 2: Results for 'copy' tests show how many bytes can be          ==
==         copied per second (adding together read and written           == ==         bytes would have provided twice higher numbers)              ==
== Note 3: 2-pass copy means that we are using a small temporary buffer ==
==         to first fetch data into it, and only then write it to the   ==
==         destination (source -> L1 cache, L1 cache -> destination)    ==
== Note 4: If sample standard deviation exceeds 0.1%, it is shown in    ==
==         brackets                                                     ==
==========================================================================
 C copy backwards                                     :   1673.8 MB/s
 C copy backwards (32 byte blocks)                    :   1687.0 MB/s
 C copy backwards (64 byte blocks)                    :   1673.8 MB/s
 C copy                                               :   1920.2 MB/s
 C copy prefetched (32 bytes step)                    :   1563.7 MB/s
 C copy prefetched (64 bytes step)                    :   1941.1 MB/s (0.1%)
 C 2-pass copy                                        :    995.7 MB/s
 C 2-pass copy prefetched (32 bytes step)             :   1036.3 MB/s
 C 2-pass copy prefetched (64 bytes step)             :   1007.0 MB/s
 C fill                                               :   3297.4 MB/s
 C fill (shuffle within 16 byte blocks)               :   3297.4 MB/s
 C fill (shuffle within 32 byte blocks)               :   3297.4 MB/s
 C fill (shuffle within 64 byte blocks)               :   3292.3 MB/s
 ---
 standard memcpy                                      :   1165.1 MB/s
 standard memset                                      :   3322.9 MB/s
 ---
 ARM fill (STM with 8 registers)                      :   3343.7 MB/s
 ARM fill (STM with 4 registers)                      :   3322.9 MB/s
==========================================================================
== Memory latency test                                                  ==
==                                                                      ==
== Average time is measured for random memory accesses in the buffers   ==
== of different sizes. The larger is the buffer, the more significant   ==
== are relative contributions of TLB, L1/L2 cache misses and SDRAM      ==
== accesses. For extremely large buffer sizes we are expecting to see   ==
== page table walk with several requests to SDRAM for almost every      ==
== memory access (though 64MiB is not nearly large enough to experience == == this effect to its fullest).                                         ==
==                                                                      ==
== Note 1: All the numbers are representing extra time, which needs to  ==
==         be added to L1 cache latency. The cycle timings for L1 cache ==
==         latency can be usually found in the processor documentation. ==
== Note 2: Dual random read means that we are simultaneously performing ==
==         two independent memory accesses at a time. In the case if    ==
==         the memory subsystem can't handle multiple outstanding       ==
==         requests, dual random read has the same timings as two       ==
==         single reads performed one after another.                    ==
==========================================================================
block size : single random read / dual random read
      1024 :    0.0 ns          /     0.0 ns
      2048 :    0.0 ns          /     0.0 ns
      4096 :    0.0 ns          /     0.0 ns
      8192 :    0.0 ns          /     0.0 ns
     16384 :    0.0 ns          /     0.0 ns
     32768 :   11.2 ns          /     0.3 ns
     65536 :   22.4 ns          /    32.7 ns
    131072 :   33.3 ns          /    43.9 ns
    262144 :   39.4 ns          /    47.2 ns
    524288 :   48.8 ns          /    56.1 ns
   1048576 :  176.3 ns          /   253.8 ns
   2097152 :  240.5 ns          /   317.2 ns
   4194304 :  272.0 ns          /   339.1 ns
   8388608 :  285.9 ns          /   328.5 ns
```

Метод тестирования в bare metal:

Включите следующие макросы теста.

Путь: hal/project/rkxxx/src/main.c.

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

Путь: hal/project/rkxxx/src/test_demo.c.

```text
-//#define PERF_TEST
+#define PERF_TEST
```

Путь: /hal/middleware/benchmark/benchmark.mk.

```text
INCLUDES += -I"$(BENCHMARK_PATH)" -I"$(BENCHMARK_PATH)/tinymembench" SRC_DIRS +=
$(BENCHMARK_PATH) $(BENCHMARK_PATH)/tinymembench
```

Путь: /hal/middleware/benchmark/benchmark.h.

```text
//#define HAL_BENCHMARK_COREMARK
//#define HAL_BENCHMARK_LINPACK
#define HAL_BENCHMARK_TINYMEMBENCH
```

#### 10.1.4 Задержка обработки прерывания

Используйте встроенный пример измерения задержки прерывания HAL. Задержка — время от события прерывания до начала его обработки. Данные исходного руководства для разных платформ приведены в таблице.

| Процессор | RK3568 AP HAL | RK3562 AP HAL | RK3562 MCU | RK3576 MCU |
| --- | --- | --- | --- | --- |
| Частота | 816MHZ | 816MHZ |  |  |
| Режим работы | DDR4 1560MHZ | DDR4 1332MHZ |  |  |
| Кэш | Включён | Включён |  |  |
| TCM | Нет | Нет |  |  |
| Irq Latency Test | avg = 3.42 us<br>max = 4.13 us<br>min = 3.21 us | avg = 1.543296 us<br>max = 2.916667 us<br>min = 0.875000 us |  |  |

Метод тестирования в bare metal:

Для измерения задержки прерывания включите следующие макросы.

hal/project/rkxxx/src/main.c

```text
-//#define TEST_DEMO
+#define TEST_DEMO
```

hal/project/rkxxx/src/test_demo.c

```text
-//#define IRQ_LATENCY_TEST
+#define IRQ_LATENCY_TEST
```

### 10.2 Демонстрация работы в реальном времени

На примере RK3568 демонстрируется работа Linux и RTOS в AMP и инструменты оценки обработки данных в реальном времени.

#### 10.2.1 Метод тестирования

Для Linux используется cyclictest, измеряющий задержки пробуждения потоков. Установить его можно из репозитория дистрибутива или получить с официального сайта.

Для RTOS используется тест задержки прерывания: hal/project/rk3568/src/test_demo.c.

#### 10.2.2 Принцип теста

Создаются один или несколько потоков реального времени с фиксированным периодом. На каждом цикле фиксируется время и вычисляется отклонение от ожидаемого момента, позволяя оценить задержку реакции системы.

#### 10.2.3 Результаты исходного теста

Тест выводит текущую и максимальную задержку каждого цикла. Результаты исходной демонстрации показаны на иллюстрации.

![Иллюстрация из руководства Rockchip AMP: 10.2.3 Результаты исходного теста — 140](assets/en-p140-fig01.png)

Примеры показателей вывода:

Min: минимальная измеренная задержка.

Avg: средняя измеренная задержка.

Max: максимальная измеренная задержка.

Now: текущее значение времени.

Occurrence: число попаданий в интервал задержки.

Latency in us: интервалы задержки в микросекундах.

Эти показатели характеризуют работу системы в реальном времени. Меньшая максимальная задержка в одинаковых условиях указывает на лучшую предсказуемость.

## 11. Приложение

### 11.1 Термины

```text
Definition
```

| Сокращение | Полное название | Определение |
| --- | --- | --- |
| OpenAMP | Open Asymmetric<br>Multi-Processing | Открытая система асимметричной многопроцессорной обработки |
| AMP | Asymmetric Multi-<br>Processing | Асимметричная многопроцессорная обработка |
| HAL | Hardware<br>Abstraction Layer | Hardware Abstraction Layer |
| Bare-metal | Bare-metal | Библиотека разработки bare metal на основе аппаратного уровня абстракции |
| MailBox | MailBox | APB-периферия для связи CPU и MCU через прерывания, создаваемые записью |
| RPMsg | Remote Processor<br>Messaging | Протокол межъядерной связи многоядерных процессоров |
| RTOS | Real-time Operating<br>System | Операционная система для приложений реального времени |
| RTT | RT-Thread | Открытая RTOS, развиваемая главным образом китайским сообществом |
| SDK | Software<br>Development Kit | Комплект средств разработки программного обеспечения |
| Linux | Linux | Свободная открытая Unix-подобная операционная система |
| Kernel | Linux Kernel | Ядро Linux, управляющее аппаратными ресурсами и базовыми системными службами |
| Hypervisor | Virtual Machine<br>Monitor | Программный или аппаратный монитор виртуальных машин, распределяющий физические ресурсы |
| Jailhouse | Jailhouse | Небольшой гипервизор для промышленных приложений |

### 11.2 Указатель документов

```text
Reference Document
```

| Документ | Описание | Путь документа |
| --- | --- | --- |
| Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf | Описание платы FT232H | openocd_eclipse-2020-<br>09\RK\OpenOCD\doc |
| Rockchip_Developer_Guide_GNU_MCU_Eclipse_OpenOCD_CN.pdf | Руководство OpenOCD | openocd_eclipse-2020-<br>09\RK\OpenOCD\doc |
| Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf | Разработка U-Boot | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_Linux_AB_System_CN.pdf | Два раздела A/B | docs\cn\Common\UBOOT |
| Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf | Руководство eMMC | docs\cn\Common\MMC |
| Rockchip_Developer_Guide_UART_CN.pdf | Руководство UART | docs\cn\Common\UART |
| Rockchip_Developer_Guide_RT-Thread_SPIFLASH_CN.pdf | Руководство SPI Flash | docs\cn\Common\NVM |
