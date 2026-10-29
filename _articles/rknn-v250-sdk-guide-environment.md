---
title: "RKNN2 SDK V2.5.0 · Environment, versions and board connection"
description: "RKNN2 SDK V2.5.0 · Environment, versions and board connection · Complete development guide series"
excerpt: "Environment, versions and board connection"
translation_key: "rknn-v250-sdk-guide-environment"
slug: "rknn-v250-sdk-guide-environment"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Platform reference: this article follows the Rockchip RKNN2 SDK V2.5.0 Development Guide, including only the SoCs, Linux/Android Runtime and Toolkit combinations stated by the source. Features apply under the chip, SDK, driver and kernel conditions in each section, not automatically to every ArmSoM board. Check the actual ArmSoM BSP, NPU driver, Runtime and model versions before deployment. No ArmSoM hardware validation was performed; logs, performance figures and examples belong to the source.

Sources and proofreading: Chinese follows Chinese V2.5.0 (182 pages); English, Russian and German follow English V2.5.0 (208 pages). Source-specific technical information is retained; older-version content is not presented as new-version fact. Chinese figures come from the Chinese PDF; EN/RU/DE figures come from the English PDF, including separately extracted vector flowcharts. Original section and equation numbers remain. Some source cross-references still use old chapter numbers; dynamic-shape capacity examples contain “1224+140=264”, TP_NORM support statements conflict, and names such as init()/rknn.val_perf() differ from later API descriptions. These source issues are retained and require checking against actual V2.5.0 SDK headers/API references before execution. Code and parameters remain; PDF wrapping and table continuations are repaired.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 2/22**

[1. Software stack and core concepts](/articles/rknn-v250-sdk-guide-overview/)

**Environment, versions and board connection**

[3. Development workflow and interface selection](/articles/rknn-v250-sdk-guide-workflow/)

[4. Model conversion and ONNX editing](/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantization, hybrid quantization and QAT](/articles/rknn-v250-sdk-guide-quantization/)

[6. Inference, accuracy, performance and memory evaluation](/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime lifecycle, layouts and memory](/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-copy interfaces and I/O constraints](/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API deployment and code generation](/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python deployment](/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API and matrix layouts](/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU multicore configuration and performance](/articles/rknn-v250-sdk-guide-multicore/)

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Multi-batch inference](/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/articles/rknn-v250-sdk-guide-sram/)

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

## 1.2 Versions and Development Environment

RKNN-Toolkit2 supports two different version, one is for the x86, another one is for the ARM64. Both has the same installation setup except for ARM64 has not supported docker yet. Besides, ARM64 only supports models from the onnx and pytorch framework for conversion. Models from other frameworks does not support at the moment.

The difference between the version of x86 and ARM64:

| Deepleanring Framework | x86 | ARM64 |
| --- | --- | --- |
| Caffe | ✔ | ✗ |
| TensorFlow | ✔ | ✗ |
| TF Lite | ✔ | ✗ |
| ONNX | ✔ | ✔ |
| DarkNet | ✔ | ✗ |
| PyTorch | ✔ | ✔ |

The difference in tools:

| Dependent Tools | x86 | ARM64 |
| --- | --- | --- |
| adb | ✔ | ✗ |
| rknn_server | ✔ | ✗ |
| rknn runtime | ✔ | ✔ |

The difference when using x86 or ARM64:

The major difference is on using debugging function, such as accuracy analysis or inference, ARM64 is installed on ARM64 Linux, then using these functions mentioned above, only need to ensure that the librknnrt.so is located on '/usr/lib64'. Since the ARM64 does not support adb, it only works on current board. But x86 requires updating and utilizing the rknn_server and ensure that adb is available for using these debugging functions and connecting to other board if required.

Apart from that, x86 and ARM64 might have performance difference when it comes to accuracy analysis or quantizing.

Note: For RK2118 development environment preparation, please refer to 《01_RKNN2_RK2118_QuickStart_V2.5.0》.

### 1.2.1 Installing RKNN-Toolkit2

This chapter provides two methods for installing RKNN-Toolkit2: Docker and Pip. Users can choose either method according to their preferences.

#### 1.2.1.1 INSTALLATION VIA DOCKER

##### 1.2.1.1.1 Install Docker

Users who have already installed Docker can skip this step. For users who haven't installed Docker, please follow the official manual for installation. Official Docker installation manual link: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

Note: Make sure to add the user to the docker group.

```text
# Create docker group
sudo groupadd docker
# Add the current user to the docker group
sudo usermod -aG docker $USER
# Update and activate the docker group
newgrp docker
# Verify that sudo is not needed to execute docker commands
docker run hello-world
```

