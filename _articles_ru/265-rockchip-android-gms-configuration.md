---
title: "Rockchip Android GMS: настройка, сертификационные тесты и устранение ошибок"
description: "Rockchip Android GMS: настройка, сертификационные тесты и устранение ошибок"
excerpt: "Rockchip Android GMS: настройка, сертификационные тесты и устранение ошибок"
translation_key: "265-rockchip-android-gms-configuration"
slug: "265-rockchip-android-gms-configuration"
lang: "ru"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

Общая основа — китайский RK-YH-YF-237 V3.0 (77 страниц, до Android 14); английский RK-YH-YF-251 V1.3 (16 страниц, до Android 11) используется для проверки исторических различий, а уникальные английские сведения сохранены отдельно. Правила и сроки относятся к версиям источников, не обязательно к текущей политике Google, и не означают сертификацию ArmSoM по GMS/EDLA. Проверьте плату, SoC, Android SDK/BSP, ядро и лицензионные права. Команды, запись ключей и сертификационные тесты не выполнялись. В английском оригинале нет технических рисунков; единственный снимок взят из китайского с указанием источника. См. [документацию ArmSoM](https://docs.armsom.org/).

## 1 Терминология

| Термин | Определение источника |
| --- | --- |
| GMS (Google Mobile Service) | Мобильные сервисы Google: сервисная платформа, Play Store, Chrome и другие приложения. |
| MADA (Mobile Application Distribution Agreement) | В основном телефоны/планшеты, соответствующие всем CDD-требованиям типа handheld/tablet; экран 3.3–18 дюймов и обязательная батарея. |
| EDLA (Enterprise Device Licensing Agreement) | Аналог MADA со смягчением ограничений экрана/батареи: 18–70 дюймов и без батареи; память больше 2G, изделие не для прямой продажи потребителю. |
| 3PL | Сторонние лаборатории помогают Google проверять CDD, GMS Requirements и региональные требования, например Foxconn, Harman, Wind River, Pegatron; связь напрямую или через продажи. |
| Google Partner | Подписание MADA/EDLA и статус Partner дают доступ к документации и заявкам 3PL. |
| EEA | Устройства для ЕС требуют EEA GMS; тип EEA в коде задаётся по условиям и соглашению EMADA. |
| xTS | Запустите binary для входа в xTS-tradefed и выполнения тестов/retry. |
| retry | Продолжение по имеющимся результатам при одинаковом Fingerprint. `l r` показывает результаты, первая колонка — session id. Выполните `run retry --retry session_id` без добавок вроде `--retry-type`. |
| Single test | Отдельные тесты для отладки; результаты и журналы — в `results` и `logs`. |

[EEA](https://support.google.com/androidpartners_gms/answer/9071728?hl=en) · [CTS](https://source.android.com/compatibility/cts/run)

## 2 Требования к оборудованию

- Обязательны физический RTC, не виртуальный, и `/sys/class/rtc/rtc0/`.
- Требуется встроенный или USB-микрофон; если есть только USB, настройте его как встроенный. Проверьте запись.
- Для Nearby Share в Android 11+ необходим BLE.
- Type-C должен поддерживать OTG, иначе GTS Interactive завершится ошибкой; проверьте при проектировании.
- Изменение features требует полной повторной сертификации; после неё features не менять.

Ниже пути отчёта/журнала из источника. `ASSUMPTION_FAILURE` означает пропуск с результатом Pass; источник говорит, что Google учитывает только `FAILURE`.

```text
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/host_log_***.txt
android-cts/logs/2023.05.04_14.13.15/inv_17873629097171453434/device_logcat_test_PH0BEXGDPG_***.txt
```

## 3 Требования версий

### 3.1 Android 13

Новые устройства Android 13+ требуют минимум `2Gb` DDR; меньшие, включая Go, не сертифицируются. Добавлен RKP. Источник смешивает единицы Gb/GB/G; они сохранены и требуют сверки со спецификацией.

### 3.2 Android 14

Android 14+ с `3Gb DDR` допускает заявку Go GMS. Добавлена Device ID Attestation. Для новых устройств GMS/EDLA только 64Bit; пример:

```make
# device/rockchip/rk3588/rk3588s_u/BoardConfig.mk
DEVICE_IS_64BIT_ONLY := true
```

## 4 До испытаний

Для сервисов Google необходимы сертификация GMS/EDLA и соответствующие права. При MADA/EDLA вопросы доступа решаются с Google; заявка через Google/3PL, настройка и самопроверка всех xTS. Без квалификации обратитесь к компании с ODM MADA. Большинство ссылок требуют доступа MADA/EDLA. Одно выполнение команд не даёт сертификат.

Источник допускает DDR 2G и ниже только как Android Go, но Android 13+ запрещает ниже 2G. Выберите `lunch *go`, например:

```sh
lunch rk3326_rgo-user
```

PX30 — промышленный вариант RK3326 с близкими функциями; в записи Google только RK3326, поэтому источник требует заявку как RK3326. RK3568 относится к RK356x, допустимы RK3566/RK3568; RK3562 — другая серия. Пример PX30:
1. Заявка sub-license как RK3326.
2. Для PX30-2GB DDR: `lunch rk3326_rgo-user`.
3. Перед `./build.sh -UCA` измените makefile:

```make
# device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

EDLA обычно использует USB-камеры, а не встроенные MIPI. 3PL не задаёт модель, но CTS строг; ранее сертифицированные сенсоры см. в приложении A.

## 5 Предварительные заявки

Заранее запросите:
1. sub-license у 3PL (Keymaster & Optee).
2. keybox у 3PL (Attestation key).
3. GTS `APE_API_KEY` у 3PL (GTS).
4. У Google аккаунт вида `android-partner-api@company.com` и RKP (раздел RKP).

## 6 Сроки допуска

Поддержка платформ: [GMS Express/GO Ready Chipset](https://docs.google.com/spreadsheets/d/18cNgkWAlt6mYtZIgXS9yHflhMbE8pFB9CgYniqUsWR4/edit#gid=227777885); строгие сроки первой сертификации Android: [GMS approval windows](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#gms_approval_windows_by_release). Исторический пример: Android 12L AOSP 2022-03-07, закрытие GMS 2023-02-28, EDLA 2023-12-31. Это не текущие сроки подачи.

## 7 Продолжительность сертификации

Оценки источника: для обычного планшета после стабильного SDK и готового устройства без явных зависаний устранение проблем занимает 3–4 недели. Android 13+ использует GKI. Интерфейсы драйвера вне стандартного ABI отправляются Google; проверка/слияние обычно 3–4 дня, отсечка 15-го, подписанный `boot.img` в конце месяца. После 15-го ожидание release может составить около 40 дней. Временно можно тестировать с [ежедневным PAB boot.img](https://ci.android.com/builds/branches/aosp_kernel-common-android13-5.10/grid?legacy=1&selected-targets=kernel_aarch64). RKP Android 13+ сложен и требует помощи Google; запросите заранее.

У EDLA больше драйверов и сложнее аппаратура; GKI может добавить 4–6 недель. Тестируется готовое устройство, при нескольких экранах — самый большой. Параллельные тесты без зависаний источник оценивает примерно в пять дней. Значения без единиц оставлены как в таблице:

| Тест | Устройств | Срок |
| --- | --- | --- |
| CTS | 3+ | 2–4 дня |
| CTS-ON-GSI | 2 | 2 |
| VTS | 1 | 1 |
| CTS-Verifier | 1 | 1 |
| GTS | 1 | 2 |
| GTS-Verifier | 1 | 1 |
| APTS | 1 | 1 |
| STS | 1 | 1 |

## 8 Получение пакетов Google

Интегрируйте GMS, mainline и prebuilts. Патчи из документации mainline должны присутствовать в SDK, иначе сборка неудачна. Последний mainline: [Release Tracker](https://releasetracker.partner.android.com/); пакеты/патчи SDK: [Release notes](https://docs.partner.android.com/mainline/release/release-notes); срок GMS/загрузка: [GMS download](https://docs.partner.android.com/gms/building/integrating/gms-download).

| Пакет | Каталог |
| --- | --- |
| GMS | `vendor/partner_gms` |
| mainline | `vendor/partner_modules` |
| prebuilts | Замените весь `prebuilts/module_sdk` файлами соответствующего mainline |

Проверка версии GMS:

```text
getprop | grep ro.com.google.gmsversion

/vendor/partner_gms/products/gms_package_version.mk: GMS_PACKAGE_VERSION_ID := 13_202310
/vendor/partner_gms/products/gms.mk: ro.com.google.gmsversion=$(GMS_PACKAGE_VERSION_ID)
```

Без MADA/EDLA нельзя скачивать самостоятельно, Rockchip также не предоставляет пакеты; получите через 3PL. При наличии прав рекомендуется Express (§11), пакеты которого соответствуют исходным требованиям GMS Express Plus. Вручную распакуйте GMS в `vendor/partner_gms`. Для Android 11+ mainline нет готового архива; синхронизируйте repo по [инструкции Drive](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5):

```sh
# 下载 manifest 文件
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# 开始同步，同步前，请先检查 .repo/manifests/default.xml 中是否有内容
repo sync -c -j8
```

Тестам обычно нужен последний Approved. Найдите git tag в Release Summary; пример — `mainline_m_2020_dec_preload_5`. Измените default revision манифеста:

```diff
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote  name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
-  <default revision="r-aml-prebuilt-release"
+  <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

В Android 12+ prebuilts должен совпадать с mainline, иначе ошибка сборки. Пример: оба `T1003604/mainline_m_2022_feb_preload_5`.

![Пример ошибки несовпадения mainline/prebuilts, китайский PDF с.9; английского аналога нет.](/docs/rockchip-android-gms-configuration/images/cn-p009-1.png)

Пример ошибки несовпадения mainline/prebuilts, китайский PDF с.9; английского аналога нет.

## 9 Тестовые пакеты

Источник обычно требует последние пакеты Google с квартальными обновлениями в феврале/мае/августе/ноябре; см. [таблицу версий](https://docs.qq.com/sheet/DVG5KcFNnU2ZFZG9j?tab=BB08J2&u=74e1e99829764a9b8a46607a5c6980cf). Ссылки в приложении B; FTP Rockchip `GMS-Test-Suite/xTS` может содержать старые копии. Модули ниже. Ежедневный PAB помогает проверить, исправлены ли ошибки.

| Модуль | Прошивка | Примечание |
| --- | --- | --- |
| CTS | user | — |
| CTS-ON-GSI | user | Подписанный Google system.img |
| GTS | user | — |
| STS | userdebug | Обновление в первую среду месяца |
| VTS | user | Google system.img и vendor_boot-debug.img прошивки |
| CTS-Verifier | user | — |
| GTS-Verifier | user | Только Android 13 |
| GTS Interactive | user | Android 13+; android-gts-11-R2 и новее |
| Checklist | user | Также требуется EDLA |
| BTS | user | — |
| GOATS | userdebug | Go Android 11 и старше |
| APTS | userdebug | Go Android 12 и новее |

## 10 Настройка прошивки GMS

Ниже исходные примеры журналов, конфигураций, путей и команд. Китайские комментарии сохранены, операции объясняются на каждом языке. Фрагменты не дополняются до полных скриптов.

### 10.1 Проверка конфигурации

В Android 12+ проверка после lunch; все пункты Pass до сертификации. `BOARD_WIDEVINE_OEMCRYPTO_LEVEL` по изделию; проверьте права APK для `PRODUCT_HAVE_RKAPPS`.

```text
source build/envsetup.sh
lunch rk3588s_t-user
source device/rockchip/common/scripts/check_gms_env.sh
```

Если макросы u-boot настроены, но Failed, сначала соберите u-boot. Для отсутствующего `.config`: `./make.sh rk3588` в `Android_SDK/u-boot`, повторная проверка; остальные ошибки исправьте до Pass.

```text
Android_SDK$ source device/rockchip/common/scripts/check_gms_env.sh
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_AB=y" Check Failed! Expect "CONFIG_ANDROID_AB=y"
 "Android 11+ MUST enable A/B update."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_WRITE_KEYBOX=y" Check Failed! Expect "CONFIG_ANDROID_WRITE_KEYBOX=y"
 "Attestation key MUST be enabled."

grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_ANDROID_KEYMASTER_CA=y" Check Failed! Expect "CONFIG_ANDROID_KEYMASTER_CA=y"
 "Keymaster in uboot MUST be enabled."
grep: u-boot/.config: No such file or directory
 [Failed] "CONFIG_OPTEE_CLIENT=y" Check Failed! Expect "CONFIG_OPTEE_CLIENT=y"
 "Optee MUST be enabled."
解决方法:Android_SDK/u-boot$ ./make.sh rk3588
```

### 10.2 Сборка ядра

Используйте Clang, `./build.sh -CK`, иначе VTS `KernelVersionTest#IsClang` не проходит. Фрагмент:

```text
vts_kernel_toolchain
KernelVersionTest#IsClang
相关逻辑:Android_SDK/build.sh
if [ "$BUILD_KERNEL_WITH_CLANG" = true ] ; then
if [ "$KERNEL_ARCH" = "arm64" ]; then
    ADDON_ARGS="CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1"
else
    ADDON_ARGS="CC=clang LD=ld.lld"
```

Go заменяет `android-10.config` на `android-10-go.config`; Android 11 — 11 вместо10, Android 13 — `android-13.config`. Отсутствующий `rkxxxx.config` опустите. Далее проверяйте `device/rockchip/rkxxxx/BoardConfig.mk`.

```text
make ARCH=arm64 rockchip_defconfig android-10-go.config rk3326.config
make ARCH=arm64 rockchip_defconfig android-11-go.config rk3326.config
```

### 10.3 EEA

Только для EEA в ЕС, иначе пусто; type1 замените фактическим типом.

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (根据自己的EEA类型配置)
```

### 10.4 Включение GMS

MARKET_ALL true только radio/4G, иначе false. User RKAPPS false удаляет стресс-инструменты, иначе не загрузится.

```text
device/rockchip/rk3588/BoardConfig.mk
BUILD_WITH_GOOGLE_MARKET := true
# 含radio的设备(即带有4G通讯功能)请配置以下配置,其余设备保持false
BUILD_WITH_GOOGLE_MARKET_ALL := true
# 编译user固件时,请把下面的宏设成false,RK的压力测试工具将会移除,否则无法正常启动。
PRODUCT_HAVE_RKAPPS := false
```

Добавьте для Go2G (Android13+ не ниже2Gb), проверьте mk после source/lunch. `gms-mandatory` — `vendor/partner_gms/products/gms-mandatory.mk`; без Express по умолчанию `gms.mk`.

```text
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   TMP_GMS_VAR := gms
   TMP_MAINLINE_VAR := mainline_modules
   ifeq ($(strip $(BUILD_WITH_GO_OPT)),true)
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_go_2gb
```

```text
Android_SDK$ get_build_var TMP_GMS_VAR
gms-mandatory ##
vendor/partner_gms/products/gms-mandatory.mk
```

### 10.5 Аппаратные features

Согласуйте с разработчиками, удалите features отсутствующих гироскопа/BLE. Nearby Share Android11+ требует BLE. Используйте макросы либо удалите feature.xml из `frameworks/native/data/etc/`.

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

Пример удаления BLE (не отменяет обязательные требования):

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

Features USB-камеры:

```text
android.hardware.camera.any
android.hardware.camera.external
```

Даже без GPS сохраните для сетевого позиционирования:

```text
android.hardware.location
android.hardware.location.network
```

Если `pm list features | grep sensor` пусто, удалите сервис сенсора. Итоговый файл `/vendor/etc/vintf/manifest.xml`.

```text
device/rockchip/common/device.mk:
-# Sensor HAL
-PRODUCT_PACKAGES += \
- android.hardware.sensors@1.0-service \
- android.hardware.sensors@1.0-impl \
- sensors.$(TARGET_BOARD_HARDWARE)
device/rockchip/common/manifests/manifest_level_33.xml:
- <hal format="hidl">
- <name>android.hardware.sensors</name>
- <transport>hwbinder</transport>
- <version>1.0</version>
- <interface>
- <name>ISensors</name>
- <instance>default</instance>
- </interface>
- </hal>
注:上述manifests配置文件生成目录/vendor/etc/vintf/manifest.xml
```

### 10.6 FRP

Включите FRP; см. `RKDocs/android/Rockchip_Introduction_Android_Factory_Reset_Protection_CN&EN.pdf`.

```text
BUILD_WITH_GOOGLE_FRP := true
```

### 10.7 AVB и A/B

GMS требует AVB; см. `RKDocs/android/Rockchip_Introduction_Android_Verify_Boot_CN&EN.pdf`. Отладочные настройки SDK отключают AVB/блокировку, возможна надпись без сертификата после сертификации. Перед производством патч uboot блокирует при записи ключа. Для отладки не добавляйте: другая прошивка может не загрузиться. Без AVB не блокировать.

```text
BOARD_AVB_ENABLE := true ## 若没有启用AVB则不能锁定机器,否则会导致机器无法开机

RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

Android11+ включает virtual A/B с отсутствующим include:

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# 下面这段在配置时如果没有,请一起添加
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

Android13 GKI требует сжатый virtual A/B:

```text
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
```

При малых разделах задайте размер вручную; overlay после include `BoardConfig_AB.mk`.

```text
Android_SDK/device/rockchip/rk3588$ git diff rk3588_s/BoardConfig.mk
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # 以下这段overlay必须要放到`include device/rockchip/common/BoardConfig_AB.mk`之后
+BOARD_SUPER_PARTITION_SIZE := 4294967296
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

Также A/B в u-boot RK3566/RK3568:

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
+CONFIG_ANDROID_AB=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

Проверка AVB/A-B и пример ошибки без AVB:

```sh
pm list features | grep android.software.verified_boot
ls -l /dev/block/by-name/
```

```text
CtsSecurityTestCases
android.security.cts.VerifiedBootTest#testVerifiedBootSupport
测试报错:java.lang.AssertionError: Verified boot must be supported on the device
```

Блокировка без AVB не даёт загрузиться. Решения источника: ① RKDevTool.exe→Advanced→Erase all→reboot (данные теряются); ② UART CTRL+C, `fastboot usb 0`, затем adb-порт `fastboot oem at-unlock-vboot`.

```text
报错信息:Hit key to stop autoboot('CTRL+C'): 0
        ANDROID: reboot reason: "(none)"
        Vboot=0, AVB images, AVB verify
        read_is_device_unlocked() ops returned that device is LOCKED
        avb_slot_verify.c:763: ERROR: vbmeta: Error verifying vbmeta image: OK_NOT_SIGNED
        AVB verify failed ## AVB校验失败
        Android boot failed, error -1.
```

### 10.8 SELinux

Проблемы функций: `RKDocs/android/Rockchip_Developer_Guide_Android_SELinux(Sepolicy)_CN.pdf`. Перед Android12+ сертификацией повторно сканируйте userdebug по README.md. Результаты в файлы `BOARD_SEPOLICY_DIRS`, например `device/rockchip/rk3399/sepolicy_vendor/genfs_contexts`.

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true

RKTools/linux/Android_Devices_SELinux_Tool

console:/ $ chmod +x ./data/local/rockchip_selinux_tools
console:/ $ ./data/local/rockchip_selinux_tools
Please USE the following cmd to confirm which files need to be update!
get_build_var BOARD_SEPOLICY_DIRS ## 工程source和lunch后执行该命令
Add the following result to file: [genfs_contexts]
----------------------------------------------------- ## 将下面扫描结果添加到genfs_contexts
genfscon sysfs /devices/platform/av1d-master/wakeup u:object_r:sysfs_wakeup:s0
genfscon sysfs /devices/platform/es8388-sound/extcon u:object_r:sysfs_extcon:s0

Android_SDK$ get_build_var BOARD_SEPOLICY_DIRS
device/rockchip/common/sepolicy/vendor device/rockchip/rk3399/sepolicy_vendor
....
```

Проверьте `cat /vendor/etc/selinux/vendor_sepolicy.cil`. Меняйте `/device/rockchip`, не `/system/sepolicy`. Не меняйте user adb-root `ro.debuggable`: зависание adbd, остановка теста, потеря журналов. Примеры:

```text
I init : starting service 'adbd'...
I init : Created socket '/dev/socket/adbd', mode 660, user 1000, group 1000
W adbd : type=1400 audit(0.0:27602): avc: denied { setcurrent } for scontext=u:r:adbd:s0 tcontext=u:r:adbd:s0 tclass=process permissive=0
F adbd : main.cpp:162] Could not set SELinux context
I init : Service 'adbd' (pid 10075) received signal 6
I init : Sending signal 9 to service 'adbd' (pid 10075) process group...
E init : process with updatable components 'adbd' exited 4 times in 4 minutes

netd_integration_test
NetdSELinuxTest#CheckProperMTULabels
SuspendSepolicyTests
SuspendSepolicyTests#SuspendSepolicyTests
CtsSecurityHostTestCases
android.security.cts.SELinuxHostTest#testNoBugreportDenials ## 需要打开宏
BOARD_SELINUX_ENFORCING ?= true
```

### 10.9 Фиксация Fingerprint

Зафиксируйте fingerprint до теста для retry после изменения прошивки; строка цифр своя.

```text
Android_SDK/device/rockchip/common$ git diff prebuild.mk
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (写一串数字即可,自己定)
```

### 10.10 Уровень патчей безопасности

Патчи Partner_Security_Bulletin или FTP Rockchip; проверка `getprop | grep ro.build.version.security_patch`. Руководство FTP `/GMS-Test-Suite/xTS/tools/Rockchip_Android_Security_Patch_Guide.pdf`. Обычно три месяца по источнику; проверьте окно.

```text
GtsOsTestCases
com.google.android.os.gts.SecurityPatchTest#testSecurityPatchDate
报错信息:ro.build.version.security_patch should be "2023-03" or later. Found "2022-07-05"
```

| Android | Ветка патчей |
| --- | --- |
| 12 / 12L | android12-security-release |
| 13 | android13-security-release |
| 14 | android14-security-release |

Примените патчи по времени, затем реальный уровень; не только дату. Формат год-месяц-день, иначе пустой `--rollback_index` ломает vbmeta.img. Пример, ошибка и цепочка:

```text
build/make/core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05

[ 99% 8801/8803] Target vbmeta image: out/target/product/rk3588_t/vbmeta.img
FAILED: out/target/product/rk3588_t/vbmeta.img
usage: avbtool make_vbmeta_image [-h] [--output OUTPUT]
                               [--padding_size NUMBER]
                               [--algorithm ALGORITHM] [--key KEY]
                               [--signing_helper APP]
                               [--signing_helper_with_files APP]
                               [--public_key_metadata KEY_METADATA]
                               [--rollback_index ROLLBACK_INDEX]
                               [--rollback_index_location ROLLBACK_INDEX_LOCATION]
                               [--append_to_release_string STR]
                               [--prop KEY:VALUE]
                               [--prop_from_file KEY:PATH]
                               [--kernel_cmdline CMDLINE]
                               [--setup_rootfs_from_kernel IMAGE]
                               [--include_descriptors_from_image IMAGE]
                               [--print_required_libavb_version]
                               [--chain_partition PART_NAME:ROLLBACK_SLOT:KEY_PATH]
                               [--flags FLAGS]
                               [--set_hashtree_disabled_flag]
avbtool make_vbmeta_image: error: argument --rollback_index: expected one argument

build/make/core/version_util.mk:
ifndef PLATFORM_SECURITY_PATCH_TIMESTAMP
  # Used to indicate the matching timestamp for the security patch string in PLATFORM_SECURITY_PATCH.
  PLATFORM_SECURITY_PATCH_TIMESTAMP := $(shell date -d 'TZ="GMT" $(PLATFORM_SECURITY_PATCH)' +%s)
endif
device/rockchip/common/modules/avb.mk:
BOARD_AVB_ROLLBACK_INDEX ?= $(PLATFORM_SECURITY_PATCH_TIMESTAMP)
build/make/core/Makefile:
ifdef BOARD_AVB_ROLLBACK_INDEX
  BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS += --rollback_index $(BOARD_AVB_ROLLBACK_INDEX)
endif

define build-vbmetaimage-target
  $(call pretty,"Target vbmeta image: $(INSTALLED_VBMETAIMAGE_TARGET)")
  $(hide) mkdir -p $(AVB_CHAIN_KEY_DIR)
  $(call extract-avb-chain-public-keys, $(AVB_CHAIN_KEY_DIR))
  $(hide) $(AVBTOOL) make_vbmeta_image \
    $(INTERNAL_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    $(PRIVATE_AVB_VBMETA_SIGNING_ARGS) \
    $(BOARD_AVB_MAKE_VBMETA_IMAGE_ARGS) \
    --output $@
  $(hide) rm -rf $(AVB_CHAIN_KEY_DIR)
endef
```

### 10.11 Widevine

Источник перечисляет L1 для RK3588/RK3399/RK356x, планшетам обычно L3. Актуальные L1/патчи уточните Rockchip; это не сертификат всех плат. Упаковщик FTP `GMS-Test-Suite/xTS/tools/rkpacker2`.

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

### 10.12 Keymaster & Optee

Trust OS sub-license: Optee V2 для RK3326/RK3562/RK356x/RK3588, остальным V1.

```text
PRODUCT_HAVE_OPTEE := true
```

### 10.13 Attestation key / Google keybox

До теста запросите Google keybox через3PL, упакуйте rkpacker и запишите. Инструменты `RKTools/linux/Linux_AttestationKeyboxPack_Tool.rar`, `RKTools/windows/KeyBoxWrite_v1.53.zip`, также FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`. См. `RKDocs/common/RKTools manuals/Rockchip_User_Guide_Keybox_Burning_EN.pdf`. Включите uboot-запись до сборки; для3566/3568 ниже, последний макрос неRK3399.

```text
Android_SDK/u-boot$ git diff configs/rk3568_defconfig
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y ## RK3399不配置该宏
```

Ключи eMMC security сохраняются при перепрошивке, не очистке Flash. Линия: патч uboot FTP `/GMS-Test-Suite/Exp+/Attestation key`, затем `ro.boot.deviceid`. Тестовые ключи общие Android/SoC, производство — ключи проекта. Запись вbootloader, ещё8с после завершения до выключения. uboot от2022-03, UART ret=0 — успех. Android14+ logcat: keybox/Device ID yes записан, no нет.

```text
write_key key_file=PrivateKey.RSA ret=0 ## 0表示烧写完成
write_key key_file=PrivateKey.EC ret=0
或
write attestation key: RSA ret_rsa=0

Provision google keybox:no,ID attestation:no ## yes表示已烧,no表示未烧
```

Новые пакеты требуют обе аттестации, иначе отчёт неполон/не загружается. Для3PL: отчёт одногоcase (`GtsEdiHostTestCases`), шаблон устройства, txt сID на строку иID на устройство.

```text
W/ApkInstrumentationPreparer: Target preparation step
com.android.compatibility.common.deviceinfo.KeystoreAttestationDeviceInfo#testCollectDeviceInfo failed.
junit.framework.AssertionFailedError: KeystoreAttestationDeviceInfo collection
completed. expected:<COMPLETED> but was:<FAILED>
```

ID уникален,1–32 символа, только `[a-z][A-Z][0-9][_][-][.]`, без пробелов. Файл Unix ASCII, осмысленное имя из тех же символов (`Make_Model_Date_Quantity.txt`); толькоID, без комментариев/заголовков, по одному, без повторов/пустых строк/пробелов.

100000 keybox могут исчерпать память. Разделите на4, посчитайте `</Keybox>`, задайте NumberOfKeyboxes; после последнего `</Certificate></CertificateChain></Key></Keybox>` удалите остаток, добавьте `</AndroidAttestation>`, упакуйте.100 и4 — примеры, используйте счёт.

```text
$ chmod +x rkpacker
$ ./rkpacker attest_keyboxes.output -o keybox.kdb
55488 Data File Type : KEYBOX
Output File : keybox.kdb
Data File Num : 1
Total Key Num : 100000
out of memory at line 1
```

```sh
gzip -cdk 2023-01-01_***.output.gz > attest_keyboxes.output
split -n 4 attest_keyboxes.output --additional-suffix=.xml
cat xaa.xml | grep -w "</Keybox>" | wc -l
rkpacker xaa.xml -o keybox.kdb
```

```xml
<?xml version="1.0"?>
<AndroidAttestation>
<NumberOfKeyboxes>4</NumberOfKeyboxes>
<Keybox DeviceID="BW10RS23090001"><Key algorithm="ecdsa"><PrivateKey format="pem">......
......
-----END CERTIFICATE-----
</Certificate></CertificateChain></Key></Keybox>
</AndroidAttestation>
```

При отсутствии libcrypto FTP `/GMS-Test-Suite/xTS/tools/libcrypto.so.1.0.0` в Ubuntu `/usr/lib/x86_64-linux-gnu/libcrypto.so.1.0.0`. Тестам нужны ключ и `fastboot oem at-lock-vboot`; далее источник предлагает очистку/перезапись/блокировку, с потерей данных/ключей, по разрешённой процедуре.

```text
报错信息:error while loading shared libraries: libcrypto.so.1.0.0: cannot open
shared object file: No such file or directory

CtsAppSecurityHostTestCases
CtsDevicePolicyManagerTestCases
CtsKeystorePerformanceTestCases
CtsKeystoreTestCases
VtsAidlKeyMintTargetTest
```

### 10.14 Android13 RKP

Android13+ извлекает сведения до теста и загружает через `android-partner-api@company.com`. См. `RKDocs/android/Rockchip_Android_Remote_key_Provisioning_Guide.pdf`; ошибки без загрузки:

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLength
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLength
或
GtsGmscoreHostTestCases
com.google.android.gts.security.AttestationRootHostTest#testEcAttestationChainRemProvLengthTee
com.google.android.gts.security.AttestationRootHostTest#testRsaAttestationChainRemProvLengthTee
```

Инструмент `/vendor/bin/rockchip_rkp_factory_extraction_tool`. СначалаSN; неизменныйSN не требует новогоCSR. Вместе ключ/CSR: `RKTools/windows/KeyboxWriter-v1.55.7z`; отдельно FTP `GMS-Test-Suite/xTS/tools/KeyBoxWrite_v1.53.zip`. Аккаунт минимум1–2недели; заранее.

### 10.15 Android14 Device ID Attestation

Android14+ также однократно пишет неизменяемый Device ID Attestation; для перезаписи RKDevTool.exe очистка. См. `RKDocs/android/Rockchip_User_Guide_Android_Device_ID_Attestation_Flash_CN.pdf`; FTP `/GMS-Test-Suite/xTS/tools/RKDevInfoWriteTool-V1.2.1.7z`. СначалаSN, иначеRKP сбой. Features/ошибки:

```text
10:54:48:013 ReadRkp[15]: reading sn from device fail

pm list features | grep android.software.device_id_attestation
pm list features | grep android.hardware.device_unique_attestation

CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.DeviceOwnerKeyManagementTest#testAllVariationsOfDeviceIdAttestation
报错信息:java.lang.UnsupportedOperationException: Device does not support Device ID attestation.
```

### 10.16 GKI

GKI требуется с Android12 и Linux5.4; источник охватывает RK3588 Android12 и весь Android13. См. `RKDocs/android/Rockchip_Developer_Guide_GKI_CN.pdf` и приложениеB. Используйте Google Release boot.img, размер boot64Mb по источнику; код67108864 сохранён. Проверьте vendor_boot.

```text
BOARD_BUILD_GKI := true

device/rockchip/common/build/rockchip/Partitions.mk:
  ifeq ($(BOARD_BUILD_GKI),true)
    BOARD_BOOTIMAGE_PARTITION_SIZE ?= 67108864
    BOARD_VENDOR_BOOTIMAGE_PARTITION_SIZE ?= 41943040
```

```text
ls -l /dev/block/by-name/vendor_boot*
```

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
vts_fs_test
fs#ErofsSupported
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
```

### 10.17 Версии ядра

Android12: RK3326,RK356x,RK3399,RK3288 используют4.19, не5.10; RK3588 —5.10, не4.19. Весь Android13 использует kernel-5.10; проверьте каталог.

### 10.18 Incremental FS

Шаг нужен только Android12, требуетсяV2. В kernel-4.19 не включён для старой совместимости; модули user/userdebug. Обновление ядра может нарушить ko: пересоберите по base.txt и патчам. Без старой совместимости можно встроить безko.

```text
vendor/rockchip/common/modular_kernel/4.19$ tree user*
user
`-- incrementalfs.ko
userdebug
`-- incrementalfs.ko
0 directories, 2 files

$ adb shell lsmod
Module Size Used by
bcmdhd 1150976 0
incrementalfs 77824 0

vendor/rockchip/common/modular_kernel/4.19/incrementalfs_patch

git log fs/incfs/

cat kernel-4.19/.config | grep CONFIG_INCREMENTAL_FS
# CONFIG_INCREMENTAL_FS is not set
```

Проверьте `/sys/fs/incremental-fs/features/v2` или `pm list features | grep incremental`; feature и ошибка ниже.

```text
feature:android.software.incremental_delivery=2

GtsIncrementalInstallProxyHostTestCases
com.google.android.packageinstallerv2proxy.host.gts.ConcurrentInstallationHostTest#testConcurrentInstallWithOneFailure
报错信息:java.lang.AssertionError: expected:<SUCCESS> but was:<FAILURE>
关键打印:[incfs] Feature is not enabled
I InstallationHelper: Commit
I IncrementalService: createStorage: /data/app/vmdl1270450043.tmp | 5
W incfs : [incfs] Feature is not enabled
E IncrementalService: Vold::mountIncFs() failed: Status(-8,
EX_SERVICE_SPECIFIC): '-95: '
E InstallationHelper: Installation Failed. Error Code: 6, message:
INSTALL_FAILED_MEDIA_UNAVAILABLE: Couldn't create incremental storage at
/data/app/vmdl1270450043.tmp
```

### 10.19 Подписи

См. build/target/product/security/README. Создайте media/platform/shared/testkey, по pem,pk8,x509.pem:12 файлов. Пароль пустой, иначе ошибка. OTA_KEY_DIR в device/rockchip/common/mkimage.sh — device/rockchip/common/security. Android11/12/14 заменяют build/target/product/security, Android13 — device/rockchip/common/security.

```text
build/target/product/security/README

  development/tools/make_key testkey '/C=CN/ST=Fujian/L=Fuzhou/O=Rockchip/OU=Rockchip/CN=Rockchip/emailAddress=gms@rock-chips.com'
  生成:testkey.pk8 testkey.x509.pem ## 文件在根目录下
  openssl pkcs8 -inform DER -nocrypt -in testkey.pk8 -out testkey.pem
  生成:testkey.pem

# Android 13替换到如下目录
device/rockchip/common/security/
# Android 14替换到如下目录
build/target/product/security/

Enter password for 'testkey' (blank for none; password will be visible):
 ## 不设密码直接回⻋Enter
报错信息:Error decrypting key
139:error:0D0680A8:asn1 encoding routines:asn1_check_tlen:wrong
tag:../crypto/asn1/tasn_dec.c:1149:
139:error:0D06C03A:asn1 encoding routines:asn1_d2i_ex_primitive:nested asn1
error:../crypto/asn1/tasn_dec.c:713:
139:error:0D08303A:asn1 encoding routines:asn1_template_noexp_d2i:nested asn1
error:../crypto/asn1/tasn_dec.c:646:Field=version, Type=PKCS8_PRIV_KEY_INFO
```

BTS проверяет скомпрометированный ключ framework-res: замените platform.pk8 и x509.pem. Три сертификата Bluetooth ниже должны совпадать.

```text
Blocked app /system/framework/framework-res.apk
报错信息:This build contains pre-installed "android" at
/system/framework/framework-res.apk which has been signed by a certificate that
is known to be compromised and should be replaced.

device/rockchip/common/security/bluetooth.x509.pem
packages/modules/Bluetooth/android/app/certs/com.android.bluetooth.x509.pem
vendor/partner_modules/build/certificates/bluetooth.x509.pem
```

### 10.20 Подписи Apex

Обычный GMS также требует замены. btservices: packages/modules/Bluetooth/apex. Для i18n сначала source/lunch; после замены make clean. АлгоритмSHA256_RSA4096. При ошибке переоткройте терминал, проверьте кэш /tmp/ApexSignatureVerificationTest***.

```text
CtsAppSecurityHostTestCases
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:java.lang.AssertionError: must not use well known pubkey
        Expected: must not match well known key
         but: was
</tmp/ApexSignatureVerificationTest13030241211815479418/tests-apex_com.android.btservices874024/apex_pubkey>
GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
报错信息:1. com.rockchip.hardware.sensors must not use well known pubkey

          expected to be false
        7. com.android.rkpd must not use well known pubkey
          expected to be false
解决方法:根据报错信息替换apex_com.android.btservices签名(SDK目录
packages/modules/Bluetooth/apex)
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
报错信息:These packages should not be signed with a well known key:
[com.android.bluetooth, com.android.btservices, com.android.i18n,
com.android.rkpd, com.android.runtime, com.android.uwb,
com.android.uwb.resources, com.android.virt, com.android.vndk.v34,
com.rockchip.hardware.sensors]

cd libcore/apex/
rm com.android.i18n.pem com.android.i18n.avbpubkey
openssl genrsa -out com.android.i18n.pem 4096 ## 注意换行
avbtool extract_public_key --key com.android.i18n.pem --output com.android.i18n.avbpubkey

报错信息:avbtool: Adding hashtree_footer failed: Key is wrong size for algorithm SHA256_RSA4096.
```

Пути: i18n Android13/12 packages/modules/RuntimeI18n/apex, Android11 libcore/apex; runtime — bionic/apex; art не нужен13/12, art/build/apex на11. В таблице также пустая строка btservices, хотя текст называет три модуля.

### 10.21 Предустановленные приложения

User-сборка проверяет разрешения. Без Express возникает ошибка ниже: удаляйте проверку только после проверки стандартных API/разрешений. Для отладки enforce замените log. Без adb используйте boot-debug.img для boot (A/B boot_a/boot_b), GKI vendor_boot-debug.img для vendor_boot_a/vendor_boot_b.

```text
error: Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!

Android_SDK/device/rockchip/common$ git diff modules/gms.mk
   ifeq ($(strip $(TARGET_BUILD_VARIANT)), user)
     ifneq ($(strip $(BUILD_WITH_GOOGLE_GMS_EXPRESS)),true)
       $(warning ****************************************)
- $(error Please note that all your apps MUST be able to get permissions, Otherwise android cannot boot!)
       $(warning After confirming your apps, please remove the above error line!)
       $(warning ****************************************)

device/rockchip/common/modules/gms.mk:
# Enforce privapp-permissions whitelist only for user build.
PRODUCT_PROPERTY_OVERRIDES += \
    ro.control_privapp_permissions=enforce --> 改为
ro.control_privapp_permissions=log
```

Ищите not in privapp-permissions allowlist; разрешение добавьте в раздел APK. Ниже system_ext Wallpaper. Не включайте RKDeviceTest,Lightning,StressTest,RKUpdateService.

```text
W PackageManager: Privileged permission
android.permission.READ_WALLPAPER_INTERNAL for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.SET_WALLPAPER_COMPONENT for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission
android.permission.CHANGE_OVERLAY_PACKAGES for package
com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in
privapp-permissions allowlist
W PackageManager: Privileged permission android.permission.WRITE_SECURE_SETTINGS
for package com.google.android.apps.wallpaper (/system_ext/priv-app/WallpaperGoogle) not in privapp-permissions allowlist

Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ </privapp-permissions>
 </permissions>
```

### 10.22 Предварительные проверки

Безопасный режим: громкость вниз во время анимации или долгое нажатие Перезагрузка. Lockdown: пароль, Настройки→Безопасность и местоположение→Настройки экрана блокировки→Показать блокировку. Шифрование: Настройки→Безопасность→Дополнительно→Шифрование и учётные данные→Зашифровать планшет.

## 11 GMS Express

GMS Express предоставляет ежемесячные обновления безопасности. Таблица сохраняет Regular/Go; звёздочки не определены и не подтверждают доступность.

| Чип | Android12 Regular/Go | Android13 Regular/Go | Android14 Regular/Go |
| --- | --- | --- | --- |
| RK3288 | Y/N | */N | N/N |
| RK3326 | Y/Y | */Y | * |
| RK3399 | Y/N | */N | */N |
| RK3562 | N/N | Y/Y | Y/Y |
| RK3566 | Y/Y | Y/Y | Y/Y |
| RK3576 | N/N | N/N | */N |
| RK3588 | Y/N | Y/N | Y/N |

### 11.1 Заявка и сопровождение

Нужны MADA и соответствующее Go-приложение; EDLA использует конфигурацию ниже. Express включает ежемесячные патчи,GMS,важные обновления AOSP; уведомляйте клиентов и обновляйте OTA, иначе Rockchip прекращает поддержку. SDK отличается: запросите через продажи с подтверждением квалификации.

### 11.2 SDK и конфигурация

С Android10 код общий: смените manifest без полной загрузки. Регистр имён сохранён.

```text
repo init -m Android10_Express.xml
# Android 11请使用Android 11的xml
repo init -m Android11_Express.xml
# Android 12请使用Android 12的xml
repo init -m Android12_express.xml
# Android 13请使用Android 13的xml
repo init -m Android13_Express.xml
# Android 14请使用Android 14的xml
repo init -m Android14_Express.xml

repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
# Android 12
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_S/manifests.git -m Android12_express.xml
# Android 13
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_T/manifests.git -m Android13_Express.xml
# Android 14
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests.git -m Android14_Express.xml

BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

Макрос удаляет RK-приложения, добавьте свои. GMSEXPRESS_BUILD управляет функциями, база ExpPlus. После изменений проверьте Exp+ до смены PLUS. Возможные субсидии уточняются у3PL, не EDLA и не обещание.

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

EDLA не использует Express, но true включает features форм-фактора gms-express.xml. Без батареи нужен FTP GMS-Test-Suite/Exp+/batteryless.diff. Все имена с префиксом com.google.android.feature.: без батареи other_form_factor,batteryless_device; с батареей и >18дюймов other_form_factor,large_display; без батареи >18дюймов все три; отдельный экран без батареи other_form_factor,batteryless_device,headless_device.

```text
Android_SDK/vendor/rockchip/common$ git diff gms-express.xml
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.ENTERPRISE_DEVICE" />
+ <feature name="com.google.android.feature.batteryless_device"/>
  </config>
```

## 12 Настройка хоста

### 12.1 Среда хоста Ubuntu

Источник требует хост Ubuntu, а не Windows, с настроенными Java, Python, adb, fastboot и aapt. Ниже приведены FTP исправлений безопасности Rockchip и реквизиты, напечатанные в источнике; их актуальность и доступность не проверены. Исправления и инструменты Android 12+ находятся в `GMS-Test-Suite/Exp+`.

| Адрес | Аккаунт | Пароль |
| --- | --- | --- |
| ftp://ftp.rock-chips.com | xzj-guest | V3qTwMQ4YV |

Источник рекомендует распаковать FTP-архив `Android_O_cts_env.tar.gz`, добавить переменные в `~/.bashrc` либо сохранить файл `env` и выполнить `source env` перед тестом. Замените `Your_Name`. Затем обновите adb, aapt и fastboot по §12.2; слишком старые версии приводят к ошибкам.

```sh
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77 ## 注意替换Your_Name
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH

$ aapt version
$ adb --version
$ fastboot --version
$ java --version
```

| Версия Android | Минимум adb | Минимум fastboot |
| --- | --- | --- |
| Android 10.0 | 29.0.6+ | 29.0.6+ |
| Android 11.0 | 30 | 30 |
| Android 12.0 | 31 | 31 |
| Android 12.1 (Android 12L) | 31 | 31 |
| Android 13 | 33 | 33 |

Если aapt недоступен, установите библиотеки совместимости C++, иначе возможен сбой CtsDeqpTestCases. Затем установите средства разработки Python, Protocol Buffer и виртуального окружения. Для Python 3 может понадобиться последний пакет.

```sh
$ sudo apt-get install lib32stdc++6 lib32z1
$ sudo apt-get install python-dev
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
$ sudo apt install virtualenv
```

### 12.2 Проблемы среды хоста

**1. Не создаётся виртуальное окружение.** Для этой ошибки VTS источник предлагает связать pip с pip2 и установить virtualenv через pip. Это операции для исторической среды; здесь они не выполнялись.

```sh
$ sudo apt autoremove python-virtualenv
$ sudo apt autoremove virtualenv
$ sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
$ pip install --user virtualenv
```

**2. Обновление adb, aapt и fastboot.** Замените их инструментами SDK; см. `Rockchip_Android_*_development_guide_V*_CN.pdf`. Для adb сначала найдите путь и остановите сервер, затем замените бинарные файлы. FTP-архив: `GMS-Test-Suite/sdk_tools.tar.gz`. Старый fastboot может выдавать следующую ошибку для `fastboot reboot fastboot`.

```text
$ whereis adb
adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
$ adb kill-server
fastboot: usage: unknown reboot target fastboot
```

**3. Новым наборам тестов нужен aapt2.** Две ошибки приведены ниже. Найдите aapt, скопируйте `out/host/linux-x86/bin/aapt2` из SDK в `/home/rockchip/Software/sdk_tools/aapt2` на Ubuntu и выполните `chmod 775 aapt2`. Фрагмент сборки из источника не содержит полного завершающего контекста.

```text
java.io.IOException: Cannot run program "aapt2": error=2, No such file or directory
E/AaptParser: aapt2 dump badging stderr: W/ziparchive(2284292): Unable to open 'badging': No such file or directory
$ which aapt
/home/rockchip/Software/sdk_tools/aapt

prebuilts/sdk/tools/Android.bp
cc_prebuilt_binary {
    name: "aapt2",
    host_supported: true,
    prefer: true,
    target: {
        linux: {
            srcs: ["linux/bin/aapt2"],
        },
        darwin: {
            srcs: ["darwin/bin/aapt2"],
        },
        windows: {
            srcs: ["windows/bin/aapt2.exe"],
        },
    },
```

**4. adb devices сообщает no permissions.** Получите VID/PID через lsusb, внесите фактические значения в правило udev, переподключите кабель adb и повторите запрос. `1f3a:1001` — пример источника, не универсальное значение.

```text
$ adb devices
List of devices attached
CKP0KUIQQ1 no permissions(missing udev rules? user is in the plugdev group);
see http://developer.android.com/tools/device.html

$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 070: ID 1f3a:1001 Onda (unverified)
## 获取adb设备识别码1f3a:1001
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

$ sudo vim /etc/udev/rules.d/android.rules
SUBSYSTEM=="usb",ATTRS{idVendor}=="1f3a",ATTRS{idProduct}=="1001",MODE="0666"
## 添加adb设备注意替换1f3a:1001

$ adb devices
List of devices attached
CKP0KUIQQ1 device
```

**5. fastboot devices сообщает no permissions.** Выполните lsusb в режиме fastboot и добавьте его VID/PID; идентификаторы fastboot и adb различаются.

```text
$ fastboot devices
no permissions(missing udev rules? user is in the plugdev group); see [......]
Android Fastboot
```

**6. Ошибка JNI в CtsUsesNativeLibraryTest.** Решение источника — обновить JDK из FTP `/GMS-Test-Suite/openjdk-11+28_linux-x64_bin.tar.gz`. Ошибка и проверка:

```text
java.lang.RuntimeException: Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError:
com/android/signapk/SignApk has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java Runtime only recognizes class file versions up to 52.0

$ java --version
openjdk 11 2018-09-25
OpenJDK Runtime Environment 18.9 (build 11+28)
OpenJDK 64-Bit Server VM 18.9 (build 11+28, mixed mode)
$ whereis java
java: /usr/share/java /home/Rockchip/Software/jdk-11/bin/java
```

**7. Недостаток памяти кучи Ubuntu.** Источник требует минимум 16 ГБ ОЗУ хоста и предлагает перезагрузку перед повторным тестом.

```text
E/CommandScheduler: Java heap space
java.lang.OutOfMemoryError: Java heap space
${JAVA_BINARY} $RDBG_FLAG -Xmx16g -XX:+HeapDumpOnOutOfMemoryError -cp ${JAR_PATH} -DCTS_ROOT=${CTS_ROOT}
```

### 12.3 Тестовая среда Docker

Вместо настройки Ubuntu выше источник предлагает контейнер Docker из FTP `GMS-Test-Suite/xTS/tools/Docker` для тестирования.

## 13 Сертификационные тесты GMS

### 13.1 Подготовка к тестам

1. Прошейте DUT по примечаниям к выпуску Rockchip Android SDK.
2. Первый запуск с GMS дольше обычного: дождитесь его, выберите United States English, сначала пропустите Wi-Fi, выберите часовой пояс США, не входите в аккаунт и откройте Home.
3. Затем подключите Wi-Fi и VPN на устройстве и Ubuntu-хосте; хост подключается напрямую, не через SSR.
4. До CTS/GTS не входите в GMS. Исключение: отдельный тест EEA Go `GtsRegulationComplianceTestCases` требует тестового EEA-аккаунта и поисковика не Google, например DuckDuckGo, по EEA-документации.
5. В Settings → Security → Screenlock выберите None.
6. При физической клавиатуре включите Languages & input → Physical keyboard → Show virtual keyboard.
7. Многократно нажмите Settings → About tablet (phone) → Build Number для Developer Options.
8. Включите Developer options → Stay awake.
9. Оставьте Settings → Location включённым.
10. Установите максимальный Display → Sleep и минимальную яркость для длительных тестов.
11. Включите Display → Adaptive brightness (требование Android 13 по источнику).
12. Используйте новые ресурсы android-cts-media-version; см. §14.
13. Выполните `source copy_media.sh && source copy_image.sh` из медиапакета либо разместите его в `/tmp/android-cts-media/android-cts-media-1.4`; Android 11+ требует media-1.5.
14. Перед VTS проверьте калибровку Sensor. Она сохраняется, но после обновления прошивки проверяется снова. Некалиброванное устройство должно лежать горизонтально и неподвижно; для user-прошивки установите vendor_boot-debug.img и выполните команды ниже.

```text
$ adb root
adbd is already running as root
$ adb shell
console:/ $ cat /sys/class/sensor_class/accel_calibration
read error ## 未校准
console:/ $ echo 1 > /sys/class/sensor_class/accel_calibration ## 机器水平静止放置
console:/ $
console:/ $ cat /sys/class/sensor_class/accel_calibration
accel calibration: 166, -309, -177 ## 校准成功
```

15. Физически портретные экраны устанавливайте вертикально, альбомные — горизонтально.
16. Перед этими тестами не задавайте PIN-блокировку (`Device must have screen lock disabled`).
17. Убедитесь, что SN не меняется после перезагрузки; см. §15.4.
18. Повторяйте настройку перед каждым новым тестом.

Примечание: §13.10 отдельно требует PIN для некоторых интерактивных тестов CTS-Verifier; учитывайте контекст теста.

### 13.2 Запуск тестовых консолей

```sh
Rockchip@Rockchip-pc:~/android-cts/tools$ ./cts-tradefed ## CTS测试终端
Rockchip@Rockchip-pc:~/android-vts/tools$ ./vts-tradefed ## VTS测试终端
Rockchip@Rockchip-pc:~/android-gts/tools$ ./gts-tradefed ## GTS测试终端
Rockchip@Rockchip-pc:~/android-sts/tools$ ./sts-tradefed ## STS测试终端
Rockchip@Rockchip-pc:~/android-apts-go/tools$ ./apts-tradefed ## APTS测试终端
```

### 13.3 Тестирование на нескольких устройствах

Большинство тестов поддерживает `--shard-count`. Источник предупреждает: отключение питания или зависание одного устройства теряет все его отчёты и искажает число модулей. Предлагается сначала стабилизировать устройства, тестировать одно десять минут и отключить его для получения полного отчёта, затем выполнить retry отчёта на нескольких устройствах.

```sh
run cts --shard-count 3 -s SN1 -s SN2 -s SN3 ## 3台机器同时跑CTS
```

### 13.4 Исключение модуля или теста

```sh
run cts --exclude-filter "CtsViewTestCases"
run cts --exclude-filter "CtsViewTestCases android.view.cts.SurfaceViewSyncTests#testEmptySurfaceView"
```

### 13.5 Прошивка GSI

Подтвердив разблокировку, войдите в fastbootd и прошейте system.img GSI и misc.img из сборки прошивки; затем recovery выполняет сброс. Шаг 1: bootloader и разблокировка; при записанном публичном ключе AVB используйте соответствующее руководство. Шаг 2: сброс и fastbootd. Шаг 3: GSI; при недостатке места удалите product либо оба product_a/product_b для A/B и virtual A/B. Процедура источника ниже не выполнялась.

```sh
adb reboot bootloader
fastboot oem at-unlock-vboot ## 对于烧写过avb公钥的客户，请参考对应的文档解锁。
fastboot reboot fastboot ## 此时将进入fastbootd
## (可选)对于分区空间紧张的设备，可以先执行本条命令删除product分区后再烧写GSI
fastboot delete-logical-partition product
## 对于使用A/B，虚拟A/B的设备，需要同时删除product_a/product_b
fastboot delete-logical-partition product_a
fastboot delete-logical-partition product_b
fastboot flash system system.img
## 烧misc.img恢复出厂设置(否则机器开机可能卡在加载界面)，misc是固件一起编译出来的
fastboot flash misc misc.img
## VTS测试：GKI固件烧写vendor_boot-debug.img到vendor_boot分区；非GKI固件烧写boot-debug.img到boot分区
fastboot flash vendor_boot vendor_boot-debug.img
## 烧写成功后，重启
fastboot reboot
```

1. Можно использовать DSU (Dynamic System Updates), который по источнику включён по умолчанию. Из-за расхода памяти не рекомендуется 2G DDR или меньше; см. документацию Android.
2. VTS также требует boot-debug.img в boot либо vendor_boot-debug.img в vendor_boot для GKI; устройство остаётся разблокированным.
3. Для CTS-ON-GSI эти debug-образы не нужны.
4. Используйте официальные GSI Google с префиксом signed- и Release-build GKI boot.
5. Если GSI не загружается, прошейте подходящий debug-образ и соберите logcat через adb/последовательный порт.

| Идентификатор источника | Описание загрузки |
| --- | --- |
| aosp-android11-gsi | Android 11 PAB GSI; поиск aosp_arm64-img |
| aosp-android12-gsi | Android 12 PAB GSI; поиск aosp_arm64-img |
| aosp-android13-gsi | Android 13 PAB GSI; поиск aosp_arm64-img |
| aosp-android13-gsi | Android 14 PAB GSI; поиск aosp_arm64-img |

Строка Android 14 в источнике всё ещё содержит aosp-android13-gsi; противоречие сохранено без угадывания версии загрузки.

### 13.6 Состояние блокировки VTS / CTS-ON-GSI

- CTS/GTS: полная OEM-прошивка, блокировка перед тестом через `fastboot oem at-lock-vboot`.
- CTS-on-GSI: разблокировка, GSI, повторная блокировка; источник отдельно исключает повторную блокировку для Android 13+.
- VTS: разблокировка, boot-debug и GSI, без блокировки.

Для CTS-on-GSI нужен signed- GSI с уровнем патчей не ниже SDK, иначе после блокировки загрузка невозможна. После GSI Security Patch отражает его уровень, а не исходную прошивку. Android 11/12 CTS и CTS-on-GSI требуют указанной блокировки, иначе возможны ошибки ниже; Android 13+ CTS-ON-GSI её не требует.

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked

console:/ $ getprop | grep ro.boot.verifiedbootstate
[ro.boot.verifiedbootstate]: [orange] ## 属性值orange表示机器未锁定
[ro.boot.verifiedbootstate]: [green] ## 属性值green表示机器已锁定
console:/ $ getprop | grep ro.boot.vbmeta.device_state
[ro.boot.vbmeta.device_state]: [unlocked] ## 属性值unlocked表示机器未锁定
[ro.boot.vbmeta.device_state]: [locked] ## 属性值locked表示机器已锁定
```

### 13.7 VTS

Дополнительно прошейте подписанный AOSP system-xxx-signed.img из Google, 3PL или FTP Rockchip и boot-debug.img. При AVB результаты упаковки находятся в rockdev/Image-xxx; вариант GKI указан выше.

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run vts` | `run retry --retry 0` | `run vts -m module_name -t case_name` |

### 13.8 CTS-ON-GSI

Прошейте подписанный GSI, как выше. Источник различает текущую таблицу и пакет для Android 10 и старше:

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-cts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

Android 10 и старше:

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-vts-xxx-arm_64.zip | `run cts-on-gsi` | `run retry --retry 0` | `run cts-on-gsi -m module_name -t case_name` |

### 13.9 CTS

Используйте полную user-прошивку, настроенную выше.

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-cts-_xxx-linux_x86-arm.zip | `run cts` | `run retry --retry 0` | `run cts -m module_name -t case_name` |

### 13.10 CTS-Verifier

Используйте полную user-прошивку. В пакете `android-cts-verifier-xx_xx-linux_x86-arm.zip` запуск, повтор и отдельные тесты выполняются вручную. Следуйте порядку с учётом версии:

1. До установки:

```sh
adb shell settings put global hidden_api_policy 1
```

2. Затем установите этой командой:

```sh
adb install -r -g CtsVerifier.apk
```

3. Android 10+:

```sh
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

4. Android 11+:

```sh
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

5. Android 13+:

```sh
adb shell am compat enable ALLOW_TEST_API_ACCESS com.android.cts.verifier
```

6. Android 14+:

```sh
adb shell appops set com.android.cts.verifier TURN_SCREEN_ON 0
```

7. Установите правильное системное время.
8. Для CTS-Verifier задайте PIN в мастере после прошивки, иначе Notification Listener Test может не найти пункт и завершиться ошибкой.
9. Отчёты: `/storage/emulated/0/VerifierReports/`.

Перед Controls Panel tests также нужен PIN.

### 13.11 GTS

Используйте настроенную user-прошивку. В мастере подключите VPN Wi-Fi без входа в Google. Проверьте среду хоста и ключ GTS через `echo $APE_API_KEY`. Получите key.json у 3PL и задайте переменную. Источник описывает ошибки сервисного аккаунта и заявку в разрешающий список EDI.

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json ## 注意替换/path/to
Test failed due to failed service account authentication, please ensure service account key is installed and try again.

run gts -m GtsEdiHostTestCases
This device isn't Play Protect certified
Test failed due to unrecognized service account for this product, please submit an initial GTS report for this product with full EDI (run gts -m GtsEdiHostTestCases) at https://partner.android.com/approvals/upload-report and try again.
```

Передайте отчёт модуля (пример `android-gts/results/2023.01.01_01.01.01.zip`) в 3PL для загрузки Google и EDI-разрешения. Здесь ничего не отправлялось.

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts` | `run retry --retry 0` | `run gts -m module_name -t case_name` |

Без Attestation key после подключения VPN Wi-Fi в мастере возможен журнал:

```text
E/DynamiteLoaderV2Impl( 4625): gzh: Can't load code for GoogleCertificates.apk
E/GoogleCertificates( 4625): Failed to get Google certificates from remote
E/GoogleCertificates( 4625): amh: Remote load failed. No local fallback found.
D/AndroidRuntime( 4813): Shutting down VM
E/AndroidRuntime( 4813): FATAL EXCEPTION: main
E/AndroidRuntime( 4813): Process: com.google.android.apps.restore, PID: 4813
E/AndroidRuntime( 4813): java.lang.SecurityException: GoogleCertificatesRslt: module init: Remote load failed. No local fallback found. (go/gsrlt)
```

### 13.12 GTS-Verifier

По источнику Android 14+ больше не тестирует GTS-Verifier; см. [GTS-Verifier](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en).

### 13.13 GTS Interactive

Источник описывает требование Android 13+ как замену ручных тестов GTS-Verifier; следуйте подсказкам устройства.

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-gts-xx.zip | `run gts-interactive` | `run retry --retry 0` | `run gts-interactive -m module_name -t case_name` |

### 13.14 STS

Используйте настроенную userdebug-прошивку. Ошибки рассматриваются в SDK-руководстве по патчам безопасности Android. Пароль STS ZIP по источнику — `sts`. Патчи ищите в [бюллетене безопасности Android](https://source.android.com/docs/security/bulletin/asb-overview).

| Пакет | Запуск | Повтор | Отдельный тест |
| --- | --- | --- | --- |
| android-sts-xx.zip | `sts-dynamic-full` | `run retry --retry 0` | `run sts -m module_name -t case_name` |

### 13.15 Тест производительности GOATS

Используйте настроенную userdebug-прошивку. Ядро собирается Clang с патчем ниже. Лицензионный заголовок кода сохранён.

```diff
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
 depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

### 13.16 APTS

Используйте полную userdebug-прошивку. Устройства Go с Android 12+ проходят новые тесты APTS вместо GOATS. Укажите fingerprint соответствующей user-прошивки; retry не поддерживается. Пример источника заканчивается `user/release`, без дополнений.

| Пакет | Команда | Отдельный тест |
| --- | --- | --- |
| android-apts-go.zip | `run test/approval-go --fingerprint-swap google/wembley/wembley:12/SP1A.210712.001/7539480:user/release` | `run test/approval-go --test-case app-start-cold-3p` |

### 13.17 BTS

Источник указывает требование Android BTS (Build Test Suite) для сертифицируемых устройств с 2018-04-01; см. [Partner](https://support.google.com/androidpartners_gms/answer/9027630?hl=en). Не загружайте упакованный update.img: Google его не разбирает; уточняйте процедуру у 3PL. Поместите образы в каталог по fingerprint, замените `:` и `/` на `~`, затем создайте ZIP.

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$ ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img vbmeta.img
```

В GMS-прошивке virtual A/B нет recovery.img. Для GKI добавляются vendor_boot.img и init_boot.img, а boot-debug.img заменяется vendor_boot-debug.img.

Источник сообщает об отказах из-за PHA (вредоносных приложений) в BTS даже после успешных тестов GMS. Предлагается предварительная проверка предустановленных приложений в Google Play с 3PL/TAM. Здесь приложения и прошивки не загружались.

## 14 Тесты с локальными медиапакетами

### 14.1 Локальные медиа CTS

Локальные медиа исключают сетевые проблемы и задержки запуска видео. Получите их по инструкции Google либо из FTP `GMS-Test-Suite/xTS/CTS_local_media_package`.

1. Загрузите media 1.5 и пакет онлайн-тестов.
2. Передайте онлайн-медиа в sdcard устройства.
3. Распакуйте media 1.5 в Ubuntu `/tmp/android-cts-media/android-cts-media-1.5`.
4. Запустите команду ниже с фактическим путём. Путь распаковки и путь команды в источнике различаются; оба сохранены, перед использованием их нужно согласовать.

```sh
$ adb push CtsMediaTestCases /sdcard/
run cts -m CtsMediaTestCases \
--module-arg CtsMediaTestCases:config-url:https://storage.googleapis.com/cts_media/DynamicConfig_local.json \
--module-arg CtsMediaTestCases:local-media-path:/tmp/android-cts-media-1.5
```

### 14.2 Локальные медиа GTS

Это также исключает сетевые проблемы и задержки видео. Получение — по Google либо FTP `GMS-Test-Suite/xTS/GTS_local_media_package`.

1. Загрузите GtsExoPlayerTestCases, GtsYouTubeTestCases и GtsMediaTestCases.
2. Передайте локальные медиа в sdcard.
3. Выполните полную команду ниже.
4. Для отдельного теста замените имя модуля; пример источника — WvtsDeviceTestCases.

```sh
$ adb push gts test wvmedia /sdcard/
run gts \
--module-arg GtsExoPlayerTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "GtsYouTubeTestCases:skip-media-download:true" \
--module-arg "GtsYouTubeTestCases:instrumentation-arg:media-path:=/sdcard/test" \
--module-arg "GtsMediaTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"

run gts -m WvtsDeviceTestCases \
--module-arg WvtsDeviceTestCases:config-url:https://storage.googleapis.com/exoplayer-test-media-1/gen-4/dynamic-config-sdcard-1.0.json \
--module-arg "WvtsDeviceTestCases:instrumentation-arg:media-path:=file:///sdcard/wvmedia"
```

Частые ошибки, проверяемые по источнику с локальными медиа:

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineH264PlaybackTests#testL3WithUHD60
com.google.android.wvts.WidevineH264PlaybackTests#testClearWithUHD60
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSuperFramesL3WithUHD30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMProfile210bitCencSuperFramesL3With1080P30
com.google.android.wvts.WidevineVP9WebMPlaybackTests#testVP9WebMCencSubSampleL3WithUHD60
```

Ссылки источника для §12–14 (Partner может требовать разрешённый аккаунт):

- [EEA choice screen](https://docs.partner.android.com/gms/policies/restricted/eea-builds?hl=en#choice-screen)
- [Android 11 GSI](https://ci.android.com/builds/branches/aosp-android11-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 12 GSI](https://ci.android.com/builds/branches/aosp-android12-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 13 GSI](https://ci.android.com/builds/branches/aosp-android13-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [Android 14 GSI](https://ci.android.com/builds/branches/aosp-android14-gsi/grid?legacy=1&selected-targets=aosp_arm64-userdebug)
- [VTS / Treble](https://docs.partner.android.com/gms/testing/vts/treble-compliance?hl=en#sample-test-flor-without-dsu)
- [CTS-Verifier setup](https://source.android.com/docs/compatibility/cts/verifier?authuser=2#setup)
- [Partner builds](https://partner.android.com/approvals/builds?a=1991659975&pli=1)
- [CTS local media setup](https://source.android.com/docs/compatibility/cts/run-locally#sd-setup)
- [CTS media 1.5](https://dl.google.com/dl/android/cts/android-cts-media-1.5.zip)
- [CtsMediaTestCases](https://storage.googleapis.com/cts_media/CtsMediaTestCases.zip)
- [GTS media testing](https://docs.partner.android.com/gms/testing/gts/running-gts?hl=en#run-media-tests)
- [GtsExoPlayerTestCases media](https://storage.googleapis.com/exoplayer-test-media-1/gen-4/exoplayer-gts-media.zip)
- [GtsYouTubeTestCases media](https://storage.googleapis.com/youtube-test-media/gts/GtsYouTubeTestCases-media-1.2.zip)
- [GtsMediaTestCases media](https://storage.googleapis.com/gts_media/wvmedia-gts-media.zip)

Ссылка DSU в источнике имеет неверный протокол: `http://https//source.android.com/devices/tech/ota/dynamic-system-updates`. Она сохранена как текст. Метка GSI для Android 14 говорит android13, но PDF-ссылка ведёт на android14; различие явно отмечено.

## 15 Настройка продукта

### 15.1 Обновление пакета GMS

Источник распаковывает пакет, удаляет соответствующие APK, добавляет APK в систему контроля версий и затем предлагает вручную сравнить локальные изменения перед включением. Комментарий называет удаление `*x86*apk` «удалением 32-битных приложений», однако шаблон имени не означает все 32-битные приложения. Исходная команда и комментарий сохранены для проверки.

```sh
Android_SDK$ unzip -o gms-oem-U-14-202403.zip -d vendor/
Android_SDK/vendor/partner_gms$ find . -name "*x86*apk" | xargs rm -rf ## 删除32Bit应用
Android_SDK/vendor/partner_gms$ find . -name "*.apk" | xargs git add
Android_SDK/vendor/partner_gms$ git status ./ ## 查到本地修改差异，手动比对再合入
```

### 15.2 Просмотр системной конфигурации

Утилита FTP `/GMS-Test-Suite/xTS/tools/OverlayTools.apk` показывает настройки системы и приложений; выберите соответствующий Data Type.

```sh
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_automatic_brightness_available
```

### 15.3 Версия RKSDK

Прочитайте свойство:

```sh
getprop | grep ro.rksdk.version
```

```text
device/rockchip/common/device.mk:
ro.rksdk.version=ANDROID$(PLATFORM_VERSION)_RKR5
```

### 15.4 Правила серийного номера устройства

Для записи SN перейдите в bootloader. Утилита SDK: `RKTools/windows/RKDevInfoWriteTool-1.3.0.7z`. Источник требует начальную букву, 7-bit ASCII, ограничение Rockchip 6–14 байт и соответствие `^[A-Za-z0-9]+$`, без символов `.` и `_`. Само выражение допускает начальную цифру, а длина буфера в коде равна 33; расхождения с текстом сохранены. Размер буфера не определяет допустимую длину SN.

```text
hardware/rockchip/drmservice/Android.mk:
# Verify sn with pattern "^[A-Za-z0-9]+$"
ifeq ($(BUILD_WITH_GOOGLE_MARKET), true)
LOCAL_CFLAGS += -DENABLE_SN_VERIFY
endif

hardware/rockchip/drmservice/drmservice.c:
#define SERIALNO_PATTERN "^[A-Za-z0-9]+$"
#define SERIALNO_BUF_LEN 33

CtsAppSecurityHostTestCases
android.appsecurity.cts.AccessSerialNumberTest#testGetSerialReturnsExpectedFormat
CtsUsbTests
com.android.cts.usb.TestUsbTest#testUsbSerialReadOnDeviceMatches
```

### 15.5 Изменение уровня API

Получите текущий уровень API и измените его настройками ниже. По источнику платформы Rockchip с Android 14+ добавляют GRF и требуют `BOARD_SHIPPING_API_LEVEL`, иначе возникает указанный сбой теста.

```sh
getprop | grep first_api_level
```

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef PRODUCT_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.product.first_api_level=$(PRODUCT_SHIPPING_API_LEVEL)
endif

device/rockchip/rk3588/BoardConfig.mk:
BOARD_SHIPPING_API_LEVEL := 34

build/make/core/main.mk:
ifdef BOARD_SHIPPING_API_LEVEL
ADDITIONAL_VENDOR_PROPERTIES += ro.board.first_api_level=$(BOARD_SHIPPING_API_LEVEL)
endif

GtsOsTestCases
com.google.android.os.gts.GoogleRequirementFreezeTest#testChipsetInfo
```

### 15.6 Согласование dpi и aapt

Несоответствие `ro.sf.lcd_density` и `PRODUCT_AAPT_PREF_CONFIG` вызывает ошибку ниже; значения должны соответствовать друг другу и стандарту Google, на который ссылается источник. Рассчитайте dpi по физическому размеру экрана и разрешению `wm size`, затем сопоставьте со стандартными dpi/aapt. Для расчётных 200 dpi источник выбирает ближайшие 213 dpi (tvdpi); tvdpi также должен входить в `PRODUCT_AAPT_CONFIG`.

```text
CtsThemeHostTestCases
android.theme.cts.ThemeHostTest#testThemes
FAILURE: junit.framework.AssertionFailedError: 36 failures in theme test

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_PROPERTY_OVERRIDES += ro.sf.lcd_density=213
PRODUCT_AAPT_PREF_CONFIG := tvdpi

device/rockchip/common/device.mk:
PRODUCT_AAPT_CONFIG ?= normal large xlarge hdpi tvdpi xhdpi xxhdpi
```

### 15.7 Изменение clientidbase

Настройте `ro.com.google.clientidbase` по собственным реквизитам MADA/EDLA; не используйте Rockchip `android-rockchip`. Ниже это лишь пример источника. Результат сборки: `out/target/product/rk3588s_t/system/build.prop`.

```text
Android_SDK/vendor/rockchip/common$ git diff gms/gms.prop
+ro.com.google.clientidbase=android-rockchip

device/rockchip/common/modules/gms.mk:
ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
......
$(warning Please set client id with your own MADA ID!)
TARGET_SYSTEM_PROP += vendor/rockchip/common/gms/gms.prop
```

### 15.8 Изменение свойств ro.product.***

```text
[ro.product.brand]: [rockchip]
[ro.product.device]: [rk3588_t]
[ro.product.manufacturer]: [rockchip]
[ro.product.model]: [rk3588_t]
[ro.product.name]: [rk3588_t]

build/make/core/product.mk:
_product_single_value_vars += \
    PRODUCT_SYSTEM_NAME \
    PRODUCT_SYSTEM_MODEL \
    PRODUCT_SYSTEM_DEVICE \
    PRODUCT_SYSTEM_BRAND \
    PRODUCT_SYSTEM_MANUFACTURER \

build/make/core/sysprop.mk:
$(if $(filter system,$(1)),\
    echo "ro.product.$(1).brand=$(PRODUCT_SYSTEM_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(PRODUCT_SYSTEM_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_SYSTEM_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_SYSTEM_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(PRODUCT_SYSTEM_NAME)" >> $(2);\
,\
    echo "ro.product.$(1).brand=$(PRODUCT_BRAND)" >> $(2);\
    echo "ro.product.$(1).device=$(TARGET_DEVICE)" >> $(2);\
    echo "ro.product.$(1).manufacturer=$(PRODUCT_MANUFACTURER)" >> $(2);\
    echo "ro.product.$(1).model=$(PRODUCT_MODEL)" >> $(2);\
    echo "ro.product.$(1).name=$(TARGET_PRODUCT)" >> $(2);\ ## 工程lunch选项结果

build/make/core/product_config.mk:
TARGET_DEVICE := $(PRODUCT_DEVICE) ## 工程lunch选项结果
ifndef PRODUCT_SYSTEM_NAME
PRODUCT_SYSTEM_NAME := $(PRODUCT_NAME)
endif
ifndef PRODUCT_SYSTEM_DEVICE
PRODUCT_SYSTEM_DEVICE := $(PRODUCT_DEVICE)
endif
ifndef PRODUCT_SYSTEM_BRAND
PRODUCT_SYSTEM_BRAND := $(PRODUCT_BRAND)
endif
ifndef PRODUCT_SYSTEM_MODEL
PRODUCT_SYSTEM_MODEL := $(PRODUCT_MODEL)
endif
ifndef PRODUCT_SYSTEM_MANUFACTURER
PRODUCT_SYSTEM_MANUFACTURER := $(PRODUCT_MANUFACTURER)
endif

device/rockchip/rk3588/rk3588_t/rk3588_t.mk:
PRODUCT_NAME := rk3588_t
PRODUCT_DEVICE := rk3588_t
PRODUCT_BRAND := rockchip ## 修改PRODUCT_BRAND值
PRODUCT_MODEL := rk3588_t
PRODUCT_MANUFACTURER := rockchip

out/target/product/rk3588s_t/system/build.prop
out/target/product/rk3588s_t/vendor/build.prop
```

Последние два пути — результаты сборки. Это фрагменты конфигурации с пропущенным контекстом, исходными продолжениями строк и комментариями, а не самостоятельный Makefile.

### 15.9 Изменение Fingerprint

```text
build/make/core/sysprop.mk:
ifeq (,$(strip $(BUILD_FINGERPRINT)))
ifdef ROCKCHIP_BUILD_NUMBER
BF_BUILD_NUMBER := $(ROCKCHIP_BUILD_NUMBER)
else
ifeq ($(strip $(HAS_BUILD_NUMBER)),false)
BF_BUILD_NUMBER := $(BUILD_USERNAME)$$($(DATE_FROM_FILE) +%m%d%H%M)
else
BF_BUILD_NUMBER := $(file <$(BUILD_NUMBER_FILE))
endif
endif
BUILD_FINGERPRINT := $(PRODUCT_BRAND)/$(TARGET_PRODUCT)/$(TARGET_DEVICE):$(PLATFORM_VERSION)/$(BUILD_ID)/$(BF_BUILD_NUMBER):$(TARGET_BUILD_VARIANT)/$(BUILD_VERSION_TAGS)
endif
```

Для изменения полей Fingerprint измените соответствующие макросы ниже. `TARGET_PRODUCT` и `TARGET_BUILD_VARIANT` задаются через `lunch <product_name>-<build_variant>`.

```text
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_BRAND := rockchip
build/make/envsetup.sh: TARGET_PRODUCT=$product \
build/make/core/product_config.mk: TARGET_DEVICE := $(PRODUCT_DEVICE)
device/rockchip/rk3588/rk3588_t/rk3588_t.mk: PRODUCT_DEVICE := rk3588_t
build/make/core/version_util.mk: PLATFORM_VERSION := $(PLATFORM_VERSION_LAST_STABLE)
build/make/core/version_defaults.mk: PLATFORM_VERSION_LAST_STABLE := 13
build/make/core/build_id.mk: BUILD_ID=TQ3C.230805.001.B2
build/make/envsetup.sh: TARGET_BUILD_VARIANT=$variant \

```

Источник требует уникальный Fingerprint для продукта с сертификацией GMS/EDLA и запрещает его изменение после сертификации. Указаны 7-bit ASCII, отсутствие пробелов и подчёркивания в первом поле `PRODUCT_BRAND`, иначе Play Store не распознаёт устройство. Ниже пример ошибки источника.

```text
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
Rockchip_Worship_Player/rk3399_t/rk3399_t:13/TQ2B.230505.005.A1/202303:user/release-keys
junit.framework.ComparisonFailure: expected:<Rockchip[ Worship ]Player> but was:<Rockchip[_Worship_]Player>
PRODUCT_BRAND := Rockchip_Worship_Player
```

### 15.10 Изменение файловой системы data

Источник утверждает, что GMS/EDLA не поддерживает ext4 и требует зашифрованную f2fs для userdata. Для Android 14 с kernel-5.15 или новее также указана f2fs для /metadata и /data (userdata). Сохранены границы версий источника, без выводов о современных правилах для всех Android. Проверка:

```sh
$ adb shell cat vendor/etc/fstab.rk30board | grep userdata
```

```text
CtsSecurityHostTestCases
android.security.cts.MetadataEncryptionTest#testMetadataEncryptionIsEnabled
java.lang.AssertionError: Metadata encryption must be enabled
```

Решение: для userdata необходимы флаги шифрования; источник указывает, что стандартная конфигурация f2fs уже зашифрована. Флаги:

```text
fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,checkpoint=fs
```

- `fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized`: алгоритмы шифрования и оптимизация.
- `keydirectory=/metadata/vold/metadata_encryption`: каталог ключей.
- `checkpoint=fs`: UDC (User Data Checkpoint), поддержка отката data.

При сбое загрузки после включения virtual A/B согласуйте конфигурацию файловой системы userdata. Журнал источника:

```text
DEBUG: Cmdline: /system/bin/credstore /data/misc/credstore
DEBUG: pid: 720, tid: 720, name: credstore >>> /system/bin/credstore <<<
DEBUG: uid: 1076
DEBUG: tagged_addr_ctrl: 0000000000000001 (PR_TAGGED_ADDR_ENABLE)
DEBUG: signal 6 (SIGABRT), code -1 (SI_QUEUE), fault addr --------
DEBUG: Abort message: 'Check failed: chdir(data_dir.c_str()) != -1 chdir: /data/misc/credstore: No such file or directory' 
```

Источник требует одинаковую настройку в трёх местах (везде f2fs либо ext4). Упоминание ext4 относится к диагностике загрузки, а не к требованию сертификации выше; пример сертификации остаётся f2fs.

```text
device/rockchip/rk3588/device.mk:
BOARD_USERDATAIMAGE_FILE_SYSTEM_TYPE := f2fs

device/rockchip/rk3588/rk3588_t/recovery.fstab_AB:
/dev/block/by-name/userdata /data f2fs defaults defaults

device/rockchip/common/scripts/fstab_tools/fstab.in:
/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
```

### 15.11 USB-камера как передняя или задняя

Для передней камеры используйте FRONT, для задней — BACK. Патч источника:

```diff
Android_SDK/hardware/interfaces/camera$ git diff device/3.4/default/ExternalCameraDevice.cpp
- const uint8_t facing = ANDROID_LENS_FACING_EXTERNAL;
+ const uint8_t facing = ANDROID_LENS_FACING_FRONT; ## 后摄配置ANDROID_LENS_FACING_BACK
UPDATE(ANDROID_LENS_FACING, &facing, 1);
```

### 15.12 USB-микрофон как встроенный

Устройство должно иметь встроенный или USB-микрофон. Если есть только USB Mic, источник требует настроить его как встроенный. Дополнительных команд в этом разделе нет.

### 15.13 Патчи для устройств без батареи

Устройства EDLA часто не имеют батареи. Источник требует `/GMS-Test-Suite/Exp+/batteryless.diff` и ссылается на Supporting Batteryless Devices. После патча и сборки ядра замените модуль в прошивке GKI:

```sh
mv kernel-5.10/drivers/power/supply/test_power.ko mkcombinedroot/vendor_ramdisk/lib/modules/test_power.ko
```

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testFullBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

Решение источника: значение `/sys/class/power_supply/***battery/charge_full` должно быть больше 0, что описано как `battery_present=0`. Это требует сверки с патчем ниже, устанавливающим CHARGE_FULL в 0; оба указания сохранены.

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.statsd.HostAtomTests#testRemainingBatteryCapacity
FAILURE: expected to be greater than: 0 but was: 0
```

Значение `/sys/class/power_supply/test_battery/charge_counter` должно быть больше 0.

```text
VtsHalHealthV2_1TargetTest
PerInstance/HealthHidlTest#getHealthInfo_2_1/0_default
Expected: ((long)value.batteryFullChargeDesignCapacityUah) > (((long)100 * 1000)), actual: 100 vs 100000
batteryFullChargeDesignCapacityUah should be greater than 100 mAh, or 0 if unknown

Android_SDK/kernel-5.10/drivers/power/supply$ git diff test_power.c
-static int battery_status = POWER_SUPPLY_STATUS_DISCHARGING;
+static int battery_status = POWER_SUPPLY_STATUS_UNKNOWN;
 static int battery_health = POWER_SUPPLY_HEALTH_GOOD;
-static int battery_present = 1; /* true */
+static int battery_present = 0; /* true */
 case POWER_SUPPLY_PROP_CHARGE_FULL_DESIGN:
 case POWER_SUPPLY_PROP_CHARGE_FULL:
- val->intval = 100;
+ val->intval = 0;
```

Далее источник перечисляет следующие ошибки тестов AIDL health без отдельного дополнительного патча. Шестнадцатеричный дамп объекта уже неполон в оригинале; сохранён видимый текст.

```text
VtsHalHealthTargetTest
Health/HealthAidl#getChargeCounterUah/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:170: Failure
Value of: value
Expected: is >= 0
Actual: -1000

Health/HealthAidl#getHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:413: Failure
Value of: value
Expected: is valid health info
Actual: 200-byte object <01-01 00-00 A0-25 26-00 40-4B 4C-00 03-00 00-00 02-00 00-00 01-00 00-00

Health/BatteryTest#ConnectedAgainstStatusFromHal/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:592: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when battery_status becomes stable.

Health/BatteryTest#ConnectedAgainstStatusInHealthInfo/0_android_hardware_health_IHealth_default
FAILURE:
hardware/interfaces/health/aidl/vts/functional/VtsHalHealthTargetTest.cpp:604: Failure
Value of: SucceedOnce(gBatteryTestTimeout, testOnce)
Actual: false (BatteryStatus is DISCHARGING and power source is connected: ac=1, usb=1, wireless=0)
Expected: true
You may want to try again later when getHealthInfo becomes stable.
```

### 15.14 Обновление подписей прошивки и Apex

Скрипты Rockchip находятся в `/GMS-Test-Suite/xTS/tools/gms_certificate_tools.zip`. Установите PLATFORM_VERSION по фактической версии Android; при `Enter password for` источник предлагает нажать Enter. Процедура лишь воспроизведена: ключи не создаются и не заменяются.

```text
Android_SDK/vendor$ unzip gms_certificate_tools.zip
Android_SDK/vendor$ cd gms_tools/
Android_SDK/vendor/gms_tools$ export PLATFORM_VERSION=14 ## 根据实际Android版本配置
Android_SDK/vendor/gms_tools$ ./apex_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键
Android_SDK/vendor/gms_tools$ ./firmware_sig_gen.sh ## 提示输入密码"Enter password for"时直接Enter键

GtsApexSignatureVerificationTest
android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
GtsPackageSignatureTest
android.security.cts.PackageSignatureTest#testPackageSignatures
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
```

Ссылки этой главы источника (документы Partner могут требовать разрешённую учётную запись):

- §15.4: [Android 13 CDD](https://source.android.com/docs/compatibility/13/android-13-cdd#32_soft_api_compatibility)
- §15.5: [Android requirements / GRF](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#updates_in_android_requirements_release)
- §15.6: [DPI calculator](https://ppi.ihei5.com/)
- §15.6: [Android 12 CDD dpi/aapt](https://source.android.com/docs/compatibility/12/android-12-cdd#37_runtime_compatibility)
- §15.9: [GMS fingerprint](https://docs.partner.android.com/gms/building/integrating/gms-build#creating)
- §15.10: [Android 14 partition requirements](https://docs.partner.android.com/gms/policies/vsr/vsr-14#device-partition-requirements)
- §15.13: [Supporting Batteryless Devices](https://source.android.com/docs/core/power/batteryless)

## 16 Типичные проблемы тестирования

### 16.1 Ошибка protobuf

Журнал ошибки:

```text
java.lang.NoSuchMethodError: 'com.google.protobuf.Parser
com.android.os.StatsLog$ConfigMetricsReportList.parser()'
at
android.media.mediaparser.cts.MediaParserHostSideTest.getAndClearReportList(MediaParserHostSideTest.java:294)
at
android.media.mediaparser.cts.MediaParserHostSideTest.setUp(MediaParserHostSideTest.java:79)
at junit.framework.TestCase.runBare(TestCase.java:140)
```

Решение: настройки терминала могут передаваться серверу через SSH. Проверьте переменную окружения:

```text
env | grep LC_ALL
```

Если задана, удалите ее и снова запустите пакет xTS:

```text
unset LC_ALL
./cts-tradefed
```

### 16.2 Многие модули VTS не запускаются

Журнал ошибки:

```text
xxx.config syntax error: unexpected 'newline'
```

Права записи или формат Windows могут менять окончания строк. Тестируйте непосредственно в Ubuntu, не WSL и не ВМ. Распакуйте через unzip в Ubuntu; не изменяйте пакет, включая chmod 777.

### 16.3 Иногда невозможно пропустить Wi-Fi мастера

Причина — низкая производительность; исходник указывает исправление:

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

### 16.4 После сертификации статус не отображается

Проверьте Play Store → Settings → About → Play Protect certification. Обычно ключ не записан или устройство разблокировано. Для разработки оно по умолчанию разблокировано. До производства примените патч, блокирующий устройство при записи attestation key.

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

### 16.5 Датчик освещения и адаптивная яркость

Интегрируйте Turbo.apk и TurboOverlay.apk вместе либо исключите оба; тогда удалите TURBO_PRELOAD по diff.

```text
CtsDisplayTestCases
android.display.cts.BrightnessTest#testGetDefaultCurve
CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
java.lang.AssertionError: Failed to fetch first slider event. Is the
ambient brightness sensor working?
GtsFeaturesTestCases
com.google.android.features.gts.GoogleFeaturesTest#testFeatureTurboPreload
Device Health Services was missing but the
"com.google.android.feature.TURBO_PRELOAD" feature was found.
expected to be false
Device Health Services was found but the
"com.google.android.feature.TURBO_PRELOAD" feature was not, please reach out to
your Google contact
Android_SDK/vendor/partner_gms$ git diff etc/sysconfig/Android.bp
-prebuilt_etc {
- name: "sysconfig_turbo",
- product_specific: true,
- sub_dir: "sysconfig",
- src: "turbo.xml",
- filename_from_src: true,
-}
```

Включите Settings → Display → Adaptive brightness (требование Android 13): `config_automatic_brightness_available`.

```text
dumpsys display | grep mAutoBrightnessAvailable
```

Первый запрос должен вернуть true, следующий — PhysicalMappingStrategy.

```text
dumpsys display | grep MappingStrategy
PhysicalMappingStrategy
```

При пустом результате установите TurboOverlay.apk. Команда `pm list package -f | grep turbo` проверяет Turbo.apk и TurboOverlay.apk.

```text
package:/product/priv-app/Turbo/Turbo.apk=com.google.android.apps.turbo
package:/product/overlay/TurboOverlay.apk=com.rockchip.android.overlay.turbo
pm list features | grep com.google.android.feature.TURBO_PRELOAD
```

Проверьте наличие функции. Массивы `config_autoBrightnessLevels` и `config_autoBrightnessDisplayValuesNits` должны иметь одинаковую длину; используйте OverlayTools.apk или overlay lookup ниже.

Используйте любой способ запроса массивов. Шесть указанных тестов выполните при ярком свете, затем повторите при слабом.

```text
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessLevels
am start -n cn.jcassistant.overlaytools/.MainActivity --es pkg android --es cfg config_autoBrightnessDisplayValuesNits

cmd overlay lookup android android:array/config_autoBrightnessLevels
cmd overlay lookup android android:array/config_autoBrightnessDisplayValuesNits
## 下面6个fail项需要:先调节环境光较亮测试,再调节环境光较暗retry测试
arm64-v8a CtsDisplayTestCases
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
armeabi-v7a CtsDisplayTestCases
android.display.cts.BrightnessTest#testSetAndGetPerDisplay
android.display.cts.BrightnessTest#testBrightnessSliderTracking
android.display.cts.BrightnessTest#testNoColorSampleData
android.display.cts.BrightnessTest#testSliderEventsReflectCurves
```

Без датчика освещения удалите `android.hardware.sensor.light` настройкой:

```text
BOARD_LIGHT_SENSOR_SUPPORT := false
```

Turbo.apk относится к Google Device Health Services, необязательной функции GMS Requirements.

### 16.6 Ошибка remount

Заблокированное устройство выдает эти ошибки. Сначала разблокируйте его.

```text
$ adb root
restarting adbd as root
$ adb remount
Skipping /system for remount
Skipping /vendor for remount
Skipping /product for remount
No partitions to remount
remount failed

$ adb remount
Device must be bootloader unlocked
```

### 16.7 Ошибки сборки

Настройка устройства без 4G:

```text
BUILD_WITH_GOOGLE_MARKET_ALL := false
```

Используется не ветка RK GMS Express и отсутствует gms-mandatory.mk:

Метод 1 исходника сохраняет BUILD_WITH_GOOGLE_MARKET_ALL := true при ошибке check_gms_env.sh. Метод 2 копирует gms.mk в gms-mandatory.mk и удаляет comms suite. Сверьте с разрешенной веткой.

```text
device/rockchip/common/modules/gms.mk:100: error:
..."vendor/partner_gms/products/gms-mandatory.mk" does not exist.
Android_SDK/vendor/partner_gms/products$ cp gms.mk gms-mandatory.mk
Android_SDK/vendor/partner_gms/products$ git diff gms-mandatory.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

BOARD_SUPER_PARTITION_WARN_LIMIT: измените размер super. Исходник требует кратность 4Mb; проверьте единицу по конфигурации в байтах, не подменяя ее молча.

```text
RuntimeError: sum of sizes of ['system', 'system_dlkm', 'system_ext',
'vendor', 'vendor_dlkm', 'odm', 'odm_dlkm', 'product'] is greater than
BOARD_SUPER_PARTITION_SIZE:
977747968+15765504+207147008+251867136+8318976+897024+348160+2484719616 ==
3946811392 > 3932160000 == 3932160000
[ 99% 40908/40909] Target super fs image for debug:
out/target/product/rk3588s_s/super.img
Android_SDK/device/rockchip/common$ git diff BoardConfig_AB.mk
ifeq ($(PRODUCT_USE_DYNAMIC_PARTITIONS), true)
ifneq ($(PRODUCT_RETROFIT_DYNAMIC_PARTITIONS), true)
ifeq ($(BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE), true)
ifeq ($(BUILD_WITH_GO_OPT), true)
ifeq ($(strip $(TARGET_ARCH)), arm64) # arm64 go
BOARD_SUPER_PARTITION_SIZE := 2390753280
else # arm go
BOARD_SUPER_PARTITION_SIZE := 1971322880
endif
else # non-go
- BOARD_SUPER_PARTITION_SIZE := 3932160000
+ BOARD_SUPER_PARTITION_SIZE := 3963617280
endif
BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

Ошибка: несовпадение `<uses-library>` между сборкой и манифестом.

```text
vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk )"
error: mismatch in the <uses-library> tags between the build system and the
manifest:
- required libraries in build system: []
vs. in the manifest: []
- optional libraries in build system: [org.apache.http.legacy]
vs. in the manifest: [org.apache.http.legacy,
androidx.window.extensions, androidx.window.sidecar]
- tags in the manifest
(vendor/partner_gms/apps_go/FilesGoogle/FilesGoogle_arm64.apk):
uses-library-not-required:'org.apache.http.legacy'
uses-library-not-required:'androidx.window.extensions'
uses-library-not-required:'androidx.window.sidecar'
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy androidx.window.extensions androidx.window.sidecar
Android_SDK/vendor/partner_gms$ git diff apps_go/FilesGoogle/Android.mk
-LOCAL_OPTIONAL_USES_LIBRARIES := org.apache.http.legacy
+LOCAL_ENFORCE_USES_LIBRARIES := false
```

Ошибка сборки: manifest_level_32.xml.

first_api_level=31 соответствует Android12.0, 32 — Android12.1. Скопируйте manifest_level_31.xml в manifest_level_32.xml.

```text
FAILED: ninja: 'device/rockchip/common/manifests/manifest_level_32.xml',
needed by
'out/target/product/rk3588_s/gen/ETC/vendor_manifest.xml_intermediates/manifest.xml', missing and no known rule to make it
Android_SDK/device/rockchip/common/manifests$ cp manifest_level_31.xml manifest_level_32.xml
```

После интеграции Mainline: Target of symlink is not executable.

```text
warning: Missing compilation artifacts. Dexpreopting is not working
for some system server jars
out/host/linux-x86/obj/EXECUTABLES/dexdump_intermediates/dexdump:
error: Target of symlink is not executable
out/host/linux-x86/obj/EXECUTABLES/hiddenapi_intermediates/hiddenapi:
error: Target of symlink is not executable
chmod a+x prebuilts/module_sdk/art/current/host-exports/x86_64/bin/*
chmod a+x prebuilts/module_sdk/art/go/current/host-exports/x86_64/bin/*
```

### 16.8 Ошибки сети

Для этих тестов нужен VPN/IPv6. Хост Ubuntu подключается к VPN напрямую, не через SSR.

DashDownloadTest#download не допускает локальный медиапакет; нужна загрузка HTTP.

```text
## VPN
CtsNetTestCases
android.net.cts.MultinetworkApiTest#testResNApi
libcore.java.net.InetAddressTest#test_getByName_invalid
android.net.cts.MultinetworkApiTest#testNativeDatagramTransmission
NativeDnsAsyncTest#Async_NXDOMAIN
GtsExoPlayerTestCases
com.google.android.exoplayer.gts.DashDownloadTest#download ## 该项不能使用本地媒体包
java.lang.ClassCastException: sun.net.www.protocol.file.FileURLConnection cannot
be cast to java.net.HttpURLConnection
## IPv6
CtsNetTestCases
android.net.cts.DnsTest#testDnsWorks
CtsLibcoreTestCases
libcore.java.net.InetAddressTest#test_getByName_invalid[1]
libcore.java.net.SocketTest#testSocketTestAllAddresses
```

### 16.9 Ошибки CTS

ConfigurationContainerProto: несовместимая версия тестового пакета.

Для Android12L (ro.build.version.sdk=32) нужен 12.1_r1, не 12_r1.

```text
java.lang.NullPointerException: Attempt to read from field
'com.android.server.wm.nano.ConfigurationContainerProto
com.android.server.wm.nano.WindowContainerProto.configurationContainer' on a
null object reference
```

testGetMemoryClass: dalvik.vm.heapgrowthlimit недостаточен для dpi=640.

Задайте dalvik.vm.heapgrowthlimit=512m и проверьте `getprop | grep dalvik.vm.heap` в консоли.

```text
CtsAppTestCases
android.app.cts.ActivityManagerMemoryClassTest#testGetMemoryClass
AssertionFailedError: Expected to have at least 512mb of memory for
screen density 640
Android_SDK/frameworks/native/build$ git diff tablet-10in-xhdpi-2048-dalvik-heap.mk
PRODUCT_VENDOR_PROPERTIES += \
dalvik.vm.heapstartsize?=16m \
- dalvik.vm.heapgrowthlimit?=192m \
+ dalvik.vm.heapgrowthlimit?=512m \
```

testSensorFeatures: оборудование, ПО и объявление функции акселерометра не совпадают.

С акселерометром добавьте android.hardware.sensor.accelerometer; без него BOARD_GRAVITY_SENSOR_SUPPORT := false. Ниже логика сборки, незавершенный фрагмент исходника и семь макросов датчиков.

```text
CtsAppTestCases
android.app.cts.SystemFeaturesTest#testSensorFeatures
java.lang.AssertionError:
PackageManager#hasSystemFeature(android.hardware.sensor.accelerometer) returns
false but SensorManager#getSensorList(1) shows sensors [Accelerometer sensor]
expected:<false> but was:<true>
hardware/rockchip/sensor/st/Android.mk
ifeq ($(BOARD_GRAVITY_SENSOR_SUPPORT), true)
LOCAL_CFLAGS += -DGRAVITY_SENSOR_SUPPORT
endif
hardware/rockchip/sensor/st/sensors.c
static const struct sensor_t sSensorList[] = {
#ifdef GRAVITY_SENSOR_SUPPORT
{ .name = "Accelerometer sensor",
.vendor = "The Android Open Source Project",
.version = 1,
.handle = SENSORS_HANDLE_BASE+ID_A,
.type = SENSOR_TYPE_ACCELEROMETER,
BOARD_GRAVITY_SENSOR_SUPPORT := false
BOARD_COMPASS_SENSOR_SUPPORT := false
BOARD_GYROSCOPE_SENSOR_SUPPORT := false
BOARD_PROXIMITY_SENSOR_SUPPORT := false
BOARD_LIGHT_SENSOR_SUPPORT := false
BOARD_PRESSURE_SENSOR_SUPPORT := false
BOARD_TEMPERATURE_SENSOR_SUPPORT := false
```

testGenerateKeyWhenCredentialAndBiometricEnrolled: до теста проверьте блокировку и разблокировку PIN.

Не отключайте блокировку: сохраните `<bool name="def_lockscreen_disabled">false</bool>`.

```text
CtsBiometricsTestCases
android.server.biometrics.BiometricCryptoTests#testGenerateKeyWhenCredentialAndBiometricEnrolled
java.lang.IllegalStateException: Secure lock screen must be enabled to
create keys requiring user authentication
```

testManagedProfileSupported: Go с 2G требует функцию; Go с 1.5G и менее — нет.

```text
CtsContentTestCases
android.content.pm.cts.FeatureTest#testManagedProfileSupported
Device should support managed profiles, but
android.software.managed_users is not enabled
Android_SDK/device/rockchip/common$ git diff device.mk
ifneq ($(strip $(BUILD_WITH_GO_OPT)),true)
PRODUCT_COPY_FILES += \
frameworks/native/data/etc/tablet_core_hardware.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/tablet_core_hardware.xml
+else
+ PRODUCT_COPY_FILES += \
+
frameworks/native/data/etc/android.software.managed_users.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.managed_users.xml
```

CtsDeqpTestCases: Abort: Test cannot be executed.

Настройте aapt/aapt2 по разделу хоста; сначала проверьте Mali: `getprop | grep sys.gmali.version`.

```text
CtsDeqpTestCases
dEQP-EGL.info#version
Abort: Test cannot be executed
dEQP : Writing test log into /sdcard/TestLog.qpa
dEQP : ERROR: Unable to open test log output file
'/sdcard/TestLog.qpa'.
dEQP : Failed to create activity: Failed to open test log file
'/sdcard/TestLog.qpa'
getprop | grep sys.gmali.version
```

setDefaultSmsApplication_notSmsCapable_unchanged: настройте overlay `config_defaultSms`.

```text
CtsDevicePolicyTestCases
android.devicepolicy.cts.DefaultSmsApplicationTest#setDefaultSmsApplication_notSmsCapable_unchanged[IncludeRunOnDeviceOwnerUser]
expected: com.android.messaging
but was : com.android.bedstead.testapp.SmsApp
Android_SDK/device/rockchip/common$ git diff overlay/frameworks/base/core/res/res/values/config.xml
<resources>
+ <!-- The name of the package that will hold the SMS role by default. -->
+ <!-- Set it empty here -->
+ <string name="config_defaultSms" translatable="false"></string>
```

testOpenGlEsDeqpLevel: обновите android.software.opengles.deqp.level согласно ошибке.

```text
CtsGraphicsTestCases
android.graphics.cts.OpenGlEsDeqpLevelTest#testOpenGlEsDeqpLevel
Feature android.software.opengles.deqp.level must be present and have at
least version 132383489.
pm list features | grep android.software.opengles.deqp.level
Android_SDK/frameworks/native/data/etc$ cat android.software.opengles.deqp.level-2022-03-01.xml
<permissions>
<feature name="android.software.opengles.deqp.level" version="132514561" />
</permissions>
Android_SDK/device/rockchip/common$ git diff modules/gms.mk
ifneq ($(filter true yes, $(BUILD_WITH_GOOGLE_MARKET) $(PRODUCT_USE_PREBUILT_GTVS)),)
PRODUCT_COPY_FILES += \
- frameworks/native/data/etc/android.software.opengles.deqp.level-2021-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2020-03-01.xml
+ frameworks/native/data/etc/android.software.opengles.deqp.level-2022-03-01.xml:$(TARGET_COPY_OUT_VENDOR)/etc/permissions/android.software.opengles.deqp.level-2022-03-01.xml
```

testAllKeys: включите GKI на Android 13.

Включите GKI и три опции gki_defconfig ниже.

```text
CtsHardwareTestCases
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseBluetoothTest#testAllMotions
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllKeys
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testVibrator
android.hardware.input.cts.tests.SonyDualSenseUsbTest#testAllMotions
java.lang.RuntimeException: Did not receive device added notification in
time
kernel-5.10/arch/arm64/configs/gki_defconfig
CONFIG_HID_SONY=y
CONFIG_LEDS_CLASS=y
CONFIG_NEW_LEDS=y
```

CtsMediaDecoderTestCases: по ошибке задайте диапазон частоты кадров, включающий реальные измерения.

Найдите c2.rk.avc.decoder 320x240. Диапазон примера 125–140 включает 134.16 и 129.51. Результат /vendor/etc/media_codecs_performance.xml. Это не измерения ArmSoM.

```text
CtsMediaDecoderTestCases
android.media.decoder.cts.VideoDecoderPerfTest#testPerf[0(c2.rk.avc.decoder:qvga)]
java.lang.AssertionError: Expected achievable frame rates for
c2.rk.avc.decoder video/avc 320x240: [600.0, 650.0].
Measured frame rate: [134.16529367461462, 129.51021865979183].
Android_SDK/vendor/rockchip/common/vpu/etc$ git diff media_codecs_performance_rk3588.xml
<MediaCodec name="c2.rk.avc.decoder" type="video/avc" update="true">
- <Limit name="measured-frame-rate-320x240" range="600-650" />
+ <Limit name="measured-frame-rate-320x240" range="125-140" />
```

SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT: патч `/GMS-Test-Suite/Exp+/AHardwareBufferNativeTests`.

```text
CtsNativeHardwareTestCases
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthAffectsDrawAcrossContexts_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#SingleLayer_DepthTest_DepthCanBeSampled_D32_FLOAT
android.hardware.nativehardware.cts.AHardwareBufferNativeTests#MultipleLayers_DepthTest_DepthCanBeSampled_D32_FLOAT
```

testSocketKeepaliveUnprivileged: патч `/GMS-Test-Suite/Exp+/DisableKeepAliveMainlineBuild`.

```text
CtsNetTestCases
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveUnprivileged
android.net.cts.ConnectivityManagerTest#testCreateTcpKeepalive
android.net.cts.ConnectivityManagerTest#testSocketKeepaliveLimitWifi
CtsHostsideNetworkTests
com.android.cts.net.HostsideVpnTests#testAutomaticOnOffKeepaliveModeNoClose
device/rockchip/common/device.mk:
PRODUCT_PACKAGES += \
RockchipTetheringNoKeepAliveOverlay \
RockchipTetheringNoKeepAliveMainlineOverlay
```

testPruneUnusedStaticSharedLibraries_reboot_fullMode требует исправного аппаратного RTC.

```text
CtsOsHostTestCases
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_fullMode
android.os.cts.StaticSharedLibsHostTests#testPruneUnusedStaticSharedLibraries_reboot_instantMode
java.lang.AssertionError: Library foo.bar.lib.recursive should be
uninstalled
```

Для testProfiles/testRequestNotifications поместите рядом обнаруживаемое BLE-устройство, например часы.

```text
CtsOsTestCases
android.os.cts.CompanionDeviceManagerTest#testProfiles
android.os.cts.CompanionDeviceManagerTest#testRequestNotifications
FAILURE: java.lang.AssertionError: Test requires a discoverable
bluetooth device nearby
```

SELinuxNeverallowRulesTest: для GMS/EDLA нельзя менять разрешения /system/sepolicy и тестировать userdebug.

```text
CtsSecurityHostTestCases
android.security.cts.SELinuxNeverallowRulesTest#testNeverallowRules199
junit.framework.AssertionFailedError: The following errors were
encountered when validating the SELinuxneverallow rule:
libsepol.report_failure: neverallow violated by allow
hal_keymint_default serialno_prop:file { read getattr map open };
libsepol.check_assertions: 1 neverallow failures occurred
```

testNoRemovedCertificates: патч безопасности Google удалил ожидаемый тестом CA-сертификат.

Исходник предлагает откат TrustCor-патча. Это меняет корни доверия и требует проверки текущих требований безопасности; сохранено как свидетельство источника.

```text
CtsSecurityTestCases
android.security.cts.CertificateTest#testNoRemovedCertificates
junit.framework.AssertionFailedError: Missing CA certificates expected:
<[]> but was:<[B8:BE:6D:CB:56:F1...]>
bulletin_2023_08_preview/.../0001-Drop-TrustCor-certificates.bulletin.patch
```

Ошибка testSystemMemoryAtom.

Для kernel-4.19 отключите перечисленные dmabuf; неприменимо к Android13 и новее.

```text
CtsStatsdAtomHostTestCases
android.cts.statsdatom.memory.SystemMemoryStatsTests#testSystemMemoryAtom
FAILURE: expected to be at least: 0 but was: -1
Android_SDK/kernel-4.19$ git diff arch/arm64/configs/rockchip_defconfig
-CONFIG_DMABUF_HEAPS=y
-CONFIG_DMABUF_HEAPS_SYSTEM=y
-CONFIG_DMABUF_HEAPS_CMA=y
```

testRestart/testMultipleActivations требуют аппаратный, не виртуальный RTC и `/sys/class/rtc/rtc0/`.

Добавьте SELinux-разрешения для реальных узлов (или Android_Devices_SELinux_Tool); date -u и hwclock -r должны совпадать.

```text
CtsStatsdHostTestCases
android.cts.statsd.metric.MetricActivationTests#testRestart
android.cts.statsd.metric.MetricActivationTests#testMultipleActivations
console:/ $ ls -laZ /sys/class/rtc/
total 0
drwxr-xr-x 2 root root u:object_r:sysfs_rtc:s0 0 2023-08-12 18:19 .
drwxr-xr-x 82 root root u:object_r:sysfs:s0 0 2023-08-12 18:19 ..
lrwxrwxrwx 1 root root u:object_r:sysfs:s0 0 2023-08-12 18:53 rtc0 ->
../../devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0
Android_SDK/device/rockchip/rk3588$ git diff sepolicy_vendor/genfs_contexts
genfscon sysfs /devices/platform/fe2e0000.mmc/mmc_host/mmc0 u:object_r:sysfs_mmc:s0
+genfscon sysfs /devices/platform/feaa0000.i2c/i2c-2/2-0051/rtc/rtc0 u:object_r:sysfs_rtc:s0
```

testRefreshRate: недостаточная частота кадров дисплея.

```text
CtsViewTestCases
android.view.cts.DisplayRefreshRateTest#testRefreshRate
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 65.0 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 60.63158 fps
D DisplayRefreshRateTest: claimed 75.0 fps, achieved 61.125 fps
E TestRunner: failed:
testRefreshRate(android.view.cts.DisplayRefreshRateTest)
```

AnrTests: не удаляйте системный диалог ANR и не меняйте время ANR.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.AnrTests#slowUiThreadWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnCreateWithKeyEventTriggersAnr
android.server.wm.AnrTests#slowOnTouchEventHandleTriggersAnr
android.server.wm.AnrTests#slowOnKeyEventHandleTriggersAnr
android.server.wm.AnrTests#embeddedWindowTriggersAnr
FAILURE: java.lang.AssertionError: Could not find anr dialog
```

testSystemUiVisibilityCallbackCausedByInsets: `/GMS-Test-Suite/Exp+/12.1_CtsWindowManagerDeviceTestCases`.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.WindowInsetsControllerTests#testSystemUiVisibilityCallbackCausedByInsets
```

CtsWindowManagerDeviceTestCases: задайте параметры анимации окна 1.0.

```text
CtsWindowManagerDeviceTestCases
android.server.wm.ActivityTransitionTests#testTaskTransitionOverride
android.server.wm.ActivityTransitionTests#testActivityTransitionDurationNoShortenAsExpected
android.server.wm.ActivityTransitionTests#testTaskTransitionOverrideDisabled
java.lang.AssertionError: Actual transition duration should be in the
range &lt;1900, 2900&gt; ms, actual=1012
Android_SDK/device/rockchip/rk3588$ git diff ./
--- a/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
+++ b/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
@@ -36,6 +36,6 @@
<integer name="def_wifi_sleep_policy">2</integer>
<!-- Decrease animation duration. -->
- <fraction name="def_window_animation_scale">50%</fraction>
- <fraction name="def_window_transition_scale">50%</fraction>
+ <fraction name="def_window_animation_scale">100%</fraction>
+ <fraction name="def_window_transition_scale">100%</fraction>
```

testMaxAspectRatioPreOActivity: неподходящее соотношение сторон. Смените ориентацию или уменьшите navigation_bar_height.

Расчеты источника: 1.9047619 = 1920/(1080-72), 1.87 = 1920/(1080-53); приближения сохранены.

```text
CtsWindowManagerSdk25TestCases
android.server.wm.AspectRatioSdk25Tests#testMaxAspectRatioPreOActivity
Expected: a value less than or equal to <1.87F>
but: <1.9047619F> was greater than <1.87F>
1.9047619 = 1920/(1080-72) 1.87 = 1920/(1080-53)
console:/ $ wm size
Physical size: 1920x1080
console:/ $ dumpsys SurfaceFlinger | grep NavigationBar
0xb400007eee0bd600: unknown | 1080 ( 0) x 72 | 1 | 1 |
0x40000000000b00 | NavigationBar0#0
Android_SDK/frameworks/base$ git diff core/res/res/values/dimens.xml
<!-- Height of the bottom navigation / system bar. -->
- <dimen name="navigation_bar_height">72dp</dimen>
+ <dimen name="navigation_bar_height">53dp</dimen>
```

BYOD Managed Provisioning — Camera support cross profile video capture (with extra output path): зависание из-за null.

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (mIsVideoCaptureIntent) {
// if no file save is needed, we can show the post capture UI now
showCaptureResult();
- }
- if (mVideoFileDescriptor != null) {
+ }else if (mVideoFileDescriptor != null) {
saveVideo();
}
```

Ошибка BYOD Managed Provisioning — Camera support cross profile video capture (without extra output path).

Без камеры три указанных межпрофильных теста не должны появляться; исходник удаляет Camera2.

```text
Android_SDK/packages/apps/Camera2$ git diff src/com/android/camera/VideoModule.java
if (shouldAddToMediaStoreNow && !fail) {
- if (mIsVideoCaptureIntent) {
+ if (mIsVideoCaptureIntent && mActivity.getIntent().getExtras() != null)
{
// if no file save is needed, we can show the post capture UI now
Camera support cross profile image capture
Camera support cross profile video capture (with extra output path)
Camera support cross profile video capture (without extra output path)
Android_SDK/build/make$ git diff target/product/handheld_product.mk
- Camera2 \
```

Companion Device Service Test: поместите рядом обнаруживаемое BLE-устройство, например часы.

Установите указанный nRF Connect APK на вспомогательное устройство. ADVERTISER → +, любое Display name, ADD RECORD → Complete Local Name, Connectable → OK. Включите переключатель, подтвердите Advertisement duration. На целевом устройстве выполните Companion Device Service Test. Исчезновение может занять 2 минуты; нужны диалоги Device appeared и Device disappeared.

```text
com.android.cts.verifier.companion.CompanionDeviceServiceTestActivity
/GMS-Test-Suite/xTS/tools/nrfconnect_v4.24.3_itmop.com.apk
```

Device Suspend Tests: глубокий сон 2 секунды и успешное пробуждение; отсоедините ADB.

```text
com.android.cts.verifier.sensors.DeviceSuspendTestActivity#testTimestampClockSource
SensorTest: [TestExecution] Delta between clock sources too small (0mS),
device must sleep more than 2 seconds
```

Notification Listener Testb: задайте PIN в мастере либо задайте PIN и выполните System → Reset options → Reset app preferences.

После прошивки задайте PIN в мастере, иначе Notification Listener Test может не найти пункты.

USB Accessory Test: рекомендуется телефон Google как вспомогательное устройство.

USB Accessory: помощник — Start accessory test companion, тестируемый — USB Accessory Test; помощник HOST/OTG, цель DEVICE/USB; OK на помощнике. USB Device: помощник — Start device test companion, цель — USB Device Test; помощник DEVICE/USB, цель HOST/OTG; OK на цели.

### 16.10 Ошибки GTS

GtsAssistantHostTestCases: удалите функции камеры, не соответствующие оборудованию. До теста откройте Camera, разрешите доступ, сделайте фото и выйдите.

camera — задняя, camera.any обязательна, camera.external — USB, camera.front — передняя камера.

```text
GtsAssistantHostTestCases
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantTakePhotoWithoutVoiceInteraction
com.google.android.assistant.gts.AssistantTest#testAssistantOpenRearCameraWithVoiceInteraction
console:/ $ pm list features | grep camera
feature:android.hardware.camera ## 后摄Camera
feature:android.hardware.camera.any ## 必须
feature:android.hardware.camera.external ## Usb Camera
feature:android.hardware.camera.front ## 前摄Camera
```

soundDoseReached_showsWarning: отсутствует android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED.

Источник: https://android-review.googlesource.com/c/platform/frameworks/base/+/1261388 . Добавьте разрешение в shell permissions и Manifest.

```text
GtsAudioTestCases
com.google.android.audio.gts.SoundDoseTest#soundDoseReached_showsWarning
com.google.android.audio.gts.SoundDoseTest#momentaryExposure_showsWarning
com.android.bedstead.nene.exceptions.NeneException: Can not get required
permission
Running On User: User{id=0, name=Owner}
Permission: android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED
Permission protection level: Permission not found
Permission state: -1
Instrumented Package: com.google.android.audio.gts
Requested Permissions:
[android.permission.QUERY_ALL_PACKAGES,
com.google.android.audio.gts.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION,
android.permission.REORDER_TASKS, android.permission.READ_EXTERNAL_STORAGE]
Can adopt shell permissions: true
Shell permissions:[android.permission.REQUEST_DELETE_PACKAGES,
android.permission.MANAGE_ROLLBACKS, ......
Android_SDK/frameworks/base$ git diff data/etc/privapp-permissions-platform.xml
<privapp-permissions package="com.android.shell">
+ <permission
name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
<!-- Needed for test only -->
<permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
Android_SDK/frameworks/base$ git diff packages/Shell/AndroidManifest.xml
<!-- Permission required for testing system audio effect APIs. -->
<uses-permission
android:name="android.permission.MODIFY_DEFAULT_AUDIO_EFFECTS"/>
+ <uses-permission
android:name="android.permission.MODIFY_AUDIO_SETTINGS_PRIVILEGED"/>
```

testTelephonyAudioAvailable: удалите телефонные компоненты на устройствах без звонков/4G.

AM в журнале — Messages.apk; исходник удаляет Google comms suite.

```text
GtsGmscoreHostTestCases
com.google.android.gts.audio.AudioHostTest#testTelephonyAudioAvailable
GtsNmgiarcTestCases
com.google.android.comms.MessagesTests#testMessagesVersionCheck
java.lang.RuntimeException: AM should be a privileged system app
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
-# GMS comms suite
-$(call inherit-product, $(ANDROID_PARTNER_GMS_HOME)/products/google_comms_suite.mk)
```

testDisablingDeviceProvisioningPackage: по исходнику OobConfig.apk нельзя интегрировать на версиях выше Android 12.

```text
GtsGmscoreHostTestCases
com.google.android.gts.provisioning.ProvisioningHostTest#testDisablingDeviceProvisioningPackage
android.content.pm.PackageManager$NameNotFoundException:
com.google.android.apps.work.oobconfig
```

testSerialNumberAttestation: запишите Attestation key и заблокируйте устройство (`fastboot oem at-lock-vboot`).

```text
GtsGmscoreHostTestCases
com.google.android.gts.security.DeviceIdAttestationHostTest#testSerialNumberAttestation
junit.framework.AssertionFailedError: The verified boot key must be non-
trivial, at least 32 bytes long.
```

testMbaPrivilegedPermission: в AndroidManifest.xml нельзя объявлять `android:debuggable="true"`.

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsDebugCertificateTest#testMbaPrivilegedPermission
java.lang.RuntimeException: Violation of the Debug certificate policy
[com.rockchip.mirror] is debuggable.
```

testPolicy: измените имя пакета согласно ошибке.

Пример: com.google.android.apps.customization.pixe → com.rockchip.android.apps.customization.pixel. Журнал пишет pixel, инструкция теряет l; проверьте расхождение.

```text
GtsMbaPrivilegedPermissionTestCases
com.google.android.mbaprivilegedpermission.gts.GtsPackageNamespaceTest#testPolicy
java.lang.RuntimeException: Violation of the Package Namespace
[Package Name: com.google.android.apps.customization.pixel,
Certificates:
[3cc6c5f27c0b54f96507c2a5b31c404b3dbf065a2edb093eacd41147f2480f30]] contains
Google, but not owned by Google.
```

Ошибка testNetworkStack.

Метод 1: CaptivePortalLoginFrameworkOverlayGo.apk задает config_defaultCaptivePortalLoginPackageName; метод 2: POST_NOTIFICATIONS по умолчанию с исходным digest и fixed=false.

```text
GtsNetworkStackHostTestCases
com.google.android.gts.networkstack.NetworkStackHostTest#testNetworkStack

com.google.android.networkstack.gts.NetworkStackTest#testCaptivePortalAppInstalledAndHasPostNotificationsPermission:
java.lang.AssertionError: com.google.android.go.captiveportallogin does not have
android.permission.POST_NOTIFICATIONS permission. Check that its package name
was configured in config_defaultCaptivePortalLoginPackageName (typically via
overlay). expected:<0> but was:<-1>
Android_SDK/vendor/rockchip/common/gms/CaptivePortalLoginFrameworkOverlayGo$ cat res/values/config.xml
<string name="config_defaultCaptivePortalLoginPackageName"
translatable="false">com.google.android.go.captiveportallogin</string>
Android_SDK/vendor/partner_gms$ git diff etc/default-permissions/default-permissions-google.xml
+
+ <exception
+ package="com.google.android.go.captiveportallogin"
+ sha256-cert-digest="5F:A4:22:12:AD:40:3E:22:DD:6E:FE:75:F3:F3:11:84:05:1F:EF:74:4C:0B:05:BE:5C:73:ED:F6:0B:F6:2C:1E">
+ <!-- Notifications -->
+ <permission name="android.permission.POST_NOTIFICATIONS" fixed="false"/>
+ </exception>
</exceptions>
```

testDefaultGrantsWithRemoteExceptions: удалите указанное ошибкой разрешение приложения.

```text
GtsPermissionTestCases
com.google.android.permission.gts.DefaultPermissionGrantPolicyTest#testDefaultGrantsWithRemoteExceptions
java.lang.AssertionError: packageName: com.google.android.contacts {
priv app: false
targetSDK: 33
uid: 10101
persistent: false
signature: 917F8719D4C2C892DBF26BBE2BDB179FFF0E0DDBEB8FF9F31A4DD98BB4A4D25D
on system image: true
has platform signature: false
message: cannot be granted by default to package {
permission: android.permission.POST_NOTIFICATIONS
}
}
```

testPreloadedAppsTargetSdkVersion: измените `android:targetSdkVersion` приложения по ошибке.

Если действующее изменение targetSdkVersion не помогло, исходник предлагает обновить compileSdkVersion до последнего ro.product.first_api_level; minSdkVersion ≤ targetSdkVersion ≤ compileSdkVersion. Сверьте с SDK.

```text
GtsPermissionTestCases
com.google.android.permission.gts.PreloadAppsTargetSdkVersionTest#testPreloadedAppsTargetSdkVersion
All apps preloaded on DEVICEs launching with Android 11 MUST target API
level 29 or higher.
All apps preloaded on DEVICEs launching with Android 12 or 12L MUST
target API level 30 or higher.
All apps preloaded on DEVICEs launching with Android 13 MUST target API
level 31 or higher.
com.android.launcher3 must target 30 or higher, but targets 29
minSdkVersion(lowest possible) <= targetSdkVersion <=
compileSdkVersion(latest SDK)
Android_SDK/vendor/partner_gms$ git diff apps/SearchLauncher/AndroidManifest.xml
- <uses-sdk android:targetSdkVersion="29" android:minSdkVersion="28"/>
+ <uses-sdk android:targetSdkVersion="30" android:minSdkVersion="28"/>
```

testSystemAppsInstalled: на устройствах без 4G не интегрируйте AndroidAutoStub.apk.

```text
GtsPlacementTestCases
com.google.android.placement.gts.InstalledAppsTest#testSystemAppsInstalled
java.lang.RuntimeException: Test failed for cases: [0]
Reasons include:
Message [0]: com.google.android.projection.gearhead should not be
installed on devices without Telephony
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
# GMS mandatory core packages
PRODUCT_PACKAGES := \
- AndroidAutoStub \
```

testWidgetPresence: не удаляйте Google Search widget с рабочего стола.

Переменная QSB_ON_FIRST_SCREEN в /packages/apps/Launcher3/src_build_config/com/android/launcher3/BuildConfig.java.

```text
GtsSearchHostTestCases
com.google.android.search.gts.GoogleSearchWidgetTest#testWidgetPresence
FAILURE: java.lang.AssertionError: Launcher from package
com.android.launcher3 does not contain search widget provided by
com.google.android.googlequicksearchbox (Google App).
```

testZeroTouch_zeroTouchWrapperLaunched: в мастере подключитесь к VPN-WiFi, не входя в Google. Убедитесь, что Attestation key записан.

```text
GtsSetupWizardHostTestCases
com.google.android.gts.setupwizard.SetupWizardZeroTouchTest#testZeroTouch_zeroTouchWrapperLaunched
FAILURE: junit.framework.AssertionFailedError: SetupWizard didn't launch
ZeroTouchWrapper.
On Android R+ or when com.google.android.apps.work.oobconfig is installed,
SetupWizard MUST launch ZeroTouchWrapper with intent action
com.google.android.setupwizard.ZERO_TOUCH_SETUP during normal SetupWizard flow
when WIFI/mobile data is connected.
```

testWidevineVersion: FTP-патч `/GMS-Test-Suite/Exp+/WvtsDeviceTestCases`.

```text
WvtsDeviceTestCases
com.google.android.wvts.WidevineBusinessLogicTests#testWidevineVersion
FAILURE: java.lang.AssertionError: Unknown build number with cdm version
16.1.0
```

### 16.11 Ошибки STS

testPocBug_258188673: FTP-патч `/GMS-Test-Suite/Exp+/testPocBug_258188673`.

```text
StsHostTestCases
android.security.sts.Bug_258188673#testPocBug_258188673
java.lang.AssertionError: PoC exited with bad exit code.. Actual: 113
```

### 16.12 Ошибки VTS

ProcCmdlineAndroidbootTest: включите GKI (BOARD_BUILD_GKI); не используйте androidboot.*** в командной строке ядра.

```text
VtsBootconfigTest
VtsBootconfigTest#ProcCmdlineAndroidbootTest
Expected equality of these values:
cmdline.find("androidboot")
Which is: 18
cmdline.npos
Which is: 18446744073709551615
"androidboot" parameters are not allowed in the kernel cmdline for
devices using kernel version 5.10 or greater with Android S and beyond. These
parameters are to be placed in bootconfig.
```

audioPolicyConfigurationValidation: исправьте audio_policy_configuration.xml согласно ошибке.

Задайте BOARD_SUPPORT_MULTIAUDIO ?= false; отключите несколько звуковых карт и исключите audio_policy_configuration_multiaudio.xml.

```text
VtsHalAudioV7_1TargetTest
CheckConfig#audioPolicyConfigurationValidation
1 error occurred during xml validation:
XML is not valid according to the xsd
While validating: xmlFilePath
Which is: /vendor/etc/audio_policy_configuration.xml
Against the schema: xsd
Which is: /data/local/tmp/audio_policy_configuration_V7_0.xsd
Libxml2 errors:
Error: Element 'devicePort', attribute 'type': 'AUDIO_DEVICE_OUT_HDMI_1'
is not a valid value of the union type 'extendableAudioDevice'.
BOARD_SUPPORT_MULTIAUDIO ?= false
```

KernelReleaseFormat: используйте официальный Google GKI Release boot.img.

```text
vts_generic_boot_image_test
GenericBootImageTest#KernelReleaseFormat
GenericBootImageTest#GenericRamdisk
Value of: KernelRelease::Parse(release, true ).has_value()
Actual: false
Expected: true
Kernel release '5.10.168-maybe-dirty' does not have generic kernel image
(GKI) release format. It must match this regex:
^(?P<w>\d+)[.](?P<x>\d+)[.](?P<y>\d+)-(?P<z>android\d+)-(?P<k>\d+).*$
Example: 5.4.42-android12-0-something
```

GkiComplianceV2/GkiComplianceV2_kernel: используйте официальный Google GKI Release boot.img.

```text
vts_gki_compliance_test
GkiComplianceTest#GkiComplianceV2
GkiComplianceTest#GkiComplianceV2_kernel
KernelVersionTest#AgainstPlatformRelease
The GKI image descriptor is not signed by an official key.
```

VtsHalSensorsV1_0TargetTest: откалибруйте датчик (см. подготовку к тесту).

```text
VtsHalSensorsV1_0TargetTest
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationSlow/0_default
PerInstance/SensorsHidlTest#AccelerometerStreamingOperationNormal/0_default
Value of: checker.check(sensorEvents, &s)
Actual: false
Expected: true
Event @ 49513760914252 (8.6287, -0.603339, 1.13006) has norm 8.72328,
which is beyond range [8.80665, 10.8067]
echo 1 > /sys/class/sensor_class/accel_calibration
```

vts_kernel_net_tests: FTP-патч `/GMS-Test-Suite/Exp+/vts_kernel_net_tests`.

```text
vts_kernel_net_tests
vts_kernel_net_tests#vts_kernel_net_tests
testVtiRekey_IPv4_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv4_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv4 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
testVtiRekey_IPv6_in_IPv6 (xfrm_tunnel_test.XfrmVtiTest) ... ERROR
```

Enabled/vts_virtual_ab_test: включите виртуальный A/B и его сжатие; проверьте свойство ниже.

```text
ro.virtual_ab.userspace.snapshots.enabled=true
vts_libsnapshot_test
SnapshotUpdateTest#FullUpdateFlow
SnapshotUpdateTest#MergeCannotRemoveCow
vts_ota_config_test
VAB#Enabled
vts_virtual_ab_test
VirtualAbRequirementTest#EnabledOnLaunchT
build/make/target/product/virtual_ab_ota/compression.mk:
PRODUCT_VENDOR_PROPERTIES += ro.virtual_ab.userspace.snapshots.enabled=true
build/make/target/product/virtual_ab_ota/compression_with_xor.mk:
$(call inherit-product, $(SRC_TARGET_DIR)/product/virtual_ab_ota/compression.mk)
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
BOARD_ROCKCHIP_VIRTUAL_AB_COMPRESSION := true
BOARD_BOOT_HEADER_VERSION := 4 ##
BOARD_BUILD_GKI := true
```

vts_treble_vintf_vendor_test: пустой hash требует фиксации интерфейса в current.txt.

В hidl-gen подставьте name:path из hidl_package_root и сбойный интерфейс. Вывод добавьте в соседний current.txt, возможно /vendor/rockchip/hardware/interfaces/current.txt; дополните недостающее по ошибкам. Написание idl_package_root в исходнике требует проверки.

```text
vts_treble_vintf_vendor_test
DeviceManifest/SingleManifestTest#InterfacesAreReleased/0
rockchip.hardware.tv.input@1.0::ITvInput has an empty hash. This is
because it was compiled without being frozen in a corresponding current.txt
file.
hidl-gen -L hash -r rockchip.hardware:vendor/rockchip/hardware/interfaces -r android.hardware:hardware/interfaces -r android.hidl:system/libhidl/transport rockchip.hardware.tv.input@1.0::ITvInput
```

### 16.13 Ошибки Checklist

M13 — Default Home Screen Display и M14 — Placement of Google Collections Folder требуют GmsSampleIntegration.apk.

```text
vendor/partner_gms/apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml <folder title=......</folder>
```

Duo.apk и Meet.apk имеют общий пакет `com.google.android.apps.tachyon`, но разные значки. Интегрируйте только один, иначе появятся два значка.

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
Chrome \
Drive \
Gmail2 \
- Duo \
+ Meet \
```

Папка Google должна содержать Google TV (ранее Play Movies), то есть Videos.apk.

```text
package:/product/app/Videos/Videos.apk=com.google.android.videos
Android_SDK/vendor/partner_gms$ git diff apps/GmsSampleIntegration/res_dhs_full/xml/partner_default_layout.xml
- <favorite packageName="com.google.android.videos"
className="com.google.android.youtube.videos.EntryPoint"/>
+ <favorite packageName="com.google.android.videos"
className="com.google.android.videos.GoogleTvEntryPoint"/>
<favorite packageName="com.google.android.apps.tachyon"
className="com.google.android.apps.tachyon.MainActivity"/>
```

- M30 — Restore Experience in the Setup Wizard: `/GMS-Test-Suite/Exp+/M30_A13_USB Data`
- M33 — Location Privacy: пропустите без GPS.
- M53 — Safety and Emergency settings: `/GMS-Test-Suite/Exp+/M53_Emergency`
- M56 — Monochrome app icons: `/GMS-Test-Suite/Exp+/M56_A13_0828.zip`

```text
Android_SDK/vendor/partner_gms$ git diff products/gms.mk
PRODUCT_PACKAGES += \
GmsSampleIntegration \
- SearchLauncherQuickStep
+ SearchLauncherQuickStep \
+ WallpaperGoogle
Android_SDK/vendor/partner_gms$ git diff etc/permissions/privapp-permissions-google-system-ext.xml
+ <privapp-permissions package="com.google.android.apps.wallpaper">
+ <permission name="android.permission.READ_WALLPAPER_INTERNAL"/>
+ <permission name="android.permission.SET_WALLPAPER_COMPONENT"/>
+ <permission name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
+ <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
+ <permission name="android.permission.MODIFY_DAY_NIGHT_MODE"/>
+ <permission name="android.permission.BIND_WALLPAPER"/>
+ </privapp-permissions>
```

M58 — Code scanner: `/GMS-Test-Suite/Exp+/M58_Code scanner`.

```text
Android_SDK/frameworks/base$ git diff core/res/res/values/config.xml
<!-- Default component for QR code scanner -->
- <string name="config_defaultQrCodeComponent"></string>
+ <string
name="config_defaultQrCodeComponent">com.google.android.gms/.mlkit.barcode.ui.PlatformBarcodeScanningActivityProxy</string>
Android_SDK/frameworks/base$ git diff packages/SystemUI/res/values/config.xml
<!-- The default tiles to display in QuickSettings -->
<string name="quick_settings_tiles_default" translatable="false">
-
wifi,bt,dnd,flashlight,rotation,battery,cell,airplane,night,screenrecord
+
wifi,bt,dnd,flashlight,rotation,battery,cell,qr_code_scanner,airplane,night,screenrecord
</string>
```

M60 — Long press on power to Assistant Education: `/GMS-Test-Suite/Exp+/M60_Assistant Education`. В EEA-V2 SearchSelector не должен иметь значка и не должен отключаться (см. EEA).

```text
Android_SDK/packages/apps/Settings$ git diff src/com/android/settings/applications/ApplicationFeatureProviderImpl.java
keepEnabledPackages.add(euicc.packageName);
}
+
keepEnabledPackages.add("com.google.android.apps.setupwizard.searchselector");
keepEnabledPackages.addAll(getEnabledPackageAllowlist());
```

### 16.14 Ошибки userdebug

Следующие тесты требуют user, не userdebug.

```text
CtsDrmTestCases
android.drm.cts.DRMTest#testForwardLockAccess
FAILURE: java.lang.RuntimeException: setDataSource failed: status =
0x80000000
CtsOsHostTestCases
android.os.cts.BuildHostTests#testIsSecureUserBuild
FAILURE: org.junit.ComparisonFailure: Must be a user build expected:
<user[debug]> but was:<user[]>
CtsOsTestCases
android.os.cts.BuildVersionTest#testBuildFingerprint
FAILURE: junit.framework.ComparisonFailure: Variant expected:<user[]>
but was:<user[debug]>
CtsPermission2TestCases
android.permission2.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
CtsPermissionPolicyTestCases
android.permissionpolicy.cts.PrivappPermissionsTest#privappPermissionsMustBeEnforced
java.lang.AssertionError: ro.control_privapp_permissions is not set to
enforce expected:<enforce> but was:<null>
```

## 17 Отладка

Некоторые тесты зависят от разметки или DPI. Измените DPI или ориентацию.

wm density меняет DPI; user_rotation: 0/1/2/3.

```text
wm density *** ## 调节机器dpi
settings get system user_rotation
settings put system user_rotation 1 ## user_rotation值为0/1/2/3
GtsPermissionControllerHostTestCases
android.permissioncontroller.gts.PermissionControllerHostTest#testDenyAppPermissionFragment
FAILURE: java.lang.AssertionError: Expected four atoms reported
```

CTS создает Personal и Work. Удалите рабочий профиль через Personal → Settings → Passwords & accounts → Work → Remove work profile.

## 18 Заявка на исключение

Если тип изделия не отвечает условию теста, рассмотрите исключение Google. Выполните сбойный тест отдельно, приложите results и logs. Снимите bugreport:

```text
adb bugreport
```

Приложите отчет, например `bugreport-rk3399_Android12-SQ3A.220705.003.A1-2023-05-10-04-58-08.zip`. Войдите через `@***.corp-partner.google.com` и подайте заявку в IssueTracker.

## 19 Приложение A

В исходнике эти модули перечислены как прошедшие GMS/EDLA; это не сертификация ArmSoM:

| Модуль | Модель |
|---|---|
| Camera | AR0230 / Sony IMS 179 |
| WiFi | AP6275P(PCIE) / ap6275S(sdio) |

Написание `IMS 179` сохранено; уточните реальную модель.

## 20 Приложение B

| Пакет | Адрес загрузки | Требуется MADA/EDLA |
|---|---|---|
| GMS | [https://docs.partner.android.com/gms/building/integrating/gms-download](https://docs.partner.android.com/gms/building/integrating/gms-download) | Y |
| Mainline | [https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5](https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5) | Y |
| CTS/CTSV | [https://source.android.com/docs/compatibility/cts/downloads](https://source.android.com/docs/compatibility/cts/downloads) | N |
| VTS/GSI | [https://docs.partner.android.com/gms/testing/vts](https://docs.partner.android.com/gms/testing/vts) | Y |
| STS | [https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-](https://drive.google.com/drive/folders/1xqPTtC6MWiQizfFVdG7Ho0f2oGsmH0e-) | Y |
| GTS | [https://docs.partner.android.com/gms/testing/gts?hl=en](https://docs.partner.android.com/gms/testing/gts?hl=en) | Y |
| GTSV | [https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download](https://docs.partner.android.com/gms/testing/gts/gts-verifier?hl=en#download) | В исходнике пусто |
| GKI | [https://source.android.com/docs/core/architecture/kernel/gki-release-builds](https://source.android.com/docs/core/architecture/kernel/gki-release-builds) | N |
| APTS | [https://docs.partner.android.com/gms/testing/apts?hl=en](https://docs.partner.android.com/gms/testing/apts?hl=en) | Y |
| GOATS | [https://docs.partner.android.com/gms/testing/goats?hl=en](https://docs.partner.android.com/gms/testing/goats?hl=en) | Y |
| PAB | [https://ci.android.com/builds/branches/aosp-master/grid](https://ci.android.com/builds/branches/aosp-master/grid) | N |
| Checklist | [https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#](https://docs.partner.android.com/gms/policies/overview/manual-checklist?hl=en#) | Y |
| Исправления безопасности | [https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ](https://drive.google.com/drive/u/0/folders/0B85mEDAGzAbsckRrZFhhV3YwTEk?resourcekey=0-6zNsbY0nWUmYsJO2TF-RZQ) | В исходнике пусто |


| PAB | CTS/VTS |
|---|---|
| aosp-android11-tests-release | [Android11](https://ci.android.com/builds/branches/aosp-android11-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android12-tests-release | [Android12](https://ci.android.com/builds/branches/aosp-android12L-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |
| aosp-android13-tests-release | [Android13](https://ci.android.com/builds/branches/aosp-android13-tests-release/grid?legacy=1&selected-targets=test_suites_arm64) |

Подпись Android12 — aosp-android12-tests-release, но ссылка PDF ведет на aosp-android12L-tests-release; различие сохранено. Ячейки MADA/EDLA для GTSV и патчей безопасности пусты в исходнике; значения не придуманы. Партнерские ссылки могут требовать доступа.

## 21 Дополнения и различия английской V1.3

Ниже технические сведения английского оригинала2021г., не заменяющие китайскуюV3.0 и не являющиеся текущими требованиями. Общий материал включён выше, уникальные примеры и конфликты приведены здесь.

Английские с.2–3 требуют Go при2GB и меньше; PX30 использует sublicense/Android RK3326, uboot/kernel PX30. Старый L1 на с.4: RK3288/RK3399; OpteeV2 с.5: RK3326/RK3566/RK3568, остальныеV1. Не заменяйте новые списки этими.

С.7–9: патчи обычно действуют три месяца; старый инструмент RKTools/windows/KeyBoxWrite_v1.51_0109.zip и Rockchip_User_Guide_KeyWrite_CN.pdf. Для keybox указан один CTS case, не китайский GtsEdiHostTestCases. Android11 media1.5, старый путь /tmp/android-cts-media/android-cts-media-1.4. Сохраняется версия.

Английский STS: run sts-engbuild, китайский sts-dynamic-full; VTS retry: run vts --retry0. Проверяйте пакет, не смешивайте. GOATS требует Clang и патч RGA2→RGA2G. С.14: BTS с2018-04-01, ZIP вместо update.img, рискPHA и консультация3PL/TAM сохранены.

| Платформа Android11 старого источника | Go Express | Regular Express |
| --- | --- | --- |
| RK3326 | Ready | WIP |
| RK3566 | Ready | Ready |
| RK3368a | WIP | WIP |
| RK3288 | N/A | WIP |
| RK3399 | N/A | WIP |

Ready/WIP/N/A — исторические статусы. Код ниже по страницам сохраняет значения старого SDK и происхождение повторов. Английские комментарии неизменны.

Код английского оригинала, с.2:

```text
lunch rk3326_rgo-user
```

Код английского оригинала, с.3:

```text
device/rockchip/rk3326/BoardConfig.mk
PRODUCT_UBOOT_CONFIG := px30
```

```text
https://docs.partner.android.com/gms/building/integrating/gms-download
```

```text
https://drive.google.com/drive/folders/1gxxMalTC99Y2SvyRDUfiDFvY_k4OzjO5
```

```text
# Initialize with repo
repo init -u https://partner-android.googlesource.com/platform/manifest -b r-aml-prebuilt-release
# Starting synchronize, please check if `.repo/manifests/default.xml` exists.
repo sync -c -j8
```

Код английского оригинала, с.4:

```text
diff --git a/default.xml b/default.xml
index 7be1f37..01ccba9 100644
--- a/default.xml
+++ b/default.xml
@@ -4,7 +4,7 @@
   <remote name="ohd"
            fetch=".."
            review="https://partner-android-review.googlesource.com/" />
- <default revision="r-aml-prebuilt-release"
+ <default revision="refs/tags/mainline_m_2020_dec_preload_5"
            remote="ohd" />
   <!-- Google-signed Mainline prebuilt module projects !-->
```

```text
BOARD_WIDEVINE_OEMCRYPTO_LEVEL := 3
```

```text
BUILD_WITH_EEA := true
BUILD_WITH_EEA_TYPE := type1 (Please config according to your EEA type)
```

Код английского оригинала, с.5:

```text
BUILD_WITH_GOOGLE_MARKET := true
# Only change the following macro when your product has radio
BUILD_WITH_GOOGLE_MARKET_ALL := true
# When creating the user build, please set this macro to false to delete the
Rockchip StressTest tool, otherwise the device may not start normally.
PRODUCT_HAVE_RKAPPS := false
```

```text
diff --git a/device.mk b/device.mk
index 63bb4ac..4340170 100644
--- a/device.mk
+++ b/device.mk
@@ -899,7 +899,7 @@ ifeq ($(strip $(BUILD_WITH_GOOGLE_MARKET)), true)
     OVERRIDE_TARGET_FLATTEN_APEX := true
     PRODUCT_PROPERTY_OVERRIDES += ro.apex.updatable=false
     # 2G A Go
- #TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
+ TMP_GMS_VAR := $(TMP_GMS_VAR)_2gb
   endif
   ifeq ($(strip $(BUILD_WITH_EEA)),true)
     BUILD_WITH_GOOGLE_MARKET_ALL := true
```

```text
PRODUCT_HAVE_OPTEE := true
```

```text
BOARD_GRAVITY_SENSOR_SUPPORT := true
BOARD_COMPASS_SENSOR_SUPPORT := true
```

```text
BOARD_BLUETOOTH_LE_SUPPORT := false
```

```text
BUILD_WITH_GOOGLE_FRP := true
```

Код английского оригинала, с.6:

```text
BOARD_AVB_ENABLE := true
```

```text
RKDocs/android/patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

```text
BOARD_USES_AB_IMAGE := true
BOARD_ROCKCHIP_VIRTUAL_AB_ENABLE := true
# Please add the following changes if it does not exist:
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
```

```text
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
  include device/rockchip/common/BoardConfig_AB.mk
  TARGET_RECOVERY_FSTAB := device/rockchip/rk356x/rk3566_rgo/recovery.fstab_AB
endif
+ # The following overlay must be placed after `include
device/rockchip/common/BoardConfig_AB.mk`
+BOARD_SUPER_PARTITION_SIZE := 3263168512
+BOARD_ROCKCHIP_DYNAMIC_PARTITIONS_SIZE := $(shell expr $(BOARD_SUPER_PARTITION_SIZE) - 4194304)
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index b7d433a..a87e2e3 100644
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -204,6 +204,7 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
+CONFIG_ANDROID_AB=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
```

Код английского оригинала, с.7:

```text
device/rockchip/common/BoardConfig.mk:
BOARD_SELINUX_ENFORCING ?= true
```

```text
diff --git a/prebuild.mk b/prebuild.mk
index 28391f6..7f38922 100644
--- a/prebuild.mk
+++ b/prebuild.mk
@@ -4,3 +4,4 @@ $(warning You can disable this by removing this and setting
BOARD_RECORD_COMMIT_
 $(shell test -d .repo && .repo/repo/repo manifest -r -o
$(OUT_DIR)/commit_id.xml)
 -include $(TARGET_DEVICE_DIR)/prebuild.mk
+ROCKCHIP_BUILD_NUMBER := 202001 (Some numbers)
```

```text
build/make:
core/version_defaults.mk
PLATFORM_SECURITY_PATCH := 2020-03-05
```

```text
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index 46440b6..22831d2 100644
```

Код английского оригинала, с.8:

```text
--- a/configs/rk3568_defconfig
+++ b/configs/rk3568_defconfig
@@ -205,6 +205,10 @@ CONFIG_AVB_LIBAVB=y
 CONFIG_AVB_LIBAVB_AB=y
 CONFIG_AVB_LIBAVB_ATX=y
 CONFIG_AVB_LIBAVB_USER=y
 CONFIG_RK_AVB_LIBAVB_USER=y
 CONFIG_OPTEE_CLIENT=y
 CONFIG_OPTEE_V2=y
+CONFIG_ANDROID_WRITE_KEYBOX=y
+CONFIG_ANDROID_KEYMASTER_CA=y
+CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
```

```text
1. A single testcase report from CTS.
2. Device information (Ask 3pl for a template).
3. A file ends with .txt and includes Device ID.
Google Requests to use Device ID to apply the key:
Device ID within the file should meet the following properties:
    1. Unique and cannot be duplicate of another Device IDs within the file
    2. Must be between 1-32 characters in length
    3. Only following characters allowed [a-z][A-Z][0-9][_][-][.]
    4. No whitespaces allowed
Device ID files have the following requirements:
    1. ASCII text file in unix format.
    2. File name should be created with the following characters [a-z][A-Z][0-
9][_][-][.] in a meaningful way (e.g. Make_Model_Date_Quantity.txt)
    3. Must only contain Device IDs. No comments, headers, or other
information
    4. One Device ID per line
    5. No duplicate Device IDs within file
    6. No blank lines
    7. No white spaces
```

Код английского оригинала, с.10:

```text
In Ubuntu, you can add the following content to ~/.bashrc or edit the
following into a file such as env, then source env before testing:
export JAVA_HOME=/home/Your_Name/Software/jdk1.8.0_77
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/platform-tools:$PATH
export PATH=/home/Your_Name/Software/android-sdk-linux/build-tools/19.0.0:$PATH
```

```text
sudo apt-get install lib32stdc++6 lib32z1
```

```text
$ sudo apt-get install python-dev
```

```text
$ sudo apt-get install python-protobuf
$ sudo apt-get install protobuf-compiler
```

```text
$ sudo apt-get install python-virtualenv
$ sudo apt-get install python-pip
```

```text
$ sudo apt install virtualenv
```

```text
sudo apt autoremove python-virtualenv
sudo apt autoremove virtualenv
sudo ln -sf ~/.local/bin/pip2 /usr/bin/pip
pip install --user virtualenv
```

Код английского оригинала, с.11:

```text
Q: Replace your adb/fastboot
A: Take adb as an example, type in the terminal:
whereis adb
$ adb: /home/rockchip/Software/android-sdk-linux/platform-tools/adb
adb kill-server
After confirming the location of adb/fastboot, replace the adb/fastboot binary
```

```text
run cts --shard-count 3 -s SN1 -s SN2 -s SN3
```

```text
CtsKeystoreTestCases
android.keystore.cts.KeyAttestationTest#testEcAttestation
android.keystore.cts.KeyAttestationTest#testRsaAttestation
android.keystore.cts.KeyAttestationTest#testEcAttestation_DeviceLocked
android.keystore.cts.KeyAttestationTest#testRsaAttestation_DeviceLocked
```

Код английского оригинала, с.12:

```text
adb shell settings put global hidden_api_policy 1
```

```text
adb install -r -g CtsVerifier.apk
```

Код английского оригинала, с.13:

```text
adb shell appops set com.android.cts.verifier android:read_device_identifiers allow
```

```text
adb shell appops set com.android.cts.verifier MANAGE_EXTERNAL_STORAGE 0
```

```text
$ vi .bashrc
export APE_API_KEY=/path/to/key.json
```

Код английского оригинала, с.14:

```text
diff --git a/drivers/video/rockchip/rga2/Kconfig b/drivers/video/rockchip/rga2/Kconfig
index efc1ef6..3458051 100644
--- a/drivers/video/rockchip/rga2/Kconfig
+++ b/drivers/video/rockchip/rga2/Kconfig
@@ -1,5 +1,5 @@
 # SPDX-License-Identifier: GPL-2.0
-menu "RGA2"
+menu "RGA2G"
        depends on ARCH_ROCKCHIP
 config ROCKCHIP_RGA2
```

```text
rockchip~rk3326_qgo~rk3326_qgo~10~QD1A.190821.014.C2~201911~user~release-keys$
ls
boot-debug.img boot.img dtbo.img misc.img recovery.img super.img
vbmeta.img
```

Код английского оригинала, с.15:

```text
repo init -m Android10_Express.xml
# For Android 11
repo init -m Android11_Express.xml
```

```text
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_Qt/manifests.git -m Android10_Express.xml
# Android 11
repo init --repo-url=ssh://git@www.rockchip.com.cn:2222/repo-release/tools/repo.git -u ssh://git@www.rockchip.com.cn:2222/Android_R/manifests.git -m Android11_Express.xml
```

```text
BUILD_WITH_GOOGLE_GMS_EXPRESS := true
```

Код английского оригинала, с.16:

```text
diff --git a/gms-express.xml b/gms-express.xml
index 78f4d99..de93557 100644
--- a/gms-express.xml
+++ b/gms-express.xml
@@ -16,5 +16,5 @@
  -->
  <!-- These are configurations that should exist on GMS Express devices. -->
  <config>
- <feature name="com.google.android.feature.GMSEXPRESS_BUILD " />
+ <feature name="com.google.android.feature.GMSEXPRESS_PLUS_BUILD" />
  </config>
```

```text
patch/frameworks/base/increase_waiting_time_for_setup_wizard.diff
```

```text
patches/gms/0001-libavb-Lock-the-device-when-the-device-init-or-write.patch
```

## 22 Указатель технических ссылок

Технические ссылки сохранены по страницам PDF. Некоторые требуют доступа партнёра; вход и операции не выполнялись.

- [CN PDF p.4](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2#nearby-share)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#10_android_go)

- [CN PDF p.5](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=3#64-bit-gms)

- [CN PDF p.11](https://docs.partner.android.com/gms/policies/regional/eea-builds)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android12-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android13-security-release:)

- [CN PDF p.17](https://cs.android.com/android/platform/superproject/+/android14-security-release:)

- [CN PDF p.26](https://source.android.com/docs/core/ota/apex?authuser=2#vbmeta-signing)

- [CN PDF p.30](https://docs.google.com/document/d/1SK2LvrqvTQDEvK8WlB-EujCVvyEogiz4O83gtNkd_sU/edit)

- [CN PDF p.30](https://docs.partner.android.com/gms/policies/edla/edla-other-form)

- [CN PDF p.54](https://docs.partner.android.com/gms/policies/domains/reqs?authuser=2&hl=zh-cn#app-standby-buckets)

- [CN PDF p.67](https://docs.partner.android.com/gms/building/enterprise/zero-touch/implementing?hl=en#remove-oobconfig)

- [CN PDF p.75](https://docs.partner.android.com/gms/policies/regional/eea-builds?hl=en#v2-build-reqs)

- [CN PDF p.76](https://issuetracker.google.com/)

- [EN PDF p.11](https://support.google.com/androidpartners_gms/answer/9380762?hl=en)

{% endraw %}
