---

title: "Rockchip Linux 5.10 Camera: сенсоры, MIPI, 3A, быстрый запуск и AOV"

description: "Rockchip Linux 5.10 Camera: сенсоры, MIPI, 3A, быстрый запуск и AOV · V1.0.3"

excerpt: "Rockchip Linux 5.10 Camera: сенсоры, MIPI, 3A, быстрый запуск и AOV"

translation_key: 186-rockchip-linux510-camera-troubleshooting

slug: 186-rockchip-linux510-camera-troubleshooting

lang: ru

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Справка платформы: V1.0.3 производителя, RV1106/RV1103/RV1103B/RV1106B; Linux 5.10+. Полные разделы ниже посвящены драйверам камеры, подключению сенсоров, захвату и отладке. Конкретные сочетания платы ArmSoM/BSP/SDK/ядра не проверены; сверьте схему, интерфейсы, питание/такты, драйверы и IQ-файлы. Примеры и измерения производителя не являются тестами ArmSoM; команды не выполнялись. ZH использует китайские оригинальные рисунки, EN/RU/DE — английские.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.5; unit 0 -->

## 1. Запуск сенсора

<!-- en PDF p.5; unit 1 -->

### 1.1 ID сенсора не определяется: ошибка связи I2C

<!-- en PDF p.5; unit 2 -->

Если ID сенсора не определяется, исходник связывает это не с RKISP/RKCIF, а с несоблюдением последовательности питания. Проверяйте по порядку:

<!-- en PDF p.5; unit 3 -->

1. Правильно ли задан 7-битный i2c slave id? Не указан ли ошибочно 8-битный адрес?

<!-- en PDF p.5; unit 4 -->

2. Есть ли mclk и правильная амплитуда? Обычно 24MHz, иногда 27MHz.

<!-- en PDF p.5; unit 5 -->

3. Соблюдена ли последовательность питания сенсора: avdd, dovdd, dvdd, power down, reset и прочее?

<!-- en PDF p.5; unit 6 -->

#### 1.1.1 Что такое 7-битный адрес

<!-- en PDF p.5; unit 7 -->

Младший бит LSB 8-битного адреса обозначает R/W; старшие семь бит — нужный i2c slave id.

<!-- en PDF p.5; unit 8 -->

#### 1.1.2 После включения не обнаруживаются mclk 24M и питание vdd

<!-- en PDF p.5; unit 9 -->

Драйвер обычно включает mclk и питание только при необходимости, поэтому после загрузки они по умолчанию выключены. Для измерений можно временно закомментировать реализацию power_off(), чтобы не отключать питание.

<!-- en PDF p.5; unit 10 -->

#### 1.1.3 mclk 24M по-прежнему не обнаруживается

<!-- en PDF p.5; unit 11 -->

Проверьте полосу осциллографа; исходник рекомендует не менее 48M.

<!-- en PDF p.5; unit 12 -->

1. Если сенсор не включает mclk, проверьте операции тактирования по примеру drivers/media/i2c/ov5695.c.

<!-- en PDF p.5; unit 13 -->

2. GPIO может быть занят другим модулем; обычно об этом сообщает журнал ядра. Командой io можно проверить настройки регистра pin-ctrl.

<!-- en PDF p.6; unit 14 -->

#### 1.1.4 Проверка последовательности питания

<!-- en PDF p.6; unit 15 -->

Datasheet задаёт порядок и интервалы включения источников питания. Проверьте их осциллографом. Некоторым сенсорам, например ov5695, порядок подачи vdd не важен: драйвер может использовать regulator_bulk. Другим, например ov2685.c, требуется последовательность и отдельные регуляторы avdd_regulator, dovdd_regulator. Выбирайте по конкретному сенсору.

<!-- en PDF p.6; unit 16 -->

### 1.2 Значения exp_def, hts_def и vts_def в драйвере сенсора

<!-- en PDF p.6; unit 17 -->

<!-- en PDF p.6; unit 18 -->

Получите значения у производителя. Иначе найдите регистры в datasheet и их начальные значения в списке инициализации. Пример ov2685.c:

<!-- en PDF p.6; unit 19 -->

```text
#define OV2685_REG_VTS                  0x380e

...

        {0x380e, 0x05},
        {0x380f, 0x0e},

...

                .vts_def = 0x050e,
```

<!-- en PDF p.6; unit 20 -->

0x380e и 0x380f — регистры vts. При начальном значении 0x050e vts_def равен 0x050e. Значения exp и hts по умолчанию ищите в datasheet. Если приложение не должно менять экспозицию и частоту кадров, exp, hts и vts не требуются; для RAW-сенсора эти три параметра обычно нужны.

<!-- en PDF p.6; unit 21 -->

### 1.3 Значения link_freq и pixel_rate

<!-- en PDF p.6; unit 22 -->

<!-- en PDF p.6; unit 23 -->

link_freq — реальная частота MIPI clk, не mclk 24M, а MIPI dn/dp clk. Спросите производителя или найдите параметр в datasheet. Обычно link_freq не меньше результата следующей формулы, в Гц:

<!-- en PDF p.6; unit 24 -->

```text
link_freq = width * height * fps * bits_per_pixel / lanes / 2
```

<!-- en PDF p.7; unit 25 -->

Если link_freq неизвестен, измерьте его осциллографом. pixel_rate — число пикселей в секунду; по известному link_freq он вычисляется так:

<!-- en PDF p.7; unit 26 -->

```text
pclk = link_freq * 2 * lanes / bits_per_pixel
```

<!-- en PDF p.7; unit 27 -->

### 1.4 Как подтвердить запуск сенсора

<!-- en PDF p.7; unit 28 -->

Сначала должен определяться ID: чтение/запись I2C без ошибок. media-ctl -p -d /dev/media0 должен показывать имя, разрешение и другие сведения сенсора. Пример:

<!-- en PDF p.7; unit 29 -->

```text
# media-ctl -p -d /dev/media0 | tail -n 30
                -> "rkcif_tools_id2":0 []
        pad11: Source
                -> "stream_cif_mipi_id0":0 []
                -> "stream_cif_mipi_id1":0 []
                -> "stream_cif_mipi_id2":0 []
                -> "stream_cif_mipi_id3":0 []
                -> "rkcif_scale_ch0":0 []
                -> "rkcif_scale_ch1":0 []
                -> "rkcif_scale_ch2":0 []
                -> "rkcif_scale_ch3":0 []
                -> "rkcif_tools_id0":0 []
                -> "rkcif_tools_id1":0 []
                -> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
        pad0: Sink
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                <- "m00_b_sc450ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc450ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

<!-- en PDF p.7; unit 30 -->

Если media-ctl/v4l2-ctl не собраны и не включены в систему, используйте dmesg для проверки обнаружения сенсора. При захвате MIPI должен выдавать данные без MIPI/ISP-ошибок, а приложение получать кадры.

<!-- en PDF p.8; unit 31 -->

### 1.5 Кадрированный выход сенсора

<!-- en PDF p.8; unit 32 -->

Чтобы уменьшить выходное разрешение, измените драйвер и IQ-файл. В драйвере реализуйте xxxx_get_selection. Пример sc530ai: 2880x1616 кадрируется до 2560x1440:

<!-- en PDF p.8; unit 33 -->

```text
  +++ b/drivers/media/i2c/sc530ai.c
  @@ -1593,8 +1593,8 @@ static int sc530ai_open(struct v4l2_subdev *sd, struct
v4l2_subdev_fh *fh)
   }
   #endif

  -#define DST_WIDTH 2880
  -#define DST_HEIGHT 1616
  +#define DST_WIDTH 2560
  +#define DST_HEIGHT 1440
```

<!-- en PDF p.8; unit 34 -->

Измените разрешение в IQ-файле на размер кадрированного выхода. Инструкция находится в разделе изменения разрешения IQ (§4.6; оригинальная ссылка указывает раздел 4).

<!-- en PDF p.8; unit 35 -->

### 1.6 Инструмент i2ctransfer

<!-- en PDF p.8; unit 36 -->

При отладке I2C-сенсоров требуется читать/писать регистры. Ниже способы работы i2ctransfer.

<!-- en PDF p.8; unit 37 -->

```text
# i2ctransfer -f -y 4 w3@0x32 0x43 0x24 0x18

4: Represents the I2C bus ID (which can be 0, 1, 2, 3, ...)
w: Represents write
3: Represents writing 3 Bytes
0x32: Represents the I2C device address
The following three data represent the data to be written, where 0x4324 is
assumed to be a 16-bit register address, and 0x18 is the value to be written.

# i2ctransfer -f -y 4 w1@0x30 0x08 r3

4: Represents the I2C bus number (which can be 0, 1, 2, 3, ...)
w: Indicates write
1: Indicates writing 1 Byte
0x30: Represents the I2C device address
r: Represents read
3: Represents reading 3 Bytes

