# 066–075 完整技术文章批次交付

日期：2026-10-18。

## 交付范围和顺序

严格接续上批 065，按中文和英文 Common 相对目录合并、忽略大小写排序；仅去除末尾语言标记，不排除单语资料。10 个主题来自 14 份 PDF，共 405 页；形成 30 篇可编辑中英俄 Markdown、130 个独立技术图片文件、10 份逐篇校对记录。本批未新增德文译文。

| 顺序与主题 | 中文预览 | English | Русский | 校对记录 |
| --- | --- | --- | --- | --- |
| 066 RGMII Delayline | [中文](http://127.0.0.1:4006/zh/articles/066-rockchip-rgmii-delayline/) | [EN](http://127.0.0.1:4006/articles/066-rockchip-rgmii-delayline/) | [RU](http://127.0.0.1:4006/ru/articles/066-rockchip-rgmii-delayline/) | [来源和疑点](../rockchip-rgmii-delayline/EDITORIAL-NOTES.md) |
| 067 MAC-to-MAC | [中文](http://127.0.0.1:4006/zh/articles/067-rockchip-mac-to-mac/) | [EN](http://127.0.0.1:4006/articles/067-rockchip-mac-to-mac/) | [RU](http://127.0.0.1:4006/ru/articles/067-rockchip-mac-to-mac/) | [来源和疑点](../rockchip-mac-to-mac/EDITORIAL-NOTES.md) |
| 068 GPIO | [中文](http://127.0.0.1:4006/zh/articles/068-rockchip-gpio/) | [EN](http://127.0.0.1:4006/articles/068-rockchip-gpio/) | [RU](http://127.0.0.1:4006/ru/articles/068-rockchip-gpio/) | [来源和疑点](../rockchip-gpio/EDITORIAL-NOTES.md) |
| 069 CameraHal3 HDMI IN | [中文](http://127.0.0.1:4006/zh/articles/069-rockchip-hdmi-in-camerahal3/) | [EN](http://127.0.0.1:4006/articles/069-rockchip-hdmi-in-camerahal3/) | [RU](http://127.0.0.1:4006/ru/articles/069-rockchip-hdmi-in-camerahal3/) | [来源和疑点](../rockchip-hdmi-in-camerahal3/EDITORIAL-NOTES.md) |
| 070 HDMI RX | [中文](http://127.0.0.1:4006/zh/articles/070-rockchip-hdmi-rx/) | [EN](http://127.0.0.1:4006/articles/070-rockchip-hdmi-rx/) | [RU](http://127.0.0.1:4006/ru/articles/070-rockchip-hdmi-rx/) | [来源和疑点](../rockchip-hdmi-rx/EDITORIAL-NOTES.md) |
| 071 I2C | [中文](http://127.0.0.1:4006/zh/articles/071-rockchip-i2c/) | [EN](http://127.0.0.1:4006/articles/071-rockchip-i2c/) | [RU](http://127.0.0.1:4006/ru/articles/071-rockchip-i2c/) | [来源和疑点](../rockchip-i2c/EDITORIAL-NOTES.md) |
| 072 IO-Domain | [中文](http://127.0.0.1:4006/zh/articles/072-rockchip-io-domain/) | [EN](http://127.0.0.1:4006/articles/072-rockchip-io-domain/) | [RU](http://127.0.0.1:4006/ru/articles/072-rockchip-io-domain/) | [来源和疑点](../rockchip-io-domain/EDITORIAL-NOTES.md) |
| 073 IOMMU V1/V2 | [中文](http://127.0.0.1:4006/zh/articles/073-rockchip-iommu/) | [EN](http://127.0.0.1:4006/articles/073-rockchip-iommu/) | [RU](http://127.0.0.1:4006/ru/articles/073-rockchip-iommu/) | [来源和疑点](../rockchip-iommu/EDITORIAL-NOTES.md) |
| 074 VI 驱动 | [中文](http://127.0.0.1:4006/zh/articles/074-rockchip-vi-driver/) | [EN](http://127.0.0.1:4006/articles/074-rockchip-vi-driver/) | [RU](http://127.0.0.1:4006/ru/articles/074-rockchip-vi-driver/) | [来源和疑点](../rockchip-vi-driver/EDITORIAL-NOTES.md) |
| 075 Camera OTP 校准 | [中文](http://127.0.0.1:4006/zh/articles/075-rockchip-camera-otp-calibration/) | [EN](http://127.0.0.1:4006/articles/075-rockchip-camera-otp-calibration/) | [RU](http://127.0.0.1:4006/ru/articles/075-rockchip-camera-otp-calibration/) | [来源和疑点](../rockchip-camera-otp-calibration/EDITORIAL-NOTES.md) |

## 资料与图片来源

- 066、067、071：中英文配对版本分别为 V1.2.0、V1.0.0、V2.2.0。中文用中文原图；英文、俄文用英文原图。
- 068 GPIO（V1.0.1）、069 CameraHal3（V1.1.0）、070 HDMI RX（V1.1.7）、072 IO-Domain（V1.0.1）：只有中文原稿；英文、俄文完整翻译中文，沿用中文原图并披露，无伪造英文图片。
- 073：用户批准中文 V1.2.0 为共同基准；对照英文 V1.0.1，完整补入 V2 DTE/PTE、RK3588 页表、SYSTEM HEAP 和 FAQ 新章节。四张共有图 EN/RU 用英文图，两张 V2 新图没有英文对应，使用中文图并注明。
- 074 VI（V1.0.7，133页）、075 OTP（V1.0.34，47页）：只有英文原稿；中文、俄文完整翻译英文，均使用英文原图。
- 图片引用共 333 次，保留原始比例和标签。新增独立裁图包括 IO-Domain 矢量流程图和 OTP 五处矢量公式；不是以整页 PDF 图片替代正文。

## 完整性、提取修复与已知疑点

- 保留所有技术章节、末章和附录；074 的附录 A–E、075 末页 QSC 与 OTP 地址数据表均纳入。全部正文可复制、编辑；命令/代码块共 1452 个三语实例，可编辑表格共 594 个三语实例。
- 修复跨页补丁/日志/表格、代码路径软换行、错误断词、列表编号、CJK 提取字形和 Markdown 意外解析。补录 HDMI 截图中的 XML/补丁/日志，GPIO 寄存器图表、IO-Domain 寄存器图表和 OTP 公式。
- 074 非代码缩进曾被误解析为代码块，已恢复为可读路径列表和普通说明；191 个真正代码围栏内容逐字未变。070 中文 logcat 管道曾被误解析为表格，已改内联代码，命令未变。
- 066 原图 TholdR 说明重复 Setup、全角代码结束符和 PHY 选型交叉引用，067 PING 单次值与 summary 矛盾及源补丁缺分号，071 原稿拼写与声明/数组用法、Tf 公式缺括号，072 bt565/bt656 和 gpio1830/gpio1833 差异，均保留并记录。
- 073 V1 与 V2 原图的读写权限位相反：V1 bit1=读/bit2=写，V2 bit2=读/bit1=写；三语图后明确提示，不能未经对应驱动/TRM 核对就混用。旧英文 && 与中文 & 的公式差异也已追溯，按批准中文基准处理。
- 068 GPIO 标题/正文涉及不同 GPIO 组、070 HDCP 参数和源拼写、074 分辨率/芯片命名、075 pdaf_offset/pd_offset 等原文疑点见逐篇记录，不猜测修改。
- 指定封面日期/密级、免责声明/商标/版权声明段、联系信息、读者对象和修订表已移除，保留技术版本、适用范围及代码内部必要注释/署名。原始 PDF 不修改；14 份 SHA-256 与输入清单一致。

## 适用范围和未验证内容

各文章开头明确 SoC、原稿内核或系统范围，并要求核对具体 ArmSoM 板卡、SDK/BSP、内核、驱动、供电与引脚连接；无法确认具体板卡的内容明确为平台参考。不声明所有 ArmSoM 板卡支持，也未执行任何硬件测试、OTP 烧写或系统补丁。原文测试数据、波形及日志不是 ArmSoM 实测。OTP/EEPROM 写操作有不可逆或覆盖数据风险。

## 网站与验证（对应原要求 11–20）

- 复用现有 collection、translation_key、顶部语言切换、分类、站内搜索、侧边目录及 sitemap，不重复实现。30 个三语新页、目录和分类搜索条目正常；浏览器 OTP 搜索返回实际新增文章。
- Jekyll 完整构建通过。30 页源 Markdown 的代码围栏与构建后的 pre 文本逐块一致；图片路径、alt、内部链接、唯一标题 ID 和锚点通过检查。
- 三语页面 canonical 指向各自正式 HTTPS 地址；EN/ZH/RU hreflang 含自身且相互对应，x-default 为英文；不伪造不存在的德文关联。
- sitemap 包含全部 30 个新增语言页面，无重复、localhost、本地路径、Markdown、校对记录或搜索文件；无不可靠 lastmod。既有 robots 保持 Allow: /，不修改爬虫权限，保护 Google 验证文件及站点配置。
- 本机 HTTP HEAD 检查 177 个文章/图片/校对记录/搜索/验证资源，均 200，未见 X-Robots-Tag noindex。此为本地响应头检查，不冒称已核验生产 CDN 全部响应头。
- 浏览器 390×844 逐页检查全部 30 页：无整页横向溢出、无已加载破图，目录折叠且标题全入目录，表格和代码可横向滚动。桌面实点 VI 长文目录跳转与当前位置高亮、EN/RU 切换均正确。
- 没有向 Search Console 提交网址/站点地图、请求收录、修改 DNS 或账号权限，不承诺 Google 收录、排名或 AI 引用。

## 提交与发布授权

用户在本批开始后明确追加“整理完后自动发布提交”和“继续整理，发布呀”。因此检查通过后按 066–075 顺序创建 10 个独立 commit，再以普通快进推送到既有 origin/main，保留提交顺序。交付记录随 075 提交。只触发现有自动发布机制，不手动更改部署设置。实际 commit SHA、推送验证与生产部署结果以本聊天最终交付消息及发布记录为准，不在构建前伪称上线。

本地服务：http://127.0.0.1:4006/zh/library/ 。构建目录和自动检查证据保存在仓库之外的本聊天 work/batch-066-075-site、work/batch-066-075-site-check.json、work/batch-066-075-http-check.json。所有临时提取和翻译中间文件不纳入发布。
