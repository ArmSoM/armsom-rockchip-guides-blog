---
title: "Rockchip Android14 SDK：源码、编译、烧录与配置"
description: "Rockchip Android14 SDK：源码、编译、烧录与配置"
excerpt: "Rockchip Android14 SDK：源码、编译、烧录与配置"
translation_key: "245-rockchip-android14-sdk"
slug: "245-rockchip-android14-sdk"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM","Rockchip","Android"]
---

{% raw %}

# Rockchip Android14 SDK：源码、编译、烧录与配置

来源：Rockchip Android14.0 SDK开发指南，中文RK-KF-YF-776（58页）、英文RK-KF-YF-777（63页），均为V1.4.0。以中文技术正文为主线，并列英文独有内容和冲突。原稿硬件支持声明针对Rockchip开发平台，不是ArmSoM实测。命令为保留的文档示例，未执行。烧录、分区变更、熔丝编程和代码发布须针对目标审查、备份并获得授权。历史链接及“最新”表述不代表已核验当前可用性。

## 支持芯片

| 芯片 | 支持 | SDK版本 |
| --- | --- | --- |
| RK3562 | 支持 | RKR1 |
| RK3568 | 支持 | RKR2 |
| RK3566 | 支持 | RKR2 |
| RK3326 | 支持 | RKR2 |
| PX30 | 支持 | RKR3 |
| RK3326-S | 支持 | RKR3 |
| PX30-S | 支持 | RKR3 |
| RK3588 | 支持 | RKR4 |
| RK3588S | 支持 | RKR4 |
| RK3399 | 支持 | RKR5 |

两稿支持表均将RK3326列为RKR2，而发布历史的技术说明将RK3326/RK3326-S/PX30/PX30-S列入RKR3，保留此矛盾。RKR1增加RK3562，RKR2增加RK3566/RK3568，RKR4增加RK3588/RK3588S，RKR5增加RK3399。

## 下载SDK源码

初始化普通manifest；申请Express权限则用Express manifest。服务器镜像增加--mirror。repo是Google用Python编写的Git包装脚本，用于下载管理Android仓库。Rockchip技术窗口可提供初始分卷压缩包加速获取，解压后先本地同步，再远端同步当前分支。

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

## 自建repo服务器：环境和Gitolite

安装openssh-server远程登录、git管理仓库、keychain管理密钥，示例服务器10.10.10.206。新建专用git账户并登录；原稿要求该账户~/.ssh/authorized_keys为空或不存在，不应删除既有账户访问密钥，应使用全新专用账户并先审查权限。将管理员公钥复制到~/YourName.pub，克隆Gitolite、新建~/bin、安装并设置管理员。不同Gitolite版本安装不同，参照对应源码文档。

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

客户端克隆gitolite-admin，将用户公钥复制到keydir，编辑conf/gitolite.conf定义管理员组并给gitolite-admin授予RW+。

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

## 建立仓库镜像

服务器以git登录，在工作根目录下载repo，新建并进入RK_Android14_mirror，初始化镜像并生成仓库组权限。客户端将android_u.conf复制到gitolite-admin/conf/，加入用户/管理员权限，在gitolite.conf中include，并登记自有manifest仓库。中文用@android_u及android_u.conf，英文sed却用@android_t，复制说明写android_r.conf；这些是原稿冲突，不可互换。

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

## 发布自有manifest

客户端克隆新旧manifest仓库，将原始文件复制到manifests_xxx，检查git status，本地提交并推送master。新建Android14，用自有链接初始化repo，即可与同事共享。原稿混用Android_T、Android_u、Android_U；cd manifests_xxx之后的复制路径须核实实际工作目录。须保留include/等子目录，所示*.xml复制本身不会复制它们。下方是原稿示例，并未在本任务执行。

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

## 自有分支及代码修改

多数仓库仍用RK默认分支。需修改时进入对应目录（例kernel-6.1），从remotes/m/master建立xxx_branch并推到rk29（可Tab补全remote）。在.repo/manifests搜索kernel定位XML，将revision改为xxx_branch。提交推送manifest后，同事即可同步自有分支；后续修改在该分支提交并直接推送xxx_branch。diff内kernel路径和android-1s.0标签是原稿历史字面值，不擅自改写。

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

## 同步RK更新

先在服务器同步镜像。客户端取得RK原始manifests，与manifests_xxx比较合并tag更新和增删仓库，审查后推送，并识别自有分支仓库。每个仓库查看远端分支，从自有远端建立本地分支，检查RK标签，合并目标版本，解决全部冲突再推送产品分支；其它分支仓库同样处理。样例含Android10/11并在当时称android-14.0-mid-rkr1“最新”，不改变本文RKR5版本范围。所示remotes/m/xxx_branch与输出的remotes/m/master别名不同，使用前核实实际refs。Kernel6.1源码位于kernel-6.1/。

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

## Lunch目标

下列目标均为Android14，默认启用GKI，仅支持64位。user用于生产，userdebug用于开发调试；原描述与后缀矛盾处单列。GO/2GB和硬件说明按各行保留，不凭名称推断。

