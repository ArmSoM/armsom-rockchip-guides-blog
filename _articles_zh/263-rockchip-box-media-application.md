---
title: "Rockchip Box 媒体中心：播放、DLNA 与文件管理"
description: "Rockchip Box 媒体中心：播放、DLNA 与文件管理 — Android / Rockchip"
excerpt: "Rockchip Box 媒体中心：播放、DLNA 与文件管理 — Android / Rockchip"
translation_key: "263-rockchip-box-media-application"
slug: "263-rockchip-box-media-application"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 开发者平台参考。来源：RK-SM-YF-502 cover 2.0.1 / revision table 2.0.0。使用前需核对板卡 SoC、Android SDK/BSP、内核配置和厂商工具；原文未确认特定 ArmSoM 板卡或内核版本的适配。本次未进行 ArmSoM 硬件验证，示例和截图来自原稿，不是 ArmSoM 实测。

## 原稿范围与中英文差异

原稿为版本 2.0.1 的中英文合稿，介绍 RK 平台 Android 7.0 及以上的 Box Media Center，未指定内核版本。合稿仅提供一套共享截图，部分含中文界面；四语沿用这些原图，并非另有英文图。封面写 2.0.1，修订表止于 2.0.0。

**DLNA 冲突：**中文第7页要求 `ro.config.low_ram = false` 且 `persist.sys.dlna.enable = true` 才自启。英文第8页总述却写 `ro.config.low_ram = true`，但紧随的细项又与中文一样写 `true` 不能自启。四语按中文 `false` 为主线，同时保留冲突；应核对实际 SDK。

## 1 概述

媒体中心是集内部存储、SD 卡、U 盘、移动硬盘、Samba/NFS、DLNA/UPnP 等设备发现、文件浏览、视频/音乐播放、图片浏览、APK 安装于一体的 Box TV 应用。支持以下横屏配置：

- `[size:1280x720 density:160]`
- `[size:1280x720 density:213]`
- `[size:1920x1080 density:213]`
- `[size:1920x1080 density:320]`

不同平台源码不同，通过 Rockchip Redmine/FAE 申请对应源码。

### 1.1 主界面及基本操作

![图1：媒体中心主界面](/docs/rockchip-box-media-application/images/p006-01.png)

*图1：媒体中心主界面 — 中英合稿原始截图, p. 6.*

主界面列出本地存储（内部、SD 卡、U 盘、移动硬盘）、用户添加的 Samba/NFS 和局域网发现的 DLNA UPnP 设备。各设备有文件、视频、音乐、图片等分类，支持鼠标四向拖动。

1. 上下键选设备。
2. 左右键选媒体分类，确定进入。
3. 菜单打开图2，可添加 NFS/Samba、刷新网络 DLNA 或全部设备，设置 DLNA 显示名称、启用状态等。

![图2：主界面菜单](/docs/rockchip-box-media-application/images/p007-01.png)

*图2：主界面菜单 — 中英合稿原始截图, p. 7.*

### 1.2 系统属性配置

按中文条件，DLNA 自启要求 `ro.config.low_ram = false` 且 `persist.sys.dlna.enable = true`。

- `ro.config.low_ram`：低内存属性，`true` 时不能自启，需从菜单 → DLNA Setting 手动开启。
- `persist.sys.dlna.enable`：开机是否自启媒体中心 DLNA，默认 `false`。

## 2 多媒体模块

媒体中心自动扫描分类文件，Video、Image、Audio 打开分类内容，File 保持目录结构；也包含网络设备管理和 DLNA，以下介绍六个模块。

### 2.1 视频播放

![图3：视频播放器](/docs/rockchip-box-media-application/images/p009-01.png)

*图3：视频播放器 — 中英合稿原始截图, p. 9.*

从 File 或 Video 选择视频并确定，默认全屏、循环、立体声，也可左键单击播放/暂停。

