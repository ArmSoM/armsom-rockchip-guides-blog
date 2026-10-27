---
title: "Rockchip RK3576 Android 14 SDK 完整开发指南"
description: "Rockchip RK3576 Android 14 SDK 完整开发指南 — V1.0.0, RKR4, GKI, ADB, DTS, FAQ"
excerpt: "Rockchip RK3576 Android 14 SDK 完整开发指南"
translation_key: "237-rockchip-rk3576-android14-sdk"
slug: "237-rockchip-rk3576-android14-sdk"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "RK3576", "Android14", "SDK"]
---

{% raw %}

# Rockchip RK3576 Android 14 SDK 完整开发指南

ArmSoM 平台参考：本文完整整理原厂 RK3576 Android 14 SDK V1.0.0 技术内容，不是 ArmSoM 板卡已验证的烧写教程。适配前核对 SoC、板卡原理图、DTS、SDK 发布包与存储布局。本文未做硬件验证；原稿截图、性能建议和示例不代表 ArmSoM 实测。刷写和分区操作前备份数据。代码保留原稿标识与历史示例；重要中英差异和风险见文末。

代码块是原稿逐行转录，保留 PDF 换行、智能引号和连字符；长命令/补丁可能被版面折行，不能整块盲目粘贴执行。例如附录原稿把两条 update-alternatives 命令粘成 `--config javasudo`，应分别核对 `sudo update-alternatives --config java` 和 `sudo update-alternatives --config javac`。工具帮助输出的 Linux_Upgrade_Tool_v2.26 是旧示例；RK3576 正文要求至少 2.30。

## RK3576 Android 14.0 SDK代码下载编译

### 代码下载

#### 下载地址

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml
```

如果申请的Express的权限,那么下载地址如下:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml
```

#### 服务器镜像下载

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

如果申请的Express的权限,那么下载地址如下:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml --mirror
```

注,repo是google用Python脚本写的调用git的一个脚本,主要是用来下载、管理Android项目的软件仓库,其下载地址如下:

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

为方便客户快速获取SDK源码,瑞芯微技术窗口通常会提供对应版本的SDK初始压缩包。以Rockchip_Android14.0_SDK_RELEASE.tar.gz.*`为例,拷贝到该初始化包后,通过如下命令可检出源码:

```text
mkdir RK3576_Android14.0_SDK_RELEASE
cat RK3576_Android14.0_SDK_RELEASE.tar.gz* | tar -zx -C
RK3576_Android14.0_SDK_RELEASE
cd RK3576_Android14.0_SDK_RELEASE
.repo/repo/repo sync -l
.repo/repo/repo sync -c
```

### 搭建自己的repo代码服务器

#### 环境

安装 openssh-server 用于远程登录, git 用于管理工程, keychain 用于公私钥管理工具

```text
sudo apt-get install openssh-server git keychain
```

#### gitolite搭建

服务器端操作(以服务器地址:10.10.10.206为例进行说明)

1. 创建git账户:

```text
sudo adduser --system --shell /bin/bash --group git
sudo passwd git
```

2. 以“git”账户登录服务器

3. 确保“~/.ssh/authorized_keys”为空或者不存在

4. 拷贝服务器管理员的公钥到“~/YourName.pub”

5. 下载gitolite源码

```text
git clone https://github.com/sitaramc/gitolite.git
```

6. 在git用户目录下创建bin目录

```text
mkdir -p ~/bin
```

7. 执行下列命令安装gitolite,不同版本安装方法不同,请参考源码中的文档:

```text
gitolite/install -to ~/bin
```

8. 设置管理员

```text
~/bin/gitolite setup -pk YourName.pub
```

客户端操作

1. 克隆服务器的gitolite管理仓库:

```text
git clone ssh://git@10.10.10.206/gitolite-admin.git
```

2. 添加用户公钥到gitolite目录下

```text
cp username.pub keydir/username.pub
```

3. 添加管理员用户

```text
vi conf/gitolite.conf
@admin = admin1 admin2 admin3
repo gitolite-admin
RW+     =   @admin
```

#### repo镜像搭建

服务器端操作

1. 用git账号登入服务器

2. 在根目录下载repo工具

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

3. 新建RK_Android14_mirror目录

```text
mkdir RK_Android14_mirror
```

4. 进入 RK_Android14_mirror目录

```text
cd RK_Android14_mirror
```

5. 下载RK Android14 SDK镜像

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

6. 创建仓库组权限

```text
.repo/repo/repo list -n > android_u.conf
sed -i 's/^/@android_t = RK_Android14_mirror\/&/g' android_u.conf
```

客户端操作

1. 将服务器端的android_u.conf拷贝到客户端的·gitolite-admin/conf/·下

2. 添加组权限

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

3. 新建自己的manifests仓库

```text
vi conf/android_u.conf
@android_u = Android_T/manifests_xxx
```

#### 客户端操作

1. 在客户端下载manifests_xxx仓库在其他客户端电脑上下载manifests_xxx.git仓库

```text
git clone ssh://git@10.10.10.206/Android_u/manifests_xxx.git
```

2. 在客户端下载原始manifests仓库

```text
git clone ssh://git@10.10.10.206/Android_U/manifests.git
```

3. 提交manifest.xml文件到新建的manifest_xxx仓库中将原始manifests下面的文件拷贝到的manifests_xxx内

```text
cd manifests_xxx
cp -rf manifests/*.xml manifests_xxx/
```

查看拷贝文件

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

本地提交

```text
git add -A
git commit -m "init xxx"
```

push到远程分支

```text
git push origin master:master
```

4. 创建自己的代码下载链接在根目录下下载repo工具

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

按以上步骤操作后,自己的代码下载链接如下

```text
mkdir Android14
cd Android14
~/repo/repo init -u ssh://git@10.10.10.206/Android_U/manifests_xxx.git -m
Android14.xml
```

其中://10.10.10.206 是你的服务器端地址通过以上步骤就可以完成自己的repo服务器搭建了,可以把自己的代码服务器链接分享给同事们一起工作了。

### 代码管理

通过以上步骤搭建代码服务器后大部分代码仓库都使用RK默认的分支,如果有仓库需要修改自己的代码,可以参考下面的步骤进行操作。

#### 切换自己的代码分支

1. 进入需要修改的代码仓库,以kernel目录为例进行说明

```text
cd kernel-6.1
```

2. 切换一个本地分支

```text
git checkout remotes/m/master -b xxx_branch
```

3. push xxx_branch分支到远程服务器

```text
git push rk29 xxx_branch:xxx_branch
```

其中 rk29 是remote 可以直接tab键自动补全

4. 进入.repo/manifests目录修改manifest里面指定的分支进入.repo/manifests目录通过grep kernel可以找到kernel仓库对应的manifest的位置

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

5. 提交修改的manifest到远程分支

```text
git add include/rk_modules_repository.xml
git commit -m "change kernel branch on xxx_branch"
git push origin default:master
```

提交manifests仓库后,其他同事就可以同步到你们自己的分支的kernel代码了。

#### 代码修改提交

按上面步骤切换完分支后就可以在自己分支上提交自己的修改了, 提交直接push到xxx_branch分支上面。

#### 同步RK的代码

1. 同步RK代码需要在服务器端进行sync操作

```text
cd RK_Android14_mirror
```

```text
.repo/repo/repo sync -c
```

2. 客户端合并RK对manifests的修改下载RK原始manifests仓库

