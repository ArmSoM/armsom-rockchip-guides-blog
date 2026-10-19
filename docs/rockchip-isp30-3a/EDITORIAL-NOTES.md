# 077 ISP30 自定义 3A 校对记录

校对日期：2026-10-19。三语完整正文、表格和原图已落盘；全站构建、搜索、SEO 和浏览器检查由主任务统一执行，未预先宣称通过。

## 来源与适用范围

- 唯一原稿：`D:\ArmSoM\chatgpt-ai-work\github\docs\en\Common\ISP\ISP30\Rockchip_Development_Guide_3A_ISP30_EN_v1.1.0.pdf`，46 页，封面 V1.1.0。
- SHA-256：`a752164bdf16a10cee0fe77e59988dabb5e5ac822aecf48e50a535c57afa1fc4`。
- 未提供对应中文 PDF。英文保留英文技术正文；中文、俄文完整翻译该正文。三语均使用 14 张英文 PDF 原图，原图中的中文标签原样保留，图注和 alt 本地化。不冒充拥有中文原图。
- p.2 技术产品表：RK3588 / Linux 5.10；系统支持表：BuildRoot Y、Debian N、Yocto N、Android Y。两表均作为可编辑表保留，只表示原稿范围，不宣称当前所有版本均如此。
- 删除封面日期、密级、免责声明、商标/版权声明、联系方式、读者对象、修订表与重复目录；技术正文 p.5–46 完整保留。代码和必要标识、注释未批量删除。原 PDF 不修改。

## 完整性和页覆盖

| 语言 | 技术标题 | 代码块 | 原图 | 可编辑表格 |
|---|---:|---:|---:|---:|
| ZH | 55 | 27 | 14 | 39 |
| EN | 55 | 27 | 14 | 39 |
| RU | 55 | 27 | 14 | 39 |

39 表包括跨页合并后的 36 张正文表、2 张产品/系统支持表和 1 张原图 15×15 FV 网格的可编辑转录。所有图均为独立图，不以整页截图代替正文。

| 章节 | 页码 | 检查范围 |
|---|---|---|
| 1 概述与架构 | 5–9 | 设计思路、库文件组织、三种开发模式、完整启动/停止伪代码、线程时序图 |
| 2.1 AE | 10–19 | register/enable/unRegister，4 个回调，输入数据与输出结果结构，单摄/环视及 I2C 曝光格式 |
| 2.2 AWB | 19–34 | 3 个 API、回调、统计、结果、硬件配置、UV/XY/YUV/排除区域结构及全部字段范围/默认值 |
| 2.3 AF | 34–46 | 完整用户算法流程、统计窗、Gamma、滤波、LDG、阈值、FV、全部参数结构和 3 页字段表 |
| 2.4 示例入口 | 46 | 完整 AIQ 目录和 AE/AWB/AF 示例路径，末页无遗漏 |

所有 42 个技术页已渲染视觉检查，包含末页、p.42 大留白和 p.40–42 跨页结构体。工作证据位于 `work/common-batch-076-080/077-rockchip-isp30-3a/`：页几何提取、原始候选、块列表、独立原图、逐页图及联系表。候选稿不作为发布正文。

## 提取与排版修复

- 原 PDF 的章节编号同时混用内部序号和正式章号，如 `4.1 1.4.1`、`3.11 2.3.11`。文章统一为正式章节层级，并为 AE/AWB 下级标题补全父级编号；不改 API 名称。
- 跨页启动/停止代码、AF 参数结构体合并；同页重复的提取灰框去重。三语代码完全相同，所有代码保留源语言注释。
- 对原 PDF 中以棕色显示的注释进行颜色核对，恢复 13 处 PDF 视觉折行造成的注释续行；不让注释后半句误成为可执行代码。未对疑似 API 错误作猜测性修复。
- 合并 AE 输出结果表 p.17–18、AWB 硬件字段表 p.27–29、AF 配置表 p.43–45，去除续页重复表头，不丢行。
- 恢复表格中被折断的 `RK_AIQ_AWB_BLK_STAT_REALWP_ILL2` 标识，并去除 `RK_AIQ_AWB_BLK_STAT_REALWP_ ALL` 中的折行空格；不替换枚举值。
- 合并计算线程描述和 FV 输出的折断句子；数学表达式采用可复制等宽文本，避免 `*`/竖线被 Markdown 解释。保留所有公式与数值。
- p.40 FV 图为 15×15 网格，所有 225 个单元格均转录为 `Fv`，原图仍保留。

