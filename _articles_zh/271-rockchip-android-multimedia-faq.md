---
title: "Rockchip Android 多媒体 FAQ：编解码、性能与应用排查"
description: "Rockchip Android 多媒体 FAQ：编解码、性能与应用排查"
excerpt: "Rockchip Android 多媒体 FAQ：编解码、性能与应用排查"
translation_key: "271-rockchip-android-multimedia-faq"
slug: "271-rockchip-android-multimedia-faq"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

完整整理 RK-PC-YF-310 V1.0.2 中文原稿。概述列 Linux4.19/5.10，正文也含 Linux4.4 与 Android7.1–12+ 的分支说明。原稿“所有芯片”不等于全部 ArmSoM 板卡均支持；须匹配 SoC、SDK/BSP、内核和多媒体组件，仅作平台参考，未经硬件验证。没有英文PDF，英俄德图均用中文原稿并注明。规格和性能数据均为原稿值，疑点保留、不得当作 ArmSoM 实测。

## 1 通用媒体

### 1.1 无法播放

#### 1.1.1 规格

用Windows/Linux的MediaInfo读取编码、分辨率、码率、扫描方式、位深等，再对照Datasheet或Codec Benchmark。两者是判断芯片能力的必要依据，缺失时向供应商获取。

![原稿第3页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p03-1.png)

原稿第3页图1（中文PDF原图）

#### 1.1.2 格式授权

原稿称平台因版权未支持：音频mlp、ac3、eac3、dts、dsp、heaac及其他杜比相关；视频divx、xvid、rmvb、vp6、vc1、svq、iso蓝光。这是原稿SDK描述，并非本文对现行授权法律的判断。

### 1.2 能力表

以下为原稿标定值。CPU/DDR负载大时实际能力可能降低，不能视为所有系统的并发保证。

#### 1.2.1 解码

|SoC|H264|H265|VP9|JPEG|
|---|---|---|---|---|
|RK3588|7680x4320@30f|7680x4320@60f|7680x4320@60f|1920x1080@280f|
|RK3576|4096x2304@60f|4096x2304@60f|4096x2304@60f|3840x2160@90f|
|RK3562|1920x1080@60f|4096x2304@30f|4096x2304@30f|1920x1080@60f|
|RK3528|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@120f|
|RK356X|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@80f|
|RK3399|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@30f|
|RK3328|4096x2304@30f|4096x2304@60f|4096x2304@60f|1920x1080@30f|
|RK3288|3840x2160@30f|4096x2304@60f|N/A|1920x1080@30f|
|RK3358/PX5|4096x2160@25f|4096x2304@60f|N/A|1920x1080@30f|
|RK3326/PX30|1920x1080@60f|1920x1080@60f|N/A|1920x1080@30f|
|RK312X|1920x1080@60f|1920x1080@60f|N/A|1920x1080@30f|

注意：RK3588还支持AVS2 7680x4320@60f及AV1 3840x2160@60f；RK3528支持AVS2 4096x2160@60f；RK3562不支持mpeg1/2/4、vp8、h263；除RK3562外其他列出芯片支持这些格式、最大1080P。解码表原稿RK3358/PX5与编码表RK3368/PX5不一致，保留并待核对。

#### 1.2.2 编码

|SoC|H264|H265|VP8|JPEG|
|---|---|---|---|---|
|RK3588|7680x4320@30f|7680x4320@30f|1920x1080@30f|3840x2160@30f|
|RK3576|3840x2160@60f|3840x2160@60f|N/A|3840x2160@160f|
|RK3562|1920x1080@30f|N/A|N/A|N/A|
|RK3528|1920x1080@60f|1920x1080@60f|N/A|3840x2160@30f|
|RK356X|1920x1080@60f|1920x1080@60f|1920x1080@30f|1920x1080@60f|
|RK3399|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3328|1920x1080@30f|1920x1080@30f|1920x1080@30f|1920x1080@30f|
|RK3288|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3368/PX5|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK3326/PX30|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|
|RK312X|1920x1080@30f|N/A|1920x1080@30f|1920x1080@30f|

### 1.3 VPU 频率

