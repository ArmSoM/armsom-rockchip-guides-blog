---
title: "Установка Magisk на Rockchip Android: руководство для Pie и Q"
description: "Полные исторические процедуры установки через boot-образ и TWRP, ramdisk и примечания SafetyNet."
excerpt: "Полные исторические процедуры установки через boot-образ и TWRP, ramdisk и примечания SafetyNet."
translation_key: "268-rockchip-android-magisk"
slug: "268-rockchip-android-magisk"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## Область применения и исторический источник

Это полный технический перевод предоставленного английского руководства по Magisk для Rockchip Android Pie и Android Q. На обложке указано V1.0.1, а таблица изменений доходит до V1.0.2; расхождение сохранено. Описан исторический процесс с MagiskManager, Magisk Hide и SafetyNet. Он не является рекомендацией для современных версий и не гарантирует прохождение проверок целостности. Конкретная плата ArmSoM, сборка BSP и версия ядра не проверены; сначала сопоставьте структуру загрузочного образа и SDK. Прошивка, установка root и аппаратные испытания не выполнялись. Китайский PDF отсутствует, поэтому единственный английский снимок используется во всех четырёх языках.

## 1 Введение

Источник описывает Magisk как открытый набор средств настройки Android с поддержкой Android 5.0 (API 21) и более поздних версий. Возможности включают root, загрузочные скрипты, патчи SELinux и удаление AVB2.0, dm-verity и forceencrypt. Systemless Interface меняет поведение system или vendor, не изменяя сами разделы. Исторический текст также заявляет сокрытие изменений от банковских приложений, корпоративного мониторинга, игровых античитов и Google SafetyNet; это утверждение источника, а не проверенная современная возможность.

Исходный проект: [Magisk](https://github.com/topjohnwu/Magisk).

## 2 Способы установки

Предусмотрены два способа интеграции:

1. Прошивка загрузочного образа, исправленного Magisk Manager.
2. Установка ZIP Magisk через стороннее recovery, например TWRP.

## 3 Прошивка образа, исправленного Magisk Manager

По источнику большинство устройств Rockchip не используют A/B. В Android Pie такие устройства работают с system-as-root, а `boot.img` не содержит ramdisk. Magisk размещает файлы в ramdisk загрузочного образа, поэтому он должен присутствовать. В Android Q ramdisk возвращается в `boot.img`. По аналогии с A/B-устройствами ramdisk можно добавить в `boot.img`, указав `skip_initramfs` в cmdline для его пропуска.

### 3.1 Подготовка

Соберите `boot.img` с ramdisk: включите `BOOTIMG_SUPPORT_MAGISK` и соберите загрузочный образ. Путь BoardConfig напечатан как `device/rockchip/rk3328/rk3328_box BoardConfig.mk` (с пробелом); проверьте реальный путь, не выполняйте эту строку как команду.

```make
BOOTIMG_SUPPORT_MAGISK := true
```

```sh
make bootimage
```

В Android Q этот подготовительный шаг пропускается: `boot.img` уже содержит ramdisk. Загрузите MagiskManager из [выпусков проекта](https://github.com/topjohnwu/Magisk/releases), выбрав версию для описанного исторического процесса.

### 3.2 Установка

1. Передайте `boot.img` на устройство.

```sh
adb push path/to/boot.img /storage/emulated/0/Download
```

2. Установите MagiskManager.

```sh
adb install /path/to/MagiskManager.apk
```

3. В MagiskManager выберите **install → Patch Boot Image File** и файл `boot.img` из шага 1. Программа загрузит ZIP Magisk и автоматически исправит образ.
4. Скопируйте исправленный образ на ПК.

```sh
adb pull /storage/emulated/0/Download/boot_patched.img
```

5. Прошейте `boot_patched.img` в раздел boot с помощью AndroidTools.

Примечания источника:

1. При сбое APK после выбора Patch Boot Image File источник предлагает сторонний файловый менеджер; исторический пример — ES File Explorer File Manager.
2. Если adb недоступен после установки, отключите **Settings → Settings → Magisk Hide** и перезагрузите устройство.
3. После установки MagiskManager подключитесь к сети: иначе кнопка установки может отсутствовать, как на рисунке 1.

![Рисунок 1. MagiskManager без кнопки установки; английский PDF, страница 5.](/docs/rockchip-android-magisk/images/magisk-manager.png)

Рисунок 1. MagiskManager без кнопки установки; английский PDF, страница 5.

## 4 Установка ZIP Magisk через TWRP

### 4.1 Подготовка

- Соберите [Rockchip TWRP](https://github.com/rockchip-software/TWRP).
- Соберите `boot.img` с ramdisk, как описано выше.
- Загрузите `Magisk.zip` из [выпусков Magisk](https://github.com/topjohnwu/Magisk/releases).

### 4.2 Установка

1. Прошейте TWRP (`recovery.img`) и `boot.img` через AndroidTool.
2. Передайте `Magisk.zip` на устройство.

```sh
adb push /path/to/Magisk.zip /sdcard/
```

3. Перезагрузитесь в recovery.

```sh
adb reboot recovery
```

4. Установите `Magisk.zip` через TWRP.
5. Перезагрузите устройство.
6. Установите MagiskManager.

```sh
adb install /path/to/MagiskManager.apk
```

## 5 Проверка SafetyNet — историческая процедура

Источник разделяет SafetyNet на CTS compatibility и Basic integrity. CTS описан как серверная проверка, которую трудно подделать, а Basic integrity — как проверка на устройстве с более низким уровнем защиты. Некоторые приложения используют только Basic integrity и могут работать при неуспешной полной проверке SafetyNet. Эти описания сохранены в историческом контексте.

По источнику, если Basic integrity имеет значение true, но SafetyNet не проходит, Google может не доверять устройству. Предлагается согласовать свойства с ROM, проходящей проверку, прежде всего `ro.build.fingerprint`, посредством MagiskHide Props Config. Это не означает сертификацию устройства и не гарантирует результат.

Исходные варианты установки: раздел Downloads в Magisk Manager либо ZIP из Manager/темы поддержки модуля, устанавливаемый через **Magisk Manager → Modules** или recovery, например TWRP. После установки модуля и перезагрузки приведены команды:

```sh
adb shell
su
props
```

Выберите сертифицированный fingerprint из списка. Ссылки источника: [документация MagiskHide SafetyNet](https://www.didgeridoohan.com/magisk/MagiskHideSafetyNet) и [MagiskHidePropsConf](https://github.com/Magisk-Modules-Repo/MagiskHidePropsConf).

Примечание источника: сначала удалите другие интегрированные root-инструменты.

Документация ArmSoM: [docs.armsom.org](https://docs.armsom.org/).

{% endraw %}
