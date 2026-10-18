---
title: "Руководство Rockchip HDMI RX: захват RK3588, TIF/Camera, HDCP и диагностика"
description: "Настройка HDMI RX RK3588, памяти, аудио, EDID, HDCP, CEC и TIF/Camera; диагностика сигнала и перезагрузок с полными командами, журналами и патчами."
translation_key: "070-rockchip-hdmi-rx"
slug: "070-rockchip-hdmi-rx"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "HDMI IN", "HDMI RX", "Android", "Linux"]
keywords: "ArmSoM Rockchip HDMI IN RK3588 HDMI RX HDCP"
excerpt: "Настройка HDMI RX RK3588, памяти, аудио, EDID, HDCP, CEC и TIF/Camera; диагностика сигнала и перезагрузок с полными командами, журналами и патчами."
---

{% raw %}

# Руководство Rockchip HDMI RX: захват RK3588, TIF/Camera, HDCP и диагностика

Это справочный материал Rockchip, а не руководство, испытанное на оборудовании ArmSoM. Примеры, журналы, задержки и заявленная поддержка относятся к оригиналу. Перед адаптацией проверьте SoC, вывод HDMI-входа на плате, мост и разводку, тактирование и питание, SDK/BSP, ядро и Android HAL. Поддержка всех плат не подразумевается. Предоставлен только китайский PDF; английская и русская версии полностью переводят технический текст и используют китайские исходные рисунки. Надписи внутри изображений не выдаются за английские. Код и исходные комментарии сохранены. Команды прошивки, регистров, прав доступа и SELinux не выполнялись.

Техническая версия оригинала: V1.1.7. Встроенный HDMI RX RK3588 охватывает 4K60/4K30/1080P60/720P60, подключение, запись, EDID, HDCP 1.4/2.3 и CEC. У RK3588S этого блока нет. Примеры HDMI-to-MIPI RK3576 не означают наличие встроенного HDMI RX.

| Платформа | Ядро | Android |
| --- | --- | --- |
| RK3588 (RK3588S не поддерживает HDMI RX) | Linux 5.10 | 12.0 |

[Редакционные замечания](/docs/rockchip-hdmi-rx/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Обзор HDMI IN

### 1.1 Возможности HDMI RX

HDMI 1.4b/2.0 RX: до 4K@60fps

Поддерживаемые форматы: RGB888/YUV420/YUV422/YUV444, 8 бит

Пиксельная частота: до 600MHz

HDCP1.4/2.3

Аппаратный блок CEC

Настройка E-EDID

S/PDIF: 2-канальный выход

I2S: 2/4/6/8-канальный выход

Примечание: RK3588S не содержит модуля HDMI RX.

### 1.2 Структурная схема HDMI IN

![Архитектура HDMI RX — китайский PDF, стр. 5](/docs/rockchip-hdmi-rx/assets/cn-p5-1.png)

Архитектура HDMI RX — китайский PDF, стр. 5

В зависимости от приложения HDMI RX можно интегрировать с TIF или Camera. TIF обеспечивает меньшую задержку передачи изображения; Camera предоставляет стандартные Camera API, упрощая запись и интеграцию с последующими алгоритмами обработки.

## 2. Код драйвера HDMI RX и настройка DTS

### 2.1 Требования к версии SDK

Поддержка HDMI IN может продолжать обновляться. Исходник рекомендует обновить SDK до последнего подходящего выпуска. Проверка версии SDK:

```text
rk3588_s:/ # getprop | grep rksdk
[ro.rksdk.version]: [ANDROID12_RKR9]
```

### 2.2 Код драйвера и конфигурация ядра

Код драйвера:

```text
drivers/media/platform/rockchip/hdmirx/
```

Конфигурация ядра:

```text
CONFIG_VIDEO_ROCKCHIP_HDMIRX=y
```

### 2.3 Настройка DTS

См. конфигурацию DTS RK3588 EVB1 в SDK:

```text
arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
```

#### 2.3.1 Контроллер HDMI RX

```text
/* Should work with at least 128MB cma reserved above. */
&hdmirx_ctrler {
   status = "okay";


   /* Effective level used to trigger HPD: 0-low, 1-high */
   hpd-trigger-level = <1>;
   hdmirx-det-gpios = <&gpio2 RK_PB5 GPIO_ACTIVE_LOW>;
   pinctrl-names = "default";
   pinctrl-0 = <&hdmim1_rx &hdmirx_det>;
};

hdmi {
   hdmirx_det: hdmirx-det {
      rockchip,pins = <2 RK_PB5 RK_FUNC_GPIO &pcfg_pull_up>;
   };

};
```

Настройки платы должны соответствовать фактическим соединениям схемы:

hpd-trigger-level: активный уровень управления HPD. `<1>` означает одинаковый уровень на управляющем выводе RK3588 и HPD порта HDMI; `<0>` — противоположные уровни.

![Схема управления HPD — китайский PDF, стр. 7](/docs/rockchip-hdmi-rx/assets/cn-p7-1.png)

Схема управления HPD — китайский PDF, стр. 7

hdmirx-det-gpios: вывод обнаружения подключения HDMI. Задайте GPIO и активный уровень согласно аппаратной схеме. При активном низком уровне включите внутреннюю подтяжку вверх через pinctrl.

![Схема обнаружения HDMI — китайский PDF, стр. 7](/docs/rockchip-hdmi-rx/assets/cn-p7-2.png)

Схема обнаружения HDMI — китайский PDF, стр. 7

#### 2.3.2 Резервирование памяти

HDMI RX RK3588 может использовать только физически непрерывную память. Зарезервируйте не менее 128 МБ CMA; для увеличения измените размер зарезервированной памяти в DTS:

Примечание: расчёт предполагает 3840x2160, RGB888 и четыре буфера в цикле.

```text
/* If hdmirx node is disabled, delete the reserved-memory node here. */
reserved-memory {
   #address-cells = <2>;

   #size-cells = <2>;
   ranges;

   /* Reserve 128MB memory for hdmirx-controller@fdee0000 */
   cma {
      compatible = "shared-dma-pool";
      reusable;
      /* Start address: 256 * 0x100000, Length: 128 * 0x100000 */
      reg = <0x0 (256 * 0x100000) 0x0 (128 * 0x100000)>;
      linux,cma-default;
   };
};
```

#### 2.3.3 Настройка аудио

Добавьте настройку звуковой карты в DTS:

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index 4aa6a8ce9364..84c9c51d3b7f 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -47,6 +47,26 @@ play-pause-key {
           };
      };
