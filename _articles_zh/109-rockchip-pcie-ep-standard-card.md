---

title: "Rockchip PCIe EP 标准卡完整开发指南：Chips Connect、DMA、内存与验收"

description: "Rockchip PCIe EP 标准卡完整开发指南：Chips Connect、DMA、内存与验收 — V3.2.0, RK3588/RK3568/RK1820."

excerpt: "Rockchip PCIe EP 标准卡完整开发指南：Chips Connect、DMA、内存与验收 — V3.2.0, RK3588/RK3568/RK1820."

translation_key: 109-rockchip-pcie-ep-standard-card

slug: 109-rockchip-pcie-ep-standard-card

lang: zh

date: "2026-10-23"

author: "ArmSoM Editorial · Rockchip source documentation"

category: interfaces

products: []

tags: [ArmSoM, Rockchip, PCIe, DMA, RK3588, RK3568, RK1820]

---

{% raw %}

> 配图来源差异：英文 PDF 自带的部分位图仍含中文标签；其第 19 页两幅图重复使用缓存流程图，中文第 18 页对应首图则是完整软件架构。按各自原稿保留，英文/俄文/德文使用英文 PDF 内图，不将其描述为完全英文化图。Hugepage 示例的 16 × 32768 kB 与 Hugetlb 1048576 kB 不一致，保留原日志并待核对。

# Rockchip PCIe EP 标准卡完整开发指南：Chips Connect、DMA、内存与验收

原文 V3.2.0，中文 44 页、英文 46 页。适用版本：RK3588 Linux 6.1/5.10、RT-Thread v5.1.x/v4.1.x；RK3568 Linux 6.1/5.10/4.19、RT-Thread v5.1.x/v4.1.x；RK1820 RT-Thread 5.1.x。RT-Thread 仅在 RK PCIe EP 侧实现。本文为平台参考，需按具体 ArmSoM 板卡核对 PCIe EP 能力、引脚、电源、时钟、BSP 和内核。原厂 EVB 性能和兼容性数据不是 ArmSoM 实测，未进行硬件验证。中文使用中文原图，其他语言使用英文原图。

> 原文疑点保留待核对：小内存 BAR 表 R+2056B 与前行 R+2560B 重叠；loopback 方法引用 speed_test README；Windows CTRL+L 被列为休眠操作；Windows 10 2004 与构建号 19042.1052、eq 配置含义需核对。原稿 Secure Boot/签名设置仅作历史开发步骤记录，不在此执行。

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. EP卡概述

RK PCIe EP标准卡开发包是RK”PCIe EP 卡形态产品“的软硬件综合开发包,开发基于RK EP卡Demo板(以下简称EP卡),开发包主要包含:EP卡的快速操作指南EP卡启动方案、PCIe相关软硬件设计开发以及升级OTA相关内容EP卡业务基础EP卡业务基础框架下的业务实例

## 2. EP卡规格

### 2.1 基本规格

| 主芯片 | 启动方案 | SMBus扩展 | 独立时钟方案 |
| --- | --- | --- | --- |
| RK3568 | 支持Flash Boot、Common Boot<br>不支持PCIe Boot | N | 支持SRNS<br>不支持SRIS |
| RK3588 | 支持Flash Boot、Common Boot<br>不支持PCIe Boot | N | N |
| RK1820 | 支持Flash Boot、Common Boot、EP Boot | Y | N |

说明:Flash Boot包括:Flash Boot - 集成PCIe Bin及EP Boot软件方案Flash Boot - 集成PCIe Bin软件方案对于不支持PCIe Boot的EP启动方案,PCIe协议约束EP卡应在PERST#释放后20ms内进入探测模式,之后RC进行持续探测、协商、枚举,该过程时可能⻓达100ms,所以EP卡对接通用RC,为增强兼容性应选择SPI Flash作为启动存储以实现快速启动,一般推荐使用SPI Nor作为启动存储。

### 2.2 软件开发

EP卡开发包本质为PCIe产品功能展示开发包,非一站式解决方案,需客戶基于次做PCIe及上层应用的二次开发。

### 2.3 操作系统

EP设备:EP卡兼容Linux、Android、RT-Thread操作系统RC设备:EP卡兼容Linux操作系统的RC设备,已在特定RC上完成验证EP卡兼容Windows操作系统的RC设备,已在特定RC上完成验证,但仅实现基础传输功能,其余功能需客戶自行参考Linux驱动进行开发

### 2.4 时钟要求

EP卡推荐使用同源参考时钟方案,即EP使用RC端提供的100M参考时钟。对于RC和EP均采用RK芯片、且支持独立时钟方案的EP卡,RC&EP采用内部100M时钟,可以省掉外置的时钟发生器和时钟buffer芯片。

### 2.5 PCI设备ID

RK PCIe EP卡默认ID为RK自定义设备ID,对于第三方开发用戶,要求:内部使用设备:如果设备仅在封闭环境中使用,可以使用RK PCIe已有的VID对外设备:如果设备是对外销售或公开使用的,需要自行向PCI-SIG申请VID

### 2.6 热插拔

RK PCIe EP卡不支持热插拔。

### 2.7 辅助信号

| 辅助信号 | 功能 | 标准EP方案 | RK芯片互联独立供电方案 |
| --- | --- | --- | --- |
| PRSNT# | N |  |  |
| PERST# | GPIO输入 | 必选,接入系统复位,整板复位 | 必选,GPIO输入,软件复位,配置<br>dtsreset-gpios; |
| CLKREQ# | FUNCTION<br>输入 | 可选,用以扩展ASPM L1SS功耗管<br>理,暂未实现但建议预留,如明确<br>无需求可不接 | 可选,用以扩展ASPM L1SS功耗管理,<br>暂未实现但建议预留,如明确无需求可<br>不接 |
| JTAG | N |  |  |
| SMBus | N |  |  |
| WAKE# | GPIO输出 | 必选,扩展休眠唤醒功能,暂未实<br>现但建议预留 | 必选,扩展休眠唤醒功能,配置<br>dtswake-gpios; |
| +3.3Vaux | N |  |  |

说明:RK芯片互联独立供电方案由于涉及单端掉电的情景,建议做IO保护,防止一端下电、另一端IO持续输出导致电压/电流灌的⻛险功能为GPIO的引脚,请勿在pinctrl里面配置为pcie function,支持任意引脚,无限制功能为FUNCTION的辅助信号,需选择对应功能脚标准EP方案PERST#接入系统复位进行整板复位的需求:PERST#信号作为RC端物理复位EP的最后手段存在特殊RC兼容性问题,例如:RC枚举完成后立刻进入L2并通过PERST# 复位,需快速复位NOTE: 由于RC的PERST是PP强驱,EP上PMIC是OD脚,所以不管RC的PERST是3.3V还是1.8V,都需要通过电路转换来驱动EP端的RESET_L

### 2.8 性能规格

用戶应明确PCIe传输带宽需求、数据流向(RC/EP单向?双向?)、是否有零碎控制流/大块数据流,建议:阅读“实测性能”章节,了解chips_connect开发包传输上限性能:阅读“性能 \| 用戶态测试Demo - pcie_speed_test”章节,了解不同数据块大小传输带宽

## 3. EP卡操作指南

### 3.1 环境准备

EP卡支持对接通用RC以及RK RC,这里对两种场景下基础功能验证做简单说明。

#### 3.1.1 硬件环境

RK3588 EP卡(标准卡)对接RK3588 RC参考硬件环境RC:RK3588-EVB1-V10连接电源线、串口线、USB转type-c固件下载线、HDMI输出线 (连接HDMI_OUT0)EP:RK3588-EVB4-V11RC直接供电,不需要单独电源线,不支持热拔插,需要先接上再对RC上电。RK3588 EP卡(标准卡)对接通用RCRC:PCEP:RK3588-EVB4-V11RC直接供电,不需要单独电源线,不支持热拔插,需要先接上再对RC上电。RK3588芯片互联独立供电方案参考硬件环境RC:RK3588-EVB1-V10连接电源线、串口线、USB转type-c固件下载线、HDMI输出线 (连接HDMI_OUT0)EP:RK3588-EVB4-V12EP卡独立供电,R8114和R2005不贴要求接入PERST#、WAKE#信号,且作为GPIO使用连接电源线、串口线、USB转type-c固件下载线

