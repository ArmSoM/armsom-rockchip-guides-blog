---
title: "Rockchip A/B OTA: обновление Android 12 до Android 14"
description: "Rockchip A/B OTA: обновление Android 12 до Android 14 — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA: обновление Android 12 до Android 14"
translation_key: "240-rockchip-ab-ota-android12-to14"
slug: "240-rockchip-ab-ota-android12-to14"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA: обновление Android 12 до Android 14

Справочный материал для ArmSoM по китайскому исходнику RK-KF-YF-795 V1.0.0. Таблица продуктов содержит RK3326/RK3399/RK356x/RK3588 и ядра 6.1/5.10/4.9; эти исходные значения не подтверждают поддержку всех сочетаний или плат ArmSoM. Проверьте фактический Android BSP, lunch-вариант, режим A/B, разделы и шифрование. Аппаратная проверка не проводилась.

Прошивка и настройки безопасности допустимы на разрешённых устройствах разработки после резервного копирования. userdebug/SELinux из исходника — отладочные примеры, не рекомендации для выпуска. Команды не выполнялись, патчи не скачивались.

| Чипы в исходнике | Версии ядра в исходнике |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.9 |

## 1. Обзор

Документ описывает OTA-переход с Rockchip Android 12.0 A/B на Android 14.0 A/B.

## 2. Патчи Android 14.0

Примените следующие патчи к SDK Android 14.0. В исходнике все патчи доступны по адресу https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ ; код доступа: `vgp7`; пароль архива: `rk12to14JDY39`.

### 2.1 RK3588

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Для RK3588 исходник указывает, что Android 14 по умолчанию включает FRP, а Android 12 — нет. Отключайте FRP для соответствия Android 12 только если именно так настроен исходный проект; руководствуйтесь его фактической конфигурацией.

```text
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

Если требуется отключить FRP, также примените `jdy_packages_apps_Settings.diff` в `packages/apps/Settings`.

(4) Включите соответствующие настройки A/B в `device/rockchip/rk3588`; они должны совпадать с исходным проектом Android 12. Пример источника:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 RK356X

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Для rk3568 примените `0001-Add-rk3568_s.patch` в `device/rockchip/rk356x`.

Для rk3566 примените `0002-Add-rk3566_s.patch` в `device/rockchip/rk356x`.

Для варианта rk3566 Go примените `0003-Add-rk3566_sgo.patch` в `device/rockchip/rk356x`. Добавьте соответствующие записи в `device/rockchip/rk356x/AndroidProducts.mk`; ниже приведён пример rk3568.

```text
diff --git a/AndroidProducts.mk b/AndroidProducts.mk
index 70af8e4..eaa4c50 100644
--- a/AndroidProducts.mk
+++ b/AndroidProducts.mk
@@ -15,11 +15,14 @@
 #

 PRODUCT_MAKEFILES := \
+        $(LOCAL_DIR)/rk3568_s/rk3568_s.mk \
         $(LOCAL_DIR)/rk3566_tgo/rk3566_tgo.mk \
         $(LOCAL_DIR)/rk3566_t/rk3566_t.mk \
         $(LOCAL_DIR)/rk3568_t/rk3568_t.mk

 COMMON_LUNCH_CHOICES := \
+    rk3568_s-userdebug \
+    rk3568_s-user \
     rk3566_tgo-userdebug \
     rk3566_tgo-user \
     rk3566_t-userdebug \
```

(4) В этом абзаце исходник пишет, что SDK Android 13 включает FRP по умолчанию, а Android 12 — нет; руководствуйтесь фактическим проектом Android 12. При необходимости задайте `BUILD_WITH_GOOGLE_FRP := false` в `device/rockchip/rk356x/XXX/BoardConfig.mk`. «Android 13» противоречит целевой Android 14 документа; расхождение сохранено для проверки.

```text
+BUILD_WITH_GOOGLE_FRP := false
```

Если требуется отключить FRP, также примените `jdy_packages_apps_Settings.diff` в `packages/apps/Settings`.

(5) Включите соответствующие настройки A/B в `device/rockchip/rk356x/XXX`; они должны совпадать с исходным проектом Android 12. Пример источника:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.3 Другие чипы, например RK3399

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Скопируйте lunch-вариант проекта Android 12 из SDK Android 12 в SDK Android 14, например `rk3399_Android12`, `rk3568_s` или `rk3588_s`.
4. По исходнику Android 14 включает FRP по умолчанию, а Android 12 — нет. При необходимости отключите FRP для соответствия фактической конфигурации Android 12. Исходник приводит следующий патч:

```text
diff --git a/rk3588_s/BoardConfig.mk b/rk3588_s/BoardConfig.mk
index a1c5c20..64afecc 100644
--- a/rk3588_s/BoardConfig.mk
+++ b/rk3588_s/BoardConfig.mk
@@ -37,3 +37,5 @@ PRODUCT_KERNEL_DTS := rk3588-evb1-lp4-v10
 BOARD_GSENSOR_MXC6655XA_SUPPORT := true
 BOARD_CAMERA_SUPPORT_EXT := true
 BOARD_HS_ETHERNET := true
