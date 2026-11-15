# Blog 内容基础优化记录（2026-11-14）

仅修改 Blog 仓库。官网和 Docs 只读核对，未改动外部站点、WAF、DNS、Search Console、定时任务；未 commit、push 或发布。

## 已落实的第一阶段

- Blog 产品唯一索引：`_data/products.json`，18 个板卡/模块/平台；统一型号、SoC、形态、资料入口、已核实产品链接、核对日期与疑点。首页排序单独保留。
- 事实字段包含内存、存储、接口、系统、供电、尺寸、生命周期、认证、供货及兼容性。只录入已核对字段；其余明确为 null，不能当成产品不支持，也不能当成已经确认。
- CM7s/CM7S、Sige7s/Sige7S、P2pro/P2 Pro 在卡片、筛选、搜索索引与关联资源中使用统一名称；旧查询链接仍可使用。原始文章、代码和参数不批量重写。
- 四语共用文章信息组件：显示原发布日期、已有真实内容更新日期与已署名作者。16 篇缺作者的页面显示“内容发布：ArmSoM”；不捏造作者、审核人或测试记录。只有填写真实 reviewed_by/reviewed_at 才能显示技术审核信息。
- 文章文末复用产品索引，提供产品页、规格/手册与相关教程。区分正文关联产品与相关平台参考产品，不把平台相关性改写成已完成兼容性验证。
- 10 个重点主题的 40 个语言版本新增对应的适用范围和主要资料入口，版本细节仍在正文中保留。
- 不生成虚假更新日期，不新增 Product/FAQ/HowTo 结构化数据，不承诺搜索收录、排名或 AI 引用。
- 原有 9 个附件入口保留；此轮没有逐项审计附件规格。

## 现状基线

- 共 2262 个文章语言版本：en 565、de 565、ru 565、zh 567。
- 968 个文章语言版本有关联产品/相关平台产品，将获得统一资源区；未关联的文章不硬加产品。
- 原 Markdown 正文中，508 篇没有 Docs 链接，1469 篇没有官网产品域名链接。这是正文字符串计数，不等同于整页完全没有入口。
- 此轮没有读取 GSC 点击、展示、CTR、排名或转化；以上是内容与链接基线，不是搜索效果报告。

## 产品索引

