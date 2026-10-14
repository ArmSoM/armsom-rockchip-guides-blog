---
title: "ArmSoM 迁移评估表：Sige5、Sige7、CM5 与 Forge1"
description: "基于约束评估 Raspberry Pi 或 Jetson Nano 替代方案，覆盖接口、性能、软件迁移和散热成本。"
translation_key: "021-migration-scorecard-armsom"
slug: "migration-scorecard-armsom"
date: 2026-10-14
author: "ArmSoM Editorial"
category: migration
products: [Sige5, Sige7, CM5, Forge1]
tags: [migration, Sige5, Sige7, CM5, Forge1, Jetson Nano, Raspberry Pi]
keywords: "ArmSoM 迁移评估表：Sige5、Sige7、CM5 与 Forge1, Sige5, Sige7, CM5, Forge1"
lang: zh
---

# ArmSoM 迁移评估表：Sige5、Sige7、CM5 与 Forge1

![ArmSoM 迁移评估示意](../assets/021-migration-cost.svg)

合适的替代平台应尽量降低整体工程风险。先检查接口和软件，再将 CPU/GPU/NPU 指标作为设计约束，而不是应用性能保证。

## 四种候选平台

- **Sige5 / RK3576：** 完整 SBC，双千兆以太网，6 TOPS INT8 NPU，4K 级媒体能力，5–23 V 输入。
- **Sige7 / RK3588：** 更高的 CPU/媒体处理余量，最高 32 GB 内存，8K 级编解码能力，需要更充分的散热验证。
- **CM5 / RK3576：** 面向定制载板的 55 × 40 mm 模块，载板设计成为主要风险。
- **Forge1 / RK3506J：** 工业控制与 HMI，512 MB DDR3L，双百兆以太网，RS485/CAN，-40 °C 至 85 °C 工作范围。

订购生产批量前，可使用以下工作表：

```text
interface fit = connectors + voltage + timing + driver evidence
software delta = BSP + device tree + AI runtime + update/recovery
field cost = thermal + EMC + test fixtures + service plan
```

Raspberry Pi 配件可能减少机械设计工作，但 BCM 编号和 libcamera 的平台假设仍需适配。Jetson CUDA/TensorRT 应用需要明确的 Rockchip/RKNN 迁移方案，并重新验证精度与延迟。

## 参考链接

- [Sige5 官方规格与文档](https://docs.armsom.org/armsom-sige5)
- [Sige7 官方规格与文档](https://docs.armsom.org/armsom-sige7)
- [CM5 官方规格与文档](https://docs.armsom.org/armsom-cm5)
- [Forge1 官方文档](https://docs.armsom.org/zh/armsom-forge1)

## 发布前核对

- [ ] 使用实测接口和负载证据填写评估表。
- [ ] 计入软件迁移和现场恢复成本，而不仅是 BOM。
- [ ] 分别说明“兼容”“可移植”和“可直接替换”。