```text
git clone //10.10.10.206/wlq/test/manifests.git
```

使用对比工具对比manifests(RK原始)和manifests_xxx(自己的),将RK修改的差异部分合并到自己的仓库中(主要修改tag,增加删除仓库等)。对比确认后将修改push到manifests_xxx上。这步也可以确认自己修改了哪些仓库,在下一步中将进行修改仓库的合并。

3. 有自己切分支的目录需要手动把RK的修改merge到自己的分支上面以kernel为例:查看当前指向的远程分支

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

可以看到当前指向的是: remotes/m/master -> rk29/xxx_branch创建本地分支(从自己的远程分支上切)

```text
git checkout remotes/m/xxx_branch -b local_xxx_branch
```

确认当前RK发布的最新TAG

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
```

```text
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
android-14.0-mid-rkr4
```

可以看到当前最新的Android14的tag是 android-14.0-mid-rkr4合并 android-14.0-mid-rkr4 到本地分支

```text
git merge android-14.0-mid-rkr4
```

查看是否有冲突,如果有冲突先解决冲突,没有冲突在执行下一步push合并完的代码到远程分支

```text
git push rk29 local_xxx_branch:xxx_branch
```

其他切分的目录都按这个方式进行合并提交即可

### kernel代码路径说明

Android14支持6.1 版本的kernel,kernel源码在工程中kernel-6.1目录下,

### 代码编译

#### Lunch项说明

| lunch项 | 适应芯 片 | 其他说明 |
| --- | --- | --- |
| rk3576_u-user | RK3576 | 适用于Android14的产品,适配RK3576开发板硬件,默认对应的dts文 件是rk3576-evb1-v10.dts,编译的是user版本,生产时使用, Android系统支持32/64位 |
| rk3576_u-userdebug | RK3576 | 适用于Android14的产品,硬件适配RK3576开发板,默认对应的dts 文件是rk3576-evb1-v10.dts,编译的是userdebug版本,开发调试时 使用,Android系统支持32/64位 |

#### 一键编译命令

```text
./build.sh -UKAup
```

```text
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
   ------------大家可以按需使用，不用记录uboot/kernel编译命令了------------------
 ）

============================================================
请注意使用一键编译命令之前需要设置环境变量，选择好自己需要编译的平台，举例：
source build/envsetup.sh
lunch rk3576_u-userdebug
============================================================
```

### 各个平台编译命令汇总

| Soc | 类型 | 参考机型 | Android | 一键编译 | kernel编 译 | uboot编 译 |
| --- | --- | --- | --- | --- | --- | --- |
| RK3576 | 开发 板 EVB1 | rk3576-evb1-v10 | build/envsetup.sh;lunch rk3576_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |

### GKI

RK3576 SDK默认没有开启GKI,如需要开启GKI功能可以按如下修改:(以RK3576平台为例说明)

```text
wlq@sys2206:~/b0_A14_bringup/device/rockchip/rk3576$ git diff
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
index eb52fb6..f59df62 100755
--- a/rk3576_u/BoardConfig.mk
+++ b/rk3576_u/BoardConfig.mk
@@ -14,7 +14,7 @@
 # limitations under the License.
 #
 BUILD_WITH_GO_OPT := false
-BOARD_BUILD_GKI := false
+BOARD_BUILD_GKI := true

 BOARD_GRAVITY_SENSOR_SUPPORT := true
```

BOARD_BUILD_GKI := true后会自动开启AB功能。关于GKI的kernel编译、ko更新等说明可以参考文档RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》

#### 其他编译说明

Android14.0不能直接烧写kernel.img和resource.img

以下编译仅适用于非GKI,GKI的请参考文档RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》Android14.0的kernel.img和resource.img包含在boot.img中,需要使用build.sh -AK 命令来编译kernel,编译后烧写rockdev下面的boot.img。这个过程会重新编译Android,所以编译时间会比较长,建议用下面单独编译kernel的方式的编译。单独编译kernel生成boot.img编译的原理:在kernel目录下将编译生成的 kernel.img 和 resource.img 替换到旧的 boot.img 中。以 RK3576 样机为例,编译时替换对应的boot.img及dts:其中 BOOT_IMG=../rockdev/Image-rk3576_u/boot.img 这里指定的是旧的boot.img的路径,命令如下:导clang到环境

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

编译后可以直接烧写kernel-6.1目录下的boot.img到机器的boot位置,烧写时请先加载分区表(parameter.txt),以免烧写位置错误。

### 固件烧写

#### 固件烧写工具

Android14的USB驱动DriverAssitant需要更新到V5.1.1版本,可以参考下面的工具章节进行更新。Windows烧写工具:(工具是时刻更新,请及时同步更新)RK3576平台windows固件烧写工具必现使用V3.28及以上版本

```text
RKTools/windows/AndroidTool/AndroidTool_Release_v3.28
```

![原稿技术图 1](/docs/rockchip-rk3576-android14-sdk/assets/cn-p011-figure-01.png)

Linux烧写工具:RK3576平台Linux固件烧写工具必现使用V2.30及以上版本

```text
RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30
```

在下文工具说明章节有详细说明

#### 固件说明

完整编译后会生成如下文件:

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

工具烧写如下文件即可:

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

也可以直接烧写 update.img

#### 固件说明

| 固件 | 说明 |
| --- | --- |
| boot.img | 包含ramdis、kernel、dtb |
| boot-debug.img | 与boot.img的差别是user固件可以烧写这个boot.img进行root权限操 作 |
| dtbo.img | Device Tree Overlays 参考下面的dtbo章节说明 |
| config.cfg | 烧写工具的配置文件 ,可以直接导入烧写工具显示需要烧写的选项 |
| MiniLoaderAll.bin | 包含一级loader |
| misc.img | 包含recovery-wipe开机标识信息,烧写后会进行recovery |
| parameter.txt | 包含分区信息 |
| pcba_small_misc.img | 包含pcba开机标识信息,烧写后会进入简易版pcba模式 |
| pcba_whole_misc.img | 包含pcba开机标识信息,烧写后会进入完整版pcba模式 |
| recovery.img | 包含recovery-ramdis、kernel、dtb |
| super.img | 包含odm、product、vendor、system、system_ext分区内容 |
| trust.img | 包含BL31、BL32 RK3566/RK3568没有生成这个固件,不需要烧写 |
| uboot.img | 包含uboot固件 |
| vbmeta.img | 包含avb校验信息,用于AVB校验 |
| update.img | 包含以上需要烧写的img文件,可以用于工具直接烧写整个固件包 |

### Generic Kernel Image(GKI)

Android14过GMS和EDLA认证的产品都强制kernel使用GKI,GKI的配置和编译具体参考文档RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf

### fastboot烧写动态分区

R的新设备支持动态分区,已经移除了system/vendor/odm/product/system_ext分区,请烧写super.img,单独烧写system/vendor/odm等(可以在out下面找到对应img文件)可以用fastbootd ,要求adb和fastboot版本均为最新,SDK提供了编译好的工具包:

```text
RKTools/linux/Linux_adb_fastboot (Linux_x86版本)
RKTools/windows/adb_fastboot (Windows_x86版本)
```

使用命令烧写动态分区:

```text
adb reboot fastboot
fastboot flash vendor vendor.img
fastboot flash system system.img
fastboot flash odm odm.img
```

注:进入fastbootd模式后,屏幕上会显示相关设备信息,如图所示:

![原稿技术图 2](/docs/rockchip-rk3576-android14-sdk/assets/cn-p014-figure-01.png)

注:非动态分区使用fastboot,请进入bootloader:

```text
adb reboot bootloader
```

烧写GSI的方法:确认机器解锁后,进入fastbootd,只需要烧写GSI中的system.img及固件中的misc.img,烧写后会进入recovery进行恢复出厂设置。下面附上整个烧写流程:

1. 重启至bootloader,未解锁->机器解锁:

```text
adb reboot bootloader
fastboot oem at-unlock-vboot ## 对于烧写过avb公钥的客户，请参考对应的文档解锁。
```

2. 恢复出厂设置,重启至fastbootd:

```text
fastboot flash misc misc.img
fastboot reboot fastboot  ## 此时将进入fastbootd
```

3. 开始烧写GSI

```text
fastboot delete-logical-partition product  ## (可选)对于分区空间紧张的设备，可以先执行
本条命令删除product分区后再烧写GSI
fastboot flash system system.img
fastboot reboot  ## 烧写成功后，重启
```

注:也可以使用DSU(Dynamic System Updates)烧写GSI,目前Rockchip平台已经默认支持DSU。由于该功能需要消耗大量内存,不建议1G DDR及以下的设备使用,有关DSU的说明和使

用,请参考Android官网:https://source.android.com/devices/tech/ota/dynamic-system-updates注1:VTS测试时,需要同时烧写编译出的boot-debug.img到boot分区;注2:CTS-ON-GSI测试时则不需要烧boot-debug.img;注3:测试时请使用Google官方发布的,带有-signed结尾的GSI镜像;

## 使用DTBO功能

Android 10.0及以上支持Device Tree Overlays功能,开发过程体现在需要烧写dtbo.img,用于多个产品间的兼容等。修改方法:

1. 找到(或指定)模板文件:

```text
get_build_var PRODUCT_DTBO_TEMPLATE
```

例如:

```text
PRODUCT_DTBO_TEMPLATE := $(LOCAL_PATH)/dt-
overlay.in(device/rockchip/rk3576/rk3576_u/dt-overlay.in)
```

2. 添加或修改需要的节点:例如:

```text
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

