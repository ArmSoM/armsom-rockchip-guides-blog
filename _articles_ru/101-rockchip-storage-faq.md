---
title: "Полный FAQ накопителей Rockchip: запись, UBIFS, EMMC, NAND, SPI NOR и быстрый старт"
description: "Полный FAQ накопителей Rockchip: запись, UBIFS, EMMC, NAND, SPI NOR и быстрый старт — RK-PC-YF-133 V2.2.0; MTD, FTL, CONT_READ, AUTO_MERGE."
translation_key: "101-rockchip-storage-faq"
slug: "101-rockchip-storage-faq"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "Storage", "UBIFS", "EMMC", "SPI NAND", "SPI NOR"]
excerpt: "Полный FAQ накопителей Rockchip: запись, UBIFS, EMMC, NAND, SPI NOR и быстрый старт — RK-PC-YF-133 V2.2.0; MTD, FTL, CONT_READ, AUTO_MERGE."
---

{% raw %}

# Полный FAQ накопителей Rockchip: запись, UBIFS, EMMC, NAND, SPI NOR и быстрый старт

Статья полностью сохраняет технический текст китайского RK-PC-YF-133 / V2.2.0, стр. 6–55: десять глав, все вопросы и ответы, журналы, команды, параметры, таблицы, патчи и рисунки. Английского оригинала нет; английская, русская и немецкая версии полностью переведены с китайского. Все четыре используют китайские оригинальные рисунки с локализованными подписями, не выданные за английские. Источник указывает «все продукты» без версии ядра, а примеры относятся к разным SoC, SDK и веткам ядра; это не подтверждает поддержку всех плат ArmSoM. Проверьте SoC, flash/EMMC и питание/I/O, SDK/BSP, Loader, U-Boot, ядро, подсистему MTD/rkflash/rknand и разметку. Испытания, скорости и ресурс производителя/заказчиков — примеры оригинала; аппаратная проверка ArmSoM не проводилась.

> Безопасность: примеры включают полное стирание, ubiformat, прошивку, переразметку, замыкание выводов и ускорение интерфейса. Возможны необратимая потеря данных/идентичности, отказ загрузки и аппаратный риск. Не выполнять на производственных устройствах; сначала резервная копия и проверка схемы/BSP. Страница не запускает команды. Неоднозначности, включая «ubifs без проверки целостности» в §2.13 TEST02, два поля TYPE_B EXT CSD, fopen с флагами open в §4.5 и противоречия заголовков/путей, сохранены с пояснениями.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel) · [EDITORIAL-NOTES](/docs/rockchip-storage-faq/EDITORIAL-NOTES.md)

<!-- Chinese PDF p.6 -->

## 1. Проблемы записи прошивки

<!-- Chinese PDF p.6 -->

### 1.1 Роль Loader при записи

<!-- Chinese PDF p.6 -->

![1.1 Роль Loader при записи: китайский оригинал, стр. 6](/docs/rockchip-storage-faq/assets/cn-p006-figure-01.png)

*1.1 Роль Loader при записи: китайский оригинал, стр. 6*

<!-- Chinese PDF p.6 -->

### 1.2 Ошибки инструмента записи flash

<!-- Chinese PDF p.6 -->

Интерфейс инструмента:

<!-- Chinese PDF p.6 -->

![1.2 Ошибки инструмента записи flash: китайский оригинал, стр. 6](/docs/rockchip-storage-faq/assets/cn-p006-figure-02.png)

*1.2 Ошибки инструмента записи flash: китайский оригинал, стр. 6*

<!-- Chinese PDF p.6 -->

Журнал инструмента:

<!-- Chinese PDF p.6 -->

```text
18:05:40 125    Layer<1-1-2-3-1>:下载Boot成功
18:05:40 127    Layer<1-1-2-3-1>:等待Maskrom开始
18:05:40 552    Layer<1-1-2-3-1>:等待Maskrom成功
18:05:40 557    Layer<1-1-2-3-1>:测试设备开始
18:05:40 572    Layer<1-1-2-3-1>:测试设备成功
18:05:40 583    Layer<1-1-2-3-1>:校验芯⽚开始
18:05:40 592    Layer<1-1-2-3-1>:校验芯⽚成功
18:05:40 600    Layer<1-1-2-3-1>:获取FlashInfo开始
18:05:40 606    <LAYER 1-12-3-1> INFO:FlashInfo: 00 00 00 00 00 04 04 00 28 00 00
18:05:40 615    <LAYER 1-12-3-1> INFO:GetFlashInfo-->Emmc storage.
18:05:40 626    Layer<1-1-2-3-1>:获取FlashInfo成功
18:05:40 640    Layer<1-1-2-3-1>:准备IDB开始
18:05:40 645    <LAYER 1-12-3-1> ERROR:PrepareIDB-->No Found 1st Flash CS
18:05:40 663    Error:Layer<1-1-2-3-1>:准备IDB失败
18:05:40 686    Layer<1-12-3-1>: RunProc is ending, ret=0
```

<!-- Chinese PDF p.7 -->

Вывод UART устройства:

<!-- Chinese PDF p.7 -->

```text
ddr.bin log:     DDR Version V1.30 20191125
ddr.bin log:     REG2C: 0x00000031, 0x00000031
ddr.bin log:     In
ddr.bin log:     451MHz
ddr.bin log:     DDR2
ddr.bin log:     Col=10 Bank=2 Row=13 Size=64MB
ddr.bin log:     msch:0
ddr.bin log:     OUT
usbplug log:     Boot1 Release Time: Dec  7 2020 11:25:17, version: 1.25
usbplug log:     chip_id:000000,0
usbplug log:     DPLL = 1300 MHz
usbplug log:     ...nandc_flash_init enter...
usbplug log:     No.1 FLASH ID:ff ff ff ff ff ff                          /* flash id 全 FF，未探测到 SLC Nand */
usbplug log:     DPLL = 1300 MHz
usbplug log:     sfc nor id: ff ff ff                                     /* flash id 全 FF，未探测到 SPI Nor */
usbplug log:     DPLL = 1300 MHz
usbplug log:     sfc_nand id: ff ff ff                                    /* flash id 全 FF，未探测到 SPI Nand */
usbplug log:     UsbBoot ...11943
usbplug log:     powerOn 664713
```

<!-- Chinese PDF p.7 -->

Анализ:

<!-- Chinese PDF p.7 -->

**1.** При аномалиях журнала ddr.bin обратитесь к инженеру DDR.

<!-- Chinese PDF p.7 -->

**2.** Для параллельной SLC NAND, SPI NAND или SPI NOR идентификатор flash из одних FF при обновлении обычно указывает на неисправность питания VCC, уровня I/O или пайки.

<!-- Chinese PDF p.7 -->

**3.** Если ID flash верен, но выводится “The device not support yet!”, а RK SpiNor and SLC Nand SupportList подтверждает поддержку платформы, прошивка устарела и не содержит поддержки компонента. Сначала обновите драйвер: Redmine → проект FAE → Документы → список поддержки Nand flash → ссылка на патчи памяти.

<!-- Chinese PDF p.7 -->

**4.** Если после обновления загрузка всё ещё не работает, обратитесь к инженерам памяти RK.

<!-- Chinese PDF p.7 -->

### 1.3 Образ SLC NAND не загружается

<!-- Chinese PDF p.8 -->

#### 1.3.1 Включена функция pin38

<!-- Chinese PDF p.8 -->

Типовой журнал записи:

<!-- Chinese PDF p.8 -->

```text
prog read s error: = 7fc00 1fff0e0 ffffffff
prog read d error: = 7fc00 0 ffffffff
phyBlk = 0x1ff die = 0 block_in_die = 0x1ff 0x80000000
prog read s error: = 7f800 1fef0e0 ffffffff
prog read d error: = 7f800 0 ffffffff
phyBlk = 0x1fe die = 0 block_in_die = 0x1fe 0xc0000000
prog read s error: = 7f400 1fdf0e0 ffffffff
prog read d error: = 7f400 0 ffffffff
```

<!-- Chinese PDF p.8 -->

Проверьте функцию pin38 flash и уровень, отключающий её:

- Lock#: обычно активен низким уровнем, внутри слабая подтяжка вверх. Оставьте неподключённым или добавьте внешнюю подтяжку вверх согласно документации.
- PT: обычно активен высоким уровнем, внутри слабая подтяжка вниз. Оставьте неподключённым или добавьте внешнюю подтяжку вниз согласно документации.
- NC: функции нет; оставить неподключённым.

<!-- Chinese PDF p.8 -->

### 1.4 Загрузка SPI NAND останавливается в SPL

<!-- Chinese PDF p.8 -->

Следующий журнал означает, что SDK не содержит программной поддержки данного SPI NAND. Получите соответствующий патч: Redmine → проект FAE → Документы → список поддержки Nand flash.

<!-- Chinese PDF p.8 -->

```text
DDR Version V1.04 20201030
DDR, 328MHz
BW=32 Col=10 Bk=8 CS0 Row=15 CS=1 Die BW=16 Size=1024MB
change to 328MHz
change to 528MHz
change to 784MHz
change to 924MHz(final freq)
out
U-Boot SPL board init
U-Boot SPL 2017.09.g2d25c32e07-201118 #huke (Feb 26 2021 - 13:51:03)
unknown raw ID phN    # 该 log 说明 spl 驱动未⽀持该颗粒，需重新编译 spl，且核对并更新 uboot, kernel 对
应补丁
unrecognized JEDEC id bytes: ff, 98, ed
Tring to boot from MMC1
Card did not respond to voltage select!
mmc_init: -95, time 9
spl: mmc init failed with error: -95
SPL: failed to boot from all boot devices
### ERROR ### Please RESET the board ###
# Reset the board to bootrom #
```

<!-- Chinese PDF p.8 -->

### 1.5 Вход в maskrom

<!-- Chinese PDF p.8 -->

**1.** При наличии кнопки maskrom: удерживайте reset, нажмите maskrom, отпустите reset (инструмент покажет maskrom), затем отпустите maskrom. Последовательность важна для предотвращения сбоев.

<!-- Chinese PDF p.8 -->

**2.** Без кнопки maskrom: источник предлагает заменить её замыканием линии данных flash io0 на землю. Это процедура оригинала, а не универсальная инструкция подключения; перед аппаратными действиями проверьте схему платы.

<!-- Chinese PDF p.9 -->

### 1.6 Отдельная сборка и проверка SPL

<!-- Chinese PDF p.9 -->

Измените способ сборки. SDK использует готовую SPL из rkbin/bin/xx/. Поэтому Loader, созданный командой ./build.sh u-boot, не обязательно включает только что собранную SPL. Для собственной SPL используйте команды:

<!-- Chinese PDF p.9 -->

```text
cd uboot
./make.sh rv1126
./make.sh spl-s
```

<!-- Chinese PDF p.9 -->

Результаты в uboot: rv1126_spl_loader_vxxx.xxx.bin и uboot.img. Используйте эти loader.bin и uboot.img.

Проверьте обновление по журналу SPL, например: “U-Boot SPL 2017.09-gf899931b5f-201209 #ldq (Dec 10 2020 - 15:34:13)”. Убедитесь, что указана самостоятельно собранная версия.

Для замены SPL SDK используйте собранный uboot/spl/u-boot-spl.bin вместо ./rkbin/bin/xx/xxxx_spl_xxxx.bin.

<!-- Chinese PDF p.9 -->

### 1.7 Получение образов flash и отладочных данных

<!-- Chinese PDF p.9 -->

#### 1.7.1 Export Image

<!-- Chinese PDF p.9 -->

Android tool: экспорт прошивки в режиме maskrom:

<!-- Chinese PDF p.9 -->

![1.7.1 Export Image: китайский оригинал, стр. 9](/docs/rockchip-storage-faq/assets/cn-p009-figure-01.png)

*1.7.1 Export Image: китайский оригинал, стр. 9*

<!-- Chinese PDF p.9 -->

Экспорт в Loader: скачивать Loader не нужно; укажите адрес непосредственно в инструменте.

Linux upgrade tool и Android_Console_Tool: экспорт в maskrom:

<!-- Chinese PDF p.10 -->

```text
db MiniloadAll.bin
rl 0x0 0x10000 Exportimage.bin
```

<!-- Chinese PDF p.10 -->

Экспорт в режиме Loader:

<!-- Chinese PDF p.10 -->

```text
rl 0x0 0x10000 Exportimage.bin
```

<!-- Chinese PDF p.10 -->

Примечание: адреса секторов заданы в единицах 512B per sector.

Toolskit:

<!-- Chinese PDF p.10 -->

![1.7.1 Export Image: китайский оригинал, стр. 10](/docs/rockchip-storage-faq/assets/cn-p010-figure-01.png)

*1.7.1 Export Image: китайский оригинал, стр. 10*

<!-- Chinese PDF p.10 -->

#### 1.7.2 Dump All

<!-- Chinese PDF p.10 -->

Специальный Loader с суффиксом dump_all.bin экспортирует сведения flash, специфичные для RK FTL.

<!-- Chinese PDF p.11 -->

![1.7.2 Dump All: китайский оригинал, стр. 11](/docs/rockchip-storage-faq/assets/cn-p011-figure-01.png)

*1.7.2 Dump All: китайский оригинал, стр. 11*

<!-- Chinese PDF p.11 -->

#### 1.7.3 Flash Stress Test

<!-- Chinese PDF p.11 -->

Специальный Loader с суффиксом stress_test.bin выполняет простой стресс-тест чтения, записи и стирания flash.

<!-- Chinese PDF p.11 -->

![1.7.3 Flash Stress Test: китайский оригинал, стр. 11](/docs/rockchip-storage-faq/assets/cn-p011-figure-02.png)

*1.7.3 Flash Stress Test: китайский оригинал, стр. 11*

