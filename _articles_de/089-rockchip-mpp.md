---
title: "Rockchip MPP: Medienplattform, Codec-APIs, Speicher und Fehlersuche"
description: "Vollständige MPP-V1.4.2-Referenz zu Architektur, MPI, Speicher, Dekodierung, Kodierung, Parametertabellen, Beispielen, Build und FAQ mit Originalabbildungen und Code."
translation_key: "089-rockchip-mpp"
slug: "089-rockchip-mpp"
lang: "de"
date: "2026-10-21"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "MPP", "MPI", "codec", "Linux"]
keywords: "ArmSoM Rockchip MPP MPI H.264 H.265"
excerpt: "Vollständige MPP-V1.4.2-Referenz zu Architektur, MPI, Speicher, Dekodierung, Kodierung, Parametertabellen, Beispielen, Build und FAQ mit Originalabbildungen und Code."
---

{% raw %}

# Rockchip MPP: Medienplattform, Codec-APIs, Speicher und Fehlersuche

## Anwendbarkeit auf ArmSoM und Quelle

Dies ist eine Rockchip-Plattformreferenz, kein ArmSoM-Testbericht. Quelle ist das MPP-Entwicklerhandbuch V1.4.2 mit 53 chinesischen und 57 englischen Seiten. Chinesisch folgt dem chinesischen Original; Englisch dem englischen Original, das vollständig ins Russische und Deutsche übersetzt wurde. Chinesisch verwendet chinesische Originalabbildungen; Englisch, Russisch und Deutsch verwenden englische Originalabbildungen. Die SoC-Liste, Android/Linux-Umgebungen und Funktionen der Quelle bleiben nachfolgend erhalten. Für konkrete ArmSoM-Boards wird jedoch keine Kombination aus SDK/BSP und Kernel festgelegt. Codec-Hardware, Kerneltreiber, MPP-Version, Formatunterstützung und Build-Umgebung sind zu prüfen. Sämtliche Protokolle, Geschwindigkeiten, Bildraten und Speicherwerte sind Quellbeispiele; weder Code noch Hardwaretests wurden ausgeführt.

Redaktioneller Hinweis: Dies sind beibehaltene Quellbeispiele, keine geprüfte, unmittelbar ausführbare Korrekturfassung. Die Quelle enthält widersprüchliche Plattform-/Formatlisten, verdächtige Zeichen in Aufzählungen und fragliche Parameterbeschreibungen. Vor dem Kopieren von Befehlen oder Konfigurationen die redaktionellen Hinweise und das tatsächliche SDK prüfen.

