---
title: "Руководство разработчика автомобильного аудио Rockchip"
description: "Руководство разработчика автомобильного аудио Rockchip — V1.0.0"
excerpt: "Руководство разработчика автомобильного аудио Rockchip"
translation_key: "234-rockchip-automotive-audio"
slug: "234-rockchip-automotive-audio"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: [ArmSoM, Rockchip, Android, Audio, Automotive]
---

{% raw %}

# Руководство разработчика автомобильного аудио Rockchip

Полное техническое издание восьми разделов китайского RK-KF-YF-784. На обложке V1.0.0; последняя запись истории — V0.2.0 (функции Android 14). Это расхождение сохранено. Платформы источника: RK3588/RK3576, ядра 5.10/6.10. Указания об отсутствии поддержки относятся к историческому SDK, не к текущей совместимости. Только китайский источник, английских оригинальных рисунков нет. Технических изображений и таблиц нет; код и конфигурации редактируемы. Исключены юридические/контактные страницы, аудитория, история изменений и повторное оглавление. Настройки и аппаратура не тестировались.

Проверка: соединён код между страницами, audioUseDynamicRouting возвращён в блок кода, восстановлен перенос идентификатора MMAP. Сохранены вопросы источника: три группы громкости, но упоминание четвёртой; написания attchedDevices, audio_policy_configuraion.xml, CarAudioManger, ture и booleanallowed. В XML есть AUDIO_CHANNEL_OUT_STREO, </mixPort без >, незакрытые внешние теги и исходные пропуски *** / ..... Они не дописываются по догадке. Перед применением проверяйте целевую ветку; это не проверенные конфигурации для внедрения. Автомобильные предупреждения, аварийный звук и маршрутизация громкости/фокуса влияют на безопасность: проверять в изолированной среде, не использовать напрямую как серийную политику.

<!-- source:cn p2 unit:0 -->

## Основные понятия

<!-- source:cn p2 unit:1-0 -->

AAOS управляет звуком приложений Android, контролирует приложения и направляет звук на выходные устройства HAL в зависимости от его типа.

<!-- source:cn p2 unit:1-1 -->

### Логические аудиопотоки

<!-- source:cn p2 unit:1-2 -->

Потоки помечаются аудиоатрибутами. Приложение может создавать один или несколько логических потоков аудиоданных через стандартные API Android, например AudioManager для аудиофокуса или MediaPlayer для онлайн-воспроизведения. Потоки приложения связаны с AudioAttributes. AudioService направляет логический поток в один, и только один, доступный физический выходной поток.

<!-- source:cn p2 unit:1-3 -->

### Выходные устройства

<!-- source:cn p2 unit:1-4 -->

На уровне audio HAL тип AUDIO_DEVICE_OUT_BUS предоставляет общее выходное устройство автомобильной аудиосистемы. Подробнее: https://source.android.com/docs/automotive/audio/audio-policy-configuration?hl=zh-cn

<!-- source:cn p2 unit:2 -->

## Настройка аудиозон

<!-- source:cn p2 unit:3-0 -->

Аудиозона — независимая область звука под управлением AAOS. У каждой зоны собственное управление фокусом и громкостью; зоны соответствуют областям автомобиля.

<!-- source:cn p2 unit:3-1 -->

### Включение динамического управления аудиозонами

<!-- source:cn p2 unit:3-2 -->

Добавьте переключатель динамической маршрутизации в overlay соответствующего каталога продукта в device.

<!-- source:cn p2 unit:4 -->

```text
<bool name="audioUseDynamicRouting">true</bool>
```

<!-- source:cn p3 unit:5-0 -->

### Конфигурация аудиообластей

<!-- source:cn p3 unit:5-1 -->

Настройте аудиозоны в car_audio_configuration.xml и audio_policy_configuration.xml соответствующего каталога продукта в device.

<!-- source:cn p3 unit:5-2 -->

### Настройка car_audio_configuration.xml

<!-- source:cn p3 unit:5-3 -->

XML продукта по умолчанию задаёт четыре аудиозоны для пользователей четырёх областей. Ниже показана основная аудиозона с ID зоны пассажира 0. Определены три группы громкости; устройства одной группы имеют одинаковое усиление. Первая группа содержит bus0_media_out и bus6_notification_out; bus0_media_out соответствует контекстам music и announcement. В источнике сказано, что вторая, третья и четвёртая задаются аналогично. При необходимости удаляйте группы громкости или зоны. Примечания:

<!-- source:cn p3 unit:6 -->

1. Значение audioZoneId основной аудиозоны всегда равно нулю.

<!-- source:cn p3 unit:7 -->

2. Значения audioZoneId и occupantZoneId не должны повторяться. occupantZoneId служит для сопоставления UserID и DisplayID. Например, occupantZoneId 0, 1 и 2 в car_audio_configuration.xml задают конфигурации трёх аудиозон.

<!-- source:cn p3 unit:8 -->

