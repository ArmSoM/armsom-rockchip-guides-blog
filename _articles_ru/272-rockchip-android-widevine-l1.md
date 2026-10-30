---
title: "Интеграция и проверка Widevine L1 в Rockchip Android 14"
description: "Интеграция и проверка Widevine L1 в Rockchip Android 14"
excerpt: "Интеграция и проверка Widevine L1 в Rockchip Android 14"
translation_key: "272-rockchip-android-widevine-l1"
slug: "272-rockchip-android-widevine-l1"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Основано на китайском RK-SM-YF-773 V1.0.0. Таблица указывает Android14 для RK3326, RK3399, RK3562, RK356x, RK3568, RK3576 и RK3588, без версии ядра. Для ArmSoM это справка: необходимы подходящие BSP, TEE/OEMCrypto, регистрация и производственные ключи. Статья не подтверждает сертификацию L1/GMS. Прошивка, регистрация, загрузка данных и аппаратная проверка не выполнялись. Английского PDF нет; все переводы используют исходные рисунки, часть которых уже английская.

## 1 Область

Интеграция клиента Widevine DRM в устройство/SoC, различия GMS/AOSP и Android14 LR-обновления/IR-первоначального выпуска, проверка и диагностика.

## 2 Экосистема

Основное внимание CDM и OEMCrypto HAL в красной рамке:

![Экосистема Widevine (векторная схема источника)](/docs/rockchip-android-widevine-l1/images/pdf-p03-1.png)

Экосистема Widevine (векторная схема источника)

### 2.1 Требования L1

1. Строго соблюдать безопасность Widevine Level1.
2. Совместимый L1 OEMCrypto; CDM собирается с OEMCrypto, обычно предоставляемым поставщиком чипа. Производитель устройства получает сборку у него.
3. Действующий System ID после регистрации марки/модели; при интеграции IN_TESTING, перед производством RELEASED.
4. Учётные данные:2.0 — запрос keybox;4.0 — загрузка данных, названных в источнике «密送», проект Cloud и ключи. Неясный термин сверяйте со спецификацией интерфейса.
5. Пройти интеграционные тесты до выпуска.

### 2.2 Требования L3

Соблюдать Level3, использовать готовую L3-библиотеку Widevine. Не нужны регистрация семейства, keybox и запрос сертификата. Выберите верную платформу: базы разные, записи не взаимозаменяемы. Integration Console — AOSP/CE(Linux), APFE — GMS/GAS/AAOS.

## 3 Интеграция Android DRM

### 3.1 GMS

SDK для GMS по умолчанию содержит vendor/widevine. Для GAS/AAOS доступ к ПО/документам получают у соответствующей команды партнёров. Код клиента, тесты и управление устройствами отдельные.

### 3.2 AOSP

Widevine напрямую поддерживает AOSP без GMS. Схема источника:

![Процесс AOSP (векторная схема)](/docs/rockchip-android-widevine-l1/images/pdf-p05-2.png)

Процесс AOSP (векторная схема)

### 3.2.1 Процесс L1

