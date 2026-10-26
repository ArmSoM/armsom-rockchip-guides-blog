# 153–162 本地交付与验收

日期：2026-10-24。按中英文 Common 合并目录，接续 152；10 个主题、13 份 PDF、969 页，新增中文、英文、俄文、德文 40 篇全文。仅本地仓库与预览，没有 commit、push 或发布。此前未提交文章和无关修改保持不动。

## 主题与预览

| 编号 | 主题 | 本地预览 |
| --- | --- | --- |
| 153 | RK3576 待机 | [中文](http://127.0.0.1:4020/zh/articles/153-rockchip-rk3576-suspend/) · [EN](http://127.0.0.1:4020/articles/153-rockchip-rk3576-suspend/) · [RU](http://127.0.0.1:4020/ru/articles/153-rockchip-rk3576-suspend/) · [DE](http://127.0.0.1:4020/de/articles/153-rockchip-rk3576-suspend/) |
| 154 | RK3588 待机 | [中文](http://127.0.0.1:4020/zh/articles/154-rockchip-rk3588-suspend/) · [EN](http://127.0.0.1:4020/articles/154-rockchip-rk3588-suspend/) · [RU](http://127.0.0.1:4020/ru/articles/154-rockchip-rk3588-suspend/) · [DE](http://127.0.0.1:4020/de/articles/154-rockchip-rk3588-suspend/) |
| 155 | Linux UART | [中文](http://127.0.0.1:4020/zh/articles/155-rockchip-linux-uart/) · [EN](http://127.0.0.1:4020/articles/155-rockchip-linux-uart/) · [RU](http://127.0.0.1:4020/ru/articles/155-rockchip-linux-uart/) · [DE](http://127.0.0.1:4020/de/articles/155-rockchip-linux-uart/) |
| 156 | UART FAQ | [中文](http://127.0.0.1:4020/zh/articles/156-rockchip-uart-faq/) · [EN](http://127.0.0.1:4020/articles/156-rockchip-uart-faq/) · [RU](http://127.0.0.1:4020/ru/articles/156-rockchip-uart-faq/) · [DE](http://127.0.0.1:4020/de/articles/156-rockchip-uart-faq/) |
| 157 | U-Boot Nextdev | [中文](http://127.0.0.1:4020/zh/articles/157-rockchip-uboot-nextdev/) · [EN](http://127.0.0.1:4020/articles/157-rockchip-uboot-nextdev/) · [RU](http://127.0.0.1:4020/ru/articles/157-rockchip-uboot-nextdev/) · [DE](http://127.0.0.1:4020/de/articles/157-rockchip-uboot-nextdev/) |
| 158 | USB 初始化日志 | [中文](http://127.0.0.1:4020/zh/articles/158-rockchip-usb-initialization-log/) · [EN](http://127.0.0.1:4020/articles/158-rockchip-usb-initialization-log/) · [RU](http://127.0.0.1:4020/ru/articles/158-rockchip-usb-initialization-log/) · [DE](http://127.0.0.1:4020/de/articles/158-rockchip-usb-initialization-log/) |
| 159 | USB 性能分析 | [中文](http://127.0.0.1:4020/zh/articles/159-rockchip-usb-performance/) · [EN](http://127.0.0.1:4020/articles/159-rockchip-usb-performance/) · [RU](http://127.0.0.1:4020/ru/articles/159-rockchip-usb-performance/) · [DE](http://127.0.0.1:4020/de/articles/159-rockchip-usb-performance/) |
| 160 | Linux USB 开发指南 | [中文](http://127.0.0.1:4020/zh/articles/160-rockchip-linux-usb/) · [EN](http://127.0.0.1:4020/articles/160-rockchip-linux-usb/) · [RU](http://127.0.0.1:4020/ru/articles/160-rockchip-linux-usb/) · [DE](http://127.0.0.1:4020/de/articles/160-rockchip-linux-usb/) |
| 161 | USB2 合规测试 | [中文](http://127.0.0.1:4020/zh/articles/161-rockchip-usb2-compliance-test/) · [EN](http://127.0.0.1:4020/articles/161-rockchip-usb2-compliance-test/) · [RU](http://127.0.0.1:4020/ru/articles/161-rockchip-usb2-compliance-test/) · [DE](http://127.0.0.1:4020/de/articles/161-rockchip-usb2-compliance-test/) |
| 162 | USB FunctionFS Demo | [中文](http://127.0.0.1:4020/zh/articles/162-rockchip-usb-ffs-demo/) · [EN](http://127.0.0.1:4020/articles/162-rockchip-usb-ffs-demo/) · [RU](http://127.0.0.1:4020/ru/articles/162-rockchip-usb-ffs-demo/) · [DE](http://127.0.0.1:4020/de/articles/162-rockchip-usb-ffs-demo/) |

## 内容与来源

- 153/154 待机指南、155/156 UART、157 U-Boot、158–162 USB 均保留完整技术主文、代码、表格和必要注释，移除指定非技术章节。原始 PDF 哈希未变。
- 155、157、160 有中英文原稿；157/160 中文用中文原图、英俄德用英文原图，新增无对应图的来源在文章注明。其余仅中文原稿，有图时四语沿用中文图，不虚称英文原图；无图文档未虚构配图。
- 修复跨页代码、表格和长路径；恢复 U-Boot 的深层标题和矢量流程图、Linux USB 的 VBUS/ID 流程图、可编辑引脚与 VID/PID 表。修正正文管道符被误渲染为表格；代码中的管道符保持原值。
- U-Boot 中英同 V2.37.0，393 编号章节点及恢复后的深层标题逐项对应。俄德依据中文全文，英文保留自身来源的完整代码与注释。两个英文误识别代码表已恢复。不能将两版代码注释/分页不同误报为逐字相同。
- Linux USB 中文 V2.4.0、英文 V2.4.1 有实际正文差异，互补完整技术内容，并列保留控制器数量、带宽、PID 等冲突。四语各覆盖中英所有 224 个原始代码片段，逐片段来源、页码、哈希和位置见该篇 code-source-coverage.csv。英俄德代码集合（含重复次数）相同，章节顺序不同。
- RK3576 原表内核写 6.10、RK3588 TIME_OUT/MCU 宏、UART 阈值、U-Boot 固件名/属性、USB 性能示例命令与单位疑点均保留可追溯信息，详见各篇校对记录。未擅自调整硬件值。
- 适用范围均为原厂平台参考，不能外推为全部 ArmSoM 板卡已适配。性能和测试结果为原文示例，未做硬件验证，未运行烧写、擦除、OTP、调压或 USB 配置命令。

## 已完成检查

- Jekyll 构建成功；40 个新增语言页面及 116 个独立正文图片 URL 的本地 HTTP 检查通过。
- 全站 002–162 共 161 个主题、644 个语言页面，每种语言搜索条目 161 个；四语文章库各 18 页，72 页分页检查通过，补齐第 18 页，未另造分页逻辑。
- 复用已有 translation_key、语言切换、目录、搜索、分类和 sitemap；新增页面 canonical 指向自身正式 HTTPS 地址，hreflang 四语与 x-default 正确关联，sitemap 各 URL 一次，无本地地址、Markdown 或校对记录混入。
- 页面代码与 Markdown 渲染逐块对应，标题/表格/图片数量一致，图片和内部链接有效。未设置虚假 lastmod。robots、页面标签、本地 HTTP 头无意外禁爬，原验证文件未改。
- 全站德文无缺篇。157/160 的独立来源结构差异单独验算并保留原始严格比较结果，不用简单跳过掩盖问题；其余逐篇代码、图、标题、表格结构检查见证据。

## 尚未完成的验收边界

沿用此前“先文件检查，浏览器验收稍后”：浏览器实际点击、高亮、窄屏折叠/横向滚动和视觉排版仍待交互验收。静态与 HTTP 检查不能代替这些检查。未验证硬件/具体 BSP 或生产服务器响应头。源页和结构核对不等于全部 969 页的第二轮逐字人工复审。未向搜索引擎提交，不承诺收录、排名或 AI 引用。发布等待用户明确指令。

证据：SOURCE-INVENTORY.json、SOURCE-QA.json、SOURCE-RECONCILIATION.json、SITE-QA.json、HTTP-QA.json、GERMAN-QA.json、LIBRARY-QA.json；逐篇疑点与修复记录位于相应 docs 主题目录。
