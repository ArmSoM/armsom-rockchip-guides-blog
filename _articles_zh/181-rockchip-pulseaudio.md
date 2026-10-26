---
title: "Rockchip PulseAudio开发指南：UCM/UCM2与JACK检测"
description: "Rockchip PulseAudio开发指南：UCM/UCM2与JACK检测 — V1.0.0"
excerpt: "Rockchip PulseAudio开发指南：UCM/UCM2与JACK检测"
translation_key: "181-rockchip-pulseaudio"
slug: "181-rockchip-pulseaudio"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Audio]
---

{% raw %}

ArmSoM平台参考，依据Rockchip原稿完整技术正文整理。具体板卡、SoC、SDK/BSP、内核和音频硬件/库须先核对，不能宣称所有板卡支持。原稿结果与日志不是ArmSoM实测，未执行命令或硬件验证。

原稿V1.0.0介绍Rockchip Linux PulseAudio功能、驱动开发及调试，适用RK系列Linux4.19/Linux5.10。只有中文PDF，英俄德补译并采用中文原图。示例Debian10/11及PulseAudio版本为原稿环境，不代表当前推荐版本。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

## 1. Linux PulseAudio 简介

PulseAudio(以前叫Polypaudio)是一个跨平台的、可通过网络工作的声音服务,其一般使用于Linux和FreeBSD操作系统。更多的详细的介绍以及使用参⻅以下链接:https://wiki.archlinux.org/title/PulseAudio

https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/Modules/

## 2. PulseAudio UI控制界面 -- pavucontrol

通过pavucontrol 可以选择设备输入输出以及音量等控制。

![原稿技术图](/docs/rockchip-pulseaudio/assets/cn-p004-figure-01.png)

## 3. pulseaudio 的配置

### 3.1 ucm2配置

debian11用pulseaudio-14.2版本的配置用ucm2。如下是ucm2的配置:

```text
3588/debian/overlay/etc/pulse$ tree
.
├── daemon.conf
└── default.pa
~/3588/debian/overlay/usr/share$ tree
.
├── alsa
│   └── ucm2
│       ├── README.md
│       ├── rockchip-es8388
│       │   ├── HiFi.conf
│       │   └── rockchip-es8388.conf
│       ├── rockchip-hdmi0
│       │   ├── Hdmi.conf
│       │   └── rockchip-hdmi0.conf
│       ├── rockchip-hdmi1
│       │   ├── Hdmi.conf
│       │   └── rockchip-hdmi1.conf
│       └── ucm.conf
```

如下是 rockchip-hdmi0 的配置:

```text
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-hdmi0$ cat rockchip-hdmi0.conf
Syntax 2

Comment "Rockchip HDMI card"

SectionUseCase."HDMI" {
        File "Hdmi.conf"
        Comment "HDMI/Display Port 1 Stereo"
}
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-hdmi0$ cat Hdmi.conf
# Usecase for device HDMI0/Display Port stereo playback on rockchip platforms
# For Audio in I2S mode

SectionDevice."HDMI0" {
        Comment "HDMI/Display Port 1 Stereo"

        Value {
                PlaybackPriority 300
                PlaybackPCM "hw:${CardId}"
                If.1 {
                        Condition {
                                Type ControlExists
                                Control "iface=CARD,name='rockchip-hdmi0 Jack'"
                        }
                        True {
                                JackControl "rockchip-hdmi0 Jack"
                        }
                        False {
                                JackControl "rockchip-hdmi0 Jack"
                        }
                }
        }
}
```

JackControl "rockchip-hdmi0 Jack" 是 liunx 的标准的Jack检测机制。对应的配置是arch/arm64/boot/dts/rockchip/rk3588-evb.dtsi:

```text
hdmi0_sound: hdmi0-sound {
        status = "disabled";
        compatible = "rockchip,hdmi";
        rockchip,mclk-fs = <128>;
        rockchip,card-name = "rockchip-hdmi0";
        rockchip,cpu = <&i2s5_8ch>;
        rockchip,codec = <&hdmi0>;
        rockchip,jack-det;
};
```

