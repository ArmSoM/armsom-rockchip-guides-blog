---
title: "Руководство по OTA-обновлению Rockchip Android 12 до Android 14"
description: "Руководство по OTA-обновлению Rockchip Android 12 до Android 14 — RK3588/RK356x/RK3399, BSP, parameter, fstab, userdata"
excerpt: "Руководство по OTA-обновлению Rockchip Android 12 до Android 14"
translation_key: "250-rockchip-ota-android12-to14"
slug: "250-rockchip-ota-android12-to14"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "RK3588", "RK356x"]
---

{% raw %}

# Руководство по OTA-обновлению Rockchip Android 12 до Android 14

Справочный материал для платформ ArmSoM по китайскому исходнику RK-KF-YF-796 V1.0.0 о non-AB OTA-переходе с Android 12 на 14. В таблице продуктов указаны RK3326/RK3399/RK356x/RK3588 и ядра 6.1/5.10/4.19. Это не подтверждает поддержку всех сочетаний чипов и ядер или прямого обновления любой платы ArmSoM. Проверьте конкретный Android BSP, lunch-вариант, разделы, шифрование и адаптацию устройства. Аппаратная проверка не проводилась.

Предупреждение: исходник содержит отключение FRP, отладочные настройки SELinux и патч автоматической очистки data. Оценивайте их только в контролируемой разработке на разрешённых устройствах; отдельно проверяйте безопасность серийной системы и заранее сохраняйте данные. Команды не выполнялись, патчи не скачивались.

| Чипы в исходнике | Версии ядра в исходнике |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588 | 6.1, 5.10, 4.19 |

## 1. Обзор

Документ описывает OTA-переход с Rockchip Android 12.0 на Android 14.0.

## 2. Патчи Android 14.0

Примените следующие патчи к SDK Android 14.0. В исходнике все патчи доступны по адресу https://pan.baidu.com/s/1IIvpiRiy6dTJ6R6Uf2ZSrQ ; код доступа: `vgp7`; пароль архива: `rk12to14JDY39`.

### 2.1 RK3588

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Для RK3588 исходник указывает, что Android 14 по умолчанию включает FRP, а Android 12 — нет. Отключайте FRP для соответствия Android 12 только если именно так настроен исходный проект; руководствуйтесь его фактической конфигурацией.

```diff
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

### 2.2 RK356X

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Для rk3568 примените `0001-Add-rk3568_s.patch` в `device/rockchip/rk356x`.

Для rk3566 примените `0002-Add-rk3566_s.patch` в `device/rockchip/rk356x`.

Для варианта rk3566 Go примените `0003-Add-rk3566_sgo.patch` в `device/rockchip/rk356x`. Добавьте соответствующие записи в `device/rockchip/rk356x/AndroidProducts.mk`; ниже приведён пример rk3568.

```diff
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

4. Для RK356X исходник также указывает, что Android 14 по умолчанию включает FRP, а Android 12 — нет. Согласуйте настройки с фактическим проектом Android 12. Если FRP требуется отключить, задайте `BUILD_WITH_GOOGLE_FRP := false` в соответствующем `BoardConfig.mk` каталога `device/rockchip/rk356x/XXX`, например:

```diff
+BUILD_WITH_GOOGLE_FRP := false
```

Если требуется отключить FRP, также примените `jdy_packages_apps_Settings.diff` в `packages/apps/Settings`.

### 2.3 Другие чипы, например RK3399

1. В `device/rockchip/common` примените `jdy_device_rockchip_common_device.diff` и `jdy_device_rockchip_common_manifests.diff`.
2. В `build/make` примените `jdy_build_make.diff`.
3. Скопируйте lunch-вариант проекта Android 12 из SDK Android 12 в SDK Android 14, например `rk3399_Android12`, `rk3568_s` или `rk3588_s`.
4. По исходнику Android 14 включает FRP по умолчанию, а Android 12 — нет. При необходимости отключите FRP для соответствия фактической конфигурации Android 12. Исходник приводит следующий патч:

```diff
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

## 3. Обновление Android 12.0 до Android 14.0

Создайте OTA-пакет на платформе Rockchip Android 14.0 следующим образом, перенесите его на устройство Rockchip Android 12.0 и выполните обычное OTA-обновление. Сначала прочитайте раздел 4 «Меры предосторожности» (исходник ошибочно ссылается на раздел 3).

1. Выберите lunch-вариант для перехода с 12.0 на 14.0, например `rk3568_s` или `rk3588_s`. Каталог проекта обычно можно скопировать непосредственно из SDK Android 12.

2. Соберите систему обычным способом: соберите uboot и kernel, выполните lunch, затем следующую команду из исходника.

```text
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

3. Возьмите пакет обновления из шага 2 и назовите его `update.zip`.

4. Поместите соответствующий `update.zip` на устройство Android 12 и выполните обновление.

