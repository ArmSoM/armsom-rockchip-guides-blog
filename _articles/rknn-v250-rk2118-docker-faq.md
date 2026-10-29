---
title: "RK2118 NPU quickstart, part 5: Docker, FAQ and references"
description: "RK2118 NPU quickstart, part 5: Docker, FAQ and references · RKNN2 V2.5.0"
excerpt: "RK2118 NPU quickstart, part 5: Docker, FAQ and references"
translation_key: "rknn-v250-rk2118-docker-faq"
slug: "rknn-v250-rk2118-docker-faq"
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

**RK2118 quickstart series · 5/5**

[RK2118 NPU quickstart, part 1: hardware, connections and serial console](/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation](/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware](/articles/rknn-v250-rk2118-firmware/)

[RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results](/articles/rknn-v250-rk2118-model-demo/)

**RK2118 NPU quickstart, part 5: Docker, FAQ and references**

<!-- rk2118-series:end -->

{% raw %}

## 5. RKNN Model Conversion in Docker (Optional)

If you need to run the RKNN Python Demo in a Docker environment, please refer to the content in this chapter to prepare the development environment.

Please note that here we provide a Docker image containing the RKNN-Toolkit2 environment, allowing users to directly run RKNN Python Demo without worrying about environment installation issues. However, this Docker image only includes a clean RKNN-Toolkit2 environment and is specifically designed for running RKNN Python Demo.

This chapter is divided into three parts:

- Install Docker

- Install the RKNN-Toolkit2 Environment in Docker

- How to Run RKNN Python Demo

### 5.1 Install Docker

If Docker is already installed, you can skip this step. If it is not installed, please follow the official documentation for installation.

Docker installation official documentation link: https://docs.docker.com/install/linux/docker-ce/ubuntu/

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

### 5.2 Install the RKNN-Toolkit2 Environment in Docker

#### 5.2.1 Prepare the RKNN-Toolkit2 Image

This section introduces two methods for creating the RKNN-Toolkit2 image environment. You can choose either method.

**1. Create the RKNN Toolkit2 image using a Dockerfile**

In the RKNN-Toolkit2 project, the 'docker/docker_file' folder provides a Dockerfile for building the RKNN-Toolkit2 development environment. Users can create an image using the 'docker build' command, as shown below:

```text
# Note: Replace 'xx' and 'x.x.x' with the actual version numbers
cd Projects/rknn-toolkit2/rknn-toolkit2/docker/docker_file/ubuntu_xx_xx_cpxx
docker build -f Dockerfile_ubuntu_xx_xx_for_cpxx -t rknn-toolkit2:x.x.x-cpxx .
```

**2. Create the RKNN Toolkit2 image by loading a pre-packaged Docker image file**

Download the RKNN-Toolkit2 project files for the corresponding version from the following link. After extracting the files, the 'docker/docker_image' folder provides a pre-packaged Docker image with all the development environments.

Download link from the cloud drive: https://console.zbox.filez.com/l/I00fc3 ( Extraction code: rknn)

Execute the following command to load the corresponding Python version of the image file.

```text
# Note: Replace 'x.x.x' with the actual version number of RKNN-Toolkit2, and 'cpxx' with the Python version
docker load --input rknn-toolkit2-x.x.x-cpxx-docker.tar.gz
```

#### 5.2.2 Query Image Information

After successfully creating or loading an image, you can view Docker image information using the following command:

```text
docker images
```

The corresponding RKNN-Toolkit2 image information is displayed as follows.

```text
REPOSITORY TAG IMAGE ID CREATED SIZE
rknn-toolkit2 x.x.x-cpxx xxxxxxxxxxxx 1 hours ago 5.89GB
```

### 5.3 Model Conversion

- Map the files and run the container

Please refer to Chapter 3.1 for downloading the rt-thread project locally. Then, map it into the container and run the container using the 'docker run' command. After running, it will switch to the container's bash environment. Refer to the following commands:

```text
# Use the docker run command to create and run the RKNN Toolkit2 container
# Map local files into the container by attaching the -v <host src folder>:<image dst folder> parameter
docker run -t -i --privileged \
    -v /dev/bus/usb:/dev/bus/usb \
    -v /Projects/rt-thread:/rt-thread \
    rknn-toolkit2:x.x.x-cpxx \
    /bin/bash
```

- Model Conversion

Switch to the rt-thread/components/rknpu/examples/rknn_benchmark/res directory and run the convert.py script.

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

## 6. FAQ

### 6.1 No adb Device Visible

RK2118 currently does not support debugging via adb, so you will not see any adb devices when using this command.

### 6.2 The role of the rknn_demo_server service

The rknn_demo_server service on RK2118 is not used for board debugging with RKNN-Toolkit2. Instead, it provides the communication service between the DSP and the MCU.

## 7. Reference Documents

- For more detailed usage and interface descriptions of RKNN-Toolkit2 and RKNPU2, please refer to RKNN2_SDK_Development_Guide_V2.5.0.pdf .

- For relevant documents of RK2118, please refer to Rockchip_Developer_Guide_RK2118_CN.pdf .

Note: For supporting documents whose fixed file names are not specified in this guide, use the actual document names in the current SDK release package.

{% endraw %}
