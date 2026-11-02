# RK3588S / CM7S / Sige7S 编辑与校对记录

日期：2026-11-01。范围：4 个主题 × 中英俄德，共 16 篇文章。本批仅本地预览，未授权发布。

## 来源
- 用户提供 Rockchip RK3588S Datasheet V1.3-20220310.pdf，35 页。原文件不改；仓库下载副本 SHA256 见 source-manifest.json。
- https://docs.armsom.org/armsom-cm7s
- https://docs.armsom.org/armsom-sige7s
- https://www.armsom.org/cm7s
- https://www.armsom.org/sige7s
- https://github.com/airockchip/rknn-toolkit2
- https://github.com/rockchip-linux/rknpu2 （维护迁移说明）
- 检索到第三方 V1.5 datasheet 镜像，但未混入 V1.3 参数，也未宣称 V1.3 为最新版。

## 内容范围
前三篇是原创推广/选型/应用规划，四语对应；第四篇为四语 datasheet 阅读指南，**不是 datasheet 四语全文翻译**。另提供原始 PDF 和第 6–35 页英文技术正文 Markdown 附件。技术附件是提取参考，复杂合并单元格应回查 PDF；不将自动提取冒称人工逐格电气审定。
附件保留章节、参数和可编辑表格。封面、修订表、免责声明、重复页眉页脚不进入提取文本。原始 PDF 完整保留。

## 配图
- block-diagram.png：PDF p16，矢量图按 3× 渲染后裁出图区域。
- top-marking.png：PDF p17，两种封装标记。
- package-top-bottom.png：PDF p18。
- package-side-dimensions.png：PDF p19。尺寸表原稿为图片，随图保留，未伪称为可编辑表格。
- cm7s.jpg：https://docs.armsom.org/assets/images/armsom-cm7s-692b6e980bedf1bec080f966a691987e.jpg
- sige7s.png：https://docs.armsom.org/assets/images/sige7s-bananer-a5c402679af5775255152af37f8f3492.png
- 四语共用英文原图，图注及 alt 本地化；未生成虚构产品图。

## 原稿及官网疑点
1. PDF 封面 V1.3，p20 起页眉 V1.2。
2. p15 功能列表 5 SPI，p16 框图 6 SPI；未代为选择。
3. p11 HDMI/eDP 数量与 p16 框图需要 TRM 核对，不据此承诺板卡双输出。
4. p34 Table 3-10 重复，图索引与正文编号不一致。
5. p31 频率 TBD 不用产品页频率回填。
6. 负电流 Min/Max 与 PHY 重复行按原稿保存；未推断条件。
7. p35 θJC=0.01 °C/W 按原稿保留。参考仿真条件不是 ArmSoM 整机散热测试。
8. Sige7S 文档 92×62×14.6 与 85×56×17 尺寸冲突，主产品页写 85×56；正文要求核对机械文件，不选择冲突值。
9. CM7S v1.1 CN2 第 2/4 脚限制按文档提醒，不假定已修复。
10. CM7S-IO 12V 与模块 5V 分开说明；不将底板供电推广为模块供电。
11. 产品页、文档的 RAM/eMMC SKU、GPU API 有不同描述；正文以实际交付和驱动为准，不做库存承诺。

## 验证边界
没有硬件测量、功耗/模型帧率测试或客户案例证据。应用文章写作开发规划。构建与静态链接检查另存 preview-qa.json。既有分页四文件修改保留，未纳入本批内容。

引脚表检查：第 20–28 页提取到 1,253 个条目、1,253 个唯一位置，全部在英文附件中。修复 OpenGL 3.2 与 xHCI Revision 1.1 断行被误判为标题的问题。

## 本地验收结果
Jekyll production 构建成功（322.783 秒）。16/16 页面 HTTP、图片与本地链接、canonical、hreflang、sitemap、搜索索引通过；sitemap 无重复且不含校对附件。原始 PDF 与英文附件构建副本一致。浏览器验证中文目录跳转与 aria-current 高亮、EN 切换、中文搜索展示四个新主题；390px 手机模拟下 document 宽度与 scrollWidth 均为 375px，表格内部可横向滚动。视口已恢复。未 commit、push 或发布。

2026-11-02：按用户要求扩充芯片详解，四语同步增加 8 类应用场景及选板表。场景明确为产品开发方向，不声称客户已部署，不添加未验证性能数字。原产品与芯片来源沿用上一轮已核实资料。
