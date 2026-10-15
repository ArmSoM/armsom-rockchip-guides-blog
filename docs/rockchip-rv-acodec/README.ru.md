# Rockchip RV ACodec: полное руководство по настройке, записи и воспроизведению

Это справочный материал по аудио Rockchip RV в технической библиотеке ArmSoM. Он посвящён встроенному ACodec RV1106/RV1103, RV1106B/RV1103B и RV1126B/RV1126BP. Для первых двух групп указан kernel 5.10, для RV1126B/RV1126BP — 6.1. Это не инструкция настройки внутреннего кодека Sige7 / AIM7 (RK3588) или Sige5 / CM5 / AIM5 (RK3576): переносить их DTS, GPIO и mixer-контролы напрямую нельзя. Совместимая плата ArmSoM на RV здесь не подтверждена. Для собственного RV-устройства сверяйтесь с SoC, SDK, схемой и фактически зарегистрированной картой. Параметры и тесты оригинала не являются измерениями ArmSoM.

Источник: Rockchip_Developer_Guide_Linux_RV_Series_ACodec_EN.pdf, V1.6.0. Технические главы сохранены; служебные заявления, аудитория и история изменений исключены. Исправления и вопросы перечислены в [редакционных замечаниях](/docs/rockchip-rv-acodec/EDITORIAL-NOTES.md).

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://docs.armsom.org/armsom-sige7) · [Sige5](https://docs.armsom.org/armsom-sige5) · [CM5](https://docs.armsom.org/armsom-cm5)

<!-- source-page: 4; block: en-0000 -->

## 1. Обзор

<!-- source-page: 4; block: en-0001 -->

### 1.1 Назначение

<!-- source-page: 4; block: en-0002 -->

ACodec — встроенный аудиоблок SoC семейства Rockchip RV. К нему можно подключить аналоговый микрофон: АЦП преобразует входной сигнал в цифровые данные и передаёт их процессору. Для воспроизведения ЦАП преобразует цифровой PCM-поток процессора в аналоговый сигнал.

<!-- source-page: 4; block: en-0003 -->

RV1106 и RV1103 используют одинаковый блок ACodec с двумя АЦП и одним ЦАП. В RV1106B/RV1103B, выпущенных в 2024 году, используется одинаковый между этими двумя моделями ACodec, но относительно RV1106/RV1103 один АЦП удалён: остаются один АЦП и один ЦАП. При настройке часто требуется цифровой возврат воспроизводимого сигнала для опорного канала; ниже подробно разобрана его конфигурация.

<!-- source-page: 4; block: en-0004 -->

RV1126B/RV1126BP, выпущенные в 2025 году, поддерживают два малопотребляющих высокопроизводительных АЦП для захвата речи одним или двумя микрофонами. ADC0 поддерживает AOA (Always On Audio): непрерывную запись с крайне низким энергопотреблением и пробуждение из сна. Подробности приведены в разделе AOA документов SDK Rockchip_Developer_Guide_Linux_AOV_CN.pdf и Rockchip_Developer_Guide_Linux_AOV_EN.pdf.

<!-- source-page: 4; block: en-0005 -->

## 2. Устройство ACodec

<!-- source-page: 4; block: en-0006 -->

### 2.1 Возможности ACodec

<!-- source-page: 4; block: en-0007 -->

Основные характеристики ACodec в RV1106/RV1103/RV1106B/RV1103B:

<!-- source-page: 4; block: en-0008 -->

24-битный ЦАП, отношение сигнал/шум 93 дБ с A-взвешиванием.

<!-- source-page: 4; block: en-0009 -->

Линейный выход с нагрузкой 600 Ом.

<!-- source-page: 4; block: en-0010 -->

Потребление при воспроизведении: 2,5 мА.

<!-- source-page: 4; block: en-0011 -->

24-битный АЦП, отношение сигнал/шум 92 дБ с A-взвешиванием.

<!-- source-page: 4; block: en-0012 -->

Дифференциальный и несимметричный микрофонный или линейный вход.

<!-- source-page: 4; block: en-0013 -->

Потребление при стереозаписи: 5 мА.

<!-- source-page: 4; block: en-0014 -->

Автоматическая регулировка уровня ALC для плавного управления записью.

<!-- source-page: 4; block: en-0015 -->

Потребление в режиме ожидания: менее 0,05 мА.

<!-- source-page: 4; block: en-0016 -->

Программируемое аналоговое усиление входа и выхода.

<!-- source-page: 4; block: en-0017 -->

Встроенные цифровые фильтры интерполяции и децимации.

<!-- source-page: 4; block: en-0018 -->

Частоты дискретизации: 8/12/16/24/32/44,1/48/96 кГц.

<!-- source-page: 5; block: en-0019 -->

Питание аналоговой части 1,8 В, цифровой — 0,9 В.

<!-- source-page: 5; block: en-0020 -->

Основные характеристики ACodec RV1126B/RV1126BP:

<!-- source-page: 5; block: en-0021 -->

Ведомый интерфейс шины APB.

<!-- source-page: 5; block: en-0022 -->

Аналоговое усиление 0–48 дБ с шагом 3 дБ.

<!-- source-page: 5; block: en-0023 -->

Отношение сигнал/шум 96 дБ.

<!-- source-page: 5; block: en-0024 -->

Одноканальный АЦП с дифференциальным, несимметричным и псевдодифференциальным входом.

<!-- source-page: 5; block: en-0025 -->

Режимы ведущего и ведомого I2S/PCM.

<!-- source-page: 5; block: en-0026 -->

Последовательная передача I2S в стандартном формате, с левым и правым выравниванием.

<!-- source-page: 5; block: en-0027 -->

Режимы передачи PCM early, late1, late2 и late3.

<!-- source-page: 5; block: en-0028 -->

Передача начиная со старшего или младшего бита: MSB/LSB.

