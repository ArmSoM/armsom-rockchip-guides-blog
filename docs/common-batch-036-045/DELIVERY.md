# Common 036–045 批次交付与验收报告

## 范围与发布边界

按中英文 Common 合并目录顺序、对照既往文章记录选取本批 10 个独立主题；包括仅有中文的资料。输入共 16 份 PDF、856 页。原始 PDF 的 SHA-256 交付前复核全部一致，未修改原稿。

交付为中文、英文、俄文 30 篇完整 Markdown 文章、306 个独立原图资产、10 份逐篇校对记录。没有新增德文译文，也没有为不存在的德文版本输出 hreflang；顶部 DE 仍按原站规则进入德文首页，不代表有本篇德文译文。

按照用户后续授权，采用 036→045 的 10 次独立本地 commit，每个主题包含三语正文、配图和校对记录。036 同时包含本批验收发现的通用文章窄屏样式修复，045 同时包含本报告。未 push、创建 PR、正式发布、提交 Search Console/sitemap、请求收录或修改 DNS。

## 文章与本地预览

本机预览使用 Jekyll 实际构建产物，通过仅绑定 127.0.0.1 的 4003 端口提供；不是独立手写 HTML。表格数为每语言含技术前言表的实际 HTML 表格数；图片和代码数按“中文 / 英文 / 俄文”排列，公式也可能以代码块承载。

