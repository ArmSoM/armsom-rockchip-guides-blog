---
title: "Rockchip RGA FAQ: версии, производительность, обработка изображений и диагностика"
description: "Rockchip RGA FAQ: версии, производительность, обработка изображений и диагностика — V1.1.3"
excerpt: "Rockchip RGA FAQ: версии, производительность, обработка изображений и диагностика — V1.1.3"
translation_key: "130-rockchip-rga-faq"
slug: "130-rockchip-rga-faq"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["ArmSoM", "Rockchip", "RGA", "librga", "Linux"]
---

{% raw %}

Источник RK-PC-YF-404 V1.1.3: RGA1/RGA2/RGA3, librga и драйверы RGA. Ядро, SDK/BSP и ограничения функций сверяйте с таблицами версий и реальным чипом; универсальная совместимость ArmSoM не заявляется. Это справочник платформы без аппаратной проверки ArmSoM. Измерения RK3566 и другие данные источника не являются тестами ArmSoM. Китайская статья использует китайские рисунки, EN/RU/DE — английские. Команды только документированы, не выполнялись. check/slt, изменения частоты, кэша и отображения памяти могут влиять на систему и требуют оценки разработчика после проверки платформы.

[ArmSoM Docs](https://docs.armsom.org/) · [librga](https://github.com/airockchip/librga)

<!-- en PDF p.4 -->

## 1. Обзор

<!-- en PDF p.4 -->

Для драйвера RGA и пользовательского API librga здесь собраны частые проблемы аппаратного ускорения отрисовки OSD (On Screen Display) и GUI (Graphics User Interface) на платформе RK.

<!-- en PDF p.5 -->

## 2. Версии

<!-- en PDF p.5 -->

### 2.1 Версия оборудования

<!-- en PDF p.5 -->

Аппаратные версии RGA: RGA1, RGA2 и RGA3. Сведения о платформах, функциях и ограничениях приведены в разделе Introductions документа Rockchip_Developer_Guide_RGA_EN.

<!-- en PDF p.5 -->

### 2.2 Версия ПО

<!-- en PDF p.5 -->

Ниже приведены распространённые способы проверки версии. Подробности — в главе Release Notes документа Rockchip_Developer_Guide_RGA_EN.

<!-- en PDF p.5 -->

#### 2.2.1 librga

<!-- en PDF p.5 -->

Версия API состоит из major, minor, revision и build; четыре уровня соответствуют разной степени функциональных изменений. Проверка версии:

<!-- en PDF p.5 -->

```text
strings librga.so |grep rga_api |grep version
```

<!-- en PDF p.5 -->

Обновление версии. Если версия не соответствует требованиям, исходники или готовые библиотеки доступны по адресам:

- GitHub: https://github.com/airockchip/librga
- Zbox Cloud: https://console.zbox.filez.com/l/fuGojC (код: rkrga).

<!-- en PDF p.5 -->

Драйвер RGA. Его версия также состоит из major, minor, revision и build, соответствующих разным уровням обновлений функций. В выпущенном SDK HAL и драйвер обычно согласованы; librga проверяет совместимость самостоятельно. Если при отдельном обновлении librga появляется приведённая ошибка, обновите драйвер до соответствующей версии. Проверка версии:

<!-- en PDF p.6 -->

Пути debug-узлов зависят от чипа; обычно используются следующие два пути.

<!-- en PDF p.6 -->

```text
cat /sys/kernel/debug/rkrga/driver_version
cat /proc/rkrga/driver_version
```

<!-- en PDF p.6 -->

Обновление: если версия не соответствует требованиям, исходники или готовые библиотеки можно получить через Zbox Cloud: https://console.zbox.filez.com/l/7oOrKO (код: rkrga).

<!-- en PDF p.6 -->

#### 2.2.2 Соответствие версий

<!-- en PDF p.6 -->

Перед использованием RGA убедитесь, что среда работоспособна. Таблица показывает соответствие распространённых версий librga и драйверов.

<!-- en PDF p.6 -->

| Версия librga | Соответствующий драйвер | Оборудование |
| --- | --- | --- |
| без версии | Драйвер SDK | RGA1、RGA2 |
| 1.0.0 ~ 1.3.2 | RGA Device Driver(kernel - 4.4 и выше)<br>RGA2 Device Driver(без версии or v2.1.0) | RGA1、RGA2 |
| > 1.4.0 | RGA multicore Device Driver(v1.2.0 и выше) | RGA2、RGA3 |
| > 1.9.0 | RGA Device Driver(kernel-4.4 и выше)<br>RGA2 Device Driver(без версии or v2.1.0)<br>RGA multicore Device Driver(v1.2.0 и выше) | RGA1、RGA2、RGA3 |

<!-- en PDF p.6 -->

Версии в выпущенном SDK обычно согласованы. Если приложение требует более новую librga.so, пакет обновления RGA доступен по ссылке https://console.zbox.filez.com/l/mu2SOR (код: rkrga).

- update-to-MULTI_RGA: для RGA Device Driver или RGA2 Device Driver; обновляет до RGA multicore Device Driver и соответствующей librga.
- MUTIL_RGA: для RGA multicore Device Driver; обновляет драйвер и соответствующую librga.
- RGA2: для RGA2 Device Driver; обновляет драйвер и соответствующую librga.
- RGA1:

<!-- en PDF p.7 -->

Если исходный драйвер — RGA Device Driver, этот пакет обновляет его и соответствующую librga.

<!-- en PDF p.8 -->

## 3. Отладка

<!-- en PDF p.8 -->

### 3.1 Журналы HAL

<!-- en PDF p.8 -->

#### 3.1.1 Управление журналом

<!-- en PDF p.8 -->

Android. Свойства Android позволяют управлять выводом HAL-журнала librga. Включение:

<!-- en PDF p.8 -->

```text
setprop vendor.rga.log 1
logcat -s librga
```

<!-- en PDF p.8 -->

Уровни журнала: полный вывод (0), DEFAULT (1), DEBUG (3), INFO (4), WRANING (5), ERROR (6). Настройка:

<!-- en PDF p.8 -->

```text
setprop vendor.rga.log_level 6
```

<!-- en PDF p.8 -->

Linux. Начиная с librga 1.9.0 вывод HAL-журнала включается/отключается переменными окружения. Включение:

<!-- en PDF p.8 -->

```text
export ROCKCHIP_RGA_LOG=1
```

<!-- en PDF p.8 -->

Уровни журнала: полный вывод (0), DEFAULT (1), DEBUG (3), INFO (4), WRANING (5), ERROR (6). Настройка:

<!-- en PDF p.8 -->

```text
export ROCKCHIP_RGA_LOG_LEVEL=6
```

<!-- en PDF p.8 -->

#### 3.1.2 Описание журнала

<!-- en PDF p.8 -->

Журнал инициализации. При первом вызове librga в процессе создаётся singleton и выводится информация, включая текущую версию API.

<!-- en PDF p.9 -->

```text
E rockchiprga: rga_api version 1.9.0_[0]
```

<!-- en PDF p.9 -->

При несовпадении версий драйвера и librga выводится соответствующая ошибка. Для старого драйвера включается режим совместимости и при инициализации singleton появляется следующий журнал. Можно обновить драйвер до указанной версии либо продолжить в режиме совместимости.

<!-- en PDF p.9 -->

```text
librga fail to get driver version! Compatibility mode will be enabled.

29 im2d_rga_impl rga_version_below_minimun_range_user_driver(310): The driver may be
compatible, but it is best to update the driver to version 1.2.4. You can try to update the
SDK or update the <SDK>/kernel/drivers/video/rockchip/rga3 directory individually. current
version: librga 1.8.5, driver .
```

<!-- en PDF p.9 -->

При слишком старой librga некоторые ошибки Invalid parameters возвращаются через imStrError(); это указывает на необходимость обновления librga.

<!-- en PDF p.9 -->

```text
Invalid parameters: invaild GraphicBuffer, can not get fd and virtual address,
```

<!-- en PDF p.9 -->

Рабочий журнал

<!-- en PDF p.9 -->

```text
D librga  : <<<<-------- print rgaLog -------->>>>                              //The parameters passed to librga are printed as follows.
D librga  : src->hnd = 0x0 , dst->hnd = 0x0 , src1->hnd = 0x0                   //The handle passed in by the three channels (src、src1、dst).
D librga  : src: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431ed6040         //Parameters passed in src channel, representing DMA_FD, physical address and virtual address respectively.
D librga  : dst: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431b4f040         //Parameters passed in dst channel, representing DMA_FD, physical address, and virtual address respectively.
D librga  : src: Fd = -01 , buf = 0xb400007431ed6040, mmuFlag = 1, mmuType = 0  //The src channel configures the value for the type of memory passed and whether or not MMU is enabled, where the HAL selects the virtual address to pass into the driver.
D librga  : dst: Fd = -01 , buf = 0xb400007431b4f040, mmuFlag = 1, mmuType = 0  //The dst channel configures the value for the type of memory passed and whether or not MMU is enabled, where HAL selects the virtual address to pass in the driver.
E librga  : blend = 0 , perpixelAlpha = 1                                       //Blending mode and whether the image format includes an Alpha value.
D librga  : scaleMode = 0 , stretch = 0;                                        //scale mode (RGA1).
E librga  : rgaVersion = 3.200000  , ditherEn =0                                //Hardware version, Y4 Dither enabled.
D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0                    //MMU enable flag, rotation mode.
D librga  : <<<<-------- rgaReg -------->>>>                                    //Parameters configuration of the driver are printed as follows.
E librga  : render_mode=0 rotate_mode=0                                         //RGA rendering mode, rotation mode.
E librga  : src:[0,b400007431ed6040,b400007431fb7040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of src channel.
E librga  : dst:[0,b400007431b4f040,b400007431c30040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of dst channel.
E librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0                        //Memory, image parameters, format information of pat/src1 channel. This channel is not used in current mode, therefore the parameters are set to 0. //The following are some of the parameters that developers usually don't have to care about, which is to configure for librga different modes of the driver.
E librga  : ROP:[0,0,0],LUT[0]                                                  //ROP and LUT configuration.
E librga  : color:[0,0,0,0,0]                                                   //Colorkey configuration（max color, min color）, color-filling configuration (foreground color, background color, color-filling).
E librga  : MMU:[1,0,80000521]                                                  //MMU configuration.
E librga  : mode[0,0,0,0]                                                       //Palette、 csc、colorkey configuration.
E librga  : Full CSC : en[0]                                                    //Full csc enabled flag.
E librga  : gr_color_x [0, 0, 0]                                                // Color-filling configuration, corresponding the value of R, G, B.
```

<!-- en PDF p.10 -->

### 3.2 Отладочные узлы драйвера

<!-- en PDF p.10 -->

#### 3.2.1 Управление журналом

<!-- en PDF p.10 -->

Адрес отладочного узла. Конфигурация ядра зависит от SDK. Узел RGA обычно находится в одном или обоих каталогах ниже. Для ядра с включённой по умолчанию CONFIG_ROCKCHIP_RGA_DEBUG_FS:

<!-- en PDF p.10 -->

```text
/sys/kernel/debug
```

<!-- en PDF p.10 -->

Для ядра с включённой ROCKCHIP_RGA_PROC_FS:

<!-- en PDF p.10 -->

```text
/proc
```

<!-- en PDF p.10 -->

Помимо настроек по умолчанию путь RGA debug можно настроить под проект изменением параметров сборки ядра.

<!-- en PDF p.11 -->

#### 3.2.2 Имена отладочных узлов

<!-- en PDF p.11 -->

Имена узлов различаются у разных драйверов. В обновляемых драйверах имя унифицируется как rkrga; rgax_debug устарело.

<!-- en PDF p.11 -->

| Имя драйвера | Путь узла |
| --- | --- |
| RGA Device Driver | rga_debug |
| RGA2 Device Driver(без версии) | rga2_debug |
| RGA2 Device Driver(v2.1.0) | rkrga |
| RGA multicore Device Driver | rkrga |

<!-- en PDF p.11 -->

#### 3.2.3 Функции отладочных узлов

<!-- en PDF p.11 -->

##### 3.2.3.1 Обзор

<!-- en PDF p.11 -->

rga_debug/rga2_debug поддерживают только включение/отключение рабочего журнала. rkrga также поддерживает запрос нагрузки, версии, аппаратной информации и состояния менеджера памяти/задач.

<!-- en PDF p.11 -->

##### 3.2.3.2 Рабочий журнал

<!-- en PDF p.11 -->

###### 3.2.3.2.1 Управление журналом

Имя отладочного узла

<!-- en PDF p.11 -->

| Имя драйвера | Путь узла |
| --- | --- |
| RGA Device Driver | rga_debug/rga |
| RGA2 Device Driver(без версии) | rga2_debug/rga2 |
| RGA2 Device Driver(v2.1.0) | rkrga/debug |
| RGA multicore Device Driver | rkrga/debug |

<!-- en PDF p.11 -->

Описание отладки

<!-- en PDF p.12 -->

Управление журналом одинаково для разных версий драйвера: операции выполняются над узлами rga/rga2/debug. Например, для RGA multicore Device Driver описание функций читается командой cat соответствующего узла:

<!-- en PDF p.12 -->

```text
/# cd /sys/kerne/debug/rkrga/
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
```

<!-- en PDF p.12 -->

- echo reg > debug: переключает вывод конфигурации регистров RGA.
- echo msg > debug: переключает вывод параметров, переданных в драйвер верхним уровнем.
- echo time > debug: переключает вывод времени каждого вызова RGA.
- echo check > debug: переключает внутреннюю проверку, прежде всего памяти и выравнивания. Приведённый журнал означает успешную проверку. Выход памяти за пределы может обрушить ядро; журнал перед сбоем помогает определить проблему src или dst.
- echo stop > debug: переключает рабочее состояние; при включении RGA немедленно возвращается без обработки, для особых случаев.
- echo int > debug: переключает вывод текущих значений регистров прерывания и состояния после входа в обработчик.
- echo slt > debug: запускает внутренний тест SLT оборудования; «rga slt success !» означает успешную проверку.

Переключение отладочного узла:

<!-- en PDF p.13 -->

Команды включения и отключения одинаковы: каждый вызов меняет состояние. Проверяйте его через cat debug либо сообщения «open xxx»/«close xxx». Пример включения msg для RGA multicore Device Driver:

<!-- en PDF p.13 -->

```text
/# cd /sys/kernel/debug/rkrga/
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
/# echo msg > debug
/# cat debug
REG [DIS]
MSG [EN]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
/# echo msg > debug
/# cat debug
REG [DIS]
MSG [DIS]
TIME [DIS]
INT [DIS]
CHECK [DIS]
STOP [DIS]

help:
 'echo reg > debug' to enable/disable register log printing.
 'echo msg > debug' to enable/disable message log printing.
 'echo time > debug' to enable/disable time log printing.
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
'echo stop > debug' to enable/disable stop using hardware
```

<!-- en PDF p.14 -->

Вывод журнала:

<!-- en PDF p.14 -->

```text
/# echo reg > /sys/kerne/debug/rkrga/debug
/# dmesg -c                     //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
/# echo reg > /sys/kernel/debug/rga2_debug/rga2
/# dmesg -c
[ 5096.412419] rga2: close rga2 reg!
```

<!-- en PDF p.14 -->

###### 3.2.3.2.2 Описание журнала

Для диагностики аппаратной работы RGA нужны журналы. После передачи HAL-параметров драйверу следующие сообщения описывают их. Обычно используются msg, reg и time.

Режим msg — RGA Device Driver, RGA2 Device Driver:

<!-- en PDF p.14 -->

```text
rga2: open rga2 test MSG!                               //Open 'msg' log printing.
rga2: cmd is RGA2_GET_VERSION                           //Get version number, which queries hardware version the first time each process calls librga.
rga2: cmd is RGA_BLIT_SYNC                              //Current working mode.
rga2: render_mode:bitblt,bitblit_mode=0,rotate_mode:0   //Render_mode: display calling interface, bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
rga2: src : y=0 uv=b4000072cc8bc040 v=b4000072cc99d040 aw=1280 ah=720 vw=1280 vh=720
xoff=0 yoff=0 format=RGBA8888
                                                        //Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself, xoff、yoff: offset in the x and y directions, format：image format.
rga2: dst : y=0 uv=b4000072cc535040 v=b4000072cc616040 aw=1280 ah=720 vw=1280 vh=720
xoff=0 yoff=0 format=RGBA8888
                                                        //Parameters of dst channel of image data.
rga2: mmu : src=01 src1=00 dst=01 els=00                //MMU enabled flag，0 for close，1 for open.
rga2: alpha : flag 0 mode0=0 mode1=0                    //Configuration of blending.
rga2: blend mode is no blend                            //Blend mode.
rga2: yuv2rgb mode is 0                                 //Csc mode.
rga2: *** rga2_blit_sync proc ***
```

<!-- en PDF p.14 -->

RGA multicore Device Driver — журнал менеджера памяти

<!-- en PDF p.15 -->

```text
rga: import buffer info:
rga_common: external: memory = 0xb400007458406000, type = virt_addr
                                                    //memory：memory value，type： memory type
rga_common: memory param: w = 1280, h = 720, f = RGBA8888(0x0), size = 0
                                                    //w/h/f：Describe the memory size in the form of image canvas, size: memory size
rga_dma_buf: iova_align size = 3686400
```

<!-- en PDF p.15 -->

Журнал запросов задач

<!-- en PDF p.15 -->

```text
rga: Blit mode: request id = 192732                 //running mode and request id
rga_debugger: render_mode = 0, bitblit_mode=0, rotate_mode = 0
                                                    //render_modedisplay calling interface，bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
rga_debugger: src: y = 19 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
                                                    //Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself.
rga_debugger: src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                                                    //, xoff、yoff: offset in the x and y directions, format：image format, rd_mode：Current channel read/write data mode（1：raster，2：FBC，3：tile 16*16）.
rga_debugger: dst: y=1a uv=0 v=e1000 aw=1280 ah=720 vw=1280 vh=720
                                                    //Parameters of dst channel of image data.
rga_debugger: dst: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
rga_debugger: mmu: mmu_flag=0 en=0                  //MMU enabled flag，0 for close，1 for open.This configuration is disabled when called with
rga_buffer_handle_t, and the driver chooses the optimal configuration.
rga_debugger: alpha: rop_mode = 0                   //alpha/ROP mode enable/disable.
rga_debugger: yuv2rgb mode is 0                     //CSC mode config
rga_debugger: set core = 0, priority = 0, in_fence_fd = -1
                                                    //set_core：user mode specified core，priority：user mode specified priority，in_fence_fd：acquire_fence fd passed by user mode.
```

<!-- en PDF p.15 -->

Журнал подбора оборудования

<!-- en PDF p.16 -->

```text
rga_policy: start policy on core = 1
rga_policy: start policy on core = 2
rga_policy: start policy on core = 4                //Iterate over all core support cases.
rga_policy: RGA2 only support under 4G memory!      //Corresponding to the log of the reason why the core does not support.
rga_policy: optional_cores = 3                      //The current request can match the hardware core collection.
rga_policy: assign core: 1                          //The hardware core identifier bound after matching.
```

<!-- en PDF p.16 -->

Журнал аппаратной конфигурации

<!-- en PDF p.16 -->

```text
rga3_reg: render_mode:bitblt, bitblit_mode=0, rotate_mode:0
rga3_reg: win0: y = ffc70000 uv = ffd51000 v = ffd89400 src_w = 1280 src_h = 720
rga3_reg: win0: vw = 1280 vh = 720 xoff = 0 yoff = 0 format = RGBA8888
rga3_reg: win0: dst_w = 1280, dst_h = 720, rd_mode = 0
rga3_reg: win0: rot_mode = 1, en = 1, compact = 1, endian = 0
rga3_reg: wr: y = ff8e0000 uv = ff9c1000 v = ff9f9400 vw = 1280 vh = 720
rga3_reg: wr: ovlp_xoff = 0 ovlp_yoff = 0 format = RGBA8888 rdmode = 0
rga3_reg: mmu: win0 = 00 win1 = 00 wr = 00
rga3_reg: alpha: flag 0 mode0=0 mode1=a0a
rga3_reg: blend mode is no blend
rga3_reg: yuv2rgb mode is 0
```

<!-- en PDF p.16 -->

Режим reg

<!-- en PDF p.16 -->

```text
rga2: open rga2 reg!                                    //Open 'reg' log printing.
rga2: CMD_REG                                           //Configuration of command register.
rga2: 00000000 00000000 00000040 000e1040
rga2: 00119440 00000000 00000500 02cf04ff
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000040
rga2: 000e1040 00119440 00000500 02cf04ff
rga2: 00000000 00000000 0000ff00 ffffffff
rga2: 00000007 00000000 00000000 00000101
rga2: 07a80000 00000000 07a800e4 00000000
rga2: CSC_REG                                           //Configuration of full csc register.
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: CMD_READ_BACK_REG                                 //Read back of full command register.
rga2: 00000000 00000000 00000040 000e1040
rga2: 00119440 00000000 00000500 02cf04ff
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000040
rga2: 000e1040 00119440 00000500 02cf04ff
rga2: 00000000 00000000 0000ff00 ffffffff
rga2: 00000007 00000000 00000000 00000101
rga2: 07a80000 00000000 07a800e4 00000000
rga2: CSC_READ_BACK_REG                                 //Read back of full csc register.
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
rga2: 00000000 00000000 00000000 00000000
```

<!-- en PDF p.17 -->

Режим time — rga2

<!-- en PDF p.17 -->

```text
rga2: sync one cmd end time 2414                    //Print the RGA. hardware time of the work,in us.
```

<!-- en PDF p.17 -->

multi-rga: версии ниже 1.3.0

<!-- en PDF p.17 -->

```text
rga3_reg: set cmd use time = 196                    //Time elapsed from start processing request to configuration register.
rga_job: hw use time = 554                          //Time-consuming from hardware startup to hardware interrupt return.
rga_job: (pid:3197) job done use time = 751         //Time-consuming from the start of processing the request to the completion of the request.
rga_job: (pid:3197) job clean use time = 933        //Time-consuming from the start of processing the request to the completion of the request resource processing.
```

<!-- en PDF p.17 -->

Версия 1.3.0 и выше

<!-- en PDF p.17 -->

```text
rga_mm: request[3300], get buffer_handle info cost 188 us
rga3_reg: request[3300], generate register cost time 2 us
rga3_reg: request[3300], set register cost time 301 us
rga_job: request[3300], hardware[RGA3_core0] cost time 539 us
rga_mm: request[3300], put buffer_handle info cost 153 us
rga_job: request[3300], job done total cost time 1023 us
rga_job: request[3300], job cleanup total cost time 1030 us
```

<!-- en PDF p.17 -->

##### 3.2.3.3 Запрос версии

<!-- en PDF p.17 -->

Следующие команды показывают имя и версию текущего драйвера:

<!-- en PDF p.17 -->

```text
/# cat driver_version
RGA multicore Device Driver: v1.2.23
```

<!-- en PDF p.18 -->

##### 3.2.3.4 Запрос нагрузки

<!-- en PDF p.18 -->

Следующая команда показывает нагрузку RGA:

<!-- en PDF p.18 -->

```text
/# cat load
num of scheduler = 3                                    //The number of hardware cores currently equipped.
================= load ==================
scheduler[0]: rga3_core0
         load = 0%                                      //Core load ratio.
-----------------------------------
scheduler[1]: rga3_core1
         load = 0%
-----------------------------------
scheduler[2]: rga2
         load = 0%
-----------------------------------
```

<!-- en PDF p.18 -->

##### 3.2.3.5 Запрос менеджера памяти

<!-- en PDF p.18 -->

Следующая команда показывает состояние памяти в менеджере памяти:

<!-- en PDF p.18 -->

```text
/# cat mm_session
rga_mm dump:
buffer count = 3                                        //The number of buffers saved in the memory manager
===============================================================
handle = 34 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb400007286e1c000, pages = 0x00000000ae081f65, size = 3686400
         iova = 0xffc70000, offset = 0x0, sgt = 0x00000000cc976f9e, size = 3686400, map_core = 0x1
                                                        //memory information
---------------------------------------------------------------
handle = 35 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb400007286a95000, pages = 0x000000002f083efc, size = 3686400
         iova = 0xff8e0000, offset = 0x0, sgt = 0x0000000062bb1297, size = 3686400, map_core = 0x1
---------------------------------------------------------------
handle = 36 refcount = 1 mm_flag = 0x2  tgid = 3210
virtual address:
         va = 0xb40000728670e000, pages = 0x00000000785fef63, size = 3686400
         iova = 0xff550000, offset = 0x0, sgt = 0x00000000cdd7688d, size = 3686400, map_core = 0x1
---------------------------------------------------------------
```

<!-- en PDF p.19 -->

##### 3.2.3.6 Запрос задач

<!-- en PDF p.19 -->

Следующая команда запрашивает состояние задачи в Job manager:

<!-- en PDF p.19 -->

```text
/# cat request_manager
rga internal request dump:
request count = 1                                       //The number of job requests in the job manager.
===============================================================
------------------ request: 200073 ------------------
         set cmd num: 1, finish job: 0, failed job: 0, flags = 0x0, ref = 2
                                                        //Job request completion status.
         cmd dump:                                      //Job request information.
                 rotate_mode = 0
                 src: y = 25 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
                 src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                 dst: y=26 uv=0 v=e1000 aw=1280 ah=720 vw=1280 vh=720
                 dst: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
                 mmu: mmu_flag=0 en=0
                 alpha: rop_mode = 0
                 yuv2rgb mode is 0
                 set core = 0, priority = 0, in_fence_fd = -1
```

<!-- en PDF p.19 -->

##### 3.2.3.7 Запрос аппаратных сведений

<!-- en PDF p.19 -->

Следующая команда показывает текущую аппаратную информацию:

<!-- en PDF p.19 -->

```text
/# cat hardware
===================================
rga3_core0, core 1: version: 3.0.76831                  //Parameters such as the hardware version equipped with the core and supported function options.
input range: 68x2 ~ 8176x8176
output range: 68x2 ~ 8128x8128
scale limit: 1/8 ~ 8
byte_stride_align: 16
max_byte_stride: 32768
csc: RGB2YUV 0xf YUV2RGB 0xf
feature: 0x4
mmu: RK_IOMMU
-----------------------------------
rga3_core1, core 2: version: 3.0.76831
input range: 68x2 ~ 8176x8176
output range: 68x2 ~ 8128x8128
scale limit: 1/8 ~ 8
byte_stride_align: 16
max_byte_stride: 32768
csc: RGB2YUV 0xf YUV2RGB 0xf
feature: 0x4
mmu: RK_IOMMU
-----------------------------------
rga2, core 4: version: 3.2.63318
input range: 2x2 ~ 8192x8192
output range: 2x2 ~ 4096x4096
scale limit: 1/16 ~ 16
byte_stride_align: 4
max_byte_stride: 32768
csc: RGB2YUV 0x7 YUV2RGB 0x7
feature: 0x5f
mmu: RGA_MMU
-----------------------------------
```

<!-- en PDF p.20 -->

##### 3.2.3.8 Дамп рабочих данных

<!-- en PDF p.20 -->

Для отладки можно сохранить данные следующих нескольких кадров RGA в указанный каталог через debug-узел. Отсутствие узла означает, что текущее ядро не поддерживает такую запись данных. Задайте путь дампа; при включении данные будут сохраняться в эту папку.

<!-- en PDF p.20 -->

```text
/# echo /data/rga_image > dump_path
/# dmesg -c
rga_debugger: dump path change to: /data/rga_image
```

<!-- en PDF p.20 -->

Задайте количество кадров для дампа.

<!-- en PDF p.20 -->

```text
/# echo 1 > dump_image
/# dmesg -c
rga_debugger: dump image 1

.... RGA running ....

/# dmesg -c
rga_debugger: dump image to:
/data/rga_image/1_core1_src_plane0_virt_addr_w1280_h720_RGBA8888.bin
rga_debugger: dump image to:
/data/rga_image/1_core1_dst_plane0_virt_addr_w1280_h720_RGBA8888.bin

/# ls /data/rga_image/
1_core1_dst_plane0_virt_addr_w1280_h720_RGBA8888.bin
1_core1_src_plane0_virt_addr_w1280_h720_RGBA8888.bin
                                                        //Input (src), output (dst) running image data
```

<!-- en PDF p.21 -->

## 4. Вопросы и ответы

<!-- en PDF p.21 -->

Далее частые вопросы RGA. Если проблема не описана, соберите журналы и предварительный анализ и передайте их через redmine инженеру, сопровождающему модуль RGA.

<!-- en PDF p.21 -->

### 4.1 Производительность

<!-- en PDF p.21 -->

Q1.1: Как оценить эффективность RGA?

A1.1: Для копирования теоретическое время одного изображения равно width × height / числу пикселей в секунду, то есть width × height / (пикселей за такт × частота RGA). Формула применима только к копированию. Для 1920 × 1080 при 300M:

- RGA1: 1920 × 1080 / (1 × 300000000) = 0.006912s
- RGA2: 1920 × 1080 / (2 × 300000000) = 0.003456s
- RGA3: 1920 × 1080 / (4 × 300000000) = 0.001728s

Фактическое время зависит от памяти. Эффективность по убыванию: physical address > dma_fd > virtual address. Без нагрузки физический адрес даёт примерно 1.1–1.2 теоретического времени, dma_fd — 1.3–1.5, виртуальный адрес — 1.8–2.1 и сильно зависит от CPU. Обычно рекомендуется dma_fd как баланс доступности и скорости. Виртуальный адрес удобен лишь для знакомства с RGA. Далее исходные измерения на RK3566 без нагрузки при разных частотах RGA. Условия теста:

<!-- en PDF p.22 -->

| Чип | RK3566 |
| --- | --- |
| Система | Android 11 |
| Частота RGA | 300 M |
| Частота CPU | 1.8 Ghz |
| Частота GPU | 800 M |
| Частота DDR | 1056 M |

<!-- en PDF p.22 -->

Данные теста:

<!-- en PDF p.22 -->

| Разрешение | Тип памяти | Теоретическое время(us) | Фактическое время(us) |
| --- | --- | --- | --- |
| 1280 × 720 | GraphicBuffer(cache) | 1,536 | 2,620 |
| 1280 × 720 | GraphicBuffer(без кэша) | 1,536 | 2,050 |
| 1280 × 720 | Drm buffer(cache) | 1,536 | 2,190 |
| 1280 × 720 | Физический адрес(Drm) | 1,536 | 2,000 |
| 1920 × 1080 | GraphicBuffer(cache) | 3,456 | 5,500 |
| 1920 × 1080 | GraphicBuffer(без кэша) | 3,456 | 4,180 |
| 1920 × 1080 | Drm buffer(cache) | 3,456 | 4,420 |
| 1920 × 1080 | Физический адрес(Drm) | 3,456 | 4,100 |
| 3840 × 2160 | GraphicBuffer(cache) | 13,824 | 21,500 |
| 3840 × 2160 | GraphicBuffer(без кэша) | 13,824 | 15,850 |
| 3840 × 2160 | Drm buffer(cache) | 13,824 | 16,800 |
| 3840 × 2160 | Физический адрес(Drm) | 13,824 | 15,600 |

<!-- en PDF p.22 -->

Q1.2: Как оценить другие режимы, если формула есть только для копирования?

A1.2: Пока доступна только формула копирования. Для масштабирования/обрезки в неё можно подставить большее разрешение из двух изображений; время колеблется в зависимости от масштаба и размера обрезки. Режимы без изменения разрешения, например blending, занимают примерно 1.1–1.2 времени копирования. Из-за влияния полосы DDR в реальной оценке приоритетны измерения целевого сценария.

<!-- en PDF p.22 -->

Q1.3: Почему в некоторых сценариях RGA работает вплоть до двух раз медленнее демонстрации?

<!-- en PDF p.23 -->

A1.3: На рассматриваемых RK-платформах RGA имеет самый низкий приоритет шины. При дефиците полосы, например многопоточном ISP, чтение/запись DDR задерживается, что увеличивает задержку и снижает производительность.

<!-- en PDF p.23 -->

Q1.4: Как повысить недостаточную производительность RGA?

A1.4: В заводских прошивках некоторых чипов до 2021 года частота не максимальна. Например, 3399 и 1126 могут достигать 400M. Два способа: временная команда (после перезапуска частота восстановится) либо DTS. Запрос частоты RGA:

<!-- en PDF p.23 -->

```text
cat /sys/kernel/debug/clk/clk_summary | grep rga                //Query rga frequency.
```

<!-- en PDF p.23 -->

Изменение частоты RGA:

<!-- en PDF p.23 -->

```text
echo 400000000 > /sys/kernel/debug/clk/aclk_rga/clk_rate        //Modify 400000000 to the needed frequency.
```

<!-- en PDF p.23 -->

Изменение частоты в DTS сохраняется после перезапуска. Ниже пример RK3288; для других платформ измените соответствующий DTS.

<!-- en PDF p.23 -->

```text
diff --git a/arch/arm/boot/dts/rk3288-android.dtsi b/arch/arm/boot/dts/rk3288-android.dtsi
index 02938b0..10a1dc4 100644
--- a/arch/arm/boot/dts/rk3288-android.dtsi
+++ b/arch/arm/boot/dts/rk3288-android.dtsi
@@ -450,6 +450,8 @@
        compatible = "rockchip,rga2";
        clocks = <&cru ACLK_RGA>, <&cru HCLK_RGA>, <&cru SCLK_RGA>;
        clock-names = "aclk_rga", "hclk_rga", "clk_rga";
+       assigned-clocks = <&cru ACLK_RGA>, <&cru SCLK_RGA>;
+       assigned-clock-rates = <300000000>, <300000000>;
        dma-coherent;
 };
```

<!-- en PDF p.23 -->

Q1.5: Можно ли запросить загрузку RGA командой/API?

A1.5: RGA multicore Device Driver поддерживает запрос нагрузки. См. «Отладка → Отладочные узлы драйвера → Функции → Запрос нагрузки».

<!-- en PDF p.23 -->

Q1.6: Почему асинхронные вызовы иногда медленнее синхронных?

<!-- en PDF p.24 -->

A1.6: Для RGA Device Driver/RGA2 Device Driver идентификатор асинхронного режима — открытый узел устройства. Singleton librga открывает только один fd на процесс, поэтому imsync() ждёт завершения всех асинхронных работ процесса. RGA multicore Device Driver использует fence для отдельного запроса и такой проблемы не имеет.

<!-- en PDF p.24 -->

Q1.7: Копирование RGA через виртуальный адрес медленнее memcpy; можно ли ускорить?

A1.7: Виртуальные адреса обычно не рекомендуются: при высокой загрузке CPU эффективность резко падает. CPU рассчитывает таблицу преобразования виртуальных адресов в физические, что само по себе затратно. Обычно также нет пользовательского интерфейса синхронизации кэша, поэтому драйвер принудительно синхронизирует его каждый кадр. Рекомендуются физический адрес или dma_fd.

<!-- en PDF p.24 -->

Q1.8: Почему вызов RGA сильно загружает CPU?

A1.8: Помимо неизбежной базовой нагрузки дополнительную нагрузку вызывают следующие ситуации:

<!-- en PDF p.24 -->

1) Виртуальный адрес — адрес доступа CPU; по таблице отображения текущего процесса CPU должен получить дискретную таблицу физических адресов для оборудования. Это создаёт дополнительную нагрузку. В изделии рекомендуется dma-buf fd, кроме случаев, когда логика имеет только виртуальные адреса и эта нагрузка несущественна.

