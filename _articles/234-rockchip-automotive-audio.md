---
title: "Rockchip Automotive Audio Developer Guide"
description: "Rockchip Automotive Audio Developer Guide — V1.0.0"
excerpt: "Rockchip Automotive Audio Developer Guide"
translation_key: "234-rockchip-automotive-audio"
slug: "234-rockchip-automotive-audio"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, Automotive]
---

{% raw %}

# Rockchip Automotive Audio Developer Guide

Complete eight-section technical edition of Chinese RK-KF-YF-784. The cover says V1.0.0; the last revision entry says V0.2.0 (Android 14 features). This source discrepancy is disclosed. Applicable source platforms: RK3588/RK3576, kernels 5.10/6.10. Unsupported-feature statements describe the historical SDK, not present compatibility. Only a Chinese source exists; no English original figures. There are no technical images or tables; all code and configurations are editable. Legal/contact, audience, revision and duplicate contents pages are omitted. No configuration or hardware testing was performed.

Editorial audit: joined page-split code, restored the audioUseDynamicRouting Boolean to a code block and joined a wrapped MMAP identifier. Source issues retained: three volume groups but a reference to a fourth; attchedDevices, audio_policy_configuraion.xml, CarAudioManger, ture and booleanallowed spellings. XML includes AUDIO_CHANNEL_OUT_STREO, </mixPort missing >, unclosed outer tags and original *** / .... omissions. These are not silently completed. Validate against the target branch before use; examples are not verified deployment configurations. Vehicle alerts/emergency audio and volume/focus routing can affect safety: evaluate in an isolated test environment, not directly as production policy.

<!-- source:cn p2 unit:0 -->

## Basic concepts

<!-- source:cn p2 unit:1-0 -->

AAOS manages sound from Android applications, controls those applications, and routes sound to HAL output devices according to sound type.

<!-- source:cn p2 unit:1-1 -->

### Logical audio streams

<!-- source:cn p2 unit:1-2 -->

Audio attributes identify streams. An application can generate one or more logical audio-data streams through standard Android APIs, such as AudioManager for focus control or MediaPlayer for online playback. Application streams are associated with AudioAttributes. AudioService sends each logical stream to one, and only one, available physical output stream.

<!-- source:cn p2 unit:1-3 -->

### Output devices

<!-- source:cn p2 unit:1-4 -->

At the audio HAL level, AUDIO_DEVICE_OUT_BUS is the generic output-device type for automotive audio systems. Details: https://source.android.com/docs/automotive/audio/audio-policy-configuration?hl=zh-cn

<!-- source:cn p2 unit:2 -->

## Audio-zone configuration

<!-- source:cn p2 unit:3-0 -->

An audio zone is an independent audio area managed by AAOS. Each zone has its own focus management and volume control and corresponds to a physical area of the vehicle.

<!-- source:cn p2 unit:3-1 -->

### Enable dynamic audio-zone management

<!-- source:cn p2 unit:3-2 -->

Add the dynamic-routing enable switch in the overlay of the corresponding product directory under device.

<!-- source:cn p2 unit:4 -->

```text
<bool name="audioUseDynamicRouting">true</bool>
```

<!-- source:cn p3 unit:5-0 -->

### Audio-area configuration

<!-- source:cn p3 unit:5-1 -->

Configure audio zones by editing car_audio_configuration.xml and audio_policy_configuration.xml in the corresponding product directory under device.

<!-- source:cn p3 unit:5-2 -->

### car_audio_configuration.xml configuration

<!-- source:cn p3 unit:5-3 -->

The default product XML configures four audio zones corresponding to users in four areas. The following example uses the primary audio zone, with occupant-zone ID 0. It defines three volume groups; devices in a group have the same audio gain. The first group defines bus0_media_out and bus6_notification_out; bus0_media_out handles music and announcement contexts. The source says the second, third and fourth follow similarly. Remove volume groups or zones as required. Notes:

<!-- source:cn p3 unit:6 -->

1. The primary audio zone always has audioZoneId zero.

<!-- source:cn p3 unit:7 -->

2. audioZoneId and occupantZoneId values must not be duplicated. occupantZoneId maps UserID and DisplayID. For example, three occupantZoneId values 0, 1 and 2 in car_audio_configuration.xml define configurations for three audio zones.

<!-- source:cn p3 unit:8 -->

