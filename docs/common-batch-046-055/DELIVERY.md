# Common 046–055 本地交付记录

## 范围与状态

按中文/英文 Common 合并目录的相对路径排序，去掉文件名末尾语言后缀后合并对应主题，承接上一批 eDP，包含仅中文资料。共 14 份 PDF、593 页，整理为 10 个主题、30 个完整中英俄 Markdown 页面。正文、表格和命令可编辑复制，不以整页图片代替正文。用户于 2026-10-16 授权全部提交，本批按 046–055 顺序、每篇独立创建本地 commit；未 push、未发布，未操作 Search Console 或 DNS。推送与发布等待用户通知。

## 文章与预览

| 编号 | 主题 | 来源版本 | 本地页面 | 校对记录 |
| --- | --- | --- | --- | --- |
| 046 | RK3588 HDCP | CN/EN V1.0.0 | [中文](http://127.0.0.1:4004/zh/articles/046-rockchip-rk3588-hdcp/) · [EN](http://127.0.0.1:4004/articles/046-rockchip-rk3588-hdcp/) · [RU](http://127.0.0.1:4004/ru/articles/046-rockchip-rk3588-hdcp/) | [记录](../rockchip-rk3588-hdcp/EDITORIAL-NOTES.md) |
| 047 | HDMI | CN V1.2.0 | [中文](http://127.0.0.1:4004/zh/articles/047-rockchip-hdmi/) · [EN](http://127.0.0.1:4004/articles/047-rockchip-hdmi/) · [RU](http://127.0.0.1:4004/ru/articles/047-rockchip-hdmi/) | [记录](../rockchip-hdmi/EDITORIAL-NOTES.md) |
| 048 | HDMI-CEC | CN V1.1.0 | [中文](http://127.0.0.1:4004/zh/articles/048-rockchip-hdmi-cec/) · [EN](http://127.0.0.1:4004/articles/048-rockchip-hdmi-cec/) · [RU](http://127.0.0.1:4004/ru/articles/048-rockchip-hdmi-cec/) | [记录](../rockchip-hdmi-cec/EDITORIAL-NOTES.md) |
| 049 | LVDS | CN/EN V1.2.0 | [中文](http://127.0.0.1:4004/zh/articles/049-rockchip-lvds/) · [EN](http://127.0.0.1:4004/articles/049-rockchip-lvds/) · [RU](http://127.0.0.1:4004/ru/articles/049-rockchip-lvds/) | [记录](../rockchip-lvds/EDITORIAL-NOTES.md) |
| 050 | MIPI DSI2 | CN V2.3.0 | [中文](http://127.0.0.1:4004/zh/articles/050-rockchip-mipi-dsi2/) · [EN](http://127.0.0.1:4004/articles/050-rockchip-mipi-dsi2/) · [RU](http://127.0.0.1:4004/ru/articles/050-rockchip-mipi-dsi2/) | [记录](../rockchip-mipi-dsi2/EDITORIAL-NOTES.md) |
| 051 | MIPI DSI 多供屏兼容 | CN V1.1.0 | [中文](http://127.0.0.1:4004/zh/articles/051-rockchip-mipi-panel-compatibility/) · [EN](http://127.0.0.1:4004/articles/051-rockchip-mipi-panel-compatibility/) · [RU](http://127.0.0.1:4004/ru/articles/051-rockchip-mipi-panel-compatibility/) | [记录](../rockchip-mipi-panel-compatibility/EDITORIAL-NOTES.md) |
| 052 | RGB/MCU | CN V1.7.1 | [中文](http://127.0.0.1:4004/zh/articles/052-rockchip-rgb-mcu/) · [EN](http://127.0.0.1:4004/articles/052-rockchip-rgb-mcu/) · [RU](http://127.0.0.1:4004/ru/articles/052-rockchip-rgb-mcu/) | [记录](../rockchip-rgb-mcu/EDITORIAL-NOTES.md) |
| 053 | RK628 For-All | CN V2.7 / EN V2.3 | [中文](http://127.0.0.1:4004/zh/articles/053-rockchip-rk628-porting/) · [EN](http://127.0.0.1:4004/articles/053-rockchip-rk628-porting/) · [RU](http://127.0.0.1:4004/ru/articles/053-rockchip-rk628-porting/) | [记录](../rockchip-rk628-porting/EDITORIAL-NOTES.md) |
| 054 | RK3588 Vsync | CN V1.2.0 | [中文](http://127.0.0.1:4004/zh/articles/054-rockchip-vsync-adjust/) · [EN](http://127.0.0.1:4004/articles/054-rockchip-vsync-adjust/) · [RU](http://127.0.0.1:4004/ru/articles/054-rockchip-vsync-adjust/) | [记录](../rockchip-vsync-adjust/EDITORIAL-NOTES.md) |
| 055 | DSMC | CN/EN V1.2.0 | [中文](http://127.0.0.1:4004/zh/articles/055-rockchip-dsmc/) · [EN](http://127.0.0.1:4004/articles/055-rockchip-dsmc/) · [RU](http://127.0.0.1:4004/ru/articles/055-rockchip-dsmc/) | [记录](../rockchip-dsmc/EDITORIAL-NOTES.md) |

## 图片与完整性处理

- 中文均使用中文 PDF 原图。有对应英文 PDF 的 HDCP、LVDS、RK628、DSMC，英文和俄文使用英文原图；其余六篇没有英文原图，三语沿用中文原图并本地化图注及 alt，正文明确披露。
- RK628 按用户确认采用中文 V2.7 全文为三语共同基准，补译 V2.3 未覆盖的新版内容。30 张技术图均找到对应英文原图，其中两个流程图中英顺序不同，已按内容匹配。
- 仓库保存 241 个图片文件（231 PNG、10 JPEG），页面共引用 561 次图片；三语页面合计 312 张可编辑表格、1536 个代码块。跨页代码和续表合并，因此数量不等同于 PDF 原始块数。LVDS 英文原稿重复放置同一幅图，文件保留，正文只显示一次。
- 修复提取乱码与部首异体、断行、跨页代码/表格、公式遗漏及截图文字转录；补齐 Vsync MSA 表的 HSyncWidth[14:0]。代码、路径、寄存器地址与参数保留原意，原稿矛盾不擅改。
- 指定封面/声明/联系信息/读者对象/修订记录未纳入文章；源码内必要署名、许可证和技术版本说明保留。
- 修复 Jekyll 未来日期隐藏文章、尖括号参数被解析为 HTML 导致正文截断、校对记录链接与实际输出路径不一致的问题。

## 原文疑点及适配边界

每篇记录含来源页码、版本差异与逐章校对。重点保留：HDCP TX/RX 与文件拼写疑点；HDMI 像素时钟数值解释冲突；CEC 事件/IOCTL 描述矛盾；DSI2 速率、属性名、阻值差异；多供屏补丁中的 status="disa"；RGB 帧率公式 ptotal/vtotal；RK628 阈值和平台列表不一致；Vsync EDID 原图底部截断与缺少具体写入值；DSMC 内核版本、API 返回值及地址映射疑点。详见各篇记录，不应将这些参数直接视为已验证配置。

全部文章区分原厂示例与 ArmSoM 适配，按平台参考表述。板卡接口、供电、设备树、SDK/BSP、内核及外设兼容性需实机核对；未执行硬件命令、未进行 ArmSoM 硬件测试，原图波形和日志不属于 ArmSoM 实测。

## 网站验证

- 使用现有三语集合及同主题 translation_key，没有重做切换、目录、搜索或 sitemap 机制；本批未生成德文正文，也未输出不存在的 de hreflang。
- 本地 Jekyll 构建成功，30 个页面均输出；canonical 各自指向正式 HTTPS 地址，en/zh/ru hreflang 自包含且互相对应，x-default 为英文。
- sitemap 中 30 个 URL 各出现一次，没有 localhost、Markdown、校对记录或临时页面混入。未新增构建时间型 lastmod。
- 30 个页面的正文图片路径、alt、内部链接、代码渲染一致性、表格数量、搜索索引均检查通过；正文无 noindex/nofollow。
- 本地 HTTP 检查共 287 个地址（文章、图片、校对记录、文章列表、搜索数据、sitemap、robots 与 Google 验证文件），全部返回 200；本地响应头未发现 noindex。该结果不代替正式站响应头验证。
- 浏览器打开全部 30 个页面，在 390×844 下检查无整页横向溢出，长代码支持横向滚动。RK628 代表页验证宽屏侧栏、目录跳转与当前位置高亮、手机折叠目录及长表格滚动；三语切换实际点击正确。目录与搜索实际查询 RK628 可找到新文章。
- 显示相关文章归入现有 media 分类，DSMC 归入 interfaces。robots.txt、Google 验证文件及现有配置没有修改。
- 原始 14 份 PDF SHA-256 与开工清单一致；已有受跟踪文件未改，本批仅新增文件。详细构建/HTTP 自动检查证据保存在工作目录 work/next-batch-*-check.json。
- 代码一致性按技术内容核查，不强求不同原稿的注释/日志语言一致：LVDS 差异仅注释及排版；多供屏文章仅流程图文字及一行操作说明本地化，DTS、完整补丁和实际命令一致。
- HDCP 与 DSMC 英文/俄文代码逐字一致；中文差异来自原稿注释、状态字符串与换行。DSMC 中文原稿 API 声明的全角分号与英文 ASCII 分号差异已记入校对记录；没有擅自改为已编译验证的示例。

## 尚未验证

未验证线上部署及线上 HTTP 响应头（本次未发布），未进行搜索引擎收录或排名验证，未做硬件验证。目录高亮与折叠为代表页交互测试，不宣称逐个章节都人工点击。手机图片路径及页面布局已检查，所有图的源裁剪校对记录见各主题。

本地服务：http://127.0.0.1:4004/ 。本报告不作为正式文章收录。