<!-- en PDF p.24 -->

2) Для кэшируемых виртуальных адресов драйвер RGA принудительно синхронизирует кэш перед аппаратным доступом и после него. Это нагружает CPU. Обычные аллокаторы виртуальной памяти не предназначены для доступа других устройств и не предоставляют подходящего интерфейса синхронизации, поэтому драйвер вынужден делать это сам.

<!-- en PDF p.24 -->

3) Некоторые dma-buf-аллокаторы по умолчанию создают кэшируемые буферы. Обработка dma-buf ядром принудительно синхронизирует кэш при каждом вызове RGA, создавая высокую CPU-нагрузку. В этом случае рекомендуется выделять dma-buf с отключённым кэшем.

<!-- en PDF p.24 -->

Q1.9: Почему с 8G DDR RGA медленнее, чем с 4G?

A1.9: MMU RGA1/RGA2 поддерживает максимум 32-битные физические адреса. На устройствах с 4G DDR и более при буфере выше 4G драйвер через DMA копирует данные в память, зарезервированную swiotlb, и передаёт RGA её адрес. После обработки результат копируется обратно в высокий адрес. Участие CPU и время librga сильно возрастают. Если устройство имеет только RGA1/RGA2 и более 4GB DDR,

<!-- en PDF p.25 -->

