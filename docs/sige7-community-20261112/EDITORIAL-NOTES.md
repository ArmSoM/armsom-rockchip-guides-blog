# Sige7 社区与应用文章校对记录

## 范围

- 一个主题，中英俄德四语；保留既有 projects 分类、Sige7 产品关联、translation_key、顶部语言切换、目录、搜索和 SEO 机制。
- 不将公开条目包装为新近推荐、独立认证或完整评测；未宣称历史问题全部解决。应用规划与用户案例分别注明。
- 本次先完成本地预览；2026-11-12 用户确认后，已批准提交并发布。

## 事实与来源（2026-11-12 核对）

- https://github.com/geerlingguy/sbc-reviews/issues/56 ：通过 GitHub API 复核作者 geerlingguy，创建时间2024-11-08，标签 testing in progress，19条评论；样机注明 ArmSoM/BPI 提供。正文仅简短概述状态并链接原帖，未复制原帖的照片或测试模板。
- https://github.com/geerlingguy/sbc-reviews/issues/56#issuecomment-4588587535 ：作者 platima，2026-05-31；Ubuntu/Frigate-rk 与散热属于该用户反馈，不归给 Jeff，不扩展成所有板卡的实测保证。
- https://www.armsom.org/sige7 ：核对 RK3588、最高6 TOPS(INT8)、最高32GB、双2.5GbE、M.2 PCIe3.0 x4。未引用2024年测试机价格作为当前价格。
- https://docs.armsom.org/armsom-sige7 ：产品说明入口。
- https://docs.armsom.org/getting-start/flash-img ：已从官方导航点击确认路径；不建议把所有镜像都用同一种烧录工具处理。
- https://docs.armsom.org/advanced-manual/rknn-sdk ：复用现有正式开发文档链接。
- 既有四语 armsomnas-sige7-portable-nas 用户案例：仅概述模块化设计并链接完整文章，不制造额外性能数据。

## 配图

- /assets/rk3588/sige7.png：复用仓库官方产品图，未修改图片。
- /assets/armsomnas-case/compact-desktop.png：复用用户案例实物照片，图注明确项目附件不是Sige7标配，也不是Jeff的测试装置。
- 四语图片相同，alt与图注本地化；没有使用人物照片、认证徽章或伪造推荐引语。

## 结构与验证

- 四语7个二级标题、一张3行数据表、2张图片、四步上手建议、产品和案例链接一致；没有新增命令或测试数值。
- 原仓库基线为74d1e8b408b3242d82e19add553cfea82f797789，开始前工作区干净。
- 完整Jekyll production构建成功（461.63秒）；4篇页面HTTP 200，2张配图完整加载。
- 四语切换已在浏览器逐一操作，互相对应同一主题；canonical为各自正式HTTPS地址，hreflang包含4语及x-default。
- 搜索共2222条、sitemap共2478条，本批4篇各出现一次，无重复或校对记录混入。第62页继续覆盖当前文章数量。
- 浏览器项目分类搜索Sige7可找到新文章与ArmSoMNAS；390px手机视口无页面横向溢出，德文表格在自身容器横向滚动，图片保持比例。
- 手机目录可折叠，章节点击跳转和当前位置高亮通过检查。官网、产品文档、烧录、RKNN与论坛入口均HTTP 200。
- robots及Google站点验证文件未改，既有素材与文章未改。本次没有硬件复测，不宣称已经获得搜索引擎收录。
- 已打开中文本地预览：http://127.0.0.1:4043/zh/articles/armsom-sige7-community-linux-projects/ 。本段记录本地验收结果；发布结果以随后 Git 提交及部署记录为准。
