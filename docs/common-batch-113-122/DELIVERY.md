# 113–122 本地交付与验收记录

日期：2026-10-23。本批10主题、13份PDF共187页，按中英文 Common 合并目录顺序接续112；新增中文、英文、俄文、德文共40篇。仅仓库文件和本地预览，未commit、push、部署或操作搜索引擎。此前098–112文件及分页修改保留。

## 本批文章

| 编号 | 主题 | 本地预览 |
| --- | --- | --- |
| 113 | RK3399 PCIe | [中文](http://127.0.0.1:4017/zh/articles/113-rockchip-rk3399-pcie/) · [EN](http://127.0.0.1:4017/articles/113-rockchip-rk3399-pcie/) · [RU](http://127.0.0.1:4017/ru/articles/113-rockchip-rk3399-pcie/) · [DE](http://127.0.0.1:4017/de/articles/113-rockchip-rk3399-pcie/) |
| 114 | Linux RealTime 性能测试报告 | [中文](http://127.0.0.1:4017/zh/articles/114-rockchip-realtime-performance/) · [EN](http://127.0.0.1:4017/articles/114-rockchip-realtime-performance/) · [RU](http://127.0.0.1:4017/ru/articles/114-rockchip-realtime-performance/) · [DE](http://127.0.0.1:4017/de/articles/114-rockchip-realtime-performance/) |
| 115 | Linux 性能分析 | [中文](http://127.0.0.1:4017/zh/articles/115-rockchip-linux-performance-analysis/) · [EN](http://127.0.0.1:4017/articles/115-rockchip-linux-performance-analysis/) · [RU](http://127.0.0.1:4017/ru/articles/115-rockchip-linux-performance-analysis/) · [DE](http://127.0.0.1:4017/de/articles/115-rockchip-linux-performance-analysis/) |
| 116 | Linux Pinctrl | [中文](http://127.0.0.1:4017/zh/articles/116-rockchip-linux-pinctrl/) · [EN](http://127.0.0.1:4017/articles/116-rockchip-linux-pinctrl/) · [RU](http://127.0.0.1:4017/ru/articles/116-rockchip-linux-pinctrl/) · [DE](http://127.0.0.1:4017/de/articles/116-rockchip-linux-pinctrl/) |
| 117 | RK801 PMIC | [中文](http://127.0.0.1:4017/zh/articles/117-rockchip-rk801-pmic/) · [EN](http://127.0.0.1:4017/articles/117-rockchip-rk801-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/117-rockchip-rk801-pmic/) · [DE](http://127.0.0.1:4017/de/articles/117-rockchip-rk801-pmic/) |
| 118 | RK805 PMIC | [中文](http://127.0.0.1:4017/zh/articles/118-rockchip-rk805-pmic/) · [EN](http://127.0.0.1:4017/articles/118-rockchip-rk805-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/118-rockchip-rk805-pmic/) · [DE](http://127.0.0.1:4017/de/articles/118-rockchip-rk805-pmic/) |
| 119 | RK806 PMIC | [中文](http://127.0.0.1:4017/zh/articles/119-rockchip-rk806-pmic/) · [EN](http://127.0.0.1:4017/articles/119-rockchip-rk806-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/119-rockchip-rk806-pmic/) · [DE](http://127.0.0.1:4017/de/articles/119-rockchip-rk806-pmic/) |
| 120 | RK808 PMIC | [中文](http://127.0.0.1:4017/zh/articles/120-rockchip-rk808-pmic/) · [EN](http://127.0.0.1:4017/articles/120-rockchip-rk808-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/120-rockchip-rk808-pmic/) · [DE](http://127.0.0.1:4017/de/articles/120-rockchip-rk808-pmic/) |
| 121 | RK809 PMIC | [中文](http://127.0.0.1:4017/zh/articles/121-rockchip-rk809-pmic/) · [EN](http://127.0.0.1:4017/articles/121-rockchip-rk809-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/121-rockchip-rk809-pmic/) · [DE](http://127.0.0.1:4017/de/articles/121-rockchip-rk809-pmic/) |
| 122 | RK816 PMIC | [中文](http://127.0.0.1:4017/zh/articles/122-rockchip-rk816-pmic/) · [EN](http://127.0.0.1:4017/articles/122-rockchip-rk816-pmic/) · [RU](http://127.0.0.1:4017/ru/articles/122-rockchip-rk816-pmic/) · [DE](http://127.0.0.1:4017/de/articles/122-rockchip-rk816-pmic/) |

## 提取与校对

- 完整技术正文、步骤、代码、参数、表格、原图和必要注释纳入四语Markdown；删除指定封面法律/联系/读者/修订表内容。技术适用范围和版本保留；原PDF哈希全部未变。
- 114、116、117有中英文对应稿；116以用户批准的中文为基准补齐四语，并列说明索引范围、驱动强度世代与文件标识冲突。114保留RK3568前言4.19与测试表5.10差异，全部测试数据标明来自原厂而非ArmSoM。
- 113、115、118–122只有中文PDF，四语使用中文原图，明确说明没有英文图。116、117中文用中文图，EN/RU/DE用英文图；114没有独立技术图，不虚构配图。
- 修复PDF软换行、跨页代码、误判为表格的DTS、列表/标题粘连和宏续行；恢复图片内引脚表、供电/时序参数及113两张性能表为可编辑表格，原图仍保留。
- 113所有11项FAQ、fio完整命令和性能表恢复；115的atrace.h、trace.h、trace.c三个附录保留至末尾；原代码中的许可证、版权头和必要署名不批量删除。
- 原稿供电引用、0.737.5、PMIC电压范围/时序表、设备地址等疑点不猜改。113升压陈述旁明确禁止超过器件额定；115除零/整数精度、TRACE_ON默认关闭和错误处理问题单独提示。详见各篇EDITORIAL-NOTES.md。
- 代码与参数按源稿保留；117中文与英文原稿代码存在差异，不强行统一，EN/RU/DE相互一致。图注和正文本地化，不翻译API标识符。

## 已通过的文件、构建和HTTP检查

- Jekyll整站构建成功；本批40个语言页面、44个独立正文图片URL本地HTTP检查通过。
- 四语各121篇，编号002–122；德文无缺篇。所有121篇德文的代码、图URL、标题层级与表格形状和英文对应。
- 四语文章库各14页，共56页本地HTTP200，覆盖121篇且无重复。复用既有模板补齐第14页，没有重写分页。
- 本批canonical指向自身正式HTTPS地址，hreflang关联实际四语并包含x-default。sitemap每个新增URL恰好一次，无localhost/Markdown/校对记录/搜索数据冒充文章，无凭空lastmod。
- 新文章进入对应列表与搜索。渲染后的代码与Markdown内容一致，标题、表格、图片数量对应，图片alt和文件有效，内部链接及静态锚点有效。
- robots、页面robots与本地HTTP头未发现意外禁抓；Google验证文件保持原样。未更改爬虫权限，未验证生产响应头。

证据文件：SOURCE-QA.json、SITE-QA.json、HTTP-QA.json、GERMAN-QA.json、LIBRARY-QA.json、SOURCE-INVENTORY.json。

## 保留的验收边界

按用户“先完成文件检查，浏览器验收稍后”，真实浏览器点击、当前位置高亮、窄屏折叠目录/横向滚动和视觉排版尚待交互验收。静态结构与本地HTTP通过不等于这些项目通过。未执行硬件命令、供电修改、写盘或BSP适配测试；未声称所有ArmSoM板卡支持或已获Google收录。

全文和原页重点核对、结构与数值检查已完成，但自动检查不等同于第二次逐字符人工视觉复审。发布仍等待用户明确指令。
