---
title: "Audiolatenz auf ArmSoM Sige7: ALSA praxisnah messen"
description: "Ein praxisnaher ALSA-Messablauf für RK3588-Audiogeräte mit klaren Grenzen bei der Migration von Raspberry Pi oder Jetson Nano."
translation_key: "017-audio-latency-sige7"
slug: "audio-latency-sige7"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: media
products: [Sige7]
tags: [RK3588, Sige7, ALSA, audio, latency]
keywords: "Sige7 audio ALSA, RK3588 latency, ArmSoM audio"
---

# Audiolatenz auf ArmSoM Sige7: ALSA praxisnah messen

![Pipeline zur Untersuchung der Audiolatenz](../assets/017-audio-latency.svg)

Sige7 bietet HDMI- und boardseitige Audiopfade. Die Ende-zu-Ende-Latenz wird jedoch von Codec-Takten, ALSA-Periodengröße, Mixerkonfiguration, Schedulerlast und Anwendungspuffer bestimmt. Ein ALSA-Gerätename vom Raspberry Pi oder eine PulseAudio-Konfiguration für Jetson belegt keine Übertragbarkeit.

## Einen Ausgangszustand erfassen

```bash
aplay -l
arecord -l
arecord -D hw:0,0 -f S16_LE -r 48000 -c 2 -d 10 capture.wav
```

Protokollieren Sie xruns, Abtastratenkonvertierung und Zeitstempel bei laufenden CPU-, Display- und Netzwerklasten. Prüfen Sie für interaktives Audio den vollständigen Lautsprecher-/Mikrofonpfad mit einer elektrischen Rückschleife oder einer kalibrierten akustischen Messvorrichtung.

## Die Plattform auswählen

Die CPU-/GPU-/NPU-Ressourcen des RK3588 auf Sige7 eignen sich für medienintensive Geräte. Bei einer Softwaremigration von Jetson sind dennoch neue Audio- und KI-Integrationskomponenten erforderlich. Wählen Sie CM5 oder Sige5, wenn die Schnittstellen und die Leistungsaufnahme des RK3576 ausreichen und ein kleineres Carrier Board wichtiger als maximaler Multimediadurchsatz ist.

## Quellen

- [Sige7-Spezifikationen](https://docs.armsom.org/armsom-sige7)
- [Dokumentation der Sige-Familie](https://docs.armsom.org/sige-family-started)

## Prüfung vor der Veröffentlichung

- [ ] Geben Sie Abtastrate, Periodengröße, Codec und Imageversion an.
- [ ] Ergänzen Sie xrun- und Ende-zu-Ende-Messungen.
- [ ] Unterscheiden Sie Boardfunktionen und tatsächlich gemessene Anwendungslatenz.
