---
title: "RK3576 硬件设计系列：30 个电路、PCB 与验证主题"
description: "涵盖 30 个主题的学习路线，连接原理图设计、PCB 审查与上电验证。"
excerpt: "涵盖 30 个主题的学习路线，连接原理图设计、PCB 审查与上电验证。"
translation_key: "rk3576-hardware-design-series"
slug: "rk3576-hardware-design-series"
lang: "zh"
date: "2026-11-09"
author: "ArmSoM Editorial"
category: "production"
products: ["CM5", "Sige5"]
tags: ["RK3576", "hardware design", "CM5", "Sige5"]
image: "/assets/rk3576-hardware-series/rk3576-cn-p71.png"
---
# RK3576 硬件设计系列：30 个电路、PCB 与验证主题

涵盖 30 个主题的学习路线，连接原理图设计、PCB 审查与上电验证。

本文基于 RK3576 Hardware Design Guide V1.1（2024-05-28）的中英文原稿，面向芯片主板设计。CM5 载板请以模块接口定义为准；Sige5 可用于建立软件和外设基线。指南没有限定一个可通用于所有产品的 SDK/BSP 或内核版本，实际适配需逐板核对。参数为原稿参考，不是 ArmSoM 实测。

## 从哪里开始

第一次做芯片主板，建议按下列顺序阅读；使用 CM5 做载板，则优先阅读最小系统、启动调试、电源时序与 USB，再回到模块连接器和 IO 板资料。DDR 与内部 PMIC 设计主要用于理解模块内部边界，不应照搬到载板。

1. [RK3576 最小系统与首次上电：从原理图检查到可重复启动](/zh/articles/rk3576-hardware-bringup/)
2. [RK3576 时钟电路设计：24MHz 晶体、32kHz 待机与外设时钟](/zh/articles/rk3576-clock-circuit-design/)
3. [RK3576 复位设计：NPOR、RK806S-5、看门狗与过温保护](/zh/articles/rk3576-reset-watchdog-design/)
4. [RK3576 启动与调试设计：Boot 配置、Maskrom、UART 和 JTAG](/zh/articles/rk3576-boot-debug-design/)
5. [RK3576 电源域与去耦：CPU、GPU、NPU 和 LOGIC 供电规划](/zh/articles/rk3576-power-domain-design/)
6. [RK3576 与 RK806S-5：PMIC 选型、控制引脚和反馈设计](/zh/articles/rk3576-rk806s5-pmic-design/)
7. [RK3576 电源时序与待机：复位释放、保留电源和唤醒路径](/zh/articles/rk3576-power-sequencing-standby/)
8. [RK3576 DDR 电路与供电：LPDDR4、LPDDR4X 和 LPDDR5 的区别](/zh/articles/rk3576-ddr-circuit-power/)
9. [RK3576 DDR PCB 布线：阻抗、长度、回流与 PDN 检查](/zh/articles/rk3576-ddr-pcb-routing/)
10. [RK3576 USB 与 Type-C 硬件补充：复用、下载入口和保护器件](/zh/articles/168-rockchip-rk3576-usb/)

## 如何使用参数与配图

下图为原稿参考页，包含对应电路图或时序图；点击可查看大图。位号和元件值属于参考设计，不是 ArmSoM 产品原理图。

每篇保留适用范围、典型值限定和原稿疑点。不能把芯片寻址上限写成产品标配，把参考峰值当成整板实测，或把可选接口当成已经引出的连接器。保留 SDK、板卡版本与验证记录，才便于从 Sige5 验证迁移到 CM5 定制产品。

[ArmSoM CM5](https://www.armsom.org/cm5) · [ArmSoM Sige5](https://www.armsom.org/sige5)

## 进阶专题：存储、接口与可靠性

11. [RK3576 eMMC 硬件设计：供电、上拉与 HS400 布线](/zh/articles/rk3576-emmc-hardware-design/)
12. [RK3576 UFS 硬件设计：颗粒兼容、电源顺序与高速差分线](/zh/articles/rk3576-ufs-hardware-design/)
13. [RK3576 FSPI 启动电路：NOR/NAND、电压与片选默认状态](/zh/articles/rk3576-fspi-boot-hardware/)
14. [RK3576 SD 卡与 SDIO Wi-Fi：电压切换、供电控制和射频布局](/zh/articles/rk3576-sdio-wifi-hardware/)
15. [RK3576 PCIe 设计：RC 模式、共享 PHY 与端点供电](/zh/articles/rk3576-pcie-hardware-design/)
16. [RK3576 SATA 硬件：PHY 复用、耦合与硬盘供电](/zh/articles/rk3576-sata-hardware-design/)
17. [RK3576 摄像头硬件：CSI 分组、DCPHY 模式与电源时序](/zh/articles/rk3576-camera-hardware-design/)
18. [RK3576 屏幕硬件：MIPI、RGB、背光与触摸供电](/zh/articles/rk3576-display-panel-hardware/)
19. [RK3576 HDMI 硬件：FRL/TMDS、DDC 电平与保护器件](/zh/articles/rk3576-hdmi-hardware-design/)
20. [RK3576 DP/eDP 设计：PHY 复用、AUX 与耦合电容差异](/zh/articles/rk3576-dp-edp-hardware-design/)
21. [RK3576 音频硬件：SAI、PDM、ASRC 与麦克风布局](/zh/articles/rk3576-audio-hardware-design/)
22. [RK3576 以太网硬件：RGMII 延时、PHY 时钟与网口保护](/zh/articles/rk3576-gmac-hardware-design/)
23. [RK3576 GPIO 与 SARADC：电源域、反向供电和按键采样](/zh/articles/rk3576-gpio-saradc-hardware/)
24. [RK3576 工业控制接口：UART、I2C/I3C、SPI、CAN 与 PWM](/zh/articles/rk3576-industrial-control-interfaces/)
25. [RK3576 FlexBus 与 DSMC：FPGA、PSRAM 和并行接口布线](/zh/articles/rk3576-flexbus-dsmc-hardware/)
26. [RK3576 PCB 叠层与扇出：六层、八层和混合球距 BGA](/zh/articles/rk3576-pcb-stackup-fanout/)
27. [RK3576 高速接口设计：阻抗、回流、残桩与整链路检查](/zh/articles/rk3576-high-speed-interface-design/)
28. [RK3576 电源 PCB 与 PDN：RK806S-5、反馈和大电流回路](/zh/articles/rk3576-power-pcb-pdn-design/)
29. [RK3576 散热设计：热阻、PCB 导热与持续负载验证](/zh/articles/rk3576-thermal-hardware-design/)
30. [RK3576 ESD 与 EMI：接口泄放、复位抗扰和量产检查](/zh/articles/rk3576-esd-emi-reliability-design/)
