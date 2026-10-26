---
title: "Rockchip USB Gadget UAC: настройка аудио, испытания и дескрипторы"
description: "Rockchip USB Gadget UAC: настройка аудио, испытания и дескрипторы — V1.3.1"
excerpt: "Rockchip USB Gadget UAC: настройка аудио, испытания и дескрипторы"
translation_key: "163-rockchip-usb-gadget-uac"
slug: "163-rockchip-usb-gadget-uac"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UAC, Linux]
---

{% raw %}

# Rockchip USB Gadget UAC: настройка аудио, испытания и дескрипторы

Платформенная справка ArmSoM по китайскому RK-KF-YF-098 V1.3.1. Область источника: чипы Rockchip, кроме MCU, и Linux 4.4 или новее; поддержка всех плат ArmSoM не подтверждается. Проверяйте плату, SoC, SDK/BSP, патчи ядра, USB и кодек. Журналы и тесты — примеры источника, не измерения ArmSoM; аппаратная проверка не проводилась. Предоставлен только китайский PDF, его рисунки используются во всех языках.

Сохранены сомнения источника: Full/High Speed указаны как 12/480 MHz; 176 kHz как 1056 bytes; 60×24×96 kHz как 132 Mbit/s; период SOF как 128us. Единицы/расчёты требуют проверки, исходные значения не заменены. Раздел громкости Kernel-5.10 пишет uvc_app, остальные — uac_app. Ограничения Windows UAC2 Feature Unit и настройки новых ядер сверяйте с BSP. Примеры удаляют ссылки configfs и переключают USB, потенциально прерывая ADB; не выполнялись.

Техническое предисловие: UAC1/UAC2 поддерживают запись/воспроизведение; UAC1 Legacy требует реальную карту и только воспроизводит; Audio Source только записывает, но предлагает 15 частот. Выбирайте по требованиям изделия. Физические кнопки громкости/выключения звука требуют дополнительного HID, отсутствующего в описанном SDK. Ссылки для разработки:

`Kernel/Documentation/usb/gadget-testing.txt` — 6. HID function

`Kernel/Documentation/ABI/testing/configfs-usb-gadget-hid`

Universal Serial Bus Audio Device Class Specification for Basic Audio Devices — 8 HID Support in Basic Audio Devices

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Настройка UAC ядра

### 1.1 Коммиты ядра

Для полной функциональности обновите код UAC1/UAC2 Kernel-5.10 как минимум до следующего коммита.

```text
usb: gadget: u_audio: add uevent for ppm compensation
```

Для UAC1/UAC2 Kernel-4.4/4.19 сначала проверьте наличие следующих патчей. Если их нет, сообщите о проблеме через Rockchip Redmine или автору исходного документа. Список патчей:

```text
usb: gadget: f_uac1: set baInterfaceNr of ac_header_desc dynamically
usb: gadget: u_audio: fix dev_dbg information
usb: gadget: f_uac: fix volume control to uevent
usb: gadget: u_audio: disable eps when usb disconnect
usb: gadget: u_audio: add uevent for ppm compensation
usb: gadget: f_uac: update maxpacket in function bind
usb: gadget: f_uac: add pktsize calculating at setting playback srate
usb: gadget: f_uac: add volume and mute feature unit
UPSTREAM: usb: gadget: f_uac2: fix packet size calculation
usb: gadget: u_audio: fix the risk of strcpy out of bounds
usb: gadget: f_uac1: disable IN/OUT ep if unused
usb: gadget: u_audio: add uevent for set_alt and set_srate
FROMLIST: usb: gadget: f_uac*: Support multiple sampling rates
FROMLIST: usb: gadget: f_uac*: Reduce code duplication
FROMLIST: usb: gadget: f_uac1: Fix endpoint reading
```

### 1.2 Параметры конфигурации

CONFIG_USB_CONFIGFS_F_UAC1 включает UAC1; CONFIG_USB_CONFIGFS_F_UAC2 — UAC2; CONFIG_USB_CONFIGFS_F_UAC1_LEGACY — UAC1 Legacy; CONFIG_USB_CONFIGFS_F_ACC необходим Audio Source; CONFIG_USB_CONFIGFS_F_AUDIO_SRC включает Audio Source.

### 1.3 Документация

`Documentation/usb/gadget_configfs.txt`

`Documentation/usb/gadget-testing.txt`

`Documentation/ABI/testing/configfs-usb-gadget-uac1`

`Documentation/ABI/testing/configfs-usb-gadget-uac1_legacy`

`Documentation/ABI/testing/configfs-usb-gadget-uac2`

### 1.4 Поддержка функций

Таблица 1-1. Функции устройств UAC1/UAC2 Rockchip.

| Функция | Управление Uevent | Несколько частот | Несколько каналов | Громкость Feature Unit | Синхронизация часов |
| --- | --- | --- | --- | --- | --- |
| UAC1 | YES | YES | YES | YES | YES |
| UAC2 | YES | YES | YES | YES | YES |

[1] Управление Uevent: ядро отправляет uac_app события запуска/остановки UAC, частоты дискретизации и громкости для управления звуковой картой; см. Uevent. [2] Управление громкостью UAC2 Feature Unit несовместимо с Windows. Включайте его для UAC1 и отключайте для UAC2; см. использование UAC. [3] Синхронизация динамически меняет частоту аудиотактового сигнала, согласуя часы USB-хоста и аудиоустройства. В исходном SDK поддерживается только RV1126-Linux-4.19; см. компенсацию PPM.

## 2. Использование и испытания UAC1/UAC2

### 2.1 Сведения об UAC1

USB Audio Class 1 (1998): источник указывает максимум 24 бит/96 кГц, хотя сам стандарт не ограничивает частоту дискретизации. Class 1 связан с USB 1 Full Speed, указанным в источнике как 12 MHz. Пакет до 1023 байт передаётся каждую миллисекунду. Два канала × 24 бит × 96000 Гц = 4608000 бит/с или 576 Byte/ms, что укладывается в предел.

