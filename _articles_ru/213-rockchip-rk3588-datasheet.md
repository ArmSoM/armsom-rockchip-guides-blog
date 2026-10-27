---
title: "Rockchip RK3588: характеристики, выводы и электрические пределы"
description: "Rockchip RK3588: характеристики, выводы и электрические пределы — Rev 2.0 / Rev 1.7"
excerpt: "Rockchip RK3588: характеристики, выводы и электрические пределы"
translation_key: "213-rockchip-rk3588-datasheet"
slug: "213-rockchip-rk3588-datasheet"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588","datasheet"]
---

{% raw %}

# Rockchip RK3588: характеристики, выводы и электрические пределы

Справочник для платформ ArmSoM описывает микросхему, а не гарантирует совместимость платы. Проверьте вариант, схему, питание и BSP. Рисунки и характеристики предоставлены Rockchip; испытания ArmSoM не проводились. Версии SDK/ядра не заданы.

Источники: Rev 2.0 (2025-04-25, каталог CN, 35 страниц) и Rev 1.7 (2023-11-17, каталог EN, 34 страницы). Оба оригинала английские. Основной текст следует 2.0; старые отличия сохранены ниже. Все рисунки взяты из английского оригинала 2.0.

## 1.1

RK3588 — энергоэффективный высокопроизводительный процессор для ПК на ARM, устройств периферийных вычислений, персональных мобильных интернет-устройств и других цифровых мультимедийных систем. Он объединяет четыре ядра Cortex-A76 и четыре Cortex-A55 с сопроцессорами NEON. Аппаратные блоки ускоряют ресурсоёмкие приложения: декодирование H.265 и VP9 достигает 8K@60fps, H.264 — 8K@30fps, AV1 — 4K@60fps. Кодирование H.264 и H.265 поддерживается до 8K@30fps; также встроены высококачественный кодек JPEG и специализированные блоки предварительной и последующей обработки изображений. Графический процессор 3D поддерживает OpenGLES 1.1, 2.0 и 3.2, OpenCL до 2.2 и Vulkan 1.2. Отдельный блок 2D с MMU ускоряет вывод изображения. Полностью аппаратный ISP обрабатывает до 48 мегапикселей и ускоряет HDR, 3A, LSC, 3DNR, 2DNR, повышение резкости, удаление дымки, коррекцию «рыбьего глаза» и гамма-коррекцию. NPU поддерживает смешанные операции INT4/INT8/INT16/FP16 с производительностью до 6 TOPS; допускается преобразование моделей TensorFlow, MXNet, PyTorch и Caffe. Четырёхканальный интерфейс внешней памяти поддерживает LPDDR4/LPDDR4X/LPDDR5/LPDDR5X и высокие требования к пропускной способности. Полный набор периферийных интерфейсов обеспечивает гибкость применения.

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

Видеовходы. Два комбинированных MIPI PHY работают как DPHY 1.2 (4 линии по 2.5Gbps) либо CPHY 1.1 (3 линии по 2.5Gsps). Ещё четыре CSI DPHY 1.2 имеют по 2 линии 2.5Gbps и попарно объединяются в 4 линии. Варианты камер: 2 DCPHY+4 двухлинейных CSI DPHY=6; 2 DCPHY+1 четырёхлинейный+2 двухлинейных=5; 2 DCPHY+2 четырёхлинейных=4. Один стандартный DVP 8/10/12/16 бит принимает до 150MHz, BT.601/BT.656/BT.1120, с настраиваемой полярностью pixel_clk/hsync/vsync. Однопортовый HDMI 2.0 RX PHY имеет 4 линии без боковых каналов. Скорости HDMI 2.0 — 3.4–6Gbps, HDMI 1.4 — 250Mbps–3.4Gbps. Скремблирование TMDS обеспечивает 2160p@60Hz RGB/YCbCr4:4:4/YCbCr4:2:2; YCbCr4:2:0 позволяет 2160p@60Hz при меньшей скорости. HDMI 1.4b поддерживает все CEA-861-E до 1080p@120Hz, 3840x2160p@24/25/30Hz, 4096x2160p@24Hz и 3D с тактом TMDS до 340MHz. Поддерживаются HDCP2.3/1.4.

## 1.2.9

ISP. VICAP поддерживает BT601/BT656/BT1120, шесть интерфейсов MIPI CSI/DSI с четырьмя ID на каждый, RAW8/10/12/14 и YUV422, режимы HDR виртуальных каналов/идентификационных кодов/счётчика строк и сквозную передачу RAW в ISP0/1. Максимум: два ISP — 48M 8064x6048@15 либо 32M 6528x4898@30; один ISP — 16M 4672x3504@30. Обработка: статистика 3A (AE/гистограмма, AF, AWB), удаление фиксированного шума FPN, коррекция чёрного BLC, статических/динамических групп дефектных пикселей DPCC, фазовый автофокус PDAF, затенение объектива LSC, пространственное Bayer-2DNR и временное Bayer-3DNR подавление RAW-шума, коррекция хроматических аберраций CAC, HDR из трёх кадров, сжатие диапазона/тональное отображение DRC, дисбаланс зелёного GIC, адаптивная демозаика Debayer с коррекцией аберраций, матрицы CCM/CSM и RGB2YUV, выходная гамма, автоматическое удаление дымки/улучшение эффектов, пользовательская палитра 3DLUT, только горизонтальная коррекция дисторсии LDCH, пространственное YUV-2DNR, резкость/фильтрация границ, приватная маска CMSK, локальное усиление GAIN и совместное использование ISP несколькими датчиками. FEC принимает RASTER YUV422SP/YUV422I/YUV420SP и выдаёт такие же RASTER либо FBCE YUV422SP/YUV420SP. Плотности сетки 16x8/32x16, уменьшение до 4 раз, разрешение 128x128–4095x4095, бикубическая интерполяция Y и билинейная C.

## 1.2.10

Дисплейные интерфейсы. Два комбинированных HDMI/eDP TX поддерживают x1/x2/x4; HDMI и eDP одного интерфейса одновременно не работают. HDMI FRL: 3/6/8/10/12Gbps; eDP: 1.62/2.7/5.4Gbps. HDMI достигает 7680x4320@60Hz, eDP — 4K@60Hz. HDMI: RGB/YUV до 10 бит, DSC1.2a, HDCP2.3; eDP: RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 бит на компонент, HDCP1.3. Для HDMI рекомендуется CTA-861; нестандартные HSYNC/HBP/HFP желательно выравнивать по 4 пикселям. Два DP TX1.4a совмещены с USB3.1 Gen1: 1/2/4 линии, 1.62/2.7/5.4/8.1Gbps, до 7680x4320@30Hz, RGB/YUV до 10 бит, SST, Type-C DP Alt Mode, HDCP2.3/1.3. Рекомендуется CTA-861; минимум нестандартных HSYNC/HBP/HFP — 16 пикселей. Два MIPI поддерживают DPHY2.0 (4 линии до 4.5Gbps) либо CPHY1.1 (3 трио до 2.0Gsps), до 4K@60Hz, двойной левый/правый дисплей, RGB до 10 бит, DSC1.1/1.2a. Минимумы HSYNC/HBP/HFP — 4 пикселя; HTOTAL/HACTIVE обязательно кратны 4; HSYNC/HBP/HFP рекомендуется делать кратными 4 (в последней строке источника опечатка HYSNC). BT.1120: до 1920x1080@60Hz и 150MHz.

## 1.2.11

Процессор видеовыхода. Максимумы: Video Port0 — 7680x4320@60Hz, Port1 и Port2 — по 4096x4320@60Hz, Port3 — 2048x1080@60Hz. Cluster0/1/2/3: вход/выход 4096x4320, AFBCD, RGB/YUV/YUYV, масштаб 4–1/4 и поворот. ESMART0/1/2/3: вход/выход 4096x4320, RGB/YUV/YUYV, масштаб 8–1/8 и четыре области. Наложение в RGB/YUV объединяет до восьми слоёв (четыре Cluster+четыре ESMART). Постобработка: HDR10/HLG, HDR2SDR/SDR2HDR, 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Обратная запись: ARGB8888/RGB888/RGB565/YUV420 до 1920x1080. HACTIVE должен быть кратен 4 пикселям. При разделении, двухканальном MIPI или YUV420 параметры POST HSYNC/HBP/HFP должны быть кратны 2. В видеорежиме MIPI DSC минимумы POST HSYNC/HBP/HFP — 16 пикселей, DSC_SYS_CTRL HSYNC/HBP/HFP — 8.

## 1.2.12

Аудиоинтерфейсы. I2S0 поддерживает до 8 TX либо 8 RX; I2S1 — до 8 TX и 8 RX. Оба: 16–32 бита, до 192kHz, программируемые ведущий/ведомый режимы, I2S обычный/с левым/правым выравниванием, PCM early/late1/late2/late3, TDM обычный, сдвиг влево на половину/один/два такта либо вправо. I2S/PCM/TDM одновременно не работают. I2S2/I2S3: по 2 TX и 2 RX, 16–32 бита, до 192kHz, ведущий/ведомый, те же три I2S и четыре PCM; одновременная работа I2S/PCM невозможна. SPDIF0/1 упаковывают два 16-битных отсчёта в одно 32-битное слово, выводят двухфазное стерео, выравнивают 16–31-битные данные влево/вправо в 32-битном буфере, передают линейный PCM 16/20/24 бит и нелинейный PCM. PDM0/1: до 8 каналов, 16–24 бита, до 192kHz, ведущий режим приёма. Цифровой кодек имеет два цифровых DAC, I2S/PCM ведущий/ведомый, 16-битные отсчёты, три режима смешивания каждого DAC и регулировку громкости. VAD читает I2S/PDM, обнаруживает амплитуду речи, сохраняет данные микрофонной решётки и формирует объединённое прерывание по уровню.

