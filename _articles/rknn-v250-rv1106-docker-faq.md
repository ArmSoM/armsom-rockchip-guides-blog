---
title: "RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references"
description: "RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references · RKNN2 V2.5.0"
excerpt: "RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references"
translation_key: "rknn-v250-rv1106-docker-faq"
slug: "rknn-v250-rv1106-docker-faq"
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

[RV1103/RV1106 RKNN quickstart 3: host environment and Mini Runtime](/articles/rknn-v250-rv1106-host-runtime/)

[RV1103/RV1106 RKNN quickstart 4: YOLOv5 conversion, Python and C deployment](/articles/rknn-v250-rv1106-yolov5/)

**RV1103/RV1106 RKNN quickstart 5: Docker, first-run issues and references**

{% raw %}

## 5. Run the RKNN Python Demo in Docker (Optional)

If you do not want to install the RKNN-Toolkit2 environment directly on the computer, you can use a Docker image containing the RKNN-Toolkit2 environment to run the RKNN Python Demo.

Note: The Docker image in this chapter contains only the RKNN-Toolkit2 environment and is mainly used to run the RKNN Python Demo. The board-side RKNPU2 environment still needs to be prepared according to Section 3.3.

### 5.1 Install Docker

If Docker is already installed, skip this section. Otherwise, refer to the Docker official installation guide: https://docs.docker.com/install/linux/docker-ce/ubuntu/.

After installation, add the current user to the docker user group:

```text
# Create the docker group
sudo groupadd docker

# Add the current user to the docker group
sudo usermod -aG docker $USER

# Activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

When successful, output similar to the following is displayed:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 Prepare the RKNN-Toolkit2 Docker Image

You can either build an image from a Dockerfile or load a packaged Docker image file.

#### 5.2.1 Build an Image from a Dockerfile

The docker/docker_file directory in the RKNN-Toolkit2 project provides Dockerfiles:

```text
# xx and x.x.x represent version numbers. Replace them with the actual values
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx

docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

#### 5.2.2 Load a Packaged Image

Docker image download link: https://console.zbox.filez.com/l/I00fc3 (Extraction code: rknn ).

Run:

```text
# x.x.x is the RKNN-Toolkit2 version, and cpxx is the Python version

docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.3 Check the Image

```text
docker images
```

Reference output:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Run the RKNN Python Demo in the Container

First, prepare RKNN Model Zoo locally according to Section 1.5, and then map the directory and USB device into the container:

```text
# -v <host src folder>:<image dst folder> maps a local directory into the container

docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v "$HOME/Projects/rknn_model_zoo:/rknn_model_zoo" \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

After entering the container, prepare the model:

```text
cd /rknn_model_zoo/examples/yolov5/model
./download_model.sh
```

Convert the model:

```text
cd /rknn_model_zoo/examples/yolov5/python
python convert.py ../model/yolov5s_relu.onnx rv1106 i8 ../model/yolov5s_relu.rknn
```

Run the RKNN Python Demo:

```text
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rv1106
```

After the script runs successfully, the output is similar to the following. class is the predicted class, score is the confidence score, (xmin, ymin) is the upper-left coordinate of the detection box, and (xmax, ymax) is the lower-right coordinate.

```text
# class @ (xmin, ymin, xmax, ymax) score
person @ (209 243 286 510) 0.880
person @ (479 238 560 527) 0.871
person @ (109 238 231 534) 0.840
bus @ (91 129 555 464) 0.692
```

## 6. Common First-Run Issues and Next Steps

This chapter covers only the most common connection, Server, and memory issues encountered during the first run. For more information about tool installation, model conversion, and systematic troubleshooting, refer to RKNN2_SDK_Development_Guide. For API-related issues, refer to RKNN2_Toolkit_Python_API_Reference, RKNN2_Toolkit_Lite_Python_API_Reference, or RKNN2_Runtime_C_API_Reference according to the interface being used.

### 6.1 Device Cannot Be Recognized

If no device is displayed by adb devices , check the following in order:

1. Check whether the cable is connected correctly, and reconnect it.

2. Try another USB port on the computer.

3. Replace the data cable.

4. When connecting the development board through USB, make sure that only one ADB Server is running between the local computer and the Docker container. If you need to connect the development board from a Docker container, first run the following command on the local computer:

```text
adb kill-server
```

If the following error is displayed, ADB is not installed on the system:

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

Install it using:

```text
sudo apt install adb
```

### 6.2 rknn_server Does Not Start Correctly

The on-board debugging feature of RKNN-Toolkit2 requires the RKNPU2 environment to be installed on the board and rknn_server to run correctly. On some development board systems, rknn_server is not started automatically at boot. In this case, running the RKNN Python Demo may produce:

```text
E init_runtime: The rknn_server on the concected device is abnormal.
```

Start it manually:

```text
adb shell
restart_rknn.sh
```

If the problem persists, return to 3.3.2 Check RKNPU2 Mini Runtime and Server to check the components and versions.

### 6.3 Insufficient Memory Causes Model Loading Failure

RV1103/RV1103B/RV1106/RV1106B development boards have limited memory. If the rkipc process is already running on the board, model loading may fail with the following error:

```text
E init_runtime: Exception: RKNN init failed. error code: RKNN_ERR_MODEL_INVALID
```

Enter the board and terminate the rkipc process:

```text
adb shell

# View the currently running processes and find the PID corresponding to rkipc
top

# Terminate the rkipc process
kill -9 PID
```

### 6.4 Next-Step Documentation

After completing the first run, refer to the corresponding primary document for subsequent development tasks instead of continuing to look for complete development flows, API descriptions, or advanced configuration in this Quick Start.

| Search Need / Learning Goal | Recommended Reference |
| --- | --- |
| RK3588 and other platforms: First-time<br>RKNN2 SDK environment setup, model<br>conversion, and deployment verification | RKNN2_SDK_QuickStart |
| RK2118 platform: First-time RKNN2 SDK<br>environment setup, model conversion, and<br>deployment verification | RKNN2_RK2118_QuickStart |
| End-to-end development: RKNN2 software<br>stack architecture, model conversion and<br>quantization, accuracy/performance analysis,<br>complete deployment, and troubleshooting | RKNN2_SDK_Development_Guide |
| PC-side model conversion and analysis:<br>RKNN-Toolkit2 Python API methods,<br>parameters, and return values | RKNN2_Toolkit_Python_API_Reference |
| Lightweight board-side Python<br>deployment: RKNN-Toolkit-Lite2 Python API<br>methods, parameters, and return values | RKNN2_Toolkit_Lite_Python_API_Reference |
| Board-side C/C++ deployment: Board-side<br>C APIs, structures, enumerations, error codes,<br>and Mini Runtime related interfaces | RKNN2_Runtime_C_API_Reference |
| Model compatibility evaluation: RKNN<br>supported operator list and related<br>constraints | RKNN2_Supported_Operators_and_Constraints_Reference |

Note: This document is intended for RV1103/RV1103B/RV1106/RV1106B. The board-side runtime library used throughout this guide is RKNPU2 Mini Runtime ( librknnmrt.so ). RKNN2_Runtime_C_API_Reference is the document name for the Runtime C API reference. When using it, select the interfaces applicable to the current platform and SDK version.

{% endraw %}