注: 使用dtbo时一定要确保dts中存在alias,否则无法成功overlay

## 修改fstab文件

1. 找到(或指定)模板文件:

```text
get_build_var PRODUCT_FSTAB_TEMPLATE
```

例如:

```text
PRODUCT_FSTAB_TEMPLATE := device/rockchip/common/scripts/fstab_tools/fstab.in
```

2. 修改:添加分区挂载、修改swap_zram参数,修改data分区格式等

## 修改parameter.txt

Android 14添加了生成parameter.txt的工具,支持根据配置参数编译出parameter.txt。如果没有配置模板文件,则会寻找添加修改好的parameter.txt文件。

1. 找到(或指定)模板文件:

```text
get_build_var PRODUCT_PARAMETER_TEMPLATE
```

例如:

```text
PRODUCT_PARAMETER_TEMPLATE :=
device/rockchip/common/scripts/parameter_tools/parameter.in
```

2. 修改配置分区大小(例如):

```text
BOARD_SUPER_PARTITION_SIZE := 2688548864
BOARD_DTBOIMG_PARTITION_SIZE := xxxx
BOARD_BOOTIMAGE_PARTITION_SIZE := xxxxx
BOARD_CACHEIMAGE_PARTITION_SIZE := xxxx
```

3. 不使用parameter生成工具:添加一个parameter.txt文件到你的device目录下即可:例如:device/rockchip/rk3576/rk3576_u/parameter.txt

4. 仅使用工具生成parameter.txt(例如):

```text
parameter_tools --input
device/rockchip/common/scripts/parameter_tools/parameter.in --firmware-version
14.0 --machine-model rk3576 --manufacturer rockchip --machine rk3576_u --
partition-list
uboot_a:4096K,trust_a:4M,misc:4M,dtbo_a:4M,vbmeta_a:4M,boot_a:33554432,backup:30
0M,security:4M,cache:300M,metadata:4096,frp:512K,super:2G --output
parameter_new.txt
```

注: 如果需要大版本OTA升级,请直接使用之前版本的parameter.txt

5. 新加一个分区以新建baseparameter分区为例进行说明:在产品的BoardConfig.mk中定义:BOARD_WITH_SPECIAL_PARTITIONSlike: BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M,logo:16M

```text
device/rockchip/rk3576/rk3576_u/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -494,4 +494,11 @@ ifeq ($(strip $(BOARD_TWRP_ENABLE)), true)
+BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
```

在RebuildParameter.mk中添加BOARD_WITH_SPECIAL_PARTITIONS

```text
device/rockchip/common/build/rockchip/RebuildParameter.mk
+ifneq ($(strip $(BOARD_WITH_SPECIAL_PARTITIONS)), )
+partition_list := $(partition_list),$(BOARD_WITH_SPECIAL_PARTITIONS)
+endif
```

## Android常用配置

### 新建产品lunch

进入device/rockchip/rk3576目录。在device/rockchip/rk3576目录下创建一个名为rk3576_new_u的新目录。参考device/rockchip/rk3576目录下已有的rk3576_u产品目录进行创建。你可以首先复制rk3576_u目录,然后将其重命名为rk3576_new_u。你可以使用以下命令复制目录:

```text
cp -r rk3576_u rk3576_new_u
```

复制目录后,进入rk3576_new_u目录。将rk3576_new_u目录中的所有文件中的rk3576_u字符串替换为rk3576_new_u。你可以使用类似sed的工具或手动编辑文件进行修改。例如,你可以使用如下的sed命令:

```text
sed -i 's/rk3576_u/rk3576_new_u/g' *
```

这个命令将会在rk3576_new_u目录下的所有文件中将rk3576_u替换为rk3576_new_u。修改完文件后,你的新产品目录rk3576_new_u已经可以用于进一步的定制和开发。

## Kernel dts说明

### 新建产品dts

产品新建dts可以根据下表的配置选择对应的dts作为参考。

| Soc | PMIC | 开发板类 型 | 机型 | DTS |
| --- | --- | --- | --- | --- |
| RK3576 | RK806 | 开发板 | RK3576 EVB1 | rk3576-evb1-v10 |
| RK3576 | RK806 | 开发板 | RK3576 EVB1 + RK628 | rk3576-evb1-v10-rk628-hdmi2csi |

## 补丁发布

在redmine系统上面会不定期发布一些重要的补丁,链接如下:

```text
https://redmine.rock-chips.com/projects/rockchip_patch/issues
```

可以通过订阅的方式实时获取补丁发布的邮件通知,订阅方式如下:第一步 登入redmine系统使用已经在Rockchip注册的redmine账号登入redmine系统。第二步 进入我的账号

![原稿技术图 3](/docs/rockchip-rk3576-android14-sdk/assets/cn-p018-figure-01.png)

第三步 选择邮件通知类型如下图在邮件通知中下拉选择收取选中项目的所有通知

![原稿技术图 4](/docs/rockchip-rk3576-android14-sdk/assets/cn-p018-figure-02.png)

第四步 选择项目如下图勾选补丁发布项目,并点击保存

![原稿技术图 5](/docs/rockchip-rk3576-android14-sdk/assets/cn-p018-figure-03.png)

以上操作即完成补丁发布的订阅。

订阅成功后当Rockchip有补丁发布时即可通过在redmine上面登记的邮箱接收到邮件通知。