<!-- source-page: 5; block: en-0029 -->

Разрядность отсчёта 16–32 бита.

<!-- source-page: 5; block: en-0030 -->

Частоты дискретизации: 8, 16, 32, 64, 128, 11,025, 22,05, 44,1, 88,2, 176,4, 12, 24, 48, 96 и 192 кГц.

<!-- source-page: 5; block: en-0031 -->

Полоса пропускания фильтров: 0,45625 × FS.

<!-- source-page: 5; block: en-0032 -->

Неравномерность в полосе пропускания: в пределах ±0,1 дБ.

<!-- source-page: 5; block: en-0033 -->

Начало полосы задерживания фильтров: 0,5 × FS.

<!-- source-page: 5; block: en-0034 -->

Подавление в полосе задерживания: не менее 60 дБ.

<!-- source-page: 5; block: en-0035 -->

Цифровая регулировка уровня АЦП.

<!-- source-page: 5; block: en-0036 -->

Программируемое цифровое ослабление и усиление.

<!-- source-page: 6; block: en-0037 -->

### 2.2 Структурные схемы ACodec

<!-- source-page: 6; block: en-0038 -->

![Иллюстрация из оригинала: 2.2 Структурные схемы ACodec (p. 6)](assets/en-p006-fig01.png)

<!-- source-page: 6; block: en-0039 -->

Структурная схема ACodec RV1106/RV1103

<!-- source-page: 6; block: en-0040 -->

RV1106 и RV1103 поддерживают два входа АЦП для записи и один выход ЦАП для воспроизведения. В дифференциальном режиме RV1106 допускает до двух микрофонов, а RV1103 — только один. В несимметричном режиме обе модели допускают до двух микрофонов.

<!-- source-page: 7; block: en-0041 -->

![Иллюстрация из оригинала: 2.2 Структурные схемы ACodec (p. 7)](assets/en-p007-fig01.png)

<!-- source-page: 7; block: en-0042 -->

Структурная схема ACodec RV1106B/RV1103B

<!-- source-page: 7; block: en-0043 -->

В RV1106B/RV1103B удалён один АЦП: остаются один вход записи и один выход воспроизведения. Вход АЦП по-прежнему поддерживает дифференциальное и несимметричное подключение.

<!-- source-page: 7; block: en-0044 -->

RV1126B/RV1126BP по умолчанию поддерживают два малопотребляющих высокопроизводительных АЦП, оба с дифференциальным входом. Их структурная схема приведена ниже.

<!-- source-page: 8; block: en-0045 -->

![Иллюстрация из оригинала: 2.2 Структурные схемы ACodec (p. 8)](assets/en-p008-fig01.png)

<!-- source-page: 8; block: en-0046 -->

Структурная схема ACodec RV1126B/RV1126BP

<!-- source-page: 8; block: en-0047 -->

Основные различия подключения микрофонов в зависимости от SoC:

<!-- source-page: 8; block: en-0048 -->

| Модель SoC | Maximum number of MICs in single-ended mode | Максимум микрофонов в дифференциальном режиме |
| --- | --- | --- |
| RV1106 | 2 | 2 |
| RV1103 | 2 | 1 |
| RV1106B/RV1103B | 1 | 1 |
| RV1126B/RV1126BP | 2 | 2 |

<!-- source-page: 8; block: en-0049 -->

Типовые схемы подключения микрофонов см. в схемах RK EVB и руководстве по аппаратному проектированию.

<!-- source-page: 8; block: en-0050 -->

## 3. Программная настройка ACodec

<!-- source-page: 8; block: en-0051 -->

### 3.1 Настройка ядра для ACodec RV1106/RV1103

<!-- source-page: 8; block: en-0052 -->

Для SDK Rockchip с kernel-5.10 ориентируйтесь на следующий файл DTSI:

<!-- source-page: 8; block: en-0053 -->

```text
arch/arm/boot/dts/rv1106-evb-v10.dtsi
```

<!-- source-page: 9; block: en-0054 -->

Сначала определите узел acodec_sound с основными параметрами звуковой карты и ссылками на DAI контроллера i2s0_8ch и DAI периферии acodec:

<!-- source-page: 9; block: en-0055 -->

```text
    acodec_sound: acodec-sound {
        compatible = "simple-audio-card";
        simple-audio-card,name = "rv1106-acodec";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
            sound-dai = <&i2s0_8ch>;
        };
        simple-audio-card,codec {
            sound-dai = <&acodec>;
        };
    };
```

<!-- source-page: 9; block: en-0056 -->

Включите I2S0:

<!-- source-page: 9; block: en-0057 -->

```text
&i2s0_8ch {
    #sound-dai-cells = <0>;
    status = "okay";
};
```

<!-- source-page: 9; block: en-0058 -->

Включите ACodec и задайте GPIO управления внешним усилителем мощности:

<!-- source-page: 9; block: en-0059 -->

```text
&acodec {
    #sound-dai-cells = <0>;
    pa-ctl-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- source-page: 9; block: en-0060 -->

В этом примере внутренний I2S0 RV1106/RV1103 связывается с ACodec.

<!-- source-page: 9; block: en-0061 -->

У RV1106/RV1103 только один I2S-контроллер — I2S0. При включённом ACodec он занят внутренним соединением с кодеком. Поэтому использовать его внешние выводы I2S0 в этой конфигурации нельзя.

<!-- source-page: 9; block: en-0062 -->

### 3.2 Настройка ядра для ACodec RV1106B/RV1103B

<!-- source-page: 9; block: en-0063 -->

Пример настройки ACodec RV1106B/RV1103B:

<!-- source-page: 9; block: en-0064 -->

```text
arch/arm/boot/dts/rv1103b-evb.dtsi
    acodec_sound: acodec-sound {
        compatible = "simple-audio-card";
        simple-audio-card,name = "rv1103b-acodec";
        simple-audio-card,format = "i2s";
        simple-audio-card,mclk-fs = <256>;
        simple-audio-card,cpu {
            sound-dai = <&sai>;
        };
        simple-audio-card,codec {
            sound-dai = <&acodec>;
        };
    };
