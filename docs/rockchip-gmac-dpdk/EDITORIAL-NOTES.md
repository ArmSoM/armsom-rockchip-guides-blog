# 064-rockchip-gmac-dpdk 校对记录

## 原稿与版本

- CN: `Rockchip_Developer_Guide_Linux_GMAC_DPDK_CN.pdf`，V1.0.0，11 页，SHA-256 `bad1fb5d7140e1cd99a6e69794ab86a15c158b24687728bf879b8b1959fb1a72`。
- EN: `Rockchip_Developer_Guide_Linux_GMAC_DPDK_EN.pdf`，V1.0.0，10 页，SHA-256 `589fbab5e5701043af8044f5b1bd5e4580a1227d8d2d308502ca69fea6e4f69d`。

原始 PDF 未修改。删除封面发布日期/密级、声明、联系资料、读者对象及修订记录；保留技术版本范围及必要技术变更。正文为可编辑 Markdown，代码、命令、日志全部保留，不以页面截图代替正文。HTML 注释记录来源语言、PDF 页及提取单元编号。三语日期 2026-10-18，translation_key 复用现有网站机制。

## 章节与内容差异

中文正文 p4–11；英文正文从 p3 目录之后的“1. Code Compilation”开始到 p10。三章与全部小节对应，页数差异来自排版；末尾 Pktgen set/start 命令均保留。无独立技术插图，代码均为可复制文字，产品版本表为可编辑表格。

中文编译目标 `rrk3568-evb1-ddr4-v10-linux.img` 与英文 `rk3568-evb1-ddr4-v10-linux.img` 不同；双 r 在原 PDF 中确实存在，不是提取造成。中文按 CN，EN/RU 按 EN，开头提醒并未静默纠正。其余代码差异为说明语言、标点以及源注释 switche/switch。跨页日志、统计信息、负号、MAC 地址、吞吐量和路由条目全部保留。

## 排版修复与原文疑点

- 合并跨行 wget URL、工具链路径、meson 的 --cross-file/-D 参数、testpmd 的 --vdev、l2fwd 的 -- 分隔、l3fwd 的 --config、Pktgen 的 --log-level 及 diff --git 文件头，恢复单条可复制命令，不改变参数。
- 原代码框包含 menuconfig 后的“配置/configure”、烧写 boot.img 的操作说明、逗号分隔的 adb push，以及未给定目标目录的 push 命令。这些不是直接可整体执行的 shell 脚本，不补猜命令参数。
- 原产品范围 RK3568、Linux 4.19+；测试环境 Debian 11、DPDK 21.11。原性能模式命令涉及 policy4/policy6，Pktgen 示例使用核心 6/7，与 RK3568 四核范围不一致，保留并要求按目标平台核对。
- “挂载巨页”小节实际只设置 nr_hugepages，未给出挂载 hugetlbfs 命令；不代原稿补造步骤。
- 测试输出显示 cores=1，而前文配置包含多个核心；这是原日志，不能写成 ArmSoM 已验证的多核心性能。
- 原软件版本是历史固定版本，链接作为来源保留；没有下载/执行软件，也不宣称软件当前安全或适用于生产。

## 验证边界

来源内容已完整抽取及逐章对照，俄文正文按指定基准完整本地化；代码原文注释、许可证和必要署名不删除。具体 ArmSoM 板卡、PHY 连接、SDK/BSP 和硬件行为未验证。统一 Jekyll 构建、浏览器实际页面、目录跳转高亮、搜索、语言切换、sitemap/canonical/hreflang/robots 由主任务验收；未完成前不宣称通过。未 commit、push、发布或向搜索引擎提交。
