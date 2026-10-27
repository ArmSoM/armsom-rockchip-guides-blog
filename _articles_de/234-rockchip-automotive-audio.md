---
title: "Rockchip Entwicklerhandbuch für Fahrzeug-Audio"
description: "Rockchip Entwicklerhandbuch für Fahrzeug-Audio — V1.0.0"
excerpt: "Rockchip Entwicklerhandbuch für Fahrzeug-Audio"
translation_key: "234-rockchip-automotive-audio"
slug: "234-rockchip-automotive-audio"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, Automotive]
---

{% raw %}

# Rockchip Entwicklerhandbuch für Fahrzeug-Audio

Vollständige technische Ausgabe der acht Abschnitte des chinesischen RK-KF-YF-784. Deckblatt: V1.0.0; letzter Revisionseintrag: V0.2.0 (Android-14-Funktionen). Diese Quellabweichung bleibt offengelegt. Quellplattformen: RK3588/RK3576, Kernel 5.10/6.10. Aussagen über fehlende Unterstützung gelten für das historische SDK, nicht für heutige Kompatibilität. Nur chinesische Quelle, keine englischen Originalbilder. Keine technischen Bilder oder Tabellen; Code und Konfigurationen sind editierbar. Rechts-/Kontakt-, Zielgruppen-, Revisions- und doppelte Inhaltsangaben entfallen. Keine Konfigurations- oder Hardwaretests durchgeführt.

Prüfung: Seitengetrennten Code verbunden, audioUseDynamicRouting als Codeblock wiederhergestellt und einen umgebrochenen MMAP-Bezeichner verbunden. Quellprobleme bleiben: drei Lautstärkegruppen, aber Verweis auf eine vierte; Schreibweisen attchedDevices, audio_policy_configuraion.xml, CarAudioManger, ture und booleanallowed. XML enthält AUDIO_CHANNEL_OUT_STREO, </mixPort ohne >, nicht geschlossene äußere Tags sowie ursprüngliche *** / ....-Auslassungen. Keine stillen Ergänzungen. Vor Einsatz gegen den Zielbranch prüfen; keine validierten Deployment-Konfigurationen. Fahrzeugwarnungen, Notfall-Audio und Lautstärke-/Fokusrouting können sicherheitsrelevant sein: isoliert testen, nicht direkt als Serienrichtlinie übernehmen.

<!-- source:cn p2 unit:0 -->

## Grundbegriffe

<!-- source:cn p2 unit:1-0 -->

AAOS verwaltet den Ton von Android-Apps, steuert diese Apps und leitet ihren Ton entsprechend dem Typ an HAL-Ausgabegeräte weiter.

<!-- source:cn p2 unit:1-1 -->

### Logische Audioströme

<!-- source:cn p2 unit:1-2 -->

Audiostreams werden durch Audioattribute gekennzeichnet. Eine App kann über Standard-Android-APIs einen oder mehrere logische Audiodatenströme erzeugen, etwa AudioManager zur Fokussteuerung oder MediaPlayer zur Online-Wiedergabe. App-Streams sind AudioAttributes zugeordnet. AudioService leitet jeden logischen Stream an genau einen verfügbaren physischen Ausgabestream weiter.

<!-- source:cn p2 unit:1-3 -->

### Ausgabegeräte

<!-- source:cn p2 unit:1-4 -->

Auf Audio-HAL-Ebene stellt AUDIO_DEVICE_OUT_BUS den allgemeinen Ausgabegerätetyp für Fahrzeug-Audiosysteme bereit. Einzelheiten: https://source.android.com/docs/automotive/audio/audio-policy-configuration?hl=zh-cn

<!-- source:cn p2 unit:2 -->

## Audiozonen konfigurieren

<!-- source:cn p2 unit:3-0 -->

Eine Audiozone ist ein unabhängiger, von AAOS verwalteter Audiobereich. Jede Zone besitzt eine eigene Fokus- und Lautstärkesteuerung und entspricht einem Fahrzeugbereich.

<!-- source:cn p2 unit:3-1 -->

### Dynamische Audiozonenverwaltung aktivieren

<!-- source:cn p2 unit:3-2 -->

Den Schalter für dynamisches Routing im Overlay des entsprechenden Produktverzeichnisses unter device ergänzen.

<!-- source:cn p2 unit:4 -->

```text
<bool name="audioUseDynamicRouting">true</bool>
```

<!-- source:cn p3 unit:5-0 -->

