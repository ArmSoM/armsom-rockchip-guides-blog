---
title: "Rockchip Android14 GKI: модули, сборка и диагностика"
description: "Rockchip Android14 GKI: модули, сборка и диагностика"
excerpt: "Rockchip Android14 GKI: модули, сборка и диагностика"
translation_key: "244-rockchip-android14-gki"
slug: "244-rockchip-android14-gki"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 GKI: модули, сборка и диагностика

Источники: Rockchip Android14 GKI, китайский RK-KF-YF-775 и английский RK-KF-YF-778, оба V1.1.1 , по 21 странице. Основа — полное китайское техническое содержание и его нумерация; отличия английского отмечены. Это исторические процедуры SDK и требования сертификации, не проверка текущей политики и не подтверждение поддержки ArmSoM. Команды не выполнялись на оборудовании; перед прошивкой и изменением разделов сохраните данные.

## 1.1 Что такое GKI

GKI (Generic Kernel Image) уменьшает фрагментацию: общее ядро, а драйверы SoC/платы — загружаемые модули. Стабильный интерфейс модулей позволяет независимо обновлять ядро и драйверы. Расширения передают upstream. Производители используют определённые интерфейсы; новые интерфейсы ядра требуют подачи Google и длительного согласования, поэтому работу планируют заранее. Источник отмечает обязательный GKI как сложность сертификации Android14 GMS/EDLA.

![Архитектура GKI](/docs/rockchip-android14-gki/images/architecture-en.png)

Архитектура GKI - Оригинальная иллюстрация;страница PDF 5 (EN).

## 1.2 Продукты, требующие GKI

По источнику GKI требуется продуктам с сертификацией GMS/EDLA: Android14, Android13 и Android12 на RK3588/RK3588S. Без этих сертификаций GKI не обязателен.

## 1.3 GKI и non-GKI

| Пункт | GKI | Не GKI |
| --- | --- | --- |
| boot.img | Google периодически публикует; код нельзя изменять локально. | Сборка из исходников RK; изменяемый код. |
| Модули драйверов | Загрузка KO; интерфейсы должны быть в Google boot.img. | Встроены в boot; исходники RK позволяют менять/добавлять интерфейсы. |
| Исходники ядра | Исходники RK собирают только KO драйверов. | RK собирает полное ядро/драйверы; модули .o встроены. |

U-Boot должен поддерживать header V4 (в источнике head4). Добавляются vendor_boot, init_boot, resource и включается A/B. Английская таблица kernel code повторяет таблицу драйверов; выше сохранено отдельное китайское сравнение исходников.

## 2 Состояние адаптации

Ядро источника — 6.1; все чипы ниже отмечены адаптированными. Это статус SDK чипа, не квалификация платы.

| Чип | Статус |
| --- | --- |
| RK3562 | Адаптирован |
| RK3568 | Адаптирован |
| RK3566 | Адаптирован |
| RK3588 | Адаптирован |
| RK3588S | Адаптирован |
| RK3326 | Адаптирован |
| PX30 | Адаптирован |
| RK3399 | Адаптирован |
| RK3576 | Адаптирован |

## 3 Загрузка и сборка upstream

Google публикует boot.img с большими интервалами. Upstream можно собрать для проверки/отладки. Нужен доступ к серверам Google; результат — out/boot.img.

```sh
repo init -u https://android.googlesource.com/kernel/manifest -b common-android14-6.1
tools/bazel run //common:kernel_aarch64_dist -- --dist_dir=out
```

## 4 Каталоги SDK

| Назначение | Путь |
| --- | --- |
| KO ядра | mkcombinedroot/vendor_ramdisk/lib/modules/ |
| Google boot.img | mkcombinedroot/prebuilts/boot-6.1.img |
| Защищённые KO AOSP | kernel/prebuilts/6.1/arm64/ |
| Порядок KO Kernel-6.1 при старте | mkcombinedroot/res/vendor_ramdisk_modules.load |
| Порядок KO Android init | mkcombinedroot/res/vendor_modules.load |

## 5 Среда сборки

Китайский §5 и английский §9 требуют Ubuntu20.04+ и pahole1.25. Английский §5 пишет pahole1.25 или новее; расхождение сохранено. Повтор требований в английском §9 сдвигает следующие главы на один номер.

## 6.1 Включение GKI

