# 158 Linux USB 初始化日志校对记录

中文原稿 RK-KF-YF-099 V1.1.1，15页，Common/USB/Rockchip_Developer_Guide_Linux_USB_Initialization_Log_Analysis_CN.pdf。原PDF不修改，无英文PDF，无独立技术图。所有日志以可复制文本而非图片展示。

- 第4页子系统、第5页9平台控制器表、第6–10页Kernel3.10主机/设备日志、第11–15页Kernel4.4全部日志及枚举说明，最后一页09–10行说明完整保留。
- 17个灰底代码单元合并OHCI和DWC3两处跨页续块为15块；按编号日志行合并明显PDF软换行，保留全部时间戳、地址、idProduct、驱动名、行号和原有省略号。
- 升格原先提取为正文的3.2.3.x、5.2.2.x四级小节，复用网站目录，无新增语言切换。
- 两处DWC3正文对USB3/USB2 Root HUB的总线号表述与idProduct=0002/0003日志顺序可能矛盾，四语保留并明确警示按实际描述符确认，不擅自交换总线号。
- 第10页高清确认wc_otg_hcd_suspend、ndroid_work确为原稿，不“修复”原代码。一般正文Devcies拼写修为Devices，不改变接口标识。
- 原稿对芯片控制器的概括限定为历史SDK/列出平台，不声称覆盖当今所有芯片/ArmSoM板卡。未执行命令/硬件测试；所有日志为原文示例。
- 已检查全部页联系图、全文单位及第10页高清拼写；源表格全部Y/N保留。独立四语正文、代码逐字一致，后续构建与HTTP/SEO见批次报告。

无commit/push/发布。
