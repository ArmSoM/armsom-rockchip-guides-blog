# Linux Memory Allocator V1.0.0 校对记录

- 来源：`D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Common\MEMORY\Rockchip_Developer_Guide_Linux_Memory_Allocator_CN.pdf`；10页；RK-KF-YF-469；SHA-256 `ffb250419178b2c2f3cead0b5a64d15c4d7f9e857dd43b4098d2b77db7c975f7`。无英文稿。源 PDF 未修改。
- 四语完整保留 p2 技术概述与产品表、p3–10 第1–4章；去掉封面日期/密级、免责声明、商标版权段、联系信息、读者对象、修订表和重复静态目录。代码内注释不删除。
- 无技术配图，不虚构图像。表格恢复可编辑；p3目录树与p4–10两段完整日志可复制。目录树中文注释保持各语相同：cma_heap.c=物理连续分配器；deferred-free-helper.c=延迟释放；page_pool.c=页缓存；system_heap.c=物理不连续、虚拟连续分配器。
- p3–4 cma-heap 正文跨页续接；p4–8 第一段日志、p8–10 grep日志连续合并；KiB尾行断行恢复；日志地址、十六进制大小、十进制KiB全部不改。两段分配条目的地址/大小序列一致，保留所有重复Attached Devices记录。
- p3非代码 cahce 拼写修为 cache；`system-uncached-heap`跨行名称续接。示例设备节点保留原稿`/dev/dma_heap/system-heap`、`/dev/dma_heap/system-uncached-heap`，实际BSP节点名需另核对，不替换为推测值。
- p4表“支持debug list”原稿API与返回值为空，保留空白，不补造接口。原文`add_dma_heap()`保持字面，不擅改函数名。
- RK-DMA-HEAP仅适用原稿RV1106，不泛化到RK3588；普通DMA-HEAP产品表为RK3588/RV1106 Linux5.10。没有验证任何具体ArmSoM板卡或执行文中命令；日志不是ArmSoM实测。