This command means to read 3 Bytes from the address offset by 0x08 from 0x30,
where the number following r indicates the number of bytes to be read.
```

<!-- en PDF p.9; unit 38 -->

Другие применения i2c-tools: https://blog.csdn.net/qq_42952079/article/details/125217208. Для 32-/64-битной Linux-платформы версия i2ctransfer может отличаться. Если инструмента нет, получите его загрузкой или у команды разработки.

<!-- en PDF p.9; unit 39 -->

### 1.7 Список AVL сенсоров

<!-- en PDF p.9; unit 40 -->

AVL RGB-сенсоров: https://redmine.rockchip.com.cn/projects/rockchip_camera_module_support_list/camera. Там приведены сведения о модулях. Для других сенсоров, например YUV, ищите драйверы в drivers/media/i2c ядра; по исходнику эти драйверы уже отлажены Rockchip.

<!-- en PDF p.9; unit 41 -->

### 1.8 Документ по отладке драйвера сенсора

<!-- en PDF p.9; unit 42 -->

Для новых сенсоров RV1106/RV1103 SDK см. /docs/zh/isp/&lt;Rockchip_Driver_Guide_VI_CN_v1.1.5.pdf&gt;.

<!-- en PDF p.9; unit 43 -->

## 2. Ошибки MIPI/ISP

<!-- en PDF p.9; unit 44 -->

При первоначальной отладке часто встречаются:

<!-- en PDF p.9; unit 45 -->

1. Нет кадров и нет ошибок ISP/MIPI.

<!-- en PDF p.9; unit 46 -->

2. Непрерывные сообщения об ошибках MIPI.

<!-- en PDF p.9; unit 47 -->

3. Ошибка ISP PIC_SIZE_ERROR.

<!-- en PDF p.9; unit 48 -->

4. Периодические ошибки MIPI.

<!-- en PDF p.9; unit 49 -->

5. Ошибки MIPI продолжаются до зависания системы.

<!-- en PDF p.9; unit 50 -->

### 2.1 Какие параметры MIPI настраивать

<!-- en PDF p.9; unit 51 -->

Проверьте четыре параметра: разрешение сенсора; формат YUV/RGB RAW и 8/10/12 бит; реальный link_freq; число линий MIPI, которое нужно правильно задать в двух местах DTS.

<!-- en PDF p.10; unit 52 -->

### 2.2 Нет кадров и ошибок ISP/MIPI

<!-- en PDF p.10; unit 53 -->

1. Проверьте журнал ядра, например dmesg \| grep MIPI.

<!-- en PDF p.10; unit 54 -->

2. Проверьте ошибки I2C. Если регистры не записаны, сенсор мог не инициализироваться и не включить выход.

<!-- en PDF p.10; unit 55 -->

3. Измерьте сигналы MIPI clk и data. Если выхода нет, проверяйте инициализацию сенсора и аппаратную часть.

<!-- en PDF p.10; unit 56 -->

4. Если MIPI-сигнал есть, но кадров и ошибок нет: ещё раз проверьте четыре параметра §2.1; убедитесь, что I2C работает и весь список регистров записан. Последним выход включает s_stream(). До него, особенно в s_power(), сигнала MIPI быть не должно: приёмник ещё не готов и может потерять заголовок SOT. Переключите clock lane сенсора из continuous в non-continuous.

<!-- en PDF p.10; unit 57 -->

### 2.3 Команда правильна, но select timeout

<!-- en PDF p.10; unit 58 -->

При захвате RAW иногда нет данных и ошибок в serial, но возникает select timeout. Диагностика:

<!-- en PDF p.10; unit 59 -->

1. По TRM проверьте stop state DPHY, показывающий входные данные. Пример RK3588 CSI0:

<!-- en PDF p.10; unit 60 -->

```text
io -4 -l 0x100 0xfdd30000
```

<!-- en PDF p.10; unit 61 -->

Прочитайте этот регистр десять раз подряд. При распознавании MIPI stop state должен переключаться между 0 и 1.

<!-- en PDF p.10; unit 62 -->

2. Осциллографом проверьте сигналы MIPI.

<!-- en PDF p.10; unit 63 -->

3. Проверьте регистры MIPI-выхода сенсора; рекомендуется читать i2ctransfer.

<!-- en PDF p.10; unit 64 -->

4. Проверьте уровни выводов sleep/reset.

<!-- en PDF p.11; unit 65 -->

### 2.4 Ошибки MIPI

<!-- en PDF p.11; unit 66 -->

#### 2.4.1 Таблицы сообщений MIPI

<!-- en PDF p.11; unit 67 -->

Для RK3288/RK3399/RK3368:

<!-- en PDF p.11; unit 68 -->

| Бит ошибки | Сокращение | Описание |
| --- | --- | --- |
| 25 | ADD_DATA_OVFLW | Переполнение FIFO дополнительных данных |
| 24 | FRAME_END | Кадр принят нормально, не ошибка |
| 23 | ERR_CS | Ошибка контрольной суммы |
| 22 | ERR_ECC1 | Ошибка ECC в 1 бите |
| 21 | ERR_ECC2 | Ошибка ECC в 2 битах |
| 20 | ERR_PROTOCOL | Начало пакета внутри текущего пакета |
| 19:16 | ERR_CONTROL | Ошибка управления PPI, один бит на линию |
| 15:12 | ERR_EOT_SYNC | Ошибка синхронизации MIPI EOT (конец передачи), один бит на линию |
| 11:8 | ERR_SOT_SYNC | Ошибка синхронизации MIPI SOT (начало передачи), один бит на линию |
| 7:4 | ERR_SOT | MIPI SOT (начало передачи), один бит на линию |
| 3:0 | SYNC_FIFO_OVFLW | Переполнение FIFO синхронизации, один бит на линию |

<!-- en PDF p.11; unit 69 -->

Для RK3326/PX30/RK1808 три таблицы ошибок:

<!-- en PDF p.11; unit 70 -->

| Бит ошибки ERR1 | Сокращение | Описание |
| --- | --- | --- |
| 28 | ERR_ECC | Ошибка ECC |
| 27:24 | ERR_CRC | Ошибка CRC |
| 23:20 | ERR_FRAME_DATA | Передача кадра завершена, но есть как минимум одна ошибка CRC |
| 19:16 | ERR_F_SEQ | Номер кадра не последователен, не соответствует ожиданию |
| 15:12 | ERR_F_BNDRY | Начало и конец кадра не соответствуют друг другу |
| 11:8 | ERR_SOT_SYNC | Ошибка синхронизации MIPI SOT (начало передачи), один бит на линию |
| 7:4 | ERR_EOT_SYNC | Ошибка синхронизации MIPI EOT (конец передачи), один бит на линию |

<!-- en PDF p.12; unit 71 -->

| Бит ошибки ERR2 | Сокращение | Описание |
| --- | --- | --- |
| 19:16 | ERR_CONTROL |  |
| 15:12 | ERR_ID |  |
| 11:8 | ERR_ECC_CORRECTED |  |
| 7:4 | ERR_SOTHS | Ошибка PHY SOTHS |
| 3:0 | ERR_ESC | Ошибка PHY ESC |

<!-- en PDF p.12; unit 72 -->

Разбор типичных ошибок приведён ниже.

<!-- en PDF p.12; unit 73 -->

#### 2.4.2 Ошибки SOT/SOT_SYNC

<!-- en PDF p.12; unit 74 -->

SOT (Start of Transmission) и SOT_SYNC — ошибки начала/синхронизации передачи MIPI. SOT должен соответствовать MIPI_D-PHY_Specification. Изучите High-Speed Data Transmission, Start-of-Transmission Sequence, HS Data Transmission Burst, High-Speed Clock Transmission, Global Operation Timing Parameters. Если сенсор уже работал на других платформах, грубое нарушение протокола менее вероятно. Уточните у производителя успешную передачу MIPI, повторно проверьте link_freq для правильного Ths-settle, попробуйте одну линию вместо нескольких. Проверьте физическое соединение: кабели/разъёмы/контакты, повреждения и слабый контакт вызывают ошибки и обрывы. Проверьте устойчивость питания, соединения и соответствие напряжений спецификации. Настройте временные параметры, частоту и задержки линий по документации и советам производителя.

<!-- en PDF p.13; unit 75 -->

Проверьте протокол и соответствие настроек устройств: частота, задержки, режим связи. Изучите журналы SOT/SOT_SYNC, тип, место и время ошибки. Используйте логический/протокольный анализатор или генератор сигналов для наблюдения обмена. Причин несколько: соединения, питание, протокол; универсального исправления нет. Последовательно проверяйте аппаратную, программную и коммуникационную стороны.

<!-- en PDF p.13; unit 76 -->

#### 2.4.3 Ошибки CRC/Checksum(CS), ECC/ECC1/ECC2

<!-- en PDF p.13; unit 77 -->

ECC/CS означают неполные или повреждённые данные. Сначала проверьте аппаратные сигналы; попробуйте одну линию вместо нескольких, поскольку плохая синхронизация вызывает ECC. Проверьте кабели/разъёмы/контакты на повреждения и плохое соединение, устойчивое питание и напряжение по спецификации. Проверьте тактирование и задержки в допустимом диапазоне. Настройка протокола D-PHY/C-PHY должна соответствовать обоим устройствам. Изучите тип, место и время ошибок в журналах.

<!-- en PDF p.14; unit 78 -->

Используйте анализаторы/генераторы для наблюдения MIPI. Если проверки не помогли, обратитесь к производителю или техподдержке для конкретного оборудования. ECC может быть связан с аппаратной неисправностью, помехами или конфигурацией; последовательно проверяйте аппаратную, программную и коммуникационную стороны.

<!-- en PDF p.14; unit 79 -->

#### 2.4.4 ERR_PROTOCOL/ERR_F_BNDRY

<!-- en PDF p.14; unit 80 -->

Ожидаемые EOT/SOT отсутствуют; они должны идти парами. Измерьте осциллограмму. Проверьте протокол, частоту, задержки и режим связи по спецификации. Проверьте стабильность питания/напряжения, кабели, разъёмы и контакты: повреждения вызывают обрывы. Оптимизируйте временные параметры по рекомендациям производителя. Журналы дают тип/место/время ERR_PROTOCOL и ERR_F_BNDRY. Логический/протокольный анализатор либо генератор помогают локализовать проблему.

<!-- en PDF p.15; unit 81 -->

Возможны несовпадение протокола, плохое соединение и неправильные временные параметры. Решение зависит от конкретной системы; проверяйте аппаратную часть, ПО и связь пошагово.

<!-- en PDF p.15; unit 82 -->

#### 2.4.5 Кадры приходят, но MIPI иногда ошибается

<!-- en PDF p.15; unit 83 -->

<!-- en PDF p.15; unit 84 -->

Сверьтесь с таблицами; сигнальные ошибки анализируйте аппаратно. Если ошибка возникает только при запуске захвата, сенсор может выдавать несоответствующий протоколу сигнал при включении. Попробуйте: 1. Полную инициализацию регистров перенести в s_power(): приёмник MIPI ещё не принимает и игнорирует данные. 2. В конце s_power() выключить выход сенсора вызовом stop_stream(). 3. В start_stream() и stop_stream() только включать/выключать MIPI-выход.

<!-- en PDF p.15; unit 85 -->

#### 2.4.6 Много ошибок MIPI или зависание

<!-- en PDF p.15; unit 86 -->

Ухудшенный случай §2.4.5: неправильный MIPI-сигнал вызывает прерывания по уровню, их шторм и зависание. Проверьте меры из §2.4.5.

<!-- en PDF p.15; unit 87 -->

#### 2.4.7 Ошибка ISP PIC_SIZE_ERROR

<!-- en PDF p.15; unit 88 -->

ISP получил не ожидаемые строки/столбцы. Проверьте разрешение всех стадий; сначала устраните MIPI-ошибки. Низкая частота DDR может вызвать задержку и эту ошибку; проверьте при максимальной частоте:

<!-- en PDF p.15; unit 89 -->

```text
echo performance > /sys/class/devfreq/dmc/governor
```

<!-- en PDF p.16; unit 90 -->

2. Не превышает ли разрешение последующего этапа предыдущее? media-ctl -p -d /dev/media0 показывает топологию. Должно выполняться Sensor == MIPI_DPHY &gt;= isp_sd input &gt;= isp_sd output. Без ручных изменений условие обычно выполняется. 3. Правильно ли сенсор выдаёт разрешение? Принудительно уменьшите заявленное разрешение в драйвере. Пример ov7251.c, исходно 640x480:

<!-- en PDF p.16; unit 91 -->

```text
static const struct ov7251_mode supported_modes[] = {
          {
                  .width = 640,
                  .height = 480,
```

<!-- en PDF p.16; unit 92 -->

Уменьшите width/height, например до 320x240, не меняя регистры, чтобы проверить, не превышает ли настроенный размер фактический выход сенсора.

<!-- en PDF p.16; unit 93 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 320,
                .height = 240,
```

<!-- en PDF p.16; unit 94 -->

## 3. Получение изображений

<!-- en PDF p.16; unit 95 -->

В этой главе рассматриваются типичные вопросы захвата изображений.

<!-- en PDF p.16; unit 96 -->

### 3.1 Способы захвата

<!-- en PDF p.16; unit 97 -->

RKISP/RKCIF поддерживают V4L2. Сначала используйте v4l2-ctl из v4l-utils для проверки выхода. Он сохраняет, но не показывает кадры; для просмотра подходят mplayer (Ubuntu/Debian), 7yuv (Windows). Подробности в Rockchip_Developer_Guide_Linux_Camera_CN.pdf и v4l2-ctl --help. Также можно захватывать/сохранять через бинарные demo библиотеки rockit:

<!-- en PDF p.17; unit 98 -->

```text
Common commands include:
# Capture raw image
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -n /dev/video0 -f 131076

# Capture yuv image from the mainpath channel and save it to a file. The file
directory is /data/test_0_0_0.bin, which can be opened with tools like 7yuv.
The file name is based on the dev id, pipe id, and chn id.
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -o 1

# Capture yuv image from the mainpath channel, encode it, and write it to a
file. The file is saved in /data/venc_0.bin, and the file name is related to
the chn id.
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 1 -l 10 -o 1
...
```

<!-- en PDF p.17; unit 99 -->

Другие примеры описаны в документации rockit и их help. Для предпросмотра в реальном времени используйте простой demo SDK:

<!-- en PDF p.17; unit 100 -->

```text
# Use the simple_vi_bind_venc_rtsp demo for real-time preview via rtsp
(configure the board-side IP with tools like vlc or potplayer).
simple_vi_bind_venc_rtsp -I 0 -w 1920 -h 1080 (rtsp://ip/live/0)
```

<!-- en PDF p.17; unit 101 -->

### 3.2 Неверные цвет и яркость захваченного изображения

<!-- en PDF p.17; unit 102 -->

Способ проверки зависит от сенсора:

<!-- en PDF p.17; unit 103 -->

1. Для RAW RGB (RGGB, BGGR и т. п.) должны правильно работать AE, AF и AWB. См. раздел о 3A. После проверки 3A проверьте формат разбора/отображения изображения и порядок UV.

<!-- en PDF p.17; unit 104 -->

2. Для YUV, RGB565 или RGB888 ISP работает в обходном режиме. При неверном цвете проверьте формат выхода сенсора и порядок UV. Если настройки верны, обратитесь к изготовителю сенсора; при явно неверной яркости также обратитесь к нему.

<!-- en PDF p.18; unit 105 -->

### 3.3 Топология ISP и команда media-ctl

<!-- en PDF p.18; unit 106 -->

<!-- en PDF p.18; unit 107 -->

RKISP/RKCIF подключают несколько сенсоров с временным разделением. RKISP также имеет несколько ступеней кадрирования. Узлы образуют цепочку, параметры каждого настраиваются через media-ctl. Подробности: Rockchip_Developer_Guide_Linux_Camera_CN.pdf.

<!-- en PDF p.18; unit 108 -->

#### 3.3.1 Несколько сенсоров на одном ISP

<!-- en PDF p.18; unit 109 -->

Поддерживается только временное разделение. Подключите несколько сенсоров к MIPI DPHY в DTS, затем переключайте их командой media-ctl.

<!-- en PDF p.18; unit 110 -->

### 3.4 Совпадает ли захваченный ISP RAW с оригиналом?

<!-- en PDF p.18; unit 111 -->

<!-- en PDF p.18; unit 112 -->

При захвате RAW (RGGB, BGGR) в обходном режиме требуется 8-битное выравнивание. Недостающие младшие разряды заполняются нулями: исходные 8- и 16-битные изображения передаются без дополнения; 10- и 12-битные пиксели дополняются младшими нулями до 16 бит. RAW выводит только видеоустройство MP; SP этого не поддерживает.

<!-- en PDF p.18; unit 113 -->

### 3.5 Одновременный вывод MP и SP

<!-- en PDF p.18; unit 114 -->

Одно изображение сенсора может одновременно проходить отдельное кадрирование и преобразование формата через SP и MP. Их возможности различаются; см. Rockchip_Developer_Guide_Linux_Camera_CN.pdf. Одновременный вывод возможен только для RGB/YUV на обоих путях. При RAW на MP путь SP изображения не выдаёт.

<!-- en PDF p.18; unit 115 -->

### 3.6 Поддерживает ли ISP увеличение?

<!-- en PDF p.18; unit 116 -->

Аппаратно поддерживает, но использовать не рекомендуется; драйвер по умолчанию отключает эту функцию.

<!-- en PDF p.19; unit 117 -->

### 3.7 Поддерживает ли ISP поворот?

<!-- en PDF p.19; unit 118 -->

Нет. Для отражения/переворота сначала используйте функцию сенсора, если она имеется: это наиболее эффективно. Иначе рассмотрите RGA: код и демонстрации находятся в external/linux-rga/, документация — в docs/.

<!-- en PDF p.19; unit 119 -->

### 3.8 Захват оттенков серого GREY

<!-- en PDF p.19; unit 120 -->

При YUV на выходе ISP либо Y8 на выходе сенсора приложение может непосредственно захватывать V4L2_PIX_FMT_GREY (FourCC GREY).

<!-- en PDF p.19; unit 121 -->

### 3.9 Как различить MP, SP и BP

<!-- en PDF p.19; unit 122 -->

Посмотрите топологию командой media-ctl -p -d /dev/media0; при нескольких устройствах также проверьте /dev/media1 и /dev/media2. Фрагмент вывода:

<!-- en PDF p.19; unit 123 -->

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              // Indicates that this
entity is MP (MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 // The corresponding
device node is /dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              // Indicates that this
entity is SP (SelfPath)
            type Node subtype V4L flags 0
            device node name /dev/video2                 // The corresponding
device node is /dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

<!-- en PDF p.19; unit 124 -->

Без media-ctl можно искать узлы через /sys/:

<!-- en PDF p.20; unit 125 -->

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # MP node corresponds to
/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # SP node corresponds to
/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

<!-- en PDF p.20; unit 126 -->

Для RV1106/RV1103 имеются BP и каналы понижения разрешения MP/BP. Ниже полный вывод узлов; английский исходный текст повторяет упоминание BP.

<!-- en PDF p.20; unit 127 -->

```text
# media-ctl -p -d /dev/media1
...
- entity 6: rkisp_mainpath (1 pad, 1 link)
            type Node subtype V4L flags 0
            device node name /dev/video11
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 12: rkisp_selfpath (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video12
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 18: rkisp_bypasspath (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video13
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 24: rkisp_mainpath_4x4sampling (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video14
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]

- entity 30: rkisp_bypasspath_4x4sampling (1 pad, 1 link)
             type Node subtype V4L flags 0
             device node name /dev/video15
        pad0: Sink
                <- "rkisp-isp-subdev":2 [ENABLED]
 ...
```

<!-- en PDF p.20; unit 128 -->

### 3.10 Разрыв изображения

<!-- en PDF p.20; unit 129 -->

Помехи на MIPI могут вызывать разрыв экрана. Воздействие на линии данных/тактов воспроизводит проблему, причём положение разрыва меняется.

<!-- en PDF p.21; unit 130 -->

Два случая. Разрыв при запуске: перед захватом устройство не было сброшено; нужны программный и аппаратный сброс. Ниже пример RN6725V1 из исходника:

<!-- en PDF p.21; unit 131 -->

![Рисунок оригинала · EN PDF p.21](/docs/rockchip-linux510-camera-troubleshooting/assets/en-p021-figure-01.png)

```c
ret = rn6752_write(client, 0x80, 0x31);
usleep_range(200, 500);
ret |= rn6752_write(client, 0x80, 0x30);
if (ret)
{
    dev_err(&client->dev, "rn6752 soft reset failed\n");
    return ret;
}
```

<!-- en PDF p.21; unit 132 -->

Разрыв во время работы: аппаратные помехи нарушают нормальное изображение. Например, CSI0 даёт разрыв, а CSI1 — нет, поскольку CSI0 проходит через VICP, тогда как CSI1 соединён непосредственно с ISP. Если VICAP не включил обнаружение ошибок изображения, добавьте его для канала CIF; см. настройку аварийного сброса VICAP.

<!-- en PDF p.21; unit 133 -->

### 3.11 Увеличение частоты ISP

<!-- en PDF p.21; unit 134 -->

На RV1106/RV1103 при медленном выводе, обработке ISP или задержках системы иногда требуется повысить частоту ISP. Последовательность:

<!-- en PDF p.21; unit 135 -->

```text
# cat /proc/clk/summary | grep isp
        clk_core_isp3p2       1        1        0   339428572          0     0
 50000
        aclk_isp3p2           1        1        0   339428572          0     0
 50000
        hclk_isp3p2           1        1        0   148500000          0     0
 50000
        isp0clk_vicap         2        2        0           0          0     0
 50000
```

<!-- en PDF p.21; unit 136 -->

Установка частоты: echo [clk_name] [rate(Hz)] &gt; /proc/clk/rate. Пример:

<!-- en PDF p.22; unit 137 -->

```text
# echo clk_core_isp3p2 420000000 > /proc/clk/rate

# cat /proc/clk/summary | grep isp
            aclk_isp3p2           1        1        0   339428572          0
0  50000
            hclk_isp3p2           1        1        0   148500000          0
0  50000
            clk_core_isp3p2       1        1        0   420000000          0
0  50000
            isp0clk_vicap         2        2        0           0          0
0  50000
```

<!-- en PDF p.23; unit 138 -->

## 4. Вопросы 3A

<!-- en PDF p.23; unit 139 -->

Для RAW BAYER RGB (RGGB, BGGR и т. п.) обработку предоставляет RKISP. Способ работы 3A зависит от версии camera_engine_rkaiq; по возможности обновите её. Сначала проверьте поддержку модуля: для поддерживаемого есть JSON в media/isp/camera_engine_rkaiq/rkaiq/iqfiles/. Иначе запросите настройку модуля через канал поддержки поставщика.

<!-- en PDF p.23; unit 140 -->

### 4.1 Проверка версии camera_engine_rkaiq

<!-- en PDF p.23; unit 141 -->

По исходному коду:

<!-- en PDF p.23; unit 142 -->

```text
# grep RK_AIQ_VERSION_REAL media/isp/camera_engine_rkaiq/rkaiq/RkAiqVersion.h

#define RK_AIQ_VERSION_REAL_V "v5.0x5.0"
```

<!-- en PDF p.23; unit 143 -->

#### 4.1.1 Требуемая версия драйвера rkisp для camera_engine_rkaiq

<!-- en PDF p.23; unit 144 -->

<!-- en PDF p.23; unit 145 -->

Требуется определённая версия драйвера rkisp; держите её актуальной. В исходной фразе указано camera_engine_rkisp. Проверка версии ISP по коду ядра:

<!-- en PDF p.23; unit 146 -->

```text
# grep RKISP_DRIVER_VERSION drivers/media/platform/rockchip/isp/version.h
```

<!-- en PDF p.23; unit 147 -->

Проверка версии ISP по журналу ядра:

<!-- en PDF p.23; unit 148 -->

```text
  # dmesg | grep "version"

dmesg | grep "version"
[    0.848252] udevd[65]: starting version 3.2.7
[    3.889404] imx415 4-001a: driver version: 00.01.08
[    3.967388] os04a10 4-0036: driver version: 00.01.05
[    4.084418] sc4336 4-0030-3: driver version: 00.01.01
[    4.114867] sc3336 4-0030-1: driver version: 00.01.01
[    4.152066] sc530ai 4-0030: driver version: 00.01.01
[    4.180572] sc200ai 4-0030-6: driver version: 00.01.09
[    4.237776] rkcif rkcif-mipi-lvds: rkcif driver version: v00.02.00
[    4.260419] rkisp rkisp-vir0: rkisp driver version: v02.05.00
```

<!-- en PDF p.24; unit 149 -->

### 4.2 Обновление camera_engine_rkaiq

<!-- en PDF p.24; unit 150 -->

Исходник объявляет три части; ниже приведены фактически перечисленные пункты:

<!-- en PDF p.24; unit 151 -->

1. camera_engine_rkaiq находится в media/isp/camera_engine_rkaiq SDK. Обновляйте git/repo; можно обновить только этот каталог, не затрагивая остальные.

<!-- en PDF p.24; unit 152 -->

2. Обновите ядро согласно требованиям camera_engine_rkaiq. В git log каталога media/isp/camera_engine_rkaiq найдите требуемую версию rkisp. Пример:

<!-- en PDF p.24; unit 153 -->

```text
 # git log
commit 3d71d22e1e1cc080cd299b914e4e8daac2a58329
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Sun Feb 18 10:17:18 2024 +0800

    release v5.0x5.0

    cherry-pick:
    6227d46 Revert "fastboot: remove rk_aiq_uapi2_sysctl_preInit_tb_info"
    f8efdd6 Revert "fastboot: _first_awb_cfg use pointer replace struct"
```

<!-- en PDF p.24; unit 154 -->

### 4.3 Проверка нормальной работы 3A

<!-- en PDF p.24; unit 155 -->

Проверьте цвет и экспозицию захваченных кадров и наличие фонового процесса rkisp_3A_server:

<!-- en PDF p.24; unit 156 -->

```text
# ps -ef | grep rkisp_3A_server
  706 root      9176 S    /usr/bin/rkisp_3A_server --mmedia=/dev/media1
  746 root      2408 S    grep rkisp_3A_server
# pidof rkisp_3A_server
706
```

<!-- en PDF p.24; unit 157 -->

Здесь rkisp_3A_server имеет PID 706.

<!-- en PDF p.24; unit 158 -->

#### 4.3.1 Процесс rkisp_3A_server отсутствует

<!-- en PDF p.24; unit 159 -->

Проверьте /usr/bin/rkisp_3A_server. Если файла нет, проверьте версию и сборку camera_engine_rkaiq. В /var/log/syslog ищите ошибки rkisp_3A, в том числе отсутствующий/несовместимый IQ-файл xxx.json. Запустите rkisp_3A_server --mmedia=/dev/media0 в оболочке, выбрав media-устройство соответствующего /dev/video, и захватывайте кадры из другой оболочки. Получите сообщения ошибок сервера.

<!-- en PDF p.25; unit 160 -->

#### 4.3.2 Запуск rkisp_3A_server

<!-- en PDF p.25; unit 161 -->

В Linux SDK сервер запускается в фоне скриптом /etc/init.d/S40rkisp_3A. Если файла нет, проверьте версию camera_engine_rkisp и сценарий сборки пакета buildroot.

<!-- en PDF p.25; unit 162 -->

#### 4.3.3 Имя и путь IQ-файла сенсора

<!-- en PDF p.25; unit 163 -->

Имя состоит из типа сенсора (например, sc200ai), имени модуля из DTS (на rv1106g2 rk evb: rockchip,camera-module-name = "CMK-OT2115-PC1";) и объектива (rockchip,camera-module-lens-name = "30IRC-F16";). Получается sc200ai_CMK-OT2115-PC1_30IRC-F16.json в /etc/iqfiles/. Регистр символов важен.

<!-- en PDF p.25; unit 164 -->

### 4.4 Ручная экспозиция

<!-- en PDF p.25; unit 165 -->

Сначала остановите rkisp_3A_server. Затем используйте rkisp_demo.cpp или исходники librkisp_api.so как образец.

<!-- en PDF p.25; unit 166 -->

### 4.5 Журнал librkaiq

<!-- en PDF p.25; unit 167 -->

Переменная окружения persist_camera_engine_log задаёт биты:

<!-- en PDF p.25; unit 168 -->

```text
bits:    23-20   19-16 15-12  11-8  7-4   3-0
module: [xcore]  [ISP] [AF]   [AWB] [AEC] [NO]

0: error
1: warning
2: info
3: verbose
4: debug
```

<!-- en PDF p.25; unit 169 -->

Например, включение отладочных журналов ISP и AWB:

<!-- en PDF p.25; unit 170 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x040400
# /usr/bin/rkisp_3A_server &
```

<!-- en PDF p.26; unit 171 -->

### 4.6 Изменение разрешения в IQ-файле

<!-- en PDF p.26; unit 172 -->

Для существующего IQ-файла измените width и height поля sensor_calib на целевой размер. Найдите все упоминания исходного разрешения и замените целевым. Для LSC найдите lsc_v2: каждый из 16 элементов lsc_sect_size_x равен dst_width / 16; каждый из 16 элементов lsc_sect_size_y — dst_height / 16. Обновите все такие массивы во всех сценариях (день, ночь, HDR).

<!-- en PDF p.26; unit 173 -->

## 5. Разработка приложений

<!-- en PDF p.26; unit 174 -->

Пример на C: Linux SDK содержит rkisp_demo и его исходники. Как v4l2-ctl, он захватывает кадры без отображения и служит прежде всего примером кода. Каталог: &lt;SDK&gt;/media/isp/camera_engine_rkaiq/rkisp_demo. IPC SDK также содержит sample demo и simple demo. Sample использует мультимедийную библиотеку rockit и rkaiq для отдельных модулей/функций. Код: &lt;SDK&gt;/media/samples/example.

<!-- en PDF p.26; unit 175 -->

```text
.
├── audio
│   ├── Makefile
│   ├── sample_ai_aenc.c
│   └── sample_ai.c
├── avs
│   ├── Makefile
│   ├── sample_avs.c
│   └── sample_multi_vi_avs.c
├── common
│   ├── fillimage.c
│   ├── isp2.x
```

<!-- en PDF p.27; unit 176 -->

```text
│   ├── isp3.x
│   ├── lib
│   ├── loadbmp.c
│   ├── loadbmp.h
│   ├── Makefile
│   ├── sample_comm_aenc.c
│   ├── sample_comm_ai.c
│   ├── sample_comm_ao.c
│   ├── sample_comm_avs.c
│   ├── sample_comm.c
│   ├── sample_comm.h
│   ├── sample_comm_iva.c
│   ├── sample_comm_ivs.c
│   ├── sample_comm.o
│   ├── sample_comm_rgn.c
│   ├── sample_comm_tde.c
│   ├── sample_comm_venc.c
│   ├── sample_comm_vi.c
│   ├── sample_comm_vo.c
│   ├── sample_comm_vpss.c
├── demo
│   ├── Makefile
│   ├── sample_demo_aiisp.c
│   ├── sample_demo_dual_aiisp.c
│   ├── sample_demo_dual_camera.c
│   ├── sample_demo_dual_camera_wrap.c
│   ├── sample_demo_multi_camera_eptz.c
│   ├── sample_demo_vi_avs_venc.c
│   ├── sample_demo_vi_venc.c
│   └── sample_rv1103_dual_memory_opt.c
├── Makefile
├── out
│   ├── bin
│   └── install_to_userdata
├── test
│   ├── Makefile
│   ├── sample_ai_aenc_adec_ao_stresstest.c
│   ├── sample_avs_stresstest.c
│   ├── sample_demo_aiisp_stresstest.c
│   ├── sample_demo_dual_aiisp_stresstest.c
│   ├── sample_demo_vi_avs_venc_stresstest.c
│   ├── sample_demo_vi_venc_stresstest.c
│   ├── sample_isp_stresstest.c
│   ├── sample_mulit_isp_stresstest.c
│   ├── sample_rgn_stresstest.c
│   ├── sample_venc_stresstest.c
│   ├── sample_vpss_stresstest.c
│   └── source
├── venc
│   ├── Makefile
│   ├── sample_multi_vi_avs_osd_venc.c
│   └── sample_vi_vpss_osd_venc.c
├── vi
│   ├── Makefile
│   ├── sample_multi_vi.c
│   ├── sample_vi.c
```

<!-- en PDF p.28; unit 177 -->

```text
│   └── sample_vi_eis.c
└── vo
    ├── Makefile
    └── sample_vi_vo.c
```

<!-- en PDF p.28; unit 178 -->

demo содержит примеры приложений, test — стресс-тесты. Остальные каталоги разделены по модулям common, VI, VO, VENC, AUDIO, AVS и т. п.

<!-- en PDF p.28; unit 179 -->

## 6. Быстрый запуск

<!-- en PDF p.28; unit 180 -->

### 6.1 Изменения DTS

<!-- en PDF p.28; unit 181 -->

1. По схеме платы настройте соединения сенсора, выводы включения/выключения питания и домены питания.

<!-- en PDF p.28; unit 182 -->

2. Правильно выделите память rkisp_thunderboot. Размеры и смещения ramdisk_r/ramdisk_c зависят от разрешения сенсора и числа офлайновых буферов VICAP. RV1106/RV1103:

<!-- en PDF p.28; unit 183 -->

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
    * vicap, capture raw10, ceil(w*10/8/256)*256*h *4(buf num)
    * e.g. 2304x1296: 0xf30000
    */
 // 2560 x 1440: 0x1248000
    reg = <0x00860000 0x1248000>;

&ramdisk_r {
reg = <0x1aa8000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x24a8000 (5 * 0x00100000)>;
};
```

<!-- en PDF p.28; unit 184 -->

RV1103B/RV1106B:

<!-- en PDF p.28; unit 185 -->

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
     * vicap, capture raw10, ceil(w*10/8/256)*256*h *3(buf num) +
sizeof(rkisp_thunderboot_resmem_head)
     * In RV1103B the size of rkisp_thunderboot_resmem_head is 0x9000, and it
is 0x6000 in RV1103/RV1106
     * e.g. 2688x1520: 0xf96000(raw picture size) + 0x9000 = 0xf9f000
     */
```

<!-- en PDF p.29; unit 186 -->

```text
    reg = <0x00860000 0xf9f000>;
};

&ramdisk_r {
    reg = <0x17ff000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x21ff000 (4 * 0x00100000)>;
};
```

<!-- en PDF p.29; unit 187 -->

### 6.2 Драйвер сенсора ядра

<!-- en PDF p.29; unit 188 -->

1. По Rockchip_RV1106_RV1103_Quick_Start_Linux_Battery_IPC_Doorbell_CN.md добавьте поддержку быстрого запуска. В этом режиме start stream не записывает полную последовательность регистров сенсора, а только регистр запуска потока.

<!-- en PDF p.29; unit 189 -->

```text
static int __sc401ai_start_stream(struct sc401ai *sc401ai)
{
    int ret;

    if (!sc401ai->is_thunderboot) {
        ret = sc401ai_write_array(sc401ai->client, sc401ai->cur_mode->reg_list);
        if (ret)
            return ret;

        /* In case these controls are set before streaming */
        ret = __v4l2_ctrl_handler_setup(&sc401ai->ctrl_handler);
        if (ret)
            return ret;
    }

    // Only write the start stream register.
    return sc401ai_write_reg(sc401ai->client,
                             SC401AI_REG_CTRL_MODE,
                             SC401AI_REG_VALUE_08BIT,
                             SC401AI_MODE_STREAMING);
}
```

<!-- en PDF p.29; unit 190 -->

2. Правильно реализуйте экспозицию, усиление и VBLANK, иначе изображение может быть искажено.

<!-- en PDF p.29; unit 191 -->

```text
static int sc401ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ......

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE:  // Exposure
        if (sc401ai->cur_mode->hdr_mode == NO_HDR) {
```

<!-- en PDF p.30; unit 192 -->

```text
        val = ctrl->val << 1;
        /* 4 least significant bits of exposure are fractional part */
        ret = sc401ai_write_reg(sc401ai->client,
                                 SC401AI_REG_EXPOSURE_H,
                                 SC401AI_REG_VALUE_08BIT,
                                 SC401AI_FETCH_EXP_H(val));
        ret |= sc401ai_write_reg(sc401ai->client,
                                  SC401AI_REG_EXPOSURE_M,
                                  SC401AI_REG_VALUE_08BIT,
                                  SC401AI_FETCH_EXP_M(val));
        ret |= sc401ai_write_reg(sc401ai->client,
                                  SC401AI_REG_EXPOSURE_L,
                                  SC401AI_REG_VALUE_08BIT,
                                  SC401AI_FETCH_EXP_L(val));
    }
    break;
case V4L2_CID_ANALOGUE_GAIN:  // Analog Gain
    if (sc401ai->cur_mode->hdr_mode == NO_HDR)
        ret = sc401ai_set_gain_reg(sc401ai, ctrl->val);
    break;
case V4L2_CID_VBLANK:  // VBLANK, affects frame rate
    ret = sc401ai_write_reg(sc401ai->client,
                             SC401AI_REG_VTS_H,
                             SC401AI_REG_VALUE_08BIT,
                             (ctrl->val + sc401ai->cur_mode->height)
                             >> 8);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_REG_VTS_L,
                              SC401AI_REG_VALUE_08BIT,
                              (ctrl->val + sc401ai->cur_mode->height)
                              & 0xff);
    if (!ret)
        sc401ai->cur_vts = ctrl->val + sc401ai->cur_mode->height;
    sc401ai_modify_fps_info(sc401ai);
    break;
case V4L2_CID_TEST_PATTERN:  // pattern test mode
    ret = sc401ai_enable_test_pattern(sc401ai, ctrl->val);
    break;
case V4L2_CID_HFLIP:  // Horizontal mirror
    ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                            SC401AI_REG_VALUE_08BIT, &val);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_FLIP_MIRROR_REG,
                              SC401AI_REG_VALUE_08BIT,
                              SC401AI_FETCH_MIRROR(val, ctrl->val));
    break;
