---
title: "Rockchip Android14 SDK: исходники, сборка, прошивка и настройка"
description: "Rockchip Android14 SDK: исходники, сборка, прошивка и настройка"
excerpt: "Rockchip Android14 SDK: исходники, сборка, прошивка и настройка"
translation_key: "245-rockchip-android14-sdk"
slug: "245-rockchip-android14-sdk"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 SDK: исходники, сборка, прошивка и настройка

Источники: Rockchip Android14.0 SDK, китайский RK-KF-YF-776 (58 страниц) и английский RK-KF-YF-777 (63), оба V1.4.0. Основой служит китайский технический текст; английские дополнения/расхождения отмечены рядом. Заявления о поддержке относятся к платформам Rockchip, не испытаниям ArmSoM. Команды сохранены как примеры и не выполнялись. Прошивка, разделы, fuse и публикация кода требуют проверки цели, резервных копий и разрешения. Исторические ссылки и «последние версии» не проверены на текущую доступность.

## Поддерживаемые чипы

| Чип | Поддержка | Выпуск SDK |
| --- | --- | --- |
| RK3562 | Да | RKR1 |
| RK3568 | Да | RKR2 |
| RK3566 | Да | RKR2 |
| RK3326 | Да | RKR2 |
| PX30 | Да | RKR3 |
| RK3326-S | Да | RKR3 |
| PX30-S | Да | RKR3 |
| RK3588 | Да | RKR4 |
| RK3588S | Да | RKR4 |
| RK3399 | Да | RKR5 |

Обе таблицы относят RK3326 к RKR2, но техническая история выпуска — RK3326/RK3326-S/PX30/PX30-S к RKR3; расхождение сохранено. RKR1 добавил RK3562, RKR2 RK3566/RK3568, RKR4 RK3588/RK3588S, RKR5 RK3399.

## Загрузка исходников SDK

Инициализируйте обычный manifest либо Express при соответствующих правах; для зеркала добавьте --mirror. repo — Python-обёртка Google над Git для Android. Технический контакт Rockchip может дать начальный многотомный архив; распакуйте, синхронизируйте локально, затем текущую ветвь удалённо.

```sh
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m Android14.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m Android14_Express.xml
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m Android14.xml --mirror
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m Android14_Express.xml --mirror
```

```sh
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
mkdir Rockchip_Android14.0_SDK_RELEASE
cat Rockchip_Android14.0_SDK_RELEASE.tar.gz* | tar -zx -C Rockchip_Android14.0_SDK_RELEASE
cd Rockchip_Android14.0_SDK_RELEASE
.repo/repo/repo sync -l
.repo/repo/repo sync -c
```

## Свой repo-сервер: среда и Gitolite

Установите openssh-server, git и keychain. Пример сервера:10.10.10.206. Создайте отдельную учётную запись git и войдите в неё. Источник требует пустой/отсутствующий ~/.ssh/authorized_keys; не удаляйте ключи существующей записи, используйте новую выделенную запись и проверьте доступ. Скопируйте публичный ключ администратора в ~/YourName.pub, клонируйте Gitolite, создайте ~/bin, установите и настройте администратора. Способ установки зависит от версии; смотрите её документацию.

```sh
sudo apt-get install openssh-server git keychain
sudo adduser --system --shell /bin/bash --group git
sudo passwd git
# Log in as git; copy the administrator public key to ~/YourName.pub
git clone https://github.com/sitaramc/gitolite.git
mkdir -p ~/bin
gitolite/install -to ~/bin
~/bin/gitolite setup -pk YourName.pub
```

На клиенте клонируйте gitolite-admin, поместите публичные ключи пользователей в keydir и задайте группу администраторов с RW+ на gitolite-admin в conf/gitolite.conf.

```sh
git clone ssh://git@10.10.10.206/gitolite-admin.git
cp username.pub keydir/username.pub
vi conf/gitolite.conf
```

```text
@admin = admin1 admin2 admin3
repo gitolite-admin
    RW+ = @admin
```

## Создание зеркала

Сервер: войдите как git, загрузите repo в рабочем корне, создайте RK_Android14_mirror, инициализируйте зеркало и группы прав. Клиент: скопируйте android_u.conf в gitolite-admin/conf/, добавьте права, include в gitolite.conf и свой manifest-репозиторий. Китайский использует @android_u/android_u.conf, английский sed — @android_t, а копирование — android_r.conf. Это расхождения, не взаимозаменяемые имена.

```sh
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
mkdir RK_Android14_mirror
cd RK_Android14_mirror
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo -u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m Android14.xml --mirror
.repo/repo/repo list -n > android_u.conf
sed -i 's/^/@android_u = RK_Android14_mirror\/&/g' android_u.conf
```

```text
# conf/android_u.conf
@usergroup = user1 user2 user3
repo @android_u
    R = @usergroup
    RW+ = @admin

# conf/gitolite.conf
include "android_u.conf"

# additional source example in conf/android_u.conf
@android_u = Android_T/manifests_xxx
```

## Публикация своего manifest

Клонируйте новый и исходный manifest на клиенте, скопируйте файлы в manifests_xxx, проверьте git status, выполните локальный commit/push master. Создайте Android14 и инициализируйте repo своим адресом для коллег. Источник смешивает Android_T/Android_u/Android_U; пути копирования после cd manifests_xxx нужно проверить. Сохраните include/ и другие подкаталоги: *.xml сам их не копирует. Это исходные примеры, здесь не выполнявшиеся.

```sh
git clone ssh://git@10.10.10.206/Android_u/manifests_xxx.git
git clone ssh://git@10.10.10.206/Android_U/manifests.git
cd manifests_xxx
cp -rf manifests/*.xml manifests_xxx/
git status
```

```text
Android14.xml
Android14_Express.xml
default.xml
include/rk3562_repository.xml
include/rk_checkout_from_aosp.xml
include/rk_modules_repository.xml
remote.xml
remove_u.xml
remove_unused.xml
```

```sh
git add -A
git commit -m "init xxx"
git push origin master:master
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
mkdir Android14
cd Android14
~/repo/repo init -u ssh://git@10.10.10.206/Android_U/manifests_xxx.git -m Android14.xml
```

## Собственные ветви и изменения

Большинство репозиториев остаются на ветвях RK. В нужном каталоге (kernel-6.1) создайте xxx_branch от remotes/m/master и отправьте в rk29 (имя remote дополняется Tab). Найдите kernel в .repo/manifests и замените revision проекта на xxx_branch. Commit/push manifest позволит коллегам синхронизировать вашу ветвь; изменения продукта коммитьте/отправляйте в xxx_branch. Путь kernel и тег android-1s.0 в diff сохранены как исходные исторические литералы.

```sh
cd kernel-6.1
git checkout remotes/m/master -b xxx_branch
git push rk29 xxx_branch:xxx_branch
cd .repo/manifests
```

```diff
--- a/include/rk_modules_repository.xml
+++ b/include/rk_modules_repository.xml
@@ -10,7 +10,7 @@
<project path="hardware/rockchip/libgraphicpolicy"
name="rk/hardware/rk29/libgraphicpolicy" remote="rk"
revision="refs/tags/android-1s.0-mid-rkr1" />
<project path="hardware/rockchip/libhwjpeg" name="rk/hardware/rk29/libhwjpeg"
remote="rk" revision="refs/tags/android-14.0-mid-rkr1"/>
<project path="u-boot" name="rk/u-boot" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
- <project path="kernel" name="rk/kernel" remote="rk29"
revision="refs/tags/android-14.0-mid-rkr1"/>
+ <project path="kernel" name="rk/kernel" remote="rk29" revision="xxx_branch"/>
<project path="bootable/recovery/rkupdate"
name="platform/bootable/recovery/rk_update" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
<project path="bootable/recovery/rkutility"
name="platform/bootable/recovery/rk_utility" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
```

```sh
git add include/rk_modules_repository.xml
git commit -m "change kernel branch on xxx_branch"
git push origin default:master
```

## Синхронизация обновлений RK

Сначала sync зеркала на сервере. На клиенте сравните исходные manifests RK с manifests_xxx, объедините теги и добавления/удаления репозиториев, проверьте/push и определите свои ветви. В каждом репозитории проверьте remote, создайте локальную ветвь, изучите теги, merge нужного выпуска, устраните конфликты и push в продуктовую ветвь. Повторите для всех. Пример содержит Android10/11 и называет android-14.0-mid-rkr1 «последним» тогда; область RKR5 остаётся. Checkout remotes/m/xxx_branch отличается от показанного remotes/m/master: проверьте refs. Исходники Kernel6.1 находятся в kernel-6.1/.

```sh
cd RK_Android14_mirror
.repo/repo/repo sync -c
git clone //10.10.10.206/wlq/test/manifests.git
```

```text
wlq@wlq:~/home1/test2/kernel-6.1$ git branch -av
* android-11.0-mid-rkr7 0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
xxx_branch 0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
remotes/m/master -> rk29/xxx_branch
remotes/rk29/xxx_branch 0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
```

```sh
git checkout remotes/m/xxx_branch -b local_xxx_branch
```

```text
wlq@wlq:~/home1/test2/kernel$ git tag | grep rkr
android-10.0-mid-rkr1
android-10.0-mid-rkr10
android-10.0-mid-rkr11
android-10.0-mid-rkr13
android-10.0-mid-rkr2
android-10.0-mid-rkr3
android-10.0-mid-rkr4
android-10.0-mid-rkr5
android-10.0-mid-rkr6
android-10.0-mid-rkr7
android-10.0-mid-rkr8
android-10.0-mid-rkr9
android-11.0-ebook-rkr1
android-11.0-ebook-rkr2
android-11.0-ebook-rkr3
android-11.0-ebook-rkr4
android-11.0-ebook-rkr5
android-11.0-ebook-rkr6
android-11.0-mid-rkr1
android-11.0-mid-rkr2
android-11.0-mid-rkr3
android-11.0-mid-rkr4
android-11.0-mid-rkr4.1
android-11.0-mid-rkr5
android-11.0-mid-rkr6
android-11.0-mid-rkr7
android-11.0-mid-rkr7-prev
android-11.0-mid-rkr8
android-14.0-mid-rkr1
```

```sh
git merge android-14.0-mid-rkr1
# Resolve any conflicts before pushing
git push rk29 local_xxx_branch:xxx_branch
```

## Цели lunch

Все цели — Android14, GKI по умолчанию, только64-bit. user для производства, userdebug для разработки/отладки, кроме отмеченных противоречий. GO/2GB и аппаратные примечания сохранены по строкам, не выведены из имени.

