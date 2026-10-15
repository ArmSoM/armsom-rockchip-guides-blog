# Rockchip Linux Wi-Fi и Bluetooth: полный список микросхем и модулей

Это справочник выбора компонентов на уровне платформы для проектов ArmSoM, а не перечень взаимозаменяемых деталей, проверенных на всех платах. Для Sige7 (RK3588), CM5 (RK3576) и других проектов сверяйте столбец конкретной SoC, схему, фактическую BOM, корпус, питание и ревизию платы. Необходимы проверка целостности сигналов и производственная валидация. Источник не задаёт единой версии SDK/BSP или ядра: согласуйте BSP, загрузочную прошивку и драйверы, соблюдая примечания к изделию. Аппаратные испытания здесь не проводились; статусы и примеры оригинала не являются измерениями ArmSoM.

Официальное описание Sige7 указывает AP6275P, но это не подтверждает проверку всех перечисленных модулей на Sige7. Согласуйте SDIO/PCIe/USB, BT UART/PCM, прошивку, драйвер, антенны и конкретный BSP. SS, ST и DS отражают разные уровни подтверждения.

Источник: `Rockchip_Support_List_Linux_WiFi_BT_Ver2.0_20250619.pdf`, V2.0.

Файлы в китайской и английской папках побайтово одинаковы и преимущественно на английском языке. Во всех трёх версиях используются одни исходные рисунки; отдельных китайских рисунков нет. Служебные заявления и история изменений исключены, технические примечания сохранены.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Редакционные замечания](/docs/rockchip-avl-wifi-bt/EDITORIAL-NOTES.md)

## 1. Как читать список

Символы отражают область проверки источника, а не автоматическое одобрение для вашей платы. Пустые ячейки оставлены пустыми и не означают поддержку. Номера, суффиксы, количества и статусы платформ сохранены. EOL означает конец жизненного цикла; AUTO и IT оставлены как метки оригинала, а не новые сертификаты.

- Для других моделей AP/Realtek см. раздел переноса драйверов в документации Wi-Fi/BT.

- Для микросхем или модулей других производителей обратитесь к ним за помощью с переносом драйвера; порядок переноса также описан в документации Wi-Fi/BT.

- Руководство разработчика и список поддержки: https://redmine.rock-chips.com/documents/52 .

- BT означает Bluetooth; ac — Wi-Fi 5, ax — Wi-Fi 6.

- State обозначает статус проверки или способ поддержки на RK: SS — поддержка SDK; ST — образец испытан; DS — поддержка по datasheet. DS не означает подробную проверку на платформе.

- Antenna относится к антеннам Wi-Fi. Некоторые модули имеют отдельную антенну BT: Wi-Fi может быть 2T2R, а Bluetooth отдельно 1T1R. Учитывайте это при выборе и проектировании.

## Полные таблицы совместимости

Таблицы разделены по страницам источника для прослеживаемости, без сокращения столбцов. Для просмотра всех SoC используйте горизонтальную прокрутку. Повторные записи оригинала сохранены, включая противоречивые.

### Страница оригинала 1

| Поставщик | Микросхема / модуль Wi-Fi | Интерфейс Wi-Fi | Поколение Wi-Fi | Стандарт IEEE 802.11 | Максимальная скорость | Малопотребляющий MCU | Диапазон 2.4GHz | Диапазон 5.0GHz | Диапазон 6.0GHz | Антенна | Стандарт BT | Интерфейс BT | Статус | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rockchip | RK960 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK962 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | 5.3 | UART/PCM | SS |  |
| Rockchip | RK915 | SDIO | Wi-Fi 4 | 802.11b/g/n | 65Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Synaptics (микросхема) | SYN43756E | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (микросхема) | SYN43711 | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (микросхема) | SYN43752 | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Synaptics (микросхема) | SYN43598 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Synaptics (микросхема) | SYN43456 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Synaptics (микросхема) | SYN43436 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Synaptics (микросхема) | BCM430132 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Realtek (микросхема) | RTL8852C | PCIe/USB | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (микросхема) | RTL8852B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/USB/PC M | DS |  |
| Realtek (микросхема) | RTL8832BU | USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (микросхема) | RTL8851B | SDIO/PCIe/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/USB/PC M | DS |  |
| Realtek (микросхема) | RTL8822C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5 | UART/USB/PC M | SS |  |
| Realtek (микросхема) | RTL8822E | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Realtek (микросхема) | RTL8821C | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/USB/PC M | DS |  |
| Realtek (микросхема) | RTL8812CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS | EFEM |
| Realtek (микросхема) | RTL8812EU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | × | × | DS |  |
| Realtek (микросхема) | RTL8811CU | USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (микросхема) | RTL8192E | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS | EFEM |