case V4L2_CID_VFLIP:  // Vertical flip
    ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                            SC401AI_REG_VALUE_08BIT, &val);
    ret |= sc401ai_write_reg(sc401ai->client,
                              SC401AI_FLIP_MIRROR_REG,
                              SC401AI_REG_VALUE_08BIT,
                              SC401AI_FETCH_FLIP(val, ctrl->val));
    break;

    ......
```

<!-- en PDF p.31; unit 193 -->

```text
    }

    pm_runtime_put(&client->dev);
    return ret;
}
```

<!-- en PDF p.31; unit 194 -->

### 6.3 Драйвер сенсора MCU RTT

<!-- en PDF p.31; unit 195 -->

При разработке драйвера RTT учитывайте:

<!-- en PDF p.31; unit 196 -->

1. В последовательностях малого и большого разрешения не должно быть включения MIPI или запуска потока сенсора. Иначе нарушается сходимость AE на стадии RTT, а после перехода в ядро нельзя получить поток большого разрешения.

<!-- en PDF p.31; unit 197 -->

```text
static const uint8_t g_sc401ai_2560x1440_30fps_reg_table[] = {
    ......
    0x3,  0x36,  0xf9,  0x14,
    // 0x3,  0x01,  0x00,  0x01,  // The 0x0100 register, which used to start
stream of the sensor, should not be configured
    0x3a,
}
```

<!-- en PDF p.31; unit 198 -->

2. Расчёт экспозиции и усиления должен соответствовать драйверу сенсора ядра.

<!-- en PDF p.31; unit 199 -->

### 6.4 IQ-файлы сенсора

<!-- en PDF p.31; unit 200 -->

Используйте правильный IQ-файл; преобразуйте JSON в BIN:

<!-- en PDF p.31; unit 201 -->

```text
./media/isp/release_camera_engine_rkaiq_rv1106_arm-rockchip830-linux-
uclibcgnueabihf/host/j2s4b input_json_file output_bin_file
```

<!-- en PDF p.31; unit 202 -->

Для быстрой сборки после изменения IQ поместите BIN непосредственно в output/out/media_out/isp_iqfiles:

<!-- en PDF p.31; unit 203 -->

```text
cd output/out/media_out/isp_iqfiles
```

<!-- en PDF p.31; unit 204 -->

Преобразование инструментом j2s4b:

<!-- en PDF p.31; unit 205 -->

```text
../host/j2s4b mis2032_CMK-OT2115-PC1_30IRC-F16.json mis2032_CMK-OT2115-
PC1_30IRC-F16.bin
```

<!-- en PDF p.31; unit 206 -->

Соберите и прошейте раздел meta:

<!-- en PDF p.31; unit 207 -->

```text
cd -
./build.sh meta
```

<!-- en PDF p.32; unit 208 -->

Либо передайте IQ BIN на плату, обновите параметр sensor_iq_bin раздела meta по документации SDK и перезагрузите плату. Если первые кадры быстрого запуска зелёные, проверьте AWB/экспозицию и включите earlierAwbAct в JSON:

<!-- en PDF p.32; unit 209 -->

```text
"earlierAwbAct": {
  "enable": 1,
  ...
}
```

<!-- en PDF p.32; unit 210 -->

Одновременно отключите модуль CAC:

<!-- en PDF p.32; unit 211 -->

```text
"cac_v11": {
  "SettingPara": {
    "enable": 0,
  }
}
```

<!-- en PDF p.32; unit 212 -->

### 6.5 Устранение неисправностей

<!-- en PDF p.32; unit 213 -->

#### 6.5.1 Не найдена конфигурация основного сенсора камеры

<!-- en PDF p.32; unit 214 -->

При сборке прошивки может возникнуть ошибка отсутствующей конфигурации основного сенсора:

<!-- en PDF p.32; unit 215 -->

```text
[build_meta.sh:error] Not found main camera sensor config, please add
[support_sensors] in build_meta.sh
```

<!-- en PDF p.32; unit 216 -->

Проверьте наличие IQ-файла и поддержку сенсора в build_meta.sh. В конфигурации платы установите RK_CAMERA_SENSOR_IQFILES в IQ-файл текущего сенсора. Положите соответствующий IQ BIN в output/out/media_out/isp_iqfiles, соберите ядро и прошивку, заново прошейте boot.

<!-- en PDF p.32; unit 217 -->

#### 6.5.2 Настройка светочувствительности

<!-- en PDF p.32; unit 218 -->

На стадии RTT возникает следующая ошибка:

<!-- en PDF p.33; unit 219 -->

```text
Meta: ok
## Verified-boot: 0

