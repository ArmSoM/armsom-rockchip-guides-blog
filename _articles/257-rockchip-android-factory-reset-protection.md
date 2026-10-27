---
title: "Rockchip Android Factory Reset Protection"
description: "Rockchip Android Factory Reset Protection"
excerpt: "Rockchip Android Factory Reset Protection"
translation_key: "257-rockchip-android-factory-reset-protection"
slug: "257-rockchip-android-factory-reset-protection"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android"]
---

{% raw %}

# Rockchip Android Factory Reset Protection

Complete technical page 6 of bilingual RK-SM-YF-206 V1.0. Android 8.1 and later is the historical source scope, not current compatibility assurance. Chinese/English follow their source passages; Russian/German are full translations. The Chinese qualifier “someone other than the account owner” is explicitly retained in the other languages. No technical figures/tables exist. Cover dates, disclaimers, contacts, audience and revision history are removed. No flashing, security-configuration changes or hardware tests were performed.

Security and audit: FRP protects against unauthorized device use. The misc factory-return statement is retained only as historical source material, not a universally valid method; no account-verification bypass procedure is supplied or expanded. Account recovery should use owner-led official recovery or authorized service. Flashing may erase data and affect protection. Section 2.1 mentions disabling, but the body only shows false→true enablement; no missing disabling procedure is invented. The second “Google Service and frp overlay” line lacks # in the source and is retained, not a valid standalone make statement. GMS requirements and the reference filename remain.

<!-- source:bilingual p6 unit:0 -->

## 1 Overview

<!-- source:bilingual p6 unit:1 -->

This document describes customization of Android FRP to support Google Factory Reset Protection. If enabled, after a Google account is signed in and someone other than the account owner enters recovery using a button combination and performs a factory reset, lack of Wi-Fi or inability to sign in to the Google account prevents completion of the setup wizard.

<!-- source:bilingual p6 unit:2 -->

The source states that flashing misc can format the user account for factory-return recovery.

<!-- source:bilingual p6 unit:3 -->

For quick usage, refer to chapter 2, “Quick start method”.

<!-- source:bilingual p6 unit:4 -->

## 2 Quick start method

<!-- source:bilingual p6 unit:5 -->

### 2.1 Enable and disable

<!-- source:bilingual p6 unit:6 -->

The FRP function described here requires GMS (Google service framework). For other requirements, refer to [FactoryResetProtectionforPartners.pdf] to customize and modify the required functions.

<!-- source:bilingual p6 unit:7 -->

Enable method: change the following two values in device/rockchip/rk3xxx/BoardConfig.mk:

<!-- source:bilingual p6 unit:8 -->

```text
#Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := false
BUILD_WITH_GOOGLE_FRP := false
```

<!-- source:bilingual p6 unit:9 -->

To:

<!-- source:bilingual p6 unit:10 -->

```text
Google Service and frp overlay
BUILD_WITH_GOOGLE_MARKET := true
BUILD_WITH_GOOGLE_FRP := true
```

<!-- source:bilingual p6 unit:11 -->

This enables FRP.

{% endraw %}
