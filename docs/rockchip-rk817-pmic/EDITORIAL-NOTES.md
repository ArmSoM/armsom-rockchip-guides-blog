# 123 rk817-pmic 校对记录

状态：四语全文、技术原图/表格与记录已实际保存；等待根任务统一构建和浏览器/SEO验收。本子任务未commit/push/发布。

## 来源

- 原PDF：`D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\PMIC\Rockchip_RK817_Developer_Guide_CN.pdf`；V1.0.0，18页。
- SHA-256：`cfe1b785a61cf37d3bf2a7784baada86a9c67947e656b561056d0d9e3beee43e`。
- 本主题只有中文目录原稿，没有英文PDF；四语以同一中文技术正文为基准。中文原图供四语使用，部分图片标签本身英文，不伪称英文PDF图片。
- 正文从第5页到最后第18页；技术前言的模块范围和内核版本在开头保留。第5–10页基础/功能/引脚/电压/时序；10–11页驱动及menuconfig；11–17页跨页完整DTS、属性解释和关机函数；17–18页全部接口与Debug。
- 按要求移除封面日期、密级、免责声明/版权声明/商标声明、联系信息、读者对象与修订记录；代码内注释/署名和技术版本不删除，源PDF未修改。

## 提取、翻译与图表

- 逐段翻译全部技术正文，不做摘要；保留命令、路径、API、参数、表、末章。修复PDF断行与跨页DTS/函数代码，比例字体代码灰框误识别为表时按原字形坐标恢复缩进。
- 四语围栏代码逐块一致，共10块；另有可复制内联命令/API。代码未执行。
- 技术图共6张，全部独立保存并核对。两张原生电压表和原图中的引脚/时序表恢复为4张可编辑表；68个编号引脚及裸露焊盘、全部启动组合完整保留。
- 使用既有四语collections、translation_key、category linux、本地化title/description/excerpt，复用站点切换/目录/搜索/sitemap，不增加重复机制。
- 已做源章节范围、末页、资产存在性、翻译覆盖、四语代码一致检查；没有ArmSoM硬件测试，板卡/SoC/PMIC/SDK/BSP/电池适配仍需实物确认。

## 原稿疑点及边界

- p5称功能4部分但列7项；按原文保留。
- p9电压表0.737.5、p9 DCDC3仅外部分压而p10时序表列内部分压0.5V–2.4V，均未猜改。
- p10–11驱动写rl817_battery.c、rl817_charger.c、rl817_codec.c，路径rockchi而非rockchip；4.4配置含CONFIG_REGULATOR_RK818、SND_SOC_RK817无CONFIG前缀。均是原PDF可见写法，待实际BSP核对。
- p14示例regulator-initial-mode=0x2、ramp-delay=6001，而说明一般模式1、ramp-delay固定12500；示例battery virtual_power=1与charger virtual_power=0也不同，不能当通用产品配置。
- p18标题确实只写3.1内核/3.2内核，没有版本；正文引用3.10而本篇内核范围4.4/4.19。保留，不发明补章。
- pin图MIC1N/MIC1P与表MICIN/MICIP、原表英文charger pump与charge pump语义按电荷泵译；源图固有边缘不补画。

## 尚待统一验收

- Jekyll构建、真实网站页面、目录跳转/高亮、列表和搜索、canonical/hreflang、sitemap与响应式表格滚动由根任务执行。
- 不声称上线、搜索引擎收录或AI引用；不修改爬虫、验证文件、DNS或Search Console。
