# 131 RT-Thread CAN/CANFD：校对记录

## 来源

仅中文 `RTT/Rockchip_Developer_Guide_RT-Thread_CAN_CANFD_CN.pdf`，9页，RK-KF-YF-162 V0.1.0。完整技术正文为物理第4–9页，无独立技术配图或表格。EN/RU/DE均从中文完整翻译，无英文PDF，不伪称英文配图。原始PDF不修改，哈希见批次来源清单。

## 完整性

1.1 HAL包含初始化、发送和接收接口；1.2包含RT-Thread接口、两个宏配置diff、can_sample与完整can_open/can_tx补丁、四类CAN帧命令及500K波特率；1.3包含CANFD限制、2M配置和两种64byte命令；1.4包含跨第8–9页完整IOMUX补丁。四语均保留。17个原稿代码片段按两处跨页合并为15块；所有技术标题对应。

逐页查看渲染，重点核对第5–9页跨行diff路径、跨页函数、线程配置、长度和十六进制掩码。只修复`rk3506-32`、diff头两路径、`eCANFD_Bps dbps`和设备flag的PDF软换行；未更改代码行为或补丁行数。

移除封面日期/密级、声明、读者对象、修订记录和目录页，保留版本/来源/支持平台。代码注释及必要署名不批量删除。

## 原文问题和适配

- can_tx连续写入can_name，第二次覆盖argv[1]；没有argc和len边界检查；id=0保留随机ID。保留原代码，四语正文明确警告。
- 需核对消息buffer实际容量、CAN/CANFD帧限制及线程/设备生命周期，不能将示例直接用于生产或安全关键总线。
- `initStrust`、`bsp`原稿参数拼写、diff hunk计数原样保留，不保证直接应用。
- 原稿范围为RK3568 CAN和RK2118/RK3576/RK3506 CANFD，RT-Thread & HAL未给统一版本；示例为RK3506-32路径。不泛化为全部ArmSoM板支持，不混同Linux SocketCAN。
- ArmSoM适配需核对SoC、RT-Thread BSP/HAL、收发器、终端电阻、电压域和引脚；未进行硬件验证、总线发送或运行示例。

网站构建/HTTP/SEO以批次最终记录为准。浏览器交互验收仍按用户要求稍后进行。
