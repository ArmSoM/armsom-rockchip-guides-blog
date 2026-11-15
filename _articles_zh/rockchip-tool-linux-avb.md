---
title: "Linux SecurityAVB：密钥、启动镜像签名与版本边界"
description: "这份 Linux AVB 包描述较早的证书与永久属性验证启动方案，适合维护对应 BSP，不能直接替代新版 SDK 的 verified boot 实现。"
excerpt: "这份 Linux AVB 包描述较早的证书与永久属性验证启动方案，适合维护对应 BSP，不能直接替代新版 SDK 的 verified boot 实现。"
translation_key: "rockchip-tool-linux-avb"
slug: "rockchip-tool-linux-avb"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "Linux SecurityAVB"]
---

{% raw %}

![Linux SecurityAVB](/assets/rockchip-tools/flows/linux-avb-zh.svg)

## Linux AVB V2.2.5 完整技术说明

AVB 从硬件保护的信任根经过 U-Boot，校验后续 boot、recovery 等分区，防止运行非可信或损坏的代码。以下严格保留 2020 年 V2.2.5 的平台和布局，不与较新 SDK 混用。

| Chip | Security storage | Kernel | U-Boot | RKBin |
|---|---|---|---|---|
| RK3308 | OTP | ALL | d3a731e | e00dab6 |
| RK3326 | OTP | 4.4 | d3a731e | 20af526 |
| PX30 | OTP | 4.4 | d3a731e | 20af526 |
| RK3328 | OTP | 4.4 | d3a731e | 158ccc6 |
| RK3399 | eFuse | 4.4 | d3a731e | 158ccc6 |
| RK3288 | eFuse | 4.4 | d3a731e | c021945 |
| RK1808 | eFuse | 4.4 | d3a731e | 890556f |

### 1. 使用前提

解锁状态仍校验 boot.img，错误会报告但允许启动；锁定状态遇到无效镜像会停止启动。手册不支持压缩内核镜像；使用 eFuse 的芯片需要先配置 Base SecureBoot。

### 2. Trust 与 U-Boot

确保 trust.img 启用 secure。以 `rkbin/RKTRUST/RK3308TRUST.ini` 为例，将 BL32 的 SEC 从 0 改成 1；该 ini 由 U-Boot make.sh 选择。TOS 格式如 RK3288TOS.ini 默认启用 secure。

```diff
diff --git a/RKTRUST/RK3308TRUST.ini b/RKTRUST/RK3308TRUST.ini
index 0b2839d..51ec627 100644
--- a/RKTRUST/RK3308TRUST.ini
+++ b/RKTRUST/RK3308TRUST.ini
@@ -8,7 +8,7 @@ SEC=1
 PATH=bin/rk33/rk3308_bl31_v2.21.elf
 ADDR=0x00010000
 [BL32_OPTION]
-SEC=0
+SEC=1
 PATH=bin/rk33/rk3308_bl32_v1.12.bin
 ADDR=0x00200000
 [BL33_OPTION]
```

下面是原稿配置清单，并非可不加选择地全部启用：OPTEE V1 用于 rk3288/rk3328/rk3399，V2 用于 rk3308/rk3326/px30/rk1808，两者互斥。CRYPTO_V1 为 rk3399/rk3288 等 eFuse 平台，CRYPTO_V2 为 rk1808。`CONFIG_ANDROID_AB` 非必需；无 RPMB 时启用 security 分区选项。fastboot 地址和大小并非固定值。