По источнику, более высокая распространённая частота, например 176 кГц, требует 1056 байт и превышает предел пакета. Win, OSX и Linux имеют встроенную поддержку Class 1: без установки драйверов, plug-and-play, два канала 24 бит/96 кГц. Rockchip UAC1 реализует USB Audio Class 1.0 с записью и воспроизведением без физической звуковой карты, задавая bInterval=4. По умолчанию High Speed, запись/воспроизведение 48 KHz, по два канала и 16 бит. [1] Audio 1.0 появился до USB 2.0 и не определяет High Speed. Практические правила, например bInterval=4 изохронной конечной точки, обеспечивают High Speed на отдельных ОС. Источник сообщает о работе на разных платформах и лучшей, чем UAC2, совместимости с версиями Windows. [2] Частота, каналы и разрядность настраиваются через интерфейсы ядра; см. использование UAC.

### 2.2 Сведения об UAC2

USB Audio Class 2 (2009) дополнительно поддерживает 32 бита и распространённые частоты выше 96 кГц. Он использует High Speed, указанный в источнике как 480 MHz, и требует USB 2/3. При скорости в 40 раз выше Full Speed источник считает возможной запись 60 каналов × 24 бита × 96 кГц (132 Mbit/s по оригиналу), заявляет отсутствие ограничения разрешения воспроизведения и обратную совместимость с Class 1. OSX 10.6.4 и Linux имеют драйверы Class 2 с середины 2010 года, с частотами до 384 кГц. Microsoft первоначально не поддерживал UAC2; обновление Windows 10 апреля 2017 добавило встроенный драйвер. Старым Windows нужен сторонний драйвер. Rockchip UAC2 реализует Audio Class 2.0 с записью/воспроизведением без физической карты. По умолчанию High Speed, по 48 KHz и два канала.

Разрядность записи и воспроизведения — 16 бит. [1] Встроенная поддержка UAC2 начинается с Windows 10 версии 1703. [2] Реакции Windows и Linux на аудиособытия немного различаются и требуют адаптации; Linux ведёт себя как Android. [3] Windows запоминает драйверы устройств: после изменения настроек желательно удалить драйвер для повторного обнаружения. [4] Частота, каналы и разрядность задаются интерфейсами ядра; см. использование UAC.

### 2.3 Использование UAC

Настройка и функции Rockchip UAC1/UAC2 в основном одинаковы, различаются протокол и совместимость. Добавьте CONFIG_USB_CONFIGFS_F_UAC1=y для UAC1 или CONFIG_USB_CONFIGFS_F_UAC2=y для UAC2 в defconfig ядра. Пример Linux configfs для Kernel-4.4/4.19:

```text
#!/bin/sh

UAC=uac2

USB_ATTRIBUTE=0x409
USB_GROUP=rockchip
USB_SKELETON=b.1

CONFIGFS_DIR=/sys/kernel/config
USB_CONFIGFS_DIR=${CONFIGFS_DIR}/usb_gadget/${USB_GROUP}
USB_STRINGS_DIR=${USB_CONFIGFS_DIR}/strings/${USB_ATTRIBUTE}
USB_FUNCTIONS_DIR=${USB_CONFIGFS_DIR}/functions
USB_CONFIGS_DIR=${USB_CONFIGFS_DIR}/configs/${USB_SKELETON}

function_init()
{
    mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
}

configfs_init()
{
    echo "Debug: configfs_init"
    mkdir /dev/usb-ffs

    mount -t configfs none ${CONFIGFS_DIR}
    mkdir ${USB_CONFIGFS_DIR} -m 0770
    echo 0x2207 > ${USB_CONFIGFS_DIR}/idVendor
    echo 0x0310 > ${USB_CONFIGFS_DIR}/bcdDevice
    echo 0x0200 > ${USB_CONFIGFS_DIR}/bcdUSB
    mkdir ${USB_STRINGS_DIR}   -m 0770
    SERIAL=`cat /proc/cpuinfo | grep Serial | awk '{print $3}'`
    if [ -z $SERIAL ];then
        SERIAL=0123456789ABCDEF
    fi
    echo $SERIAL > ${USB_STRINGS_DIR}/serialnumber
    echo "rockchip"  > ${USB_STRINGS_DIR}/manufacturer
    echo "uac-test"  > ${USB_STRINGS_DIR}/product

    function_init

    mkdir ${USB_CONFIGS_DIR}  -m 0770
    mkdir ${USB_CONFIGS_DIR}/strings/${USB_ATTRIBUTE}  -m 0770
}

parameter_init()
{
    if [ "$UAC" == "uac2" ]; then
        CONFIG_STRING=uac2
        echo "parameter_init ${CONFIG_STRING}"
    elif [ "$UAC" == "uac1" ];then
        CONFIG_STRING=uac1
        echo "parameter_init ${CONFIG_STRING}"
    else
        echo "parameter_init ${UAC} is invalid"
    fi
}

config_init()
{
    UAC_GS0=${USB_FUNCTIONS_DIR}/$1.gs0
    echo 3 > ${UAC_GS0}/p_chmask
    echo 2 > ${UAC_GS0}/p_ssize
    echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate
    echo ${FU} > ${UAC_GS0}/p_feature_unit
    echo 3 > ${UAC_GS0}/c_chmask
    echo 2 > ${UAC_GS0}/c_ssize
    echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate
    echo ${FU} > ${UAC_GS0}/c_feature_unit
}

syslink_function()
{
    ln -s ${USB_FUNCTIONS_DIR}/$1 ${USB_CONFIGS_DIR}/f${USB_FUNCTIONS_CNT}
    let USB_FUNCTIONS_CNT=USB_FUNCTIONS_CNT+1
}

bind_functions()
{
    USB_FUNCTIONS_CNT=1

    if [ "$UAC" == "uac2" ]; then
        syslink_function uac2.gs0
    elif [ "$UAC" == "uac1" ];then
        syslink_function uac1.gs0
    else
        echo "parameter_init ${UAC} is invalid"
    fi

    echo ${CONFIG_STRING} > ${USB_CONFIGS_DIR}/strings/${USB_ATTRIBUTE}/configuration
}

program_kill()
{
    P_PID=`ps | grep $1 | grep -v grep | awk '{print $1}'`
    test -z ${P_PID} || kill -9 ${P_PID}
}

usb_device_stop()
{
    echo "none" > ${USB_CONFIGFS_DIR}/UDC
    program_kill adbd
    program_kill mtp-server
    ls ${USB_CONFIGS_DIR} | grep f[0-9] | xargs -I {} rm ${USB_CONFIGS_DIR}/{}
}

case "$1" in
start)
    echo "usb_config in $1"
    DIR=$(cd `dirname $0`; pwd)
    parameter_init
    if [ -z $CONFIG_STRING ]; then
        echo "$0: no function be selected"
        exit 0
    fi
    test -d ${USB_CONFIGFS_DIR} || configfs_init
    echo 0x0019 > ${USB_CONFIGFS_DIR}/idProduct
    config_init
    bind_functions
    sleep 1
    UDC=`ls /sys/class/udc/| awk '{print $1}'`
    echo $UDC > ${USB_CONFIGFS_DIR}/UDC
    ;;
stop)
    usb_device_stop
    ;;
restart|reload)
    # Do restart usb by udev
    echo "USB_FORCE_CHANGED" >> /tmp/.usb_config
    usb_device_stop
    sleep 1
    $0 start
    # Don't forget to clear "USB_FORCE_CHANGED"
    sed -i "/USB_FORCE_CHANGED/d" /tmp/.usb_config
    ;;
*)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
esac

exit 0
```

