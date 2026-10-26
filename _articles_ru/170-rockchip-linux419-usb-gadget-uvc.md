---
title: "Диагностика USB Gadget UVC в Rockchip Linux 4.19"
description: "Диагностика USB Gadget UVC в Rockchip Linux 4.19 — V1.0.0"
excerpt: "Диагностика USB Gadget UVC в Rockchip Linux 4.19"
translation_key: "170-rockchip-linux419-usb-gadget-uvc"
slug: "170-rockchip-linux419-usb-gadget-uvc"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, USB, UVC, Linux, Gadget]
---

{% raw %}

# Диагностика USB Gadget UVC в Rockchip Linux 4.19

Платформенная справка ArmSoM по китайскому RK-PC-YF-165 V1.0.0: RK1808, RK3399, RV1109, RV1126, RK356X, Linux 4.19. Проверяйте плату ArmSoM, BSP, порт USB Device и UVC SDK. Методы не подходят для всех ядер и не подтверждают поддержку каждой платы. Английского исходника нет; английский, русский и немецкий тексты переведены полностью и используют три рисунка китайского PDF. Результаты примеров не являются испытаниями ArmSoM. Команды не выполнялись, аппаратная проверка не проводилась.

Условия: удаление/пересоздание ссылок ConfigFS и bind/unbind прерывают службы Gadget. Нумерованная процедура — инструкция исходника, а не готовый shell-скрипт; сначала проверьте имена устройств и конфигурацию. Идентификатор патча сохранён; проверяйте его в фактическом SDK. Применимость примеров к новым ядрам не гарантируется.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Обмен данными UVC в Linux 4.19

На рисунке 1 показан поток данных UVC в Linux 4.19. Слева расположены модули UVC стороны USB Device и пути их кода в ядре, справа — соответствующие модули USB Host. Руководство посвящено диагностике стороны USB Device. Методы основаны на Rockchip Linux 4.19, не подходят для всех версий ядра и не предназначены для диагностики приложений UVC.

![Техническая иллюстрация из китайского оригинала](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p004-figure-01.png)

Рисунок 1. Обмен данными UVC в Linux 4.19.

## 2. Основные методы отладки UVC

### 2.1 Анализатор протокола USB

Анализатор протокола USB захватывает обмен на шине в реальном времени для анализа пакетов и протокола. На рисунке 2 показано типовое подключение USB 2.0: анализатор включают между Device и Host, на компьютер устанавливают соответствующее ПО. Это наиболее наглядный и эффективный способ определить, на какой стороне находится неисправность.

![Техническая иллюстрация из китайского оригинала](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p005-figure-01.png)

Рисунок 2. Подключение USB-анализатора. Он помогает исследовать следующие проблемы UVC:

1. Не удаётся открыть предпросмотр.

2. Задержка предпросмотра.

3. Зависание предпросмотра.

4. Статистика частоты кадров и разбор данных изображения.

5. Ошибки загрузки драйвера UVC.

Анализатор протокола USB не подходит для исследования следующих проблем:

1. Качество сигнала USB.

2. Неожиданное отключение UVC.

3. Сообщения об EMI контроллера USB при обмене UVC.

Для исследования качества сигналов, отключений и EMI используйте широкополосный осциллограф: измеряйте глазковую диаграмму USB, сигналы высокоскоростного согласования и провалы напряжения VBUS.

### 2.2 Инструменты захвата и анализа USB

Инструменты этого раздела работают на компьютере и наблюдают данные шины USB. Они не заменяют анализатор для регистрации всех транзакций, но достаточны во многих сценариях.

#### 2.2.1 Инструменты Windows

Bus Hound захватывает USB-трафик, прост в установке и использовании, но не предоставляет подробного и наглядного разбора протокола. Wireshark захватывает USB-трафик и разбирает его подробнее, включая UVC PROBE_CONTROL(SET_CUR) и COMMIT_CONTROL(SET_CUR). Usbview показывает подробные дескрипторы устройства; адрес загрузки в исходнике: www.uwe-sieber.de.

#### 2.2.2 Инструменты Linux

usbmon захватывает USB-трафик; vusb-analyzer анализирует захват usbmon; lsusb показывает подробные дескрипторы USB-устройств.

