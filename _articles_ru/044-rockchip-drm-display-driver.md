---
title: "Драйвер дисплея Rockchip DRM: полное руководство по VOP, DCLK и нескольким экранам"
description: "Полный справочник Rockchip DRM V5.9.0: драйверы U-Boot и ядра, DTS, цветовой охват, распределение VOP/DCLK, многоэкранный вывод, развёртка, пропускная способность и отладка."
translation_key: "044-rockchip-drm-display-driver"
slug: "044-rockchip-drm-display-driver"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: ["Sige7", "Sige3", "Sige5", "CM5"]
tags: ["DRM", "VOP", "DCLK", "RK3588", "RK3576", "Linux"]
keywords: "ArmSoM Rockchip DRM VOP DCLK RK3588 RK3576 multi-screen"
excerpt: "Полный справочник Rockchip DRM V5.9.0: драйверы U-Boot и ядра, DTS, цветовой охват, распределение VOP/DCLK, многоэкранный вывод, развёртка, пропускная способность и отладка."
---

{% raw %}
# Драйвер дисплея Rockchip DRM: полное руководство по VOP, DCLK и нескольким экранам

## Применимость к ArmSoM

Это справочник производителя по платформе, а не отчёт об испытаниях ArmSoM. Официальная документация ArmSoM указывает RK3588 для Sige7, RK3568B2 для Sige3 и RK3576 для Sige5/CM5. Соответствующие главы по SoC можно использовать как ориентир, но необходимо проверить реальные интерфейсы платы, ветку SDK/BSP, дерево устройств и патчи ядра. Источник охватывает Linux 4.4, 4.19, 5.10 и 6.1 согласно таблице ниже; одна лишь версия ядра не гарантирует наличия этих функций производителя в основном ядре Linux. Изменения аппаратуры, регистров, частот, памяти и напряжений не проверялись.

