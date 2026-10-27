---
title: "Rockchip Repo 镜像服务器部署指南"
description: "Rockchip Repo 镜像服务器部署指南 — V1.0.0"
excerpt: "Rockchip Repo 镜像服务器部署指南"
translation_key: "209-rockchip-repo-mirror-server"
slug: "209-rockchip-repo-mirror-server"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Gitolite, SDK, Repo]
---

{% raw %}

# Rockchip Repo 镜像服务器部署指南

ArmSoM开发流程参考，依据RK-YH-YF-A00 V1.0.0中英原稿（6/7页）。说明搭建Gitolite服务器及SDK镜像管理。原稿适用表为芯片ALL、内核ALL，属于主机侧管理流程，不代表所有板卡具备某硬件能力。需已有相应SDK仓库访问权限、可用Git/Repo/SSH和服务器管理权限；本文不授予Rockchip服务器访问权。本次只整理文档，未创建账户、修改权限、同步代码或执行命令。

两稿技术内容对应，完整保留5章及FAQ。没有技术配图。原稿 `RW+`、`RW`、`R = @all` 均为权限示例，生产部署前需审查实际访问范围。`credential.helper store` 会把凭据存入磁盘明文文件；保留原文建议仅供追溯，不建议在共享或不可信机器照用。

## 1. 搭建 Gitolite 服务器

创建 Gitolite 账戶

```text
sudo adduser git
sudo usermod -G sudo -a git
```

下载、安装 Gitolite

```text
su git
git clone https://github.com/sitaramc/gitolite
mkdir $HOME/bin
./gitolite/install -to $HOME/bin
```

添加管理员权限git 用戶的 ~/.ssh 目录下应该有两个密钥:RK 密钥:用于从 RK 服务器同步代码Gitolite 密钥:用于 Gitolite 代码权限管理公钥的名称建议为 $username.pub 的形式,方便后续权限添加管理。

```text
./bin/gitolite setup -pk ~/.ssh/$username.pub
```

## 2. 同步 RK 服务器仓库

### 2.1 RK Gitolite 服务器代码同步

以下以 rk3326_linux5.10_release.xml 为例,说明如何同步代码。

```text
# 代码同步应该在 repositories 下进⾏
cd repositories

# 同步 rk3326_linux5.10_release.xml SDK
repo init --mirror --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo \
-u ssh://git@www.rockchip.com.cn/linux/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
# 进⾏代码同步
.repo/repo/repo sync -c

# ⽣成 SDK project 列表，后续添加权限管理需要
.repo/repo/repo list -n > project.list
```

### 2.2 RK Gerrit 服务器代码同步

以下以 rk3562_linux_release.xml 为例,说明如何同步代码。

```text
# 代码同步应该在 repositories 下进⾏
cd repositories

# 同步 rk3562_linux_release.xml SDK
repo init --mirror --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo \
-u https://gerrit.rock-chips.com:8443/linux/rockchip/platform/manifests \
-b rk3562 -m rk3562_linux_release.xml
# 进⾏代码同步
.repo/repo/repo sync -c

# ⽣成 SDK project 列表，后续添加权限管理需要
.repo/repo/repo list -n > project.list
```

## 3. Gitolite 权限管理

Gitolite 服务器通过 gitolite-admin 仓库管理权限,管理员用戶可以通过ssh://git@$HostIP/gitolite-admin 下载该仓库,其中 $HostIP 为 Gitolite 服务器的IP。该仓库的文件结构如下:

```text
.
├── conf
│   └── gitolite.conf     # 记录仓库、⽤⼾权限的配置⽂件
└── keydir                # 需要开通权限的公钥，都需要添加到该路径
    ├──  git.pub          # git ⽤⼾的公钥
    └──  test.pub         # test ⽤⼾的公钥
```

添加 RK 仓库列表到 Gitolite 中,同时添加组 group1、group2以及用戶 git 和 test。

```text
# 预处理 project.list，并添加到 gitolite.conf
sed -i 's/^/@linux\ =\ &/' project.list
echo "" >> ./conf/gitolite.conf
cat project.list >> ./conf/gitolite.conf
echo "" >> ./conf/gitolite.conf

# gitolite.conf ⽂末添加以下内容
@group1 = git
@group2 = test

repo @linux
        RW+ = @group1
        RW  = @group2
        R   = @all
```

## 4. 镜像服务器代码下载

完成以上步骤后,就可以通过 Gitolite 服务器进行 SDK 的下载。需要注意的是,下载的仓库地址需要根据 Gitolite 服务器进行修改,通常,repositories 目录是所有仓库的根目录,如rk3326_linux5.10_release.xml SDK,可以通过以下地址进行下载:

```text
repo init --repo-url ssh://git@$HostIP/repo \
-u ssh://git@$HostIP/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
```

## 5. FAQ

### 5.1 repo sync 时反复要求输入密码

这种情况只有在从 Gerrit 服务器同步代码时才会出现,可以设置 git config --globalcredential.helper store 开启自动输入密码。

[Gitolite source](https://github.com/sitaramc/gitolite)

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
