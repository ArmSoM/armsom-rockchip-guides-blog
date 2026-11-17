# NPU 入门四语文章本地验收

检查日期：2026-11-17。范围仅为本次新增的 `rockchip-npu-rknn2-rknn3-getting-started` 四语文章及其配图。

## 已验证

- Jekyll 3.10.0 构建成功。为避免复制全站历史大文件，构建输入采用工作区的站点文本快照，保留完整文章集合、模板、配置与数据；本地预览将 `/assets/`、`/docs/`、`/downloads/` 映射到仓库原文件。未将精简单页 HTML 冒充网站预览。
- 四语正文均包含 15 个二/三级标题、11 个 Bash 代码块和 2 张流程示意图。四语代码块逐字一致，Bash 语法检查通过。未执行这些板端或模型转换命令。
- 八张本地化 SVG 均成功生成 PNG，图中文字未超出画布。分享图尺寸为 1200 × 630；流程图为 1200 × 580。
- 四个实际文章页面均返回 200；图片加载成功且比例正确；正文内站内链接目标存在。
- 顶部 EN / 中文 / RU / DE 均关联本文章对应版本。
- 桌面侧边目录含 15 项，章节跳转与当前位置高亮通过；390 px 窄屏目录可折叠/展开。
- 四语页面在 1440 px 和 390 px 下无整页横向溢出；长代码块和表格在各自容器内横向滚动。已查看中文桌面、中文/德文手机截图。
- 站内搜索包含四语文章；四语文章库以 `RKNN2 RKNN3` 和 `CM5` 过滤均可找到文章。
- 四页 canonical 均指向自身正式 `https://blog.armsom.org` 地址；hreflang 四语互相对应并含自身，x-default 指向英文版。
- sitemap 中四个新页面各出现一次，未添加校对记录、素材或本地地址。
- 社交分享采用本语言图片，Open Graph 图片地址为正式 HTTPS URL，Twitter Card 为大图类型。
- 未修改生产 robots、网站验证文件或发布配置。预览服务器仅监听 127.0.0.1，响应附带 `X-Robots-Tag: noindex, nofollow`。
- 原始截图 SHA-256 未改变。检查前已存在的无关文件没有被覆盖。

## 本地预览

- 中文：http://127.0.0.1:4050/zh/articles/rockchip-npu-rknn2-rknn3-getting-started/
- English：http://127.0.0.1:4050/articles/rockchip-npu-rknn2-rknn3-getting-started/
- Русский：http://127.0.0.1:4050/ru/articles/rockchip-npu-rknn2-rknn3-getting-started/
- Deutsch：http://127.0.0.1:4050/de/articles/rockchip-npu-rknn2-rknn3-getting-started/

## 未执行

未在 ArmSoM 板卡安装 SDK、转换模型、编译 Android demo、运行推理或测量性能；未验证具体镜像的驱动/Runtime 兼容性。本文属于文档与示例源码核对后的平台参考。

本记录为发布前的本地验收；验收阶段未 commit、push、发布或提交搜索引擎。上述页面与 SEO 验证是本地构建结果，正式上线需以后续部署和在线页面检查为准，也不代表已被搜索引擎收录。
