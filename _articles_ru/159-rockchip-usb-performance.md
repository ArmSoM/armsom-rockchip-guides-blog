---
title: "Производительность Rockchip USB: Host, Gadget и узкие места"
description: "Производительность Rockchip USB: Host, Gadget и узкие места — V1.1.1"
excerpt: "Производительность Rockchip USB: Host, Gadget и узкие места"
translation_key: "159-rockchip-usb-performance"
slug: "159-rockchip-usb-performance"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "peripherals"
products: []
tags: [ArmSoM, Rockchip, USB, Linux]
---

{% raw %}

# Производительность Rockchip USB: Host, Gadget и узкие места

Платформенная справка ArmSoM: китайский RK-KF-YF-100 V1.1.1 охватывает серии 30, 31, 32, 33, PX, Sofia и RV1108 с Linux 3.10/4.4, но не подтверждает поддержку всех плат ArmSoM. Проверяйте плату, SoC, BSP, разводку, контроллер и ядро. Все результаты — примеры источника, не измерения ArmSoM; аппаратная проверка не проводилась. Английского PDF нет; во всех четырёх версиях используются четыре рисунка китайского PDF.

Замечания: сохранены исторические имена USB, “400MBps?”, Webcam 648×480 / UYV и KB/MB без единицы времени; это не утверждения о современных стандартах. Исходные rm of=…, ehco, длинные тире в параметрах blkparse и пробел в пути сомнительны; перед применением сверяйте синтаксис инструмента. Прямая запись на диск, сброс кеша, изменение Gadget, отключение ядер CPU и межсетевого экрана влияют на систему: это только исходные лабораторные процедуры, они не выполнялись, нужна изолированная среда. Противоречие HID protocol=2 и комментария Keyboard также сохранено.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Теоретические скорости USB

### 1.1 USB Communication Flow

Рисунок 1-1 показывает многоуровневую модель USB: соединение хоста с устройством состоит из связей нескольких уровней. Уровень интерфейса шины обеспечивает физическое соединение и передачу/приём данных. Уровень устройства видим системному ПО USB, выполняющему общие операции. Прикладной уровень через соответствующее клиентское ПО предоставляет хосту дополнительные функции. Связь уровней устройства и приложения логическая; физическую передачу выполняет интерфейс шины.

![Рисунок источника — PDF p4](/docs/rockchip-usb-performance/assets/cn-p004-figure-01.png)

Рисунок 1-1. USB Communication Flow

### 1.2 Скорость физического уровня

Скорость физического уровня — скорость физической шины USB. Исторический источник перечисляет пять стандартов: USB1.0, USB1.1, USB2.0, USB3.0 (USB3.1 Gen1), USB3.1 Gen2. Максимальные скорости приведены в таблице 1-1.

| Версия USB | Максимальная скорость | Обозначение |
| --- | --- | --- |
| USB 1.0 | 1.5Mbps | Низкая скорость(Low-Speed) |
| USB 1.1 | 12Mbps | Полная скорость(Full-Speed) |
| USB 2.0 | 480Mbps | Высокая скорость(High-Speed) |
| USB 3.0(USB 3.1 Gen1) | 5Gbps | Сверхскорость(Super-Speed) |
| USB 3.1 Gen2 | 10Gbps | В источнике ещё не определено(Super-Speed+) |

### 1.3 Скорость протокольного уровня

Типы USB-устройств используют разные классовые протоколы: накопители — подкласс USB Mass Storage Class Bulk-Only Transport, камеры — USB Video Class, HID — USB Human Interface Devices Class. Другие спецификации доступны у USB-IF. Форматы пакетов различаются; некоторые протоколы требуют командных пакетов и подтверждений. Различаются и виды передачи: накопители — Bulk, камеры — Isochronous, HID — Interrupt.

Четыре вида:

- Control: перечисление при подключении и специальные операции устройства.
- Interrupt: надёжная передача небольших объёмов с жёсткими требованиями задержки, например клавиатуры и игровые контроллеры.
- Bulk: надёжные большие объёмы без строгой задержки, например накопители и Ethernet.
- Isochronous: передача в реальном времени с меньшими требованиями надёжности, например камеры и аудио.

На физической шине различия невелики; отличаются механизмы, планирование хостом, доступная полоса и максимальная длина пакета. Сравнение дано в таблице 1-2.