3. audioZoneId and occupantZoneId must have a one-to-one mapping.

<!-- source:cn p3 unit:9 -->

4. Every context must be assigned a device address, and may be assigned only one device address.

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

###  audio_policy_configuration.xml configuration

<!-- source:cn p4 unit:11-1 -->

After configuring the XML used by the upper-layer service, configure framework streams and devices: add attchedDevices, mixport, deviceport and routes between mixport and deviceport. The example below defines the devices, stream ports, device ports and routes required by the primary audio zone.

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

### Play passenger audio in the primary zone (Android 14)

<!-- source:cn p6 unit:15-1 -->

Play passenger-zone audio with context Music through the primary-screen zone's device. The source describes passing the passenger-zone userid through the CarAudioManager API allowMediaAudioOnPrimaryZone(long requestId, booleanallowed) to enable this function.

<!-- source:cn p6 unit:15-2 -->

### Dynamic audio-zone configuration (Android 14)

<!-- source:cn p6 unit:15-3 -->

Within one audio zone, a context can have two output bus addresses and switch between them during playback. Modify the automotive audio configuration for dynamic zones. The example configures zone 1 config 0 and zone 1 config 1 for audio zone ID 1.

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

Notes:

<!-- source:cn p6 unit:18 -->

1. The two zoneConfig addresses differ; they can only be added to a non-primary zone.

<!-- source:cn p6 unit:19-0 -->

2. Define the added device address in audio_policy_configuraion.xml.

<!-- source:cn p6 unit:19-1 -->

### Audio-zone mirroring (Android 14)

<!-- source:cn p7 unit:20 -->

Audio mirroring lets passengers share audio: two or more devices receive the same audio data. The following configuration defines a mirror device with address bus_1000. An external application calls enableMirrorForAudioZones and passes the mirror zoneID list to the system. The automotive system outputs identical audio data to all bus addresses associated with those zoneIDs.

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

## Audio focus

<!-- source:cn p7 unit:23-0 -->

### Audio-focus basics

<!-- source:cn p7 unit:23-1 -->

Audio focus ensures users can hear the desired sound when multiple applications play audio and prevents confusing mixed output. Before playing a sound, request focus; start playback only after focus is granted.

<!-- source:cn p7 unit:23-2 -->

### API for acquiring audio focus

<!-- source:cn p7 unit:23-3 -->

Android audioManager provides requestAudioFocus to acquire focus.

<!-- source:cn p7 unit:23-4 -->

### AAOS focus-request handling

<!-- source:cn p7 unit:23-5 -->

CarAudioService decides whether a focus request succeeds from its parameters and the currently active context. Rules use an interaction matrix: the requested CarAudioContext and the current focus holder's CarAudioContext have predefined exclusive, reject or concurrent interactions. See https://source.android.com/docs/devices/automotive/audio/audio-focus?hl=zh-cn . The source specifies audioUseHalDuckingSignals=ture in car_audio_configuration.xml: for AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK, audioControl HAL onDevicesToDuckChange is called to reduce volume. If false, duck events are not sent to HAL and the upper layer performs no handling.

<!-- source:cn p7 unit:24 -->

## Volume adjustment

<!-- source:cn p7 unit:25-0 -->

### Volume adjustment

<!-- source:cn p7 unit:25-1 -->

External applications should use the relevant CarAudioManger APIs to get and set volume. In the product overlay under device, set config_useFixedVolume=true to adjust volume through an external hardware amplifier. Devices in the same volumeGroup in car_audio_configuration.xml change volume together. Set config_handleVolumeKeysInWindowManager=true in that overlay to send key handling directly to CarService rather than the Android framework. Set audioUseCarVolumeGroupMuting=true (recommended) to enable independent muting of each volume group. With false (default), individual group muting is disabled and muting becomes master mute. Key and UI volume handling calls back into carAudioService instead of the Android system audio framework; keys can control only the primary-screen zone's volume.

<!-- source:cn p7 unit:26 -->

## PCM plugins

<!-- source:cn p8 unit:27-0 -->

PCM plugins extend PCM-device capabilities, handling sample-rate conversion, copying between channels and other operations. Configure them through vendor/etc/asound.conf. For the format, see ALSA project - the C library reference: PCM (digital audio) plugins (alsa-project.org).

<!-- source:cn p8 unit:27-1 -->