используйте память ниже 4GB для сохранения эффективности. RGA Multicore Device Driver отключает swiotlb для недоступной памяти и возвращает ошибку, предлагая выделить подходящий буфер и повторить вызов. Это сохраняет эффективность. Обычно появляются следующие журналы. HAL:

<!-- en PDF p.25 -->

```text
RgaBlit(1483) RGA_BLIT fail: Invalid argument
Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
```

<!-- en PDF p.25 -->

Журнал аппаратного сопоставления:

<!-- en PDF p.25 -->

```text
rga_policy: invalid function policy                         //Indicates that there are invalid parameters, which means that no hardware can access the memory configured by the current request.
rga_job: job assign failed                                  //Failed to match hardware core
rga_job: failed to get scheduler, rga_job_commit(403)
rga_job: (pid:3524) job clean use time = 19
rga_job: request[282567] task[0] job_commit failed.
rga_job: rga request commit failed!
rga: request[282567] submit failed!
```

<!-- en PDF p.25 -->

Рабочий журнал драйвера:

<!-- en PDF p.25 -->

```text
rga_policy: start policy on core = 4
[82116.782252] rga_policy: RGA2 only support under 4G memory!
                                                            //Indicates that the currently equipped RGA2 core only supports memory within 4G. [82116.782256] rga_policy: optional_cores = 0 [82116.782258] rga_policy: invalid function policy [82116.782260] rga_policy: assign core: -1 [82116.782262] rga_job: job assign failed
```