## 文档说明

### 外设支持列表

DDR/EMMC/NAND FLASH/WIFI/3G/CAMERA的支持列表实时更新在redmine上,链接如下:

```text
https://redmine.rockchip.com.cn/projects/fae/documents
```

### Camera IQ Tool文档

```text
external/camera_engine_rkaiq/rkisp2x_tuner/doc/
├── Rockchip_Color_Optimization_Guide_ISP2x_CN_v2.0.0.pdf
├── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.0.pdf
└── Rockchip_Tuning_Guide_ISP21_CN_v2.0.0.pdf
```

### rknn-toolkit2开发SDK和文档

```text
hardware/rockchip/rknn-toolkit2/doc/
```

### RKDocs文档说明

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
```

```text
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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
```

```text
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

## 工具使用

### StressTest

设备上使用Stresstest 工具,对待测设备的各项功能进行压力测试,确保整个系统运行的稳定性。SDK通过打开计算器应用,输入 “83991906=” 暗码,可启动StressTest应用,进行各功能压力测试。Stresstest 测试工具测试的内容主要包括:

#### 模块相关

Camera 压力测试:包括Camera 打开关闭,Camera 拍照以及Camera 切换。Bluetooth 压力测试:包括Bluetooth 打开关闭。

Wi-Fi 压力测试: 包括Wi-Fi 打开关闭,( ping 测试以及iperf 测试待加入)。

#### 非模块相关

飞行模式开关测试休眠唤醒拷机测试视频拷机测试重启拷机测试恢复出厂设置拷机测试Arm 变频测试Gpu 变频测试DDR 变频测试

### PCBA测试工具

PCBA 测试工具用于帮助在量产的过程中快速地甄别产品功能的好坏,提高生产效率。目前包括屏幕(LCD)、无线(Wi-Fi)、蓝牙(bluetooth)、DDR/EMMC 存储、SD 卡(sdcard)、USB HOST、按键(KEY),喇叭耳机(Codec)测试项目。这些测试项目包括自动测试项和手动测试项,无线网络、DDR/EMMC、以太网为自动测试项,按键、SD卡、USB HOST、Codec、为手动测试项目。具体PCBA功能配置及使用说明,请参考:

```text
RKDocs/android/Rockchip_Developer_Guide_PCBA_Test_Tool_CN&EN.pdf_V1.1_20171222.p
df。
```

### DeviceTest

DeviceTest 用于工厂整机测试,主要测试装成整机以后外围器件是否正常。SDK 通过打开计算器,输入暗码“000.=”进入 DeviceTest,如下所示:

![原稿技术图 6](/docs/rockchip-rk3576-android14-sdk/assets/cn-p027-figure-01.png)

在产线可以根据这个界面进行对应外设的测试,测试时点击“TEST CHECKED”对所测项目逐项进行测试,测试如果成功点击 pass,失败点击 failed,最终结果会显示在界面上,如下图所示,

红色为 failed 项,其余为通过项,工厂可根据测试结果进行相应的维修。另外,如果客户需要对该工具进行定制,请联系 FAE 窗口申请对应的源码。

### USB驱动

Rockchip USB驱动安装包,包括ADB、固件烧写驱动

```text
RKTools\windows\DriverAssitant_v5.1.1.zip
```

### 开发烧写工具

#### Windows版本

RKTools/windows/AndroidTool/AndroidTool_Release_v3.28.zip,工具版本会时刻更新,请及时同步更新

![原稿技术图 7](/docs/rockchip-rk3576-android14-sdk/assets/cn-p028-figure-01.png)

#### Linux版本

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
```

```text
TestDevice:             TD
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

### SD升级启动制作工具

用于制作SD卡升级、SD卡启动、SD卡PCBA测试

```text
RKTools\windows\SDDiskTool_v1.74.zip
```

### 写号工具

RKTools\windows\RKDevInfoWriteTool-1.3.0.7z解压RKDevInfoWriteTool-1.3.0.7z后安装以管理员权限打开软件

工具说明请参考:

```text
RKDocs\common\RKTools manuals\Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf
```

### DDR焊接测试工具

用于测试DDR的硬件连接,排查虚焊等硬件问题

```text
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_CN.7z
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_EN.7z
```

### efuse烧写工具

用于efuse的烧写,适用于RK3288W/RK3368/RK3399平台

```text
RKTools\windows\efuse_v1.37.rar
```

### efuse/otp签名工具

用于固件的efuse/otp签名

```text
RKTools\windows\SecureBootTool_v1.94.zip
```

### 工厂生产固件烧写工具

用于工厂批量烧写固件

```text
RKTools\windows\FactoryTool-1.72.9.7z
```

### userdata分区数据预置工具

用于制作userdata分区预置数据包的工具

```text
RKTools\windows\OemTool_v1.3.rar
```

### Camera IQ Tool

用于调试ISP图像效果

```text
external/camera_engine_rkaiq/rkisp2x_tuner
```

## 系统调试

### ADB工具

### 概述

ADB(Android Debug Bridge)是 Android SDK里的一个工具,用这个工具可以操作管理 Android 模拟器或真实的 Android 设备。主要功能有:运行设备的 shell(命令行)管理模拟器或设备的端口映射计算机和设备之间上传/下载文件将本地 apk软件安装至模拟器或 Android 设备ADB 是一个“客户端-服务器端”程序,其中客户端主要是指PC,服务器端是Android 设备的实体机器或者虚拟机。根据PC连接Android设备的方式不同,ADB 可以分为两类:网络 ADB:主机通过有线/无线网络(同一局域网)连接到STB设备USB ADB:主机通过 USB 线连接到STB设备

#### USB adb使用说明

USB adb 使用有以下限制:只支持 USB OTG 口不支持多个客户端同时使用(如 cmd 窗口,eclipse等)只支持主机连接一个设备,不支持连接多个设备连接步骤如下:

1、Android设备已经运行 Android 系统,设置->开发者选项->已连接到计算机 打开,usb调试开关打开。

2、PC主机只通过 USB 线连接到机器 USB otg 口,然后电脑通过如下命令与Android设备相连。

```text
adb shell
```

3、测试是否连接成功,运行”adb devices”命令,如果显示机器的序列号,表示连接成功。

### ADB常用命令详解

(1)查看设备情况查看连接到计算机的 Android 设备或者模拟器:

```text
adb devices
```

返回的结果为连接至开发机的 Android 设备的序列号或是IP和端口号(Port)、状态。(2)安装apk将指定的 apk 文件安装到设备上:

```text
adb install <apk文件路径>
```

示例如下:

```text
adb install “F:\WishTV\WishTV.apk”
```

重新安装应用:

```text
adb install –r “F:\WishTV\WishTV.apk”
```

(3)卸载apk完全卸载:

```text
adb uninstall <package>
```

示例如下:

```text
adb uninstall com.wishtv
```

(4)使用 rm移除 apk 文件:

```text
adb shell rm <filepath>
```

示例如下:

```text
adb shell rm “system/app/WishTV.apk”
```

示例说明:移除“system/app”目录下的“WishTV.apk”文件。(5)进入设备和模拟器的shell进入设备或模拟器的 shell 环境:

```text
adb shell
```

(6)从电脑上传文件到设备用 push 命令可以把本机电脑上的任意文件或者文件夹上传到设备。本地路径一般指本机电脑;远程路径一般指 adb 连接的单板设备。adb push <本地路径> <远程路径>示例如下:

