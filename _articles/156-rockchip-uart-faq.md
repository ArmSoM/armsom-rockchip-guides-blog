---
title: "Rockchip UART FAQ: Baud Rate, Pins, Interrupts, DMA and Boot Diagnostics"
description: "Rockchip UART FAQ: Baud Rate, Pins, Interrupts, DMA and Boot Diagnostics"
excerpt: "Rockchip UART FAQ: Baud Rate, Pins, Interrupts, DMA and Boot Diagnostics"
translation_key: 156-rockchip-uart-faq
slug: 156-rockchip-uart-faq
lang: en
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: interfaces
products: []
tags: [ArmSoM, Rockchip, UART, Linux, DMA]
---

{% raw %}

# Rockchip UART FAQ: Baud Rate, Pins, Interrupts, DMA and Boot Diagnostics

Complete translation of all 13 chapters of Chinese V1.1.0. The source covers Rockchip Linux platforms, with kernel 3.10, 4.4, 4.19 and RK3568 register examples. No English original exists in this input; English, Russian and German are full translations of Chinese.

ArmSoM platform reference only: verify the board SoC, SDK/BSP, kernel driver, DTS pin mux, voltage levels and external circuit. Universal board support is not claimed. No standalone technical figures occur in the source; all code, logs and configurations remain copyable text. Source test descriptions are not ArmSoM measurements. No register, flashing or other hardware commands were executed.

