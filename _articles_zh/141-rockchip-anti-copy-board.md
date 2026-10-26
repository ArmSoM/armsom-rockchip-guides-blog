---
title: "Rockchip 防抄板开发指南：初级、中级和高级方案"
description: "Rockchip 防抄板开发指南：初级、中级和高级方案 — V1.2.0."
translation_key: "141-rockchip-anti-copy-board"
slug: "141-rockchip-anti-copy-board"
lang: "zh"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE, Security]
excerpt: "Rockchip 防抄板开发指南：初级、中级和高级方案 — V1.2.0."
---

{% raw %}

依据中英文 V1.2.0 原稿（各17页）完整整理。作为 ArmSoM 平台参考，使用前须核对具体 SoC 的 OTP、TEE、U-Boot、rk_tee_user 与 SDK/BSP 配套；原稿未指定统一内核版本，不代表所有 ArmSoM 板卡均支持。支持平台按各方案单列。本文未做 ArmSoM 硬件验证，所有命令和输出均为原厂示例。

> OTP写入和密钥锁定可能不可逆，错误会使设备无法启动或数据无法恢复；发布文章不等于授权执行。应先在专用测试板验证并备妥密钥管理、恢复与量产流程。本次仅整理文档，未运行任何烧写、锁定或安全配置命令。原稿4.4前句误称“中级方案”，图位于高级方案章；原文信息保留。英文PDF的工具截图也含中文UI文字，并非另有全英文界面图。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1. 概述

Rockchip 芯片提供防抄板技术,保护客戶的固件、私有数据、核心代码。防抄板技术主要用于防止客戶的固件和私有数据被非授权用戶非法拷⻉并使用,避免被抄板造成商业上的损失。本文档介绍防抄板技术的三种方案:初级方案中级方案高级方案客戶可自由选择使用其中一种方案。

## 2. 初级方案

### 2.1 原理

Rockchip 芯片在生产时会烧写 CPUID 到 OTP,每颗芯片都拥有唯一的 CPUID,客戶可以读取 CPUID,使用对称密钥 Key 加密得到 ENC-CPUID,客戶可以将 ENC-CPUID 存储到 vendor storage 分区,系统启动后从 vendorstorage 分区读取 ENC-CPUID 并解密得到 DEC-CPUID,比较 DEC-CPUID 和 CPUID 是否匹配,如果匹配失败则认为非法,重新启动设备,从而达到防抄板目的。

![图1：中文原稿第4页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p004-figure-01.png)

*图1：中文原稿第4页技术图/工具截图*

本方案安全性取决于对密钥 Key 的保护,客戶应该避免明文密钥直接固化在代码中,建议混淆密钥后再固化到代码中,防止非法用戶反汇编获取到明文密钥。另外,ENC-CPUID 存储于 vendor storage 分区,擦除 flash 会清空 vendor storage 分区导致 ENC-CPUID 丢失,所以擦除 flash 后需要重新烧写 ENC-CPUID。

### 2.2 支持平台

芯片内包含 OTP 的平台都支持。客戶可查看 /sys/bus/nvmem/devices/rockchip-otp0/nvmem 节点,若节点存在则说明平台支持该方案。

### 2.3 应用步骤

初级方案的应用步骤如下:

1. 客戶生成自定义私有对称密钥 Key,从 OTP 读取 CPUID,使用对称密钥 Key (AES 算法)加密得到 ENC-CPUID。

2. 写入 ENC-CPUID 到 vendor storage 分区,混淆密钥增加安全性,将混淆密钥 Key 固化在应用代码中。

3. APP 运行起来后从 vendor storage 分区读取得到 ENC-CPUID,使用密钥 Key 解密 ENC-CPUID 得到 DEC-CPUID,读取 CPUID。

4. 比较 DEC-CPUID 和 CPUID 是否匹配,APP 根据匹配结果选择正常运行或者立即重启。

### 2.4 完整流程图

初级方案的完整流程图如下所示:

![图2：中文原稿第6页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p006-figure-01.png)

*图2：中文原稿第6页技术图/工具截图*

### 2.5 参考案例

1. 使用 BoardProofTool 工具写入 ENC-CPUID。设备开机时⻓按 recovery 键进入Loader状态。客戶先创建 low.bin 文件,以16进制格式编辑该文件,写入32字节密钥。打开 BoardProofTool.exe 工具,点击 “密钥” 选择 low.bin 文件,点击 “执行” 即可。

![图3：中文原稿第7页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p007-figure-01.png)

*图3：中文原稿第7页技术图/工具截图*

BoardProofTool 工具底层调用 U-Boot 中 rkusb_do_read_otp 函数读取到 CPUID,工具自动使用密钥加密CPUID 得到 ENC-CPUID,工具调用 U-Boot 中 vendor_storage_write 函数写入 ENC-CPUID。