iq_bin_mode=0
scene(day) frmRate: mode=0, val=25, keep fps
scene(night) frmRate: mode=1, val=25, update fps=15
load iq bin file finished!
gc5603-sensor_0 cur resolution, width 1480, height 832, fps 60!
gc5603-sensor_0 find dst resolution, width 2880, height 1616, fps 15!
[FASTAE]: fps/hts/vts: RTT=[60, 3223, 875], MainAIQ=[15, 3200, 3500]
[AELIB]: fastae: 3.0.5
[FASTAE]: ADC run failed! can't find rk_adc0 device!
Illegal instruction
```

<!-- en PDF p.33; unit 220 -->

Обычно неверно настроен тип определения освещённости в meta: программный, аналоговый или цифровой.

<!-- en PDF p.33; unit 221 -->

```text
typedef enum  {
    ALS_TYPE_NONE    = 0,   // Software Light Sensitivity
    ALS_TYPE_ANALOG  = 1,   // Analog Light Sensitivity
    ALS_TYPE_DIGITAL = 2,   // Digital Light Sensitivity
} eALS_TYPE;
```

<!-- en PDF p.33; unit 222 -->

В procject/make_meta/sensor_init/xxx_init.c задайте тип, используемый проектом (написание procject сохранено из исходника).

<!-- en PDF p.33; unit 223 -->

```text
.als_type = ALS_TYPE_ANALOG,
.als_value = FIX2INT16(10.0),
```

<!-- en PDF p.33; unit 224 -->

Для ALS_TYPE_ANALOG в конфигурации платы соответствующего сенсора SDK/sysdrv/source/mcu/rt-thread/bsp/rockchip/xxx_mcu/board/ включите CONFIG_RT_USING_SARADC=y. Для программного ALS_TYPE_NONE этот параметр должен быть выключен: #CONFIG_RT_USING_SARADC is not set.

<!-- en PDF p.33; unit 225 -->

#### 6.5.3 Сбой ядра

<!-- en PDF p.33; unit 226 -->

После RTT при переходе к ядру возникает исключение rk_csirx_irq1_handler. Драйвер host уже зарегистрирован, но на стадии RTT возникла ошибка MIPI и прерывание err1. RTT почти завершён и выключает тактирование host; обращение к регистру в обработчике вызывает ошибку.

<!-- en PDF p.34; unit 227 -->

```text
[    0.274655] [<b037486c>] (rk_csirx_irq1_handler) from [<b022e2a7>]
(__handle_irq_event_percpu+0x25/0x7e)
        [    0.275490] [<b022e2a7>] (__handle_irq_event_percpu) from [<b022e30f>]