<!-- Chinese PDF p.11 -->

#### 1.7.4 Flash Erase All

<!-- Chinese PDF p.11 -->

Специальный Loader с суффиксом erase_all.bin полностью стирает данные flash.

<!-- Chinese PDF p.12 -->

![1.7.4 Flash Erase All: китайский оригинал, стр. 12](/docs/rockchip-storage-faq/assets/cn-p012-figure-01.png)

*1.7.4 Flash Erase All: китайский оригинал, стр. 12*

<!-- Chinese PDF p.12 -->

## 2. Проблемы файловых систем

<!-- Chinese PDF p.12 -->

### 2.1 Раздел UBIFS не стёрт полностью перед обновлением

<!-- Chinese PDF p.12 -->

Перед обновлением образа с UBIFS сотрите весь целевой раздел либо, предпочтительно, используйте ubiupdatevol. Типичные ошибки:

<!-- Chinese PDF p.12 -->

```text
...
[    4.452318] ubi0: attaching mtd5
[    4.685258] ubi0 error: ubi_attach: bad image sequence number 1251817256 in PEB 543, expected
1051610977
[    4.685317] Erase counter header dump:
[    4.685334]  magic          0x55424923
[    4.685348]  version        1
[    4.685361]  ec             1
[    4.685374]  vid_hdr_offset 2048
[    4.685386]  data_offset    4096
[    4.685400]  image_seq      1251817256
[    4.685413]  hdr_crc        0x88225c8a
[    4.685426] erase counter header hexdump:
[    4.685753] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd5, error -22
[    4.685814] UBI error: cannot attach mtd5
...
[    4.695772] ALSA device list:
[    4.695796]   #7: Loopback 1
[    4.696063] VFS: Cannot open root device "ubi0:rootfs" or unknown-block(0,0): error -19
[    4.696091] Please append a correct "root=" boot option; here are the available partitions:
...
```

<!-- Chinese PDF p.12 -->

Рекомендуемые версии инструментов:

<!-- Chinese PDF p.13 -->

Windows rkdevtool v2.79 и выше; Linux_Upgrade_Tool_v1.59 и выше.

<!-- Chinese PDF p.13 -->

### 2.2 Образ UBIFS не соответствует геометрии flash

<!-- Chinese PDF p.13 -->

Убедитесь, что параметры mkfs, связанные с flash, например -e и -m, соответствуют устройству. Иначе после загрузки система не найдёт сведения UBI. Типичные ошибки — случай 1:

<!-- Chinese PDF p.13 -->

```text
...
[    1.319729] ubi0: attaching mtd3
[    1.549286] ubi0: scanning is finished
[    1.549326] ubi0 error: ubi_read_volume_table: the layout volume was not found
[    1.549464] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd3, error -22
[    1.549499] UBI error: cannot attach mtd3
...
[    1.563848]   #7: Loopback 1
[    1.564173] UBIFS error (pid: 1): cannot open "ubi0:rootfs", error -19VFS: Cannot open root device
"ubi0:rootfs" or unknown-block(0,0): error -19
...
```

<!-- Chinese PDF p.13 -->

Случай 2: фактическая страница 4KB, страница образа 2KB.

<!-- Chinese PDF p.13 -->

```text
[    0.517603] ubi0 error: validate_ec_hdr: bad VID header offset 2048, expected 4096
[    0.517618] ubi0 error: validate_ec_hdr: bad EC header
[    0.517626] Erase counter header dump:
[    0.517634]  magic          0x55424923
[    0.517639]  version        1
[    0.517645]  ec             0
[    0.517650]  vid_hdr_offset 2048
[    0.517657]  data_offset    4096
[    0.517664]  image_seq      2053699779
[    0.517672]  hdr_crc        0x2416c7f2
[    0.517679] erase counter header hexdump:
[    0.517701] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.111 #2
```

<!-- Chinese PDF p.13 -->

Случай 3: фактическая страница 2KB, страница образа 4KB.

<!-- Chinese PDF p.13 -->

```text
[    1.678775] ubi0: attaching mtd6
[    1.679040] ubi0 error: validate_ec_hdr: bad VID header offset 4096, expected 2048
[    1.679054] ubi0 error: validate_ec_hdr: bad EC header
[    1.679068] Erase counter header dump:
[    1.679079]  magic          0x55424923
[    1.679090]  version        1
[    1.679101]  ec             0
[    1.679110]  vid_hdr_offset 4096
[    1.679120]  data_offset    8192
[    1.679131]  image_seq      362848614
[    1.679141]  hdr_crc        0x9438b345
[    1.679157] erase counter header hexdump:
[    1.679195] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.19.172 #8
[    1.679207] Hardware name: Rockchip RK3566 For 360 X200 (DT)
[    1.679220] Call trace:
[    1.679238]  dump_backtrace+0x0/0x178
```

<!-- Chinese PDF p.14 -->

### 2.3 Образ UBIFS больше раздела

<!-- Chinese PDF p.14 -->

Уменьшите образ либо увеличьте раздел. Типичные ошибки:

<!-- Chinese PDF p.14 -->

```text
[    2.121208] ubi0 error: vtbl_check: too large reserved_pebs 824, good PEBs 767
[    2.121295] ubi0 error: vtbl_check: volume table check failed: record 0, error 9
[    2.121338] Volume table record 0 dump:
[    2.121375]  reserved_pebs   824
[    2.121412]  alignment       1
[    2.121449]  data_pad        0
[    2.121529]  vol_type        1
[    2.121568]  upd_marker      0
[    2.121605]  name_len        6
[    2.121642]  name            rootfs
[    2.121680]  crc             0x9ab0c6a3
[    2.122162] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd3, error -22
[    2.122278] UBI error: cannot attach mtd3
```

<!-- Chinese PDF p.14 -->

### 2.4 Повреждён конец прошивки UBIFS

<!-- Chinese PDF p.14 -->

Проблема требует дальнейшего анализа. Типичные ошибки:

<!-- Chinese PDF p.14 -->

```text
[    1.867789] ALSA device list:
[    1.867830]   #7: Loopback 1
[    1.916907] UBIFS (ubi0:0): UBIFS: mounted UBI device 0, volume 0, name "rootfs", R/O mode
[    1.917010] UBIFS (ubi0:0): LEB size: 126976 bytes (124 KiB), min./max. I/O unit sizes: 2048 bytes/2048
bytes
[    1.917061] UBIFS (ubi0:0): FS size: 103231488 bytes (98 MiB, 813 LEBs), journal size 9023488 bytes (8
MiB, 72 LEBs)
[    1.917106] UBIFS (ubi0:0): reserved for root: 0 bytes (0 KiB)
[    1.917155] UBIFS (ubi0:0): media format: w4/r0 (latest is w5/r0), UUID 1C1DDBB4-77E6-4AA9-855F-
ED8F10EB5916, small LPT model
```

<!-- Chinese PDF p.14 -->

### 2.5 Слишком большой резерв журнала UBIFS

<!-- Chinese PDF p.14 -->

UBIFS — журналируемая файловая система. Слишком большой журнал в малом разделе может помешать монтированию. Рассмотрите изменение параметра:

<!-- Chinese PDF p.14 -->

```text
-j, --jrn-size=SIZE       journal size
```

<!-- Chinese PDF p.14 -->

Типичные сообщения об ошибках:

<!-- Chinese PDF p.14 -->

```text
[root@RV1126_RV1109:/]# mount -t ubifs /dev/ubi2_0 /record/
[   65.788339] UBIFS error (ubi2:0 pid 890): ubifs_read_superblock: mount: mounting /dev/ubi2_0 on
/record/ failed: Invalid argument
too large journal size (8388608 bytes), only 3555328 bytes available in the main area
[   65.78[root@RV1126_RV1109:/]# 8394] UBIFS error (ubi2:0 pid 890): ubifs_read_superblock: bad
superblock, error 1
[   65.788413]  magic          0x6101831
[   65.788434]  crc            0x663d9574
[   65.788455]  node_type      6 (superblock node)
[   65.788475]  group_type     0 (no node group)
[   65.788493]  sqnum          1
[   65.788512]  len            4096
[   65.788531]  key_hash       0 (R5)
[   65.788620]  key_fmt        0 (simple)
[   65.788639]  flags          0x4
[   65.788660]  big_lpt        0
[   65.788684]  space_fixup    1
[   65.788706]  min_io_size    2048
[   65.788728]  leb_size       126976
[   65.788755]  leb_cnt        39
[   65.788773]  max_leb_cnt    2048
[   65.788786]  max_bud_bytes  8388608
[   65.788799]  log_lebs       5
[   65.788812]  lpt_lebs       2
[   65.788826]  orph_lebs      1
[   65.788838]  jhead_cnt      1
[   65.788851]  fanout         8
[   65.788864]  lsave_cnt      256
[   65.788877]  default_compr  1
[   65.788890]  rp_size        0
[   65.788905]  rp_uid         0
[   65.788918]  rp_gid         0
[   65.788931]  fmt_version    4
[   65.788945]  time_gran      1000000000
[   65.788961]  UUID           DBC08BA0-15FE-49BD-BC47-8A9200F1D625
```

<!-- Chinese PDF p.15 -->

### 2.6 SquashFS на UBI block без поддержки ZLIB

<!-- Chinese PDF p.15 -->

Включите CONFIG_SQUASHFS_ZLIB. Типичные ошибки:

<!-- Chinese PDF p.15 -->

```text
[    4.564088] rockchip-mipi-dphy-rx: No link between dphy and sensor
[    4.564102] rkisp0: update sensor failed
[    4.564181] ALSA device list:
[    4.564191]   #0: rockchip,rk809-codec
[    4.564200]   #7: Loopback 1
[    4.566057] squashfs: SQUASHFS error: Filesystem uses "zlib" compression. This is not supported
[    4.566158] List of all partitions:
[    4.566179] fd00           31792 ubiblock0_0
[    4.566181]  (driver?)
[    4.566196] No filesystem could mount root, tried:
[    4.566197]  squashfs
[    4.566206]
[    4.566225] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(253,0)
[    4.570008] CPU: 3 PID: 1 Comm: swapper/0 Not tainted 4.19.149 #3
[    4.570547] Hardware name: Generic DT based system
[    4.570993] [<b010f47c>] (unwind_backtrace) from [<b010b9a8>] (show_stack+0x10/0x14)
[    4.571677] [<b010b9a8>] (show_stack) from [<b0827b68>] (dump_stack+0x90/0xa4)
[    4.572317] [<b0827b68>] (dump_stack) from [<b01264fc>] (panic+0x114/0x2a0)
[    4.572962] [<b01264fc>] (panic) from [<b0c013a8>] (mount_block_root+0x2a4/0x2f4)
[    4.573629] [<b0c013a8>] (mount_block_root) from [<b0c015d0>] (prepare_namespace+0x150/0x1
```

<!-- Chinese PDF p.16 -->

### 2.7 Образ UBIFS не монтируется на слишком малом пустом разделе

<!-- Chinese PDF p.16 -->

Минимальный раздел UBIFS:

<!-- Chinese PDF p.16 -->

```text
Minimum block num = 4（固定预留） + B + 17  /* B - 为坏块替换预留的 f1ash blocks,与 ubiattach - b 参数相
关 */
```

<!-- Chinese PDF p.16 -->

Значение определяется по журналу ubiattach, например:

<!-- Chinese PDF p.16 -->

```text
ubi4: available PEBs: 7, total reserved PEBs: 24, PEBs reserved for bad PEB handling: 20   /* B = 20 */
```

<!-- Chinese PDF p.16 -->

Если сумма available PEBs + total reserved PEBs раздела меньше Minimum block num, монтирование выдаёт:

<!-- Chinese PDF p.16 -->

```text
mount: mounting /dev/ubi4_0 on userdata failed: Invalid argument
```

<!-- Chinese PDF p.16 -->

### 2.8 LZO или ZLIB для UBIFS

<!-- Chinese PDF p.16 -->

RK SDK по умолчанию использует LZO. В примере оригинала 103M сжимаются до 80M; степень сжатия ZLIB близка. Если требуется более высокая степень сжатия, используйте SquashFS.

<!-- Chinese PDF p.16 -->

### 2.9 Развёрнутый UBIFS-образ больше раздела

<!-- Chinese PDF p.16 -->

Образы UBIFS обычно используют autoresize. Указание размера образа в конфигурации следующей команды может привести к превышению размера раздела после развёртывания:

<!-- Chinese PDF p.16 -->

```text
ubinize -o ubi.img -m 2048 -p 128kiB -O 2048 ubinize.cfg

//ubinize.cfg
[ubifs]
  mode=ubi
  image=ubifs.img
  vol_id=0
  vol_size=192MB                // ⽆需指定⼤⼩，使⽤ autoresize 特性
  vol_type=dynamic
  vol_name=rootfs
  vol_flags=autoresize
```

<!-- Chinese PDF p.16 -->

Типичные сообщения об ошибках:

<!-- Chinese PDF p.16 -->

```text
[    2.345243] ubi0: attaching mtd2
[    2.415631] ubi0: scanning is finished
[    2.419742] ubi0 error: vtbl_check: too large reserved_pebs 1586, good PEBs 699
[    2.419785] ubi0 error: vtbl_check: volume table check failed: record 0, error 9
[    2.419792] Volume table record 0 dump:
[    2.419798]  reserved_pebs   1586
[    2.419803]  alignment       1
[    2.419808]  data_pad        0
[    2.419813]  vol_type        1
[    2.419818]  upd_marker      0
[    2.419823]  name_len        6
[    2.419829]  name            rootfs
[    2.419835]  crc             0x23e79a61
[    2.420000] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd2, error -22
[    2.420024] UBI error: cannot attach mtd2
```

<!-- Chinese PDF p.17 -->

