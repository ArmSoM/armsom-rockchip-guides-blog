---
title: "Rockchip RK3588S2: характеристики, выводы и электрические пределы"
description: "Rockchip RK3588S2: характеристики, выводы и электрические пределы — Rev1.2"
excerpt: "Rockchip RK3588S2: характеристики, выводы и электрические пределы"
translation_key: "217-rockchip-rk3588s2-datasheet"
slug: "217-rockchip-rk3588s2-datasheet"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588S2","datasheet"]
---

{% raw %}

# Rockchip RK3588S2: характеристики, выводы и электрические пределы

Справочник для платформ ArmSoM описывает микросхему, а не гарантирует совместимость платы. Проверьте вариант, схему, питание и BSP. Рисунки и характеристики предоставлены Rockchip; испытания ArmSoM не проводились. Версии SDK/ядра не заданы.

Источники: английские RK3588S2 Rev1.2 от2024-12-12 и Rev1.0 от2023-11-01, по35 страниц, в CN/EN соответственно. Основа1.2; все рисунки из её английского оригинала.

## 1.1

RK3588S2 — энергоэффективный высокопроизводительный процессор для ПК на ARM, устройств периферийных вычислений, персональных мобильных интернет-устройств и других цифровых мультимедийных систем. Он объединяет четыре ядра Cortex-A76 и четыре Cortex-A55 с сопроцессорами NEON. Аппаратные блоки ускоряют ресурсоёмкие приложения: декодирование H.265 и VP9 достигает 8K@60fps, H.264 — 8K@30fps, AV1 — 4K@60fps. Кодирование H.264 и H.265 поддерживается до 8K@30fps; также встроены высококачественный кодек JPEG и специализированные блоки предварительной и последующей обработки изображений. Графический процессор 3D поддерживает OpenGLES 1.1, 2.0 и 3.2, OpenCL до 2.2 и Vulkan 1.2. Отдельный блок 2D с MMU ускоряет вывод изображения. Полностью аппаратный ISP обрабатывает до 48 мегапикселей и ускоряет HDR, 3A, LSC, 3DNR, 2DNR, повышение резкости, удаление дымки, коррекцию «рыбьего глаза» и гамма-коррекцию. NPU поддерживает смешанные операции INT4/INT8/INT16/FP16 с производительностью до 6 TOPS; допускается преобразование моделей TensorFlow, MXNet, PyTorch и Caffe. Четырёхканальный интерфейс внешней памяти поддерживает LPDDR4/LPDDR4X/LPDDR5/LPDDR5X и высокие требования к пропускной способности. Полный набор периферийных интерфейсов обеспечивает гибкость применения.

## 1.2.1

Микропроцессор. Четыре ARM Cortex-A76 MPCore и четыре ARM Cortex-A55 MPCore сочетают высокую производительность, низкое энергопотребление и кэширование. DSU (DynamIQ Shared Unit) содержит память L3, логику управления и внешние интерфейсы кластера DynamIQ. Полностью реализован набор команд ARMv8-A, включая ARM NEON Advanced SIMD для обработки мультимедиа и сигналов, криптографические расширения ARMv8 и TrustZone. Каждое ядро A76 имеет 64KB кэша инструкций L1, 64KB данных L1 и 512KB L2; каждое A55 — 32KB инструкций L1, 32KB данных L1 и 128KB L2. Все восемь ядер используют общий кэш L3 объёмом 3MB. Восемь независимых доменов питания обеспечивают внутреннюю коммутацию и внешнее включение/выключение согласно сценарию: PD_CPU_0/1/2/3 соответствуют ядрам A55 1/2/3/4, а PD_CPU_4/5/6/7 — ядрам A76 1/2/3/4; каждый включает NEON, FPU и кэши инструкций/данных L1/L2. DVFS поддерживается тремя отдельными доменами напряжения: A76_0+A76_1, A76_2+A76_3 и DSU+Cortex-A55.

## 1.2.2

Организация памяти. Встроенное BootROM загружает систему через SPI, eMMC или SD/MMC и принимает системный код через USB OTG. Общая память находится в VD_LOGIC; PMU SRAM в VD_PMU предназначена для экономичных режимов. Внешняя динамическая память соответствует JEDEC LPDDR4/LPDDR4X/LPDDR5/LPDDR5X: четыре 16-разрядных канала, до двух рангов/сигналов выбора кристалла на канал и до 32GB общего адресного пространства. SDRAM поддерживает отключение питания и самообновление. eMMC полностью соответствует JEDEC 5.1/5.0 и обратно совместима с 4.51 и предыдущими версиями; режимы HS400, HS200, DDR50 и традиционные используют шину 1/4/8 бит. SD/MMC совместима с SD3.0 и MMC 4.51 при ширине 4 бита. FSPI обеспечивает двустороннюю передачу с последовательной флеш-памятью, шину 1/2/4 бита и два сигнала выбора кристалла.

## 1.2.3

Системные компоненты. Встроены три Cortex-M0: VD_PMU содержит кэш 16KB и TCM 16KB, VD_NPU — кэш 16KB и TCM 64KB, PD_CENTER — TCM 32KB. Программируемый контроллер прерываний подводит все линии IRQ CPU GIC также к PMU_M0 и DDR_M0; имеется отладчик JTAG. CRU использует 18 PLL и один вход генератора 24MHz, отдельно отключает тактирование компонентов и выполняет общий либо индивидуальный программный сброс. PMU экономит энергию изменением частоты, автоматическим отключением тактирования и переключением питания; предусмотрены различные источники пробуждения, 10 доменов напряжения и 45 программно переключаемых доменов питания. Имеются 12 защищённых и 18 незащищённых таймеров: 64-разрядный счётчик, прерывания, непрерывный либо заданный пользователем счёт и чтение рабочего состояния. Шестнадцать PWM (PWM0–PWM15) поддерживают прерывания, программируемое предварительное и последующее деление частоты шины, 32-разрядный таймер/счётчик, захват, непрерывный/однократный и опорный режимы, переменную скважность. PWM3/7/11/15 оптимизированы для ИК. Пять сторожевых таймеров обслуживают CPU/MCU: 32-разрядный счётчик уменьшается от заданного значения до нуля. Тайм-аут вызывает немедленный сброс либо сначала прерывание и затем сброс при повторном тайм-ауте, если программа не очистила состояние. Контроллер принимает 12 PPI, 480 SPI и 16 программных прерываний; SPI активны высоким, PPI низким уровнем; приоритет каждого источника программируется. Три микрокодовых DMAC поддерживают связные списки scatter/gather и передачи память–память, память–периферия и периферия–память. Каждый имеет 8 каналов, 32 аппаратных запроса, 2 выхода прерываний и TrustZone с настройкой защиты каждого канала. Два криптоблока поддерживают LLI DMA; аппаратное дополнение SHA-1, SHA-256/224, SHA-512/384, MD5, SM3 и HMAC SHA-1/SHA-256/SHA-512/MD5/SM3; шифрование/дешифрование AES-128/192/256; режимы AES и SM4 ECB/CBC/OFB/CFB/CTR/CTS/XTS/CCM/GCM/CBC-MAC/CMAC; DES/TDES ECB/CBC/OFB/CFB; операции PKA RSA/ECC/SM2 до 4096 бит; генерацию случайных чисел. Защита включает иерархию ключей, скремблирование всех типов DDR, защищённые OTP/отладку/DFT/ОС и программируемый защищённый/незащищённый режим ведущих устройств, кроме CPU. Часть ведомых доступна только защищённым ведущим, остальные допускают программируемый доступ обоих классов. Часть общей SRAM доступна только в защищённом режиме. DDR делится на 16 областей с настройкой доступа каждого ведущего. Три почтовых ящика связывают CPU и MCU; каждый содержит четыре элемента: слово данных, регистр команды и флаг прерывания. 32 программных регистра блокировки показывают занятость. Поддерживается распаковка GZIP, LZ4 (общий и старый форматы кадров), DEFLATE и ZLIB, проверка LZ4 Hash32 и ограничение размера результата для защиты памяти от злонамеренного повреждения.

## 1.2.4

Видеокодек. Декодирование в реальном времени поддерживает MPEG-1/2/4, H.263, H.264, H.265, VC-1, VP9, VP8, MVC и AV1; встроена MMU, при меньшем разрешении возможна параллельная многоканальная обработка. Следующие записи сохраняют профиль, уровень, разрешение и частоту оригинала, включая знак ②. Кодирование H.265/H.264 в реальном времени достигает 8K@30fps, с параллельной многоканальной работой при меньшем разрешении.

| Кодек | Формат | Разрешение |  |
| --- | --- | --- | --- |
| H.264 AVC/MVC Main10 L6.0 | 8K@30fps | 7680x4320 | ② |
| VP9 Profile0/2 L6.1 | 8K@60fps | 7680x4320 |  |
| H.265 HEVC/MVC Main10 L6.1 | 8K@60fps | 7680x4320 |  |
| AVS2 Profile0/2 L10.2.6 | 8K@60fps | 7680x4320 |  |
| AV1 Main Profile 8/10bit L5.3 | 4K@60fps | 3840x2160 |  |
| MPEG-2 MP | 1080p@60fps | 1920x1088 |  |
| MPEG-1 MP | 1080p@60fps | 1920x1088 |  |
| VC-1 AP level 3 | 1080p@60fps | 1920x1088 |  |
| VP8 version2 | 1080p@60fps | 1920x1088 |  |

## 1.2.5

JPEG-кодек. Кодирование использует базовый последовательный DCT, размеры 96x96–8192x8192 (67 млн пикселей), до 90 млн пикселей/с и четыре кодирующих блока. Декодирование: 48x48–65536x65536, YUV400/YUV411/YUV420/YUV422/YUV440/YUV444 и MJPEG, до 1080P@280fps и 560 млн пикселей/с. Под заголовком декодера источник также указывает четыре кодирующих блока; это сохранено как несогласованность оригинала, без скрытого исправления.

## 1.2.6

Нейропроцессор. Производительность ускорителя достигает 6 TOPS. Три ядра NPU работают совместно втроём, вдвоём либо независимо. Поддерживаются integer 4/8/16, float16, Bfloat16 и tf32. Внутренний буфер — 384KBx3; возможна параллельная работа задач и сценариев. Поддерживаются TensorFlow, Caffe, Tflite, Pytorch, Onnx NN и Android NN. Отдельный домен напряжения обеспечивает DVFS.

## 1.2.7

Графика. ARM Mali-G610 MP4 поддерживает OpenGLES 1.1/2.0/3.2, OpenCL 2.2 и Vulkan 1.2. Четыре шейдерных ядра используют общий иерархический тайлер; встроены MMU и L2 4x256KB. Используются Valhall, AFBC 1.3, отладка встроенного MCU через Serial Wire и отдельный домен DVFS. Вход 2D: ARGB/RGB888/RGB565/YUV420/YUV422/BPP; выход: ARGB/RGB888/RGB565/YUV420/YUV422. Максимальные размеры входа/выхода — 8192x8192/4096x4096. Поддерживаются блочная передача, прозрачность, градиентная/узорная заливка, глобальная и попиксельная альфа (цвет и альфа отдельно), затухание, произвольное нецелое масштабирование 1/8–8, поворот 0/90/180/270 градусов, отражение X/Y с поворотом, ROP2/ROP3/ROP4 и MMU со страницами 4k/64k. Улучшение изображения принимает планарный/полупланарный YUV420/YUV422 с перестановкой UV; выдаёт полупланарный YUV420/YUV422 с перестановкой UV и тайловым режимом; выполняет субдискретизацию 422→420 и деинтерлейсинг, обрабатывает динамические изображения до 1920x1080.

## 1.2.8

Видеовходы. Один комбинированный MIPI DPHY/CPHY поддерживает DPHY1.2 с четырьмя линиями по2.5Gbps либо CPHY1.1 с тремя трио по2.5Gsps. Четыре CSI DPHY1.2 имеют по две линии2.5Gbps; пары объединяются в четыре линии. Один DCPHY плюс четыре двухлинейных CSI DPHY дают пять камер; один DCPHY плюс два четырёхлинейных —три. Один стандартный DVP8/10/12/16 бит принимает до150MHz, BT.601/BT.656/BT.1120, с настраиваемой полярностью pixel_clk/hsync/vsync.

## 1.2.9