#### 2.2.3 Инструменты macOS

Wireshark захватывает трафик шины USB.

### 2.3 Интерфейсы отладки UVC в ядре

#### 2.3.1 Интерфейс контроллера USB DWC2 OTG

`/sys/kernel/debug/[dwc2_controller_base_addr].usb`

Пример: DWC2 OTG RK3328, Linux 4.19 [1].

```text
rk3328_box:/sys/kernel/debug/ff580000.usb # ls
ep0   ep2out ep4out ep6out ep8in  ep9in  fifo    state
ep1in ep3in  ep5in  ep7in  ep8out ep9out regdump testmode
```

`ep*in/out`: состояние конечных точек в режиме Device. `fifo`: конфигурация аппаратных FIFO, включая RXFIFO Size, NPTXFIFO Size и TXFIFO Size каждой конечной точки. `state`: регистр MASK прерываний и регистры управления/настройки режима Device. `regdump`: состояния всех регистров контроллера. `testmode`: тестовый режим USB, главным образом для глазковой диаграммы.

#### 2.3.2 Интерфейс контроллера USB DWC3 OTG

`/sys/kernel/debug/[dwc3_controller_base_addr].dwc3`

Пример: DWC3 OTG RV1109/RV1126, Linux 4.19 [1–4].

```text
[root@RV1126_RV1109:/sys/kernel/debug/ffd00000.dwc3]# ls
ep0in   ep1in   ep2in   ep3in   ep4in   ep5in   ep6in       lsp_dump  regdump
ep0out  ep1out  ep2out  ep3out  ep4out  ep5out  link_state  mode      testmode
```

Основные узлы: `regdump` выводит регистры, включая TXFIFOSIZ каждой конечной точки; `link_state` — состояние линии USB3; `mode` — режим контроллера; `testmode` включает тестовый режим HighSpeed для проверки глазковой диаграммы.

Драйвер DWC3 также реализует tracepoint подсистемы трассировки ядра [5], позволяя динамически включать и сохранять важные сведения. Включите следующие параметры ядра:

```text
Kernel hacking  --->
    [*] Tracers  --->
        [*]   Trace process context switches and events
        [*]   Enable uprobes-based dynamic events
        [*]   Trace gpio events
```

DWC3 поддерживает следующие события трассировки:

```text
/sys/kernel/debug/tracing/events/dwc3# ls
dwc3_alloc_request  dwc3_event              dwc3_gadget_generic_cmd  enable
dwc3_complete_trb   dwc3_free_request       dwc3_gadget_giveback     filter
dwc3_ctrl_req       dwc3_gadget_ep_cmd      dwc3_prepare_trb
dwc3_ep_dequeue     dwc3_gadget_ep_disable  dwc3_readl
dwc3_ep_queue       dwc3_gadget_ep_enable   dwc3_writel
```

Применение описано в `/sys/kernel/debug/tracing/README`.

#### 2.3.3 Интерфейс USB UDC core

Tracepoint UDC core отслеживают поток USB Request между UVC Function Driver и USB Controller Driver. Включите трассировку ядра согласно подразделу DWC3. Поддерживаются следующие события:

```text
/sys/kernel/debug/tracing/events/gadget# ls
enable                usb_ep_free_request           usb_gadget_disconnect
filter                usb_ep_queue                  usb_gadget_frame_number
usb_ep_alloc_request  usb_ep_set_halt               usb_gadget_giveback_request
usb_ep_clear_halt     usb_ep_set_maxpacket_limit    usb_gadget_set_selfpowered
usb_ep_dequeue        usb_ep_set_wedge              usb_gadget_vbus_connect
usb_ep_disable        usb_gadget_activate           usb_gadget_vbus_disconnect
usb_ep_enable         usb_gadget_clear_selfpowered  usb_gadget_vbus_draw
usb_ep_fifo_flush     usb_gadget_connect            usb_gadget_wakeup
usb_ep_fifo_status    usb_gadget_deactivate
```

См. `/sys/kernel/debug/tracing/README`. Особое внимание уделяйте событиям запросов `usb_ep_alloc_request`, `usb_ep_free_request`, `usb_ep_queue` и `usb_ep_dequeue`.

