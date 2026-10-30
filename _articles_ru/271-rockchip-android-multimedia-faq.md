---
title: "FAQ мультимедиа Rockchip Android: кодеки, производительность и приложения"
description: "FAQ мультимедиа Rockchip Android: кодеки, производительность и приложения"
excerpt: "FAQ мультимедиа Rockchip Android: кодеки, производительность и приложения"
translation_key: "271-rockchip-android-multimedia-faq"
slug: "271-rockchip-android-multimedia-faq"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Полная техническая часть китайского RK-PC-YF-310 V1.0.2. Обзор указывает Linux4.19/5.10, далее есть Linux4.4 и ветви Android7.1–12+. «Все чипы» не подтверждает поддержку всех плат ArmSoM. Сверяйте SoC, SDK/BSP, ядро и компоненты; справка без аппаратной проверки. Английского PDF нет, рисунки переводов из китайского оригинала. Характеристики и результаты — данные источника, не измерения ArmSoM.

## 1 Общие вопросы

### 1.1 Не воспроизводится

#### 1.1.1 Спецификации

MediaInfo в Windows/Linux показывает кодек, разрешение, битрейт, развёртку, глубину цвета. Сверяйте Datasheet/Codec Benchmark — необходимые сведения о чипе, запросите у поставщика.

![Рисунок 1, страница PDF 3 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p03-1.png)

Рисунок 1, страница PDF 3 (китайский PDF)

#### 1.1.2 Лицензирование форматов

Источник сообщает об отсутствии по лицензионным причинам аудио mlp, ac3, eac3, dts, dsp, heaac и других Dolby; видео divx, xvid, rmvb, vp6, vc1, svq, ISO Blu-ray. Это описание SDK, не современная юридическая оценка.

### 1.2 Таблицы возможностей

Номинальные значения источника. Нагрузка CPU/DDR снижает результат; гарантии одновременности для всех систем нет.

#### 1.2.1 Декодирование

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

Примечания: RK3588 также AVS2 7680x4320@60f и AV1 3840x2160@60f; RK3528 AVS2 4096x2160@60f. RK3562 не поддерживает mpeg1/2/4, vp8, h263; остальные до1080P. В декодировании RK3358/PX5, в кодировании RK3368/PX5; расхождение сохранено для проверки.

#### 1.2.2 Кодирование

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

### 1.3 Частота VPU

VPU — аппаратный видеоблок. Рост VPU/DDR может помочь, но завышенные частоты ухудшают стабильность: тестируйте до интеграции. DDR: SDK RKDocs/common/DDR/Rockchip-Developer-Guide-DDR/.

#### 1.3.1 Запрос

cat /d/clk/clk_summary, узлы:

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

Выше RK3588 H264-декодирование, RK3288 H264, RK3328 H265-кодирование. // в источнике не комментарий shell; выполняйте только команды.

#### 1.3.2 Изменение

Linux4.4(Android7.1–9.0), пример500M; отдельная частота IP не поддерживается.

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

Linux4.19/5.10(Android10+) использует DTSI или временные узлы. Источник говорит RK3399 «выше4K», но порог1920x1088=2088960, в DTS лишние запятые. Сохранено, сверяйте SDK. normal-rates ниже порога, advanced-rates выше.

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

### 1.4 Захват входа/выхода

Сохраняйте данные при искажениях/зелёном экране. MediaCodec сохраняет вход до queueInputBuffer; кодированный выход после dequeueOutputBuffer, декодированный — только без Surface. Подготовьте каталог и выберите версию:

```sh
setenforce 0
mkdir /data/video/
```

Android12+ Codec2:

```sh
setprop vendor.dump.c2.log 0x000000f0
```

Android11 и старше OMX:

```sh
// 解码 dec_in*.bin
setprop vendor.omx.vdec.debug 0x01000000
setprop record_omx_dec_in 1
// 编码 enc_in*.bin enc_out*.bin
setprop vendor.omx.venc.debug 0x03000000
setprop record_omx_enc_in 1
setprop record_omx_enc_out 1
```

Если /data/video/ пуст, используйте параметры нижней библиотеки:

```sh
setenforce 0
mkdir /data/video/
setprop mpp_dump_in /data/video/mpp_dec_in.bin
setprop mpp_dump_out /data/video/mpp_dec_out.bin
setprop vendor.mpp_dump_in /data/video/mpp_dec_in.bin
setprop vendor.mpp_dump_out /data/video/mpp_dec_out.bin
setprop mpp_debug 0x600 && setprop vendor.mpp_debug 0x600
```