+     hdmiin_dc: hdmiin-dc {
+          compatible = "rockchip,dummy-codec";
+          #sound-dai-cells = <0>;
+     };
+
+     hdmiin-sound {
+          compatible = "simple-audio-card";

+          simple-audio-card,format = "i2s";
+          simple-audio-card,name = "rockchip,hdmiin";
+          simple-audio-card,bitclock-master = <&dailink0_master>;
+          simple-audio-card,frame-master = <&dailink0_master>;
+          status = "okay";
+          simple-audio-card,cpu {
+                sound-dai = <&i2s7_8ch>;
+          };
+          dailink0_master: simple-audio-card,codec {
+                sound-dai = <&hdmiin_dc>;
+          };
+     };
+

      pcie20_avdd0v85: pcie20-avdd0v85 {
           compatible = "regulator-fixed";
           regulator-name = "pcie20_avdd0v85";
@@ -460,6 +480,10 @@ &i2s6_8ch {
      status = "okay";
 };
+&i2s7_8ch {
+     status = "okay";
+};
+
```

Укажите информацию о звуковой карте HDMIIN в HAL:

```text
diff --git a/tinyalsa_hal/audio_hw.c b/tinyalsa_hal/audio_hw.c
index ea97bee..509d140 100644

--- a/tinyalsa_hal/audio_hw.c
+++ b/tinyalsa_hal/audio_hw.c
@@ -362,6 +362,7 @@ struct dev_proc_info HDMI_IN_NAME[] =
 {
   {"realtekrt5651co", "tc358749x-audio"},
+  {"rockchiphdmiin", NULL},
   {NULL, NULL}, /* Note! Must end with NULL, else will cause crash */
 };
```

SDK по умолчанию, описанный в исходнике, уже содержит эти настройки. При изменении имени звуковой карты добавьте соответствующую информацию в массив HDMI_IN_NAME в HAL.

#### 2.3.4 Настройка HDCP

RK3588 имеет два контроллера HDCP2.3: hdcp0 и hdcp1. Исходник утверждает, что у каждого три порта, и приводит следующее распределение:

hdcp0: DPTX0 и DPTX1

hdcp1: HDMIRX, HDMITX0 и HDMITX1

Если HDMIRX требуется HDCP2.3, включите hdcp1.

Поддержка только HDCP1.4:

```text
&hdmirx_ctrler {
   status = "okay";

   hdcp1x-enable;
};
```

HDCP2.3 включается следующим образом. При его включении по умолчанию также обеспечивается совместимость с HDCP1.4:

```text
&hdcp1 {
   status = "okay";
};


&hdmirx_ctrler {
   status = "okay";
   hdcp2x-enable;
};
```

#### 2.3.5 Настройка CEC

```text
&hdmirx_ctrler {
   status = "okay";
   cec-enable;

};
```

### 2.4 Настройка EDID

RK3588 поддерживает настраиваемый EDID. EDID описанного драйвера включает следующие разрешения:

```text
3840x2160P60、3840x2160P50、3840x2160P30、3840x2160P25、3840x2160P24、
1920x1080P60、1920x1080P50、1920x1080P30、1920x1080i60、1920x1080i50、
1600x900P60、1440x900P60、1280x800P60、

1280x720P60、1280x720P50、1024x768P60、
720x576P50、720x480P60、720x576i50、720x480i60、
800x600P60、640x480P60
```

Поддерживаемые входные форматы:

```text
RGB888、YUV420、YUV422、YUV444
```

Исходник предоставляет две группы EDID, выбираемые приложениями верхнего уровня:

edid_init_data_340M: разрешения с пиксельной частотой ниже 340M, преимущественно разрешения HDMI1.4, включая 4K60 YUV420.

edid_init_data_600M: разрешения с пиксельной частотой 594M, поддержка 4K60 YUV422/YUV444/RGB888.

Для специальной настройки EDID измените соответствующий массив непосредственно в драйвере:

drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c

```text
static u8 edid_init_data_340M[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x49, 0x70, 0x88, 0x35, 0x01, 0x00, 0x00, 0x00,

   0x2D, 0x1F, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   ...
};

static u8 edid_init_data_600M[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x49, 0x70, 0x88, 0x35, 0x01, 0x00, 0x00, 0x00,
   0x2D, 0x1F, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   ...
};
```

Другой способ — динамическая настройка EDID через интерфейс ioctl узла video:

```text
static const struct v4l2_ioctl_ops hdmirx_v4l2_ioctl_ops = {
   ...

   .vidioc_g_edid = hdmirx_get_edid,
   .vidioc_s_edid = hdmirx_set_edid,
   ...
};
```

EDID можно изменить в редакторе EDID, затем заменить соответствующие данные в драйвере. Исходник предлагает отдельно получить графический редактор EDID.

## 3. Архитектура видео HDMI IN

### 3.1 Последовательность работы видео HDMI IN

![Открытие и закрытие APK — китайский PDF, стр. 12](/docs/rockchip-hdmi-rx/assets/cn-p12-1.png)

Открытие и закрытие APK — китайский PDF, стр. 12

### 3.2 Основная архитектура драйвера HDMI RX

Особое внимание следует уделить следующим прерываниям и обработчикам delayed_work:

hdmirx_5v_det_irq_handler: прерывание обнаружения 5 В от GPIO HDMIIRX_DET_L для определения подключения и отключения HDMI.

hdmirx_hdmi_irq_handler: прерывание контроллера HDMI RX, используемое главным образом при инициализации/настройке и отслеживании изменений HDMI-сигнала.

hdmirx_dma_irq_handler: прерывание DMA HDMI RX, главным образом для смены буферов при предварительном просмотре.

hdmirx_delayed_work_hotplug: delayed_work прерывания обнаружения 5 В; настраивает HDMI RX при горячем подключении/отключении.

hdmirx_delayed_work_res_change: перенастраивает контроллер и ожидает синхронизации сигнала при прерывании изменения сигнала HDMI RX.

Обработка изменения разрешения:

![Смена разрешения — китайский PDF, стр. 13](/docs/rockchip-hdmi-rx/assets/cn-p13-1.png)

Смена разрешения — китайский PDF, стр. 13

Обработка горячего подключения:

![Обработка подключения — китайский PDF, стр. 14](/docs/rockchip-hdmi-rx/assets/cn-p14-1.png)

Обработка подключения — китайский PDF, стр. 14

### 3.3 Циклическая смена буферов изображения

![Ротация буферов изображения — китайский PDF, стр. 15](/docs/rockchip-hdmi-rx/assets/cn-p15-1.png)

Ротация буферов изображения — китайский PDF, стр. 15

QBuf / DQBuf: пользователь передаёт свободные буферы через QBuf и получает заполненные изображением буферы через DQBuf.

Line flag irq: прерывание формируется после заданного числа строк, указанного в исходнике как width/2, то есть половина кадра. Обработчик обновляет буфер. Физический адрес буфера, записанный в HDMI RX, вступает в силу не сразу, а на следующем vsync. Из-за короткого vblank обновление может опоздать, и следующий кадр перезапишет предыдущий, поэтому буфер обновляют заранее. Формулировка width/2 сохранена для проверки.

DMA idle irq: прерывание простоя DMA соответствует окончанию кадра. Оно возникает после передачи кадра; буфер добавляется в vb_done list и ожидает получения через DQBuf.

Stream on: запуск потока; сначала используется curr_buf.

Stream off: после запроса остановки драйвер ожидает прерывания, останавливает поток и возвращает все буферы.

### 3.4 Задержка передачи изображения

Исходник сообщает задержку примерно 20–30 мс при TIF и ускоренном выводе. Это не измерение ArmSoM.

Исходник сообщает задержку отображения примерно 100–120 мс при Camera. Это не измерение ArmSoM.

## 4. HDCP для HDMI IN

Ключи HDCP1.4 и HDCP2.3 необходимо отдельно приобрести через официальный канал лицензирования HDCP; согласно исходнику, RK3588 не содержит встроенных ключей HDCP.

### 4.1 HDCP1.4

#### 4.1.1 Настройка DTS

См. раздел настройки HDCP; задайте hdcp1x-enable;.

#### 4.1.2 Запись ключей

Средство разделения и преобразования ключей находится в SDK:

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z 工具包下面有 KeyConvertor key 的拆
分和转换工具，更新到   KeyConvertor-V2.0.5 可以拆分成一个bin文件只有一个key.
```

Средство записи ключей находится в SDK:

```text
RKTools/windows/Rockchip_HdcpKey_Writer_V1.0.1.7z
```

Сначала извлеките нужные ключи из исходного файла с помощью средства разделения/преобразования, затем преобразуйте их в файл .skf для записи.

Если используется не средство записи Rockchip, разделите ключи по одному на файл. В поле числа ключей на файл задайте 1 и выполните извлечение; преобразование в .skf не требуется.

![Преобразование ключей HDCP — китайский PDF, стр. 16](/docs/rockchip-hdmi-rx/assets/cn-p16-1.png)

Преобразование ключей HDCP — китайский PDF, стр. 16

Переведите устройство в Loader. В средстве записи выберите hdcp1.4Hdmirx и RK3588. RK3588 добавляет AES-шифрование ключей HDCP1.4, поэтому Do AES необязателен: без него используется только SEED, с ним поверх SEED применяется AES. Исходник описывает это как более безопасный вариант. Импортируйте .skf и нажмите Write для записи ключа.

Примечание: после записи одного ключа средство автоматически переходит к следующему.

![Настройка записи HDCP 1.4 — китайский PDF, стр. 17](/docs/rockchip-hdmi-rx/assets/cn-p17-1.png)

Настройка записи HDCP 1.4 — китайский PDF, стр. 17

Структура ключа HDCP1.4:

```text
一个HDCP 1.4 KEY有308 Bytes，分别如下：
8 Bytes KSV: 5 Bytes KSV + 3 Bytes 0x0组成;
280 Bytes DPK;

20 Bytes SHA.
```

#### 4.1.3 Проверка состояния HDCP1.4

```text
cat /sys/class/misc/hdmirx_hdcp/status


HDCP Disable: hdcp1.4 没使能
HDCP1.4: Authenticated start: 认证过程中
HDCP1.4: Authenticated success: 认证成功
HDCP1.4: Authenticated failed: 认证失败
HDCP1.4: Unknown status: 未知状态
```

### 4.2 HDCP2.3

В описанной процедуре средство упаковки прошивки HDCP2.3 предоставляется отдельно. Сначала получите пакет инструментов HDCP2.3 через Redmine.

#### 4.2.1 Настройка DTS

См. раздел настройки HDCP; задайте hdcp2x-enable;.

#### 4.2.2 Упаковка прошивки и запуск службы

Распакуйте WC_HDCP2_BASE_ESM_Firmware в Linux. Скопируйте hdcp_receivers.bin в его корневой каталог и tools/. Если также требуется HDMITX, скопируйте hdcp_transmitter.bin в те же каталоги.

```text
DWC_HDCP2_BASE_ESM_Firmware$
cp ../hdcp_receivers.bin .

cp ../hdcp_receivers.bin tools/
```

Выполните build_rockchip_fw.sh для упаковки прошивки и ключей RX:

```text
DWC_HDCP2_BASE_ESM_Firmware$ ./build_rockchip_fw.sh
```

Во время упаковки запрашиваются следующие данные:

(1) Выберите тип прошивки: 1 -build firmware for both HDMIRX and HDMITX. Здесь исходник называет создаваемый файл ./firmware/hdpc2_hdmi.fw, а далее — hdcp2_hdmi.fw. Проверьте расхождение имён.

```text
1 -build firmware for both HDMIRX and HDMITX
2 -build firmware for HDMITX only
3 -build firmware for DP

Choose the fw type: 1
```

(2) Задайте число создаваемых ключей RX, например 10 или 100. Отдельные ключи сохраняются как fw_hdcp_receivers_*.bin в ./rxkeys/hdcpkeys?-?/. При использовании собственного средства записи эти .bin можно записывать непосредственно.

```text
Create Rx Key Number:
10
......

Create 10 keys to tools/rxkeys/hdcpkeys1-10/
```

(3) Для средства записи Rockchip упакуйте ключи в .skf в ./rxkeys/hdcpkeys?-?/. Если оно не используется, ответьте n.

```text
Do want to pack these keys to .skf file? [y/n]:
y


10 file packed to ./rxkeys/hdcpkeys1-10/hdcprxkeys1-10.skf
```

Запись ключей HDCP2.3 RX:

(1) Поместите hdcp2_hdmi.fw в device/rockchip/rk3588/. При сборке он копируется в vendor/firmware/hdcp2_hdmi.fw.

(2) В RKDevInfoTool.exe выберите HDCP2X_HDMIRX и импортируйте созданный hdcprxkeys1-10.skf. Записывайте в режиме Loader. После каждого ключа средство автоматически переходит к следующему и ожидает.

(3) В этой процедуре ключам HDCP2.3 не требуется AES-шифрование. Выберите только RK3588 и hdcp2x hdmirx.

![Настройка записи HDCP 2.3 — китайский PDF, стр. 19](/docs/rockchip-hdmi-rx/assets/cn-p19-1.png)

Настройка записи HDCP 2.3 — китайский PDF, стр. 19

Служба hdcp2_rx_tx

Служба запускается автоматически при загрузке. При ошибках аутентификации проверьте журнал командой `logcat | grep HDCP2`.

#### 4.2.3 Проверка состояния HDCP2.3

```text
cat /sys/class/misc/hdmirx_hdcp/status

HDCP Disable: HDCP没使能

HDCP2.3: Authenticated success: 认证成功
HDCP2.3: Authenticated failed: 认证失败
HDCP2.3: No dectypted: 源端没有开启HDCP2.x
```

### 4.3 Запись ключей HDCP

(1) Используйте средства записи Rockchip из RKTools/windows/ в SDK.

(2) Можно разработать приложение записи ключей с использованием libhdcp.so Rockchip. Приложение вызывает интерфейсы библиотеки для шифрования ключей и записи в vendor storage. В описанный SDK по умолчанию библиотека не входит; её следует запросить через Redmine.

libhdcp.so предоставляет следующие интерфейсы:

```text
enum HDCP_KEY_ID {
   HDCP1X_KEY_HDMITX_RK33 = 0,
   HDCP1X_KEY_HDMITX_RK3588,

   HDCP1X_KEY_HDMIRX_RK3588,
   HDCP1X_KEY_HDMIRX_RK628,
   HDCP1X_KEY_DP_RK3588,
   HDCP2X_KEY_HDMIRX_RK3588,
};
/*
 * Encrypt the key, but is not written to vendor

 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 * keyout: The encrypted key
 * keyout_size: HDCP1.x 314, HDCP2.x 1000
 */
int hdcp_key_process(enum HDCP_KEY_ID id, uint8_t *keyin, int keyin_size, uint8_t
*keyout, int keyout_size);

/*
 * Encrypt key and write it to vendor

 *
 * id: HDCP KEY type
 * keyin: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * keyin_size: HDCP1.x 308, HDCP2.x 1000
 */
int hdcp_key_process_and_write(enum HDCP_KEY_ID id, uint8_t *keyin, int
keyin_size);

/*
 * Write key to vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key

 * size: key size
 */
int hdcp_key_write(enum HDCP_KEY_ID id, uint8_t *key, int size);

/*
 * Read key from vendor
 *
 * id: HDCP KEY type
 * key: HDCP1.x 308 Byte raw Key, HDCP2.x 1000 Byte Key
 * len: key length
 */
int hdcp_key_read(enum HDCP_KEY_ID id, uint8_t *key, int *len);
```

## 5. CEC для HDMI IN

Внесите следующие изменения в device/rockchip/common:

TX: ro.hdmi.device_type=4 (Playback; в исходнике написано Playerback).

RX: ro.hdmi.device_type=0 (TV).

```text
diff --git a/device.mk b/device.mk
index d600bf1..a5e9ae3 100644
--- a/device.mk
+++ b/device.mk
@@ -699,10 +699,10 @@ endif
 endif


 # hdmi cec
-ifneq ($(filter atv box, $(strip $(TARGET_BOARD_PLATFORM_PRODUCT))), )
+ifneq ($(filter atv box tablet, $(strip $(TARGET_BOARD_PLATFORM_PRODUCT))), )
 PRODUCT_COPY_FILES += \

frameworks/native/data/etc/android.hardware.hdmi.cec.xml:$(TARGET_COPY_OUT_VENDOR
)/etc/permissions/android.hardware.hdmi.cec.xml
-PRODUCT_PROPERTY_OVERRIDES += ro.hdmi.device_type=4
+PRODUCT_PROPERTY_OVERRIDES += ro.hdmi.device_type=0
 PRODUCT_PACKAGES += \
      hdmi_cec.$(TARGET_BOARD_PLATFORM)


+DEVICE_MANIFEST_FILE +=
device/rockchip/common/manifests/android.hardware.tv.cec@1.0-service.xml
 # HDMI CEC HAL
 PRODUCT_PACKAGES += \
diff --git a/manifests/android.hardware.tv.cec@1.0-service.xml
b/manifests/android.hardware.tv.cec@1.0-service.xml
new file mode 100644
index 00000000..5afa59d7
--- /dev/null
+++ b/manifests/android.hardware.tv.cec@1.0-service.xml
@@ -0,0 +1,11 @@
+<manifest version="1.0" type="device">

+  <hal format="hidl">
+     <name>android.hardware.tv.cec</name>
+     <transport>hwbinder</transport>
+     <version>1.0</version>
+     <interface>
+        <name>IHdmiCec</name>
+        <instance>default</instance>
+     </interface>
+  </hal>
+</manifest>
```

## 6. Адаптация APK HDMI IN

### 6.1 Пути исходного кода APK

packages/apps/TV/partner_support/samples: служба данных TV-источника, взаимодействующая с HAL и APK просмотра через framework. Это скрытая служба, запускаемая при загрузке; значок в лаунчере отсутствует.

packages/apps/rkCamera2: APK просмотра, взаимодействующий со службой TV-источника через framework. Его имя в лаунчере — HdmiIn. Разработчики изделий обычно заменяют его собственным APK просмотра.

hardware/rockchip/tv_input: код HAL для обмена командами с драйвером при запуске/остановке потока, горячем подключении и смене разрешения.

В описанном исходнике SDK HDMI IN по умолчанию отключён. Задайте следующее свойство для включения и сборки соответствующих модулей, включая указанные APK:

```text
vim device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
```

Включение BOARD_HDMI_IN_SUPPORT по умолчанию задаёт vendor.hwc.enable_sideband_stream_2_mode. В исходнике значение напечатано как l (строчная латинская L); проверьте требуемое значение по конфигурации сборки. После загрузки проверьте установку командой getprop.

### 6.2 APK просмотра HdmiIn

MainActivity использует просмотр TIF на основе части Android TV Input Framework и поддерживает тракты HDMI-to-MIPI и HDMI RX. Собственный APK просмотра должен использовать стандартный элемент TvView. Настройка драйвера HDMI-to-MIPI описана в указанном исходником руководстве по мостам HDMIIN для Android 12+.

```text
String INPUT_ID =
"com.example.partnersupportsampletvinput/.SampleTvInputService/HW0";
Uri channelUri = TvContract.buildChannelUriForPassthroughInput(INPUT_ID);

//tvinput.hdmiin.type取值0为HDMI RX，1为HDMI TO MIPI。需在tune之前设置，不设置默认为HDMI
RX
//SystemProperties.set("tvinput.hdmiin.type", "1");
tvView.tune(INPUT_ID, channelUri);
```

Важно: изделия с HDMI-to-MIPI без HDMI RX, например RK3576 или RK3588 с отключённым HDMI RX в DTS, должны задавать tvinput.hdmiin.type. Иначе TIF показывает чёрный экран и не может отображать HDMI-to-MIPI. Пример для RK3576:

```text
device/rockchip/rk3576/device.mk
PRODUCT_PROPERTY_OVERRIDES += \

   tvinput.hdmiin.type=1
```

Для TIF включите vtunnel и vendor.hwc.enable_sideband_stream_2_mode. Следующий DTS включает vtunnel на стандартной RK3588 EVB1; для других изделий измените DTS соответственно.

```text
diff --git a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
index a10dad37f9cf..b3dd3a8bbb19 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588-evb1-lp4.dtsi
@@ -275,6 +275,10 @@ &dp1_in_vp2 {
      status = "okay";
 };

+&rkvtunnel {
+     status = "okay";
+};
+
 /*
 * mipi_dcphy0 needs to be enabled

 * when dsi0 is enabled
diff --git a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
index fa4a7e35099e..e3acf575aefd 100644

--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -8,6 +8,10 @@
 #include "rk3588-vccio3-pinctrl.dtsi"

 / {
+     rkvtunnel: rkvtunnel {
+           compatible = "rockchip,video-tunnel";
+           status = "disabled";
+     };
      aliases {
           dp0 = &dp0;

           dp1 = &dp1;
diff --git a/arch/arm64/configs/rockchip_defconfig
b/arch/arm64/configs/rockchip_defconfig
index c742a4cc4fe5..039173d51bbe 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -684,6 +684,7 @@ CONFIG_ROCKCHIP_MPP_IEP2=y
 CONFIG_ROCKCHIP_MPP_JPGDEC=y
 CONFIG_ROCKCHIP_MPP_AV1DEC=y
 CONFIG_ROCKCHIP_MPP_VDPP=y
+CONFIG_ROCKCHIP_VIDEO_TUNNEL=y
 CONFIG_SOUND=y
 CONFIG_SND=y

 CONFIG_SND_DYNAMIC_MINORS=y
```

Важно: TIF требует пять сменяемых буферов. Для 3840x2160 в BGR888, RGB888 или NV24 теоретический объём CMA составляет 3840 * 2160 * 3 * 5 = 121500KB ≈ 119M. Поскольку CMA может использоваться системой и возможна фрагментация, выделяйте больше, например 256M. Увеличение резерва описано в §2.3.2.

В следующем примере logcat сообщает cma: Out of memory, а просмотр выделенных CMA-буферов показывает менее пяти. Это означает недостаточный резерв CMA.

```text
rk3588_u:/ # cat /d/dma_buf/bufinfo | grep cma
24883200   00000002   00080007    00000002    cma  00000416

   cma
24883200   00000002   00080007    00000002    cma  00000415
   cma
24883200   00000002   00080007    00000002    cma  00000414
   cma
24883200   00000002   00080007    00000002    cma  00000413
   cma
rk3588_u:/ #

W tv_input_Sideband: dequeueBuffer 259 do allocateBuffer
I android.hardware.graphics.allocator-V1-service: alloc_format: FMT:0x113,MOD:0
I android.hardware.graphics.allocator-V1-service: mali_gralloc_adjust_dimensions:
alloc_format=FMT:0x113,MOD:0 usage=0x11000000a0000833 alloc_width=3840,

alloc_height=2160
D cma  : __cma_alloc(cma 00000000a43238b2, count 6075, align 8)
E cma  : __cma_alloc: cma: alloc failed, req-size: 6075 pages, ret: -12
I cma  : number of available pages:
1@543+1@575+4@588+2@598+2@606+2@638+2@1694+2@1726+2@1758+2@1766+2@1774+2@1782+2@1
790+2@1798+2@1806+2@1814+2@1822+2@1830+2@1838+2@1846+2@1854+2@1862+2@1870+2@1878+

2@1886+2@1894+2@1902+2@1910+2@1918+2@1926+2@1934+2@1942+2@1950+2@1958+2@1966+2@19
74+2@1982+2@1990+2@1998+2@2006+2@2014+2@2022+2@2030+2@2038+2@2046+2@2054+2@2062+2
@2070+2@2078+2@2086+2@2094+2@2102+2@2110+2@2118+2@2126+2@2134+2@2142+2@2150+2@215
8+2@2166+2@2174+2@2182+114@2190+69@8379+69@14523+69@20667+5957@26811=> 6402 free
of 32768 total pages
D cma  : __cma_alloc(): returned 0000000000000000
E DMABUFHEAPS: Unable to allocate from DMA-BUF heap: cma: Out of memory
E DMABUFHEAPS: No ion heap of name cma exists
E DMABUFHEAPS: No ion heap of name cma exists
E android.hardware.graphics.allocator-V1-service: libdmabufheap allocation failed
for cma heap
E android.hardware.graphics.allocator-V1-service: buffer allocation failed: Out

of memory
E android.hardware.graphics.allocator-V1-service: buffer allocation failed: Out
of memory
E GraphicBufferAllocator: Failed to allocate (3840 x 2160) layerCount 1 format 40
usage 11000000a0000833: 1
```

RockchipCamera2 использует Camera и поддерживает HDMI-to-MIPI и HDMI RX. По умолчанию нажатие значка запускает MainActivity. Для тракта Camera сначала включите поддержку камеры HDMI IN следующим свойством:

```text
vim device/rockchip/rk3588/BoardConfig.mk
CAMERA_SUPPORT_HDMI := true
```

Также установите persist.sys.hdmiinmode в 2. Тогда запуск HdmiIn открывает RockchipCamera2 для просмотра через Camera. Можно использовать и системное приложение камеры.

### 6.3 Сравнение просмотра TIF и Camera

|  | TIF | Camera |
| --- | --- | --- |
| Преимущества | Низкая задержка | Приложение получает данные предпросмотра для обработки |
| Недостатки | Нет поворота, разделения экрана, картинки в картинке и независимых дисплеев; приложение не получает буферы; снимки screencap не поддерживаются | Задержка выше TIF |

(1) TIF не поддерживает картинку в картинке. Для неё переключитесь на Camera. В примере MainActivity коснитесь экрана и выберите PIP в диалоге для перехода к Camera с картинкой в картинке. Тракт Camera должен быть заранее включён через CAMERA_SUPPORT_HDMI := true.

(2) TIF поддерживает запись и снимки через виртуальные дисплеи стандартного MediaProjectionManager Google. Также поддерживается screenrecord.

Для этих функций записи/снимков либо вывода на ПК через ADB задайте следующее свойство:

```text
vim device/rockchip/rk3588/device.mk
PRODUCT_PROPERTY_OVERRIDES += debug.sf.enable_hwc_vds=true
```

Если каталог изделия под device переопределён, задайте настройку в соответствующем каталоге. После загрузки выполните через ADB `getprop debug.sf.enable_hwc_vds` и проверьте значение true. (3) TIF не поддерживает снимки через ADB screencap, включая сочетания клавиш громкости и питания. Используйте виртуальный дисплей MediaProjectionManager из пункта (2).

## 7. Отладка драйвера

### 7.1 Получение средств отладки

Для отладки требуется v4l2-ctl. Описанный SDK автоматически включает его при сборке прошивки; каталог в SDK:

```text
hardware/rockchip/camera/etc/tools/
```

### 7.2 Примеры отладочных команд

При диагностике включите отладочный журнал, см. соответствующий раздел.

#### 7.2.1 Просмотр узлов video HDMIRX

```text
grep -H hdmirx /sys/class/video4linux/video*/name
```

#### 7.2.2 Поиск устройства rk_hdmirx

Выберите узел video параметром v4l2-ctl -d и выведите информацию через -D. Определите устройство rk_hdmirx по Driver name.

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 -D
Driver Info:

      Driver name : rk_hdmirx
      Card type   : rk_hdmirx
      Bus info    : fdee0000.hdmirx-controller
      Driver version : 5.10.66
      Capabilities : 0x84201000
           Video Capture Multiplanar
           Streaming
           Extended Pix Format
           Device Capabilities
      Device Caps : 0x04201000
           Video Capture Multiplanar
           Streaming
Extended Pix Format
```

#### 7.2.3 Получение сохранённых таймингов драйвера

Получите тайминги, сохранённые при синхронизации устройства с сигналом:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --get-dv-timings
DV timings:

      Active width: 3840
      Active height: 2160
      Total width: 4400
      Total height: 2250
      Frame format: progressive
      Polarities: -vsync -hsync
      Pixelclock: 594024000 Hz (60.00 frames per second)
      Horizontal frontporch: 172
      Horizontal sync: 92
      Horizontal backporch: 296
      Vertical frontporch: 8
      Vertical sync: 10
      Vertical backporch: 72

      Standards:
      Flags:
```

#### 7.2.4 Запрос таймингов в реальном времени

Считайте тайминги непосредственно из регистров HDMI RX:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --query-dv-timings
      Active width: 3840
      Active height: 2160

      Total width: 4400
      Total height: 2250
      Frame format: progressive
      Polarities: -vsync -hsync
      Pixelclock: 594024000 Hz (60.00 frames per second)
      Horizontal frontporch: 172
      Horizontal sync: 92
      Horizontal backporch: 296
      Vertical frontporch: 8
      Vertical sync: 10
      Vertical backporch: 72
      Standards:

      Flags:
```

При query-dv-timings и уровне debug 2 в dmesg выводятся подробные тайминги, формат пикселей, глубина цвета и частота TMDS, как в примере:

```text
[16750.029542][ T2247] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV422
[16750.029581][ T2247] fdee0000.hdmirx-controller: hdmirx_get_colordepth:

color_depth: 24, reg_val:4
[16750.029592][ T2247] fdee0000.hdmirx-controller: get timings from dma
[16750.029602][ T2247] fdee0000.hdmirx-controller: act:3840x2160,
total:4400x2250, fps:60, pixclk:594024000
[16750.029610][ T2247] fdee0000.hdmirx-controller: hfp:172, hs:92, hbp:296,
vfp:8, vs:10, vbp:72
[16750.029618][ T2247] fdee0000.hdmirx-controller: tmds_clk:594024000
[16750.029626][ T2247] fdee0000.hdmirx-controller: interlace:0, fmt:1, vic:127,
color:24, mode:hdmi
[16750.029633][ T2247] fdee0000.hdmirx-controller: deframer_st:0x11
[16750.029643][ T2247] fdee0000.hdmirx-controller: query_dv_timings:
3840x2160p60.00 (4400x2250)
```

#### 7.2.5 Запрос разрешения и формата изображения

Запросите текущее разрешение и формат изображения:

```text
rk3588_s:/ # v4l2-ctl -d /dev/video17 --get-fmt-video
Format Video Capture Multiplanar:

      Width/Height : 3840/2160
      Pixel Format : 'NV16'
      Field        : None
      Number of planes : 1
      Flags        : premultiplied-alpha, 000000fe
      Colorspace   : Unknown (1025fcdc)
      Transfer Function : Unknown (00000020)
      YCbCr Encoding : Unknown (000000ff)
      Quantization : Default
      Plane 0      :
        Bytes per Line : 3840
        Size Image : 16588800
```

#### 7.2.6 Запуск потока изображения

Запустите поток, указав правильные узел video, разрешение и pixelformat для фактической конфигурации:

```text
v4l2-ctl --verbose -d /dev/video17 \
--set-fmt-video=width=3840,height=2160,pixelformat='NV16' \
--stream-mmap=4
```

Соответствие форматов: RGB888 -&gt; 'RGB3', YUV422 -&gt; 'NV16', YUV420 -&gt; 'NV12', YUV444 -&gt; 'NV24'.

#### 7.2.7 Сохранение файла изображения

Сохраните изображение на устройстве, получите его на ПК через adb pull и просмотрите, например, в 7yuv или YUView:

```text
v4l2-ctl --verbose -d /dev/video17 \
--set-fmt-video=width=3840,height=2160,pixelformat='NV16' \
--stream-mmap=4 --stream-skip=3 \

--stream-to=/data/4k60_nv16.yuv \
--stream-count=5 --stream-poll
```

#### 7.2.8 Журнал нормального приёма потока

При нормальном приёме журнал показывает частоту кадров. Пример исходника:

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 3840/2160
      Pixel Format : 'NV16'
      Field        : None
      Number of planes : 1
      Flags        : premultiplied-alpha, 000000fe
      Colorspace   : Unknown (1025fcdc)
      Transfer Function : Unknown (00000020)
      YCbCr Encoding : Unknown (000000ff)
      Quantization : Default
      Plane 0      :
        Bytes per Line : 3840
        Size Image : 16588800

VIDIOC_REQBUFS: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_QUERYBUF: ok
VIDIOC_QBUF: ok
VIDIOC_STREAMON: ok
idx: 0 seq: 0 bytesused: 16588800 ts: 103.172405

idx: 1 seq: 1 bytesused: 16588800 ts: 103.189072 delta: 16.667 ms
idx: 2 seq: 2 bytesused: 16588800 ts: 103.205738 delta: 16.666 ms
idx: 3 seq: 3 bytesused: 16588800 ts: 103.222404 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 16588800 ts: 103.239070 delta: 16.666 ms fps: 60.00
idx: 1 seq: 5 bytesused: 16588800 ts: 103.255736 delta: 16.666 ms fps: 60.00
idx: 2 seq: 6 bytesused: 16588800 ts: 103.272402 delta: 16.666 ms fps: 60.00
```

## 8. Поиск неисправностей

### 8.1 Включение журналирования

Установите уровень debug драйвера HDMI RX от 0 до 3 следующей командой:

```text
echo 2 > /sys/module/rockchip_hdmirx/parameters/debug
dmesg -n 8
```

Для журнала с момента включения исходник рекомендует изменить код, пересобрать и прошить соответствующие компоненты ядра. Пример патча:

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index c763a9558169..bd7f3effb45a 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -34,7 +34,7 @@
 #include "rk_hdmirx_cec.h"

static struct class *hdmirx_class;
-static int debug;
+static int debug = 2;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index 1cc0c5ba16b3..e74f3a85f0b8 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -75,7 +75,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)
```

Примечание: обычно уровень debug 3 не рекомендуется из-за большого объёма вывода.

### 8.2 Чтение и запись регистров через io

Средство io позволяет обращаться к регистрам HDMI RX. Включите следующую настройку ядра:

```text
CONFIG_DEVMEM=y
```

Пример чтения регистра через io:

```text
// 通过以下命令可查看io使用帮忙：
io -h


rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000
```

### 8.3 Запрос состояния HDMI RX

Запросите текущее состояние HDMI RX: синхронизацию сигнала, формат изображения, тайминги и пиксельную частоту:

```text
rk3588_s:/ # cat /d/hdmirx/status
status: plugin

Clk-Ch:Lock Ch0:Lock   Ch1:Lock    Ch2:Lock
Ch0-Err:0  Ch1-Err:0   Ch2-Err:0
Color Format: YUV422         Store Format: YUV422 (8 bit)
Mode: 3840x2160p60 (4400x2250) hfp:172 hs:92 hbp:296 vfp:8 vs:10
vbp:72
Pixel Clk: 594024000
```

Запрос регистров контроллера HDMI RX:

```text
rk3588_s:/ # cat /d/hdmirx/ctrl

--------------------hdmirx ctrl--------------------

00000000: 48515258 30313130 6c753031 01000310
00000010: Reserved 31353138 30333039 32303231
00000020: WO...... 00211f01 198b7b25
00000040: WO...... 00001001 00000000
00000050: 00000001
...
---------------------------------------------------
```

Запрос регистров PHY HDMI RX:

```text
rk3588_s:/ # cat /d/hdmirx/phy

--------------------hdmirx phy---------------------

0000004f: 01000000
0000100f: 01000000
0000110f: 01000000
0000120f: 01000000
0000130f: 01000000
0000104a: 01002600
...
---------------------------------------------------
```

Запрос информации о слоях отображения:

```text
rk3588_s:/ # cat /d/dri/0/summary
Video Port0: DISABLED
Video Port1: DISABLED
Video Port2: DISABLED
Video Port3: ACTIVE
   Connector: DSI-1

      bus_format[100a]: RGB888_1X24
      overlay_mode[0] output_mode[0] color_space[0], eotf:0
   Display mode: 1080x1920p60
      clk[132000] real_clk[132000] type[48] flag[a]
      H: 1080 1095 1099 1129
      V: 1920 1935 1937 1952
   Esmart3-win0: ACTIVE //HDMI-IN预览图层
      win_id: 11
      format: RG24 little-endian (0x34324752) SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]

      zpos: 0
      src: pos[0, 0] rect[1920 x 1080]
      dst: pos[0, 0] rect[1080 x 1920]
      buf[0]: addr: 0x00000000f070a000 pitch: 5760 offset: 0
   Cluster3-win0: ACTIVE
      win_id: 6
      format: AB24 little-endian (0x34324241)[AFBC] SDR[0] color_space[0]