对应的驱动代码是sound/soc/rockchip/rockchip_hdmi.c。通过rockchip,jack-det属性来支持Jack, jack name 就是rockchip,card-name。如下是rockchip-es838 的配置:

```text
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ ls
HiFi.conf  rockchip-es8388.conf
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ cat rockchip-es8388.conf
Syntax 2

Comment "Rockchip ES8388 card"

SectionUseCase."HiFi" {
        File "HiFi.conf"
        Comment "Default"
}
~/3588/debian/overlay/usr/share/alsa/ucm2/rockchip-es8388$ cat HiFi.conf
SectionVerb {
        Value {
                MinBufferLevel "512"
        }
        EnableSequence [
                cset "name='Speaker Switch' off"
                cset "name='Headphone Switch' off"
                cset "name='Headset Mic Switch' off"
                cset "name='Main Mic Switch' off"
                cset "name='Speaker Switch' off"
                cset "name='Headphone Switch' off"
                cset "name='Headset Mic Switch' off"
                cset "name='Main Mic Switch' off"
                cset "name='PCM Volume' 192"
                cset "name='Output 1 Playback Volume' 27"
                cset "name='Output 2 Playback Volume' 27"
                cset "name='Capture Digital Volume' 192"
                cset "name='Left Channel Capture Volume' 3"
                cset "name='Right Channel Capture Volume' 3"
                cset "name='Left Mixer Left Playback Switch' on"
                cset "name='Right Mixer Right Playback Switch' on"
                cset "name='Capture Mute' off"
                cset "name='Right PGA Mux' DifferentialR"
                cset "name='Left PGA Mux' DifferentialL"
        ]
}

SectionDevice."Speaker" {
        Comment "Speaker"

        ConflictingDevice [
                "Headphones"
        ]

        Value {
                PlaybackPriority 100
                PlaybackPCM "hw:${CardId}"
        }

        EnableSequence [
                cset "name='Speaker Switch' on"
        ]

        DisableSequence [
                cset "name='Speaker Switch' off"
        ]
}

SectionDevice."Mic" {
        Comment "Internal Microphone"

        ConflictingDevice [
                "Headset"
        ]

        Value {
                CapturePriority 100
                CapturePCM "hw:${CardId}"
        }
        EnableSequence [
                cset "name='Differential Mux' Line 2"
                cset "name='Main Mic Switch' on"
        ]

        DisableSequence [
                cset "name='Main Mic Switch' off"
        ]
}

SectionDevice."Headphones" {
        Comment "Headphones"

        ConflictingDevice [
                "Speaker"
        ]

        Value {
                PlaybackPriority 200
                PlaybackPCM "hw:${CardId}"
                JackControl "Headphone Jack"
                JackHWMute "Speaker"
        }

        EnableSequence [
                cset "name='Headphone Switch' on"
        ]
        DisableSequence [
                cset "name='Headphone Switch' off"
        ]
}

SectionDevice."Headset" {
        Comment "Headset Microphone"

        ConflictingDevice [
                "Mic"
        ]

        Value {
                CapturePriority 200
                CapturePCM "hw:${CardId}"
                JackControl "Headset Mic Jack"
                JackHWMute "Mic"
        }

        EnableSequence [
                cset "name='Differential Mux' Line 1"
                cset "name='Headset Mic Switch' on"
        ]

        DisableSequence [
                cset "name='Headset Mic Switch' off"
        ]
}
```

从配置上可以看出配置了两个jack,"Headphone Jack" 和 "Headset Mic Jack"。"Headphone Jack" 耳机检测的jack, 用来区分喇叭/耳机播放;"Headset Mic Jack" 耳机mic检测的jack, 用来区分主板上的mic/耳机mic录音。对应配置:

