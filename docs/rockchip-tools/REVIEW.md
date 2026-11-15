# Rockchip 工具库与四语文章校对记录

整理日期：2026-11-15。来源：用户指定本地 tools 集合，包括压缩包内的使用说明、配置示例和版本记录。

## 交付范围

公开工具仓库：https://github.com/ArmSoM/rockchip-tools 。本地 Blog 新增 24 个工具主题的中英俄德全文使用指南（96 页）、四语工具索引（4 页），并按原分页模板补齐正式发布所需的第 63–65 页。没有修改现有导航、SEO 模板或用户待提交的其他工作。本批已获用户提交发布授权；只提交工具主题、配图、索引与必需分页，RKNN3 草稿和全站 SEO 修改继续留在本地。

16 份原 PDF 共 213 页保留原始字节供下载。工具指南依据实际手册和包内容编写，分别说明输入、使用步骤、命令、输出、排障与版本限制；没有完整 PDF 的工具不虚构界面按钮、算法或设备写入流程。原有较新的完整技术文档通过关联阅读链接接入，不能把旧工具包当成新版 SDK 实现。

## 图片和源文件

96 张四语流程示意图为本次制作。RKDevTool、PinDebug、USB SQ、PCBA 和 HDCP 的技术截图来自对应原 PDF；有中英图时中文使用中文原图，英俄德使用英文原图。只有中文原图时明确保留原界面文字，没有伪称英文图。

重新核对了 253 个仍可读取的原文件，哈希未变；USB SQ 1.5 的一个源 EXE 已被 Windows Defender 隔离，无法再次读取，见下一节。没有运行工具、烧录设备、写寄存器/熔丝或进行板卡兼容测试。

## USB SQ 1.5 下载暂停

Windows Defender 在 2026-11-15 报告 Trojan:Win32/Pomal!rfn 并隔离源 EXE，检测记录显示没有执行。当前下载索引、文章和仓库 main 均暂停该包，等待原厂核验。不能据此独立判定是否误报。该包曾出现在早期 Git 提交中，撤下当前文件没有清除 Git 历史。未恢复隔离文件、关闭防护或改写历史。其余 34 个包共 35 个物理下载文件可下载；完整性验证不是无恶意软件认证。

## 版本差异与尚需核对的内容

- RKDevTool：包的 release notes 为 3.37；2018 年 V1.2 手册与 2021 年 V1.0 中文文档不能仅按文档号判断新旧，后者涉及工具 2.88。正文分别标注来源，界面截图作为历史示例。
- USB SQ：本包 1.5，内附手册 1.4；原有文章手册为 1.8。下载已暂停，不将较新手册等同于归档程序支持。
- PCBA：包 1.2.1，手册 1.2.0；中文正文删除旧摄像头小节，英文稿仍保留，作为历史差异记录。示例 JSON 修复结构问题且关闭 MES，不复制原示例服务器地址。
- Linux AVB：本包手册 2.2.5 的历史 security 分区示例与原有 4.1.1 文档不同，保持版本边界。仓库包不包含示例密钥目录。
- programmer_image_tool：保留原始 -2 参数示例，但简短说明没有解释其含义；使用前按配套 SDK 核验，不自行赋予含义。
- BoardProof、ParameterTool、DDR_UserTool、RKDevInfoWriteTool、EfuseTool 等缺少完整 PDF，按配置、版本记录和文件清单整理准备及验收流程；具体 SoC/板卡写入条件仍需配套说明和硬件验证。
- ArmSoM Sige7、CM5 产品/文档链接为平台参考，文章不声称所有旧版工具已经适配这些板卡。

## 验收

最初本地预览通过 Jekyll 构建；发布前另以已上线模板与本批暂存文件创建独立快照，完整 Jekyll 构建和 100 篇文章/索引检查通过。100 个本地实际页面返回 200；正式 HTTPS canonical、自身与互链 hreflang、x-default、站内搜索、sitemap、图片和正文内部链接检查通过。核对 109 个页面图片 URL、181 个内部 URL，以及正式发布四语第 1–65 页分页文件。robots 和站点验证文件保持不变，新页面没有伪造 lastmod。

