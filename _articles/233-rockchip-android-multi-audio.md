---
title: "Rockchip Android Multi Audio Developer Guide"
description: "Rockchip Android Multi Audio Developer Guide — V1.0.0"
excerpt: "Rockchip Android Multi Audio Developer Guide"
translation_key: "233-rockchip-android-multi-audio"
slug: "233-rockchip-android-multi-audio"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, MultiAudio]
---

{% raw %}

# Rockchip Android Multi Audio Developer Guide

Complete technical text of the Chinese RK-KF-YF-320 V1.0.0 source (eight pages). Its applicability table says all chips/all kernel versions, Android 12: a historical scope, not current compatibility assurance. Only a Chinese source exists, with no English original figures. The source contains no bitmaps or technical tables; all commit records, patch trees, configurations, API examples and logs remain editable. Legal/contact, audience, revision and duplicate contents material is omitted. No examples, patches or hardware tests were executed.

Source issues retained: cover date precedes some May 2022 commit dates; binary comments for PRIMARY=57 and SPDIF_1=89 disagree with their decimal values; frameworks/avmedia lacks the usual directory separator; “3.1” has no corresponding numbered heading. No commit hash, code value or date is guessed. Call order, card mappings and the path explanation were moved out of gray code formatting into translated prose. Patch excerpts retain source line wrapping and are not verified directly applicable patches. MultiAudioTest and focusChangeHint = 3 change routing/focus policy; review for the product rather than treating them as production defaults.

<!-- source:cn p2 unit:0 -->

## Background

<!-- source:cn p2 unit:1 -->

Android mixes concurrent AudioTrack streams by default. Even with multiple sound cards, no ready-made interface lets each card simultaneously output different audio; AudioPolicy selects the highest-priority card under its predefined policy. Android defines several device types but its existing code cannot distinguish multiple cards of the same type, such as multiple HDMI devices. RK developed MultiAudio to make better use of the available sound cards and improve the user experience.

<!-- source:cn p2 unit:2 -->

## RK MultiAudio

<!-- source:cn p2 unit:3 -->

MultiAudio supports detection of insertion/removal of multiple HDMI/DP connections.

<!-- source:cn p3 unit:4 -->

It separates PRIMARY/HDMI/SPDIF audio; separates HDMI_0/HDMI_1/.../HDMI_N outputs and DP_0/DP_1/.../DP_N outputs; selects a card for third-party players by package name; and provides Java interfaces for card selection. Use these features according to actual requirements.

<!-- source:cn p3 unit:5 -->

### Required SDK code

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

The source states that this code has been merged into the RK Android 12 SDK. Synchronize the code and check that the commits above are present.

<!-- source:cn p5 unit:23 -->

### Patches

<!-- source:cn p5 unit:24 -->

If synchronizing the code is inconvenient, apply the patches below in their corresponding directories.

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

### Build switch

<!-- source:cn p5 unit:27 -->

MultiAudio is enabled by default in the SDK. Disable it by changing BOARD_SUPPORT_MULTIAUDIO in device/rockchip/common.

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

### Invocation and testing

<!-- source:cn p6 unit:31 -->

Sound-card selection is controlled through AudioSessionId:

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

Calling the Java interface

<!-- source:cn p6 unit:34 -->

```text
MediaPlayer mp = new MediaPlayer();
mp.setAudioSessionId(audioSessionId);
mp.setDataSource(...);
```

<!-- source:cn p6 unit:34note -->

Call setAudioSessionId before setDataSource. Output selection: 57 = speaker, 65 = hdmi, 73 = dp, 81 = hdmi_1, 89 = dp_1.

<!-- source:cn p6 unit:35 -->

Selection by app package name: the patches include test cases. To test, enable MultiAudioTest under frameworks/av.

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

RockVideoPlayer and gallery3d are built in. Also install the third-party mxplayer and the multi-display app; their installers are included in the patch package. The test case binds apps to cards: RockVideoPlayer video audio uses hdmi, gallery3d uses hdmi_1, and mxplayer uses speaker. They can play simultaneously.

<!-- source:cn p7 unit:38note -->

The source locates this implementation at frameworks/avmedia/libaudioclient/AudioTrack.cpp. Adapt the code to your requirements.

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

Use multi-display to place apps on different screens. Set the following property so the mouse can move between screens and control playback.

<!-- source:cn p7 unit:41 -->

```text
setprop sys.mouse.presentation 1
```

<!-- source:cn p7 unit:42 -->

Android audio focus can pause playback when multiple apps play video on multiple screens. Apply the following frameworks/base patch:

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

## Debugging

<!-- source:cn p7 unit:45 -->

### List sound cards

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

### Test the driver

<!-- source:cn p8 unit:49 -->

To test RK3588 hdmi0 referred to as section 3.1 in the source, obtain a WAV file and run:

<!-- source:cn p8 unit:50 -->

```text
tinyplay xxx.wav -D 2 -d 0
```

<!-- source:cn p8 unit:51 -->

Normal audio indicates that the hdmi0 sound-card driver is working.

{% endraw %}
