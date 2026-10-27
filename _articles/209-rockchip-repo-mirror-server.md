---
title: "Rockchip Repo Mirror Server Deployment"
description: "Rockchip Repo Mirror Server Deployment — V1.0.0"
excerpt: "Rockchip Repo Mirror Server Deployment"
translation_key: "209-rockchip-repo-mirror-server"
slug: "209-rockchip-repo-mirror-server"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Gitolite, SDK, Repo]
---

{% raw %}

# Rockchip Repo Mirror Server Deployment

ArmSoM development-workflow reference from RK-YH-YF-A00 V1.0.0 (Chinese/English, 6/7 pages), covering Gitolite setup and SDK mirrors. The source applicability table says chipset ALL and kernel ALL; this is host-side management, not a hardware-support claim for every board. Existing SDK access, Git/Repo/SSH and server administration rights are prerequisites. This article grants no Rockchip server access. No accounts, permissions, code synchronization or commands were executed.

The sources correspond; all five chapters and the FAQ are retained. There are no technical figures. RW+, RW and R = @all are source permission examples; review the actual access scope before production use. credential.helper store saves credentials in plaintext on disk. The source suggestion is preserved for traceability, not recommended blindly on shared or untrusted hosts.

## 1. Setup a Gitolite server

Create a Gitolite account

```text
sudo adduser git
sudo usermod -G sudo -a git
```

Download and install Gitolite

```text
su git
git clone https://github.com/sitaramc/gitolite
mkdir $HOME/bin
./gitolite/install -to $HOME/bin
```

Add administrator permission There should be two key in the ~/.ssh directory of the git user: RK key: Used to synchronize code from the RK server. Gitolite key: Used for Gitolite code rights management. The name of the public key is recommended to be in the form of $username.pub to facilitate permission management.

```text
./bin/gitolite setup -pk ~/.ssh/$username.pub
```

## 2. Synchronize RK server repository

### 2.1 RK Gitolite server code synchronization

The following uses rk3326_linux5.10_release.xml as an example to illustrate how to synchronize code.

```text
# Code sync should work under repositories
cd repositories

# Sync rk3326_linux5.10_release.xml SDK
repo init --mirror --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo \
-u ssh://git@www.rockchip.com.cn/linux/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
# Sync the code
.repo/repo/repo sync -c

# Generate a list of SDK projects
.repo/repo/repo list -n > project.list
```

### 2.2 RK Gerrit server code synchronization

The following uses rk3562_linux_release.xml as an example to illustrate how to synchronize code.

```text
# Code sync should work under repositories
cd repositories

# Sync rk3562_linux_release.xml SDK
repo init --mirror --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo \
-u https://gerrit.rock-chips.com:8443/linux/rockchip/platform/manifests \
-b rk3562 -m rk3562_linux_release.xml
# Sync the code
.repo/repo/repo sync -c

# Generate a list of SDK projects
.repo/repo/repo list -n > project.list
```

## 3. Gitolite permission management

The Gitolite server manages the repository through gitolite-admin and the admin user can download the repository through ssh://git@$HostIP/gitolite-admin , where $HostIP is the IP of the Gitolite server. The file structure of the repository is as follows:

```text
.
├── conf
│   └── gitolite.conf     # A profile that records the repository and user permissions
└── keydir                # The public key that needs to open the authority needs to be added to this path
    ├──  git.pub          # public key of git
    └──  test.pub         # public key of test
```

Add the list of RK repositories to Gitolite, along with groups group1, group2, and user git and test.

```text
# Preprocess the contents of project.list and add to gitolite.conf
sed -i 's/^/@linux\ =\ &/' project.list
echo "" >> ./conf/gitolite.conf
cat project.list >> ./conf/gitolite.conf
echo "" >> ./conf/gitolite.conf

# Adds the following at the end of gitolite.conf
@group1 = git
@group2 = test

repo @linux
        RW+ = @group1
        RW  = @group2
        R   = @all
```

## 4. Download code from Mirror server

After completing the above steps, you can download the SDK through the Gitolite server. It should be noted that the downloaded repository address needs to be modified according to the Gitolite server, usually, the repositories directory is the root directory of all repositories, such as rk3326_linux5.10_release.xml SDK, which can be downloaded through the following address:

```text
repo init --repo-url ssh://git@$HostIP/repo \
-u ssh://git@$HostIP/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
```

## 5. FAQ

### 5.1 repo sync repeatedly asks for a password

This only happens when synchronizing code from the Gerrit server, and you can set git config --global credential.helper store to enable automatic password entry.

[Gitolite source](https://github.com/sitaramc/gitolite)

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
