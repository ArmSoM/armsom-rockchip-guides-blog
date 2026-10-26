# 150 Rockchip rk3399-suspend 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TRUST\Rockchip_RK3399_Developer_Guide_System_Suspend_CN.pdf`；8页；SHA-256 `4dd3ff6a3fe4b9f40117f0547e070b41975fbf79b0bb3b46de3a829b36eb3cce`。

技术正文物理页：CN4–8。
1系统流程、驱动及跨页DTS；2.1–2.6完整常规/电源/唤醒/debug/APIO/GPIO项；3两组完整日志。

## 配图、版本与语言处理

仅CN V1.0.0，无EN、无技术图；完整四语以中文为基准。

## 提取修复与原稿疑点

保留GPIO配置结尾逗号、RKPM_APIOxxx占位、APIO文字APIO1–5与宏APIO0–5差异、PWM2D_REGULATOR_EN日志对PWM2_REGULATOR_EN定义差异、PMU_MODE_CONG拼写。不猜更改。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
