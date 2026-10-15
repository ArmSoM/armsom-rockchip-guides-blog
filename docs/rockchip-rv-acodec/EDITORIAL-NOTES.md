# RV ACodec 校对记录 / Editorial notes / Редакционные замечания

来源：Rockchip Developer Guide Linux RV Series ACodec，中文和英文 V1.6.0。技术章节、参数、DTS 和命令全部保留；原始 PDF 未修改。

- 中文采用中文原图；英文和俄文采用英文原图。正文可复制编辑，不使用整页截图代替正文。
- 修复代码跨页续行、长命令断行、补丁路径断行与提取错字。保留原始 mixer 枚举输出，其紧邻字符串不是可直接执行的设置命令。
- 未确认匹配的 ArmSoM RV 系列板卡；本篇作为平台参考，不能将 DTS、GPIO、Codec 配置直接用于 RK3588/RK3576 板卡。
- 原文“1-channel ADC”与概述中 ADC 总数的口径需要结合具体 SoC/TRM 确认；不擅自改动。
- 原文增益档位中 vol2=20 dB、vol3=12 dB 按原文保留，不按数值大小重新排序。
- 原文测试结果属于 Rockchip 文档，不是 ArmSoM 实测。本次没有硬件测试。

## English

All technical chapters, parameters, DTS and commands are retained. Chinese figures use the Chinese PDF; English and Russian figures use the English PDF. Broken code and patch-path continuations were repaired. Adjacent mixer enum labels are preserved as source output, not executable commands.

No matching ArmSoM RV board was verified. Do not transplant this configuration to RK3588/RK3576. The scope of “1-channel ADC” versus the overview's ADC count requires the exact SoC/TRM. Source gain values vol2=20 dB and vol3=12 dB are retained, not reordered. Source measurements are not ArmSoM measurements; no hardware tests were run.

## Русский

Сохранены все технические главы, параметры, DTS и команды. Китайские рисунки взяты из китайского PDF, английские и русские — из английского. Исправлены переносы кода и путей патчей. Слитные метки enum сохранены как вывод оригинала, а не исполняемые команды.

Совместимая плата ArmSoM на RV не подтверждена. Настройки нельзя напрямую переносить на RK3588/RK3576. Формулировка «1-channel ADC» и общее число ADC требуют сверки с конкретным SoC/TRM. Значения vol2=20 dB и vol3=12 dB оставлены без перестановки. Измерения оригинала не являются измерениями ArmSoM; аппаратные испытания не проводились.
