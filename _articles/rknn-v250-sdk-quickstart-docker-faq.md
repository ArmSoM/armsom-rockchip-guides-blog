---
title: "RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references"
description: "RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references · RKNN2 V2.5.0"
excerpt: "RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references"
translation_key: "rknn-v250-sdk-quickstart-docker-faq"
slug: "rknn-v250-sdk-quickstart-docker-faq"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Scope: RKNN2 V2.5.0 platform reference covering RK3562, the RK3566/3568/3576/3588 series and RV1126B. An ArmSoM board with the same SoC still needs a matching BSP, NPU driver and Runtime; do not copy Rockchip EVB power, USB or firmware assumptions directly. Host and driver requirements are listed below. No ArmSoM hardware validation was performed.

Adapted from the local Chinese and English V2.5.0 sources, retaining section numbers. Chinese uses Chinese figures; English, Russian and German use English-source figures. PDF wraps, continued tables and code indentation are restored. Example outputs are not ArmSoM tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN2 V2.5.0 quickstart 1: deployment flow, platforms and SDK repositories](/articles/rknn-v250-sdk-quickstart-deployment-flow/)

[RKNN2 V2.5.0 quickstart 2: hardware connection and ADB checks](/articles/rknn-v250-sdk-quickstart-hardware/)

[RKNN2 V2.5.0 quickstart 3: Toolkit, Android/Linux Runtime and compilers](/articles/rknn-v250-sdk-quickstart-environment/)

[RKNN2 V2.5.0 quickstart 4: MobileNet conversion and deployment](/articles/rknn-v250-sdk-quickstart-mobilenet/)

[RKNN2 V2.5.0 quickstart 5: YOLOv5 detection and accuracy evaluation](/articles/rknn-v250-sdk-quickstart-yolov5/)

**RKNN2 V2.5.0 quickstart 6: Docker, startup issues and references**

{% raw %}

## 5. Run RKNN Python Demo in Docker (Optional)

If you need to run the RKNN Python Demo in a Docker environment, please refer to the content in this chapter to prepare the development environment.

Please note that here we provide a Docker image containing the RKNN-Toolkit2 environment, allowing users to directly run the RKNN Python Demo without worrying about environment installation issues. However, this Docker image only includes a clean RKNN-Toolkit2 environment and is specifically designed for running the RKNN Python Demo.

### 5.1 Install Docker

If Docker is already installed, you can skip this step. If it is not installed, please follow the official documentation for installation.

Docker installation official documentation link: https://docs.docker.com/install/linux/docker- ce/ubuntu/

Note: It is necessary to add the user to the 'docker' group.

```text
# Create the docker group
sudo groupadd docker

# Add the current user to the docker group
sudo usermod -aG docker $USER

# Update to activate the docker group
newgrp docker

# Verify that docker commands can be executed without sudo
docker run hello-world
```

The reference output for successful installation is as follows:

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete
Digest: sha256:88ec0acaa3ec199d3b7eaf73588f4518c25f9d34f58ce9a0df68429c5af48e8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
```

### 5.2 Prepare the RKNN-Toolkit2 Image

This section introduces two methods for creating the RKNN-Toolkit2 image environment. You can choose either method.

**1. Create the RKNN-Toolkit2 image using a Dockerfile**

In the RKNN-Toolkit2 project, the docker/docker_file folder provides a Dockerfile for building the RKNN-Toolkit2 development environment. Users can create an image using the docker build command, as shown below:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Create the RKNN-Toolkit2 image by loading a pre-packaged Docker image file**

Download the RKNN-Toolkit2 project files for the corresponding version from the following link. After extracting the files, the docker/docker_image folder provides a pre-packaged Docker image with all development environments.

Docker image file cloud drive download link: https://console.zbox.filez.com/l/I00fc3 (extraction code: rknn)

Execute the following command to load the image file for the corresponding Python version.

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

After the image is successfully created or loaded, you can view the Docker image information using the following command:

```text
docker images
```

The corresponding RKNN-Toolkit2 image information is displayed as follows:

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Run the RKNN Python Demo in Docker

Note: Please ensure that the board has the RKNPU2 environment installed. If not, please refer to Section 3.3 for installation instructions.

**1. Map the files and run the container**

Please refer to Section 1.5 to download the RKNN Model Zoo project locally. Then, map it into the container and run the container using the docker run command. After running, you will enter the container's bash environment. Refer to the following commands:

```text
# Use the docker run command to create and run the RKNN-Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rknn_model_zoo:/rknn_model_zoo \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

