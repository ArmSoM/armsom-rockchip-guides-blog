---
title: "Audio Latency on ArmSoM Sige7: Measure ALSA, Not Marketing Numbers"
description: "A practical ALSA timing workflow for RK3588 audio appliances, with clear limits when migrating from Raspberry Pi or Jetson Nano."
translation_key: "017-audio-latency-sige7"
slug: "audio-latency-sige7"
date: 2026-10-14
author: "ArmSoM Editorial"
category: media
products: [Sige7]
tags: [RK3588, Sige7, ALSA, audio, latency]
keywords: "Sige7 audio ALSA, RK3588 latency, ArmSoM audio"
---

# Audio Latency on ArmSoM Sige7: Measure ALSA, Not Marketing Numbers

![Audio latency pipeline](../assets/017-audio-latency.svg)

Sige7 offers HDMI and board-level audio paths, but end-to-end latency is set by codec clocks, ALSA period size, mixer configuration, scheduler load and the application buffer. A Raspberry Pi ALSA device name or Jetson PulseAudio recipe is not portable evidence.

## Capture a baseline

```bash
aplay -l
arecord -l
arecord -D hw:0,0 -f S16_LE -r 48000 -c 2 -d 10 capture.wav
```

Log xruns, sample-rate conversion and timestamps while CPU, display and network workloads run. For interactive audio, test the complete speaker/microphone path with an electrical loopback or calibrated acoustic fixture.

## Choosing the platform

Sige7’s RK3588 CPU/GPU/NPU resources suit media-rich appliances, but software migration from Jetson still requires a new audio and AI integration layer. Choose CM5 or Sige5 when the RK3576 I/O and power envelope are sufficient and a smaller carrier is more valuable than peak multimedia throughput.

## References

- [Sige7 specifications](https://docs.armsom.org/armsom-sige7)
- [Sige family documentation](https://docs.armsom.org/sige-family-started)

## Pre-publication check

- [ ] State sample rate, period size, codec and image version.
- [ ] Include xrun and end-to-end measurements.
- [ ] Keep board capability separate from application latency.
