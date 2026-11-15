# Rockchip 工具手册网页化校对记录

更新日期：2026-11-15。原始资料为用户指定 tools 目录及压缩包内 16 份 PDF，共 213 页，对应 11 个工具主题。

## 本次整理

- 24 个工具的 96 篇中英俄德页面和 4 篇索引统一改为 GitHub 对应目录入口，不直接链接二进制下载。
- Blog 不提供独立 PDF 下载入口；GitHub README 和四语 Markdown 使用 GitHub blob PDF 预览链接，保留原 PDF 字节。
- RKDevTool、upgrade_tool、DDR Bandwidth、PinDebug、USB SQ、sign_tool、SecureBootTool、Linux AVB、HDCP Key Writer、programmer_image_tool 的技术内容直接展示为 Markdown 正文、代码和表格。
- PCBA 的 37 页中文及 43 页英文稿与现有 197 Linux PCBA V1.2.0 完整文章一致，复用该四语文章，不复制第二套正文；工具页提供直接网页入口及全章阅读范围。
- 从对应 PDF 提取 106 张技术界面/流程图；不含封面、页眉商标及联系页。RKDevTool 中英分别用对应原图；2021 中文新增界面没有英文原图，明确保留中文。只有中文稿的工具保留原界面，不伪称英文截图。Programmer 帮助截图为英文原稿。
- 工具包下载文件没有修改；没有执行工具、烧录、写寄存器、写 OTP/eFuse 或硬件测试。

## 章节与版本核对

| 主题 | 处理范围与差异 |
|---|---|
| RKDevTool | 2018 中英 V1.2 全部 13 项功能、7 类错误、使用注意；2021 V1.0 全部 12 项功能；版本不按文档号猜新旧，补充 English Clear sn 的 IDBlock sector3 SN/MAC 范围及擦除步骤差异。 |
| upgrade_tool | V1.0/V1.1 全部 11 项功能；V1.1 文件封面仍 1.0，单独记录 SPI NAND/NOR 擦除支持差异。原始 -1、LBA、分区缩写不改。 |
| DDR Bandwidth | 六章全部参数、两组完整输出、12 类指标、DEVMEM 配置；sysfs Hz 与 -f MHz 分开。原帮助 rk3128h 与错误日志缺 / 保留并说明。 |
| PinDebug | 1.1–1.11 全部操作及原图；help 截图转写，vesl/vsel 差异注明；导出与查询截图地址不同，不拼成一个板卡配置。 |
| USB SQ | V1.4.0 全部平台界面、7 张参数表、日志、代码接入；从既有校对 V1.8.0 译文复用一致段落，按 V1.4.0 筛选平台，不扩张旧版支持。RK3562 结尾 ]、省略号原样保留且标注不可直接编译。 |
| sign_tool | 算法表、5 项准备、5 类签名/验证、外部提取/签名/注入全部保留；OpenSSL 跨行恢复成单行，参数不改。 |
| SecureBootTool | 六章及全部技术图；图片中 mkimage.sh ota 转成代码；重复 3.5 按顺序整理，2016 年芯片/最低工具版本与现代平台分开。 |
| Linux AVB | V2.2.5 平台提交表、Trust/U-Boot、完整补丁、完整参数、四密钥、签名、下载、锁定解锁和日志；A/B userdata 0x0065f00 地址疑点不猜改，互斥 OPTEE 配置明确说明。 |
| PCBA | 与已发布 197 完整手册逐项对照，引用既有全五章、9 张协议表、37 代码块及中英原图；英文旧 camera 和路径/协议拼写差异保留校对记录。 |
| HDCP | 全部通用/HDCP 配置、完整 10 文件打包日志、KeyConvertor 分割 1-3/4-6/7-9/10-10 步骤及原图。 |
| programmer_image_tool | 两稿全部四种存储例子、帮助图全部参数；截图确认 -2 为每页 2k 数据，不是更改物理页；Linux 稿损坏本地图片链接由对应英文帮助图补齐。 |

## 验收边界

复用现有四语 translation_key、目录脚本、响应式样式、搜索、sitemap 和 SEO 模板。源文件和页面检查结果记录在工作目录 validation.json；本记录不宣称搜索收录、排名或硬件适配。
