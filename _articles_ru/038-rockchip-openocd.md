---
title: "Rockchip GNU MCU Eclipse OpenOCD: полное руководство по отладке JTAG, Linux и bare-metal"
description: "Полное руководство по настройке OpenOCD, подключениям, базовой и расширенной отладке, зависанию CPU, RT-Thread, Linux, bare-metal и KGDB."
translation_key: "038-rockchip-openocd"
slug: "038-rockchip-openocd"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["Rockchip", "OpenOCD", "JTAG", "GDB", "KGDB", "Linux"]
keywords: "ArmSoM Rockchip OpenOCD Eclipse JTAG SWD GDB KGDB Linux bare metal"
excerpt: "Полное руководство по настройке OpenOCD, подключениям, базовой и расширенной отладке, зависанию CPU, RT-Thread, Linux, bare-metal и KGDB."
---

# Rockchip GNU MCU Eclipse OpenOCD: полное руководство по отладке JTAG, Linux и bare-metal

Полное изложение GNU MCU Eclipse OpenOCD V2.0.0 (RK-KF-YF-91) сохраняет все шесть технических глав, команды, журналы, примеры и 53 технических снимка экрана. Предоставлен только китайский PDF (41 страница). Английская и русская версии полностью переведены с него; используются исходные рисунки китайского PDF с локализованными подписями и alt. Комментарии исходного кода, команд и журналов сохранены. Наличие английских оригиналов рисунков не заявляется.

