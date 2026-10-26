---
title: "Complete Rockchip RK818/RK816 Fuel-Gauge Logs: Charger, OTG and Battery States"
description: "Complete Rockchip RK818/RK816 Fuel-Gauge Logs: Charger, OTG and Battery States — V1.1.0"
excerpt: "Complete Rockchip RK818/RK816 Fuel-Gauge Logs: Charger, OTG and Battery States — V1.1.0"
translation_key: 126-rockchip-rk818-rk816-fuel-gauge-log
slug: 126-rockchip-rk818-rk816-fuel-gauge-log
lang: en
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, PMIC, DTS, battery]
---

{% raw %}

# Complete Rockchip RK818/RK816 Fuel-Gauge Logs: Charger, OTG and Battery States

Chinese source V1.1.0; kernel scope 4.4 / 4.19. Technical-preface scope includes module concepts, functions, configuration and troubleshooting. No English PDF exists in this input: all four languages are derived fully from the Chinese source and use its original technical figures where present. ArmSoM platform reference only: verify the actual board PMIC, SoC, SDK/BSP, kernel, power tree and battery specifications. No hardware tests or blanket board-support claims.

> Code, parameters and logs are manufacturer examples, not ArmSoM measurements. Power, charging-current, voltage or thermal changes can cause power loss, damage or battery hazards; do not apply examples blindly and never disable thermal protection in normal use. Source discrepancies are retained without guessing constants; see this article’s editorial notes. Logs are source samples; values across phases do not establish one continuous test or actual battery state.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

Technical preface: RK818/RK816 provide fuel gauging and charging management with similar implementations. RK818 illustrates important logs at each stage; RK816 refers to the same explanations.

## 1. Charger/OTG detection

### 1.1 Driver files

```text
drivers/power/rk818_charger.c
```

This driver detects charger/OTG connection and removal and configures charging current. Messages use the prefix "rk818-charger: ". "ac", "usb", "dc" and "otg" identify different devices: 1 means connected and 0 disconnected. The PMIC itself cannot detect charger/OTG connection events, so charger-type detection actually relies on USB notifier-chain messages.

### 1.2 probe phase

DC-charger registration:

```text
rk818-charger: support dc
rk818-charger: not support dc
```

Registering the Type-C charger notifier chain:

```text
rk818-charger: register typec extcon evt notifier
```

Registering the conventional USB charger notifier chain:

```text
rk818-charger: register bc evt notifier
```

Device connections when probe ends:

```text
rk818-charger: ac=1, usb=0, dc=0, otg=0
```

Driver version:

```text
rk818-charger: driver version: 2.0
```

### 1.3 running phase

Charger/OTG connection and removal events from the USB notifier chain:

```text
rk818-charger: receive bc notifier event: DISCNT    // 充电器拔出
rk818-charger: receive bc notifier event: USB       // 电脑充电插⼊
rk818-charger: receive bc notifier event: AC        // 标准充电器插⼊
rk818-charger: receive bc notifier event: CDP1.5A   // CDP类型充电器插⼊
rk818-charger: receive bc notifier event: UNKNOWN   // 不识别的充电器插⼊
rk818-charger: receive bc notifier event: OTG ON    // OTG插⼊
rk818-charger: receive bc notifier event: OTG OFF   // OTG拔出
rk818-charger: detect dc charger in                 // DC插⼊
rk818-charger: detect dc charger out                // DC拔出
```

The PMIC cannot identify the charger type, but can determine whether charging equipment is connected:

```text
rk818-charger: pmic: plug out
rk818-charger: pmic: plug in
```

Changes to the 5V supply when connecting/removing OTG devices:

```text
rk818-charger: disable otg5v
rk818-charger: enable otg5v
```

Device and current information is updated after every charger/OTG connection or removal:

```text
rk818-charger: ac=1 usb=0 dc=0 otg=0 v=4200 chrg=1000 input=1800 virt=0
```

### 1.4 suspend phase

OTG 5V supply changes during suspend:

```text
rk818-charger: suspend: otg 5v on
rk818-charger: suspend: otg 5v off
```

### 1.5 shutdown phase

Current device connections during shutdown:

```text
rk818-charger: shutdown: ac=1 usb=0 dc=0 otg=0
```

## 2. Battery-charge detection

### 2.1 Driver files

```text
drivers/power/rk818_battery.c
drivers/power/rk818_battery.h
```

This driver implements the fuel gauge and provides battery-charge accounting. Messages use "rk818-bat: " for identification.

### 2.2 probe phase

The first power-on after connecting a battery produces "first on":

```text
rk818-bat: first on: dsoc=24, rsoc=24 cap=960, fcc=4000, ov=3840
```

If an abnormal shutdown, such as continued consumption after a crash, leaves the coulomb counter abnormal, the next boot forces a correction:

```text
rk818-bat: system halt last time... cap: pre=2400, now=120
```

If U-Boot has already initialized the fuel gauge, the kernel driver can skip parts of initialization to avoid repeating it:

```text
rk818-bat: initialized yet..
```

Initial coulomb-counter state during probe:

```text
rk818-bat: dsoc=32 cap=1000 v=3780 ov=3900 rv=3890 min=25 psoc=32 pcap=1000
```

Fuel-gauge version:

```text
rk818-bat: driver version 7.1
```

### 2.3 running phase

Whenever the charge changes and the driver reports it to the framework, it prints the following. The first message gives live parameter states; the second gives the parameter states captured during boot initialization, mainly for debugging.

```text
rk818-bat: changed: dsoc=22, rsoc=24, v=3820, ov=3770 c=1018, cap=960, f=4000,
st=cc cv, hotdie=0
rk818-bat: dl=10, rl=12, v=3670, halt=0, halt_n=0, max=0, init=0, sw=0, calib=0,
below0=0, force=0
```

### 2.4 suspend phase

After the system enters deep sleep, a long standby may let the battery fall below the shutdown voltage. The PMIC then generates a wake interrupt, followed by shutdown:

```text
rk818-bat: lower power yet, power off system! v=3350, c=-125, dsoc=0
```

### 2.5 shutdown phase

Important information displayed at shutdown:

```text
rk818-bat: shutdown: dl=0 rl=2 c=-1220 v=3460 cap=88 f=4000 ch=1 n=0 mode=1
rest=128
```

Meaning, in order: `<displayed SOC>` `<real SOC>` `<current>` `<voltage>` `<remaining capacity>` `<full-charge capacity>` `<charger present?>` `<ignore remaining fields…>`.

## 3. About the RK816 fuel gauge

RK816 fuel-gauge implementation is substantially similar to RK818. Charger detection and fuel-gauge changes are combined in:

```text
drivers/power/rk816_battery.c
```

Message content is very similar to RK818, with the prefix "rk816-bat:" for identification. Refer to the RK818 explanations above for RK816.

{% endraw %}