[Ссылка источника](http://www.usb.org/developers/docs/devclass_docs/)

| Тип передачи | USB 2.0 | USB 3.0 |
| --- | --- | --- |
| Управляющая | Max Packet: 64Bytes<br>Burst:Не поддерживается<br>Управление потоком только OUT(PING) | Max Packet: 512Bytes<br>Burst:1<br>Управление потоком(ERDY) |
| Прерывания | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:Не поддерживается<br>Нет управления потоком | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:1 ~ 3<br>Управление потоком(ERDY) |
| Массовая | Max Packet: 512Bytes<br>Max Transfer Speed:53.25MBps<br>Burst:Не поддерживается<br>Управление потоком только OUT(PING) | Max Packet: 1024Bytes<br>Max Transfer Speed:400MBps?<br>Burst:1 〜 16<br>Управление потоком(ERDY)) |
| Изохронная | Max Packet: 0 〜 1024 ×3 Bytes<br>Max Transfer Speed:23.44MBps<br>Burst:Не поддерживается<br>Нет управления потоком | Max Packet: 0 〜 1024 ×16 × 3Bytes<br>Max Transfer Speed:375.04MBps<br>Burst:1 ~ 16<br>Управление потоком(PING -> PING_RESPONSE) |

Таблица 1-2 показывает разные теоретические пределы для видов передачи. Их ограничения и взаимодействие классовых протоколов делают реальную скорость значительно ниже физической.

### 1.4 Основные факторы скорости

Скорость USB в основном зависит от следующих факторов:

1. Качество сигнала. Его оценивают по глазковой диаграмме USB. Плохой сигнал вызывает потери пакетов и повторные передачи, снижая скорость.

2. AHB CLK контроллера и DMA Burst Length. Более высокая частота AHB и длинные DMA-пакеты могут улучшить эффективность DMA.

3. Частота CPU влияет на выполнение кода и memcpy. Её повышение может ускорить драйвер USB и приложение, увеличивая скорость.

4. Размер буфера URB (USB Request Block) задаёт блок одной передачи контроллера. Для примеров, отнесённых источником к MSC, включая USB Disk и USB MTP, увеличение буфера уменьшает число прерываний, если не учитывать влияние размера блока на eMMC/NAND. Указаны максимумы одной передачи: DWC2 — 512KB, DWC3 — 16MB - 1 Bytes.

5. Скорость носителей. MSC-устройства, например накопители, зависят от производительности носителя хоста и самого USB-накопителя.

6. Формат файловой системы.

Распространённые форматы — VFAT, EXT4, NTFS. В стеке источника блочный слой ядра объединяет маленькие блоки VFAT/EXT4 в 120K перед записью; NTFS пишет из userspace без такого объединения. При запросах приложения по 4KB скорость NTFS может быть существенно ниже VFAT/EXT4. Анализ см. в разделе 2.1.

## 2. Производительность USB Host

### 2.1 Скорость USB-накопителя

Методика. Предполагается следующий раздел после подключения к USB Host:

```text
/dev/block/sda1
```

Точка монтирования:

```text
/mnt/media_rw/0E64-5F76/
```

Путь файла eMMC хоста: /sdcard/. Методы ниже используют эти пути.

Нужен достаточно большой test. Для 3399 EVB с 4G DDR источник рекомендует 2G и сообщает неточность при 1024MB. Объяснение: proc/sys/vm/dirty_background_ratio обычно 5%; асинхронная запись начинается при 4G × 5% = 204.8MB грязных страниц. conv=fsync у dd записывает кэш на диск.

Два метода. Метод 1: вручную либо cp скопировать большой файл, например фильм, измерить время и скорость. Шаг 1 создаёт test через dd для шага 2.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Шаг 2. Измерьте время cp.

```text
echo 3 > /proc/sys/vm/drop_caches
time cp /mnt/media_rw/0E64-5F76/test /sdcard/.
```

Так проверяется чтение. Для записи поменяйте пути. Метод 2 использует dd. Для чтения шаг 1 создаёт test для следующих копирований.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Шаг 2. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 4K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=4K count=256K
```

Шаг 3. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 64K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=64K count=16K
```

Шаг 4. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 128K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=128K count=8K
```

Шаг 5. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 512K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=512K count=2K
```

Запись USB-накопителя: шаг 1. Очистите кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 4K.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=4K count=256K
```

Шаг 2.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 64K.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Шаг 3.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 128K.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=128K count=8K
```

Шаг 4.

```text
rm of=/mnt/media_rw/0E64-5F76/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 512K.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=512K count=2K
```

Метод 1 измеряет реальное копирование, но смешивает влияние носителя хоста, ФС и USB-контроллера, не изолируя его производительность. Метод 2 исключает носитель/ФС хоста, однако ФС USB-устройства всё ещё влияет. Прямой доступ к sd* в /dev/ обходит её, но может уничтожить данные: необходима крайняя осторожность. conv=fsync записывает кэш на диск; большой файл также снижает влияние кэша. Источник рекомендует оба метода: сначала 1, при недостаточной скорости — 2 для поиска ограничения контроллера.

Результаты источника с dd: USB2.0 Host обычно 25–35MBps; USB3.0 без UAS — 60–100MBps; с UAS — до примерно 350MBps. Носители сильно различаются; чтение некоторых быстрее записи в 3–5 раз. Проверяйте несколько моделей, сравнивая те же устройства тем же способом на Ubuntu PC.