[1] uac.sh restart переключает на UAC1/UAC2. [2] ${UAC} выбирает UAC1 или UAC2. [3] idProduct задаётся изделием и не должен совпадать с ID его других USB-функций. [4] Windows кеширует драйверы; после изменений удалите драйвер для повторного обнаружения. В Kernel-5.10 настройка включена в /oem/usr/bin/usb_config.sh:

```text
[...]

uac1_device_config()
{
  UAC=$1
  mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
  UAC_GS0=${USB_FUNCTIONS_DIR}/${UAC}.gs0
  echo 3 > ${UAC_GS0}/p_chmask
  echo 2 > ${UAC_GS0}/p_ssize
  echo 1 > ${UAC_GS0}/p_mute_present
  echo 1 > ${UAC_GS0}/p_volume_present
  echo -5120 > ${UAC_GS0}/p_volume_min #-20db min must > -96db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate

  echo 3 > ${UAC_GS0}/c_chmask
  echo 2 > ${UAC_GS0}/c_ssize
  echo 4 > ${UAC_GS0}/req_number
  echo 1 > ${UAC_GS0}/c_mute_present
  echo 1 > ${UAC_GS0}/c_volume_present
  echo -3200 > ${UAC_GS0}/c_volume_min #-12.5db
  echo 0 > ${UAC_GS0}/c_volume_max   #0db
  echo 32 > ${UAC_GS0}/c_volume_res #0.125db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate

  ln -s ${UAC_GS0} ${USB_CONFIGS_DIR}/f2
}
uac2_device_config()
{
  UAC=$1
  mkdir ${USB_FUNCTIONS_DIR}/${UAC}.gs0
  UAC_GS0=${USB_FUNCTIONS_DIR}/${UAC}.gs0
  echo 3 > ${UAC_GS0}/p_chmask
  echo 2 > ${UAC_GS0}/p_ssize
  echo 1 > ${UAC_GS0}/p_mute_present
  echo 1 > ${UAC_GS0}/p_volume_present
  echo -5120 > ${UAC_GS0}/p_volume_min #-20db min must > -96db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/p_srate

  echo 3 > ${UAC_GS0}/c_chmask
  echo 2 > ${UAC_GS0}/c_ssize
  echo 4 > ${UAC_GS0}/req_number
  echo 1 > ${UAC_GS0}/c_mute_present
  echo 1 > ${UAC_GS0}/c_volume_present
  echo -3200 > ${UAC_GS0}/c_volume_min #-12.5db
  echo 0 > ${UAC_GS0}/c_volume_max   #0db
  echo 32 > ${UAC_GS0}/c_volume_res #0.125db
  echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate

  ln -s ${UAC_GS0} ${USB_CONFIGS_DIR}/f2
}

[...]
```

#### 2.3.1 Параметры

Каталог function UAC1/UAC2 Kernel-4.4/4.19 содержит следующие интерфейсы параметров:

```text
[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip/functions/uac1.gs0]# ls
c_chmask        c_srate  p_chmask        p_srate  req_number
c_feature_unit  c_ssize  p_feature_unit  p_ssize
```

c — capture виртуальной USB-карты, соответствующий воспроизведению хоста; p — playback карты, соответствующий записи хоста. Каналы независимы. Частота: p_srate/c_srate по умолчанию 48000; несколько частот разделяются запятыми: `echo 8000,16000,44100,48000 > ${UAC_GS0}/c_srate`. Каналы: c_chmask/p_chmask по умолчанию 3 (стерео); поддерживаются многоканальность и отключение направления. Для записи 5.1 без воспроизведения: `echo 0x3F > p_chmask`, затем `echo 0 > c_chmask`. Разрядность: p_ssize/c_ssize по умолчанию 2 байта (16 бит). Громкость: c_feature_unit/p_feature_unit по умолчанию 0 (выключено); запись 1 включает управление.

Громкость UAC2 Feature Unit несовместима с Windows: включайте её для UAC1 и отключайте для UAC2. req_number — число буферов, передаваемых драйвером UAC контроллеру USB. USB разрешает NO DATA, если изохронное устройство не подготовило данные, но macOS это поведение не поддерживает. При высокой нагрузке CPU увеличение req_number увеличивает кеш и совместимость ОС. Каталог function Kernel-5.10 отличается от 4.4/4.19 следующим образом:

