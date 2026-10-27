---
title: "Rockchip RK3588C: характеристики, выводы и электрические пределы"
description: "Rockchip RK3588C: характеристики, выводы и электрические пределы — Rev1.3"
excerpt: "Rockchip RK3588C: характеристики, выводы и электрические пределы"
translation_key: "214-rockchip-rk3588c-datasheet"
slug: "214-rockchip-rk3588c-datasheet"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "hardware"
products: []
tags: ["ArmSoM","Rockchip","RK3588C","datasheet"]
---

{% raw %}

# Rockchip RK3588C: характеристики, выводы и электрические пределы

Справочник ArmSoM по RK3588C. Возможности чипа не гарантируют совместимость платы: проверьте микросхему, схему, питание и BSP. Аппаратные испытания не проводились. Рисунки и тепловое моделирование — материалы Rockchip. SDK/ядро не указаны. Единственный источник: английский RK3588C Datasheet Rev1.3 от 2024-12-12, 33 страницы, в каталоге CN. Все рисунки английские.

## 1.1

RK3588C — энергоэффективный высокопроизводительный процессор для NVR и устройств периферийных вычислений. Он объединяет четыре ядра Cortex-A76 и четыре Cortex-A55 с сопроцессорами NEON. Аппаратные блоки ускоряют ресурсоёмкие приложения: декодирование H.265 и VP9 достигает 8K@60fps, H.264 — 8K@30fps, AV1 — 4K@60fps. Кодирование H.264 и H.265 поддерживается до 8K@30fps; также встроены высококачественный кодек JPEG и специализированные блоки предварительной и последующей обработки изображений. Графический процессор 3D поддерживает OpenGLES 1.1, 2.0 и 3.2, OpenCL до 2.2 и Vulkan 1.2. Отдельный блок 2D с MMU ускоряет вывод изображения.  NPU поддерживает смешанные операции INT4/INT8/INT16/FP16 с производительностью до 6 TOPS; допускается преобразование моделей TensorFlow, MXNet, PyTorch и Caffe. Четырёхканальный интерфейс внешней памяти поддерживает LPDDR4/LPDDR4X и высокие требования к пропускной способности. Полный набор периферийных интерфейсов обеспечивает гибкость применения.

## 1.2.1

Микропроцессор. Четыре ARM Cortex-A76 MPCore и четыре ARM Cortex-A55 MPCore сочетают высокую производительность, низкое энергопотребление и кэширование. DSU (DynamIQ Shared Unit) содержит память L3, логику управления и внешние интерфейсы кластера DynamIQ. Полностью реализован набор команд ARMv8-A, включая ARM NEON Advanced SIMD для обработки мультимедиа и сигналов, криптографические расширения ARMv8 и TrustZone. Каждое ядро A76 имеет 64KB кэша инструкций L1, 64KB данных L1 и 512KB L2; каждое A55 — 32KB инструкций L1, 32KB данных L1 и 128KB L2. Все восемь ядер используют общий кэш L3 объёмом 3MB. Восемь независимых доменов питания обеспечивают внутреннюю коммутацию и внешнее включение/выключение согласно сценарию: PD_CPU_0/1/2/3 соответствуют ядрам A55 1/2/3/4, а PD_CPU_4/5/6/7 — ядрам A76 1/2/3/4; каждый включает NEON, FPU и кэши инструкций/данных L1/L2. DVFS поддерживается тремя отдельными доменами напряжения: A76_0+A76_1, A76_2+A76_3 и DSU+Cortex-A55.

## 1.2.2

Организация памяти. Встроенное BootROM загружает систему через SPI, eMMC или SD/MMC и принимает системный код через USB OTG. Общая память находится в VD_LOGIC; PMU SRAM в VD_PMU предназначена для экономичных режимов. Внешняя динамическая память соответствует JEDEC LPDDR4/LPDDR4X: четыре 16-разрядных канала, до двух рангов/сигналов выбора кристалла на канал и до 32GB общего адресного пространства. SDRAM поддерживает отключение питания и самообновление. eMMC полностью соответствует JEDEC 5.1/5.0 и обратно совместима с 4.51 и предыдущими версиями; режимы HS400, HS200, DDR50 и традиционные используют шину 1/4/8 бит. SD/MMC совместима с SD3.0 и MMC 4.51 при ширине 4 бита. FSPI обеспечивает двустороннюю передачу с последовательной флеш-памятью, шину 1/2/4 бита и два сигнала выбора кристалла.

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

Видеовход. Один стандартный DVP 8/10/12/16 бит принимает до 150MHz, поддерживает BT.601/BT.656/BT.1120 и настройку полярности pixel_clk/hsync/vsync.

## 1.2.9

Дисплеи. Один HDMI2.1 TX поддерживает x3/x4 FRL, совместимость с HDMI2.1 TMDS и предыдущими версиями, 3/6/8/10/12Gbps, до 7680x4320@60Hz, RGB/YUV до 10bit, DSC1.2a и HDCP2.3. Один комбинированный HDMI2.0/eDP1.4 TX работает только в одном режиме одновременно. eDP: x1/x2/x4, 1.62/2.7/5.4Gbps. HDMI: до 4096x2160@60Hz, RGB/YUV до 10bit, DSC1.2a, HDCP2.3; eDP: до 4K@60Hz, RGB/YCbCr4:4:4/YCbCr4:2:2, 8/10 бит на компонент, HDCP1.3. Для HDMI рекомендуется CTA-861 и кратность нестандартных HSYNC/HBP/HFP четырём пикселям. Один DP TX1.4a совмещён с USB3.1 Gen1: 1/2/4 линии, 1.62/2.7/5.4/8.1Gbps, до 7680x4320@30Hz, RGB/YUV до 10bit, SST, Type-C DP Alt Mode, HDCP2.3/1.3. Рекомендуется CTA-861; минимум нестандартных HSYNC/HBP/HFP — 16 пикселей. BT.1120: до 1920x1080@60Hz и 150MHz.

## 1.2.10

Процессор видеовыхода. Максимумы: Video Port0 — 7680x4320@60Hz, Port1 и Port2 — по 4096x4320@60Hz, Port3 — 2048x1080@60Hz. Cluster0/1/2/3: вход/выход 4096x4320, AFBCD, RGB/YUV/YUYV, масштаб 4–1/4 и поворот. ESMART0/1/2/3: вход/выход 4096x4320, RGB/YUV/YUYV, масштаб 8–1/8 и четыре области. Наложение в RGB/YUV объединяет до восьми слоёв (четыре Cluster+четыре ESMART). Постобработка: HDR10/HLG, HDR2SDR/SDR2HDR, 3D-LUT/P2I/CSC/BCSH/DITHER/CABC/GAMMA/COLORBAR. Обратная запись: ARGB8888/RGB888/RGB565/YUV420 до 1920x1080. HACTIVE должен быть кратен 4 пикселям. При разделении, двухканальном MIPI или YUV420 параметры POST HSYNC/HBP/HFP должны быть кратны 2. В видеорежиме MIPI DSC минимумы POST HSYNC/HBP/HFP — 16 пикселей, DSC_SYS_CTRL HSYNC/HBP/HFP — 8.

## 1.2.11

Аудиоинтерфейсы. I2S0 поддерживает до 4 TX либо 4 RX; I2S1 — до 8 TX и 8 RX. Оба: 16–32 бита, до 192kHz, программируемые ведущий/ведомый режимы, I2S обычный/с левым/правым выравниванием, PCM early/late1/late2/late3, TDM обычный, сдвиг влево на половину/один/два такта либо вправо. I2S/PCM/TDM одновременно не работают. I2S2/I2S3: по 2 TX и 2 RX, 16–32 бита, до 192kHz, ведущий/ведомый, те же три I2S и четыре PCM; одновременная работа I2S/PCM невозможна. SPDIF0/1 упаковывают два 16-битных отсчёта в одно 32-битное слово, выводят двухфазное стерео, выравнивают 16–31-битные данные влево/вправо в 32-битном буфере, передают линейный PCM 16/20/24 бит и нелинейный PCM. PDM0/1: до 8 каналов, 16–24 бита, до 192kHz, ведущий режим приёма. Цифровой кодек имеет два цифровых DAC, I2S/PCM ведущий/ведомый, 16-битные отсчёты, три режима смешивания каждого DAC и регулировку громкости. VAD читает I2S/PDM, обнаруживает амплитуду речи, сохраняет данные микрофонной решётки и формирует объединённое прерывание по уровню.

## 1.2.12

