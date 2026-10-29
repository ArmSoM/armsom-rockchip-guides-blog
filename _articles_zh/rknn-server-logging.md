---
title: "RKNN 连板调试：日志开启、检查与恢复"
description: "RKNN 连板调试：日志开启、检查与恢复"
excerpt: "RKNN 连板调试：日志开启、检查与恢复"
translation_key: "rknn-server-logging"
slug: "rknn-server-logging"
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

连板调试系列 · 2/3

[RKNN 连板代理：环境、部署与 mini-runtime](/zh/articles/rknn-server-proxy/)

**RKNN 连板调试：日志开启、检查与恢复**

[RKNN 连板故障排查：连接、内存、存储与权限](/zh/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 5. 查看rknn_server详细日志

代理服务默认不开启详细日志，如遇到连板过程报错，需开启详细日志来定位错误原因，请参考相应平台执行步骤：
### 5.1 Android平台
1. 设置环境变量开启详细日志,并启动代理:
```
adb logcat -c
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 5 && nohup /vendor/bin/rknn_server >/dev/null"&
```
2. 检查代理服务是否启动成功：

```
adb shell ps -ef|grep rknn_server
```
3. 运行PC上python推理程序
4. 查看运行日志
```
adb logcat
```

5. 开启详细日志会导致推理速度变慢，恢复默认日志等级的命令如下：

```sh
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 0 && nohup /vendor/bin/rknn_server >/dev/null"&
```

### 5.2 Linux平台(非RV1103/RV1106/RV1103B)

1. 创建目录,用于保存代理服务的详细日志
```
adb shell mkdir -p /userdata
```
2. 设置环境变量开启详细日志,并启动代理:
```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```
3. 检查代理服务是否启动成功：
```
adb shell ps -ef|grep rknn_server
```
查看是否有`rknn_server`的进程id,如果存在表示代理服务启动成功;否则请在板子上手动启动代理服务,方法如下:
adb shell命令进入板子shell界面后,执行下列命令启动代理服务
```
export RKNN_SERVER_LOGLEVEL=5
nohup /usr/bin/rknn_server >/userdata/server.log&
exit
```
4. 运行PC上python推理程序
5. 查看日志
```
adb shell cat /userdata/server.log
```

6. 开启详细日志会导致推理速度变慢，恢复默认日志等级的命令如下：

```sh
   adb shell "killall rknn_server"
   adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

### 5.3 Linux平台(RV1103/RV1106/RV1103B)

1. 创建目录,用于保存代理服务的详细日志
```
adb shell mkdir -p /userdata
```
2. 设置环境变量开启详细日志,并启动代理:
```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```
3. 检查代理服务是否启动成功：
```
adb shell ps|grep rknn_server
```
查看是否有`rknn_server`的进程id,如果存在表示代理服务启动成功;否则请在板子上手动启动代理服务,方法如下:
adb shell命令进入板子shell界面后,执行下列命令启动代理服务
```
export RKNN_SERVER_LOGLEVEL=5
nohup /oem/usr/bin/rknn_server >/userdata/server.log&
exit
```
4. 运行PC上python推理程序
5. 查看日志
```
adb shell cat /userdata/server.log
```

6. 开启详细日志会导致推理速度变慢，恢复默认日志等级的命令如下：

```sh
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

{% endraw %}