Задайте BOARD_BUILD_GKI в каталоге продукта Android device; RK3562_UGO уже включает его. При отдельной сборке U-Boot включите A/B в config; полный build.sh добавит макрос сам. Патч смешивает rk3568/rk3588, каталог Android13 и fasle вместо false: сохранены исходные литералы, не указание выбирать другой продукт.

```diff
~/a2_Android14_sdk/device/rockchip/rk3562$ git diff
diff --git a/rk3562_u/BoardConfig.mk b/rk3562_u/BoardConfig.mk
old mode 100644
new mode 100755
index 50da541..06da5f3
--- a/rk3562_u/BoardConfig.mk
+++ b/rk3562_u/BoardConfig.mk
@@ -15,10 +15,21 @@
#
include device/rockchip/rk3562/BoardConfig.mk
BUILD_WITH_GO_OPT := false
-BOARD_BUILD_GKI := fasle
+BOARD_BUILD_GKI := true
```

```diff
~/a2_Android13_sdk/u-boot$ git diff
diff --git a/configs/rk3568_defconfig b/configs/rk3568_defconfig
index fbd9820acc..e23e438792 100644
--- a/configs/rk3588_defconfig
+++ b/configs/rk3588_defconfig
@@ -207,6 +207,7 @@ CONFIG_RSA_N_SIZE=0x200
CONFIG_RSA_E_SIZE=0x10
CONFIG_RSA_C_SIZE=0x20
CONFIG_SHA512=y
CONFIG_LZ4=y
CONFIG_LZMA=y
CONFIG_SPL_GZIP=y
@@ -220,3 +221,4 @@ CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V2=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
+CONFIG_ANDROID_AB=y
```

## 6.2 Сборка образов

Полная сборка аналогична non-GKI. Локальное ядро создаёт resource.img и KO для vendor_boot.img; действительное ядро — Google mkcombinedroot/prebuilts/boot-6.1.img. Прошейте update.img; при отладке vendor_boot.img собирается отдельно.