```text
#ls /sys/kernel/config/usb_gadget/rockchip/functions/uac1.gs0/
c_chmask          p_ssize           p_volume_max      c_volume_max
c_srate           req_number        p_volume_res      c_volume_res
c_ssize           p_mute_present    c_mute_present    function_name
p_chmask          p_volume_present  c_volume_present
p_srate           p_volume_min      c_volume_min
```

Узлы включения volume/mute меняются с c_feature_unit/p_feature_unit на p_mute_present/p_volume_present и c_mute_present/c_volume_present. Ядро включает функции по умолчанию; uac_app SDK может по умолчанию ими не управлять. MIN_DB/MAX_DB/RES_DB становятся -100 dB/0 dB/1 dB. Узлы p_volume_max/p_volume_min/p_volume_res и c_volume_max/c_volume_min/c_volume_res позволяют настроить значения под кодек изделия. [1] Адаптируйте uac_app для более линейного управления выходом кодека ползунком ПК; см. Windows Audio-Tapered Volume Controls. [2] Устройство сообщает MIN_DB/MAX_DB при перечислении, ПК сопоставляет им положения 0/100.

#### 2.3.2 Uevent

Для точного запуска/остановки звука, нескольких частот и громкости uac_app должен получать и обрабатывать события ядра. Уведомление выполняется через uevent: приложение отслеживает узел uac и извлекает ключевые строки. Start/stop:

```text
g_audio_work: sent uac uevent USB_STATE=SET_INTERFACE STREAM_DIRECTION=IN STREAM_STATE=OFF
g_audio_work: sent uac uevent USB_STATE=SET_INTERFACE STREAM_DIRECTION=OUT STREAM_STATE=ON
```

Несколько частот дискретизации:

```text
g_audio_work: sent uac uevent USB_STATE=SET_SAMPLE_RATE STREAM_DIRECTION=OUT SAMPLE_RATE=44100
```

Громкость/отключение звука:

```text
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=-1154
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=-350
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=0
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=1739
g_audio_work: sent uac uevent USB_STATE=SET_VOLUME STREAM_DIRECTION=IN VOLUME=2612
```

[1] IN означает запись хоста, OUT — воспроизведение хоста. [2] UAC1/UAC2 Kernel-4.4/4.19 преобразует исходную громкость ПК в проценты и передаёт uac_app через uevent. [3] Kernel-5.10 передаёт исходное значение напрямую; uvc_app (написание источника) должен преобразовать его в dB кодека по формуле:

```text
// volume control 与 db 的转换公式
#define VOLUME_USB_TO_DB(v_usb) (v_usb <= 0x7FFF) ? v_usb : (-(((rt_int16_t)0xFFFF - v_usb) + 1))

// uac_app 将 db 转化为⾳量的⽅法
P：百分⽐；a：当前⾳量分⻉值；m：最⼤⾳量分⻉值
P = 10 ^ [(a - m)/10]
a = 10 * lg(P) + m
```

#### 2.3.3 Компенсация PPM

Часы USB приходят от хоста, часы кодека — от устройства. Разные источники вызывают потерю звука и периодические underrun/overrun ALSA. Компенсация PPM сравнивает пакеты SOF хоста каждые 128us (значение источника) с системным временем, вычисляет разницу PPM за интервал и сообщает её через uevent:

```text
g_audio_work: sent uac uevent USB_STATE=SET_AUDIO_CLK PPM=12
g_audio_work: sent uac uevent USB_STATE=SET_AUDIO_CLK PPM=-1
```

PPM вычисляется непрерывно при подключённом USB. Приложение получает uevent и меняет часы кодека через его интерфейс. Со временем оценка стабилизируется; обычно через десять минут новые значения не поступают. Отключение USB сбрасывает счёт SOF: PPM возвращается к 0 и затем стабилизируется заново. При невысоких требованиях реального времени приложение может игнорировать компенсацию.

#### 2.3.4 Совместимость

Для UAC2 в Windows отключите громкость, задав c_feature_unit и p_feature_unit равными 0, иначе драйвер UAC2 не загрузится правильно. Таблица 2-1: поддержка громкости UAC хост-системами.

|  | Windows10 | Linux(ubuntu) | MacOS |
| --- | --- | --- | --- |
| UAC1 | Поддерживается | Не поддерживается | Поддерживается |
| UAC2 | Ошибка драйвера | Не поддерживается | Поддерживается |

### 2.4 Испытания UAC

Методика UAC1 и UAC2 одинакова; пример использует UAC1. После успешной настройки подключите USB к ПК: он обнаружит USB Audio, как на рис. 2-1 (Windows), 2-2 (выход Ubuntu) и 2-3 (вход Ubuntu).

![Рисунок источника — PDF p16](/docs/rockchip-usb-gadget-uac/assets/cn-p016-figure-01.png)

Рисунок 2-1. Windows USB Audio Class 1.

![Рисунок источника — PDF p17](/docs/rockchip-usb-gadget-uac/assets/cn-p017-figure-01.png)

Рисунок 2-2. Выход Ubuntu USB Audio Class 1.

![Рисунок источника — PDF p17](/docs/rockchip-usb-gadget-uac/assets/cn-p017-figure-02.png)

Рисунок 2-3. Вход Ubuntu USB Audio Class 1. UART RK3308 выводит следующий журнал успешного перечисления UAC1:

```text
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 19
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

Просмотр звуковой карты UAC1. В примере это card2 (UAC1Gadget), с узлом воспроизведения pcmC2D0p и записи pcmC2D0c.

```text
# cat /proc/asound/cards
 0 [rockchiprk3308v]: rockchip_rk3308 - rockchip,rk3308-vad
                      rockchip,rk3308-vad
 1 [rockchiprk3308p]: rockchip_rk3308 - rockchip,rk3308-pcm
                      rockchip,rk3308-pcm
 2 [UAC1Gadget     ]: UAC1_Gadget - UAC1_Gadget
                      UAC1_Gadget 0
 7 [Loopback       ]: Loopback - Loopback
                      Loopback 1