USB3 RK3399/RK3328 поддерживает UASP (USB Attached SCSI PROTOCOL), способный существенно повысить скорость. Нужны CONFIG_USB_UAS (по умолчанию включён в Kernel3.10/4.4 источника) и поддержка UAS накопителем. Использование протокола видно в журнале перечисления.

```text
[80373.513866] usb 4-1: new SuperSpeed USB device number 2 using xhci_hcd
[80373.534854] usb 4-1: New USB device found, idVendor=174c, idProduct=55aa
[80373.534871] usb 4-1: New USB device strings: Mfr=2, Product=3, SerialNumber=1
[80373.534873] usb 4-1: Product: CHIPFANCIER
[80373.534874] usb 4-1: Manufacturer: WINTOGO
[80373.534876] usb 4-1: SerialNumber: 000001485761816
[80373.537036] scsi host6: uas （说明将以UAS协议进⾏通信）
[80373.537648] scsi 6:0:0:0: Direct-Access    WINTOGO  CHIPFANCIER      0    PQ: 0 ANSI: 6
```

Пример анализа и оптимизации: чтение/запись USB3-накопителя на RK3399 EVB. Метод применим для анализа других сценариев.

Условия источника: RK3399 EVB, 2G DDR + 16G eMMC; SanDisk Type-C USB3.0 32G, NTFS. Копирование большого файла с USB3 в eMMC через cp/dd. USB: /mnt/media_rw/0E64-5F76/, eMMC: /sdcard/. При 4G DDR источник рекомендует файл 2GB для уменьшения влияния кэша; conv=fsync записывает кэш на диск, большой файл также снижает влияние. Шаг 1 создаёт test размером 1GB через dd.

```text
busybox dd if=/dev/zero of=/mnt/media_rw/0E64-5F76/test bs=64K count=16K
```

Шаг 2 проверяет копирование USB3 в eMMC. Для test 1GB источник сообщает `0m48.42s real 0m00.29s user 0m18.17s system`, то есть `1024M/48 = 21MBps`, ниже ожидаемой скорости USB3.

Шаг 3 копирует прямо из /dev/block/sda1 в /sdcard/test, обходя ФС USB-накопителя. Результат около 20MBps; источник заключает, что причина не в самой ФС 3399.

Шаг 4 отдельно проверяет USB-накопитель и eMMC через dd. Сначала чтение USB3; очищайте кэш перед каждой командой.

```text
time cp /mnt/media_rw/0E64-5F76/test /sdcard/.
time cp /dev/block/sda1 /sdcard/test
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 4K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=4K count=256K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 14.183164 seconds, 72.2MB/s`. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 64K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=64K count=16K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 12.546069 seconds, 81.6MB/s`. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 128K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=128K count=8K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 12.601817 seconds, 81.3MB/s`. Очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте чтение блоками 512K.

```text
busybox dd if=/mnt/media_rw/0E64-5F76/test of=/dev/null bs=512K count=2K
```

Результат: `1073741824 bytes (1.0GB) copied, 12.402147 seconds, 82.6MB/s`. Затем запись eMMC 3399; очищайте кэш перед каждым dd.

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 4K.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=4K count=256K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 39.525297 seconds, 25.9MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 64K.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=64K count=16K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 37.505206 seconds, 27.3MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 128K.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=128K count=8K
```

Результат источника: `1073741824 bytes (1.0GB) copied, 37.461603 seconds, 27.3MB/s`

```text
rm of=/sdcard/test
```

```text
sync
```

```text
echo 3 > /proc/sys/vm/drop_caches
```

Проверьте запись блоками 512K.

```text
busybox dd if=/dev/zero of=/sdcard/test bs=512K count=2K
```

Результат: `1073741824 bytes (1.0GB) copied, 37.086531 seconds, 27.6MB/s`. Чтение USB3 быстро и почти одинаково для разных блоков; вся запись eMMC медленна. Источник считает узким местом носитель eMMC. Здесь медленны 4K/64K/128K/512K; у многих eMMC Rockchip и USB3-накопителей, по источнику, медленны только 4K. Если проблема только в 4K, исследуйте этот размер. Шаг 5 анализирует cp и блочный слой через strace и blktrace.

Проследите cp через strace:

```text
strace cp /mnt/media_rw/0E64-5F76/test /sdcard/.
```

Источник установил, что cp на RK3399 читает/пишет по 4KB. Для анализа объединения блоков используйте blktrace. Важные параметры:

```text
max_hw_sectors_kb
```

```text
max_sectors_kb
```

max_hw_sectors_kb и max_sectors_kb управляют размером объединённого блока записи: обычно 120KB для USB и 512KB для eMMC в источнике. Пути eMMC:

```text
/sys/block/mmcblk1/queue/max_hw_sectors_kb
/sys/block/mmcblk1/queue/max_sectors_kb
```

USB Disk:

```text
/sys/block/sda/queue/max_hw_sectors_kb
/sys/block/sda/queue/max_sectors_kb
```

max_hw_sectors_kb USB-накопителя задаётся здесь:

```text
drivers/usb/storage/scsiglue.c
/*limit the total size of a transfer to 120 KB */
.max_sectors =  240, （单位为block512 bytes）
```

Параметр настраивается верхним уровнем; пример для RK3399 Type-C1:

```text
/sys/devices/platform/usb@fe900000/fe900000.dwc3/xhci-hcd.9.auto/usb4/4-1/4-1:1.0/host0/target0:0:0/0:0:0:0/max_sectors
```

Проверьте планировщик I/O:

```text
rk3399:/data# cat /sys/block/mmcblk1/queue/scheduler
```

`noop [cfq]` выбирает cfq, что предполагает объединение мелких блоков. Android содержит blktrace, но он может быть отключён. Измените mk, соберите инструмент и скопируйте adb push в /system/bin. Первую строку Android.mk BUILD_BLKTRACE:= false замените на:

```text
BUILD_BLKTRACE:= true
```

Для blktrace включите CONFIG_BLK_DEV_IO_TRACE в ядре:

```text
Kernel hacking  --->
    [*]Tracers  --->
        [*]  Support for tracing block IO actions