#### 3.1.2 软件环境

芯片需要的loader、uboot、 boot、以及文件系统可在发布包的 images 目录下获得这些镜像文件。Flash Boot - 集成PCIe Bin软件方案以RK3588 EP卡为例,启动文件如下表所示:

| 项目 | 文件名称 | 描述 |
| --- | --- | --- |
| RC(对接通用RC不需要) | rk3588-update-rc-evb7-v11.img | 烧写到RC Flash |
| EP | rk3588-update-ep-evb4-v11.img | 烧写到EP Flash |

说明:

update.img包含了MiniLoaderAll.bin、uboot.img、boot.img、rootfs.img等文件Flash Boot - 集成PCIe Bin及EP Boot软件方案以RK3588 EP卡为例,启动文件如下表所示:

| 项目 | 文件名称 | 描述 |
| --- | --- | --- |
| RC(对接通用RC不需要) | rk3588-update-rc-evb7-v11.img | 烧写到RC Flash |
| EP | RK3588_MiniLoaderAll.bin | 烧写到EP Flash |
| EP | pcie_idb.img | 烧写到EP Flash |
| EP | normal_idb.img | 烧写到EP Flash |
| EP | uboot.img | 由RC通过PCIE导入EP DDR 内存 |
| EP | boot.img (包含内核+rootfs) | 由RC通过PCIE导入EP DDR 内存 |

说明:RC通过PCIE对EP下载固件请参考下一章节功能验证说明

### 3.2 功能验证

验证PCIE EP功能的样例代码位于 SDK 发布包的examples目录下,包括EP和RC分别使用的Sample代码、封装的消息通讯代码和封装的数据通讯代码。

#### 3.2.1 Linux RC

通用RC功能验证需要的bin和资源存放在images目录下需要手动拷⻉到RC平台(仅X86平台),RK RC的资源直接打包到固件root目录中不需要额外操作。在硬件、软件环境准备好后,执行完整的 PCIE 功能验证的步骤如下。不需要对EP卡下载固件可以直接跳过第一点。

1. RC通过PCIE对EP下载固件步骤1. EP卡串口波特率是1500000(RC波特率也是1500000),连接串口后会一直打印如下log,说明EP和RC的PCIE通路Link成功,正在等待RC传输固件。

```text
U-Boot SPL 2017.09-g614fe864bf-dirty #xyp (Apr 20 2023 - 11:19:22)
RKEP: 191277 - Link ready! Waiting RC to download Firmware:
RKEP: 191723 - Download uboot.img  to BAR2+0
RKEP: 192068 - Download boot.img   to BAR2+0x400000
RKEP: 192466 - Send CMD_LOADER_RUN to BAR0+0x400
RKEP: 1092850 - Waiting for FW, CMD: 0
RKEP: 2093146 - Waiting for FW, CMD: 0
RKEP: 3093443 - Waiting for FW, CMD: 0
RKEP: 4093740 - Waiting for FW, CMD: 0
RKEP: 5094036 - Waiting for FW, CMD: 0
```

说明:



如果 EP 卡直接进入系统，说明 Flash 已有完整固件，需要在 maskrom 下重新写入 pcie_idb.img 和 normal_idb.img。

步骤 2：RC 执行 `./pcie_download_test_rc 0 ./uboot.img ./boot.img`，通过 DMA 将固件搬到 EP 指定内存地址，再发送启动指令从 DDR 启动；EP 打印正常开机日志并进入系统。

RC 执行应用异常时，请查看 examples/pcie_download_test/README 排查。

2. 视频解码预览 Sample

步骤 1：EP 和 RC 串口波特率均为 1500000。连接串口后，RC 执行 `lspci -vvv \|grep 356a` 和 `ls /dev/pcie-rkep*`，出现如下设备表示已识别 EP 且 RC 驱动加载正常。

```text
[root@RK3588:/userdata]# lspci -vvv |grep 356a
01:00.0 Processing accelerators: Rockchip Electronics Co., Ltd Device 356a (rev 01)
[root@RK3588:/userdata]# ls /dev/pcie-rkep*
/dev/pcie-rkep0000:01:00.0
```

步骤2. EP卡正常进入系统后,此时终端上将打印如下log,并被阻塞,等待RC应用启动。

```text
00:00:05.330 I [cmp_pcie_ep: cc_cmp_pcie_device: 390] rk pcie version: v3.0.0 - 2024-12-11
00:00:05.330 D [chipscon: cc_kernel_api_prob: 398] open rkep: /dev/pcie_ep Success.
00:00:05.330 D [chipscon: cc_kernel_api_prob: 403] probe pcie_rkep, fd = 3
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar0 size=0x400000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar2 size=0x4000000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar4 size=0x100000
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 73] no bar1
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 86] no bar5
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 590]  - id=ffffffff
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 600]  - id=356a1d87
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 609]  - magic=524b4550, ver=1
......
00:00:05.331 D [cmp_pcie_ep: pcie_task_ep_msg_t: 264]  start
00:00:05.331 D [cmp_pcie_ep: stream_speed_threa: 352] stream_speed_thread tart
```

步骤3. 参考用戶层内存配置章节对RC系统进行内存配置。步骤4. RC执行如下指令,完成与EP卡的握手然后启动与EP之间的数据传输。通用RC:./pcie_video_test_rc ./output1.h264 36 704 576 0 1RK RC: pcie_video_test_rc /root/output1.h264 36 704 576 0 1此时RC的显示设备会输出1080P60分辨率,可以看到36路视频解码以及首路NN人型检测功能。

RC 通过 DRM 显示框架输出，RK RC 默认支持，将 HDMI OUT0 接显示器即可。通用 RC 需安装 libdrm-dev，按原文 ctr+F3（通常为 Ctrl+F3）切换到无 GUI 终端再运行测试。

步骤4. 如果需要停止Sample程序,可以在RC应用输入回⻋键,RC会发消息给EP卡销毁相关 业务,并退出程序;EP卡接收消息后销毁相关业务并退出程序 。需要正常退出业务流程,否则EP卡业务不会退出导致下次运行异常。

说明:EP端应用默认开机自启并且循环启动,若需要运行其它测试程序需要先在开机脚本把当前测试注释然后重启RC和EP。修改/etc/init.d/S99_pcie_ep.sh,把下面的代码注释。

```text
while true;
do
    cd /
    pcie_video_test_ep 1
done &
```

#### 3.2.2 Windows RC

Windows RC提供的驱动只支持小于win10 2004版本的系统,高版本系统需要构建驱动编译环境自行编译。参考 Window驱动环境构建 章节搭建测试环境,测试只需要关注系统版本以及禁用驱动程序强制签名步骤。系统环境确认后,插入EP卡然后对PC上电,可以在设备管理器中看到PCI设备,右键点击该设备选择"更新驱动程序"->"浏览我的电脑以查找驱动程序"->设置为提供的驱动目录(Win-Driver-RC) ->下一步安装驱动。安装完成后可以在设备管理器看到 设备。Rockchip RC PCIE Driver for the rk35xx Accelerator Card使用管理员权限运行测试工具,工具如下图所示,当前支持固件下载、速率测试、视频解码目标检测测试。运行工具报错可查看常⻅问题处理章节。

![原稿技术图，第 12](/docs/rockchip-pcie-ep-standard-card/assets/cn-p012-figure-01.png)

*原稿技术图，第 12*

在硬件、软件环境准备好后,执行完整的 PCIE 功能验证的步骤如下。不需要对EP卡下载固件可以直接跳过第一点。

1. RC通过PCIE对EP下载固件步骤1. EP卡串口波特率是1500000(RC波特率也是1500000),连接串口后会一直打印如下log,说明EP和RC的PCIE通路Link成功,正在等待RC传输固件。

