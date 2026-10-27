---
title: "Rockchip A/B OTA: обновление Android 13 до Android 14"
description: "Rockchip A/B OTA: обновление Android 13 до Android 14 — A/B, Virtual A/B, BSP, keymaster, userdata"
excerpt: "Rockchip A/B OTA: обновление Android 13 до Android 14"
translation_key: "241-rockchip-ab-ota-android13-to14"
slug: "241-rockchip-ab-ota-android13-to14"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "OTA", "A/B"]
---

{% raw %}

# Rockchip A/B OTA: обновление Android 13 до Android 14

Справочный материал для ArmSoM по китайскому исходнику RK-KF-YF-787 V1.0.0. Таблица продуктов содержит RK3326/RK3399/RK356x/RK3588/RK3562 и ядра 5.10/6.10; эти исходные значения не подтверждают поддержку всех сочетаний или плат ArmSoM. Проверьте фактический Android BSP, lunch-вариант, режим A/B, разделы и шифрование. Аппаратная проверка не проводилась.

Прошивка и настройки безопасности допустимы на разрешённых устройствах разработки после резервного копирования. userdebug/SELinux из исходника — отладочные примеры, не рекомендации для выпуска. Команды не выполнялись, патчи не скачивались.

| Чипы в исходнике | Версии ядра в исходнике |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10, 6.10 |

## 1. Обзор

Документ описывает OTA-переход с Rockchip Android 13.0 A/B на Android 14.0 A/B.

## 2. Патчи Android 14.0

### 2.1 Настройка A/B

Включите A/B в BoardConfig.mk проекта. Настройки Android 14 должны совпадать с Android 13: если виртуальный A/B не включён в Android 13, не включайте его в Android 14. Пример A/B:

```text
-BOARD_USES_AB_IMAGE := false
+BOARD_USES_AB_IMAGE := true
 BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
```

Пример виртуального A/B:

```text
-BOARD_USES_AB_IMAGE := false
-BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := false
+BOARD_USES_AB_IMAGE := true
+BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
```

### 2.2 data и keymaster

a. Сначала выполните главу 3. Если после обновления появляется главный экран Android, пункт b не нужен; иначе выполните b.

b. Возьмите патчи из каталога userdata_patches по ссылке ниже и примените к соответствующим репозиториям SDK Android 14. Инструкции находятся в README.txt каталога.

Ссылка: https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w ; код доступа: `0nsa`.

Только для проектов обновления существующих устройств Android 13 до Android 14. Не применяйте эти патчи к вновь разрабатываемым устройствам Android 14.

## 3. Обновление Android 13.0 до Android 14.0

Создайте OTA-пакет на Rockchip Android 14.0, перенесите на устройство Rockchip Android 13.0 и выполните обычное OTA-обновление. Сначала прочитайте меры предосторожности главы 4.

1. Выберите lunch-вариант перехода с 13.0 на 14.0, например `lunch rk3588_t-userdebug` либо `lunch rk3568_t-userdebug`. Каталог проекта обычно можно скопировать из SDK Android 13.

2. Соберите uboot и kernel обычным способом, выполните lunch и следующую команду источника:

```text
make clean && make –j32 && make dist -j32 && ./mkimage_ab.sh ota
```

3. Назовите пакет из шага 2 update.zip.
4. Перенесите на устройство Android 13 и обновите.

Примечание (1): если текущая Android 13 получена из Android 12 по `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android13_CN`, далее следуйте `Rockchip_Developer_Guide_AB_System_OTA_from_Android12_to_Android14_CN`. В SDK Android 14 выберите исходный lunch-вариант Android 12, например `lunch rk3568_s-userdebug` или `lunch rk3588_s-userdebug`, и соберите систему. Затем исходник предлагает поместить `upddate.zip` на «устройство Android 14.0». Имя расходится с update.zip, а версия устройства — с Android 13 до обновления. Эти расхождения сохранены; проверьте их перед применением.

Примечание (2): если Android 13 получена из Android 11 по `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android13_CN`, следуйте `Rockchip_Developer_Guide_AB_System_OTA_from_Android11_to_Android14_CN`. В SDK Android 14 выберите исходный lunch-вариант Android 11, например `lunch rk3568_r-userdebug`, и соберите систему. Источник снова пишет `upddate.zip` и «устройство Android 14.0»; те же расхождения требуют проверки.

## 4. Меры предосторожности

1. Для проверки и отладки используйте сборки userdebug на каждой платформе, например Android 13.0 и 14.0, и задайте `BOARD_SELINUX_ENFORCING := false`. Эта тестовая настройка из исходника не является рекомендацией по безопасности серийных устройств.

2. Перед OTA убедитесь, что таблицы разделов `parameter.txt` идентичны. При переходе с 13.0 на 14.0 собранная прошивка 14.0 должна использовать тот же `parameter.txt`, что и 13.0.

3. Перед OTA файловая система data и способ шифрования в fstab, например `fstab.rk30board`, должны совпадать. При переходе с 13.0 на 14.0 собранная прошивка 14.0 должна сохранять файловую систему data и способ шифрования версии 13.0.

4. Перед OTA проверьте работоспособность самой прошивки. При переходе с 13.0 на 14.0 запишите собранную прошивку 14.0 инструментом, например RKDevTool, и проверьте нормальную загрузку и работу всех функций.

## Редакторские замечания и источники

Соответствующего английского PDF нет; английский, русский и немецкий полностью переведены с китайского. Технических изображений нет; данные таблицы продуктов сохранены выше. Нетехническая обложка, аудитория и история редакций удалены. Исходное `–j32` содержит U+2013 и не исправлено молча; проверьте перед запуском. Расхождение `upddate.zip`/`update.zip` обозначено. Ссылки и коды из источника не проверялись.

В таблице ядро 6.10, не заменено догадкой на 6.1. Глава 3 называет целевое устройство исторического обновления Android 14, хотя текущая версия Android 13; конфликт отмечен во всех языках. Сохраняйте исходный режим A/B либо виртуального A/B. Ограничение конца страницы 4 для новых устройств и последние условия проверки страницы 5 сохранены.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP OTA](https://source.android.com/docs/core/ota/tools) · [AOSP A/B](https://source.android.com/docs/core/ota/ab)

{% endraw %}
