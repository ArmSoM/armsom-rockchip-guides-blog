# Rockchip CAN 三语整理与校对记录

本地审核稿，未发布。技术基准为 `docs/cn/Common/CAN/Rockchip_Developer_Guide_Can_CN.pdf`，RK-KF-YF-C44 V1.3.0（2025-10-09），9 页，SHA-256：`f11bd07992b3720e2bb1ba3165c552b190d48414edc0dc8f1fc0cb2f4ad6972b`。英文对照为 `docs/en/Common/CAN/Rockchip_Developer_Guide_CAN_EN.pdf`，同为 9 页、V1.3.0，SHA-256：`5184a1c16c24af1b4a1f9a6d64b17e38a02b37cb8410c53553cd9827b86d3501`。

## 已完成范围

- `README.zh-CN.md`、`README.md`、`README.ru.md` 是中文、英文和俄文完整可编辑正文的归档副本；网站版本位于三套 `_articles*` 集合。
- 保留驱动路径、兼容字符串、DTS 属性、配置符号、Buildroot 宏、命令、地址、帧格式和两条原始计算公式。
- 源文件没有独立技术图像（每页 image/XObject 计数均为 0）；页面没有用整页截图代替正文。
- 已移除封面发布日期/密级、免责声明、商标/版权/联系信息、读者对象和修订记录；技术版本、文件 ID 和正文变更（支持的 SoC）通过正文和本记录保留。

## 版本差异与待核对项

- 两个版本均为 9 页，技术章节和命令对应。中文原文把扩展数据帧示例说明写作 `date:DEADBEEF`，英文写作 `Data:DEADBEEF`；实际命令均保留为 `cansend can0 00000123#12345678`。
- `BitRate` 公式按源文逐字保留，其中除数写作 `2 *(brq + 1) / (...)`。该排版/括号关系需在修改驱动时结合目标 SoC TRM 与实际 BSP 验证；没有擅自改写公式。
- 回环命令的 `0xfe580000` 是源示例，必须替换为实际启用的 DTS CAN 控制器基址。
- Sige7/AIM7 与 RK3588、Sige5/CM5/AIM5 与 RK3576 的 SoC 对应关系只说明适配入口；并不证明板卡已布线 CAN、包含收发器或通过测试。

## 未经验证声明

没有产生 ArmSoM CAN 收发、速率、时钟、采样点、DMA 或终端电阻测试结果。所有行为与数值均为 Rockchip 源文档说明；板级验证仍必需。