### Audiobereiche konfigurieren

<!-- source:cn p3 unit:5-1 -->

Audiozonen durch Bearbeiten von car_audio_configuration.xml und audio_policy_configuration.xml im entsprechenden Produktverzeichnis unter device konfigurieren.

<!-- source:cn p3 unit:5-2 -->

### Konfiguration von car_audio_configuration.xml

<!-- source:cn p3 unit:5-3 -->

Die Standard-Produkt-XML konfiguriert vier Audiozonen für die Benutzer von vier Bereichen. Das Beispiel zeigt die primäre Audiozone mit Insassenzonen-ID 0. Es definiert drei Lautstärkegruppen; Geräte einer Gruppe haben dieselbe Verstärkung. Die erste Gruppe enthält bus0_media_out und bus6_notification_out; bus0_media_out ist den Kontexten music und announcement zugeordnet. Laut Quelle folgen die zweite, dritte und vierte entsprechend. Lautstärkegruppen oder Zonen bei Bedarf entfernen. Hinweise:

<!-- source:cn p3 unit:6 -->

1. Die primäre Audiozone hat immer audioZoneId null.

<!-- source:cn p3 unit:7 -->

2. audioZoneId- und occupantZoneId-Werte dürfen sich nicht wiederholen. occupantZoneId dient zur Zuordnung von UserID und DisplayID. Beispielsweise definieren occupantZoneId 0, 1 und 2 in car_audio_configuration.xml Konfigurationen für drei Audiozonen.

<!-- source:cn p3 unit:8 -->

3. Zwischen audioZoneId und occupantZoneId ist nur eine Eins-zu-eins-Zuordnung zulässig.

<!-- source:cn p3 unit:9 -->

4. Jedem context muss genau eine device address zugewiesen werden.

<!-- source:cn p3 unit:10 -->

```text
<carAudioConfiguration version="2">
    <zones>
        <zone name="primary zone" isPrimary="true" occupantZoneId="0">
            <volumeGroups>
                <group>
                    <device address="bus0_media_out">
                        <context context="music"/>
                        <context context="announcement"/>
                    </device>
                    <device address="bus6_notification_out">
                        <context context="notification"/>
                        <context context="system_sound"/>
                        <context context="emergency"/>
                        <context context="safety"/>
                        <context context="vehicle_status"/>
                        <context context="alarm"/>
                    </device>
                </group>
                <group>
                    <device address="bus1_navigation_out">
                        <context context="navigation"/>
                    </device>
                    <device address="bus2_voice_command_out">
                        <context context="voice_command"/>
                    </device>
                </group>
                <group>
                    <device address="bus4_call_out">
                        <context context="call"/>
                        <context context="call_ring"/>
                    </device>
                </group>
            </volumeGroups>
        </zone>
    </zones>
</carAudioConfiguration>
```

<!-- source:cn p4 unit:11-0 -->

### Konfiguration von audio_policy_configuration.xml

<!-- source:cn p4 unit:11-1 -->

Nach der XML für den übergeordneten Dienst müssen Framework-Streams und Geräte konfiguriert werden: attchedDevices, mixport, deviceport sowie routes zwischen mixport und deviceport ergänzen. Das folgende Beispiel definiert Geräte, Stream-Ports, Geräte-Ports und Routen der primären Audiozone.

<!-- source:cn p4 unit:12 -->

