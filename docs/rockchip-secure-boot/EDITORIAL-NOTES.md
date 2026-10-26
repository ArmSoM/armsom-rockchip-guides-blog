# Secure Boot 校对记录

- 来源：英文 Rockchip_Developer_Guide_Secure_Boot_Application_Note，RK-SM-YF-024 V2.2.0，43 页。无中文对应稿。
- 保留技术前言（第 2–3 页）和第 8–43 页全部技术章节；去除封面信息、声明、读者对象、修订记录，目录由网站生成。
- 四语使用同一英文技术基准；全部 34 个原稿位图和第 43 页矢量流程图独立保存。原稿工具界面部分本身为中文，不称为英文界面。
- 三个结构体完整保留；合并第 11–12 页 second_loader_hdr 跨页代码。恢复 boot.img 合并单元格布局，补回 loader 布局首个数据行。U-Boot 布局图片另恢复为可编辑表格。
- package-file、打包命令/日志和 config.ini 参数从原截图转录，同时保留截图。config.ini 截图右侧部分注释原本被裁切，不猜测补齐；所有可见配置键和值均保留。
- 保留原文疑点：rsaHash[128] 与 RSA2048；RK3336 与 RK3326；旧章节交叉引用；RSA Encryption/Decryption 的历史措辞；“64 sector reverse”；正文对 boot.img/recovery.img 与 kernel 包含关系的表述；硬件电压表含 RK3168/RK3188 但前言支持范围未列；前言 SecureBootTool 1.79 与后文 V1.9 两组要求均保留。
- eFuse/OTP 不可逆操作、密钥与电压风险在四语开头提示。仅平台参考，不声称已适配所有 ArmSoM；未执行烧录、签名、复位或熔丝命令。
- 所有代码标识、硬件值及配置参数不翻译；代码内原有中文注释保留。图片 alt/图注及说明正文按语言本地化。
- 本记录不代表已经构建或上线；批次交付报告统一记录构建、SEO 与浏览器验收状态。未提交或推送。
