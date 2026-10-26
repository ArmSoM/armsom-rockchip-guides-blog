---

title: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A и приложения"

description: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A и приложения · V2.0.0"

excerpt: "Rockchip Linux 4.4 Camera: V4L2, ISP, 3A и приложения"

translation_key: 183-rockchip-linux44-camera

slug: 183-rockchip-linux44-camera

lang: ru

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Справка платформы: V2.0.0 производителя, RK3399, RK3326/PX30, RK3288, RK312x/PX3SE, RK180x; Linux 4.4. Полные разделы ниже посвящены драйверам камеры, подключению сенсоров, захвату и отладке. Конкретные сочетания платы ArmSoM/BSP/SDK/ядра не проверены; сверьте схему, интерфейсы, питание/такты, драйверы и IQ-файлы. Примеры и измерения производителя не являются тестами ArmSoM; команды не выполнялись. ZH использует китайские оригинальные рисунки, EN/RU/DE — английские.



Техническое предисловие: структура ISP/CIF, разработка/перенос сенсоров, отладка верхнего уровня, API приложений и 3A. Драйверы ориентированы на V4L2 и предоставляют интерфейсы переноса/приложений; нужны знания инструментов и понятий V4L2.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



| SoC | Kernel | ISP | CIF |
| --- | --- | --- | --- |
| RK3399 | 4.4 | 2 | — |
| RK3326/PX30 | 4.4 | 1 | 1 |
| RK3288 | 4.4 | 1 | 1 |
| RK312x/PX3SE | 4.4 | — | 1 |
| RK180x | 4.4 | 1 | 1 |



<!-- en PDF p.4; unit 0 -->

## 1. Версии и терминология

<!-- en PDF p.4; unit 1 -->

### 1.1 Термины

<!-- en PDF p.4; unit 2 -->

3A — алгоритмы автофокуса AF, автоэкспозиции AE и автобаланса белого AWB либо библиотека algorithms.so.

Async Sub Device — асинхронное подустройство V4L2 в Media Controller, например сенсор или MIPI DPHY. Bayer Raw/Raw Bayer — кадры RGGB, BGGR, GBRG, GRBG от сенсора/ISP. Buildroot — семейство Linux SDK Rockchip на основе Buildroot. Camera — система VIP/ISP, подключённого сенсора и их драйверов. CIF — модуль VIP, принимающий данные сенсора в память без функций ISP. DVP — параллельный Digital Video Port. Entity — узел Media Controller. FCC/FourCC — четырёхсимвольный код формата изображения в Linux, см. соответствующий раздел. HSYNC — строчная синхронизация DVP. ISP — Image Signal Processing, приём и обработка изображения; термин включает аппаратную часть и драйвер. IOMMU — Input-Output Memory Management Unit, отображает физически разрозненные страницы в непрерывное адресное пространство CIF/ISP; включает аппаратный модуль и драйвер. Английский оригинал здесь пишет iohmu. IQ — Image Quality, настроенный XML Bayer Raw-камеры для 3A. Media Controller — инфраструктура ядра для управления медиатопологией. MIPI — протокол MIPI. MIPI-DPHY — протокол D-PHY либо совместимый контроллер Rockchip. MP — Main Path, выход ISP полного разрешения для фотографий и RAW. PCLK — пиксельный такт сенсора. Pipeline — цепь связанных Entity. RKCIF — имя драйвера CIF. RKISP1 — имя драйвера ISP.

<!-- en PDF p.5; unit 3 -->

SP — Self Path, выход ISP максимум 1080p. Userspace — пользовательское пространство Linux в отличие от ядра. V4L2 — Video4Linux2, видеоподсистема ядра. VIP — Video Input Processor, прежнее альтернативное название CIF. VSYNC — кадровая синхронизация DVP.

<!-- en PDF p.5; unit 4 -->

### 1.2 История драйверов ISP/CIF

<!-- en PDF p.5; unit 5 -->

RKISP1 и RKCIF основаны на Media Controller, V4L2 Framework и VB2. Сенсор регистрируется асинхронно как Async Sub Device. Код: drivers/media/platform/rockchip/isp1/ и drivers/media/platform/rockchip/cif/; сенсоры — drivers/media/i2c. Старые версии больше не обновляются регулярно либо не поддерживаются. Таблица:

<!-- en PDF p.5; unit 6 -->

| Драйвер | Тип | Kernel | В рамках статьи | Расположение кода |
| --- | --- | --- | --- | --- |
| RKISP1 | ISP | 4.4 | Да | drivers/media/platform/rockchip/isp1 |
| RKCIF | CIF | 4.4 | Да | drivers/media/platform/rockchip/cif |
| RK-ISP10 | ISP | 4.4 | Нет | drivers/media/platform/rk-isp10/ |
| RK-<br>CAMSYS | CIF | 4.4 | Нет | drivers/media/video |

<!-- en PDF p.5; unit 7 -->

### 1.3 Документ FAQ

<!-- en PDF p.5; unit 8 -->

Для отладки сенсора используйте Rockchip_Trouble_Shooting_Linux4.4_Camera_CN, обычно в том же каталоге.

<!-- en PDF p.5; unit 9 -->

## 2. Разработка и перенос драйвера сенсора

<!-- en PDF p.5; unit 10 -->

Драйверы находятся в drivers/media/i2c. Здесь рассматриваются драйверы Media Controller, не drivers/media/i2c/soc_camera. Сенсор максимально независим от RKCIF/RKISP1; регистрация асинхронная, связь задаётся remote-endpoint в DTS. Такой драйвер подходит обоим.

<!-- en PDF p.6; unit 11 -->

Сенсор выступает Sub Device и связывается Pad с Rkcif/Rkisp1/Mipi Dphy. Рассмотрены код, DTS и отладка. Пять задач переноса: последовательность vdd/reset/powerdown/clk по datasheet; регистры требуемого разрешения/формата; callbacks struct v4l2_subdev_ops, обычно set_fmt/get_fmt/s_stream/s_power; V4L2 controls fps/exposure/gain/test pattern; probe() и инициализация Media Control/Sub Device. Добавьте документацию по примеру Documentation/devicetree/bindings/media/i2c/, чтобы настроить плату. В board DTS задайте clk и iomux, regulator/gpio по схеме, дочерний port для связи CIF/ISP. Примеры — ov5695 и ov2685.

<!-- en PDF p.6; unit 12 -->

### 2.1 Последовательность питания

<!-- en PDF p.6; unit 13 -->

Требования различаются. Многим OV достаточно правильных mclk/vdd/reset/powerdown без строгого порядка и задержек, но OV2685 требует строгой последовательности. Следуйте диаграмме datasheet. Ниже сокращённая __ov5695_power_on() из drivers/media/i2c/ov5695.c:

<!-- en PDF p.6; unit 14 -->

```text
static int __ov5695_power_on(struct ov5695 *ov5695)
{
  int ret;
  u32 delay_us;
  struct device *dev = &ov5695->client->dev;

  ret = clk_set_rate(ov5695->xvclk, OV5695_XVCLK_FREQ);

  if (clk_get_rate(ov5695->xvclk) != OV5695_XVCLK_FREQ)
   dev_warn(dev, "xvclk mismatched, modes are based on 24MHz\n");
  ret = clk_prepare_enable(ov5695->xvclk);
```

<!-- en PDF p.7; unit 15 -->

```text
  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 1);

  ret = regulator_bulk_enable(OV5695_NUM_SUPPLIES, ov5695->supplies);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 0);

  if (!IS_ERR(ov5695->pwdn_gpio))
   gpiod_set_value_cansleep(ov5695->pwdn_gpio, 1);

  /* 8192 cycles prior to first SCCB transaction */
  delay_us = ov5695_cal_delay(8192);
  usleep_range(delay_us, delay_us * 2);

  return 0;
}
```

<!-- en PDF p.7; unit 16 -->

