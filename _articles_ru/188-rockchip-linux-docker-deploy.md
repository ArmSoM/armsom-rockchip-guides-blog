---
title: "Rockchip развёртывание Docker и сборка Linux SDK"
description: "Rockchip развёртывание Docker и сборка Linux SDK — V1.0.4"
excerpt: "Rockchip развёртывание Docker и сборка Linux SDK"
translation_key: "188-rockchip-linux-docker-deploy"
slug: "188-rockchip-linux-docker-deploy"
lang: "ru"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip развёртывание Docker и сборка Linux SDK

Платформенная справка ArmSoM по предоставленным китайскому и английскому оригиналам Rockchip. Проверяйте конкретную плату, SoC, SDK/BSP, ядро и периферию; поддержка всех плат ArmSoM не заявляется. Примеры и измерения источника не являются испытаниями ArmSoM. Команды и аппаратные тесты не выполнялись.

Таблица применимости источника указывает ALL/ALL, но Docker всё равно требует описанных функций ядра и настройки дистрибутива.

Оба оригинала V1.0.4, все 7 глав сохранены, отдельных рисунков нет. Удаление, privileged-режим, монтирование каталогов хоста и отправка образов — только примеры, не выполнялись. `safe.directory "*"` отключает эту проверку доверия к владельцу для всех репозиториев, но не меняет владельца файлов; объяснение §7.2 неверно, сохранено с предупреждением. Проверяйте конкретные доверенные пути вместо бездумного wildcard. `docker login -p` раскрывает пароль в аргументах; исторические зеркала не проверены. Исходное утверждение о потере изменений при выходе смешивает слой контейнера и образ: сам выход слой не удаляет.

## 1. Обзор

Docker — открытый движок контейнеров приложений. Приложение и зависимости упаковываются в лёгкий переносимый контейнер для Linux. По исходнику это позволяет эффективнее использовать ресурсы, сохранять единое окружение, непрерывно выпускать и развёртывать ПО, а затем упрощает перенос, обслуживание и расширение. Ниже приведены результаты проверки из исходного документа, а не тесты ArmSoM.

| Версия ОС | Версия Docker | Загрузка образа | Сборка прошивки |
| --- | --- | --- | --- |
| ubuntu 22.04 | 24.0.5 | успешно | успешно |
| ubuntu 21.10 | 20.10.12 | успешно | успешно |
| ubuntu 21.04 | 20.10.7 | успешно | успешно |
| ubuntu 18.04 | 20.10.7 | успешно | успешно |
| fedora35 | 20.10.12 | успешно | NR (не запускалось) |

## 2. Установка

### 2.1 Дистрибутивы на основе Debian: Debian, Ubuntu

```text
sudo apt-get install docker.io
```

### 2.2 Дистрибутивы на основе Red Hat: Redhat, Fedora, CentOS

```text
sudo yum install docker
sudo dnf install docker
```

## 3. Использование

### 3.1 Создание образа из Dockerfile

```text
# $name:$tag Image name: tag name
# Dockfile is built based on the context, the built directory must contain Dockerfile
# $dockerfile specifies the Dockerfile name, it is PATH/Dockerfile by default
# $dockerfile_dir Dockerfile is located at PATH
sudo docker build -f $dockerfile -t $name:$tag $dockerfile_dir
```

### 3.2 Удаление образа или контейнера

```text
# $imageID
sudo docker rmi $imageID

# $containerID
sudo docker rm $containerID
```

### 3.3 Переименование образа или контейнера

```text
# $imageID: Image ID
# $name:$tag: image name:tag name
sudo docker tag $imageID $name:$tag

# $containerID container ID
# $name container name
sudo docker rename $containerID $name
```

### 3.4 Просмотр образов и контейнеров

```text
sudo docker image ls

sudo docker container ls
```

### 3.5 Запуск окружения Docker

```text
# Run Docker environment
# --privileged: privileged mode
# -it: means enabling interactive mode, /bin/bash: means interactive mode
# -v $host_dir:$docker_dir: maps the host directory into Docker
# -p $host_port:$docker_port: maps the host port into Docker
# -u $docker_user: specifies to use the user in Docker to log in
# -w $cwd_dir: switches to the path inside the container
# -d --detach: set background running mode

# Run the specified image
sudo docker run --privileged -it -u $docker_user -v $host_dir:$docker_dir $imageID /bin/bash

# Run the specified container
sudo docker exec -it -w $cwd_dir $containerID /bin/bash
```

### 3.6 Управление образами

```text
# Login to dockerhub account
sudo docker login -u $username -p $password

# Pull the dockerhub image
sudo docker image pull $imageID

# Push image to dockerhub
sudo docker image push $username/$imagename

# Export local image (tar archive file)
sudo docker image save $name:$tag -o ${dockerimage.tar}

# Import local image (tar archive file)
sudo docker image load -i ${dockerimage.tar}

# Change the local immage and commit
# -m commit information
# -a the author of the commit
# $containerID: the container ID which is changed
# $new_name:$new_tag: commited image name tag
sudo docker commit -m $commit_message -a $author $containerID $new_name:$new_tag
```

## 4. Сборка SDK в Docker

### 4.1 Создание образа Docker

#### 4.1.1 Сборка по Dockerfile

```text
# Refer to the Dockerfile provided by this document
# Suppose Dockerfile is in /home/docker/Dockerfile
cd /home/docker
sudo docker build -t docker_rk:latest .
```

#### 4.1.2 Использование готового образа

Готовый образ доступен по ссылке docker из исходника, приведённой в разделе ссылок.

