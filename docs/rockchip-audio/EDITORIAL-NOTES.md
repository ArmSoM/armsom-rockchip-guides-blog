# Audio 校对记录 / Editorial notes / Редакционные замечания / Redaktionelle Hinweise

来源：Rockchip Developer Guide Audio，中文和英文 V2.4.0。保留全部技术章节与源示例；没有在 ArmSoM 硬件上执行测试。原始 PDF 未修改。

## 修正与保留

- 修复 PDF 提取断行、跨页代码、表格续行和明显拼写错误。`491520000 MHz` 按同段配置与上下文修正为 `491520000 Hz`，未改动数值。
- 技术正文为可编辑 Markdown。独立提取原图和矢量时序图，未以整页图片代替正文。中文使用中文 PDF 图片，英文与俄文使用英文 PDF 图片。
- 原文图号有重复或引用不一致，保留原编号，以章节和图像内容定位。
- VAD 2.3.7.4 原例将 16 kHz、16 bit、8 通道、100 ms 与 204800 bytes 对应。按紧凑 PCM 计算为 25600 bytes。保留源示例常量，不擅自推测 DMA 布局或修正设备配置；使用前需核对 BSP 实现。
- XRUN 的中断行为取决于驱动与硬件。不能将源文表述理解为每次 XRUN 必然触发独立 ALSA 中断。参见 [Linux ALSA proc documentation](https://www.kernel.org/doc/html/latest/sound/designs/procfile.html)。
- 支持矩阵描述 SoC 能力，不代表每块 ArmSoM 板卡都引出相应接口。请核对原理图、内核、设备树和实际 Codec。

## English

Full technical chapters and source examples are retained as editable Markdown. Chinese figures come from the Chinese PDF; English and Russian figures come from the English PDF. Extraction line breaks, continued tables and obvious spelling errors were repaired. The unit `491520000 MHz` was corrected to `491520000 Hz` based on its configuration context; the number is unchanged. Source figure numbering inconsistencies remain traceable.

Unresolved: VAD §2.3.7.4 associates 100 ms at 16 kHz, 16 bit, 8 channels with 204800 bytes; packed PCM arithmetic gives 25600 bytes. The source constant is retained pending BSP verification. XRUN handling is driver-dependent, not a guarantee of a separate interrupt for every underrun/overrun. SoC capabilities do not guarantee board-level availability. No ArmSoM hardware tests were performed.

## Русский

Технические главы и примеры сохранены в редактируемом Markdown. Китайские рисунки взяты из китайского PDF, английские и русские — из английского. Исправлены переносы, продолжения таблиц и очевидные опечатки. Единица `491520000 MHz` исправлена на `491520000 Hz` по контексту настройки, без изменения числа. Несогласованная нумерация рисунков оригинала сохранена.

Требует проверки: в §2.3.7.4 VAD для 100 мс, 16 кГц, 16 бит, 8 каналов указано 204800 байт; расчёт упакованного PCM даёт 25600 байт. Константа оригинала сохранена до проверки BSP. Обработка XRUN зависит от драйвера и не гарантирует отдельное прерывание для каждого события. Возможности SoC не гарантируют доступность интерфейса на плате. Испытания на оборудовании ArmSoM не проводились.

## Deutsch — Prüfung vom 2026-10-16

Die deutsche Fassung übersetzt den vollständigen vorhandenen englischen Artikel, einschließlich der vier Hauptkapitel, aller Unterabschnitte, Tabellen, Abbildungsbeschreibungen und der FAQ bis Abschnitt 4.11. Die 118 Codeblöcke einschließlich Kommentaren und Terminalausgaben bleiben unverändert. Alle 346 Tabellenzeilen sowie die 28 englischen Originalabbildungen bleiben erhalten. Die ursprünglichen PDFs wurden bei dieser Übersetzung nicht geändert und nicht erneut extrahiert. API-Namen, Befehle, Konfigurationswerte und Dateipfade bleiben erhalten; englische Bezeichnungen innerhalb der Originalbilder und Codeblöcke sind beabsichtigt.

Offene Quellenfragen: In Tabelle 1-5 steht bei 8K nach 22.05K der positive Wert `132.4`; ein möglicherweise fehlendes Minuszeichen wurde nicht ergänzt. In Abschnitt 2.6.2.4 sind die Beschreibungen zu `rockchip,frame-master` und `rockchip,bitclock-master` in der Vorlage offenbar vertauscht. Die Zuordnung wurde für die Rückverfolgbarkeit beibehalten und muss anhand des passenden BSP geprüft werden. Auch die oben erläuterte VAD-Puffergröße, die XRUN-Aussage und uneinheitliche Abbildungsnummern bleiben als Quellenfragen dokumentiert. Es wurden keine ArmSoM-Hardwaretests durchgeführt.
