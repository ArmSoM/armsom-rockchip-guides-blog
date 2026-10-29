---
title: "RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译"
description: "RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译 · RKNN2 V2.5.0"
excerpt: "RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译"
translation_key: "rknn-v250-rk2118-firmware"
slug: "rknn-v250-rk2118-firmware"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

平台参考：适用于 RK_EVB1_RK2118G_V20（RK2118）及其匹配的 RT-Thread SDK。尚未确认对应 ArmSoM 板卡，不可直接套用于其他 SoC；本文不指定已验证的 BSP 或 Linux 内核，也没有进行 ArmSoM 硬件实测。

来源：本地 RKNN2 RK2118 快速入门中英文 V2.5.0，保留原章节编号。中文沿用中文正文，英俄德沿用英文正文；已修复 PDF 自动换行造成的文件名、URL、注释和命令断裂。原文第 5.3 节将 RT-Thread 下载指向第 3.1 节，实际下载步骤位于第 3.3.1 节，两处关系在此注明。原文 Docker 命令挂载到 /rt-thread，后续给出相对路径 rt-thread/...；执行前应确认容器当前目录，本文未静默改写。示例日志、45ms 和参考输出来自原稿，不是 ArmSoM 实测。安装命令中的 latest/未固定版本安装不保证获得 V2.5.0，应与实际 SDK 核对。

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118 入门系列 · 3/5**

[RK2118 NPU 入门（一）：开发板、连接与串口](/zh/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU 入门（二）：主机环境与 Toolkit2 安装](/zh/articles/rknn-v250-rk2118-host-environment/)

**RK2118 NPU 入门（三）：RT-Thread 与 DSP 固件编译**

[RK2118 NPU 入门（四）：模型转换、U 盘输入与推理结果](/zh/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU 入门（五）：Docker、常见问题与参考文档](/zh/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

### 3.3 准备RK2118 SDK

NPU的相关示例包含在RK2118 SDK中,因此需要先准备RK2118的SDK源码。

#### 3.3.1 工程下载

- repo 工具下载,如果已经安装了 repo ,请略过该步骤。

```text
git clone ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -b stable
export PATH=/path/to/repo:$PATH
```

- 工程下载

```text
mkdir rt-thread
cd rt-thread
repo init --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -u ssh://git@www.rockchip.com.cn/rtos/rt-thread/rk/platform/release/manifests -b master -m rk2118.xml
.repo/repo/repo sync
```

注意:该工程访问需要权限,请找RK人员申请。

#### 3.3.2 编译环境准备

请参考"rt-thread/Rockchips-docs/manuals/rk2118"目录下的《Rockchip_Developer_Guide_RK2118_CN.pdf》搭建开发环境。

#### 3.3.3 RK2118固件编译

##### 3.3.3.1 开启RKNPU支持

参考《Rockchip_Developer_Guide_RK2118_CN.pdf》第4章节"CPU固件编译"。在rt-thread目录下执行如下语句:

```text
cd bsp/rockchip/rk2118
cp board/evb1_v20/defconfig_npu_demo .config
scons --menuconfig
```

请确保如下选项已经打开:

```text
RT-Thread Components --->
  [*] DFS: device virtual file system --->
       [*] Using posix-like functions, open/read/write/close
       [*] Using working directory
       (4) The maximal number of mounted file system
       (4) The maximal number of file system type
       (16) The maximal number of opened files
       [*] Using mount table for file system
       [*] Enable elm-chan fatfs
RT-Thread board config --->
  [*] using DRAM, only available for RK2118B or RK2118G
  [*] Enable hifi4 driver
  HIFI4 Project --->
    [*] HIFI4 Projects
    (X) npu Demo
  rknn dsp communication config --->
    [*] Enable rknn dsp demo communication for rk2118
RT-Thread rockchip RK2118 drivers --->
  Enable RKNPU Driver --->
    [*] Enable RKNPU Driver
    (X) RKNPU Driver in DSP
```

注:

- board/evb1_v20/defconfig_npu_demo 已包含上述全部选项,通常无需手工调整; scons --menuconfig 仅用于临时查看或实验。

- NPU 驱动位置选择 "RKNPU Driver in DSP"( RT_USING_RKNPU_DSP_DRIVER ):本 SDK 的 NPUdemo 由 HIFI4 DSP0 运行 rknn 固件( components/hifi4/samples/rk2118/npu_demo ),CPU0 侧通过 rknn_demo_server 与 DSP 通信;CPU 直连的 "RKNPU Driver in RTT" 路径与该demo 不兼容。

- 选中 "npu Demo" 后会自动选中 rknn dsp 通信组件并锁定 DSP 内存布局文件components/hifi4/samples/rk2118/npu_demo/mem_layout.h ,无需手工配置。

- build.sh 每次构建都会用对应 defconfig 覆盖 .config ,需要长期生效的修改请直接修改board/evb1_v20/defconfig_npu_demo 。

- 本板卡的固件编译与打包入口: ./build.sh board/evb1_v20/package-file npu_demo (生成Image/update.img ,含 npu_demo 的 dsp0/dsp1/dsp2 固件分区)。

##### 3.3.3.2 编译固件及打包

```text
cd bsp/rockchip/rk2118
./build.sh board/evb1_v20/package-file npu_demo
```

该命令一次完成编译与打包:

1. 用 board/evb1_v20/defconfig_npu_demo 覆盖 .config ,编译 CPU0/CPU1 固件;

2. 调用 mkimage.sh ,把 components/hifi4/rtt/dsp_fw/npu_demo/ 下的dsp0.bin / dsp1.bin / dsp2.bin 作为 DSP 固件分区(Type=0x400)打入镜像;

3. 最终生成 Image/update.img 。

说明:

- 只改 CPU 侧代码时,可单独执行 scons -j32 编译,再执行 ./mkimage.sh board/evb1_v20/package-file npu_demo 打包。

- 若修改了 DSP 工程( components/hifi4/samples/rk2118/npu_demo/npu_demo_dsp0 等),需先按 Xtensa 工程构建流程重新生成 rtt/dsp_fw/npu_demo/ 下的 dsp0.bin ,再执行打包,否则镜像里仍是旧 DSP 固件。

- DSP 固件分区路径由 mkimage.sh 的第二个参数( npu_demo )自动替换,不要手工改 package-file 。

##### 3.3.3.3 烧写固件

参考《Rockchip_Developer_Guide_RK2118_CN.pdf》"4.1.3.4 固件烧录"章节。也可以使用 SDK 自带的升级工具烧录 update.img :

```text
upgrade_tool uf Image/update.img
```

{% endraw %}
