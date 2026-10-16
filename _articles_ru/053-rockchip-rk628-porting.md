---
title: "Rockchip RK628 For-All: полное руководство по переносу Display, HDMI IN, аудио и отладке"
description: "Полное руководство RK628D/F/H For-All: перенос драйверов, DTS, регулировка сигналов, HDMI IN, аудио, тестирование и устранение неисправностей."
translation_key: "053-rockchip-rk628-porting"
slug: "053-rockchip-rk628-porting"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["RK628", "Display", "HDMI", "I2C", "V4L2"]
keywords: "ArmSoM Rockchip RK628 For-All Display HDMI IN V4L2"
excerpt: "Полное руководство RK628D/F/H For-All: перенос драйверов, DTS, регулировка сигналов, HDMI IN, аудио, тестирование и устранение неисправностей."
---

{% raw %}

# Rockchip RK628 For-All: полное руководство по переносу Display, HDMI IN, аудио и отладке

## Применимость к ArmSoM

Это справочный материал по платформе Rockchip, а не отчёт об испытаниях ArmSoM. RK628D/F/H — внешние микросхемы-мосты; применение на конкретной плате ArmSoM зависит от выведенных сигналов, питания, I2C, GPIO, прерываний, тактовых сигналов и целевого SDK/BSP. Исходник отдельно описывает драйверы Misc, Media и U-Boot для RK3399, RK356x, RK3588, RK3576, RK3562 и разных ветвей ядра. Это не означает поддержку на каждой плате. Необходимо проверить условия каждой конфигурации. Аппаратная проверка не проводилась.

По согласованию с пользователем общая основа всех трёх языков — китайская версия V2.7 (122 страницы). Английская V2.3 (117 страниц) используется для сопоставления и оригинальных иллюстраций. Отсутствующие или отличающиеся разделы полностью переведены с китайского: перенос драйверов, регулировка сигналов/SSC, перестановка линий GVI и настройка Media. Китайская статья содержит китайские оригиналы рисунков; английская и русская — соответствующие английские оригиналы с указанием страниц. Редактируемые расшифровки снимков основаны на новой китайской версии.

> Безопасность и противоречия исходника: запись регистров, chmod 0666 и setenforce 0 — исходные примеры отладки, а не рекомендации для эксплуатации. Расхождения в именах узлов, описании сигнальных трактов и перечнях платформ сохранены и перечислены в редакторском протоколе. Нумерация начинается с главы 2, поскольку глава оглавления удалена.