```text
adb push “F:\WishTV\WishTV.apk” “system/app”
```

示例说明:将本地“WishTV.apk”文件上传到 Android 系统的“system/app”目录下。(7)从设备下载文件到电脑pull 命令可以把设备上的文件或者文件夹下载到本机电脑中。

```text
adb pull <远程路径> <本地路径>
```

示例如下:

```text
adb pull system/app/Contacts.apk F:\
```

示例说明:将 Android 系统“system/app”目录下的文件或文件夹下载到本地“F:\”目录下。(8)查看 bug报告需要查看系统生成的所有错误消息报告,可以运行 adb bugreport指令来实现,该指令会将 Android 系统的dumpsys、dumpstate 与 logcat 信息都显示出来。(9)查看设备的系统信息在 adb shell下查看设备系统信息的具体命令。

```text
adb shell getprop
```

### Logcat工具

Android 日志系统提供了记录和查看系统调试信息的功能。日志都是从各种软件和一些系统的缓冲区中记录下来的,缓冲区可以通过 Logcat 来查看和使用。Logcat 是调试程序用的最多的功能。该功能主要是通过打印日志来显示程序的运行情况。由于要打印的日志量非常大,需要对其进行过滤等操作。

#### Logcat命令使用

用 logcat 命令来查看系统日志缓冲区的内容:基本格式:

```text
[adb] logcat [<option>] [<filter-spec>]
```

示例如下:

```text
adb shell
logcat
```

### 常用的日志过滤方式

控制日志输出的几种方式:控制日志输出优先级示例如下:

```text
adb shell
logcat *:W
```

示例说明:显示优先级为 warning 或更高的日志信息。控制日志标签和输出优先级示例如下:

```text
adb shell
logcat ActivityManager:I MyApp:D *:S
```

示例说明:支持所有的日志信息,除了那些标签为“ActivityManager”和优先级为“Info”以上的、标签为“MyApp”和优先级为“Debug”以上的。只输出特定标签的日志示例如下:

```text
adb shell
logcat WishTV:* *:S
```

或者

```text
adb shell
logcat –s WishTV
```

示例说明:只输出标签为 WishTV的日志。只输出指定优先级和标签的日志示例如下:

```text
adb shell
logcat WishTV:I *:S
```

示例说明:只输出优先级为 I,标签为 WishTV的日志。

### Procrank工具

Procrank 是 Android 自带的一款调试工具,运行在设备侧的 shell 环境下,用来输出进程的内存快照,便于有效的观察进程的内存占用情况。包括如下内存信息:VSS:Virtual Set Size 虚拟耗用内存大小(包含共享库占用的内存)RSS:Resident Set Size 实际使用物理内存大小(包含共享库占用的内存)PSS:Proportional Set Size 实际使用的物理内存大小(比例分配共享库占用的内存)USS:Unique Set Size 进程独自占用的物理内存大小(不包含共享库占用的内存)注意:USS 大小代表只属于本进程正在使用的内存大小,进程被杀死后会被完整回收;VSS/RSS 包含了共享库使用的内存,对查看单一进程内存状态没有参考价值;PSS 是按照比例将共享内存分割后,某单一进程对共享内存区的占用情况。

#### 使用procrank

执行procrank前需要先让终端获取到root权限su命令格式:

```text
procrank [ -W ] [ -v | -r | -p | -u | -h ]
```

常用指令说明:-v:按照 VSS 排序-r:按照 RSS 排序-p:按照 PSS 排序-u:按照 USS 排序-R:转换为递增[递减]方式排序-w:只显示 working set 的统计计数-W:重置 working set 的统计计数-h:帮助示例:输出内存快照:

```text
procrank
```

按照 VSS 降序排列输出内存快照:

```text
procrank –v
```

默认procrank输出是通过PSS排序。

#### 检索指定内容信息

查看指定进程的内存占用状态,命令格式如下:

```text
procrank | grep [cmdline | PID]
```

其中 cmdline 表示需要查找的应用程序名,PID 表示需要查找的应用进程。输出 systemUI 进程的内存占用状态:

```text
procrank | grep “com.android.systemui”
```

或者:

```text
procrank  | grep 3396
```

#### 跟踪进程内存状态

通过跟踪内存的占用状态,进而分析进程中是否存在内存泄露场景。使用编写脚本的方式,连续输出进程的内存快照,通过对比 USS 段,可以了解到此进程是否有内存泄露。示例:输出进程名为 com.android.systemui 的应用内存占用状态,查看是否有泄露:

1、编写脚本 test.sh

```text
#!/bin/bash
while true;do
adb shell procrank | grep “com.android.systemui”
sleep 1
done
```

2、通过 adb 工具连接到设备后,运行此脚本:./test.sh

### Dumpsys工具

Dumpsys 工具是 Android系统中自带的一款调试工具,运行在设备侧的 shell 环境下,提供系统中正在运行的服务状态信息功能。正在运行的服务是指 Android binder机制中的服务端进程。dumpsys 输出打印的条件:

1、只能打印已经加载到 ServiceManager中的服务;

2、如果服务端代码中的 dump 函数没有被实现,则没有信息输出。

#### 使用Dumpsys

查看Dumpsys帮助作用:输出dumpsys帮助信息。

```text
dumpsys  -help
```

查看Dumpsys包含服务列表作用:输出dumpsys所有可打印服务信息,开发者可以关注需要调试服务的名称。

```text
dumpsys  -l
```

输出指定服务的信息作用:输出指定的服务的 dump 信息。格式:dumpsys [servicename]示例:输出服务 SurfaceFlinger的信息,可执行命令:

```text
dumpsys SurfaceFlinger
```

输出指定服务和应有进程的信息作用:输出指定服务指定应用进程信息。格式:dumpsys [servicename] [应用名]示例:输出服务名为 meminfo,进程名为 com.android.systemui 的内存信息,执行命令:

```text
dumpsys meminfo com.android.systemui
```

注意:服务名称是大小写敏感的,并且必须输入完整服务名称。

### Last log 开启

