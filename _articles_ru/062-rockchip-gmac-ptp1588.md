---
title: "Rockchip GMAC PTP1588: аппаратные временные метки, синхронизация часов и PPS"
description: "Полное руководство PTP1588: формулы задержки и смещения, регистры GMAC, ptp4l/phc2sys/gPTP, фиксированный и гибкий PPS, RT-Thread и патч режима ведущего для Linux 4.19."
translation_key: "062-rockchip-gmac-ptp1588"
slug: "062-rockchip-gmac-ptp1588"
lang: "ru"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "storage"
products: []
tags: ["ArmSoM", "Rockchip", "GMAC", "PTP1588", "PPS", "RK3576", "RK3588"]
keywords: "ArmSoM Rockchip GMAC PTP1588 PPS RK3576 RK3588"
excerpt: "Полное руководство PTP1588: формулы задержки и смещения, регистры GMAC, ptp4l/phc2sys/gPTP, фиксированный и гибкий PPS, RT-Thread и патч режима ведущего для Linux 4.19."
---

{% raw %}

# Rockchip GMAC PTP1588: аппаратные временные метки, синхронизация часов и PPS

## Применимость к ArmSoM

Документ описывает функцию PTP1588 интерфейса Ethernet GMAC на платформе Rockchip. Статья полностью следует английскому PDF V1.0.0 объёмом 16 страниц; соответствующий китайский PDF не предоставлен. Китайская и русская версии полностью переведены с английского технического текста. Все шесть рисунков во всех языковых версиях взяты из английского PDF; содержащиеся в них китайские подписи и интерфейсы приборов сохранены.

Это справочный материал для платформ ArmSoM, а не отчёт о проверке конкретной платы. Таблица исходника перечисляет SoC и указывает «ALL» для версий ядра. Это область применения, заявленная исходником, а не подтверждение поддержки всех возможностей каждым ядром или каждой платой ArmSoM. Проверьте конкретную плату, соединения Ethernet/PHY, SDK/BSP, драйвер, `clk_ptp_ref`, мультиплексирование вывода PPS и доступные часы PTP. Раздел 4 отдельно рассматривает RT-Thread на RK2118. Команды на оборудовании, синхронизация часов и применение патча не выполнялись. Журналы, осциллограммы и результаты с точностью менее микросекунды взяты из исходника и не являются измерениями ArmSoM.

| SoC исходника | Ядра по исходнику |
| --- | --- |
| RK3588, RK3576, RK3568, RK3506, RV1126, RK2118 | ALL |

Неоднозначности исходника сохранены и отмечены: строки IPv6 в §1.3, имя `phy2sys` в разделе 2, формулировка CST/UTC в §2.2, расшифровка gPTP и первое очень большое значение RMS в журнале. Не считайте их проверенными значениями конфигурации. Страницы источника и исправления только извлечения/вёрстки приведены в редакционных примечаниях.