If it works, the results are as follows:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest
Hello from Docker!
```

##### 1.2.1.1.2 Image Preparation

This section introduces two methods for preparing the RKNN-Toolkit2 image environment, and either one can be chosen.

**1. Creating an image environment via Dockerfile**

In the docker/docker_file folder of the RKNN-Toolkit2 project, Dockerfiles for building the RKNN- Toolkit2 development environment are provided. Users create the image with the Docker command as follows.

```text
# Note: xx and x.x.x below represent version numbers, please replace them with actual values
cd docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Loading a Docker image with all development environments pre-packaged**

Download the corresponding version of the RKNN-Toolkit2 project file. After decompression, get the Docker image with all development environments pre-packaged in the docker/docker_image folder.

Network disk download link: https://console.zbox.filez.com/l/I00fc3. Extraction code: rknn

Execute the following command to load the image file corresponding to the Python version.

```text
# Note: x.x.x represents the version number of RKNN-Toolkit2, and cpxx represents the Python version number
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

##### 1.2.1.1.3 Querying Image Information

After the image is created or loaded successfully, check the Docker image information:

```text
docker images
```

The relevant RKNN-Toolkit2 image information will be displayed:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

##### 1.2.1.1.4 Running the Image

Execute the following command to run the Docker image, users will enter the bash environment of the image.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb rknn-toolkit2:x.x.x-cpxx /bin/bash
```

Users can map the "examples" folder code into the docker environment by appending the "-v &lt;host src folder&gt;:&lt;image dst folder&gt;" parameter.

```text
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb -v /your/rknn-toolkit2-x.x.x/examples:/examples rknn-
toolkit2:x.x.x-cpxx /bin/bash
```

##### 1.2.1.1.5 Running the Demo

```text
cd examples/onnx/yolov5
python test.py
```

After successfully running the script, the results should be as follows:

```text
class score xmin, ymin, xmax, ymax
--------------------------------------------------
person 0.884 [ 208, 244, 286, 506]
person 0.868 [ 478, 236, 559, 528]
person 0.825 [ 110, 238, 230, 534]
person 0.339 [ 79, 353, 122, 516]
bus 0.705 [ 92, 128, 554, 467]
```

#### 1.2.1.2 INSTALLATION VIA PIP

##### 1.2.1.2.1 Install Python Environment

If the Python environment is already installed, users can skip this step.

```text
sudo apt-get update
sudo apt-get install python3 python3-dev python3-pip
sudo apt-get install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc
```

If users want to install the RKNN-Toolkit2 in the local environment (non-Conda virtual environment), please proceed to step 2.1.2.4 after installing Python successfully.

##### 1.2.1.2.2 Install Conda Tool

If there are multiple versions of Python installed on the system, it is recommended to use Conda to manage the Python environment.

Check whether Conda is installed and the version. If it is already installed, users can skip this step.

```text
conda -V
# Prompt conda: command not found means conda is not installed.
# Successful installation will display the version such as: conda X.X.X
# X.X.X means version number, such as 23.9.0.
```

Download the Conda installation package:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
```

Install Conda:

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

ARM64 version:

Download the Conda installation package:

```text
wget -c https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh
```

Install Conda:

```text
chmod 777 Miniforge3-Linux-aarch64.sh
bash Miniforge3-Linux-aarch64.sh
```

##### 1.2.1.2.3 Create RKNN-Toolkit2 Conda Environment

Enter the Conda base environment:

```text
source ~/miniforge3/bin/activate # Miniforge install directory path
# (base) xxx@xxx-pc:~$
```

Create a Conda environment named "RKNN-Toolkit2" with Python 3.8 version (recommand version):

```text
conda create -n RKNN-Toolkit2 python=3.8
```

Enter the 'RKNN-Toolkit2' Conda environment:

```text
conda activate RKNN-Toolkit2
# (RKNN-Toolkit2) xxx@xxx-pc:~$
```

##### 1.2.1.2.4 Install RKNN-Toolkit2

After activating the 'RKNN-Toolkit2' Conda environment, you can install RKNN-Toolkit2 using either the pip source or a local wheel package: - Install via pip source

```text
pip install rknn-toolkit2 -i https://pypi.org/simple

# If RKNN-Toolkit2 is already installed, you can upgrade it with the following command:
pip install rknn-toolkit2 -i https://pypi.org/simple --upgrade
```

Install via local wheel package

```text
# Please choose the appropriate requirements file based on the Python version and processor architecture:
# where cpxx is the Python version
pip install -r /rknn-toolkit2/packages/x86_64/requirements_cpxx.txt
# pip install -r /rknn-toolkit2/packages/arm64/arm64_requirements_cpxx.txt