VPU为硬件视频单元。性能瓶颈时提高VPU/DDR可能有帮助，但超负荷频率影响稳定性，集成前充分测试。DDR参考SDK RKDocs/common/DDR/Rockchip-Developer-Guide-DDR/。

#### 1.3.1 查询

通过cat /d/clk/clk_summary，节点表如下：

|SoC|h264_dec|h265_dec|vp9_dec|jpeg_dec|h264_enc|h265_enc|
|---|---|---|---|---|---|---|
|RK3588|rkvdec|rkvdec|rkvdec|jpeg_decoder|rkvenc|rkvenc|
|RK3576|rkvdec|rkvdec|rkvdec|jpeg|vepu|vepu|
|RK3562|rkvdec|rkvdec|rkvdec|jdec|rkvenc|×|
|RK3528|rkvdec|rkvdec|rkvdec|jpeg_decoder|rkvenc|rkvenc|
|RK356X|rkvdec|rkvdec|rkvdec|jdec|rkvenc|rkvenc|
|RK3399|vdu|vdu|vdu|vcodec|vcodec|×|
|RK3328|rkvdec|rkvdec|rkvdec|vpu|h264|h265|
|RK3288|vcodec|hevc|×|×|vcodec|×|
|RK3368/PX5|video|video|×|video|video|×|
|RK3326/PX30|vpu|vpu|×|vpu|vpu|×|
|RK312X|vdpu|vdpu|×|vdpu|vdpu|×|

```sh
cat /d/clk/clk_summary | grep rkvdec // <aclk_rkvdec0> <aclk_rkvdec1>
cat /d/clk/clk_summary | grep vcodec // <aclk_vcodec>
cat /d/clk/clk_summary | grep h265 // <aclk_h265>
```

以上依次RK3588 H264解码、RK3288 H264解码、RK3328 H265编码。原稿用//作说明，不是shell注释，执行时仅取命令部分。

#### 1.3.2 修改

Linux4.4(Android7.1–9.0)示例500M，不支持单独IP频率。

```diff
--- a/drivers/video/rockchip/vcodec/vcodec_service.c
+++ b/drivers/video/rockchip/vcodec/vcodec_service.c
@@ -2307,6 +2307,7 @@ static void vcodec_set_freq_default(struct vpu_service_info
*pservice,
{
enum VPU_FREQ curr = atomic_read(&pservice->freq_status);
+ reg->freq = VPU_FREQ_500M;
if (curr == reg->freq)
return;
```

Linux4.19/5.10(Android10+)可用DTSI或临时节点。原稿引言称RK3399“大于4K”，但实际注释阈值1920x1088=2088960，且DTS有多余逗号；保留示例并须按SDK核对。normal-rates用于小于该阈值，advanced-rates用于大于阈值。

```dts
<rk3399.dtsi>
rkvdec: rkvdec@ff660000{
clock-names = "aclk_vcodec", "hclk_vcodec",
"clk_cabac", "clk_core",;
rockchip,normal-rates = <297000000>, <0>,
<297000000>, <297000000>, ;
rockchip,advanced-rates = <500000000>, <0>,
<500000000>, <500000000>;
rockchip,default-max-load = <2088960>; // 1920x1088
};
```

```sh
echo 500000000 > /proc/mpp_service/rkvdec/aclk
echo 500000000 > /proc/mpp_service/rkvdec/clk_core
echo 500000000 > /proc/mpp_service/rkvdec/clk_cabac
```

### 1.4 抓取输入输出

花屏/绿屏时保存数据缩小范围。应用MediaCodec：编码/解码输入在queueInputBuffer前保存；编码输出在dequeueOutputBuffer后读取，解码仅未配置Surface时可读输出。框架先准备目录，再按版本抓取：

```sh
setenforce 0
mkdir /data/video/
```

Android12+ Codec2：

```sh
setprop vendor.dump.c2.log 0x000000f0
```

Android11及以前OMX：

```sh
// 解码 dec_in*.bin
setprop vendor.omx.vdec.debug 0x01000000
setprop record_omx_dec_in 1
// 编码 enc_in*.bin enc_out*.bin
setprop vendor.omx.venc.debug 0x03000000
setprop record_omx_enc_in 1
setprop record_omx_enc_out 1
```