## 1.2.13

Связь. SDIO соответствует SDIO3.0, шина 4 бита. Два GMAC поддерживают RGMII 10/100/1000Mbps и RMII 10/100Mbps, полный/полудуплекс. USB3.1 Gen1 эквивалентен USB3.2 Gen1 и USB3.0, до 5Gbps. Два OTG USB3OTG_0/1 совмещены с DP TX; один Host USB3OTG_2 — с PIPE PHY2. Совместимость: USB3.0 revision1.0, USB2.0 кроме USB3OTG_2, xHCI1.1. Передачи: управляющие, пакетные со streams, прерывания и изохронные; возможны одновременные IN/OUT. Кэширование дескрипторов и предвыборка данных улучшают работу при больших задержках. Энергосбережение: USB2.0 LPM кроме USB3OTG_2 и USB3.1 U0/U1/U2/U3. Режим устройства: до 10 IN и 6 OUT оконечных точек, включая в обоих числах управляющую точку0; до 16 ресурсов передачи, по одному на точку; гибкая настройка для приложений/USB set-configuration; аппаратная обработка ERDY и пакетов burst; потоковые bulk-точки с автоматическим запуском перемещения данных; изохронные точки с буферами; гибкие дескрипторы с регулированием буферных прерываний, несколькими передачами, изохронными/управляющими передачами и разрозненными буферами. Хост xHCI: до 64 устройств, один источник прерываний, один USB2.0-порт кроме USB3OTG_2, один SuperSpeed-порт, стандартные/открытые драйверы xHCI и классов. DRD: фиксированные режимы устройства/хоста, USB3.1/USB2.0 OTG A/B по ID; USB3OTG_2 поддерживает только USB3.1 Gen1. SRP/HNP/RSP не поддерживаются. USB2.0 PHY определяет зарядку батареи; USB3OTG_0/1 поддерживают Type-C/DP Alt Mode; PHY USB3OTG_2 разделяется с PCIe/SATA. Два USB2.0-хоста поддерживают USB2.0, высокую/полную/низкую скорость 480/12/1.5Mbps и EHCI1.0/OHCI1.0a. Три Combo PIPE PHY работают с PCIe2.1/SATA3.0/USB3.1: PHY0/1 выбирают SATA либо PCIe2.1, PHY2 — SATA, PCIe2.1 либо USB3.1 Gen1. Каждый PCIe2.1: одна линия 5Gbps, PCI Express Base2.1, только RC. Каждый SATA: один порт 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. PCIe3.0: Base3.0, RC/EP, 2.5Gbps (1.1), 5Gbps (2.1), 8Gbps (3.0; в источнике 8Gps), объединение/разделение 1x4, 2x2, 4x1 либо 1x2+2x1 линий. Источник указывает «6 контроллеров SPI (SPI0–SPI4)»; противоречие числа и диапазона оставлено для уточнения. Поддерживаются два сигнала выбора и программируемый ведущий/ведомый SPI. Девять I2C0–I2C8 поддерживают адреса 7/10 бит и программируемую частоту до 100kbit/s Standard-mode либо 400kbit/s Fast-mode. Десять UART0–UART9 имеют раздельные FIFO TX/RX по 64 байта, передают/принимают 5/6/7/8 бит, поддерживают старт/стоп/чётность, различные входные такты для скорости до 4Mbps и автоматическое управление потоком на всех UART.

## 1.2.14

Прочие функции. Несколько групп GPIO поддерживают прерывание на каждом выводе, запуск по уровню/фронту, настройку полярности уровня, восходящего/нисходящего/обоих фронтов, слабой подтяжки вверх/вниз и силы драйвера. TS-ADC работает в пользовательском и автоматическом режимах. В пользовательском режиме start_of_conversion полностью управляется программно либо формируется аппаратно. Автоматический режим допускает настройку порогов прерываний высокой/низкой температуры и температуры сброса системы. Семь каналов имеют независимые температурные критерии; диапазон −40–125°C, разрешение 1°C. SARADC: 12 бит, до 1MS/s, восемь несимметричных входов. OTP: 32Kbit, верхнее адресное пространство 4k не защищено (обозначение источника сохранено). Защищённый режим поддерживает маски слов чтения/программирования; максимум программирования 32 бита, чтения 16 слов; состояния доступны для чтения, адрес неудачного программирования записывается. Корпус FCBGA1088L: 23mm x 23mm, диаметр шарика 0.36mm, шаг 0.65mm.

## 1.3 Блок-схема

