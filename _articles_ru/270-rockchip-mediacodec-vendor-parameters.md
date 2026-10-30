---
title: "Параметры расширений MediaCodec в Rockchip Android"
description: "Параметры расширений MediaCodec в Rockchip Android"
excerpt: "Параметры расширений MediaCodec в Rockchip Android"
translation_key: "270-rockchip-mediacodec-vendor-parameters"
slug: "270-rockchip-mediacodec-vendor-parameters"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Материал основан на китайском документе RK-SM-YF-E12 V1.0.0 и охватывает все расширения декодера и кодера. Используется Codec2 для Android 12 и новее; указаны Linux 4.19, 5.10 и 6.1. Туннельный режим дополнительно требует ядро ≥ 5.10. Формулировка «все чипы» относится к платформе и не подтверждает поддержку каждой платы ArmSoM. Сверяйте SoC, Android BSP, драйверы и интерфейсы. Аппаратная проверка не проводилась, показатели производительности взяты из исходника. Единственная техническая схема уже имеет английские подписи и сохранена во всех языках.

## 1 Расширения декодера

### 1.1 Декодирование с низкой задержкой

Быстрый внутренний разбор кадров и игнорирование порядка опорных кадров позволяют немедленно выводить изображение. Режим полезен для трансляции экрана и прямого эфира. Принцип «один вход — один выход» не подходит потокам с B-кадрами: ссылки на предыдущие и последующие кадры могут нарушить порядок вывода.

```java
mediaFormat.setInteger("low-latency", 1);
```

```cpp
c2_info("enable lowLatency, enable mpp fast-out mode");
```

Приведённый журнал подтверждает включение.

### 1.2 Мультимедийный туннель

