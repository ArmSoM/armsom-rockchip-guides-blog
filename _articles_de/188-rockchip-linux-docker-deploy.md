---
title: "Rockchip Linux-Docker-Bereitstellung und SDK-Builds"
description: "Rockchip Linux-Docker-Bereitstellung und SDK-Builds — V1.0.4"
excerpt: "Rockchip Linux-Docker-Bereitstellung und SDK-Builds"
translation_key: "188-rockchip-linux-docker-deploy"
slug: "188-rockchip-linux-docker-deploy"
lang: "de"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux-Docker-Bereitstellung und SDK-Builds

ArmSoM-Plattformreferenz anhand der bereitgestellten chinesischen und englischen Rockchip-Quellen. Konkrete Platine, SoC, SDK/BSP, Kernel und Peripherie einzeln abgleichen; keine allgemeine Unterstützung aller ArmSoM-Platinen. Quellbeispiele und Messwerte sind keine ArmSoM-Tests. Keine Befehle oder Hardwaretests ausgeführt.

Die Quelltabelle nennt ALL/ALL; Docker benötigt dennoch die beschriebenen Kernelfunktionen und Distributionskonfiguration.

Beide Originale V1.0.4, alle 7 Kapitel erhalten, keine separaten Abbildungen. Löschen, Privileged-Modus, Host-Mounts und Image-Pushes sind nicht ausgeführte Quellbeispiele. `safe.directory "*"` deaktiviert diese Eigentümer-Vertrauensprüfung für alle Repositories, überträgt aber kein Dateieigentum; §7.2 erklärt dies falsch und bleibt mit Hinweis erhalten. Konkrete vertrauenswürdige Pfade statt unbedacht des Wildcards prüfen. `docker login -p` legt das Passwort in Argumenten offen; historische Mirrors sind ungeprüft. Die Quellaussage zum Änderungsverlust beim Verlassen vermischt Container-Schreibschicht und Image: Verlassen allein löscht die Schicht nicht.

## 1. Übersicht

Docker ist eine quelloffene Container-Engine für Anwendungen. Anwendungen und Abhängigkeiten werden als leichter, portabler Linux-Container gebündelt. Laut Quelle erleichtert dies die effiziente Ressourcennutzung, eine einheitliche Laufzeitumgebung, kontinuierliche Veröffentlichung und Bereitstellung sowie spätere Portierung, Wartung und Erweiterung. Die folgende Tabelle enthält Prüfungen der Quelle, keine ArmSoM-Tests.

| Betriebssystemversion | Docker-Version | Image laden | Firmware-Build |
| --- | --- | --- | --- |
| ubuntu 22.04 | 24.0.5 | bestanden | bestanden |
| ubuntu 21.10 | 20.10.12 | bestanden | bestanden |
| ubuntu 21.04 | 20.10.7 | bestanden | bestanden |
| ubuntu 18.04 | 20.10.7 | bestanden | bestanden |
| fedora35 | 20.10.12 | bestanden | NR (nicht ausgeführt) |

## 2. Installation

### 2.1 Debian-basierte Distributionen: Debian, Ubuntu

```text
sudo apt-get install docker.io
```

### 2.2 Red-Hat-basierte Distributionen: Redhat, Fedora, CentOS

```text
sudo yum install docker
sudo dnf install docker
```

## 3. Verwendung

### 3.1 Image aus einer Dockerfile erstellen

```text
# $name:$tag Image name: tag name
# Dockfile is built based on the context, the built directory must contain Dockerfile
# $dockerfile specifies the Dockerfile name, it is PATH/Dockerfile by default
# $dockerfile_dir Dockerfile is located at PATH
sudo docker build -f $dockerfile -t $name:$tag $dockerfile_dir
```

### 3.2 Image oder Container löschen

```text
# $imageID
sudo docker rmi $imageID

# $containerID
sudo docker rm $containerID
```

### 3.3 Image oder Container umbenennen

```text
# $imageID: Image ID
# $name:$tag: image name:tag name
sudo docker tag $imageID $name:$tag

# $containerID container ID
# $name container name
sudo docker rename $containerID $name
```

### 3.4 Images und Container anzeigen

```text
sudo docker image ls

sudo docker container ls
```

### 3.5 Docker-Umgebung starten

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

### 3.6 Images verwalten

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

## 4. SDK mit Docker bauen

### 4.1 Docker-Image erstellen

#### 4.1.1 Anhand einer Dockerfile bauen

```text
# Refer to the Dockerfile provided by this document
# Suppose Dockerfile is in /home/docker/Dockerfile
cd /home/docker
sudo docker build -t docker_rk:latest .
```