<!-- en PDF p.25 -->

Для этого сценария выделяйте память в пределах 4G. Примеры:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma32_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_graphicbuffer_demo.cpp`

<!-- en PDF p.25 -->

Q1.10: Почему API занимает больше времени, чем аппаратное выполнение в журнале?

Q1.10.1: TIME показывает длительный map/unmap buffer.

Q1.10.2: Между временными метками MSG и REG большой промежуток.

Q1.10.3: При одинаковых параметрах разные аллокаторы дают сильно разное время.

<!-- en PDF p.26 -->

A1.10: Причина — отображение map/unmap внешнего буфера. Каждый внешний буфер должен быть отображён и привязан к драйверу RGA для доступа оборудования. Различия реализаций аллокаторов дают разные затраты map/bind, поэтому API выглядит намного медленнее аппаратной работы. Часто большие накладные расходы имеют ION и V4L2; обычно они связаны с кэшем. Подтвердить можно сравнением аллокаторов. Способы оптимизации:

<!-- en PDF p.26 -->

1) Выберите аллокатор с меньшими затратами map/unmap, например dma_heap, DRM или их обёртки. Примеры вызова RGA с такой памятью:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_drm_demo.cpp`

<!-- en PDF p.26 -->

2) Проблемный сценарий — создание rga_buffer_t через wrapbuffer_fd() либо importbuffer_fd на один кадр с немедленным releasebuffer_handle. Для временного теста или постоянно меняющихся буферов это нормально, но повторное выделение памяти в изделии неэффективно. Оптимизируйте весь жизненный цикл буферов по следующей схеме:

