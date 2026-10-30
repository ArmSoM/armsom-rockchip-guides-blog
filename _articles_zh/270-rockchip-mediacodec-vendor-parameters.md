---
title: "Rockchip Android MediaCodec 厂商扩展参数完整指南"
description: "Rockchip Android MediaCodec 厂商扩展参数完整指南"
excerpt: "Rockchip Android MediaCodec 厂商扩展参数完整指南"
translation_key: "270-rockchip-mediacodec-vendor-parameters"
slug: "270-rockchip-mediacodec-vendor-parameters"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

本篇依据 RK-SM-YF-E12 V1.0.0 中文原稿，完整整理解码与编码扩展。原稿基于 Codec2，适用于 Android 12 及以上，列出的内核为 Linux 4.19、5.10、6.1；隧道模式另要求内核 ≥ 5.10。原稿“所有芯片”是平台范围描述，不代表所有 ArmSoM 板卡均已适配。实际需匹配 SoC、Android BSP、驱动和接口，本文未经硬件验证；性能数字是原稿数据。唯一技术框图原本为英文，四语均保留该原图。

## 1 解码器扩展

### 1.1 低延时解码

快速输出图像以提高实时性：使能内部快速帧解析，忽略参考序列并立即输出。适用于投屏、直播等延迟敏感场景。此模式“一进一出”，不适合 B 帧码流；B 帧需要前后参考，立即输出可能造成乱序。

```java
mediaFormat.setInteger("low-latency", 1);
```

```cpp
c2_info("enable lowLatency, enable mpp fast-out mode");
```

上述日志用于确认生效。

### 1.2 多媒体隧道模式

