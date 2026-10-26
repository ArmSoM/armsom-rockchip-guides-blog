# 151 Rockchip rk3506-suspend 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TRUST\Rockchip_RK3506_Developer_Guide_System_Suspend_CN.pdf`；13页；SHA-256 `a7146c2d4fb35766e6e8b1b45771a5052ec38477ca0d2560107dec3aa28d6caa`。

技术正文物理页：CN3正文起–13。
第3页目录后1系统待机/OPTEE最低版本、驱动、完整DTS；2.1–2.6全部配置、BIT/宏/16组寄存器限制、USB补丁、两块参考板ARM+LOGIC diff；3三组完整日志。

## 配图、版本与语言处理

仅CN V1.1.0，无EN/独立技术图；四语中文共同基准。

## 提取修复与原稿疑点

原稿kernel6.1与OPTEE前提已保留。未执行debug寄存器、供电或休眠命令。保留宏、位号和补丁路径（包括rk3502路径）不推定为RK3506新路径；四语代码完全一致。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
