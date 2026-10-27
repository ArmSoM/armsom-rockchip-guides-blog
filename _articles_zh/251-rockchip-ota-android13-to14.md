---
title: "Rockchip 非 A/B OTA：Android 13 升级到 Android 14"
description: "完整保留非 A/B OTA 的 data/keymaster 补丁、构建步骤、升级历史分支与分区兼容要求。"
excerpt: "完整保留非 A/B OTA 的 data/keymaster 补丁、构建步骤、升级历史分支与分区兼容要求。"
translation_key: "251-rockchip-ota-android13-to14"
slug: "251-rockchip-ota-android13-to14"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

ArmSoM 平台参考：依据 RK-KF-YF-788 V1.0.0 中文稿完整整理非 A/B 系统 Android 13→14 OTA 流程。原稿列出 RK3326/RK3399/RK356x/RK3588/RK3562，内核写为 5.10、6.10；此为原稿写法，不擅改为 6.1，也不代表上述 ArmSoM 板卡已适配。须核对具体板卡、Android BSP、分区与安全配置；尚未硬件验证。仅有中文稿，原稿无技术插图，表格和补丁均保留为可编辑正文。

> 风险提示：原稿补丁会擦除用户数据，调试配置会降低 SELinux 防护。下列内容只是原稿示例，未执行；使用前备份，并独立审核目标 SDK，不能直接作为量产方案。

| 原稿芯片 | 原稿内核 |
| --- | --- |
| RK3326/RK3399/RK356x/RK3588/RK3562 | 5.10，6.10 |

## 1. 概述

本文描述从 Rockchip Android 13.0 非 A/B 系统，通过 OTA 升级到 Android 14.0 非 A/B 系统的方法。

## 2. Android 14.0 补丁

### 2.1 data 区与 keymaster

（1）大版本升级后，原稿强烈建议擦除 `data` 区，以避免复杂的兼容性问题导致无法进入 Android 主系统。在 Android 14 SDK 的 `build/make` 仓库应用以下参考补丁，可在升级完成后自动擦除 `data`。

```diff
diff --git a/tools/releasetools/ota_from_target_files.py b/tools/releasetools/ota_from_target_files.py
index d1b935845f..a3f2e28af0 100755
--- a/tools/releasetools/ota_from_target_files.py
+++ b/tools/releasetools/ota_from_target_files.py
@@ -279,7 +279,7 @@ logger = logging.getLogger(__name__)
 OPTIONS = ota_utils.OPTIONS
 OPTIONS.verify = False
 OPTIONS.patch_threshold = 0.95
-OPTIONS.wipe_user_data = False
+OPTIONS.wipe_user_data = True
 OPTIONS.extra_script = None
 OPTIONS.worker_threads = multiprocessing.cpu_count() // 2
 if OPTIONS.worker_threads == 0:
@@ -1498,14 +1498,15 @@ def main(argv):
   else:
     OPTIONS.info_dict = ParseInfoDict(args[0])

-  if OPTIONS.wipe_user_data:
+  '''if OPTIONS.wipe_user_data:
     if not OPTIONS.vabc_downgrade:
       logger.info("Detected downgrade/datawipe OTA."
                   "When wiping userdata, VABC OTA makes the user "
                   "wait in recovery mode for merge to finish. Disable VABC by "
                   "default. If you really want to do VABC downgrade, pass "
                   "--vabc_downgrade")
-      OPTIONS.disable_vabc = True
+      OPTIONS.disable_vabc = True'''
+  if OPTIONS.downgrade:
     # We should only allow downgrading incrementals (as opposed to full).
     # Otherwise the device may go back from arbitrary build with this full
     # OTA package.
```

（2）如果确实希望升级后保留 `data` 数据：

a. 先按第 3 章执行升级；若升级后能正常进入 Android 主界面，可忽略下面的 b；否则按 b 操作。

