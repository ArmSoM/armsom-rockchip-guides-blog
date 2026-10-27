---
title: "Rockchip Android Multi Audio 开发指南"
description: "Rockchip Android Multi Audio 开发指南 — V1.0.0"
excerpt: "Rockchip Android Multi Audio 开发指南"
translation_key: "233-rockchip-android-multi-audio"
slug: "233-rockchip-android-multi-audio"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, MultiAudio]
---

{% raw %}

# Rockchip Android Multi Audio 开发指南

完整技术正文依据 RK-KF-YF-320 V1.0.0（8 页）中文原稿。适用表注明所有芯片、所有内核版本、Android 12，属于历史原稿范围，不是当前兼容性承诺。仅有中文来源，没有英文原图；原稿无位图或技术表，所有提交记录、补丁树、配置、调用及日志保留为可编辑文本。封面法律、联络、受众、修订和重复目录移除。未运行示例、应用补丁或测试硬件。

原稿疑点保留：封面日期早于部分 May 2022 提交日期；枚举 PRIMARY=57/SPDIF_1=89 的二进制注释与十进制不符；路径 frameworks/avmedia 缺少通常的目录分隔，正文“3.1”没有对应编号标题。代码/提交哈希和原日期不猜改。灰底中的调用顺序、声卡映射及路径说明已移回正文并完整翻译。补丁为原稿示例片段，含排版折行，不能视为已验证可直接应用的补丁。MultiAudioTest 和 focusChangeHint = 3 会改变应用路由/焦点策略，需针对产品审核，不应直接当量产策略。

<!-- source:cn p2 unit:0 -->

## 背景介绍

<!-- source:cn p2 unit:1 -->

Android系统多个AudioTrack同时工作默认混音,即使设备支持多个声卡,没有现成的接口可以使得各声卡同时分别输出不同的声音,系统会按照AudioPolicy中预先设置的策略选择优先级最高的声卡。Android系统虽然定义了多种类型声卡设备,但是如果设备有多个同种类型的声卡(例如,多个HDMI),Android系统现有代码无法对其进行区分。鉴于此,RK开发了一套MultiAudio代码,便于用户合理使用设备声卡,提高用户体验。

<!-- source:cn p2 unit:2 -->

## RK MultiAudio

<!-- source:cn p2 unit:3 -->

MultiAudio能够实现如下功能:多HDMI/DP 插拔识别

<!-- source:cn p3 unit:4 -->

PRIMARY/HDMI/SPDIF 声音分离多HDMI OUT:HDMI_0/HDMI_1/.../HDMI_N 声音分离多DP OUT:DP_0/DP_1/.../DP_N 声音分离第三方播放器通过包名指定声卡JAVA层通过接口指定声卡用户可依据自身实际需求合理利用这些功能。

<!-- source:cn p3 unit:5 -->

### SDK需要包含如下代码

<!-- source:cn p3 unit:6 -->

system/media

<!-- source:cn p3 unit:7 -->

```text
commit 6c0705147c3f3e80d469096eead9bfd23dee7c69 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Mon Nov 29 10:21:17 2021 +0800

    Audio: Add define for hdmi/hdmi_1/spdif/spdif_1

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I2862278abf20de0e51417564a5e6c15b2b32faed
```

<!-- source:cn p3 unit:8 -->

frameworks/av

<!-- source:cn p3 unit:9 -->

```text
commit d239c978d8b4edfbce0dbaad9a89f7460644b0a9 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Wed Apr 27 11:20:27 2022 +0800

    MultiAudio: Add route for output of spdif/hdmi/spdif_1/hdmi_1

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I8c24e894682bdb44243d03d5df4f7acd148d307b
```

<!-- source:cn p3 unit:10 -->

frameworks/base

<!-- source:cn p3 unit:11 -->

```text
commit ab4cdd3f83534908b6523d006cf1edc1e33d5396 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Wed Apr 27 10:48:57 2022 +0800

    Audio: add multiaudio support for tablet

    1. add support for hdmi_1/spdif_1
    2. add plug in/out uevent support for hdmi/hdmi_1/spdif/spdif_1
    3. fix volume ajust and save

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I7c09273791fe95c8853c70b9cd22cace424cc28b
```

<!-- source:cn p3 unit:12 -->

device/rockchip/common

<!-- source:cn p4 unit:13 -->

```text
commit eb55d8057b2505ba3adc640e65a23d026f1843e3 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Mon Nov 29 10:13:49 2021 +0800

    add multiaudio support for tablet

    1. audio_policy: separate hdmi and spdif from primary
    2. audio_policy: add support for hdmi_1 and spdif_1
    3. automake for hdmi/spdif/hdmi_1/spdif_1 hal

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I8a5c7287d6abf14d90eea2ed6d4e8d762e0a667c
```

<!-- source:cn p4 unit:14 -->

vendor/rockchip/common