```

Пример захвата blktrace:

1. Создайте каталог данных.

```text
mkdir /dev/blktrace
```

2. Запустите захват blktrace.

```text
blktrace -d /dev/block/mmcxxx -o /dev/blktrace/blktrace &
```

/dev/block/mmcxxx — исследуемое устройство, например mmcblk1 на 3399.

3. Выполните команду копирования:

```text
busybox dd if=/dev/zero of=/data/test bs=4K count=256K
```

4. Остановите blktrace. После копирования завершите его поток; данные сохранятся в /dev/blktrace. Параметр -w позволяет автоматически остановиться через заданное число секунд. Разбор данных:

```text
blkparse –i /dev/blktrace/ blktrace.blktrace.0 –o /dev/blktrace/blkparse.txt
```

Статистика источника показывает объединение cfq блоков 4k в 1024 сектора, то есть 512K, перед записью eMMC (рисунок 2-1).

![Рисунок источника — PDF p14](/docs/rockchip-usb-performance/assets/cn-p014-figure-01.png)

Рисунок 2-1. Данные blktrace. Источник заключает, что объединение блоков 3399 исправно; подробнее — по ссылке анализа I/O blktrace.

Источник повторяет «step5» для анализа ФС. VFAT/EXT4 объединяют блоки в ядре; его NTFS использует FUSE, запись userspace и дополнительное копирование. При запросах 4KB и переменной частоте CPU NTFS может быть медленнее. RK3399 Android cp запрашивает только 4KB, поэтому NTFS USB3 часто медленен в этом окружении.

Факторы оптимизации: скорость USB-накопителя и носителя хоста, USB-контроллер, ФС, размер запроса приложения и частота CPU. Сначала найдите ограничение, затем оптимизируйте.

[Ссылка источника](http://bean-li.github.io/blktrace-to-report/)

### 2.2 Скорость USB Ethernet

Инструмент iperf проверяет качество полосы TCP/UDP, измеряет максимальную полосу TCP, имеет множество параметров и функций UDP, сообщает скорость, джиттер и потери. Сайт https://iperf.fr/ ; загрузка для Windows, Android, Ubuntu, macOS: https://iperf.fr/iperf-download.php . Установка Ubuntu:

[Ссылка источника](https://iperf.fr/iperf-download.php)

```text
sudo apt install iperf
```

На Android можно установить iperf.apk. Инструкции: https://iperf.fr/iperf-doc.php и http://man.linuxde.net/iperf . Обычно используют UDP для предельной полосы, джиттера и потерь. Начните с теоретической скорости, например -b 100M для канала 100Mbps. Затем повторите с измеренной полосой; джиттер и потери должны уменьшиться. Несколько повторов дают устойчивую реальную скорость.

Пример UDP: сервер Ubuntu PC; RK3399 USB2/USB3 Host соединён с UGREEN USB3 Ethernet, далее кабелем с ПК. Задайте IPv4, маску и шлюз ПК по рисунку 2-2.

[Ссылка источника](https://iperf.fr/iperf-doc.php)

![Рисунок источника — PDF p16](/docs/rockchip-usb-performance/assets/cn-p016-figure-01.png)

Рисунок 2-2. IP-настройка Ubuntu PC. Параметры снимка: способ IPv4 — вручную, адрес `192.168.1.1`, маска `255.255.255.0`, шлюз `192.168.1.1`. Это исходная тестовая конфигурация, а не универсальные настройки сети. Затем выполните:

```text
wlf@wlf-ubuntu:~$ iperf -u -s
------------------------------------------------------------
Server listening on UDP port 5001
Receiving 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
```

Клиент 3399: сначала проверьте сведения USB Ethernet.

```text
eth1      Link encap:Ethernet  HWaddr 60:38:E0:E3:20:96
          inet6 addr: fe80::6238:e0ff:fee3:2096/64 Scope: Link
          UP BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:2 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 TX bytes:168
