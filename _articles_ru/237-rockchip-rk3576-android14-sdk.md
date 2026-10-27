---
title: "Полное руководство по разработке Rockchip RK3576 Android 14 SDK"
description: "Полное руководство по разработке Rockchip RK3576 Android 14 SDK — V1.0.0, RKR4, GKI, ADB, DTS, FAQ"
excerpt: "Полное руководство по разработке Rockchip RK3576 Android 14 SDK"
translation_key: "237-rockchip-rk3576-android14-sdk"
slug: "237-rockchip-rk3576-android14-sdk"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "RK3576", "Android14", "SDK"]
---

{% raw %}

# Полное руководство по разработке Rockchip RK3576 Android 14 SDK

Справочный материал для ArmSoM: полное техническое содержание руководства производителя RK3576 Android 14 SDK V1.0.0, а не аппаратно проверенная инструкция прошивки ArmSoM. До адаптации проверьте SoC, схему, DTS, выпуск SDK и разметку накопителя. Аппаратные испытания не проводились; рисунки, рекомендации производительности и примеры источника не являются измерениями ArmSoM. Перед прошивкой и изменением разделов сохраните данные. Идентификаторы кода и исторические примеры сохранены; различия источников и риски указаны в конце.

Блоки кода воспроизводят строки источника, включая переносы PDF, типографские кавычки и тире. Длинные команды/патчи могут быть перенесены; не вставляйте их без проверки. Например, приложение склеивает две команды update-alternatives в `--config javasudo`; отдельно проверьте `sudo update-alternatives --config java` и `sudo update-alternatives --config javac`. Linux_Upgrade_Tool_v2.26 в справочном выводе — старый пример; для RK3576 требуется не ниже 2.30.

## Загрузка и сборка RK3576 Android 14 SDK

### Загрузка исходного кода

#### Адрес загрузки

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml
```

При наличии разрешения Express используйте следующий адрес загрузки:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml
```

#### Загрузка зеркала сервера

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

