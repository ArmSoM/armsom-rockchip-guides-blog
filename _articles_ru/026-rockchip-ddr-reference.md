---
title: "Rockchip DDR: полный справочный перечень и примечания"
description: "Полные редактируемые таблицы компонентов, статусы и технические примечания для выбора аппаратуры ArmSoM; необходима проверка на плате."
translation_key: "026-rockchip-ddr-reference"
slug: "026-rockchip-ddr-reference"
lang: "ru"
date: "2026-10-15"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: ["Sige7", "CM5"]
tags: ["Rockchip", "AVL", "ddr-reference", "hardware"]
keywords: "Rockchip DDR: полный справочный перечень и примечания, ArmSoM, BSP"
excerpt: "Полные редактируемые таблицы компонентов, статусы и технические примечания для выбора аппаратуры ArmSoM; необходима проверка на плате."
---

{% raw %}
# Rockchip DDR: полный справочный перечень и примечания

<style>.article-content{overflow-wrap:anywhere}.article-content img{aspect-ratio:auto;width:auto;max-width:100%;margin:20px 0}.article-content table{font-size:13px}.article-content th,.article-content td{white-space:nowrap}.article-content mark{background:#fff2a8;color:inherit}</style>

Это справочник выбора компонентов на уровне платформы для проектов ArmSoM, а не перечень взаимозаменяемых деталей, проверенных на всех платах. Для Sige7 (RK3588), CM5 (RK3576) и других проектов сверяйте столбец конкретной SoC, схему, фактическую BOM, корпус, питание и ревизию платы. Необходимы проверка целостности сигналов и производственная валидация. Источник не задаёт единой версии SDK/BSP или ядра: согласуйте BSP, загрузочную прошивку и драйверы, соблюдая примечания к изделию. Аппаратные испытания здесь не проводились; статусы и примеры оригинала не являются измерениями ArmSoM.

Источник: `Rockchip_DDR_Reference_Vendor_List_ver3.01.pdf`, V3.01.

Файлы в китайской и английской папках побайтово одинаковы и преимущественно на английском языке. Во всех трёх версиях используются одни исходные рисунки; отдельных китайских рисунков нет. Служебные заявления и история изменений исключены, технические примечания сохранены.

[ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM CM5](https://docs.armsom.org/armsom-cm5) · [Редакционные замечания](/docs/rockchip-avl-ddr-reference/EDITORIAL-NOTES.md)

## 1. Как читать список

Символы отражают область проверки источника, а не автоматическое одобрение для вашей платы. Пустые ячейки оставлены пустыми и не означают поддержку. Номера, суффиксы, количества и статусы платформ сохранены. EOL означает конец жизненного цикла; AUTO и IT оставлены как метки оригинала, а не новые сертификаты.

| Символ | Значение в этом документе |
| --- | --- |
| S/A | Образцы испытаны и применимы, но малый запас параметров или другие риски требуют производственной проверки. |
| N/A | Не применимо. |
| Empty | Не оценивалось. |

- Rockchip проверяет ограниченное число образцов поставщика. Перед серийным выпуском проведите проверку конечного изделия, включая применимые требования безопасности.

- Следуйте эталонной разводке области DRAM и правилам Rockchip, не изменяя эталонную модель.

- Номер DRAM обычно разделён дефисом на две части: первая описывает тип памяти, ёмкость, организацию и корпус, вторая — обычно скорость передачи. У ESMT, RAYSON, CXMT, BIWIN, Kingston, Foresee, Goldkey и ряда других поставщиков вторая часть содержит также другую важную информацию.

- Для отметок √, T/A и S/A источник допускает совпадение первой части номера, не учитывая суффикс, обозначающий только скорость. Уточните реальную скорость в datasheet DRAM и при необходимости настройте kernel menuconfig; суффиксы с иной информацией игнорировать нельзя.

- В оригинальном PDF обновления выделены жёлтым; в этой версии сохранена жёлтая подсветка заполненных ячеек, где её удалось извлечь.

- Согласно источнику, перечисленная DDR не требует изменений ПО, если примечание к конкретной позиции не требует иного. Всегда проверяйте примечания для точного номера и платформы.

- Испытания проводятся отдельно для каждой платформы. Результат одной платформы нельзя считать подтверждением для другой.

В справочном списке прямо указано, что у Rockchip нет опыта серийного производства с перечисленной DDR; результаты испытаний образцов не являются производственной квалификацией.

## 2. Примечания по применению

### [1]

Для RK3568/RK3566 обновите loader до rk3568_ddr_xxxMHz_v1.09.bin / rk3566_ddr_xxxMHz_v1.09.bin или новее.

### [2]

Для комбинированных изделий LPDDR4/LPDDR4X одобрен только режим LPDDR4; стабильность LPDDR4X не подтверждена. VDDQ должно быть 1.1V, а не 0.6V.

### [3]

Производительность LPDDR4/LPDDR4X на RV1126/RV1109 недостаточна; перед применением необходима оценка.

### [4]

Если допустимая частота DDR ниже максимальной частоты платформы, самостоятельно установите совместимую частоту. См. «修改DDR bin文件» в Rockchip_Developer_Guide_DDR_CN или «Modify the DDR bin file» в Rockchip_Developer_Guide_DDR_EN.

## Полные таблицы совместимости

Таблицы разделены по страницам источника для прослеживаемости, без сокращения столбцов. Для просмотра всех SoC используйте горизонтальную прокрутку. Повторные записи оригинала сохранены, включая противоречивые.

### Потребительские изделия — Страница оригинала 6

| Производитель | Номер изделия | Статус изделия | Ёмкость | Организация | Тип | Корпус | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GCAI | GDF08G16LP0-M12 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GDT42A32BF0-T3E |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| GCAI | GD81B32MJ0-41M2 | EOL | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  | S/A [3] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GD82B32MJ0-41M2 | EOL | 16G bit | 512M×32 | LPDDR4 | 200ball |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| GCAI | GD82D32MJ0-42C2 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  | N/A |  | N/A |  |  | N/A |  |  |  |  |  |  |
| GCAI | GD82D32MJ0-42M3 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GCAI | GDA2D32MJ0-42M6 |  | 24G bit | 768M×32 | LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| GCAI | GDB2D32MJ0-42M7 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A [1][2] |  | S/A [1][2] | S/A [1][2] | N/A |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| GCAI | GD84D32MJ0-42C2 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dli | DD4N08GBCDSO2-C2 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Dli | DN4H16GCCPDI4-D2 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  | S/A | <mark>N/A</mark> | <mark>N/A</mark> | S/A | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | DN4H16GCBPDI4-C7 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  | <mark>N/A</mark> | <mark>N/A</mark> | S/A [4] | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | DN4H32GCCPQI4-D2 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A | <mark>N/A</mark> | <mark>N/A</mark> | S/A | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| Dli | <mark>DN4H32GVBPQI4-C7</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4X</mark> | <mark>200ball</mark> |  |  | <mark>N/A</mark> | <mark>N/A</mark> |  | <mark>N/A</mark> | <mark>N/A</mark> | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  | <mark>N/A</mark> |  |  | <mark>N/A</mark> |  |  |  |  |  |  |
| YEESTOR | SGA128M16A8HC-G03 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD128M16R322J8LY |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ICMAX | IMD256M16R30HG8GNF-107 |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  | S/A |  |  | S/A |  | N/A | N/A |  | S/A |  |  |  |  |  |  |
| ICMAX | IMD256M16R324J8LY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  | S/A |  | S/A | S/A |  | S/A |  | S/A |  |  |  |  |
| ICMAX | IMD512M16R31AG8GPF |  | 8G bit | 512M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| ICMAX | IMD256M16R4ABD8LY |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  |  |
| ICMAX | IMD256M16R4ZAD8TB |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD512M16R4DBD8LY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMD512M16R4AZD8JY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |  |  |  |
| ICMAX | IMD512M16R4FCD8TB |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ICMAX | IMH256M32Z1D1DNP |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  | S/A [3] |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| ICMAX | IMH512M32H2D2ENA |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ICMAX | IMH512M32Z2D2ENP |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| TMTC | TN4G16D3CSEP-EK |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| TMTC | TN8G16D4DSA4-GZ |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| TMTC | TM8G32MD4LSA1-I4 |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| TMTC | TH16G32MD4LQM1-I4 |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |

### Потребительские изделия — Страница оригинала 7

| Производитель | Номер изделия | Статус изделия | Ёмкость | Организация | Тип | Корпус | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229/PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Goldkey | GH4061600HRL-1833 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |
| Goldkey | GE4062666HD |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Goldkey | GE8062666ND |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Goldkey | GE8062400HD-1833 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A |  |  |  |  |  |
| Goldkey | L4D32H71-06242 |  | 32G bit | 1024M×32 | LPDDR4 | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47DM1688SBA |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47EM0888SBA-150 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | N/A | N/A | S/A |
| Eorex | EM47EM1688SBA-150 |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eorex | EM47EM1688SBB-150A |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |
| Eorex | EM47FM0888SBA-150 |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| Eorex | EM47FM0888SBA-150A |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| Eorex | EM47EM3288MBA-125 |  | 8G bit | 256M×32 | DDR3 | 136ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| Eorex | EM49FM1688PBA-075 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| Eorex | EM45FM3288LBA-187F |  | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | N/A |
| axeme | H2A301G1656BC6C |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  | S/A | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| axeme | H2A401G1666BFBC |  | 1G bit | 64M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| axeme | H2A402G1666BFBC |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |
| axeme | H2A404G1666CFMC |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  | S/A |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |
| axeme | H2A404G0866CD8C |  | 4G bit | 512M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| Sinker | SNB2816S21PS13 |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sinker | SNB5616S21PS13 |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| ProMOS | V59C1G01168QBASXJ25 |  | 1G bit | 64M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| ProMOS | V73CAG01808RA JI9 |  | 1G bit | 128M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ProMOS | V59C1G02168QB |  | 2G bit | 128M×16 | DDR2 | 84ball |  |  |  |  |  |  |  |  |  | N/A | N/A | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A | N/A |
| QCHP | QN3B128M16H-13A |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN3R256M16M-16G |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| QCHP | QN4A256M16M-26G |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4A512M16M-26E |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| QCHP | <mark>QN4A1GM16S-32J</mark> |  | <mark>16G bit</mark> | <mark>1024M×16</mark> | <mark>DDR4</mark> | <mark>96ball</mark> |  |  |  |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPD512M32M-32H |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| QCHP | QNLP4D512M32S-32I |  | 16G bit | 512M×32 | LPDDR4 | 200ball |  |  | <mark>S/A</mark> | <mark>N/A</mark> |  | <mark>N/A</mark> | <mark>N/A</mark> |  |  |  | S/A |  |  |  |  | S/A |  |  |  |  |  |  |
| QCHP | QNLP4D512M32T-37I |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QNLP4D1GM32T-42I |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPXD1GM32SP-32H |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4XLPE32GM16H-42I |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4LPXD1536M32SP-32H |  | 48G bit | 1536M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| QCHP | QN4XLPE64GM16H-42J |  | 64G bit | 2048M×32 | LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Потребительские изделия — Страница оригинала 8

| Производитель | Номер изделия | Статус изделия | Ёмкость | Организация | Тип | Корпус | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| XINCUN | XCCB128M16FP-EKNAH |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| XINCUN | XCCC128M16FP-EKNAB |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| XINCUN | XCCC256M16FP-EKNAY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| XINCUN | XCCB256M16DP-EKNAH |  | 4G bit | 256M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| XINCUN | XCCC256M16EP-EKNAY |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| HIKSEMI | HSED4HB04G-JD3 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSED4HB08G-JD4 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XSA2G-HD8 |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  | S/A [4] | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XFA4G-CA9M |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | HSEL4XFA4G-HD9 |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  | S/A |  |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| HIKSEMI | <mark>HSEL4XFA4G-CA8M</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>S/A</mark> |  | <mark>S/A</mark> | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DS4D82FBFCENY |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| DBTC | DS4D162FBFCENY |  | 16G bit | 1024M×16 | DDR4 | 96ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4008E2FSCE2GHY |  | 8G bit | 256M×32 | LPDDR4 | 200ball |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X16E3FDEE2GHY |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X16E3FSEE2GMR |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | S/A | N/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DBTC | DL4X32E3CQEE2GCX |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X162BD-C2B |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X164CD-C7A |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X322BQ-C7B |  | 32G bit | 1024M×32 | LPDDR4X | 200ball |  |  |  | N/A | N/A | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KEYMOS | KL4X321CD-D2B |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Netsol | S5RG2G20CMS-MGCJ |  | 32G bit | 512M×64 | LPDDR4 | 366ball |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  | N/A |  |  |  |  |  |  |
| MT.MOSET | ED3E25608CE-P9 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  | S/A | N/A | S/A |
| sMART | S4B2G0846C-HYH9 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| sMART | S4B2G0846D-HYK0 |  | 2G bit | 256M×8 | DDR3 | 78ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  | S/A |
| WINS | VP5TQ2G1635FFP-F9 |  | 2G bit | 128M×16 | DDR3 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | N/A | N/A |  |
| ISDT | IL2BR20E8H |  | 16Gb/2Channel | 256M×32×2Ch | LPDDR2 | 220ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX3H2816AB-M9LC |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX3H4816AB-M9LC |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| YXSC | YX4H8A16AB-NCMC |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| YXSC | YX4LA816BC-MGPE |  | 16G bit | 512M×32 | LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Потребительские изделия — Страница оригинала 9

| Производитель | Номер изделия | Статус изделия | Ёмкость | Организация | Тип | Корпус | RK3506/RK2118 | RK3576 | RK3528 | RK3562 | RK3588/RK3588S | RK3568 | RK3566 | RV1126/RV1109 | RV1108/RK3308/RK3308B-S | RK3228H | RK3399 | RK3328 | RK3326S/PX30S | RK3326/PX30 | RK1808/RK1806 | RK3399PRO CPU&#95;RAM | RK3399PRO NPU&#95;RAM | RK3288 | RK3368/RK3228A/RK3228B/RK3229 /PX5 | RK2928/RK3028A/RK3128/PX3-SE | RK2926/RK3026/RK3036/RK3036G /RK3126 | RK3066/RK3066A/PX2/RK3168/RK3188/PX3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KOWIN | KAD3N2M33BNT |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |
| KOWIN | KAD4N3M46GUT |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| KOWIN | KAL3S3C55FN2 |  | 8G bit | 256M×32 | LPDDR3 | 178ball |  |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |
| KOWIN | KALXX4S43AY2 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  | S/A | S/A | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| KOWIN | KALXX5S43AY2 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCT536HLC0-OB |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  | S/A |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCT536HLC0-OD |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTA36HLC0-OB |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTA36HLC0-OD |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DW MICRO | DWCTB36HLC0-OD |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GSTO | GSD02GHFB3-E3N3C |  | 2G bit | 128M×16 | DDR3L | 96ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  | N/A | N/A |  |  |  |  |  |  |  |  |
| GSTO | GSD04GHFB4-E3N3C |  | 4G bit | 256M×16 | DDR3L | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |
| GSTO | GSD04GHGB5-S3L3C |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| GSTO | GSD08GHGB6-S3L3C |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| Artmem | ATL4X12324M102 |  | 12G bit | 384M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  |  |  |  |  |  |  |  | N/A |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D4G16M00-DL1 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  |  |  |  |  |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D4G16M00-DL2 |  | 4G bit | 256M×16 | DDR4 | 96ball |  |  |  | N/A |  | N/A | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIIE | BI4D8G1666-DL1 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| BIIE | BI4D8G1666-DL2 |  | 8G bit | 512M×16 | DDR4 | 96ball |  |  | N/A | N/A |  | N/A | N/A | N/A |  | N/A |  | N/A | N/A | N/A | N/A |  | N/A |  |  |  |  |  |
| BIIE | BI16G32MD4PDC1-J1 |  | 16G bit | 512M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| BIIE | BI32G32MD4PQC1-J1 |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X1GM32BQ200A-32T |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  | S/A |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X1GM32BQ200A-42T |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC4X2GM32CQ200A-42T |  | 64G bit | 2048M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Rocfour | MC5D1GM32DQ315B-64T |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Yangtze Mason | MSP4C0D5I-032G |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Barycn | SPMNBBQMCM-MJXU |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| JSC | JSL5HCG329TKA-03 |  | 32G bit | 1024M×32 | LPDDR5 | 315ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| JSC | JSL5HDG32ATKA-03 |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>TWSC</mark> | TEL4XCC32ACY-32G |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  |  |  |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>TWSC</mark> | <mark>TEL4XMA32ACX-32G</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| XUNSHAN | XSRGBQCA1MG-L |  | 32G bit | 1024M×32 | LPDDR4/LPDDR4X | 200ball |  | S/A |  |  | S/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| TSEM | T5LC32BQBM-CP |  | 64G bit | 2048M×32 | LPDDR5 | 315ball |  | N/A |  |  | N/A |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| <mark>PLUSE</mark> | <mark>PSX4S0D4S-32G</mark> |  | <mark>32G bit</mark> | <mark>1024M×32</mark> | <mark>LPDDR4/LPDDR4X</mark> | <mark>200ball</mark> |  | <mark>S/A</mark> |  |  | <mark>S/A</mark> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Промышленные изделия и широкий температурный диапазон — Страница оригинала 10

В оригинале есть заголовок раздела, но нет строк компонентов.

<table><thead><tr><th>Производитель</th><th>Номер изделия</th><th>Статус изделия</th><th>Ёмкость</th><th>Организация</th><th>Тип</th><th>Корпус</th><th>RK3506J</th><th>RK3576J</th><th>RK3528</th><th>RK3562J</th><th>RK3588J</th><th>RK3568J</th><th>RK3566</th><th>RV1126K</th><th>RV1108K1 RK3308J</th><th>RK3228H</th><th>RK3399</th><th>RK3328</th><th>RK3326S/PX30S</th><th>RK3358J</th><th>RK1808K</th><th>RK3399PRO CPU&#95;RAM</th><th>RK3399PRO NPU&#95;RAM</th><th>RK3288</th></tr></thead><tbody></tbody></table>

## Официальные материалы

[Rockchip Redmine](https://redmine.rock-chips.com/documents/49)

Для некоторых материалов Redmine нужен авторизованный аккаунт. Эта версия основана на предоставленном документе, а не на утверждении, что он самый новый.

{% endraw %}
