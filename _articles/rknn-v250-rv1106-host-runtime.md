---
title: "RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime"
description: "RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime"
translation_key: "rknn-v250-rv1106-host-runtime"
slug: "rknn-v250-rv1106-host-runtime"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RV1103", "RV1106", "Mini Runtime"]
---

Platform reference for the RKNN2 V2.5.0 RV1103/RV1103B/RV1106/RV1106B quickstart, using the matching board SDK, RKNPU2 driver and librknnmrt.so. No corresponding ArmSoM board has been confirmed. The source Linux 5.10.160 log and inference outputs are examples, not ArmSoM hardware tests. Check power, connections and drivers against the actual board BSP.

Source: local Chinese and English V2.5.0 PDFs. Chinese uses the Chinese text and figures; English, Russian and German use the English source. All technical chapters, commands and tables are retained; PDF line wraps and directory-tree indentation are restored. An older driver in a sample log is not the recommended version; see the source recommendation below. Check unpinned downloads and pip installations against the actual SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RV1103/RV1106 RKNN quickstart 1: deployment flow, platforms and repositories](/articles/rknn-v250-rv1106-deployment-flow/)

[RV1103/RV1106 RKNN quickstart 2: hardware connections and device checks](/articles/rknn-v250-rv1106-hardware/)

**RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime**

[RV1103/RV1106 RKNN quickstart 4: YOLOv5 conversion, Python and C deployment](/articles/rknn-v250-rv1106-yolov5/)

[RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references](/articles/rknn-v250-rv1106-docker-faq/)

{% raw %}

## 3. Host and Board Environment Setup

This chapter prepares RKNN-Toolkit2, RKNPU2, and compilation tools required for the first run. The main flow uses direct installation on the computer. If you want to use Docker, refer to Chapter 5.

### 3.1 Install RKNN-Toolkit2

#### 3.1.1 Install the Python Environment

If Python 3.8 (recommended) is not installed on the system, or if multiple Python environments exist, it is recommended to use Miniforge to create an independent Python 3.8 environment.

Step 1: Install Miniforge

First, check whether Miniforge is already installed. If it is installed, skip this step.

```text
conda -V
# Reference output: conda 23.3.1, indicating that the Miniforge conda version is 23.3.1
# If 'conda: command not found' is displayed, Miniforge is not installed
```

If Miniforge is not installed, download the installer:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Then run:

```text
chmod +x Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

Step 2: Create the Python Environment

Enter the Miniforge base environment:

```text
source ~/miniforge3/bin/activate
# Upon successful activation, the command prompt changes to:
# (base) xxx@xxx:~$
```

Create a Python 3.8 environment named toolkit2 :

```text
conda create -n toolkit2 python=3.8
```

Activate the toolkit2 environment:

```text
conda activate toolkit2
# Upon successful activation, the command prompt changes to:
# (toolkit2) xxx@xxx:~$
```

Note: All subsequent Python-related commands are assumed to be executed in the toolkit2 environment.

#### 3.1.2 Install RKNN-Toolkit2

After activating the toolkit2 environment, RKNN-Toolkit2 can be installed either from the pip source or from a local wheel package.

Method 1: Install from the pip Source

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, upgrade it using:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Method 2: Install from a Local Wheel Package

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Select the requirements file according to the Python version and processor architecture
# cpxx is the Python version number
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# x.x.x is the RKNN-Toolkit2 version number, and cpxx is the Python version number
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

### 3.2 Check the Toolkit Installation

Keep the toolkit2 environment activated and enter Python interactive mode:

```text
python
```

Then import the RKNN class:

```text
from rknn.api import RKNN
```

If no error is reported during the import, the basic RKNN-Toolkit2 installation check has passed.

If the installation fails, refer to the RKNN-Toolkit2 installation and troubleshooting sections in RKNN2_SDK_Development_Guide.

### 3.3 Install or Check the Board-Side RKNPU2 Environment

For convenience, the remainder of this document uses "board" to refer to the development board.

The on-board debugging feature of RKNN-Toolkit2 requires the RKNPU2 environment to be installed on the board and rknn_server to be running.

| Component | Description |
| --- | --- |
| RKNN Server<br>(rknn_server) | A background proxy service running on the development board. It processes<br>data sent by the computer through USB and invokes the board-side Mini<br>Runtime to perform inference |
| RKNPU2 Mini Runtime<br>(librknnmrt.so) | Loads RKNN models in the system and invokes the NPU to perform inference |

#### 3.3.1 Check the RKNPU2 Driver Version

Run the following command on the board to query the RKNPU2 driver version:

```text
dmesg | grep -i rknpu
```

As shown in the following figure, the RKNPU2 driver version in this example is 0.8.5:

![English source figure · PDF 16](/assets/images/rknn-v250/rv1106/en/p016-figure-01.png)

*English source figure · PDF 16*

Figure 3-1 RKNPU2 driver version information

Official Rockchip development board firmware includes the RKNPU2 driver. If the command above cannot query the NPU driver version, third-party firmware without the NPU driver may be in use. If firmware source code is available, set CONFIG_ROCKCHIP_RKNPU to y in the kernel config, rebuild the kernel driver, and flash it.

Recommendation: RKNPU2 driver version >= 0.9.2.

#### 3.3.2 Check RKNPU2 Mini Runtime and Server

If RKNN Server or the Mini Runtime library is not installed on the board, or if their versions are inconsistent, reinstall the RKNPU2 environment.

Note:

1. If an RKNN model with dynamic input dimensions is used, the RKNN Server and Mini Runtime library versions must be >= 1.5.0.

2. The versions of rknn_server , the Mini Runtime library, and RKNN-Toolkit2 should be consistent. It is recommended to install components from the same latest release.

Step 1: Check Whether rknn_server Can Be Started

```text
# Switch to the board
adb shell