UBIFS не монтируется после обновления изменённой GPT в Loader. В схеме загрузки MTD RK SDK такое обновление записывает целевую прошивку по старой карте дефектных блоков, созданной при старте U-Boot. Поэтому в Loader можно обновлять только прошивки без изменения GPT; иначе перейдите в maskrom. Типичные журналы ошибочного обновления — случай 1:

<!-- Chinese PDF p.17 -->

```text
[    0.659432] ubi0: attaching mtd3
[    1.264467] ubi0: scanning is finished
[    1.271151] ubi0 warning: ubi_read_volume_table: static volume 0 misses 1 LEBs - corrupted
[    1.302342] ubi0: volume 0 ("rootfs") re-sized from 613 to 636 LEBs
[    1.303492] ubi0: attached mtd3 (name "rootfs", size 85 MiB)
[    1.303526] ubi0: PEB size: 131072 bytes (128 KiB), LEB size: 126976 bytes
[    1.303533] ubi0: min./max. I/O unit sizes: 2048/2048, sub-page size 2048
[    1.303540] ubi0: VID header offset: 2048 (aligned 2048), data offset: 4096
[    1.303547] ubi0: good PEBs: 677, bad PEBs: 3, corrupted PEBs: 0
[    1.303559] ubi0: user volume: 1, internal volumes: 1, max. volumes count: 128
[    1.303568] ubi0: max/mean erase counter: 1/0, WL threshold: 4096, image sequence number:
980761742
[    1.303578] ubi0: available PEBs: 0, total reserved PEBs: 677, PEBs reserved for bad PEB handling: 37
[    1.303599] ubi0: background thread "ubi_bgt0d" started, PID 80
```

<!-- Chinese PDF p.17 -->

Случай 2:

<!-- Chinese PDF p.17 -->

```text
[11:34:08:931][    0.661124] ubi0: attaching mtd6
[11:34:08:931][    0.662524] ubi0 error: ubi_attach: bad image sequence number 67638577 in PEB 1,
expected 980761742
[11:34:08:931][    0.662571] Erase counter header dump:
[11:34:08:931][    0.662578]  magic          0x55424923
[11:34:08:931][    0.662584]  version        1
[11:34:08:931][    0.662590]  ec             0
[11:34:08:931][    0.662595]  vid_hdr_offset 2048
[11:34:08:931][    0.662601]  data_offset    4096
[11:34:08:931][    0.662606]  image_seq      67638577
[11:34:08:947][    0.662611]  hdr_crc        0x3a381cee
[11:34:08:947][    0.662616] erase counter header hexdump:
[11:34:08:949][    0.662645] ubi0 error: ubi_attach_mtd_dev: failed to attach mtd6, error -22
[11:34:08:949][    0.662675] UBI error: cannot attach mtd6
[11:34:08:949][    0.662691] UBI: block: can't open volume on ubi0_-1, err=-19
```

<!-- Chinese PDF p.18 -->

### 2.10 Поддержка UBIFS на SPI NOR

<!-- Chinese PDF p.18 -->

Важно: для SPI NOR рекомендуется JFFS2 как файловая система с записью. Настройка ядра:

<!-- Chinese PDF p.18 -->

```text
CONFIG_MTD_SPI_NOR_USE_4K_SECTORS = n
```

<!-- Chinese PDF p.18 -->

Создание образа:

<!-- Chinese PDF p.18 -->

```text
mkfs.ubifs -r data/ -m 1 -e 65408 -c 62 userdata.ubifs
ubinize -o ubi.img -m 1 -p 64KiB -O 64 ubinize_userdata.cfg

(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)(cid:0)  ubifs cat ubinize_userdata.cfg
[userdata-volume]
mode=ubi
image=userdata.ubifs
vol_id=0
vol_size=2MiB
vol_type=dynamic
vol_name=userdata
vol_flags=autoresize
```

<!-- Chinese PDF p.18 -->

Пояснение: стирание по 4KB не поддерживается, поскольку c->leb_size < UBIFS_MIN_LEB_SZ. UBIFS_MIN_LEB_SZ равен 15KB, а leb_size зависит от свойств MTD.

<!-- Chinese PDF p.18 -->

### 2.11 Восстановление UBIFS userdata форматированием

<!-- Chinese PDF p.18 -->

Рекомендации по восстановлению userdata форматированием:

- Хранить часто записываемые файлы в одном разделе.
- Не размещать в нём невосстановимые файлы.
- При ошибке монтирования отформатировать раздел и заново создать необходимые данные для продолжения работы.

Справочные команды форматирования:

<!-- Chinese PDF p.18 -->

```text
ubidetach -m 7
ubiformat -y /dev/mtd7
ubiattach /dev/ubi_ctrl -m 7 -d 7
ubimkvol /dev/ubi7 -N userdata -m
mount -t ubifs /dev/ubi7_0 /userdata
```

<!-- Chinese PDF p.19 -->

### 2.12 Ошибка UBIFS из-за неверного vol_name

<!-- Chinese PDF p.19 -->

Журнал ошибки:

<!-- Chinese PDF p.19 -->

```text
[    6.278922] VFS: Cannot open root device "ubi0:rootfs" or unknown-block(0,0): error -19
[    6.278943] Please append a correct "root=" boot option; here are the available partitions:
```

<!-- Chinese PDF p.19 -->

Пояснение: vol_name раздела rootfs не задан как rootfs.

<!-- Chinese PDF p.19 -->

### 2.13 Долгая загрузка SquashFS на UBI

<!-- Chinese PDF p.19 -->

Для изделий SPI NAND, где надёжность файловой системы важнее времени загрузки, оригинал рекомендует static volume при создании UBI-образа SquashFS, чтобы при старте проверялась целостность. Описанный в источнике RK SDK включает это по умолчанию. При изменении настройки обеспечьте собственную проверку целостности.

Проблема: в испытаниях заказчиков и автора SquashFS на UBI-образах SPI NAND загружалась примерно по секунде на 10MB; раздел UBI 50MB мог загружаться пять секунд. Это испытания источника, не измерения ArmSoM.

Анализ: UBI-образ может использовать том static или dynamic. Static доступен только для чтения; при монтировании на старте проверяется CRC всего образа. Он подходит для дополнительной проверки образов без файловой системы, например kernel/initramdisk. Dynamic поддерживает чтение и запись.

Документация UBIFS объясняет, почему dynamic быстрее static того же размера. Static UBI изначально предназначались для блоков данных, например конфигурационных файлов. Они защищают данные CRC-32 и знают их фактическую длину. Например, static-том /dev/ubi0_1 размером 254KiB из двух LEB по 127KiB с файлом 200KiB при чтении всего устройства возвращает ровно 200KiB. Dynamic вернул бы 254KiB. Поэтому static упрощает хранение блоков данных, но медленнее из-за проверки CRC-32 в UBI. Использовать static с UBIFS только для чтения не рекомендуется: UBIFS уже защищает свои данные CRC-32, и дополнительная проверка лишь замедляет монтирование.

Таким образом, для UBIFS с собственной CRC-защитой источник не рекомендует дополнительную CRC-проверку static volume. По той же логике:

<!-- Chinese PDF p.20 -->

Поскольку SquashFS не проверяет целостность всего образа при старте, источник рекомендует static volume для её UBI-образа.

Испытания оригинала:

TEST01 — время загрузки: RV1106 с SPI NAND и dynamic-томом UBI с SquashFS загрузился нормально. При старте не было дополнительных записей (только чтение); исключение избыточной CRC-проверки вернуло нормальное время загрузки.

TEST02 — SquashFS со сжатием/распаковкой, без static-проверки: создать SquashFS UBI с dynamic volume, найти целевой файл и изменить часть байтов, записать образ, прочитать после загрузки. Данные файла действительно повреждены. Вывод источника «ubifs не имеет проверки целостности» противоречит контексту теста SquashFS; он сохранён как неоднозначность, а не подтверждён.

TEST03 — добавление static-проверки: создать SquashFS UBI со static volume, изменить байты файла, записать образ и прочитать после загрузки. При старте UBI сканирует образ и выводит ошибки:

<!-- Chinese PDF p.20 -->

```text
[    6.358100] ubi0 warning: ubi_eba_read_leb: CRC error: calculated 0xae6dc941, must be 0xf62e2df5
[    6.358212] ubi0 warning: ubi_open_volume: volume 0 on UBI device 0 is corrupted
```

<!-- Chinese PDF p.20 -->

Приложение: переход от static к dynamic:

<!-- Chinese PDF p.20 -->

```text
[rootfs-volume]
mode=ubi
image=rootfs.squashfs
vol_id=0
vol_size=60MiB
vol_type=static
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
```

<!-- Chinese PDF p.20 -->

Изменить на:

<!-- Chinese PDF p.21 -->

```text
[rootfs-volume]
mode=ubi
image=rootfs.squashfs
vol_id=0
vol_size=60MiB
vol_type=dynamic
vol_name=rootfs
vol_alignment=1
vol_flags=autoresize
```

<!-- Chinese PDF p.21 -->

### 2.14 UBIFS: страницы 4KB требуют больше служебного места, чем 2KB, при равных разделах

<!-- Chinese PDF p.21 -->

Это ожидаемо: UBIFS резервирует фиксированное число flash-блоков для алгоритмов. Поэтому при одинаковом размере раздела устройства со страницами 4KB расходуют больше служебного места.

<!-- Chinese PDF p.21 -->

### 2.15 UBIFS: df показывает мало места

<!-- Chinese PDF p.21 -->

См. раздел сообщества UBIFS “Why does df report too little free space?”. UBIFS учитывает служебные данные, сжатие и алгоритмы, поэтому не может точно предсказать полезную ёмкость и оценивает консервативно. df показывает меньше места, хотя фактический объём записываемых данных может быть больше.

<!-- Chinese PDF p.21 -->

### 2.16 JFFS2 медленно монтируется

<!-- Chinese PDF p.21 -->

JFFS2 выполняет сборку мусора при запуске. Это свойство системы; даже ls может работать медленно, а с использованием скорость снижается.

<!-- Chinese PDF p.21 -->

### 2.17 Раздел JFFS2 не стёрт

<!-- Chinese PDF p.21 -->

Обновите инструмент прошивки. Новые версии распознают образы JFFS2 и стирают раздел перед обновлением:

<!-- Chinese PDF p.21 -->

```text
mount -t jffs2 /dev/block/by-name/userdata /userdata
[    2.232850] jffs2: Empty flash at 0x002c1204 ends at 0x002c2000
[    2.232931] jffs2: CLEANMARKER node found at 0x002c2000, not first node in block (0x002c0000)
[    2.233065] jffs2: Empty flash at 0x002c200c ends at 0x002c3000
[    2.233075] jffs2: CLEANMARKER node found at 0x002c3000, not first node in block (0x002c0000)
[    2.233428] jffs2: Empty flash at 0x002c300c ends at 0x002c4000
```

<!-- Chinese PDF p.21 -->

### 2.18 Конфликт JFFS2 со стиранием SPI NOR 4K

<!-- Chinese PDF p.21 -->

JFFS2 требует минимального выравнивания стирания 8KB, а подсистема SPI NOR ядра поддерживает 4KB или 64KB. Поэтому для JFFS2 не включайте CONFIG_MTD_SPI_NOR_USE_4K_SECTORS; используйте выравнивание стирания 64KB.

<!-- Chinese PDF p.22 -->

### 2.19 YAFFS не рекомендуется

<!-- Chinese PDF p.22 -->

Оригинал настоятельно не рекомендует YAFFS, ссылаясь на отсутствие сопровождения сообществом, и советует UBIFS. Это рекомендация источника, а не заново проверенное состояние сопровождения.

<!-- Chinese PDF p.22 -->

### 2.20 Решение RK не поддерживает YAFFS2

<!-- Chinese PDF p.22 -->

Причины:

- Поддержка UBIFS на RK SPI NAND относительно полная; рекомендуется UBIFS.
- YAFFS2 работает с OOB и многократно записывает страницы; испытания оригинала выявили несовместимость.

Для самостоятельной поддержки YAFFS источник указывает драйверы контроллера:

- Ядро 4.19 и ранее: drivers/rfkash/ (написание оригинала; проверить перед использованием).
- Ядро 5.10: drivers/spi/spi-rockchip-sfc.c.

<!-- Chinese PDF p.22 -->

### 2.21 EXT нельзя использовать с этой схемой NAND

<!-- Chinese PDF p.22 -->

EXT не имеет подходящего для Raw NAND FTL и не обеспечивает выравнивание износа, обновление данных, управление дефектными блоками и другие критичные для NAND алгоритмы.

<!-- Chinese PDF p.22 -->

### 2.22 Поддержка EXT2 на SPI NOR

<!-- Chinese PDF p.22 -->

Внимание: выравнивания износа нет; применять осторожно. Выравнивание стирания — 4KB.

<!-- Chinese PDF p.22 -->

Включите CONFIG_MTD_SPI_NOR_USE_4K_SECTORS. SPI NOR поддерживает ext2 при монтировании раздела через mtdblock. Избегайте частых записей. Источник приводит типичный ресурс SPI NOR P/E (стирание/запись) 100K циклов; срок службы изделия оцените самостоятельно.

<!-- Chinese PDF p.22 -->

### 2.23 Отсутствие discard в EXT2 снижает скорость со временем

<!-- Chinese PDF p.22 -->

Оригинал указывает отсутствие discard в ext2, включая рассмотренные им версии Linux. Если всё пространство flash уже использовано, удаление файлов меняет лишь inode и не сообщает накопителю об освобождении места; таким способом занятое нижним уровнем пространство не возвращается.

