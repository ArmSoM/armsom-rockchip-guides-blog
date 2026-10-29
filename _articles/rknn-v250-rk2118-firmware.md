---
title: "RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware"
description: "RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware · RKNN2 V2.5.0"
excerpt: "RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware"
translation_key: "rknn-v250-rk2118-firmware"
slug: "rknn-v250-rk2118-firmware"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Platform reference for RK_EVB1_RK2118G_V20 (RK2118) and its matching RT-Thread SDK. No corresponding ArmSoM board has been confirmed; do not transfer these instructions directly to another SoC. No validated BSP or Linux kernel is specified and no ArmSoM hardware testing was performed.

Source: local Chinese and English RKNN2 RK2118 QuickStart V2.5.0; original section numbers are retained. Chinese follows its source; English, Russian and German follow the English source. PDF-wrapped filenames, URLs, comments and commands are rejoined. Section 5.3 points to 3.1 for the RT-Thread download, but the download steps are in 3.3.1. The Docker command mounts /rt-thread, while the subsequent command uses the relative path rt-thread/...; check the container working directory. This discrepancy was not silently rewritten. Sample logs, 45ms and reference outputs belong to the source, not ArmSoM tests. Unpinned/latest installation commands do not guarantee V2.5.0; check the actual SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118 quickstart series · 3/5**

[RK2118 NPU quickstart, part 1: hardware, connections and serial console](/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation](/articles/rknn-v250-rk2118-host-environment/)

**RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware**

[RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results](/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU quickstart, part 5: Docker, FAQ and references](/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

### 3.3 Prepare RK2118 SDK

The example of NPU is included in the RK2118 SDK, so you need to prepare the RK2118 SDK source code first.

#### 3.3.1 Repository Download

- Download repo tool. If repo is already installed, please skip this step.

```text
git clone ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -b stable
export PATH=/path/to/repo:$PATH
```

- repository download

```text
mkdir rt-thread
cd rt-thread
repo init --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -u ssh://git@www.rockchip.com.cn/rtos/rt-thread/rk/platform/release/manifests -b master -m rk2118.xml
.repo/repo/repo sync
```

Note: This project requires authorization to access, please contact Rockchip to apply.

#### 3.3.2 Compilation environment preparation

Please refer to Rockchip_Developer_Guide_RK2118_CN.pdf in the rt-thread/Rockchips-docs/manuals/rk2118 directory to build the development environment.

#### 3.3.3 RK2118 firmware compilation

##### 3.3.3.1 Enable RKNPU support

Refer to Chapter 4, "CPU Firmware Compilation," of Rockchip_Developer_Guide_RK2118_CN.pdf to compile the firmware and enable RKNPU support. Return to the main directory of the rt-thread project and execute the following command:

```text
cd bsp/rockchip/rk2118
cp board/evb1_v20/defconfig_npu_demo .config
scons --menuconfig
```

Please make sure the following options are turned on:

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

Notes:

- board/evb1_v20/defconfig_npu_demo already includes all of the options listed above, so manual configuration is generally unnecessary. scons --menuconfig should only be used for temporary inspection or experimentation.

- For the NPU driver location, select "RKNPU Driver in DSP" ( RT_USING_RKNPU_DSP_DRIVER ). In this SDK, the NPU demo runs the RKNN firmware on HIFI4 DSP0 ( components/hifi4/samples/rk2118/npu_demo ), while CPU0 communicates with the DSP through rknn_demo_server . The CPU-direct "RKNPU Driver in RTT" path is not compatible with this demo.

- After "npu Demo" is selected, the RKNN DSP communication components are selected automatically, and the DSP memory layout file components/hifi4/samples/rk2118/npu_demo/mem_layout.h is fixed automatically. No manual configuration is required.

- Each time build.sh is executed, .config is overwritten with the corresponding defconfig. For persistent configuration changes, modify board/evb1_v20/defconfig_npu_demo directly.

- The firmware build and packaging command for this board is: ./build.sh board/evb1_v20/package-file npu_demo

This generates Image/update.img , which includes the dsp0 , dsp1 , and dsp2 firmware partitions for npu_demo .

##### 3.3.3.2 Compile firmware and package

```text
cd bsp/rockchip/rk2118
./build.sh board/evb1_v20/package-file npu_demo
```

This command performs both the build and packaging steps in a single operation:

1. Overwrite .config with board/evb1_v20/defconfig_npu_demo , then build the CPU0/CPU1 firmware.

2. Invoke mkimage.sh to package dsp0.bin , dsp1.bin , and dsp2.bin from components/hifi4/rtt/dsp_fw/npu_demo/ into the image as DSP firmware partitions ( Type=0x400 ).

3. Generate the final image at Image/update.img .

Notes:

- If only CPU-side code is modified, you can run scons -j32 to rebuild the firmware, and then run ./mkimage.sh board/evb1_v20/package-file npu_demo to package the image.

- If the DSP project is modified (for example, components/hifi4/samples/rk2118/npu_demo/npu_demo_dsp0 ), you must first rebuild the Xtensa project to regenerate dsp0.bin under rtt/dsp_fw/npu_demo/ , and then run the packaging command. Otherwise, the image will still contain the old DSP firmware.

- The DSP firmware partition path is automatically updated by the second argument to mkimage.sh ( npu_demo ). Do not modify package-file manually.

##### 3.3.3.3 Flashing firmware

Refer to Section 4.1.3.4, "Firmware Burning," of Rockchip_Developer_Guide_RK2118_CN.pdf to flash the firmware to the development board. You can also use the upgrade tool included with the SDK to flash update.img :

```text
upgrade_tool uf Image/update.img
```

{% endraw %}
