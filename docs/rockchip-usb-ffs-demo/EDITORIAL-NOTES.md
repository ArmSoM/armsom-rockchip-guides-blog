# 162 USB FFS Test Demo 校对记录

来源Common/USB/Rockchip_Developer_Guide_USB_FFS_Test_Demo_CN.pdf，RK-KF-YF-464 V1.2.2，13页，末页为空白；技术正文第4–12页。只有中文目录原稿，其中部分原文说明已为英文；四语均完整本地化。无独立技术图或技术表。

- 7章全部保留：源码、工具链、libaio下载与编译、设备/主机程序构建、两种Configfs配置、测试和USB3补丁。末尾simple/device_app/aio_simple.c补丁闭合和STR_INTERFACE保留。
- 第2页完整芯片列表和Linux4.4/4.19范围保留；移除封面声明/联系信息/读者和修订记录。
- 合并第7–8页配置脚本、第9–12页连续补丁；修复diff --git双路径、交叉工具链路径、FunctionFS挂载路径、ln -s参数与dwLength表达式的PDF软换行。
- 两个Makefile路径标签与文件正文分离，recipe空白恢复Tab；标识、数字、API、命令参数不变。正文内的两条启动命令及UDC绑定命令恢复独立可复制代码块。
- 原`../..toolchain`、补丁htole32/字段宽度、各SDK上下文均注明核对，不改为猜测值；仅文档整理，不声称能直接套用于全部BSP。
- 原内网SSH工具链地址保留为代码，说明需授权网络/账号，未连接/下载。原wulf按用户Gerrit用户名替换的说明保留。
- Configfs配置含删除f1及修改当前Gadget，四语明确执行前提；没有实际执行任何命令，也未硬件测试。
- 已查看全13页联系图、逐段正文和完整代码。页面构建/SEO/HTTP由统一批次验证，未commit/push/发布。
