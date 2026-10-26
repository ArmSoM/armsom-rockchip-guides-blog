# 163–172 本地交付与验收

2026-10-24。Common合并目录剩余10主题、15份PDF、517页，新增四语全文40篇。原PDF未修改；本批没有commit、push或发布，保留此前无关修改。

| 编号 | 主题 | 本地预览 |
| --- | --- | --- |
| 163 | USB Gadget UAC | [中文](http://127.0.0.1:4021/zh/articles/163-rockchip-usb-gadget-uac/) · [EN](http://127.0.0.1:4021/articles/163-rockchip-usb-gadget-uac/) · [RU](http://127.0.0.1:4021/ru/articles/163-rockchip-usb-gadget-uac/) · [DE](http://127.0.0.1:4021/de/articles/163-rockchip-usb-gadget-uac/) |
| 164 | USB信号质量测试 | [中文](http://127.0.0.1:4021/zh/articles/164-rockchip-usb-sq-test/) · [EN](http://127.0.0.1:4021/articles/164-rockchip-usb-sq-test/) · [RU](http://127.0.0.1:4021/ru/articles/164-rockchip-usb-sq-test/) · [DE](http://127.0.0.1:4021/de/articles/164-rockchip-usb-sq-test/) |
| 165 | USB SQ Tool | [中文](http://127.0.0.1:4021/zh/articles/165-rockchip-usb-sq-tool/) · [EN](http://127.0.0.1:4021/articles/165-rockchip-usb-sq-tool/) · [RU](http://127.0.0.1:4021/ru/articles/165-rockchip-usb-sq-tool/) · [DE](http://127.0.0.1:4021/de/articles/165-rockchip-usb-sq-tool/) |
| 166 | RK3399 USB | [中文](http://127.0.0.1:4021/zh/articles/166-rockchip-rk3399-usb/) · [EN](http://127.0.0.1:4021/articles/166-rockchip-rk3399-usb/) · [RU](http://127.0.0.1:4021/ru/articles/166-rockchip-rk3399-usb/) · [DE](http://127.0.0.1:4021/de/articles/166-rockchip-rk3399-usb/) |
| 167 | RK356x USB | [中文](http://127.0.0.1:4021/zh/articles/167-rockchip-rk356x-usb/) · [EN](http://127.0.0.1:4021/articles/167-rockchip-rk356x-usb/) · [RU](http://127.0.0.1:4021/ru/articles/167-rockchip-rk356x-usb/) · [DE](http://127.0.0.1:4021/de/articles/167-rockchip-rk356x-usb/) |
| 168 | RK3576 USB | [中文](http://127.0.0.1:4021/zh/articles/168-rockchip-rk3576-usb/) · [EN](http://127.0.0.1:4021/articles/168-rockchip-rk3576-usb/) · [RU](http://127.0.0.1:4021/ru/articles/168-rockchip-rk3576-usb/) · [DE](http://127.0.0.1:4021/de/articles/168-rockchip-rk3576-usb/) |
| 169 | RK3588 USB | [中文](http://127.0.0.1:4021/zh/articles/169-rockchip-rk3588-usb/) · [EN](http://127.0.0.1:4021/articles/169-rockchip-rk3588-usb/) · [RU](http://127.0.0.1:4021/ru/articles/169-rockchip-rk3588-usb/) · [DE](http://127.0.0.1:4021/de/articles/169-rockchip-rk3588-usb/) |
| 170 | Linux4.19 Gadget UVC排查 | [中文](http://127.0.0.1:4021/zh/articles/170-rockchip-linux419-usb-gadget-uvc/) · [EN](http://127.0.0.1:4021/articles/170-rockchip-linux419-usb-gadget-uvc/) · [RU](http://127.0.0.1:4021/ru/articles/170-rockchip-linux419-usb-gadget-uvc/) · [DE](http://127.0.0.1:4021/de/articles/170-rockchip-linux419-usb-gadget-uvc/) |
| 171 | Linux Host UVC排查 | [中文](http://127.0.0.1:4021/zh/articles/171-rockchip-linux-usb-host-uvc/) · [EN](http://127.0.0.1:4021/articles/171-rockchip-linux-usb-host-uvc/) · [RU](http://127.0.0.1:4021/ru/articles/171-rockchip-linux-usb-host-uvc/) · [DE](http://127.0.0.1:4021/de/articles/171-rockchip-linux-usb-host-uvc/) |
| 172 | Linux WDT | [中文](http://127.0.0.1:4021/zh/articles/172-rockchip-linux-wdt/) · [EN](http://127.0.0.1:4021/articles/172-rockchip-linux-wdt/) · [RU](http://127.0.0.1:4021/ru/articles/172-rockchip-linux-wdt/) · [DE](http://127.0.0.1:4021/de/articles/172-rockchip-linux-wdt/) |

## 内容与来源

- 逐篇技术正文、代码、参数、表格、图和必要注释保留，指定封面/读者/修订等非技术内容移除；源PDF哈希检查通过。
- RK3399/RK356x/RK3576/RK3588有中英文原图，中文用CN，英俄德用EN。UAC、SQ测试、SQ Tool及两篇UVC仅中文原稿，四语使用中文原图并注明；WDT无独立技术图。
- RK3576中文V1.1.0、英文V1.2.0，补入英文新版USB2-only配置及不同DTS；WDT中文V1.3.0、英文V1.2.1，以中文新版暂停表为主并保留英文独有GRF说明。
- 修复跨页代码/表格、页顶提取遗漏、命令软换行和一处目录内链接。RK3399/RK356x的全角分号参照英文转为ASCII，裸说明改注释；两稿代码注释不同，未伪称逐字一致，技术token和143个源代码片段覆盖分别验证。
- SQ Tool俄文“占空比”改为准确术语；Gadget UVC保留中文代码注释并额外补充本地化操作说明。
- 原稿疑点如RK3562结束括号、WDT双0x地址/恢复掩码、PHY型号和控制器名、UVC H256/带宽占用风险均保留可追溯信息，详见逐篇EDITORIAL-NOTES.md。硬件常量没有猜改。
- 适用性均为平台参考；未执行硬件命令、寄存器写入、烧写、调压或USB重配置，原文实验不称ArmSoM实测。

## 已通过

- Jekyll最终构建成功；40篇新增页面及223个独立正文图片URL本地HTTP检查通过。
- 四语每种171个搜索条目，共684篇；文章库各19页，共76页分页全部核对，补齐第19页，复用原机制。
- 新页面canonical自指正式HTTPS地址，四语hreflang及x-default互相对应；sitemap无重复、本地URL、Markdown或校对记录混入，没有虚假lastmod。
- 正文代码与Markdown渲染逐块一致，标题/表格/图片数量一致；图片、内部链接和锚点检查通过；robots及本地响应头无意外禁爬，Google验证文件不变。
- 全站德文无缺篇。历史157/160来源结构例外先核对文件哈希未变再沿用既有证据；166/167实际注释差异另附逐片核对，不隐藏原始严格比较结果。

## 验收边界

沿用用户此前“先完成文件检查，浏览器验收稍后”：实际点击、当前位置高亮、手机折叠/横向滚动和视觉排版仍待交互验收。静态/HTTP检查不能替代浏览器交互。具体ArmSoM硬件、BSP、生产服务器响应头未验证。逐章、源页和结构复核不等于全部517页第二轮逐字人工审校。未操作Search Console/DNS，不承诺收录或排名。

后续按用户新增要求进入Linux目录20篇，清点为173–192、37PDF、782页；不将下一批清点视为翻译完成。
