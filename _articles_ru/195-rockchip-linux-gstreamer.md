---
title: "Руководство пользователя Rockchip Linux GStreamer"
description: "Руководство пользователя Rockchip Linux GStreamer — V1.2.1"
excerpt: "Руководство пользователя Rockchip Linux GStreamer"
translation_key: "195-rockchip-linux-gstreamer"
slug: "195-rockchip-linux-gstreamer"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "Sige3", "Sige1", "CM3", "AIM3", "AIM5", "LM7", "W3", "KVM"]
products: []
tags: [ArmSoM, Rockchip, Linux, GStreamer, MPP]
---

{% raw %}

# Руководство пользователя Rockchip Linux GStreamer

Основа — Rockchip RK-YH-YF-921, китайская и английская версии V1.2.1 от 2024-01-16; сохранены технические главы 1–12. Китайский текст служит основой, дополнения и расхождения отмечены ниже. Для применения на ArmSoM необходимо проверить конкретные SoC, плату, SDK/BSP, ядро и периферию. Команды и аппаратные испытания не выполнялись. В блоках сохранены исходные команды, комментарии и вывод gst-inspect; значения по умолчанию и диапазоны относятся к версии источника.

| Система | Версия GStreamer |
| --- | --- |
| Buildroot | 1.22.x |
| Debian 10 (Buster) | 1.14.4 |
| Debian 11 (Bullseye) | 1.18.5 |
| Yocto | 1.20.x |

## 1. Введение в GStreamer

GStreamer — открытая мультимедийная среда. В Linux SDK (кроме IPC) мультимедийные приложения и кодеки преимущественно соединяются через GStreamer. Плагины адаптируют среду к аппаратуре Rockchip, позволяя приложениям использовать аппаратное ускорение кодирования и декодирования.

### 1.1 Адаптация видеокодеков GStreamer

На следующей схеме воспроизведение видео служит примером основных этапов кодирования, декодирования и отображения на платформе Rockchip.

![Руководство пользователя Rockchip Linux GStreamer](/docs/rockchip-linux-gstreamer/assets/en-p005-figure-01.png)

Демультиплексор сначала разделяет видеофайл, например mp4, на видеопоток (например, H264/H265) и аудиопоток. Видеопоток декодирует видеодекодер, например mppvideodec или mppjpegdec, а аудиопоток — аудиодекодер. Плагин вывода, например xvimagesink или waylandsink, передаёт декодированное видео на экран; плагин воспроизведения звука, например alsasink, передаёт декодированные аудиоданные звуковой карте. На платформе Rockchip аппаратное ускорение реализует rockchipmpp: декодеры mppvideodec и mppjpegdec, кодеры mpph264enc, mppvp8enc, mppjpegenc и другие. При декодировании GStreamer преимущественно выбирает rockchipmpp. Плагины, например mppvideodec, вызывают API MPP; эта промежуточная библиотека видеокодеков Rockchip обращается к драйверу VPU (vpu_service). Аппаратные кодеки можно также проверять непосредственно примерами MPP, например mpi_dec_test и mpi_enc_test. Декодированные данные передаются устройству отображения через плагины вывода. Каждый плагин обращается к API соответствующей графической архитектуры: xvimagesink использует X11, waylandsink — Wayland.

Подробности вывода см. в Rockchip_Developer_Guide_Linux_Graphics_EN.pdf из SDK. Исходники MPP: &lt;SDK&gt;/external/mpp/. Документация MPP: &lt;SDK&gt;/docs/Linux/Multimedia/Rockchip_Developer_Guide_MPP_EN.pdf. Тестовые примеры: &lt;SDK&gt;/external/mpp/test.

## 2. Исходный код и сборка

### 2.1 Расположение исходников

Buildroot: исходники GStreamer и плагинов загружаются из сети, после чего применяются патчи RK; подробности см. в &lt;SDK&gt;/buildroot/package/gstreamer1/. Debian: исходники загружаются из репозитория Debian, затем применяются патчи Rockchip; для Debian 10 используется 1.14.4, для Debian 11 — 1.18.5. Gstreamer-rockchip: исходники плагинов MPP и rkximagesink находятся в &lt;SDK&gt;/external/gstreamer-rockchip. Buildroot и Debian используют один репозиторий.

### 2.2 Сборка

