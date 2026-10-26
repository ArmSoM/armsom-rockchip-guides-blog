---
title: "Rockchip Debian Docker 交叉编译"
description: "Rockchip Debian Docker 交叉编译 — V1.2.1"
excerpt: "Rockchip Debian Docker 交叉编译"
translation_key: "187-rockchip-debian-docker"
slug: "187-rockchip-debian-docker"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Debian Docker 交叉编译

ArmSoM 平台参考，依据对应中英文 Rockchip 原稿；具体板卡、SoC、SDK/BSP、内核及外设需逐项匹配，不代表所有 ArmSoM 板卡支持。原稿示例和测试结果不是 ArmSoM 实测，未执行命令或硬件验证。

Ubuntu PC 上构建 Debian 多架构 deb 包；包版本表保留原文历史版本。

来源及疑点：中英均 V1.2.1，全部技术章节保留；没有独立技术配图。中文占位符为 `<package_dir>`/`<pkg_dev>`，英文为 `<package dir>`/`<package-name>`，各自保留，俄德按英文。英文带空格占位符不是可直接执行路径。中文示例 `rockchip 。`、提示符全角冒号为原稿写法，保留而不宣称可运行。仅接回排版断行（`dpkg-buildpackage` 等）。旧 Ubuntu、安装包名和“最新”均指原稿时期；容器可移植性仍依赖架构、内核及设备，不是任意 Linux 都可运行。

| 软件包 | 版本 | 系统 |
| --- | --- | --- |
| glmark2 | 2021.02 | Debian |
| gst-plugins-base | 1.14.4/1.18.5 | Debian |
| gstreamer-rockchip | 1.14.4 | Debian |
| libdrm | 2.4.97/2.4.104 | Debian |
| libdrm-cursor | 1.4.0 | Debian |
| libmali | 1.9.0 | Debian |
| mpp | 1.5.0 | Debian |
| libv4l-rkmpp | 1.5.0 | Debian |
| openbox | 3.6.1 | Debian |
| pcmanfm | 1.2.5 | Debian |
| rga | 2.1.0/2.2.0 | Debian |
| rkisp | 2.2.0 | Debian |
| rkaiq | 5.0 | Debian |
| xserver | 1.20.4/1.20.11 | Debian |
| wifibt | 1.0.0 | Debian |
| rktoolkit | 1.0.0 | Debian |

## 1. Rockchip Docker

Docker 是一个旨在让使用容器更轻松地创建、部署和运行应用程序的工具。Docker 容器允许开发人员将应用程序及其所需的所有部分打包在一起,例如库和其他依赖项,并将其作为一个包发送出去。通过这样做,开发人员可以放心,该应用程序将在任何其他 Linux 设备上运行,而不管该设备可能具有的用于与编写和测试代码的机器不同的任何自定义设置。在某种程度上,Docker 有点像虚拟机。但与虚拟机不同的是,Docker 不是创建一个完整的虚拟操作系统,而是允许应用程序使用与它们运行的系统相同的 Linux 内核,并且只需要应用程序附带尚未在主机上运行的组件。这显着提高了性能并减小了应用程序的大小。重要的是,Docker 是 开源的。这意味着任何人都可以为 Docker 做出贡献并扩展它以满足自己的需求。Rockchip Docker可以参考第三方网站docker-rockchip。

## 2. 操作系统要求

要安装 Docker,您需要以下任一版本的 64 位Ubuntu 系统:Jammy 22.04 (LTS)；Focal 20.04 (LTS)；Bionic 18.04 (LTS)；Xenial 16.04 (LTS)；Trusty 14.04 (LTS)注意:dockerfile 默认用于 ARM 64位芯片。以下用于ARM 32位芯片:

```text
cp dockerfile-32 dockerfile
```

### 2.1 安装 Docker

使用此命令安装最新版本的 Docker(在 ubuntu 14.04 中将 docker 替换为docker.io):

```text
sudo apt-get install docker qemu-user-static binfmt-support
```

开始运行 Docker 守护进程:

```text
sudo service docker start
```

通过 dockerfile 构建 Docker 镜像:

```text
sudo docker build -t rockchip .
```

即可得到一个名为“rockchip”的 Docker 镜像,其中包含一个 Debian 多架构交叉编译环境。

### 2.2 构建应用

进入Docker环境:

```text
sudo docker run -it -v <package_dir>:/home/rk/packages rockchip /bin/bash
```

开始构建:对于 ARM 32位芯片:

```text
cd /home/rk/packages/<pkg_dev>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarmhf
ls ../ | grep *.deb
```

对于 ARM 64位芯片:

```text
cd /home/rk/packages/<pkg_dev>
DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
ls ../ | grep *.deb
```

### 2.3 修改Docker镜像

如果您想要修改 Docker 镜像,可以通过下面的命令:

```text
sudo docker run -it rockchip /bin/bash
```

从容器退出后,使用如下的命令来保存你的更改。

```text
sudo docker commit <container_id> rockchip
```

## 3. 其他

要获取有关 docker 的更多信息,请查看以下链接:https://docs.docker.com

## 4. 实例

如何在 libmali上生成 libmali-bifrost-g52-g2p0-x11_1.9-1_arm64.deb

```text
~/work/docker/docker-rockchip$sudo service docker start
~/work/docker/docker-rockchip$sudo docker build -t rockchip 。
~/work/docker/docker-rockchip$sudo docker run -it -v /home/wxt/work:/home/rk/packages rockchip /bin/bash
rk@2888134f9c12：/$ cd /home/rk/packages/docker/libmali
rk@2888134f9c12:~/packages/docker/libmali$ DEB_BUILD_OPTIONS=nocheck dpkg-buildpackage -rfakeroot -b -d -uc -us -aarm64
```

上述步骤将获得 ~/packages/docker/ 的 debs可获取一些第三方仓库编译生成 deb 包,比如:glmark2、libmali、mpp、rga、rkwifbt、gstreamer-rockchip

## 相关原稿链接

[ArmSoM Docs](https://docs.armsom.org/)

[https://github.com/docker/docker](https://github.com/docker/docker)

[https://opensource.com/resources/what-open-source](https://opensource.com/resources/what-open-source)

[https://github.com/Fruit-Pi/docker-rockchip](https://github.com/Fruit-Pi/docker-rockchip)

[https://docs.docker.com/](https://docs.docker.com/)

[https://github.com/Fruit-Pi/libmali](https://github.com/Fruit-Pi/libmali)

[https://salsa.debian.org/games-team/glmark2](https://salsa.debian.org/games-team/glmark2)

[https://github.com/Fruit-Pi/mpp](https://github.com/Fruit-Pi/mpp)

[https://github.com/Fruit-Pi/linux-rga](https://github.com/Fruit-Pi/linux-rga)

[https://github.com/Fruit-Pi/rkwifibt](https://github.com/Fruit-Pi/rkwifibt)

[https://github.com/Fruit-Pi/gstreamer-rockchip](https://github.com/Fruit-Pi/gstreamer-rockchip)

{% endraw %}