### 4.2 Сборка SDK с помощью Docker

```text
# Suppose the SDK is located at /home/user/sdk
# Maps the SDK to the Docker image and enter the image
sudo docker run --privileged -it -u rk -v /home/user/sdk:/home/rk/sdk docker_rk:latest /bin/bash

# Switch to the path in Docker, the compilation method can be check through build.sh -h
cd /home/rk/sdk
./build.sh -h
```

### 4.3 Обновление образа Docker

```text
# After exiting the Docker image, all modifications except the mapping directory will not be saved. If you want to save the corresponding modifications, the Docker image needs to be updated
# Supports the container instantiated by this image is rk@ecbbcdc7e5ca:/$
# Follow the command below to update the Docker image
sudo docker commit -m "update" ecbbcdc7e5ca docker_rk:latest
```

## 5. Запуск Docker на платформе Rockchip

### 5.1 Конфигурация ядра

Ядро должно поддерживать cgroups, namespace, netfilter, overlayfs и другие необходимые функции. Убедитесь, что конфигурация отвечает требованиям Docker. На хосте можно запустить /usr/share/docker.io/contrib/check-config.sh; если скрипта нет, получить check-config.sh по ссылке исходника. Документ также предоставляет общую конфигурацию Docker, применяемую следующей командой:

```text
make ARCH=arm64 rockchip_linux_defconfig rockchip_linux_docker.config
```

### 5.2 Конфигурация Buildroot

Связанные с Docker опции Buildroot по умолчанию выключены. При необходимости включите:

```text
BR2_PACKAGE_CGROUPFS_MOUNT=y
BR2_PACKAGE_DOCKER_ENGINE=y
BR2_PACKAGE_DOCKER_ENGINE_EXPERIMENTAL=y
BR2_PACKAGE_DOCKER_ENGINE_STATIC_CLIENT=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_BTRFS=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_DEVICEMAPPER=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_VFS=y
```

### 5.3 Конфигурация Debian

Docker можно установить непосредственно в Debian. В описываемом исходником окружении Debian использует iptables-nft по умолчанию, а Docker — iptables-legacy. Поэтому исходник предлагает переключить iptables на legacy; также приведены команды возврата к nft:

```text
# Using iptables-legacy
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

# Using iptables-nft
update-alternatives --set iptables /usr/sbin/iptables-nft
update-alternatives --set ip6tables /usr/sbin/ip6tables-nft
```

## 6. Справочный Dockerfile

```text
FROM ubuntu:22.04
RUN \
# use mirror sources
echo "deb http://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse\n\
deb http://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse\n\
deb http://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse\n\
deb http://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse" \
> /etc/apt/sources.list \
# install packages
&& DEBIAN_FRONTEND=noninteractive apt-get update -y \
&& DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
&& DEBIAN_FRONTEND=noninteractive apt-get install -y \
bc binfmt-support bison bsdmainutils build-essential chrpath cmake cpio curl device-tree-compiler diffstat \
expat expect fdisk file flex gawk git iputils-ping libegl1-mesa libelf-dev libgmp-dev libgucharmap-2-90-dev \
liblz4-tool libmpc-dev libncurses-dev libsdl1.2-dev libssl-dev locales live-build mesa-common-dev net-tools \
patchelf python2 python2-dev python3 python-is-python3 python3-git python3-jinja2 python3-pexpect python3-pip \
python3-pyelftools python3-subunit qemu-user-static repo rsync ssh strace swig vim socat sudo texinfo time tree \
unzip wget \
# add user in docker
&& useradd -c 'rk user' -m -d /home/rk -s /bin/bash rk && usermod -a -G sudo rk \
&& sed -i -e '/\%sudo\tALL=(ALL:ALL) ALL/ c \%sudo ALL=(ALL) NOPASSWD: ALL' /etc/sudoers \
&& echo "docker image build complete"
# delete useless package and cache if need
#&& apt-get autoclean && apt-get autoremove && rm -rf /var/lib/apt/lists/*
```

## 7. Частые вопросы

### 7.1 Error Pulling Image Configuration: Get Https:......Read: Connection Reset by Peer

Текущая сеть не может обратиться к официальному репозиторию образов Docker. Исходник предлагает настроить зеркало Docker в Китае следующим образом. Доступность указанного исторического зеркала здесь не проверялась.

```text
# Add the following content to /etc/docker/daemon.json
{
   "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```

### 7.2 Error.GitError: ...... rev-parse: fatal: detected dubious ownership in repository at

Обычно репозиторий принадлежит пользователю хоста, загрузившему его. При сборке в Docker другой владелец внутри контейнера вызывает ошибку. Исходник описывает следующую команду как перенос прав на все репозитории и предупреждает, что передача владения контейнерному пользователю лишит пользователя хоста соответствующих прав. Это объяснение исходника сохранено для прослеживаемости, но технически команда safe.directory не меняет владельца: см. предупреждение в начале статьи.

```text
git config --global --add safe.directory "*"
```

## Ссылки исходника

[ArmSoM Docs](https://docs.armsom.org/)

[https://git-scm.com/docs/git-config#Documentation/git-config.txt-safedirectory](https://git-scm.com/docs/git-config#Documentation/git-config.txt-safedirectory)

[https://console.zbox.filez.com/l/boc1y7](https://console.zbox.filez.com/l/boc1y7)

[https://github.com/moby/moby/blob/master/contrib/check-config.sh](https://github.com/moby/moby/blob/master/contrib/check-config.sh)

{% endraw %}