OV5695: сначала xvclk/mclk, затем reset, затем источники vdd. regulator_bulk подходит, поскольку vdd/vodd/avdd не требуют порядка; при строгой последовательности управляйте отдельно, как OV2685. Переведите reset/powerdown в рабочее состояние согласно корпусу и схеме; может требоваться только один из них. Затем выдержите 8192 тактов по OV5695. Даже если сенсор работает при иной последовательности, надёжнее соблюдать datasheet. Аналогично реализуйте требуемое выключение.

<!-- en PDF p.7; unit 17 -->

#### 2.1.1 Проверка включения

<!-- en PDF p.7; unit 18 -->

На этапе .probe() читается chip id, например ov5695_check_sensor_id(). Правильный ID обычно подтверждает питание и работоспособную связь I2C.

<!-- en PDF p.8; unit 19 -->

### 2.2 Список начальных регистров

<!-- en PDF p.8; unit 20 -->

struct ov5695_mode и struct ov2685_mode описывают режимы: разрешение, Mbus Code, fps, список регистров. Заполняйте регистры по данным производителя. Список заканчивается REG_NULL; этот маркер не должен совпадать с адресом регистра.

<!-- en PDF p.8; unit 21 -->

### 2.3 Обратные вызовы v4l2_subdev_ops

<!-- en PDF p.8; unit 22 -->

Это основа управления сенсором; полный интерфейс в include/media/v4l2-subdev.h. Минимально рекомендуются: .open() при открытии /dev/v4l-subdev? из userspace, необходим для отдельной настройки controls; .s_power() включение/выключение; .s_stream() запуск/остановка, обычно запись регистров выдачи кадров; .enum_mbus_code() форматы; .enum_frame_size() разрешения; .get_fmt() текущий формат/размер, без него media-ctl не покажет формат Entity; .set_fmt() установка. Сложнее всего питание и поток: OV5695 использует pm_runtime, а .s_stream() вызывает v4l2_ctrl_handler_setup() для фактической записи controls, которые могли измениться при выключенном сенсоре.

<!-- en PDF p.8; unit 23 -->

### 2.4 V4L2 controls

<!-- en PDF p.8; unit 24 -->

Для динамической экспозиции, усиления и blanking, особенно RAW Bayer, реализуйте controls. ov5695_initialize_controls() объявляет набор и границы. struct v4l2_ctrl_ops задаёт ov5695_set_ctrl(), через который приложение устанавливает значения.

<!-- en PDF p.9; unit 25 -->

### 2.5 Probe, media entity и v4l2 subdev

<!-- en PDF p.9; unit 26 -->

<!-- en PDF p.9; unit 27 -->

probe разбирает DTS для regulator/gpio/clk питания, затем регистрирует media entity, v4l2 subdev и controls. Регистрация subdev асинхронная. v4l2_i2c_subdev_init() задаёт subdev и callbacks; ov5695_initialize_controls() — controls; media_entity_init() — entity, у OV5695 один выход Source Pad; v4l2_async_register_subdev() обязателен, поскольку RKISP1/RKCIF используют асинхронную регистрацию.

<!-- en PDF p.9; unit 28 -->

### 2.6 Пример DTS: MIPI-сенсор

<!-- en PDF p.9; unit 29 -->

По схеме настройте pinctrl/iomux, clk, gpio и remote port. Пример OV5695 в rk3326-evb-lp3-v10-linux.dts:

<!-- en PDF p.9; unit 30 -->

```text
ov5695: ov5695@36 {
  compatible = "ovti,ov5695";
  reg = <0x36>;

  clocks = <&cru SCLK_CIF_OUT>;
  clock-names = "xvclk";

  avdd-supply = <&vcc2v8_dvp>;
  dovdd-supply = <&vcc1v8_dvp>;
  dvdd-supply = <&vdd1v5_dvp>;

  /*reset-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;*/
  pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;

  rockchip,camera-module-index = <0>;
  rockchip,camera-module-facing = "back";
  rockchip,camera-module-name = "TongJu";
  rockchip,camera-module-lens-name = "CHT842-MD";

  port {
   ucam_out: endpoint {
     remote-endpoint = <&mipi_in_ucam>;
     data-lanes = <1 2>;
   };
  };
};
```

<!-- en PDF p.10; unit 31 -->

pinctrl инициализирует reset и clk iomux. clock называется xvclk, как ожидает драйвер, частота 24M. OV5695 требует три питания. port/endpoint связывается с mipi_in_wcam, а MIPI DPHY ссылается на wcam_out. data-lanes задаёт две линии OV5695 и должен совпадать в wcam_out.

<!-- en PDF p.10; unit 32 -->

### 2.7 Пример DTS: DVP-сенсор

<!-- en PDF p.10; unit 33 -->

В отличие от MIPI, DVP не имеет data-lanes, endpoint связан с CIF; прочее аналогично. Для gc2155 в arch/arm64/boot/dts/rockchip/rk3326-evb-lp3-v10-linux.dts remote-endpoint указывает cif_in; data-lanes не нужен.

<!-- en PDF p.10; unit 34 -->

### 2.8 Отладка сенсора

<!-- en PDF p.10; unit 35 -->

После переноса проверьте работу. При проблемах сначала используйте FAQ.

<!-- en PDF p.10; unit 36 -->

#### 2.8.1 Успешность регистрации

<!-- en PDF p.10; unit 37 -->

Первое — I2C и правильный chip id, подтверждающий питание. Обычно драйвер печатает соответствующий журнал, разный для каждого сенсора. Второе — сенсор должен присутствовать как Entity в топологии media-ctl. Тогда регистрация успешна.

<!-- en PDF p.10; unit 38 -->

#### 2.8.2 Выход инструментов захвата

<!-- en PDF p.10; unit 39 -->

Захватите кадры через v4l2-ctl, GStreamer или приложение камеры.

<!-- en PDF p.11; unit 40 -->

#### 2.8.3 Проверка controls

<!-- en PDF p.11; unit 41 -->

Через v4l2-ctl измените gain/exposure/blanking и проверьте кадры: растёт ли яркость при усилении/экспозиции, падает ли fps при увеличении blanking.

<!-- en PDF p.11; unit 42 -->

## 3. Инструменты отладки и команды

<!-- en PDF p.11; unit 43 -->

Длинные команды разбиты обратной косой чертой \ для удобства. При копировании переносы можно сохранить; если объединяете в одну строку, удалите символ продолжения \.

<!-- en PDF p.11; unit 44 -->

### 3.1 v4l-utils

<!-- en PDF p.11; unit 45 -->

В SDK пакет интегрирован по умолчанию; включается/выключается настройкой Buildroot:

<!-- en PDF p.11; unit 46 -->

```text
# grep -rn LIBV4L_UTILS - buildroot/configs/rockchip/camera.config
BR2_PACKAGE_LIBV4L_UTILS=y
```

<!-- en PDF p.11; unit 47 -->

Исходники доступны на www.linuxtv.org. В Ubuntu пакет устанавливается apt:

<!-- en PDF p.11; unit 48 -->

```text
# sudo apt-get install v4l-utils
```

<!-- en PDF p.11; unit 49 -->

### 3.2 Топология через media-ctl

<!-- en PDF p.11; unit 50 -->

media-ctl входит в v4l-utils и проверяет/настраивает format, crop, link enable каждой Entity. Это даёт гибкость, но для обычных сценариев достаточно стандартных настроек.

<!-- en PDF p.11; unit 51 -->

#### 3.2.1 Просмотр топологии

<!-- en PDF p.11; unit 52 -->

Следующая команда выводит топологию. При CIF+ISP, нескольких ISP или USB-камере возможно несколько устройств /dev/media0, /dev/media1, /dev/media2.

<!-- en PDF p.12; unit 53 -->

```text
# media-ctl -p -d /dev/media0
```

<!-- en PDF p.12; unit 54 -->

Проверьте Entity сенсора. Её отсутствие означает проблему регистрации, см. FAQ. Сокращённый вывод OV5695 на RK3326:

<!-- en PDF p.12; unit 55 -->

