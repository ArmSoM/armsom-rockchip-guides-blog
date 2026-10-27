---
title: "Rockchip Android 恢复出厂设置保护功能说明"
description: "Rockchip Android 恢复出厂设置保护功能说明"
excerpt: "Rockchip Android 恢复出厂设置保护功能说明"
translation_key: "257-rockchip-android-factory-reset-protection"
slug: "257-rockchip-android-factory-reset-protection"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android 恢复出厂设置保护功能说明

依据 RK-SM-YF-206 V1.0 双语原稿，完整保留第 6 页技术正文。技术适用说明为 Android 8.1 及以上，是原稿历史范围而非当前兼容性保证。中英文依据对应原文，俄德完整翻译；中文包含“非账户所有者”的限定，英俄德明确保留其语义。无技术图片或技术表格。封面日期、声明、联系方式、读者和修订记录移除。未刷写设备、修改安全配置或测试硬件。

安全与校对：FRP 是防止未经授权使用设备的保护。原文 misc 返厂恢复说法仅按历史资料保留，不代表通用有效方法，也未给出或扩展绕过账户校验的操作步骤。账户恢复应由所有者使用正规恢复或获授权售后流程；刷写可能清除数据和影响保护状态。第 2.1 标题含“关闭”，正文只给 false→true 启用示例，不补造关闭步骤。第二个代码样例的 “Google Service and frp overlay” 缺少 #，按原稿保留并标注为不能直接当作有效 make 语句；原 GMS 依赖与参考文档名完整保留。

<!-- source:bilingual p6 unit:0 -->

## 1 概述

<!-- source:bilingual p6 unit:1 -->

本文档详细说明如何定制 Android 的 FRP 功能，用于支持谷歌的 Factory Reset Protection（恢复出厂设置保护）功能。如果启用此功能，登入谷歌账户后通过非账户所有者的手段，用组合按键方式进入 recovery 进行恢复出厂设置后，如果没有 Wi-Fi 连接或者登录不了谷歌账户，就会一直停留在此处，不能完成开机向导。

<!-- source:bilingual p6 unit:2 -->

原稿说明：烧写 misc 可以格式化用户账户，用于返厂恢复处理。

<!-- source:bilingual p6 unit:3 -->

快速使用只需参看第 2 章“快速开启方法”。

<!-- source:bilingual p6 unit:4 -->

## 2 快速开启方法

<!-- source:bilingual p6 unit:5 -->

### 2.1 开启与关闭

<!-- source:bilingual p6 unit:6 -->

本文档的 FRP 功能需配合 GMS（谷歌服务框架）。如有其他需求，请参照 [FactoryResetProtectionforPartners.pdf] 自行定制和修改需要的功能。

<!-- source:bilingual p6 unit:7 -->

开启方法：将 device/rockchip/rk3xxx/BoardConfig.mk 文件中的以下两个值：

<!-- source:bilingual p6 unit:8 -->

```text
#Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := false
BUILD_WITH_GOOGLE_FRP := false
```

<!-- source:bilingual p6 unit:9 -->

更改为：

<!-- source:bilingual p6 unit:10 -->

```text
Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := true
BUILD_WITH_GOOGLE_FRP := true
```

<!-- source:bilingual p6 unit:11 -->

来打开 FRP 的功能。

{% endraw %}
