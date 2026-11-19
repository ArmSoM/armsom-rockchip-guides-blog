# RK3572 硬件资料首批本地验收

验收日期：2026-11-19。本地预览验收通过；用户已确认并授权提交发布。以下为发布前检查记录，线上部署结果以本次交付说明及对应 GitHub Pages 运行记录为准。

## 实际交付

- 首批 10 个选题：RK3572 数据手册更新 + 9 个新专题。
- 另更新 RK730 已有 5 个主题。
- 共 15 个主题、60 个中英俄德页面，104 张独立原图。
- 补齐文章库第 67、68 页的四语静态页，共 8 页。
- 原始 22 份 PDF 的 SHA-256 与读取前一致。
- 本批为选定工程专题，不是整份硬件设计指南的逐章全文翻译。

## 已通过

| 检查 | 结果 |
|---|---|
| Jekyll 构建 | 成功，退出码 0 |
| 60 个实际文章页面 | HTTP 200，桌面与手机均检查 |
| 语言切换 | 同主题四语对应正确 |
| 原图加载 | 全部 104 张均被正文引用，尺寸与比例正常，点击可查看高清图 |
| 目录 | 标题生成、点击跳转、当前章节高亮正常；手机可折叠 |
| 表格与代码 | 192 个表格（含四语），代码内容跨语言保持一致；长内容可横向滚动 |
| 页面溢出 | 1440 px 桌面、390 px 手机均未出现页面水平溢出 |
| 文章库与搜索 | 60 篇均能按本地化标题查到；新增静态分页两种宽度正常 |
| sitemap | 本批 60 个文章 URL 均出现一次；正式 HTTPS URL，无本地路径 |
| canonical / hreflang | 各页 canonical 指向自身，四语互相关联，x-default 指向英文 |
| 抓取与验证配置 | robots 与站点验证文件未改；本地预览响应单独附 noindex |
| JavaScript | 本批逐页检查未发现页面运行异常 |
| Git 差异 | 未覆盖无关文件；空白格式检查通过 |

四语标题层级、表格行列与数值、命令及关键标识已交叉校对。图片比例检查使用实际内容框尺寸，避免狭长电路图因整数像素取整产生误报。

逐页证据：static-checks.json、browser-checks.json；末页证据：pagination-checks.json；源图位置：figure-manifest.json。

## 本地预览

