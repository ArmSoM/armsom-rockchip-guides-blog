---

title: "Устранение неисправностей Camera в Rockchip Linux 4.4"

description: "Устранение неисправностей Camera в Rockchip Linux 4.4 · V1.0.1"

excerpt: "Устранение неисправностей Camera в Rockchip Linux 4.4"

translation_key: 185-rockchip-linux44-camera-troubleshooting

slug: 185-rockchip-linux44-camera-troubleshooting

lang: ru

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Справка платформы: V1.0.1 производителя, RK3xxx; Linux 4.4+. Полные разделы ниже посвящены драйверам камеры, подключению сенсоров, захвату и отладке. Конкретные сочетания платы ArmSoM/BSP/SDK/ядра не проверены; сверьте схему, интерфейсы, питание/такты, драйверы и IQ-файлы. Примеры и измерения производителя не являются тестами ArmSoM; команды не выполнялись. ZH использует китайские оригинальные рисунки, EN/RU/DE — английские.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.5; unit 0 -->

## 1. Запуск сенсора

<!-- en PDF p.5; unit 1 -->

### 1.1 ID сенсора не определяется: ошибка связи I2C

<!-- en PDF p.5; unit 2 -->

<!-- en PDF p.5; unit 3 -->

Если ID сенсора не определяется, исходник связывает это не с RKISP/RKCIF, а с несоблюдением последовательности питания. Проверяйте по порядку:

<!-- en PDF p.5; unit 4 -->

1. Правильно ли задан 7-битный i2c slave id? Не указан ли ошибочно 8-битный адрес?

<!-- en PDF p.5; unit 5 -->

2. Есть ли выход mclk 24M и правильная амплитуда напряжения?

<!-- en PDF p.5; unit 6 -->

3. Соблюдена ли последовательность питания сенсора: avdd, dovdd, dvdd, power down, reset и прочее?

<!-- en PDF p.5; unit 7 -->

#### 1.1.1 Что такое 7-битный адрес

<!-- en PDF p.5; unit 8 -->

Младший бит LSB 8-битного адреса обозначает R/W; старшие семь бит — нужный i2c slave id.

<!-- en PDF p.5; unit 9 -->

#### 1.1.2 После включения не обнаруживаются mclk 24M и питание vdd

<!-- en PDF p.5; unit 10 -->

<!-- en PDF p.5; unit 11 -->

Драйвер обычно включает mclk и питание только при необходимости, поэтому после загрузки они по умолчанию выключены. Для измерений можно временно закомментировать реализацию power_off(), чтобы не отключать питание.

<!-- en PDF p.5; unit 12 -->

#### 1.1.3 mclk 24M по-прежнему не обнаруживается

<!-- en PDF p.5; unit 13 -->

Проверьте полосу осциллографа; исходник рекомендует не менее 48M.

<!-- en PDF p.5; unit 14 -->

1. Если сенсор не включает mclk, проверьте операции тактирования по примеру drivers/media/i2c/ov5695.c.

<!-- en PDF p.5; unit 15 -->

2. GPIO может быть занят другим модулем; обычно об этом сообщает журнал ядра. Командой io можно проверить настройки регистра pin-ctrl.

<!-- en PDF p.6; unit 16 -->

#### 1.1.4 mclk присутствует, но амплитуда не соответствует домену питания

<!-- en PDF p.6; unit 17 -->

<!-- en PDF p.6; unit 18 -->

Причина — неправильная настройка io-domains. Обычно напряжение составляет 1.8v или

<!-- en PDF p.6; unit 19 -->

3.3v, согласно схеме. Проверьте схему и измените io-domains, например:

<!-- en PDF p.6; unit 20 -->

```text
&io_domains {
    status = "okay";

    vccio1-supply = <&vcc1v8_soc>;
    vccio2-supply = <&vccio_sd>;
    vccio3-supply = <&vcc1v8_dvp>;
    vccio4-supply = <&vcc_3v0>;
    vccio5-supply = <&vcc_3v0>;
};
```

<!-- en PDF p.6; unit 21 -->

В примере группа vccio3 питается от vcc1v8_dvp; домен имеет напряжение

<!-- en PDF p.6; unit 22 -->

1.8v, поэтому измеренный mclk также должен быть 1.8v. При загрузке io_domains может инициализироваться позже сенсора. При ошибке чтения ID попробуйте повторить probe:

<!-- en PDF p.6; unit 23 -->

```text
diff --git a/drivers/media/i2c/ov7251.c b/drivers/media/i2c/ov7251.c
index e0c608f..7842812 100644
--- a/drivers/media/i2c/ov7251.c
+++ b/drivers/media/i2c/ov7251.c
@@ -961,7 +961,8 @@ static int ov7251_check_sensor_id(struct ov7251 *ov7251,
                              OV7251_REG_VALUE_16BIT, &id);
        if (id != CHIP_ID) {
                dev_err(dev, "Unexpected sensor id(%06x), ret(%d)\n", id, ret);
-               return -ENODEV;
+               return -EPROBE_DEFER;
        }
```

<!-- en PDF p.6; unit 24 -->

Если io_domains ещё не инициализирован, используются значения по умолчанию. Если они не соответствуют реальному домену питания, напряжение mclk будет неправильным. Возврат -EPROBE_DEFER заставляет ядро повторить probe сенсора позднее.

<!-- en PDF p.6; unit 25 -->

#### 1.1.5 Проверка последовательности питания сенсора

<!-- en PDF p.6; unit 26 -->

<!-- en PDF p.6; unit 27 -->

Datasheet задаёт порядок и интервалы включения источников питания. Проверьте их осциллографом. Некоторым сенсорам, например ov5695, порядок подачи vdd не важен: драйвер может использовать regulator_bulk. Другим, например ov2685.c, требуется последовательность и отдельные регуляторы avdd_regulator, dovdd_regulator. Выбирайте по конкретному сенсору.

<!-- en PDF p.7; unit 28 -->

### 1.2 Значения exp_def, hts_def и vts_def в драйвере сенсора

<!-- en PDF p.7; unit 29 -->

<!-- en PDF p.7; unit 30 -->

Получите значения у производителя. Иначе найдите регистры в datasheet и их начальные значения в списке инициализации. Пример ov2685.c:

<!-- en PDF p.7; unit 31 -->

```text
#define OV2685_REG_VTS                  0x380e

...

        {0x380e, 0x05},
        {0x380f, 0x0e},

...

                .vts_def = 0x050e,
```

<!-- en PDF p.7; unit 32 -->

0x380e и 0x380f — регистры vts. При начальном значении 0x050e vts_def равен 0x050e. Значения exp и hts по умолчанию ищите в datasheet. Если приложение не должно менять экспозицию и частоту кадров, exp, hts и vts не требуются; для RAW-сенсора эти три параметра обычно нужны.

<!-- en PDF p.7; unit 33 -->

### 1.3 Значения link_freq и pixel_rate

<!-- en PDF p.7; unit 34 -->

link_freq — реальная частота MIPI clk, не mclk 24M, а MIPI dn/dp clk. Спросите производителя или найдите параметр в datasheet. Обычно link_freq не меньше результата следующей формулы, в Гц:

<!-- en PDF p.7; unit 35 -->

```text
width * height * fps * bits_per_pixel / lanes / 2
```

<!-- en PDF p.7; unit 36 -->

Если link_freq неизвестен, измерьте его осциллографом. pixel_rate — число пикселей в секунду; по известному link_freq он вычисляется так:

<!-- en PDF p.7; unit 37 -->

```text
link_freq * 2 * lanes / bits_per_pixel
```

<!-- en PDF p.7; unit 38 -->

### 1.4 Как подтвердить запуск сенсора

<!-- en PDF p.7; unit 39 -->

Сначала должен определяться ID: чтение/запись I2C без ошибок. media-ctl -p -d /dev/media0 должен показывать имя, разрешение и другие сведения сенсора.

<!-- en PDF p.8; unit 40 -->

Затем при захвате MIPI должен выдавать данные без ошибок MIPI/ISP, а приложение — получать кадры.

<!-- en PDF p.8; unit 41 -->

### 1.5 Список AVL сенсоров

<!-- en PDF p.8; unit 42 -->

AVL RGB-сенсоров: https://redmine.rockchip.com.cn/projects/rockchip_camera_module_support_list/camera. Там приведены сведения о модулях. Для других сенсоров, например YUV, ищите драйверы в drivers/media/i2c ядра; по исходнику эти драйверы уже отлажены Rockchip.