(handle_irq_event_percpu+0xf/0x30)
        [    0.276334] [<b022e30f>] (handle_irq_event_percpu) from [<b022e34b>]
(handle_irq_event+0x1b/0x28)
        [    0.277121] [<b022e34b>] (handle_irq_event) from [<b02300d9>]
(handle_fasteoi_irq+0x57/0x90)
        [    0.277864] [<b02300d9>] (handle_fasteoi_irq) from [<b022df6f>]
(__handle_domain_irq+0x4b/0x64)
        [    0.278630] [<b022df6f>] (__handle_domain_irq) from [<b02ee983>]
(gic_handle_irq+0x41/0x4e)
        [    0.279375] [<b02ee983>] (gic_handle_irq) from [<b0208d13>]
(__irq_svc+0x53/0x7c)
```

<!-- en PDF p.34; unit 228 -->

Решение: обновить rkcif, добавив обработку исключения прерывания.

<!-- en PDF p.34; unit 229 -->

#### 6.5.4 Проверка сенсора без объектива

<!-- en PDF p.34; unit 230 -->

Включите тестовый pattern (цветные полосы/оттенки серого). Добавьте настройку в интерфейс запуска потока перед записью регистра stream. Пример SC200AI:

<!-- en PDF p.34; unit 231 -->

```text
#define SC200AI_REG_TEST_PATTERN    0x4501
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3)
...
static int sc200ai_enable_test_pattern(struct sc200ai *sc200ai, u32 pattern)
{
    u32 val = 0;
    int ret = 0;

    ret = sc200ai_read_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                           SC200AI_REG_VALUE_08BIT, &val);
    if (pattern)
        val |= SC200AI_TEST_PATTERN_BIT_MASK;
    else
        val &= ~SC200AI_TEST_PATTERN_BIT_MASK;

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                             SC200AI_REG_VALUE_08BIT, val);
    return ret;
}

static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ...
    case V4L2_CID_TEST_PATTERN:
        ret = sc200ai_enable_test_pattern(sc200ai, ctrl->val);