# ls -lh /proc/asound/card2
-r--r--r--    1 root     root           0 Dec 31 19:14 id
dr-xr-xr-x    3 root     root           0 Dec 31 19:14 pcm0c
dr-xr-xr-x    3 root     root           0 Dec 31 19:14 pcm0p

# ls /dev/snd/
controlC0  controlC7  pcmC1D0c   pcmC2D0p   pcmC7D1c
controlC1  pcmC0D0c   pcmC1D0p   pcmC7D0c   pcmC7D1p
controlC2  pcmC0D0p   pcmC2D0c   pcmC7D0p   timer
```

#### 2.4.1 Испытания UAC в Windows

В настройках звука Windows выберите USB Audio для выхода и входа/микрофона, как на рис. 2-4.

![Рисунок источника — PDF p19](/docs/rockchip-usb-gadget-uac/assets/cn-p019-figure-01.png)

Рисунок 2-4. Настройки звука Windows. Для проверки воспроизведения UAC1 выполните следующую команду через UART RK3308:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 | aplay -f dat -r 48000 -c 2 -D hw:0,0
```

Команда записывает с Card2 (USB Audio) и воспроизводит через локальную Card0. Включите музыку в Windows: RK3308 воспроизводит её в реальном времени. Для проверки записи UAC1 подготовьте файл через ADB push или arecord: 48 KHz, два канала, 16 бит.

Например, выполните arecord через UART RK3308 для сохранения test.wav:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 /tmp/test.wav
```

После сохранения test.wav выполните команду записи UAC1:

```text
aplay /tmp/test.wav -c 2 -r 48000 -D hw:2,0
```

Затем сохраните запись встроенным Windows Voice Recorder, как на рис. 2-5.

![Рисунок источника — PDF p20](/docs/rockchip-usb-gadget-uac/assets/cn-p020-figure-01.png)

Рисунок 2-5. Windows Voice Recorder. Альтернатива — прослушивание в реальном времени: параметры звука → панель управления звуком → запись → свойства → прослушать; включите «Прослушивать с данного устройства» и выберите динамик. См. рис. 2-6 и 2-7.

![Рисунок источника — PDF p21](/docs/rockchip-usb-gadget-uac/assets/cn-p021-figure-01.png)

Рисунок 2-6. Прослушивание записи Windows, шаг 1.

![Рисунок источника — PDF p22](/docs/rockchip-usb-gadget-uac/assets/cn-p022-figure-01.png)

Рисунок 2-7. Прослушивание записи Windows, шаг 2.

#### 2.4.2 Испытания UAC в Ubuntu

В настройках звука Ubuntu выберите USB Audio для выхода и входа/микрофона; см. рис. 2-8 и 2-9.

![Рисунок источника — PDF p23](/docs/rockchip-usb-gadget-uac/assets/cn-p023-figure-01.png)

Рисунок 2-8. Настройка аудиовыхода Ubuntu.

![Рисунок источника — PDF p23](/docs/rockchip-usb-gadget-uac/assets/cn-p023-figure-02.png)

Рисунок 2-9. Настройка аудиовхода Ubuntu. Для воспроизведения UAC1 выполните команду через UART RK3308:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 | aplay -f dat -r 48000 -c 2 -D hw:0,0
```

Команда записывает Card2 (USB Audio) и воспроизводит через локальную Card0. Музыка Ubuntu звучит на RK3308 в реальном времени. Для записи подготовьте файл 48 KHz, два канала, 16 бит через ADB push или arecord. Пример сохранения test.wav через arecord на UART RK3308:

```text
arecord -f dat -t wav -r 48000 -c 2 -D hw:2,0 /tmp/test.wav
```

После сохранения test.wav выполните команду записи UAC1:

```text
aplay /tmp/test.wav -c 2 -r 48000 -D hw:2,0
```

После команды откройте программу записи Ubuntu, например audacity. Установка:

```text
sudo apt install audacity
```

На рис. 2-10 показан интерфейс записи audacity.

![Рисунок источника — PDF p24](/docs/rockchip-usb-gadget-uac/assets/cn-p024-figure-01.png)

Рисунок 2-10. Ubuntu audacity.

## 3. Использование и испытания UAC1 Legacy

### 3.1 Использование UAC1 Legacy

Параметры по умолчанию: audio_buf_size — размер аудиобуфера 48000; fn_cap — PCM захвата `/dev/snd/pcmC0D0c`; fn_cntl — устройство управления `/dev/snd/controlC0`; fn_play — PCM воспроизведения `/dev/snd/pcmC0D0p`; req_buf_size — размер буфера запроса ISO OUT 200; req_count — количество запросов ISO OUT 256.

Rockchip UAC1 Legacy реализует Audio Class 1.0 только для воспроизведения и требует физическую карту, по умолчанию /dev/snd/pcmC0D0p. Параметры: High Speed, 48 KHz и два канала без настройки, 16 бит. Добавьте CONFIG_USB_CONFIGFS_F_UAC1_LEGACY=y в defconfig. Пример RK3308 EVB:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/uac1_legacy.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Если при старте RK3308 запускается настройка ADB, приведённая конфигурация выдаст ошибку. При отладке настройте UAC1 Legacy следующими командами вручную. В изделии объедините скрипты ADB и UAC1 Legacy согласно требованиям.

```text
rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/ffs.adb

mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
echo "USB Audio Device" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1
ln -s ../../functions/uac1_legacy.gs0

echo ff400000.usb > ../../UDC
```