<!-- en PDF p.8; unit 43 -->

## 2. Ошибки MIPI/ISP

<!-- en PDF p.8; unit 44 -->

При первоначальной отладке часто встречаются:

<!-- en PDF p.8; unit 45 -->

1. Нет кадров и нет ошибок ISP/MIPI.

<!-- en PDF p.8; unit 46 -->

2. Непрерывные сообщения об ошибках MIPI.

<!-- en PDF p.8; unit 47 -->

3. Ошибка ISP PIC_SIZE_ERROR.

<!-- en PDF p.8; unit 48 -->

4. Периодические ошибки MIPI.

<!-- en PDF p.8; unit 49 -->

5. Ошибки MIPI продолжаются до зависания системы.

<!-- en PDF p.8; unit 50 -->

### 2.1 Какие параметры MIPI настраивать

<!-- en PDF p.8; unit 51 -->

Для обмена между сенсором и ISP необходимо проверить четыре параметра MIPI:

<!-- en PDF p.8; unit 52 -->

1. Выходное разрешение сенсора.

<!-- en PDF p.8; unit 53 -->

2. Формат YUV или RGB RAW, разрядность 8/10/12 бит.

<!-- en PDF p.8; unit 54 -->

3. Выходная частота MIPI: исходник здесь пишет ink_freq (в других разделах link_freq).

<!-- en PDF p.8; unit 55 -->

4. Число линий MIPI сенсора и правильность их задания в DTS.

<!-- en PDF p.8; unit 56 -->

### 2.2 Нет кадров и ошибок ISP/MIPI

<!-- en PDF p.8; unit 57 -->

<!-- en PDF p.8; unit 58 -->

1. Проверьте журнал ядра, например dmesg \| grep MIPI.

<!-- en PDF p.8; unit 59 -->

2. Проверьте ошибки I2C. Если регистры не записаны, сенсор мог не инициализироваться и не включить выход.

<!-- en PDF p.8; unit 60 -->

3. Измерьте сигналы MIPI clk и data. Если выхода нет, проверяйте инициализацию сенсора и аппаратную часть.

<!-- en PDF p.9; unit 61 -->

4. Если MIPI-сигнал есть, но кадров и ошибок нет: ещё раз проверьте четыре параметра §2.1; убедитесь, что I2C работает и весь список регистров записан. Последним выход включает s_stream(). До него, особенно в s_power(), сигнала MIPI быть не должно: приёмник ещё не готов и может потерять заголовок SOT. Переключите clock lane сенсора из continuous в non-continuous.

<!-- en PDF p.9; unit 62 -->

### 2.3 Ошибки MIPI

<!-- en PDF p.9; unit 63 -->

#### 2.3.1 Таблицы ошибок MIPI

<!-- en PDF p.9; unit 64 -->

Для RK3288/RK3399/RK3368:

<!-- en PDF p.9; unit 65 -->

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

<!-- en PDF p.9; unit 66 -->

Для RK3326/PX30/RK1808 три таблицы ошибок:

<!-- en PDF p.10; unit 67 -->

| Бит ошибки ERR1 | Сокращение | Описание |
| --- | --- | --- |
| 28 | ERR_ECC | Ошибка ECC |
| 27:24 | ERR_CRC | Ошибка CRC |
| 23:20 | ERR_FRAME_DATA | Передача кадра завершена, но есть как минимум одна ошибка CRC |
| 19:16 | ERR_F_SEQ | Номер кадра не последователен, не соответствует ожиданию |
| 15:12 | ERR_F_BNDRY | Начало и конец кадра не соответствуют друг другу |
| 11:8 | ERR_SOT_SYNC | Ошибка синхронизации MIPI SOT (начало передачи), один бит на линию |
| 7:4 | ERR_EOT_SYNC | Ошибка синхронизации MIPI EOT (конец передачи), один бит на линию |

<!-- en PDF p.10; unit 68 -->

| Бит ошибки ERR2 | Сокращение | Описание |
| --- | --- | --- |
| 19:16 | ERR_CONTROL |  |
| 15:12 | ERR_ID |  |
| 11:8 | ERR_ECC_CORRECTED |  |
| 7:4 | ERR_SOTHS | Ошибка PHY SOTHS |
| 3:0 | ERR_ESC | Ошибка PHY ESC |

