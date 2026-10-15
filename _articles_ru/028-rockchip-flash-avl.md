---
title: "Rockchip Flash AVL: SPI NOR, SPI NAND и SLC"
description: "Полные редактируемые таблицы компонентов, статусы и технические примечания для выбора аппаратуры ArmSoM; необходима проверка на плате."
translation_key: "028-rockchip-flash-avl"
slug: "028-rockchip-flash-avl"
lang: "ru"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "flash", "hardware"]
keywords: "Rockchip Flash AVL: SPI NOR, SPI NAND и SLC, ArmSoM, BSP"
excerpt: "Полные редактируемые таблицы компонентов, статусы и технические примечания для выбора аппаратуры ArmSoM; необходима проверка на плате."
---

{% raw %}
# Rockchip Flash AVL: SPI NOR, SPI NAND и SLC

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Это справочник выбора компонентов на уровне платформы для проектов ArmSoM, а не перечень взаимозаменяемых деталей, проверенных на всех платах. Для Sige7 (RK3588), CM5 (RK3576) и других проектов сверяйте столбец конкретной SoC, схему, фактическую BOM, корпус, питание и ревизию платы. Необходимы проверка целостности сигналов и производственная валидация. Источник не задаёт единой версии SDK/BSP или ядра: согласуйте BSP, загрузочную прошивку и драйверы, соблюдая примечания к изделию. Аппаратные испытания здесь не проводились; статусы и примеры оригинала не являются измерениями ArmSoM.

Источник: `Rockchip_Flash_Approved_Vendor_List_Ver2.03.pdf`, V2.03.

Файлы в китайской и английской папках побайтово одинаковы и преимущественно на английском языке. Во всех трёх версиях используются одни исходные рисунки; отдельных китайских рисунков нет. Служебные заявления и история изменений исключены, технические примечания сохранены.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Редакционные замечания](/docs/rockchip-avl-flash/EDITORIAL-NOTES.md)

## 1. Как читать список

Символы отражают область проверки источника, а не автоматическое одобрение для вашей платы. Пустые ячейки оставлены пустыми и не означают поддержку. Номера, суффиксы, количества и статусы платформ сохранены. EOL означает конец жизненного цикла; AUTO и IT оставлены как метки оригинала, а не новые сертификаты.

| Символ | Значение в этом документе |
| --- | --- |
| √ | Полностью испытано, применимо и находится в серийном производстве. |
| T/A | Полностью испытано, применимо и готово к серийному производству. |
| S/A | Образцы прошли испытания надёжности; перед серийным выпуском требуется проверка совместимости с платформой. |
| D/A | Применимо по datasheet; требуются испытания образцов. |
| N/A | Не применимо. |

## 2. Проверка драйверов и запрос валидации

### 1. Как проверить поддержку SPI NAND в подсистеме MTD U-Boot?

Выполните следующую команду в каталоге исходников U-Boot.

```text
grep -rn "SPINAND_INFO(" drivers/mtd/nand/spi
```

### 2. Как проверить поддержку SPI NOR? В английском вопросе оригинала указан SPL, в китайском — U-Boot MTD; проверьте фактический путь загрузки.

Проверьте следующий исходный файл.

```text
drivers/mtd/spi/spi-nor-ids.c
```

### 3. Как проверить поддержку SPI NAND в rkflash?

Проверьте массив spi_nand_tbl в следующем файле.

```text
drivers/rkflash/sfc_nand.c
```

### 4. Как проверить поддержку SPI NOR в rkflash?

Проверьте массив spi_flash_tbl в следующем файле.

```text
drivers/rkflash/sfc_nor.c
```

### 5. Как заказчику запросить проверку компонента?

Создайте запрос в Rockchip Redmine.

## 3. Примечания к устройствам

**Note*1**: Эти устройства с двумя плоскостями несовместимы в некоторых сценариях.

