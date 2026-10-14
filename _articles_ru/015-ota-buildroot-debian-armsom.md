---
title: "OTA на ArmSoM: разные планы восстановления для Buildroot и Debian"
description: "Подписанные, наблюдаемые и восстанавливаемые обновления для Sige5, Sige7 и Forge1 с проверкой переносимости инструментов Raspberry Pi и Jetson."
translation_key: "015-ota-buildroot-debian-armsom"
slug: "ota-buildroot-debian-armsom"
date: 2026-10-14
author: "ArmSoM Editorial"
category: production
products: [Sige5, Sige7, Forge1]
tags: [OTA, Buildroot, Debian, secure update, ArmSoM]
keywords: "OTA на ArmSoM: разные планы восстановления для Buildroot и Debian, Sige5, Sige7, Forge1"
lang: ru
---

# OTA на ArmSoM: разные планы восстановления для Buildroot и Debian

![Проверки выпуска OTA](../assets/015-ota-trust-chain.svg)

Система обновлений — функция продукта, а не просто shell-скрипт. Для семейства Sige ArmSoM документирует поддержку Debian, Android и Buildroot; Forge1 ориентирован на Buildroot. Поэтому формат образа, загрузчик и механизм отката нужно определять для каждого продукта.

## Минимальные правила выпуска

Версионируйте ядро, Device Tree, корневую файловую систему, конфигурацию загрузчика и приложение вместе. Подписывайте артефакты в CI, проверяйте их перед установкой и сохраняйте заведомо рабочий слот либо внешний путь восстановления. Сохраняйте последовательные логи неудачных загрузок.

```bash
sha256sum Image *.dtb rootfs.squashfs
printf '%s  %s\n' "$VERSION" "$(git rev-parse HEAD)" > release.manifest
```

Эти команды формируют проверочные данные, но не реализуют полноценную безопасную загрузку. Хранение ключей, состояние eFuse, поведение Boot ROM и политика восстановления на объекте требуют проверки для конкретной платы.

## Границы совместимости

Инструменты OTA Raspberry Pi часто предполагают определённую схему загрузочных разделов. Обновления Jetson опираются на загрузочные компоненты NVIDIA. Не переносите эти процессы без сопоставления носителей, загрузчика и механизмов восстановления ArmSoM.

## Источники

- [Центр разработчиков ArmSoM](https://docs.armsom.org/)
- [Документация Forge1](https://docs.armsom.org/zh/armsom-forge1)
- [Руководство по запуску и питанию семейства Sige](https://docs.armsom.org/sige-family-started)

## Проверки перед публикацией

- [ ] Проверьте отключение питания во время обновления.
- [ ] Проверьте откат и заводское восстановление на точном SKU.
- [ ] Укажите владельца ключей и предполагаемый срок поддержки.
