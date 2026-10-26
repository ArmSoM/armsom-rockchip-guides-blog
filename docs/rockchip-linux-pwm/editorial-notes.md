# 128 linux-pwm — 校对记录

## 来源

- cn: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\PWM\Rockchip_Developer_Guide_Linux_PWM_CN.pdf`；19页；SHA-256 `1c8dddfd558951e6e31551287b50cfe6248f226d4ce0c27671646bdc57698805`。
- en: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\PWM\Rockchip_Developer_Guide_Linux_PWM_EN.pdf`；20页；SHA-256 `6e5fb31ff378e202536202d0744521230e626f5b3e4e83347fe90ddb686b1139`。

源PDF未修改。四语完整技术正文保存为可编辑Markdown；中文依中文正文及原图，EN/RU/DE依英文正文及原图。技术前言适用信息保留；封面日期、密级、声明、联系信息、读者对象和修订记录移除。代码内作者/提交记录等必要技术署名保留。硬件命令未执行；不把原厂例子或测量写成ArmSoM实测。

## 覆盖及修复

- RK-KF-YF-029，V3.6.0，中19页英20页；技术正文均p5起。全部页面联系表检查，末节4.3及所有27个技术标题保留。
- 前言20组芯片/内核版本全部恢复；功能矩阵28行、12个功能标志全量可编辑。28行Y/N与两种语言PDF文字层逐行程序核对一致。表的原矢量文字并非整页截图。
- 两份原稿各1张原理图完整提取；引脚/球位/网络另有13行可编辑转录，重点GPIO1_C3/PWM2_d、M28、LOG_DVS_PWM。
- 每语31个跨页合并后代码块。EN/RU/DE逐字相同，中英代码去空白相同；全部代码去空白与原提取单元一致。恢复软换行注释、DTS跨页连续性、中文inline struct pwm_state/struct pwm_device间隔。修复英文Linux-3.10跨页句和pwm.txt路径被译文措辞拆开的顺序。
- 原稿PWM_POLARITY_INVERTED/INVERSED两写法、driver/input路径、Continous拼写按原稿保留并注记；不猜改BSP标识。
- 没有发现必须择一的中英版本冲突；标题数量27、源代码31块、原图1张/语言。

## 验收边界

图片引用均解析到存在的仓库文件；四语正文无摘要替代、没有缺省英文段落充当俄德文。source hash核对一致；不修改原始PDF、不commit/push、不运行硬件命令。主任务负责Jekyll构建、正式canonical/hreflang、搜索/sitemap和发布审核，本记录不声称已完成这些检查。ArmSoM板卡SoC、SDK/BSP、内核、引脚/电源或RGA核心/内存限制仍需实际适配验证。
