---
title: "Rockchip 车载音频开发指南"
description: "Rockchip 车载音频开发指南 — V1.0.0"
excerpt: "Rockchip 车载音频开发指南"
translation_key: "234-rockchip-automotive-audio"
slug: "234-rockchip-automotive-audio"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, Automotive]
---

{% raw %}

# Rockchip 车载音频开发指南

依据中文 RK-KF-YF-784 原稿完整整理八个技术章节。封面 V1.0.0，修订表最后记载 V0.2.0（Android 14 功能）；版本差异按原稿披露。适用 RK3588/RK3576、内核 5.10/6.10。文中暂未支持等为历史 SDK 状态，不是当前兼容性结论。只有中文来源，无英文原图；原稿没有技术图片/表格，配置及代码全部可编辑。移除封面法律、联络、受众、修订及重复目录。未执行配置或测试硬件。

校对：跨页代码已接续，灰框外提取的 audioUseDynamicRouting 布尔配置已恢复代码块，MMAP 标识符折行已接合。原稿有 3 个音量组却提及第四个；attchedDevices、audio_policy_configuraion.xml、CarAudioManger、ture 等拼写及 booleanallowed 保留为原文疑点。XML 示例有 AUDIO_CHANNEL_OUT_STREO、缺少 > 的 </mixPort、未闭合外层标签和原有 *** / .... 省略标记；不擅自补写。需按目标分支校验后使用，不是已验证可直接部署配置。车辆提示/应急声音及音量/焦点路由可能影响安全，应在隔离测试环境评估，不能直接当量产策略。

<!-- source:cn p2 unit:0 -->

## 基本概念

<!-- source:cn p2 unit:1-0 -->

AAOS 管理来自 Android 应用的声音,同时控制这些应用,并根据其声音类型将声音路由到 HAL 中的输出设备。

<!-- source:cn p2 unit:1-1 -->

### 逻辑声音流

<!-- source:cn p2 unit:1-2 -->

使用音频属性进行标记,应用可以有一个或多个通过标准 Android API(如用于控制焦点的AudioManager或用于在线播放的 MediaPlayer)发出一个或多个音频数据逻辑声音流。应用声音流与AudioAttributes相关联。逻辑声音流通过 AudioService 发送,并路由到一个(并且只有一个)可用的物理输出声音流。

<!-- source:cn p2 unit:1-3 -->

### 输出设备

<!-- source:cn p2 unit:1-4 -->

在音频 HAL 级别,设备类型 AUDIO_DEVICE_OUT_BUS 提供用于车载音频系统的通用输出设备。详细信息可参考 https://source.android.com/docs/automotive/audio/audio-policy-configuration?hl=zh-cn

<!-- source:cn p2 unit:2 -->

## 音区配置

<!-- source:cn p2 unit:3-0 -->

音区是AAOS中管理的独立音频区域的概念,每个音区拥有独立的焦点管理、音量控制,同时对应到车载各个区域当中。

<!-- source:cn p2 unit:3-1 -->

### 开启动态音区管理

<!-- source:cn p2 unit:3-2 -->

在device 对应的产品目录overlay下添加开启动态路由开关

<!-- source:cn p2 unit:4 -->

```text
<bool name="audioUseDynamicRouting">true</bool>
```

<!-- source:cn p3 unit:5-0 -->

### 音频区域配置

<!-- source:cn p3 unit:5-1 -->

音频区域可通过修改device对应的产品目录下的car_audio_configuration.xml 和audio_policy_configuration.xml进行配置。

<!-- source:cn p3 unit:5-2 -->

### car_audio_configuration.xml 配置

<!-- source:cn p3 unit:5-3 -->

默认的产品的xml配置4个音频区分别和4个区域的用户对应。以下以主音频区为例,占用区域ID为0。定义了3个音量组,同一音量组的设备有相同的音频增益。第一个音量组定义了两个输出设备bus0_media_out和bus6_notification_out,其中bus0_media_out的输出设备对应的音频场景是music和announcement。第二、第三、第四以此类推。 可以根据需要删减音量组、区域。注意点:

<!-- source:cn p3 unit:6 -->

1. 主音频区的 audioZoneId 始终为零。

<!-- source:cn p3 unit:7 -->

2. audioZoneId 和 occupantZoneId 的编号不可重复。其中occupantZoneId是用来映射UserID 和DisplayID。 比如car_audio_configuration.xml定义了3个occupantZoneId 分别为0,1,2。就定义了三个音频区相关的配置。

<!-- source:cn p3 unit:8 -->

3. audioZoneId 和 occupantZoneId 之间只能是一对一的映射。

<!-- source:cn p3 unit:9 -->

4. 所有的context都必须分配一个device address,并且只能分配给一个device address。

<!-- source:cn p3 unit:10 -->

```text
<carAudioConfiguration version="2">
    <zones>
        <zone name="primary zone" isPrimary="true" occupantZoneId="0">
            <volumeGroups>
                <group>
                    <device address="bus0_media_out">
                        <context context="music"/>
                        <context context="announcement"/>
                    </device>
                    <device address="bus6_notification_out">
                        <context context="notification"/>
                        <context context="system_sound"/>
                        <context context="emergency"/>
                        <context context="safety"/>
                        <context context="vehicle_status"/>
                        <context context="alarm"/>
                    </device>
                </group>
                <group>
                    <device address="bus1_navigation_out">
                        <context context="navigation"/>
                    </device>
                    <device address="bus2_voice_command_out">
                        <context context="voice_command"/>
                    </device>
                </group>
                <group>
                    <device address="bus4_call_out">
                        <context context="call"/>
                        <context context="call_ring"/>
                    </device>
                </group>
            </volumeGroups>
        </zone>
    </zones>
</carAudioConfiguration>
```

<!-- source:cn p4 unit:11-0 -->

### audio_policy_configuration.xml配置

<!-- source:cn p4 unit:11-1 -->

配置好上层service 使用的xml后,还需要配置框架中流和设备的信息,需要添加attchedDevices、mixport、deviceport以及mixport和deviceport之间的routes。如下配置主音频区域所需的设备、流端口、设备端口以及之间的路由。

<!-- source:cn p4 unit:12 -->

```text
<modules>
      <!-- Primary Audio HAL -->
      <module name="primary" halVersion="3.0">
          <attachedDevices>
              <!-- One bus per context -->
              <item>bus0_media_out</item>
              <item>bus1_navigation_out</item>
              <item>bus2_voice_command_out</item>
              <item>bus4_call_out</item>
              <item>bus6_notification_out</item>
          </attachedDevices>
          <defaultOutputDevice>bus0_media_out</defaultOutputDevice>
          <mixPorts>
              <mixPort name="mixport_bus0_media_out" role="source"
                       flags="AUDIO_OUTPUT_FLAG_PRIMARY">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus1_navigation_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus2_voice_command_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus4_call_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STREO"/>
              </mixPort
              <mixPort name="mixport_bus6_notification_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
          </mixPorts>
          <devicePorts>
              <devicePort tagName="bus0_media_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus0_media_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus1_navigation_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                      address="bus1_navigation_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus2_voice_command_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus2_voice_command_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus4_call_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus4_call_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus6_notification_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus6_notification_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
          </devicePorts>
          <!-- route declaration, i.e. list all available sources for a
given sink -->
          <routes>
              <route type="mix" sink="bus0_media_out"
sources="mixport_bus0_media_out"/>
              <route type="mix" sink="bus1_navigation_out"
sources="mixport_bus1_navigation_out"/>
              <route type="mix" sink="bus2_voice_command_out"
                     sources="mixport_bus2_voice_command_out"/>
              <route type="mix" sink="bus4_call_out"
sources="mixport_bus4_call_out"/>
              <route type="mix" sink="bus6_notification_out"
                     sources="mixport_bus6_notification_out"/>
          </routes>
</module>
```