### 1.5 Число потоков

Пересчёт RK3399 H264 4096x2304@30fps в1080P@30fps:

```text
(4096x2304x30) / (1920x1088x30) = 4.5
```

Округлите вниз до4; потери растут с числом потоков. Источник обещает4 во всех условиях на предельном битрейте, но нагрузку учитывать нужно; это не гарантия ArmSoM. rkvdec RK3588/RK356X/RK3399/RK3328 может превысить оценку на обычных H264/H265/VP9, например RK3399 до8. Проверьте(1)время кадра,(2)VPU/DDR,(3)VPU по1.3,(4)DDR.

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/mpp_dev_debug
cat /proc/kmsg
```

Выше4.19/5.10(Android10+); для4.4(Android7.1–9.0):

```sh
echo 0x0100 > /sys/module/rk_vcodec/parameters/debug
cat /proc/kmsg
```

Для8×30fps бюджет1000/(8*30)≈4.16ms; без потерь тракта нужно менее4ms/кадр. Проверьте запас частоты и повторите.

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

### 1.6 Высокая загрузка CPU

Чтение/запись тоже расходуют CPU. Сужайте процесс→поток→функция. adb shell busybox top: пример com.quectel.quecencdectester47.8%. Потоки приложения анализирует разработчик, системные передают Redmine. CodecLooper при многопоточном декодировании занимает основную долю.

```sh
adb shell busybox top
top -H -p $(pidof com.quectel.quecencdectester)
```

![Рисунок 1, страница PDF 9 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p09-2.png)

Рисунок 1, страница PDF 9 (китайский PDF)

![Рисунок 2, страница PDF 9 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p09-3.png)

Рисунок 2, страница PDF 9 (китайский PDF)

Возможны TraceView/Systrace Android Studio; источник использует simpleperf SDK. PID1349 записывается10секунд, затем отчёт:

```sh
simpleperf record -o /sdcard/perf.data -g -p 1349 --duration 10
simpleperf report -i /sdcard/perf.data -g caller > /sdcard/perfdata
```

![Рисунок 1, страница PDF 10 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p10-4.png)

Рисунок 1, страница PDF 10 (китайский PDF)

В примере CodecLooper15.31%, главным образом libyuv::X420ToI420. BufferMode копирует DMA-выход в приложение, которое не может использовать его напрямую. Раздел2.5 заменяет CPU наRGA. Аналогично ищите другие проблемы.

### 1.7 Утечки памяти

Память уменьшается доOOM/перезагрузки. Сравните meminfo до/после: растущиеRSS/PSS указывают на возможную утечку.

```sh
dumpsys meminfo
showmap $(pidof xxx)
```

showmap показывает карты,RSS/PSS вK. dmabuf черезION/DRM/dmaBufferHeap обеспечивает zero-copy; проверьте выделение/освобождение при инициализации, завершении,info-change. malloc изalloc/malloc анализируется Malloc Debug. /dmabuf —DMA; malloc/anon:scudo —malloc.

![Рисунок 1, страница PDF 11 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p11-5.png)

Рисунок 1, страница PDF 11 (китайский PDF)

Malloc Debug ищет native-утечки,повреждение,освобождение; bionic/libc/malloc_debug/README.md. ПримерmyTest:

```sh
adb shell stop
adb shell setprop libc.debug.malloc.program myTest
adb shell setprop libc.debug.malloc.options backtrace
adb shell start
#开始测试复现问题...
kill -9 $(pidof myTest)
```

Снимок /data/local/tmp/backtrace_heap.3302.txt дляPID3302, а пример разбора3378; подставьте реальный файл. $(OUT) —исходная запись, проверьте среду. Исправляйте по стекамout_heap.

```sh
python development/scripts/native_heapdump_viewer.py --symbols $(OUT)/symbols backtrace_heap.3378.txt > out_heap.txt
```

### 1.8 JPEG-demo

Нативный MediaCodec безJPEG; hardware/rockchip/libhwjpeg оборачиваетMPP. MpiJpegEncoder кодирует,MpiJpegDecoder декодирует изображения/MJPEG. src реализация,inc заголовки,test примеры; readme.txt.

## 2 Кодеки

### 2.1 Задержки/рассинхронизация

СоберитеFPS и время кадра ядра:

```sh
setprop debug.sf.fps 1
logcat -c ;logcat | grep mFps
```

Команды времени в1.5:4.19/5.10 —mpp_dev_debug,4.4 —debug.

1. Проверьте аппаратное декодирование: приложения могут работать программно. Logcat,спецификации и настройки. Журнал аппаратного времени означает аппаратный путь; отсутствие указывает на программный по методике источника.
2. Разделите декодирование/вывод: при<33ms для30fps или<16ms для60fps и задержках проверьте композицию.
3. Частота экрана: неверныйDTS снижаетHWC,обычно60fps:

```text

