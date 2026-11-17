# 五篇工程技术文章：来源与校对记录

日期：2026-11-17。范围：5 个主题 × 中文、英文、俄文、德文，共 20 篇。本记录描述发布前的本地内容核查。

## 编辑方式

用户提供五篇微信文章截图。本批将资料重组为面向 ArmSoM 开发者的原创工程指南，重新编排章节、恢复可编辑表格与代码、增加产品/文档入口和验证流程，不将整张微信长图作为正文，不把原作者测量写成 ArmSoM 实测。每篇保留自然来源链接。不是逐字转录，也不宣称逐页核验了原作者未提供的所有 SDK/datasheet。

所有正文使用平台参考标识；产品链接是相关平台评估入口，不是对 Android 16/17、GMS、AMP 或特定硬件测试的支持承诺。没有修改原始输入图片，也没有实际执行 adb、证书修改、固件编译或烧写。

## 主题与处理

| 主题 | 文章 slug | 核对和修正 |
| --- | --- | --- |
| 九款芯片选型 | rockchip-soc-selection-rk3588-rk3576-rk3572 | 保留九款 CPU/GPU 系列/NPU 基本对比；注明稀疏口径和来源版本；不将无 NPU 等同不能运行 AI；不把芯片接口数量当作板卡连接器数量。原作者全部 datasheet 版本未逐一取得，版本表明确为其声明。未混入不同版本的 GPU API 能力。 |
| Android CA 信任库 | android-ca-trust-store-emudhra-audit | 官方 Google、Firebase、AOSP 与 OpenSSL 对照；区分证书和 SPKI、系统与 APEX、应用独立证书包；不采用通用删除 AAA 根的建议；不把安装 GMS 当作所有应用已修复；补充实际连接与更新回归。 |
| Android SDK/SSI/GRF | rockchip-android-sdk-ssi-grf-selection | 15 行芯片范围与 Android 17 vendor 门槛保留为 2026-11-06 第三方调查快照；没有升级为官方/ArmSoM 已验证支持。说明原文 RK3528 的表间不一致；区分系统 API 与 vendor API。 |
| VendorStorage | rockchip-vendor-storage-android-aidl-guide | 区分 NVM、GKI RAM、文件缓存；156–256 只作为源分支客户范围；补充 ID 登记、长度与返回值校验、权限、掉电/OTA 验收。最新 AIDL V2 服务未取得匹配源码实编译；所有相关名称注明须核对分支。 |
| RK3572 AMP | rk3572-android-rtthread-amp-integration | 以原作者 EVB1/Android16/6.12 为基线；保留四组合、内存地址、DTS 与构建配置；说明 AP/MCU 不可混用、GIC SPI 转换与 Linux IRQ 的区别；GPIO 修复不冒充完整已验证补丁；不补造截断恢复步骤。 |

## 截图完整性

- 第 4 张宽 677 像素，右侧有文字裁切；结构图和布局图仍显示加载占位符。正文使用本次原创流程图，没有伪称提取出原图。截图结尾只有部分 U-Boot 内容。
- 第 5 张在 Maskrom/Loader 恢复章节截断。没有据此编写缺失的恢复命令；不提供固定块设备或固定 LBA 的通用写入方案。
- 原始图片路径、尺寸和 SHA-256 见同目录 `source-images.json`，用于确认输入未被修改。

## 已查阅的主要公开资料

- Google eMudhra 安全公告：https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/
- Firebase 组件说明：https://firebase.google.com/support/guides/compromised-emudhra-intermediate-ca
- AOSP Conscrypt：https://source.android.com/docs/core/ota/modular-system/conscrypt
- Android Network Security Configuration：https://developer.android.com/privacy-and-security/security-config
- OpenSSL x509：https://docs.openssl.org/3.0/man1/openssl-x509/
- AOSP SSI：https://source.android.com/docs/core/architecture/partitions/shared-system-image
- AOSP vendor API：https://source.android.com/docs/core/architecture/api-flags
- Linux RPMsg：https://docs.kernel.org/staging/rpmsg.html
- Rockchip kernel develop-6.1 VendorStorage：https://github.com/rockchip-linux/kernel/blob/develop-6.1/drivers/soc/rockchip/sdmmc_vendor_storage.c
- RK3562 官方产品页：https://www.rock-chips.com/a/en/products/RK35_Series/2024/0626/1983.html
- RK3572 官方介绍：https://www.rock-chips.com/a/cn/news/rockchip/2026/0518/2168.html
- ArmSoM 产品事实沿用已核验的 `_data/products.json` 与官方 Docs 链接，仅使用型号/SoC 关联，不新增内存、生命周期、认证或兼容性承诺。

## 配图与接入

20 张本地化原创 SVG 工程图，另有 20 张 1200×630 PNG 用于分享图。图中文字按四语分别整理，未改画芯片外观或虚构产品照片。

复用现有四语 translation_key、顶部语言切换、TOC、分类、搜索、canonical、hreflang、sitemap 和分享图模板。文章只引用正式产品/文档链接，校对记录不加入 sitemap。五篇所在分类为现有 production、android、linux，不新增导航入口。

芯片选型篇关联 `rockchip-npu-rknn2-rknn3-getting-started` 四语稿。本批发布将该依赖作为前置主题一并提交；完整本地预览已包含并验证该稿。

## 验证边界

网站构建、页面结构、语言关联、代码一致性、图片与链接、桌面/手机布局可在本地验证；SDK 编译、板端命令、固件烧写、TLS 真实设备处置、模型性能及硬实时性能未在本次执行。最终网站检查结果见 `validation.md`。
