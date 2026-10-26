# 132 RT-Thread Display：校对记录

来源：中文目录 `RTT/Rockchip_Developer_Guide_RT-Thread_Display_CN.pdf`，27页，RK-KF-YF-105 V1.4.0；第27页空白。没有英文对应PDF。四语完整技术正文均以中文原稿为准，全部16幅图来自中文PDF，明确说明而不伪称英文原图。

## 章节与范围

| 章节 | 原稿物理页 | 内容 |
| --- | --- | --- |
| 1–2 | 4–6 | 概念、显示通路、软件框架、Driver/HAL文件表 |
| 3–4 | 6–10 | control操作、display/crtc/win/post-scale/BCSH/color-matrix/clip结构 |
| 5–6 | 10–17 | 数据/屏对齐、选屏与新增屏、扫描时序、全部配置项、DSI命令与包类型 |
| 7 | 17–24 | display_test全部测试项、9步demo、XY及仅Y局部刷新 |
| 8–11 | 24–26 | modetest、RGB888/RGB565 Color Key、关闭Color Key、LUT更新与参考文档 |

保留前言产品版本：RK2108 lts-v3.1.x；RK3308 lts-v4.1.x；RV1109/RV1126 lts-v3.1.x；RV1103/RV1106、RK2118、RK3506 lts-v4.1.x。删除封面日期/密级、法律声明、联系方式、读者对象、修订表及PDF目录；不删除代码必要注释。

## 图片与可编辑恢复

16幅原图独立保存，包含显示路径、软件框架、矩阵、数据对齐表、Kconfig、扫描时序、初始化代码、两页数据包类型、DCS/Generic表、调光示例和两张局部刷新坐标图。没有以整页PDF图替代正文。

原生14个表格片段完整转Markdown；图片中的RK2108全部16行对齐表、两页全部34项包类型（含保留项）、DCS/Generic子表、调光寄存器表均另行转录。矩阵表达式、Kconfig diff、初始化命令截图片段、单条命令和调光代码另转可复制代码；原图保留便于追溯。跨页路径软换行、void指针断行、Color Key表达式软换行修复，标识符/常量未改。

## 疑点及限制

- 第5页VOP表确写`dsp/rockchip-common/drivers/drv_vop.h`，其他路径为bsp；按源保留并提示核对。
- 第10页矩阵图将列向量放在3x3矩阵左侧，维度/顺序存在疑问；忠实转录，不推导替代公式。0.0691→0x05、0.0880→0x08等定点结果与乘0x80叙述不一致；值全部原样保留。
- 第11页数据表`YUVY422`原拼写保留；不猜为其他格式。4bit/8bit标签及各对齐数值分别保留。
- 第13页时序表用hsync-porch/vsync-porch，图用hsync/vsync pulse；MIPI CLK Lane单位写Mbps，保留来源并提示按屏规格确认。
- 结构体表没有列出示例使用的yrgbLength、cbcrLength、crtcW等全部字段；不补造SDK定义。
- 第14页初始化数组截图是截断示例，恢复可见部分但不补造尾部或额外寄存器写。第12页diff hunk计数保留，不宣称可直接应用。
- display_test仅RK2108；其他平台用原文所述modetest。此为RT-Thread BSP/HAL参考，不是Linux DRM教程或全部ArmSoM支持声明。
- 具体ArmSoM板卡、供电、接口、面板时序、VOP/HAL版本仍需核对；未运行面板初始化、硬件测试或修改供电。

## 验收

全部源页已提取并查看缩略图，重点图表页10–17逐页视觉复核；文件完整性与统一构建/HTTP/SEO检查见批次报告。浏览器目录高亮/窄屏交互仍按用户要求待后续验收。
