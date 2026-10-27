---
title: "Руководство по разработке тестов Rockchip Linux PCBA"
description: "Руководство по разработке тестов Rockchip Linux PCBA — V1.2.0"
excerpt: "Руководство по разработке тестов Rockchip Linux PCBA"
translation_key: "197-rockchip-linux-pcba"
slug: "197-rockchip-linux-pcba"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, PCBA, Buildroot]
---

{% raw %}

# Руководство по разработке тестов Rockchip Linux PCBA

Основа — китайский и английский документы Profile RK-KF-YF-301 V1.2.0 от 2025-12-13; техническая основа — китайский текст. Сопоставлен также английский ApplicationNote V1.1.2 от 2021-07-30. Сохранены технические главы, протоколы, параметры, код и снимки; старые процедуры отмечены отдельно. Для ArmSoM проверяйте конкретную плату, SoC, SDK/BSP и периферию. Тесты, запись прошивки и команды устройства не выполнялись. В процедуре recovery wipe_all форматирует userdata, а не просто перезагружает устройство.

Таблица источника: RK3328, RK3326, RK3358, PX30, RK3229, PX3-SE, RK3399, RK3288 и другие платформы Linux; инструмент V1.7.

## 1. Инструмент PCBA

### 1.1 Обзор

Инструмент PCBA выполняет функциональные испытания (FCT) при производстве, позволяя быстро проверить функции изделия и повысить производительность линии. Он разработан для Windows и работает только в Windows; совместно с программами на устройстве проверяет работоспособность и качество нужных функций и компонентов. Предусмотрены тесты SD, Wi-Fi, Bluetooth, DDR, кольцевого микрофона, USB host, светодиодов, воспроизведения, записи, кнопок, PDM Mic, Audio Line In, SPDIF IN/OUT; перечень расширяемый. SD, Wi-Fi, Bluetooth, DDR, кольцевой микрофон и USB host относятся к автоматическим тестам: результат PASS/FAIL выдаётся без вмешательства оператора. Для LED, воспроизведения, записи, кнопок, PDM Mic, Audio Line In и SPDIF IN/OUT оператор сам оценивает результат и выбирает прохождение либо отказ.

### 1.2 Установка

Запустите PCBATool_Setup_xxxx.exe. После установки в выбранном каталоге появятся исполняемый файл, конфигурации, вспомогательные программы и библиотеки.

![Руководство по разработке тестов Rockchip Linux PCBA — en 6](/docs/rockchip-linux-pcba/assets/en-p006-figure-01.png)

Рисунок 1-1. Установка PCBA Tool. CamData предназначен для сохранения отдельных кадров камеры в BMP; сейчас не используется. Language содержит языковые конфигурации. Log содержит журналы тестирования для последующей диагностики. Config.ini хранит параметры инструмента, язык и прочие настройки. Для собственного каталога установки используйте путь только с английскими символами, чтобы избежать сбоев ADB из-за неанглийского пути.

### 1.3 Интерфейс инструмента

На рисунке 1-2 показано главное окно PCBA Tool.

![Руководство по разработке тестов Rockchip Linux PCBA — en 7](/docs/rockchip-linux-pcba/assets/en-p007-figure-01.png)

Рисунок 1-2. Интерфейс PCBA Tool состоит из четырёх областей. Область 1 показывает имя устройства и MAC после начала теста, позволяет загрузить подготовленную конфигурацию, настроить тесты, запускать/останавливать их и вручную выбирать PASS/FAIL. Область 2 показывает категории и результаты тестов. Область 3 выводит ход и результаты отдельных тестов. Область 4 показывает подключение устройства и итог: зелёный значок означает доступное ADB-устройство, оранжевый — недоступное; после завершения здесь появляется результат.

### 1.4 Настройка тестов

Нажмите «...» у загрузки тестов или F2, чтобы открыть окно выбора конфигурации (рисунок 1-3). Выберите JSON и нажмите Open. Тесты появятся в списке с типом auto или manual согласно конфигурации. Исходник ссылается на область 3, хотя ранее список отнесён к области 2. Пример JSON показан на рисунке 1-4.

```text
{
    "meta": {
        "version": "1.0",
        "author": "rockchip_dep3",
```

```text
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},

"test_groups": [
    {
        "test_item": "ddr_test",
        "test_bin_name": "echo_ddr_test",
        "name": "DDR Test",
        "test_type": "auto",
        "description": "",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "emmc_test",
        "test_bin_name": "echo_emmc_test",
        "name": "EMMC Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "rtc_test",
        "test_bin_name": "echo_rtc_test",
        "name": "RTC Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },

    {
        "test_item": "wifi_test",
        "test_bin_name": "echo_wlan_test",
        "name": "WIFI Test",
        "description":"",
        "test_type": "auto",
        "enable": 0,
        "is_loop_test":false,
        "is_first": false,
        "is_last": false,
        "is_check_sn": false
    },
```

```text
{
    "test_item": "bt_test",
    "test_bin_name": "echo_bt_test",
    "name": "BT Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "camera_test",
    "test_bin_name": "echo_camera_test",
    "name": "Camera Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "usbhost_test",
    "test_bin_name": "echo_usbhost_test",
    "name": "U-disk Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "sdcard_test",
    "test_bin_name": "echo_sdcard_test",
    "name": "SD-card Test",
    "description":"",
    "test_type": "auto",
    "enable": 0,
    "is_loop_test":false,
    "is_first": false,
    "is_last": false,
    "is_check_sn": false
},

{
    "test_item": "audio_play_test",
    "test_bin_name": "echo_audio_play_test",
```

```text
            "name": "Audio Playback Test",
            "description":"",
            "test_type": "manual",
            "enable": 0,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },

        {
            "test_item": "audio_record_test",
            "test_bin_name": "echo_audio_record_test",
            "name": "Recording Playback Test",
            "description":"",
            "test_type": "manual",
            "enable": 0,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },

        {
            "test_item": "key_test",
            "test_bin_name": "echo_key_test",
            "name": "Key Test",
            "description":"",
            "test_type": "manual",
            "enable": 1,
            "is_loop_test":false,
            "is_first": false,
            "is_last": false,
            "is_check_sn": false
        },
    },

    "mes_config": {
        "use_mes": false,
        "product":"RM1820SA0",
        "station":"FT1",
        "station_ip":"10.58.9.21",
        "note": "url_path1 use for actual production",
        "url_path1":
"http://rjiot.ruijie.com.cn/api/services/app/RuiJieATE/EquipmentUniversalPort",
        "note2": "url_path2 just use for test, don't use for production",
        "url_path2":
"http://10.60.5.223:8080/api/services/app/RuiJieATE/EquipmentUniversalPPort",
        "is_test": true,
        "ftp_server":"10.60.5.224",
        "ftp_port":"21",
        "username":"",
        "password":""

    }
}
```

