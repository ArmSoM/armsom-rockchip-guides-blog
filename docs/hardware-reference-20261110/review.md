> **2026-11-10 续发验收更新：** 下文保留第一批本地审核时的历史记录。RK3528、RK3568、RK730 总览及后续专题已在提交 `7843562` 发布。本轮按用户新授权提交剩余 5 个新主题与 2 个更新主题，共 28 个四语页面、22 个图像文件及校对记录。正文使用其中 18 张图，其余 4 张保留作该批来源图；未重复创建已上线的总览。
>
> 最终完整构建成功（350.753 秒）；28 页的四语关联、链接、搜索、canonical、hreflang、sitemap、图片和本地 HTTP 检查通过。站内搜索 2206 条，sitemap 2458 个 URL；10 份原始 PDF 哈希不变。浏览器抽查目录跳转/高亮、手机折叠目录、长表格滚动及四语切换正常。当前检查基于本机最终构建；线上验证在推送后另行完成。详见 `release-build-checks.json`、`release-source-checks.json`、`release-browser-checks.json`。

# 硬件资料第一批 10 项校对与交付记录

日期：2026-11-10。范围：原先推荐的 10 份 PDF，合计 414 页，排除 SR3050。8 个新增专题、2 个已有专题扩充，共 40 个中英俄德页面。

## 编辑范围

本批采用推荐的选型／设计／调试专题解读方式，不是将 414 页逐页翻译，也不声称完整重刊引脚表、寄存器表或所有测量截图。已提取所有原稿页面供查证；正文围绕各专题形成可复制的段落、技术表格、参数与必要命令。原图是正文的补充，不代替文字。已有 Forge1 应用与量产检查表保留原网址、原技术正文和原有图片。

没有原厂封面声明、联系方式、读者对象或修订记录的整段转载。必要版本差异与技术变更单独说明。图片中的技术标记和原有水印保留。原始 PDF 未修改，也未新增公开 PDF 下载。

## 文章映射

| 项 | 文章（四语同一 translation_key） | 处理 | 来源 |
| --- | --- | --- | --- |
| 1 | RK3568 Datasheet V1.2 解读：从接口资源到 ArmSoM Sige3 项目选型 (`rk3568-datasheet-v12`) | 新增 | `Rockchip RK3568 Datasheet V1.2-20210601.pdf` |
| 2 | RK3528 Datasheet V1.0 解读：用 ArmSoM Sige1 规划媒体与轻量 Linux 应用 (`rk3528-datasheet-v10`) | 新增 | `Rockchip RK3528 Datasheet V1.0-20230522.pdf` |
| 3 | RK730 音频 Codec 设计解读：麦克风、I2S 时钟与差分输出 (`rk730-audio-codec-design`) | 新增 | `Rockchip RK730 Datasheet V1.0-20241118.pdf` |
| 4 | forge1-industrial-hmi-gateway (`forge1-industrial-hmi-gateway`) | 补充原文，保留网址 | `RK3506 产品应用方案介绍_V1.2.2_20240903(1).pdf` |
| 5 | RK3588 硬件测试报告怎么读：电源、DDR 与高速接口的验证路线 (`rk3588-hardware-test-report`) | 新增 | `RK3588_HW_Test_Report_Summary V1.3_20230215.pdf` |
| 6 | rockchip-hardware-production-checklist (`rockchip-hardware-production-checklist`) | 补充原文，保留网址 | `RK3588 Production Process Requirements V1.0_20230215.pdf` |
| 7 | RK3588 NVR 参考设计：10 路 SATA、多屏与视频采集怎样落到产品 (`rk3588-nvr-reference-design`) | 新增 | `Rockchip_RK3588_NVR_User_Guide_V1.0_CN_20220421.pdf` |
| 8 | RK3576 EVB1 调试指南：下载模式、接口复用与 CM5／Sige5 迁移核对 (`rk3576-evb-interface-debugging`) | 新增 | `Rockchip_RK3576_EVB1_User_Guide_V1.0_CN.pdf` |
| 9 | RK3568 EVB 调试与接口核对：从下载串口到 Sige3 项目验证 (`rk3568-evb-interface-debugging`) | 新增 | `Rockchip_RK3568_EVB_User_Guide_V1.0_CN.pdf` |
| 10 | RK3506G EVB1 调试参考：从显示、CAN 到 CM1／Forge1 适配边界 (`rk3506g-evb-interface-debugging`) | 新增 | `Rockchip_RK3506G_EVB1_User_Guide_V1.0_20240719_CN.pdf` |