Примечание: если текущая Android 12.0 ранее получена обновлением с Android 11.0 по `Rockchip_Developer_Guide_OTA_from_Android11_to_Android12_CN`, дальнейший переход на Android 14.0 выполняется по `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: выберите lunch-вариант Android 11.0 в SDK Android 14.0, например `rk3399_Android11`, соберите систему и перенесите пакет на это устройство Android 12.0. Здесь исходник пишет `upddate.zip`, в отличие от `update.zip` в остальных местах; проверьте фактическое имя файла.

## 4. Меры предосторожности

1. Для проверки и отладки используйте сборки userdebug на каждой платформе, например Android 12.0 и 14.0, и задайте `BOARD_SELINUX_ENFORCING := false`. Эта тестовая настройка из исходника не является рекомендацией по безопасности серийных устройств.

2. Перед OTA убедитесь, что таблицы разделов `parameter` идентичны. При переходе с 12.0 на 14.0 собранная прошивка 14.0 должна использовать тот же `parameter`, что и 12.0.

3. Перед OTA файловая система data и способ шифрования в fstab, например `fstab.rk30board`, должны совпадать. При переходе с 12.0 на 14.0 собранная прошивка 14.0 должна сохранять файловую систему data и способ шифрования версии 12.0.

4. Перед OTA проверьте работоспособность самой прошивки. При переходе с 12.0 на 14.0 запишите собранную прошивку 14.0 инструментом, например RKDevTool, и проверьте нормальную загрузку и работу всех функций.

5. data и keymaster

(1) После обновления основной версии исходник настоятельно рекомендует очистить data, чтобы избежать сложных проблем совместимости, препятствующих запуску Android. Следующий пример патча в репозитории `build/make` SDK Android 14 автоматически очищает data после обновления. **Это уничтожает пользовательские данные; перед применением создайте резервную копию и получите разрешение.**

```diff
diff --git a/tools/releasetools/ota_from_target_files.py b/tools/releasetools/ota_from_target_files.py
index d1b935845f..a3f2e28af0 100755
--- a/tools/releasetools/ota_from_target_files.py
+++ b/tools/releasetools/ota_from_target_files.py
@@ -279,7 +279,7 @@ logger = logging.getLogger(__name__)
 OPTIONS = ota_utils.OPTIONS
 OPTIONS.verify = False
 OPTIONS.patch_threshold = 0.95
-OPTIONS.wipe_user_data = False
+OPTIONS.wipe_user_data = True
 OPTIONS.extra_script = None
 OPTIONS.worker_threads = multiprocessing.cpu_count() // 2
 if OPTIONS.worker_threads == 0:
@@ -1498,14 +1498,15 @@ def main(argv):
   else:
     OPTIONS.info_dict = ParseInfoDict(args[0])

-  if OPTIONS.wipe_user_data:
+  '''if OPTIONS.wipe_user_data:
     if not OPTIONS.vabc_downgrade:
       logger.info("Detected downgrade/datawipe OTA."
                   "When wiping userdata, VABC OTA makes the user "
                   "wait in recovery mode for merge to finish. Disable VABC by "
                   "default. If you really want to do VABC downgrade, pass "
                   "--vabc_downgrade")
-      OPTIONS.disable_vabc = True
+      OPTIONS.disable_vabc = True'''
+  if OPTIONS.downgrade:
     # We should only allow downgrading incrementals (as opposed to full).
     # Otherwise the device may go back from arbitrary build with this full
     # OTA package.
```

(2) Если после обновления действительно необходимо сохранить data:

a. Сначала выполните раздел 3. Если после обновления появляется главный экран Android, пункт b не нужен; иначе выполните его.

b. Получите соответствующие патчи из каталога `userdata_patches` по адресу https://pan.baidu.com/s/1kugy2rNZWu9w-aAG6qlRtA (код доступа `jset`) и примените их к соответствующим репозиториям SDK Android 14. Инструкции приведены в `userdata_patches/README.txt`.

**Эти патчи предназначены только для проектов обновления существующих устройств Android 12 до Android 14; не используйте их при разработке новых устройств Android 14.**

## Редакторские замечания и источники

- Соответствующего английского PDF нет; английский, русский и немецкий тексты переведены с китайского технического оригинала. Технических иллюстраций нет. Сведения таблицы продуктов сохранены выше.
- Сохранены все четыре главы со страниц 4–7; страница 8 пуста. Нетехнические сведения обложки, аудитория и журнал изменений удалены. Восстановлена последняя строка страницы 7, запрещающая применять userdata-патчи к новым устройствам Android 14.
- Команда сборки в оригинале использует `–j32` (U+2013), не ASCII-дефис. Запись сохранена; проверьте её перед запуском, не копируйте вслепую. Перенос первой строки diff устранён; остальные параметры кода неизменны.
- Ссылка главы 3 на «3. Меры предосторожности» ошибочна: это глава 4. `upddate.zip` расходится с `update.zip` и не считается проверенным именем файла.
- Раздел 2.3 повторяет фразу пути и использует пример RK3588; это не подтверждает применимость без изменений к RK3399. Ссылки, коды доступа и пароль архива взяты из PDF, не скачивались и не проверялись; это не локальные учётные данные.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