Buildroot: включите соответствующие макросы (обычно уже включены) и выполните сборку в корне SDK. Макросы собраны в &lt;SDK&gt;/buildroot/configs/rockchip/*_gst.config; включите их в целевую конфигурацию. Можно выбрать версию, например BR2_PACKAGE_GSTREAMER1_18 или BR2_PACKAGE_GSTREAMER1_20.

```text
BR2_PACKAGE_MPP=y
BR2_PACKAGE_MPP_ALLOCATOR_DRM=y
BR2_PACKAGE_GSTREAMER1_ROCKCHIP=y
BR2_PACKAGE_LINUX_RGA=y
BR2_PACKAGE_CA_CERTIFICATES=y
BR2_PACKAGE_LIBSOUP_SSL=y
BR2_PACKAGE_GSTREAMER1=y
BR2_PACKAGE_GST1_PLUGINS_BASE=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_ALSA=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_VIDEOCONVERT=y
BR2_PACKAGE_GST1_PLUGINS_BASE_PLUGIN_VIDEOTESTSRC=y
BR2_PACKAGE_GST1_PLUGINS_GOOD=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_AUDIOPARSERS=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_AUTODETECT=y
```

```text
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_DEINTERLACE=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_FLV=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_GDKPIXBUF=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_MATROSKA=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_MPG123=y
BR2_PACKAGE_GST1_PLUGINS_GOOD_PLUGIN_SOUPHTTPSRC=y
BR2_PACKAGE_GST1_PLUGINS_BAD=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DVBSUBOVERLAY=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DVDSPU=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_JPEGFORMAT=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_KMS=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_MPEGDEMUX=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_MPEG2ENC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_VIDEOPARSERS=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_ADPCMDEC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_ADPCMENC=y
BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_FAAD=y
BR2_PACKAGE_GST1_PLUGINS_UGLY=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_ASFDEMUX=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_DVDLPCMDEC=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_DVDSUB=y
BR2_PACKAGE_GST1_PLUGINS_UGLY_PLUGIN_MPEG2DEC=y
...
```

Полный список плагинов: menuconfig → Target packages → Audio and video applications → gstreamer 1.x. Debian: разместите исходники на плате и убедитесь, что в их корне есть каталог debian. Перейдите в корень исходников и выполните:

```text
# 1 Update software sources
apt update
# 2 Install dependent libraries
apt build-dep .
# 3 Optional: start building the deb installation package
dpkg-buildpackage -b -d -uc -us
# After the building is completed, the deb installation package will be generated
in the upper directory, which can be installed by using dpkg -i xxx.deb.
# 3 Optional: build and install
meson build && ninja -C build install
```

Рекомендуется первый способ — сборка установочного пакета deb: он обеспечивает единообразные параметры сборки и установки. Некоторые параметры зависят от макросов в заголовках, например video-format.h. Сначала установите libgstreamer-plugins-base1.0-dev, чтобы обновить заголовки и включить соответствующие возможности. Если плагин отсутствует, проверьте сценарий и журнал сборки, установите все его зависимости, убедитесь, что он включён в debian/*.install, затем пересоберите.

## 3. Часто используемые команды

gst-launch-1.0 — средство быстрого построения конвейеров GStreamer. Примеры:

```text
# Generate a video by videotestsrc, and display it through xvimagesink
gst-launch-1.0 videotestsrc ! xvimagesink
```

gst-play-1.0 — проигрыватель GStreamer для различных медиапотоков. Примеры:

```text
  # Play test.mp4 and display it through xvimagesink
  gst-play-1.0 test.mp4 --videosink=xvimagesink
  # Commonly used command options
--flags          # bit0: video, bit1: audio, bit2: subtitle, such as --flags=1
means only video is played
  --videosink    # specify videosink
  --audiosink    # specify audiosink
  --use-playbin3 # use playbin3, otherwise use playbin2
```

gst-inspect-1.0 выводит список плагинов или сведения об отдельном плагине. Пример:

```text
# Without any parameters, list all plugins
gst-inspect-1.0
# List all information about the xvimagesink plugin
gst-inspect-1.0 xvimagesink
```

gst-discoverer-1.0 анализирует формат потока по URI и проверяет наличие необходимых плагинов. Примеры:

```text
# analyze local file
gst-discoverer-1.0 test.mp4
# analyze rtsp streaming
gst-discoverer-1.0 rtsp://127.0.0.1:8554/
```

Включение журналирования

```text
  #Set environment variables
  export GST_DEBUG=2
  #Or specified before the command, and invalid after the end of the command
  GST_DEBUG=2 gst-play-1.0 ...

  #Specify different log levels for different modules, support wildcards,
fpsdisplaysink is specified as DEBUG (5), xvimage* is specified as FIXME (3),
others are specified as WARNING (2)
  GST_DEBUG=2,fpsdisplaysink:5,xvimage*:3
```

Уровни журнала: ERROR(1), WARNING(2), FIXME(3), INFO(4), DEBUG(5), LOG(6), TRACE(7) и другие.

## 4. Плагины

В этой главе описаны плагины Rockchip и часто используемые плагины; остальные см. в официальной документации. Есть три основные категории: Source, промежуточная обработка и Sink. Source только выдаёт данные: filesrc читает файл, videotestsrc генерирует изображения. Промежуточный элемент принимает данные, обрабатывает и передаёт далее; примеры — демультиплексоры, кодеки и фильтры. Sink только принимает данные: filesink сохраняет файл, waylandsink отображает изображения. Плагины распределены по пакетам gst-plugins-base, gst-plugins-bad, gst-plugins-good, gst-plugins-ugly и другим. Далее приведены распространённые плагины, их свойства и типичные конвейеры. Полный список и описания доступны через gst-inspect-1.0.

### 4.1 gstreamer-rockchip

Исходники: &lt;SDK&gt;/external/gstreamer-rockchip.

#### 4.1.1 kmssrc

Получение изображения от указанного объекта. Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/kmssrc. Примеры конвейеров:

```text
# Get and render image
gst-launch-1.0 kmssrc ! waylandsink
# Get and render image with specified framerate
gst-launch-1.0 kmssrc sync-fb=0 ! 'video/x-raw,framerate=10/1' ! fpsdisplaysink
video-sink=fakesink
# Get and encode image
gst-launch-1.0 kmssrc sync-fb=0 ! mpph264enc ! h264parse ! filesink
location=/tmp/out.h264
```

Свойства: connector-id

Получение изображения от указанного connector; ID можно узнать через modetest -c.

```text
connector-id        : DRM connector ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

crtc-id: получение изображения от указанного объекта CRTC; ID определяется через modetest -p.

```text
crtc-id             : DRM crtc ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

encoder-id: получение изображения от указанного объекта Encoder; ID определяется через modetest -e.

```text
encoder-id          : DRM encoder ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

fb-id: получение изображения от указанного объекта Framebuffer; ID определяется через modetest -p.

```text
fb-id               : DRM FB ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

plane-id: получение изображения от указанного объекта Plane; ID определяется через modetest -p.

```text
plane-id            : DRM plane ID (0 = unspecified)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

framerate-limit

```text
framerate-limit     : Limited framerate
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 120
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

sync-fb

```text
sync-fb             : Sync with FB flip
                      flags: readable, writable
                      Boolean. Default: true
```

sync-vblank

```text
sync-vblank         : Sync with vblank
                      flags: readable, writable
                      Boolean. Default: true
```

#### 4.1.2 mppvideodec

Декодирование через API MPP. Поддерживаются H263, H264, H265, AV1, VP8, VP9, MPEG. Возможности зависят от платформы; см. datasheet. Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Примеры конвейеров:

```text
# mppvideodec has the highest rank, it will be automatically selected.
gst-play-1.0 test.mp4
# or create the pipeline menually
gst-launch-1.0 filesrc location=test.mp4 ! parsebin ! mppvideodec ! waylandsink
```

Свойства: arm-afbc — попытка использовать ARM AFBC для повышения производительности; поддерживается не всеми выходными элементами.

```text
arm-afbc            : Prefer ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

crop-rectangle

```text
crop-rectangle      : The crop rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

fast-mode

```text
fast-mode           : Enable MPP fast decode mode
                      flags: readable, writable
                      Boolean. Default: true
```

ignore-error

```text
ignore-error        : Ignore MPP decode errors
                      flags: readable, writable
                      Boolean. Default: true
```

format: преобразование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
format              : Prefered output format
                      flags: readable, writable
                      Enum "GstMppVideoDecFormat" Default: 0, "auto"
                         (0): auto             - Auto
                         (23): NV12             - NV12
                         (24): NV21             - NV21
                         (2): I420             - I420
                         (3): YV12             - YV12
                         (51): NV16             - NV16
                         (60): NV61             - NV61
                         (30): BGR16            - BGR565
                         (15): RGB              - RGB
                         (16): BGR              - BGR
                         (11): RGBA             - RGBA8888
                         (12): BGRA             - BGRA8888
                         (7): RGBx             - RGBX8888
                         (8): BGRx             - BGRX8888
```

width: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Поворот через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppDecRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.3 mppjpegdec

Декодирование JPEG через API MPP. Возможности декодирования зависят от платформы; см. datasheet. Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Примеры конвейеров:

```text
gst-launch-1.0 filesrc location=nv12.jpg ! parsebin ! mppjpegdec ! filesink
location=nv12.yuv
```

Свойства: crop-rectangle

```text
crop-rectangle      : The crop rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

dma-feature

```text
dma-feature         : Enable GST DMA feature
                      flags: readable, writable
                      Boolean. Default: false
```

fast-mode

```text
fast-mode           : Enable MPP fast decode mode
                      flags: readable, writable
                      Boolean. Default: true
```

ignore-error

```text
ignore-error        : Ignore MPP decode errors
                      flags: readable, writable
                      Boolean. Default: true
```

format: преобразование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
format              : Prefered output format
                      flags: readable, writable
                      Enum "GstMppVideoDecFormat" Default: 0, "auto"
                         (0): auto             - Auto
                         (23): NV12             - NV12
                         (24): NV21             - NV21
                         (2): I420             - I420
                         (3): YV12             - YV12
                         (51): NV16             - NV16
                         (60): NV61             - NV61
                         (30): BGR16            - BGR565
                         (15): RGB              - RGB
                         (16): BGR              - BGR
                         (11): RGBA             - RGBA8888
                         (12): BGRA             - BGRA8888
                         (7): RGBx             - RGBX8888
                         (8): BGRx             - BGRX8888
```

width: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Поворот через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppDecRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.4 mpph264enc/mpph265enc/mppvp8enc

Кодирование через API MPP. Поддерживаются H264, H265 и VP8. Возможности платформ различаются; подробности см. в datasheet (исходник здесь употребляет «декодирование»). Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Примеры конвейеров:

```text
# Encode 10s long 640x320@NV12 raw to H264 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mpph264enc ! h264parse !
qtmux ! filesink location=h264.mp4
# Encode 10s long 640x320@NV12 raw to H265 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mpph265enc ! h265parse !
qtmux ! filesink location=h265.mp4
# Encode 10s long 640x320@NV12 raw to VP8 and package to MP4 file.
gst-launch-1.0 videotestsrc num-buffers=600 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mppvp8enc ! qtmux !
filesink location=vp8.mp4
```

Свойства: arm-afbc

```text
arm-afbc            : Input is ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

bps

```text
bps                 : Target BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-max

```text
bps-max             : Max BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-min

```text
bps-min             : Min BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

gop

```text
gop                 : Group of pictures starting with I frame (-1 = FPS, 1 = all
I frames)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

qp-init

```text
qp-init             : Initial QP (lower value means higher quality)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 26
```

qp-max

```text
qp-max              : Max QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-max-i

```text
qp-max-i            : Max Intra QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-min

```text
qp-min              : Min QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

qp-min-i

```text
qp-min-i            : Min Intra QP (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 51 Default: 0
```

rc-mode

```text
rc-mode             : RC mode
                      flags: readable, writable
                      Enum "GstMppEncRcMode" Default: 1, "cbr"
                         (0): vbr              - Variable bitrate
                         (1): cbr              - Constant bitrate
                         (2): fixqp            - Fixed QP
```

width

Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Поворот через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppEncRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.5 mppjpegenc

Кодирование JPEG через API MPP. Возможности платформ различаются; подробности см. в datasheet (исходник здесь употребляет «декодирование»). Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp/. Примеры конвейеров:

```text
# Encode 640x320@NV12 raw to jpeg file.
gst-launch-1.0 videotestsrc num-buffers=1 ! video/x-
raw,format=NV12,width=640,height=320,framerate=60/1 ! mppjpegenc ! filesink
location=nv12.jpg
```

Свойства: arm-afbc

```text
arm-afbc            : Input is ARM AFBC compressed format
                      flags: readable, writable
                      Boolean. Default: false
```

bps

```text
bps                 : Target BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-max

```text
bps-max             : Max BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

bps-min

```text
bps-min             : Min BPS (0 = auto calculate)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

q-factor

```text
q-factor            : Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 80
```

qf-max

```text
qf-max              : Max Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 99
```

qf-min

```text
qf-min              : Min Quality Factor
                      flags: readable, writable
                      Unsigned Integer. Range: 1 - 99 Default: 1
```

rc-mode

```text
rc-mode             : RC mode
                      flags: readable, writable
                      Enum "GstMppEncRcMode" Default: 1, "cbr"
                         (0): vbr              - Variable bitrate
                         (1): cbr              - Constant bitrate
                         (2): fixqp            - Fixed QP
```

width: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
width               : Width (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

height: Масштабирование через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
height              : Height (0 = original)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 2147483647 Default: 0
```

rotation: Поворот через RGA. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и удалите переменную окружения GST_MPP_NO_RGA.

```text
rotation            : Rotation
                      flags: readable, writable
                      Enum "GstMppEncRotation" Default: 0, "0"
                         (0): 0                - Rotate 0
                         (90): 90               - Rotate 90
                         (180): 180              - Rotate 180
                         (270): 270              - Rotate 270
```

#### 4.1.6 rkximagesink

Создаёт окно через API X и выводит изображение через DRM. Вывод без копирования занимает аппаратный слой VOP. Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rkximage/. Примеры конвейеров:

```text
gst-launch-1.0 videotestsrc ! rkximagesink
```

Свойства: connector-id — вывод изображения на указанный connector; ID определяется через modetest -c.

```text
connector-id        : DRM connector id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

plane-id: вывод изображения на указанную плоскость; ID определяется через modetest -p.

```text
plane-id            : DRM plane id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

### 4.2 Базовые элементы

#### 4.2.1 fakesink

Принимает и отбрасывает данные. Примеры конвейеров:

```text
gst-launch-1.0 filesrc location=/tmp/test ! fakesink
gst-play-1.0 /oem/SampleVideo_1280x720_5mb.mp4 --audiosink=fakesink
```

#### 4.2.2 filesrc

Читает файл с произвольной позиции. Примеры конвейеров:

```text
gst-launch-1.0 filesrc location=/tmp/test ! filesink location=/tmp/test2
gst-launch-1.0 filesrc location=nv12_640x320.yuv blocksize=307200 ! video/x-
raw,format=NV12,width=640,height=320 ! mpph264enc ! filesink location=out.h264
```

Свойства: blocksize

```text
blocksize           : Size in bytes to read per buffer (-1 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 4294967295 Default: 4096
```

location

```text
location            : Location of the file to read
                      flags: readable, writable, changeable only in NULL or READY
state
                      String. Default: null
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

#### 4.2.3 filesink

Записывает поток в файл. Примеры конвейеров:

```text
gst-launch-1.0 filesrc location=/tmp/test ! filesink location=/tmp/test2
```

Свойства: blocksize

```text
blocksize           : Size in bytes to pull per buffer (0 = default)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 4294967295 Default: 4096
```

location

```text
location            : Location of the file to write
                      flags: readable, writable
                      String. Default: null
```

### 4.3 gst1-plugins-base

#### 4.3.1 appsrc

Позволяет приложению передавать буферы в конвейер. Примеры кода: gst-plugins-base-&lt;version&gt;/tests/examples/app/.

#### 4.3.2 appsink

Позволяет приложению получать доступ к буферам необработанных данных. Примеры кода: gst-plugins-base-&lt;version&gt;/tests/examples/app/.

#### 4.3.3 decodebin/decodebin3

Автоматически соединяет элементы и декодирует в необработанные медиаданные. Примеры конвейеров:

```text
gst-launch-1.0 filesrc location=/oem/SampleVideo_1280x720_5mb.mp4 ! decodebin !
waylandsink
gst-launch-1.0 filesrc location=/oem/SampleVideo_1280x720_5mb.mp4 ! decodebin
name=d d. ! waylandsink d. ! pulsesink
```

#### 4.3.4 playbin/playbin3

Автоматически соединяет элементы и воспроизводит медиа по URI. Примеры конвейеров:

```text
gst-launch-1.0 playbin uri=file:///oem/SampleVideo_1280x720_5mb.mp4
# select sinks menually, enable video and audio
gst-launch-1.0 playbin uri=file:///oem/SampleVideo_1280x720_5mb.mp4
videosink=waylandsink audiosink=pulsesink flags=3
```

Свойства: audio-sink

```text
audio-sink          : the audio output element to use (NULL = default sink)
                      flags: readable, writable
                      Object of type &quot;GstElement&quot;
```

flags

```text
flags               : Flags to control behaviour
                      flags: readable, writable
                      Flags "GstPlayFlags" Default: 0x00000617, "soft-
colorbalance+deinterlace+soft-volume+text+audio+video"
                         (0x00000001): video            - Render the video stream
                         (0x00000002): audio            - Render the audio stream
                         (0x00000004): text             - Render subtitles
                         (0x00000008): vis              - Render visualisation
when no video is present
                         (0x00000010): soft-volume      - Use software volume
                         (0x00000020): native-audio     - Only use native audio
formats
                         (0x00000040): native-video     - Only use native video
formats
                         (0x00000080): download         - Attempt progressive
download buffering
                         (0x00000100): buffering        - Buffer demuxed/parsed
data
                         (0x00000200): deinterlace      - Deinterlace video if
necessary
                         (0x00000400): soft-colorbalance - Use software color
balance
                         (0x00000800): force-filters    - Force audio/video
filter(s) to be applied
                         (0x00001000): force-sw-decoders - Force only software-
based decoders (no effect for playbin3)
```

video-sink

```text
video-sink          : the video output element to use (NULL = default sink)
                      flags: readable, writable
                      Object of type "GstElement"
```

#### 4.3.5 uridecodebin/uridecodebin3

Автоматически соединяет элементы и декодирует ресурс URI в необработанные медиаданные. Примеры конвейеров:

```text
gst-launch-1.0 uridecodebin uri=file:///oem/SampleVideo_1280x720_5mb.mp4 !
waylandsink
gst-launch-1.0 uridecodebin uri=file:///oem/SampleVideo_1280x720_5mb.mp4 name=d
d. ! waylandsink d. ! pulsesink
```

Свойства: uri

```text
uri                 : URI to decode
                      flags: readable, writable
                      String. Default: null
```

#### 4.3.6 videoconvert

Преобразует видео между цветовыми пространствами. Поддерживает двумерное ускорение RGA; возможности RGA зависят от платформы, см. datasheet. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и выполните export GST_VIDEO_CONVERT_USE_RGA=1. Примеры конвейеров:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! video/x-raw,format=NV12 ! videoconvert ! video/x-
raw,format=BGRA ! waylandsink
```

#### 4.3.7 videoscale

Изменяет размер видео. Поддерживает двумерное ускорение RGA; возможности RGA зависят от платформы, см. datasheet. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и выполните export GST_VIDEO_CONVERT_USE_RGA=1. Примеры конвейеров:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! video/x-raw,width=640,height=320 ! videoscale !
video/x-raw,width=1280,height=720 ! waylandsink
```

#### 4.3.8 videotestsrc

Создаёт тестовый видеопоток. Примеры конвейеров:

```text
  # create a default stream
  gst-launch-1.0 videotestsrc ! xvimagesink
  # create a 1920x1080@NV12 stream
  gst-launch-1.0 videotestsrc ! "video/x-raw,width=1920,height=1080,format=
(string)NV12" ! xvimagesink
```

#### 4.3.9 xvimagesink

Элемент вывода видео на основе Xv. Примеры конвейеров:

```text
gst-launch-1.0 videotestsrc ! xvimagesink
```

### 4.4 gst1-plugins-good

#### 4.4.1 v4l2src

Читает кадры устройства Video4Linux2. Примеры конвейеров:

```text
gst-launch-1.0 v4l2src ! video/x-raw,width=1920,height=1080,format=NV12 !
waylandsink
```

Свойства: device

```text
device              : Device location
                      flags: readable, writable
                      String. Default: "/dev/video-camera0"
```

min-buffers

```text
min-buffers         : Override the driver's min buffers (0 means auto)
                      flags: readable, writable
                      Unsigned Integer. Range: 0 - 64 Default: 0
```

num-buffers

```text
num-buffers         : Number of buffers to output before sending EOS (-1 =
unlimited)
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

#### 4.4.2 rtspsrc

Получает данные по сети через RTSP (RFC 2326). Примеры конвейеров:

```text
gst-launch-1.0 rtspsrc location=rtsp://192.168.1.105:8554/ ! rtph264depay !
h264parse ! mppvideodec ! waylandsink
```

Свойства: location

```text
location            : Location of the RTSP url to read
                      flags: readable, writable
                      String. Default: null
```

#### 4.4.3 videoflip

Отражает и поворачивает видео. Поддерживает двумерное ускорение RGA; возможности RGA зависят от платформы, см. datasheet. Включите BR2_PREFER_ROCKCHIP_RGA в menuconfig и выполните export GST_VIDEO_FLIP_USE_RGA=1. Примеры конвейеров:

```text
# uncomment these two variables in /etc/profile.d/gst.sh, or export manually
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
gst-launch-1.0 videotestsrc ! videoflip video-direction=90r ! waylandsink
```

Свойства: video-direction

```text
video-direction     : Video direction: rotation and flipping
                      flags: readable, writable, controllable, changeable in
NULL, READY, PAUSED or PLAYING state
                      Enum "GstVideoOrientationMethod" Default: 0, "identity"
                         (0): identity         - GST_VIDEO_ORIENTATION_IDENTITY
                         (1): 90r              - GST_VIDEO_ORIENTATION_90R
                         (2): 180              - GST_VIDEO_ORIENTATION_180
                         (3): 90l              - GST_VIDEO_ORIENTATION_90L
                         (4): horiz            - GST_VIDEO_ORIENTATION_HORIZ
                         (5): vert             - GST_VIDEO_ORIENTATION_VERT
                         (6): ul-lr            - GST_VIDEO_ORIENTATION_UL_LR
                         (7): ur-ll            - GST_VIDEO_ORIENTATION_UR_LL
                         (8): auto             - GST_VIDEO_ORIENTATION_AUTO
                         (9): custom           - GST_VIDEO_ORIENTATION_CUSTOM
```

### 4.5 gst1-plugins-bad

#### 4.5.1 kmssink

Элемент вывода видео через API настройки режима ядра Linux (KMS). Примеры конвейеров:

```text
gst-launch-1.0 videotestsrc ! kmssink
```

Свойства: connector-id

```text
connector-id        : DRM connector id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

fullscreen

```text
fullscreen          : Force showing fullscreen
                      flags: readable, writable
                      Boolean. Default: false
```

hdr-enable

```text
hdr-enable          : Enable HDR
                      flags: readable, writable
                      Boolean. Default: true
```

plane-id

```text
plane-id            : DRM plane id
                      flags: readable, writable
                      Integer. Range: -1 - 2147483647 Default: -1
```

render-rectangle

```text
render-rectangle    : The render rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

sync-mode

```text
sync-mode           : Prefered frame syncing mode
                      flags: readable, writable
                      Enum "GstKMSSyncMode" Default: 0, "auto"
                         (0): auto             - Sync with page flip or vblank
event
                         (1): flip             - Sync with page flip event
                         (2): vblank           - Sync with vblank event
                         (3): none             - Ignore syncing
```

#### 4.5.2 waylandsink

Вывод на поверхность Wayland. Примеры конвейеров:

```text
gst-launch-1.0 videotestsrc ! waylandsink
```

Свойства: fullscreen

```text
fullscreen          : Whether the surface should be made fullscreen
                      flags: readable, writable
                      Boolean. Default: false
```

layer

```text
layer               : Wayland window layer
                      flags: readable, writable
                      Enum "GstWlWindowLayer" Default: 1, "normal"
                         (0): top              - Top
                         (1): normal           - Normal
                         (2): bottom           - Bottom
```

render-rectangle

```text
render-rectangle    : The render rectangle ('<x, y, width, height>')
                      flags: writable
                      Default: "<  >"
                      GstValueArray of GValues of type "gint" Write only
```

rotate-method

```text
rotate-method       : rotate method
                      flags: readable, writable
                      Enum "GstVideoOrientationMethod" Default: 0, "identity"
                         (0): identity         - GST_VIDEO_ORIENTATION_IDENTITY
                         (1): 90r              - GST_VIDEO_ORIENTATION_90R
                         (2): 180              - GST_VIDEO_ORIENTATION_180
                         (3): 90l              - GST_VIDEO_ORIENTATION_90L
                         (4): horiz            - GST_VIDEO_ORIENTATION_HORIZ
                         (5): vert             - GST_VIDEO_ORIENTATION_VERT
                         (6): ul-lr            - GST_VIDEO_ORIENTATION_UL_LR
                         (7): ur-ll            - GST_VIDEO_ORIENTATION_UR_LL
                         (8): auto             - GST_VIDEO_ORIENTATION_AUTO
                         (9): custom           - GST_VIDEO_ORIENTATION_CUSTOM
```

sync

```text
sync                : Sync on the clock
                      flags: readable, writable
                      Boolean. Default: true
```

#### 4.5.3 fpsdisplaysink

Показывает текущую частоту и частоту пропуска кадров выходного элемента как наложение либо текст в stdout. Примеры конвейеров:

```text
  # debug level TRACE(7) for avg-rate per second, debug level DEBUG(5) for
min/max rate.
  GST_DEBUG=fpsdisplaysink:7 gst-play-1.0 --flags=3 --videosink="fpsdisplaysink
video-sink=xvimagesink signal-fps-measurements=true text-overlay=false
sync=false"
```

Свойства: signal-fps-measurements

```text
signal-fps-measurements: If the fps-measurements signal should be emitted.
                      flags: readable, writable
                      Boolean. Default: false
```

sync

```text
sync                : Sync on the clock (if the internally used sink doesn't have
this property it will be ignored
                      flags: readable, writable
                      Boolean. Default: true
```

text-overlay

```text
text-overlay        : Whether to use text-overlay
                      flags: readable, writable
                      Boolean. Default: true
```

video-sink

```text
video-sink          : Video sink to use (Must only be called on NULL state)
                      flags: readable, writable
                      Object of type "GstElement"
```

## 5. Плагины Rockchip MPP

Плагины кодирования и декодирования основаны на MPP. Базовый класс декодера — GstVideoDecoder, кодера — GstVideoEncoder. Исходники: &lt;SDK&gt;/external/gstreamer-rockchip/gst/rockchipmpp. Декодер поддерживает JPEG, MPEG, VP8, VP9, H264, H265 [1]; кодер — JPEG, H264, H265, VP8.

### 5.1 gstmppdec

Исходники находятся в gstreamer-rockchip/gst/rockchipmpp и включают mppvideodec и mppjpegdec. Далее используется пример mppvideodec.

```text
gstreamer-rockchip/gst/rockchipmpp/
├── gstmppdec.c
├── gstmppdec.h
├── gstmppjpegdec.c
├── gstmppjpegdec.h
├── gstmppvideodec.c
├── gstmppvideodec.h
……
```

#### 5.1.1 Основные функции

gst_mpp_dec_start: создаёт MPP и Allocator. gst_mpp_dec_set_format: инициализирует MPP, задаёт тип и формат кодека, настраивает свойства, например Fast Mode и Ignore Error.

gst_mpp_dec_handle_frame: получает пакет MPP через get_mpp_packet, заполняет данные и передаёт его MPP через send_mpp_packet. gst_mpp_dec_loop: получает декодированный кадр через poll_mpp_frame и передаёт следующему плагину. gst_mpp_dec_rga_convert: если требуются преобразование формата, поворот, масштабирование или обрезка, выполняет их через RGA [2], затем передаёт результат следующему плагину.

#### 5.1.2 Основные свойства

rotation: угол поворота 0°, 90°, 180° или 270°. width: 0 отключает масштабирование. height: 0 отключает масштабирование. crop-rectangle: область &lt;x, y, w, h&gt; — начиная с &lt;x, y&gt; вырезается изображение w*h для следующего плагина. Масштабирование выполняется раньше обрезки, поэтому координаты обрезки рассчитываются по уже масштабированным размерам. На схеме показана обработка при crop-rectangle='&lt;1920,0,1920,1080&gt;' width=3840 height=1080.

![Руководство пользователя Rockchip Linux GStreamer](/docs/rockchip-linux-gstreamer/assets/en-p030-figure-01.png)

arm-afbc: ARM Frame Buffer Compression, по умолчанию выключено. Некоторые платформы, например RK3399, не поддерживают AFBC. Включение снижает нагрузку на пропускную способность DDR и заметно ускоряет декодирование на некоторых чипах. format: выходной формат; при значении, отличном от 0-"auto", выполняется преобразование. fast-mode: быстрый режим MPP, включён по умолчанию. Например, на RK3588 часть операций декодирования выполняется параллельно. ignore-error: игнорирует ошибки декодера MPP и принудительно выдаёт декодированный кадр; включено по умолчанию.

### 5.2 gstmppenc

Исходники находятся в gstreamer-rockchip/gst/rockchipmpp и включают mpph264enc, mppvp8enc, mppjpegenc и другие. Далее используется пример mpph264enc.

```text
gstreamer-rockchip/gst/rockchipmpp/
├── gstmppenc.c
├── gstmppenc.h
├── gstmppjpegenc.c
├── gstmppjpegenc.h
├── gstmpph264enc.c
├── gstmpph264enc.h
……
```

#### 5.2.1 Основные функции

gst_mpp_enc_start: создаёт MPP и задаёт тип и формат кодека. gst_mpp_enc_apply_properties: настраивает свойства, например gop и bps. gst_mpp_enc_handle_frame: получает и сохраняет буфер предыдущего плагина. gst_mpp_rga_convert: при необходимости выполняет поворот и масштабирование через RGA [3] до сохранения буфера. gst_mpp_enc_loop: извлекает самый старый кадр из очереди, передаёт MPP через encode_put_frame, получает пакет через encode_get_packet и передаёт следующему плагину.

#### 5.2.2 Основные свойства

width и height: 0 отключает масштабирование. rc-mode: управление битрейтом; поддерживаются VBR, CBR и Fixed QP. bps: целевой битрейт; bps-max: максимальный; bps-min: минимальный. Все три игнорируются в режиме Fixed QP. gop: Group Of Picture, интервал между I-кадрами. 0 означает один I-кадр и остальные P-кадры; 1 — только I-кадры; 2 — последовательность I P I P I P… По умолчанию gop равен частоте кадров. level: параметр level_idc в SPS. profile: параметр profile_idc в SPS. rotation: угол 0°, 90°, 180° или 270°.

## 6. Переменные окружения

Основные переменные окружения собраны в /etc/profile.d/gst.sh. Подробные пояснения приведены в комментариях сценария.

```text
# Convert to NV12(using RGA) when output format is NV12_10.
export GST_MPP_DEC_DISABLE_NV12_10=1
# Convert to NV12(using RGA) when output format is NV16_10.
export GST_MPP_DEC_DISABLE_NV16_10=1
# Convert to NV12(using RGA) when output format is not NV12.
export GST_MPP_VIDEODEC_DEFAULT_FORMAT=NV12
# Try to use ARM AFBC to get better performance, but not work for all sinks.
export GST_MPP_VIDEODEC_DEFAULT_ARM_AFBC=1
# Preferred formats for V4L2
export GST_V4L2_PREFERRED_FOURCC=NV12:YU12:NV16:YUY2
# Preferred formats for videoconvert
export GST_VIDEO_CONVERT_PREFERRED_FORMAT=NV12:NV16:I420:YUY2
# Max resolution for v4l2src
export GST_V4L2SRC_MAX_RESOLUTION=3840x2160
# Min buffers for V4L2 plugins
export GST_V4L2_MIN_BUFS=64
# Try RGA 2D accel in videoconvert, videoscale and videoflip.
# NOTE: Might not success, and might behave different from the official plugin.
export GST_VIDEO_CONVERT_USE_RGA=1
export GST_VIDEO_FLIP_USE_RGA=1
...
```

## 7. Примеры команд

### 7.1 Воспроизведение видео

```text
gst-play-1.0 --flags=3 --videosink="fpsdisplaysink video-sink=xvimagesink signal-
fps-measurements=true text-overlay=false sync=false" --audiosink="alsasink
device=hw:0,0" test.mp4
```

### 7.2 Воспроизведение нескольких видео

```text
# Use the render-rectangle of waylandsink for different rendering positions
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,0,400,400>' &
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,500,400,400>' &
gst-launch-1.0 filesrc location=/usr/local/test.mp4 ! parsebin ! mppvideodec !
waylandsink render-rectangle='<0,1000,400,400>' &
```

### 7.3 Кодирование и предварительный просмотр

Плагин tee разветвляет захваченные камерой данные: первая ветвь поступает в mpph264enc для кодирования и затем в filesink для записи; вторая — в autovideosink для отображения. После tee следует добавить queue: буферизация предотвращает блокировку потока.

```text
gst-launch-1.0 v4l2src ! 'video/x-raw,format=NV12' ! tee name=tv ! queue !
mpph264enc ! 'video/x-h264' ! h264parse ! 'video/x-h264' ! filesink
location=/data/out.h264 tv. ! queue ! autovideosink
```

### 7.4 Разделение потоков

Некоторые плагины, например qtdemux, создают несколько выходных площадок (pad): аудио, видео и субтитры. Назначьте плагину имя, чтобы обращаться к нужному потоку. В примере qtdemux назван qt: qt.audio_0 — первый аудиопоток, qt.video_0 — первый видеопоток; они сохраняются в разные файлы. Здесь также нужен queue. Имена pad различаются у разных плагинов; проверьте их через gst-inspect либо используйте в конвейере qt. ! queue ! mppvideodec — GStreamer согласует caps со следующим плагином.

```text
gst-launch-1.0 filesrc location=test.mp4 ! qtdemux name=qt qt.audio_0 ! queue !
filesink location=audio.bin qt.video_0 ! queue ! filesink location=video.bin
```

## 8. AFBC

AFBC означает ARM Frame Buffer Compression — формат сжатия для экономии пропускной способности. Плагин mppvideodec поддерживает AFBC для H264, H265 и VP9; цветовые форматы: NV12, NV12 10bit и NV16. Включение:

```text
# Enable global AFBC，applicable to situations where mppvideodec cannot be
directly operated using some command like gst-play-1.0
export GST_MPP_VIDEODEC_DEFAULT_ARM_AFBC=1
# Enable afbc for current pipeline
gst-launch-1.0 filesrc location=/test.mp4 ! parsebin ! mppvideodec arm-afbc=true
! waylandsink
```

waylandsink и xvimagesink поддерживают отображение AFBC. Также можно использовать kmssink/rkximagesink с явно выбранной плоскостью Cluster; при этом необходима отдельная плоскость. Примеры:

```text
# GST_DEBUG=*mpp*:4 enable the log of mpp plugin, you can use the log to check if
the AFBC is enabled successfully, if "AFBC" is not printed, it may be
unsuccessfully opened or the format does not in support
GST_DEBUG=*mpp*:4 gst-play-1.0 --flags=3 --videosink=waylandsink test.mp4
GST_DEBUG=*mpp*:4 gst-play-1.0 --flags=3 --videosink="kmssink plane-id=101"
...
0:00:00.256819945 29143   0x7f70008700 INFO                  mppdec
gstmppdec.c:465:gst_mpp_dec_apply_info_change:<mppvideodec0> applying NV12(AFBC)
1920x1080 (1920x1104)
...
```

### 8.1 Выгрузка декодированных данных AFBC

Для проверки аппаратного декодирования в GStreamer можно сохранить декодированные изображения (обычно NV12 и другие форматы) следующими способами.

1. Включите журнал MPP

```text
export mpp_debug=0x400
```

В каталоге /data появятся декодированные данные, сохранённые встроенной отладочной функцией MPP. При включённом AFBC эта выгрузка не поддерживается. Без AFBC данные обычно имеют формат NV12 и просматриваются в rawplayer или другом проигрывателе необработанных данных.

2. Сохраните декодированные данные через плагин GStreamer filesink. Этот способ работает как с AFBC, так и без него. Применение:

```text
gst-launch-1.0 uridecodebin uri=file://xxx ! filesink location=xxx.yuv
```

Декодированные данные AFBC находятся в xxx.yuv. Перед просмотром в rawplayer или другом проигрывателе необработанных данных их необходимо распаковать. Команда распаковки приведена ниже; программу afbcDec следует получить у ответственного специалиста.

```text
./afbcDec filename w h format afbcmode
#eg: ./afbcDec 178_Surfa_id-26_1088x1824_z-0.bin 1088 1824 0 1
# 0=RGBA,1=NV12,2=RGB888, afbcmode 0=afbc, 1=afbc|YTR
```

afbcDec выдаёт изображения ARGB. Для проверки каждого кадра разделите файл filesink на отдельные кадры: программа распаковки обрабатывает только один кадр, тогда как выгрузка содержит все кадры видео в одном файле. Пример разделения:

```text
# GST_DEBUG view the size of each frame
GST_DEBUG=filesink:6 gst-launch-1.0 uridecodebin uri=file://xxx ! filesink
location=xxx.yuv

0:00:01.224149631 14266   0x7f7c00ab00 DEBUG  filesink
gstfilesink.c:769:gst_file_sink_flush_buffer:<filesink0> Flushing out buffer of
size 1390080
# Use the split command to split frames
split -b 1390080 -a 5 -d  xxx.yuv dump_frame
```

## 9. Субтитры

Включение субтитров может вызывать задержки. Для наложения обычно требуется извлечь изображения из видео, преобразовать их в RGB, добавить субтитры и преобразовать обратно в исходный формат перед выводом. К времени декодирования добавляется время композиции, поэтому общая частота кадров падает. Для проверки используйте gst-play-1.0 и отключите субтитры параметром --flags=3. Рекомендуется выводить субтитры отдельно от видеослоя средствами, например, QT.

## 10. Назначение слоёв

rkximagesink и kmssink требуют отдельного аппаратного слоя. Плагин выбирает слой автоматически, но выбор может не соответствовать требованиям. В таком случае задайте слой вручную:

```text
gst-play-1.0 --flags=3 test.mp4 --videosink="kmssink plane-id=117"
```

117 — ID целевого слоя; его можно проверить в /sys/kernel/debug/dri/0/state. Следующая команда выводит все слои:

```text
root@linaro-alip:/# cat /sys/kernel/debug/dri/0/state | grep "plane\["
plane[57]: Smart1-win0
plane[71]: Cluster1-win0
plane[87]: Smart0-win0
plane[101]: Cluster0-win0
plane[117]: Esmart1-win0
plane[131]: Esmart0-win0
# You can also use cat /sys/kernel/debug/dri/0/state directly to list complete
information
```

plane[xx] указывает plane-id. Разные слои обычно поддерживают разные форматы: например, Cluster поддерживает AFBC, а Esmart — нет. Подробности см. в datasheet или TRM. Если узел отсутствует, используйте modetest -p.

## 11. Анализ конвейера GStreamer

GStreamer позволяет сохранять состояние конвейера в файлы dot для анализа. Команды:

```text
# Execute thess cmds in DUT
# Enable dump dot files
$ export GST_DEBUG_DUMP_DOT_DIR=/tmp
# Run your tests
$ gst-play-1.0 test.mp4
# Check if the dot files are dumped successfully
$ ls -alF /tmp/*.dot
-rw-rw-r-- 1 root root 49141 1  16 10:35 /tmp/0.00.00.385340438-gst-play.async-
done.dot
# Execute thess cmds in PC
$ adb pull /tmp/0.00.00.385340438-gst-play.async-done.dot .
$ dot 0.00.00.385340438-gst-play.async-done.dot -Tpng > out.png
```

out.png показывает общее состояние конвейера GStreamer. В каталоге dot может быть несколько файлов, соответствующих разным моментам времени; преобразуйте их по очереди для анализа. Команда dot входит в пакет graphviz: https://www.graphviz.org/download/.

## 12. Частые вопросы

### 12.1 При 4K 30FPS задержек нет, но они появляются при воспроизведении 4K 60FPS

Из-за нагрузки системы, пропускной способности DDR и других факторов 4K 60FPS может быть недостижимо. Попробуйте AFBC, как описано в соответствующей главе. Также можно отключить субтитры и синхронизацию выходного элемента: gst-play-1.0 test.mp4 --flags=3 --videosink="waylandsink sync=false". Если частота ниже 60FPS, включённый sync приводит к рассогласованию временных меток кадров и часов, вызывая заметные пропуски кадров.

### 12.2 Некоторые источники воспроизводятся с задержками, при этом загрузка CPU очень высока

В этом разделе исходника для аппаратного декодирования перечислены H264, H265, VP8, VP9 и MPEG. Включите DEBUG командой echo 0x100 &gt; /sys/module/rk_vcodec/parameters/mpp_dev_debug и проверьте сообщения декодирования в последовательном порту или dmesg. Если сообщений нет, формат может не поддерживаться аппаратным декодером.

### 12.3 Некоторые источники не воспроизводятся, журнал останавливается, прогресс не выводится или остаётся равным 0

Попробуйте playbin3: gst-play-1.0 --flags=3 --use-playbin3 test.mp4.

### 12.4 Мерцание при воспроизведении 4K после включения AFBC

Сначала включите режим производительности: `echo performance | tee $(find /sys/ -name *governor)`. Затем проверьте, нет ли значительного масштабирования по вертикали, например при выводе горизонтального видео на вертикальный экран. В таком случае производительность с AFBC ниже, чем без AFBC.

### 12.5 Изображение есть, звука нет

Укажите audiosink вручную, например gst-play-1.0 --flags=3 test.mp4 --audiosink="alsasink device=hw:0,0". Сначала рекомендуется проверить звук базовым инструментом, например aplay, затем GStreamer.

### 12.6 При запуске распаковщика afbcDec сообщается об отсутствии библиотеки libgraphic_lsf.so

Получите libgraphic_lsf.so у ответственного специалиста и скопируйте отсутствующую библиотеку в /usr/lib/.

### 12.7 Пропуски кадров v4l2src

1. Включите режим производительности: `echo performance | tee $(find /sys/ -name *governor)`.

2. Измерьте частоту кадров с помощью v4l2-ctl: v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=NV12 --stream-mmap=3 --stream-skip=1 --stream-poll. Узел /dev/video0 и формат измените под свою конфигурацию.

3. Если v4l2-ctl показывает ожидаемую частоту, а v4l2src — нет, попробуйте свойство min-buffers: gst-launch-1.0 v4l2src min-buffers=64 ! video/x-raw,width=1920,height=1080,format=NV12 ! waylandsink.

4. Попробуйте добавить queue:

```text
# min-threshold-time in ns, it is 5s here
gst-launch-1.0 v4l2src ! queue max-size-buffers=0 max-size-time=0 max-size-
bytes=0 min-threshold-time=5000000000 ! autovideosink
```

5. Попробуйте задать ts-offset для выходного элемента видео:

```text
# ts-offset in ns, it is 0.5s here
gst-launch-1.0 v4l2src ! queue max-size-bytes=1000000000 max-size-buffers=0 max-
size-time=0 ! autovideosink ts-offset=500000000
```

6. Принудительно включите копирование буферов v4l2src:

```text
gst1-plugins-good $ git diff
diff --git a/sys/v4l2/gstv4l2object.c b/sys/v4l2/gstv4l2object.c
index 2fb9091b..efa94561 100644
@@ -4792,6 +4794,7 @@ gst_v4l2_object_decide_allocation (GstV4l2Object * obj,
GstQuery * query)
  /* We can't share our own pool, if it exceed V4L2 capacity */
  if (min + obj->min_buffers + 1 > VIDEO_MAX_FRAME)
    can_share_own_pool = FALSE;
