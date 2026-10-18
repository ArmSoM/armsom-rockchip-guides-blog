# 056–065 批次交付记录

日期：2026-10-18。本批从上批 055 DSMC 之后，按中英文 Common 相对目录合并顺序接续选择 10 个主题；共 19 份 PDF、350 页，形成 30 篇完整中文、英文、俄文 Markdown。062 只有英文源稿，已明确注明中文、俄文译自英文。

## 本地审核入口

静态构建目录在仓库之外，预览服务绑定 127.0.0.1:4005。以下均为网站实际文章，不是独立 HTML。

| 编号与主题 | 中文 | English | Русский | 校对记录 |
| --- | --- | --- | --- | --- |
| 056 Slave DSMC | [预览](http://127.0.0.1:4005/zh/articles/056-rockchip-slave-dsmc/) | [Preview](http://127.0.0.1:4005/articles/056-rockchip-slave-dsmc/) | [Просмотр](http://127.0.0.1:4005/ru/articles/056-rockchip-slave-dsmc/) | [来源与校对](../rockchip-slave-dsmc/EDITORIAL-NOTES.md) |
| 057 CPUFreq | [预览](http://127.0.0.1:4005/zh/articles/057-rockchip-cpufreq/) | [Preview](http://127.0.0.1:4005/articles/057-rockchip-cpufreq/) | [Просмотр](http://127.0.0.1:4005/ru/articles/057-rockchip-cpufreq/) | [来源与校对](../rockchip-cpufreq/EDITORIAL-NOTES.md) |
| 058 Devfreq | [预览](http://127.0.0.1:4005/zh/articles/058-rockchip-devfreq/) | [Preview](http://127.0.0.1:4005/articles/058-rockchip-devfreq/) | [Просмотр](http://127.0.0.1:4005/ru/articles/058-rockchip-devfreq/) | [来源与校对](../rockchip-devfreq/EDITORIAL-NOTES.md) |
| 059 FLEXBUS | [预览](http://127.0.0.1:4005/zh/articles/059-rockchip-flexbus/) | [Preview](http://127.0.0.1:4005/articles/059-rockchip-flexbus/) | [Просмотр](http://127.0.0.1:4005/ru/articles/059-rockchip-flexbus/) | [来源与校对](../rockchip-flexbus/EDITORIAL-NOTES.md) |
| 060 FLEXBUS ADC/DAC | [预览](http://127.0.0.1:4005/zh/articles/060-rockchip-flexbus-adc-dac/) | [Preview](http://127.0.0.1:4005/articles/060-rockchip-flexbus-adc-dac/) | [Просмотр](http://127.0.0.1:4005/ru/articles/060-rockchip-flexbus-adc-dac/) | [来源与校对](../rockchip-flexbus-adc-dac/EDITORIAL-NOTES.md) |
| 061 FLEXBUS FSPI | [预览](http://127.0.0.1:4005/zh/articles/061-rockchip-flexbus-fspi/) | [Preview](http://127.0.0.1:4005/articles/061-rockchip-flexbus-fspi/) | [Просмотр](http://127.0.0.1:4005/ru/articles/061-rockchip-flexbus-fspi/) | [来源与校对](../rockchip-flexbus-fspi/EDITORIAL-NOTES.md) |
| 062 GMAC PTP1588 | [预览](http://127.0.0.1:4005/zh/articles/062-rockchip-gmac-ptp1588/) | [Preview](http://127.0.0.1:4005/articles/062-rockchip-gmac-ptp1588/) | [Просмотр](http://127.0.0.1:4005/ru/articles/062-rockchip-gmac-ptp1588/) | [来源与校对](../rockchip-gmac-ptp1588/EDITORIAL-NOTES.md) |
| 063 Linux GMAC | [预览](http://127.0.0.1:4005/zh/articles/063-rockchip-linux-gmac/) | [Preview](http://127.0.0.1:4005/articles/063-rockchip-linux-gmac/) | [Просмотр](http://127.0.0.1:4005/ru/articles/063-rockchip-linux-gmac/) | [来源与校对](../rockchip-linux-gmac/EDITORIAL-NOTES.md) |
| 064 GMAC DPDK | [预览](http://127.0.0.1:4005/zh/articles/064-rockchip-gmac-dpdk/) | [Preview](http://127.0.0.1:4005/articles/064-rockchip-gmac-dpdk/) | [Просмотр](http://127.0.0.1:4005/ru/articles/064-rockchip-gmac-dpdk/) | [来源与校对](../rockchip-gmac-dpdk/EDITORIAL-NOTES.md) |
| 065 GMAC 模式配置 | [预览](http://127.0.0.1:4005/zh/articles/065-rockchip-gmac-mode-configuration/) | [Preview](http://127.0.0.1:4005/articles/065-rockchip-gmac-mode-configuration/) | [Просмотр](http://127.0.0.1:4005/ru/articles/065-rockchip-gmac-mode-configuration/) | [来源与校对](../rockchip-gmac-mode-configuration/EDITORIAL-NOTES.md) |

## 内容与图片

- 技术章节、步骤、命令、DTS、API、日志、参数和最后章节按各篇校对记录检查；清除指定封面、声明、联系方式、读者对象和修订表，保留技术版本和代码内部注释。
- 修复 PDF 断行、代码跨页、中文字形提取、表格恢复及 Markdown 编号中断。PTP 的公式同时保留原图与可复制文本，描述符和 PPS 频率表恢复为可编辑表格。
- 独立原图共 24 个文件：056、057、058 各含中文和英文原图各 1；062 英文原图 6；065 中文和英文原图各 6。其余 5 个主题没有技术配图，不添加虚构图片。三语文章共引用原图 45 次。
- 中文使用中文 PDF 图；英文与俄文使用英文 PDF 图。062 无中文 PDF，三语均使用英文 PDF 的六张图，部分原图内含中文标签，已如实说明。

## 版本与待核对项

- 056：中文 V1.0.0、英文 V1.0.1，章节编号映射和差异见记录。
- 058：中文 V1.1.1、英文 V1.0.0，两份正文均完整保留；互补内容按来源页明确补入，不假定封面版本错误。
- 060：IIO device0/device1/device2 的原文路径与示例存在差异，保留并提醒先核对设备名称。
- 062：IPv6 地址串、phy2sys 名称、CST/UTC 表述、gPTP 全称及首个 RMS 日志值存在原稿疑点；均保留追溯，不作为已验证配置。
- 063：英文缺少中文硬件测试小节，已完整补译英文、俄文并注明中文页码及章节对应。
- 064：中文编译目标 rrk3568 与英文 rk3568 不同，未擅自统一。
- 065：同为 V1.4.0 仍有 rmii/RMII、DTS 结束分号及 gmac0m0 引脚组差异；按来源分别保留，俄文跟随英文，并在正文与记录提示。
- 全批为平台参考。具体 ArmSoM 板卡、SDK/BSP、内核、PHY/接线及引脚复用仍须核实；没有执行硬件测试，原文日志和测试数字不代表 ArmSoM 实测。

## 已完成验证

- Jekyll 完整构建成功，30/30 新页面正常生成；页面代码块逐个与 Markdown 源码一致，未发现解析截断。
- 71 个本地文章、图片、校对记录、搜索及站点资源 HEAD 检查全部 200，无 X-Robots-Tag noindex。
- 三语 translation_key、语言切换、文章分类和搜索条目、目录锚点、图片文件与 alt、内部链接通过检查。
- 新页面 canonical 均为自身正式 HTTPS 地址；hreflang 包含实际存在的 EN/ZH/RU，自身与相互对应，x-default 为英文；未伪造德文文章关联。
- sitemap 含全部 30 个新页面，无重复 URL、localhost、Markdown 源稿或校对记录；无不可靠 lastmod。
- robots.txt 仍为原有 Allow: / 及正式 HTTPS sitemap；未修改爬虫权限、Google 验证文件、DNS 或账号设置。
- 浏览器逐页检查 30 页 390×844 手机尺寸：无整页横向溢出、无已加载破图，目录折叠，全部标题进入目录，代码块可横向滚动。
- 桌面实点 PTP 目录跳转及当前节高亮、EN/RU 切换，三张表横向滚动样式正常；文章目录搜索 PTP1588 正确返回新增文章。

## 保存和发布边界

新文章、独立图片及 10 份校对记录已保存到目标仓库。初次交付时未提交；用户随后批准本批按 056–065 顺序分别创建 10 个本地 commit，交付记录随最后一篇提交。本批不 push、不正式发布、不向搜索引擎提交，也不加入先前固定 SHA 发布队列。原有 README 本地修改保留，不纳入本批 commit。原始 PDF 未改动；19 份源文件 SHA-256 与本批输入清单一致。

自动化详细证据在工作目录 work/batch-056-065-site-check.json 与 work/batch-056-065-http-check.json；逐篇原文页码、版本和疑点见上表校对记录。