| 型号 | SoC | 形态 | 产品入口 | 正式资料 |
|---|---|---|---|---|
| Sige7 | RK3588 | SBC | [产品页](https://www.armsom.org/sige7) | [Docs](https://docs.armsom.org/armsom-sige7) |
| Sige7S | RK3588S | SBC | [产品页](https://www.armsom.org/sige7s) | [Docs](https://docs.armsom.org/armsom-sige7s) |
| Sige5 | RK3576 | SBC | [产品页](https://www.armsom.org/sige5) | [Docs](https://docs.armsom.org/armsom-sige5) |
| CM7S | RK3588S | SoM | [产品页](https://www.armsom.org/cm7s) | [Docs](https://docs.armsom.org/armsom-cm7s) |
| CM5 | RK3576 | SoM | [产品页](https://www.armsom.org/cm5) | [Docs](https://docs.armsom.org/armsom-cm5) |
| AIM7 | RK3588 | SoM | [产品页](https://www.armsom.org/aim7) | [Docs](https://docs.armsom.org/armsom-aim7) |
| Sige3 | RK3568B2 | SBC | [产品页](https://www.armsom.org/sige3) | [Docs](https://docs.armsom.org/armsom-sige3) |
| Sige1 | RK3528 | SBC | [产品页](https://www.armsom.org/sige1) | [Docs](https://docs.armsom.org/armsom-sige1) |
| Sige6 | Allwinner A733 | SBC | 未核实独立产品页；使用 Docs | [Docs](https://docs.armsom.org/armsom-sige6) |
| CM1 | RK3506J | SoM | [产品页](https://www.armsom.org/cm1) | [Docs](https://docs.armsom.org/armsom-cm1) |
| CM3 | RK3568 | SoM | 未核实独立产品页；使用 Docs | [Docs](https://docs.armsom.org/armsom-cm3) |
| AIM3 | RK3568 | SoM | [产品页](https://www.armsom.org/aim3) | [Docs](https://docs.armsom.org/armsom-aim3) |
| AIM5 | RK3576 | SoM | 未核实独立产品页；使用 Docs | [Docs](https://docs.armsom.org/armsom-aim5) |
| LM7 | RK3588 | SoM | [产品页](https://www.armsom.org/lm7) | [Docs](https://docs.armsom.org/armsom-lm7) |
| W3 | RK3588 | Kit | [产品页](https://www.armsom.org/product-page/lm7-development-kit) | [Docs](https://docs.armsom.org/armsom-w3) |
| Forge1 | RK3506J | SBC | [产品页](https://www.armsom.org/product-page/forge1) | [Docs](https://docs.armsom.org/armsom-forge1) |
| P2 Pro | RK3308B-S | SBC | [产品页](https://www.armsom.org/p2pro) | [Docs](https://docs.armsom.org/armsom-p2pro) |
| KVM | RK3568 | KVM | 未核实独立产品页；使用 Docs | [Docs](https://docs.armsom.org/armsom-kvm) |

W3 的产品入口为含 W3 maker kit 选项的 LM7 页面，卡片提示选择 W3 套件，不将裸模块等同套件。Forge1 使用已核实的商店产品页。

## 优先完善的 10 个主题（均为中英俄德）

- [RK3576 芯片详解：从八核 CPU 到 ArmSoM 边缘 AI 产品](https://blog.armsom.org/zh/articles/rk3576-chip-guide/)
- [RK3588 芯片详解：八核 CPU、6 TOPS NPU 与高速扩展如何落地](https://blog.armsom.org/zh/articles/rk3588-chip-guide/)
- [RK3588S 芯片详解：从八核 CPU、6 TOPS NPU 到 ArmSoM 产品落地](https://blog.armsom.org/zh/articles/rk3588s-chip-guide/)
- [ArmSoM CM5：树莓派 CM4/CM5 项目的替代选型与迁移指南](https://blog.armsom.org/zh/articles/cm5-raspberry-pi-cm4-cm5-alternative/)
- [AIM7 替代 Jetson Nano/Orin：从硬件评估到 RKNN 模型迁移](https://blog.armsom.org/zh/articles/aim7-jetson-nano-orin-alternative/)
- [CM7S 与 Sige7S 怎么选？两种 RK3588S 产品开发路线](https://blog.armsom.org/zh/articles/cm7s-sige7s-rk3588s-selection/)
- [RK3308B-S 芯片详解：为语音、音频与轻量联网设备而设计](https://blog.armsom.org/zh/articles/rk3308bs-chip-guide/)
- [ArmSoM CM5 运行 RetroArch：用 RK3576 搭建复古游戏终端](https://blog.armsom.org/zh/articles/armsom-cm5-retroarch/)
- [ArmSoM × Armbian：从镜像选择到第一个 Linux 项目](https://blog.armsom.org/zh/articles/armsom-armbian-getting-started/)
- [用户案例：ArmSoMNAS，用 Sige7 打造模块化便携 NAS](https://blog.armsom.org/zh/articles/armsomnas-sige7-portable-nas/)

## 已记录、未擅自修正的事实冲突

### Sige5

来源：[正式文档](https://docs.armsom.org/armsom-sige5)，核对日期 2026-11-14。

- RAM option range differs between the key specification (8/16 GB) and comparison table (4/8/16 GB); confirm the actual SKU.
### CM7S

来源：[正式文档](https://docs.armsom.org/armsom-cm7s)，核对日期 2026-11-14。

- Docs records a CN2 pin 2/4 issue in V1.1 and a planned fix in V1.2; do not assume the fix is released without a version-specific record.
### CM5

来源：[正式文档](https://docs.armsom.org/armsom-cm5)，核对日期 2026-11-14。

- RAM type is hardware-revision dependent: V1.3 LPDDR5 versus V2.0 LPDDR4X. The same page also describes V2.0 as forthcoming; current availability is not verified.
- Pin 21 compatibility issue is described for V1.2 and fixed in V1.3. Do not claim universal CM4/CM5 drop-in compatibility.
### AIM7

来源：[正式文档](https://docs.armsom.org/armsom-aim7)，核对日期 2026-11-14。

- RAM option lists differ (8/16/32 GB versus 8/32 GB); confirm SKU.
- Jetson form-factor comparisons are not evidence of CUDA/TensorRT compatibility or universal carrier-board compatibility.
### AIM3

来源：[正式文档](https://docs.armsom.org/armsom-aim3)，核对日期 2026-11-14。

- Docs module description and listed dimensions/power resemble an SBC; dimensions, power and connector compatibility need schematic confirmation.
### AIM5

来源：[正式文档](https://docs.armsom.org/armsom-aim5)，核对日期 2026-11-14。

- RAM type differs: LPDDR5 in key specifications versus LPDDR4X in comparison table.
- The Docs purchase link points to AIM7, not AIM5. Do not reuse it as an AIM5 product link.
### P2 Pro

来源：[正式文档](https://docs.armsom.org/armsom-p2pro)，核对日期 2026-11-14。

- CPU: Docs includes 1.2 GHz and 1.3 GHz; the existing RK3308B-S article also cites 1.1 GHz from its datasheet. Do not collapse these into a maximum.
- RAM: 512 MB in overview versus 256/512 MB in the table.
- Weight: 42 g versus 30 g.
### KVM

来源：[正式文档](https://docs.armsom.org/armsom-kvm)，核对日期 2026-11-14。

- Existing Blog registry said RK3568B2; current product Docs identifies RK3568. Use the verified family; B2 suffix is not confirmed here.

## 下一阶段边界

1. 由产品负责人确认上述冲突、生命周期、认证、供货与 SKU，随后补全事实字段；不能把 Docs 内互相矛盾的参数直接推广到全站。
2. 再按访问数据确定下一批主题，逐篇完善可追溯来源、硬件版本与明确的用户问题。40 篇来源区完成不等于 2,262 篇全文都已重新校对。
3. 结构化数据、全站外链/旧链接审计、移动性能指标及搜索数据基线属于后续步骤。本轮不声称完成三站审计，也未确认真实 Googlebot/Bingbot 的 WAF 行为。

## 后续维护

- 先更新产品索引及证据，再检查首页和关联资源；不要在多个模板中复制规格。
- 文章专有来源和范围使用 `_data/article_evidence.json`，以 translation_key 关联四语，来源核对时间不作为文章更新时间。
- 补写日期、技术审核人或测试结果时，必须具有对应记录；实际正文更新才按编辑规则更新 last_modified_at。
- 可运行 `ruby scripts/check-blog-product-data.rb`，检查产品别名、来源映射、四语对应关系和内部来源页面。

## 验证

已通过：

- Jekyll 全站页面构建：2,262 个文章语言版本；为减少本地磁盘扫描，静态资源直接复用仓库，原生产构建配置未改变。包含全部页面的预览已启动；没有重新验证部署时静态资源的完整复制过程。
- 页面 canonical 自指正式 HTTPS 地址，hreflang 与实际存在的版本一一对应；sitemap 共 2,522 个唯一 URL，不含校对记录和数据文件。
- 原 64 条 lastmod 保持有依据的原值；robots 和 Google 验证文件保留。
- 968 个产品资源区、40 个四语来源/范围说明、16 个组织发布者回退全部检查通过。
- 四语切换、1280px 桌面与 390px 手机排版、目录折叠/跳转/高亮检查通过，无整页横向溢出。
- 旧筛选链接 CM7s、Sige7s、P2pro 分别得到 52、50、15 条中文结果；P2pro 文字搜索同样有效；空白重复产品选项已修复。
- 原 RKNN3 批次的 127 个未提交文件仍在，文章正文没有批量改写。

详细结果见 `blog-foundation-validation-20261114.json`。未执行远程部署、真实手机性能测量、GSC 数据读取或逐篇全文事实复核。

本地预览：

- [中文文章](http://127.0.0.1:4046/zh/articles/cm5-raspberry-pi-cm4-cm5-alternative/)
- [英文文章](http://127.0.0.1:4046/articles/cm5-raspberry-pi-cm4-cm5-alternative/)
- [产品筛选](http://127.0.0.1:4046/zh/library/?product=CM7S)