若/data/video/无文件，使用底层库开关：

```sh
setenforce 0
mkdir /data/video/
setprop mpp_dump_in /data/video/mpp_dec_in.bin
setprop mpp_dump_out /data/video/mpp_dec_out.bin
setprop vendor.mpp_dump_in /data/video/mpp_dec_in.bin
setprop vendor.mpp_dump_out /data/video/mpp_dec_out.bin
setprop mpp_debug 0x600 && setprop vendor.mpp_debug 0x600
```

### 1.5 多路路数

以RK3399 H264 4096x2304@30fps折算1080P@30fps：

```text
(4096x2304x30) / (1920x1088x30) = 4.5
```

向下取整4路，路数越多折损越大。原稿基于高码率极限片源并称任何情况可4路，但应结合系统负载，不能转为ArmSoM保证。RK3588/RK356X/RK3399/RK3328的rkvdec在普通非高码率H264/H265/VP9片源可能突破估算，如RK3399可能8路。评估：1）获取内核单帧耗时；2）检查VPU/DDR频率；3）按1.3提VPU；4）按DDR指南调整。

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
cat /proc/kmsg
```

上为4.19/5.10(Android10+)；4.4(Android7.1–9.0)：

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/debug
cat /proc/kmsg
```

8路30fps预算1000/(8*30)≈4.16ms，不计通路损耗需单帧4ms以内；未达标可评估频率余量并复测。

```sh
/* VPU 频率 */
$ cat /d/clk/clk_summary | grep vdu <aclk_vdu> rk3399
$ cat /d/clk/clk_summary | grep rkvdec <aclk_rkvdec> rk3588\rk3328\rk356x
/* DDR 频率 */
$ cat /sys/class/devfreq/dmc/cur_freq
```

```sh
echo performance > /sys/class/devfreq/dmc/governor
```

### 1.6 CPU占用高

读写也消耗CPU，按进程→线程→函数定位。问题场景先adb shell busybox top：原图com.quectel.quecencdectester为47.8%。再看线程，应用线程由应用侧分析，系统框架线程提交Redmine。原图多路解码CodecLooper占主要CPU。

```sh
adb shell busybox top
top -H -p $(pidof com.quectel.quecencdectester)
```

![原稿第9页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p09-2.png)

原稿第9页图1（中文PDF原图）

![原稿第9页图2（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p09-3.png)

原稿第9页图2（中文PDF原图）

可用Android Studio TraceView/Systrace；原稿以SDK simpleperf查函数。PID1349记录10秒，再生成报告：

```sh
simpleperf record -o /sdcard/perf.data -g -p 1349 --duration 10
simpleperf report -i /sdcard/perf.data -g caller > /sdcard/perfdata
```

![原稿第10页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p10-4.png)

原稿第10页图1（中文PDF原图）

原图CodecLooper占15.31%，主要libyuv::X420ToI420。BufferMode需把框架DMA输出拷给应用，应用不能直接处理DMA，故有CPU拷贝。可按2.5改RGA拷贝；同法定位其他CPU问题。

### 1.7 内存泄漏

可用内存不断下降，最终OOM重启。先对比问题前后meminfo，各进程RSS/PSS持续增长提示可能泄漏。

```sh
dumpsys meminfo
showmap $(pidof xxx)
```

showmap定位映射，RSS/PSS单位K。常见dmabuf经ION/DRM/dmaBufferHeap分配，用于零拷贝解码显示，检查初始化、销毁、info-change申请释放；malloc由alloc/malloc分配，可用Malloc Debug。映射/dmabuf为DMA，malloc或anon:scudo为malloc。

![原稿第11页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p11-5.png)

原稿第11页图1（中文PDF原图）

Malloc Debug检查native泄漏、损坏、释放，文档bionic/libc/malloc_debug/README.md。myTest示例：

```sh
adb shell stop
adb shell setprop libc.debug.malloc.program myTest
adb shell setprop libc.debug.malloc.options backtrace
adb shell start
#开始测试复现问题...
kill -9 $(pidof myTest)
```

