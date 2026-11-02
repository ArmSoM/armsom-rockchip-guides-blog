# RK3576 四语系列校对记录

日期：2026-11-02。范围：4 个主题 × 中英俄德；阅读/选型原创解读，不是 46 页全文翻译。原始 PDF 完整保留，未修改。未提交、未推送、未发布本批。

## 资料与定位
- 用户提供 RK3576 Datasheet V1.0，46 页，2024-03-15；源路径及 SHA256 见 source-manifest.json。
- https://www.rock-chips.com/a/en/products/RK35_Series/2024/1212/2033.html
- https://www.rock-chips.com/uploads/pdf/2024.3.18/191/RK3576%20Brief%20Datasheet%20V1.2-20250828.pdf
- https://docs.armsom.org/armsom-cm5
- https://docs.armsom.org/armsom-sige5
- https://www.raspberrypi.com/products/compute-module-5/
- https://github.com/armbian/build/blob/main/config/boards/armsom-cm5-rpi-cm4-io.csc

## 关键核对
1. V1.0 第 11 页 6 TOPS INT8 有 Sparsity 脚注；四语保留稀疏口径。
2. 第 41 页 CPU/GPU/NPU 最高频率均 TBD。产品页数值不倒填进旧 PDF。
3. V1.0 Vulkan 1.1/OpenCL 2.0，与 Brief V1.2 Vulkan 1.2/OpenCL 2.1 有差异；驱动支持需验证。
4. 原稿和产品网页有 8K 解码叙述，新版 Brief 主要列 4K 档位；不混为统一无条件上限，H.264 单独看。
5. 内存双通道，每通道 16-bit。Sige5 网页参数区与详细表的 32/64bit 存在冲突，不使用错误的 64-bit 总线宣传。
6. CM5 文档说明 CM4 底板路径及显示接口差异；不宣称任意 CM4 底板或 CM5 IO 无条件兼容。官方比较表中 CM4 无 eMMC 的说法没有沿用。
7. CM5 v1.2 Pin 21 修复信息保留。内存配置跟随 SKU，不将 LPDDR5 作为所有修订通用配置。
8. 第 46 页温度为结温不是环境温度。热参数保留条件和模拟数据性质，不冒充整机实测。
9. 图表来自第 22–25 页。裁图只保留技术区域，未去掉图内原始标识；英俄德沿用英文原图，图注本地化。
10. 产品图来自 ArmSoM 文档网页，保存为 cm5.png 和 sige5.png。属于官方带英文文案产品图，不宣称是本次实拍。
11. 未编造性能、价格、功耗或认证；六种应用均为待验证方案。

## 验收
构建及页面检查结果见 preview-qa.json（完成后生成）。电气与应用未进行硬件测试。