1. Получить L1 OEMCrypto у поставщика чипа.
2. [Запросить Console](https://developers.google.com/widevine/drm/device-management/ic-workflow/getting-access?hl=zh-cn), зарегистрировать устройство и запросить keybox. Марка/модель соответствуют исходным product.ro.manufacturer / product.ro.model; префиксы сверяйте с SDK.
3. Получить CDM и документы в `<branch>/libwvdrmengine` и `<branch>/libwvdrmengine/docs`. Поместить в ROOT/vendor/widevine дерева AOSP для автоматической сборки.
4. Запустить `sh build_and_run_all_unit_tests.sh` в WIDEVINE_ROOT/libwvdrmengine/ и WVTS; рекомендуется CTS.

### 3.2.2 Процесс L3

Библиотека: vendor/widevine/libwvdrmengine/level3/*/libl3oemcrypto.cpp. Регистрация семейства, keybox и сертификат не нужны.

### 3.2.3 Включение L1

В product device/rockchip/rk…/BoardConfig.mk:

```make
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 1
```

### 3.2.4 GMS (не требуется AOSP)

Этот раздел утверждает, что provisioning4.0 требует GMS, но далее описывает AOSP4.0. Сверяйте выбранную интеграцию. После настройки выполните lunch в корне SDK и проверьте значения:

```make
BUILD_WITH_GOOGLE_MARKET := true
```

```sh
get_build_var BOARD_WIDEVINE_OEMCRYPTO_LEVEL
get_build_var BUILD_WITH_GOOGLE_MARKET
```

### 3.2.5 Репозиторий Widevine

Для Android14 IR пропустить. Для обновления старой системы до Android14 LR в vendor/widevine:

```sh
cp -rf prebuilt/arm64/liboemcrypto_lr.so prebuilt/arm64/liboemcrypto.so
cp -rf prebuilt/arm/liboemcrypto_lr.so prebuilt/arm/liboemcrypto.so
```

Библиотека keybox пишет значение provisioning ниже. После замены LR-инструментов в hardware/rockchip/keymaster4/rockchip_rkp_service извлекается только default CSR:

```text
"provisioning":"OEMCrypto_Keybox"
```

```sh
cp -rf bin/arm/rockchip_rkp_factory_extraction_tool_lr bin/arm/rockchip_rkp_factory_extraction_tool
cp -rf bin/arm64/rockchip_rkp_factory_extraction_tool_lr bin/arm64/rockchip_rkp_factory_extraction_tool
```

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
```

## 4 Требования provisioning

Классификация по устройству/OEMCrypto:

|Устройство|OEMCrypto|DICE|2.0|3.0|4.0 non-DICE|4.0 DICE|
|---|---|---|---|---|---|---|
|Новое|v18+|Yes|-|-|-|Обязательно(по умолчанию)|
|Новое|v17+|No|Обязательно(по умолчанию)|Необязательно|Необязательно|-|
|Новое|v17 or earlier|No|Обязательно(по умолчанию)|Необязательно|-|-|
|Существующее|v17+|No|Обязательно(по умолчанию)|Необязательно|-|-|

### 4.1 OTA до Android14(LR)

Используйте Provisioning2.0 и прошивку L1 keybox. Сокращённый пример не является полноценными учётными данными:

```xml
<?xml version="1.0"?>
<Widevine>
<NumberOfKeyboxes>1</NumberOfKeyboxes>
<Keybox DeviceID="test-001"><Key>738a1896e6c7ec9fa3079220aaaa132</Key>
<ID>0000000200...</ID><Magic>6b626f78</Magic><CRC>5d6a650a</CRC></Keybox>
</Widevine>
```

Преобразуйте rkpacker в kdb и прошейте инструментом1.64, сохраняя совместимость старых keybox. При обновлении Android12/13→14 или повторном использовании старого SKU в APFE сохраняйте регистрацию keybox. Переход на4.0 может отказать уже поставленным устройствам из-за несовпадения аутентификации, хотя новые работают.

### 4.2 Android14 IR

Новый Android14 использует Provisioning4.0.

![Рисунок источника: страница PDF 8, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p08-3.png)

Рисунок источника: страница PDF 8, рисунок 1 (китайский источник)

1. Поставщик SoC разрабатывает OEMCrypto TA.
2. Регистрирует чип в Widevine.
3. OEM регистрирует устройство через Widevine/APFE.
4. OEM создаёт корень доверия из UDS чипа; глобально уникальный128-битный ключ SoC в KDF создаёт пару OEMCrypto.
5. OEM производит устройства. Важны3 и5.

### 4.2.1 Регистрация

Сначала подтвердите регистрацию чипа(2). AOSP регистрируется в Widevine; GMS обычно через3pl с данными APFE. Снимки: выбрать устройство→Edit→заполнить CPU Make/CPU Model в красной рамке→Register DRM.

![Рисунок источника: страница PDF 9, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p09-4.png)

Рисунок источника: страница PDF 9, рисунок 1 (китайский источник)

![Рисунок источника: страница PDF 9, рисунок 2 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p09-5.png)

Рисунок источника: страница PDF 9, рисунок 2 (китайский источник)

![Рисунок источника: страница PDF 10, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p10-6.png)

Рисунок источника: страница PDF 10, рисунок 1 (китайский источник)

![Рисунок источника: страница PDF 10, рисунок 2 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p10-7.png)

Рисунок источника: страница PDF 10, рисунок 2 (китайский источник)

![Рисунок источника: страница PDF 10, рисунок 3 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p10-8.png)

Рисунок источника: страница PDF 10, рисунок 3 (китайский источник)

![Рисунок источника: страница PDF 10, рисунок 4 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p10-9.png)

Рисунок источника: страница PDF 10, рисунок 4 (китайский источник)

Пример формы: Provisioning4.0, Key Upload, DICE No, OEM_CRYPTO_V18_5, OTA TEE/TA Yes, индивидуальное OTA Yes, защита отката Yes, привилегированная отладка отключена Yes, отключение аудио No. LR: Keybox/Verifier key.5.1 цифровой выход(unspecified без него/HDCP) и5.2 отключение цифрового видео заполняйте по устройству, не копируйте HDCP_V2_3/Yes. Далее пример успешной регистрации.

![Рисунок источника: страница PDF 11, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p11-10.png)

Рисунок источника: страница PDF 11, рисунок 1 (китайский источник)

### 4.2.2 Производство

Запишите серийный номер и ID Attestation до извлечения/загрузки Widevine RKP CSR. Для отладки команда, в производстве RKDevInfoWriteTool. Если отсутствует, соберите mm в system/security/provisioner.

```sh
rkp_factory_extraction_tool64 --output_format build+csr > /sdcard/csr.json
```

После записи номера/ID Attestation нормально перезагрузите: RKP сохранит CSR в vendor storage. Снова войдите в loader, запишите attestation keybox и считайте CSR в каталог инструмента. ID66/67. Проверьте default, widevine и непустой serialno; данные сокращены....

```c
#define VENDOR_CSR_SERIAL_ID 66
#define VENDOR_CSR_ID 67
```

![Рисунок источника: страница PDF 12, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p12-11.png)

Рисунок источника: страница PDF 12, рисунок 1 (китайский источник)

```json
{"build_fingerprint":"rockchip/rk3562_u/...TXNlLWtleXM=","name":"default","serialno":"rk83991906"}
{"build_fingerprint":"rockchip/rk3562_u/...Vhc2Uta2V5cw==","name":"widevine","serialno":"rk83991906"}
```

Генерация как keymint, см.SDK RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide. С L1 одна операция содержит keymint и widevine, загрузите один раз.

## 5 Проверка

Сеть должна достигать Google/YouTube; перезагрузите или дождитесь сертификата(шаги3/5).

### 5.1 Уровень

Установите new Drminfo.apk. System ID совпадает с регистрацией; различия Vendor/Version игнорируйте.

![Рисунок источника: страница PDF 14, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p14-12.png)

Рисунок источника: страница PDF 14, рисунок 1 (китайский источник)

![Рисунок источника: страница PDF 15, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p15-13.png)

Рисунок источника: страница PDF 15, рисунок 1 (китайский источник)

При4.0 важен System ID, не только Level=L1.2147483647 — сертификата нет: проверьте регистрацию, CSR и сеть.8158 — liboemcrypto.so не загружена, работает L3.

### 5.2 Видео

Отмеченные элементы ExoPlayer Demo должны играть более1минуты. Форматы задают файлы SoC vendor/rockchip/common/vpu/etc/media_codecs_c2_rk***.xml и media_codecs_secure_rk***.xml.

![Рисунок источника: страница PDF 16, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p16-14.png)

Рисунок источника: страница PDF 16, рисунок 1 (китайский источник)

## 6 Вопросы

### 6.1 Прошивка регистрации должна совпадать?

Не полностью: допустимы тот же чип и Android. Минимум совпадают Device Name, Product, CPU Make(Rockchip), CPU Model(реальный RK****). Источник признаёт неполноту сведений; ориентируйтесь на результат заявки. Соответствия свойств ниже.

### 6.2 Проверка среды L1

DrmInfo показывает L1; проверьте logcat:

![Рисунок источника: страница PDF 17, рисунок 1 (китайский источник)](/docs/rockchip-android-widevine-l1/images/pdf-p17-15.png)

Рисунок источника: страница PDF 17, рисунок 1 (китайский источник)

```text
WVCdm: [cdm_engine.cpp(1089):IsSecurityLevelSupported] level = L1
...
WVCdm: [oemcrypto_adapter_dynamic.cpp(875):Initialize] OEMCrypto_Initialize Level 1 success. I will use level 1.
```

### 6.3 DrmInfo не показывает L1

1. Проверьте L1-библиотеки и журнал после загрузки/открытия DrmInfo. IR4.0 и LR2.0 отличаются provisioning:

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_BootCertificateChain","is_factory_build":"false","fused":false,"is_debug":false}
```

```text
I/WVCdm: [oemcrypto_adapter_dynamic.cpp(885):Initialize] Level 1 Build Info
(v18): {"soc_vendor":"Rockchip","soc_model":"rk3562","ta_ver":"18.5.0+May 15 2024 14:48:28","uses_opk":true,"tee_os":"Optee","tee_os_ver":"3.13.0","form_factor":"tablet","implementer":"Rockchip","provisioning":"OEMCrypto_Keybox","is_factory_build":"false","fused":false,"is_debug":false}
```

2. Для2.0 проверьте keybox; для4.0 регистрацию и сеть. БезGMS зарегистрируйтесь вWidevine и загрузите CSR; GMS проверяет сервер:

```sh
ping remoteprovisioning.googleapis.com
```

Ищите RkpdWidevine.500 обычно означает отсутствие регистрации или загрузки CSR. Журналы неудачи/успеха:

```text
2024-04-19 10:38:14.366 2333-2406/? E/RkpdWidevine: Server request for WV certs
failed. Error: 500
2024-04-19 10:38:14.368 2333-2406/? E/RkpdWidevine: WV Provisioning failed.
java.io.IOException: Failed to request WV certs. Error: 500
at
com.android.rkpdapp.provisioner.WidevineProvisioner.sendNetworkRequest(WidevineProvisioner.java:188)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.fetchWidevineCertificate(WidevineProvisioner.java:168)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.provisionWidevine(WidevineProvisioner.java:144)
at
com.android.rkpdapp.provisioner.WidevineProvisioner.doWork(WidevineProvisioner.java:97)
at androidx.work.Worker$1.run(Worker.java:82)
at
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
at
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:644)
at java.lang.Thread.run(Thread.java:1012)
```

```text
Line 45913: 2024-05-15 20:17:52.504 2947-5376/? I/RkpdWidevine: Starting WV
provisioning. Current attempt: 0
Line 46152: 2024-05-15 20:17:53.843 2947-5376/? I/RkpdWidevine: Provisioning
successful.
```

Если не решено, предоставьте logcat DrmInfo/загрузки, последовательный журнал, регистрацию/снимки, adb bugreport и CSR. При4.0 System ID не2147483647 и совпадает с регистрацией. Источник смешивает «неGMS/APFE»; различайте по2.2.

### 6.4 Звук без изображения/зелёные или битые кадры

Запишите проявление и adb bugreport; проверьте XML из5.2 и нужный rk***.

### 6.5 Одновременно2.0/4.0?

На устройстве одна модель, выбирает OEM. Норма защищает видеовыход, не аудио; защита аудио не обязательна дляLevel1.

### 6.6 Версия OEMCrypto

Источник рекомендует последнюю доступную. Сv18 новым реализациям нужна4.0; старые устройства при обновленииv18+ сохраняют производственный способ. Таблица — снимок источника, не текущая гарантия:

|Android|Дата версии|MediaDRM HIDL|CDM|OEMCrypto(new)|OEMCrypto(upgrade)|
|---|---|---|---|---|---|
|Android15.0 V+|TBD|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy<br>udc-widevine-release|19.0.0(APEX)|19.1+|18.1|
|Android14.0 U+|2023-10|com.google.android.widevine.nonupdatable<br>com.google.android.widevine.nonupdatable<br>com.google.android.widevine.lazy|18.0.0(APEX)|18.1+|17.1|
|Android13.0 T+|2022-08|android.hardware.drm-service.widevine<br>(tm-widevine-release)|17.0.0|17.1|16.3+|
|Android12.0 S+|2021-10|android.hardware.drm@1.4<br>sc-widevine-release|16.1.0|16.3 /16.4|16.3 /16.4|
|Android11.0 R+|2020-09|android.hardware.drm@1.3<br>rvc-widevine-release|16.0.0|16.3 /16.4|15.x /16.3 /16.4|

Повтор HIDL и Android15 «TBD» сохранены, не обновлены до современных требований.

### 6.7 Срок загрузки

Загрузите данные до включения пользователем, сразу или пакетами; сохраните записи для проверки Google.

## 7 Приложение: код Android14

Проверьте коммиты, недостающие патчи получите уRK. Авторство технических коммитов сохранено.

### vendor/widevine

```text
commit 9f0b92744eeaa144629c6c2e0101d40a50160d7e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Wed May 15 15:15:24 2024 +0800
widevine : Add android LR version.
commit bab2013c13fdb22c5f244d38510c998da4c245ba (rk/rk35/mid/14.0/develop,
m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon Apr 22 09:07:46 2024 +0800
widevine : update opk to v18.5.
This version support widevine RKP.
```

### device/rockchip/common

```text
commit 56aa6a72e6f00753614fba71edef7261509320d6
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:28:03 2024 +0800
sepolicy : add sepolicy for widevine rkp csr provisioning.
-------------------------------------------------------------
commit b336ed61eff291ee0b9170e9a6415fd248a41428
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Dec 19 17:12:08 2023 +0800
media_drm : add PRODUCT_VENDOR_LINKER_CONFIG_FRAGMENTS configuration
for widevine L1.
```

### frameworks/av

```text
commit 1649daedd5a3fc8bc1a876c512fe657ee4132a80 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Wed Jul 12 12:50:41 2023 -0700
DrmRkpAdapter: only return HALs supporting get bcc
commit 0c588a79543ee1ae5a74c7a27bd4731161b8c409
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 11:54:57 2023 -0700
DrmRemotelyProvisionedComponent: assemble csr in adaptor
commit 72cc71abe5b8544f467e2e8e9d7f9930d0dc32e9
Author: Kyle Zhang <kelzhan@google.com>
Date: Thu Jun 15 00:16:42 2023 +0000
Create libmediadrmrkp as drm to irpc adapter library
```

### hardware/rockchip/keymaster4

```text
IR:
commit a6ba57b20d107ccf318fc678a1360fd963c8996e (HEAD)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Mon May 13 17:06:07 2024 +0800
rkp : add sepolicy for get serial number.
commit 7a176bf1ccf45cc0bc67b5dda8b855f6cfc057f3 (tag: android-14.0-mid-rkr4,
rk/rk35/mid/14.0/develop, m/rk35/mid/14.0/develop)
Author: callen.cai <callen.cai@rock-chips.com>
Date: Tue Apr 23 16:24:16 2024 +0800
rkp : support widevine rkp csr provisioning.
LR:
commit c6b01283afafe0ce4d9bf8ba22103ee0e33606dc
Author: callen.cai <callen.cai@rock-chips.com>
Date: Sat Jun 22 10:30:35 2024 +0800
rkp : Add LR version rkp csr tools.
```

### system/security

```text
commit 9b8fc62d77f0d7cf5f79efdaca53c2ee31c96dc0 (HEAD, tag: android-14.0-mid-rkr4, m/rk35/mid/14.0/develop, aosp/rk35/mid/14.0/develop)
Author: Robert Shih <robertshih@google.com>
Date: Mon Jul 10 13:07:35 2023 -0700
rkp_factory_extraction_tool: append drm CSRs
commit 36356e22faf3e78f0fbb90a03a4d750b15402395
Author: Robert Shih <robertshih@google.com>
Date: Wed Jun 28 15:32:45 2023 -0700
Export rkp_factory_extraction_tool on ci
```

### frameworks/native

Источник требует ручное изменение:

```diff
diff --git a/libs/renderengine/skia/AutoBackendTexture.cpp b/libs/renderengine/skia/AutoBackendTexture.cpp
index 23c99b0796..acd7ae844b 100644
--- a/libs/renderengine/skia/AutoBackendTexture.cpp
+++ b/libs/renderengine/skia/AutoBackendTexture.cpp
@@ -44,7 +44,7 @@ AutoBackendTexture::AutoBackendTexture(GrDirectContext* context, AHardwareBuffer
isOutputBuffer);
mColorType =
GrAHardwareBufferUtils::GetSkColorTypeFromBufferFormat(desc.format);
if (!mBackendTexture.isValid() || !desc.width || !desc.height) {
- LOG_ALWAYS_FATAL("Failed to create a valid texture. [%p]:[%d,%d]
isProtected:%d "
+ ALOGE("Failed to create a valid texture. [%p]:[%d,%d] isProtected:%d "
"isWriteable:%d format:%d",
this, desc.width, desc.height, createProtectedImage,
isOutputBuffer,
desc.format);
```

## 8 Приложение: официальные ссылки(часть требует APFE)

- [Provisioning4.0](https://developers.google.com/widevine/drm/specification/provisioning-4?hl=zh-cn)
- [Provisioning4.0 options](https://developers.google.com/widevine/drm/specification/provisioning-4/options?hl=zh-cn#device_key_database_model)
- [Testing / CSR upload](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp?hl=zh-cn#extract_and_upload_the_widevine_csr)
- [RKP FAQ](https://docs.partner.android.com/gms/building/integrating/att-keys/rkp-faqs?hl=zh-cn#upload-update)
- [ArmSoM](https://docs.armsom.org/)

{% endraw %}
