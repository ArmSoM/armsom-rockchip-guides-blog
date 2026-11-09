---
title: "RK3588S: 30 тем схемотехники, PCB и проверки"
description: "Схемы RK3588S, ограничения PCB и проверка с CM7S и Sige7S."
excerpt: "Схемы RK3588S, ограничения PCB и проверка с CM7S и Sige7S."
translation_key: "rk3588s-hardware-design-series"
slug: "rk3588s-hardware-design-series"
lang: "ru"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM7s", "Sige7s"]
tags: ["RK3588S", "hardware design", "CM7s", "Sige7s"]
image: "/assets/rk3588s-hardware-series/rk3588s-cn-p17.png"
---
# RK3588S: 30 тем схемотехники, PCB и проверки

Основа — китайский RK3588S Hardware Design Guide V1.2 (2023-12-14), для проверки схем и PCB. Носители CM7S проектируют по интерфейсам модуля; Sige7S подходит для оценки ПО и периферии. Возможности SoC не равны разъёмам платы. Проверяйте SDK/BSP, ядро, ревизию, прошивку и мультиплексирование. Значения взяты из источника, не из измерений ArmSoM.

## Порядок изучения

CM7S подходит для собственного носителя: сначала определите встроенные питание, DDR и загрузку, затем проектируйте за пределами разъёмов. Sige7S служит базой оценки ПО и периферии. Для обоих изделий проверяйте вывод интерфейсов, контакты, уровни, образы и охлаждение по нужной ревизии. Схема SoC не является схемой подключения изделия.

1. [RK3588S и носитель CM7S: ресурсы и проверка](/ru/articles/rk3588s-cm7s-carrier-design/)
2. [Тактовые цепи RK3588S: 24MHz, 32kHz и размещение](/ru/articles/rk3588s-clock-hardware-design/)
3. [Сброс, watchdog и термозащита RK3588S](/ru/articles/rk3588s-reset-watchdog-hardware/)
4. [Загрузка RK3588S: Maskrom, JTAG и UART](/ru/articles/rk3588s-boot-debug-hardware/)
5. [Питание RK3588S: запуск и неиспользуемые PHY](/ru/articles/rk3588s-power-rail-planning/)
6. [Порядок питания RK3588S: RESETn и S0/S3](/ru/articles/rk3588s-power-sequencing-design/)
7. [RK3588S и RK806: один или два PMIC](/ru/articles/rk3588s-rk806-pmic-design/)
8. [DDR RK3588S: LPDDR4/4X/5 и конфигурация памяти](/ru/articles/rk3588s-ddr-circuit-design/)
9. [Трассировка DDR RK3588S: длина и задержка](/ru/articles/rk3588s-ddr-pcb-routing/)
10. [eMMC RK3588S: такт, подтяжки и Strobe](/ru/articles/rk3588s-emmc-hardware-design/)
11. [FSPI Flash RK3588S: загрузка, питание и согласование](/ru/articles/rk3588s-fspi-boot-hardware/)
12. [SDMMC и SDIO Wi-Fi RK3588S: уровни и защита](/ru/articles/rk3588s-sdmmc-sdio-wifi-design/)
13. [USB и Type-C RK3588S: контроллеры, PHY и восстановление](/ru/articles/rk3588s-usb-typec-hardware-design/)
14. [SATA RK3588S: три контроллера и общие PHY](/ru/articles/rk3588s-sata-hardware-design/)
15. [PCIe RK3588S: линии, опорные такты и питание](/ru/articles/rk3588s-pcie-hardware-design/)
16. [Камеры RK3588S: CSI, D/C PHY и CIF](/ru/articles/rk3588s-camera-hardware-design/)
17. [RK3588S и RK3588S2: PHY камер и совместимость](/ru/articles/rk3588s-rk3588s2-hardware-differences/)
18. [HDMI TX RK3588S: FRL, TMDS и совместимость](/ru/articles/rk3588s-hdmi-tx-hardware-design/)
19. [Дисплеи MIPI RK3588S: D-PHY, C-PHY и панели](/ru/articles/rk3588s-mipi-display-hardware/)
20. [DP и eDP RK3588S: PHY, AUX и развязка](/ru/articles/rk3588s-dp-edp-hardware-design/)
21. [Аудио RK3588S: I2S, PDM и массивы микрофонов](/ru/articles/rk3588s-audio-hardware-design/)
22. [Ethernet RK3588S: GMAC, PHY и направление такта](/ru/articles/rk3588s-gmac-hardware-design/)
23. [GPIO и SARADC RK3588S: домены и кнопки](/ru/articles/rk3588s-gpio-saradc-hardware/)
24. [Распределение UART, SPI, CAN, I2C и PWM RK3588S](/ru/articles/rk3588s-serial-control-hardware/)
25. [Стек и fanout RK3588S: HDI и сквозные переходы](/ru/articles/rk3588s-pcb-stackup-fanout/)
26. [Высокоскоростная PCB RK3588S: площадки и переходы от 8GT/s](/ru/articles/rk3588s-high-speed-pcb-review/)
27. [Питание PCB и PDN RK3588S: медь, возврат и развязка](/ru/articles/rk3588s-power-pcb-pdn-design/)
28. [Тепловой расчёт RK3588S: эталон и проверка системы](/ru/articles/rk3588s-thermal-hardware-design/)
29. [ESD и EMI RK3588S: защита интерфейсов и возврат тока](/ru/articles/rk3588s-esd-emi-hardware-design/)
30. [Монтаж и хранение RK3588S: оплавление, MSL3 и сушка](/ru/articles/rk3588s-assembly-storage-design/)

## Использование рисунков

Соответствующее английское руководство для этой партии не найдено. Все четыре версии используют снимки китайского оригинала с локализованными подписями. Откройте изображение в полном разрешении; текст и таблицы можно копировать. Номера относятся к физическим страницам PDF.

- [ArmSoM CM7S](https://www.armsom.org/cm7s)

- [ArmSoM Sige7S](https://www.armsom.org/sige7s)