[Редакционные примечания](/docs/rockchip-gmac-ptp1588/EDITORIAL-NOTES.md) · [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.4, unit 0 -->

## 1. Принцип реализации PTP1588

<!-- Source EN PDF p.4, unit 1 -->

PTP1588, стандарт точного времени для сетевых систем измерения и управления, предназначен для синхронизации всех часов распределённой сети с наиболее точными часами. Он определяет PTP (Precision Time Protocol) для синхронизации устройств стандартного Ethernet и других терминальных устройств с поддержкой многоадресной передачи с точностью менее микросекунды. IEEE PTP1588 применяется в локальных распределённых системах, которым требуется более высокая точность часов, чем обеспечивает NTP. Контроллер GMAC поддерживает PTP1588 v1 и v2.

<!-- Source EN PDF p.4, unit 2 -->

Распространённая процедура синхронизации PTP1588 использует механизм запроса и ответа для измерения задержки (Delay Request-Response Mechanism):

<!-- Source EN PDF p.4, unit 3 -->

### 1.1 Передача и приём сообщений в механизме измерения задержки

<!-- Source EN PDF p.4, unit 4 -->

![Временная диаграмма запроса и ответа задержки](/docs/rockchip-gmac-ptp1588/assets/en-p04-figure1.png)

*Временная диаграмма запроса и ответа задержки — Английский PDF, p.4.*

<!-- Source EN PDF p.4, unit 5 -->

1. Ведущее устройство периодически рассылает PTP-сообщения синхронизации всем своим узлам. Сообщение покидает систему ведущего устройства в момент t1; момент выхода пакета через порт Ethernet GMII или MII фиксируется как t1.
2. Ведомое устройство получает сообщение синхронизации и фиксирует точный момент t2 по собственной временной базе.
3. Ведущее устройство отправляет ведомому сообщение Follow_up с информацией t1 для последующего использования. Поскольку сообщение Sync не может содержать точный момент своего отправления, точная временная метка t1 этого сообщения помещается в последующее сообщение Follow_up и передаётся ведомым часам.
4. Ведомое устройство отправляет ведущему сообщение Delay_Req и фиксирует точный момент t3, когда пакет покидает интерфейс GMII или MII.
5. Ведущее устройство получает сообщение и фиксирует точный момент t4 его поступления в систему.
6. Ведущее устройство передаёт ведомому значение t4 в сообщении Delay_Resp.
7. Используя четыре значения t1, t2, t3 и t4, ведомое устройство синхронизирует свою локальную временную базу с временной базой ведущего устройства.

<!-- Source EN PDF p.5, unit 12 -->

### 1.2 Смещение часов и задержка сети

<!-- Source EN PDF p.5, unit 13 -->

`offset`: смещение часов, то есть разность времени между ведущими и ведомыми часами.

<!-- Source EN PDF p.5, unit 14 -->

`delay`: задержка сети, возникающая при передаче сообщений.

<!-- Source EN PDF p.5, unit 15 -->

По четырём точным временным меткам t1, t2, t3 и t4 ведомые часы могут вычислить смещение между часами `offset` и задержку передачи `delay`:

<!-- Source EN PDF p.5, unit 16 -->

![Формулы задержки сети и смещения часов](/docs/rockchip-gmac-ptp1588/assets/en-p05-figure1.png)

*Формулы задержки сети и смещения часов — Английский PDF, p.5.*

```text
delay  = ((t2 - t1) + (t4 - t3)) / 2
offset = ((t2 - t1) - (t4 - t3)) / 2
```

<!-- Source EN PDF p.5, unit 17 -->

Получив offset и delay, ведомые часы выполняют синхронизацию путём коррекции локальных часов.

<!-- Source EN PDF p.5, unit 18 -->

### 1.3 Сообщения PTP

<!-- Source EN PDF p.5, unit 19 -->

Пакеты PTP поверх IPv4

<!-- Source EN PDF p.5, unit 20 -->

Для IEEE 1588 v1 разрешены следующие многоадресные адреса IPv4:

- `224.0.1.129`
- `224.0.1.130`
- `224.0.1.131`
- `224.0.1.132`

<!-- Source EN PDF p.6, unit 22 -->

Многоадресные адреса IP для IEEE 1588 v2:

- PTP Primary multicast address: `224.0.1.129`
- PTP Pdelay multicast address: `224.0.0.107`

Для кадров PTP поверх IPv6 в исходнике приведены следующие шестнадцатеричные адреса:

- PTP Primary multicast address: `FF0x:0:0:0:0:0:0:0:0:181`
- PTP Pdelay multicast address: `FF02:0:0:0:0:0:0:0:0:6B`

<!-- Source EN PDF p.6, unit 23 -->

Пакеты PTP поверх Ethernet

<!-- Source EN PDF p.6, unit 24 -->

Все сообщения PTP могут использовать любой из следующих многоадресных адресов:

- `01-1B-19-00-00-00`
- `01-80-C2-00-00-0E`

<!-- Source EN PDF p.6, unit 25 -->

### 1.4 Принцип работы GMAC PTP1588

<!-- Source EN PDF p.6, unit 26 -->

Генератор системного времени GMAC PTP1588 обновляется от опорного тактового сигнала `clk_ptp_ref`. Он служит источником для захвата снимков времени, то есть временных меток Ethernet-пакетов, передаваемых и принимаемых через интерфейс \*GMII/RMII.

<!-- Source EN PDF p.6, unit 27 -->

Системное время состоит из двух частей, размещённых в регистрах `MAC_System_Time_Seconds` и `MAC_System_Time_Nanoseconds`. Поле наносекунд поддерживает два режима:

<!-- Source EN PDF p.6, unit 28 -->

Цифровой режим переполнения (Digital rollover mode): максимальное значение поля наносекунд равно `0x3B9A_C9FF`, то есть `(10^9-1)` наносекунд.

<!-- Source EN PDF p.6, unit 29 -->

Двоичный режим переполнения (Binary rollover mode): после достижения `0x7FFF_FFFF` поле наносекунд переполняется, а поле секунд увеличивается; разрешение составляет приблизительно `0.466 ns` на бит.

<!-- Source EN PDF p.6, unit 30 -->

Системное время обновляется установкой бита `TSUPDT`. Перед этим в регистрах `MAC_System_Time_Seconds_Update` и `MAC_System_Time_Nanoseconds_Update` необходимо задать величину, которую следует прибавить или вычесть.

<!-- Source EN PDF p.6, unit 31 -->

Непосредственное обновление системного времени приводит к сравнительно большой погрешности джиттера, поэтому предусмотрен более точный способ коррекции времени.

<!-- Source EN PDF p.7, unit 32 -->

![Аккумулятор системного времени и регистры приращения GMAC](/docs/rockchip-gmac-ptp1588/assets/en-p07-figure1.png)

*Аккумулятор системного времени и регистры приращения GMAC — Английский PDF, p.7.*

<!-- Source EN PDF p.7, unit 33 -->

Как показано на рисунке, коррекция системного времени GMAC PTP1588 выполняется путём компенсации частотного смещения или дрейфа `clk_ptp_ref` относительно ведущих часов в течение некоторого интервала; это понятие определено в IEEE 1588-2002. Такой подход сохраняет линейность времени и не вызывает резких изменений или большого джиттера опорного времени между сообщениями синхронизации PTP. Аккумулятор суммирует содержимое регистра addend, а возникающий арифметический перенос используется как импульс увеличения счётчика системного времени. Аккумулятор представляет собой 32-битный регистр, работающий как высокоточный умножитель или делитель частоты.

<!-- Source EN PDF p.7, unit 34 -->

Обычно задаётся исходное значение addend, например `0x80000000`: тогда 32-битный аккумулятор переполняется через каждые два периода `clk_ptp_ref`. При переполнении аккумулятора регистр Sub-second увеличивается на единицу, заданную регистром `incr_sub_sec`. Для тактовой частоты 100M значение `MAC_Sub_Second_Increment` должно соответствовать двум периодам, то есть `0x14`. Это относится к цифровому режиму; для двоичного режима требуется преобразование. В цифровом режиме при достижении `0x3B9A_C9FF` регистр Second увеличивается на 1, что соответствует накоплению 1s; в двоичном режиме это происходит при достижении `0x7FFF_FFFF`.

<!-- Source EN PDF p.8, unit 35 -->

При синхронизации PTP1588 значение регистра addend прибавляется к аккумулятору в каждом периоде `clk_ptp_ref`. Изменение addend влияет на накопление Sub-second; упрощённо это можно рассматривать как изменение тактирования PTP, которое в итоге изменяет ход системного времени. Программное обеспечение должно вычислять частотный дрейф по сообщениям синхронизации и соответствующим образом обновлять регистр addend.

<!-- Source EN PDF p.8, unit 36 -->

### 1.5 Получение временных меток GMAC PTP1588

<!-- Source EN PDF p.8, unit 37 -->

Из процедуры обмена сообщениями в механизме измерения задержки видно, насколько важно точно определять время передачи и приёма пакетов сетевой картой. В аппаратной реализации GMAC при передаче и приёме сетевого пакета сохраняет текущую системную временную метку в заданной области памяти. Этой областью является дескриптор передачи или приёма соответствующего пакета; ниже показан пример TX-дескриптора:

<!-- Source EN PDF p.8, unit 38 -->

![Размещение временной метки в TX-дескрипторе](/docs/rockchip-gmac-ptp1588/assets/en-p08-figure1.png)

*Размещение временной метки в TX-дескрипторе — Английский PDF, p.8.*

| Слово дескриптора | Биты | Назначение |
| --- | --- | --- |
| TDES0 | 31:0 | Младшее слово метки |
| TDES1 | 31:0 | Старшее слово метки |
| TDES2 | 31:0 | Зарезервировано |
| TDES3 | 31 | OWN |
| TDES3 | 30:0 | Status[30:0] |

<!-- Source EN PDF p.8, unit 39 -->

Фрагмент кода:

<!-- Source EN PDF p.8, unit 40 -->

```c
static inline void dwmac4_get_timestamp(void *desc, u32 ats, u64 *ts)
{
    struct dma_desc *p = (struct dma_desc *)desc;
    u64 ns;
    ns = le32_to_cpu(p->des0);
    /* convert high/sec time stamp value to nanosecond */
    ns += le32_to_cpu(p->des1) * 1000000000ULL;
    *ts = ns;
}
```

<!-- Source EN PDF p.8, unit 41 -->

Типы сообщений, для которых аппаратное обеспечение сохраняет временные метки при приёме и передаче, задаются в регистре `MAC_Timestamp_Control`.

<!-- Source EN PDF p.9, unit 42 -->

## 2. Проверка PTP1588

<!-- Source EN PDF p.9, unit 43 -->

Проверьте поддержку аппаратных временных меток с помощью ethtool. При наличии поддержки список возможностей должен содержать:

<!-- Source EN PDF p.9, unit 44 -->

- `SOF_TIMESTAMPING_RAW_HARDWARE`

<!-- Source EN PDF p.9, unit 45 -->

- `SOF_TIMESTAMPING_TX_HARDWARE`

<!-- Source EN PDF p.9, unit 46 -->

- `SOF_TIMESTAMPING_RX_HARDWARE`

<!-- Source EN PDF p.9, unit 47 -->

```text
root@linaro-alip:/# ethtool -T eth0
Time stamping parameters for eth0:
Capabilities:
        hardware-transmit (SOF_TIMESTAMPING_TX_HARDWARE)
        software-transmit (SOF_TIMESTAMPING_TX_SOFTWARE)
        hardware-receive (SOF_TIMESTAMPING_RX_HARDWARE)
        software-receive (SOF_TIMESTAMPING_RX_SOFTWARE)
        software-system-clock (SOF_TIMESTAMPING_SOFTWARE)
        hardware-raw-clock (SOF_TIMESTAMPING_RAW_HARDWARE)
PTP Hardware Clock: 0
Hardware Transmit Timestamp Modes:
        off
        on
Hardware Receive Filter Modes:
        none
        all
        ptpv1-l4-event
        ptpv1-l4-sync
        ptpv1-l4-delay-req
        ptpv2-l4-event
        ptpv2-l4-sync
        ptpv2-l4-delay-req
        ptpv2-event
        ptpv2-sync
```

<!-- Source EN PDF p.9, unit 48 -->

К распространённым средствам проверки относятся ptp4l и phy2sys из Linuxptp. ptp4l синхронизирует аппаратные часы PTP с ведущими часами через аппаратные временные метки либо синхронизирует системные часы с ведущими через программные метки. phc2sys синхронизирует системные часы с аппаратными часами сетевой карты и применяется только в режиме аппаратных меток. Существуют также другие средства, например ptpd2.

<!-- Source EN PDF p.9, unit 49 -->

### 2.1 Проверка с ptp4l

<!-- Source EN PDF p.9, unit 50 -->

Ведомое устройство:

<!-- Source EN PDF p.9, unit 51 -->

```text
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.9, unit 52 -->

Ведущее устройство:

<!-- Source EN PDF p.10, unit 53 -->

```text
ptp4l -i eth0 -m -H
```

<!-- Source EN PDF p.10, unit 54 -->

```text
ptp4l[420.071]: selected /dev/ptp0 as PTP clock
ptp4l[420.077]: port 1 (eth0): new foreign master 54e1ad.fffe.dfa454-1
ptp4l[424.077]: selected best master clock 54e1ad.fffe.dfa454
ptp4l[424.078]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[425.084]: master offset -1466 s2 freq -20216 path delay 13117
ptp4l[425.084]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[426.084]: master offset -6 s2 freq -19196 path delay 13117
ptp4l[427.085]: master offset 491 s2 freq -18701 path delay 13020
ptp4l[428.084]: master offset 330 s2 freq -18714 path delay 13026
ptp4l[429.084]: master offset 365 s2 freq -18580 path delay 13041
ptp4l[430.084]: master offset 116 s2 freq -18720 path delay 13050
ptp4l[431.084]: master offset 30 s2 freq -18771 path delay 13041
ptp4l[432.084]: master offset 24 s2 freq -18768 path delay 13032
ptp4l[433.084]: master offset 29 s2 freq -18756 path delay 13032
ptp4l[434.084]: master offset 39 s2 freq -18737 path delay 13032
ptp4l[435.084]: master offset -71 s2 freq -18836 path delay 13032
ptp4l[437.085]: master offset 201 s2 freq -18585 path delay 13015
ptp4l[438.085]: master offset -70 s2 freq -18796 path delay 13021
ptp4l[439.085]: master offset -30 s2 freq -18777 path delay 13041
ptp4l[440.085]: master offset 29 s2 freq -18727 path delay 13032
ptp4l[441.085]: master offset -41 s2 freq -18788 path delay 13037
ptp4l[442.085]: master offset -61 s2 freq -18820 path delay 13037
ptp4l[443.085]: master offset 54 s2 freq -18723 path delay 13007
ptp4l[444.085]: master offset -31 s2 freq -18792 path delay 13007
ptp4l[445.085]: master offset -6 s2 freq -18777 path delay 13007
ptp4l[446.085]: master offset 61 s2 freq -18711 path delay 13045
ptp4l[447.085]: master offset -89 s2 freq -18843 path delay 13045
ptp4l[448.085]: master offset 41 s2 freq -18740 path delay 13030
ptp4l[449.085]: master offset -4 s2 freq -18772 path delay 13030
ptp4l[450.085]: master offset -47 s2 freq -18817 path delay 13023
ptp4l[451.085]: master offset 5 s2 freq -18779 path delay 13026
ptp4l[452.085]: master offset 55 s2 freq -18727 path delay 13026
ptp4l[453.085]: master offset 93 s2 freq -18673 path delay 13023
ptp4l[454.085]: master offset -57 s2 freq -18795 path delay 13023
ptp4l[455.086]: master offset -32 s2 freq -18787 path delay 13023
ptp4l[456.085]: master offset 33 s2 freq -18732 path delay 13023
ptp4l[457.086]: master offset -26 s2 freq -18781 path delay 13037
ptp4l[458.086]: master offset -55 s2 freq -18817 path delay 13026
ptp4l[459.086]: master offset -5 s2 freq -18784 path delay 13026
ptp4l[460.086]: master offset -33 s2 freq -18813 path delay 13024
```

<!-- Source EN PDF p.10, unit 55 -->

`master offset` показывает разность времени между ведущим и ведомым узлами в наносекундах (ns). s0, s1 и s2 обозначают состояния протокола 1588: s0 — нет захвата, s1 — синхронизация, s2 — захват установлен. `freq` обозначает коррекцию частоты часов в миллиардных долях (ppb), а `path delay` — ожидаемую задержку сообщения синхронизации от ведущих часов в наносекундах. Её можно измерять методом E2E или P2P; по умолчанию используется E2E.

<!-- Source EN PDF p.11, unit 56 -->

### 2.2 Синхронизация системных часов

<!-- Source EN PDF p.11, unit 57 -->

Синхронизация часов сетевой карты и операционной системы:

<!-- Source EN PDF p.11, unit 58 -->

Ведущие часы

<!-- Source EN PDF p.11, unit 59 -->

```text
sudo phc2sys -m -s CLOCK_REALTIME -c end0 -w &
sudo ptp4l -i end0 -m -H
```

<!-- Source EN PDF p.11, unit 60 -->

Ведомые часы

<!-- Source EN PDF p.11, unit 61 -->

```text
phc2sys -m -s eth0 -c CLOCK_REALTIME -w --step_threshold=1 &
ptp4l -i eth0 -m -H -s
```

<!-- Source EN PDF p.11, unit 62 -->

Время на двух платах до синхронизации:

<!-- Source EN PDF p.11, unit 63 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:48:25 CST
root@buildroot:/# date
Thu Jan 1 00:14:02 UTC 1970
```

<!-- Source EN PDF p.11, unit 64 -->

Время на двух платах после синхронизации. В исходнике сказано, что китайское стандартное время CST отстаёт от UTC на восемь часовых поясов. Это направление смещения противоречит приведённому ниже примеру; исходное утверждение сохранено и отмечено для проверки:

<!-- Source EN PDF p.11, unit 65 -->

```text
root@linaro-alip:/# date
July 8, 2024, Monday, 19:51:52 CST
root@buildroot:/# date
Mon Jul 8 11:51:52 UTC 2024
```

<!-- Source EN PDF p.11, unit 66 -->

### 2.3 Проверка gPTP

<!-- Source EN PDF p.11, unit 67 -->

В исходнике аббревиатура gPTP раскрыта как general precise time protocol. gPTP является производной PTP и также называется 802.1AS. Его задача — обеспечить согласованное время всех узлов локальной сети. gPTP распространяется на уровне L2, что ограничивает его распространение локальной сетью.

<!-- Source EN PDF p.11, unit 68 -->

Ведомое устройство:

<!-- Source EN PDF p.11, unit 69 -->

```text
ptp4l -i eth0 -m -H -f ./gPTP.cfg --step_threshold=1 -s
```

<!-- Source EN PDF p.11, unit 70 -->

Ведущее устройство:

<!-- Source EN PDF p.11, unit 71 -->

```text
ptp4l -i end0 -m -H -f ./gPTP.cfg --step_threshold=1
```

<!-- Source EN PDF p.12, unit 73 -->

```text
ptp4l[196.636]: selected /dev/ptp0 as PTP clock -f gPTP.cfg --step_threshold=1 -s
ptp4l[196.670]: port 1 (eth0): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4l): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[196.671]: port 0 (/var/run/ptp4lro): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[200.262]: port 1 (eth0): new foreign master 9ae370.fffe.1cb4e0-1
ptp4l[200.547]: selected local clock 568583.fffe.b70879 as best master
ptp4l[202.262]: selected best master clock 9ae370.fffe.1cb4e0
ptp4l[202.262]: port 1 (eth0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[202.942]: port 1 (eth0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[203.568]: rms 853264659523145600 max 1706529319046291712 freq -4554 +/- 1736 delay 15780 +/- 0
ptp4l[204.570]: rms 305 max 360 freq -5595 +/- 53 delay 15780 +/- 0
ptp4l[205.571]: rms 205 max 290 freq -5713 +/- 37 delay 15770 +/- 0
ptp4l[206.573]: rms 53 max 129 freq -5592 +/- 58 delay 15769 +/- 0
ptp4l[207.574]: rms 46 max 85 freq -5572 +/- 63 delay 15765 +/- 0
ptp4l[208.576]: rms 62 max 115 freq -5510 +/- 73 delay 15765 +/- 0
ptp4l[209.577]: rms 52 max 95 freq -5502 +/- 66 delay 15765 +/- 0
ptp4l[210.579]: rms 49 max 75 freq -5545 +/- 66 delay 15765 +/- 0
ptp4l[211.580]: rms 56 max 115 freq -5506 +/- 75 delay 15765 +/- 0
ptp4l[212.582]: rms 42 max 65 freq -5552 +/- 53 delay 15765 +/- 0
ptp4l[213.584]: rms 53 max 114 freq -5553 +/- 72 delay 15774 +/- 0
ptp4l[214.585]: rms 51 max 106 freq -5513 +/- 66 delay 15774 +/- 0
ptp4l[215.587]: rms 59 max 74 freq -5552 +/- 81 delay 15774 +/- 0
ptp4l[216.588]: rms 57 max 96 freq -5503 +/- 71 delay 15764 +/- 0
ptp4l[217.590]: rms 50 max 99 freq -5566 +/- 62 delay 15779 +/- 0
ptp4l[218.591]: rms 68 max 101 freq -5538 +/- 93 delay 15779 +/- 0
ptp4l[219.593]: rms 66 max 106 freq -5538 +/- 91 delay 15774 +/- 0
ptp4l[220.595]: rms 56 max 106 freq -5551 +/- 78 delay 15774 +/- 0
ptp4l[221.596]: rms 55 max 84 freq -5575 +/- 72 delay 15784 +/- 0
ptp4l[222.598]: rms 36 max 71 freq -5539 +/- 47 delay 15789 +/- 0
ptp4l[223.599]: rms 53 max 76 freq -5561 +/- 74 delay 15784 +/- 0
ptp4l[224.601]: rms 65 max 116 freq -5533 +/- 87 delay 15784 +/- 0
ptp4l[225.602]: rms 64 max 136 freq -5577 +/- 86 delay 15784 +/- 0
ptp4l[226.604]: rms 66 max 136 freq -5538 +/- 88 delay 15784 +/- 0
ptp4l[227.606]: rms 46 max 61 freq -5553 +/- 63 delay 15779 +/- 0
ptp4l[228.607]: rms 58 max 139 freq -5547 +/- 80 delay 15779 +/- 0
ptp4l[229.609]: rms 42 max 61 freq -5553 +/- 58 delay 15779 +/- 0
```

<!-- Source EN PDF p.12, unit 74 -->

Здесь выводится среднеквадратическое значение (RMS) смещения для более плавного представления.

<!-- Source EN PDF p.12, unit 75 -->

## 3. PPS

<!-- Source EN PDF p.12, unit 76 -->

### 3.1 Фиксированный PPS

<!-- Source EN PDF p.12, unit 77 -->

PPS означает Pulse-Per-Second, импульс в секунду. По умолчанию GMAC работает в режиме фиксированного PPS с интервалом 1 секунда. Частоту PPS можно менять через поле `PPSCTRL0` регистра `MAC_PPS_Control`. В этом режиме для проверки выходного импульса PPS достаточно правильно настроить iomux. Значение `PPSCTRL` по умолчанию — `0000`: выводится один импульс в секунду шириной в один период `clk_ptp_ref`.

<!-- Source EN PDF p.13, unit 79 -->

![Осциллограмма остаточного джиттера PPS из исходника](/docs/rockchip-gmac-ptp1588/assets/en-p13-figure1.png)

*Осциллограмма остаточного джиттера PPS из исходника — Английский PDF, p.13.*

<!-- Source EN PDF p.13, unit 80 -->

На рисунке показан результат проверки из исходника: после синхронизации двух устройств по PTP1588 их выходные сигналы PPS через некоторое время наблюдаются осциллографом. Остаточное временное расхождение из-за джиттера в основном соответствует значению master offset, измеренному ptp4l.

<!-- Source EN PDF p.13, unit 81 -->

### 3.2 Двоичный и цифровой режимы

<!-- Source EN PDF p.13, unit 82 -->

Выше рассмотрены различия обновления системного времени в этих двух режимах. Частота и коэффициент заполнения PPS также различаются. Для других значений `PPSCTRL` исходник приводит следующие частоты:

<!-- Source EN PDF p.13, unit 83 -->

| PPSCTRL | Двоичный режим | Цифровой режим |
| --- | --- | --- |
| 0001 | 2 Hz | 1 Hz |
| 0010 | 4 Hz | 2 Hz |
| 0011 | 8 Hz | 4 Hz |
| 0100 | 16 Hz | 8 Hz |
| ... | ... | ... |
| 1111 | 32.768 KHz | 16.384 KHz |

<!-- Source EN PDF p.14, unit 89 -->

В двоичном режиме переполнения выход PPS `ptp_pps_o` на этих частотах имеет коэффициент заполнения 50%.

<!-- Source EN PDF p.14, unit 90 -->

В цифровом режиме частота PPS является усреднённой: фактическая частота меняется, а синхронизация происходит каждую секунду. Например:

<!-- Source EN PDF p.14, unit 91 -->

При `PPSCTRL = 0001` сигнал PPS (1 Hz) находится в низком уровне 537 миллисекунд, а в высоком — 463 миллисекунды.

<!-- Source EN PDF p.14, unit 92 -->

При `PPSCTRL = 0010` последовательность PPS (2 Hz) состоит из первого периода 537 миллисекунд с заполнением 50% и второго периода 463 миллисекунды, включающего 268 миллисекунд низкого и 195 миллисекунд высокого уровня.

<!-- Source EN PDF p.14, unit 93 -->

При `PPSCTRL = 0011` последовательность PPS (4 Hz) включает три периода по 268 миллисекунд с заполнением 50% и четвёртый период 195 миллисекунд: 134 миллисекунды низкого и 61 миллисекунда высокого уровня.

<!-- Source EN PDF p.14, unit 94 -->

Следовательно, в цифровом режиме интервалы PPS неодинаковы. Если требуется равномерный период, следует использовать двоичный режим.

<!-- Source EN PDF p.14, unit 95 -->

Обратите внимание: при `PPSCTRL >= 1` сигнал PPS начинается с низкого уровня, то есть выравнивается по спадающему фронту:

<!-- Source EN PDF p.14, unit 96 -->

![Осциллограмма выравнивания PPS по спадающему фронту из исходника](/docs/rockchip-gmac-ptp1588/assets/en-p14-figure1.png)

*Осциллограмма выравнивания PPS по спадающему фронту из исходника — Английский PDF, p.14.*

<!-- Source EN PDF p.15, unit 97 -->

### 3.3 Гибкий PPS

<!-- Source EN PDF p.15, unit 98 -->

По сравнению с фиксированным PPS, выдающим импульсы через заданные секундные интервалы, Flex PPS позволяет гибче задавать время начала, коэффициент заполнения, частоту и другие параметры.

<!-- Source EN PDF p.15, unit 99 -->

Включение PPS:

<!-- Source EN PDF p.15, unit 100 -->

```text
echo "0 0 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 101 -->

Также можно задать время начала PPS, например 100s:

<!-- Source EN PDF p.15, unit 102 -->

```text
echo "0 100 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 103 -->

После синхронизации времени двух устройств запустите PPS.

<!-- Source EN PDF p.15, unit 104 -->

Запустите ptp4l в фоновом режиме:

<!-- Source EN PDF p.15, unit 105 -->

```text
ptp4l -i eth0 -m -H &
ptp4l -i eth0 -m -H -s &
```

<!-- Source EN PDF p.15, unit 106 -->

Согласуйте одинаковое время начала PPS, например 200s, и выполните на обоих устройствах:

<!-- Source EN PDF p.15, unit 107 -->

```text
echo "0 200 0 1 1" > /sys/class/ptp/ptp0/period
```

<!-- Source EN PDF p.15, unit 108 -->

Подайте сигналы PPS обоих устройств на один осциллограф. Когда системное время GMAC достигнет 200s, оба сигнала начнут выводиться одновременно. В исходнике измеренное расхождение имеет порядок сотен наносекунд и согласуется с данными ptp4l. Это результат исходного документа, а не измерение на ArmSoM.

<!-- Source EN PDF p.15, unit 109 -->

### 3.4 Микросхемы с поддержкой PPS

<!-- Source EN PDF p.15, unit 110 -->

Согласно исходнику, среди микросхем с поддержкой PTP1588 функцию PPS на момент документа поддерживают все, кроме RK3568 и RV1126.

<!-- Source EN PDF p.15, unit 111 -->

## 4. PTP1588 в RT-Thread

<!-- Source EN PDF p.15, unit 112 -->

Помимо Linux, PTP1588 может поддерживаться и в RT-Thread; например, микросхема RK2118 использует RT-Thread.

<!-- Source EN PDF p.16, unit 113 -->

## 5. Типовые проблемы

<!-- Source EN PDF p.16, unit 114 -->

### 5.1 Тайм-аут TX

<!-- Source EN PDF p.16, unit 115 -->

В некоторых версиях ptp4l возникает ошибка `timed out while polling for tx timestamp`. Можно изменить `tx_timestamp_timeout` в `ptp4l.conf` на `400` и указать изменённый файл параметром `-f` либо непосредственно передать следующий параметр командной строки:

<!-- Source EN PDF p.16, unit 116 -->

```text
--tx_timestamp_timeout=400
```

<!-- Source EN PDF p.16, unit 117 -->

### 5.2 Ядро 4.19 не поддерживает режим ведущего устройства

<!-- Source EN PDF p.16, unit 118 -->

Примените следующий патч из исходника:

<!-- Source EN PDF p.16, unit 119 -->

```diff
diff --git a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
index 0511062a9e0d..1e6078a17511 100644
--- a/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
+++ b/drivers/net/ethernet/stmicro/stmmac/stmmac_main.c
@@ -644,7 +644,8 @@ static int stmmac_hwtstamp_set(struct net_device *dev, struct ifreq *ifr)
 			config.rx_filter = HWTSTAMP_FILTER_PTP_V2_EVENT;
 			ptp_v2 = PTP_TCR_TSVER2ENA;
 			snap_type_sel = PTP_TCR_SNAPTYPSEL_1;
-			ts_event_en = PTP_TCR_TSEVNTENA;
+			if (priv->synopsys_id < DWMAC_CORE_4_10)
+				ts_event_en = PTP_TCR_TSEVNTENA;
 			ptp_over_ipv4_udp = PTP_TCR_TSIPV4ENA;
 			ptp_over_ipv6_udp = PTP_TCR_TSIPV6ENA;
 			ptp_over_ethernet = PTP_TCR_TSIPENA;
```

{% endraw %}
