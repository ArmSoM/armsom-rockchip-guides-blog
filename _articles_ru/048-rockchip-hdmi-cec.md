---
title: "Полное руководство Rockchip HDMI-CEC: Android HAL, Linux cec-ctl, сообщения и диагностика"
description: "Полное руководство Rockchip HDMI-CEC: Android HAL, Linux cec-ctl, сообщения и диагностика"
translation_key: "048-rockchip-hdmi-cec"
slug: "048-rockchip-hdmi-cec"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["HDMI-CEC", "Rockchip", "Android", "HAL", "Linux", "cec-ctl"]
keywords: "ArmSoM Rockchip HDMI CEC Android HAL Linux cec-ctl"
excerpt: "Полное руководство Rockchip HDMI-CEC: Android HAL, Linux cec-ctl, сообщения и диагностика"
---

{% raw %}

# Полное руководство Rockchip HDMI-CEC: Android HAL, Linux cec-ctl, сообщения и диагностика

Это справочное руководство Rockchip HDMI-CEC по китайскому PDF V1.1.0 (39 страниц); английский оригинал не предоставлен. Английская и русская статьи полностью переводят технический текст; во всех трёх языках используются рисунки китайского оригинала с локализованными описаниями. Оригинал охватывает Android 5.x и новее, Linux kernel 4.4/4.19 и RK322X/RK3328/RK3368/RK3399/RK3288. Это не подтверждает поддержку всех современных BSP или плат ArmSoM. Проверьте SoC, разводку HDMI CEC, HAL, драйвер CEC, службы Android и прошивку ожидания. Испытания оборудования ArmSoM и совместимости телевизоров не проводились; журналы и действия — примеры оригинала.