在dts文件里面添加下面两个节点

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
- 在机器中查看last log
130|root@rk3399:/sys/fs/pstore # ls
dmesg-ramoops-0   上次内核panic后保存的log。
pmsg-ramoops-0    上次用户空间的log，android的log。
ftrace-ramoops-0    打印某个时间段内的function trace。
console-ramoops-0  last_log 上次启动的kernel log，但只保存了优先级比默认log level 高的
log。
```

使用方法:

```text
cat dmesg-ramoops-0
cat console-ramoops-0
logcat -L （pmsg-ramoops-0） 通过logcat 取出来并解析pull out by logcat and parse
cat ftrace-ramoops-0
```

### FIQ模式

当设备死机或者卡住的时候可以在串口输入fiq命令查看系统的状态,具体命令如下:

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

## 常见问题

### 当前kernel和u-boot版本?

Android 14.0 对应 kernel 6.1，U-Boot 分支为 next-dev。

### 如何获取当前SDK对应的RK release版本

Rockchip Android14.0 SDK包括AOSP原始代码和RK修改的代码两部分,其中RK修改的仓库包含在 .repo/manifests/include 目录下面的xml中,AOSP默认的仓库在 .repo/manifests/default.xml 。版本确认:

RK修改部分

```text
vim .repo/manifests/include/rk_checkout_from_aosp.xml
<project groups="pdk" name="platform/build" path="build/make" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1">
```

说明RK的版本是android-14.0-mid-rkr1AOSP部分

```text
vim .repo/manifests/default.xml
<default revision="refs/tags/android-14.0.0_r11"...>
```

说明AOSP的版本是android-14.0.0_r11当需要提供版本信息的时候提供以上两个版本信息即可。单个仓库可以直接通过如下命令获取tag信息

```text
kernel-6.1$ git tag
android-14.0-mid-rkr1
```

RK的版本是以android-14.0-mid-rkrxx的格式递增的,所以当前的最新tag是android-14.0-mid-rkr1

### 如何确认本地SDK已经完整更新RK发布的SDK状态

RK发布SDK版本时会在.repo/manifests/commit/目录下对应提交该版本的commit信息,客户可以通过对比这个commit信息来确认是否有完整更新SDK,具体操作如下:按“如何获取当前SDK对应的RK release版本”的说明先确认SDK的RK版本,下面以RK版本是RKR1为例进行说明;用如下命令保存本地的commit信息

```text
.repo/repo/repo manifest -r -o release_manifest_rkr1_local.xml
```

通过比较.repo/manifests/commit/commit_release_rkr1.xml和release_manifest_rkr1_local.xml,即可确认SDK代码是否更新完整,其中.repo/manifests/commit/commit_release_rkr1.xml为RK版本RKR6发布的commit信息。

### uboot和kernel阶段logo图片替换

uboot和kernel阶段的logo分别为开机显示的第一张和第二张logo图片,可以根据产品需求进行修改替换。uboot logo源文件: kernel-6.1/logo.bmpkernel logo源文件: kernel-6.1/logo_kernel.bmp如果需要更换某一张,只需用同名的bmp替换掉,重新编译内核即可,编译后的文件在boot.img中。

说明:Logo图片大小目前只支持到8M以内大小的bmp格式图片,支持8、16、24、32位的bmp。

### 如何修改Android系统仅支持64位系统

Android14开始过GMS和EDLA认证的产品要求配置为仅支持64位的系统,不再支持32位的。修改为仅支持64位的系统,可以可以减少内存占用,具体修改如下(以rk3576_u为例说明):在产品目录的BoardConfig.mk中修改对应的配置,如下

```text
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
```

```text
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

### 关机充电和低电预充

关机充电和低电预充可以在dts中配置,具体如下:

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

其中:rockchip,uboot-charge-on :uboot关机充电,与android关机充电互斥rockchip,android-charge-on :android关机充电,与uboot关机充电互斥rockchip,uboot-low-power-voltage :配置低电预充到开机的电压,可以根据实际需求进行配置rockchip,screen-on-voltage:配置低电预充到亮屏的电压,可以根据实际需求进行配置

### Uboot阶段充电图片打包和替换

充电图片路径,可以直接替换同名文件,格式要求与原文件一样。

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

如果打开uboot充电,但是没有显示充电图片,可能是图片没有打包到resource.img中,可以按如下命令打包

```text
cd u-boot
./scripts/pack_resource.sh ../kernel-6.1/resource.img
cp resource.img ../kernel/resource.img
```

执行以上命令后uboot充电图片会打包到kernel目录的resource.img中,此时需要再将resource.img打包到boot.img中,可以在android根目录执行./mkiamge.sh,然后烧写rockdev/下面的boot.img即可。

### HDMI IN配置

hdmi in功能SDK默认是关闭的,如需打开,按以下操作:

```text
vim device/rockchip/rk3588/BoardConfig.mk
+BOARD_HDMI_IN_SUPPORT := true
```

### RM310 4G配置

4G功能SDK默认是关闭的,如需打开,按以下操作:

```text
vim device/rockchip/common/BoardConfig.mk
#for rk 4g modem
-BOARD_HAS_RK_4G_MODEM ?= false
+BOARD_HAS_RK_4G_MODEM ?= true
```

### WIFI休眠策略配置

wifi默认休眠策略是休眠一直保持连接,如需休眠断开,按以下操作:

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

### Recovery旋转配置

支持Recovery旋转0/90/180/270度,默认不旋转(即旋转0度),旋转配置说明如下:

```text
vim device/rockchip/common/BoardConfig.mk
#0:   ROTATION_NONE 旋转0度
#90:  ROTATION_RIGHT 旋转90度
#180: ROTATION_DOWN 旋转180度
#270: ROTATION_LEFT 旋转270度
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

### Android Surface旋转

Android系统显示旋转,可以修改如下配置,配置参数为0/90/180/270

```text
# For Surface Flinger Rotation
SF_PRIMARY_DISPLAY_ORIENTATION ?= 0
```

### 替换 AOSP 部分源代码的 remote

客户下载RK的release代码时速度较慢,可以将AOSP的remote修改为国内镜像源,国外的客户可以修改为Google的镜像源。这样可以提高下载速度。具体操作方法如下:执行repo init(或者解压base包)后,修改.repo/manifests/remote.xml,把其中的 AOSP 这个remote 的 fetch 从

```text
< remote name="aosp" fetch="./" review="https://10.10.10.29" />
```

改为国内客户:(国内以清华大学镜像源为例,可以根据需要修改为其他国内镜像源)

```text
< remote name="aosp" fetch="https://aosp.tuna.tsinghua.edu.cn" />;
```

国外的客户:(Google镜像源)

```text
< remote name="aosp" fetch="https://android.googlesource.com" />
```

### Data区读写速率的优化

针对带电池的设备,建议fstab的data分区挂载参数加上‘fsync_mode=nobarrier’,可以较大的提升存储读写速率,提升性能。这个参数对不带电池的设备存在掉电数据损害的风险,所以不建议不带电池的设备加这个参数。修改补丁如下:

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
```

```text
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
diff --git a/scripts/fstab_tools/fstab_go.in b/scripts/fstab_tools/fstab_go.in
index 582557f2..05c7653c 100755
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

### userdata区文件系统换为EXT4

默认data分区的文件系统为f2fs,建议不带电池的产品可以将data区的文件系统改为ext4,可以减小异常掉电后数据丢失的概率。修改方法如下:以rk3566_r为例说明:

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
```

```text
-#/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
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

### 修改开关机动画和开关机铃声

参考文档:

```text
RKDocs\android\Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Cus
tomization_CN&EN.pdf
```

### APP设置性能模式

device/rockchip/rk3xxx/下配置文件:package_performance.xml,在其中的节点中加入需要使用性能模式的包名:(使用 aapt dump badging (file_path.apk)获取包名)

```text
< app package="包名" mode="是否启用加速，启用为 1，关闭为 0"/>
```

例如针对安兔兔的参考如下:

```text
< app package="com.antutu.ABenchMark"mode="1"/>
< app package="com.antutu.benchmark.full"mode="1"\/>
< app package="com.antutu.benchmark.full"mode="1"\/>
```

编译时会将文件打包进固件。

### GPU相关问题排查方法

参考下面文档,可以做初步的问题排查

```text
RKDocs\android\Rockchip_User_Guide_Dr.G_CN&EN.pdf
```

### OTP和efuse说明

OTP支持芯片RK3326PX30RK3566RK3568RK3588EFUSE支持芯片RK3288RK3368RK3399固件签名和otp/efuse烧写参考文档

```text
RKDocs\common\security\Rockchip-Secure-Boot-Application-Note-V1.9.pdf
```

### 代码中如何判断设备的OTP/EFUSE是否已经烧写

OTP/EFUSE的状态会通过kernel的cmdline进行传递,cmdline中的fuse.programmed用来标识OTP/EFUSE状态,具体如下:"fuse.programmed=1":软件固件包已经进行了secure-boot签名,硬件设备的efuse/otp已经被烧写。"fuse.programmed=0":软件固件包已经进行了secure-boot签名,硬件设备的efuse/otp没有被烧写。cmdline中没有fuse.programmed:软件固件包没有进行secure-boot签名(Miniloader不传递),或者Miniloader太旧没有支持传递。

### 开关selinux

如下修改,false为关闭,true为打开

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

### 开机弹出”Android系统出现问题”警告

出现警告框的原因有两种:

1. 固件不匹配,system/boot/vendor三个fingerprint不一致,不是同一套固件。

2. 机器打开支持了IO调试功能的config,编译时,使用文档前面所说的内核编译命令即可关闭。

3. 对于需要使用IO调试功能的项目,可以直接不管上述两种原因,直接合入frameworks/base下的patch去掉弹窗:

```text
diff --git
a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
index 595c340..d4e495a 100644
--- a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
+++ b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
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