#### 2.3.4 Интерфейс драйвера UVC

Драйвер UVC Function предоставляет интерфейс системного модуля для динамической трассировки управляющих запросов: `/sys/module/usb_f_uvc/parameters/trace`. По умолчанию трассировка отключена. Включение: `echo 4 > /sys/module/usb_f_uvc/parameters/trace`. Уровень сообщений — KERN_DEBUG; просмотр через `dmesg`. Ниже пример запуска предпросмотра RV1109 из исходника:

```text
[root@RV1126_RV1109:/]# dmesg
[  426.441316] uvcvideo: setup request a1 81 value 0100 index 0003 001a
[  426.450280] uvcvideo: uvc_send_response: req len 26
[  426.450444] uvcvideo: event_setup_out 0, data len 26
[  426.451545] uvcvideo: setup request 21 01 value 0100 index 0003 001a
[  426.460862] uvcvideo: uvc_send_response: req len 26
[  426.461014] uvcvideo: event_setup_out 1, data len 26
[  426.461173] uvcvideo: setup request a1 81 value 0100 index 0003 001a
[  426.485791] uvcvideo: uvc_send_response: req len 26
[  426.486672] uvcvideo: event_setup_out 0, data len 26
[  426.487145] uvcvideo: setup request a1 83 value 0100 index 0003 001a
[  426.496529] uvcvideo: uvc_send_response: req len 26
[  426.496655] uvcvideo: event_setup_out 0, data len 26
[  426.497485] uvcvideo: setup request a1 82 value 0100 index 0003 001a
[  426.506737] uvcvideo: uvc_send_response: req len 26
[  426.507195] uvcvideo: event_setup_out 0, data len 26
```

#### 2.3.5 Интерфейс V4L2

UVC Linux 4.19 использует V4L2 для операций queue buf/dequeue buf с приложением. Tracepoint V4L2 отслеживают queue buf, dequeue buf и buf done. Включите трассировку согласно подразделу DWC3. Доступные события:

```text
/sys/kernel/debug/tracing/events/vb2# ls
enable  filter  vb2_buf_done  vb2_buf_queue  vb2_dqbuf  vb2_qbuf

/sys/kernel/debug/tracing/events/v4l2]# ls
enable  v4l2_dqbuf  vb2_v4l2_buf_done   vb2_v4l2_dqbuf
filter  v4l2_qbuf   vb2_v4l2_buf_queue  vb2_v4l2_qbuf
```

См. инструкции в `/sys/kernel/debug/tracing/README`.

#### 2.3.6 Состояние подключения устройства

Текущая скорость перечисления: `/sys/class/udc/[usb_controller_name]/current_speed`. Состояние (например not attached/configured): `/sys/class/udc/[usb_controller_name]/state`. Замените `[usb_controller_name]` фактическим именем USB Device-контроллера чипа.

#### 2.3.7 Динамическая переинициализация контроллера

Интерфейсы: `/sys/bus/platform/drivers/[usb_controller_name]/bind` и `unbind`; подставьте имя контроллера. Если передача нарушена и автоматически не восстанавливается, ручная переинициализация помогает выяснить, связан ли сбой с контроллером. Ниже процедура восстановления UVC SDK RV1109/RV1126:

```text
1. kill uvc_app /* 杀掉 uvc 应⽤*/
2. rm -rf /sys/kernel/config/usb_gadget/rockchip/configs/b.1/f* /* 移除已绑定的 usb function */
3. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/unbind /* unbind usb 控制器 */
4. echo ffd00000.dwc3  > /sys/bus/platform/drivers/dwc3/bind /* bind usb 控制器 */
5. cd /sys/kernel/config/usb_gadget/rockchip/configs/b.1 /* 绑定 usb function */
   ln -s ../../functions/rndis.gs0 f1
   ln -s ../../functions/uvc.gs6/ f2
6. echo ffd00000.dwc3 > /sys/kernel/config/usb_gadget/rockchip/UDC /* 使能 usb 控制器连接 */
7. restart uvc_app /* 重新启动 uvc 应⽤ */
```

