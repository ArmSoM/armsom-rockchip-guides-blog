---
title: "RKNN 连板代理：环境、部署与 mini-runtime"
description: "RKNN 连板代理：环境、部署与 mini-runtime"
excerpt: "RKNN 连板代理：环境、部署与 mini-runtime"
translation_key: "rknn-server-proxy"
slug: "rknn-server-proxy"
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

连板调试系列 · 1/3

**RKNN 连板代理：环境、部署与 mini-runtime**

[RKNN 连板调试：日志开启、检查与恢复](/zh/articles/rknn-server-logging/)

[RKNN 连板故障排查：连接、内存、存储与权限](/zh/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 1. 连板调试简介
RKNN Toolkit2的连板功能一般需要更新板端的 rknn_server 和 librknnrt.so/librknnmrt.so，并且手动启动 rknn_server 才能正常工作。
rknn_server: 是一个运行在板子上的后台代理服务，用于接收PC通过USB传输过来的协议，然后执行板端runtime对应的接口，并返回结果给PC。

- librknnrt.so: 是一个板端的RKNPU Runtime库(非RV1103/RV1106/RV1103B平台不适用)。
- librknnmrt.so: 是专用于RV1103/RV1106/RV1103B/RV1126B平台的RKNPU Runtime库。

开机后通过ps命令查看rknn_server进程是否已存在，如果已存在，则不需要手动启动，否则需要手动启动。

## 2. 环境要求
### 2.1 硬件环境
本文档适用如下硬件平台：

- RV1103
- RV1103B
- RV1106
- RV1126B
- RK3562
- RK3566系列
- RK3568系列
- RK3576系列
- RK3588系列

### 2.2 软件环境
- 若使用动态形状输入RKNN模型，要求rknn_server和RKNPU Runtime库版本>=1.5.0。
- 若使用大于2GB的模型，要求rknn_server版本>=2.0.0b0。
- 在RV1103/RV1106/RV1103B等小内存平台上，建议rknn_server版本>=2.1.0。


## 3. rknn_server存放目录
rknn_server存放在runtime目录下, 请根据板子上的系统选择相应版本的rknn_server,不同芯片和系统对应的rknn_server路径如下：
### 3.1 Android平台

|系统|路径|
|-----|-----|
|32-bit Android|runtime/Android/rknn_server/arm/rknn_server|
|64-bit Android|runtime/Android/rknn_server/arm64/rknn_server|


### 3.2 Linux平台

|芯片|系统|路径|
|-----|-----|-----|
|RV1103/RV1106/RV1103B|32-bit Linux|runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server|
|其他芯片|32-bit Linux|runtime/Linux/rknn_server/armhf/usr/bin/rknn_server|
|其他芯片|64-bit Linux|runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server|

## 4. 启动步骤
### 4.1 Android平台
进入rknpu2工程的根目录，在PC端执行下列命令启动代理服务:
1. 重新挂载系统分区,使系统分区重新可写
```
adb root && adb remount
```
2. 更新代理程序
```
// 64-bit Android系统
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
// 32-bit Android系统
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
```
3. 更新RKNPU runtime库 
```
// 64-bit Android系统
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64
// 32-bit Android系统
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib
```
4. 修改代理程序权限
```
adb shell chmod +x /vendor/bin/rknn_server
```
5. 启动代理服务
```
adb shell "killall rknn_server"
adb shell "nohup /vendor/bin/rknn_server >/dev/null"&
```
6. 检查代理服务是否启动成功：
```
adb shell ps -ef|grep rknn_server
```
查看是否有`rknn_server`的进程id,如果存在表示代理服务启动成功;否则请在板子上手动启动代理服务,步骤如下:
adb shell命令**进入板子shell界面**后,执行下列命令启动代理服务

```
nohup /vendor/bin/rknn_server > /dev/null&
```

### 4.2 Linux平台(非RV1103/RV1106/RV1103B)
1. 更新代理程序
```
// 64-bit Linux系统
adb push runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server /usr/bin/
// 32-bit Linux系统
adb push runtime/Linux/rknn_server/armhf/usr/bin/rknn_server /usr/bin/
```
2. 更新RKNPU runtime库 
```
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```
3. 修改代理程序权限
```
adb shell chmod +x /usr/bin/rknn_server
```
4. 启动代理服务
```
adb shell "killall rknn_server"
adb shell "nohup /usr/bin/rknn_server >/dev/null"&
```
5. 检查代理服务是否启动成功：
```
adb shell ps -ef|grep rknn_server
```
查看是否有`rknn_server`的进程id,如果存在表示代理服务启动成功;否则请在板子上手动启动代理服务,方法如下:
adb shell命令**进入板子shell界面**后,执行下列命令启动代理服务

```
nohup /usr/bin/rknn_server > /dev/null&
```

### 4.3 Linux平台(RV1103/RV1106/RV1103B)
RV1103/RV1106/RV1103B上使用的RKNPU Runtime库是librknnmrt.so，使用armhf-uclibc目录下的rknn_server,启动步骤如下：
1. 更新代理程序
```
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server /oem/usr/bin
```
2. 更新RKNPU runtime库
```
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib
```
3. 修改代理程序权限
```
adb shell chmod +x /oem/usr/bin/rknn_server
```
4. 启动代理服务
```
adb shell "killall rknn_server"
adb shell "nohup /oem/usr/bin/rknn_server >/dev/null"&
```
5. 检查代理服务是否启动成功：
```
adb shell ps |grep rknn_server
```
查看是否有`rknn_server`的进程id,如果存在表示代理服务启动成功;否则请在板子上手动启动代理服务,方法如下:
adb shell命令**进入板子shell界面**后,执行下列命令启动代理服务

```
nohup /oem/usr/bin/rknn_server > /dev/null&
```

### 4.4 mini-runtime 使用方法

目前mini-runtime有同步在RV1126B支持，如需要在1126B使用mini-runtime，需要确保转换模型时候，在rknn-toolkit2里打开mini-rknn，

```python
rknn.config(target_platform=_target_platform, mini_rknn=True)
```

推送librknnmrt.so到板端，

```shell
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnmrt.so /oem/usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnmrt.so /oem/usr/lib
```

和上述方式一样推送对应的rknn_server到板端并开启，就可以正常调用连扳调式，如果有sever连接报错，需要更新adbd程序，详细参考常见问题

{% endraw %}
