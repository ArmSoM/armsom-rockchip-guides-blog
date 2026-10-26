# 103 Flash Open Source Solution 校对记录

## 来源与取舍

- 中文及英文：Rockchip_Developer_Guide_Linux_Flash_Open_Source_Solution_CN/EN.pdf，RK-KF-YF-314，V3.18.0；中文 57 页、英文 62 页，技术正文均自第 7 页开始。中文正文为四语共同基准；英文用于对照及补全明确残句。
- 去掉封面日期、密级、免责声明、版权商标声明、联系方式、读者对象及修订表。保留代码中的 Signed-off-by、技术版本、API、配置与参数。
- 覆盖第 1–10 章及最后参考文献，236 个正文提取单元、91 个原始标题加 7 个原被识别为正文的深层标题、13 个表格、122 个原始代码片段。跨页连续代码已合并，因此成稿代码块数少于 122。
- 中文使用 cn-p048-figure-01.png、cn-p053-figure-01.png；EN/RU/DE 使用英文 PDF 提取的 en-p052-figure-01.png、en-p057-figure-01.png。图片为原稿独立图而非整页图片；两幅英文图已目视检查标签边界。CN/EN NAND 结构图内容实际相同，不伪称重新绘制。

## 修复

- 删除错误识别成表格的单行路径/代码框后重新提取，防止正文缺失。
- 恢复中文第 13 页 spi-nor/winbond.c、nand/spi/winbond.c 的断行顺序；保留 flash id、丝印和 quad/octal 传输说明。
- 恢复 u-boot/drivers/mtd_blk.c 被打断的路径及标点。
- 拼接 CMDLINE、mtdparts、MTDPARTS_DEFAULT、mkfs 命令、squashfs 路径、diff 文件头、size_t 参数及被折断的注释；参数值未改变。合并仅因跨页分割的连续代码。
- 使用可编辑 Markdown 表格和代码；语言版本共用同一套代码示例，保留源代码内部注释原文。

## 已确认的原稿差异与待核对问题

1. 用户已批准中文为基准并明确标注冲突：§5.3.1 off|partition 采用中文“字节、页对齐、不含 OOB”，count 采用“十六进制页数”；英文分别写 page 和 byte。四语开头均并列注明。实际执行前必须核对部署 SDK 的 U-Boot 实现，未运行擦写命令。
2. §7.4 ENV SPI NAND IDB 中文为 block 1–3，英文为 1–7。四语保留中文并注明英文；需要根据实际 Loader 核对，不能假设两者可互换。
3. 中文有持续读取、实测频率提示及 OOB 解释等差异，随中文基准保留；英文 UBIFS/SquashFS 小节顺序不同，不据此删除中文章节。
4. 中文 §4.1 末句残缺，采用英文对应句补全“烧写前擦除整个 UBIFS 分区”，译文标明来源。
5. 原文 `5456KB + 4KB *256 =6456KB` 算术不一致，未擅改。NAND 图红字 `128KB * 1024 = 1GB` 亦存在容量/单位疑点，原图保留；图内主体同时写 128M + 4M bytes。
6. 源码范围介绍 SPI NOR 段落称 SPI NAND、扇区位置公式写 `512B/s`、`idblock_mutli_copies`、`paramter.txt`、`/uesrdata` 等原始写法保留供追溯，不静默改命令。
7. `UBI overhead` 源码示例内 `0`/`O`、`f1ash`、`#define CONFIG_CMD_UBI = y`、nanddump 参数示例等可疑原文保留，应由对应 SDK 校验。示例不是可直接执行的经过测试脚本。

## 验证边界

- 已完成全文单元翻译映射覆盖检查，13 个表格三种译文齐全；保留末章参考、代码和参数。四语文件及四幅图已实际保存。
- 标为平台参考，未将厂商速率/寿命/压力测试记录作为 ArmSoM 实测；未确认任意 ArmSoM 板卡均适用。
- 本记录不声称已完成每个 PDF 字符的人工逐字核对。完整构建、浏览器目录/窄屏、搜索、canonical/hreflang、sitemap 和 robots 由批次最终验收统一检查；硬件验证未做。
- 未修改原始 PDF，未执行 commit、push 或部署。

## 最后一轮中英文差异复核

- 13 对源表格逐对检查：中文 FSPI 表多 Rom ContRead 支持列，已完整保留；ENV 表另有 idblock 大小 CN 0x3 / EN 0x6、xxx.img PC 地址 CN 0x58C0000 / EN 0x3E000，四语差异块已并列注明。
- 英文独有 ubinize -p 必填及 bytes/KiB/MiB 单位、-s 默认值已补入四语；nanddump /dev/mtd3 与 /dev/mtd4、缺少 -f 的差异已明确注明，原代码未擅改。
- 中文 §4.1 残句已依据英文补全并在正文标注，不再仅修外文。
- FAQ 9.7/9.8 顺序互换，均保留两项内容；UBIFS 手动与自动挂载小节也按中文排序。第 1–10 章目录逐项对应，未发现英文独有整章。
- 本轮为目录/提取段落与数值对照，不冒充全部 PDF 字符人工视觉验证。正文非表格管道符已转义，真实表格与代码不变。