<!-- source:cn p4 unit:15 -->

```text
commit efacda0a974fad003eb5d9e08de44642c49a7d8f (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Thu Apr 28 11:28:49 2022 +0800

    vpu: librkmultiaudio: add init version

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I2d3a4973f964c7c8379fa281dedde7bf7b05f3a9
```

<!-- source:cn p4 unit:16 -->

hardware/interfaces

<!-- source:cn p4 unit:17 -->

```text
commit 6d6bdc031705c0560d20bac28ae3cfd758763bc8 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Wed Apr 27 11:15:20 2022 +0800

    Audio: Add spdif/hdmi/hdmi_1/spdif_1 in devicefactory

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I65802c82f85133cd4a10a78149210bba6f7ca986
```

<!-- source:cn p4 unit:18 -->

hardware/rockchip/audio

<!-- source:cn p4 unit:19 -->

```text
commit 0ea8e9bb709a7cd576bfe585b60f97b9b250001f (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Thu May 12 16:09:57 2022 +0800

    [MultiAudio]: Add multiaudio support for tablet sdk

    Separating HDMI0/HDMI1/DP0/DP1 to their own hal modules so that they
    can work independently at the same time

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I519802684fb09602954bfdea115a3de891667859
```

<!-- source:cn p4 unit:20 -->

build/make

<!-- source:cn p5 unit:21 -->

```text
commit 0a3eb78a77087fffbc3a3e0e45f005661efcf4b1 (HEAD)
Author: shine.liu <shine.liu@rock-chips.com>
Date:   Wed May 11 09:58:00 2022 +0800

    envsetup: Add BOARD_SUPPORT_MULTIAUDIO env definitions

    Signed-off-by: shine.liu <shine.liu@rock-chips.com>
    Change-Id: I2adc1b3fc79ff88eb9a4284a4956f1e341c2e7cf
```

<!-- source:cn p5 unit:22 -->

目前代码已合并至RK Android 12 SDK代码,请同步代码并确认以上提交点是否存在。

<!-- source:cn p5 unit:23 -->

### 补丁

<!-- source:cn p5 unit:24 -->

如果代码不方便同步更新,请打上如下patch所在目录对应补丁。

<!-- source:cn p5 unit:25 -->

```text
➜  patch tree
.
├── build
│   └── make
│       └── 0001-envsetup-Add-BOARD_SUPPORT_MULTIAUDIO-env-definition.patch
├── device
│   └── rockchip
│       └── common
│           └── 0001-add-multiaudio-support-for-tablet.patch
├── frameworks
│   ├── av
│   │   └── 0001-MultiAudio-Add-route-for-output-of-spdif-hdmi-spdif_.patch
│   └── base
│       └── 0001-Audio-add-multiaudio-support-for-tablet.patch
├── hardware
│   ├── interfaces
│   │   └── 0001-Audio-Add-spdif-hdmi-hdmi_1-spdif_1-in-devicefactory.patch
│   └── rockchip
│       └── audio
│           └── 0001-MultiAudio-Add-multiaudio-support-for-tablet-sdk.patch
├── system
│   └── media
│       └── 0001-Audio-Add-define-for-hdmi-hdmi_1-spdif-spdif_1.patch
└── vendor
    └── rockchip
        └── common
            └── 0001-vpu-librkmultiaudio-add-init-version.patch
```

<!-- source:cn p5 unit:26 -->

### 宏开关

<!-- source:cn p5 unit:27 -->

SDK默认支持MultiAudio,如果想关闭或者禁用此功能,可以通过修改BOARD_SUPPORT_MULTIAUDIO来控制。device/rockchip/common

<!-- source:cn p5 unit:28 -->

```text
diff --git a/BoardConfig.mk b/BoardConfig.mk
index 0ddef35..858698f 100755
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -412,7 +412,7 @@ BOARD_USER_FAKETOUCH ?= true
 endif

 ifeq ($(TARGET_BOARD_PLATFORM_PRODUCT), tablet)
-BOARD_SUPPORT_MULTIAUDIO ?= true
+BOARD_SUPPORT_MULTIAUDIO ?= false
 endif

 #for Camera autofocus support
```

<!-- source:cn p6 unit:30 -->

### 调用及测试

<!-- source:cn p6 unit:31 -->

声卡的选择是通过AudioSessionId来控制的,如下:

<!-- source:cn p6 unit:32 -->

```text
typedef enum {
    PRIMARY        = 57,//1110001
    HDMI           = 65,//1000001 //hdmi0
    SPDIF          = 73,//1001001 //dp0
    HDMI_1         = 81,//1010001 //hdmi1
    SPDIF_1        = 89,//1111001 //dp1
}multi_audio_device_t;
```

<!-- source:cn p6 unit:33 -->

JAVA层通过接口调用

<!-- source:cn p6 unit:34 -->

