---
title: "RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation"
description: "RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation · RKNN2 V2.5.0"
excerpt: "RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation"
translation_key: "rknn-v250-rk2118-host-environment"
slug: "rknn-v250-rk2118-host-environment"
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

**RK2118 quickstart series · 2/5**

[RK2118 NPU quickstart, part 1: hardware, connections and serial console](/articles/rknn-v250-rk2118-hardware/)

**RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation**

[RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware](/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results](/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU quickstart, part 5: Docker, FAQ and references](/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 3. Prepare Development Environment

This chapter introduces how to install the development environment directly on the computer. The subsequent sample program running process will also be explained using direct installation as an example. If you need to run the sample program in a Docker environment, you can refer to Chapter 5 to prepare the development environment.

This chapter is divided into three parts:

- Download RKNN Related Repositories

- Install the RKNN-Toolkit2 Environment on the Computer

- Prepare RK2118 SDK

### 3.1 Download RKNN Related Repositories

It is recommended to create a new directory to store the RKNN repositories. For example, create a folder named "Projects" and place the RKNN-Toolkit2 repositories in that directory. Refer to the following commands:

```text
# Create the 'Projects' folder
mkdir Projects

# Switch to this directory
cd Projects

# Download the RKNN-Toolkit2 repository
git clone https://github.com/airockchip/rknn-toolkit2.git --depth 1

# Notice:
# 1. Parameter --depth 1 means to clone only the latest commit
# 2. If the 'git clone' command fails, you can also download the compressed file directly from GitHub and unzip it locally in this directory.
```

Overall directory structure:

```text
Projects
├── rknn-toolkit2
│ ├── doc
│ ├── rknn-toolkit2
│ │ ├── packages
│ │ ├── docker
│ │ └── ...
│ ├── rknpu2
│ │ ├── runtime
│ │ └── ...
│ └── ...
```

### 3.2 Install the RKNN-Toolkit2 Environment on the Computer

#### 3.2.1 Install Python

If the Python 3.8 environment is not installed on your system, or if there are multiple versions of Python installed, it is recommended to use Miniforge to create a new Python 3.8 environment.

##### 3.2.1.1 Install miniforge

In the terminal window on the computer, execute the following command to check whether miniforge is installed. If already installed, you can skip this step.

```text
conda -V
# Reference output: conda 24.3.0, indicating that Miniforge Conda version is 24.3.0
# If it shows 'conda: command not found', it means Miniforge Conda is not installed.
```

If Miniforge is not installed, you can download the Miniforge installer from the following link:

```text
https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Then, install miniforge using the following command:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

##### 3.2.1.2 Create Python Environment Using miniforge

In the terminal window on the computer, execute the following command to switch to the conda base environment:

```text
source /opt/miniforge3/bin/activate
# Upon successful activation, the command prompt will change to the following form:
# (base) xxx@xxx:~$
```

Create a Python 3.8 environment named 'toolkit2' using the following command:

```text
conda create -n toolkit2 python=3.8
```

Activate the 'toolkit2' environment. Subsequently, RKNN-Toolkit2 will be installed in this environment.

```text
conda activate toolkit2
# (toolkit2) xxx@xxx:~$
```

#### 3.2.2 Install RKNN-Toolkit2

After activating the 'toolkit2' environment, you can install RKNN-Toolkit2 using either the pip source or a local wheel package: - Install via pip source

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

- Install via local wheel package

```text
# Switch to the rknn-toolkit2 directory
cd Projects/rknn-toolkit2/rknn-toolkit2

# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r packages/x86_64/requirements_cpxx.txt
# pip install -r packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

#### 3.2.3 Check if the RKNN-Toolkit2 Environment is Installed Successfully

Execute the following command. if no errors are reported, it indicates that the RKNN-Toolkit2 environment has been successfully installed.

```text
# Switch to Python interactive mode
python

# Import the RKNN class
from rknn.api import RKNN
```

If the installation fails, please refer to Chapter 5.4.2, "RKNN-Toolkit2 Installation Issues," in the "RKNN2_SDK_Development_Guide_V2.5.0.pdf" document. It provides detailed solutions for resolving RKNN-Toolkit2 environment installation failures.

{% endraw %}