[Редакторский протокол](/docs/rockchip-rk628-porting/EDITORIAL-NOTES.md) · [Документация ArmSoM](https://docs.armsom.org/)

<!-- source: CN V2.7 p10; unit 0 -->

## 2. Введение

<!-- source: CN V2.7 p10; unit 1 -->

RK628 имеет тракт Display и тракт HDMI IN. В версии SDK Display основан на DRM, а HDMI IN — на V4L2. Для разных фреймворков и версий ядра требуются разные драйверы; эта версия предназначена только для платформ Rockchip. Для поддержки других платформ и упрощения переноса создан драйвер For-All. Сейчас он поддерживает RK628D и RK628F/H. Управление версиями патчей описано в инструкции по версиям драйвера RK628 из пакета патчей SDK.

<!-- source: CN V2.7 p10; unit 2 -->

For-All также разделён на Display и HDMI IN. Драйвер Display находится в drivers/misc/rk628/; входы: RGB / BT1120 / HDMI, выходы: RGB / BT1120 / LVDS / GVI / DSI / HDMI. Драйвер HDMI IN находится в drivers/media/i2c/rk628/; вход HDMI, выходы CSI / BT1120. Далее Misc и Media обозначают эти два независимых драйвера, которые можно компилировать и запускать отдельно.

<!-- source: CN V2.7 p10; unit 3 -->

### 2.1 Блок-схема RK628

<!-- source: CN V2.7 p10; unit 4 -->

![Оригинальный технический рисунок — EN V2.3, p9](/docs/rockchip-rk628-porting/assets/en-p9-X182.png)

*Оригинальный технический рисунок: EN V2.3, p9.*

<!-- source: CN V2.7 p11; unit 5 -->

### 2.2 Типовая аппаратная схема RK628

<!-- source: CN V2.7 p11; unit 6 -->

![Оригинальный технический рисунок — EN V2.3, p9](/docs/rockchip-rk628-porting/assets/en-p9-X184.png)

*Оригинальный технический рисунок: EN V2.3, p9.*

<!-- source: CN V2.7 p11; unit 7 -->

### 2.3 Основные характеристики RK628

<!-- source: CN V2.7 p11; unit 8 -->

#### 2.3.1 Основные характеристики RK628D

<!-- source: CN V2.7 p11; unit 9 -->

| Входной видеоинтерфейс | Типовое разрешение | Типовой формат |
| --- | --- | --- |
| HDMI IN | 4K@30 | YUV420(4K@60) / YUV422 / YUV444 /<br>RGB888 |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Выходной видеоинтерфейс | Типовое разрешение | Типовой формат |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | 4K@30 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888/YUV444 8bit |

<!-- source: CN V2.7 p12; unit 11 -->

#### 2.3.2 Основные характеристики RK628F

<!-- source: CN V2.7 p12; unit 12 -->

| Входной видеоинтерфейс | Типовое разрешение | Типовой формат |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Выходной видеоинтерфейс | Типовое разрешение | Типовой формат |
| GVI OUT | 4K@60 | RGB888 |
| MIPI CSI | Два MIPI, 4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p12; unit 13 -->

#### 2.3.3 Основные характеристики RK628H

<!-- source: CN V2.7 p12; unit 14 -->

В отличие от RK628F, RK628H не имеет интерфейса GVI.

<!-- source: CN V2.7 p13; unit 15 -->

| Входной видеоинтерфейс | Типовое разрешение | Типовой формат |
| --- | --- | --- |
| HDMI IN | 4K@60 | RGB888 / YUV422 8bit / YUV422 10bit<br>/ YUV420 8bit (> 4k@30Hz) / YUV420 10bit<br>(> 4k@30Hz) |
| BT1120 IN | 1080P@60 | YUV422 8bit |
| RGB IN | 1080P@60 | RGB888 |
| Выходной видеоинтерфейс | Типовое разрешение | Типовой формат |
| MIPI CSI | Два MIPI, 4K@60 | YUV422 8bit |
| MIPI DSI | 1080P@60 /<br>2.5K@60 | RGB888 |
| LVDS OUT | 720P@60 /<br>1080P@60 | RGB888 |
| BT1120 OUT | 1080P@60 | YUV422 8bit |
| RGB OUT | 1080P@60 | RGB888 |
| HDMI OUT | 1080P@60 | RGB888 / YUV444 8bit |

<!-- source: CN V2.7 p14; unit 16 -->

### 2.4 Улучшения и оптимизации RK628F/H относительно RK628D

<!-- source: CN V2.7 p14; unit 17 -->

| Функциональный блок | RK628D | RK628F/H |
| --- | --- | --- |
| HDMIRX | До 4K@60 YUV420; TMDS CLK 297M | До 4K@60 RGB/YUV444; TMDS CLK 594M |
| HDMIRX | Частоты ограничены; требуемое разрешение нужно оценивать отдельно, поддержка не гарантирована | Любая частота 27M–594M для разных входных разрешений |
| HDMIRX | DVI MODE не поддерживается | DVI MODE поддерживается |
| HDMIRX | Невозможно определить входной формат yuv422/yuv420 | Контроллер определяет входной видеоформат |
| HDMIRX | При низкой амплитуде clk lane источника RK628D rxphy не захватывает сигнал | Эта проблема отсутствует |
| HDMIRX | Проблемы обнаружения битовых ошибок HDMI RX | Эта проблема отсутствует |
| MIPI<br>CSI | Один канал, 4 линии | Два канала, 8 линий |
| MIPI<br>CSI | Максимум 4k@30 yuv422 8bit | Максимум 4k@60 yuv422 8bit |
| GVI | Некоторые модели панелей не включаются или показывают неправильно | По исходнику, испытания нескольких доступных моделей не выявили нарушений; см. Настройка выходных модулей → Выход GVI → Проверенные модели GVI для RK628F |
| GVI | Нужен общий источник тактирования | Общий источник тактирования не требуется |
| audio | Нет аудио mclk; при использовании кодека mclk должен выдавать основной SoC | Может выдавать mclk |
| audio | При подключении/отключении HDMI возможны переполнение I2S FIFO и ошибочное переключение каналов | Устранено нарушение порядка каналов при переполнении FIFO |
| csc | В некоторых сочетаниях входов/выходов выполняются преобразование цветового пространства или изменение дискретизации формата изображения; возможны небольшие отклонения цветовых деталей | Эта проблема отсутствует |
| hdmi tx | Нужен общий источник тактирования | rgb2hdmi требует общего источника тактирования; hdmi2hdmi не требует |
| Несколько дисплеев | Одновременный вывод rgb/bt1120 и hdmi tx с одинаковым разрешением | Одновременный вывод rgb/bt1120, hdmi tx и gvi/dsi/csi/lvds с одинаковым разрешением |
| MCU | Встроенного MCU нет | Встроенный MCU |

<!-- source: CN V2.7 p15; unit 18 -->

## 3. Перенос драйвера

<!-- source: CN V2.7 p15; unit 19 -->

For-All разделён на Display и HDMI IN. Драйвер Display для U-Boot находится в drivers/video/drm/rk628/, драйвер ядра — в drivers/misc/rk628/. Входы: RGB / BT1120 / HDMI; выходы: RGB / BT1120 / LVDS / GVI / DSI / HDMI. Драйвер HDMI IN расположен в drivers/media/i2c/rk628/, принимает HDMI и выводит CSI / DSI / BT1120.

<!-- source: CN V2.7 p15; unit 20 -->

Следующие драйверы можно переносить отдельно по необходимости:

<!-- source: CN V2.7 p15; unit 21 -->

### 3.1 Тракт Display

<!-- source: CN V2.7 p15; unit 22 -->

#### 3.1.1 U-Boot (drivers/video/drm/rk628)

<!-- source: CN V2.7 p15; unit 23 -->

В U-Boot платформ Rockchip реализованы перечисленные ниже тракты отображения RK628F/H для быстрого вывода загрузочного логотипа.

<!-- source: CN V2.7 p15; unit 24 -->

| IC | Display Route | Поддержка |
| --- | --- | --- |
| RK628F/H | HDMI2(Dual)DSI | Поддерживается |
| RK628F/H | HDMI2(Dual)LVDS | Поддерживается |
| RK628F | HDMI2GVI | Поддерживается |
| RK628F/H | HDMI2BT1120/RGB | Поддерживается |
| RK628F/H | BT1120/RGB2(Dual)DSI | Поддерживается |
| RK628F/H | BT1120/RGB2(Dual)LVDS | Поддерживается |
| RK628F | BT1120/RGB2GVI | Поддерживается |

<!-- source: CN V2.7 p15; unit 25 -->

Примечание: драйвер загрузочного логотипа U-Boot не поддерживает RK628D, поскольку его HDMIRX не работает на произвольных частотах.

<!-- source: CN V2.7 p15; unit 26 -->

При первом добавлении RK628 Misc или отсутствии драйвера RK628 в drivers/video/drm скопируйте исходники Misc RK628 для U-Boot непосредственно в drivers/video/drm и измените следующие файлы:

<!-- source: CN V2.7 p15; unit 27 -->

```text
drivers/video/drm/rockchip_display.c
drivers/video/drm/Kconfig
drivers/video/drm/Makefile

configs/rk3568_defconfig //以rk3568平台为例
```

<!-- source: CN V2.7 p15; unit 28 -->

Пример изменений приведён в патче:

<!-- source: CN V2.7 p15; unit 29 -->

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c

index a1cb40a000e..041b8bdd84f 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -918,6 +918,23 @@ static int display_enable(struct display_state *state)
      if (state->enabled_at_spl == false)
           rockchip_connector_enable(state);

+#ifdef CONFIG_DRM_ROCKCHIP_RK628

+     /*
+     * trigger .probe helper of U_BOOT_DRIVER(rk628) in ./rk628/rk628.c
+     */
+     struct udevice * dev;
+     int phandle, ret;
+
+     phandle = ofnode_read_u32_default(state->node, "bridge", -1);
+     if (phandle < 0)
+          printf("%s failed to find bridge phandle\n",
ofnode_get_name(state->node));
+
+     ret = uclass_get_device_by_phandle_id(UCLASS_I2C_GENERIC, phandle, &dev);

+     if (ret && ret != -ENOENT)
+          printf("%s:%d failed to get rk628 device ret:%d\n", __func__,
__LINE__, ret);
+
+#endif
+
      if (crtc_state->soft_te)
           crtc_funcs->apply_soft_te(state);
diff --git a/drivers/video/drm/Kconfig b/drivers/video/drm/Kconfig
index ddc65818cba..c5073b9926b 100644
--- a/drivers/video/drm/Kconfig

+++ b/drivers/video/drm/Kconfig
@@ -191,6 +191,13 @@ config DRM_ROCKCHIP_RK618
       Choose this option to enable support for Rockchip RK618 display
       bridge chips driver. say Y to enable its driver.

+config DRM_ROCKCHIP_RK628
+     bool "Rockchip RK628 display bridge driver"
+     depends on DRM_ROCKCHIP
+     help
+      Choose this option to enable support for Rockchip RK628 display
+      bridge chips driver. say Y to enable its driver.
+
diff --git a/drivers/video/drm/Makefile b/drivers/video/drm/Makefile
index ea4219d9cf6..f11a8ff4885 100644

--- a/drivers/video/drm/Makefile
+++ b/drivers/video/drm/Makefile
@@ -36,6 +36,7 @@ obj-$(CONFIG_DRM_ROCKCHIP_RGB) += rockchip_rgb.o
 obj-$(CONFIG_DRM_ROCKCHIP_PANEL) += rockchip_panel.o
 obj-$(CONFIG_DRM_ROHM_BU18XL82) += rohm-bu18tl82.o rohm-bu18rl82.o
 obj-$(CONFIG_DRM_ROCKCHIP_RK618) += rk618.o rk618_lvds.o rk618_dsi.o
+obj-$(CONFIG_DRM_ROCKCHIP_RK628) += rk628/
 obj-$(CONFIG_DRM_ROCKCHIP_RK1000) += rk1000.o rk1000_tve.o
 obj-$(CONFIG_DRM_ROCKCHIP_SAMSUNG_MIPI_DCPHY) += samsung_mipi_dcphy.o
 obj-$(CONFIG_DRM_SII902X) += sii902x.o
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index acd1fb18169..94f1050eb4f 100644
--- a/configs/rk3568_defconfig

+++ b/configs/rk3568_defconfig
@@ -224,3 +224,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
 CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_DRM_ROCKCHIP_RK628=y
```

<!-- source: CN V2.7 p16; unit 30 -->

<!-- source: CN V2.7 p16; unit 31 -->

<!-- source: CN V2.7 p16; unit 32 -->

<!-- source: CN V2.7 p17; unit 33 -->

<!-- source: CN V2.7 p17; unit 34 -->

Для включения логотипа U-Boot добавьте в DTS следующую конфигурацию:

<!-- source: CN V2.7 p17; unit 35 -->

Для входа RGB:

<!-- source: CN V2.7 p17; unit 36 -->

```text
 &route_rgb {
      status = "okay";

+
+     bridge = <&i2c2_rk628>;
 };
```

<!-- source: CN V2.7 p17; unit 37 -->

Для входа HDMI:

<!-- source: CN V2.7 p17; unit 38 -->

```text
&route_hdmi {
      status = "okay";
+

+     bridge = <&i2c2_rk628>;
      force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      force-output;
      force_timing{
```

<!-- source: CN V2.7 p17; unit 39 -->

Чтобы избежать мерцания при переходе от логотипа U-Boot к логотипу ядра, убедитесь, что ядро содержит патч со следующими сведениями о коммите:

<!-- source: CN V2.7 p17; unit 40 -->

```text
misc: rk628: add support uboot logo

Type: Function

Redmine ID: #496880 #491750
Associated modifications: NULL
Test: NULL

Change-Id: I311e2c9682f835b377ea9082e1d3a88688167172
Signed-off-by: Guochun Huang <hero.huang@rock-chips.com>
```

<!-- source: CN V2.7 p17; unit 41 -->

#### 3.1.2 Ядро (drivers/misc/rk628)

<!-- source: CN V2.7 p17; unit 42 -->

При первом добавлении RK628 Misc в ядро Rockchip или отсутствии RK628 в drivers/misc скопируйте исходники Misc RK628 непосредственно в drivers/misc. Измените drivers/misc/Kconfig, drivers/misc/Makefile и arch/arm64/configs/rockchip_defconfig, добавив сборку RK628. Пример патча:

<!-- source: CN V2.7 p18; unit 43 -->

```text
diff --git a/drivers/misc/Kconfig b/drivers/misc/Kconfig
index 276c7c4fef15..8481b9613bc9 100644
--- a/drivers/misc/Kconfig

+++ b/drivers/misc/Kconfig
@@ -5,6 +5,8 @@

 menu "Misc devices"

+source "drivers/misc/rk628/Kconfig"
+
 config RK803
      tristate "RK803"
      default n
diff --git a/drivers/misc/Makefile b/drivers/misc/Makefile
index b296e760fd47..14642c54a2bc 100644

--- a/drivers/misc/Makefile
+++ b/drivers/misc/Makefile
@@ -3,6 +3,7 @@
 # Makefile for misc devices that really don't fit anywhere else.
 #

+obj-y                 += rk628/
 obj-$(CONFIG_RK803)   += rk803.o
 obj-y                 += rockchip/
 obj-$(CONFIG_LT7911D_FB_NOTIFIER) += lt7911d-fb-notifier.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 28340b4bdfae..dbb7d9e55b62 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -294,6 +294,8 @@ CONFIG_BLK_DEV_LOOP_MIN_COUNT=16
 CONFIG_BLK_DEV_RAM=y
 CONFIG_BLK_DEV_RAM_SIZE=8192
 CONFIG_BLK_DEV_NVME=y
+CONFIG_RK628_MISC=y
+CONFIG_RK628_MISC_HDMITX=y
 CONFIG_LT7911D_FB_NOTIFIER=y
 CONFIG_SRAM=y
 CONFIG_UID_SYS_STATS=y
@@ -557,7 +559,6 @@ CONFIG_ROCKCHIP_THERMAL=y

 CONFIG_WATCHDOG=y
 CONFIG_DW_WATCHDOG=y
 CONFIG_MFD_RK618=y
-CONFIG_MFD_RK628=y
 CONFIG_MFD_RK630_I2C=y
 CONFIG_MFD_RK806_I2C=y
 CONFIG_MFD_RK806_SPI=y
@@ -640,7 +641,6 @@ CONFIG_ROCKCHIP_LVDS=y
 CONFIG_ROCKCHIP_RGB=y
 CONFIG_ROCKCHIP_DW_HDCP2=y
 CONFIG_DRM_ROCKCHIP_RK618=y
-CONFIG_DRM_ROCKCHIP_RK628=y
CONFIG_DRM_PANEL_SIMPLE=y
CONFIG_DRM_PANEL_MAXIM_MAX96752F=y
CONFIG_DRM_PANEL_MAXIM_MAX96772=y
```

<!-- source: CN V2.7 p18; unit 44 -->

<!-- source: CN V2.7 p18; unit 45 -->

<!-- source: CN V2.7 p19; unit 46 -->

<!-- source: CN V2.7 p19; unit 47 -->

Важно: CONFIG_MFD_RK628 и CONFIG_DRM_ROCKCHIP_RK628 относятся к старым драйверам RK628; их необходимо удалить из rockchip_defconfig.

<!-- source: CN V2.7 p19; unit 48 -->

Драйверы Misc компилируются по умолчанию; выбор запускаемого драйвера выполняется через DTS.

<!-- source: CN V2.7 p19; unit 49 -->

### 3.2 Тракт HDMI IN (drivers/media/i2c/rk628)

<!-- source: CN V2.7 p19; unit 50 -->

Для ядер до 5.10 используйте пакет rk628_for-all; для ядра 5.10 — kernel_5.10_rk628_media_patch. Скопируйте драйвер Media RK628 в drivers/media/i2c/rk628/ и измените drivers/media/i2c/Kconfig, drivers/media/i2c/Makefile и arch/arm64/configs/rockchip_defconfig, добавив сборку RK628. Пример:

<!-- source: CN V2.7 p19; unit 51 -->

```text
diff --git a/drivers/media/i2c/Kconfig b/drivers/media/i2c/Kconfig
index f3273756c612..609bb5e3db07 100644
--- a/drivers/media/i2c/Kconfig

+++ b/drivers/media/i2c/Kconfig
@@ -414,6 +414,8 @@ config VIDEO_OTP_EEPROM
      help
       This driver supports OTP load from eeprom.

+source "drivers/media/i2c/rk628/Kconfig"
+
 config VIDEO_SAA7110
      tristate "Philips SAA7110 video decoder"
      depends on VIDEO_V4L2 && I2C
diff --git a/drivers/media/i2c/Makefile b/drivers/media/i2c/Makefile
index 26edd6f7590e..d6f4128b19a5 100644

--- a/drivers/media/i2c/Makefile
+++ b/drivers/media/i2c/Makefile
@@ -141,6 +141,7 @@ obj-$(CONFIG_VIDEO_ML86V7667) += ml86v7667.o
 obj-$(CONFIG_VIDEO_OV2659) += ov2659.o
 obj-$(CONFIG_VIDEO_TC358743) += tc358743.o
 obj-$(CONFIG_VIDEO_TC35874X) += tc35874x.o
+obj-$(CONFIG_VIDEO_RK628) += rk628/
 obj-$(CONFIG_VIDEO_AR0230) += ar0230.o
 obj-$(CONFIG_VIDEO_GC02M2) += gc02m2.o
 obj-$(CONFIG_VIDEO_GC08A3) += gc08a3.o
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index 95ad81b12a69..c66f67ecd0c2 100644

--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -567,6 +567,8 @@ CONFIG_VIDEO_ROCKCHIP_ISPP=y
 CONFIG_VIDEO_ROCKCHIP_HDMIRX=y
 CONFIG_VIDEO_LT6911UXC=y
 CONFIG_VIDEO_LT7911D=y
+CONFIG_VIDEO_RK628_CSI=y
+CONFIG_VIDEO_RK628_BT1120=y
 CONFIG_VIDEO_TC35874X=y
 CONFIG_VIDEO_GC0312=y
 CONFIG_VIDEO_GC2145=y
```

<!-- source: CN V2.7 p19; unit 52 -->

<!-- source: CN V2.7 p20; unit 53 -->

<!-- source: CN V2.7 p20; unit 54 -->

Драйверы Media компилируются по умолчанию; DTS определяет, какой драйвер работает.

<!-- source: CN V2.7 p20; unit 55 -->

## 4. Связь SoC с RK628 по I2C

<!-- source: CN V2.7 p20; unit 56 -->

SoC обменивается данными с RK628 по I2C. Типовой 7-битный адрес RK628 — 0x50. Если на одной шине несколько RK628, их адреса можно изменить посредством GPIO RK628:

<!-- source: CN V2.7 p20; unit 57 -->

![Оригинальный технический рисунок — EN V2.3, p13](/docs/rockchip-rk628-porting/assets/en-p13-X201.png)

*Оригинальный технический рисунок: EN V2.3, p13.*

Текст рисунка: адрес I2C содержит 7 бит. Старшие четыре бита идентифицируют устройство и равны 4'b1010; младшие три задают адрес устройства. Адрес ведомого устройства можно программировать через GPIO для разных сценариев. Типичный адрес — 7'b1010000.

| Бит адреса | Имя вывода | Настройка GPIO |
| --- | --- | --- |
| cfg_slvadr[2] | IO_GPIO0a1 | GPIO0A_OE[1]=1’b1 |
| cfg_slvadr[1] | IO_GPIO0a0 | GPIO0A_OE[0]=1’b1 |
| cfg_slvadr[0] | IO_GPIO3b3 | GPIO3B_OE[2]=1’b1 |

<!-- source: CN V2.7 p20; unit 58 -->

Пример для адресов ведомого устройства 0x50 и 0x51:

<!-- source: CN V2.7 p20; unit 59 -->

![Оригинальный технический рисунок — EN V2.3, p13](/docs/rockchip-rk628-porting/assets/en-p13-X202.png)

*Оригинальный технический рисунок: EN V2.3, p13.*

<!-- source: CN V2.7 p20; unit 60 -->

![Оригинальный технический рисунок — EN V2.3, p13](/docs/rockchip-rk628-porting/assets/en-p13-X203.png)

*Оригинальный технический рисунок: EN V2.3, p13.*

| I2C SEL | I2C ADDR |
| --- | --- |
| 0 | 7'b1010000 (0x50) |
| 1 | 7'b1010001 (0x51) |

<!-- source: CN V2.7 p20; unit 61 -->

GPIO0a0 и GPIO0a1 удерживаются на низком уровне. При высоком уровне GPIO3b3 адрес равен 0x51 (7'b1010001), при низком — 0x50 (7'b1010000).

<!-- source: CN V2.7 p21; unit 62 -->

## 5. Misc

<!-- source: CN V2.7 p21; unit 63 -->

### 5.1 Обзор драйвера MISC

<!-- source: CN V2.7 p21; unit 64 -->

RK628 Misc реализует тракт Display для преобразования протоколов отображения. Входы: RGB, BT1120 или HDMI; выходы: LVDS, GVI, DSI, RGB, BT1120 или HDMI.

<!-- source: CN V2.7 p21; unit 65 -->

#### 5.1.1 Перенос драйвера

<!-- source: CN V2.7 p21; unit 66 -->

См. Перенос драйвера → Тракт Display.

<!-- source: CN V2.7 p21; unit 67 -->

#### 5.1.2 Структура каталога драйвера U-Boot

<!-- source: CN V2.7 p21; unit 68 -->

```text
drivers/video/drm/rk628/
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_gvi.c
├── rk628_gvi.h
├── rk628.h

├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c
└── rk628_rgb.h
```

<!-- source: CN V2.7 p21; unit 69 -->

#### 5.1.3 Структура каталога драйвера ядра

<!-- source: CN V2.7 p21; unit 70 -->

```text
drivers/misc/rk628/
├── Kconfig
├── Makefile

├── panel.c
├── panel.h
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_config.c

├── rk628_config.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_dsi.c
├── rk628_dsi.h
├── rk628_efuse.c
├── rk628_efuse.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628_gvi.c

├── rk628_gvi.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_hdmitx.c
├── rk628_hdmitx.h
├── rk628_lvds.c
├── rk628_lvds.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h
├── rk628_rgb.c

├── rk628_rgb.h
```

<!-- source: CN V2.7 p22; unit 71 -->

<!-- source: CN V2.7 p22; unit 72 -->

#### 5.1.4 Обзор конфигурации DTS

<!-- source: CN V2.7 p22; unit 73 -->

Пример: RGB → DSI.

<!-- source: CN V2.7 p22; unit 74 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      interrupt-parent = <&gpio0>;
      interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };

};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };

   };
};

&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";


   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;

   rk628-rgb-in;
   rk628-dsi-out {

      dsi,eotp;
      dsi,video-mode;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
            05 78 01 11
            05 78 01 29
         ];


         panel-exit-sequence = [
            05 00 01 28
            05 00 01 10
         ];
      };
   };

   display-timings {
      src-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;

         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;

         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;

         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
};
```

<!-- source: CN V2.7 p23; unit 75 -->

<!-- source: CN V2.7 p24; unit 76 -->

<!-- source: CN V2.7 p24; unit 77 -->

### 5.2 Основная конфигурация драйвера

<!-- source: CN V2.7 p24; unit 78 -->

#### 5.2.1 Узел RK628

<!-- source: CN V2.7 p24; unit 79 -->

SoC обменивается данными с RK628 по I2C. Для RK3568 добавьте узел RK628 (i2c2_rk628: rk628@50) в узел I2C i2c2 дерева DTS:

<!-- source: CN V2.7 p24; unit 80 -->

```text
&i2c2 {
   clock-frequency = <400000>;

   status = "okay";

   i2c2_rk628: rk628@50 {
      compatible = "rockchip,rk628";
      reg = <0x50>;
      enable-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PA2 GPIO_ACTIVE_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_reset>;
      status = "okay";
   };
};


&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };
};
```

<!-- source: CN V2.7 p25; unit 81 -->

<!-- source: CN V2.7 p25; unit 82 -->

Свойства узла RK628:

<!-- source: CN V2.7 p25; unit 83 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| compatible | compatible | Для RK628 Misc задайте compatible = "rockchip,rk628" |
| reg | Адрес ведомого RK628 на I2C | 0x50/0x51, согласно аппаратной схеме |
| enable-gpios | Ссылка на GPIO включения RK628 | Согласно аппаратной схеме |
| reset-gpios | Ссылка на GPIO сброса RK628 | Согласно аппаратной схеме |
| pinctrl-names | Переключение вывода reset RK628 в функцию GPIO | Согласно аппаратной схеме |
| pinctrl-0 | Переключение вывода reset RK628 в функцию GPIO | Согласно аппаратной схеме |

<!-- source: CN V2.7 p25; unit 84 -->

#### 5.2.2 Рабочая частота 24 МГц

<!-- source: CN V2.7 p25; unit 85 -->

Рабочая частота RK628 24 МГц может поступать от внешнего кварца 24M или вывода CLK SoC 24 МГц. При внешнем кварце следующая конфигурация не требуется.

<!-- source: CN V2.7 p25; unit 86 -->

В трактах RK628D HDMI / GVI OUT и RK628F/H RGB → HDMI необходимо использовать выход CLK SoC 24 МГц как рабочий источник RK628 для общего тактирования. Внешний кварц 24M может вызвать нарушения изображения. В RK628F/H этот механизм улучшен: TMDS CLK, обнаруженный HDMI RX, используется как опорный сигнал CRU PLL, поэтому для HDMI IN не требуется опорная частота 24 МГц от SoC.

<!-- source: CN V2.7 p25; unit 87 -->

На RK3568 частоту 24 МГц могут выдавать несколько выводов: REF_CLKOUT (clk_wifi / gpio0_a0), CAM_CLKOUT1 (clk_cam1_out / gpio4_b0), ETH_REFCLK_25M_M0 (clk_mac1_out / gpio3_b0). Ниже используется первый вариант. Другие платформы Rockchip описаны в разделе об источнике тактирования RK628 24M от другого SoC.

<!-- source: CN V2.7 p25; unit 88 -->

1\. Добавьте ссылки на следующую конфигурацию в узел RK628 DTS:

<!-- source: CN V2.7 p25; unit 89 -->

```text
&i2c2_rk628 {
   /* soc_24M optional */
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
   ......
};
```

<!-- source: CN V2.7 p26; unit 90 -->

2\. Следующая конфигурация уже присутствует в rk3568-pinctrl.dtsi:

<!-- source: CN V2.7 p26; unit 91 -->

```text
&pinctrl {
   ......
   refclk {

      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 92 -->

Свойства CLK 24 МГц:

<!-- source: CN V2.7 p26; unit 93 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| pinctrl-names | Мультиплексирование вывода refclk | Согласно аппаратной схеме. Поскольку переопределяются свойства RK628 выше, добавьте также ссылку rk628_reset |
| pinctrl-0 | Мультиплексирование вывода refclk | Согласно аппаратной схеме. Поскольку переопределяются свойства RK628 выше, добавьте также ссылку rk628_reset |
| assigned-clocks | Ссылка на тактовый сигнал RK628 | Согласно аппаратной схеме |
| assigned-clock-rates | Частота сигнала, назначенного RK628 (Hz) | <24000000> |
| clocks | Список дескрипторов тактовых сигналов | Согласно аппаратной схеме |
| clock-names | Имя тактового сигнала | "soc_24M" |

<!-- source: CN V2.7 p26; unit 94 -->

#### 5.2.3 Выбор входных и выходных модулей

<!-- source: CN V2.7 p26; unit 95 -->

В узле RK628 DTS задайте свойства требуемых входов/выходов типа boolean или соответствующие узлы. Параметры функций задаются внутри узла модуля:

<!-- source: CN V2.7 p26; unit 96 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   rk628-dsi-out {
      ......
   };
   ......
};
```

<!-- source: CN V2.7 p26; unit 97 -->

Для RGB → DSI свойство "rk628-rgb-in;" выбирает вход RGB, а узел "rk628-dsi-out" — выход DSI. Входы Misc: RGB IN, BT1120 IN, HDMI IN; выходы: LVDS, GVI, DSI, HDMI. Подробности приведены в разделах настройки входных и выходных модулей.

<!-- source: CN V2.7 p27; unit 98 -->

#### 5.2.4 Настройка панели

<!-- source: CN V2.7 p27; unit 99 -->

В узле RK628 DTS задайте подсветку, питание, вывод сброса, временные параметры включения и отображения согласно спецификации панели. Для тракта HDMITX это не требуется:

<!-- source: CN V2.7 p27; unit 100 -->

```text
&i2c2_rk628 {
   ......

   panel-backlight = <&backlight>;
   panel-power-supply = <&vcc3v3_lcd0_n>;
   panel-enable-gpios = <&gpio2 RK_PC6 GPIO_ACTIVE_HIGH>;

   panel-reset-delay-ms = <10>;
   panel-enable-delay-ms = <10>;
   panel-prepare-delay-ms = <60>;
   panel-unprepare-delay-ms = <10>;
   panel-disable-delay-ms = <60>;
   panel-init-delay-ms = <60>;
   ......
   display-timings {
      src-timing {

         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;
         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;

         pixelclk-active = <0>;
      };

      dst-timing {
         clock-frequency = <148500000>;
         hactive = <1920>;
         vactive = <1080>;
         hfront-porch = <88>;
         hsync-len = <44>;
         hback-porch = <148>;
         vfront-porch = <4>;
         vsync-len = <5>;
         vback-porch = <36>;

         hsync-active = <1>;
         vsync-active = <1>;
         de-active = <0>;
         pixelclk-active = <0>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p28; unit 101 -->

Свойства панели:

<!-- source: CN V2.7 p28; unit 102 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| panel-enable-gpios | GPIO включения панели [необязательно] | Согласно аппаратной схеме |
| panel-reset-gpios | GPIO сброса панели [необязательно] | Согласно аппаратной схеме |
| panel-backlight | Подсветка панели [необязательно] | Согласно аппаратной схеме |
| panel-reset-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| panel-enable-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| panel-prepare-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| panel-unprepare-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| panel-disable-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| panel-init-delay-ms | Последовательность включения питания панели | См. спецификацию панели |
| src-timing | Узел временных параметров отображения от SoC к RK628 | Масштабирование относительно dst-timing отдельно по горизонтали и вертикали |
| dst-timing | Узел временных параметров панели | См. спецификацию панели |
| clock-frequency | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| hactive | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| vactive | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| hfront-porch | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| hback-porch | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| hsync-len | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| vfront-porch | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| vback-porch | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| vsync-len | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| hsync-active | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| vsync-active | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| de-active | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |
| pixelclk-active | Временные параметры отображения | См. спецификацию панели и фактическую настройку scaler |

<!-- source: CN V2.7 p28; unit 103 -->

При масштабировании между разными входным и выходным разрешениями задайте входные параметры в src-timing, а выходные — в dst-timing. Активная область и интервалы гашения должны масштабироваться с одинаковым коэффициентом:

<!-- source: CN V2.7 p29; unit 104 -->

```text
src: hactive / dst: hactive = src: hblanking / dst: hblanking
src: vactive / dst: vactive = src: vblanking / dst: vblanking
hblanking = hfront-porch + hback-porch + hsync-len

vblanking = vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 105 -->

Частота кадров до и после масштабирования также должна совпадать.

<!-- source: CN V2.7 p29; unit 106 -->

```text
src: clock-frequency / (htotal * vtotal) = dst: clock-frequency / (htotal *
vtotal)
htotal = hactive + hfront-porch + hback-porch + hsync-len

vtotal = vactive + vfront-porch + vback-porch + vsync-len
```

<!-- source: CN V2.7 p29; unit 107 -->

При одинаковом входном и выходном разрешении задайте одинаковые целевые временные параметры в src-timing и dst-timing.

<!-- source: CN V2.7 p29; unit 108 -->

Для двух панелей DSI одинакового разрешения или двух панелей LVDS одинакового разрешения значения clock-frequency, hactive, hfront-porch, hback-porch и hsync-len в src-timing и dst-timing нужно умножить на 2 относительно конфигурации одной панели.

<!-- source: CN V2.7 p29; unit 109 -->

#### 5.2.5 Комбинации трактов отображения

<!-- source: CN V2.7 p29; unit 110 -->

См. следующие примеры DTS. Подробности приведены в разделе комбинаций, поддерживаемых DTS.

<!-- source: CN V2.7 p29; unit 111 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2bt1120-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p29; unit 112 -->

#### 5.2.6 Настройка выходных сигналов

<!-- source: CN V2.7 p29; unit 113 -->

##### 5.2.6.1 Настройка GVI / LVDS / MIPI TX

<!-- source: CN V2.7 p29; unit 114 -->

1\. Регистры comb_tx для напряжения и предыскажения независимо настраивают 10 пар линий (tx0 ~ tx9). Соответствие интерфейсам:

<!-- source: CN V2.7 p30; unit 116 -->

| COMB_TX | GVI | LVDS / MIPI |
| --- | --- | --- |
| TX0 P/N | GVI_TX0 P/N | L/M0_TX0 P/N |
| TX1 P/N | GVI_TX1 P/N | L/M0_TX1 P/N |
| TX2 P/N | / | L/M0_TXCLK P/N |
| TX3 P/N | GVI_TX2 P/N | L/M0_TX2 P/N |
| TX4 P/N | GVI_TX3 P/N | L/M0_TX3 P/N |
| TX5 P/N | GVI_TX4 P/N | L/M1_TX0 P/N |
| TX6 P/N | GVI_TX5 P/N | L/M1_TX1 P/N |
| TX7 P/N | / | L/M1_TXCLK P/N |
| TX8 P/N | GVI_TX6 P/N | L/M1_TX2 P/N |
| TX9 P/N | GVI_TX7 P/N | L/M1_TX3 P/N |

<!-- source: CN V2.7 p30; unit 117 -->

2\. Для проверки сигнала записывайте регистры непосредственно. После перезагрузки настройки теряются; для постоянной конфигурации измените приведённый ниже патч.

<!-- source: CN V2.7 p30; unit 118 -->

```text
# 1. 电压缩放 N=0(75%), 1/2(100%), 3(125%) (通常无需调节)
# echo 0x90004 $val > /d/rk628/2-0050/registers/combtxphy

# $val:
#   tx0[Bit1:0], tx1[Bit3:2], tx2[Bit5:4], tx3[Bit7:6], tx4[Bit9:8]
#   tx5[Bit17:16], tx6[Bit19:18], tx7[Bit21:20], tx8[Bit23:22], tx9[Bit25:24]
# 以 1(100%) 为例:
echo 0x90004 0x01550155 > /d/rk628/2-0050/registers/combtxphy

# 2. 电压调节 N=0~7
# echo 0x90008 $val > /d/rk628/2-0050/registers/combtxphy
# $val:
#   tx0[Bit2:0], tx1[Bit5:3], tx2[Bit8:6], tx3[Bit11:9], tx4[Bit14:12]
#   tx5[Bit18:16], tx6[Bit21:19], tx7[Bit24:22], tx8[Bit27:25], tx9[Bit30:28]
# 以 3 档为例:
echo 0x90008 0x36db36db > /d/rk628/2-0050/registers/combtxphy


# 3. 预加重调节 N=0~9
# echo 0x9000c $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx0[Bit3:0], tx1[Bit7:4], tx2[Bit11:8], tx3[Bit15:12], tx4[Bit19:16]
# echo 0x90010 $val > /d/rk628/2-0050/registers/combtxphy
# $val: tx5[Bit3:0], tx6[Bit7:4], tx7[Bit11:8], tx8[Bit15:12], tx9[Bit19:16]
# 以 5 档为例:
echo 0x9000c 0x55555 > /d/rk628/2-0050/registers/combtxphy
echo 0x90010 0x55555 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p30; unit 119 -->

3\. Патч настройки выходного сигнала на примере GVI TX. Значения выбирайте по описанию выше.

<!-- source: CN V2.7 p30; unit 120 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,14 @@ static void rk628_combtxphy_gvi_power_on(struct rk628
*rk628)
      usleep_range(100, 200);

      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // amplitude scale
+     rk628_i2c_write(rk628, COMBTXPHY_CON1, 0x01550155);
+     // amplitude level
+     rk628_i2c_write(rk628, COMBTXPHY_CON2, 0x36db36db);
+     // emphasis level
+     rk628_i2c_write(rk628, COMBTXPHY_CON3, 0x00055555);
+     rk628_i2c_write(rk628, COMBTXPHY_CON4, 0x00055555);
 }


 void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p31; unit 121 -->

<!-- source: CN V2.7 p31; unit 122 -->

##### 5.2.6.2 Настройка HDMI TX

<!-- source: CN V2.7 p31; unit 123 -->

1\. Для проверки записывайте регистры непосредственно. Настройки не сохраняются после перезагрузки; для постоянной конфигурации измените патч ниже.

<!-- source: CN V2.7 p31; unit 124 -->

```text
# 1. 驱动强度调节
# echo 0x70388 $val > /d/rk628/2-0050/registers/hdmi

# $val: clk_driver_strength[Bit7:4], data_driver_strength[Bit3:0]
#      范围（强度从低到高）：0x0  ~ 0xF
# 以 0x8 为例:
echo 0x70388 0x88 > /d/rk628/2-0050/registers/hdmi

# 2. 预加重调节
# echo 0x7038c $val > /d/rk628/2-0050/registers/hdmi
# $val: pre_emphasis_strength[Bit6:4]
#      范围（强度从低到高）：0x0  ~ 0x7
#     clk_pre_driver_strength[Bit3:2], data_pre_driver_strength[Bit1:0]
#      范围（强度从低到高）：0x0  ~ 0x3
# 以 pre_emphasis_strength = 0x3, clk/data_pre_driver_strength = 0x3 为例:

echo 0x7038c 0x3f > /d/rk628/2-0050/registers/hdmi
```

<!-- source: CN V2.7 p31; unit 125 -->

2\. Патч настройки HDMI: пример разделения диапазона (74.25M, 165M] на (74.25M, 148.5M] и (148.5M, 165M].

<!-- source: CN V2.7 p31; unit 127 -->

{ верхняя граница частотного диапазона, предыскажение, нагрузочная способность }: значения выбирайте по описанию выше.

<!-- source: CN V2.7 p32; unit 128 -->

```text
diff --git a/drivers/misc/rk628/rk628_hdmitx.c b/drivers/misc/rk628/rk628_hdmitx.c
index f28b78a6b525..2120cf504ebe 100644

--- a/drivers/misc/rk628/rk628_hdmitx.c
+++ b/drivers/misc/rk628/rk628_hdmitx.c
@@ -231,6 +231,7 @@ static void rk628_hdmi_sys_power(struct rk628_hdmi *hdmi,
bool enable)
 static struct rk628_hdmi_phy_config rk628_hdmi_phy_config[] = {
      /* pixelclk pre-emp vlev */
      { 74250000, 0x3f, 0x88 },
+     { 148500000, 0x3f, 0x88 },
      { 165000000, 0x3f, 0x88 },
      { ~0UL,  0x00, 0x00 }
 };
```

<!-- source: CN V2.7 p32; unit 129 -->

##### 5.2.6.3 SSC (расширение спектра)

<!-- source: CN V2.7 p32; unit 130 -->

1\. Глобальная модуляция CPLL расширяет спектр выходного сигнала в тракте GVI TX.

<!-- source: CN V2.7 p32; unit 131 -->

```text
# echo 0xc000c $((val | 0xffff0000)) > /d/rk628/2-0050/registers/cru
# $val:
#   ssmod_spread[Bit12:8](Spread amplitude / 0.1%)

#   ssmod_divval[Bit7:4](Divider required to set the modulation frequency)
#   参数说明⻅下方描述
# 例 ssmod_spread = 3, ssmod_divval = 6 (推荐值):
echo 0xc000c 0xffff0360 > /d/rk628/2-0050/registers/cru
```

<!-- source: CN V2.7 p32; unit 132 -->

(1) ssmod_spread [Bit12:8]: глубина модуляции. Обычно не выше 5000 ppm, однако из-за сложности реальных условий определяющими являются измерения: измеренное значение не должно превышать 0.3%. Рекомендуемая настройка — 0.3%. То есть `spread = 3`.

<!-- source: CN V2.7 p32; unit 133 -->

(2) ssmod_divval [Bit7:4]: частота модуляции, определяющая скорость изменения частоты. Формула:

`f_mod = f_CLKSSCG / (128 × divval)`; `f_CLKSSCG = f_PFD = f_REF / refdiv`.

<!-- source: CN V2.7 p32; unit 134 -->

Здесь f_mod — частота модуляции 30–33 кГц; f_REF — опорная частота кварца; refdiv по умолчанию равен 1. Рекомендуется divval = 6, при котором f_mod = 31.25 кГц.

<!-- source: CN V2.7 p32; unit 135 -->

2\. Патч SSC на примере GVI TX; значения выбирайте по описанию выше.

<!-- source: CN V2.7 p32; unit 136 -->

```text
diff --git a/drivers/misc/rk628/rk628_combtxphy.c b/drivers/misc/rk628/rk628_combtxphy.c

index 3387d8bd73b9..70d7a5422a35 100644
--- a/drivers/misc/rk628/rk628_combtxphy.c
+++ b/drivers/misc/rk628/rk628_combtxphy.c
@@ -139,6 +139,9 @@ static void rk628_combtxphy_gvi_power_on(struct rk628 *rk628)
      usleep_range(100, 200);
      rk628_i2c_update_bits(rk628, COMBTXPHY_CON0,
                      SW_TX_IDLE_MASK, 0);
+
+     // ssmod
+     rk628_i2c_write(rk628, CRU_CPLL_CON3, 0xffff0360);
 }
void rk628_combtxphy_power_on(struct rk628 *rk628)
```

<!-- source: CN V2.7 p33; unit 137 -->

<!-- source: CN V2.7 p33; unit 138 -->

### 5.3 Настройка входных модулей

<!-- source: CN V2.7 p33; unit 139 -->

#### 5.3.1 Вход RGB

<!-- source: CN V2.7 p33; unit 140 -->

##### 5.3.1.1 Настройка входа RGB

<!-- source: CN V2.7 p33; unit 141 -->

1\. Добавьте логическое свойство "rk628-rgb-in;" в узел RK628 DTS:

<!-- source: CN V2.7 p33; unit 142 -->

```text
&i2c2_rk628 {
   ......

   rk628-rgb-in;
   ......
};
```

<!-- source: CN V2.7 p33; unit 143 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT используют общие выводы, поэтому эти четыре функции нельзя включить одновременно.

<!-- source: CN V2.7 p33; unit 144 -->

2\. Настройте выход RGB SoC. На RK3568 он использует DRM, а RK628 представлен виртуальной панелью:

<!-- source: CN V2.7 p33; unit 145 -->

```text
/ {
   panel@0 {
      compatible = "simple-panel";


      disp_timings3: display-timings {
         native-mode = <&rgb2dsi_timing>;
         rgb2dsi_timing: timing0 {
           clock-frequency = <148500000>;
           hactive = <1920>;
           vactive = <1080>;
           hfront-porch = <88>;
           hsync-len = <44>;
           hback-porch = <148>;
           vfront-porch = <4>;
           vsync-len = <5>;
           vback-porch = <36>;

           hsync-active = <1>;
           vsync-active = <1>;
           de-active = <0>;
           pixelclk-active = <0>;
         };
      };

      port {
         panel_in_rgb: endpoint {
           remote-endpoint = <&rgb_out_panel>;
         };
      };

   };
};
&route_rgb {
   status = "okay";


   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";


   ports {
      port@1 {
         reg = <1>;

         rgb_out_panel: endpoint {
           remote-endpoint = <&panel_in_rgb>;
         };
      };
   };c
};
```

<!-- source: CN V2.7 p34; unit 146 -->

<!-- source: CN V2.7 p34; unit 147 -->

Временные параметры "panel@0/display-timings/timing0" должны совпадать с "&i2c2_rk628/display-timings/src-timing".

<!-- source: CN V2.7 p34; unit 148 -->

#### 5.3.2 Вход BT1120

<!-- source: CN V2.7 p34; unit 149 -->

##### 5.3.2.1 Настройка входа BT1120

<!-- source: CN V2.7 p34; unit 150 -->

Следуйте настройке входа RGB, заменив логическое свойство "rk628-rgb-in;" на "rk628-bt1120-in;" в узле RK628 DTS:

<!-- source: CN V2.7 p34; unit 151 -->

```text
&i2c2_rk628 {
   ......

   rk628-bt1120-in;
   // bt1120-dual-edge;
   // bt1120-yc-swap;
   // bt1120-uv-swap;
   ......
};
```

<!-- source: CN V2.7 p34; unit 152 -->

Для BT1120 по обоим фронтам добавьте логическое свойство "bt1120-dual-edge;".

<!-- source: CN V2.7 p34; unit 153 -->

Свойства "bt1120-yc-swap" и "bt1120-uv-swap" изменяют интерпретацию порядка сигналов BT1120 на кабеле. Попробуйте их, если геометрия изображения правильная, но цвета нарушены.

<!-- source: CN V2.7 p34; unit 154 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT используют общие выводы и не могут работать одновременно.

<!-- source: CN V2.7 p35; unit 155 -->

#### 5.3.3 Вход HDMI

<!-- source: CN V2.7 p35; unit 156 -->

##### 5.3.3.1 Настройка входа HDMI

<!-- source: CN V2.7 p35; unit 157 -->

Вход HDMI может быть подключён непосредственно к SoC или через кабель HDMI.

<!-- source: CN V2.7 p35; unit 158 -->

##### 5.3.3.2 Прямое соединение с SoC

<!-- source: CN V2.7 p35; unit 159 -->

Конфигурация узла RK628 DTS:

<!-- source: CN V2.7 p35; unit 160 -->

```text
&i2c2_rk628 {
   ......
   rk628-hdmi-in;

   // src-mode-4k-yuv420;
   ......
};
```

<!-- source: CN V2.7 p35; unit 161 -->

При прямом соединении источник HDMI должен выдавать сигнал по умолчанию. RK628 не требуется вывод IO для обнаружения подключения источника; переключение разрешения не поддерживается. Драйвер обнаруживает входной HDMI-сигнал опросом.

<!-- source: CN V2.7 p35; unit 162 -->

Если источник выдаёт 4K YUV420 (force-bus-format = MEDIA_BUS_FMT_UYYVYY8_0_5X24 и force_timing задаёт 4K), добавьте логическое свойство "src-mode-4k-yuv420" в RK628: HDMIRX не может заранее определить, использует ли источник YUV420.

<!-- source: CN V2.7 p35; unit 163 -->

Принудительное задание разрешения источника HDMI SoC:

<!-- source: CN V2.7 p35; unit 164 -->

Для RK3568 настройте принудительный выход HDMI, указав временные параметры и bus-format:

<!-- source: CN V2.7 p35; unit 165 -->

```text
#include <dt-bindings/display/media-bus-format.h>

&hdmi {

   status = "okay";
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{
      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;

      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;
   };
};

&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};

&route_hdmi {
   status = "okay";

   /* for u-boot logo display */
   bridge = <&i2c2_rk628>;
   force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
   force-output;
   force_timing{

      clock-frequency = <594000000>;
      hactive = <3840>;
      vactive = <2160>;
      hback-porch = <296>;
      hfront-porch = <176>;
      vback-porch = <72>;
      vfront-porch = <8>;
      hsync-len = <88>;
      vsync-len = <10>;
      hsync-active = <1>;
      vsync-active = <1>;
      de-active = <0>;
      pixelclk-active = <0>;

   };
};
```

<!-- source: CN V2.7 p36; unit 166 -->

<!-- source: CN V2.7 p36; unit 167 -->

Узел "&route_hdmi" включается для вывода загрузочного логотипа ядра через HDMIRX. Его "force-output", "force-bus-format" и "force_timing" должны совпадать с узлом "hdmi".

<!-- source: CN V2.7 p36; unit 168 -->

При настройке force-bus-format включите в DTS заголовок <dt-bindings/display/media-bus-format.h>, содержащий определения форматов отображения.

<!-- source: CN V2.7 p36; unit 169 -->

Патч принудительного HDMI-выхода SoC

<!-- source: CN V2.7 p36; unit 170 -->

На платформах Rockchip для принудительного HDMI-выхода с заданным разрешением требуется соответствующий патч ниже. Сравните его с исходным кодом, чтобы проверить, не применён ли он ранее:

<!-- source: CN V2.7 p37; unit 171 -->

| Список патчей | commit message | Описание патча |
| --- | --- | --- |
| 0190-drm-bridge-dw-hdmi-qp-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: dw-hdmi-qp:<br>Support hdmi force<br>output | Добавьте, если отсутствует в драйвере HDMI TX ядра Rockchip 5.10 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-5-10.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Добавьте, если отсутствует в драйвере HDMI TX ядра Rockchip 5.10 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output-kernel-4-19.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Добавьте, если отсутствует в драйвере HDMI TX ядра Rockchip 4.19 |
| 0190-drm-bridge-synopsys-Support-hdmi-force-output.patch | drm/bridge: synopsys:<br>Support hdmi force<br>output | Добавьте, если отсутствует в драйвере HDMI TX ядра Rockchip 4.4 |
| 0189-drm-bridge-synopsys-dw-hdmi-Support-force-logo-displ.patch | drm/bridge: synopsys:<br>dw-hdmi: Support force<br>logo display | Добавьте, если отсутствует в драйвере HDMI TX ядра Rockchip 4.4 |

<!-- source: CN V2.7 p37; unit 172 -->

##### 5.3.3.3 Соединение кабелем HDMI

<!-- source: CN V2.7 p37; unit 173 -->

Конфигурация узла RK628 DTS:

<!-- source: CN V2.7 p37; unit 174 -->

```text
&i2c2_rk628 {
   ......
   interrupt-parent = <&gpio0>;

   interrupts = <20 IRQ_TYPE_LEVEL_HIGH>;
   plugin-det-gpios = <&gpio2 RK_PA4 GPIO_ACTIVE_LOW>;
   // hpd-output-inverted;
   rk628-hdmi-in;
   ......
};
```

<!-- source: CN V2.7 p37; unit 175 -->

При кабельном соединении RK628 обнаруживает подключение источника через IO, а также поддерживает смену разрешения и цветового формата. Задайте "plugin-det-gpios", "interrupt-parent" и "interrupts". Этот вывод обнаруживает источник HDMI со стороны RK628, а не RK628 со стороны HDMI; обычно обе стороны должны обнаруживать друг друга.

<!-- source: CN V2.7 p37; unit 176 -->

Логическое свойство "hpd-output-inverted" инвертирует описанный IO обнаружения подключения. Включите его, если схема инвертирует выходной уровень HPD. Программную инверсию обычно можно задать и через GPIO_ACTIVE_LOW / GPIO_ACTIVE_HIGH.

<!-- source: CN V2.7 p37; unit 177 -->

Для изменения разрешения HDMIRX в кабельном режиме задайте требуемое разрешение в src-timing, описанном в разделе настройки панели.

<!-- source: CN V2.7 p38; unit 178 -->

##### 5.3.3.4 Настройка аудио

<!-- source: CN V2.7 p38; unit 179 -->

При входе HDMI RK628 выводит аудио по I2S в роли master. Конфигурация звуковой карты DTS:

<!-- source: CN V2.7 p38; unit 180 -->

```text
rk628_dc: rk628-dc {
   compatible = "rockchip,dummy-codec";
   #sound-dai-cells = <0>;

};

&i2s0 {
   rockchip,capture-only;
   status = "okay";
};

/ {
   hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";

      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      dailink0_master: simple-audio-card,codec {
         sound-dai = <&rk628_dc>;
      };
   };
};
```

<!-- source: CN V2.7 p38; unit 181 -->

Когда I2S SoC работает как slave, драйвер ожидает появления тактового сигнала. Слишком долгое ожидание может вызвать сбой Android. Следующий патч изменяет тайм-аут:

<!-- source: CN V2.7 p38; unit 182 -->

```text
diff --git a/sound/soc/rockchip/rockchip_i2s.c b/sound/soc/rockchip/rockchip_i2s.c

index 9bc29fdd13c5..230c350c6765
--- a/sound/soc/rockchip/rockchip_i2s.c
+++ b/sound/soc/rockchip/rockchip_i2s.c
@@ -468,6 +468,9 @@ static int rockchip_i2s_trigger(struct snd_pcm_substream
*substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;

 }
