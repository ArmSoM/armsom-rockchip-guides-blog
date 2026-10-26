# 123–132 本地交付与验收记录

日期：2026-10-23。按中英文 Common 合并目录顺序接续122，整理10个主题、14份PDF共425页，新增中英俄德40篇完整技术文章。只更新仓库文件与本地预览，没有commit、push、部署或搜索引擎提交；此前098–122和分页修改保留。

## 本批文章

| 编号 | 主题 | 本地预览 |
| --- | --- | --- |
| 123 | RK817 PMIC | [中文](http://127.0.0.1:4018/zh/articles/123-rockchip-rk817-pmic/) · [EN](http://127.0.0.1:4018/articles/123-rockchip-rk817-pmic/) · [RU](http://127.0.0.1:4018/ru/articles/123-rockchip-rk817-pmic/) · [DE](http://127.0.0.1:4018/de/articles/123-rockchip-rk817-pmic/) |
| 124 | RK818 PMIC | [中文](http://127.0.0.1:4018/zh/articles/124-rockchip-rk818-pmic/) · [EN](http://127.0.0.1:4018/articles/124-rockchip-rk818-pmic/) · [RU](http://127.0.0.1:4018/ru/articles/124-rockchip-rk818-pmic/) · [DE](http://127.0.0.1:4018/de/articles/124-rockchip-rk818-pmic/) |
| 125 | RK818/RK816 电量计开发 | [中文](http://127.0.0.1:4018/zh/articles/125-rockchip-rk818-rk816-fuel-gauge/) · [EN](http://127.0.0.1:4018/articles/125-rockchip-rk818-rk816-fuel-gauge/) · [RU](http://127.0.0.1:4018/ru/articles/125-rockchip-rk818-rk816-fuel-gauge/) · [DE](http://127.0.0.1:4018/de/articles/125-rockchip-rk818-rk816-fuel-gauge/) |
| 126 | RK818/RK816 电量计日志 | [中文](http://127.0.0.1:4018/zh/articles/126-rockchip-rk818-rk816-fuel-gauge-log/) · [EN](http://127.0.0.1:4018/articles/126-rockchip-rk818-rk816-fuel-gauge-log/) · [RU](http://127.0.0.1:4018/ru/articles/126-rockchip-rk818-rk816-fuel-gauge-log/) · [DE](http://127.0.0.1:4018/de/articles/126-rockchip-rk818-rk816-fuel-gauge-log/) |
| 127 | 功耗分析与优化 | [中文](http://127.0.0.1:4018/zh/articles/127-rockchip-power-analysis/) · [EN](http://127.0.0.1:4018/articles/127-rockchip-power-analysis/) · [RU](http://127.0.0.1:4018/ru/articles/127-rockchip-power-analysis/) · [DE](http://127.0.0.1:4018/de/articles/127-rockchip-power-analysis/) |
| 128 | Linux PWM | [中文](http://127.0.0.1:4018/zh/articles/128-rockchip-linux-pwm/) · [EN](http://127.0.0.1:4018/articles/128-rockchip-linux-pwm/) · [RU](http://127.0.0.1:4018/ru/articles/128-rockchip-linux-pwm/) · [DE](http://127.0.0.1:4018/de/articles/128-rockchip-linux-pwm/) |
| 129 | RGA IM2D API | [中文](http://127.0.0.1:4018/zh/articles/129-rockchip-rga-im2d-api/) · [EN](http://127.0.0.1:4018/articles/129-rockchip-rga-im2d-api/) · [RU](http://127.0.0.1:4018/ru/articles/129-rockchip-rga-im2d-api/) · [DE](http://127.0.0.1:4018/de/articles/129-rockchip-rga-im2d-api/) |
| 130 | RGA FAQ | [中文](http://127.0.0.1:4018/zh/articles/130-rockchip-rga-faq/) · [EN](http://127.0.0.1:4018/articles/130-rockchip-rga-faq/) · [RU](http://127.0.0.1:4018/ru/articles/130-rockchip-rga-faq/) · [DE](http://127.0.0.1:4018/de/articles/130-rockchip-rga-faq/) |
| 131 | RT-Thread CAN/CANFD | [中文](http://127.0.0.1:4018/zh/articles/131-rockchip-rtthread-can-canfd/) · [EN](http://127.0.0.1:4018/articles/131-rockchip-rtthread-can-canfd/) · [RU](http://127.0.0.1:4018/ru/articles/131-rockchip-rtthread-can-canfd/) · [DE](http://127.0.0.1:4018/de/articles/131-rockchip-rtthread-can-canfd/) |
| 132 | RT-Thread Display | [中文](http://127.0.0.1:4018/zh/articles/132-rockchip-rtthread-display/) · [EN](http://127.0.0.1:4018/articles/132-rockchip-rtthread-display/) · [RU](http://127.0.0.1:4018/ru/articles/132-rockchip-rtthread-display/) · [DE](http://127.0.0.1:4018/de/articles/132-rockchip-rtthread-display/) |

## 内容与来源

- 123/124分别为RK817、RK818；125/126为电量计开发和日志；127功耗；128PWM；129/130RGA API与FAQ；131/132RT-Thread CAN和显示。全部技术章节、代码、参数、表格、注释与独立技术图保留；指定非技术封面/声明/联系/读者/修订表内容移除。原始PDF哈希全部不变。
- 127–130有中英文稿：中文图取中文，EN/RU/DE取英文。123–126、131–132只有中文，四语使用中文图并明确说明；125/126/131无独立原图，不虚构配图。英文127连接照片自身有中文标签，未伪称标签全英文。
- 129虽同V2.2.7，中文OSD结构更全、部分API/结构定义不同。用户已批准中文完整内容作四语主线，并列保留英文差异；按实际SDK核对，不静默混用。
- 图片中的PMIC引脚/时序表、PWM功能矩阵与引脚表、RTT显示对齐/数据包/调光表恢复为可编辑表格；截图代码恢复为文本并保留原图。跨页表格、代码及软换行修复；代码许可证和必要署名不批量删除。
- 127的CPU配额注释与参数语义、DDR阈值注释、孤立`<`和效率排版疑点保留并提示；132矩阵顺序/定点结果、dsp路径、时序名称差异不猜改。125原稿OCV串接值、DTS标点与NTC数量疑点均可追溯。
- 131原can_tx参数覆盖、缺少边界检查等问题明确警示；不直接运行于生产或安全关键总线。所有硬件测量均标原稿数据，未声称ArmSoM实测或所有板卡支持。

详细来源、章节覆盖与疑点见各篇 docs/rockchip-*/EDITORIAL-NOTES.md；本批源码/站点/HTTP/德文/分页检查见旁边JSON证据。

## 已通过的验证

- Jekyll整站构建成功。新增40个语言页面及63个独立正文图片URL本地HTTP通过。
- 全站四语各131篇（编号002–132），共524个语言页面；德文无缺篇，全部131篇的代码、图URL、标题层级、表格形状与英文对应。
- 四语文章库各15页，共60页HTTP200，覆盖全部131个主题且无重复；按已有模板补齐第15页，未重写分页逻辑。
- 新文章进入列表、分类和搜索。复用顶部语言切换、侧边目录、站内搜索、sitemap机制，没有重复实现。
- canonical指向自身正式HTTPS URL；hreflang实际四语相互对应，含自身和既有x-default。sitemap新增URL各一次，无localhost/本地路径/Markdown/校对记录/搜索数据混入，无构建时刻伪造lastmod。
- 渲染代码与Markdown逐块一致，标题/表格/图片数量对应，图片有效且有alt，静态锚点及内部链接有效。
- robots、页面robots和本地HTTP头未发现意外禁止抓取；Google验证文件保留。没有改爬虫权限，未复查生产响应头。
- 修复125ZH寄存器位后括号被误当链接，以及PWM/RGA正文被错误识为表格等排版问题；不改技术值。

## 验收边界

依用户“先完成文件检查，浏览器验收稍后”，真实浏览器点击、目录当前位置高亮、窄屏折叠/横向滚动及视觉排版仍待交互验收，静态/HTTP通过不能替代。未执行硬件命令、总线发送、调压、关核、BSP适配或面板初始化。没有承诺Google收录、排名或AI引用。

全文、源页重点与结构/数值检查已完成；自动检查不等于第二次逐字符人工视觉复审。发布等待明确指令。