<!-- en PDF p.10; unit 69 -->

Разбор типичных ошибок приведён ниже.

<!-- en PDF p.10; unit 70 -->

#### 2.3.2 Ошибки SOT/SOT_SYNC

<!-- en PDF p.10; unit 71 -->

SOT должен соответствовать MIPI_D-PHY_Specification. Для подробного анализа найдите спецификацию PDF и изучите:

<!-- en PDF p.10; unit 72 -->

1. High-Speed Data Transmission — высокоскоростная передача данных.

<!-- en PDF p.10; unit 73 -->

2. Start-of-Transmission Sequence — последовательность начала передачи.

<!-- en PDF p.10; unit 74 -->

3. HS Data Transmission Burst — пакетная передача HS.

<!-- en PDF p.10; unit 75 -->

4. High-Speed Clock Transmission — высокоскоростное тактирование.

<!-- en PDF p.10; unit 76 -->

5. Global Operation Timing Parameters — общие временные параметры. Если сенсор уже работал на другой платформе, несоответствие протоколу MIPI маловероятно. Рекомендуется:

<!-- en PDF p.10; unit 77 -->

1. Уточнить у производителя, действительно ли сенсор успешно передавал данные по MIPI.

<!-- en PDF p.10; unit 78 -->

2. Повторно проверить link_freq: приёмник должен правильно настроить Ths-settle в последовательности SOT.

<!-- en PDF p.11; unit 79 -->

3. При нескольких линиях попросить производителя проверить передачу по одной линии.

<!-- en PDF p.11; unit 80 -->

#### 2.3.3 Ошибки CRC/CheckSum(CS), ECC/ECC1/ECC2

<!-- en PDF p.11; unit 81 -->

Ошибки ECC и CS означают повреждение/неполноту данных при передаче. Рекомендации:

<!-- en PDF p.11; unit 82 -->

1. Сначала проверить аппаратные сигналы.

<!-- en PDF p.11; unit 83 -->

2. При нескольких линиях проверить одну линию: плохая синхронизация линий тоже вызывает ECC.

<!-- en PDF p.11; unit 84 -->

#### 2.3.4 Ошибки ERR_PROTOCOL/ERR_F_BNDRY

<!-- en PDF p.11; unit 85 -->

Ожидаемые EOT/SOT не получены; SOT и EOT должны идти парами. Проверьте осциллограмму.

<!-- en PDF p.11; unit 86 -->

#### 2.3.5 Кадры приходят, но MIPI иногда сообщает ошибки

<!-- en PDF p.11; unit 87 -->

Сверьтесь с таблицами; сигнальные ошибки анализируйте аппаратно. Если ошибка возникает только при запуске захвата, сенсор может выдавать несоответствующий протоколу сигнал при включении. Попробуйте:

<!-- en PDF p.11; unit 88 -->

1. Полную инициализацию регистров перенести в s_power(): приёмник MIPI ещё не принимает и игнорирует данные.

<!-- en PDF p.11; unit 89 -->

2. В конце s_power() выключить выход сенсора вызовом stop_stream().

<!-- en PDF p.11; unit 90 -->

3. В start_stream() и stop_stream() только включать/выключать MIPI-выход.

<!-- en PDF p.11; unit 91 -->

#### 2.3.6 Много ошибок MIPI вплоть до зависания

<!-- en PDF p.11; unit 92 -->

Это может быть ухудшенный случай §2.3.5: сигнал не соответствует требованиям, некоторые ошибки приёмника генерируют прерывания по уровню, возникает шторм прерываний и зависание. Проверьте эффект мер §2.3.5. Английское “voltage interruptions” передано по китайскому объяснению прерываний по уровню.

<!-- en PDF p.12; unit 93 -->

#### 2.3.7 Ошибка ISP PIC_SIZE_ERROR

<!-- en PDF p.12; unit 94 -->

Ошибка размера изображения означает, что ISP получил не ожидаемое число строк/столбцов. Проверяйте разрешение на всех этапах; если MIPI уже сообщает ошибку, сначала устраните её. Далее:

<!-- en PDF p.12; unit 95 -->

1. Достаточна ли частота DDR? Низкая частота и задержка ответа тоже вызывают ошибку. Проверьте при максимальной частоте: echo performance &gt; /sys/class/devfreq/dmc/governor.

