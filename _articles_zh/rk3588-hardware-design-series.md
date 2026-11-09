---
title: "RK3588 硬件设计系列：30 个电路、PCB 与验证主题"
description: "从电路、PCB 到验证，结合 AIM7、Sige7 和 LM7 理解 RK3588 硬件设计。"
excerpt: "从电路、PCB 到验证，结合 AIM7、Sige7 和 LM7 理解 RK3588 硬件设计。"
translation_key: "rk3588-hardware-design-series"
slug: "rk3588-hardware-design-series"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["AIM7", "Sige7", "LM7"]
tags: ["RK3588", "hardware design", "AIM7", "Sige7", "LM7"]
image: "/assets/rk3588-hardware-series/rk3588-cn-p21.png"
---
# RK3588 硬件设计系列：30 个电路、PCB 与验证主题

本文依据 RK3588 Hardware Design Guide V1.3（2023-02-13）中英文原稿整理，面向芯片主板和载板设计审查。AIM7、LM7 载板须遵循模块接口定义；Sige7 可作为软件与外设验证起点。芯片能力不等于板卡接口清单，SDK/BSP、内核、板卡版本及固件需逐项核对。数值为原稿参考，未经 ArmSoM 硬件实测。

## 学习路线

AIM7 适合基于计算模块设计载板；LM7 面向 LGA 模块集成；Sige7 可用于开发前期的软件与外设评估。使用模块时先检查哪些电源、DDR 与启动电路已在模块内完成，不应把芯片参考电路重复放到载板上。实际连接器、可用接口、电平与系统支持以对应产品资料为准。

1. [RK3588 边缘 AI 设备设计：从负载到验证计划](/zh/articles/rk3588-edge-ai-hardware-design/)
2. [RK3588 时钟电路：24MHz、32kHz 与布局](/zh/articles/rk3588-clock-hardware-design/)
3. [RK3588 复位、看门狗与过温保护](/zh/articles/rk3588-reset-watchdog-hardware/)
4. [RK3588 启动与恢复：Maskrom、JTAG 和 UART](/zh/articles/rk3588-boot-debug-hardware/)
5. [RK3588 电源域：首次供电与未用 PHY](/zh/articles/rk3588-power-rail-planning/)
6. [RK3588 上下电时序：RESETn 与 S0/S3](/zh/articles/rk3588-power-sequencing-design/)
7. [RK3588 与 RK806：单、双 PMIC 电源树](/zh/articles/rk3588-rk806-pmic-design/)
8. [RK3588 DDR 原理图：LPDDR4/4X/5 与容量配置](/zh/articles/rk3588-ddr-circuit-design/)
9. [RK3588 DDR 布线：等长与等延时](/zh/articles/rk3588-ddr-pcb-routing/)
10. [RK3588 eMMC：时钟、上拉与 Strobe](/zh/articles/rk3588-emmc-hardware-design/)
11. [RK3588 FSPI Flash：启动、供电与匹配](/zh/articles/rk3588-fspi-boot-hardware/)
12. [RK3588 SDMMC 与 SDIO Wi-Fi：电压切换和防护](/zh/articles/rk3588-sdmmc-sdio-wifi-design/)
13. [RK3588 USB 与 Type-C：控制器、PHY 和恢复口](/zh/articles/rk3588-usb-typec-hardware-design/)
14. [RK3588 SATA：三路控制器与 Combo PHY 复用](/zh/articles/rk3588-sata-hardware-design/)
15. [RK3588 PCIe：通道分配、参考时钟与电源](/zh/articles/rk3588-pcie-hardware-design/)
16. [RK3588 摄像头：CSI、D/C PHY 与 CIF 接口规划](/zh/articles/rk3588-camera-hardware-design/)
17. [RK3588 HDMI RX：采集输入、CEC 与 DDC 电平](/zh/articles/rk3588-hdmi-rx-hardware-design/)
18. [RK3588 HDMI TX：FRL、TMDS 与兼容电路](/zh/articles/rk3588-hdmi-tx-hardware-design/)
19. [RK3588 MIPI 显示：D-PHY、C-PHY 与屏幕配套](/zh/articles/rk3588-mipi-display-hardware/)
20. [RK3588 DP 与 eDP：PHY 复用、AUX 与耦合](/zh/articles/rk3588-dp-edp-hardware-design/)
21. [RK3588 音频硬件：I2S、PDM 与多麦克风](/zh/articles/rk3588-audio-hardware-design/)
22. [RK3588 以太网硬件：GMAC、PHY 与时钟方向](/zh/articles/rk3588-gmac-hardware-design/)
23. [RK3588 GPIO 与 SARADC：电源域和按键边界](/zh/articles/rk3588-gpio-saradc-hardware/)
24. [RK3588 UART、SPI、CAN、I2C 与 PWM 分配](/zh/articles/rk3588-serial-control-hardware/)
25. [RK3588 PCB 叠层与扇出：HDI 和通孔板选择](/zh/articles/rk3588-pcb-stackup-fanout/)
26. [RK3588 高速 PCB：8GT/s 以上的焊盘与过孔优化](/zh/articles/rk3588-high-speed-pcb-review/)
27. [RK3588 电源 PCB 与 PDN：铜皮、回流和去耦](/zh/articles/rk3588-power-pcb-pdn-design/)
28. [RK3588 热设计：参考热阻与整机验证](/zh/articles/rk3588-thermal-hardware-design/)
29. [RK3588 ESD 与 EMI：接口保护和整机回流](/zh/articles/rk3588-esd-emi-hardware-design/)
30. [RK3588 焊接与存储：回流曲线、MSL3 和烘烤记录](/zh/articles/rk3588-assembly-storage-design/)

## 如何使用原图

下图为原稿参考页，包含对应电路图或时序图；点击可查看大图。位号和元件值属于参考设计，不是 ArmSoM 产品原理图。

- [ArmSoM AIM7](https://www.armsom.org/aim7)

- [ArmSoM Sige7](https://www.armsom.org/sige7)

- [ArmSoM LM7](https://www.armsom.org/lm7)