```text
MediaPlayer mp = new MediaPlayer();
mp.setAudioSessionId(audioSessionId);
mp.setDataSource(...);
```

<!-- source:cn p6 unit:34note -->

在 setDataSource 之前调用 setAudioSessionId。输出选择：57 为 speaker，65 为 hdmi，73 为 dp，81 为 hdmi_1，89 为 dp_1。

<!-- source:cn p6 unit:35 -->

通过应用包名判断补丁中有测试用例供参考,如需测试,请将frameworks/av下的宏MultiAudioTest打开

<!-- source:cn p6 unit:36 -->

```text
diff --git a/media/libaudioclient/include/media/AudioTrack.h
b/media/libaudioclient/include/media/AudioTrack.h
index 53b0be725e..b46a941fe3 100644
--- a/media/libaudioclient/include/media/AudioTrack.h
+++ b/media/libaudioclient/include/media/AudioTrack.h
@@ -35,7 +35,7 @@
 #include "android/media/IAudioTrack.h"
 #include "android/media/IAudioTrackCallback.h"

-#define MultiAudioTest 0
+#define MultiAudioTest 1
 namespace android {

 using content::AttributionSourceState;
```

<!-- source:cn p7 unit:37 -->

系统自带RockVideoPlayer和gallery3d,需要再安装一个第三方的mxplayer,并安装多屏显示应用multi-display,补丁包中带这两个应用的安装包。测试用例已经将应用和声卡绑定,实际测试有如下效果:RockVideoPlayer播放视频声音走hdmi声卡gallery3d播放视频声音走hdmi_1声卡mxplayer播放视频声音走speaker声卡并且可以同时播放。

<!-- source:cn p7 unit:38note -->

代码实现位置在 frameworks/avmedia/libaudioclient/AudioTrack.cpp，用户可以参考这部分代码依据自身需求修改。

<!-- source:cn p7 unit:38 -->

```text
#if MultiAudioTest
            String8 tmp = String8(mPackageName);
            if (strstr(tmp.string(), "RockVideoPlayer")) {
                sessionid = (audio_session_t)65;
            } else if (strstr(tmp.string(), "gallery3d")) {
                sessionid = (audio_session_t)81;
            } else if (strstr(tmp.string(), "mxtech")) {
                sessionid = (audio_session_t)57;
            }
#endif
```

<!-- source:cn p7 unit:40 -->

通过multi-display将不同的应用投到不同的屏幕,需要设置如下属性,鼠标可以进入不同屏幕控制视频播放。

<!-- source:cn p7 unit:41 -->

```text
setprop sys.mouse.presentation 1
```

<!-- source:cn p7 unit:42 -->

另外Android系统有音频焦点功能,多屏多个应用同时播放视频会出现暂停现象,frameworks/base需打上如下补丁:

<!-- source:cn p7 unit:43 -->

```text
diff --git
a/services/core/java/com/android/server/audio/MediaFocusControl.java
b/services/core/java/com/android/server/audio/MediaFocusControl.java
index 9548ada14b8e..d82eb3311aeb 100644
--- a/services/core/java/com/android/server/audio/MediaFocusControl.java
+++ b/services/core/java/com/android/server/audio/MediaFocusControl.java
@@ -899,6 +899,7 @@ public class MediaFocusControl implements
PlayerFocusEnforcer {
                     + " flags=0x" + Integer.toHexString(flags)
                     + " sdk=" + sdk))
                 .printLog(TAG));
+        focusChangeHint = 3;
         // we need a valid binder callback for clients
         if (!cb.pingBinder()) {
             Log.e(TAG, " AudioFocus DOA client for requestAudioFocus(),
aborting.");
```

<!-- source:cn p7 unit:44 -->

## 调试

<!-- source:cn p7 unit:45 -->

### 查看声卡

<!-- source:cn p8 unit:46 -->

```text
cat proc/asound/cards
```

<!-- source:cn p8 unit:47 -->

```text
rk3588_s:/ # cat proc/asound/cards

 0 [rockchipes8388 ]: rockchip-es8388 - rockchip-es8388
                      rockchip-es8388
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                      rockchip,hdmiin
 2 [rockchiphdmi0  ]: rockchip-hdmi0 - rockchip-hdmi0
                      rockchip-hdmi0
 3 [rockchiphdmi1  ]: rockchip-hdmi1 - rockchip-hdmi1
                      rockchip-hdmi1
```

<!-- source:cn p8 unit:48 -->

### 测试驱动是否正常

<!-- source:cn p8 unit:49 -->

如果要测试3.1中3588的hdmi0声卡,找一个wav文件,测试命令如下:

<!-- source:cn p8 unit:50 -->

```text
tinyplay xxx.wav -D 2 -d 0
```

<!-- source:cn p8 unit:51 -->

如果声音正常,说明hdmi0声卡驱动正常。

{% endraw %}