| 目标 | 芯片 | 硬件/配置 | 用途 |
| --- | --- | --- | --- |
| rk3588_u-user | RK3588 | 开发板 | 生产/user |
| rk3588_u-userdebug | RK3588 | 开发板 | 开发/userdebug |
| rk3588s_u-user | RK3588S | 开发板 | 生产/user |
| rk3588s_u-userdebug | RK3588S | 开发板 | 开发/userdebug |
| rk3562_u-user | RK3562 | 开发板 | 生产/user |
| rk3562_u-userdebug | RK3562 | 开发板 | 开发/userdebug |
| rk3562_ugo-user | RK3562 | 2GB，启用GO | 生产/user |
| rk3562_ugo-userdebug | RK3562 | 2GB，启用GO | 开发/userdebug |
| rk3566_ugo-user | RK3566 | 2GB，启用GO | 生产/user |
| rk3566_ugo-userdebug | RK3566 | 2GB，启用GO | 开发/userdebug |
| rk3566_u-user | RK3566 | 开发板 | 生产/user |
| rk3566_u-userdebug | RK3566 | 开发板 | 开发/userdebug |
| rk3568_u-user | RK3568 | 开发板 | 生产/user |
| rk3568_u-userdebug | RK3568 | 开发板 | 开发/userdebug |
| rk3326_ugo-userdebug | RK3326/RK3326-S | 开发板 | 开发/userdebug |
| rk3326_ugo-user | RK3326/RK3326-S | 2GB，启用GO | 生产/user |
| rk3326_u-userdebug | RK3326/RK3326-S | 开发板 | 开发/userdebug |
| rk3326_u-user | RK3326/RK3326-S | 开发板；中文称启用GO | 生产/user |
| PX30_u-userdebug | PX30/PX30-S | 开发板 | 中文称user/生产；英文称userdebug/开发 |
| PX30_u-user | PX30/PX30-S | 开发板 | 生产/user |
| rk3399_u-userdebug | RK3399 | 中文：行业板与挖掘机；英文：开发板 | 中文：user/生产；英文：userdebug/开发 |
| rk3399_u-user | RK3399 | 中文：行业板与挖掘机；英文：开发板 | 生产/user |

rk3326_ugo-userdebug英文另明确2GB并启用GO，中文只描述EVB；rk3326_u-user英文未含中文启用GO说明。英文PX30硬件描述写X30，而芯片列写PX30。保留差异，不擅自统一。

## 一键编译

编译前设置环境并选择平台；中文为rk3588_u-userdebug，英文却为旧rk3588_t-userdebug，保留版本不一致说明。

```sh
source build/envsetup.sh
lunch rk3588_u-userdebug
./build.sh -UKAup
```

| 选项 | 含义 |
| --- | --- |
| -U | 编译U-Boot |
| -C | Clang编译内核 |
| -K | 编译内核 |
| -A | 编译Android |
| -p | 打包IMAGE |
| -o | 生成OTA包 |
| -u | 生成update.img |
| -v | Android user/userdebug类型 |
| -d | 内核DTS名 |
| -V | 构建版本 |
| -J | 并发数 |

## 平台编译命令

原表Android列前缀为build/envsetup.sh;lunch（上方实际环境设置用source）。常规一键/内核/U-Boot命令为./build.sh -AUCKu、./build.sh -K、./build.sh -U；RK3399的U-Boot用./make.sh rk3399。英文命令汇总另有中文表缺少的RK3588/RK3588S两行。

| 芯片 | 类型 | 参考机型 | Lunch目标 | 完整编译 | 内核 | U-Boot |
| --- | --- | --- | --- | --- | --- | --- |
| RK3588 | EVB（英文补充） | rk3588-evb1-lp4-v10 | rk3588_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3588S | 平板（英文补充） | 平板 | rk3588s_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3562 | 开发板 | rk3562-evb1-lp4x-v10 | rk3562_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3562 | 平板 | 样机 | rk3562_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3566 | 平板 | 样机 | rk3566_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3566 | 开发板 | EVB2-LP4X-V10 | rk3566_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3568 | 开发板 | EVB1-DDR4-V10 | rk3568_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3326/RK3326-S | 开发板 | EVB-V12 | rk3326_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3326/RK3326-S | 样机 | 平板 | rk3326_ugo-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| PX30/PX30-S | 开发板 | MINI EVB | PX30_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |
| RK3399 | 行业开发板 | rk3399-evb-ind-lpddr4-v13-android-avb | rk3399_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./make.sh rk3399 |
| RK3399 | 挖掘机 | rk3399-sapphire-excavator-edp-avb | rk3399_u-userdebug | ./build.sh -AUCKu -d rk3399-sapphire-excavator-edp-avb | ./build.sh -K -d rk3399-sapphire-excavator-edp-avb | ./make.sh rk3399 |

## GKI与非GKI编译

中文称RK3566/RK3568/RK3562 SDK默认GKI和A/B；英文此段只列RK3562，尽管其lunch表对更多芯片列GKI。设置BOARD_BUILD_GKI=false关闭GKI并自动关闭A/B，补丁如下。GKI内核/KO流程见RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf。

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

以下仅适用非GKI。Android14的kernel.img/resource.img位于boot.img，不能单独烧录。./build.sh -AK重编内核及Android后烧rockdev的boot.img，但较慢。单编内核将新kernel.img/resource.img替换进匹配旧boot.img。RK3562说明用Image-rk3562_u/boot.img，原命令却为Image-rk3562_t/boot.img，应核实基础镜像与DTS。先导入parameter.txt，再将生成的kernel-6.1/boot.img烧到boot，避免偏移错误。