Пример JSON состоит из трёх разделов. meta: version — версия, author — автор, description — описание, needreboot — необходимость перезагрузки после тестов. test_group: test_item — программный идентификатор теста; test_bin_name — исполняемый файл на плате, работающий совместно с инструментом ПК; name — название; description — описание; test_type — manual или auto. Для manual оператор выбирает результат кнопкой, для auto инструмент определяет его сам. Поля is_loop_test, is_first, is_last, is_check_sn предназначены для настройки; если не используются, задайте false. mes_config задаёт MES-сервер для загрузки результатов в облако; при неиспользовании установите use_mes=false, при доработке меняйте по необходимости. Общие тесты: SD, кнопки, Wi-Fi, Bluetooth, воспроизведение, запись, USB host, RTC, камера; список будет расширяться. Для RK3308 предусмотрены SD, Wi-Fi, Bluetooth, DDR, кольцевой микрофон, USB host, LED, воспроизведение, запись, кнопки, PDM Mic, Audio Line In, SPDIF IN/OUT и будущие расширения. Для других чипов Rockchip выбирайте тесты по требованиям и аппаратуре платы.

![Руководство по разработке тестов Rockchip Linux PCBA — en 12](/docs/rockchip-linux-pcba/assets/en-p012-figure-01.png)

Рисунок 1-3. Выбор тестов PCBA

![Руководство по разработке тестов Rockchip Linux PCBA — en 13](/docs/rockchip-linux-pcba/assets/en-p013-figure-01.png)

Рисунок 1-4. Конфигурация PCBA готова

#### 1.4.1 Описание тестов

1. Wi-Fi — автоматический тест: устройство сканирует ближайшие точки доступа и оценивает успех по результату сканирования.

2. Bluetooth — автоматический тест. Старые платформы выключают Bluetooth, повторно включают и активируют после загрузки прошивки. Новые пропускают выключение/включение, поскольку прошивка загружается при старте. Успех определяется наличием работающего hci0 и аппаратного адреса Bluetooth.

3. DDR — автоматический тест: считывается ёмкость DDR, правильность чтения определяет результат.

4. EMMC — автоматический тест: считывается ёмкость EMMC, правильность чтения определяет результат.

5. RTC — автоматический тест: задаётся фиксированное системное время, процесс засыпает на заданный интервал, затем время считывается. Если разность совпадает с интервалом, тест пройден; иначе — отказ.

6. SD — автоматический тест. Скрипт ожидает вставленную карту и проверяет узел устройства. При обнаружении карта монтируется в заданный каталог и записывается её ёмкость. Если узла нет в течение 60 секунд, выводится ошибка и тест завершается.

7. USB host — автоматический тест. После подключения USB-устройства скрипт проверяет его узел, монтирует в заданный каталог и сохраняет ёмкость. Если узел не обнаружен за 60 секунд, тест завершается с ошибкой.

8. CAMERA — автоматический тест: v4l2_capture.sh находит доступные камеры и снимает кадр, предпочтительно в JPG. photo_check.sh проверяет корректность формата сохранённого изображения и определяет результат.

9. LED — ручной тест. По очереди загораются красный, зелёный, синий и белый (смесь трёх цветов). Оператор оценивает правильность каждого цвета и нажимает Pass или Fail для перехода далее.

10. Воспроизведение — ручной тест: устройство проигрывает аудиоданные из заданного места. По качеству звука выберите Pass или Fail для перехода далее.

11. Запись — ручной тест: устройство последовательно записывает фрагмент с текущего микрофона и воспроизводит его. Оператор оценивает качество и выбирает Pass или Fail.

12. Кнопки — ручной тест. Нажимайте физические кнопки; инструмент сообщает распознанную кнопку. После нажатия всех тестируемых кнопок платы появляется уведомление. Оно подтверждает успешный обход; иначе тест не пройден. Окончательный результат оператор задаёт кнопкой Pass или Fail.

13. PDM Mic — ручная проверка микрофона: оцените воспроизводимый звук и выберите Pass или Fail.

14. Audio Line In — ручной тест: подключите линейный аудиовход и воспроизведите музыку. Оцените звук динамика, затем выберите Pass или Fail.

15. SPDIF IN/OUT — ручной тест.

#### 1.4.2 Порядок тестирования

Шаг 1: установите и запустите PCBA Tool. Зелёный значок справа внизу означает найденное подключённое ADB-устройство; оранжевый — устройство недоступно. Шаг 2: нажмите [...] рядом с Load Test Items или F2, выберите конфигурационный JSON и нажмите Open. В главном окне появятся предстоящие тесты.

Шаг 3: после Start Testing одновременно запускаются все автоматические и первый ручной тест. Для автоматических тестов не нажимайте Pass/Fail. См. рисунок 1-5.

![Руководство по разработке тестов Rockchip Linux PCBA — en 15](/docs/rockchip-linux-pcba/assets/en-p015-figure-01.png)

Рисунок 1-5. Начало тестирования. Шаг 4: ручные тесты выполняются по одному. После каждого выберите Pass или Fail, чтобы завершить его и перейти далее. Для кнопочного теста окно сообщений показывает имя кнопки, заданное программой устройства, и после завершения появляется уведомление; остальные ручные результаты оценивает оператор.

![Руководство по разработке тестов Rockchip Linux PCBA — en 16](/docs/rockchip-linux-pcba/assets/en-p016-figure-01.png)

Рисунок 1-6. Кнопочный тест

#### 1.4.3 Камера: историческая функция кнопки

Историческое описание отдельной кнопки камеры: поддержка зависит от платформы. PCBA Tool отключает и окрашивает кнопку Camera Test серым, если платформа её не поддерживает; тогда раздел пропускается. При поддержке кнопка активна.