Рекомендации: использовать файлы повторно, избегать частого создания и постоянного заполнения всего места крупными файлами. Если это неизбежно, рассмотреть периодическое форматирование: mkfs.ext2 вызывает discard для освобождения. Либо перейти на ext4 с параметром монтирования discard. Это утверждения версии источника; перед адаптацией проверить поведение конкретных утилит, драйвера и ядра.

<!-- Chinese PDF p.23 -->

### 2.24 Методы и эффективность сжатия SquashFS

<!-- Chinese PDF p.23 -->

Далее приведён лишь предварительный ориентир; степень сжатия зависит от типа данных и других факторов:

<!-- Chinese PDF p.23 -->

| Метод | Степень сжатия | Сжатие MB/s | Распаковка MB/s |
| --- | --- | --- | --- |
| gzip | 2.92 | 15 | 128 |
| lzo | 2.64 | 9.5 | 217 |
| lz4 | 2.12 | 94 | 218 |
| xz | 3.43 | 5.5 | 35 |
| xz 256 KB | 3.53 | 5.4 | 40 |
| zstd 1 | 2.71 | 96 | 210 |
| zstd 5 | 2.93 | 69 | 198 |
| zstd 10 | 3.01 | 41 | 225 |
| zstd 15 | 3.13 | 11.4 | 224 |
| zstd 16 256 KB | 3.24 | 8.1 | 210 |

<!-- Chinese PDF p.23 -->

Источник данных: squashfs: Add zstd support.

<!-- Chinese PDF p.23 -->

## 3. Проблемы EMMC

<!-- Chinese PDF p.23 -->

### 3.1 Периодические ошибки связи EMMC в ядре

<!-- Chinese PDF p.23 -->

Возможны разные причины. В источнике встречались следующие случаи:

Слишком малая внешняя ёмкость VDDI. Контроллер EMMC требует около 1.2V, обычно получаемых из VCCQ через LDO. Конденсатор VDDI фильтрует это питание 1.2V. В большинстве корпусов EMMC к VDDI уже подключён небольшой внутренний конденсатор, но контроллеры и ёмкости различаются между изготовителями и моделями, поэтому требования к внешнему конденсатору неодинаковы. Типовые требования оригинала:

<!-- Chinese PDF p.23 -->

| Режим работы | Ёмкость VDDI |
| --- | --- |
| HS400 | 1 - 2.2uF (отдельные компоненты 2-4.7uF) |
| Режимы кроме HS400 | 0.1uF - 2.2uF |

<!-- Chinese PDF p.23 -->

Слишком малая ёмкость или отказ внешнего конденсатора VDDI могут объяснить, почему компонент A работает, а после замены на B возникают периодические ошибки связи.

<!-- Chinese PDF p.24 -->

Рекомендуемая ёмкость VDDI (верхний предел либо близкое значение):

<!-- Chinese PDF p.24 -->

| Платформа | Режим работы | Ёмкость VDDI |
| --- | --- | --- |
| RK3399 | HS400 | 2.2uF |
| Другие платформы | HS200,DDR50, SDR 50 | 1uF |

<!-- Chinese PDF p.24 -->

Отсутствует или слишком мал конденсатор VCCQ на стороне хоста. EMMC 5.1 быстро читает и записывает; большая ёмкость обычно означает более быструю запись. Импульсный ток VCC/VCCQ может превышать 400mA (у большинства компонентов около 200mA). Без достаточной ёмкости VCCQ при включении или работе может проседать, вызывая ошибки чтения EMMC.

ESD-компоненты на линиях DATA EMMC. SD-картам они нужны, но EMMC припаян и не подключается на ходу, поэтому источник считает дополнительную ESD-защиту ненужной. Большая ёмкость ESD-компонента искажает сигнал и вызывает ошибки HS400/HS200.

CLK/CMD EMMC слишком близко к высокоскоростным сигналам, например HDMI. Помехи вызывают ошибки связи.

Неравные длины трасс и большое последовательное сопротивление CMD/CLK. И HS200, и HS400 используют частоту 200MHz. Такие условия сужают окно чтения, повышая вероятность ошибок при изменении температуры и напряжения.

<!-- Chinese PDF p.24 -->

### 3.2 EMMC не обнаружена либо ошибка проверки при обновлении

<!-- Chinese PDF p.24 -->

Причин может быть несколько. Неверный выбор VCCQ: поддерживаются 1.8V и 3.3V, а I/O хоста нужно настроить соответственно. Обычно выбор задаётся подключением I/O к VCC или земле; см. схему.

<!-- Chinese PDF p.24 -->

| Напряжение VCCQ | Режим I/O хоста | Результат |
| --- | --- | --- |
| 1.8V | 1.8V | Нормально |
| 1.8V | 3.3V | Не работает |
| 3.3V | 1.8V | Возможно работает на низкой скорости; ошибки на высокой |
| 3.3V | 3.3V | Нормально |

<!-- Chinese PDF p.24 -->

Малая ёмкость VDDI: см. предыдущее описание VDDI (перекрёстная ссылка оригинала — «1.1»).

Пайка либо повреждение EMMC: некоторые DNU/NC-шары должны оставаться резервными и могут быть внутри подключены к земле или VCCQ. Соединение их с другими I/O на PCB может замкнуть данные или питание отдельных моделей. Некачественная ручная пайка мешает обнаружению; перегрев при оплавлении либо влага повреждают компонент и также мешают распознаванию.

<!-- Chinese PDF p.25 -->

### 3.3 Повреждение EMMC либо потеря прошивки после эксплуатации

<!-- Chinese PDF p.25 -->

Основные случаи оригинала:

Неисправности EMMC обычно относятся к двум категориям:

<!-- Chinese PDF p.25 -->

**1.** На отдельных компонентах после работы повреждаются данные, например из-за дефектных блоков; повторная запись прошивки хоста может помочь. Сбой внутренней FW EMMC требует замены компонента. Оригинал указывает вероятность обычно менее одной тысячной; это не измерение ArmSoM.

<!-- Chinese PDF p.25 -->

**2.** Дефекты FW EMMC могут вызывать массовую потерю данных или сбой прошивки с существенно большей частотой. Требуется FFU для обновления FW EMMC либо повторная инициализация компонента.

Исчерпание ресурса из-за чрезмерной записи: неудачная архитектура/настройка приложений, включая Android, создаёт множество мелких случайных записей журналов. Усиление записи EMMC велико: запись журнала 1KB может требовать страницы 16KB и обновлений файловой системы, всего три записи или 48KB в примере источника.

EMMC 5.1 EXT CSD содержит показатели ресурса: DEVICE_LIFE_TIME_EST_TYP_B [269], PRE_EOL_INFO [267] и DEVICE_LIFE_TIME_EST_TYP_B [268]. Повтор TYPE_B сохранён как написание оригинала. Чтение EXT CSD:

<!-- Chinese PDF p.25 -->

**1.** Прочитать через mmc-utils; см. справку утилиты.

<!-- Chinese PDF p.25 -->

**2.** В консоли Linux прочитать узел EMMC ext_csd командой cat. Путь зависит от системы; источник предлагает найти его через find ext_csd.

<!-- Chinese PDF p.25 -->

```text
cat /sys/kernel/debug/mmc0/mmc0:0001/ext_csd
```

<!-- Chinese PDF p.25 -->

**3.** В maskrom загрузить отладочный Loader с dump_ext_csd в имени. EXT CSD выводится в последовательный порт.

Linux upgrade tool и Android_Console_Tool:

<!-- Chinese PDF p.25 -->

```text
db xxxloaderxxx.bin
```

<!-- Chinese PDF p.25 -->

Android tool:

<!-- Chinese PDF p.25 -->

![3.3 Повреждение EMMC либо потеря прошивки после эксплуатации: китайский оригинал, стр. 25](/docs/rockchip-storage-faq/assets/cn-p025-figure-01.png)

*3.3 Повреждение EMMC либо потеря прошивки после эксплуатации: китайский оригинал, стр. 25*

<!-- Chinese PDF p.25 -->

Сведения о ресурсе EXT CSD:

<!-- Chinese PDF p.26 -->

DEVICE_LIFE_TIME_EST_TYP_B [269] и DEVICE_LIFE_TIME_EST_TYP_B [268] отражают ресурс стирания/записи EMMC; см. таблицу. Оба имени сохранены по оригиналу.

<!-- Chinese PDF p.26 -->

| Значение | Описание |
| --- | --- |
| 0x00 | Не определено |
| 0x01 | Использовано ресурса 0% - 10% |
| 0x02 | Использовано ресурса 10% -20% |
| 0x03 | Использовано ресурса 20% -30% |
| 0x04 | Использовано ресурса 30% - 40% |
| 0x05 | Использовано ресурса 40% - 50% |
| 0x06 | Использовано ресурса 50% - 60% |
| 0x07 | Использовано ресурса 60% - 70% |
| 0x08 | Использовано ресурса 70% - 80% |
| 0x09 | Использовано ресурса 80% - 90% |
| 0x0A | Использовано ресурса 90% - 100% |
| 0x0B | Превышен максимальный оценочный ресурс |
| Другие | Зарезервировано |

<!-- Chinese PDF p.26 -->

PRE_EOL_INFO [267] показывает исчерпание резервных блоков EMMC; см. таблицу:

<!-- Chinese PDF p.26 -->

| Значение | Сведения Pre-EOL | Описание |
| --- | --- | --- |
| 0x00 | Не определено |   |
| 0x01 | Нормально | Нормально |
| 0x02 | Предупреждение | Израсходовано 80% резервных блоков |
| 0x03 | Срочно |   |
| 0x04 ~ 0xFF | Зарезервировано |   |

<!-- Chinese PDF p.26 -->

Потеря питания при OTA: источник сообщает, что версии Android после 7.1 обновляют блоки раздела system напрямую, а не файлы. Поэтому отключение питания при OTA может повредить system.

<!-- Chinese PDF p.26 -->

### 3.4 EMMC остаётся в maskrom после обновления

<!-- Chinese PDF p.26 -->

Плохая пайка EMMC либо проблема PCB: BOOTROM использует 8-битный режим. При неверном подключении одной из D1–D7 он не работает. Плохая пайка:

<!-- Chinese PDF p.27 -->

Если неисправны отдельные образцы, обычная причина — плохая пайка.

PCB: если неисправны все образцы, вероятна проблема платы, например трассы данных через шары RFU или DNU.

<!-- Chinese PDF p.27 -->

![3.4 EMMC остаётся в maskrom после обновления: китайский оригинал, стр. 27](/docs/rockchip-storage-faq/assets/cn-p027-figure-01.png)

*3.4 EMMC остаётся в maskrom после обновления: китайский оригинал, стр. 27*

<!-- Chinese PDF p.27 -->

Отсутствует либо неверно записан uboot/trust: если образ не записан или смещение неверно, Miniloader не запускает U-Boot и возвращается в maskrom. Журнал показывает запуск Miniloader и перезагрузку.

<!-- Chinese PDF p.27 -->

## 4. Проблемы flash

<!-- Chinese PDF p.27 -->

### 4.1 Скорость чтения/записи flash

<!-- Chinese PDF p.27 -->

Общий тест (близко к оптимуму): использовать dd для области не менее 10MB.

<!-- Chinese PDF p.28 -->

| Тип компонента | Условия теста | Последовательное чтение | Последовательная запись |
| --- | --- | --- | --- |
| SLC Nand | Linux | 16MB/s(IO 30MHz) | 4MB/s(IO 30MHz) |
| SPI Nand | Linux | 10.8MB/s (IO 80MHz) | 4.0 MB/s (IO 48MHz) |
| SPI Nor | Linux | 24.0MB/s(IO 80MHz) | 100~200 KB/s(IO 48MHz) |
| SPI Nor | RTT | 35MB/s (IO 80MHz) | 100~200KB/s(IO 80MHz) |

<!-- Chinese PDF p.28 -->

| Тип компонента | Условия теста | Случайное чтение 4K | Случайная запись 4K |
| --- | --- | --- | --- |
| SPI Nor | RKOS | 13MB/s (IO 80MHz) | 100~200 KB/s(IO 48MHz) |

<!-- Chinese PDF p.28 -->

Специальный тест скорости записи 1 (близко к насыщению), условия источника:

- RK3308_V10_EVB.
- Ядро 4.4, 64 бит.
- Пользовательский раздел: 352MB.
- Ёмкость flash: 512MB.

Тест:

<!-- Chinese PDF p.28 -->

```text
Sub Main
    while (1)
        crt.Screen.Send "rm /userdata/test && sync"
        crt.Screen.Send chr (13)
        crt.Sleep 2000
        crt.Screen.Send "time dd if=/dev/zero of=/userdata/test bs=1M count=350 && sync"
        crt.Screen.Send chr (13)
        crt.Screen.waitForString "real"
        crt.Sleep 2000
    wend
End Sub
```

<!-- Chinese PDF p.28 -->

Вывод источника: за полчаса теста скорость записи при полной нагрузке составила 2.0 MB/s. Это не измерение ArmSoM.

<!-- Chinese PDF p.28 -->

### 4.2 Защита flash от записи

<!-- Chinese PDF p.28 -->

Защита flash от записи:

- Программная защита обычно поддерживается, но реализации различаются.
- Некоторые компоненты имеют аппаратный wp#. RK не управляет им напрямую; при необходимости использовать GPIO.

В описанной схеме RK обработка защиты не добавлена: используется единый интерфейс чтения/записи, случайный сигнал теоретически не должен вызвать полную транзакцию, а схемы защиты компонентов сильно различаются.

<!-- Chinese PDF p.29 -->

### 4.3 Несовместимость программного выбора двух кристаллов flash

<!-- Chinese PDF p.29 -->

Текущая программная подсистема не поддерживает stacked-die из двух однотипных flash при программном выборе кристалла.

<!-- Chinese PDF p.29 -->

### 4.4 Типовые журналы ядра при отказе инициализации памяти