```sh
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
msk ARCH=arm64 rockchip_defconfig android-14.config rk356x.config && msk ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3562_t/boot.img rk3562-evb1-lp4x-v10.img -j32
```

## 烧录工具和产物

![原稿烧录工具界面](/docs/rockchip-android14-sdk/images/flash-tool.png)

原稿烧录工具界面 - 原稿技术图；PDF页 16 (CN).

Android14要求DriverAssitant V5.1.1。原稿列Windows AndroidTool_Release_v3.28、Linux_Upgrade_Tool_v2.30，并提醒同步工具；这是文档版本，不代表当前最新版本核验。完整编译生成第一棵目录树，烧录第二棵列出的子集，或直接烧完整update.img。

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

| 文件 | 含义 |
| --- | --- |
| boot.img | ramdisk、kernel、DTB |
| boot-debug.img | user固件可用其获得root操作 |
| dtbo.img | Device Tree Overlays，见DTBO节 |
| config.cfg | 导入烧录工具显示待烧选项 |
| MiniLoaderAll.bin | 一级loader |
| misc.img | recovery-wipe启动标记，烧后进入recovery |
| parameter.txt | 分区信息 |
| pcba_small_misc.img | PCBA标记，进入简易PCBA模式 |
| pcba_whole_misc.img | PCBA标记，进入完整PCBA模式 |
| recovery.img | recovery ramdisk、kernel、DTB |
| super.img | 中文：odm/product/vendor/system/system_ext；英文仅列odm/vendor/system |
| trust.img | BL31/BL32；RK3566/RK3568不生成也不烧录 |
| uboot.img | U-Boot固件 |
| vbmeta.img | AVB校验信息 |
| update.img | 所需镜像完整烧录包 |

原稿称Android14通过GMS/EDLA认证须使用GKI，参见RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf；保留为历史认证说明。

## 动态分区、fastbootd与GSI

R代新设备使用动态分区，替代独立物理system/vendor/odm/product/system_ext，烧录super.img。单刷out/内逻辑镜像须用fastbootd和足够新的adb/fastboot。SDK工具为RKTools/linux/Linux_adb_fastboot（Linux_x86）、RKTools/windows/adb_fastboot（Windows_x86）。fastbootd显示设备信息；非动态分区则进入bootloader。

```sh
adb reboot fastboot
fastboot flash vendor vendor.img
fastboot flash system system.img
fastboot flash odm odm.img

# Non-dynamic partitions
adb reboot bootloader
```

![fastbootd设备界面](/docs/rockchip-android14-sdk/images/fastbootd.png)

fastbootd设备界面 - 原稿技术图；PDF页 18 (CN).

GSI流程：按需解锁、进入fastbootd，烧GSI system.img及固件misc.img，随后recovery恢复出厂。解锁、烧misc和可选删除product可能破坏数据，先备份并核实目标。已烧AVB公钥的客户须按对应文档解锁，不能假定通用命令适用。空间不足时原稿可选先删逻辑product分区再烧GSI。

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

DSU（Dynamic System Updates）也可加载GSI，原稿平台默认支持；内存消耗较大，不建议1GB DDR及以下设备使用。参考https://source.android.com/devices/tech/ota/dynamic-system-updates。VTS还须将编译的boot-debug.img烧boot，CTS-ON-GSI不需要；测试用Google官方以-signed结尾的GSI。

## DTBO

Android10及以上支持Device Tree Overlays，烧dtbo.img实现多产品兼容。查找/指定PRODUCT_DTBO_TEMPLATE后增改节点，DTS必须有alias否则overlay失败。示例路径原写rk388，中文rk3588_u而英文rk3588_t；保留差异，使用时选实际产品模板。

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

## fstab与分区参数

查找/指定PRODUCT_FSTAB_TEMPLATE，修改分区挂载、swap_zram或data格式。Android14可从模板配置生成parameter.txt；未配置模板则寻找提供的parameter.txt。绕过生成工具时，在产品device目录放parameter.txt，例如device/rockchip/rk3326/rk3326_u/parameter.txt。

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

下为独立生成parameter示例。大版本OTA按原稿要求沿用旧版parameter.txt。上方占位分区大小须换为经审查的实际值。

```sh
parameter_tools --input device/rockchip/common/scripts/parameter_tools/parameter.in --firmware-version 14.0 --machine-model rk3326 --manufacturer rockchip --machine rk3326_u --partition-list uboot_a:4096K,trust_a:4M,misc:4M,dtbo_a:4M,vbmeta_a:4M,boot_a:33554432,backup:300M,security:4M,cache:300M,metadata:4096,frp:512K,super:2G --output parameter_new.txt
```

新增分区在产品BoardConfig.mk定义BOARD_WITH_SPECIAL_PARTITIONS（例baseparameter:1M,logo:16M），再在RebuildParameter.mk追加。

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

## 新增产品lunch

以rk3562_new_u为例，在device/rockchip/rk3562/AndroidProducts.mk增加makefile及user/userdebug项。复制既有rk3562_u产品为device/rockchip/rk3562/rk3562_new_u，将新目录内全部rk3562_u改成rk3562_new_u。

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

## 产品DTS参考