+  can_share_own_pool = FALSE;

  /* select a pool */
  switch (obj->mode) {
```

### 12.8 Ошибка согласования v4l2src

Команда v4l2-ctl -d /dev/video0 --list-formats-ext выводит все форматы и разрешения; замените /dev/video0 нужным узлом. Если камера выдаёт YUV (например NV12, NV16) или RGB (например BGRA, BGRx), её данные можно передавать в videosink или videoencoder. Если она выдаёт JPEG, сначала декодируйте данные через mppjpegdec. Если формат камеры не поддерживается следующим плагином, вставьте между ними videoconvert.

### 12.9 v4l2src с HDMIIN

Для чтения HDMIIN (HDMIRX) обычно используется v4l2src, аналогично камере. Узел hdmirx можно найти командой grep '' /sys/class/video4linux/*/name.

### 12.10 v4l2src не захватывает кадры выше 4K

Ограничение задано в сценарии. Отредактируйте /etc/profile.d/gst.sh и измените export GST_V4L2SRC_MAX_RESOLUTION=3840x2160. Исходный файл в Buildroot: &lt;SDK&gt;/buildroot/package/gstreamer1/gstremaer1/gst.sh; в Debian: &lt;SDK&gt;/debian/overlay/etc/profile.d/gst.sh.

1. Здесь перечислены только форматы плагина. Поддержку конкретным чипом следует проверять по соответствующему datasheet.

В исходнике указано: на некоторых платформах, например RK3588, функция RGA работает некорректно, поэтому её использование не рекомендуется.

В исходнике указано: на некоторых платформах, например RK3588, функция RGA работает некорректно, поэтому её использование не рекомендуется.

## Сверка источников и дополнения китайской основы

- Пути Buildroot различаются: китайский — `<SDK>/buildroot/configs/rockchip/multimedia/gst/`, английский — `<SDK>/buildroot/configs/rockchip/*_gst.config`; английский также добавляет выбор `BR2_PACKAGE_GSTREAMER1_18` / `BR2_PACKAGE_GSTREAMER1_20`. Проверяйте дерево своего SDK. Патчи Debian, согласно китайскому тексту, можно получить у разработчиков, например через Redmine.
- Категории плагинов: Source, Filter и Sink. Ядро предоставляет базовые классы и определения элементов, почти не обрабатывая мультимедиа; обработку выполняют плагины. В более новом дереве GitLab ядро и библиотеки плагинов объединены как subprojects.
- Китайская глава 5 дополнительно перечисляет AV1. Английская глава 4 тоже включает AV1, а глава 5 пропускает. Проверяйте поддержку по datasheet чипа. По китайскому тексту `gop=-1` по умолчанию означает GOP по частоте кадров — один I-кадр в секунду. Поворот декодера по умолчанию 0°, width/height — 0, format — 0/auto.
- У кодера `arm-afbc` включается для входных данных AFBC. `bps`, `bps-max`, `bps-min` задают битрейт и границы; `qp-init` и JPEG `q-factor` влияют на качество и битрейт. Width/height кодера описывают входные размеры: несовпадение вызывает масштабирование RGA; поворот также применяется ко входному буферу. У декодера размеры и формат относятся к выходу. AFBC экономит пропускную способность; его могут обрабатывать поддерживающие модули, например VOP.
- `kmssrc dma-feature` выдаёт DMA-буферы; китайское описание декодера говорит о входных DMA-буферах. `framerate-limit` ограничивает частоту, `num-buffers` выдаёт EOS после заданного числа кадров. `sync-fb` синхронизируется с переключением FB, `sync-vblank` — с vblank. `crop-rectangle` задаёт обрезку; `fast-mode` ускоряет поддерживаемые платформы и форматы; `ignore-error` игнорирует ошибки MPP.
- Для кодирования необработанного YUV `filesrc blocksize` должен соответствовать кадру: стандартные 4096 обычно меньше кадра и вызывают ошибку кодера. `location` принимает абсолютный или относительный путь; `num-buffers` ограничивает число кадров. У filesink blocksize задаёт размер блока/кадра, location — путь сохранения. fakesink отбрасывает данные, например для отключения звука.
- appsrc вводит внешние данные, например после расшифровки закрытого потока приложением. appsink выводит данные, например декодированные кадры для алгоритма. Это прежде всего программные интерфейсы, а не самостоятельные средства командной строки. Их можно соединить: appsink → обработка → appsrc. Примеры: `gst-plugins-base-<version>/tests/examples/app/`.
- decodebin выбирает декодеры и отдельные пути для аудио, видео и субтитров. playbin объединяет decodebin с автоматическим выбором выходных элементов. uridecodebin объединяет decodebin с выбором источника по URI. Китайский текст перечисляет `file://`, `rtps://`, `http://`; написание `rtps://` сохранено для сверки с предполагаемым RTSP URI.
- audio-sink выбирает, например, alsasink/pulsesink; video-sink — waylandsink/kmssink; flags определяет выводимые медиаданные. videotestsrc создаёт разные форматы и разрешения. Китайский источник описывает xvimagesink и waylandsink как вывод с композицией GPU; kmssink требует отдельного аппаратного слоя. Некоторые платформы не имеют RGA — проверяйте datasheet.
- device у v4l2src выбирает узел, min-buffers — минимальную буферизацию драйвера, num-buffers — количество кадров. location у rtspsrc задаёт адрес потока; video-direction — ориентацию. Свойства connector-id, plane-id, render-rectangle, fullscreen, hdr-enable, sync-mode, layer, rotate-method и sync задают разъём, плоскость, область вывода, полный экран, HDR, режим синхронизации кадров, уровень слоя, поворот и синхронизацию с часами. signal-fps-measurements включает сигнал измерений; text-overlay накладывает частоту на изображение; video-sink у fpsdisplaysink выбирает фактический модуль вывода и передаёт ему изображения.
- Предупреждения RGA относятся к версии источника, а не ко всем современным SDK. Сохранён исходный путь `gstremaer1/gst.sh`. Китайский текст однажды пишет `mppvidedec`, английский — `mppvideodec`; сверяйте с SDK. Переносы строк PDF в командах не являются границами выполнения оболочки.

{% endraw %}