## 原稿疑点和处理

- RK3568 Datasheet：PDF p.56 CPU/GPU 最大频率为 TBD；p.18 多种内存类型不同时使用，双 MIPI 与 LVDS 互斥。将 SoC 与 Sige3/RK3568B2 配置分开；没有补写频率或工业温度承诺。
- RK3528 Datasheet：p.13 USB/PCIe 两种组合保留；PCIe2.1 标题与 Base Specification 3.0 措辞不一致，实际列速率 2.5/5.0Gbps，不升级宣称 Gen3。p.10 HDMI 原文 10.2bps 不猜测补单位。p.23 TBD/NA 与 p.28 结温条件分别说明。没有虚构 NPU。
- RK3506 应用方案：文件名 V1.2.2/20240903 与封面 2024.08.29 并列保留；G2/B/J 分开。p.19 软件视频与双核 90% CPU 开销同时出现；p.22–24 中断响应、cyclictest 延迟和 EtherCAT 抖动为不同条件；p.28–29 SoC、输入端及外设功耗边界分开，不作 ArmSoM 实测。
- RK730：p.8 ADC 动态范围 100dB 与 p.14 101dB 分别记录；不同于早期 RK3506 介绍的值，不混用。p.16 的 2.822MHz、24MHz/BCLK 按原稿保留并待确认。p.17 ROUT2/Rout2 负载文字疑似笔误，p.13 I2C 时钟脚 O 方向及 SCL/SCLK 名称差异注明。未生成未经验证的寄存器写入脚本，未宣称 CM1/Forge1 默认搭载 RK730。
- RK3588 测试报告：文件名 V1.3_20230215，封面 V1.2_20220829；修订表追加 V1.3/p.44 RGMII。23 类测试均覆盖在方法表中；原始 Pass/波形不写成 ArmSoM 测试结论。50Ω 测量设置保留条件；RTL8211 接收时钟来源说明不等于免除整机验证。
- RK3588 工艺：与 RK3576 的保温时间、液相以上时间、钢网厚度不同，不混成统一工艺。p.8 “方形开窗”与“直径”矛盾保留。p.7 MSL 3/168h 与 6h 条件待确认，MSL1 的 ≤300℃ 绝不作为存储建议。裸芯片烘烤参数不应用到完整模组。
- RK3588 NVR：10 个 SATA 端口由 2 颗 JMB575 扩展，非 10 个原生控制器。p.12 三路 HDMI 与 p.13 功能列表合计四路不一致，不宣称任意四屏并发；桥接与原生输出分别列出。IT6161 的 0x98 不擅自改成 7-bit 地址；p.49 RK3588S EVB 字样记为模板残留。
- RK3576 EVB：x4 外形插槽的表中实际链路为 1 lane，与 USB3 Host 互选。DCPHY 概述 1×3 trios 与后文说法差异按原理图待确认。I2C TBD 保留；USB 唤醒电阻、JTAG/SD、CAN/SD、风扇 Sensor 功能条件不省略。EVB 的 UFS/供电不移植给 CM5/Sige5。
- RK3568 EVB：UART 1.5M、RTS/CTS 条件保留；Loader SARADC_VIN0、Maskrom eMMC_D0 为原厂参考，不指导任意板短接。Rcovery 拼写、p.17–18 RK3399 页眉标注。SATA 默认供电路径、音频开关和 I2C 电平明确仅适用原 EVB。
- RK3506G EVB：G 与 CM1/Forge1 的 J 版本分开。eMMC_D3 的 R1146→R1143 保留不猜改；Wi-Fi 1T21/1T1R 差异、末页 RK3576 页眉及 UART/JTAG 图注错误记录。两个 JTAG 接口 TMS/TCK 位置差异保留。