Источники: китайское и английское руководства *Rockchip DRM Display Driver Developer Guide*, оба V5.9.0, соответственно 81 и 87 страниц. Китайская статья следует китайскому оригиналу; английская и русская — английскому. Нумерация глав совпадает, но есть различия в оформлении таблиц, терминах и формулировках примеров; см. [редакторские примечания](/docs/rockchip-drm-display-driver/EDITORIAL-NOTES.md). Китайская версия содержит все 55 рисунков китайского PDF, английская и русская — все 55 рисунков английского PDF, сохранённых отдельными файлами. Нетехнические сведения обложки, целевая аудитория и история редакций удалены; технические версии и все 12 глав сохранены. Адаптацию платы проверяйте по [официальной документации ArmSoM](https://docs.armsom.org/).

> Важно: параметры и журналы ниже — примеры оригинала, а не результаты измерений ArmSoM. Неоднозначности оригинала касаются границы 600MHz, описания деления частоты PLL, числа распределяемых слоёв и имён файлов. Исходная техническая информация сохранена, замечания перечислены в редакторских примечаниях. Изменение напряжений, частот, IOMMU и регистров требует проверки BSP и аппаратных ограничений; не применяйте примеры непосредственно на рабочем устройстве.

## Введение и версии платформ

Руководство описывает основные характеристики, порядок работы и распространённые проблемы VOP и интерфейсов дисплея процессоров Rockchip в инфраструктуре DRM. Его цель — улучшить понимание драйверов DRM и аппаратных интерфейсов, ускорить локализацию и устранение типичных неполадок.

| Микросхема | Версия ядра |
| --- | --- |
| RK3036 | Linux kernel 4.4 и новее |
| RK312X/PX3SE | Linux kernel 4.4 и новее |
| RK3288 | Linux kernel 4.4 и новее |
| RK322X/RK312XH | Linux kernel 4.4 и новее |
| RK3308 | Linux kernel 4.4 и новее |
| RK322XH/RK332X | Linux kernel 4.4 и новее |
| RK3326/PX30 | Linux kernel 4.4 и новее |
| RK3368/PX5 | Linux kernel 4.4 и новее |
| RK3399 | Linux kernel 4.4 и новее |
| RK1808 | Linux kernel 4.4 и новее |
| RV1109/RV1126 | Linux kernel 4.19 и новее |
| RK356X | Linux kernel 4.19 и новее |
| RK3588 | Linux kernel 5.10 и новее |
| RV1103/RV1106 | Linux kernel 5.10 и новее |
| RK3528 | Linux kernel 4.19 и новее |
| RK3562 | Linux kernel 5.10 и новее |
| RK3576 | Linux kernel 6.1 и новее |
| RK3506 | Linux kernel 6.1 и новее |
| RV1126B | Linux kernel 6.1 и новее |

## 1. Обзор подсистемы отображения (DSS) платформы Rockchip

Подсистема отображения — общее название программных и аппаратных средств вывода изображения на платформе Rockchip. Она включает VOP (на старых платформах, например RK3188 и RK3066, — LCDC), модули вывода сигналов RGB, BT1120, BT656, I8080 (интерфейс MCU), LVDS, MIPI DSI, EDP, DP, HDMI и соответствующие программные драйверы.

Аппаратная структура всей системы отображения показана на следующих рисунках:

![Исходный рисунок: 1. Обзор подсистемы отображения (DSS) платформы Rockchip; PDF p. 7](/docs/rockchip-drm-display-driver/assets/en-p7-X148.png)

Архитектура подсистемы отображения VOP 1.0

![Исходный рисунок: 1. Обзор подсистемы отображения (DSS) платформы Rockchip; PDF p. 7](/docs/rockchip-drm-display-driver/assets/en-p7-X150.png)

Архитектура подсистемы отображения VOP 2.0

На приведённой структурной схеме DSS в конце всего тракта отображения показан блок графического ускорения, состоящий из RGA, GPU и VPU. Это аппаратные IP-блоки, специально оптимизированные для обработки изображений и позволяющие эффективно создавать и дополнительно обрабатывать изображения. Например, GPU обеспечивает рендеринг через OpenGL, RGA выполняет двумерное масштабирование, поворот и композицию изображений, а VPU — эффективное декодирование видео. Это снижает нагрузку на CPU.

Данные после обработки этими ускорителями сохраняются в DDR, откуда их считывает VOP. В соответствии с требованиями приложения VOP выполняет наложение с альфа-каналом, преобразование цветового пространства, коррекцию гаммы и преобразование HDR, затем передаёт результат соответствующему модулю интерфейса дисплея (HDMI/DP/DSI/RGB/LVDS). Интерфейсные модули преобразуют полученные данные в потоки по своим протоколам и передают их монитору или экрану для отображения пользователю.

На платформе Rockchip используются две архитектуры VOP: VOP 1.0 и VOP 2.0. Главное различие — способ поддержки нескольких дисплеев. VOP 1.0 использует несколько VOP: обычно один VOP одновременно формирует только одну независимую временную развёртку и выводит независимое содержимое на один экран. Для двух экранов нужны два VOP. Поэтому платформы с двухэкранным выводом, например RK3288, RK3399 и PX30, имеют два независимых VOP.

VOP 2.0 использует единую архитектуру отображения: во всём SoC имеется один VOP, на выходе которого расположено несколько независимых интерфейсов Video Port (сокращённо VP). Они могут одновременно и независимо работать, формируя отдельные временные развёртки. Например, три VP на приведённой схеме VOP 2.0 позволяют одновременно выводить разное содержимое на три экрана.

Сведения о том, какие микросхемы используют VOP 1.0 и какие — VOP 2.0, приведены ниже в разделе «Возможности отображения».

## 2. Обзор DRM

DRM расшифровывается как Direct Rendering Manager и управляет выводом изображения, выделением буферов и кадровыми буферами. Соответствующая библиотека пользовательского пространства — libdrm. Она предоставляет удобные обёртки для управления дисплеем и выделения буферов. Узел устройства DRM имеет вид `/dev/dri/cardX`, где X — число от 0 до 15; по умолчанию используется `/dev/dri/card0`.

Начиная с Linux 4.4, драйверы дисплея платформы Rockchip переведены на инфраструктуру DRM.

В системе может быть несколько устройств DRM. Создаваемые ими узлы `/dev/dri/cardX` не имеют фиксированного соответствия устройствам: оно зависит от порядка загрузки драйверов DRM.

Например, в описываемых платформах Rockchip инфраструктуру DRM используют и подсистема отображения, и драйвер NPU. Поэтому обычно в системе видны два узла: `/dev/dri/card0` и `/dev/dri/card1`. Однако между card0/card1 и подсистемой отображения/NPU нет фиксированного соответствия. Как правило, первым как card0 регистрируется драйвер, загруженный раньше.

Если приложению нужно открыть устройство отображения DRM, после открытия `/dev/dri/card0` или `/dev/dri/card1` необходимо дополнительно проверить назначение устройства. На платформе Rockchip описаны два способа:

1. С помощью API `drmIsKMS(int fd)` библиотеки libdrm проверить открытое устройство и определить, поддерживает ли оно функцию отображения. Устройства NPU её не поддерживают.

2. С помощью `drmOpen("rockchip", NULL)` библиотеки libdrm явно открыть драйвер rockchip drm.

### 2.1 Основные понятия

Для управления аппаратными модулями тракта отображения DRM определяет следующие понятия:

| Основное понятие | Описание |
| --- | --- |
| CRTC | Контроллер дисплея: на Rockchip абстракция встроенного VOP (в некоторых документах LCDC) либо Video Port в VOP2 |
| Plane | Слой: на Rockchip абстракция слоя win встроенного VOP (LCDC) |
| Encoder | Преобразователь вывода: интерфейсы RGB, LVDS, DSI, eDP, DP, HDMI, CVBS, VGA |
| Connector | Интерфейс взаимодействия encoder и panel |
| Bridge | Мост: обычно регистрирует микросхему-преобразователь после encoder, например DSI2HDMI |
| Panel | Экран: абстракция различных ЖК-устройств отображения |
| GEM | Управление и выделение буферов DRM, аналогично ION и DMA BUFFER |

### 2.2 Тракт отображения

![Исходный рисунок: 2.2 Тракт отображения; PDF p. 9](/docs/rockchip-drm-display-driver/assets/en-p9-X162.png)

### 2.3 Взаимодействие драйвера DRM и libdrm

![Исходный рисунок: 2.3 Взаимодействие драйвера DRM и libdrm; PDF p. 10](/docs/rockchip-drm-display-driver/assets/en-p10-X166.png)

## 3. Программные драйверы

### 3.1 Драйвер U-Boot

Драйвер дисплея U-Boot обеспечивает прежде всего две функции: отображение загрузочного логотипа и интерфейса зарядки.

На платформе Rockchip отображение загрузочного логотипа обычно делится на два этапа: логотип U-Boot и логотип ядра.

![Исходный рисунок: 3.1 Драйвер U-Boot; PDF p. 10](/docs/rockchip-drm-display-driver/assets/en-p10-X167.png)

Логотип U-Boot по умолчанию

![Исходный рисунок: 3.1 Драйвер U-Boot; PDF p. 11](/docs/rockchip-drm-display-driver/assets/en-p11-X173.png)

Логотип ядра по умолчанию

По умолчанию оба изображения расположены в корневом каталоге Linux kernel (`logo.bmp` и `logo_kernel.bmp`). При сборке ядра они упаковываются в `resource.img`, а затем — в `Boot.img`.

При запуске U-Boot загружает оба файла в память. Логотип U-Boot отображается на этапе U-Boot, а адрес логотипа ядра в памяти передаётся из U-Boot в Linux kernel. Этот логотип отображается на этапе инициализации драйвера drm ядра.

#### 3.1.1 Каталог драйвера

```text
drivers/video/drm/
```

#### 3.1.2 Файлы драйвера

| Драйвер | Файл |
| --- | --- |
| Основная часть | rockchip_display.c<br>rockchip_crtc.c<br>rockchip_connector.c<br>rockchip_phy.c<br>rockchip_panel.c<br>rockchip_bridge.c |
| VOP | rockchip_vop.c<br>rockchip_vop_reg.c<br>rockchip_vop2.c<br>rockchip_vop2_reg.c |
| RGB | rockchip_rgb.c<br>inno_video_combo_phy.c |
| LVDS | rockchip_lvds.c<br>inno_video_combo_phy.c |
| MIPI-DSI | drm_mipi_dsi.c<br>dw_mipi_dsi2.c<br>inno_mipi_phy.c<br>inno_video_combo_phy.c<br>samsung_mipi_dcphy.c |
| eDP | rockchip_analogix_dp.c<br>rockchip_analogix_dp_reg.c |
| HDMI | dw_hdmi.c<br>rockchip_dw_hdmi.c<br>rockchip-inno-hdmi-phy.c<br>inno_hdmi.c<br>dw_hdmi_qp.c<br>rockchip_dw_hdmi_qp.c<br>phy-rockchip-samsung-hdptx-hdmi.c |
| TVE /CVBS | rockchip_drm_tve.c |
| DP | dw-dp.c<br>drm_dp_helper.c<br>phy-rockchip-usbdp.c |

В разных версиях U-Boot перечисленные файлы могут немного отличаться, однако большинство файлов драйверов и структура инфраструктуры в основном остаются прежними. Используя этот список, учитывайте фактическую версию.

#### 3.1.3 Описание интерфейсов

1\. Отображение логотипа U-Boot

```text
void rockchip_show_logo(void)
```

2\. Отображение заданного BMP-изображения; сейчас используется главным образом для логотипа зарядки

```text
void rockchip_show_bmp(const char *bmp)
```

3\. Передача из U-Boot в ядро определённых в U-Boot переменных путём изменения DTB, включая размер, адрес, формат,

временную развёртку вывода и настройки over-scan логотипа ядра.

```text
void rockchip_display_fixup(void *blob)
```

#### 3.1.4 Использование функции отображения логотипа

1\. Включение логотипа U-Boot

Логотип управляется узлом `route_xxx` соответствующего интерфейса дисплея в DTS ядра Linux; модуль отображения U-Boot и ядро Linux используют один DTB. Здесь xxx может быть dsi, edp, hdmi или lvds. Для поиска узла используйте ключевое слово route в DTS.

Например, для MIPI DSI0 найдите узел `route_dsi0` в DTS соответствующей платы и установите status в `"okay"`:

```text
&route_dsi0 {
     status = "okay";
     connect = <&vp3_out_dsi0>;
};
```

Подробное описание свойства `connect` приведено ниже в разделе «Конфигурация DTS».

2\. Полноэкранное отображение логотипа U-Boot

По умолчанию логотип расположен по центру. Для полноэкранного отображения измените узел route соответствующего интерфейса.

Например, для полноэкранного вывода через DSI0 измените свойство `logo,mode` узла `route_dis0` на `"fullscreen"`.

![Исходный рисунок: 3.1.4 Использование функции отображения логотипа; PDF p. 13](/docs/rockchip-drm-display-driver/assets/en-p13-X187.png)

3\. Требования к изображениям логотипов

Логотипы U-Boot и Linux Kernel должны иметь одинаковое разрешение. Поскольку виртуальная ширина VOP измеряется в машинных словах, ширина изображения должна быть кратна 4 пикселям. Если ширина экрана не кратна 4 и требуется полноэкранный вывод, можно округлить ширину изображения вниз до кратной 4 и одновременно задать `logo,mode = "fullscreen"`.

Поддерживаются только BMP-изображения с глубиной 8, 16, 24 и 32 бита.

Логотипы U-Boot и Linux Kernel должны включаться одновременно: необходимо предоставить и `logo.bmp`, и `logo_kernel.bmp`.

4\. Проверка журнала загрузки

Если функция логотипа включена и работает, на этапе U-Boot появляется журнал, подобный следующему:

```text
Rockchip UBOOT DRM driver version: v1.0.1
vp0 have layer nr:2[0 2 ], primary plane: 2
vp1 have layer nr:2[1 3 ], primary plane: 3
vp2 have layer nr:2[6 8 ], primary plane: 8
vp3 have layer nr:2[7 9 ], primary plane: 9
Using display timing dts
dsi@fde20000: detailed mode clock 132000 kHz, flags[a]
  H: 1080 1095 1099 1129
  V: 1920 1935 1937 1952
bus_format: 100e
VOP update mode to: 1080x1920p0, type: MIPI0 for VP3
VOP VP3 enable Esmart3[654x270->654x270@213x825] fmt[2] addr[0xedf04000]
final DSI-Link bandwidth: 880000 Kbps x 4
......
hdmi_select_link_config use tmds mode
mode:1920x1080 bus_format:0x100a
hdmi@fde80000: detailed mode clock 148500 kHz, flags[5]
  H: 1920 2008 2052 2200
  V: 1080 1084 1089 1125
bus_format: 100a
VOP update mode to: 1920x1080p0, type: HDMI0 for VP0
......
VOP VP0 enable Esmart0[654x270->654x270@633x405] fmt[2] addr[0xedf04000]
......
CLK: (uboot. arm: enter 1200000 KHz, init 1200000 KHz, kernel 0N/A)
```

Из журнала видно, что логотип отображается на VP0 и VP3.

Разрешение VP0 составляет 1920 x 1080, интерфейс — HDMI.

Разрешение VP3 составляет 1080 x 1920, интерфейс — MIPI DSI.

Размер отображаемого логотипа — 654 x 270.

5\. Поворот логотипа на фиксированный угол

Если из-за портретной или альбомной ориентации экрана требуется повернуть логотип на определённый угол, поверните изображение на ПК, сохраните его как новый файл и замените `logo.bmp` и `kernel_logo.bmp` в проекте ядра.

6\. Логотип в режиме split

В режиме split один crtc соединяется с двумя connector для подключения двух экранов. Чтобы левый и правый экраны отображали разное содержимое, составляющее единое изображение, объедините левую и правую части на ПК, сохраните результат и замените `logo.bmp` и `kernel_logo.bmp` в проекте ядра.

7\. Отображение только одного изображения

Для отображения одного изображения на этапах U-Boot и ядра используйте одинаковую картинку в `logo.bmp` и `kernel_logo.bmp` либо задайте один файл в свойствах `"logo,uboot"` и `"logo,kernel"` узла route в DTS.

8\. Поддержка логотипа с разрешением 4K

Штатные defconfig платформ не обеспечивают нормального отображения логотипов 4K. В последовательном порту появляется журнал, подобный следующему:

```text
......
bmp[logo.bmp] size[23MB] is over the limitation MAX_IMAGE_BYTES[8MB]
failed to display uboot logo
CLK: (uboot. arm: enter 1008000 KHz, init 1008000 KHz, kernel 0N/A)
 bpll 816000 KHz
 lpll 816000 KHz
......
```

Для платформы RK3576, например, необходимы следующие изменения:

```text
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c
index b1773ba6942..d1606db1ba5 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -52,7 +52,7 @@
#define RK_BLK_SIZE 512
#define BMP_PROCESSED_FLAG 8399
#define BYTES_PER_PIXEL sizeof(uint32_t)
-#define MAX_IMAGE_BYTES (8 * 1024 * 1024)
+#define MAX_IMAGE_BYTES (32 * 1024 * 1024)
DECLARE_GLOBAL_DATA_PTR;
static LIST_HEAD(rockchip_display_list);
diff --git a/include/configs/rk3576_common.h b/include/configs/rk3576_common.h
index 16abba314c5..b4a8ec3b898 100644
--- a/include/configs/rk3576_common.h
+++ b/include/configs/rk3576_common.h
@@ -22,7 +22,7 @@
#endif
#define CONFIG_SPL_LOAD_FIT_ADDRESS 0x42000000

-#define CONFIG_SYS_MALLOC_LEN (32 << 20)
+#define CONFIG_SYS_MALLOC_LEN (32 << 21)
#define CONFIG_SYS_CBSIZE 1024
#ifdef CONFIG_SUPPORT_USBPLUG
```

Кроме того, параметр `CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES` необходимо изменить на 64 MB.

Причины этих изменений:

(1) С учётом расхода памяти и стандартной таблицы разделов parameter использовать слишком большой BMP-логотип не рекомендуется. Поэтому `MAX_IMAGE_BYTES` ограничен 8 MB. Для более крупных изображений рекомендуется формат BMP BI_RLE4/BI_RLE8.

(2) Обычное BMP-изображение 4K BI_RGB 24bpp занимает около 24 MB. Стандартный размер кучи malloc на платформах обычно составляет 32 MB, и функции декодирования BMP могут не суметь выделить память.

(3) Для плавного перехода от логотипа U-Boot к логотипу ядра оба изображения обычно имеют одинаковые разрешение и формат. Поэтому объёма памяти, зарезервированного под логотипы параметром `CONFIG_DRM_MEM_RESERVED_SIZE_MBYTES` (по умолчанию 32 MB), оказывается недостаточно.

9\. Разное содержимое на разных экранах

Внесите изменения по следующему примеру: упакуйте новые изображения в `resource.img` и измените соответствующий DTS:

```text
--- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
@@ -854,7 +854,7 @@ &display_subsystem {
     route {
         route_dp1: route-dp1 {
              status = "disabled";
-             logo,uboot = "logo.bmp";
+             logo,uboot = "logo_new.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
--- a/scripts/mkimg
+++ b/scripts/mkimg
+LOGO_NEW_PATH=${srctree}/logo_new.bmp
+[ -f ${LOGO_NEW_PATH} ] && LOGO_NEW=logo_new.bmp
+
LOGO_KERNEL_PATH=${srctree}/logo_kernel.bmp
[ -f ${LOGO_KERNEL_PATH} ] && LOGO_KERNEL=logo_kernel.bmp
@@ -233,6 +236,9 @@ if [ -x ${srctree}/scripts/bmpconvert ]; then
     if [ -f ${LOGO_PATH} ]; then
         ${srctree}/scripts/bmpconvert ${LOGO_PATH};
     fi
+    if [ -f ${LOGO_NEW_PATH} ]; then
+        ${srctree}/scripts/bmpconvert ${LOGO_NEW_PATH};
+    fi
@@ -242,12 +248,15 @@ if [ "${srctree}" != "${objtree}" ]; then
     if [ -f ${LOGO_PATH} ]; then
         cp -a ${LOGO_PATH} ${objtree}/;
     fi
+    if [ -f ${LOGO_NEW_PATH} ]; then
+        cp -a ${LOGO_NEW_PATH} ${objtree}/;
+    fi
fi
-scripts/resource_tool ${DTB_PATH} ${LOGO} ${LOGO_KERNEL} >/dev/null
-echo " Image: resource.img (with ${DTB} ${LOGO} ${LOGO_KERNEL}) is ready"
+scripts/resource_tool ${DTB_PATH} ${LOGO} ${LOGO_NEW} ${LOGO_KERNEL} >/dev/null
+echo " Image: resource.img (with ${DTB} ${LOGO} ${LOGO_NEW} ${LOGO_KERNEL}) is ready"
```

#### 3.1.5 Использование Video Console

Эта функция выводит на экран или монитор журнал запуска U-Boot и интерфейс командной строки. Как описано в разделе «Драйвер U-Boot», отображение логотипа состоит из этапов U-Boot Logo и Kernel Logo. После включения Video Console логотип U-Boot заменяется текстовым выводом консоли, а логотип ядра продолжает отображаться штатно.

Конфигурация DTS: включите вывод U-Boot согласно шагу 1 раздела «Использование функции отображения логотипа».

Конфигурация defconfig:

Включите Video Console:

```text
/* enable the video console */
CONFIG_ROCKCHIP_VIDCONSOLE=y
```

Настройте разрешение и BPP (число бит на пиксель) Video Console. Пример для 1920x1080 16bpp:

```text
/* the resolution of the video console */
CONFIG_ROCKCHIP_VIDCONSOLE_WIDTH=1920
CONFIG_ROCKCHIP_VIDCONSOLE_HEIGHT=1080

/* the bits per pixel the of video console */
CONFIG_ROCKCHIP_VIDCONSOLE_BPP32 is not set
CONFIG_ROCKCHIP_VIDCONSOLE_BPP16=y
CONFIG_ROCKCHIP_VIDCONSOLE_BPP8 is not set
```

Если разрешение не задано, по горизонтали используется минимальное горизонтальное разрешение экранов или мониторов всех трактов вывода, а по вертикали — минимальное вертикальное. Так минимизируется размер кадрового буфера по умолчанию.

Например, если у RK3588 VP0 HDMI0 выводит 1920x1080, а VP3 DSI0 — 1080x1920, разрешение Video Console по умолчанию составит 1080x1080.

Если BPP не указан, по умолчанию используется 32.

Настройте размер кадрового буфера Video Console. Формула расчёта:

`size = width × height × bpp / (8 × 1024 × 1024)`

Пример для конфигурации 1920x1080 32bpp:

`size = 1920 × 1080 × 32 / (8 × 1024 × 1024) = 8 MB`

```text
/* the framebuffer size of video console */
CONFIG_ROCKCHIP_VIDCONSOLE_MEM_RESERVED_SIZE_MBYTES=8
```

Если размер не задан, по умолчанию выделяется 16M. Если Video Console требует больше памяти, например при 3840x2160 32bpp, появляется следующая ошибка и выполняется возврат к логотипу U-Boot:

```text
......
video console fb size [33177600 Bytes] is over reserved [16777216 Bytes], then back to show uboot logo
......
```

#### 3.1.6 Анализ мигания или отсутствия изображения при переходе от логотипа U-Boot к логотипу Linux Kernel

1\. Проверка нормальной загрузки драйвера DRM

Во время загрузки драйвера DRM некоторые ресурсы могут быть ещё не готовы, поэтому привязка драйвера завершается неудачей. Возможен следующий журнал:

```text
[1.792387] dw-mipi-dsi2 fde20000.dsi: [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
```

Этот журнал означает, что panel или bridge пока не готов. Штатная инфраструктура драйверов позднее повторит привязку. Если в итоге появляется следующий журнал, драйвер drm успешно загружен, и одна-две первоначальные ошибки привязки сами по себе не требуют особого внимания:

```text
[2.566831] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device
```

Если журнал загрузки продолжает сообщать об ошибках привязки, проверьте DTS. На практике часто встречаются ситуации, когда GPIO уже зарегистрирован другим устройством, свойство compatible панели задано неверно и панель не регистрируется, либо не регистрируется драйвер подсветки.

Если журнал Linux kernel содержит следующие ошибки, связанные с логотипом, требуется тщательный анализ вместе с исходным кодом:

```text
rockchip-drm display-subsystem: failed to parse resources for logo display
rockchip-drm display-subsystem: connector[HDMI-A-1] can't found any modes
rockchip-drm display-subsystem: can't not find any logo display
rockchip-drm display-subsystem: failed to show loader logo
```

2\. Мигание или смещение изображения из-за изменения частоты DDR

(1) Попробуйте отключить узел изменения частоты DDR в DTS, чтобы на этапе ядра частота DDR не менялась:

```text
&dmc {
  status = "disabled";
};
```

(2) Попробуйте отключить изменение частоты DCLK при изменении частоты DDR:

```text
&dmc {
  vop-dclk-mode = <1>;
};
```

3\. Изменения дерева тактирования

На некоторых платформах U-Boot и ядро независимо конфигурируют дерево clk. Если стратегии двух драйверов различаются, повторная инициализация clk ядром Linux может вызвать мигание. На примере RK3399 это проверяется следующим образом:

(1) Добавьте `while(1);` в начало функции `rk3399_clk_init()@kernel/drivers/clk/rockchip/clk-rk3399.c` и проверьте наличие мигания.

(2) Добавьте `while(1)` в конец функции `rk3399_clk_init()@kernel/drivers/clk/rockchip/clk-rk3399.c` и проверьте наличие мигания.

(3) Если на шаге (1) мигания нет, а на шаге (2) оно появляется, причиной, скорее всего, является изменение дерева clk. Можно обратиться к ответственному за cru соответствующей платформы либо создать задачу Redmine с указанием передать её ответственному за pll.

4\. Отключение тактовых сигналов

Ошибки последовательности или программные дефекты могут привести к тому, что при регистрации драйвера необходимые тактовые сигналы не включаются. После запуска ядра инфраструктура автоматически отключает их, вызывая нарушения изображения. Для проверки можно временно оставлять тактирование включённым:

В DTS найдите узел chosen и добавьте `clk_ignore_unused` в конец bootargs, например: `bootargs = "xxxx clk_ignore_unused”;`

![Исходный рисунок: 3.1.6 Анализ мигания или отсутствия изображения при переходе от логотипа U-Boot к логотипу Linux Kernel; PDF p. 18](/docs/rockchip-drm-display-driver/assets/en-p18-X212.png)

5\. Разные размеры логотипов U-Boot и ядра

Платформа Rockchip требует одинакового разрешения логотипов U-Boot и ядра. Если логотип U-Boot отображается нормально, а на этапе ядра возникают нарушения, проверьте совпадение разрешений `logo.bmp` и `logo_kernel.bmp` в каталоге ядра.

![Исходный рисунок: 3.1.6 Анализ мигания или отсутствия изображения при переходе от логотипа U-Boot к логотипу Linux Kernel; PDF p. 18](/docs/rockchip-drm-display-driver/assets/en-p18-X213.png)

6\. Повторная инициализация GPIO питания при инициализации ядра

Возможных причин много. При переносе нового проекта следует своевременно проверять, не конфликтуют ли GPIO питания дисплея с другими модулями.

Если правильность DTS подтверждена, найдите в коде ядра ключевые слова из журнала последовательного порта. Методом двоичного поиска устанавливайте точки остановки в местах загрузки модулей, постепенно локализуя момент появления мигания.

7\. Настройка приоритета VOP

Если VOP не имеет наивысшего приоритета, другие IP-блоки могут захватывать шину во время загрузки ядра и вызывать мигание. Обычно это исправляется до выпуска SDK.

8\. Проверка питания и сигналов

Если перечисленные методы не выявили причину мигания, осциллографом снимите сигналы CLK, DATA, питание и другие связанные сигналы на переходе от U-Boot к ядру и создайте задачу Redmine.

### 3.2 Драйвер ядра

#### 3.2.1 Каталог драйвера

```text
drivers/gpu/drm/rockchip/
drivers/gpu/drm/bridge/analogix/
drivers/gpu/drm/bridge/synopsys/
drivers/phy/rockchip/
```

#### 3.2.2 Файлы драйвера

| Драйвер | Файл | Документация |
| --- | --- | --- |
| Основная часть | rockchip_drm_drv.c<br>rockchip_drm_fb.c<br>rockchip_drm_fbdev.c<br>rockchip_drm_gem.c<br>rockchip_drm_logo.c<br>rockchip_drm_direct_show.c<br>panel-simple.c | rockchip-drm.txt или rockchip-drm.yaml |
| VOP | rockchip_drm_vop.c<br>rockchip_vop_reg.c<br>rockchip_drm_vop2.c<br>rockchip_vop2_reg.c | rockchip-vop.txt или rockchip-vop.yaml |
| RGB | rocckhip_rgb.c<br>phy-rockchip-inno-video-combo-phy.c | rockchip-rgb.txt |
| LVDS | rockchip_lvds.c<br>phy-rockchip-inno-video-combo-phy.c | rockchip-lvds.txt |
| MIPI-DSI | dw-mipi-dsi.c<br>phy-rockchip-inno-dsidphy.c<br>phy-rockchip-inno-video-combo-phy.c<br>dw-mipi-dsi2-rockchip.c<br>phy-rockchip-samsung-dcphy.c | dw_mipi_dsi_rockchip.txt<br>phy-rockchip-inno-mipi-dphy.txt |
| eDP | analogix_dp_core.c<br>analogix_dp-rockchip.c<br>analogix_dp_reg.c<br>phy-rockchip-dp.c | analogix_dp-rockchip.txt<br>analogix_dp.txt<br>rockchip-dp-phy.txt |
| DP | cdn-dp-core.c<br>cdn-dp-reg.c<br>dw-dp.c<br>phy-rockchip-usbdp.c<br>phy-rockchip-samsung-hdptx-hdmi.c | cdn-dp-rockchip.txt |
| HDMI | inno_hdmi.c<br>dw-hdmi.c<br>dw_hdmi-rockchip.c<br>phy-rockchip-inno-hdmi-phy.c<br>dw-hdmi-qp.c<br>phy-rockchip-samsung-hdptx-hdmi.c | inno_hdmi-rockchip.txt<br>dw_hdmi-rockchip.txt<br>phy-rockchip-inno-hdmi-phy.txt |
| TVE/CVBS | rockchip_drm_tve.c | rockchip_drm_tve.txt |

В разных версиях ядра перечисленные файлы могут немного отличаться, однако большинство файлов драйверов и структура инфраструктуры в основном остаются прежними. Учитывайте фактическую версию.

#### 3.2.3 Порядок загрузки драйвера

![Исходный рисунок: 3.2.3 Порядок загрузки драйвера; PDF p. 20](/docs/rockchip-drm-display-driver/assets/en-p20-X221.png)

Драйвер DRM объединяет драйверы нескольких модулей отображения. Он включает зависимые модули тракта вывода: backlight, panel, rgb, lvds, dsi, edp, lvds, hdmi, vop и другие. Вся система drm может успешно запуститься только после загрузки всех взаимозависимых модулей.

Из-за сложных зависимостей во время инициализации drm ресурс может временно оказаться не готов, мешая загрузке модуля. Для решения этой проблемы драйвер drm использует механизм deferred probe Linux. Если зависимый ресурс не готов, драйвер возвращает `-EPROBE_DEFER(-517)` и завершает попытку. Позднее ядро Linux повторяет загрузку, пока ресурс не станет доступен и драйвер не загрузится успешно.

```text
[1.747190] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[1.747877] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[1.748022] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748676] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[1.748807] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[1.748840] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[1.755174] panel-simple-dsi fde20000.dsi.0: failed to get power regulator: -517
[1.759296] brd: module loaded
[1.764374] loop: module loaded
[1.764528] zram: Added device: zram0
[1.764698] system_heap: orders[0] = 6
[2.248871] imx415 5-001a: supply dovdd not found, using dummy regulator
[2.416673] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.418711] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.420336] rockchip-drm display-subsystem: bound fde80000.hdmi (ops dw_hdmi_rockchip_ops)
[2.421725] dwhdmi-rockchip fdea0000.hdmi: registered ddc I2C bus driver
[2.422291] rockchip-drm display-subsystem: bound fdea0000.hdmi (ops dw_hdmi_rockchip_ops)
[2.422318] dw-mipi-dsi2 : [drm:dw_mipi_dsi2_bind] *ERROR* Failed to find panel or bridge: -517
[2.433888] input: adc-keys as /devices/platform/adc-keys/input/input3
[2.466237] rockchip-drm display-subsystem: bound fdd90000.vop (ops vop2_component_ops)
[2.468705] dwhdmi-rockchip fde80000.hdmi: registered ddc I2C bus driver
[2.469751] rockchip-drm display-subsystem: bound fde80000.hnd fde20000.dsi (ops dw_mipi_dsi2_ops)
[2.472282] rockchip-drm display-subsystem: bound fde50000.dp (ops dw_dp_component_ops)
[2.472319] rockchip-drm display-subsystem: bound fde60000.dp (ops dw_dp_component_ops)
[2.531892] rockchip-drm display-subsystem: [drm] fb0: rockchipdrmfb frame buffer device
[2.532850] [drm] Initialized rockchip 3.0.0 20140818 for display-subsystem on minor 0
```

В приведённом журнале в строках 6 и 18 драйвер mipi dsi возвращает `-EPROBE_DEFER` и завершает попытку, поскольку зависимый panel или bridge не найден. В строке 23, после получения ресурса, драйвер dsi успешно привязывается. В конце виден стандартный журнал успешной загрузки всего драйвера drm.

```text
[2.532850] [drm] Initialized rockchip 3.0.0 20140818 for display-subsystem on minor 0
```

#### 3.2.4 Конфигурация DTS

##### 3.2.4.1 Основная конфигурация

В SoC может быть несколько модулей VOP, HDMI, eDP, DP, MIPI и Panel. В зависимости от назначения изделия для построения тракта отображения могут использоваться лишь некоторые из них. Выбор модулей и связей между ними задаётся в DTS.

В основном DTSI каждого SoC с поддержкой отображения drm имеется следующий узел `display_subsystem`:

```text
display_subsystem: display-subsystem {
    compatible = "rockchip,display-subsystem";
    memory-region = <&drm_logo>, <&drm_cubic_lut>;
    memory-region-names = "drm-logo", "drm-cubic-lut";
    ports = <&vop_out>;
    devfreq = <&dmc>;

    route {
         route_dsi0: route-dsi0 {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_dsi0>;
         };
         route_dsi1: route-dsi1 {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_dsi1>;
         };
         route_edp: route-edp {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp0_out_edp>;
         };
         route_hdmi: route-hdmi {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp1_out_hdmi>;
         };
         route_lvds: route-lvds {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp1_out_lvds>;
         };
         route_rgb: route-rgb {
              status = "disabled";
              logo,uboot = "logo.bmp";
              logo,kernel = "logo_kernel.bmp";
              logo,mode = "center";
              charge_logo,mode = "center";
              connect = <&vp2_out_rgb>;
         };
    };
};
```

Этот узел управляет загрузкой драйвера `rockchip_drm_drv.c`.

Свойство `memory-region` управляет выделением и передачей буфера логотипа. Во время запуска системы U-Boot динамически изменяет его, а затем передаёт ядру.

Узлы `route_xxx` определяют, включён ли загрузочный логотип для каждого интерфейса. По умолчанию он отключён.

Назначение свойств на примере route_rgb:

```text
route_rgb: route-rgb {
  status = "disabled";
     logo,uboot = "logo.bmp";
     logo,kernel = "logo_kernel.bmp";
     logo,mode = "center";
     charge_logo,mode = "center";
     connect = <&vp2_out_rgb>;
};
```

`logo,uboot` и `logo,kernel` задают имена изображений для этапов U-Boot и Kernel; они должны соответствовать фактическим ресурсам.

`logo,mode` и `charege_logo,mode` задают режим отображения логотипа: `center` или `fullscreen`.

`connect` описывает, к какому Video Port VOP (архитектура VOP 2.0) либо к какому VOP (архитектура VOP 1.0) подключён интерфейс дисплея. Обычно свойство задаётся в соответствии с фактическим использованием.

Большинство свойств `display_subsystem` менять не требуется. Обычно достаточно включить или отключить соответствующие узлы логотипа согласно требованиям изделия.

Узел `vop`:

```text
vop: vop@fe040000 {
  compatible = "rockchip,rk3568-vop";
  reg = <0x0 0xfe040000 0x0 0x3000>, <0x0 0xfe044000 0x0 0x1000>;
  reg-names = "regs", "gamma_lut";
  rockchip,grf = <&grf>;
  interrupts = <GIC_SPI 148 IRQ_TYPE_LEVEL_HIGH>;
  clocks = <&cru ACLK_VOP>, <&cru HCLK_VOP>, <&cru DCLK_VOP0>, <&cru DCLK_VOP1>, <&cru DCLK_VOP2>;
  clock-names = "aclk_vop", "hclk_vop", "dclk_vp0", "dclk_vp1", "dclk_vp2";
  iommus = <&vop_mmu>;
  power-domains = <&power RK3568_PD_VO>;
  status = "disabled";
  vop_out: ports {
     ......
     vp0: port@0 {
       ......
       vp0_out_dsi0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dsi0_in_vp0>;
       };
       vp0_out_dsi1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dsi1_in_vp0>;
       };

       vp0_out_edp: endpoint@2 {
         reg = <2>;
         remote-endpoint = <&edp_in_vp0>;
       };
       vp0_out_hdmi: endpoint@3 {
         reg = <3>;
         remote-endpoint = <&hdmi_in_vp0>;
       };
     };
     vp1: port@1 {
       ......
       vp1_out_dsi0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&dsi0_in_vp1>;
       };

       vp1_out_dsi1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&dsi1_in_vp1>;
       };

       vp1_out_edp: endpoint@2 {
         reg = <2>;
         remote-endpoint = <&edp_in_vp1>;
       };
       vp1_out_hdmi: endpoint@3 {
         reg = <3>;
         remote-endpoint = <&hdmi_in_vp1>;
       };

       vp1_out_lvds: endpoint@4 {
         reg = <4>;
         remote-endpoint = <&lvds_in_vp1>;
       };
     };
     vp2: port@2 {
       ......
       vp2_out_lvds: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&lvds_in_vp2>;
       };
       vp2_out_rgb: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&rgb_in_vp2>;
       };
     };
  };
};
```

Он описывает аппаратные ресурсы VOP, управляет загрузкой драйвера `rockchip_drm_vop.c/rockchip_drm_vop2.c` и задаёт следующие связи тракта отображения:

![Исходный рисунок: 3.2.4.1 Основная конфигурация; PDF p. 25](/docs/rockchip-drm-display-driver/assets/en-p25-X236.png)

Узел `vop_out: ports` описывает выходные каналы VOP. vp0/1/2 соответствуют трём независимым трактам Video Port0/1/2.

Узлы endpoint внутри `vp0/1/2: port` описывают связи VP с интерфейсами дисплея. В приведённом DTS узел vp0 содержит `vp0_out_dsi0`, `vp0_out_dsi1`, `vp0_out_edp` и `vp0_out_hdmi`, то есть vp0 можно подключить к dsi0, dsi1, edp и hdmi.

Каждый endpoint образует связь с соответствующим интерфейсом через свойство `remote-endpoint`. Например, соединение с hdmi:

```text
hdmi: hdmi@fe0a0000 {
  compatible = "rockchip,rk3568-dw-hdmi";
  ......
  status = "disabled";

  ports {
     ......
     port@0 {
       reg = <0>;
       ......
       hdmi_in_vp0: endpoint@0 {
         reg = <0>;
         remote-endpoint = <&vp0_out_hdmi>;
         status = "disabled";
       };
       hdmi_in_vp1: endpoint@1 {
         reg = <1>;
         remote-endpoint = <&vp1_out_hdmi>;
         status = "disabled";
       };
     };
  };
};
```

Из приведённых описаний DTS следует, что на rk3568 интерфейс hdmi можно подключить к vp0 или vp1 VOP.

Одновременно интерфейс дисплея может быть подключён только к одному VP. Поэтому в DTS конкретной платы используемые тракты необходимо включить, а неиспользуемые перевести в состояние `disabled`.

Например, чтобы подключить HDMI к vp0, задайте в DTS:

```text
&hdmi {
     status = "okay";
};

&hdmi_in_vp0 {
     status = "okay";
};
&hdmi_in_vp1 {
     status = "disabled";
};

&route_hdmi {
     status = "okay";
     connect = <&vp0_out_hdmi>;
};
```

##### 3.2.4.2 Назначение стратегии распределения слоёв

VOP2 использует единую архитектуру отображения. Независимые Video Port разделяют все ресурсы слоёв VOP, причём каждый слой используется эксклюзивно: одновременно он может принадлежать только одному Video Port.

Для полного и рационального использования ресурсов U-Boot создаёт стандартную стратегию распределения слоёв на основе типов и количества интерфейсов, заданных в DTS изделия. Если логотип U-Boot отключён или есть особые требования к слоям, их распределение можно явно задать в DTS по следующим правилам:

`rockchip,plane-mask`: маска идентификаторов слоёв, выделенных данному VP. Идентификаторы определены в `dt-bindings/display/rockchip_vop.h`.

`rockchip,primary-plane`: основной слой. Он должен входить в rockchip,plane-mask данного VP. Обычно выбирается Smart или Esmart.

Основной принцип — равномерно распределить все слои (6 у rk3568 и 8 у rk3588) между используемыми VP. Неиспользуемым VP слои обычно не назначаются. Поскольку Cluster, Esmart и Smart отличаются производительностью и ограничениями, рекомендуется также равномерно распределять разные типы слоёв.

Ниже приведён типичный пример для RK3568. Его VOP имеет 6 слоёв: 2 Cluster + 2 Esmart + 2 Smart. Конфигурация поддерживает независимый вывод на три экрана. Обычно VP основного экрана, используемого в большинстве сценариев (здесь VP1), стараются выделить более трёх слоёв, а другим интерфейсам — не менее двух.

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vp0 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};