![Руководство по разработке тестов Rockchip Linux PCBA — en 16](/docs/rockchip-linux-pcba/assets/en-p016-figure-02.png)

Dev_Plateform в Config.ini задаёт платформу. Без значения кнопка камеры может отображаться активной, но на неподдерживаемой платформе нажатие вызывает ошибку. V4l2_test захватывает один кадр и сохраняет его; исходники: ./external/rk_pcba_test/camera_api. nv12_to_bmp_main преобразует сохранённый NV12 в BMP для отображения инструментом ПК; требуется статическая библиотека libyuv.a, исходники ./external/libyuv.

#### 1.4.4 Перезагрузка

В разделе meta конфигурации параметр needreboot управляет перезагрузкой.

```text
"meta": {
    "version": "1.0",
    "author": "rockchip_dep3",
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},
```

В системе с двумя rootfs, например A/B, system_a по умолчанию предназначена для pcba_rootfs.img, system_b — для обычной системной прошивки. При включённой опции и успешном прохождении всех тестов выполняется перезагрузка в обычную систему. На платформах с одной системой после перезагрузки снова запускается rootfs PCBA.

### 1.5 Руководство по доработке

Для расширения PCBA Tool добавьте собственные тесты по следующим шагам.

#### 1.5.1 Процесс разработки

Установите VS2022: выберите разработку классических приложений C++ и компонент C++ MFC для инструментов v143, как показано на рисунке 1-8.

![Руководство по разработке тестов Rockchip Linux PCBA — en 17](/docs/rockchip-linux-pcba/assets/en-p017-figure-01.png)

Рисунок 1-8. Среда разработки PCBA. Откройте проект; в представлении ресурсов добавьте CheckBox для нового теста в IDD_SETTING_DIALOG, задайте его ID и подпись.

В SettingBase.h добавьте строковую переменную теста и булеву переменную выбора в класс CIniSettingBase.

![Руководство по разработке тестов Rockchip Linux PCBA — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-01.png)

![Руководство по разработке тестов Rockchip Linux PCBA — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-02.png)

Рисунок 1-8. Переменные имени и выбора теста. В LoadToolSetting файла SettingBase.cpp добавьте их инициализацию по образцу остальных тестов.

![Руководство по разработке тестов Rockchip Linux PCBA — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-03.png)

![Руководство по разработке тестов Rockchip Linux PCBA — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-04.png)

Рисунок 1-9. Инициализация переменных. В Config.ini добавьте имя теста и состояние выбора по умолчанию. Для SD: SdcardName хранит имя echo_sdcard_test, исполняемого на плате; SdcardTest=0 означает не выбран, 1 — выбран. Код разбирает обе переменные.

![Руководство по разработке тестов Rockchip Linux PCBA — en 18](/docs/rockchip-linux-pcba/assets/en-p018-figure-05.png)

Рисунок 1-10. Переменные config.ini. Добавьте подписи теста в Chinese.ini и English.ini. По примеру SD: [DIALOG_129] соответствует ID ресурса IDD_SETTING_DIALOG, BUTTON_1010 — ID SD-теста; текст после знака равенства отображается на кнопке.

ID диалога или флажка можно узнать из resource.h проекта VS. echo_sdcard_test должен совпадать со SdcardName в config.ini; текст после равенства отображается в списке тестов.

![Руководство по разработке тестов Rockchip Linux PCBA — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-01.png)

![Руководство по разработке тестов Rockchip Linux PCBA — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-02.png)

Рисунок 1-11. Переменные Chinese.ini. Добавьте интерфейсы нового теста в PcbaTest.cpp и PcbaTest.h.

![Руководство по разработке тестов Rockchip Linux PCBA — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-03.png)

![Руководство по разработке тестов Rockchip Linux PCBA — en 19](/docs/rockchip-linux-pcba/assets/en-p019-figure-04.png)

Рисунок 1-12. Интерфейсы теста. В initTestCase файла IPSearchDlg.cpp добавьте выбор нового теста по образцу других. Пример:

```text
if (m_Configs.bCpuTest) {
TestCase.TestName = m_Configs.strCpuTest;
TestCase.bAuto = true;
TestCase.bTestLoop = true;
TestCase.nTestStatus = TEST_UNDO;
m_TestCaseList.push_back(TestCase);
}
```

В DoTestItem добавьте выбор и выполнение нового теста по образцу других. Пример:

```text
else if (strTestName.compare(m_Configs.strCpuTest) == 0)
{
 ret = m_DevTest.CpuTest(m_TestSocket, wstr2str(strTestName));
}
```

Структура TestCase определена следующим образом:

![Руководство по разработке тестов Rockchip Linux PCBA — en 20](/docs/rockchip-linux-pcba/assets/en-p020-figure-01.png)

Рисунок 1-13. Структура теста. В ConfigDlg.cpp добавьте получение состояния флажка в BOOL CConfigDlg::OnInitDialog(). Пример:

```text
((CButton*)GetDlgItem(IDC_CHECK_CPU))->SetCheck(m_Configs.bCpuTest  ?BST_CHECKED:
BST_UNCHECKED);
```

В Void CConfigDlg::OnBnClickedBtnOk() добавьте установку выбора теста по умолчанию. Пример:

```text
m_Configs.bCpuTest       = (((CButton*)GetDlgItem(IDC_CHECK_CPU))->GetCheck() ==
BST_CHECKED);
```

После успешной сборки добавление завершено. Запустите инструмент в DEBUG, используйте точки останова и трассировку, чтобы проверить новый тест.

#### 1.5.2 Упаковка и выпуск

Установите Inno Setup — небольшую бесплатную программу упаковки для Windows. Исходник ссылается на страницу загрузки Inno Setup. Каталог упаковки: PCBATool_package.

PCBATool_package содержит собранную программу PCBA, выпускаемые ini-конфигурации, языковые файлы и используемые DLL. Откройте pcbatool_setup.iss — конфигурацию Inno Setup, измените сведения APP и выполните Run/F9. Установочный пакет появится в каталоге output на одном уровне с PCBATool_package. Одновременно запустится установка; отмените её, если она не нужна.

![Руководство по разработке тестов Rockchip Linux PCBA — en 21](/docs/rockchip-linux-pcba/assets/en-p021-figure-01.png)

Рисунок 1-14. Каталог PCBATool_package