diff --git a/sound/soc/rockchip/rockchip_i2s_tdm.c b/sound/soc/rockchip/rockchip_i2s_tdm.c
index b0c4ce01e2be..0602df42c309
--- a/sound/soc/rockchip/rockchip_i2s_tdm.c
+++ b/sound/soc/rockchip/rockchip_i2s_tdm.c
@@ -1776,6 +1776,9 @@ static int rockchip_i2s_tdm_trigger(struct

snd_pcm_substream *substream,
           ret = -EINVAL;
           break;
      }
+     if(substream->stream == SNDRV_PCM_STREAM_CAPTURE) {
+          substream->wait_time = msecs_to_jiffies(100);
+     }

      return ret;
 }
```

<!-- source: CN V2.7 p39; unit 183 -->

<!-- source: CN V2.7 p39; unit 184 -->

### 5.4 Настройка выходных модулей

<!-- source: CN V2.7 p39; unit 185 -->

#### 5.4.1 Выход RGB

<!-- source: CN V2.7 p39; unit 186 -->

##### 5.4.1.1 Настройка выхода RGB

<!-- source: CN V2.7 p39; unit 187 -->

Добавьте логическое свойство "rk628-rgb-out;" в узел RK628 DTS:

<!-- source: CN V2.7 p39; unit 188 -->

```text
&i2c2_rk628 {
   ......
   rk628-rgb-out;

   ......
};
```

<!-- source: CN V2.7 p39; unit 189 -->

RGB IN / RGB OUT / BT1120 IN / BT1120 OUT используют общие выводы и не могут работать одновременно.

<!-- source: CN V2.7 p39; unit 190 -->

#### 5.4.2 Выход BT1120

<!-- source: CN V2.7 p39; unit 191 -->

##### 5.4.2.1 Настройка выхода BT1120

<!-- source: CN V2.7 p39; unit 192 -->

Добавьте логическое свойство "rk628-bt1120-out;" в узел RK628 DTS:

<!-- source: CN V2.7 p39; unit 193 -->

```text
&i2c2_rk628 {
   ......
   rk628-bt1120-out;

   // bt1120-dual-edge;
   ......
};
```

<!-- source: CN V2.7 p39; unit 194 -->

Для работы BT1120 по обоим фронтам добавьте "bt1120-dual-edge;". RGB IN / RGB OUT / BT1120 IN / BT1120 OUT используют общие выводы и несовместимы при одновременном включении.

<!-- source: CN V2.7 p40; unit 195 -->

#### 5.4.3 Выход DSI

<!-- source: CN V2.7 p40; unit 196 -->

##### 5.4.3.1 Настройка выхода DSI

<!-- source: CN V2.7 p40; unit 197 -->

Добавьте узел "rk628-dsi-out" в узел RK628 DTS:

<!-- source: CN V2.7 p40; unit 198 -->

```text
&i2c2_rk628 {
   ......
   rk628-dsi-out {

      // rockchip,lane-mbps = <1100>;
      // rockchip,dual-channel;
      dsi,eotp;
      dsi,video-mode;
      // dsi,clk-non-continuous;
      dsi,format = "rgb888";
      dsi,lanes = <4>;
      status = "okay";

      rk628-panel {
         panel-init-sequence = [
           ......

           05 78 01 11
           05 78 01 29
         ];

         panel-exit-sequence = [
           05 00 01 28
           05 00 01 10
         ];
      };
   };
   ......
};
```

<!-- source: CN V2.7 p40; unit 199 -->

Свойства узла "rk628-dsi-out":

<!-- source: CN V2.7 p41; unit 200 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| rockchip,lane-mbps | Заданная полоса данных MIPI [необязательно] |  |
| rockchip,dual-channel | Один/два MIPI [необязательно] | По умолчанию один MIPI; свойство включает два MIPI |
| dsi,eotp | EOT PACKET [option] |  |
| dsi,video-mode | Video mode / Command mode [необязательно] | По умолчанию Command mode; свойство включает Video mode |
| dsi,clk-non-continuous | Непрерывное/прерывистое тактирование [необязательно] | По умолчанию непрерывное; свойство включает прерывистое тактирование |
| dsi,format | Формат данных DSI | "rgb888" / "rgb666" / "rgb666-packed"<br>/ "rgb565" |
| dsi,lanes | DSI lanes | При двух MIPI число линий задаётся как для одного MIPI |
| panel-init-sequence | Последовательность инициализации панели | Столбец 1: data type; 2: mdelays; 3: payload_lenth каждой команды; остальные столбцы: payload команды |
| panel-exit-sequence | Последовательность завершения работы панели | Как выше |

<!-- source: CN V2.7 p41; unit 201 -->

Распространённые типы данных

<!-- source: CN V2.7 p41; unit 202 -->

| Тип данных | Описание | Размер пакета |
| --- | --- | --- |
| 0x03 | Универсальная короткая запись WRITE без параметров | Короткий |
| 0x13 | Универсальная короткая запись WRITE с 1 параметром | Короткий |
| 0x23 | Универсальная короткая запись WRITE с 2 параметрами | Короткий |
| 0x29 | Универсальная длинная запись WRITE | Длинный |
| 0x05 | Короткая запись DCS WRITE без параметров | Короткий |
| 0x15 | Короткая запись DCS WRITE с 1 параметром | Короткий |

<!-- source: CN V2.7 p41; unit 203 -->

##### 5.4.3.2 Настройка выходного сигнала

<!-- source: CN V2.7 p41; unit 204 -->

См. Основная конфигурация драйвера → Настройка выходных сигналов → GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p42; unit 205 -->

#### 5.4.4 Выход LVDS

<!-- source: CN V2.7 p42; unit 206 -->

##### 5.4.4.1 Настройка выхода LVDS

<!-- source: CN V2.7 p42; unit 207 -->

Добавьте узел "rk628-lvds-out" в узел RK628 DTS:

<!-- source: CN V2.7 p42; unit 208 -->

```text
&i2c2_rk628 {
   ......
   rk628-lvds {

      bus-format = <MEDIA_BUS_FMT_RGB888_1X7X4_SPWG>;
      link-type = "single_link";
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p42; unit 209 -->

Свойства узла "rk628-lvds-out":

<!-- source: CN V2.7 p42; unit 210 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| bus-format | Формат шины | <MEDIA_BUS_FMT_RGB666_1X7X3_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_SPWG> /<br><MEDIA_BUS_FMT_RGB888_1X7X4_JEIDA> |
| link-type | Тип соединения | "single_link": один канал<br>"dual_link_odd_even_pixels": два канала; левый/правый передают нечётные/чётные пиксели<br>"dual_link_even_odd_pixels": два канала; левый/правый передают чётные/нечётные пиксели<br>"dual_link_left_right_pixels": два канала, левая/правая панели<br>"dual_link_right_left_pixels": два канала, правая/левая панели |

<!-- source: CN V2.7 p42; unit 211 -->

##### 5.4.4.2 Настройка выходного сигнала

<!-- source: CN V2.7 p42; unit 212 -->

См. Основная конфигурация драйвера → Настройка выходных сигналов → GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p42; unit 213 -->

#### 5.4.5 Выход GVI

<!-- source: CN V2.7 p42; unit 214 -->

##### 5.4.5.1 Настройка выхода GVI

<!-- source: CN V2.7 p42; unit 215 -->

Добавьте узел "rk628-gvi-out" в узел RK628 DTS:

<!-- source: CN V2.7 p43; unit 216 -->

```text
&i2c2_rk628 {
   ......
   rk628-gvi-out {

      bus-format = "rgb888";
      gvi,lanes = <8>;
      // rockchip,division-mode;
      // rockchip, gvi-frm-rst;
      status = "okay";
   };
   ......
};
```

<!-- source: CN V2.7 p43; unit 217 -->

Свойства узла "rk628-gvi-out":

<!-- source: CN V2.7 p43; unit 218 -->

| Свойство | Описание | Option Value |
| --- | --- | --- |
| bus-format | Формат шины | "rgb666" / "rgb888" / "rgb101010" /<br>"yuyv8" / "yuyv10" |
| gvi,lanes | Линии GVI | 1、2、4、8 |
| rockchip,division-mode | Одна секция / две секции<br>[необязательно] | По умолчанию one section; свойство включает two section |
| rockchip, gvi-frm-rst | Включить сброс GVI в начале кадра<br>[необязательно] | По умолчанию disabled; свойство задаёт enable |

<!-- source: CN V2.7 p43; unit 219 -->

##### 5.4.5.2 Изменение порядка линий

<!-- source: CN V2.7 p43; unit 220 -->

Если соседние пиксели регулярно меняются местами, настройте следующие регистры соответствия combtx lane и gvi_phy_datalane:

<!-- source: CN V2.7 p43; unit 221 -->

```text
# echo 0x80004 $val > /d/rk628/2-0050/registers/combtxphy
# $val(combtx_lane_n):

#   lane0[Bit2:0], lane1[Bit6:4], lane2[Bit10:8], lane3[Bit14:12]
#   lane4[Bit18:16], lane5[Bit22:20], lane6[Bit26:24], lane7[Bit30:28]
# 显示异常时可以优先考虑如下常用   val 值：
# 0x01234567 0x76543210 0x10325476 0x67452301 0x45670123 0x32107654 0x54761023
0x23016745
# 例：
echo 0x80004 0x01234567 > /d/rk628/2-0050/registers/combtxphy
```

<!-- source: CN V2.7 p43; unit 222 -->

Соответствующее место изменения в программном коде:

<!-- source: CN V2.7 p44; unit 223 -->

```text
diff --git a/drivers/misc/rk628/rk628_gvi.c b/drivers/misc/rk628/rk628_gvi.c
index fb41c2143bb5..ef47e58ad377 100644
--- a/drivers/misc/rk628/rk628_gvi.c

+++ b/drivers/misc/rk628/rk628_gvi.c
@@ -150,6 +150,8 @@ static void rk628_gvi_pre_enable(struct rk628 *rk628, struct
rk628_gvi *gvi)

      rk628_i2c_update_bits(rk628, GVI_SYS_CTRL1, SYS_CTRL1_COLOR_DEPTH_MASK,
                      SYS_CTRL1_COLOR_DEPTH(gvi->color_depth));
+
+     rk628_i2c_write(rk628, GVI_SYS_CTRL3, 0x01234567);
 }

 static void rk628_gvi_enable_color_bar(struct rk628 *rk628,
```

<!-- source: CN V2.7 p44; unit 224 -->

##### 5.4.5.3 Настройка сигнала и расширение спектра

<!-- source: CN V2.7 p44; unit 225 -->

См. Основная конфигурация драйвера → Настройка выходных сигналов → GVI / LVDS / MIPI TX.

<!-- source: CN V2.7 p44; unit 226 -->

Для SSC см. Основная конфигурация драйвера → Настройка выходных сигналов → SSC.

<!-- source: CN V2.7 p45; unit 227 -->

##### 5.4.5.4 Проверенные модели GVI для RK628F

<!-- source: CN V2.7 p46; unit 229 -->

| TCON | Модель | Производитель панели | Разрешение |
| --- | --- | --- | --- |
| IN8205A | M280DGJ-L30 | Innolux | 3840*2160 |
| IN8205A | M315DJJ | Innolux |  |
| Изначально IN8908A; в конце 2021 года заменён на IN8210 | S500DJ2-KS5 | Innolux |  |
| Изначально IN8908A; в конце 2021 года заменён на IN8210 | V500DJ2-KS5 | Innolux |  |
| SW0894A | LC860EQY-FJA5 | Xunshi (в исходнике: 巡视) |  |
|  | LC550EGE | LGDisplay |  |
| Hi3231V530 | HV550QUB-N8D | BOE |  |
| SW0894A | MZ860004-07 | ACT |  |
| SW0894A | 86S13DCX |  |  |
| TLi2461MC | ACT-MZ750004-07 |  |  |
| LP71517 |  |  |  |
| SW08006A | 848.2 |  |  |
| TLi2380EP | ist-ITV-016 | FunTV |  |
| SW08008 |  |  |  |
| 10301 | L22650USWL1 | Lenove |  |
| 10302 | HV860QUB-E1D |  |  |
| CSQ12-B0S | SG8561D03-1 |  |  |
| CSTU01-A0H | H750D4-BA080AA |  |  |
| CSTU01-A0W | SL(LX)-23 |  |  |
| KV7636-VPP | ST7461D02-6 |  |  |
| KV7626 |  |  |  |
| AUO-12417 |  |  |  |
| AUO-12415 | ICB-VN65 | HiteVision |  |
| NT71120MFG-001 |  |  |  |
| EK76603E | V650DK-KS5 |  |  |
| iLITEK-2326 |  |  |  |
| IN8205A |  |  |  |
| MST6M60FV | TN2A1FV4LCZZ |  |  |
|  | HS-86AW-L09PA |  |  |
|  | HV650QUB-F70 |  |  |
|  | CEJZ650L07Q1 | CSOT |  |
|  | MT5461D01-1 | CSOT |  |
|  | BOEI650WQ1 |  |  |
|  | UV650QUB-N90 |  |  |
|  | LC650EQQ-SMA5 |  |  |

<!-- source: CN V2.7 p47; unit 239 -->

#### 5.4.6 Выход HDMI

<!-- source: CN V2.7 p47; unit 240 -->

Для переключения между разрешениями RK628 Misc реализован как мост DRM:

<!-- source: CN V2.7 p47; unit 241 -->

![Оригинальный технический рисунок — EN V2.3, p37](/docs/rockchip-rk628-porting/assets/en-p37-X290.png)

*Оригинальный технический рисунок: EN V2.3, p37.*

<!-- source: CN V2.7 p47; unit 242 -->

##### 5.4.6.1 Настройка выхода HDMI

<!-- source: CN V2.7 p47; unit 243 -->

Добавьте логическое свойство "rk628-hdmi-out" в узел RK628 DTS и свяжите узлы "&rgb" и RK628 через "remote-endpoint":

<!-- source: CN V2.7 p47; unit 244 -->

```text
&i2c2_rk628 {
   pinctrl-names = "default";

   pinctrl-0 = <&rk628_reset &refclk_pins>;
   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clock-names = "soc_24M";
   clocks = <&pmucru CLK_WIFI>;

   rk628-rgb-in;
   rk628-hdmi-out;
   // mode-sync-pol = <0>;
   status = "okay";

   port {

      rgb_in_hdmi: endpoint {
         remote-endpoint = <&rgb_out_hdmi>;
      };
   };
};
&route_rgb {
   status = "disabled";

};

&rgb_in_vp2 {
   status = "okay";
};

&rgb {
   status = "okay";

   ports {
      port@1 {
         reg = <1>;


         rgb_out_hdmi: endpoint {
           remote-endpoint = <&rgb_in_hdmi>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p48; unit 245 -->

<!-- source: CN V2.7 p48; unit 246 -->

Разрешение и полярность HDMITX меняются согласно стандартным режимам, поэтому параметры панели не задаются. Для входа RGB/BT1120 настройте mode-sync-pol по фактическим hsync-active и vsync-active. Свойство одно, поэтому hsync-active и vsync-active должны совпадать. По умолчанию полярность равна 1, положительная. При искажениях изображения попробуйте добавить это свойство.

<!-- source: CN V2.7 p48; unit 247 -->

Тракт HDMITX требует общего источника тактирования, иначе возможны нарушения изображения. См. Основная конфигурация драйвера → Рабочая частота 24 МГц.

<!-- source: CN V2.7 p48; unit 248 -->

##### 5.4.6.2 Настройка выходного сигнала

<!-- source: CN V2.7 p48; unit 249 -->

См. Основная конфигурация драйвера → Настройка выходных сигналов → HDMI TX.

<!-- source: CN V2.7 p48; unit 250 -->

##### 5.4.6.3 Настройка аудио

<!-- source: CN V2.7 p48; unit 251 -->

```text
&i2s0 {
   rockchip,playback-only;

   status = "oaky";
};

/ {
   rk628_sound: rk628-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,mclk-fs = <128>;
      simple-audio-card,name = "rockchip,hdmi-rk628";
      status = "oaky";
      simple-audio-card,cpu {
         sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
         sound-dai = <&i2c2_rk628>;
      };

   };
}
```

<!-- source: CN V2.7 p49; unit 252 -->

<!-- source: CN V2.7 p49; unit 253 -->

### 5.5 Комбинации, поддерживаемые DTS

<!-- source: CN V2.7 p49; unit 254 -->

#### 5.5.1 Преобразование RGB → DSI

<!-- source: CN V2.7 p49; unit 255 -->

Пример DTS:

<!-- source: CN V2.7 p49; unit 256 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 257 -->

Эти DTS расширяют rk3568-evb.dtsi поддержкой RK628 RGB → MIPI DSI. Сопоставьте код с описаниями входных и выходных модулей для определения различий.

<!-- source: CN V2.7 p49; unit 258 -->

Вывод RGB SoC с заданными временными параметрами описан в разделе Настройка входных модулей → Вход RGB.

<!-- source: CN V2.7 p49; unit 259 -->

#### 5.5.2 Преобразование RGB → LVDS

<!-- source: CN V2.7 p49; unit 260 -->

Пример DTS:

<!-- source: CN V2.7 p49; unit 261 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 262 -->

Исходник описывает эти DTS как добавление RK628 RGB → MIPI DSI к rk3568-evb.dtsi, хотя раздел посвящён LVDS. rk3568-evb-rk628-rgb2lvds-ddr4-v10.dts задаёт одноканальный LVDS, rk3568-evb-rk628-rgb2lvds-dual-ddr4-v10.dts — двухканальный. Сопоставьте код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p49; unit 263 -->

Вывод RGB SoC с заданными временными параметрами описан в разделе Настройка входных модулей → Вход RGB.

<!-- source: CN V2.7 p49; unit 264 -->

#### 5.5.3 Преобразование RGB → GVI

<!-- source: CN V2.7 p49; unit 265 -->

Пример DTS:

<!-- source: CN V2.7 p49; unit 266 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p49; unit 267 -->

Эти DTS расширяют rk3568-evb.dtsi преобразованием RK628 RGB → GVI. Сравните код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p49; unit 268 -->

Вывод RGB SoC с заданными временными параметрами описан в разделе Настройка входных модулей → Вход RGB.

<!-- source: CN V2.7 p50; unit 269 -->

#### 5.5.4 Преобразование RGB → HDMI

<!-- source: CN V2.7 p50; unit 270 -->

Пример DTS:

<!-- source: CN V2.7 p50; unit 271 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2hdmi-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 272 -->

Эти DTS расширяют rk3568-evb.dtsi преобразованием RK628 RGB → HDMI. Сравните код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p50; unit 273 -->

HDMITX определяет поддерживаемые панелью разрешения и выбирает целевое; временные параметры RGB-выхода SoC поэтому не заданы в DTS.

<!-- source: CN V2.7 p50; unit 274 -->

#### 5.5.5 Преобразование HDMI → DSI

<!-- source: CN V2.7 p50; unit 275 -->

Пример DTS:

<!-- source: CN V2.7 p50; unit 276 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 277 -->

Эти DTS расширяют rk3568-evb.dtsi преобразованием RK628 HDMI → DSI при прямом соединении с SoC. rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts задаёт один MIPI DSI, rk3568-evb-rk628-hdmi2dsi-dual-ddr4-v10.dts — два. Сравните код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p50; unit 278 -->

Для вывода SoC с заданными временными параметрами исходник упоминает RGB, но ссылается на раздел Вход HDMI. Эта терминология требует проверки.

<!-- source: CN V2.7 p50; unit 279 -->

#### 5.5.6 Преобразование HDMI → LVDS

<!-- source: CN V2.7 p50; unit 280 -->

Пример DTS:

<!-- source: CN V2.7 p50; unit 281 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts

arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts
```

<!-- source: CN V2.7 p50; unit 282 -->

Эти DTS расширяют rk3568-evb.dtsi преобразованием RK628 HDMI → LVDS при прямом соединении с SoC. rk3568-evb-rk628-hdmi2lvds-ddr4-v10.dts задаёт одноканальный LVDS, rk3568-evb-rk628-hdmi2lvds-dual-ddr4-v10.dts — двухканальный. Сравните код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p50; unit 283 -->

Для вывода SoC с заданными временными параметрами исходник упоминает RGB, но ссылается на раздел Вход HDMI. Эта терминология требует проверки.

<!-- source: CN V2.7 p50; unit 284 -->

#### 5.5.7 Преобразование HDMI → GVI

<!-- source: CN V2.7 p50; unit 285 -->

Пример DTS:

<!-- source: CN V2.7 p51; unit 286 -->

```text
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-ddr4-v10.dtsi
arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2gvi-ddr4-v10.dts
```

<!-- source: CN V2.7 p51; unit 287 -->

Эти DTS расширяют rk3568-evb.dtsi преобразованием RK628 HDMI → GVI при прямом соединении с SoC. Сравните код с описаниями входных и выходных модулей.

<!-- source: CN V2.7 p51; unit 288 -->

Для вывода SoC с заданными временными параметрами исходник упоминает RGB, но ссылается на раздел Вход HDMI. Эта терминология требует проверки.

<!-- source: CN V2.7 p51; unit 289 -->

### 5.6 Основные команды отладки

<!-- source: CN V2.7 p51; unit 290 -->

#### 5.6.1 Узлы отладки регистров

<!-- source: CN V2.7 p51; unit 291 -->

В /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p51; unit 292 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/regmap/
0-001c        2-0050-dsi1 2-0050-hdmirx 4-0050-gpio0
0-0020        2-0050-efuse 4-0050-adapter 4-0050-gpio1

0-0020-rk817-codec 2-0050-gpio0 4-0050-combrxphy 4-0050-gpio2
2-0050-adapter 2-0050-gpio1 4-0050-combtxphy 4-0050-gpio3
2-0050-combrxphy 2-0050-gpio2 4-0050-cru 4-0050-grf
2-0050-combtxphy 2-0050-gpio3 4-0050-csi 4-0050-gvi
2-0050-cru    2-0050-grf 4-0050-dsi0  4-0050-hdmi
2-0050-csi    2-0050-gvi 4-0050-dsi1  4-0050-hdmirx
2-0050-dsi0   2-0050-hdmi 4-0050-efuse ......
```

<!-- source: CN V2.7 p51; unit 293 -->

Или в /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p51; unit 294 -->

```text
rk3568_t:/ # ls /sys/kernel/debug/rk628/2-0050/registers/
adapter combrxphy combtxphy cru csi dsi0 dsi1 efuse gpio0 gpio1 gpio2
gpio3 grf gvi hdmi hdmirx
```

<!-- source: CN V2.7 p51; unit 295 -->

Здесь 2 — номер шины I2C, 0050 — адрес ведомого RK628.

<!-- source: CN V2.7 p51; unit 296 -->

1\. Чтение регистров на примере GRF:

<!-- source: CN V2.7 p51; unit 297 -->

В /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p51; unit 298 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers
000: 06000088
004: ffffffff

008: 00000000
00c: 00000000
010: 00000001
014: 00000000
018: 00050000
01c: 002c0898
020: 00c00840
......

rk3568_t:/ # cat /sys/kernel/debug/regmap/2-0050-grf/registers | grep 200:
200: 20230321
```

<!-- source: CN V2.7 p52; unit 299 -->

Или в /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p52; unit 300 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf
rk628_grf:


0x0000: 06000298 ffffffff 00000000 00000001
0x0010: 00000001 00000000 000404b6 002804ba
0x0020: 0046047e 000a079e 00140794 0046047e
0x0030: 00140794 00000004 00000000 00000000
0x0040: 04380004 80000000 00000000 00000000
0x0050: 80000000 00000000 10000000 00000000
0x0060: 000002ea 01f0ea00 00000000 01f00000
0x0070: 0000155c 00005602 00000000 00000000
0x0080: 00006000 00000000 00000000 00000000
......

rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/registers/grf | grep 0200:

0x0200: 20230321 00000000 00000000 00000000
```

<!-- source: CN V2.7 p52; unit 301 -->

2\. Запись регистров на примере GRF:

<!-- source: CN V2.7 p52; unit 302 -->

В /sys/kernel/debug/regmap:

<!-- source: CN V2.7 p52; unit 303 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/regmap/2-0050-
grf/registers
```

<!-- source: CN V2.7 p52; unit 304 -->

Или в /sys/kernel/debug/rk628/x-xxxx/registers:

<!-- source: CN V2.7 p52; unit 305 -->

```text
rk3568_t:/ # echo 0x010 0x02000200 > /sys/kernel/debug/rk628/2-0050/registers/grf
```

<!-- source: CN V2.7 p52; unit 306 -->

#### 5.6.2 Команды самопроверки

<!-- source: CN V2.7 p52; unit 307 -->

Если изображение неправильное, следующая команда помогает определить, относится ли проблема ко входу или выходу RK628. Доступно только для RK628F/H.

<!-- source: CN V2.7 p52; unit 308 -->

```text
# Enable horizontal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar


# Enable vertical color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/scaler_color_bar
```

<!-- source: CN V2.7 p52; unit 309 -->

Если цветовые полосы scaler отображаются правильно, проверяйте выход основного SoC, вход RK628 и настройки RK628 Process. Иначе сначала проверяйте выход RK628; затем полосами отдельных интерфейсов ниже проверяйте контроллер, PHY и панель. Если полосы модулей работают, но scaler color всё ещё не отображается, продолжайте проверять вход RK628.

<!-- source: CN V2.7 p52; unit 310 -->

Следующие команды проверяют контроллер выхода, его PHY и путь до панели:

<!-- source: CN V2.7 p52; unit 311 -->

1\. Цветовые полосы HDMITX

<!-- source: CN V2.7 p53; unit 312 -->

```text
# Enable normal color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar


# Enable special color bar
rk3568_t:/ # echo 2 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Enable black color bar
rk3568_t:/ # echo 3 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar

# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/hdmitx_color_bar
```

<!-- source: CN V2.7 p53; unit 313 -->

2\. Цветовые полосы DSI

<!-- source: CN V2.7 p53; unit 314 -->

```text
# Enable dsi color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar


# Disable dsi color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/dsi_color_bar
```

<!-- source: CN V2.7 p53; unit 315 -->

3\. Цветовые полосы GVI

<!-- source: CN V2.7 p53; unit 316 -->

```text
# Enable color bar
rk3568_t:/ # echo 1 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar


# Disable color bar
rk3568_t:/ # echo 0 > /sys/kernel/debug/rk628/2-0050/gvi_color_bar
```

<!-- source: CN V2.7 p53; unit 317 -->

#### 5.6.3 Отладка RGB IN (только RK628F/H)

<!-- source: CN V2.7 p53; unit 318 -->

Следующая команда показывает фактически принятое RGB IN разрешение, позволяя проверить работу RGB RX на RK628F/H:

<!-- source: CN V2.7 p53; unit 319 -->

```text
rk3568_t:/ # cat /sys/kernel/debug/rk628/2-0050/rgb_resolution
1080x1920 pclk:131967000
```

<!-- source: CN V2.7 p53; unit 320 -->

### 5.7 Типовые проблемы отображения

<!-- source: CN V2.7 p53; unit 321 -->

#### 5.7.1 Узел regmap не создан

<!-- source: CN V2.7 p53; unit 322 -->

Проверьте журналы на ошибки RK628, мешающие успешному probe, например:

<!-- source: CN V2.7 p53; unit 323 -->

```text
rk3568_t:/ # dmesg | grep rk628
[  0.294331] rk628 2-0050: the driver version is 0.1.0 of RK628-F/B/G

[  0.294426] rk628 2-0050: failed to request enable GPIO: -16
```

<!-- source: CN V2.7 p54; unit 324 -->

#### 5.7.2 Ошибка связи I2C

<!-- source: CN V2.7 p54; unit 325 -->

Такие журналы указывают на ошибки I2C RK628, из-за которых модули не регистрируются. Проверьте последовательность питания RK628, опорные 24 МГц (раздел типовых требований) и IOMUX соответствующих выводов.

<!-- source: CN V2.7 p54; unit 326 -->

```text
[  0.960609] rk628 1-0050: failed to access register: -6
```

<!-- source: CN V2.7 p54; unit 327 -->

#### 5.7.3 Изображение DSI/GVI присутствует, но искажено

<!-- source: CN V2.7 p54; unit 328 -->

Попробуйте изменить полярности интервалов гашения в src-timing DTS. Это применимо к DSI и GVI.

<!-- source: CN V2.7 p54; unit 329 -->

Например:

<!-- source: CN V2.7 p54; unit 330 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -347,8 +347,8 @@ src-timing {

                       vfront-porch = <15>;
                       hsync-len = <2>;
                       vsync-len = <2>;
-                      hsync-active = <0>;
-                      vsync-active = <0>;
+                      hsync-active = <1>;
+                      vsync-active = <1>;
                       de-active = <0>;
                       pixelclk-active = <0>;
```

<!-- source: CN V2.7 p54; unit 331 -->

#### 5.7.4 DSI не показывает после увеличения clock-frequency

<!-- source: CN V2.7 p54; unit 332 -->

Для повышения частоты обновления обычно увеличивают clock-frequency, например:

<!-- source: CN V2.7 p54; unit 333 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -338,7 +338,7 @@ rk628-panel {


           display-timings {
                 src-timing {
-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
@@ -354,7 +354,7 @@ src-timing {
                 };

                 dst-timing {

-                      clock-frequency = <132000000>;
+                      clock-frequency = <148500000>;
                       hactive = <1080>;
                       vactive = <1920>;
                       hback-porch = <30>;
```

<!-- source: CN V2.7 p55; unit 334 -->

Повышение CLK может вызвать мерцание или отсутствие изображения. В таком случае попробуйте изменить скорость линий:

<!-- source: CN V2.7 p55; unit 335 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-rgb2dsi-ddr4-v10.dts
@@ -57,6 +57,7 @@ &i2c2_rk628 {


           rk628-rgb-in;
           rk628-dsi-out {
+                rockchip,lane-mbps = <1000>;
                 //rockchip,dual-channel;
                 dsi,eotp;
                 dsi,video-mode;
```

<!-- source: CN V2.7 p55; unit 336 -->

#### 5.7.5 Смещение изображения

<!-- source: CN V2.7 p55; unit 337 -->

Например, при входе HDMI и смещённом изображении на выходе измените параметры гашения панели согласно направлению смещения: hfront-porch/hback-porch/hsync-len и vfront-porch/vback-porch/vsync-len в src-timing/dst-timing DTS. Выходной clock-frequency должен совпадать с входным HDMI, например 148500000 с обеих сторон.

<!-- source: CN V2.7 p55; unit 338 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3568-evb-rk628-hdmi2dsi-ddr4-v10.dts
@@ -314,7 +314,7 @@ src-timing {

                 hfront-porch = <60>;
                 vback-porch = <10>;
                 vfront-porch = <10>;
-                hsync-len = <20>;
+                hsync-len = <40>;
                 vsync-len = <10>;
                 hsync-active = <1>;
                 vsync-active = <1>;
```

<!-- source: CN V2.7 p55; unit 339 -->

#### 5.7.6 Управление GPIO RK628

<!-- source: CN V2.7 p55; unit 340 -->

В нужном месте вызывайте интерфейс GPIO, включив заголовки rk628_pinctrl.h и rk628_gpio.h. Он задаёт IOMUX, направление и уровень. Следующий пример переводит I2S_D2_M0 в GPIO и устанавливает высокий уровень:

<!-- source: CN V2.7 p55; unit 341 -->

```text
#include "rk628_pinctrl.h"
#include "rk628_gpio.h"


rk628_misc_gpio_direction_output(rk628, GPIO0_A6, 1);
```

<!-- source: CN V2.7 p55; unit 342 -->

Для восстановления исходной функции вызовите:

<!-- source: CN V2.7 p55; unit 343 -->

```text
rk628_misc_pinctrl_set_mux(rk628, GPIO0_A6, I2SM0D2);
```

<!-- source: CN V2.7 p56; unit 344 -->

## 6. Media

<!-- source: CN V2.7 p56; unit 345 -->

### 6.1 Обзор драйвера

<!-- source: CN V2.7 p56; unit 346 -->

![Оригинальный технический рисунок — EN V2.3, p46](/docs/rockchip-rk628-porting/assets/en-p46-X330.png)

*Оригинальный технический рисунок: EN V2.3, p46.*

<!-- source: CN V2.7 p56; unit 347 -->

Media — код драйвера тракта HDMI IN RK628. RK628 используется как устройство типа камеры для реализации показанных выше функций.

<!-- source: CN V2.7 p56; unit 348 -->

#### 6.1.1 Улучшения RK628F/H относительно RK628D

<!-- source: CN V2.7 p56; unit 349 -->

Драйвер media в основном соединяет HDMI2CSI, HDMI2DSI или HDMI2BT1120 с ведущей SoC. Основные улучшения RK628F/H относительно RK628D в этой области:

<!-- source: CN V2.7 p56; unit 350 -->

```text
主要改进点
```

<!-- source: CN V2.7 p56; unit 351 -->

Модуль

<!-- source: CN V2.7 p56; unit 352 -->

Поддерживает HDMI2.0 и вход RGB 4K60.

<!-- source: CN V2.7 p56; unit 353 -->

HDMIRX поддерживает дополнительные частотные точки.

<!-- source: CN V2.7 p56; unit 354 -->

Поддерживает режим DVI с более быстрым и устойчивым захватом синхронизации.

<!-- source: CN V2.7 p56; unit 355 -->

```text
解决了不同图像格式输入，格式转换下采样引入的色偏问题
增加一路  MIPI-CSI，双 MIPI-CSI 支持 4K60 输出
```

<!-- source: CN V2.7 p56; unit 356 -->

MIPI-CSI

<!-- source: CN V2.7 p56; unit 357 -->

В CSC добавлена матрица для более гибкого преобразования цветового пространства изображения.

<!-- source: CN V2.7 p56; unit 358 -->

#### 6.1.2 Структура каталогов драйвера

<!-- source: CN V2.7 p56; unit 359 -->

Код драйвера RK628 media зависит от версии ядра. До kernel-5.10 используется пакет rk628_for-all; для kernel-5.10 — kernel_5.10_rk628_media_patch.

<!-- source: CN V2.7 p56; unit 360 -->

Для ядер до kernel-5.10 структура каталогов следующая:

<!-- source: CN V2.7 p56; unit 361 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c

├── rk628_dsi.h
├── rk628_gpio.h
├── rk628_grf.h
├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_pinctrl.c
├── rk628_pinctrl.h
├── rk628_post_process.c
├── rk628_post_process.h

└── rk628_v4l2_controls.h
```

<!-- source: CN V2.7 p57; unit 362 -->

<!-- source: CN V2.7 p57; unit 363 -->

Для kernel-5.10 каталог драйвера следующий:

<!-- source: CN V2.7 p57; unit 364 -->

```text
drivers/media/i2c/rk628
├── Makefile

├── rk628_bt1120_v4l2.c
├── rk628.c
├── rk628_combrxphy.c
├── rk628_combrxphy.h
├── rk628_combtxphy.c
├── rk628_combtxphy.h
├── rk628_cru.c
├── rk628_cru.h
├── rk628_csi.c
├── rk628_csi.h
├── rk628_csi_v4l2.c
├── rk628_dsi.c
├── rk628_dsi.h

├── rk628.h
├── rk628_hdmirx.c
├── rk628_hdmirx.h
├── rk628_mipi_dphy.c
├── rk628_mipi_dphy.h
├── rk628_post_process.c
└── rk628_post_process.h
```

<!-- source: CN V2.7 p57; unit 365 -->

Основные файлы драйвера и области применения:

<!-- source: CN V2.7 p57; unit 366 -->

rk628_csi.c: HDMI2CSI для CameraHal1 и сторонних SoC.

<!-- source: CN V2.7 p57; unit 367 -->

rk628_csi_v4l2.c: HDMI2CSI / HDMI2DSI для платформ V4L2, например CameraHal3 и TV input.

<!-- source: CN V2.7 p57; unit 368 -->

rk628_bt1120_v4l2.c: HDMI2BT1120 для платформ V4L2, например CameraHal3.

<!-- source: CN V2.7 p58; unit 369 -->

#### 6.1.3 Перенос драйвера

<!-- source: CN V2.7 p58; unit 370 -->

См. раздел переноса драйвера → тракт HDMI IN (drivers/media/i2c/rk628).

<!-- source: CN V2.7 p58; unit 371 -->

### 6.2 Видеоподсистема HDMI IN

<!-- source: CN V2.7 p58; unit 372 -->

Для HDMI IN video RK628 моделируется как камера MIPI SoC. Подсистема camera или TV принимает видео для вывода в APK. Для HDMI IN добавлены горячее подключение и автоматическая адаптация разрешения.

<!-- source: CN V2.7 p58; unit 373 -->

Android9/10/11 использует cameraHAL3. См. Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal3_CN.pdf в RKDocs/common/camera/hdmi-in SDK.

<!-- source: CN V2.7 p58; unit 374 -->

Android12/13 использует cameraHAL3/TVinput. См. следующий документ в RKDocs/common/camera/hdmi-in SDK:

<!-- source: CN V2.7 p58; unit 375 -->

Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN

<!-- source: CN V2.7 p58; unit 376 -->

#### 6.2.1 Порядок работы APK HDMI IN

<!-- source: CN V2.7 p58; unit 377 -->

Общий порядок работы APK показан ниже:

<!-- source: CN V2.7 p59; unit 378 -->

![Оригинальный технический рисунок — EN V2.3, p49](/docs/rockchip-rk628-porting/assets/en-p49-X343.png)

*Оригинальный технический рисунок: EN V2.3, p49.*

<!-- source: CN V2.7 p59; unit 379 -->

Для kernel-4.19 или kernel-4.4 (Android 9/10/11) предпросмотр можно открыть непосредственно через rkCamera2.

<!-- source: CN V2.7 p59; unit 380 -->

Для kernel-5.10 (Android 12/13) необходимо различать подсистемы camera и TV. См.:

<!-- source: CN V2.7 p59; unit 381 -->

Rockchip_Developer_Guide_Android12+_HDMI_IN_Bridge_CN

<!-- source: CN V2.7 p60; unit 382 -->

#### 6.2.2 Архитектура драйвера RK628

<!-- source: CN V2.7 p60; unit 383 -->

Особого внимания требуют три части драйвера: инициализация, обработка прерывания горячего подключения и обработка прерывания смены разрешения. Схемы приведены ниже:

<!-- source: CN V2.7 p60; unit 384 -->

![Оригинальный технический рисунок — EN V2.3, p51](/docs/rockchip-rk628-porting/assets/en-p51-X351.png)

*Оригинальный технический рисунок: EN V2.3, p51.*

<!-- source: CN V2.7 p60; unit 385 -->

![Оригинальный технический рисунок — EN V2.3, p50](/docs/rockchip-rk628-porting/assets/en-p50-X348.png)

*Оригинальный технический рисунок: EN V2.3, p50.*

<!-- source: CN V2.7 p61; unit 386 -->

![Оригинальный технический рисунок — EN V2.3, p52](/docs/rockchip-rk628-porting/assets/en-p52-X354.png)

*Оригинальный технический рисунок: EN V2.3, p52.*

<!-- source: CN V2.7 p61; unit 387 -->

### 6.3 Настройка DTS

<!-- source: CN V2.7 p61; unit 388 -->

#### 6.3.1 Настройка узла RK628

<!-- source: CN V2.7 p61; unit 389 -->

```text
&i2c5 {
   status = "okay";


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio2>;
      interrupts = <RK_PC4 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PC6 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_LOW>;

      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <0>;
         dev-idx-r = <1>;
         combine-idx = <0>;
         pixel-offset = <0>;

         dev-num = <2>;
      };

      port {
         hdmiin_out0: endpoint {
           remote-endpoint = <&hdmi_mipi0_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p62; unit 390 -->

<!-- source: CN V2.7 p62; unit 391 -->

reg: адрес I2C. Типичный 7-битный адрес RK628 — 0x50. При нескольких RK628 адрес можно менять через GPIO RK628; см. связь SoC–RK628 по I2C.

<!-- source: CN V2.7 p62; unit 392 -->

compatible:

<!-- source: CN V2.7 p62; unit 393 -->

compatible = "rockchip,rk628-csi" соответствует rk628_csi.c; compatible = "rockchip,rk628-csi-v4l2" — rk628_csi_v4l2.c; compatible = "rockchip,rk628-bt1120-v4l2" — rk628_bt1120_v4l2.c.

<!-- source: CN V2.7 p62; unit 394 -->

interrupt-parent/interrupts: контакт GPIO, соединённый с прерыванием RK628.

<!-- source: CN V2.7 p62; unit 395 -->

enable-gpios: GPIO управления питанием RK628; при постоянном питании можно не задавать.

<!-- source: CN V2.7 p62; unit 396 -->

reset-gpios: GPIO управления сбросом RK628.

<!-- source: CN V2.7 p62; unit 397 -->

hpd-output-inverted: инверсия выхода HPD. Включите, если аппаратная схема инвертирует уровень HPD.

<!-- source: CN V2.7 p62; unit 398 -->

![Оригинальный технический рисунок — EN V2.3, p54](/docs/rockchip-rk628-porting/assets/en-p54-X361.png)

*Оригинальный технический рисунок: EN V2.3, p54.*

<!-- source: CN V2.7 p63; unit 399 -->

plugin-det-gpios: GPIO обнаружения подключения HDMI. Проверьте инверсию уровня в схеме и правильно задайте активный уровень.

<!-- source: CN V2.7 p63; unit 400 -->

![Оригинальный технический рисунок — EN V2.3, p54](/docs/rockchip-rk628-porting/assets/en-p54-X362.png)

*Оригинальный технический рисунок: EN V2.3, p54.*

<!-- source: CN V2.7 p63; unit 401 -->

power-gpios: GPIO питания домена MIPI RX ведущей Rockchip; при постоянном питании можно не задавать.

<!-- source: CN V2.7 p63; unit 402 -->

hdcp-enable: включение HDCP.

<!-- source: CN V2.7 p63; unit 403 -->

continues-clk: выбор непрерывного или прерывистого тактового сигнала выхода MIPI CSI.

<!-- source: CN V2.7 p63; unit 404 -->

multi-dev-info: требуется для 4K60 через два MIPI (только RK628F/H). В оригинале указаны RK3588/RK3562/RK3576 и ядра 5.10 или новее.

<!-- source: CN V2.7 p63; unit 405 -->

#### 6.3.2 Тракты приёма изображения

<!-- source: CN V2.7 p63; unit 406 -->

Разрабатывайте преобразователь RK628 как устройство типа камеры с драйвером V4L2, аналогично сенсору камеры. Настройка тракта данных соответствует MIPI SoC Sensor. Три типичных варианта:

<!-- source: CN V2.7 p63; unit 407 -->

RK628 → HDMI2CSI → SoC

<!-- source: CN V2.7 p63; unit 408 -->

RK628 → HDMI2DSI → SoC

<!-- source: CN V2.7 p63; unit 409 -->

RK628 → HDMI2BT1120 → SoC

<!-- source: CN V2.7 p63; unit 410 -->

#### 6.3.3 Тракт HDMI2CSI

<!-- source: CN V2.7 p63; unit 411 -->

##### 6.3.3.1 RK628D

<!-- source: CN V2.7 p63; unit 412 -->

Пример RK3288 + CSI_V4L2: настройка тракта rk628 + isp1.

<!-- source: CN V2.7 p63; unit 413 -->

```text
&rk628_csi {
   status = "okay";
   /*

   * If the hpd output level is inverted on the circuit,
   * the following configuration needs to be enabled.
   */
   /* hpd-output-inverted; */
   plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
   power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
   rockchip,camera-module-index = <0>;
   rockchip,camera-module-facing = "back";
   rockchip,camera-module-name = "RK628-CSI";

   rockchip,camera-module-lens-name = "NC";

   port {
      hdmiin_out0: endpoint {
         remote-endpoint = <&mipi_in>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&mipi_phy_rx0 {
   status = "okay";


   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out0>;

            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_rx_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp_mipi_in>;

         };
      };
   };
};

&rkisp1 {
   status = "okay";
   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx_out>;
      };
   };
};

&isp_mmu {

   status = "okay";
};
```

<!-- source: CN V2.7 p64; unit 414 -->

<!-- source: CN V2.7 p65; unit 415 -->

<!-- source: CN V2.7 p65; unit 416 -->

Пример RK3568 + CSI_V4L2: настройка тракта rk628 + isp2:

<!-- source: CN V2.7 p65; unit 417 -->

```text
&i2c2 {
   status = "okay";

   pinctrl-names = "default";
   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};


&csi2_dphy_hw {
   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_in: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;

         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_in>;
         };
      };
   };
};

&rkisp {

   status = "okay";
};

&rkisp_mmu {
   status = "okay";
};

&rkisp_vir0 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp0_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&csidphy0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p66; unit 418 -->

<!-- source: CN V2.7 p66; unit 419 -->

Настройка тракта rk628 + vicap для RK3568:

<!-- source: CN V2.7 p66; unit 420 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;

      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";

      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&csi2_dphy_hw {

   status = "okay";
};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_in: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi_csi2_input>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_csi2 {
   status = "okay";

   ports {

      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_input: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&csidphy0_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         mipi_csi2_output: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&cif_mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";

};

&rkcif_mipi_lvds {
   status = "okay";

   port {
      cif_mipi_in: endpoint {
         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};


&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p67; unit 421 -->

<!-- source: CN V2.7 p68; unit 422 -->

<!-- source: CN V2.7 p68; unit 423 -->

##### 6.3.3.2 RK628F/H

<!-- source: CN V2.7 p68; unit 424 -->

Настройка DTS соединения RK628F/H с SoC в основном аналогична RK628D; используйте соответствующий пример.

<!-- source: CN V2.7 p68; unit 425 -->

RK628F/H поддерживает два MIPI. В этом абзаце перечислены только ведущие RK3588/RK3562. Следующий пример двух MIPI RK3588 соединяет CSI0/CSI1 RK628F/H с CSI0/CSI1 RK3588 через vicap.

<!-- source: CN V2.7 p68; unit 426 -->

```text
&csi2_dphy0 {
   status = "okay";
   ports {
      #address-cells = <1>;

      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi_mipi2_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&hdmiin_out1>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&mipi2_csi2_input>;
         };
      };
   };
};


&csi2_dphy0_hw {
   status = "okay";
};

&csi2_dphy1_hw {
   status = "okay";
};

&i2c3 {
   status = "okay";
   clock-frequency = <400000>;


   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;


      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";


      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
            remote-endpoint = <&hdmi_mipi2_in>;
            data-lanes = <1 2 3 4>;

         };
      };
   };
};

&mipi_dcphy0 {
   status = "okay";
};

&mipi_dcphy1 {
   status = "okay";
};


&mipi2_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi2_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy0_out>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         mipi2_csi2_output: endpoint@0 {
            reg = <0>;

            remote-endpoint = <&cif_mipi_in2>;
         };
      };
   };
};


