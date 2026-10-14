---
title: "ArmSoM CM5 Carrier-Board Design: From Raspberry Pi Prototype to Product"
description: "A carrier-board checklist for CM5 that makes signal integrity, thermals, power and revision control explicit."
translation_key: "019-cm5-carrier-production"
slug: "cm5-carrier-production"
date: 2026-10-14
author: "ArmSoM Editorial"
category: production
products: [CM5]
tags: [CM5, RK3576, carrier board, productization]
keywords: "ArmSoM CM5 carrier design, RK3576 productization"
---

# ArmSoM CM5 Carrier-Board Design: From Raspberry Pi Prototype to Product

![CM5 productization path](../assets/019-cm5-production.svg)

The CM5 is a 55 × 40 mm RK3576 compute module. It can shorten a product schedule, but it moves risk into the carrier: power sequencing, high-speed routing, connector selection, thermal transfer and manufacturing test.

## Bring-up order

Start with power rails and serial console. Add one high-speed interface at a time, then validate USB, PCIe, camera, display and Ethernet under load. Keep a revisioned pin map; do not copy a Raspberry Pi schematic by signal name alone.

```bash
uname -a
cat /proc/device-tree/model
dmesg | grep -iE 'pcie|usb|dwc3|eth|drm'
```

ArmSoM notes a CM5 v1.2 pin-21 issue fixed in v1.3; production documentation should lock the module revision and test the affected net.

## Why it is not a drop-in

The module has RK3576 compute and documented CSI/PCIe/USB resources, but a custom carrier defines the actual connectors and electrical behavior. Jetson Nano carrier assumptions, CUDA dependencies and boot tooling do not transfer.

## References

- [CM5 product introduction](https://docs.armsom.org/armsom-cm5)
- [CM5-IO companion board](https://docs.armsom.org/armsom-cm5-io)
- [RK3576 overview](https://docs.armsom.org/blog/rk3576-sbc)

## Pre-publication check

- [ ] Freeze module revision and pin map.
- [ ] Include SI, thermal and EMC validation ownership.
- [ ] Test recovery and factory programming on the carrier.
