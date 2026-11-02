# RK3506 四语文章校对记录

日期：2026-11-02。四个主题，中文/英文/俄文/德文共16篇。仅本地预览，未授权本批发布。

## 范围

- RK3506J 芯片应用详解、CM1 定制终端、Forge1 HMI/网关/采集、RK3506B V1.0 手册导读。
- 手册为50页英文原稿，原文件完整保存且不修改；文章明确为导读，不声称完整逐行翻译。引脚与电气全表留在可下载PDF。
- 本批未进行硬件测试、吞吐量测试或实时性测试。场景为工程建议，不是客户案例。

## 型号与疑点

- CM1/Forge1 官方文档使用 RK3506J；附件是 RK3506B，不将B的电压/温度/引脚兼容性移植为J参数。
- B原稿第45–46页推荐环境温度为−20/25/80°C；第45页存储−40～125°C；第50页要求结温低于125°C。
- CPU推荐电压最大值TBD、热阻均TBD，未猜测。CODEC ADC第49页Resolution=24的单位原稿为°C，正文标注与24-bit功能说明冲突。
- 主频：搜索发现不同第三方板卡频率写法不一致，未将任何一家板卡主频作为ArmSoM出厂承诺。
- Forge1官方规格为NAND，用户手册部分仍出现eMMC启动措辞；正文记录此冲突，按规格表写NAND，待实际交付版本确认。
- SAI组件数量包含内部连接，不等于全部外部独立接口。
- 2D图形引擎不称为通用3D GPU；不编造NPU、认证、功耗、实时延迟或整机宽温结果。

## 图片

- rk3506b-block.png：用户PDF第14页Fig1-1。
- rk3506b-marking-top.png：第15页Fig2-1、2-2。
- rk3506b-bottom-side.png：第16页Fig2-3、2-4。
- rk3506j.png：https://docs.armsom.org/img/forge/rk3506j.png
- cm1.jpg：https://docs.armsom.org/assets/images/armsom-cm1-front%26back1-c379877bc0df723b9059e187d35a9d6b.jpg
- forge1.jpg：https://docs.armsom.org/assets/images/armsom-forge1-layout-9ef454eeb793c04e26ffa8ecaf350d93.jpg
- 四语使用同一技术原图，本地化alt。没有更改图内型号或去除水印。

## 核心信息来源

- https://www.rock-chips.com/a/cn/product/RK35xilie/2025/1208/2125.html
- https://docs.armsom.org/armsom-cm1
- https://docs.armsom.org/armsom-forge1
- 用户提供PDF，SHA256见source-manifest.json。

## 网站接入

复用translation_key、四语切换、自动目录、search-index、sitemap、产品关联。未修改robots或验证文件。构建验证结果见preview-qa.json。

- 图片复核另发现Forge1官方图92×60mm与规格表92×62mm冲突，四语正文已说明，机械设计按实际版本图纸确认。

## 本地验收结论

2026-11-02最终Jekyll构建成功。16/16页面的canonical、五条hreflang、sitemap唯一收录、搜索数据、内部资源链接、图片文件检查通过；PDF SHA256与原始文件一致。全部16个HTTP本地地址返回200。
浏览器验收：390px视口无页面横向溢出，表格overflow:auto（331px容器/474px内容）；目录可展开、跳转且aria-current=location。手册三张配图加载成功。完成后已恢复浏览器视口。
本地预览端口4033；未commit、push或发布。