原稿快照路径/data/local/tmp/backtrace_heap.3302.txt，3302为PID；解析例用3378，按实际文件替换，不是同一次运行。$(OUT)为源码写法，执行环境须核对。根据out_heap栈修复泄漏。

```sh
python development/scripts/native_heapdump_viewer.py --symbols $(OUT)/symbols backtrace_heap.3378.txt > out_heap.txt
```

### 1.8 JPEG硬件demo

原生MediaCodec不支持JPEG，使用hardware/rockchip/libhwjpeg，其封装MPP JPEG逻辑。MpiJpegEncoder编码、MpiJpegDecoder解码，支持图片及MJPEG。src实现、inc接口头、test测试示例，参照readme.txt。

## 2 编解码问题

### 2.1 卡顿/音画不同步

先收集显示FPS及内核单帧时间：

```sh
setprop debug.sf.fps 1
logcat -c ;logcat | grep mFps
```

内核耗时命令见1.5：4.19/5.10用mpp_dev_debug，4.4用debug。

1. 确认硬解：应用可能软解，查Logcat格式及规格范围，检查网站/播放器是否允许硬解。内核硬件耗时有打印表示硬解，无打印按原稿考虑软解。
2. 区分解码/显示：片源在1.2范围内，30fps单帧<33ms、60fps<16ms仍卡顿，先查显示合成。
3. 检查屏幕刷新率，DTS错误会降低HWC效率，通常60fps：

```text

```

```text
clock-frequency = (hactive + hback-porch + hfront-porch + hsync-len) * (vactive + vback-porch + vfrontporch + vsync-len) * fps
```

原稿公式vfrontporch与常见vfront-porch拼写不同，按实际binding核对。刷新率正确时查屏幕旋转、Surface图层过多、格式不支持。收集合成及HWC日志提交工程师：

```sh
dumpsys SurfaceFlinger
adb shell "setprop sys.hwc.log 51"
adb shell "logcat -c ;logcat" > hwc
```

修复原稿命令末尾弯引号为ASCII引号。4）若日志有error frame，先排查送解码器的输入是否丢帧。按1.4 dump（原稿误指第4章），H264可用eseye/Vega H264 Analyzer，H265用HEVCAnalyzer。检查正常解码预览和POC，若输入正确而硬解错误，提交片源与完整Logcat。

![原稿第13页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p13-6.png)

原稿第13页图1（中文PDF原图）

### 2.2 录像/录屏模糊或马赛克

有损压缩会损失原图数据。局部质量低常由QP导致，范围1–51，越小质量越高；未限QP时码率越高通常QP越小。

1. eseye/Vega查单帧QP，原图16–29；>40宏块易模糊，调码率/策略。QP正常仍马赛克则抓输入排查。
2. 无统一码率表：实际≥设定仍高QP，设定可能太小，应提高；实际<设定且高QP，查是否BITRATE_MODE_VBR；实际超设定很多则手调QP策略。

![原稿第14页图1（中文PDF原图）](/docs/rockchip-android-multimedia-faq/images/pdf-p14-7.png)

原稿第14页图1（中文PDF原图）

3. baseline可改high profile，CABAC压缩更高、同码率质量更好。Android12+可限QP，Max≤40可能改善；qp-i-min为I最小、qp-p-max为P最大。但限QP可能码率失控，检查输出。Android11及以前改MPP接口。

```cpp
format->setInt32("video-qp-i-min", 10);
format->setInt32("video-qp-i-max", 40);
format->setInt32("video-qp-p-min", 10);
format->setInt32("video-qp-p-max", 40);
```

```diff
diff --git a/mpp/legacy/vpu_api_legacy.cpp b/mpp/legacy/vpu_api_legacy.cpp
index 33d08ccb..b937f0bc 100644
--- a/mpp/legacy/vpu_api_legacy.cpp
+++ b/mpp/legacy/vpu_api_legacy.cpp
@@ -173,9 +173,9 @@ static MPP_RET vpu_api_set_enc_cfg(MppCtx mpp_ctx, MppApi
*mpi, MppEncCfg enc_cf
mpp_enc_cfg_set_s32(enc_cfg, "h264:cabac_idc", 0);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_init", is_fix_qp ? qp : -1);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_min", is_fix_qp ? qp : 10);
- mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max", is_fix_qp ? qp : 51);
+ mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max", is_fix_qp ? qp : 40);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_min_i", 10);
- mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max_i", 51);
+ mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_max_i", 40);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_step", 4);
mpp_enc_cfg_set_s32(enc_cfg, "h264:qp_delta_ip", 3);
} break;
```