<!-- en PDF p.12; unit 96 -->

2. Не превышает ли разрешение последующего этапа предыдущее? media-ctl -p -d /dev/media0 показывает топологию. Должно выполняться Sensor == MIPI_DPHY &gt;= isp_sd input &gt;= isp_sd output. Без ручных изменений условие обычно выполняется.

<!-- en PDF p.12; unit 97 -->

3. Правильно ли сенсор выдаёт разрешение? Принудительно уменьшите заявленное разрешение в драйвере. Пример ov7251.c, исходно 640x480:

<!-- en PDF p.12; unit 98 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 640,
                .height = 480,
```

<!-- en PDF p.12; unit 99 -->

Уменьшите width/height, например до 320x240, не меняя регистры, чтобы проверить, не превышает ли настроенный размер фактический выход сенсора.

<!-- en PDF p.12; unit 100 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 320,
                .height = 240,
```

<!-- en PDF p.12; unit 101 -->

## 3. Получение изображений

<!-- en PDF p.12; unit 102 -->

В этой главе рассматриваются типичные вопросы захвата изображений.

<!-- en PDF p.12; unit 103 -->

### 3.1 Способы захвата

<!-- en PDF p.12; unit 104 -->

Драйверы RKISP/RKCIF поддерживают V4L2. Можно использовать:

<!-- en PDF p.12; unit 105 -->

1. v4l2-ctl из v4l-utils. При отладке сначала проверяйте им получение изображения. Он сохраняет кадры в файл, но не декодирует и не отображает их. Для просмотра используйте mplayer в Ubuntu/Debian либо 7yuv в Windows.

<!-- en PDF p.13; unit 106 -->

Подробности v4l2-ctl и mplayer приведены в Rockchip_Developer_Guide_Linux_Camera_CN.pdf; также доступна справка v4l2-ctl --help.

<!-- en PDF p.13; unit 107 -->

2. qcamera из Linux SDK: откройте приложение камеры с рабочего стола, выберите видеоустройство и предпросмотр. Это демонстрационное Qt-приложение; для продукта рекомендуется собственная разработка.

<!-- en PDF p.13; unit 108 -->

3. Плагин GStreamer v4l2src получает данные /dev/video и выводит на экран. Сначала изучите скрипты SDK в /rockchip_test/camera/. Старые плагины rkisp и rkv4l2src больше не поддерживаются; используйте штатный v4l2src. Причины: 3A больше не требуется настраивать в этих плагинах (глава 4), а V4L2-интерфейс rkisp стал стандартнее.

<!-- en PDF p.13; unit 109 -->

4. В Debian доступны VLC и другие открытые инструменты. После установки VLC через apt можно вывести камеру следующей командой:

<!-- en PDF p.13; unit 110 -->

```text
vlc v4l2:///dev/video1:width=640:height=480
```

<!-- en PDF p.13; unit 111 -->

Нужны права группы video либо root.

<!-- en PDF p.13; unit 112 -->

### 3.2 Неправильные цвета, слишком тёмное или светлое изображение

<!-- en PDF p.13; unit 113 -->

<!-- en PDF p.13; unit 114 -->

Рассматривайте тип сенсора:

<!-- en PDF p.13; unit 115 -->

1. RAW RGB (RGGB, BGGR и т. п.) требует работающего 3A, см. главу 4. Если 3A исправен, проверьте формат декодирования/вывода и перестановку компонентов UV.

<!-- en PDF p.13; unit 116 -->

2. При YUV либо RGB565/RGB888 ISP работает в bypass. При неверных цветах проверьте выходной формат сенсора и порядок UV; если они верны, обратитесь к производителю сенсора. При явно неправильной яркости также обратитесь к нему.

<!-- en PDF p.14; unit 117 -->

### 3.3 Топология ISP и команда media-ctl

<!-- en PDF p.14; unit 118 -->

<!-- en PDF p.14; unit 119 -->

RKISP/RKCIF может поочерёдно работать с несколькими сенсорами, а RKISP поддерживает многоступенчатое кадрирование. Узлы соединены топологией; media-ctl позволяет настроить параметры каждого. Подробности в Rockchip_Developer_Guide_Linux_Camera_CN.pdf.

<!-- en PDF p.14; unit 120 -->