### 如何打开设置中以太网的设置项

系统设置中默认没有以太网设置的选项,如果项目中需要以太网可以按如下配置打开:

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

### 关于AVB和security boot的操作

AVB和security boot的操作参考文档

```text
RKDocs/common/security/RK356X_SecurityBoot_And_AVB_instructions_CN.pdf
```

### IO命令无法使用

IO命令需要依赖DEVMEM,而DEVMEM默认是关闭的,所以导致IO默认无法使用,如果调试需要使用IO命令可以按如下修改:

```text
wlq@ubuntu:~/rk3562_Android14.0/$ vim mkcombinedroot/configs/android-14.config
```

如果是GO的产品则需要修改:

```text
wlq@ubuntu:~/rk3562_Android14.0$ vim mkcombinedroot/configs/android-14-go.config
```

删除掉下面这行:

```text
# CONFIG_DEVMEM is not set
```

如果要编译Android,则还需要修改如下代码

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

### SN号的命令规则

SN号必须以字母开头,长度14个字节以内。

### Kernel编译报LZ4的错误

Kernel编译l的时候报如下错误:

![原稿技术图 8](/docs/rockchip-rk3576-android14-sdk/assets/cn-p046-figure-01.png)

问题原因:系统自带的lz4版本太低,要求1.8.3及以上版本

```text
wlq@ubuntu:~$ lz4 -v
*** LZ4 command line interface 64-bits v1.8.3, by Yann Collet ***
refusing to read from a console
```

解决方法:直接拷贝android编译出来的lz4覆盖系统的lz4

```text
sudo cp out/host/linux-x86/bin/lz4 /usr/bin/lz4
```

### Android Samba功能

参考文档

```text
RKDocs/android/Rockchip_Introduction_Android_Samba_CN.pdf
```

### NFS启动

参考文档及补丁:

```text
RKDocs/android/patches/customized_functions/nfs_boot_patch_v1.1.0.zip
```

### RK3528 DDR 4BIT Loader修改

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

## 多屏异显异触

参考文档

```text
RKDocs\android\patches\customized_functions/Android11异显开发说明.zip
```

## 多屏异声

参考文档

```text
RKDocs/android/patches/customized_functions/Dual_Audio_v1.0.zip
```

## 附录 A：编译开发环境搭建

### 初始化编译环境

本节保留原稿历史环境说明：在本地搭建 Android 源码编译环境需要 Linux 或 Mac OS，原稿不支持 Windows。代码审核与更新流程参见 Life of a Patch。命令前的美元符号 `$` 用来区分命令与输出或文件内容；复制执行时不包含 `$`。原网页的复制按钮或三击选行说明不适用于本文。

### 选择分支

部分环境要求由待编译源码版本决定。可用分支列表参见 Build Numbers。原稿将最新分支称为 master，并说明初始化仓库时省略分支参数即可选用它；这是历史上游说明，不是要求 RK3576 Android 14 SDK 改用 master。选定分支后按对应环境要求配置。

### 搭建 Linux 编译环境

原稿称这些说明适用于包括 master 在内的分支，内部常规测试环境为 Ubuntu LTS 14.04 和 Debian testing，其他发行版通常也有相应工具。Gingerbread 2.3.x 及以后版本（包括原稿的 master）要求 64 位环境。

更早版本可在 32 位系统编译。完整硬件和软件要求参见 Requirements，再按 Ubuntu 或 Mac OS 的详细步骤配置。以上均为原稿历史说明，不能取代本 SDK 正文的环境要求。

### 安装 JDK

原稿所述 AOSP master 在 `prebuilts/jdk/` 下自带预编译 OpenJDK，无需额外安装。旧 Android 版本需要单独安装 JDK；Ubuntu 使用 OpenJDK，准确版本参见 JDK Requirements。Ubuntu ≥15.04 的历史命令如下：