Декодер создаёт прямой туннель к драйверу дисплея в обход Android SurfaceFlinger. Это снижает программные расходы и освобождает ресурсы при высоком битрейте и частоте кадров; для малой задержки вывод синхронизируется прямо с VOP. См. [документацию Android](https://source.android.google.cn/docs/devices/tv/multimedia-tunneling?hl=zh-cn).

#### Настройка патча

Требуется ядро ≥ 5.10. Сначала включите `rkvtunnel` в DTS платы:

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

Затем объявите возможность туннельного воспроизведения в `media_codecs.xml`. Пример RK3588 AVC адаптируйте к соответствующему чипу и декодеру.

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

#### Приложение

Перечислены режимы AUDIO_HW_SYNC, HW_AV_SYNC и REALTIME; первые два зависят от драйвера системного тюнера. Описанная реализация поддерживает только вывод в реальном времени: приоритет задержке, немедленный показ результата. Псевдокод:

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

### 1.3 Отключение проверки непрерывности H264

В конференциях и видеонаблюдении возможны потери кадров и пакетов. По умолчанию разрыв POC помечает весь GOP ошибочным, его error-кадры отбрасываются до следующего ключевого кадра. Аппаратная коррекция иногда восстанавливает небольшие потери, поэтому проверку можно отключить. Сильные потери всё равно искажают изображение. Проверка POC — стандартная процедура; отключение является явным выбором пользователя. При зависаниях из-за небольших потерь используйте настройку и проверьте журнал.

```cpp
mediaFormat.setInteger("vendor.disable-dpb-check.value", 1);
c2_info("disable poc discontinuous check");
```

## 2 Расширения кодера

### 2.1 Временное масштабируемое кодирование TSVC

SVC разделяет видео на уровни, сочетание которых задаёт качество и добавляет разрешение или плавность движения. При плохой сети декодируется базовый уровень, при хорошей — дополнительные. При ошибках разрешение и частоту кадров можно снижать по уровням; исходник заявляет устойчивость к потере 20% пакетов. Утверждение об использовании нижним уровнем информации верхнего для исправления ошибок сохранено как описание источника, без независимой проверки. SVC применяется в наблюдении и конференциях, включая Tencent Rooms и Microsoft Teams. Rockchip реализует TSVC с 2–4 уровнями; пример выбирает три. Проверяйте журнал или выходной поток.

```cpp
mediaFormat->setString("ts-schema", "android.generic.3");
c2_info("setupTemporalLayers: layers %d", layerCount);
```

### 2.2 Диапазон QP

QP изменяется от 1 до 51. Меньший QP обычно повышает качество и битрейт, больший снижает оба. Подбирайте баланс качества и размера файла. Пример задаёт 10–40 для I-кадров и 10–30 для P-кадров; проверяйте журнал или поток.

```cpp
mediaFormat->setInt32("video-qp-i-min", 10);
mediaFormat->setInt32("video-qp-i-max", 40);
mediaFormat->setInt32("video-qp-p-min", 10);
mediaFormat->setInt32("video-qp-p-max", 30);
c2_info("setupQp: qpInit %d i %d-%d p %d-%d", qpInit, iMin, iMax, pMin, pMax);
```

### 2.3 Поворот

Поддерживаются 90, 180 и 270 градусов. Пример поворачивает результат на 90 градусов по часовой стрелке; проверьте журнал.

```cpp
mediaFormat->setInt32("rotation", 90);
c2_info("setupRotation: degrees %d", degrees);
```

### 2.4 Масштабирование

Сам кодер не выполняет это масштабирование: RGA предварительно обрабатывает вход, что может немного увеличить время кодирования. Пример вывода 720P:

```cpp
mediaFormat->setInt32("vendor.input-scalar.width", 1280);
mediaFormat->setInt32("vendor.input-scalar.height", 720);
c2_info("setupBaseCodec: coding %s w %d h %d hor %d ver %d",
        toStr_Coding(mCodingType), mSize->width, mSize->height, mHorStride,
        mVerStride);
```

### 2.5 Несколько slice

В исходнике макроблок MB назван минимальной единицей H264/H265: последовательные MB образуют slice, выдающий один NALU. По умолчанию кадр занимает один slice. Slice содержит весь кадр или часть; разделение возможно по количеству MB или сумме байтов. Собственный заголовок каждого slice увеличивает битрейт при более мелком делении. Терминологию макроблоков сверяйте с реальным стандартом кодека.

Применения: (1) ограничение MTU, например пакеты 1500 байт; (2) параллельное кодирование slice многоядерными кодерами вроде RK3588; (3) меньшая область исправления и затраты при потерях сети. По умолчанию поддерживается деление по байтам:

```cpp
mediaFormat->setInt32("vendor.slice-size.value", 1500);
c2_info("setupSliceSize: slice-size %d", c2Size->value);
```

### 2.6 Повторное кодирование больших кадров

Большие кадры нагружают сеть; настройка сглаживает битрейт, но повторные попытки увеличивают время кадра. Исходник говорит «не более трёх повторов», однако код содержит `1500`. Противоречие сохранено: сверяйте SDK и не считайте это подтверждённой настройкой трёх повторов.

```cpp
mediaFormat->setInt32("vendor.reenc-times.value", 1500);
c2_info("setupReencTimes: reenc-times %d", reencTime->value);
```

### 2.7 Интеллектуальное кодирование RK3576/RK3588

Предназначено для экономии полосы и повышения качества:

- 1.0 адаптирует квантование по меж-/внутрикадровой сложности, доле ROI и границам битрейта.
- 2.0 использует больше статистики и стабильное управление битрейтом для статичных слаботекстурных сцен.
- 3.0 применяет нейросеть для определения ROI и улучшения качества.

Источник ограничивает поддержку RK3576/RK3588. Параметры MediaCodec предоставляют версии 1.0 и 2.0; заявленная экономия — 21%+, 85%+ и 90%+ для сильного движения, слабого движения и неподвижных сцен. Это не измерения ArmSoM. Пример отдаёт приоритет качеству движущейся сцены.

```cpp
mediaFormat->setInt32("vendor.super-encoding-mode.value", 1);
// 设置值：
// 1 ===== 普通运动场景，画质优先，追求更高的 psnr 和 vmaf 值
// 2 ===== 普通运动场景，码率优先，追求更高的视频压缩率
// 3 ===== IPC 相对静止场景，画质优先，追求更高的 psnr 和 vmaf 值
// 4 ===== IPC 相对静止场景，码率优先，追求更高的视频压缩率
c2_info("setupSuperMode: setup super mode %d", superMode);
```

Режимы 1/2 приоритизируют качество/битрейт для обычного движения, 3/4 — качество/битрейт для относительно неподвижной IPC-сцены. Качество означает более высокий PSNR/VMAF, приоритет битрейта — большее сжатие.

### 2.8 Сертификация протокола Microsoft MVCT

![Архитектура расширений MVCT (английская схема в китайском PDF)](/docs/rockchip-mediacodec-vendor-parameters/images/pdf-p08-1.png)

Архитектура расширений MVCT (английская схема в китайском PDF)

MVCT (Microsoft Codec Validation Tool) — часть сертификации Teams для протоколов кодеков: TSVC, длинные/короткие опорные кадры, QP каждого кадра, несколько slice, динамические битрейт и разрешение. Сертификация длительна и предъявляет требования к media, camera и audio:

1. MVCT: реализовать расширения, добавить prefix NAL и пройти полный набор тестов.
2. VCT: стресс-тест нескольких кодеков и дисплеев при нормальных производительности, загрузке CPU и памяти.
3. Аппаратная сертификация: звук, камеры, оптика и прочее.

Источник заявляет поддержку RK3588, RK3399 и PX30 и прохождение Teams соответствующими устройствами; RK3588 указан среди рекомендуемых Microsoft отечественных чипов. Это не подтверждает сертификацию изделия ArmSoM. В источнике встречается и написание MCVT; ссылка сохранена.

[Инструмент MVCT (ссылка источника)](https://install.appcenter.ms/orgs/ic3-media-platform/apps/microsoft-codec-validation-tool-mcvt/distribution_groups/external%20partners) · [Документация ArmSoM](https://docs.armsom.org/)

{% endraw %}