1. 确定键暂停/播放。
2. 单按右/左键前进/后退 **10 秒**。
3. 长按右/左键快进/快退。
4. 菜单打开底部控制，系统启用 PIP Feature 才显示 PIP。

![图4：视频菜单](/docs/rockchip-box-media-application/images/p010-01.png)

*图4：视频菜单 — 中英合稿原始截图, p. 10.*

Seek 精确定位播放位置（图5）。

![图5：Seek](/docs/rockchip-box-media-application/images/p010-02.png)

*图5：Seek — 中英合稿原始截图, p. 10.*

Setting 包含画面缩放、声道选择、播放模式、字幕、音轨及 3D 模式。

![图6：视频设置](/docs/rockchip-box-media-application/images/p011-01.png)

*图6：视频设置 — 中英合稿原始截图, p. 11.*

PIP 画中画允许退出媒体中心运行其他应用；长按 Home 显示最近任务并将画中画居中，此时可恢复全屏、关闭或暂停。

![图7：画中画播放](/docs/rockchip-box-media-application/images/p011-02.png)

*图7：画中画播放 — 中英合稿原始截图, p. 11.*

![图8：画中画控制](/docs/rockchip-box-media-application/images/p012-01.png)

*图8：画中画控制 — 中英合稿原始截图, p. 12.*

### 2.2 DLNA

RK DLNA 是多屏组件，实现三种类型：

- **DMS（Digital Media Server）**：存储共享媒体供联网 DMP/DMR 访问。
- **DMP（Digital Media Player）**：查找获取 DMS/M-DMS 内容，播放、渲染和播控。
- **DMR（Digital Media Renderer）**：经其他设备配置后播放 DMS/M-DMS 内容；与 DMP 不同，需 DMC（Digital Media Controller）控制才能获取 DMS 内容。

为兼容并避免第三方 DLNA 干扰，组件独立集成到媒体中心供快速产品集成。可从媒体中心 DLNA 或 DLNA 向导启用。Service Status 为 `Opened` 时，手机/PC DLNA 软件可投屏等；不可用时参考图9原投屏指南。

![图9：DLNA 指南](/docs/rockchip-box-media-application/images/p013-01.png)

*图9：DLNA 指南 — 中英合稿原始截图, p. 13.*

### 2.3 音乐播放

![图10：音乐播放器](/docs/rockchip-box-media-application/images/p014-01.png)

*图10：音乐播放器 — 中英合稿原始截图, p. 14.*

在 File 或 Music 选曲并确定，默认循环。左侧为专辑图、文件名、艺术家、专辑，右侧播放列表，底部控制和歌词。

1. 上下键选曲，选中框尚在时确定播放选中曲；消失后确定则暂停/继续当前曲。
2. 左右键调整进度。
3. 菜单打开图11，Play Mode 设置模式，Image 设置背景。

![图11：音乐菜单](/docs/rockchip-box-media-application/images/p015-01.png)

*图11：音乐菜单 — 中英合稿原始截图, p. 15.*

### 2.4 图片播放与 4K 显示

从 File 或 Image 选图确定；默认每 **5 秒**自动播放，淡入淡出，背景音乐开启。

![图12：图片界面](/docs/rockchip-box-media-application/images/p016-01.png)

*图12：图片界面 — 中英合稿原始截图, p. 16.*

1. 确定键开关自动播放。
2. 菜单键打开底部图片菜单。

![图13：图片菜单](/docs/rockchip-box-media-application/images/p016-02.png)

*图13：图片菜单 — 中英合稿原始截图, p. 16.*

Zoom In/Out 进入缩放控制；Settings 打开图14设置切换模式、间隔、详情显示开关；Music 对话框开关图片播放背景音乐。

![图14：图片设置](/docs/rockchip-box-media-application/images/p017-01.png)

*图14：图片设置 — 中英合稿原始截图, p. 17.*

