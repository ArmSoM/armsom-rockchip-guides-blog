---
title: "RKNN board proxy: setup, deployment and mini-runtime"
description: "RKNN board proxy: setup, deployment and mini-runtime"
excerpt: "RKNN board proxy: setup, deployment and mini-runtime"
translation_key: "rknn-server-proxy"
slug: "rknn-server-proxy"
lang: "en"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

ArmSoM platform reference for evaluation on CM7S/Sige7S (RK3588S), Sige7/AIM7/LM7/W3 (RK3588), Sige5/CM5/AIM5 (RK3576), and relevant RK3568 platforms. Match the board OS, NPU driver, SDK, Runtime and Toolkit2. No specific BSP/kernel combination or ArmSoM hardware test was verified for this article. Validation statements in the source refer only to its original environment.

Source: local Chinese rknn_server_proxy.md, with no English original or figures; English, Russian and German are full translations. Section 1 contradicts section 4 on librknnrt.so applicability. FAQ 4 uses /usr/bin whereas section 4.3 uses /oem/usr/bin; verify actual installation paths. The 4.4 heading level and malformed dump-reset code fence were repaired without changing commands. The source includes Runtime/adbd replacement, stopping services, reboot and disabling SELinux enforcement; evaluate these in an isolated development environment, not as production configuration advice.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/CN/rknn_server_proxy.md)


<div class="series-navigation" aria-label="Board debugging series" markdown="1">

Board debugging series · 1/3

**RKNN board proxy: setup, deployment and mini-runtime**

[RKNN board debugging: enable, inspect and reset logs](/articles/rknn-server-logging/)

[RKNN troubleshooting: connections, memory, storage and permissions](/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 1. Introduction to board debugging
RKNN Toolkit2 board debugging generally requires updating rknn_server and librknnrt.so/librknnmrt.so on the board and manually starting rknn_server.
The rknn_server background proxy receives the protocol sent by the PC over USB, invokes the corresponding board runtime interfaces, and returns results to the PC.

- librknnrt.so: a board-side RKNPU Runtime library. The Chinese source literally says it is “not applicable to non-RV1103/RV1106/RV1103B platforms”; this conflicts with the later deployment steps. The contradiction is retained here for checking against the actual SDK.
- librknnmrt.so: the RKNPU Runtime library specifically for RV1103/RV1106/RV1103B/RV1126B.

After boot, use ps to check whether rknn_server is already running. If it is, manual startup is unnecessary; otherwise start it manually.

## 2. Environment requirements
### 2.1 Hardware
The source covers RV1103, RV1103B, RV1106, RV1126B, RK3562, and the RK3566, RK3568, RK3576 and RK3588 families.

### 2.2 Software
- Dynamic-shape RKNN input models require rknn_server and RKNPU Runtime >=1.5.0.
- Models larger than 2GB require rknn_server >=2.0.0b0.
- On small-memory platforms such as RV1103/RV1106/RV1103B, rknn_server >=2.1.0 is recommended.

## 3. rknn_server locations
rknn_server is stored under runtime. Select the version matching the board’s operating system and chip.
### 3.1 Android

| System | Path |
| --- | --- |
| 32-bit Android | runtime/Android/rknn_server/arm/rknn_server |
| 64-bit Android | runtime/Android/rknn_server/arm64/rknn_server |

### 3.2 Linux

| Chip | System | Path |
| --- | --- | --- |
| RV1103/RV1106/RV1103B | 32-bit Linux | runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server |
| Other chips | 32-bit Linux | runtime/Linux/rknn_server/armhf/usr/bin/rknn_server |
| Other chips | 64-bit Linux | runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server |

## 4. Startup
### 4.1 Android
From the root of the rknpu2 project, run the following on the PC to start the proxy.
1. Remount the system partition so that it is writable.

```
adb root && adb remount
```

2. Update the proxy program.

```
// 64-bit Android系统
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
// 32-bit Android系统
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
```

3. Update the RKNPU runtime library.

```
// 64-bit Android系统
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64
// 32-bit Android系统
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib
```

4. Change the proxy executable permissions.

```
adb shell chmod +x /vendor/bin/rknn_server
```

5. Start the proxy service.

```
adb shell "killall rknn_server"
adb shell "nohup /vendor/bin/rknn_server >/dev/null"&
```

6. Check that the proxy service started successfully.

```
adb shell ps -ef|grep rknn_server
```

Check for a process ID for `rknn_server`. Its presence indicates successful startup. Otherwise enter the board shell with `adb shell` and start the service manually as follows.

```
nohup /vendor/bin/rknn_server > /dev/null&
```

### 4.2 Linux, excluding RV1103/RV1106/RV1103B
1. Update the proxy program.

```
// 64-bit Linux系统
adb push runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server /usr/bin/
// 32-bit Linux系统
adb push runtime/Linux/rknn_server/armhf/usr/bin/rknn_server /usr/bin/
```

2. Update the RKNPU runtime library.

```
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

3. Change the proxy executable permissions.

```
adb shell chmod +x /usr/bin/rknn_server
```

4. Start the proxy service.

```
adb shell "killall rknn_server"
adb shell "nohup /usr/bin/rknn_server >/dev/null"&
```

5. Check that the proxy service started successfully.

```
adb shell ps -ef|grep rknn_server
```

Check for a process ID for `rknn_server`. Its presence indicates successful startup. Otherwise enter the board shell with `adb shell` and start the service manually as follows.

```
nohup /usr/bin/rknn_server > /dev/null&
```

### 4.3 Linux on RV1103/RV1106/RV1103B
These platforms use librknnmrt.so and rknn_server from armhf-uclibc.
1. Update the proxy program.

```
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server /oem/usr/bin
```

2. Update the RKNPU runtime library.

```
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib
```

3. Change the proxy executable permissions.

```
adb shell chmod +x /oem/usr/bin/rknn_server
```

4. Start the proxy service.

```
adb shell "killall rknn_server"
adb shell "nohup /oem/usr/bin/rknn_server >/dev/null"&
```

5. Check that the proxy service started successfully.

```
adb shell ps |grep rknn_server
```

Check for a process ID for `rknn_server`. Its presence indicates successful startup. Otherwise enter the board shell with `adb shell` and start the service manually as follows.

```
nohup /oem/usr/bin/rknn_server > /dev/null&
```

### 4.4 Using mini-runtime
The source also provides mini-runtime support for RV1126B. To use it on RV1126B, enable mini-rknn in rknn-toolkit2 during model conversion:

```python
rknn.config(target_platform=_target_platform, mini_rknn=True)
```

Push librknnmrt.so to the board:

```shell
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnmrt.so /oem/usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnmrt.so /oem/usr/lib
```

Push and start the matching rknn_server as above to enable board debugging. If the server connection fails, update adbd; see the FAQ.

{% endraw %}