idProduct задаётся изделием без конфликта с другими USB-функциями. UDC — имя контроллера в /sys/class/udc/. Windows кеширует драйверы; после изменений удалите драйвер для повторного обнаружения. После настройки подключите USB: ПК обнаружит USB Audio, как на рис. 3-1.

![Рисунок источника — PDF p26](/docs/rockchip-usb-gadget-uac/assets/cn-p026-figure-01.png)

Рисунок 3-1. Windows USB Audio Class 1 Legacy. Журнал успешного перечисления на UART RK3308:

```text
configfs-gadget gadget: Hardware params: access 3, format 2, channels 2, rate 48000
dwc2 ff400000.usb: bound driver configfs-gadget
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 25
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

Интерфейсы настройки UAC1 Legacy приведены ниже. Изменения не действуют динамически и должны выполняться в скрипте настройки UAC.

```text
# ls -lh /sys/kernel/config/usb_gadget/g1/functions/uac1_legacy.gs0/
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 audio_buf_size
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_cap
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_cntl
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 fn_play
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 req_buf_size
-rw-r--r--    1 root     root        4.0K Dec 31 19:08 req_count

audio_buf_size - audio buffer size 默认设置为 48000
fn_cap - capture pcm device file name 默认设置为 /dev/snd/pcmC0D0c
fn_cntl - control device file name 默认设置为 /dev/snd/controlC0
fn_play - playback pcm device file name 默认设置为 /dev/snd/pcmC0D0p
req_buf_size - ISO OUT endpoint request buffer size 默认设置为 200
req_count - ISO OUT endpoint request count 默认设置为 256
```

UAC1 Legacy не создаёт соответствующий узел звуковой карты на RK3308.

### 3.2 Испытания UAC1 Legacy

Настройки воспроизведения ПК см. в тестах Windows/Ubuntu UAC. На RK3308 команды не нужны: после подключения USB UAC1 Legacy автоматически открывает локальную Card0.

## 4. Использование и испытания Audio Source

### 4.1 Использование Audio Source

Rockchip Audio Source реализует Audio Class 1.0 только для записи. По умолчанию High Speed и частота playback 44.1 KHz; ПК динамически выбирает одну из следующих 15 частот.

```text
8000, 11025, 16000, 22050, 24000,
32000, 40000, 44100, 48000, 56000,
64000, 72000, 80000, 88200, 96000,
```

Playback имеет два ненастраиваемых канала и 16 бит. Добавьте CONFIG_USB_CONFIGFS_F_ACC=y, необходимый Audio Source, и CONFIG_USB_CONFIGFS_F_AUDIO_SRC=y в defconfig ядра.

Пример настройки Audio Source RK3308 EVB:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "audio" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/audio_source.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Если RK3308 автоматически запускает скрипт ADB, настройка выше завершается ошибкой. Для отладки настройте Audio Source вручную командами ниже. В конечном изделии объедините скрипты ADB и Audio Source.

```text
rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/ffs.adb

mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
echo "USB Audio Device" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
echo "audio" >
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1
ln -s ../../functions/audio_source.gs0

echo ff400000.usb > ../../UDC
```

idProduct задаётся без конфликтов с другими USB-функциями. UDC — имя контроллера в /sys/class/udc/. После изменений удалите кешированный драйвер Windows для повторного обнаружения. Подключите настроенный USB: ПК обнаружит USB Audio, как на рис. 4-1 и 4-2.

![Рисунок источника — PDF p29](/docs/rockchip-usb-gadget-uac/assets/cn-p029-figure-01.png)

Рисунок 4-1. Windows USB Audio Source.

![Рисунок источника — PDF p29](/docs/rockchip-usb-gadget-uac/assets/cn-p029-figure-02.png)

Рисунок 4-2. Ubuntu USB Audio Source. Журнал нормального перечисления Audio Source на UART RK3308:

```text
dwc2 ff400000.usb: new device is high-speed
dwc2 ff400000.usb: new address 23
android_work: sent uevent USB_STATE=CONNECTED
configfs-gadget gadget: high-speed config #1: b
android_work: sent uevent USB_STATE=CONFIGURED
```

Audio Source не предоставляет настраиваемых интерфейсов ядра. Просмотр информации: в примере это card2 (audiosource) только с узлом playback pcmC2D0p.

```text
# cat /proc/asound/cards
 0 [rockchiprk3308v]: rockchip_rk3308 - rockchip,rk3308-vad
                      rockchip,rk3308-vad
 1 [rockchiprk3308p]: rockchip_rk3308 - rockchip,rk3308-pcm
                      rockchip,rk3308-pcm
 2 [audiosource    ]: audio_source - audio_source
                      USB accessory audio source
 7 [Loopback       ]: Loopback - Loopback
                      Loopback 1

# ls -lh /proc/asound/card2
-r--r--r--    1 root     root           0 Dec 31 19:06 id
dr-xr-xr-x    3 root     root           0 Dec 31 19:06 pcm0p

