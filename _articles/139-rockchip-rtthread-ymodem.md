---
title: "Rockchip RT-Thread Ymodem: Protocol, File Transfer and Compatibility"
description: "Rockchip RT-Thread Ymodem: Protocol, File Transfer and Compatibility — V1.0.0"
excerpt: "Rockchip RT-Thread Ymodem: Protocol, File Transfer and Compatibility"
translation_key: "139-rockchip-rtthread-ymodem"
slug: "139-rockchip-rtthread-ymodem"
lang: "en"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, Ymodem, UART]
---

{% raw %}

# Rockchip RT-Thread Ymodem: Protocol, File Transfer and Compatibility

Complete technical text of Chinese RK-KF-YF-076 V1.0.0, pages 6–9. The source marks product/version as general and does not validate a specific ArmSoM board, SoC or BSP. This is an RT-Thread platform reference, not a Linux kernel guide. Verify the actual RT-Thread source, UART, voltage levels, DFS and firmware configuration. No English PDF was supplied; all four languages use the four original Chinese-PDF figures, even where their labels are English. Performance and compatibility are historical source reports, not ArmSoM hardware tests.

> Editorial qualification: the source claims about File_size radix, retries after CRC errors and harmless trailing 0x1A are retained, not generalized to all Ymodem implementations. For binary firmware especially, check the implementation and compare file length/checksum before and after transfer; padding is not automatically harmless. Compatibility and upstream status refer only to the source period.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Operating principles

Ymodem transfers files over a serial port and evolved from Xmodem. Its usual data blocks contain 128 or 1024 bytes, producing packets of 133 or 1029 bytes. The source describes CRC16 checking and termination on a failed check. Chuck Forsberg considered optional packet sizes, checksum methods and error retransmission when designing Ymodem; the source attributes the many variants to these non-strict options. Software implementations may therefore be incompatible. RT-Thread primarily targets compatibility with SecureCRT. The sender/receiver exchange has three phases: handshake, transfer and termination.

![Ymodem sender/receiver exchange](/docs/rockchip-rtthread-ymodem/assets/cn-p006-figure-01.png)

Ymodem sender/receiver exchange

### 1.1 Handshake

The receiver periodically sends C (0x43), here every 1s. The sender responds with `SOH|0x00|0xFF|File_name 00 File_size NULL|CRC16|`. SOH (0x01) identifies a 128-byte block; use STX (0x02) for a 1024-byte block. 0x00 is the packet sequence number and 0xFF its complement. File_name becomes the received filename; File_size determines the storage area allocated by the receiver. The source says File_size is normally the byte count in hexadecimal ASCII, but SecureCRT uses decimal ASCII. The final two bytes contain CRC16. The receiver returns ACK (0x06), followed by C (0x43), to start file transfer. If no sender packet arrives after repeated C requests, the receiver times out; this example allows 10 attempts.

### 1.2 Transfer

The sender sends `SOH|0x01|0xFE| Data[0~127] |CRC16|`; the receiver acknowledges with ACK (0x06), then the sender proceeds to the next packet. The source states that SecureCRT does not request retransmission with NAK (0x15) after an erroneous data packet, but aborts instead. Its original test, using the application procedure below, reportedly transferred a file larger than 5M at 115200 baud without an error. The final packet is `SOH|0x??|0x??| Data[0~??] 0x1A |CRC16|`. A short block is padded to 128 bytes with 0x1A, representing Ctrl+Z/end-of-file. The source calls trailing 0x1A bytes normal and says they do not affect the file or its use; see the qualification above. During transfer the sender can send CAN (0x18), or the terminal user can press Ctrl+C, to cancel.

### 1.3 Termination

The sender sends EOT (0x04). The receiver requests confirmation with NAK (0x15); the sender repeats EOT (0x04), and the receiver returns ACK (0x06), ending this file. The receiver sends C (0x43) to request another file. If none remains, the sender sends `SOH|0x00|0xFF| NULL |CRC16|`; the receiver responds ACK (0x06). The Ymodem session is then complete.

## 2. Application guide

### 2.1 Ymodem configuration

The protocol and application examples are under `/components/utilities/ymodem`: ymodem.c and ymodem.h implement the protocol; ry_sy.c implements file reception/transmission. Run `scons --menuconfig` and enable Ymodem under Utilities. Other vendors often use Ymodem for RT-Thread OTA upgrades, which need not depend on DFS. Rockchip mainly uses it for files, so ry_sy.c must read/write DFS. Enabling file transfer enables the ry_sy commands. CRC Table optionally uses a lookup table instead of direct calculation. This is theoretically faster, but the source reports no significant gain for 128-byte blocks at 115200 baud; disabling it saves storage. Compile and download the configured firmware, then use Ymodem over the serial port.

```text
RT-Thread Components --->
            Utilities --->
                [*] Enable Ymodem
                    [ ] Enable CRC Table in Ymodem
                    [*] Enable file transfer feature
```

### 2.2 Receiving files

Reception uses the Console by default; a command argument selects another UART. Enter `ry`: the Console prints C while waiting for the host. In SecureCRT choose Transfer → Send Ymodem and select the file. Progress is displayed during reception. For another device, for example, enter `ry uart2`. During file transfer, all serial printing is temporarily disabled.

![Original receive-file example](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-01.png)

Original receive-file example

```text
msh />ry
CCCC
Starting ymodem transfer.  Press Ctrl+C to cancel.
Transferring test.mp3...
  100%    2476 KB       3 KB/sec    00:10:51       0 Errors
```

Received files are saved in the root directory by default. Change fpath in `_rym_recv_begin` in ry_sy.c to select another destination.

### 2.3 Sending files

Sending also defaults to the Console; an argument selects another UART. Enter `sy file_path` and wait for the host. In SecureCRT choose Transfer → Receive Ymodem. Progress is displayed during transmission. Use `sy file_path uart2` for uart2. During file transfer all serial printing is temporarily disabled.

![Original send-file example](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-02.png)

Original send-file example

```text
msh />sy /test.mp3

Starting ymodem transfer.  Press Ctrl+C to cancel.
Transferring test.mp3...
  100%    2476 KB       3 KB/sec    00:10:52       0 Errors
```

Use an absolute file path; relative paths are not supported by this source version. The receiver creates a filename containing the entire path. Modify `_rym_send_begin` in ry_sy.c to parse and strip the directory portion if required.

## 3. Known issues and planned improvements

At the time of the source, both protocol and application code had been upstreamed and merged into RT-Thread master, as shown. The source lists these further development goals:

1. Support sending packets with 1024-byte data blocks.

2. At 115200 baud, throughput was stable around 4kB/s. Raising the baud rate to 1.5M or more caused transfer errors.

3. At 115200 baud, the theoretical limit was 11kB/s and the practical limit 8kB/s; protocol overhead was substantial.

4. Support more terminal applications.

![Original RT-Thread merge-record screenshot](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-03.png)

Original RT-Thread merge-record screenshot

## 4. Software compatibility reported by the source

| Operating system | Terminal | Receive | Send |
| --- | --- | --- | --- |
| Windows | SecureCRT | Supported | Supported |
| MacOS | SecureCRT | Not supported | Supported |
| MacOS | Minicom | Not supported | Not supported |
| Linux | Minicom | Supported | Not supported |

{% endraw %}
