# 100 Vendor Storage V1.3.0：校对记录

状态：四语正文和配图已保存；最终 Jekyll 构建、20 页静态 SEO/内容检查、20 页和 106 图 HTTP 检查通过。浏览器交互验收按用户指示留待稍后。未 commit、push 或发布。详见 ../common-batch-098-102/DELIVERY.md。

## 来源

英文目录 `NVM/Rockchip_Application_Notes_VendorStorage_EN.pdf`，18 页，RK-KF-YF-C35，V1.3.0。技术正文第 5–18 页；技术范围列出的 RockChip kernel-4.19、kernel-5.10、kernel-6.1 已保留。没有中文对应原稿，ZH/RU/DE 完整翻译英文，四语统一使用 9 张英文原图，未伪称中文原图。

与 097 的 Appnote_rk_storage_0001 Rev.08 是不同版本资料，不合并或跳过。V1.3.0 的数据布局、ID 分配及 GKI/Android API 必须按本篇来源使用，不套用旧文。

## 完整性与排版

- 保留全部 15 个技术标题、15 个正文单元、4 个跨页 ID 表格块、9 张原图及全部代码。
- 9 个提取代码单元中，Linux 示例跨 16–18 页合并为一段；最后纯路径说明恢复为可读正文。另将 Menuconfig 图片中的完整文字手工转录为可复制文本，图片同时保留。
- 第 7 页数据结构原本是位图表格，保留原图并逐行恢复 15 行数据为可编辑表格，包括 offset、size、Tag 0x524B5644、Item0、Hash、Version2。
- PC C++ 函数声明的 DWORD 参数 PDF 软换行仅合并为空格，不改变类型、标识符、默认参数或返回含义。
- ID 表格按原页顺序保留，空白 ID 18/19、所有省略号及客户预留条目均保留；未擅自填充未定义 ID。
- 去除封面日期、密级、法律/商标/版权声明、原厂联系信息、读者对象及整份修订记录，保留文档 ID、技术版本和适用内核。原始 PDF 不变。

## 原稿疑点与保留方式

1. ID 1063 的 Function 是 Super-Resolution Offline Key Reserved Field，但 Description 为 MEMC offline key reserved field。四语分别翻译两格，不把其中一格猜改成另一格，正文已提示。
2. ID 76 的 Description 是 Offline key reserved field，而 ID 1076 描述为离线位置减 1000 等于在线位置 76。两处均保留并提示。
3. ID 61 将 Super-Resolution 算法预留与 HDCP2.x RKIV 合在一项；RKIV 明确为 16 字节、HDMI2.x 固件附加加密，原文仅称部分 3528/356x 客户采用，未推断所有平台适用。
4. GKI 句子 “the kernel needs to be added to ram_vendor_storage.ko” 语法与方向不清。译文保守表述添加该模块、仅支持读不支持写；实际构建、加载与 ABI 须按 BSP 核对，没有编造加载命令。
5. 数据结构图 `Item0->flag(reversed)` 原样保留，未擅改成 reserved。
6. 示例定义 uint16/uint32/uint8，但结构使用 u16/u32/u8、ERROR 未定义，且 unsigned long 位宽依 ABI 而变，未补齐或认证可编译性。原始拼写 rerurn/succes/SUCCESSED 不按普通文字纠错批量修改代码。
7. 示例 write_test 会把 ID 1（SN）写成 0–31，存在设备身份破坏风险；四语正文明确警示并要求先备份。文件描述符关闭、类型和错误宏由实际工程解决，本文不执行代码。
8. Feature 中的掉电恢复为原文功能描述，未进行或伪称 ArmSoM 实测。

## 尚待验收

未完成本批最终站点构建、四语页面及切换、TOC/窄屏、图片链接、列表搜索、sitemap、canonical/hreflang、robots/响应头和验证文件完整性检查。待五篇完成后统一验证；目前不能声称全部交付。