Связь. SDIO соответствует SDIO3.0, шина 4 бита. Два GMAC поддерживают RGMII 10/100/1000Mbps и RMII 10/100Mbps, полный/полудуплекс. USB3.1 Gen1 эквивалентен USB3.2 Gen1 и USB3.0, до 5Gbps. Один OTG USB3OTG_0 совмещён с DP TX; один Host USB3OTG_2 — с PIPE PHY2. Совместимость: USB3.0 revision1.0, USB2.0 кроме USB3OTG_2, xHCI1.1. Передачи: управляющие, пакетные со streams, прерывания и изохронные; возможны одновременные IN/OUT. Кэширование дескрипторов и предвыборка данных улучшают работу при больших задержках. Энергосбережение: USB2.0 LPM кроме USB3OTG_2 и USB3.1 U0/U1/U2/U3. Режим устройства: до 10 IN и 6 OUT оконечных точек, включая в обоих числах управляющую точку0; до 16 ресурсов передачи, по одному на точку; гибкая настройка для приложений/USB set-configuration; аппаратная обработка ERDY и пакетов burst; потоковые bulk-точки с автоматическим запуском перемещения данных; изохронные точки с буферами; гибкие дескрипторы с регулированием буферных прерываний, несколькими передачами, изохронными/управляющими передачами и разрозненными буферами. Хост xHCI: до 64 устройств, один источник прерываний, один USB2.0-порт кроме USB3OTG_2, один SuperSpeed-порт, стандартные/открытые драйверы xHCI и классов. DRD: фиксированные режимы устройства/хоста, USB3.1/USB2.0 OTG A/B по ID; USB3OTG_2 поддерживает только USB3.1 Gen1. SRP/HNP/RSP не поддерживаются. USB2.0 PHY определяет зарядку батареи; USB3OTG_0 поддерживают Type-C/DP Alt Mode; PHY USB3OTG_2 разделяется с PCIe/SATA. Два USB2.0-хоста поддерживают USB2.0, высокую/полную/низкую скорость 480/12/1.5Mbps и EHCI1.0/OHCI1.0a. Три Combo PIPE PHY работают с PCIe2.1/SATA3.0/USB3.1: PHY0/1 выбирают SATA либо PCIe2.1, PHY2 — SATA, PCIe2.1 либо USB3.1 Gen1. Каждый PCIe2.1: одна линия 5Gbps, PCI Express Base2.1, только RC. Каждый SATA: один порт 6Gbps, eSATA, Serial ATA3.1/AHCI1.3.1. PCIe3.0: Base3.0, RC/EP, 2.5Gbps (1.1), 5Gbps (2.1), 8Gbps (3.0; в источнике 8Gps), объединение/разделение 1x2 либо 2x1 линий. Предусмотрены пять контроллеров SPI (SPI0–SPI4). Поддерживаются два сигнала выбора и программируемый ведущий/ведомый SPI. Девять I2C0–I2C8 поддерживают адреса 7/10 бит и программируемую частоту до 100kbit/s Standard-mode либо 400kbit/s Fast-mode. Десять UART0–UART9 имеют раздельные FIFO TX/RX по 64 байта, передают/принимают 5/6/7/8 бит, поддерживают старт/стоп/чётность, различные входные такты для скорости до 4Mbps и автоматическое управление потоком на всех UART. Отдельный USB2.0 OTG поддерживает USB2.0 (источник исключает USB3OTG_2), xHCI1.1, управляющие/bulk со streams/прерывания/изохронные передачи, кэш дескрипторов, предвыборку и определение зарядки. Есть фиксированные роли устройства/хоста и OTG A/B по ID, без SRP/HNP/RSP; до 10 IN и 6 OUT точек включая точку0, 16 ресурсов передачи и гибкая настройка; xHCI-хост на 64 устройства с одним источником прерываний и одним портом USB2.0.

## 1.2.13

Прочие функции. Несколько групп GPIO поддерживают прерывание на каждом выводе, запуск по уровню/фронту, настройку полярности уровня, восходящего/нисходящего/обоих фронтов, слабой подтяжки вверх/вниз и силы драйвера. TS-ADC работает в пользовательском и автоматическом режимах. В пользовательском режиме start_of_conversion полностью управляется программно либо формируется аппаратно. Автоматический режим допускает настройку порогов прерываний высокой/низкой температуры и температуры сброса системы. Семь каналов имеют независимые температурные критерии; диапазон −40–125°C, разрешение 1°C. SARADC: 12 бит, до 1MS/s, четыре несимметричных входа. OTP: 32Kbit, верхнее адресное пространство 4k не защищено (обозначение источника сохранено). Защищённый режим поддерживает маски слов чтения/программирования; максимум программирования 32 бита, чтения 16 слов; состояния доступны для чтения, адрес неудачного программирования записывается. Корпус FCCSP766L: 17mm x 19mm, диаметр шарика 0.3mm, шаг 0.6mm & 0.65mm.

## 1.3 Блок-схема