# Start rknn_server
restart_rknn.sh
```

If output similar to the following is displayed, rknn_server has started successfully:

```text
start rknn server, version: x.x.x
```

Step 2: Check the Server and Mini Runtime Versions

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"

# Query the librknnmrt.so version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Reference output:

```text
rknn_server version: x.x.x
librknnmrt version: x.x.x
```

#### 3.3.3 Install or Update the RKNPU2 Environment

If a version-consistent RKNPU2 environment is already installed, skip this section.

Switch to the rknpu2 directory, use ADB to push the corresponding rknn_server and librknnmrt.so to the board, and then start rknn_server :

```text
# Switch to the rknpu2 directory
cd Projects/rknn-toolkit2/rknpu2

# Push rknn_server to the board
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin

# Push librknnmrt.so
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Switch to the board
adb shell

# Grant executable permissions
chmod +x /oem/usr/bin/rknn_server
chmod +x /oem/usr/bin/start_rknn.sh
chmod +x /oem/usr/bin/restart_rknn.sh

# Restart the rknn_server service
restart_rknn.sh
```

### 3.4 Install Compilation Tools

#### 3.4.1 Install CMake

Run the following commands in the computer terminal:

```text
# Update package list
sudo apt update

# Install cmake
sudo apt install cmake
```

#### 3.4.2 Install the Compiler

##### 3.4.2.1 Confirm the Development Board System Architecture

Run the following command on the computer:

```text
adb shell uname -a
```

The reference output is shown below. armv7l indicates the ARMv7 architecture, which belongs to the armhf architecture. This architecture type will be used later when compiling the RKNN C Demo.

```text
Linux Rockchip 5.10.160 #1 Tue Oct 24 18:52:11 CST 2023 armv7l GNU/Linux
```

##### 3.4.2.2 Install the GCC Cross-Compiler

GCC download link: https://console.zbox.filez.com/l/c1cKaR (Extraction code: rknn ).

After downloading, extract the package. It is recommended to extract the GCC package into the Projects directory:

```text
Projects
├── rknn-toolkit2
├── rknn_model_zoo
└── arm-rockchip831-linux-uclibcgnueabihf
```

The GCC compiler path used by the following examples is:

```text
Projects/arm-rockchip831-linux-uclibcgnueabihf/bin/arm-rockchip831-linux-uclibcgnueabihf
```

### 3.5 Runtime Environment Pre-Check

Before model conversion, it is recommended to complete the following checks:

| Check Item | Command or Location | Expected Result |
| --- | --- | --- |
| Toolkit | Enter Python as described in Section 3.2 and execute<br>from rknn.api import RKNN | No error |
| Model Zoo | Projects/rknn_model_zoo/examples/yolov5 | Example directory exists |
| ADB | adb devices | Development board status is<br>device |
| RKNPU2 driver | adb shell "dmesg &#124; grep -i rknpu" | RKNPU2 driver information<br>can be queried |
| RKNN Server | adb shell restart_rknn.sh | rknn_server starts normally |
| Mini Runtime<br>version | Query the versions of rknn_server and<br>librknnmrt.so | Versions are consistent |
| CMake | cmake --version | Version information is<br>displayed correctly |
| GCC | Check Projects/arm-rockchip831-linux-uclibcgnueabihf | Cross-compiler directory<br>exists |

After the checks above pass, continue with the first model.

{% endraw %}