glb_alpha[0xff]
      rotate: xmirror: 0 ymirror: 0 rotate_90: 0 rotate_270: 0
      csc: y2r[0] r2y[0] csc mode[0]
      zpos: 1
      src: pos[0, 0] rect[1080 x 1920]
      dst: pos[0, 0] rect[1080 x 1920]

      buf[0]: addr: 0x00000000ef903000 pitch: 4352 offset: 0
```

### 8.4 HDMI IN не синхронизируется с сигналом

Пример журнала при отсутствии синхронизации HDMI IN:

```text
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0
```

Порядок диагностики:

Измерьте HDMIIRX_DET_L: уровень должен соответствовать схеме и меняться при подключении/отключении HDMI.

На разъёме HDMI проверьте, что HDMI_RX_HPD_PORT становится высоким при подключении и низким при отключении.

При подключённом HDMI осциллографом проверьте нормальный выход TMDS.

Проверьте по журналу обмен SCDC. Согласно исходнику, при пиксельной частоте выше 340M tmds_clk_ratio должен быть 1. Если источник выдаёт 4K60 с частотой 594M, а журнал показывает tmds_clk_ratio:0, обмен SCDC не удался. Проверьте HDMI DDC либо повторите отключение/подключение.

Проверка состояния регистров:

```text
console:/ # io -4 0xfdee0050
fdee0150: 00000001 // bit0：1表示HPD拉高，0表示HPD拉低