```text
<modules>
      <!-- Primary Audio HAL -->
      <module name="primary" halVersion="3.0">
          <attachedDevices>
              <!-- One bus per context -->
              <item>bus0_media_out</item>
              <item>bus1_navigation_out</item>
              <item>bus2_voice_command_out</item>
              <item>bus4_call_out</item>
              <item>bus6_notification_out</item>
          </attachedDevices>
          <defaultOutputDevice>bus0_media_out</defaultOutputDevice>
          <mixPorts>
              <mixPort name="mixport_bus0_media_out" role="source"
                       flags="AUDIO_OUTPUT_FLAG_PRIMARY">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus1_navigation_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus2_voice_command_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
              <mixPort name="mixport_bus4_call_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STREO"/>
              </mixPort
              <mixPort name="mixport_bus6_notification_out" role="source">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
                           channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
              </mixPort>
          </mixPorts>
          <devicePorts>
              <devicePort tagName="bus0_media_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus0_media_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus1_navigation_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                      address="bus1_navigation_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus2_voice_command_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus2_voice_command_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus4_call_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus4_call_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
              <devicePort tagName="bus6_notification_out" role="sink"
type="AUDIO_DEVICE_OUT_BUS"
                          address="bus6_notification_out">
                  <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
                           samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO"/>
                  <gains>
                      <gain name="" mode="AUDIO_GAIN_MODE_JOINT"
                            minValueMB="-3200" maxValueMB="600"
                            defaultValueMB="0" stepValueMB="100"/>
                  </gains>
              </devicePort>
          </devicePorts>
          <!-- route declaration, i.e. list all available sources for a
given sink -->
          <routes>
              <route type="mix" sink="bus0_media_out"
sources="mixport_bus0_media_out"/>
              <route type="mix" sink="bus1_navigation_out"
sources="mixport_bus1_navigation_out"/>
              <route type="mix" sink="bus2_voice_command_out"
                     sources="mixport_bus2_voice_command_out"/>
              <route type="mix" sink="bus4_call_out"
sources="mixport_bus4_call_out"/>
              <route type="mix" sink="bus6_notification_out"
                     sources="mixport_bus6_notification_out"/>
          </routes>
</module>
```

<!-- source:cn p6 unit:15-0 -->

### Passagier-Audio in der primären Zone wiedergeben (Android 14)

<!-- source:cn p6 unit:15-1 -->

Audio mit Kontext Music aus der Passagierzone wird über das Gerät der Hauptbildschirmzone wiedergegeben. Die Quelle beschreibt die Übergabe der userid der Passagierzone über die CarAudioManager-API allowMediaAudioOnPrimaryZone(long requestId, booleanallowed).

<!-- source:cn p6 unit:15-2 -->

### Dynamische Audiozonenkonfiguration (Android 14)

<!-- source:cn p6 unit:15-3 -->

Ein Kontext kann innerhalb einer Audiozone zwei Ausgabe-Busadressen besitzen, zwischen denen während der Wiedergabe gewechselt wird. Dafür die Fahrzeug-Audiokonfiguration ändern. Das Beispiel definiert zone 1 config 0 und zone 1 config 1 für Audiozone ID 1.

<!-- source:cn p6 unit:16 -->

```text
<carAudioConfiguration version="3">
  <zones>
      <zone name="Zone1" audioZoneId="1" occupantZoneId="1">
          <zoneConfigs>
              <zoneConfig name="Zone 1 Config 0" isDefault="true">
                  <volumeGroups>
                      <group>
                          <device address="bus_100">
                              <context context="music"/>
                                  ***
                          </device>
                      </group>
                  </volumeGroups>
              </zoneConfig>
              <zoneConfig name="Zone 1 Config 1">
                  <volumeGroups>
                      <group>
                          <device address="bus_101">
                              <context context="music"/>
                                  ***
                          </device>
                      </group>
                  </volumeGroups>
              </zoneConfig>
          </zoneConfigs>
      </zone>
</zones>
```

<!-- source:cn p6 unit:17 -->

Hinweise:

<!-- source:cn p6 unit:18 -->

1. Die beiden zoneConfig-Adressen unterscheiden sich und dürfen nur einer nicht primären Zone hinzugefügt werden.

<!-- source:cn p6 unit:19-0 -->

2. Die hinzugefügte device address muss in audio_policy_configuraion.xml definiert werden.

<!-- source:cn p6 unit:19-1 -->

### Audiozonen spiegeln (Android 14)

<!-- source:cn p7 unit:20 -->

Audio-Spiegelung ermöglicht Passagieren gemeinsames Audio: Mindestens zwei Geräte erhalten dieselben Daten. Die Konfiguration definiert ein Spiegelgerät mit Adresse bus_1000. Eine externe App ruft enableMirrorForAudioZones auf und übergibt die Liste der zu spiegelnden zoneIDs. Das Fahrzeugsystem gibt dieselben Audiodaten an allen zugehörigen Busadressen aus.

<!-- source:cn p7 unit:21 -->

```text
<carAudioConfiguration version="3">
   <mirroringDevices>
       <mirroringDevice address="bus_1000"/>
   </mirroringDevices>
  <zones>
    ....
  </zones>
</carAudioConfiguration>
```

<!-- source:cn p7 unit:22 -->

## Audiofokus

<!-- source:cn p7 unit:23-0 -->

### Grundlagen des Audiofokus

<!-- source:cn p7 unit:23-1 -->

