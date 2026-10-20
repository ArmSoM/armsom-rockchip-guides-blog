# RK3399 MCU 校对记录

## 来源

- CN: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\MCU\Rockchip_RK3399_Developer_Guide_MCU_CN.pdf`；11页；SHA-256 `d81ba2cadce3e9803b3f04ffab4b1983976542fddcba48ffd48bb7780c3868ab`。
- EN: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\MCU\Rockchip_RK3399_Developer_Guide_MCU_EN.pdf`；10页；SHA-256 `23e9887dcc08d9078f9eb61d6f1ec1c32a288f18c2933e85035f4b534999a30a`。

## 版本及差异处理

- 中英文均 V1.3.0；文件 ID 不同：中文 RK-KF-YF-124，英文 RK-KF-YF-123。章节1–5完整对应；分页不同，代码跨页重新连接。
- 用户于本聊天明确选择四语统一中文 `rk3399-box-m0`。英文原稿 `rk3399-pmu-m0` 在四语正文并列披露，未静默替换或判定哪一个正确。
- 中文JTAG调试列DS-5/ICE，英文多Jlink；全部语言保留并注明英文补充来源。
- 两PDF都无独立技术图，未伪造原图。产品表（RK3399/Linux4.4）信息保留在开头适用说明。

## 提取与排版修复

- 全部启动地址、SGRF公式、时钟代码、复位代码、Mailbox DTS、目录树、make help、向量表、中断API和参考文档保留；恢复缩进和跨页代码。
- 剔除原稿非技术封面声明、日期密级、厂商联系方式、读者对象、修订表与重复静态目录；动态目录复用网站现有机制。
- 英文少量语法保留原技术含义；俄德完整翻译英文稿正文，按授权修改分支。

## 原文疑点（不猜测修正）

- 两个 JTAG iomux 行完全重复：`GRF_GPIO4B_IOMUX[9:8] = 2’b10`，原文即如此，均保留。
- reset文字指PMUCRU_SOFTRST_CON0(0x0110)，示例却写CRU_SOFTRSTS_CON(11)；位域[5:0]与4b宽度亦不一致。寄存器/常量原样保留，需按TRM与实际BSP核实，不能直接操作硬件。
- Cortex-M0文档示例注释称Cortex M3；代码内部注释原样保留。
- 原文映射算式采用Unicode破折号 `ADDR_MCU = ADDR_CA72 – 0xB8000000`，按文字算式展示，不伪装成可直接编译C语句。
- 未验证具体ArmSoM板卡、DDR安全区、SDK/BSP和SWD连接；不适用于所有SoC。

## 校对覆盖

- 中文正文 p.5–11；英文正文 p.3–10；全部5章及参考文档已恢复。
- 构建、搜索、sitemap、canonical/hreflang、浏览器验收待批次统一登记。