> Direct register access, clock changes or disabling the console can break communication, remove debugging access or prevent boot. Verify against the exact chip TRM/BSP; do not reuse RK3568 addresses on other chips. The source uses 115200 as the crystal/PLL boundary in 2.1 but 1.5M in 2.2.3; this inconsistency remains unresolved and is not a universal driver rule. The source statement about RS232 support does not imply that SoC pins tolerate RS232 voltages; verify physical levels and transceivers.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip kernel](https://github.com/rockchip-linux/kernel)

## 1. Usage

### 1.1 Related documents

Before using this FAQ, read Rockchip_Developer_Guide_UART_CN (Rockchip Linux Kernel UART development) and the UART chapter of Rockchip_Developer_Guide_UBoot_Nextdev_CN (Rockchip U-Boot UART development) to understand UART features, use and debugging. The same symptom may require different solutions depending on the application and hardware/software platform. The source states that basic UART transmission and reception in Rockchip SDKs have been tested. For an older SDK, obtain current SDK source and compare UART drivers. Contact the FAE through Rockchip Redmine if assistance is needed.

### 1.2 Boot logs

Characteristic messages at each boot stage identify where a UART problem occurs, allowing targeted diagnosis. After power-on or reset of a Rockchip development board, typical RK356x logs and noteworthy messages are shown below.

```text
DDR Version <version information>        # DDR阶段(TPL阶段)打印
...
U-Boot SPL board init                    # Miniloader阶段(SPL阶段)打印
U-Boot SPL <version information>
...
INFO:    Preloader serial: 2             # Trust阶段(BL31阶段)打印
NOTICE:  BL31: <version information>
NOTICE:  BL31: Built : <version information>
...
I/TC: Rockchip release version: 1.0      # OP-TEE阶段(BL32阶段)打印
I/TC: OP-TEE version: <version information>
...
U-Boot <version information>             # U-Boot阶段打印
Model: Rockchip RK3568 Evaluation Board
PreSerial: 2, raw, 0xfe660000
DRAM:  2 GiB
Sysmem: init
...
Starting kernel ...
[    0.000000] Booting Linux             # Linux Kernel earlycon打印
[    0.000000] Linux version <version information>
[    0.000000] Machine model: Rockchip RK3568 EVB2 LP4X V10 Board
[    0.000000] earlycon: uart8250 at MMIO32 0x00000000fe660000
[    0.000000] bootconsole [uart8250] enabled
...
[    0.193783] console [ttyFIQ0] enabled # 切换到fiq_debugger打印
[    0.194484] bootconsole [uart8250] disabled
...
[    0.411356] Serial: 8250/16550 driver # 普通UART初始化
[    0.412586] fe650000.serial: ttyS1 at MMIO 0xfe650000 (irq = 67, base_baud = 1500000) is a 16550A
[    0.413461] fe690000.serial: ttyS5 at MMIO 0xfe690000 (irq = 68, base_baud = 1500000) is a 16550A
```

### 1.3 The io command

Rockchip platforms usually include the io command for direct register reads and writes. Its source is under external in the Android SDK. The following uses RK3568 UART5_M0 to demonstrate common debugging operations. UART5 pclk must be enabled before accessing its controller registers. Either configure the appropriate CRU registers using the TRM or use the following command.

```text
echo 1 > /sys/kernel/debug/clk/pclk_uart5/clk_enable_count
```

Read all UART5 controller registers:

```text
io -4 -l 0x100 0xFE690000
```

Enable UART5 sclk so that UART5 can operate normally:

```text
cat /sys/kernel/debug/clk/clk_summary | grep uart5    # UART5相关时钟
cat /sys/kernel/debug/clk/sclk_uart5/clk_rate         # UART5工作时钟频率
echo 24000000 > /sys/kernel/debug/clk/sclk_uart5/clk_rate
cat /sys/kernel/debug/clk/sclk_uart5/clk_enable_count # UART5工作时钟状态
echo 1 > /sys/kernel/debug/clk/sclk_uart5/clk_enable_count
```

Verify UART5_M0 IOMUX so that signals reach the intended pins. Look up the registers in the GRF chapter of the TRM:

```text
io -4 0xFDC60310    # uart5_iomux_sel,选择iomux group 0 或 group 1
fdc60310:  00000000 # bit 0为0,说明UART5_M0配置正确
io -4 0xFDC60020    # gpio2a1_sel和gpio2a2_sel,rx和tx的GPIO function
fdc60020:  00001331 # bit 7:4和bit 11:8均为3,说明UART5_M0 RX和TX配置正确
```

Configure UART5 registers directly for basic transmission and reception at 115200 baud:

```text
io -4 0xFE690088 0x00000007 # SRR寄存器,对UART和FIFO进行reset
io -4 0xFE690010 0x00000010 # MCR寄存器,将UART配置成loopback模式
io -4 0xFE69000C 0x00000080 # LCR寄存器,div_lat_access置1
io -4 0xFE690000 0x0000000D # DLL寄存器,配置波特率分频系数
io -4 0xFE690004 0x00000000 # DLH寄存器,配置波特率分频系数
io -4 0xFE69000C 0x00000003 # LCR寄存器,div_lat_access清0和配置UART协议参数
io -4 0xFE690010 0x00000000 # MCR寄存器,将UART配置成一般模式
io -4 0xFE690004 0x00000001 # IER寄存器,打开接收中断
io -4 0xFE690008 0x00000041 # FCR寄存器,打开FIFO,FIFO触发阈值配置为1/4
io -4 0xFE69009C            # SRT寄存器,读写RX FIFO触发阈值
io -4 0xFE6900A0            # STET寄存器,读写TX FIFO触发阈值
io -4 0xFE690000 0x00000055 # THR寄存器,发送“U”,0x55
io -4 0xFE690000            # RBR寄存器,上位机发送“U”,读取到0x55
```

Before configuring DLL and DLH, set LCR bit 7 (div_lat_access) to 1. Before that, set MCR bit 4 (loopback) to 1 to place UART in loopback mode. Otherwise, external interference on RX while DLL/DLH are being configured can put UART into the busy state, preventing LCR bit 7 from being cleared to 0 and causing an error.

### 1.4 Suppress other output

During debugging, suppress other output with:

```text
su
echo 0 > /proc/sysrq-trigger
```

## 2. Baud rate

Operation at a given baud rate mainly depends on the UART internal divider and the CRU clock-division strategy. The internal divider is controlled by DLL/DLH. The CRU working clock is usually called uart_sclk and must have a 16:1 relationship to baud rate. For accuracy, use common rates such as 115200, 460800, 921600, 1.5M, 3M or 4M; Rockchip does not guarantee nonstandard rates. See include/uapi/asm-generic/termbits.h for additional standard rates in the framework. Rockchip UART IP supports stable operation up to 4M; higher rates are not guaranteed and require changes in the UART framework. The uart_sclk backend sign_off constraint is normally 100MHz; even special applications should not exceed 6M baud. If the SDK is old, contact Rockchip to update UART sources.

### 2.1 Clock division

For Linux kernel 4.19, inspect these driver files and functions:

```text
drivers/tty/serial/8250/8250_dw.c    # dw8250_set_termios
drivers/clk/clk-fractional-divider.c # clk_fd_set_rate
drivers/clk/rockchip/clk.c           # rockchip_fractional_approximation
```

dw8250_set_termios in drivers/tty/serial/8250/8250_dw.c selects the 24M crystal for rates up to 115200, and the CRU-controlled PLL above 115200. For special rates, CRU division may have a large error; requesting twice the clock can help: sclk_rate = baud_rate x 16 x 2. To reduce jitter, the CRU fractional divider has a 20-times relationship constraint. Since UART has its own internal divider, removing this limit can still meet general signal requirements. See CLK_FRAC_DIVIDER_NO_LIMIT in rockchip_fractional_approximation in drivers/clk/rockchip/clk.c. Some older SDKs lack the patch; obtain it from Rockchip FAE.

### 2.2 Cases

#### 2.2.1 Incorrect baud measurement

Always use an oscilloscope to measure baud rate when diagnosing problems: only the captured UART TX waveform gives the actual rate. Logic-analyzer or USB-UART measurements may be unreliable. Compare three values: the baud rate measured on TX, the reported UART working-clock frequency, and the theoretical working-clock frequency from the divider strategy. If the reported clock is correct but measured baud is wrong, check the measurement procedure. If the calculated and reported input clocks differ, change the clock-division strategy or try another baud rate.

#### 2.2.2 Errors during use, normal after reboot

If transmission errors appear after prolonged operation, such as aging tests, check the source selected by the divider strategy. For a CRU PLL source, compare PLL settings before and after the failure. UART baud depends on its working clock; suspend/resume or frequency scaling can change the actual PLL frequency and thus change baud during transmission.

#### 2.2.3 Failure switching from high to low baud

If switching from low to high baud works but switching back fails, check that the UART clock switches correctly between CRU and crystal sources. Rockchip normally uses a 24MHz crystal; with the 16:1 relationship, rates up to 1.5M use the crystal and rates above 1.5M use the CRU PLL. Compare reported UART clock information before and after the problem to locate it.

## 3. Pin multiplexing

UART signals normally have multiple IOMUX groups. Configure and, on failure, read back both GRF register settings with io: the GPIO pin function must select the UART function among the multiplexed modules, and uart_iomux_sel must select the intended group for the controller as a whole. The GRF pinctrl code usually contains the settings, but they are manually added and Rockchip cannot guarantee every group is complete and correct; verify the actual register values.

### 3.1 Cases

#### 3.1.1 TX works on multiple IOMUX groups, RX does not

IOMUX improves pin utilization; one UART controller can select only one group. Verify successful group switching through RX. TX pins of UART M0 and M1 have no selection switch, so both may output data if both pin functions are set to UART. RX has a selection switch, so both RX pins cannot receive UART data simultaneously.

#### 3.1.2 UART fails after another module is enabled

Other modules may reconfigure shared IOMUX registers and corrupt UART transfers. Common conflicts include PWM backlight, SDMMC boot storage and JTAG (force jtag must remain disabled). Pay particular attention to modules sharing console-UART pin functions; conflicts corrupt console output. Read the affected pins' IOMUX function registers to diagnose this.

## 4. Pin levels

Wrong UART pin levels cause communication failure. TX and RX normally use internal pull-ups; on some older Rockchip platforms RX is pulled up while TX retains its default pull setting. Check RX/TX level configuration in kernel DTS, the I/O-domain setting (1v8 or 3v0) against the chip datasheet, and directly measure whether RX/TX are high at the correct voltage. Contact Rockchip hardware engineers for hardware support.

### 4.1 Cases

#### 4.1.1 PCB design errors

If software settings are correct, inspect the PCB, including but not limited to swapped RX/TX traces or traces tied high/low; flow control enabled with CTS externally forced high; mismatched peripheral levels, incorrect voltages or missing leakage protection.

#### 4.1.2 Hardware design does not match chip variant

Rockchip chip families contain variants identified by suffixes. Confirm that the chip manual used for the reference hardware design matches the exact deployed variant. Repeat the test on a Rockchip EVB and inspect pin levels when investigating such issues.

#### 4.1.3 Peripheral TX cannot pull host RX low

If peripheral TX cannot pull the host RX low to start UART transfer, first check whether it can pull other GPIO pins low. Then inspect level-shifter components between host and peripheral and whether the peripheral has sufficient drive strength.

## 5. Interrupts

UART interrupts include TX and RX; because the controller generally uses FIFOs, analyze interrupts together with FIFO configuration. Main registers: IER enables interrupts. 0x80 PTIME (Programmable THRE Interrupt Mode Enable) improves interrupt-driven sending by triggering THRI early at the TX FIFO threshold, preparing the next transfer. 0x08 MSI (Modem Status Interrupt) is fourth priority, triggered by the UART modem; related registers are MCR/MSR. 0x04 RLSI (Receive Line Status Interrupt) has highest priority and covers overrun/parity/framing errors, break interrupt and address received interrupt; related registers are LCR/LSR. 0x02 THRI (Transmitter Holding Register Interrupt), third priority, fires when TX FIFO is empty if PTIME is off, or reaches/falls below the threshold if PTIME is on. 0x01 RDI (Receive Data Interrupt), second priority, fires when RX data reaches/exceeds its threshold, or on timeout when RX FIFO has data but no new data arrives for four character times. IIR identifies the triggering subinterrupt. Besides the four types enabled by IER, it includes Busy Detect Indication as the fifth, lowest-priority type.

FCR is the FIFO control register, controlling RX/TX FIFO thresholds and related settings.

### 5.1 Cases

#### 5.1.1 Receive-interrupt threshold

The RX FIFO Trigger Level in FCR is crucial. Rockchip RX FIFO is generally 64 or 32 Bytes and supports four levels: 2'b00: 1 character in the FIFO; 2'b01: FIFO 1/4 full; 2'b10: FIFO 1/2 full; 2'b11: FIFO 2 less than full. Lower thresholds process received data sooner but consume more CPU through interrupts. The default is usually half-full. Change UART_FCR_R_TRIG_10 in serial8250_do_set_termios() in drivers/tty/serial/8250/8250_port.c. For reception errors, try 2'b00 so every received character triggers an interrupt.

## 6. DMA

Rockchip normally uses PL330 DMA; some chips use DW. Check the chip TRM. Unless stated otherwise, this section concerns PL330. Variable-length UART data requires a special PL330 strategy. DMA defaults to burst mode with burst length 1: each byte triggers a request. This follows PL330 characteristics. The default UART interrupt-mode FIFO threshold 2'b10 (half FIFO) does not match this DMA setting, so confirm FCR is changed to 2'b00 (one byte); see the interrupt section. To improve efficiency, both ends can transmit data strictly aligned to burst length, padding the final packet; burst length must match the UART FIFO threshold. During DMA reception, if burst length and threshold exceed one byte and the last packet is not padded, that packet is received by CPU interrupt through the timeout mechanism. CPU and DMA reception then compete, risking data loss. DW DMA does not have this issue, but the same scheme is used to keep controller configuration consistent. During DMA operation, confirm the start/end positions of each transfer and the DMA controller enable state before starting the next transfer.

### 6.1 Cases

#### 6.1.1 DMA configuration differs between kernels

After an OS upgrade, blindly reusing DTS DMA settings can cause problems because kernel versions differ. For example, kernel 4.4 uses peripherals-req-type-burst, while kernel 4.19 uses arm,pl330-periph-burst for burst mode.

#### 6.1.2 Intermittent DMA reception loss at high baud

At high baud rates, DMA RX uses a circularly overwritten buffer. A small buffer may overwrite unread data and cause intermittent loss. Try increasing rx_size in serial8250_request_dma in drivers/tty/serial/8250/8250_dma.c; one PAGE_SIZE is 4k.

## 7. Hardware flow control

Use hardware automatic flow control (four-wire UART) at 1.5M baud and above or for large data volumes. Adding RTS/CTS provides greater transmission reliability than DMA alone. Do not use software flow control on Rockchip UART.

### 7.1 Cases

#### 7.1.1 Cannot send after enabling flow control

This is usually a hardware issue. Check whether PCB design errors or faults force CTS high, or whether the peer RTS cannot switch high/low and holds local CTS high after connection.

## 8. Reception errors

Reception failures mean either no data or corrupted data. Hardware: verify internal RX pull-up, external voltage/current, chip pin levels, and try a better USB-serial cable/adapter. Driver: use io to disable IER interrupts, run the receive test and inspect RFL for retained data; check whether the FCR RX threshold meets requirements. Application: verify it removes data from UART FIFO, no other program uses the same UART, reporting/processing matches the RX threshold, and the receive buffer is large enough.

For an old SDK, contact Rockchip FAE for updated UART sources. Read the other sections carefully and combine them with the debugging methods in Rockchip_Developer_Guide_UART_CN.

### 8.1 Cases

#### 8.1.1 Incorrect peer transmission

Determine whether the fault is local reception or incorrect peer transmission, using an oscilloscope or USB-UART adapter. If the checks show local reception is correct, carefully verify the peer's transmitted data.

#### 8.1.2 Large receptions are segmented

Use interrupt transfer mode and check the FIFO threshold in FCR. UART receive interrupts read the IIR ID and separately process/report 4'b0100 (RX threshold) and 4'b1100 (RX timeout). Check whether the reporting logic meets application requirements. max_count must match the character-receive loop count: in kernel 3.10, receive_chars in drivers/tty/serial/rk_serial.c; in kernel 4.4/4.19, serial8250_rx_chars in drivers/tty/serial/8250/8250_port.c.

#### 8.1.3 Delayed application reads

Linux kernel is not a real-time system. UART reports data to applications through a Work Queue; a blocked queue can delay reads. In kernel 3.10 the UART framework offers interrupt-based reporting for better responsiveness, with this patch:

```text
diff --git a/drivers/tty/serial/rk_serial.c b/drivers/tty/serial/rk_serial.c
index 9870873c1200..ff81be78a53a 100644
--- a/drivers/tty/serial/rk_serial.c
+++ b/drivers/tty/serial/rk_serial.c
@@ -2074,6 +2074,9 @@ static int serial_rk_probe(struct platform_device *pdev)
        up->port.uartclk = 24000000;
 #endif

+       /* update recv data quickly instead of workqueue */
+       up->port.flags |= UPF_LOW_LATENCY;
```

Kernel 4.4 and 4.19 only support Work Queue reporting in the UART framework. Use an RTOS for strict real-time requirements.

## 9. Peripherals and other controllers

For Bluetooth, WIFI, NFC or other controllers, first determine which endpoint fails. Use the device protocol analyzer or two USB-UART adapters on host RX/TX to capture traffic. Investigate locally if the host fails; otherwise work with the device supplier. Analyze the position, count and values of erroneous bytes for patterns. Extra bytes may come from a process writing to the UART under special conditions, especially earlier-stage output when converting a console UART to a normal port. For missing data, check whether another module/process consumed it and whether UART is configured correctly. For DMA, follow the DMA section to verify settings.

### 9.1 Cases

#### 9.1.1 Bluetooth transfer errors

For Bluetooth at 1.5M baud or above and large data volumes, select four-wire Bluetooth with hardware flow control. The source reports that prolonged testing showed playback stalls with two-wire Bluetooth, even with DMA, when using headsets/speakers. The bottleneck is mainly the Bluetooth module, so host-side optimization cannot solve it. First verify the supplier firmware, updating it along with OS upgrades. Use the pin-level and IOMUX sections for host diagnosis. For four-wire Bluetooth, RTS pinctrl is switched in the Bluetooth node while CTS pinctrl is switched in the UART node. This follows suspend/resume strategy and improves reception stability on wake-up. Two-wire DMA Bluetooth may warn about a missing ring buffer; configure the DMA buffer for the actual use case.

#### 9.1.2 RS485 errors

The source states that Rockchip UART does not natively support RS485 and supports only RS232. An external converter is therefore required for RS485. If RS485 fails, inspect the hardware circuit and signal levels.

## 10. Console output

Rockchip console output uses fiq_debugger. Because FIQ disables global interrupts, printing is threaded: data is written to memory before output. Enable CONFIG_RK_CONSOLE_THREAD=y. See Rockchip_Developer_Guide_UART_CN for code/configuration; obtain updated fiq_debugger source from Rockchip FAE for old SDKs. All stages must use the same baud rate; see the section on disabling output or moving it to another UART. Increase FIFO_SIZE in the driver to enlarge the threaded-output buffer when printing large amounts of data.

### 10.1 Cases

#### 10.1.1 Shell hangs under many console test commands

This commonly occurs during automated stress tests sending many commands through the console. The Android shell can hang; use a BusyBox-based shell or bash instead.

#### 10.1.2 Carriage return and newline

Console output commonly handles carriage return `\r` (0x0D) and newline `\n` (0x0A) specially. When UART sends a newline to the terminal, it generally inserts a carriage return before it. Pay particular attention to 0x0D and 0x0A when checking ASCII UART traffic.

## 11. Suspend, wake-up and power consumption

Rockchip UART suspend/wake-up is implemented in trust. Add a wakeup source in the kernel so UART remains active as a wake-up source in suspend. Diagnose UART wake-up issues across both trust and kernel. Update trust firmware to the current SDK version; if the issue persists, contact the Rockchip Trust engineer. For stringent suspend-power limits, use a crystal as the wake-up UART working clock to avoid the CRU fractional divider's power consumption.

## 12. Disable all output or move it to another UART

UART output normally spans DDR, Miniloader, TF-A (Trusted Firmware-A), OP-TEE, U-Boot and Kernel. See the boot-log section for stage markers. There are two ways to disable all output or move it to another UART:

Use special firmware at every stage with printing disabled or redirected; early Rockchip platforms typically support only this method, so request special early-stage firmware from Rockchip. Alternatively, use parameter passing: changing the DDR Loader UART output parameters takes effect throughout the early stages; the kernel must be changed separately. Parameter passing is now the main scheme. Older SDKs may lack it in one early stage; contact Rockchip for support.

### 12.1 DDR Loader changes

To disable or redirect DDR Loader output, modify these UART parameters in rkbin/tools/ddrbin_param.txt:

```text
uart id=         # UART控制器id,配置为0xf为关闭打印
uart iomux=      # 复用的IOMUX引脚
uart baudrate=   # 115200 or 1500000
```

See ddrbin_tool_user_guide.txt for details. Regenerate ddr.bin with the following command after modification, substituting the actual ddr.bin filename used by your SDK.

```text
./ddrbin_tool ddrbin_param.txt path/to/ddr.bin
```

### 12.2 U-Boot changes

To disable U-Boot output, enable CONFIG_DISABLE_CONSOLE in menuconfig and save it to .config.

```text
console  --->
    disable console in&out
```

U-Boot output redirection follows parameter passing and needs no extra change. Parsing is implemented by board_init_f_init_serial() in arch/arm/mach-rockchip/board.c.

### 12.3 Kernel changes

#### 12.3.1 Disable kernel output

Disable CONFIG_SERIAL_8250_CONSOLE in menuconfig.

```text
Device Drivers  --->
    Character devices  --->
        Serial drivers  --->
            [ ] Console on 8250/16550 and compatible serial port
```

Find similar DTS settings and remove the UART base address and console parameters.

```text
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio";
}
```

In fiq-debugger, set serial-id to 0xffffffff and remove the UART pin-mux settings. Keep the fiq-debugger node enabled: the system still needs the fiq-debugger flow to boot normally.

```text
fiq-debugger {
    compatible = "rockchip,fiq-debugger";
    rockchip,serial-id = <0xffffffff>;
    rockchip,wake-irq = <0>;
    /* If enable uart uses irq instead of fiq */
    rockchip,irq-mode-enable = <1>;
    rockchip,baudrate = <1500000>;  /* Only 115200 and 1500000 */
    interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
    status = "okay";
    };
```

#### 12.3.2 Move kernel output

For example, to move kernel output from UART2 to UART3, find similar DTS settings and replace the UART2 base address with UART3.

```text
chosen: chosen {
    bootargs = "earlycon=uart8250,mmio32,0xfe670000 console=ttyFIQ0";
}
```

Set fiq-debugger serial-id to 3 and change the UART3 pin-mux configuration. Also disable the ordinary UART3 node now used for console output.

```text
fiq-debugger {
    compatible = "rockchip,fiq-debugger";
    rockchip,serial-id = <3>;
    rockchip,wake-irq = <0>;
    /* If enable uart uses irq instead of fiq */
    rockchip,irq-mode-enable = <1>;
    rockchip,baudrate = <1500000>;  /* Only 115200 and 1500000 */
    interrupts = <GIC_SPI 252 IRQ_TYPE_LEVEL_LOW>;
    pinctrl-names = "default";
    pinctrl-0 = <&uart3m0_xfer>;
    status = "okay";
    };
```

#### 12.3.3 Reuse console UART as a normal UART

After disabling or moving the console UART, re-enable that UART as a normal port. In DTS, first disable/move the console and release the UART, then enable its normal UART node.

### 12.4 Android changes

Android recovery must stop using console, otherwise factory reset hangs. Comment out console in android/device/rockchip/common/recovery/etc/init.rc.

```text
service recovery /sbin/recovery
    #console
    seclabel u:r:recovery:s0
```

### 12.5 Cases

#### 12.5.1 Problems after converting console to normal UART

If a converted console UART fails, repeat the test on another UART. If the other UART works, obtain special firmware from Rockchip that disables UART output directly in source, then continue diagnosis. Special earlier-stage operations, such as DDR frequency changes, may insert or lose data on a UART converted from console use.

## 13. Other issues

### 13.1 Cases

#### 13.1.1 Kernel fails to boot with some host tools

Some host serial tools, such as MobaXterm or Putty, enable Xon/Xoff software flow control by default. At boot, operations such as DDR frequency changes can produce output exceeding the host receive buffer. Software flow control then repeatedly sends Xoff (Control+S) to UART RX. During Rockchip startup, Control+S triggers U-Boot Debug mode and prevents normal boot. The source considers this default inappropriate because software flow control is unreliable and is not used on Rockchip platforms. Check the host tool settings if this occurs.

#### 13.1.2 Change UART device numbers

To change UART device numbers, for example swap ttyS3 and ttyS4, modify the DTS as follows:

```text
aliases {
    serial3 = &uart4;
    serial4 = &uart3;
}
```

To exchange console-UART and ordinary-UART device numbers, modify tty_line_name() in drivers/tty/tty_io.c directly and test for the numbers to be changed.

{% endraw %}
