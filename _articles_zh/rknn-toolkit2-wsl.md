---
title: "在 WSL 中使用 RKNN-Toolkit2：安装、连板与排错"
description: "完整整理 WSL 安装、Ethernet/USB 连板、adbkit 与 libGL.so.1 排错，保留原始命令。"
excerpt: "完整整理 WSL 安装、Ethernet/USB 连板、adbkit 与 libGL.so.1 排错，保留原始命令。"
translation_key: "rknn-toolkit2-wsl"
slug: "rknn-toolkit2-wsl"
lang: "zh"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

ArmSoM 平台参考：供 CM7S/Sige7S（RK3588S）、Sige7/AIM7/LM7/W3（RK3588）、Sige5/CM5/AIM5（RK3576）及相应 RK3568 平台评估使用。需要匹配板卡系统、NPU 驱动、SDK、Runtime 与 Toolkit2；本文没有验证具体 BSP 或内核组合，也没有进行 ArmSoM 硬件测试。原文的验证结论仅属于原稿环境。

来源：本地 RKNN 仓库中英文 WSL Markdown，无单独版本号，未包含配图。正文保留两稿各自命令与占位符；俄文、德文译自英文稿。注意最后代码块中的“1. / 2.”是原稿步骤说明，不是可执行命令；`adbkit` 安装后的命令可用性及 `libgl1-mesa-glx` 包需按实际系统核对。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

{% raw %}

# WSL 中 使用RKNN-ToolKit2

## 1. Windows主机安装WSL
- 可参考 https://learn.microsoft.com/zh-cn/windows/wsl/install

## 2. WSL 中使用RKNN-Toolkit2
1. 参考[《Rockchip_RKNPU_Quick_Start手册》](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/)在 WSL 中安装RKNN-ToolKit2环境
2. 参考[《Rockchip_RKNPU_User_Guide手册》](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/)在 WSL 进行模型转换、量化等操作

## 3. WSL 中使用RKNN-Toolkit2进行连板调试

### 3.1. WSL 终端安装adb
```
sudo apt update
sudo apt install adb
```

### 3.2 WSL 连接设备
可选择通过网线或USB进行设备连接

#### 3.2.1 通过网线连接
```
# 1. 使用网线连接设备

# 2. 在 WSL 中使用 adb connect 连接设备
adb connect <IP地址:端口号>
```
`IP地址` 为板子的IP地址


#### 3.2.2 通过USB连接
```
# 1. 在 Windows 上通过USB连接设备

# 2. 在 Windows 上使用adbkit工具，将USB转为TCP
npm install --save adbkit
adbkit usb-device-to-tcp <device_id> -p <端口号>

# 注：配置WSL可以访问Windows的网络

# 3. 在 WSL 中使用 adb connect 连接设备
adb connect <IP地址:端口号>
```
- `device_id`可通过在Windows中使用`adb devices`命令查看 (需要Windows中已安装adb工具)
- `IP地址` 为 Windows主机 的IP地址

### 3.3 使用RKNN-ToolKit2进行连板调试
参考[《Rockchip_RKNPU_User_Guide手册》](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/)在 WSL 进行连板推理、连板精度分析等操作



## 注：
1. 推荐安装 WSL2，Ubuntu版本号为22.04 已验证可行(其余版本未验证，理论可行)
2. 在WSL使用RKNN-ToolKit2中若出现 "ImportError: libGL.so.1: cannot open shared object file: No such file or directory"，请执行以下代码解决
```
1. 安装对应库
sudo apt update
sudo apt install libgl1-mesa-glx

2. 设置环境变量
echo 'export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/mesa' >> ~/.bashrc
source ~/.bashrc
```

{% endraw %}