![Руководство по разработке тестов Rockchip Linux PCBA — en 21](/docs/rockchip-linux-pcba/assets/en-p021-figure-02.png)

Рисунок 1-15. Настройка упаковки в Inno Setup

### 1.6 Получение исходников

Для доработки инструмента исходники можно получить через FAE. Адрес исходного кода:

```text
git clone ssh://10.10.10.29:29418/linux/rk_pcba_tool
```

## 2. Проектирование ПО PCBA

### 2.1 Структурная схема

![Руководство по разработке тестов Rockchip Linux PCBA — en 22](/docs/rockchip-linux-pcba/assets/en-p022-figure-01.png)

Рисунок 2-1. Структурная схема PCBA

1. Инструмент обменивается данными с устройством через ADB.

2. Каждый тест — отдельный процесс, не влияющий на другие.

### 2.2 Процесс

![Руководство по разработке тестов Rockchip Linux PCBA — en 23](/docs/rockchip-linux-pcba/assets/en-p023-figure-01.png)

Рисунок 2-2. Процесс тестирования PCBA

### 2.3 Формат команд и протокола

ПК и устройство используют сокет поверх ADB. Команда:

```text
Command:<TYPE><TEST_ITEM><CMD><MSG>
Response:<TYPE><TEST_ITEM><RES><MSG><STATUS><RESULT><ERR_CODE>
```

### 2-1 Command

| Поле/значение | Значение |
| --- | --- |
| `TYPE` | Тип (заголовок источника: TPYE) |
| `TEST_ITEM` | Имя теста |
| `CMD` | Команда |
| `MSG` | Дополнительные данные |

### 2-2 Response

| Поле/значение | Значение |
| --- | --- |
| `TYPE` | Тип (заголовок источника: TPYE) |
| `TEST_ITEM` | Имя теста |
| `RES` | Команда ответа |
| `MSG` | Дополнительные данные |
| `STATUS` | Состояние |
| `RESULT` | Результат теста |
| `ERR_CODE` | Код ошибки |

### 2-3 TYPE

| Поле/значение | Значение |
| --- | --- |
| `CMD` | ПК отправляет команду устройству |
| `RES` | Устройство отвечает ПК |

### 2-4 TEST_ITEM

| Поле/значение | Значение |
| --- | --- |
| `KEY_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `SDCard_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `AUDIO_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `HDMI_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `CAMERA_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `USB_HOST_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `LED_test` | Конкретный тест; имя совпадает с программой; расширяемый список |
| `...` | Конкретный тест; имя совпадает с программой; расширяемый список |

### 2-5 CMD/RES

| Поле/значение | Значение |
| --- | --- |
| `ENTER` | Вход в тестовый режим без имени теста |
| `EXIT` | Выход из режима без имени теста |
| `START` | Начать тест |
| `SAVE` | Сохранить результат |
| `QUERY` | Запросить состояние |

### 2-6 MSG

| Поле/значение | Значение |
| --- | --- |
| `msg` | Данные команды или ответа; при отсутствии не передаются |

### 2-7 STATUS

| Поле/значение | Значение |
| --- | --- |
| `ACK` | Успешный ответ; устройство отвечает на каждую команду ПК |
| `NAK` | Ошибка ответа |

### 2-8 RESULT

| Поле/значение | Значение |
| --- | --- |
| `TESTING` | Тест выполняется |
| `PASS` | Пройден |
| `FAIL` | Отказ |
| `VERIFY` | Тест завершён; подтверждение результата |
| `PRESS` | Только кнопочный тест: кнопка нажата |

### 2-9 ERR_CODE

| Поле/значение | Значение |
| --- | --- |
| `err_code` | Причина отказа; 0x01–0xFF; при успехе отсутствует |

1. Вход в режим PCBA Вход:{"TYPE":"CMD", "CMD":"ENTER"} Ответ на вход: Успех: {"TYPE":"RES", "RES":"ENTER", "STATUS":"ACK"} Ошибка: {"TYPE":"RES", "RES":"ENTER", "STATUS":"NAK", "ERR_CODE":"err_code"}

2. Выход из режима PCBA Выход: {"TYPE":"CMD", "CMD":"EXIT"} Ответ на выход: {"TYPE":"RES", "CMD":"EXIT", "STATUS":"ACK"}

{"TYPE":"RES", "RES":"EXIT", "STATUS":"NAK", "ERR_CODE":"err_code"}

3. Пример кнопочного теста; остальные аналогичны Начало теста {"TYPE":"CMD", "TEST_ITEM":"KEY-TEST", "CMD":"START"} Ответ на вход: {"TYPE":"RES", "TEST_ITEM":"KEY-TEST", "RES":"START", "STATUS":"ACK"} {"TYPE":"RES", "TEST_ITEM":"KEY-TEST", "RES":"START", "STATUS":"NAK", "ERR_CODE":"err_code"}

4. Запрос состояния теста {"TYPE":"CMD", "TEST_ITEM":"test_item", "CMD":"QUERY" } Ответ на запрос: Ошибка: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"NAK", "ERR_CODE":"err_code"} Тест выполняется:{"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"TESTING"} Пройден: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"PASS"} Подтверждение результата: {"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"VERIFY"} Отказ:{"TYPE":"RES", "TEST_ITEM":"test_item", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"FAIL", "ERR_CODE":"err_code"} Кнопка нажата: {"TYPE":"RES", "TEST_ITEM":"key_test", "RES":"QUERY", "MSG":"msg", "STATUS":"ACK", "RESULT":"PRESS"}(только для кнопочного теста)

## 3. Архитектура тестового кода

### 3.1 Структура исходников

Тесты PCBA — самостоятельные исполняемые программы на устройстве. Исходник указывает каталог /extenal/rk-pcba-test (написание сохранено); структура приведена ниже.

```text
├── audio_test.h
├── bt_test.h
├── cJSON
│   ├── cJSON.c
│   └── cJSON.h
├── CMakeLists.txt
├── common.c
├── common.h
├── cpu_test.h
```