依据芯片、PMIC和硬件拓扑选择DTS参考。本表含RK3528，但前述SDK支持表未列该芯片，参考行不构成新增支持承诺。RK3588单PMIC硬件参考行中文为rk3588-evb7-v11，英文为rk3588-evb4-lp7-v10，两者保留。RK3399行业DTS本表不含v13，而编译表包含v13，也须核实。

| SoC | PMIC | 类型 | 机型 | DTS |
| --- | --- | --- | --- | --- |
| RK3588 | 双PMIC：RK806 ×2 | 开发板 | RK3588 EVB1 | rk3588-evb1-lp4-v10 |
| RK3588 | 单PMIC：RK806+RK860 | 开发板 | RK3588硬件参考设计 | 中文：rk3588-evb7-v11；英文：rk3588-evb4-lp7-v10 |
| RK3588S | 双PMIC：RK806 ×2 | 开发板 | RK3588S EVB1 | rk3588s-evb1-lp4x-v10 |
| RK3588S | 单PMIC：RK806+RK860 | 平板 | 平板硬件设计参考 | rk3588s-tablet-v11 |
| RK3588S | 双PMIC：RK806 ×2 | 平板 | 样机 | rk3588s-tablet-v10 |
| RK3588 | 单PMIC：RK860 | Box开发板 | RK3588_NVR_DEMO1_LP4X | rk3588-nvr-demo-v10-android |
| RK3566 | RK817 | 平板 | 样机 | rk3566-rk817-tablet |
| RK3566 | RK809 | 开发板 | RK3566 EVB2 | rk3566-evb2-lp4x-v10 |
| RK3566 | 分立 | 开发板 | RK3566 BOX DEMO | rk3566-box-demo-v10 |
| RK3568 | RK809 | 开发板 | RK3568 EVB1 | rk3568-evb1-ddr4-v10 |
| RK3562 | RK817 | 开发板 | RK3562 EVB1 | rk3562-evb1-lp4x-v10 |
| RK3562 | RK809 | 开发板 | RK3562 EVB2 | rk3562-evb2-ddr4-v10 |
| RK3562 | RK817 | 平板 | 样机 | rk3562-rk817-tablet-v10 |
| RK3528 | 分立 | BOX | RK3528 EVB1 | rk3528-evb1-ddr4-v10 |
| RK3326 | RK817 | 开发板 | EVB | rk3326-evb-lp3-v10-avb |
| PX30 | RK809 | 开发板 | EVB | px30-mini-evb-ddr3-v11-avb |
| RK3326 | RK817 | 平板 | 样机 | rk3326-863-lp3-v10-rkisp1 |
| RK3326 | RK809 | 人工智能语音 | EVB | rk3326-evb-ai-va-v12 |
| RK3399 | RK808 | 开发板 | 挖掘机 | rk3399-sapphire-excavator-edp-avb |
| RK3399 | RK809 | 开发板 | 行业开发板 | rk3399-evb-ind-lpddr4-android-avb |

## 补丁通知

重要补丁发布于https://redmine.rock-chips.com/projects/rockchip_patch/issues。订阅：用已注册Rockchip Redmine账号登录→我的账号→邮件通知选择“收取选中项目的所有通知”→勾选补丁发布项目→保存，后续发布通知发送至注册邮箱。本任务未订阅或改变外部账户。

![打开我的账号](/docs/rockchip-android14-sdk/images/redmine-account.png)

打开我的账号 - 原稿技术图；PDF页 23 (CN).

![选择邮件通知范围](/docs/rockchip-android14-sdk/images/redmine-notifications.png)

选择邮件通知范围 - 原稿技术图；PDF页 24 (CN).

![选择补丁项目并保存](/docs/rockchip-android14-sdk/images/redmine-project.png)

选择补丁项目并保存 - 原稿技术图；PDF页 24 (CN).

## 文档与外设支持

原稿给出https://redmine.rockchip.com.cn/projects/fae/documents获取持续更新的DDR/EMMC/NAND FLASH/WIFI/3G/CAMERA支持列表。Camera IQ Tool及RKNN Toolkit2 SDK文档路径如下。RKDocs目录树记录该SDK附带文档，文件名/语言后缀为原始标识，不代表本文翻译实际使用了对应英文文件。

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

## StressTest压力测试

设备计算器输入83991906=启动StressTest检查系统稳定性。模块测试：相机开关/拍照/切换，蓝牙开关，Wi-Fi开关；ping/iperf为待加入，不是已实现实测功能。其它测试：飞行模式开关、休眠唤醒、视频拷机、重启拷机、恢复出厂拷机、ARM/GPU/DDR变频。恢复出厂测试破坏用户数据，应专用测试机并备份。此为SDK可用测试功能，不是本文ArmSoM实测。

## PCBA与DeviceTest

PCBA用于量产快速识别故障，项目包括LCD、Wi-Fi、蓝牙、DDR/EMMC、SD卡、USB HOST、按键、喇叭/耳机Codec。Wi-Fi、DDR/EMMC、以太网自动测试；按键、SD卡、USB HOST、Codec手动测试。原稿自动组含以太网，尽管前面项目列表未列，按原稿保留。配置参考RKDocs/android/Rockchip_Developer_Guide_PCBA_Test_Tool_CN&EN.pdf_V1.1_20171222.pdf。

