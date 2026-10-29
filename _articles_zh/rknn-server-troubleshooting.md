---
title: "RKNN 连板故障排查：连接、内存、存储与权限"
description: "RKNN 连板故障排查：连接、内存、存储与权限"
excerpt: "RKNN 连板故障排查：连接、内存、存储与权限"
translation_key: "rknn-server-troubleshooting"
slug: "rknn-server-troubleshooting"
lang: "zh"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

ArmSoM 平台参考：供 CM7S/Sige7S（RK3588S）、Sige7/AIM7/LM7/W3（RK3588）、Sige5/CM5/AIM5（RK3576）及相应 RK3568 平台评估使用。需要匹配板卡系统、NPU 驱动、SDK、Runtime 与 Toolkit2；本文没有验证具体 BSP 或内核组合，也没有进行 ArmSoM 硬件测试。原文的验证结论仅属于原稿环境。

来源为本地中文 rknn_server_proxy.md，无英文原稿、无配图；英俄德完整译自中文。原稿第1节对 librknnrt.so 的“非…不适用”表述与第4节冲突，按原文保留；问题4的 /usr/bin 路径与4.3节 /oem/usr/bin 不同，执行前核对实际安装位置。修复4.4标题层级及恢复默认dump路径代码块的错误围栏，未修改命令。原文包含覆盖 Runtime/adbd、停止服务、重启及关闭 SELinux 强制模式的操作，仅供隔离开发环境核对使用，并非生产配置建议。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/CN/rknn_server_proxy.md)


<div class="series-navigation" aria-label="连板调试系列" markdown="1">

连板调试系列 · 3/3

[RKNN 连板代理：环境、部署与 mini-runtime](/zh/articles/rknn-server-proxy/)

[RKNN 连板调试：日志开启、检查与恢复](/zh/articles/rknn-server-logging/)

**RKNN 连板故障排查：连接、内存、存储与权限**

</div>

{% raw %}

## 6. 常见问题
### 问题1
Debian系统上rknn_server服务已经后台启动, 但是连板推理时依旧有如下报错：
```
D NPUTransfer: ERROR: socket read fd = 4, n = -1: Connection reset by peer
D NPUTransfer: Transfer client closed, fd = 4
E RKNNAPI: rknn_init,  server connect fail!  ret = -9(ERROR_PIPE)!
E build_graph: The rknn_server on the concected device is abnormal, please start the rknn_server on the device according to:
               https://github.com/airockchip/rknn-toolkit2/blob/master/doc/rknn_server_proxy.md
```

**解决方法：**
这通常是由于Debian固件上的adbd程序没有监听5037端口导致的，可以在板子上执行以下命令来判断:
```
netstat -n -t -u -a
```
如果输出结果中没有5037端口,则执行下列命令下载和更新adbd程序, 并重启板子;否则,跳过下列步骤。
```
wget -O adbd.zip https://ftzr.zbox.filez.com/v2/delivery/data/7f0ac30dfa474892841fcb2cd29ad924/adbd.zip
unzip adbd.zip
adb push adbd/linux-aarch64/adbd /usr/bin/adbd
```
进入设备shell命令，增加adbd的可执行权限

```sh
adb shell "chmod +x /usr/bin/adbd"
adb reboot
```

重启设备后，按照启动步骤启动rknn_server服务，再次尝试连板推理。


### 问题2
在RV1103/RV1106/RV1103B设备上遇到"E RKNN: failed to allocate fd, ret: -1, errno: 12"或者OOM报错。
**解决方法：**
在RV1103/RV1106/RV1103B设备上运行RkLunch-stop.sh，关闭其他占用内存的应用，并将rknn_server升级到>=2.1.0版本后再连板推理。

### 问题3
RV1103/RV1106/RV1103B使用init_runtime python接口时，没有逐层的耗时。
原因：RV1103/RV1106/RV1103B上**不支持**perf_debug=True参数。

### 问题4
RV1103/RV1106/RV1103B使用accuracy_analysis python接口使用时，因为模型太大，板子上存储容量不够导致运行失败。

**解决方法：**

在设备端df -h查看存储空间情况，假设设备存储情况如下：

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

从上面看出/userdata/目录的可用空间最大，故将/userdata/目录作为精度分析时保存中间结果文件的目录，再重启rknn_server，PC上执行命令如下：

```
adb shell "killall rknn_server"
adb shell "export RKNN_DUMP_DIR=/userdata/dumps && nohup /usr/bin/rknn_server >/dev/null"&
```

RV1103/RV1106/RV1103B的rknn_server默认的保存中间结果路径是/tmp/dumps，如果需要恢复默认路径，请执行下列命令：

```
adb shell "killall rknn_server"
adb shell "unset RKNN_DUMP_DIR && nohup /usr/bin/rknn_server >/dev/null"&
```

如果设备存储空间不足，并且RV1103/RV1106/RV1103B固件支持NFS挂载，则可以将dump目录挂载到NFS目录后，再执行精度分析。假设目标服务器的IP为192.168.1.1，服务器NFS目录是/data0/nfs_shared，则在设备上执行下列命令将/userdata/dumps挂载到NFS目录

```
# 以241为例
mkdir -p /userdata/dumps
mount -t nfs -o nolock 192.168.1.1:/data0/nfs_shared /userdata/dumps
```

### 问题5

使用adb命令更新Runtime库后没有生效。

**解决方法**：

更新库后要重新启动rknn_server，下次连板推理才能生效。如果是RV1103/RV1106/RV1103B平台，确保将librknnmrt.so放在/oem/usr/lib目录，如果/usr/lib/目录下有同名的库，要删除/usr/lib/下的librknnmrt.so，并重启rknn_server。

### 问题6

Android系统启动代理服务遇到权限问题。

**解决方法**：

使用adb shell setenforce 0命令来关闭selinux。

{% endraw %}
