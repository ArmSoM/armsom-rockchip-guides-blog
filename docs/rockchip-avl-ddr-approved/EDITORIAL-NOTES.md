# 校对记录 / Editorial notes / Редакционные замечания

## 中文

中英文目录提供的同名 PDF 经 SHA-256 比较完全一致，故无语言版本差异可合并；原稿以英文为主。中文为完整本地化，英文按原文整理，俄文按相同技术内容本地化。三语器件表保持相同的料号、参数和状态。原始 PDF 未修改。

已恢复分页表格、合并厂商单元格、换行表头和 RK3399PRO 的 CPU_RAM/NPU_RAM 分列。空白状态不补写为支持；重复料号和冲突状态不自动去重。所有技术矩阵均为可复制编辑的 Markdown 表格；仅移除封面、法律声明、联系信息和修订记录等指定非技术内容。技术应用注释和脚注保留。

图像使用英文目录原文件，与中文目录文件完全相同，不存在独立中文原图。DDR Approved 的 10 张器件照片包含原图中的周码及 PASS/FAIL 标记，未把整页截图代替正文。其余文档没有独立技术配图，表格均恢复为文字。DDR 表中可提取的非空黄色更新单元格保留黄色标记。

适用说明属于平台选型参考。SDK/BSP、内核、板卡硬件版本及实际 BOM 必须由项目确认；本次未进行硬件验证，没有新增 ArmSoM 实测结论。UFS 表仅有 RK3576，不代表 CM5 已提供可用 UFS 接口。Redmine 资源可能需要授权账号。

## English

The corresponding Chinese-folder and English-folder PDFs have identical SHA-256 hashes. The original is primarily English; no differing editions were merged. Complete technical tables and notes are localized into Chinese and Russian, with the same part numbers, parameters and validation states. The source PDFs remain unchanged.

Page tables, merged manufacturer cells, wrapped headers and the RK3399PRO CPU_RAM/NPU_RAM distinction were restored. Blank states are not inferred as support. Duplicated parts and conflicting states are retained. Cover/legal/contact material and revision history are omitted as requested, but technical notes remain. The tables are editable Markdown, not page images.

The ten DDR Approved marking photographs retain their original week-code and PASS/FAIL callouts. The other documents have no independent technical figures; their tables are text. All languages share the supplied English originals because the files in both source folders are identical. Extractable yellow update marks in populated DDR cells are preserved.

This is platform-level selection guidance, not hardware validation on ArmSoM. Confirm the exact board, BOM, BSP, kernel and boot firmware. The UFS list has only RK3576 and does not establish a usable UFS interface on CM5. Redmine resources may require authorization.

## Русский

Соответствующие PDF в китайской и английской папках имеют одинаковые SHA-256. Оригинал преимущественно английский; различные редакции не смешивались. Все технические таблицы и примечания локализованы на китайский и русский с сохранением номеров изделий, параметров и статусов. Исходные PDF не изменены.

Восстановлены таблицы по страницам, объединённые ячейки производителей, переносы заголовков и отдельные столбцы CPU_RAM/NPU_RAM для RK3399PRO. Пустые статусы не трактуются как поддержка. Повторные изделия и противоречивые статусы сохранены. По запросу исключены служебные заявления, контакты и история изменений; технические примечания оставлены. Таблицы представлены редактируемым Markdown, а не изображениями страниц.

Десять фотографий маркировки DDR Approved содержат исходные указатели кода недели и PASS/FAIL. В остальных документах нет отдельных технических иллюстраций; таблицы преобразованы в текст. Все языки используют одни английские оригиналы, поскольку файлы в обеих папках одинаковы. Доступная для извлечения жёлтая подсветка заполненных ячеек DDR сохранена.

Это справочник выбора на уровне платформы, а не результат испытаний ArmSoM. Требуется проверка платы, BOM, BSP, ядра и загрузочной прошивки. Список UFS содержит только RK3576 и не подтверждает наличие доступного UFS на CM5. Материалы Redmine могут требовать авторизации.
## 待核对 / Unresolved / Требует проверки

- p4 [13]: `201` vs “2022, week 2”. 周码解释待确认 / Confirm week-code interpretation / Требуется уточнить код недели.
- p4 [14]: `4266Mbps` and maximum `3733` without a unit. 未自行补单位 / No inferred unit / Единица не добавлена.
- p5 [20]: threshold `2328`, description “2024, week 11”, and “2023, week 28”; photograph shows `2411`. 原值均保留 / All original values retained / Все исходные значения сохранены.
- p5 [32]: `2514` described as “2025, week 4” and “week 14”; photograph shows `2504`. `2502` for the 32G part is retained separately. 周码临界批次是否包含边界需厂商确认 / Confirm inclusive/exclusive lot boundaries with the vendor / Границы партий уточнять у производителя.
- p20: manufacturer-only validation section contains headers and a validation-scope notice, but no component rows. 保留空节和技术说明 / Empty section and technical scope retained / Пустой раздел и условия проверки сохранены.

## Source manifest

- File: `Rockchip_DDR_Approved_Vendor_List_ver3.01.pdf`
- SHA-256: `e4070b90758976d83ec1739cd20e4d14e149a7b943e1b344c332fe5f8afdc1f6`
- PDF pages: 20
- Retained matrix rows: 795
- Independent technical figures: 10
- Matrix source pages: 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20

## 料号空格修复 / Part-number spacing / Пробелы в номерах

- p7: `MT53E128M32D2DS- 046 WT:A (D9WXR)` → `MT53E128M32D2DS-046 WT:A (D9WXR)`
- p7: `MT53E384M32D2FW -046 WT:E (D8BBR)` → `MT53E384M32D2FW-046 WT:E (D8BBR)`
