---
title: "RKNN board debugging: enable, inspect and reset logs"
description: "RKNN board debugging: enable, inspect and reset logs"
excerpt: "RKNN board debugging: enable, inspect and reset logs"
translation_key: "rknn-server-logging"
slug: "rknn-server-logging"
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

Board debugging series · 2/3

[RKNN board proxy: setup, deployment and mini-runtime](/articles/rknn-server-proxy/)

**RKNN board debugging: enable, inspect and reset logs**

[RKNN troubleshooting: connections, memory, storage and permissions](/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 5. Detailed rknn_server logs
Detailed logging is disabled by default. Enable it to diagnose errors during board connections, using the procedure for your platform.
### 5.1 Android
1. Configure detailed logging and start the proxy:

```
adb logcat -c
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 5 && nohup /vendor/bin/rknn_server >/dev/null"&
```

2. Check that the proxy service started successfully.

```
adb shell ps -ef|grep rknn_server
```

3. Run the Python inference program on the PC.
4. View the runtime log.

```
adb logcat
```

5. Detailed logging slows inference. Restore the default logging level with:

```sh
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 0 && nohup /vendor/bin/rknn_server >/dev/null"&
```

### 5.2 Linux (excluding RV1103/RV1106/RV1103B)
1. Create a directory for detailed proxy logs.

```
adb shell mkdir -p /userdata
```

2. Set the logging environment and start the proxy with detailed logging.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

3. Check that the proxy service started successfully.

```
adb shell ps -ef|grep rknn_server
```

Check for a process ID for `rknn_server`. Its presence indicates successful startup. Otherwise enter the board shell with `adb shell` and start the service manually as follows.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Run the Python inference program on the PC.
5. View the log.

```
adb shell cat /userdata/server.log
```

6. Detailed logging slows inference. Restore the default logging level with:

```sh
   adb shell "killall rknn_server"
   adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

### 5.3 Linux (RV1103/RV1106/RV1103B)
1. Create a directory for detailed proxy logs.

```
adb shell mkdir -p /userdata
```

2. Set the logging environment and start the proxy with detailed logging.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

3. Check that the proxy service started successfully.

```
adb shell ps|grep rknn_server
```

Check for a process ID for `rknn_server`. Its presence indicates successful startup. Otherwise enter the board shell with `adb shell` and start the service manually as follows.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /oem/usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Run the Python inference program on the PC.
5. View the log.

```
adb shell cat /userdata/server.log
```

6. Detailed logging slows inference. Restore the default logging level with:

```sh
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

{% endraw %}