```

<!-- en PDF p.35; unit 232 -->

```text
        break;
    ...
}
```

<!-- en PDF p.35; unit 233 -->

#### 6.5.5 Постоянные MIPI SIZE ERROR после запуска ядра

<!-- en PDF p.35; unit 234 -->

Проверьте реальные ширину/высоту кадра стадии RTT и сверяйте конфигурацию регистров сенсора с его руководством.

<!-- en PDF p.35; unit 235 -->

#### 6.5.6 Failed to stop decompress: decompress@ff520000

<!-- en PDF p.35; unit 236 -->

При ошибке распаковки ядра ret=-119 попробуйте снизить максимальную частоту spi_nor в sysdrv/source/uboot/u-boot/arch/arm/dts/rv1106-evb2.dts до 100MHz или ниже.

<!-- en PDF p.35; unit 237 -->

```text
&spi nor {
        spi-max-frequency = <125000000> to spi-max-frequency = <100000000>
```

<!-- en PDF p.35; unit 238 -->

#### 6.5.7 Failed to stop decompress: decompress@ff520000, ret=-110

<!-- en PDF p.35; unit 239 -->

При ret=-110 попробуйте уменьшить размеры ramdisk и CMA: ни один не должен быть слишком большим.

<!-- en PDF p.35; unit 240 -->

#### 6.5.8 Отключение автозапуска приложения быстрого старта

<!-- en PDF p.35; unit 241 -->

Автозапуск из сценария ядра может мешать разработке. Следующая команда meta отключает автозапуск:

<!-- en PDF p.35; unit 242 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline NoAuto=1
```

<!-- en PDF p.35; unit 243 -->

Включение журнала AE одновременно с отключением автозапуска:

<!-- en PDF p.35; unit 244 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline "persist_camera_engine_log=0x1ff4 NoAuto=1"
```

<!-- en PDF p.35; unit 245 -->

Примечание: команда поддерживается только SDK RV1106/RV1103/RV1103B/RV1106B.

<!-- en PDF p.36; unit 246 -->

#### 6.5.9 Журнал ядра при быстром запуске

<!-- en PDF p.36; unit 247 -->

Способ 1: задать loglevel=8 в параметрах загрузки соответствующего DTS, пересобрать ядро и прошить boot. Способ 2: после запуска ввести через последовательный порт:

<!-- en PDF p.36; unit 248 -->

```text
make_meta --update --meta_path /dev/block/by-name/meta --cmdline "loglevel=8"
```

<!-- en PDF p.36; unit 249 -->

#### 6.5.10 Проверка раннего вывода сенсора после переключения RTT на большое изображение

<!-- en PDF p.36; unit 250 -->

<!-- en PDF p.36; unit 251 -->

При переключении RTT на последовательность большого изображения проверьте, не начинает ли сенсор выводить данные заранее. Остановите SPL циклом while(1), не переходя в ядро, и измерьте MIPI осциллографом. Каталог: cd sysdrv/source/uboot/u-boot:

<!-- en PDF p.36; unit 252 -->

```text
git diff common/spl/spl.c
diff --git a/common/spl/spl.c b/common/spl/spl.c
index 6836796b4e..070388c066 100644
--- a/common/spl/spl.c
+++ b/common/spl/spl.c
@@ -739,4 +739,5 @@ void spl_cleanup_before_jump(struct spl_image_info
*spl_image)

        us = (get_ticks() - gd->sys_start_tick) / 24UL;
        printf("Total: %ld.%ld ms\n\n", us / 1000, us % 1000);
+       while(1);
}
```

<!-- en PDF p.36; unit 253 -->

#### 6.5.11 Поиск ошибок офлайновых кадров при быстром запуске

<!-- en PDF p.36; unit 254 -->

<!-- en PDF p.36; unit 255 -->

Отладочный переключатель VICAP выводит FS/FE первых 15 кадров и ротацию буферов. При склейке или ошибках кадра эти журналы помогают локализовать проблему. Включение:

<!-- en PDF p.37; unit 256 -->

```text
diff --git a/drivers/media/platform/rockchip/cif/dev.c
b/drivers/media/platform/rockchip/cif/dev.c
index c3b59414eede3..bb616b1897b58 100644
--- a/drivers/media/platform/rockchip/cif/dev.c
+++ b/drivers/media/platform/rockchip/cif/dev.c
@@ -1957,7 +1957,7 @@ int rkcif_plat_init(struct rkcif_device *cif_dev, struct
device_node *node, int
        cif_dev->sensor_linetime = 0;
        cif_dev->early_line = 0;
        cif_dev->is_thunderboot = false;
-       cif_dev->rdbk_debug = 0;
+       cif_dev->rdbk_debug = 3;

        cif_dev->resume_mode = 0;
        memset(&cif_dev->channels[0].capture_info, 0, sizeof(cif_dev->channels[0].capture_info));
```

<!-- en PDF p.37; unit 257 -->

#### 6.5.12 Захват и проверка малых изображений стадии RTT

<!-- en PDF p.37; unit 258 -->

<!-- en PDF p.37; unit 259 -->

В DTS отключите все rkisp/rkcif/mipi: csi2_dphy_hw, csi2_dphy0, mipi0_csi2, rkcif, rkcif_mipi_lvds, rkcif_mipi_lvds_sditf, rkisp, rkisp_vir0 — disabled. Команда io -rf /tmp/1.yuv -l 393216 0x866000 0 сохраняет малое изображение; доступны только последние 5 кадров. Можно принудительно установить fastae_max_run_frame=5.

<!-- en PDF p.37; unit 260 -->

```text
[STREAM]: L 0, 1, 0, 0x866000, 783360, 0x45d, 0x8000, tick:59
[STREAM]: L 1, 2, 0, 0x926000, 783360, 0x45d, 0x8000, tick:76
[STREAM]: L 2, 3, 0, 0x9e6000, 783360, 0x45d, 0x8000, tick:87
[STREAM]: L 3, 4, 0, 0xaa6000, 783360, 0x45d, 0x1828, tick:98
[STREAM]: L 4, 5, 0, 0xb66000, 783360, 0x45d, 0x48d, tick:109
```

<!-- en PDF p.37; unit 261 -->

Адреса 0x866000, 0x926000 и т. п. соответствуют последним кадрам, сохранённым на стадии RTT.

<!-- en PDF p.37; unit 262 -->

#### 6.5.13 Неверный цвет первого кадра

<!-- en PDF p.37; unit 263 -->

Слишком тёмный или зелёный первый кадр обычно связан с неверным IQ-файлом и ненормальным AWB. В журнале ниже luma очень мала, поэтому первый кадр тёмный:

<!-- en PDF p.38; unit 264 -->

```text
[FASTTAE]: >>> als type: 1, als value: 0xa0000, night mode: 0
start_stream 278 tick 23
[isp_0]:rk_isr_hw_set_vicap_clk enable is 1
[FASTAE]: set_firstae 1733 tick 23
[STREAM]: L 0, 1, 0, 0x866000, 178r400, 0x2, 0x40, tick:43
[AELIB]: 1,luma=1.0000,setpoint=60.0000,curexp=0.0000,newexp=0.0000,T?
8.0000,G=1.0000,ispG=1.0000,regT=2,regG=64

[STREAM]: L 1, 2, 0, 0x9b80000 1382400, 0x2, 0x40, tick:62
[AELIB]:2,luma=1.0000,setpoint=60.0000,curexp=0.0000,newexp=0.0000,T=0.0000,G=1.0
000,ispG=1.0000 regT=2,regG=64

[STREAM]: L 2, 3, 0, 0xb0a000, 138r400, 0x2, 0x40, tick:80
[AELIB]: 3,luma=1.0000,setpoint=60.0000,curexp=0.0000 ==========fastae is
match===========
```

<!-- en PDF p.38; unit 265 -->

Проверьте включение и правильную настройку earlierAwbAct в IQ:

<!-- en PDF p.38; unit 266 -->

```text
"earlierAwbAct":    {
        "enable":   1,
        "mode": "CALIB_AWB_EARLACT_XYREG_FIXED",
        "xyRegion": [{
        "normal":   [-161, 286, 81, -95],
        "big":  [-161, 286, 112, -125]
        }, {
        "normal":   [-803, -161, 135, -199],
        "big":  [-803, -161, 185, -224]
        }, {
        "normal":   [-1467, -796, 121, -78],
        "big":  [-1559, -796, 136, -93]
        }, {
        "normal":   [-2062, -1535, 65, -130],
        "big":  [-2017, -1535, 130, -130]
        }]
    }
```

<!-- en PDF p.38; unit 267 -->

Для быстрого запуска включите earlierAwbAct в JSON, чтобы раньше скорректировать AWB. Обычно AWB требует 2 кадра. Без fast AWB используется начальное значение с WB gain=1, что даёт зелёный оттенок. При настройке включите earlierawb, выберите AUTO и заполните параметры.

<!-- en PDF p.39; unit 268 -->

## 7. AOV

<!-- en PDF p.39; unit 269 -->

### 7.1 Аппаратный standby сенсора

<!-- en PDF p.39; unit 270 -->

Standby снижает потребление через сон или сброс. В режиме сна поток прекращается, потребление уменьшается, регистры сохраняются. SC200AI входит в сон двумя способами:

<!-- en PDF p.39; unit 271 -->

1. Установить PWDN в низкий уровень; чтение/запись I2C недоступны.

<!-- en PDF p.39; unit 272 -->

2. Записать 0 в регистр stream; I2C доступен. В режиме сброса поток останавливается, потребление снижается и все регистры сбрасываются. Для SC200AI:

<!-- en PDF p.39; unit 273 -->

1. Установить XSHUTDN в низкий уровень; I2C недоступен.

<!-- en PDF p.39; unit 274 -->

2. Записать 1 в регистр программного сброса; сброс длится 150ns. Аппаратный standby — сон через низкий PWDN без доступа I2C. Для SC200AI добавьте в DTS rockchip,camera-module-stb = &lt;1&gt;; значение 1 включает поддержку, 0 — выключает.

<!-- en PDF p.39; unit 275 -->

```text
sc200ai: sc200ai@30 {
    compatible = "smartsens,sc200ai";
    status = "okay";
    reg = <0x30>;
    ...
    rockchip,camera-module-stb = <1>;
    port {
        sc200ai_out: endpoint {
            remote-endpoint = <&csi_dphy_input1>;
            data-lanes = <1 2>;
        };
    };
};
```

<!-- en PDF p.39; unit 276 -->

В probe разберите атрибут и сохраните признак поддержки в sc200ai-&gt;standby_hw.

<!-- en PDF p.40; unit 277 -->

При аппаратном standby обработчик ioctl quick_stream управляет PWDN GPIO согласно запуску/остановке потока. При сне/пробуждении команда v4l2 ioctl заново устанавливает экспозицию, усиление и другие регистры.

<!-- en PDF p.40; unit 278 -->

```text
    case RKMODULE_SET_QUICK_STREAM:
        stream = *((u32 *)arg);
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit standby mode\n");
                sc200ai->is_standby = false;
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter standby mode\n");
                sc200ai->is_standby = true;
            }
        } else {    // software standby
            ...
        }
```

<!-- en PDF p.40; unit 279 -->

Подробности — в драйвере SC200AI. Программный standby: после сна/пробуждения записывается полный набор регистров сенсора, затем quick_stream в ioctl непосредственно переключает регистр stream.

<!-- en PDF p.40; unit 280 -->

```text
......
} else {    // software standby
        if (stream) {
            ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

            ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
```

<!-- en PDF p.41; unit 281 -->

```text
            dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft standby mode\n");
       } else {
           ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                                   SC200AI_REG_VALUE_08BIT,
SC200AI_MODE_SW_STANDBY);

           ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                                    SC200AI_REG_VALUE_08BIT,
SC200AI_MIPI_CTRL_OFF);
           dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft standby mode\n");
        }
}
```

<!-- en PDF p.41; unit 282 -->

### 7.2 Управление подсветкой

<!-- en PDF p.41; unit 283 -->

В AOV каждый сенсор может управлять одной подсветкой PWM или GPIO. Настройка:

<!-- en PDF p.41; unit 284 -->

1. Добавьте узел light_ctl в DTS платы и укажите устройства PWM/выводы GPIO по схеме. В примере текст указывает pwm7, индекс 0, GPIO не используется; приведённый DTS при этом содержит light-gpios — это различие исходника сохранено.

<!-- en PDF p.41; unit 285 -->

```text
/ {
    model = "Rockchip RV1106G EVB2 V10 Board";
    compatible = "rockchip,rv1106g-evb2-v10", "rockchip,rv1106";

    chosen {
        bootargs = "loglevel=0 rootfstype=erofs rootflags=dax console=ttyFIQ0 root=/dev/rd0 snd_soc_core.prealloc_buffer_size_kbytes=16 coherent_pool=0 driver_async_probe=dwmmc_rockchip";
    };
    ...
    light_ctrl: light-ctl {
        compatible = "rockchip,light-ctl";
        pwms=<&pwm7 0 25000 0>;
        light-gpios =<&gpio3 RK_PD2 GPIO_ACTIVE_HIGH>;
        rockchip,module-index = <0>;
        status = "okay";
    };
};
```

<!-- en PDF p.41; unit 286 -->

2. Включите CONFIG_LIGHT_CTL в конфигурации ядра.

<!-- en PDF p.41; unit 287 -->

3. Добавьте интерфейсы управления в драйвер сенсора.

<!-- en PDF p.41; unit 288 -->

```text
 #include <linux/clk.h>
@@ -40,8 +41,9 @@
 #include "../platform/rockchip/isp/rkisp_tb_helper.h"
```

<!-- en PDF p.42; unit 289 -->

```text
 #include "cam-tb-setup.h"
 #include "cam-sleep-wakeup.h"
+#include "light_ctl.h"

-#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x09)
+#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x10)

 #ifndef V4L2_CID_DIGITAL_GAIN
 #define V4L2_CID_DIGITAL_GAIN      V4L2_CID_GAIN
@@ -192,6 +194,7 @@ struct sc200ai {
    bool            is_standby;
    struct preisp_hdrae_exp_s init_hdrae_exp;
    struct cam_sw_info  *cam_sw_inf;
+   struct rk_light_param   light_ctl_param;
 };

 #define to_sc200ai(sd) container_of(sd, struct sc200ai, subdev)
@@ -1191,6 +1194,8 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
    u32 i, h, w;
    long ret = 0;
    u32 stream = 0;
+   int rt = 0;
+   struct rk_light_param *light_param;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1238,6 +1243,22 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)

        stream = *((u32 *)arg);

+       dev_err(&sc200ai->client->dev, "%s: quick_stream = %d\n",
+           __func__, stream);
+       // light control
+       if (stream) {
+           sc200ai->light_ctl_param.light_enable = true;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       } else {
+           sc200ai->light_ctl_param.light_enable = false;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       }
+
+       dev_err(&sc200ai->client->dev, "%s: light_ctl_write ret:%d\n",
+            __func__, rt);
+
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
@@ -1284,6 +1305,18 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
        ch_info = (struct rkmodule_channel_info *)arg;
        ret = sc200ai_get_channel_info(sc200ai, ch_info);
        break;
```

<!-- en PDF p.43; unit 290 -->

```text
+
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = (struct rk_light_param *)arg;
+       dev_err(&sc200ai->client->dev,
+           "%s: RKCIS_CMD_FLASH_LIGHT_CTRL type: %s enable: %s\n",
+           __func__,
+           light_param->light_type == LIGHT_PWM ? "pwm" : "gpio",
+           light_param->light_enable ? "enable" : "disable");
+
+       memcpy(&sc200ai->light_ctl_param, light_param, sizeof(*light_param));
+
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1304,6 +1337,7 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
    struct rkmodule_channel_info *ch_info;
    long ret;
    u32 stream = 0;