### dshare plugin

<!-- source:cn p8 unit:27-2 -->

This plugin shares multiple channels among multiple clients, with exclusive access to each channel. Unlike the share plugin, it needs no explicit server process: clients concurrently access a shared buffer, as with dmix and dsnoop. Supported parameters follow.

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

This plugin splits a multichannel capture stream among multiple clients, with exclusive access to each channel. Supported parameters follow.

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

Android manages application sound, controls applications, and routes their sound to HAL according to type. HAL selects the corresponding output devices and routes them to appropriate speakers.

<!-- source:cn p9 unit:33-1 -->

### Output devices

<!-- source:cn p9 unit:33-2 -->

At Audio HAL level, AUDIO_DEVICE_OUT_BUS provides generic automotive output devices with addressable ports, each representing a physical-device port. The source expects AUDIO_DEVICE_OUT_BUS to be the only supported automotive output type. The type is passed through start_output_stream; the BUS address is fixed at boot when open_output_stream opens the stream.

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

### Input devices

<!-- source:cn p10 unit:36-1 -->

During recording, Audio HAL receives openInputStream with an AudioSource parameter indicating how to handle the recorded audio stream.

<!-- source:cn p10 unit:36-2 -->

### Important notes

<!-- source:cn p10 unit:37 -->

1. Card and device IDs in asound.conf must match the HAL configuration. For example, bus0_media_out uses cardID 103 and device 0; asound.conf must define the corresponding pcmC103D0p PCM node.

<!-- source:cn p10 unit:38 -->

2. The source requires sound-card numbering for dshare/dsnoop plugins to start at 100.

<!-- source:cn p10 unit:39 -->

## AudioControl HAL

<!-- source:cn p10 unit:40-0 -->

AudioControl HAL is the automotive audio-hardware control HAL introduced in AAOS. The automotive audio service communicates with it. External hardware, such as instruments and radios, reports sound state to the service through HAL; AAOS audio state can also interact with external audio hardware through HAL.

<!-- source:cn p10 unit:40-1 -->

### Volume control (Android 12 support)

<!-- source:cn p10 unit:40-2 -->

The Android 12 automotive audio service controls external automotive audio-hardware volume through AudioControl HAL. The source says Android 14 does not yet support this; other functions such as ducking and balance are also not yet supported.

<!-- source:cn p10 unit:41 -->

## AAudio

<!-- source:cn p10 unit:42-0 -->

### Basic concepts

<!-- source:cn p10 unit:42-1 -->

AAudio is an audio API introduced in Android 8.0 and later. Its low-latency data path reduces playback and recording delay when used with an MMAP-capable HAL and driver. AAudio has shared and exclusive modes. In exclusive mode, client application code writes directly into a memory-mapped buffer shared with the ALSA driver. In shared mode, a mixer running in AudioServer uses the MMAP buffer. Exclusive mode bypasses the mixer and substantially reduces latency.

<!-- source:cn p10 unit:42-2 -->

### Adding configuration

<!-- source:cn p10 unit:42-3 -->

AAudio MMAP is not enabled in the default SDK.

<!-- source:cn p10 unit:43 -->

1. Enable AAudio in build.prop in the product directory.

<!-- source:cn p10 unit:44 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_policy=2
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_exclusive_policy=2
```

<!-- source:cn p10 unit:45 -->

Choose 1, 2 or 3 as appropriate; 2 is recommended. 1 = AAUDIO_POLICY_NEVER: legacy path only, no MMAP. 2 = AAUDIO_POLICY_AUTO: try MMAP, falling back to the legacy path if it fails or is unavailable. 3 = AAUDIO_POLICY_ALWAYS: MMAP only, with no legacy fallback.

<!-- source:cn p10 unit:46 -->

2. Configure the output card and device for AAudio. The following property selects the card for the AAudio output path. Without it, the SDK defaults to card 1, device 0.

<!-- source:cn p10 unit:47 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_card=card:0dev:0
```

<!-- source:cn p11 unit:48 -->

3. Add MMAP stream ports to audio_policy_configuration.xml. Add mixports mmap_no_irq_out and mmap_no_irq_in as shown and create routes to their deviceports. channelMasks in XML, the TDM channel count in DTS, and the channel count that HAL configures for the kernel must agree. The SDK default is eight channels.

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