Audiofokus stellt bei mehreren abspielenden Apps sicher, dass der gewünschte Ton hörbar bleibt, und verhindert störendes Vermischen. Vor jeder Wiedergabe Fokus anfordern und erst nach dessen Gewährung starten.

<!-- source:cn p7 unit:23-2 -->

### API zum Anfordern von Audiofokus

<!-- source:cn p7 unit:23-3 -->

Android audioManager stellt requestAudioFocus zum Anfordern des Fokus bereit.

<!-- source:cn p7 unit:23-4 -->

### Fokusanfragen in AAOS

<!-- source:cn p7 unit:23-5 -->

CarAudioService entscheidet anhand der Anfrageparameter und des aktuellen Kontexts über die Fokusgewährung. Eine Interaktionsmatrix definiert zwischen angefragtem CarAudioContext und aktuellem Fokusinhaber exklusive, abgelehnte oder gleichzeitige Interaktion. Siehe https://source.android.com/docs/devices/automotive/audio/audio-focus?hl=zh-cn . Die Quelle nennt audioUseHalDuckingSignals=ture in car_audio_configuration.xml: Für AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK wird onDevicesToDuckChange der audioControl HAL zur Lautstärkereduzierung aufgerufen. Bei false gelangen Ducking-Ereignisse nicht zur HAL; auch die obere Schicht behandelt sie nicht.

<!-- source:cn p7 unit:24 -->

## Lautstärke einstellen

<!-- source:cn p7 unit:25-0 -->

### Lautstärke einstellen

<!-- source:cn p7 unit:25-1 -->

Externe Apps sollten die entsprechenden CarAudioManger-APIs zum Lesen und Setzen der Lautstärke verwenden. config_useFixedVolume=true im Produkt-Overlay unter device aktiviert die Regelung durch einen externen Hardwareverstärker. Geräte derselben volumeGroup in car_audio_configuration.xml ändern ihre Lautstärke gemeinsam. config_handleVolumeKeysInWindowManager=true leitet die Tastenbehandlung direkt an CarService statt durch das Android-Framework. audioUseCarVolumeGroupMuting=true (empfohlen) aktiviert individuelles Stummschalten jeder Lautstärkegruppe. Bei false (Standard) wird individuelles Gruppen-Stummschalten deaktiviert und Master-Mute verwendet. Lautstärketasten und UI rufen carAudioService statt des Android-Systemaudioframeworks auf; Tasten können nur die Lautstärke der Hauptbildschirmzone steuern.

<!-- source:cn p7 unit:26 -->

## PCM-Plugins

<!-- source:cn p8 unit:27-0 -->

PCM-Plugins erweitern PCM-Geräte, etwa um Abtastratenkonvertierung und Kopieren zwischen Kanälen. Sie werden durch vendor/etc/asound.conf konfiguriert. Zum Format siehe ALSA project - the C library reference: PCM (digital audio) plugins (alsa-project.org).

<!-- source:cn p8 unit:27-1 -->

### dshare-Plugin

<!-- source:cn p8 unit:27-2 -->

Dieses Plugin teilt mehrere Kanäle zwischen mehreren Clients mit exklusivem Zugriff auf jeden Kanal. Anders als share benötigt es keinen eigenen Serverprozess: Clients greifen wie bei dmix und dsnoop gleichzeitig auf einen gemeinsamen Puffer zu. Die unterstützten Parameter folgen.

<!-- source:cn p8 unit:28 -->

```text
pcm.name {
    type dshare     # Direct sharing
    ipc_perm INT        # IPC permissions (octal, default 0600)
    slave STR
    # or
    slave {         # Slave definition
        pcm STR     # slave PCM name
        # or
        pcm { }     # slave PCM definition
        format STR  # format definition
        rate INT    # rate definition
        channels INT
        period_time INT # in usec
        # or
        period_size INT # in frames
        buffer_time INT # in usec
        # or
        buffer_size INT # in frames
        periods INT # when buffer_size or buffer_time is not specified
    }
    bindings {      # note: this is client independent!!!
        N INT       # maps slave channel to client channel N
    }
}
```

<!-- source:cn p8 unit:29-0 -->

### dsnoop-Plugin

<!-- source:cn p8 unit:29-1 -->

Dieses Plugin verteilt einen mehrkanaligen Aufnahmestrom auf mehrere Clients mit exklusivem Zugriff auf jeden Kanal. Die unterstützten Parameter folgen.

<!-- source:cn p8 unit:30 -->