```text
U-Boot SPL 2017.09-g614fe864bf-dirty #xyp (Apr 20 2023 - 11:19:22)
RKEP: 191277 - Link ready! Waiting RC to download Firmware:
RKEP: 191723 - Download uboot.img  to BAR2+0
RKEP: 192068 - Download boot.img   to BAR2+0x400000
RKEP: 192466 - Send CMD_LOADER_RUN to BAR0+0x400
RKEP: 1092850 - Waiting for FW, CMD: 0
RKEP: 2093146 - Waiting for FW, CMD: 0
RKEP: 3093443 - Waiting for FW, CMD: 0
RKEP: 4093740 - Waiting for FW, CMD: 0
RKEP: 5094036 - Waiting for FW, CMD: 0
```

说明:



如果 EP 卡直接进入系统，说明 Flash 已有完整固件，需要在 maskrom 下重新写入 pcie_idb.img 和 normal_idb.img。

步骤 2：工具加载 uboot 和 boot 后点击固件下载。DMA 将固件搬到 EP 指定内存地址，再发送启动指令使其从 DDR 启动；EP 输出正常开机日志并进入系统。

2. 视频解码预览测试步骤1:EP卡正常进入系统后,此时终端上将打印如下log,并被阻塞,等待RC应用启动。

```text
00:00:05.330 I [cmp_pcie_ep: cc_cmp_pcie_device: 390] rk pcie version: v3.0.0 - 2024-12-11
00:00:05.330 D [chipscon: cc_kernel_api_prob: 398] open rkep: /dev/pcie_ep Success.
00:00:05.330 D [chipscon: cc_kernel_api_prob: 403] probe pcie_rkep, fd = 3
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar0 size=0x400000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar2 size=0x4000000
00:00:05.330 I [core_pcie_ep: cc_core_pcie_dev_i: 53] bar4 size=0x100000
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 73] no bar1
00:00:05.330 E [chipscon: cc_kernel_api_reso: 141] cc_kernel_api_resource_mmap mmap failed, size=0, err=Invalid argument
00:00:05.330 E [core_pcie_ep: cc_core_pcie_dev_i: 86] no bar5
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 590]  - id=ffffffff
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 600]  - id=356a1d87
00:00:05.330 I [pcie_dma: cc_core_pcie_dma_i: 609]  - magic=524b4550, ver=1
......
00:00:05.331 D [cmp_pcie_ep: pcie_task_ep_msg_t: 264]  start
00:00:05.331 D [cmp_pcie_ep: stream_speed_threa: 352] stream_speed_thread tart
```

步骤 2：将测试片源复制到工具目录，重命名为 output1.h264。当前固定使用 h264 裸码流。设置测试时间，点击视频测试按钮运行，测试画面如下。

![原稿技术图，第 14](/docs/rockchip-pcie-ep-standard-card/assets/cn-p014-figure-01.png)

*原稿技术图，第 14*

### 3.3 实测性能

PCIE EP传输性能

| EP | RC | 硬件配置 | 场景 | 最大传输数率 |
| --- | --- | --- | --- | --- |
| RK3588 | RK3588 | PCIE 3.0x4Lane | EP写数据到RC | 2.95GB/s |
|  |  |  | EP从RC读数据 | 1.8GB/s |
|  |  |  | EP同时读写RC | 各自1.6GB/s |
| RK3588 | RK3588 (开启Using RC DMA) | PCIE 3.0x4Lane | EP写数据到RC | 2.95GB/s |
|  |  |  | EP从RC读数据 | 2.95GB/s |
|  |  |  | EP同时读写RC | 各自2.85GB/s |
|  | X86 | PCIE 3.0x4Lane | EP写数据到RC | 2.9GB/s |
|  |  |  | EP从RC读数据 | 2.5GB/s |
|  |  |  | EP同时读写RC | 各自2.4GB/s |
|  | Windows | PCIE 3.0x4Lane | EP写数据到RC | 650MB/s |
|  |  |  | EP从RC读数据 | 700MB/s |
|  |  |  | EP同时读写RC | 各自320MB/s |

后续性能会继续优化,Windows暂不支持链式DMA测试速率受内存结构影响比较大,大块连续内存速率就高

### 3.4 Samples编译

