---
title: "SecureBootTool 1.85：理解历史 Rockchip 安全启动工具链"
description: "SecureBootTool 属于较早的 Rockchip 安全工具链，随附应用说明覆盖签名、eFuse 配置、固件升级和测试。不能把它包装成所有当前 ArmSoM 板卡都能直接使用的安全方案。"
excerpt: "SecureBootTool 属于较早的 Rockchip 安全工具链，随附应用说明覆盖签名、eFuse 配置、固件升级和测试。不能把它包装成所有当前 ArmSoM 板卡都能直接使用的安全方案。"
translation_key: "rockchip-tool-secureboot-tool"
slug: "rockchip-tool-secureboot-tool"
lang: "zh"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "SecureBootTool"]
---

{% raw %}

![SecureBootTool](/assets/rockchip-tools/flows/secureboot-tool-zh.svg)

## 历史 Secure Boot 应用说明 V1.2

这份 2016 年手册列出 RK3126、RK3128、RK3228、RK3288、RK3368；不是 RK35xx 通用配置。原稿功能包括 Secure Boot ROM、SHA256/SHA160、RSA2048/RSA1024、OTP 验证 RSA 公钥、Secure Boot Rockusb 升级。最低版本：Miniloader 2.19、U-Boot 2.17、EfuseTool 1.35、SecureBootTool 1.75、RKBatchTool 1.8。

### 1. 信任链与签名配置

原图展示 ROM、启动镜像及后续启动阶段的验证关系，保留在下方。Windows 工具先选择芯片，3188 之前的旧芯片选择 others；再选 eFuse 级或软件方案。原文列 3128、3288、3228、3368 支持 eFuse 级，其他旧芯片不支持。此处“加密”是原工具界面用语，不应据此混淆签名验证与固件保密。

3188 及之前旧芯片使用 loaderex=false、1024 位 key；3128/3288/3228/3368 使用下列配置，并满足上面的 Loader、U-Boot 版本。Key 只支持 1024 或 2048。

