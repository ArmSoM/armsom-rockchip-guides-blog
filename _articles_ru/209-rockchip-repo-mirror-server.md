---
title: "Rockchip Repo: развёртывание зеркального сервера"
description: "Rockchip Repo: развёртывание зеркального сервера — V1.0.0"
excerpt: "Rockchip Repo: развёртывание зеркального сервера"
translation_key: "209-rockchip-repo-mirror-server"
slug: "209-rockchip-repo-mirror-server"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Gitolite, SDK, Repo]
---

{% raw %}

# Rockchip Repo: развёртывание зеркального сервера

Справка по процессу разработки ArmSoM: RK-YH-YF-A00 V1.0.0, китайский/английский оригиналы 6/7 страниц. Описывает Gitolite и зеркала SDK. В исходной таблице чип и ядро — ALL; это управление на хосте, не заявление об аппаратной поддержке всех плат. Требуются разрешённый доступ к SDK, Git/Repo/SSH и права администратора сервера. Статья не предоставляет доступ к серверам Rockchip. Учётные записи, права и репозитории не изменялись; команды не выполнялись.

Оригиналы соответствуют друг другу; сохранены пять глав и FAQ. Технических рисунков нет. RW+, RW и R = @all — примеры прав, область доступа нужно проверить перед эксплуатацией. credential.helper store хранит учётные данные на диске открытым текстом. Совет оригинала сохранён для прослеживаемости, а не как рекомендация для общих или недоверенных машин.

## 1. Сервер Gitolite

Создайте учётную запись Gitolite:

```text
sudo adduser git
sudo usermod -G sudo -a git
```

Загрузите и установите Gitolite:

```text
su git
git clone https://github.com/sitaramc/gitolite
mkdir $HOME/bin
./gitolite/install -to $HOME/bin
```

Добавьте права администратора. В ~/.ssh пользователя git нужны два ключа:

- Ключ RK для синхронизации кода с сервером RK.
- Ключ Gitolite для управления доступом к коду.

Для удобства управления рекомендуется имя публичного ключа $username.pub.

```text
./bin/gitolite setup -pk ~/.ssh/$username.pub
```

## 2. Синхронизация репозиториев RK

### 2.1 Синхронизация сервера RK Gitolite

Пример синхронизации rk3326_linux5.10_release.xml:

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

### 2.2 Синхронизация сервера RK Gerrit

Пример синхронизации rk3562_linux_release.xml:

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

## 3. Права доступа Gitolite

Gitolite управляет репозиториями через gitolite-admin. Администратор загружает его по ssh://git@$HostIP/gitolite-admin, где $HostIP — IP сервера Gitolite. Структура репозитория:

```text
.
├── conf
│   └── gitolite.conf     # A profile that records the repository and user permissions
└── keydir                # The public key that needs to open the authority needs to be added to this path
    ├──  git.pub          # public key of git
    └──  test.pub         # public key of test
```

Добавьте список репозиториев RK, группы group1 и group2 и пользователей git и test:

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

## 4. Загрузка с зеркального сервера

После этих шагов SDK можно загружать с Gitolite. Адреса необходимо адаптировать к своему серверу; каталог repositories обычно является корнем всех репозиториев. Например, SDK rk3326_linux5.10_release.xml загружается так:

```text
repo init --repo-url ssh://git@$HostIP/repo \
-u ssh://git@$HostIP/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
```

## 5. Частые вопросы

### 5.1 repo sync постоянно запрашивает пароль

Оригинал относит это к синхронизации с Gerrit и предлагает git config --global credential.helper store для автоматического предоставления пароля.

[Gitolite source](https://github.com/sitaramc/gitolite)

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