<!-- Chinese PDF p.29 -->

При ошибке инициализации памяти соответствующие разделы MTD не создаются. Система продолжает запуск до попытки монтирования корня не из ramdisk, затем останавливается с сообщением “waiting for root......”.

<!-- Chinese PDF p.29 -->

### 4.5 Обеспечение записи данных узла устройства на носитель

<!-- Chinese PDF p.29 -->

Источник предлагает добавить O_SYNC либо O_DIRECT к fopen или вызвать fsync после записи. Для обновления через dd рекомендует iflag=nocache и oflag=direct. В оригинале назван fopen, хотя эти флаги обычно относятся к open; несоответствие сохранено для проверки.

<!-- Chinese PDF p.29 -->

### 4.6 Замена flash-компонентов

<!-- Chinese PDF p.29 -->

T/A и S/A в списке поддержки: IP контроллера RK SPI flash совместим между платформами. T/A обозначает образец, проверенный на платформе валидации памяти; S/A — совместимую платформу. Источник допускает применение flash с T/A либо S/A.

Новые NAND-компоненты: RK проверяет базовые функции и стабильность предоставленных образцов на тестовой платформе. Конкретному изделию нужны дополнительные проверки: одинаковое качество сигналов до/после замены, соответствие спецификации и устойчивость к внезапной потере питания. См. Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN.pdf.

<!-- Chinese PDF p.29 -->

### 4.7 Диагностика сбоев загрузки TFTP и записи

<!-- Chinese PDF p.29 -->

Первичная диагностика: рассчитать и сравнить md5sum на этапах:

**1.** После создания образа.
**2.** После загрузки TFTP; несовпадение указывает на возможную сеть или DRAM.
**3.** Обратное чтение после записи flash; несовпадение указывает на возможную неисправность flash. Снизить частоту либо перейти на одну линию для проверки.
**4.** Войти в maskrom, прочитать образ и рассчитать md5sum; сравнить с обратным чтением работающего устройства.

Если предварительно подозревается flash:

<!-- Chinese PDF p.30 -->

Если снижение частоты или одна линия помогают, измерьте качество сигналов и стабильность питания flash, измените аппаратную часть и проверьте штатные настройки. Если не помогают, обратитесь к инженеру ПО памяти RK.

<!-- Chinese PDF p.30 -->

### 4.8 Интерфейсы MTD и mtd_block в U-Boot

<!-- Chinese PDF p.30 -->

![4.8 Интерфейсы MTD и mtd_block в U-Boot: китайский оригинал, стр. 30](/docs/rockchip-storage-faq/assets/cn-p030-figure-01.png)

*4.8 Интерфейсы MTD и mtd_block в U-Boot: китайский оригинал, стр. 30*

<!-- Chinese PDF p.30 -->

Различие гранулярности записи/стирания: у NOR и NAND минимальные единицы разные. Для записи 256B внутри сектора NOR 4K нужно стереть 4K, поэтому остальные (4KB - 256B) байт предварительно сохраняют и записывают обратно.

MTD и блочный интерфейс:

- MTD требует управления записью/стиранием верхним уровнем.
- Блочный интерфейс абстрагирует минимальный логический сектор; доступ к нему не затрагивает другие, поскольку несовпадение единиц обрабатывается внутри.
- Linux mtdblock задаёт логические секторы 512B и согласует запись/стирание при записи одного сектора 512B.

RK SDK U-Boot реализует аналогичную логику по образцу Linux.

<!-- Chinese PDF p.30 -->

### 4.9 Сбои flash под нагрузкой при низкой температуре

<!-- Chinese PDF p.30 -->

Сначала измерьте уровни подтяжки VCCIO Flash sel при низкой температуре.

<!-- Chinese PDF p.30 -->

### 4.10 Случайное нажатие maskrom нарушает передачу

<!-- Chinese PDF p.30 -->

Размещайте maskrom так, чтобы кнопку нельзя было легко задеть и нарушить передачу данных.

<!-- Chinese PDF p.30 -->

## 5. Проблемы контроллера flash

<!-- Chinese PDF p.30 -->

### 5.1 Заполнение такта FSPI не равно 50%

<!-- Chinese PDF p.30 -->

Выходная частота делится от определённого PLL дерева тактирования. При нечётном делении заполнение может отличаться от 50%, что делает временные параметры предельными на максимальной скорости периферии. Чётное деление даёт 50%.

<!-- Chinese PDF p.31 -->

### 5.2 FSPI не универсальный SPI: только SPI memory

<!-- Chinese PDF p.31 -->

FSPI (ранее SFC) поддерживает только временную схему SPI memory: cmd + addr (необязательно) + dummy (необязательно) + data (необязательно). В частности, непосредственный ввод сразу после активации CS не поддерживается. Проверьте временную диаграмму. Для внешней FPGA и другой периферии оцените соответствие протокола требованиям. Драйвер ядра: spi-rockchip-sfc.c.

<!-- Chinese PDF p.31 -->

### 5.3 Setup/hold FSPI не измеряется

<!-- Chinese PDF p.31 -->

Чтение FSPI в U-Boot и ядре по умолчанию четырёхлинейное. При одинаковой частоте требования хоста к setup/hold теоретически одинаковы.

Предпосылки:

<!-- Chinese PDF p.31 -->

**1.** Основы выборки FSPI. Используется SPI mode 0: CPOL — низкий уровень в покое, CPHA — выборка на первом фронте. Затем чтение сдвигается на полпериода, на спадающий фронт.

<!-- Chinese PDF p.31 -->

![5.3 Setup/hold FSPI не измеряется: китайский оригинал, стр. 31](/docs/rockchip-storage-faq/assets/cn-p031-figure-01.png)

*5.3 Setup/hold FSPI не измеряется: китайский оригинал, стр. 31*

<!-- Chinese PDF p.31 -->

**2.** Необходимость DLL (delay line). Задержка I/O по ограничениям FSPI вместе с output delay большинства компонентов оставляет малый запас setup/hold. Линия задержки помогает выбрать лучший запас выборки.

<!-- Chinese PDF p.31 -->

**3.** Свойства DLL. RK FSPI поддерживает линию задержки выборки. Она добавляется внутри микросхемы и не измеряется на I/O. DLL зависит от PVT и техпроцесса; задержка не постоянна и не является фазово-синхронизированной. Она накладывается на описанную выборку по спадающему фронту. Поэтому точную задержку DLL нельзя рассчитать или увидеть во внешнем сигнале.

<!-- Chinese PDF p.31 -->

**4.** Политика ПО DLL. DLL включается при I/O выше 50MHz. Каждый программный этап выполняет настройку сравнением ID flash.

Итог: setup/hold чтения FSPI хоста RK не измеряют, поскольку большинство частот выше 50MHz используют DLL, чьё фактическое внутреннее время выборки снаружи не измеряется. Ниже 50MHz базовая схема выборки имеет большой запас.

<!-- Chinese PDF p.32 -->

### 5.4 Можно ли подключить разные устройства к двум CS FSPI?

<!-- Chinese PDF p.32 -->

Если микросхема выводит FSPI CS1N, IP теоретически поддерживает два chip select. Только устройство CS0N является bootdev. Устройства используют много общих I/O, поэтому помехи влияют на скорость. Нужна полная аппаратная и программная оценка.

<!-- Chinese PDF p.32 -->

## 6. Проблемы NAND

<!-- Chinese PDF p.32 -->

### 6.1 Перевод NAND PX30 на rkflash

<!-- Chinese PDF p.32 -->

Описание rk_nand/rk_flash см. в главе Storage документа Rockchip_Developer_Guide_UBoot_Nextdev_CN. rk_nand главным образом используется для MLC/TLC NAND большой ёмкости, rk_flash — для SLC NAND. SDK PX30 обычно содержит прошивку большой NAND, поэтому переход на SLC требует изменения драйверов. Основные изменения:

<!-- Chinese PDF p.32 -->

**1.** В rkbin использовать Loader, упакованный по RKBOOT/PX30MINIALL_SLC.ini.

<!-- Chinese PDF p.32 -->

**2.** В U-Boot по главе Storage Rockchip_Developer_Guide_UBoot_Nextdev_CN заменить RKNAND на RKFLASH.

<!-- Chinese PDF p.32 -->

**3.** Аналогично в ядре заменить RK_NAND на RK_FLASH и включить nandc0 в DTS.

Возможная проблема — Q1: U-Boot не загружает систему. A1: вероятно, неверно настроен драйвер либо DTS. Проверить командами:

<!-- Chinese PDF p.32 -->