#### 3.3.1 Несколько сенсоров на одном ISP

<!-- en PDF p.14; unit 121 -->

Допускается только поочерёдная работа. Соедините сенсоры с MIPI DPHY в DTS, затем переключайте через media-ctl.

<!-- en PDF p.14; unit 122 -->

### 3.4 Совпадают ли захваченные RAW-данные с оригиналом?

<!-- en PDF p.14; unit 123 -->

<!-- en PDF p.14; unit 124 -->

В bypass при RAW (RGGB/BGGR) требуется выравнивание по 8 бит; недостающие младшие биты дополняются нулями. Исходные 8/16-битные кадры не меняются. Для 10/12-битных каждый пиксель дополняется младшими нулями до 16 бит. RAW выдаёт только видеоустройство MP; SP его не поддерживает.

<!-- en PDF p.14; unit 125 -->

### 3.5 Одновременный выход MP и SP

<!-- en PDF p.14; unit 126 -->

<!-- en PDF p.14; unit 127 -->

SP и MP независимо кадрируют и меняют формат одного сенсорного изображения, выводя одновременно. Возможности описаны в Rockchip_Developer_Guide_Linux_Camera_CN.pdf. Одновременный вывод возможен, только если оба выдают RGB/YUV. При RAW на MP выхода SP нет.

<!-- en PDF p.14; unit 128 -->

### 3.6 Увеличение изображения в ISP

<!-- en PDF p.14; unit 129 -->

Аппаратно поддерживается, но не рекомендуется и по умолчанию отключено в драйвере.

<!-- en PDF p.15; unit 130 -->

### 3.7 Поворот изображения в ISP

<!-- en PDF p.15; unit 131 -->

Не поддерживается. Для flip/mirror сначала проверьте функцию сенсора: это наиболее эффективно. Иначе используйте RGA; код и примеры в external/linux-rga/, документация в docs/.

<!-- en PDF p.15; unit 132 -->

### 3.8 Захват изображения GREY

<!-- en PDF p.15; unit 133 -->

Если ISP выдаёт YUV или сенсор — Y8, приложение может непосредственно захватывать V4L2_PIX_FMT_GREY (FourCC GREY).

<!-- en PDF p.15; unit 134 -->

### 3.9 Поддерживаемые RGB-форматы

<!-- en PDF p.15; unit 135 -->

RGB поддерживает только SP: V4L2_PIX_FMT_XBGR32 и V4L2_PIX_FMT_RGB565. XBGR32 (FourCC XR24) содержит R/G/B/X, где X всегда 0. RGB888, то есть 24-битный вывод, не поддерживается.

<!-- en PDF p.15; unit 136 -->

### 3.10 Быстрый предпросмотр на плате без экрана

<!-- en PDF p.15; unit 137 -->

SDK external/uvc_app/ превращает плату в UVC-камеру. См. описание и код каталога. После подключения к ПК устройство распознаётся как USB-камера и позволяет предпросмотр.

<!-- en PDF p.15; unit 138 -->

### 3.11 Различение SP и MP

<!-- en PDF p.15; unit 139 -->

Посмотрите топологию командой media-ctl -p -d /dev/media0; при нескольких устройствах попробуйте /dev/media1 и /dev/media2. Часть вывода:

<!-- en PDF p.15; unit 140 -->

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //Means the entity is
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //The corresponding
device node is/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //Means the entity is
SP(SelfPath)
            type Node subtype V4L flags 0
```

<!-- en PDF p.16; unit 141 -->

```text
            device node name /dev/video2                 //The corresponding
device node is/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

<!-- en PDF p.16; unit 142 -->

Если media-ctl отсутствует, можно искать через /sys/, например:

<!-- en PDF p.16; unit 143 -->

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # Corresponding MP
node/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # Corresponding SP
Node/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

<!-- en PDF p.16; unit 144 -->

## 4. Обработка 3A

<!-- en PDF p.16; unit 145 -->

RAW BAYER RGB (RGGB/BGGR) требует 3A и обработки RKISP. Реализация зависит от camera_engine_rkisp; рекомендуется актуальная совместимая версия. Проверьте модуль в списке поддержки: для поддерживаемых модулей есть XML в external/camera_engine_rkisp/iqfiles/. Иначе оформите запрос настройки модуля через деловой контакт производителя.

