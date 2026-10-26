---
title: "Rockchip Linux WDT：驱动、喂狗、超时与暂停计数"
description: "Rockchip Linux WDT：驱动、喂狗、超时与暂停计数 — V1.3.0 / V1.2.1"
excerpt: "Rockchip Linux WDT：驱动、喂狗、超时与暂停计数"
translation_key: "172-rockchip-linux-wdt"
slug: "172-rockchip-linux-wdt"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, WDT, Watchdog]
---

{% raw %}

# Rockchip Linux WDT：驱动、喂狗、超时与暂停计数

ArmSoM 平台参考，以中文 RK-KF-YF-078 V1.3.0 为主线（Linux 4.4/4.19/5.10/6.1）；英文 V1.2.1 仅列至 Linux 5.10。具体板卡、BSP、内核配置和寄存器须按实际 SoC/TRM 核对，不代表所有 ArmSoM 板卡支持。英文独有的 RK356X GRF 寄存器说明补于文末。两稿均无独立技术图。未执行示例或进行硬件验证。

原稿疑点：RK3506 的 devmem 地址写为 `0x0xff288028`，与 io 的 `0xff288028` 不一致；RK3588 暂停值 `0x00010001`、恢复值 `0x00100000` 的掩码不对称，两稿均如此。原值保留但不得据此直接执行，须先核对 TRM/实际 BSP。100MHz 示例原文将结果写为21秒（实际约21.47秒），未改写原始公式。close/V/nowayout 行为依赖具体驱动和内核；写寄存器或停止喂狗可能重启设备。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. WDT 驱动

### 1.1 驱动文件

驱动文件所在位置:drivers/watchdog/dw_wdt.c

### 1.2 DTS 节点配置

DTS 配置参考文档 为 Documentation/devicetree/bindings/watchdog/dw_wdt.txt ,本文主要说明如下参数:interrupts = &lt;GIC_SPI 120 IRQ_TYPE_LEVEL_HIGH 0&gt;;中断模式时候用于首先触发中断,再经过一个超时周期才产生复位信号。clocks = &lt;&amp;cru PCLK_WDT&gt;;驱动WDT工作,并且用于计算每个计数周期。

## 2. WDT 使用

应用操作节点来控制watchdog,示例如下:/dev/watchdog

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

关于close()

1. 正常情况下 close() ,不再喂狗,watchdog会触发系统重启。echo A &gt; /dev/watchdog , 这里写入的是除大写V以外的任意字符。以上操作会按顺序执行open/write/close三个操作,watchdog超时之后会触发系统重启。

2. write(fd, "V", 1); 再 close() ,写入大写V,内核继续喂狗,系统不会自动重启。echo V &gt; /dev/watchdog以上操作和第1步不同的是参数不同,内核watchdog框架判断到写入的值是大写V,会开启内核定时器自动喂狗,因此close之后,系统不会自动重启。

3. 配置宏 CONFIG_WATCHDOG_NOWAYOUT ,重复步奏2,内核不会继续喂狗,系统会被重启。

## 3. 内核配置

```text
Symbol: WATCHDOG [=y]
Type  : boolean
Prompt: Watchdog Timer Support
    Location:
(1) -> Device Drivers
    Defined at drivers/watchdog/Kconfig:6
```

## 4. 常见问题

### 4.1 WDT无法停止

WDT没有相应的寄存器用于配置停止功能,只能通过disable clock或者软复位来停止WDT,有些芯片的clock或者复位操作只能在安全环境执行,新的SoC通过配置外部GRF寄存器来间接支持WDT停止功能。具备停止功能的SoC在 暂停功能 章节有描述

### 4.2 WDT精度

WDT精度只有16档,相邻档位计数相差比较大,因此无法精细计数。

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

假设wdt clock为100MHz,最大超时时间 0x7fffffff / 100MHz = 21秒,如果需要更大的超时,需要调整对应的wdtclock。

### 4.3 暂停功能

使用Rockchip自带的io命令或者busybox的devmem命令可以实现暂停计数以及恢复计数。在内核里面操作以下两个配置:打开

```text
CONFIG_DEVMEM
```

关闭

```text
CONFIG_STRICT_DEVMEM
```

以下地址属于WDT外部寄存器,具体可以参考对应芯片的TRM文档的GRF章节

| 芯片 | 暂停 | 恢复 |
| --- | --- | --- |
| RK356X | io -4 0xfdc60504 0x00100010 或者 busybox devmem 0xfdc60504 32 0x00100010 | io -4 0xfdc60504 0x00100000 或者 busybox devmem 0xfdc60504 32 0x00100000 |
| RK3588 | io -4 0xfd58c000 0x00010001 或者 busybox devmem 0xfd58c000 32 0x00010001 | io -4 0xfd58c000 0x00100000 或者 busybox devmem 0xfd58c000 32 0x00100000 |
| RV1126B | io -4 0x2010000c 0x04000400 或者 busybox devmem 0x2010000c 32 0x04000400 | io -4 0x2010000c 0x04000000 或者 busybox devmem 0x2010000c 32 0x04000000 |
| RV1103B | io -4 0x20150008 0x00020002 或者 busybox devmem 0x20150008 32 0x00020002 | io -4 0x20150008 0x00020000 或者 busybox devmem 0x20150008 32 0x00020000 |
| RK3506<br>wdt0 | io -4 0xff288028 0x1 或者 busybox devmem 0x0xff288028 32 0x1 | io -4 0xff288028 0x0 或者 busybox devmem 0x0xff288028 32 0x0 |
| RK3506<br>wdt1 | io -4 0xff288028 0x4 或者 busybox devmem 0x0xff288028 32 0x4 | io -4 0xff288028 0x0 或者 busybox devmem 0x0xff288028 32 0x0 |
| RK2118 | io -4 0x50210028 0x10001 或者 busybox devmem 0x50210028 32 0x10001 | io -4 0x50210028 0x10000 或者 busybox devmem 0x50210028 32 0x10000 |
| RK3576 | io -4 0x2600a010 0x400040 或者 busybox devmem 0x2600a010 32 0x400040 | io -4 0x2600a010 0x400000 或者 busybox devmem 0x2600a010 32 0x400000 |
| RK3528 | io -4 0xff380000 0x00100010 或者 busybox devmem 0xff380000 32 0x00100010 | io -4 0xff380000 0x00100000 或者 busybox devmem 0xff380000 32 0x00100000 |

以上表格里没有列出的芯片,不支持暂停功能

英文 V1.2.1 §4.3 补充：地址 `0xfdc60504` 属于 SYS_GRF 的 GRF_SOC_CON1；bit4 写1暂停、写0恢复，高16位是写掩码。该细节在中文新版表格中未展开，按英文来源保留。

{% endraw %}