各 Sample 编译及使用说明请参看 examples/*/README。

## 4. EP卡业务基础

### 4.1 原理介绍

EP卡业务内容主要是将源数据和处理器处理后的目标数据通过PCIe链路完成上下游间的传输,主要资源包括:RC端通过开源标准库libpci操作PCIE EP设备。通过pcie-rkep驱动完成:BAR映射,推荐作为控制流传输方式DMA传输,推荐作为数据块传输方式处理MSI中断,用戶层主动poll等待以提高响应速率,但涉及多层握手,实时性一般触发ELBI中断申请DMA内存支持多进程,例如支持运行多个pcie_speed_test例程EP端通过pcie_ep驱动完成:默认 class id 0x1200(Processing accelerators)BAR inbound物理地址空间映射DMA传输发送MSI中断处理ELBI中断,用戶层主动poll等待以提高响应速率,但涉及多层握手,实时性一般支持多线程VDEC、VENC、RGA、GPU、NPU等硬件资源可以通过Rockit 或者RKNN在用戶层调用。

## 5. Chips Connect简介

### 5.1 原理介绍

Chips Connect开发包是基于EP卡业务基础构建的用戶层开发包,主要提供RC、EP上下行数据传输、消息通知等常用功能的接口参考,同时构建典型业务场景以供参考。BAR空间分配(common platforms)对于内存分配较为充足的通用方案,SPL 及 Kernel 阶段BAR空间分配:

| BAR空间 | 起始地<br>址 | 结束地<br>址 | 功能 |
| --- | --- | --- | --- |
| BAR0 | 0 | 4KB | EP保留空间,驱动版本信息、中断状态等等。 |
|  | 12KB | 16KB | DEBUG功能相关配置信息。 |
|  | 16KB | 128KB | EP设备状态信息。 |
|  | 128KB | 1M | 用戶自定义。 |
|  | 1M | 4M | 框架命令交互以及buff管理。 |
| BAR1(Defaut Disabled) | 0 | 1MB | 用戶自定义,如何使能参考“BAR大小配置”章节配<br>置。 |
| BAR2(BAR2/3 Bar Repair) | 0 | 64MB | Using RC DMA使用。 |
| BAR4 | 0 | 4MB | wired寄存器区,用于操作DMA。 |
| BAR5(Defaut Disabled) | 0 | 1MB | 用戶自定义,如何使能参考“BAR大小配置”章节配<br>置。 |

说明:EP端BAR用戶自定义空间可用于二次开发扩展,其余BAR空间为该业务代码需求空间,例如:BAR1 默认关闭,全部空间为用戶自定义空间,开启后用作控制流BAR5 默认关闭,全部空间为用戶自定义空间,开启后用作控制流EP端BAR inbound CPU address默认由“BAR映射配置”固定配置,支持RC端动态调整BAR空间分配(memory-constrained platforms)对于内存分配较为局促的特殊方案,SPL 及 Kernel 阶段BAR空间分配:

| BAR空间 | 起始地址 | 结束地址 | 功能 |
| --- | --- | --- | --- |
| BAR0 | 0 | Reserved | 预留空间,默认为0 |
|  | R | R+2048B | EP保留空间,驱动版本信息、中断状态等等。 |
|  | R+2048B | R+2560B | DEBUG功能相关配置信息。 |
|  | R+2056B | R+3072B | EP设备状态信息。 |
|  | R+3072B | R+4KB | 用戶自定义。 |
|  | R+4KB | R+64KB | 框架命令交互以及buff管理。 |
| BAR1(Defaut Disabled) |  | 1MB | 用戶自定义,如何使能参考“BAR大小配置”章节配<br>置。 |
| BAR2(BAR2/3 Bar<br>Repair) | 0 | 64MB | Using RC DMA使用。 |
| BAR4 | 0 | 4MB | wired寄存器区,用于操作DMA。 |
| BAR5(Defaut Disabled) | 0 | 1MB | 用戶自定义,如何使能参考“BAR大小配置”章节配<br>置。 |

说明:预留空间:BAR最小对⻬1MB,通常要求申请1MB内存用以映射,但对于内存紧张的环境,允许做预留处理,chips connect业务使用预留后的内存EP端BAR用戶自定义空间可用于二次开发扩展,其余BAR空间为该业务代码需求空间,例如:BAR1 默认关闭,全部空间为用戶自定义空间,开启后用作控制流BAR5 默认关闭,全部空间为用戶自定义空间,开启后用作控制流EP端BAR inbound CPU address默认由“BAR映射配置”固定配置,支持RC端动态调整

### 5.2 PCIe传输系统架构

PCIE RC与EP系统框图

![原稿技术图，第 18](/docs/rockchip-pcie-ep-standard-card/assets/cn-p018-figure-01.png)

*原稿技术图，第 18*

### 5.3 BUFF管理结构及传输

BUFF管理

![原稿技术图，第 18](/docs/rockchip-pcie-ep-standard-card/assets/cn-p018-figure-02.png)

*原稿技术图，第 18*

这里从RC的⻆度简单说明下从初始化到一次完整的读写流程:

#### 5.3.1 初始化阶段

主要是做两件事:

1. 根据VENDOR_ID、DEVICE_ID以及总线地址初始化对应的PCIE设备。内部主要是通过libpci接口遍历系统PCIE设备并映射BAR空间到应用层。

支持传入不同设备 ID，重复调用 rk_pcie_device_init 初始化设备。



2. 调用 rk_pcie_task_create 创建任务并初始化内存及 BUFF 状态，通过 struct pcie_task_attr_st 设置 BUFF 数量和大小。配置信息经 BAR0 传给 EP，并等待 EP 初始化完成。EP 通过 rk_pcie_get_task_msg 获取创建任务消息，然后初始化 task，双方完成配置交互。RC 按编译配置选择 Hugepage/RKEP/RKDRM 分配内存。每个 EP 在 RC 上生成 /dev/pcie-rkep* 节点，并分配独立连续大内存（需开启对应配置）。EP 收到配置后初始化 BUFF 状态，通过接口申请物理连续内存，支持 Hugepage/RKDRM。双方 BUFF 信息最终置于 BAR0 特定区域，管理 BUFF 状态。

```text
#define VENDOR_ID                   0x1d87
#define DEVICE_ID                   0x356a

struct pcie_dev_bus dev_bus;
int ret;
//获取系统匹配的PCI设备总线地址
ret = rk_pcie_get_pci_bus_addresses(VENDOR_ID, DEVICE_ID, &rc_ctx.dev_bus);
if (ret != 0) {
    printf("get pci bus address fail\n");
    return -1;
}

printf("ep dev max num : %d\n", rc_ctx.dev_bus.dev_max_num);
if (rc_ctx.dev_bus.dev_max_num == 0) {
    printf("no ep device, exit ... \n");
} else {
    rc_ctx.dev_attr.using_rc_dma = 0;
    rc_ctx.dev_attr.rc_dma_chn = 0;
    rc_ctx.dev_attr.enable_speed = 1;
    rc_ctx.dev_attr.vendor_id = VENDOR_ID;
    rc_ctx.dev_attr.device_id = DEVICE_ID;
    rc_ctx.dev_attr.use_dma_only_in_rc = 0;
    rc_ctx.dev_attr.mem_type = E_MEM_TYPE_HUGEPAGE;
    memcpy(rc_ctx.dev_attr.pci_bus_address, pci_bus_address, strlen(pci_bus_address));

    //选择第⼀个匹配设备初始化
    rc_ctx.rk_handle = rk_pcie_device_init(&rc_ctx.dev_attr);
    //获取EP设备模式
    rk_pcie_get_ep_mode(rc_ctx.rk_handle, &rc_ctx.devmode);
    printf("ep device init, dev mode: %d, submode: %d\n", rc_ctx.devmode.mode,
rc_ctx.devmode.submode);
}
```

#### 5.3.2 发送数据

发送数据可以分为3个步骤

1. 查询是否有可用BUFF。

2. 获取可用BUFF,并写入数据。

3. 发送 BUFF 到对端。初始化 send_buff_num = 5 表示最多五个发送 BUFF。发送端获取可用 BUFF 后，通过 struct pcie_buff_node 获得物理地址、虚拟地址和大小，再进行业务处理。发送接口先 flush cache，确保物理内存最新，再通过 DMA 搬运至对端；DMA 大小 node->size 不得超过 BUFF 容量。对端释放后该 BUFF 才重新可用，否则流程会阻塞。rk_pcie_get_buff 暂不支持阻塞模式，需通过 sleep 循环等待。

```text
struct pcie_buff_node *node = rk_pcie_get_buff(rk_handle, E_SEND);
if(node) {
    node->size = rk_pcie_get_buff_max_size(rk_handle, E_SEND);
    //操作buff 写⼊数据
    rk_pcie_send_buff(ctx->rk_handle, node);
} else {
    usleep(1000);
}
```

RC 向 EP 发送数据原理:

![原稿技术图，第 21](/docs/rockchip-pcie-ep-standard-card/assets/cn-p021-vector-01.png)

*原稿技术图，第 21*

EP 向 RC 发送数据原理:

![原稿技术图，第 22](/docs/rockchip-pcie-ep-standard-card/assets/cn-p022-vector-02.png)

*原稿技术图，第 22*

#### 5.3.3 接收数据

接收数据可以分为3个步骤

1. 查询是否有可用BUFF。

2. 获取可用BUFF,并读取数据。

3. 释放 BUFF。接收与发送内部实现类似，初始化 recv_buff_num 配置 BUFF 数量；具体行为参见发送章节。有效数据大小为 node->size。

```text
struct pcie_buff_node *node = rk_pcie_get_buff(rk_handle, E_RECV);
if(node) {
    //操作buff 读取数据
    rk_pcie_release_buff(rk_handle, node);
} else {
    usleep(1000);
}
```

EP 接收数据原理:

![原稿技术图，第 23](/docs/rockchip-pcie-ep-standard-card/assets/cn-p023-vector-03.png)

*原稿技术图，第 23*

RC 接收数据原理:

![原稿技术图，第 23](/docs/rockchip-pcie-ep-standard-card/assets/cn-p023-vector-04.png)

*原稿技术图，第 23*

#### 5.3.4 BUFF配置

1. RC 到 EP 的 BUFF 配置：解码卡场景中 RC 发送裸码流，单路数据量较小，可申请 4KB*video chn 的 BUFF。每路每次传输 4KB，确保每次都更新数据，且避免数据过小浪费带宽。建议 3–5 个 BUFF 轮转，至少三个；额外处理需要增加 BUFF 数量，否则轮转卡住会影响速度。多线程传输可适当增加 BUFF。

2. EP发送到RC的BUFF配置。EP发送到RC的数据,正常是解码后的数据一般比较大,比如1080p解成YUV422的单帧数据大概是3M的大小。单个BUFF可以配置为3MB-6MB大小,每次传输1路或者2路解码后的数据。因为需要多个BUFF轮转,单个BUFF不易配置太大会占用太大的内存空间。

### 5.4 用戶层内存配置

RC/EP均支持多种内存申请方式:RC端:

1. pcie-rkep驱动申请内存,SDK通过mmap映射获取。使能配置:CONFIG_PCIE_FUNC_RKEP_USERPAGES=y (默认不使能)修改内存大小:修改驱动pcie-rkep.c RKEP_USER_MEM_SIZE宏 (默认是64M)

2. 通过HugePages 申请内存。(推荐方式)

3. 通过DRM驱动申请内存,需要在dts中对CMA预先分配。DMA内存大小修改设备树:arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi

```text
@@ -71,7 +71,7 @@ reserved-memory {
cma {
    compatible = "shared-dma-pool";
    reusable;
    reg = <0x0 0x50000000 0x0 0x10000000>; //从地址0x50000000开始256MB⼤⼩
    linux,cma-default;
};
```

4. dummy方式,数据buf交由用戶申请管理,框架只负责对轮转node管理,不申请数据buf。当前仅支持Windows系统。EP端:

1. 通过DRM驱动申请内存,需要在dts中对CMA预先分配。DMA内存大小修改设备树:arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi

```text
@@ -71,7 +71,7 @@ reserved-memory {
cma {
    compatible = "shared-dma-pool";
    reusable;
    reg = <0x0 0x50000000 0x0 0x10000000>; //从地址0x50000000开始256MB⼤⼩
    linux,cma-default;
};
```

2. 通过HugePages 申请内存。(推荐方式)不同内存申请方式可以在初始化Task通过属性来指定RC端:E_MEM_TYPE_HUGEPAGE / E_MEM_TYPE_RKDRM / E_MEM_TYPE_RKEPEP端:E_MEM_TYPE_HUGEPAGE / E_MEM_TYPE_RKDRM

说明:使用HugePages方式申请需要对系统进行配置,可以查看HugePage章节进行配置。

### 5.5 用戶层驱动优点

把PCIe的数据传输服务驱动提到用戶层主要是方便使用和性能优化两方面考虑。使用方面:基于PCIe设备驱动,方便不同平台的移植;方便直接跟应用对接,可以直接调用RK提供的rockit接口,或者第三方gstreamer接口等;对比kernel接口驱动,应用层驱动在性能方面优化主要有:使用轮询替换中断,减少频繁中断导致的CPU模式切换开销;减少kernel和userspace切换导致的CPU模式切换开销;建议绑定CPU,减少多核调度开销;去掉kernel space和userspace之间内存拷⻉开销,可以做到memory zero-copy;使用系统Huge Page memory,减少TLB cache miss;

### 5.6 用戶层多个独立应用扩展

RK chips_connect用戶层应用基础为Task:Task之间相互独立RC用戶消息相互独立,RC Task支持多进程开发EP用戶消息统一管理,EP Task不支持多进程Task内支持多线程Task ID先到先得、无法指定具体ID由于默认参考案例应用与Task等资源未绑定,所以无法实现多个独立应用并行,建议基于带应用程序ID的用戶消息划分消息、Task归属,扩展多个独立应用。例如RK RT-Thread chips_connect多应用解决方案:

1. 定义用戶消息规则,添加app管理:

```text
struct task_user_cmd_st {
    unsigned int app_id;
    unsigned int cmd;
    unsigned char data[4];
};
```

2. EP应用程序注册应用,unique app_id

3. RC发出消息,unique app_id

4. EP主程序根据app_id触发应用消息回调

5. EP应用程序处理消息,包括申请/释放Task

![原稿技术图，第 26](/docs/rockchip-pcie-ep-standard-card/assets/cn-p026-vector-05.png)

*原稿技术图，第 26*

## 6. Chips Connect配置

### 6.1 EP卡用戶层设备驱动

EP卡用戶层设备驱动指RC端运行的EP function驱动,包括内核模块和用戶层APP。

#### 6.1.1 Using-RC-DMA模式

Using-RC-DMA模式只能工作在EP卡对接RK RC设备情况下,该模式下可以让PCIE速率达到最大化。默认配置下只会使用EP端的DMA,Using-RC-DMA模式的原理就是把RC端的DMA使用起来。EP写数据到RC,则调用EP的DMA,RC写数据到EP,则调用RC的DMA,互不干扰。RC端DMA有限制只能搬运到BAR有做 memory inbound 映射的物理空间,所以这里把BAR2给RC DMA使用。默认大小是64M,可以在EP端dts中修改配置大小。这个内存只是RC写数据到EP的时候使用,也就是初始化阶段配置的大小,最小不能小于。send_buff_sizesend_buff_size使能模式RC以及EP设备驱动不需要修改,只需要RC上层应用初始化阶段参数配置

```text
dev_attr.using_rc_dma = 1; //使⽤RC DMA
dev_attr.rc_dma_chn = 1; //通道1，⽀持0/1
```

使能成功后可以在RC应用看到如下LOG:

```text
rk pcie version: v2.0.0 - 202300927
using rc dma: 1, chn: 1   //使能RC DMA，通道1
open rkrmd: /dev/pcie-rkep-0000:01:00.0 Success.
```

EP应用创建Task会有如下LOG:

```text
task create id: 1
using rc dma: 1
```

推荐配置单EP场景:推荐使能using_rc_dma,并且配置为通道0。多EP场景:推荐关闭using_rc_dma,使用EP各自的DMA搬运数据,可以让每个EP的传输速率保持大致相同。

## 7. Chips Connect典型业务场景

### 7.1 EP视频加速卡

视频加速卡是将RC的视频流通过PCIE总线传输给EP解码并处理后再通过PCIE总线传给主片显示 。基本的数据流处理如下图所示:

![原稿技术图，第 28](/docs/rockchip-pcie-ep-standard-card/assets/cn-p028-figure-01.png)

*原稿技术图，第 28*

码流发送端首先从视频流中获取码流数据,将其拷⻉至准备好的 send stream buffer 中,然后通过 PCIE 的 DMA 将码流数据发送到 PCIE 对端的 recv stream buffer 中,对端再将码流取出通过VDEC解码送入VPSS,VPSS输出2路数据,一路送入GPU合成,一路数据送入RKNN进行处理。把合成后的数据拷⻉至准备好的send stream buffer 中,然后通过 PCIE 的 DMA 将数据发送到 PCIE 对端的recv stream buffer 中,对端将数据取出送入VO模块显示。SDK已经实现发送端和接收端的 stream buffer ,初始化阶段配置参数即可使用,用戶只需要关注业务流程。

## 8. Chips Connect验收标准

首次使用PCIE EP开发包建议按照如下流程确认软件、硬件、基础业务流程正常后,再开始自定义功能开发。

### 8.1 开发包清单

目录结构介绍

```text
.
├── bootloader                    # pcie ep bootloader源码⼯程
├── build                         # build编译脚本
├── core
│   ├── api                       # sdk对外api，包含rc和ep
│   └── component                 # pcie组件，主要是负责buf管理，消息通知等
│   └── framework                 # 框架层，主要负责和OS交互，对上提供系统能⼒以及PCIE功能
├── docs                          # PCIE EP SDK⽂档介绍
├── examples
│   ├── pcie_camera_test          # EP卡典型业务，抓取EP Camera数据数据处理，仅android端使⽤
│   ├── pcie_speed_test           # EP卡典型业务，PCIE传输速率测试Demo
│   └── pcie_video_test           # EP卡典型业务，视频卡Demo
│   └── pcie_download_test        # EP卡RC下载固件启动⽅案Demo
│   └── pcie_auto_test            # EP卡功能⾃动化测试Demo
│   └── windows                   # EP卡Windows测试Demo
└── images                        # 功能验证固件
└── patch*                        # 补丁⽬录
└── third-party                   # 第三⽅依赖
```

开发包主要目录介绍:

core/framework目录对基础功能实现,包括内存分配管理、日志功能、linked_list、DMA、PCIE CONFIG等RC和EP通用组件。framework/core/pcie: 实现DMA传输,负责和芯片DMA配置交互。framework/core/mem:实现不同配置内存申请释放。framework/osal:对os接口实现封装,对上层屏蔽不同os差异。framework/base:实现基础数据结构,比如链表、队列等。core/component目录封装RC和EP接口实现,对内实现buf管理,消息通知,数据传输等,对外开放特定API方便不通过OS调用开发。该目录由三部分组成:ep_pcie: 负责PCIE EP部分buf管理,消息通知,数据传输相关实现。rc_pcie: 负责PCIE RC部分buf管理,消息通知,数据传输相关相关实现。cc_pcie_type.h 和 cc_cmp_pcie_type.h : 对外提供统一的结构体和数据类型,方便rc和ep通信。core/api目录下封装了不同系统用戶接口层的实现,对外开放特定API方便用戶开发,该目录下由四部分组成:ep:RK EP只需要支持arm环境,所以该部分只是对component/ep_pcie接口封装,没有实现额外的逻辑。rc/windows:Windows系统使用驱动形式开发,对用戶提供ioctl调用。rc/other: 除Windows系统外的其他系统,不需要使用驱动开发,所以只是对component/rc_pcie接口封装,没有实现额外的逻辑。build:目录实现对sdk编译构建,支持linux、android、windows。docs:标准EP板卡说明文档。examples:提供不同测试Sample,Sample介绍以及操作说明查看对应目录下的README。images:目录下存放可直接用于基础功能测试的固件以及Sample。patch*:SDK包对应的补丁,支持linux和android系统。补丁说明请查看。patch*/README

