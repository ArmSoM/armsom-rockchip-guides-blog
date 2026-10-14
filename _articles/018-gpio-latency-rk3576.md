---
title: "GPIO Timing on ArmSoM RK3576: 40-Pin Similarity Is Not Real-Time Compatibility"
description: "Validate pin mux, voltage and latency before replacing a Raspberry Pi controller with Sige5 or CM5."
translation_key: "018-gpio-latency-rk3576"
slug: "gpio-latency-rk3576"
date: 2026-10-14
author: "ArmSoM Editorial"
category: interfaces
products: [Sige5, CM5]
tags: [GPIO, RK3576, Sige5, CM5, real-time Linux]
keywords: "ArmSoM GPIO compatibility, RK3576 40 pin, Raspberry Pi migration"
---

# GPIO Timing on ArmSoM RK3576: 40-Pin Similarity Is Not Real-Time Compatibility

![GPIO timing validation](../assets/018-gpio-realtime.svg)

Sige5 documents a Raspberry Pi-compatible 40-pin header, and CM5 exposes similar signal classes through its carrier. “Compatible” still requires checking voltage, alternate functions, pull states, interrupt routing and timing.

## Validate one signal

```bash
gpioinfo
gpiomon --num-events=1000 gpiochip0 4
```

Use an oscilloscope or logic analyzer for edge-to-edge latency and jitter. A userspace GPIO loop is not a hard real-time guarantee; use kernel drivers, PREEMPT_RT or a dedicated peripheral when deadlines matter.

## Migration boundary

Raspberry Pi overlays and BCM GPIO numbers do not map directly to Rockchip names. Jetson GPIO tooling is also platform-specific. Port the electrical design and device tree, then rerun EMC and timing tests with the final carrier and cable harness.

## References

- [Sige5 hardware](https://docs.armsom.org/armsom-sige5)
- [CM5 hardware](https://docs.armsom.org/armsom-cm5)
- [Linux GPIO documentation](https://docs.kernel.org/driver-api/gpio/index.html)

## Pre-publication check

- [ ] Publish voltage and pin-mux evidence.
- [ ] Report jitter distribution, not a single best-case number.
- [ ] Identify where a hardware timer or MCU is required.