<!-- en PDF p.26 -->

1. Создайте buffer_pool с циклическими буферами; размер определите по сценарию.

<!-- en PDF p.26 -->

2. Импортируйте буфер через importbuffer_fd() и получите RGA buffer_handle.

<!-- en PDF p.26 -->

3. Выполняйте обработку изображений через очередной buffer_handle, циклически переиспользуя буферы.

<!-- en PDF p.26 -->

4. Когда buffer_pool больше не нужен, вызовите releasebuffer_handle() для освобождения ссылок RGA, чтобы затем можно было удалить сами буферы.

<!-- en PDF p.26 -->

5. Освободите ненужные буферы buffer_pool. Тогда даже дорогие map/unmap сосредоточены в importbuffer_fd()/releasebuffer_handle() и не влияют на каждый рабочий кадр. Это позволяет избежать различий производительности из-за реализации аллокатора.

<!-- en PDF p.26 -->

3) Если аллокатор и процесс изменить нельзя, остаётся изменение его map/unmap. Это опасно: нужно понимать все сценарии использования данного аллокатора. Обратитесь через redmine к его сопровождающему за технической поддержкой.

<!-- en PDF p.26 -->

Q1.11: Почему importbuffer_fd()/importbuffer_virtualaddr() медленные и зачем они нужны?

<!-- en PDF p.27 -->

A1.11: Применение описано в docs/Rockchip_Developer_Guide_RGA_EN, «Overview → Image Buffer Preprocessing». importbuffer_xx() импортирует внешний буфер в драйвер, чтобы последующие кадры быстро обращались к нему через buffer_handle. Импорт затратен: нужно отобразить буфер и сохранить физические адреса и сведения о нём. Это необходимая часть работы RGA.

<!-- en PDF p.27 -->

Q1.12: Поддерживает ли RGA параллельную работу? Почему время кадра растёт или удваивается при нескольких потоках?

A1.12: API поддерживает параллельные вызовы потоков/процессов, но аппаратная параллельность ограничена числом RGA-ядер чипа. Задачи сверх числа ядер ждут освобождения ядра, увеличивая время кадра. Число ядер и функции можно запросить следующими узлами; подробности в разделе аппаратной информации:

<!-- en PDF p.27 -->

```text
/# cat hardware
```

<!-- en PDF p.27 -->

### 4.2 Функции

<!-- en PDF p.27 -->

Q2.1: Как узнать версию и функции RGA текущего чипа?

A2.1: См. Rockchip_Developer_Guide_RGA_EN — Overview. Пути исходников librga зависят от SDK:

- Android 7.0 и выше: hardware/rockchip/librga
- Android 7.0 и ниже: hardware/rk29/librga
- Linux: external/linux-rga.

<!-- en PDF p.27 -->

Q2.2: Как вызвать RGA для аппаратного ускорения? Есть ли демонстрация?

<!-- en PDF p.28 -->

A2.2: 1) Интерфейсы описаны в Rockchip_Developer_Guide_RGA_EN — API.

<!-- en PDF p.28 -->

2) Демонстрация находится в sample/rga_im2d_demo. Она реализует большинство API и вызывает функции командами; пригодна и для проверки работоспособности. Новичкам рекомендуется запустить её, изучить результаты, изменить параметры под свои задачи и затем использовать API в собственном проекте.

<!-- en PDF p.28 -->

3) Типовые примеры в каталоге samples:

- allocator_demo: аллокаторы памяти

<!-- en PDF p.28 -->

- alpha_demo: alpha blending и наложение

<!-- en PDF p.28 -->

- async_demo: асинхронный режим

<!-- en PDF p.28 -->

- config_demo: глобальная конфигурация потока

<!-- en PDF p.28 -->

- copy_demo: перенос и копирование изображений

<!-- en PDF p.28 -->

- crop_demo: обрезка и объединение изображений

<!-- en PDF p.28 -->

- cvtcolor_demo: форматы и цветовые пространства

<!-- en PDF p.28 -->

- fill_demo: заливка

<!-- en PDF p.28 -->

- mosaic_demo: мозаика

<!-- en PDF p.28 -->

- padding_demo: дополнение

<!-- en PDF p.28 -->

- resize_demo: масштабирование

<!-- en PDF p.28 -->

- rop_demo: ROP

<!-- en PDF p.28 -->

- transform_demo: обработка изображений

<!-- en PDF p.28 -->

Q2.3: Какие возможности поддерживает RGA?

Q2.3.1: Какие форматы поддерживаются?

A2.3.1: См. Rockchip_Developer_Guide_RGA_EN — Overview — Image Format Supported для нужной версии чипа. Входные/выходные форматы текущего оборудования можно запросить через querystring(RGA_INPUT_FORMAT \| RGA_OUTPUT_FORMAT);.

Q2.3.2: Какой диапазон масштабирования поддерживается?

<!-- en PDF p.29 -->

A2.3.2: См. Rockchip_Developer_Guide_RGA_EN — Overview — Design Index либо querystring(RGA_SCALE_LIMIT);.

Q2.3.3: Каково максимальное разрешение?

A2.3.3: См. тот же раздел Design Index либо querystring(RGA_MAX_INPUT \| RGA_MAX_OUTPUT); для пределов входа/выхода.

A2.3: В целом по вопросам поддержки обращайтесь к подробному Rockchip_Developer_Guide_RGA_EN.

<!-- en PDF p.29 -->

Q2.4: Чем различаются старая и новая librga и как их отличить?

A2.4: Старая версия не позволяет запросить номер версии; её сопровождение прекращено. Обычно она входит в SDK до ноября 2020 года, а для отдельных платформ — позже, например RK3399 Linux SDK до июня 2021 (V2.5 и ниже). С новыми драйверами возможны искажение цвета и формата, поэтому такая комбинация не рекомендуется. При новом ядре обновляйте librga и наоборот. Основная поддерживаемая версия позволяет запрос версии и имеет каталог im2d_api. Она интегрирует старую librga, добавляет простой IM2D API и также называется IM2D librga. Поддерживаются не только IM2D, но и старые RockchipRga/C_XXX. API описаны в Rockchip_Developer_Guide_RGA_EN. Версия запрашивается через querystring(RGA_VERSION);. Рекомендуется обновлять SDK целиком, избегая зависимостей; крайне не рекомендуется смешивать новую librga со старым драйвером либо старую librga с новым ядром, поскольку возможны явные ошибки в отдельных сценариях.

<!-- en PDF p.29 -->

Q2.5: Есть ли требования выравнивания?

A2.5: Они зависят от формата. RGA читает строки с выравниванием на слово, 4 байта/32 бита. RGBA занимает 32 бита (4 × 8bit) на пиксель и не требует дополнительного выравнивания. RGB565 — 16 бит (5+6+5), поэтому требуется кратность 2; RGB888 — 24 бита (3 × 8bit), поэтому кратность 4 для 32-битного доступа. YUV сам требует кратности 2; канал Y — 8 бит на пиксель, что требует кратности 4 для доступа RGA. Размер UV определяется 420/422 для каждой группы четырёх пикселей; в итоге нужна кратность 4. Для остальных форматов принцип аналогичен. Здесь выравнивание относится к

<!-- en PDF p.30 -->

width stride. Фактические ширина, высота и смещения YUV также должны быть кратны 2 по свойствам формата. Точные ограничения см. Rockchip_Developer_Guide_RGA_EN — Overview — Image Format Alignment Instructions.

<!-- en PDF p.30 -->

Q2.6: Можно ли рисовать несколько прямоугольников или выполнять несколько операций за раз?

A2.6: Аппаратные задачи RGA выполняются последовательно: следующая начинается после предыдущей. Вместо одновременной отрисовки нескольких прямоугольников можно асинхронно передать работы драйверу; он хранит их в очереди и исполняет по порядку. Перед обработкой буфера верхний уровень вызывает imsync(), проверяя завершение аппаратной работы.

<!-- en PDF p.30 -->

Q2.7: Поддерживает ли заливка YUV?

A2.7: Старая librga не поддерживает. Нужна новая версия со следующим коммитом; если его нет, обновите SDK.

<!-- en PDF p.30 -->

```text
commit 8c526a6bb9d0e43b293b885245bb53a3fa8ed7f9
Author: Yu Qiaowei <cerf.yu@rock-chips.com>
Date:   Wed Dec 23 10:57:28 2020 +0800

    Color fill supports YUV format as input source.

    Signed-off-by: Yu Qiaowei <cerf.yu@rock-chips.com>
    Change-Id: I0073c31d770da513f81b9b64e4c27fee2650f30b
```

<!-- en PDF p.30 -->

