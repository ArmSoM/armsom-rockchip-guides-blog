# DRM Direct Show 校对记录

## 主任务统一验收更新（2026-10-16）

以下结果覆盖本记录早期的“待统一验收”状态：Jekyll 构建成功；本篇三语页面、原图、站内链接、表格及代码渲染检查通过；代码块 HTML 文本与 Markdown 一致。全批 30 页均已实际在浏览器打开，390px 窄屏检查无页面横向溢出，目录自动折叠，长表格/代码具备横向滚动。目录跳转、高亮、展开以及三语切换另经实际交互抽查。

本篇三个正式 HTTPS URL 均已进入现有 sitemap 和搜索索引；canonical 指向自身、hreflang 互相对应并包含自身，x-default 指向英文。robots、Google 验证文件、DNS 和原始 PDF 未修改。仅本地检查，不代表正式站响应、搜索引擎收录或硬件适配已验证。完整批次验收见 [交付报告](../common-batch-036-045/DELIVERY.md)。本地提交按用户指定顺序执行；不得自行 push 或发布。

## 来源与范围

- 原稿：`docs/cn/Common/DISPLAY/DRM/Rockchip_Developer_Guide_DRM_Direct_Show_CN.pdf`，V1.0.0，8 页。
- SHA-256：`E006D571F65B2040614DF5FCEB8E91EA3BBEDA5E65FAFEDBB07CEC577DC13665`。
- 未提供对应英文 PDF。中英俄三文均以中文技术正文为基准；英俄为全文翻译，不是英文厂商原稿。
- 第 1 页封面/声明/联系方式删除；第 2 页前言和技术版本表保留，读者对象与修订记录删除；第 3 页静态目录由站点目录替代；第 4–8 页全部技术章节保留。
- 原 PDF 未修改。文章编号 `043-rockchip-drm-direct-show`，三个语言的 translation_key 一致。

## 完整性清单

| 原 PDF | 内容 | 处理 |
| --- | --- | --- |
| 2 | 前言、产品版本 | 三语完整保留 |
| 4–6 | 1.1.1–1.1.7，7 个 API，plane 调用示例，输入/输出/commit_info 表 | 完整保留；跨页 buffer 输出表恢复为可编辑表格 |
| 6 | 源区域/目标区域图 | 提取原始 X55 图像，630×453，不裁剪、不缩放改写源图 |
| 7 | 1.2 使用流程和 7 步；2 自动测试 | 两个配置 diff 完整保留 |
| 8 | 3 Kernel Logo | diff、bmp2hex 说明及原文 URL 完整保留 |

每个语言版本：11 个代码块、4 张可编辑表格（18 个数据行）、1 张原图。三语代码块逐字相同。中文、英文、俄文均使用 `assets/cn-p6-X55.png`，没有伪称存在英文原图；alt 和正文已本地化。

## 提取修复与原文疑点

- 修复中文兼容部首字形，合并 PDF 自动断行；将源码中的跨行 `diff --git`、函数参数、hunk 上下文函数签名和 BUFFER_FORMAT 注释恢复到逻辑行，不修改标识符、值或代码含义。
- 原文第 5 页 `palne` 为自然语言拼写错误，正文改为 `plane`。
- 原文多处函数声明/调用缺少结尾分号；保留，不将接口说明擅自改为可直接编译的代码。
- 第 7 页两个 diff 的 hunk 头为 `@@ -588,6 +588,8 @@`，但展示的上下文/增行数量不足；第 8 页也仅展示部分补丁。保留原始 hunk 和内容，三语明确告知这是原文片段，不能保证直接 `git apply`。
- 原文使用 `phy_addr[3]` 称物理地址；未推断 DMA/IOMMU 地址等价性，也未对具体 BSP 做验证。
- 第 8 页原 URL 在 `https://r` 后跨行，恢复为 `https://redmine.rock-chips.com/documents/97`；没有尝试登录或声称可公开下载。

## 适配与验证边界

- 原文适用：RK356X/RK3588、配套 Rockchip Linux kernel 5.10 及以上 BSP。不把该描述扩展为主线内核保证或全部 ArmSoM 板卡支持。
- 官方 ArmSoM 文档主页已只读核对；板卡、显示接口、SDK/API 和图层绑定仍需目标系统验证。本次未运行原文代码、未硬件实测。
- 已视觉查看原 PDF 第 6 页及原图，确认表格/标签完整。代码与表格按全部技术页面逐项校对。
- 站点整体构建、canonical/hreflang、列表、搜索、响应式目录和页面预览由批次总校验统一完成；本记录不提前宣称通过。

## Translation provenance

English and Russian are complete translations of the Chinese V1.0.0 technical body. The code, names, constants and original Chinese-PDF figure are shared unchanged. The excerpts are not guaranteed to form directly applicable patches. No ArmSoM hardware testing was performed.

## Происхождение перевода

Английская и русская версии полностью переведены с китайского технического текста V1.0.0. Код, имена, константы и исходный рисунок из китайского PDF сохранены. Фрагменты diff не гарантируют применение как полные патчи. Аппаратные испытания ArmSoM не проводились.
