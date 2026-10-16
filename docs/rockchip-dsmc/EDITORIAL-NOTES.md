# Rockchip DSMC 三语校对记录

## 原稿与处理原则

- CN：`docs/cn/Common/DSMC/Rockchip_Developer_Guide_DSMC_CN.pdf`，17 页，V1.2.0。
- EN：对应英文 PDF，19 页，V1.2.0；俄文完整翻译英文技术正文。
- 两稿八章对应一致，含最新版 DTS 属性及 §8 Note。前言都写 RK3576、RK3506、RV1126B / kernel 6.10，原样保留，不猜测修改为其他内核。
- 保留全部技术正文、完整四个 CS/每 CS 四个 region 的 DTS 示例、接口、用户态示例、patch、日志、图与技术版本表。删除指定封面/非技术章节；原 PDF 未修改。

## 逐章覆盖

| 章节 | CN PDF | EN PDF | 重点 |
|---|---|---|---|
| 1–2 术语与概述 | 4 | 4 | DSMC、PSRAM、DPRAM、位宽与协议 |
| 3 驱动、DTS、内核 | 4–10 | 4–11 | 所有 CS/region、clock-mode、ranges、内核配置 |
| 4 内核访问 | 11 | 11–12 | ops、CPU/DMA 示例、直接访问 |
| 5 用户态访问 | 11–12 | 12–13 | open/mmap/munmap/close、dev/mem |
| 6 内存空间 | 13–14 | 14–15 | PSRAM 与 Local Bus 图及边界 |
| 7 交互 | 14–15 | 15–17 | FIFO、APP_CON/LBC_CON、双向中断及 DMA |
| 8 Note | 16–17 | 17–19 | IO 频率、位宽、启动异常、自检异常与最后警告 |

## 修复与配图

- 几何提取后去除同页、同坐标重复绘制的灰底代码框，避免重复展开 DTS；不同位置的真实重复示例不删除。
- 合并跨页长 DTS 代码，完整保留全部节点、属性、地址和参数；源码中的注释/省略号保留，不擅自补全。
- 中文字体兼容部首恢复正常字形；正文管道/星号与尖括号保护，避免 Markdown 吞内容或误变成表。
- CN 7 图，来自 p9×2、p10、p13、p14×2、p15；EN 7 图，来自 p9、p10×2、p14、p15×2、p16。俄文复用 EN 原图。
- 图像按原图区域独立保存于 `assets/`，已逐张检查；空间划分、边界和寄存器示意图同时提供可编辑转录。图中的 `DPRA` 与正文 `DPRAM` 保留源差异。
- 未使用整页截图代替正文。图注与 alt 本地化，图内技术标识不改变。

## 原文疑点与待核对

1. 前言 kernel 6.10：两稿一致，但需要与实际 ArmSoM BSP 验证；本文不等同板级兼容承诺。
2. §4.1 声明 `rockchip_dsmc_find_dev()`，说明和示例使用 `rockchip_dsmc_find_device_by_compat()`，命名不一致，按实际源码核对。
3. §4.1 示例 `static void test(void)` 内出现 `return 0;`，循环变量为 `cs`，访问却使用 `cs_cfg[i]`；`test_addr`、`test_data` 等并未定义。这是原文片段，不是经过编译的完整示例，未静默修复。
4. §5.1 示例 `device_name = "/dev/dsmc/cs0/region0"` 缺少末尾分号，`u32v` 等外部定义未给出；保留并标明执行前须补齐/核对，不编造“可直接运行”。
5. §3 和 §6 的 `rockchip,ranges` 与 `map, ranges` 名称混用；原始文字和 DTS 均保留，实际属性以对应驱动 binding 为准。
6. §3 DTS 的 `rockchip,attribute = "DPRA"` 与解释 DPRAM 不同，可能是实际约定字符串，不能直接替换。
7. §8 外接 Local Bus 从设备不自动识别位宽，而 PSRAM 自动识别，两者不得混淆。RK3506 作为 slave 的 x8 条件保留。
8. 原文认为 O_SYNC/MAP_LOCKED 使映射 uncached，此处是来源说明，实际行为依内核驱动和 mmap 实现确认，未做验证。

## 适用与验收边界

最终代码交叉核对：英文与俄文代码逐字一致；中文长 DTS 与英文去除注释及排版空白后完全一致。中文 PDF 第 11 页 `find_dev(void)` 后为全角分号 `；`，英文第 11 页为 ASCII `;`，三语分别保留对应原稿，不把中文排版字符默认为可编译代码；实际工程须核对源头声明。

仅作为 ArmSoM 平台参考，实际板卡、SDK/BSP、从设备协议/容量、供电初始化顺序需要核对。直接内存访问、DMA 和错误配置可能造成总线异常、数据损坏或启动失败；没有执行硬件读写。

全文及图片已保存，构建、实际页面、语言切换、目录/搜索、窄屏、sitemap/canonical/hreflang 等由主任务统一验证。没有 commit、push、发布或搜索引擎提交。