<!-- source:cn p6 unit:15-0 -->

### 乘客音频投放到主音频区(Android14支持)

<!-- source:cn p6 unit:15-1 -->

将乘客区的context 为Music的音频数据通过主屏区的设备进行播放。应用通过乘客区的userid 传递CarAudioManager提供的api allowMediaAudioOnPrimaryZone(long requestId, booleanallowed)中可实现相应的功能。

<!-- source:cn p6 unit:15-2 -->

### 动态音频区配置(Android14支持)

<!-- source:cn p6 unit:15-3 -->

在同一个音频区域中 同一个context有两个输出的bus address,可以在播放过程中进行切换。音频区动态配置需要修改车载音频配置如下给zone id为1的音频区域配置 zone 1 config 0和 zone 1 config 1。

<!-- source:cn p6 unit:16 -->

```text
<carAudioConfiguration version="3">
  <zones>
      <zone name="Zone1" audioZoneId="1" occupantZoneId="1">
          <zoneConfigs>
              <zoneConfig name="Zone 1 Config 0" isDefault="true">
                  <volumeGroups>
                      <group>
                          <device address="bus_100">
                              <context context="music"/>
                                  ***
                          </device>
                      </group>
                  </volumeGroups>
              </zoneConfig>
              <zoneConfig name="Zone 1 Config 1">
                  <volumeGroups>
                      <group>
                          <device address="bus_101">
                              <context context="music"/>
                                  ***
                          </device>
                      </group>
                  </volumeGroups>
              </zoneConfig>
          </zoneConfigs>
      </zone>
</zones>
```

<!-- source:cn p6 unit:17 -->

注意点:

<!-- source:cn p6 unit:18 -->

1. 两个zoneConfig的地址不一样, 只能添加到非primary zone的区域。

<!-- source:cn p6 unit:19-0 -->

2. 添加的device address 在audio_policy_configuraion.xml需要定义。

<!-- source:cn p6 unit:19-1 -->

### 音频区域镜像(Android14支持)

<!-- source:cn p7 unit:20 -->

音频镜像功能使乘客能够共享音频。开启音频镜像能够将两个或两个以上的设备共享相同的音频数据。如下车载音频配置定义了一个address 为bus_1000的mirror 设备,在外部应用调用enableMirrorForAudioZones传递mirror的zoneID 队列到系统。车载系统会将zoneID对应的所有bus address都输出相同的音频数据。

<!-- source:cn p7 unit:21 -->

```text
<carAudioConfiguration version="3">
   <mirroringDevices>
       <mirroringDevice address="bus_1000"/>
   </mirroringDevices>
  <zones>
    ....
  </zones>
</carAudioConfiguration>
```

<!-- source:cn p7 unit:22 -->

## 音频焦点

<!-- source:cn p7 unit:23-0 -->

### 音频焦点基本概念

<!-- source:cn p7 unit:23-1 -->

音频焦点的目标是确保在多个应用程序同时播放音频时,用户能够顺利地听到他们想要听的声音,并防止多个应用同时混合输出声音,造成用户困扰。也就是每次要去播放某个声音的时候 先去请求焦点,请求到焦点 后才能开始播放。

<!-- source:cn p7 unit:23-2 -->

### 应用获取音频焦点的api

<!-- source:cn p7 unit:23-3 -->

android 的audioManager 提供了requestAudioFocus 的接口来获取焦点。

<!-- source:cn p7 unit:23-4 -->

### AAOS焦点请求处理

<!-- source:cn p7 unit:23-5 -->