<!-- en PDF p.16; unit 146 -->

### 4.1 Версия camera_engine_rkisp

<!-- en PDF p.16; unit 147 -->

1. По исходному коду:

<!-- en PDF p.16; unit 148 -->

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.16; unit 149 -->

2. По журналу выполнения:

<!-- en PDF p.16; unit 150 -->

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.17; unit 151 -->

Если версия ниже v2.2.0, рассмотрите обновление до v2.2.0 или новее.

<!-- en PDF p.17; unit 152 -->

#### 4.1.1 Требуемая версия драйвера rkisp ядра

<!-- en PDF p.17; unit 153 -->

<!-- en PDF p.17; unit 154 -->

camera_engine_rkisp предъявляет требования к версии драйвера ядра; убедитесь, что rkisp достаточно новый.

<!-- en PDF p.17; unit 155 -->

1. Версия ISP из исходников ядра:

<!-- en PDF p.17; unit 156 -->

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # The output v0.1.5 is
the version number of the rkisp driver
```

<!-- en PDF p.17; unit 157 -->

2. Версия ISP из журнала ядра:

<!-- en PDF p.17; unit 158 -->

```text
# dmesg  | grep "rkisp1 driver version"
[    0.867864] rkisp1 ff4a0000.rkisp1: rkisp1 driver version: v00.01.05
```

<!-- en PDF p.17; unit 159 -->

### 4.2 Обновление camera_engine_rkisp

<!-- en PDF p.17; unit 160 -->

Обновляются три части:

<!-- en PDF p.17; unit 161 -->

1. Основной camera_engine_rkisp в external/camera_engine_rkisp. Обновляется git/repo отдельно, без изменения остальных каталогов SDK.

<!-- en PDF p.17; unit 162 -->

2. Ядро согласно требованиям camera_engine_rkisp. Требуемую версию rkisp ищите через git log этого каталога. Пример:

<!-- en PDF p.17; unit 163 -->

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729
```

<!-- en PDF p.18; unit 164 -->

```text
matched rkisp1 driver version:
  v0.1.5                 # The needed kernel driver version is v0.1.5

Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
Signed-off-by: ZhongYichong <zyc@rock-chips.com>
Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

<!-- en PDF p.18; unit 165 -->

3. Сценарий сборки Buildroot в buildroot/package/rockchip/camera_engine_rkisp. Его можно обновить отдельно, если полное обновление Buildroot неудобно.

<!-- en PDF p.18; unit 166 -->

### 4.3 Проверка работы 3A

<!-- en PDF p.18; unit 167 -->

После проверки camera_engine_rkisp v2.2.0 или новее захватите кадр и оцените цвета/экспозицию. Проверьте также фоновый процесс rkisp_3A_server:

<!-- en PDF p.18; unit 168 -->

```text
# ps -ef | grep rkisp_3A_server
  706 root      9176 S    /usr/bin/rkisp_3A_server --mmedia=/dev/media1
  746 root      2408 S    grep rkisp_3A_server