DeviceTest检查整机装配后的外设，计算器输入000.=进入。产线点TEST CHECKED逐项测试，成功点pass、失败点failed；红色为失败，其余通过，据此维修。需定制时向FAE申请源码。

![DeviceTest选择/结果](/docs/rockchip-android14-sdk/images/devicetest-start.png)

DeviceTest选择/结果 - 原稿技术图；PDF页 33 (CN).

## 主机工具

![Windows烧录工具](/docs/rockchip-android14-sdk/images/windows-tool.png)

Windows烧录工具 - 原稿技术图；PDF页 34 (CN).

| 工具/用途 | 原稿包/路径 |
| --- | --- |
| USB ADB及烧录驱动 | RKTools/windows/DriverAssitant_v5.1.1.zip |
| Windows烧录 | RKTools/windows/AndroidTool/AndroidTool_Release_v3.28.zip |
| Linux烧录 | RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30.zip |
| SD升级/启动/PCBA介质 | RKTools/windows/SDDiskTool_v1.74.zip |
| 写号；解压安装，以管理员运行 | RKTools/windows/RKDevInfoWriteTool-1.3.0.7z |
| DDR连接/虚焊测试 | RKTools/windows/Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_CN.7z<br>RKTools/windows/Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_EN.7z |
| efuse烧写：RK3288W/RK3368/RK3399 | RKTools/windows/efuse_v1.37.rar |
| efuse/OTP固件签名 | RKTools/windows/SecureBootTool_v1.94.zip |
| 工厂批量烧录 | RKTools/windows/FactoryTool-1.72.9.7z |
| userdata预置数据包 | RKTools/windows/OemTool_v1.3.rar |
| Camera ISP图像调试 | external/camera_engine_rkaiq/rkisp2x_tuner |

写号工具手册：RKDocs/common/RKTools manuals/Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf。efuse/OTP操作可能不可逆，使用前确认芯片、密钥和烧写方案。下方Linux帮助示例版本v2.26，而包为v2.30；保留命令/参数，包括原拼写BlokcLen。本任务未执行擦除、写入或熔丝操作。

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

## ADB连接与命令

ADB（Android Debug Bridge）管理真机或模拟器，可运行shell、端口映射、上传下载和安装APK。原稿将PC称客户端、设备/模拟器称服务端，区分有线/无线网络ADB（中文明确同一局域网）与USB ADB。原USB说明限制OTG口、单客户端、单设备，此为文档环境限制，不概括所有ADB实现。启动Android，在设置→开发者选项打开连接计算机及USB调试，PC接OTG，运行adb shell，再adb devices显示序列号即连接成功。

| 操作 | 语法/示例 | 含义 |
| --- | --- | --- |
| 列设备 | adb devices | 返回序列号或IP:端口及状态 |
| 安装/重装 | adb install &lt;apk-path&gt;<br>adb install "F:\WishTV\WishTV.apk"<br>adb install -r "F:\WishTV\WishTV.apk" | 安装本地APK；-r重装 |
| 卸载 | adb uninstall &lt;package&gt;<br>adb uninstall com.wishtv | 完全卸载包 |
| 删除APK文件 | adb shell rm &lt;filepath&gt;<br>adb shell rm "system/app/WishTV.apk" | 删除设备指定文件，破坏性示例 |
| 设备shell | adb shell | 进入设备/模拟器命令行 |
| 上传 | adb push &lt;local-path&gt; &lt;remote-path&gt;<br>adb push "F:\WishTV\WishTV.apk" "system/app" | 复制本地文件/文件夹到设备；英文语法遗漏参数 |
| 下载 | adb pull &lt;remote-path&gt; &lt;local-path&gt;<br>adb pull system/app/Contacts.apk F:\ | 复制设备文件/文件夹到PC |
| 错误报告 | adb bugreport | 含dumpsys、dumpstate、logcat |
| 系统属性 | adb shell getprop | 查看设备系统信息 |

PDF命令排版引号/长横线统一为ASCII引号和连字符。root/system写入取决于实际固件权限，示例不授予权限，也不保证system可写。

## Logcat

Android将软件/系统调试信息写入缓冲区，logcat显示，输出量大时用过滤。语法[adb] logcat [<option>] [<filter-spec>]，adb shell后运行logcat。*:W显示warning及以上；ActivityManager:I MyApp:D *:S保留ActivityManager的Info及以上、MyApp的Debug及以上并静默其它标签。两稿错误描述为排除这些标签，此处保留命令并明确实际过滤含义。WishTV:* *:S或-s WishTV仅WishTV；WishTV:I *:S为Info阈值而非只含一个精确优先级。

```sh
adb shell
logcat
logcat *:W
logcat ActivityManager:I MyApp:D *:S
logcat WishTV:* *:S
logcat -s WishTV
logcat WishTV:I *:S
```

## Procrank内存快照

Procrank在设备shell查看进程内存。USS为进程独占，进程终止可全部回收；VSS/RSS包含共享库，原稿提示不宜单凭它们判断单进程独占占用；PSS按比例分摊共享内存。运行前su获取root；默认PSS排序，-v为VSS降序。

| 指标 | 含义 |
| --- | --- |
| VSS | 虚拟占用，含共享库 |
| RSS | 实际驻留物理内存，含共享库 |
| PSS | 按比例分摊共享内存的物理占用 |
| USS | 独占物理内存，不含共享库 |