CarAudioService根据传递进来的请求参数 和目前持有的场景来决定 是否让这个焦点请求成功。 这个具体的规则是基于交互矩阵来实现的。系统会根据请求的 CarAudioContext 和当前焦点持有者的 CarAudioContext 之间的预定义交互来处理音频焦点请求。交互类型分以下三种:独占、拒绝和并发。交互矩阵可以参考https://source.android.com/docs/devices/automotive/audio/audio-focus?hl=zh-cn 。car_audio_configuration.xml中配置audioUseHalDuckingSignals为ture,那么焦点的焦点类型为AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK会需要调用audioControl hal的onDevicesToDuckChange来降低音量。 如果设置为false,那么duck的事件不会通知hal层, 上层也不会进行任何处理。

<!-- source:cn p7 unit:24 -->

## 音量调节

<!-- source:cn p7 unit:25-0 -->

### 音量调节

<!-- source:cn p7 unit:25-1 -->

外部应用应使用CarAudioManger提供的相关api来获取和设置音量。在device 对应的产品目录overlay下配置config_useFixedVolume为true,使用外部的硬件放大器进行音量的调节car_audio_configuration.xml中定义为同一个volumeGroup的音量会同步调节。在device 对应的产品目录overlay下配置config_handleVolumeKeysInWindowManager 为true,按键处理不经过android框架而是回调到CarService进行处理。在device 对应的产品目录overlay下配置audioUseCarVolumeGroupMuting为true(建议值),用于启用各个音量组的静音功能,可以单独将每个音量组静音。如果设为 false(默认值),系统会停用单个音量组的静音功能,静音功能会切换为主静音。按键和ui 音量处理会回调到carAudioService而不经过android的系统音频框架进行处理, 其中按键只能控制主屏区域的音量。

<!-- source:cn p7 unit:26 -->

## PCM 插件

<!-- source:cn p8 unit:27-0 -->

PCM插件扩展了PCM设备的功能和特性。这些插件负责各种采样率转换、通道之间复制等等。这些插件是通过配置vendor/etc/asound.conf配置文件来控制。asound.conf 格式可以参考ALSA project - the Clibrary reference: PCM (digital audio) plugins (alsa-project.org)

<!-- source:cn p8 unit:27-1 -->

### dshare plugin

<!-- source:cn p8 unit:27-2 -->

这个插件允许与多个的客户端共享多个通道,每个通道的访问是独一性的。与share插件不同,这个插件不需要显式的服务器程序,而是像dmix和dsnoop插件一样从每个客户端并发访问共享缓冲区。下面为插件支持的参数配置。

<!-- source:cn p8 unit:28 -->

```text
pcm.name {
    type dshare     # Direct sharing
    ipc_perm INT        # IPC permissions (octal, default 0600)
    slave STR
    # or
    slave {         # Slave definition
        pcm STR     # slave PCM name
        # or
        pcm { }     # slave PCM definition
        format STR  # format definition
        rate INT    # rate definition
        channels INT
        period_time INT # in usec
        # or
        period_size INT # in frames
        buffer_time INT # in usec
        # or
        buffer_size INT # in frames
        periods INT # when buffer_size or buffer_time is not specified
    }
    bindings {      # note: this is client independent!!!
        N INT       # maps slave channel to client channel N
    }
}
```

<!-- source:cn p8 unit:29-0 -->

### dsnoop plugin

<!-- source:cn p8 unit:29-1 -->

这个插件将一个多通道捕获流拆分给多个客户端,每个通道的访问是独一性的。下面为插件支持的参数配置。

<!-- source:cn p8 unit:30 -->

```text
pcm.name {
    type dsnoop     # Direct snoop
    slave STR
    # or
    slave {         # Slave definition
        pcm STR     # slave PCM name
        # or
        pcm { }     # slave PCM definition
        format STR  # format definition
        rate INT    # rate definition
        channels INT
        period_time INT # in usec
        # or
        period_size INT # in frames
        buffer_time INT # in usec
        # or
        buffer_size INT # in frames
        periods INT # when buffer_size or buffer_time is not specified
    }
    bindings {      # note: this is client independent!!!
        N INT       # maps slave channel to client channel N
    }
}
```

