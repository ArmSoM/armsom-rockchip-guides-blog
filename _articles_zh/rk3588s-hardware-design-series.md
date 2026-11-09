---
title: "RK3588S 硬件设计系列：30 个电路、PCB 与验证主题"
description: "从电路、PCB 到验证，结合 CM7S 与 Sige7S 理解 RK3588S 硬件设计。"
excerpt: "从电路、PCB 到验证，结合 CM7S 与 Sige7S 理解 RK3588S 硬件设计。"
translation_key: "rk3588s-hardware-design-series"
slug: "rk3588s-hardware-design-series"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM7s", "Sige7s"]
tags: ["RK3588S", "hardware design", "CM7s", "Sige7s"]
image: "/assets/rk3588s-hardware-series/rk3588s-cn-p17.png"
---
# RK3588S 硬件设计系列：30 个电路、PCB 与验证主题

本文依据 RK3588S Hardware Design Guide V1.2（2023-12-14）中文原稿，面向电路与 PCB 设计审查。CM7S 载板需遵循模块接口定义，Sige7S 可用于软件与外设评估。芯片能力不等于板卡接口清单；SDK/BSP、内核、板卡版本、固件及复用须逐项核对。数值为原稿参考，未经 ArmSoM 硬件实测。

## 学习路线

CM7S 适合定制载板：先确认模块已经完成的电源、DDR 与启动电路，再设计连接器外侧。Sige7S 可作为软件和外设评估起点。两种产品均须以对应版本资料核对接口是否引出、连接器针脚、电平、系统镜像与散热条件，不能把芯片原理图直接当成产品接线图。

1. [RK3588S 与 CM7S 载板设计：从资源分配到验证](/zh/articles/rk3588s-cm7s-carrier-design/)
2. [RK3588S 时钟电路：24MHz、32kHz 与布局](/zh/articles/rk3588s-clock-hardware-design/)
3. [RK3588S 复位、看门狗与过温保护](/zh/articles/rk3588s-reset-watchdog-hardware/)
4. [RK3588S 启动与恢复：Maskrom、JTAG 和 UART](/zh/articles/rk3588s-boot-debug-hardware/)
5. [RK3588S 电源域：首次供电与未用 PHY](/zh/articles/rk3588s-power-rail-planning/)
6. [RK3588S 上下电时序：RESETn 与 S0/S3](/zh/articles/rk3588s-power-sequencing-design/)
7. [RK3588S 与 RK806：单、双 PMIC 电源树](/zh/articles/rk3588s-rk806-pmic-design/)
8. [RK3588S DDR 原理图：LPDDR4/4X/5 与容量配置](/zh/articles/rk3588s-ddr-circuit-design/)
9. [RK3588S DDR 布线：等长与等延时](/zh/articles/rk3588s-ddr-pcb-routing/)
10. [RK3588S eMMC：时钟、上拉与 Strobe](/zh/articles/rk3588s-emmc-hardware-design/)
11. [RK3588S FSPI Flash：启动、供电与匹配](/zh/articles/rk3588s-fspi-boot-hardware/)
12. [RK3588S SDMMC 与 SDIO Wi-Fi：电压切换和防护](/zh/articles/rk3588s-sdmmc-sdio-wifi-design/)
13. [RK3588S USB 与 Type-C：控制器、PHY 和恢复口](/zh/articles/rk3588s-usb-typec-hardware-design/)
14. [RK3588S SATA：三路控制器与 Combo PHY 复用](/zh/articles/rk3588s-sata-hardware-design/)
15. [RK3588S PCIe：通道分配、参考时钟与电源](/zh/articles/rk3588s-pcie-hardware-design/)
16. [RK3588S 摄像头：CSI、D/C PHY 与 CIF 接口规划](/zh/articles/rk3588s-camera-hardware-design/)
17. [RK3588S 与 RK3588S2：摄像头 PHY 和兼容边界](/zh/articles/rk3588s-rk3588s2-hardware-differences/)
18. [RK3588S HDMI TX：FRL、TMDS 与兼容电路](/zh/articles/rk3588s-hdmi-tx-hardware-design/)
19. [RK3588S MIPI 显示：D-PHY、C-PHY 与屏幕配套](/zh/articles/rk3588s-mipi-display-hardware/)
20. [RK3588S DP 与 eDP：PHY 复用、AUX 与耦合](/zh/articles/rk3588s-dp-edp-hardware-design/)
21. [RK3588S 音频硬件：I2S、PDM 与多麦克风](/zh/articles/rk3588s-audio-hardware-design/)
22. [RK3588S 以太网硬件：GMAC、PHY 与时钟方向](/zh/articles/rk3588s-gmac-hardware-design/)
23. [RK3588S GPIO 与 SARADC：电源域和按键边界](/zh/articles/rk3588s-gpio-saradc-hardware/)
24. [RK3588S UART、SPI、CAN、I2C 与 PWM 分配](/zh/articles/rk3588s-serial-control-hardware/)
25. [RK3588S PCB 叠层与扇出：HDI 和通孔板选择](/zh/articles/rk3588s-pcb-stackup-fanout/)
26. [RK3588S 高速 PCB：8GT/s 以上的焊盘与过孔优化](/zh/articles/rk3588s-high-speed-pcb-review/)
27. [RK3588S 电源 PCB 与 PDN：铜皮、回流和去耦](/zh/articles/rk3588s-power-pcb-pdn-design/)
28. [RK3588S 热设计：参考热阻与整机验证](/zh/articles/rk3588s-thermal-hardware-design/)
29. [RK3588S ESD 与 EMI：接口保护和整机回流](/zh/articles/rk3588s-esd-emi-hardware-design/)
30. [RK3588S 焊接与存储：回流曲线、MSL3 和烘烤记录](/zh/articles/rk3588s-assembly-storage-design/)

## 如何使用原图

本批没有对应英文设计指南，四语统一采用中文原稿截图，图注已本地化。点击图片查看清晰原图；图片用于核对电路和布局，正文与参数表可复制。页码为 PDF 物理页码。

- [ArmSoM CM7S](https://www.armsom.org/cm7s)

- [ArmSoM Sige7S](https://www.armsom.org/sige7s)