Это справочник для старой версии специализированного инструмента Rockchip. Источник перечисляет RK3588, RK3568, RK3566, RK3399, RK3288, RK3368, RK3326, PX30, RK3308, RV1108, RV1126/RV1109/RV1106, RK2108, RK2206 и RISCV, но столбец версии ядра пуст. Это не подтверждает совместимость со всеми современными BSP или платами ArmSoM. Даже для RK3588 на ArmSoM [Sige7](https://docs.armsom.org/armsom-sige7) нужно проверить выводы JTAG/SWD, IOMUX, уровни напряжения, адаптер, скрипты чипа, символы, SDK/BSP и ядро. Проверка на оборудовании ArmSoM не проводилась.

Таблица версий из источника (пустые версии ядра сохранены):

| Чип | Версия ядра |
|---|---|
| RK3588 | |
| RK3568 | |
| RK3566 | |
| RK3399 | |
| RK3288 | |
| RK3368 | |
| RK3326 | |
| PX30 | |
| RK3308 | |
| RV1108 | |
| RV1126/RV1109/RV1106 | |
| RK2108 | |
| RK2206 | |
| RISCV | |

Версии программ, источники пакетов и пути ниже относятся к среде исходного документа, а не к текущим рекомендациям по установке. Отладка может останавливать CPU, изменять память и вызывать KGDB. Используйте только разрешённые и восстанавливаемые тестовые устройства. Команды в рамках статьи не выполнялись; времена, журналы и сбои источника не являются измерениями ArmSoM.

## 1. Обзор

Архитектура отладки: `Eclipse CDT + GNU MCU Eclipse OpenOCD + Eclipse + GDB + OpenOCD + ftdi/jlink + SoC`. CDT означает C/C++ Development Tooling. GNU MCU Eclipse OpenOCD — открытый плагин взаимодействия CDT с GDB и OpenOCD. Eclipse объединяет плагины; ARM DS-5 также основан на Eclipse. GDB — отладчик GNU. OpenOCD поддерживает адаптеры SWD/JTAG и архитектуры ARM, RISCV и другие. В источнике применяется USB–SWD/JTAG адаптер FT232H, описанный как быстрый и стабильный.

## 2. Среда операционной системы

### 2.1 Windows

#### 2.1.1 Пакет openocd_eclipse.zip

Распакуйте архив, перейдите в корневой каталог и запустите `Eclipse_for_OpenOCD V1.0.exe`. В каталоге RK: `eclipse-workspace` — заранее выбранное рабочее пространство; `example` — примеры; `tools` — GDB, JDK и другие инструменты; `实战视频` — вводные видео; `OpenOCD` — файлы OpenOCD; `SVD` (CMSIS System View Description format) — описание для просмотра регистров; `doc` — справочные документы.

#### 2.1.2 Установка JRE

Для Eclipse требуется JRE; в источнике указан установщик `RK\tools\jdk_8.0.1310.11_64.exe`.

#### 2.1.3 Включение Telnet в Windows

Telnet используется для командного режима OpenOCD. Путь к настройке зависит от версии Windows; снимки источника показывают Windows 10.

![Включение клиента Telnet в Windows 10](/docs/rockchip-openocd/assets/cn-p07-figure1.png)

![Включение клиента Telnet в Windows 10](/docs/rockchip-openocd/assets/cn-p07-figure2.png)

### 2.2 64-битная Ubuntu

#### 2.2.1 Пакет openocd_eclipse.tar.gz

```text
 tar -xzvf openocd_eclipse.tar.gz
```

В распакованном корневом каталоге запустите `eclipse`. RK содержит рабочее пространство `eclipse-workspace`, `example`, `OpenOCD`, описания регистров `SVD`, инструменты вроде GDB в `tools`, справку `doc` и вводные видео `实战视频`.

#### 2.2.2 Установка зависимостей

Для Eclipse требуется JRE; источник отмечает, что версия 8 необязательна:

```text
 sudo add-apt-repository ppa:openjdk-r/ppa
 sudo apt-get update
 sudo apt-get install openjdk-8-jre 这⾥不⼀定要8
```

OpenOCD нужны libusb и libftdi:

```text
 sudo apt-get install libusb-1.0-0-dev
 sudo apt-get install libftdi-dev
```

Скопируйте правила устройств USB:

```text
 sudo cp RK/OpenOCD/drivers/99-openocd.rules /etc/udev/rules.d/
 sudo cp RK/OpenOCD/drivers/60-openocd.rules /etc/udev/rules.d/
```

Установите открытый инструмент дизассемблирования Capstone. Источник сообщает об успешной проверке в Ubuntu 16.04 и 18.04; это не проверка современной системы или оборудования ArmSoM.

```text
 sudo apt-get install libcapstone-dev
```

## 3. Быстрый старт

Интерфейсы Ubuntu и Windows в основном одинаковы; источник преимущественно показывает Windows.

### 3.1 Аппаратное подключение

#### 3.1.1 Стандартный 20-контактный JTAG ARM

![Подключение 20-контактного JTAG ARM](/docs/rockchip-openocd/assets/cn-p09-figure1.png)

#### 3.1.2 Переходная плата TF–JTAG

![Подключение TF–JTAG](/docs/rockchip-openocd/assets/cn-p10-figure1.png)

На исходной фотографии отмечены TMS, TCK и GND, а также SWD для чипов архитектуры RK и JTAG для RISC-V. Это описание показанной конфигурации инструмента/чипа, не замена проверке схемы целевой платы.

#### 3.1.3 Мультиплексирование UART2/JTAG

![Соединение при мультиплексировании UART2/JTAG](/docs/rockchip-openocd/assets/cn-p10-figure2.png)

### 3.2 Программное подключение

#### 3.2.1 Запуск программы

Запустите `Eclipse_for_OpenOCD V1.0.exe`.

![Запуск Eclipse и рабочее пространство](/docs/rockchip-openocd/assets/cn-p11-figure1.png)

#### 3.2.2 Импорт конфигурации чипа (необязательно)

Обычный пакет уже содержит конфигурации чипов. При обновлении, изменении или добавлении импортируйте их согласно рисункам.

![Начало импорта конфигурации чипа](/docs/rockchip-openocd/assets/cn-p11-figure2.png)

![Выбор и импорт конфигурации чипа](/docs/rockchip-openocd/assets/cn-p12-figure1.png)

![Выбор и импорт конфигурации чипа](/docs/rockchip-openocd/assets/cn-p12-figure2.png)

#### 3.2.3 Выбор целевого чипа

![Выбор подключаемого чипа](/docs/rockchip-openocd/assets/cn-p13-figure1.png)

![Выбор чипа в Debug Configurations и подключение](/docs/rockchip-openocd/assets/cn-p13-figure2.png)

#### 3.2.4 Успешное подключение

Ниже показано успешное подключение после остановки CPU.

![Полный интерфейс после подключения и остановки CPU](/docs/rockchip-openocd/assets/cn-p14-figure1.png)

#### 3.2.5 Ошибки подключения

##### 3.2.5.1 Адаптер JTAG не обнаружен

Проверьте драйвер и исправность адаптера. См. `Rockchip_Developer_Guide_FT232H_USB2JTAG.pdf`. Сборка OpenOCD из источника автоматически обнаруживает FT232H, FT2232H и J-Link.

![Журнал ошибки обнаружения адаптера JTAG](/docs/rockchip-openocd/assets/cn-p14-figure2.png)

##### 3.2.5.2 Чип не обнаружен

Проверьте контакты и включение JTAG IOMUX; при необходимости уменьшите TCK. Следующее сообщение означает, что соединение и обнаружение JTAG исправны, но состояние чипа неверное и отладку продолжать нельзя.

```text
the connection is ok, but the cpu is in incorrect state
```

Следующие сообщения указывают на проблему соединения, IOMUX или контактов:

```text
please check hardware, make sure swd/jtag iomux is correct, and the pins connection is ok
please check hardware, the swdio(tms) pin is low level
```

![Ошибка подключения или уровня SWDIO/TMS](/docs/rockchip-openocd/assets/cn-p15-figure1.png)

При следующем сообщении уменьшите скорость JTAG и повторите попытку:

```text
Please, adapter speed 1000 set clk 1MHz to try again
```

## 4. Основные функции отладки

### 4.1 Настройка скорости SWD/JTAG

Если аппаратные ограничения мешают обмену, уменьшите TCK, например до 1000 KHz. Источник указывает максимум 30000 KHz и рекомендует 15000 KHz или 7500 KHz; пригодность зависит от соединений платы и адаптера.

![Настройка скорости SWD/JTAG](/docs/rockchip-openocd/assets/cn-p15-figure2.png)

### 4.2 Статическая загрузка символов

Настройте до подключения; статически можно загрузить только одну таблицу символов.

![Настройка статической таблицы символов](/docs/rockchip-openocd/assets/cn-p16-figure1.png)

### 4.3 Динамическая загрузка символов

Debugger Console принимает команды GDB. Через `add-symbol-file` можно загрузить несколько таблиц символов. Ниже загружаются Linux, BL31, TPL, SPL и U-Boot соответственно. Замените обратные косые черты Windows прямыми. После загрузки выполните один шаг для отображения стека вызовов.

```text
 加载linux符号表：add-symbol-file G:/vmlinux
 加载bl31符号表：add-symbol-file T:/work/uboot/u-boot/bl31.elf

 加载tpl符号表：add-symbol-file T:/work/uboot/u-boot/tpl/u-boot-tpl
 加载spl符号表：add-symbol-file T:/work/uboot/u-boot/spl/u-boot-spl
 加载uboot符号表：add-symbol-file T:/work/uboot/u-boot/u-boot
```

![Загрузка символов через Debugger Console](/docs/rockchip-openocd/assets/cn-p16-figure2.png)

### 4.4 Настройка путей исходников

Первый способ использует интерфейс поиска исходников, второй — Debug Configurations; оба показаны на снимках источника.

![Два способа настройки путей исходников](/docs/rockchip-openocd/assets/cn-p17-figure1.png)

![Два способа настройки путей исходников](/docs/rockchip-openocd/assets/cn-p17-figure2.png)

### 4.5 Просмотр дизассемблирования

Можно просмотреть дизассемблирование функции стека, заданного адреса или именованной функции. Для поиска функции нужно импортировать символы.

![Дизассемблирование по адресу или функции](/docs/rockchip-openocd/assets/cn-p18-figure1.png)

![Дизассемблирование по адресу или функции](/docs/rockchip-openocd/assets/cn-p18-figure2.png)

### 4.6 Просмотр локальных переменных

![Локальные переменные функции стека](/docs/rockchip-openocd/assets/cn-p19-figure1.png)

### 4.7 Просмотр глобальных переменных

В окне Expressions выберите Add new expression и введите имя глобальной переменной. Можно также вводить выражения с указателями.

![Добавление выражения глобальной переменной](/docs/rockchip-openocd/assets/cn-p19-figure2.png)

![Просмотр данных через переменные и указатели](/docs/rockchip-openocd/assets/cn-p20-figure1.png)

![Просмотр данных через переменные и указатели](/docs/rockchip-openocd/assets/cn-p20-figure2.png)

### 4.8 Пошаговая отладка

![Панель и управление пошаговой отладкой](/docs/rockchip-openocd/assets/cn-p21-figure1.png)

### 4.9 Установка точек останова

Устанавливайте точки останова в окне исходного кода или Disassembly.

![Точка останова в исходном коде](/docs/rockchip-openocd/assets/cn-p21-figure2.png)

![Точка останова в Disassembly](/docs/rockchip-openocd/assets/cn-p22-figure1.png)

### 4.10 Просмотр памяти

Memory Browser из источника корректно работает только с 32-битными адресами и имеет проблемы с 64-битными. Для 64-битных адресов используйте командный режим OpenOCD и команды `mdw`, `mww`, `smdw`, `smww`, `io` и аналогичные.

![Просмотр памяти в Memory Browser](/docs/rockchip-openocd/assets/cn-p22-figure2.png)

## 5. Расширенная отладка

### 5.1 Группы регистров

Группировка упрощает просмотр большого набора регистров.

![Настройка и отображение групп регистров](/docs/rockchip-openocd/assets/cn-p23-figure1.png)

![Настройка и отображение групп регистров](/docs/rockchip-openocd/assets/cn-p23-figure2.png)

### 5.2 Выбор CPU

![Выбор целевого CPU](/docs/rockchip-openocd/assets/cn-p24-figure1.png)

### 5.3 Защищённая отладка

Если в изделии включена политика безопасности, для JTAG нужен разрешённый ключ. Здесь показан вход аутентификации, а не обход политики.

![Настройка ключа защищённой отладки](/docs/rockchip-openocd/assets/cn-p24-figure2.png)

### 5.4 OpenOCD в командном терминале

Откройте OpenOCD в cmd для просмотра справки. Другие команды описаны в [OpenOCD User’s Guide](https://openocd.org/doc/html/General-Commands.html#General-Commands). В сборке источника `openocd.exe -r` подключается к чипу.

![Справка командной строки OpenOCD](/docs/rockchip-openocd/assets/cn-p25-figure1.png)

```text
  http://openocd.org/doc/html/General-Commands.html#General-Commands
```

Откройте ещё одно окно cmd и выполните `telnet localhost 4444`. Можно также создать сеанс Telnet в SecureCRT согласно рисункам.

![Локальное соединение Telnet из cmd](/docs/rockchip-openocd/assets/cn-p26-figure1.png)

![Локальное соединение Telnet из cmd](/docs/rockchip-openocd/assets/cn-p26-figure2.png)

![Соединение Telnet через SecureCRT](/docs/rockchip-openocd/assets/cn-p27-figure1.png)

![Соединение Telnet через SecureCRT](/docs/rockchip-openocd/assets/cn-p27-figure2.png)

![Просмотр и переключение CPU в SecureCRT](/docs/rockchip-openocd/assets/cn-p28-figure1.png)

### 5.5 Командный режим OpenOCD в Eclipse

Если сведения или действия неудобно доступны через UI, откройте локальный терминал и введите `telnet localhost 4444`. Если команда не найдена, включите Telnet Windows согласно §2.1.3.

![Локальный терминал Eclipse и команды OpenOCD](/docs/rockchip-openocd/assets/cn-p28-figure2.png)

![Вывод команд OpenOCD в терминале Eclipse](/docs/rockchip-openocd/assets/cn-p29-figure1.png)

### 5.6 Наглядный просмотр регистров периферии

Перед подключением выберите файл SVD, затем просматривайте регистры согласно рисункам.

![Файл SVD и визуальное представление регистров периферии](/docs/rockchip-openocd/assets/cn-p29-figure2.png)

![Файл SVD и визуальное представление регистров периферии](/docs/rockchip-openocd/assets/cn-p29-figure3.png)

### 5.7 Наглядный просмотр системных регистров

Для этого представления также выберите SVD до подключения.

![SVD и представление системных регистров](/docs/rockchip-openocd/assets/cn-p30-figure1.png)

![SVD и представление системных регистров](/docs/rockchip-openocd/assets/cn-p30-figure2.png)

### 5.8 Экспорт памяти в файл

Ниже приведены синтаксис и исходные примеры виртуального и физического адресов; `p:` обозначает физический адрес. Скорости взяты из примеров источника.

```text
dump_image filename [p:]address size
```

```text
 dump_image filename [p:]address size
 虚拟地址访问：

 > dump_image dd.bin 0xffffff8009a63c80 65536
 dumped 65536 bytes in 0.113187s (565.436 KiB/s)
 物理地址访问：
 > dump_image dd.bin p:0x01c63c80 65536
 dumped 65536 bytes in 0.094566s (676.776 KiB/s)
```

### 5.9 Импорт файла в память

```text
load_image filename [p:]address ['bin'|'ihex'|'elf'|'s19'] [min_address] [max_length]
```

```text
 load_image filename [p:]address ['bin'|'ihex'|'elf'|'s19'] [min_address]
 [max_length]
 虚拟地址访问：

 > load_image dd.bin 0xffffff8009a63c80 bin
 65536 bytes written at address 0xffffff8009a63c80
 downloaded 65536 bytes in 0.055928s (1144.328 KiB/s)
 物理地址访问：
 > load_image dd.bin p:0x01c63c80 bin
 65536 bytes written at address 0x01c63c80
 downloaded 65536 bytes in 0.056400s (1134.752 KiB/s)
```

### 5.10 Сравнение файла с памятью

`verify_image` поддерживает только виртуальные адреса.

```text
verify_image filename [offset [type]]
```

```text
 verify_image filename [offset [type]]
 只⽀持虚拟地址访问：
 > verify_image dd.bin 0xffffff8009a63c80

 verified 65536 bytes in 0.066775s (958.443 KiB/s)
```

Эти три команды используют виртуальные и физические адреса. Источник считает их одинаковыми для maskrom, TPL, SPL, U-Boot и ATF, поэтому там достаточно виртуального доступа. В Linux они отличаются; для физического адреса добавляйте `p:`. Относительное имя вроде `dd.bin` относится к рабочему каталогу OpenOCD. Фактическое отображение зависит от состояния целевой системы.

## 6. Практические сценарии

### 6.1 Анализ зависания CPU

Зависшее изображение, чёрный экран, не отвечающая консоль или ошибки ядра могут указывать на остановку CPU на инструкциях. В примере RK3399 зависает при загрузке: журнал останавливается, консоль не отвечает, изображение не обновляется. Ниже сохранены исходные журналы.

```text
 [  7.441882] type=1400 audit(1501952314.540:9): avc: denied { setattr } for
 pid=1 comm="init" name="mmcblk1p13" dev="tmpfs" ino=15288 scontext=u:r:init:s0
 tcontext=u:object_r:block_device:s0 tclass=lnk_file permissive=1

 [  7.455950] init: Service 'exec 2 (/system/bin/vdc)' (pid 252) exited with
 status 0
 rk3399_all:/ $ [ 7.589883] random: nonblocking pool is initialized
 [  8.078474] init: Starting service 'bootanim'...
 [  8.261358] read channel() error: -110
 [  15.245727] BUG: spinlock lockup suspected on CPU#2, adbd/251
```

```text
 $ ./src/openocd.exe -r rk3399
 Open On-Chip Debugger 0.10.0+dev-01555-g6ad367fa3-dirty (2021-08-04-17:44)

 Licensed under GNU GPL v2
 For bug reports, read
       http://openocd.org/doc/doxygen/bugs.html
 中间省掉很多log
 Info : clock speed 2000 kHz
 Info : SWD DPIDR 0x5ba02477
 Info : cpu0: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu1: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu2: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu3: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu4: hardware has 6 breakpoints, 4 watchpoints
 Info : cpu5: hardware has 6 breakpoints, 4 watchpoints

 Info : starting gdb server for cpu0 on 3333
 Info : Listening on port 3333 for gdb connections
 Info : starting gdb server for cpu1 on 3334
 Info : Listening on port 3334 for gdb connections
 Info : starting gdb server for cpu2 on 3335
 Info : Listening on port 3335 for gdb connections
 Info : starting gdb server for cpu3 on 3336
 Info : Listening on port 3336 for gdb connections
 Info : starting gdb server for cpu4 on 3337
 Info : Listening on port 3337 for gdb connections
 Info : starting gdb server for cpu5 on 3338
 Info : Listening on port 3338 for gdb connections
```

В другом терминале выполните `telnet localhost 4444`. `cpu_block` показывает команды; `l` — состояние CPU, `dump_pc` многократно читает PC, `halt` пытается остановить CPU, при неудаче используется `fhalt`. После принудительной остановки можно читать `core_reg64`/`core_reg32`; источник предупреждает, что доступ к памяти в этом состоянии невозможен.

```text
 另外再打开⼀个cmd窗⼝，输⼊telnet localhost 4444 进⼊命令⾏调试


 Open On-Chip Debugger
 > cpu_block 查看针对cpu卡死问题，有哪些命令可以⽤
 l 查看cpu状态
 dump_pc 多次打印pc指针
 halt 停住cpu
 if halt fail, try fhalt 强制cpu进⼊debug 状态
 if fhalt success, try core_reg64 or core_reg32, but you can't access memory
 > l
    TargetName    Type    Endian TapName    State
 -- ------------------ ---------- ------ ------------------ ------------
  0 ahb           mem_ap  little RK3399.cpu running
  1 apb           mem_ap  little RK3399.cpu running
  2* cpu0         aarch64 little RK3399.cpu running

  3 cpu1          aarch64 little RK3399.cpu running
  4 cpu2          aarch64 little RK3399.cpu running
  5 cpu3          aarch64 little RK3399.cpu running
  6 cpu4          aarch64 little RK3399.cpu running
  7 cpu5          aarch64 little RK3399.cpu running

 > dump_pc
 1
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 2
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078

 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 3
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 4
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c

 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c
 5
 cpu0 pc:0xffffff8008143a88
 cpu1 pc:0xffffff8008143a5c
 cpu2 pc:0xffffff8008081078
 cpu3 pc:0xffffff8008081078
 cpu4 pc:0xffffff80081133c8
 cpu5 pc:0xffffff800808248c 经过5次打印，发现6个cpu的pc指针都没变，那么很可能是卡死了


 > halt
 Timeout waiting for target cpu0 halt 第⼀次尝试停cpu0失败

 > fhalt
 cpu0 fail to force entry to debug state; prsr:00000001 第⼆次尝试停cpu0失败，这时只能
 根据打印出来的pc指针来查问题了

 > l cpu1

 > halt
 Timeout waiting for target cpu1 halt

 > fhalt

 cpu1 fail to force entry to debug state; prsr:00000001
 > l cpu2
 > halt
 Timeout waiting for target cpu2 halt

 > fhalt

 cpu2 success to force entry to debug state; prsr:00000011 终于可以停住cpu2

 > core_reg64 可以打印cpu通⽤寄存器，以便进⼀步分析
 x0 (/64): 0xffffffc00a3d7e00
 x1 (/64): 0xffffff8008081028
 x2 (/64): 0x0000000000000000
 x3 (/64): 0x00000040edbb6000
 x4 (/64): 0x0100000000000000
 x5 (/64): 0x000000000d8031bf
 x6 (/64): 0x000000000000126a
 x7 (/64): 0xffffff8008141ee0
 x8 (/64): 0x0000000000000000

 x9 (/64): 0x0000000000000000
 x10 (/64): 0x00000000000012b0
 x11 (/64): 0x000000000000000f
 x12 (/64): 0x0000000100000000
 x13 (/64): 0x0000000000000001
 x14 (/64): 0x0000000000000000
 x15 (/64): 0x0000000000000000
 x16 (/64): 0xffffff80080b8b28
 x17 (/64): 0x0000007cf3aeee00
 x18 (/64): 0x0000000000000000
 x19 (/64): 0x000000000000001e
 x20 (/64): 0x0000008000000000
 x21 (/64): 0xffffff80094e7990

 x22 (/64): 0xffffff8009357ea0
 x23 (/64): 0xffffffc00a3d7e00
 x24 (/64): 0x0000000000000001
 x25 (/64): 0xffffffc0f6ed4060
 x26 (/64): 0xffffffc0f6ed8050
 x27 (/64): 0x0000000000ed9234
 x28 (/64): 0xffffffc00a3cad00
 x29 (/64): 0xffffffc0f6ed8000
 x30 (/64): 0xffffff8008083230
 sp (/64): 0xffffffc0f6ed8000
 pc (/64): 0xffffff800808107c


 > mrs SCTLR_EL1 也可以读system control寄存器
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL1:0x34d5d91d

 > mrs SCTLR_EL2
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL2:0x30c50830

 > mrs SCTLR_EL3
 Cannot reach EL 0, SPSR corrupted?
 SCTLR_EL3:0x00cd383f
```

В примере PC всех шести CPU не меняются за пять измерений, что указывает на возможное зависание. Принудительная остановка CPU0/CPU1 не удалась, CPU2 — удалась. `core_reg64` выводит общие регистры, `mrs SCTLR_EL1/EL2/EL3` читает системные. Команда `objdump.exe -d vmlinux | less` помогает найти функцию и инструкцию PC. Источник отмечает остановку CPU2 на `dsb sy` по адресу `0xffffff800808107c`.

```text
 执⾏objdump.exe -d vmlinux | less，反汇编查看pc指针所处的函数和指令

 ffffff8008081028 <gic_handle_irq>:
 ffffff8008081028: a9bc7bfd   stp   x29, x30, [sp, #-64]!
 ffffff800808102c: 910003fd   mov   x29, sp
 ffffff8008081030: a9025bf5   stp   x21, x22, [sp, #32]

 ffffff8008081034: d00096b6   adrp  x22, ffffff8009357000
 <event_hash+0x288>
 ffffff8008081038: a90363f7   stp   x23, x24, [sp, #48]
 ffffff800808103c: d000a335   adrp  x21, ffffff80094e7000
 <event_class_drv_config+0x40>
 ffffff8008081040: aa0003f7   mov   x23, x0
 ffffff8008081044: 913a82d6   add   x22, x22, #0xea0
 ffffff8008081048: 912642b5   add   x21, x21, #0x990
 ffffff800808104c: a90153f3   stp   x19, x20, [sp, #16]
 ffffff8008081050: 52800038   mov   w24, #0x1
 // #1
 ffffff8008081054: d503201f   nop

 ffffff8008081058: 14000008   b     ffffff8008081078
 <gic_handle_irq+0x50>
 ffffff800808105c: 71003e7f   cmp   w19, #0xf
 ffffff8008081060: 540007e8   b.hi  ffffff800808115c
 <gic_handle_irq+0x134> // b.pmore
 ffffff8008081064: 92407e60   and   x0, x19, #0xffffffff
 ffffff8008081068: d518cc20   msr   s3_0_c12_c12_1, x0
 ffffff800808106c: d5033fdf   isb
 ffffff8008081070: d503201f   nop
 ffffff8008081074: 14000035   b     ffffff8008081148
 <gic_handle_irq+0x120>
 ffffff8008081078: d538cc13   mrs   x19, s3_0_c12_c12_0
 *ffffff800808107c: d5033f9f   dsb  sy   cpu2卡死在这个位置

 ffffff8008081080: 51004260   sub   w0, w19, #0x10
 ffffff8008081084: 2a1303f4   mov   w20, w19
 ffffff8008081088: 710fac1f   cmp   w0, #0x3eb
 ffffff800808108c: 54000089   b.ls  ffffff800808109c
 <gic_handle_irq+0x74> // b.plast
 ffffff8008081090: 5283ffe0   mov   w0, #0x1fff
 // #8191
 ffffff8008081094: 6b00027f   cmp   w19, w0
 ffffff8008081098: 54fffe29   b.ls  ffffff800808105c
 <gic_handle_irq+0x34> // b.plast
```

Если причина остаётся неясной, источник рекомендует передать журналы этих команд инженерам Rockchip.

### 6.2 Отладка RT-Thread

По умолчанию отображается один поток. Для нескольких потоков добавьте:

```text
 -c "cpu0 configure -rtos RT_Thread"
```

![Настройка многопоточной отладки RT-Thread](/docs/rockchip-openocd/assets/cn-p36-figure1.png)

### 6.3 Пошаговая отладка Linux

Если при загрузке ядра нет журналов и проблемы UART исключены, исследуйте ранний этап загрузки. Ниже вставляется бесконечный цикл для остановки исполнения. Эти примеры намеренно блокируют загрузку и не должны оставаться в производственных образах.

#### 6.3.1 Одноядерный этап ядра

Измените `linux5.10/init/main.c`. Щёлкните правой кнопкой по инструкции после `b .`, выберите Move To line для выхода из цикла и выполняйте шаги.

```text
 linux5.10/init/main.c
 asmlinkage __visible void __init __no_sanitize_address start_kernel(void)

 {
    char *command_line;
    char *after_dashes;
    asm volatile("b .");
  ...
  }
```

![Выход из цикла b . для пошаговой отладки](/docs/rockchip-openocd/assets/cn-p37-figure1.png)

#### 6.3.2 Многоядерный этап ядра

Измените `linux5.10/kernel/cpu.c`:

```text
 linux5.10/kernel/cpu.c
 void bringup_nonboot_cpus(unsigned int setup_max_cpus)

 {
    unsigned int cpu;

    for_each_present_cpu(cpu) {
       if (num_online_cpus() >= setup_max_cpus)
          break;
       if (!cpu_online(cpu))
          cpu_up(cpu, CPUHP_ONLINE);
    }
    asm volatile("b .");
 }
```

![Пошаговая отладка многоядерной загрузки](/docs/rockchip-openocd/assets/cn-p37-figure2.png)

### 6.4 Отладка bare-metal

#### 6.4.1 Создание проекта

Создайте проект стандартным способом Eclipse, задайте параметры компилятора и кросс-компилятор.

![Настройка компилятора и кросс-компилятора bare-metal](/docs/rockchip-openocd/assets/cn-p38-figure1.png)

#### 6.4.2 Загрузка и запуск прошивки

Сначала скопируйте конфигурацию целевого чипа, затем изменяйте копию.

![Копирование конфигурации отладки перед изменением](/docs/rockchip-openocd/assets/cn-p38-figure2.png)

![Копирование конфигурации чипа и настройка загрузки прошивки](/docs/rockchip-openocd/assets/cn-p39-figure1.png)

### 6.5 Использование KGDB

#### 6.5.1 Назначение

KGDB используется для отладки драйверов и полного стека вызовов при ошибках указателей. Связь идёт по UART, а не JTAG.

#### 6.5.2 Включение KGDB

Примените настройки menuconfig из источника. Задайте `panic timeout` равным `0`, чтобы при die входить в KGDB без перезагрузки. Альтернатива: `echo 0 > /sys/module/kernel/parameters/panic`.

```text
 Device Drivers --->
   Character devices --->
     [*]  Virtual terminal

         [*]   Enable character translations in console (NEW)
         [*]   Support for console on virtual terminal (NEW)
 -> Kernel hacking
  -> Generic Kernel Debugging Instruments
    [*] KGDB: kernel debugger --->
     --- KGDB: kernel debugger
     [*]  KGDB: use kprobe blocklist to prohibit unsafe breakpoints (NEW)
     <*>  KGDB: use kgdb over the serial console (NEW)

 Kernel hacking --->
   Debug Oops, Lockups and Hangs --->
    (0) panic timeout 这个要配成0，出现die时才会进⼊kgdb

  或者echo 0 > /sys/module/kernel/parameters/panic 将panic timeout时间设为0，即
 不reboot
```

Пример настройки ядра в `arch/arm64/boot/dts/rockchip/rk3588-android.dtsi`:

```text
 arch/arm64/boot/dts/rockchip/rk3588-android.dtsi
 chosen {
    bootargs = "kgdboc_earlycon kgdboc=ttyFIQ0,1500000";

 };
```

Источник проверяет включение через `echo g > /proc/sysrq-trigger`; журнал заканчивается ожиданием удалённого отладчика:

```text
 echo g > /proc/sysrq-trigger

 [  1.385017][ T0] kgdboc: No suitable earlycon yet, will try later

 [  1.385069][ T0] earlycon: uart8250 at MMIO32 0x00000000feb50000
 (options '')
 [  1.390726][ T0] printk: bootconsole [uart8250] enabled
 [  2.956193][ T0] kgdboc: Going to register kgdb with earlycon 'uart'
 [  2.956196][ T0] KGDB: Registered I/O driver kgdboc_earlycon
 [  3.092139][ T1] Unable to handle kernel NULL pointer dereference at
 virtual address 000000000000007f
 [  3.093010][ T1] Mem abort info:
 [  3.093329][ T1] ESR = 0x96000005
 [  3.093672][ T1] EC = 0x25: DABT (current EL), IL = 32 bits
 [  3.094219][ T1] SET = 0, FnV = 0
 [  3.094561][ T1] EA = 0, S1PTW = 0
 [  3.094912][ T1] Data abort info:

 [  3.095238][ T1] ISV = 0, ISS = 0x00000005
 [  3.095651][ T1] CM = 0, WnR = 0
 [  3.095987][ T1] [000000000000007f] user address but active_mm is
 swapper
 [  3.096633][ T1] Internal error: Oops: 96000005 [#1] PREEMPT SMP
 [  3.097206][ T1] KGDB: Waiting for remote debugger
```

#### 6.5.3 Настройка KGDB

![Настройка удалённого подключения KGDB](/docs/rockchip-openocd/assets/cn-p40-figure1.png)

### 6.6 Отладка 32-битного режима AArch64

```text
-c "cpu0 aarch64_32 "
```

![Параметр 32-битного режима AArch64](/docs/rockchip-openocd/assets/cn-p41-figure1.png)

## Замечания к источнику и среде

Дата версии на обложке отличается от некоторых времён в журналах; список чипов не определяет версии ПО. Команды `-r`, `cpu_block`, `fhalt`, `core_reg64`, `aarch64_32` могут зависеть от специализированного OpenOCD Rockchip и не гарантируются в основной версии. JRE 8, старые Ubuntu/PPA и пути сохранены как исторические примеры, а не обещание установки сегодня. Все рисунки сохранены; дополнительные параметры UI относятся к старому инструменту. Лицензии, необходимые указания авторства и комментарии внутри кода/журналов не удалялись вместе со служебными заявлениями. [Полный журнал проверки](/docs/rockchip-openocd/EDITORIAL-NOTES.md).