// 0x0594：bit[3:0]表示scdc_ch2locked、scdc_ch1locked、scdc_ch0locked、
scdc_clockdetected；
// 0x0598：bit[31]:scdc_err_det1_valid，bit[15]:scdc_err_det0_valid，低bit为误码数量
统计；
// 0x059c：bit[31]:scdc_erdet_lane0_valid，bit[15]:scdc_err_det2_valid，低bit为误码
数量统计；
console:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000 // 正常锁定时的值
```

Если устройство синхронизируется после горячего подключения лишь иногда, попробуйте увеличить время ожидания синхронизации и проверить, завершается ли она.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index 39e4e15a6e17..a612fe30bda4 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1264,7 +1264,7 @@ static int hdmirx_wait_lock_and_get_timing(struct
rk_hdmirx_dev *hdmirx_dev)
      u32 mu_status, scdc_status, dma_st10, cmu_st;
      struct v4l2_device *v4l2_dev = &hdmirx_dev->v4l2_dev;

-     for (i = 0; i < 300; i++) {
+     for (i = 0; i < 600; i++) {
           mu_status = hdmirx_readl(hdmirx_dev, MAINUNIT_STATUS);
           scdc_status = hdmirx_readl(hdmirx_dev, SCDC_REGBANK_STATUS3);
           dma_st10 = hdmirx_readl(hdmirx_dev, DMA_STATUS10);
@@ -1283,7 +1283,7 @@ static int hdmirx_wait_lock_and_get_timing(struct

rk_hdmirx_dev *hdmirx_dev)
           hdmirx_tmds_clk_ratio_config(hdmirx_dev);
      }

-     if (i == 300) {
+     if (i == 600) {
           v4l2_err(v4l2_dev, "%s signal not lock, tmds_clk_ratio:%d\n",
                       __func__, hdmirx_dev->tmds_clk_ratio);
           v4l2_err(v4l2_dev, "%s mu_st:%#x, scdc_st:%#x, dma_st10:%#x\n",
```

Если после смены разрешения устройство часто не синхронизируется, попробуйте добавить задержку перед повышением HPD и проверьте результат.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index 8183485a6e4c..27b900e90501 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -2768,6 +2768,7 @@ static void hdmirx_delayed_work_res_change(struct
work_struct *work)
           hdmirx_submodule_init(hdmirx_dev);
           hdmirx_update_bits(hdmirx_dev, SCDC_CONFIG, POWERPROVIDED,
                             POWERPROVIDED);
+          msleep(300);
           hdmirx_hpd_ctrl(hdmirx_dev, true);
           hdmirx_phy_config(hdmirx_dev);
           hdmirx_audio_setup(hdmirx_dev);
```

Некоторые генераторы или источники имеют низкое качество сигнала. HDMI RX обнаруживает много ошибок на отдельных каналах и не может синхронизироваться. Проверьте ошибки чтением регистров 0xfdee0594–0xfdee059c:

```text
rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 80008000 00008000 //正常数值