```

<!-- source-page: 10; block: en-0066 -->

В RV1106B/RV1103B цифровой аудиоконтроллер заменён с I2S на SAI. Включите соответствующий узел:

<!-- source-page: 10; block: en-0067 -->

```text
&sai {
    status = "okay";
};
```

<!-- source-page: 10; block: en-0068 -->

Также включите узел acodec:

<!-- source-page: 10; block: en-0069 -->

```text
&acodec {
    pa-ctl-gpios = <&gpio0 RK_PA3 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- source-page: 10; block: en-0070 -->

### 3.3 Настройка ACodec RV1106/RV1103 из пользовательского пространства

<!-- source-page: 10; block: en-0071 -->

Обычно элементы управления кодеком читают и изменяют через tinymix. В данном SDK эта утилита исключена, поэтому rockit предоставляет эквивалентную rk_mpi_amix_test. Следующая команда выводит все элементы управления:

<!-- source-page: 10; block: en-0072 -->

```text
# rk_mpi_amix_test --list_contents
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
Number of controls: 26
ctl     type    num     name                                    value
0       ENUM    1       I2STDM Digital Loopback Mode            , DisabledMode1Mode2Mode2 Swap
1       INT     1       ADC MIC Left Gain                       2 (range 0->3)
2       INT     1       ADC MIC Right Gain                      2 (range 0->3)
3       INT     1       ADC ALC Left Volume                     6 (range 0->31)
4       INT     1       ADC ALC Right Volume                    6 (range 0->31)
5       INT     1       ADC Digital Left Volume                 195 (range 0->255)
6       INT     1       ADC Digital Right Volume                195 (range 0->255)
7       ENUM    1       ADC HPF Cut-off                         , OffOn
8       INT     1       ALC AGC Left Volume                     12 (range 0->31)
9       INT     1       ALC AGC Right Volume                    12 (range 0->31)
10      INT     1       ALC AGC Left Max Volume                 7 (range 0->7)
11      INT     1       ALC AGC Right Max Volume                7 (range 0->7)
12      INT     1       ALC AGC Left Min Volume                 0 (range 0->7)
13      INT     1       ALC AGC Right Min Volume                0 (range 0->7)
14      ENUM    1       ALC AGC Left Switch                     , OffOn
15      ENUM    1       ALC AGC Right Switch                    , OffOn
16      ENUM    1       AGC Left Approximate Sample Rate        , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
17      ENUM    1       AGC Right Approximate Sample Rate       , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
18      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
19      ENUM    1       ADC MICBIAS Voltage VREFx0_8VREFx0_825VREFx0_85VREFx0_875, VREFx0_9VREFx0_925VREFx0_95VREFx0_975
20      ENUM    1       ADC Main MICBIAS                        Off, On
21      ENUM    1       ADC MIC Left Switch                     , WorkMute
22      ENUM    1       ADC MIC Right Switch                    , WorkMute
23      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
24      INT     1       DAC HPMIX Volume                        1 (range 0->2)
25      ENUM    1       DAC Control Manually                    , NoneOffOn
```

<!-- source-page: 11; block: en-0074 -->

Элементов много; далее рассмотрены наиболее часто используемые.

<!-- source-page: 11; block: en-0075 -->

```text
0       ENUM    1       I2STDM Digital Loopback Mode            , DisabledMode1Mode2Mode2 Swap
```

<!-- source-page: 11; block: en-0076 -->

Этот элемент предоставляет I2S0, но он тесно связан с ACodec: определяет режим цифрового возврата воспроизводимого сигнала в I2STDM. Возможные значения:

<!-- source-page: 11; block: en-0077 -->

Disabled: значение по умолчанию, цифровой возврат выключен.

<!-- source-page: 11; block: en-0078 -->

Mode1: для четырёхканальной записи; каналы 1–2 содержат микрофонные данные, 3–4 — возвращаемый сигнал.

<!-- source-page: 11; block: en-0079 -->

Mode2: для двух каналов; слева микрофон, справа сигнал правого канала воспроизведения.

<!-- source-page: 11; block: en-0080 -->

Mode2 Swap: для двух каналов; слева возвращаемый левый канал воспроизведения, справа микрофон. Порядок противоположен Mode2.

<!-- source-page: 11; block: en-0081 -->

При двухканальном воспроизведении в Mode2 или Mode2 Swap рекомендуется программно смешать каналы перед отправкой в ЦАП ACodec, чтобы опорный сигнал лучше соответствовал реальному пути эха.

<!-- source-page: 11; block: en-0082 -->

В выводе формата tinymix выбранное значение отмечено запятой слева. Например, «, Disabled» означает, что выбран Disabled.

<!-- source-page: 12; block: en-0083 -->

```text
1       INT     1       ADC MIC Left Gain                       2 (range 0->3)
2       INT     1       ADC MIC Right Gain                      2 (range 0->3)
```

<!-- source-page: 12; block: en-0084 -->

ACodec ADC Boost Gain задаёт аналоговое усиление; действительные рекомендуемые значения — 1–3:

<!-- source-page: 12; block: en-0085 -->

vol 0: выключено; не рекомендуется.

<!-- source-page: 12; block: en-0086 -->

vol 1: 0 дБ.

<!-- source-page: 12; block: en-0087 -->

vol 2: 20 дБ.

<!-- source-page: 12; block: en-0088 -->

vol 3: 12 дБ.

<!-- source-page: 12; block: en-0089 -->

```text
3       INT     1       ADC ALC Left Volume                     6 (range 0->31)
4       INT     1       ADC ALC Right Volume                    6 (range 0->31)
```

<!-- source-page: 12; block: en-0090 -->

ACodec ADC ALC PGA Gain — аналоговое усиление, диапазон значений 0–31:

<!-- source-page: 12; block: en-0091 -->

Минимум: −9 дБ (vol 0).

<!-- source-page: 12; block: en-0092 -->

Максимум: +37,5 дБ (vol 31).

<!-- source-page: 12; block: en-0093 -->

Шаг: +1,5 дБ.

<!-- source-page: 12; block: en-0094 -->

0 дБ соответствует vol 6.

<!-- source-page: 12; block: en-0095 -->

```text
5       INT     1       ADC Digital Left Volume                 195 (range 0->255)
6       INT     1       ADC Digital Right Volume                195 (range 0->255)
```

<!-- source-page: 12; block: en-0096 -->

ACodec ADC Digital Gain — цифровое усиление, диапазон значений 0–255:

<!-- source-page: 12; block: en-0097 -->

Минимум: −97,5 дБ (vol 0).

<!-- source-page: 12; block: en-0098 -->

Максимум: +30 дБ (vol 255).

<!-- source-page: 12; block: en-0099 -->

Шаг: +0,5 дБ.

<!-- source-page: 12; block: en-0100 -->

0 дБ соответствует vol 195.

<!-- source-page: 12; block: en-0101 -->

```text
18      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
```

<!-- source-page: 12; block: en-0102 -->

Diff означает Differential, Sing — Single-end. Элемент выбирает дифференциальный или несимметричный режим АЦП ACodec. По умолчанию выбран дифференциальный режим. Для минимального потребления включён только левый канал АЦП, поэтому исходное значение — DiffadcL.

<!-- source-page: 12; block: en-0103 -->

RV1103 не поддерживает двухканальный захват в дифференциальном режиме, поэтому вариант DiffadcLR для него недоступен.

<!-- source-page: 12; block: en-0104 -->

```text
23      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
```

<!-- source-page: 12; block: en-0105 -->

ACodec DAC Lineout Gain: диапазон значений 0–30:

<!-- source-page: 12; block: en-0106 -->

Минимум: −39 дБ (vol 0).

<!-- source-page: 12; block: en-0107 -->

Максимум: +6 дБ (vol 30).

<!-- source-page: 13; block: en-0108 -->

Шаг: +1,5 дБ.

<!-- source-page: 13; block: en-0109 -->

0 дБ соответствует vol 26.

<!-- source-page: 13; block: en-0110 -->

```text
24      INT     1       DAC HPMIX Volume                        1 (range 0->2)
```

<!-- source-page: 13; block: en-0111 -->

ACodec DAC HPMIX Gain управляет предварительным усилением перед Lineout; обычно его не меняют. Рабочие значения — 1 и 2:

<!-- source-page: 13; block: en-0112 -->

vol 0: выключено; не рекомендуется.

<!-- source-page: 13; block: en-0113 -->

vol 1: 0 дБ.

<!-- source-page: 13; block: en-0114 -->

vol 2: 6 дБ.

<!-- source-page: 13; block: en-0115 -->

```text
25      ENUM    1       DAC Control Manually                    , NoneOffOn
```

<!-- source-page: 13; block: en-0116 -->

В медиасистемах поток AO часто постоянно открыт, то есть звуковая карта остаётся включённой. Для остановки и возобновления звука достаточно быстро выключать и включать внешний PA. Для этого добавлен элемент DAC Control Manually:

<!-- source-page: 13; block: en-0117 -->

None: исходный режим; управление включением и выключением карты осуществляется реальным закрытием и открытием потока AO в медиасистеме.

<!-- source-page: 13; block: en-0118 -->

Off: при постоянно открытом AO вручную выключает внешний PA и заглушает динамик.

<!-- source-page: 13; block: en-0119 -->

On: при открытом AO после состояния Off снова включает внешний PA и возобновляет звук.

<!-- source-page: 13; block: en-0120 -->

Выше рассмотрены основные элементы управления кодеком. Остальные параметры подбирайте по их названиям и вариантам значений с учётом требований проекта.

<!-- source-page: 13; block: en-0121 -->

### 3.4 Настройка ACodec RV1106B/RV1103B из пользовательского пространства

<!-- source-page: 13; block: en-0122 -->

Для вывода элементов управления ACodec RV1106B/RV1103B также используется rk_mpi_amix_test:

<!-- source-page: 13; block: en-0123 -->

```text
# rk_mpi_amix_test --list_contents
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
Number of controls: 54
ctl     type    num     name                                    value
0       ENUM    1       SAI Transmit Start Mode Sel             , StandaloneChained
1       ENUM    1       SAI Receive Start Mode Sel              , StandaloneChained
2       ENUM    1       SAI Transmit SDOx Select                , AutoSDOx1SDOx2SDOx3SDOx4
3       ENUM    1       SAI Receive SDIx Select                 , AutoSDIx1SDIx2SDIx3SDIx4
4       INT     1       SAI Receive Mono Slot Select            0 (range 0->128)
5       ENUM    1       SAI Receive Mono Switch                 , DisableEnable
6       ENUM    1       SAI Transmit Mono Switch                , DisableEnable
7       ENUM    1       SAI SDI3 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
8       ENUM    1       SAI SDI2 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
9       ENUM    1       SAI SDI1 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
10      ENUM    1       SAI SDI0 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
11      ENUM    1       SAI SDI3 Loopback I2S LR Switch         , DisableEnable
12      ENUM    1       SAI SDI2 Loopback I2S LR Switch         , DisableEnable
13      ENUM    1       SAI SDI1 Loopback I2S LR Switch         , DisableEnable
14      ENUM    1       SAI SDI0 Loopback I2S LR Switch         , DisableEnable
15      ENUM    1       SAI SDI3 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
16      ENUM    1       SAI SDI2 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
17      ENUM    1       SAI SDI1 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
18      ENUM    1       SAI SDI0 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
19      ENUM    1       SAI SDI3 Loopback Switch                , DisableEnable
20      ENUM    1       SAI SDI2 Loopback Switch                , DisableEnable
21      ENUM    1       SAI SDI1 Loopback Switch                , DisableEnable
22      ENUM    1       SAI SDI0 Loopback Switch                , DisableEnable
23      ENUM    1       SAI Sync Out Switch                     , From CRUFrom IO
24      ENUM    1       SAI Sync In Switch                      , From IOFrom Sync Port
25      ENUM    1       SAI Receive PATH3 Source Select         From SDI0From SDI1From SDI2, From SDI3
26      ENUM    1       SAI Receive PATH2 Source Select         From SDI0From SDI1, From SDI2From SDI3
27      ENUM    1       SAI Receive PATH1 Source Select         From SDI0, From SDI1From SDI2From SDI3
28      ENUM    1       SAI Receive PATH0 Source Select         , From SDI0From SDI1From SDI2From SDI3
29      ENUM    1       SAI Transmit SDO3 Source Select         From PATH0From PATH1From PATH2, From PATH3
30      ENUM    1       SAI Transmit SDO2 Source Select         From PATH0From PATH1, From PATH2From PATH3
31      ENUM    1       SAI Transmit SDO1 Source Select         From PATH0, From PATH1From PATH2From PATH3
32      ENUM    1       SAI Transmit SDO0 Source Select         , From PATH0From PATH1From PATH2From PATH3
33      BOOL    1       SAI Clk Auto Switch                     Off
34      INT     1       SAI PCM Read Wait Time MS               0 (range 0->10000)
35      INT     1       SAI PCM Write Wait Time MS              0 (range 0->10000)
36      INT     1       ADC MIC Left Gain                       2 (range 0->3)
37      INT     1       ADC ALC Left Volume                     6 (range 0->31)
38      INT     1       ADC Digital Left Volume                 195 (range 0->255)
39      ENUM    1       ADC HPF Cut-off                         , OffOn
40      INT     1       ALC AGC Left Volume                     12 (range 0->31)
41      INT     1       ALC AGC Left Max Volume                 7 (range 0->7)
42      INT     1       ALC AGC Left Min Volume                 0 (range 0->7)
43      ENUM    1       ALC AGC Left Switch                     , OffOn
44      ENUM    1       AGC Left Approximate Sample Rate        , 96KHz48KHz44.1KHz32KHz24KHz16KHz12KHz8KHz
45      ENUM    1       ADC Mode                                , DiffadcLSingadcLDiffadcRSingadcRSingadcLRDiffadcLR
46      ENUM    1       ADC MICBIAS Voltage VREFx0_8VREFx0_825VREFx0_85VREFx0_875, VREFx0_9VREFx0_925VREFx0_95VREFx0_975
47      ENUM    1       ADC Main MICBIAS                        Off, On
48      ENUM    1       ADC MIC Left Switch                     , WorkMute
49      INT     1       DAC LINEOUT Volume                      26 (range 0->30)
50      INT     1       DAC HPMIX Volume                        1 (range 0->2)
51      ENUM    1       DAC Control Manually                    , NoneOffOn
52      ENUM    1       DAC VCM Manually                        , NoneOffOn
53      ENUM    1       Audio Mux Select                        , Path0Path1Path2Path3Path4Path5
```

<!-- source-page: 15; block: en-0126 -->

Поскольку здесь только один вход АЦП, элементы ADC Right удалены, а ADC Left сохранены. Их функции совпадают с RV1106/RV1103. Новый элемент Audio Mux Select переключает соединения SAI между внутренним ACodec и внешними выводами:

<!-- source-page: 15; block: en-0127 -->

```text
53      ENUM    1       Audio Mux Select                        , Path0Path1Path2Path3Path4Path5
```

<!-- source-page: 15; block: en-0128 -->

Для переключения доступны шесть состояний Path:

<!-- source-page: 15; block: en-0129 -->

Path0: воспроизведение только через ACodec Lineout; запись только с ACodec Mic. Значение по умолчанию.

<!-- source-page: 15; block: en-0130 -->

Path1: воспроизведение только через ACodec Lineout; запись только с SAI SDI IO.

<!-- source-page: 15; block: en-0131 -->

Path2: воспроизведение одновременно через ACodec Lineout и SAI SDO IO; запись только с ACodec Mic.

<!-- source-page: 15; block: en-0132 -->

Path3: воспроизведение одновременно через ACodec Lineout и SAI SDO IO; запись только с SAI SDI IO.

<!-- source-page: 15; block: en-0133 -->

Path4: воспроизведение только через SAI SDO IO; запись только с ACodec Mic.

<!-- source-page: 15; block: en-0134 -->

Path5: воспроизведение только через SAI SDO IO; запись только с SAI SDI IO. Предназначено для тестирования, обычно не используется.

<!-- source-page: 15; block: en-0135 -->

После перехода с I2S на SAI конфигурация существенно отличается от RV1106/RV1103. Далее рассматривается цифровой возврат для RV1106B/RV1103B. Из-за единственного АЦП входная линия данных SAI — только SDI0:

<!-- source-page: 15; block: en-0136 -->

```text
10      ENUM    1       SAI SDI0 Loopback I2S LR Channel Sel    , L:MIC R:LPL:LP R:MIC
```

<!-- source-page: 15; block: en-0137 -->

L:MIC R:LP: при цифровом возврате на SDI0 левый канал содержит микрофон, правый — возвращаемый сигнал.

<!-- source-page: 15; block: en-0138 -->

L:LP R:MIC: на SDI0 правый канал содержит микрофон, левый — возвращаемый сигнал.

<!-- source-page: 15; block: en-0139 -->

```text
14      ENUM    1       SAI SDI0 Loopback I2S LR Switch         , DisableEnable
```

<!-- source-page: 16; block: en-0140 -->

Переключатель выбора левого/правого канала SDI0 по умолчанию отключён: данные проходят без изменений. Включите его, когда нужен цифровой возврат.

<!-- source-page: 16; block: en-0141 -->

```text
18      ENUM    1       SAI SDI0 Loopback Src Select            , From SDO0From SDO1From SDO2From SDO3
```

<!-- source-page: 16; block: en-0142 -->

Выбирает выходную линию — источник опорного сигнала для цифрового возврата на SDI0. ACodec RV1106B/RV1103B поддерживает только монофоническую запись и воспроизведение, поэтому здесь доступен только SDO0. Сохраните исходное значение.

<!-- source-page: 16; block: en-0143 -->

```text
22      ENUM    1       SAI SDI0 Loopback Switch                , DisableEnable
```

<!-- source-page: 16; block: en-0144 -->

Включение цифрового возврата на SDI0. По умолчанию отключено; включайте при необходимости.

<!-- source-page: 16; block: en-0145 -->

Полная конфигурация одного микрофонного и одного опорного канала:

<!-- source-page: 16; block: en-0146 -->

```text
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Channel Sel" --value "L:MIC R:LP"
rk_mpi_amix_test --control "SAI SDI0 Loopback Src Select" --value "From SDO0"
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Switch" --value "Enable"
rk_mpi_amix_test --control "SAI SDI0 Loopback Switch" --value "Enable"
```

<!-- source-page: 16; block: en-0147 -->

После включения питания SAI SDI0 Loopback I2S LR Channel Sel и SAI SDI0 Loopback Src Select уже имеют нужные значения. Поэтому обычно достаточно сокращённой последовательности:

<!-- source-page: 16; block: en-0148 -->

```text
rk_mpi_amix_test --control "SAI SDI0 Loopback I2S LR Switch" --value "Enable"
rk_mpi_amix_test --control "SAI SDI0 Loopback Switch" --value "Enable"
```

<!-- source-page: 16; block: en-0149 -->

Пример двухканальной записи RV1106B/RV1103B: слева микрофон, справа цифровой возврат:

<!-- source-page: 16; block: en-0150 -->

![Иллюстрация из оригинала: 3.4 Настройка ACodec RV1106B/RV1103B из пользовательского пространства (p. 16)](assets/en-p016-fig01.png)

<!-- source-page: 16; block: en-0151 -->

### 3.5 Настройка ACodec RV1126B/RV1126BP из пользовательского пространства

<!-- source-page: 16; block: en-0152 -->

В актуальном для исходного руководства SDK ADC0 и ADC1 включены по умолчанию:

<!-- source-page: 17; block: en-0153 -->

```text
commit b69407b9ad1232f35ae108fd8755d962fcdeda84
Author: Xing Zheng <zhengxing@rock-chips.com>
Date:   Tue Jul 1 18:44:24 2025 +0800
    arm64: dts: rockchip: rv1126b-evb: enable both acodec_pmu and acodec for 4ch capture by
default
```

<!-- source-page: 17; block: en-0154 -->

Проверьте наличие следующего изменения в коде вашего проекта, чтобы подтвердить включение:

<!-- source-page: 17; block: en-0155 -->

```text
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
index 1ca72d41c5ab..cf6b5788ea5e 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb2-v10.dtsi
@@ -445,7 +445,6 @@ &rtc {
 };
 &sai2 {
-       rockchip,sai-rx-route = <1 0 2 3>;
        status = "okay";
        /delete-property/ pinctrl-names;
        /delete-property/ pinctrl-0;
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
index eb3879ca4c5f..8ca9b5b9a32c 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb.dtsi
@@ -20,7 +20,7 @@ acodec_sound: acodec-sound {
                rockchip,format = "i2s";
                rockchip,mclk-fs-mapping = <256 1024>;
                rockchip,cpu = <&sai2>;
-               rockchip,codec = <&audio_codec>, <&acdcdig_dsm>;
+               rockchip,codec = <&audio_codec_pmu>, <&audio_codec>, <&acdcdig_dsm>;
        };
        adc-keys {
diff --git a/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi b/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
index 31faaa3ad88b..da82560304cd 100644
--- a/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
+++ b/arch/arm64/boot/dts/rockchip/rv1126b-evb1-v10.dtsi
@@ -132,6 +132,10 @@ &acodec_sound {
        status = "okay";
 };
+&audio_codec_pmu {
+       status = "okay";
+};
+
 &audio_codec {
        status = "okay";
 };
```

<!-- source-page: 18; block: en-0157 -->

Типичный список элементов управления звуковой карты по умолчанию:

<!-- source-page: 18; block: en-0158 -->

```text
# rk_mpi_amix_test --list_contents 1
cmd parse result:
sound control id      : 0
control name          : (null)
control value         : (null)
list controls         : 0
list contents         : 1
ctl     type    num     name                            value
0       BOOL    1       Headphone Switch                1
1       BOOL    1       ACodec ADC Switch               0
2       INTE    1       ACodec Digital Gain Volume      0(0->127)
3       ENUM    1       ACodec HPF Cutoff               ,"3.79Hz" "60Hz" "243Hz" "493Hz"
4       BOOL    1       ACodec HPF Switch               0
5       INTE    1       ACodec PGA Gain Volume          16(0->31)
6       BOOL    1       ACodec_LP ADC Switch            0
7       INTE    1       ACodec_LP Digital Gain Volume   0(0->127)
8       ENUM    1       ACodec_LP HPF Cutoff            ,"3.79Hz" "60Hz" "243Hz" "493Hz"
9       BOOL    1       ACodec_LP HPF Switch            0
10      INTE    1       ACodec_LP PGA Gain Volume       16(0->31)
11      INTE    2       DAC Digital Volume              255(0->510) 255(0->510)
12      ENUM    1       DAC HPF Cutoff                  ,"80Hz" "100Hz" "120Hz" "140Hz"
13      BOOL    1       DAC HPF Switch                  0
14      BOOL    1       Headset Mic Switch              1
15      BOOL    1       Main Mic Switch                 1
16      ENUM    1       Power Amplifier                 ,"Off" "On"
17      BOOL    1       SAI2 Clk Auto Switch            0
18      INTE    1       SAI2 Receive Mono Slot Select   0(0->128)
19      ENUM    1       SAI2 Receive Mono Switch        ,"Disable" "Enable"
20      ENUM    1       SAI2 Receive PATH0 Source Sele  ,"From SDI0" "From SDI1" "From SDI2" "From SDI3"
21      ENUM    1       SAI2 Receive PATH1 Source Sele  "From SDI0" ,"From SDI1" "From SDI2" "From SDI3"
22      ENUM    1       SAI2 Receive PATH2 Source Sele  "From SDI0" "From SDI1" ,"From SDI2" "From SDI3"
23      ENUM    1       SAI2 Receive PATH3 Source Sele  "From SDI0" "From SDI1" "From SDI2" ,"From SDI3"
24      ENUM    1       SAI2 Receive SDIx Select        ,"Auto" "SDIx1" "SDIx2" "SDIx3" "SDIx4"
25      ENUM    1       SAI2 Receive Start Mode Sel     ,"Standalone" "Chained"
26      ENUM    1       SAI2 SDI0 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
27      ENUM    1       SAI2 SDI0 Loopback I2S LR Swit  ,"Disable" "Enable"
28      ENUM    1       SAI2 SDI0 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
29      ENUM    1       SAI2 SDI0 Loopback Switch       ,"Disable" "Enable"
30      ENUM    1       SAI2 SDI1 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
31      ENUM    1       SAI2 SDI1 Loopback I2S LR Swit  ,"Disable" "Enable"
32      ENUM    1       SAI2 SDI1 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
33      ENUM    1       SAI2 SDI1 Loopback Switch       ,"Disable" "Enable"
34      ENUM    1       SAI2 SDI2 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
35      ENUM    1       SAI2 SDI2 Loopback I2S LR Swit  ,"Disable" "Enable"
36      ENUM    1       SAI2 SDI2 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
37      ENUM    1       SAI2 SDI2 Loopback Switch       ,"Disable" "Enable"
38      ENUM    1       SAI2 SDI3 Loopback I2S LR Chan  ,"L:MIC R:LP" "L:LP R:MIC"
39      ENUM    1       SAI2 SDI3 Loopback I2S LR Swit  ,"Disable" "Enable"
40      ENUM    1       SAI2 SDI3 Loopback Src Select   ,"From SDO0" "From SDO1" "From SDO2" "From SDO3"
41      ENUM    1       SAI2 SDI3 Loopback Switch       ,"Disable" "Enable"
42      ENUM    1       SAI2 Sync In Switch             ,"From IO" "From Sync Port"
43      ENUM    1       SAI2 Sync Out Switch            ,"From CRU" "From IO"
44      ENUM    1       SAI2 Transmit Mono Switch       ,"Disable" "Enable"
45      ENUM    1       SAI2 Transmit SDO0 Source Sele  ,"From PATH0" "From PATH1" "From PATH2" "From PATH3"
46      ENUM    1       SAI2 Transmit SDO1 Source Sele  "From PATH0" ,"From PATH1" "From PATH2" "From PATH3"
47      ENUM    1       SAI2 Transmit SDO2 Source Sele  "From PATH0" "From PATH1" ,"From PATH2" "From PATH3"
48      ENUM    1       SAI2 Transmit SDO3 Source Sele  "From PATH0" "From PATH1" "From PATH2" ,"From PATH3"
49      ENUM    1       SAI2 Transmit SDOx Select       ,"Auto" "SDOx1" "SDOx2" "SDOx3" "SDOx4"
50      ENUM    1       SAI2 Transmit Start Mode Sel    ,"Standalone" "Chained"
51      BOOL    1       Speaker Switch                  1
52      BOOL    1       hp switch                       0
53      BOOL    1       spk switch                      0
54      INTE    1       SAI2 PCM Read Wait Time MS      0(0->10000)
55      INTE    1       SAI2 PCM Write Wait Time MS     0(0->10000)
```

<!-- source-page: 19; block: en-0160 -->

ADC0 и ADC1 RV1126B занимают отдельные линии I2S — SDI0 и SDI1. На каждой линии при записи поступают два одинаковых канала: левый и правый SDI0 содержат MIC0 с ADC0, а оба канала SDI1 — MIC1 с ADC1.

<!-- source-page: 19; block: en-0161 -->

Поэтому и для одного, и для двух микрофонов рекомендуется включать цифровой возврат на SDI0 и SDI1:

<!-- source-page: 19; block: en-0162 -->

```text
rk_mpi_amix_test --control 'SAI2 SDI0 Loopback I2S LR Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI0 Loopback Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI1 Loopback I2S LR Switch' --value 'Enable'
rk_mpi_amix_test --control 'SAI2 SDI1 Loopback Switch' --value 'Enable'
```

<!-- source-page: 19; block: en-0163 -->

Тогда цифровые данные воспроизведения, по умолчанию передаваемые через SAI2 SDO0, доступны в правых каналах SDI0 и SDI1.

<!-- source-page: 19; block: en-0164 -->

Для типовой схемы «2 микрофонных + 1 опорный канал» RV1126B по умолчанию использует полный стек alsa-lib и поддерживает asound.conf. Этот файл необходимо разместить в /etc:

<!-- source-page: 19; block: en-0165 -->

```text
# Copyright (c) 2025 Rockchip Electronics Co. Ltd.
# Author: Xing Zheng <zhengxing@rock-chips.com>
pcm.!default {
    type asym
    playback.pcm "play_plug"
    capture.pcm "capt_softvol"
}
ctl.!default {
    type hw
    card 0
}
# ---------- Capture ----------
pcm.cap_multi {
    type multi
    slaves.a.pcm "hw:0,0"
    slaves.a.channels 4
    bindings.0.slave a
    bindings.0.channel 0
    bindings.1.slave a
    bindings.1.channel 2
    bindings.2.slave a
    bindings.2.channel 1
}
pcm.capt_plug {
    type plug
    slave.pcm "cap_multi"
}
pcm.capt_softvol {
    type softvol
    slave.pcm "capt_plug"
    control.name "Master Capture Volume"
    control.card 0
    min_dB -51.0
    max_dB 0.0
    resolution 101
}
# ---------- Playback ----------
pcm.play_softvol {
    type softvol
    slave.pcm "hw:0,0"
    control.name "Master Playback Volume"
    control.card 0
    min_dB -51.0
    max_dB 0.0
    resolution 101
}
pcm.play_plug {
    type plug
    slave.pcm "play_softvol"
}
```

<!-- source-page: 21; block: en-0168 -->

На стороне приложения измените test_mpi_ai.cpp, как показано ниже: задайте битовые маски Rec 2ch и Ref 1ch для трёхканальной записи.

<!-- source-page: 21; block: en-0169 -->

```text
diff --git a/src/tests/rt_mpi/mod/test_mpi_ai.cpp b/src/tests/rt_mpi/mod/test_mpi_ai.cpp
index 682467c03..798907c0d 100644
--- a/src/tests/rt_mpi/mod/test_mpi_ai.cpp
+++ b/src/tests/rt_mpi/mod/test_mpi_ai.cpp
@@ -757,9 +760,13 @@ RK_S32 test_init_ai_vqe(TEST_AI_CTX_S *params) {
     stAiVqeConfig.s32WorkSampleRate = params->s32SampleRate;
     stAiVqeConfig.s32FrameSample = params->s32SampleRate * params->s32VqeGapMs / 1000;
+    /* FIXME: for capture with more channel */
     if (params->s32DeviceChannel == 4) {
         stAiVqeConfig.s64RefChannelType = 0x0c;
         stAiVqeConfig.s64RecChannelType = 0x03;
+    } else if (params->s32DeviceChannel == 3) {
+        stAiVqeConfig.s64RefChannelType = 0x04;
+        stAiVqeConfig.s64RecChannelType = 0x03;
     } else {
         stAiVqeConfig.s64RefChannelType = 0x02;
         stAiVqeConfig.s64RecChannelType = 0x01;
```

<!-- source-page: 21; block: en-0170 -->

Запустите трёхканальную запись rk_mpi_ai_test, указав default в качестве sound_card_name:

<!-- source-page: 21; block: en-0171 -->

```text
export rt_dump_skv_inout=true
rk_mpi_ai_test --sound_card_name=default --device_rate 8000 --device_ch 3 --out_rate 8000 --out_ch 1 --output /tmp --vqe_enable 1 --vqe_cfg /tmp/config_aivqe.json
```

<!-- source-page: 21; block: en-0172 -->

Ожидаемое расположение MIC0/MIC1/Loopback0 показано ниже на временных и частотных диаграммах трёх каналов.

<!-- source-page: 21; block: en-0173 -->

![Иллюстрация из оригинала: 3.5 Настройка ACodec RV1126B/RV1126BP из пользовательского пространства (p. 21)](assets/en-p021-fig01.png)

<!-- source-page: 22; block: en-0174 -->

## 4. Типовые команды тестирования ACodec

<!-- source-page: 22; block: en-0175 -->

RV1106/RV1103/RV1106B/RV1103B обычно работают с rockit. Ниже приведены базовые примеры вместе с командами этого фреймворка.

<!-- source-page: 22; block: en-0176 -->

### 4.1 Тестирование воспроизведения

<!-- source-page: 22; block: en-0177 -->

Источник — PCM 16 кГц, 2 канала, 16 бит. rk_mpi_ao_test по умолчанию обрабатывает 16-битные данные. Одинаковые device_rate=16000 и input_rate=16000 означают, что ресемплинг не нужен. Значение input_ch=2 должно соответствовать двум каналам исходного сигнала:

<!-- source-page: 22; block: en-0178 -->

```text
rk_mpi_ao_test -i /tmp/sine_16k_500_1000_0dbfs.wav --sound_card_name=hw:0,0 --device_ch=2 --device_rate=16000 --input_rate=16000 --input_ch=2
```

<!-- source-page: 22; block: en-0179 -->

Файл sine_16k_500_1000_0dbfs.wav доступен по адресу https://redmine.rock-chips.com/attachments/2297743.

<!-- source-page: 22; block: en-0180 -->

Другие параметры команд описаны в документах MPI каталога SDK Rockit и примерах тестирования в mpi example.

<!-- source-page: 22; block: en-0181 -->

### 4.2 Тестирование записи

<!-- source-page: 22; block: en-0182 -->

Пример записи PCM 16 кГц, 2 канала, 16 бит. rk_mpi_ai_test также использует 16 бит по умолчанию. Одинаковые device_rate=16000 и input_rate=16000 отключают необходимость ресемплинга; device_ch=2 и input_ch=2 означают, что преобразование числа каналов не требуется. Результат — cap_out.pcm в каталоге /tmp.

<!-- source-page: 22; block: en-0183 -->

```text
rk_mpi_ai_test --sound_card_name=hw:0,0 --device_rate=16000 --device_ch=2 --out_rate=16000 --out_ch=2 --output=/tmp
```

<!-- source-page: 22; block: en-0184 -->

Дополнительные параметры см. в разделе отладки AO/AI документа Rockchip_Developer_Guide_MPI_FAQ.pdf.
