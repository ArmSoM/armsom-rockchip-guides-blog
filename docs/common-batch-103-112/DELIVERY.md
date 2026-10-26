# 103–112 本地交付与验收记录

日期：2026-10-23。10 个主题，中文、英文、俄文、德文共 40 篇。仅保存仓库与本地预览；本批未 commit、push、部署或提交搜索引擎。此前 098–102 本地文件保留。

## 文章与预览

| 编号 | 主题 | 本机预览 |
| --- | --- | --- |
| 103 | Flash Open Source | [中文](http://127.0.0.1:4016/zh/articles/103-rockchip-flash-open-source/) · [EN](http://127.0.0.1:4016/articles/103-rockchip-flash-open-source/) · [RU](http://127.0.0.1:4016/ru/articles/103-rockchip-flash-open-source/) · [DE](http://127.0.0.1:4016/de/articles/103-rockchip-flash-open-source/) |
| 104 | SATA | [中文](http://127.0.0.1:4016/zh/articles/104-rockchip-sata/) · [EN](http://127.0.0.1:4016/articles/104-rockchip-sata/) · [RU](http://127.0.0.1:4016/ru/articles/104-rockchip-sata/) · [DE](http://127.0.0.1:4016/de/articles/104-rockchip-sata/) |
| 105 | Secure Boot | [中文](http://127.0.0.1:4016/zh/articles/105-rockchip-secure-boot/) · [EN](http://127.0.0.1:4016/articles/105-rockchip-secure-boot/) · [RU](http://127.0.0.1:4016/ru/articles/105-rockchip-secure-boot/) · [DE](http://127.0.0.1:4016/de/articles/105-rockchip-secure-boot/) |
| 106 | UFS | [中文](http://127.0.0.1:4016/zh/articles/106-rockchip-ufs/) · [EN](http://127.0.0.1:4016/articles/106-rockchip-ufs/) · [RU](http://127.0.0.1:4016/ru/articles/106-rockchip-ufs/) · [DE](http://127.0.0.1:4016/de/articles/106-rockchip-ufs/) |
| 107 | PCIe 开发 | [中文](http://127.0.0.1:4016/zh/articles/107-rockchip-pcie/) · [EN](http://127.0.0.1:4016/articles/107-rockchip-pcie/) · [RU](http://127.0.0.1:4016/ru/articles/107-rockchip-pcie/) · [DE](http://127.0.0.1:4016/de/articles/107-rockchip-pcie/) |
| 108 | PCIe EP | [中文](http://127.0.0.1:4016/zh/articles/108-rockchip-pcie-ep/) · [EN](http://127.0.0.1:4016/articles/108-rockchip-pcie-ep/) · [RU](http://127.0.0.1:4016/ru/articles/108-rockchip-pcie-ep/) · [DE](http://127.0.0.1:4016/de/articles/108-rockchip-pcie-ep/) |
| 109 | PCIe EP 标准卡 | [中文](http://127.0.0.1:4016/zh/articles/109-rockchip-pcie-ep-standard-card/) · [EN](http://127.0.0.1:4016/articles/109-rockchip-pcie-ep-standard-card/) · [RU](http://127.0.0.1:4016/ru/articles/109-rockchip-pcie-ep-standard-card/) · [DE](http://127.0.0.1:4016/de/articles/109-rockchip-pcie-ep-standard-card/) |
| 110 | PCIe EP 标准卡 API | [中文](http://127.0.0.1:4016/zh/articles/110-rockchip-pcie-ep-standard-card-apis/) · [EN](http://127.0.0.1:4016/articles/110-rockchip-pcie-ep-standard-card-apis/) · [RU](http://127.0.0.1:4016/ru/articles/110-rockchip-pcie-ep-standard-card-apis/) · [DE](http://127.0.0.1:4016/de/articles/110-rockchip-pcie-ep-standard-card-apis/) |
| 111 | PCIe 性能 | [中文](http://127.0.0.1:4016/zh/articles/111-rockchip-pcie-performance/) · [EN](http://127.0.0.1:4016/articles/111-rockchip-pcie-performance/) · [RU](http://127.0.0.1:4016/ru/articles/111-rockchip-pcie-performance/) · [DE](http://127.0.0.1:4016/de/articles/111-rockchip-pcie-performance/) |
| 112 | PCIe 虚拟化 | [中文](http://127.0.0.1:4016/zh/articles/112-rockchip-pcie-virtualization/) · [EN](http://127.0.0.1:4016/articles/112-rockchip-pcie-virtualization/) · [RU](http://127.0.0.1:4016/ru/articles/112-rockchip-pcie-virtualization/) · [DE](http://127.0.0.1:4016/de/articles/112-rockchip-pcie-virtualization/) |

## 来源与校对

- 严格接续上批，按中文/英文 Common 合并目录顺序选择；17 份原稿共 721 页。全部原 PDF 哈希未变，来源见 SOURCE-INVENTORY.json。
- 完整正文和可编辑 Markdown、表格、代码保留；指定封面/法律/联系/读者对象/修订表移除。没有用整页图片代替正文。
- 中文通常使用中文原图，EN/RU/DE 使用英文原图。105 只有英文源，四语均用英文来源图；108、112 只有中文源，没有虚构英文图。104、110、112 无独立技术图；原稿截图本身可能含中文界面或标签，来源说明与实际一致。
- 修复内联灰底被误识别为表格导致的漏行、跨页代码/表格、标题断行、命令/文件路径/十六进制值软换行、意外 Markdown 表格及元数据 excerpt 警告。截图中可转录的配置另补可复制文本，原截图仍保留。
- 103 按用户确认以中文 NAND 命令单位为四语基准，并列注明英文稿相反单位，提醒核对实际 U-Boot 实现。107 补译中文独有 MSI 数量查询章节并标注来源。110 DESTORY/DESTROY 差异保留各自原稿并明确提示。
- 105 不可逆 eFuse/OTP、106 直接写盘 FIO、PCIe 寄存器/DMA/固件/复位示例只作为原厂参考，没有执行；不宣称 ArmSoM 实测、所有板卡适用或示例可直接部署。
- 各主题 EDITORIAL-NOTES.md 记录来源、图、恢复内容和原文疑点。自动计数/标识检查及重点原页复核不等同于第二轮逐页逐句全量独立复审。

## 已完成检查

- Jekyll 本地整站构建成功。40 个新语言页面与 95 个独立正文图片 URL 本地 HTTP 检查通过。
- 四语搜索各含 111 篇文章；新文章列表/搜索可发现。
- 新增页面 canonical 指向自身正式 HTTPS 地址；hreflang 正确包含四语和 x-default。每个新 URL 在 sitemap 中恰好出现一次，无 localhost、Markdown、校对记录或搜索数据冒充文章，无不可靠 lastmod。
- 正文标题、表格、配图数量与源文件一致，渲染代码与 Markdown 相同。图片存在且 alt 非空；静态目录/章节锚点和内部链接有效。
- EN/RU/DE 代码与图片 URL 一致；中英原稿代码存在差异的主题单独记录，不强行改成相同。所有德文文章的代码、图片、标题层级与表格结构对应英语版本。
- robots、页面 robots 与本地 HTTP 响应没有意外禁止正文/图片抓取；Google 验证文件保持不变。没有修改爬虫权限或检查生产站响应头。

证据：SOURCE-QA.json、SITE-QA.json、HTTP-QA.json、GERMAN-QA.json。

## 尚待完成

浏览器交互验收按用户“先完成文件检查，浏览器验收稍后”延期：宽屏目录当前位置高亮、手机折叠目录、代码/长表横向滚动、视觉比例及实际点击语言切换尚未逐页验收。静态检查不能替代这些交互检查。

调用应用内打开预览仅返回 queued，未据此声称页面已打开或视觉验收通过。可使用上方链接手动打开。

用户随后批准补齐文章库深分页。已复用原模板新增39个缺失分页：EN/ZH/RU 第4–13页、DE 第5–13页。四语各13页、共52页静态HTML与本地HTTP 200检查通过；每语111篇文章按既有顺序全部覆盖，无重复或遗漏；所有分页链接、当前页标记、canonical、四语hreflang及sitemap检查通过。详见 LIBRARY-QA.json。未改变分页模板或JavaScript机制，未提交或发布。以后每语文章超过117篇时，仍需按现有静态方式补第14页；本次未引入新的自动生成机制。

原文单位、硬件常量、DTS 语法、BAR 大小、工具版本、API 拼写与测试日志疑点见各篇记录；SDK/BSP、SoC、板卡布线/供电和硬件行为未经 ArmSoM 实测。不承诺 Google 收录、排名或 AI 引用。等待用户另行指令再提交/发布。
