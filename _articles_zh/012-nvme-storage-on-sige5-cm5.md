---
title: "ArmSoM Sige5 与 CM5 的 NVMe 存储：以实测验证升级路径"
description: "分析 RK3576 的 PCIe 存储对启动、散热和应用延迟的影响，以及替代 Raspberry Pi 或 Jetson 时需要验证的条件。"
translation_key: "012-nvme-storage-on-sige5-cm5"
slug: "nvme-storage-on-sige5-cm5"
date: 2026-10-14
author: "ArmSoM Editorial"
category: storage
products: [Sige5, CM5]
tags: [RK3576, NVMe, Sige5, CM5, Raspberry Pi alternative]
keywords: "ArmSoM Sige5 与 CM5 的 NVMe 存储：以实测验证升级路径, Sige5, CM5"
lang: zh
---

# ArmSoM Sige5 与 CM5 的 NVMe 存储：以实测验证升级路径

![Sige5 与 CM5 的 NVMe 存储决策流程](../assets/012-nvme-storage.svg)

只有当负载受存储性能限制时，M.2 插槽才能带来实际收益。ArmSoM Sige5 文档列出了 M-key 插槽的一条 PCIe 2.1 通道，CM5 则通过载板提供 PCIe 扩展。这与 Raspberry Pi 的配件生态是不同的工程方案，也不意味着 Jetson Nano 应用可以获得二进制兼容性。

## 迁移时需要改变什么

保留 eMMC 或 microSD 作为恢复基线。板卡可靠启动后再加入 NVMe 设备，并测量实际应用的 I/O，而不仅是运行 `fio`。RK3576 的 CPU、文件系统、散热条件和 SSD 控制器都会影响延迟。低温、空闲条件下的跑分可能掩盖持续写入时的降频。

```bash
lsblk -o NAME,MODEL,SIZE,TRAN,MOUNTPOINT
sudo fio --name=read4k --filename=/mnt/nvme/test.bin --size=512M \
  --rw=randread --bs=4k --iodepth=16 --direct=1 --runtime=30 --time_based
```

记录内核、文件系统、SSD 型号、环境温度和供电来源。不要直接复制 Raspberry Pi 的 `config.txt` 存储配置；应根据板卡手册核对 RK3576 设备树和启动顺序。

## 如何作出迁移决策

如果需要双千兆以太网和文档所述 5–23 V 输入的完整开发板，可以考虑 Sige5。如果定制载板及产品接口的收益足以覆盖载板验证成本，可以考虑 CM5。两者都不应被描述为 Jetson Nano 的直接替换件：CUDA/TensorRT 软件仍需迁移到 Rockchip 用户空间软件栈，适用的模型还需迁移到 RKNN。

## 参考链接

- [Sige5 官方规格与文档](https://docs.armsom.org/armsom-sige5)
- [CM5 官方规格与文档](https://docs.armsom.org/armsom-cm5)
- [ArmSoM 开发者中心](https://docs.armsom.org/)

## 发布前核对

- [ ] 确认具体板卡或载板版本的 M.2 接线。
- [ ] 公布持续运行和重复测试结果，并附原始 fio 输出。
- [ ] 说明存储兼容性取决于电气连接与软件支持，不能一概而论。
