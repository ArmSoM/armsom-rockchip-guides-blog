# 117 RK801 PMIC — 校对记录

原稿版本 V1.1.0；原稿技术适用内核 6.1。源文件只读，未执行硬件读写命令，未 commit/push。

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\PMIC\Rockchip_RK801_Developer_Guide_CN.pdf`，14 页；SHA-256 `a5170f185ded9f69beea3c2cd02950106b163b29b74542a61505433e5e4a2bf1`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\PMIC\Rockchip_RK801_Developer_Guide_EN.pdf`，16 页；SHA-256 `d801af485292227830e1e9064f610c4d3dd69695da62471c2092f381af9890ac`。

原稿全部页面已提取并检查视觉联系表，正文保留全部技术章节至最后一节。技术前言的用途和芯片/内核范围移入开头适用说明；封面日期、密级、免责声明、商标和版权声明、联系信息、读者对象、修订表不刊登，技术驱动提交标识及代码署名保留。原稿中示例、参数和测试输出不作为 ArmSoM 实测。

## 图表及修复

- 文档标识 RK-KF-YF-C57。中英同 V1.1.0；中文技术正文 p4–14、英文 p5–16。中文采用中文原图4张，EN/RU/DE采用英文原图4张。均含芯片引脚图、两段引脚表和原理图；引脚表另逐行恢复为可编辑表。
- 12个技术标题、10个合并后的代码块、4张图/语言。修复跨页DTS连续性及缩进、英文注释软换行、误识别为单行表格的inline属性及中文段落顺序。只改代码空白，不改参数；源代码比对见 code-source-diff.md。
- 中英源码差异只有注释语言/措辞和空白：第1块电压范围注释 v/V及step；第6块DTS注释（中文SWTICH、output hight，英文SWITCH、output high）；第8块regulator示例注释；第9–10块寄存器命令注释。删除注释/空白后10块一一相同，电压值、地址、属性和命令无差异。EN/RU/DE全部10块完全相同。
- 引脚表PWRCTLR与正文PWRCTRL拼写不同，保留并在正文标注。

## 验证范围与限制

四语正文和图片链接存在；技术标题数四语一致；EN/RU/DE代码块逐字一致，118/119四语代码一致。图像比例和标签按原始提取保留，不以整页图片替代正文。页面正式URL、canonical/hreflang、搜索、sitemap、响应头和构建由主任务统一验收，此记录不冒称已完成页面验收。板卡PMIC型号、SoC、SDK/BSP、内核与供电/引脚必须逐项适配；未硬件验证，不保证全部ArmSoM产品可直接使用。