| Цель | Чип | Оборудование/настройка | Назначение |
| --- | --- | --- | --- |
| rk3588_u-user | RK3588 | Отладочная плата | Производство/user |
| rk3588_u-userdebug | RK3588 | Отладочная плата | Разработка/userdebug |
| rk3588s_u-user | RK3588S | Отладочная плата | Производство/user |
| rk3588s_u-userdebug | RK3588S | Отладочная плата | Разработка/userdebug |
| rk3562_u-user | RK3562 | Отладочная плата | Производство/user |
| rk3562_u-userdebug | RK3562 | Отладочная плата | Разработка/userdebug |
| rk3562_ugo-user | RK3562 | 2GB, GO включён | Производство/user |
| rk3562_ugo-userdebug | RK3562 | 2GB, GO включён | Разработка/userdebug |
| rk3566_ugo-user | RK3566 | 2GB, GO включён | Производство/user |
| rk3566_ugo-userdebug | RK3566 | 2GB, GO включён | Разработка/userdebug |
| rk3566_u-user | RK3566 | Отладочная плата | Производство/user |
| rk3566_u-userdebug | RK3566 | Отладочная плата | Разработка/userdebug |
| rk3568_u-user | RK3568 | Отладочная плата | Производство/user |
| rk3568_u-userdebug | RK3568 | Отладочная плата | Разработка/userdebug |
| rk3326_ugo-userdebug | RK3326/RK3326-S | Отладочная плата | Разработка/userdebug |
| rk3326_ugo-user | RK3326/RK3326-S | 2GB, GO включён | Производство/user |
| rk3326_u-userdebug | RK3326/RK3326-S | Отладочная плата | Разработка/userdebug |
| rk3326_u-user | RK3326/RK3326-S | Плата; CN указывает GO | Производство/user |
| PX30_u-userdebug | PX30/PX30-S | Отладочная плата | CN:user/производство; EN:userdebug/разработка |
| PX30_u-user | PX30/PX30-S | Отладочная плата | Производство/user |
| rk3399_u-userdebug | RK3399 | CN:промышленная плата/экскаватор; EN:отладочная плата | CN:user/производство; EN:userdebug/разработка |
| rk3399_u-user | RK3399 | CN:промышленная плата/экскаватор; EN:отладочная плата | Производство/user |

Для rk3326_ugo-userdebug EN добавляет2GB/GO, CN описывает лишь EVB; для rk3326_u-user EN опускает GO из CN. Аппаратный текст EN пишет X30, столбец чипа — PX30. Расхождения не скрыты.

## Сборка одной командой

Перед сборкой задайте среду/платформу. CN:rk3588_u-userdebug; EN:старый rk3588_t-userdebug, отмеченное расхождение.

```sh
source build/envsetup.sh
lunch rk3588_u-userdebug
./build.sh -UKAup
```

| Опция | Значение |
| --- | --- |
| -U | Сборка U-Boot |
| -C | Ядро с Clang |
| -K | Сборка ядра |
| -A | Сборка Android |
| -p | Упаковка IMAGE |
| -o | Пакет OTA |
| -u | Сборка update.img |
| -v | Вариант Android user/userdebug |
| -d | Имя DTS ядра |
| -V | Версия сборки |
| -J | Параллельные задачи |

## Команды по платформам

В исходной таблице перед Android-целью стоит build/envsetup.sh;lunch (выше среда задаётся через source). Обычно полный/ядро/U-Boot:./build.sh -AUCKu, ./build.sh -K, ./build.sh -U. RK3399 U-Boot:./make.sh rk3399. EN добавляет отсутствующие в CN строки RK3588/RK3588S.

| Чип | Тип | Образец | Lunch | Полная сборка | Ядро | U-Boot |
| --- | --- | --- | --- | --- | --- | --- |
| RK3588 | EVB (добавлено EN) | rk3588-evb1-lp4-v10 | rk3588_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3588S | Планшет (EN) | Планшет | rk3588s_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3562 | Отладочная плата | rk3562-evb1-lp4x-v10 | rk3562_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3562 | Планшет | Прототип | rk3562_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3566 | Планшет | Прототип | rk3566_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3566 | Отладочная плата | EVB2-LP4X-V10 | rk3566_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3568 | Отладочная плата | EVB1-DDR4-V10 | rk3568_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3326/RK3326-S | Отладочная плата | EVB-V12 | rk3326_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3326/RK3326-S | Прототип | Планшет | rk3326_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| PX30/PX30-S | Отладочная плата | MINI EVB | PX30_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3399 | Промышленная EVB | rk3399-evb-ind-lpddr4-v13-android-avb | rk3399_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./make.sh rk3399 |
| RK3399 | Экскаватор | rk3399-sapphire-excavator-edp-avb | rk3399_u-userdebug | ./build.sh -AUCKu -d rk3399-sapphire-excavator-edp-avb | ./build.sh -K -d rk3399-sapphire-excavator-edp-avb | ./make.sh rk3399 |

## Сборки GKI и non-GKI

CN указывает GKI/A/B по умолчанию для RK3566/RK3568/RK3562; EN в абзаце лишь RK3562, хотя lunch-таблица шире. BOARD_BUILD_GKI=false отключает GKI и автоматически A/B. Процедуры GKI/KO:RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf.

```diff
wlq@sys2206:~/b0_A14_bringup/device/rockchip/rk3562$ git diff
diff --git a/rk3562_u/BoardConfig.mk b/rk3562_u/BoardConfig.mk
index dc9cc50..a6657dd 100644
--- a/rk3562_u/BoardConfig.mk
+++ b/rk3562_u/BoardConfig.mk
@@ -16,7 +16,7 @@
BUILD_WITH_GO_OPT := true
PRODUCT_KERNEL_DTS := rk3562-rk817-tablet-v10
CAMERA_SUPPORT_AUTOFOCUS := true
-BOARD_BUILD_GKI := true
+BOARD_BUILD_GKI := false
include device/rockchip/rk3562/BoardConfig.mk
DEVICE_IS_64BIT_ONLY := true
```

Только non-GKI:kernel.img/resource.img внутри boot.img, отдельно не прошиваются. ./build.sh -AK пересобирает ядро/Android; прошейте rockdev boot.img, но это медленно. Отдельная сборка заменяет kernel/resource в старом совместимом boot.img. Текст RK3562 указывает Image-rk3562_u, команда Image-rk3562_t:проверьте базовый образ/DTS. Импортируйте parameter.txt и прошейте kernel-6.1/boot.img в boot, избегая неверного смещения.

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig android-14.config rk356x.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3562_t/boot.img rk3562-evb1-lp4x-v10.img -j32
```

## Инструменты прошивки и файлы

![Интерфейс инструмента прошивки](/docs/rockchip-android14-sdk/images/flash-tool-en.png)

Интерфейс инструмента прошивки - Оригинальная иллюстрация;страница PDF 18 (EN).

Android14 требует DriverAssitant V5.1.1. Источник перечисляет Windows AndroidTool_Release_v3.28 и Linux_Upgrade_Tool_v2.30, рекомендуя синхронизацию инструментов; актуальность версий не проверена. Полная сборка даёт первое дерево; прошейте набор второго дерева либо полный update.img.

```text
RKTools/windows/AndroidTool/AndroidTool_Release_v3.28
RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30
```

```text
rockdev/Image-rk3562_u/
├── boot-debug.img
├── boot.img
├── config.cfg
├── dtbo.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── pcba_small_misc.img
├── pcba_whole_misc.img
├── recovery.img
├── resource.img
├── super.img
├── uboot.img
├── update.img
└── vbmeta.img
```

```text
rockdev/Image-rk3562_u/
├── boot.img
├── dtbo.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── recovery.img
├── super.img
├── uboot.img
└── vbmeta.img
```

| Файл | Назначение |
| --- | --- |
| boot.img | ramdisk, ядро, DTB |
| boot-debug.img | Root-операции на user-прошивке |
| dtbo.img | Device Tree Overlays; раздел DTBO |
| config.cfg | Импорт настроек выбора в flashtool |
| MiniLoaderAll.bin | Загрузчик первого этапа |
| misc.img | Флаги recovery-wipe; после прошивки recovery |
| parameter.txt | Информация разделов |
| pcba_small_misc.img | Флаги PCBA; упрощённый режим |
| pcba_whole_misc.img | Флаги PCBA; полный режим |
| recovery.img | recovery ramdisk, ядро, DTB |
| super.img | CN:odm/product/vendor/system/system_ext; EN лишь odm/vendor/system |
| trust.img | BL31/BL32; RK3566/RK3568 не создают/не прошивают |
| uboot.img | Прошивка U-Boot |
| vbmeta.img | Метаданные проверки AVB |
| update.img | Полный пакет нужных образов |

Источник требует GKI для Android14 GMS/EDLA; см.RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf. Историческое утверждение о сертификации.

## Динамические разделы, fastbootd и GSI

Новые устройства поколения R используют динамические разделы вместо отдельных физических system/vendor/odm/product/system_ext; прошивайте super.img. Для отдельных логических образов из out/ используйте fastbootd и достаточно новые adb/fastboot. SDK:RKTools/linux/Linux_adb_fastboot (Linux_x86), RKTools/windows/adb_fastboot (Windows_x86). fastbootd показывает устройство; для нединамических разделов нужен bootloader.

```sh
adb reboot fastboot
fastboot flash vendor vendor.img
fastboot flash system system.img
fastboot flash odm odm.img