+   struct rk_light_param *light_param = NULL;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1400,6 +1434,19 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
        }
        kfree(ch_info);
        break;
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
+       if (!light_param) {
+           ret = -ENOMEM;
+           return ret;
+       }
+       ret = copy_from_user(light_param, up, sizeof(*light_param));
+       if (!ret)
+           ret = sc200ai_ioctl(sd, cmd, light_param);
+       else
+           ret = -EFAULT;
+       kfree(light_param);
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1451,6 +1498,10 @@ static int __sc200ai_stop_stream(struct sc200ai
*sc200ai)
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
+   sc200ai->light_ctl_param.duty_cycle = 0;
+   sc200ai->light_ctl_param.light_enable = false;
+   light_ctl_write(sc200ai->module_index,
+           &sc200ai->light_ctl_param);
    return sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
```

<!-- en PDF p.44; unit 291 -->

```text
 }
@@ -1973,6 +2024,7 @@ static int sc200ai_initialize_controls(struct sc200ai
*sc200ai)
    sc200ai->subdev.ctrl_handler = handler;
    sc200ai->has_init_exp = false;
    sc200ai->is_standby = false;
+   sc200ai->light_ctl_param.duty_cycle = 0;

    return 0;
```

<!-- en PDF p.44; unit 292 -->

4. Пример кода приложения:

<!-- en PDF p.44; unit 293 -->

```text
--- a/sample_aov_vi.c
+++ b/sample_aov_vi.c
@@ -572,6 +572,19 @@ int main(int argc, char *argv[]) {
        if (!ctx->vi.bIfQuickStart) {
                RK_MPI_VI_StartPipe(ctx->vi.u32PipeId);
        }
+
+       // Enable VI light
+       VI_LIGHT_CTL_PARAM_S tLightCtlParam;
+       printf("%s - VI_LIGHT_CTL_PARAM_S size:%d\n", __func__,
sizeof(VI_LIGHT_CTL_PARAM_S));
+       memset(&tLightCtlParam, 0, sizeof(tLightCtlParam));
+       tLightCtlParam.light_enable = RK_TRUE;
+       tLightCtlParam.light_type = LIGHT_TYPE_PWM;
+       tLightCtlParam.duty_cycle = 25000;
+       tLightCtlParam.period = 25000;
+       tLightCtlParam.polarity = 0;
+
+       RK_MPI_VI_DevEnableLight(ctx->vi.s32DevId, ctx->vi.s32DevId,
&tLightCtlParam);
+
        if (s32ViFrameMode == 0)
                pthread_create(&vi_thread_id, 0, vi_get_stream, (void *)
(&ctx->vi));
```

<!-- en PDF p.44; unit 294 -->

### 7.3 Документация разработки AOV

<!-- en PDF p.44; unit 295 -->

Подробности: Rockchip_RV1106_Developer_Guide_Linux_AOV_CN.md.

## Различия кода оригиналов

Основной текст соответствует языку оригинала; RU/DE переведены с EN. Ниже сохранены отличающиеся фрагменты другого оригинала, включая комментарии/разметку. Это независимые примеры, не единый исполняемый сценарий; параметры источника не подменены.

**CN PDF p.6 · 28**

```text
# media-ctl -p -d /dev/media0 | tail -n 30
                -> "rkcif_tools_id2":0 []
        pad11: Source
                -> "stream_cif_mipi_id0":0 []
                -> "stream_cif_mipi_id1":0 []
                -> "stream_cif_mipi_id2":0 []
```

**CN PDF p.7 · 29**

```text
                -> "stream_cif_mipi_id3":0 []
                -> "rkcif_scale_ch0":0 []
                -> "rkcif_scale_ch1":0 []
                -> "rkcif_scale_ch2":0 []
                -> "rkcif_scale_ch3":0 []
                -> "rkcif_tools_id0":0 []
                -> "rkcif_tools_id1":0 []
                -> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
        pad0: Sink
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                <- "m00_b_sc450ai 4-0030":0 [ENABLED]
        pad1: Source
                -> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc450ai 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
        pad0: Source
                [fmt:SBGGR10_1X10/2688x1520@10000/300000 field:none]
                -> "rockchip-csi2-dphy0":0 [ENABLED]
```

**CN PDF p.7 · 33**

```text
+++ b/drivers/media/i2c/sc530ai.c
@@ -1593,8 +1593,8 @@ static int sc530ai_open(struct v4l2_subdev *sd, struct
v4l2_subdev_fh *fh)
 }
 #endif

-#define DST_WIDTH 2880
-#define DST_HEIGHT 1616
+#define DST_WIDTH 2560
+#define DST_HEIGHT 1440
```

**CN PDF p.8 · 37**

```text
# i2ctransfer -f -y 4 w3@0x32 0x43 0x24 0x18

4：代表 IIC 的总线号(对应的可为0,1,2,3...)
w：代表写
3：代表写 3 Byte
0x32：代表 IIC 设备地址
后边三个数据代表要写的数据,这⾥0x4324假如为16bit的寄存器地址，0x18为要写⼊的值。

# i2ctransfer -f -y 4 w1@0x30 0x08 r3

4：代表 IIC 的总线号(对应的可为0,1,2,3...)
w：表⽰写
1：表⽰写 1 Byte
0x30：代表 IIC 设备地址
r：代表读取
3：代表读取 3 Byte

这句代表的意思是从0x30地址上偏移0x08之后读取3个Byte，r后数字表⽰读取的个数。
```

**CN PDF p.14 · 84**

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 640,
                .height = 480,
```

**CN PDF p.15 · 91**

```text
常⻅命令有：
# 取 raw 图
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -n /dev/video0 -f 131076

# 从 mainpath 通道取 yuv 图，并保存在⽂件中。⽂件⽬录 /data/test_0_0_0.bin,可使⽤
7yuv等⼯具打开。⽂件命名根据 dev id， pipe id， chn id相关。
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 0 -l 10 -o 1

# 从 mainpath 通道取 yuv 图，并并编码，写⽂件。⽂件保存在/data/venc_0.bin,⽂件命名跟
chn id 有关。
rk_mpi_vi_test -w 1920 -h 1080 -d 0 -c 0 -m 1 -l 10 -o 1
...
```

**CN PDF p.15 · 93**

```text
# 使⽤ simple_vi_bind_venc_rtsp demo，通过rtsp 实时预览(使⽤vlc 或 potplayer⼯具配
置板端IP).
simple_vi_bind_venc_rtsp -I 0 -w 1920 -h 1080 (rtsp://ip/live/0)
```

**CN PDF p.17 · 116**

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //表⽰该entity是
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //对应的设备节点
是/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //表⽰该entity是
SP(SelfPath)
            type Node subtype V4L flags 0
            device node name /dev/video2                 //对应的设备节点
是/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

**CN PDF p.17 · 118**

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # MP节点对应/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # SP节点对应/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

**CN PDF p.20 · 134**

```text
#grep RK_AIQ_VERSION_REAL media/isp/camera_engine_rkaiq/rkaiq/RkAiqVersion.h

#define RK_AIQ_VERSION_REAL_V "v5.0x5.0"
```

**CN PDF p.20 · 139**

```text
  # dmesg  | grep "version"

dmesg | grep "version"
[    0.848252] udevd[65]: starting version 3.2.7
[    3.889404] imx415 4-001a: driver version: 00.01.08
[    3.967388] os04a10 4-0036: driver version: 00.01.05
[    4.084418] sc4336 4-0030-3: driver version: 00.01.01
[    4.114867] sc3336 4-0030-1: driver version: 00.01.01
[    4.152066] sc530ai 4-0030: driver version: 00.01.01
[    4.180572] sc200ai 4-0030-6: driver version: 00.01.09
[    4.237776] rkcif rkcif-mipi-lvds: rkcif driver version: v00.02.00
[    4.260419] rkisp rkisp-vir0: rkisp driver version: v02.05.00
```

**CN PDF p.24 · 166**

```text
.
├── audio
│   ├── Makefile
│   ├── sample_ai_aenc.c
│   └── sample_ai.c
├── avs
│   ├── Makefile
│   ├── sample_avs.c
│   └── sample_multi_vi_avs.c
├── common
│   ├── fillimage.c
│   ├── isp2.x
│   ├── isp3.x
│   ├── lib
│   ├── loadbmp.c
│   ├── loadbmp.h
│   ├── Makefile
│   ├── sample_comm_aenc.c
│   ├── sample_comm_ai.c
│   ├── sample_comm_ao.c
│   ├── sample_comm_avs.c
│   ├── sample_comm.c
│   ├── sample_comm.h
│   ├── sample_comm_iva.c
│   ├── sample_comm_ivs.c
│   ├── sample_comm.o
│   ├── sample_comm_rgn.c
│   ├── sample_comm_tde.c
│   ├── sample_comm_venc.c
│   ├── sample_comm_vi.c
│   ├── sample_comm_vo.c
│   ├── sample_comm_vpss.c
├── demo
│   ├── Makefile
│   ├── sample_demo_aiisp.c
│   ├── sample_demo_dual_aiisp.c
│   ├── sample_demo_dual_camera.c
```

**CN PDF p.25 · 167**

```text
│   ├── sample_demo_dual_camera_wrap.c
│   ├── sample_demo_multi_camera_eptz.c
│   ├── sample_demo_vi_avs_venc.c
│   ├── sample_demo_vi_venc.c
│   └── sample_rv1103_dual_memory_opt.c
├── Makefile
├── out
│   ├── bin
│   └── install_to_userdata
├── test
│   ├── Makefile
│   ├── sample_ai_aenc_adec_ao_stresstest.c
│   ├── sample_avs_stresstest.c
│   ├── sample_demo_aiisp_stresstest.c
│   ├── sample_demo_dual_aiisp_stresstest.c
│   ├── sample_demo_vi_avs_venc_stresstest.c
│   ├── sample_demo_vi_venc_stresstest.c
│   ├── sample_isp_stresstest.c
│   ├── sample_mulit_isp_stresstest.c
│   ├── sample_rgn_stresstest.c
│   ├── sample_venc_stresstest.c
│   ├── sample_vpss_stresstest.c
│   └── source
├── venc
│   ├── Makefile
│   ├── sample_multi_vi_avs_osd_venc.c
│   └── sample_vi_vpss_osd_venc.c
├── vi
│   ├── Makefile
│   ├── sample_multi_vi.c
│   ├── sample_vi.c
│   └── sample_vi_eis.c
└── vo
    ├── Makefile
    └── sample_vi_vo.c
```

**CN PDF p.26 · 175**

```text
&rkisp_thunderboot {
    /* reg's offset MUST match with RTOS */
    /*
     * vicap, capture raw10, ceil(w*10/8/256)*256*h *3(buf num) +
sizeof(rkisp_thunderboot_resmem_head)
     * In RV1103B the size of rkisp_thunderboot_resmem_head is 0x9000, and it
is 0x6000 in RV1103/RV1106
     * e.g. 2688x1520: 0xf96000(raw picture size) + 0x9000 = 0xf9f000
     */
    reg = <0x00860000 0xf9f000>;
};

&ramdisk_r {
    reg = <0x17ff000 (10 * 0x00100000)>;
};

&ramdisk_c {
    reg = <0x21ff000 (4 * 0x00100000)>;
};
```

**CN PDF p.27 · 178**

```text
static int __sc401ai_start_stream(struct sc401ai *sc401ai)
{
    int ret;

    if (!sc401ai->is_thunderboot) {
        ret = sc401ai_write_array(sc401ai->client, sc401ai->cur_mode->reg_list);
        if (ret)
            return ret;

        /* In case these controls are set before streaming */
        ret = __v4l2_ctrl_handler_setup(&sc401ai->ctrl_handler);
        if (ret)
            return ret;
    }

    // 仅写⼊起流寄存器。
    return sc401ai_write_reg(sc401ai->client,
                SC401AI_REG_CTRL_MODE,
                SC401AI_REG_VALUE_08BIT,
                SC401AI_MODE_STREAMING);
}
```

**CN PDF p.27 · 180**

