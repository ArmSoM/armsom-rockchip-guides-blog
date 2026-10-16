---
title: "Rockchip DRM Direct Show: интерфейсы вывода из ядра и Kernel Logo"
description: "Полное руководство по API Rockchip DRM Direct Show, полям буфера, автоматическим тестам и настройке логотипа ядра."
translation_key: "043-rockchip-drm-direct-show"
slug: "043-rockchip-drm-direct-show"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DRM", "Direct Show", "Kernel Logo", "RK356X", "RK3588"]
keywords: "ArmSoM Rockchip DRM Direct Show kernel logo RK356X RK3588"
excerpt: "Полное руководство по API Rockchip DRM Direct Show, полям буфера, автоматическим тестам и настройке логотипа ядра."
---

{% raw %}
# Rockchip DRM Direct Show: интерфейсы вывода из ядра и Kernel Logo

## Применимость к ArmSoM

Это справочный материал производителя по платформе, а не отчёт об испытаниях оборудования ArmSoM. Исходный документ относится к RK356X/RK3588 и соответствующему Rockchip BSP с Linux kernel 5.10 и новее. Необходимо проверить SoC целевой платы, ветку SDK, наличие API DRM Direct Show, интерфейс вывода и имена слоёв. Само по себе выполнение требования к версии ядра не означает поддержку в любом основном ядре Linux или на всех платах ArmSoM. Аппаратная проверка не проводилась.