### 2.3 MediaCodec超码率

Android12以后，1080P设1Mbps却输出超过4Mbps可能由mediaformatshaping导致：VQApply依宽高、bpp和目标码率修正不合理QP/码率，通常提高到width×height×bpp以上。可暂用属性关闭或修改frameworks/av默认值。

```text
D VQApply : minquality/target bitrate raised from 1258291 to 4727808 bps
```

```sh
setprop debug.stagefright.enableshaping 0
```

```diff
diff --git a/media/libstagefright/MediaCodec.cpp
b/media/libstagefright/MediaCodec.cpp
index 382324a91c..dd1dfa062f 100644
--- a/media/libstagefright/MediaCodec.cpp
+++ b/media/libstagefright/MediaCodec.cpp
@@ -2054,7 +2054,7 @@ status_t
MediaCodec::setOnFirstTunnelFrameReadyNotification(const sp<AMessage> &
* MediaFormat Shaping forward declarations
* including the property name we use for control.
*/
-static int enableMediaFormatShapingDefault = 1;
+static int enableMediaFormatShapingDefault = 0;
static const char enableMediaFormatShapingProperty[] =
"debug.stagefright.enableshaping";
static void mapFormat(AString componentName, const sp<AMessage> &format, const
char *kind,
bool reverse);
```

### 2.4 编解码器初始化失败

播放、录像、录屏或拍照出现mpp hal xxx init failed，通常DTS未使能节点。jpegd表示JPEG解码器，vdpu是需要检查的节点。检查/proc/mpp_service；参照rk3588-evb.dtsi或rk3399-android.dtsi。

```text

```

```sh
ls -al /proc/mpp_service/
```

```dts
&mpp_srv {
status = "okay";
};
&vdpu {
status = "okay";
};
```

```text
E hal_h264e_vepu541: hal_h264e_vepu541_init mpp_dev_init failed. ret: -1
E mpp_enc_hal: mpp_enc_hal_init hal hal_h264e init failed ret -1
E mpp_enc_hal: mpp_enc_hal_init could not found coding type 7
```

h264e表示H.264编码器失败，应使能vepu：

```dts
&mpp_srv {
status = "okay";
};
&vepu {
status = "okay";
};
```

### 2.5 BufferMode效率