服务地址：[本地文章库](http://127.0.0.1:4053/zh/library/)。正文中的正式 canonical 仍为 https://blog.armsom.org。

| 主题 | 中文 | English | Русский | Deutsch |
|---|---|---|---|---|
| RK3572 数据手册 V1.1：规格、接口与版本变化 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-datasheet-v10/) | [查看](http://127.0.0.1:4053/articles/rk3572-datasheet-v10/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-datasheet-v10/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-datasheet-v10/) |
| RK3572 硬件设计指南：从资料选用到首板验证 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-hardware-design-series/) | [查看](http://127.0.0.1:4053/articles/rk3572-hardware-design-series/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-hardware-design-series/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-hardware-design-series/) |
| RK3572 最小系统：24 MHz 时钟、复位、启动与串口调试 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-minimum-system-bringup/) | [查看](http://127.0.0.1:4053/articles/rk3572-minimum-system-bringup/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-minimum-system-bringup/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-minimum-system-bringup/) |
| RK3572 电源设计：电源域、RK806-5 与双 PMIC 方案 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-power-domains-pmic/) | [查看](http://127.0.0.1:4053/articles/rk3572-power-domains-pmic/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-power-domains-pmic/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-power-domains-pmic/) |
| RK3572 DDR 设计：LPDDR4X、LPDDR5 电路与 PCB 约束 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-ddr-circuit-pcb/) | [查看](http://127.0.0.1:4053/articles/rk3572-ddr-circuit-pcb/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-ddr-circuit-pcb/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-ddr-circuit-pcb/) |
| RK3572 DDRBIN 配置：DDR 模板、ADC 选择与多配置固件 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-ddrbin-adc-configuration/) | [查看](http://127.0.0.1:4053/articles/rk3572-ddrbin-adc-configuration/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-ddrbin-adc-configuration/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-ddrbin-adc-configuration/) |
| RK3572 存储与启动设计：eMMC、UFS、FSPI 的连接与供电 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-storage-boot-design/) | [查看](http://127.0.0.1:4053/articles/rk3572-storage-boot-design/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-storage-boot-design/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-storage-boot-design/) |
| RK3572 USB 与 Type-C：烧录口、角色切换及供电检测 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-usb-typec-power-design/) | [查看](http://127.0.0.1:4053/articles/rk3572-usb-typec-power-design/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-usb-typec-power-design/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-usb-typec-power-design/) |
| RK3572 PCIe 与 SATA：Combo PHY 复用、时钟和布线 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-high-speed-interface-design/) | [查看](http://127.0.0.1:4053/articles/rk3572-high-speed-interface-design/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-high-speed-interface-design/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-high-speed-interface-design/) |
| RK3572 显示与摄像头：HDMI、eDP、MIPI 和电平匹配 | [查看](http://127.0.0.1:4053/zh/articles/rk3572-display-camera-design/) | [查看](http://127.0.0.1:4053/articles/rk3572-display-camera-design/) | [查看](http://127.0.0.1:4053/ru/articles/rk3572-display-camera-design/) | [查看](http://127.0.0.1:4053/de/articles/rk3572-display-camera-design/) |
| RK730 音频 Codec 设计解读：麦克风、I2S 时钟与差分输出 | [查看](http://127.0.0.1:4053/zh/articles/rk730-audio-codec-design/) | [查看](http://127.0.0.1:4053/articles/rk730-audio-codec-design/) | [查看](http://127.0.0.1:4053/ru/articles/rk730-audio-codec-design/) | [查看](http://127.0.0.1:4053/de/articles/rk730-audio-codec-design/) |
| RK730 封装、引脚与供电：QFN28 音频 Codec 设计入口 | [查看](http://127.0.0.1:4053/zh/articles/rk730-package-power-pinout/) | [查看](http://127.0.0.1:4053/articles/rk730-package-power-pinout/) | [查看](http://127.0.0.1:4053/ru/articles/rk730-package-power-pinout/) | [查看](http://127.0.0.1:4053/de/articles/rk730-package-power-pinout/) |
| RK730 时钟与音频路径：PLL、I2S、侧音和 I2C 地址 | [查看](http://127.0.0.1:4053/zh/articles/rk730-clocks-audio-i2c/) | [查看](http://127.0.0.1:4053/articles/rk730-clocks-audio-i2c/) | [查看](http://127.0.0.1:4053/ru/articles/rk730-clocks-audio-i2c/) | [查看](http://127.0.0.1:4053/de/articles/rk730-clocks-audio-i2c/) |
| RK730 寄存器速查：65 个地址、复位值与关键控制域 | [查看](http://127.0.0.1:4053/zh/articles/rk730-register-map-reference/) | [查看](http://127.0.0.1:4053/articles/rk730-register-map-reference/) | [查看](http://127.0.0.1:4053/ru/articles/rk730-register-map-reference/) | [查看](http://127.0.0.1:4053/de/articles/rk730-register-map-reference/) |
| RK730 启停流程：系统电源、ADC 录音与 DAC 播放 | [查看](http://127.0.0.1:4053/zh/articles/rk730-power-adc-dac-sequences/) | [查看](http://127.0.0.1:4053/articles/rk730-power-adc-dac-sequences/) | [查看](http://127.0.0.1:4053/ru/articles/rk730-power-adc-dac-sequences/) | [查看](http://127.0.0.1:4053/de/articles/rk730-power-adc-dac-sequences/) |

## 仍需工程核对的边界

- RK3572 的 VideoPort1 上限与指南双屏示例不一致，eDP 耦合电容建议也有章节差异；四语正文均保留提醒。
- RK730 的 PLL 频率原文、SCL 方向与 SPI 引脚映射问题记录在校对文档中。
- Zero5 尚无本次能核实的独立正式产品页；文章链接到既有 Zero 版型规划、官网产品目录和 Docs，未编造最终板卡规格。
- 未进行板端验证、DDR 工具执行、固件编译、烧录或 SI/PI 测量；未进行搜索引擎提交。