[EDITORIAL-NOTES](/docs/rockchip-mpp/EDITORIAL-NOTES.md) · [ArmSoM Documentation](https://docs.armsom.org/)


<!-- source: EN PDF p6; unit 0 -->

## 1\. Einführung in MPP

<!-- source: EN PDF p6; unit 1 -->

### 1.1 Übersicht

<!-- source: EN PDF p6; unit 2 -->

Die Media Process Platform (MPP) von Rockchip ist eine allgemeine Medienverarbeitungsplattform für Rockchip-Chips. Sie verbirgt die komplexe chipspezifische Verarbeitung auf niedriger Ebene vor Anwendungen, gleicht Unterschiede zwischen Chips aus und bietet eine einheitliche Media Process Interface (MPI). MPP stellt folgende Funktionen bereit:

<!-- source: EN PDF p6; unit 3 -->

Videodekodierung

<!-- source: EN PDF p6; unit 4 -->

H.265/H.264/H.263/AV1/VP9/VP8/AVS2/AVS/AVS+ /MPEG-4/MPEG-2/MPEG-1/VC1/MJPEG

<!-- source: EN PDF p6; unit 5 -->

Videokodierung

<!-- source: EN PDF p6; unit 6 -->

H.265/H.264/VP8/MJPEG

<!-- source: EN PDF p6; unit 7 -->

Videoverarbeitung

<!-- source: EN PDF p6; unit 8 -->

Kopieren und Skalieren von Video, Farbraumkonvertierung und Deinterlacing

<!-- source: EN PDF p6; unit 9 -->

### 1.2 Systemarchitektur

<!-- source: EN PDF p6; unit 10 -->

Die Einordnung der MPP-Plattform in die Systemarchitektur zeigt die folgende Abbildung:

<!-- source: EN PDF p7; unit 11 -->

![Original-Technikabbildung, englisches PDF, Seite 7](/docs/rockchip-mpp/assets/en-p007-figure-01.png)

<!-- source: EN PDF p7; unit 12 -->

Abbildung 1: MPP-Systemarchitektur

<!-- source: EN PDF p7; unit 13 -->

Hardwareebene

<!-- source: EN PDF p7; unit 14 -->

Die Hardwareebene umfasst Rockchip-Beschleuniger für Videokodierung und -dekodierung, darunter vdpu, vepu, rkvdec, rkvenc und weitere Hardwareblöcke mit unterschiedlichen Funktionen.

<!-- source: EN PDF p7; unit 15 -->

Kerneltreiberebene

<!-- source: EN PDF p7; unit 16 -->

Der Linux-Kerneltreiber der Codec-Hardware umfasst den Gerätetreiber sowie zugehörige MMU-, Speicher-, Takt- und Energieverwaltungsmodule. Hauptsächlich unterstützt werden die Linux-Kernelversionen 3.10, 4.4, 4.19, 5.10 und 6.1. Die MPP-Bibliotheken hängen von den Kerneltreibern ab.

<!-- source: EN PDF p7; unit 17 -->

MPP-Ebene

<!-- source: EN PDF p7; unit 18 -->

MPP im Benutzerraum verbirgt Unterschiede zwischen Betriebssystemen und Chipplattformen und stellt der darüberliegenden Anwendung eine einheitliche MPI bereit. Die MPP-Ebene umfasst MPI, OSAL, HAL, Video Decoder / Video Encoder und Video Processing.

<!-- source: EN PDF p7; unit 19 -->

Betriebssystemebene

<!-- source: EN PDF p7; unit 20 -->

Ausführungsplattformen von MPP im Benutzerraum sind Android und Linux-Distributionen wie Debian.

<!-- source: EN PDF p7; unit 21 -->

Anwendungsebene

<!-- source: EN PDF p7; unit 22 -->

Über MPI lässt sich MPP an Middleware wie OpenMax, ffmpeg und gstreamer anbinden oder direkt von der übergeordneten Benutzeranwendung aufrufen.

<!-- source: EN PDF p8; unit 23 -->

### 1.3 Unterstützte Plattformen

<!-- source: EN PDF p8; unit 24 -->

#### 1.3.1 Softwareplattformen

<!-- source: EN PDF p8; unit 25 -->

MPP unterstützt unterschiedliche Android-Versionen und reine Linux-Plattformen.

<!-- source: EN PDF p8; unit 26 -->

Unterstützt werden die Rockchip-Linux-Kernel 3.10, 4.4, 4.19 und 5.10; Voraussetzung sind der Gerätetreiber vcodec_service und die passende DTS-Konfiguration.

<!-- source: EN PDF p8; unit 27 -->

#### 1.3.2 Hardwareplattformen

<!-- source: EN PDF p8; unit 28 -->

Unterstützt werden folgende verbreitete Rockchip-Chipfamilien:

<!-- source: EN PDF p8; unit 29 -->

Familien RK3288, RK3368, RK3399, RK3588

<!-- source: EN PDF p8; unit 30 -->

Familien RK30xx, RK312x, RK322x, RK332x

<!-- source: EN PDF p8; unit 31 -->

Familien RV1109/RV1126 (Hinweis: Die Unterstützung für RV1107/RV1108 wird schrittweise eingestellt)

<!-- source: EN PDF p8; unit 32 -->

### 1.4 Unterstützte Funktionen

<!-- source: EN PDF p8; unit 33 -->

Die Kodier- und Dekodierfunktionen von MPP unterscheiden sich je nach Chipplattform erheblich. Siehe dazu den Multimedia Benchmark des jeweiligen Chips.

<!-- source: EN PDF p8; unit 34 -->

### 1.5 Hinweise

<!-- source: EN PDF p8; unit 35 -->

Für einen schnellen Einstieg in MPP und die Beispiele siehe Kapitel 4 mit den MPP-Demoprogrammen.

<!-- source: EN PDF p8; unit 36 -->

Für einen schnellen Einstieg in Kompilierung und Nutzung von MPP siehe Kapitel 5. Einzelheiten zum Aufbau und zu den Entwurfsprinzipien stehen in readme.txt im MPP-Quellverzeichnis, den Textdokumenten unter doc und den Kommentaren der Headerdateien.

<!-- source: EN PDF p8; unit 37 -->

## 2\. Schnittstellenentwurf

<!-- source: EN PDF p8; unit 38 -->

Dieses Kapitel beschreibt die unmittelbar für MPP-Anwender sichtbaren Datenstrukturen und ihre Verwendung.

<!-- source: EN PDF p8; unit 39 -->

Videokodierung, -dekodierung und -verarbeitung erfordern umfangreichen Austausch von Bitstrom-, Bild- und Speicherdaten sowie die Zusammenarbeit zwischen Anwendung und Kerneltreiber. Deshalb stellt MPP die MPI für den übergeordneten Anwendungsteil bereit. Dieses Kapitel erläutert ihre Datenstrukturen und Entwurfsprinzipien.

<!-- source: EN PDF p9; unit 40 -->

### 2.1 Übersicht der Schnittstellenstrukturen

<!-- source: EN PDF p9; unit 41 -->

Die folgende Abbildung zeigt die wichtigsten Datenstrukturen der MPI:

<!-- source: EN PDF p9; unit 42 -->

![Original-Technikabbildung, englisches PDF, Seite 9](/docs/rockchip-mpp/assets/en-p009-figure-01.png)

<!-- source: EN PDF p9; unit 43 -->

Abbildung 2: Datenstrukturen der MPI

<!-- source: EN PDF p9; unit 44 -->

MppMem kapselt mit malloc aus der C-Bibliothek zugewiesenen Speicher.

<!-- source: EN PDF p9; unit 45 -->

MppBuffer kapselt dmabuf-Speicher für die Hardware.

<!-- source: EN PDF p9; unit 46 -->

MppPacket kapselt einen eindimensionalen Puffer, der aus MppMem und MapBuffer erzeugt werden kann. Er dient hauptsächlich zur Darstellung von Bitstromdaten. Die Bezeichnung MapBuffer stammt aus der Vorlage.

<!-- source: EN PDF p9; unit 47 -->

MppFrame kapselt zweidimensionale Bilddaten, die aus MppMem und MapBuffer erzeugt werden können, und dient hauptsächlich zur Bilddarstellung. Die Bezeichnung MapBuffer stammt aus der Vorlage.

<!-- source: EN PDF p9; unit 48 -->

Mit MppPacket und MapFrame lässt sich allgemeine Videokodierung und -dekodierung einfach und effizient umsetzen (MapFrame ist die Schreibweise der Vorlage).

<!-- source: EN PDF p9; unit 49 -->

Beim Dekodieren werden beispielsweise Adresse und Größe des Eingangsbitstroms an MppPacket übergeben. Die Eingabe erfolgt über put_packet; am Ausgang wird das Bild als MppFrame über get_frame abgeholt. Dies bildet den einfachsten Videodekodierablauf.

<!-- source: EN PDF p10; unit 50 -->

![Original-Technikabbildung, englisches PDF, Seite 10](/docs/rockchip-mpp/assets/en-p010-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
Input thread:

Allocate input stream memory;
Initialize MppPacket pkt;

While (!EOF) {
    Read file to pkt;
    Setup pkt valid length;
    Setup pkt EOS flag;

RESEND_PKT:
    ret = decode_put_packet(pkt);
    IF (ret == NOT_OK)
        Wait and goto RESEND_PKT;
}
Deinitialize pkt;
Release input stream memory;

Output thread:

MppFrame frm;

While (!EOS) {
    ret = decode_get_frame(&frm);
    IF (ret == OK && frm != NULL) {
        Write frm to file or display frm;
        Read EOS flag from frm;
        Release frm;
    }
}
```

<!-- source: EN PDF p10; unit 51 -->

Abbildung 3: Videodekodierung über die einfache Schnittstelle

<!-- source: EN PDF p10; unit 52 -->

MppMeta und MPTask sind erweiterte kombinierte Schnittstellen für Ein-/Ausgabeaufgaben und komplexe Anwendungsfälle, etwa vorgegebene Ein- und Ausgabemodi. Sie werden nur gelegentlich benötigt.

<!-- source: EN PDF p10; unit 53 -->

Hinweis: Für Erweiterbarkeit und Vorwärtskompatibilität werden die genannten Schnittstellenstrukturen über void*handle referenziert. Der Zugriff auf ihre Mitglieder erfolgt über Schnittstellen wie mpp_xxx_set/get_xxx.

<!-- source: EN PDF p10; unit 54 -->

### 2.2 Speicherstruktur MppBuffer

<!-- source: EN PDF p10; unit 55 -->

MppBuffer beschreibt Speicherblöcke für die Hardware und bietet Speicherzuweisung und -freigabe sowie Erhöhen und Verringern des Referenzzählers. Unterstützt werden ion/drm-Allokatoren. Wichtige Parameter:

<!-- source: EN PDF p10; unit 56 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| ptr | void * | Virtuelle Adresse des Speicherblocks. |
| size | size_t | Größe des Speicherblocks. |
| fd | int | Dateideskriptor des Speicherblocks im Benutzerraum. |

<!-- source: EN PDF p10; unit 57 -->

Beim Dekodieren werden Bildpuffer üblicherweise in einem festen Pufferpool wiederverwendet. Dafür definiert MPP MppBufferGroup auf Grundlage von MppBuffer. Es gibt die folgenden zwei Verwendungsarten:

<!-- source: EN PDF p11; unit 58 -->

![Original-Technikabbildung, englisches PDF, Seite 11](/docs/rockchip-mpp/assets/en-p011-figure-01.png)

<!-- source: EN PDF p11; unit 59 -->

Abbildung 4: Normale Verwendung von MppBuffer

<!-- source: EN PDF p11; unit 60 -->

Pseudocode des Ablaufs:

<!-- source: EN PDF p11; unit 61 -->

![Original-Technikabbildung, englisches PDF, Seite 11](/docs/rockchip-mpp/assets/en-p011-figure-02.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
MppBuffer normal usage

MppBufferGroup group = NULL;

// Acquire buffer pool and limit buffer size and buffer count
mpp_buffer_group_get_internal(&group, type);
mpp_buffer_group_limit_config(group, size, count);

// Configure buffer pool to decoder, let decoder get buffer from
// buffer pool to decode.
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding process
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p12; unit 62 -->

Dieses Verfahren ermöglicht eine Zero-Copy-Ausgabe des Dekoders: Der ausgegebene Frame entspricht dem intern verwendeten Referenzframe. Eine Zero-Copy-Anzeige ist jedoch schwieriger, da der ausgegebene Frame eventuell nicht direkt angezeigt werden kann. Außerdem muss der Anwender den Speicherbedarf des Dekoders kennen.

<!-- source: EN PDF p12; unit 63 -->

Eine weitere Möglichkeit besteht darin, MppBufferGroup ausschließlich als Verwaltung für extern importierte Puffer zu verwenden. Der Ablauf ist nachfolgend dargestellt:

<!-- source: EN PDF p12; unit 64 -->

![Original-Technikabbildung, englisches PDF, Seite 12](/docs/rockchip-mpp/assets/en-p012-figure-01.png)

<!-- source: EN PDF p12; unit 65 -->

Abbildung 5: Externer Import mit MppBuffer

<!-- source: EN PDF p12; unit 66 -->

Der Pseudocode des Ablaufs folgt:

<!-- source: EN PDF p13; unit 67 -->

![Original-Technikabbildung, englisches PDF, Seite 13](/docs/rockchip-mpp/assets/en-p013-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
MppBuffer usage of import external buffer (Zero-copy display)

MppBufferGroup group = NULL;
MppBufferInfo info[16];

// Acquire the buffer pool.
mpp_buffer_group_get_external(&group, type);

// import extern buffer to the buffer pool
mpp_buffer_commit(group, &info[0]);
mpp_buffer_commit(group, &info[1]);
...
...

// Configure buffer pool to decoder let decoder get buffer to
// decode from buffer pool
mpi->control(dec, MPP_DEC_SET_EXT_BUF_GROUP, group);

// Start decoding procedural.
while (!end_of_decoding) {
    {   // MPP decoder behave is within brackets.
        // MPP decoder uses buffer data.
        MppBuffer buffer_in_mpp_decoder;
        // Decoder get buffer from buffer pool internally.
        mpp_buffer_get(group, &buffer_in_mpp_decoder);
        // Decode image data to buffer.
        ...
    }
    mpi->decode_get_frame(&frame);
    // Output MppBuffer to external user
    MppBuffer buffer_of_user = mpp_frame_get_buffer(frame);
    // Process to image pixel data
    ......
    // User release reference of MppBuffer and MppFrame
    mpp_buffer_put(buffer_of_user);
    mpp_frame_deinit(frame);
}

// Release buffer pool
mpp_buffer_group_put(group);
```

<!-- source: EN PDF p13; unit 68 -->

Dieser Ablauf ermöglicht externe Dekoderpuffer, die Anbindung an OpenMax/ffmpeg/gstreamer und die einfache Integration in Benutzeranwendungen. Auch eine Zero-Copy-Anzeige lässt sich damit leichter umsetzen.

<!-- source: EN PDF p13; unit 69 -->

### 2.3 Bitstromstruktur MppPacket

<!-- source: EN PDF p13; unit 70 -->

MppPacket beschreibt eindimensionale Bitstromdaten, insbesondere Position und Länge der gültigen Daten. Wichtige Parameter sind nachfolgend aufgeführt:

<!-- source: EN PDF p14; unit 71 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| data | void * | Anfangsadresse des Pufferbereichs. |
| size | size_t | Größe des Pufferbereichs. |
| pos | void * | Anfangsadresse gültiger Daten im Pufferbereich. |
| length | size_t | Länge gültiger Daten im Pufferbereich.<br>Wird die Länge nach dem Aufruf von decode_put_packet zu 0, wurde der Paketdatenstrom verbraucht. |

<!-- source: EN PDF p14; unit 72 -->

Der Zusammenhang der Parameter ist nachfolgend dargestellt:

<!-- source: EN PDF p14; unit 73 -->

![Original-Technikabbildung, englisches PDF, Seite 14](/docs/rockchip-mpp/assets/en-p014-figure-01.png)

<!-- source: EN PDF p14; unit 74 -->

Abbildung 6: Wichtige Parameter von MppPacket

<!-- source: EN PDF p14; unit 75 -->

Weitere Konfigurationsparameter von MppPacket:

<!-- source: EN PDF p14; unit 76 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| pts | RK_U64 | Zeitstempel der Darstellung (Present Time Stamp). |
| dts | RK_U64 | Zeitstempel der Dekodierung (Decoding Time Stamp). |
| eos | RK_U32 | Kennzeichen für das Datenstromende (End Of Stream). |
| buffer | MppBuffer | Mit MppPacket verknüpfter MppBuffer. |
| flag | RK_U32 | Intern in MPP verwendete Flag-Bits, einschließlich:<br>#define MPP_PACKET_FLAG_EOS (0x00000001)<br>#define MPP_PACKET_FLAG_EXTRA_DATA (0x00000002)<br>#define MPP_PACKET_FLAG_INTERNAL (0x00000004)<br>#define MPP_PACKET_FLAG_INTRA (0x00000008) |

<!-- source: EN PDF p14; unit 77 -->

MppPacket beschreibt eindimensionalen Speicher und muss mit bereits zugewiesenem Speicher oder MppBuffer-Speicher initialisiert werden. Bei der Freigabe sind folgende Fälle zu unterscheiden:

<!-- source: EN PDF p14; unit 78 -->

Wird MppPacket mit einer externen malloc-Adresse konfiguriert, wird dieser Speicher nicht freigegeben. Beispiel:

<!-- source: EN PDF p15; unit 79 -->

![Original-Technikabbildung, englisches PDF, Seite 15](/docs/rockchip-mpp/assets/en-p015-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
void *data = malloc(size);
MppPacket pkt = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_deinit(&pkt); // <<-- NOT release data

free(data);
```

<!-- source: EN PDF p15; unit 80 -->

Wird MppPacket durch copy_init erzeugt, wird der während des Kopierens zugewiesene Speicher laut Vorlagentext nach Abschluss des Kopierens freigegeben. Beispiel:

<!-- source: EN PDF p15; unit 81 -->

![Original-Technikabbildung, englisches PDF, Seite 15](/docs/rockchip-mpp/assets/en-p015-figure-02.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
void *data = malloc(size);
MppPacket pkt = NULL;
MppPacket pkt_copy = NULL;

mpp_packet_init(&pkt, data, size);
mpp_packet_copy_init(&pkt_copy, pkt);

mpp_packet_deinit(&pkt); // <<-- NOT release data
mpp_packet_deinit(&pkt_copy); // <<-- release allocated memory

free(data);
```

<!-- source: EN PDF p15; unit 82 -->

Wird MppPacket aus MppBuffer erzeugt, erhält MppBuffer beim Erzeugen eine zusätzliche Referenz; beim Freigeben von MppPacket wird diese Referenz entfernt.

<!-- source: EN PDF p15; unit 83 -->

![Original-Technikabbildung, englisches PDF, Seite 15](/docs/rockchip-mpp/assets/en-p015-figure-03.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
MppBuffer buffer;
MppPacket pkt = NULL;

mpp_buffer_get(NULL, &buffer, size);

mpp_packet_init_with_buffer(&pkt, buffer); // <<-- Auto increase reference

mpp_packet_deinit(&pkt); // <<-- Auto decrease reference
mpp_buffer_put(buffer);
```

<!-- source: EN PDF p15; unit 84 -->

### 2.4 Bildstruktur MppFrame

<!-- source: EN PDF p15; unit 85 -->

MppFrame beschreibt einen zweidimensionalen Bildpuffer sowie Position und Länge der gültigen Daten. Wichtige Parameter:

<!-- source: EN PDF p16; unit 86 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| width | RK_U32 | Anzahl der Pixel in horizontaler Richtung, in Pixeln. |
| height | RK_U32 | Anzahl der Pixel in vertikaler Richtung, in Pixeln. |
| hor_stride | RK_U32 | Abstand zwischen zwei benachbarten Zeilen in vertikaler Richtung, in Bytes. |
| ver_stride | RK_U32 | Anzahl der Zeilenabstände zwischen Bildkomponenten; Einheit: 1. |

<!-- source: EN PDF p16; unit 87 -->

![Original-Technikabbildung, englisches PDF, Seite 16](/docs/rockchip-mpp/assets/en-p016-figure-01.png)

<!-- source: EN PDF p16; unit 88 -->

Abbildung 7: Wichtige Parameter von MppFrame

<!-- source: EN PDF p16; unit 89 -->

Weitere Konfigurationsparameter von MppFrame:

<!-- source: EN PDF p17; unit 90 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| mode | RK_U32 | Bilddaten-Eigenschaften für Frame/Feld: |
| pts | RK_U64 | Darstellungszeitstempel des Bildes (Present Time Stamp). |
| dts | RK_U64 | Dekodierungszeitstempel des Bildes (Decoding Time Stamp). |
| eos | RK_U32 | Kennzeichen für das Ende des Bilddatenstroms (End Of Stream). |
| errinfo | RK_U32 | Bildfehlerkennzeichen: ob im Bild ein Dekodierungsfehler vorliegt. |
| discard | RK_U32 | Verwerfungskennzeichen des Bildes. Erfüllen die Referenzbeziehungen bei der Bilddekodierung die Anforderungen nicht, wird das Bild zum Verwerfen ohne Anzeige markiert. |
| buf_size | size_t | Größe des für das Bild zu allokierenden Puffers; abhängig vom Bildformat und vom Format der dekodierten Daten. |
| info_change | RK_U32 | Bei einem wahren Wert ist der aktuelle MppFrame eine beschreibende Struktur für Änderungen der Bitstrominformationen: Breite, Höhe, Stride oder Bildformat. Mögliche Ursachen von info_change:<br>1. Änderung der Breite und Höhe der Bildfolge.<br>2. Änderung des Bildfolgenformats, etwa von 8 Bit auf 10 Bit.<br>Nach info_change muss der vom Decoder verwendete Speicherpool neu allokiert werden. |

<!-- source: EN PDF p17; unit 91 -->

![Original-Technikabbildung, englisches PDF, Seite 17](/docs/rockchip-mpp/assets/en-p017-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
/*
 * bit definition for mode flag in MppFrame
 */
/* progressive frame */
#define MPP_FRAME_FLAG_FRAME          (0x00000000)
/* top field only */
#define MPP_FRAME_FLAG_TOP_FIELD      (0x00000001)
/* bottom field only */
#define MPP_FRAME_FLAG_BOT_FIELD      (0x00000002)
/* paired field */
#define MPP_FRAME_FLAG_PAIRED_FIELD   (MPP_FRAME_FLAG_TOP_FIELD|MPP_FRAME_FLAG_BOT_FIELD)
/* paired field with field order of top first */
#define MPP_FRAME_FLAG_TOP_FIRST      (0x00000004)
/* paired field with field order of bottom first */
#define MPP_FRAME_FLAG_BOT_FIRST      (0x00000008)
/* paired field with unknown field order (MBAFF) */
#define MPP_FRAME_FLAG_DEINTERLACED    (MPP_FRAME_FLAG_TOP_FIRST|MPP_FRAME_FLAG_BOT_FIRST)
#define MPP_FRAME_FLAG_FIELD_ORDER_MASK (0x0000000C)
// for multi-view stream
#define MPP_FRAME_FLAG_VIEW_ID_MASK   (0x000000f0)
```

<!-- source: EN PDF p18; unit 92 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| fmt | MppFrameFormat | Farbraumformat und Speicheranordnung des Bildes: |
| color_range | MppFrameColorRange | Farbraumbereich der Bilddaten:<br>Voller YUV-Bereich: 0 ~ 255 (8 Bit)<br>Begrenzter YUV-Bereich: 16 ~ 235 (8 Bit) |
| buffer | MppBuffer | Dem MppFrame entsprechender MppBuffer. |

<!-- source: EN PDF p18; unit 93 -->

![Original-Technikabbildung, englisches PDF, Seite 18](/docs/rockchip-mpp/assets/en-p018-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum {
    MPP_FMT_YUV420SP       = MPP_FRAME_FMT_YUV,       /* YYYY... UV... (NV12)    */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT,
    MPP_FMT_YUV422SP,                                 /* YYYY... UVUV... (NV24)  */
    MPP_FMT_YUV422SP_10BIT,                            ///< Not part of ABI
    MPP_FMT_YUV420P,                                  /* YYYY... U...V... (I420) */
    MPP_FMT_YUV420SP_VU,                               /* YYYY... VUVUVU... (NV21) */
    MPP_FMT_YUV422P,                                  /* YYYY... UU...VV... (422P) */
    MPP_FMT_YUV422SP_VU,                               /* YYYY... VUVUVU... (NV42) */
    MPP_FMT_YUV422_YUYV,                               /* YUYVYUYV... (YUY2)      */
    MPP_FMT_YUV422_UYVY,                               /* UYVYUYVY... (UYVY)      */
    MPP_FMT_YUV400SP,                                  /* YYYY...                 */
    MPP_FMT_YUV440SP,                                  /* YYYY... UVUV...         */
    MPP_FMT_YUV411SP,                                  /* YYYY... UV...           */
    MPP_FMT_YUV444SP,                                  /* YYYY... UVUVUVUV...     */
    MPP_FMT_YUV_BUTT,
    MPP_FMT_RGB565        = MPP_FRAME_FMT_RGB,         /* 16-bit RGB              */
    MPP_FMT_BGR565,                                    /* 16-bit RGB              */
    MPP_FMT_RGB555,                                    /* 15-bit RGB              */
    MPP_FMT_BGR555,                                    /* 15-bit RGB              */
    MPP_FMT_RGB444,                                    /* 12-bit RGB              */
    MPP_FMT_BGR444,                                    /* 12-bit RGB              */
    MPP_FMT_RGB888,                                    /* 24-bit RGB              */
    MPP_FMT_BGR888,                                    /* 24-bit RGB              */
    MPP_FMT_RGB101010,                                 /* 30-bit RGB              */
    MPP_FMT_BGR101010,                                 /* 30-bit RGB              */
    MPP_FMT_ARGB8888,                                  /* 32-bit RGB              */
    MPP_FMT_ABGR8888,                                  /* 32-bit RGB              */
    MPP_FMT_RGB_BUTT,
    /* similar to I420, but Pixels are grouped in macroblocks of 8x4 size */
    MPP_FMT_YUV420_8Z4    = MPP_FRAME_FMT_COMPLEX,
    /* The end of these formats have a complex layout */
    MPP_FMT_COMPLEX_BUTT,
    MPP_FMT_BUTT         = MPP_FMT_COMPLEX_BUTT,
} ? end MppFrameFormat ? MppFrameFormat;
```

<!-- source: EN PDF p18; unit 94 -->

![Original-Technikabbildung, englisches PDF, Seite 18](/docs/rockchip-mpp/assets/en-p018-figure-02.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p18; unit 95 -->

Für den Dekoder ist MppFrame die Ausgabestruktur. Sie übermittelt dem Aufrufer dekodierte Informationen einschließlich Pixeldaten, pts, Fehlerdaten und weiterer Angaben. PTS/DTS und EOS werden vom zugehörigen Eingangs-MppPacket übernommen.

<!-- source: EN PDF p18; unit 96 -->

Ändert sich die Auflösung des Eingangsbitstroms, wird info_change in MppFrame gesetzt. Der Anwender erhält ein info_change-Ereignis und muss den Pufferpool anpassen.

<!-- source: EN PDF p18; unit 97 -->

### 2.5 Erweiterte Aufgabenstruktur MppTask

<!-- source: EN PDF p18; unit 98 -->

Reichen MppPacket und MppFrame nicht aus, dient MppTask als Datencontainer für komplexere Ein-/Ausgabeanforderungen. MppTask wird zusammen mit poll/dequeuer/enqueue verwendet. Gegenüber einfachen Ablaufschnittstellen wie put_packet/get_frame ist der Ablauf komplexer und weniger effizient; dies ist der Preis für die zusätzlichen Möglichkeiten.

<!-- source: EN PDF p19; unit 99 -->

![Original-Technikabbildung, englisches PDF, Seite 19](/docs/rockchip-mpp/assets/en-p019-figure-01.png)

<!-- source: EN PDF p19; unit 100 -->

Abbildung 8: Ein- und Ausgabe mit MppTask

<!-- source: EN PDF p19; unit 101 -->

MppTask lässt sich durch Schlüsselwerte vom Typ MppMetaKey erweitern. Zusätzliche Datentypen ermöglichen komplexe Anforderungen höherer Ebenen. Auf die Daten der verschiedenen Schlüssel wird über mpp_task_meta_set/get_xxx zugegriffen.

<!-- source: EN PDF p19; unit 102 -->

![Original-Technikabbildung, englisches PDF, Seite 19](/docs/rockchip-mpp/assets/en-p019-figure-02.png)

<!-- source: EN PDF p19; unit 103 -->

Abbildung 9: Unterstützte Daten- und Schlüsseltypen von MppTask

<!-- source: EN PDF p19; unit 104 -->

In der Praxis wird MppTask zunächst über dequeue vom MPP-Eingangsport abgeholt, mit mpp_task_meta_set_xxx befüllt und per enqueue zur Verarbeitung an die MPP-Instanz übergeben. Der Ausgangsport arbeitet entsprechend; zum Auslesen werden jedoch mpp_task_meta_get_xxx statt mpp_task_meta_set_xxx verwendet.

<!-- source: EN PDF p19; unit 105 -->

Der praktische Encoderzugriff und die MJPEG-Dekodierung sind derzeit mit MppTask umgesetzt.

<!-- source: EN PDF p20; unit 106 -->

### 2.6 Instanzkontext MppCtx

<!-- source: EN PDF p20; unit 107 -->

MppCtx ist das Kontexthandle einer MPP-Instanz als Dekoder oder Encoder. mpp_create erzeugt MppCtx und MppApi; mpp_init initialisiert Kodier-/Dekodiertyp und Format. Anschließend erfolgt der Zugriff über decode_xxx/encode_xx oder poll/dequeuer/enqueue. Am Ende wird die Instanz mit mpp_destroy zerstört.

<!-- source: EN PDF p20; unit 108 -->

![Original-Technikabbildung, englisches PDF, Seite 20](/docs/rockchip-mpp/assets/en-p020-figure-01.png)

<!-- source: EN PDF p20; unit 109 -->

Abbildung 10: Verwendung von MppCtx

<!-- source: EN PDF p20; unit 110 -->

### 2.7 API-Struktur MppApi (MPI)

<!-- source: EN PDF p20; unit 111 -->

MppApi kapselt die API von MPP. Die Videocodec-Funktion wird über die Funktionszeiger dieser nachfolgend dargestellten Struktur genutzt:

<!-- source: EN PDF p21; unit 112 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| size | RK_U32 | Größe der MppApi-Struktur. |
| version | RK_U32 | Version der MppApi-Struktur. |
| decode | Funktionszeiger | MPP_RET (*decode)(MppCtx ctx, MppPacket packet, MppFrame<br>*frame)<br>Videodekodierschnittstelle mit gleichzeitiger Ein- und Ausgabe; allein verwendet.<br>ctx: Kontext der MPP-Instanz.<br>packet: Eingangsbitstrom.<br>frame: Ausgabebild.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |
| decode_put_packet | Funktionszeiger | MPP_RET (*decode_put_packet)(MppCtx ctx, MppPacket packet)<br>Eingabeschnittstelle der Videodekodierung; zusammen mit decode_get_frame verwendet.<br>ctx: Kontext der MPP-Instanz.<br>packet: Eingangsbitstrom.<br>Rückgabewert: 0 bedeutet Erfolg und Verarbeitung des Datenstroms durch MPP; ein Wert ungleich null bedeutet einen Fehler und einen noch nicht verarbeiteten Datenstrom, der erneut gesendet werden muss. |
| decode_get_frame | Funktionszeiger | MPP_RET (*decode_get_frame)(MppCtx ctx, MppFrame *frame)<br>Ausgabeschnittstelle der Videodekodierung; zusammen mit decode_put_packet verwendet.<br>ctx: Kontext der MPP-Instanz.<br>frame: Ausgabebild.<br>Rückgabewert: 0 bedeutet einen erfolgreichen Ausgabeabruf; es muss geprüft werden, ob der Zeiger frame einen Wert hat. Ein Wert ungleich null ist ein Fehlercode. |
| encode | Funktionszeiger | MPP_RET (*encode)(MppCtx ctx, MppFrame frame, MppPacket<br>*packet)<br>Videokodierschnittstelle mit gleichzeitiger Ein- und Ausgabe; separat verwendet.<br>ctx: Kontext der MPP-Instanz.<br>frame: Eingabebild.<br>packet: Ausgangsbitstrom.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |
| encode_put_frame | Funktionszeiger | MPP_RET (*encode_put_frame)(MppCtx ctx, MppFrame frame)<br>Eingabeschnittstelle der Videokodierung; zusammen mit encode_get_packet verwendet.<br>ctx: Kontext der MPP-Instanz.<br>frame: Eingabebild.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |

<!-- source: EN PDF p22; unit 113 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| encode_get_packet | Funktionszeiger | MPP_RET (*encode_get_packet)(MppCtx ctx, MppPacket *packet)<br>Ausgabeschnittstelle der Videokodierung; zusammen mit encode_put_frame verwendet.<br>ctx: Kontext der MPP-Instanz.<br>packet: Ausgangsbitstrom.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |
| poll | Funktionszeiger | MPP_RET (*poll)(MppCtx ctx, MppPortType type, MppPollType<br>timeout)<br>Port-Abfrageschnittstelle: prüft, ob Daten zur Entnahme aus der Port-Warteschlange bereitstehen.<br>ctx: Kontext der MPP-Instanz.<br>type: Porttyp, entweder Eingangs- oder Ausgangsport.<br>timeout: Abfragezeitlimit; -1 bedeutet blockierende Abfrage, 0 nicht blockierende Abfrage, ein positiver Wert das Zeitlimit in Millisekunden.<br>Rückgabewert: 0 bedeutet Erfolg und abrufbare Daten; ein Wert ungleich null ist ein Fehlercode. |
| dequeue | Funktionszeiger | MPP_RET (*dequeue)(MppCtx ctx, MppPortType type, MppTask<br>*task)<br>Die Port-Dequeue-Schnittstelle entnimmt die MppTask-Struktur aus der Port-Warteschlange.<br>ctx: Kontext der MPP-Instanz.<br>type: Porttyp, entweder Eingangs- oder Ausgangsport.<br>task: MppTask.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |
| enqueue | Funktionszeiger | MPP_RET (*enqueue)( MppCtx ctx, MppPortType type, MppTask<br>task)<br>Die Port-Enqueue-Schnittstelle übergibt die MppTask-Struktur an die Port-Warteschlange.<br>ctx: Kontext der MPP-Instanz.<br>type: Porttyp, entweder Eingangs- oder Ausgangsport.<br>task: MppTask.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |
| reset | Funktionszeiger | MPP_RET (*reset)(MppCtx ctx)<br>Die Reset-Schnittstelle setzt den internen Zustand von MppCtx auf einen verfügbaren, initialisierten Zustand zurück.<br>HINWEIS: reset ist eine blockierende synchrone Schnittstelle.<br>ctx: Kontext der MPP-Instanz.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |

<!-- source: EN PDF p23; unit 114 -->

| Parametername | Parametertyp | Beschreibung |
| --- | --- | --- |
| control | Funktionszeiger | MPP_RET (*control)(MppCtx ctx, MpiCmd cmd, MppParam<br>param)<br>Steuerschnittstelle für zusätzliche Steueroperationen an MPP-Instanzen.<br>ctx: Kontext der MPP-Instanz.<br>cmd: Mpi-Befehls-ID für unterschiedliche Arten von Steuerbefehlen.<br>param: Mpi-Befehlsparameter als zusätzlicher Parameter des Steuerbefehls.<br>Rückgabewert: 0 bedeutet Erfolg, ein Wert ungleich null ist ein Fehlercode. |

<!-- source: EN PDF p23; unit 115 -->

## 3\. Verwendung der MPI

<!-- source: EN PDF p23; unit 116 -->

Dieses Kapitel beschreibt den konkreten MPI-Ablauf und wichtige Nutzungshinweise. MPI (Media Process Interface) ist die Benutzerschnittstelle von MPP für Hardwarekodierung, -dekodierung und zugehörige Funktionen. Sie wird über Funktionszeiger in einer C-Struktur bereitgestellt. MppCtx und MppApi ermöglichen die Implementierung von Dekoder und Encoder.

<!-- source: EN PDF p23; unit 117 -->

![Original-Technikabbildung, englisches PDF, Seite 23](/docs/rockchip-mpp/assets/en-p023-figure-01.png)

<!-- source: EN PDF p23; unit 118 -->

Abbildung 11: Umfang der MPI

<!-- source: EN PDF p24; unit 119 -->

In der Abbildung verwalten mpp_create, mpp_init und mpp_destroy den MppCtx. mpp_create liefert außerdem die MppApi-Struktur. Die eigentliche Kodierung und Dekodierung erfolgt über deren Funktionszeiger im rot umrandeten Bereich. Dieser umfasst die Codec-Datenschnittstellen put/get_packet/frame sowie Steuer- und Rücksetzschnittstellen. Nachfolgend werden die Schnittstellen und wichtige Betriebsaspekte erläutert.

<!-- source: EN PDF p24; unit 120 -->

### 3.1 Datenflussschnittstelle des Dekoders

<!-- source: EN PDF p24; unit 121 -->

Die Dekoderschnittstelle nimmt Bitströme entgegen und gibt Bilder aus. Sie umfasst decode_put_packet, decode_get_frame und decode in MppApi und stellt die einfachste Dekodierfunktion bereit.

<!-- source: EN PDF p24; unit 122 -->

#### 3.1.1 decode_put_packet

<!-- source: EN PDF p24; unit 123 -->

| Schnittstellendefinition | MPP_RET decode_put_packet(MppCtx ctx, MppPacket packet) |
| --- | --- |
| Eingabeparameter | ctx: MPP-Decoderinstanz; packet: einzugebende Bitstromdaten. |
| Rückgabeparameter | Laufzeitfehlercode. |
| Funktion | Ein Datenstrompaket an die MPP-Decoderinstanz ctx übergeben. |

<!-- source: EN PDF p24; unit 124 -->

##### 3.1.1.1 Form des Eingangsbitstroms

<!-- source: EN PDF p24; unit 125 -->

MPP erhält einen Rohbitstrom ohne Containerinformationen. Es gibt zwei Eingabeformen:

<!-- source: EN PDF p24; unit 126 -->

1\. Vollständige Frames

<!-- source: EN PDF p24; unit 127 -->

Die Daten sind bereits in Frames unterteilt: Jeder an decode_put_packet übergebene MppPacket enthält genau einen vollständigen Frame. MPP kann die Pakete unmittelbar verarbeiten. Dies ist der Standardmodus.

<!-- source: EN PDF p24; unit 128 -->

2\. Aufgeteilte Frames

<!-- source: EN PDF p24; unit 129 -->

Die Daten sind nach Länge aufgeteilt, sodass ein MppPacket nicht zwingend genau einen vollständigen Frame enthält. MPP muss die Framegrenzen intern bestimmen. Dieser Modus wird unterstützt; vor mpp_init muss jedoch need_split über MPP_DEC_SET_PARSER_SPLIT_MODE der control-Schnittstelle gesetzt werden.

<!-- source: EN PDF p24; unit 130 -->

![Original-Technikabbildung, englisches PDF, Seite 24](/docs/rockchip-mpp/assets/en-p024-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
// NOTE: decoder split mode need to be set before init
RK_U32 need_split = 1;
mpi_cmd = MPP_DEC_SET_PARSER_SPLIT_MODE;
param = &need_split;
ret = mpi->control(ctx, mpi_cmd, param);
if (MPP_OK != ret) {
    mpp_err("mpi->control failed\n");
    goto MPP_TEST_OUT;
}
```

<!-- source: EN PDF p25; unit 131 -->

Dann werden die über decode_put_packet gelieferten MppPacket intern in einzelne Frames zerlegt und anschließend wie vollständige Frames verarbeitet.

<!-- source: EN PDF p25; unit 132 -->

Werden diese beiden Modi verwechselt, entstehen Bitstrom-Dekodierfehler.

<!-- source: EN PDF p25; unit 133 -->

Vollständige Frames werden effizienter verarbeitet, erfordern jedoch vor der Eingabe ein Parsen und Aufteilen. Aufgeteilte Frames sind einfacher zuzuführen, beeinträchtigen aber die Effizienz.

<!-- source: EN PDF p25; unit 134 -->

mpi_dec_test verwendet standardmäßig aufgeteilte Frames, das Rockchip Android SDK vollständige Frames. Die Auswahl richtet sich nach Anwendung und Plattform.

<!-- source: EN PDF p25; unit 135 -->

##### 3.1.1.2 Verbrauch des Eingangsbitstroms

<!-- source: EN PDF p25; unit 136 -->

Die gültige Datenlänge eines MppPacket ist length. Wird der Bitstrom durch decode_put_packet erfolgreich übernommen, gibt die Funktion null (MPP_OK) zurück und setzt length auf null. Andernfalls wird ein Fehlercode ungleich null zurückgegeben und length bleibt unverändert.

<!-- source: EN PDF p25; unit 137 -->

##### 3.1.1.3 Betriebsart des Funktionsaufrufs

<!-- source: EN PDF p25; unit 138 -->

decode_put_packet übergibt den Rohbitstrom an die MPP-Instanz. Kann diese zeitweise keine weiteren Daten annehmen, gibt die nicht blockierende Funktion sofort einen Fehler zurück. Der Anwender sollte den Fehlercode auswerten, kurz warten und die Daten erneut senden, um unnötigen Aufwand zu vermeiden.

<!-- source: EN PDF p25; unit 139 -->

##### 3.1.1.4 Maximale Anzahl gepufferter Pakete

<!-- source: EN PDF p25; unit 140 -->

Standardmäßig nimmt die Verarbeitungswarteschlange von MPP vier Eingangspakete auf. Bei zu schneller Eingabe wird ein Fehler gemeldet; kurz warten und erneut senden.

<!-- source: EN PDF p25; unit 141 -->

#### 3.1.2 decode_get_frame

<!-- source: EN PDF p25; unit 142 -->

| Schnittstellendefinition | MPP_RET decode_get_frame(MppCtx ctx, MppFrame *frame) |
| --- | --- |
| Eingabeparameter | ctx: MPP-Decoderinstanz.<br>frame: Zeiger zum Abruf von MppFrame-Instanzen. |
| Rückgabeparameter | Laufzeitfehlercode. |
| Funktion | Beschreibungsinformationen des dekodierten Frames von der MPP-Decoderinstanz ctx abrufen. |

<!-- source: EN PDF p25; unit 143 -->

Das dekodierte Bild wird durch MppFrame beschrieben. Dieselbe Struktur dient als Ausgabekanal für Informationen des MPP-Dekoders, einschließlich Bildfehlern und Parameteränderungen.

<!-- source: EN PDF p26; unit 144 -->

Fehlerinformationen des Ausgabebildes

<!-- source: EN PDF p26; unit 145 -->

errinfo zeigt an, ob beim Dekodieren des Bildes ein Fehler aufgetreten ist. Ein errInfo ungleich null bedeutet einen Fehler im zugehörigen Bitstrom; das fehlerhafte Bild kann verworfen werden.

<!-- source: EN PDF p26; unit 146 -->

Speicherbedarf des dekodierten Bildes

<!-- source: EN PDF p26; unit 147 -->

Der Dekoder benötigt Speicher für die Pixel des Ausgabebildes. Der Anwender muss einen ausreichend großen Puffer bereitstellen. MPP berechnet den Bedarf abhängig von Chip und Videoformat und liefert ihn über buf_size in MppFrame. Der Speicher ist entsprechend diesem Wert zuzuweisen.

<!-- source: EN PDF p26; unit 148 -->

Änderung der Ausgabebildinformationen (Info change)

<!-- source: EN PDF p26; unit 149 -->

Ändern sich Breite, Höhe, Format oder Pixelbittiefe des Bitstroms, meldet dies der Dekoder. Der Anwender muss den verwendeten Speicherpool durch neue Puffer aktualisieren. Das Verfahren ist im Abschnitt über Bildspeicherzuweisung und Benutzerinteraktion beschrieben; die Vorlage verweist dabei auf „3..2“.

<!-- source: EN PDF p26; unit 150 -->

#### 3.1.3 decode

<!-- source: EN PDF p26; unit 151 -->

decode kombiniert decode_put_packet und decode_get_frame in einem gemeinsamen Aufruf. Der interne Ablauf:

<!-- source: EN PDF p26; unit 152 -->

1\. Versuchen, ein Ausgabebild abzuholen;

<!-- source: EN PDF p26; unit 153 -->

2\. Bei erfolgreichem Abholen zurückkehren;

<!-- source: EN PDF p26; unit 154 -->

3\. Wenn der Bitstrom bereits erfolgreich gesendet wurde, zurückkehren;

<!-- source: EN PDF p26; unit 155 -->

4\. Eingangsbitstrom senden;

<!-- source: EN PDF p26; unit 156 -->

5\. Erfolg des Sendens prüfen und zu Schritt 1 zurückkehren.

<!-- source: EN PDF p26; unit 157 -->

Aus Anwendersicht versucht decode zuerst, ein dekodiertes Bild abzuholen, und gibt es bevorzugt zurück. Liegt kein Bild vor, wird der Bitstrom gesendet, erneut ein Bild angefordert und der Aufruf beendet.

<!-- source: EN PDF p26; unit 158 -->

### 3.2 Dekoder-Steuerschnittstelle

<!-- source: EN PDF p26; unit 159 -->

#### 3.2.1 control

<!-- source: EN PDF p26; unit 160 -->

Die Enumeration MpiCmd in rk_mpi_cmd.h definiert die Befehle der control-Schnittstelle. Befehle für Dekoder und Dekodierablauf:

<!-- source: EN PDF p27; unit 161 -->

![Original-Technikabbildung, englisches PDF, Seite 27](/docs/rockchip-mpp/assets/en-p027-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
MPP_DEC_CMD_BASE                 = CMD_MODULE_CODEC | CMD_CTX_ID_DEC,
MPP_DEC_SET_FRAME_INFO,          /* vpu api legacy control for buffer slot dimension init */
MPP_DEC_SET_EXT_BUF_GROUP,       /* IMPORTANT: set external buffer group to mpp decoder */
MPP_DEC_SET_INFO_CHANGE_READY,
MPP_DEC_SET_PRESENT_TIME_ORDER,  /* use input time order for output */
MPP_DEC_SET_PARSER_SPLIT_MODE,   /* Need to setup before init */
MPP_DEC_SET_PARSER_FAST_MODE,    /* Need to setup before init */
MPP_DEC_GET_STREAM_COUNT,
MPP_DEC_GET_VPUMEM_USED_COUNT,
MPP_DEC_SET_VC1_EXTRA_DATA,
MPP_DEC_SET_OUTPUT_FORMAT,
MPP_DEC_SET_DISABLE_ERROR,       /* When set it will disable sw/hw error (H.264 / H.265) */
MPP_DEC_SET_IMMEDIATE_OUT,
MPP_DEC_CMD_END,
```

<!-- source: EN PDF p27; unit 162 -->

MPP_DEC_SET_FRAME_INFO

<!-- source: EN PDF p27; unit 163 -->

Der Befehlsparameter ist MppFrame. Damit werden Standardbreite und -höhe des Dekoders konfiguriert. Der zurückgegebene MppFrame enthält die erforderliche Bildpuffergröße. Üblicher Aufrufzeitpunkt: direkt nach mpp_init und vor decode_put_packet.

<!-- source: EN PDF p27; unit 164 -->

MPP_DEC_SET_EXT_BUF_GROUP

<!-- source: EN PDF p27; unit 165 -->

Der Parameter MppBufferGroup legt den Pufferpool des Dekoders fest. Der Aufrufzeitpunkt hängt vom Bildspeicher-Zuweisungsmodus ab.

<!-- source: EN PDF p27; unit 166 -->

MPP_DEC_SET_INFO_CHANGE_READY

<!-- source: EN PDF p27; unit 167 -->

Dieser Befehl hat keinen Parameter. Er signalisiert, dass MppBufferGroup nach Info change neu eingerichtet wurde und der Dekoder fortfahren kann. Der Aufrufzeitpunkt hängt vom Speicherzuweisungsmodus ab.

<!-- source: EN PDF p27; unit 168 -->

MPP_DEC_SET_PRESENT_TIME_ORDER

<!-- source: EN PDF p27; unit 169 -->

Der Parameter RK_U32* dient zur Behandlung besonderer Bitstrom-Zeitstempelfälle.

<!-- source: EN PDF p27; unit 170 -->

MPP_DEC_SET_PARSER_SPLIT_MODE

<!-- source: EN PDF p27; unit 171 -->

Der Parameter RK_U32* aktiviert die interne Frameaufteilung durch den MPP-Parser. Standardmäßig werden bereits aufgeteilte vollständige Frames erwartet. Der Befehl wird vor mpp_init aufgerufen.

<!-- source: EN PDF p27; unit 172 -->

MPP_DEC_SET_PARSER_FAST_MODE

<!-- source: EN PDF p27; unit 173 -->

Der Parameter RK_U32* aktiviert schnelles Frameparsen und erhöht die Parallelität von Dekoderhardware und -software. Da dies die Kennzeichnung fehlerhafter Bitströme beeinflussen kann, ist der Modus standardmäßig deaktiviert. Aufruf vor mpp_init.

<!-- source: EN PDF p27; unit 174 -->

MPP_DEC_GET_STREAM_COUT

<!-- source: EN PDF p27; unit 175 -->

Parameter RK_U32*. Externe Anwendungen fragen damit die Anzahl noch nicht verarbeiteter Bitstrompakete ab. Historische Altschnittstelle.

<!-- source: EN PDF p27; unit 176 -->

MPP_DEC_GET_VPUMEM_USED_COUT

<!-- source: EN PDF p27; unit 177 -->

Parameter RK_U32*. Externe Anwendungen fragen die Anzahl der von MPP verwendeten MppBuffer ab. Historische Altschnittstelle.

<!-- source: EN PDF p27; unit 178 -->

MPP_DEC_SET_VC1_EXTRA_DATA

<!-- source: EN PDF p27; unit 179 -->

Noch nicht implementiert. Historische Altschnittstelle.

<!-- source: EN PDF p27; unit 180 -->

MPP_DEC_SET_OUTPUT_FORMAT

<!-- source: EN PDF p28; unit 181 -->

Parameter MppFrameFormat. Externe Anwendungen konfigurieren damit das Ausgabebildformat des JPEG-Dekoders. Standardmäßig nicht verwendet.

<!-- source: EN PDF p28; unit 182 -->

MPP_DEC_SET_DISABLE_ERROR

<!-- source: EN PDF p28; unit 183 -->

Der Parameter RK_U32* deaktiviert die Fehlerbehandlung des MPP-Dekoders. Danach ignoriert dieser Bitstromfehler, gibt alle dekodierbaren Bilder aus und setzt kein errinfo im Ausgabe-MppFrame. Aufruf vor decode_put_packet.

<!-- source: EN PDF p28; unit 184 -->

MPP_DEC_SET_IMMEDIATE_OUT

<!-- source: EN PDF p28; unit 185 -->

Der Parameter RK_U32* aktiviert die sofortige H.264-Ausgabe. Der Dekoder ignoriert Unterbrechungen der Framefolge durch verworfene Frames oder picture order count und gibt das aktuelle dekodierte Bild sofort aus. Aufruf vor decode_put_packet.

<!-- source: EN PDF p28; unit 186 -->

MPP_DEC_SET_ENABLE_FAST_PLAY

<!-- source: EN PDF p28; unit 187 -->

Der Parameter FastPlayMode* aktiviert die schnelle H.264-Wiedergabe, ohne vor der Ausgabe auf einen gefüllten dpb zu warten. Wird ein Frame nach dem I-Frame dekodiert, soll aber davor angezeigt werden, können Frames verloren gehen. Aufruf vor decode_put_packet.

<!-- source: EN PDF p28; unit 188 -->

#### 3.2.2 reset

<!-- source: EN PDF p28; unit 189 -->

reset versetzt den Dekoder in den Zustand nach regulärer Initialisierung zurück.

<!-- source: EN PDF p28; unit 190 -->

Nach Übergabe und Verarbeitung des letzten MppPacket mit EOS-Markierung wechselt der Dekoder in den EOS-Zustand und nimmt keine weiteren Bitströme an. Erst nach einem Reset kann ein neuer Bitstrom verarbeitet werden.

<!-- source: EN PDF p28; unit 191 -->

### 3.3 Wichtige Hinweise zur Dekodernutzung

<!-- source: EN PDF p28; unit 192 -->

Bei der Dekodernutzung sind folgende Punkte zu beachten:

<!-- source: EN PDF p28; unit 193 -->

#### 3.3.1 Ein- und mehrthreadige Dekodernutzung

<!-- source: EN PDF p28; unit 194 -->

Die MPI des MPP-Dekoders ist threadsicher und kann in mehreren Threads verwendet werden. mpi_dec_test zeigt den Einthreadmodus, mpi_dec_mt_test den Mehrthreadmodus.

<!-- source: EN PDF p29; unit 195 -->

![Original-Technikabbildung, englisches PDF, Seite 29](/docs/rockchip-mpp/assets/en-p029-figure-01.png)

<!-- source: EN PDF p29; unit 196 -->

![Original-Technikabbildung, englisches PDF, Seite 29](/docs/rockchip-mpp/assets/en-p029-figure-02.png)

<!-- source: EN PDF p29; unit 197 -->

Abbildung 12: Ein- und mehrthreadige Dekodernutzung

<!-- source: EN PDF p29; unit 198 -->

#### 3.3.2 Bildspeicherzuweisung und Benutzerinteraktion

<!-- source: EN PDF p29; unit 199 -->

Der Dekoder benötigt Speicher zum Schreiben der Pixel. Nach dem Dekodieren wird dieser an den Anwender übergeben und nach dessen Nutzung an den Dekoder zurückgegeben. Beim Schließen des Dekoders wird der gesamte Speicher freigegeben. So ist eine Zero-Copy-Interaktion möglich. MPP unterstützt drei Modi der Speicherzuweisung und Benutzerinteraktion:

<!-- source: EN PDF p29; unit 200 -->

##### 3.3.2.1 Modus 1: vollständig interne Speicherzuweisung

<!-- source: EN PDF p29; unit 201 -->

Der Bildspeicher wird direkt vom MPP-Decoder zugewiesen. Der Benutzer erhält das Ausgabebild des Decoders und gibt es unmittelbar nach der Verwendung frei.

<!-- source: EN PDF p30; unit 202 -->

![Original-Technikabbildung, englisches PDF, Seite 30](/docs/rockchip-mpp/assets/en-p030-figure-01.png)

<!-- source: EN PDF p30; unit 203 -->

Abbildung 13: Schema der vollständig internen Speicherzuweisung

<!-- source: EN PDF p30; unit 204 -->

In diesem Modus muss der Benutzer den Befehl MPP_DEC_SET_EXT_BUF_GROUP der Decoder-Steuerschnittstelle nicht aufrufen. Wenn der Decoder eine info change meldet, genügt der direkte Aufruf von MPP_DEC_SET_INFO_CHANGE_READY über die Steuerschnittstelle.

<!-- source: EN PDF p30; unit 205 -->

Der Decoder weist den Speicher automatisch intern zu; der Benutzer muss die erhaltenen Daten jedes Frames unmittelbar freigeben.

<!-- source: EN PDF p30; unit 206 -->

![Original-Technikabbildung, englisches PDF, Seite 30](/docs/rockchip-mpp/assets/en-p030-figure-02.png)

<!-- source: EN PDF p30; unit 207 -->

Abbildung 14: Programmablauf bei vollständig interner Zuweisung des Decoder-Bildspeichers

<!-- source: EN PDF p30; unit 208 -->

Vorteil:

<!-- source: EN PDF p30; unit 209 -->

Das Verfahren ist einfach. Ein Demonstrationsprogramm zur Bewertung der Decoderleistung lässt sich schnell einrichten. Nachteile:

<!-- source: EN PDF p30; unit 210 -->

1\. Der Speicher wird intern vom Decoder zugewiesen. Wurde er beim Zerstören des Decoders noch nicht freigegeben, kann ein Speicherleck oder Absturz auftreten.

<!-- source: EN PDF p30; unit 211 -->

2\. Der Speicherverbrauch des Decoders lässt sich nicht steuern; er kann Speicher uneingeschränkt verwenden. Wird der Bitstrom schnell zugeführt und gibt der Benutzer den Speicher dekodierter Bilder nicht rechtzeitig frei, verbraucht der Decoder rasch den gesamten verfügbaren Speicher.

<!-- source: EN PDF p30; unit 212 -->

3\. Eine Anzeige ohne Kopieren ist schwer umzusetzen, da der Speicher intern vom Decoder zugewiesen wird und möglicherweise nicht mit dem Anzeigesystem des Benutzers kompatibel ist.

<!-- source: EN PDF p30; unit 213 -->

##### 3.3.2.2 Modus 2: teilweise interne Speicherzuweisung

<!-- source: EN PDF p30; unit 214 -->

Dies ist der Standardmodus des Demonstrationsprogramms mpi_dec_test. Der Benutzer muss anhand von buf_size des von get_frame zurückgegebenen MppFrame eine MppBufferGroup erstellen und sie über MPP_DEC_SET_EXT_BUF_GROUP der Steuerschnittstelle im Decoder konfigurieren. Über mpp_buffer_group_limit_config lässt sich der Speicherverbrauch des Decoders begrenzen.

<!-- source: EN PDF p31; unit 215 -->

![Original-Technikabbildung, englisches PDF, Seite 31](/docs/rockchip-mpp/assets/en-p031-figure-01.png)

<!-- source: EN PDF p31; unit 216 -->

Abbildung 15: Decoder-Ablauf bei teilweise interner Speicherzuweisung

<!-- source: EN PDF p31; unit 217 -->

Vorteil:

<!-- source: EN PDF p31; unit 218 -->

Das Verfahren ist einfach und gut zugänglich; der Speicherverbrauch lässt sich in gewissem Umfang begrenzen. Nachteile:

<!-- source: EN PDF p31; unit 219 -->

1\. Die Begrenzung des Speicherumfangs ist nicht exakt. Die Speicherauslastung ist nicht fest auf 100% eingestellt, sondern schwankt.

<!-- source: EN PDF p31; unit 220 -->

2\. Auch eine Anzeige ohne Kopieren ist schwer umzusetzen.

<!-- source: EN PDF p31; unit 221 -->

##### 3.3.2.3 Modus 3: vollständig externe Speicherzuweisung

<!-- source: EN PDF p31; unit 222 -->

In diesem Modus wird eine leere MppBufferGroup im externen Modus erstellt, über die der Decoder die vom Benutzer bereitgestellten Dateihandles des externen Speicherzuweisers, üblicherweise dmabuf/ion/drm, importiert. Unter Android bezieht Mediaserver den Anzeigespeicher über gralloc von SurfaceFlinger, übergibt die von gralloc erhaltenen Dateihandles an MppBufferGroup und konfiguriert die Gruppe im Decoder mit MPP_DEC_SET_EXT_BUF_GROUP über die Steuerschnittstelle. Anschließend verwendet der MPP-Decoder den von gralloc bezogenen Speicher wieder.

<!-- source: EN PDF p31; unit 223 -->

![Original-Technikabbildung, englisches PDF, Seite 31](/docs/rockchip-mpp/assets/en-p031-figure-02.png)

<!-- source: EN PDF p31; unit 224 -->

Abbildung 16: Schema der vollständig externen Speicherzuweisung

<!-- source: EN PDF p32; unit 225 -->

![Original-Technikabbildung, englisches PDF, Seite 32](/docs/rockchip-mpp/assets/en-p032-figure-01.png)

<!-- source: EN PDF p32; unit 226 -->

Abbildung 17: Decoder-Ablauf bei vollständig externer Speicherzuweisung

<!-- source: EN PDF p32; unit 227 -->

Vorteil:

<!-- source: EN PDF p32; unit 228 -->

Durch direkte Verwendung des Speichers des externen Anzeigesystems lässt sich ein Betrieb ohne Kopieren einfach umsetzen. Nachteile:

<!-- source: EN PDF p32; unit 229 -->

1\. Der Modus ist schwer zu verstehen und anzuwenden.

<!-- source: EN PDF p32; unit 230 -->

2\. Das Benutzerprogramm muss geändert werden. Der Ablauf mancher Programme schränkt die Verwendung der vollständig externen Speicherzuweisung ein.

<!-- source: EN PDF p32; unit 231 -->

Hinweise zur vollständig externen Speicherzuweisung:

<!-- source: EN PDF p32; unit 232 -->

1\. Wird der Bildspeicherpool vor dem Decoder erstellt, ist ein zusätzlicher Weg zur Ermittlung der Größe des Bildspeichers erforderlich.

<!-- source: EN PDF p32; unit 233 -->

Allgemeine Berechnung des Speicherbedarfs eines YUV420-Bildes: Bildpixeldaten — hor_stride * ver_stride * 3 / 2; Zusatzinformationen — hor_stride * ver_stride / 2.

<!-- source: EN PDF p32; unit 234 -->

2\. Die Anzahl der Speicherblöcke muss sowohl die Anforderungen der Dekodierung als auch der Anzeige berücksichtigen. Im englischen Original steht wörtlich, der Decoder könne bei „genügend“ (enough) Speicherblöcken hängen bleiben. Dieser verdächtige Widerspruch bleibt zur Prüfung kenntlich; eine vermutlich fehlende Verneinung ist keine bestätigte Korrektur.

<!-- source: EN PDF p32; unit 235 -->

Für H.264/H.265 mit mehr Referenzframes sind 20+ Speicherblöcke erforderlich, um die Dekodierung sicherzustellen. Andere Protokolle benötigen dafür 10+ Speicherblöcke.

<!-- source: EN PDF p32; unit 236 -->

3\. Tritt beim Dekodieren des Bitstroms eine info change auf, muss die vorhandene MppBufferGroup zurückgesetzt werden. Neue Bildspeicherpuffer sind zu übergeben und die externe Anzeige entsprechend anzupassen.

<!-- source: EN PDF p33; unit 237 -->

### 3.4 Encoder-Datenflussschnittstelle

<!-- source: EN PDF p33; unit 238 -->

Die Encoder-Schnittstelle stellt Funktionen für die Bildeingabe und Bitstromausgabe bereit: encode_put_frame, encode_get_packet und encode in der Struktur MppApi. Diese Funktionen ermöglichen eine einfache Kodierung; die Steuerschnittstelle bietet die Konfiguration des Encoders.

<!-- source: EN PDF p33; unit 239 -->

#### 3.4.1 encode_put_frame

<!-- source: EN PDF p33; unit 240 -->

| Schnittstellendefinition | MPP_RET encode_put_frame(MppCtx ctx, MppFrame frame) |
| --- | --- |
| Eingabeparameter | ctx: MPP-Decoderinstanz.<br>,frame: einzugebende Bilddaten. |
| Rückgabeparameter | Laufzeitfehlercode. |
| Funktion | Bilddaten eines Frames an die durch ctx angegebene MPP-Encoderinstanz übergeben. |

<!-- source: EN PDF p33; unit 241 -->

##### 3.4.1.1 Arbeitsweise der Funktion

<!-- source: EN PDF p33; unit 242 -->

Das Eingabebild des Encoders ist normalerweise sehr groß; Kopieren würde die Effizienz erheblich verringern. Deshalb muss die Eingabefunktion warten, bis die Encoder-Hardware die Nutzung des Eingabebildspeichers abgeschlossen hat, bevor sie zurückkehren kann. Das verwendete Bild wird an den Aufrufer zurückgegeben. Aus diesen Gründen ist encode_put_frame blockierend: Der Aufruf bleibt bis zum Ende der Nutzung des Eingabebildes blockiert. Dies verhindert bis zu einem gewissen Grad den parallelen Betrieb von Software und Hardware und verringert die Effizienz.

<!-- source: EN PDF p33; unit 243 -->

##### 3.4.1.2 Eingabe mit und ohne Kopieren

<!-- source: EN PDF p33; unit 244 -->

Der Encoder-Eingang unterstützt keinen von der CPU zugewiesenen Speicher. Soll eine von der CPU zugewiesene Adresse verwendet werden, muss ein MppBuffer zugewiesen und müssen die Daten hineinkopiert werden. Dies beeinträchtigt die Effizienz erheblich. Bevorzugt wird Eingabespeicher in Form von dmabuf/ion/drm, der eine Kodierung ohne Kopieren mit minimalem Zusatzaufwand ermöglicht.

<!-- source: EN PDF p34; unit 245 -->

#### 3.4.2 encode_get_packet

<!-- source: EN PDF p34; unit 246 -->

| Schnittstellendefinition | MPP_RET encode_get_packet(MppCtx ctx, MppPacket *packet) |
| --- | --- |
| Eingabeparameter | ctx: MPP-Decoderinstanz.<br>,packet: Zeiger zum Abruf einer MppPacket-Instanz. |
| Rückgabeparameter | Laufzeitfehlermodus. |
| Funktion | Paketbeschreibungsinformationen der abgeschlossenen Kodierung von der durch ctx angegebenen MPP-Encoderinstanz abrufen. |

<!-- source: EN PDF p34; unit 247 -->

##### 3.4.2.1 Headerinformationen und Bilddaten

<!-- source: EN PDF p34; unit 248 -->

Am Beispiel des H.264-Encoders bestehen die Ausgabedaten aus zwei Teilen: dem Bitstrom der Headerinformationen (sps/pps) und dem Bilddatenbitstrom (I/P slice). Die Headerinformationen werden über MPP_ENC_GET_EXTRA_INFO der Steuerschnittstelle abgerufen, die Bilddaten über encode_get_packet. Der Headerabruf erfolgt nach Abschluss der Parameterkonfigurationsbefehle SET_RC_CFG/SET_PREP_CFG/SET_CODEC_CFG der Steuerschnittstelle. Beim Aufruf eines Konfigurationsbefehls aktualisiert der Encoder die Parameter. Nach Abschluss der Aktualisierung lassen sich die neuesten Headerinformationen mit folgendem Befehl abrufen:

<!-- source: EN PDF p34; unit 249 -->

MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p34; unit 250 -->

##### 3.4.2.2 Ausgabeformat des H.264-Encoders

<!-- source: EN PDF p34; unit 251 -->

In der beschriebenen Implementierung gibt die Hardware einen Bitstrom mit dem festen Startcode 00 00 00 01 aus; encode_get_packet liefert daher einen Bitstrom mit dem Startcode 00 00 00 01. Soll der Startcode entfernt werden, können die Daten ab der unmittelbar folgenden Adresse kopiert werden.

<!-- source: EN PDF p34; unit 252 -->

##### 3.4.2.3 Bitstromdaten ohne Kopieren

<!-- source: EN PDF p34; unit 253 -->

Bei Verwendung von encode_put_frame und encode_get_packet lässt sich der Ausgabepuffer nicht konfigurieren; deshalb wird bei encode_get_packet kopiert. Der Ausgabebitstrom des Encoders ist im Allgemeinen gegenüber dem Eingabebild klein, sodass das Kopieren akzeptabel ist. Wird eine Schnittstelle ohne Kopieren benötigt, sind enqueue/dequeue und die Struktur MppTask zu verwenden.

<!-- source: EN PDF p34; unit 254 -->

#### 3.4.3 encode

<!-- source: EN PDF p34; unit 255 -->

Noch nicht implementiert.

<!-- source: EN PDF p35; unit 256 -->

### 3.5 Encoder-Steuerschnittstelle

<!-- source: EN PDF p35; unit 257 -->

Encoder unterscheiden sich von Decodern und erfordern die Konfiguration bestimmter Parameter durch den Benutzer. Vor Beginn der Kodierung muss die Encoder-Konfiguration über die Steuerschnittstelle eingestellt werden.

<!-- source: EN PDF p35; unit 258 -->

#### 3.5.1 Steuerung und MppEncCfg

<!-- source: EN PDF p35; unit 259 -->

MPP empfiehlt, die Encoder-Konfiguration mit der gekapselten Struktur MppEncCfg über die Befehle MPP_ENC_SET_CFG/MPP_ENC_GET_CFG der Steuerschnittstelle vorzunehmen.

<!-- source: EN PDF p35; unit 260 -->

Wegen der konfigurierbaren Optionen und Parameter des Encoders führen feste Strukturen häufig zu Änderungen der Schnittstellenstruktur. Dadurch lässt sich die Binärkompatibilität nicht gewährleisten; die Versionsverwaltung wird komplizierter und der Wartungsaufwand steigt erheblich.

<!-- source: EN PDF p35; unit 261 -->

Zur Entschärfung dieses Problems verwendet MppEncCfg den Typ (void *) und eine Schlüsselzuordnung im Format &lt;string-value&gt;. Die Funktionsschnittstellen sind nach s32/u32/s64/u64/ptr/st unterteilt; die zugehörigen Funktionen bilden zwei Gruppen, set und get, wie nachfolgend gezeigt:

<!-- source: EN PDF p35; unit 262 -->

```text
MPP_RET mpp_enc_cfg_set_s32(MppEncCfg cfg, const char *name, RK_S32 val);
MPP_RET mpp_enc_cfg_set_u32(MppEncCfg cfg, const char *name, RK_U32 val);
MPP_RET mpp_enc_cfg_set_s64(MppEncCfg cfg, const char *name, RK_S64 val);
MPP_RET mpp_enc_cfg_set_u64(MppEncCfg cfg, const char *name, RK_U64 val);
MPP_RET mpp_enc_cfg_set_ptr(MppEncCfg cfg, const char *name, void *val);
MPP_RET mpp_enc_cfg_set_st(MppEncCfg cfg, const char *name, void *val);

MPP_RET mpp_enc_cfg_get_s32(MppEncCfg cfg, const char *name, RK_S32 *val);
MPP_RET mpp_enc_cfg_get_u32(MppEncCfg cfg, const char *name, RK_U32 *val);
MPP_RET mpp_enc_cfg_get_s64(MppEncCfg cfg, const char *name, RK_S64 *val);
MPP_RET mpp_enc_cfg_get_u64(MppEncCfg cfg, const char *name, RK_U64 *val);
MPP_RET mpp_enc_cfg_get_ptr(MppEncCfg cfg, const char *name, void **val);
MPP_RET mpp_enc_cfg_get_st(MppEncCfg cfg, const char *name, void *val);
```

<!-- source: EN PDF p35; unit 263 -->

Die Zeichenfolge wird üblicherweise als [type:parameter] definiert. Die unterstützten Zeichenfolgen und Parametertypen sind nachfolgend aufgeführt:

<!-- source: EN PDF p36; unit 264 -->

| Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |
| --- | --- | --- | --- |
| rc:mode | S32 | MppEncRcMode | Modus der Bitratensteuerung; derzeit werden CBR und VBR unterstützt:<br>CBR bedeutet Constant Bit Rate, also konstante Bitrate. In diesem Modus ist die Zielbitrate ausschlaggebend.<br>VBR bedeutet Variable Bit Rate, also variable Bitrate. Hier sind die maximale und minimale Bitrate ausschlaggebend.<br>FIX_QP ist ein Modus mit festem QP für Debugging und Leistungsbewertung. |
| rc:bps_target | S32 | RK_S32 | Zielbitrate im CBR-Modus. |
| rc:bps_max | S32 | RK_S32 | Höchste Bitrate im VBR-Modus. |
| rc:bps_min | S32 | RK_S32 | Niedrigste Bitrate im VBR-Modus. |
| rc:fps_in_flex | S32 | RK_S32 | Kennzeichen für eine variable Eingangsbildrate, standardmäßig 0.<br>0: feste Eingangsbildrate, berechnet als fps_in_num/fps_in_denom; damit sind gebrochene Bildraten darstellbar.<br>1: variable Eingangsbildrate; die Bildrate ist nicht fest, und die zugehörige Bitratenberechnung und -zuteilung richtet sich nach der tatsächlichen Zeit. |
| rc:fps_in_flex | S32 | RK_S32 | Kennzeichen für eine variable Eingangsbildrate, standardmäßig 0.<br>0: feste Eingangsbildrate, berechnet als fps_in_num/fps_in_denom; damit sind gebrochene Bildraten darstellbar.<br>1: variable Eingangsbildrate; die Bildrate ist nicht fest, und die zugehörige Bitratenberechnung und -zuteilung richtet sich nach der tatsächlichen Zeit. |
| rc:fps_in_num | S32 | RK_S32 | Zähler des gebrochenen Werts der Eingangsbildrate; beispielsweise bedeutet 0 die standardmäßigen 30fps. |
| rc:fps_in_denom | S32 | RK_S32 | Nenner des gebrochenen Werts der Eingangsbildrate. Bei 0 wird 1 verwendet. |

<!-- source: EN PDF p36; unit 265 -->

![Original-Technikabbildung, englisches PDF, Seite 36](/docs/rockchip-mpp/assets/en-p036-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum MppEncRcMode_e {
    MPP_ENC_RC_MODE_VBR,
    MPP_ENC_RC_MODE_CBR,
    MPP_ENC_RC_MODE_FIXQP,
    MPP_ENC_RC_MODE_AVBR,
    MPP_ENC_RC_MODE_BUTT
} MppEncRcMode;
```

<!-- source: EN PDF p37; unit 266 -->

| Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |
| --- | --- | --- | --- |
| rc:fps_out_flex | S32 | RK_S32 | Kennzeichen für eine variable Ausgangsbildrate, standardmäßig 0.<br>0: feste Ausgangsbildrate, berechnet als fps_out_num/fps_out_denom; damit sind gebrochene Bildraten darstellbar.<br>1: variable Ausgangsbildrate; die Bildrate ist nicht fest, und der zugehörige Ausgabezeitpunkt des Bitstroms wird anhand der tatsächlichen Zeit berechnet. |
| rc:fps_out_num | S32 | RK_S32 | Zähler des gebrochenen Werts der Ausgangsbildrate; beispielsweise bedeutet 0 die standardmäßigen 30fps. |
| rc:fps_out_denom | S32 | RK_S32 | Nenner des gebrochenen Werts der Ausgangsbildrate. Bei 0 wird 1 verwendet. |
| rc:gop |  | RK_S32 | Group Of Picture, also der Abstand zwischen zwei I-Frames:<br>0 — nur ein I-Frame, alle übrigen Frames sind P-Frames.<br>1 — ausschließlich I-Frames.<br>2 — Folge I P I P I P...<br>3 — Folge I P P I P P I P P...<br>Üblicherweise wird gop als ganzzahliges Vielfaches der Eingangsbildrate gewählt. |
| rc:max_reenc_times | U32 | RK_U32 | Maximale Anzahl erneuter Kodierungen eines Bildes. |
| prep:width | S32 | RK_S32 | Anzahl horizontaler Pixel des Eingabebildes, in Pixeln. |
| prep:height | S32 | RK_S32 | Anzahl vertikaler Pixel des Eingabebildes, in Pixeln. |
| prep:hor_stride | S32 | RK_S32 | Abstand zwischen zwei benachbarten Zeilen des Eingabebildes in vertikaler Richtung, in Bytes. |
| prep:ver_stride | S32 | RK_S32 | Anzahl der Zeilen zwischen Komponenten des Eingabebildes; Einheit: 1. |

<!-- source: EN PDF p38; unit 267 -->

| Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |
| --- | --- | --- | --- |
| prep:format | S32 | MppFrameFormat | Farbraumformat und Speicherlayout des Eingabebildes. |
| prep:color | S32 | MppFrameColorSpace | Farbraumbereich der Eingabebilddaten. |
| prep:range | S32 | MppFrameColorRange | Ob das Eingabebild den vollen oder den begrenzten Wertebereich verwendet. |
| prep:rotation | S32 | MppEncRotationCfg | Rotationseigenschaft des Eingabebildes; Standardwert 0 bedeutet keine Rotation. |
| prep:mirroring | S32 | RK_S32 | Spiegelungseigenschaft des Eingabebildes; standardmäßig keine Spiegelung. |

<!-- source: EN PDF p38; unit 268 -->

![Original-Technikabbildung, englisches PDF, Seite 38](/docs/rockchip-mpp/assets/en-p038-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum {
    MPP_FMT_YUV420SP       = (MPP_FRAME_FMT_YUV + 0),  /* YYYY... UV... (NV12)       */
    /*
     * A rockchip specific pixel format, without gap between pixel against
     * the P010_10LE/P010_10BE
     */
    MPP_FMT_YUV420SP_10BIT = (MPP_FRAME_FMT_YUV + 1),
    MPP_FMT_YUV422SP       = (MPP_FRAME_FMT_YUV + 2),  /* YYYY... UVUV... (NV16)     */
    MPP_FMT_YUV422SP_10BIT = (MPP_FRAME_FMT_YUV + 3),  ///< Not part of ABI
    MPP_FMT_YUV420P        = (MPP_FRAME_FMT_YUV + 4),  /* YYYY... U...V... (I420)    */
    MPP_FMT_YUV420SP_VU    = (MPP_FRAME_FMT_YUV + 5),  /* YYYY... VUVUVU... (NV21)   */
    MPP_FMT_YUV422P        = (MPP_FRAME_FMT_YUV + 6),  /* YYYY... UUU...VVV... (422P) */
    MPP_FMT_YUV422SP_VU    = (MPP_FRAME_FMT_YUV + 7),  /* YYYY... VUVUVU... (NV61)   */
    MPP_FMT_YUV422_YUYV    = (MPP_FRAME_FMT_YUV + 8),  /* YUYVYUYV... (YUY2)        */
    MPP_FMT_YUV422_UYVY    = (MPP_FRAME_FMT_YUV + 9),  /* UYVYUYVY... (UYVY)        */
    MPP_FMT_YUV422_YVYU    = (MPP_FRAME_FMT_YUV + 10), /* YVYUYVYU... (YVYU)        */
    MPP_FMT_YUV422_VYUY    = (MPP_FRAME_FMT_YUV + 11), /* VYUYVYUY... (VYUY)        */
    MPP_FMT_YUV400         = (MPP_FRAME_FMT_YUV + 12), /* YYYY...                   */
    MPP_FMT_YUV440SP       = (MPP_FRAME_FMT_YUV + 13), /* YYYY... UVUV...           */
    MPP_FMT_YUV411SP       = (MPP_FRAME_FMT_YUV + 14), /* YYYY... UV...             */
    MPP_FMT_YUV444SP       = (MPP_FRAME_FMT_YUV + 15), /* YYYY... UVUVUVUV...       */
    MPP_FMT_YUV444P        = (MPP_FRAME_FMT_YUV + 16), /* YYYY... UUUU... VVVV...   */
    MPP_FMT_YUV_BUTT,

    MPP_FMT_RGB565         = (MPP_FRAME_FMT_RGB + 0),  /* 16-bit RGB */
    MPP_FMT_BGR565         = (MPP_FRAME_FMT_RGB + 1),  /* 16-bit RGB */
    MPP_FMT_RGB555         = (MPP_FRAME_FMT_RGB + 2),  /* 15-bit RGB */
    MPP_FMT_BGR555         = (MPP_FRAME_FMT_RGB + 3),  /* 15-bit RGB */
    MPP_FMT_RGB444         = (MPP_FRAME_FMT_RGB + 4),  /* 12-bit RGB */
    MPP_FMT_BGR444         = (MPP_FRAME_FMT_RGB + 5),  /* 12-bit RGB */
    MPP_FMT_RGB888         = (MPP_FRAME_FMT_RGB + 6),  /* 24-bit RGB */
    MPP_FMT_BGR888         = (MPP_FRAME_FMT_RGB + 7),  /* 24-bit RGB */
    MPP_FMT_RGB101010      = (MPP_FRAME_FMT_RGB + 8),  /* 30-bit RGB */
    MPP_FMT_BGR101010      = (MPP_FRAME_FMT_RGB + 9),  /* 30-bit RGB */
    MPP_FMT_ARGB8888       = (MPP_FRAME_FMT_RGB + 10), /* 32-bit RGB */
    MPP_FMT_ABGR8888       = (MPP_FRAME_FMT_RGB + 11), /* 32-bit RGB */
    MPP_FMT_BGRA8888       = (MPP_FRAME_FMT_RGB + 12), /* 32-bit RGB */
    MPP_FMT_RGBA8888       = (MPP_FRAME_FMT_RGB + 13), /* 32-bit RGB */
    MPP_FMT_RGB_BUTT,

    MPP_FMT_BUTT,
} MppFrameFormat;
```

<!-- source: EN PDF p38; unit 269 -->

![Original-Technikabbildung, englisches PDF, Seite 38](/docs/rockchip-mpp/assets/en-p038-figure-02.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
/*
 * MPEG vs JPEG YUV range.
 */
typedef enum {
    MPP_FRAME_RANGE_UNSPECIFIED = 0,
    MPP_FRAME_RANGE_MPEG        = 1,    ///< the normal 219*2^(n-8) "MPEG" YUV ranges
    MPP_FRAME_RANGE_JPEG        = 2,    ///< the normal     2^n-1   "JPEG" YUV ranges
    MPP_FRAME_RANGE_NB,                ///< Not part of ABI
} MppFrameColorRange;
```

<!-- source: EN PDF p38; unit 270 -->

![Original-Technikabbildung, englisches PDF, Seite 38](/docs/rockchip-mpp/assets/en-p038-figure-03.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
/*
 * input frame rotation parameter
 * 0 - disable rotation
 * 1 - 90 degree
 * 2 - 180 degree
 * 3 - 270 degree
 */
typedef enum MppEncRotationCfg_t {
    MPP_ENC_ROT_0,
    MPP_ENC_ROT_90,
    MPP_ENC_ROT_180,
    MPP_ENC_ROT_270,
    MPP_ENC_ROT_BUTT
} MppEncRotationCfg;
```

<!-- source: EN PDF p38; unit 271 -->

![Original-Technikabbildung, englisches PDF, Seite 38](/docs/rockchip-mpp/assets/en-p038-figure-04.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
/*
 * input frame mirroring parameter
 * 0 - disable mirroring
 * 1 - horizontal mirroring
 * 2 - vertical mirroring
 */
```

<!-- source: EN PDF p39; unit 272 -->

| Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |
| --- | --- | --- | --- |
| codec:type | S32 | MppCodingType | Der MppEncCodecCfg entsprechende Protokolltyp; muss mit den Parametern der MppCtx-Initialisierungsfunktion mpp_init übereinstimmen. |
| h264:stream_type | S32 | RK_S32 | Typ des eingehenden H.264-Datenstromformats, standardmäßig 0.<br>0 — Annex-B-Format mit vorangestelltem Startcode 00 00 00 01.<br>1 — Format ohne Startcode.<br>Derzeit ist intern das Annex-B-Format fest eingestellt. |
| h264:profile | S32 | RK_S32 | Parameter profile_idc in SPS:<br>66 — Baseline-Profil.<br>77 — Main-Profil.<br>100 — High-Profil. |
| h264:level | S32 | RK_S32 | Parameter level_idc in SPS; 10 steht für Level 1.0:<br>10/11/12/13 – qcif@15fps / cif@7.5fps / cif@15fps / cif@30fps<br>20/21/22 – cif@30fps / half-D1@25fps / D1@12.5fps<br>30/31/32 – D1@25fps / 720p@30fps / 720p@60fps<br>40/41/42 – 1080p@30fps / 1080p@30fps / 1080p@60fps<br>50/51/52 – 4K@30fps / 4K@30fps / 4K@60fps<br>Üblicherweise wird Level 4.1 konfiguriert, um die Anforderungen zu erfüllen. |
| h264:cabac_en | S32 | RK_S32 | Vom Encoder verwendetes Entropiekodierungsformat:<br>0 – CAVLC, adaptive Kodierung mit variabler Länge.<br>1 – CABAC, adaptive arithmetische Kodierung. |
| h264:cabac_idc | S32 | RK_S32 | cabac_init_idc in der Protokollsyntax gilt bei cabac_en gleich 1; gültiger Bereich: 0~2. |
| h264:trans8x8 | S32 | RK_S32 | Aktivierungskennzeichen der 8x8-Transformation in der Protokollsyntax. |

<!-- source: EN PDF p39; unit 273 -->

![Original-Technikabbildung, englisches PDF, Seite 39](/docs/rockchip-mpp/assets/en-p039-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum {
    MPP_VIDEO_CodingUnused,                 /**< Value when coding is N/A */
    MPP_VIDEO_CodingAutoDetect,             /**< Autodetection of coding type */
    MPP_VIDEO_CodingMPEG2,                  /**< AKA: H.262 */
    MPP_VIDEO_CodingH263,                   /**< H.263 */
    MPP_VIDEO_CodingMPEG4,                  /**< MPEG-4 */
    MPP_VIDEO_CodingWMV,                    /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingRV,                     /**< all versions of Real Video */
    MPP_VIDEO_CodingAVC,                    /**< H.264/AVC */
    MPP_VIDEO_CodingMJPEG,                  /**< Motion JPEG */
    MPP_VIDEO_CodingVP8,                    /**< VP8 */
    MPP_VIDEO_CodingVP9,                    /**< VP9 */
    MPP_VIDEO_CodingVC1 = 0x01000000,       /**< Windows Media Video (WMV1,WMV2,WMV3)*/
    MPP_VIDEO_CodingFLV1,                   /**< Sorenson H.263 */
    MPP_VIDEO_CodingDIVX3,                  /**< DIVX3 */
    MPP_VIDEO_CodingVP6,
    MPP_VIDEO_CodingHEVC,                   /**< H.265/HEVC */
    MPP_VIDEO_CodingAVSPLUS,                /**< AVS+ */
    MPP_VIDEO_CodingAVS,                    /**< AVS profile=0x20 */
    MPP_VIDEO_CodingAVS2,                   /**< AVS2 */
    MPP_VIDEO_CodingAV1,                    /**< av1 */
    MPP_VIDEO_CodingKhronosExtensions = 0x6F000000, /**< Reserved region for introducing Khronos Standard Extensions */
    MPP_VIDEO_CodingVendorStartUnused = 0x7F000000, /**< Reserved region for introducing Vendor Extensions */
    MPP_VIDEO_CodingMax = 0x7FFFFFFF
} MppCodingType;
```

<!-- source: EN PDF p39; unit 274 -->

![Original-Technikabbildung, englisches PDF, Seite 39](/docs/rockchip-mpp/assets/en-p039-figure-02.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum h264_profile_t {
    H264_PROFILE_FREXT_CAVLC444 = 44,  //!< YUV 4:4:4/14 "CAVLC 4:4:4"
    H264_PROFILE_BASELINE      = 66,  //!< YUV 4:2:0/8 "Baseline"
    H264_PROFILE_MAIN          = 77,  //!< YUV 4:2:0/8 "Main"
    H264_PROFILE_EXTENDED      = 88,  //!< YUV 4:2:0/8 "Extended"
    H264_PROFILE_HIGH          = 100, //!< YUV 4:2:0/8 "High"
    H264_PROFILE_HIGH10        = 110, //!< YUV 4:2:0/10 "High 10"
    H264_PROFILE_HIGH422       = 122, //!< YUV 4:2:2/10 "High 4:2:2"
    H264_PROFILE_HIGH444       = 244, //!< YUV 4:4:4/14 "High 4:4:4"
    H264_PROFILE_MVC_HIGH      = 118, //!< YUV 4:2:0/8 "Multiview High"
    H264_PROFILE_STEREO_HIGH   = 128  //!< YUV 4:2:0/8 "Stereo High"
} H264Profile;
```

<!-- source: EN PDF p40; unit 275 -->

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |  |
|  | h264:const_intra | S32 | RK_S32 | 0 — deaktivieren; in den Profilen Baseline/Main immer deaktiviert. |  |
|  | h264:scaling_list | S32 | RK_S32 | 1 — aktivieren; im High-Profil kann die Aktivierung gewählt werden. |  |
|  | h264:cb_qp_offset | S32 | RK_S32 | Aktivierungskennzeichen des Modus constrained_intra_pred_mode in der Protokollsyntax. |  |
|  | h264:cr_qp_offset | S32 | RK_S32 | 0 — aus, 1 — ein. |  |
|  | h264:dblk_disable | S32 | RK_S32 | Modus scaling_list_matrix in der Protokollsyntax. |  |
|  | h264:dblk_alpha | S32 | RK_S32 | 0 — flache Matrix, 1 — Standardmatrix. |  |
|  | h264:dblk_beta | S32 | RK_S32 | Wert deblock_offset_beta in der Protokollsyntax. |  |
|  | h264:qp_init | S32 | RK_S32 | Gültiger Bereich: [-6, 6]. |  |
|  | h264:qp_max | S32 | RK_S32 | Anfänglicher QP-Wert. Unter normalen Umständen nicht konfigurieren. |  |
|  | h264:qp_min | S32 | RK_S32 | Maximaler QP-Wert. Unter normalen Umständen nicht konfigurieren. |  |
|  | h264:qp_max_i | S32 | RK_S32 | Minimaler QP-Wert. Unter normalen Umständen nicht konfigurieren. |  |
|  | h264:qp_min_i | S32 | RK_S32 | Maximaler QP-Wert eines I-Frames. Unter normalen Umständen nicht konfigurieren. |  |
|  | h264:qp_step | S32 | RK_S32 | Minimaler QP-Wert eines I-Frames. Unter normalen Umständen nicht konfigurieren. |  |
|  | h265:profile | S32 | RK_S32 | Stärke der QP-Änderung auf Frame-Ebene zwischen zwei benachbarten Frames. |  |
|  | h265:level | S32 | RK_S32 | Parameter profile_idc in VPS: |  |
|  | h265:scaling_list | S32 | RK_S32 | Fest auf 1 eingestellt, Main-Profil. |  |
|  | h265:cb_qp_offset | S32 | RK_S32 | Parameter level_idc in VPS. |  |
|  | h265:cr_qp_offset | S32 | RK_S32 | Modus scaling_list_matrix in der Protokollsyntax. |  |
|  | h265:dblk_disable | S32 | RK_S32 | 0 — flache Matrix, 1 — Standardmatrix. |  |
|  | h265:dblk_alpha | S32 | RK_S32 | Wert chroma_cb_qp_offset in der Protokollsyntax. |  |
|  | h265:dblk_beta | S32 | RK_S32 | Gültiger Bereich: [-12, 12]. |  |
|  | h265:qp_init | S32 | RK_S32 | Wert chroma_cr_qp_offset in der Protokollsyntax. |  |
|  | h265:qp_max | S32 | RK_S32 | Gültiger Bereich: [-12, 12]. |  |
|  | h265:qp_min | S32 | RK_S32 | Kennzeichen deblock_disable in der Protokollsyntax; gültiger Bereich: [0, 2]. |  |
|  |  |  |  |  |  |

<!-- source: EN PDF p41; unit 276 -->

| Parameterzeichenkette | Schnittstelle | Tatsächlicher Typ | Beschreibung |
| --- | --- | --- | --- |
| h265:qp_max_i | S32 | RK_S32 | 0 — Deblocking ist aktiviert. |
| h265:qp_min_i | S32 | RK_S32 | Minimaler QP-Wert eines I-Frames. Unter normalen Umständen nicht konfigurieren. |
| h265:qp_step | S32 | RK_S32 | Stärke der QP-Änderung auf Frame-Ebene zwischen zwei benachbarten Frames. |
| h265:qp_delta_ip | S32 | RK_S32 | QP-Differenz zwischen dem I-Frame und dem vorhergehenden P-Frame. |
| jpeg: quant | S32 | RK_S32 | Stufe des vom JPEG-Encoder verwendeten Quantisierungsparameters. Der Encoder besitzt insgesamt 11 Stufen von Quantisierungskoeffiziententabellen, von 0 bis 10; die Bildqualität steigt von schlecht zu gut. |
| split:mode | U32 | MppEncSplitMode | Slice-Aufteilungsmodus für H.264/H.265:<br>0 — keine Aufteilung.<br>1 — BY_BYTE teilt anhand der Slice-Größe auf.<br>2 — BY_CTU teilt anhand der Anzahl von Makroblöcken oder CTUs auf. |
| split:arg | U32 | RK_U32 | Parameter der Slice-Aufteilung:<br>Im Modus BY_BYTE gibt der Parameter die maximale Größe jedes Slices an.<br>Im Modus BY_CTU gibt er die Anzahl von Makroblöcken oder CTUs in jedem Slice an. |

<!-- source: EN PDF p41; unit 277 -->

![Original-Technikabbildung, englisches PDF, Seite 41](/docs/rockchip-mpp/assets/en-p041-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
typedef enum MppEncSplitMode_e {
    MPP_ENC_SPLIT_NONE,
    MPP_ENC_SPLIT_BY_BYTE,
    MPP_ENC_SPLIT_BY_CTU,
} MppEncSplitMode;
```

<!-- source: EN PDF p41; unit 278 -->

Weitere Zeichenfolgen und Parameter werden später ergänzt.

<!-- source: EN PDF p41; unit 279 -->

#### 3.5.2 Weitere Steuerbefehle

<!-- source: EN PDF p41; unit 280 -->

Der Aufzählungstyp MpiCmd in rk_mpi_cmd.h definiert die Befehlskennungen der Steuerschnittstelle. Die Befehle für den Encoder und den Kodierungsprozess sind nachfolgend aufgeführt:

<!-- source: EN PDF p42; unit 281 -->

![Original-Technikabbildung, englisches PDF, Seite 42](/docs/rockchip-mpp/assets/en-p042-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
MPP_ENC_CMD_BASE              = CMD_MODULE_CODEC | CMD_CTX_ID_ENC,
/* basic encoder setup control */
MPP_ENC_SET_CFG,              /* set MppEncCfg structure */
MPP_ENC_GET_CFG,              /* get MppEncCfg structure */
MPP_ENC_SET_PREP_CFG,         /* deprecated set MppEncPrepCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_PREP_CFG,         /* deprecated get MppEncPrepCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_RC_CFG,           /* deprecated set MppEncRcCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_RC_CFG,           /* deprecated get MppEncRcCfg structure, use MPP_ENC_GET_CFG instead */
MPP_ENC_SET_CODEC_CFG,        /* deprecated set MppEncCodecCfg structure, use MPP_ENC_SET_CFG instead */
MPP_ENC_GET_CODEC_CFG,        /* deprecated get MppEncCodecCfg structure, use MPP_ENC_GET_CFG instead */
/* runtime encoder setup control */
MPP_ENC_SET_IDR_FRAME,        /* next frame will be encoded as intra frame */
MPP_ENC_SET_OSD_LEGACY_0,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_1,     /* deprecated */
MPP_ENC_SET_OSD_LEGACY_2,     /* deprecated */
MPP_ENC_GET_HDR_SYNC,         /* get vps / sps / pps which has better sync behavior parameter is MppPacket */
MPP_ENC_GET_EXTRA_INFO,       /* deprecated */
MPP_ENC_SET_SEI_CFG,          /* SEI: Supplement Enhancement Information, parameter is MppSeiMode */
MPP_ENC_GET_SEI_DATA,         /* SEI: Supplement Enhancement Information, parameter is MppPacket */
MPP_ENC_PRE_ALLOC_BUFF,       /* allocate buffers before encoding */
MPP_ENC_SET_QP_RANGE,         /* used for adjusting qp range, the parameter can be 1 or 2 */
MPP_ENC_SET_ROI_CFG,          /* set MppEncROICfg structure */
MPP_ENC_SET_CTU_QP,           /* for H265 Encoder,set CTU's size and QP */
```

<!-- source: EN PDF p42; unit 282 -->

Die Befehle von MPP_ENC_CMD_BASE bis MPP_ENC_CMD_END gehören zur Encoder-Steuerschnittstelle. MPP_ENC_SET/GET_CFG wurde in Abschnitt 3.5.1 bereits als grundlegender Konfigurationsbefehl vorgestellt. Die übrigen Befehle werden nachfolgend kurz erläutert. Sie sind von der Encoder-Hardware abhängig und werden nur von bestimmten Hardwarevarianten unterstützt.

<!-- source: EN PDF p42; unit 283 -->

Im beschriebenen Stand der Quelle unterstützt MPP Encoder-Hardware der Familien vepu und rkvenc. Die vepu-Familie unterstützt H.264-, vp8- und jpeg-Kodierung und ist in den meisten RK-Chips vorhanden. Laut Quelle unterstützt rkvenc ausschließlich H.264 und ist nur auf den SoCs RV1109/RV1126 verfügbar; es bietet mehr Kodierungsfunktionen als vepu. Dies ist die historische Beschreibung der Quelle, keine Aussage über den aktuellen Umfang aller Plattformen.

<!-- source: EN PDF p42; unit 284 -->

Kurzbeschreibung einiger CMD-Befehle:

<!-- source: EN PDF p42; unit 285 -->

MPP_ENC_SET_PREP_CFG/ MPP_ENC_GET_PREP_CFG MPP_ENC_SET_RC_CFG/ MPP_ENC_GET_RC_CFG MPP_ENC_SET_CODEC_CFG/ MPP_ENC_GET_CODEC_CFG

<!-- source: EN PDF p42; unit 286 -->

Veraltete Befehle, zur Vorwärtskompatibilität beibehalten; nicht verwenden.

<!-- source: EN PDF p42; unit 287 -->

MPP_ENC_SET_IDR_FRAME

<!-- source: EN PDF p42; unit 288 -->

Der Befehl hat keinen Parameter und fordert beim Encoder einen IDR-Frame an. Nach Empfang der Anforderung kodiert der Encoder den nächsten Frame als IDR-Frame. Von sämtlicher Hardware unterstützt.

<!-- source: EN PDF p42; unit 289 -->

MPP_ENC_SET_OSD_LEGACY_0 MPP_ENC_SET_OSD_LEGACY_1 MPP_ENC_SET_OSD_LEGACY_2

<!-- source: EN PDF p42; unit 290 -->

Veraltete Befehle, zur Vorwärtskompatibilität beibehalten; nicht verwenden.

<!-- source: EN PDF p42; unit 291 -->

MPP_ENC_GET_HDR_SYNC/ MPP_ENC_GET_EXTRA_INFO

<!-- source: EN PDF p42; unit 292 -->

Befehle zum separaten Abruf der Headerdaten des Bitstroms. MPP_ENC_GET_EXTRA_INFO ist ein alter Befehl und wird nicht empfohlen.

<!-- source: EN PDF p42; unit 293 -->

Der Eingabeparameter von MPP_ENC_GET_HDR_SYNC ist ein MppPacket. Der externe Benutzer muss Speicher zuweisen, ihn als MppPacket kapseln und über control an den Encoder übergeben. Bei Rückkehr der Steuerschnittstelle ist die Datenkopie abgeschlossen; der Vorgang ist threadsicher. Der Aufruf erfolgt nach Abschluss der grundlegenden Encoder-Konfiguration. Den zuvor zugewiesenen MppPacket muss der Benutzer selbst freigeben. Der Eingabeparameter von MPP_ENC_GET_EXTRA_INFO ist ein MppPacket*: Damit wird der interne MppPacket des Encoders für den Zugriff abgerufen. Auch dieser Aufruf erfolgt nach Abschluss der grundlegenden Encoder-Konfiguration. Der hier erhaltene MppPacket gehört zum internen Speicher von MPP und darf nicht vom Benutzer freigegeben werden.

<!-- source: EN PDF p43; unit 294 -->

Bei Mehrthreadbetrieb kann der über MPP_ENC_GET_EXTRA_INFO erhaltene MppPacket während des Lesens durch andere Steueraufrufe verändert werden. Der Befehl ist daher nicht threadsicher und dient nur der Kompatibilität mit der alten vpu_api. Er soll nicht mehr verwendet werden.

<!-- source: EN PDF p43; unit 295 -->

MPP_ENC_SET_SEI_CFG/MPP_ENC_GET_SEI_DATA

<!-- source: EN PDF p43; unit 296 -->

Veraltete Befehle, zur Vorwärtskompatibilität beibehalten; nicht verwenden.

<!-- source: EN PDF p43; unit 297 -->

MPP_ENC_PRE_ALLOC_BUFF/MPP_ENC_SET_QP_RANGE/MPP_ENC_SET_ROI_CFG/ MPP_ENC_SET_CTU_QP

<!-- source: EN PDF p43; unit 298 -->

Veraltete Befehle, zur Vorwärtskompatibilität beibehalten; nicht verwenden.

<!-- source: EN PDF p43; unit 299 -->

MPP_ENC_GET_RC_API_ALL

<!-- source: EN PDF p43; unit 300 -->

API-Informationen zu sämtlichen derzeit von MPP unterstützten Bitratenregelungsstrategien abfragen. Einen RcApiQueryAll*-Zeiger übergeben; beim Rücksprung wird die Struktur gefüllt.

<!-- source: EN PDF p43; unit 301 -->

MPP_ENC_GET_RC_API_BY_TYPE

<!-- source: EN PDF p43; unit 302 -->

API-Informationen aller Bitratenregelungsstrategien eines angegebenen MppCodingType abfragen. RcApiQueryType* übergeben und MppCodingType angeben; die Struktur wird beim Rücksprung gefüllt.

<!-- source: EN PDF p43; unit 303 -->

MPP_ENC_SET_RC_API_CFG

<!-- source: EN PDF p43; unit 304 -->

API einer externen Bitratenregelungsstrategie mit RcImplApi* registrieren. Die Funktionszeiger der Struktur definieren das Verhalten des Plug-ins. Die registrierte Strategie kann anschließend abgefragt und aktiviert werden.

<!-- source: EN PDF p43; unit 305 -->

MPP_ENC_GET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 306 -->

API-Informationen der aktuell verwendeten Bitratenregelungsstrategie abfragen. RcApiBrief* übergeben; die Struktur wird beim Rücksprung gefüllt.

<!-- source: EN PDF p43; unit 307 -->

MPP_ENC_SET_RC_API_CURRENT

<!-- source: EN PDF p43; unit 308 -->

API einer Bitratenregelungsstrategie mit angegebenem Namen aktivieren. RcApiBrief* übergeben; der Encoder sucht das darin als Zeichenkette angegebene API und aktiviert es als aktuelle Strategie.

<!-- source: EN PDF p43; unit 309 -->

MPP_ENC_SET_HEADER_MODE/MPP_ENC_GET_HEADER_MODE

<!-- source: EN PDF p43; unit 310 -->

Laut Quellbeschreibung Ausgabeart der SEI-Debuginformationen des H.264/H.265-Encoders konfigurieren beziehungsweise abfragen. Der Debugschalter soll künftig durch Umgebungsvariablen ersetzt werden; nicht verwenden. Die Abweichung zum Befehlsnamen HEADER_MODE bleibt dokumentiert.

<!-- source: EN PDF p43; unit 311 -->

MPP_ENC_SET_SPLIT/ MPP_ENC_GET_SPLIT

<!-- source: EN PDF p43; unit 312 -->

Slice-Aufteilung des H.264/H265-Encoders konfigurieren beziehungsweise abfragen. Durch split:mode und split:arg in MppEncCfg ersetzt; nicht verwenden.

<!-- source: EN PDF p43; unit 313 -->

MPP_ENC_SET_REF_CFG

<!-- source: EN PDF p43; unit 314 -->

Erweiterten Referenzframe-Modus konfigurieren. Standardmäßig nicht erforderlich; für besondere Beziehungen zwischen lang- und kurzfristigen Referenzframes vorgesehen. Dies ist eine erweiterte Schnittstelle, zu der die Quelle weitere Dokumentation ankündigt.

<!-- source: EN PDF p43; unit 315 -->

MPP_ENC_SET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 316 -->

Der Befehlsparameter MppEncOSDPlt konfiguriert die OSD-Palette der rkvenc-Hardware. Die Quelle wiederholt diese Beschreibung zweimal. Üblicherweise einmal zu Beginn konfigurieren und während der gesamten Codierung dieselbe Palette verwenden. Nur RV1109/RV1126 unterstützt.

<!-- source: EN PDF p44; unit 317 -->

MPP_ENC_GET_OSD_PLT_CFG

<!-- source: EN PDF p44; unit 318 -->

Laut Quelltext zum separaten Abruf der Bitstream-Headerdaten; MPP_ENC_GET_EXTRA_INFO ist ein alter, nicht empfohlener Befehl. Die Abweichung zur Überschrift GET_OSD_PLT_CFG bleibt erhalten.

<!-- source: EN PDF p44; unit 319 -->

MPP_ENC_SET_OSD_DATA_CFG

<!-- source: EN PDF p44; unit 320 -->

MppEncOSDData konfiguriert OSD-Daten der rkvenc-Hardware; die Quelle wiederholt diese Aussage. Für jeden Frame und nach jeder Framecodierung erneut konfigurieren. Der Befehl wurde durch KEY_OSD_DATA in dem von MppFrame getragenen MppMeta ersetzt und wird nicht mehr verwendet.

<!-- source: EN PDF p44; unit 321 -->

### 3.6 Wichtige Hinweise zur Encoderverwendung

<!-- source: EN PDF p44; unit 322 -->

#### 3.6.1 Breite, Höhe und Stride des Eingangsbilds

<!-- source: EN PDF p44; unit 323 -->

Breiten- und Höheneinstellungen müssen der Speicheranordnung der Bilddaten entsprechen. Für ein YUV420-Bild mit 1920x1080 ergeben sich unter Bezug auf die MppFrame-Parameter aus Abbildung 7 folgende zwei Fälle.

<!-- source: EN PDF p44; unit 324 -->

![Original-Technikabbildung, englisches PDF, Seite 44](/docs/rockchip-mpp/assets/en-p044-figure-01.png)

<!-- source: EN PDF p45; unit 325 -->

![Original-Technikabbildung, englisches PDF, Seite 45](/docs/rockchip-mpp/assets/en-p045-figure-01.png)

<!-- source: EN PDF p45; unit 326 -->

Abbildung 18: Speicheranordnung des Encoder-Eingangsframes

<!-- source: EN PDF p45; unit 327 -->

Links: Luminanzbreite 1920, Höhe 1080. Luminanz- und Chromadaten schließen nicht direkt aneinander an; dazwischen liegen 8 Leerzeilen.

<!-- source: EN PDF p45; unit 328 -->

Hier beträgt der horizontale Stride 1920 und der vertikale 1088. Die Anwendung allokiert und befüllt 1920*1088*3/2 Speicher. Mit width 1920, height 1080, horizontal stride 1920 und vertical stride 1088 kann regulär codiert werden.

<!-- source: EN PDF p45; unit 329 -->

Rechts: Luminanzbreite 1920, Höhe 1080. Luminanz- und Chromadaten schließen ohne Leerzeilen direkt aneinander an.

<!-- source: EN PDF p45; unit 330 -->

Hier ist der horizontale Stride 1920 und der vertikale 1080. Der Encoder greift jedoch mit 16er-Ausrichtung zu: Am unteren Luminanzrand werden Chromadaten und am unteren Chromarand Daten außerhalb dieses Bereichs gelesen. Daher zusätzlichen Padding-Speicher bereitstellen: 1920*1080*3/2+1920*4, damit kein Zugriff auf unallokierten Speicher erfolgt.

<!-- source: EN PDF p45; unit 331 -->

#### 3.6.2 Eingabe und Erweiterung von Encoder-Steuerinformationen

<!-- source: EN PDF p45; unit 332 -->

Steuerinformationen werden auf zwei Arten übergeben:

<!-- source: EN PDF p45; unit 333 -->

Globale Informationen wie Bitrate und Bildabmessungen wirken auf den gesamten Encoder und Codierprozess. Temporäre Informationen wie frameweises OSD oder Benutzerdaten wirken nur auf die Codierung eines einzelnen Frames.

<!-- source: EN PDF p45; unit 334 -->

Die erste Gruppe wird vorwiegend über control konfiguriert, die zweite über die von MppFrame getragenen MppMeta-Daten.

<!-- source: EN PDF p45; unit 335 -->

Künftige Erweiterungen der Steuerinformationen folgen diesen beiden Regeln.

<!-- source: EN PDF p46; unit 336 -->

#### 3.6.3 Ein- und Ausgabeablauf des Encoders

<!-- source: EN PDF p46; unit 337 -->

Laut Quelle unterstützt der Encoder-Eingang derzeit nur blockierende Aufrufe. Der Ausgang unterstützt blockierende und nichtblockierende Aufrufe, standardmäßig nichtblockierend. Der Datenabruf kann deshalb erfolglos bleiben; bei der Nutzung berücksichtigen.

<!-- source: EN PDF p46; unit 338 -->

#### 3.6.4 Plug-in-Mechanismus für eigene Bitratenregelungsstrategien

<!-- source: EN PDF p46; unit 339 -->

MPP erlaubt eigene Bitratenregelungsstrategien. RcImplApi definiert mehrere Hook-Funktionen im Codierablauf, um benutzerdefinierte Verarbeitung an festgelegten Stellen einzufügen. Als Beispiel dienen die Standardstrategien für H.264/H.265, Strukturen default_h264e/default_h265e.

<!-- source: EN PDF p46; unit 340 -->

Der Plug-in-Mechanismus ist in MPP vorgesehen, Schnittstelle und Ablauf sind jedoch instabil; weitere häufige Änderungen sind absehbar. Nur für Nutzer empfohlen, die den Code lesen, verstehen und den Mechanismus fortlaufend pflegen können. Für allgemeine Nutzer nicht empfohlen.

<!-- source: EN PDF p46; unit 341 -->

## 4\. MPP-Demoprogramme

<!-- source: EN PDF p46; unit 342 -->

Die Demoprogramme ändern sich schnell. Die Beschreibung dient nur als Referenz; maßgeblich ist die tatsächliche Ausführung. Die Quellbeispiele basieren auf Android 32bit.

<!-- source: EN PDF p46; unit 343 -->

### 4.1 Decoder-Demo

<!-- source: EN PDF p46; unit 344 -->

Die Decoder-Demos umfassen mpi_dec_test: die einthreadige mpi_dec_test mit decode_put_packet/decode_get_frame, die mehrthreadige mpi_dec_mt_test und die Mehrinstanzvariante mpi_dec_multi_test.

<!-- source: EN PDF p46; unit 345 -->

Android-Beispiel: Zunächst mpi_dec_test direkt ausführen; die Hilfe erscheint wie nachfolgend im Log.

<!-- source: EN PDF p47; unit 346 -->

![Original-Technikabbildung, englisches PDF, Seite 47](/docs/rockchip-mpp/assets/en-p047-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
--------- beginning of main
08-16 05:00:51.320  2150  2150 I mpi_dec_utils: usage: mpi_dec_test [options]
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -i    input_file   input bitstream file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -o    output_file  output decoded frame file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -w    width        the width of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -h    height       the height of input bitstream
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -t    type         input stream coding type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -f    format       output frame format type
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -n    frame_number max output frame number
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -s    instance_nb  number of instances
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -v    trace option q - quiet f - show fps
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -slt  slt file     slt verify data file
08-16 05:00:51.321  2150  2150 I mpi_dec_utils: -help help         show help
08-16 05:00:51.321  2150  2150 I mpi      : mpp coding type support list:
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 05:00:51.321  2150  2150 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 05:00:51.321  2150  2150 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 05:00:51.322  2150  2150 I mpi      : type: enc id 1 coding: vp8           id 9
```

<!-- source: EN PDF p47; unit 347 -->

Die Hilfe besteht aus zwei Teilen: Befehlsparameter von mpi_dec_test und unterstützte Codiertypen der Eingangsbitstreamdatei.

<!-- source: EN PDF p47; unit 348 -->

Die Befehlsparameter folgen.

<!-- source: EN PDF p47; unit 349 -->

| Befehlsparameter | Beschreibung |
| --- | --- |
| -i | Datei des Eingangsbitstroms. |
| -o | Ausgabedatei der dekodierten Frames. |
| -w | Breite des Eingangsbitstroms in Pixeln. |
| -h | Höhe des Eingangsbitstroms in Pixeln. |
| -t | Kodierungstyp des Eingangsbitstroms. |
| -f | Formattyp des Ausgabeframes, standardmäßig NV12. |
| -n | Maximale Anzahl von Ausgabeframes. Ist der Eingangsbitstrom zu lang, werden nur die ersten n Frames dekodiert. |
| -s | Anzahl der Instanzen, standardmäßig 1. |
| -v | Trace-Option: q — ohne Ausgabe; f — fps anzeigen. |
| -slt | slt-Prüfdatendatei zum dekodierten Ausgabeframe. |
| -help | Hilfe anzeigen. |

<!-- source: EN PDF p48; unit 350 -->

Bei mpi_dec_test sind Eingangsdatei (i) und Codiertyp (t) Pflichtparameter. Ausgangsdatei (o), Breite (w), Höhe (h), Anzahl decodierter Frames (n) und weitere Parameter sind optional und weniger bestimmend.

<!-- source: EN PDF p48; unit 351 -->

In der Ausgabe bzw. den Parametern von mpi_dec_test: Die slt-Verifikationsdatei enthält aus den Ausgangsframes abgeleitete CRC-Codes, siehe utils/utils.c. Sie ist meist nur wenige kB groß. Beim slt-Chiptest ersetzt ihr Vergleich den Vergleich vollständiger Framedateien und verkürzt den Testzyklus deutlich.

<!-- source: EN PDF p48; unit 352 -->

Die folgende Ausgabe nennt die Formate der MPP-Bibliothek: MPEG2/4-, H.263/4/5- und VP8/9-Decodierung. Die Zahl nach id entspricht dem -t-Wert des Formats und stammt aus OMX-Definitionen. HEVC- und AVS-Werte unterscheiden sich deutlich von den übrigen; dies beachten.

<!-- source: EN PDF p48; unit 353 -->

Beispiel: 30 Frames aus ocrean.h264 unter /data/ decodieren. Befehl:

<!-- source: EN PDF p48; unit 354 -->

```text
mpi_dec_test -t 7 -i /data/ocrean.h264 -n 30
```

<!-- source: EN PDF p48; unit 355 -->

Dabei bedeutet -t 7 einen H.264-Bitstream, -i die Eingangsdatei und -n 30 das Decodieren von 30 Frames. Bei regulärem Ablauf folgt folgendes Ergebnis.

<!-- source: EN PDF p48; unit 356 -->

![Original-Technikabbildung, englisches PDF, Seite 48](/docs/rockchip-mpp/assets/en-p048-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
08-17 11:58:03.511  2801  2801 I mpi_dec_utils: input file /data/ocrean.h264 size 38052414
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: cmd parse result:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: input  file name: /data/ocrean.h264
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: output file name:
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: width      :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: height     :    0
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: type       :    7
08-17 11:58:03.512  2801  2801 I mpi_dec_utils: max frames :   30
08-17 11:58:03.512  2801  2801 I mpi_dec_test: mpi_dec_test start
08-17 11:58:03.512  2801  2801 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:58:03.512  2801  2801 I mpi_dec_test: 0xf1c40730 mpi_dec_test decoder test start w 0 h 0 type 7
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode_get_frame get info changed found
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decoder require buffer w:h [1920:1088] stride [1920:1088] buf_size 4177920
08-17 11:58:03.538  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 0
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 1
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 2
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 3
08-17 11:58:03.585  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 4
08-17 11:58:03.586  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 5
08-17 11:58:03.601  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 6
08-17 11:58:03.608  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 7
08-17 11:58:03.616  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 8
08-17 11:58:03.624  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 9
08-17 11:58:03.640  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 10
08-17 11:58:03.647  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 11
08-17 11:58:03.655  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 12
08-17 11:58:03.664  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 13
08-17 11:58:03.673  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 14
08-17 11:58:03.681  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 15
08-17 11:58:03.689  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 16
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 17
08-17 11:58:03.698  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 18
08-17 11:58:03.706  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 19
08-17 11:58:03.713  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 20
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 21
08-17 11:58:03.726  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 22
08-17 11:58:03.734  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 23
08-17 11:58:03.742  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 24
08-17 11:58:03.749  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 25
08-17 11:58:03.756  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 26
08-17 11:58:03.764  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 27
08-17 11:58:03.771  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 28
08-17 11:58:03.778  2801  2805 I mpi_dec_test: 0xf1c40730 decode get frame 29
08-17 11:58:03.778  2801  2801 I mpi_dec_test: decode 30 frames time 263 ms delay 69 ms fps 113.99
08-17 11:58:03.781  2801  2801 I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p48; unit 357 -->

Die Ausgabe enthält Versionsinformationen der MPP-Bibliothek:

<!-- source: EN PDF p48; unit 358 -->

```text
I mpp_info: mpp version: 6cc173d1 author: Ding Wei 2022-08-29 [hal_avsd]: Fix crash on avsd
ref err path
```

<!-- source: EN PDF p49; unit 359 -->

```text
I mpi_dec_test: 0xeebc01c0 decode_get_frame get info changed found
```

<!-- source: EN PDF p49; unit 360 -->

Die mpi_dec_test-Ausgabe meldet ein info-change-Ereignis des MPP-Decoders.

<!-- source: EN PDF p49; unit 361 -->

```text
I mpi_dec_test: 0xeebc01c0 decoder require buffer w:h [1920:1080] stride [1920:1088]
buf_size 4177920
```

<!-- source: EN PDF p49; unit 362 -->

Die mpi_dec_test-Ausgabe zeigt die vom MPP-Decoder benötigten Bildspeicherbedingungen.

<!-- source: EN PDF p49; unit 363 -->

```text
I mpi_dec_test: 0xf1c40730 decode get frame 0
```

<!-- source: EN PDF p49; unit 364 -->

Die mpi_dec_test-Ausgabe zeigt reguläres Decodieren und Ausgeben von Bildern.

<!-- source: EN PDF p49; unit 365 -->

```text
I mpi_dec_test: decode 30 frames time 263ms delay 69ms fps 113.99
```

<!-- source: EN PDF p49; unit 366 -->

In der Ausgabe bzw. den Parametern von mpi_dec_test: Laut Quellbeispiel decodierte der Decoder 30 Frames in 263ms, mit 69ms Erstframelatenz und 113.99 fps. Dies sind Quellwerte, keine ArmSoM-Messungen.

<!-- source: EN PDF p49; unit 367 -->

```text
I mpi_dec_test: test success max memory 19.92 MB
```

<!-- source: EN PDF p49; unit 368 -->

In der Ausgabe bzw. den Parametern von mpi_dec_test: Laut Quellausgabe beträgt der maximale Decodierspeicher 19.92 MB.

<!-- source: EN PDF p49; unit 369 -->

Der ausführliche Decoder-Democode steht in test/mpi_dec_test.c.

<!-- source: EN PDF p49; unit 370 -->

### 4.2 Encoder-Demo

<!-- source: EN PDF p49; unit 371 -->

Die Encoder-Demos der Reihe mpi_enc_test umfassen die einthreadige mpi_enc_test und die Mehrinstanzvariante mpi_enc_multi_test.

<!-- source: EN PDF p49; unit 372 -->

Im Android-Beispiel zunächst mpi_enc_test direkt ausführen; die Ausgabe folgt.

<!-- source: EN PDF p50; unit 373 -->

![Original-Technikabbildung, englisches PDF, Seite 50](/docs/rockchip-mpp/assets/en-p050-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: usage: mpi_enc_test [options]
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -i       input_file    input frame file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -o       output_file   output encoded bitstream file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -w       width         the width of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -h       height        the height of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -hstride hor_stride    the horizontal stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -vstride ver_stride    the vertical stride of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -f       format        the format of input picture
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -t       type          output stream coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -tsrc    source type   input file source coding type
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -n       max frame number max encoding frame number
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -g       gop reference mode gop_mode:gop_len:vi_len
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -rc      rate control mode set rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -bps     bps target:min:max set target/min/max bps and rc_mode
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -fps     in/output fps set input and output frame rate
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -q       quality control set qp_init/min/max/min_i/max_i
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -s       instance_nb   number of instances
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -v       trace option  q - quiet f - show fps
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -l       loop count    looping times for each frame
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -ini     ini file      encoder extra ini config file
08-16 10:41:16.339  2526  2526 I mpi_enc_utils: -slt     slt file      slt verify data file
08-16 10:41:16.339  2526  2526 I mpi      : mpp coding type support list:
08-16 10:41:16.339  2526  2526 I mpi      : type: dec id 0 coding: mpeg2         id 2
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: mpeg4         id 4
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.263         id 3
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: h.265/HEVC    id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: VP9           id 10
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs+          id 16777221
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: avs2          id 16777223
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: dec id 0 coding: av1           id 16777224
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h.264/AVC     id 7
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: jpeg          id 8
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: h265          id 16777220
08-16 10:41:16.340  2526  2526 I mpi      : type: enc id 1 coding: vp8           id 9
08-16 10:41:16.340  2526  2526 I mpi      : mpp color support list:
08-16 10:41:16.340  2526  2526 I mpi      : color: id 0     0x00000 YUV420SP,         NV12
08-16 10:41:16.340  2526  2526 I mpi      : color: id 1     0x00001 YUV420SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 2     0x00002 YUV422SP,         NV24
08-16 10:41:16.340  2526  2526 I mpi      : color: id 3     0x00003 YUV422SP-10bit
08-16 10:41:16.340  2526  2526 I mpi      : color: id 4     0x00004 YUV420P,          I420
08-16 10:41:16.340  2526  2526 I mpi      : color: id 5     0x00005 YUV420SP,         NV21
08-16 10:41:16.340  2526  2526 I mpi      : color: id 6     0x00006 YUV422P,          422P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 7     0x00007 YUV422SP,         NV42
08-16 10:41:16.340  2526  2526 I mpi      : color: id 8     0x00008 YUV422-YUYV,      YUY2
08-16 10:41:16.340  2526  2526 I mpi      : color: id 10    0x0000a YUV422-UYVY,      UYVY
08-16 10:41:16.340  2526  2526 I mpi      : color: id 12    0x0000c YUV400-Y8,        Y800
08-16 10:41:16.340  2526  2526 I mpi      : color: id 15    0x0000f YUV444SP
08-16 10:41:16.340  2526  2526 I mpi      : color: id 16    0x00010 YUV444P
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65536 0x10000 RGB565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65537 0x10001 BGR565
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65538 0x10002 RGB555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65539 0x10003 BGR555
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65542 0x10006 RGB888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65543 0x10007 BGR888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65546 0x1000a ARGB8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65547 0x1000b ABGR8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65548 0x1000c BGRA8888
08-16 10:41:16.340  2526  2526 I mpi      : color: id 65549 0x1000d RGBA8888
```

<!-- source: EN PDF p50; unit 374 -->

Die Hilfe gliedert sich in drei Teile:

<!-- source: EN PDF p50; unit 375 -->

(1) Befehlsparameter von mpi_enc_test;

<!-- source: EN PDF p50; unit 376 -->

(2) Codiertyp der Ausgangsbitstreamdatei;

<!-- source: EN PDF p50; unit 377 -->

(3) Format des Eingangsbilds.

<!-- source: EN PDF p50; unit 378 -->

Die Befehlsparameter folgen.

<!-- source: EN PDF p51; unit 379 -->

| Befehlsparameter | Beschreibung |
| --- | --- |
| -i | Datei der Eingabeframes. |
| -o | Kodierter Ausgangsbitstrom. |
| -w | Breite des Eingangsbitstroms in Pixeln. |
| -h | Höhe des Eingangsbitstroms in Pixeln. |
| -hstride | Horizontaler Stride des Eingabebildes in Bytes. |
| -vstride | Vertikaler Stride des Eingabebildes; Einheit: 1. |
| -f | Format des Eingabebildes, standardmäßig NV12. |
| -t | Kodierungstyp des Ausgangsdatenstroms. |
| -tsrc | Quellkodierungstyp der Eingabedatei; nur im Codec-Leistungstest verwendet (siehe mpi_rc2_test.c). |
| -n | Maximale Anzahl zu kodierender Frames. Ist der Eingangsbitstrom zu lang, können nur die ersten n Frames dekodiert werden. |
| -g | gop-Referenzmodus. |
| -rc | rc_mode festlegen: 0:vbr 1:cbr 2:fixqp 3:avbr. |
| -bps | Bitrate festlegen. |
| -fps | Eingangs- und Ausgangsbildrate festlegen, standardmäßig 30. Dieser Befehlsparameter beschreibt nur das proportionale Verhältnis zwischen Eingangs- und Ausgangsbildrate; die Quelle nennt dabei einen Bezug zur tatsächlichen Bildrate. |
| -qc | Qualitätssteuerung festlegen. |
| -s | Anzahl der Instanzen, standardmäßig 1. |
| -v | Trace-Option: q — ohne Ausgabe; f — fps anzeigen. |
| -ini | Zusätzliche ini-Konfigurationsdatei des Encoders (noch nicht wirksam). |
| -slt | slt-Prüfdatendatei zum kodierten Ausgangsbitstrom. |

<!-- source: EN PDF p51; unit 380 -->

Bei mpi_enc_test sind Breite (w), Höhe (h) und Codiertyp (t) Pflichtparameter. Eingangsdatei (i), Ausgangsdatei (o), Frameanzahl (n) und Eingangsbildformat (f) sind optional. Ohne Eingangsdatei erzeugt mpi_enc_test ein Standard-Farbbalkenbild zur Codierung.

<!-- source: EN PDF p51; unit 381 -->

mpi_enc_test bietet verschiedene Bitratenregelungen über Modus und Begrenzungsparameter. Modi: variable Bitrate VBR, konstante Bitrate CBR, fester QP FIXQP und adaptive Bitrate AVBR; Standard ist VBR. Die Begrenzungsparameter dienen als Referenz für die internen Bitratengrenzen von MPP.

<!-- source: EN PDF p52; unit 382 -->

Format der Ein-/Ausgangsbildratensteuerung (fps) in mpi_enc_test:

<!-- source: EN PDF p52; unit 383 -->

```text
-fps fps_in_num:fps_in_den:fps_in_flex/fps_out_num:fps_out_den:fps_out_flex
```

<!-- source: EN PDF p52; unit 384 -->

in/out bezeichnet Eingang/Ausgang, num den Zähler und den den Nenner. flex=0 bedeutet feste, flex=1 variable Bildrate. Standardwerte für Ein- und Ausgang sind num=30 und den=1, also jeweils 30. Der Parameter beschreibt nur das Verhältnis von Ein- zu Ausgangsbildrate, unabhängig von der tatsächlichen Bildrate.

<!-- source: EN PDF p52; unit 385 -->

Die Qualitätssteuerung in mpi_enc_test wirkt nur für H.264-, H.265-, VP8- oder JPEG-Ausgabe. Befehlsformat:

<!-- source: EN PDF p52; unit 386 -->

```text
-qc qp_init/min/max/min_i/max_i
```

<!-- source: EN PDF p52; unit 387 -->

qp bezeichnet Qualitätsparameter, init den Anfangswert, min das Minimum und max das Maximum. Die Quelle beschreibt den Suffix i als Maximalwert für I-Frames; ohne Suffix sind B- und P-Frames gemeint. Die unklare Quellformulierung bleibt erhalten.

<!-- source: EN PDF p52; unit 388 -->

Für mpi_enc_test: Bei Protokolloption (v) = q wird die gewöhnliche MPP-Protokollierung abgeschaltet. Bei f werden einmal pro Sekunde mittlere und aktuelle Bildrate ausgegeben.

<!-- source: EN PDF p52; unit 389 -->

Farbraumformate gliedern sich in YUV und RGB. MPP unterstützt mehrere Formate (f), deren Parameterwerte verschiedene Speicherlayouts bezeichnen. Insbesondere unterscheiden sich YUV- und RGB-Parameterwerte deutlich.

<!-- source: EN PDF p52; unit 390 -->

Beispiel: 30 Frames aus ocrean.yuv unter /data codieren. Startbefehl:

<!-- source: EN PDF p52; unit 391 -->

```text
mpi_enc_test -w 1920 -h 1080 -t 7 -i /data/ocrean.yuv -o /data/out.h264 -n 30
```

<!-- source: EN PDF p52; unit 392 -->

Bei regulärer Ausführung folgt dieses Ergebnis.

<!-- source: EN PDF p53; unit 393 -->

![Original-Technikabbildung, englisches PDF, Seite 53](/docs/rockchip-mpp/assets/en-p053-figure-01.png)

Kopierbare Transkription des Codes/Protokolls in der Abbildung (Quelltext beibehalten; keine Zusicherung unmittelbarer Ausführbarkeit):

```text
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: cmd parse result:
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: input  file name: /data/ocrean.yuv
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: output file name: /data/out.h264
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: width     : 1920
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: height    : 1080
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: format    :    0
08-17 11:54:12.841  2790  2790 I mpi_enc_utils: type      :    7
08-17 11:54:12.842  2790  2791 I mpi_enc_test: mpi_enc_test start
08-17 11:54:12.844  2790  2791 I mpp_info: mpp version: 6cc173d1 author: Ding Wei    2022-08-29 [hal_avsd]: Fix crash on avsd ref err path
08-17 11:54:12.844  2790  2791 I mpi_enc_test: 0xe9a806d0 encoder test start w 1920 h 1080 type 7
08-17 11:54:12.846  2790  2792 I mpp_enc : MPP_ENC_SET_RC_CFG bps 7776000 [486000 : 8262000] fps [30:30] gop 60
08-17 11:54:12.846  2790  2792 I h264e_api_v2: MPP_ENC_SET_PREP_CFG w:h [1920:1080] stride [1920:1080]
08-17 11:54:12.846  2790  2792 I mpp_enc : send header for set cfg change input/format/color
08-17 11:54:12.846  2790  2792 I mpp_enc : mode vbr bps [486000:7776000:8262000] fps fix [30/1] -> fix [30/1] gop i [60] v [0]
08-17 11:54:12.867  2790  2791 I mpi_enc_test: chn 0 encoded frame 0  size 218616 qp 11
08-17 11:54:12.878  2790  2791 I mpi_enc_test: chn 0 encoded frame 1  size 53379  qp 16
08-17 11:54:12.889  2790  2791 I mpi_enc_test: chn 0 encoded frame 2  size 44736  qp 18
08-17 11:54:12.899  2790  2791 I mpi_enc_test: chn 0 encoded frame 3  size 46086  qp 19
08-17 11:54:12.910  2790  2791 I mpi_enc_test: chn 0 encoded frame 4  size 49246  qp 19
08-17 11:54:12.921  2790  2791 I mpi_enc_test: chn 0 encoded frame 5  size 44351  qp 21
08-17 11:54:12.932  2790  2791 I mpi_enc_test: chn 0 encoded frame 6  size 45968  qp 21
08-17 11:54:12.945  2790  2791 I mpi_enc_test: chn 0 encoded frame 7  size 39819  qp 22
08-17 11:54:12.956  2790  2791 I mpi_enc_test: chn 0 encoded frame 8  size 40786  qp 22
08-17 11:54:12.968  2790  2791 I mpi_enc_test: chn 0 encoded frame 9  size 29039  qp 22
08-17 11:54:12.993  2790  2791 I mpi_enc_test: chn 0 encoded frame 10 size 30438  qp 23
08-17 11:54:13.017  2790  2791 I mpi_enc_test: chn 0 encoded frame 11 size 38220  qp 23
08-17 11:54:13.042  2790  2791 I mpi_enc_test: chn 0 encoded frame 12 size 35324  qp 24
08-17 11:54:13.068  2790  2791 I mpi_enc_test: chn 0 encoded frame 13 size 36299  qp 24
08-17 11:54:13.093  2790  2791 I mpi_enc_test: chn 0 encoded frame 14 size 36672  qp 24
08-17 11:54:13.120  2790  2791 I mpi_enc_test: chn 0 encoded frame 15 size 36288  qp 25
08-17 11:54:13.147  2790  2791 I mpi_enc_test: chn 0 encoded frame 16 size 30886  qp 26
08-17 11:54:13.173  2790  2791 I mpi_enc_test: chn 0 encoded frame 17 size 31390  qp 25
08-17 11:54:13.199  2790  2791 I mpi_enc_test: chn 0 encoded frame 18 size 32035  qp 26
08-17 11:54:13.223  2790  2791 I mpi_enc_test: chn 0 encoded frame 19 size 30808  qp 26
08-17 11:54:13.248  2790  2791 I mpi_enc_test: chn 0 encoded frame 20 size 32234  qp 26
08-17 11:54:13.272  2790  2791 I mpi_enc_test: chn 0 encoded frame 21 size 31154  qp 26
08-17 11:54:13.297  2790  2791 I mpi_enc_test: chn 0 encoded frame 22 size 30745  qp 26
08-17 11:54:13.323  2790  2791 I mpi_enc_test: chn 0 encoded frame 23 size 32082  qp 26
08-17 11:54:13.349  2790  2791 I mpi_enc_test: chn 0 encoded frame 24 size 31948  qp 26
08-17 11:54:13.374  2790  2791 I mpi_enc_test: chn 0 encoded frame 25 size 27847  qp 27
08-17 11:54:13.400  2790  2791 I mpi_enc_test: chn 0 encoded frame 26 size 31434  qp 27
08-17 11:54:13.427  2790  2791 I mpi_enc_test: chn 0 encoded frame 27 size 31533  qp 27
08-17 11:54:13.453  2790  2791 I mpi_enc_test: chn 0 encoded frame 28 size 31289  qp 27
08-17 11:54:13.478  2790  2791 I mpi_enc_test: chn 0 encoded frame 29 size 32659  qp 27
08-17 11:54:13.480  2790  2790 I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
08-17 11:54:13.481  2790  2790 I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 394 -->

Die bereits beim Decoder-Demo beschriebenen Logeinführungen lässt die Quelle hier aus.

<!-- source: EN PDF p53; unit 395 -->

```text
I mpp_enc: MPP_ENC_SET_RC_CFG bps 7776000 [486000:8262000] fps [30:30] gop 60
```

<!-- source: EN PDF p53; unit 396 -->

Standard-Bitratenparameter des Encoders: Ziel 7.8 Mbps, untere Referenz 0.5 Mbps und obere Referenz 8.3 Mbps. Standard-Ein-/Ausgangsbildrate 30, GOP-Größe 60.

<!-- source: EN PDF p53; unit 397 -->

```text
I mpi_enc_test: chn 0 encoded frame 0 size 218616 qp 11
```

<!-- source: EN PDF p53; unit 398 -->

Die mpi_enc_test-Ausgabe zeigt reguläres Codieren; die Bitstreamgröße eines Frames beträgt 0.2 M, der Qualitätsparameter 11.

<!-- source: EN PDF p53; unit 399 -->

```text
I mpi_enc_test: chn 0 encode 30 frames time 628 ms delay 4 ms fps 47.72 bps 10265048
```

<!-- source: EN PDF p53; unit 400 -->

Ausgabe mpi_enc_test: Laut Quellbeispiel codierte der Encoder 30 Frames in 628 ms; Erstframelatenz 4 ms, Bildrate 47.72 fps und Bitrate 10.2 Mbps. Dies sind Quellwerte, kein ArmSoM-Test.

<!-- source: EN PDF p53; unit 401 -->

```text
I mpi_enc_test: mpi_enc_test average frame rate 47.72
```

<!-- source: EN PDF p53; unit 402 -->

Die mpi_enc_test-Ausgabe nennt eine mittlere Encoder-Bildrate von 47.72 fps.

<!-- source: EN PDF p53; unit 403 -->

Encoder-Steuerparameter lassen sich auch über Umgebungsvariablen konfigurieren. Unter Android lautet der Befehl:

<!-- source: EN PDF p54; unit 404 -->

```text
setprop <control parameter> value
```

<!-- source: EN PDF p54; unit 405 -->

Unter Linux werden die Umgebungsvariablen mit folgendem Befehl gesetzt:

<!-- source: EN PDF p54; unit 406 -->

```text
export <control parameter>=value
```

<!-- source: EN PDF p54; unit 407 -->

Die zugehörigen Beschreibungen folgen.

<!-- source: EN PDF p55; unit 408 -->

| Steuerparameter | Typ | Beschreibung |
| --- | --- | --- |
| constraint_set | RK_U32 | Nur für H.264-Bitströme wirksam; entspricht constraint_set0_flag bis constraint_set5_flag in der Syntax. Das Erzwingungskennzeichen force_flag und der erzwungene Constraint-Parameter constraint_force werden im Format &#124; 00 &#124; force_flag &#124; 00 &#124; constraint_force &#124; gespeichert. Nur die unteren 6 Bits sind gültig; sie entsprechen constraint_set5_flag bis constraint_set0_flag. Bei force_flag gleich 1 wird das entsprechende constraint_set im Encoder konfiguriert. |
| split_mode | RK_U32 | Aufteilungsmodus des Encoders. 0: keine Aufteilung. 1: Aufteilung nach Slice-Größe. 2: Aufteilung nach Anzahl von Makroblöcken oder CTUs. |
| split_arg | RK_U32 | split_arg wirkt nur bei aktiviertem Encoder-split_mode. Bei byteweiser Aufteilung ist dies das Byte-Limit je Slice; bei CTU-Aufteilung das CTU-Limit je Slice. |
| split_out | RK_U32 | Ausgabemodus der Aufteilung, nur bei aktiviertem Encoder-Aufteilungsmodus wirksam. 1: Ausgabe mit geringer Verzögerung; 2: Ausgabe von Segmentinformationen. Im Modus mit geringer Verzögerung gibt der Encoder jedes Slice verzögerungsarm aus; im Segmentinformationsmodus kapselt er Segmentinformationen für jedes Slice. |
| sei_mode | RK_U32 | SEI-Schreibmodus. 0: kein SEI schreiben; 1: sequenzweises Schreiben; 2: frameweises Schreiben. Im Sequenzmodus gibt es nur ein SEI je GOP; im Framemodus wird bei geänderten SEI-Informationen auch vor jedem Frame SEI eingefügt. |
| gop_mode | RK_U32 | gop-Referenzmodus. Ist die Umgebungsvariable gop_mode nicht gesetzt, wird anhand des Befehlsparameters konfiguriert; andernfalls anhand der Umgebungsvariable. |
| osd_enable | RK_U32 | OSD-Palette aktivieren. |
| osd_mode | RK_U32 | Modus der OSD-Palette, nur nach Aktivierung der Palette wirksam. 0: Standardkonfiguration; 1: benutzerdefinierte Konfiguration. |
| roi_enable | RK_U32 | ROI-Test aktivieren und die plattformspezifische Standardkonfiguration von roi_type verwenden. |
| roi_type | RK_U32 | Konfiguration von roi_type erzwingen. |
| user_data_enable | RK_U32 | Benutzerdaten aktivieren. |

<!-- source: EN PDF p55; unit 409 -->

Der Encoder-Democode steht in test/mpi_enc_test.c. Laut Quelle verwendet die aktuelle Demo enqueue/dequeue; dies soll später geändert werden.

<!-- source: EN PDF p56; unit 410 -->

### 4.3 Hilfsprogramme

<!-- source: EN PDF p56; unit 411 -->

MPP stellt Hilfsprogramme für Unit-Tests der Hardware-/Softwareplattform und der MPP-Bibliothek selbst bereit.

<!-- source: EN PDF p56; unit 412 -->

mpp_info_test

<!-- source: EN PDF p56; unit 413 -->

Versionsinformationen der MPP-Bibliothek lesen und ausgeben. Bei einer Problemmeldung kann diese Ausgabe beigefügt werden.

<!-- source: EN PDF p56; unit 414 -->

mpp_buffer_test

<!-- source: EN PDF p56; unit 415 -->

Prüft die reguläre Funktion des Kernel-Speicherallokators.

<!-- source: EN PDF p56; unit 416 -->

mpp_mem_test

<!-- source: EN PDF p56; unit 417 -->

Prüft die reguläre Funktion des Speicherallokators der C-Bibliothek.

<!-- source: EN PDF p56; unit 418 -->

mpp_runtime_test

<!-- source: EN PDF p56; unit 419 -->

Prüft bestimmte Hardware- und Softwarebedingungen der Laufzeitumgebung.

<!-- source: EN PDF p56; unit 420 -->

mpp_platform_test

<!-- source: EN PDF p56; unit 421 -->

Liest die Chipplattforminformationen und prüft deren Plausibilität.

<!-- source: EN PDF p56; unit 422 -->

## 5\. MPP-Bibliothek bauen und verwenden

<!-- source: EN PDF p56; unit 423 -->

### 5.1 Quellcode herunterladen

<!-- source: EN PDF p56; unit 424 -->

Offizielle Quellcodeadresse von MPP: https://github.com/rockchip-linux/mpp

<!-- source: EN PDF p56; unit 425 -->

Die Veröffentlichungsbranch heißt release, die Entwicklungsbranch develop; laut Quelle ist develop die Standardbranch.

<!-- source: EN PDF p56; unit 426 -->

Downloadbefehl: git clone https://github.com/rockchip-linux/mpp.git

<!-- source: EN PDF p56; unit 427 -->

### 5.2 Kompilierung

<!-- source: EN PDF p56; unit 428 -->

Für den Build wird cmake oberhalb Version 2.8.12 benötigt; empfohlen wird 3.x. Die Quelle nennt eine erfolgreiche Prüfung mit cmake-3.28. Neuere Versionen können mehr Warnungen erzeugen. Dies ist eine Quellangabe, keine Prüfung dieser Arbeit.

<!-- source: EN PDF p57; unit 429 -->

#### 5.2.1 Cross-Kompilierung für Android

<!-- source: EN PDF p57; unit 430 -->

Zum Bau der Android-Bibliothek ist eine NDK-Umgebung erforderlich; das Standardskript verwendet android-ndk-r16b. Die Quelle nennt Prüfungen mit android-ndk-r16b und android-ndk-r25c: erstere für SDKs unter Android 14, letztere für SDKs über Android 14. Der Grenzfall Android 14 wird nicht gesondert definiert.

<!-- source: EN PDF p57; unit 431 -->

Beispiel für die r16b-NDK:

<!-- source: EN PDF p57; unit 432 -->

Der Downloadpfad der r16b-NDK steht in build/android/ndk_links.md des Quellverzeichnisses.

<!-- source: EN PDF p57; unit 433 -->

Die heruntergeladene NDK nach /home/pub/ndk/android-ndk-r16b entpacken oder den ANDROID_NDK-Pfad in build/android/env_setup.sh manuell anpassen.

<!-- source: EN PDF p57; unit 434 -->

Nach build/android/arm/ wechseln, make-Android.bash zur Makefile-Erzeugung ausführen und anschließend laut Quelltext make –j16 verwenden. Vor j16 steht in der Quelle ein langer Strich statt eines ASCII-Bindestrichs; vor Ausführung den Parameter mit dem Buildskript abgleichen.

<!-- source: EN PDF p57; unit 435 -->

#### 5.2.2 Kompilierung unter Unix/Linux

<!-- source: EN PDF p57; unit 436 -->

Zunächst die Toolchain in build/linux/arm/arm.linux.cross.cmake konfigurieren, dann mit make-Makefiles.bash per cmake das Makefile erzeugen und abschließend laut Quelle make –j16 ausführen. Das lange Strichzeichen des Quellparameters nicht ungeprüft als validierten Befehl kopieren.

<!-- source: EN PDF p57; unit 437 -->

MPP unterstützt auch den direkten Build unter Debian auf dem Entwicklungsboard.

<!-- source: EN PDF p57; unit 438 -->

## 6\. Häufig gestellte Fragen

<!-- source: EN PDF p57; unit 439 -->

F: Beim Aarch64-Build erscheint undefined reference to `system_property_get`.

<!-- source: EN PDF p57; unit 440 -->

A: Laut Quelle handelt es sich um ein Problem der Google-64bit-NDK: In libc.so fehlen bestimmte Symboldefinitionen. Siehe folgenden Problemverweis:

<!-- source: EN PDF p57; unit 441 -->

Quell-URL (Zeilenumbruch anhand der vollständigen Adresse des chinesischen Originals zusammengefügt): [http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms](http://stackoverflow.com/questions/28413530/api-to-get-android-system-properties-is-removed-in-arm64-platforms)

<!-- source: EN PDF p57; unit 442 -->

Quelllösung: MPP enthält die entsprechende libc.so unter build/android/aarch64/fix/. In path_to_ndk/platforms/android-21/arch-arm64/usr/lib/ kopieren und neu kompilieren. Dies ist eine historische SDK-Lösung, keine Empfehlung, Systembibliotheken beliebiger heutiger NDKs zu ersetzen.

<!-- source: EN PDF p57; unit 443 -->

F: Während der Ausführung erscheint folgendes Kernel-Log. Ist dies ein Problem?

<!-- source: EN PDF p57; unit 444 -->

vpu_service_ioctl:1844: error: unknow vpu service ioctl cmd 40086c01

<!-- source: EN PDF p57; unit 445 -->

A: Laut Quelle ist diese Meldung für sich genommen kein Problem. MPP hängt vom Kerneltreiber ab und versucht verschiedene Schnittstellenversionen. Schlägt ein Versuch fehl, folgt eine andere Schnittstelle. Diese Ausgabe erscheint beim Fehlschlag einmal und kann ignoriert werden.

<!-- source: EN PDF p57; unit 446 -->

F: Wie analysiert man eine fehlerhafte MPP-Ausführung?

<!-- source: EN PDF p57; unit 447 -->

A: Zuerst das Fehlerlog analysieren. Kann ein Kernelgerät nicht geöffnet werden, die Verfügbarkeit der Hardware-Gerätekonfiguration des Videocodecs der Kernelplattform prüfen; anschließend sieht die Quelle eine Problemmeldung in redmine vor. Nach Klärung der Laufzeitumgebung interne MPP-Probleme untersuchen.

{% endraw %}