ISP. VICAP поддерживает BT601/BT656/BT1120, шесть интерфейсов MIPI CSI/DSI с четырьмя ID на каждый, RAW8/10/12/14 и YUV422, режимы HDR виртуальных каналов/идентификационных кодов/счётчика строк и сквозную передачу RAW в ISP0/1. Максимум: два ISP — 48M 8064x6048@15 либо 32M 6528x4898@30; один ISP — 16M 4672x3504@30. Обработка: статистика 3A (AE/гистограмма, AF, AWB), удаление фиксированного шума FPN, коррекция чёрного BLC, статических/динамических групп дефектных пикселей DPCC, фазовый автофокус PDAF, затенение объектива LSC, пространственное Bayer-2DNR и временное Bayer-3DNR подавление RAW-шума, коррекция хроматических аберраций CAC, HDR из трёх кадров, сжатие диапазона/тональное отображение DRC, дисбаланс зелёного GIC, адаптивная демозаика Debayer с коррекцией аберраций, матрицы CCM/CSM и RGB2YUV, выходная гамма, автоматическое удаление дымки/улучшение эффектов, пользовательская палитра 3DLUT, только горизонтальная коррекция дисторсии LDCH, пространственное YUV-2DNR, резкость/фильтрация границ, приватная маска CMSK, локальное усиление GAIN и совместное использование ISP несколькими датчиками. FEC принимает RASTER YUV422SP/YUV422I/YUV420SP и выдаёт такие же RASTER либо FBCE YUV422SP/YUV420SP. Плотности сетки 16x8/32x16, уменьшение до 4 раз, разрешение 128x128–4095x4095, бикубическая интерполяция Y и билинейная C.

## 1.2.10

Дисплейные интерфейсы. Один комбинированный HDMI/eDP TX поддерживают x1/x2/x4; HDMI и eDP одного интерфейса одновременно не работают. HDMI FRL: 3/6/8/10/12Gbps; eDP: 1.62/2.7/5.4Gbps. HDMI достигает 7680x4320@60Hz, eDP — 4K@60Hz. HDMI: RGB/YUV до 10 бит, DSC1.2a, HDCP2.3; eDP: RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 бит на компонент, HDCP1.3. Для HDMI рекомендуется CTA-861; нестандартные HSYNC/HBP/HFP желательно выравнивать по 4 пикселям. Один DP TX1.4a совмещены с USB3.1 Gen1: 1/2/4 линии, 1.62/2.7/5.4/8.1Gbps, до 7680x4320@30Hz, RGB/YUV до 10 бит, SST, Type-C DP Alt Mode, HDCP2.3/1.3. Рекомендуется CTA-861; минимум нестандартных HSYNC/HBP/HFP — 16 пикселей. Два MIPI поддерживают DPHY2.0 (4 линии до 4.5Gbps) либо CPHY1.1 (3 трио до 2.0Gsps), до 4K@60Hz, двойной левый/правый дисплей, RGB до 10 бит, DSC1.1/1.2a. Минимумы HSYNC/HBP/HFP — 4 пикселя; HTOTAL/HACTIVE обязательно кратны 4; HSYNC/HBP/HFP рекомендуется делать кратными 4 (в последней строке источника опечатка HYSNC). BT.1120: до 1920x1080@60Hz и 150MHz. BT.1120 также поддерживает RGB до8bit.

## 1.2.11

Процессор видеовыхода. Максимумы: Video Port0 — 7680x4320@60Hz, Port1 и Port2 — по 4096x4320@60Hz, Port3 — 2048x1080@60Hz. Cluster0/1/2/3: вход/выход 4096x4320, AFBCD, RGB/YUV/YUYV, масштаб 4–1/4 и поворот. ESMART0/1/2/3: вход/выход 4096x4320, RGB/YUV/YUYV, масштаб 8–1/8 и четыре области. Наложение в RGB/YUV объединяет до восьми слоёв (четыре Cluster+четыре ESMART). Постобработка: HDR10/HLG, HDR2SDR/SDR2HDR, 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Обратная запись: ARGB8888/RGB888/RGB565/YUV420 до 1920x1080. HACTIVE должен быть кратен 4 пикселям. При разделении, двухканальном MIPI или YUV420 параметры POST HSYNC/HBP/HFP должны быть кратны 2. В видеорежиме MIPI DSC минимумы POST HSYNC/HBP/HFP — 16 пикселей, DSC_SYS_CTRL HSYNC/HBP/HFP — 8.

## 1.2.12

Аудиоинтерфейсы. I2S0/I2S1 поддерживают до 8 TX и 8 RX. Оба: 16–32 бита, до 192kHz, программируемые ведущий/ведомый режимы, I2S обычный/с левым/правым выравниванием, PCM early/late1/late2/late3, TDM обычный, сдвиг влево на половину/один/два такта либо вправо. I2S/PCM/TDM одновременно не работают. I2S2/I2S3: по 2 TX и 2 RX, 16–32 бита, до 192kHz, ведущий/ведомый, те же три I2S и четыре PCM; одновременная работа I2S/PCM невозможна. SPDIF0/1 упаковывают два 16-битных отсчёта в одно 32-битное слово, выводят двухфазное стерео, выравнивают 16–31-битные данные влево/вправо в 32-битном буфере, передают линейный PCM 16/20/24 бит и нелинейный PCM. PDM0/1: до 8 каналов, 16–24 бита, до 192kHz, ведущий режим приёма. Цифровой кодек имеет два цифровых DAC, I2S/PCM ведущий/ведомый, 16-битные отсчёты, три режима смешивания каждого DAC и регулировку громкости. VAD читает I2S/PDM, обнаруживает амплитуду речи, сохраняет данные микрофонной решётки и формирует объединённое прерывание по уровню.

## 1.2.13

Связь. SDIO соответствует SDIO3.0, шина 4 бита. Один GMAC поддерживает RGMII 10/100/1000Mbps и RMII 10/100Mbps, полный/полудуплекс. USB3.1 Gen1 эквивалентен USB3.2 Gen1 и USB3.0, до 5Gbps. Один OTG USB3OTG_0 совмещён с DP TX; один Host USB3OTG_2 — с PIPE PHY2. Совместимость: USB3.0 revision1.0, USB2.0 кроме USB3OTG_2, xHCI1.1. Передачи: управляющие, пакетные со streams, прерывания и изохронные; возможны одновременные IN/OUT. Кэширование дескрипторов и предвыборка данных улучшают работу при больших задержках. Энергосбережение: USB2.0 LPM кроме USB3OTG_2 и USB3.1 U0/U1/U2/U3. Режим устройства: до 10 IN и 6 OUT оконечных точек, включая в обоих числах управляющую точку0; до 16 ресурсов передачи, по одному на точку; гибкая настройка для приложений/USB set-configuration; аппаратная обработка ERDY и пакетов burst; потоковые bulk-точки с автоматическим запуском перемещения данных; изохронные точки с буферами; гибкие дескрипторы с регулированием буферных прерываний, несколькими передачами, изохронными/управляющими передачами и разрозненными буферами. Хост xHCI: до 64 устройств, один источник прерываний, один USB2.0-порт кроме USB3OTG_2, один SuperSpeed-порт, стандартные/открытые драйверы xHCI и классов. DRD: фиксированные режимы устройства/хоста, USB3.1/USB2.0 OTG A/B по ID; USB3OTG_2 поддерживает только USB3.1 Gen1. SRP/HNP/RSP не поддерживаются. USB2.0 PHY определяет зарядку батареи; USB3OTG_0 поддерживают Type-C/DP Alt Mode; PHY USB3OTG_2 разделяется с PCIe/SATA. Два USB2.0-хоста поддерживают USB2.0, высокую/полную/низкую скорость 480/12/1.5Mbps и EHCI1.0/OHCI1.0a. Два Combo PIPE PHY работают с PCIe2.1/SATA3.0/USB3.1: PHY0 выбирает SATA либо PCIe2.1, PHY2 — SATA, PCIe2.1 либо USB3.1 Gen1. Каждый PCIe2.1: одна линия 5Gbps, PCI Express Base2.1, только RC. Каждый SATA: один порт 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. Предусмотрены пять контроллеров SPI (SPI0–SPI4). Поддерживаются два сигнала выбора и программируемый ведущий/ведомый SPI. Девять I2C0–I2C8 поддерживают адреса 7/10 бит и программируемую частоту до 100kbit/s Standard-mode либо 400kbit/s Fast-mode. Десять UART0–UART9 имеют раздельные FIFO TX/RX по 64 байта, передают/принимают 5/6/7/8 бит, поддерживают старт/стоп/чётность, различные входные такты для скорости до 4Mbps и автоматическое управление потоком на всех UART.

## 1.2.14

Прочие функции. Несколько групп GPIO поддерживают прерывание на каждом выводе, запуск по уровню/фронту, настройку полярности уровня, восходящего/нисходящего/обоих фронтов, слабой подтяжки вверх/вниз и силы драйвера. TS-ADC работает в пользовательском и автоматическом режимах. В пользовательском режиме start_of_conversion полностью управляется программно либо формируется аппаратно. Автоматический режим допускает настройку порогов прерываний высокой/низкой температуры и температуры сброса системы. Семь каналов имеют независимые температурные критерии; диапазон −40–125°C, разрешение 1°C. SARADC: 12 бит, до 1MS/s, шесть несимметричных входов. OTP: 32Kbit, верхнее адресное пространство 4k не защищено (обозначение источника сохранено). Защищённый режим поддерживает маски слов чтения/программирования; максимум программирования 32 бита, чтения 16 слов; состояния доступны для чтения, адрес неудачного программирования записывается. Корпус FCCSP1253L: 17mm x 17mm, диаметр шарика 0.26mm, шаг 0.4mm.

## 1.3 Блок-схема