```

Затем задайте IP:

```text
ifconfig eth1 192.168.1.2 up
```

Запустите тест полосы:

```text
iperf -u -c 192.168.1.1 -b 1000M -t 60
```

-b задаёт полосу UDP в bits/sec. Источник рекомендует -b 100M для USB2.0 и -b 1000M для USB3.0. Исходный результат UGREEN USB3.0 Ethernet:

```text
------------------------------------------------------------
Client connecting to 192.168.1.2, UDP port 5001
Sending 1470 byte datagrams
UDP buffer size:  208 KByte (default)
------------------------------------------------------------
[  3] local 192.168.1.2 port 40116 connected with 192.168.1.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-60.0 sec  5.61 GBytes   803 Mbits/sec
[  3] Sent 4096616 datagrams
```

Тем же методом CISCO USB2.0 Ethernet дал около 95Mbits/sec. Ориентиры источника в обе стороны: USB2.0 Host 95–100Mbits/sec, USB3.0 Host 750–800Mbits/sec. При недостаточной скорости проверьте ошибки ifconfig/tcpdump; при большом числе ошибок измерьте глазковую диаграмму USB.

### 2.3 Скорость USB Camera

Используйте предпросмотр Camera APK и logcat через UART для текущей частоты кадров:

```text
CameraHal: debugShowFPS(622): Camera 1312 Frames, 30.000 FPS
```

Отладка UVC: включите trace.

```text
echo 0xffff > /sys/module/uvcvideo/parameters/trace
echo 8 > /proc/sysrq-trigger
```

Отключите UVC trace:

```text
ehco 0 > /sys/module/uvcvideo/parameters/trace
```

Проверьте статистику декодирования UVC. Таблица 2-1 содержит максимальные частоты USB Camera из источника.

```text
cat /d/usb/uvcvideo/*/stats
```

|  | YUYV формат | MJPEG формат | H264 формат |
| --- | --- | --- | --- |
| USB 2.0 | 640×480 @30fps | 1280×720 @30fps | 1920×1080 @30fps |
| USB 3.0 | 640×480 @60fps | 1280×720 @60fps | 1920×1080 @60fps |

Частоты предполагают одну камеру на контроллер; для двух и более нужны измерения. Большинство камер использует изохронную передачу. Теоретическая полоса USB2.0 по источнику —

23.44MBps, для USB3.0 — 375.04MBps. Предел кадров определяется (a) возможностью камеры и (b) изохронной производительностью хост-драйвера. Проверяйте (a) на ПК. Для (b) рассмотрите повышение приоритета USB QOS, ускорение реакции прерываний, AHB CLK и DMA burst length.

## 3. Производительность USB Device

### 3.1 Скорость USB MTP

Подключите устройство к ПК в режиме MTP, вручную скопируйте большой файл, например фильм свыше 1GB, измерьте время и среднюю скорость. Держите устройство на неподвижном рабочем столе без сна. После подключения дождитесь завершения сканирования медиатеки (по logcat).

Тест источника: RK3399 BOX SDK Android N + Kernel4.4. Read — RK3399 → PC, Write — PC → RK3399. 16K/64K/1M — длины буферов MTP Tx/Rx. Частоты больших и малых ядер зафиксированы максимальными. Таблица 3-1: скорости MTP RK3399 BOX SDK.

|  | Read 16K | Write 16K | Read 64K | Write 64K | Read 1M | Write 1M |
| --- | --- | --- | --- | --- | --- | --- |
| USB 2.0 | 24.7 MBps | 22.8 MBps | 22.8 MBps | 21.5 MBps | 24.7 MBps | 25.6 MBps |
| USB 3.0 | 65.6 MBps | 109.0 MBps | 71.3 MBps | 107.5 MBps | 87.3 MBps | 110.0 MBps |

Тест источника: прототип RK3126C, Android O + Kernel4.4. Таблица 3-2: скорости MTP.

|  | Read 16K | Write 16K | Read 64K | Write 64K |
| --- | --- | --- | --- | --- |
| USB 2.0 | 14.85 MBps | 7.1 MBps | 15.15 MBps | 7.8 MBps |

Анализ и оптимизация:

MTP использует bulk. Источник оценивает USB2.0 примерно в 39MBps (10 транзакций по 512 Bytes за 125мкс), USB3.0 — в 400MBps, но реальная MTP намного медленнее. Фиксированный высокий CPU быстрее переменной частоты; медленный носитель также сильно ограничивает MTP (раздел 2.1). В Kernel4.4 время каждого vfs_read/vfs_write при MTP доступно через интерфейс:

```text
cat /sys/kernel/debug/usb_mtp/status
```

Сброс статистики:

```text
echo 0 > /sys/kernel/debug/usb_mtp/status
```

AHB CLK USB2 150MHz и максимальный DMA Burst могут повысить эффективность и скорость. DWC2 передаёт максимум 512KB, DWC3 — 16MB - 1B за раз. Большие MTP Tx/Rx уменьшают прерывания (по умолчанию источника 64KB). Рекомендуются 64KB для USB2 и 1MB для USB3. Параметры Kernel4.4:

- `/sys/module/usb_f_mtp/parameters/mtp_tx_req_len`: длина Tx, байты.
- `/sys/module/usb_f_mtp/parameters/mtp_tx_reqs`: число Tx-буферов.
- `/sys/module/usb_f_mtp/parameters/mtp_rx_req_len`: длина Rx, байты.

### 3.2 Скорость USB MSC

Пример: Linux4.4 RK3399 EVB USB3.0 MSC. Настройте Mass storage как модуль.

```text
<*>   USB Gadget Support  --->
      <M>   USB Gadget Drivers
      <M>     Mass Storage Gadget
```

Патч ядра:

```text
index f3c7f15..5418d06 100644
--- a/arch/arm64/boot/dts/rockchip/rk3399.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399.dtsi
@@ -404,7 +404,7 @@
                        compatible = "snps,dwc3";
                        reg = <0x0 0xfe800000 0x0 0x100000>;
                        interrupts = <GIC_SPI 105 IRQ_TYPE_LEVEL_HIGH 0>;
-                       dr_mode = "otg";
+                       dr_mode = "peripheral";
                        phys = <&u2phy0_otg>, <&tcphy0_usb3>;
                        phy-names = "usb2-phy", "usb3-phy";
                        phy_type = "utmi_wide";
```

Соберите ядро, затем модули Mass storage:

```text
make ARCH=arm64 modules SUBDIRS=drivers/usb/gadget
```

Полученные модули:

```text
libcomposite.ko
```

```text
usb_f_mass_storage.ko
```

```text
g_mass_storage.ko
```

После загрузки создайте lun0.img в data через dd, затем загрузите модули.

```text
insmod libcomposite.ko
insmod usb_f_mass_storage.ko
insmod g_mass_storage.ko  file=/data/lun0.img removable=1
```

Подключите Ubuntu PC, отформатируйте lun0 и обращайтесь к Mass storage с ПК. Цикл проверки чтения:

```text
while true;
do time dd iflag=direct,nonblock if=/media/wlf/4625f014-95f3-419c-96c9-a38f91186eb2/test0 of=/dev/null bs=1024k count=400;
done
```

Также можно измерить скорость анализатором USB3.0 Agilent (рисунок 3-1).

![Рисунок источника — PDF p22](/docs/rockchip-usb-performance/assets/cn-p022-figure-01.png)

Рисунок 3-1. Измерение Agilent USB3. Результаты источника: переменная частота RK3399 — чтение 250MBps; малые ядра выключены, большие фиксированы на 1.8 — 300MBps.

```text
3399 关闭⼩核
echo 0 > /sys/devices/system/cpu/cpu0/online
echo 0 > /sys/devices/system/cpu/cpu1/online
echo 0 > /sys/devices/system/cpu/cpu2/online
echo 0 > /sys/devices/system/cpu/cpu3/online

3399 定频⼤核
echo userspace > /sys/devices/system/cpu/cpu4/cpufreq/scaling_governor
echo 1800000 >  /sys/devices/system/cpu/cpu4/cpufreq/scaling_setspeed
```

Источник заключает, что частота CPU заметно влияет на USB MSC: выше частота — выше чтение.

### 3.3 Скорость USB Gadget Webcam

Инструменты: AMCAP для Windows, guvcview для Ubuntu (sudo apt install guvcview). Оба отображают частоту кадров в реальном времени.

Gadget Webcam требует драйвера UVC gadget в ядре и обработки UVC приложением. В поколении SDK источника Kernel3.10/4.4 поддерживают gadget, но приложение UVC gadget есть только у RV1108; другие платформы могут адаптировать RV1108 либо связанное GitHub-приложение usb gadget uvc driver test application. Kernel3.10 поддерживает Isochronous и Bulk, по умолчанию 1KB за микрокадр 125мкс. Четыре конфигурации дают разные пределы полосы/кадров.

Конфигурация 1 (по умолчанию): изохронно 1KB за 125мкс, максимум 8000KB, то есть 7.8MB в обозначении источника. Таблица 3-3: максимальные кадры RV1108, конфигурация 1.

[Ссылка источника](https://github.com/lintwins/uvc-gadget)

|  | YUYV формат | MJPG формат | H264 формат |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @12fps | 1920×1080 @30fps | 1920×1080 @30fps |

Конфигурация UVC Gadget 2: изохронно 2KB за микрокадр 125мкс. Нужен следующий патч. Повышение полосы может вызвать мерцание; рассмотрите повышение USB QOS, AHB CLK (aclk_peri и hclk_peri) выше 150MHz и другие способы улучшения DMA.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index 382536d..17eac12 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -37,7 +37,7 @@ static unsigned int streaming_interval = 1;
 module_param(streaming_interval, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_interval, "1 - 16");

-static unsigned int streaming_maxpacket = 1024;
+static unsigned int streaming_maxpacket = 2048;
```

Максимальная полоса: 16000KB, то есть 15.62MB по источнику. Таблица 3-4: максимальные кадры RV1108, конфигурация 2.

|  | YUYV формат | MJPG формат | H264 формат |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @24fps | 1920×1080 @30fps | 1920×1080 @30fps |

Конфигурация UVC Gadget 3:

изохронно 3KB за микрокадр 125мкс. Нужен следующий патч. Повышение полосы может вызвать мерцание; рассмотрите повышение USB QOS, AHB CLK (aclk_peri и hclk_peri) выше 150MHz и другие способы улучшения DMA.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index 382536d..17eac12 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -37,7 +37,7 @@ static unsigned int streaming_interval = 1;
 module_param(streaming_interval, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_interval, "1 - 16");

-static unsigned int streaming_maxpacket = 1024;
+static unsigned int streaming_maxpacket = 3072;
```

Максимальная полоса: 24000KB, то есть 23.43MB по источнику. Таблица 3-5: максимальные кадры RV1108, конфигурация 3.

|  | UYV формат | MJPG формат | H264 формат |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 @30fps | 1920×1080 @30fps | 1920×1080 @30fps |

Конфигурация UVC Gadget 4: Bulk. Примените следующий патч. Этот режим не поддерживает переключение разрешения; источник не рекомендует его при необходимости нескольких разрешений.

```text
diff --git a/drivers/usb/gadget/f_uvc.c b/drivers/usb/gadget/f_uvc.c
index d146ce7..9eb7aad 100644
--- a/drivers/usb/gadget/f_uvc.c
+++ b/drivers/usb/gadget/f_uvc.c
@@ -45,7 +45,7 @@ static unsigned int streaming_maxburst;
 module_param(streaming_maxburst, uint, S_IRUGO|S_IWUSR);
 MODULE_PARM_DESC(streaming_maxburst, "0 - 15 (ss only)");

-static bool bulk_streaming_ep;
+static bool bulk_streaming_ep = true;
 module_param(bulk_streaming_ep, bool, S_IRUGO | S_IWUSR);
```

Максимальная полоса: 35MB по источнику. Таблица 3-6: максимальные кадры RV1108, конфигурация 4.

|  | UYV формат | MJPG формат | H264 формат |
| --- | --- | --- | --- |
| USB 2.0 | 648×480 > 30fps | 1920×1080 > 30fps | 1920×1080 > 30fps |

### 3.4 Скорость USB Rndis

Rndis — TCP/IP over USB: TCP/IP на устройстве представляет его сетевым адаптером. Проверка iperf (раздел 2.2). Конфигурация Linux3.10 Android Gadget USB Rndis:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (Android Composite Gadget)  --->
                 Android Composite Gadget
```

Узлы /sys/class/android_usb/android0/f_rndis настраивают адаптер. Конфигурация Linux3.10 Ethernet Gadget USB Rndis:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (Ethernet Gadget (with CDC Ethernet support)) --->
                 Ethernet Gadget (with CDC Ethernet support)
```

Конфигурация Linux4.4 Configfs USB Rndis:

```text
Device Drivers  --->
   [*] USB support  --->
       <*>   USB Gadget Support  --->
           <*>   USB Gadget Drivers (USB functions configurable through configfs) --->
                  [*]       RNDIS
```

Пример журнала перечисления Linux3.10 Android Gadget USB Rndis:

```text
shell@android:/ # setprop sys.usb.config rndis
[ 2445.809337] rndis_function_bind_config MAC: 36:C8:78:69:C5:D3
[ 2445.809532] android_usb gadget: using random self ethernet address
[ 2445.809666] android_usb gadget: using random host ethernet address
[ 2445.812255] rndis0: MAC 0a:d4:f2:e3:c5:c7
[ 2445.812330] rndis0: HOST MAC ea:88:5c:93:9d:b5   如连接window，则对应windows以太网卡MAC
[ 2446.208233] DWC_OTG: ********soft connect!!!*****************************************
[ 2446.541253] android_usb gadget: high speed config #1: android
[ 2446.542681] android_work: sent uevent USB_STATE=CONFIGURED
```

Задайте IP и запустите rndis:

```text
ifconfig rndis0 192.168.1.2 up
```

Источник требует одной подсети для 192.168.1.2 и ПК, описывая её как 192.168.XX.XX; реальные маски также нужно согласовать. Настройка/тест — раздел 2.2. Совет источника отключить Windows Firewall при проблеме ping сохраняется как исторический совет для изолированного теста, не общая рекомендация безопасности.

Исходные High-speed результаты (Super-Speed не проверен): Linux3.10 Android Gadget — вверх 20Mbps/вниз 40Mbps; Linux3.10 Ethernet Gadget — 100Mbps в обе стороны; Linux4.4 Configfs — 100Mbps в обе стороны. Низкая скорость Android Gadget Kernel3.10 признана проблемой, требующей оптимизации.

### 3.5 Скорость USB Gadget HID

Инструменты: Windows HidTest.exe, PortHelper1.7.exe либо HID API; Ubuntu hid_gadget_test из Linux3.10 Documentation/usb/gadget_hid.txt либо HID API. Тест источника RK3188 Gadget HID, случай 1: report_length 512 bytes, интервал 1ms, файл 10768KB, high-speed. PC → 3188: 249KBps, 3188 → PC: 125KBps.

[Ссылка источника](http://www.signal11.us/oss/hidapi/)

Случай 2: report_length 512 bytes, интервал 125us, файл 10768KB, high-speed. PC → 3188: 872KBps; 3188 → PC: 2659KBps. Скорость главным образом зависит от report_length и интервала interrupt. Драйвер drivers/usb/gadget/hid.c источника не содержит HID-дескриптора; его разрабатывают по Documentation/usb/gadget_hid.txt. Пример для report_length 512bytes:

```text
index 79afa82..a05ad79 100644
--- a/drivers/usb/gadget/hid.c
+++ b/drivers/usb/gadget/hid.c
@@ -271,10 +272,93 @@ MODULE_DESCRIPTION(DRIVER_DESC);
 MODULE_AUTHOR("Fabien Chouteau, Peter Korsgaard");
 MODULE_LICENSE("GPL");

+static struct hidg_func_descriptor rk_hidg_desc = {
+   .subclass       = 0, /* No subclass */
+   .protocol       = 2, /* Keyboard */
+   .report_length      = 512,
+   .report_desc_length = 38,
+   .report_desc        = {
+       0x06, 0x00, 0xFF,    /*USAGE_PAGE (Vendor Defined Page 1)*/
+       0x09, 0x01,     /*USAGE (Vendor Usage 1)*/
+       0xA1, 0x01,         /*COLLECTION (Application)*/
+       0x09, 0x02,     /*  USAGE (Vendor Usage 2)*/
+       0x09, 0x03,     /*USAGE (Vendor Usage 3)*/
+       0x15, 0x00,         /*LOGICAL_MINIMUM (0)*/
+       0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)*/
+       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x96, 0x00, 0x01, /* REPORT_COUNT (256) */
+       0x81, 0x02,         /*INPUT (Data,Var,Abs)  */
+       0x09, 0x04,     /*USAGE (Vendor Usage 4)*/
+       0x15, 0x00,         /*LOGICAL_MINIMUM (0)   */
+       0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)   */
+       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x96, 0x00, 0x01,   /*REPORT_COUNT (256)*/
+       0x91, 0x02,         /*OUTPUT (Data,Var,Abs) */
+       0xC0            /*END_COLLECTION*/
+   }
+};
```

Для report_length 1024bytes измените следующим образом:

```text
@@ -275,7 +275,7 @@ MODULE_LICENSE("GPL");
 static struct hidg_func_descriptor rk_hidg_desc = {
    .subclass       = 0, /* No subclass */
    .protocol       = 2, /* Keyboard */
-   .report_length      = 512,
+   .report_length      = 1024,
    .report_desc_length = 38,
    .report_desc        = {
        0x06, 0x00, 0xFF,    /*USAGE_PAGE (Vendor Defined Page 1)*/
@@ -285,13 +285,13 @@ static struct hidg_func_descriptor rk_hidg_desc = {
        0x09, 0x03,     /*USAGE (Vendor Usage 3)*/
        0x15, 0x00,         /*LOGICAL_MINIMUM (0)*/
        0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)*/
-       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x75, 0x20,         /*REPORT_SIZE (32)*/
        0x96, 0x00, 0x01, /* REPORT_COUNT (256) */
        0x81, 0x02,         /*INPUT (Data,Var,Abs)  */
        0x09, 0x04,     /*USAGE (Vendor Usage 4)*/
        0x15, 0x00,         /*LOGICAL_MINIMUM (0)   */
        0x26, 0xFF, 0x00, /*LOGICAL_MAXIMUM (255)   */
-       0x75, 0x10,         /*REPORT_SIZE (16)*/
+       0x75, 0x20,         /*REPORT_SIZE (32)*/
        0x96, 0x00, 0x01,   /*REPORT_COUNT (256)*/
        0x91, 0x02,         /*OUTPUT (Data,Var,Abs) */
        0xC0            /*END_COLLECTION*/
```

Интервал HID изменяется через bInterval структур hidg_hs_in_ep_desc и hidg_hs_out_ep_desc в drivers/usb/gadget/f_hid.c. Исходное значение 4 (1ms), минимум 1 (125us).

{% endraw %}