При наличии разрешения Express используйте следующий адрес:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml --mirror
```

repo — написанный Google на Python скрипт, вызывающий git для загрузки и управления репозиториями Android. Адрес загрузки:

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

Для быстрого получения исходников представитель Rockchip обычно предоставляет исходный архив соответствующего SDK. Например, после получения Rockchip_Android14.0_SDK_RELEASE.tar.gz.* синхронизируйте исходники следующими командами:

```text
mkdir RK3576_Android14.0_SDK_RELEASE
cat RK3576_Android14.0_SDK_RELEASE.tar.gz* | tar -zx -C
RK3576_Android14.0_SDK_RELEASE
cd RK3576_Android14.0_SDK_RELEASE
.repo/repo/repo sync -l
.repo/repo/repo sync -c
```

### Собственный сервер исходников repo

#### Среда

Установите openssh-server для удалённого входа, git для управления проектами и keychain для управления открытыми и закрытыми ключами.

```text
sudo apt-get install openssh-server git keychain
```

#### Настройка gitolite

##### Операции на сервере

В примере адрес сервера — 10.10.10.206.

1. Создайте учётную запись git:

```text
sudo adduser --system --shell /bin/bash --group git
sudo passwd git
```

2. Войдите на сервер под учётной записью git.

3. По исходнику ~/.ssh/authorized_keys должен отсутствовать или быть пустым; не удаляйте действующие ключи доступа без отдельного согласования.

4. Скопируйте открытый ключ администратора сервера в ~/YourName.pub (регистр должен совпадать с последующей командой).

5. Загрузите исходники gitolite.

```text
git clone https://github.com/sitaramc/gitolite.git
```

6. В домашнем каталоге git создайте bin.

```text
mkdir -p ~/bin
```

7. Установите gitolite следующей командой. Способ установки зависит от версии; сверяйтесь с документацией исходников.

```text
gitolite/install -to ~/bin
```

8. Настройте администратора.

```text
~/bin/gitolite setup -pk YourName.pub
```

##### Операции клиента

1. Клонируйте административный репозиторий gitolite с сервера.

```text
git clone ssh://git@10.10.10.206/gitolite-admin.git
```

2. Добавьте открытый ключ пользователя в каталог gitolite.

```text
cp username.pub keydir/username.pub
```

3. Добавьте пользователя-администратора.

```text
vi conf/gitolite.conf
@admin = admin1 admin2 admin3
repo gitolite-admin
RW+     =   @admin
```

#### Создание зеркала repo

##### Операции на сервере

1. Войдите на сервер под git.

2. Загрузите repo в корневой каталог используемой рабочей области.

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

3. Создайте RK_Android14_mirror.

```text
mkdir RK_Android14_mirror
```

4. Перейдите в RK_Android14_mirror.

```text
cd RK_Android14_mirror
```

5. Загрузите зеркало RK Android14 SDK.

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

6. Создайте групповые права репозиториев.

```text
.repo/repo/repo list -n > android_u.conf
sed -i 's/^/@android_t = RK_Android14_mirror\/&/g' android_u.conf
```

##### Операции клиента

1. Скопируйте серверный android_u.conf в gitolite-admin/conf/ на клиенте.

2. Добавьте права группы.

```text
vi conf/android_u.conf
@usergroup = user1 user2 user3
repo @android_u
R   = @usergroup
RW+ = @admin
```

```text
vi conf/gitolite.conf
include "android_u.conf"
```

3. Создайте собственный репозиторий manifests.

```text
vi conf/android_u.conf
@android_u = Android_T/manifests_xxx
```

#### Операции клиента

1. Загрузите manifests_xxx на клиенте; на другом клиентском компьютере клонируйте manifests_xxx.git.

```text
git clone ssh://git@10.10.10.206/Android_u/manifests_xxx.git
```

2. Загрузите исходный репозиторий manifests на клиенте.

```text
git clone ssh://git@10.10.10.206/Android_U/manifests.git
```

3. Добавьте manifest.xml в новый manifest_xxx. Скопируйте файлы исходного manifests в manifests_xxx.

```text
cd manifests_xxx
cp -rf manifests/*.xml manifests_xxx/
```

Проверьте скопированные файлы.

```text
git status

 Android14.xml
 Android14_Express.xml
 default.xml
 include/rk3576_repository.xml
 include/rk_checkout_from_aosp.xml
 include/rk_modules_repository.xml
 remote.xml
 remove_u.xml
 remove_unused.xml
```

Локальная фиксация изменений

```text
git add -A
git commit -m "init xxx"
```

Отправка в удалённую ветвь

```text
git push origin master:master
```

4. Создайте собственный адрес загрузки исходников. Загрузите repo в корневой каталог рабочей области.

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

После указанных действий собственный адрес загрузки выглядит так:

```text
mkdir Android14
cd Android14
~/repo/repo init -u ssh://git@10.10.10.206/Android_U/manifests_xxx.git -m
Android14.xml
```

Здесь //10.10.10.206 — адрес вашего сервера. Эти действия завершают настройку собственного repo-сервера; ссылку можно передать коллегам для совместной работы.

### Управление исходниками

После настройки сервера большинство репозиториев используют стандартные ветви RK. Для собственных изменений отдельных репозиториев следуйте процедуре ниже.

#### Переход на собственные ветви

1. Перейдите в изменяемый репозиторий; пример использует каталог ядра.

```text
cd kernel-6.1
```

2. Создайте и выберите локальную ветвь.

```text
git checkout remotes/m/master -b xxx_branch
```

3. Отправьте xxx_branch на удалённый сервер.

```text
git push rk29 xxx_branch:xxx_branch
```

rk29 — имя remote; его можно дополнить клавишей Tab.

4. В .repo/manifests измените ветвь, указанную в манифесте. Поиск grep kernel помогает найти манифест репозитория ядра.

```text
cd .repo/manifests
```

```text
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
-  <project path="kernel" name="rk/kernel" remote="rk29"
revision="refs/tags/android-14.0-mid-rkr1"/>
+  <project path="kernel" name="rk/kernel" remote="rk29" revision="xxx_branch"/>

   <project path="bootable/recovery/rkupdate"
name="platform/bootable/recovery/rk_update" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
   <project path="bootable/recovery/rkutility"
name="platform/bootable/recovery/rk_utility" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
```

5. Отправьте изменённый манифест в удалённую ветвь.

```text
git add include/rk_modules_repository.xml
git commit -m "change kernel branch on xxx_branch"
git push origin default:master
```

После отправки manifests коллеги смогут синхронизировать исходники ядра из ваших ветвей.

#### Отправка изменений исходников

После перехода на свои ветви фиксируйте изменения в них и отправляйте непосредственно в xxx_branch.

#### Синхронизация исходников RK

1. Синхронизируйте исходники RK на сервере.

```text
cd RK_Android14_mirror
```

```text
.repo/repo/repo sync -c
```

2. На клиенте объедините изменения manifests от RK. Загрузите исходный manifests RK.

```text
git clone //10.10.10.206/wlq/test/manifests.git
```

Сравните manifests RK с собственным manifests_xxx и перенесите изменения: прежде всего теги, добавленные и удалённые репозитории. После проверки отправьте результат в manifests_xxx. Так также определяется, какие репозитории изменены; их объединение выполняется далее.

3. В каталогах с собственными ветвями вручную объедините изменения RK со своими. Пример ядра: просмотрите текущие удалённые ветви.

```text
wlq@wlq:~/home1/test2/kernel-6.1$ git branch -av
* android-11.0-mid-rkr7   0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
  xxx_branch              0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
  remotes/m/master        -> rk29/xxx_branch
  remotes/rk29/xxx_branch 0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
```

Текущая ссылка — remotes/m/master -> rk29/xxx_branch. Создайте локальную ветвь от своей удалённой ветви.

```text
git checkout remotes/m/xxx_branch -b local_xxx_branch
```

Проверьте последний опубликованный RK TAG.

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

В примере последний тег Android14 — android-14.0-mid-rkr1. Объедините его с локальной ветвью.

```text
git merge android-14.0-mid-rkr1
```

Проверьте конфликты и сначала разрешите их. Только после этого отправьте объединённые исходники в удалённую ветвь.

```text
git push rk29 local_xxx_branch:xxx_branch
```

Другие каталоги с собственными ветвями объединяются и отправляются аналогично.

#### Путь исходников ядра

Android14 поддерживает ядро версии 6.1; исходники находятся в kernel-6.1 проекта.

#### Сборка исходников

##### Варианты lunch

| Цель lunch | Совместимый SoC | Описание |
| --- | --- | --- |
| rk3576_u-user | RK3576 | Android 14, аппаратная платформа RK3576; сборка user для производства; поддерживаются 64- и 32-битные приложения. |
| rk3576_u-userdebug | RK3576 | Android 14, аппаратная платформа RK3576; userdebug для разработки и отладки; поддерживаются 64- и 32-битные приложения. |

##### Единая команда сборки

```text
./build.sh -UKAup
（ WHERE: -U = build uboot
       -C = build kernel with Clang
       -K = build kernel
       -A = build android
       -p = will build packaging in IMAGE
       -o = build OTA package
       -u = build update.img
       -v = build android with 'user' or 'userdebug'
       -d = huild kernel dts name
       -V = build version
       -J = build jobs
   ------------you can use according to the requirement, no need to record
uboot/kernel compiling commands------------------
 ）

============================================================
Please remember to set the environment variable before using the one key
compiling command, and select the platform to be compiled, for example:
source build/envsetup.sh
lunch rk3588_t-userdebug
============================================================
```

#### Сводка команд сборки

| Soc | Тип | Эталонная модель | Android | Общая сборка | Сборка ядра | Сборка U-Boot |
| --- | --- | --- | --- | --- | --- | --- |
| RK3576 | EVB | rk3576-evb1-v10 | build/envsetup.sh;lunch rk3576_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |

#### GKI

Чтобы включить GKI (Generic Kernel Image) на RK3576, выполните следующие действия:

```text
wlq@sys2206:~/b0_A14_bringup/device/rockchip/rk3576$ git diff
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
index eb52fb6..f59df62 100755
--- a/rk3576_u/BoardConfig.mk
+++ b/rk3576_u/BoardConfig.mk
```

```text
@@ -14,7 +14,7 @@
 # limitations under the License.
 #
 BUILD_WITH_GO_OPT := false
-BOARD_BUILD_GKI := false
+BOARD_BUILD_GKI := true

 BOARD_GRAVITY_SENSOR_SUPPORT := true
```

При BOARD_BUILD_GKI := false функция A/B автоматически отключается. Подробности: RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》.

#### Другие указания по сборке

##### Android14.0: нельзя напрямую записывать kernel.img и resource.img

Следующая сборка относится только к non-GKI; для GKI см. RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》. В Android14.0 kernel.img и resource.img входят в boot.img. Команда build.sh -AK пересобирает ядро и Android; после неё записывают boot.img из rockdev, но сборка длительная. Для отдельной сборки ядра используйте следующий способ: заменить содержимое ядра и ресурсов в старом boot.img результатами сборки из каталога ядра. Для прототипа RK3576 укажите подходящие boot.img и DTS. BOOT_IMG=../rockdev/Image-rk3576_u/boot.img задаёт путь старого boot.img. Сначала добавьте clang в окружение:

```text
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
```

```text
rk3576:
msk ARCH=arm64 rockchip_defconfig android-14.config rk3576.config && msk
ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576_u/boot.img rk3576-evb1-v10.img -j32
```

После сборки boot.img из kernel-6.1 можно записать в раздел boot устройства. При записи обязательно загрузите таблицу разделов parameter.txt, чтобы не попасть в неправильное место.

#### Запись образов

##### Инструмент записи образов

Для Android14 требуется USB-драйвер DriverAssitant V5.1.1; обновление описано в разделе инструментов. Для RK3576 под Windows требуется инструмент записи версии

3.28 или выше.

```text
RKTools/windows/AndroidTool/AndroidTool_Release_v3.28
```

![Исходный технический рисунок 1](/docs/rockchip-rk3576-android14-sdk/assets/en-p014-figure-01.png)

Инструмент прошивки Linux: для RK3576 требуется Linux Upgrade Tool версии 2.30 или новее. Путь: `RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30`.

Дополнительные сведения приведены в разделе инструментов.

##### Описание образов

Полная сборка создаёт следующие файлы:

```text
rockdev/Image-rk3576_u/
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

Достаточно записать следующие файлы:

```text
rockdev/Image-rk3576_u/
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

Либо можно напрямую записать update.img.

##### Назначение образов

| Образ | Назначение |
| --- | --- |
| boot.img | Содержит ramdis (обозначение источника), kernel и dtb. |
| boot-debug.img | Отличие от boot.img: в сборке user можно записать отладочный загрузочный образ для операций с root. Формулировка источника «этот boot.img» неоднозначна; проверяйте выбранный boot-debug.img. |
| dtbo.img | Наложения Device Tree; см. далее раздел dtbo. |
| config.cfg | Конфигурация инструмента прошивки; загружает необходимые параметры записи. |
| MiniLoaderAll.bin | Загрузчик первого уровня. |
| misc.img | Метка загрузки recovery-wipe; после записи устройство входит в recovery. |
| parameter.txt | Сведения о разделах. |
| pcba_small_misc.img | Метка загрузки PCBA; после записи включается упрощённый режим PCBA. |
| pcba_whole_misc.img | Метка загрузки PCBA; после записи включается полный режим PCBA. |
| recovery.img | Содержит recovery-ramdis (обозначение источника), kernel и dtb. |
| super.img | Содержимое odm, vendor и system; китайская версия дополнительно указывает product и system_ext. |
| trust.img | BL31 и BL32; источник указывает, что для RK3566/RK3568 этот образ не создаётся и не прошивается. Это не утверждение о RK3576. |
| uboot.img | Образ U-Boot. |
| vbmeta.img | Данные проверки AVB. |
| update.img | Пакет перечисленных образов; инструмент может записать пакет целиком. |

#### Generic Kernel Image (GKI)

Для всех продуктов Android14, проходящих сертификацию GMS и EDLA, источник требует GKI. Настройка и сборка описаны в RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf.

#### Запись динамических разделов через fastboot

Новые устройства с R поддерживают динамические разделы; отдельные system/vendor/odm/product/system_ext удалены, записывается super.img. Через fastbootd можно отдельно записывать system/vendor/odm. Требуются актуальные adb/fastboot; SDK содержит собранные инструменты:

```text
RKTools/linux/Linux_adb_fastboot (Linux_x86 version)
RKTools/windows/adb_fastboot (Windows_x86 version)
```

Команды записи динамического раздела:

```text
adb reboot fastboot
fastboot flash vendor vendor.img
fastboot flash system system.img
fastboot flash odm odm.img
```

После входа в fastbootd на экране отображаются сведения об устройстве:

![Исходный технический рисунок 2](/docs/rockchip-rk3576-android14-sdk/assets/en-p016-figure-01.png)

Для обычных, нединамических разделов fastboot используется в bootloader:

```text
adb reboot bootloader
```

Запись GSI:

Разблокируйте устройство и войдите в fastbootd. Достаточно записать system.img от GSI и misc.img прошивки; затем устройство войдёт в recovery для сброса к заводским настройкам. Полный процесс:

1. Перезагрузитесь в bootloader и переведите устройство из lock в unlock:

```text
adb reboot bootloader
fastboot oem at-unlock-vboot ## for the customers already flashing avb public
key, please refer to the corresponding document to unlock.
```

2. Выполните заводской сброс и перезагрузитесь в fastbootd:

```text
fastboot flash misc misc.img
fastboot reboot fastboot  ## now it will enter fastbootd
```

3. Начните запись GSI.

```text
fastboot delete-logical-partition product  ## (optional) for the device with
small partition space, you can execute this command to delete product partition
first and then flash GSI
fastboot flash system system.img
fastboot reboot  ## after flashing successfully, reboot the device
```

Для GSI можно использовать DSU (Dynamic System Updates), включённый на платформе Rockchip по умолчанию. Из-за высокого расхода памяти источник не рекомендует DSU на устройствах с DDR 1G и меньше. Описание: https://source.android.com/devices/tech/ota/dynamic-system-updates. Примечания: для VTS запишите собранный boot-debug.img в boot; для CTS-ON-GSI это не требуется; для тестов используйте опубликованный Google GSI с окончанием -signed.

### Функция DTBO

Android10.0 и новее поддерживают Device Tree Overlays. При разработке для совместимости с несколькими изделиями записывается dtbo.img. Изменения выполняются так:

1. Найдите или задайте файл шаблона:

```text
get_build_var PRODUCT_DTBO_TEMPLATE
```

Пример:

```text
PRODUCT_DTBO_TEMPLATE := $(LOCAL_PATH)/dt-
overlay.in(device/rockchip/rk576/rk3576_u/dt-overlay.in)
```

2. Добавьте или измените нужный узел. Пример:

```text
/dts-v1/;
/plugin/;
```

```text
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

Для успешного наложения DTBO в DTS должен присутствовать соответствующий alias.

### Изменение fstab

1. Найдите или задайте файл шаблона:

```text
get_build_var PRODUCT_FSTAB_TEMPLATE
```

Пример:

```text
PRODUCT_FSTAB_TEMPLATE := device/rockchip/common/scripts/fstab_tools/fstab.in
```

2. Добавьте монтирование раздела, измените swap_zram, формат раздела data и другие параметры.

### Изменение parameter.txt

В Android14 добавлен генератор parameter.txt по конфигурационным параметрам. Если шаблон конфигурации не задан, используется найденный изменённый parameter.txt.

1. Найдите или задайте файл шаблона:

```text
get_build_var PRODUCT_PARAMETER_TEMPLATE
```

Пример:

```text
PRODUCT_PARAMETER_TEMPLATE :=
device/rockchip/common/scripts/parameter_tools/parameter.in
```

2. Настройка размеров разделов, пример:

```text
BOARD_SUPER_PARTITION_SIZE := 2688548864
BOARD_DTBOIMG_PARTITION_SIZE := xxxx
BOARD_BOOTIMAGE_PARTITION_SIZE := xxxxx
BOARD_CACHEIMAGE_PARTITION_SIZE := xxxx
```

3. Без генератора: добавьте parameter.txt в каталог устройства. Пример:

```text
device/rockchip/rk3576/rk3576_u/parameter.txt
```

4. Только генерация parameter.txt инструментом, пример:

```text
parameter_tools --input
device/rockchip/common/scripts/parameter_tools/parameter.in --firmware-version
14.0 --machine-model rk3576 --manufacturer rockchip --machine rk3576_u --
partition-list
uboot_a:4096K,trust_a:4M,misc:4M,dtbo_a:4M,vbmeta_a:4M,boot_a:33554432,backup:30
0M,security:4M,cache:300M,metadata:4096,frp:512K,super:2G --output
parameter_new.txt
```

При OTA-переходе между основными версиями используйте parameter.txt предыдущей версии.

5. Добавление раздела на примере baseparameter. В BoardConfig.mk изделия задайте BOARD_WITH_SPECIAL_PARTITIONS, например: BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M,logo:16M.

```text
device/rockchip/rk3576/rk3576_u/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -494,4 +494,11 @@ ifeq ($(strip $(BOARD_TWRP_ENABLE)), true)
+BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
```

Добавьте BOARD_WITH_SPECIAL_PARTITIONS в RebuildParameter.mk.

```text
device/rockchip/common/build/rockchip/RebuildParameter.mk
+ifneq ($(strip $(BOARD_WITH_SPECIAL_PARTITIONS)), )
+partition_list := $(partition_list),$(BOARD_WITH_SPECIAL_PARTITIONS)
+endif
```

### Общие настройки Android

#### Создание варианта продукта lunch

Для нового продукта rk3576_new_u на базе RK3576 выполните следующие действия.

1. Перейдите в device/rockchip/rk3576.

2. Создайте там каталог rk3576_new_u.

3. Используйте существующий rk3576_u как образец: скопируйте каталог и переименуйте в rk3576_new_u следующей командой.

```text
cp -r rk3576_u rk3576_new_u
```

4. Перейдите в скопированный rk3576_new_u.

5. Во всех файлах rk3576_new_u замените rk3576_u на rk3576_new_u вручную либо инструментом sed. Пример:

```text
sed -i 's/rk3576_u/rk3576_new_u/g' *
```

Команда заменяет все вхождения rk3576_u на rk3576_new_u в файлах каталога rk3576_new_u.

6. Новый каталог rk3576_new_u готов к дальнейшей настройке и разработке.

### Описание DTS ядра

#### DTS нового продукта

Выберите подходящий DTS из следующей таблицы как основу нового продукта.

| Soc | PMIC | Тип | Модель | DTS |
| --- | --- | --- | --- | --- |
| RK3576 | RK806 | EVB | RK3576 EVB1 | rk3576-evb1-v10 |
| RK3576 | RK806 | EVB | RK3576 EVB1 + RK628 | rk3576-evb1-v10-rk628-hdmi2csi |

### Выпуск исправлений

Важные исправления периодически публикуются в Redmine по следующему адресу:

```text
https://redmine.rock-chips.com/projects/rockchip_patch/issues
```

Для уведомлений о новых исправлениях по электронной почте подпишитесь: шаг 1 — войдите в Redmine под учётной записью, зарегистрированной у Rockchip.

Шаг 2 — откройте свой профиль.

![Исходный технический рисунок 3](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-01.png)

Шаг 3 — выберите тип уведомлений. В раскрывающемся списке на рисунке задайте все уведомления для выбранных проектов.

![Исходный технический рисунок 4](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-02.png)

Шаг 4 — выберите проект выпуска исправлений, как показано на рисунке, и сохраните.

![Исходный технический рисунок 5](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-03.png)

После успешной подписки уведомления о публикации исправлений Rockchip приходят на адрес, зарегистрированный в Redmine.

### Описание документации

#### Списки поддерживаемой периферии

Списки DDR/EMMC/NAND FLASH/WIFI/3G/CAMERA постоянно обновляются в Redmine по следующей ссылке:

```text
https://redmine.rockchip.com.cn/projects/fae/documents
```

#### Документация Camera IQ Tool

```text
external/camera_engine_rkaiq/rkisp2x_tuner/doc/
├── Rockchip_Color_Optimization_Guide_ISP2x_CN_v2.0.0.pdf
├── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.0.pdf
└── Rockchip_Tuning_Guide_ISP21_CN_v2.0.0.pdf
```

#### SDK и документация rknn-toolkit2

```text
hardware/rockchip/rknn-toolkit2/doc/
```

#### Состав RKDocs

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
│ ├──
Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Customization_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Samba_CN.pdf
│ ├── Rockchip_Introduction_Android_Widevine_Project_Start_Preparation_CN.pdf
│ ├── Rockchip_Introduction_Box_Media_Application_CN&EN.pdf
│ ├── Rockchip-Parameter-File-Format-Version1.4-CN.pdf
```

```text
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
│ ├──
Rockchip_Developer_Guide_Audio_Call_3A_Algorithm_Integration_and_Parameter_Debugging_CN.pdf
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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

### Использование инструментов

#### StressTest

Stresstest проверяет функции целевого устройства под нагрузкой для оценки стабильности всей системы. В SDK ввод кода 83991906= в калькуляторе запускает StressTest. Основные проверки:

##### Проверки отдельных модулей

Камера: включение/выключение, фотографирование и переключение камер. Bluetooth: включение/выключение. Wi-Fi: включение/выключение; ping и iperf обозначены как планируемые проверки.

##### Прочие проверки

Включение/выключение авиарежима.

Нагрузочные проверки сна/пробуждения, воспроизведения видео, перезагрузки, Recovery и изменения частоты ARM, GPU и DDR.

#### Инструмент проверки PCBA

PCBA помогает быстро выявлять исправные и неисправные функции на производстве. Проверяются LCD, Wi-Fi, Bluetooth, DDR/EMMC, SD, USB HOST, кнопки, динамик/наушники (Codec). Есть автоматические и ручные тесты: Wi-Fi, DDR/EMMC и Ethernet автоматические; кнопки, SD, USB Host и Codec ручные. Настройка и применение описаны в:

```text
RKDocs\android\Rockchip_Developer_Guide_PCBA_Test_Tool_CN&EN.pdf_V1.1_20171222.p
df。
```

#### DeviceTest

DeviceTest проверяет готовое устройство на заводе, прежде всего периферию после сборки. В SDK запускается кодом 000.= в калькуляторе, как показано ниже.

![Исходный технический рисунок 6](/docs/rockchip-rk3576-android14-sdk/assets/en-p030-figure-01.png)

В интерфейсе выберите периферию и нажмите TEST CHECKED для последовательных проверок. При успехе нажмите pass, при неудаче failed; итог отображается на экране. Красным обозначаются неудачные пункты, остальные успешны. Завод может ремонтировать устройство по результатам. Для собственной настройки инструмента запросите исходники у FAE.

#### USB-драйвер

Пакет USB-драйвера Rockchip содержит драйверы ADB и записи образов.

```text
RKTools\windows\DriverAssitant_v5.1.1.zip
```

#### Инструмент записи для разработки

##### Версия Windows

RKTools/windows/AndroidTool/AndroidTool_Release_v3.28.zip. Версия инструмента периодически обновляется; синхронизируйте нужные обновления.

![Исходный технический рисунок 7](/docs/rockchip-rk3576-android14-sdk/assets/en-p031-figure-01.png)

##### Версия Linux

RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30.zip

```text
Linux_Upgrade_Tool_v2.26$ sudo ./upgrade_tool -h
Program Data in /home/wlq/.config/upgrade_tool

---------------------Tool Usage ---------------------
Help:             H
Quit:             Q
Version:          V
Clear Screen:     CS
------------------Upgrade Command ------------------
ChooseDevice:           CD
ListDevice:                 LD
SwitchDevice:           SD
UpgradeFirmware:        UF <Firmware> [-noreset]
UpgradeLoader:          UL <Loader> [-noreset]
DownloadImage:          DI <-p|-b|-k|-s|-r|-m|-u|-t|-re image>
DownloadBoot:           DB <Loader>
EraseFlash:             EF <Loader|firmware> [DirectLBA]
PartitionList:          PL
WriteSN:                SN <serial number>
ReadSN:             RSN
----------------Professional Command -----------------
TestDevice:             TD
```

```text
ResetDevice:            RD [subcode]
ResetPipe:              RP [pipe]
ReadCapability:         RCB
ReadFlashID:            RID
ReadFlashInfo:          RFI
ReadChipInfo:           RCI
ReadSector:             RS  <BeginSec> <SectorLen> [-decode] [File]
WriteSector:            WS  <BeginSec> <File>
ReadLBA:                RL  <BeginSec> <SectorLen> [File]
WriteLBA:               WL  <BeginSec> <File>
EraseLBA:               EL  <BeginSec> <EraseCount>
EraseBlock:             EB <CS> <BeginBlock> <BlokcLen> [--Force]
-------------------------------------------------------
```

#### Инструмент обновления и загрузки с SD

Предназначен для обновления, загрузки и PCBA-проверок с SD-карты.

```text
RKTools\windows\SDDiskTool_v1.74.zip
```

#### Инструмент записи SN

RKTools\windows\RKDevInfoWriteTool-1.3.0.7z. Распакуйте архив, установите и запустите программу с правами администратора.

Инструкция инструмента:

```text
RKDocs\common\RKTools manuals\Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf
```

#### Проверка пайки DDR

Проверяет аппаратные соединения DDR и помогает выявлять дефекты, например непропаянные соединения.

```text
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_CN.7z
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_EN.7z
```

#### Инструмент записи eFuse

Записывает eFuse; указан для RK3288W/RK3368/RK3399.

```text
RKTools\windows\efuse_v1.37.rar
```

#### Инструмент подписи eFuse/OTP

Подписывает образы для eFuse/OTP.

```text
RKTools\windows\SecureBootTool_v1.94.zip
```

#### Инструмент массовой записи на производстве

Предназначен для массовой записи образов на заводе.

```text
RKTools\windows\FactoryTool-1.72.9.7z
```

#### Подготовка предустановленных данных userdata

Создаёт пакет предустановленных данных раздела userdata.

```text
RKTools\windows\OemTool_v1.3.rar
```

#### Camera IQ Tool

Предназначен для настройки изображения ISP.

```text
external/camera_engine_rkaiq/rkisp2x_tuner
```

### Отладка системы

#### Инструмент ADB

#### Обзор

ADB (Android Debug Bridge) из Android SDK управляет эмулятором или физическим устройством: запускает shell, настраивает перенаправление портов, передаёт файлы в обе стороны и устанавливает локальные APK. Это клиент-серверная система; в упрощённом описании источника клиент — ПК, сервер — устройство/эмулятор. По соединению различают сетевой ADB через проводную/беспроводную сеть и USB ADB через кабель.

##### Использование USB ADB

Источник описывает ограничения своего USB ADB: только OTG, без одновременных клиентов вроде cmd/eclipse и только одно подключённое устройство. Это описание конкретного руководства, не универсальное ограничение ADB. Подключение:

1. На работающем Android включите USB debugging в настройках разработчика/подключения к компьютеру.

2. Подключите ПК USB-кабелем к OTG устройства и выполните следующую команду.

```text
adb shell
```

3. Проверьте adb devices. Появление серийного номера подтверждает соединение.

#### Основные команды ADB

(1) Состояние устройства: список подключённых к ПК Android-устройств и эмуляторов:

```text
adb devices
```

Результат содержит серийный номер либо IP/порт и состояние устройства. (2) Установка APK: установка указанного файла на устройство:

```text
adb install <apk file path>
```

Пример:

```text
adb install “F:\WishTV\WishTV.apk”
```

Повторная установка приложения:

```text
adb install –r “F:\WishTV\WishTV.apk”
```

(3) Удаление APK полностью:

```text
adb uninstall <package>
```

Пример:

```text
adb uninstall com.wishtv
```

(4) Удаление файла APK через rm:

```text
adb shell rm <filepath>
```

Пример:

```text
adb shell rm “system/app/WishTV.apk”
```

Пример удаляет WishTV.apk из system/app. (5) Вход в shell устройства или эмулятора:

```text
adb shell
```

(6) Передача файла с ПК на устройство: push копирует файлы или каталоги. local — путь на ПК, remote — путь подключённой через ADB платы. Пример adb push:

```text
adb push “F:\WishTV\WishTV.apk” “system/app”
```

Пример копирует локальный WishTV.apk в Android system/app. (7) Копирование с устройства на ПК: pull загружает файл или каталог на локальный компьютер.

```text
adb pull <remote path> <local path>
```

Пример:

```text
adb pull system/app/Contacts.apk F:\
```

Пример копирует system/app в локальный F:\. (8) Отчёт об ошибках: adb bugreport выводит информацию dumpsys, dumpstate и logcat системы. (9) Информация о системе устройства: команды выполняются в adb shell.

```text
adb shell getprop
```

#### Инструмент Logcat

Android logcat записывает и показывает отладочные сообщения программ в системных буферах. Через Logcat можно просматривать эти данные и состояние выполнения программ. Из-за большого объёма журналов обычно необходима фильтрация.

##### Команда logcat

Просмотр содержимого системного буфера logcat. Основной формат:

```text
[adb] logcat [<option>] [<filter-spec>]
```

Пример:

```text
adb shell
logcat
```

#### Типовая фильтрация logcat

Вывод можно ограничить приоритетом. Пример:

```text
adb shell
logcat *:W
```

Выводятся сообщения уровня warning и выше. Ограничение по тегу и приоритету, пример:

```text
adb shell
logcat ActivityManager:I MyApp:D *:S
```

Смысл показанного фильтра: ActivityManager уровня Info и выше, MyApp уровня Debug и выше; остальные теги подавлены. Английская фраза источника про исключение сформулирована ошибочно. Только определённый тег, пример:

```text
adb shell
logcat WishTV:* *:S
```

или

```text
adb shell
logcat –s WishTV
```

Выводятся только сообщения WishTV. Ограничение одновременно по тегу и приоритету, пример:

```text
adb shell
logcat WishTV:I *:S
```

Выводятся сообщения WishTV уровня I и выше согласно фильтру.

#### Инструмент Procrank

Procrank работает в shell Android и показывает снимок памяти процессов. VSS (Virtual Set Size) — виртуальная память, включая общие библиотеки. RSS (Resident Set Size) — фактическая физическая память, включая общие библиотеки. PSS (Proportional Set Size) — физическая память с пропорциональной долей общих страниц. USS (Unique Set Size) — исключительно собственные физические страницы процесса, без общих библиотек. После завершения процесса USS освобождается целиком. VSS/RSS включают общие библиотеки, поэтому менее показательны для отдельного процесса; PSS распределяет общую память пропорционально.

##### Использование procrank

Перед запуском обеспечьте права root, например через su. Формат команды:

```text
procrank [ -W ] [ -v | -r | -p | -u | -h ]
```

Параметры: -v сортирует по VSS, -r по RSS, -p по PSS, -u по USS; -R меняет направление сортировки; -w показывает только статистику рабочего набора, -W сбрасывает её; -h справка. Пример снимка памяти:

```text
procrank
```

Снимок по убыванию VSS:

```text
procrank –v
```

По умолчанию procrank сортирует по PSS.

##### Поиск конкретных данных

Формат просмотра памяти конкретного процесса:

```text
procrank | grep [cmdline | PID]
```

cmdline — имя приложения, PID — идентификатор процесса. Память systemUI:

```text
procrank | grep “com.android.systemui”
```

или:

```text
procrank  | grep 3396
```

##### Наблюдение за памятью процесса

Для выявления утечек последовательно снимайте память процесса скриптом и сравнивайте USS. Пример отслеживает com.android.systemui:

1. Создайте test.sh.

```text
#!/bin/bash
while true;do
adb shell procrank | grep “com.android.systemui”
sleep 1
done
```

2. После подключения через ADB запустите ./test.sh.

#### Инструмент Dumpsys

Dumpsys работает в shell Android и выводит состояние служб механизма Binder. Условия появления данных:

1. Служба должна быть зарегистрирована в ServiceManager.

2. В коде службы должна быть реализована функция dump; иначе данных не будет.

##### Использование Dumpsys

Просмотр справки dumpsys:

```text
dumpsys  -help
```

Список служб: выводит службы, сведения которых доступны через dumpsys; выберите нужную для отладки.

```text
dumpsys  -l
```

Данные определённой службы: dumpsys [servicename]. Пример для SurfaceFlinger:

```text
dumpsys SurfaceFlinger
```

Данные службы и приложения: dumpsys [servicename] [application name]. Пример meminfo для com.android.systemui:

```text
dumpsys meminfo com.android.systemui
```

Имя службы вводится полностью с учётом регистра.

#### Включение Last log

Добавьте два следующих узла в DTS.

```text
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

```text
- Check last log in the device
130|root@rk3399:/sys/fs/pstore # ls
dmesg-ramoops-0   Log saved after last kernel panic
pmsg-ramoops-0    Log of last user space, android log
ftrace-ramoops-0    Print function trace during some period
console-ramoops-0  kernel log when last_log was enabled last time, but only save
the log with higher priority than default log level
```

Использование:

```text
cat dmesg-ramoops-0
cat console-ramoops-0
logcat -L （pmsg-ramoops-0） pull out by logcat and parse
cat ftrace-ramoops-0
```

#### Режим FIQ

При сбое или зависании через последовательный порт можно подать команды fiq для проверки состояния. Команды:

```text
127|console:/ $ fiq
debug>  help
FIQ Debugger commands:
 pc            PC status
 regs          Register dump
 allregs       Extended Register dump
 bt            Stack trace
 reboot [<c>]  Reboot with command <c>
 reset [<c>]   Hard reset with command <c>
 irqs          Interupt status
 kmsg          Kernel log
 version       Kernel version
 sleep         Allow sleep while in FIQ
 nosleep       Disable sleep while in FIQ
 console       Switch terminal to console
 cpu           Current CPU
 cpu <number>  Switch to CPU<number>
 ps            Process list
 sysrq         sysrq options
 sysrq <param> Execute sysrq with <param>
```

## Типовые вопросы

### Какие версии ядра и U-Boot используются?

Android 14.0 использует ядро версии 6.1 и ветвь U-Boot next-dev.

### Как определить выпуск RK для текущего SDK

Rockchip Android14.0 SDK содержит AOSP и изменения RK. Репозитории RK перечислены в XML каталога .repo/manifests/include, стандартные AOSP — в .repo/manifests/default.xml. Определение версии RK:

```text
vim .repo/manifests/include/rk_checkout_from_aosp.xml
<project groups="pdk" name="platform/build" path="build/make" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1">
```

Это означает RK android-14.0-mid-rkr1. Часть AOSP:

```text
vim .repo/manifests/default.xml
<default revision="refs/tags/android-14.0.0_r11"...>
```

Это означает AOSP android-14.0.0_r11. При запросе достаточно сообщить эти две версии. Тег отдельного репозитория получают следующей командой:

```text
kernel-6.1$ git tag
android-14.0-mid-rkr1
```

Версии RK возрастают по схеме android-14.0-mid-rkrxx; в данном примере последним назван android-14.0-mid-rkr1.

### Как проверить полноту обновления локального SDK до последнего выпуска RK

При выпуске SDK сведения о коммитах сохраняются в .repo/manifests/commit/. Сравнение с ними показывает полноту обновления. Сначала определите версию RK описанным выше способом. Исходник называет пример RKR6; следующая команда сохраняет локальные коммиты.

```text
.repo/repo/repo manifest -r -o release_manifest_rkr1_local.xml
```

Сравните .repo/manifests/commit/commit_release_rkr1.xml с release_manifest_rkr1_local.xml. Источник при этом называет первый файл сведениями RKR6, что противоречит rkr1 в имени и требует проверки выпуска.

### Замена логотипов U-Boot и ядра

U-Boot и ядро показывают первый и второй логотип при загрузке. Файлы: kernel-6.1/logo.bmp и kernel-6.1/logo_kernel.bmp. Замените BMP с сохранением имени и пересоберите ядро; результат входит в boot.img. Источник указывает предел размера изображения 8M и BMP 8/16/24/32bit.

### Как включить только 64-битный Android без 32-битной поддержки

Для Android14 с сертификацией GMS/EDLA источник требует только 64-битную систему без 32-битной поддержки для экономии памяти. Пример rk3562_ugo: измените BoardConfig.mk в каталоге продукта следующим образом.

```text
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

### Зарядка в выключенном состоянии и предварительная зарядка

Настройте зарядку в выключенном состоянии и при низком заряде через DTS:

```text
charge-animation {
                compatible = "rockchip,uboot-charge";
                rockchip,uboot-charge-on = <1>;
                rockchip,android-charge-on = <0>;
                rockchip,uboot-low-power-voltage = <3400>;
                rockchip,screen-on-voltage = <3500>;
                status = "okay";
        };
```

rockchip,uboot-charge-on и rockchip,android-charge-on взаимно исключают друг друга. rockchip,uboot-low-power-voltage задаёт напряжение, при котором после предварительной зарядки разрешена загрузка; rockchip,screen-on-voltage — порог включения экрана. Оба порога выбираются по требованиям устройства.

### Упаковка и замена логотипа зарядки U-Boot

Замените файл логотипа зарядки по указанному пути, сохранив имя и исходный формат.

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

Если зарядка U-Boot включена, но логотип отсутствует, он может быть не включён в resource.img. Упакуйте следующей командой:

```text
cd u-boot
./scripts/pack_resource.sh ../kernel-6.1/resource.img
cp resource.img ../kernel/resource.img
```

Команда добавляет логотип в resource.img каталога ядра. Затем перепакуйте resource.img в boot.img; источник пишет ./mkiamge.sh в корне Android (вероятная опечатка имени, проверить SDK), после чего записывается boot.img из rockdev/.

### Настройка HDMI IN

HDMI IN по умолчанию выключен. Включение:

```text
vim device/rockchip/rk3588/BoardConfig.mk
+BOARD_HDMI_IN_SUPPORT := true
```

### Настройка RM310 4G

4G по умолчанию выключен. Включение:

```text
vim device/rockchip/common/BoardConfig.mk
#for rk 4g modem
-BOARD_HAS_RK_4G_MODEM ?= false
+BOARD_HAS_RK_4G_MODEM ?= true
```

### Политика сна Wi-Fi

По умолчанию Wi-Fi сохраняет соединение во сне. Для отключения во сне используйте следующее:

```text
---
a/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaul
ts.xml
+++
b/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaul
ts.xml
@@ -24,5 +24,5 @@
        You can configure persist.wifi.sleep.delay.ms to delay closing wifi.
        The default is 15 minutes, 0 means that the wifi is turned off
        immediately after the screen is off. -->
-    <integer name="def_wifi_sleep_policy">2</integer>
+    <integer name="def_wifi_sleep_policy">0</integer>
      </resources>
```

### Поворот Recovery

Поддерживаются углы 0/90/180/270 градусов; по умолчанию 0. Настройка:

```text
vim device/rockchip/common/BoardConfig.mk
#0:   ROTATION_NONE rotate 0 degree
#90:  ROTATION_RIGHT rotate 90 degrees
#180: ROTATION_DOWN rotate 180 degrees
#270: ROTATION_LEFT rotate 270 degrees
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

### Поворот Android Surface

Для поворота отображения Android задайте 0/90/180/270 в следующей конфигурации.

```text
# For Surface Flinger Rotation
SF_PRIMARY_DISPLAY_ORIENTATION ?= 0
```

### Замена remote части исходников AOSP

При медленной загрузке выпуска RK источник предлагает зеркало AOSP в Китае или Google для зарубежных клиентов. После repo init либо распаковки базового архива измените remote fetch AOSP в .repo/manifests/remote.xml с:

```text
< remote name="aosp" fetch="./" review="https://10.10.10.29" />
```

на зеркало в Китае, например Tsinghua; можно выбрать другое:

```text
< remote name="aosp" fetch="https://aosp.tuna.tsinghua.edu.cn" />;
```

Для зарубежных клиентов — зеркало Google:

```text
< remote name="aosp" fetch="https://android.googlesource.com" />
```

### Оптимизация чтения и записи data

Для устройств с батареей источник предлагает fsync_mode=nobarrier в параметрах монтирования data в fstab. Это может ускорять ввод-вывод, но создаёт риск повреждения данных, особенно без батареи; для устройств без батареи не рекомендуется. Изменения:

```text
cd device/rockchip/common

diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 2ec6c265..c890cc84 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -23,6 +23,6 @@ ${_block_prefix}odm     /odm      ext4 ro,barrier=1
${_flags},first_stage_mount
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065,fsync_mode=nobarrier
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
diff --git a/scripts/fstab_tools/fstab_go.in b/scripts/fstab_tools/fstab_go.in
index 582557f2..05c7653c 100755
```

```text
--- a/scripts/fstab_tools/fstab_go.in
+++ b/scripts/fstab_tools/fstab_go.in
@@ -17,6 +17,6 @@ ${_block_prefix}odm     /odm      ext4 ro,barrier=1
${_flags},first_stage_mount
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065i,fsync_mode=nobarrie
r latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

### Перевод userdata на EXT4

По умолчанию data использует f2fs. Для изделий без батареи источник рекомендует ext4, чтобы снизить риск потери данных при внезапном отключении. Пример rk3566_r:

```text
device/rockchip/common$ git diff
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 6e78b00..a658332 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -20,6 +20,6 @@ ${_block_prefix}system_ext /system_ext  ext4 ro,barrier=1
${_flags},first_stage_
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
+#/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
-#/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

```text
+/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

```text
device/rockchip/rk356x$ git diff
diff --git a/rk3566_r/recovery.fstab b/rk3566_r/recovery.fstab
index 7532217..cf789ac 100755
--- a/rk3566_r/recovery.fstab
+++ b/rk3566_r/recovery.fstab
@@ -7,7 +7,7 @@
 /dev/block/by-name/odm                   /odm                 ext4
defaults                  defaults
 /dev/block/by-name/cache                 /cache               ext4
defaults                  defaults
 /dev/block/by-name/metadata              /metadata            ext4
defaults                  defaults
-/dev/block/by-name/userdata              /data                f2fs
defaults                  defaults
+/dev/block/by-name/userdata              /data                ext4
defaults                  defaults
 /dev/block/by-name/cust                  /cust                ext4
defaults                  defaults
 /dev/block/by-name/custom                /custom              ext4
defaults                  defaults
 /dev/block/by-name/radical_update        /radical_update      ext4
defaults                  defaults
```

### Анимация и звук включения/выключения

Справочный документ:

```text
RKDocs\android\Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Cus
tomization_CN&EN.pdf
```

### Режим производительности приложений

В device/rockchip/rk3xxx/package_performance.xml добавьте в узел имена пакетов, которым нужен режим производительности. Имя пакета получают через aapt dump badging (file_path.apk).

```text
< app package="package name" mode="whether to enable the acceleration, 1 for
enable, 0 for disable"/>
```

Пример antutu:

```text
< app package="com.antutu.ABenchMark"mode="1"/>
< app package="com.antutu.benchmark.full"mode="1"\/>
< app package="com.antutu.benchmark.full"mode="1"\/>
```

При сборке файл включается в образ.

### Отладка проблем GPU

Для первичной диагностики используйте следующие документы.

```text
RKDocs\android\Rockchip_User_Guide_Dr.G_CN&EN.pdf
```

### OTP и eFuse

Перечень OTP в источнике: RK3326, PX30, RK3566, RK3568, RK3588, RK3568S. Перечень eFuse: RK3288, RK3368, RK3399. Подпись образов и запись OTP/eFuse описаны в:

```text
RKDocs\common\security\Rockchip-Secure-Boot-Application-Note-V1.9.pdf
```

### Как определить программно, записан ли OTP/eFuse устройства

Состояние передаётся через fuse.programmed в cmdline ядра. fuse.programmed=1: прошивка подписана Secure Boot и OTP/eFuse устройства записан. fuse.programmed=0: прошивка подписана, но OTP/eFuse ещё не записан. Параметр отсутствует: прошивка не подписана и Miniloader не передаёт его либо Miniloader слишком стар и не поддерживает передачу.

### Включение/отключение SELinux

В следующей настройке false отключает, true включает SELinux. Отключение — только контролируемая отладка, не производственная рекомендация.

```text
device/rockchip/common$
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -67,7 +67,7 @@ endif

 # Enable android verified boot 2.0
 BOARD_AVB_ENABLE ?= false
-BOARD_SELINUX_ENFORCING ?= false
+BOARD_SELINUX_ENFORCING ?= true
```

### Предупреждение «There's an internal problem with your device.» после загрузки

Источник называет две причины предупреждения:

1. Несовместимые образы: fingerprints system/boot/vendor не совпадают.

2. Включена конфигурация отладки IO. Используйте ранее описанный способ сборки ядра.

3. Для проектов с отладкой IO источник дополнительно предлагает следующий патч независимо от этих причин. Он устраняет предупреждение, но сам по себе не исправляет несовместимость образов.

```text
diff --git
a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
index 595c340..d4e495a 100644
---
a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
+++
b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
@@ -6555,7 +6555,7 @@ public class ActivityTaskManagerService extends
IActivityTaskManager.Stub {
                 } catch (RemoteException e) {
                 }

-                if (!Build.isBuildConsistent()) {
+                if (0 && !Build.isBuildConsistent()) {
                     Slog.e(TAG, "Build fingerprint is not consistent, warning
user");
                     mUiHandler.post(() -> {
                         if (mShowDialogs) {
```

### Как включить параметры Ethernet в Settings

По умолчанию Settings не показывает настройку Ethernet. Если она нужна, включите её следующим образом:

```text
  --- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -146,3 +146,6 @@ endif
 ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
 DEVICE_MANIFEST_FILE :=
device/rockchip/$(TARGET_BOARD_PLATFORM)/manifest_ab.xml
 endif

+# for ethernet
+BOARD_HS_ETHERNET := true
```

### AVB и Secure Boot

Описание и настройка AVB/Secure Boot приведены в документе:

```text
RKDocs/common/security/RK356X_SecurityBoot_And_AVB_instructions_CN.pdf
```

### Команды IO недоступны

IO-команды зависят от DEVMEM, отключённого по умолчанию. Для контролируемой отладки выполните следующие изменения:

```text
wlq@ubuntu:~/rk3562_Android14.0/$ vim mkcombinedroot/configs/android-14.config
```

Для продуктов GO также измените:

```text
wlq@ubuntu:~/rk3562_Android14.0$ vim mkcombinedroot/configs/android-14-go.config
```

Удалите следующую строку конфигурации:

```text
# CONFIG_DEVMEM is not set
```

При сборке Android также требуется следующее изменение кода.

```text
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
diff --git a/u/android-6.1/android-base.config b/u/android-6.1/android-
base.config
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

### Правила серийного номера SN

SN должен начинаться с буквы и занимать не более 14 байт.

### Ошибка LZ4 при сборке ядра

Пример журнала ошибки:

![Исходный технический рисунок 8](/docs/rockchip-rk3576-android14-sdk/assets/en-p050-figure-01.png)

Причина: слишком старая системная LZ4; требуется версия 1.8.3 или новее.

```text
wlq@ubuntu:~$ lz4 -v
*** LZ4 command line interface 64-bits v1.8.3, by Yann Collet ***
refusing to read from a console
```

Источник предлагает заменить системную LZ4 вариантом, собранным Android. Перед заменой системного инструмента проверьте пути и сохраните рабочую версию.

```text
sudo cp out/host/linux-x86/bin/lz4 /usr/bin/lz4
```

### Android Samba

Справочный файл:

```text
RKDocs/android/Rockchip_Introduction_Android_Samba_CN.pdf
```

### Загрузка NFS

Документы и патчи:

```text
RKDocs/android/patches/customized_functions/nfs_boot_patch_v1.1.0.zip
```

### Обновление RK3528 DDR 4BIT Loader

```text
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

### Несколько экранов и сенсорный ввод

Справочный документ:

```text
RKDocs\android\patches\customized_functions/Android11异显开发说明.zip
```

### Раздельный звук для разных экранов

Справочный документ:

```text
RKDocs/android/patches/customized_functions/Dual_Audio_v1.0.zip
```

## Приложение A. Настройка среды сборки и разработки

### Подготовка среды сборки

Раздел описывает локальную среду сборки исходников Android и представляет историческую справку исходника. Указаны Linux или Mac OS; сборка под Windows не поддерживается. Общий процесс проверки и обновления кода описан в Life of a Patch. Знак $ перед командами означает приглашение shell и не вводится. Исходный веб-текст предлагает Click to copy или тройной щелчок для копирования без $; эти элементы не являются функцией данной статьи.

### Выбор ветви

Часть требований зависит от собираемой версии. Список ветвей указан в Build Numbers. Для последней ветви, называемой в исходнике master, при repo init опускается выбор ветви. После выбора подготовьте соответствующую среду по указаниям ниже.

### Среда сборки Linux

Исторические инструкции применяются к перечисленным ветвям, включая master. Источник сообщает о тестировании на Ubuntu LTS 14.04 и Debian testing; в других дистрибутивах нужны соответствующие инструменты. Gingerbread 2.3.x и новее требуют 64-битную среду; более старые версии могли собираться в 32-битной. Полные требования находятся в Requirements, далее приведены инструкции для Ubuntu/Mac OS. Это не современная рекомендация Ubuntu14.04 для Android14.

### Установка JDK

В AOSP master готовый OpenJDK расположен в prebuilts/jdk/ и отдельно не устанавливается. Старые Android требуют отдельный JDK; для Ubuntu указан OpenJDK. Версии см. JDK Requirements. Для Ubuntu >=15.04 источник предлагает:

```text
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

Ubuntu LTS 14.04: поддерживаемых пакетов OpenJDK8 нет. Исходник сообщает, что пакеты Ubuntu15.04 работали на14.04, а более новые15.10/16.04 с этим способом не работали.

1. Загрузите 64-битные .deb с old-releases.ubuntu.com:

```text
openjdk-8-jre-headless_8u45-b14-1_amd64.deb with SHA256
0f5aba8db39088283b51e00054813063173a4d8809f70033976f83e214ab56c0
openjdk-8-jre_8u45-b14-1_amd64.deb with SHA256
9ef76c4562d39432b69baf6c18f199707c5c56a5b4566847df908b7d74e15849
openjdk-8-jdk_8u45-b14-1_amd64.deb with SHA256
6e47215cf6205aa829e6a0a64985075bd29d1f428a4006a80c9db371c2fc3c4c
```

2. При желании сравните контрольные суммы файлов с указанными SHA256, например через sha256sum:

```text
sha256sum {downloaded.deb file}
```

3. Установите пакеты:

```text
sudo apt-get update
```

Выполните dpkg для каждого .deb. Возможны ошибки отсутствующих зависимостей:

```text
sudo dpkg -i {downloaded.deb file}
```

Исправление отсутствующих зависимостей:

```text
sudo apt-get -f install
```

Необязательно: обновите Java по умолчанию для указанных Ubuntu следующей командой.

```text
sudo update-alternatives --config javasudo update-alternatives --config javac
```

При ошибке версии Java во время сборки см. Wrong Java version. Историческая установка обязательных пакетов для Ubuntu14.04 требует 64-битную Ubuntu; рекомендация14.04 относится к исходному старому приложению.

```text
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl
zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-
core-dev libx11-dev lib32z-dev ccache libgl1-mesa-dev libxml2-utils xsltproc
unzip python-pyelftools python3-pyelftools device-tree-compiler libfdt-dev
libfdt1
```

Для анализа политик SELinux также нужен python-networkx. При LDAP и ART host tests также установлен libnss-sss:i386.

### Настройка доступа USB

В GNU/Linux, в частности Ubuntu, обычным пользователям по умолчанию может быть недоступен USB. Исходник предлагает от root создать /etc/udev/rules.d/51-android.rules со следующими строками, заменив обозначение пользователя фактическим разрешённым именем.

```text
# adb protocol on passion (Rockchip products)
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", ATTR{idProduct}=="0010", MODE="0600",
OWNER="<username>"
```

Правила действуют при следующем подключении устройства, поэтому переподключите USB. Источник указывает проверку на Ubuntu Hardy Heron8.04.x LTS и Lucid Lynx10.04.x LTS; другие системы могут требовать иной настройки. Историческая ссылка: http://source.android.com/source/initializing.html.

## Приложение B. Операции с открытым ключом SSH Инструкция

### B-1. Создание открытого ключа SSH

Команда генерации:

```text
ssh-keygen -t rsa -C "user@host"
```

Замените user@host своим адресом электронной почты.

![Исходный технический рисунок 9](/docs/rockchip-rk3576-android14-sdk/assets/en-p054-figure-01.png)

После успешного выполнения в вашем каталоге появятся файлы ключей.

![Исходный технический рисунок 10](/docs/rockchip-rk3576-android14-sdk/assets/en-p054-figure-02.png)

Берегите закрытый id_rsa и пароль; администратору сервера SDK отправляется только открытый id_rsa.pub.

### B-2. Управление ключами через keychain

Источник рекомендует простой инструмент keychain. Порядок:

1. Установите пакет keychain.

```text
$sudo aptitude install keychain
```

2. Настройте использование ключа.

```text
$vim ~/.bashrc
```

Добавьте следующую команду:

```text
eval `keychain --eval ~/.ssh/id_rsa`
```

id_rsa — имя закрытого ключа. После настройки повторно войдите в консоль; при запросе введите пароль, заданный при создании ключа, если он есть. Не используйте sudo/root без понимания последствий,

иначе возникают проблемы с правами и управлением ключами.

### B-3. Один открытый SSH-ключ на нескольких устройствах Общий ключ

Исторический способ источника — скопировать закрытый id_rsa в ~/.ssh/id_rsa другого доверенного устройства. Это увеличивает область риска; защищайте передачу и права. При неверном закрытом ключе появляется следующая ошибка; замените его правильным.

![Исходный технический рисунок 11](/docs/rockchip-rk3576-android14-sdk/assets/en-p055-figure-01.png)

После добавления правильного ключа git может клонировать исходники:

![Исходный технический рисунок 12](/docs/rockchip-rk3576-android14-sdk/assets/en-p055-figure-02.png)

При добавлении закрытого SSH-ключа возможна следующая ошибка:

```text
Agent admitted failture to sign using the key
```

Для исправления источник приводит следующую команду консоли.

```text
ssh-add ~/.ssh/id_rsa
```

### B-4. Переключение SSH-ключей на одном устройстве

Настройте SSH согласно документации ssh_config.

```text
~$ man ssh_config
```

![Исходный технический рисунок 13](/docs/rockchip-rk3576-android14-sdk/assets/en-p056-figure-01.png)

Следующие команды настраивают SSH текущего пользователя.

```text
~$ cp /etc/ssh/ssh_config ~/.ssh/config
~$ vi .ssh/config
```

Пример задаёт альтернативный закрытый ключ ~/.ssh1/id_rsa, позволяя выбирать разные ключи.

![Исходный технический рисунок 14](/docs/rockchip-rk3576-android14-sdk/assets/en-p056-figure-02.png)

### B-5. Управление правами ключей

Сервер отслеживает число загрузок, IP и другие сведения по ключу. При аномалиях право загрузки соответствующего ключа может быть запрещено. Защищайте закрытый ключ и не передавайте полномочия третьим лицам.

### B-6. Заявка на доступ Git

Создайте открытый ключ описанным выше способом и передайте его через согласованный канал FAE для запроса доступа к исходникам SDK; контактный адрес исходника удалён.

## Различия источников и проверки перед применением

Оба источника имеют V1.0.0, контекст выпуска Android 14 RKR4. Китайский документ 789 содержит 53 страницы, английский 790 — 57. Техническая часть, FAQ и приложения A/B сохранены. Китайская статья использует китайские рисунки; английская, русская и немецкая — английские, без изменения исходных надписей интерфейса.

- Китайские примеры синхронизации/слияния используют `android-14.0-mid-rkr4`, английские — ещё `android-14.0-mid-rkr1`; вывод истории тегов также различается. Ниже дана китайская команда RKR4. В последующем FAQ смешаны описания и имена файлов RKR1/RKR6; это не основание смешивать выпуски SDK.
- Китайская таблица lunch указывает DTS по умолчанию `rk3576-evb1-v10.dts`, пропущенный в английской. Китайская справка заканчивается `lunch rk3576_u-userdebug`, английская — посторонним `lunch rk3588_t-userdebug`. Китайский общий пример: `./build.sh -UKAup`; в таблице отдельно дан `./build.sh -AUCKu`. Проверяйте регистр и параметры по скрипту конкретного выпуска.
- Китайский текст прямо говорит: GKI по умолчанию выключен; патч меняет `BOARD_BUILD_GKI := false` на `true`, включение автоматически активирует A/B. Английский патч совпадает, но следующий текст описывает выключение A/B значением false. False не включает GKI. Китайский super.img содержит odm, vendor, system, product, system_ext; английский перечисляет лишь первые три. Проверяйте конфигурацию разделов продукта.
- Отключение 32-битной поддержки: китайский патч относится к `rk3576_u/BoardConfig.mk`; английский оставляет `rk3562_ugo/BoardConfig.mk` и `rk3562-rk817-tablet-v10`. Исходный пример сохранён, ниже добавлен китайский патч RK3576. Не применяйте пути RK3562 к RK3576 без проверки.
- Английский исторический список OTP дополнительно содержит RK3568S. Ни один список не подтверждает поддержку RK3576. Исключение RK3566/RK3568 для trust.img также не относится автоматически к RK3576. ramdis — написание источника; строка boot-debug.img неоднозначно говорит «этот boot.img»: проверяйте отладочный образ.
- `logcat ActivityManager:I MyApp:D *:S` пропускает только эти теги с указанным или более высоким приоритетом, подавляя остальные, а не исключает эти теги. `WishTV:I` включает I и выше, не только I. Описание ADB с одним клиентом/хостом — модель использования источника, не универсальное ограничение протокола.
- `mkiamge.sh`, Android_T/Android_U, `@android_t`/`@android_u` и старые метки ветвей могут быть устаревшими примерами. Сверяйте SDK; идентификаторы не исправлены молча. Подавление предупреждения совместимости не устраняет несовместимость образов.
- Ubuntu 14.04, OpenJDK 8 и master в приложении A — исторический материал, не современные требования Android 14. Приоритет имеют основная часть SDK и требования выпуска. F2FS `fsync_mode=nobarrier` создаёт риск потери данных при отключении питания даже с аккумулятором; EXT4 также не даёт абсолютной гарантии.
- Прошивка, переразметка и сброс могут удалить данные. Сделайте копию, проверьте плату, образы и разделы. Запись OTP/eFuse может быть необратимой. Примеры копирования закрытого SSH-ключа, authorized_keys и прав выполняйте только в разрешённой среде: не очищайте действующие файлы авторизации и не раскрывайте закрытые ключи/пароли. Для доступа передавайте только открытый ключ.


### Дополнение по китайскому источнику: слияние RKR4 и 64-битная конфигурация RK3576

```text
git merge android-14.0-mid-rkr4
```

```diff
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
index c06433e..dc9cc50 100644
--- a/rk3576_u/BoardConfig.mk
+++ b/rk3576_u/BoardConfig.mk
@@ -18,3 +18,11 @@ PRODUCT_KERNEL_DTS := rk3576-evb1-v10
 CAMERA_SUPPORT_AUTOFOCUS := true
 BOARD_BUILD_GKI := true
 include device/rockchip/rk3576/rk3576_u/BoardConfig.mk
+
+DEVICE_IS_64BIT_ONLY := true
+
+TARGET_2ND_ARCH :=
+TARGET_2ND_ARCH_VARIANT :=
+TARGET_2ND_CPU_ABI :=
+TARGET_2ND_CPU_ABI2 :=
+TARGET_2ND_CPU_VARIANT :=
```

Официальная документация: [Rockchip](https://www.rock-chips.com/) · [Android](https://source.android.com/) · [ArmSoM](https://docs.armsom.org/).

{% endraw %}