**Note*2**: Поддерживается только page program и файловая система, зарегистрированная на разделе блочного устройства.

**Note*3**: Защищённая flash; поддерживается использование в качестве раздела защиты данных.

**Note*4**: Эта SPI NAND не имеет встроенного ECC.

**Note*5**: Патч производителя: https://redmine.rock-chips.com/attachments/2309011

## Полные таблицы совместимости

Таблицы разделены по страницам источника для прослеживаемости, без сокращения столбцов. Для просмотра всех SoC используйте горизонтальную прокрутку. Повторные записи оригинала сохранены, включая противоречивые.

### Страница оригинала 8

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GigaDevice | GD55B01GE | 1Gb | 128MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD55B01GE | 1Gb | 128MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q512MC | 512Mb | 64MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| GigaDevice | GD25Q512MD | 512Mb | 64MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25B512ME | 512Mb | 64MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q256C | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| GigaDevice | GD25Q256D | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q256E | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25F256F | 256Mb | 32MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q128C | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | T/A | T/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| GigaDevice | GD25Q127C | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q128E | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q64C | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q64E | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q64E | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q32C | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD25Q16C | 16Mb | 2MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD25Q16E | 16Mb | 2MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25Q40C | 4Mb | 512KB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD55LB02GE | 2Gb | 256MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD55LB02GF | 2Gb | 256MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD55LB01GE | 1Gb | 128MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD55LT01GE | 1Gb | 128MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LB512ME | 512Mb | 64MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LT512MEY2G | 512Mb | 64MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LB256E | 256Mb | 32MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LQ256D | 256Mb | 32MB | 1.65V~2.0V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD25LQ255E | 256Mb | 32MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LB256FYIGR | 256Mb | 32MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LQ128ESIGR | 128Mb | 16MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LQ128EWIGR | 128Mb | 16MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LQ64C | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD25LQ64E | 64Mb | 8MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GigaDevice | GD25LQ32E | 32Mb | 4MB | 1.65V~2.0V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| GigaDevice | GD25LX256E | 256Mb | 32MB | 1.65V~2.0V | N/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR | OPI |

### Страница оригинала 9

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GigaDevice | GD9FU4G8F4B | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9FU2G8F2AMGI | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9FU1G8F2AMG | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9F4GxF2A | 4Gb | 512MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9FU4G8F3AMGI | 4Gb | 512MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9FS1G8F2AMG | 1Gb | 128MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD9FU1G8F2DMGI | 1Gb | 128MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GigaDevice | GD5F4GQ6UEYIG | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F4GQ4UAYIG | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F4GM8UEYIG | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F4GM8REY2G | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F2GQ4UBxIG | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| GigaDevice | GD5F2GQ4UCxIG | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| GigaDevice | GD5F2GQ5UEYIG | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F2GM7UEYIG | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F2GM7UEYIG | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GQ4UAYIG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GQ4UBYIG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GQ4UCYIG | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| GigaDevice | GD5F1GQ5UEYIG | 1Gb | 128MB | 2.3V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GQ4UEYIH | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GM7UEYIG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GM7REYIG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GM9UEYIG | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD9FU4G8F4DMG | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F2GQ5REYIG | 2Gb | 256MB | 1.7V~2.0V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F2GM7REYIG | 2Gb | 256MB | 1.7V~2.0V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GigaDevice | GD5F1GQ5REYIG | 1Gb | 128MB | 1.7V~2.0V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |

### Страница оригинала 10

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Winbond | W25Q512JV | 512Mb | 64MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q256FV | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| Winbond | W25Q256JVFIQ | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q128JV | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q128FV | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| Winbond | W25Q64FV | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q64JV | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q32FV | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q32JV | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q16DV | 16Mb | 2MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q16JV | 16Mb | 2MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q80DV | 8Mb | 1MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25X40CL | 4Mb | 512KB | 2.3V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q41CL | 4Mb | 512KB | 2.3V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| Winbond | W25Q256JWEQ | 256Mb | 32MB | 1.70V~1.95V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q128JWSQ | 128Mb | 16MB | 1.70V~1.95V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q64FW | 64Mb | 8MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| Winbond | W25Q64JWSSIQ | 64Mb | 8MB | 1.7V~1.95V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| Winbond | W25Q32JW | 32Mb | 4MB | 1.7V~1.95V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |

### Страница оригинала 11

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Winbond | W29N04GVSIAA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Winbond | W29N04GVSIAF | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Winbond | W29N2KVSIAF | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Winbond | W29N02KVSIAF | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Winbond | W29N01HVxINF | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | EOL |
| Winbond | W29N01HVSINA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | EOL |
| Winbond | W29N01HVSINF | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | EOL |
| Winbond | W25N08LWZEIG | 8Gb | 1MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N04KVZEIR | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N02KVZEIR | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01GV | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01GVZEIG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01KVZEIR | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25Q01JVIM | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N512GVEIG | 512Mb | 64MB | 2.7v-3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N04LWZEIG | 4Gb | 512MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N02KWZEIR | 2Gb | 256MB | 1.70V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01GWZEIG | 1Gb | 128MB | 1.70V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01JWZEIG | 1Gb | 128MB | 1.70V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Winbond | W25N01KWZPIG | 1Gb | 128MB | 1.7V-1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |

### Страница оригинала 12

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MXIC | MX30LF4G28AD-TI | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30LF4G28AD-TI | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30LF2G28AD-TI | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30LF1G28AD-TI | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30UF4G18AC-TI | 4Gb | 512MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30UF2G18AC-TI | 2Gb | 256MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX30UF1G18AC-TI | 1Gb | 128MB | 1.7V~1.95V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MXIC | MX66L1G45GMI-08G | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| MXIC | KH25L12833FM2I | 128Mb | 16MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L51245GZ2I-08G | 512Mb | 64MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25LM51245GXDR00 | 512Mb | 64MB | 2.7V~3.6V | N/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR | OPI |
| MXIC | MX25L25635F | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L25639F | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L25645GM2I-08G | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L25645GMI-08G | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L12835F | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L12839F | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L12850F | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L12833FM2I-10G | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L12833FMI-10G | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX256433F | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L6433F | 64Mb | 8MB | 2.65V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L6433FM2I-08G | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25L3233FM2I-08G | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U51245GZ4I00 | 512Mb | 64MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U25645GZ4I-00 | 256Mb | 32MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U25671G | 256Mb | 32MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U12832F | 128Mb | 16MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U12872F | 128Mb | 16MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U6432F | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25U3232F | 32Mb | 4MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| MXIC | MX25LM25645GXDR00 | 256Mb | 32MB | 2.7V~3.6V | N/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR | OPI |

### Страница оригинала 13

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MXIC | MX35LF4GE4AD-Z4I | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35LF2GE4AB | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| MXIC | MX35LF2GE4AB-MI | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| MXIC | MX35LF2GE4AD-Z4I | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35LF1GE4AB-Z4I | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35LF1GE4AB | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35UF4GE4AD-Z4I | 4Gb | 512MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35UF2GE4AC-Z4I | 2Gb | 256MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35UF2GE4AD-Z4I | 2Gb | 256MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MXIC | MX35UF1GE4AC-Z4I | 1Gb | 128MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |

### Страница оригинала 14

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Toshiba | TC58CVG2S0HRAIJ | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Toshiba | TC58CVG1S3HQAIE | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Toshiba | TC58CVG1S3HRAIJ | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Toshiba | TC58CVG0S3HQAIE | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Toshiba | TC58CVG0S3HRAIJ | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| Toshiba | TC58NVG2SOHTAIO | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Toshiba | TC58NVG1S3HTA00 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Toshiba | TC58BVG1S3HTA00 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Toshiba | TC58NVG0S3HTA00 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Toshiba | TC58NVG0S3HBAI4 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA63 |
| Toshiba | TC58NVG0S3HBAI6 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA67 |
| Toshiba | TC58BVG0S3HTA00 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA67 |
|  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| MICRON | MT29F4G08ABAEA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MICRON | MT29F4G08ABAEAWP | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MICRON | MX29F2G08ABAEA | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MICRON | MT29F1G08ABAEA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MICRON | MT29F1G01ZAC | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| AXEME | H7A12G21B1CN | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| AXEME | H7A11G21B1CH | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| AXEME | H7A6EM26B7CT | 256Mb | 64MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| AXEME | H7A5DM26BACT | 128Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| SAMSUNG | K9F4G08U0F | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| SAMSUNG | K9F2G08U0F | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| SAMSUNG | K9F1G08U0F | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |

На этой странице оригинала есть строка со статусом без номера изделия. Она сохранена на исходном месте; соответствующий компонент не установлен.

### Страница оригинала 15

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| XTX | XT26G08DWSIGA | 8Gb | 1GB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | N/A | N/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | PN27G04ABGITG | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | T/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | PN27G04BBGITG | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | PN27G02ABGITG | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | PN27G02BBGITG | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | T/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | PN27G01BBGITG | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | √ | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | PN27G01BBGITG | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
|  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| XTX | XT27G04CTSIGA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| XTX | XT27G04CTSIGA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC | BGA24 |
| XTX | XT27G04ATSIGA | 4Gb | 512MB | 2.7V-3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| XTX | XT27G02ATSIGA | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| XTX | XT27G02ETSIGA | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| XTX | XT27G01ATSIGA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| XTX | XT26G04AWSEGA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | S/A | N/A | S/A | T/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| XTX | XT26G04CWSIGA | 4Gb | 512MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G04DWSIGA | 4Gb | 512MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G04DWSIGA-B | 4Gb | 512MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G02AWSEGA | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| XTX | XT26G02BWSIGA | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| XTX | XT26G02CWSIG | 2Gb | 256MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G02DWSIGA | 2Gb | 256MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G12DWSIGA | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G01AWSEGA | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| XTX | XT26G01BWSEGA | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| XTX | XT26G01CWSIGA | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G11CWSIG | 1Gb | 128MB | 2.3V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G01DWSIGA | 1Gb | 128MB | 2.7V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G11DWSIGA | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26G11CWSIGA-B | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q04DWSIGA | 4Gb | 512MB | 1.7V~1.95V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q04DWSIGT-B | 4Gb | 512MB | 1.7V-1.95V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q14DWSIGA | 4Gb | 512MB | 1.7V-1.95V | N/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q02DWSIGA | 2Gb | 256MB | 1.7V~1.95V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q12DWSIGA | 2Gb | 256MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| XTX | XT26Q01DWSIGA | 1Gb | 128MB | 1.7V~1.95V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |

На этой странице оригинала есть строка со статусом без номера изделия. Она сохранена на исходном месте; соответствующий компонент не установлен.

### Страница оригинала 16

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| XTX | XT25F256BSFIGU | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F128BSSIGU | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F128A | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F128F | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | T/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F64BSSIGU-5 | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F64F | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | T/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25F32BSOIGU-S | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |
| XTX | XT25F32F | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |
| XTX | XT25F16BSOIGU | 16Mb | 2MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |
| XTX | XT25Q256FWSIGT | 256Mb | 32MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25Q128DSSIGU | 128Mb | 16MB | 1.7V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25Q128FSSIGU | 128Mb | 16MB | 1.7V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25Q64DSSIGU | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| XTX | XT25Q64FSSIGU | 64Mb | 8MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |

### Страница оригинала 17

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HYF | HYF4GQ4UAACBE | 4Gb | 512MB | 2.9V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF2GQ4UDACAE | 2Gb | 256MB | 2.9V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF2GQ4UAACAE | 2Gb | 256MB | 2.9V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF2GQ4UHCCAE | 2Gb | 256MB | 2.9V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF1GQ4UDACAE | 1Gb | 128MB | 2.9V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF1GQ4UPACAE | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF2GQ4UTACAE | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF4GQ4IAACBE | 4Gb | 512MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF2GQ4IAACAE | 2Gb | 256MB | 1.70V~1.98V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HYF | HYF1GQ4IDACAE | 1Gb | 128MB | 1.70V~1.98V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UINIC | SCN01SA1T1AI7A | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| UINIC | SCN00SA1T1A16A | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| UINIC | SCFECS1G20AG21I | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UINIC | SCN00SA3W1AI8A | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |

### Страница оригинала 18

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ESMT | F59L4G81XB | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L4G81KA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L2G81XA | 2Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L2G81A | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L2G81KA | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L1G81MA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F59L1G81MB | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ESMT | F50L4G41XB | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ESMT | F50L2G41LB | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |
| ESMT | F50L2G41KA | 2Gb | 256MB | 2.3V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ESMT | F50L1G41LB | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ESMT | F50L1G41XA | 1Gb | 128MB | 2.3V~3.6V | N/A | T/A | T/A | T/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | T/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ESMT | F50L1G41LC | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ESMT | EN25QH256A | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QX256A | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QH128A | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QX128A | 128Mb | 16MB | 3.0V~3.6V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QH64A | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QX64A | 64Mb | 8MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25QH32B | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |
| ESMT | EN25S64A | 64Mb | 8MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| ESMT | EN25S32A | 32Mb | 4MB | 1.65V~1.95V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |

### Страница оригинала 19

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORESEE | FS33ND04GS108TFI0 | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FSNS8B004G | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FS33ND02GH208TFC0 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FS33ND02GS208TFI0 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FSNS8A001G-TWT | 2GB | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FSNS8A002G-TWT | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FS33ND01GS108TF10 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FS33ND01GH308TFC0 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FSNS8A001G-TWT | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| FORESEE | FS35ND04G-S2Y2 | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQB004G | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | FS35ND02G-S3Y2 | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQA002G-WWT | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQB002G | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | FS35ND01G-S1Y2 | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQA001G-WWT | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQB001G | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35SQA512M-WWT | 512Mb | 64MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35UQA002G-WWT | 2Gb | 256MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35UQA001G-WWT | 1Gb | 128MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| FORESEE | F35UQA512M | 512Mb | 64MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| PUYA | PY25Q512HB | 512Mb | 64MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q256HB | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q128HA | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q64HA | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q256LC | 256Mb | 32MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q128LA | 128Mb | 16MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25F128LA | 128Mb | 16MB | 1.65V-2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| PUYA | PY25Q64LB | 64Mb | 8MB | 1.65V-2.0V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |

### Страница оригинала 20

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dosilicon | FMND4G08U3C-IA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | S/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| Dosilicon | DSND4G08U3C-IA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| Dosilicon | FMND4G08U3C-IA | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| Dosilicon | FMND2G08U3D-IA | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| Dosilicon | FMND1G08U3D-IA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| Dosilicon | DS25Q4DN | 1Gbits | 128MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS25Q4CB | 512Mb | 64MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | FM25Q128AI3 | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS25Q4AA-13IA1 | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | FM25Q64A | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS25Q64A | 64Mb | 8MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | FM25M4AA-1AIB1R | 128Mb | 16MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS25M4AB-1AIB4 | 128Mb | 16MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | FM25M64C-1AIB1R | 64Mb | 8MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS25M64E | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Dosilicon | DS35Q8GM-IG | 8Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q4GB-IB | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q4GE-IB | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q2GBS | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q1GA-IB | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q1GB-IB | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q1GD-IB | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q12B-IB | 512Mb | 64MB | 2.3V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35Q12C-IB | 512Mb | 64MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M4GB-IB | 4Gb | 512MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M4GB-A2B | 4Gb | 512MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M2GA-A2B | 2Gb | 256MB | 1.7V-1.95V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M1GA-IBR | 1Gb | 128MB | 1.65V~1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M1GB-IB | 1Gb | 128MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M12B-IB | 512Mb | 64MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Dosilicon | DS35M12C-IB | 512Mb | 64MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |

### Страница оригинала 21

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| XMC | XM25QH256B | 256Mb | 32MB | 2.3V~3.6V | S/A | S/A | S/A | S/A | N/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH256CHIQ | 256Mb | 32MB | 2.3v-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QH256D | 256Mb | 32MB | 2.3V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QH128A | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH128B | 128Mb | 16MB | 2.3V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH128CHIQ | 128Mb | 16MB | 2.3v-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH128DHIG | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QH64A | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH64B | 64Mb | 8MB | 2.3V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH64CHIQ | 64Mb | 8MB | 2.3v-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH64DHIG | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QH32C | 32Mb | 4MB | 2.3V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25QH32DHIG | 32Mb | 4MB | 2.7V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| XMC | XM25QU256C | 256Mb | 32MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QU128C | 128Mb | 16MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| XMC | XM25QU64C | 64Mb | 8MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| XMC | XM25LU64CHIG | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| GSTO | GSS02GPAK0 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GSTO | GSS01GPAK0 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| GSTO | GSS02GSAK1 | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GSTO | GSS02GSAX1 | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GSTO | GSS01GSAK1 | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GSTO | GSS01GSAX1 | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| GSTO | GSS01GSBX1 | 1Gbits | 128MB | 1.7V-1.95V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |

### Страница оригинала 22

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FUDAN | FM25G02D | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| FUDAN | FM25S01 | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| FUDAN | FM25S01A | 1Gb | 128MB | 2.3V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| FUDAN | FM25S01BI3-DND-A-G3 | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| FUDAN | FM25LS01 | 1Gb | 128MB | 1.7V~1.95 | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | EOL |
| FUDAN | FM25Q256I3 | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| FUDAN | FM25Q128A-SOB-T-G | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| FUDAN | FM25Q128AI3 | 128Mb | 16MB | 2.3V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | EOL |
| FUDAN | FM25Q64-SOB-T-G | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| FUDAN | FM25Q64AI3 | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| ISSI | IS37SML01G1 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | N/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| ISSI | IS34ML08G088 | 8Gb | 1GB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| ISSI | IS34ML01G081-TLI | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| ISSI | IS25LP512M | 512Mb | 64MB | 2.30V~3.60V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| ISSI | IS25LP032D | 32Mb | 4MB | 2.3V~3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |
| ISSI | IS25WP512M | 512Mb | 64MB | 1.65V~1.95V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |

На этой странице оригинала есть строка со статусом без номера изделия. Она сохранена на исходном месте; соответствующий компонент не установлен.

### Страница оригинала 23

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ICMAX | IMS2G083ZZF1-WP | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| ICMAX | IMS1G083ZZF1-WP | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| AXIA | AX20NV2G811TA110 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| AXIA | AX20NV1G811TA110 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| NORMEM | NM25Q128EVB | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |  |
| BIWIN | BWJX08K-2Gb | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| BIWIN | BW9F1G08U0F | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Zentel | ANV2GA30ATS-BI | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| Zentel | ANV1GA30ATS-BI | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| YXSC | TX25G01-DND-A-G | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| YXSC | YX21F1G08U3D | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| ETRON | EM73E044SNA-G | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | N/A | N/A | N/A | S/A | N/A | S/A | T/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| ETRON | EM73E044VCE-OH | 4Gb | 512MB | 3.0V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| ETRON | EM73D044VCE-FH | 2Gb | 256MB | 3.0V~3.6V | N/A | N/A | N/A | N/A | T/A | N/A | N/A | N/A | S/A | N/A | S/A | T/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| ETRON | EM73D044VCS-H | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| ETRON | EM73C044VCC-H | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | EOL |
| ETRON | EM73C044VCF-OH | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| ETRON | EM73C044VCG-H | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |  |
| MIRA | PSU2GA30BT-G11A | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MIRA | PSU1GA30BT-G11A | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |  |
| MIRA | PSU1GS20BN | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |  |
| Giantec | GT25Q40D | 32Mb | 4MB | 1.65V3.6V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR |  |

