---
layout: null
sitemap: false
robots: noindex, nofollow
---

# RK3528 / RK3528A 硬件专题校对记录

日期：2026-11-10。当前为本地工程专题草稿，不是两本 PDF 的完整逐段翻译。没有发布、commit、push 或搜索引擎提交。

## 原稿与处理方式

- RK3528 Hardware Design Guide-CN-V1.0-20230525.pdf，164 页，SHA256 `25837dfc277baa80c9979b54095cfcba1491e0c12efb276e8848687d5190fe03`。
- RK3528A Hardware Design Guide-CN-V1.0-20230712.pdf，164 页，SHA256 `67383f74eb6164a4d420de229db59f8c23e1cd6ded8bebd9c78319ac9804164a`。
- 两稿分别提取并逐页做文本差异比较。主要差异是型号、分页和部分图形文字可提取性；并未据此断言封装、引脚或固件完全兼容。将相近主题合并为一条阅读路径，避免两个近重复系列。
- 9 个工程专题 + 1 个导航，各有中文、英文、俄文、德文，共 40 页。62 张原图截图（其中36张按图示区域截取）分别来自各自中文 PDF，按芯片和 PDF 物理页码标注。没有对应英文原图，四语均如实注明使用中文原图。
- 原稿保持不变。未将封面、免责声明、读者对象、修订记录等作为博客正文；技术版本及源章节保留。
- 尚未核实具体 ArmSoM RK3528/RK3528A 成品板，因此定位平台参考，连接官网与文档入口，不虚构产品匹配。

## 章节映射

| 专题 | 原稿范围 | 当前内容 |
| --- | --- | --- |
| boot-clock-debug | §2.1.1–2.1.5、§2.3.2 | 晶体、电平、NPOR、Maskrom/Recovery、JTAG、UART |
| power-sequencing | §2.2、§3.3.2 | 电源域、时序、分立电源、动态负载和必须供电项 |
| ddr-circuit-routing | §2.1.6、§3.3.3 | 拓扑、交换规则、ZQ、电压差异、LPDDR4X 布线值 |
| storage-sdio-design | §2.1.7–2.1.8、§2.3.1、存储 PCB 表 | eMMC/FSPI 复用、串阻上拉、SDMMC/SDIO、无线外围 |
| usb-pcie-design | §2.3.4、USB/PCIe PCB 表 | 两种 PHY 组合、下载通道、保护、阻抗长度及过孔 |
| display-audio-design | §2.3.5–2.3.7、HDMI/音频 PCB | HDMI/CVBS、TSI、模拟/数字音频、EMI 调整预留 |
| ethernet-control-interfaces | §2.3.8–2.3.13、RGMII PCB | 集成/外置 PHY、时钟延时、MDIO、控制总线与复用 |
| pcb-stackup-signal-integrity | §3.1–3.3.2、§5 | 叠层、扇出、回流、保护、EMI 与接口串阻区别 |
| thermal-assembly-storage | §4、§6–7 | 仿真适用边界、热布局、锡膏、回流、MSL3 与烘烤表 |

## 原文疑点及保留方式

1. PDF 88–89：正文明确 4 层 PTH，图 3-1 / 3-2 标题却写 6 层。截图所示实际叠层为 4 层。正文保留图题冲突，不擅自修图。
2. PDF 33：eMMC 图 2-23 CLK 串阻标 0Ω，同页表 2-5 推荐 22Ω。专题并列注明，实际选贴待波形和对应方案核对。
3. PDF 60 / 144：USB3 ESD 电容分别 ≤0.3pF / ≤0.2pF，保留两值并说明更严格预算需要实际验证。
4. PDF 141：PCIe 表“差分对间等长要求”写 <6in，未解释其时序含义。不能把它用作精确 skew 预算。
5. PDF 83：UART7 复用栏 M1/M2，电源域栏 M0/M1，待 PinOut/TRM 核对；正文没有猜测修改。
6. PDF 63：TSI 表题写 CIF。正文说明 TSI 不据此成为摄像头接口。
7. PDF 66：HDMI 模拟部分按 HDMI2.1 设计的叙述，不等于开放 HDMI2.1 功能；仍按 HDMI2.0 TX 公开能力描述。
8. PDF 156 与接口章节：板间串阻参考 2.2–10Ω vs 22–100Ω，正文按接口和 SI/ESD 实测区分，不统一替换。
9. PDF 164：MSL1 行写 ≤300℃，作为原稿异常记录，不引用为存储条件；MSL3 168h、≤30℃/60%RH 保留。
10. §3.3 在 DDR 后重新从 3.3.1 开始编号；来源采用主题名和物理页码，避免按重复编号误定位。
12. DDR PinMap 原稿两处写 `DDR33_A15`、`DDR33_ODT1`，保留原样并要求按 PinOut/TRM 核对，不创建新网名。
11. LPDDR3 电源文字同时出现 1.2V 和为兼容性供 1.25V，正文保留两者且要求核对颗粒范围。

## 已完成检查

- 原稿封面、目录、技术参数位置和最后的 SMT/MSL 章节均已检查；两个 PDF 都已完整提取为本地工作文件。
- 40 个 Markdown 页面具有一致 translation_key、四语标题简介与同主题关联；正文不另造语言切换组件。
- 图片在保留原图标签和来源水印的条件下按图示区域截取；已经查看缩略总览并修复图框顶部及图注截断。
- 关键数值与原文核对：电源 10ms、ZQ 120Ω/240Ω、LPDDR4/4X 电源、存储与高速布线、RGMII、MSL3 和烘烤表。
- 无原厂性能数据被改称 ArmSoM 实测，无 RK3528/RK3528A 产品支持宣称。

## 尚未完成，不能称全文整理交付

- DDR 74 行完整逐引脚映射表已恢复并在两稿间核对一致；所有内存类型的 PCB 布线表与完整布局图库尚未全部迁移。
- UART/I2C/SPI/PWM 与 UART 流控全量复用表已恢复；19 行首次上电表及 PLL 电流/纹波已恢复。音频接口全量能力表、所有原稿技术配图尚未完整迁移。
- 当前 9 篇是技术专题改写，未覆盖原稿每个技术段落。若按最早“全部技术正文、表格、图”标准验收，仍需扩充。
- 尚未执行主仓库构建、浏览器窄屏与目录高亮、搜索、sitemap、canonical/hreflang 验收；由主任务统一进行。
- 所有电路示例未经实际 RK3528/RK3528A 或 ArmSoM 板卡硬件测试。


## Product verification update — 2026-11-10
Official product pages and documentation verified: Sige3 uses RK3568B2 (https://www.armsom.org/sige3 ; https://docs.armsom.org/armsom-sige3); Sige1 uses RK3528 (https://www.armsom.org/sige1 ; https://docs.armsom.org/armsom-sige1). Relevant four-language pages now link to these products and carry product metadata. This supersedes earlier notes that no board was established. No RK3528A product association, board-level schematic equivalence or new hardware-test result is inferred.