3. Между audioZoneId и occupantZoneId допустимо только взаимно однозначное соответствие.

<!-- source:cn p3 unit:9 -->

4. Каждому context необходимо назначить device address, причём только один.

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

### Настройка audio_policy_configuration.xml

<!-- source:cn p4 unit:11-1 -->

После XML верхнего сервиса настройте потоки и устройства фреймворка: добавьте attchedDevices, mixport, deviceport и routes между mixport и deviceport. Ниже приведены устройства, порты потоков, порты устройств и маршруты основной аудиозоны.

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

### Воспроизведение звука пассажира в основной зоне (Android 14)

<!-- source:cn p6 unit:15-1 -->

Звук пассажирской зоны с контекстом Music воспроизводится устройством зоны главного экрана. Источник описывает передачу userid пассажирской зоны через API CarAudioManager allowMediaAudioOnPrimaryZone(long requestId, booleanallowed) для этой функции.

<!-- source:cn p6 unit:15-2 -->

### Динамическая конфигурация аудиозон (Android 14)

<!-- source:cn p6 unit:15-3 -->

В одной аудиозоне контекст может иметь два выходных bus address с переключением во время воспроизведения. Для динамической конфигурации измените автомобильную аудиоконфигурацию. В примере для зоны с ID 1 заданы zone 1 config 0 и zone 1 config 1.

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

Примечания:

<!-- source:cn p6 unit:18 -->

1. Адреса двух zoneConfig различаются; их можно добавлять только в неосновную зону.

<!-- source:cn p6 unit:19-0 -->

2. Добавленный device address необходимо определить в audio_policy_configuraion.xml.

<!-- source:cn p6 unit:19-1 -->

### Зеркалирование аудиозон (Android 14)

<!-- source:cn p7 unit:20 -->

Зеркалирование позволяет пассажирам совместно слушать звук: два или более устройства получают одинаковые аудиоданные. Конфигурация ниже задаёт зеркальное устройство с адресом bus_1000. Внешнее приложение вызывает enableMirrorForAudioZones и передаёт системе список zoneID зеркалирования. Автомобильная система выводит одинаковые данные на все bus address соответствующих zoneID.

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

## Аудиофокус

<!-- source:cn p7 unit:23-0 -->

### Основы аудиофокуса

<!-- source:cn p7 unit:23-1 -->

Аудиофокус позволяет услышать нужный звук при одновременном воспроизведении несколькими приложениями и предотвращает мешающее смешение звука. Перед воспроизведением запросите фокус и начинайте только после его получения.

<!-- source:cn p7 unit:23-2 -->

### API получения аудиофокуса

<!-- source:cn p7 unit:23-3 -->

Android audioManager предоставляет requestAudioFocus для получения фокуса.

<!-- source:cn p7 unit:23-4 -->

### Обработка запросов фокуса AAOS

<!-- source:cn p7 unit:23-5 -->

CarAudioService решает, принять ли запрос фокуса, по его параметрам и текущему контексту. Правила задаёт матрица взаимодействий запрашиваемого CarAudioContext с CarAudioContext текущего владельца: исключительное, отказ или одновременное. См. https://source.android.com/docs/devices/automotive/audio/audio-focus?hl=zh-cn . Источник указывает audioUseHalDuckingSignals=ture в car_audio_configuration.xml: при AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK вызывается onDevicesToDuckChange audioControl HAL для снижения громкости. При false события duck не передаются HAL и не обрабатываются верхним уровнем.

<!-- source:cn p7 unit:24 -->

## Регулировка громкости

<!-- source:cn p7 unit:25-0 -->

### Регулировка громкости

<!-- source:cn p7 unit:25-1 -->

Внешние приложения должны получать и задавать громкость через соответствующие API CarAudioManger. В overlay продукта в device задайте config_useFixedVolume=true для регулировки внешним аппаратным усилителем. Устройства одной volumeGroup в car_audio_configuration.xml регулируются синхронно. config_handleVolumeKeysInWindowManager=true передаёт обработку клавиш прямо CarService, минуя Android framework. audioUseCarVolumeGroupMuting=true (рекомендуется) включает отдельное отключение звука каждой группы. При false (по умолчанию) отдельное отключение групп запрещено и используется общее master mute. Обработка громкости клавишами и интерфейсом вызывает carAudioService, минуя системный аудиофреймворк Android; клавиши управляют только громкостью зоны главного экрана.

<!-- source:cn p7 unit:26 -->

## Плагины PCM

<!-- source:cn p8 unit:27-0 -->

Плагины PCM расширяют возможности PCM-устройств: преобразуют частоту дискретизации, копируют данные между каналами и выполняют другие операции. Они управляются файлом vendor/etc/asound.conf. Формат описан в ALSA project - the C library reference: PCM (digital audio) plugins (alsa-project.org).

<!-- source:cn p8 unit:27-1 -->

### Плагин dshare