+
+BUILD_WITH_GOOGLE_FRP := false
```

Если требуется отключить FRP, также примените `jdy_packages_apps_Settings.diff` в `packages/apps/Settings`.

(4) Включите соответствующие настройки A/B в `device/rockchip/rk3588`; они должны совпадать с исходным проектом Android 12. Пример источника:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

## 3. Обновление Android 12.0 до Android 14.0

Создайте OTA-пакет на платформе Rockchip Android 14.0 следующим образом, перенесите его на устройство Rockchip Android 12.0 и выполните обычное OTA-обновление. Сначала прочитайте раздел 4 «Меры предосторожности» (исходник ошибочно ссылается на раздел 3).

1. Выберите lunch-вариант для перехода с 12.0 на 14.0, например `rk3568_s` или `rk3588_s`. Каталог проекта обычно можно скопировать непосредственно из SDK Android 12.

2. Соберите систему обычным способом: соберите uboot и kernel, выполните lunch, затем следующую команду из исходника.

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. Возьмите пакет обновления из шага 2 и назовите его `update.zip`.

4. Поместите соответствующий `update.zip` на устройство Android 12 и выполните обновление.

Примечание: если текущая Android 12.0 ранее получена обновлением с Android 11.0 по `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android12_CN`, дальнейший переход на Android 14.0 выполняется по `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN`: выберите lunch-вариант Android 11.0 в SDK Android 14.0, например `rk3399_Android11`, соберите систему и перенесите пакет на это устройство Android 12.0. Здесь исходник пишет `upddate.zip`, в отличие от `update.zip` в остальных местах; проверьте фактическое имя файла.

## 4. Меры предосторожности

1. Для проверки и отладки используйте сборки userdebug на каждой платформе, например Android 12.0 и 14.0, и задайте `BOARD_SELINUX_ENFORCING := false`. Эта тестовая настройка из исходника не является рекомендацией по безопасности серийных устройств.

2. Перед OTA убедитесь, что таблицы разделов `parameter` идентичны. При переходе с 12.0 на 14.0 собранная прошивка 14.0 должна использовать тот же `parameter`, что и 12.0.

3. Перед OTA файловая система data и способ шифрования в fstab, например `fstab.rk30board`, должны совпадать. При переходе с 12.0 на 14.0 собранная прошивка 14.0 должна сохранять файловую систему data и способ шифрования версии 12.0.

4. Перед OTA проверьте работоспособность самой прошивки. При переходе с 12.0 на 14.0 запишите собранную прошивку 14.0 инструментом, например RKDevTool, и проверьте нормальную загрузку и работу всех функций.

5. data и keymaster

a. Сначала выполните раздел 3. Если после обновления появляется главный экран Android, пункт b не нужен; иначе выполните его.

b. Получите соответствующие патчи из каталога `userdata_patches` по адресу https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA (код доступа `jset`) и примените их к соответствующим репозиториям SDK Android 14. Инструкции приведены в `userdata_patches/README.txt`.

**Эти патчи предназначены только для проектов обновления существующих устройств Android 12 до Android 14; не используйте их при разработке новых устройств Android 14.**

## Редакторские замечания и источники

Соответствующего английского PDF нет; английский, русский и немецкий полностью переведены с китайского. Технических изображений нет; данные таблицы продуктов сохранены выше. Нетехническая обложка, аудитория и история редакций удалены. Исходное `–j32` содержит U+2013 и не исправлено молча; проверьте перед запуском. Расхождение `upddate.zip`/`update.zip` обозначено. Ссылки и коды из источника не проверялись.

Раздел 2.2 пишет Android 13 для FRP вопреки теме Android 14. Раздел 2.3 использует пути rk3588 и два пункта (4). Ссылка «3. Меры предосторожности» означает главу 4. Расхождения сохранены; настройки rk3588 не считаются готовыми для rk3399. Ядро 4.9 не заменено на 4.19. A/B-исходник не содержит патча автоматической очистки data из non-AB-руководства; он не добавлен.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