**2. Prepare the model and convert it in the container**

After entering the container, follow the steps in Section 4.2.1 to download and convert the YOLOv5 model inside the container.

**3. Run the RKNN Python Demo in the container**

Follow the steps in Section 4.2.2 to run the RKNN Python Demo. Refer to the following command:

```text
# Switch to the rknn_model_zoo/examples/yolov5/python directory
cd rknn_model_zoo/examples/yolov5/python

# Run the yolov5.py script to run the yolov5 model on the board
# Usage: python yolov5.py --model_path {rknn_model} --target {target_platform}
# Note: Here, we use rk3588 as an example platform. If using a different board, modify the platform type in the command accordingly.
python yolov5.py --model_path ../model/yolov5s_relu.rknn --target rk3588
```

Note: When using USB to connect the development board, please ensure that only one adb server service is running on the local computer and the Docker container at the same time. If you need to connect the development board in a Docker container, execute the command adb kill-server in the computer's terminal to terminate the adb server service on the local computer.

## 6. Common Startup Issues and Next Steps

This chapter lists the issues that may be encountered during the first run and the corresponding troubleshooting methods. For the complete FAQ, model conversion issues, accuracy issues, performance issues, and memory issues, please refer to Chapter 10 "FAQ" of the RKNN2 SDK Development Guide document.

### 6.1 adb devices Shows No Device

You can try the following methods to resolve this issue:

1. Check if the connection is correct, reconnect the data cable, try using a different USB port on the computer, or replace the data cable.

2. When using USB to connect the development board, please ensure that only one adb server service is running on the local computer and the Docker container at the same time. For example, if you need to connect the development board in a Docker container, execute the command adb kill-server in the computer's terminal to terminate the adb server service on the local computer.

3. If you encounter the following error, it indicates that adb is not installed. You need to execute the installation command sudo apt install adb to install adb.

```text
command 'adb' not found, but can be installed with:
sudo apt install adb
```

### 6.2 Manually Start the rknn_server Service

The on-board debugging feature of RKNN-Toolkit2 requires the board to have the RKNPU2 environment installed and the rknn_server service running.

However, some development boards may not have the rknn_server service started by default after power on or reboot. This can result in errors such as E init_runtime: The rknn_server on the connected device is abnormal when running the RKNN Python Demo. In such cases, please refer to Section 3.3.2 for details on manually starting the rknn_server service.

### 6.3 Document Navigation

After completing the first run, please enter the corresponding main document according to your task, instead of looking for the complete API or advanced configuration in this quick start.

| Content to explore further | Main document / entry |
| --- | --- |
| Complete RKNN-Toolkit2 installation, model conversion, and<br>quantization configuration | RKNN2 SDK Development Guide |
| Toolkit methods, parameters, and return values (Python API) | RKNN2 SDK Development Guide |
| Runtime C API reference | RKNN2 Runtime C API Reference |
| Toolkit installation / NPU environment / model conversion /<br>model evaluation FAQ | RKNN2 SDK Development Guide |
| Model accuracy analysis (accuracy_analysis) | RKNN2 SDK Development Guide |
| Docker-based RKNN-Toolkit2 installation | RKNN2 SDK Development Guide |
| Usage of each model example in RKNN Model Zoo | rknn_model_zoo/examples/&lt;model_name&gt;/README.md |

{% endraw %}
