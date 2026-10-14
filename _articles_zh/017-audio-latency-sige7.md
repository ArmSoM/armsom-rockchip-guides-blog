---
title: "ArmSoM Sige7 音频延迟：以 ALSA 与端到端测量为依据"
description: "针对 RK3588 音频设备的 ALSA 时序验证流程，以及从 Raspberry Pi 或 Jetson Nano 迁移时的适配边界。"
translation_key: "017-audio-latency-sige7"
slug: "audio-latency-sige7"
date: 2026-10-14
author: "ArmSoM Editorial"
category: media
products: [Sige7]
tags: [RK3588, Sige7, ALSA, audio, latency]
keywords: "ArmSoM Sige7 音频延迟：以 ALSA 与端到端测量为依据, Sige7"
lang: zh
---

# ArmSoM Sige7 音频延迟：以 ALSA 与端到端测量为依据

![音频延迟流程](../assets/017-audio-latency.svg)

Sige7 提供 HDMI 和板级音频路径，但端到端延迟由编解码器时钟、ALSA 周期大小、混音器配置、调度负载和应用缓冲区共同决定。Raspberry Pi 的 ALSA 设备名或 Jetson 的 PulseAudio 配置不能作为可直接移植的证据。

## 建立基线

```bash
aplay -l
arecord -l
arecord -D hw:0,0 -f S16_LE -r 48000 -c 2 -d 10 capture.wav
```

在 CPU、显示和网络负载运行时，记录 xrun（缓冲区欠载或溢出）、采样率转换和时间戳。对交互式音频，应使用电气环回或经校准的声学测试装置，验证完整的扬声器/麦克风链路。

## 平台选择

Sige7 的 RK3588 CPU/GPU/NPU 资源适合媒体功能丰富的设备，但从 Jetson 迁移软件仍需要新的音频与 AI 集成层。当 RK3576 的 I/O 和供电条件足够，且更小的载板比峰值多媒体吞吐量更有价值时，可以考虑 CM5 或 Sige5。

## 参考链接

- [Sige7 官方规格与文档](https://docs.armsom.org/armsom-sige7)
- [Sige 系列入门与供电指南](https://docs.armsom.org/sige-family-started)

## 发布前核对

- [ ] 说明采样率、周期大小、编解码器和镜像版本。
- [ ] 提供 xrun 和端到端测量结果。
- [ ] 区分板卡能力与应用延迟。