# Install RKNN-Toolkit2
# Please choose the appropriate wheel package file based on the Python version and processor architecture:
# where x.x.x is the RKNN-Toolkit2 version number, cpxx is the Python version
pip install /rknn-toolkit2/packages/x86_64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_x86_64.manylinux2014_x86_64.whl
# pip install /rknn-toolkit2/packages/arm64/rknn_toolkit2-x.x.x-cpxx-cpxx-
manylinux_2_17_aarch64.manylinux2014_aarch64.whl
```

If no error occurs after executing the following command, the installation is successful.

```text
$ python
>>> from rknn.api import RKNN
```

### 1.2.2 NPU Device Environment Setup

#### 1.2.2.1 NPU DRIVER VERSION CONFIRMATION

Query commands:

```text
dmesg | grep -i rknpu
# or
cat /sys/kernel/debug/rknpu/version
# or
cat /sys/kernel/debug/rknpu/driver_version
# or
cat /proc/debug/rknpu/driver_version
```

Query results:

```text
RKNPU driver: vX.X.X
```

X.X.X means version number such as 0.9.2.

Rockchip's firmware comes with RKNPU driver pre-installed. If the above commands cannot query the NPU driver version, it may be that the third-party firmware has not installed the RKNPU driver. Open the kernel config file with the "CONFIG_ROCKCHIP_RKNPU=y" option, recompile the kernel driver and flash it. It is recommended that the RKNPU driver version is &gt;= 0.9.2.

#### 1.2.2.2 NPU DEVICE CONNECTION ENVIRONMENT CONFIRMATION

The PC-to-board debugging function of RKNN-Toolkit2 requires the RKNN Server on the development side. It is a background proxy service running on the device, responsible for receiving commands and data transmitted from the computer via USB, executing the corresponding interfaces, and returning results to the computer. Therefore, it needs to be confirmed whether the device has started the RKNN Server.

Note: ARM64 does not need to use RKNN Server for debugging, skipping this step if you were using ARM64 for RKNN Toolkit2.

Check if there is an RKNN Server process running on the development board.

```text
adb shell
ps | grep rknn_server
```

Query results:

```text
702 root 1192 S grep rknn_server
```

If the RKNN Server process id is queried, it means RKNN Server starts normally. If the RKNN Server process id is not queried, execute the following command to manually start RKNN Server and then query.

Manually start RKNN Server on Android:

```text
su
setenforce 0
nohup /vendor/bin/rknn_server >/dev/null&
```

RK356X/RK3576/RK3588/RV1126B Linux system to start RKNN Server manually:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

RV1103/RV1103B/RV1106/RV1106B Linux system to start RKNN Server manually:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

Generally speaking, Rockchip's firmwares integrate RKNN Server which starts automatically during boot-up. If there is no automatic startup or no relevant files for manual startup, please install or update RKNN Server manually.

#### 1.2.2.3 RKNN SERVER INSTALLATION AND UPDATE

The board-connected debugging feature of RKNN-Toolkit2 requires the RKNPU2 environment to be installed on the board and the RKNN Server service to be started. The following are two fundamental concepts of the RKNPU2 environment:

1. RKNN Server: A background proxy service running on the development board. It receives the data transmitted from the PC via USB, executes the corresponding interface of the on-board Runtime, and returns the results to the PC.

2. RKNPU2 Runtime library

librknnrt.so: The Runtime library for RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B boards.

librknnmrt.so: The Runtime library for RV1103 / RV1103B / RV1106 / RV1106B boards.

If RKNN Server is not installed on the board, the Runtime library does not exist, or the versions of RKNN Server and the Runtime library are inconsistent, you need to reinstall or update them.

Note:

1. If an RKNN model with dynamic dimension input is used, the versions of RKNN Server and the RKNPU2 Runtime library must be &gt;= 1.5.0.

2. If a model larger than 2 GB is used, the rknn_server version must be &gt;= 2.0.0b0.

3. On small-memory platforms such as RV1103 / RV1103B / RV1106 / RV1106B, it is recommended to use rknn_server version &gt;= 2.1.0.

4. Make sure the versions of RKNN Server, the Runtime library, and RKNN-Toolkit2 are consistent; it is recommended to install the latest versions of all of them.

5. The RKNN Server in RK2118 is not used for the board-connected debugging feature of RKNN- Toolkit2; it is the service for the DSP to interact with the MCU.

6. The ARM64 version does not depend on RKNN Server, so there is no need to start or update it. However, the debugging feature depends on the on-board RKNPU2 Runtime library, so make sure this library exists on the board and is updated to the latest version.

##### 1.2.2.3.1 RK356X/RK3576/RK3588/RV1126B Platform

1. Android system

Check the versions of the RKNN Server and the librknnrt.so library. If the version numbers are inconsistent, update them to the same version.

```text
# Query the rknn_server version
strings /vendor/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
# 64-bit system
strings /vendor/lib64/librknnrt.so | grep -i "librknnrt version"
# 32-bit system
strings /vendor/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