![1-1. Блок-схема (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-1-1.png)

1-1. Блок-схема (английский оригинал).

Дополнительные подписи: общая память 1MB, шесть PVTM, два SPDIF с пометкой «8ch», системные регистры, SRAM/ROM/OTP. На схеме указано SD3.0/MMC4.5, в §1.2.2 — MMC4.51; различие сохранено.

## 2. Корпус

### 2.1 Заказ

RK3588S2 и RK3588S2-DV: процессоры приложений RoHS FCCSP1253L, 900pcs в лотке. DV поддерживает Dolby Vision и Dolby Audio; это не гарантия для других вариантов.

### 2.2 Маркировка

Rockchip —марка; RKXXXX —чип; ABC —подрядчик; XXXXXX —партия кристаллов; DEFG —дата; NXXXXXX FXX —подпартия OSAT. Точка отмечает вывод1. На изображении даты YYWW, в легенде DEFG; оба обозначения сохранены.

![2-1. Маркировка корпуса (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-1.png)

2-1. Маркировка корпуса (английский оригинал).

![2-2. Маркировка корпуса (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-2.png)

2-2. Маркировка корпуса (английский оригинал).

### 2.3 Размеры

Источник дважды использует номер2-4 для вида снизу/сбоку; имена файлов различают их. Размеры сохранены в мм/дюймах.

![2-3. Вид корпуса сверху (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-3.png)

2-3. Вид корпуса сверху (английский оригинал).

![2-4-bottom. Вид корпуса снизу (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-4-bottom.png)

2-4-bottom. Вид корпуса снизу (английский оригинал).

![2-4-side. Вид корпуса сбоку (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-4-side.png)

2-4-side. Вид корпуса сбоку (английский оригинал).

![2-5. Размеры корпуса (английский оригинал).](/docs/rockchip-rk3588s2-datasheet/images/figure-2-5.png)

2-5. Размеры корпуса (английский оригинал).

| Обозначение | mm Минимум | mm Nom | mm Максимум | дюйм Минимум | дюйм Nom | дюйм Максимум |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.163 | 1.240 | 1.317 | 0.046 | 0.049 | 0.052 |
| A1 | 0.120 | 0.170 | 0.220 | 0.005 | 0.007 | 0.009 |
| A2 | 1.012 | 1.070 | 1.128 | 0.040 | 0.042 | 0.044 |
| A3 | 0.570 | 0.600 | 0.630 | 0.022 | 0.024 | 0.025 |
| c | 0.420 | 0.470 | 0.520 | 0.017 | 0.019 | 0.020 |
| D | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| E | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| D1 | — | 16.400 | — | — | 0.646 | — |
| E1 | — | 16.400 | — | — | 0.646 | — |
| e | — | 0.400 | — | — | 0.016 | — |
| b | 0.210 | 0.260 | 0.310 | 0.008 | 0.010 | 0.012 |
| aaa |  | 0.100 |  |  | 0.004 |  |
| ccc |  | 0.150 |  |  | 0.006 |  |
| ddd |  | 0.130 |  |  | 0.005 |  |
| eee |  | 0.150 |  |  | 0.006 |  |
| fff |  | 0.050 |  |  | 0.002 |  |
| MD/ME |  | 42/42 |  |  |  |  |

### 2.4–2.5 Влага и покрытие

Уровень MSL3; покрытие/шарики SnAgCu.

### 2.6 Выводы

Все1253 вывода сохранены. Разорванные имена соединены; суффиксы и альтернативные функции неизменны.

| Имя вывода | Вывод | Имя вывода | Вывод |
| --- | --- | --- | --- |
| VSS_1 | A1 | AVSS_98 | AY9 |
| VSS_2 | A2 | DDR_CH0_DQS0N_B | B1 |
| DDR_CH1_DQS1P_C | A3 | DDR_CH0_DQS0P_B | B2 |
| DDR_CH1_DQS1N_C | A4 | VSS_4 | B3 |
| DDR_CH1_ZQ_C | A5 | VSS_5 | B5 |
| DDR_CH1_WCK1N_C | A6 | DDR_CH1_WCK1P_C | B6 |
| DDR_CH1_A3_C | A7 | DDR_CH1_A6_C | B7 |
| DDR_CH1_DQS0P_C | A9 | VSS_6 | B8 |
| DDR_CH1_A4_C | A10 | DDR_CH1_DQS0N_C | B9 |
| DDR_CH1_DQ10_C | A12 | VSS_7 | B10 |
| DDR_CH1_LP4/4X_CKE1/LP5_CS1_C | A13 | VSS_8 | B11 |
| DDR_CH1_A5_C | A15 | DDR_CH1_DQ9_C | B12 |
| DDR_CH1_DQ14_C | A16 | DDR_CH1_RESET_C | B13 |
| DDR_CH1_LP4/4X_CKE0/LP5_CS0_C | A18 | VSS_9 | B14 |
| DDR_CH1_LP4/4X_CS1_C | A19 | DDR_CH1_LP4/4X_CS0_C | B15 |
| DDR_CH1_DQ2_C | A20 | DDR_CH1_DQ15_C | B16 |
| DDR_CH1_A1_C | A21 | VSS_10 | B17 |
| DDR_CH1_LP4/4X_CS1_D | A23 | DDR_CH1_A0_C | B18 |
| DDR_CH1_DQ0_D | A24 | VSS_11 | B19 |
| DDR_CH1_A0_D | A26 | DDR_CH1_DQ0_C | B20 |
| DDR_CH1_A1_D | A27 | VSS_12 | B21 |
| DDR_CH1_DQ3_D | A28 | DDR_CH1_A2_C | B22 |
| DDR_CH1_A2_D | A30 | VSS_13 | B23 |
| DDR_CH1_LP4/4X_CKE1/LP5_CS1_D | A31 | DDR_CH1_DQ2_D | B24 |
| DDR_CH1_DQ15_D | A32 | DDR_CH1_RESET_D | B25 |
| DDR_CH1_A6_D | A33 | VSS_14 | B26 |
| DDR_CH1_LP4/4X_CKE0/LP5_CS0_D | A35 | VSS_15 | B27 |
| DDR_CH1_A3_D | A36 | DDR_CH1_DQ5_D | B28 |
| DDR_CH1_WCK1P_D | A37 | VSS_16 | B29 |
| DDR_CH1_A5_D | A38 | DDR_CH1_LP4/4X_CS0_D | B30 |
| DDR_CH1_WCK0N_D | A39 | VSS_17 | B31 |
| DDR_CH1_ZQ_D | A40 | DDR_CH1_DQ12_D | B32 |
| DDR_CH1_DQS0N_D | A41 | DDR_CH1_A4_D | B33 |
| VSS_3 | A42 | VSS_18 | B34 |
| DDR_CH0_CKB_A | AA1 | VSS_19 | B35 |
| DDR_CH0_CK_A | AA2 | VSS_20 | B36 |
| VSS_296 | AA3 | DDR_CH1_WCK1N_D | B37 |
| DDR_CH0_DQ1_B | AA5 | VSS_21 | B38 |
| VSS_297 | AA6 | DDR_CH1_WCK0P_D | B39 |
| VSS_298 | AA7 | VSS_22 | B40 |
| VSS_299 | AA8 | DDR_CH1_DQS0P_D | B41 |
| VSS_300 | AA9 | VSS_23 | B42 |
| VSS_301 | AA10 | HDMI_TX0_SBDP/EDP_TX0_AUXP | BA1 |
| VSS_302 | AA11 | HDMI_TX0_D3P/EDP_TX0_D3P | BA2 |
| VSS_303 | AA12 | AVSS_116 | BA3 |
| DDR_CH0_PLL_AVSS | AA14 | HDMI_TX0_D0N/EDP_TX0_D0N | BA4 |
| VSS_304 | AA19 | HDMI_TX0_D1P/EDP_TX0_D1P | BA5 |
| VSS_305 | AA22 | AVSS_117 | BA6 |
| VSS_306 | AA23 | HDMI_TX0_D2N/EDP_TX0_D2N | BA7 |
| PLL_AVSS | AA26 | TYPEC0_SBU1/DP0_AUXP | BA8 |
| VDD_CPU_LIT_MEM_1 | AA28 | AVSS_118 | BA9 |
| VDD_CPU_LIT_MEM_2 | AA29 | TYPEC0_SSRX1N/DP0_TX0N | BA10 |
| VDD_CPU_LIT_MEM_3 | AA30 | TYPEC0_SSTX1N/DP0_TX1N | BA11 |
| VSS_307 | AA31 | AVSS_119 | BA12 |
| VSS_308 | AA37 | TYPEC0_SSRX2N/DP0_TX2N | BA13 |
| VSS_309 | AA38 | TYPEC0_SSTX2N/DP0_TX3N | BA14 |
| VSS_310 | AA39 | AVSS_120 | BA15 |
| VSS_311 | AA40 | MIPI_DPHY1_TX_D0N/MIPI_CPHY1_TX_TRIO0_A | BA16 |
| EMMC_D2/FSPI_D2_M0/GPIO2_D2_u | AA41 | MIPI_DPHY1_TX_D1P/MIPI_CPHY1_TX_TRIO1_A | BA17 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3_u | AA42 | AVSS_121 | BA18 |
| VSS_312 | AB2 | MIPI_DPHY1_TX_CLKN/MIPI_CPHY1_TX_TRIO1_B | BA19 |
| DDR_CH0_DQ3_A | AB3 | MIPI_DPHY1_TX_D2P/MIPI_CPHY1_TX_TRIO2_B | BA20 |
| DDR_CH0_DQ1_A | AB4 | AVSS_122 | BA21 |
| DDR_CH0_DQ4_A | AB5 | MIPI_DPHY1_TX_D3N/MIPI_CPHY1_TX_TRIO2_C | BA22 |
| VSS_313 | AB6 | MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B | BA23 |
| VSS_314 | AB9 | AVSS_123 | BA24 |
| VSS_315 | AB10 | MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C | BA25 |
| VSS_316 | AB11 | MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C | BA26 |
| VSS_317 | AB12 | AVSS_124 | BA27 |
| DDR_CH0_PLL_DVDD | AB14 | MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A | BA28 |
| VSS_318 | AB19 | MIPI_DPHY1_RX_D3P/NO_USE | BA29 |
| VSS_319 | AB20 | AVSS_125 | BA30 |
| VSS_320 | AB21 | MIPI_DPHY0_TX_D0N/MIPI_CPHY0_TX_TRIO0_A | BA31 |
| VSS_321 | AB22 | MIPI_DPHY0_TX_D1P/MIPI_CPHY0_TX_TRIO1_A | BA32 |
| VSS_322 | AB23 | AVSS_126 | BA33 |
| VSS_323 | AB24 | MIPI_DPHY0_TX_CLKN/MIPI_CPHY0_TX_TRIO1_B | BA34 |
| PLL_AVDD1V8 | AB25 | MIPI_DPHY0_TX_D2P/MIPI_CPHY0_TX_TRIO2_B | BA35 |
| VDD_CPU_LIT_1 | AB31 | AVSS_127 | BA36 |
| VSS_324 | AB32 | MIPI_DPHY0_TX_D3N/MIPI_CPHY0_TX_TRIO2_C | BA37 |
| VSS_325 | AB33 | MIPI_CSI0_D0P | BA38 |
| VSS_326 | AB34 | MIPI_CSI0_D1P | BA40 |
| EMMCIO_1V8_1 | AB35 | MIPI_CSI0_CLK0N | BA41 |
| VSS_327 | AB36 | MIPI_CSI0_D2N | BA42 |
| VSS_328 | AB37 | AVSS_128 | BB1 |
| VSS_329 | AB38 | HDMI_TX0_D3N/EDP_TX0_D3N | BB2 |
| VSS_330 | AB39 | HDMI_TX0_D0P/EDP_TX0_D0P | BB4 |
| VSS_331 | AB40 | HDMI_TX0_D1N/EDP_TX0_D1N | BB5 |
| EMMC_CLKOUT/GPIO2_A1_d | AB41 | HDMI_TX0_D2P/EDP_TX0_D2P | BB7 |
| EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4_u | AB42 | TYPEC0_SBU2/DP0_AUXN | BB8 |
| DDR_CH0_LP4/4X_CS1_A | AC1 | TYPEC0_SSRX1P/DP0_TX0P | BB10 |
| DDR_CH0_A1_A | AC2 | TYPEC0_SSTX1P/DP0_TX1P | BB11 |
| VSS_332 | AC3 | TYPEC0_SSRX2P/DP0_TX2P | BB13 |
| VSS_333 | AC4 | TYPEC0_SSTX2P/DP0_TX3P | BB14 |
| VSS_334 | AC5 | MIPI_DPHY1_TX_D0P/MIPI_CPHY1_TX_TRIO0_B | BB16 |
| VSS_335 | AC6 | MIPI_DPHY1_TX_D1N/MIPI_CPHY1_TX_TRIO0_C | BB17 |
| VDD_VDENC_6 | AC16 | MIPI_DPHY1_TX_CLKP/MIPI_CPHY1_TX_TRIO1_C | BB19 |
| VSS_336 | AC17 | MIPI_DPHY1_TX_D2N/MIPI_CPHY1_TX_TRIO2_A | BB20 |
| VSS_337 | AC18 | MIPI_DPHY1_TX_D3P/NO_USE | BB22 |
| VSS_338 | AC22 | MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A | BB23 |
| VSS_339 | AC23 | MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A | BB25 |
| VSS_340 | AC24 | MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B | BB26 |
| VSS_341 | AC25 | MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B | BB28 |
| VSS_342 | AC26 | MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C | BB29 |
| VDD_CPU_LIT_2 | AC27 | MIPI_DPHY0_TX_D0P/MIPI_CPHY0_TX_TRIO0_B | BB31 |
| VDD_CPU_LIT_3 | AC28 | MIPI_DPHY0_TX_D1N/MIPI_CPHY0_TX_TRIO0_C | BB32 |
| VDD_CPU_LIT_4 | AC29 | MIPI_DPHY0_TX_CLKP/MIPI_CPHY0_TX_TRIO1_C | BB34 |
| VDD_CPU_LIT_5 | AC30 | MIPI_DPHY0_TX_D2N/MIPI_CPHY0_TX_TRIO2_A | BB35 |
| VDD_CPU_LIT_6 | AC31 | MIPI_DPHY0_TX_D3P/NO_USE | BB37 |
| VCCIO5_1 | AC33 | MIPI_CSI0_D0N | BB38 |
| VCCIO5_2 | AC34 | MIPI_CSI0_CLK0P | BB41 |
| EMMCIO_1V8_2 | AC35 | AVSS_129 | BB42 |
| SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0_z | AC37 | DDR_CH0_ZQ_B | C1 |
| SDMMC_DET/GPIO0_A4_u | AC38 | VSS_24 | C2 |
| TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1_z | AC39 | DDR_CH0_WCK0N_B | C3 |
| EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2_d | AC40 | DDR_CH0_WCK0P_B | C4 |
| VSS_343 | AC41 | VSS_25 | C6 |
| DDR_CH0_LP4/4X_CKE1/LP5_CS1_A | AD1 | VSS_26 | C7 |
| VSS_344 | AD2 | DDR_CH1_WCK0P_C | C8 |
| VSS_345 | AD3 | VSS_27 | C9 |
| VSS_346 | AD5 | DDR_CH1_DQ11_C | C10 |
| VSS_347 | AD6 | VSS_28 | C11 |
| VSS_348 | AD8 | VSS_29 | C12 |
| VSS_349 | AD9 | DDR_CH1_DQ12_C | C13 |
| VSS_350 | AD10 | VSS_30 | C14 |
| VSS_351 | AD11 | VSS_31 | C15 |
| VSS_352 | AD12 | DDR_CH1_DQ5_C | C16 |
| VSS_353 | AD13 | DDR_CH1_DQ4_C | C17 |
| VSS_354 | AD14 | VSS_32 | C18 |
| VDD_VDENC_7 | AD15 | VSS_33 | C19 |
| VSS_355 | AD19 | VSS_34 | C20 |
| VSS_356 | AD20 | DDR_CH1_CK_C | C21 |
| VSS_357 | AD22 | VSS_35 | C22 |
| VSS_358 | AD23 | DDR_CH1_CK_D | C23 |
| VSS_359 | AD24 | VSS_36 | C24 |
| VSS_360 | AD25 | DDR_CH1_DQ1_D | C25 |
| VDD_CPU_LIT_7 | AD26 | VSS_37 | C26 |
| VDD_CPU_LIT_8 | AD27 | DDR_CH1_DQ6_D | C27 |
| CLK32K_IN/CLK32K_OUT0/GPIO0_B2_u | AD38 | VSS_38 | C28 |
| PMIC_SLEEP2/GPIO0_A3_d | AD39 | DDR_CH1_DQ7_D | C29 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3_d | AD40 | VSS_39 | C30 |
| EMMC_D6/FSPI_CS0N_M0/GPIO2_D6_u | AD41 | DDR_CH1_DQ14_D | C32 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5_u | AD42 | DDR_CH1_DM1_D | C33 |
| DDR_CH0_DM0_A | AE1 | DDR_CH1_DQ13_D | C34 |
| DDR_CH0_DQ6_A | AE2 | VSS_40 | C35 |
| DDR_CH0_DQ5_A | AE5 | DDR_CH1_DQS1N_D | C36 |
| VSS_361 | AE6 | VSS_41 | C37 |
| VSS_362 | AE7 | VSS_42 | C39 |
| VSS_363 | AE8 | AVSS_1 | C41 |
| VSS_364 | AE9 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | C42 |
| VSS_365 | AE10 | DDR_CH0_A3_B | D2 |
| VSS_366 | AE11 | VSS_43 | D3 |
| VSS_367 | AE12 | VSS_44 | D4 |
| VSS_368 | AE13 | VSS_45 | D7 |
| VSS_369 | AE14 | DDR_CH1_WCK0N_C | D8 |
| VSS_370 | AE15 | DDR_CH1_DQ8_C | D10 |
| VSS_371 | AE16 | VSS_46 | D11 |
| VSS_372 | AE19 | DDR_CH1_DM1_C | D13 |
| VSS_373 | AE20 | VSS_47 | D14 |
| VSS_374 | AE22 | VSS_48 | D15 |
| VSS_375 | AE23 | DDR_CH1_DQ7_C | D16 |
| VSS_376 | AE24 | DDR_CH1_DQ6_C | D17 |
| VSS_377 | AE25 | VSS_49 | D18 |
| VSS_378 | AE26 | VSS_50 | D19 |
| VDD_CPU_LIT_9 | AE27 | DDR_CH1_CKB_C | D21 |
| VSS_379 | AE38 | VSS_51 | D22 |
| VSS_380 | AE39 | DDR_CH1_CKB_D | D23 |
| VSS_381 | AE40 | DDR_CH1_DQ4_D | D25 |
| EMMC_D7/FSPI_CS1N_M0/GPIO2_D7_u | AE41 | VSS_52 | D26 |
| EMMC_CMD/FSPI_CLK_M0/GPIO2_A0_u | AE42 | DDR_CH1_DM0_D | D27 |
| DDR_CH0_A2_A | AF1 | DDR_CH1_DQ9_D | D29 |
| VSS_382 | AF2 | VSS_53 | D30 |
| DDR_CH0_DQ7_A | AF3 | VSS_54 | D31 |
| DDR_CH0_DQ14_A | AF4 | VSS_55 | D32 |
| DDR_CH0_DQ15_A | AF5 | DDR_CH1_DQ8_D | D34 |
| VSS_383 | AF6 | DDR_CH1_DQS1P_D | D36 |
| VSS_384 | AF7 | VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2_d | D38 |
| VSS_385 | AF8 | SPI2_CLK_M0/GPIO1_A6_d | D39 |
| VSS_386 | AF9 | UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5_u | D40 |
| VSS_387 | AF10 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | D41 |
| VDD_LOGIC_5 | AF12 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | D42 |
| VDD_LOGIC_6 | AF13 | DDR_CH0_A4_B | E1 |
| VSS_388 | AF16 | VSS_56 | E2 |
| VSS_389 | AF17 | DDR_CH0_WCK1P_B | E3 |
| VSS_390 | AF19 | DDR_CH0_WCK1N_B | E4 |
| VSS_391 | AF20 | VSS_57 | E5 |
| VSS_392 | AF21 | VSS_58 | E6 |
| VSS_393 | AF26 | VSS_59 | E8 |
| VSS_394 | AF27 | VSS_60 | E9 |
| VSS_395 | AF28 | VSS_61 | E10 |
| VSS_396 | AF29 | VSS_62 | E12 |
| VSS_397 | AF30 | DDR_CH1_DQ13_C | E13 |
| VSS_398 | AF31 | VSS_63 | E16 |
| VSS_399 | AF32 | DDR_CH1_DM0_C | E17 |
| VSS_400 | AF33 | VSS_64 | E18 |
| VSS_401 | AF34 | VSS_65 | E19 |
| RESERVED | AF35 | DDR_CH1_DQ1_C | E20 |
| VCCIO5_1V8 | AF36 | VSS_66 | E21 |
| VSS_402 | AF37 | VSS_67 | E23 |
| VSS_403 | AF38 | VSS_68 | E25 |
| VSS_404 | AF39 | VSS_69 | E27 |
| VSS_405 | AF40 | DDR_CH1_DQ10_D | E29 |
| VSS_406 | AF41 | VSS_70 | E30 |
| DDR_CH0_RESET_A | AG1 | VSS_71 | E31 |
| DDR_CH0_A5_A | AG2 | DDR_CH1_DQ11_D | E32 |
| VSS_407 | AG3 | VSS_72 | E33 |
| VSS_408 | AG4 | VSS_73 | E34 |
| VSS_409 | AG5 | VSS_74 | E37 |
| VSS_410 | AG6 | VSS_75 | E38 |
| VSS_411 | AG7 | VSS_76 | E39 |
| VSS_412 | AG8 | AVSS_2 | E40 |
| VSS_413 | AG15 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | E41 |
| VSS_414 | AG16 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_B | F1 |
| VSS_415 | AG17 | VSS_77 | F2 |
| VSS_416 | AG18 | VSS_78 | F3 |
| VSS_417 | AG19 | VSS_79 | F4 |
| VSS_418 | AG20 | VSS_80 | F8 |
| VSS_419 | AG21 | VSS_81 | F9 |
| VSS_420 | AG22 | VSS_82 | F10 |
| VSS_421 | AG23 | VSS_83 | F13 |
| VSS_422 | AG24 | VSS_84 | F14 |
| VSS_423 | AG25 | VSS_85 | F15 |
| VSS_424 | AG28 | VSS_86 | F16 |
| VSS_425 | AG29 | VSS_87 | F19 |
| VSS_426 | AG31 | DDR_CH1_DQ3_C | F20 |
| VSS_427 | AG32 | VSS_88 | F21 |
| VSS_428 | AG33 | VSS_89 | F23 |
| VSS_429 | AG34 | VSS_90 | F29 |
| VSS_430 | AG35 | VSS_91 | F31 |
| PMIC_SLEEP4/GPIO0_C2_d | AG36 | VSS_92 | F33 |
| LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3_u | AG37 | VSS_93 | F34 |
| I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/PWM4_M0/GPIO0_C5_u | AG38 | VSS_94 | F35 |
| I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/GPIO0_D0_d | AG39 | VSS_95 | F36 |
| VSS_431 | AG40 | MIPI_CAMERA2_CLK_M0/SPDIF1_TX_M0/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7_u | F37 |
| I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/SPI3_MOSI_M2/GPIO0_D2_u | AG41 | VSS_96 | F38 |
| PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6_d | AG42 | VSS_97 | F39 |
| VSS_432 | AH2 | AVSS_3 | F40 |
| VSS_433 | AH3 | PCIE20_2_REFCLKP | F41 |
| VSS_435 | AH5 | PCIE20_2_REFCLKN | F42 |
| VSS_436 | AH7 | DDR_CH0_DM1_B | G2 |
| VSS_437 | AH8 | VSS_98 | G3 |
| VSS_438 | AH9 | DDR_CH0_DQ10_B | G4 |
| VSS_439 | AH10 | DDR_CH0_DQ8_B | G5 |
| VDD_LOGIC_7 | AH11 | VSS_99 | G6 |
| VDD_LOGIC_8 | AH12 | VSS_100 | G8 |
| VDD_LOGIC_9 | AH13 | VSS_101 | G9 |
| VDD_LOGIC_10 | AH14 | VSS_102 | G10 |
| VDD_LOGIC_11 | AH15 | VSS_103 | G12 |
| VSS_440 | AH16 | VSS_104 | G20 |
| VSS_441 | AH17 | VSS_105 | G21 |
| VDD_GPU_1 | AH18 | VSS_106 | G22 |
| VDD_GPU_2 | AH19 | DDR_CH1_VDDQ_CKE | G24 |
| VDD_GPU_3 | AH20 | VSS_107 | G25 |
| VDD_GPU_4 | AH21 | VSS_108 | G26 |
| VDD_LOGIC_12 | AH23 | VCCIO4_1V8_1 | G27 |
| VDD_LOGIC_13 | AH24 | VCCIO4_1V8_2 | G28 |
| VDD_NPU_MEM_1 | AH25 | VSS_109 | G29 |
| VDD_NPU_MEM_2 | AH26 | VCCIO4 | G31 |
| VSS_442 | AH28 | PCIE20_SATA30_0_AVDD_1V8 | G34 |
| VSS_443 | AH29 | AVSS_4 | G36 |
| VSS_444 | AH36 | SPI2_MISO_M0/GPIO1_A4_d | G37 |
| TSADC_TEST_OUT_TS | AH37 | MIPI_CAMERA4_CLK_M0/I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7_u | G38 |
| PMIC_SLEEP5/GPIO0_C3_d | AH38 | PDM1_SDI2_M1/SPI0_MISO_M2/GPIO1_B1_d | G39 |
| I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE20X1_1_CLKREQN_M0/GPIO0_B5_d | AH39 | PCIE20X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0_d | G40 |
| VSS_434 | AH4 | AVSS_5 | G41 |
| I2S1_SCLK_TX_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE20X1_1_WAKEN_M0/GPIO0_B6_d | AH40 | DDR_CH0_A6_B | H1 |
| I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/SPI0_CS0_M0/HDMI_TX0_CEC_M1/GPIO0_D1_u | AH41 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_B | H2 |
| I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/SATA_CP_POD/GPIO0_C6_u | AH42 | VSS_110 | H3 |
| DDR_CH0_DQ2_A | AJ1 | VSS_111 | H4 |
| DDR_CH0_DQ0_A | AJ2 | VSS_112 | H5 |
| DDR_CH0_DQ12_A | AJ3 | VSS_113 | H6 |
| VSS_445 | AJ5 | VSS_114 | H11 |
| DDR_CH0_DQ11_A | AJ6 | VSS_115 | H12 |
| VSS_446 | AJ7 | DDR_CH1_VDDQ_1 | H14 |
| VSS_447 | AJ8 | DDR_CH1_VDDQ_2 | H15 |
| VSS_448 | AJ9 | DDR_CH1_VDDQ_3 | H16 |
| VSS_449 | AJ10 | DDR_CH1_VDDQ_4 | H18 |
| VSS_450 | AJ11 | DDR_CH1_VDDQ_5 | H20 |
| VSS_451 | AJ12 | VSS_116 | H22 |
| VDD_LOGIC_14 | AJ15 | DDR_CH1_VDDQ_CK | H24 |
| VSS_452 | AJ16 | VSS_117 | H25 |
| VDD_GPU_MEM_1 | AJ18 | VDD_LOGIC_1 | H27 |
| VDD_GPU_5 | AJ19 | VSS_118 | H29 |
| VDD_GPU_6 | AJ20 | VCCIO1_1V8 | H31 |
| VDD_GPU_7 | AJ21 | PCIE20_SATA30_USB30_2_AVDD_1V8 | H34 |
| VDD_NPU_MEM_3 | AJ25 | PCIE20_SATA30_0_AVDD_0V85 | H36 |
| VSS_453 | AJ26 | AVSS_6 | H37 |
| VSS_454 | AJ27 | PDM1_SDI0_M1/PCIE20X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7_u | H38 |
| VSS_455 | AJ28 | PDM1_SDI1_M1/SPI2_CS1_M0/GPIO1_B0_u | H39 |
| VSS_456 | AJ29 | AVSS_7 | H40 |
| VSS_457 | AJ30 | PCIE20_0_TXP/SATA30_0_TXP | H41 |
| VDD_LOGIC_15 | AJ31 | PCIE20_0_TXN/SATA30_0_TXN | H42 |
| VDD_LOGIC_16 | AJ32 | DDR_CH0_LP4/4X_CS0_B | J1 |
| VCCIO6_1V8 | AJ34 | VSS_119 | J2 |
| VSS_458 | AJ35 | DDR_CH0_DQ9_B | J3 |
| PMU_0V75_1 | AJ36 | DDR_CH0_DQ11_B | J4 |
| PMU_0V75_2 | AJ37 | DDR_CH0_DQ14_B | J5 |
| VSS_459 | AJ38 | VSS_120 | J6 |
| VSS_460 | AJ39 | VSS_121 | J7 |
| VSS_461 | AJ40 | VSS_122 | J8 |
| VSS_462 | AJ41 | VSS_123 | J9 |
| DDR_CH0_LP4/4X_CKE0/LP5_CS0_A | AK1 | VSS_124 | J10 |
| VSS_463 | AK2 | VSS_125 | J12 |
| DDR_CH0_DQ13_A | AK3 | VSS_126 | J14 |
| DDR_CH0_DM1_A | AK4 | VSS_127 | J15 |
| DDR_CH0_DQ8_A | AK5 | VSS_128 | J16 |
| VSS_464 | AK6 | DDR_CH1_VDD_1 | J18 |
| VSS_465 | AK7 | DDR_CH1_VDD_MIF_1 | J20 |
| NC | AK9 | VSS_129 | J22 |
| VCCIO2 | AK10 | VSS_130 | J24 |
| VCCIO2_1V8 | AK11 | VSS_131 | J26 |
| HDMI/eDP_TX0_VDD_IO_1V8 | AK12 | VDD_LOGIC_2 | J27 |
| VDD_LOGIC_17 | AK15 | VSS_132 | J29 |
| VSS_466 | AK16 | VSS_133 | J30 |
| VDD_GPU_MEM_2 | AK18 | VSS_134 | J31 |
| VDD_GPU_8 | AK21 | PCIE20_SATA30_USB30_2_AVDD_0V85 | J36 |
| VSS_467 | AK22 | AVSS_8 | J38 |
| VDD_NPU_MEM_4 | AK25 | AVSS_9 | J39 |
| VSS_468 | AK26 | AVSS_10 | J40 |
| VDD_NPU_1 | AK27 | PCIE20_0_RXN/SATA30_0_RXN | J41 |
| VDD_NPU_2 | AK28 | PCIE20_0_RXP/SATA30_0_RXP | J42 |
| VDD_NPU_3 | AK29 | DDR_CH0_DQS1P_B | K1 |
| VSS_469 | AK30 | DDR_CH0_DQS1N_B | K2 |
| I2S1_LRCK_TX_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE20X1_1_PERSTN_M0/GPIO0_B7_d | AK39 | VSS_135 | K3 |
| VSS_470 | AK40 | VSS_136 | K6 |
| MIPI_CSI1_D1P | AK41 | VSS_137 | K7 |
| MIPI_CSI1_D1N | AK42 | DDR_CH0_VDDQ_CK_1 | K9 |
| DDR_CH0_A3_A | AL2 | VSS_138 | K10 |
| VSS_471 | AL3 | VSS_139 | K11 |
| VSS_472 | AL4 | VSS_140 | K12 |
| VSS_473 | AL5 | VSS_141 | K14 |
| HDMI/eDP_TX0_VDD_CMN_1V8 | AL14 | VSS_142 | K17 |
| AVSS_24 | AL15 | DDR_CH1_VDD_2 | K18 |
| VSS_474 | AL16 | DDR_CH1_VDD_MIF_2 | K20 |
| VDD_GPU_MEM_3 | AL18 | VSS_143 | K22 |
| VDD_GPU_9 | AL21 | VSS_144 | K23 |
| VSS_475 | AL22 | VSS_145 | K25 |
| VDD_NPU_4 | AL28 | VSS_146 | K26 |
| VDD_NPU_5 | AL29 | VDD_CPU_BIG0_MEM_1 | K27 |
| VDD_NPU_6 | AL30 | VDD_CPU_BIG0_MEM_2 | K28 |
| VDD_LOGIC_18 | AL31 | VDD_CPU_BIG0_MEM_3 | K29 |
| VCCIO6_1 | AL33 | VDD_CPU_BIG0_MEM_4 | K30 |
| VSS_476 | AL35 | VSS_147 | K31 |
| I2S1_LRCK_RX_M1/PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/GPIO0_C4_d | AL38 | VSS_148 | K32 |
| I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/SATA_CPDET/GPIO0_D4_u | AL39 | VSS_149 | K33 |
| I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/GPIO0_C7_d | AL40 | AVSS_11 | K34 |
| MIPI_CSI1_D0N | AL41 | AVSS_12 | K35 |
| MIPI_CSI1_D0P | AL42 | AVSS_13 | K36 |
| DDR_CH0_ZQ_A | AM1 | AVSS_14 | K37 |
| DDR_CH0_A6_A | AM2 | AVSS_15 | K38 |
| VSS_477 | AM4 | AVSS_16 | K39 |
| VSS_478 | AM5 | AVSS_17 | K40 |
| HDMI/eDP_TX0_VDD_0V75_1 | AM13 | PCIE20_0_REFCLKN | K41 |
| AVSS_25 | AM14 | DDR_CH0_A5_B | L1 |
| AVSS_26 | AM15 | VSS_150 | L2 |
| VSS_479 | AM16 | VSS_151 | L3 |
| VSS_480 | AM17 | VSS_152 | L5 |
| VDD_GPU_10 | AM21 | VSS_153 | L6 |
| VDD_GPU_11 | AM22 | DDR_CH0_VDDQ_CK_2 | L9 |
| VSS_481 | AM23 | VSS_154 | L10 |
| VSS_482 | AM25 | VSS_155 | L11 |
| VSS_483 | AM27 | VSS_156 | L12 |
| VDD_NPU_7 | AM30 | VSS_157 | L14 |
| VSS_484 | AM31 | DDR_CH1_PLL_AVDD1V8 | L15 |
| VSS_485 | AM32 | DDR_CH1_VDD_3 | L18 |
| VCCIO6_2 | AM33 | DDR_CH1_VDD_MIF_3 | L20 |
| MIPI_CSI0_AVCC1V8 | AM35 | VSS_158 | L22 |
| MIPI_CSI0_AVCC0V75 | AM37 | VSS_159 | L23 |
| PMIC_SLEEP3/GPIO0_C1_d | AM38 | VSS_160 | L24 |
| I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5_u | AM39 | VSS_161 | L32 |
| I2S1_SCLK_RX_M1/PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/GPIO0_C0_d | AM40 | VSS_162 | L33 |
| VSS_486 | AM41 | AVSS_18 | L34 |
| DDR_CH0_DQS0P_A | AN1 | AVSS_19 | L35 |
| DDR_CH0_DQS0N_A | AN2 | VSS_163 | L36 |
| VSS_487 | AN3 | MIPI_CAMERA3_CLK_M0/I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6_u | L37 |
| DDR_CH0_DQ10_A | AN4 | MIPI_CAMERA1_CLK_M0/SPDIF0_TX_M0/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6_u | L38 |
| DDR_CH0_DQ9_A | AN5 | I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3_d | L39 |
| VSS_488 | AN6 | PCIE20X1_1_WAKEN_M2/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1_d | L40 |
| VSS_489 | AN7 | AVSS_20 | L41 |
| OTP_VDDOTP_0V75 | AN8 | PCIE20_0_REFCLKP | L42 |
| HDMI/eDP_TX0_AVDD_0V75 | AN10 | DDR_CH0_LP4/4X_CS1_B | M1 |
| AVSS_27 | AN11 | VSS_164 | M2 |
| HDMI/eDP_TX0_VDD_0V75_2 | AN12 | VSS_165 | M5 |
| AVSS_28 | AN13 | DDR_CH0_VDDQ_CKE_1 | M6 |
| AVSS_29 | AN14 | DDR_CH0_VDDQ_CKE_2 | M7 |
| AVSS_30 | AN15 | VSS_166 | M8 |
| VSS_490 | AN17 | VSS_167 | M9 |
| AVSS_31 | AN18 | VSS_168 | M10 |
| VDD_GPU_12 | AN21 | VSS_169 | M12 |
| VDD_GPU_13 | AN22 | VSS_170 | M14 |
| VSS_491 | AN23 | DDR_CH1_PLL_DVDD | M16 |
| VSS_492 | AN25 | VSS_171 | M17 |
| VDD_NPU_8 | AN30 | VSS_172 | M19 |
| VSS_493 | AN31 | VSS_173 | M21 |
| VSS_494 | AN32 | VSS_174 | M22 |
| VSS_495 | AN33 | VSS_175 | M23 |
| VSS_496 | AN34 | VDD_CPU_BIG0_1 | M24 |
| VSS_497 | AN35 | VDD_CPU_BIG0_2 | M25 |
| MIPI_CSI0_CLK1P | AN37 | VDD_CPU_BIG0_3 | M28 |
| MIPI_CSI0_CLK1N | AN38 | VDD_CPU_BIG0_4 | M29 |
| VSS_500 | AN39 | VDD_CPU_BIG0_5 | M30 |
| VSS_501 | AN40 | AVSS_21 | M33 |
| MIPI_CSI1_CLK0N | AN41 | AVSS_22 | M34 |
| MIPI_CSI1_CLK0P | AN42 | VSS_176 | M35 |
| VSS_502 | AP2 | VSS_177 | M36 |
| VSS_503 | AP5 | PDM1_CLK1_M1/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3_d | M37 |
| VSS_504 | AP6 | PDM1_SDI3_M1/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2_d | M38 |
| AVSS_32 | AP7 | PDM1_CLK0_M1/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4_u | M39 |
| AVSS_33 | AP8 | HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5_d | M40 |
| AVSS_34 | AP9 | I2S0_LRCK_RX/PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6_d | M41 |
| AVSS_35 | AP10 | I2S0_SCLK_TX/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3_d | M42 |
| AVSS_36 | AP11 | DDR_CH0_DQ2_B | N1 |
| AVSS_37 | AP16 | DDR_CH0_DQ13_B | N2 |
| TYPEC0_DP0_VDDA_0V85_1 | AP18 | VSS_178 | N3 |
| AVSS_38 | AP22 | DDR_CH0_DQ12_B | N5 |
| SARADC_AVDD_1V8 | AP23 | DDR_CH0_DQ15_B | N6 |
| VSS_505 | AP25 | VSS_179 | N7 |
| VSS_506 | AP27 | VSS_180 | N9 |
| VDD_NPU_9 | AP30 | VSS_181 | N11 |
| AVSS_39 | AP31 | VSS_182 | N12 |
| AVSS_40 | AP32 | DDR_CH1_PLL_AVSS | N15 |
| VSS_507 | AP33 | VSS_183 | N16 |
| VSS_508 | AP34 | VSS_184 | N17 |
| VSS_509 | AP35 | VSS_185 | N18 |
| VSS_510 | AP37 | VSS_186 | N21 |
| VSS_511 | AP38 | VSS_187 | N22 |
| VSS_512 | AP39 | VDD_CPU_BIG0_6 | N24 |
| VSS_513 | AP40 | VDD_CPU_BIG0_7 | N25 |
| MIPI_CSI1_D3N | AP41 | AVSS_23 | N33 |
| MIPI_CSI1_D3P | AP42 | VSS_188 | N34 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5_d | AR1 | OSC_1V8_1 | N35 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1_u | AR2 | OSC_1V8_2 | N36 |
| VSS_514 | AR3 | PMUIO1_1V8_1 | N37 |
| VSS_515 | AR4 | VSS_189 | N38 |
| DDR_CH0_WCK0N_A | AR5 | VSS_190 | N39 |
| DDR_CH0_WCK0P_A | AR6 | VSS_191 | N40 |
| AVSS_41 | AR9 | I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1_z | N41 |
| AVSS_42 | AR16 | I2S0_SDI0/GPIO1_D4_d | N42 |
| AVSS_43 | AR18 | DDR_CH0_RESET_B | P1 |
| TYPEC0_DP0_VDDA_0V85_2 | AR19 | VSS_192 | P2 |
| AVSS_44 | AR20 | DDR_CH0_DQ5_B | P3 |
| AVSS_45 | AR21 | DDR_CH0_DQ4_B | P4 |
| AVSS_46 | AR22 | DDR_CH0_DQ7_B | P5 |
| TYPEC0_DP0_VDDH_1V8 | AR23 | VSS_193 | P6 |
| AVSS_47 | AR25 | VSS_194 | P7 |
| MIPI_D/C_PHY1_VDD | AR27 | VSS_195 | P8 |
| MIPI_D/C_PHY1_VDD_1V8_1 | AR30 | VSS_196 | P9 |
| MIPI_D/C_PHY0_VDD | AR33 | DDR_CH0_VDDQ_1 | P10 |
| MIPI_D/C_PHY1_VDD_1V2_1 | AR34 | VSS_197 | P12 |
| MIPI_D/C_PHY0_VDD_1V2_2 | AR35 | VDD_VDENC_1 | P15 |
| GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0_d | AR36 | VSS_198 | P16 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D2_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1_u | AR37 | VSS_199 | P17 |
| GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0_u | AR38 | VSS_200 | P18 |
| GMAC1_RXD1/I2S2_SCLK_RX_M1/MIPI_CAMERA3_CLK_M1/PWM9_M0/GPIO3_B0_u | AR39 | VSS_201 | P19 |
| VSS_516 | AR40 | VDD_CPU_BIG0_8 | P23 |
| VSS_517 | AR41 | VSS_202 | P25 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3_u | AT1 | VSS_203 | P26 |
| VSS_518 | AT2 | VSS_204 | P27 |
| DDR_CH0_WCK1N_A | AT3 | VSS_205 | P28 |
| DDR_CH0_WCK1P_A | AT4 | VSS_206 | P29 |
| VSS_519 | AT5 | VSS_207 | P30 |
| VSS_520 | AT6 | VSS_208 | P31 |
| AVSS_48 | AT7 | VSS_209 | P32 |
| AVSS_49 | AT8 | VSS_210 | P33 |
| USB20_AVDD_3V3 | AT10 | VSS_211 | P34 |
| USB20_DVDD_0V75_1 | AT11 | PDM0_SDI0_M0/SPI1_CS1_M2/GPIO1_D5_d | P38 |
| USB20_DVDD_0V75_2 | AT12 | I2S0_LRCK_TX/I2C2_SCL_M3/UART4_RTSN/GPIO1_C5_d | P39 |
| USB20_AVDD_1V8_1 | AT13 | I2S0_SDO3/I2S0_SDI2/PDM0_SDI2_M0/I2C1_SCL_M4/UART4_TX_M0/PWM0_M1/SPI1_CLK_M2/GPIO1_D2_d | P40 |
| USB20_AVDD_1V8_2 | AT14 | I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7_d | P41 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE20X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2_u | AT15 | DDR_CH0_A2_B | R1 |
| AVSS_50 | AT16 | DDR_CH0_A1_B | R2 |
| TYPEC0_DP0_VDD_0V85 | AT18 | VSS_212 | R3 |
| AVSS_51 | AT19 | VSS_213 | R4 |
| AVSS_52 | AT20 | VSS_214 | R8 |
| AVSS_53 | AT21 | DDR_CH0_VDDQ_2 | R10 |
| AVSS_54 | AT22 | VDD_VDENC_2 | R15 |
| AVSS_55 | AT23 | VSS_215 | R16 |
| MIPI_D/C_PHY1_VREG | AT27 | VSS_216 | R20 |
| AVSS_56 | AT29 | VSS_217 | R21 |
| MIPI_D/C_PHY0_VDD_1V8_2 | AT30 | VDD_CPU_BIG0_9 | R23 |
| MIPI_D/C_PHY0_VREG | AT33 | VDD_CPU_BIG0_10 | R24 |
| VSS_521 | AT36 | VSS_218 | R25 |
| GMAC1_RXD0/MIPI_CAMERA2_CLK_M1/PWM8_M0/GPIO3_A7_u | AT37 | VDD_CPU_BIG1_1 | R26 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2_u | AT38 | VDD_CPU_BIG1_2 | R27 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4_d | AT39 | VDD_CPU_BIG1_3 | R28 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3_u | AT40 | VDD_CPU_BIG1_4 | R29 |
| MIPI_CSI1_D2P | AT41 | VDD_CPU_BIG1_5 | R30 |
| MIPI_CSI1_D2N | AT42 | VDD_CPU_BIG1_6 | R31 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4_u | AU1 | VDD_CPU_BIG1_7 | R32 |
| VSS_522 | AU2 | VDD_CPU_BIG1_8 | R33 |
| VSS_523 | AU3 | VSS_219 | R35 |
| VSS_524 | AU4 | PMUIO1_1V8_2 | R36 |
| USB20_HOST1_REXT | AU6 | I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0_z | R38 |
| TYPEC0_USB20_OTG0_REXT | AU7 | I2S0_SDI1/PDM0_SDI3_M0/I2C1_SDA_M4/UART4_RX_M0/PWM1_M1/SPI1_CS0_M2/GPIO1_D3_d | R39 |
| AVSS_57 | AU8 | VSS_220 | T2 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5_d | AU15 | VSS_221 | T3 |
| AVSS_58 | AU16 | VSS_222 | T4 |
| AVSS_59 | AU18 | DDR_CH0_VDDQ_3 | T10 |
| AVSS_60 | AU19 | DDR_CH0_VDD_1 | T12 |
| AVSS_61 | AU21 | DDR_CH0_VDD_2 | T13 |
| MIPI_CAMERA0_CLK_M0/SPDIF1_TX_M1/I2S1_SDO0_M0/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1_u | AU22 | VDD_VDENC_3 | T15 |
| BT1120_D11/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5_d | AU23 | VSS_224 | T16 |
| AVSS_62 | AU24 | VSS_225 | T17 |
| AVSS_63 | AU25 | VSS_226 | T18 |
| AVSS_64 | AU27 | VSS_227 | T20 |
| AVSS_65 | AU28 | VSS_228 | T21 |
| AVSS_66 | AU29 | VSS_229 | T24 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7_u | AU30 | VSS_230 | T25 |
| AVSS_67 | AU31 | VDD_CPU_BIG1_9 | T26 |
| CIF_D8/FSPI_CS0N_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4_u | AU34 | VSS_231 | T35 |
| VSS_525 | AU35 | VSS_232 | T36 |
| VSS_526 | AU38 | VSS_233 | T37 |
| VSS_527 | AU39 | VSS_234 | T38 |
| VSS_528 | AU40 | VSS_235 | T39 |
| MIPI_CSI1_CLK1P | AU41 | VSS_236 | T40 |
| MIPI_CSI1_CLK1N | AU42 | XIN_24M | T41 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2_u | AV1 | XOUT_24M | T42 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0_u | AV2 | VSS_223 | T7 |
| DDR_CH0_DQS1N_A | AV3 | DDR_CH0_A0_A | U1 |
| DDR_CH0_DQS1P_A | AV4 | DDR_CH0_A0_B | U2 |
| VSS_529 | AV5 | DDR_CH0_DQ0_B | U3 |
| USB20_HOST0_DM | AV6 | DDR_CH0_DQ6_B | U4 |
| USB20_HOST1_DP | AV7 | DDR_CH0_DQ3_B | U5 |
| AVSS_68 | AV8 | VSS_237 | U6 |
| AVSS_69 | AV9 | VSS_238 | U7 |
| TYPEC0_USB20_VBUSDET | AV10 | VSS_239 | U8 |
| SARADC_IN2 | AV11 | DDR_CH0_VDD_3 | U12 |
| AVSS_70 | AV12 | DDR_CH0_VDD_4 | U13 |
| SARADC_IN3 | AV13 | VDD_VDENC_4 | U15 |
| AVSS_71 | AV14 | VSS_240 | U16 |
| AVSS_72 | AV15 | VSS_241 | U17 |
| AVSS_73 | AV16 | VSS_242 | U18 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6_d | AV18 | VSS_243 | U20 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE20X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0_d | AV19 | VSS_244 | U21 |
| AVSS_74 | AV21 | VSS_245 | U22 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7_u | AV22 | VSS_246 | U23 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3_u | AV23 | VSS_247 | U24 |
| AVSS_75 | AV25 | VSS_248 | U25 |
| CIF_D2/BT1120_D2/I2S1_LRCK_TX_M0/PCIE20X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2_d | AV26 | VDD_CPU_BIG1_10 | U26 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4_u | AV27 | I2S0_SCLK_RX/PDM0_CLK1_M0/I2C2_SDA_M3/PWM11_IR_M2/SPI4_CS1_M0/GPIO1_C4_d | U35 |
| AVSS_76 | AV29 | I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2_d | U36 |
| CIF_D10/SPI3_MISO_M3/GPIO3_C6_u | AV30 | I2S0_SDO1/I2C7_SCL_M0/UART6_TX_M2/SPI1_MISO_M2/GPIO1_D0_d | U37 |
| HDMI_TX0_HPD_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4_d | AV31 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/I2C7_SDA_M0/UART6_RX_M2/SPI1_MOSI_M2/GPIO1_D1_d | U38 |
| AVSS_77 | AV32 | VSS_249 | U39 |
| AVSS_78 | AV33 | VSS_250 | U40 |
| CIF_D9/FSPI_CS1N_M2/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5_u | AV34 | VSS_251 | U41 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4_u | AV35 | DDR_CH0_CKB_B | V1 |
| VSS_530 | AV36 | DDR_CH0_CK_B | V2 |
| ETH1_REFCLKO_25M/MIPI_CAMERA1_CLK_M1/I2C4_SCL_M0/GPIO3_A6_d | AV37 | VSS_252 | V3 |
| GMAC1_RXCLK/SDIO_CLK_M1/MIPI_CAMERA0_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5_d | AV38 | DDR_CH0_DM0_B | V5 |
| GMAC1_RXDV_CRS/I2S2_LRCK_RX_M1/MIPI_CAMERA4_CLK_M1/UART2_TX_M2/PWM2_M1/GPIO3_B1_d | AV39 | VSS_253 | V6 |
| GMAC1_MDC/MIPI_TE0/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2_d | AV40 | VSS_254 | V7 |
| VSS_531 | AV41 | VSS_255 | V8 |
| VSS_532 | AW3 | DDR_CH0_VDDQ_4 | V10 |
| VSS_533 | AW4 | DDR_CH0_VDD_MIF_1 | V12 |
| USB20_HOST0_REXT | AW5 | DDR_CH0_VDD_MIF_2 | V13 |
| USB20_HOST0_DP | AW6 | DDR_CH0_VDD_MIF_3 | V14 |
| USB20_HOST1_DM | AW7 | VSS_256 | V16 |
| AVSS_79 | AW8 | VSS_257 | V17 |
| AVSS_80 | AW9 | VSS_258 | V19 |
| TYPEC0_USB20_OTG_ID | AW10 | VSS_259 | V23 |
| TYPEC0_DP0_REXT | AW11 | VSS_260 | V24 |
| AVSS_81 | AW12 | VSS_261 | V25 |
| SARADC_IN5 | AW13 | VDD_CPU_BIG1_MEM_1 | V26 |
| AVSS_82 | AW14 | VDD_CPU_BIG1_MEM_2 | V27 |
| SARADC_IN0_BOOT | AW15 | VDD_CPU_BIG1_MEM_3 | V28 |
| AVSS_83 | AW16 | VDD_CPU_BIG1_MEM_4 | V29 |
| AVSS_84 | AW17 | VSS_262 | V30 |
| CIF_D1/BT1120_D1/I2S1_SCLK_TX_M0/PCIE20X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1_d | AW18 | VSS_263 | V31 |
| CIF_D4/BT1120_D4/I2S1_LRCK_RX_M0/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4_d | AW19 | VSS_264 | V32 |
| AVSS_85 | AW21 | VSS_265 | V33 |
| BT1120_D12/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6_d | AW22 | VSS_266 | V34 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0_u | AW23 | PMUIO2_1 | V35 |
| AVSS_86 | AW25 | PMUIO2_2 | V36 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7_d | AW26 | PMUIO2_1V8_1 | V37 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0_d | AW27 | VSS_267 | V38 |
| AVSS_87 | AW28 | VSS_268 | V39 |
| AVSS_88 | AW29 | VSS_269 | V40 |
| MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5_d | AW30 | TVSS | V41 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0_u | AW31 | NPOR | V42 |
| AVSS_89 | AW32 | VSS_270 | W2 |
| AVSS_90 | AW33 | VSS_271 | W5 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2_d | AW34 | VSS_272 | W7 |
| GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3_u | AW35 | VSS_273 | W8 |
| AVSS_91 | AW36 | VSS_274 | W9 |
| GMAC1_MCLKINOUT/I2S2_LRCK_TX_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6_d | AW37 | DDR_CH0_VDDQ_5 | W10 |
| GMAC1_PPSCLK/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1_d | AW38 | VDD_VDENC_5 | W16 |
| GMAC1_MDIO/MIPI_TE1/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3_d | AW39 | VDD_VDENC_MEM_1 | W17 |
| AVSS_92 | AW40 | VSS_275 | W18 |
| MIPI_CSI0_D3P | AW41 | VSS_276 | W19 |
| MIPI_CSI0_D3N | AW42 | VSS_277 | W22 |
| HDMI_TX0_SBDN/EDP_TX0_AUXN | AY1 | VSS_278 | W23 |
| AVSS_93 | AY2 | VSS_279 | W24 |
| HDMI/eDP_TX0_REXT | AY3 | VSS_280 | W26 |
| AVSS_94 | AY4 | VDD_LOGIC_3 | W33 |
| AVSS_95 | AY5 | REFCLK_OUT/GPIO0_A0_d | W38 |
| AVSS_96 | AY7 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6_z | W39 |
| AVSS_97 | AY8 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1_z | W40 |
| TYPEC0_USB20_OTG_DM | AY10 | PMIC_SLEEP1/GPIO0_A2_d | W41 |
| TYPEC0_USB20_OTG_DP | AY11 | PMIC_INT_L/GPIO0_A7_u | W42 |
| AVSS_99 | AY12 | DDR_CH0_A4_A | Y1 |
| SARADC_IN1 | AY13 | DDR_CH0_LP4/4X_CS0_A | Y2 |
| AVSS_100 | AY14 | VSS_281 | Y3 |
| SARADC_IN4 | AY15 | VSS_282 | Y4 |
| AVSS_101 | AY16 | VSS_283 | Y5 |
| AVSS_102 | AY17 | VSS_284 | Y6 |
| AVSS_103 | AY18 | DDR_CH0_VDDQ_6 | Y10 |
| CIF_D3/BT1120_D3/I2S1_SCLK_RX_M0/UART0_TX_M2/GPIO4_A3_d | AY19 | VSS_285 | Y11 |
| AVSS_104 | AY21 | DDR_CH0_PLL_AVDD1V8 | Y14 |
| AVSS_105 | AY22 | VDD_VDENC_MEM_2 | Y17 |
| AVSS_106 | AY23 | VSS_286 | Y18 |
| AVSS_107 | AY25 | VSS_287 | Y19 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1_d | AY26 | VSS_288 | Y22 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1_d | AY27 | VSS_289 | Y23 |
| AVSS_108 | AY28 | VSS_290 | Y24 |
| AVSS_109 | AY29 | PLL_DVDD0V75 | Y26 |
| CIF_D14/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2_d | AY30 | VSS_291 | Y28 |
| CIF_D15/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3_d | AY31 | VSS_292 | Y29 |
| AVSS_110 | AY32 | VSS_293 | Y30 |
| AVSS_111 | AY33 | VSS_294 | Y31 |
| GMAC1_PTP_REF_CLK/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7_d | AY34 | VSS_295 | Y32 |
| GMAC1_TXEN/I2S2_SCLK_TX_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5_u | AY35 | VDD_LOGIC_4 | Y33 |
| AVSS_112 | AY36 | PMUIO2_1V8_2 | Y37 |
| AVSS_113 | AY37 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3_z | Y38 |
| AVSS_114 | AY39 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5_d | Y39 |
| MIPI_CSI0_D1N | AY40 | EMMC_D1/FSPI_D1_M0/GPIO2_D1_u | Y40 |
| AVSS_115 | AY41 | EMMC_D0/FSPI_D0_M0/GPIO2_D0_u | Y41 |
| MIPI_CSI0_D2P | AY42 |  |  |

## 3. Электрические характеристики

### 3.1 Абсолютные пределы

Выход за пределы может необратимо повредить чип; длительное воздействие максимумов снижает надёжность.

| Параметры | Группа питания | Минимум | Максимум | Единица |
| --- | --- | --- | --- | --- |
| Питание CPU | VDD_CPU_BIG0 VDD_CPU_BIG1 VDD_CPU_LIT | -0.3 | 1.1 | V |
| Питание памяти CPU | VDD_CPU_BIG0_MEM VDD_CPU_BIG1_MEM VDD_CPU_LIT_MEM | -0.3 | 1.1 | V |
| Питание GPU | VDD_GPU | -0.3 | 1.1 | V |
| Питание памяти GPU | VDD_GPU_MEM | -0.3 | 1.1 | V |
| Питание NPU | VDD_NPU | -0.3 | 1.1 | V |
| Питание памяти NPU | VDD_NPU_MEM | -0.3 | 1.1 | V |
| Питание VCODEC | VDD_VDENC | -0.3 | 0.95 | V |
| Питание памяти VCODEC | VDD_VDENC_MEM | -0.3 | 0.95 | V |
| Питание основной логики | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V напряжение питания | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI/eDP_TX0_VDD_0V75 HDMI/eDP_TX0_AVDD_0V75 MIPI_CSI0_AVCC0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V напряжение питания | DDR_CH0_VDD DDR_CH0_VDD_MIF DDR_CH0_PLL_DVDD DDR_CH1_VDD DDR_CH1_VDD_MIF DDR_CH1_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 MIPI_D/C_PHY0_VDD MIPI_D/C_PHY1_VDD PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.2V напряжение питания | MIPI_D/C_PHY_VDD_1V2 | -0.3 | 1.35 | V |
| 1.8V напряжение питания | DDR_CH0_PLL_AVDD1V8 DDR_CH1_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 HDMI/eDP_TX0_VDD_CMN_1V8 HDMI/eDP_TX0_VDD_IO_1V8 MIPI_CSI0_AVCC1V8 MIPI_D/C_PHY_VDD_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V напряжение питания | USB20_AVDD_3V3 | -0.5 | 3.63 | V |
| Питание GPIO только 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 | -0.5 | 1.98 | V |
| Питание GPIO 1.8V/3.3V | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Питание DDR IO (LPDDR4/4X 0.6V; LPDDR5/5X 0.5V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Питание DDR IO (LPDDR4/4X 1.1V; LPDDR5/5X 1.05V) | DDR_CH0_VDDQ_CKE DDR_CH1_VDDQ_CKE | -0.3 | 1.25 | V |
| Температура хранения | Tstg | -40 | 125 | ℃ |
| Максимальная температура перехода (в оригинале Conjunction) | Tj | NA | 125 | ℃ |

### 3.2 Рекомендуемый режим

| Параметры | Обозначение | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- |
| Напряжение большого ядра CPU 0 | VDD_CPU_BIG0 | 0.55 | 0.75 | 1.05 | V |
| Напряжение памяти большого ядра CPU 0 | VDD_CPU_BIG0_MEM | 0.675 | 0.75 | 1.05 | V |
| Напряжение большого ядра CPU 1 | VDD_CPU_BIG1 | 0.55 | 0.75 | 1.05 | V |
| Напряжение памяти большого ядра CPU 1 | VDD_CPU_BIG1_MEM | 0.675 | 0.75 | 1.05 | V |
| Напряжение малых ядер CPU и DSU | VDD_CPU_LIT | 0.55 | 0.75 | 0.95 | V |
| Напряжение памяти малых ядер CPU и DSU | VDD_CPU_LIT_MEM | 0.675 | 0.75 | 0.95 | V |
| Напряжение GPU | VDD_GPU | 0.55 | 0.75 | 0.95 | V |
| Напряжение памяти GPU | VDD_GPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Напряжение NPU | VDD_NPU | 0.55 | 0.75 | 0.95 | V |
| Напряжение памяти NPU | VDD_NPU_MEM | 0.675 | 0.75 | 0.95 | V |
| Напряжение VCODEC | VDD_VDENC | 0.675 | 0.75 | 0.825 | V |
| Напряжение памяти VCODEC | VDD_VDENC_MEM | 0.675 | 0.75 | 0.825 | V |
| Напряжение логики | VDD_LOGIC | 0.675 | 0.75 | 0.825 | V |
| Напряжение PMU | PMU_0V75 | 0.675 | 0.75 | 0.825 | V |
| Цифровое питание GPIO (1.8V только) | PMUIO1_1V8, VCCIO1_1V8 | 1.65 | 1.8 | 1.95 | V |
| Цифровое питание GPIO (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Питание eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Питание логики(0.85V) | DDR_CH0_VDD, DDR_CH0_VDD_MIF, DDR_CH1_VDD, DDR_CH1_VDD_MIF | 0.675 | 0.85 | 0.935 | V |
| DDR CH0_PLL питание(0.85V) | DDR_CH0_PLL_DVDD, DDR_CH1_PLL_DVDD | 0.675 | 0.75 | 0.8925 | V |
| DDR CH0_PLL питание(1.8V) | DDR_CH0_PLL_AVDD1V8, DDR_CH1_PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| LPDDR4 Питание IO VDDQ | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 Питание удержания IO VDDQ | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| LPDDR5 Питание IO VDDQ | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.475 | 0.5 | 0.525 | V |
| LPDDR5 Питание удержания IO VDDQ | DDR_CH0_VDDQ_CKE, DDR_CH1_VDDQ_CKE | 1.0 | 1.05 | 1.1 | V |
| PLL Аналоговое питание(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Аналоговое питание(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB 2.0 Аналоговое питание (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Аналоговое питание (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB 2.0 Аналоговое питание (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Аналоговое питание (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Аналоговое питание (1.8V) | TYPEC0_DP0_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Аналоговое питание(0.9V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Аналоговое питание(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| MIPI CSI DPHY Аналоговое питание(0.75V) | MIPI_CSI0_AVCC0V75 | 0.675 | 0.75 | 0.825 | V |
| MIPI CSI DPHY Аналоговое питание(1.8V) | MIPI_CSI0_AVCC1V8 | 1.62 | 1.8 | 1.98 | V |
| MIPI DCPHY Аналоговое питание (0.85V) | MIPI_D/C_PHY_VDD, MIPI_D/C_PHY1_VDD | 0.7125 | 0.85 | 0.8925 | V |
| MIPI DCPHY Аналоговое питание (1.2V) | MIPI_D/C_PHY_VDD_1V2 | 1.14 | 1.2 | 1.26 | V |
| MIPI DCPHY Аналоговое питание (1.8V) | MIPI_D/C_PHY_VDD_1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI/eDP TX Цифровое питание (0.75V) | HDMI/eDP_TX0_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (0.75V) | HDMI/eDP_TX0_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI/eDP_TX0_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI/eDP_TX0_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Аналоговое питание(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Аналоговое питание(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Аналоговое питание(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| Входная частота OSC |  | NA | 24 | NA | MHz |
| Максимальная частота CPU |  | NA | NA | 2.2-2.4 | GHz |
| Максимальная частота GPU |  | NA | NA | 1000 | MHz |
| Максимальная частота NPU |  | NA | NA | 1000 | MHz |
| Рабочая температура окружающей среды | TA | 0 | NA | 80 | ℃ |

### 3.3 Постоянный ток

|  | Параметры | Обозначение | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Цифровой 3.3V/1.8V GPIO @3.3V | Входное низкое напряжение | VIL | VSS | NA | 0.3*VDDO | V |
| Цифровой 3.3V/1.8V GPIO @3.3V | Входное высокое напряжение | VIH | 0.7*VDDO | NA | VDDO | V |
| Цифровой 3.3V/1.8V GPIO @3.3V | Выходное низкое напряжение | VOL | VSS | NA | 0.25*DVDD | V |
| Цифровой 3.3V/1.8V GPIO @3.3V | Выходное высокое напряжение | VOH | 0.75*DVDD | NA | DVDD | V |
| Цифровой 3.3V/1.8V GPIO @3.3V | Подтягивающий резистор вверх | RRPU | 10 | NA | 100 | Kohm |
| Цифровой 3.3V/1.8V GPIO @3.3V | Подтягивающий резистор вниз | RRPD | 10 | NA | 100 | Kohm |
| Цифровой 3.3V/1.8V GPIO @1.8V | Входное низкое напряжение | VIL | VSS | NA | 0.3*VDDO | V |
| Цифровой 3.3V/1.8V GPIO @1.8V | Входное высокое напряжение | VIH | 0.7*VDDO | NA | VDDO | V |
| Цифровой 3.3V/1.8V GPIO @1.8V | Выходное низкое напряжение | VOL | VSS | NA | 0.25*DVDD | V |
| Цифровой 3.3V/1.8V GPIO @1.8V | Выходное высокое напряжение | VOH | 0.75*DVDD | NA | DVDD | V |
| Цифровой 3.3V/1.8V GPIO @1.8V | Подтягивающий резистор вверх | RRPU | 10 | NA | 50 | Kohm |
| Цифровой 3.3V/1.8V GPIO @1.8V | Подтягивающий резистор вниз | RRPD | 10 | NA | 50 | Kohm |
| Цифровой 1.8V только GPIO @1.8V | Входное низкое напряжение | VIL | VSS | NA | 0.3*VDDO | V |
| Цифровой 1.8V только GPIO @1.8V | Входное высокое напряжение | VIH | 0.7*VDDO | NA | VDDO | V |
| Цифровой 1.8V только GPIO @1.8V | Выходное низкое напряжение | VOL | VSS | NA | 0.25*DVDD | V |
| Цифровой 1.8V только GPIO @1.8V | Выходное высокое напряжение | VOH | 0.75*DVDD | NA | DVDD | V |
| Цифровой 1.8V только GPIO @1.8V | Подтягивающий резистор вверх | RRPU | 10 | NA | 50 | Kohm |
| Цифровой 1.8V только GPIO @1.8V | Подтягивающий резистор вниз | RRPD | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Входное низкое напряжение | VIL | VSS | NA | 0.35*DVDD | V |
| eMMC IO @1.8V | Входное высокое напряжение | VIH | 0.65*DVDD | NA | DVDD | V |
| eMMC IO @1.8V | Выходное низкое напряжение | VOL | VSS | NA | 0.45 | V |
| eMMC IO @1.8V | Выходное высокое напряжение | VOH | DVDD-0.45 | NA | DVDD | V |
| eMMC IO @1.8V | Подтягивающий резистор вверх | RRPU | 10 | NA | 50 | Kohm |
| eMMC IO @1.8V | Подтягивающий резистор вниз | RRPD | 10 | NA | 50 | Kohm |
| DDR IO | Входное низкое напряжение | VIL | NA | NA | Vref-0.14 | V |
| DDR IO | Входное высокое напряжение | VIH | Vref+0.14 | NA | NA | V |
| DDR IO | Выходное низкое напряжение (источник: Log) | VOL | NA | NA | 0.2 | V |
| DDR IO | Выходное высокое напряжение | VOH | 0.25 | NA | NA | V |
| DDR IO | Входной ток низкого уровня | IIL | -100/-500 | NA | 100/500 | Комнатная/высокая температура uA |
| DDR IO | Входной ток высокого уровня | IIH | -100/-500 | NA | 100/500 | Комнатная/высокая температура uA |

### 3.4 Общие IO

|  | Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Цифровой 3.3V/1.8V GPIO @3.3V | Входной ток утечки | IPAD | DVDD=Max, VPAD=0V или DVDD | -10 | NA | 10 | uA |
| Цифровой 3.3V/1.8V GPIO @3.3V | Входной гистерезис триггера Шмитта | VH |  | 0.08* VDDO | NA | NA | V |
| Цифровой 3.3V/1.8V GPIO @3.3V | Ток входной подтяжки вверх | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Цифровой 3.3V/1.8V GPIO @3.3V | Ток входной подтяжки вниз | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Цифровой 3.3V/1.8V GPIO @1.8V | Входной ток утечки | IPAD | DVDD=Max, VPAD=0V или DVDD | -10 | NA | 10 | uA |
| Цифровой 3.3V/1.8V GPIO @1.8V | Входной гистерезис триггера Шмитта | VH |  | 0.1* VDDO | NA | NA | V |
| Цифровой 3.3V/1.8V GPIO @1.8V | Ток входной подтяжки вверх | IRPU | VPAD = 0V | -20 | NA | -180 | uA |
| Цифровой 3.3V/1.8V GPIO @1.8V | Ток входной подтяжки вниз | IRPD | VPAD = VDDO | 20 | NA | 180 | uA |
| Цифровой 1.8V только GPIO @1.8V | Входной ток утечки | IPAD | DVDD=Max, VPAD=0V или DVDD | -10 | NA | 10 | uA |
| Цифровой 1.8V только GPIO @1.8V | Входной гистерезис триггера Шмитта | VH |  | 0.1* VDDO | NA | NA | V |
| Цифровой 1.8V только GPIO @1.8V | Ток входной подтяжки вверх | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| Цифровой 1.8V только GPIO @1.8V | Ток входной подтяжки вниз | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |
| eMMC IO @1.8V | Входной ток утечки | IPAD | DVDD=Max, VPAD=0V или DVDD | -10 | NA | 10 | uA |
| eMMC IO @1.8V | Входной гистерезис триггера Шмитта | VH |  | 0.1* DVDD | NA | NA | V |
| eMMC IO @1.8V | Ток входной подтяжки вверх | IRPU | VPAD = 0V | -20 | NA | -170 | uA |
| eMMC IO @1.8V | Ток входной подтяжки вниз | IRPD | VPAD = VDDO | 20 | NA | 170 | uA |

VDDO и DVDD —питание IO. Отрицательные токи подтяжки сохранены в исходных MIN/MAX.

### 3.5.1 INT PLL

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Частота входного такта | FFIN |  | 4.5 | - | 300 | MHz |
| Опорная частота (FFIN/p) | FFREE |  | 4.5 | 7 | 12 | MHz |
| Выходная частота PLL | FFOUT |  | 35.2 | - | 4500 | MHz |
| Выходная частота VCO | FFVCO |  | 2250 | - | 4500 | MHz |
| Время захвата | TLT | Измерено во всём диапазоне FFIN и FFOUT; RESETB=High | - | - | 150 | Такты |

### 3.5.2 FRAC PLL

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Частота входного такта | FFIN |  | 6 | - | 300 | MHz |
| Опорная частота (FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| Выходная частота PLL | FFOUT |  | 35.2 | - | 4500 | MHz |
| Выходная частота VCO | FFVCO |  | 2250 | - | 4500 | MHz |
| Время захвата | TLT | Измерено во всём диапазоне FFIN и FFOUT; RESETB=High | - | - | 500 | Такты |

### 3.5.3 DDR PLL

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Частота входного такта | FFIN |  | 6 | - | 300 | MHz |
| Опорная частота (FFIN/p) | FFREE |  | 6 | 20 | 30 | MHz |
| Выходная частота PLL | FFOUT |  | 51.6 | - | 6600 | MHz |
| Выходная частота VCO | FFVCO |  | 3300 | - | 6600 | MHz |
| Время захвата | TLT | Измерено во всём диапазоне FFIN и FFOUT; RESETB=High | - | - | 500 | Такты |

Примечание①: p —входной делитель.

### 3.6 PCIe2/SATA

| Параметры | Обозначение | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- |
| Передатчик |  |  |  |  |  |
| Дифференциальный размах TX | VTX_DIFF_PP | 800 | 1000 | 1200 | mV |
| Дифференциальный размах TX при малом потреблении | VTX_DIFF_PP_LOW | 400 | NA | 1200 | mV |
| Выходной импеданс | RTX_DIFF_DC | 80 | 100 | 120 | ohm |
| Согласование одиночных выходных сопротивлений | RTX_DC_OFFSET | NA | NA | 5 | % |
| Синфазное выходное напряжение передатчика | VTX_DC_CM | 400 | NA | 800 | mV |
| Максимальное рассогласование TXP/TXM по времени и амплитуде | VTX_CM_AC_PP_ACTIVE | NA | NA | 50 | mV |
| Допустимое изменение напряжения при обнаружении приёмника | VTX_RCV_DETECT | NA | NA | 600 | mV |
| Деэмфазис TX | VTX_DE_RATIO | 3.0 | 3.5 | 4.0 | dB |
| Конденсатор AC-связи(USB3.1/PCIe) | CAC_COUPLING | 75 | NA | 200 | nF |
| Конденсатор AC-связи(SATA) | CAC_COUPLING | 6 | NA | 12 | nF |
| Время нарастания выхода 20–80% | Tr | 25 | NA | NA | ps |
| Время спада выхода 20–80% | Tf | 25 | NA | NA | ps |
| Ограничение короткого замыкания передатчика | ITX_SHORT | NA | NA | 20 | mA |
| Дифференциальный перекос выхода | TSKEW_DIFF | -15 | NA | 15 | ps |
| Приёмник |  |  |  |  |  |
| Входной размах напряжения | VRXDPP_C | 250 | NA | 1200 | mVpp |
| Входной дифференциальный импеданс | RRXD_C | 80 | 100 | 120 | Ohm |
| Согласование одиночных входных сопротивлений | RRXD_C_MS | NA | NA | 5 | % |

### 3.7 MIPI CDPHY

| Параметры | Обозначение | Описание | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LP-RX | VIH | Входное напряжение логической 1 | Все условия | 880 | NA | NA | mV |
| LP-RX | VIL | Напряжение логического 0 вне ULPS | Все условия | NA | NA | 550 | mV |
| Калибровка перекоса | Tskewcal (initial) | Длительность выдачи шаблона начальной калибровки перекоса | >1.5Gbps | NA | NA | 100 | us |
| Калибровка перекоса | Tskewcal (initial) | Длительность выдачи шаблона начальной калибровки перекоса | >1.5Gbps | 2^15 | NA | NA | UI |
| Калибровка перекоса | Tskewcal (periodic) | Длительность выдачи шаблона периодической калибровки перекоса | >1.5Gbps (необязательно) | NA | NA | 10 | us |
| Калибровка перекоса | Tskewcal (periodic) | Длительность выдачи шаблона периодической калибровки перекоса | >1.5Gbps (необязательно) | 2^13 | NA | NA | UI |

### 3.8 MIPI CSI DPHY

| Параметры | Обозначение | Минимум | Типовое | Максимум | Единицы |
| --- | --- | --- | --- | --- | --- |
| Синфазная помеха выше 450MHz | ΔVCMRX(HF) | NA | NA | 100 | mV |
| Синфазная помеха выше 450MHz | ΔVCMRX(HF) | NA | NA | 50 | mV |
| Common-mode interference 50MHz- 450MHz | ΔVCMRX(LF) | -50 | NA | 50 | mV |
| Common-mode interference 50MHz- 450MHz | ΔVCMRX(LF) | -25 | NA | 25 | mV |
| Синфазное согласование | CCM | NA | NA | 60 | pF |
| Подавление входного импульса | eSPIKE | NA | NA | 300 | V.ps |
| Минимальная длительность отклика | TMIN-RX | 20 | NA | NA | ns |
| Пиковая амплитуда помехи | VINT | NA | NA | 200 | mV |
| Частота помехи | fINT | 450 | NA | NA | MHz |

### 3.9 SARADC

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Разрешение |  |  | NA | 12 | NA | Bit |
| Диапазон аналогового входа (источник: Anglog) | AIN |  | AVSS18 | NA | AVDD18 | V |
| Дифференциальная нелинейность | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±1.0 | ±3.0 | LSB |
| Интегральная нелинейность | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±2.0 | ±6.0 | LSB |
| Верхняя ошибка смещения | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±10 | ±20 | LSB |
| Нижняя ошибка смещения | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±10 | ±20 | LSB |

### 3.10 TSADC

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Точность от −40°C до 125°C | TJACC | Температура: -40 ~ 125℃ Питание: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Диапазон измерения температуры | TRANGE |  | -40 | 25 | 125 | ℃ |
| Разрешение | TLSB |  | NA | 1 | NA | ℃ |

## 4. Тепловой режим

Для надёжной работы абсолютная максимальная температура перехода должна оставаться ниже 125°C. Тепловые значения получены моделированием и требуют проверки испытаниями. Плата: 10 слоёв, 200mm x 130mm, окружающая температура 25°C.

| Параметр | Обозначение | Типовое | Единица |
| --- | --- | --- | --- |
| Тепловое сопротивление переход–среда | 𝜽 𝑱𝑨 | 8.2 | (℃/𝑾) |
| Тепловое сопротивление переход–плата | 𝜽 𝑱𝑩 | 3.7 | (℃/𝑾) |
| Тепловое сопротивление переход–корпус | 𝜽 𝑱𝑪 | 0.01 | (℃/𝑾) |

## Сопоставление версий

Рабочая температура среды Rev1.0:−20…85°C; Rev1.2:0…80°C. Это пределы разных версий, не взаимозаменяемые номиналы платы. Новая версия добавляет LPDDR5X, временные требования дисплея/VOP и RK3588S2-DV. Старые имена абсолютного/рекомендуемого питания PMUIO2_1V8/VCCIO2_1V8/VCCIO4_1V8/VCCIO5_1V8/VCCIO6_1V8 стали PMUIO2/VCCIO2/VCCIO4/VCCIO5/VCCIO6 при тех же числах. Старый список памяти: LPDDR4/LPDDR4X/LPDDR5.

## Ограничения источника

На схеме шесть SPI, в §1.2.13 пять SPI0–SPI4. Два максимума ВЧ и два диапазона НЧ синфазных помех не снабжены условиями; все сохранены. Таблица задаёт максимум перехода125°C, тепловой текст требует ниже125°C. Главы регистров нет.

## Официальные материалы

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