#Семь шагов исходника: остановить приложение UVC; удалить ссылки привязанных функций; отвязать контроллер; привязать его снова; восстановить ссылки RNDIS/UVC; включить UDC; перезапустить приложение. Исходные комментарии сохранены в коде выше.

### 2.3.8 USB Gadget ConfigFS

Linux 4.19 реализует и настраивает функцию UVC через ConfigFS. Документация ConfigFS Gadgets:

```text
Documentation/ABI/testing/configfs-usb-gadget-xxxx.txt
Documentation/filesystems/configfs/configfs.txt
Documentation/usb/gadget_configfs.txt
Documentation/usb/gadget-testing.txt
```

Также см. Kernel USB Gadget Configfs Interface. Пример интерфейса настройки UVC SDK RV1109/RV1126:

```text
[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip]# ls
UDC              bDeviceSubClass  bcdUSB     idProduct  strings
bDeviceClass     bMaxPacketSize0  configs    idVendor
bDeviceProtocol  bcdDevice        functions  os_desc

[root@RV1126_RV1109:/sys/kernel/config/usb_gadget/rockchip/functions/uvc.gs6]#
control    streaming_bulk      streaming_maxburst   uvc_num_request
streaming  streaming_interval  streaming_maxpacket
```

Основные параметры: `uvc_num_request` задаёт число запросов/буферов между драйверами UVC и USB-контроллера; `streaming_maxpacket` — размер пакета за микрокадр USB 2.0, максимум 3072; `streaming_bulk` выбирает bulk вместо isoc по умолчанию.

### 2.4 Диагностика типовых проблем UVC

#### 2.4.1 Драйвер не загружается

Ошибки загрузки обычно возникают в Windows в двух вариантах:

1. Если Windows сообщает о неопознанном USB-устройстве, причиной может быть качество сигнала. Сначала замените USB-кабель; для дальнейшего анализа измерьте глазковую диаграмму осциллографом.

2. Если сообщения о неопознанном устройстве нет, но в диспетчере устройств у UVC жёлтый восклицательный знак, дескрипторы составного устройства обычно не отвечают требованиям Windows. UVC можно объединять с RNDIS, ADB и UAC, соблюдая порядок ссылок ConfigFS (`ln -s`): для UVC/RNDIS/ADB — RNDIS, UVC, ADB, чтобы дескрипторы RNDIS шли первыми; для UVC/UAC — UAC, UVC, чтобы первым был UAC. Иначе загрузка драйвера Windows может завершиться ошибкой.

#### 2.4.2 Неожиданное отключение

Три типовые причины:

1. Провал напряжения USB VBUS или вывода OTG_VBUS. Ниже порога Bvalid PHY формирует disconnect. Наблюдайте VBUS осциллографом в реальном времени. На DWC3, например RV1109/RV1126/RK1808/RK3399/RK356X, строка последовательного журнала `dwc3 ffd00000.dwc3: dwc3 device disconnect` во время сбоя указывает на этот класс проблем.

Устраните провал напряжения изменением схемы. Программно можно снизить потребление при высокой нагрузке либо изменить порог Bvalid PHY; RV1109/RV1126 не поддерживают настройку этого порога.

2. Приложение Device повторно настраивает/включает USB через ConfigFS. `/sys/kernel/config/usb_gadget/rockchip/UDC` управляет контроллером через `udc_start()`/`udc_stop()`, отключая UVC без сигнала disconnect PHY. Проверьте логику приложения и исключите перенастройку/включение USB во время обмена UVC.

3. Host сам прекращает обмен UVC. Анализируйте его поведение анализатором или инструментами захвата Host вместе с журналами Host.

#### 2.4.3 Предпросмотр не открывается

Далее пять типовых причин:

1. Сбой высокоскоростного согласования. UVC требует high-speed или super-speed; переход к full-speed из-за сигнала мешает предпросмотру. Ищите в последовательном журнале `configfs-gadget gadget: full-speed config #1: b` либо запросите скорость через интерфейс состояния. Исследуйте согласование осциллографом, установите причину и исправьте аппаратную часть.

2. Ошибка согласования полосы через probe control/commit control. Перед предпросмотром Host и Device согласуют полосу [6], как показано на рисунке 3.

![Техническая иллюстрация из китайского оригинала](/docs/rockchip-linux419-usb-gadget-uvc/assets/cn-p012-figure-01.png)