复用现有目录脚本和响应式表格/代码样式。按用户要求没有使用网页操作；点击、滚动、高亮和手机视觉验收未单独执行。检查不代表搜索引擎已收录。

## 本地预览

[中文工具索引](http://127.0.0.1:4047/zh/articles/rockchip-tools-download-guide/) · [English](http://127.0.0.1:4047/articles/rockchip-tools-download-guide/) · [Русский](http://127.0.0.1:4047/ru/articles/rockchip-tools-download-guide/) · [Deutsch](http://127.0.0.1:4047/de/articles/rockchip-tools-download-guide/)

| 工具 | 四语预览 |
|---|---|
| RKDevTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-rkdevtool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-rkdevtool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-rkdevtool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-rkdevtool/) |
| DriverAssitant | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-driver-assistant/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-driver-assistant/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-driver-assistant/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-driver-assistant/) |
| upgrade_tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-upgrade-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-upgrade-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-upgrade-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-upgrade-tool/) |
| boot_merger | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-boot-merger/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-boot-merger/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-boot-merger/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-boot-merger/) |
| Firmware_Merger | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-firmware-merger/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-firmware-merger/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-firmware-merger/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-firmware-merger/) |
| afptool, rkImageMaker and rockdev | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-firmware-pack-tools/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-firmware-pack-tools/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-firmware-pack-tools/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-firmware-pack-tools/) |
| Linux_Diff_Firmware | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-diff-firmware/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-diff-firmware/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-diff-firmware/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-diff-firmware/) |
| DDR Bandwidth Tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-ddr-bandwidth/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-ddr-bandwidth/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-ddr-bandwidth/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-ddr-bandwidth/) |
| DDR_UserTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-ddr-user-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-ddr-user-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-ddr-user-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-ddr-user-tool/) |
| rk_ddrbin_tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-ddrbin-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-ddrbin-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-ddrbin-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-ddrbin-tool/) |
| PinDebug | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-pin-debug/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-pin-debug/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-pin-debug/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-pin-debug/) |
| USB SQ Tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-usb-sq-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-usb-sq-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-usb-sq-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-usb-sq-tool/) |
| rk_sign_tool and sign_tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-rk-sign-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-rk-sign-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-rk-sign-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-rk-sign-tool/) |
| SecureBootTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-secureboot-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-secureboot-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-secureboot-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-secureboot-tool/) |
| Linux SecurityAVB | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-linux-avb/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-linux-avb/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-linux-avb/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-linux-avb/) |
| Linux SecurityDM | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-linux-dm/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-linux-dm/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-linux-dm/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-linux-dm/) |
| BoardProofTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-board-proof/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-board-proof/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-board-proof/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-board-proof/) |
| EfuseTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-efuse-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-efuse-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-efuse-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-efuse-tool/) |
| ParameterTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-parameter-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-parameter-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-parameter-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-parameter-tool/) |
| RKDevInfoWriteTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-devinfo-write/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-devinfo-write/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-devinfo-write/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-devinfo-write/) |
| RKPCBATool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-pcba-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-pcba-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-pcba-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-pcba-tool/) |
| HDCP Key Writer | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-hdcp-key-writer/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-hdcp-key-writer/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-hdcp-key-writer/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-hdcp-key-writer/) |
| SDDiskTool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-sd-disk-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-sd-disk-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-sd-disk-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-sd-disk-tool/) |
| programmer_image_tool | [zh](http://127.0.0.1:4047/zh/articles/rockchip-tool-programmer-image-tool/) · [en](http://127.0.0.1:4047/articles/rockchip-tool-programmer-image-tool/) · [ru](http://127.0.0.1:4047/ru/articles/rockchip-tool-programmer-image-tool/) · [de](http://127.0.0.1:4047/de/articles/rockchip-tool-programmer-image-tool/) |

## 发布准备核验

2026-11-15：正式快照含英文 580 篇、中文 582 篇、俄文 580 篇、德文 580 篇，均需 65 页目录。新文章和四语索引合计 100 页；四语正文、图片、目录脚本、正式 canonical/hreflang、站内搜索、sitemap 和 robots 检查无错误。35 个 GitHub 下载文件及 117 个指南/手册入口均返回 200。远程提交、Pages 构建结果和线上逐页检查记录保存在本次工作目录的发布验收文件中。