```text
pcm.name {
    type dsnoop     # Direct snoop
    slave STR
    # or
    slave {         # Slave definition
        pcm STR     # slave PCM name
        # or
        pcm { }     # slave PCM definition
        format STR  # format definition
        rate INT    # rate definition
        channels INT
        period_time INT # in usec
        # or
        period_size INT # in frames
        buffer_time INT # in usec
        # or
        buffer_size INT # in frames
        periods INT # when buffer_size or buffer_time is not specified
    }
    bindings {      # note: this is client independent!!!
        N INT       # maps slave channel to client channel N
    }
}
```

<!-- source:cn p9 unit:32 -->

## Audio HAL

<!-- source:cn p9 unit:33-0 -->

Android verwaltet App-Audio, steuert die Apps und leitet ihren Ton je nach Typ an die HAL. Dort werden die entsprechenden Ausgabegeräte gewählt und an geeignete Lautsprecher geroutet.

<!-- source:cn p9 unit:33-1 -->

### Ausgabegeräte

<!-- source:cn p9 unit:33-2 -->

Auf Audio-HAL-Ebene stellt AUDIO_DEVICE_OUT_BUS allgemeine Fahrzeug-Ausgabegeräte mit adressierbaren Ports bereit; jeder ist ein Port eines physischen Geräts. Die Quelle sieht AUDIO_DEVICE_OUT_BUS als einzigen unterstützten Fahrzeug-Ausgabetyp vor. Der Typ wird über start_output_stream übergeben; die BUS-Adresse wird beim Booten festgelegt, wenn open_output_stream den Stream öffnet.

<!-- source:cn p9 unit:34 -->

```text
if (out->devices[i] == AUDIO_DEVICE_OUT_SPEAKER ||
  out->devices[i] == AUDIO_DEVICE_OUT_WIRED_HEADSET ||
  out->devices[i] == AUDIO_DEVICE_OUT_WIRED_HEADPHONE ||
  out->devices[i] == AUDIO_DEVICE_OUT_BUS) {
  audio_devices_t route_device = out->devices[i];
  route_pcm_card_open(adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].card,
getRouteFromDevice(route_device));
  if (out->address == NULL) {
      card = adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].card;
      device = adev->dev_out[SND_OUT_SOUND_CARD_SPEAKER].device;
  } else {
      if (strcmp(out->address, "bus0_media_out") == 0) {
          card = 103;
          device = 0;
      } else if (strcmp(out->address, "bus1_navigation_out") == 0) {
           card = 103;
           device = 1;
      } else if (strcmp(out->address, "bus2_voice_command_out") == 0) {
           card = 103;
           device = 2;
      } else if (strcmp(out->address, "bus4_call_out") == 0) {
           card = 103;
           device = 3;
      } else if (strcmp(out->address, "bus6_notification_out") == 0) {
           card = 103;
           device = 4;
      } else if (strcmp(out->address, "bus100_audio_zone_1") == 0) {
          card = 103;
          device = 5;
      } else if (strcmp(out->address, "bus200_audio_zone_2") == 0) {
          card = 103;
          device = 6;
      } else if (strcmp(out->address, "bus300_audio_zone_3") == 0) {
          card = 103;
          device = 7;
      } else {
          card = 103;
          device = 0;
      }
  }
}
```

<!-- source:cn p10 unit:36-0 -->

### Eingabegeräte

<!-- source:cn p10 unit:36-1 -->

Während der Aufnahme erhält die Audio HAL openInputStream mit einem AudioSource-Parameter, der die Verarbeitung des Aufnahmestroms angibt.

<!-- source:cn p10 unit:36-2 -->

### Wichtige Hinweise

<!-- source:cn p10 unit:37 -->

1. Karten- und Geräte-IDs in asound.conf müssen zur HAL-Konfiguration passen. Beispiel: bus0_media_out verwendet cardID 103 und device 0; asound.conf muss den entsprechenden PCM-Knoten pcmC103D0p definieren.

<!-- source:cn p10 unit:38 -->

2. Die Quelle schreibt für dshare/dsnoop-Soundkarten Nummern ab 100 vor.

<!-- source:cn p10 unit:39 -->

## AudioControl HAL

<!-- source:cn p10 unit:40-0 -->

AudioControl HAL ist die in AAOS eingeführte HAL zur Steuerung der Fahrzeug-Audiohardware. Der Fahrzeug-Audiodienst kommuniziert mit ihr. Externe Hardware wie Instrumente und Radio meldet ihren Audiozustand darüber an den Dienst; auch der AAOS-Audiozustand kann über die HAL mit externer Hardware ausgetauscht werden.

