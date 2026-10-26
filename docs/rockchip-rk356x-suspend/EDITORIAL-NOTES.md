# 152 Rockchip rk356x-suspend 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TRUST\Rockchip_RK356X_Developer_Guide_System_Suspend_CN.pdf`；7页；SHA-256 `153364872c345dfd07e53819c5682c006f620a7a4c102d53f01e6586c6e42939`。

技术正文物理页：CN4–7。
1流程/驱动/完整DTS；2.1所有模式宏、2.2全部唤醒宏及GPIO0限制、2.3debug；3跨页休眠日志及完整唤醒日志。

## 配图、版本与语言处理

仅CN V1.0.0，无EN/独立技术图；四语中文共同基准。原稿标题RK356X，支持表明确RK3568与4.19/5.10。

## 提取修复与原稿疑点

日志RKPM_SLP_CENTER_PD/HW_PLLS_PD与宏CENTER_OFF/HW_PLLS_OFF写法不同，原值保留；wake interput原拼写保留。GPIO0限制和24M依赖均在代码注释完整保留，不泛化到其他板卡。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
