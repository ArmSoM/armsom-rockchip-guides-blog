# Rockchip AMP 三语文档整理与勘误记录

本地审核稿，尚未发布。技术基准为 `docs/cn/Common/AMP/Rockchip_Developer_Guide_AMP_CN.pdf`，V1.2.0（2025-04-30），138 页。重新读取的文件 SHA-256 为 `61820e27beb905a25a4cb6eee1db7e472d99bd59136ff7d4f29f9c7c7dc3634a`。英文对照本地同版本官方英文指南（142 页）；俄文译文保留 API、路径、标识符和原始日志，代码中的原注释不改写为可执行逻辑。

## 文件与编辑方式

- `README.zh-CN.md`：中文完整可编辑正文。
- `README.md`：英文完整可编辑正文。
- `README.ru.md`：俄文完整可编辑正文。
- `preview.html`：语言切换、选择复制、代码复制、直接编辑及保存编辑版 HTML。
- `assets/`：从源 PDF 截取的原始配图、流程图和软件界面，不包含整页正文图片。
- `extraction-manifest.json`：源文件指纹和正文块数量。

网页编辑会改变当前页面；点击“保存编辑版 HTML”才会保存下载的副本。网页编辑不会自动回写仓库 Markdown。后续正式修改建议直接编辑对应 Markdown，并重新生成预览。

## 已修正的提取和排版问题

1. 将 Unicode 康熙部首形式（如“⽂”“⼼”“⾏”）恢复为普通汉字，保持技术符号。
2. 以页面坐标恢复内容顺序，不使用 PDF 内部文本对象的存储顺序作为阅读顺序。
3. 重建真正的表格；排除代码背景框和行内代码底色形成的伪表格。
4. 前言支持表的跨行 SoC 名称展开为重复值，并将分组表头展开为芯片、处理器、Linux、RTOS、Bare-metal 五列。
5. 代码按等宽字形坐标恢复缩进，合并连续的跨页代码；恢复工具链长路径、Python CFLAGS 字符串和 mtdparts 长行。
6. 恢复 ITS 示例中的 ASCII 引号，将解释性 `#` 注释改为 DTS 可用的 `//`，保留 `#address-cells`、`#size-cells` 和 C 预处理指令。
7. 为明确遗漏的 `rtt_config = "..."` 属性补充分号。带 `...` 的示例仍然是节选，需要结合实际 SDK 补全；没有把节选伪装成可直接构建的项目。
8. PDF 的重复目录改为自动生成的可点击目录；前言、正文 11 章、代码、测试数据、附录与图片保留。

## 可以根据上下文确认的原文笔误

| 位置 | 原文问题 | 本版处理 |
| --- | --- | --- |
| 3.1.4 | 描述写作 `start@size(part_name)`，与 mtdparts 实例相反 | 改为 `size@start(part_name)`；512 字节扇区单位保留 |
| 4.2.4.3 | I2C1 时钟配置段写为“PWM1 的中断资源” | 改为“I2C1 的时钟资源” |
| 4.4.1.2 | HAL 编译段套用了 RT-Thread / SCons 文字 | 改为 RK HAL 编译文件说明，保留原示例构建命令 |
| 4.4.2.3 | HAL MCU 内存段写为 RT-Thread MCU | 改为 HAL MCU |
| 4.3.2.4 / 4.4.2.4 | PDF 行内代码底色导致地址公式被拆开、提取时容易错位 | 完整重建 `0x08300000 = 0x08200000 + 0x00100000`，分别说明物理地址和 MCU 可见相对地址；原映射参数保留 |
| 6.5.1.2 | src/dst 的本地、远端 endpoint 角色文字写反 | 修正为 src 为本地、dst 为远端；代码中 API 调用不变 |
| 6.5.1.1 | 官方英文对 invalidate 的操作端表述与中文含义不一致 | 明确由读取缓存数据的 Linux 端处理自身旧缓存；结合实际 SDK 和 buffer ownership 实施 |
| 通用 | Hypervisior、Reomte、VritIo、Kernal、AMPAK_SDK、部分路径的 Rockchip 大写及软换行 | 恢复对应标准术语和中文原文中的 SDK 路径拼写 |

