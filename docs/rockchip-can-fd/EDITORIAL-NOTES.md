# Rockchip CAN FD 三语整理与校对记录

本地审核稿，未发布。中文技术基准为 `docs/cn/Common/CAN/Rockchip_Developer_Guide_CAN_FD_CN.pdf`，RK-KF-YF-162 V1.3.0（2025-04-08），9 页，SHA-256：`91de36eb3e0606dab3a18b41c6d51d0c6e832152a2b9b05cf7c0208c76df4d11`。英文对照为 `docs/en/Common/CAN/Rockchip_Developer_Guide_CAN_FD_EN.pdf`，V1.3.0，11 页，SHA-256：`d325fadd7d3233e78655a636416f09b0538a68f4015aa7b810fc67e770d5e556`。

## 已完成范围

- 三语正文完整保留驱动路径、DTS、Kconfig/Buildroot 开关、所有 `ip`、`cansend`、`cangen`、`io` 命令、BRS 和 TDC 指令，以及两个计算公式。
- PDF 没有独立技术图像（每页 image/XObject 计数为 0）；没有以整页图片替代正文。
- 已移除封面/法律/联系资料、读者对象和修订记录；技术版本、文件 ID 和支持平台在正文和本记录中保留。

## 版本差异、提取修复和待核对项

- 中文版为 9 页，英文版为 11 页；英文将 Revision History 单列为第 3 页，目录随后开始。两者技术章节均为 CAN FD Driver、Troubleshooting、Bit Rate/Sampling Point 与 Speed Variation/Loop Delay。
- 原始多行 `ip link` 命令已在 Markdown 代码块中复原为单行，因此可复制执行；命令参数未改变。
- 原文 `0x2ac00108`、`0x2ac00110`、`0x80`、`0x19` 和 `cansend 001#aaaaaaaa` 均保持原值。这些是 RK3576 CAN FD 示例寄存器地址/值，不能套用于其他 SoC。
- 位速率公式按原文保留；`tdc_offset`、`tdc_enable` 和 `rk3576_canfd_set_bittiming()` 的最终值必须根据目标 TRM、BSP、收发器与实测环路延迟确认。

## 未经验证声明

未进行 ArmSoM CAN FD、BRS、5 Mbit/s 以上速率、TDC、回环或收发器测试。Sige5/CM5/AIM5 使用 RK3576 仅提供 SoC 层适配方向，并不证明可直接使用 CAN FD。
