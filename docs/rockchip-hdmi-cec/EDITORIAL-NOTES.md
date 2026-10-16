# HDMI-CEC 校对记录

## 来源与完整性

中文 `Rockchip_Developer_Guide_HDMI-CEC_CN.pdf`，V1.1.0，39 页，无英文原稿。英文、俄文完整翻译中文正文；三语使用 18 张中文原图，未冒称英文图。保留四章、32 个编号标题、9 个可编辑表格、56 个代码/日志块，以及所有流程/时序图。逻辑地址表原本为第 5 页图片，已逐格恢复为表格并保留原图；第 35 页状态截图已另转录为可复制日志。末章三个参考资料条目完整保留，Android HDMI-CEC 链接取自 PDF 实际超链接。

逐页查看第 4–39 页图像核对目录、代码框和跨页续行：HAL 定义 9–11 页、adapter 结构体 15–16 页、初始化 21–22 页、发送 23–26 页、接收 27–28 页、onMessage 31–33 页及调试脚本 33–34 页均接续。没有以整页 PDF 图替代正文。

## 修复内容

- 修复长 Java 路径印刷换行，如 HdmiCecMessageBuilder.java、HdmiControlService.java、HdmiCecLocalDevicePlayback.java、OneTouchPlayAction.java。
- 修复路径 dw- hdmi-cec.c 与 statu s 的断行；不改路径大小写等原文可疑信息。
- 接回第 20–21 页被跨页截断的“发送 POLL MSG”叙述。
- 完整翻译表格说明；HAL/C/Java 代码、命令、参数、日志和注释保持原文含义。
- 移除封面发布日期、密级、法律声明、联系方式、读者对象、修订记录及印刷目录；代码许可证和技术提交必要署名不删除。

## 原文疑点（不静默修正）

1. 第 20 页称 CEC_ADAP_S_PHYS_ADDR 完成逻辑地址分配；后续详细流程为 CEC_ADAP_S_LOG_ADDRS。译文明确标注区别，待匹配目标内核源码核实。
2. 第 29 页 CEC_EVENT_PIN_HPD_LOW 被解释为高电平/插入，CEC_EVENT_PIN_HPD_HIGH 被解释为低电平/拔出，与枚举名相反。表格保留源解释并在译文提示矛盾。
3. §2.3.4 引用 §2.2.1.2，实际初始化对应 §2.3.1.2；§3.2.1 状态说明引用 §3.1.1，实际为 §3.1.2。保留追溯信息。
4. 调试脚本检查 `/data/cec_status.txt`，删除的却是 `/data/cec_status.log`；随后用 `>>` 追加 txt，可能积累旧状态。脚本原样保留，未运行，也未擅自改成删除用户文件的脚本。
5. 操作说明为 `./system/bin/cec_debug.sh`，是依赖当前目录的相对路径，不一定等同 `/system/bin/cec_debug.sh`。保留源写法并提示核对。
6. 部分代码路径以 Frameworks、Hardware、Kernel 大写开头，而其他部分为小写；Linux 路径区分大小写，须查目标树，不能盲目执行。
7. standby/唤醒支持状态属于该 2020 年源版本，不作为当前所有 BSP 的结论。原文既给出收到 standby 后手动调用 suspend 的方法，也明确指出完整 TV 触发待机/唤醒未支持；二者范围不同。
8. 设备权限修改、寄存器查看、echo mem suspend、日志脚本属于原文调试示例。未对任何设备执行，没有声称与所有电视兼容。

## 适用与验收边界

原文产品表为 RK322X/RK3328/RK3368/RK3399/RK3288，Linux 4.4/4.19，Android 5.x 及以上。ArmSoM 适配需核对 SoC、CEC 布线、HAL、内核、Android 服务和待机固件；没有硬件验证。已保存三语文件、全部原图及校对记录，完成静态目录、表格、围栏、图片路径核对。站点构建、真实页面、搜索、sitemap、canonical/hreflang 和窄屏交互由本批主任务统一验收。未 commit、push、发布或提交搜索引擎。