| 顺序 | 主题 | 预览 | 表格 | 图 | 代码/公式块 |
|---|---|---|---:|---|---|
| 036 | Crypto / HWRNG | [中文](http://127.0.0.1:4003/zh/articles/036-rockchip-crypto-hwrng/) · [EN](http://127.0.0.1:4003/articles/036-rockchip-crypto-hwrng/) · [RU](http://127.0.0.1:4003/ru/articles/036-rockchip-crypto-hwrng/) | 10 | 5 / 5 / 5 | 81 / 81 / 81 |
| 037 | DDR | [中文](http://127.0.0.1:4003/zh/articles/037-rockchip-ddr/) · [EN](http://127.0.0.1:4003/articles/037-rockchip-ddr/) · [RU](http://127.0.0.1:4003/ru/articles/037-rockchip-ddr/) | 28 | 31 / 33 / 33 | 244 / 253 / 253 |
| 038 | GNU MCU Eclipse OpenOCD | [中文](http://127.0.0.1:4003/zh/articles/038-rockchip-openocd/) · [EN](http://127.0.0.1:4003/articles/038-rockchip-openocd/) · [RU](http://127.0.0.1:4003/ru/articles/038-rockchip-openocd/) | 1 | 53 / 53 / 53 | 27 / 27 / 27 |
| 039 | BT.656 / BT.1120 TX | [中文](http://127.0.0.1:4003/zh/articles/039-rockchip-bt656-bt1120/) · [EN](http://127.0.0.1:4003/articles/039-rockchip-bt656-bt1120/) · [RU](http://127.0.0.1:4003/ru/articles/039-rockchip-bt656-bt1120/) | 9 | 6 / 6 / 6 | 11 / 11 / 11 |
| 040 | DisplayPort（中文新版基准） | [中文](http://127.0.0.1:4003/zh/articles/040-rockchip-displayport/) · [EN](http://127.0.0.1:4003/articles/040-rockchip-displayport/) · [RU](http://127.0.0.1:4003/ru/articles/040-rockchip-displayport/) | 10 | 17 / 17 / 17 | 100 / 100 / 100 |
| 041 | DP 信号测试 | [中文](http://127.0.0.1:4003/zh/articles/041-rockchip-dp-si-test/) · [EN](http://127.0.0.1:4003/articles/041-rockchip-dp-si-test/) · [RU](http://127.0.0.1:4003/ru/articles/041-rockchip-dp-si-test/) | 13 | 0 / 0 / 0 | 12 / 12 / 12 |
| 042 | RK3399 DisplayPort | [中文](http://127.0.0.1:4003/zh/articles/042-rockchip-rk3399-displayport/) · [EN](http://127.0.0.1:4003/articles/042-rockchip-rk3399-displayport/) · [RU](http://127.0.0.1:4003/ru/articles/042-rockchip-rk3399-displayport/) | 7 | 4 / 4 / 4 | 63 / 63 / 63 |
| 043 | DRM Direct Show | [中文](http://127.0.0.1:4003/zh/articles/043-rockchip-drm-direct-show/) · [EN](http://127.0.0.1:4003/articles/043-rockchip-drm-direct-show/) · [RU](http://127.0.0.1:4003/ru/articles/043-rockchip-drm-direct-show/) | 4 | 1 / 1 / 1 | 11 / 11 / 11 |
| 044 | DRM 显示驱动 | [中文](http://127.0.0.1:4003/zh/articles/044-rockchip-drm-display-driver/) · [EN](http://127.0.0.1:4003/articles/044-rockchip-drm-display-driver/) · [RU](http://127.0.0.1:4003/ru/articles/044-rockchip-drm-display-driver/) | 46 | 55 / 55 / 55 | 109 / 109 / 109 |
| 045 | eDP | [中文](http://127.0.0.1:4003/zh/articles/045-rockchip-edp/) · [EN](http://127.0.0.1:4003/articles/045-rockchip-edp/) · [RU](http://127.0.0.1:4003/ru/articles/045-rockchip-edp/) | 6 | 10 / 10 / 10 | 75 / 76 / 76 |

目录入口：[中文](http://127.0.0.1:4003/zh/library/) · [English](http://127.0.0.1:4003/library/) · [Русский](http://127.0.0.1:4003/ru/library/)。

## 来源、完整性及版本处理

- 有对应英文 PDF 的六个主题，中文用中文原图，英文和俄文用英文原图。仅中文的 OpenOCD、BT.656/BT.1120、DRM Direct Show 使用中文原图并本地化图注/alt；DP 信号测试原文无独立技术图，全部 13 张技术表恢复为可编辑内容。
- 不以整页 PDF 截图替代正文。技术章节、末章、跨页代码/表格、参数、地址、寄存器值、日志及必要说明均按源稿整理；源截图里的关键表格另提供可编辑转录。
- 去除封面发布日期、密级、免责声明、商标版权声明、原厂联系信息、读者对象、修订记录及静态目录；保留技术版本、技术来源、原代码的必要署名。
- DisplayPort 按用户明确选择，以较新的中文正文作为三语共同基准，补齐 SST/MST、dclk source、DP Status 等内容。中文封面 V1.3.0 与修订表 V1.3.3 冲突，英文为 V1.2.1，均在记录中说明。
- DDR 两份均 V2.7.2，但英文多一个切换工具英语界面的技术小节；各语言原稿章节保留，俄文完整跟随英文，因此标题/代码块数不同，不强行删减到相同数量。
- 其它中英技术差异按各篇记录保留，没有把不同版本的参数静默混用。

## 修复与疑点

本轮修复：中文兼容部首/乱码、自然语言断行、跨页代码与表格、合并单元格、图片跨页错配、遗漏矢量公式与栅格表转录。修复 Markdown 注释/图片后缺空行吞掉表格、裸 shell 管道被识别成假表格、分隔列表重新编号。所有修改均保留代码命令和参数含义。

通用样式仅调整文章区域：长技术标识符允许换行，表格中文字避免逐字挤压，长表和代码保留横向滚动；取消正文图片固定画框比例，按原图比例显示。未重写目录、语言切换、搜索或 sitemap 功能。

必须保留并继续核对的原文问题包括：

- Crypto：中英文 AEAD tag 参数输入/输出方向相反；部分 API 名和支持范围矛盾。
- DDR：容量/可用内存算式、4MB/512MB 示例、眼图 * 与 + 定义、源 PDF 本身丢失标记及工具路径矛盾。
- DisplayPort/eDP：带宽公式、最大高度、速率/带宽结论存在内部冲突。
- DP 信号测试：原稿本身有缺空格的寄存器命令、位宽/偏移/表头矛盾；原样保留并明确禁止直接照抄疑点命令。
- DRM 显示驱动：图层预算、600MHz 边界、PLL 分频和源路径拼写等疑点。
- OpenOCD：旧定制工具、历史安装源和未注释说明不可视为当前可直接执行指令。
- BT.656/BT.1120：大小写宏名、Y/UV 消隐值、summary 示例与接口格式有疑点。

每篇 `docs/<topic>/EDITORIAL-NOTES.md` 提供具体位置与处理方式。未执行硬件烧写、电压/寄存器修改、内存压力测试、ECC 注入等源命令；没有 ArmSoM 硬件实测。无法确认板级支持时标为平台参考；官方板卡资料仅用于已确认的 SoC 对应关系，不推断全部 SDK/BSP 兼容。

## 验收结果

| 检查 | 结果 |
|---|---|
| Jekyll 构建 | 成功；使用现有 Ruby/Bundler/Jekyll，不修改依赖和系统设置 |
| 三语实际页面 | 全部 30 页已在浏览器打开，标题/语言/目录存在 |
| HTTP | 30 页、306 图及索引/robots/验证文件等共 343 个请求，全部 HTTP 200 |
| 配图及站内链接 | 路径有效、alt 存在；未发现缺失本地链接 |
| 表格/代码 | 每篇表格数与源整理清单一致；全部代码块的 HTML 文本与 Markdown 逐字一致 |
| 语言切换 | 所有新页 EN/中文/RU 指向同一 translation_key；实际点击抽查通过 |
| 目录 | 复用已有动态目录；章节链接/当前位置高亮/手机展开交互抽查通过 |
| 窄屏 | 30 页逐页检查 390×844：无页面横向溢出、目录折叠、宽表和代码可滚动 |
| 列表和搜索 | 三语索引含本批 30 页；中文 Crypto 搜索实际返回新增文章 |
| sitemap | 30 个新增 URL 均各出现一次；正式 HTTPS 域名，无 localhost、MD、校对记录或临时预览页 |
| canonical / hreflang | 全部新页 canonical 指向自身；en/zh/ru 含自身且互相对应，x-default 指英文 |
| lastmod | 复用原机制，无可靠 last_modified_at 时不输出，不用构建时间伪造 |
| robots/验证配置 | 源文件未修改；本地响应无禁止抓取的 X-Robots-Tag，页面无 noindex/nofollow |
| 原稿保护 | 16 份原 PDF SHA-256 全部未变 |
| 外部副作用 | 未推送、发布、搜索引擎提交或修改 DNS |

本报告的 HTTP/响应头结论针对本地预览；正式托管环境响应头尚未验证。Google 收录、排名、AI 引用以及板级硬件适配均不在本地验收结果之内，不作保证。

## 再次启动预览

当前 4003 服务器在本机运行。若会话或电脑重启，应重新使用现有 Bundler/Jekyll 构建站点，再启动仅绑定本机的预览服务。不要为预览改写正式 url/canonical 配置，也不要因此推送代码。