```ini
[Options]
Loaderex=true
Key=2048
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" alt="启动镜像签名与验证流程" width="1248" height="815" style="width:100%;max-width:1248px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 1：启动镜像签名与验证流程</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" alt="SecureBootTool 主界面" width="900" height="600" style="width:100%;max-width:900px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 2：SecureBootTool 主界面</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" alt="选择目标芯片" width="256" height="71" style="width:100%;max-width:256px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 3：选择目标芯片</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" alt="选择 eFuse 或软件模式" width="216" height="84" style="width:100%;max-width:216px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 4：选择 eFuse 或软件模式</strong></figcaption>
</figure>

### 2. 生成、保存和加载 RSA Key

原文要求每款机器只生成一次密钥，此后固件一直使用该对 key，并另做备份。点击生成、确认并保存，再从保存位置加载；支持 OpenSSL 生成的 `.pem` RSA2048。丢失密钥会使后续签名升级不可用，可能导致设备无法恢复。不要把示例截图里的密钥流程当作生产密钥托管方案。

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" alt="生成密钥对后确认保存" width="897" height="594" style="width:100%;max-width:897px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 5：生成密钥对后确认保存</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" alt="选择密钥保存目录" width="906" height="596" style="width:100%;max-width:906px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 6：选择密钥保存目录</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" alt="加载已保存的私钥文件" width="969" height="775" style="width:100%;max-width:969px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 7：加载已保存的私钥文件</strong></figcaption>
</figure>

### 3. 固件准备和签名

boot.img、recovery.img 都必须包含 kernel。原稿终端截图以 RK3288 Android 4.4 演示以下命令和输出；NAND 固件还需包含 miniloader 与 uboot.img。加载保存的 RSA key 后选择并签名固件，保留成功结果。原文连续两个小节都标 3.5，本文按操作顺序整理。

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img.... done.
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" alt="生成包含 kernel 的 boot 与 recovery 镜像" width="728" height="161" style="width:100%;max-width:728px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 8：生成包含 kernel 的 boot 与 recovery 镜像</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" alt="使用 Sign Firmware 开始签名" width="222" height="60" style="width:100%;max-width:222px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 9：使用 Sign Firmware 开始签名</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" alt="选择需要签名的固件" width="963" height="784" style="width:100%;max-width:963px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 10：选择需要签名的固件</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" alt="固件签名成功提示" width="888" height="594" style="width:100%;max-width:888px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 11：固件签名成功提示</strong></figcaption>
</figure>

### 4. eFuse 烧写流程

打开 eFuse 工具，选择用于生产的已签名固件，点击启动；裸机上电连接 USB 后进入 `maskromrockusb`，工具会自动烧写，支持一拖多。RK312X 需治具为 eFuse 单独供电；RK3288 PCBA 已有该供电，软件控制，无需另供。正式批量前先烧一台，再用量产工具升级完整签名固件并验证全部功能。eFuse 属不可逆设备配置，不能在普通板卡上照图试写。

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" alt="打开 eFuse 工具" width="1224" height="744" style="width:100%;max-width:1224px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 12：打开 eFuse 工具</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" alt="选择已签名的生产固件" width="1206" height="792" style="width:100%;max-width:1206px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 13：选择已签名的生产固件</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" alt="启动工具并等待设备连接" width="1303" height="789" style="width:100%;max-width:1303px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 14：启动工具并等待设备连接</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" alt="查看 eFuse 写入结果" width="868" height="657" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 15：查看 eFuse 写入结果</strong></figcaption>
</figure>

### 5. 固件升级与验证

使用匹配的量产工具升级已签名固件。原稿明确：未烧写 eFuse 不会启用该 Secure Boot。负向验证写入未签名固件时，应无法启动、停在 `maskromrockusb`，升级 loader 后工具报错；下方保留原截图，不能将截图当作 ArmSoM 实测。

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" alt="在量产工具中加载签名固件" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 16：在量产工具中加载签名固件</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" alt="签名固件升级成功" width="868" height="683" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 17：签名固件升级成功</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" target="_blank" rel="noopener" aria-label="查看完整图片"><img src="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" alt="未签名固件的负向验证结果" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>图 18：未签名固件的负向验证结果</strong></figcaption>
</figure>

### 6. 常见错误

eFuse 烧录报错时检查供电是否正常、设备是否已经烧写过。不要反复写入来试错；保存 key、固件版本、目标芯片和执行记录，再按对应芯片资料核对。

## 适用范围与验证状态

本文依据本次工具包及原始资料整理。使用前核对具体板卡、SoC、载板、SDK/BSP 与主机架构。本次未执行烧录、生产配置、寄存器写入或硬件测试；提供下载不代表所有 ArmSoM 产品均支持。

## GitHub 工具目录、版本与 SHA-256

打开 GitHub 对应目录后选择所需平台和版本，再校验文件哈希并完整解压。下方链接均为仓库目录入口。

[前往 GitHub 对应工具目录](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/secureboot-tool)

| 平台 / 版本 | 文件 | SHA-256 |
|---|---|---|
| Host to verify / 1.85 | `SecureBootTool_v1.85_foruser.zip` | `d241ccc7503a3202c68a036f51cdd7f5d2db2a7594eb749ec19e2ffb2c67681a` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## 资料依据与原图

- Rockchip Secure Boot Application Note_v1.2_20160202.pdf

## 继续阅读相关流程

- [Rockchip Secure Boot 完整应用指南：签名、eFuse、OTP 与验证](/zh/articles/105-rockchip-secure-boot/)
- [Rockchip Linux Secure Boot 完整开发指南](/zh/articles/203-rockchip-linux-secure-boot/)
- [rk_sign_tool 与 sign_tool：Rockchip 固件签名和校验流程](/zh/articles/rockchip-tool-rk-sign-tool/)
- [EfuseTool 1.42：建立可追溯的安全启动配置工位](/zh/articles/rockchip-tool-efuse-tool/)
- [Rockchip 工具下载与使用指南索引](/zh/articles/rockchip-tools-download-guide/)

## 查找准确的 ArmSoM 板卡资料

板卡、载板与接口要求先以产品手册为准。以下链接是平台参考，不表示该归档工具已在这些产品上验证。

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