```text
=> dm tree
...
# 正常设备应有以下类似打印
rksfc [ + ] rksfc |-- sfc@ff4c0000 **
blk [ + ] rkflash_blk | |-- sfc@ff4c0000.spinand.blk
blk [ ] rkflash_blk | `-- sfc@ff4c0000.spinor.blk
```

<!-- Chinese PDF p.32 -->

### 6.2 Правила пользовательского чтения/записи NAND в U-Boot

<!-- Chinese PDF p.32 -->

Для редких операций стирания/записи можно напрямую вызывать MTD. Но некоторые заказчики часто записывают журналы в U-Boot в сырой раздел без ФС и не хотят затрагивать vendor. Чтобы уменьшить износ NAND при записи на месте, создайте отдельный раздел с чтением/записью по образцу vendor. Код: arch/arm/mach-rockchip/vendor.c, интерфейсы mtd_vendor_storage_init и mtd_vendor_write.

Реализация vendor:

<!-- Chinese PDF p.33 -->

При инициализации определяется vnvm и регистрируется интерфейс vendor. Каждый раз записываются две копии; запись выровнена по странице и начинается с первой страницы блока, стирается весь блок.

<!-- Chinese PDF p.33 -->

### 6.3 Распределение места NAND SFTL

<!-- Chinese PDF p.33 -->

| Ёмкость компонента | idblock | Пользовательские данные | Резервные данные | sys block | Накладные расходы |
| --- | --- | --- | --- | --- | --- |
| 128MB | 2MB | 107MB | 11MB | 8MB | 14.8% |
| 256MB | 2MB | 218MB | 24MB | 12MB | 14% |
| 512MB | 2MB | 464MB | 31MB | I5MB | 9% |

<!-- Chinese PDF p.33 -->

Область 11M используется для обмена данными flash и повышения эффективности чтения/записи; sys block предназначен для FTL.

<!-- Chinese PDF p.33 -->

### 6.4 Не объединять отдельные NAND-образы в одну операцию записи

<!-- Chinese PDF p.33 -->

Программатор в итоге должен записывать разделы отдельно: рабочее управление плохими блоками ограничено разделом, и предварительная запись должна совпадать. Некоторые программаторы поддерживают собственную либо открытую упаковку all_in_one: отдельные образы объединяются, возможно с метаданными разделов, затем программатор разбирает их, распаковывает и записывает отдельно. Получите пример у изготовителя либо разработайте самостоятельно. RK разбирала один формат all-in-one; см. документ SPI NAND 20210804_flash_programer.

<!-- Chinese PDF p.33 -->

### 6.5 Управление BBT в открытой NAND-подсистеме

<!-- Chinese PDF p.33 -->

Требования к таблице плохих блоков: почти любая операция NAND должна знать состояние блока. Без кэша каждый запрос заново читает метку из страницы, затрачивая I/O-время. Запись новых меток также ненадёжна, когда блок нестабилен.

MTD кэширует первый результат чтения в bad block table; повторные запросы используют кэш. После перезапуска его создают заново, поэтому таблицу следует сохранять и в энергонезависимой памяти. Кэш: drivers/mtd/nand/bbt.c.

SLC NAND BBT во flash: открытая подсистема SLC NAND уже содержит постоянное хранение таблицы для централизованного управления и обновления сведений.

<!-- Chinese PDF p.34 -->

SPI NAND BBT во flash: описанная открытая подсистема не содержит постоянной таблицы SPI NAND. Поэтому RK предоставляет свою поддержку, включённую по умолчанию. Код — U-Boot:

<!-- Chinese PDF p.34 -->

```text
drivers/mtd/nand/bbt.c
```

<!-- Chinese PDF p.34 -->

Ядро:

<!-- Chinese PDF p.34 -->

```text
drivers/rkflash/sfc_nand_mtd_bbt.c
```

<!-- Chinese PDF p.34 -->

Особенности:

<!-- Chinese PDF p.34 -->

**1.** Использует существующий механизм bbt.cache из drivers/mtd/nand/bbt.c.

<!-- Chinese PDF p.34 -->

**2.** Зарезервировать последние четыре NAND-блока для таблицы и соответственно скорректировать последний раздел.

<!-- Chinese PDF p.34 -->

**3.** Создать таблицу в U-Boot при первом включении.

<!-- Chinese PDF p.34 -->

**4.** Каждый раз записывать две копии.

<!-- Chinese PDF p.34 -->

**5.** По источнику, взаимоблокировка здесь не возникает: в этой обработке U-Boot нет настоящих mutex и многопоточности.

<!-- Chinese PDF p.34 -->

## 7. Проблемы параллельной SLC NAND

<!-- Chinese PDF p.34 -->

### 7.1 Создание IDB PX30 SLC NAND

<!-- Chinese PDF p.34 -->

Для разных образов нужны разные способы создания:

<!-- Chinese PDF p.34 -->

**1.** IDB: экспортировать программатором образ с OOB от flash-блока 0, обычно длиной два блока.

<!-- Chinese PDF p.34 -->

**2.** Другие образы: использовать programmer_image_tool с -l для изменения связей списка.

<!-- Chinese PDF p.34 -->

Образ IDB PX30 для программатора создаётся отдельно: старые платформы добавляют страницу flash info и специальный ECC в область IDB SLC NAND. programmer_image_tool этого не реализует; на новых платформах такой страницы нет. Форматы несовместимы.

<!-- Chinese PDF p.34 -->

### 7.2 Анализ изготовителя сообщает много подряд плохих блоков SLC NAND

<!-- Chinese PDF p.34 -->

После выпайки SLC NAND и проверки программатором заказчик или изготовитель может заключить, что RK создала множество меток плохих блоков. Источник считает вывод неверным: RK FTL использует таблицу, а spare byte 0 использованных блоков нельзя трактовать как обычную метку. Сторонняя проверка выпаянного компонента не даёт окончательного вывода; реальные сбои анализируют отдельно.

<!-- Chinese PDF p.35 -->

### 7.3 Программатор SLC NAND не поддерживает образы мастер-устройства

<!-- Chinese PDF p.35 -->

Предположим, что «образ» содержит только data:

<!-- Chinese PDF p.35 -->

**1.** SPI NAND использует ECC компонента, поэтому записываемый образ содержит только data, а ECC обеспечивается компонентом.

<!-- Chinese PDF p.35 -->

**2.** SLC NAND использует BCH, созданный хостом. После обработки страницы RK BCH данные и OOB (метаданные и код BCH) размещаются по схеме:

<!-- Chinese PDF p.35 -->

![7.3 Программатор SLC NAND не поддерживает образы мастер-устройства: китайский оригинал, стр. 35](/docs/rockchip-storage-faq/assets/cn-p035-figure-01.png)

*7.3 Программатор SLC NAND не поддерживает образы мастер-устройства: китайский оригинал, стр. 35*

<!-- Chinese PDF p.35 -->

Переразмещение: обычное data + OOB превращается в чередование data + OOB + data + OOB … . Исходное место метки в первом байте OOB оказывается в данных. После прошивки SLC NAND нельзя оценивать по стандартному правилу изготовителя для первого байта OOB. RK сначала проверяет ошибку BCH, затем метку первого OOB-байта. Поэтому программатор при обратном чтении не может корректно пропускать плохие блоки.

<!-- Chinese PDF p.35 -->

### 7.4 Образы программатора SLC NAND содержат data и OOB

<!-- Chinese PDF p.35 -->

OOB (метаданные и BCH) добавляется при создании образа. Выберите запись data с OOB.

<!-- Chinese PDF p.36 -->

![7.4 Образы программатора SLC NAND содержат data и OOB: китайский оригинал, стр. 36](/docs/rockchip-storage-faq/assets/cn-p036-figure-01.png)

*7.4 Образы программатора SLC NAND содержат data и OOB: китайский оригинал, стр. 36*

<!-- Chinese PDF p.36 -->

### 7.5 Образы SDK SLC NAND содержат data без OOB

<!-- Chinese PDF p.36 -->

OOB (метаданные и BCH) добавляет контроллер; пользовательский образ содержит только data.

<!-- Chinese PDF p.37 -->

![7.5 Образы SDK SLC NAND содержат data без OOB: китайский оригинал, стр. 37](/docs/rockchip-storage-faq/assets/cn-p037-figure-01.png)

*7.5 Образы SDK SLC NAND содержат data без OOB: китайский оригинал, стр. 37*

<!-- Chinese PDF p.37 -->

### 7.6 Размещение ECC SLC NAND в ПО

<!-- Chinese PDF p.37 -->

Параллельная SLC NAND RK SDK использует BCH хост-контроллера для ECC с настройкой 16bits/1KB. Размещение:

<!-- Chinese PDF p.37 -->

![7.6 Размещение ECC SLC NAND в ПО: китайский оригинал, стр. 37](/docs/rockchip-storage-faq/assets/cn-p037-figure-02.png)

*7.6 Размещение ECC SLC NAND в ПО: китайский оригинал, стр. 37*

<!-- Chinese PDF p.37 -->

### 7.7 Оптимизация скорости rkflash SLC NAND в ядре

<!-- Chinese PDF p.37 -->

Компромисс с планированием CPU:

<!-- Chinese PDF p.37 -->

**1.** Обновите патч памяти по соответствующей ссылке оригинала.

<!-- Chinese PDF p.37 -->

**2.** В drivers/rkflash/nandc.c изменить usleep_range с 20–30 на 5–10. Источник описывает это как оптимизацию планирования потоков ценой части скорости передачи. Увеличение сна, напротив, снижает CPU-нагрузку при большом I/O. Это утверждения источника; настраивайте после измерения реальной нагрузки.

<!-- Chinese PDF p.37 -->

### 7.8 Оптимизация чтения SLC NAND MTD в SPL

<!-- Chinese PDF p.37 -->

Предпосылка: характеристики PP NAND различаются, поэтому NandC настроен консервативно ради стабильности. Для изделий с высокой скоростью допустима обоснованная оптимизация.

<!-- Chinese PDF p.38 -->

Обновление/проверка патча: для RV1126 добавить патч U-Boot, пересобрать и обновить SPL для I/O 30MHz:

<!-- Chinese PDF p.38 -->

```text
diff --git a/arch/arm/mach-rockchip/rv1126/rv1126.c b/arch/arm/mach-rockchip/rv1126/rv1126.c
index 84df82ab138..e3ae330e413 100644
--- a/arch/arm/mach-rockchip/rv1126/rv1126.c
+++ b/arch/arm/mach-rockchip/rv1126/rv1126.c
@@ -77,6 +77,7 @@ DECLARE_GLOBAL_DATA_PTR;
 #define CRU_CLKSEL_CON50       0x1c8
 #define CRU_CLKSEL_CON51       0x1cc
 #define CRU_CLKSEL_CON54       0x1d8
+#define CRU_CLKSEL_CON59       0x1ec
 #define CRU_CLKSEL_CON61       0x1f4
 #define CRU_CLKSEL_CON63       0x1fc
 #define CRU_CLKSEL_CON65       0x204
@@ -749,6 +750,11 @@ int arch_cpu_init(void)
        udelay(1);
        writel(0x00100000, CRU_BASE + CRU_SOFTRST_CON10);

+#ifdef CONFIG_SPL_BUILD
+       writel(0x00ff004, CRU_BASE + CRU_CLKSEL_CON59);
+       printf("NandC gpll=768,div=(%d+1)\n", readl(CRU_BASE + CRU_CLKSEL_CON59) & 0xff);
+#endif
+
        return 0;
 }
 #endif
diff --git a/drivers/mtd/nand/raw/rockchip_nand_spl.c b/drivers/mtd/nand/raw/rockchip_nand_spl.c
index 6e39287ef39..d6ed7038914 100644
--- a/drivers/mtd/nand/raw/rockchip_nand_spl.c
+++ b/drivers/mtd/nand/raw/rockchip_nand_spl.c
@@ -92,7 +92,7 @@ static u32 nand_block_num;

 static void nandc_init(struct rk_nand *rknand)
 {
-       writel(0x1081, rknand->regs + NANDC_REG_V6_FMWAIT);
+       writel(0x1061, rknand->regs + NANDC_REG_V6_FMWAIT);
 }

 static void rockchip_nand_wait_dev_ready(void __iomem *regs)
```

<!-- Chinese PDF p.38 -->

После повышения скорости NandC SPL проверить:

<!-- Chinese PDF p.38 -->

**1.** Качество сигналов по спецификации компонента.

<!-- Chinese PDF p.38 -->

**2.** Устойчивость под нагрузкой; допустим циклический reboot.

<!-- Chinese PDF p.38 -->

### 7.9 Слишком много плохих блоков в конце SLC NAND нарушают MTD

<!-- Chinese PDF p.38 -->

Для ядра 4.19 сначала проверьте наличие патча:

<!-- Chinese PDF p.39 -->

```text
commit e323080273b1e6ad2862158c2c634bf9f36671b2
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Tue Aug 29 15:56:56 2023 +0800

    mtd: rawnand: rockchip: Modify the judgment of the last page

    Incorrect judgment without affecting bad block judgment logic.

    Change-Id: I123be12cc50e52e6a24c4276a5ac68208239af42
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.39 -->

## 8. Частые вопросы SPI NAND

<!-- Chinese PDF p.39 -->

### 8.1 Совместимость plane select SPI NAND

<!-- Chinese PDF p.39 -->

Проблема: RV1126/RV1109 несовместимы с некоторыми двухплоскостными SPI NAND. Для запуска нужно уменьшать IDB; такие компоненты не рекомендуются и отмечены в списке поддержки.

Обход: RK предоставляет урезанную SPL — configs/rv1126-spl-spi-nand_defconfig. Основные исключения:

<!-- Chinese PDF p.39 -->

**1.** Другие накопители: параллельная NAND, EMMC, SPI NOR и SD.

<!-- Chinese PDF p.39 -->

**2.** Поддержка GPT.

<!-- Chinese PDF p.39 -->

**3.** Разделы A/B. Если эти функции нужны, удалите другие неиспользуемые определения компонентов изготовителей ниже, освобождая место:

<!-- Chinese PDF p.39 -->

```text
CONFIG_MTD_SPI_NAND=y
CONFIG_SPI_NAND_GIGADEVICE=y
CONFIG_SPI_NAND_MACRONIX=y
CONFIG_SPI_NAND_MICRON=y
CONFIG_SPI_NAND_TOSHIBA=y
CONFIG_SPI_NAND_WINBOND=y
CONFIG_SPI_NAND_DOSILICON=y
CONFIG_SPI_NAND_ESMT=y
CONFIG_SPI_NAND_XTX=y
CONFIG_SPI_NAND_HYF=y
CONFIG_SPI_NAND_FMSH=y
CONFIG_SPI_NAND_FORESEE=y
CONFIG_SPI_NAND_BIWIN=y
```

<!-- Chinese PDF p.39 -->

Проверьте размер IDB из spl.bin и ddr.bin. Выполните в каталоге U-Boot, заменив ddr.bin целевой прошивкой:

<!-- Chinese PDF p.40 -->

```text
./tools/mkimage -n rv1126 -T rksd -d ./../rkbin/bin/rv11/rv1126_ddr_924MHz_v1.05.bin:./spl/u-boot-spl.bin rv1126_idb1.bin
```

<!-- Chinese PDF p.40 -->

Компоненты, для которых проблема известна источнику:

<!-- Chinese PDF p.40 -->

| Маркировка компонента | ID0 | ID1 |
| --- | --- | --- |
| MT29F2G01ABA, XT26G02E, F50L2G41XA | 2C | 24 |
| DS35Q2GA-IB | E5 | 72 |
| DS35M2GA-IB | E5 | 22 |
| FM25S02A | A1 | E5 |
| DS35Q2GB-IB | E5 | F2 |
| DS35Q4GM | E5 | F4 |

<!-- Chinese PDF p.40 -->

BOOTROM не читает данные нечётных блоков 1, 3, 5, … этих компонентов. Блок — 128KB; IDB больше 128KB пересекает границу, часть данных недоступна BOOTROM и загрузка не работает.

<!-- Chinese PDF p.40 -->

### 8.2 Выбор SPI NAND 1.8V

<!-- Chinese PDF p.40 -->

Компоненты 1.8V обычно доступны у изготовителей. Источник сообщает о поддержке семи компаний; актуальность определяет список поддержки, а не это историческое число. После правильной настройки домена и питания I/O драйвер совместим с вариантом 3.3V без особой конфигурации:

<!-- Chinese PDF p.41 -->

| Запись источника | Изготовитель | Модель | Ёмкость (bits) | Ёмкость (bytes) | Напряжение | Интерфейс |
| --- | --- | --- | --- | --- | --- | --- |
| 20230705 | XTX | XT26Q04DWSIGA | 4GBits | 512MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | XTX | XT26Q01DWSIGA | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | XTX | XT26Q02DWSIGA | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | FORESEE | F35UQA002G-<br>WWT | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230705 | FORESEE | F35UQA001G-<br>WWT | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20230317 | HYF | HYF1GQ4IDACAE | 1GBits | 128MB | 1.70V-<br>1.98V | SPI<br>NAND |
| 20230317 | HYF | HYF2GQ4IAACAE | 2GBits | 256MB | 1.70V-<br>1.98V | SPI<br>NAND |
| 20230217 | Dosilicon | DS35M12B-IB | 512MBits | 64MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220901 | MXIC | MX35UF1GE4AD-<br>Z4I | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220818 | MXIC | MX35UF4GE4AD-<br>Z4I | 4GBits | 512MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20220818 | MXIC | MX35UF2GE4AD-<br>Z4I | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210918 | GigaDevice | GD5F2GM7REYIGY | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M2GA-IBR | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M1GA-IBR | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210911 | Dosilicon | DS35M1GB-IB | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 20210911 | GigaDevice | GD5F2GQ5REYIG | 2GBits | 256MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 20210911 | GigaDevice | GD5F1GQ5REYIG | 1GBits | 128MB | 1.7V-<br>2.0V | SPI<br>NAND |
| 200701 | Dosilicon | DS35M1GA-IBR | 1GBits | 128MB | 1.65V-<br>1.95V | SPI<br>NAND |
| 200831 | MXIC | MX35UF1GE4AC-<br>Z4I | 1GBits | 128MB | 1.7V-<br>1.95V | SPI<br>NAND |
| 200831 | MXIC | MX35UF2GE4AC-<br>Z4I | 2GBits | 256MB | 1.7V-<br>1.95V | SPI<br>NAND |

<!-- Chinese PDF p.42 -->

### 8.3 Проблема потери питания HYF1GQ4UTXCAE

<!-- Chinese PDF p.42 -->

Образец изготовителя HYF1GQ4UTXCAE не прошёл тест потери питания. Источник связывает это с отсутствием upstream-коррекции HWP_EN для семейства:

<!-- Chinese PDF p.42 -->