```text
# OPTEE support
CONFIG_OPTEE_CLIENT=y
CONFIG_OPTEE_V1=y
CONFIG_OPTEE_V2=y
# CRYPTO support
CONFIG_DM_CRYPTO=y
CONFIG_ROCKCHIP_CRYPTO_V1=y
CONFIG_ROCKCHIP_CRYPTO_V2=y
# AVB support
CONFIG_AVB_LIBAVB=y
CONFIG_AVB_LIBAVB_AB=y
CONFIG_AVB_LIBAVB_ATX=y
CONFIG_AVB_LIBAVB_USER=y
CONFIG_RK_AVB_LIBAVB_USER=y
CONFIG_AVB_VBMETA_PUBLIC_KEY_VALIDATE=y
CONFIG_ANDROID_AVB=y
CONFIG_ANDROID_AB=y
CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION=y
CONFIG_ROCKCHIP_PRELOADER_PUB_KEY=y
CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK=y
# fastboot support
CONFIG_FASTBOOT=y
CONFIG_FASTBOOT_BUF_ADDR=0x2000000
CONFIG_FASTBOOT_BUF_SIZE=0x08000000
CONFIG_FASTBOOT_FLASH=y
CONFIG_FASTBOOT_FLASH_MMC_DEV=0
```

`CONFIG_ROCKCHIP_PRELOADER_PUB_KEY` 与 DM_CRYPTO 为 eFuse 场景。较旧 U-Boot 若缺少 ATH_UNLOCK 配置，原稿以提交 `46a8a26905fc68e6683b93c97adae0dd9a4e37ba` 为基准给出以下补丁，确保调用 `rk_auth_unlock()`。这是历史源码补丁，必须先对照当前树。A/B 需要 Ramdisk 时第二个补丁去掉 skip_initramfs；原稿注明因与 Android 冲突，不能合入其 master。

```diff
diff --git a/drivers/usb/gadget/f_fastboot.c b/drivers/usb/gadget/f_fastboot.c
index 99d62a6..fec465e 100755
--- a/drivers/usb/gadget/f_fastboot.c
+++ b/drivers/usb/gadget/f_fastboot.c
@@ -1370,7 +1370,7 @@ static void cb_oem(struct usb_ep *ep, struct usb_request *req)
                         fastboot_tx_write_str("FAILThe vboot is disable!");
                 } else {
                         lock_state = 1;
-#ifdef CONFIG_RK_AVB_LIBAVB_ENABLE_ATH_UNLOCK
+#if 1
                         if (rk_auth_unlock((void *)CONFIG_FASTBOOT_BUF_ADDR,
                                            &out_is_trusted)) {
                                 printf("rk_auth_unlock ops error!\n");

diff --git a/common/android_bootloader.c b/common/android_bootloader.c
index 230bf0e..e5c81e6 100644
--- a/common/android_bootloader.c
+++ b/common/android_bootloader.c
@@ -1061,9 +1061,6 @@ int android_bootloader_boot_flow(struct blk_desc *dev_desc,
                  * "skip_initramfs" to the cmdline to make it ignore the
                  * recovery initramfs in the boot partition.
                  */
-#ifdef CONFIG_ANDROID_AB
-               mode_cmdline = "skip_initramfs";
-#endif
                 break;
         case ANDROID_BOOT_MODE_RECOVERY:
                 /* In recovery mode we still boot the kernel from "boot" but
```

然后运行 `./make.sh xxx` 生成 uboot.img、trust.img、loader.bin；`xxx` 是目标平台占位。

### 3. Parameter 与原稿疑点

需有 1M 的 vbmeta 与 system；Buildroot 的 rootfs 要改名 system，使用 uuid 时连同分区名更新。没有 eMMC RPMB 时使用 security 保存加密 AVB 信息，原稿文字写 4M。下列参数原值保留：security 为 `0x00002000`；按 512 字节扇区解释是 4 MiB，但 vbmeta 的 `0x00000800` 是 1 MiB。A/B 末尾 userdata 地址写 `0x0065f00`，与前面分区末尾明显不连续，不自动改写为猜测值。实际布局必须核对后再用。

