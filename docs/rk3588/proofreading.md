# RK3588 / AIM7 / Sige7 / LM7 校对与来源记录

整理日期：2026-11-02。四个主题，各含中文、英文、俄文、德文，共16篇。本文集为产品选型与技术解读，不将 Datasheet 解读冒充全文逐行翻译；34页原始 PDF 完整提供下载。

## 输入与图片

- 用户提供 RK3588 Datasheet V1.4，2022-05-24，34页；原始文件 SHA256 见 source-manifest.json，复制后未修改。
- 第16页框图、第17页标记和顶视图、第18页底面/侧面、第19页尺寸图，独立渲染，保留原始标记。四语共用英文原图，alt 按语言本地化。
- AIM7 产品图：https://docs.armsom.org/assets/images/aim7-fd3d92c0f9d36a4e7657b09d9b082e1b.png
- Sige7 产品图：https://docs.armsom.org/assets/images/sige7-bananer-50cade75dba79992e08afb3e3ce32565.png
- LM7 产品图：https://docs.armsom.org/assets/images/lm7-497f310f72db247b7abb96b5ffb612d6.png

## 事实边界与差异

1. AIM7 官方文档的 Nano 兼容说明需要结合具体载板引脚、电源和外设核对。没有据此宣称兼容所有 Orin 载板；Orin Nano/NX/AGX 分别看待。
2. CUDA/TensorRT 引擎不能直接作为 RKNN 模型运行。需要原始模型导出、转换、算子和量化精度验证；不把 TOPS 比值当实际替代性能。
3. V1.4 的 RK3588 NPU 条目没有套用 RK3576 的 Sparsity 脚注。保留三核及最高6 TOPS，实际模型支持取决于工具链。
4. PDF 第9页 JPEG Decoder 小节写“Embedded four encoder units”，与标题不一致。原稿保留，正文指出待核对，不猜测应为 decoder。
5. ISP 48M@15、32M@30 双ISP及16M@30单ISP分别列出；不把公开简介中的32MP/双16MP与不同模式简单判为同一规格。
6. 按编解码格式分别列出上限，不能笼统声称所有格式8K60；多路同时运行数量需系统验证。
7. 图形API、ISP、DP公开描述与旧版PDF存在表述差异，正文锚定V1.4，不声称此版为最新。
8. 电气/热参数取自第30、34页；结温与环境温度区分，热阻为指定板件条件模拟参考，不能套用任意成品。
9. LM7 模块4V±5%与Sige7成品供电分开。SoC焊球与模块连接器引脚分开。
10. 应用场景为开发建议，没有虚构 ArmSoM 实测、价格优势、客户部署或认证结果。

## 接入与验收

复用四语 collection、translation_key、目录、搜索、分类、sitemap、canonical/hreflang。未更改 robots、验证文件、DNS 或 Search Console。
静态构建及16页链接/SEO结果见 preview-qa.json。16个页面本地 HTTP 均为200。浏览器实测中文芯片页目录跳转和当前位置高亮正常；390px视口下目录折叠、长表格内部横向滚动、页面无横向溢出。AIM7实际页面已打开。当前仅本地整理与预览，未提交或推送。