b. 从以下网盘的 `userdata_patches` 目录取得对应补丁，并应用到 Android 14 SDK 对应仓库。具体用法参考该目录中的 `README.txt`。

原稿下载：[补丁链接](https://pan.baidu.com/s/1HcH1QbUE4mAJplV5KoP-1w)，提取码 `0nsa`。未验证当前可用性，也未下载或执行。

注意：这些补丁仅适用于旧 Android 13 设备升级到 Android 14 的项目，开发全新 Android 14 设备时不能使用。

## 3. Android 13.0 升级到 Android 14.0

在 Rockchip Android 14.0 平台生成对应 OTA 包，放到 Rockchip Android 13.0 设备上按正常 OTA 流程升级。升级前仔细阅读第 4 章注意事项。

1. 选择对应的 Android 13→14 `lunch` 项，例如 `lunch rk3588_t-userdebug` 或 `lunch rk3568_t-userdebug`。通常可直接从 Android 13 SDK 复制对应的 lunch 项目目录。
2. 正常编译系统：编译 uboot、kernel，执行 lunch 后，运行原稿给出的命令：

```shell
make clean && make –j32 && make dist -j32 && ./mkimage.sh ota
```

原稿第一处 `–j32` 使用非 ASCII 短横线，按原样保留以便追溯；执行前核对真实命令参数，不要直接复制为可运行保证。

3. 取出步骤 2 生成的升级包，命名为 `update.zip`。
4. 将对应 `update.zip` 放到 Android 13 设备上升级。

**升级历史说明：**

（1）若当前 Android 13.0 来自 Android 12.0（参考 `Rockchip_Developer_Guide_OTA_from_Android12_to_Android13_CN`），继续升级到 14.0 时，操作同 `Rockchip_Developer_Guide_OTA_from_Android12_to_Android14_CN`：在 14.0 系统选择对应 12.0 的 lunch 项，如 `lunch rk3568_s-userdebug` 或 `lunch rk3588_s-userdebug`，正常编译，将原稿写作 `upddate.zip` 的包放入原稿称为“Android 14.0 设备”的设备升级。

（2）若当前 Android 13.0 来自 Android 11.0（参考 `Rockchip_Developer_Guide_OTA_from_Android11_to_Android13_CN`），继续升级到 14.0 时，操作同 `Rockchip_Developer_Guide_OTA_from_Android11_to_Android14_CN`：在 14.0 系统选择对应 11.0 的 lunch 项，如 `lunch rk3568_r-userdebug`，正常编译，将原稿写作 `upddate.zip` 的包放入原稿称为“Android 14.0 设备”的设备升级。

校对提示：上述两段的 `upddate.zip` 与主流程的 `update.zip` 不一致，“Android 14.0 设备”也与升级前 13.0 的叙述不一致。保留原始信息，使用前核对目标设备与真实文件名。

## 4. 注意事项

1. 原稿要求验证调试时，各 Android 平台（如 Android 13.0/14.0）使用 `userdebug`，并设置如下变量。此为调试示例，不应直接用于量产。

```make
BOARD_SELINUX_ENFORCING := false
```

2. OTA 前确保 `parameter` 分区表一致。例如 13.0→14.0 时，14.0 固件的 `parameter.txt` 必须与 13.0 一致。
3. OTA 前确保 `fstab`（如 `fstab.rk30board`）中的 data 文件系统与加密方式一致。例如 13.0→14.0 时，14.0 固件的 data 文件系统、加密方式必须与 13.0 一致。
4. OTA 前确认固件本身正常。例如 13.0→14.0 时，先通过工具（如 `RKDevTool`）烧写 14.0 固件，确认能正常启动且各项功能正常。

相关官方背景：[AOSP 非 A/B OTA](https://source.android.com/docs/core/ota/nonab)。该链接不表示原稿 Rockchip 补丁已得到当前 SDK 验证。

{% endraw %}
