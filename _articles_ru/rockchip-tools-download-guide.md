---
title: "Инструменты Rockchip от ArmSoM: загрузки и 24 руководства"
description: "Выберите инструмент по задаче, затем проверьте хост, версию, руководство и требования платы. Коллекция включает 24 семейства и 35 пакетов. Каждая статья содержит действительную GitHub-загрузку; команды и хеши совпадают во всех четырёх языках."
excerpt: "Выберите инструмент по задаче, затем проверьте хост, версию, руководство и требования платы. Коллекция включает 24 семейства и 35 пакетов. Каждая статья содержит действительную GitHub-загрузку; команды и хеши совпадают во всех четырёх языках."
translation_key: "rockchip-tools-download-guide"
slug: "rockchip-tools-download-guide"
lang: "ru"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["Rockchip", "ArmSoM", "Tools"]
---

Выберите инструмент по задаче, затем проверьте хост, версию, руководство и требования платы. Коллекция включает 24 семейства и 35 пакетов. Каждая статья содержит действительную GitHub-загрузку; команды и хеши совпадают во всех четырёх языках.

Доступны 34 пакета; USB SQ Tool 1.5 удержан до проверки производителя.

[Security review / 核验状态](https://github.com/ArmSoM/rockchip-tools/blob/main/SECURITY-REVIEW.md)

## Загрузка, версии и SHA-256

[ArmSoM / rockchip-tools](https://github.com/ArmSoM/rockchip-tools)

- [RKDevTool: загрузка, Loader, разделы и прошивка update.img](/ru/articles/rockchip-tool-rkdevtool/)
- [DriverAssitant 5.13: драйверы Rockusb и ADB в Windows](/ru/articles/rockchip-tool-driver-assistant/)
- [upgrade_tool: команды прошивки Rockchip и выбор устройства](/ru/articles/rockchip-tool-upgrade-tool/)
- [boot_merger: согласование DDR, загрузочного кода и Loader](/ru/articles/rockchip-tool-boot-merger/)
- [Firmware_Merger: образы Flat RK, Flat GPT и Compact GPT](/ru/articles/rockchip-tool-firmware-merger/)
- [afptool и rkImageMaker: создание и проверка update.img](/ru/articles/rockchip-tool-firmware-pack-tools/)
- [Linux_Diff_Firmware: дифференциальное OTA-обновление Rockchip](/ru/articles/rockchip-tool-diff-firmware/)
- [DDR Bandwidth Tool: измерение трафика памяти Rockchip](/ru/articles/rockchip-tool-ddr-bandwidth/)
- [DDR_UserTool 1.41: выбор конфигурации тестирования DDR](/ru/articles/rockchip-tool-ddr-user-tool/)
- [rk_ddrbin_tool: параметры ранней инициализации DDR](/ru/articles/rockchip-tool-ddrbin-tool/)
- [PinDebug: диагностика IOMUX, GPIO и доменов питания Rockchip](/ru/articles/rockchip-tool-pin-debug/)
- [USB SQ Tool 1.5: глазковая диаграмма и настройки USB PHY](/ru/articles/rockchip-tool-usb-sq-tool/)
- [rk_sign_tool и sign_tool: подпись и проверка прошивки Rockchip](/ru/articles/rockchip-tool-rk-sign-tool/)
- [SecureBootTool 1.85: границы исторической схемы Secure Boot](/ru/articles/rockchip-tool-secureboot-tool/)
- [Linux SecurityAVB: ключи, подпись boot и границы версий](/ru/articles/rockchip-tool-linux-avb/)
- [Linux SecurityDM: dm-verity и упаковка зашифрованного rootfs](/ru/articles/rockchip-tool-linux-dm/)
- [BoardProofTool 1.01: загрузка и проверка полного CPU ID](/ru/articles/rockchip-tool-board-proof/)
- [EfuseTool 1.42: подготовка станции Secure Boot provisioning](/ru/articles/rockchip-tool-efuse-tool/)
- [ParameterTool 1.2: проверка параметров разделов Rockchip](/ru/articles/rockchip-tool-parameter-tool/)
- [RKDevInfoWriteTool: серийные номера и MAC без дублирования](/ru/articles/rockchip-tool-devinfo-write/)
- [RKPCBATool 1.2.1: функциональные тесты Linux-платы и ручная оценка](/ru/articles/rockchip-tool-pcba-tool/)
- [HDCP Key Writer: упаковка разрешённых ключей и provisioning](/ru/articles/rockchip-tool-hdcp-key-writer/)
- [SDDiskTool 1.78: SD Boot, карта обновления и PCBA](/ru/articles/rockchip-tool-sd-disk-tool/)
- [programmer_image_tool: образы для eMMC, SPI NOR и NAND-программаторов](/ru/articles/rockchip-tool-programmer-image-tool/)

## Применимость и проверка

Руководство составлено по документации этой коллекции. Проверьте плату, SoC, плату-носитель, SDK/BSP и архитектуру хоста. Прошивка, provisioning, запись регистров и аппаратные испытания не выполнялись. Наличие пакета не подтверждает поддержку всех изделий ArmSoM.

Выберите архив, проверьте хеш и распакуйте весь каталог. Разделённый Linux PinDebug сначала восстановите по инструкции; его указанный хеш относится к целому файлу.

[SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS) · [PDF](https://github.com/ArmSoM/rockchip-tools/tree/main/manuals)