| 选项 | 含义 |
| --- | --- |
| -v | VSS |
| -r | RSS |
| -p | PSS |
| -u | USS |
| -R | 切换升/降序 |
| -w | 仅working set计数 |
| -W | 重置working set计数 |
| -h | 帮助 |

```sh
su
procrank [ -W ] [ -v | -r | -p | -u | -h ]
procrank
procrank -v
procrank | grep [cmdline | PID]
procrank | grep "com.android.systemui"
procrank | grep 3396
```

cmdline为应用名，PID为进程号。排查可能泄漏可连续快照并比较USS；ADB连接后运行如下test.sh。增长趋势是诊断线索，不单独构成泄漏证明。

```sh
#!/bin/bash
while true;do
    adb shell procrank | grep "com.android.systemui"
    sleep 1
done
```

## Dumpsys

Dumpsys在设备shell输出Android Binder服务状态，仅能输出已注册ServiceManager且实现dump函数的服务。-help帮助、-l列服务，输入完整且区分大小写的服务名获取dump，可支持时追加应用名。

```sh
dumpsys -help
dumpsys -l
dumpsys [servicename]
dumpsys SurfaceFlinger
dumpsys [servicename] [application-name]
dumpsys meminfo com.android.systemui
```

## 上次启动日志与FIQ

在DTS增加下方两个ramoops节点。查看/sys/fs/pstore：dmesg-ramoops-0保存上次kernel panic，pmsg-ramoops-0为上次Android/用户空间日志，ftrace-ramoops-0为函数跟踪，console-ramoops-0为上次启动内核日志，仅保存高于默认log level的信息。logcat -L提取解析pmsg。

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

设备死机/卡住时可串口输入fiq检查状态，再help列命令；reboot/reset改变设备状态，应有意使用。

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

## FAQ：版本与同步

Android14.0使用kernel6.1和U-Boot next-dev。SDK由AOSP和RK修改组成，RK仓库在.repo/manifests/include下XML，AOSP默认在.repo/manifests/default.xml。读取RK project revision和AOSP default revision，反馈时同时提供；示例为android-14.0-mid-rkr1和android-14.0.0_r11。单仓库git tag列标签，RK按android-14.0-mid-rkrxx递增，例中“最新RKR1”为历史说明。

```text
vim .repo/manifests/include/rk_checkout_from_aosp.xml
<project groups="pdk" name="platform/build" path="build/make" remote="rk" revision="refs/tags/android-14.0-mid-rkr1">
vim .repo/manifests/default.xml
<default revision="refs/tags/android-14.0.0_r11"...>
# In kernel-6.1
git tag
# example result: android-14.0-mid-rkr1
```

检查完整更新：导出固定commit的本地manifest，与.repo/manifests/commit/对应发布manifest比较。中文引入RKR1、英文引入RKR6，但两者文件名均rkr1，且随后都称参考为RKR6。保留此矛盾，应按实际目标发布版比较，不混用标签。

```sh
.repo/repo/repo manifest -r -o release_manifest_rkr1_local.xml
# Compare with .repo/manifests/commit/commit_release_rkr1.xml
```

## 启动Logo与纯64位构建

U-Boot和kernel Logo为开机第一/第二张图：kernel-6.1/logo.bmp、logo_kernel.bmp。同名BMP替换后重编内核，打入boot.img。原稿限制8MB以内BMP，支持8/16/24/32位；并称Android14 GMS/EDLA产品须纯64位，可降低内存，以下为rk3562_ugo BoardConfig.mk例。

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

## 充电与充电图片

DTS配置关机充电和低电预充；uboot-charge-on与android-charge-on互斥。uboot-low-power-voltage是预充到开机阈值，screen-on-voltage是亮屏阈值，按产品选择。充电BMP同名同格式替换。已启用却不显示时打包进resource.img，再重打boot.img并烧rockdev/boot.img。原稿混用kernel-6.1/kernel并写./mkiamge.sh，保留为来源问题，执行前核实路径脚本。

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

## HDMI输入、4G、Wi-Fi和旋转

HDMI IN和RM3104G默认关闭，按下方BoardConfig开启。Wi-Fi默认休眠保持连接，断开时将原rk3566_rgo overlay的def_wifi_sleep_policy从2改0；persist.wifi.sleep.delay.ms控制延迟，默认15分钟，0为灭屏即关Wi-Fi。rgo为原历史路径，不在此推断成Android14目标。

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

Recovery支持0/90/180/270°，默认0，在device/rockchip/common/BoardConfig.mk分别用ROTATION_NONE/RIGHT/DOWN/LEFT。SurfaceFlinger方向也支持0/90/180/270。

```make
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
SF_PRIMARY_DISPLAY_ORIENTATION ?= 0
```

## AOSP远端镜像

repo init或解压base包后，可修改.repo/manifests/remote.xml的aosp fetch改善下载，原稿国内例清华、国外例Google。原值fetch="./" review="https://10.10.10.29"。PDF写“< remote”和尾部分号，下方XML移除这些格式错误；可用性及授权须另核实。

```xml
<remote name="aosp" fetch="./" review="https://10.10.10.29" />
<!-- Alternative A -->
<remote name="aosp" fetch="https://aosp.tuna.tsinghua.edu.cn" />
<!-- Alternative B -->
<remote name="aosp" fetch="https://android.googlesource.com" />
```