&vp1 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
&vp2 {
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_ESMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_ESMART1>;
};
```

После вступления конфигурации в силу сведения о разборе plane mask видны в журналах запуска U-Boot и Linux kernel.

```text
Rockchip UBOOT DRM driver version: v1.0.1
VOP have 3 active VP
vp0 have layer nr:2[1 5 ], primary plane: 5
vp1 have layer nr:3[0 2 4 ], primary plane: 4
vp2 have layer nr:1[3 ], primary plane: 3
Using display timing dts
dsi@fe060000: detailed mode clock 132000 kHz, flags[8000000a]
  H: 1080 1095 1097 1127
  V: 1920 1935 1937 1952
bus_format: 100e
VOP update mode to: 1080x1920p0, type: MIPI0 for VP1
VOP VP1 enable Smart0[654x270->654x270@213x825] fmt[2] addr[0x7df04000]
final DSI-Link bandwidth: 876 Mbps x 4
disp info 0, type:11, id:0
xfer: num: 2, addr: 0x50
xfer: num: 2, addr: 0x50
```

```text
[2.314574] panel-simple-dsi fe060000.dsi.0: Specify missing connector_type
[2.315764] rockchip-vop2 : [drm:vop2_bind] vp0 assign plane mask: 0x22, primary plane phy id: 5
[2.315807] rockchip-vop2 : [drm:vop2_bind] vp1 assign plane mask: 0x15, primary plane phy id: 4
[2.315828] rockchip-vop2 : [drm:vop2_bind] vp2 assign plane mask: 0x8, primary plane phy id: 3
[2.316713] rockchip-drm display-subsystem: bound fe040000.vop (ops vop2_component_ops)
[2.317966] rockchip-drm display-subsystem: bound fe0c0000.edp (ops rockchip_dp_component_ops)
[2.318378] dwhdmi-rockchip : Detected HDMI TX controller v2.11a with HDCP (DWC HDMI 2.0 TX PHY)
[2.319625] dwhdmi-rockchip : registered DesignWare HDMI I2C bus driver
[2.321857] rockchip-drm display-subsystem: bound fe0a0000.hdmi (ops dw_hdmi_rockchip_ops)
[2.322069] rockchip-drm display-subsystem: bound fe060000.dsi (ops dw_mipi_dsi_rockchip_ops)
```

###### 3.2.4.2.1 Распределение слоёв RK3566

В аппаратной реализации RK3566 различаются основной и зеркальный слои. Зеркальный Cluster1 может считывать данные только с адреса основного Cluster0. Аналогично Esmart1/Smart1 считывают данные только с адресов Esmart0/Smart0. Поэтому основной слой должен использоваться первым. В обычных изделиях драйвер дисплея U-Boot задаёт plane-mask согласно типу интерфейса. Если логотип U-Boot не включён, используйте в DTS следующие правила:

1\. Для одного экрана можно использовать следующую конфигурацию:

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vpx { // x depends on the used vp id, such as vp0
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0 | 1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 << ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
};
```

2\. Для двух экранов (согласно оригиналу, RK3566 поддерживает двухэкранный режим только в Android, причём частоты обновления обоих экранов должны совпадать) устройство без горячего подключения, то есть постоянно подключённый тракт, использует основной слой, а второй тракт — зеркальный:

```text
#include <dt-bindings/display/rockchip_vop.h> // Layer ID definition header file

&vpx { // x depends on the used vp id, such as vp0
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER0 | 1 << ROCKCHIP_VOP2_ESMART0 | 1 <<
ROCKCHIP_VOP2_SMART0)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART0>;
}; // Single-screen or non-hot-plugging main display device in dual-screen display uses the main layer
&vpx { // x depends on the used vp id, such as vp1
  rockchip,plane-mask = <(1 << ROCKCHIP_VOP2_CLUSTER1 | 1 << ROCKCHIP_VOP2_ESMART1 | 1 <<
ROCKCHIP_VOP2_SMART1)>;
  rockchip,primary-plane = <ROCKCHIP_VOP2_SMART1>;
};
```

##### 3.2.4.3 Назначение слоя курсора

Приложению с Atomic API не требуется различать типы слоёв primary, overlay и cursor. Для вывода можно использовать любой доступный слой с подходящей поддержкой формата.

Однако некоторые приложения Linux, кроме Android, по-прежнему используют legacy API, которому важны типы слоёв: primary для фона рабочего стола, overlay для видео и cursor для указателя мыши.

По умолчанию драйвер Rockchip drm регистрирует только primary и overlay, но не cursor. Если системе Linux нужен слой cursor, задайте свойство `cursor-win-id` в соответствующем узле vp DTS, выделив слой курсора CRTC данного VP.

```text
&vp0 {
  cursor-win-id = <ROCKCHIP_VOP2_CLUSTER0>;
};
```

Слои Cluster RK3566/RK3568 поддерживают только AFBC, но не RGB/YUV без AFBC; передача данных не в формате AFBC в Cluster недопустима в любом сценарии. Поэтому при назначении Cluster слоем курсора в Linux (buildroot, Debian и других системах, кроме Android) необходимо использовать библиотеку `libdrm-cursor` из Linux SDK. Она преобразует формат данных с учётом особенностей слоя. Подробности приведены в `Rockchip_Developer_Guide_Debian_CN.pdf`.

###### 3.2.4.3.1 Связи слоёв с VP

На RK356X/RK3588/RK3562 каждый слой можно подключить к любому VP, без специальных требований. На RK3528 и RK3576 такая возможность есть не у всех слоёв. Поэтому для cursor данного VP необходимо выбрать совместимый с ним слой. Связи для разных платформ приведены ниже:

1\. RK3528

| VP | Слои |
| --- | --- |
| VP0 | Cluster0, Esmart0, Esmart1, Esmart2 |
| VP1 | Esmart2, Esmart3 |

2\. RK3576

| VP | Слои |
| --- | --- |
| VP0 | Cluster0, Cluster1, Esmart0, Esmart2 |
| VP1 | Cluster0, Cluster1, Esmart1, Esmart3 |
| VP2 | Esmart0, Esmart1, Esmart2, Esmart3 |

##### 3.2.4.4 Разделение слоёв esmart

В RK3528 и RK3576 несколько esmart используют общий linebuffer. Его можно разделить согласно конфигурации изделия, получая разное число слоёв и разные характеристики:

###### 3.2.4.4.1 Разделение esmart в RK3528

На RK3528 слои esmart0/1/2/3 используют общий linebuffer. По умолчанию задан `VOP3_ESMART_4K_2K_2K_MODE`: кроме фиксированного Cluster регистрируются esmart0[4k], esmart2[2k] и esmart3[2k]. Конфигурацию можно изменить в DTS. Например, для двух слоёв с поддержкой 4k:

```text
&vop {
  esmart_lb_mode = /bits/ 8 <1>;
};
```

Описание конфигурации:

| esmart_lb_mode | Значение | Число и характеристики слоёв |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_MODE | 1 | Регистрируются cluster[4k], esmart0[4k], esmart2[4k] |
| VOP3_ESMART_4K_2K_2K_MODE | 2 | Регистрируются cluster[4k], esmart0[4k], esmart2[2k], esmart3[2k] |
| VOP3_ESMART_2K_2K_2K_2K_MODE | 3 | Регистрируются cluster[4k], esmart0[2k], esmart1[2k], esmart2[2k], esmart3[2k] |

###### 3.2.4.4.2 Разделение esmart в RK3576

На RK3576, помимо фиксированных Cluster0/1[4k] и esmart0/1[4k], слои esmart2[2k] и esmart3[2k] используют общий linebuffer. По умолчанию это два слоя 2k. Чтобы получить один слой с поддержкой 4k, используйте:

```text
&vop {
  esmart_lb_mode = /bits/ 8 <4>;
};
```

Описание конфигурации:

| esmart_lb_mode | Значение | Число и характеристики слоёв |
| --- | --- | --- |
| VOP3_ESMART_4K_4K_4K_MODE | 4 | Регистрируются cluster0[4k], cluster1[4k], esmart0[4k], esmart1[4k], esmart2[4k] |
| VOP3_ESMART_4K_4K_2K_2K_MODE | 5 | Регистрируются cluster0[4k], cluster1[4k], esmart0[4k], esmart1[4k], esmart2[2k], esmart3[2k] |

##### 3.2.4.5 Запрет перемещения слоёв

RK3568 и RK3588 не поддерживают свободное перемещение слоёв между VP/CRTC во время работы. Поэтому в большинстве систем Linux, кроме Android, слой следует закреплять за одним CRTC и запрещать его динамический перенос. Для этого узел vop в DTS должен содержать свойство `disable-win-move`.

```text
&vop {
     disable-win-move;
}
```

После запуска системы проверьте свойство слоя `possible crtcs` через `modetest`. В значении каждого слоя должен быть установлен только один бит; иначе конфигурация не соответствует требуемой.

#### 3.2.5 Настройка цветового охвата

В инфраструктуру DRM ядра Linux 6.1 добавлено стандартное определение цветового охвата. Ранее драйвер DRM заимствовал не вполне подходящее и сложное для понимания определение V4L2. Поэтому начиная с Linux 6.1 определение для Plane переведено на стандарт DRM. Ниже описаны настройки разных версий ядра платформ RK:

##### 3.2.5.1 Цветовой охват Plane

1\. Версии ядра до Linux 6.1

Используется собственное свойство RK: COLOR_SPACE

| Значение настройки | Цветовой охват | Описание |
| --- | --- | --- |
| V4L2_COLORSPACE_SMPTE170M / V4L2_COLORSPACE_470_SYSTEM_M /<br>V4L2_COLORSPACE_470_SYSTEM_BG | BT.601L | Определение V4L2 |
| V4L2_COLORSPACE_REC709 / V4L2_COLORSPACE_SMPTE240M /<br>V4L2_COLORSPACE_DEFAULT | BT.709L | Определение V4L2 |
| V4L2_COLORSPACE_JPEG | BT.601F | Определение V4L2 |
| V4L2_COLORSPACE_BT2020 | BT.2020L | Определение V4L2 |
| V4L2_COLORSPACE_BT709F | BT.709F | Собственное определение RK |
| V4L2_COLORSPACE_BT2020F | BT.2020F | Собственное определение RK |

2\. Linux 6.1 и новее

Используются два стандартных свойства DRM: COLOR_ENCODING и COLOR_RANGE

COLOR_ENCODING

| Значение настройки | Цветовой охват | Описание |
| --- | --- | --- |
| DRM_COLOR_YCBCR_BT601 | BT.601 | Определение DRM |
| DRM_COLOR_YCBCR_BT709 | BT.709 | Определение DRM |
| DRM_COLOR_YCBCR_BT2020 | BT.2020 | Определение DRM |

COLOR_RANGE

| Значение настройки | Диапазон | Описание |
| --- | --- | --- |
| DRM_COLOR_YCBCR_FULL_RANGE | Полный | Определение DRM |
| DRM_COLOR_YCBCR_LIMITED_RANGE | Ограниченный | Определение DRM |

##### 3.2.5.2 Цветовой охват Connector

1\. Версии ядра до Linux 5.10

Для цветового охвата используется собственное свойство RK: hdmi_output_colorimetry

| Значение свойства | Цветовой охват | Описание |
| --- | --- | --- |
| HDMI_COLORIMETRY_NONE | По умолчанию | Собственное определение RK |
| RK_HDMI_COLORIMETRY_BT2020 | BT.2020 | Собственное определение RK |

Для диапазона используется собственное определение RK: hdmi_quant_range

| Значение настройки | Диапазон | Описание |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | По умолчанию | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_LIMITED | Ограниченный | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_FULL | Полный | Собственное определение RK |

2\. Linux 5.10

Для цветового охвата используется стандартное свойство DRM: Colorspace