Вызов аналогичен RGB-заливке: цвет задаётся RGB-значением, но выход можно выбрать YUV.

<!-- en PDF p.30 -->

Q2.8: Поддерживается ли YUYV?

A2.8: Старая librga из SDK до октября 2020 года не поддерживает YUYV. Нужна новая версия с im2d_API в каталоге исходников и следующим коммитом. Если его нет, обновите SDK.

<!-- en PDF p.30 -->

```text
commit db278db815d147c0ff7a80faae0ea795ceffd341
Author: Yu Qiaowei <cerf.yu@rock-chips.com>
Date:   Tue Nov 24 19:50:17 2020 +0800

    Add support for Y4/YUV400/YUYV in imcheck().

    Signed-off-by: Yu Qiaowei <cerf.yu@rock-chips.com>
    Change-Id: I3cfea7c8bb331b65b5bc741956da47924eeda6e1
```

<!-- en PDF p.31 -->

Q2.9: Поддерживается ли масштабирование входа/выхода в оттенках серого?

A2.9: Старая librga из SDK до октября 2020 не поддерживает формат; вход grayscale поддерживает новая librga 1.2.2 с im2d_API. Более старую обновите. Само оборудование не имеет отдельного grayscale-формата: RK_FORMAT_Y400 представлен YUV без UV, один Y даёт 256 градаций серого. Поэтому учитывайте цветовой диапазон: CSC в YUV по умолчанию использует BT.601 limited range, где Y не охватывает 0–255. При RGB→YUV с выходом Y400 задавайте full range при преобразовании цветового пространства.

<!-- en PDF p.31 -->

Q2.10: Почему ROP-код RK3399 не даёт результат на RV1126?

A2.10: Оба используют RGA2-ENHANCE, но подверсии различаются; у RV1126 ROP удалён. Поддержку смотрите в Rockchip_Developer_Guide_RGA_EN или через querystring(RGA_FEATURE);.

<!-- en PDF p.31 -->

Q2.11: Почему RGB↔YUV даёт сильный розовый/зелёный оттенок, хотя другие функции нормальны? Ожидаемый результат:

<!-- en PDF p.31 -->

![Оригинальный рисунок английского PDF — p.31](/docs/rockchip-rga-faq/assets/en-p031-figure-01.png)

*Оригинальный рисунок английского PDF — p.31*

<!-- en PDF p.31 -->

Фактический результат:

<!-- en PDF p.32 -->

![Оригинальный рисунок английского PDF — p.32](/docs/rockchip-rga-faq/assets/en-p032-figure-01.png)

*Оригинальный рисунок английского PDF — p.32*

<!-- en PDF p.32 -->

A2.11: Обычно не совпадают версии librga и ядра; см. A2.4. Частый случай — librga с GitHub в SDK, выпущенном до ноября

<!-- en PDF p.32 -->

2020 года. Новая librga не согласована со старым драйвером, изменённые настройки цветового пространства дают заметное искажение. Решения: обновить SDK/драйвер, согласовав версии, либо использовать librga из SDK, если новые функции не нужны.

<!-- en PDF p.32 -->

Q2.12: Как наложить OSD-субтитры? Ожидаемый результат:

<!-- en PDF p.33 -->

![Оригинальный рисунок английского PDF — p.33](/docs/rockchip-rga-faq/assets/en-p033-figure-01.png)

*Оригинальный рисунок английского PDF — p.33*

<!-- en PDF p.33 -->

A2.12: Для RGB-выхода используйте imblend(), обычно src over: src накладывается на dst. Для YUV — imcomposite(), обычно dst over: src1 накладывается на src, результат выходит в dst. Используется модель Porter–Duff; подробности в Rockchip_Developer_Guide_RGA_EN — API — Image Blending. Различие конфигураций связано с тремя каналами RGA2: src поддерживает YUV2RGB, а src1/pat и dst — только RGB2YUV. Смешивание внутри RGA выполняется в RGB. Поэтому для RGB поверх YUV фоновое YUV подаётся на src, переднее RGB — на src1; смешанный RGB преобразуется в YUV каналом dst. Примеры:

`<librga_souce_path>/samples/alpha_demo/src/rga_alpha_osd_demo.cpp`

`<librga_souce_path>/samples/alpha_demo/src/rga_alpha_yuv_demo.cpp`

<!-- en PDF p.33 -->

Q2.13: Почему при YUV↔RGB различаются яркость или численные значения?

A2.13: Две основные причины:

<!-- en PDF p.33 -->

1) При одинаковых настройках отдельные пиксели могут отличаться обычно на 1 из-за точности CSC-формулы. У RGA1/RGA2 дробная точность 8bit, у RGA3 — 10bit; округление создаёт ошибку ±1.

<!-- en PDF p.34 -->

2) Несовпадающие CSC-режимы RGB2YUV и YUV2RGB. Новая librga использует BT.601-limit_range по умолчанию в обоих направлениях; неверное color_space_mode приводит к большим изменениям. Старая librga по умолчанию использует RGB2YUV BT.601-full_range и YUV2RGB BT.709-limit_range, поэтому обратное преобразование значительно меняет значения.

<!-- en PDF p.34 -->

Q2.14: Как настроить цветовое пространство?

A2.14: Это поддерживают обе версии librga.

<!-- en PDF p.34 -->

1) Новая версия: Rockchip_Developer_Guide_RGA_EN — API — Image Format Conversion; обратите внимание на mode.

<!-- en PDF p.34 -->

2) Старая версия: измените yuvToRgbMode в Normal/NormaRga.cpp. Параметры:

<!-- en PDF p.34 -->

| Преобразование формата | Цветовое пространство | Параметры |
| --- | --- | --- |
| YUV2RGB | BT.601-limit_range | yuvToRgbMode = 0x1 &lt;&lt; 0; |
| YUV2RGB | BT.601-full_range | yuvToRgbMode = 0x2 &lt;&lt; 0; |
| YUV2RGB | BT.709-limit_range | yuvToRgbMode = 0x3 &lt;&lt; 0; |
| RGB2YUV | BT.601-limit_range | yuvToRgbMode = 0x2 &lt;&lt; 4; |
| RGB2YUV | BT.601-full_range | yuvToRgbMode = 0x1 &lt;&lt; 4; |
| RGB2YUV | BT.709-limit_range | yuvToRgbMode = 0x3 &lt;&lt; 4; |

<!-- en PDF p.34 -->

Q2.15: Почему alpha-наложение не даёт эффекта?

A2.15: Проверьте, не равны ли alpha обоих изображений 0xFF. При alpha переднего изображения 0xFF оно полностью перекрывает фон. Это выглядит как отсутствие эффекта, но является правильным результатом.

<!-- en PDF p.34 -->

Q2.16: Почему при alpha переднего изображения 0x0 результат не полностью прозрачен? Переднее изображение: у чёрного, белого и rockchip alpha=0x00.

<!-- en PDF p.35 -->

![Оригинальный рисунок английского PDF — p.35](/docs/rockchip-rga-faq/assets/en-p035-figure-01.png)

*Оригинальный рисунок английского PDF — p.35*

<!-- en PDF p.35 -->

Ожидаемый результат:

<!-- en PDF p.35 -->

![Оригинальный рисунок английского PDF — p.35](/docs/rockchip-rga-faq/assets/en-p035-figure-02.png)

*Оригинальный рисунок английского PDF — p.35*

<!-- en PDF p.35 -->

Фактический результат:

<!-- en PDF p.36 -->

![Оригинальный рисунок английского PDF — p.36](/docs/rockchip-rga-faq/assets/en-p036-figure-01.png)

*Оригинальный рисунок английского PDF — p.36*

<!-- en PDF p.36 -->

A2.16: Обычный режим предполагает, что цвет уже premultiplied соответствующим alpha. Непосредственно прочитанное исходное изображение такого умножения не имеет, поэтому imblend требует дополнительного флага, указывающего обработку непредумноженных цветовых значений. Вызов описан в Rockchip_Developer_Guide_RGA_EN — API — Image Blending.

<!-- en PDF p.36 -->

Q2.17: Может ли IM2D API выполнить несколько функций одним вызовом RGA?

A2.17: Да. См. Rockchip_Developer_Guide_RGA_EN — API — Image process и реализации других IM2D API для использования improcess().

<!-- en PDF p.36 -->

Q2.18: Почему повёрнутое изображение растянуто? Ожидаемый результат:

<!-- en PDF p.37 -->

![Оригинальный рисунок английского PDF — p.37](/docs/rockchip-rga-faq/assets/en-p037-figure-01.png)

*Оригинальный рисунок английского PDF — p.37*

<!-- en PDF p.37 -->

Фактический результат:

<!-- en PDF p.38 -->

![Оригинальный рисунок английского PDF — p.38](/docs/rockchip-rga-faq/assets/en-p038-figure-01.png)

*Оригинальный рисунок английского PDF — p.38*

<!-- en PDF p.38 -->

A2.18: При повороте на 90°/270° без масштабирования поменяйте местами ширину и высоту. Иначе драйвер по умолчанию выполняет поворот с масштабированием, что выглядит как растяжение.

<!-- en PDF p.38 -->

Q2.19: Почему RGB888 после масштабирования наклонён и содержит чёрные линии? Вход (1920 × 1080):

<!-- en PDF p.38 -->

![Оригинальный рисунок английского PDF — p.38](/docs/rockchip-rga-faq/assets/en-p038-figure-02.png)

*Оригинальный рисунок английского PDF — p.38*

<!-- en PDF p.38 -->

Выход (1282 × 720):

<!-- en PDF p.39 -->

![Оригинальный рисунок английского PDF — p.39](/docs/rockchip-rga-faq/assets/en-p039-figure-01.png)

*Оригинальный рисунок английского PDF — p.39*

<!-- en PDF p.39 -->