```

```text
clock-frequency = (hactive + hback-porch + hfront-porch + hsync-len) * (vactive + vback-porch + vfrontporch + vsync-len) * fps
```

vfrontporch в формуле отличается от обычного vfront-porch; проверьте binding. При верной частоте проверьте поворот,много Surface-слоёв,формат. Соберите журналы композиции/HWC:

```sh
dumpsys SurfaceFlinger
adb shell "setprop sys.hwc.log 51"
adb shell "logcat -c ;logcat" > hwc
```

Конечная типографская кавычка команды исправлена наASCII.4)При error frame проверьте потери входа. Dump по1.4(источник ошибочно глава4); H264:eseye/Vega,H265:HEVCAnalyzer. Проверьте просмотр иPOC; при верном входе передайте файл иLogcat.

![Рисунок 1, страница PDF 13 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p13-6.png)

Рисунок 1, страница PDF 13 (китайский PDF)

### 2.2 Размытая запись/мозаика

Сжатие с потерями удаляет данные. Низкое локальное качество связано сQP1–51:меньше —лучше. Без ограниченияQP рост битрейта обычно уменьшаетQP.

1. eseye/Vega проверяетQP кадра,пример16–29. Блоки>40 могут размываться; настройте битрейт. При нормальномQP захватите вход.
2. Универсальной таблицы нет:факт≥цель с высокимQP —возможно цель мала; увеличьте. Факт<цель:проверьтеBITRATE_MODE_VBR. Факт намного выше:настройтеQP вручную.

![Рисунок 1, страница PDF 14 (китайский PDF)](/docs/rockchip-android-multimedia-faq/images/pdf-p14-7.png)

Рисунок 1, страница PDF 14 (китайский PDF)

3. Вместоbaseline попробуйтеhigh profile:CABAC улучшает сжатие/качество. Android12+ ограничиваетQP,Max≤40 может помочь; qp-i-min —минимумI,qp-p-max —максимумP. Битрейт может превыситься; контролируйте. Android11 и старше изменяетMPP.

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

### 2.3 Превышение битрейта MediaCodec

В Android12 цель1Mbps для1080P может дать более4Mbps:mediaformatshaping исправляет неразумныйQP/битрейт. VQApply учитывает ширину,высоту,bpp и цель,обычно повышая до width×height×bpp. Отключите свойством или измените значение frameworks/av.

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

### 2.4 Ошибка инициализации

При воспроизведении,записи,снимках mpp hal xxx init failed обычно означает выключенныйDTS-узел. jpegd —JPEG-декодер,vdpu —проверяемый узел. Проверьте /proc/mpp_service и rk3588-evb.dtsi либо rk3399-android.dtsi.

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

h264e означает ошибку H.264-кодера; включите vepu:

```dts
&mpp_srv {
status = "okay";
};
&vepu {
status = "okay";
};
```

### 2.5 Эффективность BufferMode

Без Surface приложению нужен выходной буфер,но dmaBuffer нельзя передать напрямую. ДополнительноеCPU-копирование повышает время кадра и нагрузку,особенно при уже высокой нагрузке. SurfaceMode передаёт dmaBuffer напрямую декодеру/выводу без копирования. ЗаменаCPU-копии наRGA снижает нагрузку и время; [418670](https://redmine.rock-chips.com/issues/418670).

## 3 Приложения

### 3.1 Kodi/bilibili без аппаратного декодера

В Android12+ ijkmedia выбирает имена OMX.,пропуская Codec2 c2.rk.avc.decoder. Временный псевдоним OMX.c2.rk.avc.decoder обеспечивает совместимость. Собственные приложения тоже затронуты; проверяйте IJKMEDIA. Окончательно исправляется выбор ijkmedia; источник не включает временную правку в релиз. [396998](https://redmine.rock-chips.com/issues/396998).

### 3.2 WebView:ошибка/белая полоса

AFBC RK3566/3568/3588/3528 выше1080P добавляет4верхние строки. ImageReader/NdkImageReader должен учитыватьcrop Surface-буфера. Иначе белая полоса. Проверка нулевого начала отклоняет буфер; удалите возврат в frameworks/av:

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

Полоса может остаться. Локальный плеер контролируетsource crop; WebView получает GraphicBuffer через getHardwareBuffer,поэтомуcrop обрабатывает приложение. Framework пока не исправляет. Можно отключитьFBC ценой производительности. Android11 и ранее:hardware/rockchip/omx_il:

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

Android12+:vendor/rockchip/hardware/interfaces/codec2:

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

### 3.3 Сбой iQiyi при длительном тесте

В Android10+ реклама поздно задаёт Surface MediaPlayer:BufferMode сменяется SurfaceChange,нужны новые буферы и освобождение старых. Ненулевые ссылки удерживаютDMA,вызывая lowmem и сбой. Подтверждение —непрерывный рост DMA-буферовVPU. [423914](https://redmine.rock-chips.com/issues/423914).

```sh
cat /d/dma_buf/bufinfo
```

### 3.4 Ошибка текущих миниатюр

MediaMetadataRetriever отключён при воспроизведении для экономии полосы и защиты переднего плана от фоновой нагрузки. Android12+ имеет свойство ниже,его можно добавить вsystem prop. Для старых версий запросите обновление библиотеки черезRedmine.

```text
MediaMetadataRetrieverJNI( 1574): getFrameAtTime: videoFrame is a NULL pointer
```

```sh
setprop rt_retriever_enable 1
```

### 3.5 RK356X:зелёная запись/RGA

```text
E/rga_mm ( 0): RGA_MMU unsupported Memory larger than 4G!
E/rga_mm ( 0): scheduler core[4] unsupported mm_flag[0x0]!
E/rga_mm ( 0): rga_mm_map_buffer map dma_buf error!
E/rga_mm ( 0): job buffer map failed!
E/rga_mm ( 0): src channel map job buffer failed!
E/rga_mm ( 0): failed to map buffer
```

RGA2 адресует32бита,буферы нужны ниже4G. КодеруRK356X требуется выравнивание,RGA выполняет предобработку. src/dst выше4G вызывают ошибку;выделяетGralloc.

1. dst выделять GraphicBufferAllocator с GRALLOC_USAGE_WITHIN_4G.
2. src поступает изSurface —производителяBufferQueue;Codec —потребитель. usage потребителя влияет на выделение производителем. GRALLOC_USAGE_HW_VIDEO_ENCODER отмечает аппаратный кодер;Gralloc при этомusage наRK356X выделяет ниже4G. [425094](https://redmine.rock-chips.com/issues/425094).

### 3.6 Отключение форматов

MediaPlayer исключает форматы конфигурацией. Текст называетRK3588 и VC1/VP9,AAC/MP3,но патч содержитRK3566/RK3567/RK3568;проверьтеSDK. Утверждение источника о региональных правахVP9 не является юридическим выводом. device/rockchip/common:

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

Для проверки обновите /system/etc/rt_audio_config.xml и rt_video_config.xml,запустите воспроизведение заново. Другие варианты:

```text
Video: mpeg1, mpeg2, h263, mpeg4, wmv1, wmv2, wmv3, h264, vp8, vp9, hevc, vc1, avs, avs+, avs2, flv1, av1
Audio: AAC, APE, MP3, WMALOSSLESS, WMAPRO, WMAV1, WMAV2, ADPCM_IMA_QT, VORBIS, PCM_S16LE, PCM_S24LE, FLAC, MP1, MP2, AMR_WB, AMR_NB
```

### 3.7 Красноватое видео Camera4K

При отсутствииcolorAspect Android выбираетBT2020 по разрешению;HDR-устройство включаетHDR,и Camera/CameraRecorder4K выглядит краснее/ярче. Источник считает насыщенность усилением вывода. Если нежелательно,задайтеBT709 в frameworks/av setDefaultCodecColorAspectsIfNeeded;точный порог в коде:

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

### 3.8 Чёрный кадр между видео

Статический режим держит последний кадр до первого кадра следующего видео. Чёрный режим подаёт чёрный кадрSurface при завершении. Android MediaPlayer включает его свойством ниже либо записью вsystem prop.

```sh
setprop media.rockit.video.black_frame 1
```

## Ссылки

[Документация ArmSoM](https://docs.armsom.org/). Redmine —ссылки источника;может требоваться доступ. Получение патчей и аппаратная проверка не заявляются.

{% endraw %}