```text
# media-ctl -p -d /dev/media1
- entity 9: m00_b_ov5695 2-0036 (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR10_1X10/2592x1944@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]
```

<!-- en PDF p.12; unit 56 -->

Entity m00_b_ov5695 2-0036 — V4L2 subdev Sensor, узел /dev/v4l-subdev2, доступный приложению/v4l2-ctl. Единственный выход Source — pad0. Формат [fmt:SBGGR10_1X10/2592x1944@10000/300000 field:none]; SBGGR10_1X10 — mbus-code. Source pad0 связан с pad0 "rockchip-mipi-dphy-rx", состояние ENABLED. DYNAMIC разрешает переключить DISABLED. Если один ISP/CIF подключён к двум сенсорам, активен только один. Пример:

<!-- en PDF p.12; unit 57 -->

```text
[root@rk3326_64:/]# media-ctl -p -d /dev/media1
-entity 9: irs16x5c 1-003d (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]

-entity 10: irs16x5c 2-003d (1 pad, 1 link)
      type V4L2 subdev subtype Sensor flags 0
      device node name /dev/v4l-subdev3
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [DYNAMIC]
```

<!-- en PDF p.12; unit 58 -->

В этом примере:

<!-- en PDF p.13; unit 59 -->

Оба irs16x5c подключены к "rockchip-mipi-dphy-rx":0, но ENABLED только entity 9. Переключать можно лишь при остановленной цепи; менять Entity во время захвата нельзя.

<!-- en PDF p.13; unit 60 -->

#### 3.2.2 Переключение сенсора

<!-- en PDF p.13; unit 61 -->

При нескольких подключённых сенсорах используются следующие команды:

<!-- en PDF p.13; unit 62 -->

```text
# media-ctl -d /dev/media0 \
  -l '"ov5695 7-0036":0->"rockchip-sy-mipi-dphy":0[0]'
# media-ctl -d /dev/media0 \
  -l '"ov2685 7-003c":0->"rockchip-sy-mipi-dphy":0[1]'
```

<!-- en PDF p.13; unit 63 -->

Формат: media-ctl -l'"entity name":pad-&gt;"entity name":pad[Status]'. Вся связь заключена в одинарные кавычки из-за &gt; [ ]; имена — в двойные из-за пробелов. Status задаёт включение/выключение значениями 0/1; сверяйте конкретное значение по примеру и media-ctl.

<!-- en PDF p.13; unit 64 -->

#### 3.2.3 Формат и размер Entity

<!-- en PDF p.13; unit 65 -->

Пример 1: OV5695 по умолчанию 2592x1944, изменим на 1920x1080.

<!-- en PDF p.13; unit 66 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"m00_b_ov5695 2-0036":0[fmt:SBGGR10_1X10/1920x1080]'
```

<!-- en PDF p.13; unit 67 -->

Затем соответственно измените rkisp1-isp-subdev и crop видеоустройства: последующая стадия не должна быть больше предыдущей.

<!-- en PDF p.13; unit 68 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/1920x1080]'
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
# v4l2-ctl -d /dev/video1 \
  --set-selection=target=crop,top=0,left=0,width=1920,height=1080
```

<!-- en PDF p.13; unit 69 -->

Пример 2: Для Bayer RAW rkisp1 по умолчанию выдаёт YUV. Измените fmt rkisp1-isp-subdev на формат сенсора, чтобы MP выдавал RAW.

<!-- en PDF p.13; unit 70 -->

```text
# media-ctl -d /dev/media1 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10/2592x1944]'
```

<!-- en PDF p.13; unit 71 -->

Обратите внимание:

<!-- en PDF p.14; unit 72 -->

Спецсимволы требуют одинарных/двойных кавычек; не изменяйте пробелы внутри них. Подробности — media-ctl --help.

<!-- en PDF p.14; unit 73 -->

#### 3.2.4 Форматы mbus-code

<!-- en PDF p.14; unit 74 -->

Media Bus Pixel Codes описывают передачу по физической шине, например сенсор→ISP через MIPI DPHY либо внутри ISP. Не путайте с FourCC, описывающим формат в памяти. Определения находятся в include/uapi/linux/media-bus-format.h. Используемые коды:

<!-- en PDF p.14; unit 75 -->

| Макрос ядра | Сокращение Mbus-code | Тип | Bpp | Ширина шины | Отсчёты |
| --- | --- | --- | --- | --- | --- |
| MEDIA_BUS_FMT_SBGGR8_1X8 | SBGGR8_1X8 | Bayer<br>Raw | 8 | 8 | 1 |
| MEDIA_BUS_FMT_SRGGB8_1X8 | SRGGB8_1X8 | Bayer<br>Raw | 8 | 8 | 1 |
| MEDIA_BUS_FMT_SBGGR10_1X10 | SBGGR10_1X10 | Bayer<br>Raw | 10 | 10 | 1 |
| MEDIA_BUS_FMT_SRGGB10_1X10 | SRGGB10_1X10 | Bayer<br>Raw | 10 | 10 | 1 |
| MEDIA_BUS_FMT_SBGGR12_1X12 | SBGGR12_1X12 | Bayer<br>Raw | 12 | 12 | 1 |
| MEDIA_BUS_FMT_SRGGB12_1X12 | SRGGB12_1X12 | Bayer<br>Raw | 12 | 12 | 1 |
| MEDIA_BUS_FMT_YUYV8_2X8 | YVYU8_2X8 | YUV<br>422 | 16 | 8 | 2 |
| MEDIA_BUS_FMT_UYUV8_2X8 | UYUV8_2X8 | YUV<br>422 | 16 | 8 | 2 |
| MEDIA_BUS_FMT_Y8_1X8 | Y8_1X8 | YUV<br>GREY | 8 | 8 | 1 |
| MEDIA_BUS_FMT_RGB888_1X24 | RGB888_1X24 | RGB<br>888 | 24 | 24 | 1 |

<!-- en PDF p.14; unit 76 -->

media-ctl может перечислить поддерживаемые mbus-code:

<!-- en PDF p.14; unit 77 -->

```text
# media-ctl --known-mbus-fmts
```

<!-- en PDF p.15; unit 78 -->

#### 3.2.5 Поиск видеоустройств

<!-- en PDF p.15; unit 79 -->

Sub Device соответствует /dev/v4l-subdev, Video Device — /dev/video. При нескольких устройствах важно найти выдающий кадры узел.

<!-- en PDF p.15; unit 80 -->

```text
# media-ctl -d /dev/media1 -e "rkisp1_selfpath"
/dev/video2
# media-ctl -d /dev/media1 -e "rkisp1_mainpath"
/dev/video1
```

<!-- en PDF p.15; unit 81 -->

Две команды показывают пути SP и MP в /dev/media1. RKISP1 имеет два видеовыхода, оба дают кадры. Для RKCIF аналогично:

<!-- en PDF p.15; unit 82 -->

```text
# media-ctl -d /dev/media0 -e "stream_cif"
/dev/video0
```

<!-- en PDF p.15; unit 83 -->

Команда показывает RKCIF в /dev/media0. У RKCIF один видеовыход.

<!-- en PDF p.15; unit 84 -->

```text
# v4l2-ctl -d /dev/video1 --all
```

<!-- en PDF p.15; unit 85 -->

Команда показывает основные параметры /dev/video1: crop, fmt, controls.

<!-- en PDF p.15; unit 86 -->

### 3.3 Захват через v4l2-ctl

<!-- en PDF p.15; unit 87 -->

media-ctl через /dev/media0 управляет format/size/link узлов топологии (английский оригинал пишет /dev/medio0). v4l2-ctl работает с /dev/video0 и /dev/video1, выполняя set_fmt/reqbuf/qbuf/dqbuf/stream_on/stream_off. Здесь он захватывает кадры и задаёт exposure/gain/VTS. Сначала изучите справку, особенно streaming и vidcap. Краткая справка:

<!-- en PDF p.15; unit 88 -->

```text
# v4l2-ctl --help
```

<!-- en PDF p.15; unit 89 -->

Полная подробная справка:

<!-- en PDF p.15; unit 90 -->

```text
# v4l2-ctl --help-all
```

<!-- en PDF p.15; unit 91 -->

Параметры streaming:

<!-- en PDF p.16; unit 92 -->

```text
# v4l2-ctl --help-streaming
```

<!-- en PDF p.16; unit 93 -->

Параметры vidcap, главным образом get-fmt/set-fmt:

<!-- en PDF p.16; unit 94 -->

```text
# v4l2-ctl --help-vidcap
```

<!-- en PDF p.16; unit 95 -->

#### 3.3.1 Захват кадров v4l2-ctl

<!-- en PDF p.16; unit 96 -->

Пример 1: один кадр NV12 640x480 от RKCIF в /tmp/nv12.bin, первые три кадра отбрасываются: они возвращаются userspace, но не сохраняются.

<!-- en PDF p.16; unit 97 -->

```text
# v4l2-ctl -d /dev/video0 \
  --set-fmt-video=width=640,height=480,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-skip=3 \
  --stream-to=/tmp/nv12.bin \
  --stream-count=1 \
  --stream-poll
```

<!-- en PDF p.16; unit 98 -->

Пример 2: десять кадров NV12 1920x1080 от RKISP в /tmp/nv12.bin.

<!-- en PDF p.16; unit 99 -->

```text
# v4l2-ctl -d /dev/video1 \
  --set-selection=target=crop,top=0,left=0,width=1920,height=1080
  --set-fmt-video=width=1920,height=1080,pixelformat=NV12 \
  --stream-mmap=3 \
  --stream-to=/tmp/nv12.bin \
  --stream-count=10 \
  --stream-poll
```

<!-- en PDF p.16; unit 100 -->

Параметры: -d выбирает /dev/video0. --set-selection задаёт crop, не больше выхода предыдущей стадии RKISP1; для RKCIF используется --set-crop. --set-fmt-video задаёт ширину/высоту и FourCC pixelformat, здесь NV12. --stream-mmap выбирает выделенный ядром физически непрерывный либо отображённый IOMMU буфер. --stream-skip пропускает первые три кадра без записи. --stream-to задаёт файл. --stream-count — число сохраняемых кадров без пропущенных. --stream-poll использует асинхронный IO/select перед dqbuf, чтобы тот не блокировался; без опции dqbuf ждёт кадр.

<!-- en PDF p.17; unit 101 -->

#### 3.3.2 Экспозиция, усиление и другие controls

<!-- en PDF p.17; unit 102 -->

Если драйвер реализует controls, v4l2-ctl задаёт exposure/gain до захвата. RKCIF/RKISP наследуют controls подустройства, поэтому сенсор виден через /dev/video3. Пример OV5695 на RK3326 с exposure/gain/blanking/test_pattern:

<!-- en PDF p.17; unit 103 -->

```text
# v4l2-ctl -d /dev/video1 -l

User Controls

    exposure 0x00980911 (int) : min=4 max=2228 step=1 default=1104 value=1104
      gain 0x00980913 (int) : min=0 max=16383 step=1 default=1024 value=1024

Image Source Controls

vertical_blanking 0x009e0901 (int) : min=1152 max=31687 step=1 default=1152 value=1152
  analogue_gain 0x009e0903 (int) : min=16 max=248 step=1 default=248 value=248

Image Processing Controls

   test_pattern 0x009f0903 (menu): min=0 max=4 default=0 value=0
```

<!-- en PDF p.17; unit 104 -->

Изменение exposure и analogue_gain через v4l2-ctl:

<!-- en PDF p.17; unit 105 -->

```text
# v4l2-ctl -d /dev/video3 --set-ctrl'exposure=1216,analogue_gain=10'
```

<!-- en PDF p.17; unit 106 -->

#### 3.3.3 Захват RAW

<!-- en PDF p.17; unit 107 -->

MP RKISP1 захватывает RAW в ISP bypass без настройки изображения. Пример OV5695: SBGGR10_1X10, 2592x1944.

<!-- en PDF p.17; unit 108 -->

```text
# media-ctl -d /dev/media0 \
  --set-v4l2 '"ov5695 7-0036":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]'
# v4l2-ctl -d /dev/video4 \
  --set-ctrl 'exposure=1216,analogue_gain=10' \
```

<!-- en PDF p.18; unit 109 -->

```text
--set-selection=target=crop,top=0,left=0,width=2592,height=1944 \
--set-fmt-video=width=2592,height=1944,pixelformat=BG10 \
--stream-mmap=3 \
--stream-to=/tmp/mp.raw.out \
--stream-count=1 \
--stream-poll
```

<!-- en PDF p.18; unit 110 -->

Строка 4 media-ctl согласует fmt isp-subdev с сенсором. Строки 3/5 задают crop равным сенсору, без обрезки. В строке 6 можно поднять expo/gain для тёмного кадра, если драйвер реализует controls. Строки 7/8 отключают crop через selection и выбирают FourCC BG10. Хотя ISP не обрабатывает RAW, 10/12-битные пиксели дополняются младшими нулями до 16 бит. Для просмотра в Ubuntu добавьте к RAW трёхстрочный заголовок PGM. Пример:

<!-- en PDF p.18; unit 111 -->

```text
# cat > /tmp/raw.pgm << EOF
P5
2592 1944
65535
EOF

# cat /tmp/mp.raw.out >> /tmp/raw.pgm
```

<!-- en PDF p.18; unit 112 -->

Строка 2 — постоянный идентификатор P5; строка 3 — ширина/высота через пробел; строка 4 — глубина, 65535 для 16 бит или 255 для 8. Строка 7 добавляет RAW после заголовка. Заголовок содержит ровно три строки, без лишних пустых.

<!-- en PDF p.18; unit 113 -->

#### 3.3.4 Форматы FourCC

<!-- en PDF p.18; unit 114 -->

Four Character Codes кодирует имя формата четырьмя символами, 32 бит. Макрос Linux:

<!-- en PDF p.18; unit 115 -->

```text
#define v4l2_fourcc(a,b,c,d) \
  (((__u32)(a)<<0)|((__u32)(b)<<8)|((__u32)(c)<<16)|((__u32)(d)<<24))
```

<!-- en PDF p.19; unit 116 -->

FourCC описывает хранение изображения/видео в памяти, в отличие от mbus-code. Используемые форматы ниже; полный список в videodev2.h.

<!-- en PDF p.19; unit 117 -->

| Макрос ядра | FourCC |
| --- | --- |
| V4L2_PIX_FMT_NV12 | NV12 |
| V4L2_PIX_FMT_NV21 | NV21 |
| V4L2_PIX_FMT_NV16 | NV16 |
| V4L2_PIX_FMT_NV61 | NV61 |
| V4L2_PIX_FMT_NV12M | NM12 |
| V4L2_PIX_FMT_YUYV | YUYV |
| V4L2_PIX_FMT_YUV420 | YU12 |
| V4L2_PIX_FMT_SBGGR10 | BG10 |
| V4L2_PIX_FMT_SGBRG10 | GB10 |
| V4L2_PIX_FMT_SGRBG10 | BA10 |
| V4L2_PIX_FMT_SRGGB10 | RG10 |
| V4L2_PIX_FMT_GREY | GREY |

<!-- en PDF p.19; unit 118 -->

### 3.4 Просмотр YUV в Ubuntu через mplayer

<!-- en PDF p.19; unit 119 -->

Сохранённые предыдущими командами кадры можно просматривать mplayer. Установка через apt:

<!-- en PDF p.19; unit 120 -->

```text
# sudo apt-get install mplayer
```

<!-- en PDF p.19; unit 121 -->

NV12 640x480:

<!-- en PDF p.19; unit 122 -->

```text
# W=640; H=480; mplayer /tmp/nv12.bin -loop 0 -demuxer rawvideo -fps 30 \
  -rawvideo w=${W}:h=${H}:size=$((${W}*${H}*3/2)):format=NV12
```

<!-- en PDF p.19; unit 123 -->