2. UserSpace 层使用 rk_anti_copy_board 写入 ENC-CPUID。rk_anti_copy_board 源码位于 rk_tee_user/v2/host/rk_anti_copy_board 目录下。安卓编译命令:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Linux编译命令:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

测试命令:

```text
root@RK3588:/# rk_anti_copy_board low_gen
generate enc_cpuid success!
```

3. UserSpace 层使用 rk_anti_copy_board 验证设备合法性。测试命令:

```text
root@RK3588:/# rk_anti_copy_board low_verify
verify success!
```

## 3. 中级方案

### 3.1 原理

Rockchip 芯片在 OTP 中有预留空间供客戶存储防抄板私有数据,客戶生成自定义私有数据 DATA 和 MAC,客戶自定义特定函数func,其中 DATA 和 MAC 满足特定函数转换关系,比如 MAC = func(DATA),客戶可以在 OTP 区域写入防抄板私有数据 DATA,将 MAC 固化在可信应用 TA(Trust Application) 代码中。系统启动后调用可信应用 TA 从 OTP中读取到防抄板私有数据 DATA,可信应用 TA 判断 DATA 和 MAC 间是否存在给定的函数转换关系,如果匹配失败则认为非法,重新启动设备,从而达到防抄板目的。

![图4：中文原稿第8页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p008-figure-01.png)

*图4：中文原稿第8页技术图/工具截图*

本方案安全性取决于对防抄板私有数据 DATA 的保护,内核端无法读取该数据,只有可信应用 TA(Trust Application)可以读取到该数据,客戶应该参考《Rockchip_Developer_Guide_TEE_SDK_CN.md》文档中 “TA签名” 章节,使用自己的密钥对可信应用 TA(Trust Application) 进行签名,避免非法 TA 运行而造成防抄板私有数据 DATA 泄露。

### 3.2 支持平台

RV1109、RV1126、RK3566、RK3568、RK3588、RK3528、RK3562、RV1106、RK3576、RV1103B、RK3506、RV1126B

### 3.3 应用步骤

中级方案的应用步骤如下:

1. 客戶生成自定义私有数据 DATA,选择特定转换函数 func,计算得到 MAC = func(DATA)。

2. 写入防抄板私有数据 DATA 到 OTP 中,开发可信应用 TA,将 MAC 固化在 TA 代码中。

3. APP 运行起来后调用可信应用 TA,可信应用 TA 从 OTP 读取到防抄板私有数据 DATA,可信应用 TA 计算 DATA和 MAC 是否匹配并返回匹配结果。

4. APP 根据匹配结果选择正常运行或者立即重启。

### 3.4 完整流程图

中级方案的完整流程图如下所示:

![图5：中文原稿第10页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p010-figure-01.png)

*图5：中文原稿第10页技术图/工具截图*

### 3.5 参考案例

1. 使用 BoardProofTool 工具写入防抄板私有数据 DATA 到 OTP 中。设备开机时⻓按 recovery 键进入Loader状态。客戶先创建 mid.bin 文件,以16进制格式编辑该文件,写入16字节防抄板私有数据。打开 BoardProofTool.exe 工具,点击 “数据” 选择 mid.bin 文件,点击 “执行” 即可。(注意:OTP是一次性可编程存储,每台设备只能写入一次防抄板私有数据)

![图6：中文原稿第11页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p011-figure-01.png)

*图6：中文原稿第11页技术图/工具截图*

2. UserSpace 层使用 rk_anti_copy_board 写入防抄板私有数据 DATA 到 OTP 中。rk_anti_copy_board 源码位于 rk_tee_user/v2/host/rk_anti_copy_board 目录下。安卓编译命令:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libteec.so /vendor/lib64
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\tee-supplicant /vendor/bin
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Linux编译命令:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1 /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

测试命令:

```text
root@RK3588:/# rk_anti_copy_board mid_gen
save data into OTP success!
```

3. UserSpace 层使用 rk_anti_copy_board 验证设备合法性。测试命令:

```text
root@RK3588:/# tee-supplicant &
root@RK3588:/# rk_anti_copy_board mid_verify
I/TA: Hello!
I/TA: verify success!
I/TA: Goodbye!
```

## 4. 高级方案

### 4.1 原理

