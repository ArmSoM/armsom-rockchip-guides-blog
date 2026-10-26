# 147 Rockchip firmware-production 校对记录

## 来源与完整性

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\TOOL\Rockchip_User_Guide_Production_For_Firmware_Download_CN.pdf`；10页；SHA-256 `00749c5a763ecb8b9786a64d25f18facf1f4d159fe78613c869a6e2882646781`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\TOOL\Rockchip_User_Guide_Production_For_Firmware_Download_EN.pdf`；10页；SHA-256 `61c378cb1864c4f0c33be6b89a0fca5d7f586446e4b71d5e04de861ebe849b86`。

技术正文物理页：CN4–10 / EN3正文起–10。
1 USB/SD/烧录器三种方案；2 FactoryTool/OemTool/SD_Firmware_Tool/SpiImageTool；3完整mkimage、mkupdate及Chip Flag；4 USER分区及5项EXT_CSD默认值；5全部五类失败及原因。

## 配图、版本与语言处理

中文14图，英文13图；CN5.3两张图在EN合为一张。ZH用CN全部图，EN/RU/DE用EN全部图，按主题对应。mkupdate.bat截图两条命令另转录可复制文本。

## 提取修复与原稿疑点

两稿V1.2.3、EXT_CSD默认值一致。只转录原截图可见行，不补造不可见行。烧录/擦除/供电操作未执行；危险操作保留备份警示。

逐章核对首末章、代码跨页、参数及可编辑表格。移除封面发布日期/密级、声明/联系信息、读者对象、修订表、原导航目录；不修改PDF，不批量删除源码内版权或许可证。
四语复用统一 translation_key、现有collection和页面模板；正文不另加语言切换。适用说明采用平台参考，不宣称ArmSoM实测或全板卡支持。

## 验证边界

本记录是源码/原稿校对，不等同构建、浏览器、SEO或硬件验证；统一站点构建和验收由批次报告给出。未commit、push、发布、烧写、关电或执行硬件指令。
