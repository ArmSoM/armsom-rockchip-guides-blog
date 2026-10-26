# USB Performance 校对记录

- 源：中文 `Rockchip_Developer_Guide_USB_Performance_Analysis`，RK-KF-YF-100 V1.1.1，28 页。实际文件名、SHA256 见本批 inventory；无对应英文 PDF。
- 中文、英文、俄文、德文完整覆盖正文第 1–3 章及最后 HID 两个补丁。保留原稿技术适用范围（30/31/32/33/PX、Sofia、RV1108，Linux 3.10/4.4）。不是所有 ArmSoM 板卡适配承诺，未做硬件验证。
- 删除封面声明、联系信息、读者对象和修订记录；不改原 PDF。代码许可证/作者信息保留。
- 4 张图均来自中文 PDF p4、p14、p16、p22；四语均使用这些原图，不伪称已有英文原图。9 个技术表恢复可编辑文本。
- 已读取全部技术正文及代码，检查联系表；合并 p27–28 HID 补丁，修复 sysfs 路径、UUID 路径及日志软折行；保留命令、寄存器和常量。正文中的 cp、dd、uvc stats 命令另恢复为可复制代码块。
- 保留并提示原稿疑点：`rm of=…`、`ehco`、blkparse 的长横线参数及路径内空格；不猜测修正。历史 USB 命名、`400MBps?`、Webcam `648×480`、`UYV`、KB/MB 无每秒单位、HID `protocol=2 /* Keyboard */` 也保留待具体实现核对。
- 原稿 NTFS/FUSE、SDK 和性能数据均为历史示例，不作现代系统普遍结论，不写成 ArmSoM 实测。IP 配置应按实际子网核对；停用防火墙、CPU 核、写盘/清缓存/Gadget 操作均仅文档展示，本次未执行。
- 本记录不是浏览器交互验收或硬件测试通过证明；统一构建、SEO 与 HTTP 检查结果另见本批交付记录。