# ls /dev/snd/
controlC0  controlC2  pcmC0D0c   pcmC1D0c   pcmC2D0p   pcmC7D0p   pcmC7D1p
controlC1  controlC7  pcmC0D0p   pcmC1D0p   pcmC7D0c   pcmC7D1c   timer
```

### 4.2 Испытания Audio Source

Для записи Audio Source используйте настройки Windows/Ubuntu, описанные выше. Команда RK3308 при стандартных 44.1 KHz:

```text
aplay /tmp/test.wav -r 44100 -c 2 -D hw:2,0
```

Частота test.wav должна совпадать с записью, иначе возможны шум или отсутствие звука. ПК динамически выбирает одну из 15 частот: настройки звука → панель управления звуком → запись → свойства → дополнительно; выберите частоту (рис. 4-3).

![Рисунок источника — PDF p31](/docs/rockchip-usb-gadget-uac/assets/cn-p031-figure-01.png)

Рисунок 4-3. Настройки Windows USB Audio Source.

## 5. Совместное использование и испытания UAC1 Legacy и Audio Source

### 5.1 Использование составного устройства

UAC1 Legacy и Audio Source объединяются в составное USB-устройство с записью и воспроизведением. Добавьте CONFIG_USB_CONFIGFS_F_UAC1_LEGACY=y, CONFIG_USB_CONFIGFS_F_ACC=y (зависимость Audio Source) и CONFIG_USB_CONFIGFS_F_AUDIO_SRC=y в defconfig. Отдельно примените support_uac1_legacy_and_audio_source.patch. Пример RK3308 EVB:

```text
mount -t configfs none /sys/kernel/config
mkdir /sys/kernel/config/usb_gadget/rockchip  -m 0770
echo 0x2207 > /sys/kernel/config/usb_gadget/rockchip/idVendor
echo 0x0019 > /sys/kernel/config/usb_gadget/rockchip/idProduct
echo 0x0100 > /sys/kernel/config/usb_gadget/rockchip/bcdDevice
mkdir /sys/kernel/config/usb_gadget/rockchip/strings/0x409   -m 0770
echo "0123456789ABCDEF" > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/serialnumber
echo "rockchip"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/manufacturer
echo "USB Audio Device"  > /sys/kernel/config/usb_gadget/rockchip/strings/0x409/product
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1  -m 0770
mkdir /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409  -m 0770
echo 500 > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/MaxPower
echo "uac1" > /sys/kernel/config/usb_gadget/rockchip/configs/b.1/strings/0x409/configuration
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/uac1_legacy.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/uac1_legacy.gs0
mkdir /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
ln -s /sys/kernel/config/usb_gadget/rockchip/functions/audio_source.gs0
/sys/kernel/config/usb_gadget/rockchip/configs/b.1/audio_source.gs0
echo ff400000.usb > /sys/kernel/config/usb_gadget/rockchip/UDC
```

Другие методы настройки и отладки см. в разделах использования UAC1 Legacy и Audio Source.

### 5.2 Испытания составного устройства

См. испытания UAC1 Legacy и Audio Source.

## 6. Источники

Протоколы USB от USB-IF:

- Universal Serial Bus Specification, Revision 2.0
- Universal Serial Bus Audio Device Class Specification for Basic Audio Devices
- Universal Serial Bus Device Class Definition for Audio Devices, Release 1.0
- Universal Serial Bus Device Class Definition for Audio Devices, Release 2.0
- Universal Serial Bus Device Class Definition for Audio Data Formats (USB Audio Data Formats)
- Universal Serial Bus Device Class Definition for Terminal Types (USB Audio Terminal Types)

Другие источники:

- The Well-Tempered Computer (An introduction to computer audio) — USB
- Windows USB Audio 2.0 Drivers
- Windows Audio-Tapered Volume Controls

## 7. Приложение A: дескриптор UAC1

```text
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  idVendor           0x2207
  idProduct          0x0019
  bcdDevice            1.00
  iManufacturer           1 rockchip
  iProduct                2 USB Audio Device
  iSerial                 3 0123456789ABCDEF
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength          174
    bNumInterfaces          3
    bConfigurationValue     1
    iConfiguration          4 audio
    bmAttributes         0x80
      (Bus Powered)
    MaxPower              500mA
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      1 Control Device
      bInterfaceProtocol      0
      iInterface              5 AC Interface
      AudioControl Interface Descriptor:
        bLength                10
        bDescriptorType        36
        bDescriptorSubtype      1 (HEADER)
        bcdADC               1.00
        wTotalLength           52
        bInCollection           2
        baInterfaceNr( 0)       1
        baInterfaceNr( 1)       2
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             1
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bNrChannels             2
        wChannelConfig     0x0003
          Left Front (L)
          Right Front (R)
        iChannelNames           7 Playback Channels
        iTerminal               6 Playback Input terminal
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             2
        wTerminalType      0x0301 Speaker
        bAssocTerminal          0
        bSourceID               1
        iTerminal               8 Playback Output terminal
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             3
        wTerminalType      0x0201 Microphone
        bAssocTerminal          0
        bNrChannels             2
        wChannelConfig     0x0003
          Left Front (L)
          Right Front (R)
        iChannelNames          10 Capture Channels
        iTerminal               9 Capture Input terminal
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             4
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bSourceID               3
        iTerminal              11 Capture Output terminal
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             12 Playback Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             13 Playback Active
      AudioStreaming Interface Descriptor:
        bLength                 7
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           1
        bDelay                  1 frames
        wFormatTag              1 PCM
      AudioStreaming Interface Descriptor:
        bLength                11
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bNrChannels             2
        bSubframeSize           2
        bBitResolution         16
        bSamFreqType            1 Discrete
        tSamFreq[ 0]        48000
      Endpoint Descriptor:
        bLength                 9
        bDescriptorType         5
        bEndpointAddress     0x02  EP 2 OUT
        bmAttributes            9
          Transfer Type            Isochronous
          Synch Type               Adaptive
          Usage Type               Data
        wMaxPacketSize     0x00c8  1x 200 bytes
        bInterval               4
        bRefresh                0
        bSynchAddress           0
        AudioControl Endpoint Descriptor:
          bLength                 7
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x01
            Sampling Frequency
          bLockDelayUnits         1 Milliseconds
          wLockDelay              1 Milliseconds
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             14 Capture Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol      0
      iInterface             15 Capture Active
      AudioStreaming Interface Descriptor:
        bLength                 7
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           4
        bDelay                  1 frames
        wFormatTag              1 PCM
      AudioStreaming Interface Descriptor:
        bLength                11
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bNrChannels             2
        bSubframeSize           2
        bBitResolution         16
        bSamFreqType            1 Discrete
        tSamFreq[ 0]        48000
      Endpoint Descriptor:
        bLength                 9
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes            5
          Transfer Type            Isochronous
          Synch Type               Asynchronous
          Usage Type               Data
        wMaxPacketSize     0x00c8  1x 200 bytes
        bInterval               4
        bRefresh                0
        bSynchAddress           0
        AudioControl Endpoint Descriptor:
          bLength                 7
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x01
            Sampling Frequency
          bLockDelayUnits         0 Undefined
          wLockDelay              0 Undefined