### 8.2 补丁更新 \| 一键生效“更新包”源码

测试目标标准卡驱动版本升级,支持一键添加“更新包”目录下的补丁。测试方法RK3588:

```text
./ep_patch.sh release patch-kernel5.10/更新包 ./path-to-dst/
```

RK3568:

```text
./ep_patch.sh release patch-kernel4.19/更新包 ./path-to-dst/
```

其他说明:生成补丁包:

```text
./ep_patch.sh release ./.. patch-kernel5.10/更新包
cd ./../kernel/
git checkout develop-4.19
cd -
./ep_patch.sh kernel ./.. patch-kernel4.19/更新包
```

### 8.3 功能 \| 关键日志信息

#### 8.3.1 RC端lspci关键信息

确认以下信息:bar使能且正常分配MSI使能且正常分配LnkCap,Gen3x4支持、ASPM not supportedLnkSta,Gen3x4状态Kernel driver in use: pcie-rkeplog示例:

```text
01:00.0 Class 1200: Device 1d87:356a (rev 01)
        Control: I/O- Mem+ BusMaster+ SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR-
FastB2B- DisINTx+
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort-
>SERR- <PERR- INTx-
        Latency: 0
        Interrupt: pin A routed to IRQ 157
        Region 0: Memory at f0400000 (32-bit, non-prefetchable) [size=4M]
        Region 2: Memory at 900000000 (64-bit, prefetchable) [size=64M]
        Region 4: Memory at f0200000 (32-bit, non-prefetchable) [size=1M]
        Capabilities: [40] Power Management version 3
                Flags: PMEClk- DSI- D1+ D2+ AuxCurrent=375mA PME(D0+,D1+,D2-,D3hot+,D3cold-)
                Status: D0 NoSoftRst+ PME-Enable- DSel=0 DScale=0 PME-
        Capabilities: [50] MSI: Enable+ Count=4/32 Maskable+ 64bit+
                Address: 00000000fe670040  Data: 0000
                Masking: fffffff0  Pending: 00000000
        Capabilities: [70] Express (v2) Endpoint, MSI 08
                DevCap: MaxPayload 256 bytes, PhantFunc 0, Latency L0s unlimited, L1
unlimited
                        ExtTag+ AttnBtn- AttnInd- PwrInd- RBE+ FLReset- SlotPowerLimit
0.000W
                DevCtl: Report errors: Correctable- Non-Fatal- Fatal- Unsupported-
                        RlxdOrd+ ExtTag+ PhantFunc- AuxPwr- NoSnoop-
                        MaxPayload 256 bytes, MaxReadReq 256 bytes
                DevSta: CorrErr- UncorrErr- FatalErr- UnsuppReq- AuxPwr- TransPend-
                LnkCap: Port #0, Speed 8GT/s, Width x4, ASPM not supported, Exit Latency L0s
<4us, L1 <16us
                        ClockPM- Surprise- LLActRep- BwNot- ASPMOptComp+
```

