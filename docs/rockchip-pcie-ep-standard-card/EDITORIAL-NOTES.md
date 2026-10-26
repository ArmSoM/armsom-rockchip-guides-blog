# 109 PCIe EP 标准卡校对记录

状态：四语全文、原图及来源校对已落库，待本批统一构建和页面验收；未提交、推送或发布。

## 来源与范围

- Rockchip_Developer_Guide_PCIE_EP_Standard_Card_CN.pdf：44 页，V3.2.0；英文同名 EN 稿 46 页，V3.2.0。
- 技术正文均从第 6 页开始至末页，第 2 页的 SoC/内核/RT-Thread 版本和 EP 侧限制已写入四语适用说明。
- 原文 EVB 的速度、兼容性结果原样保留为原厂参考；无 ArmSoM 硬件测试，不宣称任意 ArmSoM 板支持该方案。
- 删除封面日期、密级、法律声明、联系信息、读者对象、修订表；代码内部署名和日志时间不按封面信息删除。原 PDF 未修改。

## 提取修复与图片

- 原 5 张位图及 6 张矢量时序图分别保存为独立文件，共每种来源 11 张。中文用中文原图；EN/RU/DE 用英文 PDF 原图。
- 矢量图内标签不误当正文标题或表格；保留 RC/EP 数据流向、NPR TLP/原文 TLB、Posted Request、回调及 loopback 时序。
- 修复中文内联 API/路径被排到句尾的问题，包括 rk_pcie_device_init、rk_pcie_task_create、struct pcie_task_attr_st、node->size、libdrm-dev、pcie_auto_test 参数和 Hugepage cmdline。
- 英文内联灰底被误判为表格，恢复 libdrm-dev 与 -fno-tree-loop-optimize 的完整说明；合并断行标题。
- 四语代码采用中文原稿共同基准，保留原注释。英文原稿 patch 命令把目录“更新包”译为 Update Package（或同类英文名称），正文代码不静默混用两个目录；部署时必须匹配实际 SDK 目录。
- 英文分成两页的目录树和 SPL 日志统一使用中文完整代码段。代码、日志均未执行。
- 四语均 33 个代码块、14 张可编辑表、11 张正文图片，四语代码逐块一致。修复 bootargs 字符串中的 PDF 软换行及日志日期/错误行断行。正文管道符转义，避免被 Kramdown 误识别为额外表格。八篇 109/110 均添加本地化 excerpt，避免 raw 内容进入自动摘要。
- 已逐张目视检查 22 张保存图片，矢量标签和图例未裁掉。英文 PDF 的部分位图本身含中文标签；第 19 页重复两张缓存流程图，中文第 18 页第一图是软件架构图，原稿差异已在四语正文注明，没有伪称图片全部英文化。

## 原稿疑点

1. 小内存 BAR 表前行至 R+2560B，后行从 R+2056B 开始，两稿均有此重叠，原值保留，不能直接当作安全映射配置。
2. loopback 测试方法引用 examples/pcie_speed_test/README.md，而非 loopback README，未猜改。
3. Windows CTRL+L 被列作进入休眠；原稿版本 Windows 10 2004、内部版本 19042.1052、配置名 eq 与“高于 2004”的描述存在待核对事项。
4. core/api 称四部分，但仅列 ep、rc/windows、rc/other 三部分；没有补造第四项。
5. 原稿将 bcdedit testsigning、禁用签名与 Test Mode 简化关联，并称临时禁用；这不是本次验证结果，不能据此认定所有驱动签名机制都被禁用。未改任何主机安全设置。
6. 源文多处交叉引用指向已拆分的 EP 配置指南，完整保留引用名称；具体 SDK 版本、固件目录、接口和权限须对照用户实际环境。
7. 示例出现 drv 版本 v2.0.0 - 202300927 等历史日志，按原文保留。
8. Hugepage 日志的 16 × 32768 kB 与 Hugetlb 1048576 kB 不一致；四语已提示，未自行改数值。
9. 本指南示例 rk_pcie_get_buff 等签名与独立 API 指南可能存在 SDK 代际差异，必须对照实际头文件，不跨文档猜改参数。

## 尚需完成

浏览器窄屏/目录交互、本地 HTTP、搜索、sitemap/canonical/hreflang 由主任务统一验收。本记录不将尚未收到的页面验收结果标为通过；没有硬件运行测试。