```text
├── ddr_test.h
├── echo_audio_linein_test.c
├── echo_audio_play_test.c
├── echo_audio_record_test.c
├── echo_audio_test.c
├── echo_auto_test.c
├── echo_bt_test.c
├── echo_camera_test.c
├── echo_cpu_test.c
├── echo_ddr_test.c
├── echo_discovery.c
├── echo_emmc_test.c
├── echo_ir_test.c
├── echo_key_test.c
├── echo_led_test.c
├── echo_pcbatest_server.c
├── echo_ringmic_pdm_test.c
├── echo_ringmic_test.c
├── echo_rotary_test.c
├── echo_rtc_test.c
├── echo_sdcard_test.c
├── echo_touchpad_test.c
├── echo_usbhost_test.c
├── echo_wlan_test.c
├── emmc_test.h
├── key_test.h
├── led_test.h
├── LICENSE
├── mic_test_Linux
│   ├── Makefile
│   ├── record_test.c
│   ├── record_test.h
│   ├── vibrate_test.c
│   └── vibrate_test.h
├── pcba_minui
│   ├── audio_play_test.c
│   ├── audio_play_test.h
│   ├── audio_record_test.c
│   ├── audio_record_test.h
│   ├── bt_test.c
│   ├── bt_test.h
│   ├── common.h
│   ├── ddr_test.c
│   ├── ddr_test.h
│   ├── debug.h
│   ├── emmc_test.c
│   ├── emmc_test.h
│   ├── key_test.c
│   ├── key_test.h
│   ├── Language
│   │   ├── language_cn.h
│   │   ├── language_en.h
│   │   └── language.h
│   ├── list.h
│   ├── minui
│   │   ├── Android.mk
```

```text
│   │   ├── events.c
│   │   ├── font_10x18.h
│   │   ├── graphics_adf.c
│   │   ├── graphics.c
│   │   ├── graphics_drm.c
│   │   ├── graphics_fbdev.c
│   │   ├── graphics.h
│   │   ├── minui.h
│   │   ├── mkfont.c
│   │   └── resources.c
│   ├── minzip
│   │   ├── Android.mk
│   │   ├── Bits.h
│   │   ├── DirUtil.c
│   │   ├── DirUtil.h
│   │   ├── Hash.c
│   │   ├── Hash.h
│   │   ├── inline_magic.h
│   │   ├── Inlines.c
│   │   ├── Log.h
│   │   ├── SysUtil.c
│   │   ├── SysUtil.h
│   │   ├── Zip.c
│   │   └── Zip.h
│   ├── mtdutils
│   │   ├── Android.mk
│   │   ├── flash_image.c
│   │   ├── mounts.c
│   │   ├── mounts.h
│   │   ├── mtdutils.c
│   │   ├── mtdutils.h
│   │   ├── rk29.c
│   │   └── rk29.h
│   ├── pcba_core.c
│   ├── recovery_ui.h
│   ├── res
│   │   └── udisktester.sh
│   ├── rtc_test.c
│   ├── rtc_test.h
│   ├── safe_iop.c
│   ├── safe_iop.h
│   ├── screen_test.c
│   ├── screen_test.h
│   ├── screen_ui.h
│   ├── script.c
│   ├── script.h
│   ├── script_parser.c
│   ├── script_parser.h
│   ├── sdcard_test.c
│   ├── sdcard_test.h
│   ├── strlcat.c
│   ├── strlcpy.c
│   ├── test_case.h
│   ├── touch_test.c
│   ├── udisk_test.c
│   ├── udisk_test.h
```

```text
│   ├── ui.c
│   ├── wlan_test.c
│   └── wlan_test.h
├── pcbatest_server.h
├── rk_pcba_test
│   ├── audio_test_start.wav
│   ├── font.png
│   ├── fw_bcm4339a0_ag.bin
│   ├── photo_check.sh
│   ├── rectest_400hz.wav
│   ├── sdcard_test.sh
│   ├── switch_inoutput.sh
│   ├── test_config.cfg
│   ├── usbhost_test.sh
│   ├── v4l2_capture.sh
│   ├── vibration.wav
│   └── wifi.sh
├── rk_pcba_test_led.h
├── rtc_test.h
├── tinyalsa
│   ├── asoundlib.h
│   ├── pcm.c
│   ├── tinycap.c
│   └── tinyplay.c
└── wlan_test.h
```

### 3.2 Описание архитектуры

При тестировании устройство выступает TCP-сервером, ПК — клиентом. Взаимодействие реализовано главным образом в echo_pcbatest_server.c; его схема показана ниже.

![Руководство по разработке тестов Rockchip Linux PCBA — en 30](/docs/rockchip-linux-pcba/assets/en-p030-figure-01.png)

Рисунок 3-1. Архитектура тестов на устройстве

### 3.3 Создание прошивки

Есть два способа сборки. Первый создаёт отдельный rootfs для PCBA, который записывается в раздел rootfs. После запуска система сразу входит в среду тестирования, и подключённый ПК использует PCBA Tool. Второй включает тесты в recovery: специальная команда PCBA записывается в misc и запускает тестовую программу; после теста команда удаляется и перезагрузка ведёт в обычную систему. При малом объёме памяти удобен первый способ, но rootfs записывается дважды: сначала тестовая, затем обычная прошивка. При достаточной памяти выбирают второй способ; тест

после завершения автоматически перезагружает устройство в обычную систему без повторной записи прошивки.

#### 3.3.1 Отдельная прошивка rootfs

1. Конфигурация PCBA (Buildroot). Если в buildroot/configs/ нет rockchip_rkxxxx_pcba.defconfig для нужного чипа xxxx, создайте её на основе работоспособной rootfs-конфигурации defconfig из этого каталога. Добавьте все модули и параметры тестов. Обязательные основные параметры rockchip_rkxxxx_pcba.defconfig:

```text
#include "base/pcba.config"
```

По требованиям тестирования дополните defconfig. Например, для RK3328 с тестами Wi-Fi, Bluetooth, камеры, воспроизведения, записи и USB-накопителя добавьте следующие параметры или конфигурационные файлы.

```text
#include "fs/vfat.config"
#include "multimedia/audio.config"
#include "multimedia/camera.config"
#include "multimedia/gst/audio.config"
#include "multimedia/gst/camera.config"
#include "multimedia/gst/rtsp.config"
#include "multimedia/gst/video.config"
#include "multimedia/mpp.config"
#include "wifibt/bt.config"
#include "wifibt/wireless.config"
```

![Руководство по разработке тестов Rockchip Linux PCBA — en 32](/docs/rockchip-linux-pcba/assets/en-p032-figure-01.png)

Рисунок 3-2. Конфигурация PCBA в rootfs