rk3588_s:/ # io -4 -l 0xc 0xfdee0594
fdee0594: 0000000f 804c8001 00008aff //检测到误码，分别对应ch1、ch0、ch2统计的误
码总数
```

Если ошибки одного канала препятствуют синхронизации, исходник предлагает отключение внутренней проверки ошибок драйвера для совместимости. Это диагностический обходной вариант, а не подтверждение соответствия сигнала спецификации.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c

index 606a08cd00505..6236196991c2a 100755
--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1416,11 +1416,7 @@ static void hdmirx_controller_init(struct rk_hdmirx_dev
*hdmirx_dev)
                   CED_GBCHECKEN_QST |
                   CED_CTRLCHECKEN_QST |
                   CED_CHLOCKMAXER_QST_MASK,
-                  CED_VIDDATACHECKEN_QST|
-                  // CED_DATAISCHECKEN_QST |
-                  CED_GBCHECKEN_QST |
-                  CED_CTRLCHECKEN_QST |

-                  CED_CHLOCKMAXER_QST(0x10));
+                  0);
 }

 static void hdmirx_format_change(struct rk_hdmirx_dev *hdmirx_dev)
```

### 8.5 Нет изображения или чёрный экран

Отсутствие изображения HDMI IN может быть вызвано драйвером либо верхними уровнями/приложением. Ниже приведён базовый порядок диагностики.

Проверки драйвера:

(1) Проверьте в журнале ядра синхронизацию и правильность разрешения. Если используется коммутатор, проверьте его синхронизацию и выход. См. пример журнала горячего подключения.

(2) Проверьте синхронизацию всех каналов и соответствие разрешения источнику: `cat /d/hdmirx/status`.

(3) Проверьте запуск потока по журналу или регистрам. Исходник указывает bit1 значения `io -4 0xfdee4414` как признак нормального запуска; точное условие бита проверьте по драйверу.

(4) Установите уровень журнала 3 и проверьте данные кадров; запись выводится каждые полкадра.

Проверки верхнего уровня:

(1) Выполните date и зафиксируйте примерное время проблемы.

(2) Проверьте слои командой `cat /d/dri/0/summary`.

(3) Выполните `dumpsys SurfaceFlinger`.

(4) Сохраните вывод logcat.

(5) После подтверждения потока и наличия слоя на шаге (2) сохраните изображение следующей командой:

```text
android12：
rm -rf data/system/dumpimage

mkdir data/system/dumpimage
chmod 777 data/system/dumpimage
setprop vendor.hdmiin.debug.dump 1
setprop vendor.hdmiin.debug.dumpnum 5
1s后立⻢
setprop vendor.hdmiin.debug.dumpnum 0
2s后立⻢
setprop vendor.hdmiin.debug.dump 0

android13：
rm -rf data/system/dumpimage
mkdir data/system/dumpimage
chmod 777 data/system/dumpimage

setprop vendor.tvinput.debug.dump 1
setprop vendor.tvinput.debug.dumpnum 10
半s后立⻢
setprop vendor.tvinput.debug.dumpnum 0
等个2s后
setprop vendor.tvinput.debug.dump 0
```

Проверьте файлы в data/system/dumpimage, упакуйте каталог и предоставьте архив для диагностики. Если файлов нет, причиной может быть SELinux. Исходник предлагает setenforce 0 и повтор команды; такую проверку permissive следует выполнять только в контролируемой отладочной среде, а не использовать как рабочую настройку безопасности.

(6) Сохраните состояние сбоя, не выполняйте лишних действий и предоставьте собранные сведения. Если невозможно быстро связаться с поддержкой или долго сохранять состояние устройства, следующая аварийная команда собирает данные за 10 секунд. Выполняйте её только после сохранения предыдущих данных, особенно logcat: она выполняет logcat -c и удаляет прежний журнал. Исходник рекомендует избегать этого шага без необходимости и сначала связаться с поддержкой.

```text
setprop vendor.tvinput.debug.level 3
logcat -c
logcat

抓10s
setprop vendor.tvinput.debug.level 0
```

Особый случай: поток и сохранённые изображения нормальны, но экран чёрный. Возможно активен AVMUTE. Проверьте следующими командами:

(1) Проверьте бит состояния AVMUTE:

```text
io -4 0xfdee4458 //bit25 avmute statue
io -4 0xfdee1030 //bit 0 GCP Set_AVMUTE bit4 GCP Clear_AVMUTE
```

(2) Измените цвет AVMUTE для проверки; по умолчанию он чёрный:

```text
io -4 0xfdee0430 0xff00 //设置RGB格式avmute为红色,yuv格式为其他颜色，若变色说明是
avmute导致。
```

Некоторые веб-страницы или реклама используют шифрование HDCP. Если на приёмнике HDCP не включён, возможен AVMUTE.

### 8.6 Нестабильный сигнал и потеря синхронизации

Некоторые источники могут периодически давать чёрные вспышки при просмотре, либо журнал показывает постоянные попытки синхронизации/определения разрешения и сбой запуска потока. Исходник отмечает это у генераторов, ТВ-приставок и DVD-проигрывателей. Возможные причины приведены ниже; см. пример журнала потери синхронизации.

Источник использует HDCP, а приёмник не включает HDCP, что препятствует синхронизации.

К типичным источникам с HDCP относятся компьютеры Apple, DVD-проигрыватели и ТВ-приставки.

Некачественные или слишком длинные кабели и неплотные разъёмы могут привести к несоответствию HDMI-сигнала на SoC спецификации.

Замените кабель и проверьте стабильность, чтобы определить, связана ли ошибка только с отдельными кабелями.

Слишком высокая сила драйвера или амплитуда swing предшествующего коммутатора может вызвать отражения на дорожках платы.

Согласованно с изготовителем коммутатора подберите силу драйвера, swing и терминирование.

Чрезмерно чувствительные настройки прерываний могут вызывать отключение и повтор при обнаружении изменения сигнала.

Закройте просмотр, определите по журналу срабатывающее прерывание и проверьте влияние его отключения. Исходник рекомендует совместную отладку через Redmine.

Выход источника может быть нестабилен в начальный период.

Добавьте задержку и сообщайте разрешение после стабилизации сигнала.

```text
diff --git a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
index a69f8f6bd577..ede8d91f06dc 100644

--- a/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
+++ b/drivers/media/platform/rockchip/hdmirx/rk_hdmirx.c
@@ -1674,7 +1675,7 @@ static int hdmirx_wait_lock_and_get_timing(struct
rk_hdmirx_dev *hdmirx_dev)
      }

      hdmirx_reset_dma(hdmirx_dev);
-     usleep_range(200*1000, 200*1010);
+     usleep_range(500*1000, 500*1010);
      hdmirx_format_change(hdmirx_dev);

      return 0;
```

### 8.7 Не удаётся изменить разрешение источника

Исходник отмечает это у компьютеров Apple, видеокарт NVIDIA и некоторых ноутбуков с китайскими отечественными ОС. При смене разрешения драйвер обычно опускает и поднимает HPD для переподключения. Источник может принять это за отключение приёмника и отменить изменение. Настройте HPD как GPIO, чтобы удерживать высокий уровень во время смены разрешения.

Запросите через Redmine соответствующий патч: rk3588_hdmirx_config_hpd_as_gpio_config_scdc_pwr_asap_230513.patch.

### 8.8 Неверное измерение TMDSCLK

Это отмечается для входа 4K@60 RGB: источник выдаёт TMDSCLK 594M, а драйвер измеряет 148.5M, что приводит к неверным частоте кадров и частоте дискретизации аудио. См. журнал ошибки TMDSCLK.

Запросите патч через Redmine: rk3588_a12_hdmirx_patch_fps_err_0714.patch.

### 8.9 Чёрные вспышки в отдельных сценариях источника

Открытие некоторых страниц, например Youku или названного в исходнике blibli, либо изменение размера окон может изменить сигнал или увеличить ошибки, вызвав прерывания или потерю синхронизации.

(1) Прерывание вызывает переподключение: закройте просмотр, определите прерывание по журналу и проверьте результат его отключения. Исходник рекомендует обращение через Redmine.

(2) Рост ошибок вызывает потерю синхронизации: отключите проверку ошибок согласно разделу об отсутствии синхронизации.

## 9. Типовые журналы

Обычно для соответствующего вывода dmesg задают debug 2 либо изменяют код согласно разделу журналирования.

### 9.1 Журнал горячего подключения

```text
// 检测到拔出动作
[29830.165185][ T2655] fdee0000.hdmirx-controller: hdmirx_delayed_work_hotplug:
plugin:0

// 关闭中断
[29830.165203][ T2655] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
// 拉低HPD
[29830.165211][ T2655] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: disable,
hpd_trigger_level:1
[29830.177109][ T598] fdee0000.hdmirx-controller: hdmirx_query_dv_timings port
has no link!
...
// 检测到插入动作
[29843.128833][ T2655] fdee0000.hdmirx-controller: hdmirx_delayed_work_hotplug:
plugin:1

// 拉高hpd
[29843.139653][ T2655] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: enable,
hpd_trigger_level:1
...
[29843.247796][ T2655] fdee0000.hdmirx-controller: wait_reg_bit_status: i:0,
time: 10ms
[29843.286353][ T2655] fdee0000.hdmirx-controller: wait_reg_bit_status: i:38,
time: 50ms
[29843.286373][ T2655] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_audio_interrupts_setup: 1
// HDMI信号锁定
[29843.703996][ T2655] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal lock ok, i:54!

...
// 图像格式
[30098.978794][ T2655] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV422
[30098.978803][ T2655] fdee0000.hdmirx-controller: hdmirx_get_colordepth:
color_depth: 24, reg_val:4
// 详细分辨率timing
[30098.978813][ T2655] fdee0000.hdmirx-controller: get timings from ctrl
[30098.978819][ T2655] fdee0000.hdmirx-controller: act:1920x1080,
total:2200x1125, fps:60, pixclk:148500000
[30098.978825][ T2655] fdee0000.hdmirx-controller: hfp:84, hs:48, hbp:148, vfp:4,
vs:5, vbp:36

// TMDS CLK
[30098.978829][ T2655] fdee0000.hdmirx-controller: tmds_clk:148500000
[30098.978835][ T2655] fdee0000.hdmirx-controller: interlace:0, fmt:1, vic:127,
color:24, mode:hdmi
[30098.978840][ T2655] fdee0000.hdmirx-controller: deframer_st:0x11
...
// 上报分辨率变化事件
[30099.023034][ T2655] fdee0000.hdmirx-controller: hdmirx_format_change: New
format: 1920x1080p60.00 (2200x1125)
[30099.023039][ T2655] fdee0000.hdmirx-controller: hdmirx_format_change: queue
res_chg_event
```