YUYV 640x480:

<!-- en PDF p.19; unit 124 -->

```text
# W=640; H=480; mplayer /tmp/yuyv.bin -loop 0 -demuxer rawvideo -fps 30 \
  -rawvideo w=${W}:h=${H}:size=$((${W}*${H}*2)):format=YUY2
```

<!-- en PDF p.19; unit 125 -->

W/H — переменные ширины/высоты для последующего использования.

<!-- en PDF p.20; unit 126 -->

fps задаёт скорость: 1 означает один кадр в секунду. size — размер кадра, format — формат; mplayer -rawvideo format=help перечисляет варианты. Под Windows используйте, например, 7yuv.

<!-- en PDF p.20; unit 127 -->

### 3.5 GStreamer

<!-- en PDF p.20; unit 128 -->

В SDK GStreamer обеспечивает предпросмотр и кодирование. v4l2src получает кадры с видеоустройства; rkisp_3A_server по умолчанию запускает настройку правильной яркости/цвета.

<!-- en PDF p.20; unit 129 -->

#### 3.5.1 Отображение GStreamer

<!-- en PDF p.20; unit 130 -->

Следующая команда показывает камеру на экране:

<!-- en PDF p.20; unit 131 -->

```text
# export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/lib/gstreamer-1.0
# export XDG_RUNTIME_DIR=/tmp/.xdg
# gst-launch-1.0 v4l2src device=/dev/video1 ! \
  video/x-raw,format=NV12,width=2592,height=1944,framerate=30/1 ! kmssink
```

<!-- en PDF p.20; unit 132 -->

#### 3.5.2 Кодирование видео и изображений

<!-- en PDF p.20; unit 133 -->

SDK поддерживает аппаратное кодирование; команды кодируют поток в файл:

<!-- en PDF p.20; unit 134 -->

```text
# gst-launch-1.0 v4l2src device=/dev/video1 num-buffers=100 ! \
  video/x-raw,format=NV12,width=1920,height=1088,framerate=30/1 ! \
  videoconvert ! mpph264enc ! h264parse ! mp4mux ! \
  filesink location=/tmp/h264.mp4
```

<!-- en PDF p.20; unit 135 -->

```text
# gst-launch-1.0 -v v4l2src device=/dev/video1 num-buffers=10 ! \
  video/x-raw,format=NV12,width=1920,height=1080 ! mppjpegenc ! \
  multifilesink location=/tmp/test%05d.jpg
```

<!-- en PDF p.20; unit 136 -->

mppjpegenc/mpph264enc — аппаратные кодировщики плагина rockchipmpp. MPP требует высоту, кратную 16; нужен патч fea937b015e7 media: rockchip: isp1/cif: set height alignment to 16 in queue_setup.

<!-- en PDF p.21; unit 137 -->

### 3.6 Отладка без экрана

<!-- en PDF p.21; unit 138 -->

librkuvc.so позволяет плате выступать UVC-камерой, подключённой USB OTG к ПК. Код примера приведён в разделе разработки приложений.

<!-- en PDF p.21; unit 139 -->

### 3.7 Включение отладочного вывода

<!-- en PDF p.21; unit 140 -->

RKISP1/RKCIF содержат v4l2_dbg(); включение:

<!-- en PDF p.21; unit 141 -->

```text
# echo 1 > /sys/module/video_rkcif/parameters/debug
```

<!-- en PDF p.21; unit 142 -->

Или:

<!-- en PDF p.21; unit 143 -->

```text
# echo 1 > /sys/module/video_rkisp1/parameters/debug
```

<!-- en PDF p.21; unit 144 -->

У VB2/V4L2 также есть переключатели. Журнал VB2:

<!-- en PDF p.21; unit 145 -->

```text
# echo 7 > /sys/module/videobuf2_core/parameters/debug
```

<!-- en PDF p.21; unit 146 -->

VB2 показывает оборот буферов reqbuf/qbuf/dqbuf и изменение состояния. Переключатель общий: включится вывод всех пользователей VB2, включая VPU/ISP. Далее включается весь V4L2-журнал, например ioctl:

<!-- en PDF p.21; unit 147 -->

```text
# echo 0x1f > /sys/class/video4linux/video0/dev_debug
```

<!-- en PDF p.21; unit 148 -->

Можно включить только часть сообщений. Биты определены макросами include/media/v4l2-ioctl.h; задайте нужный бит:

<!-- en PDF p.21; unit 149 -->

```text
/* Just log the ioctl name + error code */
#define V4L2_DEV_DEBUG_IOCTL     0x01
/* Log the ioctl name arguments + error code */
#define V4L2_DEV_DEBUG_IOCTL_ARG   0x02
/* Log the file operations open, release, mmap and get_unmapped_area */
#define V4L2_DEV_DEBUG_FOP      0x04
/* Log the read and write file operations and the VIDIOC_(D)QBUF ioctls */
#define V4L2_DEV_DEBUG_STREAMING   0x08
/* Log poll() */
#define V4L2_DEV_DEBUG_POLL      0x10
```

<!-- en PDF p.22; unit 150 -->

## 4. Интеграция 3A

<!-- en PDF p.22; unit 151 -->

Раздел только для RKISP1; RKCIF не имеет ISP и не требует 3A. Раньше приложение связывалось с librkisp.so либо использовало rkisp/rkv4l2src GStreamer. Это усложняло разработку и плохо подходило VLC/Chrome. Начиная с RKISP1 v0.1.5 и camera_engine_rkisp v2.2.0 rkisp_3A_server автоматически выполняет 3A. Приложение занимается лишь потоком и не требует librkisp.so; стандартные v4l2src/VLC получают корректное изображение.

<!-- en PDF p.22; unit 152 -->

### 4.1 rkisp_3A_server

<!-- en PDF p.22; unit 153 -->

Состоит из драйвера RKISP1, camera_engine_rkisp и скриптов запуска. В соответствующем SDK интеграция по умолчанию включает: RKISP1 v0.1.5+ (версия в kernel/drivers/media/platform/rockchip/isp1/version.h); camera_engine_rkisp v2.2.0+ в external/camera_engine_rkisp; скрипты сборки/автозапуска в buildroot/package/rockchip/camera_engine_rkisp. Результаты сборки:

<!-- en PDF p.22; unit 154 -->

```text
/usr/bin/rkisp_3A_server
/usr/lib/librkisp.so
/usr/lib/librkisp_api.so
/usr/lib/rkisp/
      ├── ae
      │ └── librkisp_aec.so
      ├── af
      │ └── librkisp_af.so
      └── awb
        └── librkisp_awb.so
/etc/iqfiles/
/etc/init.d/S40rkisp_3A
```

<!-- en PDF p.22; unit 155 -->

Примечания:

<!-- en PDF p.23; unit 156 -->

rkisp_3A_server — программа мониторинга и запуска 3A по необходимости. librkisp.so реализует основные API и вызывает закрытые библиотеки aec/af/awb. iqfiles хранит IQ XML сенсоров. S40rkisp_3A запускает сервер при загрузке. В Debian Rockchip логика аналогична, отличается способ запуска.

<!-- en PDF p.23; unit 157 -->

### 4.2 Журнал rkisp_3A_server

<!-- en PDF p.23; unit 158 -->

Задайте переменную среды; пример AEC:

<!-- en PDF p.23; unit 159 -->

```text
# export persist_camera_engine_log=0x40
```

<!-- en PDF p.23; unit 160 -->

Добавьте строку в /etc/init.d/S40rkisp_3A; журнал идёт в /var/log/messages. При ротации появляются messages.0/messages.1; при сборе захватывайте все файлы:

<!-- en PDF p.23; unit 161 -->

```text
# tar zcvf /tmp/camera-log.tar.gz /var/log/messages*
```

<!-- en PDF p.23; unit 162 -->

Выбор модуля журнала:

<!-- en PDF p.23; unit 163 -->