2. Проверьте среду сборки Buildroot. Каталог buildroot/package/rockchip/rockchip-pcba/ должен содержать Config.in и rockchip-pcba.mk.

3. Сборка PCBA в Buildroot. После подготовки конфигураций инициализируйте среду в корне SDK:

```text
source envsetup.sh
```

В созданном меню lunch выберите номер конфигурации PCBA нужного чипа и выполните сборку:

```text
make rockchip-pcba
```

После изменения исходников или конфигурации PCBA выполните полную пересборку:

```text
make rockchip-pcba-dirclean
make rockchip-pcba-rebuild
```

4. Создание rootfs.img. Добавьте следующую настройку в конфигурацию платы rockchip_rkxxxx_evb_defconfig:

```text
RK_BUILDROOT_BASE_CFG="rkxxxx_pcba"
```

Затем выполните команду сборки:

```text
./build.sh buildroot
```

Будет создан rootfs.img. Примечания:

1. В buildroot/package/rockchip/partinit/partinit.mk удалите ln -s userdata data. Эта ссылка связывает data с userdata, из-за чего раздел userdata перекрывает программу PCBA. Если ссылка необходима, измените mk-файл PCBA и устанавливайте тесты в другой каталог.

2. Если при сборке появляется следующая ошибка:

```text
processing option: pcba
Skipping build_pcba for missing configs:  RK_CFG_PCBA.
```

Добавьте RK_CFG_PCBA в конфигурацию платы device/rockchip/.Boardconfig.mk для нужной платформы; пример RK3308:

```text
export RK_CFG_PCBA=rockchip_rk3308_pcba
```

Для других платформ аналогично добавьте rockchip_rkxxxx_pcba.

#### 3.3.2 Сборка в recovery

Чтобы записать прошивку один раз и после теста перейти в обычную систему, включите PCBA в recovery. При первой записи misc.img должна содержать специальную команду запуска PCBA (рисунок 3-7); её можно изменить UE или другим шестнадцатеричным редактором. Ниже приведён пример RK3308 EVB. Конфигурация PCBA находится в /buildroot/configs/rockchip/pcba_test.config и показана на рисунке 3-3.

![Руководство по разработке тестов Rockchip Linux PCBA — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-01.png)

Рисунок 3-3. Конфигурация PCBA в recovery. Параметры рассчитаны на RK3308; для других платформ добавьте или удалите настройки согласно аппаратуре и ПО. Конфигурация recovery: buildroot/configs/rockchip_rk3308_recovery_defconfig.

![Руководство по разработке тестов Rockchip Linux PCBA — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-02.png)

Рисунок 3-4. Конфигурация recovery включает настройки PCBA. Выполните в корне проекта:

```text
./build.sh recovery
```

После сборки исполняемые файлы выглядят следующим образом:

![Руководство по разработке тестов Rockchip Linux PCBA — en 34](/docs/rockchip-linux-pcba/assets/en-p034-figure-03.png)

Рисунок 3-5. Результат сборки тестовых программ

Из-за различий аппаратуры адаптируйте тесты в exteral/rk_pcba_test к своей плате. Код SDK рассчитан на RK EVB, поэтому некоторые тесты не подходят пользовательской аппаратуре. После изменения тестов выполните в корне SDK:

```text
make pcba-rebuild
```

Затем ./build.sh recovery создаёт образ в ./buildroot/output/rockchip_rk3308_recovery/images/; исходник пишет ecovery.img. Выполните в корне:

```text
./mkfirmware.sh
```

Прошивки всех разделов формируются в rocketdev/ (написание источника). Запишите recovery.img в раздел recovery. Для других платформ см. соответствующую документацию. Примечания:

1. Файл fstab в /buildroot/board/rockchip/rk3308/fs-overlay-pcba/etc не нужен: он заменяет fstab, созданный partinit, и нарушает работу recovery.

```text
~/3308/buildroot/board/rockchip/rk3308/fs-overlay-pcba/etc $ ls
asound.conf  init.d  inittab  profile.d
```

2. В buildroot/package/rockchip/partinit/partinit.mk удалите ln -s userdata data, иначе раздел userdata перекроет программу PCBA. Если ссылка нужна, измените mk-файл PCBA и устанавливайте программы в другой каталог.

3. Измените buildroot/package/rockchip/pcba/Config.in и pcba.mk следующим образом:

![Руководство по разработке тестов Rockchip Linux PCBA — en 35](/docs/rockchip-linux-pcba/assets/en-p035-figure-01.png)

Рисунок 3-6. Изменение конфигурации и Makefile

Изменение удаляет ссылку data на userdata в recovery; иначе воспроизведение звука после загрузки обычной системы нарушается. Создайте data заново и скопируйте туда программы, собранные в userdata.

4. При тестировании в recovery запишите в misc образ misc.img с командой PCBA.

5. Формат команды PCBA в misc показан на рисунке 3-7.

![Руководство по разработке тестов Rockchip Linux PCBA — en 36](/docs/rockchip-linux-pcba/assets/en-p036-figure-01.png)

Рисунок 3-7. Команда тестирования в misc.img

5. В JSON инструмента PCBA задайте "needreboot": true. После успешного завершения тестов инструмент отправляет сообщение перезагрузки. Устройство удаляет factory_pcba_test из misc и записывает wipe_all: при следующем входе в recovery раздел userdata форматируется, затем загружается обычная система. Ниже конфигурация meta с needreboot.

```text
"meta": {
    "version": "1.0",
    "author": "rockchip_dep3",
    "description": "PCBA Motherboard Functional Testing Configuration",
    "needreboot": true
},
```

6. Измените echo_pcbatest_server.c: после успешного теста перед перезагрузкой в exit_pcba_test_mode добавьте проверку recovery и замену заводской команды на wipe_all в misc. Следующий запуск recovery форматирует пользовательский раздел и переходит в обычную систему.

![Руководство по разработке тестов Rockchip Linux PCBA — en 36](/docs/rockchip-linux-pcba/assets/en-p036-figure-02.png)

Рисунок 3-9. Изменения echo_pcbatest_server.c

7. Возможные проблемы теста записи

При записи более двух каналов, например следующей командой:

```text
arecord -Dhw:0,0 -f S16_LE -r 48000 -c 4 /tmp/record.wav
```