## 配图与语言

新增 22 个图片文件。RK3568/RK3528/RK730 原稿为英文，四语均用对应英文原图；其余 7 份为中文原稿，本批未找到匹配英文图，英俄德也使用中文原图，并在每张图注明确说明。图注、alt 和正文均按语言本地化。详细文件、物理 PDF 页码和裁切范围见 figures.json。

全部图片经接触表目视检查，修正了初次裁切中靠近边缘的标题／连接器标签，保留图例和比例；正文可点击打开原分辨率图片。重排表格为 Markdown，命令、寄存器/地址、网络名、元件编号保持原文。四语代码块一致；逐篇核对技术值。数字计数的差异仅来自自然语言“一/one”等写法和型号重复次数，不作为硬件差异。

## ArmSoM 关联和来源

2026-11-10 读取官方产品文档核对芯片归属：Sige3/RK3568B2、Sige1/RK3528、CM1/Forge1/RK3506J、CM5/Sige5/RK3576、AIM7/Sige7/LM7/RK3588。各文提供 www.armsom.org 产品页和 docs.armsom.org 对应文档链接。参考 EVB 的输入电压、引脚、BOM、内存、接口数量和软件环境不作为这些产品的默认配置。

本批未进行硬件、电气、产线或性能验证。BSP、内核和驱动适配依实际版本确认；没有臆造实测值或收录/排名结果。

## 网站接入及验收

复用现有 collection、translation_key、四语顶部切换、目录、搜索、分类、SEO 和 sitemap。新增第 61 页目录模板各语一份。更新两主题的 last_modified_at 为实际编辑日；新增文章不制造 lastmod。未改 robots.txt、站点验证文件、布局或爬虫权限。

构建、HTTP、SEO、图片与浏览器验收结果另存 build-checks.json / browser-checks.json。当前版本仅供本地审核；没有 commit、push、部署或搜索引擎提交。

### 本地验收结果

- 完整生产模式 Jekyll 构建成功（330.683 秒）；预览仅绑定 `127.0.0.1:4039`。
- 40 篇语言页面、22 张新增图、四语第 61 页、搜索/地图/验证文件的 70 个 HTTP 目标均返回 200。仅验证本机响应，未宣称生产响应头已经改变。
- 40 页的 canonical 均指向自身正式 HTTPS URL；hreflang 含四语自身和英文 x-default；语言互相对应。
- 搜索索引含 2166 个条目，本批 40 页各出现一次；sitemap 共 2418 个 URL，无重复或本地地址，本批 40 页各出现一次；新文章不虚构 lastmod，2 个更新主题使用实际编辑日期。
- 40 页以 390×844 窄屏逐页核对，均无页面水平溢出；表格/代码维持独立滚动，图片未发现加载错误；每页目录条目与正文标题对应。桌面侧栏与手机折叠目录均实际点击验证，跳转和高亮正常。
- 实际点击 EN→RU→DE 验证对应文章切换；文章库搜索 RK730 找到新增专题；第 61 页静态入口与分页正常；抽查浏览器无脚本错误。
- 原始 PDF 哈希保持不变，原有文章段落保留，robots 与站点验证配置未改。无 commit、push 或发布。

注意：这批是按专题编写的技术解读，不是 414 页逐字全文翻译；未进行板端实测。前述版本冲突、电气/工艺疑点和实际产品适配仍需对应原理图、BSP 或厂家确认。