[Редакционные замечания](/docs/rockchip-hdmi-cec/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. Введение в CEC

### 1.1 Определение CEC

CEC означает Consumer Electronics Control. Протокол обеспечивает расширенное управление домашними аудиовизуальными устройствами, соединёнными HDMI, с одного пульта.

![Техническая иллюстрация китайского оригинала, p. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-1.png)

Как показано на рисунке, и пульт телевизора, и пульт приставки могут управлять обоими устройствами.

### 1.2 Обзор протокола CEC

CEC предполагает, что все источники аудио/видео прямо или косвенно подключены к корневому дисплею. HDMI образует дерево сверху вниз: дисплей — корень, коммутаторы — ветви, источники — листья. Для адресации и управления каждому устройству нужен ровно один физический адрес. ПО назначает физические адреса сети CEC с помощью EDID.

![Техническая иллюстрация китайского оригинала, p. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-2.png)

Каждое устройство шины CEC должно получить логический адрес, определяющий его тип. Каждый адрес принадлежит только одному устройству, кроме адреса 15. Большинство устройств использует один логический адрес, некоторые — до двух.

![Техническая иллюстрация китайского оригинала, p. 5](/docs/rockchip-hdmi-cec/assets/cn-p5-1.png)

| Адрес | Устройство |
| --- | --- |
| 0 | Телевизор |
| 1 | Устройство записи 1 |
| 2 | Устройство записи 2 |
| 3 | Тюнер 1 |
| 4 | Устройство воспроизведения 1 |
| 5 | Аудиосистема |
| 6 | Тюнер 2 |
| 7 | Тюнер 3 |
| 8 | Устройство воспроизведения 2 |
| 9 | Устройство записи 3 |
| 10 | Тюнер 4 |
| 11 | Устройство воспроизведения 3 |
| 12 | Резерв |
| 13 | Резерв |
| 14 | Специальное применение |
| 15 | Незарегистрированный (инициатор) / широковещательный (получатель) |

Назначение логического адреса показано ниже. POLL MSG с одинаковыми SRC и DST проверяет, занят ли адрес другим устройством.

![Техническая иллюстрация китайского оригинала, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-1.png)

Устройства CEC взаимодействуют посредством сообщений CEC.

![Техническая иллюстрация китайского оригинала, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-2.png)

Сообщение CEC содержит один или несколько блоков. В каждом блоке 8 бит Header/Data, бит EOM и бит ACK. EOM=1 означает последний блок без дальнейших данных. Передатчик устанавливает ACK в 1, а получатель при успешном приёме устанавливает 0 для подтверждения.

![Техническая иллюстрация китайского оригинала, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-3.png)

Header Block — первый блок сообщения. Старшие четыре информационных бита содержат логический адрес отправителя, младшие четыре — получателя. Информационные биты Data Block содержат opcode или параметры.

## 2. Реализация CEC

### 2.1 Инфраструктура CEC Android

#### 2.1.1 Обзор инфраструктуры

Многие производители реализуют HDMI-CEC, что делает возможной совместную работу устройств разных марок. Но различия реализации и функций мешают полной совместимости: два изделия с заявленной поддержкой CEC не обязательно взаимодействуют. Вместе с Android TIF (TV Input Framework) HDMI-CEC обеспечивает обмен между подключёнными устройствами с уменьшением проблем совместимости. Для этого Android ввёл HdmiControlService. Как часть экосистемы Android, он предоставляет производителям стандартную реализацию HDMI-CEC и сокращает несовместимость. Раньше производители разрабатывали собственные реализации либо использовали сторонние. Оригинал описывает HdmiControlService как службу, проверенную с распространёнными устройствами HDMI-CEC, учитывающую исследования совместимости и предложения опытных отраслевых партнёров. Она сочетает стандарт с изменениями, необходимыми для уже используемых изделий. Это утверждения источника, а не испытания совместимости для статьи.

##### 2.1.1.1 HdmiControlService

HdmiControlService реализует CEC совместно с TIF, аудиослужбами, управлением питанием и другими компонентами системы. Схема показывает переход от специального контроллера CEC к более простому аппаратному абстрактному слою HDMI-CEC и реализацию службы HDMI. Основные компоненты:

HdmiControlManager предоставляет API приложениям с соответствующими разрешениями. Системные службы, например TV Input Manager и аудиослужбы, могут использовать класс непосредственно.

Путь исходного кода:

```text
frameworks/base/core/java/android/hardware/hdmi
```

Служба рассчитана на несколько типов логических устройств.

Путь исходного кода:

```text
frameworks/base/services/core/java/com/android/server/hdmi
```

HDMI-CEC обращается к аппаратуре через HAL, скрывающий различия протокола и сигнализации устройств. Производители могут реализовать собственный HAL по существующему интерфейсу.

![Техническая иллюстрация китайского оригинала, p. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-1.png)

![Техническая иллюстрация китайского оригинала, p. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-2.png)

##### 2.1.1.2 HDMI-CEC HAL

Для работы службы CEC реализуйте HDMI-CEC HAL по определениям Android. Он скрывает аппаратные различия и предоставляет API базовых операций: выделения, чтения и записи. Производитель должен поддерживать следующие API. Передача/приём/события:

send_message

register_event_callback

Информация:

get_physical_address

get_version

get_vendor_id

get_port_info

Логические адреса:

add_logical_address

clear_logical_address

Состояние:

is_connected; set_option

set_audio_return_channel

Фрагмент определения API HDMI-CEC HAL:

```text
#ifndef ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H
#define ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H


...

/*
 * HDMI-CEC HAL interface definition.
 */
typedef struct hdmi_cec_device {
   /**
   * Common methods of the HDMI-CEC device. This *must* be the first member of
   * hdmi_cec_device as users of this structure will cast a hw_device_t to
hdmi_cec_device
   * pointer in contexts where it's known the hw_device_t references a
hdmi_cec_device.

   */
   struct hw_device_t common;

   /*
   * (*add_logical_address) passes the logical address that will be used
   * in this system.
   *
   * HAL may use it to configure the hardware so that the CEC commands
addressed
   * the given logical address can be filtered in. This method can be called
   * as many times as necessary in order to support multiple logical devices.
   * addr should be in the range of valid logical addresses for the call
   * to succeed.

   *
   * Returns 0 on success or -errno on error.
   */
   int (*add_logical_address)(const struct hdmi_cec_device* dev,
cec_logical_address_t addr);

   /*
   * (*clear_logical_address) tells HAL to reset all the logical addresses.
   *
   * It is used when the system doesn't need to process CEC command any more,
   * hence to tell HAL to stop receiving commands from the CEC bus, and change
    * the state back to the beginning.
    */
   void (*clear_logical_address)(const struct hdmi_cec_device* dev);


   /*
    * (*get_physical_address) returns the CEC physical address. The
    * address is written to addr.
    *
    * The physical address depends on the topology of the network formed
    * by connected HDMI devices. It is therefore likely to change if the cable
    * is plugged off and on again. It is advised to call get_physical_address
    * to get the updated address when hot plug event takes place.
    *
    * Returns 0 on success or -errno on error.
    */

   int (*get_physical_address)(const struct hdmi_cec_device* dev, uint16_t*
addr);

   /*
    * (*send_message) transmits HDMI-CEC message to other HDMI device.
    *
    * The method should be designed to return in a certain amount of time not
    * hanging forever, which can happen if CEC signal line is pulled low for
    * some reason. HAL implementation should take the situation into account
    * so as not to wait forever for the message to get sent out.
    *
    * It should try retransmission at least once as specified in the standard.
    *

    * Returns error code. See HDMI_RESULT_SUCCESS, HDMI_RESULT_NACK, and
    * HDMI_RESULT_BUSY.
    */
   int (*send_message)(const struct hdmi_cec_device* dev, const cec_message_t*);

   /*
    * (*register_event_callback) registers a callback that HDMI-CEC HAL
    * can later use for incoming CEC messages or internal HDMI events.
    * When calling from C++, use the argument arg to pass the calling object.
    * It will be passed back when the callback is invoked so that the context
    * can be retrieved.
    */

   void (*register_event_callback)(const struct hdmi_cec_device* dev,
         event_callback_t callback, void* arg);

   /*
    * (*get_version) returns the CEC version supported by underlying hardware.
    */
   void (*get_version)(const struct hdmi_cec_device* dev, int* version);

   /*
    * (*get_vendor_id) returns the identifier of the vendor. It is
    * the 24-bit unique company ID obtained from the IEEE Registration
    * Authority Committee (RAC).
    */

   void (*get_vendor_id)(const struct hdmi_cec_device* dev, uint32_t*
vendor_id);
   /*
   * (*get_port_info) returns the hdmi port information of underlying hardware.
   * info is the list of HDMI port information, and 'total' is the number of

   * HDMI ports in the system.
   */
   void (*get_port_info)(const struct hdmi_cec_device* dev,
         struct hdmi_port_info* list[], int* total);

   /*
   * (*set_option) passes flags controlling the way HDMI-CEC service works down
   * to HAL implementation. Those flags will be used in case the feature needs
   * update in HAL itself, firmware or microcontroller.
   */
   void (*set_option)(const struct hdmi_cec_device* dev, int flag, int value);


   /*
   * (*set_audio_return_channel) configures ARC circuit in the hardware logic
   * to start or stop the feature. Flag can be either 1 to start the feature
   * or 0 to stop it.
   *
   * Returns 0 on success or -errno on error.
   */
   void (*set_audio_return_channel)(const struct hdmi_cec_device* dev, int
flag);

   /*
   * (*is_connected) returns the connection status of the specified port.
   * Returns HDMI_CONNECTED if a device is connected, otherwise

HDMI_NOT_CONNECTED.
   * The HAL should watch for +5V power signal to determine the status.
   */
   int (*is_connected)(const struct hdmi_cec_device* dev, int port);

   /* Reserved for future use to maximum 16 functions. Must be NULL. */
   void* reserved[16 - 11];
} hdmi_cec_device_t;

#endif /* ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H */
```

Через эти API служба CEC передаёт и принимает команды HDMI-CEC, выполняет настройку и при необходимости взаимодействует с низкоуровневым микропроцессором, управляющим CEC во время ожидания Android.

#### 2.1.2 Пути исходного кода

Пути кода CEC и их назначение:

| Путь | Описание |
| --- | --- |
| kernel/drivers/media/cec/cec-adap.c | Ядро драйвера CEC: назначение физических/логических адресов и управление событиями и передачей/приёмом сообщений. |
| kernel/drivers/media/cec/cec-api.c | Предоставляет IOCTL пользовательскому пространству. |
| kernel/drivers/media/cec/cec-core.c | Регистрирует устройства CEC. |
| kernel/drivers/media/cec/cec-notifier.c | Уведомляет драйвер CEC об изменениях физического адреса. |
| kernel/drivers/media/cec/cec-edid.c | Вспомогательная обработка EDID, прежде всего получение физического адреса. |
| kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c | Драйвер DW-HDMI CEC, главным образом операции с регистрами DW-HDMI CEC. |

Пути исходного кода Android:

| Путь | Описание |
| --- | --- |
| hardware/rockchip/hdmicec/hdmi_cec.cpp | Реализует стандартный интерфейс CEC HAL. |
| hardware/rockchip/hdmicec/hdmicec_event.cpp | Поток отслеживает сообщения/события CEC ядра и передаёт их вверх. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java | Служба отправки и обработки управляющих сообщений HDMI и команд CEC. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecController.java | Управляет командами и операциями CEC. Преобразует команды пользователя в CEC для HAL; разбирает входящие сообщения и распределяет по модулям. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java | Моделирует логическое устройство CEC, инициализирует его и вызывает специализированные обработчики входящих сообщений. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java | Абстрагирует устройство PLAYBACK и предоставляет его интерфейсы. |

### 2.2 Приложения HDMI CEC в Linux

В Linux утилита cec-ctl из v4l-utils управляет устройствами CEC из командной строки.

#### 2.2.1 Установка v4l-utils

В Debian установите v4l-utils командой:

```text
sudo apt-get install v4l-utils
```

В Buildroot включите следующие параметры сборки:

```text
BR2_PACKAGE_LIBV4L=y
BR2_PACKAGE_LIBV4L_UTILS=y
```

#### 2.2.2 Команды

Команда Playback:

```text
[root@rk3288:/]#cec-ctl --playback -o Rockchip -V 0xaabbcc -M -T
```

Часть вывода:

```text
CEC_ADAP_G_CAPS returned 0 (Success)
CEC_ADAP_G_PHYS_ADDR returned 0 (Success)

CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_G_LOG_ADDRS returned 0 (Success)
Driver Info:
Driver Name : dwhdmi-rockchip
Adapter Name : dw_hdmi
Capabilities : 0x0000000e
Logical Addresses
Transmit
Passthrough
Driver version : 4.4.167
Available Logical Addresses: 4
Physical Address : 1.0.0.0

Logical Address Mask : 0x0010
CEC Version : 2.0
Vendor ID : 0xaabbcc
Logical Address : 4 (Playback Device 1)
Primary Device Type : Playback
Logical Address Type : Playback
All Device Types : Playback
RC TV Profile : None
Device Features : None
Monitor All mode is not supported, falling back to regular monitoring
CEC_S_MODE returned 0 (Success)
CEC_DQEVENT returned 0 (Success)
```

При инициализации CEC передаются основные сведения: vendor ID, имя OSD и версия CEC:

```text
Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_DEVICE_VENDOR_ID
(0x8c)
CEC_RECEIVE returned 0 (Success)

Transmitted by Playback Device 1 to all (4 to 15): CEC_MSG_DEVICE_VENDOR_ID
(0x87):
vendor-id: 11189196 (0x00aabbcc)
CEC_RECEIVE returned 0 (Success)

Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_OSD_NAME (0x46)
CEC_RECEIVE returned 0 (Success)
Transmitted by Playback Device 1 to TV (4 to 0): CEC_MSG_SET_OSD_NAME (0x47):
name: Rockchip
CEC_RECEIVE returned 0 (Success)
```

При переходе телевизора в ожидание он отправляет SoC сообщение standby:

```text
Received from TV to all (0 to 15): CEC_MSG_STANDBY (0x36)
CEC_RECEIVE returned 0 (Success)
```

При смене источника телевизор отправляет следующие сообщения:

```text
Received from TV to all (0 to 15): CEC_MSG_SET_STREAM_PATH (0x86):
phys-addr: 2.0.0.0

CEC_RECEIVE returned 0 (Success)
Received from TV to all (0 to 15): CEC_MSG_ROUTING_CHANGE (0x80):
orig-phys-addr: 0.0.0.0
new-phys-addr: 2.0.0.0
CEC_RECEIVE returned 0 (Success)
```

Команда One-touch-play:

```text
[root@rk3288:/]# cec-ctl --help-one-touch-play
One Touch Play Feature:

--active-source=phys-addr=<val> Send ACTIVE_SOURCE message (0x82)
--image-view-on Send IMAGE_VIEW_ON message (0x04)
--text-view-on Send TEXT_VIEW_ON message (0x0d)
```

Разбудить телевизор:

```text
[root@rk3288:/]#cec-ctl --image-view-on -to 0
```

Команда Standby:

```text
[root@rk3288:/]# cec-ctl --standby --to 0
```

Дополнительные команды пользовательского пространства приведены в cec-ctl --help.

Примечания

Описанная реализация пока не поддерживает переход SoC в ожидание и пробуждение по событиям телевизора.

Для ожидания используйте пример Playback из §2.2.2: после CEC_MSG_STANDBY вызовите echo mem > /sys/power/state для синхронного перехода SoC в ожидание. Пробуждение требует обработки trust, cec-clk и HDMI PHY во время ожидания и недостаточно поддерживается описанной реализацией.

Не каждое HDMI-устройство поддерживает CEC. Сначала проверьте поддержку CEC и конкретной команды телевизором или HDMI-дисплеем.

### 2.3 Программные процессы CEC

#### 2.3.1 Инициализация CEC

##### 2.3.1.1 Регистрация драйвера CEC

![Техническая иллюстрация китайского оригинала, p. 15](/docs/rockchip-hdmi-cec/assets/cn-p15-1.png)

Схема выше показывает регистрацию драйвера CEC.

dw_hdmi_cec_probe:

Инициализирует драйвер CEC и связывает абстрактное устройство системы с реальной аппаратурой. Также настраивает регистры CEC и регистрирует прерывание передачи/приёма сообщений (cec->irq).

cec_allocate_adapter:

(1) Создаёт и настраивает адаптер.

Структура адаптера:

```text
struct cec_adapter {
      struct module *owner;

      char name[32];
      struct cec_devnode devnode;
      struct mutex lock;
      struct rc_dev *rc;
      struct list_head transmit_queue;
      unsigned int transmit_queue_sz;

      struct list_head wait_queue;
      struct cec_data *transmitting;

      struct task_struct *kthread_config;
      struct completion config_completion;

      struct task_struct *kthread;
      wait_queue_head_t kthread_waitq;
      wait_queue_head_t waitq;

      const struct cec_adap_ops *ops;
      void *priv;

      u32 capabilities;
      u8 available_log_addrs;
     u32 monitor_all_cnt;
      u32 monitor_pin_cnt;
      u32 follower_cnt;
      struct cec_fh *cec_follower;
      struct cec_fh *cec_initiator;
      bool passthrough;
      struct cec_log_addrs log_addrs;

      u32 tx_timeouts;

#ifdef CONFIG_CEC_NOTIFIER

      struct cec_notifier *notifier;
#endif
#ifdef CONFIG_CEC_PIN
      struct cec_pin *pin;
#endif

      struct dentry *cec_dir;
      struct dentry *status_file;

      u16 phys_addrs[15];
      u32 sequence;


      char input_name[32];
      char input_phys[32];
      char input_drv[32];
};
```

Основные поля структуры описаны ниже:

| Имя | Описание |
| --- | --- |
| transmit_queue | Очередь ожидающих передачи сообщений CEC. |
| transmit_queue_sz | Длина очереди передачи. |
| wait_queue | Хранит сообщения, ожидающие ответа, если включено ожидание; в этой версии не используется. |
| transmitting | Текущее передаваемое сообщение CEC. |
| kthread_config | Поток начальной настройки CEC. |
| config_completion | Объект completion для ожидания инициализации CEC (в оригинале назван семафором). |
| kthread | Дескриптор cec_thread_func, управляющего очередью передачи CEC. |
| kthread_waitq | Очередь ожидания cec_thread_func. |
| ops | Обратные вызовы адаптера; см. kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c. |
| capabilities | Настроенные возможности адаптера. |
| available_log_addrs | Максимальное число назначаемых логических адресов. |
| phys_addr | Текущий физический адрес. |
| is_configuring | Выполняется начальная настройка. |
| is_configured | Начальная настройка завершена. |
| follower_cnt | Число follower; в описанном решении 1. |
| cec_follower | Текущий cec_follower; в этой версии fh. |
| cec_initiator | Текущий cec_initiator; в этой версии fh. |
| passthrough | Использует ли текущий cec_follower passthrough. |
| log_addrs | Один или несколько назначенных логических адресов. |
| tx_timeouts | Число тайм-аутов передачи CEC; обычно редки. |
| notifier | Уведомитель CEC. |
| phys_addrs | Физические адреса для случая нескольких логических адресов. |
| sequence | Порядковый номер передачи адаптера для отслеживания сообщений, ожидающих ответа. |

(2) Запускает cec_thread_func для управления очередью передачи сообщений CEC.

(3) Настраивает возможности адаптера, описанные ниже:

| Имя | Описание |
| --- | --- |
| CEC_CAP_PHYS_ADDR | Пользовательское пространство должно задать физический адрес. |
| CEC_CAP_LOG_ADDRS | Пользовательское пространство должно задать логические адреса. |
| CEC_CAP_TRANSMIT | Разрешает отправку сообщений CEC из пользовательского пространства. |
| CEC_CAP_PASSTHROUGH | Драйвер передаёт входящие сообщения пользовательскому пространству без обработки. |
| CEC_CAP_RC | Поддерживает управление CEC через драйвер дистанционного управления. |
| CEC_CAP_MONITOR_ALL | Принимает все сообщения CEC, включая адресованные другим устройствам, обычно для отладки. |
| CEC_CAP_NEEDS_HPD | Включает CEC только при высоком уровне HDMI HPD. |
| CEC_CAP_MONITOR_PIN | Отслеживает изменения вывода CEC. |

cec_register_adapter:

(1) Регистрирует узел устройства CEC.

(2) Регистрирует отладочные узлы CEC.

cec_register_cec_notifier:

Регистрирует CEC notifier и привязывает его к адаптеру.

##### 2.3.1.2 Начальная настройка CEC

Для работы CEC нужна правильная инициализация: включение функций, назначение и сохранение логического адреса и завершение настройки драйвера. Процессы FRAMEWORK, JNI и HAL показаны ниже:

![Техническая иллюстрация китайского оригинала, p. 19](/docs/rockchip-hdmi-cec/assets/cn-p19-1.png)

Основные этапы:

initializeCec:

initializeCec — основной этап инициализации. Он выполняется при загрузке, после пробуждения и при включении CEC в Settings. Он инициализирует локальные устройства, назначает логические адреса и включает CEC. В описанном Android поддерживаются только TV и PLAYBACK; Rockchip главным образом использует PLAYBACK.

initializeLocalDevices:

(1) Создаёт и инициализирует локальное устройство CEC — HdmiCecLocalDevicePlayback. (2) localDevice.init вызывает getPreferredAddress для чтения persist.sys.hdmi.addr.playback. Сначала пробуется ранее назначенный адрес; иначе поиск начинается с первого адреса типа устройства — 0x4 для PLAYBACK. (3) localDevices.add добавляет устройство в список localDevices.

hdmi_cec_set_option:

При инициализации HAL включает следующие параметры CEC:

| Имя | Описание |
| --- | --- |
| HDMI_OPTION_WAKEUP | При false сообщения Image View On/Text View On и другие команды пробуждения не будят систему. В описанной версии переключатель фактически не действует, поскольку пробуждение системы по CEC не реализовано. |
| HDMI_OPTION_ENABLE_CEC | Главный переключатель CEC. При false HAL не отправляет и не принимает сообщения. Управляется общим переключателем CEC в Settings. |
| HDMI_OPTION_SYSTEM_CEC_CONTROL | Устанавливается в false при ожидании и true при пробуждении. False означает, что Android перестаёт обрабатывать сообщения CEC и управление передаётся нижнему уровню. Сейчас практически не действует; может использоваться при будущей поддержке пробуждения CEC. |

allocateLogicalAddress:

Главным образом назначает логический адрес.

(1) Вызывает hdmi_cec_send_message HAL для POLL. Если все попытки дают NACK, выбирается этот адрес. Число попыток задаётся HdmiConfig.ADDRESS_ALLOCATION_RETRY.

(2) Вызывает hdmi_cec_add_logical_address HAL для передачи выбранного адреса драйверу.

(3) После назначения onAddressAllocated отправляет несколько сообщений CEC, включая ReportPhysicalAddress.

Здесь возникает несогласованность процессов. Назначение логического адреса CEC требует POLL: NACK означает свободный адрес, который можно выбрать.

Android FRAMEWORK непосредственно отправляет несколько POLL через hdmi_cec_send_message HAL. Если подтверждения нет, он выбирает адрес и лишь затем передаёт его драйверу. Драйвер CEC ядра сначала требует инициализацию/configure, выполняет назначение через IOCTL CEC_ADAP_S_PHYS_ADDR согласно этому фрагменту оригинала и сообщает адрес вверх. До этого прямая отправка POLL через send_message запрещена. Далее подробный процесс оригинала использует CEC_ADAP_S_LOG_ADDRS; различие сохранено для проверки.

HAL согласует эти процессы. Когда FRAMEWORK запрашивает POLL через hdmi_cec_send_message, HAL читает адрес ядра через CEC_ADAP_G_LOG_ADDRS. При отсутствии адреса (CEC_LOG_ADDR_INVALID) назначает его через CEC_ADAP_S_LOG_ADDRS. Если адрес ядра совпадает с адресом POLL, HAL возвращает NACK; иначе success. FRAMEWORK проверяет следующий адрес, пока его выбор не совпадёт с выбором ядра.

Процесс инициализации CEC в ядре:

![Техническая иллюстрация китайского оригинала, p. 21](/docs/rockchip-hdmi-cec/assets/cn-p21-1.png)

HAL вызывает cec_adap_s_log_addrs через IOCTL CEC_ADAP_S_LOG_ADDRS.

cec_claim_log_addrs запускает cec_config_thread_func и ожидает завершения через wait_for_completion(&adap->config_completion).

```text
static void cec_claim_log_addrs(struct cec_adapter *adap, bool block)
{

   if (WARN_ON(adap->is_configuring || adap->is_configured))
      return;
   init_completion(&adap->config_completion);

   /* Ready to kick off the thread */

   adap->is_configuring = true;
   adap->kthread_config = kthread_run(cec_config_thread_func, adap,
                 "ceccfg-%s", adap->name);
   if (IS_ERR(adap->kthread_config)) {
      adap->kthread_config = NULL;
   } else if (block) {
      mutex_unlock(&adap->lock);
      wait_for_completion(&adap->config_completion);
      mutex_lock(&adap->lock);
   }
}
```

cec_config_thread_func помещает POLL в очередь и отправляет через cec_transmit_msg_fh. При отсутствии подтверждения назначается этот адрес.

Обратный вызов adap->ops->adap_log_addr вызывает dw_hdmi_cec_log_addr для записи адреса в регистры CEC.

Инициализация завершена (adap->is_configured=true). cec_post_state_event сообщает об изменении состояния верхнему уровню.

cec_msg_report_physical_addr создаёт сообщение report physical addr, помещает его в очередь и отправляет.

complete(&adap->config_completion) пробуждает поток, ожидающий завершения настройки.

#### 2.3.2 Передача сообщений CEC

Передача с верхнего уровня проста: вызовите sendCecCommand, как показано на схеме.

![Техническая иллюстрация китайского оригинала, p. 22](/docs/rockchip-hdmi-cec/assets/cn-p22-1.png)

Параметр HdmiCecMessage функции sendCecCommand описан в:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

Процесс в ядре:

![Техническая иллюстрация китайского оригинала, p. 23](/docs/rockchip-hdmi-cec/assets/cn-p23-1.png)

В итоге HAL вызывает cec_transmit драйвера через IOCTL CEC_TRANSMIT.

```text
static long cec_transmit(struct cec_adapter *adap, struct cec_fh *fh,
         bool block, struct cec_msg __user *parg)
{

   struct cec_msg msg = {};
   long err = 0;

   if (!(adap->capabilities & CEC_CAP_TRANSMIT))
      return -ENOTTY;
   if (copy_from_user(&msg, parg, sizeof(msg)))
      return -EFAULT;

   /* A CDC-Only device can only send CDC messages */
   if ((adap->log_addrs.flags & CEC_LOG_ADDRS_FL_CDC_ONLY) &&
      (msg.len == 1 || msg.msg[1] != CEC_MSG_CDC_MESSAGE))
      return -EINVAL;


   mutex_lock(&adap->lock);
   if (adap->log_addrs.num_log_addrs == 0)
      err = -EPERM;
   else if (adap->is_configuring)
      err = -ENONET;
   else if (!adap->is_configured &&
      (adap->needs_hpd || msg.msg[0] != 0xf0))
      err = -ENONET;
   else if (cec_is_busy(adap, fh))
      err = -EBUSY;
   else
      err = cec_transmit_msg_fh(adap, &msg, fh, block);
   mutex_unlock(&adap->lock);
   if (err)

      return err;
   if (copy_to_user(parg, &msg, sizeof(msg)))
      return -EFAULT;
   return 0;
}
```

Сначала проверки определяют возможность передачи. Затем cec_transmit_msg_fh добавляет сообщение в очередь отправки. Структура сообщения:

```text
struct cec_msg {
      __u64 tx_ts;

      __u64 rx_ts;
      __u32 len;
      __u32 timeout;
      __u32 sequence;
      __u32 flags;
      __u8 msg[CEC_MAX_MSG_SIZE];
      __u8 reply;
      __u8 rx_status;
      __u8 tx_status;
      __u8 tx_arb_lost_cnt;
      __u8 tx_nack_cnt;
      __u8 tx_low_drive_cnt;
      __u8 tx_error_cnt;

};
```

Поля структуры:

| Имя | Описание |
| --- | --- |
| tx_ts | Метка времени в наносекундах после завершения передачи. |
| rx_ts | Метка времени в наносекундах после завершения приёма. |
| len | Длина сообщения. |
| sequence | Номер передачи, назначаемый инфраструктурой для отслеживания ответов на предыдущие сообщения. |
| msg | Хранит полезную нагрузку сообщения CEC. |
| reply | Только передача: ненулевое значение включает ожидание ответа, например give device power status ожидает report power status. Описанная реализация всегда задаёт 0 и не ждёт ответа внутри драйвера. |
| rx_status | Состояние после приёма: CEC_RX_STATUS_OK, CEC_RX_STATUS_TIMEOUT, CEC_RX_STATUS_FEATURE_ABORT. |
| tx_status | Состояние после передачи: CEC_TX_STATUS_OK, CEC_TX_STATUS_ARB_LOST, CEC_TX_STATUS_NACK, CEC_TX_STATUS_LOW_DRIVE, CEC_TX_STATUS_ERROR, CEC_TX_STATUS_MAX_RETRIES. |
| tx_arb_lost_cnt | Число ошибок Arbitration Lost после передачи. |
| tx_nack_cnt | Число ошибок Not Acknowledged после передачи. |
| tx_low_drive_cnt | Число ошибок Low Drive Detected после передачи. |
| tx_error_cnt | Число Error после передачи. |

cec_thread_func управляет очередью передачи. Если сообщение не передаётся, поток ожидает новые сообщения.

```text
wait_event_interruptible(adap->kthread_waitq,
  kthread_should_stop ||
  (!adap->transmitting &&

   !list_empty(&adap->transmit_queue)));
```

После добавления сообщения cec_transmit_msg_fh пробуждает cec_thread_func, если передачи нет. Иначе сообщение ждёт в очереди завершения текущей передачи.

```text
if (fh)
   list_add_tail(&data->xfer_list, &fh->xfer_list);
list_add_tail(&data->list, &adap->transmit_queue);
adap->transmit_queue_sz++;
if (!adap->transmitting)

   wake_up_interruptible(&adap->kthread_waitq);

/* All done if we don't need to block waiting for completion */
if (!block)
   return 0;

/*
* If we don't get a completion before this time something is really
* wrong and we time out.
*/
timeout = CEC_XFER_TIMEOUT_MS;
/* Add the requested timeout if we have to wait for a reply as well */

if (msg->timeout)
   timeout += msg->timeout;

/*
* Release the lock and wait, retake the lock afterwards.
*/
mutex_unlock(&adap->lock);
res = wait_for_completion_killable_timeout(&data->c,
                msecs_to_jiffies(timeout));
mutex_lock(&adap->lock);

if (data->completed) {
   /* The transmit completed (possibly with an error) */

   *msg = data->msg;
   kfree(data);
   return 0;
}
```

Обратный вызов adap->ops->adap_transmit вызывает dw_hdmi_cec_transmit для настройки регистров CEC и начала передачи.

После передачи возникает прерывание CEC. dw_hdmi_cec_hardirq читает регистры и записывает успех либо тип ошибки в tx_status.

cec_transmit_done_ts собирает ошибки и при необходимости повторяет передачу согласно attempts. Без ошибок cec_data_completed завершает передачу и пробуждает cec_thread_func для следующего сообщения.

#### 2.3.3 Приём сообщений CEC

![Техническая иллюстрация китайского оригинала, p. 27](/docs/rockchip-hdmi-cec/assets/cn-p27-1.png)

Входящее сообщение CEC вызывает прерывание. dw_hdmi_cec_hardirq получает его из регистров CEC RX DATA.

cec_received_msg_ts проверяет пригодность принятого сообщения.

Без passthrough cec_receive_notify автоматически отвечает по протоколу CEC. Описанная реализация всегда использует passthrough: cec_queue_msg_fh помещает сообщение в очередь, а poll_wait пробуждается для уведомления пользовательского пространства.

```text
 */
static void cec_queue_msg_fh(struct cec_fh *fh, const struct cec_msg *msg)

{
   static const struct cec_event ev_lost_msgs = {
      .event = CEC_EVENT_LOST_MSGS,
      .lost_msgs.lost_msgs = 1,
   };
   struct cec_msg_entry *entry;

   mutex_lock(&fh->lock);
   entry = kmalloc(sizeof(*entry), GFP_KERNEL);
   if (entry) {
      entry->msg = *msg;
      /* Add new msg at the end of the queue */
      list_add_tail(&entry->list, &fh->msgs);


      if (fh->queued_msgs < CEC_MAX_MSG_RX_QUEUE_SZ) {
         /* All is fine if there is enough room */
         fh->queued_msgs++;
         mutex_unlock(&fh->lock);
         wake_up_interruptible(&fh->wait);
         return;
      }
      /*
      * if the message queue is full, then drop the oldest one and

      * send a lost message event.
      */
      entry = list_first_entry(&fh->msgs, struct cec_msg_entry, list);
      list_del(&entry->list);
      kfree(entry);
   }
   mutex_unlock(&fh->lock);

   /*
   * We lost a message, either because kmalloc failed or the queue
   * was full.
   */

   cec_queue_event_fh(fh, &ev_lost_msgs, ktime_get_ns);
}
```

Когда поток мониторинга событий HAL uevent_loop получает уведомление, он извлекает сообщения из очереди через IOCTL CEC_RECEIVE.

![Техническая иллюстрация китайского оригинала, p. 28](/docs/rockchip-hdmi-cec/assets/cn-p28-1.png)

FRAMEWORK передаёт сообщения вверх по уровням; затем onMessage направляет каждый opcode соответствующему обработчику, как показано на схеме.

#### 2.3.4 Обработка событий CEC

Драйвер сообщает об изменении состояния следующими событиями:

| Имя | Описание |
| --- | --- |
| CEC_EVENT_STATE_CHANGE | Состояние адаптера изменилось, например configured на unconfigured. |
| CEC_EVENT_LOST_MSGS | Сообщения потеряны из-за несвоевременного чтения очереди приёма. |
| CEC_EVENT_PIN_CEC_LOW | Вывод CEC переходит в низкий уровень; в этой версии не используется. |
| CEC_EVENT_PIN_CEC_HIGH | Вывод CEC переходит в высокий уровень; в этой версии не используется. |
| CEC_EVENT_PIN_HPD_LOW | Оригинал указывает высокий HPD, обычно подключение HDMI. Это противоречит имени LOW; сохранено для проверки. |
| CEC_EVENT_PIN_HPD_HIGH | Оригинал указывает низкий HPD, обычно отключение HDMI. Это противоречит имени HIGH; сохранено для проверки. |

Пример горячего подключения HDMI:

![Техническая иллюстрация китайского оригинала, p. 29](/docs/rockchip-hdmi-cec/assets/cn-p29-1.png)

Подключение или отключение HDMI вызывает прерывание HDMI; cec_queue_pin_hpd_event создаёт событие HPD CEC.

cec_queue_event_fh ставит событие в очередь и пробуждает poll_wait для уведомления.

HAL вызывает cec_dqevent через IOCTL CEC_DQEVENT для получения события и завершения уведомления.

![Техническая иллюстрация китайского оригинала, p. 30](/docs/rockchip-hdmi-cec/assets/cn-p30-1.png)

HAL отдельно обрабатывает типы событий; HPD передаётся дальше вверх.

Окончательная обработка выполняется в onHotplug. При подключении вызывается allocateLogicalAddress для повторного назначения адреса, практически по §2.3.1.2 (оригинал ошибочно ссылается на §2.2.1.2).

### 2.4 Интерфейсы добавления функций CEC

Исходный Android уже поддерживает многие функции CEC. Для добавления остальных используйте следующие интерфейсы:

Инициирование сообщения CEC:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

```text
   /**
   * Transmit a CEC command to CEC bus.
   *

   * @param command CEC command to send out
   * @param callback interface used to the result of send command
   */
   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command, @Nullable SendMessageCallback
callback) {
      assertRunOnServiceThread;
      if (mMessageValidator.isValid(command) == HdmiCecMessageValidator.OK) {
         mCecController.sendCommand(command, callback);
      } else {
         HdmiLogger.error("Invalid message type:" + command);
         if (callback != null) {

           callback.onSendCompleted(SendMessageResult.FAIL);
         }
      }
   }

   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command) {
      assertRunOnServiceThread;
      sendCecCommand(command, null);
}
```

Создайте параметр HdmiCecMessage command соответствующим интерфейсом по пути:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

```text
  @Override
   @ServiceThreadOnly
   protected void onStandby(boolean initiatedByCec, int standbyAction) {

      assertRunOnServiceThread;
      if (!mService.isControlEnabled || initiatedByCec || !mAutoTvOff) {
         return;
      }
      switch (standbyAction) {
         case HdmiControlService.STANDBY_SCREEN_OFF:
           Slog.e(TAG, "send standby eee");
           /* cec cts specification requires that standby message must be
broadcast */
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;

         case HdmiControlService.STANDBY_SHUTDOWN:
           // ACTION_SHUTDOWN is taken as a signal to power off all the
devices.
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;
      }
}
```

Чтобы приставка перевела телевизор в ожидание, нужен CEC standby. Пример вызывает sendCecCommand с сообщением, созданным HdmiCecMessageBuilder.buildStandby.

Добавление обработки сообщений CEC:

Система уже принимает и передаёт сообщения вверх. Если обработчика принятого сообщения нет, добавьте его. Сообщения поступают в onMessage, где message.getOpcode получает opcode, а функции handlexxxxx обрабатывают соответствующие сообщения.

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java
```

```text
@ServiceThreadOnly
 protected final boolean onMessage(HdmiCecMessage message) {
    assertRunOnServiceThread;

    if (dispatchMessageToAction(message)) {
   return true;
}
switch (message.getOpcode) {

   case Constants.MESSAGE_ACTIVE_SOURCE:
      return handleActiveSource(message);
   case Constants.MESSAGE_INACTIVE_SOURCE:
      return handleInactiveSource(message);
   case Constants.MESSAGE_REQUEST_ACTIVE_SOURCE:
      return handleRequestActiveSource(message);
   case Constants.MESSAGE_GET_MENU_LANGUAGE:
      return handleGetMenuLanguage(message);
   case Constants.MESSAGE_SET_MENU_LANGUAGE:
      return handleSetMenuLanguage(message);
   case Constants.MESSAGE_GIVE_PHYSICAL_ADDRESS:
      return handleGivePhysicalAddress;

   case Constants.MESSAGE_GIVE_OSD_NAME:
      return handleGiveOsdName(message);
   case Constants.MESSAGE_GIVE_DEVICE_VENDOR_ID:
      return handleGiveDeviceVendorId;
   case Constants.MESSAGE_GET_CEC_VERSION:
      return handleGetCecVersion(message);
   case Constants.MESSAGE_REPORT_PHYSICAL_ADDRESS:
      return handleReportPhysicalAddress(message);
   case Constants.MESSAGE_ROUTING_CHANGE:
      return handleRoutingChange(message);
   case Constants.MESSAGE_ROUTING_INFORMATION:
      return handleRoutingInformation(message);
   case Constants.MESSAGE_INITIATE_ARC:

      return handleInitiateArc(message);
   case Constants.MESSAGE_TERMINATE_ARC:
      return handleTerminateArc(message);
   case Constants.MESSAGE_SET_SYSTEM_AUDIO_MODE:
      return handleSetSystemAudioMode(message);
   case Constants.MESSAGE_SYSTEM_AUDIO_MODE_STATUS:
      return handleSystemAudioModeStatus(message);
   case Constants.MESSAGE_REPORT_AUDIO_STATUS:
      return handleReportAudioStatus(message);
   case Constants.MESSAGE_STANDBY:
      return handleStandby(message);
   case Constants.MESSAGE_TEXT_VIEW_ON:

      return handleTextViewOn(message);
   case Constants.MESSAGE_IMAGE_VIEW_ON:
      return handleImageViewOn(message);
   case Constants.MESSAGE_USER_CONTROL_PRESSED:
      return handleUserControlPressed(message);
   case Constants.MESSAGE_USER_CONTROL_RELEASED:
      return handleUserControlReleased;
   case Constants.MESSAGE_SET_STREAM_PATH:
      return handleSetStreamPath(message);
   case Constants.MESSAGE_GIVE_DEVICE_POWER_STATUS:
      return handleGiveDevicePowerStatus(message);
   case Constants.MESSAGE_MENU_REQUEST:
      return handleMenuRequest(message);

   case Constants.MESSAGE_MENU_STATUS:
      return handleMenuStatus(message);
   case Constants.MESSAGE_VENDOR_COMMAND:
        return handleVendorCommand(message);
      case Constants.MESSAGE_VENDOR_COMMAND_WITH_ID:
        return handleVendorCommandWithId(message);

      case Constants.MESSAGE_SET_OSD_NAME:
        return handleSetOsdName(message);
      case Constants.MESSAGE_RECORD_TV_SCREEN:
        return handleRecordTvScreen(message);
      case Constants.MESSAGE_TIMER_CLEARED_STATUS:
        return handleTimerClearedStatus(message);
      case Constants.MESSAGE_REPORT_POWER_STATUS:
        return handleReportPowerStatus(message);
      case Constants.MESSAGE_TIMER_STATUS:
        return handleTimerStatus(message);
      case Constants.MESSAGE_RECORD_STATUS:
        return handleRecordStatus(message);

      default:
        return false;
   }
}
```

Таким образом, для нового сообщения CEC добавьте соответствующий обработчик в switch.

## 3. Основные методы отладки

При неправильной работе CEC выполняйте отладку в следующем порядке:

Запустите сценарий для сбора состояния отладочных узлов и журналов.

По состоянию узлов проверьте правильность инициализации и работы.

По журналу ядра проверьте успешность передачи и приёма CEC.

По журналам Android проверьте обработку функций.

### 3.1 Сценарий отладки

Сценарий отладки CEC:

```text
#!/system/bin/sh

log ************start cec debug script**************

echo 2 > sys/module/cec/parameters/debug

if [ -f "/data/cec_status.txt" ]
then
rm /data/cec_status.log
fi

if [ -f "/data/cec_log.txt" ]
then
rm /data/cec_log.txt
fi
cat /sys/kernel/debug/cec/cec0/status >> /data/cec_status.txt
cat /sys/kernel/debug/dw-hdmi/ctrl >> /data/cec_status.txt


logcat -b all -f /data/cec_log.txt
```

Использование:

Скопируйте cec_debug.sh в /system/bin.

Запустите ./system/bin/cec_debug.sh до воспроизведения ошибки; относительный путь сохранён по оригиналу.

Метка ****start cec debug script****** обозначает запуск сценария.

Выполните действия для воспроизведения ошибки.

Состояние узлов CEC сохраняется в /data/cec_status.txt.

Синхронные журналы ядра и logcat сохраняются в /data/cec_log.txt.

#### 3.1.1 Содержимое журналов

Сценарий собирает состояние узлов и журналы. Узлы описаны в §3.1.2. В журналах важны следующие три категории:

Сообщения с cec-dw_hdmi относятся к ядру:

```text
04-11 11:44:50.969 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
```

Для ручного сбора выполните:

```text
dmesg | grep cec-dw_hdmi
```

Сообщения с hdmicec относятся к HAL:

```text
04-11 12:39:59.015 281 281 I hdmicec : hdmi_cec_set_option: system_control:
value: 0
```

Для ручного сбора выполните:

```text
logcat | grep hdmicec
```

Сообщения с Hdmi относятся к framework:

```text
04-11 11:44:50.565 391 494 W HdmiCecController: Failed to send <Give Device
Power Status> src: 4, dst: 0 with errorCode=-1
```

Для ручного сбора выполните:

```text
logcat | grep Hdmi
```

Примеры анализа журналов приведены в §3.2.

#### 3.1.2 Отладочные узлы CEC

Путь отладочного узла состояния CEC:

```text
/sys/kernel/debug/cec/cec0/status
```

Чтение через cat выводит:

![Техническая иллюстрация китайского оригинала, p. 35](/docs/rockchip-hdmi-cec/assets/cn-p35-1.png)

```text
configured: 0
configuring: 0
phys_addr: f.f.f.f
number of LAs: 1
LA mask: 0x0000
has CEC follower (in passthrough mode)
pending transmits: 0
```

Описание параметров:

| Имя | Описание |
| --- | --- |
| configured | 1: правильно настроен. 0: не настроен правильно. |
| configuring | 1: настройка выполняется. 0: не начиналась или завершена. |
| phys_addr | Физический адрес из EDID телевизора. f.f.f.f означает отсутствие инициализации или ошибку получения адреса. |
| LA mask | Маска логического адреса: 0x0000 до инициализации. Сдвиг до 0x1 определяет адрес; например 0x0010 >> 4 = 0x1 означает адрес 0x4. |
| has CEC follower (in passthrough mode) | Драйвер CEC не обрабатывает сообщения непосредственно. |
| pending transmits | Количество сообщений CEC, ожидающих передачи. |

Узел регистров контроллера HDMI:

```text
/d/dw-hdmi/ctrl
```

Команда cat для узла выводит регистры контроллера HDMI. Проверьте связанные с CEC регистры; определения приведены в документации контроллера HDMI.

#### 3.1.3 Включение журналов CEC ядра

```text
echo 2 > /sys/module/cec/parameters/debug
```

Включить журналы передачи/приёма сообщений CEC.

```text
echo 1 > /sys/module/cec/parameters/debug
```

Включить остальные журналы CEC.

### 3.2 Диагностика типичных неисправностей

#### 3.2.1 Не работают все функции CEC

Выполните эти проверки и при отказе только отдельных функций CEC.

Проверьте включение CEC в Settings/Input.

Проверьте наличие hdmi_cec_device_open open error! в журнале и выполните ls -l /dev/cec0.

```text
130|rk3328_box:/ # ls -l /dev/cec0

crw-rw---- 1 system system 250, 0 2016-01-21 08:50 /dev/cec0
```

Проверьте, что права cec0 не ниже показанных. Если их недостаточно, проверьте наличие изменения:

```text
diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index a7d1356..9eb824d 100755

--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -96,6 +96,7 @@

 #for hdmi cec
 /dev/cec 0666 system system
+/dev/cec0 0660 system system
 #sofia
 /dev/dcc 0666 system system
 /dev/pmem_gfx 0666 system system
```

Проверьте нормальное состояние /sys/kernel/debug/cec/cec0/status (§3.1.2; оригинал ссылается на §3.1.1 и разрывает слово status). Типичные ошибки:

(1) phys_addr=f.f.f.f: проверьте чтение EDID и поддержку CEC телевизором. (2) LA mask=0x0000: ошибка назначения логического адреса. Сначала найдите:

```text
04-11 08:56:51.764 296 296 E hdmicec : can't make kernel addr done
```

При наличии проверьте правильность чтения EDID. Иначе найдите:

```text
04-11 08:56:51.764 296 296 D hdmicec : kernel logic addr:ff, preferred logic
addr:04
04-11 08:56:51.764 296 296 I hdmicec : kernel logaddr is not existing

04-11 08:56:51.764 296 296 D hdmicec : set_kernel_logical_address, logic
addr:04
```

logic addr не обязательно 04, но должен быть 04, 08 или 0b. Если записи нет, проследите код по пути:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

При наличии записи выше проверьте:

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: new physical address 3.0.0.0
04-11 08:35:37.297 0 0 I cec-dw_hdmi: physical address: 3.0.0.0, claim 1

logical addresses
```

Если отсутствует, проследите cec_adap_s_log_addrs по пути:

```text
Kernel/drivers/media/cec/cec-api.c
```

Затем проверьте записи ниже. 44 в первой строке — адрес POLL; возможны также 88 и bb, вплоть до записей для всех трёх. Сопоставьте адреса с количеством устройств CEC телевизора; полный процесс описан в разделе CEC спецификации HDMI. Важен status второй строки. Если адрес точно свободен, но status не 04 (NACK), анализируйте регистры HDMI вместе с осциллограммой CEC.

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
04-11 08:35:37.326 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 04
```

#### 3.2.2 Телевизор переходит в ожидание, приставка — нет

Android по умолчанию отключает переход приставки в ожидание по CEC. Задайте persist.sys.hdmi.keep_awake=false либо измените значение по умолчанию на false:

```text
diff --git
--- a/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java

+++ b/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
@@ -210,7 +210,7 @@
   private ActiveWakeLock getWakeLock {
      assertRunOnServiceThread;
      if (mWakeLock == null) {
-        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
true)) {
+        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
false)) {
            mWakeLock = new SystemWakeLock;
         } else {
            // Create a dummy lock object that doesn't do anything about
wake lock,
```

Проверьте, получила ли приставка standby (0x36), по журналу:

```text
[ 3465.670484] cec-dw_hdmi: cec_received_msg_ts: 0f 36
[ 3465.670617] cec-dw_hdmi: cec_receive_notify: 0f 36
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_received_msg_ts: 0f 36

04-11 09:16:32.963 299 342 D hdmicec : poll revent:41
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_receive_notify: 0f 36
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[0]:0f
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[1]:36
```

Если нет, осциллографом проверьте, действительно ли телевизор передал standby по шине CEC.

#### 3.2.3 Приставка переходит в ожидание, телевизор — нет

Если это происходит сразу после включения телевизора, подождите 15 секунд и повторите. Некоторые телевизоры некоторое время после включения игнорируют standby.

Проверьте процесс ожидания по журналам:

```text
04-11 08:37:13.823 394 394 V HdmiControlService: On standby-action cleared:4
04-11 08:37:13.823 394 394 V HdmiControlService: onStandbyCompleted

04-11 08:37:13.927 296 296 I hdmicec : send msg LEN:2,opcode:36,addr:4f
```

Если записей нет или присутствуют только первые две, проследите код по пути:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

Затем проверьте успешную отправку standby по журналам:

```text
04-11 08:37:13.928 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 36
04-11 08:37:13.991 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

Если записей нет, проверьте правильность вызова hdmi_cec_send_message по следующему пути и успешный вызов IOCTL CEC_TRANSMIT:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

Если обе записи есть, но status cec_transmit_done_ts не 01, при передаче произошла ошибка шины CEC. Анализируйте регистры контроллера HDMI совместно с сигналами CEC.

#### 3.2.4 Приставка пробуждается, телевизор — нет

Проверьте нормальное пробуждение приставки и инициализацию CEC по §3.2.1.

Проверьте успешную передачу сообщения пробуждения CEC:

```text
04-11 09:27:37.540 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 40 0d
04-11 09:27:37.593 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
04-11 09:27:37.594 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 82 30 00

04-11 09:27:37.707 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

Если обе записи есть, но передача неуспешна (status не 01), анализируйте регистры HDMI и сигналы CEC. Если записей нет, проследите передачу ActiveSource и TextViewOn начиная с onAddressAllocated в:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
```

#### 3.2.5 Пульт телевизора не управляет UI приставки

Марки и модели телевизоров сильно различаются, поэтому универсального решения нет. Следующие рекомендации из опыта подходят не каждому телевизору.

Проверьте наличие отдельного входа CEC. Некоторые телевизоры Samsung требуют переключения на Anynet для этой функции.

После стабилизации работы телевизора отправьте ActiveSource, например через системный интерфейс onetouchplay:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/OneTouchPlayAction.java
```

## 4. Справочные документы

HDMISpecification1_4b.pdf

RockchipAndroid5.x_HDMI_CEC_软件说明.doc (имя исходного файла)

[Служба управления HDMI-CEC (документация Android)](https://source.android.google.cn/devices/tv/hdmi-cec)

{% endraw %}
