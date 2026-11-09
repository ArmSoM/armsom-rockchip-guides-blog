---
title: "RK3576: 30 тем схемотехники, PCB и проверки"
description: "30 тем, связывающих схему, проверку PCB и запуск."
excerpt: "30 тем, связывающих схему, проверку PCB и запуск."
translation_key: "rk3576-hardware-design-series"
slug: "rk3576-hardware-design-series"
lang: "ru"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM5", "Sige5"]
tags: ["RK3576", "hardware design", "CM5", "Sige5"]
image: "/assets/rk3576-hardware-series/rk3576-en-p77.png"
---
# RK3576: 30 тем схемотехники, PCB и проверки

30 тем, связывающих схему, проверку PCB и запуск.

Основа — китайская и английская версии RK3576 Hardware Design Guide V1.1 (2024-05-28), для плат с SoC. Носители CM5 проектируют по интерфейсу модуля; Sige5 подходит для программной базы сравнения. Единого SDK/BSP или ядра для всех изделий руководство не задаёт: совместимость проверяют для каждой платы. Значения взяты из источника, а не измерены ArmSoM.

## С чего начать

Для первой платы SoC следуйте порядку ниже. Для носителя CM5 начните с минимальной системы, загрузки/отладки, последовательности и USB, затем вернитесь к разъёмам модуля и IO-плате. DDR и внутренний PMIC объясняют границы модуля; их не дублируют на носителе.

1. [Минимальная система RK3576: от проверки схемы до повторяемого запуска](/ru/articles/rk3576-hardware-bringup/)
2. [Тактирование RK3576: кварц 24MHz, режим 32kHz и такты периферии](/ru/articles/rk3576-clock-circuit-design/)
3. [Сброс RK3576: NPOR, RK806S-5, watchdog и температурная защита](/ru/articles/rk3576-reset-watchdog-design/)
4. [Загрузка и отладка RK3576: конфигурация, Maskrom, UART и JTAG](/ru/articles/rk3576-boot-debug-design/)
5. [Питание RK3576: домены CPU, GPU, NPU, LOGIC и развязка](/ru/articles/rk3576-power-domain-design/)
6. [RK3576 и RK806S-5: выбор PMIC, управляющие выводы и обратная связь](/ru/articles/rk3576-rk806s5-pmic-design/)
7. [Питание и сон RK3576: последовательность, удерживаемые шины и пробуждение](/ru/articles/rk3576-power-sequencing-standby/)
8. [DDR RK3576: схемы и питание LPDDR4, LPDDR4X и LPDDR5](/ru/articles/rk3576-ddr-circuit-power/)
9. [Трассировка DDR RK3576: импеданс, длина, возвратный ток и PDN](/ru/articles/rk3576-ddr-pcb-routing/)
10. [Аппаратное дополнение USB/Type-C RK3576: мультиплексирование и защита](/ru/articles/168-rockchip-rk3576-usb/)

## Использование параметров и рисунков

Ниже страницы источника со схемами или временными диаграммами; нажмите для полного разрешения. Обозначения и номиналы относятся к эталонной схеме, не к схеме изделия ArmSoM.

В статьях сохранены область применения, типовые значения и расхождения источника. Предел адресации не является штатной памятью изделия, пики примера — измеренной мощностью платы, а возможный интерфейс — выведенным разъёмом. При переходе с Sige5 на изделие CM5 сохраняйте SDK, ревизии и результаты проверки.

[ArmSoM CM5](https://www.armsom.org/cm5) · [ArmSoM Sige5](https://www.armsom.org/sige5)

## Далее: память, интерфейсы и надёжность

11. [Аппаратный интерфейс eMMC RK3576: питание, подтяжки и HS400](/ru/articles/rk3576-emmc-hardware-design/)
12. [UFS RK3576: совместимость памяти, последовательность питания и разводка](/ru/articles/rk3576-ufs-hardware-design/)
13. [Загрузка RK3576 через FSPI: NOR/NAND, напряжение и состояние CS](/ru/articles/rk3576-fspi-boot-hardware/)
14. [SD-карты и SDIO Wi-Fi RK3576: переключение уровней, питание и RF](/ru/articles/rk3576-sdio-wifi-hardware/)
15. [PCIe RK3576: режим RC, общие PHY и питание устройств](/ru/articles/rk3576-pcie-hardware-design/)
16. [SATA RK3576: общие PHY, развязка и питание накопителя](/ru/articles/rk3576-sata-hardware-design/)
17. [Камеры RK3576: группы CSI, режимы DCPHY и питание](/ru/articles/rk3576-camera-hardware-design/)
18. [Дисплеи RK3576: MIPI, RGB, подсветка и сенсорная панель](/ru/articles/rk3576-display-panel-hardware/)
19. [HDMI RK3576: FRL/TMDS, уровни DDC и защита](/ru/articles/rk3576-hdmi-hardware-design/)
20. [DP/eDP RK3576: распределение PHY, AUX и расхождение ёмкостей](/ru/articles/rk3576-dp-edp-hardware-design/)
21. [Аудиотракт RK3576: SAI, PDM, ASRC и микрофоны](/ru/articles/rk3576-audio-hardware-design/)
22. [Ethernet RK3576: задержка RGMII, такт PHY и защита](/ru/articles/rk3576-gmac-hardware-design/)
23. [GPIO и SARADC RK3576: домены, обратное питание и кнопки](/ru/articles/rk3576-gpio-saradc-hardware/)
24. [Интерфейсы управления RK3576: UART, I2C/I3C, SPI, CAN и PWM](/ru/articles/rk3576-industrial-control-interfaces/)
25. [FlexBus и DSMC RK3576: FPGA, PSRAM и параллельная разводка](/ru/articles/rk3576-flexbus-dsmc-hardware/)
26. [Стек и fanout PCB RK3576: шесть/восемь слоёв и смешанный шаг BGA](/ru/articles/rk3576-pcb-stackup-fanout/)
27. [Скоростные интерфейсы RK3576: импеданс, возврат, ответвления и тракт](/ru/articles/rk3576-high-speed-interface-design/)
28. [PCB питания и PDN RK3576: RK806S-5, обратная связь и токовые петли](/ru/articles/rk3576-power-pcb-pdn-design/)
29. [Тепловой проект RK3576: сопротивление, PCB и длительная нагрузка](/ru/articles/rk3576-thermal-hardware-design/)
30. [ESD и EMI RK3576: разряд у разъёмов, сброс и подготовка производства](/ru/articles/rk3576-esd-emi-reliability-design/)
