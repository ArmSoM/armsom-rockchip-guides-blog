---
title: "Rockchip Android Multi Audio Entwicklerhandbuch"
description: "Rockchip Android Multi Audio Entwicklerhandbuch — V1.0.0"
excerpt: "Rockchip Android Multi Audio Entwicklerhandbuch"
translation_key: "233-rockchip-android-multi-audio"
slug: "233-rockchip-android-multi-audio"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, MultiAudio]
---

{% raw %}

# Rockchip Android Multi Audio Entwicklerhandbuch

Vollständiger technischer Text der chinesischen Quelle RK-KF-YF-320 V1.0.0 vom acht Seiten. Die Quelltabelle nennt alle Chips/Kernelversionen und Android 12: historischer Umfang, keine aktuelle Kompatibilitätsgarantie. Nur chinesische Quelle, keine englischen Originalbilder. Keine Bitmaps oder technischen Tabellen; Commits, Patchbaum, Konfigurationen, API-Beispiele und Logs bleiben editierbar. Rechts-/Kontakt-, Zielgruppen-, Revisions- und doppelte Inhaltsangaben entfallen. Keine Beispiele, Patches oder Hardwaretests wurden ausgeführt.

Erhaltene Quellprobleme: Das Deckblattdatum liegt vor einigen Commits aus May 2022; Binärkommentare zu PRIMARY=57 und SPDIF_1=89 widersprechen den Dezimalwerten; frameworks/avmedia fehlt der übliche Pfadtrenner; „3.1“ hat keine zugehörige nummerierte Überschrift. Hashes, Codewerte und Daten werden nicht erraten. Aufrufreihenfolge, Kartenzuordnung und Pfaderklärung wurden aus grauen Codeflächen in übersetzten Text übernommen. Patchauszüge enthalten Quellumbrüche und sind nicht als direkt anwendbar validiert. MultiAudioTest und focusChangeHint = 3 ändern Routing/Fokus; für das Produkt prüfen, nicht als Serienstandard übernehmen.

<!-- source:cn p2 unit:0 -->

## Hintergrund

<!-- source:cn p2 unit:1 -->

Android mischt gleichzeitig laufende AudioTrack-Streams standardmäßig. Auch bei mehreren Soundkarten gibt es keine fertige Schnittstelle zur gleichzeitigen getrennten Ausgabe; AudioPolicy wählt nach seiner vorgegebenen Regel die Karte mit höchster Priorität. Android definiert verschiedene Gerätetypen, unterscheidet im bestehenden Code aber nicht mehrere Karten desselben Typs, etwa HDMI. RK entwickelte MultiAudio zur besseren Nutzung der Soundkarten und Verbesserung der Bedienung.

<!-- source:cn p2 unit:2 -->

## RK MultiAudio

<!-- source:cn p2 unit:3 -->

MultiAudio erkennt das Ein-/Ausstecken mehrerer HDMI-/DP-Verbindungen.

<!-- source:cn p3 unit:4 -->

Funktionen: getrenntes PRIMARY/HDMI/SPDIF-Audio; getrennte Ausgänge HDMI_0/HDMI_1/.../HDMI_N und DP_0/DP_1/.../DP_N; Soundkartenauswahl für Fremdplayer über Paketnamen sowie über Java-Schnittstellen. Nach tatsächlichem Bedarf einsetzen.

<!-- source:cn p3 unit:5 -->

### Erforderlicher SDK-Code

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

Laut Quelle wurde der Code in das RK Android 12 SDK integriert. Code synchronisieren und das Vorhandensein der obigen Commits prüfen.

<!-- source:cn p5 unit:23 -->

### Patches

<!-- source:cn p5 unit:24 -->

Falls eine Synchronisierung unpraktisch ist, die folgenden Patches in ihren jeweiligen Verzeichnissen anwenden.

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

### Build-Schalter

<!-- source:cn p5 unit:27 -->

MultiAudio ist im SDK standardmäßig aktiv. Zum Deaktivieren BOARD_SUPPORT_MULTIAUDIO unter device/rockchip/common ändern.

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

### Aufruf und Test

<!-- source:cn p6 unit:31 -->

Die Soundkartenauswahl wird über AudioSessionId gesteuert:

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

Java-Schnittstelle aufrufen

<!-- source:cn p6 unit:34 -->

```text
MediaPlayer mp = new MediaPlayer();
mp.setAudioSessionId(audioSessionId);
mp.setDataSource(...);
```

<!-- source:cn p6 unit:34note -->

setAudioSessionId vor setDataSource aufrufen. Ausgangswahl: 57 = speaker, 65 = hdmi, 73 = dp, 81 = hdmi_1, 89 = dp_1.

<!-- source:cn p6 unit:35 -->

Auswahl anhand des App-Paketnamens: Die Patches enthalten Testfälle. Zum Testen MultiAudioTest unter frameworks/av aktivieren.

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

RockVideoPlayer und gallery3d sind vorinstalliert. Zusätzlich mxplayer und die App multi-display installieren; Installationspakete liegen im Patchpaket. Der Test bindet Apps an Karten: RockVideoPlayer gibt Videoton über hdmi, gallery3d über hdmi_1 und mxplayer über speaker aus. Gleichzeitige Wiedergabe ist möglich.

<!-- source:cn p7 unit:38note -->

Die Quelle nennt als Implementierungspfad frameworks/avmedia/libaudioclient/AudioTrack.cpp. Den Code nach Bedarf anpassen.

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

Mit multi-display Apps auf verschiedene Bildschirme verteilen. Folgende Property setzen, damit die Maus zwischen Bildschirmen wechseln und die Wiedergabe steuern kann.

<!-- source:cn p7 unit:41 -->

```text
setprop sys.mouse.presentation 1
```

<!-- source:cn p7 unit:42 -->

Der Android-Audiofokus kann bei gleichzeitiger Videowiedergabe mehrerer Apps auf mehreren Bildschirmen Pausen auslösen. Dafür folgt ein Patch für frameworks/base:

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

## Fehlersuche

<!-- source:cn p7 unit:45 -->

### Soundkarten anzeigen

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

### Treiber testen

<!-- source:cn p8 unit:49 -->

Zum Prüfen von RK3588 hdmi0, auf den die Quelle als Abschnitt 3.1 verweist, eine WAV-Datei verwenden und Folgendes ausführen:

<!-- source:cn p8 unit:50 -->

```text
tinyplay xxx.wav -D 2 -d 0
```

<!-- source:cn p8 unit:51 -->

Normale Tonausgabe zeigt, dass der hdmi0-Soundkartentreiber funktioniert.

{% endraw %}
