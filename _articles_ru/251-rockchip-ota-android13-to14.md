---
title: "Rockchip OTA без A/B: с Android 13 на Android 14"
description: "Полный патч data/keymaster, этапы сборки OTA без A/B, варианты истории обновлений и требования к разделам."
excerpt: "Полный патч data/keymaster, этапы сборки OTA без A/B, варианты истории обновлений и требования к разделам."
translation_key: "251-rockchip-ota-android13-to14"
slug: "251-rockchip-ota-android13-to14"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Справочный материал для платформ ArmSoM: полная процедура OTA Android 13→14 для систем без A/B из китайского документа RK-KF-YF-788 V1.0.0. Источник указывает RK3326/RK3399/RK356x/RK3588/RK3562 и ядра 5.10, 6.10; значение 6.10 сохранено, а не заменено на 6.1. Это не подтверждение поддержки плат ArmSoM. Требуется проверить плату, Android BSP, разделы и настройки безопасности; аппаратная проверка не проводилась. Доступен только китайский оригинал, технических иллюстраций нет; таблицы и патчи редактируемые.

> Риск: патч удаляет пользовательские данные, а отладочная настройка ослабляет SELinux. Это примеры источника, они не выполнялись. Нужны резервная копия и независимая проверка целевого SDK; не считать их готовой производственной конфигурацией.

| SoC в источнике | Ядра в источнике |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Обзор

Документ описывает OTA-обновление Rockchip Android 13.0 без A/B до Android 14.0 без A/B.

## 2. Патчи Android 14.0

### 2.1 Раздел data и keymaster

(1) После перехода на новую основную версию источник настоятельно рекомендует очистить `data`, чтобы избежать сложных проблем совместимости, мешающих запуску Android. Следующий справочный патч репозитория `build/make` Android 14 SDK автоматически очищает `data` после обновления.

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

(2) Если необходимо сохранить `data` после обновления:

a. Сначала выполните раздел 3. Если основной интерфейс Android запускается нормально, пункт b можно пропустить; иначе выполните его.

b. Загрузите соответствующие патчи из `userdata_patches` по приведённой ссылке и примените их к нужным репозиториям Android 14 SDK. Подробности находятся в `README.txt` этого каталога.

Ссылка источника: [патчи](https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w), код `0nsa`. Текущая доступность не проверялась; загрузка и выполнение не производились.

Важно: патчи предназначены только для обновления существующих устройств Android 13 до Android 14, а не для новых устройств Android 14.

## 3. Обновление Android 13.0 до Android 14.0

Создайте соответствующий OTA-пакет на платформе Rockchip Android 14.0, перенесите на устройство Rockchip Android 13.0 и выполните обычное OTA-обновление. Сначала прочитайте раздел 4.

1. Выберите цель `lunch` для Android 13→14, например `lunch rk3588_t-userdebug` или `lunch rk3568_t-userdebug`. Каталог соответствующего lunch-проекта обычно можно скопировать из Android 13 SDK.
2. Соберите систему обычным образом: скомпилируйте uboot и kernel, выполните lunch, затем команду источника:

```shell
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

Первый параметр `–j32` содержит в источнике не-ASCII тире; оно сохранено для проверки. Перед выполнением уточните настоящий параметр, не считайте команду гарантированно готовой к копированию.

3. Возьмите пакет из шага 2 и назовите `update.zip`.
4. Поместите соответствующий `update.zip` на устройство Android 13 и обновите его.

**История обновлений:**

(1) Если текущий Android 13.0 получен из Android 12.0 по `Rockchip_Developer_Guide_OTA_from_Android12_to_Android13_CN`, переход на 14.0 выполняется по `Rockchip_Developer_Guide_OTA_from_Android12_to_Android14_CN`: в дереве 14.0 выберите lunch для 12.0, например `lunch rk3568_s-userdebug` или `lunch rk3588_s-userdebug`, выполните обычную сборку и перенесите пакет, названный в источнике `upddate.zip`, на названное в том абзаце «устройство Android 14.0» для обновления.

(2) Если Android 13.0 получен из Android 11.0 по `Rockchip_Developer_Guide_OTA_from_Android11_to_Android13_CN`, следуйте `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`: в дереве 14.0 выберите lunch для 11.0, например `lunch rk3568_r-userdebug`, соберите систему и перенесите названный в источнике `upddate.zip` на обозначенное там «устройство Android 14.0» для обновления.

Примечание: `upddate.zip` не совпадает с `update.zip` основного процесса, а «устройство Android 14.0» противоречит контексту исходного Android 13.0. Расхождения сохранены; проверьте имя файла и целевое устройство.

## 4. Меры предосторожности

1. Для проверки и отладки источник требует `userdebug` на каждой платформе Android, например 13.0/14.0, и следующую переменную. Это отладочный пример, не готовая производственная настройка.

```make
BOARD_SELINUX_ENFORCING := false
```

2. Перед OTA таблицы разделов `parameter` должны совпадать. Для 13.0→14.0 прошивка 14.0 должна использовать тот же `parameter.txt`, что и 13.0.
3. Файловая система data и шифрование в `fstab`, например `fstab.rk30board`, должны совпадать. При 13.0→14.0 параметры data в прошивке 14.0 должны соответствовать 13.0.
4. До OTA проверьте исправность самой прошивки. Для 13.0→14.0 запишите 14.0 инструментом вроде `RKDevTool` и убедитесь в нормальной загрузке и работе всех функций.

Официальная справка: [AOSP OTA без A/B](https://source.android.com/docs/core/ota/nonab). Ссылка не подтверждает совместимость патчей Rockchip с текущим SDK.

{% endraw %}
