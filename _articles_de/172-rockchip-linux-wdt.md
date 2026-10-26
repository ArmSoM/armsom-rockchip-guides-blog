---
title: "Rockchip Linux WDT: Treiber, Füttern, Timeout und Zählpause"
description: "Rockchip Linux WDT: Treiber, Füttern, Timeout und Zählpause — V1.3.0 / V1.2.1"
excerpt: "Rockchip Linux WDT: Treiber, Füttern, Timeout und Zählpause"
translation_key: "172-rockchip-linux-wdt"
slug: "172-rockchip-linux-wdt"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux, WDT, Watchdog]
---

{% raw %}

# Rockchip Linux WDT: Treiber, Füttern, Timeout und Zählpause

ArmSoM-Plattformreferenz nach dem chinesischen RK-KF-YF-078 V1.3.0 (Linux 4.4/4.19/5.10/6.1); Englisch V1.2.1 nennt Kernel nur bis 5.10. Platine, BSP, Kernelkonfiguration und Register anhand des konkreten SoC/TRM prüfen; keine pauschale Unterstützung aller ArmSoM-Platinen. Die zusätzliche englische RK356X-GRF-Erklärung steht unten. Beide Quellen enthalten keine eigenständigen technischen Abbildungen. Keine Beispiele ausgeführt oder Hardwaretests durchgeführt.

Quellenunklarheiten: Für RK3506 steht bei devmem `0x0xff288028`, bei io dagegen `0xff288028`. RK3588-Pause `0x00010001` und Fortsetzen `0x00100000` verwenden in beiden Quellen unterschiedliche Masken. Werte bleiben erhalten, sind aber keine Freigabe zur Ausführung: zuerst TRM/BSP prüfen. Das 100MHz-Beispiel nennt 21 Sekunden (rechnerisch etwa 21,47); die ursprüngliche Formel bleibt erhalten. close/V/nowayout hängen vom konkreten Treiber/Kernel ab. Registerzugriffe oder unterlassenes Füttern können das Gerät neu starten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. WDT-Treiber

### 1.1 Treiberdatei

Treiberpfad: `drivers/watchdog/dw_wdt.c`.

### 1.2 DTS-Knotenkonfiguration

Siehe `Documentation/devicetree/bindings/watchdog/dw_wdt.txt`. Wesentliche Parameter:

`interrupts = <GIC_SPI 120 IRQ_TYPE_LEVEL_HIGH 0>;`

Im Interruptmodus wird zuerst ein Interrupt ausgelöst; nach einem weiteren Timeoutintervall folgt das Resetsignal.

`clocks = <&cru PCLK_WDT>;`

Dieser Takt betreibt WDT und bestimmt die Zählperiode.

## 2. WDT verwenden

Eine Anwendung steuert den Watchdog über `/dev/watchdog`, wie im folgenden Beispiel.

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

Zu `close()`:

1. Nach einem normalen `close()` wird nicht mehr gefüttert; der Watchdog startet das System nach Ablauf des Timeouts neu. `echo A > /dev/watchdog` schreibt ein Zeichen ungleich dem großen V. Dabei werden open/write/close nacheinander ausgeführt; anschließend führt der Timeout zum Neustart.

2. Vor `close()` wird `write(fd, "V", 1);` aufgerufen: Beim großen V füttert der Kernel weiter, sodass kein automatischer Neustart erfolgt. Beispiel: `echo V > /dev/watchdog`. Anders als in Schritt 1 erkennt das Watchdog-Framework V und startet einen Kernel-Timer zum automatischen Füttern nach close.

3. `CONFIG_WATCHDOG_NOWAYOUT` aktivieren und Schritt 2 wiederholen: Der Kernel füttert nicht weiter; das System startet neu.

## 3. Kernelkonfiguration

```text
Symbol: WATCHDOG [=y]
Type  : boolean
Prompt: Watchdog Timer Support
    Location:
(1) -> Device Drivers
    Defined at drivers/watchdog/Kconfig:6
```

## 4. Häufige Fragen