<!-- source:cn p9 unit:32 -->

## Audio HAL

<!-- source:cn p9 unit:33-0 -->

Android 管理来自应用程序的声音,控制这些应用程序并根据声音类型将它们的声音路由到HAL。在HAL上选择对应的输出设备,并将他们路由到合适的扬声器。输出设备在Audio HAL层, 设备类型AUDIO_DEVICE_OUT_BUS提供用于车载音频系统的通用输出设备。AUDIO_DEVICE_OUT_BUS类型设备支持可寻址端口(其中每个端口都是一个物理设备的端口)。AUDIO_DEVICE_OUT_BUS 是目前预计车载唯一支持的

<!-- source:cn p9 unit:33-1 -->

### 输出设备

<!-- source:cn p9 unit:33-2 -->

类型。AUDIO_DEVICE_OUT_BUS类型,通过start_output_stream传下来, 而BUS address 是在开机时,调用open_output_stream打开stream时固定的。

<!-- source:cn p9 unit:34 -->

```text
if (out->devices[i] == AUDIO_DEVICE_OUT_SPEAKER ||
  out->devices[i] == AUDIO_DEVICE_OUT_WIRED_HEADSET ||
  out->devices[i] == AUDIO_DEVICE_OUT_WIRED_HEADPHONE ||
  out->devices[i] == AUDIO_DEVICE_OUT_BUS) {
  audio_devices_t route_device = out->devices[i];
  route_pcm_card_open(adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].card,
getRouteFromDevice(route_device));
  if (out->address == NULL) {
      card = adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].card;
      device = adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].device;
  } else {
      if (strcmp(out->address, "bus0_media_out") == 0) {
          card = 103;
          device = 0;
      } else if (strcmp(out->address, "bus1_navigation_out") == 0) {
           card = 103;
           device = 1;
      } else if (strcmp(out->address, "bus2_voice_command_out") == 0) {
           card = 103;
           device = 2;
      } else if (strcmp(out->address, "bus4_call_out") == 0) {
           card = 103;
           device = 3;
      } else if (strcmp(out->address, "bus6_notification_out") == 0) {
           card = 103;
           device = 4;
      } else if (strcmp(out->address, "bus100_audio_zone_1") == 0) {
          card = 103;
          device = 5;
      } else if (strcmp(out->address, "bus200_audio_zone_2") == 0) {
          card = 103;
          device = 6;
      } else if (strcmp(out->address, "bus300_audio_zone_3") == 0) {
          card = 103;
          device = 7;
      } else {
          card = 103;
          device = 0;
      }
  }
}
```

<!-- source:cn p10 unit:36-0 -->

### 输入设备

<!-- source:cn p10 unit:36-1 -->

在录制音频时,Audio HAL层会收到openInputStream调用, 其中包含指示如何处理录制音频流的AudioSource参数。

<!-- source:cn p10 unit:36-2 -->

### 注意点

<!-- source:cn p10 unit:37 -->

1. 在asound.conf 中定义的声卡和设备的ID 需要 跟hal中配置的声卡 和设备 ID 一致。比如:分配给bus0_media_out 的cardID 为 103 ,device 为 0。相对应的asound.conf中需要定义一个pcmC103D0p的pcm节点。

<!-- source:cn p10 unit:38 -->

2. 目前规定使用dshare/dsnoop插件声卡的编号需要从100开始。

<!-- source:cn p10 unit:39 -->

## AudioControl HAL

<!-- source:cn p10 unit:40-0 -->

AudioControl HAL 是AAOS 系统中引入的车载音频硬件控制的一个hal。车载音频服务会与音频控制HAL 进行通信,外部车载音频硬件如仪表、收音机等的声音状态会通过HAL 通知到车载音频服务,AAOS的声音的状态也可以通过HAL与外部音频硬件交互。