A2.19: Нарушено выравнивание: виртуальная ширина RGB888 должна быть кратна 4. Проверьте параметры; требования см. Q2.5.

<!-- en PDF p.39 -->

Q2.20: Почему в некоторых системных процессах выход RGA искажён?

A2.20: Обычно ошибка RGA не вызывает такой «разбитый» экран; сначала установите, связана ли проблема с RGA. Проверьте вход: до вызова сохраните память через fwrite() и убедитесь в корректности источника. Пример записи — output_buf_data_to_file() в core/rgautils.cpp.

<!-- en PDF p.39 -->

Q2.21: Почему после обработки появляются короткие чёрные или зелёные полосы?

<!-- en PDF p.40 -->

![Оригинальный рисунок английского PDF — p.40](/docs/rockchip-rga-faq/assets/en-p040-figure-01.png)

*Оригинальный рисунок английского PDF — p.40*

<!-- en PDF p.40 -->

A2.21: При вызове не через виртуальный адрес включён кэш буфера, но он не синхронизируется до/после CPU-операций. Пример синхронизации: samples/allocator_demo/src/rga_allocator_dma_cache_demo.cpp.

<!-- en PDF p.40 -->

Q2.22: Почему масштабирование RGA в одной области экрана RK3588 вызывает дрожание?

A2.22: RK3588 содержит два типа ядер: одно RGA2 и два RGA3. Их алгоритмы масштабирования различаются выборкой, сдвигая изображение влево-вверх или вправо-вниз. Если важно качество, закрепите конкретное ядро. Примеры:

`<librga_souce_path>/samples/config_demo/src/rga_config_single_core_demo.cpp`

`<librga_souce_path>/samples/config_demo/src/rga_config_thread_core_demo.cpp`

<!-- en PDF p.40 -->

### 4.3 Ошибки HAL

<!-- en PDF p.40 -->

#### 4.3.1 Ошибки IM2D_API

<!-- en PDF p.40 -->

Q3.1.1: Как обработать ошибку imcheck()?

<!-- en PDF p.40 -->

```text
check error! Invalid parameters: dst, Error yuv not align to 2, rect[x,y,w,h] = [0, 0, 1281,
720], wstride = 1281, hstride = 720, format = 0xa00(nv12)
output support format : RGBA_8888 RGB_888 RGB_565 RGBA_4444 RGBA_5551 YUV420/YUV422
YUV420_10bit/YUV422_10bit YUYV420 YUYV422 YUV400/Y4
```

<!-- en PDF p.41 -->

A3.1.1: imcheck() проверяет параметры структуры для librga, поддержку функции, аппаратные ограничения и т. п. Передайте код ошибки в IMStrError(), чтобы получить подробное описание нарушенных условий или параметров. В примере нарушено выравнивание YUV: ширина 1281 не кратна 2, поэтому проверка не проходит.

<!-- en PDF p.41 -->

Q3.1.2: Что означает ошибка imstrError() без подробных параметров?

<!-- en PDF p.41 -->

```text
Fatal error: Failed to call RockChipRga interface, please use 'dmesg' command to view driver
error log.
```

<!-- en PDF p.41 -->

A3.1.2: Конфигурация прошла проверку im2d api и передана драйверу. Его ошибку смотрите через dmesg.

<!-- en PDF p.41 -->

#### 4.3.2 Ошибки RockchipRga API

<!-- en PDF p.41 -->

Q3.2.1: Как исправить “Try to use uninit rgaCtx=(nil)”?

A3.2.1: 1) API обнаружил неинициализированный модуль librga. Обычно старый код вызывает RgaInit/RgaDeInit/c_RkRgaInit/c_RkRgaDeInit и ошибочно деинициализирует singleton новой API. Удалите эти вызовы Init/DeInit.

<!-- en PDF p.41 -->

2) Такая ошибка возникает также при неуспешном probe драйвера либо ограниченном доступе к /dev/rga.

<!-- en PDF p.41 -->

Q3.2.2: Что означает “RgaBlit(1027) RGA_BLIT fail:” или “RGA_COLORFILL(1027) RGA_BLIT fail:”?

A3.2.2: Задача вернулась после ошибки драйвера; точная причина в dmesg.

Q3.2.2.1: “RgaBlit(1027) RGA_BLIT fail: Not a typewriter”?

A3.2.2.1: Обычно неверные параметры. Проверьте масштаб, что виртуальная ширина не меньше фактической ширины плюс смещение по этой оси, и выравнивание. Для новых проектов рекомендуется IM2D API с более полной проверкой ошибок.

Q3.2.2.2: “RgaBlit(1349) RGA_BLIT fail: Bad file descriptor”?

<!-- en PDF p.42 -->

A3.2.2.2: Ошибка ioctl: переданный узлу устройства fd недействителен. Обновите librga или проверьте изменения процесса инициализации RGA.

Q3.2.2.3: “RgaBlit(1360) RGA_BLIT fail: Bad address”?

A3.2.2.3: Обычно неверный адрес памяти src/src1/dst, переданный ядру, часто выход за границы. Включите журналы драйвера по разделу отладочных узлов и найдите проблемную память.

Q3.2.2.4: “RgaBlit(1466) RGA BIIT fail: Invalid argument”?

A3.2.2.4: Параметры не удовлетворяют функциям или ограничениям RGA-ядра текущего чипа. Сверьте параметры задачи с возможностями установленного ядра.

<!-- en PDF p.42 -->

Q3.2.3: Что означают “err ws[100,1280,1280]” и “Error srcRect”?

A3.2.3: Ошибка width stride. Значения в [] — [X_offeset, width, width_stride]. Сумма X-смещения и рабочей ширины больше width_stride. Измените stride на 1380 или width на 1180. После ошибки logcat печатает следующие параметры:

<!-- en PDF p.42 -->

```text
E librga  : err ws[100,1280,1280]                                           //Represent the width stride error.
E librga  : [RgaBlit,731]Error srcRect                                      //Represent the src channel error.
E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb6ea9040, 0x0, 0x0, 0]    //Input address (fd, virtual address, physical address, handle) of  corresponding src channel.
E rockchiprga: rect[100, 0, 1280, 720, 1280, 720, 1, 0]                     //Image parameters of corresponding src channel are: X direction offset, Y direction offset, width of the actual operation area, height of the actual operation area, image width (virtual width), image height (virtual height), image format, size ( parameters currently not used) respectively.
E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]       //Represents the mode configuration in the call.
E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb2ea6040, 0x0, 0x0, 0]    //Parameters of corresponding dst channel.
E rockchiprga: rect[0, 0, 1920, 1080, 1920, 1080, 1, 0]
E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]
E rockchiprga: This output the user parameters when rga call blit fail      //Error information.
```

<!-- en PDF p.43 -->

### 4.4 Ошибки ядра

<!-- en PDF p.43 -->

Q4.1: Что вызывает “RGA2 failed to get vma, result = 32769, pageCount = 65537”?

A4.1: При вызове через виртуальный адрес выделенная память обычно меньше размера изображения, вычисленного по параметрам канала. Проверьте размер буфера. Если выделение и вызов разнесены, перед вызовом выполните memset на размер изображения, проверив достаточность памяти. “rga2 map src0 memory failed” помогает найти канал; здесь src получил буфер вдвое меньше требуемого.

<!-- en PDF p.43 -->

Q4.2: Что вызывает “rga2_reg_init, [868] set mmu info error”?

A4.2: Ошибка преобразования fd или виртуального адреса в таблицу физических адресов, обычно из-за размера памяти, как в Q4.1.

<!-- en PDF p.43 -->

Q4.3: На какую проблему буфера указывает “rga:dma_buf_get fail fd[328]”?

A4.3: Ошибка возникает в DMA-интерфейсе ядра. Проверьте получение fd и его работоспособность вне librga перед передачей RGA.

<!-- en PDF p.43 -->

Q4.4: После проверок Q4.1/Q4.2 остаются “RGA2 failed to get pte, result = -14, pageCount = 112” и “rga2_reg_init, [868] set mmu info error”. Используется физическая память DRM, memset через MMAP-виртуальный адрес успешен. Почему?

A4.4: Причина в DRM-аллокаторе: если пользовательский режим получает физический адрес, ядру обычно не требуется виртуальный, и DRM освобождает kmap при выделении. Это не мешает пользовательскому отображению. Но при передаче этого виртуального адреса драйверу RGA поиск физической таблицы может обрушить ядро, не найти запись или обратиться неверно, поскольку kmap уже освобождён. DRM предоставляет флаг, позволяющий указать, нужно ли освобождать kmap, то есть будет ли отображённый виртуальный адрес передан ядру:

<!-- en PDF p.44 -->

```text
(1) drm buffer application options add ROCKCHIP_BO_ALLOC_KMAP definition.
+   /* keep kmap for cma buffer or alloc kmap for other type memory */
+   ROCKCHIP_BO_ALLOC_KMAP  = 1 << 4,
(2) When applying for drm memory, add drm buffer option ROCKCHIP_BO_ALLOC_KMAP.
    struct drm_mode_create_dumb arg;
    ...
-   arg.flags = ROCKCHIP_BO_CONTIG;
+   arg.flags = ROCKCHIP_BO_CONTIG | ROCKCHIP_BO_ALLOC_KMAP;    //ROCKCHIP_BO_ALLOC_KMAP is valid only when used together with ROCKCHIP_BO_CONTIG.
    ret = drmIoctl(drm_fd, DRM_IOCTL_MODE_CREATE_DUMB, &arg);
```

<!-- en PDF p.44 -->

Убедитесь, что ядро содержит следующий коммит; иначе обновите SDK:

<!-- en PDF p.44 -->

