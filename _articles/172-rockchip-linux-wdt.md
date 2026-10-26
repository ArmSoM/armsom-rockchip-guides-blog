---
title: "Rockchip Linux WDT: Driver, Feeding, Timeouts and Counter Pause"
description: "Rockchip Linux WDT: Driver, Feeding, Timeouts and Counter Pause — V1.3.0 / V1.2.1"
excerpt: "Rockchip Linux WDT: Driver, Feeding, Timeouts and Counter Pause"
translation_key: "172-rockchip-linux-wdt"
slug: "172-rockchip-linux-wdt"
lang: "en"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, WDT, Watchdog]
---

{% raw %}

# Rockchip Linux WDT: Driver, Feeding, Timeouts and Counter Pause

ArmSoM platform reference based on Chinese RK-KF-YF-078 V1.3.0 (Linux 4.4/4.19/5.10/6.1); English V1.2.1 lists kernels only through 5.10. Verify the actual board, BSP, kernel configuration and registers against its SoC/TRM; this is not a claim of universal ArmSoM support. The English-only RK356X GRF explanation is retained below. Neither source contains independent technical figures. No examples were executed or hardware tested.

Source caveats: RK3506 devmem uses `0x0xff288028`, unlike io’s `0xff288028`. RK3588 pause `0x00010001` and resume `0x00100000` have different masks in both sources. Values are retained, not endorsed for execution: check the TRM/actual BSP first. The 100MHz example states 21 seconds (approximately 21.47 seconds mathematically); its original formula is retained. close/V/nowayout behavior depends on the actual driver/kernel. Register writes or stopping feeding may restart the device.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. WDT driver

### 1.1 Driver file

Driver location: `drivers/watchdog/dw_wdt.c`.

### 1.2 DTS node configuration

See `Documentation/devicetree/bindings/watchdog/dw_wdt.txt`. The relevant parameters are:

`interrupts = <GIC_SPI 120 IRQ_TYPE_LEVEL_HIGH 0>;`

In interrupt mode, an interrupt is triggered first; a reset signal follows after another timeout period.

`clocks = <&cru PCLK_WDT>;`

This clock drives WDT and determines each counting period.

## 2. Using WDT

An application controls the watchdog through `/dev/watchdog`, as in the following example.

```text
int main(void)
{
    int fd = open("/dev/watchdog", O_WRONLY);    // open starts watchdog
    int ret = 0;
    if (fd == -1) {
        perror("watchdog");
        exit(EXIT_FAILURE);
    }
    while (1) {
        ret = write(fd, "\0", 1);      // write feeds watchdog
        if (ret != 1) {
            ret = -1;
            break;
        }
        sleep(10);
    }
    close(fd);
    return ret;
}
```

About `close()`:

1. Normally, after `close()` feeding stops and the watchdog eventually restarts the system. `echo A > /dev/watchdog` writes a character other than uppercase V. It executes open/write/close in sequence; the watchdog timeout then causes a system restart.

2. Call `write(fd, "V", 1);` before `close()`: writing uppercase V makes the kernel continue feeding, so the system does not automatically restart. Example: `echo V > /dev/watchdog`. Unlike step 1, the watchdog framework detects uppercase V and starts a kernel timer to feed automatically after close.

3. Enable `CONFIG_WATCHDOG_NOWAYOUT` and repeat step 2: the kernel does not continue feeding and the system restarts.

## 3. Kernel configuration

```text
Symbol: WATCHDOG [=y]
Type  : boolean
Prompt: Watchdog Timer Support
    Location:
(1) -> Device Drivers
    Defined at drivers/watchdog/Kconfig:6
```

## 4. Frequently asked questions

### 4.1 WDT cannot be stopped

WDT has no corresponding stop-control register; it can only be stopped by disabling its clock or applying a soft reset. On some chips, clock/reset operations are restricted to the secure environment. Newer SoCs indirectly support stopping WDT through external GRF registers. The supported SoCs are listed in the pause-function section.

### 4.2 WDT resolution

WDT offers only 16 levels with large count differences between adjacent levels; fine-grained counting is therefore unavailable.

```text
0000: 0x0000ffff
0001: 0x0001ffff
0010: 0x0003ffff
0011: 0x0007ffff
0100: 0x000fffff
0101: 0x001fffff
0110: 0x003fffff
0111: 0x007fffff
1000: 0x00ffffff
1001: 0x01ffffff
1010: 0x03ffffff
1011: 0x07ffffff
1100: 0x0fffffff
1101: 0x1fffffff
1110: 0x3fffffff
1111: 0x7fffffff
```

For a 100 MHz WDT clock, the source gives a maximum timeout of `0x7fffffff / 100MHz = 21 seconds`. Adjust the corresponding WDT clock if a longer timeout is required.

### 4.3 Pausing the counter

Rockchip’s `io` or BusyBox `devmem` can pause and resume counting. Configure these two kernel options. Enable:

```text
CONFIG_DEVMEM
```

Disable:

```text
CONFIG_STRICT_DEVMEM
```

The following addresses are external WDT registers. Consult the GRF chapter of the relevant chip TRM.

| Chip | Pause | Resume |
| --- | --- | --- |
| RK356X | io -4 0xfdc60504 0x00100010 or busybox devmem 0xfdc60504 32 0x00100010 | io -4 0xfdc60504 0x00100000 or busybox devmem 0xfdc60504 32 0x00100000 |
| RK3588 | io -4 0xfd58c000 0x00010001 or busybox devmem 0xfd58c000 32 0x00010001 | io -4 0xfd58c000 0x00100000 or busybox devmem 0xfd58c000 32 0x00100000 |
| RV1126B | io -4 0x2010000c 0x04000400 or busybox devmem 0x2010000c 32 0x04000400 | io -4 0x2010000c 0x04000000 or busybox devmem 0x2010000c 32 0x04000000 |
| RV1103B | io -4 0x20150008 0x00020002 or busybox devmem 0x20150008 32 0x00020002 | io -4 0x20150008 0x00020000 or busybox devmem 0x20150008 32 0x00020000 |
| RK3506<br>wdt0 | io -4 0xff288028 0x1 or busybox devmem 0x0xff288028 32 0x1 | io -4 0xff288028 0x0 or busybox devmem 0x0xff288028 32 0x0 |
| RK3506<br>wdt1 | io -4 0xff288028 0x4 or busybox devmem 0x0xff288028 32 0x4 | io -4 0xff288028 0x0 or busybox devmem 0x0xff288028 32 0x0 |
| RK2118 | io -4 0x50210028 0x10001 or busybox devmem 0x50210028 32 0x10001 | io -4 0x50210028 0x10000 or busybox devmem 0x50210028 32 0x10000 |
| RK3576 | io -4 0x2600a010 0x400040 or busybox devmem 0x2600a010 32 0x400040 | io -4 0x2600a010 0x400000 or busybox devmem 0x2600a010 32 0x400000 |
| RK3528 | io -4 0xff380000 0x00100010 or busybox devmem 0xff380000 32 0x00100010 | io -4 0xff380000 0x00100000 or busybox devmem 0xff380000 32 0x00100000 |

According to the source, chips not listed in this table do not support pausing.

English V1.2.1 §4.3 adds that `0xfdc60504` is SYS_GRF register GRF_SOC_CON1: writing 1 to bit4 pauses counting and writing 0 resumes it; the upper 16 bits are write-mask bits. The newer Chinese table does not expand this detail; it is retained from the English source.

{% endraw %}