### Страница оригинала 2

| Поставщик | Микросхема / модуль Wi-Fi | Интерфейс Wi-Fi | Поколение Wi-Fi | Стандарт IEEE 802.11 | Максимальная скорость | Малопотребляющий MCU | Диапазон 2.4GHz | Диапазон 5.0GHz | Диапазон 6.0GHz | Антенна | Стандарт BT | Интерфейс BT | Статус | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Realtek (микросхема) | RTL8192F | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 300Mbps |  | √ | × | × | 2T2R | × | × | DS |  |
| Realtek (микросхема) | RTL8733B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Realtek (микросхема) | RTL8723D | SDIO/USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 4.2 | UART/USB/PC M | SS |  |
| Realtek (микросхема) | RTL8731B | SDIO/USB | Wi-Fi 4 | 802.11 a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Realtek (микросхема) | RTL8189FTV | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (микросхема) | RTL8189ES/EM | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| Realtek (микросхема) | RTL8188FTV | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | SS |  |
| Realtek (микросхема) | RTL8761BTV | × | × | × | × |  | × | × | × | × | 5.0 | UART | ST |  |
| Realtek (микросхема) | RTL8188EUS-VH | USB | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS | EFEM |
| Infineon (микросхема) | CYW55572 | SDIO/PCIe | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (микросхема) | CYW55513 | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (микросхема) | CYW54591 | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.4 | UART/PCM | DS |  |
| Infineon (микросхема) | CYW43455 | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Infineon (микросхема) | CYW4373 | SDIO/PCIe/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Infineon (микросхема) | CYW43438 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| Infineon (микросхема) | CYW43012 | SDIO/SPI | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Infineon (микросхема) | CYW43439 | SDIO | Wi-Fi 4 | 802.11 b/g/n | 65Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AIC (микросхема) | AIC8800D80 | SDIO/PCIe/USB | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| AIC (микросхема) | AIC8800D | SDIO/USB | Wi-Fi 6 | 802.11b/g/n/ax | 286.80Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| SeekWave (микросхема) | EA6621Q | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | ST |  |
| Unisoc (микросхема) | UWE5621DS | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| iComm (микросхема) | SSV6155P | USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (микросхема) | SV6158 | SDIO | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| iComm (микросхема) | SV6256 | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| AltoBeam (микросхема) | ATBM603x | SDIO/USB | Wi-Fi 4 | 802.11b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (микросхема) | ATBM6441 | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | ST |  |
| AltoBeam (микросхема) | ATBM6461 | SDIO | Wi-Fi 6 | 803.11b/g/n/ax | 286.8Mbps | √ | √ | × | × | 1T1R | 5.0 | × | ST |  |
| Hisilicon (микросхема) | Hi3861L | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps | √ | √ | × | × | 1T1R | × | × | SS |  |
| Hisilicon (микросхема) | Hi3853 | SDIO | Wi-Fi 6 | 802.11b/g/n/ax | 150Mbps | √ | √ | × | × | 1T1R | 5.3 | × | ST |  |
| Ampak (модуль) | AP6275 (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | SS |  |
| Ampak (модуль) | AP6611 （SYN43711） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | ST |  |
| Ampak (модуль) | AP6281 (SYN4381) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| Ampak (модуль) | AP6276 (SYN43756E） | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| Ampak (модуль) | AP6398S (SYN43598) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | SS |  |
| Ampak (модуль) | AP6256 (SYN43456) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | SS |  |
| Ampak (модуль) | AP6203BM (BCM430132) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | ST |  |
| Ampak (модуль) | AP6212 （BCM43438） | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.4 | UART/PCM | SS |  |

### Страница оригинала 3

| Поставщик | Микросхема / модуль Wi-Fi | Интерфейс Wi-Fi | Поколение Wi-Fi | Стандарт IEEE 802.11 | Максимальная скорость | Малопотребляющий MCU | Диапазон 2.4GHz | Диапазон 5.0GHz | Диапазон 6.0GHz | Антенна | Стандарт BT | Интерфейс BT | Статус | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ITON (модуль) | BW3752-50BX (SYN43752) | SDIO/PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (модуль) | BW756E-50B2 (SYN43756E) | SDIO/PCIe | Wi-Fi 6E | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | ST |  |
| ITON (модуль) | BW3598-50BX (SYN43598) | SDIO/PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 867Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | ST |  |
| ITON (модуль) | BW3456-44B1 (SYN43456) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (модуль) | BW0132-44B1 (BCM430132) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 72Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| ITON (модуль) | BW436S-44B1 (SYN43436) | SDIO | Wi-Fi 4 | 802.11b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | ST |  |
| AzureWave (модуль) | AW-XM606 (CYW55513) | SDIO/SPI | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-XM650 (CYW55512) | SDIO/SPI | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-XM643 (CYW55573) | SDIO/PCIE | Wi-Fi 6E | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | √ | 2T2R | 5.3 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-XM612 (CYW55572) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.3 | UART/PCM | ST |  |
| AzureWave (модуль) | AW-XM632 (CYW55571) | SDIO/PCIE | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | √ | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-CM467 (CYW4373) | SDIO/USB | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM/U SB | DS |  |
| AzureWave (модуль) | AW-CM572 (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-CM256SM (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-AM497 (CYW43012) | SDIO | Wi-Fi 4 | 802.11 b/g/n/ac friendly | 78Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-NM372SM (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | DS |  |
| AzureWave (модуль) | AW-NM512 (CYW43439) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (модуль) | FCS866R (RTL8852BS-CG) | SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (модуль) | FCE863R (RTL8852BE-VR-CG) | PCIe | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 1200Mbps |  | √ | √ | × | 2T2R | 5.2 | UART/PCM | DS |  |
| Quectel (модуль) | FCU760K/FCS960K (AIC8800D80) | USB/SDIO | Wi-Fi 6 | 802.11a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.4 | UART/PCM | DS |  |
| Quectel (модуль) | FCS961K (AIC8800DC) | SDIO | Wi-Fi 6 | 802.11 b/ g/ n/ ax | 286Mbps |  | √ | × | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (модуль) | FC80A (CYW54591) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.1 | UART/PCM | DS |  |
| Quectel (модуль) | FCS850R (RTL8822CS-VS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (модуль) | FCS851U (UWE5621) | SDIO | Wi-Fi 5 | 802.11a/b/g/n/ac | 866Mbps |  | √ | √ | × | 2T2R | 5.0 | UART/PCM | DS |  |
| Quectel (модуль) | FCS950R (RTL8821CS-CG) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 4.2 | UART/PCM | DS |  |
| Quectel (модуль) | FC905A (CYW43455) | SDIO | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS |  |
| Quectel (модуль) | FCS940R (RTL8723DS-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | 5.0 | UART/PCM | DS |  |

### Страница оригинала 4

| Поставщик | Микросхема / модуль Wi-Fi | Интерфейс Wi-Fi | Поколение Wi-Fi | Стандарт IEEE 802.11 | Максимальная скорость | Малопотребляющий MCU | Диапазон 2.4GHz | Диапазон 5.0GHz | Диапазон 6.0GHz | Антенна | Стандарт BT | Интерфейс BT | Статус | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quectel (модуль) | FC908A (CYW43438) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 72Mbps |  | √ | × | × | 1T1R | 5.1 | UART/PCM | ST |  |
| Quectel (модуль) | FCS945R (RTL8733BS-CG) | SDIO | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | DS |  |
| Quectel (модуль) | FCU741R (RTL8731BU-CG) | USB | Wi-Fi 4 | 802.11a/b/g/n | 150Mbps |  | √ | √ | × | 1T1R | × | × | DS |  |
| Quectel (модуль) | FC30R (RTL8189EM-VI-CG) | SDIO | Wi-Fi 4 | 802.11 b/g/n | 150Mbps |  | √ | × | × | 1T1R | × | × | DS |  |
| CVTE (модуль) | SKI.WB800DS2.1 (AIC8800D) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 286Mbps |  | √ | √ | × | 1T1R | 5.2 | UART/PCM | ST |  |
| CVTE (модуль) | SKI.WB800D80S.1 (AIC8800D80) | SDIO/USB | Wi-Fi 6 | 802.11 a/b/g/n/ac/ax | 600Mbps |  | √ | √ | × | 1T1R | 5.3 | UART/PCM | ST |  |
| Murata (модуль) | SP-ZZ1ZC-C (CYW88459) | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.1 | UART/PCM | ST | Автомобильное применение |
| nFore (модуль) | NF3205PQ | PCIe | Wi-Fi 5 | 802.11 a/b/g/n/ac | 433Mbps |  | √ | √ | × | 1T1R | 5.0 | UART/PCM | DS | Автомобильное применение |

## Официальные материалы

[Rockchip Redmine](https://redmine.rock-chips.com/documents/52)

Для некоторых материалов Redmine нужен авторизованный аккаунт. Эта версия основана на предоставленном документе, а не на утверждении, что он самый новый.