Рисунок 3. Согласование UVC. (1) Host передаёт желаемые настройки (PROBE). (2) Device корректирует их в пределах своих возможностей и отвечает (PROBE). (3) Host принимает их командой COMMIT. (4) Device задаёт формат, разрешение и полосу по подтверждённым значениям.

Пример исходника: macOS 10.14 и более ранние версии несовместимы с настройкой RV1109 3KB/микрокадр. Захват анализатором или Wireshark показывает wMaxPacketSize = 3 * 1024 bytes в дескрипторе, но Device возвращает dwMaxPayloadTransferSize = 1024 на PROBE_CONTROL(GET_CUR). macOS запрашивает 1KB/микрокадр, предпросмотр не работает. Ответ probe должен соответствовать дескриптору. RV1109 UVC APP по умолчанию всегда использует 1024. Исправьте приложение: считайте фактический максимальный пакет конечной точки и возвращайте dwMaxPayloadTransferSize = 3072 на PROBE_CONTROL(GET_CUR).

3. Неисправность USB-контроллера. Он передаёт управляющие запросы и видео между Device и Host; сбой мешает предпросмотру. Захватите аномальный обмен анализатором и сопоставьте с кодом драйвера. Если анализатор недоступен, включите трассировку через интерфейсы ядра UVC и изучите регистры в момент сбоя.

См. подразделы интерфейсов USB DWC2 OTG и USB DWC3 OTG.

4. Приложение Device неправильно обрабатывает class request. Ядро передаёт запросы Host приложению через события V4L2. После разбора и обработки приложение вызывает ioctl драйвера UVC для ответа. Ошибка может нарушить перечисление устройства. Один анализатор показывает отсутствие ответа, но не отличает ошибку приложения от контроллера. Включите трассировку управляющих запросов. Если после `setup request` нет `uvc_send_response`, причина в приложении. Исправьте обработку class request для корректного и своевременного ответа.

5. Сбой Host. По USB 2.0 все транзакции инициирует Host; Device не передаёт данные самостоятельно. Если Host не выполняет SetInterface включения потока или затем не посылает IN-пакеты конечной точке streaming, видео передаваться не будет. Захватите полные транзакции анализатором. Без него используйте инструменты захвата Host; на DWC3 (RV1109/RV1126/RK1808/RK3399/RK356X) дополнительно соберите сведения драйвера Device через интерфейс отладки. Исправление Host выходит за рамки руководства.

#### 2.4.4 Зависание предпросмотра

Зависание зависит от сценария; воспроизведение и создание среды отладки сложны, поэтому причину особенно трудно локализовать. Внешне контроллер перестаёт непрерывно передавать видео, но это не обязательно его неисправность. Анализируйте конкретный случай. Три типовые причины:

1. Сбой модуля кодирования изображения Device.

2. Ошибка queue buf/dequeue buf приложения: буферы не ставятся в очередь драйвера UVC.

3. Сбой контроллера UVC.

Для причин 2 и 3 отслеживайте queue buf, dequeue buf и buf done через V4L2, работу драйвера контроллера — через UDC core и DWC3. Универсального решения нет. Если эффективного исправления нет, можно использовать динамическую переинициализацию для восстановления.

#### 2.4.5 Задержка предпросмотра

Тракт изображения UVC длинный, каждый модуль добавляет задержку. Сначала захватите анализатором полный поток при запуске, чтобы приблизительно локализовать источник. Затем для Device измеряйте этапы отдельно: Sensor -&gt; ISP -&gt; UVC APP -&gt; V4L2 -&gt; драйвер UVC -&gt; контроллер USB Device.

1. Драйвер передаёт первый кадр из нулей. При запуске приложение ставит буфер в очередь до готовности изображения, с bytesused = 0 для пустых данных. V4L2 по умолчанию заменяет ноль размером кадра по разрешению, и контроллер передаёт нулевой кадр. Это занимает десятки или сотни миллисекунд. Контроллеры Rockchip Device поддерживают пакет нулевой длины; allow_zero_bytesused = 1 в драйвере UVC устраняет передачу нулевого кадра. Далее коммит Linux 4.19 из исходника:

```text
commit 124b7feb0eeff964978842322f0b1e6faab1f742
Author: William Wu <william.wu@rock-chips.com>
Date:   Thu Jun 18 18:26:35 2020 +0800

    usb: gadget: uvc: allow zero bytesused for rockchip uvc

    For rockchip platforms, the userspace uvc application use
    bytesused == 0 as a way to indicate that the data is all
    zero and unused. In that case, the uvc driver should use
    the allow_zero_bytesused flag to keep bytesused 0 rather
    than use the buf actual size instead. This can help to
    preview 1080P@MJPG faster.

    Change-Id: Ic4d561f18e85d759b5a2405db4f6fb48533e1781
    Signed-off-by: William Wu <william.wu@rock-chips.com>
```

2. Буферизация изображения на Device или Host.

Пример 1 исходника: RV1109 использует 3KB/микрокадр, предпросмотр PotPlayer на Host запаздывает; переход на 1KB улучшает результат. Причина — буферизация Host. iq проекта по умолчанию равен 0: ISP сначала выдаёт стандартные для драйвера 60fps, затем в течение 1s получает настройку UVC 30fps и переключается. При 3KB кадр занимает 13ms, Host принимает больше 30fps, а PotPlayer показывает 30fps, накапливая задержку. При 1KB кадр занимает около 33ms, полоса ограничивает поток 30fps, буферизации и заметной задержки нет. Решение: изменить iq по умолчанию для строгих 30fps согласно UVC.

Пример 2: команда непрерывного вывода модулю структурированного света создаёт задержку.

В эксперименте исходника одноканальная/трёхканальная работа с командой непрерывного вывода давала примерно на 180ms больше, чем без неё. После команды модуль синхронизирует три видеоканала, откладывая следующий кадр примерно на 180ms; CIF буферизует четыре полных кадра, создавая задержку. Если синхронизация не нужна, отключите её в модуле либо не посылайте команду из APK. Если нужна — обработайте буферизованные CIF кадры, устраняя причину задержки.

Пример 3: задержка MJPEG 1080P структурированного света. Один канал без команды при 1080P примерно на 180ms медленнее 480P. libuvc APK на Host копирует данные ядра через memcpy в собственную очередь кадров, асинхронную с 10 циклическими приёмными URB ядра. Программное декодирование/вывод 1080P медленны: к показу первого кадра ядро и очередь libuvc уже получили 6–7 кадров. Буферизация создаёт задержку. Увеличьте эффективность программного декодирования Host и избегайте буферизации. Это эксперименты исходника, не измерения ArmSoM.

#### 2.4.6 Проблемы EMI UVC

Проблемы EMI часто связаны со схемой Device и мешают запуску или вызывают зависание. Linux Host обычно выводит `usb usb1-port1: disabled by hub (EMI?), re-enabling...`. Драйвер предполагает EMI: контроллер, например EHCI, постоянно проверяет port enable и обнаруживает переход enable в disable при сохранённом признаке подключения. Поэтому журнал задаёт направление поиска, но не доказывает EMI. Способы устранения:

1. Измерьте глазковую диаграмму USB и передайте отчёт инженерам аппаратуры и драйвера. По отчёту улучшите схему и настройки PHY для повышения качества сигнала и уменьшения EMI.

2. Измерьте синфазный шум осциллографом. Избыток ухудшает DP/DM и может вызвать EMI. Последовательный синфазный дроссель DP/DM и улучшение общего заземления могут уменьшить шум.

## 3. Источники

1. Rockchip_Developer_Guide_USB_CN

2. kernel/Documentation/devicetree/bindings/usb/generic.txt

3. kernel/Documentation/devicetree/bindings/usb/dwc3.txt

4. kernel/Documentation/devicetree/bindings/usb/rockchip,dwc3.txt

5. kernel/Documentation/trace/ftrace.rst

6. USB Video Class v1.1

### Технические ссылки исходника

- [1](https://www.uwe-sieber.de/usbtreeview_e.html)
- [2](https://events.static.linuxfound.org/sites/events/files/slides/USB%20Gadget%20Configfs%20API_0.pdf)
- [3](https://usb.org/document-library/video-class-v11-document-set)

{% endraw %}
