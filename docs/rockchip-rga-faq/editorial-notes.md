# 130 rga-faq — 校对记录

## 来源

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\RGA\Rockchip_FAQ_RGA_CN.pdf`；43页；SHA-256 `fd9c7c28c876195cdef335f40219f9fc47a867ee2e91b2bd43b8745f62ef9444`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\RGA\Rockchip_FAQ_RGA_EN.pdf`；48页；SHA-256 `fc37e7813fa02ab39f212a26e869ab44beca885d9f3f202110b89068057cb4bf`。

源PDF未修改。四语完整技术正文保存为可编辑Markdown；中文依中文正文及原图，EN/RU/DE依英文正文及原图。技术前言适用信息保留；封面日期、密级、声明、联系信息、读者对象和修订记录移除。代码内作者/提交记录等必要技术署名保留。硬件命令未执行；不把原厂例子或测量写成ArmSoM实测。

## 覆盖及修复

- RK-PC-YF-404，V1.1.3，中43页英48页；技术正文均p4起，最后Q4.11内存大小1382400/3686400及NV12/RGBA8888公式完整保留。
- 全部页面联系表检查；6个表格/语言（版本匹配、节点、调试节点、测试环境、12行性能数据、CSC参数）可编辑，表头和说明按语言本地化。测试数据明确是原厂RK3566示例。
- 原图各11张：色差、OSD、Alpha、旋转、对齐、缓存伪影等比较图片完整保留，不以整页图替正文。这些图片中除Rockchip标志外没有另需OCR的参数表；技术条件在相邻正文完整保留。
- 中文32个技术标题、50个跨页合并代码块；EN/RU/DE31标题、49代码块。区别来自英文未编号RGA Driver、中文独有通用echo占位示例；已明确来源而非静默删除。
- 修复长日志注释软换行、vw-vh/map_core断行、跨页代码、深层标题误粘正文；代码非空白字符与对应原稿提取单元完全一致，EN/RU/DE全部49代码块逐字相同。
- 中英代码差异主要为日志说明注释语言/换行，中文通用echo占位示例，以及英文原稿TIME部分未带中文说明。保存独立code-source-diff.md供追溯；不以一语言覆盖另一语言。
- 中英同版仍存在编排/内容差异：英文版本表表头原是中文，现本地化；中文测试环境比英文多RGA2-EHANCE行，已作为中文来源补充写入EN/RU/DE；中文2.2.2/2.2.3与英文无编号/2.2.2保留来源编号。
- 原稿/sys/kerne/路径、MUTIL_RGA、WRANING、librga_souce_path、RGA2-EHANCE拼写、Android7.0上下界同时包含7.0均原样保留。使用时需核对BSP。
- 原文频率调整、check和slt、内存映射等操作可能破坏现场或影响稳定性，正文明确未执行；开发者需先确认适配与风险。

## 验收边界

图片引用均解析到存在的仓库文件；四语正文无摘要替代、没有缺省英文段落充当俄德文。source hash核对一致；不修改原始PDF、不commit/push、不运行硬件命令。主任务负责Jekyll构建、正式canonical/hreflang、搜索/sitemap和发布审核，本记录不声称已完成这些检查。ArmSoM板卡SoC、SDK/BSP、内核、引脚/电源或RGA核心/内存限制仍需实际适配验证。
