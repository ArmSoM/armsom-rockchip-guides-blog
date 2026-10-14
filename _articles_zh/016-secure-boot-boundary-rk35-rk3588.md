---
title: "RK3576、RK3588 与 RK3506J 的安全启动边界"
description: "区分芯片能力、引导程序策略与制造管控，准确描述 ArmSoM 产品的安全属性。"
translation_key: "016-secure-boot-boundary-rk35-rk3588"
slug: "secure-boot-boundary-rk35-rk3588"
date: 2026-10-14
author: "ArmSoM Editorial"
category: production
products: [Sige5, Sige7, Forge1]
tags: [secure boot, RK3576, RK3588, Forge1, security]
keywords: "RK3576、RK3588 与 RK3506J 的安全启动边界, Sige5, Sige7, Forge1"
lang: zh
---

# RK3576、RK3588 与 RK3506J 的安全启动边界

![安全启动验证链](../assets/016-secure-boot.svg)

如果没有说明具体的验证链，仅说“支持安全启动”是不完整的。ROM、第一级加载程序、U-Boot、内核、设备树和根文件系统的签名及恢复行为可能各不相同。

## 建立证据表

为每个 ArmSoM SKU 记录 SoC、启动介质、加载程序构建版本、密钥层级、熔丝状态、调试策略和恢复步骤。不能根据 Raspberry Pi 或 Jetson Nano 的文档推断 ArmSoM 的安全属性，因为它们的信任根和工具不同。

```bash
cat /proc/cmdline
cat /proc/device-tree/compatible
dmesg | grep -iE 'verified|secure|rollback|avb'
```

上述只读命令用于确认运行环境，不能证明生产设备的熔丝配置。配置和烧录应依据板卡手册与 Rockchip 安全文档。

## 产品定位

Sige5（RK3576）和 Sige7（RK3588）面向灵活的 Linux/Android 开发，Forge1（RK3506J）面向使用 Buildroot 的工业控制。合适的安全设计取决于更新责任、物理访问条件和使用寿命，而不是 TOPS 或连接器数量。

## 参考链接

- [Sige5 官方规格与文档](https://docs.armsom.org/armsom-sige5)
- [Sige7 官方规格与文档](https://docs.armsom.org/armsom-sige7)
- [Forge1 官方文档](https://docs.armsom.org/zh/armsom-forge1)

## 发布前核对

- [ ] 明确具体启动链和密钥责任方。
- [ ] 区分实验室调试与生产熔丝策略。
- [ ] 演示镜像被拒绝后的恢复过程。