# pidof rkisp_3A_server
706
```

<!-- en PDF p.18; unit 169 -->

В примере PID 706 соответствует rkisp_3A_server.

<!-- en PDF p.18; unit 170 -->

#### 4.3.1 Процесс rkisp_3A_server отсутствует

<!-- en PDF p.18; unit 171 -->

1. Проверьте /usr/bin/rkisp_3A_server. Если файла нет, проверьте версию camera_engine_rkisp и сборку.

<!-- en PDF p.18; unit 172 -->

2. Найдите ошибки rkisp_3A в /var/log/syslog, особенно отсутствие или несовпадение XML сенсорного модуля.

<!-- en PDF p.18; unit 173 -->

3. В одном shell запустите rkisp_3A_server --mmedia=/dev/media0, выбирая media-устройство, соответствующее /dev/video. В другом захватите кадры, чтобы получить сообщения ошибок сервера.

<!-- en PDF p.18; unit 174 -->

#### 4.3.2 Запуск rkisp_3A_server

<!-- en PDF p.18; unit 175 -->

В SDK скрипт /etc/init.d/S40rkisp_3A запускает сервер в фоне. Если скрипта нет, проверьте camera_engine_rkisp и сценарии сборки пакета Buildroot.

<!-- en PDF p.19; unit 176 -->

#### 4.3.3 Имя и путь IQ-файла XML

<!-- en PDF p.19; unit 177 -->

<!-- en PDF p.19; unit 178 -->

Имя составляется из трёх частей:

<!-- en PDF p.19; unit 179 -->

1. Тип сенсора, например ov5695 или imx327.

<!-- en PDF p.19; unit 180 -->

2. Имя модуля из DTS. На RK3326/PX30 EVB пример: rockchip,camera-module-name = "TongJu";

<!-- en PDF p.19; unit 181 -->

3. Имя объектива из DTS: rockchip,camera-module-lens-name = "CHT842-MD"; Получается ov5695_TongJu_CHT842-MD.xml в /etc/iqfiles/. Регистр букв важен.

<!-- en PDF p.19; unit 182 -->

### 4.4 Ручная экспозиция

<!-- en PDF p.19; unit 183 -->

Сначала завершите rkisp_3A_server, затем используйте пример rkisp_demo.cpp или исходники librkisp_api.so.

<!-- en PDF p.19; unit 184 -->

### 4.5 Журнал librkisp

<!-- en PDF p.19; unit 185 -->

Задайте переменную среды persist_camera_engine_log. Назначение битов:

<!-- en PDF p.19; unit 186 -->

```text
bits:    23-20   19-16 15-12  11-8  7-4   3-0
module: [xcore]  [ISP] [AF]   [AWB] [AEC] [NO]

0: error
1: warning
2: info
3: verbose
4: debug
```

<!-- en PDF p.19; unit 187 -->

Например, включение debug ISP и AWB:

<!-- en PDF p.19; unit 188 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x040400
# /usr/bin/rkisp_3A_server --mmedia=/dev/media0
```

<!-- en PDF p.20; unit 189 -->

![Техническая схема оригинала · EN PDF p.20](/docs/rockchip-linux44-camera-troubleshooting/assets/en-p020-vector-01.png)

## 5. Разработка приложений

<!-- en PDF p.20; unit 190 -->

### 5.1 Пример на C

<!-- en PDF p.20; unit 191 -->

1. SDK содержит rkisp_demo и исходники. Как v4l2-ctl, программа захватывает, но не показывает изображения; прежде всего это образец кода. Код в external/camera_engine_rkisp/apps, а в старых версиях — external/camera_engine_rkisp/tests.

<!-- en PDF p.20; unit 192 -->

2. SDK содержит библиотеку rkisp_api.so и исходники для изменения или непосредственной разработки на C. Код в external/camera_engine_rkisp/apps; если каталога нет в старой версии, обновите её.

<!-- en PDF p.20; unit 193 -->

### 5.2 DMA buffer и его преимущества

<!-- en PDF p.20; unit 194 -->

DMA buffer — память, выделенная драйвером и разделяемая несколькими модулями ядра. Это сокращает копирование, повышает эффективность обработки изображений и снижает нагрузку DDR. Пример кодирования камеры через MPP:

<!-- en PDF p.20; unit 195 -->

RKISP → общий DMA buffer → кодирование MPP.

<!-- en PDF p.20; unit 196 -->

RKISP может принимать DMA buffer от MPP/RGA либо выделять память и экспортировать буфер другим модулям. Подробности в исходниках librkisp_api.so.

## Различия кода оригиналов

Основной текст соответствует языку оригинала; RU/DE переведены с EN. Ниже сохранены отличающиеся фрагменты другого оригинала, включая комментарии/разметку. Это независимые примеры, не единый исполняемый сценарий; параметры источника не подменены.

**CN PDF p.13 · 108**

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
```

**CN PDF p.14 · 109**

```text
...
```

**CN PDF p.14 · 111**

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

**CN PDF p.14 · 116**

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # 输出的v2.2.0是
librkisp.so的版本号
```

**CN PDF p.14 · 118**

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # 输出的v2.2.0是librkisp.so
的版本号
```

**CN PDF p.15 · 122**

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # 输出的v0.1.5是rkisp驱动的
版本号
```

**CN PDF p.15 · 129**

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729

    matched rkisp1 driver version:
      v0.1.5                 # 所需要的kernel驱动版本为v0.1.5

    Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
    Signed-off-by: ZhongYichong <zyc@rock-chips.com>
    Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

{% endraw %}