```text
# AVB parameter:
0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00002000@0x00008000(misc),0x00010000@0x0000a000(boot),0x00010000@0x0001a000(recovery),0x00010000@0x0002a000(backup),0x00020000@0x0003a000(oem),0x00300000@0x0005a000(system),0x00000800@0x0035a000(vbmeta),0x00002000@0x0035a800(security),-@0x0035c800(userdata:grow)
uuid:system=614e0000-0000-4b53-8000-1d28000054a9

# AVB and A/B parameter:
0x00002000@0x00004000(uboot),0x00002000@0x00006000(trust),0x00004000@0x00008000(misc),0x00010000@0x0000c000(boot_a),0x00010000@0x0001c000(boot_b),0x00010000@0x0002c000(backup),0x00020000@0x0003c000(oem),0x00300000@0x0005c000(system_a),0x00300000@0x0035c000(system_b),0x00000800@0x0065c000(vbmeta_a),0x00000800@0x0065c800(vbmeta_b),0x00002000@0x0065d000(security),-@0x0065f00(userdata:grow)
```

### 4. 四类 AVB 密钥

PRK（Product RootKey）是根密钥：eFuse 平台由 Base SecureBoot Key 验证相关信息；OTP 平台直接验证预存 PRK-Hash。PIK 是中间密钥，PSK 签固件，PUK 解锁。原始目录带测试证书，当前分发包已移除示例密钥；生产必须保护专属密钥。`-n` 先删除 avb_keys 再生成，Product ID 长度 16 字节。尖括号是原文占位，不要原样输入 shell。

```text
./avb_user_tool.sh -n <Product ID>
./avb_user_tool.sh -f < /Path/to/PrivateKey.pem >
```

仅 eFuse 需第二行生成 permanent_attributes_cer.bin，私钥是 Base SecureBoot 的 PrivateKey.pem。该步骤生成 `.setting` 并设为 eFuse；改变设备类型时显式检查其中 `efuse`/`otp`。保管全部生成文件，丢失后可能无法解锁或再次升级。

### 5. 签名、打包与下载配置

```text
./avb_user_tool.sh -s -b < /path/to/boot.img > -r < /path/to/recovery.img >
```

无 recovery 时省略 `-r`。签名镜像和 vbmeta.img 输出到 `out`。将 AVB 配置生成的 uboot/trust/loader、avb_keys 和 out 的结果按固件流程打包；若还用 Base SecureBoot，再对 update.img 签名并设置 `exclude_boot_sign = True`。在 Windows RKDevTool 增加 vbmeta（必要时 security），清空地址后重载 parameter 更新分区位置；security 不下载镜像，由 U-Boot 初始化。初次下载后为 unlock，不能据此证明无效镜像会被阻止启动。

### 6. Lock、Unlock 与验证日志

通过开机 fastboot 按键、系统 `reboot fastboot`，或 U-Boot `fastboot usb 0` 进入 fastboot；U-Boot 可配置 CONFIG_BOOTDELAY 留出 Ctrl-C 进入控制台的时间。原稿提供保存 sudo 密码参数，涉及主机凭据，实际使用前检查脚本存储方式。先 `-d` 写根信息，再 `-l`/`-u`，完成后重启。下列密码/路径只是占位。

```text
./avb_user_tool.sh --su_pswd < /user/password >
./avb_user_tool.sh -d
./avb_user_tool.sh -l
./avb_user_tool.sh -u

ANDROID: reboot reason: "(none)"
Could not find security partition
read_is_device_unlocked() ops returned that device is LOCKED
```

末三行是原文 Verity 小节的锁定示例，其中仍出现找不到 security 分区，不能据单条 LOCKED 日志认定完整验证成功；应结合 RPMB/security 配置及无效签名启动测试判断。本次没有执行这些操作。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/linux-avb)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Linux / manual 2.2.5 | `linux-security-avb-without-keys.zip` | `fc7eae22caeadd51d85723b65451c70e88475a2c9ba7e7f5394ca1314688d17d` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- Rockchip_User_Manual_Linux_AVB_EN.pdf

## 继续阅读相关流程

- [Rockchip Linux Secure Boot 完整开发指南](/zh/articles/203-rockchip-linux-secure-boot/)
- [Rockchip U-Boot Nextdev 开发指南：启动、驱动、SPL/TPL、FIT与安全校验](/zh/articles/157-rockchip-uboot-nextdev/)
- [rk_sign_tool 与 sign_tool：Rockchip 固件签名和校验流程](/zh/articles/rockchip-tool-rk-sign-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
