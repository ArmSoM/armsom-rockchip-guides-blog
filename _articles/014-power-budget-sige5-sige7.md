---
title: "Power Budgeting for ArmSoM Sige5 and Sige7 Deployments"
description: "A repeatable method for validating input voltage, peak current, cooling and cable drop when replacing Raspberry Pi or Jetson Nano hardware."
translation_key: "014-power-budget-sige5-sige7"
slug: "power-budget-sige5-sige7"
date: 2026-10-14
author: "ArmSoM Editorial"
category: power
products: [Sige5, Sige7, CM5]
tags: [power, thermal, Sige5, Sige7, RK3576, RK3588]
keywords: "ArmSoM power consumption, Sige5 power, Sige7 thermal"
---

# Power Budgeting for ArmSoM Sige5 and Sige7 Deployments

![Power validation chain](../assets/014-power-budget.svg)

ArmSoM documents a wide 5–23 V input range for Sige5 and Sige7, while a CM5 module uses a 5 V rail. The rating tells you what the board accepts; it does not tell you the current peak of an SSD, camera, USB device or fan.

## Measure the complete system

Use an inline meter or scope at the board connector. Test cold boot, CPU load, NPU load, display, network traffic and storage simultaneously. Log voltage at the board, not only at the adapter.

```bash
for z in /sys/class/thermal/thermal_zone*/temp; do
  printf '%s ' "$z"; cat "$z"; done
cat /sys/devices/system/cpu/cpufreq/policy*/scaling_cur_freq
```

Select a supply with margin for cable resistance and transient load. A PD negotiation that works on the bench can fail with a long cable or an enclosure fan starting at the same time.

## Migration boundary

Raspberry Pi HAT power assumptions and Jetson Nano barrel-jack expectations are not interchangeable with ArmSoM connectors. Treat connector pinout, PD profile, thermal interface and enclosure airflow as new design inputs.

## References

- [Sige5 documentation](https://docs.armsom.org/armsom-sige5)
- [Sige7 documentation](https://docs.armsom.org/armsom-sige7)
- [Sige family power guidance](https://docs.armsom.org/sige-family-started)

## Pre-publication check

- [ ] Report supply, cable, peripheral load and ambient conditions.
- [ ] Test the worst-case combined workload.
- [ ] Do not turn an input-voltage range into a consumption claim.