```text
commit 72986913fc4ba3e0c1c276aa63e2040ff8290201
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Mon Aug 14 14:52:36 2023 +0800

    mtd: spinand: Enable HWP_EN for skyhigh devices

    HWP_EN must be enabled first before block unlock region is set.

    Change-Id: I6b107d97de48bb2644da865f353d2adace95224e
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.42 -->

### 8.4 Исследование программного ECC SPI NAND

<!-- Chinese PDF p.42 -->

Источник различает исправление и проверку достоверности: программный ECC здесь почти не улучшает коррекцию, но может помочь определить корректность данных; сама схема RK использует встроенный аппаратный ECC.

SPI NAND нужен ECC из-за возможных битовых инверсий NAND. Аппаратный ECC обычно встроен в компонент, иногда в хост (пример источника — HiSilicon). RK по умолчанию не поддерживает SPI NAND без встроенного аппаратного ECC из-за низкой надёжности.

При наличии аппаратного ECC программный мало помогает коррекции: аппаратный отказ обычно означает масштабное повреждение. Однако он может выявлять недостоверные данные при исключительных сбоях пути передачи, например отключении питания, на которые аппаратный ECC не всегда реагирует. Поэтому полезна проверка данных подобно UBIFS.

Для разделов без ФС, например misc, при чтении/записи SPI NAND рассмотрите ECC либо иной эффективный механизм защиты от предельных условий.

<!-- Chinese PDF p.42 -->

### 8.5 Защита BBT SPI NAND во flash

<!-- Chinese PDF p.42 -->

Предпосылка: SDK RK SPI NAND хранит сведения о плохих блоках в BBT; см. соответствующий раздел этого FAQ. Ранняя проверка главным образом использовала первый OOB-байт и magic в конце действительных данных BBT.

<!-- Chinese PDF p.43 -->

Версии патчей — U-Boot:

<!-- Chinese PDF p.43 -->

```text
commit 78cac1dffdc0bd64e47294e41d2432b7760e7186
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Jun 28 20:13:39 2020 +0800

    mtd: nand: Remove bbt option property if scan fail

    Change-Id: Ifb5b500b6ffee551aea5b6aecea629b3d0ea6207
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.43 -->

Ядро:

<!-- Chinese PDF p.43 -->

```text
commit fe246b156492ee509bb1d071c176d324542d3193
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Thu Dec 17 16:05:27 2020 +0800

    drivers: rkflash: Fixed bbt operation calculation error

    Fixes: 008340a82 ("drivers: rkflash: Change to use the api which the oob area available")
    Change-Id: I140aa76a2acb73271ba04b7060030dc06a2353e6
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.43 -->

Оптимизация: нестабильная SPI NAND может разрушить BBT, даже если причина не в логике таблицы. Добавлены меры защиты граничных случаев. Подсистема BBT:

<!-- Chinese PDF p.43 -->

![8.5 Защита BBT SPI NAND во flash: китайский оригинал, стр. 43](/docs/rockchip-storage-faq/assets/cn-p043-figure-01.png)

*8.5 Защита BBT SPI NAND во flash: китайский оригинал, стр. 43*

<!-- Chinese PDF p.43 -->

Дополнительная защита:

<!-- Chinese PDF p.44 -->

- Добавить hash для проверки BBT.
- При полном сканировании format_bbt повторно проверять подозрительные блоки, определённые как плохие.
- При update_bbt читать записанное обратно и проверять; при ошибке стирать избыточные данные.

Инъекция ошибок U-Boot/ядра моделирует сбои стартового сканирования BBT, сканирования всех блоков при форматировании, записи BBT, hash, обратного чтения и его hash. SPL не форматирует BBT и не выполняет разрушительных действий, поэтому там ошибки не внедрялись. По источнику, после стресс-тестов BBT осталась исправна, без ложных плохих блоков.

Патчи оптимизации — U-Boot:

<!-- Chinese PDF p.44 -->

```text
commit 55ef8700b677919efa06f3bfe1dcab3a4554a92d
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Sep 24 20:11:20 2023 +0800

    mtd: nand: bbt: Add mechanisms to protect bad block tables

    1.Add hash check
    2.Add anti-shake mechanism to avoid damaging the bad block tables
    3.Add anti-shake mechanism to optimize the reliability of bad block table

    Change-Id: I6ac9554ae0f642d6a89d21a8f79a2a87d607f993
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.44 -->

Ядро:

<!-- Chinese PDF p.44 -->

```text
commit cc1f433fb9ade372b06e9d62651ed8d719aaac94
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Sun Sep 24 20:24:00 2023 +0800

    drivers: rkflash: Add mechanisms to protect bad block tables

    1.Add hash check
    2.Add anti-shake mechanism to avoid damaging the bad block tables
    3.Add anti-shake mechanism to optimize the reliability of bad block table

    Change-Id: I888ceba54e5bbc55283850316e27560c484a9cf5
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.44 -->

### 8.6 Программатор SPI NAND поддерживает мастер, но не единый полный экспорт

<!-- Chinese PDF p.44 -->

Источник рекомендует создавать образы через RK programmer_image_tool, а не с мастер-устройства. Заголовок допускает мастер, но текст запрещает единый полный образ SPI NAND, поскольку Linux MTD/UBIFS управляют плохими блоками по разделам. Противоречие заголовка и текста сохранено для проверки.

<!-- Chinese PDF p.45 -->

Пример: раздел A — 8MB с одним плохим блоком 128KB; B тоже 8MB. Образы A и B — по 7MB. При объединении 7MB_A + 1MB заполнения + 7MB_B пропуск плохого блока сдвигает начало действительных данных B на 8MB + 128KB, тогда как A начинается с 0. ПО по-прежнему считает началом B адрес 8MB, и образ смещён.

Правильно: отдельно записать A по адресу 0 и B по 8MB, начиная от каждого раздела с пропуском плохих блоков. ПО читает образы от начала разделов по той же стратегии. Запись и чтение совпадают.

<!-- Chinese PDF p.45 -->

### 8.7 Образы SDK SPI NAND содержат data без OOB

<!-- Chinese PDF p.45 -->

Причина: контроллер SPI flash не имеет встроенного ECC и зависит от ECC компонента.

<!-- Chinese PDF p.45 -->

![8.7 Образы SDK SPI NAND содержат data без OOB: китайский оригинал, стр. 45](/docs/rockchip-storage-faq/assets/cn-p045-figure-01.png)

*8.7 Образы SDK SPI NAND содержат data без OOB: китайский оригинал, стр. 45*

<!-- Chinese PDF p.46 -->

### 8.8 Оптимизация скорости rkflash SPI NAND в ядре

<!-- Chinese PDF p.46 -->

Большие объёмы I/O действительно нагружают CPU. Некоторое снижение скорости flash может улучшить планирование CPU.

<!-- Chinese PDF p.46 -->

```text
diff --git a/drivers/rkflash/sfc_nand.c b/drivers/rkflash/sfc_nand.c
index 0bc1c6b43fd7..ca190c115ad3 100644
--- a/drivers/rkflash/sfc_nand.c
+++ b/drivers/rkflash/sfc_nand.c
@@ -274,7 +274,7 @@ static int sfc_nand_wait_busy(u8 *data, int timeout)

        *data = 0;