<!-- source:cn p8 unit:27-2 -->

Плагин разделяет несколько каналов между клиентами, предоставляя исключительный доступ к каждому каналу. В отличие от share отдельный серверный процесс не нужен: клиенты одновременно обращаются к общему буферу, как в dmix и dsnoop. Поддерживаемые параметры приведены ниже.

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

### Плагин dsnoop

<!-- source:cn p8 unit:29-1 -->

Плагин разделяет многоканальный поток записи между клиентами с исключительным доступом к каждому каналу. Ниже приведены поддерживаемые параметры.

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

Android управляет звуком приложений, контролирует приложения и направляет звук в HAL по его типу. HAL выбирает соответствующие выходные устройства и направляет их на нужные динамики.

<!-- source:cn p9 unit:33-1 -->

### Выходные устройства

<!-- source:cn p9 unit:33-2 -->

На уровне Audio HAL AUDIO_DEVICE_OUT_BUS представляет общие автомобильные выходные устройства с адресуемыми портами, каждый из которых соответствует порту физического устройства. По ожиданиям источника, это единственный поддерживаемый автомобильный выходной тип. Тип передаётся через start_output_stream; BUS address фиксируется при загрузке, когда open_output_stream открывает поток.

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

### Входные устройства

<!-- source:cn p10 unit:36-1 -->

При записи Audio HAL получает вызов openInputStream с параметром AudioSource, указывающим способ обработки записываемого потока.

<!-- source:cn p10 unit:36-2 -->

### Важные замечания

<!-- source:cn p10 unit:37 -->

1. ID звуковой карты и устройства в asound.conf должны совпадать с HAL. Например, bus0_media_out назначены cardID 103 и device 0; в asound.conf требуется соответствующий узел PCM pcmC103D0p.

<!-- source:cn p10 unit:38 -->

2. Источник требует начинать нумерацию звуковых карт dshare/dsnoop с 100.

<!-- source:cn p10 unit:39 -->

## AudioControl HAL

<!-- source:cn p10 unit:40-0 -->

AudioControl HAL — введённый в AAOS слой управления автомобильной аудиоаппаратурой. С ним взаимодействует автомобильный аудиосервис. Внешняя аппаратура, например приборная панель или радио, сообщает сервису состояние звука через HAL; состояние звука AAOS также может передаваться внешней аппаратуре через HAL.

<!-- source:cn p10 unit:40-1 -->

### Управление громкостью (Android 12)

<!-- source:cn p10 unit:40-2 -->

Автомобильный аудиосервис Android 12 регулирует громкость внешней аудиоаппаратуры через AudioControl HAL. По состоянию источника Android 14 это ещё не поддерживает; ducking, баланс и другие функции также пока не поддерживаются.

<!-- source:cn p10 unit:41 -->

## AAudio

<!-- source:cn p10 unit:42-0 -->

### Основные понятия

<!-- source:cn p10 unit:42-1 -->

AAudio — аудио-API Android 8.0 и новее. Низколатентный тракт уменьшает задержку записи и воспроизведения при использовании HAL и драйвера с MMAP. Есть режимы shared и exclusive. В exclusive код клиентского приложения пишет непосредственно в отображённый в память буфер, общий с драйвером ALSA. В shared буфер MMAP использует микшер AudioServer. Exclusive обходит микшер и существенно уменьшает задержку.

<!-- source:cn p10 unit:42-2 -->

### Добавление конфигурации

<!-- source:cn p10 unit:42-3 -->

В SDK по умолчанию AAudio MMAP отключён.

<!-- source:cn p10 unit:43 -->

1. Включите AAudio в build.prop каталога продукта.

<!-- source:cn p10 unit:44 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_policy=2
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_exclusive_policy=2
```

<!-- source:cn p10 unit:45 -->

Выберите 1, 2 или 3; рекомендуется 2. 1 = AAUDIO_POLICY_NEVER: только старый тракт, без MMAP. 2 = AAUDIO_POLICY_AUTO: попытка MMAP с возвратом к старому тракту при ошибке или недоступности MMAP. 3 = AAUDIO_POLICY_ALWAYS: только MMAP, без возврата к старому тракту.

<!-- source:cn p10 unit:46 -->

2. Настройте выходные карту и устройство AAudio. Следующее свойство выбирает карту выходного тракта AAudio. Без настройки SDK использует карту 1, устройство 0.

<!-- source:cn p10 unit:47 -->

```text
PRODUCT_PROPERTY_OVERRIDES += aaudio.mmap_card=card:0dev:0
```

<!-- source:cn p11 unit:48 -->

3. Добавьте порты потоков MMAP в audio_policy_configuration.xml: mixport mmap_no_irq_out и mmap_no_irq_in, затем routes к соответствующим deviceport. channelMasks XML, число каналов TDM в DTS и число каналов, задаваемое HAL ядру, должны совпадать. По умолчанию SDK использует восемь каналов.

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
