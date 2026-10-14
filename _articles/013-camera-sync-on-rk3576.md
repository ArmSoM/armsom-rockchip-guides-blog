---
title: "Multi-Camera Synchronization on RK3576: CSI Bandwidth Before AI"
description: "A practical camera bring-up method for ArmSoM Sige5 and CM5 that separates CSI wiring, V4L2 timestamps and model throughput."
translation_key: "013-camera-sync-on-rk3576"
slug: "camera-sync-on-rk3576"
date: 2026-10-14
author: "ArmSoM Editorial"
category: camera
products: [Sige5, CM5]
tags: [RK3576, CSI, V4L2, Sige5, CM5]
keywords: "RK3576 CSI camera, ArmSoM Sige5 camera, CM5 V4L2"
---

# Multi-Camera Synchronization on RK3576: CSI Bandwidth Before AI

![CSI camera synchronization pipeline](../assets/013-camera-sync.svg)

ArmSoM Sige5 lists two 4-lane MIPI CSI inputs; CM5 lists one 4-lane and one 2-lane input. Those are interface capabilities, not a promise that two arbitrary sensors will synchronize or that an AI pipeline will sustain full frame rate.

## Bring-up sequence

Start with one sensor and the documented device-tree endpoint. Confirm media topology, pixel format and timestamps before adding the second sensor.

```bash
v4l2-ctl --list-devices
media-ctl -p
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=300 \
  --stream-to=/tmp/capture.raw --verbose
```

Measure dropped frames and timestamp deltas. If two sensors need hardware sync, expose the trigger and clock requirements on the carrier; software timestamp alignment is not equivalent to a shared exposure edge.

## What differs from Raspberry Pi and Jetson Nano

Camera libraries, ISP tuning files and GStreamer elements are platform-specific. A Raspberry Pi libcamera pipeline or Jetson Argus application will not simply run on RK3576. Plan for V4L2/media-controller configuration, Rockchip ISP support and an application-level synchronization test.

## References

- [Sige5 hardware specification](https://docs.armsom.org/armsom-sige5)
- [CM5 hardware specification](https://docs.armsom.org/armsom-cm5)
- [ArmSoM camera resources](https://docs.armsom.org/)

## Pre-publication check

- [ ] Document sensor mode, lane count, link frequency and pixel format.
- [ ] Include timestamp and dropped-frame evidence.
- [ ] Avoid claiming multi-camera AI throughput without a measured workload.