```text
bits: 31-28 27-24 23-20 19-16 15-12 11-8 7-4 3-0
module: [u]  [u]  [xcore] [ISP] [AF] [AWB] [AEC] [NO]
   *[u] means unused now.
each module log has following ascending levels:
   0: error
   1: warning
   2: info
   3: verbose
   4: debug
   5: low1
   6-7: unused, now the same as debug
```

<!-- en PDF p.23; unit 164 -->

При ручном запуске rkisp_3A_server с журналом перенаправляйте вывод в файл: его слишком много для медленного последовательного порта или стандартного вывода shell.

<!-- en PDF p.23; unit 165 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x40
# /usr/bin/rkisp_3A_server --mmedia=/dev/media0 > /tmp/log 2>&1
```

<!-- en PDF p.23; unit 166 -->

Сначала остановите сервис, задайте окружение, затем запустите сервер вручную с перенаправлением в /tmp/log.

<!-- en PDF p.24; unit 167 -->

![Техническая схема оригинала · EN PDF p.24](/docs/rockchip-linux44-camera/assets/en-p024-vector-01.png)

### 4.3 Ускорение загрузки XML

<!-- en PDF p.24; unit 168 -->

Для быстрого старта изображения доступно ускорение XML. Включите опцию:

<!-- en PDF p.24; unit 169 -->

```text
# make menuconfig

│ │ --- Rockchip BSP packages                    │ │
│ │ [*] Rockchip Camera Engine for linux               │ │
│ │ [*] Rockchip Camera Engine 3A service run in booting       │ │
│ │   Specify a directory to store xml speed up bin (disabled) ---> │ │
│ │ ()  Rockchip Camera Engine IQ xml file             │ │
```

<!-- en PDF p.24; unit 170 -->

Выберите Specify a directory to store xml speed up bin с учётом возможности записи rootfs.

<!-- en PDF p.24; unit 171 -->

```text
│ │       (X) disabled             │ │
│ │       ( ) /etc/iqfiles-db          │ │
│ │       ( ) /userdata/iqfiles-db        │ │
```

<!-- en PDF p.24; unit 172 -->

При read-only rootfs выбирайте /userdata/iqfiles-db. Каталог двоичного кэша XML должен находиться на доступной для записи ФС.

<!-- en PDF p.24; unit 173 -->

### 4.4 Последовательность rkisp_3A_server

<!-- en PDF p.24; unit 174 -->

Диаграмма последовательности:

<!-- en PDF p.24; unit 175 -->

Участники: userspace_app, kernel_rkisp1_driver, rkisp_3A_server, 3A_Tunning_Thread. Приложение начинает захват.

<!-- en PDF p.24; unit 176 -->

Последовательность: захват → RAW требует 3A → запуск потока настройки → успешный запуск → сообщение/тайм-аут возобновляет захват; непрерывные изображения и настройка; конец захвата → готовность к выходу → выход потока → настройка завершена → сообщение/тайм-аут завершает захват.

<!-- en PDF p.24; unit 177 -->

Подготовка к завершению; завершение потока настройки; настройка завершена; после сообщения потока или тайм-аута завершается захват.

<!-- en PDF p.24; unit 178 -->

Участники: userspace_app, kernel_rkisp1_driver, rkisp_3A_server, 3A_Tunning_Thread.

<!-- en PDF p.25; unit 179 -->

## 5. Разработка приложений

<!-- en PDF p.25; unit 180 -->

Кроме v4l2-ctl/GStreamer/VLC можно написать V4L2-приложение для захвата и обработки. Связавшись с librkisp.so, оно получает ручное управление экспозицией/gain, веса экспозиции и точечный замер, статистику средней яркости областей/гистограмму всего кадра, управление максимальным fps/gain. При таком подходе сначала остановите rkisp_3A_server: инициализация и запуск 3A выполняются самим приложением.

<!-- en PDF p.25; unit 181 -->

```text
# /etc/init.d/S40rkisp_3A stop
```

<!-- en PDF p.25; unit 182 -->

Либо непосредственно удалите S40rkisp_3A.

<!-- en PDF p.25; unit 183 -->

```text
# rm /etc/init.d/S40rkisp_3A
```

<!-- en PDF p.25; unit 184 -->

### 5.1 Интерфейс librkisp_api.so

<!-- en PDF p.25; unit 185 -->

camera_engine_rkisp предоставляет rkisp_api в librkisp_api.so для прямого вызова или как пример. Основные API объявлены в rkisp_api.h. Пример 1: открытие и захват 1920x1080.

<!-- en PDF p.25; unit 186 -->

```text
int test_capture_mmap_quick()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  int count = 10;

  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  rkisp_set_fmt(ctx, 1920, 1080, ctx->fcc);

  if (rkisp_start_capture(ctx))
   return -1;

  do {
   buf = rkisp_get_frame(ctx, 0);
```

<!-- en PDF p.26; unit 187 -->

```text
   /* Deal with the buffer */

   rkisp_put_frame(ctx, buf);
  } while (count--);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

<!-- en PDF p.26; unit 188 -->

В этом примере 3A всё ещё выполняет rkisp_3A_server. Для доступа к дополнительной статистике измените параметр открытия:

<!-- en PDF p.26; unit 189 -->

```text
ctx = rkisp_open_device("/dev/video1", 1);
```

<!-- en PDF p.26; unit 190 -->

Полученный buf содержит дополнительную статистику. Пример 2: изменить выход OV5695 на 1920x1080.

<!-- en PDF p.26; unit 191 -->

```text
const struct rkisp_api_ctx *ctx;

ctx = rkisp_open_device("/dev/video1", 0);
if (ctx == NULL)
  return -1;
rkisp_set_sensor_fmt(ctx, 1920, 1080, MEDIA_BUS_FMT_SBGGR10_1X10);
```

<!-- en PDF p.26; unit 192 -->

### 5.2 Общая память DMA Buffer

<!-- en PDF p.26; unit 193 -->

Общий буфер сокращает копирование между Camera/RGA/DRM/MPP. По умолчанию rkisp_api выделяет память ядра через mmap и может экспортировать её как DMA Buffer другим модулям. Также принимает их буферы и заполняет кадром сразу целевой буфер, избегая копии. Пример 1: экспорт MMAP-буфера.

<!-- en PDF p.26; unit 194 -->

```text
const struct rkisp_api_ctx *ctx;
const struct rkisp_api_buf *buf;

ctx = rkisp_open_device("/dev/video1", 0);
if (ctx == NULL || rkisp_start_capture(ctx))
  return -1;

rkisp_get_frame(ctx, 0);
printf("size: %d, dmabuf fd: %d\n", buf->size, buf->fd);
```

<!-- en PDF p.27; unit 195 -->

buf-&gt;fd — дескриптор DMA Buffer для других модулей. Пока они используют данные, нельзя вызывать rkisp_put_frame(); после использования обязательно вызовите его. Пример 2: заполнение буфера другого модуля напрямую данными камеры.

<!-- en PDF p.27; unit 196 -->

```text
int test_capture_ext_dmabuf()
{
  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  for (i = 0, ret = 0; i < buf_count; i++) {
   if (drmGetBuffer(dev.drm_fd, width, height, FORMAT, &buf[i]))
     goto out;
   dmabuf_fd[i] = buf[i].dmabuf_fd;
  }
  rkisp_set_fmt(ctx, width, height, ctx->fcc);
  rkisp_set_buf(ctx, buf_count, dmabuf_fd, buf[0].size);

  if (rkisp_start_capture(ctx))
   goto out;

  buf = rkisp_get_frame(ctx, 0);
  printf("The ext buf fd is: %d\n", buf->fd);
  rkisp_put_frame(ctx, buf);

  rkisp_stop_capture(ctx);

out:
  while (--i >= 0)
   drmPutBuffer(dev.drm_fd, &buf[i]);

  rkisp_close_device(ctx);
}
```

<!-- en PDF p.27; unit 197 -->

rkisp_set_buf() передаёт камере DMA Buffer, выделенный DRM. Здесь показан API rkisp; подробности drmGetBuffer()/drmPutBuffer() опущены в оригинале.