### Страница оригинала 24

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UNIM | UM19A1HISW | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | TX25G01 | 1Gb | 128MB | 2.7v-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A0HCSW | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A0HISW | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A9HISW | 512Mb | 64MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A1LISW | 2Gb | 256MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A0LCSW | 1Gb | 128MB | 1.7V~1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A0LISW | 1Gb | 128MB | 1.7V-1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| UNIM | UM19A9LISW | 512Mb | 64MB | 1.7V-1.95V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| XINCUN | XCSP4AXPK-IT | 4Gb | 512MB | 3.0V~3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| XINCUN | XCSP4AAPK-IT | 4Gb | 512MB | 3.0V-3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| XINCUN | XCSP2AAPK-IT | 2Gb | 256MB | 3.0V~3.6V | N/A | N/A | N/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | N/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| XINCUN | XCSP1AAPK | 1Gb | 128MB | 3.0V~3.6V | N/A | N/A | N/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | N/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| JSC | JS28U1GQSCAHG-83 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND |
| Zetta | ZDND1G08U3D | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | T/A | N/A | N/A | N/A | N/A | N/A | SLC |
| CFX | GM25Q128APIC | 128Mb | 16MB | 3.0V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| SiliconGo | SGM7000I-S24W1GH | 1Gb | 128MB | 2.7v-3.6V | N/A | N/A | N/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | N/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ATO | AFND2G08U3 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ATO | AFND1G08U3 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| ATO | ATO25D1GA-1 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | N/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| ATO | AFND1G08U3-CKA | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | S/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML08G101TFI20 | 8Gb | 1024MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML04G200TFI00 | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML04G300TFI00 | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML08G301TFI00 | 8Gb | 512MB | 2.7v-3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML02G2 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML02G300TFI000 | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| SkyHigh | S34ML01G2 | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |

### Страница оригинала 25

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zbit | ZB35Q04BYIG | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Zbit | ZB35Q01BYIG | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| Zbit | ZB25Q256ASJG | 256Mb | 32MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | ZB25VQ128A | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | ZB25VQ128DSJG | 128Mb | 16MB | 2.3V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | ZB25VQ64A | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | ZB25VQ64DSJG | 64Mb | 8MB | 2.3V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | HS25Q64DSIG | 64Mb | 8MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Zbit | ZB25LQ128 | 128Mb | 16MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25Q256FSEIG | 256Mb | 32MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25FQ256ESSIG | 256Mb | 32MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25FQ256ELSIG | 256Mb | 32MB | 2.7V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25Q128ASSIG | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25Q128ESSIG | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25Q64ESSIG | 64Mb | 8MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25FQ64ESSIG | 64Mb | 8MB | 2.7V-3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25FQ128ELSIG | 128Mb | 16MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| BOYA | BY25FQ32ELSIG | 32Mb | 4MB | 1.65V~2.0V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A |  |
| BOYA | BY25FQ64ELSIG | 64Mb | 8MB | 1.65V~2.0V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| HIKSEMI | HSENSD04ATIG | 4Gb | 512MB | 2.7V-3.6V | N/A | N/A | N/A | N/A | T/A | S/A | N/A | N/A | S/A | T/A | S/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | SLC |
| HIKSEMI | HSESDFDSW4G | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HIKSEMI | HSESYHDSW2G | 2Gb | 256MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |
| HUAHONG | BH25Q128AS | 128Mb | 16MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| HUAHONG | BH25Q64BS | 64Mb | 8MB | 2.7V~3.6V | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR |
| Kingston | SPI004-SDEG | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND |

### Страница оригинала 26

| Производитель | Номер изделия | Ёмкость в битах | Ёмкость в байтах | Напряжение | RK2108 | RK2116 | RK2118 | RV1106/RV1103 | RV1108/RV1107 | RV1109/RV1126 | RV1126B/BP | RV1103B/RV1106B | RK3036 | RK3308 | RKPX30/RK3326 | RK1808 | RK1820 | RK3566/RK3568 | RK3588/RK3588s | RK3528 | RK3562 | RK3576 | RK3506 | Примечания | Дополнительные примечания |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MICRON | MT29F2G01ABA | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | N/A | N/A | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| XTX | XT26G02ELGIGA | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| ESMT | F50L2G41XA | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| Dosilicon | DS35Q4GM | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| Dosilicon | DS35Q2GA-IB | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| Dosilicon | DS35Q2GB-IB | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| Dosilicon | DS35M2GA-IB | 2Gb | 256MB | 1.7V~2.0V | N/A | S/A | S/A | S/A | T/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;1 |
| FUDAN | FM25S02A | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | S/A&#42;1 | S/A&#42;1 | S/A&#42;1 | S/A | T/A&#42;1 | S/A | T/A&#42;1 | S/A | S/A&#42;1 | S/A&#42;1 | S/A | S/A | S/A | S/A | SPI NAND | EOL |
| PUYA | P25Q32SH | 32Mb | 4MB | 2.3V-3.6V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | Note&#42;2 |
| PUYA | P25Q64SU-WXH-IR | 64Mb | 8MB | 1.65V-3.60V | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NOR | Note&#42;2 |
| Winbond | W25Q12PWSSIM | 128Mb | 16MB | 1.65V~1.95V | S/A | S/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NOR | Note&#42;2 |
| Winbond | W77Q128JWSIQ | 128MBits | 16MB | 1.7V-1.95V | N/A | N/A | N/A | S/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | S/A | N/A | Secure NOR | Note&#42;3 |
| MXIC | MX35LF4G24AD | 4Gb | 512MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;4 |
| MXIC | MX35LF2G14AC-Z4I | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;4 |
| MXIC | MX35LF2G24AD | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;4 |
| MXIC | MX30UFXG2xAD | 2Gb | 256MB | 1.65V~1.95V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;4 |
| MXIC | MX35LF1G24AD | 1Gb | 128MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;4 |
| Zentel | ANV1GCP0CLG | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| HYF | HYF1GQ4UTXCAE | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| YXSC | YX25G1E | 1Gb | 128MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| GSTO | GSS01GSAM0 | 1Gb | 128MB | 2.7V-3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| SkyHigh | S35ML02G3 | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| Zentel | ANV2GCP0CLG | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| YXSC | YX25G2E | 2Gb | 256MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| ETRON | EM73D044VCE-H | 2Gb | 256MB | 2.7V~3.6V | N/A | N/A | N/A | N/A | T/A | N/A | N/A | N/A | S/A | N/A | S/A | T/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | SPI NAND | Note&#42;5 |
| SkyHigh | S35ML04G3 | 4Gb | 512MB | 2.7V~3.6V | N/A | S/A | S/A | S/A | S/A | T/A | T/A | T/A | S/A | T/A | S/A | T/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |
| Zentel | ANV4GCP0CLG-BI | 4Gb | 512MB | 2.7V-3.6V | N/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | S/A | T/A | S/A | S/A | S/A | S/A | S/A | SPI NAND | Note&#42;5 |

## Официальные материалы

[Rockchip Redmine](https://redmine.rock-chips.com/documents/46)

Для некоторых материалов Redmine нужен авторизованный аккаунт. Эта версия основана на предоставленном документе, а не на утверждении, что он самый новый.

{% endraw %}