```sh
source build/envsetup.sh
lunch rk3562_ugo-userdebug
./build.sh -ACUKup
# output: rockdev/Image-rk3562_ugo/update.img
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

## 6.3 Прошивка

Прошейте полный rockdev/Image-rk3562_ugo/update.img инструментом Rockchip либо отдельные образы. Правый клик в пустой области → импорт конфигурации → TXT → parameter.txt; выберите образы, одинаковые для A/B. Текст называет rockdev/Image-rk3588_t/, дерево — rk3562_ugo; используйте свой продукт, не смешивайте примеры.

![Прошивка полного образа](/docs/rockchip-android14-gki/images/flash-complete-en.png)

Прошивка полного образа - Оригинальная иллюстрация;страница PDF 9 (EN).

![Импорт конфигурации разделов](/docs/rockchip-android14-gki/images/flash-import-en.png)

Импорт конфигурации разделов - Оригинальная иллюстрация;страница PDF 10 (EN).

![Прошивка отдельных образов](/docs/rockchip-android14-gki/images/flash-parts-en.png)

Прошивка отдельных образов - Оригинальная иллюстрация;страница PDF 10 (EN).

```text
rockdev/Image-rk3562_ugo
├── baseparameter.img
├── boot.img
├── dtbo.img
├── init_boot.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── resource.img
├── super.img
├── uboot.img
├── update.img
├── vbmeta.img
└── vendor_boot.img
```

## 7.1 Добавление и сборка модулей

1. Поместите драйвер в нужный каталог kernel-6.1: gt1x — в drivers/input/touchscreen/, добавив Makefile и Kconfig стандартным способом. 2. Создайте arch/arm64/configs/xxx_gki.config с CONFIG_TOUCHSCREEN_GT1X=m (m — KO). 3. Добавьте имя KO в соответствующий список .load.

| .load-файл | Раздел | Makefile | Этап загрузки |
| --- | --- | --- | --- |
| vendor_ramdisk_modules.load | vendor_boot | vendor_ramdisk_gki.mk | ramdisk init |
| vendor_modules.load | vendor | vendor_gki.mk | Запуск Android |
| recovery_modules.load | recovery | recovery_gki.mk | Recovery |

Драйверы без требований раннего запуска (touchscreen/sensors) лучше загружать на этапе Android. В mkcombinedroot добавьте xxx_tp.ko в res/vendor_modules.load, затем соберите/прошейте super.img. KO помещаются в vendor_dlkm/lib/modules/; при отладке можно push туда и перезагрузить для автоматической загрузки. Не меняйте существующий порядок mkcombinedroot/res/vendor_ramdisk_modules.load: возможен отказ загрузки. Лишние ramdisk-модули замедляют старт; vendor_modules.load влияет меньше.

```sh
cd mkcombinedroot
```

```diff
diff --git a/res/vendor_modules.load b/res/vendor_modules.load
index e69de29..a53449f 100644
--- a/res/vendor_modules.load
+++ b/res/vendor_modules.load
@@ -0,0 +1,4 @@
pcie-dw-rockchip.ko
cfg80211.ko
+xxx_tp.ko
```

4. Для изменений ядра используйте ./build.sh -K: KO автоматически копируются в mkcombinedroot/vendor_ramdisk/lib/modules для упаковки полного build в vendor_boot.img/super.img. При отдельной сборке ядра запустите ./copy_modules.sh из mkcombinedroot вручную. 5. В корне проекта упакуйте vendor_boot.img командой ниже и прошейте; KO раздела vendor требуют полной сборки/прошивки super.img. 6. Проверьте запуск; vendor-KO можно push/монтировать вручную после загрузки. При изменении DTS прошейте kernel-6.1/resource.img. Китайский текст повторяет номер5 для проверки; английский даёт6.

```sh
make installclean;make vendorbootimage -j12
# output: out/target/product/rk3562_ugo/vendor_boot.img
```

| Режим | Хранилище | Дисплей | Клавиши | Батарея | PMIC | TP | Датчики | NFC/Wi-Fi/BT | Камера |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recovery | Y | Y | Y | Y | Y | N | N | N | N |
| Charger | Y | Y | Y | Y | Y | N | N | N | N |
| Android | Y | Y | Y | Y | Y | Y | Y | Y | Y |

Матрица этапов AOSP: Y — загружается, N — нет.

## 8.1 Журналы U-Boot

| Содержимое | Версия Header |
| --- | --- |
| vendor_ramdisk (v-ramdisk) | V3+ |
| bootconfig | V4+ |

```text
## Booting Android Image at 0x003ff000 ...
Kernel: 0x00400000 - 0x03088ffc (45604 KiB)
v-ramdisk: 0x0a200000 - 0x0a6944c8 (4690 KiB)
ramdisk: 0x0a6944c8 - 0x0a7e54df (1349 KiB)
bootconfig: 0x0a7e54df - 0x0a7e559c (1 KiB)
bootparams: 0x0a7e559c - 0x0a7e759c
```

## 8.2 Журналы Android и bootconfig

Версия примера названа 5.10.117-android13-9-00037-gbc08447eb7bd, но журнал содержит android12. Это исторические образцы, не версия Android14/6.1. В Header V4 параметры androidboot.xxx должны быть в bootconfig, не kernel cmdline; проверка:cat /proc/bootconfig.

```text
[ 0.000000][ T0] Booting Linux on physical CPU 0x0000000000 [0x412fd050]
[ 0.000000][ T0] Linux version 5.10.117-android12-9-00037-gbc08447eb7bd
(build-user@build-host) (Android (7284624, based on r416183b) clang version
12.0.5 (https://android.googlesource.com/toolchain/llvm-project
c935d99d7cf2016289302412d708641d52d2f7ee), LLD 12.0.5
(/buildbot/src/android/llvm-toolchain/out/llvm-project/lld c935d99d7cf2016289302412d708641d52d2f7ee)) #1 SMP PREEMPT
Thu Aug 25 15:24:20 UTC 2022
```

```text
[ 0.000000][ T0] Kernel command line: stack_depot_disable=on
kasan.stacktrace=off kvm-arm.mode=protected cgroup_disable=pressure
cgroup.memory=nokmem storagemedia=emmc console=ttyFIQ0 firmware_class.path=/vendor/etc/firmware
init=/init rootwait ro loop.max_part=7 bootconfig buildvariant=userdebug earlycon=uart8250,mmio32,0xfeb50000 irqchip.gicv3_pseudo_nmi=0
```

## 8.3 Успешная загрузка KO

```text
[ 1.034730][ T1] Run /init as init process
[ 1.036190][ T1] init: init first stage started!
[ 1.040534][ T1] init: Loading module /lib/modules/io-domain.ko with args
''
[ 1.042038][ T1] init: Loaded kernel module /lib/modules/io-domain.ko
```

## 8.4 Ошибки загрузки KO

```text
[ 0.805736][ T1] cryptodev: Unknown symbol crypto_ahash_final (err -2)
[ 0.806383][ T1] cryptodev: Unknown symbol sg_nents (err -2)
[ 0.806972][ T1] cryptodev: Unknown symbol crypto_alloc_akcipher (err -2)
[ 0.819768][ T1] Kernel panic - not syncing: Attempted to kill init!
exitcode=0x00007f00
```

Unknown symbol означает отсутствие экспортов crypto_ahash_final, sg_nents, crypto_alloc_akcipher в boot.img. Используйте другой экспорт (поиск kernel-6.1/android) либо подайте необходимое расширение по §10. Английский §8.4 лишь говорит, что ошибка обычно не возникает, и ссылается на отсутствующий раздел «Noun explanation – ABI». Здесь сохранены китайское решение и пропущенный английским случай Exec format error.

```text
[ 1.825070][ T1] init: Failed to insmod '/lib/modules/gc05a2.ko' with args
'': Exec format error
[ 1.825094][ T1] init: LoadWithAliases was unable to load gc05a2
[ 1.826118][ T1] init: Failed to load kernel modules
[ 1.827032][ T1] init: InitFatalReboot: signal 6
[ 1.836535][ T1] init: #00 pc 000000000031fe7c /init
(unwindstack::AndroidLocalUnwinder::InternalUnwind(std::__1::optional<int>,
unwindstack::AndroidUnwinderData&)+92) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836603][ T1] init: #01 pc 000000000031444c /init
(android::init::InitFatalReboot(int)+204) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836638][ T1] init: #02 pc 0000000000314b00 /init
(android::init::InstallRebootSignalHandlers()::$_0::__invoke(int)+32) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836658][ T1] init: #03 pc 0000000000000860 [vdso]
[ 1.836685][ T1] init: #04 pc 00000000004ddfb0 /init (abort+176)
(BuildId: aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836719][ T1] init: #05 pc 0000000000319dac /init
(android::init::InitAborter(char const*)+44) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836760][ T1] init: #06 pc 000000000049eed0 /init
(android::base::SetAborter(std::__1::function<void (char
const*)>&&)::$_0::__invoke(char const*)+80) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836793][ T1] init: #07 pc 000000000049e664 /init
(android::base::LogMessage::~LogMessage()+356) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836824][ T1] init: #08 pc 000000000030adc8 /init
(android::init::FirstStageMain(int, char**)+8696) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836870][ T1] init: #09 pc 00000000004dbd9c /init
(__real_libc_init(void*, void (*)(), int (*)(int, char**, char**),
structors_array_t const*, bionic_tcb*)+716) (BuildId:
aec5ebfd90cec4000c74ac83c809ae14)
[ 1.836887][ T1] init: Reboot ending, jumping to kernel
```

Exec format error для gc05a2.ko указывает на несовпадение среды сборки, обычно pahole. Проверьте pahole --version: v1.25. Источник предлагает сборку ниже; удаление установленного dwarves меняет хост. Clone «последней» версии не закреплён, поэтому проверьте требование1.25. При неудаче китайский источник даёт https://pan.baidu.com/s/1JP1F0EjzSn25ZVUsbO89Zg (код zy6z) для замены /usr/local/bin/pahole; историческая непроверенная загрузка, не рекомендация проверенного бинарника.

```sh
pahole --version
git clone https://git.kernel.org/pub/scm/devel/pahole/pahole.git
sudo apt-get install cmake
sudo apt-get install libdw-dev
sudo apt-get --purge remove dwarves
# Run the following in the cloned pahole directory
mkdir build
cd build/
cmake -D__LIB=lib -DBUILD_SHARED_LIBS=OFF ..
sudo make install
pahole --version
```

## 8.5 Ошибка разбора bootcmdline

```text
Failed to parse bootconfig: Value is redefined at 416.
```

Повтор поля cmdline не позволяет загрузиться либо ведёт в recovery. Удерживайте Ctrl+P в последовательной консоли U-Boot для вывода cmdline; найдите повтор и удалите лишнее определение в device/kernel DTS.

## 8.6 Ошибка Mali KO

Несовместимый GPU KO оставляет экран на «Rockchip kernel» и вызывает сбой surfaceflinger в logcat. Ниже сохранён образец; строка lr/sp уже повреждена/обрезана в обоих PDF и не восстановлена догадкой. Пересоберите GPU KO и скопируйте в соответствующий vendor/rockchip/common/gpu. В PRODUCT_KERNEL_CONFIG каталога device добавьте конфигурацию GPU чипа.

```text
04-27 22:45:27.653 366 366 F DEBUG : *** *** *** *** *** *** *** *** ***
*** *** *** *** *** *** ***
04-27 22:45:27.653 366 366 F DEBUG : Build fingerprint:
'rockchip/rk3562_t/rk3562_t:13/TQ2A.230305.008.F1/eng.wlq.20230427.101925:userdebug/release-keys'
04-27 22:45:27.653 366 366 F DEBUG : Revision: '0'
04-27 22:45:27.653 366 366 F DEBUG : ABI: 'arm64'
04-27 22:45:27.653 366 366 F DEBUG : Timestamp: 2023-04-27
22:45:27.509738048+0000
04-27 22:45:27.653 366 366 F DEBUG : Process uptime: 2s
04-27 22:45:27.653 366 366 F DEBUG : Cmdline: /system/bin/surfaceflinger
04-27 22:45:27.653 366 366 F DEBUG : pid: 335, tid: 360, name:
surfaceflinger >>> /system/bin/surfaceflinger <<<
04-27 22:45:27.653 366 366 F DEBUG : uid: 1000
04-27 22:45:27.653 366 366 F DEBUG : tagged_addr_ctrl: 0000000000000001
(PR_TAGGED_ADDR_ENABLE)
04-27 22:45:27.653 366 366 F DEBUG : signal 6 (SIGABRT), code -1
(SI_QUEUE), fault addr --------
04-27 22:45:27.653 366 366 F DEBUG : Abort message: 'no suitable EGLConfig
found, giving up'
04-27 22:45:27.653 366 366 F DEBUG : x0 0000000000000000 x1
0000000000000168 x2 0000000000000006 x3 000000710899d340
04-27 22:45:27.654 366 366 F DEBUG : x4 7568661f2b636d74 x5
7568661f2b636d74 x6 7568661f2b636d74 x7 7f7f7f7f7f7f7f7f
04-27 22:45:27.654 366 366 F DEBUG : x8 00000000000000f0 x9
000000739bcbda00 x10 0000000000000001 x11 000000739bcff6a0
04-27 22:45:27.654 366 366 F DEBUG : x12 000000710899d310 x13
0000000000000027 x14 000000710899d4e0 x15 00000000197b1a4f
04-27 22:45:27.654 366 366 F DEBUG : x16 000000739bd6dd58 x17
000000739bd48770 x18 0000007108812000 x19 00000000000000ac
04-27 22:45:27.654 366 366 F DEBUG : x20 00000000000000b2 x21
000000000000014f x22 0000000000000168 x23 00000000ffffffff
04-27 22:45:27.654 366 366 F DEBUG : x24 b4000071bbca60b0 x25
000000710899dcb0 x26 000000710899dff8 x27 00000000000fe000
04-27 22:45:27.654 366 366 F DEBUG : x28 000000710899daf0 x29
000000710899d3c0
04-27 22:45:27.654 366 366 F DEBUG : lr 000000739bcef3f4 sp
00000071089ndroid.runtime/lib64/bionic/libc.so (__pthread_start(void*)+208)
(BuildId: e2429c64ab29f2d0ffc5a8f42c0c1b80)
04-27 22:45:27.655 366 366 F DEBUG : #09 pc 0000000000054c50
/apex/com.android.runtime/lib64/bionic/libc.so (__start_thread+64) (BuildId:
e2429c64ab29f2d0ffc5a8f42c0c1b80)
```

| Чип | PRODUCT_KERNEL_CONFIG |
| --- | --- |
| RK3588 | gki_defconfig rockchip_gki.config |
| RK356X/RK3562 | gki_defconfig rockchip_gki.config rk356x.config |
| RK3326/RK3326-S; PX30/PX30-S | gki_defconfig rockchip_gki.config rk3326.config |
| RK3399 | gki_defconfig rockchip_gki.config rk3399.config |

Для RK3399 измените rk3399.config ниже, выполните ./build.sh -CK и скопируйте Mali KO в vendor, как указано выше.

```diff
wlq@sys2_206:~/a0_Android13_gki/mkcombinedroot$ git diff configs/
diff --git a/configs/rk3399.config b/configs/rk3399.config
old mode 100644
new mode 100755
index 0d66674..a003ba5
--- a/configs/rk3399.config
+++ b/configs/rk3399.config
@@ -1,4 +1,11 @@
-CONFIG_MALI_MIDGARD=y
+CONFIG_MALI_MIDGARD=m
+CONFIG_MALI_PLATFORM_THIRDPARTY_NAME="rk"
+CONFIG_MALI_PLATFORM_THIRDPARTY=y
+CONFIG_MALI_DEBUG=y
+CONFIG_MALI_DEVFREQ=y
+CONFIG_MALI_DT=y
+CONFIG_MALI_EXPERT=y
+CONFIG_MALI_SHARED_INTERRUPTS=y
```

## 8.7 Ошибка сборки ядра

```text
BTF .btf.vmlinux.bin.o
Segmentation fault (core dumped)
LD .tmp_vmlinux.kallsyms1
KSYMS .tmp_vmlinux.kallsyms1.S
AS .tmp_vmlinux.kallsyms1.S
LD .tmp_vmlinux.kallsyms2
KSYMS .tmp_vmlinux.kallsyms2.S
AS .tmp_vmlinux.kallsyms2.S
LD vmlinux
BTFIDS vmlinux
FAILED: load BTF from vmlinux: Unknown error -22Makefile:1293: recipe for target
'vmlinux' failed
make[1]: *** [vmlinux] Error 255
arch/arm64/Makefile:214: recipe for target 'rk3588-evb1-lp4-v10.img' failed
make: *** [rk3588-evb1-lp4-v10.img] Error 2
failed to build some targets (21 seconds)
```

При BTF segmentation fault / -22 источник повторяет установку pahole из §8.4: clone, cmake/libdw-dev, удаление dwarves, build/, статическая настройка -DBUILD_SHARED_LIBS=OFF, sudo make install и проверка версии. Китайский повторяет резервную загрузку/код из §8.4; английский её опускает и добавляет §9 Ubuntu20.04+/pahole1.25.

## 9.1 Дополнительные журналы модулей

Ослабьте ограничение частоты init-логов для скрытых ошибок KO; источник добавляет printk.devkmsg=on в device/rockchip/common/BoardConfig.mk.

```diff
xxx@sys2_206:~/a0_Android13_gki/device/rockchip/common$ vim BoardConfig.mk
xxx@sys2_206:~/a0_Android13_gki/device/rockchip/common$ git diff
diff --git a/BoardConfig.mk b/BoardConfig.mk
index 0d1c886..1761ed0 100755
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -392,3 +392,5 @@ ifeq ($(strip $(BOARD_BASEPARAMETER_SUPPORT)), true)
endif
BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
endif
+
+BOARD_KERNEL_CMDLINE += printk.devkmsg=on
```

## 9.2 Упаковка отладочного boot.img

Соберите ядро обычным способом в arch/arm64/boot/Image и упакуйте с header4:

```sh
mkbootimg --kernel arch/arm64/boot/Image --header_version 4 --output ../mkcombinedroot/prebuilts/boot-6.1.img
```

## 9.3 Опубликованные интерфейсы ядра

Стандартные определения интерфейсов находятся в upstream common/android:

```text
:~/a5_google_kenrel/common$ tree a
android/ arch/
wlq@sys2_206:~/a5_google_kenrel/common$ tree android/
android/
├── abi_gki_aarch64
├── abi_gki_aarch64_core
├── abi_gki_aarch64_db845c
├── abi_gki_aarch64_exynos
├── abi_gki_aarch64_fips140
├── abi_gki_aarch64_galaxy
├── abi_gki_aarch64_generic
├── abi_gki_aarch64_hikey960
├── abi_gki_aarch64_rockchip
├── abi_gki_aarch64_type_visibility
├── abi_gki_aarch64_virtual_device
├── abi_gki_aarch64.xml
├── abi_gki_modules_exports
├── abi_gki_modules_protected
├── gki_aarch64_fips140_modules
├── gki_aarch64_modules
└── gki_system_dlkm_modules
```

## 10 Подача интерфейсов upstream

Создайте патч нового интерфейса, подайте через Rockchip Redmine на проверку; затем Rockchip централизованно передаст Google. Пример для r8168.ko:

```diff
diff --git a/android/abi_gki_aarch64_rockchip b/android/abi_gki_aarch64_rockchip
index 85bd8bc134cf..3344cf064e06 100644
--- a/android/abi_gki_aarch64_rockchip
+++ b/android/abi_gki_aarch64_rockchip
@@ -2144,6 +2144,15 @@
mmc_pwrseq_register
mmc_pwrseq_unregister
+# required by r8168.ko
+ pci_set_mwi
+ pci_clear_mwi
+ proc_get_parent_data
+ skb_checksum_help
+ __skb_gso_segment
+ remove_proc_subtree
+ pci_choose_state
+
# required by reboot-mode.ko
devres_release
kernel_kobj
```

## 11 Обновление AOSP boot и защищённых модулей

AOSP публикует boot.img и совместимые защищённые KO. На https://source.android.com/docs/core/architecture/kernel/gki-android14-6_1-release-builds выберите нужный выпуск Android14-6.1, загрузите boot-6.1.img в mkcombinedroot/prebuilts/boot-6.1.img. Начиная с Android14 вместе загрузите защищённые модули: они должны соответствовать boot.img. Ссылка kernel даёт system_dlkm_staging_archive.tar.gz; распакуйте и скопируйте KO из flatten/lib/modules/ в kernel/prebuilts/6.1/arm64/. Не обновляйте там modules.load: замена может нарушить загрузку. После копирования проверьте, что он не перезаписан.

![Загрузка AOSP boot](/docs/rockchip-android14-gki/images/aosp-boot-en.png)

Загрузка AOSP boot - Оригинальная иллюстрация;страница PDF 19 (EN).

![Совместимые защищённые модули](/docs/rockchip-android14-gki/images/aosp-modules-en.png)

Совместимые защищённые модули - Оригинальная иллюстрация;страница PDF 19 (EN).

## 12.1 Отдельный vendor_boot: сборка KO

Пять шагов: собрать KO → скопировать KO → получить совместимый базовый vendor_boot.img → упаковать mkgki4.sh → прошить/проверить. Для Android14/kernel6.1:

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 gki_defconfig rockchip_gki.config && make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1 ARCH=arm64 rk3562-rk817-tablet-v10.img -j32
```