```text
                LnkCtl: ASPM Disabled; RCB 64 bytes Disabled- CommClk-
                        ExtSynch- ClockPM- AutWidDis- BWInt- AutBWInt-
                LnkSta: Speed 8GT/s, Width x4, TrErr- Train- SlotClk+ DLActive- BWMgmt-
ABWMgmt-
                DevCap2: Completion Timeout: Not Supported, TimeoutDis+, LTR+, OBFF Via
message/WAKE#
                DevCtl2: Completion Timeout: 50us to 50ms, TimeoutDis-, LTR+, OBFF Disabled
                LnkCtl2: Target Link Speed: 8GT/s, EnterCompliance- SpeedDis-
                         Transmit Margin: Normal Operating Range, EnterModifiedCompliance-
ComplianceSOS-
                         Compliance De-emphasis: -6dB
                LnkSta2: Current De-emphasis Level: -6dB, EqualizationComplete+,
EqualizationPhase1+
                         EqualizationPhase2+, EqualizationPhase3+, LinkEqualizationRequest-
        Capabilities: [b0] MSI-X: Enable- Count=128 Masked-
                Vector table: BAR=4 offset=00020000
                PBA: BAR=4 offset=00028000
        Capabilities: [100 v2] Advanced Error Reporting
                UESta:  DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP-
ECRC- UnsupReq- ACSViol-
                UEMsk:  DLP- SDES- TLP- FCP- CmpltTO- CmpltAbrt- UnxCmplt- RxOF- MalfTLP-
ECRC- UnsupReq- ACSViol-
                UESvrt: DLP+ SDES+ TLP- FCP+ CmpltTO- CmpltAbrt- UnxCmplt- RxOF+ MalfTLP+
ECRC- UnsupReq- ACSViol-
                CESta:  RxErr- BadTLP- BadDLLP- Rollover- Timeout- NonFatalErr-
                CEMsk:  RxErr- BadTLP- BadDLLP- Rollover- Timeout- NonFatalErr+
                AERCap: First Error Pointer: 00, GenCap+ CGenEn- ChkCap+ ChkEn-
        Capabilities: [148 v1] #19
        Capabilities: [168 v1] Address Translation Service (ATS)
                ATSCap: Invalidate Queue Depth: 00
                ATSCtl: Enable-, Smallest Translation Unit: 00
        Capabilities: [178 v1] Page Request Interface (PRI)
                PRICtl: Enable- Reset-
                PRISta: RF- UPRGI- Stopped+
                Page Request Capacity: 00000001, Page Request Allocation: 00000000
        Capabilities: [188 v1] Latency Tolerance Reporting
                Max snoop latency: 0ns
                Max no snoop latency: 0ns
        Capabilities: [190 v1] L1 PM Substates
                L1SubCap: PCI-PM_L1.2+ PCI-PM_L1.1+ ASPM_L1.2+ ASPM_L1.1+ L1_PM_Substates+
                          PortCommonModeRestoreTime=10us PortTPowerOnTime=10us
        Capabilities: [1a0 v1] #16
        Capabilities: [1d0 v1] Vendor Specific Information: ID=0002 Rev=4 Len=100 <?>
        Capabilities: [2d0 v1] Vendor Specific Information: ID=0006 Rev=0 Len=018 <?>
        Capabilities: [2e8 v1] #15
        Kernel driver in use: pcie-rkep
```

#### 8.3.2 EP端spl.bin启动 log

确认以下信息:kenrel阶段打印“already linkup”log示例:

```text
... #spl关键打印

U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: 188259 - PHY Mode 0x4
RKEP: 189537 - RKEP: GRF:904=7, a04=7...
RKEP: 190138 - RKEP: GRF:904=7, a04=f...
RKEP: 190487 - RKEP: GRF:904=f, a04=f...
RKEP: 190827 - RefClock in common clock_mode
RKEP: 200593 - BAR0: 0x3c000000
RKEP: 200864 - BAR2: 0x010000000
RKEP: 201247 - init PCIe fast Link up
RKEP: 218243 - Link up 230011
RKEP: 259699 - Done

... #内核关键打印

[00-06-34.831][    3.148198] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[00-06-34.834][    3.149015] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[00-06-34.834][    3.149027] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[00-06-34.837][    3.149046] rk-pcie-ep fe150000.pcie: already linkup
[00-06-34.837][    3.149320] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
```

#### 8.3.3 EP端pcie.bin启动 log

确认以下信息:记录pcie.bin运行时间

| 版本 | 耗时 |
| --- | --- |
| V1.00 | 360ms |

spl阶段打印“already link up”kenrel阶段打印“already linkup”log示例:

```text
#pcie.bin关键打印
PCIe_EP Release Time: Jan  2 2025 V2.20
Gen3x4
```

```text
phyMode4
HW
controlelr initialed
GRF:904=0007, a04=0007...
GRF:904=004F, a04=004F...
phy locked
phy initialed
vid=0x1D87 did=0x356A
ms=000C
Linking, ltssm:
00000001
00000002
00000007
00210022
00210023
00230011
Link up
rst_fun1
Link stable, ltssm
00230011
out

... #spl关键打印

U-Boot SPL board init
RKEP: Init PCIe EP
RKEP: already link up

... #内核关键打印

[00-06-34.831][    3.148198] rk-pcie-ep fe150000.pcie: bar0: assigned [0x3c000000-3c3fffff]
[00-06-34.834][    3.149015] rk-pcie-ep fe150000.pcie: bar2: assigned [0x40000000-43ffffff]
[00-06-34.834][    3.149027] rk-pcie-ep fe150000.pcie: no vpcie3v3 regulator found
[00-06-34.837][    3.149046] rk-pcie-ep fe150000.pcie: already linkup
[00-06-34.837][    3.149320] rk-pcie-ep fe150000.pcie: register misc device pcie_ep
```