原稿说明 Android 7.0 及以上 SDK，安装媒体中心 **3.5.4 及以上**并外接 **4K 显示器**可高清显示 4K 图片；不是所有 ArmSoM 镜像的验证结论。

### 2.5 APK 安装

![图15：APK 安装](/docs/rockchip-box-media-application/images/p018-01.png)

*图15：APK 安装 — 中英合稿原始截图, p. 18.*

启动媒体中心，在 File 选 APK 并确定进入安装；失败时检查应用权限是否开启。

### 2.6 设备及文件管理

管理本地存储（内部、SD、U 盘、移动硬盘）、Samba/NFS 及局域网发现的 DLNA UPnP 设备和文件。Samba/NFS 需手动添加挂载，以下为 Samba 示例。

![图16：添加网络设备](/docs/rockchip-box-media-application/images/p019-01.png)

*图16：添加网络设备 — 中英合稿原始截图, p. 19.*

选择 Add Samba device，填写网络地址、用户名、密码挂载；图17为成功界面。

![图17：Samba 已挂载](/docs/rockchip-box-media-application/images/p019-02.png)

*图17：Samba 已挂载 — 中英合稿原始截图, p. 19.*

移除网络设备时选择 delete devices，在对话框选择设备。

![图18：删除网络设备](/docs/rockchip-box-media-application/images/p020-01.png)

*图18：删除网络设备 — 中英合稿原始截图, p. 20.*

![图19：目录视图](/docs/rockchip-box-media-application/images/p020-02.png)

*图19：目录视图 — 中英合稿原始截图, p. 20.*

主界面选设备 File 并确定进入目录；菜单打开图20，可复制、删除、移动、重命名、排序、搜索及原稿称为“蓝牙分析”的操作。中英文均为“蓝牙分析 / bluetooth analysis”且未解释，不擅自改为蓝牙分享。

![图20：文件操作](/docs/rockchip-box-media-application/images/p021-01.png)

*图20：文件操作 — 中英合稿原始截图, p. 21.*

列表遵循目录结构，文件夹在前、文件在后；上下键选项，右侧预览详情依类型变化。

![图21：文件夹预览](/docs/rockchip-box-media-application/images/p021-02.png)

*图21：文件夹预览 — 中英合稿原始截图, p. 21.*

![图22：视频预览](/docs/rockchip-box-media-application/images/p021-03.png)

*图22：视频预览 — 中英合稿原始截图, p. 21.*

1. **文件夹：**文件夹图标、名称及子文件/文件夹数，确定在当前页载入子列表。英文仅说子文件夹数，中文含文件和文件夹，此处保留中文完整意思。
2. **视频：**有缩略图则显示，否则默认图标；详情为文件名、大小、类型、时长、最后修改时间；确定启动播放器。

![图23：音乐预览](/docs/rockchip-box-media-application/images/p022-01.png)

*图23：音乐预览 — 中英合稿原始截图, p. 22.*

![图24：图片预览](/docs/rockchip-box-media-application/images/p022-02.png)

*图24：图片预览 — 中英合稿原始截图, p. 22.*

3. **音乐：**有专辑图则显示，否则默认音乐图标；详情类似视频；确定播放音乐。
4. **图片：**有缩略图则显示，否则默认图片图标；详情依次为文件名、大小、类型、最后修改时间、描述；确定进入图片浏览。

![图25：APK 预览](/docs/rockchip-box-media-application/images/p023-01.png)

*图25：APK 预览 — 中英合稿原始截图, p. 23.*

![图26：其他文件](/docs/rockchip-box-media-application/images/p023-02.png)

*图26：其他文件 — 中英合稿原始截图, p. 23.*

5. **APK：**有包图标则显示，否则默认 APK 图标；详情为文件名、大小、最后修改时间；确定进入系统安装。
6. **其他类型：**问号图标；文件名、大小、最后修改时间；确定无操作。

相关官方文档: [ArmSoM](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

{% endraw %}