Несмотря на запрос четырёх каналов, результат может содержать только два. Проверьте Buildroot/configs/rockchip/audio.config и отключите BR2_PACKAGE_PULSEAUDIO=y и BR2_PACKAGE_PULSEAUDIO_DAEMON=y.

```text
buildroot/configs$ git diff rockchip
diff --git a/configs/rockchip/audio.config b/configs/rockchip/audio.config
index 8cf1207..f23cb5a 100644
--- a/configs/rockchip/audio.config
+++ b/configs/rockchip/audio.config
@@ -8,8 +8,8 @@ BR2_PACKAGE_ALSA_UTILS_ALSACONF=y
 BR2_PACKAGE_ALSA_UTILS_AMIXER=y
 BR2_PACKAGE_ALSA_UTILS_APLAY=y
 BR2_PACKAGE_LIBMAD=y
-BR2_PACKAGE_PULSEAUDIO=y
-BR2_PACKAGE_PULSEAUDIO_DAEMON=y
+#BR2_PACKAGE_PULSEAUDIO=y
+#BR2_PACKAGE_PULSEAUDIO_DAEMON=y

 # Copy alas configs
 BR2_PACKAGE_ALSA_CONFIG=y
```

## 4. PCBA с экраном

Некоторые платформы RK выводят тесты PCBA и результаты непосредственно на экран, без ПК, аналогично Android PCBA. Далее описан Linux PCBA с экраном на примере PX3-SE; для другой платформы адаптируйте конфигурацию.

### 4.1 Тестовый код

Код тестов и экранного вывода находится в external/rk_pcba_test. Linux использует подход Android: rk_pcba_test/test_config.cfg определяет выполняемые и отображаемые тесты. Подробности см. в примерах модулей этого файла. Для собственного теста используйте пример из rk_pcba_test/pcba_minui как основу

и добавьте готовый код в cMakeList.txt, чтобы включить его в сборку.

### 4.2 Сборка и конфигурация

Конфигурация пакета PCBA в Buildroot: buildroot/package/rockchip/rockchip-pcba/Config.in.

```text
config BR2_PACKAGE_PCBA
    bool "Rockchip pcba test"
    help
      Rockchip pcba test.

if BR2_PACKAGE_PCBA

config BR2_PACKAGE_PCBA_SCREEN
    bool "pcba with screen"
    select BR2_PACKAGE_LIBDRM
    select BR2_PACKAGE_LIBPNG
    select BR2_PACKAGE_LIBPTHREAD_STUBS
    select BR2_PACKAGE_LIBZIP
    help
      Enable screen support for PCBA testing.
      Note: This will automatically enable the required graphics
      libraries (libdrm, libpng, libzip) and threading support.

endif
```

Пакет интегрирует тестовую программу Rockchip PCBA. При BR2_PACKAGE_PCBA_SCREEN автоматически выбираются BR2_PACKAGE_LIBDRM (графический DRM), BR2_PACKAGE_LIBPNG (PNG), BR2_PACKAGE_LIBPTHREAD_STUBS (совместимость POSIX-потоков), BR2_PACKAGE_LIBZIP (ZIP). Далее поясняется buildroot/package/rockchip/rockchip-pcba/rockchip-pcba.mk.

```text
################################################################################
#
# rockchip-pcba project
#
################################################################################

ROCKCHIP_PCBA_SITE = $(TOPDIR)/../external/rk_pcba_test
ROCKCHIP_PCBA_SITE_METHOD = local

ifeq ($(BR2_PACKAGE_PCBA_SCREEN),y)
ROCKCHIP_PCBA_CONF_OPTS = -DROCKCHIP_PCBA_WITH_UI=ON
```

```text
ROCKCHIP_PCBA_DEPENDENCIES = zlib libpthread-stubs libpng libdrm
endif

define ROCKCHIP_PCBA_INSTALL_TARGET_CMDS
    $(INSTALL) -d -m 0755 $(TARGET_DIR)/data
    $(INSTALL) -D -m 0755 $(@D)/rk_pcba_test/* $(TARGET_DIR)/data
endef

$(eval $(cmake-package))
```

Файл .mk определяет макросы по конфигурациям платформы в configs. При BR2_PACKAGE_PCBA_SCREEN=y задаётся PCBA_WITH_UI и зависимости zlib, libpthread-stubs, libpng, libdrm. PCBA_CONF_OPTS и PCBA_DEPENDENCIES — переменные синтаксиса mk. Для новой платформы добавьте определения в rockchip-pcba.mk по образцу существующих.

```text
ifeq ($(BR2_PACKAGE_PX3SE),y)
ifeq ($(BR2_PACKAGE_PCBA_SCREEN),y)
PCBA_CONF_OPTS = -DPCBA_WITH_UI=ON
PCBA_DEPENDENCIES = zlib libpthread-stubs libpng libdrm
endif
PCBA_CONF_OPTS += -DPCBA_PX3SE=ON
endif
```

Для PX3-SE с BR2_PACKAGE_PX3SE=y и экранным тестом BR2_PACKAGE_PCBA_SCREEN=y задаются PCBA_WITH_UI и библиотеки zlib libpthread-stubs libpng libdrm. Само наличие PX3-SE также задаёт PCBA_PX3SE. PCBA_CONF_OPTS и PCBA_DEPENDENCIES относятся к синтаксису mk. Для своей платформы добавьте определения по образцу pcba.mk. Основные параметры configs/rockchip_px3se_pcba_defconfig:

```text
#include "base/pcba.config"
......
BR2_PACKAGE_PX3SE=y
BR2_PACKAGE_PCBA_SCREEN=y
......
```

### 4.3 Запуск

См. board/rockchip/px3se/fs-overlay-pcba/data/RkLunch.sh.

```text
#! /bin/sh
if [ -f "pcba-core" ]; then
pcba-core &
fi

echo_pcbatest_server &
echo_auto_test echo_wlan_test &
echo_auto_test echo_bt_test &
echo_auto_test echo_ddr_test &
echo_auto_test echo_emmc_test &
echo_auto_test echo_rtc_test &

board/rockchip/px3se/fs-overlay-pcba/etc/init.d/S98_lunch_init
source /etc/profile.d/RkEnv.sh

case "$1" in
  start)
        source /data/RkLunch.sh
        printf "insmod vcodec service...\n"
        insmod /system/etc/firmware/vcodec_service.ko
        ;;
  stop)
        printf "stop finished\n"
        ;;
  *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
exit 0
```