<!-- en PDF p.27; unit 198 -->

### 5.3 Веса экспозиции областей

<!-- en PDF p.27; unit 199 -->

Глобальная экспозиция иногда не оптимальна. Увеличение веса важной области повышает её яркость, но другие области могут стать пересвеченными или тёмными. Пример: распознавание лица против света без HDR — после обнаружения лица увеличьте вес этой области.

<!-- en PDF p.28; unit 200 -->

Другой пример — робот-пылесос распознаёт предметы на полу. Нижняя часть важнее, а отражения создают разницу яркости сверху/снизу; увеличьте вес нижней части. Вызов API:

<!-- en PDF p.28; unit 201 -->

```text
unsigned char weights[] = {
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
  1, 1, 5, 9, 15, 31, 15, 5, 1,
};
rkisp_set_expo_weights(ctx, weights, 81);
```

<!-- en PDF p.28; unit 202 -->

Массив 9×9 задаёт веса 81 области; диапазон каждого элемента [1, 31], большее значение означает больший вес.

<!-- en PDF p.28; unit 203 -->

### 5.4 UVC-камера через librkuvc.so

<!-- en PDF p.28; unit 204 -->

SDK включает librkuvc.so, исходники external/uvc_app. Полученные кадры сжимаются и передаются ПК. Пример:

<!-- en PDF p.28; unit 205 -->

```text
#include "uvc_control.h"
#include "uvc_video.h"

int test_uvc_mmap()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  uint32_t flags = 0;
  int extra_cnt = 0;

  ctx = rkisp_open_device("/dev/video1", 0);

  if (ctx == NULL)
   return -1;

  if (rkisp_set_fmt(ctx, 640, 480, V4L2_PIX_FMT_NV12))
   return -1;

  if (rkisp_start_capture(ctx))
   return -1;
```

<!-- en PDF p.29; unit 206 -->

```text
  flags = UVC_CONTROL_LOOP_ONCE;
  uvc_control_run(flags);

  do {
   buf = rkisp_get_frame(ctx, 0);
   extra_cnt++;
   uvc_read_camera_buffer(buf->buf, buf->fd, buf->size, &extra_cnt, sizeof(extra_cnt));

   rkisp_put_frame(ctx, buf);
  } while (1);

  uvc_control_join(flags);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

<!-- en PDF p.29; unit 207 -->

Память выделяет драйвер камеры; DMA Buffer передаётся UVC-кодированию.

<!-- en PDF p.29; unit 208 -->

```text
# GCC=buildroot/output/rockchip_rk3326_64/host/bin/aarch64-buildroot-linux-gnu-gcc
# SYSROOT=buildroot/output/rockchip_rk3326_64/staging
# ENGINE=external/camera_engine_rkisp
# $GCC --sysroot=$SYSROOT camera_uvc.c \
   -L$ENGINE/build/lib/ -lrkisp -lrkisp_api \
   -L $SYSROOT/usr/lib/ -lrkuvc \
   -I $SYSROOT/usr/include/uvc/ \
   -I./ \
   -o camera_uvc
```

<!-- en PDF p.29; unit 209 -->

Соберите camera_uvc, скопируйте в /usr/bin и запустите на плате:

<!-- en PDF p.29; unit 210 -->

```text
# /usr/bin/uvc_MJPEG.sh
# /usr/bin/camera_uvc
```

<!-- en PDF p.29; unit 211 -->

uvc_MJPEG.sh достаточно инициализировать один раз после загрузки. Поддерживаются 640x480, 1280x720, 1920x1080, 2560x1440; актуальный список в /usr/bin/uvc_MJPEG.sh. MPP требует высоту буфера, кратную 16, иначе возможен выход за границы памяти.

<!-- en PDF p.30; unit 212 -->

## 6. Драйвер RKISP1

<!-- en PDF p.30; unit 213 -->

Код в drivers/media/platform/rockchip/isp1. На основе V4L2/Media Framework он настраивает оборудование, обрабатывает прерывания, управляет буферами и питанием подустройств MIPI DPHY/сенсоров. Файлы:

<!-- en PDF p.30; unit 214 -->

```text
# tree drivers/media/platform/rockchip/isp1/
drivers/media/platform/rockchip/isp1/
├── capture.c  #Contains the configuration of mp/sp and vb2, frame interrupt processing
├── dev.c   #Include probe, sensor registration, clock, pipeline, iommu
├── isp_params.c #3A Related parameter settings
├── isp_stats.c #3A related statistics
├── regs.c   #register related read and write operations
├── rkisp1.c  #corresponding to rkisp-isp-sd entity, including receiving data from mipi/dvp and crop
function
```

<!-- en PDF p.30; unit 215 -->

MIPI DPHY в drivers/phy/rockchip/phy-rockchip-mipi-rx.c также является V4L2 subdevice. Ниже связи от сенсора до выходов ISP.

<!-- en PDF p.31; unit 216 -->

![Техническая схема оригинала · EN PDF p.31](/docs/rockchip-linux44-camera/assets/en-p031-vector-01.png)

Приложение userspace.

<!-- en PDF p.31; unit 217 -->

MP: видеоустройство Main Path; SP: видеоустройство Self Path; у каждого интерфейс памяти.

<!-- en PDF p.31; unit 218 -->

Масштабирование MpOutResize / SpOutResize.

<!-- en PDF p.31; unit 219 -->

Входное кадрирование Main Path / Self Path.

<!-- en PDF p.31; unit 220 -->

Isp Sub Device и выходное кадрирование ISP Out Crop.

<!-- en PDF p.31; unit 221 -->

Входное кадрирование ISP In Crop.

<!-- en PDF p.31; unit 222 -->

Входы DVP Sensor и MIPI DPHY.

<!-- en PDF p.31; unit 223 -->

MIPI Sensor A / MIPI Sensor B.

<!-- en PDF p.31; unit 224 -->

RKISP1 поддерживает DVP/MIPI, для MIPI нужен DPHY. Можно подключить несколько сенсоров, но активен только один. Одно входное изображение разделяется на MP/SP, обрабатывается каждым и может выводиться одновременно. MP выдаёт полное разрешение до 4416x3312, YUV или RAW; только MP поддерживает RAW.

<!-- en PDF p.32; unit 225 -->

SP ограничен 1920x1080, выдаёт YUV/RGB, не RAW. Crop/resize MP и SP независимы. Сравнение:

<!-- en PDF p.32; unit 226 -->

| Устройство вывода | Макс. разрешение | Форматы | Кадрирование/масштаб |
| --- | --- | --- | --- |
| SP | 1920x1080 | YUV, RGB | Поддерживается |
| MP | 4416x3312 | YUV, RAW | Поддерживается |

<!-- en PDF p.32; unit 227 -->

rkisp1-input-params и rkisp1-statistics предназначены для 3A. rkisp1_rawpath/rkisp1_dmapath используются в специальных случаях, обычно не нужны приложению.

<!-- en PDF p.32; unit 228 -->

### 6.1 Конфигурация RKISP1 в DTS платы

<!-- en PDF p.32; unit 229 -->

SDK уже определяет узлы для поддерживаемых SoC: rkisp1 в rk3288-rkisp1.dtsi, rkisp1_0/rkisp1_1 в rk3399.dtsi. Таблица:

<!-- en PDF p.32; unit 230 -->

| Чип | Узел DTS | MIPI DPHY | IOMMU |
| --- | --- | --- | --- |
| RK3399 | rkisp1_0 | mipi_dphy_rx0 | isp0_mmu |
| RK3399 | rkisp1_1 | mipi_dphy_tx1rx1 | isp1_mmu |
| RK3288 | rkisp1 | mipi_phy_rx0 or mipi_phy_tx1rx1 | isp_mmu |
| PX30/RK3326 | rkisp1 | mipi_dphy_rx0 | isp_mmu |
| RK1808 | rkisp1 | mipi_dphy_rx | isp_mmu |

<!-- en PDF p.32; unit 231 -->

RK3399 имеет два ISP с отдельными DPHY/MMU. RK3288 имеет один ISP, DPHY можно выбрать rx0 либо tx1rx1. На плате включите нужные узлы и свяжите remote-endpoint. Пример arch/arm64/boot/dts/rockchip/rk3326-evb-lp3-v10-linux.dts: sensor, mipi_dphy_rx0, rkisp1, isp_mmu. Для MIPI параметры data-lane сенсора и mipi_dphy_rx0 должны быть одинаковыми и правильными.

<!-- en PDF p.33; unit 232 -->

## 7. Драйвер RKCIF

<!-- en PDF p.33; unit 233 -->

TODO — раздел не заполнен в оригинале.

## Различия кода оригиналов

Основной текст соответствует языку оригинала; RU/DE переведены с EN. Ниже сохранены отличающиеся фрагменты другого оригинала, включая комментарии/разметку. Это независимые примеры, не единый исполняемый сценарий; параметры источника не подменены.

**CN PDF p.6 · 13**

```text
static int __ov5695_power_on(struct ov5695 *ov5695)
{
  int ret;
  u32 delay_us;
  struct device *dev = &ov5695->client->dev;

  ret = clk_set_rate(ov5695->xvclk, OV5695_XVCLK_FREQ);

  if (clk_get_rate(ov5695->xvclk) != OV5695_XVCLK_FREQ)
   dev_warn(dev, "xvclk mismatched, modes are based on 24MHz\n");
  ret = clk_prepare_enable(ov5695->xvclk);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 1);

  ret = regulator_bulk_enable(OV5695_NUM_SUPPLIES, ov5695->supplies);

  if (!IS_ERR(ov5695->reset_gpio))
   gpiod_set_value_cansleep(ov5695->reset_gpio, 0);

  if (!IS_ERR(ov5695->pwdn_gpio))
   gpiod_set_value_cansleep(ov5695->pwdn_gpio, 1);

  /* 8192 cycles prior to first SCCB transaction */
  delay_us = ov5695_cal_delay(8192);
  usleep_range(delay_us, delay_us * 2);

  return 0;
}
```

**CN PDF p.8 · 28**

```text
ov5695: ov5695@36 {
  compatible = "ovti,ov5695";
  reg = <0x36>;

  clocks = <&cru SCLK_CIF_OUT>;
  clock-names = "xvclk";

  avdd-supply = <&vcc2v8_dvp>;
  dovdd-supply = <&vcc1v8_dvp>;
  dvdd-supply = <&vdd1v5_dvp>;

  /*reset-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;*/
  pwdn-gpios = <&gpio2 14 GPIO_ACTIVE_HIGH>;

  rockchip,camera-module-index = <0>;
  rockchip,camera-module-facing = "back";
  rockchip,camera-module-name = "TongJu";
  rockchip,camera-module-lens-name = "CHT842-MD";

  port {
   ucam_out: endpoint {
     remote-endpoint = <&mipi_in_ucam>;
```

**CN PDF p.9 · 29**

```text
     data-lanes = <1 2>;
   };
  };
};
```

**CN PDF p.10 · 45**

```text
# grep -rn LIBV4L_UTILS -- buildroot/configs/rockchip/camera.config
BR2_PACKAGE_LIBV4L_UTILS=y
```

**CN PDF p.11 · 56**

```text
[root@rk3326_64:/]# media-ctl -p -d /dev/media1
- entity 9: irs16x5c 1-003d (1 pad, 1 link)
     type V4L2 subdev subtype Sensor flags 0
     device node name /dev/v4l-subdev2
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [ENABLED,DYNAMIC]