#### 4.1.2 Bereitgestelltes Image verwenden

Das fertige Image ist über den Quellverweis docker im Linkabschnitt verfügbar.

### 4.2 SDK mithilfe von Docker bauen

```text
# Suppose the SDK is located at /home/user/sdk
# Maps the SDK to the Docker image and enter the image
sudo docker run --privileged -it -u rk -v /home/user/sdk:/home/rk/sdk docker_rk:latest /bin/bash

# Switch to the path in Docker, the compilation method can be check through build.sh -h
cd /home/rk/sdk
./build.sh -h
```

### 4.3 Docker-Image aktualisieren

```text
# After exiting the Docker image, all modifications except the mapping directory will not be saved. If you want to save the corresponding modifications, the Docker image needs to be updated
# Supports the container instantiated by this image is rk@ecbbcdc7e5ca:/$
# Follow the command below to update the Docker image
sudo docker commit -m "update" ecbbcdc7e5ca docker_rk:latest
```

## 5. Docker auf der Rockchip-Plattform ausführen

### 5.1 Kernelkonfiguration

Der Kernel benötigt cgroups, namespace, netfilter, overlayfs und weitere erforderliche Funktionen. Prüfen, ob die Konfiguration die Docker-Anforderungen erfüllt. Den Host mit /usr/share/docker.io/contrib/check-config.sh prüfen; falls das Skript fehlt, check-config.sh über den Quellverweis beziehen. Die Quelle bietet außerdem eine allgemeine Docker-Konfiguration, die folgender Befehl aktiviert:

```text
make ARCH=arm64 rockchip_linux_defconfig rockchip_linux_docker.config
```

### 5.2 Buildroot-Konfiguration

Docker-bezogene Buildroot-Optionen sind standardmäßig deaktiviert. Bei Bedarf folgende Optionen einschalten:

```text
BR2_PACKAGE_CGROUPFS_MOUNT=y
BR2_PACKAGE_DOCKER_ENGINE=y
BR2_PACKAGE_DOCKER_ENGINE_EXPERIMENTAL=y
BR2_PACKAGE_DOCKER_ENGINE_STATIC_CLIENT=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_BTRFS=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_DEVICEMAPPER=y
BR2_PACKAGE_DOCKER_ENGINE_DRIVER_VFS=y
```

### 5.3 Debian-Konfiguration

Docker lässt sich direkt unter Debian installieren. In der beschriebenen Quellumgebung verwendet Debian standardmäßig iptables-nft, Docker dagegen iptables-legacy. Deshalb empfiehlt die Quelle den Wechsel auf legacy; die Rückschaltung auf nft ist ebenfalls angegeben:

```text
# Using iptables-legacy
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

# Using iptables-nft
update-alternatives --set iptables /usr/sbin/iptables-nft
update-alternatives --set ip6tables /usr/sbin/ip6tables-nft
```

## 6. Dockerfile-Referenz

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

## 7. Häufige Fragen

### 7.1 Error Pulling Image Configuration: Get Https:......Read: Connection Reset by Peer

Das aktuelle Netzwerk erreicht das offizielle Docker-Image-Repository nicht. Die Quelle schlägt die folgende Konfiguration eines chinesischen Docker-Mirrors vor. Die Verfügbarkeit dieses historischen Mirrors wurde hier nicht geprüft.

```text
# Add the following content to /etc/docker/daemon.json
{
   "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```

### 7.2 Error.GitError: ...... rev-parse: fatal: detected dubious ownership in repository at

Das Repository gehört üblicherweise dem Host-Benutzer, der es heruntergeladen hat. Beim Bauen in Docker führt der abweichende Eigentümer im Container zum Fehler. Die Quelle beschreibt den folgenden Befehl als Rechteübertragung für alle Repositories und warnt, dass bei Übertragung des Eigentums an den Containerbenutzer der Host-Benutzer seine Rechte verliert. Diese Quellenbeschreibung bleibt nachvollziehbar erhalten, ist technisch aber unzutreffend: safe.directory ändert keinen Eigentümer; siehe Hinweis am Artikelanfang.

```text
git config --global --add safe.directory "*"
```

## Quellverweise

[ArmSoM Docs](https://docs.armsom.org/)

[https://git-scm.com/docs/git-config#Documentation/git-config.txt-safedirectory](https://git-scm.com/docs/git-config#Documentation/git-config.txt-safedirectory)

[https://console.zbox.filez.com/l/boc1y7](https://console.zbox.filez.com/l/boc1y7)

[https://github.com/moby/moby/blob/master/contrib/check-config.sh](https://github.com/moby/moby/blob/master/contrib/check-config.sh)

{% endraw %}
