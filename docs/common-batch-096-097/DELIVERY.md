# 096–097 四语本地交付

发布授权补记（2026-10-23）：用户明确要求发布未提交代码，授权提交并推送本批 096–097 四语文章、图片及校对记录。下述“本地/等待发布”内容记录的是 2026-10-22 验收时状态；实际推送与上线结果另行核实，不由此记录预先保证。

日期：2026-10-22。按 Common 中英文合并目录顺序接在 095 之后，由主任务顺序整理，未委派并行。共 2 个主题、中文/英文/俄文/德文 8 页；这批仅保存本地，等待用户发布指令。

## 本地预览

| 文章 | 中文 | English | Русский | Deutsch |
| --- | --- | --- | --- | --- |
| 096 RKLLM SDK 1.2.3 | [中文](http://127.0.0.1:4013/zh/articles/096-rockchip-rkllm-sdk/) | [EN](http://127.0.0.1:4013/articles/096-rockchip-rkllm-sdk/) | [RU](http://127.0.0.1:4013/ru/articles/096-rockchip-rkllm-sdk/) | [DE](http://127.0.0.1:4013/de/articles/096-rockchip-rkllm-sdk/) |
| 097 Vendor Storage | [中文](http://127.0.0.1:4013/zh/articles/097-rockchip-vendor-storage/) | [EN](http://127.0.0.1:4013/articles/097-rockchip-vendor-storage/) | [RU](http://127.0.0.1:4013/ru/articles/097-rockchip-vendor-storage/) | [DE](http://127.0.0.1:4013/de/articles/097-rockchip-vendor-storage/) |

仅本机审核地址，不是正式发布。站点正式 URL 仍为 `https://blog.armsom.org`。

## 来源、完整性与配图

- 096：中文 65 页、英文 77 页，均为 SDK 1.2.3。第 7 页至最后相关资源章完整整理，涵盖 Toolkit/Runtime、环境、内核、全部模型转换 API、量化、GPTQ、自定义模型、PPL、全部板端结构体与接口、LoRA、prompt cache、function calling、多 batch、日志性能、Flask/Gradio 服务端和全部客户端示例。中文依据中文原稿，英/俄/德依据英文原稿；不静默混用不同示例。中文 8 张中文原图，英/俄/德共用 8 张英文原图；5 组原始截图日志另有可复制转录。英/俄/德各 34 个可编辑技术表，中文 35 个；含转录的代码/日志块分别为 68/68/68/69（中文），保留源排版差异。
- 097：唯一 PDF 为中文目录中的 23 页英文原稿，Rev.08。第 4–23 页完整恢复，包括全部布局/ID/对齐/API/配置/PC 操作及末尾 Linux 读写代码。四语共用 9 张英文原图（3 张矢量技术图区域、6 张原位图）；不是假称存在中文图片或另一个英文 PDF。数据表和 ID 表可编辑，配置截图另转录；四语各 7 表、13 代码/配置块。
- 原始 PDF 路径、页数及 SHA-256 见 SOURCE-INVENTORY.json；最终哈希复核未变。文章为可编辑 Markdown，图片独立存入各篇 `assets/`，不是用整页截图代替技术正文。
- 按要求去掉封面日期、密级、文档修订记录、静态 PDF 目录及非技术页眉页脚。技术版本、必要来源、代码注释保留，网站目录复用既有功能。

## 修复和保留的疑点

- 修复英文丢空格、中文对齐空格、URL/参数/字符串软换行、跨页代码和表格续行、灰底代码误识别表格、代码末行字体边界漏提取，以及页面步骤自动重编号。裁图逐张对照，扩宽 Vendor Storage NAND 注释与架构底部，保留标签箭头。
- RKLLM：保留原稿 `normal_r[164]`、全角右括号、异常 Python 缩进、JSON/Python 常量混用、回调枚举/类型描述冲突、路径大小写差异及错图注；日志 Runtime 1.0.2b9 / driver 0.9.7 与正文 0.9.8 要求不同，明确为历史原始示例，非 ArmSoM 实测。
- Vendor Storage：保留 `Item0->flag(reversed)`、`ATTENTION KEY`、ABI 相关 `unsigned long uint32` 与未定义 u32/u16/u8 等原稿问题。写入示例会覆盖 SN ID 1，四语均有明确警告，未执行。
- 两篇均是平台适配参考；ArmSoM 具体板卡、SDK/BSP、内核、驱动/Runtime、模型或存储组合需要实机确认。没有硬件测试，不把原厂性能/读写结果写成 ArmSoM 数据。
- 详细记录：`docs/rockchip-rkllm-sdk/EDITORIAL-NOTES.md`、`docs/rockchip-vendor-storage/EDITORIAL-NOTES.md`。

## 验证与边界

- Jekyll 实际构建成功；8 个真实文章页面已在浏览器打开。四语顶部切换、translation_key、分类和列表复用既有机制，无正文重复语言入口。
- 四语搜索索引各 96 篇；浏览器逐篇四语查询，均返回对应新文章。EN/RU/DE 新文章代码、图链接、标题层级和表格形状一致；全站 96 篇德文与英文对应结构一致。
- 新增 8 个 sitemap 地址均为正式 HTTPS、各出现一次，无 localhost、Markdown、校对报告或临时页，无虚构构建时间 lastmod。canonical 自指，四语 hreflang 含自身且相互关联，x-default 对应英文。
- 8 页代码逐块渲染一致，标题/表/图数量、内部链接与锚点有效；25 个独立图片 URL 和 8 页本地 HTTP 均 200，无意外 X-Robots-Tag 禁止项。robots 规则、Google 验证文件未修改，构建后的验证文件字节一致。
- 1366px 宽屏侧边目录 sticky；390px 窄屏目录初始折叠，实际展开和跳转成功，章节 aria-current 高亮正常。8 页无整页横向溢出，长代码/表格在自身范围滚动；图按比例显示。视口检查不等于所有实体手机验证。
- 原始 PDF、无关文件、DNS、Search Console、账号权限未改。没有执行原稿安装/写盘/刷机/模型代码，没有承诺 Google 收录、排名或 AI 引用。生产响应头和实体硬件兼容性不属于本地验证结果。
- 上一批 091–095 已发布的提交为 `3acd08bea88dfcd69cc5ba166f6387e497490fdc`，其部署已在先前验证。本轮只读确认远程仍为该提交；096–097 没有 commit、push 或上线。

证据文件：SOURCE-INVENTORY.json、SOURCE-QA.json、SITE-QA.json、HTTP-QA.json、BROWSER-QA.json。新文章全部等待明确发布指令。