## 12.2 Копирование KO без отладки

```sh
llvm-objcopy --strip-debug drivers/xxx.ko ../mkcombinedroot/vendor_ramdisk/lib/modules/xxx.ko
```

## 12.3 Копирование базового образа

Скопируйте базовый vendor_boot.img в mkcombinedroot, аналогично boot_sample.img при отдельном boot.img. Он должен совпадать с текущим образом целевого устройства; возьмите из соответствующей GKI-прошивки.

## 12.4 Переупаковка

DTS — имя DTS платы с load-именем из res/board/. Источник переключается с RK3562 на RK3568; выбирайте соответствующую плату, не смешивайте. Результат:mkcombinedroot/new_vendor_boot.img.

```sh
cd ../mkcombinedroot/
./mkgki4.sh DTS=rk3568-evb1-ddr4-v10
```

## 12.5 Прошивка и проверка

Прошейте new_vendor_boot.img и проверьте запуск. GKI обычно A/B: обновите vendor_boot_a и vendor_boot_b. Если аварийные перезагрузки уже привели к fastboot, источник требует также misc.img для очистки флагов. Операции меняют состояние устройства; нужны совместимые образы и резервная копия. Ниже исходный путь new_vendor_boot.img/vendor_boot.img противоречит отдельному файлу выше: это сохранённая ошибка, не готовый путь запуска. Проверьте файл. Vendor-KO можно push/монтировать после загрузки; DTS требует также kernel-6.1/resource.img.

```sh
sudo ./upgrade_tool di -vendor_boot_a mkcombinedroot/new_vendor_boot.img/vendor_boot.img
sudo ./upgrade_tool di -vendor_boot_b mkcombinedroot/new_vendor_boot.img/vendor_boot.img;
sudo ./upgrade_tool rd
```

{% endraw %}