<!-- source:cn p10 unit:40-1 -->

### Lautstärkeregelung (Android 12)

<!-- source:cn p10 unit:40-2 -->

Der Fahrzeug-Audiodienst von Android 12 regelt über AudioControl HAL die Lautstärke externer Fahrzeug-Audiohardware. Laut Quelle unterstützt Android 14 dies noch nicht; auch Ducking, Balance und weitere Funktionen werden noch nicht unterstützt.

<!-- source:cn p10 unit:41 -->

## AAudio

<!-- source:cn p10 unit:42-0 -->

### Grundbegriffe

<!-- source:cn p10 unit:42-1 -->

AAudio ist eine mit Android 8.0 eingeführte Audio-API. Ihr latenzarmer Datenpfad reduziert Wiedergabe- und Aufnahmeverzögerungen mit einer MMAP-fähigen HAL und einem entsprechenden Treiber. Es gibt shared und exclusive. Im exklusiven Modus schreibt die Client-App direkt in einen mit dem ALSA-Treiber gemeinsam genutzten Memory-Mapped-Puffer. Im Shared-Modus nutzt ein Mixer in AudioServer den MMAP-Puffer. Exclusive umgeht den Mixer und senkt die Latenz deutlich.

<!-- source:cn p10 unit:42-2 -->

### Konfiguration ergänzen

<!-- source:cn p10 unit:42-3 -->

AAudio MMAP ist im Standard-SDK nicht aktiviert.

<!-- source:cn p10 unit:43 -->

1. AAudio in build.prop im Produktverzeichnis aktivieren.

<!-- source:cn p10 unit:44 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_policy=2
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_exclusive_policy=2
```

<!-- source:cn p10 unit:45 -->

Je nach Bedarf 1, 2 oder 3 wählen; empfohlen wird 2. 1 = AAUDIO_POLICY_NEVER: nur alter Pfad, kein MMAP. 2 = AAUDIO_POLICY_AUTO: MMAP versuchen und bei Fehler oder Nichtverfügbarkeit auf den alten Pfad zurückfallen. 3 = AAUDIO_POLICY_ALWAYS: nur MMAP, kein Rückfall auf den alten Pfad.

<!-- source:cn p10 unit:46 -->

2. Ausgabekarte und -gerät für AAudio konfigurieren. Die folgende Eigenschaft wählt die Karte des AAudio-Ausgabepfads. Ohne Konfiguration verwendet das SDK Karte 1, Gerät 0.

<!-- source:cn p10 unit:47 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_card=card:0dev:0
```

<!-- source:cn p11 unit:48 -->

3. MMAP-Stream-Ports in audio_policy_configuration.xml ergänzen: mixports mmap_no_irq_out und mmap_no_irq_in wie gezeigt hinzufügen und routes zu den deviceports erstellen. channelMasks in XML, die TDM-Kanalzahl in DTS und die von der HAL für den Kernel konfigurierte Kanalzahl müssen übereinstimmen. SDK-Standard sind acht Kanäle.

<!-- source:cn p11 unit:49 -->

```text
<mixPort name="mmap_no_irq_out" role="source"
flags="AUDIO_OUTPUT_FLAG_DIRECT|AUDIO_OUTPUT_FLAG_MMAP_NOIRQ">
 <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"
          samplingRates="48000"
channelMasks="AUDIO_CHANNEL_OUT_STEREO,AUDIO_CHANNEL_INDEX_MASK_8"/>
</mixPort>
<mixPort name="mmap_no_irq_in" role="sink"
flags="AUDIO_INPUT_FLAG_MMAP_NOIRQ">
 <profile name="" format="AUDIO_FORMAT_PCM_16_BIT"

samplingRates="8000,11025,12000,16000,22050,24000,32000,44100,48000"

channelMasks="AUDIO_CHANNEL_IN_MONO,AUDIO_CHANNEL_IN_STEREO,AUDIO_CHANNEL_IN_FRONT_BACK"/>
</mixPort>
<routes>
 <route type="mix" sink="bus0_media_out"
sources="mixport_bus0_media_out,mmap_no_irq_out"/>
 <route type="mix" sink="mmap_no_irq_in"
    sources="Built-In Mic,Built-In Back Mic,Echo-Reference Mic"/>
</routes>
```

{% endraw %}