# Non-dynamic partitions
adb reboot bootloader
```

![Экран fastbootd](/docs/rockchip-android14-sdk/images/fastbootd-en.png)

Экран fastbootd - Оригинальная иллюстрация;страница PDF 20 (EN).

GSI:при необходимости разблокируйте, войдите fastbootd, прошейте GSI system.img и misc.img прошивки; recovery выполнит сброс. Разблокировка, misc и удаление product могут уничтожить данные:резервная копия/проверка цели обязательны. При записанном AVB-ключе следуйте отдельной инструкции разблокировки. При недостатке места источник допускает удаление логического product до GSI.

```sh
adb reboot bootloader
fastboot oem at-unlock-vboot
fastboot flash misc misc.img
fastboot reboot fastboot
# Optional; deletes the logical product partition
fastboot delete-logical-partition product
fastboot flash system system.img
fastboot reboot
```

DSU (Dynamic System Updates) — другой способ GSI, включённый по умолчанию на описанной платформе. Потребляет много памяти; не рекомендован при DDR≤1GB. Ссылка:https://source.android.com/devices/tech/ota/dynamic-system-updates. VTS требует boot-debug.img в boot; CTS-ON-GSI — нет. Для тестов используйте официальный Google GSI с окончанием -signed.

## DTBO

Android10+ поддерживает Device Tree Overlays; dtbo.img обеспечивает совместимость продуктов. Найдите/задайте PRODUCT_DTBO_TEMPLATE, измените узлы. В DTS нужны aliases, иначе overlay не сработает. Путь источника пишет rk388; CN rk3588_u, EN rk3588_t. Расхождения сохранены; выбирайте свой шаблон.

```text
get_build_var PRODUCT_DTBO_TEMPLATE
# Source example
PRODUCT_DTBO_TEMPLATE := $(LOCAL_PATH)/dt-overlay.in
# CN illustrative path: device/rockchip/rk388/rk3588_u/dt-overlay.in
```

```dts
/dts-v1/;
/plugin/;
&chosen {
bootargs_ext = "androidboot.boot_devices=${_boot_device}";
};
&firmware_android {
vbmeta {
status = "disabled";
};
fstab {
status = "disabled";
};
};
&reboot_mode {
mode-bootloader = <0x5242C309>;
mode-charge = <0x5242C30B>;
mode-fastboot = <0x5242C303>;
mode-loader = <0x5242C301>;
mode-normal = <0x5242C300>;
mode-recovery = <0x5242C303>;
};
```

## fstab и параметры разделов

Найдите/задайте PRODUCT_FSTAB_TEMPLATE и измените монтирование, swap_zram или ФС data. Android14 генерирует parameter.txt из шаблона/настроек; без шаблона ищет предоставленный parameter.txt. Для обхода генератора положите файл в device продукта, например device/rockchip/rk3326/rk3326_u/parameter.txt.

```text
get_build_var PRODUCT_FSTAB_TEMPLATE
PRODUCT_FSTAB_TEMPLATE := device/rockchip/common/scripts/fstab_tools/fstab.in
get_build_var PRODUCT_PARAMETER_TEMPLATE
PRODUCT_PARAMETER_TEMPLATE := device/rockchip/common/scripts/parameter_tools/parameter.in
BOARD_SUPER_PARTITION_SIZE := 2688548864
BOARD_DTBOIMG_PARTITION_SIZE := xxxx
BOARD_BOOTIMAGE_PARTITION_SIZE := xxxxx
BOARD_CACHEIMAGE_PARTITION_SIZE := xxxx
```

Ниже отдельная генерация parameter. Для OTA между основными версиями источник требует прежний parameter.txt. Размеры-заполнители выше замените проверенными значениями устройства.

```sh
parameter_tools --input device/rockchip/common/scripts/parameter_tools/parameter.in --firmware-version 14.0 --machine-model rk3326 --manufacturer rockchip --machine rk3326_u --partition-list uboot_a:4096K,trust_a:4M,misc:4M,dtbo_a:4M,vbmeta_a:4M,boot_a:33554432,backup:300M,security:4M,cache:300M,metadata:4096,frp:512K,super:2G --output parameter_new.txt
```

Для нового раздела задайте BOARD_WITH_SPECIAL_PARTITIONS в BoardConfig.mk продукта (например baseparameter:1M,logo:16M) и добавьте его в RebuildParameter.mk.

```diff
device/rockchip/rk356x/rk3566_u/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -494,4 +494,11 @@ ifeq ($(strip $(BOARD_TWRP_ENABLE)), true)
+BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
```

```diff
device/rockchip/common/build/rockchip/RebuildParameter.mk
+ifneq ($(strip $(BOARD_WITH_SPECIAL_PARTITIONS)), )
+partition_list := $(partition_list),$(BOARD_WITH_SPECIAL_PARTITIONS)
+endif
```

## Добавление цели lunch

Для rk3562_new_u добавьте makefile и user/userdebug в device/rockchip/rk3562/AndroidProducts.mk. Скопируйте rk3562_u в device/rockchip/rk3562/rk3562_new_u и замените все rk3562_u внутри нового каталога на rk3562_new_u.

```diff
--- a/AndroidProducts.mk
+++ b/AndroidProducts.mk
@@ -17,10 +17,14 @@
PRODUCT_MAKEFILES := \
$(LOCAL_DIR)/rk3562_u/rk3562_u.mk \
+ $(LOCAL_DIR)/rk3562_new_u/rk3562_new_u.mk \
COMMON_LUNCH_CHOICES := \
rk3562_u-userdebug \
rk3562_u-user \
+ rk3562_new_u-userdebug \
+ rk3562_new_u-user \
```

## DTS для продукта

Выбирайте DTS по чипу, PMIC и аппаратной схеме. Здесь есть RK3528, отсутствующий в таблице поддержки SDK; это не новое обещание поддержки. RK3588 single-PMIC:CN rk3588-evb7-v11, EN rk3588-evb4-lp7-v10; сохранены оба. Промышленный RK3399 DTS здесь без v13, в таблице сборки с v13:проверьте.

| SoC | PMIC | Тип | Модель | DTS |
| --- | --- | --- | --- | --- |
| RK3588 | Два PMIC:RK806 ×2 | Отладочная плата | RK3588 EVB1 | rk3588-evb1-lp4-v10 |
| RK3588 | Один PMIC:RK806+RK860 | Отладочная плата | Эталонная схема RK3588 | CN:rk3588-evb7-v11; EN:rk3588-evb4-lp7-v10 |
| RK3588S | Два PMIC:RK806 ×2 | Отладочная плата | RK3588S EVB1 | rk3588s-evb1-lp4x-v10 |
| RK3588S | Один PMIC:RK806+RK860 | Планшет | Эталонная схема планшета | rk3588s-tablet-v11 |
| RK3588S | Два PMIC:RK806 ×2 | Планшет | Прототип | rk3588s-tablet-v10 |
| RK3588 | Один PMIC:RK860 | Box EVB | RK3588_NVR_DEMO1_LP4X | rk3588-nvr-demo-v10-android |
| RK3566 | RK817 | Планшет | Прототип | rk3566-rk817-tablet |
| RK3566 | RK809 | Отладочная плата | RK3566 EVB2 | rk3566-evb2-lp4x-v10 |
| RK3566 | Дискретное питание | Отладочная плата | RK3566 BOX DEMO | rk3566-box-demo-v10 |
| RK3568 | RK809 | Отладочная плата | RK3568 EVB1 | rk3568-evb1-ddr4-v10 |
| RK3562 | RK817 | Отладочная плата | RK3562 EVB1 | rk3562-evb1-lp4x-v10 |
| RK3562 | RK809 | Отладочная плата | RK3562 EVB2 | rk3562-evb2-ddr4-v10 |
| RK3562 | RK817 | Планшет | Прототип | rk3562-rk817-tablet-v10 |
| RK3528 | Дискретное питание | BOX | RK3528 EVB1 | rk3528-evb1-ddr4-v10 |
| RK3326 | RK817 | Отладочная плата | EVB | rk3326-evb-lp3-v10-avb |
| PX30 | RK809 | Отладочная плата | EVB | px30-mini-evb-ddr3-v11-avb |
| RK3326 | RK817 | Планшет | Прототип | rk3326-863-lp3-v10-rkisp1 |
| RK3326 | RK809 | Голосовой ИИ | EVB | rk3326-evb-ai-va-v12 |
| RK3399 | RK808 | Отладочная плата | Экскаватор | rk3399-sapphire-excavator-edp-avb |
| RK3399 | RK809 | Отладочная плата | Промышленная плата | rk3399-evb-ind-lpddr4-android-avb |

## Уведомления о патчах

Важные патчи:https://redmine.rock-chips.com/projects/rockchip_patch/issues. Для подписки войдите зарегистрированным Rockchip Redmine-аккаунтом → My account → все уведомления выбранных проектов → проект выпуска патчей → Save. Письма придут на зарегистрированный адрес. Здесь подписка/изменение аккаунта не выполнялись.

![Открыть My account](/docs/rockchip-android14-sdk/images/redmine-account-en.png)

Открыть My account - Оригинальная иллюстрация;страница PDF 26 (EN).

![Выбор уведомлений](/docs/rockchip-android14-sdk/images/redmine-notifications-en.png)

Выбор уведомлений - Оригинальная иллюстрация;страница PDF 26 (EN).

![Выбрать проект патчей и сохранить](/docs/rockchip-android14-sdk/images/redmine-project-en.png)

Выбрать проект патчей и сохранить - Оригинальная иллюстрация;страница PDF 27 (EN).

## Документы и периферия

Источник даёт https://redmine.rockchip.com.cn/projects/fae/documents для обновляемых списков DDR/EMMC/NAND FLASH/WIFI/3G/CAMERA. Документы Camera IQ Tool и SDK RKNN Toolkit2 расположены ниже. Дерево RKDocs отражает комплект SDK; языковые суффиксы файлов — идентификаторы, не утверждение об их использовании в переводе статьи.

```text
external/camera_engine_rkaiq/rkisp2x_tuner/doc/
├── Rockchip_Color_Optimization_Guide_ISP2x_CN_v2.0.0.pdf
├── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.0.pdf
└── Rockchip_Tuning_Guide_ISP21_CN_v2.0.0.pdf
```

```text
hardware/rockchip/rknn-toolkit2/doc/
```

```text
RKDocs/
├── android
│ ├── Android11 异显开发说明.zip
│ ├── audio
│ │ └── Rockchip_Developer_Guide_Android_Multi_Audio_CN.pdf
│ ├── bt
│ │ └── Rockchip_Introduction_Android9.0_BT_Configuration_CN.pdf
│ ├── patches
│ │ └── root
│ │ ├── android11_root.pdf
│ │ └── RootChecker.apk
│ ├── Rockchip_Android14_GKI_Developer_Guide_CN.pdf
│ ├── Rockchip_Android14_SDK_Developer_Guide_CN.pdf
│ ├── Rockchip_Android14_SDK_Developer_Guide_EN.pdf
│ ├── Rockchip_Android_Remote_key_Provisioning_Guide.pdf
│ ├── Rockchip_Developer_Guide_Android11_Optimization_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_Recovery_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_SELinux(Sepolicy)CN.pdf
│ ├── Rockchip_Developer_Guide_PCBA_Test_Tool_V1.3_CN&EN.pdf
│ ├── Rockchip_Firmware_Upgrade_Failed_Analyze_Method_CN.pdf
│ ├── Rockchip_Introduction_Android_Application_Preinstallation_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Boot_Video_CN.pdf
│ ├── Rockchip_Introduction_Android_BOX_Display_Framework_Configuration_CN.pdf
│ ├── Rockchip_Introduction_Android_Factory_Reset_Protection_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Log_System.pdf
│ ├── Rockchip_Introduction_Android_Performance_Mode_CN&EN.pdf
│ ├──Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Customization_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Samba_CN.pdf
│ ├── Rockchip_Introduction_Android_Widevine_Project_Start_Preparation_CN.pdf
│ ├── Rockchip_Introduction_Box_Media_Application_CN&EN.pdf
│ ├── Rockchip-Parameter-File-Format-Version1.4-CN.pdf
│ ├── Rockchip_User_Guide_Android_GMS_Configuration_CN.pdf
│ ├── Rockchip_User_Guide_Android_GMS_Configuration_EN.pdf
│ ├── Rockchip_User_Guide_Box_FactoryTestTool_V3.0_CN.pdf
│ ├── Rockchip_User_Guide_Dr.G_CN&EN.pdf
│ ├── Rockchip_User_Guide_Magisk_Installation_EN.pdf
│ ├── video
│ │ └── Rockchip_Android_Multimedia_FAQ_CN.pdf
│ └── wifi
│ ├── Rockchip_Introduction_REALTEK_WIFI_Driver_Porting_CN&EN.pdf
│ └── Rockchip_Introduction_WIFI_Configuration_CN&EN.pdf
└── common
├── Audio
│ ├── Rockchip_Developer_Guide_Android_EQ_DRC_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_Multi_Audio_CN.pdf
│ ├──Rockchip_Developer_Guide_Audio_Call_3A_Algorithm_Integration_and_Parameter_Debugging_CN.pdf
│ ├── Rockchip_Developer_Guide_Audio_CN.pdf
│ └── Rockchip_Developer_Guide_RK817_RK809_Codec_CN.pdf
├── camera
│ ├── common
│ │ └── Camera_External_FAQ_v1.0 .pdf
│ ├── HAL1
│ │ ├── README_CN.txt
│ │ ├── README_EN.txt
│ │ ├── RK312x_Camera_User_Manual_v1.4(3288&3368).pdf
│ │ ├── RK_ISP10_Camera_User_Manual_v2.3.pdf
│ │ ├── RKISPV1_Camera_Module_AVL_v1.7.pdf
│ │ ├── Rockchip_Camera_AVL_v2.0_Package_20180515.7z
│ │ ├── Rockchip_Introduction_RKISPV1_Camera_Driver_Debugging_Method_CN.pdf
│ │ ├── Rockchip_Introduction_RKISPV1_Camera_FAQ_CN.pdf
│ │ ├── Rockchip SOFIA 3G-R_PMB8018(x3_C3230RK)Camera_Module_AVL_v1.6_20160226.pdf
│ │ └── Rockchip_Trouble_Shooting_Android_CameraHAL1_CN_EN.pdf
│ ├── HAL3
│ │ ├── camera_engine_rkisp_user_manual_v2.2.pdf
│ │ ├── camera_hal3_user_manual_v2.3.pdf
│ │ ├── README_CN.txt
│ │ ├── RKCIF_Driver_User_Manual_v1.0.pdf
│ │ ├── RKISP1_IQ_Parameters_User_Guide_v1.2.pdf
│ │ ├── RKISP_Driver_User_Manual_v1.3.pdf
│ │ ├── Rockchip_Color_Optimization_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Color_Optimization_Guide_ISP21_CN_v2.0.1.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Color_Optimization_Guide_ISP30_CN_v3.0.0.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Color_Optimization_Guide_ISP32_Lite_CN_v3.1.0.pdf
│ │ ├── Rockchip_Development_Guide_3A_ISP
│ │ │ └── ISP30
│ │ │ └── CN
│ │ │ └── Rockchip_Development_Guide_3A_ISP30_v1.1.0.pdf
│ │ ├── Rockchip_Development_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Development_Guide_ISP21_CN_v2.1.0.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Development_Guide_ISP30_CN_v1.2.3.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Development_Guide_ISP32_Lite_CN_v1.0.0.pdf
│ │ ├── Rockchip_Driver_Guide_VI
│ │ │ ├── CN
│ │ │ │ └── Rockchip_Driver_Guide_VI_CN_v1.1.4.pdf
│ │ │ └── EN
│ │ │ └── Rockchip_Driver_Guide_VI_EN_v1.0.7.pdf
│ │ ├── Rockchip_IQ_Tools_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.3.pdf
│ │ │ ├── ISP30
│ │ │ │ └── Rockchip_IQ_Tools_Guide_ISP21_ISP30_CN_v2.0.4.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_IQ_Tools_Guide_v2.0.7_CN.pdf
│ │ ├── Rockchip_Trouble_Shooting_CameraHAL3_CN_EN.pdf
│ │ ├── Rockchip_Tuning_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Tuning_Guide_ISP21_CN_v2.1.0.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Tuning_Guide_ISP30_CN_v1.1.0.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Tuning_Guide_ISP32-lite_CN_v1.0.0.pdf
│ │ └── USB_UVC_Integrated_Cameras.pdf
│ ├── README.txt
│ └── vehicle
│ └── Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN_V1.0.3.pdf
├── Can
│ ├── Rockchip_Developer_Guide_Can_CN.pdf
│ └── Rockchip_Developer_Guide_CAN_FD_CN.pdf
├── CLK
│ ├── Rockchip_Developer_Guide_Clock_CN.pdf
│ ├── Rockchip_Developer_Guide_Gpio_Output_Clocks_CN.pdf
│ ├── Rockchip_Develop_Guide_Pll_Ssmod_Clock_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_Clock_CN.pdf
├── CRU
│ ├── Rockchip_Developer_Guide_Linux3.10_Clock_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux4.4_4.19_Clock_CN.pdf
│ ├── Rockchip_Develop_Guide_Pll_Ssmod_Clock_CN.pdf
│ ├── Rockchip_RK3399_Developer_Guide_Clock_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_Linux4.4_Clock_CN.pdf
├── CRYPTO
│ ├── Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf
│ └── Rockchip_Developer_Guide_Crypto_HWRNG_EN.pdf
├── DDR
│ ├── DDR_bandwidth_statistics_tool
│ │ ├── rk-msch-probe-for-user-32bit
│ │ ├── rk-msch-probe-for-user-64bit
│ │ └── Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-EN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Problem-Solution-CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Problem-Solution-EN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Verification-Process-CN.pdf
│ ├── Rockchip_Developer_Guide_DDR_Verification_Process_EN.pdf
│ ├── Rockchip_Developer_Guide_HAL_DDR_ECC_CN.pdf
│ └── Rockchip-User-Guide-DDR-DQ-Eye-Tool-CN.pdf
├── debug
│ ├── RK3399-LOG-EXPLANATION.pdf
│ ├── Rockchip_Developer_Guide_DS5_CN.pdf
│ ├── Rockchip_Quick_Start_Linux_Perf.pdf
│ ├── Rockchip_Quick_Start_Linux_Streamline.pdf
│ ├── Rockchip_Quick_Start_Linux_Systrace.pdf
│ ├── Rockchip_RK3399_JTAG_Configuration_CN.pdf
│ └── Rockchip_User_Guide_J-Link_CN.pdf
├── display
│ ├── Rockchip_BT656_TX_AND_BT1120_TX_Developer_Guide_CN.pdf
│ ├── Rockchip_Developer_Guide_Baseparameter_Format_Define_And_Use_CN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Panel_Porting_CN&EN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Panel_Porting_CN.pdf
│ ├── Rockchip_Developer_Guide_Dual_Display_Rotation_Direction_Debugging_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_Based_on_DRM_Framework_CN&EN.pdf
│ ├── Rockchip_Developer_Guide_HDMI-CEC_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_CN.pdf
│ ├── Rockchip_Develop_Guide_DRM_Direct_Show_CN.pdf
│ ├── Rockchip_Display_Issues_FAQ_V1.1.pdf
│ ├── Rockchip_DRM_RK628_Porting_Guide_CN.pdf
│ ├── Rockchip FAQ DRM Hardware Composer V1.00-20181213.pdf
│ ├── Rockchip_Introduction_DisplayAdjust_APK_CN.pdf
│ ├── Rockchip_Introduction_DRM_Integration_Helper_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_DisplayPort_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_MIPI_DSI2_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.pdf
│ ├── Rockchip_RK3588_User_Guide_DP_CN.pdf
│ ├── Rockchip_RK3588_User_Guide_eDP_CN.pdf
│ └── Rockchip_Trouble_Shooting_Graphics
├── DVFS
│ ├── Rockchip_Developer_Guide_CPUFreq_CN.pdf
│ ├── Rockchip_Developer_Guide_CPUFreq_EN.pdf
│ ├── Rockchip_Developer_Guide_Devfreq_CN.pdf
│ ├── Rockchip_Developer_Guide_Devfreq_EN.pdf
│ ├── Rockchip_Developer_Guide_Linux4.4_CPUFreq_CN.pdf
│ └── Rockchip_Developer_Guide_Linux4.4_Devfreq_CN.pdf
├── Ebook
│ ├── Rockchip_RK3566_Introduction_EBOOK_Display_Mode_CN.pdf
│ └── Rockchip_RK3566_Introduction_EBOOK_Sleep_Mode_CN.pdf
├── GMAC
│ ├── Rockchip_Developer_Guide_Ethernet_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_EN.pdf
├── hdmi-in
│ ├── apk
│ │ ├── HdmiInDemo_based_on_CameraHal1_2020.06.11_v1.2.tar.gz
│ │ └── rkCamera2_based_on_CameraHal3_V1.3.tar.gz
│ ├── Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal1_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal3_CN.pdf
│ └── Rockchip_Developer_Guide_HDMI_RX_CN.pdf
├── I2C
│ ├── Rockchip_Developer_Guide_I2C_CN.pdf
│ └── Rockchip_Developer_Guide_I2C_EN.pdf
├── IO-Domain
│ ├── Rockchip_Developer_Guide_Linux_IO_DOMAIN_CN.pdf
│ ├── Rockchip_PX30_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3288_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3326_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3399_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3399Pro_Introduction_IO_Power_Domains_Configuration.pdf
│ └── Rockchip_RK356X_Introduction_IO_Power_Domains_Configuration.pdf
├── IOMMU
│ ├── Rockchip_Developer_Guide_Linux_IOMMU_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_IOMMU_EN.pdf
├── Leds
│ └── Rockchip_Introduction_Leds_GPIO_Configuration_for_Linux4.4_CN.pdf
├── MCU
│ ├── Rockchip_RK3399_Developer_Guide_MCU_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_MCU_EN.pdf
├── Memory
│ └── Rockchip_Developer_Guide_Linux_CMA_CN.pdf
├── MMC
│ ├── Rockchip_Developer_Guide_SD_Boot_CN.pdf
│ └── Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf
├── mobile-net
│ ├── Rockchip_Introduction_3G_Data_Card_USB_File_Conversion_CN.pdf
│ ├── Rockchip_Introduction_3G_Dongle_Configuration_CN&EN.pdf
│ └── Rockchip_Introduction_4G_Module_Configuration_CN&EN.pdf
├── MPP
│ ├── Rockchip_Developer_Guide_MPP_CN.pdf
│ └── Rockchip_Developer_Guide_MPP_EN.pdf
├── NVM
│ ├── Rockchip_Application_Notes_Storage_CN.pdf
│ ├── Rockchip_Developer_FAQ_Storage_CN.pdf
│ ├── Rockchip_Developer_Guide_OTP_CN.pdf
│ ├── Rockchip_Developer_Guide_OTP_EN.pdf
│ ├── Rockchip_Developer_Guide_SATA_CN.pdf
│ ├── Rockchip_Introduction_Partition_CN.pdf
│ ├── Rockchip_Introduction_Partition_EN.pdf
│ └── Rockchip_RK356X_Developer_Guide_SATA_CN.pdf
├── PCie
│ ├── Rockchip-Developer-Guide-linux4.4-PCIe.pdf
│ ├── Rockchip_Developer_Guide_PCIe_CN.pdf
│ ├── Rockchip_PCIe_Virtualization_Developer_Guide_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_PCIe_CN.pdf
├── perf
│ ├── perf使用说明.pdf
│ ├── Rockchip_Developer_FAQ_FileSystem_CN.pdf
│ ├── Rockchip_Optimize_Tutorial_Linux_IO_CN.pdf
│ ├── Rockchip_Quick_Start_Linux_Performance_Analyse_CN.pdf
│ └── systrace使用说明.pdf
├── PIN-Ctrl
│ ├── Rockchip_Developer_Guide_Linux_Pinctrl_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_Pinctrl_EN.pdf
├── PMIC
│ ├── Rockchip_Developer_Guide_FreeRTOS_PMIC_CHARGER_POWERKEY_CN.pdf
│ ├── Rockchip_Developer_Guide_Power_Discrete_DCDC_EN.pdf
│ ├── Rockchip_Developer_Guide_RK817_RK809_Fuel_Gauge_CN&EN.pdf
│ ├── Rockchip_RK805_Developer_Guide_CN.pdf
│ ├── Rockchip_RK806_Developer_Guide_CN.pdf
│ ├── Rockchip_RK808_Developer_Guide_CN.pdf
│ ├── Rockchip_RK809_Developer_Guide_CN.pdf
│ ├── Rockchip_RK816_Developer_Guide_CN.pdf
│ ├── Rockchip_RK817_Developer_Guide_CN.pdf
│ ├── Rockchip_RK818_Developer_Guide_CN.pdf
│ ├── Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.pdf
│ └── Rockchip_RK818_RK816_Introduction_Fuel_Gauge_Log_CN.pdf
├── power
│ ├── Rockchip_Developer_Guide_Power_Analysis_EN.pdf
│ └── Rockchip_Developer_Guide_Sleep_and_Resume_CN.pdf
├── PWM
│ ├── Rockchip_Developer_Guide_Linux_PWM_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_PWM_EN.pdf
│ └── Rockchip_Developer_Guide_PWM_IR_CN.pdf
├── RGA
│ ├── Rockchip_Developer_Guide_RGA_CN.pdf
│ ├── Rockchip_Developer_Guide_RGA_EN.pdf
│ ├── Rockchip_FAQ_RGA_CN.pdf
│ └── Rockchip_FAQ_RGA_EN.pdf
├── RK628
│ ├── Rockchip_RK628D_Application_Notes_CN.pdf
│ └── Rockchip_RK628D_For_All_Porting_Guide_CN.pdf
├── RKTools manuals
│ ├── RKIQTool_User_Manual_v1.5-CH.pdf
│ ├── RKIQTool_User_Manual_v1.5-EN.pdf
│ ├── RK_Platform_apache_tomcat_ota_Server_Setup_Introduction.rar
│ ├── Rockchip_Box_Factory_Test_Tool_V2.0.rar
│ ├── Rockchip_Developer_Guide_Linux_Nand_Flash_Open_Source_Solution_CN.pdf
│ ├── Rockchip_Introduction_Image_Upgrading_Failure_Analysis_CN.pdf
│ ├── Rockchip_Introduction_MP_Tool_Upgrading_and_Related_Issues_Debugging_CN.pdf
│ ├── Rockchip_Introduction_REPO_Mirror_Server_Build_and_Management_CN.pdf
│ ├── Rockchip_Introduction_Stresstest_for_VR_CN.pdf
│ ├── Rockchip_Introduction_WNpctool_Write_Tool_CN.pdf
│ ├── Rockchip_User_Guide_Box_Factory_Test_Tool_CN.pdf
│ ├── Rockchip_User_Guide_Keybox_Burning_EN.pdf
│ ├── Rockchip_User_Guide_KeyWrite_CN.pdf
│ ├── Rockchip_User_Guide_MP_Flashing_v1.2_CN.pdf
│ ├── Rockchip_User_Guide_Production_For_Firmware_Download_CN.pdf
│ ├── Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf
│ ├── Rockchip_User_Guide_RKDevInfoWriteTool_EN.pdf
│ ├── Rockchip_User_Guide_RK_Platform_MP_Upgrading_CN.pdf
│ ├── Rockchip_User_Manual_Android_Development_Tool_CN.pdf
│ ├── Rockchip_User_Manual_RKIQTool_CN.pdf
│ ├── Rockchip_User_Manual_RKIQTool_EN.pdf
│ ├── Rockchip_User_Manual_RKUpgrade_Dll_CN.pdf
│ └── SecureBootTool_UserManual.pdf
├── SARADC
│ ├── Rockchip_Developer_Guide_Linux_SARADC_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_SARADC_EN.pdf
├── security
│ ├── patch
│ │ └── u-boot
│ │ └── 0001-avb-add-embedded-key.patch
│ ├── RK3399_Efuse_Operation_Instructions_V1.00_EN.pdf
│ ├── RK356X_SecurityBoot_And_AVB_instructions_CN.pdf
│ ├── RK356X_SecurityBoot_And_AVB_instructions_EN.pdf
│ ├── RK3588_SecurityBoot_And_AVB_instructions_CN.pdf
│ ├── RK3588_SecurityBoot_And_AVB_instructions_EN.pdf
│ ├── Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_CN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_EN.pdf
│ ├── Rockchip_Developer_Guide_TEE_SDK_CN.pdf
│ ├── Rockchip_RK3399_User_Guide_SecurityBoot_And_AVB_CN.pdf
│ └── Rockchip Vendor Storage Application Note.pdf
├── Sensors
│ └── Rockchip_Developer_Guide_Sensors_CN.pdf
├── SPI
│ ├── Rockchip_Developer_Guide_Linux_SPI_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_SPI_EN.pdf
├── Thermal
│ ├── Rockchip_Developer_Guide_Thermal_CN.pdf
│ └── Rockchip_Developer_Guide_Thermal_EN.pdf
├── TRUST
│ ├── Rockchip_Developer_Guide_Trust_CN.pdf
│ ├── Rockchip_Developer_Guide_Trust_EN.pdf
│ └── Rockchip_RK3588_Developer_Guide_System_Suspend_CN.pdf
├── Tutorial
│ ├── RK3399-CPUINFO.pdf
│ ├── RK3399-LOG-EXPLANATION.pdf
│ ├── Rockchip_Developer_FAQ_FileSystem_CN.pdf
│ ├── Rockchip_Introduction_Browser_FAQ_CN.pdf
│ └── Rockchip_Trouble_Shooting_Firmware_Upgrade_Issue_CN.pdf
├── UART
│ ├── Rockchip-Developer-Guide-RT-Thread-UART.pdf
│ ├── Rockchip_Developer_Guide_UART_CN.pdf
│ ├── Rockchip_Developer_Guide_UART_EN.pdf
│ └── Rockchip_Developer_Guide_UART_FAQ_CN.pdf
├── u-boot
│ ├── Rockchip-Developer-Guide-Linux-AB-System.pdf
│ ├── Rockchip-Developer-Guide-Uboot-mmc-device-driver-analysis.pdf
│ └── Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf
├── usb
│ ├── Rockchip_Developer_Guide_Linux_USB_Initialization_Log_Analysis_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_Linux_USB_Performance_Analysis_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_Linux_USB_PHY_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_EN.pdf
│ ├── Rockchip_Developer_Guide_USB_FFS_Test_Demo_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_FFS_Test_Demo_CN_V1.2.1.pdf
│ ├── Rockchip_Developer_Guide_USB_Gadget_UAC_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_Gadget_UAC_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_USB_SQ_Test_CN.pdf
│ ├── Rockchip_Introduction_USB_SQ_Tool_CN.pdf
│ ├── Rockchip_RK3399_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_RK356x_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_RK356X_User_Guide_USB_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_USB_CN.pdf
│ └── Rockchip_User_Guide_USB_PHY_Tuning_CN.pdf
└── watchdog
├── Rockchip_Developer_Guide_Linux_WDT_CN.pdf
└── Rockchip_Developer_Guide_Linux_WDT_EN.pdf
```

## StressTest

Введите83991906= в калькуляторе устройства для StressTest. Модули:камера открытие/закрытие, снимки/переключение; Bluetooth и Wi-Fi вкл/выкл. ping/iperf лишь планируются. Другие тесты:авиарежим, сон/пробуждение, видео, перезагрузка, factory reset, частоты ARM/GPU/DDR. Сброс уничтожает данные:выделенное тестовое устройство/резервная копия. Это функции SDK, не проведённые ArmSoM испытания.

## PCBA и DeviceTest

PCBA выявляет производственные дефекты:LCD, Wi-Fi, Bluetooth, DDR/EMMC, SD, USB HOST, кнопки, динамик/наушники Codec. Автоматически:Wi-Fi, DDR/EMMC, Ethernet; вручную:кнопки, SD, USB HOST, Codec. Ethernet есть в автоматической группе, но отсутствует в исходном перечне; сохранено. Документ:RKDocs/android/Rockchip_Developer_Guide_PCBA_Test_Tool_CN&EN.pdf_V1.1_20171222.pdf.

DeviceTest проверяет периферию собранного изделия; код калькулятора000.=. TEST CHECKED последовательно проверяет выбранные пункты; отмечайте pass/failed. Красный — ошибка, остальные пройдены; ремонт по результатам. Для изменения инструмента запросите исходники у FAE.

![Выбор/результаты DeviceTest](/docs/rockchip-android14-sdk/images/devicetest-start-en.png)

Выбор/результаты DeviceTest - Оригинальная иллюстрация;страница PDF 36 (EN).

## Инструменты хоста

![Windows-инструмент прошивки](/docs/rockchip-android14-sdk/images/windows-tool-en.png)

Windows-инструмент прошивки - Оригинальная иллюстрация;страница PDF 37 (EN).

| Инструмент/назначение | Пакет/путь |
| --- | --- |
| USB ADB/прошивочные драйверы | RKTools/windows/DriverAssitant_v5.1.1.zip |
| Прошивка Windows | RKTools/windows/AndroidTool/AndroidTool_Release_v3.28.zip |
| Прошивка Linux | RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30.zip |
| SD обновление/загрузка/PCBA | RKTools/windows/SDDiskTool_v1.74.zip |
| Запись идентификаторов; распаковать/установить, администратор | RKTools/windows/RKDevInfoWriteTool-1.3.0.7z |
| Проверка соединений/непропая DDR | RKTools/windows/Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_CN.7z<br>RKTools/windows/Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_EN.7z |
| Программирование efuse:RK3288W/RK3368/RK3399 | RKTools/windows/efuse_v1.37.rar |
| Подпись прошивки efuse/OTP | RKTools/windows/SecureBootTool_v1.94.zip |
| Массовая заводская прошивка | RKTools/windows/FactoryTool-1.72.9.7z |
| Пакет предустановленных userdata | RKTools/windows/OemTool_v1.3.rar |
| Настройка изображения Camera ISP | external/camera_engine_rkaiq/rkisp2x_tuner |

Руководство записи идентификаторов:RKDocs/common/RKTools manuals/Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf. efuse/OTP может быть необратим:проверьте чип, ключи и план. Ниже help v2.26, хотя пакет v2.30; сохранены команды/опции и опечатка BlokcLen. Стирание, запись и fuse не выполнялись.

```text
Linux_Upgrade_Tool_v2.26$ sudo ./upgrade_tool -h
Program Data in /home/wlq/.config/upgrade_tool
---------------------Tool Usage ---------------------
Help: H
Quit: Q
Version: V
Clear Screen: CS
------------------Upgrade Command ------------------
ChooseDevice: CD
ListDevice: LD
SwitchDevice: SD
UpgradeFirmware: UF <Firmware> [-noreset]
UpgradeLoader: UL <Loader> [-noreset]
DownloadImage: DI <-p|-b|-k|-s|-r|-m|-u|-t|-re image>
DownloadBoot: DB <Loader>
EraseFlash: EF <Loader|firmware> [DirectLBA]
PartitionList: PL
WriteSN: SN <serial number>
ReadSN: RSN
----------------Professional Command -----------------
TestDevice: TD
ResetDevice: RD [subcode]
ResetPipe: RP [pipe]
ReadCapability: RCB
ReadFlashID: RID
ReadFlashInfo: RFI
ReadChipInfo: RCI
ReadSector: RS <BeginSec> <SectorLen> [-decode] [File]
WriteSector: WS <BeginSec> <File>
ReadLBA: RL <BeginSec> <SectorLen> [File]
WriteLBA: WL <BeginSec> <File>
EraseLBA: EL <BeginSec> <EraseCount>
EraseBlock: EB <CS> <BeginBlock> <BlokcLen> [--Force]
-------------------------------------------------------
```

## ADB:подключение и команды

ADB управляет устройством/эмулятором:shell, порты, файлы, установка APK. Источник называет PC клиентом, устройство сервером; различает сетевой ADB по LAN (CN уточняет одну LAN) и USB. Ограничения исходного USB:OTG, один клиент/устройство; это условия документа, не всех ADB. Запустите Android, включите подключение к PC и USB debugging в Developer options, соедините OTG, выполните adb shell/adb devices; серийный номер подтверждает связь.

| Действие | Синтаксис/пример | Значение |
| --- | --- | --- |
| Список устройств | adb devices | Серийный номер или IP:порт и статус |
| Установка/переустановка | adb install &lt;apk-path&gt;<br>adb install "F:\WishTV\WishTV.apk"<br>adb install -r "F:\WishTV\WishTV.apk" | Локальный APK; -r переустановка |
| Удалить приложение | adb uninstall &lt;package&gt;<br>adb uninstall com.wishtv | Полное удаление пакета |
| Удалить APK-файл | adb shell rm &lt;filepath&gt;<br>adb shell rm "system/app/WishTV.apk" | Удаляет файл устройства; разрушительный пример |
| Shell устройства | adb shell | Командная строка устройства/эмулятора |
| Загрузка на устройство | adb push &lt;local-path&gt; &lt;remote-path&gt;<br>adb push "F:\WishTV\WishTV.apk" "system/app" | Копировать файл/папку на устройство; EN опускает аргументы |
| Скачивание | adb pull &lt;remote-path&gt; &lt;local-path&gt;<br>adb pull system/app/Contacts.apk F:\ | Копировать с устройства на PC |
| Отчёт ошибок | adb bugreport | Включает dumpsys/dumpstate/logcat |
| Свойства системы | adb shell getprop | Просмотр свойств устройства |

Типографские кавычки/тире PDF заменены ASCII. Запись root/system зависит от прав прошивки; примеры не дают разрешений и не гарантируют доступность system для записи.

## Logcat

Android пишет отладку в буферы; logcat выводит их, фильтры ограничивают объём. Синтаксис:[adb] logcat [<option>] [<filter-spec>]; adb shell, затем logcat. *:W — warning и выше. ActivityManager:I MyApp:D *:S сохраняет ActivityManager info+ и MyApp debug+, остальные теги молчат. Оба PDF ошибочно описывают исключение этих тегов; команда сохранена, смысл уточнён. WishTV:* *:S либо -s WishTV — только WishTV; WishTV:I *:S задаёт порог info, не единственный уровень.

```sh
adb shell
logcat
logcat *:W
logcat ActivityManager:I MyApp:D *:S
logcat WishTV:* *:S
logcat -s WishTV
logcat WishTV:I *:S
```

## Снимки памяти Procrank

Procrank в shell устройства показывает память процессов. USS исключительно принадлежит процессу и освобождается при завершении; VSS/RSS включают общие библиотеки, поэтому сами по себе не показывают исключительное владение. PSS делит общую память пропорционально. Перед запуском su; сортировка по умолчанию PSS, -v — VSS по убыванию.

| Метрика | Значение |
| --- | --- |
| VSS | Virtual Set Size, виртуальная память с общими библиотеками |
| RSS | Resident Set Size, физическая память с общими библиотеками |
| PSS | Proportional Set Size, пропорциональная доля общей памяти |
| USS | Unique Set Size, исключительная физическая память |

| Опция | Значение |
| --- | --- |
| -v | VSS |
| -r | RSS |
| -p | PSS |
| -u | USS |
| -R | Сменить возрастание/убывание |
| -w | Только working set |
| -W | Сброс working set |
| -h | Справка |

```sh
su
procrank [ -W ] [ -v | -r | -p | -u | -h ]
procrank
procrank -v
procrank | grep [cmdline | PID]
procrank | grep "com.android.systemui"
procrank | grep 3396
```

cmdline — имя приложения, PID — идентификатор. Для возможной утечки повторяйте снимки и сравнивайте USS. После ADB запустите ./test.sh ниже; тенденция — признак, не самостоятельное доказательство утечки.

```sh
#!/bin/bash
while true;do
    adb shell procrank | grep "com.android.systemui"
    sleep 1
