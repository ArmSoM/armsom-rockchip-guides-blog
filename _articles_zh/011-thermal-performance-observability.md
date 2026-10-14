---
title: "RK3576 与 RK3588 边缘系统的热与性能可观测性"
description: "把 ArmSoM 边缘系统作为受温度和工作负载影响的系统来测量，而不是只看单个跑分。"
translation_key: "011-thermal-performance-observability"
date: 2026-10-12
author: "ArmSoM Editorial"
category: power
products: [Sige5, Sige7]
lang: zh
---

# RK3576 与 RK3588 边缘系统的热与性能可观测性

把 ArmSoM 边缘系统作为受温度和工作负载影响的系统来测量，而不是只看单个跑分。

![RK3576 与 RK3588 边缘系统的热与性能可观测性 工作流示意图](/assets/011-thermal-performance-observability-flow.svg)

## 本文帮助你做什么决策

比较软件版本前，应记录温度、频率策略、负载、环境条件和散热配置。 本文提供工程工作流，不能替代具体 ArmSoM 产品和版本的原理图、发行说明或安全说明。

## 平台背景

ArmSoM 产品页给出特定板卡的工作范围，但不能替代对完整机箱、电源和负载的实际测量。 实践中应把板卡、BSP/镜像版本、外设版本、供电方式和可复现命令一起记录，才能让现场问题可诊断，避免实验室可用配置变成不可见依赖。

## 可复现的起始步骤

先在目标板卡上确认产品手册、镜像版本和接口连接，再执行最小验证。记录命令输出、内核版本、镜像版本、板卡版本和外设标识。

```bash
watch -n 1 "cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null; cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq 2>/dev/null"
```

![RK3576 与 RK3588 边缘系统的热与性能可观测性 验证循环示意图](/assets/011-thermal-performance-observability-validation.svg)

## 验证清单

- [ ] 确认 ArmSoM 板卡、版本、内存/存储 SKU 和供电方式。
- [ ] 保存 `uname -a`、镜像版本和完整串口启动日志。
- [ ] 优化性能前，确认目标硬件节点或连接器确实存在。
- [ ] 一次只改变一个变量，并保留变更前后的证据。
- [ ] 发布结果时注明负载、环境、软件版本和方法。

## 故障排查

**现象：预期的设备或行为没有出现。** 将运行镜像和设备树与产品文档比对，再检查供电、线缆方向、连接器与启动日志。

**现象：命令存在但结果异常。** 不要把示例命令当成已验证的产品配置。检查具体板卡的引脚复用、驱动、设备节点、权限与软件栈版本。

**现象：配置重启后失效。** 确认变更应位于镜像、启动配置、设备树、服务定义还是临时运行命令；保留串口日志和最小复现。

## 发布说明

本文不包含虚构的跑分、兼容性结论或实验室测量数据。若要补充实测结果，应同时给出测试单元、软件版本、负载、环境条件、重复次数和原始证据。

## 参考链接

- [ArmSoM 开源硬件开发者中心](https://docs.armsom.org/)
- [ArmSoM Sige5 RK3576 文档](https://docs.armsom.org/armsom-sige5)
- [ArmSoM Sige7 RK3588 文档](https://docs.armsom.org/armsom-sige7)
- [ArmSoM AIM5 RK3576 文档](https://docs.armsom.org/armsom-aim5)
- [ArmSoM AIM7 RK3588 文档](https://docs.armsom.org/armsom-aim7)
- [Linux 内核 DeviceTree 文档](https://docs.kernel.org/devicetree/)


## 发布前核对

- [ ] 按当前产品文档复核产品能力和引脚/接口说明。
- [ ] 按测试镜像版本更新示例命令。
- [ ] 确认图示、替代文本与最终板卡和流程一致。
- [ ] 补充 canonical URL、作者和编辑信息。
- [ ] 请技术负责人审查安全、刷写、电气和供货相关表述。