```text
commit 1a81ee3e2d3726b9382ff2c48d08f4d837bc0143
Author: Sandy Huang <hjc@rock-chips.com>
Date:   Mon May 10 16:52:04 2021 +0800

    drm/rockchip: gem: add flag ROCKCHIP_BO_ALLOC_KMAP to assign kmap

    RGA need to access CMA buffer at kernel space, so add this flag to keep kernel
    line mapping for RGA.

    Change-Id: Ia59acee3c904a495792229a80c42f74ae34200e3
    Signed-off-by: Sandy Huang <hjc@rock-chips.com>
```

<!-- en PDF p.44 -->

Q4.5: Как устранить “RGA_MMU unsupported Memory larger than 4G!”?

A4.5: Обычно этому соответствует ошибка HAL:

<!-- en PDF p.44 -->

```text
RgaBlit(1483) RGA_BLIT fail: Invalid argument
Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
```

<!-- en PDF p.44 -->

Память настроенной задачи не соответствует требованиям выбранного ядра. IOMMU разных версий RGA поддерживает разную адресную разрядность; превышение лимита вызывает ошибку. Ограничения см. Rockchip_Developer_Guide_RGA_CN — Overview — Design Indicators. Типовые сценарии и решения:

<!-- en PDF p.44 -->

1) На многоядерной платформе (например, RK3588: 2 RGA3 + 1 RGA2) используется wrapbuffer_xx напрямую для im2d, без importbuffer_xx. Без предварительного импорта драйвер при подборе задачи не знает, удовлетворяет ли память ограничениям ядра, поэтому ошибка возможна при высокой нагрузке. Импортируйте внешний буфер заранее через importbuffer_xx.

<!-- en PDF p.45 -->

2) На такой платформе importbuffer_xx используется, но ошибка остаётся. Проверьте, не выбраны ли функции/форматы только RGA2 с ограниченным доступом. На RK3588 заливка и YUV422/420 planar принадлежат RGA2, поэтому требуется память ниже 4G. Примеры:

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_dma32_demo.cpp`

`<librga_souce_path>/samples/allocator_demo/src/rga_allocator_graphicbuffer_demo.cpp`

Для mpp_buffer, v4l2_buffer, drm_buffer и других аллокаторов выясните поддержку выделения ниже 4G и используйте подходящий способ.

<!-- en PDF p.45 -->

3) На платформе только с одним ограниченным RGA, например RK3399/RK3568/RK3566 с RGA2, всегда выделяйте подходящую память. Решение совпадает с пунктом 2.

<!-- en PDF p.45 -->

4) Если DRM, malloc, new и другие аллокаторы не умеют ограничивать память ниже 4G, можно глобально ограничить отображение U-Boot диапазоном 0–4G. См. документацию SDK: uboot开发文档 → Chapter-8 调试手段 → 修改DDR容量.

<!-- en PDF p.45 -->

Q4.6: Что вызывает “rga_policy: invalid function policy” и “rga_job: job assign failed”?

A4.6: Включите рабочий журнал драйвера для точной причины. Пример; подробности в разделе отладочных узлов:

<!-- en PDF p.45 -->

```text
/# echo msg > /sys/kerne/debug/rkrga/debug
/# dmesg       //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
```

<!-- en PDF p.45 -->

Проверьте, включён ли MSG, по состоянию переключателя рабочего журнала debug-узла:

<!-- en PDF p.45 -->

```text
/# cat /sys/kerne/debug/rkrga/debug
REG [DIS]
MSG [EN]
TIME [DIS]
INT [DIS]
MM [DIS]
```

<!-- en PDF p.45 -->

Воспроизведите проблему: журнал этапа подбора ядра покажет точную причину отказа задачи:

<!-- en PDF p.46 -->

```text
rga_policy: start policy on core = 4
rga_policy: RGA2 only support under 4G memory! //Indicates that the current RGA2 core only supports memory within 4G.
rga_policy: optional_cores = 0
rga_policy: invalid function policy
rga_policy: assign core: -1
rga_job: job assign failed
rga_policy: start policy on core = 1
rga_policy: core = 1, break on rga_check_dst //Corresponding to the core unsupported reason log, here is the image parameter of the dst channel does not meet the current core requirements (you can check the document to confirm the core support, here core 0x1, 0x2 are RGA3 core, 0x4 is RGA2 core)
rga_policy: start policy on core = 2
rga_policy: core = 2, break on rga_check_dst //Corresponding to the log of reasons not supported by the core, same as above.
rga_policy: start policy on core = 4
rga_policy: RGA2 only support under 4G memory! //Corresponding to the reason log that the core does not support, it indicates that the reason for the current mismatch is that the core does not support memory other than 4G memory space.
  rga_policy: optional_cores = 0
rga_policy: invalid function policy
rga_policy: assign core: -1 // After traversing all cores, if there is no matching core, a matching failure error will be reported.
rga_job: job assign failed
```

<!-- en PDF p.46 -->

В обоих примерах проверьте конфигурацию по журналу и внесите целевые изменения.

<!-- en PDF p.46 -->

Q4.7: Что вызывает “rga:Rga err irq! INT[701],STATS[1]”?

A4.7: Исключение при аппаратной работе RGA, например выход памяти за границы или неверная конфигурация. Сначала проверьте границы переданной памяти.

<!-- en PDF p.46 -->

Q4.8: Что вызывает “rga: Rga sync pid 1001 wait 1 task done timeout”?

A4.8: Причин аппаратного тайм-аута много. Порядок проверки:

<!-- en PDF p.46 -->

1) Убедитесь, что другие модули/приложения не блокируют и не удерживают буфер неправильно. Иначе RGA не может читать/писать; если работа не завершена за 200ms, драйвер возвращает ошибку.

<!-- en PDF p.46 -->

2) Проверьте полосу и загрузку DDR. Из-за низкого приоритета RGA при полной загрузке DDR работа может не завершиться за 200ms, что вызывает ошибку.

<!-- en PDF p.47 -->

3) Проверьте, не сообщали ли ISP, vpu или другие IP об ошибках до RGA. Сбой оборудования на общей шине может мешать RGA; превышение 200ms вызывает ошибку.

<!-- en PDF p.47 -->

4) Проверьте частоту RGA, см. Q1.4. В некоторых случаях модуль общей шины снижает частоту и влияет на RGA. Падение производительности может превысить 200ms и вызвать ошибку.

<!-- en PDF p.47 -->

5) Разгон некоторых чипов повышает частоту без повышения напряжения, резко ухудшая работу; задача не завершается за установленный срок. Верните допустимую частоту. Разгон снижает стабильность и срок службы чипа и настоятельно не рекомендуется.

<!-- en PDF p.47 -->

6) Если вход не FBC, но канал ошибочно настроен как FBC, декодирование не удаётся и возникает тайм-аут. При FBC-конфигурации временно отключите FBC для сравнения.

<!-- en PDF p.47 -->

7) Если причины выше исключены, после тайм-аута сохраните целевую память в файл и проверьте, записал ли RGA часть данных. Если да, повторно проверьте пункты 1–5: производительности не хватает. Если RGA ничего не записал, соберите журналы и результаты опытов и обратитесь к инженерам RGA.

<!-- en PDF p.47 -->

Q4.9: Тайм-аут сопровождается “rga_job: hardware has finished, but the software has timeout!” — почему?

A4.9: CPU-ядро, обслуживающее прерывания, вытеснено: после аппаратного прерывания верхней половины драйвер ждёт softirq нижней половины дольше порога. Частая причина — процесс реального времени, захватывающий CPU. Принудительное вытеснение CPU real-time процессами не рекомендуется. Исправление на стороне CPU: не допускать захвата ядра, который мешает softirq других драйверов.

<!-- en PDF p.47 -->

Q4.10: Почему при нормальном или аварийном выходе процесса появляются сообщения:

`rga_mm: [tgid:500] Decrement the reference of handle[622] when the user exits`

`rga_mm: [tgid:500] Decrement the reference of handle[623] when the user exits`

A4.10: У процесса 500 утечка RGA buffer_handle 622 и 623. Типовые причины:

<!-- en PDF p.47 -->

1) После importbuffer_xx() не вызван releasebuffer_handle(), и handle не освобождён своевременно.

<!-- en PDF p.48 -->

2) Один блок памяти импортирован несколько раз, а releasebuffer_handle() вызван лишь один раз.

<!-- en PDF p.48 -->

3) Аварийный выход приложения: завершающая обработка не выполняется, что эквивалентно отсутствию releasebuffer_handle(). Во всех случаях importbuffer_xx() и releasebuffer_handle() не образуют пары, и при завершении процесса остаются экземпляры buffer_handle. Для защиты памяти драйвер уничтожает их и печатает предупреждение.

Q4.11: Что означает:

`rga: 12491 12491 : ID[58447384]: Only get buffer 1382400 byte from handle[555], but current required 3686400 byte`

A4.11: Параметры изображения требуют 3686400 байт, а buffer_handle содержит только 1382400. Обычно размер при importbuffer_xx() не соответствует фактической обработке. Здесь импортирован буфер 1280 * 720 * 1.5 (NV12) = 1382400 байт, но затем тот же handle используется для 1280 * 720 RGBA8888, требующего 1280 * 720 * 4 = 3686400 байт. Несовпадение размера вызывает ошибку.

Примечание: обе версии V1.1.3, но китайская нумерует RGA driver как 2.2.2, соответствие версий — 2.2.3; английская не нумерует RGA Driver и использует 2.2.2 для соответствия. Нумерация сохранена. Дополнение из китайского источника: в таблице теста RK3566 отдельно указано RGA2-EHANCE (исходное написание), отсутствующее в английской таблице. Также приведён общий пример `echo <cmd> > <节点名>` (последний заполнитель означает имя узла), затем те же конкретные примеры. Команды смешивают /sys/kerne/ и /sys/kernel/; написание сохранено, реальные узлы требуется проверить. Отладочные команды и аппаратные изменения не выполнялись.

{% endraw %}