## 原文疑点与未验证项

- p.10 AE 流程说明使用 `rk_aiq_uapi_customAE_*`，原型和代码为 `rk_aiq_uapi2_customAE_*`；原样区分保留。
- p.11 `customAE_enable` 与 `customAE_unRegister` 的说明仍写“Register the AE algorithm library”；译文保留“注册”含义，不静默改成启用/注销。
- p.13 `custom_ae_ctrl` 原型有额外参数，但对应参数表仅列 ctx；表未擅自补字段。
- p.14 `custom_ae_exit` 原型末尾使用全角分号；保留来源字符并记录，示例不保证可直接编译。
- p.16 源码使用 `results_singel_s` 等拼写，而说明采用 `results_single_t`；未全局修正结构名。
- p.22 AWB 回调结构疑似把控制回调也命名 `pfn_awb_run`，表则列 `pfn_awb_ctrl`；原代码和表分别保留。
- p.22 `pstAwbResult==nullptr` 初始化说明又要求配置 pstAwbResult，存在语义疑点，译文保留该条件，不猜改为 pstAwbInfo。
- p.24 `IsConverged` 后的说明没有标准 C 注释符，原样保留；代码只是原文示例。
- p.26 `rk_aiq_wb_gain_t` 引用 `Rockchip_Development_Guide_ISP32`，不是本篇 ISP30；引用保持，未换文档名。
- p.29 两个相邻标题都写 `rk_aiq_customAwb_hw_cfg_t`，第二个代码实际定义 single 配置结构；标题原名保留，说明中提示。
- p.29 表格的 blkWeightEnable/blkWeight 描述在原 PDF 视觉上即为 `Tongke_Ike_Kustomab_Hall_Cob_T-Bulkwertnabul meaning` 和 `Tongke_Ike_Coustomab_Hall_Cove_Tur in Burkwaite meaning`，不是此次提取造成；三语保留原始字符串并说明不能可靠还原。
- p.28 的 `turethreeDyuvIllu`、`rue enabled` 及若干 `ture` 为原文拼写。译文标明原文，不能据此生成实际配置。
- p.29 原文称“黑色参数可用默认值”，颜色标记语义不清；未将此句扩展为全部参数可不配置，各字段必配说明保留。
- p.39 FV 输出写 `1515`，结合前文和网格表示 15×15；英文保留原文连写，译文明确说明推断依据而不悄改。
- p.43 `wina_v_size` 被描述为宽度、比较图像宽度；p.44 WinB 尺寸边界却引用 `wina_h_offs/wina_v_offs`。这些来源冲突保留，没有猜改宽/高或窗口名。
- p.45 `v_ldg_gslp[2]` 说明为最小增益及 0~255，H 通道相应字段为斜率及 0~65535；原值保留待 SDK 验证。若干“shit bit”按明确的上下文翻译为位移，原英文不改变。
- 源文关于 FV shift 的代码注释与字段表左右移表述可能不一致；均保留，不实施硬件设置。

本篇仅平台参考，未核实具体 ArmSoM 板卡、SDK/BSP 分支、Sensor/VCM 组合或实际 AIQ 库版本。没有硬件测量、性能声明或操作设备；未执行 commit、push、发布、Search Console、DNS 或账号权限操作。复用 `camera` 分类与统一 translation_key，没有修改共享模板、搜索、SEO、语言切换或目录机制。