不配置Surface时应用需要输出buffer，而框架dmaBuffer无法直接交给应用，必须CPU拷贝，单帧变慢且CPU负载升高，尤其原本高负载场景。SurfaceMode解码显示直接传dmaBuffer，为零拷贝。以RGA替代CPU拷贝可降低CPU并缩短处理时间；具体改动见[418670](https://redmine.rock-chips.com/issues/418670)。

## 3 应用问题

### 3.1 Kodi/哔哩哔哩未用硬解

Android12+的ijkmedia只选择OMX.开头硬件codec，而Codec2名为c2.rk.avc.decoder。临时增加OMX.c2.rk.avc.decoder映射可兼容。自研应用也可能遇到，查IJKMEDIA日志确认。最终应修ijkmedia选择逻辑，原稿称临时补丁不进版本。见[396998](https://redmine.rock-chips.com/issues/396998)。

### 3.2 WebView失败/白边

RK3566/3568/3588/3528的AFBC输出在高于1080P时上扩4行。ImageReader/NdkImageReader读取Surface后必须处理crop，否则白边。首先默认left/top必须0的检查会报错，可在frameworks/av移除返回：

```text
E NdkImageReader: Crop left top corner [0, 4] not at origin
```

```diff
diff --git a/media/ndk/NdkImageReader.cpp b/media/ndk/NdkImageReader.cpp
index 067c8f4ae5..6df40cc975 100644
--- a/media/ndk/NdkImageReader.cpp
+++ b/media/ndk/NdkImageReader.cpp
@@ -455,7 +455,7 @@ AImageReader::acquireImageLocked(/*out*/AImage** image,
/*out*/int* acquireFence
Point lt = buffer->mCrop.leftTop();
if (lt.x != 0 || lt.y != 0) {
ALOGE("Crop left top corner [%d, %d] not at origin", lt.x, lt.y);
- return AMEDIA_ERROR_UNKNOWN;
+ // return AMEDIA_ERROR_UNKNOWN;
}
```

解除限制后白边仍可能出现。本地播放器控制source crop，WebView通过getHardwareBuffer取得GraphicBuffer，crop由应用处理，框架暂无法解决。可关闭FBC但可能降性能。Android11及以前修改hardware/rockchip/omx_il：

```diff
diff --git a/osal/Rockchip_OSAL_Android.cpp b/osal/Rockchip_OSAL_Android.cpp
index 5950cd0..ac599cf 100755
--- a/osal/Rockchip_OSAL_Android.cpp
+++ b/osal/Rockchip_OSAL_Android.cpp
@@ -317,6 +317,7 @@ OMX_BOOL Rockchip_OSAL_Check_Use_FBCMode(OMX_VIDEO_CODINGTYPE
codecId, int32_t d
OMX_U32 pValue;
OMX_U32 width, height;
+ return OMX_FALSE;
if (pPort->bufferProcessType != BUFFER_SHARE) {
return OMX_FALSE;
}
```

Android12+：vendor/rockchip/hardware/interfaces/codec2：

```diff
diff --git a/component/osal/C2RKChipCapDef.cpp
b/component/osal/C2RKChipCapDef.cpp
index 78659ab..b66fb31 100644
--- a/component/osal/C2RKChipCapDef.cpp
+++ b/component/osal/C2RKChipCapDef.cpp
@@ -297,6 +297,7 @@ uint32_t C2RKChipCapDef::getGrallocVersion() {
uint32_t C2RKChipCapDef::getFbcOutputMode(MppCodingType codecId) {
uint32_t fbcMode = 0;
+ return 0;
for (int i = 0; i < mChipCapInfo->fbcCapNum; i++) {
if (mChipCapInfo->fbcCaps[i].codecId == codecId) {
```

### 3.3 爱奇艺长时间播放闪退

Android10+广告播放时MediaPlayer晚设置Surface，先BufferMode再SurfaceChange，需换新buffer并释放旧buffer；旧引用计数未清零造成DMA泄漏、lowmem和崩溃。检查VPU挂载DMA数量持续增加不释放以确认。补丁[423914](https://redmine.rock-chips.com/issues/423914)。

```sh
cat /d/dma_buf/bufinfo
```

### 3.4 实时缩略图失败

MediaMetadataRetriever在播放中失败是框架默认关闭缩略图以节省带宽，避免后台影响前台。Android12+可用以下属性，也可加入系统prop；旧版通过Redmine联系工程师更新库。

```text
MediaMetadataRetrieverJNI( 1574): getFrameAtTime: videoFrame is a NULL pointer
```

```sh
setprop rt_retriever_enable 1
```

### 3.5 RK356X绿屏与RGA错误

```text
E/rga_mm ( 0): RGA_MMU unsupported Memory larger than 4G!
E/rga_mm ( 0): scheduler core[4] unsupported mm_flag[0x0]!
E/rga_mm ( 0): rga_mm_map_buffer map dma_buf error!
E/rga_mm ( 0): job buffer map failed!
E/rga_mm ( 0): src channel map job buffer failed!
E/rga_mm ( 0): failed to map buffer
```

RGA2只处理32位地址，buffer须在4G以内。RK356X编码器需要对齐buffer，Codec以RGA预处理；src或dst超过4G即报错，最终分配由Gralloc完成。

1. dst改用GraphicBufferAllocator并传GRALLOC_USAGE_WITHIN_4G。
2. src来自Surface；BufferQueue中Surface为生产者，Codec为消费者。消费者usage影响生产者分配。GRALLOC_USAGE_HW_VIDEO_ENCODER表示硬编；Gralloc遇到此usage且RK356X时分配4G内buffer。见[425094](https://redmine.rock-chips.com/issues/425094)。

### 3.6 禁用音视频格式

MediaPlayer可用配置剔除格式。原稿举RK3588禁VC1/VP9和AAC/MP3，但补丁chip实际为RK3566/RK3567/RK3568，保留差异，按目标SDK核对。原稿关于VP9境内外版权的说法不作为法律判断。修改device/rockchip/common：

```diff
diff --git a/rt_video_config.xml b/rt_video_config.xml
index 067b81a8..46ec980b 100644
--- a/rt_video_config.xml
+++ b/rt_video_config.xml
@@ -224,6 +224,7 @@
<chip name="RK3566,RK3567,RK3568">
<include
name="mpeg1,mpeg2,mpeg4,vp8,h264_8k_10bit_high422,hevc_8k_10bit"/>
<include name="vp9_4k_10bit"/>
+ <forbid name="vc1,vp9"/>
</chip>
<chip name="RK3528">
diff --git a/rt_audio_config.xml b/rt_audio_config.xml
index 182e2a83..af645673 100644
--- a/rt_audio_config.xml
+++ b/rt_audio_config.xml
@@ -34,4 +34,10 @@
<formats>
</formats>
</bitstream>
+ <forbid>
+ <formats>
+ <format>AAC</format>
+ <format>MP3</format>
+ </formats>
+ </forbid>
</sound>
```

验证时更新/system/etc/rt_audio_config.xml和rt_video_config.xml，重新播放。其他可禁用项：

```text
Video: mpeg1, mpeg2, h263, mpeg4, wmv1, wmv2, wmv3, h264, vp8, vp9, hevc, vc1, avs, avs+, avs2, flv1, av1
Audio: AAC, APE, MP3, WMALOSSLESS, WMAPRO, WMAV1, WMAV2, ADPCM_IMA_QT, VORBIS, PCM_S16LE, PCM_S24LE, FLAC, MP1, MP2, AMR_WB, AMR_NB
```

### 3.7 Camera 4K颜色偏红

Camera/CameraRecorder的4K录像播放偏红鲜艳，可能是未显式配置colorAspect时Android按分辨率默认BT2020，支持HDR设备随后启用HDR。原稿认为鲜艳属显示增益；若不希望如此，在frameworks/av的setDefaultCodecColorAspectsIfNeeded将默认改BT709，注意实际阈值以下面代码为准：

```diff
diff --git a/media/libstagefright/foundation/ColorUtils.cpp
b/media/libstagefright/foundation/ColorUtils.cpp
index fa722b5572..f253b68780 100644
--- a/media/libstagefright/foundation/ColorUtils.cpp
+++ b/media/libstagefright/foundation/ColorUtils.cpp
@@ -377,8 +377,8 @@ void ColorUtils::setDefaultCodecColorAspectsIfNeeded(
// Default to BT2020, BT709 or BT601 based on size. Allow 2.35:1 aspect
ratio. Limit BT601
// to PAL or smaller, BT2020 to 4K or larger, leaving BT709 for all
resolutions in between.
if (width >= 3840 || height >= 3840 || width * (int64_t)height >= 3840 *
1634) {
- primaries = ColorAspects::PrimariesBT2020;
- coeffs = ColorAspects::MatrixBT2020;
+ primaries = ColorAspects::PrimariesBT709_5;
+ coeffs = ColorAspects::MatrixBT709_5;
} else if ((width <= 720 && height > 480 && height <= 576)
|| (height <= 720 && width > 480 && width <= 576)) {
primaries = ColorAspects::PrimariesBT601_6_625;
```

### 3.8 切换视频显示黑帧

默认静帧模式保留上一视频末帧直到下一视频首帧。黑帧模式在结束时向Surface注入一帧黑色。Android MediaPlayer播放器可用以下属性启用，也可放系统prop文件。

```sh
setprop media.rockit.video.black_frame 1
```

## 参考

[ArmSoM官方文档](https://docs.armsom.org/)；上述Redmine为原稿补丁引用，可能需要授权登录，未声称已取得补丁或完成硬件验证。

{% endraw %}