- entity 10: irs16x5c 2-003d (1 pad, 1 link)
      type V4L2 subdev subtype Sensor flags 0
      device node name /dev/v4l-subdev3
   pad0: Source
       [fmt:SBGGR12_1X12/224x1557@10000/300000 field:none]
       -> "rockchip-mipi-dphy-rx":0 [DYNAMIC]
```

**CN PDF p.16 · 103**

```text
# v4l2-ctl -d /dev/video3 --set-ctrl 'exposure=1216,analogue_gain=10'
```

**CN PDF p.16 · 106**

```text
# media-ctl -d /dev/media0 \
  --set-v4l2 '"ov5695 7-0036":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[fmt:SBGGR10_1X10/2592x1944]'
# media-ctl -d /dev/media0 \
  --set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/2592x1944]'
# v4l2-ctl -d /dev/video4 \
  --set-ctrl 'exposure=1216,analogue_gain=10' \
  --set-selection=target=crop,top=0,left=0,width=2592,height=1944 \
  --set-fmt-video=width=2592,height=1944,pixelformat=BG10 \
  --stream-mmap=3 \
  --stream-to=/tmp/mp.raw.out \
  --stream-count=1 \
  --stream-poll
```

**CN PDF p.24 · 182**

```text
int test_capture_mmap_quick()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
  int count = 10;

  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  rkisp_set_fmt(ctx, 1920, 1080, ctx->fcc);

  if (rkisp_start_capture(ctx))
   return -1;

  do {
   buf = rkisp_get_frame(ctx, 0);

   /* Deal with the buffer */

   rkisp_put_frame(ctx, buf);
  } while (count--);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

**CN PDF p.25 · 191**

```text
int test_capture_ext_dmabuf()
{
  ctx = rkisp_open_device("/dev/video1", 0);
  if (ctx == NULL)
   return -1;

  for (i = 0, ret = 0; i < buf_count; i++) {
   if (drmGetBuffer(dev.drm_fd, width, height, FORMAT, &buf[i]))
     goto out;
   dmabuf_fd[i] = buf[i].dmabuf_fd;
  }
  rkisp_set_fmt(ctx, width, height, ctx->fcc);
  rkisp_set_buf(ctx, buf_count, dmabuf_fd, buf[0].size);

  if (rkisp_start_capture(ctx))
   goto out;

  buf = rkisp_get_frame(ctx, 0);
  printf("The ext buf fd is: %d\n", buf->fd);
  rkisp_put_frame(ctx, buf);

  rkisp_stop_capture(ctx);

out:
  while (--i >= 0)
   drmPutBuffer(dev.drm_fd, &buf[i]);
```

**CN PDF p.26 · 192**

```text
  rkisp_close_device(ctx);
}
```

**CN PDF p.26 · 200**

```text
#include "uvc_control.h"
#include "uvc_video.h"

int test_uvc_mmap()
{
  const struct rkisp_api_ctx *ctx;
  const struct rkisp_api_buf *buf;
```

**CN PDF p.27 · 201**

```text
  uint32_t flags = 0;
  int extra_cnt = 0;

  ctx = rkisp_open_device("/dev/video1", 0);

  if (ctx == NULL)
   return -1;

  if (rkisp_set_fmt(ctx, 640, 480, V4L2_PIX_FMT_NV12))
   return -1;

  if (rkisp_start_capture(ctx))
   return -1;

  flags = UVC_CONTROL_LOOP_ONCE;
  uvc_control_run(flags);

  do {
   buf = rkisp_get_frame(ctx, 0);
   extra_cnt++;
   uvc_read_camera_buffer(buf->buf, buf->fd, buf->size, &extra_cnt, sizeof(extra_cnt));

   rkisp_put_frame(ctx, buf);
  } while (1);

  uvc_control_join(flags);

  rkisp_stop_capture(ctx);
  rkisp_close_device(ctx);

  return 0;
}
```

**CN PDF p.28 · 210**

```text
# tree drivers/media/platform/rockchip/isp1/
drivers/media/platform/rockchip/isp1/
├── capture.c  #包含 mp/sp 的配置及 vb2,帧中断处理
├── dev.c   #包含 probe、Sensor注册、clock、pipeline、iommu
├── isp_params.c #3A 相关参数设置
├── isp_stats.c #3A 相关统计
├── regs.c   #寄存器相关的读写操作
├── rkisp1.c  #对应 rkisp-isp-sd entity，包含从mipi/dvp接收数据及crop功能
```

{% endraw %}