Device Qualifier (for other device speed):
  bLength                10
  bDescriptorType         6
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  bNumConfigurations      1
Device Status:     0x0000
  (Bus Powered)
```

## 8. Приложение B: дескриптор UAC2

```text
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  idVendor           0x2207
  idProduct          0x0019
  bcdDevice            2.00
  iManufacturer           1 rockchip
  iProduct                2 USB Audio Device
  iSerial                 3 0123456789ABCDEF
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength          219
    bNumInterfaces          3
    bConfigurationValue     1
    iConfiguration          4 audio
    bmAttributes         0x80
      (Bus Powered)
    MaxPower              500mA
    Interface Association:
      bLength                 8
      bDescriptorType        11
      bFirstInterface         0
      bInterfaceCount         3
      bFunctionClass          1 Audio
      bFunctionSubClass       0
      bFunctionProtocol      32
      iFunction               5 Source/Sink
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      1 Control Device
      bInterfaceProtocol     32
      iInterface              6 Topology Control
      AudioControl Interface Descriptor:
        bLength                 9
        bDescriptorType        36
        bDescriptorSubtype      1 (HEADER)
        bcdADC               2.00
        bCategory               8
        wTotalLength           83
        bmControl            0x00
      AudioControl Interface Descriptor:
        bLength                 8
        bDescriptorType        36
        bDescriptorSubtype     10 (CLOCK_SOURCE)
        bClockID                6
        bmAttributes         0x01 Internal fixed Clock
        bmControls           0x01
          Clock Frequency Control (read-only)
        bAssocTerminal          0
        iClockSource            7 48000Hz
      AudioControl Interface Descriptor:
        bLength                 8
        bDescriptorType        36
        bDescriptorSubtype     10 (CLOCK_SOURCE)
        bClockID                5
        bmAttributes         0x01 Internal fixed Clock
        bmControls           0x01
          Clock Frequency Control (read-only)
        bAssocTerminal          0
        iClockSource            8 64000Hz
      AudioControl Interface Descriptor:
        bLength                17
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             1
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bCSourceID              5
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        bmControls    0x0003
          Copy Protect Control (read/write)
        iChannelNames           0
        iTerminal               9 USBH Out
      AudioControl Interface Descriptor:
        bLength                17
        bDescriptorType        36
        bDescriptorSubtype      2 (INPUT_TERMINAL)
        bTerminalID             2
        wTerminalType      0x0201 Microphone
        bAssocTerminal          0
        bCSourceID              6
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        bmControls    0x0003
          Copy Protect Control (read/write)
        iChannelNames           0
        iTerminal              10 USBD Out
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             4
        wTerminalType      0x0101 USB Streaming
        bAssocTerminal          0
        bSourceID               2
        bCSourceID              6
        bmControls         0x0003
          Copy Protect Control (read/write)
        iTerminal              11 USBH In
      AudioControl Interface Descriptor:
        bLength                12
        bDescriptorType        36
        bDescriptorSubtype      3 (OUTPUT_TERMINAL)
        bTerminalID             3
        wTerminalType      0x0301 Speaker
        bAssocTerminal          0
        bSourceID               1
        bCSourceID              5
        bmControls         0x0003
          Copy Protect Control (read/write)
        iTerminal              12 USBD In
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             13 Playback Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             14 Playback Active
      AudioStreaming Interface Descriptor:
        bLength                16
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           1
        bmControls           0x00
        bFormatType             1
        bmFormats         0x00000001
          PCM
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        iChannelNames           0
      AudioStreaming Interface Descriptor:
        bLength                 6
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bSubslotSize            2
        bBitResolution         16
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x02  EP 2 OUT
        bmAttributes            9
          Transfer Type            Isochronous
          Synch Type               Adaptive
          Usage Type               Data
        wMaxPacketSize     0x0100  1x 256 bytes
        bInterval               4
        AudioControl Endpoint Descriptor:
          bLength                 8
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x00
          bmControls           0x00
          bLockDelayUnits         0 Undefined
          wLockDelay              0
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       0
      bNumEndpoints           0
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             15 Capture Inactive
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        2
      bAlternateSetting       1
      bNumEndpoints           1
      bInterfaceClass         1 Audio
      bInterfaceSubClass      2 Streaming
      bInterfaceProtocol     32
      iInterface             16 Capture Active
      AudioStreaming Interface Descriptor:
        bLength                16
        bDescriptorType        36
        bDescriptorSubtype      1 (AS_GENERAL)
        bTerminalLink           4
        bmControls           0x00
        bFormatType             1
        bmFormats         0x00000001
          PCM
        bNrChannels             2
        bmChannelConfig   0x00000003
          Front Left (FL)
          Front Right (FR)
        iChannelNames           0
      AudioStreaming Interface Descriptor:
        bLength                 6
        bDescriptorType        36
        bDescriptorSubtype      2 (FORMAT_TYPE)
        bFormatType             1 (FORMAT_TYPE_I)
        bSubslotSize            2
        bBitResolution         16
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes           13
          Transfer Type            Isochronous
          Synch Type               Synchronous
          Usage Type               Data
        wMaxPacketSize     0x00c0  1x 192 bytes
        bInterval               4
        AudioControl Endpoint Descriptor:
          bLength                 8
          bDescriptorType        37
          bDescriptorSubtype      1 (EP_GENERAL)
          bmAttributes         0x00
          bmControls           0x00
          bLockDelayUnits         0 Undefined
          wLockDelay              0
Device Qualifier (for other device speed):
  bLength                10
  bDescriptorType         6
  bcdUSB               2.00
  bDeviceClass            0 (Defined at Interface level)
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  bNumConfigurations      1
Device Status:     0x0000
  (Bus Powered)
```

{% endraw %}