```text
es8388_sound: es8388-sound {
        status = "okay";
        compatible = "rockchip,multicodecs-card";
        rockchip,card-name = "rockchip-es8388";
        hp-det-gpio = <&gpio1 RK_PD5 GPIO_ACTIVE_LOW>;
        io-channels = <&saradc 3>;
        io-channel-names = "adc-detect";
        keyup-threshold-microvolt = <1800000>;
        poll-interval = <100>;
        spk-con-gpio = <&gpio1 RK_PD3 GPIO_ACTIVE_HIGH>;
        hp-con-gpio = <&gpio1 RK_PD2 GPIO_ACTIVE_HIGH>;
        rockchip,format = "i2s";
        rockchip,mclk-fs = <256>;
        rockchip,cpu = <&i2s0_8ch>;
        rockchip,codec = <&es8388>;
        rockchip,audio-routing =
                "Headphone", "LOUT1",
                "Headphone", "ROUT1",
                "Speaker", "LOUT2",
                "Speaker", "ROUT2",
                "Headphone", "Headphone Power",
                "Headphone", "Headphone Power",
                "Speaker", "Speaker Power",
                "Speaker", "Speaker Power",
                "LINPUT1", "Main Mic",
                "LINPUT2", "Main Mic",
                "RINPUT1", "Headset Mic",
                "RINPUT2", "Headset Mic";
        pinctrl-names = "default";
        pinctrl-0 = <&hp_det>;
        play-pause-key {
                label = "playpause";
                linux,code = <KEY_PLAYPAUSE>;
                press-threshold-microvolt = <2000>;
        };
};
```

| Property | Value | Description |
| --- | --- | --- |
| hp-det-gpio | phandle | 耳机检测pin,通过中断来检测耳机拔插状态 |
| spk-con-gpio | phandle | 功放喇叭控制pin |
| hp-con-gpio | phandle | 耳机控制pin |
| io-channels | phandle | adc检测通道用来区分3/4段耳机, 以及耳机按键 |
| poll-interval | int | adc 轮询时间间隔默认100ms |
| keyup-threshold-microvolt | int | adc 按键电压 |
| play-pause-key | phandle | 这里定义了播放暂停按键, 可以根据需求定义其他按<br>键 |
| rockchip,audio-routing | string | 声卡的 routing |

gpio1_d5 低电平插入耳机检测,gpio1_d2使能耳机 ,gpio1_d3 高电平使能喇叭。adc3 来区分3/4段耳机, 同时支持耳机线上的播放暂停按键。Headphone 对应es8388 的 LROUT1,通过Headphone Power 控制gpio1_d2。Speaker 对应es8388 的 LROUT2,通过Speaker Power 控制gpio1_d3。LINPUT 对应es8388 的 Main Mic, RINPUT对应Headset Mic。

### 3.2 ucm 的配置

debian10用pulseaudio-13.99.x版本的配置是用ucm。如下是ucm 的配置:

```text
alsa$ tree
.
├── ucm
│   ├── rockchip,hdmi
│   │   ├── HDMI.conf
│   │   └── rockchip,hdmi.conf
│   ├── rockchip,rk618-hdmi
│   │   ├── HDMI.conf
│   │   └── rockchip,rk618-hdmi.conf
│   ├── rockchip,rk809-codec
│   │   ├── HiFi.conf
│   │   └── rockchip,rk809-codec.conf
alsa$ cat ucm/rockchip,hdmi/rockchip,hdmi.conf
SectionUseCase."HDMI" {
        File "HDMI.conf"
        Comment "Rockchip HDMI/Display Port Stereo."
}
alsa$ cat ucm/rockchip,hdmi/HDMI.conf
# Use case for devices on rockchip,hdmi card.

SectionDevice."HDMI1" {
        Comment "Rockchip HDMI/Display Port Stereo"

        EnableSequence [

        ]

        DisableSequence [

        ]

        Value {
                PlaybackPCM "hw:rockchiphdmi"
                PlaybackChannels "2"
                PlaybackPriority "5800"
                JackControl "rockchip,hdmi Jack"
        }
}
alsa$ cat ucm/rockchip,rk618-hdmi/rockchip,rk618-hdmi.conf
SectionUseCase."HDMI" {
        File "HDMI.conf"
        Comment "RK618 HDMI/Display Port Stereo."
}
alsa$ cat ucm/rockchip,rk618-hdmi/HDMI.conf
# Use case for devices on rockchip,rk618-hdmi card.

SectionDevice."HDMI2" {
        Comment "RK618 HDMI/Display Port 2 Stereo"

        EnableSequence [

        ]

        DisableSequence [

        ]

        Value {
                PlaybackPCM "hw:rockchiprk618hd"
                PlaybackChannels "2"
                PlaybackPriority "5900"
                JackControl "rockchip,rk618-hdmi Jack"
        }
}
alsa$ cat ucm/rockchip,rk809-codec/rockchip,rk809-codec.conf
SectionUseCase."HiFi" {
        File "HiFi.conf"
        Comment "Play HiFi quality Music."
}
alsa$ cat ucm/rockchip,rk809-codec/HiFi.conf
# Use case for devices on rockchip,rk809-codec card.

SectionVerb {
        EnableSequence [
                cdev "hw:rockchiprk809co"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
        ]
}

SectionDevice."Headphone" {
        Comment "Headphones Playback"

        EnableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' HP"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' OFF"
        ]

        Value {
                PlaybackPCM "hw:rockchiprk809co"
                PlaybackChannels "2"
                PlaybackPriority "1"
                JackControl "Headphones Jack"
                JackHWMute "Speaker"
        }
}

SectionDevice."Speaker" {
        Comment "Speaker Playback"

        EnableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' SPK"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"

                cset "name='Playback Path' OFF"
        ]

        Value {
                PlaybackPCM "hw:rockchiprk809co"
                PlaybackChannels "2"
                PlaybackPriority "2"
        }
}

SectionDevice."Headset" {
        Comment "Headset Mic"
        ConflictingDevice [
                "MainMic"
        ]
        EnableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' Hands Free Mic"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' MIC OFF"
        ]

        Value {
                CapturePCM "hw:rockchiprk809co"
                CaptureChannels "2"
                JackControl "Mic Jack"
                JackHWMute "MainMic"
        }
}

SectionDevice."MainMic" {
        Comment "Main Mic"
        ConflictingDevice [
                "Headset"
        ]
        EnableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' Main Mic"
        ]

        DisableSequence [
                cdev "hw:rockchiprk809co"
                cset "name='Capture MIC Path' MIC OFF"
        ]

        Value {
                CapturePCM "hw:rockchiprk809co"
                CaptureChannels "2"
        }
}
```

## 4. 查看JACK 状态

通过cat 获取card 的ID, 然后再 amixer -c id contents 查看 jack status。例如:

```text
root@linaro-alip:/# cat /proc/asound/cards
 0 [rockchipes8388 ]: rockchip-es8388 - rockchip-es8388
                      rockchip-es8388
 1 [rockchiphdmiin ]: rockchip_hdmiin - rockchip,hdmiin
                      rockchip,hdmiin
 2 [rockchiphdmi0  ]: rockchip-hdmi0 - rockchip-hdmi0
                      rockchip-hdmi0
 3 [rockchiphdmi1  ]: rockchip-hdmi1 - rockchip-hdmi1
                      rockchip-hdmi1
```

例如: rockchip-hdmi0没有接入hdmi0:

```text
root@linaro-alip:/# amixer -c 2 contents
numid=2,iface=CARD,name='rockchip-hdmi0 Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=off
```

例如: rockchip-es8388下面状态表示耳机(Headphone)插入,同时也有耳机 mic (Headset Mic)插入。

```text
root@linaro-alip:/# amixer -c 0 contents
numid=26,iface=CARD,name='Headphone Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=on
numid=27,iface=CARD,name='Headset Mic Jack'
  ; type=BOOLEAN,access=r-------,values=1
  : values=on
```

{% endraw %}