-       for (i = 0; i < timeout; i++) {
+       for (i = 0; i < timeout; i+= 20) {
                ret = sfc_nand_read_feature(0xC0, &status);

                if (ret != SFC_OK)
@@ -285,7 +285,7 @@ static int sfc_nand_wait_busy(u8 *data, int timeout)
                if (!(status & (1 << 0)))
                        return SFC_OK;

-               sfc_delay(1);
+               usleep_range(20, 30);
        }

        return SFC_NAND_WAIT_TIME_OUT;
```

<!-- Chinese PDF p.46 -->

### 8.9 Сведения SPI NAND и плохие блоки в MTD ядра

<!-- Chinese PDF p.46 -->

Сведения о плохих блоках:

<!-- Chinese PDF p.46 -->

```text
cat /sys/devices/virtual/mtd/mtd5/bad_blocks
```

<!-- Chinese PDF p.46 -->

Другие сведения:

<!-- Chinese PDF p.46 -->

```text
# ls /sys/devices/virtual/mtd/mtd4/
bad_blocks         ecc_step_size      numeraseregions    subsystem/
bbt_blocks         ecc_strength       offset             type
bitflip_threshold  erasesize          oobsize            uevent
corrected_bits     flags              power/             writesize
dev                mtdblock4/         size
ecc_failures       name               subpagesize
```

<!-- Chinese PDF p.46 -->

### 8.10 Ошибка записи SPI NAND MTD в ядре

<!-- Chinese PDF p.46 -->

Проверьте, относится ли компонент к моделям оригинала:

- S35ML01G3, ANV1GCP0CLG, HYF1GQ4UTXCAE, YX25G1E.
- S35ML02G3, ANV2GCP0CLG, HYF2GQ4UTXCAE, YX25G2E.

При извлечении две строки слились; имена моделей не изменены.

<!-- Chinese PDF p.47 -->

У этих компонентов есть проблема команды 84h. Добавлен патч, изготовителю направлен запрос на исправление документации.

<!-- Chinese PDF p.47 -->

```text
commit 328145662f6d6154fbf4329a0d53f9c152673648
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Fri Jul 7 12:06:40 2023 +0800

    mtd: spinand: skyhigh: The vendor requires the devices to be patched

    1.Double OIP=0 after page 13H
    2.The nand flash does not support 84H and 34H command

    Change-Id: Ie805f42a36e1a864115988087bdc43592cc94ded
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.47 -->

### 8.11 Автомонтирование корня для MTD SPI NAND и EMMC

<!-- Chinese PDF p.47 -->

SDK по умолчанию этого не поддерживает. Для совместимости EMMC/SPI NAND определите тип в U-Boot и передайте соответствующий root через bootargs ядра.

<!-- Chinese PDF p.47 -->

### 8.12 Обновление по ENV-разметке с IDB SPI NAND со страницей 4K

<!-- Chinese PDF p.47 -->

Для компонентов со страницами 4KB создайте idblock для обновления специальной командой:

<!-- Chinese PDF p.47 -->

```text
./tools/programmer_image_tool -i rv1106_download_v1.14.108.bin -b 128 -p 4 -2 -t spinand -o ./
```

<!-- Chinese PDF p.47 -->

Результат: idblock.img. Описанный источником новый SDK создаёт его по умолчанию.

<!-- Chinese PDF p.47 -->

### 8.13 Быстрый старт SPI NAND не создаёт BBT ядра

<!-- Chinese PDF p.47 -->

Проблема/оптимизация чтения страницы SPI NAND: быстрый путь SPL обходит U-Boot, и создание BBT в ядре несовместимо либо отсутствует. См. патч:

<!-- Chinese PDF p.47 -->

```text
commit c7270465b2a699211dfd8ad3c2f882f22247c40c
Author: Jon Lin <jon.lin@rock-chips.com>
Date:   Thu Dec 17 16:05:27 2020 +0800

    drivers: rkflash: Fixed bbt operation calculation error

    Fixes: 008340a82 ("drivers: rkflash: Change to use the api which the oob area available")
    Change-Id: I140aa76a2acb73271ba04b7060030dc06a2353e6
    Signed-off-by: Jon Lin <jon.lin@rock-chips.com>
```

<!-- Chinese PDF p.48 -->

### 8.14 Пользовательское обновление MTD не работает на разделе с плохими блоками

<!-- Chinese PDF p.48 -->

Причина: запись по случайным смещениям внутри раздела. Например, образ около 2M записывают nandwrite порциями 512K, каждый раз увеличивая смещение на 512K. При плохом блоке чтение MTD в U-Boot может отказать. Пишите образ одной операцией либо реализуйте управление плохими блоками.

Почему: раздельные записи без выравнивания на начало раздела не учитывают пропуски. Если блок 8 плохой, write 7_8 фактически пишет 7_9. Следующий write 9 снова программирует блок 9, вызывая повторную запись и ECC fail при чтении.

<!-- Chinese PDF p.48 -->

### 8.15 Поддержка continuous read SPI NAND и быстрого старта

<!-- Chinese PDF p.48 -->

#### 8.15.1 Введение

<!-- Chinese PDF p.48 -->

Winbond (один раз в оригинале “Winbound”) реализует быстрое чтение отдельных SPI NAND. W25N01GV поддерживает замену плохих блоков для настроенной области, continuous read через границы страниц при непрерывном такте и SDR continuous read 104MHz с указанной скоростью 52MB/s.

Быстрая схема Winbond W25N01XX CONT_READ использует это для ускорения ROM, SPL и фоновой асинхронной загрузки выбранной прошивки SPL через FSPI DMA. Это возможности и скорости источника, не результаты ArmSoM.

<!-- Chinese PDF p.48 -->

#### 8.15.2 Конфигурация

<!-- Chinese PDF p.48 -->

Пример rkbin INI для RV1103B: RV1103BMINIALL_SPI_NAND_W25N01XX_TB.ini.

Настройка U-Boot:

<!-- Chinese PDF p.48 -->

```text
CONFIG_SPI_NAND_WINBOND_CONT_READ
```

<!-- Chinese PDF p.48 -->

## 9. Проблемы SPI NOR

<!-- Chinese PDF p.49 -->

### 9.1 Выбор SPI NOR 1.8V от 256Mbits

<!-- Chinese PDF p.49 -->

Компоненты оригинала:

- MX25U25645GZ4I-00: 256MBits, 32MB.
- MX25U51245GZ4I00: 512Mbits, 64MB.
- GD25LQ256CW1G: 256MBits, 32MB.
- W25Q256JWEQ: 256MBits, 32MB.
- XTX XT25W512BSFHGU: 512Mbit, 1.65–3.6V, в источнике не проверен.
- Dosilicon DS25M4BA-1AIB1: 256Mb, не проверен.
- Dosilicon DS25M4BA-1AIB4: 256Mb, не проверен.

Уточните у изготовителей соответствие требованиям. Для не проверенных RK компонентов можно предоставить образцы. Поддержку определяет актуальный список flash; перечень не является квалификацией ArmSoM.

<!-- Chinese PDF p.49 -->

### 9.2 rkflash SPI NOR и открытая MTD ядра 4.4 и ранее

<!-- Chinese PDF p.49 -->

Старые открытые подсистемы ядра поддерживают мало компонентов и имеют старую архитектуру MTD, поэтому RK их не адаптировала. Решение rkflash поддерживает больше SPI flash.

<!-- Chinese PDF p.49 -->

### 9.3 Команды sf и интерфейсы U-Boot SPI NOR MTD

<!-- Chinese PDF p.49 -->

U-Boot RK SDK использует DM_SPI_FLASH. В spi_flash.h есть инициализация spi_find_bus_and_cs и spi_flash_probe_bus_cs, а также spi_flash_read и другие функции чтения/записи. Применение см. в cmd/sf.c и команде cmd_sf.

Пример патча RV1106:

<!-- Chinese PDF p.49 -->

```text
diff --git a/arch/arm/dts/rv1106-u-boot.dtsi b/arch/arm/dts/rv1106-u-boot.dtsi
index b0632e9ce9..03bc933125 100644
--- a/arch/arm/dts/rv1106-u-boot.dtsi
+++ b/arch/arm/dts/rv1106-u-boot.dtsi
@@ -167,6 +167,7 @@
                spi-tx-bus-width = <1>;
                spi-rx-bus-width = <4>;
                spi-max-frequency = <80000000>;
+               status = "disabled";
        };

        spi_nor: flash@1 {
diff --git a/configs/rv1106_defconfig b/configs/rv1106_defconfig
index 9b20bcfb65..b1f3933a11 100644
--- a/configs/rv1106_defconfig
+++ b/configs/rv1106_defconfig
@@ -148,3 +148,4 @@ CONFIG_SPL_LZMA=y
 CONFIG_SPL_GZIP=y
 CONFIG_ERRNO_STR=y
 # CONFIG_EFI_LOADER is not set
+CONFIG_CMD_SF=y
```

<!-- Chinese PDF p.50 -->

Команды:

<!-- Chinese PDF p.50 -->

```text
=> sf probe 2:0 10000000 3
SF: Detected sfc_nor with page size 256 Bytes, erase size 4 KiB, total 16 MiB

=> sf read 0x400000 0x200 0x200
device 0 offset 0x200, size 0x200
SF: 512 bytes @ 0x200 Read: OK
```

<!-- Chinese PDF p.50 -->

### 9.4 Медленная регистрация mtdparts SPI NOR MTD

<!-- Chinese PDF p.50 -->

Каждый раздел MTD — отдельное устройство. При включённом mtdblock дополнительно регистрируются блочные устройства, что увеличивает время. Пример add_mtd_device из источника:

- device_register: 0.15ms.
- mtd_nvmem_add: 0.08ms.
- device_create: 0.12ms.
- mtdpstore_notify_add: 0.5ms.

<!-- Chinese PDF p.50 -->

### 9.5 Медленное стирание/запись SPI NOR MTD в U-Boot

<!-- Chinese PDF p.50 -->

Если JFFS2 в U-Boot не используется, отключите SPI_FLASH_USE_4K_SECTORS и используйте стирание по 64KB.

<!-- Chinese PDF p.50 -->

### 9.6 Однолинейная и четырёхлинейная SPI NOR: скорость

<!-- Chinese PDF p.50 -->

Условия теста: такт I/O 80MHz.

<!-- Chinese PDF p.50 -->

|   |   |   |   |
| --- | --- | --- | --- |
| Использование I/O | io0~3 двунаправленные | io0~1 двунаправленные | io0 приём, io1 передача |
| Чтение ФС | 35MB/s | 19MB/s | 11MB/s |
| Стирание/запись ФС | 150KB/s | 150KB/s | 150KB/s |

<!-- Chinese PDF p.50 -->

«Однолинейная» SPI flash не означает буквально единственный физический I/O; речь об одной однонаправленной передаче.

<!-- Chinese PDF p.51 -->

### 9.7 Сбои SPI NOR под нагрузкой на высокой скорости

<!-- Chinese PDF p.51 -->

Пример компонента с рейтингом 104MHz: отдельные характеристики ограничены 83MHz, испытания 80MHz нестабильны.

Цель — пройти стресс-тест I/O 80MHz. Сначала измерить сигналы ядра clk, d0, d1 и cs, желательно одновременно, и выявить явные дефекты качества. Если их нет:

- Тест A: снизить проблемный компонент до 60MHz и выполнять автоматические перезагрузки при высокой/низкой температуре.
- Тест B: другой компонент изготовителя с рейтингом около 100MHz, такие же перезагрузки как контроль платы.

Интерпретация:

- A и B не проходят: вероятно, скорость ограничивает аппаратная часть платы; продолжить проверку сигналов.
- Оба проходят, но штатные 80MHz нет: источник подозревает завышенный рейтинг исходного компонента.
- A не проходит, B проходит: снизить A до 40MHz. Если проходит, источник подозревает сильно завышенный рейтинг либо плохую совместимость.

Дальнейшие действия определяют результаты. Если компонент выбран и работает приемлемо, оценить достаточность 60MHz для изделия. Это гипотезы диагностики оригинала, а не подтверждённая оценка качества изготовителей.

<!-- Chinese PDF p.51 -->

### 9.8 SPI NOR AUTO_MERGE

<!-- Chinese PDF p.51 -->

#### 9.8.1 Введение

<!-- Chinese PDF p.51 -->

Источник описывает ситуацию, когда два SPI NOR по 16MB заметно дешевле одного 32MB. AUTO_MERGE объединяет два компонента в один логический для упрощения внедрения, разработки и сопровождения:

- В DT одно устройство NOR.
- Подсистема обнаруживает одно AUTO_MERGE NOR с двумя подустройствами.
- Пользовательский уровень видит одно NOR.

Сравнение цен — исторический контекст источника, не актуальное предложение.

<!-- Chinese PDF p.52 -->

#### 9.8.2 Ограничения

<!-- Chinese PDF p.52 -->

Ограничения:

- AUTO_MERGE объединяет только два одинаковых SPI NOR, требуется близкая топология PCB.
- Один компонент также поддерживается, но GPIO CS1N выводит сигналы при обнаружении.
- Область фоновой асинхронной FSPI DMA загрузки SPL не должна пересекать физическую границу NOR; пример — preload для ramdisk быстрого старта в DTS.
- Открытый usbplug можно пересобрать, но он поддерживает только USB. Для UART нужны закрытые download_xxxcs1.bin и usbplug_xxxcs1.bin с самостоятельной упаковкой.

<!-- Chinese PDF p.52 -->

#### 9.8.3 Конфигурация

<!-- Chinese PDF p.52 -->

Пример rkbin INI RV1103B: RKBOOT/RV1103BMINIALL_AUTO_MERGE.ini.

Параметры сборки usbplug/SPL/U-Boot:

<!-- Chinese PDF p.52 -->

```text
CONFIG_SPI_FLASH_AUTO_MERGE=y
CONFIG_SPL_GPIO_SUPPORT=y
```

<!-- Chinese PDF p.52 -->

Параметры DTS usbplug/SPL/U-Boot:

<!-- Chinese PDF p.52 -->

```text
diff --git a/arch/arm/dts/rv1103b-u-boot.dtsi b/arch/arm/dts/rv1103b-u-boot.dtsi
index a31355a..88ceb85 100644
--- a/arch/arm/dts/rv1103b-u-boot.dtsi
+++ b/arch/arm/dts/rv1103b-u-boot.dtsi
@@ -67,12 +67,12 @@
 };

 &gpio1 {
-   u-boot,dm-pre-reloc;
+   u-boot,dm-spl;
    status = "okay";
 };

 &gpio2 {
-   u-boot,dm-pre-reloc;
+   u-boot,dm-spl;
    status = "okay";
 };

@@ -92,6 +92,7 @@
 };

 &sfc {
+   sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio2 RK_PA6 GPIO_ACTIVE_LOW>;
    u-boot,dm-spl;
    status = "okay";
    };
```

<!-- Chinese PDF p.52 -->

Параметр сборки ядра:

<!-- Chinese PDF p.53 -->

```text
CONFIG_MTD_SPI_NOR_AUTO_MERGE=y
```

<!-- Chinese PDF p.53 -->

Пример DTS ядра:

<!-- Chinese PDF p.53 -->

```text
&fspi0 {
    sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
    status = "okay";

    flash@0 {
        compatible = "jedec,spi-nor";
        reg = <0>;
        spi-max-frequency = <75000000>;
        spi-rx-bus-width = <4>;
        spi-tx-bus-width = <1>;
    };
};

&pinctrl {
    fspi {
        fspi_cs0n: fspi-cs0n {
            rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
        };
        fspi_cs1n: fspi-cs1n {
            rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};
```

<!-- Chinese PDF p.53 -->

#### 9.8.4 Настройка CSN1

<!-- Chinese PDF p.53 -->

Используйте рекомендованный RK вывод CSN1 GPIO. Схемы получите у ответственного аппаратного инженера. Пример DTS usbplug/SPL/U-Boot: изменить RV1103B GPIO1A6 на GPIO1A7:

<!-- Chinese PDF p.53 -->

```text
diff --git a/arch/arm/dts/rv1103b-u-boot.dtsi b/arch/arm/dts/rv1103b-u-boot.dtsi
index d346eae20bf..86265f76304 100644
--- a/arch/arm/dts/rv1103b-u-boot.dtsi
+++ b/arch/arm/dts/rv1103b-u-boot.dtsi
@@ -92,7 +92,7 @@
 };

 &sfc {
-       sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
+       sfc-cs-gpios= <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA7 GPIO_ACTIVE_LOW>;
        u-boot,dm-spl;
        status = "okay";

diff --git a/arch/arm/mach-rockchip/rv1103b/rv1103b.c b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
index 7353528afdd..8e30240076e 100644
--- a/arch/arm/mach-rockchip/rv1103b/rv1103b.c
+++ b/arch/arm/mach-rockchip/rv1103b/rv1103b.c
@@ -252,9 +252,9 @@ int arch_cpu_init(void)
        writel(0x00000000, USBPHY_APB_BASE + USBPHY_FSLS_DIFF_RECEIVER);

 #ifdef CONFIG_SPI_FLASH_AUTO_MERGE
-       /* gpio1a5/gpio1a6 cs-gpio */
+       /* gpio1a5/gpio1a7 cs-gpio */
        writel(0x00F00000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_0);
-       writel(0x0F000000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_1);
+       writel(0xF0000000, GPIO1_IOC_BASE + GPIO1A_IOMUX_SEL_1_1);
 #endif
 #endif
```

<!-- Chinese PDF p.54 -->

Пример ядра: изменить RV1103B GPIO1A6 на GPIO1A7:

<!-- Chinese PDF p.54 -->

```text
diff --git a/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts b/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
index ae3fa579b05f..00bf8008e107 100644
--- a/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
+++ b/arch/arm/boot/dts/rv1103b-evb1-v10-spi-nor-auto-merge.dts
@@ -14,7 +14,7 @@ / {
 };

 &fspi0 {
-       sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA6 GPIO_ACTIVE_LOW>;
+       sfc-cs-gpios = <&gpio1 RK_PA5 GPIO_ACTIVE_LOW>, <&gpio1 RK_PA7 GPIO_ACTIVE_LOW>;
        pinctrl-names = "default";
        pinctrl-0 = <&fspi_cs0n &fspi_cs1n>;
        status = "okay";
@@ -34,7 +34,7 @@ fspi_cs0n: fspi-cs0n {
                        rockchip,pins = <1 RK_PA5 RK_FUNC_GPIO &pcfg_pull_up>;
                };
                fspi_cs1n: fspi-cs1n {
-                       rockchip,pins = <1 RK_PA6 RK_FUNC_GPIO &pcfg_pull_up>;
+                       rockchip,pins = <1 RK_PA7 RK_FUNC_GPIO &pcfg_pull_up>;
                };
        };
 };
```

<!-- Chinese PDF p.54 -->

## 10. Проблемы инструментов

<!-- Chinese PDF p.54 -->

### 10.1 Создание отдельного GPT-образа через upgrade_tool

<!-- Chinese PDF p.54 -->

Используйте Linux upgrade tool v1.67 и выше.

<!-- Chinese PDF p.54 -->

```text
./upgrade_tool gpt parameter.txt  gpt.img
```

<!-- Chinese PDF p.55 -->

### 10.2 Распаковка Loader через boot_merger

<!-- Chinese PDF p.55 -->

```text
./tools/boot_merger unpack -i rk356x_spl_loader_v1.01.102-528M-1115.bin -o .
```

<!-- Chinese PDF p.55 -->

### 10.3 LoaderToDDR инструмента Android

<!-- Chinese PDF p.55 -->

Поле Loader инструмента имеет два варианта:

<!-- Chinese PDF p.55 -->

**1.** loader: запускает обновление и извлекает idb.img из образа Loader для записи.

<!-- Chinese PDF p.55 -->

**2.** loaderToDDR: только запускает обновление.

<!-- Chinese PDF p.55 -->

### 10.4 Введение в idb_bootconfig

<!-- Chinese PDF p.55 -->

ROM по умолчанию загружает SPI NOR по одной линии. bootconfig в заголовке упакованного IDB ускоряет загрузку, выбирая четыре линии. Скрипт idb_bootconfig добавляет эту конфигурацию ускорения NOR в IDB. Параметры различаются по компонентам, поэтому источник рекомендует добавлять их через idb_bootconfig, а не фиксированным заполнением готового образа; иначе каждой модели нужны собственные параметры.

{% endraw %}
