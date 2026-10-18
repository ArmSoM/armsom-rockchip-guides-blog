# 065-rockchip-gmac-mode-configuration 校对记录

## 原稿与版本

- CN: `Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_CN.pdf`，V1.4.0，65 页，SHA-256 `ac1d98dec557d3a54a7b0668e0524aaf43eb21872ebff6428d8b7a3a7eb6f447`。
- EN: `Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_EN.pdf`，V1.4.0，68 页，SHA-256 `22eaefecb28dbfa790f82ef35858b40c0eba30250e715d9a82aa805b1a568e0a`。

原始 PDF 未修改。删除封面发布日期/密级、声明、联系资料、读者对象及修订记录；保留技术版本范围及必要技术变更。正文为可编辑 Markdown，代码、命令、日志全部保留，不以页面截图代替正文。HTML 注释记录来源语言、PDF 页及提取单元编号。三语日期 2026-10-18，translation_key 复用现有网站机制。

## 章节、图片与代码核对

中英文正文均从 p5 开始，分别至 CN p65 / EN p68。含 §1 RGMII、§2 RMII、§3 模式配置及 14 组平台，末节 §3.14.6 RV1126 RMII Clock Input 完整保留。CN 两个长标题的独立 TX_CLK 续行合回 §3.9.5/3.9.6，标题层级不丢失。

六张连接图：CN p5、6、7、8、9、10 分别对应 EN p6、7、8、9、10、11。中文使用 CN 图片，英文和俄文使用 EN 图片；逐张原始字节完全一致（仍按各自来源文件保存），已视觉核对所有标签、电源/接地、方向箭头和边界。原图为嵌入栅格，不是整页截图；无需额外裁切矢量图。其余页面只有 DTS 代码/文字，未以截图代替。产品版本表恢复为 Markdown。

所有配置代码逐字符比较（忽略空白及注释），发现下面四处实质差异；其余技术值一致。图示 25M/50M/125M、寄存器/时钟/引脚属性、延迟值、复位值均保持来源值。代码里的加号是原文修改标记，不宣称直接可编译或可 git apply。

## 同版本原文差异与待核项

1. §3.4.5 RK3228 Internal EPHY：CN p16 `phy-mode = "rmii"`；EN p17 `phy-mode = "RMII"`。已视觉确认英文大写确在原稿；大小写可能影响绑定解析，但不猜改。
2. §3.10.4 RK3562 两套配置：CN p31 的 PHY 子节点均以 `};` 结束，EN p33 两处仅 `}`，缺分号。已视觉确认，EN/RU 保留并在开头告警。
3. §3.10.5 RK3562 gmac0m0：CN p32 最后引脚组为 `rgmiim1_rgmii_bus`，EN p34 为 `rgmiim0_rgmii_bus`，前面其他组均 m0。已视觉确认，需据目标 BSP/原理图核对；不自行统一。
4. 英文 QSGMII 说明写 SGMIIL；俄文正文保留指出此源拼写，技术术语按 SGMII 说明。

技术变更未作为修订表复制，但在前言保留：V1.1.0 RK3588、V1.2.0 RK3528、V1.3.0 RK3562、V1.4.0 RK3576（参考 RK3588）。原产品表“所有版本”不等于所有 ArmSoM/BSP 兼容。
修复 PDF 内字符串/路径软换行、跨页代码接续及中文部首异体，仅恢复排版，不改技术差异。

## 验证边界

来源内容已完整抽取及逐章对照，俄文正文按指定基准完整本地化；代码原文注释、许可证和必要署名不删除。具体 ArmSoM 板卡、PHY 连接、SDK/BSP 和硬件行为未验证。统一 Jekyll 构建、浏览器实际页面、目录跳转高亮、搜索、语言切换、sitemap/canonical/hreflang/robots 由主任务验收；未完成前不宣称通过。未 commit、push、发布或向搜索引擎提交。
