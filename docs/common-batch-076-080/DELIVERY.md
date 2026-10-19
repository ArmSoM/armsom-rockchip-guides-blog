# 076–080：五篇 ISP30 资料统一交付记录

状态（2026-10-19）：**15 篇三语 Markdown 全文、配图及逐篇校对记录已保存；Jekyll 构建、源码/生成页面检查和本地浏览器验收已完成。** 原有权限审核服务容量阻塞已解除，未绕过审批。

内容验收阶段未执行 commit、push 或发布。2026-10-19 用户在验收后明确授权“commit 并发布”，按五篇分别提交，再通过 origin/main 的既有 GitHub Pages 机制发布；实际推送与部署结果以本聊天核实记录为准。未操作 Search Console、DNS 或账号权限。

## 篇目及来源

按中英文 Common 合并目录排序，接续 075。本批 5 份均只有英文 PDF，共 956 页；未发现对应中文原稿。中文、俄文均完整翻译所列英文版本，图片全部来自这些英文 PDF（包括其本来含有的中文标签），不伪称来自中文 PDF。

| 编号 | 主题 | 英文原稿版本 | 原稿页数 | 每语言可编辑表 | 每语言代码/日志/公式块 | 每语言技术图 |
|---|---|---|---|---|---|---|
| 076 | ISP30 色彩优化 | V3.0.2 | 84 | 55 | 61 | 132 |
| 077 | ISP30 自定义 3A | V1.1.0 | 46 | 39 | 27 | 14 |
| 078 | ISP30 开发指南 | V1.2.5 | 436 | 733 | 496 | 42 |
| 079 | VI 驱动指南 | V1.1.5 | 230 | 165 | 273 | 18 |
| 080 | ISP30 调优指南 | V1.2.0 | 160 | 105 | 3 | 65 |

代码块统计包含保留的日志、位域与可复制公式，不等于独立可执行程序数量。图片统计包含 076/080 各一张从源 PDF 恢复的矢量公式裁图；未生成装饰性 AI 图或整页正文截图。原稿自身缺图和裁切不伪造补全。

三语源文件分别位于 `_articles/`、`_articles_zh/`、`_articles_ru/`，统一命名：

- `076-rockchip-isp30-color-optimization.md`
- `077-rockchip-isp30-3a.md`
- `078-rockchip-isp30-development.md`
- `079-rockchip-isp30-vi-driver.md`
- `080-rockchip-isp30-tuning.md`

逐篇来源、页码、提取修复及技术疑点：

- [076 校对记录](../rockchip-isp30-color-optimization/EDITORIAL-NOTES.md)
- [077 校对记录](../rockchip-isp30-3a/EDITORIAL-NOTES.md)
- [078 校对记录](../rockchip-isp30-development/EDITORIAL-NOTES.md)
- [079 校对记录](../rockchip-isp30-vi-driver/EDITORIAL-NOTES.md)
- [080 校对记录](../rockchip-isp30-tuning/EDITORIAL-NOTES.md)

## 已完成检查

- 五份原 PDF SHA-256 与初始清单一致；原稿未修改。
- 15 个完整正文文件实际存在，不含组装占位标记。078 人工双译清单剩余缺项为 0，三篇落盘正文与已审核组装输出逐字一致。
- 同篇中英俄标题层级/数量对应，全部代码块逐块一致，图片引用顺序一致，所有配图文件存在。
- 全部表格使用可编辑 Markdown；跨页表格/代码、末章与附录逐篇核对。078 的十张 RAW 格式截图另恢复可编辑数据表。
- 删除指定非技术前置章节，保留技术版本/产品支持记录及源代码内部必要注释。代码注释保留原文，技术标识和数值不随翻译改写。
- 修复 PDF 断行、注释续行、印刷行号、表头漏译和误归类代码框的普通说明；修正俄文 PWM duty cycle 为“коэффициент заполнения PWM”。
- 复用现有 category、translation_key、三语集合及模板，未另实现语言切换、TOC、搜索或 sitemap。未修改已有主题、验证文件、robots 或全局 SEO 配置。
- 原文冲突已列入各篇校对记录，未把原稿数据写成 ArmSoM 实测。板卡/SDK/内核/AIQ 适配仍待硬件验证。

源级自动检查证据：本聊天工作目录 `work/batch-076-080-source-check.json`。该检查不替代 Jekyll 构建和真实页面验收。

## 构建与真实页面验收

最初三次申请在命令执行前被审核服务 `Selected model is at capacity` 阻止；用户要求继续后，重新审核获准。首次构建成功（167.357 秒），发现并修复真实 Markdown 渲染问题，第二次完整构建成功（66.634 秒）。无需重装 Ruby 或修改权限配置。