| Значение настройки | Цветовой охват | Описание |
| --- | --- | --- |
| Default = 0 | По умолчанию | Определение DRM |
| DRM_MODE_COLORIMETRY_SMPTE_170M_YCC | SMPTE_170M_YCC | Определение DRM |
| DRM_MODE_COLORIMETRY_BT709_YCC | BT709_YCC | Определение DRM |
| DRM_MODE_COLORIMETRY_XVYCC_601 | XVYCC_601 | Определение DRM |
| DRM_MODE_COLORIMETRY_XVYCC_709 | XVYCC_709 | Определение DRM |
| DRM_MODE_COLORIMETRY_SYCC_601 | SYCC_601 | Определение DRM |
| DRM_MODE_COLORIMETRY_OPYCC_601 | opYCC_601 | Определение DRM |
| DRM_MODE_COLORIMETRY_OPRGB | opRGB | Определение DRM |
| DRM_MODE_COLORIMETRY_BT2020_CYCC | BT2020_CYCC | Определение DRM |
| DRM_MODE_COLORIMETRY_BT2020_RGB | BT2020_RGB | Определение DRM |
| DRM_MODE_COLORIMETRY_BT2020_YCC | BT2020_YCC | Определение DRM |
| DRM_MODE_COLORIMETRY_DCI_P3_RGB_D65 | P3_RGB_D65 | Определение DRM |
| DRM_MODE_COLORIMETRY_DCI_P3_RGB_THEATER | P3_RGB_Theater | Определение DRM |

Драйвер DRM HDMI различает лишь несколько цветовых охватов BT2020. Если приложение не задаёт BT2020, драйвер выбирает охват HDMI в зависимости от разрешения.

Для диапазона используется собственное определение RK: hdmi_quant_range

| Значение настройки | Диапазон | Описание |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | По умолчанию | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_LIMITED | Ограниченный | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_FULL | Полный | Собственное определение RK |

3\. Linux 6.1

Как и в Linux 5.10, используется стандартное свойство DRM Colorspace.

Для диапазона используется собственное свойство RK; его имя изменено с `hdmi_quant_range` на `quant_range`, главным образом для совместного использования с DP:

| Значение настройки | Диапазон | Описание |
| --- | --- | --- |
| HDMI_QUANTIZATION_RANGE_DEFAULT | По умолчанию | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_LIMITED | Ограниченный | Собственное определение RK |
| HDMI_QUANTIZATION_RANGE_FULL | Полный | Собственное определение RK |

##### 3.2.5.3 Дополнительные сведения

1\. Настройка DP в основном совпадает с HDMI. Часть функций может отсутствовать и должна быть дополнена в будущем согласно исходному документу.

2\. Версию драйвера можно определить стандартным интерфейсом libdrm: `drmGetVersion()`.

| Версия ядра | Номер версии |
| --- | --- |
| Linux 4.4 | 1.0 |
| Linux 4.19 | 2.0 |
| Linux 5.10 | 3.0 |
| Linux 6.1 | 4.0 |

3\. Свойства Plane, определённые инфраструктурой DRM, учитывают только YUV; цветовой охват RGB не определён. Поэтому для RGB временно используется определение цветового охвата YUV:

Для обычного UI (SRGB + Full Range) задаются: `COLOR_ENCODING = DRM_COLOR_YCBCR_BT709`, `COLOR_RANGE = DRM_COLOR_YCBCR_FULL_RANGE`.

## 4. Возможности отображения

### 4.1 Основные возможности VOP различных платформ

| SOC | Версия VOP | 8K | 4K | MMU | i-MODE | A/IFBDC | MULTIAREA | BCSH | gamma | 3D-LUT | POST-SCALE | X-mirror |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK3066/PX2 | V1.0 | × | × | × | × | × | × | × | √ | × | × | × |
| RK3188/PX3 | V1.0 | × | × | × | × | × | × | × | √ | × | × | × |
| RK3126/RK3126C | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RK3128/PX3SE | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |
| RK3036 | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |
| RK322X/RK312XH | V1.0 | × | √ | √ | √ | × | × | √ | × | × | √ | × |
| RK322XH/RK332X | V1.0 | × | √ | √ | √ | × | × | √ | × | × | √ | × |
| SOFIA 3GR | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1108 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RK3288 | V1.0 | × | √ | √ | × | × | √ | √ | √ | × | √ | × |
| RK3368/PX5 | V1.0 | × | √ | √ | × | √ | √ | √ | √ | × | √ | × |
| RK3399 | V1.0 | × | √ | √ | √ | √ | √ | √ | √ | × | √ | × |
| RK3326/PX30 | V1.0 | × | × | √ | √ | √ | √ | √ | √ | × | × | × |
| RK3308 | V1.0 | × | × | × | × | × | × | √ | √ | × | × | × |
| RK1808 | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1109/RV1126 | V1.0 | × | × | √ | × | × | × | √ | √ | × | × | × |
| RV1103/RV1106 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RK356X | V2.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3588 | V2.0 | √ | √ | √ | √ | √ | √ | √ | √ | √ | × | √ |
| RK3528 | V3.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3562 | V3.0 | × | × | √ | √ | × | √ | √ | √ | √ | √ | √ |
| RK3576 | V3.0 | × | √ | √ | √ | √ | √ | √ | √ | √ | √ | √ |
| RK3506 | V1.0 | × | × | × | √ | × | × | √ | √ | × | × | × |
| RV1126B | V1.0 | × | × | √ | √ | × | × | √ | √ | × | × | × |

### 4.2 Максимальное разрешение вывода и стандарты интерфейсов дисплея для каждой платформы

| Платформа | Интерфейс дисплея | Максимальное разрешение вывода | Стандарт протокола |
| --- | --- | --- | --- |
| RK3036 | HDMI | 1920x1080@60hz | Поддержка HDMI 1.4a |
| RK3036 | CVBS | 720x480i@60hz/720x576i@50hz | Поддержка NTSC/PAL |
| RK312X/PX3SE | RGB | 1280x800@60hz | Поддержка RGB666/sRGB888 |
| RK312X/PX3SE | LVDS | 1280x800@60hz | Поддержка VESA и JEIDA LVDS |
| RK312X/PX3SE | MIPI | 1920x1080@60hz | Поддержка DSI v1.0, DCS v1.0, DPHY v1.0 |
| RK312X/PX3SE | HDMI | 1920x1080@60hz | Поддержка HDMI 1.4a |
| RK312X/PX3SE | CVBS | 720x480i@60hz/720x576i@50hz | Поддержка NTSC/PAL |
| RK322X/RK312XH | HDMI | 4096x2160@60hz | Поддержка HDMI 1.4a |
| RK322X/RK312XH | CVBS | 720x480i@60hz/720x576i@50hz | Поддержка NTSC/PAL |
| RK3288 | RGB | 1920x1080@60hz | Поддержка GB888/RGB666/sRGB888 |
| RK3288 | LVDS | Один канал 1280x800@60hz Два канала:1920x1080@60hz | Поддержка VESA и JEIDA LVDS |
| RK3288 | eDP | 2560x1600@60hz | Поддержка DP1.2a и eDP1.3 |
| RK3288 | MIPI | Один канал: 1920x1080@60hz Два канала:2560x1600@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.1 |
| RK3288 | HDMI | VOP BIG: 3840x2160@60hz<br>VOP LIT: 1920x1080@60hz | Поддержка HDMI 1.4a и 2.0 |
| RK3308 | RGB | 1280x800@60hz | Поддержка RGB888/RGB666/sRGB888/MCU |
| RK1808 | RGB | 1280x800@60hz | Поддержка RGB888/RGB666/sRGB888/MCU |
| RK1808 | MIPI | 1280X800@60hz | Поддержка DSI v1.0, DCS v1.0, DPHY v1.0 |
| RK322XH/RK332X | HDMI | 3840x2160@60hz | Поддержка HDMI 1.4a и 2.0 |
| RK322XH/RK332X | CVBS | 720x480i@60hz/720x576i@50hz | Поддержка NTSC/PAL |
| RK3326/px30 | RGB | 1280x800@60hz | Поддержка RGB888/RGB666/sRGB888/MCU |
| RK3326/px30 | LVDS | 1280x800@60hz | Поддержка VESA и JEIDA LVDS |
| RK3326/px30 | MIPI | 1920x1080@60hz | Поддержка DSI v1.0, DCS v1.0, DPHY v1.0 |
| RK3368/PX5 | RGB | 1280x800@60hz | Поддержка RGB888/RGB666/sRGB888/MCU |
| RK3368/PX5 | LVDS | 1280x800@60hz | Поддержка VESA и JEIDA LVDS |
| RK3368/PX5 | MIPI | 1920x1080@60hz | Поддержка DSI v1.0, DCS v1.0, DPHY v1.0 |
| RK3368/PX5 | eDP | 2560x1600@60hz | Поддержка DP1.2a и eDP1.3 |
| RK3368/PX5 | HDMI | 4096x2160@60hz | Поддержка HDMI 1.4a и 2.0 |
| RK3399 | MIPI | Один канал:1280x800@60hz Два канала:2560x1600@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.1 |
| RK3399 | eDP | 2560x1600@60hz | Поддержка DP1.2a и eDP1.3 |
| RK3399 | HDMI | VOP BIG: 4096x2160@60hz<br>VOP LIT: 2560x1600@60hz | Поддержка HDMI 1.4a и 2.0a |
| RK3399 | DP | VOP BIG: 3840x2160@60hz<br>VOP LIT: 2560x1600@60hz | Поддержка DP 1.2 |
| RV1109/RV1126 | RGB | 1920x1080@60hz | Поддержка RGB888/RGB666/sRGB888/MCU/BT.1120 |
| RV1109/RV1126 | MIPI | 1920x1080@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.2 |
| RK356X | RGB | 1920x1080@60hz | Поддержка RGB888/RGB666/BT.656/BT.1120 |
| RK356X | MIPI | Один канал: :1920x1080@60hz Два канала:2560x1600@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.1 |
| RK356X | eDP | 2560x1600@60hz | Поддержка DP 1.2a и eDP 1.3 |
| RK356X | HDMI | 4096x2160@60hz | Поддержка HDMI 1.4a и 2.0a |
| RK3588 | RGB | 1920x1080@60hz | Поддержка BT.656/BT.1120 |
| RK3588 | MIPI | 3840x2160@60hz | Два MIPI, поддержка DSI v1.1, DCS v1.1, DPHY v2.0, CPHY V1.1 |
| RK3588 | eDP0 | 3840x2160@60hz | Два eDP, поддержка DP1.2a и eDP1.3 |
| RK3588 | HDMI | 7680x4320@60hz | Два HDMI, поддержка HDMI 2.1 |
| RK3588 | DP | 7680x4320@30hz | Два DP, поддержка DP1.4 |
| RV1103/RV1106 | RGB | 1280x720@60hz | Поддержка RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3528 | HDMI | 4096x2160@60hz | Поддержка HDMI 2.0 |
| RK3528 | CVBS | 720x480i@60hz/720x576i@50hz | Поддержка NTSC/PAL |
| RK3562 | RGB | 1920x1080@60hz | Поддержка RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3562 | MIPI | 2048x1080@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.2 |
| RK3562 | LVDS | 1280x800@60hz | Поддержка VESA и JEIDA LVDS |
| RK3576 | HDMI | 4096x2160@120hz | Поддержка HDMI 2.1 |
| RK3576 | DP | 4096x2160@120hz | Поддержка DP1.4 |
| RK3576 | MIPI | 2560x1600@60hz | Поддержка DSI v1.1, DCS v1.4, DPHY v2.0 |
| RK3576 | eDP | 4096x2160@60hz | Поддержка DP1.2 и eDP1.3 |
| RK3576 | RGB | 1920x1080@60hz | Поддержка RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3506 | RGB | 1280x720@60hz | Поддержка RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RK3506 | MIPI | 1280x720@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.2 |
| RV1126B | RGB | 1920x1080@60hz | Поддержка RGB888/RGB666/RGB565/sRGB888/MCU/BT.656/BT.1120 |
| RV1126B | MIPI | 1920x1080@60hz | Поддержка DSI v1.1, DCS v1.1, DPHY v1.2 |

Примечание:

1. В RK3576/RK3588 eDP и HDMI используют комбинированные PHY. Поэтому в одном изделии при использовании HDMI0 нельзя использовать eDP0; то же относится к HDMI1 и eDP1.

### 4.3 Тракты отображения платформ VOP2

#### 4.3.1 Связи VP RK3528 с интерфейсами дисплея

![Исходный рисунок: 4.3.1 Связи VP RK3528 с интерфейсами дисплея; PDF p. 36](/docs/rockchip-drm-display-driver/assets/en-p36-X280.png)

Здесь разрешение 4K для VP0 означает 4096x2304, а 576i для VP1 — 720x576. Подробности приведены в разделах Display Interface и Video Output Processor документа Rockchip RK3528 datasheet.

#### 4.3.2 Связи VP RK3562 с интерфейсами дисплея

![Исходный рисунок: 4.3.2 Связи VP RK3562 с интерфейсами дисплея; PDF p. 37](/docs/rockchip-drm-display-driver/assets/en-p37-X285.png)

Здесь разрешение 2K для VP0 означает 2048x1080. Подробности приведены в разделах Display Interface и Video Output Processor документа Rockchip RK3562 datasheet.

#### 4.3.3 Связи VP RK3568 с интерфейсами дисплея

![Исходный рисунок: 4.3.3 Связи VP RK3568 с интерфейсами дисплея; PDF p. 37](/docs/rockchip-drm-display-driver/assets/en-p37-X236.png)

Подробности приведены в разделах Display Interface и Video Output Processor документа Rockchip RK3568 datasheet.

#### 4.3.4 Связи VP RK3576 с интерфейсами дисплея

![Исходный рисунок: 4.3.4 Связи VP RK3576 с интерфейсами дисплея; PDF p. 38](/docs/rockchip-drm-display-driver/assets/en-p38-X290.png)

Обратите внимание: разрешение 2K для VP1 на рисунке означает 2560x1600. Подробности приведены в разделах Display Interface и Video Output Processor документа Rockchip RK3576 datasheet.

#### 4.3.5 Связи VP RK3588 с интерфейсами дисплея

![Исходный рисунок: 4.3.5 Связи VP RK3588 с интерфейсами дисплея; PDF p. 38](/docs/rockchip-drm-display-driver/assets/en-p38-X291.png)

HDMI и DP RK3588 поддерживают вывод 8K, но в этом режиме один интерфейс одновременно занимает VP0 и VP1. Если изделию нужен вывод 8K, не подключайте другие интерфейсы к VP1. Подробности приведены в разделах Display Interface и Video Output Processor документа Rockchip RK3588 datasheet.

См. разделы Display Interface и Video Output Processor документа Rockchip RK3588 datasheet.

### 4.4 Возможности производных микросхем

#### 4.4.1 RK3566

В отличие от RK3568, RK3566 поддерживает только одинаковое содержимое на двух экранах со следующими требованиями:

Частоты обновления двух экранов должны совпадать.

Ориентация экранов должна совпадать: оба альбомные либо оба портретные.

Использование двухэкранного режима RK3566 описано в разделе о распределении слоёв RK3566.

#### 4.4.2 RK3576s

По сравнению с RK3576, в RK3576s оставлен только Video Port0; интерфейсы RGB/BT.1120/BT.656/MCU недоступны.

#### 4.4.3 RK3588s

По сравнению с RK3588, в RK3588s отсутствуют интерфейсы HDMI1, DP1 и eDP1.

### 4.5 Стратегии распределения DCLK платформ VOP

#### 4.5.1 Распределение VOP DCLK в RK3399

В RK3399 два VOP: VOPB[VOP0] и VOPL[VOP1]. Они могут использовать VPLL/CPLL, причём VPLL выделен для отображения. Для тракта HDMI DCLK VOP обязательно должен получаться делением VPLL; это необходимо правильно задать в DTS. При неверной конфигурации драйвер переключит HDMI на VPLL и выполнит смену разрешения, что внешне выглядит как выключение и повторное включение дисплея. Пример DTS:

```text
&hdmi_in_vopl {
  status = "disabled";
};

&hdmi_in_vopb {
  status = "okay";
};
&route_hdmi {
  connect = <&vopb_out_hdmi>;
};

&vopb {
  status = "okay";
  assigned-clocks = <&cru DCLK_VOP0_DIV>;
  /* The dclk parent for VOP->HDMI must from VPLL */
  assigned-clock-parents = <&cru PLL_VPLL>;
};
&vopl {
  status = "okay";
  assigned-clocks = <&cru DCLK_VOP1_DIV>;
  assigned-clock-parents = <&cru PLL_CPLL>;
};
```

#### 4.5.2 Распределение VOP DCLK в RK3528

##### 4.5.2.1 Обзор DCLK RK3528

RK3528 имеет 2 Video Port. Дерево dclk показано ниже:

![Исходный рисунок: 4.5.2.1 Обзор DCLK RK3528; PDF p. 40](/docs/rockchip-drm-display-driver/assets/en-p40-X305.png)

Для dclk Video Port0 родительским источником можно назначить hdmi_phy_pll либо dclk_vp0_src. Для dclk_vp0_src родительским источником может быть CPLL или GPLL.

Для dclk Video Port1 родительским источником может быть CPLL или GPLL.

Особенности hdmi_phy_pll:

Поддерживается получение произвольной частоты делением.

Особенности CPLL и GPLL:

PLL используется совместно с другими IP-блоками.

Произвольное деление не поддерживается; в английском оригинале сказано, что выходная частота кратна частоте PLL (см. замечание редактора о направлении деления).

По умолчанию HDMI использует hdmi_phy_pll как родительский источник dclk, что обеспечивает разные требуемые частоты. CVBS имеет лишь несколько фиксированных разрешений и соответствующих частот dclk; для них достаточно CPLL или GPLL.

#### 4.5.3 Распределение VOP DCLK в RK3562

##### 4.5.3.1 Обзор DCLK RK3562

RK3562 имеет только 1 Video Port. Дерево dclk показано ниже:

![Исходный рисунок: 4.5.3.1 Обзор DCLK RK3562; PDF p. 41](/docs/rockchip-drm-display-driver/assets/en-p41-X310.png)

Родительским источником dclk может быть VPLL, GPLL или APLL. HPLL выделен аудиоподсистеме для исключительного использования и недоступен VOP.

Особенности VPLL:

Можно выделить VOP для исключительного использования.

Поддерживается произвольная выходная частота.

VPLL — родительский источник VP0 по умолчанию.

Особенности GPLL и APLL:

PLL используется совместно с другими IP-блоками.

Произвольное деление не поддерживается; в английском оригинале выходная частота названа кратной частоте PLL (см. редакторское замечание).

Использование VPLL в качестве родительского источника VP0 по умолчанию обеспечивает разные требуемые частоты.

#### 4.5.4 Распределение VOP DCLK в RK3568

##### 4.5.4.1 Обзор DCLK RK3568

RK3568 имеет 3 Video Port. Дерево dclk каждого порта показано ниже:

![Исходный рисунок: 4.5.4.1 Обзор DCLK RK3568; PDF p. 41](/docs/rockchip-drm-display-driver/assets/en-p41-X311.png)

Родительским источником dclk любого Video Port может быть VPLL, GPLL, CPLL или HPLL.

Особенности VPLL и HPLL:

Можно выделить VOP для исключительного использования.

Поддерживается произвольная выходная частота.

В DTS по умолчанию HPLL назначен VP0, а VPLL — VP1:

```text
assigned-clocks = <&cru DCLK_VOP0>, <&cru DCLK_VOP1>, <&cru DCLK_VOP2>;
assigned-clock-parents = <&pmucru PLL_HPLL>, <&cru PLL_VPLL>, <&cru PLL_GPLL>;
```

Особенности GPLL и CPLL:

PLL используется совместно с другими IP-блоками.

Произвольное деление не поддерживается; английский оригинал называет выходную частоту кратной частоте PLL (см. редакторское замечание).

#### 4.5.5 Распределение VOP DCLK в RK3576

##### 4.5.5.1 Обзор DCLK RK3576

RK3576 имеет 3 Video Port. Дерево dclk каждого порта показано ниже:

![Исходный рисунок: 4.5.5.1 Обзор DCLK RK3576; PDF p. 42](/docs/rockchip-drm-display-driver/assets/en-p42-X318.png)

Для dclk всех Video Port можно выбрать родительским источником hdmi_phy_pll или dclk_vpx_src0/1/2. Для dclk_vpx_src0/1/2 можно выбрать VPLL, CPLL, GPLL, BPLL или LPLL.

VPLL, CPLL, GPLL, BPLL и LPLL находятся в системном CRU, а hdmi_phy_pll — в HDMI PHY.

Особенности VPLL:

Этот PLL может быть выделен VOP для исключительного использования.

Поддерживается произвольная выходная частота.

В DTS по умолчанию он назначен VP2:

```text
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Особенности CPLL, GPLL, BPLL и LPLL:

PLL используется совместно с другими IP-блоками.

Произвольное деление не поддерживается; английский оригинал называет выходную частоту кратной частоте PLL (см. редакторское замечание).

По умолчанию dclk_vp0/1/ привязан к GPLL.

BPLL и LPLL используются реже. По умолчанию BPLL используется CPU. Для его использования VOP необходимо переключить PLL процессора на PVTPLL. Кроме того, коэффициент деления BPLL может быть только 2, 3, 4, 6 или 8.

Стандартные связи родительских источников каждого Video Port:

![Исходный рисунок: 4.5.5.1 Обзор DCLK RK3576; PDF p. 43](/docs/rockchip-drm-display-driver/assets/en-p43-X323.png)

Особенности hdmi_phy_pll:

1. Поддерживается получение произвольной частоты делением.

2. Когда HDMI не работает, PLL используется только VOP. При работе HDMI он разделяется VOP и HDMI PHY.

3. HDMI и EDP используют общий PHY. При работе EDP PLL этого PHY недоступен VOP.

Второе и третье свойства ограничивают использование hdmi_phy_pll. Например:

1\. При работающем HDMI и привязке Video Port0 к HDMI доступны следующие варианты использования hdmi_phy_pll портами (для привязки к Video Port1/2 ситуация аналогична):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy_pll | DCLK &lt;= 600MHz: доступен; DCLK &gt; 600MHz: недоступен | недоступен | недоступен |

2\. При работающем EDP и привязке Video Port0 к EDP доступны следующие варианты использования hdmi_phy_pll (для привязки к Video Port1/2 ситуация аналогична):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy_pll | недоступен | недоступен | недоступен |

CPLL, GPLL, BPLL и LPLL не обеспечивают произвольное деление частоты для dclk Video Port. Если требуется точная частота и соблюдаются ограничения, родительским источником можно выбрать hdmi_phy_pll. Описаны три стратегии его использования:

1. Статическое распределение: hdmi_phy_pll привязывается к Video Port, который постоянно использует его как источник dclk.

2. Динамическое распределение с привязкой к интерфейсу HDMI: hdmi_phy_pll связывается с HDMI. PLL можно выделить только Video Port, использующему HDMI; этот порт динамически выбирает CRU PLL или hdmi_phy_pll в качестве источника dclk.

3. Динамическое распределение: hdmi_phy_pll предоставляется всем доступным VP и интерфейсам. Это самая сложная стратегия: приложение должно учитывать конфликты использования hdmi_phy_pll при включении интерфейсов и Video Port. Согласно оригиналу, она предоставляется только для изделий NVR.

Для обычных изделий первые две стратегии распределения источника dclk удовлетворяют требованиям.

##### 4.5.5.2 Статическое распределение VOP DCLK в RK3576

Ограничения статического распределения:

1\. Обычно один hdmi_phy_pll можно назначить только одному Video Port (VP0, VP1 или VP2).

2\. При работающем HDMI соответствующий hdmi_phy_pll можно назначить только Video Port, связанному

с этим HDMI, либо не использовать как источник dclk.

3\. Если при работающем HDMI соответствующий hdmi_phy_pll назначен Video Port этого интерфейса, пиксельная частота выходного разрешения не должна превышать 600MHz.

4\. При работе EDP, использующего общий PHY с HDMI, соответствующий hdmi_phy_pll нельзя использовать как источник dclk Video Port.

Статическое распределение означает привязку родительского источника dclk Video Port в DTSI. После задания связь не меняется.

```text
&hdptxphy_hdmi {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VP0>;
  assigned-clock-parents = <&hdptxphy_hdmi>;
};
```

В этом примере родительский источник dclk_vp0 привязан к hdmi_phy_pll.

Проверить действие конфигурации можно по дереву тактирования:

```text
rk3588_s:/ # cat /sys/kernel/debug/clk/clk_summary | grep "hdmiphy" -A 4
    clk_hdmiphy_pixel0 1   2    0     132000000 0   0  50000  ?
 27da0000.hdmi      link_clk

 display-subsystem  hdmi0_phy_pll

 hdmi@27da0000      no_connection_id
 deviceless         no_connection_id
      dclk_vp0        1    3    0     132000000 0   0  50000  Y
   27d00000.vop       dclk_vp0