### 9.2 Журнал смены разрешения

```text
// 信号变化，检测到数据误码中断
[ 312.662740][ C4] fdee0000.hdmirx-controller: avpunit_0_int_handler:
avp0_st:0x700000

[ 312.662750][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
// TMDS信号变化中断
[ 312.662756][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 312.662760][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 312.688916][ T196] fdee0000.hdmirx-controller: hdmirx_delayed_work_audio: no
supported fs(0), cur_state 0
[ 312.688928][ T196] rk_hdmirx fdee0000.hdmirx-controller: audio off
// 进入切换分辨率流程，当前HDMI状态为插入
[ 312.723309][ T196] fdee0000.hdmirx-controller:
hdmirx_delayed_work_res_change: plugin:1

[ 312.723316][ T196] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
[ 312.724986][ C4] fdee0000.hdmirx-controller: mu0_st:0x4000000
[ 312.724991][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
// 相关配置完成后拉高HPD
[ 312.725000][ T196] fdee0000.hdmirx-controller: hdmirx_hpd_ctrl: enable,
hpd_trigger_level:1
...
// 信号锁定
fdee0000.hdmirx-controller: hdmirx_wait_lock_and_get_timing signal lock ok, i:2!
...
// 获取新的分辨率，图像格式等

[ 312.849040][ T196] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
YUV420
[ 312.849049][ T196] fdee0000.hdmirx-controller: hdmirx_get_colordepth:
color_depth: 24, reg_val:4
[ 312.849056][ T196] fdee0000.hdmirx-controller: get timings from ctrl
[ 312.849060][ T196] fdee0000.hdmirx-controller: act:3840x2160,
total:4400x2250, fps:60, pixclk:296996000
[ 312.849064][ T196] fdee0000.hdmirx-controller: hfp:84, hs:48, hbp:148, vfp:8,
vs:10, vbp:72
[ 312.849067][ T196] fdee0000.hdmirx-controller: tmds_clk:296996000
[ 312.849070][ T196] fdee0000.hdmirx-controller: interlace:0, fmt:3, vic:127,
color:24, mode:hdmi
```

### 9.3 Журнал отсутствия синхронизации

```text
// 信号未锁定
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0

[ 285.950011][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing mu_st:0x0, scdc_st:0x0, dma_st10:0x10
...
// 读取到错误的分辨率
[ 257.222739][ T193] fdee0000.hdmirx-controller: get timings from dma
[ 257.222744][ T193] fdee0000.hdmirx-controller: act:39024x0, total:17732x1,
fps:8375, pixclk:148500000
[ 257.222749][ T193] fdee0000.hdmirx-controller: hfp:4294904560, hs:184,
hbp:41260, vfp:1, vs:0, vbp:0
[ 257.222753][ T193] fdee0000.hdmirx-controller: tmds_clk:148500000
[ 257.222758][ T193] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:127,
color:24, mode:dvi

// 连续读取到错误分辨率
[ 257.254994][ T193] fdee0000.hdmirx-controller: hdmirx_try_to_get_timings: res
not stable!
```

### 9.4 Журнал запуска/остановки потока драйвера

```text
// 开流使能dma，获取到30帧数据打印
[ 2360.096789][ T473] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10700000, uv_addr:0x10700000

[ 2360.096813][ T473] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[ 2360.689582][ T205] fdee0000.hdmirx-controller: rcv frames
...
// 关流
[ 2475.818301][ T473] fdee0000.hdmirx-controller: stream start stopping
[ 2475.818575][ T205] fdee0000.hdmirx-controller: hdmirx_dma_irq_handler: stop
stream!
[ 2475.818613][ T473] fdee0000.hdmirx-controller: stream stopping finished
```

### 9.5 Журнал потока HDMI IN

