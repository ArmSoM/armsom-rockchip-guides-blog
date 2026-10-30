---
title: "Rockchip Android libhwjpeg: JPEG-Kodierung und -Dekodierung"
description: "JPEG-Hardwareschnittstellen, synchrone und asynchrone Dekodierung, dmaBuffer und vollständige Quellbeispiele."
excerpt: "JPEG-Hardwareschnittstellen, synchrone und asynchrone Dekodierung, dmaBuffer und vollständige Quellbeispiele."
translation_key: "269-rockchip-android-libhwjpeg"
slug: "269-rockchip-android-libhwjpeg"
lang: "de"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

## Geltungsbereich und Quelle

Diese Plattformreferenz übernimmt das chinesische Dokument RK-SM-YF-E10 V1.0.0 „Rockchip Android Libhwjpeg Interface“. Die Quelle nennt Linux 4.19 und 5.10 sowie „alle Chips“; dies ist eine Quellenangabe, keine Bestätigung für sämtliche ArmSoM-Platinen. Prüfen Sie, ob das Android-BSP die passenden MPP/libhwjpeg-Implementierungen und Header enthält. Es wurden weder ArmSoM-Hardwaretests noch Codeausführungen vorgenommen. Ein englischer PDF-Text und technische Abbildungen liegen nicht vor.

| Chipumfang laut Quelle | Kernelversionen |
| --- | --- |
| Alle Chips (Quellenformulierung; BSP prüfen) | Linux-4.19, Linux-5.10 |

## 1 Überblick

Die Bibliothek libhwjpeg kapselt die JPEG-Logik von MPP (Media Process Platform) für die Hardwarekodierung und -dekodierung auf Rockchip-Plattformen. `MpiJpegEncoder` kapselt die Kodierung, `MpiJpegDecoder` die Dekodierung von Bildern oder MJPEG-Streams. Wesentliche Verzeichnisse:

- `inc`: libhwjpeg-Header.
- `src`: Implementierung.
- `test`: Testbeispiele.

Das Projekt verwendet `bp`-Builddateien und lässt sich direkt in der Android-SDK-Umgebung bauen.

## 2 MpiJpegDecoder

`MpiJpegDecoder` kapselt den JPEG-Hardwaredecoder, akzeptiert JPG-Bilder und MJPEG-Streams und unterstützt synchrone sowie asynchrone Dekodierung.

```cpp
decodePacket(char* data, size_t size, OutputFrame_t *frameOut);
decodeFile(const char *inputFile, const char *outputFile);
```

`decodePacket` und `decodeFile` arbeiten synchron und warten blockierend auf das Ergebnis. `OutputFrame_t` enthält unter anderem Breite, Höhe sowie physische und virtuelle Adresse des Ausgabeframes.

```cpp
sendpacket(char* data, size_t size);
getoutframe(OutputFrame_t *frameOut);
```

Für die asynchrone Dekodierung arbeiten `sendpacket` und `getoutframe` zusammen. Die Anwendung startet zwei Threads: einer übergibt Eingaben mit `sendpacket`, der andere holt Ausgaben asynchron mit `getoutframe` ab.

### Hinweise zum Decoder

1. Standardmäßig werden RAW-NV12-Daten ausgegeben.
2. Der Hardwaredecoder richtet YUV-Ausgaben aus. Schneiden Sie vor der Anzeige anhand der virtuellen Pufferbreite und -höhe das tatsächliche Bild aus; sonst können grüne Ränder auftreten. Die interne Beschneidung von libhwjpeg wird über die folgende Eigenschaft aktiviert.
3. `OutFrame` kapselt den ausgegebenen dmaBuffer und wird intern wiederverwendet. Geben Sie den Frame nach der Anzeige mit `deinitOutputFrame` frei.
4. Standardmäßig wird ein intern angelegter rotierender Pufferpool genutzt. Ein externer dmaBuffer fd kann über `OutputFrame_t->outputPhyAddr` in den Parametern von `decodePacket` übergeben werden.

```sh
setprop hwjpeg_dec_debug 0x10
```

### Decoderbeispiel

```cpp
MpiJpegDecoder decoder;
MpiJpegDecoder::OutputFrame_t frameOut;

memset(&frameOut, 0, sizeof(frameOut));

err = decoder.prepareDecoder();
if (!err) {
    ALOGE("failed to prepare JPEG decoder");
    goto cleanUp;
}

err = decoder.decodePacket(data, size, &frameOut);
if (!err) {
    ALOGE("failed to decode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the frameOut.
 * - frame address: frameOut.MemVirAddr
 * - frame size: frameOut.OutputSize */

/* output buffer count within limits, so release frame buffer if one
frame has been display successfully. */
decoder.deinitOutputFrame(&frameOut);

decoder.flushBuffer();
```

## 3 MpiJpegEncoder

`MpiJpegEncoder` kapselt die JPEG-Hardwarekodierung. Die wesentlichen Schnittstellen folgen.

```cpp
encodeFrame(char *data, OutputPacket_t *packetOut);
encodeFile(const char *inputFile, const char *outputFile);
```

`encodeFrame` und `encodeFile` kodieren synchron und blockierend. `OutputPacket_t` kapselt die Ausgabe einschließlich der Speicheradressinformationen.

```cpp
encode(EncInInfo *inInfo, EncOutInfo *outInfo);
```

Die Schnittstelle `encode` wurde für cameraHal entwickelt. Sie übernimmt vom Aufrufer bereitgestellte Ein- und Ausgabe-dmaBuffer-fds. Das ausgegebene JPEG enthält ein kodiertes Vorschaubild, einen APP1-EXIF-Header und zugehörige Informationen.

Die Puffer von `OutputPacket_t` werden intern wiederverwendet. Geben Sie die Ausgabe nach Abschluss der Kodierung mit `deinitOutputPacket` frei.

### Encoderbeispiel

```cpp
MpiJpegEncoder encoder;
MpiJpegEncoder::OutputPacket_t pktOut;

memset(&pktOut, 0, sizeof(pktOut));

err = encoder.prepareEncoder();
if (!err) {
    ALOGE("failed to prepare JPEG encoder");
    goto cleanUp;
}

err = encoder.updateEncodeCfg(
    720 /*width*/, 1080 /*height*/, MpiJpegEncoder::INPUT_FMT_YUV420SP);
if (!err) {
    ALOGE("failed to update encode config");
    goto cleanUp;
}

err = encoder.encodeFrame(data, &pktOut);
if (!err) {
    ALOGE("failed to encode packet");
    goto cleanUp;
}

/* TODO - Get diaplay for the PacketOut.
 * - Pakcet address: pktOut.data
 * - Pakcet size: pktOut.size */

/* output buffer count within limits, so release frame buffer if one
frame has been display successful. */
encoder.deinitOutputPacket(&pktOut);

encoder.flushBuffer();
```

## Zu prüfende Angaben der Quelle

Beide Beispiele behalten `if (!err)` und `goto cleanUp` bei, obwohl Rückgabekonvention und Bereinigungslabel im Auszug nicht definiert sind. Es handelt sich um Quellenauszüge, nicht um eigenständig kompilierbare Programme. Die Kommentarfehler `diaplay` und `Pakcet` bleiben unverändert. Prüfen Sie anhand der tatsächlichen SDK-Header, wie ein fd über `OutputFrame_t->outputPhyAddr` übergeben wird; aus dem Feldnamen allein lässt sich die Bedeutung nicht ableiten.

Offizielle Referenzen: [Rockchip MPP](https://github.com/rockchip-linux/mpp), [ArmSoM-Dokumentation](https://docs.armsom.org/).

{% endraw %}