## Data性能与EXT4

原稿建议带电池产品加fsync_mode=nobarrier提升存储性能，警告无电池产品掉电可能损坏数据，不建议开启。电池并不消除全部掉电风险，应验证实际供电并备份。保留fstab.in及fstab_go.in两份补丁；后者有疑似笔误resgid=1065i，不可盲用。仅合并PDF断行，该字面值保留并标注。

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

data默认f2fs，原稿建议无电池产品改EXT4降低异常掉电丢失概率，并非保证免疫。rk3566_r示例同时改Android fstab模板及recovery.fstab；转换可能涉及格式化，应备份规划迁移。diff上下文first_stage_原已不完整，不臆造补齐。

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

## 动画、应用性能与GPU诊断

开关机动画/铃声参见RKDocs/android/Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Customization_CN&EN.pdf。性能模式包名加入device/rockchip/rk3xxx/package_performance.xml，用aapt dump badging (file_path.apk)获取包名，mode1启用加速、0关闭，编译打入固件。下方原安兔兔片段含XML空格/反斜杠错误及重复full包行，为可追溯保留，不是可直接用的XML。GPU初查见RKDocs/android/Rockchip_User_Guide_Dr.G_CN&EN.pdf。

```text
< app package="com.antutu.ABenchMark"mode="1"/>
< app package="com.antutu.benchmark.full"mode="1"\/>
< app package="com.antutu.benchmark.full"mode="1"\/>
```

## OTP/efuse及烧写状态

| 类型 | 原稿芯片列表 |
| --- | --- |
| OTP | RK3326, PX30, RK3566, RK3568, RK3588 |
| EFUSE | RK3288, RK3368, RK3399 |

英文OTP另列RK3568S，中文没有；作为未核验来源差异保留，不擅改成其它芯片。签名烧写参考RKDocs/common/security/Rockchip-Secure-Boot-Application-Note-V1.9.pdf。kernel cmdline的fuse.programmed：1表示固件已secure-boot签名且硬件已烧写；0为已签名但硬件未烧。无字段可能固件未签名（Miniloader不传）或Miniloader过旧，不能仅凭缺失判断未烧。

## SELinux与启动一致性警告

BOARD_SELINUX_ENFORCING=false关闭强制，true开启。关闭削弱防护，不作为生产默认建议。启动“内部问题”警告原稿列两原因：system/boot/vendor fingerprint不一致，或启用IO调试配置；不需要调试时用正常内核编译配置。原稿另给IO调试项目隐藏弹窗补丁，这不修复固件不一致；其中Java if (0 && ...)无效，仅保留为来源错误，非可用补丁。应先修复不一致并审查调试变更。

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

## 以太网设置、AVB与IO调试

以太网设置默认无，按补丁加BOARD_HS_ETHERNET=true。AVB/security boot参考RKDocs/common/security/RK356X_SecurityBoot_And_AVB_instructions_CN.pdf。IO依赖默认关闭的DEVMEM，受控调试构建可从mkcombinedroot/configs/android-14.config或GO的android-14-go.config移除“# CONFIG_DEVMEM is not set”；编Android还需下方kernel/configs两补丁。直接物理内存访问削弱隔离，不应随意用于生产。

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

## SN、LZ4与其它功能

SN须字母开头，最多14字节。内核LZ4错误可能主机版本过旧，原稿要求1.8.3+，用lz4 -v查看。其方案用Android产物覆盖/usr/bin/lz4，会改变系统工具，应用前核实兼容性并保留恢复方式。原版本输出也含“refusing to read from a console”。

![LZ4编译错误](/docs/rockchip-android14-sdk/images/lz4-error.png)

LZ4编译错误 - 原稿技术图；PDF页 51 (CN).

```text
wlq@ubuntu:~$ lz4 -v
*** LZ4 command line interface 64-bits v1.8.3, by Yann Collet ***
refusing to read from a console
```

```sh
sudo cp out/host/linux-x86/bin/lz4 /usr/bin/lz4
```

| 功能 | 参考 |
| --- | --- |
| Samba | RKDocs/android/Rockchip_Introduction_Android_Samba_CN.pdf |
| NFS启动 | RKDocs/android/patches/customized_functions/nfs_boot_patch_v1.1.0.zip |
| 多屏异显异触 | RKDocs/android/patches/customized_functions/Android11异显开发说明.zip |
| 多屏异声 | RKDocs/android/patches/customized_functions/Dual_Audio_v1.0.zip |

RK3528 DDR4BIT PCB loader示例仅将FlashData替换为下方4BIT版本，不因此把RK3528新增为SDK已支持芯片。

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

## 附录A：历史构建环境

本附录来自较早AOSP环境指南，中文PDF内也为英文。Ubuntu14.04/15.04、JDK8、Mac说明均为历史材料，不是已核验Android14主机要求；GKI指南另要求Ubuntu20.04+。不要将旧包操作视为当前安装建议。原稿称Linux或Mac而非Windows，引用“Life of a Patch”说明评审更新流程；美元符号为提示符，网页“Click to copy”/三击复制说明是来源UI文案，不是本文功能。