```text
// 查看数据流打印需要将log等级开到3，每隔半帧打印一句log，打印如下：
[ 2778.207227][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080

[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.223889][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.240557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.257226][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.265887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.273887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.282557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

### 9.6 Журнал отсутствия синхронизации

```text
// 信号未锁定
[ 285.949990][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing signal not lock, tmds_clk_ratio:0

[ 285.950011][ T191] fdee0000.hdmirx-controller:
hdmirx_wait_lock_and_get_timing mu_st:0x0, scdc_st:0x0, dma_st10:0x10
...
// 读取到错误的分辨率
[ 257.222739][ T193] fdee0000.hdmirx-controller: get timings from dma
[ 257.222744][ T193] fdee0000.hdmirx-controller: act:39024x0, total:17732x1,
fps:8375, pixclk:148500000
[ 257.222749][ T193] fdee0000.hdmirx-controller: hfp:4294904560, hs:184,
hbp:41260, vfp:1, vs:0, vbp:0
[ 257.222753][ T193] fdee0000.hdmirx-controller: tmds_clk:148500000
[ 257.222758][ T193] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:127,
color:24, mode:dvi

// 连续读取到错误分辨率
[ 257.254994][ T193] fdee0000.hdmirx-controller: hdmirx_try_to_get_timings: res
not stable!
```

### 9.7 Потеря синхронизации после успешного захвата

```text
// 驱动开流
[140.628993][ T1525] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10b00000, uv_addr:0x10b00000

[140.629009][ T1525] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[140.632067][ T198] fdee0000.hdmirx-controller: line_flag_int_handler: last have
no dma_idle_irq
[141.223426][ T198] fdee0000.hdmirx-controller: rcv frames
// 预览3s后检测到信号变化
[144.955132][ C4] fdee0000.hdmirx-controller: mu0_st:0xc0000000
[144.955142][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[144.955173][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[144.955179][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler: en_fiq
[144.958942][ T1525] fdee0000.hdmirx-controller: stream start stopping
...

// 锁定后报TMDSVALID_STABLE_CHG、TMDSQPCLK_LOCKED_CHG、TMDSQPCLK_OFF_CHG、AVP1中断
[ 176.865529][ T55] fdee0000.hdmirx-controller: hdmirx_format_change: New
format: 1920x1200p59.99 (2592x1242)
[ 176.873290][ T55] fdee0000.hdmirx-controller: hdmirx_format_change: queue
res_chg_event
[ 176.873311][ T55] fdee0000.hdmirx-controller: hdmirx_set_ddr_store_fmt:
pix_fmt: RGB888, DMA_CONFIG1:0x12000001
[ 176.873317][ T55] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
enable
[ 176.873355][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler: hdmi
irq not handled!
[ 176.873358][ C4] fdee0000.hdmirx-controller: avp0:0x0, avp1:0x0, mu0:0x0,
mu2:0x0, pk0:0x800, pk2:0x0, scdc:0x0
[ 177.389362][ C4] fdee0000.hdmirx-controller: avpunit_0_int_handler:

avp0_st:0x200000
[ 177.389378][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[ 177.389397][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 177.389403][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.390164][ C4] fdee0000.hdmirx-controller: mu0_st:0x10
[ 177.390185][ C4] fdee0000.hdmirx-controller: mainunit_0_int_handler:
TMDSQPCLK_LOCKED_CHG
[ 177.390189][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.392165][ C4] fdee0000.hdmirx-controller: mu0_st:0x10

[ 177.392185][ C4] fdee0000.hdmirx-controller: mainunit_0_int_handler:
TMDSQPCLK_OFF_CHG
[ 177.392190][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.393391][ C4] fdee0000.hdmirx-controller: mu2_st:0x2
[ 177.393410][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 177.393415][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
[ 177.397433][ C4] fdee0000.hdmirx-controller: avpunit_1_int_handler:
avp1_st:0x40000000
[ 177.397445][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq

[ 177.397994][ C4] fdee0000.hdmirx-controller: avpunit_1_int_handler:
avp1_st:0x80000000
[ 177.398002][ C4] fdee0000.hdmirx-controller: hdmirx_hdmi_irq_handler:
en_fiq
```

### 9.8 Ошибка измерения TMDSCLK

```text
// 源端实际输入4k@60 实际tmdsclk为594M
[147.366197][ T192] fdee0000.hdmirx-controller: get timings from ctrl
[147.366201][ T192] fdee0000.hdmirx-controller: act:3840x2160, total:4400x2250,

fps:16, pixclk:153864000
[147.366206][ T192] fdee0000.hdmirx-controller: hfp:176, hs:88, hbp:296, vfp:8,
vs:10, vbp:72
[147.366210][ T192] fdee0000.hdmirx-controller: tmds_clk:153864000,
pix_clk:153864000
[147.366214][ T192] fdee0000.hdmirx-controller: interlace:0, fmt:0, vic:0,
color:24, mode:hdmi
...
// 由于tmdsclk统计错误导致音频采样率错误
[152.555134][ T187] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400
[152.555191][ T187] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
[152.758428][ T192] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400

[152.758458][ T192] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
[152.965070][ T192] rk_hdmirx fdee0000.hdmirx-controller:
hdmirx_delayed_work_audio: audio underflow and overflow 0x3000000, with fs
invalid 12400
[152.965093][ T192] rk_hdmirx fdee0000.hdmirx-controller: hdmirx_audio_fifo_init
```

### 9.9 Перезагрузка при горячем подключении или смене разрешения

Ошибка нулевого указателя и перезагрузка после отключения:

```text
[ 453.482730][ T819] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742

[ 453.482745][ T819] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 453.482752][ T819] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 453.987489][ T819] fdee0000.hdmirx-controller: C-Plane 0 size: 24883200,
Total imagesize: 24883200
[ 453.987524][ T819] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742
[ 453.987539][ T819] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 453.987545][ T819] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 454.111292][ C3] hrtimer: interrupt took 15194002 ns

[ 454.144120][ T3686] Unable to handle kernel paging request at virtual address
ffffffc0c684007d
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB

[ 4088.362084][T31719] Unable to handle kernel paging request at virtual address
0000000200000077
[ 4088.364060][ T268] dw-hdcp fde70000.hdcp: hdcp reset
[ 4088.366597][T31719] Mem abort info:

[ 4088.366599][T31719] ESR = 0x96000005
[ 4088.366601][T31719] EC = 0x25: DABT (current EL), IL = 32 bits
[ 4088.366602][T31719] SET = 0, FnV = 0
[ 4088.366604][T31719] EA = 0, S1PTW = 0
[ 4088.366604][T31719] Data abort info:
[ 4088.366606][T31719] ISV = 0, ISS = 0x00000005
[ 4088.366607][T31719] CM = 0, WnR = 0
[ 4088.366609][T31719] user pgtable: 4k pages, 39-bit VAs, pgdp=000000010318c000
[ 4088.366614][T31719] [0000000200000077] pgd=0000000000000000
[ 4088.367094][ T580] Unable to handle kernel write to read-only memory at
virtual address ffffffc008105928
[ 4088.367373][T31719] , p4d=0000000000000000
[ 4088.367375][ C1] ------------[ cut here ]------------
[ 4088.367386][ C1] WARNING: CPU: 1 PID: 0 at kernel/workqueue.c:1660
queue_delayed_work_on+0xb4/0x114
```

Прерывание HDMIRX и последующая перезагрузка после отключения:

```text
[ 417.412262][ T827] fdee0000.hdmirx-controller: C-Plane 0 size: 24883200,
Total imagesize: 24883200

[ 417.412293][ T827] fdee0000.hdmirx-controller: hdmirx_set_fmt: req(3840,
2160), out(3840, 2160), fmt:0x33524742
[ 417.412308][ T827] fdee0000.hdmirx-controller: hdmirx_get_content_type:
Graphics
[ 417.412314][ T827] fdee0000.hdmirx-controller: hdmirx_get_pix_fmt: pix_fmt:
RGB888
[ 417.666427][ C4] fdee0000.hdmirx-controller: mu0_st:0xc0000000
[ 417.666443][ C4] fdee0000.hdmirx-controller: hdmirx_interrupts_setup:
disable
[ 417.666468][ C4] fdee0000.hdmirx-controller: mainunit_2_int_handler:
TMDSVALID_STABLE_CHG
[ 417.666581][ T3437] ------------[ cut here ]------------
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14

LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[2] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
```

Перезагрузка при запуске потока после подключения:

```text
[  31.300604][ T556] fdee0000.hdmirx-controller: hdmirx_get_color_range:
color_range: limit
[  31.300662][ T556] fdee0000.hdmirx-controller: hdmirx_get_color_space: video

standard: xvYCC601
[  31.316905][ T556] fdee0000.hdmirx-controller: hdmirx_start_streaming:
start_stream cur_buf y_addr:0x10900000, uv_addr:0x10900000
[  31.316924][ T556] fdee0000.hdmirx-controller: hdmirx_start_streaming: enable
dma
[ 417.666581][ T3437] ------------[ cut here ]------------
DDR 73dffea49e typ 23/09/20-14:18:32,fwver: v1.14
LPDDR4X, 2112MHz
channel[0] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
channel[1] BW=16 Col=10 Bk=8 CS0 Row=16 CS1 Row=16 CS=2 Die BW=16 Size=2048MB
```

Чёрный или зелёный экран после подключения; переподключение или смена источника не восстанавливает изображение.

В исходнике описаны входы, вызывающие сбой HDMIRX без сбоя шины. DMA не переносит данные, и экран остаётся чёрным. Установите уровень журнала 3 и проверьте нормальное чередование прерываний DMA. Отсутствие dma_idle_irq также указывает на эту проблему.

Нормальный журнал:

```text
[ 2778.207227][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.223889][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080

[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.240557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x80, st13:1080
[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

Журнал при ошибке:

```text
[ 2778.215891][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.232559][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540

[ 2778.249222][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.265887][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
[ 2778.282557][ T205] fdee0000.hdmirx-controller: dma_irq st1:0x100, st13:540
```

## 10. Патчи для проблем перезагрузки

Согласно исходнику, обновление SDK может снизить вероятность перезагрузок HDMIRX, но не гарантирует их полного устранения. Код включён в следующие версии:

| SDK version | kernel |
| --- | --- |
| android-12.0-mid-rkr14 | 5.10 |
| android-13.0-mid-rkr6 | 5.10 |
| android-14.0-mid-rkr1 | 6.1 |
| linux-5.10-gen-rkr5 | 5.10 |

Примечание: NVR-sdk-v1.7 не включает последние описанные патчи перезагрузки; они предоставляются отдельно.

Если SDK не обновлён до перечисленных версий, необходимы отдельные патчи по ссылке исходника: https://redmine.rock-chips.com/documents/130.

kernel-5.10

Способ 1: сохраните собственные изменения, примените соответствующие патчи через git am, затем вручную восстановите свои изменения.

Способ 2: замените исходники драйвера в ../hdmirx/, примените патчи 0009, 0010 и 0022, затем восстановите собственные изменения. Это процедура обновления из исходника, а не действие, выполненное при подготовке статьи.

rkbin

Исходник упоминает rk3588_bl31_v1.41.elf и требует версию как минимум после v1.39, затем называет rk3588_bl31_v1.39.elf исходным уровнем. Формулировка включения/исключения границы неоднозначна; проверьте требуемую BL31 для конкретного SDK, не угадывая.

Проверьте версию: `vim rkbin/RKTRUST/RK3588TRUST.ini`.

Исходник обычно рекомендует v1.42, также устраняющую другие проблемы DDR; описание патча: https://redmine.rock-chips.com/issues/441328.

Вместе с BL31 обновите соответствующую версию ddr_bin.

После обновления BL31 и прошивки U-Boot проверьте журнал загрузки для подтверждения замены. Исходник приводит следующую дату сборки v1.42:

```text
INFO: Preloader serial: 2
NOTICE: BL31: v2.3():v2.3-639-g87bcc5dfe:derrick.huang
NOTICE: BL31: Built : 18:06:16, Sep 9 2023
```

После применения патчей проверьте соответствие следующих важных функций:

Настройка прерываний:

```text
static void hdmirx_interrupts_setup(struct rk_hdmirx_dev *hdmirx_dev, bool en)
{

   struct v4l2_bt_timings *bt = &hdmirx_dev->timings.bt;

   v4l2_dbg(1, debug, &hdmirx_dev->v4l2_dev, "%s: %sable\n",
         __func__, en ? "en" : "dis");

   if (en && bt->pixelclock > 590000000 && hdmirx_dev->pix_fmt != HDMIRX_YUV420)
{
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL,
              VMON_IRQ_THR_MASK, VMON_IRQ_THR_MASK);
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL2,
              VMON_IRQ_VERTICAL_MASK |
              VMON_IRQ_HORIZONAL_MASK,
              VMON_IRQ_VERTICAL_SEL(0x1f) |

              VMON_IRQ_HORIZONAL_SEL(0x1f));
      hdmirx_update_bits(hdmirx_dev, DEFRAMER_CONFIG0,
              VS_REMAPFILTER_EN_QST |
              VS_FILTER_ORDER_QST_MASK |
              HS_FILTER_ORDER_QST_MASK,
              VS_REMAPFILTER_EN_QST |
              VS_FILTER_ORDER_QST(0x3) |
              HS_FILTER_ORDER_QST(0x0));
   } else {
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL,
              VMON_IRQ_THR_MASK, 0);
      hdmirx_update_bits(hdmirx_dev, VMON_CONTROL2,

              VMON_IRQ_VERTICAL_MASK |
              VMON_IRQ_HORIZONAL_MASK,
              VMON_IRQ_VERTICAL_SEL(0x1f) |
              VMON_IRQ_HORIZONAL_SEL(0x0));
      hdmirx_update_bits(hdmirx_dev, DEFRAMER_CONFIG0,
              HS_FILTER_ORDER_QST_MASK,
              HS_FILTER_ORDER_QST(0x3));
   }
```

Запуск потока:

```text
static int hdmirx_start_streaming(struct vb2_queue *queue, unsigned int count)
{
   ...

   touch_flag = (hdmirx_dev->bound_cpu << 1) | 0x1;
   sip_hdmirx_config(HDMIRX_AUTO_TOUCH_EN, 0, touch_flag, 100);
   ...
   sip_hdmirx_config(HDMIRX_INFO_NOTIFY, 0, DMA_CONFIG6, HDMIRX_DMA_EN);
   ...
}
```

Специальные изменения

Некоторые заказчики отмечали повышенную вероятность перезагрузки в трактах через коммутаторы или мосты, например DP-to-HDMI. Для анализа требуется участие изготовителя моста. Исходник указывает, что Lontium LT8641 (коммутатор) и LT8711 (DP2HDMI) имеют оптимизации для горячего подключения RK3588; запросите соответствующую прошивку у изготовителя и проверьте её. Это сообщения исходника, а не результаты проверки ArmSoM.

{% endraw %}