Вызовите RkLunch.sh из сценария инициализации, чтобы после загрузки фоном запустить pcba-core и другие начальные тесты.

## 5. Приложение

### 5.1 Частые ошибки

#### 5.1.1 Ошибка открытия PCBA Tool

При запуске может появиться ошибка "Initialize RKupdate dll failed", как на рисунке 5-1.

![Руководство по разработке тестов Rockchip Linux PCBA — en 41](/docs/rockchip-linux-pcba/assets/en-p041-figure-01.png)

Рисунок 5-1. Ошибка запуска. Причина — неверные пути при установке. В config.ini каталога установки исправьте LogPath и TestPath на текущие пути. Исходный пример устанавливает инструмент в D:\ROCKCHIP\PCBATool, но строки дают LogPath=D:\ROCKCHIP\PCBAToo\Log\ и TestPath=D:\ROCKCHIP\PCBAToo\test\: проверьте пропущенную l и используйте фактический каталог.

![Руководство по разработке тестов Rockchip Linux PCBA — en 41](/docs/rockchip-linux-pcba/assets/en-p041-figure-02.png)

Рисунок 5-2. Файл config.ini

#### 5.1.2 Ошибка adb forward

После запуска может появиться "adb forward fail", как на рисунке 5-3.

![Руководство по разработке тестов Rockchip Linux PCBA — en 42](/docs/rockchip-linux-pcba/assets/en-p042-figure-01.png)

Рисунок 5-3. Ошибка adb forward. Возможная причина — ADB обнаруживает несколько устройств и инструмент не может правильно запустить сервис. Откройте CMD, перейдите в каталог adb и выполните adb devices. Если устройств несколько, отключите лишние. Либо остановите и заново запустите службу ADB следующими командами.

```text
adb kill-server
adb start-server
```

Затем повторите попытку.

#### 5.1.3 Нет подключения в Windows 10

В Windows 10 возможна проблема подключения ADB из-за несовместимости программы. Попробуйте режим Windows 7: правой кнопкой по значку → Свойства → Совместимость → запуск в режиме совместимости.

![Руководство по разработке тестов Rockchip Linux PCBA — en 43](/docs/rockchip-linux-pcba/assets/en-p043-figure-01.png)

Рисунок 5-4. Ошибка подключения в Windows 10

#### 5.1.4 Ошибка upload file fail

Диалог "upload file fail" означает, что echo_pcbatest_server не запущен на устройстве. Инструмент пытается передать локальную программу через ADB, но её нет в test каталога установки. Проверьте конфигурацию устройства и следующие условия.

1. echo_pcbatest_server и все тестовые программы находятся в /data устройства.

2. Сервисы PCBA и автоматические тесты успешно запускаются вместе с системой.

## Сверка китайского, английского и старого источников

- Основные источники: V1.2.0, инструмент V1.7. Старый ApplicationNote: V1.1.2, инструмент V1.6. Новая версия добавляет EMMC, RTC, автоматический CAMERA, JSON meta/test_group/mes_config и VS2022 с v143 MFC. Старая использует VS2008 SP1 и флажки с сохранением в config.ini для следующего запуска; процедуры различаются.
- Английский сохраняет старый раздел кнопки камеры 1.4.3, удалённый из китайского; китайская перезагрузка имеет номер 1.4.3. Английский раздел оставлен как исторический. Dev_Plateform, V4l2_test и nv12_to_bmp_main относятся к старой кнопке. Новая камера использует v4l2_capture.sh и photo_check.sh; CamData не используется.
- Старая перезагрузка управлялась выключенным по умолчанию флажком с фиксированным паролем от FAE. Новая — JSON needreboot. Разделы system_a/system_b — пример источника, не универсальная схема ArmSoM.
- Новые команды: make rockchip-pcba, rockchip-pcba-dirclean, rockchip-pcba-rebuild, ./build.sh buildroot. Старые: make pcba, make pcba-dirclean, make pcba-rebuild, ./build.sh pcba. Старые образы RK3308: rootfs.cpio, rootfs.cpio.gz, rootfs.ext2, rootfs.squashfs в buildroot/output/rockchip_rk3308_pcba/images/. Выбирайте полный rootfs по типу файловой системы, не просто pcba.img.
- Старая схема overlay требует BR2_ROOTFS_OVERLAY и BR2_PACKAGE_PCBA. При отсутствии board/rockchip/rkxxxx/fs-overlay-pcba адаптируется копия RK3308; data/RkLunch.sh включается через etc/init.d/S98_lunch_init для запуска службы. Совместимость старых путей с новым SDK не предполагается.
- Китайский recovery изменяет buildroot/package/rockchip/rockchip-pcba/{Config.in,rockchip-pcba.mk}; английский оставляет pcba/{Config.in,pcba.mk}. Китайский указывает recovery.img и rockdev/, английский ошибочно ecovery.img и rocketdev/. Здесь китайский служит основой.
- Английская глава 4 сохраняет старые макросы PX3-SE наряду с новой общей конфигурацией. Исторические условия: PCBA_PX3SE, PCBA_3308, PCBA_3229GVA. Старый тест кольцевого микрофона PX3-SE собирает echo_ringmic_test.c и связывает rk_pcba_test/libmictest.so. Это не подтверждает поддержку произвольных плат.
- Табличный TPYE отличается от JSON TYPE. Успешный EXIT в источнике содержит CMD вместо RES. KEY_test, KEY-TEST и key_test различаются; сверяйте реализацию. VERIFY означает завершение в таблице и подтверждение результата в примере. Девять таблиц восстановлены без обрезанных столбцов извлечения PDF.
- Загрузка называет список областью 3, обзор — областью 2. Частные сетевые адреса, MES и поля учётных записей — только примеры источника, они не использовались. В китайской таблице чипов сохранено RK3358, без самовольной замены на RK3588; поддержку и идентификаторы проверяйте по SDK.

Китайский пример Bluetooth относит RK3229GVA, PX3-SE и RK3308 к старым платформам с выключением/включением Bluetooth; RK3328, RK3326, RK3358 и PX30 — к новым с загрузкой прошивки при старте без этого цикла. Это примеры конкретного источника.

{% endraw %}
