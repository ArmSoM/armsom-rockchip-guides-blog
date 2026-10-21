# 086–090 本地整理交付记录

日期：2026-10-21。范围：按中英文合并目录顺序，在 085 Linux Meminfo 之后继续五个主题；每篇中文、英文、俄文、德文，共 20 个页面。整理阶段仅保存仓库文件及本地预览；用户于同日明确授权提交并发布。以下为发布前验收快照，部署结果另以远程构建及线上页面核实，不操作搜索引擎。

## 本地预览

| 主题 | 中文 | EN | RU | DE |
| --- | --- | --- | --- | --- |
| 086 Linux Memory Allocator | [中文](http://127.0.0.1:4010/zh/articles/086-rockchip-linux-memory-allocator/) | [EN](http://127.0.0.1:4010/articles/086-rockchip-linux-memory-allocator/) | [RU](http://127.0.0.1:4010/ru/articles/086-rockchip-linux-memory-allocator/) | [DE](http://127.0.0.1:4010/de/articles/086-rockchip-linux-memory-allocator/) |
| 087 SD Boot | [中文](http://127.0.0.1:4010/zh/articles/087-rockchip-sd-card-boot/) | [EN](http://127.0.0.1:4010/articles/087-rockchip-sd-card-boot/) | [RU](http://127.0.0.1:4010/ru/articles/087-rockchip-sd-card-boot/) | [DE](http://127.0.0.1:4010/de/articles/087-rockchip-sd-card-boot/) |
| 088 SDMMC / SDIO / eMMC | [中文](http://127.0.0.1:4010/zh/articles/088-rockchip-sdmmc-sdio-emmc/) | [EN](http://127.0.0.1:4010/articles/088-rockchip-sdmmc-sdio-emmc/) | [RU](http://127.0.0.1:4010/ru/articles/088-rockchip-sdmmc-sdio-emmc/) | [DE](http://127.0.0.1:4010/de/articles/088-rockchip-sdmmc-sdio-emmc/) |
| 089 MPP | [中文](http://127.0.0.1:4010/zh/articles/089-rockchip-mpp/) | [EN](http://127.0.0.1:4010/articles/089-rockchip-mpp/) | [RU](http://127.0.0.1:4010/ru/articles/089-rockchip-mpp/) | [DE](http://127.0.0.1:4010/de/articles/089-rockchip-mpp/) |
| 090 RKNN 软件栈 | [中文](http://127.0.0.1:4010/zh/articles/090-rockchip-rknn-software-stack/) | [EN](http://127.0.0.1:4010/articles/090-rockchip-rknn-software-stack/) | [RU](http://127.0.0.1:4010/ru/articles/090-rockchip-rknn-software-stack/) | [DE](http://127.0.0.1:4010/de/articles/090-rockchip-rknn-software-stack/) |

链接仅供本机审核，不是正式发布地址。页面 canonical、hreflang 与 sitemap 使用 `https://blog.armsom.org/` 正式域名；本报告不进入 sitemap。

## 来源与处理

- 086：仅中文 V1.0.0，10 页；其余三语完整补译。原稿无技术图片。完整保留两段跨页日志、全部地址/大小/单位，修复断行与代码缩进；目录树中文原注释不改，另补英俄德说明。RK-DMA-HEAP 仅 RV1106，不能泛化到 RK3588 或所有 ArmSoM。
- 087：仅中文 V1.3.1，17 页；其余三语完整补译。全部 8 张中文原图（含矢量及跨页流程图）保留并注明无英文原图。恢复可编辑技术表，保留末章和全部 IDB/BCB 矩阵。原稿不同卡类型地址、工具版本及文件大小写差异逐项记录，未猜改。
- 088：中英均 V1.4.0，中文 22 页、英文 25 页。中文用 8 张中文图，英俄德用 8 张英文 PDF 原图；英文原图本身包含中文标签的情况已披露。恢复全部 52 项 mmc_test、跨页代码、技术表和最后 DTS 补丁。中英 `keep-power-in-suspend`、测试 N26/N44 等矛盾各按源保留并注明；不把疑似错误示例说成可直接执行的修复稿。
- 089：中英均 V1.4.2，中文 53 页、英文 57 页。完整保留第 1–6 章、末尾 FAQ、原图、可编辑表格与代码；截图中的代码另转录成可复制文本并保留原图对照。中英平台/格式差异、旧截图与新表定义差异及原稿异常符号记录在逐篇校对说明。
- 090：中英目录各 4 页，两个 README.pdf 字节相同且正文实际均英文；中文、俄文、德文完整本地化。中文取中文目录框图，英俄德取英文目录原图。保留全部平台、Python 版本、技术下载链接及 v2.3.2 软件变更。v2.3.2 仅为原稿快照，不称当前最新版；内部 CHANGELOG 链接仅保留文件名与说明，不发布可点击内网路径。非技术群联系/二维码按要求移除。

全部来源文件与 SHA256 见 SOURCE-INVENTORY.json。原 PDF 不修改。封面日期、密级、声明、联系信息、读者对象、文档修订记录不进入文章；必要技术版本、软件变更及代码内部注释/署名不按封面声明批量删除。

## 验证与边界

- 20 个真实 Jekyll 页面均已在本地浏览器打开；顶栏四语切换对应同一主题，目录条目与正文标题数量一致。
- 原始 PDF 的 SHA256 全部未变；本批英俄德代码块、图片 URL、标题层级及表格形状一致性检查通过。全站 89 篇德文与英文的代码、图片、表形及标题层级检查通过。
- 构建成功；全部 20 页的代码逐块渲染内容、表格/图片/标题数量及站内链接/锚点检查通过。113 个独立配图 URL 本地 HTTP 200；20 页无意外 X-Robots-Tag 禁止标记。
- 四语搜索数据各 89 篇，新文章各存在一次；浏览器实际提交 20 次检索，五篇在四语文章库均返回正确文章链接。
- sitemap 中新增 20 个正式 HTTPS URL 各出现一次，无重复、localhost、Markdown 源文件或校对记录；新文章无无依据的 lastmod。
- 20 页 canonical 自指正式地址；hreflang 相互对应、包含自身与四语，x-default 指向英文对应页。
- 保留既有 robots.txt 和 Google 验证文件；检查未发现正文/图片抓取被禁，验证文件与源字节一致。未修改爬虫、验证、DNS 或搜索引擎设置。
- 桌面 20 页未出现整页横向溢出；RKNN 原框图浅色背景下标签和比例正常。代表性手机宽度 390px 下，088 德文目录可折叠，长表格和代码块在自身范围横向滚动；090 与 089 德文实测目录跳转及当前位置高亮正常。
- 浏览器交互验证为本地软件页面验证，不等同于实体手机逐机测试或 ArmSoM 硬件验证。未对生产部署响应头作新批次验收，因为本批未发布。
- 所有板卡/BSP、内核驱动、原文疑点及代码执行仍需针对真实硬件核对；没有编造性能数据、收录或排名结果。验收时尚未 commit、push 或发布；用户随后已授权发布。

机器检查证据：SOURCE-QA.json、SITE-QA.json、HTTP-QA.json、BROWSER-QA.json。详细源疑点以各篇校对记录为准。

各篇完整校对记录位于 `docs/rockchip-linux-memory-allocator/EDITORIAL-NOTES.md`、`docs/rockchip-sd-card-boot/EDITORIAL-NOTES.md`、`docs/rockchip-sdmmc-sdio-emmc/EDITORIAL-NOTES.md`、`docs/rockchip-mpp/EDITORIAL-NOTES.md`、`docs/rockchip-rknn-software-stack/EDITORIAL-NOTES.md`。