```text
static int sc401ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ......

    switch (ctrl->id) {
    case V4L2_CID_EXPOSURE: // 曝光
        if (sc401ai->cur_mode->hdr_mode == NO_HDR) {
            val = ctrl->val << 1;
            /* 4 least significant bits of expsoure are fractional part */
            ret = sc401ai_write_reg(sc401ai->client,
                        SC401AI_REG_EXPOSURE_H,
                        SC401AI_REG_VALUE_08BIT,
                        SC401AI_FETCH_EXP_H(val));
            ret |= sc401ai_write_reg(sc401ai->client,
                         SC401AI_REG_EXPOSURE_M,
                         SC401AI_REG_VALUE_08BIT,
                         SC401AI_FETCH_EXP_M(val));
            ret |= sc401ai_write_reg(sc401ai->client,
                         SC401AI_REG_EXPOSURE_L,
                         SC401AI_REG_VALUE_08BIT,
                         SC401AI_FETCH_EXP_L(val));
```

**CN PDF p.28 · 181**

```text
        }
        break;
    case V4L2_CID_ANALOGUE_GAIN:    //模拟Gain
        if (sc401ai->cur_mode->hdr_mode == NO_HDR)
            ret = sc401ai_set_gain_reg(sc401ai, ctrl->val);
        break;
    case V4L2_CID_VBLANK:       // VBLANK, 影响帧率
        ret = sc401ai_write_reg(sc401ai->client,
                    SC401AI_REG_VTS_H,
                    SC401AI_REG_VALUE_08BIT,
                    (ctrl->val + sc401ai->cur_mode->height)
                    >> 8);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_REG_VTS_L,
                     SC401AI_REG_VALUE_08BIT,
                     (ctrl->val + sc401ai->cur_mode->height)
                     & 0xff);
        if (!ret)
            sc401ai->cur_vts = ctrl->val + sc401ai->cur_mode->height;
        sc401ai_modify_fps_info(sc401ai);
        break;
    case V4L2_CID_TEST_PATTERN: // pattern 测试模式
        ret = sc401ai_enable_test_pattern(sc401ai, ctrl->val);
        break;
    case V4L2_CID_HFLIP:    // ⽔平镜像
        ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                       SC401AI_REG_VALUE_08BIT, &val);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_FLIP_MIRROR_REG,
                     SC401AI_REG_VALUE_08BIT,
                     SC401AI_FETCH_MIRROR(val, ctrl->val));
        break;
    case V4L2_CID_VFLIP:    // 垂直翻转
        ret = sc401ai_read_reg(sc401ai->client, SC401AI_FLIP_MIRROR_REG,
                       SC401AI_REG_VALUE_08BIT, &val);
        ret |= sc401ai_write_reg(sc401ai->client,
                     SC401AI_FLIP_MIRROR_REG,
                     SC401AI_REG_VALUE_08BIT,
                     SC401AI_FETCH_FLIP(val, ctrl->val));
        break;

      ......
    }

    pm_runtime_put(&client->dev);
    return ret;
}
```

**CN PDF p.29 · 185**

```text
static const uint8_t g_sc401ai_2560x1440_30fps_reg_table[] = {
    ......
    0x3,  0x36,  0xf9,  0x14,
    // 0x3,  0x01,  0x00,  0x01,    // 0x0100 寄存器起流控制寄存器不能配置
    0x3a,
}
```

**CN PDF p.29 · 189**

```text
./media/isp/release_camera_engine_rkaiq_rv1106_arm-rockchip830-linux-
uclibcgnueabihf/host/j2s4b   json⽂件   bin⽂件
```

**CN PDF p.29 · 197**

```text
"earlierAwbAct ":{
    "enable":   1,
    ......
```

**CN PDF p.29 · 199**

```text
"cac_v11":  {
                "SettingPara":  {
                    "enable":   0,
            }
```

**CN PDF p.30 · 207**

```text
Meta: ok
## Verified-boot: 0

iq_bin_mode=0
scene(day) frmRate: mode=0, val=25, keep fps
scene(night) frmRate: mode=1, val=25, update fps=15
load iq bin file finished!
gc5603-sensor_0 cur resulotion, width 1480, height 832, fps 60!
gc5603-sensor_0 find dst resulotion, width 2880, height 1616, fps 15!
[FASTAE]: fps/hts/vts: RTT=[60, 3223, 875], MainAIQ=[15, 3200, 3500]
[AELIB]: fastae: 3.0.5
[FASTAE]: ADC run failed! can't find rk_adc0 device!
Illegal instruction
```

**CN PDF p.30 · 209**

```text
typedef enum  {
    ALS_TYPE_NONE    = 0,   // 软光敏
    ALS_TYPE_ANALOG  = 1,   // 模拟光敏
    ALS_TYPE_DIGITAL = 2,   // 数字光敏
} eALS_TYPE;
```

**CN PDF p.31 · 219**

```text
#define SC200AI_REG_TEST_PATTERN    0x4501
#define SC200AI_TEST_PATTERN_BIT_MASK   BIT(3)
...
static int sc200ai_enable_test_pattern(struct sc200ai *sc200ai, u32 pattern)
```

**CN PDF p.32 · 220**

```text
{
    u32 val = 0;
    int ret = 0;

    ret = sc200ai_read_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                   SC200AI_REG_VALUE_08BIT, &val);
    if (pattern)
        val |= SC200AI_TEST_PATTERN_BIT_MASK;
    else
        val &= ~SC200AI_TEST_PATTERN_BIT_MASK;

    ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_TEST_PATTERN,
                 SC200AI_REG_VALUE_08BIT, val);
    return ret;
}

static int sc200ai_set_ctrl(struct v4l2_ctrl *ctrl)
{
    ...
    case V4L2_CID_TEST_PATTERN:
        ret = sc200ai_enable_test_pattern(sc200ai, ctrl->val);
        break;
    ...
}
```

**CN PDF p.32 · 225**

```text
&spi nor {
        spi-max-frequency = <125000000> 为 spi-max-frequency = <100000000>
```

**CN PDF p.36 · 262**

```text
case RKMODULE_SET_QUICK_STREAM:
```

**CN PDF p.37 · 263**

```text
        stream = *((u32 *)arg);
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 1);
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);

                dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit standby mode\n");
                sc200ai->is_standby = false;
            } else {
                ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);

                ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_OFF);

                if (!IS_ERR(sc200ai->pwdn_gpio))
                    gpiod_set_value_cansleep(sc200ai->pwdn_gpio, 0);

                dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter standby mode\n");
                sc200ai->is_standby = true;
            }
        } else {    // software standby
            ...
        }
```

**CN PDF p.37 · 265**

```text
......
} else {    // software standby
        if (stream) {
            ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MIPI_CTRL_ON);

            ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                    SC200AI_REG_VALUE_08BIT, SC200AI_MODE_STREAMING);
            dev_info(&sc200ai->client->dev, "quickstream, streaming on: exit soft standby mode\n");
       } else {
           ret = sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                                   SC200AI_REG_VALUE_08BIT,
SC200AI_MODE_SW_STANDBY);

           ret |= sc200ai_write_reg(sc200ai->client, SC200AI_REG_MIPI_CTRL,
```

**CN PDF p.38 · 266**

```text
                                    SC200AI_REG_VALUE_08BIT,
SC200AI_MIPI_CTRL_OFF);
           dev_info(&sc200ai->client->dev, "quickstream, streaming off: enter soft standby mode\n");
        }
}
```

**CN PDF p.38 · 273**

```text
 #include <linux/clk.h>
@@ -40,8 +41,9 @@
 #include "../platform/rockchip/isp/rkisp_tb_helper.h"
 #include "cam-tb-setup.h"
 #include "cam-sleep-wakeup.h"
+#include "light_ctl.h"

-#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x09)
+#define DRIVER_VERSION         KERNEL_VERSION(0, 0x01, 0x10)

 #ifndef V4L2_CID_DIGITAL_GAIN
 #define V4L2_CID_DIGITAL_GAIN      V4L2_CID_GAIN
@@ -192,6 +194,7 @@ struct sc200ai {
    bool            is_standby;
```

**CN PDF p.39 · 274**

```text
    struct preisp_hdrae_exp_s init_hdrae_exp;
    struct cam_sw_info  *cam_sw_inf;
+   struct rk_light_param   light_ctl_param;
 };

 #define to_sc200ai(sd) container_of(sd, struct sc200ai, subdev)
@@ -1191,6 +1194,8 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
    u32 i, h, w;
    long ret = 0;
    u32 stream = 0;
+   int rt = 0;
+   struct rk_light_param *light_param;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1238,6 +1243,22 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)

        stream = *((u32 *)arg);

+       dev_err(&sc200ai->client->dev, "%s: quick_stream = %d\n",
+           __func__, stream);
+       // light control
+       if (stream) {
+           sc200ai->light_ctl_param.light_enable = true;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       } else {
+           sc200ai->light_ctl_param.light_enable = false;
+           rt = light_ctl_write(sc200ai->module_index,
+                        &sc200ai->light_ctl_param);
+       }
+
+       dev_err(&sc200ai->client->dev, "%s: light_ctl_write ret:%d\n",
+            __func__, rt);
+
        if (sc200ai->standby_hw) { // hardware standby
            if (stream) {
                if (!IS_ERR(sc200ai->pwdn_gpio))
@@ -1284,6 +1305,18 @@ static long sc200ai_ioctl(struct v4l2_subdev *sd,
unsigned int cmd, void *arg)
        ch_info = (struct rkmodule_channel_info *)arg;
        ret = sc200ai_get_channel_info(sc200ai, ch_info);
        break;
+
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = (struct rk_light_param *)arg;
+       dev_err(&sc200ai->client->dev,
+           "%s: RKCIS_CMD_FLASH_LIGHT_CTRL type: %s enable: %s\n",
+           __func__,
+           light_param->light_type == LIGHT_PWM ? "pwm" : "gpio",
+           light_param->light_enable ? "enable" : "disable");
+
+       memcpy(&sc200ai->light_ctl_param, light_param, sizeof(*light_param));
+
```

**CN PDF p.40 · 275**

```text
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1304,6 +1337,7 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
    struct rkmodule_channel_info *ch_info;
    long ret;
    u32 stream = 0;
+   struct rk_light_param *light_param = NULL;

    switch (cmd) {
    case RKMODULE_GET_MODULE_INFO:
@@ -1400,6 +1434,19 @@ static long sc200ai_compat_ioctl32(struct v4l2_subdev
*sd,
        }
        kfree(ch_info);
        break;
+   case RKCIS_CMD_FLASH_LIGHT_CTRL:
+       light_param = kzalloc(sizeof(*light_param), GFP_KERNEL);
+       if (!light_param) {
+           ret = -ENOMEM;
+           return ret;
+       }
+       ret = copy_from_user(light_param, up, sizeof(*light_param));
+       if (!ret)
+           ret = sc200ai_ioctl(sd, cmd, light_param);
+       else
+           ret = -EFAULT;
+       kfree(light_param);
+       break;
    default:
        ret = -ENOIOCTLCMD;
        break;
@@ -1451,6 +1498,10 @@ static int __sc200ai_stop_stream(struct sc200ai
*sc200ai)
        sc200ai->is_first_streamoff = true;
        pm_runtime_put(&sc200ai->client->dev);
    }
+   sc200ai->light_ctl_param.duty_cycle = 0;
+   sc200ai->light_ctl_param.light_enable = false;
+   light_ctl_write(sc200ai->module_index,
+           &sc200ai->light_ctl_param);
    return sc200ai_write_reg(sc200ai->client, SC200AI_REG_CTRL_MODE,
                 SC200AI_REG_VALUE_08BIT, SC200AI_MODE_SW_STANDBY);
 }
@@ -1973,6 +2024,7 @@ static int sc200ai_initialize_controls(struct sc200ai
*sc200ai)
    sc200ai->subdev.ctrl_handler = handler;
    sc200ai->has_init_exp = false;
    sc200ai->is_standby = false;
+   sc200ai->light_ctl_param.duty_cycle = 0;

    return 0;
```

{% endraw %}
