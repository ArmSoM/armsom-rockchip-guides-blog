# ArmSoM × Armbian 四语系列校对记录

日期：2026-11-03。3主题、12篇完整本地化文章；原创使用与工程规划指南，非第三方文档全文翻译。仅本地预览，不commit/push/发布。

## 主题
1. armsom-armbian-getting-started：镜像、启动、基线与维护（8节+关联阅读）。
2. sige5-sige7-armbian-projects：六种项目与验收（9节+关联阅读）。
3. cm5-armbian-custom-device：载板、适配、构建与生命周期（9节+关联阅读）。

## 官方资料
- https://armbian.com/vendors/armsom （当前10条目，包含CM7s IO；此前缓存9条目未继续使用）
- https://armbian.com/boards/armsom-sige5
- https://armbian.com/boards/armsom-sige7
- https://armbian.com/boards/armsom-cm5-io
- https://armbian.com/boards/armsom-cm5-rpi-cm4-io
- https://docs.armbian.com/getting-started/
- https://docs.armbian.com/getting-started/choosing-an-image/
- https://docs.armbian.com/contribute/board-support-rules/
- https://docs.armsom.org/armsom-sige5
- https://docs.armsom.org/armsom-sige7
- https://docs.armsom.org/armsom-cm5
- https://docs.armsom.org/armsom-cm5-io
- https://www.armsom.org/sige5
- https://www.armsom.org/sige7
- https://www.armsom.org/cm5

## 图片
复用仓库已有官方英文产品图：assets/rk3576/sige5.png、cm5.png和assets/rk3588/sige7.png。出处为相应ArmSoM硬件文档，原始记录见docs/rk3576/EDITORIAL-NOTES.md及docs/rk3588/proofreading.md。
新增四语SVG流程示意图assets/armbian-series/workflow-{lang}.svg，为原创流程图，不是运行截图。未把AI概念板卡当实物或实测截图。

## 边界与校对
- Community不写为Standard认证或完整外设支持；按官方规则说明无Standard测试维护保证。
- edge/rolling作为测试用途，不宣传直接用于生产。
- 两种CM5载板目标分别记录，不宣称任意CM4/CM5底板无条件兼容。
- 核心规格仅用SoC/网络/存储接口，未放大TOPS、频率、价格或吞吐量；图内芯片指标不等于Armbian功能验证。
- 应用方案为工程建议，未编造跑分、功耗、驱动测试或客户部署。
- 所有代码仅为只读诊断示例，四语逐字一致；章节数一致，产品链接齐全。
- 使用现有分类linux、translation_key、目录、搜索与SEO机制；不改爬虫、站点验证或线上设置。

## 验收
构建后结果见preview-qa.json。浏览器验收在构建后补充。

## 浏览器验收完成
- 三篇中文实际文章页面已打开并保留预览。
- 中德顶部切换指向同主题，德文产品图与流程图加载成功。
- 桌面无横向溢出；390px 窄屏目录可折叠，章节跳转及当前位置高亮正常，表格和代码块可横向滚动。
- 12 个语言页面 HTTP 200，canonical、hreflang、sitemap、搜索索引及配图路径检查通过。
- 本批仅本地文件及预览，未 commit、push 或发布。
