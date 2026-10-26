# 148 Rockchip trust 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TRUST\Rockchip_Developer_Guide_Trust_CN.pdf`；15页；SHA-256 `9fb8187289e9a88038ce6e28126d6d35612c849ce02a82ea9dc21116d4ed1dc5`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\TRUST\Rockchip_Developer_Guide_Trust_EN.pdf`；17页；SHA-256 `170deb62a33961e2e7d10ef6d3ec171a3c61a3df77f80f85f294498fff680d0c`。

技术正文物理页：CN4–15 / EN5–17。
1 TrustZone及系统/CPU架构；2实现/启动/固件路径、全部3.10及4.4+的32/64位PSCI配置、运行内存/生命周期、安全/PSCI/Secure Monitor；3完整启动日志、版本和两种PANIC寄存器转储；4全部参考。

## 配图、版本与语言处理

CN5图、EN5图按同主题对应，ZH中文原图，EN/RU/DE英文原图。两稿V1.1.1，全部代码归一空白后相同；跨页PANIC寄存器块接回。

## 提取修复与原稿疑点

前言基础功能已开源与正文只提供binary均按历史语境完整保留，不宣称当前状态。0–2M/132–148M和入口地址保留，不推定其他BSP。2.4.1.1等原稿小字号标题恢复层级；不改PSCI值、PANIC寄存器或日志拼写。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
