# 五篇工程文章本地验收

日期：2026-11-17。

## 交付

- 5 个主题，中文/英文/俄文/德文共 20 个 Markdown 页面。
- 20 张本地化 SVG 流程图及对应 20 张 1200×630 PNG 分享图。
- 68 张可编辑表格，76 个代码块。各主题四语的章节数量、表格结构和代码内容一致。
- 来源核查、原稿缺失项和技术纠正见 `editorial-review.md`。

## 已通过

- Jekyll 完整文本内容构建成功，耗时 229.066 秒。构建包含现有文章集合与模板；大体积资产由本地预览服务器直接读取仓库。没有更改站点生产 URL。
- 20 页均 HTTP 200，页头四语切换指向同一主题，图片实际加载且比例正确。
- 每页一个 H1；目录章节齐全，点击跳转及当前位置高亮正常。
- 所有页面均检查 1440×1000 与 390×844；无整页横向溢出；长代码/表格在自身容器滚动；手机目录可折叠。
- 20 页均能通过对应语言文章库标题搜索找到，分类使用已有 production/android/linux。
- canonical 均为各语言正式 HTTPS 地址；hreflang 包含四语与英文 x-default，互相对应。
- sitemap 每个新增语言 URL 只出现一次；校对记录没有加入正式文章 sitemap。
- 分享图链接及 1200×630 尺寸正确；文章正文内部链接目标均存在。
- 所有 bash 示例通过语法检查；没有执行示例中的板端/构建/刷写命令。
- 原始五张截图 SHA-256 未变；此前 NPU 四语稿与已有 article-card 修改逐字节保持。
- 新增文章没有 noindex；本地预览响应统一带 `X-Robots-Tag: noindex, nofollow`，不影响生产页面设置。
- 本地验收阶段没有修改 robots、站点验证文件、远程配置或外部服务，也没有执行 commit、push、部署或搜索引擎提交。后续发布需另行核对正式部署结果。

## 本地预览

- 芯片选型：http://127.0.0.1:4051/zh/articles/rockchip-soc-selection-rk3588-rk3576-rk3572/
- Android CA：http://127.0.0.1:4051/zh/articles/android-ca-trust-store-emudhra-audit/
- Android SDK：http://127.0.0.1:4051/zh/articles/rockchip-android-sdk-ssi-grf-selection/
- VendorStorage：http://127.0.0.1:4051/zh/articles/rockchip-vendor-storage-android-aidl-guide/
- RK3572 AMP：http://127.0.0.1:4051/zh/articles/rk3572-android-rtthread-amp-integration/

使用顶部 EN / 中文 / RU / DE 切换。完整静态检查见 `static-checks.json`；实际浏览器检查见 `browser-checks.json`。

## 尚未执行的设备验证

没有取得匹配 Android 16 AIDL V2 或 RK3572 AMP 的完整源码进行编译，没有在 ArmSoM 硬件执行证书维护、VendorStorage 写入、固件烧写、实时性或性能测试。第三方 SDK 版本表没有逐一取得分支并验证；相关边界已在四语正文说明。本文不声称已获 Google 收录或已上线。