先选源码分支，环境要求随分支变化，“Build Numbers”列分支，原稿master下载省略分支参数。其Linux指令称适用全部分支/master，历史内部测试为Ubuntu LTS14.04和Debian testing，其它发行版可能有工具。Gingerbread2.3.x及以后需64位环境，更旧版本可32位。原稿引用“Requirements”查看软硬件及Ubuntu/Mac要求。AOSP master在prebuilts/jdk/自带OpenJDK，旧分支需单独装对应“JDK Requirements”的OpenJDK。

历史Ubuntu≥15.04命令安装OpenJDK8。对14.04原稿称无受支持OpenJDK8包，但15.04包可用，15.10/16.04包按此流程不可用。从old-releases.ubuntu.com下载下列64位deb并核对SHA256；本任务未下载。

```sh
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

| 软件包 | SHA256 |
| --- | --- |
| openjdk-8-jre-headless_8u45-b14-1_amd64.deb | 0f5aba8db39088283b51e00054813063173a4d8809f70033976f83e214ab56c0 |
| openjdk-8-jre_8u45-b14-1_amd64.deb | 9ef76c4562d39432b69baf6c18f199707c5c56a5b4566847df908b7d74e15849 |
| openjdk-8-jdk_8u45-b14-1_amd64.deb | 6e47215cf6205aa829e6a0a64985075bd29d1f428a4006a80c9db371c2fc3c4c |

逐个deb运行dpkg，缺依赖用apt-get -f install修复。可选update-alternatives选默认java/javac；PDF把两命令黏连，此处拆开。Java版本构建错误原稿引用“Wrong Java version”。

```sh
sha256sum {downloaded.deb file}
sudo apt-get update
sudo dpkg -i {downloaded.deb file}
sudo apt-get -f install
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

历史64位Ubuntu14.04依赖如下。中文另含libssl-dev、liblz4-tool、python-dev，英文未列。SELinux策略分析加python-networkx，LDAP环境运行ART主机测试加libnss-sss:i386。

```sh
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-core-dev libx11-dev lib32z-dev ccache libgl1-mesa-dev libxml2-utils xsltproc unzip python-pyelftools python3-pyelftools device-tree-compiler libfdt-dev libfdt1 libssl-dev liblz4-tool python-dev
```

历史GNU/Linux USB规则授予指定普通用户访问。root创建/etc/udev/rules.d/51-android.rules，将<username>替换为授权用户名，重新插拔生效。原稿称Ubuntu8.04.x/10.04.x可用，其它版本可能需不同配置。参考http://source.android.com/source/initializing.html。

```text
# adb protocol on passion (Rockchip products)
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", ATTR{idProduct}=="0010", MODE="0600", OWNER="<username>"
```

## 附录B：SSH密钥

B-1：生成RSA密钥，user@host替换邮箱。妥善保管id_rsa及口令，仅将id_rsa.pub交SDK服务器管理员。截图为原稿示例，不是本任务生成的密钥。

```sh
ssh-keygen -t rsa -C "user@host"
```

![RSA密钥生成示例](/docs/rockchip-android14-sdk/images/keygen.png)

RSA密钥生成示例 - 原稿技术图；PDF页 55 (CN).

![生成的密钥文件名](/docs/rockchip-android14-sdk/images/public-key.png)

生成的密钥文件名 - 原稿技术图；PDF页 55 (CN).

B-2：安装keychain，在~/.bashrc增加eval行，重新登录后输入生成密钥时的口令（若有）。id_rsa为私钥文件名。日常使用避免sudo/root，除非清楚其所有权与agent影响。

```sh
sudo aptitude install keychain
vim ~/.bashrc
# Add to ~/.bashrc:
eval `keychain --eval ~/.ssh/id_rsa`
```

B-3：原稿通过安全复制id_rsa到其它授权机器~/.ssh/id_rsa复用身份，这会扩散同一私钥，不得发送第三方或不可信机器。私钥错误产生图示认证失败，正确身份可克隆。原错误“Agent admitted failture to sign using the key”（原拼写）可按例ssh-add ~/.ssh/id_rsa。

![错误身份/认证错误](/docs/rockchip-android14-sdk/images/wrong-key.png)

错误身份/认证错误 - 原稿技术图；PDF页 56 (CN).

![正确身份克隆](/docs/rockchip-android14-sdk/images/clone-success.png)

正确身份克隆 - 原稿技术图；PDF页 56 (CN).

```sh
ssh-add ~/.ssh/id_rsa
```

B-4：查man ssh_config。原稿将系统ssh_config复制为~/.ssh/config并编辑，用~/.ssh1/id_rsa作为IdentityFile切换身份。应用例子前保留既有用户配置，直接复制会覆盖设置。

```text
man ssh_config
cp /etc/ssh/ssh_config ~/.ssh/config
vi .ssh/config
# Relevant ssh_config directive:
IdentityFile ~/.ssh1/id_rsa
```

![ssh_config手册](/docs/rockchip-android14-sdk/images/ssh-manual.png)

ssh_config手册 - 原稿技术图；PDF页 57 (CN).

![替代IdentityFile](/docs/rockchip-android14-sdk/images/ssh-config.png)

替代IdentityFile - 原稿技术图；PDF页 57 (CN).

B-5：服务器可监控每个key下载次数/IP，异常可禁用下载权限，应保护私钥，禁止转授权第三方。B-6：按上述生成公钥，将公钥文件发fae@rock-chips.com申请SDK下载权限。本任务未发邮件、生成密钥或申请权限。

{% endraw %}
