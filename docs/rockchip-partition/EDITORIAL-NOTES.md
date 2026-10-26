# 146 Rockchip partition 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TOOL\Rockchip_Introduction_Partition_CN.pdf`；9页；SHA-256 `f89a2ae43cc7ca0974cd03b52a6126bb7c1a6a4240d624ffedeace3101837aaf`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\TOOL\Rockchip_Introduction_Partition_EN.pdf`；10页；SHA-256 `cad80fd17609a4d77143ab6341e60f0659a0432ac6df1311ad05c22da2185eee`。

技术正文物理页：CN4–9 / EN5–10。
1 Parameter预览（两种完整配置）；2.1–2.10全部字段、11张可编辑表与MTD地址示例；3全部分区规范。

## 配图、版本与语言处理

无技术图。中英代码忽略排版空白后完全一致。两稿均V1.5.1；中文全技术内容作为共同完整文本，英文逐章对照无独有遗漏。

## 提取修复与原稿疑点

两稿示例ATAG=0x00200800但2.6标题0x60000800；MACHINE标题3226而实例/表3326；updata.img原稿拼写保留。CMDLINE跨行词、十六进制值接回，initrd与mtdparts间保留参数空格。中文第2页64KB上限与配置警示完整补入四语。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
