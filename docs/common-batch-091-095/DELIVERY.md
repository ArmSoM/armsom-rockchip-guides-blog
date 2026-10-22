# 091–095 本地整理交付记录

日期：2026-10-22。按中英文 Common 合并目录顺序，在 090 RKNN 软件栈之后继续五个主题，每篇中文、英文、俄文、德文，共 20 个页面。以下为发布前本地验收快照；用户随后于同日明确授权提交并发布。部署结果另行核实，不以本地验收代替上线验证。

## 本地预览

| 主题 | 中文 | EN | RU | DE |
| --- | --- | --- | --- | --- |
| 91 RKNN SDK 快速上手 | [中文](http://127.0.0.1:4012/zh/articles/091-rockchip-rknn-sdk-quick-start/) | [EN](http://127.0.0.1:4012/articles/091-rockchip-rknn-sdk-quick-start/) | [RU](http://127.0.0.1:4012/ru/articles/091-rockchip-rknn-sdk-quick-start/) | [DE](http://127.0.0.1:4012/de/articles/091-rockchip-rknn-sdk-quick-start/) |
| 92 RKNN SDK 用户指南 | [中文](http://127.0.0.1:4012/zh/articles/092-rockchip-rknn-sdk-user-guide/) | [EN](http://127.0.0.1:4012/articles/092-rockchip-rknn-sdk-user-guide/) | [RU](http://127.0.0.1:4012/ru/articles/092-rockchip-rknn-sdk-user-guide/) | [DE](http://127.0.0.1:4012/de/articles/092-rockchip-rknn-sdk-user-guide/) |
| 93 RKNN-Toolkit2 API | [中文](http://127.0.0.1:4012/zh/articles/093-rockchip-rknn-toolkit2-api/) | [EN](http://127.0.0.1:4012/articles/093-rockchip-rknn-toolkit2-api/) | [RU](http://127.0.0.1:4012/ru/articles/093-rockchip-rknn-toolkit2-api/) | [DE](http://127.0.0.1:4012/de/articles/093-rockchip-rknn-toolkit2-api/) |
| 94 RKNN Runtime C API | [中文](http://127.0.0.1:4012/zh/articles/094-rockchip-rknn-runtime-c-api/) | [EN](http://127.0.0.1:4012/articles/094-rockchip-rknn-runtime-c-api/) | [RU](http://127.0.0.1:4012/ru/articles/094-rockchip-rknn-runtime-c-api/) | [DE](http://127.0.0.1:4012/de/articles/094-rockchip-rknn-runtime-c-api/) |
| 95 RKNN Compiler 算子规格 | [中文](http://127.0.0.1:4012/zh/articles/095-rockchip-rknn-compiler-operators/) | [EN](http://127.0.0.1:4012/articles/095-rockchip-rknn-compiler-operators/) | [RU](http://127.0.0.1:4012/ru/articles/095-rockchip-rknn-compiler-operators/) | [DE](http://127.0.0.1:4012/de/articles/095-rockchip-rknn-compiler-operators/) |

链接仅供本机审核，不是发布地址。页面 canonical、hreflang、sitemap 使用正式 HTTPS 域名；校对报告不作为正式文章进入 sitemap。

## 来源与处理

- 091：中英 V2.3.2，中文 27 页、英文 29 页。中文 16 张原图，英俄德共用 16 张英文原图；板卡/电源照片为 Rockchip 原厂参考，不代表 ArmSoM 板卡供电要求。完整保留安装、部署、Python/C 示例、Docker、FAQ 及截图日志转录。恢复软折行路径、命令和跨页内容；各语言 Miniforge 示例版本、原稿列表编号与路径疑点保留并说明。
- 092：中英 V2.3.2，中文 165 页、英文 178 页。完整保留 11 章，覆盖 Toolkit2/Lite2、Runtime、Matmul、动态形状、自定义算子、多核、SRAM、稀疏、量化、性能、内存及全部 FAQ。位图与矢量图均独立保留；截图中的性能、精度、稀疏和错误日志另提供可复制转录。表格恢复为可编辑正文，跨页代码连接、公式补录并保留原图对照。中文新增性能排查图不冒充英文图；英文内存示例重复性能日志、AC_quant_type 描述复用布局文字等源问题明确记录。原图自身裁切处以 [clipped] 表示，不猜数值。
- 093：中英 V2.3.2，中文 22 页、英文 25 页。完整恢复全部 Toolkit2 API、参数表、示例、自定义算子及末尾代码生成内容。原稿没有独立技术配图，并非漏图。Python 3.8/3.8、ARM64 Debian 标注 x64、tfilte 等原稿问题按源保留并记疑。
- 094：中英 V2.3.2，中文 52 页、英文 57 页。完整保留 C API、Matmul、自定义算子、平台矩阵及全部错误码；全部技术表格可编辑，跨页代码完整连接。原稿无独立技术配图。rknn_query 查询命令/章节描述、DEVICE_MEM_INFO 平台声明、销毁顺序及枚举等疑点记录，不擅自修成已验证示例。
- 095：目录名分为中英，但两个 343 页 PDF 字节完全相同且正文实际中文，没有真正英文原稿。EN/RU/DE 为该中文稿完整补译，7 张图为同一中文原图，并在各语言披露。完整保留七类 NPU 平台算子、98 项 CPU 算子、全部输入输出限制及最后公式。343 页逐页通览；恢复表格、跨页代码及公式，修复列表缩进造成的额外代码块和方括号误链接。原文 WRB/LBR、mast_t、note 9、对齐矩阵等疑点保留。

全部原始 PDF 路径、页数及 SHA256 见 SOURCE-INVENTORY.json；哈希复核未变。封面日期、密级、声明、联系信息、读者对象、文档修订记录已按要求去除，技术版本、软件变更及代码内部注释/署名保留。

## 实际验证

- Jekyll 构建成功；20 个真实页面均在浏览器打开，四语顶栏链接对应同一主题。
- 五篇英俄德代码块、图 URL、标题层级及表格形状一致；全站 94 篇德文与英文对应结构检查通过。
- 20 页正文代码逐块渲染一致，标题/表格/图数量、站内链接与锚点检查通过。
- 本地 HTTP 检查：20 页及 174 个独立配图 URL 均成功，无意外 X-Robots-Tag 禁止项。
- 四语搜索各 94 篇；新文章各出现一次，浏览器逐篇四语检索返回正确链接。
- sitemap 新增 20 个正式 HTTPS 地址各一次，无重复、localhost、Markdown 源文件/校对报告；不制造构建时间 lastmod。
- canonical 自指；hreflang 四语互联、含自身，x-default 指向对应英文页。
- 既有 robots.txt、Google 验证文件保持不变；本地输出未发现阻止正文/图片抓取，验证文件字节一致。
- 浏览器检查桌面无整页横向溢出；390px 窄屏目录可折叠，表格/代码在自身范围横向滚动。目录跳转与 aria-current 位置高亮正常；原图比例未拉伸。

## 边界与待核对

- 适用性为原稿 RKNN V2.3.2 平台参考，不将版本称为当前最新版；不能笼统推断所有 ArmSoM 板卡支持。板卡、电源、SDK/BSP、内核、驱动、模型格式与内存配置须按实际设备核对。
- 未执行实体硬件测试、安装脚本、模型性能实验或原稿故障命令；原厂数据不是 ArmSoM 实测。原稿参数/路径矛盾与裁切字段逐篇见 EDITORIAL-NOTES.md。
- 浏览器检查是本机软件验证，不等于所有实体手机验收。仅检查本地响应头，未声称生产部署完成、Google 收录、排名提升或 AI 引用。
- 未修改原 PDF、站点验证、爬虫权限、DNS、Search Console 或账号；验收时本批尚未 commit、push 或发布。用户随后于 2026-10-22 明确授权提交发布，实际部署状态另以远程结果为准。

证据：SOURCE-QA.json、SITE-QA.json、HTTP-QA.json、BROWSER-QA.json。各篇详细校对记录：
- `docs/rockchip-rknn-sdk-quick-start/EDITORIAL-NOTES.md`
- `docs/rockchip-rknn-sdk-user-guide/EDITORIAL-NOTES.md`
- `docs/rockchip-rknn-toolkit2-api/EDITORIAL-NOTES.md`
- `docs/rockchip-rknn-runtime-c-api/EDITORIAL-NOTES.md`
- `docs/rockchip-rknn-compiler-operators/EDITORIAL-NOTES.md`