```

Как видно, привязка действует; частота dclk_vp0 установлена в 132MHz. Она совпадает со значением в журнале.

В последней строке следующего журнала `set dclk_vp0 to 132000000, get 132000000` означает, что задано 132MHz и фактически получено 132MHz, как и в дереве clk.

```text
[  5.598827][ T331] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1080x1920p60, type: 16(if:MIPI0, flag:0x0) for vp0 dclk: 132000000
[  5.599012][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx_ropll_cmn_config bus_width:0 rate:742500
[  5.599185][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx phy pll locked!
[  5.599237][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx_ropll_cmn_config bus_width:0 rate:1320000
[  5.599415][ T331] rockchip-hdptx-phy-hdmi 2b000000.hdmiphy: hdptx phy pll locked!
[  5.599423][ T331] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vp0 to 132000000, get 132000000
```

##### 4.5.5.3 Динамическое распределение VOP DCLK RK3576 с привязкой к HDMI

`hdmi_phy_pll` можно выделить только Video Port, использующему HDMI. Этот порт динамически переключает источник dclk между CRU PLL и `hdmi_phy_pll` в зависимости от режима HDMI. Конфигурация:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
```

Если HDMI0 связан с VP0, в данной конфигурации источник dclk переключается по пиксельной частоте разрешения согласно таблице:

|  | Пиксельная частота &gt; 600MHz | Пиксельная частота &lt; 600MHz |
| --- | --- | --- |
| VP0--&gt;HDMI0 | CRU PLL | hdmi0 phy pll |

##### 4.5.5.4 Динамическое распределение VOP DCLK RK3576

Для динамической привязки необходима следующая конфигурация DTSI:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

По сравнению со второй стратегией в узел `vop` добавлено только свойство `rockchip,extend-phy-pll-shared-mode`.

Число PLL, обеспечивающих произвольную частоту, ограничено, а использование HDMI PHY PLL имеет дополнительные ограничения. Поэтому динамическое распределение сравнительно сложно и накладывает требования на сценарий работы изделия.

При каждом включении Video Port его dclk динамически привязывается по следующим правилам:

1\. HDMI, возможно вместе с DP или MIPI на том же Video Port, подключён к Video Port(0/1/2), далее VP_A, и dclk ниже 600MHz:

Если hdmi_phy_pll настроен и не используется другими Video Port, VP_A использует hdmi_phy0_pll.

Если hdmi_phy_pll настроен, но занят другим Video Port, выдаётся ошибка.

2\. К Video Port(0/1/2) подключён только DP:

Если это Video Port2, используется родительский источник dclk по умолчанию — VPLL.

Если hdmi_phy_pll не занят другим Video Port, он используется приоритетно; иначе используется родительский источник dclk по умолчанию.

Если требуемый dclk превышает 4k@60Hz, используется PLL по умолчанию.

Для наиболее полного использования hdmi_phy0_pll при динамической конфигурации рекомендуется:

По возможности не назначать VPLL родительским источником VP, связанного с HDMI.

Для некоторых сценариев RK3576 рекомендуются следующие сочетания Video Port и интерфейсов:

Вывод через 1 HDMI и 1 DP:

| Video Port | Конфигурация интерфейсов 1 | Конфигурация интерфейсов 2 |
| --- | --- | --- |
| Video Port0 | HDMI | Другой интерфейс дисплея |
| Video Port1 | Другой интерфейс дисплея | HDMI |
| Video Port2 | DP | DP |

В этой конфигурации DP на VP2 использует VPLL, а HDMI на VP0 — hdmi_phy_pll, поэтому оба интерфейса получают точные частоты.

Если родительский источник DP — не VPLL, DP попытается получить hdmi_phy_pll. Если его уже занимает HDMI, появляется следующее сообщение:

```text
[ 71.673928][ T397] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 2560x1440p60, type: 1lag:0x0) for vp1 dclk: 241500000
[ 71.674040][ T397] [drm] No free hdmi phy pll for DP, use default parent
[ 71.674088][ T397] rockchip-vop2 27d00000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vp1 to 241500000, get 23760
```

В этом случае DP использует текущий родительский источник по умолчанию и может не получить точную частоту.

##### 4.5.5.5 Выбор стратегии распределения VOP DCLK RK3576

Три стратегии предназначены главным образом для обеспечения произвольной частоты HDMI и DP. В большинстве сценариев достаточно динамического распределения с привязкой к HDMI. Ниже приведены стратегии для отдельных сценариев.

(1) Вывод через три порта; DP и HDMI требуют произвольной частоты.

| Video Port | Интерфейс |
| --- | --- |
| VP0 | HDMI |
| VP1 | DP |
| VP2 | DSI |

Используется динамическое переключение с привязкой к HDMI. Если пиксельная частота HDMI не превышает 600MHz, VP0 использует hdmi phy pll для произвольной частоты. При частоте больше или равной 600MHz используется целочисленное деление CRU PLL, а неподдерживаемые разрешения отфильтровываются. VP1, связанный с DP, использует VPLL для произвольной частоты.

Конфигурация DTS:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vp1 {
  assigned-clocks = <&cru DCLK_VP1_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

(2) Два экрана 4K, DP — основной. Поддерживается вывод VP0 в DP + HDMI либо VP0 в DP и VP1 в HDMI; пиксельные частоты VP0 и VP1 ниже 600MHz. Оба режима могут переключаться и должны поддерживать произвольную частоту:

| Video Port | Интерфейс |
| --- | --- |
| VP0 | DP + HDMI |

или

| Video Port | Интерфейс |
| --- | --- |
| VP0 | DP |
| VP1 | HDMI |

Поскольку HDMI может менять VP, используется статическое распределение: VP0 постоянно получает dclk от VPLL, а VP1 — от hdm phy pll. Конфигурация DTS:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VP0_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
&vp1 {
  assigned-clocks = <&cru DCLK_VP1>;
  assigned-clock-parents = <&hdptxphy_hdmi>;
};
```

(3) Интерфейсы могут произвольно менять VP, сохраняя возможность произвольной частоты. Это сложный сценарий, согласно оригиналу применяемый только в NVR. Например, HDMI/DP/DSI могут переключаться между VP0/1/2:

| Video Port | Интерфейс |
| --- | --- |
| VP0, VP1, VP2 | HDMI |
| VP0, VP1, VP2 | DP |
| VP0, VP1, VP2 | DSI |

Здесь используется следующая динамическая стратегия. DTS:

```text
&hdptxphy_hdmi {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi>;
  clock-names = "hdmi0_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};

&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_VPLL>;
};
```

Предположим, что сначала только DP использует VP2, а HDMI — VP0. Связи источников dclk:

| Тракт | Источник dclk |
| --- | --- |
| VP0-&gt;HDMI | hdmi phy pll |
| VP2-&gt;DP | VPLL |

Затем HDMI отключается, DP подключается к VP1, DSI — к VP2. DP использует hdmi phy pll, а DSI — VPLL:

| Тракт | Источник dclk |
| --- | --- |
| VP1-&gt;DP | hdmi phy pll |
| VP2-&gt;DSI | VPLL |

При этой динамической стратегии HDMI выбирает соответствующий hdmi phy pll, который не должен быть занят другим интерфейсом. Интерфейс не-HDMI может использовать hdmi phy pll, если источник соответствующего VP — не VPLL и hdmi phy pll свободен. Перед включением HDMI приложение обязано убедиться, что соответствующий hdmi phy pll не занят другим интерфейсом.

#### 4.5.6 Распределение VOP DCLK в RK3588

##### 4.5.6.1 Обзор DCLK RK3588

RK3588 имеет 4 Video Port. Дерево dclk каждого порта показано ниже:

![Исходный рисунок: 4.5.6.1 Обзор DCLK RK3588; PDF p. 48](/docs/rockchip-drm-display-driver/assets/en-p48-X338.png)

Для dclk_vp0/1/2 родительским источником можно назначить hdmi_phy0_pll, hdmi_phy1_pll или dclk_vpx_src0/1/2. Для dclk_vpx_src0/1/2 можно выбрать V0PLL, CPLL, GPLL или AUPLL.

Для dclk_vp3 родительским источником может быть V0PLL, CPLL, GPLL или AUPLL.

V0PLL, CPLL, GPLL и AUPLL находятся в системном CRU, а hdmi_phy0_pll и hdmi_phy1_pll — в HDMI PHY.

Особенности V0PLL:

1. Обычно этот PLL выделен VOP для исключительного использования.

2. Поддерживается произвольная частота.

3. По умолчанию DTS связывает его с dclk_vp2:

```text
vp2: port@2 {
  assigned-clocks = <&cru DCLK_VOP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
}
```

Особенности CPLL, GPLL и AUPLL:

1. PLL используется совместно с другими IP-блоками.

2. Произвольное деление не поддерживается; английский оригинал называет выходную частоту кратной частоте PLL (см. редакторское замечание).

3. По умолчанию dclk_vp0/1/3 привязан к GPLL.

Стандартные связи родительских источников Video Port:

![Исходный рисунок: 4.5.6.1 Обзор DCLK RK3588; PDF p. 49](/docs/rockchip-drm-display-driver/assets/en-p49-X343.png)

Особенности hdmi_phy0_pll и hdmi_phy1_pll:

1. Поддерживается получение произвольной частоты делением.

2. Когда HDMI не работает, VOP использует PLL эксклюзивно. При работающем HDMI PLL используется совместно с HDMI PHY.

3. HDMI и EDP используют общий PHY. При работе EDP PLL данного PHY недоступен VOP.

Второе и третье свойства hdmi_phy0_pll и hdmi_phy1_pll ограничивают их использование. Например:

1\. При работающем HDMI0 и привязке Video Port0 к HDMI0 доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz: доступен; DCLK &gt; 600MHz: недоступен | недоступен | недоступен |
| hdmi_phy1_pll | доступен | доступен | доступен |

2\. При работающем HDMI1 и привязке Video Port0 к HDMI1 доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | доступен | доступен | доступен |
| hdmi_phy1_pll | DCLK &lt;= 600MHz: доступен; DCLK &gt; 600MHz: недоступен | недоступен | недоступен |

3\. При одновременной работе HDMI0 и HDMI1, связанных с Video Port0, доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | DCLK &lt;= 600MHz: доступен; DCLK &gt; 600MHz: недоступен | недоступен | недоступен |
| hdmi_phy1_pll | DCLK &lt;= 600MHz: доступен; DCLK &gt; 600MHz: недоступен | недоступен | недоступен |

4\. При работающем EDP0 и привязке Video Port0 к EDP0 доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | недоступен | недоступен | недоступен |
| hdmi_phy1_pll | доступен | доступен | доступен |

5\. При работающем EDP1 и привязке Video Port0 к EDP1 доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0 DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | доступен | доступен | доступен |
| hdmi_phy1_pll | недоступен | недоступен | недоступен |

6\. При одновременной работе EDP0 и EDP1, связанных с Video Port0, доступны следующие варианты использования hdmi_phy0_pll и hdmi_phy1_pll (для Video Port1/2 аналогично):

| HDMI PHY PLL | VP0_DCLK | VP1_DCLK | VP2_DCLK |
| --- | --- | --- | --- |
| hdmi_phy0_pll | недоступен | недоступен | недоступен |
| hdmi_phy1_pll | недоступен | недоступен | недоступен |

CPLL, GPLL и AUPLL не обеспечивают произвольное деление для dclk Video Port. Если нужна точная частота и соблюдены ограничения, родительским источником можно выбрать hdmi_phy0_pll или hdmi_phy1_pll. Описаны три стратегии hdmi_phy_pll:

1. Статическое распределение: hdmi_phy_pll привязывается к Video Port, который постоянно использует его как источник dclk.

2. Динамическое распределение с привязкой к HDMI: hdmi_phy_pll связывается с HDMI. Он выделяется только Video Port, использующему HDMI; этот порт динамически выбирает CRU PLL либо hdmi_phy_pll как источник dclk.

3. Динамическое распределение: hdmi_phy_pll доступен всем пригодным VP и интерфейсам. Эта стратегия наиболее сложна; приложение должно учитывать конфликты использования hdmi_phy_pll при включении интерфейсов и Video Port. Согласно оригиналу, она предоставляется только для NVR.

Для обычных изделий первые две стратегии распределения источника dclk удовлетворяют требованиям.

##### 4.5.6.2 Статическое распределение VOP DCLK RK3588

Ограничения статического распределения:

1. Обычно один hdmi_phy_pll назначается только одному Video Port: VP0, VP1 или VP2.

2. При работе HDMI соответствующий hdmi_phy_pll можно назначить только Video Port этого интерфейса HDMI либо вообще не использовать как источник dclk.

3. Если при работающем HDMI его hdmi_phy_pll назначен соответствующему Video Port, пиксельная частота разрешения не должна превышать 600MHz.

4. При работе EDP, использующего общий PHY с HDMI, соответствующий hdmi_phy_pll нельзя использовать как источник dclk Video Port.

Статическое распределение задаёт родительский источник dclk Video Port в DTSI. После настройки эта связь не меняется.

Пример для ядра 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&vp0 {
  assigned-clocks = <&cru DCLK_VOP0>;
  assigned-clock-parents = <&hdptxphy_hdmi_clk0>;
};
&vp1 {
  assigned-clocks = <&cru DCLK_VOP1>;
  assigned-clock-parents = <&hdptxphy_hdmi_clk1>;
};
```

Пример для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&vp0 {
  assigned-clocks = <&cru DCLK_VOP0>;
  assigned-clock-parents = <&hdptxphy_hdmi0>;
};

&vp1 {
  assigned-clocks = <&cru DCLK_VOP1>;
  assigned-clock-parents = <&hdptxphy_hdmi1>;
};
```

Здесь родительский источник dclk_vp0 привязан к hdmi_phy0_pll, а dclk_vp1 — к hdmi_phy1_pll.

Проверить конфигурацию можно по дереву тактирования:

```text
rk3588_s:/ # cat /sys/kernel/debug/clk/clk_summary | grep "hdmiphy" -A 1
    clk_hdmiphy_pixel1 0    1     0      0     0   0 50000
      dclk_vop1        0    3     0      0     0   0 50000
    clk_hdmiphy_pixel0 1    1     0 148500000  0   0 50000
      dclk_vop0        2    5     0 148500000  0   0 50000
```

Привязка действует; частота dclk_vp0 установлена в 148.5MHz и совпадает с показанной в журнале.

Последняя строка следующего журнала `set dclk_vop0 to 148500000, get 148500000` означает, что задано и фактически получено 148.5MHz, как и в дереве clk.

```text
[ 270.974623][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:800) for vp0 dclk: 148500000
[ 270.974837][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out0 div: 0 dclk_core0 div: 2
[ 270.974891][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx_ropll_cmn_config bus_width:16a8c8 rate:1485000
[ 270.975264][ T381] rockchip-hdptx-phy-hdmi fed60000.hdmiphy: hdptx phy pll locked!
[ 270.975304][ T381] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop0 to 148500000, get 148500000
```

##### 4.5.6.3 Динамическое распределение VOP DCLK RK3588 с привязкой к HDMI

hdmi_phy_pll можно выделить только Video Port, использующему HDMI. Этот порт динамически переключает источник dclk между CRU PLL и hdmi phy pll по режиму HDMI. Конфигурация для ядра 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
```

Пример для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
```

Если HDMI0 связан с VP0, а HDMI1 — с VP1, источник dclk переключается по пиксельной частоте разрешения согласно таблице:

|  | Пиксельная частота &gt; 600MHz | Пиксельная частота &lt; 600MHz |
| --- | --- | --- |
| VP0--&gt;HDMI0 | CRU PLL | hdmi0 phy pll |
| VP1--&gt;HDMI1 | CRU PLL | hdmi1 phy pll |

##### 4.5.6.4 Динамическое распределение VOP DCLK RK3588

Конфигурация динамического распределения для ядра 5.10:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&hdptxphy_hdmi_clk0 {
  status = "okay";
};

&hdptxphy_hdmi_clk1 {
  status = "okay";
};

&display_subsystem {
  clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

Пример для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&vop {
  rockchip,extend-phy-pll-shared-mode;
};
```

По сравнению со второй стратегией в узел `vop` добавлено только свойство `rockchip,extend-phy-pll-shared-mode`.

Источников PLL с произвольной частотой немного, а использование HDMI PHY PLL ограничено. Поэтому динамическое распределение достаточно сложно и накладывает ограничения на сценарии работы изделия.

При каждом включении Video Port его dclk динамически привязывается по следующим правилам:

1\. HDMI0 и HDMI1, возможно вместе с DP или MIPI на том же порту, подключены к одному Video Port(0/1/2), а dclk ниже 600MHz:

1.1 Если hdmi_phy0_pll и hdmi_phy1_pll не заняты другими портами, родительским источником dclk текущего Video Port выбирается hdmi_phy0_pll. Оба PLL после этого недоступны другим Video Port.

1.2 Если любой из hdmi_phy0_pll или hdmi_phy1_pll занят другим Video Port, выдаётся ошибка.

2\. HDMI0, возможно вместе с DP или MIPI на том же порту, подключён к Video Port(0/1/2), далее VP_A, и dclk ниже 600MHz:

2.1 Если оба PLL существуют и hdmi_phy0_pll свободен, VP_A использует hdmi_phy0_pll; другим Video Port этот PLL недоступен.

2.2 Если оба PLL существуют, hdmi_phy0_pll занят другим Video Port (VP_B), а hdmi_phy1_pll свободен, VP_B должен освободить hdmi_phy0_pll и перейти на hdmi_phy1_pll; VP_A использует hdmi_phy0_pll.

2.3 Если оба PLL существуют и заняты другими Video Port, выдаётся ошибка.

2.4 Если настроен только hdmi_phy0_pll и он свободен, VP_A использует его.

2.5 Если настроен только hdmi_phy0_pll и он занят другим Video Port, выдаётся ошибка.

3\. HDMI1, возможно вместе с DP или MIPI на том же порту, подключён к Video Port(0/1/2), а dclk ниже 600MHz: стратегия аналогична пункту 2 и повторно не описывается.

4\. К Video Port(0/1/2) подключён только DP:

4.1 Для Video Port2 используется родительский источник dclk по умолчанию.

4.2 Если hdmi_phy0_pll или hdmi_phy1_pll не занят другим Video Port, приоритетно используется hdmi_phy0_pll либо hdmi phy1_pll; иначе — родительский источник dclk по умолчанию.

Если требуемый dclk превышает 4k@60Hz, используется PLL по умолчанию.

Для наиболее полного использования hdmi_phy0_pll и hdmi_phy1_pll при динамическом распределении рекомендуется:

1. По возможности не подключать HDMI0 и HDMI1 к Video Port2.

2. По возможности не подключать HDMI0 и HDMI1 к одному Video Port.

Для некоторых сценариев рекомендуются следующие сочетания Video Port и интерфейсов:

Вывод через 2 HDMI и 1 DP:

| Video Port | Конфигурация интерфейсов 1 | Конфигурация интерфейсов 2 |
| --- | --- | --- |
| Video Port0 | HDMI0 | HDMI1 |
| Video Port1 | HDMI1 | HDMI0 |
| Video Port2 | DP0/DP1 | DP0/DP1 |

Вывод через 2 DP и 1 HDMI:

| Video<br>Port | Конфигурация интерфейсов 1 | Конфигурация интерфейсов 2 | Конфигурация интерфейсов 3 | Конфигурация интерфейсов 4 |
| --- | --- | --- | --- | --- |
| Video<br>Port0 | HDMI0/1 | HDMI0/1 | DP0 | DP1 |
| Video<br>Port1 | DP0 | DP1 | HDMI0/1 | HDMI0/1 |
| Video<br>Port2 | DP1 | DP0 | DP1 | DP0 |

Другие сценарии требуют обоснованной конфигурации с учётом правил динамического распределения.

При динамическом распределении оба HDMI PHY PLL могут оказаться заняты. Тогда журнал выводит сведения об их использовании:

```text
[ 220.692900][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:1000) for vp1 dclk: 148500000
[ 220.693048][ T383] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out1 div: 0 dclk_core1 div: 2
[ 220.693094][ T383] [drm:vop2_clk_set_parent_extend.isra.61] *ERROR* hdmi1 phy pll is used by vp0:vp2
```

Здесь hdmi_phy0_pll занят Video Port0, а hdmi_phy1_pll — Video Port2.

Пример, когда настроен только один HDMI PHY PLL:

```text
&display_subsystem {
     clocks = <&hdptxphy_hdmi_clk0>;
     clock-names = "hdmi0_phy_pll";
};
```

Следующий журнал означает, что hdmi_phy0_pll занят Video Port2.

```text
[ 35.059306][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] Update mode to 1920x1080p60, type: 11(if:800) for vp0 dclk: 148500000
[ 35.059416][ T386] rockchip-vop2 fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out0 div: 0 dclk_core0 div: 2
[ 35.059447][ T386] [drm:vop2_clk_set_parent_extend.isra.61] *ERROR* hdmi0: phy pll is used by vp2
```

##### 4.5.6.5 Выбор стратегии распределения VOP DCLK RK3588

Три стратегии предназначены главным образом для обеспечения произвольной частоты HDMI и DP. В большинстве сценариев достаточно динамического распределения с привязкой к HDMI. Ниже приведены стратегии для отдельных случаев.

(1) Вывод через четыре Video Port; DP и HDMI должны поддерживать произвольную частоту.

| Video Port | Интерфейс |
| --- | --- |
| VP0 | HDMI0 |
| VP1 | HDMI1 |
| VP2 | DP0 |
| VP3 | DSI0 |

Используйте динамическое переключение HDMI. При пиксельной частоте HDMI меньше или равной 600MHz источником dclk выбирается hdmi phy pll для произвольной частоты. При частоте больше или равной 600MHz используется целочисленное деление CRU PLL с отбрасыванием неподдерживаемых разрешений. VP2, соответствующий DP0, использует VPLL для произвольной частоты.

DTS для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

(2) Вывод через четыре Video Port; DP и HDMI должны поддерживать произвольную частоту.

| Video Port | Интерфейс |
| --- | --- |
| VP0 | HDMI0 |
| VP1 | DP0 |
| VP2 | DP1 |
| VP3 | DSI0 |

Используйте динамическое переключение HDMI. Если пиксельная частота HDMI0 не превышает 600MHz, VP0 использует hdmi phy pll для произвольной частоты. При частоте больше или равной 600MHz используется целочисленное деление CRU PLL с отбрасыванием неподдерживаемых разрешений. Для DP0 источник dclk VP1 — hdmi phy1 pll, а для DP1 источник dclk VP2 — V0PLL; это обеспечивает произвольную частоту.

DTS для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>;
  clock-names = "hdmi0_phy_pll";
};

&vp1 {
  assigned-clocks = <&cru DCLK_VP1>;
  assigned-clock-parents = <&hdptxphy_hdmi1>;
};
&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

(3) Интерфейсы могут произвольно переключаться между VP с поддержкой произвольной частоты. Это сложный сценарий, согласно оригиналу применяемый только в NVR. Например, HDMI/DP/DSI могут использовать VP0/1/2:

| Video Port | Интерфейс |
| --- | --- |
| VP0, VP1, VP2 | HDMI0 |
| VP0, VP1, VP2 | HDMI1 |
| VP0, VP1, VP2 | DP0 |
| VP0, VP1, VP2 | DP1 |

Используйте следующую динамическую стратегию. DTS для ядра 6.1 и новее:

```text
&hdptxphy_hdmi0 {
  status = "okay";
};

&hdptxphy_hdmi1 {
  status = "okay";
};
&display_subsystem {
  clocks = <&hdptxphy_hdmi0>, <&hdptxphy_hdmi1>;
  clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&vop {
  rockchip,extend-phy-pll-shared-mode;
};

&vp2 {
  assigned-clocks = <&cru DCLK_VP2_SRC>;
  assigned-clock-parents = <&cru PLL_V0PLL>;
};
```

Предположим, сначала HDMI0 использует VP0, HDMI1 — VP1, DP0 — VP1:

| Тракт | Источник dclk |
| --- | --- |
| VP0-&gt;HDMI0 | hdmi phy0 pll |
| VP1-&gt;HDMI1 | hdmi phy1 pll |
| VP2-&gt;DP0 | V0PLL |

Затем оба HDMI отключаются, сначала HDMI1 снова подключается к VP0, а затем DP1 — к VP1. Распределение источников dclk:

| Тракт | Источник dclk |
| --- | --- |
| VP0-&gt;HDMI1 | hdmi phy1 pll |
| VP1-&gt;DP1 | hdmi phy0 pll |
| VP2-&gt;DP0 | V0PLL |

В этой стратегии HDMI выбирает соответствующий hdmi phy pll, который не должен быть занят другим интерфейсом. Интерфейс не-HDMI может использовать hdmi phy pll, если источник соответствующего VP — не V0PLL и PLL свободен. Перед включением HDMI приложение должно убедиться, что нужный hdmi phy pll не занят другим интерфейсом.

## 5. Многоэкранный вывод в архитектуре VOP 2.0

Как описано выше, для независимого вывода на несколько экранов архитектуре VOP 1.0 обычно нужно несколько VOP. Поэтому независимый двухэкранный вывод поддерживают только микросхемы с двумя VOP, например RK3288, RK3399 и PX30.

Единая архитектура VOP 2.0 позволяет эффективнее использовать IP-ресурсы. В базовом случае число независимых выходов равно числу Video Port внутри VOP. Согласно разделу о трактах VOP2, у RK3568 три независимых Video Port, а у RK3588 — четыре. Поэтому базово они обеспечивают соответственно 3 и 4 независимых выхода.

### 5.1 Connector-mirror

Технология Connector-mirror VOP2 позволяет одному Video Port одновременно управлять несколькими интерфейсами, формируя одинаковую временную развёртку и одинаковое содержимое.

![Исходный рисунок: 5.1 Connector-mirror; PDF p. 58](/docs/rockchip-drm-display-driver/assets/en-p58-X366.png)

На рисунке RK3588 два HDMI/eDP подключены к VP0, два DP — к VP1, два MIPI DSI — к VP2. Через VP3 используется BT656 или BT1120; в исходном описании говорится об одновременных 7 каналах в четырёх независимых группах вывода. В каждой группе два интерфейса одного Video Port имеют одинаковую развёртку и содержимое.

Максимальное разрешение каждой группы ограничено максимальными разрешениями соответствующего Video Port и интерфейса.

Для включения функции достаточно соединить два интерфейса с одним VP в DTS:

```text
&hdmi0 {
     status = "okay";
};

&hdmi1 {
     status = "okay";
};

&hdmi0_in_vp0 {
     status = "okay";
};
&hdmi1_in_vp0 {
     status = "okay";
};

&hdmi0_in_vp1 {
     status = "disabled";
};
&hdmi0_in_vp2 {
     status = "disabled";
};

&hdmi1_in_vp1 {
     status = "disabled";
};

&hdmi1_in_vp2 {
     status = "disabled";
};
```

Эта конфигурация подключает HDMI0 и HDMI1 к VP0 и включает connector-mirror.

Согласно оригиналу, NVR SDK поддерживает функцию, а для Android требуется версия hwc новее 1.4.15.

### 5.2 Connector-split

Connector-split VOP2 аналогичен двухканальному режиму MIPI. Он делит выход одного Video Port по горизонтали на два тракта, одновременно управляя двумя интерфейсами с одинаковой развёрткой, но независимым содержимым.

![Исходный рисунок: 5.2 Connector-split; PDF p. 60](/docs/rockchip-drm-display-driver/assets/en-p60-X374.png)

Если split включён на VP0, его выход может одновременно управлять двумя интерфейсами — HDMI0/1, eDP0/1 или другими совместимыми с VP0. Они отображают левую и правую половины выхода VP0. Например, при выходе VP0 3840x1080 каждый интерфейс отображает 1920x1080.

Эта технология позволяет расширить RK3588 до 7 независимых выходов.

У двух интерфейсов, участвующих в split одного VP, временные параметры и частоты кадров должны совпадать.

Connector-split расширяет возможности независимого многоэкранного вывода. Согласно оригиналу, функция поддерживается только RK3588/RK3576 и имеет два режима в зависимости от типа интерфейсов:

1\. Split для одинаковых интерфейсов: `rockchip,split-mode`

(1) Один VP подключён к 2 интерфейсам/экранам с полностью одинаковой развёрткой. (2) Экраны отображают левую и правую половины изображения. (3) DTS/EDID задаёт развёртку одного экрана; драйвер удваивает горизонтальные параметры через `drm_mode_convert_to_split_mode()` и передаёт их VOP. (4) Регистрируется 1 connector; приложение видит 1 устройство отображения.

В DTS оба участвующих интерфейса подключаются к одному VP; у левого интерфейса включается свойство `rockchip,split-mode`.

Например, split hdmi0 и hdmi1 на VP0 включается следующей конфигурацией:

```text
&hdmi0 {
     status = "okay";
};

&hdmi1 {
     status = "okay";
     rockchip,split-mode;
};
&hdmi0_in_vp0 {
     status = "okay";
};

&hdmi1_in_vp0 {
     status = "okay";
};
&hdmi0_in_vp1 {
     status = "disabled";
};

&hdmi0_in_vp2 {
     status = "disabled";
};
&hdmi1_in_vp1 {
     status = "disabled";
};

&hdmi1_in_vp2 {
     status = "disabled";
};
```

Для упрощения адаптации приложений и сходства с двухканальным MIPI драйвер скрывает различия реализации: для двух интерфейсов split одного Video Port в drm регистрируются только один encoder и один connector. Поэтому пользовательское пространство видит один connector для каждого CRTC (Video Port). Это можно проверить выводом modetest.

Для Android-приложений, ожидающих отдельное устройство отображения на каждый экран, hwc Rockchip имеет соответствующие оптимизации. Подробности — в документе «DrmHwc2 Multi-screen Stitching and Different-display Function Description».

2\. Split для разных интерфейсов: `rockchip,dual-connector-split`

(1) Один VP подключён к 2 разным интерфейсам с полностью одинаковой развёрткой. (2) Экраны отображают левую и правую половины изображения. (3) DTS/EDID задаёт развёртку одного экрана; драйвер удваивает горизонтальные параметры через `drm_mode_convert_to_split_mode()` и передаёт VOP. (4) Регистрируются 2 connector; приложение видит 2 устройства отображения.

Главное отличие от `rockchip,split-mode` — использование двух разных интерфейсов. DRM должен отдельно управлять их драйверами, поэтому регистрирует 2 connector, и приложение видит 2 устройства. Для включения задайте `rockchip,dual-connector-split` в соответствующем интерфейсном узле; левый экран обозначается свойством `rockchip,left-display`.

Например, следующая конфигурация включает split HDMI0 и DP0 на VP0, при этом HDMI0 отображает левую половину:

```text
&hdmi0 {
     status = "okay";
     rockchip,dual-connector-split;
     rockchip,left-display;
};

&dp0 {
     status = "okay";
     rockchip,dual-connector-split;
};
&hdmi0_in_vp0 {
     status = "okay";
};

&dp0_in_vp0 {
     status = "okay";
};
&hdmi0_in_vp1 {
     status = "disabled";
};

&hdmi0_in_vp2 {
     status = "disabled";
};

&dp0_in_vp1 {
     status = "disabled";
};
&dp0_in_vp2 {
     status = "disabled";
};
```

## 6. Аппаратные вопросы

### 6.1 Подключение RGB/TTL

#### 6.1.1 Подключение RGB в VOP 1.0

1\. Определить архитектуру VOP 1.0 или VOP 2.0 можно по версии VOP в разделе 3.1, указанном оригиналом.

2\. Подключение SoC с поддержкой 24-битного RGB:

![Исходный рисунок: 6.1.1 Подключение RGB в VOP 1.0; PDF p. 62](/docs/rockchip-drm-display-driver/assets/en-p62-X379.png)

3\. Подключение SoC с поддержкой 18-битного RGB:

![Исходный рисунок: 6.1.1 Подключение RGB в VOP 1.0; PDF p. 63](/docs/rockchip-drm-display-driver/assets/en-p63-X385.png)

4\. Для интерфейса MCU в VOP 1.0 линии DATA подключаются так же, как при параллельном RGB. Четыре сигнала синхронизации параллельного RGB мультиплексируются в управляющие сигналы MCU. Соответствие:

![Исходный рисунок: 6.1.1 Подключение RGB в VOP 1.0; PDF p. 63](/docs/rockchip-drm-display-driver/assets/en-p63-X386.png)

#### 6.1.2 Подключение RGB в VOP 2.0 и новее

![Исходный рисунок: 6.1.2 Подключение RGB в VOP 2.0 и новее; PDF p. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X389.png)

#### 6.1.3 Программная конфигурация для разных display mode index

![Исходный рисунок: 6.1.3 Программная конфигурация для разных display mode index; PDF p. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X390.png)

#### 6.1.4 Подключение BT.656 и BT.1120

![Исходный рисунок: 6.1.4 Подключение BT.656 и BT.1120; PDF p. 64](/docs/rockchip-drm-display-driver/assets/en-p64-X391.png)

При неверных цветах изображения настройте bus_formats в DTS под порядок обработки Y/U/V приёмником. Для BT.656 и BT.1120 предусмотрены по четыре конфигурации:

BT.656:

```text
#define MEDIA_BUS_FMT_UYVY8_2X8 0x2006
#define MEDIA_BUS_FMT_VYUY8_2X8 0x2007
#define MEDIA_BUS_FMT_YUYV8_2X8 0x2008
#define MEDIA_BUS_FMT_YVYU8_2X8 0x2009
```

BT.1120:

```text
#define MEDIA_BUS_FMT_UYVY8_1X16 0x200f
#define MEDIA_BUS_FMT_VYUY8_1X16 0x2010
#define MEDIA_BUS_FMT_YUYV8_1X16 0x2011
#define MEDIA_BUS_FMT_YVYU8_1X16 0x2012
```

Определения MEDIA_BUS_FMT см. в:

```text
./include/uapi/linux/media-bus-format.h
```

### 6.2 Распределение данных LVDS

![Исходный рисунок: 6.2 Распределение данных LVDS; PDF p. 65](/docs/rockchip-drm-display-driver/assets/en-p65-X397.png)

## 7. Временные параметры развёртки

### 7.1 Типовая диаграмма развёртки

![Исходный рисунок: 7.1 Типовая диаграмма развёртки; PDF p. 66](/docs/rockchip-drm-display-driver/assets/en-p66-X403.png)

### 7.2 Определение временных параметров в DRM

![Исходный рисунок: 7.2 Определение временных параметров в DRM; PDF p. 66](/docs/rockchip-drm-display-driver/assets/en-p66-X405.png)

### 7.3 Соответствие и преобразование программных настроек

![Исходный рисунок: 7.3 Соответствие и преобразование программных настроек; PDF p. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X409.png)

![Исходный рисунок: 7.3 Соответствие и преобразование программных настроек; PDF p. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X411.png)

### 7.4 Просмотр текущих временных параметров

![Исходный рисунок: 7.4 Просмотр текущих временных параметров; PDF p. 67](/docs/rockchip-drm-display-driver/assets/en-p67-X412.png)

## 8. Расчёт пропускной способности

### 8.1 Пропускная способность изображения

Пример данных изображения 1080P в формате ARGB:

![Исходный рисунок: 8.1 Пропускная способность изображения; PDF p. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X418.png)

Память на один пиксель ARGB: 4 Byte.

Память для данных 1080P ARGB: 1920 x 1080 x 4Byte/pixel = 8,100 Kbyte.

При обновлении 60fps требуемая пропускная способность: 8,100 x 60fps = 474.6 Mbyte/s.

При изменении формата на YUV420SP(NV12):

![Исходный рисунок: 8.1 Пропускная способность изображения; PDF p. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X419.png)

Память на один пиксель NV12: 1.5 Byte.

Память для данных 1080P NV12: 1920 x 1080 x 1.5Byte/pixel = 3,037.5 Kbyte.

При обновлении 60fps требуемая пропускная способность: 3,037.5 x 60fps = 178 Mbyte/s.

### 8.2 Пропускная способность интерфейса дисплея

![Исходный рисунок: 8.2 Пропускная способность интерфейса дисплея; PDF p. 68](/docs/rockchip-drm-display-driver/assets/en-p68-X420.png)

Для временных параметров на рисунке и обновления 60 кадров/с необходим dclk 131994240 hz. После округления в DTS задаётся 132000000 hz:

```text
htotal = hfp + hsync + hbp + hactive = 15 + 2 + 30 + 1080 = 1,127
vtotal = vfp + vsync + vbp + vactive = 15 + 2 + 15 + 1920 = 1,952
dclk = htotal x vtotal x fps = 1127 x 1952 x 60fps = 131,994,240
```

Частота передачи через MIPI:

```text
132M x 3(RGB) x 8(bpc) / 4(lane) / 0.9 = 880 Mbps
```

Здесь:

x3(RGB): каждый пиксель содержит 3 компонента RGB;

x8(bpc): глубина каждого компонента — 8bit;

/4(lane): общий объём данных передаётся по 4 линиям, поэтому определяется объём на одну линию;

/0.9: учитывается эффективность передачи с временными параметрами MIPI.

## 9. Основные методы отладки

### 9.1 Выгрузка текущего состояния дисплея

#### 9.1.1 Команда

```text
cat /sys/kernel/debug/dri/0/summary
```

![Исходный рисунок: 9.1.1 Команда; PDF p. 70](/docs/rockchip-drm-display-driver/assets/en-p70-X431.png)

Команда зависит от debugfs ядра. Если функция отключена либо debugfs не смонтирован, убедитесь, что включён `CONFIG_DEBUG_FS`, и вручную выполните монтирование:

```text
mount -t debugfs none /sys/kernel/debug
```

#### 9.1.2 Описание параметров

1\. Две красные рамки показывают VOP двух устройств отображения: ff900000.vop и ff8f0000.vop.

2\. Зелёным показана информация connector. Устройства — экран eDP и экран MIPI соответственно.

3\. Розовым показан режим отображения, из которого определяются временные параметры, DCLK и частота кадров. На рисунке это eDP с разрешением 1536x2048p60 и MIPI с разрешением 1280x720p29.

4\. Синим показаны слои VOP. У первого устройства включён win0 размером 1536x2048 в формате XRGB. У второго включён win0 размером 1280x720 в формате XRGB. `src` и `dst` задают размер и положение исходных данных и вывода. При разных размерах `src` и `dst` VOP выполняет масштабирование, как показано ниже:

![Исходный рисунок: 9.1.2 Описание параметров; PDF p. 71](/docs/rockchip-drm-display-driver/assets/en-p71-X437.png)

5\. Оранжевым показано состояние VOP HDR и CSC. `SDR` означает, что приложение передало данные SDR; для HDR виден маркер `HDR`.

6\. Сведения summary VOP2 в основном совпадают с предыдущими платформами, но вместо VOP указан Video Port, а имена `winx` заменены на `Cluster-winx` или `Esmart-winx`:

![Исходный рисунок: 9.1.2 Описание параметров; PDF p. 71](/docs/rockchip-drm-display-driver/assets/en-p71-X438.png)

7\. У каждого слоя имеется свойство `format`. Стандартные значения fourcc, например `AB24`, `XR24`, `NV12`, задают формат данных кадрового буфера этого слоя. Значения см. в [drm fourcc](https://elixir.bootlin.com/linux/latest/source/include/uapi/drm/drm_fourcc.h).

#### 9.1.3 Выгрузка текущей конфигурации VOP

Из-за сложной архитектуры VOP2 и большого количества регистров доступны два способа выгрузки текущей конфигурации:

1\. Получение конфигурации чтением узла DRM через cat. Например:

(1) Регистры работающих модулей VOP:

```text
cat /sys/kernel/debug/dri/0/active_regs
```

(2) Регистры всех подмодулей VOP:

```text
cat /sys/kernel/debug/dri/0/regs
```

Эти команды выгружают конфигурацию регистров VOP. Вместе с `cat /sys/kernel/debug/dri/0/summary` из предыдущего раздела они позволяют получить основные сведения о текущем состоянии вывода.

По умолчанию функция поддерживается ядрами Linux-6.1 и новее. Для Linux-5.10 и Linux-

4.19 требуется достаточно новая редакция соответствующей ветки. Если обновление неудобно, используйте второй способ.

2\. Скрипт [vop2_dump](https://gitee.com/andyshrk/drm/blob/master/res/vop2_dump.sh).sh

Скрипт удобнее выгружает сведения о состоянии VOP. В большинстве SDK он присутствует по умолчанию; иначе его можно получить по ссылке [vop2_dump](https://gitee.com/andyshrk/drm/blob/master/res/vop2_dump.sh).

Скрипт также зависит от `debugfs` и требует включённого `CONFIG_DEVMEM`, чтобы читать регистры командой `io`.

### 9.2 Выгрузка отображаемого буфера

Нарушение изображения может возникать в тракте VOP → интерфейс → экран/монитор либо уже в данных, нарисованных приложением. Выгрузите буфер отображаемого слоя VOP и проверьте его, например, программой 7yuv. Если сами данные повреждены, проблема поступила из пользовательского пространства. В противном случае проверяйте тракт от VOP до экрана.

#### 9.2.1 Порядок использования

Сначала убедитесь, что через `make menuconfig` включён параметр ядра CONFIG_ROCKCHIP_DRM_DEBUG.

![Исходный рисунок: 9.2.1 Порядок использования; PDF p. 72](/docs/rockchip-drm-display-driver/assets/en-p72-X443.png)

1\. Выгрузить один кадр текущего буфера:

```text
echo dump > /sys/kernel/debug/dri/0/**ff900000.vop**/vop_dump/dump
```

2\. Непрерывно выгрузить n кадров:

```text
echo dumpn > /sys/kernel/debug/dri/0/**ff900000.vop**/vop_dump/dump
```

3\. Файлы сохраняются в `/data/vop_buf/`; их можно просмотреть программой 7yuv.

4\. Выделенная часть пути `[ff900000.vop]` отличается на разных платформах. Путь соответствует VOP/Video Port в узле `cat /sys/kernel/debug/dri/0/summary`. Например, для RK3588 путь имеет вид `/sys/kernel/debug/dri/0/**video_port0**/dump`.

### 9.3 Цветовые полосы в режиме самотестирования VP

На платформах VOP2 каждый VP поддерживает вывод цветовых полос в режиме самотестирования. Команды для VP0:

Значение 1 включает горизонтальные полосы, 2 — вертикальные, 0 отключает полосы. Подписи внутри следующего исходного блока сохранены вместе с командами.

```text
Enable horizontal color bar:
  echo 1 > /sys/kernel/debug/dri/0/video_port0/color_bar
Enable vertical color bar:
  echo 2 > /sys/kernel/debug/dri/0/video_port0/color_bar
Disable color bar:
  echo 0 > /sys/kernel/debug/dri/0/video_port0/color_bar
```

1\. Результат при `color_bar = 1`

![Исходный рисунок: 9.3 Цветовые полосы в режиме самотестирования VP; PDF p. 73](/docs/rockchip-drm-display-driver/assets/en-p73-X451.png)

2\. Результат при `color_bar = 2`

![Исходный рисунок: 9.3 Цветовые полосы в режиме самотестирования VP; PDF p. 73](/docs/rockchip-drm-display-driver/assets/en-p73-X452.png)

Если экран не показывает изображение либо вывод нарушен, режим самотестирования VP используется так:

1. Если полосы отображаются нормально, можно исключить нарушения интерфейса дисплея и экрана. Проверяйте VOP и пользовательское пространство.

2. Если полосы не отображаются нормально, проверяйте VOP и модули после него.

### 9.4 Уровень журналирования DRM

DRM задаёт уровни журналирования для разных интерфейсов. Включение и отключение управляется узлом DRM debug. Например, для сообщений ATOMIC:

```text
echo 0x10 > /sys/module/drm/parameters/debug
```

Для всех отладочных сообщений:

```text
echo 0xff > /sys/module/drm/parameters/debug
```

Бит 5, то есть 0x20, соответствует сообщениям vsync. Их очень много; если они не нужны при отладке, этот бит обычно не устанавливают.

Другие уровни приведены в следующем определении:

Каждый бит включает категорию отладки: бит 0 (0x01) — CORE, основная часть DRM; бит 1 (0x02) — DRIVER, контроллер DRM; бит 2 (0x04) — KMS, установка режимов; бит 3 (0x08) — PRIME; бит 4 (0x10) — ATOMIC; бит 5 (0x20) — VBL, вертикальное гашение; бит 7 (0x80) — LEASE, аренда ресурсов; бит 8 (0x100) — DP, DisplayPort. Исходное определение:

```text
Enable debug output, where each bit enables a debug category.
Bit 0 (0x01) will enable CORE messages (drm core code)
Bit 1 (0x02) will enable DRIVER messages (drm controller code)
Bit 2 (0x04) will enable KMS messages (modesetting code)
Bit 3 (0x08) will enable PRIME messages (prime code)
Bit 4 (0x10) will enable ATOMIC messages (atomic code)
Bit 5 (0x20) will enable VBL messages (vblank code)
Bit 7 (0x80) will enable LEASE messages (leasing code)
Bit 8 (0x100) will enable DP messages (displayport code)
```

Сообщений много, и по умолчанию они не все выводятся в последовательный порт. После включения отладки терминал последовательного порта покажет лишь часть. Полный журнал смотрите командой `dmesg`.

### 9.5 Просмотр текущего тактирования дисплея

Тактирование — один из ключевых факторов работы дисплея. Текущие частоты системы можно получить следующими командами:

1\. Всё дерево тактирования:

```text
cat /sys/kernel/debug/clk/clk_summary
```

2\. Только тактирование VOP:

```text
cat /sys/kernel/debug/clk/clk_summary | grep vop
```

Для HDMI/DP/VGA/CVBS стандарт строго задаёт DCLK каждого разрешения. Неверная частота может привести к отсутствию изображения или проблемам совместимости. Для eDP/LVDS/MIPI/RGB обычно имеется некоторый запас.

При включении интерфейса драйвер VOP2 печатает требуемую частоту и частоту, полученную от системы. Их несовпадению следует уделять особое внимание.

```text
rockchip-vop2: [vop2_crtc_atomic_enable] Update mode to 3840x2160p60, type: 10(if:200) for vp2 dclk: 533280000
fdd90000.vop: [drm:vop2_crtc_atomic_enable] dclk_out2 div: 2 dclk_core2 div: 2
fdd90000.vop: [drm:vop2_crtc_atomic_enable] set dclk_vop2 to 533280000, get 533279987
```

В журнале на VP2 включается DP (видно по type) с разрешением 4K. Требуемый dclk — 533280000 HZ, а выделенный системой — 533279987 HZ. Поскольку DP требует высокой точности dclk, по оценке исходного документа экран в этом случае, скорее всего, не включится.

### 9.6 Принудительное включение и отключение дисплея

Пример для LVDS:

Отключить LVDS: `echo off &gt; /sys/class/drm/card0-LVDS-1/status`

Включить LVDS: `echo on &gt; /sys/class/drm/card0-LVDS-1/status`

### 9.7 Использование буферов DRM

Использование буферов, выделенных через DRM GEM, показывает следующая команда:

```text
cat /sys/kernel/debug/dri/0/mm_dump
```

![Исходный рисунок: 9.7 Использование буферов DRM; PDF p. 75](/docs/rockchip-drm-display-driver/assets/en-p75-X460.png)

### 9.8 Состояние GPIO

При первоначальном запуске проекта часто требуется управлять питанием экрана или подсветкой через GPIO. Правильность программно заданного состояния GPIO можно проверить командой:

```text
cat /sys/kernel/debug/gpio
```

![Исходный рисунок: 9.8 Состояние GPIO; PDF p. 75](/docs/rockchip-drm-display-driver/assets/en-p75-X461.png)

### 9.9 Использование modetest

modetest — встроенная в libdrm утилита командной строки для тестирования drm. Возможности:

1\. Выгрузка основного состояния drm

```text
[root@RK356X:/]# modetest -M rockchip
Encoders:
id   crtc type possible crtcs possible clones
151  0   Virtual 0x00000007 0x00000000
153  0   TMDS 0x00000002 0x00000000
155  71  TMDS 0x00000001 0x00000000
166  0   DPI  0x00000004 0x00000000
Connectors:
id   encoder status name     size (mm) modes encoders
154  0    disconnected eDP-1 0x0       0    153
 props:
     1 EDID:
          flags: immutable blob
          blobs:
          value:
     2 DPMS:
          flags: enum
          enums: On=0 Standby=1 Suspend=2 Off=3
          value: 0
156  155  connected HDMI-A-1 530x300   31   155
 modes:
     name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: preferred, driver
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148352 flags: phsync, pvsync; type: driver
 1920x1080 50 1920 2448 2492 2640 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: driver
 1280x720 60 1280 1390 1430 1650 720 725 730 750 74250 flags: phsync, pvsync; type: driver
 720x576 50 720 732 796 864 576 581 586 625 27000 flags: nhsync, nvsync; type: driver
 720x480 60 720 736 798 858 480 489 495 525 27027 flags: nhsync, nvsync; type: driver
 props:
167  0    disconnected HDMI-A-2 0x0    0    166
 props:
CRTCs:
id   fb   pos  size
71   0    (0,0) (1920x1080)
  60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync, pvsync; type: userdef
 props:
     72 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 21
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
87   0    (0,0) (0x0)
  0 0 0 0 0 0 0 0 0 0 flags: ; type:
 props:
     88 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 34
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
103  0    (0,0) (0x0)
  0 0 0 0 0 0 0 0 0 0 flags: ; type:
 props:
     104 PLANE_MASK:
          flags: immutable bitmask
          values: Cluster0=0x1 Cluster1=0x2 Esmart0=0x4 Esmart1=0x8 Smart0=0x10 Smart1=0x20 Cluster2=0x40 Cluster3=0x80 Esmart2=0x100 Esmart3=0x200
          value: 8
     26 GAMMA_LUT:
          flags: blob
          blobs:
          value:
     27 GAMMA_LUT_SIZE:
          flags: immutable range
          values: 0 4294967295
          value: 1024
Planes:
id   crtc fb   CRTC x,y x,y  gamma size possible crtcs
57   0    0    0,0      0,0  0         0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16
 props:
     8 type:
          flags: immutable enum
          enums: Overlay=0 Primary=1 Cursor=2
          value: 1
     60 alpha:
          flags: range
          values: 0 65535
          value: 65535
     61 pixel blend mode:
          flags: enum
          enums: None=2 Pre-multiplied=0 Coverage=1
          value: 0
     62 zpos:
          flags: range
          values: 0 7
          value: 0
     63 NAME:
          flags: immutable bitmask
          values: Smart0-win0=0x1
          value: 1
     70 colorkey:
          flags: range
          values: 0 2164260863
          value: 0
73   0    0    0,0      0,0  0         0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16
 props:
     8 type:
          flags: immutable enum
          enums: Overlay=0 Primary=1 Cursor=2
          value: 1
     76 alpha:
          flags: range
          values: 0 65535
          value: 65535
     77 pixel blend mode:
          flags: enum
          enums: None=2 Pre-multiplied=0 Coverage=1
          value: 0
     78 zpos:
          flags: range
          values: 0 7
          value: 1
     79 NAME:
          flags: immutable bitmask
          values: Smart1-win0=0x2
         value: 2
     86 colorkey:
         flags: range
         values: 0 2164260863
         value: 0
89   0   0    0,0       0,0  0        0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY
 props:
     8 type:
         flags: immutable enum
         enums: Overlay=0 Primary=1 Cursor=2
         value: 1
     92 alpha:
         flags: range
         values: 0 65535
         value: 65535
     93 pixel blend mode:
         flags: enum
         enums: None=2 Pre-multiplied=0 Coverage=1
         value: 0
     94 zpos:
         flags: range
         values: 0 7
         value: 2
     95 NAME:
         flags: immutable bitmask
         values: Esmart1-win0=0x4
         value: 4
105  0   0    0,0       0,0  0        0x00000007
 formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16 NV12 NV16 NV24 NA12 NA16 NA24 YVYU VYUY
 props:
     8 type:
         flags: immutable enum
         enums: Overlay=0 Primary=1 Cursor=2
         value: 0
     108 alpha:
         flags: range
         values: 0 65535
         value: 65535
     109 pixel blend mode:
         flags: enum
         enums: None=2 Pre-multiplied=0 Coverage=1
         value: 0
     110 zpos:
         flags: range
         values: 0 7
         value: 3
     111 NAME:
         flags: immutable bitmask
         values: Esmart0-win0=0x8
         value: 8
```

Первая часть вывода Encoders соответствует второй части Connectors. Из выгрузки видно:

Connector eDP-1 имеет id 154, соответствующий Encoder — id 153. Состояние `disconnected` означает, что низкоуровневый драйвер не обнаружил подключённого eDP. У Encoder 153 значение `possible crtcs` равно 2, то есть BIT(1). Это битовая маска, показывающая, что eDP может подключаться только к VP1.

Connector HDMI-A-1 имеет id 156, соответствующий Encoder — id 155. Состояние `connected` означает, что драйвер обнаружил устройство на этом HDMI. `modes` — разрешения, поддерживаемые устройством и сообщённые драйвером.

CRTC соответствует Video Port в VOP 2.0 либо VOP в VOP 1.0.

Planes — слои; информация включает допустимые VP (`possible crtcs`) и форматы (`formats`).

2\. Вывод цветовых полос на соответствующий интерфейс для простой проверки драйвера DRM.

```sh
modetest -M rockchip -s 156@71:1920x1080
```

Эта команда выводит на HDMI-A-1 цветовые полосы SMPTE, подобные рисунку ниже. 156 — идентификатор HDMI-A-1, 71 — идентификатор VP0.

![Исходный рисунок: 9.9 Использование modetest; PDF p. 79](/docs/rockchip-drm-display-driver/assets/en-p79-X475.jpg)

3\. Временное ручное изменение некоторых свойств drm

Другие способы использования описаны в следующей справке:

![Исходный рисунок: 9.9 Использование modetest; PDF p. 80](/docs/rockchip-drm-display-driver/assets/en-p80-X478.png)

modetest указывает ресурсы drm — plane, crtc, connector — по идентификаторам. Их можно узнать через modetest или следующую команду:

```text
cat /sys/kernel/debug/dri/0/state
```

### 9.10 Использование xrandr

xrandr — средство настройки дисплеев в графической системе Xserver. Оно позволяет выгружать сведения об отображении и конфигурировать выходы.

```text
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 2048, maximum 8192 x 8192
eDP-1 connected primary 1536x2048+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
  1536x2048 59.99*+
HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 708mm x 398mm
  1920x1080 60.00*+ 50.00 59.94 30.00 24.00 29.97 23.98
  1920x1080i 60.00 50.00 59.94
  1280x1024 60.02
  1440x900 59.90
  1360x768 60.02
  1280x720 60.00 50.00 59.94
  1024x768 60.00
  800x600 60.32
  720x576 50.00
  720x576i 50.00
  720x480 60.00 59.94
  720x480i 60.00 59.94
  640x480 60.00 59.94
DP-1 disconnected (normal left inverted right x axis y axis)
```

Это универсальная утилита среды Xserver. Подробное описание см. по ссылке [Xrandr](https://wiki.archlinux.org/title/Xrandr).

### 9.11 Приостановка и возобновление процесса отображения

Для удобства отладки иногда нужно зафиксировать приложение в определённой сцене. Следующие команды приостанавливают и возобновляют процесс отображения.

Процесс Android Surfaceflinger:

1\. Приостановить процесс

```text
kill -STOP `pgrep surfaceflinger`
```

2\. Возобновить процесс

```text
kill -CONT `pgrep surfaceflinger`
```

Процесс Linux weston:

1\. Приостановить процесс

```text
Kill -STOP `pgrep weston`
```

2\. Возобновить процесс

```text
kill -CONT `pgrep weston`
```

Процесс Linux Xserver:

1\. Приостановить процесс

```text
Kill -STOP `pgrep Xorg`
```

2\. Возобновить процесс

```text
kill -CONT `pgrep Xorg`
```

Если при разработке нужно временно изменить регистры VOP командой io для оценки эффекта, сначала остановите соответствующий основной процесс отображения в пользовательском пространстве. Иначе его обновления могут в любой момент перезаписать внесённые изменения регистров.

### 9.12 Получение EDID

Пример для HDMI:

```text
cat /sys/class/drm/card0-HDMI-A-1/edid > /data/edid.bin
```

### 9.13 Просмотр состояния HDMI

```text
cat /sys/kernel/debug/dw-hdmi/status
```

![Исходный рисунок: 9.13 Просмотр состояния HDMI; PDF p. 81](/docs/rockchip-drm-display-driver/assets/en-p81-X484.png)

## 10. Частые вопросы

### 10.1 VOP POST_BUF_EMPTY

Возможен следующий журнал:

![Исходный рисунок: 10.1 VOP POST_BUF_EMPTY; PDF p. 82](/docs/rockchip-drm-display-driver/assets/en-p82-X490.png)

Возможные причины:

1\. Недостаточная пропускная способность

Если системной пропускной способности недостаточно, VOP не успевает получать данные и возникает post buf empty. Попробуйте:

(1) Зафиксировать DDR на максимальной частоте. (2) Увеличить интервал гашения экрана, увеличив время получения данных на строку.

2\. Ошибка iommu

Проверьте наличие iommu pagefault, как на следующем рисунке. Сначала попробуйте обновить код для проверки. Если ошибка сохраняется в актуальном коде, создайте задачу в системе Redmine и приложите журнал.

![Исходный рисунок: 10.1 VOP POST_BUF_EMPTY; PDF p. 82](/docs/rockchip-drm-display-driver/assets/en-p82-X492.png)

3\. Слишком низкое напряжение Logic

Слишком низкое напряжение Logic вызывает нарушения VOP. Исходный документ предлагает для проверки увеличить его на 100mv.

4\. Требования к выравниванию AFBDC/IFBDC

На PX30/RK3326, RK3368, RK3399, RK356X и RK3588, если разрешение не выровнено по 16 пикселям, попробуйте отключить afbdc/ifbdc. Изменение описано в разделе 1.3.1 документа FAQ-DRM-HWC.

### 10.2 Настройка изображения

Модуль BCSH VOP регулирует яркость, контрастность, насыщенность и цветовой тон. Свойства connector можно менять через modetest. В Android имеется собственная реализация настройки свойств. Значение по умолчанию — 50; N изменяется с шагом 1.

До Android 9.0 используйте команды:

```text
setprop persist.sys.brightness.main val
setprop persist.sys.contrast.main val
setprop persist.sys.saturation.main val
setprop persist.sys.hue.main val
setprop sys.display.timeline N+1
```

После Android 9.0 используйте команды:

```text
setprop persist.vendor.brightness.main val
setprop persist.vendor.contrast.main val
setprop persist.vendor.saturation.main val
setprop persist.vendor.hue.main val
setprop vendor.display.timeline N+1
```

Начиная с Android 11, SDK содержит полный набор средств и документации для настройки изображения. См. документ в Android SDK:

RKDocs/common/display/Rockchip_Introduction_Display_Adjust_APK_CN.pdf

### 10.3 Экран не включается, изображение нарушено после сна или отсутствует 

Проверьте:

1. Есть ли подсветка.

2. Нормально ли работают питание и сброс экрана.

3. Соответствуют ли последовательности включения и выключения питания спецификации экрана.

### 10.4 Включение дисплея RK3308/RV1106/RV1103

Из-за облегчённой архитектуры RK3308/RV1106/RV1103 поддерживают небольшой объём памяти, поэтому функция отображения по умолчанию отключена. Для её включения требуются следующие настройки:

1\. Изменения U-Boot

Пример RK3308 для RGB/MCU в U-Boot, rk3308-display.config:

```text
make rk3308_defconfig rk3308-display.config &&./make.sh
```

Пример RV1106/RV1103 для RGB/MCU в U-Boot, rv1106-display.config:

```text
make rv1106_defconfig rv1106-display.config &&./make.sh
```

2\. Изменения ядра

VOP RK3308 не поддерживает IOMMU, поэтому память выделяется из зарезервированного буфера CMA. По умолчанию CMA_SIZE — 16M. При ошибках выделения измените CMA_SIZE следующим образом:

```text
@@ -784,7 +786,12 @@ CONFIG_ARCH_SUPPORTS_MEMORY_FAILURE=y
# CONFIG_MEMORY_FAILURE is not set
# CONFIG_TRANSPARENT_HUGEPAGE is not set
# CONFIG_CLEANCACHE is not set
-# CONFIG_CMA is not set
+CONFIG_CMA=y
+# CONFIG_CMA_INACTIVE is not set
+# CONFIG_CMA_DEBUG is not set
+# CONFIG_CMA_DEBUGFS is not set
+# CONFIG_CMA_SYSFS is not set
+CONFIG_CMA_AREAS=7
# CONFIG_ZPOOL is not set
# CONFIG_ZBUD is not set
# CONFIG_ZSMALLOC is not set
@@ -4917,6 +4925,18 @@ CONFIG_DMA_NONCOHERENT_MMAP=y
CONFIG_DMA_COHERENT_POOL=y
CONFIG_DMA_REMAP=y
CONFIG_DMA_DIRECT_REMAP=y
+CONFIG_DMA_CMA=y
+# CONFIG_DMA_PERNUMA_CMA is not set
+
+#
+# Default contiguous memory area size:
+#
+CONFIG_CMA_SIZE_MBYTES=32
+CONFIG_CMA_SIZE_SEL_MBYTES=y
+# CONFIG_CMA_SIZE_SEL_PERCENTAGE is not set
+# CONFIG_CMA_SIZE_SEL_MIN is not set
+# CONFIG_CMA_SIZE_SEL_MAX is not set
+CONFIG_CMA_ALIGNMENT=8
# CONFIG_DMA_API_DEBUG is not set
CONFIG_SGL_ALLOC=y
CONFIG_CPU_RMAP=y
```

Пример ядра RK3308 для RGB → MIPI через мост RK618, rk3308bs_mipi_display.config:

```text
make ARCH=arm64 rk3308_linux_defconfig rk3308bs_mipi_display.config
```

Пример ядра RV1106/RV1103 для RGB/MCU, rv1106-evb.config:

```text
make ARCH=arm rv1106_defconfig rv1106-evb.config
```

### 10.5 Отключение iommu

После отключения vop iommu память DRM выделяется из CMA. По умолчанию размер CMA — 16M; его следует настроить под сценарий, иначе выделение может завершаться ошибкой.

![Исходный рисунок: 10.5 Отключение iommu; PDF p. 84](/docs/rockchip-drm-display-driver/assets/en-p84-X502.png)

### 10.6 Документы по применению интерфейсов

| Модуль | Документ |
| --- | --- |
| RGB/MCU | Rockchip_Developer_Guide_RGB_MCU_CN.pdf |
| BT656/BT1120 | Rockchip_Developer_Guide_BT656_TX_AND_BT1120_TX_CN.pdf |
| LVDS | Rockchip_Developer_Guide_LVDS_CN.pdf |
| MIPI DSI | Rockchip_Developer_Guide_MIPI_DSI2_CN.pdf |
| eDP | Rockchip_Developer_Guide_eDP_CN.pdf |
| DP | Rockchip_Developer_Guide_DisplayPort_CN.pdf |
| HDMI | Rockchip_Developer_Guide_HDMI_CN.pdf |

### 10.7 Расчёт частоты кадров RGB/MCU

Дано:

```text
htotal = hactive + hback-porch + hfront-porch + hsync-len
vtotal = vactive + vback-porch + vfront-porch + vsync-len
```

N — число циклов передачи одного пикселя:

| bus_format | Для передачи одного пикселя требуется N циклов |
| --- | --- |
| MEDIA_BUS_FMT_RGB888_1X24<br>MEDIA_BUS_FMT_RGB666_1X18<br>MEDIA_BUS_FMT_RGB565_1X16 | 1 |
| MEDIA_BUS_FMT_RGB888_3X8 | 3 |
| MEDIA_BUS_FMT_RGB888_DUMMY_4X8 | 4 |

На основании этих данных частота кадров вычисляется так:

| Тип интерфейса | Расчёт частоты кадров |
| --- | --- |
| RGB | fps = dclk / (htotal x vtotal x N) |
| MCU | fps = dclk / (htotal x vtotal x (mcu-pix-total + 1) x N) |

### 10.8 Драйвер сторонней микросхемы-преобразователя

Для сторонних преобразователей, требующих программного драйвера, connector регистрируется через bridge-интерфейс DRM. Например, для RGB2HDMI SII902X `rockchip_rgb.c` выступает encoder, а `sii902x.c` — connector. См. реализацию SII902X:

```text
drivers/gpu/drm/bridge/sii902x.c
```

### 10.9 Число срезов DSC RK3588 и максимальная ширина slice

RK3588 имеет 2 DSC. HDMI0 и DSI0 используют DSC0 (DSC_8K), поддерживающий 1, 2, 4 или 8 срезов с шириной xres / 1, xres / 2, xres / 4 или xres / 8. Максимальная ширина DSC_8K — 7680, поэтому максимальная slice_width также 7680. HDMI1 и DSI1 используют DSC1 (DSC_4K), поддерживающий 1 или 2 среза шириной xres / 1 или xres / 2. Максимальная ширина DSC_4K — 4096, поэтому максимальная slice_width также 4096.

### 10.10 Требования к aclk для разрешений выше 4kP60

На платформах вроде RK3588, поддерживающих разрешения выше 4KP60 (например 4KP120, 8KP30, 8KP60), стандартной aclk 500M недостаточно. Необходимо задать в DTS 800M, иначе из-за недостаточной производительности VOP на изображении могут появляться горизонтальные полосы. Изменение:

```text
&vop {
  assigned-clocks = <&cru ACLK_VOP>;
  assigned-clock-rates = <800000000>;
};
```

### 10.11 Зеркальное отображение по умолчанию

Из-за особенностей корпуса и ориентации экрана в проекте может требоваться программное зеркальное отображение по умолчанию.

Зеркальное отображение по Y по умолчанию не поддерживается. По X оно поддерживается только VOP V2.0 и новее; см. раздел основных возможностей VOP. Пример конфигурации:

```text
&vp1 {
  xmirror-enable;
};
```

### 10.12 Экран малого разрешения RV1106/RV1103 не включается или отображает изображение с нарушениями

В RV1106 и RV1103 источником dclk_vop может быть GPLL или CPLL с частотами по умолчанию 1188000 KHz и 1000000 KHz. CRU поддерживает максимальный коэффициент деления dclk_vop 32:

![Исходный рисунок: 10.12 Экран малого разрешения RV1106/RV1103 не включается или; PDF p. 86](/docs/rockchip-drm-display-driver/assets/en-p86-X513.png)

Поэтому минимальные частоты dclk_vop при этих PLL — 37125 KHz и 31250 KHz. Если пиксельная частота экрана меньше, экран может не включиться либо работать с нарушениями. Для меньшего разрешения, например 720x480p60/720x576p60 с 27000 KHz, уменьшить минимальную частоту dclk_vop можно только изменением частоты GPLL или CPLL:

```text
&vop {
  assigned-clocks = <&cru PLL_GPLL>;
  assigned-clock-rates = <594000000>;
};
```

Обратите внимание:

RGB/MCU-экраны обычно допускают диапазон частот, заданный в datasheet как MIN/TYP/MAX.

Если минимальная dclk_vop при стандартном GPLL/CPLL соответствует допустимой MAX, по возможности не изменяйте GPLL/CPLL. Эти PLL обычно тактируют несколько модулей; для конкретного сценария необходимо проверить влияние изменения их частоты на другие модули помимо VOP.

## 11. Более эффективная локализация проблем

При обнаружении ошибки системный анализ и обмен информацией ускоряют её локализацию и решение. Для проблем отображения рекомендуется проверить следующее:

1. Есть ли явные сообщения об ошибках в журнале ядра или приложения.

2. Найдите сообщение об ошибке в исходном коде драйвера ядра и проверьте условие, при котором оно выводится.

3. Возникает ли проблема случайно или воспроизводится всегда.

4. Для HDMI/DP с несколькими разрешениями определите, возникает ли нарушение только при одном разрешении или при всех, только на одном мониторе или на всех.

5. При проблемах совместимости HDMI/DP сравните поведение стороннего устройства в тех же условиях, контролируя изменяемые факторы.

6. При проблемах воспроизведения видео определите, связаны ли они с конкретным видео или приложением либо проявляются с любыми видео и приложениями.

7. Если направление поиска неясно, выясните, существовала ли проблема всегда или появилась после обновления кода/версии. Во втором случае методом двоичного поиска и контролируемого изменения факторов определите, какое обновление версии или модуля вызвало нарушение.

## 12. Справочные документы

1. Rockchip_drm_integration_helper-zh.pdf

2. Rockchip_DRM_Panel_Porting_Guide.pdf

3. Rockchip_Developer_Guide_HDMI_CN.pdf

4. RK3588_MIPI_DSI2_Developer_Guide_CN.pdf

5. Rockchip_BT656_TX_AND_BT1120_TX_Developer_Guide_CN.pdf

6. Rockchip RK3568 Datasheet.pdf

7. Rockchip rk fb development guide.pdf

8. Wikipedia: Direct_Rendering_Manager

9. Linux DRM Developer's Guide

{% endraw %}