本轮实际修复：078 英文第 430 页用途说明因原稿代码框缩进被 Markdown 当成代码，现恢复为普通编号说明；079 三语驱动目录树的 `|--` 和缩进被误识别为表格/代码，现以保留空白的文本段落显示，目录路径、中文/俄文说明及所有真正代码块均不改变。最终渲染后的代码块与 Markdown 逐块一致，表格数量与上表一致。

已通过：

1. 全部 15 个页面生成并逐一在浏览器打开；标题、正文语言、目录项、表格/代码数量一致。三语互相对应；没有不存在的德文文章 hreflang（顶部 DE 按现有规则回到德文首页）。
2. 所有 15 个页面进入搜索索引和 sitemap，各 URL 仅出现一次；sitemap 使用 `https://blog.armsom.org/`，没有 localhost、Markdown、校对记录或临时页，没有不可靠的 lastmod。
3. 每个 canonical 指向自身正式 HTTPS URL；hreflang 含自身、中英俄互链和英文 x-default。没有意外 noindex/nofollow 标记。
4. 三语目录中搜索 `ISP30` 均实际返回这五篇，页数为 1/1；各篇 category 为摄像头与视频，沿用现有搜索与分页。
5. 本地 HTTP 共检查 299 个文章、配图、校对记录、索引/站点地图、robots、站点验证等路径，全部 HTTP 200；未发现 X-Robots-Tag 的 noindex。此为本地静态预览响应，不冒充线上部署响应。
6. 桌面抽查 076 章节点击可跳转，目录高亮随当前位置更新，公式与图片清晰且比例正确。390px 窄屏下目录默认折叠，可点击展开；长表格和代码为 `overflow-x:auto`，无整页横向溢出。对最长的 078 中文页面再次检查，202 张宽表格在自身容器横向滚动，全部表格与代码均可横滚，不压缩代码含义。
7. 五份源 PDF 哈希未变；已有验证文件及 robots/global 模板不变。未开展硬件运行或 SDK 编译测试。

证据位于本聊天工作目录：`work/batch-076-080-source-check.json`、`work/batch-076-080-site-check.json`、`work/batch-076-080-http-check.json`。搜索配置只帮助发现页面，不代表 Google 收录或 AI 引用。

## 已启动的本地预览

统一入口：[中文](http://127.0.0.1:4008/zh/library/?q=ISP30) · [English](http://127.0.0.1:4008/library/?q=ISP30) · [Русский](http://127.0.0.1:4008/ru/library/?q=ISP30)

| 主题 | 中文 | English | Русский |
|---|---|---|---|
| 076 色彩优化 | [预览](http://127.0.0.1:4008/zh/articles/076-rockchip-isp30-color-optimization/) | [Preview](http://127.0.0.1:4008/articles/076-rockchip-isp30-color-optimization/) | [Просмотр](http://127.0.0.1:4008/ru/articles/076-rockchip-isp30-color-optimization/) |
| 077 自定义 3A | [预览](http://127.0.0.1:4008/zh/articles/077-rockchip-isp30-3a/) | [Preview](http://127.0.0.1:4008/articles/077-rockchip-isp30-3a/) | [Просмотр](http://127.0.0.1:4008/ru/articles/077-rockchip-isp30-3a/) |
| 078 开发指南 | [预览](http://127.0.0.1:4008/zh/articles/078-rockchip-isp30-development/) | [Preview](http://127.0.0.1:4008/articles/078-rockchip-isp30-development/) | [Просмотр](http://127.0.0.1:4008/ru/articles/078-rockchip-isp30-development/) |
| 079 VI 驱动 | [预览](http://127.0.0.1:4008/zh/articles/079-rockchip-isp30-vi-driver/) | [Preview](http://127.0.0.1:4008/articles/079-rockchip-isp30-vi-driver/) | [Просмотр](http://127.0.0.1:4008/ru/articles/079-rockchip-isp30-vi-driver/) |
| 080 调优指南 | [预览](http://127.0.0.1:4008/zh/articles/080-rockchip-isp30-tuning/) | [Preview](http://127.0.0.1:4008/articles/080-rockchip-isp30-tuning/) | [Просмотр](http://127.0.0.1:4008/ru/articles/080-rockchip-isp30-tuning/) |

站点目录为本聊天 `work/batch-076-080-site`，预览服务仅绑定 `127.0.0.1:4008`；不是公网发布。旧 4007 预览不是本批完整新站点。