Rockchip 芯片在 OTP 中有预留空间供客戶存储自定义的私有密钥,使用方法请参考《Rockchip_Developer_Guide_OTP_CN.md》中 "OEM Cipher Key" 章节,防抄板技术依赖于芯片 OTP 内存储的用戶私有密钥 OEM Cipher Key,此密钥在工厂阶段生产时写入,为保证密钥不泄露,系统只提供烧写接口没有读取接口,部分平台还支持 Hardware Read 功能用于锁定密钥,锁定密钥后该密钥无法被CPU读取,安全性更高。客戶可以自行定制明文数据 data,使用私有密钥 OEM Cipher Key 并采用 AES 算法加密 data,得到密文数据 enc-data 并存放到 flash 上指定位置,也可以固化在代码中,在应用程序代码中设置明文数据 data。系统启动后,先使用私有密钥 OEM Cipher Key 解密密文数据 enc-data 得到解密数据 dec-data,将解密数据 dec-data 和应用程序代码中明文数据 data 进行对比。如果明文数据 data 或者密文数据 enc-data被篡改,或者 flash 固件被非法拷⻉到其他非授权芯片平台,则会出现解密数据 dec-data 和明文数据 data 不匹配,匹配失败则认为非法,重新启动设备,从而达到防抄板目的。

![图7：中文原稿第13页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p013-figure-01.png)

*图7：中文原稿第13页技术图/工具截图*

本方案优点:用戶私有密钥 OEM Cipher Key被锁定后不可被 CPU 读取,具有更高的保密性、完整性和不可篡改等安全特性。

### 4.2 支持平台

RV1109、RV1126、RK3566、RK3568、RK3588、RK3528、RK3562、RV1106、RK3576、RV1103B、RK3506、RV1126B其中 RK3588、RK3528、RK3562、RK3576 、RK3506、RV1126B支持锁定密钥。

### 4.3 应用步骤

高级方案的应用步骤如下:

1. 客戶生成自定义私有密钥 OEM Cipher Key,往 OTP 中写入 OEM Cipher Key 并锁定该密钥。

2. 在 APP 代码中设置明文数据 data。

3. 在 APP 代码中使用私有密钥 OEM Cipher Key 加密明文数据 data,得到密文数据 enc-data 并存放到 flash 上指定位置,或者固化到代码中。

![图8：中文原稿第14页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p014-figure-01.png)

*图8：中文原稿第14页技术图/工具截图*

4. 系统启动后,APP 使用私有密钥 OEM Cipher Key 解密 flash 中密文数据 enc-data 得到解密数据 dec-data,将解密数据 dec-data 和应用程序代码中明文数据 data 进行对比。根据匹配结果选择正常运行或者立即重启。

![图9：中文原稿第14页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p014-figure-02.png)

*图9：中文原稿第14页技术图/工具截图*

### 4.4 完整流程图

中级方案的完整流程图如下所示:

![图10：中文原稿第15页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p015-figure-01.png)

*图10：中文原稿第15页技术图/工具截图*

### 4.5 参考案例

1. 使用 BoardProofTool 工具写入自定义私有密钥 OEM Cipher Key。设备开机时⻓按 recovery 键进入Loader状态。客戶先创建 high.bin 文件,以16进制格式编辑该文件,写入16字节自定义私有密钥 OEM Cipher Key(也支持24或32字节⻓度)。打开 BoardProofTool.exe 工具,选择Key Index,点击 “密钥” 选择 high.bin 文件,点击 “执行” 即可。(注意:OTP是一次性可编程存储,同一个Key Index,每台设备只能写入一次自定义私有密钥 OEM Cipher Key)

![图11：中文原稿第16页技术图/工具截图](/docs/rockchip-anti-copy-board/assets/cn-p016-figure-01.png)

*图11：中文原稿第16页技术图/工具截图*

2. UserSpace 层使用 rk_anti_copy_board 写入自定义私有密钥 OEM Cipher Key。rk_anti_copy_board 源码位于 rk_tee_user/v2/host/rk_anti_copy_board 目录下。编译方法与初级方案一致,这里不再赘述。测试命令:

```text
root@RK3588:/# rk_anti_copy_board high_gen
```

3. UserSpace 层使用 rk_anti_copy_board 验证设备合法性。测试命令:

```text
root@RK3588:/# rk_anti_copy_board high_verify
```

### 4.6 方案扩展

客戶可以对私有密钥 OEM Cipher Key 的使用方法进行扩展。例如使用 OEM Cipher Key 对关键数据进行加密存储,系统启动后当需要使用关键数据时将其解密。也可以使用 OEM Cipher Key 对核心代码进行加密,系统启动后,需要运行核心代码时,先解密再执行。

## 5. 扩展安全

客戶可以将防抄板技术与以下安全技术配合,可以进一步减低被抄板的分险,提高系统安全性。安全启动。启动时校验固件的合法性,保证运行的固件未被篡改,防止非法程序运行。安全启动流程及应用步骤请参考 Secure Boot 相关文档。固件加密。将固件进行加密再烧写,启动时才解密运行,防止非授权用戶获取 flash 上明文固件,防止固件被反汇编分析。

{% endraw %}