![1-1. Блок-схема (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-1-1.png)

1-1. Блок-схема (английский оригинал).

Схема дополнительно указывает 1MB общей памяти, шесть PVTM, два SPDIF с пометкой 8ch, системные регистры и SRAM/ROM/OTP. На схеме шесть SPI и eDP1.3, в тексте пять SPI и eDP1.4; противоречия сохранены. SD3.0/MMC4.5 схемы отличается от MMC4.51 текста.

## 2. Корпус

### 2.1 Заказ

RK3588C: RoHS, ED-FCCSP 17x19 766L, 840PCS в лотке, процессор приложений.

### 2.2 Маркировка

Rockchip — бренд; RKXXXX — чип; ABC — подрядчик; XXXXXX — партия кристаллов; YYWW — дата; NXXXXXX FXX — подпартия OSAT. Угловая метка обозначает первый вывод.

![2-1. Маркировка корпуса (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-2-1.png)

2-1. Маркировка корпуса (английский оригинал).

![2-2. Вид корпуса сверху (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-2-2.png)

2-2. Вид корпуса сверху (английский оригинал).

### 2.3 Размеры

![2-3. Вид корпуса снизу (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-2-3.png)

2-3. Вид корпуса снизу (английский оригинал).

![2-4. Вид корпуса сбоку (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-2-4.png)

2-4. Вид корпуса сбоку (английский оригинал).

![2-5. Размеры корпуса (английский оригинал).](/docs/rockchip-rk3588c-datasheet/images/figure-2-5.png)

2-5. Размеры корпуса (английский оригинал).

| Обозначение | Минимум mm | Типовое mm | Максимум mm | Минимум дюйм | Типовое дюйм | Максимум дюйм |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1.04 | 1.150 | 1.221 | 0.041 | 0.045 | 0.048 |
| A1 | 0.160 | 0.210 | 0.260 | 0.006 | 0.008 | 0.010 |
| A2 | 0.860 | 0.940 | 0.990 | 0.034 | 0.037 | 0.039 |
| A3 | 0.570 | 0.600 | 0.630 | 0.022 | 0.024 | 0.025 |
| c | 0.300 | 0.340 | 0.380 | 0.012 | 0.013 | 0.015 |
| D | 16.900 | 17.000 | 17.100 | 0.665 | 0.669 | 0.673 |
| E | 18.900 | 19.000 | 19.100 | 0.744 | 0.748 | 0.752 |
| D1 | — | 16.200 | — | — | 0.638 | — |
| E1 | — | 18.000 | — | — | 0.709 | — |
| e1 | — | 0.600 | — | — | 0.024 | — |
| e2 | — | 0.650 | — | — | 0.026 | — |
| b | 0.260 | 0.310 | 0.360 | 0.010 | 0.012 | 0.014 |

Неразделённые допуски (mm/inch): aaa 0.150/0.006; ccc 0.200/0.008; ddd 0.150/0.006; eee 0.150/0.006; fff 0.080/0.003. Типовое соответствует NOM.

### 2.4–2.5

Влагочувствительность MSL3; покрытие/шарики SnAgCu.

### 2.6 Полная таблица выводов

| Имя вывода | Вывод | Имя вывода | Вывод |
| --- | --- | --- | --- |
| VSS_1 | A1 | RFU3 | F22 |
| DDR_CH1_DQ10_C | A2 | I2S0_SDO2/I2S0_SDI3/PDM0_SDI1_M0/GPIO1_D1 | F23 |
| DDR_CH1_DQ8_C | A3 | PDM1_CLK1_M1/PCIE30X1_0_WAKEN_M2/SATA0_ACT_LED_M1/UART4_TX_M2/SPI0_CLK_M2/GPIO1_B3 | F24 |
| DDR_CH1_DQ14_C | A4 | VOP_POST_EMPTY/I2C4_SDA_M3/UART6_RTSN_M1/PWM0_M2/SPI4_CLK_M2/GPIO1_A2 | F25 |
| DDR_CH1_DQ12_C | A5 | VSS_40 | F26 |
| DDR_CH1_DM0_C | A6 | PCIE30_PORT0_TX0N | F27 |
| DDR_CH1_DQ5_C | A7 | PCIE30_PORT0_TX0P | F28 |
| DDR_CH1_DQ0_C | A8 | VSS_39 | F21 |
| DDR_CH1_DQ2_C | A9 | DDR_CH0_DQ13_B | G1 |
| VSS_2 | A10 | DDR_CH0_DQ14_B | G2 |
| DDR_CH1_A2_D | A13 | VSS_41 | G3 |
| DDR_CH1_DQ2_D | A15 | DDR_CH0_DQS1N_B | G5 |
| DDR_CH1_DQ0_D | A16 | VSS_42 | G6 |
| DDR_CH1_DQ12_D | A17 | VSS_43 | G7 |
| DDR_CH1_DQ14_D | A18 | DDR_CH1_A2_C | G8 |
| DDR_CH1_DQ8_D | A19 | VSS_44 | G9 |
| DDR_CH1_DQ10_D | A20 | VSS_45 | G10 |
| DDR_CH1_DM0_D | A21 | DDR_CH1_A5_C | G11 |
| PDM1_SDI0_M1/PCIE30X1_1_PERSTN_M2/PWM3_IR_M3/SPI2_CS0_M0/GPIO1_A7 | A23 | VSS_46 | G12 |
| I2C8_SDA_M2/UART1_CTSN_M1/PWM15_IR_M3/GPIO1_D7 | A25 | VSS_47 | G13 |
| I2C8_SCL_M2/UART1_RTSN_M1/PWM14_M2/GPIO1_D6 | A26 | DDR_CH1_A1_D | G14 |
| SPDIF0_TX_M0/I2C5_SCL_M3/UART1_TX_M1/GPIO1_B6 | A27 | VSS_48 | G15 |
| VSS_3 | A28 | VSS_49 | G16 |
| DDR_CH0_DQ9_A | AA1 | DDR_CH1_LP4/4X_CS0_D | G17 |
| DDR_CH0_DQ8_A | AA2 | VSS_50 | G18 |
| VSS_117 | AA3 | VSS_51 | G19 |
| VSS_118 | AA4 | DDR_CH1_DQ6_D | G20 |
| DDR_CH0_DQ13_A | AA5 | RFU1 | G21 |
| DDR_CH0_DQ12_A | AA6 | RFU4 | G22 |
| VSS_119 | AA7 | VSS_52 | G23 |
| VSS_120 | AA8 | VSS_53 | G24 |
| VSS_121 | AA21 | VSS_54 | G25 |
| VCCIO5_1V8 | AA22 | VSS_55 | G26 |
| GMAC1_MDC/I2C8_SCL_M4/UART7_RTSN_M1/PWM14_M0/SPI1_CS0_M1/GPIO3_C2 | AA23 | PCIE30_PORT0_RX1N | G27 |
| EMMC_RSTN/I2C2_SCL_M2/UART5_RTSN_M1/GPIO2_A3 | AA24 | PCIE30_PORT0_RX1P | G28 |
| EMMC_CLKOUT/GPIO2_A1 | AA25 | DDR_CH0_DQ7_B | H1 |
| GMAC1_RXD3/SDIO_D3_M1/I2S3_SDO/AUDDSM_RN/FSPI_D3_M2/UART8_RX_M1/SPI4_CS0_M1/GPIO3_A3 | AA26 | DDR_CH0_DQ12_B | H2 |
| EMMC_D7/FSPI_CS1N_M0/GPIO2_D7 | AA27 | VSS_56 | H3 |
| I2S1_MCLK_M1/JTAG_TCK_M2/I2C1_SCL_M0/UART2_TX_M0/PCIE30X1_1_CLKREQN_M0/GPIO0_B5 | AA28 | DDR_CH0_DQS0P_B | H4 |
| DDR_CH0_DM1_A | AB1 | DDR_CH0_DQS0N_B | H5 |
| DDR_CH0_DQ11_A | AB2 | VSS_57 | H6 |
| VSS_122 | AB3 | VSS_58 | H7 |
| VSS_123 | AB5 | DDR_CH1_ZQ_C | H8 |
| AVSS_2 | AB8 | VSS_59 | H9 |
| VCCIO3_1V8 | AB21 | VSS_60 | H10 |
| EMMC_D6/FSPI_CS0N_M0/GPIO2_D6 | AB26 | VSS_61 | H11 |
| EMMC_D2/FSPI_D2_M0/GPIO2_D2 | AB27 | VSS_62 | H12 |
| DDR_CH0_DQ10_A | AC1 | VSS_63 | H13 |
| VSS_124 | AC2 | VSS_64 | H14 |
| VSS_125 | AC3 | VSS_65 | H15 |
| DDR_CH0_DQS1N_A | AC4 | VSS_66 | H16 |
| DDR_CH0_DQS1P_A | AC5 | VSS_67 | H17 |
| VSS_126 | AC6 | VSS_68 | H18 |
| AVSS_3 | AC7 | DDR_CH1_ZQ_D | H19 |
| HDMI_TX0_VDD_0V75 | AC8 | VSS_69 | H20 |
| VCCIO6_1V8 | AC21 | VSS_70 | H21 |
| ETH0_REFCLKO_25M/I2S2_SDI_M0/I2C6_SCL_M2/SPI1_CS0_M0/GPIO2_C3 | AC22 | VSS_71 | H22 |
| EMMC_CMD/FSPI_CLK_M0/GPIO2_A0 | AC23 | VSS_72 | H23 |
| VSS_127 | AC24 | PCIE30_PORT0_REF_CLKP | H24 |
| EMMC_DATA_STROBE/I2C2_SDA_M2/UART5_CTSN_M1/GPIO2_A2 | AC25 | PCIE30_PORT0_REF_CLKN | H25 |
| EMMC_D1/FSPI_D1_M0/GPIO2_D1 | AC26 | VSS_73 | H26 |
| EMMC_D4/I2C1_SCL_M3/UART5_RX_M2/GPIO2_D4 | AC27 | PCIE30_PORT0_RX0N | H27 |
| EMMC_D0/FSPI_D0_M0/GPIO2_D0 | AC28 | PCIE30_PORT0_RX0P | H28 |
| SDMMC_D0/PDM1_SDI3_M0/JTAG_TCK_M1/I2C3_SCL_M4/UART2_TX_M1/PWM8_M1/GPIO4_D0 | AD2 | DDR_CH0_DQ1_B | J1 |
| SDMMC_D1/PDM1_SDI2_M0/JTAG_TMS_M1/I2C3_SDA_M4/UART2_RX_M1/PWM9_M1/GPIO4_D1 | AD3 | DDR_CH0_DQ0_B | J2 |
| SDMMC_CMD/PDM1_CLK1_M0/MCU_JTAG_TCK_M0/UART5_RX_M0/PWM7_IR_M1/GPIO4_D4 | AD4 | DDR_CH0_DQ2_B | J3 |
| VSS_128 | AD5 | VSS_74 | J4 |
| VSS_129 | AD6 | DDR_CH0_LP4/4X_CS0_B | J5 |
| AVSS_4 | AD7 | VSS_75 | J6 |
| HDMI_TX0_VDD_IO_1V8 | AD8 | DDR_CH0_ZQ_B | J7 |
| HDMI/eDP_TX1_VDD_0V75 | AD9 | VSS_76 | J8 |
| HDMI/eDP_TX1_AVDD_0V75 | AD10 | VSS_77 | J21 |
| VSS_130 | AD11 | PCIE30_PORT0_RESREF | J22 |
| VSS_131 | AD12 | AVSS1_1 | J23 |
| VDD_GPU_9 | AD13 | PCIE20_2_REFCLKP | J24 |
| VDD_GPU_10 | AD14 | PCIE20_2_REFCLKN | J25 |
| VSS_132 | AD15 | AVSS1_2 | J26 |
| VSS_133 | AD16 | PCIE20_2_TXP/SATA30_2_TXP/USB30_SSTXP | J27 |
| VSS_134 | AD17 | PCIE20_2_TXN/SATA30_2_TXN/USB30_SSTXN | J28 |
| VSS_135 | AD18 | DDR_CH0_DQ3_B | K2 |
| VSS_136 | AD19 | VSS_78 | K3 |
| VSS_137 | AD20 | VSS_79 | K5 |
| VSS_138 | AD21 | VSS_80 | K7 |
| VSS_139 | AD22 | DDR_CH01_VDDQ_CKE | K8 |
| VSS_140 | AD23 | VSS_81 | K21 |
| RFU8 | AD24 | PCIE30_PORT0_AVDD0V75 | K22 |
| GMAC0_TXD2/SDIO_D3_M0/I2C8_SDA_M1/UART6_CTSN_M0/GPIO2_B1 | AD25 | AVSS1_3 | K23 |
| EMMC_D3/FSPI_D3_M0/GPIO2_D3 | AD26 | AVSS1_4 | K24 |
| EMMC_D5/I2C1_SDA_M3/UART5_TX_M2/GPIO2_D5 | AD27 | AVSS1_5 | K25 |
| HDMI_TX0_D3N | AE1 | AVSS1_6 | K26 |
| AVSS_5 | AE2 | PCIE20_2_RXN/SATA30_2_RXN/USB30_SSRXN | K27 |
| SDMMC_CLK/PDM1_CLK0_M0/TEST_CLKOUT_M0/MCU_JTAG_TMS_M0/UART5_TX_M0/GPIO4_D5 | AE3 | PCIE20_2_RXP/SATA30_2_RXP/USB30_SSRXP | K28 |
| SDMMC_D3/PDM1_SDI0_M0/JTAG_TMS_M0/I2C8_SDA_M0/UART5_RTSN_M0/PWM10_M1/GPIO4_D3 | AE4 | DDR_CH0_CKB_B | L1 |
| SDMMC_D2/PDM1_SDI1_M0/JTAG_TCK_M0/I2C8_SCL_M0/UART5_CTSN_M0/GPIO4_D2 | AE5 | DDR_CH0_CK_B | L2 |
| AVSS_6 | AE6 | VSS_82 | L3 |
| AVSS_7 | AE7 | DDR_CH0_A3_B | L4 |
| HDMI/eDP_TX1_VDD_IO_1V8 | AE8 | DDR_CH0_A2_B | L5 |
| HDMI_TX0_VDD_CMN_1V8 | AE10 | VSS_83 | L6 |
| VSS_141 | AE11 | DDR_CH0_LP4/4X_CS1_B | L7 |
| VSS_142 | AE12 | VSS_84 | L8 |
| VSS_143 | AE13 | PCIE30_PORT0_AVDD1V8 | L21 |
| VSS_144 | AE14 | PCIE20_SATA30_USB30_2_AVDD_0V85 | L22 |
| VSS_145 | AE15 | AVSS1_7 | L23 |
| VSS_146 | AE16 | PCIE20_1_REFCLKP | L24 |
| VDD_LOGIC_10 | AE17 | PCIE20_1_REFCLKN | L25 |
| VDD_LOGIC_11 | AE18 | AVSS1_8 | L26 |
| VDD_LOGIC_12 | AE19 | PCIE20_1_RXP/SATA30_1_RXP | L27 |
| VDD_LOGIC_13 | AE20 | PCIE20_1_RXN/SATA30_1_RXN | L28 |
| VSS_147 | AE21 | DDR_CH0_CKB_A | M1 |
| VSS_148 | AE22 | DDR_CH0_CK_A | M2 |
| RFU7 | AE23 | VSS_85 | M3 |
| GMAC0_RXD2/SDIO_D0_M0/UART6_RX_M0/GPIO2_A6 | AE24 | VSS_86 | M4 |
| GMAC0_TXD3/SDIO_CMD_M0/I2C3_SCL_M3/GPIO2_B2 | AE25 | DDR_CH0_A1_B | M5 |
| LITCPU_AVS/SPI3_CLK_M2/GPIO0_D3 | AE26 | DDR_CH0_A0_B | M6 |
| I2S1_SDO2_M1/PDM0_SDI2_M1/PWM3_IR_M0/I2C1_SCL_M2/HDMI_TX0_SDA_M1/SPI3_CS0_M2/SATA_CPDET/GPIO0_D4 | AE27 | VSS_87 | M7 |
| I2S1_LRCK0_M1/PWM0_M0/I2C2_SCL_M0/SPI0_CS1_M0/PCIE30X1_1_PERSTN_M0/GPIO0_B7 | AE28 | VSS_88 | M8 |
| AVSS_8 | AF1 | PCIE20_SATA30_1_AVDD_1V8 | M21 |
| HDMI_TX0_D3P | AF2 | PCIE20_SATA30_1_AVDD_0V85 | M22 |
| AVSS_9 | AF3 | AVSS1_9 | M23 |
| AVSS_10 | AF4 | PCIE20_0_REFCLKP | M24 |
| AVSS_11 | AF5 | PCIE20_0_REFCLKN | M25 |
| AVSS_12 | AF6 | AVSS1_10 | M26 |
| AVSS_13 | AF7 | PCIE20_1_TXN/SATA30_1_TXN | M27 |
| AVSS_14 | AF8 | PCIE20_1_TXP/SATA30_1_TXP | M28 |
| AVSS_15 | AF9 | DDR_CH0_A4_A | N2 |
| HDMI/eDP_TX1_VDD_CMN_1V8 | AF10 | DDR_CH0_A5_A | N3 |
| USB20_AVDD_3V3 | AF11 | VSS_89 | N5 |
| AVSS_16 | AF12 | VSS_90 | N7 |
| AVSS_17 | AF13 | VSS_91 | N8 |
| AVSS_18 | AF14 | PCIE20_SATA30_0_AVDD_1V8 | N21 |
| TYPEC0_DP0_VDDH_1V8 | AF15 | PCIE20_SATA30_0_AVDD_0V85 | N22 |
| SARADC_AVDD_1V8 | AF17 | TVSS | N23 |
| VSS_149 | AF18 | AVSS1_11 | N24 |
| CIF_VSYNC/BT1120_D9/I2S1_SDO2_M0/PCIE20X1_2_BUTTON_RSTN/I2C7_SDA_M3/UART8_CTSN_M0/PWM15_IR_M1/GPIO4_B3 | AF20 | AVSS1_12 | N25 |
| VCCIO6 | AF21 | AVSS1_13 | N26 |
| GMAC0_PPSCLK/TEST_CLKOUT_M1/HDMI_TX1_CEC_M0/UART9_RX_M0/SPI1_CS1_M0/GPIO2_C4 | AF22 | PCIE20_0_TXP/SATA30_0_TXP | N27 |
| SPDIF1_TX_M1/I2S1_SDO0_M0/PCIE30X1_0_BUTTON_RSTN/SATA2_ACT_LED_M0/I2C6_SCL_M3/UART8_RX_M0/SPI0_CS1_M1/GPIO4_B1 | AF23 | PCIE20_0_TXN/SATA30_0_TXN | N28 |
| GMAC0_RXCLK/SDIO_D2_M0/I2C8_SCL_M1/UART6_RTSN_M0/GPIO2_B0 | AF24 | VSS_92 | P2 |
| CIF_D15/I2C7_SDA_M2/UART9_CTSN_M2/PWM10_M2/SPI0_CLK_M3/GPIO3_D3 | AF25 | DDR_CH0_DQ3_A | P3 |
| I2S1_SDI2_M1/PDM0_SDI0_M1/I2C6_SDA_M0/UART1_RTSN_M2/PWM6_M0/SPI0_MISO_M0/PCIE30X4_WAKEN_M0/GPIO0_C7 | AF26 | DDR_CH0_A4_B | P4 |
| I2S1_LRCK1_M1/PDM0_CLK1_M1/PWM2_M0/UART0_RX_M0/I2C4_SDA_M2/DP0_HPDIN_M1/PCIE30X1_0_WAKEN_M0/GPIO0_C4 | AF27 | DDR_CH0_A5_B | P5 |
| HDMI_TX0_D0P | AG1 | VSS_93 | P6 |
| HDMI_TX0_D0N | AG2 | DDR_CH0_LP4/4X_CKE0_B | P7 |
| AVSS_19 | AG3 | VSS_94 | P8 |
| HDMI_TX0_REXT | AG4 | OSC_1V8 | P21 |
| HDMI_TX1_SBDN/EDP_TX1_AUXN | AG5 | VSS_95 | P22 |
| USB20_HOST0_REXT | AG6 | TSADC_SHUT_ORG/TSADC_SHUT/GPIO0_A1 | P23 |
| AVSS_20 | AG7 | PMIC_SLEEP1/GPIO0_A2 | P24 |
| USB20_HOST0_DP | AG8 | SPI2_MOSI_M2/I2C0_SDA_M0/GPIO0_A6 | P25 |
| USB20_AVDD_1V8 | AG9 | AVSS1_14 | P26 |
| USB20_DVDD_0V75 | AG10 | PCIE20_0_RXN/SATA30_0_RXN | P27 |
| TYPEC0_USB20_VBUSDET | AG11 | PCIE20_0_RXP/SATA30_0_RXP | P28 |
| TYPEC0_USB20_OTG_ID | AG12 | DDR_CH0_DQ2_A | R1 |
| TYPEC0_DP0_VDD_0V85 | AG14 | DDR_CH0_DQ1_A | R2 |
| TYPEC0_DP0_VDDA_0V85 | AG15 | DDR_CH0_DQ5_A | R3 |
| AVSS_21 | AG17 | VSS_96 | R4 |
| BT1120_D11/PCIE30X4_WAKEN_M1/SATA1_ACT_LED_M0/UART9_RX_M1/PWM12_M1/SPI3_MISO_M1/GPIO4_B5 | AG18 | DDR_CH0_LP4/4X_CKE1_A | R5 |
| CIF_CLKIN/BT1120_CLKOUT/I2S1_SDI3_M0/I2C6_SDA_M3/UART8_TX_M0/SPI2_CS1_M1/GPIO4_B0 | AG20 | DDR_CH0_LP4/4X_CKE1_B | R6 |
| BT1120_D12/PCIE30X4_PERSTN_M1/SATA0_ACT_LED_M0/I2C5_SCL_M1/PWM13_M1/SPI3_MOSI_M1/GPIO4_B6 | AG21 | VSS_97 | R7 |
| RFU6 | AG22 | VSS_98 | R8 |
| CIF_HREF/BT1120_D8/I2S1_SDO1_M0/PCIE30X1_1_BUTTON_RSTN/I2C7_SCL_M3/UART8_RTSN_M0/PWM14_M1/SPI0_CS0_M1/GPIO4_B2 | AG23 | PMU_0V75 | R21 |
| GMAC0_TXCLK/SDIO_CLK_M0/I2C3_SDA_M3/GPIO2_B3 | AG24 | PMUIO2 | R22 |
| RFU5 | AG25 | PMIC_INT_L/GPIO0_A7 | R23 |
| CIF_D12/PCIE20X1_2_WAKEN_M0/HDMI_TX0_SDA_M2/I2C5_SDA_M0/UART4_RX_M1/PWM8_M2/SPI3_CLK_M3/GPIO3_D0 | AG26 | SPI2_MISO_M2/I2C0_SCL_M0/GPIO0_B3 | R24 |
| I2S1_SCLK0_M1/JTAG_TMS_M2/I2C1_SDA_M0/UART2_RX_M0/PCIE30X1_1_WAKEN_M0/GPIO0_B6 | AG27 | SDMMC_DET/GPIO0_A4 | R25 |
| I2S1_SCLK1_M1/PDM0_CLK0_M1/PWM1_M0/I2C2_SDA_M0/SPI0_MOSI_M0/PCIE30X1_0_CLKREQN_M0/GPIO0_C0 | AG28 | VSS_99 | R26 |
| HDMI_TX0_D1P | AH1 | XOUT_24M | R27 |
| HDMI_TX0_D1N | AH2 | XIN_24M | R28 |
| AVSS_22 | AH3 | DDR_CH0_DQ4_A | T2 |
| HDMI/eDP_TX1_REXT | AH4 | VSS_100 | T3 |
| HDMI_TX1_SBDP/EDP_TX1_AUXP | AH5 | VSS_101 | T5 |
| USB20_HOST1_REXT | AH6 | VSS_102 | T7 |
| USB20_HOST0_DM | AH8 | VSS_103 | T8 |
| USB20_OTG1_REXT | AH9 | PMUIO1_1V8 | T21 |
| TYPEC0_USB20_OTG0_REXT | AH11 | REFCLK_OUT/GPIO0_A0 | T27 |
| TYPEC0_DP0_REXT | AH12 | DDR_CH0_DQS0N_A | U1 |
| SARADC_IN1 | AH14 | DDR_CH0_DQS0P_A | U2 |
| SARADC_IN3 | AH15 | VSS_104 | U3 |
| SARADC_IN2 | AH17 | DDR_CH0_LP4/4X_CKE0_A | U4 |
| CIF_CLKOUT/BT1120_D10/I2S1_SDO3_M0/PCIE30X4_CLKREQN_M1/DP0_HPDIN_M0/SPDIF0_TX_M1/UART9_TX_M1/PWM11_IR_M1/GPIO4_B4 | AH18 | DDR_CH0_A3_A | U5 |
| BT1120_D14/PCIE20X1_2_WAKEN_M1/HDMI_TX0_SDA_M0/I2C8_SCL_M3/SPI3_CS0_M1/GPIO4_C0 | AH20 | VSS_105 | U6 |
| BT1120_D15/SPDIF1_TX_M2/PCIE20X1_2_PERSTN_M1/HDMI_TX0_CEC_M0/I2C8_SDA_M3/PWM6_M1/SPI3_CS1_M1/GPIO4_C1 | AH21 | DDR_CH0_A1_A | U7 |
| VSS_150 | AH22 | VSS_106 | U8 |
| GMAC0_TXEN/I2S2_LRCK_M0/I2C2_SDA_M1/UART1_RTSN_M0/SPI1_CLK_M0/GPIO2_C0 | AH23 | PMUIO2_1V8 | U21 |
| GMAC0_RXD0/I2C2_SCL_M1/UART1_CTSN_M0/SPI1_MISO_M0/GPIO2_C1 | AH24 | VSS_107 | U22 |
| CIF_D14/I2C7_SCL_M2/UART9_RTSN_M2/SPI0_MOSI_M3/GPIO3_D2 | AH25 | I2S1_SDO1_M1/I2C0_SDA_M2/UART1_RX_M2/SPI3_MOSI_M2/HDMI_TX1_CEC_M1/GPIO0_D2 | U23 |
| GMAC1_TXD1/I2S2_MCLK_M1/UART2_CTSN/GPIO3_B4 | AH26 | I2S1_SDI3_M1/PDM0_SDI1_M1/I2C6_SCL_M0/UART1_CTSN_M2/PWM7_IR_M0/SPI3_MISO_M2/PCIE30X4_PERSTN_M0/GPIO0_D0 | U24 |
| PMIC_SLEEP_3/GPIO0_C1 | AH27 | PMIC_SLEEP_5/GPIO0_C3 | U25 |
| HDMI_TX0_D2P | AJ1 | SPI2_CS0_M2/I2C1_SDA_M1/PWM5_M0/UART0_TX_M1/GPIO0_B1 | U26 |
| HDMI_TX0_D2N | AJ2 | SPI2_CS1_M2/I2C1_SCL_M1/UART0_RX_M1/GPIO0_B0 | U27 |
| AVSS_23 | AJ3 | SPI2_CLK_M2/SDMMC_PWREN/PMU_DEBUG/GPIO0_A5 | U28 |
| AVSS_24 | AJ4 | DDR_CH0_DQ0_A | V2 |
| AVSS_25 | AJ5 | DDR_CH0_DM0_A | V3 |
| AVSS_26 | AJ6 | VSS_108 | V4 |
| AVSS_27 | AJ7 | DDR_CH0_LP4/4X_CS1_A | V5 |
| AVSS_28 | AJ8 | DDR_CH0_LP4/4X_CS0_A | V6 |
| AVSS_29 | AJ9 | DDR_CH0_RESET_A | V7 |
| AVSS_30 | AJ10 | VSS_109 | V8 |
| AVSS_31 | AJ11 | VSS_110 | V21 |
| AVSS_32 | AJ12 | EMMCIO_1V8 | V22 |
| AVSS_33 | AJ14 | GMAC1_TXD2/SDIO_D0_M1/I2S3_MCLK/FSPI_D0_M2/I2C6_SDA_M4/PWM10_M0/SPI4_MISO_M1/GPIO3_A0 | V23 |
| SARADC_IN0_BOOT | AJ15 | I2S1_SDI1_M1/NPU_AVS/UART0_RTSN/PWM5_M1/SPI0_CLK_M0/PCIE30X4_CLKREQN_M0/SATA_CP_POD/GPIO0_C6 | V24 |
| VSS_151 | AJ17 | PMIC_SLEEP6/PDM0_SDI3_M1/GPIO0_D6 | V25 |
| BT1120_D13/PCIE20X1_2_CLKREQN_M1/HDMI_TX0_SCL_M0/I2C5_SDA_M1/SPI3_CLK_M1/GPIO4_B7 | AJ18 | I2S1_SDI0_M1/GPU_AVS/UART0_TX_M0/I2C4_SCL_M2/DP1_HPDIN_M1/PWM4_M0/PCIE30X1_0_PERSTN_M0/GPIO0_C5 | V26 |
| CIF_D6/BT1120_D6/I2S1_SDI1_M0/I2C5_SCL_M2/UART3_RX_M2/SPI2_CLK_M1/GPIO4_A6 | AJ19 | CLK32K_IN/CLK32K_OUT0/GPIO0_B2 | V27 |
| CIF_D2/BT1120_D2/I2S1_LRCK_M0/PCIE30X1_1_PERSTN_M1/SPI0_CLK_M1/GPIO4_A2 | AJ20 | DDR_CH0_DQ7_A | W1 |
| CIF_D1/BT1120_D1/I2S1_SCLK_M0/PCIE30X1_1_WAKEN_M1/UART9_CTSN_M1/SPI0_MOSI_M1/GPIO4_A1 | AJ21 | DDR_CH0_DQ6_A | W2 |
| GMAC0_RXD3/SDIO_D1_M0/UART6_TX_M0/GPIO2_A7 | AJ22 | VSS_111 | W3 |
| GMAC0_RXD1/I2C6_SDA_M2/UART9_TX_M0/SPI1_MOSI_M0/GPIO2_C2 | AJ23 | VSS_112 | W5 |
| CIF_D11/PCIE20X1_2_CLKREQN_M0/HDMI_TX0_SCL_M2/I2C5_SCL_M0/SPI3_MOSI_M3/GPIO3_C7 | AJ24 | DDR_CH0_ZQ_A | W8 |
| GMAC1_PPSCLK/UART7_RX_M1/SPI1_CLK_M1/GPIO3_C1 | AJ25 | VSS_113 | W21 |
| GMAC1_PTP_REF_CLK/HDMI_TX1_HPD_M1/I2C3_SCL_M1/SPI1_MOSI_M1/GPIO3_B7 | AJ26 | I2S1_SDO3_M1/CPU_BIG1_AVS/I2C1_SDA_M2/HDMI_TX0_SCL_M1/SPI3_CS1_M2/SATA_MP_SWITCH/GPIO0_D5 | W26 |
| GMAC1_RXD2/SDIO_D2_M1/I2S3_LRCK/AUDDSM_LP/FSPI_D2_M2/UART8_TX_M1/SPI4_CLK_M1/GPIO3_A2 | AJ27 | PMIC_SLEEP2/GPIO0_A3 | W27 |
| GMAC1_TXD3/SDIO_D1_M1/I2S3_SCLK/AUDDSM_LN/FSPI_D1_M2/I2C6_SCL_M4/PWM11_IR_M0/SPI4_MOSI_M1/GPIO3_A1 | AJ28 | NPOR | W28 |
| HDMI_TX1_D3N/EDP_TX1_D3N | AK1 | DDR_CH0_DQ14_A | Y1 |
| HDMI_TX1_D3P/EDP_TX1_D3P | AK2 | DDR_CH0_DQ15_A | Y2 |
| HDMI_TX1_D0P/EDP_TX1_D0P | AK3 | VSS_114 | Y3 |
| HDMI_TX1_D1P/EDP_TX1_D1P | AK4 | DDR_CH0_A2_A | Y4 |
| HDMI_TX1_D2P/EDP_TX1_D2P | AK5 | DDR_CH0_A0_A | Y5 |
| USB20_HOST1_DM | AK6 | VSS_115 | Y6 |
| USB20_OTG1_DM | AK7 | VSS_116 | Y7 |
| TYPEC0_USB20_OTG_DM | AK8 | VCCIO2_1V8 | Y8 |
| TYPEC0_SSRX1N/DP0_TX0N | AK9 | VCCIO5 | Y21 |
| TYPEC0_SSTX1P/DP0_TX1P | AK10 | CIF_D8/FSPI_CS0N_M2/PCIE30X4_CLKREQN_M2/HDMI_TX1_CEC_M2/UART5_TX_M1/SPI3_CS0_M3/GPIO3_C4 | Y22 |
| TYPEC0_SBU1/DP0_AUXP | AK11 | GMAC1_MCLKINOUT/I2S2_LRCK_M1/UART3_RX_M1/PWM13_M0/GPIO3_B6 | Y23 |
| TYPEC0_SSRX2N/DP0_TX2N | AK12 | GMAC1_TXD0/I2S2_SDO_M1/UART2_RTSN/GPIO3_B3 | Y24 |
| TYPEC0_SSTX2P/DP0_TX3P | AK13 | ETH1_REFCLKO_25M/I2C4_SCL_M0/GPIO3_A6 | Y25 |
| CIF_D5/BT1120_D5/I2S1_SDI0_M0/PCIE30X1_0_PERSTN_M1/I2C3_SDA_M2/UART3_TX_M2/SPI2_MOSI_M1/GPIO4_A5 | AK14 | PMIC_SLEEP_4/GPIO0_C2 | Y26 |
| CIF_D4/BT1120_D4/PCIE30X1_0_WAKEN_M1/I2C3_SCL_M2/UART0_RX_M2/SPI2_MISO_M1/GPIO4_A4 | AK15 | I2S1_SDO0_M1/CPU_BIG0_AVS/I2C0_SCL_M2/UART0_CTSN/UART1_TX_M2/SPI0_CS0_M0/HDMI_TX0_CEC_M1/GPIO0_D1 | Y27 |
| CIF_D3/BT1120_D3/PCIE30X1_0_CLKREQN_M1/UART0_TX_M2/GPIO4_A3 | AK16 | DDR_CH0_VDDQ_0 | 1E1 |
| CIF_D7/BT1120_D7/I2S1_SDI2_M0/I2C5_SDA_M2/SPI2_CS0_M1/GPIO4_A7 | AK17 | DDR_CH01_PLL_AVDD1V8 | 1E2 |
| GMAC0_RXDV_CRS/PWM2_M2/GPIO4_C2 | AK18 | VSS_175 | 1E3 |
| GMAC0_MCLKINOUT/I2S2_SDO_M0/I2C7_SCL_M1/PWM4_M1/GPIO4_C3 | AK19 | DDR_CH1_VDD_5 | 1E4 |
| GMAC0_TXD1/I2S2_SCLK_M0/I2C5_SDA_M4/UART1_TX_M0/GPIO2_B7 | AK20 | VDD_LOGIC_0 | 1E5 |
| PCIE30X4_BUTTON_RSTN/DP1_HPDIN_M0/MCU_JTAG_TMS_M1/UART9_TX_M2/PWM11_IR_M3/SPI0_CS1_M3/GPIO3_D5 | AK21 | VSS_176 | 1E6 |
| CIF_D13/PCIE20X1_2_PERSTN_M0/UART4_TX_M1/PWM9_M2/SPI0_MISO_M3/GPIO3_D1 | AK22 | VDD_CPU_BIG_3 | 1E7 |
| CIF_D9/FSPI_CS1N_M2/PCIE30X4_WAKEN_M2/HDMI_TX1_SDA_M1/UART5_RX_M1/SPI3_CS1_M3/GPIO3_C5 | AK23 | VDD_CPU_BIG_4 | 1E8 |
| CIF_D10/PCIE30X4_PERSTN_M2/HDMI_TX1_SCL_M1/SPI3_MISO_M3/GPIO3_C6 | AK24 | VDD_CPU_BIG_5 | 1E9 |
| GMAC1_PPSTRIG/I2C3_SDA_M1/UART7_TX_M1/SPI1_MISO_M1/GPIO3_C0 | AK25 | VDD_CPU_BIG_6 | 1E10 |
| GMAC1_RXD1/PWM9_M0/GPIO3_B0 | AK26 | PLL_AVDD1V8 | 1E11 |
| GMAC1_RXCLK/SDIO_CLK_M1/FSPI_CLK_M2/I2C4_SDA_M0/UART8_CTSN_M1/GPIO3_A5 | AK27 | VSS_153 | 1A1 |
| GMAC1_TXCLK/SDIO_CMD_M1/I2S3_SDI/AUDDSM_RP/UART8_RTSN_M1/SPI4_CS1_M1/GPIO3_A4 | AK28 | VSS_154 | 1A2 |
| AVSS_34 | AL1 | VSS_155 | 1A3 |
| HDMI_TX1_D0N/EDP_TX1_D0N | AL2 | VSS_156 | 1A4 |
| HDMI_TX1_D1N/EDP_TX1_D1N | AL3 | VSS_157 | 1A5 |
| HDMI_TX1_D2N/EDP_TX1_D2N | AL4 | VSS_158 | 1A6 |
| AVSS_35 | AL5 | VSS_159 | 1A7 |
| USB20_HOST1_DP | AL6 | VSS_160 | 1A8 |
| USB20_OTG1_DP | AL7 | VSS_161 | 1A9 |
| TYPEC0_USB20_OTG_DP | AL8 | VSS_162 | 1A10 |
| TYPEC0_SSRX1P/DP0_TX0P | AL9 | VSS_163 | 1A11 |
| TYPEC0_SSTX1N/DP0_TX1N | AL10 | VSS_164 | 1B1 |
| TYPEC0_SBU2/DP0_AUXN | AL11 | DDR_CH1_VDDQ_0 | 1B2 |
| TYPEC0_SSRX2P/DP0_TX2P | AL12 | DDR_CH1_VDDQ_1 | 1B3 |
| TYPEC0_SSTX2N/DP0_TX3N | AL13 | DDR_CH1_VDDQ_2 | 1B4 |
| CIF_D0/BT1120_D0/I2S1_MCLK_M0/PCIE30X1_1_CLKREQN_M1/UART9_RTSN_M1/SPI0_MISO_M1/GPIO4_A0 | AL14 | DDR_CH1_VDDQ_3 | 1B5 |
| GMAC0_TXD0/I2S2_MCLK_M0/I2C5_SCL_M4/UART1_RX_M0/GPIO2_B6 | AL15 | DDR_CH1_VDDQ_4 | 1B6 |
| GMAC0_MDIO/UART9_CTSN_M0/PWM6_M2/GPIO4_C5 | AL16 | DDR_CH01_PLL_AVSS_2 | 1B7 |
| GMAC0_MDC/I2C7_SDA_M1/UART9_RTSN_M0/PWM5_M2/GPIO4_C4 | AL18 | VSS_165 | 1B8 |
| HDMI_TX0_HPD_M1/MCU_JTAG_TCK_M1/UART9_RX_M2/SPI0_CS0_M3/GPIO3_D4 | AL20 | VCCIO4 | 1B9 |
| GMAC1_MDIO/I2C8_SDA_M4/UART7_CTSN_M1/PWM15_IR_M0/SPI1_CS1_M1/GPIO3_C3 | AL21 | VCCIO4_1V8 | 1B10 |
| GMAC1_TXEN/I2S2_SCLK_M1/UART3_TX_M1/PWM12_M0/GPIO3_B5 | AL23 | VCCIO1_1V8 | 1B11 |
| GMAC1_RXDV_CRS/UART2_TX_M2/PWM2_M1/GPIO3_B1 | AL25 | VSS_166 | 1C1 |
| GMAC1_RXD0/PWM8_M0/GPIO3_A7 | AL26 | DDR_CH01_PLL_DVDD | 1C2 |
| GMAC1_TXER/I2S2_SDI_M1/UART2_RX_M2/PWM3_IR_M1/GPIO3_B2 | AL27 | DDR_CH1_VDD_0 | 1C3 |
| VSS_152 | AL28 | DDR_CH1_VDD_1 | 1C4 |
| DDR_CH0_DM0_B | B1 | DDR_CH1_VDD_2 | 1C5 |
| DDR_CH1_DQ11_C | B2 | DDR_CH1_VDD_3 | 1C6 |
| DDR_CH1_DQ9_C | B3 | DDR_CH1_VDDQ_CK | 1C7 |
| DDR_CH1_DQ15_C | B4 | VSS_167 | 1C8 |
| DDR_CH1_DQ13_C | B5 | VSS_168 | 1C9 |
| DDR_CH1_DQ7_C | B6 | VSS_169 | 1C10 |
| DDR_CH1_DQ6_C | B7 | VSS_170 | 1C11 |
| DDR_CH1_DQ4_C | B8 | DDR_CH0_VDDQ_CK | 1D1 |
| DDR_CH1_DQ3_C | B9 | DDR_CH01_PLL_AVSS_1 | 1D2 |
| DDR_CH1_CK_C | B10 | VSS_171 | 1D3 |
| VSS_4 | B11 | DDR_CH1_VDD_4 | 1D4 |
| DDR_CH1_CK_D | B12 | VSS_172 | 1D5 |
| DDR_CH1_A3_D | B13 | VSS_173 | 1D6 |
| DDR_CH1_A4_D | B14 | VSS_174 | 1D7 |
| DDR_CH1_DQ3_D | B15 | VDD_CPU_BIG_0 | 1D8 |
| DDR_CH1_DQ1_D | B16 | VDD_CPU_BIG_1 | 1D9 |
| DDR_CH1_DQ7_D | B17 | VDD_CPU_BIG_2 | 1D10 |
| DDR_CH1_DQ13_D | B18 | PCIE20_SATA30_USB30_2_AVDD_1V8 | 1D11 |
| DDR_CH1_DQ15_D | B19 | DDR_CH0_VDDQ_1 | 1F1 |
| DDR_CH1_DQ9_D | B20 | DDR_CH0_VDD_0 | 1F2 |
| DDR_CH1_DQ11_D | B21 | DDR_CH0_VDD_1 | 1F3 |
| VSS_5 | B22 | VSS_177 | 1F4 |
| HDMI_TX1_SCL_M2/SPI2_MISO_M0/GPIO1_A4 | B23 | VDD_LOGIC_1 | 1F5 |
| PDM1_CLK0_M1/PCIE30X1_0_PERSTN_M2/UART7_RX_M2/SPI0_CS0_M2/GPIO1_B4 | B24 | VSS_178 | 1F6 |
| SPDIF1_TX_M0/SATA2_ACT_LED_M1/I2C5_SDA_M3/UART1_RX_M1/PWM13_M2/GPIO1_B7 | B25 | VDD_CPU_BIG_7 | 1F7 |
| HDMI_TX1_HPD_M0/SPI2_CLK_M0/GPIO1_A6 | B26 | VDD_CPU_BIG_8 | 1F8 |
| PDM1_SDI3_M1/PCIE30X4_PERSTN_M3/UART4_RX_M2/SPI0_MOSI_M2/GPIO1_B2 | B27 | VDD_CPU_BIG_9 | 1F9 |
| PDM1_SDI2_M1/PCIE30X4_WAKEN_M3/SPI0_MISO_M2/GPIO1_B1 | B28 | VDD_CPU_BIG_10 | 1F10 |
| DDR_CH0_DQ5_B | C1 | PLL_AVSS | 1F11 |
| DDR_CH0_DQ6_B | C2 | DDR_CH0_VDDQ_2 | 1G1 |
| VSS_6 | C3 | DDR_CH0_VDD_2 | 1G2 |
| VSS_7 | C4 | DDR_CH0_VDD_3 | 1G3 |
| VSS_8 | C5 | VSS_179 | 1G4 |
| VSS_9 | C6 | VDD_LOGIC_2 | 1G5 |
| VSS_10 | C7 | VSS_180 | 1G6 |
| VSS_11 | C8 | VSS_181 | 1G7 |
| DDR_CH1_DQ1_C | C9 | VSS_182 | 1G8 |
| DDR_CH1_CKB_C | C10 | VSS_183 | 1G9 |
| VSS_12 | C11 | VSS_184 | 1G10 |
| DDR_CH1_CKB_D | C12 | PLL_DVDD0V75 | 1G11 |
| DDR_CH1_A5_D | C13 | DDR_CH0_VDDQ_3 | 1H1 |
| VSS_13 | C14 | DDR_CH0_VDD_4 | 1H2 |
| VSS_14 | C15 | VSS_185 | 1H3 |
| VSS_15 | C17 | VSS_186 | 1H4 |
| VSS_16 | C18 | VDD_LOGIC_3 | 1H5 |
| VSS_17 | C20 | VSS_187 | 1H6 |
| DDR_CH1_DM1_D | C21 | VSS_188 | 1H7 |
| PCIE30X1_0_CLKREQN_M2/UART7_TX_M2/SPI0_CS1_M2/GPIO1_B5 | C22 | VDD_CPU_LIT_0 | 1H8 |
| PDM1_SDI1_M1/PCIE30X4_CLKREQN_M3/SPI2_CS1_M0/GPIO1_B0 | C23 | VDD_CPU_LIT_1 | 1H9 |
| PCIE30X1_1_CLKREQN_M2/DP0_HPDIN_M2/I2C2_SDA_M4/UART6_RX_M1/SPI4_MISO_M2/GPIO1_A0 | C24 | VSS_189 | 1H10 |
| HDMI_TX0_HPD_M0/SPI2_MOSI_M0/GPIO1_A5 | C25 | VSS_190 | 1H11 |
| HDMI_TX1_SDA_M2/I2C4_SCL_M3/UART6_CTSN_M1/PWM1_M2/SPI4_CS0_M2/GPIO1_A3 | C26 | DDR_CH0_VDDQ_4 | 1J1 |
| I2S0_SDO0/I2C4_SCL_M4/UART4_CTSN/GPIO1_C7 | C27 | DDR_CH0_VDD_5 | 1J2 |
| PDM0_CLK0_M0/I2C4_SDA_M4/PWM15_IR_M2/GPIO1_C6 | C28 | VSS_191 | 1J3 |
| DDR_CH0_DQ11_B | D1 | VDD_LOGIC_4 | 1J4 |
| DDR_CH0_DQ4_B | D2 | VDD_LOGIC_5 | 1J5 |
| VSS_18 | D3 | VSS_192 | 1J6 |
| DDR_CH1_DM1_C | D5 | VDD_CPU_LIT_2 | 1J7 |
| DDR_CH1_DQS1N_C | D6 | VDD_CPU_LIT_3 | 1J8 |
| DDR_CH1_DQS0N_C | D8 | VDD_CPU_LIT_4 | 1J9 |
| VSS_19 | D9 | VDD_CPU_LIT_5 | 1J10 |
| DDR_CH1_LP4/4X_CS1_C | D11 | VSS_193 | 1J11 |
| VSS_20 | D12 | VSS_194 | 1K1 |
| DDR_CH1_LP4/4X_CKE0_C | D14 | VSS_195 | 1K2 |
| VSS_21 | D15 | VSS_196 | 1K3 |
| DDR_CH1_A0_D | D17 | VDD_LOGIC_6 | 1K4 |
| VSS_22 | D18 | VDD_LOGIC_7 | 1K5 |
| DDR_CH1_DQS0N_D | D20 | VDD_LOGIC_8 | 1K6 |
| DDR_CH1_DQS1N_D | D21 | VSS_197 | 1K7 |
| RFU0 | D22 | VSS_198 | 1K8 |
| PCIE30X1_1_WAKEN_M2/DP1_HPDIN_M2/SATA1_ACT_LED_M1/I2C2_SCL_M4/UART6_TX_M1/SPI4_MOSI_M2/GPIO1_A1 | D23 | VSS_199 | 1K9 |
| I2S0_LRCK/UART4_RTSN/GPIO1_C5 | D24 | VSS_200 | 1K10 |
| I2C3_SDA_M0/UART3_RX_M0/SPI4_MISO_M0/GPIO1_C0 | D25 | VSS_201 | 1K11 |
| I2S0_SCLK/I2C6_SCL_M1/UART3_CTSN/PWM7_IR_M2/SPI4_CS0_M0/GPIO1_C3 | D26 | VCCIO2 | 1L1 |
| VSS_23 | D27 | VSS_202 | 1L2 |
| DDR_CH0_DQ9_B | E1 | VSS_203 | 1L3 |
| DDR_CH0_DQ10_B | E2 | VSS_204 | 1L4 |
| VSS_24 | E3 | VSS_205 | 1L5 |
| DDR_CH0_DM1_B | E4 | VDD_LOGIC_9 | 1L6 |
| DDR_CH1_DQS1P_C | E6 | VSS_206 | 1L7 |
| VSS_25 | E7 | VSS_207 | 1L8 |
| DDR_CH1_DQS0P_C | E8 | VDD_NPU_0 | 1L9 |
| DDR_CH1_A3_C | E9 | VDD_NPU_1 | 1L10 |
| VSS_26 | E10 | VSS_208 | 1L11 |
| DDR_CH1_LP4/4X_CS0_C | E11 | OTP_VDDOTP_0V75 | 1M1 |
| DDR_CH1_A1_C | E12 | VSS_209 | 1M2 |
| VSS_27 | E13 | VDD_GPU_0 | 1M3 |
| DDR_CH1_LP4/4X_CKE1_C | E14 | VDD_GPU_1 | 1M4 |
| DDR_CH1_LP4/4X_CKE0_D | E15 | VDD_GPU_2 | 1M5 |
| VSS_28 | E16 | VSS_210 | 1M6 |
| DDR_CH1_LP4/4X_CS1_D | E17 | VSS_211 | 1M7 |
| DDR_CH1_DQ5_D | E18 | VSS_212 | 1M8 |
| VSS_29 | E19 | VDD_NPU_2 | 1M9 |
| DDR_CH1_DQS0P_D | E20 | VDD_NPU_3 | 1M10 |
| DDR_CH1_DQS1P_D | E21 | VSS_213 | 1M11 |
| RFU2 | E22 | VSS_214 | 1N1 |
| I2S0_SDI0/GPIO1_D4 | E23 | VSS_215 | 1N2 |
| I2C3_SCL_M0/UART3_TX_M0/SPI4_MOSI_M0/GPIO1_C1 | E24 | VSS_216 | 1N3 |
| I2S0_MCLK/I2C6_SDA_M1/UART3_RTSN/PWM3_IR_M2/SPI4_CLK_M0/GPIO1_C2 | E25 | VDD_GPU_3 | 1N4 |
| VSS_30 | E26 | VDD_GPU_4 | 1N5 |
| PCIE30_PORT0_TX1N | E27 | VDD_GPU_5 | 1N6 |
| PCIE30_PORT0_TX1P | E28 | VSS_217 | 1N7 |
| DDR_CH0_DQ15_B | F1 | VSS_218 | 1N8 |
| DDR_CH0_DQ8_B | F2 | VDD_NPU_4 | 1N9 |
| VSS_31 | F3 | VDD_NPU_5 | 1N10 |
| VSS_32 | F4 | VSS_219 | 1N11 |
| DDR_CH0_DQS1P_B | F5 | HDMI_TX0_AVDD_0V75 | 1P1 |
| VSS_33 | F7 | AVSS_1 | 1P2 |
| VSS_34 | F8 | VSS_220 | 1P3 |
| DDR_CH1_A4_C | F9 | VDD_GPU_6 | 1P4 |
| VSS_35 | F11 | VDD_GPU_7 | 1P5 |
| DDR_CH1_A0_C | F12 | VDD_GPU_8 | 1P6 |
| VSS_36 | F14 | VSS_221 | 1P7 |
| DDR_CH1_LP4/4X_CKE1_D | F15 | VSS_222 | 1P8 |
| VSS_37 | F17 | VSS_223 | 1P9 |
| DDR_CH1_DQ4_D | F18 | VSS_224 | 1P10 |
| VSS_38 | F20 | VSS_225 | 1P11 |

## 3. Электрические характеристики

### 3.1 Абсолютные пределы

Выход за абсолютные максимумы/минимумы может необратимо повредить чип; длительная работа при максимуме снижает надёжность. Это не рекомендуемые рабочие условия.

| Параметры | Группа питания | Минимум | Максимум | Единица |
| --- | --- | --- | --- | --- |
| Питание CPU | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Питание памяти CPU | VDD_CPU_BIG VDD_CPU_LIT | -0.3 | 1.1 | V |
| Питание GPU | VDD_GPU | -0.3 | 1.1 | V |
| Питание памяти GPU | VDD_GPU | -0.3 | 1.1 | V |
| Питание NPU | VDD_NPU | -0.3 | 1.1 | V |
| Питание памяти NPU | VDD_NPU | -0.3 | 1.1 | V |
| Питание логики, VCODEC и его памяти | VDD_LOGIC | -0.3 | 0.95 | V |
| 0.75V напряжение питания | PMU_0V75 PLL_DVDD0V75 USB20_DVDD_0V75 HDMI_TX0_VDD_0V75 HDMI_TX0_AVDD_0V75 HDMI/eDP_TX1_VDD_0V75 HDMI/eDP_TX1_AVDD_0V75 PCIE30_PORT0_AVDD0V75 OTP_VDDOTP_0V75 | -0.3 | 0.95 | V |
| 0.85V напряжение питания | DDR_CH0_VDD DDR_CH1_VDD DDR_CH01_PLL_DVDD TYPEC0_DP0_VDD_0V85 TYPEC0_DP0_VDDA_0V85 PCIE20_SATA30_0_AVDD_0V85 PCIE20_SATA30_1_AVDD_0V85 PCIE20_SATA30_USB30_2_AVDD_0V85 | -0.3 | 1.00 | V |
| 1.8V напряжение питания | DDR_CH01_PLL_AVDD1V8 PLL_AVDD1V8 USB20_AVDD_1V8 TYPEC0_DP0_VDDH_1V8 HDMI_TX0_VDD_CMN_1V8 HDMI_TX0_VDD_IO_1V8 HDMI/eDP_TX1_VDD_CMN_1V8 HDMI/eDP_TX1_VDD_IO_1V8 PCIE20_SATA30_0_AVDD_1V8 PCIE20_SATA30_1_AVDD_1V8 PCIE20_SATA30_USB30_2_AVDD_1V8 PCIE30_PORT0_AVDD1V8 SARADC_AVDD_1V8 OSC_1V8 | -0.5 | 1.98 | V |
| 3.3V напряжение питания | USB20_AVDD_3V3 | -0.5 | 3.63 | V |
| Питание GPIO только 1.8V | PMUIO1_1V8 EMMCIO_1V8 VCCIO1_1V8 VCCIO3_1V8 | -0.5 | 1.98 | V |
| Питание GPIO 1.8V/3.3V | PMUIO2 VCCIO2 VCCIO4 VCCIO5 VCCIO6 | -0.5 | 3.63 | V |
| Питание DDR IO (LPDDR4/4X 0.6V) | DDR_CH0_VDDQ DDR_CH0_VDDQ_CK DDR_CH1_VDDQ DDR_CH1_VDDQ_CK | -0.3 | 0.7 | V |
| Питание DDR IO (LPDDR4/4X 1.1V) | DDR_CH01_VDDQ_CKE | -0.3 | 1.25 | V |
| Температура хранения | Tstg | -40 | 125 | ℃ |
| Максимальная температура перехода (в оригинале Conjunction) | Tj | NA | 125 | ℃ |

### 3.2 Рекомендуемые условия

| Параметры | Обозначение | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- |
| Напряжение больших ядер CPU 0/1 и памяти | VDD_CPU_BIG | 0.75 | 0.75 | 0.95 | V |
| Напряжение малых ядер CPU, DSU и их памяти | VDD_CPU_LIT | 0.75 | 0.75 | 0.95 | V |
| Напряжение GPU и памяти | VDD_GPU | 0.75 | 0.75 | 0.85 | V |
| Напряжение NPU и памяти | VDD_NPU | 0.75 | 0.75 | 0.85 | V |
| Напряжение логики, VCODEC и его памяти | VDD_LOGIC | 0.675 | 0.75 | 0.825 | V |
| Напряжение PMU | PMU_0V75 | 0.675 | 0.75 | 0.825 | V |
| Цифровое питание GPIO (1.8V только) | PMUIO1_1V8, VCCIO1_1V8, VCCIO3_1V8 | 1.65 | 1.8 | 1.95 | V |
| Цифровое питание GPIO (3.3V/1.8V) | PMUIO2, VCCIO2, VCCIO4, VCCIO5, VCCIO6 | 2.7 1.65 | 3.3 1.8 | 3.6 1.95 | V |
| Питание eMMC IO (1.8V) | EMMCIO_1V8 | 1.65 | 1.8 | 1.95 | V |
| DDR CH0 Питание логики(0.85V) | DDR_CH0_VDD, DDR_CH1_VDD, | 0.675 | 0.85 | 0.935 | V |
| DDR CH01_PLL питание(0.85V) | DDR_CH01_PLL_DVDD | 0.675 | 0.85 | 0.8925 | V |
| DDR CH01_PLL питание(1.8V) | DDR_CH01_PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| LPDDR4 Питание IO VDDQ | DDR_CH0_VDDQ, DDR_CH0_VDDQ_CK, DDR_CH1_VDDQ, DDR_CH1_VDDQ_CK | 0.57 | 0.6 | 0.63 | V |
| LPDDR4 Питание удержания IO VDDQ | DDR_CH01_VDDQ_CKE | 1.045 | 1.1 | 1.155 | V |
| PLL Аналоговое питание(0.75V) | PLL_DVDD0V75 | 0.675 | 0.75 | 0.8925 | V |
| PLL Аналоговое питание(1.8V) | PLL_AVDD1V8 | 1.62 | 1.8 | 1.98 | V |
| USB 2.0 Аналоговое питание (0.75V) | USB20_DVDD_0V75 | 0.6975 | 0.75 | 0.825 | V |
| USB 2.0 Аналоговое питание (1.8V) | USB20_AVDD_1V8 | 1.674 | 1.8 | 1.98 | V |
| USB 2.0 Аналоговое питание (3.3V) | USB20_AVDD_3V3 | 3.069 | 3.3 | 3.63 | V |
| USB & DP Аналоговое питание (0.85V) | TYPEC0_DP0_VDD_0V85, TYPEC0_DP0_VDDA_0V85 | 0.8075 | 0.85 | 0.8925 | V |
| USB & DP Аналоговое питание (1.8V) | TYPEC0_DP0_VDDH_1V8 | 1.71 | 1.8 | 1.89 | V |
| Combo PIPE PHY Аналоговое питание(0.85V) | PCIE20_SATA30_0_AVDD_0V85, PCIE20_SATA30_1_AVDD_0V85, PCIE20_SATA30_USB30_2_AVDD_0V85 | 0.8 | 0.85 | 0.935 | V |
| Combo PIPE PHY Аналоговое питание(1.8V) | PCIE20_SATA30_0_AVDD_1V8, PCIE20_SATA30_1_AVDD_1V8, PCIE20_SATA30_USB30_2_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| PCIe30 Аналоговое питание(0.75V) | PCIE30_PORT0_AVDD0V75 | 0.7125 | 0.75 | 0.8925 | V |
| PCIe30 Аналоговое питание(1.8V) | PCIE30_PORT0_AVDD1V8 | 1.71 | 1.8 | 1.89 | V |
| HDMI/eDP TX Цифровое питание (0.75V) | HDMI_TX0_VDD_0V75, HDMI/eDP_TX1_VDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (0.75V) | HDMI_TX0_AVDD_0V75, HDMI/eDP_TX1_AVDD_0V75 | 0.675 | 0.75 | 0.85 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI_TX0_VDD_CMN_1V8, HDMI/eDP_TX1_VDD_CMN_1V8 | 1.62 | 1.8 | 1.98 | V |
| HDMI/eDP TX Аналоговое питание (1.8V) | HDMI_TX0_VDD_IO_1V8, HDMI/eDP_TX1_VDD_IO_1V8 | 1.62 | 1.8 | 1.98 | V |
| SARADC Аналоговое питание(1.8V) | SARADC_AVDD_1V8 | 1.62 | 1.8 | 1.98 | V |
| OTP Аналоговое питание(0.75V) | OTP_VDDOTP_0V75 | 0.675 | 0.75 | 0.825 | V |
| OSC Аналоговое питание(1.8V) | OSC_1V8 | 1.65 | 1.8 | 1.95 | V |
| Входная частота OSC |  | NA | 24 | NA | MHz |
| Максимальная частота CPU |  | NA | NA | 2.2-2.4 | GHz |
| Максимальная частота GPU |  | NA | NA | 1000 | MHz |
| Максимальная частота NPU |  | NA | NA | 1000 | MHz |
| Рабочая температура окружающей среды | TA | 0 | NA | 80 | ℃ |

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

VDDO и DVDD обозначают питание IO. Расположение отрицательных токов MIN/MAX сохранено. Для GPIO сначала приведён режим 3.3V, затем 1.8V.

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
| Конденсатор AC-связи(SATA) | CAC_COUPLING | 6 | NA | 12 | nF |
| Время нарастания выхода 20–80% | Tr | 25 | NA | NA | ps |
| Время спада выхода 20–80% | Tf | 25 | NA | NA | ps |
| Ограничение короткого замыкания передатчика | ITX_SHORT | NA | NA | 20 | mA |
| Дифференциальный перекос выхода | TSKEW_DIFF | -15 | NA | 15 | ps |
| Приёмник |  |  |  |  |  |
| Входной размах напряжения | VRXDPP_C | 250 | NA | 1200 | mVpp |
| Входной дифференциальный импеданс | RRXD_C | 80 | 100 | 120 | Ohm |
| Согласование одиночных входных сопротивлений | RRXD_C_MS | NA | NA | 5 | % |

### 3.7 SARADC

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Разрешение |  |  | NA | 12 | NA | Bit |
| Диапазон аналогового входа (источник: Anglog) | AIN |  | AVSS18 | NA | AVDD18 | V |
| Дифференциальная нелинейность | DNL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±1.0 | ±3.0 | LSB |
| Интегральная нелинейность | INL | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±2.0 | ±6.0 | LSB |
| Верхняя ошибка смещения | EOT | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±10 | ±20 | LSB |
| Нижняя ошибка смещения | EOB | PD = Low Fs = 1MS/s FCLK = 20MHz FSOC = 1MHz FAIN = 10kHz пилообразный сигнал | NA | ±10 | ±20 | LSB |

### 3.8 TSADC

| Параметры | Обозначение | Условия испытания | Минимум | Типовое | Максимум | Единица |
| --- | --- | --- | --- | --- | --- | --- |
| Точность от −40°C до 125°C | TJACC | Температура: -40 ~ 125℃ Питание: 1.62V ~ 1.98V | NA | ±3 | ±5 | ℃ |
| Диапазон измерения температуры | TRANGE |  | -40 | NA | 125 | ℃ |
| Разрешение | TLSB |  | NA | 1 | NA | ℃ |

## 4. Тепловой режим

Для надёжности температура перехода должна оставаться ниже 125°C. Значения получены моделированием; приоритет имеют физические испытания. Плата: JEDEC 2S2P, 114.3mm x 76.2mm x 1.6mm, среда 25°C.

| Параметр | Обозначение | Типовое | Единица |
| --- | --- | --- | --- |
| Тепловое сопротивление переход–среда | 𝜽 𝑱𝑨 | 15.6 | (℃/𝑾) |
| Тепловое сопротивление переход–плата | 𝜽 𝑱𝑩 | 4.6 | (℃/𝑾) |
| Тепловое сопротивление переход–корпус | 𝜽 𝑱𝑪 | 0.03 | (℃/𝑾) |

## Ограничения источника

Текст VOP сохраняет условия MIPI dual-channel/DSC, хотя интерфейс MIPI для этого варианта не указан; это противоречие, а не подтверждение доступного порта. Список функций указывает шарики 0.3mm, чертёж — номинал 0.310mm. Корпус назван FCCSP766L в функциях и ED-FCCSP 17x19 766L в заказе. Таблица задаёт максимум перехода 125°C, тепловой текст — ниже 125°C. Главы карты регистров нет.

## Официальные материалы

- [ArmSoM](https://docs.armsom.org/)
- [Rockchip](https://www.rock-chips.com/)

{% endraw %}