![1-1. Блок-схема (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-1-1.png)

1-1. Блок-схема (английский оригинал).

Дополнительные подписи: общая память 1MB, шесть PVTM, два SPDIF с пометкой «8ch», системные регистры, SRAM/ROM/OTP. На схеме указано SD3.0/MMC4.5, в §1.2.2 — MMC4.51; различие сохранено.

## 2. Корпус

### 2.1 Заказ

RK3588 и RK3588-D соответствуют RoHS, корпус FCBGA1088L, поставка 600PCS в лотке. RK3588 — процессор приложений; RK3588-D добавляет Dolby.

### 2.2 Маркировка

Rockchip — бренд; RKXXXX — микросхема; ABC — код подрядчика; XXXXXX — партия кристаллов; DEFG — дата; NXXXXXX FXX — подпартия OSAT. Угловая метка обозначает первый вывод.

![2-1. Маркировка корпуса (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-2-1.png)

2-1. Маркировка корпуса (английский оригинал).

### 2.3 Размеры

![2-2. Вид корпуса сверху (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-2-2.png)

2-2. Вид корпуса сверху (английский оригинал).

![2-3. Вид корпуса снизу (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-2-3.png)

2-3. Вид корпуса снизу (английский оригинал).

![2-4. Вид корпуса сбоку (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-2-4.png)

2-4. Вид корпуса сбоку (английский оригинал).

![2-5. Размеры корпуса (английский оригинал).](/docs/rockchip-rk3588-datasheet/images/figure-2-5.png)

2-5. Размеры корпуса (английский оригинал).

| Обозначение | Минимум mm | Типовое mm | Максимум mm | Минимум дюйм | Типовое дюйм | Максимум дюйм |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.727 | 1.885 | 2.043 | 0.068 | 0.074 | 0.080 |
| A1 | 0.20 | 0.25 | 0.30 | 0.008 | 0.010 | 0.012 |
| A2 | 1.485 | 1.635 | 1.785 | 0.058 | 0.064 | 0.070 |
| c | 0.56 | 0.66 | 0.76 | 0.022 | 0.026 | 0.030 |
| D | 22.90 | 23.00 | 23.15 | 0.902 | 0.906 | 0.911 |
| E | 22.90 | 23.00 | 23.15 | 0.902 | 0.906 | 0.911 |
| D1 | — | 21.45 | — | — | 0.844 | — |
| E1 | — | 21.45 | — | — | 0.844 | — |
| e | — | 0.65 | — | — | 0.026 | — |
| b | 0.31 | 0.36 | 0.41 | 0.012 | 0.014 | 0.016 |

Допуски без разделения на минимум/типовое/максимум (mm/inch): aaa 0.20/0.008; ccc 0.35/0.014; ddd 0.15/0.006; eee 0.20/0.008; fff 0.08/0.003; MD/ME=34/34. Типовая колонка выше соответствует NOM оригинала.

### 2.4–2.5 Влагочувствительность и материал

MSL3; покрытие/шарики SnAgCu.

### 2.6 Полный список выводов

Таблица 2-1, страницы 20–28. Имена сигналов и варианты мультиплексирования сохранены как идентификаторы.

| Имя вывода | Вывод | Имя вывода | Вывод |
| --- | --- | --- | --- |
| VSS_1 | A1 | VSS_12 | C5 |
| DDR_CH1_DQ10_C | A2 | VSS_13 | C6 |
| DDR_CH1_DQ8_C | A3 | VSS_14 | C7 |
| DDR_CH1_DQ14_C | A4 | VSS_15 | C8 |
| DDR_CH1_DQ12_C | A5 | VSS_16 | C9 |
| DDR_CH1_DQ4_C | A6 | DDR_CH0_DQ15_B | D1 |
| DDR_CH1_DQ6_C | A7 | DDR_CH0_DQ8_B | D2 |
| DDR_CH1_DQ0_C | A8 | VSS_34 | D3 |
| DDR_CH1_DQ2_C | A9 | DDR_CH1_DM1_C | D4 |
| DDR_CH1_A4_C | A10 | DDR_CH1_DQS1N_C | D5 |
| VSS_2 | A11 | DDR_CH1_WCK1P_C | D7 |
| DDR_CH1_CKB_C | A12 | DDR_CH1_DQS0N_C | D9 |
| DDR_CH1_CKB_D | A13 | DDR_CH1_A6_C | D10 |
| VSS_3 | A14 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_C | D11 |
| DDR_CH1_A4_D | A15 | DDR_CH1_A3_C | D13 |
| DDR_CH1_DQ2_D | A16 | DDR_CH1_A6_D | D14 |
| DDR_CH1_DQ0_D | A17 | DDR_CH1_LP4/4X_CKE0/LP5_CS0_D | D16 |
| DDR_CH1_DQ6_D | A18 | DDR_CH1_WCK0N_D | D17 |
| DDR_CH1_DQ4_D | A19 | DDR_CH1_LP4/4X_CS1_D | D19 |
| DDR_CH1_DQ12_D | A20 | DDR_CH1_DM0_D | D20 |
| DDR_CH1_DQ14_D | A21 | DDR_CH1_DQS1P_D | D21 |
| DDR_CH1_DQ8_D | A22 | DDR_CH1_DM1_D | D22 |
| DDR_CH1_DQ10_D | A23 | VSS_35 | D23 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0_d | A24 | VSS_36 | D24 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1_d | A25 | PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1_d | D25 |
| VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2_d | A26 | PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2_d | D26 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3_d | A27 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3_d | D27 |
| PCIE30_PORT1_REF_CLKP | A28 | I2S0_SDI0/GPIO1_D4_d | D28 |
| PCIE30_PORT1_TX0N | A30 | PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6_d | D29 |
| PCIE30_PORT1_RX0N | A32 | I2S0_LRCK/I2C2_SCL_M3/UART4_RTSN/GPIO1_C5_d | D30 |
| PCIE30_PORT1_RESREF | A33 | VSS_37 | D31 |
| VSS_4 | A34 | PCIE30_PORT0_TX0P | D32 |
| DDR_CH0_DQ14_A | AA1 | PCIE30_PORT0_TX0N | D33 |
| DDR_CH0_DQ15_A | AA2 | DDR_CH0_DQ13_B | E1 |
| VSS_248 | AA3 | DDR_CH0_DQ14_B | E2 |
| DDR_CH0_DQS1N_A | AA4 | VSS_38 | E3 |
| DDR_CH0_DQS1P_A | AA5 | DDR_CH0_DM1_B | E4 |
| VSS_249 | AA6 | DDR_CH1_DQS1P_C | E5 |
| VCCIO2_1V8 | AA7 | VSS_39 | E6 |
| AVSS_15 | AA8 | DDR_CH1_WCK1N_C | E7 |
| HDMI/eDP_TX0_VDD_0V75 | AA9 | VSS_40 | E8 |
| AVSS_16 | AA10 | DDR_CH1_DQS0P_C | E9 |
| VSS_250 | AA11 | DDR_CH1_RESET_C | E10 |
| VDD_GPU_MEM_0 | AA12 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_C | E11 |
| VDD_GPU_0 | AA13 | VSS_41 | E12 |
| VDD_GPU_7 | AA14 | DDR_CH1_A2_C | E13 |
| VDD_GPU_11 | AA15 | DDR_CH1_A3_D | E14 |
| VSS_251 | AA16 | DDR_CH1_LP4/4X_CKE1/LP5_CS1_D | E16 |
| VSS_252 | AA17 | DDR_CH1_WCK0P_D | E17 |
| VSS_253 | AA18 | VSS_42 | E18 |
| VSS_254 | AA19 | DDR_CH1_LP4/4X_CS0_D | E19 |
| VSS_255 | AA20 | VSS_43 | E20 |
| VSS_256 | AA21 | DDR_CH1_DQS1N_D | E21 |
| VSS_257 | AA22 | VSS_44 | E22 |
| VSS_258 | AA23 | VSS_45 | E23 |
| VSS_259 | AA24 | PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4_u | E24 |
| MIPI_CSI1_AVCC0V75 | AA25 | PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5_u | E25 |
| MIPI_CSI1_AVCC1V8 | AA26 | MIPI_CAMERA1_CLK_M0/SPDIF0_TX_M0/PCIE30X2_WAKEN_M3/HDMI_RX_HPDIN_M2/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6_u | E26 |
| HDMI_TX0_HPD_M1/PCIE30X2_PERSTN_M2/HDMI_RX_HPDIN_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4_d | AA27 | MIPI_CAMERA2_CLK_M0/SPDIF1_TX_M0/PCIE30X2_PERSTN_M3/HDMI_RX_CEC_M2/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7_u | E27 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7_d | AA28 | I2S0_SDI1/PDM0_SDI3_M0/I2C1_SDA_M4/UART4_RX_M0/PWM1_M1/SPI1_CS0_M2/GPIO1_D3_d | E28 |
| GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0_u | AA29 | I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7_d | E29 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1_u | AA30 | PDM0_CLK1_M0/I2C2_SDA_M3/PWM11_IR_M2/SPI4_CS1_M0/GPIO1_C4_d | E30 |
| VSS_260 | AA31 | I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3_d | E31 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5_u | AA32 | VSS_46 | E32 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3_u | AA33 | PCIE30_PORT0_REF_CLKP | E33 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3_d | AA34 | PCIE30_PORT0_REF_CLKN | E34 |
| DDR_CH0_DQ9_A | AB1 | DDR_CH0_DQ4_B | F1 |
| DDR_CH0_DQ8_A | AB2 | DDR_CH0_DQ12_B | F2 |
| VSS_261 | AB3 | VSS_47 | F3 |
| DDR_CH0_DM1_A | AB4 | DDR_CH0_DQS1N_B | F4 |
| VSS_262 | AB5 | DDR_CH0_DQS1P_B | F5 |
| AVSS_17 | AB6 | VSS_48 | F7 |
| AVSS_18 | AB7 | DDR_CH1_DM0_C | F8 |
| AVSS_19 | AB8 | VSS_49 | F9 |
| HDMI/eDP_TX0_AVDD_0V75 | AB9 | VSS_50 | F10 |
| AVSS_20 | AB10 | VSS_51 | F11 |
| VSS_263 | AB11 | DDR_CH1_A1_C | F12 |
| VDD_GPU_MEM_1 | AB12 | VSS_52 | F13 |
| VDD_GPU_1 | AB13 | VSS_53 | F14 |
| VDD_GPU_6 | AB14 | VSS_54 | F15 |
| VDD_GPU_10 | AB15 | VSS_55 | F16 |
| VSS_264 | AB16 | DDR_CH1_ZQ_D | F18 |
| VSS_265 | AB17 | VSS_56 | F19 |
| VSS_266 | AB18 | VSS_57 | F20 |
| VSS_267 | AB19 | VSS_58 | F21 |
| VSS_268 | AB20 | VSS_59 | F22 |
| VDD_NPU_6 | AB21 | VSS_60 | F23 |
| VDD_NPU_5 | AB22 | MIPI_CAMERA3_CLK_M0/HDMI_RX_SCL_M2/I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6_u | F24 |
| VDD_NPU_2 | AB23 | MIPI_CAMERA4_CLK_M0/PCIE30X2_CLKREQN_M3/HDMI_RX_SDA_M2/I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7_u | F25 |
| VSS_269 | AB24 | I2S0_SDO1/I2C7_SCL_M0/UART6_TX_M2/SPI1_MISO_M2/GPIO1_D0_d | F26 |
| MIPI_CSI0_AVCC0V75 | AB25 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/I2C7_SDA_M0/UART6_RX_M2/SPI1_MOSI_M2/GPIO1_D1_d | F27 |
| MIPI_CSI0_AVCC1V8 | AB26 | I2S0_SDO3/I2S0_SDI2/PDM0_SDI2_M0/I2C1_SCL_M4/UART4_TX_M0/PWM0_M1/SPI1_CLK_M2/GPIO1_D2_d | F28 |
| VSS_270 | AB27 | I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2__d | F30 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5_d | AB28 | VSS_61 | F31 |
| VSS_271 | AB29 | PCIE30_PORT0_RX1P | F32 |
| GMAC0_PPSTRING/FSPI_CS1N_M1/HDMI_TX1_SCL_M0/I2C4_SCL_M1/UART7_TX_M0/GPIO2_B5_u | AB30 | PCIE30_PORT0_RX1N | F33 |
| GMAC0_PTP_REFCLK/FSPI_CS0N_M1/HDMI_TX1_SDA_M0/I2C4_SDA_M1/UART7_RX_M0/GPIO2_B4_u | AB31 | DDR_CH0_DQ6_B | G1 |
| VSS_272 | AB32 | DDR_CH0_DQ5_B | G2 |
| GMAC0_MDIO/I2C0_SCL_M1/UART9_CTSN_M0/PWM6_M2/SPI3_MOSI_M0/GPIO4_C5_d | AB33 | VSS_62 | G3 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/SPI3_MISO_M0/GPIO4_C4_d | AB34 | DDR_CH0_DM0_B | G4 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | G6 |
| DDR_CH0_DQ11_A | AC2 | DDR_CH1_ZQ_C | G8 |
| VSS_273 | AC3 | DDR_CH1_WCK0P_C | G9 |
| VSS_274 | AC4 | VSS_64 | G10 |
| AVSS_21 | AC5 | DDR_CH1_LP4/4X_CS0_C | G11 |
| HDMI/eDP_TX0_VDD_CMN_1V8 | AC6 | DDR_CH1_A0_C | G12 |
| HDMI/eDP_TX0_VDD_IO_1V8 | AC7 | DDR_CH1_A2_D | G13 |
| AVSS_22 | AC8 | DDR_CH1_A1_D | G14 |
| HDMI/eDP_TX1_AVDD_0V75 | AC9 | VSS_65 | G15 |
| AVSS_23 | AC10 | DDR_CH1_DQS0N_D | G16 |
| VSS_275 | AC11 | DDR_CH1_WCK1N_D | G18 |
| VSS_276 | AC12 | VSS_66 | G19 |
| VDD_GPU_2 | AC13 | VCCIO1_1V8 | G20 |
| VDD_GPU_5 | AC14 | VSS_67 | G21 |
| VDD_GPU_9 | AC15 | VSS_68 | G22 |
| VSS_277 | AC16 | PCIE30_PORT0_AVDD1V8 | G23 |
| VDD_LOGIC_5 | AC17 | PCIE30_PORT0_AVDD0V75 | G24 |
| VDD_LOGIC_4 | AC18 | VSS_69 | G25 |
| VDD_LOGIC_3 | AC19 | PDM0_SDI0_M0/SPI1_CS1_M2/GPIO1_D5_d | G26 |
| VSS_278 | AC20 | I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1_z | G27 |
| VSS_279 | AC21 | I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0_z | G29 |
| VDD_NPU_4 | AC22 | PCIE20_2_REFCLKN | G30 |
| VDD_NPU_1 | AC23 | PCIE20_2_REFCLKP | G31 |
| VSS_280 | AC24 | VSS_70 | G32 |
| VCCIO6_1V8 | AC25 | PCIE30_PORT0_RX0P | G33 |
| VCCIO6 | AC26 | PCIE30_PORT0_RX0N | G34 |
| VSS_281 | AC27 | DDR_CH0_DQ0_B | H1 |
| GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3_u | AC28 | DDR_CH0_DQ7_B | H2 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4_u | AC29 | VSS_71 | H3 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4_d | AC30 | DDR_CH0_WCK1P_B | H4 |
| GMAC0_RXD3/SDIO_D1_M0/FSPI_D1_M1/UART6_TX_M0/GPIO2_A7_u | AC31 | DDR_CH0_WCK1N_B | H5 |
| GMAC0_RXD2/SDIO_D0_M0/FSPI_D0_M1/UART6_RX_M0/GPIO2_A6_u | AC32 | VSS_72 | H6 |
| GMAC0_TXD2/SDIO_D3_M0/FSPI_D3_M1/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1_u | AC33 | DDR_CH0_ZQ_B | H7 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2_u | AC34 | DDR_CH1_WCK0N_C | H9 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1_u | AD1 | VSS_73 | H10 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0_u | AD2 | DDR_CH1_LP4/4X_CS1_C | H11 |
| OTP_VDDOTP_0V75 | AD3 | VSS_74 | H12 |
| NC | AD4 | DDR_CH1_VDDQ_CKE | H13 |
| AVSS_24 | AD5 | VSS_75 | H14 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AD6 | DDR_CH1_A0_D | H15 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AD7 | DDR_CH1_DQS0P_D | H16 |
| AVSS_25 | AD8 | DDR_CH1_WCK1P_D | H18 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | H19 |
| AVSS_26 | AD10 | VCCIO4_1V8 | H20 |
| VSS_282 | AD11 | VCCIO4 | H21 |
| VSS_283 | AD12 | VSS_77 | H22 |
| VDD_GPU_3 | AD13 | PCIE30_PORT1_AVDD1V8 | H23 |
| VDD_GPU_4 | AD14 | PCIE30_PORT1_AVDD0V75 | H24 |
| VDD_GPU_8 | AD15 | VSS_78 | H25 |
| VSS_284 | AD16 | VSS_79 | H26 |
| VDD_LOGIC_0 | AD17 | AVSS_1 | H28 |
| VDD_LOGIC_1 | AD18 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | H29 |
| VDD_LOGIC_2 | AD19 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | H30 |
| VSS_285 | AD20 | AVSS_2 | H31 |
| VSS_286 | AD21 | PCIE20_1_REFCLKP | H32 |
| VDD_NPU_3 | AD22 | PCIE20_1_REFCLKN | H33 |
| VDD_NPU_0 | AD23 | DDR_CH0_DQ2_B | J1 |
| VSS_287 | AD24 | DDR_CH0_DQ1_B | J2 |
| VSS_288 | AD25 | VSS_80 | J3 |
| VSS_289 | AD26 | VSS_81 | J4 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2_u | AD27 | VSS_82 | J5 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4_d | AD28 | VSS_83 | J6 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5_u | AD29 | DDR_CH0_DQS0N_B | J7 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3_d | AD30 | DDR_CH0_DQS0P_B | J8 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2_d | AD31 | VSS_84 | J10 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1_d | AD32 | VSS_85 | J11 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6_d | AD33 | VSS_86 | J12 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7_d | AD34 | VSS_87 | J13 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5_d | AE1 | VSS_88 | J14 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4_u | AE2 | VSS_89 | J15 |
| VSS_290 | AE3 | VSS_90 | J16 |
| HDMI_RX_VPH3V3 | AE4 | VSS_91 | J18 |
| HDMI_RX_DVDD3V3 | AE5 | VSS_92 | J19 |
| AVSS_27 | AE6 | VSS_93 | J20 |
| AVSS_28 | AE7 | VSS_94 | J21 |
| HDMI_RX_AVDD0V75 | AE8 | VSS_95 | J22 |
| AVSS_29 | AE9 | VSS_96 | J23 |
| VSS_291 | AE11 | VSS_97 | J24 |
| VSS_292 | AE12 | VSS_98 | J25 |
| VSS_293 | AE13 | AVSS_3 | J27 |
| VSS_294 | AE14 | AVSS_4 | J28 |
| VSS_295 | AE15 | AVSS_5 | J29 |
| VSS_296 | AE16 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | J30 |
| VSS_297 | AE18 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | J31 |
| VSS_298 | AE19 | AVSS_6 | J32 |
| VSS_299 | AE20 | PCIE20_1_RXP/SATA30_1_RXP | J33 |
| VSS_300 | AE21 | PCIE20_1_RXN/SATA30_1_RXN | J34 |
| VDD_NPU_MEM_0 | AE22 | DDR_CH0_A4_B | K1 |
| VDD_NPU_MEM_1 | AE23 | DDR_CH0_DQ3_B | K2 |
| VSS_301 | AE24 | VSS_99 | K3 |
| VSS_302 | AE26 | DDR_CH0_WCK0N_B | K4 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3_u | AE27 | DDR_CH0_WCK0P_B | K5 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2_d | AE28 | VSS_100 | K6 |
| GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6_d | AE29 | DDR_CH0_RESET_B | K7 |
| CLK32K_OUT1/GPIO2_C5_d | AE30 | VSS_101 | K8 |
| GMAC0_RXDV_CRS/UART7_RTSN_M0/PWM2_M2/SPI3_CS0_M0/GPIO4_C2_d | AE31 | VSS_102 | K9 |
| GMAC0_RXCLK/SDIO_D2_M0/FSPI_D2_M1/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0_u | AE32 | DDR_CH1_VDDQ_0 | K11 |
| GMAC0_TXCLK/SDIO_CLK_M0/FSPI_CLK_M1/I2C3_SDA_M3/GPIO2_B3_d | AE33 | DDR_CH1_VDDQ_1 | K12 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0_d | AE34 | DDR_CH1_VDDQ_2 | K13 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3_u | AF1 | DDR_CH1_VDDQ_3 | K14 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2_u | AF2 | DDR_CH1_VDDQ_4 | K15 |
| HDMI_RX_REXT | AF3 | DDR_CH1_PLL_AVDD1V8 | K16 |
| AVSS_30 | AF4 | VSS_103 | K18 |
| HDMI_RX_CLKN | AF5 | VDD_LOGIC_8 | K19 |
| HDMI_RX_CLKP | AF6 | VDD_LOGIC_9 | K20 |
| AVSS_31 | AF7 | VSS_104 | K21 |
| AVSS_32 | AF8 | VSS_105 | K22 |
| AVSS_33 | AF11 | VDD_CPU_BIG1_9 | K23 |
| AVSS_34 | AF12 | VDD_CPU_BIG1_0 | K24 |
| AVSS_35 | AF13 | AVSS_7 | K26 |
| AVSS_36 | AF14 | PCIE20_SATA30_USB30_2_AVDD_1V8 | K27 |
| AVSS_37 | AF15 | PCIE20_SATA30_USB30_2_AVDD_0V85 | K28 |
| AVSS_38 | AF16 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2_u | K29 |
| TSADC_TEST_OUT_TS | AF18 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1_z | K30 |
| MIPI_D/C_PHY1_VREG | AF19 | AVSS_8 | K31 |
| MIPI_D/C_PHY0_VREG | AF20 | AVSS_9 | K32 |
| AVSS_39 | AF21 | PCIE20_1_TXP/SATA30_1_TXP | K33 |
| VSS_303 | AF22 | PCIE20_1_TXN/SATA30_1_TXN | K34 |
| VSS_304 | AF24 | VSS_106 | L1 |
| VSS_305 | AF25 | DDR_CH0_A5_B | L2 |
| VSS_306 | AF27 | VSS_107 | L3 |
| VSS_307 | AF28 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_B | L4 |
| VSS_308 | AF29 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_B | L5 |
| VSS_309 | AF30 | VSS_108 | L6 |
| VSS_310 | AF31 | DDR_CH0_LP4/4X_CS0_B | L7 |
| VSS_311 | AF32 | DDR_CH0_LP4/4X_CS1_B | L8 |
| GMAC0_TXER/I2C0_SDA_M1/UART7_CTSN_M0/PWM7_IR_M3/SPI3_CLK_M0/GPIO4_C6_d | AF33 | VSS_109 | L9 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/SPI3_CS1_M0/GPIO4_C3_d | AF34 | DDR_CH0_VDDQ_CK | L10 |
| HDMI_TX0_SBDN/eDP_TX0_AUXN | AG1 | DDR_CH1_VDD_0 | L11 |
| HDMI_TX0_SBDP/eDP_TX0_AUXP | AG2 | DDR_CH1_VDD_1 | L12 |
| AVSS_40 | AG3 | DDR_CH1_VDD_2 | L13 |
| HDMI_RX_D0N | AG4 | DDR_CH1_VDD_3 | L14 |
| HDMI_RX_D0P | AG5 | DDR_CH1_PLL_DVDD | L15 |
| AVSS_41 | AG6 | DDR_CH1_PLL_AVSS | L16 |
| AVSS_42 | AG7 | DDR_CH1_VDD_MIF_0 | L17 |
| USB20_HOST0_REXT | AG9 | DDR_CH1_VDD_MIF_1 | L18 |
| AVSS_43 | AG10 | VSS_110 | L19 |
| USB20_AVDD_1V8 | AG11 | VSS_111 | L20 |
| AVSS_44 | AG12 | VSS_112 | L21 |
| TYPEC1_DP1_VDDH_1V8 | AG13 | VSS_113 | L22 |
| TYPEC0_DP0_VDDH_1V8 | AG14 | VDD_CPU_BIG1_8 | L23 |
| AVSS_45 | AG15 | VDD_CPU_BIG1_1 | L24 |
| TYPEC1_DP1_REXT | AG16 | VSS_114 | L25 |
| AVSS_46 | AG18 | AVSS_10 | L26 |
| MIPI_D/C_PHY1_VDD | AG19 | PCIE20_SATA30_1_AVDD_1V8 | L27 |
| MIPI_D/C_PHY0_VDD | AG20 | PCIE20_SATA30_1_AVDD_0V85 | L28 |
| AVSS_47 | AG21 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3_z | L29 |
| AVSS_48 | AG22 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0_z | L30 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/HDMI_RX_CEC_M1/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1_d | AG23 | AVSS_11 | L31 |
| CIF_D15/PCIE30X2_WAKEN_M2/HDMI_RX_SDA_M1/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3_d | AG24 | PCIE20_0_REFCLKP | L32 |
| CIF_D14/PCIE30X2_CLKREQN_M2/HDMI_RX_SCL_M1/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2_d | AG25 | PCIE20_0_REFCLKN | L33 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6_u | AG26 | DDR_CH0_CKB_B | M1 |
| GMAC1_RXD1/MIPI_CAMERA3_CLK_M1/PWM9_M0/GPIO3_B0_u | AG28 | DDR_CH0_CK_B | M2 |
| GMAC1_RXD0/MIPI_CAMERA2_CLK_M1/PWM8_M0/GPIO3_A7_u | AG29 | VSS_115 | M3 |
| VSS_312 | AG30 | DDR_CH0_A1_B | M5 |
| MIPI_CSI1_D0P | AG31 | VSS_116 | M6 |
| MIPI_CSI1_D0N | AG32 | DDR_CH0_A6_B | M7 |
| MIPI_CSI0_D0P | AG33 | DDR_CH0_A0_B | M8 |
| MIPI_CSI0_D0N | AG34 | VSS_117 | M9 |
| HDMI_TX0_D3N/eDP_TX0_D3N | AH2 | DDR_CH0_VDDQ_0 | M10 |
| HDMI_TX0_D3P/eDP_TX0_D3P | AH3 | DDR_CH0_PLL_AVSS | M11 |
| AVSS_49 | AH4 | DDR_CH0_PLL_AVDD1V8 | M12 |
| HDMI_RX_D1N | AH5 | DDR_CH1_VDDQ_CK | M13 |
| HDMI_RX_D1P | AH6 | VSS_118 | M14 |
| AVSS_50 | AH8 | VSS_119 | M15 |
| USB20_HOST1_REXT | AH9 | VDD_CPU_BIG0_0 | M16 |
| USB20_DVDD_0V75 | AH10 | VDD_CPU_BIG0_9 | M17 |
| AVSS_51 | AH11 | VSS_120 | M18 |
| AVSS_52 | AH12 | VDD_CPU_BIG0_MEM_0 | M19 |
| TYPEC1_DP1_VDD_0V85 | AH13 | VSS_121 | M20 |
| TYPEC0_DP0_VDDA_0V85 | AH14 | VDD_CPU_BIG1_MEM_0 | M21 |
| AVSS_53 | AH15 | VSS_122 | M22 |
| TYPEC0_DP0_REXT | AH16 | VDD_CPU_BIG1_7 | M23 |
| SARADC_AVDD_1V8 | AH18 | VDD_CPU_BIG1_2 | M24 |
| MIPI_D/C_PHY1_VDD_1V2 | AH19 | VSS_123 | M25 |
| MIPI_D/C_PHY0_VDD_1V2 | AH20 | AVSS_12 | M26 |
| AVSS_54 | AH21 | PCIE20_SATA30_0_AVDD_1V8 | M27 |
| AVSS_55 | AH22 | PCIE20_SATA30_0_AVDD_0V85 | M28 |
| AVSS_56 | AH23 | TVSS | M29 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0_u | AH24 | PMIC_INT_L/GPIO0_A7_u | M30 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5_u | AH25 | NPOR_u | M31 |
| CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4_u | AH26 | AVSS_13 | M32 |
| ETH1_REFCLKO_25M/MIPI_CAMERA1_CLK_M1/I2C4_SCL_M0/GPIO3_A6_d | AH27 | PCIE20_0_TXN/SATA30_0_TXN | M33 |
| GMAC1_RXDV_CRS/MIPI_CAMERA4_CLK_M1/UART2_TX_M2/PWM2_M1/GPIO3_B1_d | AH29 | PCIE20_0_TXP/SATA30_0_TXP | M34 |
| GMAC1_RXCLK/SDIO_CLK_M1/MIPI_CAMERA0_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5_d | AH30 | DDR_CH0_CKB_A | N1 |
| MIPI_CSI1_D1P | AH31 | DDR_CH0_CK_A | N2 |
| MIPI_CSI1_D1N | AH32 | VSS_124 | N3 |
| MIPI_CSI0_D1P | AH33 | DDR_CH0_A3_B | N4 |
| MIPI_CSI0_D1N | AH34 | DDR_CH0_A2_B | N5 |
| HDMI_TX0_D0N/eDP_TX0_D0N | AJ1 | VSS_125 | N6 |
| HDMI_TX0_D0P/eDP_TX0_D0P | AJ2 | DDR_CH0_LP4/4X_CKE1/LP5_CS1_A | N7 |
| AVSS_57 | AJ3 | DDR_CH0_VDDQ_CKE | N8 |
| HDMI_RX_D2N | AJ4 | VSS_126 | N9 |
| HDMI_RX_D2P | AJ5 | DDR_CH0_VDDQ_1 | N10 |
| AVSS_58 | AJ7 | VSS_127 | N11 |
| AVSS_59 | AJ8 | DDR_CH0_PLL_DVDD | N12 |
| AVSS_60 | AJ9 | DDR_CH0_VDD_MIF_0 | N13 |
| USB20_AVDD_3V3 | AJ10 | VSS_128 | N14 |
| AVSS_61 | AJ11 | VSS_129 | N15 |
| AVSS_62 | AJ12 | VDD_CPU_BIG0_1 | N16 |
| TYPEC1_DP1_VDDA_0V85 | AJ13 | VDD_CPU_BIG0_8 | N17 |
| TYPEC0_DP0_VDD_0V85 | AJ14 | VSS_130 | N18 |
| AVSS_63 | AJ15 | VDD_CPU_BIG0_MEM_1 | N19 |
| AVSS_64 | AJ16 | VSS_131 | N20 |
| AVSS_65 | AJ18 | VDD_CPU_BIG1_MEM_1 | N21 |
| MIPI_D/C_PHY1_VDD_1V8 | AJ19 | VSS_132 | N22 |
| MIPI_D/C_PHY0_VDD_1V8 | AJ20 | VDD_CPU_BIG1_6 | N23 |
| AVSS_66 | AJ21 | VDD_CPU_BIG1_3 | N24 |
| AVSS_67 | AJ22 | VSS_133 | N25 |
| AVSS_68 | AJ23 | VSS_134 | N26 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7_u | AJ24 | OSC_1V8 | N27 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0_u | AJ25 | PMUIO1_1V8 | N28 |
| BT1120_D11/PCIE30X4_WAKEN_M1/HDMI_RX_CEC_M0/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5_d | AJ26 | VSS_135 | N29 |
| BT1120_D12/PCIE30X4_PERSTN_M1/HDMI_RX_HPDIN_M0/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6_d | AJ27 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6_z | N30 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7_u | AJ28 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5_d | N31 |
| VSS_313 | AJ30 | AVSS_14 | N32 |
| MIPI_CSI1_CLK0P | AJ31 | PCIE20_0_RXP/SATA30_0_RXP | N33 |
| MIPI_CSI1_CLK0N | AJ32 | PCIE20_0_RXN/SATA30_0_RXN | N34 |
| MIPI_CSI0_CLK0P | AJ33 | VSS_136 | P1 |
| MIPI_CSI0_CLK0N | AJ34 | DDR_CH0_A5_A | P2 |
| HDMI_TX0_D1N/eDP_TX0_D1N | AK2 | VSS_137 | P3 |
| HDMI_TX0_D1P/eDP_TX0_D1P | AK3 | DDR_CH0_A2_A | P4 |
| AVSS_69 | AK4 | DDR_CH0_A3_A | P5 |
| AVSS_70 | AK5 | VSS_138 | P6 |
| USB20_HOST0_DP | AK6 | DDR_CH0_LP4/4X_CKE0/LP5_CS0_A | P7 |
| AVSS_71 | AK7 | VSS_139 | P8 |
| TYPEC1_USB20_OTG_ID | AK8 | VSS_140 | P9 |
| TYPEC1_USB20_OTG_DP | AK9 | DDR_CH0_VDDQ_2 | P10 |
| AVSS_72 | AK10 | VSS_141 | P11 |
| AVSS_73 | AK11 | DDR_CH0_VDD_3 | P12 |
| AVSS_74 | AK12 | DDR_CH0_VDD_MIF_1 | P13 |
| AVSS_75 | AK13 | VSS_142 | P14 |
| AVSS_76 | AK14 | VSS_143 | P15 |
| SARADC_IN5 | AK15 | VDD_CPU_BIG0_2 | P16 |
| SARADC_IN2 | AK16 | VDD_CPU_BIG0_7 | P17 |
| SARADC_IN7 | AK17 | VSS_144 | P18 |
| MIPI_DPHY1_RX_D0P/MIPI_CPHY1_RX_TRIO0_B | AK18 | VSS_145 | P19 |
| MIPI_DPHY1_RX_D1P/MIPI_CPHY1_RX_TRIO1_A | AK19 | VSS_146 | P20 |
| MIPI_DPHY1_RX_CLKP/MIPI_CPHY1_RX_TRIO1_C | AK20 | VSS_147 | P21 |
| MIPI_DPHY1_RX_D2P/MIPI_CPHY1_RX_TRIO2_B | AK21 | VSS_148 | P22 |
| MIPI_DPHY1_RX_D3P/NO_USE | AK22 | VDD_CPU_BIG1_5 | P23 |
| AVSS_77 | AK23 | VDD_CPU_BIG1_4 | P24 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1_d | AK24 | VSS_149 | P25 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2_u | AK25 | VSS_150 | P26 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/PCIE30X2_PERSTN_M1/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0_d | AK26 | PMU_0V75 | P27 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5_d | AK27 | PMUIO2 | P28 |
| VSS_314 | AK28 | I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5_d | P29 |
| VSS_315 | AK29 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5_u | P30 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0_d | AK30 | SDMMC_DET/GPIO0_A4_u | P31 |
| MIPI_CSI1_D2P | AK31 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1_z | P32 |
| MIPI_CSI1_D2N | AK32 | REFCLK_OUT/GPIO0_A0_d | P33 |
| MIPI_CSI0_D2P | AK33 | VSS_151 | P34 |
| MIPI_CSI0_D2N | AK34 | DDR_CH0_A4_A | R1 |
| HDMI_TX0_D2N/eDP_TX0_D2N | AL1 | DDR_CH0_DQ3_A | R2 |
| HDMI_TX0_D2P/eDP_TX0_D2P | AL2 | VSS_152 | R3 |
| AVSS_78 | AL3 | VSS_153 | R5 |
| AVSS_79 | AL4 | DDR_CH0_LP4/4X_CS0_A | R6 |
| AVSS_80 | AL5 | DDR_CH0_LP4/4X_CS1_A | R7 |
| USB20_HOST0_DM | AL6 | VSS_154 | R8 |
| USB20_HOST1_DP | AL7 | VSS_155 | R9 |
| TYPEC1_USB20_VBUSDET | AL8 | DDR_CH0_VDDQ_3 | R10 |
| TYPEC1_USB20_OTG_DM | AL9 | VSS_156 | R11 |
| TYPEC1_SBU1/DP1_AUXP | AL10 | DDR_CH0_VDD_2 | R12 |
| AVSS_81 | AL11 | VSS_157 | R13 |
| TYPEC0_USB20_OTG_DP | AL12 | VDD_VDENC_0 | R14 |
| AVSS_82 | AL13 | VSS_158 | R15 |
| TYPEC0_USB20_OTG_ID | AL14 | VDD_CPU_BIG0_3 | R16 |
| TYPEC0_SBU1/DP0_AUXP | AL15 | VDD_CPU_BIG0_6 | R17 |
| SARADC_IN1 | AL16 | VSS_159 | R18 |
| SARADC_IN6 | AL17 | VSS_160 | R19 |
| MIPI_DPHY1_RX_D0N/MIPI_CPHY1_RX_TRIO0_A | AL18 | VSS_161 | R20 |
| MIPI_DPHY1_RX_D1N/MIPI_CPHY1_RX_TRIO0_C | AL19 | VSS_162 | R21 |
| MIPI_DPHY1_RX_CLKN/MIPI_CPHY1_RX_TRIO1_B | AL20 | VSS_163 | R22 |
| MIPI_DPHY1_RX_D2N/MIPI_CPHY1_RX_TRIO2_A | AL21 | VSS_164 | R23 |
| MIPI_DPHY1_RX_D3N/MIPI_CPHY1_RX_TRIO2_C | AL22 | VSS_165 | R24 |
| AVSS_83 | AL23 | VSS_166 | R25 |
| MIPI_CAMERA0_CLK_M0/SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1_u | AL24 | VSS_167 | R26 |
| VSS_316 | AL25 | PMUIO2_1V8 | R27 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4_u | AL26 | VSS_168 | R28 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/PCIE30X2_CLKREQN_M1/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6_d | AL27 | I2S1_SCLK_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6_d | R29 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4_d | AL28 | PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4_d | R30 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3_d | AL29 | PMIC_SLEEP2/GPIO0_A3_d | R31 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1_d | AL30 | PMIC_SLEEP1/GPIO0_A2_d | R32 |
| MIPI_CSI1_D3P | AL31 | VSS_169 | R33 |
| MIPI_CSI1_D3N | AL32 | XIN_24M | R34 |
| MIPI_CSI0_D3P | AL33 | DDR_CH0_DQ2_A | T1 |
| MIPI_CSI0_D3N | AL34 | DDR_CH0_DQ1_A | T2 |
| HDMI/eDP_TX0_REXT | AM2 | VSS_170 | T3 |
| HDMI_TX1_D3P/eDP_TX1_D3P | AM3 | DDR_CH0_RESET_A | T4 |
| AVSS_84 | AM4 | DDR_CH0_A6_A | T5 |
| HDMI_TX1_D1P/eDP_TX1_D1P | AM5 | VSS_171 | T6 |
| USB20_HOST1_DM | AM7 | DDR_CH0_A0_A | T7 |
| AVSS_85 | AM8 | DDR_CH0_A1_A | T8 |
| AVSS_86 | AM9 | VSS_172 | T9 |
| TYPEC1_SBU2/DP1_AUXN | AM10 | DDR_CH0_VDDQ_4 | T10 |
| TYPEC0_USB20_OTG_DM | AM12 | VSS_173 | T11 |
| TYPEC0_USB20_VBUSDET | AM14 | DDR_CH0_VDD_1 | T12 |
| TYPEC0_SBU2/DP0_AUXN | AM15 | VSS_174 | T13 |
| SARADC_IN0_BOOT | AM16 | VDD_VDENC_1 | T14 |
| SARADC_IN4 | AM17 | VSS_175 | T15 |
| AVSS_87 | AM18 | VDD_CPU_BIG0_4 | T16 |
| AVSS_88 | AM20 | VDD_CPU_BIG0_5 | T17 |
| AVSS_89 | AM22 | VSS_176 | T18 |
| AVSS_90 | AM23 | VSS_177 | T19 |
| AVSS_91 | AM24 | VSS_178 | T20 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3_u | AM25 | VDD_CPU_LIT_MEM_1 | T21 |
| AVSS_92 | AM26 | VDD_CPU_LIT_MEM_0 | T22 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/PCIE30X2_WAKEN_M1/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7_d | AM27 | VSS_179 | T23 |
| AVSS_93 | AM28 | VSS_180 | T24 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2_d | AM29 | VSS_181 | T25 |
| VSS_317 | AM30 | VSS_182 | T26 |
| MIPI_CSI1_CLK1P | AM31 | VSS_183 | T27 |
| MIPI_CSI1_CLK1N | AM32 | I2S1_LRCK_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7_d | T28 |
| MIPI_CSI0_CLK1P | AM33 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6_u | T29 |
| MIPI_CSI0_CLK1N | AM34 | PMIC_SLEEP5/GPIO0_C3_d | T30 |
| HDMI/eDP_TX1_REXT | AN1 | PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0_d | T31 |
| HDMI_TX1_SBDP/eDP_TX1_AUXP | AN2 | PMIC_SLEEP4/GPIO0_C2_d | T32 |
| HDMI_TX1_D0P/eDP_TX1_D0P | AN4 | VSS_184 | T33 |
| HDMI_TX1_D1N/eDP_TX1_D1N | AN5 | XOUT_24M | T34 |
| HDMI_TX1_D2P/eDP_TX1_D2P | AN6 | DDR_CH0_DQ0_A | U1 |
| AVSS_94 | AN7 | DDR_CH0_DQ7_A | U2 |
| TYPEC1_SSRX1P/DP1_TX0P | AN8 | VSS_185 | U3 |
| TYPEC1_SSTX1N/DP1_TX1N | AN9 | DDR_CH0_DQS0N_A | U4 |
| TYPEC1_SSRX2P/DP1_TX2P | AN10 | DDR_CH0_DQS0P_A | U5 |
| TYPEC1_SSTX2N/DP1_TX3N | AN11 | DDR_CH0_VDD_0 | U11 |
| AVSS_95 | AN12 | VSS_186 | U12 |
| TYPEC0_SSRX1P/DP0_TX0P | AN13 | VSS_187 | U13 |
| TYPEC0_SSTX1N/DP0_TX1N | AN14 | VDD_VDENC_2 | U14 |
| TYPEC0_SSRX2P/DP0_TX2P | AN15 | VSS_188 | U15 |
| TYPEC0_SSTX2N/DP0_TX3N | AN16 | VSS_189 | U16 |
| SARADC_IN3 | AN17 | VSS_190 | U17 |
| MIPI_DPHY1_TX_D0P/MIPI_CPHY1_TX_TRIO0_B | AN18 | PLL_AVDD1V8 | U18 |
| MIPI_DPHY1_TX_D1P/MIPI_CPHY1_TX_TRIO1_A | AN19 | PLL_AVSS | U19 |
| MIPI_DPHY1_TX_CLKP/MIPI_CPHY1_TX_TRIO1_C | AN20 | VSS_191 | U20 |
| MIPI_DPHY1_TX_D2P/MIPI_CPHY1_TX_TRIO2_B | AN21 | VDD_CPU_LIT_7 | U21 |
| MIPI_DPHY1_TX_D3P/NO_USE | AN22 | VDD_CPU_LIT_0 | U22 |
| AVSS_96 | AN23 | VSS_192 | U23 |
| MIPI_DPHY0_TX_D0P/MIPI_CPHY0_TX_TRIO0_B | AN24 | VSS_193 | U24 |
| MIPI_DPHY0_TX_D1P/MIPI_CPHY0_TX_TRIO1_A | AN25 | VSS_194 | U30 |
| MIPI_DPHY0_TX_CLKP/MIPI_CPHY0_TX_TRIO1_C | AN26 | VSS_195 | U31 |
| MIPI_DPHY0_TX_D2P/MIPI_CPHY0_TX_TRIO2_B | AN27 | PMIC_SLEEP3/GPIO0_C1_d | U32 |
| MIPI_DPHY0_TX_D3P/NO_USE | AN28 | LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3_u | U33 |
| MIPI_DPHY0_RX_D0P/MIPI_CPHY0_RX_TRIO0_B | AN29 | VSS_196 | U34 |
| HDMI_TX1_D3N/eDP_TX1_D3N | AN3 | DDR_CH0_DQ6_A | V1 |
| MIPI_DPHY0_RX_D1P/MIPI_CPHY0_RX_TRIO1_A | AN30 | DDR_CH0_DQ5_A | V2 |
| AVSS_97 | AN31 | VSS_197 | V3 |
| MIPI_DPHY0_RX_CLKP/MIPI_CPHY0_RX_TRIO1_C | AN32 | VSS_198 | V4 |
| MIPI_DPHY0_RX_D2P/MIPI_CPHY0_RX_TRIO2_B | AN33 | VSS_199 | V5 |
| MIPI_DPHY0_RX_D3P/NO_USE | AN34 | DDR_CH0_WCK0N_A | V6 |
| AVSS_98 | AP1 | DDR_CH0_WCK0P_A | V7 |
| HDMI_TX1_D0N/eDP_TX1_D0N | AP4 | VSS_200 | V8 |
| HDMI_TX1_D2N/eDP_TX1_D2N | AP6 | VSS_201 | V9 |
| TYPEC1_USB20_OTG1_REXT | AP7 | VSS_202 | V10 |
| TYPEC1_SSRX1N/DP1_TX0N | AP8 | VSS_203 | V11 |
| TYPEC1_SSTX1P/DP1_TX1P | AP9 | VDD_VDENC_MEM_0 | V12 |
| TYPEC1_SSRX2N/DP1_TX2N | AP10 | VDD_VDENC_MEM_1 | V13 |
| TYPEC1_SSTX2P/DP1_TX3P | AP11 | VDD_VDENC_3 | V14 |
| TYPEC0_USB20_OTG0_REXT | AP12 | VSS_204 | V15 |
| TYPEC0_SSRX1N/DP0_TX0N | AP13 | VDD_LOGIC_6 | V16 |
| TYPEC0_SSTX1P/DP0_TX1P | AP14 | VDD_LOGIC_7 | V17 |
| TYPEC0_SSRX2N/DP0_TX2N | AP15 | VSS_205 | V18 |
| TYPEC0_SSTX2P/DP0_TX3P | AP16 | VSS_206 | V19 |
| AVSS_99 | AP17 | PLL_DVDD0V75 | V20 |
| MIPI_DPHY1_TX_D0N/MIPI_CPHY1_TX_TRIO0_A | AP18 | VDD_CPU_LIT_6 | V21 |
| MIPI_DPHY1_TX_D1N/MIPI_CPHY1_TX_TRIO0_C | AP19 | VDD_CPU_LIT_1 | V22 |
| HDMI_TX1_SBDN/eDP_TX1_AUXN | AP2 | VSS_207 | V23 |
| MIPI_DPHY1_TX_CLKN/MIPI_CPHY1_TX_TRIO1_B | AP20 | VSS_208 | V24 |
| MIPI_DPHY1_TX_D2N/MIPI_CPHY1_TX_TRIO2_A | AP21 | VSS_209 | V25 |
| MIPI_DPHY1_TX_D3N/MIPI_CPHY1_TX_TRIO2_C | AP22 | EMMCIO_1V8 | V26 |
| AVSS_100 | AP23 | VSS_210 | V27 |
| MIPI_DPHY0_TX_D0N/MIPI_CPHY0_TX_TRIO0_A | AP24 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5_u | V28 |
| MIPI_DPHY0_TX_D1N/MIPI_CPHY0_TX_TRIO0_C | AP25 | I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/PCIE30X2_PERSTN_M0/SATA_CPDET/GPIO0_D4_u | V29 |
| MIPI_DPHY0_TX_CLKN/MIPI_CPHY0_TX_TRIO1_B | AP26 | VSS_211 | V30 |
| MIPI_DPHY0_TX_D2N/MIPI_CPHY0_TX_TRIO2_A | AP27 | I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7_d | V31 |
| MIPI_DPHY0_TX_D3N/MIPI_CPHY0_TX_TRIO2_C | AP28 | EMMC_D2/FSPI_D2_M0/GPIO2_D2_u | V32 |
| MIPI_DPHY0_RX_D0N/MIPI_CPHY0_RX_TRIO0_A | AP29 | EMMC_D7/FSPI_CS1N_M0/GPIO2_D7_u | V33 |
| MIPI_DPHY0_RX_D1N/MIPI_CPHY0_RX_TRIO0_C | AP30 | EMMC_CLKOUT/GPIO2_A1_d | V34 |
| MIPI_DPHY0_RX_CLKN/MIPI_CPHY0_RX_TRIO1_B | AP31 | DDR_CH0_DQ4_A | W1 |
| MIPI_DPHY0_RX_D2N/MIPI_CPHY0_RX_TRIO2_A | AP32 | VSS_212 | W2 |
| MIPI_DPHY0_RX_D3N/MIPI_CPHY0_RX_TRIO2_C | AP33 | VSS_213 | W3 |
| AVSS_101 | AP34 | DDR_CH0_WCK1P_A | W4 |
| DDR_CH0_DQ11_B | B1 | DDR_CH0_WCK1N_A | W5 |
| DDR_CH1_DQ11_C | B2 | VSS_214 | W6 |
| DDR_CH1_DQ9_C | B3 | VSS_215 | W7 |
| DDR_CH1_DQ15_C | B4 | DDR_CH0_ZQ_A | W8 |
| DDR_CH1_DQ13_C | B5 | VSS_216 | W9 |
| VSS_5 | B6 | VSS_217 | W10 |
| DDR_CH1_DQ5_C | B7 | VSS_218 | W11 |
| DDR_CH1_DQ7_C | B8 | VSS_219 | W12 |
| DDR_CH1_DQ1_C | B9 | VDD_VDENC_5 | W13 |
| DDR_CH1_DQ3_C | B10 | VDD_VDENC_4 | W14 |
| DDR_CH1_A5_C | B11 | VSS_220 | W15 |
| DDR_CH1_CK_C | B12 | VSS_221 | W16 |
| DDR_CH1_CK_D | B13 | VSS_222 | W17 |
| DDR_CH1_A5_D | B14 | VSS_223 | W18 |
| DDR_CH1_DQ3_D | B15 | VSS_224 | W19 |
| DDR_CH1_DQ1_D | B16 | VSS_225 | W20 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_LIT_5 | W21 |
| DDR_CH1_DQ5_D | B18 | VDD_CPU_LIT_2 | W22 |
| VSS_6 | B19 | VSS_226 | W23 |
| DDR_CH1_DQ13_D | B20 | VSS_227 | W24 |
| DDR_CH1_DQ15_D | B21 | VCCIO5_1V8 | W25 |
| DDR_CH1_DQ9_D | B22 | VCCIO5 | W26 |
| DDR_CH1_DQ11_D | B23 | VSS_228 | W27 |
| VSS_7 | B24 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6_d | W28 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4_d | B25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/HDMI_RX_SCL_M0/SPI3_MOSI_M2/PCIE30X2_WAKEN_M0/HDMI_TX1_CEC_M1/GPIO0_D2_u | W29 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5_d | B26 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/HDMI_RX_SDA_M0/SPI0_CS0_M0/PCIE30X2_CLKREQN_M0/HDMI_TX0_CEC_M1/GPIO0_D1_u | W30 |
| VSS_8 | B27 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0_d | W31 |
| PCIE30_PORT1_REF_CLKN | B28 | EMMC_D6/FSPI_CS0N_M0/GPIO2_D6_u | W32 |
| PCIE30_PORT1_TX1N | B29 | EMMC_D1/FSPI_D1_M0/GPIO2_D1_u | W33 |
| PCIE30_PORT1_TX0P | B30 | EMMC_CMD/FSPI_CLK_M0/GPIO2_A0_u | W34 |
| PCIE30_PORT1_RX1N | B31 | DDR_CH0_DQ12_A | Y1 |
| PCIE30_PORT1_RX0P | B32 | DDR_CH0_DQ13_A | Y2 |
| VSS_9 | B33 | VSS_229 | Y3 |
| PCIE30_PORT0_RESREF | B34 | DDR_CH0_DM0_A | Y4 |
| DDR_CH0_DQ9_B | C1 | VSS_230 | Y5 |
| DDR_CH0_DQ10_B | C2 | VSS_231 | Y6 |
| VSS_10 | C3 | VCCIO2 | Y7 |
| VSS_11 | C4 | VSS_232 | Y8 |
| VSS_17 | C10 | VSS_233 | Y9 |
| VSS_18 | C11 | VSS_234 | Y10 |
| VSS_19 | C12 | VSS_235 | Y11 |
| VSS_20 | C13 | VSS_236 | Y12 |
| VSS_21 | C14 | VSS_237 | Y13 |
| VSS_22 | C15 | VSS_238 | Y14 |
| VSS_23 | C16 | VSS_239 | Y15 |
| VSS_24 | C17 | VSS_240 | Y16 |
| VSS_25 | C18 | VSS_241 | Y17 |
| DDR_CH1_RESET_D | C19 | VSS_242 | Y18 |
| VSS_26 | C20 | VSS_243 | Y19 |
| VSS_27 | C21 | VSS_244 | Y20 |
| VSS_28 | C22 | VDD_CPU_LIT_4 | Y21 |
| VSS_29 | C23 | VDD_CPU_LIT_3 | Y22 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6_d | C24 | VSS_245 | Y23 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7_u | C25 | VSS_246 | Y24 |
| VSS_30 | C26 | VCCIO3_1V8 | Y26 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0_u | C27 | GMAC1_PPSCLK/PCIE30X2_BUTTON_RSTN/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1_d | Y27 |
| VSS_31 | C28 | VSS_247 | Y28 |
| PCIE30_PORT1_TX1P | C29 | GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0_d | Y29 |
| VSS_32 | C30 | GMAC1_MDIO/MIPI_TE1/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3_d | Y30 |
| PCIE30_PORT1_RX1P | C31 | GMAC1_MDC/MIPI_TE0/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2_d | Y31 |
| VSS_33 | C32 | EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4_u | Y32 |
| PCIE30_PORT0_TX1P | C33 | EMMC_D0/FSPI_D0_M0/GPIO2_D0_u | Y33 |
| PCIE30_PORT0_TX1N | C34 | EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2_d | Y34 |

## 3. Электрические характеристики

### 3.1 Абсолютные пределы

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
| 0.75V напряжение питания | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI/eDP_TX0_VDD_0V75 HDMI/eDP_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 HDMI_RX_AVDD0V75 MIPI_CSI0_AVCC0V75 MIPI_CSI1_AVCC0V75 PCIE30_PORT0_AVDD0V75 PCIE30_PORT1_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V напряжение питания | DDR_CH0_VDD DDR_CH0_VDD_MIF DDR_CH0_PLL_DVDD DDR_CH1_VDD DDR_CH1_VDD_MIF DDR_CH1_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 TYPEC1_DP1_VDD_0V85 TYPEC1_DP1_VDDA_0V85 MIPI_D/C_PHY0_VDD MIPI_D/C_PHY1_VDD PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.2V напряжение питания | MIPI_D/C_PHY0_VDD_1V2 MIPI_D/C_PHY1_VDD_1V2 | -0.3 | 1.35 | V |
| 1.8V напряжение питания | DDR_CH0_PLL_AVDD1V8 DDR_CH1_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 TYPEC1_DP1_VDDH_1V8 HDMI/eDP_TX0_VDD_CMN_1V8 HDMI/eDP_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 MIPI_CSI0_AVCC1V8 MIPI_CSI1_AVCC1V8 MIPI_D/C_PHY0_VDD_1V8 MIPI_D/C_PHY1_VDD_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 PCIE30_PORT1_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V напряжение питания | USB20_AVDD_3V3 HDMI_RX_DVDD3V3 HDMI_RX_VPH3V3 | -0.5 | 3.63 | V |
| Питание GPIO только 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| Питание GPIO 1.8V/3.3V | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Питание DDR IO (LPDDR4/4X 0.6V; LPDDR5/5X 0.5V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Питание DDR IO (LPDDR4/4X 1.1V; LPDDR5/5X 1.05V) | DDR_CH0_VDDQ_CKE DDR_CH1_VDDQ_CKE | -0.3 | 1.25 | V |
| Температура хранения | Tstg | -40 | 125 | ℃ |
| Максимальная температура перехода (в оригинале Conjunction) | Tj | NA | 125 | ℃ |

Выход за абсолютный максимум или минимум может необратимо повредить микросхему; длительная работа на максимуме снижает надёжность.

### 3.2 Рекомендуемые рабочие условия

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
| Цифровое питание GPIO (1.8V только) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.95 | V |
| Цифровое питание GPIO (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Питание eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Питание логики(0.85V) | DDR_CH0_VDD, DDR_CH0_VDD_MIF, DDR_CH1_VDD, DDR_CH1_VDD_MIF, | 0.675 | 0.85 | 0.935 | V |
| DDR CH0_PLL питание(0.85V) | DDR_CH0_PLL_DVDD, DDR_CH1_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
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
| USB & DP Аналоговое питание (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85, TYPEC1_DP1_VDD_0V85, TYPEC1_DP1_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Аналоговое питание (1.8V) | TYPEC0_DP0_VDDH_1V8, TYPEC1_DP1_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Аналоговое питание(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Аналоговое питание(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| PCIe30 Аналоговое питание(0.75V) | PCIE30_PORT0_AVDD0V75, PCIE30_PORT1_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Аналоговое питание(1.8V) | PCIE30_PORT0_AVDD1V8, PCIE30_PORT1_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| MIPI CSI DPHY Аналоговое питание(0.75V) | MIPI_CSI0_AVCC0V75, MIPI_CSI1_AVCC0V75 | 0.675 | 0.75 | 0.825 | V |
| MIPI CSI DPHY Аналоговое питание(1.8V) | MIPI_CSI0_AVCC1V8, MIPI_CSI1_AVCC1V8 | 1.62 | 1.8 | 1.98 | V |
| MIPI DCPHY Аналоговое питание (0.85V) | MIPI_D/C_PHY0_VDD, MIPI_D/C_PHY1_VDD | 0.7125 | 0.85 | 0.8925 | V |
| MIPI DCPHY Аналоговое питание (1.2V) | MIPI_D/C_PHY0_VDD_1V2, MIPI_D/C_PHY1_VDD_1V2 | 1.14 | 1.2 | 1.26 | V |
| MIPI DCPHY Аналоговое питание (1.8V) | MIPI_D/C_PHY0_VDD_1V8, MIPI_D/C_PHY1_VDD_1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI RX Аналоговое питание(0.75V) | HDMI_RX_AVDD0V75 | 0.675 | 0.75 | 0.825 | V |
| HDMI RX Аналоговое питание(3.3V) | HDMI_RX_DVDD3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI RX Аналоговое питание(3.3V) | HDMI_RX_VPH3V3 | 3.135 | 3.3 | 3.465 | V |
| HDMI/eDP TX Цифровое питание (0.75V) | HDMI/eDP_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (0.75V) | HDMI/eDP_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI/eDP_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI/eDP_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Аналоговое питание(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Аналоговое питание(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Аналоговое питание(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| Входная частота OSC |  | NA | 24 | NA | MHz |
| Максимальная частота CPU |  | NA | NA | 2.2-2.4 | GHz |
| Максимальная частота GPU |  | NA | NA | 1000 | MHz |
| Максимальная частота NPU |  | NA | NA | 1000 | MHz |
| Рабочая температура окружающей среды | TA | 0 | NA | 80 | ℃ |

В строке двухуровневого GPIO сначала приведён режим 3.3V, затем 1.8V. Абсолютные пределы не являются рекомендуемым режимом. NA и пустые ячейки сохранены без выдуманных ограничений.

### 3.3 Характеристики постоянного тока

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

### 3.4 Электрические характеристики GPIO

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

Примечания к 3.3/3.4: VDDO и DVDD обозначают питание IO. Отрицательные токи подтяжки сохранены в исходных колонках MIN/MAX; колонки не переставлены.

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

Примечание PLL ①: p — коэффициент входного делителя.

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
| Конденсатор AC-связи(SATA) |  | 6 | NA | 12 | nF |
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
| Синфазная помеха 50MHz–450MHz | ΔVCMRX(LF) | -50 | NA | 50 | mV |
| Синфазная помеха 50MHz–450MHz | ΔVCMRX(LF) | -25 | NA | 25 | mV |
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
| Диапазон измерения температуры | TRANGE |  | -40 | NA | 125 | ℃ |
| Разрешение | TLSB |  | NA | 1 | NA | ℃ |

## 4. Тепловой режим

Для надёжной работы абсолютная максимальная температура перехода должна оставаться ниже 125°C. Тепловые значения получены моделированием и требуют проверки испытаниями. Плата: 10 слоёв, 114mm x 101mm, окружающая температура 25°C.

| Параметр | Обозначение | Типовое | Единица |
| --- | --- | --- | --- |
| Тепловое сопротивление переход–среда | 𝜽 𝑱𝑨 | 8.7 | (℃/𝑾) |
| Тепловое сопротивление переход–плата | 𝜽 𝑱𝑩 | 3.5 | (℃/𝑾) |
| Тепловое сопротивление переход–корпус | 𝜽 𝑱𝑪 | 0.12 | (℃/𝑾) |

## Сопоставление версий и неоднозначности

- Rev1.7: окружающая температура −20–85°C; Rev2.0: 0–80°C. Основная таблица следует 2.0; старый диапазон не является актуальной гарантией.
- На шарике E26 GPIO1_B6_d заменён на GPIO1_B6_u; остальные альтернативные функции сохранены.
- Старые PMUIO2_1V8/VCCIO2_1V8/VCCIO4_1V8/VCCIO5_1V8/VCCIO6_1V8 переименованы в PMUIO2/VCCIO2/VCCIO4/VCCIO5/VCCIO6.
- Добавлены LPDDR5X и требования синхронизации дисплея/VOP. Для CPHY камеры 2.5Gbps заменено на 2.5Gsps на линию. Старая схема обозначает GPU MC4, новая и основной текст — MP4.
- В Rev1.7 §1.2.10 для BT.1120 указан RGB до 8bit; в 2.0 строка удалена. Здесь она сохранена только как историческая информация.
- Номер таблицы 3-10 повторяется для MIPI CSI DPHY и SARADC. Для ВЧ синфазной помехи даны два максимума 100/50mV, для НЧ два диапазона −50–50/−25–25mV без дополнительных условий; сохранены оба.
- DDR IO VOH=0.25V стоит в MIN, VOL=0.2V в MAX; размещение сохранено. Условия TSADC относятся только к точности.
- Глава 4 требует температуры перехода ниже 125°C, таблица пределов указывает максимум 125°C; обе формулировки сохранены. Главы карты регистров в этом документе нет.

## Официальные материалы

- [Документация ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