done
```

## Dumpsys

Dumpsys в shell сообщает о Binder-службах, зарегистрированных в ServiceManager и реализующих dump. -help справка, -l список; имя службы полное и регистрозависимое, при поддержке добавьте приложение.

```sh
dumpsys -help
dumpsys -l
dumpsys [servicename]
dumpsys SurfaceFlinger
dumpsys [servicename] [application-name]
dumpsys meminfo com.android.systemui
```

## Предыдущие журналы и FIQ

Добавьте два узла ramoops DTS. В /sys/fs/pstore:dmesg-ramoops-0 — последний panic, pmsg-ramoops-0 — прошлые Android/userspace логи, ftrace-ramoops-0 — трассировка функций, console-ramoops-0 — прошлый boot kernel log выше порога уровня. logcat -L извлекает/разбирает pmsg.

```dts
ramoops_mem: ramoops_mem {
reg = <0x0 0x110000 0x0 0xf0000>;
reg-names = "ramoops_mem";
};
ramoops {
compatible = "ramoops";
record-size = <0x0 0x20000>;
console-size = <0x0 0x80000>;
ftrace-size = <0x0 0x00000>;
pmsg-size = <0x0 0x50000>;
memory-region = <&ramoops_mem>;
};
```

```sh
cd /sys/fs/pstore
ls
cat dmesg-ramoops-0
cat console-ramoops-0
logcat -L
cat ftrace-ramoops-0
```

При зависании введите fiq в последовательной консоли и help для состояния/команд. reboot/reset меняют состояние устройства; используйте осознанно.

```text
127|console:/ $ fiq
debug> help
FIQ Debugger commands:
pc PC status
regs Register dump
allregs Extended Register dump
bt Stack trace
reboot [<c>] Reboot with command <c>
reset [<c>] Hard reset with command <c>
irqs Interupt status
kmsg Kernel log
version Kernel version
sleep Allow sleep while in FIQ
nosleep Disable sleep while in FIQ
console Switch terminal to console
cpu Current CPU
cpu <number> Switch to CPU<number>
ps Process list
sysrq sysrq options
sysrq <param> Execute sysrq with <param>
```

## FAQ:версии и синхронизация

Android14.0:kernel6.1/U-Boot next-dev. SDK объединяет AOSP/RK; RK XML в .repo/manifests/include, AOSP в .repo/manifests/default.xml. Укажите обе revision; примеры android-14.0-mid-rkr1 и android-14.0.0_r11. git tag показывает теги репозитория; RK увеличивает android-14.0-mid-rkrxx. «Последний RKR1» — исторический пример.

```text
vim .repo/manifests/include/rk_checkout_from_aosp.xml
<project groups="pdk" name="platform/build" path="build/make" remote="rk" revision="refs/tags/android-14.0-mid-rkr1">
vim .repo/manifests/default.xml
<default revision="refs/tags/android-14.0.0_r11"...>
# In kernel-6.1
git tag
# example result: android-14.0-mid-rkr1
```

Проверка полноты:экспортируйте закреплённый локальный manifest и сравните с выпуском .repo/manifests/commit/. CN вводит RKR1, EN RKR6; оба имени rkr1, оба затем называют эталон RKR6. Расхождение сохранено; сравнивайте действительный целевой выпуск.

```sh
.repo/repo/repo manifest -r -o release_manifest_rkr1_local.xml
# Compare with .repo/manifests/commit/commit_release_rkr1.xml
```

## Загрузочные логотипы и64-bit

Первый/второй логотип:kernel-6.1/logo.bmp и logo_kernel.bmp. Замените BMP тем же именем, пересоберите ядро; результат в boot.img. Источник:до8MB,8/16/24/32-bit BMP. Android14 GMS/EDLA требует64-bit-only для снижения памяти; пример rk3562_ugo ниже.

```diff
diff --git a/rk3562_ugo/BoardConfig.mk b/rk3562_ugo/BoardConfig.mk
index c06433e..dc9cc50 100644
--- a/rk3562_ugo/BoardConfig.mk
+++ b/rk3562_ugo/BoardConfig.mk
@@ -18,3 +18,11 @@ PRODUCT_KERNEL_DTS := rk3562-rk817-tablet-v10
CAMERA_SUPPORT_AUTOFOCUS := true
BOARD_BUILD_GKI := true
include device/rockchip/rk3562/BoardConfig.mk
+
+DEVICE_IS_64BIT_ONLY := true
+
+TARGET_2ND_ARCH :=
+TARGET_2ND_ARCH_VARIANT :=
+TARGET_2ND_CPU_ABI :=
+TARGET_2ND_CPU_ABI2 :=
+TARGET_2ND_CPU_VARIANT :=
```

## Зарядка и изображения

Зарядка выключенного устройства/предзаряд задаются DTS. uboot-charge-on/android-charge-on взаимоисключающие. uboot-low-power-voltage — порог запуска, screen-on-voltage — экрана. BMP заменяются тем же именем/форматом. При отсутствии картинок упакуйте resource.img, затем boot.img и прошейте rockdev/boot.img. Источник смешивает kernel-6.1/kernel и пишет ./mkiamge.sh; проверьте реальные пути/скрипты.

```dts
charge-animation {
compatible = "rockchip,uboot-charge";
rockchip,uboot-charge-on = <1>;
rockchip,android-charge-on = <0>;
rockchip,uboot-low-power-voltage = <3400>;
rockchip,screen-on-voltage = <3500>;
status = "okay";
};
```

```text
u-boot/tools/images/
├── battery_0.bmp
├── battery_1.bmp
├── battery_2.bmp
├── battery_3.bmp
├── battery_4.bmp
├── battery_5.bmp
└── battery_fail.bmp
```

```sh
cd u-boot
./scripts/pack_resource.sh ../kernel-6.1/resource.img
cp resource.img ../kernel/resource.img
# Source spelling, executed from Android root:
./mkiamge.sh
```

## HDMI, модем, Wi-Fi и поворот

HDMI IN/RM3104G выключены по умолчанию; настройки ниже. Wi-Fi сохраняет связь во сне; для отключения def_wifi_sleep_policy2→0 в исходном rk3566_rgo overlay. persist.wifi.sleep.delay.ms задаёт задержку15минут по умолчанию,0 — сразу после выключения экрана. rgo — исторический путь, не выведенная цель Android14.

```make
# device/rockchip/rk3588/BoardConfig.mk
BOARD_HDMI_IN_SUPPORT := true
# device/rockchip/common/BoardConfig.mk
BOARD_HAS_RK_4G_MODEM ?= true
```

```diff
--- a/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
+++ b/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaults.xml
@@ -24,5 +24,5 @@
You can configure persist.wifi.sleep.delay.ms to delay closing wifi.
The default is 15 minutes, 0 means that the wifi is turned off
immediately after the screen is off. -->
- <integer name="def_wifi_sleep_policy">2</integer>
+ <integer name="def_wifi_sleep_policy">0</integer>
</resources>
```

Recovery:0/90/180/270°, исходно0; device/rockchip/common/BoardConfig.mk:ROTATION_NONE/RIGHT/DOWN/LEFT соответственно. SurfaceFlinger также0/90/180/270.

```make
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
SF_PRIMARY_DISPLAY_ORIENTATION ?= 0
```

## Зеркала AOSP

После repo init/распаковки измените aosp fetch в .repo/manifests/remote.xml:пример внутри Китая Tsinghua, за рубежом Google. Исходно fetch="./" review="https://10.10.10.29". Пробел «< remote» и конечная точка с запятой PDF исправлены в XML ниже; доступность/права проверяются отдельно.

```xml
<remote name="aosp" fetch="./" review="https://10.10.10.29" />
<!-- Alternative A -->
<remote name="aosp" fetch="https://aosp.tuna.tsinghua.edu.cn" />
<!-- Alternative B -->
<remote name="aosp" fetch="https://android.googlesource.com" />
```

## Производительность data и EXT4

Источник рекомендует fsync_mode=nobarrier с батареей для скорости, но предупреждает о повреждении данных без неё при потере питания. Батарея не устраняет все риски; проверьте питание/резервные копии. Сохранены оба патча fstab.in/fstab_go.in; во втором resgid=1065i, вероятная опечатка, не применяйте вслепую. Переносы PDF объединены, литерал сохранён.

```diff
cd device/rockchip/common
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 2ec6c265..c890cc84 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -23,6 +23,6 @@ ${_block_prefix}odm /odm ext4 ro,barrier=1 ${_flags},first_stage_mount
# For sdmmc
/devices/platform/${_sdmmc_device}/mmc_host* auto auto defaults voldmanaged=sdcard1:auto
# Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065,fsync_mode=nobarrier latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
# for ext4
#/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
diff --git a/scripts/fstab_tools/fstab_go.in b/scripts/fstab_tools/fstab_go.in
index 582557f2..05c7653c 100755
--- a/scripts/fstab_tools/fstab_go.in
+++ b/scripts/fstab_tools/fstab_go.in
@@ -17,6 +17,6 @@ ${_block_prefix}odm /odm ext4 ro,barrier=1 ${_flags},first_stage_mount
# For sdmmc
/devices/platform/${_sdmmc_device}/mmc_host* auto auto defaults voldmanaged=sdcard1:auto
# Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065i,fsync_mode=nobarrier latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
# for ext4
#/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
```

data исходно f2fs; источник предлагает EXT4 без батареи для снижения вероятности потери данных, не гарантии. Пример rk3566_r меняет шаблон Android fstab и recovery.fstab; преобразование может требовать форматирования, планируйте миграцию/backup. Контекст first_stage_ обрезан в источнике, не восстановлен догадкой.

```diff
device/rockchip/common$ git diff
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 6e78b00..a658332 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -20,6 +20,6 @@ ${_block_prefix}system_ext /system_ext ext4 ro,barrier=1 ${_flags},first_stage_
# For sdmmc
/devices/platform/${_sdmmc_device}/mmc_host* auto auto defaults voldmanaged=sdcard1:auto
# Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
+#/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
# for ext4
-#/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
+/dev/block/by-name/userdata /data ext4 discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1 latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
device/rockchip/rk356x$ git diff
diff --git a/rk3566_r/recovery.fstab b/rk3566_r/recovery.fstab
index 7532217..cf789ac 100755
--- a/rk3566_r/recovery.fstab
+++ b/rk3566_r/recovery.fstab
@@ -7,7 +7,7 @@
/dev/block/by-name/odm /odm ext4 defaults defaults
/dev/block/by-name/cache /cache ext4 defaults defaults
/dev/block/by-name/metadata /metadata ext4 defaults defaults
-/dev/block/by-name/userdata /data f2fs defaults defaults
+/dev/block/by-name/userdata /data ext4 defaults defaults
/dev/block/by-name/cust /cust ext4 defaults defaults
/dev/block/by-name/custom /custom ext4 defaults defaults
/dev/block/by-name/radical_update /radical_update ext4 defaults defaults
```

## Анимация, производительность приложений и GPU

Анимация/звуки:RKDocs/android/Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Customization_CN&EN.pdf. Пакеты ускорения задаются в device/rockchip/rk3xxx/package_performance.xml; имя через aapt dump badging (file_path.apk), mode1 вкл/0 выкл; файл входит в прошивку. Оригинальные Antutu-фрагменты ниже имеют ошибки XML/обратные слеши и повтор full-пакета; сохранены для сверки, не готовый XML. GPU:RKDocs/android/Rockchip_User_Guide_Dr.G_CN&EN.pdf.

```text
< app package="com.antutu.ABenchMark"mode="1"/>
< app package="com.antutu.benchmark.full"mode="1"\/>
< app package="com.antutu.benchmark.full"mode="1"\/>
```

## OTP/efuse и состояние

| Тип | Список чипов |
| --- | --- |
| OTP | RK3326, PX30, RK3566, RK3568, RK3588 |
| EFUSE | RK3288, RK3368, RK3399 |

EN дополнительно указывает OTP RK3568S, CN нет; это непроверенное расхождение, не исправляется на другой чип. Руководство:RKDocs/common/security/Rockchip-Secure-Boot-Application-Note-V1.9.pdf. cmdline fuse.programmed:1 — прошивка подписана secure-boot, аппаратно записано;0 — подписана, аппаратно не записано. Отсутствие:неподписанная прошивка/Miniloader не передаёт либо старый Miniloader; не доказательство незапрограммированного hardware.

## SELinux и предупреждение согласованности

BOARD_SELINUX_ENFORCING=false выключает enforcement,true включает; отключение ослабляет защиту, не рекомендация производства. Предупреждение internal problem:несовпадающие fingerprint system/boot/vendor либо IO-debug config. При ненужной отладке используйте нормальную конфигурацию сборки. Источник предлагает скрыть окно патчем, но это не исправляет прошивку; if (0 && ...) невалиден в Java, сохранён только как ошибка источника. Устраните причину и проверьте debug-изменения.

```diff
device/rockchip/common$
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -67,7 +67,7 @@ endif
# Enable android verified boot 2.0
BOARD_AVB_ENABLE ?= false
-BOARD_SELINUX_ENFORCING ?= false
+BOARD_SELINUX_ENFORCING ?= true
```

```diff
diff --git a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
index 595c340..d4e495a 100644
--- a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
+++ b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
@@ -6555,7 +6555,7 @@ public class ActivityTaskManagerService extends
IActivityTaskManager.Stub {
} catch (RemoteException e) {
}
- if (!Build.isBuildConsistent()) {
+ if (0 && !Build.isBuildConsistent()) {
Slog.e(TAG, "Build fingerprint is not consistent, warning user");
mUiHandler.post(() -> {
if (mShowDialogs) {
```

## Ethernet, AVB и IO-отладка

Ethernet-настройки скрыты по умолчанию; добавьте BOARD_HS_ETHERNET=true. AVB:RKDocs/common/security/RK356X_SecurityBoot_And_AVB_instructions_CN.pdf. IO требует DEVMEM, исходно выключенный. Для контролируемого debug удалите “# CONFIG_DEVMEM is not set” из mkcombinedroot/configs/android-14.config либо android-14-go.config; Android требует ещё два патча kernel/configs ниже. Прямой физический доступ ослабляет изоляцию, не включайте бездумно в производстве.

```diff
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -146,3 +146,6 @@ endif
ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
DEVICE_MANIFEST_FILE := device/rockchip/$(TARGET_BOARD_PLATFORM)/manifest_ab.xml
endif
+# for ethernet
+BOARD_HS_ETHERNET := true
```

```diff
cd rk3562_Android14.0/kernel/configs
diff --git a/android-6.1/android-base.config b/android-6.1/android-base.config
index 5de76f0..6dcdf86 100644
--- a/android-6.1/android-base.config
+++ b/android-6.1/android-base.config
@@ -2,7 +2,6 @@
# CONFIG_ANDROID_LOW_MEMORY_KILLER is not set
# CONFIG_ANDROID_PARANOID_NETWORK is not set
# CONFIG_BPFILTER is not set
-# CONFIG_DEVMEM is not set
# CONFIG_FHANDLE is not set
# CONFIG_FW_CACHE is not set
# CONFIG_IP6_NF_NAT is not set
wlq@sys2206:~/rk3562_Android14.0/kernel/configs$ git diff
diff --git a/u/android-6.1/android-base.config b/u/android-6.1/android-base.config
index 29b9e98..c1b21cf 100644
--- a/u/android-6.1/android-base.config
+++ b/u/android-6.1/android-base.config
@@ -2,7 +2,6 @@
# CONFIG_ANDROID_LOW_MEMORY_KILLER is not set
# CONFIG_ANDROID_PARANOID_NETWORK is not set
# CONFIG_BPFILTER is not set
-# CONFIG_DEVMEM is not set
# CONFIG_FHANDLE is not set
# CONFIG_FW_CACHE is not set
# CONFIG_IP6_NF_NAT is not set
```

## SN, LZ4 и дополнительные функции

SN начинается буквой, максимум14байт. Ошибка LZ4 ядра может означать старую версию; требуется1.8.3+, проверка lz4 -v. Источник предлагает заменить /usr/bin/lz4 бинарником Android; это системный инструмент, проверьте совместимость/восстановление. Вывод также содержит refusing to read from a console.

![Ошибка сборки LZ4](/docs/rockchip-android14-sdk/images/lz4-error-en.png)

Ошибка сборки LZ4 - Оригинальная иллюстрация;страница PDF 56 (EN).

```text
wlq@ubuntu:~$ lz4 -v
*** LZ4 command line interface 64-bits v1.8.3, by Yann Collet ***
refusing to read from a console
```

```sh
sudo cp out/host/linux-x86/bin/lz4 /usr/bin/lz4
```

| Функция | Документ |
| --- | --- |
| Samba | RKDocs/android/Rockchip_Introduction_Android_Samba_CN.pdf |
| Загрузка NFS | RKDocs/android/patches/customized_functions/nfs_boot_patch_v1.1.0.zip |
| Независимые экраны/касания | RKDocs/android/patches/customized_functions/Android11异显开发说明.zip |
| Раздельный звук экранов | RKDocs/android/patches/customized_functions/Dual_Audio_v1.0.zip |

Пример загрузчика RK3528 DDR4BIT PCB меняет только FlashData на4BIT ниже; не добавляет RK3528 в таблицу поддержки SDK.

```diff
diff --git a/RKBOOT/RK3528MINIALL.ini b/RKBOOT/RK3528MINIALL.ini
index a7e3779..6a952cf 100644
--- a/RKBOOT/RK3528MINIALL.ini
+++ b/RKBOOT/RK3528MINIALL.ini
@@ -14,7 +14,7 @@ Path1=bin/rk35/rk3528_usbplug_v1.03.bin
NUM=2
LOADER1=FlashData
LOADER2=FlashBoot
-FlashData=bin/rk35/rk3528_ddr_1056MHz_v1.05.bin
+FlashData=bin/rk35/rk3528_ddr_1056MHz_4BIT_PCB_v1.05.bin
```

## Приложение A:историческая среда сборки

Приложение взято из старого AOSP-руководства и даже в CN PDF остаётся английским. Ubuntu14.04/15.04,JDK8,Mac — исторический материал, не проверенные требования Android14; GKI отдельно требует Ubuntu20.04+. Старые пакеты не рекомендуются как текущая установка. Источник говорит Linux/Mac, не Windows, ссылается на Life of a Patch; $ — приглашение, веб-инструкции Click to copy/тройной клик — элементы источника, не статьи.

Сначала выберите ветвь:от неё зависит среда; Build Numbers перечисляет ветви, master в источнике не указывает branch. Linux-инструкции заявлены для всех/master; исторические тесты Ubuntu LTS14.04/Debian testing, другие дистрибутивы могут иметь инструменты. Gingerbread2.3.x+ требует64-bit, старые версии могли32-bit. Requirements содержит полные условия Ubuntu/Mac. AOSP master включает OpenJDK в prebuilts/jdk/, старым ветвям нужен отдельный OpenJDK по JDK Requirements.

Исторические Ubuntu≥15.04 команды ставят OpenJDK8. Для14.04 источник говорит, что поддерживаемых пакетов нет, но15.04 работали, а15.10/16.04 по этому способу нет.64-bit .deb с old-releases.ubuntu.com сверяются SHA256; здесь не загружались.

```sh
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

| Пакет | SHA256 |
| --- | --- |
| openjdk-8-jre-headless_8u45-b14-1_amd64.deb | 0f5aba8db39088283b51e00054813063173a4d8809f70033976f83e214ab56c0 |
| openjdk-8-jre_8u45-b14-1_amd64.deb | 9ef76c4562d39432b69baf6c18f199707c5c56a5b4566847df908b7d74e15849 |
| openjdk-8-jdk_8u45-b14-1_amd64.deb | 6e47215cf6205aa829e6a0a64985075bd29d1f428a4006a80c9db371c2fc3c4c |

Запускайте dpkg для каждого пакета; зависимости исправляются apt-get -f install. При необходимости выберите java/javac через update-alternatives. PDF склеивает команды, ниже разделены. Для ошибок версии Java дана ссылка Wrong Java version.

```sh
sha256sum {downloaded.deb file}
sudo apt-get update
sudo dpkg -i {downloaded.deb file}
sudo apt-get -f install
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

Исторические зависимости64-bit Ubuntu14.04 ниже. CN дополнительно libssl-dev/liblz4-tool/python-dev, отсутствующие EN. Анализ SELinux:python-networkx; ART host-тесты с LDAP:libnss-sss:i386.

```sh
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-core-dev libx11-dev lib32z-dev ccache libgl1-mesa-dev libxml2-utils xsltproc unzip python-pyelftools python3-pyelftools device-tree-compiler libfdt-dev libfdt1 libssl-dev liblz4-tool python-dev
```

Историческое GNU/Linux USB-правило даёт доступ указанному пользователю. Root создаёт /etc/udev/rules.d/51-android.rules, заменяя <username> авторизованным именем; переподключите устройство. Источник сообщает Ubuntu8.04.x/10.04.x, другие версии могут отличаться. Ссылка:http://source.android.com/source/initializing.html.

```text
# adb protocol on passion (Rockchip products)
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", ATTR{idProduct}=="0010", MODE="0600", OWNER="<username>"
```

## Приложение B:ключи SSH

B-1:создайте RSA-ключ, заменив user@host своим email. id_rsa/пароль храните секретно, администратору SDK передавайте только id_rsa.pub. Скриншоты — исходные примеры, не ключи этой задачи.

```sh
ssh-keygen -t rsa -C "user@host"
```

![Пример создания RSA](/docs/rockchip-android14-sdk/images/keygen-en.png)

Пример создания RSA - Оригинальная иллюстрация;страница PDF 60 (EN).

![Имена файлов ключей](/docs/rockchip-android14-sdk/images/public-key-en.png)

Имена файлов ключей - Оригинальная иллюстрация;страница PDF 60 (EN).

B-2:установите keychain, добавьте eval в ~/.bashrc, войдите заново и введите пароль ключа, если задан. id_rsa — приватный файл. Избегайте sudo/root при обычном использовании, если не понимаете владельца/агент.

```sh
sudo aptitude install keychain
vim ~/.bashrc
# Add to ~/.bashrc:
eval `keychain --eval ~/.ssh/id_rsa`
```

B-3:источник описывает одну идентичность на нескольких разрешённых машинах через безопасное копирование id_rsa в ~/.ssh/id_rsa. Это распространяет один секрет; не передавайте третьим лицам/недоверенным машинам. Неверный ключ даёт ошибку, правильный позволяет clone. При исходном “Agent admitted failture to sign using the key” выполните ssh-add ~/.ssh/id_rsa.

![Ошибка идентичности/аутентификации](/docs/rockchip-android14-sdk/images/wrong-key-en.png)

Ошибка идентичности/аутентификации - Оригинальная иллюстрация;страница PDF 61 (EN).

![Клонирование с верным ключом](/docs/rockchip-android14-sdk/images/clone-success-en.png)

Клонирование с верным ключом - Оригинальная иллюстрация;страница PDF 61 (EN).

```sh
ssh-add ~/.ssh/id_rsa
```

B-4:man ssh_config. Источник копирует системный ssh_config в ~/.ssh/config и задаёт IdentityFile ~/.ssh1/id_rsa. Перед адаптацией сохраните существующий пользовательский config, иначе копия перезапишет настройки.

```text
man ssh_config
cp /etc/ssh/ssh_config ~/.ssh/config
vi .ssh/config
# Relevant ssh_config directive:
IdentityFile ~/.ssh1/id_rsa
```

![Руководство ssh_config](/docs/rockchip-android14-sdk/images/ssh-manual-en.png)

Руководство ssh_config - Оригинальная иллюстрация;страница PDF 62 (EN).

![Другой IdentityFile](/docs/rockchip-android14-sdk/images/ssh-config-en.png)

Другой IdentityFile - Оригинальная иллюстрация;страница PDF 62 (EN).

B-5:сервер может отслеживать загрузки/IP по ключу и отключать права при аномалиях. Храните приватный ключ, не передавайте права третьим лицам. B-6:создайте публичный ключ и отправьте его файл на fae@rock-chips.com для доступа к SDK. Здесь письма, ключи и заявки не создавались.

{% endraw %}