```text
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

Ubuntu LTS 14.04：原稿没有可用的受支持 OpenJDK 8 软件包，曾在 14.04 成功使用 Ubuntu 15.04 的 OpenJDK 8 包；15.10、16.04 等更新包按下列步骤未能在 14.04 工作。

1. 从 `old-releases.ubuntu.com` 下载 64 位架构的 `.deb` 软件包：

```text
openjdk-8-jre-headless_8u45-b14-1_amd64.deb with SHA256
0f5aba8db39088283b51e00054813063173a4d8809f70033976f83e214ab56c0
openjdk-8-jre_8u45-b14-1_amd64.deb with SHA256
9ef76c4562d39432b69baf6c18f199707c5c56a5b4566847df908b7d74e15849
openjdk-8-jdk_8u45-b14-1_amd64.deb with SHA256
6e47215cf6205aa829e6a0a64985075bd29d1f428a4006a80c9db371c2fc3c4c
```

2. 可用各软件包列出的 SHA256 值校验下载文件，例如使用 `sha256sum`：

```text
sha256sum {downloaded.deb file}
```

3. 安装软件包：

```text
sudo apt-get update
```

对下载的每个 `.deb` 运行 dpkg；可能报缺少依赖：

```text
sudo dpkg -i {downloaded.deb file}
```

修复缺少的依赖：

```text
sudo apt-get -f install
```

可选：在上述 Ubuntu 版本更新默认 Java 版本：

```text
sudo update-alternatives --config javasudo update-alternatives --config javac
```

若编译报 Java 版本错误，参见 Wrong Java version 的原因与解决办法。安装所需软件包（Ubuntu 14.04）：原稿要求 64 位 Ubuntu，并历史性地推荐 14.04；这不是本文对当前 SDK 的推荐。

```text
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl
zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-
core-dev libx11-dev lib32z-dev ccache libgl1-mesa-dev libxml2-utils xsltproc
unzip python-pyelftools python3-pyelftools device-tree-compiler libfdt-dev
libfdt1 libssl-dev liblz4-tool python-dev
```

使用 SELinux 工具分析策略时，还需安装 `python-networkx`；使用 LDAP 且需要运行 ART 主机测试时，还需安装 `libnss-sss:i386`。

### 配置 USB 访问权限

在 GNU/Linux（尤其 Ubuntu）上，普通用户默认不能直接访问 USB 设备，需要配置权限。原稿方法是以 root 创建 `/etc/udev/rules.d/51-android.rules` 并填入下列规则；将规则中的用户占位符替换为获准通过 USB 访问设备的实际用户名。

```text
# adb protocol on passion (Rockchip products)
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", ATTR{idProduct}=="0010", MODE="0600",
OWNER="<username>"
```

新规则在下次连接设备时生效，可能需要拔插设备。原稿确认的环境是 Ubuntu Hardy Heron 8.04.x LTS 和 Lucid Lynx 10.04.x LTS；其他 Ubuntu 或 GNU/Linux 版本可能需要不同配置。历史参考：http://source.android.com/source/initializing.html

## 附录 B SSH公钥操作说明 SSH public key operation instruction

### 附录 B-1 SSH公钥生成 SSH public key generation

使用如下命令生成:

```text
ssh-keygen -t rsa -C "user@host"
```

请将user@host替换成您的邮箱地址。

![原稿技术图 9](/docs/rockchip-rk3576-android14-sdk/assets/cn-p050-figure-01.png)

命令运行完成会在你的目录下生成key文件。

![原稿技术图 10](/docs/rockchip-rk3576-android14-sdk/assets/cn-p050-figure-02.png)

请妥善保存生成的私钥文件id_rsa和密码,并将id_rsa.pub发邮件给SDK发布服务器的管理员。

### 附录 B-2 使用key-chain管理密钥 Use key-chain to manage the key

推荐您使用比较简易的工具keychain管理密钥。具体使用方法如下:

1. 安装keychain软件包:

```text
$sudo aptitude install keychain
```

2. 配置使用密钥:

```text
$vim ~/.bashrc
```

增加下面这行:

```text
eval `keychain --eval ~/.ssh/id_rsa`
```

其中,id_rsa是私钥文件名称。以上配置以后,重新登录控制台,会提示输入密码,只需输入生成密钥时使用的密码即可,若无密码可不输入。另外,请尽量不要使用sudo或root用户,除非您知道如何处理,否则将导致权限以及密钥管理混乱。

### 附录 B-3 多台机器使用相同ssh公钥 Multiple devices use the same ssh public key

在不同机器使用,可以将你的ssh私钥文件id_rsa拷贝到要使用的机器的“~/.ssh/id_rsa”即可。在使用错误的私钥会出现如下提示,请注意替换成正确的私钥。

![原稿技术图 11](/docs/rockchip-rk3576-android14-sdk/assets/cn-p051-figure-01.png)

添加正确的私钥后,就可以使用git 克隆代码,如下图。

![原稿技术图 12](/docs/rockchip-rk3576-android14-sdk/assets/cn-p051-figure-02.png)

添加ssh私钥可能出现如下提示错误。

```text
Agent admitted failture to sign using the key
```

在console输入如下命令即可解决。

```text
ssh-add ~/.ssh/id_rsa
```

### 附录 B-4 一台机器切换不同ssh公钥 Switch different ssh public keys on one device

可以参考ssh_config文档配置ssh。

```text
~$ man ssh_config
```

![原稿技术图 13](/docs/rockchip-rk3576-android14-sdk/assets/cn-p052-figure-01.png)

通过如下命令,配置当前用户的ssh配置。

```text
~$ cp /etc/ssh/ssh_config ~/.ssh/config
~$ vi .ssh/config
```

如图,将ssh使用另一个目录的文件“~/.ssh1/id_rsa”作为认证私钥。通过这种方法,可以切换不同的密钥。

![原稿技术图 14](/docs/rockchip-rk3576-android14-sdk/assets/cn-p052-figure-02.png)

### 附录 B-5 密钥权限管理 Key authority management

服务器可以实时监控某个key的下载次数、IP等信息,如果发现异常将禁用相应的key的下载权限。请妥善保管私钥文件。并不要二次授权与第三方使用。

### 附录 B-6 Git权限申请说明 Git authority application instruction

按上述步骤生成公钥文件，通过 SDK 发布方的授权渠道申请 SDK 代码下载权限；只提交公钥，不提交私钥或口令。

## 版本差异与使用前核对

中英文均为 V1.0.0，版本背景为 Android 14 RKR4。中文文档编号 789（53 页），英文编号 790（57 页）。正文、FAQ、附录 A/B 完整保留；中文使用中文原图，英俄德使用英文原图，图中原始界面文字不改写。

- 中文同步/合并示例使用 `android-14.0-mid-rkr4`，英文仍用 `android-14.0-mid-rkr1`；版本历史输出也不同。下方补充中文 RKR4 命令。正文后面的 FAQ 还有 RKR1/RKR6 文件名交错，不能据这些示例混用 SDK 发布包。
- 中文 lunch 表明确默认 DTS 为 `rk3576-evb1-v10.dts`；英文省略。中文一键编译帮助末行为 `lunch rk3576_u-userdebug`，英文残留 `lunch rk3588_t-userdebug`，后者不属于本 RK3576 Android 14 目标。中文完整命令示例为 `./build.sh -UKAup`；表中另一示例是 `./build.sh -AUCKu`，选项及大小写必须按该版本脚本核对。
- 中文说明 GKI 默认关闭，补丁将 `BOARD_BUILD_GKI := false` 改为 `true`，并说明开启后自动启用 A/B；英文补丁相同，但随后文字说设为 false 时 A/B 关闭。不要把 false 当作启用方法。super.img 中文含 odm、vendor、system、product、system_ext，英文表仅列前三项；实际以产品分区配置为准。
- 禁用 32 位支持的中文补丁目标为 `rk3576_u/BoardConfig.mk`，英文误沿用 `rk3562_ugo/BoardConfig.mk` 和 `rk3562-rk817-tablet-v10`。保留原示例并在文末补充中文对应补丁，不可直接把 RK3562 路径应用到 RK3576。
- OTP 支持列表英文额外列 RK3568S；两稿的历史列表均未据此证明 RK3576 支持情况。trust.img 表的 RK3566/RK3568 例外也不能套用 RK3576。镜像说明中的 ramdis 为原稿拼写；boot-debug.img 行又称“此 boot.img”，实际操作需核对调试镜像。
- `logcat ActivityManager:I MyApp:D *:S` 是仅放行这两个标签相应等级及更高等级，其余静默，并非排除这两个标签。`WishTV:I` 包含 I 及更高等级，不是只输出 I。ADB 单客户/单主机的描述保留为原稿使用模型，不应泛化为所有 ADB 版本的协议限制。
- 原稿的 `mkiamge.sh` 拼写、Android_T/Android_U、`@android_t`/`@android_u`、历史分支标签等可能是遗留示例，使用前对照实际 SDK；不擅自替换代码标识。关闭镜像兼容性警告不代表解决了不兼容问题。
- 附录 A 的 Ubuntu 14.04、OpenJDK 8、master 等为历史上游说明，不是 Android 14 当前环境建议，优先遵循本文 SDK 正文和实际发布包要求。F2FS `fsync_mode=nobarrier` 有掉电丢失风险，电池供电也不能消除全部风险；EXT4 也不保证绝对掉电安全。
- 刷写、分区调整和恢复出厂会清除数据；先备份并确认板卡、镜像和分区表。OTP/eFuse 写入可能不可逆。SSH 附录示例涉及私钥复制、authorized_keys 和权限修改，只能在授权环境执行，勿清空既有授权文件、外传私钥或口令；申请下载权限只提交公钥。


### 中文基准补充：RKR4 合并和 RK3576 64 位配置

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

官方资料入口: [Rockchip](https://www.rock-chips.com/) · [Android](https://source.android.com/) · [ArmSoM](https://docs.armsom.org/).

{% endraw %}
