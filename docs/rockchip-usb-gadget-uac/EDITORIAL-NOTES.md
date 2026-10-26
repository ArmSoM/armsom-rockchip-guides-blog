# 163 USB Gadget UAC 校对记录

## 来源与处理边界

- 来源：`docs/cn/Common/USB/Rockchip_Developer_Guide_USB_Gadget_UAC_CN.pdf`，RK-KF-YF-098，V1.3.1，43页。
- SHA-256：`698070c25b8ee1380519826b6b2950fb60eb28bb157c901bbfb206c5068e0ab1`。
- 仅中文目录原稿；正文大量技术内容本身为英文，不冒充另有英文PDF。四语均使用同一中文PDF提取的14幅独立原图，图注与alt本地化。
- 原始PDF未修改；移除封面日期/密级、声明/联系信息、读者对象、修订记录。保留技术前言、适用内核、版本、源码注释及引用。
- 完整中文/英文/俄文/德文保存于四个既有文章集合，统一translation_key `163-rockchip-usb-gadget-uac`。图存于本目录assets。

## 逐章覆盖

| 原稿部分 | PDF页 | 处理 |
| --- | --- | --- |
| 技术前言、平台范围、HID参考 | 2 | 四语保留，不把原厂范围扩大成ArmSoM支持承诺 |
| 1 Kernel UAC CONFIG | 6–7 | commits、CONFIG、文档、支持矩阵完整 |
| 2 UAC1/UAC2使用测试 | 7–25 | 配置脚本、参数、uevent、PPM、兼容表、Windows/Ubuntu步骤及图片完整 |
| 3 UAC1 Legacy | 25–27 | 配置与参数、设备路径/默认值、测试完整 |
| 4 Audio Source | 27–31 | 采样率、配置及测试完整 |
| 5 复合使用与测试 | 31–32 | 跨行标题合并；配置/测试完整 |
| 6 引用 | 32 | 保留技术参考 |
| Appendix A UAC1 descriptor | 33–37 | 跨页描述符合并为可复制代码 |
| Appendix B UAC2 descriptor | 37–42 | 跨页描述符合并并按原页恢复层级缩进 |
| 末页 | 43 | 空白，无技术正文 |

## 提取与版式修复

- 将跨页shell脚本、内核配置、参数输出、两份完整USB描述符合并；恢复比例字体造成的空格和描述符缩进。
- 修复负音量宏表达式与uevent SAMPLE_RATE软换行，不替换原值。
- 支持矩阵及兼容性表恢复为两张可编辑Markdown表格。
- 保留源码内原始中文注释，补充本地化参数含义；代码不因翻译而改变。
- 四语均33个代码块，内容逐块相同；均14个图片引用，实际资源路径全存在；非中文正文代码外未发现漏译中文。

## 保留的原稿疑点与适配限制

- Full/High Speed原稿写12/480 MHz；176 kHz示例对应1056 bytes；60×24×96 kHz写132 Mbit/s；SOF周期写128us。未猜改单位或算式。
- Kernel-5.10音量段落写uvc_app，其余处uac_app；已正文提示核实。
- Windows UAC2 Feature Unit限制与较新内核默认volume配置需要结合具体BSP核实。
- 原厂标注所有Rockchip芯片（MCU除外）、Linux4.4以上是文档适用范围，不代表全部ArmSoM板卡已验证。未进行硬件测试、录放音测量或功能切换；原文测试输出不标为ArmSoM实测。
- 示例包含删除configfs链接和切换USB功能，可能中断ADB，正文已警示。

## 验收状态

源正文/图/表/代码检查完成。本子任务未构建、启动网站或进行浏览器/SEO验收；由主线程统一检查canonical/hreflang、搜索、sitemap、响应头及多语言页面。未执行commit、push或发布。