### 4.1 WDT lässt sich nicht stoppen

WDT besitzt kein entsprechendes Stopp-Steuerregister; zum Stoppen muss der Takt deaktiviert oder ein Soft-Reset ausgelöst werden. Bei manchen Chips sind Takt-/Resetoperationen nur in der sicheren Umgebung möglich. Neuere SoCs unterstützen das Stoppen indirekt über externe GRF-Register. Die entsprechenden SoCs sind im Abschnitt zur Zählpause aufgeführt.

### 4.2 WDT-Auflösung

WDT bietet nur 16 Stufen mit großen Zähldifferenzen zwischen benachbarten Stufen; eine feine Abstufung ist daher nicht möglich.

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

Bei 100 MHz WDT-Takt nennt die Quelle einen maximalen Timeout von `0x7fffffff / 100MHz = 21 Sekunden`. Für einen längeren Timeout muss der entsprechende WDT-Takt angepasst werden.

### 4.3 Zähler pausieren

Mit Rockchips `io` oder BusyBox `devmem` lässt sich der Zähler pausieren und fortsetzen. Die beiden Kerneloptionen wie folgt einstellen. Aktivieren:

```text
CONFIG_DEVMEM
```

Deaktivieren:

```text
CONFIG_STRICT_DEVMEM
```

Die folgenden Adressen gehören zu externen WDT-Registern. Siehe das GRF-Kapitel des TRM für den jeweiligen Chip.

| Chip | Pause | Fortsetzen |
| --- | --- | --- |
| RK356X | io -4 0xfdc60504 0x00100010 oder busybox devmem 0xfdc60504 32 0x00100010 | io -4 0xfdc60504 0x00100000 oder busybox devmem 0xfdc60504 32 0x00100000 |
| RK3588 | io -4 0xfd58c000 0x00010001 oder busybox devmem 0xfd58c000 32 0x00010001 | io -4 0xfd58c000 0x00100000 oder busybox devmem 0xfd58c000 32 0x00100000 |
| RV1126B | io -4 0x2010000c 0x04000400 oder busybox devmem 0x2010000c 32 0x04000400 | io -4 0x2010000c 0x04000000 oder busybox devmem 0x2010000c 32 0x04000000 |
| RV1103B | io -4 0x20150008 0x00020002 oder busybox devmem 0x20150008 32 0x00020002 | io -4 0x20150008 0x00020000 oder busybox devmem 0x20150008 32 0x00020000 |
| RK3506<br>wdt0 | io -4 0xff288028 0x1 oder busybox devmem 0x0xff288028 32 0x1 | io -4 0xff288028 0x0 oder busybox devmem 0x0xff288028 32 0x0 |
| RK3506<br>wdt1 | io -4 0xff288028 0x4 oder busybox devmem 0x0xff288028 32 0x4 | io -4 0xff288028 0x0 oder busybox devmem 0x0xff288028 32 0x0 |
| RK2118 | io -4 0x50210028 0x10001 oder busybox devmem 0x50210028 32 0x10001 | io -4 0x50210028 0x10000 oder busybox devmem 0x50210028 32 0x10000 |
| RK3576 | io -4 0x2600a010 0x400040 oder busybox devmem 0x2600a010 32 0x400040 | io -4 0x2600a010 0x400000 oder busybox devmem 0x2600a010 32 0x400000 |
| RK3528 | io -4 0xff380000 0x00100010 oder busybox devmem 0xff380000 32 0x00100010 | io -4 0xff380000 0x00100000 oder busybox devmem 0xff380000 32 0x00100000 |

Laut Quelle unterstützen die nicht in der Tabelle aufgeführten Chips keine Zählpause.

Ergänzung aus Englisch V1.2.1 §4.3: `0xfdc60504` ist das SYS_GRF-Register GRF_SOC_CON1; bit4=1 pausiert, bit4=0 setzt fort. Die oberen 16 Bits bilden die Schreibmaske. Dieses in der neueren chinesischen Tabelle nicht ausgeführte Detail bleibt aus der englischen Quelle erhalten.

{% endraw %}
