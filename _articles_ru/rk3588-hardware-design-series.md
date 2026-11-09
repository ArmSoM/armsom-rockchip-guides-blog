---
title: "RK3588: 30 тем схемотехники, PCB и проверки"
description: "Схемы RK3588, ограничения PCB и проверка с AIM7, Sige7 и LM7."
excerpt: "Схемы RK3588, ограничения PCB и проверка с AIM7, Sige7 и LM7."
translation_key: "rk3588-hardware-design-series"
slug: "rk3588-hardware-design-series"
lang: "ru"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["AIM7", "Sige7", "LM7"]
tags: ["RK3588", "hardware design", "AIM7", "Sige7", "LM7"]
image: "/assets/rk3588-hardware-series/rk3588-en-p26.png"
---
# RK3588: 30 тем схемотехники, PCB и проверки

Основа — китайская и английская версии RK3588 Hardware Design Guide V1.3 (2023-02-13), для проверки плат SoC и носителей. Носители AIM7 и LM7 проектируют по интерфейсу модуля; Sige7 служит базой проверки ПО и периферии. Возможности SoC не равны перечню разъёмов платы. Проверяйте SDK/BSP, ядро, ревизию и прошивку. Значения взяты из источника, не из измерений ArmSoM.

## Порядок изучения

AIM7 подходит для носителей вычислительного модуля, LM7 — для интеграции LGA, Sige7 — для первичной оценки ПО и периферии. До разработки носителя определите уже встроенные цепи питания, DDR и загрузки. Не дублируйте схемы SoC без необходимости. Разъёмы, выведенные интерфейсы, уровни и поддержку системы сверяйте с документацией изделия.

1. [Аппаратура edge AI на RK3588: от нагрузки к проверке](/ru/articles/rk3588-edge-ai-hardware-design/)
2. [Тактовые цепи RK3588: 24MHz, 32kHz и размещение](/ru/articles/rk3588-clock-hardware-design/)
3. [Сброс, watchdog и термозащита RK3588](/ru/articles/rk3588-reset-watchdog-hardware/)
4. [Загрузка RK3588: Maskrom, JTAG и UART](/ru/articles/rk3588-boot-debug-hardware/)
5. [Питание RK3588: запуск и неиспользуемые PHY](/ru/articles/rk3588-power-rail-planning/)
6. [Порядок питания RK3588: RESETn и S0/S3](/ru/articles/rk3588-power-sequencing-design/)
7. [RK3588 и RK806: один или два PMIC](/ru/articles/rk3588-rk806-pmic-design/)
8. [DDR RK3588: LPDDR4/4X/5 и конфигурация памяти](/ru/articles/rk3588-ddr-circuit-design/)
9. [Трассировка DDR RK3588: длина и задержка](/ru/articles/rk3588-ddr-pcb-routing/)
10. [eMMC RK3588: такт, подтяжки и Strobe](/ru/articles/rk3588-emmc-hardware-design/)
11. [FSPI Flash RK3588: загрузка, питание и согласование](/ru/articles/rk3588-fspi-boot-hardware/)
12. [SDMMC и SDIO Wi-Fi RK3588: уровни и защита](/ru/articles/rk3588-sdmmc-sdio-wifi-design/)
13. [USB и Type-C RK3588: контроллеры, PHY и восстановление](/ru/articles/rk3588-usb-typec-hardware-design/)
14. [SATA RK3588: три контроллера и общие PHY](/ru/articles/rk3588-sata-hardware-design/)
15. [PCIe RK3588: линии, опорные такты и питание](/ru/articles/rk3588-pcie-hardware-design/)
16. [Камеры RK3588: CSI, D/C PHY и CIF](/ru/articles/rk3588-camera-hardware-design/)
17. [HDMI RX RK3588: вход захвата, CEC и DDC](/ru/articles/rk3588-hdmi-rx-hardware-design/)
18. [HDMI TX RK3588: FRL, TMDS и совместимость](/ru/articles/rk3588-hdmi-tx-hardware-design/)
19. [Дисплеи MIPI RK3588: D-PHY, C-PHY и панели](/ru/articles/rk3588-mipi-display-hardware/)
20. [DP и eDP RK3588: PHY, AUX и развязка](/ru/articles/rk3588-dp-edp-hardware-design/)
21. [Аудио RK3588: I2S, PDM и массивы микрофонов](/ru/articles/rk3588-audio-hardware-design/)
22. [Ethernet RK3588: GMAC, PHY и направление такта](/ru/articles/rk3588-gmac-hardware-design/)
23. [GPIO и SARADC RK3588: домены и кнопки](/ru/articles/rk3588-gpio-saradc-hardware/)
24. [Распределение UART, SPI, CAN, I2C и PWM RK3588](/ru/articles/rk3588-serial-control-hardware/)
25. [Стек и fanout RK3588: HDI и сквозные переходы](/ru/articles/rk3588-pcb-stackup-fanout/)
26. [Высокоскоростная PCB RK3588: площадки и переходы от 8GT/s](/ru/articles/rk3588-high-speed-pcb-review/)
27. [Питание PCB и PDN RK3588: медь, возврат и развязка](/ru/articles/rk3588-power-pcb-pdn-design/)
28. [Тепловой расчёт RK3588: эталон и проверка системы](/ru/articles/rk3588-thermal-hardware-design/)
29. [ESD и EMI RK3588: защита интерфейсов и возврат тока](/ru/articles/rk3588-esd-emi-hardware-design/)
30. [Монтаж и хранение RK3588: оплавление, MSL3 и сушка](/ru/articles/rk3588-assembly-storage-design/)

## Использование рисунков

Ниже страницы источника со схемами или временными диаграммами; нажмите для полного разрешения. Обозначения и номиналы относятся к эталонной схеме, не к схеме изделия ArmSoM.

- [ArmSoM AIM7](https://www.armsom.org/aim7)

- [ArmSoM Sige7](https://www.armsom.org/sige7)

- [ArmSoM LM7](https://www.armsom.org/lm7)