<!-- source:cn p10 unit:40-1 -->

### 音量控制 (Android12 支持)

<!-- source:cn p10 unit:40-2 -->

Android12 车载音频服务 会通过AudioControl HAL 对 车载的外部音频硬件进行音量的控制。Android 14 暂未支持。其余音频闪避、平衡等功能暂未支持。

<!-- source:cn p10 unit:41 -->

## AAudio

<!-- source:cn p10 unit:42-0 -->

### 基本概念

<!-- source:cn p10 unit:42-1 -->

AAudio 是 Android 8.0 及以上版本中引入的一种音频 API,提供了一个低延迟数据路径,在与支持MMAP 的 HAL 和驱动程序结合使用时,可缩短音频播放和录制的延迟时间。AAudio可以分为shared模式和 exclusive 模式在 exclusive 模式下,使用该功能可将客户端应用代码直接写入与 ALSA 驱动程序共享的内存映射缓冲区。在 shared 模式下,MMAP 缓冲区由 AudioServer 中运行的混音器使用。在 exclusive 模式下,由于数据会绕过混音器,延迟时间会明显缩短。

<!-- source:cn p10 unit:42-2 -->

### 配置添加

<!-- source:cn p10 unit:42-3 -->

默认sdk 中没有开启aaudio mmap的功能。

<!-- source:cn p10 unit:43 -->

1. 产品目录的build.prop 添加开启 AAudio的功能

<!-- source:cn p10 unit:44 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_policy=2
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_exclusive_policy=2
```

<!-- source:cn p10 unit:45 -->

可以根据情况设置值为1、2、3中的一个,建议设置为2。1 = AAUDIO_POLICY_NEVER - 仅使用旧的路径,不使用 MMAP。2 = AAUDIO_POLICY_AUTO - 尝试使用 MMAP。操作失败或 MMAP 不可用,则使用旧路径。3 = AAUDIO_POLICY_ALWAYS - 仅使用 MMAP 路径。不回退到旧路径。

<!-- source:cn p10 unit:46 -->

2. 配置AAudio 输出的声卡和设备如下属性配置用于输出的AAudio路径的声卡。没有配置则sdk默认输出到声卡1 的设备0。

<!-- source:cn p10 unit:47 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_card=card:0dev:0
```

<!-- source:cn p11 unit:48 -->

3. audio_policy_configuration.xml 添加mmap的流端口如下所示添加mmap_no_irq_out 和 mmap_no_irq_in两个mixport,并和对应的deviceport建立起routes。其中xml中channelMasks、dts中配置的TDM 通道数以及hal中配置给kernel的通道数需要保持一致。sdk默认配置为8通道。

<!-- source:cn p11 unit:49 -->

```text
<mixPort name="mmap_no_irq_out" role="source"
flags="AUDIO_OUTPUT_FLAG_DIRECT|AUDIO_OUTPUT_FLAG_MMAP_NOIRQ">
 <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
          samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO,AUDIO_CHANNEL_INDEX_MASK_8"/>
</mixPort>
<mixPort name="mmap_no_irq_in" role="sink"
flags="AUDIO_INPUT_FLAG_MMAP_NOIRQ">
 <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"

samplingRates="8000,11025,12000,16000,22050,24000,32000,44100,48000"

channelMasks="AUDIO_CHANNEL_IN_MONO,AUDIO_CHANNEL_IN_STEREO,AUDIO_CHANNEL_IN_FRONT_BACK"/>
</mixPort>
<routes>
 <route type="mix" sink="bus0_media_out"
sources="mixport_bus0_media_out,mmap_no_irq_out"/>
 <route type="mix" sink="mmap_no_irq_in"
    sources="Built-In Mic,Built-In Back Mic,Echo-Reference Mic"/>
</routes>
```

{% endraw %}