## 原文存在矛盾，需要结合目标 SDK 确认

- RK3588 前言与 1.2.1、RTOS/HAL 支持表对 32/64 位支持的描述不完全一致；保留两处原值，没有推断哪一项代表目标 ArmSoM BSP。
- 6.2 对 Linux shared memory 仅支持 uncache 的陈述，是文档基线说明；6.5.1.1 提供 cacheable buffer pool 修改方案，两者应结合阅读。
- MCU 运行区示例包含 `0x08200000`，通信映射示例包含 `0x07b00000`；它们属于不同配置示例，不能混用。VRING 4 MiB、buffer pool 1 MiB 与 ITS 总共享区 5 MiB也要按同一个方案同步。
- NVIC 示例使用 GPIO0，但 INTMUX 代码出现 `GPIO1_IRQn`。保留源代码值并提示核对 BSP/TRM，不凭通用名称替换 SoC 中断定义。
- 7.2.2.1 / 7.3.2.1 章节标题套用了 GIC 名称，正文实际对应 NVIC / IPIC。代码及分节编号保留，读者应按该控制器上下文理解。
- 表格中没有结果的项目保留为空。CoreMark、Linpack、IRQ latency、RPMsg bandwidth、200 ms 启动等数据均来自原指南条件，未产生任何 ArmSoM 硬件实测。

## ArmSoM 适用说明的来源

- [Sige7 RK3588](https://docs.armsom.org/armsom-sige7)
- [Sige5 RK3576](https://docs.armsom.org/armsom-sige5)
- [CM5 RK3576](https://docs.armsom.org/armsom-cm5)
- [AIM7](https://docs.armsom.org/armsom-aim7)
- [AIM5](https://docs.armsom.org/armsom-aim5)

板卡采用受支持 SoC，不代表已交付镜像自动包含 AMP。本文是适配开发手册，具体 core、IRQ、clock、pinmux、DDR 及固件由配套 BSP 决定。

## Deutsch — Prüfung vom 2026-10-16

Die deutsche Fassung übersetzt den vollständigen vorhandenen englischen Artikel mit Vorwort, allen 11 Kapiteln und dem Dokumentenverzeichnis am Ende. Alle 174 Codeblöcke einschließlich Kommentaren, Build-Befehlen und Protokollausgaben bleiben unverändert. Die 195 Tabellenzeilen und alle englischen Originalabbildungen bleiben erhalten; Tabellenbeschreibungen und Alternativtexte sind deutsch. Die ursprünglichen PDFs wurden nicht geändert und bei dieser Übersetzung nicht erneut extrahiert.

Die widersprüchlichen Angaben zur RK3588-32/64-Bit-Unterstützung, unterschiedliche MCU-Adressbeispiele und die Kombination GPIO0 / GPIO1_IRQn bleiben erhalten. Die Überschriften 7.2.2.1 und 7.3.2.1 nennen weiterhin GIC, obwohl der jeweilige Kontext NVIC beziehungsweise IPIC behandelt. Der Verweis in 9.1 nennt in der Vorlage „Kapitel 8: Build-Konfiguration“, während die Build-Konfiguration tatsächlich in Kapitel 3 steht. Die Pfadangabe `u-boot/arch/arm/mach- rockchip/rk3562/rk3562.c` in 6.3.3.3 enthält ein auffälliges Leerzeichen aus der Vorlage; vor Verwendung mit dem SDK abgleichen. Diese Quellenprobleme wurden nicht durch geratene Hardwarewerte oder Codeänderungen ersetzt.

Benchmark-, Bandbreiten-, Latenz- und Bootzeitangaben sind Werte aus der Rockchip-Quelle. Es wurden keine ArmSoM-Hardwaretests durchgeführt. Die Beschreibung künftiger Virtualisierungsunterstützung in 1.1.2 ist eine Aussage der Quelldokumentation und keine aktuelle Zusicherung für ein ArmSoM-BSP.
