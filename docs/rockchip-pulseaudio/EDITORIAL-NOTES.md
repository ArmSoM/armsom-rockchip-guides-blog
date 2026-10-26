# 181 校对记录

## 原始资料

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\Audio\Rockchip_Developer_Guide_PulseAudio_CN.pdf`；14页；SHA256 `a66543fa22ba637f54f20b981882372c21fdb158e0c63ea33bbb915db1507c3c`

## 完整性与语言

6个标题；1表、9个合并代码块、1原图。ucm2与ucm、ES8388/HDMI/RK809完整配置及最后JACK日志均在。

只有CN14页V1.0.0；三语全文补译，四语使用中文PDF同一pavucontrol原图。源适用RK/Linux4.19与5.10；Debian10/PulseAudio13.99.x和Debian11/14.2区别保留。

## 提取修复与图片来源

恢复cat rockchip-es8388.conf跨行文件名和keyup-threshold-microvolt表格属性；跨页HiFi.conf合并；${CardId}通过raw保留；原重复audio-routing/EnableSequence不删除。

技术前言/适用范围已保留。封面日期密级、法律/商标声明、联系方式、读者对象、修订表及重复PDF目录移除；原PDF未修改。代码内原注释/标识符保留。

## 原稿疑点及验证边界

原正文rockchip-es838简称与代码rockchip-es8388不统一，未擅自改代码；硬件GPIO、电压和ALSA卡编号均是原稿示例，未验证ArmSoM适配。

全篇仅平台参考，没有声明所有ArmSoM板卡兼容；SoC、SDK/BSP、内核及外设仍需硬件验证。没有运行示例、烧写或配置设备。

## 已完成检查

- 四语Markdown实际保存，共用translation_key和已有站点目录机制。
- 原页contact视觉巡检、章节/末章/附录覆盖核对；没有以整页图代替正文。
- 本组全部图片路径存在；英俄德非代码正文无未译汉字。源图内文字、实际代码注释不属于未译正文。
- 代码片段覆盖与数量见工作记录qa178182.json；178/179源间差异见source-reconciliation178179.json。没有宣称示例编译或硬件测试通过。

## 待主任务统一验收

Jekyll构建、实际页面HTTP、四语切换、canonical/hreflang、sitemap、搜索、移动目录与高亮由主任务统一执行。本子任务未构建、commit、push或发布，未改robots/验证文件/外部服务。