&rkcif {
   status = "okay";
};

&rkcif_mipi_lvds2 {
   status = "okay";

   port {
      cif_mipi_in2: endpoint {
         remote-endpoint = <&mipi2_csi2_output>;
      };
   };

};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p69; unit 427 -->

<!-- source: CN V2.7 p70; unit 428 -->

<!-- source: CN V2.7 p71; unit 429 -->

<!-- source: CN V2.7 p71; unit 430 -->

#### 6.3.4 Преобразование HDMI2DSI

<!-- source: CN V2.7 p71; unit 431 -->

##### 6.3.4.1 RK628D

<!-- source: CN V2.7 p71; unit 432 -->

При HDMI-to-MIPI-CSI на RK628D преобразование цветового пространства или повышение/понижение дискретизации может слегка менять цветовые детали. Альтернатива — HDMI-to-MIPI-DSI: хост принимает RGB888 напрямую, а приложение преобразует формат библиотекой rgb2yuv. Учитывайте:

<!-- source: CN V2.7 p71; unit 433 -->

Максимальное разрешение: 1080P60.

<!-- source: CN V2.7 p71; unit 434 -->

AP с поддержкой приёма MIPI DSI: RK1109, RK1126, RK3566, RK3568, RK3588, RK3562 и RK3576 (обозначения оригинала сохранены).

<!-- source: CN V2.7 p71; unit 435 -->

Ранние AP, например RK3288, RK3326, RK3368 и RK3399, не поддерживают приём MIPI DSI.

<!-- source: CN V2.7 p71; unit 436 -->

Код CSI и DSI совместим; различие задаётся compatible в DTS:

<!-- source: CN V2.7 p71; unit 437 -->

CSI: compatible = "rockchip,rk628-csi-v4l2";

<!-- source: CN V2.7 p71; unit 438 -->

DSI: compatible = "rockchip,rk628-dsi-v4l2";

<!-- source: CN V2.7 p71; unit 439 -->

Пример RK3568:

<!-- source: CN V2.7 p71; unit 440 -->

```text
&i2c2 {
   status = "okay";
   pinctrl-names = "default";

   pinctrl-0 = <&i2c2m1_xfer>;

   rk628_csi: rk628_csi@32 {
      compatible = "rockchip,rk628-dsi-v4l2";
      reg = <0x50>;

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_csi2 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_input: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&csidphy_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         mipi_csi2_output: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&cif_mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };
   };
};

&rkcif {
   status = "okay";
};


&rkcif_mipi_lvds {
   status = "okay";
   port {
      cif_mipi_in: endpoint {

         remote-endpoint = <&mipi_csi2_output>;
         data-lanes = <1 2 3 4>;
      };
   };
};

&rkcif_mmu {
   status = "okay";
};

&csi2_dphy_hw {
   status = "okay";

};

&csi2_dphy0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;
      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@0 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };
      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         csidphy_out: endpoint@0 {

           reg = <0>;
           remote-endpoint = <&mipi_csi2_input>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p72; unit 441 -->

<!-- source: CN V2.7 p73; unit 442 -->

<!-- source: CN V2.7 p73; unit 443 -->

Для ведущего RK3568 со старым кодом CIF требуется следующий коммит для приёма RGB888:

<!-- source: CN V2.7 p73; unit 444 -->

Драйверы RK3588 kernel-5.10 поддерживают RGB888 по умолчанию.

<!-- source: CN V2.7 p73; unit 445 -->

```text
From e925e385a41a857e8e50020b5df9a2d41b166d83 Mon Sep 17 00:00:00 2001
From: Zefa Chen <zefa.chen@rock-chips.com>
Date: Thu, 02 Sep 2021 15:07:13 +0800

Subject: [PATCH] media: rockchip: cif fix errors in rgb24 data format
Signed-off-by: Zefa Chen <zefa.chen@rock-chips.com>
Change-Id: I0766997860f06dc25e604c2ea8425049a987fdc5

---

diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c
index 6c0aa7d..36bd2c9 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1785,13 +1785,11 @@
     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */

-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       channel->virtual_width = ALIGN(channel->width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW && fmt->csi_fmt_val !=
CSI_WRDDR_TYPE_RAW8)
-         channel->virtual_width = ALIGN(channel->width * 2, 8);
-      else
-         channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
+      channel->virtual_width = ALIGN(channel->width * fmt->bpp[0] / 8, 8);
    }


    if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
@@ -3240,7 +3238,8 @@

       if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
          (dev->active_sensor->mbus.type == V4L2_MBUS_CSI2 ||
-         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2)) {
+         dev->active_sensor->mbus.type == V4L2_MBUS_CCP2) &&
+         fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
          bpl = ALIGN(width * fmt->raw_bpp / 8, 256);
       } else {
          bpp = rkcif_align_bits_per_pixel(stream, fmt, i);
@@ -4659,13 +4658,11 @@

     * needs aligned with :ALIGN(bits_per_pixel * width * 2, 8), to optimize
reading and
     * writing of ddr, aliged with 256
     */
-   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact) {
+   if (fmt->fmt_type == CIF_FMT_TYPE_RAW && stream->is_compact &&
+      fmt->csi_fmt_val != CSI_WRDDR_TYPE_RGB888) {
       *crop_vwidth = ALIGN(raw_width * fmt->raw_bpp / 8, 256);
    } else {
-      if (fmt->fmt_type == CIF_FMT_TYPE_RAW)
-         *crop_vwidth = ALIGN(raw_width * 2, 8);
-      else
-         *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);

+      *crop_vwidth = ALIGN(raw_width * fmt->bpp[0] / 8, 8);
    }
if (channel->fmt_val == CSI_WRDDR_TYPE_RGB888)
```

<!-- source: CN V2.7 p74; unit 446 -->

<!-- source: CN V2.7 p75; unit 447 -->

<!-- source: CN V2.7 p75; unit 448 -->

rk628-dsi по умолчанию выводит command mode; приём CIF также должен использовать command mode. Изменения:

<!-- source: CN V2.7 p75; unit 449 -->

```text
diff --git a/drivers/media/platform/rockchip/cif/capture.c b/drivers/media/platform/rockchip/cif/capture.c