### 8.4 功能 \| 固件烧录

请阅读”单EP卡对接通用RC“章节,确认是否为需要快速启动的产品形态,并确认所使用存储方案并做对应PC升级烧录验证,主要包括:单存储双存储EP Boot详细参考“EP卡固件编译”章节。

### 8.5 性能 \| 用戶态测试Demo - pcie_speed_test

#### 8.5.1 测试目标

验证业务基础,主要包括:RC端wired DMA to EP传输、DMA传输速率及双向DMA传输RC端local DMA to RC传输、DMA传输速率及双向DMA传输bar映射、访问正常ELBI 工作正常,支持RC 触发中断事件通知EPMSI 工作正常,支持EP 触发中断事件通知RC根据需求验证:如果选用支持DMA的RK RC,支持RC端Local DMA to EP传输,DMA传输速率firmware download

#### 8.5.2 测试方法

详细参考examples/pcie_speed_test/README.md文档。

#### 8.5.3 RK3588 Gen3x4测试结果

测试设备RC:RK3588-EVB1-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8G,CPU/Dram 定高频EP:RK3588-EVB4-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8G,CPU/Dram 定高频标准 EP 版本Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz测试参数:使用 EP DMA 引擎task_num = 1测试结果

| DMA大小 | 64B | 256B | 4K | 64KB | 1MB | 4MB |
| --- | --- | --- | --- | --- | --- | --- |
| RC 读(DMA 写) | 0.16MB/S | 0.65MB/S | 10.4MB/S | 165.8MB/S | 1898.7MB/S | 3271.3MB/s |
| RC 写(DMA 读) | 0.17MB/S | 0.73MB/S | 11.0MB/S | 171.1MB/S | 1630.6MB/S | 1735.6MB/s |

说明:如果是RC发起测试,且使用默认的EP DMA引擎,写测试实际为EP DMA读,读测试实际为EP DMA写

测试粒度越小,调度参与越多,性能越差,但可以通过开多线程提高整体性能

#### 8.5.4 RK3588 Gen2x1测试结果

测试设备RC:RK3588-EVB1-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8GEP:RK3588-EVB4-LP4X-V10 PCIe 3.0 4 lanes(降为Gen2 1 lanes) 大核2.4G小核1.8G标准EP版本Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz测试参数:使用EP DMA引擎task_num = 1测试结果

| DMA大小 | 64B | 256B | 4K | 64KB | 1MB | 4MB |
| --- | --- | --- | --- | --- | --- | --- |
| 写 | 0.16MB/S | 0.64MB/S | 10.2MB/S | 147.6MB/S | 394.0MB/S | 396.2MB/s |
| 读 | 0.17MB/S | 0.70MB/S | 11.0MB/S | 149.2MB/S | 384.0MB/S | 384.1MB/s |

说明:如果是RC发起测试,且使用默认的EP DMA引擎,写测试实际为EP DMA读,读测试实际为EP DMA写测试粒度越小,调度参与越多,性能越差,但可以通过开多线程提高整体性能

#### 8.5.5 RK1820 Gen2x1测试结果

测试设备RC:RK3588-EVB1-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8GEP:RK1820 PCIe 2.0 1 lanes标准EP版本RC - Rockchip_PCIE_EP_Standard_Card_20250523_V3.1.0.tar.gzEP - RK RT-Thread SDK develop-v5.1.x 分支测试参数:使用EP DMA引擎task_num = 1RK1820 DRAM 内存测试结果

| DMA大小 | 64B | 256B | 4K | 8K | 64KB | 512KB |
| --- | --- | --- | --- | --- | --- | --- |
| RC 写(EP DMA 读) | 3MB/S | 10MB/S | 136MB/S | 188MB/s | 303MB/s | 317MB/s |
| RC 读(EP DMA 写) | 3MB/S | 11MB/S | 143MB/S | 237MB/S | 363MB/s | 382MB/s |

说明:如果是RC发起测试,且使用默认的EP DMA引擎,写测试实际为EP DMA读,读测试实际为EP DMA写测试粒度越小,调度参与越多,性能越差,但可以通过开多线程提高整体性能相较于EP Linux OS,RT-Thread OS为实时系统,用戶层程序可快速响应中断,所以小粒度数据传输依旧保持较高吞吐

### 8.6 性能 \| 用戶态测试Demo - pcie_loopback_test

#### 8.6.1 测试目标

统计典型发包回包场景,统计串行流程的响应耗时时⻓。

![原稿技术图，第 36](/docs/rockchip-pcie-ep-standard-card/assets/cn-p036-vector-06.png)

*原稿技术图，第 36*

#### 8.6.2 测试方法

详细参考examples/pcie_speed_test/README.md文档。

#### 8.6.3 RK3588 Gen2x1测试结果

测试设备RC:RK3588-EVB1-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8GEP:RK3588-EVB4-LP4X-V10 PCIe 3.0 4 lanes(降为Gen2 1 lanes) 大核2.4G小核1.8G标准EP版本Rockchip_PCIE_EP_Standard_Card_20231215.tar.gz测试参数:使用EP DMA引擎task_num = 1测试结果

| DMA大小 | 4K |
| --- | --- |
| min/max | 105us/724us |

说明:如果是RC发起测试,且使用默认的EP DMA引擎,写测试实际为EP DMA读,读测试实际为EP DMA写测试结果为测试1秒后统计值,排除初始化过程的偏差影响测试结果为持续发包下的best case结果,请根据需求调整间隙和其他负载来构建worst case

#### 8.6.4 RK1820 Gen2x1测试结果

测试设备RC:RK3588-EVB1-LP4X-V10 PCIe 3.0 4 lanes大核2.4G小核1.8GEP:RK1820 PCIe 2.0 1 lanes标准EP版本RC - Rockchip_PCIE_EP_Standard_Card_20250523_V3.1.0.tar.gzEP - RK RT-Thread SDK develop-v5.1.x 分支测试参数:使用EP DMA引擎task_num = 1

RK1820 DRAM 内存测试结果

| DMA大小 | 4K |
| --- | --- |
| min/max | 83us/139us |

说明:如果是RC发起测试,且使用默认的EP DMA引擎,写测试实际为EP DMA读,读测试实际为EP DMA写测试结果为测试1秒后统计值,排除初始化过程的偏差影响测试结果为持续发包下的best case结果,请根据需求调整间隙和其他负载来构建worst case

### 8.7 兼容性 \| 枚举

测试目标验证EP板卡在不同RC上探测、识别、枚举的兼容性和健壮性。测试方法RK EP主要对接的RC:

| EP设备 | RC设备 | 冷启 | 休眠唤<br>醒 | 热启 | 确认方法 |
| --- | --- | --- | --- | --- | --- |
| RK3588 EVB4 V11 | RK3588 EVB1<br>V10 | 20/20 | 20/20 | 20/20 | Linux:lspci \| grep 356a |
| RK3588 EVB4 V11 | PC ubuntu | 20/20 | 20/20 | 20/20 | Linux:lspci \| grep 356a |
| RK3588 EVB4 V11 | PC windows | 20/20 | 20/20 | 20/20 | 设备管理器确认是否有对应设<br>备 |
| RK3568 iotest设<br>备 | RK3588 EVB1<br>V10 | 20/20 | 20/20 | 20/20 | Linux:lspci \| grep 356a |
| RK3568 iotest设<br>备 | PC ubuntu | 20/20 | 20/20 | 20/20 | Linux:lspci \| grep 356a |

说明:实际产品尽可能多的覆盖目标RC设备冷启:PC断电、上电、按下POWER按键休眠唤醒:RK RC:POWER按键进出休眠唤醒ubuntu:桌面版本通过可以通过界面按键进入,其他场景自行确认Windows:CTRL+L组合按键进入,其他场景自行确认热启:

