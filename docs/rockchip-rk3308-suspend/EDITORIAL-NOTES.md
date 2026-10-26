# 149 Rockchip rk3308-suspend 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TRUST\Rockchip_RK3308_Developer_Guide_System_Suspend_CN.pdf`；9页；SHA-256 `fa717f98af247c516aa091fe42d7f3e7b13a8d5a730cf7b3162d7fe1c44fcb24`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\TRUST\Rockchip_RK3308_Developer_Guide_System_Suspend_EN.pdf`；10页；SHA-256 `13a206b29e06ee67b0283ed425933fcc77fb5b2b90e8a57086ae6ca8578b78e0`。

技术正文物理页：CN4–9 / EN5–10。
1系统流程/驱动/完整DTS；2.1–2.5所有常规/电源/唤醒/debug/reboot项及注意事项；3完整休眠唤醒日志。

## 配图、版本与语言处理

无技术图。经用户批准CN V1.1.1为共同基准。EN封面V1.0.0而修订表V1.1.0；CN新增修订仅格式/版权。代码宏值及所有技术段核对，无独有英文操作漏项。

## 提取修复与原稿疑点

CN8页pwm0/gpio0范围被上下标排版破坏，英文明确pwm0–3/gpio0–3，但宏仅PWM0–2/GPIO0–3；四语并列疑点不擅补PWM3。RKPM_DBG_WOARKAROUND原拼写、RKPM_xxx占位保留。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