index 36bd2c99c707..fc4181daed2c 100644
--- a/drivers/media/platform/rockchip/cif/capture.c
+++ b/drivers/media/platform/rockchip/cif/capture.c
@@ -1753,7 +1753,7 @@ static int rkcif_csi_channel_init(struct rkcif_stream
*stream,

      channel->fmt_val = stream->cif_fmt_out->csi_fmt_val;

-     channel->cmd_mode_en = 0; /* default use DSI Video Mode */
+     channel->cmd_mode_en = 1; /* default use DSI Video Mode */

      if (stream->crop_enable) {
           channel->crop_en = 1;
```

<!-- source: CN V2.7 p75; unit 450 -->

Подключение к подсистеме camera

<!-- source: CN V2.7 p75; unit 451 -->

Ведущие RK356X могут использовать только camera, которая не передаёт RGB напрямую на дисплей. Добавьте библиотеку rgb2yuv.

<!-- source: CN V2.7 p75; unit 452 -->

Добавьте следующую библиотеку rgb2yuv в CameraHal. Для SDK Android 11-R9 примените rk356x_HAL3_support_rgb2yuv_patch.rar напрямую.

<!-- source: CN V2.7 p75; unit 453 -->

Для R10 или R11 сначала внесите следующее изменение в hardware/rockchip/camera, затем примените указанный патч.

<!-- source: CN V2.7 p75; unit 454 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,

MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,
+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,

0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p76; unit 455 -->

<!-- source: CN V2.7 p76; unit 456 -->

Этот патч применим только к RK3568+ANDROID11.

<!-- source: CN V2.7 p76; unit 457 -->

Подключение к подсистеме TV

<!-- source: CN V2.7 p76; unit 458 -->

С RK3588 или RK3576 тракт HDMI-to-DSI может использовать TV для прямого вывода RGB888 без библиотеки rgb2yuv. См. адаптацию APK ниже.

<!-- source: CN V2.7 p76; unit 459 -->

##### 6.3.4.2 RK628F/H

<!-- source: CN V2.7 p76; unit 460 -->

RK628F/H устраняет отклонения цвета RK628D, вызванные преобразованием/понижением дискретизации разных входных форматов.

<!-- source: CN V2.7 p76; unit 461 -->

Для приложений с высокими требованиями к качеству RK628F/H может выводить RGB888 через DSI. Ведущие вроде RK3588 принимают RGB888 и выводят через TV без преобразования цвета, сохраняя качество согласно оригиналу. RK628F/H имеет два MIPI-DSI и поддерживает подключение к RK3588 через два MIPI.

<!-- source: CN V2.7 p76; unit 462 -->

Пример RK3588 + RK628F/H с двумя MIPI:

<!-- source: CN V2.7 p76; unit 463 -->

Достаточно изменить compatible на значение DSI.

<!-- source: CN V2.7 p76; unit 464 -->

```text
......
&i2c3 {

   status = "okay";
   clock-frequency = <400000>;
   rk628_csi: rk628_csi@50 {
      reg = <0x50>;

      compatible = "rockchip,rk628-dsi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;
      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;

      rockchip,camera-module-index = <0>;

      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;
         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {

         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
......
```

<!-- source: CN V2.7 p77; unit 465 -->

<!-- source: CN V2.7 p77; unit 466 -->

#### 6.3.5 Преобразование HDMI2BT1120

<!-- source: CN V2.7 p77; unit 467 -->

Настройка HDMI2BT1120 в основном одинакова для RK628D и RK628F/H, поэтому повторно не описывается.

<!-- source: CN V2.7 p77; unit 468 -->

Пример RK3568 + BT1120_V4L2:

<!-- source: CN V2.7 p77; unit 469 -->

```text
&i2c4 {
   pinctrl-names = "default";
   pinctrl-0 = <&i2c4m1_xfer>;

   clock-frequency = <400000>;
   status = "okay";

   rk628_bt1120: rk628_bt1120@50 {
      compatible = "rockchip,rk628-bt1120-v4l2";
      reg = <0x50>;
      status = "disabled";
      pinctrl-names = "default";
      pinctrl-0 = <&cif_dvp_clk &cif_dvp_bus16 &cif_dvp_bus8>;
      interrupt-parent = <&gpio2>;
      interrupts = <15 IRQ_TYPE_LEVEL_HIGH>;

      enable-gpios = <&gpio2 RK_PC0 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio2 RK_PB0 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio1 RK_PA2 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-BT1120";
      rockchip,camera-module-lens-name = "NC";
      dual-edge = <1>;

      port {
         lt8619c_out: endpoint {
           remote-endpoint = <&cif_para_in>;

           bus-width = <16>;
           pclk-sample = <1>;
         };
      };
   };
};

&rkcif_dvp {
   status = "okay";

   port {
      /* Parallel bus endpoint */
      cif_para_in: endpoint {

         remote-endpoint = <&lt8619c_out>;
      };
   };
};

&rkcif {
   status = "okay";
};

&rkcif_mmu {
   status = "okay";
};
```

<!-- source: CN V2.7 p78; unit 470 -->

<!-- source: CN V2.7 p78; unit 471 -->

### 6.4 Включение HDCP

<!-- source: CN V2.7 p78; unit 472 -->

HDMIRX RK628 поддерживает HDCP1.4. По умолчанию HDCP отключён; при необходимости включите:

<!-- source: CN V2.7 p78; unit 473 -->

1\. Включите HDCP в узле RK628 DTS.

<!-- source: CN V2.7 p78; unit 474 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;

           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
+          hdcp-enable = <1>;
```

<!-- source: CN V2.7 p79; unit 475 -->

2\. Запишите ключ HDCP RX.

<!-- source: CN V2.7 p79; unit 476 -->

Ключи HDCP необходимо приобрести у ассоциации HDCP; Rockchip их не предоставляет. В оригинале различаются TX и "RK Key" и требуется "RK Key". Это обозначение противоречит заголовку RX и сохранено как вопрос к оригиналу, а не исправлено молча.

<!-- source: CN V2.7 p79; unit 477 -->

Получив исходный файл ключей, разделите их KeyConverter и преобразуйте в файлы .skf для записи; следуйте руководству инструмента.

<!-- source: CN V2.7 p79; unit 478 -->

Запишите .skf через RKDevInfoWriteTool, который шифрует ключ. См. руководство инструмента.

<!-- source: CN V2.7 p79; unit 479 -->

### 6.5 Включение scaler

<!-- source: CN V2.7 p79; unit 480 -->

Некоторые ведущие не принимают MIPI 4K, хотя HDMI IN RK628 принимает 4K. Для вывода CSI 1080P независимо от входного разрешения добавьте настройку DTS:

<!-- source: CN V2.7 p79; unit 481 -->

```text
           reset-gpios = <&gpio7 RK_PB4 GPIO_ACTIVE_LOW>;
           plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
           power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;

+          scaler-en = <1>;
```

<!-- source: CN V2.7 p79; unit 482 -->

### 6.6 CSI с двумя линиями

<!-- source: CN V2.7 p79; unit 483 -->

По умолчанию CSI использует 4 линии:

<!-- source: CN V2.7 p79; unit 484 -->

```text
csi->csi_lanes_in_use = USE_4_LANES;
```

<!-- source: CN V2.7 p79; unit 485 -->

Для 2 линий задайте csi->csi_lanes_in_use равным 2.

<!-- source: CN V2.7 p79; unit 486 -->

### 6.7 Непрерывный и прерывистый режимы MIPI

<!-- source: CN V2.7 p79; unit 487 -->

Для непрерывного режима MIPI настройте DTS:

<!-- source: CN V2.7 p79; unit 488 -->

```text
continues-clk = <1>;
```

<!-- source: CN V2.7 p79; unit 489 -->

### 6.8 Настройка двух MIPI (только RK628F/H)

<!-- source: CN V2.7 p79; unit 490 -->

Скорость MIPI DPHY ограничивает RK628F/H до 4K30 на одном интерфейсе MIPI. RK628F/H имеет два MIPI-CSI. С ведущими вроде RK3588/RK3562 с несколькими CSI-входами разделите 4K60 на левую и правую половины, передайте по двум четырёхлинейным MIPI-CSI и объедините в 4K60 на хосте.

<!-- source: CN V2.7 p79; unit 491 -->

По оригиналу ведущие вроде RK3588 объединяют изображения непосредственно в драйвере VI без дополнительной задержки и нагрузки. Это утверждение источника, а не измерение ArmSoM.

<!-- source: CN V2.7 p80; unit 492 -->

#### 6.8.1 Режим split двух MIPI

<!-- source: CN V2.7 p80; unit 493 -->

RK628F/H может внутри разделить изображение HDMIRX на левую и правую половины и передать каждую через отдельный CSI:

<!-- source: CN V2.7 p80; unit 494 -->

![Оригинальный технический рисунок — EN V2.3, p72](/docs/rockchip-rk628-porting/assets/en-p72-X413.png)

*Оригинальный технический рисунок: EN V2.3, p72.*

<!-- source: CN V2.7 p80; unit 495 -->

Это позволяет ведущим с несколькими MIPI, например RK3588, принимать 4K60 через два MIPI. Функциональная схема ниже.

<!-- source: CN V2.7 p80; unit 496 -->

![Оригинальный технический рисунок — EN V2.3, p72](/docs/rockchip-rk628-porting/assets/en-p72-X414.png)

*Оригинальный технический рисунок: EN V2.3, p72.*

<!-- source: CN V2.7 p80; unit 497 -->

#### 6.8.2 Настройка двух MIPI

<!-- source: CN V2.7 p80; unit 498 -->

Ниже настраиваются два MIPI RK628F/H с RK3588 для 4K60 HDMI-IN.

<!-- source: CN V2.7 p80; unit 499 -->

Отладка двух MIPI с Rockchip SoC описана в Rockchip_RK3588_HDMI_To_CSI_Dual_Mipi_Developer_Guide в RKDocs/common/camera/HAL3 SDK.

<!-- source: CN V2.7 p80; unit 500 -->

##### 6.8.2.1 Настройка RK628F/H

<!-- source: CN V2.7 p80; unit 501 -->

Драйвер RK628F/H поддерживает два MIPI и по умолчанию использует два CSI для 4K60 HDMI-IN. Поля multi-dev-info в DTS:

<!-- source: CN V2.7 p80; unit 502 -->

dev-idx-l: индекс MIPI для левой половины изображения.

<!-- source: CN V2.7 p80; unit 503 -->

dev-idx-r: индекс MIPI для правой половины изображения.

<!-- source: CN V2.7 p80; unit 504 -->

combine-idx: индекс, в который объединяются половины изображения; тракт DTS задаётся по этому индексу.

<!-- source: CN V2.7 p81; unit 505 -->

pixel-offset: смещение пикселей, по умолчанию 0.

<!-- source: CN V2.7 p81; unit 506 -->

dev-num: число объединяемых устройств MIPI.

<!-- source: CN V2.7 p81; unit 507 -->

Пример: CSI0/1 RK628F/H подключены к CSI0/1 RX RK3588:

<!-- source: CN V2.7 p81; unit 508 -->

```text
&i2c3 {
   status = "okay";

   clock-frequency = <400000>;

   rk628_csi: rk628_csi@50 {
      reg = <0x50>;
      compatible = "rockchip,rk628-csi-v4l2";
      status = "okay";
      power-domains = <&power RK3588_PD_VI>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_pin>;
      interrupt-parent = <&gpio1>;
      interrupts = <RK_PB2 IRQ_TYPE_LEVEL_HIGH>;
      enable-gpios = <&gpio1 RK_PA7 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio1 RK_PB1 GPIO_ACTIVE_HIGH>;

      plugin-det-gpios = <&gpio2 RK_PB6 GPIO_ACTIVE_LOW>;
      continues-clk = <1>;

      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "HDMI-MIPI2";
      rockchip,camera-module-lens-name = "RK628-CSI";

      multi-dev-info {
         dev-idx-l = <2>;
         dev-idx-r = <4>;
         combine-idx = <2>;

         pixel-offset = <0>;
         dev-num = <2>;
      };

      port {
         hdmiin_out1: endpoint {
           remote-endpoint = <&hdmi_mipi2_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};
```

<!-- source: CN V2.7 p81; unit 509 -->

##### 6.8.2.2 Требования к драйверу ведущей SoC

<!-- source: CN V2.7 p81; unit 510 -->

В оригинале поддержка двух MIPI указана для RK3588/RK3562/RK3576 и поколения kernel-5.10 и последующего кода. Требуется достаточно новый код ведущей SoC; оригинал рекомендует обновить SDK Android 12/13. Обновление только драйвера kernel-

<!-- source: CN V2.7 p81; unit 511 -->

5.10 RK628 может привести к ошибке сборки, если остальной SDK слишком стар для двух MIPI. Обновите SDK либо обратитесь к инженерам Rockchip через Redmine.

<!-- source: CN V2.7 p82; unit 512 -->

### 6.9 Возможности приёма разных микросхем

<!-- source: CN V2.7 p82; unit 513 -->

Максимальные возможности приёма зависят от производительности ISP/VICAP платформы. См. таблицу:

<!-- source: CN V2.7 p82; unit 514 -->

| Платформа SoC | Контроллер приёма | Максимальное разрешение |
| --- | --- | --- |
| RK3288/RK3326/RK3368 | isp | 1920x1080P60 |
| RK3399 | isp | 3840x2160P30 (нужен разгон isp) |
| RK3566/RK3568 | vicap/isp | 3840x2160P30 (при подключении ISP максимум 1080P60) |
| RK3588/RK3562/RK3576 | vicap | 3840x2160P60 (два MIPI) |

<!-- source: CN V2.7 p82; unit 515 -->

#### 6.9.1 Настройка повышения частоты ISP

<!-- source: CN V2.7 p82; unit 516 -->

Задайте PLL_NPLL RK3399 как 650M:

<!-- source: CN V2.7 p82; unit 517 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399-vop-clk-set.dtsi
@@ -148,7 +148,7 @@

                  <50000000>, <100000000>,
                  <75000000>, <75000000>,
                  <816000000>, <816000000>,
-                 <600000000>, <200000000>,
+                 <650000000>, <200000000>,
                  <800000000>, <150000000>,
                  <75000000>, <37500000>,
                  <300000000>, <100000000>,
```

<!-- source: CN V2.7 p82; unit 518 -->

Измените максимальную поддерживаемую частоту ISP RK3399 на 650M:

<!-- source: CN V2.7 p82; unit 519 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -757,7 +757,7 @@ static const unsigned int rk3368_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
 static const unsigned int rk3399_isp_clk_rate[] = {
-     300, 400, 600
+     300, 400, 650
 };

 static struct isp_irqs_data rk1808_isp_irqs[] = {
```

<!-- source: CN V2.7 p82; unit 520 -->

При периодических ошибках ISP RK3288 также можно попробовать повысить частоту ISP. Обычно достаточно оставить только максимальную частоту. Изменение предназначено только для диагностики.

<!-- source: CN V2.7 p83; unit 521 -->

```text
--- a/drivers/media/platform/rockchip/isp1/dev.c
+++ b/drivers/media/platform/rockchip/isp1/dev.c
@@ -849,7 +849,7 @@ static const unsigned int rk1808_isp_clk_rate[] = {


 /* isp clock adjustment table (MHz) */
static const unsigned int rk3288_isp_clk_rate[] = {
-     150, 384, 500, 594
+     594
 };
```

<!-- source: CN V2.7 p83; unit 522 -->

Настройте частоту ISP в драйвере преобразователя.

<!-- source: CN V2.7 p83; unit 523 -->

```text
#define RK628_CSI_PIXEL_RATE_HIGH 600000000
...


static int rk628_csi_set_fmt(struct v4l2_subdev *sd,
           struct v4l2_subdev_pad_config *cfg,
           struct v4l2_subdev_format *format)
{
...
      if ((mode->width == 3840) && (mode->height == 2160)) {
           v4l2_dbg(1, debug, sd,
                 "%s res wxh:%dx%d, link freq:%llu, pixrate:%u\n",
                 __func__, mode->width, mode->height,
                 link_freq_menu_items[1], RK628_CSI_PIXEL_RATE_HIGH);
           __v4l2_ctrl_s_ctrl(csi->link_freq, 1);
           __v4l2_ctrl_s_ctrl_int64(csi->pixel_rate,

                 RK628_CSI_PIXEL_RATE_HIGH);
      }
...
}
```

<!-- source: CN V2.7 p83; unit 524 -->

Драйвер ISP добавляет 25% запаса к заданной частоте, поэтому задайте подходящее RK628_CSI_PIXEL_RATE_HIGH в драйвере.

<!-- source: CN V2.7 p83; unit 525 -->

```text
drivers/media/platform/rockchip/isp1/dev.c

static int __isp_pipeline_s_isp_clk(struct rkisp1_pipeline *p)

{
...
      ctrl = v4l2_ctrl_find(sd->ctrl_handler, V4L2_CID_PIXEL_RATE);
      if (!ctrl) {
           v4l2_warn(sd, "No pixel rate control in subdev\n");
           return -EPIPE;
      }

      /* calculate data rate */
      data_rate = v4l2_ctrl_g_ctrl_int64(ctrl) *
              dev->isp_sdev.in_fmt.bus_width;
      data_rate >>= 3;
      do_div(data_rate, 1000 * 1000);


      /* increase 25% margin */
      data_rate += data_rate >> 2;
...
}
```

<!-- source: CN V2.7 p84; unit 526 -->

<!-- source: CN V2.7 p84; unit 527 -->

#### 6.9.2 Настройка памяти CMA для ISP

<!-- source: CN V2.7 p84; unit 528 -->

На некоторых платформах нагрузка системы может вызвать нехватку пропускной способности при HDMI IN, пропуски кадров или ошибки MIPI. Пример журнала:

<!-- source: CN V2.7 p84; unit 529 -->

```text
[ 228.999567] rkisp1: MIPI mis error: 0x00800000
[ 228.999925] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 228.999976] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:

CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000081] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000187] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
[ 229.000294] rkisp1: CIF_ISP_PIC_SIZE_ERROR (0x00000001)rkisp1:
CIF_ISP_PIC_SIZE_ERROR (0x00000001)
```

<!-- source: CN V2.7 p84; unit 530 -->

Повысьте частоту DDR. Если это не помогает, зарезервируйте память CMA для ISP:

<!-- source: CN V2.7 p84; unit 531 -->

Зарезервируйте 128MB CMA в rockchip_defconfig.

<!-- source: CN V2.7 p84; unit 532 -->

```text
CONFIG_CMA=y
CONFIG_CMA_SIZE_MBYTES=128
```

<!-- source: CN V2.7 p84; unit 533 -->

Отключите IOMMU ISP в DTS и используйте CMA.

<!-- source: CN V2.7 p84; unit 534 -->

```text
&isp_mmu {
      status = "disabled";

};
```

<!-- source: CN V2.7 p84; unit 535 -->

### 6.10 Настройка EDID

<!-- source: CN V2.7 p84; unit 536 -->

RK628 поддерживает настройку EDID. Драйвер оригинала объявляет распространённые разрешения:

<!-- source: CN V2.7 p84; unit 537 -->

3840x2160P60, 3840x2160P30, 1920x1080P60, 1920x1080P30, 1280x720P60, 720x576P50 и 720x480P60. Для изменения поддерживаемых разрешений отредактируйте EDID непосредственно в драйвере:

<!-- source: CN V2.7 p84; unit 538 -->

```text
static u8 rk628f_edid_init_data[] = {
   0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
   0x24, 0xD0, 0x8F, 0x62, 0x01, 0x00, 0x00, 0x00,

   0x2D, 0x21, 0x01, 0x03, 0x80, 0x78, 0x44, 0x78,
   0x0A, 0xCF, 0x74, 0xA3, 0x57, 0x4C, 0xB0, 0x23,
   0x09, 0x48, 0x4C, 0x21, 0x08, 0x00, 0x61, 0x40,
   0x01, 0x01, 0x81, 0x00, 0x95, 0x00, 0xA9, 0xC0,
   0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x08, 0xE8,
   0x00, 0x30, 0xF2, 0x70, 0x5A, 0x80, 0xB0, 0x58,
   0x8A, 0x00, 0xC4, 0x8E, 0x21, 0x00, 0x00, 0x1E,
   0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D, 0x40,
   0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42, 0x00,
   0x00, 0x1E, 0x00, 0x00, 0x00, 0xFC, 0x00, 0x49,
   0x46, 0x50, 0x20, 0x44, 0x69, 0x73, 0x70, 0x6C,

   0x61, 0x79, 0x0A, 0x20, 0x00, 0x00, 0x00, 0xFD,
   0x00, 0x3B, 0x46, 0x1F, 0x8C, 0x3C, 0x00, 0x0A,
   0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x01, 0xA8,

   0x02, 0x03, 0x39, 0xF2, 0x4D, 0x01, 0x03, 0x12,
   0x13, 0x84, 0x22, 0x1F, 0x90, 0x5D, 0x5E, 0x5F,
   0x60, 0x61, 0x23, 0x09, 0x07, 0x07, 0x83, 0x01,
   0x00, 0x00, 0x6D, 0x03, 0x0C, 0x00, 0x10, 0x00,
   0x00, 0x44, 0x20, 0x00, 0x60, 0x03, 0x02, 0x01,
   0x67, 0xD8, 0x5D, 0xC4, 0x01, 0x78, 0xC0, 0x00,
   0xE3, 0x05, 0x03, 0x01, 0xE4, 0x0F, 0x00, 0x18,
   0x00, 0x02, 0x3A, 0x80, 0x18, 0x71, 0x38, 0x2D,

   0x40, 0x58, 0x2C, 0x45, 0x00, 0xB9, 0xA8, 0x42,
   0x00, 0x00, 0x1E, 0x08, 0xE8, 0x00, 0x30, 0xF2,
   0x70, 0x5A, 0x80, 0xB0, 0x58, 0x8A, 0x00, 0xC4,
   0x8E, 0x21, 0x00, 0x00, 0x1E, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
   0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x93,
};
```

<!-- source: CN V2.7 p85; unit 539 -->

<!-- source: CN V2.7 p85; unit 540 -->

Оригинал рекомендует этот редактор EDID (историческая ссылка, актуальность загрузки не подтверждена): http://www.quantumdata.com/support/downloads/980/release_5_05/R_980mgr_5.05_Win32.msi

<!-- source: CN V2.7 p85; unit 541 -->

### 6.11 Настройка camera3_profiles.xml

<!-- source: CN V2.7 p85; unit 542 -->

Для предпросмотра через camera необходимо адаптировать camera3_profiles.xml и зарегистрировать камеру.

<!-- source: CN V2.7 p85; unit 543 -->

camera3_profiles.xml находится в каталоге SDK соответствующей микросхемы:

<!-- source: CN V2.7 p85; unit 544 -->

```text
hardware/rockchip/camera/etc/camera/camera3_profiles_rk3xxx.xml
```

<!-- source: CN V2.7 p85; unit 545 -->

Основные настройки приведены ниже. Подробнее см. настройку SoC Sensor.

<!-- source: CN V2.7 p85; unit 546 -->

name: должен совпадать с именем драйвера с учётом регистра.

<!-- source: CN V2.7 p85; unit 547 -->

moduleId: должен совпадать с index в DTS драйвера.

<!-- source: CN V2.7 p85; unit 548 -->

![Оригинальный технический рисунок — EN V2.3, p78](/docs/rockchip-rk628-porting/assets/en-p78-X436.png)

*Оригинальный технический рисунок: EN V2.3, p78.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
```

<!-- source: CN V2.7 p86; unit 549 -->

![Оригинальный технический рисунок — EN V2.3, p78](/docs/rockchip-rk628-porting/assets/en-p78-X437.png)

*Оригинальный технический рисунок: EN V2.3, p78.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
&rk628_csi {
    status = "okay";
    /*
     * If the hpd output level is inverted on the circuit,
     * the following configuration needs to be enabled.
     */
    /* hpd-output-inverted; */
    plugin-det-gpios = <&gpio0 13 GPIO_ACTIVE_HIGH>;
    power-gpios = <&gpio0 17 GPIO_ACTIVE_HIGH>;
    rockchip,camera-module-index = <0>;
    rockchip,camera-module-facing = "back";
    rockchip,camera-module-name = "RK628-CSI";
    rockchip,camera-module-lens-name = "NC";
```

<!-- source: CN V2.7 p86; unit 550 -->

scaler.availableStreamConfigurations/scaler.availableMinFrameDurations/scaler.availableStallDurations: правильно задайте поддерживаемые разрешения и минимальные межкадровые интервалы. При добавлении разрешения в драйвер добавьте соответствующие записи здесь.

<!-- source: CN V2.7 p86; unit 551 -->

![Оригинальный технический рисунок — EN V2.3, p79](/docs/rockchip-rk628-porting/assets/en-p79-X441.png)

*Оригинальный технический рисунок: EN V2.3, p79.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
<scaler.availableStreamConfigurations value="BLOB,3840x2160,OUTPUT,
    BLOB,1920x1080,OUTPUT,
    BLOB,1280x720,OUTPUT,
    BLOB,720x576,OUTPUT,
    BLOB,720x480,OUTPUT,
    YCbCr_420_888,3840x2160,OUTPUT,
    YCbCr_420_888,1920x1080,OUTPUT,
    YCbCr_420_888,1280x720,OUTPUT,
    YCbCr_420_888,720x576,OUTPUT,
    YCbCr_420_888,720x480,OUTPUT,
    IMPLEMENTATION_DEFINED,3840x2160,OUTPUT,
    IMPLEMENTATION_DEFINED,1920x1080,OUTPUT,
    IMPLEMENTATION_DEFINED,1280x720,OUTPUT,
    IMPLEMENTATION_DEFINED,720x576,OUTPUT,
    IMPLEMENTATION_DEFINED,720x480,OUTPUT" />
<scaler.availableMinFrameDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667,
    YCbCr_420_888,3840x2160,33333333,
    YCbCr_420_888,1920x1080,16666667,
    YCbCr_420_888,1280x720,16666667,
    YCbCr_420_888,720x576,20000000,
    YCbCr_420_888,720x480,16666667,
    IMPLEMENTATION_DEFINED,3840x2160,33333333,
    IMPLEMENTATION_DEFINED,1920x1080,16666667,
    IMPLEMENTATION_DEFINED,1280x720,16666667,
    IMPLEMENTATION_DEFINED,720x576,20000000,
    IMPLEMENTATION_DEFINED,720x480,16666667"/>
<scaler.availableStallDurations value="BLOB,3840x2160,33333333,
    BLOB,1920x1080,16666667,
    BLOB,1280x720,16666667,
    BLOB,720x576,20000000,
    BLOB,720x480,16666667"/>
```

<!-- source: CN V2.7 p87; unit 552 -->

sensor.orientation: поворот изображения; поддерживает 0, 90, 180 и 270.

<!-- source: CN V2.7 p87; unit 553 -->

![Оригинальный технический рисунок — EN V2.3, p79](/docs/rockchip-rk628-porting/assets/en-p79-X442.png)

*Оригинальный технический рисунок: EN V2.3, p79.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
<sensor.maxAnalogSensitivity value="2400"/>
<sensor.orientation value="0"/>
<sensor.profileHueSatMapDimensions value="0,0,0"/>
```

<!-- source: CN V2.7 p87; unit 554 -->

### 6.12 Адаптация APK HDMI IN

<!-- source: CN V2.7 p87; unit 555 -->

#### 6.12.1 Android 9/10/11

<!-- source: CN V2.7 p87; unit 556 -->

Android 9/10/11 использует kernel-4.4/kernel-4.19 и пакет патчей for-all. Доступна только cameraHAL3.

<!-- source: CN V2.7 p87; unit 557 -->

##### 6.12.1.1 Получение и сборка исходников APK

<!-- source: CN V2.7 p87; unit 558 -->

Исходники APK находятся в следующем каталоге SDK:

<!-- source: CN V2.7 p87; unit 559 -->

```text
RKDocs/common/hdmi-in/apk/rkCamera2_based_on_CameraHal3_V1.3.tar.gz
```

<!-- source: CN V2.7 p87; unit 560 -->

Скопируйте и распакуйте исходники в:

<!-- source: CN V2.7 p87; unit 561 -->

```text
packages/apps/
```

<!-- source: CN V2.7 p87; unit 562 -->

Для RK3288 измените device/rockchip/rk3288/ следующим образом для сборки rkCamera2:

<!-- source: CN V2.7 p87; unit 563 -->

```text
diff --git a/device.mk b/device.mk
index 6667b5c..96f08f1 100644

--- a/device.mk
+++ b/device.mk
@@ -17,7 +17,8 @@
 PRODUCT_PACKAGES += \
   memtrack.$(TARGET_BOARD_PLATFORM) \
   WallpaperPicker \
-  Launcher3
+  Launcher3 \
+  rkCamera2

 #$_rbox_$_modify_$_zhengyang: add displayd
 PRODUCT_PACKAGES += \
```

<!-- source: CN V2.7 p87; unit 564 -->

##### 6.12.1.2 Адаптация исходников APK

<!-- source: CN V2.7 p87; unit 565 -->

APK обращается к узлу RK628 через ioctl для получения состояния подключения и разрешения. Узел может различаться для isp1/isp2/vicap. Адаптируйте исходники APK к фактическому узлу; способ его определения см. в примерах команд отладки.

<!-- source: CN V2.7 p87; unit 566 -->

```text
rkCamera2/jni/native.cpp
```

<!-- source: CN V2.7 p88; unit 567 -->

![Оригинальный технический рисунок — EN V2.3, p81](/docs/rockchip-rk628-porting/assets/en-p81-X452.png)

*Оригинальный технический рисунок: EN V2.3, p81.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
static void openDevice(JNIEnv *env, jobject thiz)
{
    (void)*env;
    (void)thiz;

    char video_name[64];
    memset(video_name, 0, sizeof(video_name));
    strcat(video_name, "/dev/v4l-subdev2");

    camFd = open(video_name, O_RDWR);
    if (camFd < 0) {
        LOGE("open %s failed,erro=%s",video_name,strerror(errno));
    } else {
        LOGD("open %s success,fd=%d",video_name,camFd);
    }
}
```

<!-- source: CN V2.7 p88; unit 568 -->

Код получения состояния подключения и разрешения:

<!-- source: CN V2.7 p88; unit 569 -->

![Оригинальный технический рисунок — EN V2.3, p81](/docs/rockchip-rk628-porting/assets/en-p81-X453.png)

*Оригинальный технический рисунок: EN V2.3, p81.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
static void getDeviceFormat(int *format)
{
    struct v4l2_control control;
    memset(&control, 0, sizeof(struct v4l2_control));
    control.id = V4L2_CID_DV_RX_POWER_PRESENT;
    int err = ioctl(camFd, VIDIOC_G_CTRL, &control);
    if (err < 0) {
        LOGV("Set POWER_PRESENT failed ,%d(%s)", errno, strerror(errno));
    }

    unsigned int noSignalAndSync = 0;
    ioctl(camFd, VIDIOC_G_INPUT, &noSignalAndSync);
    LOGV("noSignalAndSync ? %s",noSignalAndSync?"YES":"NO");

    struct v4l2_dv_timings dv_timings;
    memset(&dv_timings, 0 ,sizeof(struct v4l2_dv_timings));
    err = ioctl(camFd, VIDIOC_SUBDEV_QUERY_DV_TIMINGS, &dv_timings);
    if (err < 0) {
        LOGV("Set VIDIOC_SUBDEV_QUERY_DV_TIMINGS failed ,%d(%s)", errno, strerror(errno));
    }

    format[0] = dv_timings.bt.width;
    format[1] = dv_timings.bt.height;
    format[2] = control.value && !noSignalAndSync;
}
```

<!-- source: CN V2.7 p88; unit 570 -->

Поскольку APK обращается к узлу устройства, оригинал предлагает проверить отключение SELinux командой getenforce. Это инструкция отладки оригинала, а не рекомендация по безопасности рабочей системы:

<!-- source: CN V2.7 p88; unit 571 -->

![Оригинальный технический рисунок — EN V2.3, p81](/docs/rockchip-rk628-porting/assets/en-p81-X454.png)

*Оригинальный технический рисунок: EN V2.3, p81.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
rk3288:/ # getenforce
Enforcing
rk3288:/ # setenforce 0
rk3288:/ #
rk3288:/ # getenforce
Permissive
```

<!-- source: CN V2.7 p89; unit 572 -->

##### 6.12.1.3 Подготовка к отладке APK

<!-- source: CN V2.7 p89; unit 573 -->

Сначала завершите отладку драйвера (см. соответствующий раздел). Затем проверьте регистрацию камеры в CameraHal следующей командой. При ошибке регистрации проверьте camera3_profiles.xml по разделу его настройки.

<!-- source: CN V2.7 p89; unit 574 -->

![Оригинальный технический рисунок — EN V2.3, p82](/docs/rockchip-rk628-porting/assets/en-p82-X457.png)

*Оригинальный технический рисунок: EN V2.3, p82.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
rk3288:/ #
rk3288:/ # dumpsys media.camera

== Service global info: ==

Number of camera devices: 1
Number of normal camera devices: 1
    Device 0 maps to "0"
Active Camera Clients:
[]
Allowed user IDs: 0

== Camera service events log (most recent at top): ==
  04-08 11:08:31 : USER_SWITCH previous allowed user IDs: <None>, current allowed user IDs: 0
  01-18 08:50:15 : ADD device 0, reason: (Device status changed from 0 to 1)
  01-18 08:50:15 : ADD device 0, reason: (Device added)
```

<!-- source: CN V2.7 p89; unit 575 -->

#### 6.12.2 Android 12+

<!-- source: CN V2.7 p89; unit 576 -->

Android 12/13 использует kernel-5.10 и соответствующий пакет патчей драйвера. Приложения используют camera либо TV (далее также TIF). Отладка описана в Rockchip_Android12+_HDMI_TO_MIPI_Developer_Guide.

<!-- source: CN V2.7 p89; unit 577 -->

Android14 использует kernel-6.1; драйвер включён в SDK. Оригинал рекомендует подсистему TV.

<!-- source: CN V2.7 p89; unit 578 -->

##### 6.12.2.1 Исходники APK

<!-- source: CN V2.7 p89; unit 579 -->

packages/apps/TV/partner_support/samples: служба данных источника TV, взаимодействующая через framework с HAL и APK предпросмотра. Это скрытая служба, запускаемая при загрузке; значок APK в launcher скрыт.

<!-- source: CN V2.7 p89; unit 580 -->

hardware/rockchip/tv_input: код TVHAL, обменивающийся с драйвером командами запуска/остановки потока, горячего подключения и смены разрешения.

<!-- source: CN V2.7 p89; unit 581 -->

hardware/rockchip/camera: код cameraHAL, реализующий получение потока, фотосъёмку и другие функции камеры.

<!-- source: CN V2.7 p89; unit 582 -->

vendor/rockchip/hardware/interfaces/hdmi: используется camera; отслеживает изменения разрешения и горячее подключение, взаимодействует с драйвером и APK.

<!-- source: CN V2.7 p89; unit 583 -->

packages/apps/rkCamera2: APK предпросмотра с двумя экранами. MainActivity по умолчанию использует TIF и взаимодействует со службой источника TV через framework. RockchipCamera2 использует Camera и стандартный Camera API для открытия cameraid узла MIPI. Значок приложения называется HdmiIn. Заказчики обычно заменяют его собственным APK предпросмотра.

<!-- source: CN V2.7 p89; unit 584 -->

В SDK по умолчанию HDMI IN отключён. Задайте следующее свойство для включения и сборки соответствующих модулей, включая указанные APK:

<!-- source: CN V2.7 p89; unit 585 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
```

<!-- source: CN V2.7 p89; unit 586 -->

Для camera включите:

<!-- source: CN V2.7 p90; unit 587 -->

```text
vim device/rockchip/rk3588/BoardConfig.mk
CAMERA_SUPPORT_HDMI := true
```

<!-- source: CN V2.7 p90; unit 588 -->

Если задан только CAMERA_SUPPORT_HDMI без BOARD_HDMI_IN_SUPPORT, для предпросмотра rkCamera2 через camera добавьте rkCamera2 в сборку и задайте persist.sys.hdmiinmode равным 2. Дополнительно см.:

<!-- source: CN V2.7 p90; unit 589 -->

Rockchip_Developer_Guide_HDMI_RX_CN

<!-- source: CN V2.7 p90; unit 590 -->

```text
PRODUCT_PACKAGES += \
   rkCamera2
```

<!-- source: CN V2.7 p90; unit 591 -->

##### 6.12.2.2 Предпросмотр APK

<!-- source: CN V2.7 p90; unit 592 -->

APK поддерживает предпросмотр тракта HDMI RX RK3588 либо HDMI-to-MIPI-CSI; выберите нужный тракт.

<!-- source: CN V2.7 p90; unit 593 -->

Для предпросмотра TIF выберите тракт MIPI-CSI2:

<!-- source: CN V2.7 p90; unit 594 -->

```text
setprop vendor.tvinput.hdmiin.type 1
```

<!-- source: CN V2.7 p90; unit 595 -->

Для предпросмотра camera откройте RockchipCamera2 и убедитесь, что CAMERA_SUPPORT_HDMI включён.

<!-- source: CN V2.7 p90; unit 596 -->

```text
setprop persist.sys.hdmiinmode 2
```

<!-- source: CN V2.7 p90; unit 597 -->

##### 6.12.2.3 Различия предпросмотра TIF и camera

<!-- source: CN V2.7 p90; unit 598 -->

|  | TIF | Camera |
| --- | --- | --- |
| Преимущества | Низкая задержка | Приложение получает данные предпросмотра для постобработки |
| Недостатки | Не поддерживаются поворот, разделение экрана и картинка в картинке; приложение не получает данные буфера предпросмотра; команды снимка screencap не поддерживаются | Задержка выше, чем у TIF |

<!-- source: CN V2.7 p90; unit 599 -->

### 6.13 Типичные методы отладки драйвера

<!-- source: CN V2.7 p90; unit 600 -->

Отладка драйвера выполняется как для SoC Sensor. Дополнительная информация приведена в документе Redmine:

<!-- source: CN V2.7 p90; unit 601 -->

https://redmine.rock-chips.com/documents/53

<!-- source: CN V2.7 p90; unit 602 -->

#### 6.13.1 Получение инструментов отладки

<!-- source: CN V2.7 p90; unit 603 -->

Требуются media-ctl и v4l2-ctl. Описанный SDK автоматически включает их в прошивку при сборке; каталог в SDK:

<!-- source: CN V2.7 p90; unit 604 -->

```text
hardware/rockchip/camera/etc/tools/
```

<!-- source: CN V2.7 p90; unit 605 -->

Для старых SDK получите их через Redmine:

<!-- source: CN V2.7 p91; unit 606 -->

https://redmine.rock-chips.com/documents/104

<!-- source: CN V2.7 p91; unit 607 -->

Скопируйте media-ctl и v4l2-ctl в /vendor/bin/ устройства через adb push.

<!-- source: CN V2.7 p91; unit 608 -->

#### 6.13.2 Примеры команд отладки

<!-- source: CN V2.7 p91; unit 609 -->

Пример использует RK3288 + RK628 с приёмом 1920x1080P. Адаптируйте его к реальной системе. Вводите команды по порядку: пропуск предварительной настройки может привести к неработоспособности.

<!-- source: CN V2.7 p91; unit 610 -->

Просмотр топологии связей:

<!-- source: CN V2.7 p91; unit 611 -->

Просмотрите топологию media-узла командой. В зависимости от платформы и соединений это /dev/media0 или /dev/media1.

<!-- source: CN V2.7 p91; unit 612 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p91; unit 613 -->

В фрагменте RK628 устройство — /dev/v4l-subdev2, обнаруженное разрешение HDMI IN — 1920x1080.

<!-- source: CN V2.7 p91; unit 614 -->

```text
...
- entity 8: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
         type V4L2 subdev subtype Sensor

         device node name /dev/v4l-subdev2
      pad0: Source
           [fmt:UYVY2X8/1920x1080]
           -> "rockchip-mipi-dphy-rx":0 [ENABLED]
...
```

<!-- source: CN V2.7 p91; unit 615 -->

Настройка связей:

<!-- source: CN V2.7 p91; unit 616 -->

После сброса и запуска связи по умолчанию включены. Открытие и закрытие HDMI IN APK отключает их. Восстанавливайте связь только при отсутствии [ENABLED] в топологии.

<!-- source: CN V2.7 p91; unit 617 -->

```text
media-ctl -d /dev/media0 -l \
'"m00_b_rk628-csi rk628-csi":0->"rockchip-mipi-dphy-rx":0 [1]'

media-ctl -d /dev/media0 -l \
'"rockchip-mipi-dphy-rx":1->"rkisp1-isp-subdev":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-input-params":0->"rkisp1-isp-subdev":1 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_mainpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":2->"rkisp1_selfpath":0 [1]'
media-ctl -d /dev/media0 -l '"rkisp1-isp-subdev":3->"rkisp1-statistics":0 [1]'
```

<!-- source: CN V2.7 p91; unit 618 -->

Настройка разрешения:

<!-- source: CN V2.7 p91; unit 619 -->

```text
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":0[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \

--set-v4l2 '"rkisp1-isp-subdev":0[crop:(0,0)/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[fmt:UYVY2X8/1920x1080]'
media-ctl -d /dev/media0 \
--set-v4l2 '"rkisp1-isp-subdev":2[crop:(0,0)/1920x1080]'
```

<!-- source: CN V2.7 p92; unit 620 -->

Получение потока изображения:

<!-- source: CN V2.7 p92; unit 621 -->

Проверка результатов настройки:

<!-- source: CN V2.7 p92; unit 622 -->

```text
media-ctl -d /dev/media0 –p
```

<!-- source: CN V2.7 p92; unit 623 -->

Получение потока изображения:

<!-- source: CN V2.7 p92; unit 624 -->

```text
v4l2-ctl --verbose -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat='NV12' --stream-mmap=4
```

<!-- source: CN V2.7 p92; unit 625 -->

Сохраните YUV-файл, получите его через adb pull и просмотрите, например, в 7yuv:

<!-- source: CN V2.7 p92; unit 626 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat='NV12'
--stream-mmap=3 --stream-skip=4 --stream-to=/data/1920x1080p60_nv12.yuv --stream-
count=5 --stream-poll
```

<!-- source: CN V2.7 p92; unit 627 -->

При нормальном приёме данных выводится частота кадров. Пример журнала из оригинала:

<!-- source: CN V2.7 p92; unit 628 -->

```text
VIDIOC_QUERYCAP: ok
VIDIOC_G_FMT: ok
VIDIOC_S_FMT: ok

Format Video Capture Multiplanar:
      Width/Height : 1920/1080
      Pixel Format : 'NV12'
      Field        : None
      Number of planes : 1
      Flags        :
      Colorspace   : Default
      Transfer Function : Default
      YCbCr Encoding : Default
      Quantization : Full Range
      Plane 0      :
        Bytes per Line : 1920
        Size Image : 3110400

VIDIOC_G_SELECTION: ok
VIDIOC_S_SELECTION: ok
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
idx: 0 seq: 0 bytesused: 3110400 ts: 131.560377
idx: 1 seq: 1 bytesused: 3110400 ts: 131.577023 delta: 16.646 ms
idx: 2 seq: 2 bytesused: 3110400 ts: 131.593697 delta: 16.674 ms
idx: 3 seq: 3 bytesused: 3110400 ts: 131.610363 delta: 16.666 ms
idx: 0 seq: 4 bytesused: 3110400 ts: 131.627033 delta: 16.670 ms fps: 60.01
idx: 1 seq: 5 bytesused: 3110400 ts: 131.643721 delta: 16.688 ms fps: 59.99
idx: 2 seq: 6 bytesused: 3110400 ts: 131.660390 delta: 16.669 ms fps: 59.99
idx: 3 seq: 7 bytesused: 3110400 ts: 131.677058 delta: 16.668 ms fps: 59.99
```

<!-- source: CN V2.7 p93; unit 629 -->

<!-- source: CN V2.7 p93; unit 630 -->

#### 6.13.3 Включение журналов

<!-- source: CN V2.7 p93; unit 631 -->

Включите журналы RK628 следующей командой, затем получите журнал ядра. Оригинал пишет demsg; проверьте фактическую команду dmesg на целевой системе.

<!-- source: CN V2.7 p93; unit 632 -->

```text
echo 1 > /sys/kernel/debug/rk628/x-0050/debug //x为挂载的i2c总线，50为对应的i2c地址
echo 2 > /sys/module/rk628_csi/parameters/debug
echo 2 > /sys/module/rk628_csi_v4l2/parameters/debug //内核为linux4.4或者4.19

dmesg -n 8
```

<!-- source: CN V2.7 p93; unit 633 -->

Для журнала включения и загрузки измените код и пересоберите/прошивайте компоненты ядра:

<!-- source: CN V2.7 p93; unit 634 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index c763a9558169..bd7f3effb45a 100644
--- a/drivers/media/i2c/rk628_csi_v4l2.c

+++ b/drivers/media/i2c/rk628_csi_v4l2.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 1;
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

<!-- source: CN V2.7 p93; unit 635 -->

#### 6.13.4 Чтение и запись регистров

<!-- source: CN V2.7 p93; unit 636 -->

Ниже отладочные узлы регистров RK628. В примере RK628 подключён к I2C3 по адресу 0x50:

<!-- source: CN V2.7 p93; unit 637 -->

```text
console:/ # ls /sys/kernel/debug/rk628/3-0050/registers/
adapter combtxphy csi dsi0 gpio0 gpio2 grf hdmirxphy

combrxphy cru   csi1 dsi1 gpio1 gpio3 hdmirx
```

<!-- source: CN V2.7 p93; unit 638 -->

Узлы регистров поддерживают чтение и запись.

<!-- source: CN V2.7 p93; unit 639 -->

Чтение регистров:

<!-- source: CN V2.7 p94; unit 640 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/registers/cru
rk628_cru:


0xc0000: 00001031 00000441 00800000 00000007
0xc0010: 00007f00
0xc0020: 00001028 00000441 00f5c28f 00000007
0xc0030: 00007f00
0xc0040: 00005019 00000541 0099735e 00000007
0xc0050: 00007f00
0xc0060: 00000015
0xc0080: 00008989 00000003 00000007 00004b80
0xc0090: 03355460 000080d7 00008004 0000003b
0xc00a0: 00002c00 00000000 00000000 00000000
0xc00b0: 00285f58 00010008 00010008 00000103
0xc00c0: 00000300 00000703 0000000b 00000008

0xc00d0: 0001000a 00000b07
0xc0180: 00000000 00000000 00000000 00000000
0xc0190: 00000000 00000000
0xc0200: 00000000 00000000 00000000 00000000
0xc0210: 00000000
```

<!-- source: CN V2.7 p94; unit 641 -->

Запись регистров:

<!-- source: CN V2.7 p94; unit 642 -->

```text
rk3288:/ # echo 0x000 0xffffffff > /sys/kernel/debug/rk628/3-0050/registers/grf
```

<!-- source: CN V2.7 p94; unit 643 -->

#### 6.13.5 Чтение состояния HDMI-RX

<!-- source: CN V2.7 p94; unit 644 -->

Получите сведения HDMI-RX: разрешение, захват, подключение и цветовой формат, командой:

<!-- source: CN V2.7 p94; unit 645 -->

```text
console:/ # cat /sys/kernel/debug/rk628/3-0050/hdmirx/status
status: plugin

Clk-Ch:Lock Ch0:Lock   Ch1:Lock    Ch2:Lock
Color Format: RGB
Timing: 1920x1080p60 (2200x1125)   hfp:88 hs:45 hbp:147 vfp:4
vs:5 vbp:36
Pixel Clk: 148500000
Mode: HDMI
Color Depth: 8 bit
Color Range: Limited
Color Space: RGB
```

<!-- source: CN V2.7 p94; unit 646 -->

#### 6.13.6 Вывод тестового изображения

<!-- source: CN V2.7 p94; unit 647 -->

RK628 поддерживает вывод цветовых полос scaler. Команды:

<!-- source: CN V2.7 p94; unit 648 -->

```text
echo 1 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar

//pattern 模式选择

echo 2 > /sys/kernel/debug/rk628/3-0050/scaler_color_bar
```

<!-- source: CN V2.7 p95; unit 649 -->

### 6.14 Аудиомодуль

<!-- source: CN V2.7 p95; unit 650 -->

Направление звука определяется использованием HDMIRX или HDMITX. Для HDMIRX принятый звук HDMI распаковывается и выводится через I2S. Для HDMITX I2S RK628D принимает звук, который упаковывается и передаётся через HDMITX. Ниже обе конфигурации:

<!-- source: CN V2.7 p95; unit 651 -->

#### 6.14.1 HDMIRX

<!-- source: CN V2.7 p95; unit 652 -->

HDMIRX обычно инициализирует звук при загрузке драйвера без дополнительной настройки. При воспроизведении звука передатчиком HDMI RK628 выводит его через I2S и должен быть master. I2S RK628 подключается напрямую к DAC или SoC с I2S. Формат I2S:

<!-- source: CN V2.7 p95; unit 653 -->

![Оригинальный технический рисунок — EN V2.3, p86](/docs/rockchip-rk628-porting/assets/en-p86-X477.png)

*Оригинальный технический рисунок: EN V2.3, p86.*

<!-- source: CN V2.7 p95; unit 654 -->

При подключении к SoC дополнительная настройка I2S RK628 не нужна; создайте звуковую карту через dummy_codec:

<!-- source: CN V2.7 p95; unit 655 -->

```text
rk628_dc: rk628-dc {
      compatible = "rockchip,dummy-codec";
      #sound-dai-cells = <0>;

};

hdmiin-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";
      simple-audio-card,name = "rockchip,hdmiin";
      simple-audio-card,bitclock-master = <&dailink0_master>;
      simple-audio-card,frame-master = <&dailink0_master>;
      status = "okay";
      simple-audio-card,cpu {
                 sound-dai = <&i2s0>;
      };

      dailink0_master: simple-audio-card,codec {
                 sound-dai = <&rk628_dc>;
      };
};
```

<!-- source: CN V2.7 p95; unit 656 -->

При подключении DAC настройка звуковой карты выше не нужна: DAC непосредственно выдаёт аналоговый сигнал. Большинство DAC требует MCLK, который в RK628 не предусмотрен. Обходной способ оригинала использует GPIO1_A0 (H7) как TEST_CLKO с частотой 128FS. Оригинал сообщает о совместимости со многими DAC и проверке CS4344 и ES7144; это не испытания ArmSoM. Для MCLK на GPIO1_A0 вызовите следующий интерфейс инициализации, выбрав драйвер проекта:

<!-- source: CN V2.7 p95; unit 657 -->

```text
--- a/drivers/media/i2c/rk628/rk628_hdmirx.h
+++ b/drivers/media/i2c/rk628/rk628_hdmirx.h
@@ -392,5 +392,5 @@ bool rk628_audio_ctsnints_enabled(HAUDINFO info);
 void rk628_csi_isr_ctsn(HAUDINFO info, u32 pdec_ints);

 void rk628_csi_isr_fifoints(HAUDINFO info, u32 fifo_ints);
 int rk628_is_avi_ready(struct rk628 *rk628, bool avi_rcv_rdy);
+void rk628_hdmirx_audio_set_mclk_output(HAUDINFO info);

--- a/drivers/media/i2c/rk628/rk628_csi.c
+++ b/drivers/media/i2c/rk628/rk628_csi.c
@@ -957,6 +957,9 @@ static void rk628_csi_initial_setup(struct rk628_csi *csi)
 {
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);


--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1096,6 +1096,9 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      struct rk628_csi *csi = to_csi(sd);
      struct v4l2_subdev_edid def_edid;

+     //enable rk628 mclk
+     rk628_hdmirx_audio_set_mclk_output(csi->audio_info);
```

<!-- source: CN V2.7 p96; unit 658 -->

<!-- source: CN V2.7 p96; unit 659 -->

Для RK3288 EVB оригинал указывает подключение RK3288 I2S к RT5651 I2S2 и также RK628 I2S к RT5651 I2S2. Переключение внутренних маршрутов RT5651 выбирает пути записи и воспроизведения. DTS:

<!-- source: CN V2.7 p96; unit 660 -->

```text
hdmiin-sound {
      compatible = "rockchip,rockchip-rt5651-rk628-sound";
      rockchip,cpu = <&i2s>;

      rockchip,codec = <&rt5651>;
      status = "okay";
};
```

<!-- source: CN V2.7 p96; unit 661 -->

По умолчанию I2S выводит только при предварительном просмотре. Для постоянного вывода добавьте i2s-enable-default в DTS.

<!-- source: CN V2.7 p96; unit 662 -->

```text
&i2c4 {
      clock-frequency = <400000>;
      status = "okay";

      rk628_csi_v4l2: rk628_csi_v4l2@50 {
           reg = <0x50>;
           compatible = "rockchip,rk628-csi-v4l2";
           ....
           i2s-enable-default;
           ....
      };
};
```

<!-- source: CN V2.7 p97; unit 663 -->

#### 6.14.2 HDMITX

<!-- source: CN V2.7 p97; unit 664 -->

Для HDMITX достаточно настроить звуковую карту HDMI. Здесь I2S RK628 соединён с I2S0 SoC:

<!-- source: CN V2.7 p97; unit 665 -->

```text
hdmi_sound: hdmi-sound {
      compatible = "simple-audio-card";
      simple-audio-card,format = "i2s";

      simple-audio-card,name = "hdmi-sound";
      status = "okay";
      simple-audio-card,cpu {
           sound-dai = <&i2s0>;
      };
      simple-audio-card,codec {
           sound-dai = <&rk628_hdmi>;
      };
};
```

<!-- source: CN V2.7 p97; unit 666 -->

#### 6.14.3 Диагностика звука

<!-- source: CN V2.7 p97; unit 667 -->

##### 6.14.3.1 Нет вывода I2S

<!-- source: CN V2.7 p97; unit 668 -->

```text
echo 0x000 0x6000220 > /sys/kernel/debug/regmap/0-0050-grf/registers //i2s 的
IOMUX

echo 0x70 0xfffff55c > /sys/kernel/debug/regmap/0-0050-grf/registers
echo 0x70 0x155c155c > /sys/kernel/debug/regmap/0-0050-grf/registers // 设置输出
```

<!-- source: CN V2.7 p97; unit 669 -->

##### 6.14.3.2 Включение вывода v4l2_dbg

<!-- source: CN V2.7 p97; unit 670 -->

```text
diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 5e8e3710a82f..638ac2acc472 100644

--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c
@@ -34,7 +34,7 @@
 #include <video/videomode.h>
 #include "rk628_csi.h"

-static int debug;
+static int debug = 3;
 module_param(debug, int, 0644);
 MODULE_PARM_DESC(debug, "debug level (0-3)");

diff --git a/include/media/v4l2-common.h b/include/media/v4l2-common.h
index cdc87ec61e54..f159118d4a6b 100644

--- a/include/media/v4l2-common.h
+++ b/include/media/v4l2-common.h
@@ -82,7 +82,7 @@
 #define v4l2_dbg(level, debug, dev, fmt, arg...)   \
      do {                                          \
           if (debug >= (level))                    \
-                v4l2_printk(KERN_DEBUG, dev, fmt , ## arg); \
+                v4l2_printk(KERN_INFO, dev, fmt , ## arg); \
      } while (0)


 /**
```

<!-- source: CN V2.7 p98; unit 671 -->

<!-- source: CN V2.7 p98; unit 672 -->

##### 6.14.3.3 Шум в записи приложения

<!-- source: CN V2.7 p98; unit 673 -->

Причиной может быть несовпадение частоты дискретизации передатчика HDMI и записи HAL.

<!-- source: CN V2.7 p98; unit 674 -->

(1) Проверьте частоту дискретизации HDMITX.

<!-- source: CN V2.7 p98; unit 675 -->

Включите журнал ядра: echo 3 > /sys/module/rk628_csi/parameters/debug

<!-- source: CN V2.7 p98; unit 676 -->

(2) После включения определите частоту дискретизации TX по выводу ниже.

<!-- source: CN V2.7 p98; unit 677 -->

```text
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000

m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfe, single offset:0, total offset:-2
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:-2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:0, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfc, single offset:2, total offset:-4
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_ISTS:0x4
m00_b_rk628-csi rk628-csi: rk628_hdmirx_audio_fs: clkrate:1500 tmdsclk:74250000,
n_decoded:6144, cts_decoded:74250, fs_audio:48000
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:
HDMI_RX_AUD_FIFO_FILLSTS1:0xfa, single offset:-2, total offset:-6
m00_b_rk628-csi rk628-csi: rk628_csi_delayed_work_audio:

HDMI_RX_AUD_FIFO_ISTS:0x4
```

<!-- source: CN V2.7 p99; unit 678 -->

<!-- source: CN V2.7 p99; unit 679 -->

(3) Частота дискретизации записи HAL:

<!-- source: CN V2.7 p99; unit 680 -->

```text
getprop vendor.hdmiin.audiorate
```

<!-- source: CN V2.7 p99; unit 681 -->

##### 6.14.3.4 Прямая настройка IOMUX

<!-- source: CN V2.7 p99; unit 682 -->

```text
 static void rk628_hdmirx_initial_setup(struct rk628_hdmirx *hdmirx)
 {
      struct v4l2_subdev_edid def_edid;

@@ -783,6 +937,8 @@ static void rk628_hdmirx_initial_setup(struct rk628_hdmirx
*hdmirx)

      // ddc and hpd pinctrl
      regmap_write(hdmirx->grf, GRF_GPIO1AB_SEL_CON, 0x07000700);
+     //i2s pinctrl
+     regmap_write(hdmirx->grf, GRF_GPIO0AB_SEL_CON, 0x155c155c);

      rk628_hdmirx_controller_reset(hdmirx);
```

<!-- source: CN V2.7 p99; unit 683 -->

##### 6.14.3.5 Ошибочный расчёт tmdsclk

<!-- source: CN V2.7 p99; unit 684 -->

1\. Согласуйте bitmask с частотой.

<!-- source: CN V2.7 p99; unit 685 -->

```text
git sholsh@rk-intel-1:~/rk-sdk/android11-rk3399/kernel$ git show
007131063748ea69facbf4bbe7aaee71c34fd921

commit 007131063748ea69facbf4bbe7aaee71c34fd921
Author: Shunhua Lan <lsh@rock-chips.com>
Date: Fri Apr 23 18:43:59 2021 +0800

   media: i2c: rk628csi: fix mask for clkrate and fs audio align to 100

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I15b290319463f1b41e6908e54caa99ef9c6db4f4

diff --git a/drivers/media/i2c/rk628_csi.c b/drivers/media/i2c/rk628_csi.c
index 89c4a926a985..a970bc621e0e 100644
--- a/drivers/media/i2c/rk628_csi.c
+++ b/drivers/media/i2c/rk628_csi.c

@@ -1064,7 +1064,7 @@ static void rk628_csi_delayed_work_audio(struct work_struct
*work)

      /* fout=128*fs=ftmds*N/CTS */
      regmap_read(csi->hdmirx_regmap, HDMI_RX_HDMI_CKM_RESULT, &clkrate);
-     clkrate = clkrate & 0xfff;
+     clkrate = clkrate & 0xffff;
      /* tmdsclk = (clkrate/1000) * 49500000 */
      tmdsclk = clkrate * (49500000 / 1000);
      regmap_read(csi->hdmirx_regmap, HDMI_RX_PDEC_ACR_CTS, &cts_decoded);
@@ -1073,6 +1073,8 @@ static void rk628_csi_delayed_work_audio(struct work_struct

*work)
      if (cts_decoded != 0) {
           fs_audio = div_u64((tmdsclk * n_decoded), cts_decoded);
           fs_audio = div_u64(fs_audio, 128);
+          fs_audio = div_u64(fs_audio + 50, 100);
+          fs_audio *= 100;
      }
      v4l2_dbg(2, debug, sd,
           "%s: clkrate:%d tmdsclk:%llu, n_decoded:%d, cts_decoded:%d,
fs_audio:%llu\n",
```

<!-- source: CN V2.7 p100; unit 686 -->

<!-- source: CN V2.7 p100; unit 687 -->

Журнал ошибки:

<!-- source: CN V2.7 p100; unit 688 -->

```text
[67.440094] m00_b_rk628-csi rk628-csi:rk628_csi_delayed_work_audio:clkrate:1904
tmdsclk:94248000,n_decoded:6144,cts_decoded:297000,fs_audio:15232
```

<!-- source: CN V2.7 p100; unit 689 -->

Для 4K-дисплея в этом примере расчётный tmdsclk должен быть 297M.

<!-- source: CN V2.7 p100; unit 690 -->

tmdsclk = clkrate * (49500000 / 1000);

<!-- source: CN V2.7 p100; unit 691 -->

1904 ---> 0x770

<!-- source: CN V2.7 p100; unit 692 -->

6000 ---> 0x1770

<!-- source: CN V2.7 p100; unit 693 -->

tmdsclk 6*49500000 = 297000000

<!-- source: CN V2.7 p100; unit 694 -->

##### 6.14.3.6 Вывод test clk через GPIO

<!-- source: CN V2.7 p100; unit 695 -->

Быстрая настройка:

<!-- source: CN V2.7 p100; unit 696 -->

```text
grf: gpio0 相关 iomux 切换，配置为 IO 口:
echo 0x70 0x0fff0000 > registers


gpio0 配置为输出口, 1-0051-rk628-pinctrl:
echo 0xd0008 0x00EC00EC > registers

grf，选择在哪一级拉出信号:
HDMI_RX:
echo 0x300 0x11 > registers
ASYNC_IN:
echo 0x300 0x14 > registers
ASYNC_OUT:
echo 0x300 0x15 > registers
SCALER：
echo 0x300 0x16 > registers
```

<!-- source: CN V2.7 p101; unit 697 -->

##### 6.14.3.7 Особенности IOMUX RK356X

<!-- source: CN V2.7 p101; unit 698 -->

Каждый интерфейс I2S RK356X может использовать несколько групп выводов, поэтому требуется дополнительная настройка GRF_IOFUNC_SEL4:

<!-- source: CN V2.7 p101; unit 699 -->

| Бит | Атрибут | Значение сброса | Описание |
| --- | --- | --- | --- |
| 14 | RW | 0x0 | i2s3_iomux_sel Выбор мультиплексирования I2S3<br>1'b0:M0 схема мультиплексирования<br>1'b1:M1 схема мультиплексирования |
| 12 | RW | 0x0 | i2s2_iomux_sel Выбор мультиплексирования I2S2<br>1'b0:M0 схема мультиплексирования<br>1'b1:M1 схема мультиплексирования |
| 11:10 | RW | 0x0 | i2s1_iomux_sel Выбор мультиплексирования I2S1<br>2'b00:M0 схема мультиплексирования<br>2'b01:M1 схема мультиплексирования<br>2'b10:M2 схема мультиплексирования<br>2'b11: Зарезервировано |

<!-- source: CN V2.7 p101; unit 700 -->

Драйвер pinctrl настраивает биты GRF по выбранному mclk. Код:

<!-- source: CN V2.7 p101; unit 701 -->

```text
static struct rockchip_mux_route_data rk3568_mux_route_data[] = {
   ....
   RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1 IO

mux M0 */
   RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1 IO
mux M1 */
   RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1 IO
mux M2 */
   RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2 IO
mux M1 */
   RK_MUXROUTE_GRF(3, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3 IO
mux M0 */
   RK_MUXROUTE_GRF(4, RK_PC4, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3 IO
mux M1 */

   ....
}
```

<!-- source: CN V2.7 p101; unit 702 -->

Применения вроде RK628, которым mclk не нужен, не настраивают его, поэтому биты не устанавливаются. Добавьте обработку вручную. I2S обычно использует sclk, поэтому здесь добавляется sclk. Оригинал обещает патч в последующем SDK RK356X; проверьте фактический SDK.

<!-- source: CN V2.7 p101; unit 703 -->

```text
diff --git a/drivers/pinctrl/pinctrl-rockchip.c b/drivers/pinctrl/pinctrl-
rockchip.c

index 871c49ef0c2a..3d10e6c2ed27 100644
--- a/drivers/pinctrl/pinctrl-rockchip.c
+++ b/drivers/pinctrl/pinctrl-rockchip.c
@@ -1046,13 +1046,26 @@ static struct rockchip_mux_route_data
rk3568_mux_route_data[] = {
      RK_MUXROUTE_GRF(2, RK_PB0, 3, 0x0310, WRITE_MASK_VAL(9, 8, 0)), /* UART9
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC5, 4, 0x0310, WRITE_MASK_VAL(9, 8, 1)), /* UART9
IO mux M1 */
      RK_MUXROUTE_GRF(4, RK_PA4, 4, 0x0310, WRITE_MASK_VAL(9, 8, 2)), /* UART9

IO mux M2 */
+
      RK_MUXROUTE_GRF(1, RK_PA2, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux M0 */
      RK_MUXROUTE_GRF(3, RK_PC6, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux M1 */
      RK_MUXROUTE_GRF(2, RK_PD0, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux M2 */
+     RK_MUXROUTE_GRF(1, RK_PA3, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(1, RK_PA4, 1, 0x0310, WRITE_MASK_VAL(11, 10, 0)), /* I2S1
IO mux sclk rx M0 */

+     RK_MUXROUTE_GRF(3, RK_PC7, 4, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PA6, 5, 0x0310, WRITE_MASK_VAL(11, 10, 1)), /* I2S1
IO mux sclk rx M1 */
+     RK_MUXROUTE_GRF(2, RK_PD1, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk tx M2 */
+     RK_MUXROUTE_GRF(3, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(11, 10, 2)), /* I2S1
IO mux sclk rx M2 */
      RK_MUXROUTE_GRF(2, RK_PC1, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PB6, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S2
IO mux M1 */
+     RK_MUXROUTE_GRF(2, RK_PC2, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2

IO mux sclk tx M0 */
+     RK_MUXROUTE_GRF(2, RK_PB7, 1, 0x0310, WRITE_MASK_VAL(12, 12, 0)), /* I2S2
IO mux sclk rx M0 */
+     RK_MUXROUTE_GRF(4, RK_PB7, 4, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk tx M1 */
+     RK_MUXROUTE_GRF(4, RK_PC1, 5, 0x0310, WRITE_MASK_VAL(12, 12, 1)), /* I2S1
IO mux sclk rx M1 */
      RK_MUXROUTE_GRF(3, RK_PA2, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3
IO mux M0 */
      RK_MUXROUTE_GRF(4, RK_PC2, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux M1 */
+     RK_MUXROUTE_GRF(3, RK_PA3, 4, 0x0310, WRITE_MASK_VAL(14, 14, 0)), /* I2S3

IO mux sclk M0 */
+     RK_MUXROUTE_GRF(4, RK_PC3, 5, 0x0310, WRITE_MASK_VAL(14, 14, 1)), /* I2S3
IO mux sclk M1 */
      RK_MUXROUTE_GRF(1, RK_PA4, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(1, RK_PA6, 3, 0x0314, WRITE_MASK_VAL(1, 0, 0)), /* PDM IO
mux M0 */
      RK_MUXROUTE_GRF(3, RK_PD6, 5, 0x0314, WRITE_MASK_VAL(1, 0, 1)), /* PDM IO
mux M1 */
```

<!-- source: CN V2.7 p102; unit 704 -->

<!-- source: CN V2.7 p103; unit 705 -->

##### 6.14.3.8 Особенности LRCK RK3399

<!-- source: CN V2.7 p103; unit 706 -->

Неверное направление может исключить приём данных после открытия звуковой карты. Типичный журнал ниже; адаптируйте пути узлов к устройству:

<!-- source: CN V2.7 p103; unit 707 -->

```text
console:/ # cat /proc/asound/cards
 0 [rockchiphdmi ]: rockchip_hdmi - rockchip,hdmi
                rockchip,hdmi

 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin

console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1415
trigger_time: 1632716135.151992694
tstamp   : 0.000000000
delay    : 0
avail    : 0
avail_max : 0
-----

hw_ptr   : 0
appl_ptr : 0
```

<!-- source: CN V2.7 p103; unit 708 -->

Нормальный вывод должен выглядеть примерно так:

<!-- source: CN V2.7 p103; unit 709 -->

```text
console:/ # cat /proc/asound/card1/pcm0c/sub0/status
state: RUNNING
owner_pid : 1421

trigger_time: 1632892868.412331044
tstamp   : 1632892881.181113577
delay    : 232
avail    : 232
avail_max : 264
-----
hw_ptr   : 543736
appl_ptr : 543504
```

<!-- source: CN V2.7 p103; unit 710 -->

RK628 является master, RK3399 — slave, поэтому настройка зависит от разводки. Если к RK628 подключён LRCK_TX, задайте rockchip,clk-trcm следующим образом:

<!-- source: CN V2.7 p103; unit 711 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <1>;

+     status = "okay";
+};

console:/ # io -4 0xff880008
ff880008: 18071f1f
```

<!-- source: CN V2.7 p103; unit 712 -->

Если к RK628 подключён LRCK_RX, задайте rockchip,clk-trcm следующим образом:

<!-- source: CN V2.7 p104; unit 713 -->

```text
+&i2s0 {
+     rockchip,clk-trcm = <2>;
+     status = "okay";

+};
正常寄存器如下：
console:/ # io -4 0xff880008
ff880008: 28071f1f
```

<!-- source: CN V2.7 p104; unit 714 -->

Биты 29:28 регистра I2S_CKR определены следующим образом:

<!-- source: CN V2.7 p104; unit 715 -->

```text
Tx and Rx Common Use
2'b00/2'b11:tx_lrck/rx_lrck are used as synchronous signal for TX
/RX respectively.

2'b01:only tx_lrck is used as synchronous signal for TX and RX.
2'b10:only rx_lrck is used as synchronous signal for TX and RX.
```

<!-- source: CN V2.7 p104; unit 716 -->

Обновите код RK628 до v15-210926 или новее и используйте пример звука в arch/arm64/boot/dts/rockchip/rk3399-evb-ind-lpddr4-rk628-hdmi2csi-v4l2-avb.dts.

<!-- source: CN V2.7 p104; unit 717 -->

##### 6.14.3.9 Неверный выбор звуковой карты HDMI-IN

<!-- source: CN V2.7 p104; unit 718 -->

При открытии APK сопоставляет звуковые карты по имени. Ранний код может выбрать неверное имя и не открыть карту HDMI-IN. Пример ошибки:

<!-- source: CN V2.7 p104; unit 719 -->

```text
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: card0 id:rockchiphdmi
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=0,device=0

09-28 07:03:13.341 261 1386 D AudioHardwareTiny: HDMI card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: SPDIF card, got
card=0,device=0
09-28 07:03:13.341 261 1386 D AudioHardwareTiny: BT card, got card=0,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: card1 id:rockchiphdmiin
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPEAKER card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: HDMI card, got
card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: SPDIF card, got
card=1,device=0

09-28 07:03:13.342 261 1386 D AudioHardwareTiny: BT card, got card=1,device=0
09-28 07:03:13.342 261 1386 D AudioHardwareTiny: No exist
proc/asound/card2/id, break and finish parsing
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dump out device info
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPEAKER card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info HDMI card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info SPDIF card=1,
device:0
09-28 07:03:13.343 261 1386 D AudioHardwareTiny: dev_info BT card=1, device:0
```

<!-- source: CN V2.7 p104; unit 720 -->

HDMI card, got card=1,device=0 не соответствует реальному устройству, поэтому карта не открывается.

<!-- source: CN V2.7 p105; unit 721 -->

Примените следующий патч либо обновите код RK628 до V15-210926 или новее.

<!-- source: CN V2.7 p105; unit 722 -->

```text
hardware/rockchip/audio
commit 1b51a62fc62e9d63850e4e5a39f1e3cff0aa9b88 (HEAD)
Author: Shunhua Lan <lsh@rock-chips.com>

Date: Tue Sep 28 17:25:44 2021 +0800

   [audio hal] use levenshtein distance for sound card matching

   Signed-off-by: Shunhua Lan <lsh@rock-chips.com>
   Change-Id: I16f1692715d710a0693ae74875b0272669a04ba2
```

<!-- source: CN V2.7 p105; unit 723 -->

#### 6.14.4 Дополнительные документы по звуку

<!-- source: CN V2.7 p105; unit 724 -->

Для прямого соединения RK628 с SoC см. RK628-DIRECT-TO-SOC.pdf.

<!-- source: CN V2.7 p105; unit 725 -->

Для соединения через аудиокодек см. RK628-RT5640-AUDIO-CONFIG.pdf.

<!-- source: CN V2.7 p105; unit 726 -->

Для звуковых проблем HDMI-IN APK см. RK628-HDMIIN-APP-AUDIO.pdf.

<!-- source: CN V2.7 p105; unit 727 -->

При расхождениях или противоречиях с другими документами приоритет имеет данное исходное руководство.

<!-- source: CN V2.7 p105; unit 728 -->

### 6.15 Диагностика типичных неисправностей

<!-- source: CN V2.7 p105; unit 729 -->

#### 6.15.1 Ошибки clk det

<!-- source: CN V2.7 p105; unit 730 -->

##### 6.15.1.1 RK628D

<!-- source: CN V2.7 p105; unit 731 -->

Если COMBRXPHY не обнаруживает сигнал, возможна неверная полярность обнаружения подключения HDMI или HPD, мешающая передаче источника. Проверьте plugin-det-gpios и hpd-output-inverted в rk628_csi и измерьте HPD мультиметром.

<!-- source: CN V2.7 p105; unit 732 -->

При ошибке выполняются повторы до retry 2. Если повтор успешен, оригинал считает сигнал нормальным.

<!-- source: CN V2.7 p105; unit 733 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: |d2_p| level detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p105; unit 734 -->

Журнал выше указывает на ошибку определения напряжения data2_p: возможно отсутствие сигнала или малая амплитуда.

<!-- source: CN V2.7 p105; unit 735 -->

```text
rk628-csi-v4l2 1-0051: clk det over cnt:10, reg_0x6654:0x403f0000
rk628-csi-v4l2 1-0051: Clock detection anomaly
rk628-csi-v4l2 1-0051: clock detected failed, cfg resistance manual!

rk628-csi-v4l2 1-0051: err, clk not stable, reg_0x6630:0x87000d,
reg_0x6608:0x110100
m00_b_rk628-csi 1-0051: hdmi rxphy power on failed
```

<!-- source: CN V2.7 p106; unit 736 -->

Журнал выше указывает на ошибку определения частоты, возможно вне диапазона RK628D. Описанный HDMIRX поддерживает следующие частоты:

<!-- source: CN V2.7 p106; unit 737 -->

```text
25175, 27000, 33750, 40000, 59400, 65000, 68250, 74250,
75000, 83500, 85500, 88750, 928125, 101000, 102250, 108000,
118800, 119000, 135000, 148500, 150000, 162000, 165000, 297000
```

<!-- source: CN V2.7 p106; unit 738 -->

#### 6.15.2 Проверка нормальной работы HDMI RX

<!-- source: CN V2.7 p106; unit 739 -->

После захвата COMBRXPHY контроллер HDMI RX должен корректно определять тайминги. Расчётные значения могут иметь небольшую погрешность, часто на 1. Подробные тайминги приведены в стандартах CEA.

<!-- source: CN V2.7 p106; unit 740 -->

![Оригинальный технический рисунок — EN V2.3, p100](/docs/rockchip-rk628-porting/assets/en-p100-X525.png)

*Оригинальный технический рисунок: EN V2.3, p100.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
m00_b_rk628-csi rk628-csi: cnt_num:1000, tmds_cnt:3000, hs_cnt:15, vs_cnt:3667, hofs:192
m00_b_rk628-csi rk628-csi: SCDC_REGS1:0xffff0f00, act:1920x1080, total:2200x1125, fps:60,
m00_b_rk628-csi rk628-csi: hfp:88, hs:45, hbp:147, vfp:4, vs:5, vbp:36, interlace:0
m00_b_rk628-csi rk628-csi: rk628_csi_s_dv_timings: 1920x1080p60.0 (2200x1125)
m00_b_rk628-csi rk628-csi: enable_stream: disable
```

<!-- source: CN V2.7 p106; unit 741 -->

#### 6.15.3 Ошибка прав при открытии subdev

<!-- source: CN V2.7 p106; unit 742 -->

![Оригинальный технический рисунок — EN V2.3, p100](/docs/rockchip-rk628-porting/assets/en-p100-X526.png)

*Оригинальный технический рисунок: EN V2.3, p100.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
D JNI     : JNI CAMERA CALL init
I HdmiInput-native: JNI OnLoad
I HdmiInput-native: Apk Version: V1.2
E HdmiInput-native: openDevice(91): open /dev/v4l-subdev2 failed,erro=Permission denied
D RockchipCamera2: remove fake pic button
D RockchipCamera2: recreateTextureview
D RockchipCamera2: textureView remove
D RockchipCamera2: onResume
```

<!-- source: CN V2.7 p106; unit 743 -->

Проверьте режим 666 для /dev/v4l-subdev*, требуемый примером оригинала. Команда на устройстве:

<!-- source: CN V2.7 p106; unit 744 -->

```text
rk3288:/ # cat /vendor/ueventd.rc | grep subdev
/dev/v4l-subdev*   0666 media   camera
```

<!-- source: CN V2.7 p106; unit 745 -->

Описанный SDK уже содержит коммит. Если его нет, адаптируйте изменение в device/rockchip/common/:

<!-- source: CN V2.7 p106; unit 746 -->

![Оригинальный технический рисунок — EN V2.3, p100](/docs/rockchip-rk628-porting/assets/en-p100-X527.png)

*Оригинальный технический рисунок: EN V2.3, p100.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
wendingxian@ubuntu:~/rk3288_9.0_int/device/rockchip/common$ git show
commit 17112e1430b0f10a88b57c73ad19203e58f0eeff (HEAD -> mid_9.0, rk/rk/rk33/mid/9.0/develop)
Author: Dingxian Wen <shawn.wen@rock-chips.com>
Date:   Tue Apr 27 21:26:48 2021 +0800

    ueventd.rockchip.rc: modify the /dev/v4l-subdev* permission to 666

    Signed-off-by: Dingxian Wen <shawn.wen@rock-chips.com>
    Change-Id: Id4848209fd983f7e525761f19c7f0420b9fee747

diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index 1914490b..52935d49 100755
--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -178,7 +178,7 @@
 /dev/ovr0                0664   system     system
 
 #for rk_isp1
-/dev/v4l-subdev*         0660   media      camera
+/dev/v4l-subdev*         0666   media      camera

 /dev/video0             0660   media      camera
 /dev/video1             0660   media      camera
```

<!-- source: CN V2.7 p107; unit 747 -->

#### 6.15.4 Сигнал не обнаружен

<!-- source: CN V2.7 p107; unit 748 -->

Шаг 1. Если подключение/отключение HDMI не даёт журналов RK628 в UART, неверно настроен GPIO det.

<!-- source: CN V2.7 p107; unit 749 -->

Шаг 2. Если журнал есть при отключении, но отсутствует при подключении, полярность plugin-det-gpios обратная. При инвертирующем транзисторе используйте GPIO_ACTIVE_LOW. Для проверки замените static int debug; на static int debug = 3; в rk628_csi_v4l2.c. Правильно: tx_5v_power_present: 1 при подключении и tx_5v_power_present: 0 при отключении.

<!-- source: CN V2.7 p107; unit 750 -->

Шаг 3. Если после подключения корректный сигнал не обнаруживается, проверьте следующие случаи:

<!-- source: CN V2.7 p107; unit 751 -->

Случай 1: инверсия HPD. Для вывода источника на разъёме HDMI IN должен быть высокий HPD. При инверторе RK628 должен выдавать низкий уровень, чтобы на разъёме получился высокий. Добавьте hpd-output-inverted; в DTS.

<!-- source: CN V2.7 p107; unit 752 -->

Случай 2: PHY не захватывает сигнал; см. диагностику clk det.

<!-- source: CN V2.7 p107; unit 753 -->

Случай 3: разрешение не фиксируется; HDMIRX может обнаруживать битрейт вне допустимого диапазона.

<!-- source: CN V2.7 p107; unit 754 -->

Случай 4: разрешение определено, но AVI не готов. После захвата avi_rcv_rdy должен стать 1. Повторяющийся avi_rcv_rdy:0 при определённом разрешении может указывать на ненастроенный вывод прерывания. Сначала проверьте его настройку.

<!-- source: CN V2.7 p107; unit 755 -->

```text
rk628d 1-0050: rk628_is_avi_ready PDEC_AVI_PB:0x10000840, avi_rcv_rdy:0
rk628d 1-0050: SCDC_REGS1:0x80000f00, act:1920x1080, total:2200x1125, fps:60,

pixclk:148500000
```

<!-- source: CN V2.7 p107; unit 756 -->

Оригинал сообщает о периодическом разделении изображения при захвате на RK3288 в таком состоянии; это не испытание ArmSoM.

<!-- source: CN V2.7 p107; unit 757 -->

#### 6.15.5 Нарушения изображения

<!-- source: CN V2.7 p107; unit 758 -->

(1) Проверьте режим DVI источника: RK628D не поддерживает DVI. Проверьте журнал:

<!-- source: CN V2.7 p107; unit 759 -->

```text
rk628-csi-v4l2 1-0051: DVI mode detected
```

<!-- source: CN V2.7 p107; unit 760 -->

(2) Проверьте шифрование HDCP источника. При его наличии включите HDCP HDMIRX RK628.

<!-- source: CN V2.7 p107; unit 761 -->

#### 6.15.6 Выводится только половина изображения

<!-- source: CN V2.7 p107; unit 762 -->

Вероятная причина — источник HDMI 4K60 и старый хост с одним MIPI, например RK3399, RK3568 или RK3288. RK628F/H делит 4K60 на левую и правую половины, и хост получает лишь одну. Ограничьте EDID до 4K30, используя EDID RK628D:

<!-- source: CN V2.7 p108; unit 763 -->

```text
diff --git a/drivers/media/i2c/rk628/rk628_csi_v4l2.c b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
index 32182d4433605..36568f5a081e0 100644

--- a/drivers/media/i2c/rk628/rk628_csi_v4l2.c
+++ b/drivers/media/i2c/rk628/rk628_csi_v4l2.c
@@ -1347,7 +1347,7 @@ static void rk628_csi_initial_setup(struct v4l2_subdev *sd)
      def_edid.start_block = 0;
      def_edid.blocks = 2;
      if (csi->rk628->version >= RK628F_VERSION)
-          def_edid.edid = rk628f_edid_init_data;
+          def_edid.edid = edid_init_data;
      else
           def_edid.edid = edid_init_data;
      rk628_csi_s_edid(sd, &def_edid);
```

<!-- source: CN V2.7 p108; unit 764 -->

#### 6.15.7 Ошибки захвата

<!-- source: CN V2.7 p108; unit 765 -->

(1) Android 9.0 и новее, Linux

<!-- source: CN V2.7 p108; unit 766 -->

Для захвата на Rockchip Android 9.0 и новее или Linux используйте v4l2-ctl. Сначала выполните media-ctl -d /dev/mediaX -p. Нумерация зависит от платформы. При отключении CIF часто остаётся media0; RK3399 с PHY1 может использовать media1. Учитывайте конфигурацию камеры платформы. При отсутствии RK628 в топологии проверьте DTS. Если разрешения топологии отличаются от входного, согласуйте их через media-ctl.

<!-- source: CN V2.7 p108; unit 767 -->

Затем выполните:

<!-- source: CN V2.7 p108; unit 768 -->

```text
v4l2-ctl -d /dev/video0 --set-fmt-
video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=3`
```

<!-- source: CN V2.7 p108; unit 769 -->

Постоянный вывод <<<<<<<<<< означает нормальный захват и обычно исправную работу драйвера. При постоянных или периодических ошибках:

<!-- source: CN V2.7 p108; unit 770 -->

```text
rkisp1: MIPI mis error:
```

<!-- source: CN V2.7 p108; unit 771 -->

Причина может быть аппаратной. Проверьте разветвления HDMI и согласование импеданса. Некоторые платы добавляют последовательные резисторы, отсутствующие в эталонной схеме; оригинал использует 0 Ом без особой необходимости. Ненулевые значения могут вызывать периодические ошибки. Анализируйте конкретную плату и сигналы между RK628 и хостом.

<!-- source: CN V2.7 p108; unit 772 -->

Другой возможный журнал:

<!-- source: CN V2.7 p108; unit 773 -->

```text
rkisp-vir0: MIPI error: overflow: 0x00000001
```

<!-- source: CN V2.7 p108; unit 774 -->

Такой журнал возможен на RK356X/RV11XX при входе 4K в ISP. Оригинал рекомендует путь RK628+VICAP; см. настройку VICAP в руководстве.

<!-- source: CN V2.7 p108; unit 775 -->

SIZE_ERROR может указывать на несовпадение разрешений, например вход 720p при захвате 1080p. Проверьте все разрешения топологии и v4l2-ctl. Оригинал рекомендует сначала тестировать везде 1080p.

<!-- source: CN V2.7 p108; unit 776 -->

```text
rkisp1 ff910000.rkisp1: CIF_ISP_PIC_SIZE_ERROR
```

<!-- source: CN V2.7 p109; unit 777 -->

Обычно система определяет разрешение через /dev/v4l-subdev2, но media-ctl -p может показывать /dev/v4l-subdev3:

<!-- source: CN V2.7 p109; unit 778 -->

```text
 - entity 70: m00_b_rk628-csi rk628-csi (1 pad, 1 link)
       type V4L2 subdev subtype Sensor
       device node name /dev/v4l-subdev3

pad0: Source
   [fmt:UYVY2X8/1280x720]
   -> "rockchip-csi2-dphy0":0 []
```

<!-- source: CN V2.7 p109; unit 779 -->

Тогда приложение не определяет разрешение и может выводить CIF_ISP_PIC_SIZE_ERROR. Измените jni/native.cpp приложения Android следующим образом:

<!-- source: CN V2.7 p109; unit 780 -->

```text
strcat(video_name, "/dev/v4l-subdev2");
```

<!-- source: CN V2.7 p109; unit 781 -->

Замените на:

<!-- source: CN V2.7 p109; unit 782 -->

```text
strcat(video_name, "/dev/v4l-subdev3");
```

<!-- source: CN V2.7 p109; unit 783 -->

(2) Нет кадров при 4K

<!-- source: CN V2.7 p109; unit 784 -->

4K использует более высокие частоты, поэтому причиной может быть качество сигнала. ISP RK3399 также требует повышенной частоты; см. способ настройки разгона ISP RK3399.

<!-- source: CN V2.7 p109; unit 785 -->

#### 6.15.8 APK не открывается

<!-- source: CN V2.7 p109; unit 786 -->

Выпущенный патч содержит исходники rkCamera2. Соберите их в дереве системы, например разместив в корне и выполнив mmm для каталога APK. Возможные причины сбоя:

<!-- source: CN V2.7 p109; unit 787 -->

(1) Библиотеки-зависимости

<!-- source: CN V2.7 p109; unit 788 -->

Установка только APK может вызвать:

<!-- source: CN V2.7 p109; unit 789 -->

```text
AndroidRuntime: java.lang.UnsatisfiedLinkError: dlopen failed: library
"/system/lib64/libhdmiinput_jni.so" needed or dlopened by

"/apex/com.android.runtime/lib64/libnativeloader.so" is not accessible for
the namespace "classloader-namespace"
```

<!-- source: CN V2.7 p109; unit 790 -->

Соберите и упакуйте в SDK, чтобы библиотеки вошли в образ.

<!-- source: CN V2.7 p109; unit 791 -->

(2) Права файлов

<!-- source: CN V2.7 p109; unit 792 -->

APK обращается к узлам RK628 через ioctl, например:

<!-- source: CN V2.7 p109; unit 793 -->

```text
HdmiInput-navtive: openDevice(113): open /dev/v4l-subdev2
failed,erro=Permission denied
```

<!-- source: CN V2.7 p109; unit 794 -->

Сначала проверьте права: исходный патч задаёт режим 666. Поскольку APK обращается к узлам устройств, оригинал также предлагает проверить отключение SELinux командой getenforce. Это описание исходной отладочной среды, а не рекомендация ослаблять защиту серийной системы.

<!-- source: CN V2.7 p109; unit 795 -->

(3) Настройка верхнего уровня

<!-- source: CN V2.7 p109; unit 796 -->

Для Android 9.0 и новее настройте camera3_profiles.xml, для более ранних — cam_board.xml. Проверьте dumpsys media.camera: отсутствие записей может означать отсутствие настройки:

<!-- source: CN V2.7 p110; unit 797 -->

```text
$ dumpsys media.camera

== Service global info: ==


Number of camera devices: 1
Number of normal camera devices: 1
```

<!-- source: CN V2.7 p110; unit 798 -->

(4) Сбой библиотеки камеры

<!-- source: CN V2.7 p110; unit 799 -->

Следующая ошибка может быть вызвана неверным именем камеры: имя из getDataFromXmlFile не совпадает с драйвером, что приводит к сбою.

<!-- source: CN V2.7 p110; unit 800 -->

```text
09-29 04:43:30.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting

another...
09-29 04:43:31.673 405 405 W ServiceManagement: Waited one second for
android.hardware.camera.provider@2.4::ICameraProvider/legacy/0. Waiting
another...
...
09-29 04:43:31.904 1404 1404 F DEBUG : backtrace:
09-29 04:43:31.904 1404 1404 F DEBUG : #00 pc 0007214e
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::handleAndroidStaticMetadata(char const*,
char const**)+546)
09-29 04:43:31.904 1404 1404 F DEBUG : #01 pc 00007895 /system/lib/vndk-
28/libexpat.so (doContent+432)
09-29 04:43:31.905 1404 1404 F DEBUG : #02 pc 0000637b /system/lib/vndk-

28/libexpat.so (contentProcessor+40)
09-29 04:43:31.905 1404 1404 F DEBUG : #03 pc 00003825 /system/lib/vndk-
28/libexpat.so (XML_ParseBuffer+84)
09-29 04:43:31.905 1404 1404 F DEBUG : #04 pc 000711ad
/vendor/lib/hw/camera.rk30board.so
(android::camera2::CameraProfiles::getDataFromXmlFile()+148)
09-29 04:43:31.905 1404 1404 F DEBUG : #05 pc 00071e97
/vendor/lib/hw/camera.rk30board.so
(android::camera2::ChromeCameraProfiles::init()+86)
09-29 04:43:31.905 1404 1404 F DEBUG : #06 pc 000734c7
/vendor/lib/hw/camera.rk30board.so (android::camera2::PlatformData::init()+198)
09-29 04:43:31.905 1404 1404 F DEBUG : #07 pc 000cecb3

/vendor/lib/hw/camera.rk30board.so (initCameraHAL()+46)
...
```

<!-- source: CN V2.7 p110; unit 801 -->

Если требуется V4L2 (Android 9.0 и новее), замените name="rk628-csi" на name="rk628-csi-v4l2" в camera3_profiles_rk3399.xml, как показано ниже:

<!-- source: CN V2.7 p110; unit 802 -->

```text
hardware/rockchip/camera
--- a/etc/camera/camera3_profiles_rk3399.xml
+++ b/etc/camera/camera3_profiles_rk3399.xml

@@ -769,7 +769,7 @@

 <!-- ******************PSL specific section end
**************************************************************-->
   </Profiles>
-  <Profiles cameraId="0" name="rk628-csi" moduleId="m00">
+  <Profiles cameraId="0" name="rk628-csi-v4l2" moduleId="m00">
```

<!-- source: CN V2.7 p111; unit 803 -->

(5) Сбои APK из-за разрешений

<!-- source: CN V2.7 p111; unit 804 -->

Журнал при этой проблеме обычно выглядит следующим образом:

<!-- source: CN V2.7 p111; unit 805 -->

Если требуется V4L2 (Android 9.0 и новее), переименуйте rk628-csi в rk628-csi-v4l2.

<!-- source: CN V2.7 p111; unit 806 -->

```text
09-24 10:21:20.154 1552 1570 E AndroidRuntime: FATAL EXCEPTION: Thread-2
09-24 10:21:20.154 1552 1570 E AndroidRuntime: Process:

com.android.rockchip.camera2, PID: 1552
09-24 10:21:20.154 1552 1570 E AndroidRuntime: java.lang.IllegalStateException:
startRecording() called on an uninitialized AudioRecord.
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
android.media.AudioRecord.startRecording(AudioRecord.java:983)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
com.android.rockchip.camera2.AudioStream$recordSound.run(AudioStream.java:199)
09-24 10:21:20.154 1552 1570 E AndroidRuntime: at
java.lang.Thread.run(Thread.java:764)
09-24 10:21:20.164 464 820 W ActivityManager: Force finishing activity
com.android.rockchip.camera2/.RockchipCamera2
09-24 10:21:20.183 1552 1552 D RockchipCamera2: onPause
```

<!-- source: CN V2.7 p111; unit 807 -->

Для устранения проблемы можно использовать следующий патч:

<!-- source: CN V2.7 p111; unit 808 -->

```text
packages/apps/rkCamera2
--- a/AndroidManifest.xml

+++ b/AndroidManifest.xml
@@ -4,7 +4,8 @@
   package="com.android.rockchip.camera2">

      <uses-permission android:name="android.permission.CAMERA" />
-     <uses-permission
android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
+     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
/>
+     <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <application
      android:allowBackup="true"
      android:icon="@mipmap/ic_launcher"

diff --git a/src/com/android/rockchip/camera2/RockchipCamera2.java b/src/com/android/rockchip/camera2/RockchipCamera2.java
index 9dc29b8..02ee104 100755
--- a/src/com/android/rockchip/camera2/RockchipCamera2.java
+++ b/src/com/android/rockchip/camera2/RockchipCamera2.java
@@ -100,9 +100,11 @@ public class RockchipCamera2 extends Activity {
      if (ActivityCompat.checkSelfPermission(this,
         Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
         && ActivityCompat.checkSelfPermission(this,
-             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=
PackageManager.PERMISSION_GRANTED) {
+             Manifest.permission.WRITE_EXTERNAL_STORAGE) !=

PackageManager.PERMISSION_GRANTED
+        && ActivityCompat.checkSelfPermission(this,
+             Manifest.permission.RECORD_AUDIO) !=
PackageManager.PERMISSION_GRANTED) {
         ActivityCompat.requestPermissions(RockchipCamera2.this,
-          new String[] { Manifest.permission.CAMERA,
Manifest.permission.WRITE_EXTERNAL_STORAGE },
+          new String[] { Manifest.permission.CAMERA,

Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO},
           REQUEST_CAMERA_PERMISSION);
         return;
      }
```

<!-- source: CN V2.7 p112; unit 809 -->

<!-- source: CN V2.7 p112; unit 810 -->

#### 6.15.9 Подключение к rkcif в DTS: предварительный просмотр в APK не работает

<!-- source: CN V2.7 p112; unit 811 -->

На RK356X с Android 11, версия кода R10/R11, если DTS подключает RK628 к rkcif и захват кадров работает, но предварительный просмотр в APK не запускается, причиной может быть отсутствие поддержки этой цепочки в cameraHAL версий R10 и R11. Согласно исходному документу, в R9 этой проблемы нет. Порядок диагностики и устранения:

<!-- source: CN V2.7 p112; unit 812 -->

(1) Включите отладку cameraHAL:

<!-- source: CN V2.7 p112; unit 813 -->

```text
setprop persist.vendor.camera.hal.debug 5
```

<!-- source: CN V2.7 p112; unit 814 -->

(2) Сохраните logcat при ошибке открытия APK. Ключевые записи журнала:

<!-- source: CN V2.7 p112; unit 815 -->

![Оригинальный технический рисунок — EN V2.3, p107](/docs/rockchip-rk628-porting/assets/en-p107-X551.png)

*Оригинальный технический рисунок: EN V2.3, p107.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:rockchip-csi2-dphy0, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:1, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:rkisp_rawwr0, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:4, sinkName:rkisp_rawwr2, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:5, sinkName:rkisp_rawwr3, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x2006:V4L2_MBUS_FMT_UYVY8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:0, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionParams, width:1920, height:1080, left:0, top:0, target:0, pad:2, entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:2, format:0x2008:V4L2_MBUS_FMT_YUYV8_2X8, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:3, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:0, sinkName:none, sinkPad:1, enable:1, flags:1
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : stream ratios: 1.777778
D RkCamera: <HAL> RKISP2GraphConfig: @ isNeedPathCrop : mp_need_crop 1, sp_need_crop 0, sp_enabled 0
D RkCamera: <HAL> RKISP2GraphConfig: @ calc_crop : src_ratio:1.777778, dst_ratio:1.777778, src(1920x1080), dst(1920x1080)
I RkCamera: <HAL> RKISP2GraphConfig: @addSelectionVideoParams, width:1920, height:1080, left:0, top:0, target:0, type:1, flags:0 entityName:none
I RkCamera: <HAL> RKISP2GraphConfig: @addFormatParams, entityName:none, width:1920, height:1080, pad:0, format:0x3231564e:V4L2_PIX_FMT_NV12, field:0
I RkCamera: <HAL> RKISP2GraphConfig: @addLinkParams, srcName:none, srcPad:2, sinkName:none, sinkPad:0, enable:1, flags:1
I RkCamera: <HAL> RKISP2GraphConfig: @getImguMediaCtlConfig : No need for selfPath
```

<!-- source: CN V2.7 p112; unit 816 -->

Если появляются приведённые записи, cameraHAL по умолчанию настроил соответствующую цепочку на rkisp, тогда как DTS задаёт rkcif. В этом месте исходника cameraHAL написано как ameraHAL.

<!-- source: CN V2.7 p112; unit 817 -->

(3) Устранение

<!-- source: CN V2.7 p112; unit 818 -->

Внесите следующие изменения в hardware/rockchip/camera:

<!-- source: CN V2.7 p112; unit 819 -->

```text
diff --git a/psl/rkisp2/RKISP2GraphConfig.cpp b/psl/rkisp2/RKISP2GraphConfig.cpp
index 2a5fa5a..3d2409c 100755
--- a/psl/rkisp2/RKISP2GraphConfig.cpp

+++ b/psl/rkisp2/RKISP2GraphConfig.cpp
@@ -76,6 +76,7 @@ const string MEDIACTL_POSTVIEWNAME = "postview";

 const string MEDIACTL_STATNAME = "rkisp1-statistics";
 const string MEDIACTL_VIDEONAME_CIF = "stream_cif_dvp_id0";
+const string MEDIACTL_VIDEONAME_CIF_MIPI_ID0 = "stream_cif_mipi_id0";

 RKISP2GraphConfig::RKISP2GraphConfig() :
      mManager(nullptr),
@@ -2620,6 +2621,13 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
            addLinkParams("rkisp-isp-subdev", 2, "rkisp_mainpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

            addLinkParams("rkisp-isp-subdev", 2, "rkisp_selfpath", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
         }
+     } else if(mipName2.find("mipi") != std::string::npos) {
+        addLinkParams(mipName, mipSrcPad, mipName2, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

+        addLinkParams(mipName2, 1, "stream_cif_mipi_id0", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 2, "stream_cif_mipi_id1", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 3, "stream_cif_mipi_id2", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        addLinkParams(mipName2, 4, "stream_cif_mipi_id3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
+        mSensorLinkedToCIF = true;
      } else {
         addLinkParams(mipName, mipSrcPad, csiName, csiSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);

         addLinkParams(csiName, csiSrcPad, IspName, ispSinkPad, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
@@ -2628,6 +2636,12 @@ status_t RKISP2GraphConfig::getImguMediaCtlConfig(int32_t
cameraId,
         addLinkParams(csiName, 5, "rkisp_rawwr3", 0, 1,
MEDIA_LNK_FL_ENABLED, mediaCtlConfig);
      }
   }
+  if(mSensorLinkedToCIF){
+     addImguVideoNode(IMGU_NODE_VIDEO, MEDIACTL_VIDEONAME_CIF_MIPI_ID0,
mediaCtlConfig);
+     addFormatParams(MEDIACTL_VIDEONAME_CIF_MIPI_ID0, mCurSensorFormat.width,
mCurSensorFormat.height,

+           0, V4L2_PIX_FMT_NV12, 0, 0, mediaCtlConfig);
+     return OK;
+  }
   // isp input pad format and selection config
   addFormatParams(IspName, ispInWidth, ispInHeight, ispSinkPad, ispInFormat,
0, 0, mediaCtlConfig);
   addSelectionParams(IspName, ispInWidth, ispInHeight, 0, 0,
V4L2_SEL_TGT_CROP, ispSinkPad, mediaCtlConfig);
```

<!-- source: CN V2.7 p113; unit 820 -->

<!-- source: CN V2.7 p113; unit 821 -->

#### 6.15.10 Управление GPIO RK628

<!-- source: CN V2.7 p113; unit 822 -->

В месте, где требуется управление GPIO, непосредственно вызовите интерфейс GPIO. Он включает настройку IOMUX, направления GPIO и уровня сигнала. Например, следующие операции переводят I2C_SDA_HDMI и I2C_SCL_HDMI в режим GPIO.

<!-- source: CN V2.7 p113; unit 823 -->

```text
rk628_gpio_direction_output(rk628, GPIO1_B1, GPIO_REG_HIGH);
rk628_gpio_direction_output(rk628, GPIO1_B2, GPIO_REG_HIGH)；
```

<!-- source: CN V2.7 p113; unit 824 -->

Для восстановления исходной функции вызовите следующий интерфейс:

<!-- source: CN V2.7 p113; unit 825 -->

```text
rk628_pinctrl_set_mux(rk628, GPIO1_B1, DDCM0SDARX);
rk628_pinctrl_set_mux(rk628, GPIO1_B2, DDCM0SCLRX)；
```

<!-- source: CN V2.7 p114; unit 826 -->

#### 6.15.11 Ошибка регистрации звуковой карты

<!-- source: CN V2.7 p114; unit 827 -->

В следующем примере после запуска системы звуковая карта hdmiin не обнаруживается:

<!-- source: CN V2.7 p114; unit 828 -->

```text
# cat /proc/asound/cards
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                rockchip,hdmiin
```

<!-- source: CN V2.7 p114; unit 829 -->

Сначала проверьте, успешно ли загружены устройства soc dai и codec dai, от которых зависит звуковая карта:

<!-- source: CN V2.7 p114; unit 830 -->

```text
rk3399:/ # cat /sys/kernel/debug/asoc/components
...
dummy-codec

ff8a0000.i2s
ff8a0000.i2s
ff880000.i2s
ff880000.i2s
...
rk3399:/ # cat /sys/kernel/debug/asoc/dais
...
ff8a0000.i2s
ff880000.i2s
dummy-codec
....
```

<!-- source: CN V2.7 p114; unit 831 -->

Если эти узлы не загружаются, проверьте defconfig и DTS.

<!-- source: CN V2.7 p114; unit 832 -->

Если soc dai и codec dai зарегистрированы успешно, а звуковая карта — нет, возможно, недостаточно ресурсов DMA. В исходнике отмечено, что это особенно часто встречается на RK3399. Для ядер 4.19 и новее добавьте в узел i2s следующее свойство:

<!-- source: CN V2.7 p114; unit 833 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3399.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3399.dtsi

@@ -1788,6 +1788,7 @@
           clocks = <&cru SCLK_I2S2_8CH>, <&cru HCLK_I2S2_8CH>;
           resets = <&cru SRST_I2S2_8CH>, <&cru SRST_H_I2S2_8CH>;
           reset-names = "reset-m", "reset-h";
+          rockchip,capture-only;
           power-domains = <&power RK3399_PD_SDIOAUDIO>;
           status = "disabled";
```

<!-- source: CN V2.7 p114; unit 834 -->

## 7. Типовые задачи

<!-- source: CN V2.7 p114; unit 835 -->

### 7.1 Настройка тактового сигнала 24M RK628 от другого SoC

<!-- source: CN V2.7 p114; unit 836 -->

Ниже приведены настройки для нескольких ведущих SoC Rockchip. Предполагается, что все тактовые сигналы, заданные в примерах DTS, включены в коде. Если они не включены, после загрузки сигнал 24M будет отключён, что вызовет ошибки связи I2C.

<!-- source: CN V2.7 p115; unit 837 -->

#### 7.1.1 Добавление поддержки 24M на RK3399

<!-- source: CN V2.7 p115; unit 838 -->

(1) Укажите следующую настройку в DTS rk628:

<!-- source: CN V2.7 p115; unit 839 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&rk628_rst>, <&clk_testout2>;
assigned-clocks = <&cru SCLK_TESTCLKOUT2>;

assigned-clock-rates = <24000000>;
clocks = <&cru SCLK_TESTCLKOUT2>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 840 -->

(2) Добавьте настройку PINCTRL выводов ввода-вывода согласно фактическим аппаратным соединениям:

<!-- source: CN V2.7 p115; unit 841 -->

```text
&pinctrl {
      test {
           clk_testout2: clk_testout2 {

           rockchip,pins = <0 8 RK_FUNC_3 &pcfg_pull_none>;
      };
};
```

<!-- source: CN V2.7 p115; unit 842 -->

#### 7.1.2 Добавление поддержки 24M на RK3288

<!-- source: CN V2.7 p115; unit 843 -->

(1) Укажите следующую настройку в DTS rk628:

<!-- source: CN V2.7 p115; unit 844 -->

```text
pinctrl-names = "default";
pinctrl-0 = <&test_clkout>;
assigned-clocks = <&cru SCLK_TESTOUT_SRC>;

assigned-clock-parents = <&xin24m>;
clocks = <&cru SCLK_TESTOUT>;
clock-names = "soc_24M";
```

<!-- source: CN V2.7 p115; unit 845 -->

(2) Добавьте настройку PINCTRL выводов ввода-вывода согласно фактическим аппаратным соединениям:

<!-- source: CN V2.7 p115; unit 846 -->

```text
&pinctrl {
      test {
           test_clkout: test-clkout {

                 rockchip,pins = <0 17 RK_FUNC_1 &pcfg_pull_none>;
           };
      };
};
```

<!-- source: CN V2.7 p115; unit 847 -->

#### 7.1.3 Добавление поддержки 24M на RK356X

<!-- source: CN V2.7 p115; unit 848 -->

RK356X имеет несколько выводов, способных выдавать 24 МГц, в том числе REF_CLKOUT (clk_wifi/gpio0_a0), CAM_CLKOUT1 (clk_cam1_out/gpio4_b0) и ETH_REFCLK_25M_M0 (clk_mac1_out/gpio3_b0). В следующем примере используется clk_wifi.

<!-- source: CN V2.7 p115; unit 849 -->

(1) Укажите следующую настройку в DTS rk628:

<!-- source: CN V2.7 p115; unit 850 -->

```text

&i2c2_rk628 {
   pinctrl-names = "default";
   pinctrl-0 = <&rk628_reset &refclk_pins>;

   assigned-clocks = <&pmucru CLK_WIFI>;
   assigned-clock-rates = <24000000>;
   clocks = <&pmucru CLK_WIFI>;
   clock-names = "soc_24M";
};

&pinctrl {
   rk628 {
      rk628_reset: rk628-reset {
         rockchip,pins = <2 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
      };
   };

};
```

<!-- source: CN V2.7 p116; unit 851 -->

<!-- source: CN V2.7 p116; unit 852 -->

(2) Следующая настройка уже присутствует в rk3568-pinctrl.dtsi:

<!-- source: CN V2.7 p116; unit 853 -->

```text
&pinctrl {
   ......

   refclk {
      /omit-if-no-ref/
      refclk_pins: refclk-pins {
         rockchip,pins =
           /* refclk_ou */
           <0 RK_PA0 1 &pcfg_pull_none>;
      };
   };
   ......
};
```

<!-- source: CN V2.7 p116; unit 854 -->

Для микросхем Rockchip, не перечисленных здесь, настройка сигнала 24M описана в Rockchip_Develop_Guide_Gpio_Output_Clocks_CN.pdf.

<!-- source: CN V2.7 p116; unit 855 -->

### 7.2 Поддержка двух RK628

<!-- source: CN V2.7 p116; unit 856 -->

#### 7.2.1 Поддержка HDMI2CSI + HDMI2CSI

<!-- source: CN V2.7 p116; unit 857 -->

##### 7.2.1.1 Важные замечания

<!-- source: CN V2.7 p116; unit 858 -->

(1) Два RK628 работают аналогично системе с двумя камерами. Для одновременной работы обоих RK628 ведущий SoC должен поддерживать два контроллера ISP, одновременно обрабатывающих два входных потока, как, например, RK3399.

<!-- source: CN V2.7 p116; unit 859 -->

<!-- source: CN V2.7 p116; unit 860 -->

(2) При разработке аппаратной части подключите два RK628 к разным шинам I2C либо к одной шине I2C, задав им разные адреса I2C.

<!-- source: CN V2.7 p116; unit 861 -->

<!-- source: CN V2.7 p116; unit 862 -->

(3) Настройка DTS должна соответствовать аппаратной схеме. Подключение конкретного RK628 к mipi_phy_rx0 или mipi_phy_tx1rx1 должно быть соответствующим образом отражено в DTS.

<!-- source: CN V2.7 p116; unit 863 -->

<!-- source: CN V2.7 p116; unit 864 -->

(4) При использовании двух RK628 для HDMI2CSI нельзя использовать одинаковые управляющие линии RESET и INT для обоих устройств: это приведёт к некорректной работе.

<!-- source: CN V2.7 p116; unit 865 -->

<!-- source: CN V2.7 p117; unit 866 -->

##### 7.2.1.2 Настройка DTS ядра

<!-- source: CN V2.7 p117; unit 867 -->

В следующем примере два RK628 настраиваются для RK3399.

<!-- source: CN V2.7 p117; unit 868 -->

(1) rk628 -> mipi_dphy_rx0 -> rkisp1_0: для первого тракта index равен 0, а facing задан как back.

<!-- source: CN V2.7 p117; unit 869 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
           remote-endpoint = <&hdmi2mipi_in>;
           data-lanes = <1 2 3 4>;
         };
      };
   };

};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;


         hdmi2mipi_in: endpoint@1 {
           reg = <1>;
           remote-endpoint = <&rk628_out>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;


         dphy_rx0_out: endpoint@0 {
           reg = <0>;
           remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;

      isp0_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p118; unit 870 -->

<!-- source: CN V2.7 p118; unit 871 -->

(2) rk628 -> mipi_dphy_tx1rx1 -> rkisp1_1: для второго тракта index равен 1, а facing задан как front.

<!-- source: CN V2.7 p118; unit 872 -->

```text
&i2c4 {
   status = "okay";


   rk628_csi_v4l2_1: rk628_csi_v4l2_1@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio3>;
      interrupts = <12 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq1>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;
      reset-gpios = <&gpio4 RK_PD3 GPIO_ACTIVE_LOW>;

      plugin-det-gpios = <&gpio0 RK_PD7 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <1>;
      rockchip,camera-module-facing = "front";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out1: endpoint {
           remote-endpoint = <&hdmi2mipi_in1>;
           data-lanes = <1 2 3 4>;
         };
      };
   };
};

&mipi_dphy_tx1rx1 {

   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;
         #size-cells = <0>;

         hdmi2mipi_in1: endpoint@1 {

           reg = <1>;
           remote-endpoint = <&rk628_out1>;
           data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;
         #size-cells = <0>;

         dphy_tx1rx1_out: endpoint@0 {
           reg = <0>;

           remote-endpoint = <&isp1_mipi_in>;
         };
      };
   };
};

&rkisp1_1 {
   status = "okay";

   port {
      #address-cells = <1>;
      #size-cells = <0>;


      isp1_mipi_in: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dphy_tx1rx1_out>;
      };
   };
};
```

<!-- source: CN V2.7 p119; unit 873 -->

<!-- source: CN V2.7 p119; unit 874 -->

##### 7.2.1.3 Настройка Android

<!-- source: CN V2.7 p119; unit 875 -->

(1) Замечания по настройке camera3_profiles.xml:

<!-- source: CN V2.7 p119; unit 876 -->

moduleId должен совпадать с index в DTS.

<!-- source: CN V2.7 p119; unit 877 -->

Первый RK628:

<!-- source: CN V2.7 p120; unit 878 -->

![Оригинальный технический рисунок — EN V2.3, p115](/docs/rockchip-rk628-porting/assets/en-p115-X581.png)

*Оригинальный технический рисунок: EN V2.3, p115.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
</Profiles>
<Profiles cameraId="0" name="rk628-csi" moduleId="m00">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 879 -->

Второй RK628:

<!-- source: CN V2.7 p120; unit 880 -->

![Оригинальный технический рисунок — EN V2.3, p115](/docs/rockchip-rk628-porting/assets/en-p115-X582.png)

*Оригинальный технический рисунок: EN V2.3, p115.*

Редактируемая расшифровка полностью видимого текста снимка. Обрезанные символы не восстановлены предположениями; фрагменты не обязательно пригодны для самостоятельного выполнения.

```text
</Profiles>
<Profiles cameraId="1" name="rk628-csi" moduleId="m01">
    <Supported_hardware>
        <hwType value="SUPPORTED_HW_RKISP1"/>
    </Supported_hardware>
```

<!-- source: CN V2.7 p120; unit 881 -->

(2) Для одновременного использования обоих RK628 добавьте поддержку в cameraHAL, внеся следующие изменения в SDK/hardware/rockchip/camera:

<!-- source: CN V2.7 p120; unit 882 -->

<!-- source: CN V2.7 p120; unit 883 -->

```text
diff --git a/common/platformdata/PlatformData.cpp b/common/platformdata/PlatformData.cpp

index 36d2ac9..d3fcb4b 100755
--- a/common/platformdata/PlatformData.cpp
+++ b/common/platformdata/PlatformData.cpp
@@ -1047,7 +1047,7 @@ CameraHWInfo::CameraHWInfo() :
   mProductName = "<not_set>";
   mManufacturerName = "<not set>";
   mCameraDeviceAPIVersion = CAMERA_DEVICE_API_VERSION_3_3;
-  mSupportDualVideo = false;
+  mSupportDualVideo = true;
   mSupportExtendedMakernote = false;
   mSupportFullColorRange = true;
   mSupportIPUAcceleration = false;
```

<!-- source: CN V2.7 p120; unit 884 -->

#### 7.2.2 Поддержка HDMI2CSI + HDMI2DSI

<!-- source: CN V2.7 p120; unit 885 -->

##### 7.2.2.1 Настройка DTS ядра

<!-- source: CN V2.7 p120; unit 886 -->

В комбинации HDMI2CSI + HDMI2DSI один RK628 подключается к ведущему SoC через подсистему камеры, а другой — к дисплею. В следующем примере используется RK3399.

<!-- source: CN V2.7 p120; unit 887 -->

(1) Настройка HDMI2CSI

<!-- source: CN V2.7 p120; unit 888 -->

Используйте rk628 -> mipi_phy_rx0 -> rkisp1_0 либо rk628 -> mipi_dphy_tx1rx1 -> rkisp1_1. В примере используется подключение к rkisp1_0.

<!-- source: CN V2.7 p120; unit 889 -->

```text
&i2c1 {
   status = "okay";


   rk628_csi_v4l2: rk628_csi_v4l2@50 {
      compatible = "rockchip,rk628-csi-v4l2";
      reg = <0x50>;
      //clocks = <&ext_cam_clk>;
      //clock-names = "xvclk";

      interrupt-parent = <&gpio4>;
      interrupts = <16 IRQ_TYPE_LEVEL_LOW>;
      pinctrl-names = "default";
      pinctrl-0 = <&rk628_irq>;
      //power-gpios = <&gpio0 RK_PD5 GPIO_ACTIVE_HIGH>;

      reset-gpios = <&gpio4 RK_PD2 GPIO_ACTIVE_LOW>;
      plugin-det-gpios = <&gpio0 RK_PD6 GPIO_ACTIVE_LOW>;
      rockchip,camera-module-index = <0>;
      rockchip,camera-module-facing = "back";
      rockchip,camera-module-name = "RK628-CSI";
      rockchip,camera-module-lens-name = "NC";
      port {
         rk628_out: endpoint {
            remote-endpoint = <&hdmi2mipi_in>;
            data-lanes = <1 2 3 4>;
         };
      };

   };
};

&mipi_dphy_rx0 {
   status = "okay";

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         #address-cells = <1>;

         #size-cells = <0>;

         hdmi2mipi_in: endpoint@1 {
            reg = <1>;
            remote-endpoint = <&rk628_out>;
            data-lanes = <1 2 3 4>;
         };
      };

      port@1 {
         reg = <1>;
         #address-cells = <1>;

         #size-cells = <0>;

         dphy_rx0_out: endpoint@0 {
            reg = <0>;
            remote-endpoint = <&isp0_mipi_in>;
         };
      };
   };
};

&rkisp1_0 {
   status = "okay";


   port {
      #address-cells = <1>;
      #size-cells = <0>;
      isp0_mipi_in: endpoint@0 {
         reg = <0>;

         remote-endpoint = <&dphy_rx0_out>;
      };
   };
};
```

<!-- source: CN V2.7 p121; unit 890 -->

<!-- source: CN V2.7 p122; unit 891 -->

<!-- source: CN V2.7 p122; unit 892 -->

(2) Настройка HDMI2DSI

<!-- source: CN V2.7 p122; unit 893 -->

Используйте настройку преобразования HDMI2DSI из раздела 2.4.5.

<!-- source: CN V2.7 p122; unit 894 -->

##### 7.2.2.2 Настройка Android

<!-- source: CN V2.7 p122; unit 895 -->

(1) HDMI2CSI: используйте настройку одного тракта RK628 HDMI2CSI и правильно настройте camera3_profiles.xml.

<!-- source: CN V2.7 p122; unit 896 -->

(2) HDMI2DSI: настройка со стороны Android не требуется.

{% endraw %}

