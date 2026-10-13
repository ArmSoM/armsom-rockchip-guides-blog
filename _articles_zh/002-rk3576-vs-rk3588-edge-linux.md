---
title: "如何为边缘 Linux 设计选择 RK3576 或 RK3588"
description: "从接口、内存拓扑、媒体路径和生命周期约束出发选择平台，而不是只看 TOPS 指标。"
translation_key: "002-rk3576-vs-rk3588-edge-linux"
date: 2026-10-12
author: "ArmSoM Editorial"
lang: zh
---

# 如何为边缘 Linux 设计选择 RK3576 或 RK3588

从接口、内存拓扑、媒体路径和生命周期约束出发选择平台，而不是只看 TOPS 指标。

![如何为边缘 Linux 设计选择 RK3576 或 RK3588 工作流示意图](/assets/002-rk3576-vs-rk3588-edge-linux-flow.svg)

## 本文帮助你做什么决策

对比所需的显示、摄像头、PCIe、内存和模块形态，再决定载板设计。 本文提供工程工作流，不能替代具体 ArmSoM 产品和版本的原理图、发行说明或安全说明。

## 平台背景

Sige5/CM5 使用 RK3576，Sige7/AIM7 使用 RK3588。公开资料列出的 CPU 与内存配置不同，设计冻结前应核对具体 SKU。 实践中应把板卡、BSP/镜像版本、外设版本、供电方式和可复现命令一起记录，才能让现场问题可诊断，避免实验室可用配置变成不可见依赖。

## 可复现的起始步骤

先在目标板卡上确认产品手册、镜像版本和接口连接，再执行最小验证。记录命令输出、内核版本、镜像版本、板卡版本和外设标识。

```bash
python3 - <<'PY'
requirements = {"cameras": 2, "pcie_lanes": 1, "ram_gib": 8}
print(requirements)
PY
```

![如何为边缘 Linux 设计选择 RK3576 或 RK3588 验证循环示意图](/assets/002-rk3576-vs-rk3588-edge-linux-validation.svg)

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
