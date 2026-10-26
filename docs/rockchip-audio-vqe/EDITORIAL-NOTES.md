# 178 校对记录

## 原始资料

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\Audio\Algorithms\Rockchip_Developer_Guide_Audio_Algorithm_VQE_Introduction_CN.pdf`；14页；SHA256 `ce944c6723c91e4c791b2349277a1680b479193a524cc355904e91af85dffc44`
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Linux\Audio\Algorithms\Rockchip_Developer_Guide_Audio_Algorithm_VQE_Introduction_EN.pdf`；19页；SHA256 `c17371e97dd6abda81237b3978b0dc62ca39543bda72c3f7f76a2cd54cab797b`

## 完整性与语言

27个标题；四语各16个代码块、12个图文件引用。章节1–4.12覆盖，含AEC/BF效果、全模块参数、AGC限制与末尾推荐配置。

CN14页/EN19页同V1.7.0。27个标题对应；原稿代码去除C注释后781个技术token完全一致，未发现该序列的参数差异。中英文分页与代码注释语言不同，不把代码块字节差异误判为遗漏。中文代码注释保留原文；EN用英文原代码，RUDE用中文代码。

## 提取修复与图片来源

修复2.3.2 BF标题跨块断裂及出)跨行；跨页代码续接。ZH引用CN12图，EN/RU/DE引用EN12图；英文PDF图内仍有中文标签，未伪称全部英文化。

技术前言/适用范围已保留。封面日期密级、法律/商标声明、联系方式、读者对象、修订表及重复PDF目录移除；原PDF未修改。代码内原注释/标识符保留。

## 原稿疑点及验证边界

原稿消除dB、距离与场景数据是厂商示例，不是ArmSoM测试。各音频算法库、硬件麦克风布局及参数有效范围须实际SDK核对。

全篇仅平台参考，没有声明所有ArmSoM板卡兼容；SoC、SDK/BSP、内核及外设仍需硬件验证。没有运行示例、烧写或配置设备。

## 已完成检查

- 四语Markdown实际保存，共用translation_key和已有站点目录机制。
- 原页contact视觉巡检、章节/末章/附录覆盖核对；没有以整页图代替正文。
- 本组全部图片路径存在；英俄德非代码正文无未译汉字。源图内文字、实际代码注释不属于未译正文。
- 代码片段覆盖与数量见工作记录qa178182.json；178/179源间差异见source-reconciliation178179.json。没有宣称示例编译或硬件测试通过。

## 待主任务统一验收

Jekyll构建、实际页面HTTP、四语切换、canonical/hreflang、sitemap、搜索、移动目录与高亮由主任务统一执行。本子任务未构建、commit、push或发布，未改robots/验证文件/外部服务。
