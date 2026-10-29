---
title: "RKNN troubleshooting: connections, memory, storage and permissions"
description: "RKNN troubleshooting: connections, memory, storage and permissions"
excerpt: "RKNN troubleshooting: connections, memory, storage and permissions"
translation_key: "rknn-server-troubleshooting"
slug: "rknn-server-troubleshooting"
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

Board debugging series · 3/3

[RKNN board proxy: setup, deployment and mini-runtime](/articles/rknn-server-proxy/)

[RKNN board debugging: enable, inspect and reset logs](/articles/rknn-server-logging/)

**RKNN troubleshooting: connections, memory, storage and permissions**

</div>

{% raw %}

## 6. FAQ
### Issue 1
On Debian, rknn_server is already running in the background, but board inference still reports:

```
D NPUTransfer: ERROR: socket read fd = 4, n = -1: Connection reset by peer
D NPUTransfer: Transfer client closed, fd = 4
E RKNNAPI: rknn_init,  server connect fail!  ret = -9(ERROR_PIPE)!
E build_graph: The rknn_server on the concected device is abnormal, please start the rknn_server on the device according to:
               https://github.com/airockchip/rknn-toolkit2/blob/master/doc/rknn_server_proxy.md
```

**Solution in the source:** this is usually because adbd in the Debian firmware is not listening on port 5037. Check on the board with:

```
netstat -n -t -u -a
```

If port 5037 is absent, download and update adbd using the following commands and reboot the board. Otherwise skip these steps.

```
wget -O adbd.zip https://ftzr.zbox.filez.com/v2/delivery/data/7f0ac30dfa474892841fcb2cd29ad924/adbd.zip
unzip adbd.zip
adb push adbd/linux-aarch64/adbd /usr/bin/adbd
```

Use the device shell to add execute permission to adbd:

```sh
adb shell "chmod +x /usr/bin/adbd"
adb reboot
```

After reboot, start rknn_server using the startup procedure and try board inference again.
### Issue 2
On RV1103/RV1106/RV1103B, the error is `E RKNN: failed to allocate fd, ret: -1, errno: 12` or OOM.
**Solution:** run RkLunch-stop.sh on the device, stop other applications using memory, and upgrade rknn_server to >=2.1.0 before trying board inference again.
### Issue 3
The Python init_runtime interface on RV1103/RV1106/RV1103B does not provide per-layer timing.
Reason: these platforms **do not support** perf_debug=True.
### Issue 4
On RV1103/RV1106/RV1103B, accuracy_analysis fails because the model is too large for the available board storage.
**Solution:** inspect storage on the device with df -h. Example output:

```sh
Filesystem                Size      Used Available Use% Mounted on
ubi0:rootfs              17.0M     14.1M      2.9M  83% /
devtmpfs                 27.4M         0     27.4M   0% /dev
tmpfs                    27.5M         0     27.5M   0% /dev/shm
tmpfs                    27.5M      8.0K     27.5M   0% /tmp
tmpfs                    27.5M     84.0K     27.4M   0% /run
/dev/ubi5_0              20.6M     14.5M      6.1M  70% /oem
/dev/ubi6_0              52.8M     24.5M     28.2M  46% /userdata

```

In this example /userdata/ has the most free space. Use it for intermediate accuracy-analysis files, then restart rknn_server. Run on the PC:

```
adb shell "killall rknn_server"
adb shell "export RKNN_DUMP_DIR=/userdata/dumps && nohup /usr/bin/rknn_server >/dev/null"&
```

On RV1103/RV1106/RV1103B, intermediate results are saved to /tmp/dumps by default. To restore that default, run:

```
adb shell "killall rknn_server"
adb shell "unset RKNN_DUMP_DIR && nohup /usr/bin/rknn_server >/dev/null"&
```

If device storage is insufficient and the RV1103/RV1106/RV1103B firmware supports NFS mounts, mount the dump directory on NFS before accuracy analysis. Assuming server IP 192.168.1.1 and server directory /data0/nfs_shared, run on the device to mount it at /userdata/dumps:

```
# 以241为例
mkdir -p /userdata/dumps
mount -t nfs -o nolock 192.168.1.1:/data0/nfs_shared /userdata/dumps
```

### Issue 5
Updating the Runtime library with adb has no effect.
**Solution:** restart rknn_server after updating the library; the next board inference then uses the update. On RV1103/RV1106/RV1103B, ensure librknnmrt.so is in /oem/usr/lib. If a library of the same name is present in /usr/lib/, the source instructs removing /usr/lib/librknnmrt.so and restarting rknn_server.
### Issue 6
The proxy service encounters permission problems when starting on Android.
**Solution in the source:** use `adb shell setenforce 0` to disable SELinux enforcement.

{% endraw %}