Update the RKNN Server and the librknnrt.so library.

```text
adb root
adb remount

# 64-bit system:
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64

# 32-bit system:
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib

# Restart the RKNN Server:
adb shell
su
chmod +x /vendor/bin/rknn_server
nohup /vendor/bin/rknn_server >/dev/null&
sync
reboot
```

2. Linux system

Check the versions of the RKNN Server and the librknnrt.so library. If they are inconsistent, update them to the same version.

```text
# Query the rknn_server version
strings /usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnrt.so library version
strings /usr/lib/librknnrt.so | grep -i "librknnrt version"
# Display the librknnrt library version as X.X.X
# librknnrt version: X.X.X
```

Update the RKNN Server and the librknnrt.so library.

64-bit system:

```text
adb push runtime/Linux/rknn_server/aarch64/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib64
```

32-bit system:

```text
adb push runtime/Linux/rknn_server/armhf/usr/bin/* /usr/bin
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

Restart the RKNN Server:

```text
adb shell
chmod +x /usr/bin/rknn_server
nohup /usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

##### 1.2.2.3.2 RV1103/RV1103B/RV1106/RV1106B Platform

Check the versions of the RKNN Server and the librknnmrt.so library. If they are inconsistent, update them to the same version.

```text
# Query the rknn_server version
strings /oem/usr/bin/rknn_server | grep -i "rknn_server version"
# Display the rknn_server version as X.X.X
# rknn_server version: X.X.X

# Query the librknnmrt.so library version
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
# Display the librknnmrt library version as X.X.X
# librknnmrt version: X.X.X
```

Update the RKNN Server and the librknnmrt.so library. RV1103 / RV1103B and RV1106 / RV1106B use the same RKNN Server and librknnmrt.so library.

```text
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/* /oem/usr/bin
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib

# Restart the RKNN Server:
adb shell
chmod +x /oem/usr/bin/rknn_server
nohup /oem/usr/bin/rknn_server >/dev/null&
restart_rknn.sh
```

#### 1.2.2.4 VIEW DETAILED RKNN SERVER LOGS

##### 1.2.2.4.1 Android System

Enter the device terminal and set the log level:

```text
adb shell
su
setenforce 0
setprop persist.vendor.rknn.server.log.level 5
```

Kill the current RKNN Server service process:

```text
kill -9 `pgrep rknn_server`
```

If the RKNN Server does not restart automatically, users can start it manually and view detailed logs:

```text
nohup /vendor/bin/rknn_server >/dev/null&
logcat
```

##### 1.2.2.4.2 Linux System

Enter the device terminal and set the log level:

```text
adb shell
export RKNN_SERVER_LOGLEVEL=5
```

Restart the RKNN Server to view detailed logs:

For the RK356X / RK3576 / RK3588 / RV1126B platform, run the following command:

```text
nohup /usr/bin/rknn_server >/dev/null&
```

For the RV1103 / RV1103B / RV1106 / RV1106B platform, run the following commands:

```text
nohup /oem/usr/bin/rknn_server >/dev/null&
```

### 1.2.3 Environment Verification

After the environment is set up, it is recommended to verify that all components are ready as follows:

**1. Verify the RKNN-Toolkit2 installation**

```text
# Enter Python interactive mode and import the RKNN class
python
>>> from rknn.api import RKNN
# No error means the installation succeeded
```

**2. Verify device connection**

```text
# Query adb-connected devices on the PC
adb devices
# The connection is normal if device IDs are listed
```

Note: The ARM64 version of Toolkit2 does not support adb; the debugging feature is used locally on the board only, so this step does not need to be verified.

**3. Verify the on-board environment**

Check whether the NPU driver version, RKNN Server process status, and Runtime library are ready. For checking, installation, and update methods, see 1.2.2 Device-side NPU Environment Preparation.

**4. Query component versions**

When troubleshooting, you can query the version information of each component as follows:

```text
# Query the RKNN-Toolkit2 version
pip list | grep rknn-toolkit2

# Query the on-board rknn_server version (paths subject to 1.2.2)
strings /usr/bin/rknn_server | grep -i "rknn_server version"

# Query the on-board Runtime library version (RK356X / RK3576 / RK3588 / RV1126B platforms, path subject to 1.2.2)
strings /usr/lib64/librknnrt.so | grep -i "librknnrt version"

# Query the on-board Runtime library version (RV1103 / RV1103B / RV1106 / RV1106B platforms)
strings /oem/usr/lib/librknnmrt.so | grep -i "librknnmrt version"
```

Note: The RKNN model file records the Toolkit2 version used during conversion. When troubleshooting abnormal on-board running, compare the model conversion version with the on-board Runtime library version to check whether they are consistent.

{% endraw %}