RK3588:进入root权限,shell界面输入reboot指令ubuntu:进入root权限,shell界面输入reboot指令Windows:桌面下,ALT+F4组合键弹出复位选项,选择复位,部分PC支持直接按POWER按键复位

### 8.8 兼容性 \| EP复位RC检测并重新枚举

测试目标：检验 EP 单独复位时 PCIe remove/rescan、通信恢复及业务健壮性。前述功能测试均正常后，编译 examples/pcie_auto_test，按 examples/pcie_auto_test/README.md 部署。RC 执行 `./pcie_auto_test_rc 2 0`、`./pcie_auto_test_rc 3 0`，对第 0 个设备进行 Remove 和 Rescan。执行 `./pcie_auto_test_rc 0 0` 对设备 0 进行 API 稳定性测试，确认通信和业务恢复。

### 8.9 功能 \| OTA

请阅读”单EP卡对接通用RC“章节,确认是否为需要快速启动的产品形态,并确认所使用存储方案并做对应OTA验证,主要包括:单存储双存储EP Boot详细参考“EP卡OTA”章节。

## 9. Chips Connect异常处理

### 9.1 RC端x86平台执行初始化PCIE报如下错误mmap failed, Operation not permitted

```text
root@rk:/home/rc-sample# ./pcie_test 10240
resource path = /sys/bus/pci/devices/0000:01:00.0/enable
resource path = /sys/bus/pci/devices/0000:01:00.0/resource0
mmap failed, ret = 0, Operation not permitted
ep dev num : 1
Segmentation fault (core dumped)
```

答:这个是因为ubuntu从20.04开始增加linux 内核锁定功能,如果在bios使能安全启动功能,会打开内核锁定导致mmap失败。 需要进入bios关闭安全启动即可正常。

### 9.2 HugePage配置

RK平台Hugepage大小支持2M、32M、1GB,其它平台支持大小以实际系统为主。单个Hugepage大小配置需要大于SDK中单个发送buff以及单个接收buff的大小,Hugepage数量需要超过所需要的Buff数量。比如:5个发送Buff,单个Buff是4M,5个接收Buff,单个Buff是8M。这种情况下就不能配置Hugepage为2M,最小配置需要32M发送Buff需要的Hugepage个数 = ( int ) ( 5 / ( 32M / 4M ) ) + 1 = 1接收Buff需要的Hugepage个数 = ( int ) ( 5 / ( 32M / 8M ) ) + 1 = 2则最终配置为default_hugepagesz=32M, hugepagesz=32M, hugepages=3

#### 9.2.1 X86平台

查看Hugepagesize大小

```text
rk@debian:~$ cat /proc/meminfo | grep Huge
HugePages_Total:       2
HugePages_Free:        2
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:    2048 kB
Hugetlb:         4096 kB
```

修改大小为1GB修改cmdline参数,编解/etc/default/grub, 添加default_hugepagesz=1G

```text
GRUB_CMDLINE_LINUX_DEFAULT="quiet default_hugepagesz=1G hugepagesz=1G hugepages=1"
GRUB_CMDLINE_LINUX=""
```

生成配置

```text
/usr/sbin/grub-mkconfig -o /boot/grub/grub.cfg
```

重启设备 reboot 或者 systemctl poweroff查看size和count,cat /proc/meminfo \| grep Hugepagesize

```text
rk@debian:~$ cat /proc/meminfo | grep Huge
HugePages_Total:       1
HugePages_Free:        1
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:    1048576 kB
Hugetlb:         1048576 kB
```

#### 9.2.2 RK平台

内核开启Hugepage配置

```text
+++ b/arch/arm64/configs/rockchip_linux_defconfig
@@ -1,5 +1,10 @@
 CONFIG_DEFAULT_HOSTNAME="localhost"
 CONFIG_SYSVIPC=y
+CONFIG_HUGETLBFS=y
 CONFIG_NO_HZ=y
 CONFIG_HIGH_RES_TIMERS=y
 CONFIG_PREEMPT_VOLUNTARY=y
```

cmdline 添加 default_hugepagesz=32M hugepagesz=32M hugepages=16，将 Hugepage 设为 32M，共 16 个。

```text
+++ b/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
@@ -6,7 +6,7 @@

 / {
        chosen: chosen {
-               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait";
+               bootargs = "earlycon=uart8250,mmio32,0xfeb50000 console=ttyFIQ0 irqchip.gicv3_pseudo_nmi=0 clk_gate.always_on=1 pm_domains.always_on=1 root=PARTUUID=614e0000-0000 rw rootwait default_hugepagesz=32M hugepagesz=32M hugepages=16";
        };

        cspmu: cspmu@fd10c000 {
```

重新编译内核烧写,开机后查看/proc/meminfo确认是否添加成功

```text
[root@RK3588:/userdata]# cat /proc/meminfo | grep Huge
HugePages_Total:      16
HugePages_Free:       16
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:      32768 kB
Hugetlb:         1048576 kB
```

### 9.3 使用API接口获取user cmd区域或者ep info区域后,操作该区域导致内 核报错或者报错Bus error

有两种原因会导致这个问题出现:

1. 使用memset或者memcpy等接口去操作这块内存。

2. 应用编译优化超过 -O1。第一种情况应去掉 memset/memcpy，使用 for 循环；第二种情况降低优化等级，或增加 -fno-tree-loop-optimize 关闭循环优化。

### 9.4 Window驱动编译环境构建

当前驱动开发验证平台:系统版本Windows10 2004,wdk版本10.0.19041.685。

1. 确认系统版本右键电脑属性,查看系统版本 或者 win+r 输入winver查看,主要关注操作系统内部版本:19042.1052。

```text
版本                Windows 10 专业版
版本号              20H2
安装⽇期            2021/6/5
操作系统内部版本     19042.1052
```

2. 下载安装vs2019以及WDK,参考网上教程即可。

3. Windows主机禁用驱动程序强制签名,这里提供3种方法:高级启动选项:重启计算机,在启动过程中进入高级启动选项(通常需要在启动时按F8键)。在高级启动选项菜单中,如果看到“禁用驱动程序签名强制”或类似选项,并且这个选项被选中,那么数字签名校验被关闭。使用命令行(仅用于临时禁用):打开命令提示符(管理员)。输入以下命令:bcdedit /set testsigning on使用组策略编辑器(适用于Windows Pro及更高版本):打开“本地组策略编辑器(” gpedit.msc)。导航到“计算机配置” -> “管理模板” -> “系统” -> “驱动程序安装”。查看“设备:允许未签名的驱动程序安装”的设置。如果该设置被启用,则表示数字签名校验可能被禁用。重启计算机,如果在桌面的右下⻆看到“测试模式”字样,这表示数字签名校验被禁用。数字签名没有禁用则驱动会安装失败。

4. 加载工程编译vs工程文件在build/windows/rk_projects目录下,打开rk_projects.sln即可。项目rc_pcie是驱动工程,支持4个配置(不同配置是因为win10 2004版本后部分API被遗弃需要通过配置隔离):Debug_eq_win10_2004 :Debug环境,大于win10 2004系统使用Debug_less_win10_2004 :Debug环境,小等于win10 2004系统使用Release_eq_win10_2004 :Release环境,大于win10 2004系统使用Release_less_win10_2004 :Release环境,小等于win10 2004系统使用项目examples是测试工程,支持Debug和Release配置,用于验证驱动是否正常。编译成功后会在build/windows/rk_projects/x64目录输出驱动和测试文件。

### 9.5 Windows应用执行报错:MSVCP140.dll和vcruntime140.dll找不到

下载安装 Visual C++ Redistributable for Visual Studio 2015

### 9.6 Windows开启调试模式报错尝试修改调试程序设置时出错。该值受安全 引导策略保护,无法进行修改或删除。

Windows10进入BIOS中,关闭安全启动。把“secure boot”设为“disable”

## 10. Chips Connect API参考

详细参考《Rockchip_Developer_Guide_PCIE_EP_Standard_Card_APIs》文档。

{% endraw %}