解码器与显示驱动建立直接隧道，输出绕过 Android SurfaceFlinger。高码率高帧率播放可减少显示框架软件开销并释放资源；低延迟场景则直接同步到 VOP，降低显示延迟。[Android 多媒体隧道文档](https://source.android.google.cn/docs/devices/tv/multimedia-tunneling?hl=zh-cn)。

#### 补丁配置

内核要求 ≥ 5.10。首先在板级 DTS 使能 `rkvtunnel`：

```diff
diff --git a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
index 8c1d0f37b8a3..8bd65c9ed85b 100644
--- a/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rk3588s-evb1-lp4x.dtsi
@@ -846,6 +846,10 @@ &usbhost_dwc3_0 {
     status = "disabled";
 };
+&rkvtunnel {
+    status = "okay";
+};
+
 /* vp0 & vp3 are not used on this board */
 &vp0 {
     /delete-property/ rockchip,plane-mask;
```

其次在 `media_codecs.xml` 声明隧道播放能力。以下以 RK3588 AVC 为例，其他芯片及解码器采用对应配置。

```diff
~/3_android_14/vendor/rockchip/common/vpu/etc$ git diff .
diff --git a/vpu/etc/media_codecs_c2_rk3588.xml b/vpu/etc/media_codecs_c2_rk3588.xml
index 28c1f947..d01da2d5 100644
--- a/vpu/etc/media_codecs_c2_rk3588.xml
+++ b/vpu/etc/media_codecs_c2_rk3588.xml
@@ -20,6 +20,7 @@
 </Settings>
 <Decoders>
     <MediaCodec name="c2.rk.avc.decoder" type="video/avc">
+        <Feature name="tunneled-playback" required="true"/>
         <Alias name="OMX.rk.video_decoder.avc" />
         <Limit name="size" min="64x64" max="7680x4320" />
         <Limit name="alignment" value="2x2" />
```

#### 应用

隧道同步方式列为 AUDIO_HW_SYNC、HW_AV_SYNC、REALTIME；前两者依赖系统调谐器驱动。原稿当前实现仅支持实时渲染，以延迟优先，获得输出即送显。伪代码如下：

```java
// 1. get tunneled codec name
format.setFeatureEnabled(MediaCodecInfo.CodecCapabilities.FEATURE_TunneledPlayback, true);
MediaCodecList mcl = new MediaCodecList(MediaCodecList.ALL_CODECS);
String codecName = mcl.findDecoderForFormat(format);
// 2. start tunneled video playback
MediaCodec mCodec = MediaCodec.createByCodecName(codecName);
mCodec.configure(format, mSurface, null, 0);
mCodec.start();
while (!isEOS) {
    int inIndex = mCodec.dequeueInputBuffer(0);
    if (inIndex >= 0) {
        ByteBuffer buffer = mCodec.getInputBuffer(inIndex);
        int sampleSize = mExtractor.readSampleData(buffer, 0);
        if (sampleSize > 0) {
            mCodec.queueInputBuffer(inIndex, 0, sampleSize,
                mExtractor.getSampleTime(), 0);
            mExtractor.advance();
        } else {
            mCodec.queueInputBuffer(inIndex, 0, 0,
                0, MediaCodec.BUFFER_FLAG_END_OF_STREAM);
            isEOS = true;
        }
    }
}
mCodec.stop();
mCodec.release();
```

### 1.3 忽略 H264 帧序列连续性检查

网络会议、监控等实时流可能丢帧丢包。默认检查 POC 连续性，若不连续，整个 GOP 被标错并丢弃 error 帧，直到下一关键帧才恢复显示。硬件纠错有时可恢复轻微丢包，因此可选择忽略检查。严重丢帧仍会花屏；POC 检查是标准解码流程，此选项仅供用户显式配置。轻微丢帧引起卡顿时可试用下述设置，并通过日志确认。

```cpp
mediaFormat.setInteger("vendor.disable-dpb-check.value", 1);
c2_info("disable poc discontinuous check");
```

## 2 编码器扩展

### 2.1 TSVC 时域分级编码

SVC 将视频拆成层级，可组合获得不同质量，每层增加分辨率或运动流畅度等细节。网络不稳时解码基础层，良好时使用增强层；错误发生时可逐级降低分辨率与帧率，原稿称抗丢包率达 20%。原稿描述底层可利用高层信息检测纠错，该说法保留为来源描述，不作为独立验证。SVC 常见于监控与会议，例如腾讯 Rooms、微软 Teams。Rockchip 提供 TSVC，支持 2–4 层，下面配置 3 层；通过日志或生成码流确认。

```cpp
mediaFormat->setString("ts-schema", "android.generic.3");
c2_info("setupTemporalLayers: layers %d", layerCount);
```

### 2.2 QP 范围

QP 范围 1–51。一般较小 QP 提高质量但增加码率，较大 QP 降低质量及码率，需要平衡质量与文件大小。示例 I 帧 10–40、P 帧 10–30，随后日志或码流确认。

```cpp
mediaFormat->setInt32("video-qp-i-min", 10);
mediaFormat->setInt32("video-qp-i-max", 40);
mediaFormat->setInt32("video-qp-p-min", 10);
mediaFormat->setInt32("video-qp-p-max", 30);
c2_info("setupQp: qpInit %d i %d-%d p %d-%d", qpInit, iMin, iMax, pMin, pMax);
```

### 2.3 旋转编码

支持 90、180、270 度。示例将输出顺时针旋转 90 度，使用日志确认。

```cpp
mediaFormat->setInt32("rotation", 90);
c2_info("setupRotation: degrees %d", degrees);
```

### 2.4 缩放编码

编码硬件本身不支持该缩放，依赖 RGA 预处理输入，编码时间可能略增。示例输出 720P：

```cpp
mediaFormat->setInt32("vendor.input-scalar.width", 1280);
mediaFormat->setInt32("vendor.input-scalar.height", 720);
c2_info("setupBaseCodec: coding %s w %d h %d hor %d ver %d",
        toStr_Coding(mCodingType), mSize->width, mSize->height, mHorStride,
        mVerStride);
```

### 2.5 多 slice

原稿以宏块 MB 描述 H264/H265 编码最小单位；连续宏块组成 slice，输出一个 NALU。默认一帧一个 slice，slice 可包含一帧全部或部分数据，按宏块数或累计字节数切分。每个 slice 增加独立包头，切分越细码率越高。该宏块表述需结合实际编解码标准核对。

应用包括：1）MTU 限制，如最大包 1500 字节；2）RK3588 等多核编码器并发编码 slice，提升性能；3）网络抗损纠错时缩小处理区域、降低消耗。默认支持按字节切分：

```cpp
mediaFormat->setInt32("vendor.slice-size.value", 1500);
c2_info("setupSliceSize: slice-size %d", c2Size->value);
```

### 2.6 超大帧重编码

大帧会冲击网络，此设置用于平滑码率；重编码越多，单帧耗时可能越长。原稿称“至多重编三次”，但代码值写为 `1500`，两者矛盾，保留原值并要求按 SDK 核对，不能把它当作已确认的三次设置。

```cpp
mediaFormat->setInt32("vendor.reenc-times.value", 1500);
c2_info("setupReencTimes: reenc-times %d", reencTime->value);
```

### 2.7 RK3576/RK3588 智能编码

为节省带宽和增强画质设计：

- 1.0 根据帧间/帧内复杂度、ROI 占比及最大最小码率自适应调整量化参数。
- 2.0 使用更多统计信息、更平稳码控，改善静态弱纹理的码率与清晰度。
- 3.0 加入 AI 神经网络识别 ROI，增强画质。

原稿仅支持 RK3576/RK3588；MediaCodec 参数支持 1.0 和 2.0，原稿称大运动、小运动、静止场景分别优化 21%+、85%+、90%+，不是 ArmSoM 实测。以下设置运动场景画质优先。

```cpp
mediaFormat->setInt32("vendor.super-encoding-mode.value", 1);
// 设置值：
// 1 ===== 普通运动场景，画质优先，追求更高的 psnr 和 vmaf 值
// 2 ===== 普通运动场景，码率优先，追求更高的视频压缩率
// 3 ===== IPC 相对静止场景，画质优先，追求更高的 psnr 和 vmaf 值
// 4 ===== IPC 相对静止场景，码率优先，追求更高的视频压缩率
c2_info("setupSuperMode: setup super mode %d", superMode);
```

模式 1/2 分别为普通运动场景的画质/码率优先，模式 3/4 分别为 IPC 相对静止场景的画质/码率优先；画质优先追求较高 PSNR/VMAF，码率优先追求更高压缩率。

### 2.8 微软 MVCT 协议认证

![MVCT 扩展接口架构（中文 PDF 中的英文原图）](/docs/rockchip-mediacodec-vendor-parameters/images/pdf-p08-1.png)

MVCT 扩展接口架构（中文 PDF 中的英文原图）

MVCT（Microsoft Codec Validation Tool）是 Teams 认证的编解码协议部分，扩展支持 TSVC、长短参考帧、帧级 QP、多 slice、动态码率和分辨率。认证严格且周期长，对 media、camera、audio 都有要求：

1. MVCT：实现扩展接口、添加编码 prefix nal，完整通过测试。
2. VCT：多路编解码和显示压力测试，性能、CPU 使用率、内存占用保持正常。
3. 设备硬件：音频、摄像头、光学等。

原稿称 RK3588、RK3399、PX30 已支持相关协议及设备通过 Teams，RK3588 进入微软国产芯片推荐选型。该陈述不是本篇对 ArmSoM 产品认证的证明。原稿也写作 MCVT，保留其工具链接名称。

[MVCT 测试工具（原稿链接）](https://install.appcenter.ms/orgs/ic3-media-platform/apps/microsoft-codec-validation-tool-mcvt/distribution_groups/external%20partners) · [ArmSoM 文档](https://docs.armsom.org/)

{% endraw %}