Источник: китайское «Руководство разработчика Rockchip DRM Direct Show», V1.0.0, 8 страниц. Английский PDF не предоставлен. Технический текст полностью переведён с китайского на английский и русский; во всех трёх версиях используется исходный рисунок из китайского PDF. Нетехнические сведения обложки, раздел о целевой аудитории и история редакций удалены. [Редакторские примечания](/docs/rockchip-drm-direct-show/EDITORIAL-NOTES.md). Адаптацию платы следует сверять с [официальной документацией ArmSoM](https://docs.armsom.org/).

## Введение и версии платформы

Руководство описывает интерфейсы передачи изображения на вывод из пространства ядра, предоставляемые инфраструктурой драйвера дисплея Rockchip DRM. Они предназначены прежде всего для быстрого вывода изображений, отображения логотипа ядра и автоматического тестирования.

| Микросхема | Версия ядра |
| --- | --- |
| RK356X/RK3588 | Linux kernel 5.10 и новее |

## 1. API Direct Show и порядок использования

### 1.1 Описание API

#### 1.1.1 Получение устройства DRM

```c
struct drm_device *rockchip_drm_get_dev(void);
```

Получает устройство DRM. Оно необходимо для последующих операций выделения и освобождения памяти, получения crtc и plane, а также передачи изображения на вывод.

#### 1.1.2 Выделение памяти

```c
int rockchip_drm_direct_show_alloc_buffer(struct drm_device *drm,
                                         struct rockchip_drm_direct_show_buffer *buffer)
```

Входные поля buffer:

| Переменная | Описание |
| --- | --- |
| width | Ширина буфера в пикселях |
| height | Высота буфера в пикселях |
| pixel_format | Формат буфера; определения приведены в `include/uapi/drm/drm_fourcc.h` |
| flag | Тип буфера: значение по умолчанию 0 означает разрозненную, физически несмежную память; `ROCKCHIP_BO_CONTIG` — непрерывную память |

Выходные поля buffer:

| Переменная | Описание |
| --- | --- |
| bpp | Число бит на пиксель, определяемое по `buffer->pixel_format` |
| pitch[3] | Виртуальная ширина буфера, определяемая по `buffer->width`, `buffer->pixel_format` и правилам выравнивания |
| vir_addr[3] | Виртуальный адрес выделенного буфера в пространстве ядра |
| phy_addr[3] | Физический адрес выделенного буфера |
| rk_gem_obj | Абстракция, с помощью которой драйвер rockchip drm gem управляет этим буфером |
| fb | Абстракция данного буфера при выводе через drm plane |
| dmabuf_fd | dmabuf_fd, экспортированный из данного буфера; может использоваться другими модулями |

Поля `buffer->pitch[3]`, `buffer->vir_addr[3]` и `buffer->phy_addr[3]` используются следующим образом. На примере `buffer->pitch[3]`: для RGB по умолчанию используется `buffer->pitch[0]`; NV12 содержит 2 плоскости, поэтому используются `buffer->pitch[0]` и `buffer->pitch[1]`; для формата с 3 плоскостями используются `buffer->pitch[0]`, `buffer->pitch[1]` и `buffer->pitch[2]`.

#### 1.1.3 Получение crtc

```c
struct drm_crtc *rockchip_drm_direct_show_get_crtc(struct drm_device *drm)
```

Получает используемый в данный момент crtc.

#### 1.1.4 Получение plane

```c
struct drm_plane *rockchip_drm_direct_show_get_plane(struct drm_device *drm,
                                                  char *name)
```

Получает соответствующий имени name слой plane для вывода. Пример получения Esmart0-win0:

```c
plane = rockchip_drm_direct_show_get_plane(drm_dev, "Esmart0-win0")
```

#### 1.1.5 Передача на вывод

```c
int rockchip_drm_direct_show_commit(struct drm_device *drm,
                                    struct rockchip_drm_direct_show_commit_info *commit_info)
```

| Переменная commit_info | Описание |
| --- | --- |
| crtc | Задаёт crtc, которому передаётся вывод |
| plane | Задаёт передаваемый слой plane |
| buffer | Буфер, передаваемый на вывод |
| top_zpos | false: использовать конфигурацию по умолчанию; true: поместить на самый верх |
| src_x/src_y/src_w/src_h | Смещение и размер отображаемой области буфера; см. рисунок ниже |
| dst_x/dst_y/dst_w/dst_h | Положение и размер текущего слоя на экране; см. рисунок ниже |

![Исходный рисунок из китайского PDF: смещения и размеры области кадрового буфера и целевой области экрана](/docs/rockchip-drm-direct-show/assets/cn-p6-X55.png)

#### 1.1.6 Отключение слоя

```c
int rockchip_drm_direct_show_disable_plane(struct drm_device *drm,
                                         struct drm_plane *plane)
```

Если текущий слой больше не требуется отображать, этот интерфейс отключает его вывод.

#### 1.1.7 Освобождение памяти

```c
void rockchip_drm_direct_show_free_buffer(struct drm_device *drm,
                                        struct rockchip_drm_direct_show_buffer *buffer)
```

После отключения слоя, если буфер больше не нужен, этот интерфейс позволяет освободить и вернуть его память.

### 1.2 Порядок использования

По умолчанию Rockchip DRM Direct Show отключён. При необходимости включите его в `rockchip_defconfig`:

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
+CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
```

Основной порядок работы включает следующие 7 шагов:

1. Получить устройство drm.
2. Выделить буфер требуемого формата и размера.
3. Нарисовать необходимое изображение в выделенном буфере.
4. Получить crtc и plane.
5. Передать изображение на вывод.
6. Отключить слой, когда дальнейший вывод не требуется.
7. Освободить и вернуть память.

## 2. Программа автоматического тестирования

На основе Rockchip DRM Direct Show реализована программа автоматического тестирования Rockchip DRM. Её можно использовать как пример для разработчиков или как средство автоматического тестирования драйвера Rockchip DRM. По умолчанию функция отключена; включить её можно в `rockchip_defconfig`:

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
 CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
+CONFIG_ROCKCHIP_DRM_SELF_TEST=y
```

## 3. Отображение логотипа ядра

Некоторые изделия не используют официальный U-Boot Rockchip либо по иной причине не могут включить логотип U-Boot, но нуждаются в отображении логотипа ядра. Для реализации этой функции можно изменить программу автоматического тестирования Direct Show:

```diff
diff --git a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
index 74c395441e96..355632125914 100644
--- a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
+++ b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
@@ -20,7 +20,7 @@
 #include "kernel_logo_img.h"
 
-#define USE_BUFFER_NUM 2
+#define USE_BUFFER_NUM 1
 #define BUFFER_WIDTH 652
 #define BUFFER_HEIGHT 268
 #define BUFFER_FORMAT DRM_FORMAT_RGB565 /* DRM_FORMAT_RGB565/DRM_FORMAT_XRGB8888/DRM_FORMAT_NV12 */
@@ -159,7 +159,7 @@ static void rockchip_drm_self_test_commit(struct work_struct *work)
             goto free_buffer;
        }
 
-#if 1 /* for self test pattern */
+#if 0 /* for self test pattern */
        /* commit to display */
        do {
             u32 i = 0;
```

Файл `kernel_logo_img.h` содержит данные, полученные преобразованием BMP с помощью bmp2hex или аналогичного инструмента. Макросы `BUFFER_WIDTH`, `BUFFER_HEIGHT` и `BUFFER_FORMAT` необходимо изменить в соответствии с фактически используемым изображением.

Если подходящий инструмент bmp2hex найти не удаётся, выполните поиск bmp2hex на [странице документов Rockchip Redmine, указанной в оригинале](https://redmine.rock-chips.com/documents/97). Для доступа может потребоваться учётная запись.

> Редакторское примечание: блоки diff являются фрагментами исходного документа. Исходные размеры секций и контекст сохранены; применение их как полных патчей не гарантируется. В примерах API сохранено наличие или отсутствие точки с запятой из оригинала. Сверьте примеры с соответствующим BSP; подробности приведены в редакторских примечаниях.

{% endraw %}
