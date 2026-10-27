---
title: "Rockchip Repo: Spiegelserver bereitstellen"
description: "Rockchip Repo: Spiegelserver bereitstellen — V1.0.0"
excerpt: "Rockchip Repo: Spiegelserver bereitstellen"
translation_key: "209-rockchip-repo-mirror-server"
slug: "209-rockchip-repo-mirror-server"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, Gitolite, SDK, Repo]
---

{% raw %}

# Rockchip Repo: Spiegelserver bereitstellen

ArmSoM-Entwicklungsablaufreferenz nach RK-YH-YF-A00 V1.0.0, chinesische/englische Quelle mit 6/7 Seiten. Beschrieben werden Gitolite und SDK-Spiegel. Die Quelltabelle nennt Chip und Kernel ALL; gemeint ist Hostverwaltung, keine Hardware-Supportzusage für alle Platinen. SDK-Zugriff, Git/Repo/SSH und Serververwaltungsrechte werden vorausgesetzt. Dieser Artikel erteilt keinen Rockchip-Serverzugriff. Keine Konten, Rechte oder Repositories wurden geändert; keine Befehle ausgeführt.

Die Quellen entsprechen einander; alle fünf Kapitel und FAQ sind erhalten. Es gibt keine technischen Abbildungen. RW+, RW und R = @all sind Berechtigungsbeispiele; den tatsächlichen Zugriff vor produktivem Einsatz prüfen. credential.helper store speichert Zugangsdaten unverschlüsselt auf dem Datenträger. Der Quellvorschlag bleibt nachvollziehbar erhalten, nicht als ungeprüfte Empfehlung für gemeinsam genutzte oder nicht vertrauenswürdige Rechner.

## 1. Gitolite-Server einrichten

Gitolite-Benutzerkonto anlegen:

```text
sudo adduser git
sudo usermod -G sudo -a git
```

Gitolite herunterladen und installieren:

```text
su git
git clone https://github.com/sitaramc/gitolite
mkdir $HOME/bin
./gitolite/install -to $HOME/bin
```

Administratorberechtigung hinzufügen. Im Verzeichnis ~/.ssh des Benutzers git werden zwei Schlüssel benötigt:

- RK-Schlüssel zur Codesynchronisierung vom RK-Server.
- Gitolite-Schlüssel für die Zugriffsverwaltung.

Der öffentliche Schlüssel sollte zur leichteren Verwaltung $username.pub heißen.

```text
./bin/gitolite setup -pk ~/.ssh/$username.pub
```

## 2. RK-Repositories synchronisieren

### 2.1 RK-Gitolite-Server synchronisieren

Synchronisierungsbeispiel für rk3326_linux5.10_release.xml:

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

### 2.2 RK-Gerrit-Server synchronisieren

Synchronisierungsbeispiel für rk3562_linux_release.xml:

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

## 3. Gitolite-Zugriffsrechte

Gitolite verwaltet Repositories über gitolite-admin. Administratoren laden es über ssh://git@$HostIP/gitolite-admin, wobei $HostIP die Gitolite-Server-IP ist. Repository-Struktur:

```text
.
├── conf
│   └── gitolite.conf     # A profile that records the repository and user permissions
└── keydir                # The public key that needs to open the authority needs to be added to this path
    ├──  git.pub          # public key of git
    └──  test.pub         # public key of test
```

Die RK-Repository-Liste, Gruppen group1 und group2 sowie Benutzer git und test ergänzen:

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

## 4. Code vom Spiegelserver laden

Anschließend lässt sich das SDK vom Gitolite-Server laden. Die Adressen müssen an den eigenen Server angepasst werden; repositories ist gewöhnlich das Stammverzeichnis aller Repositories. Beispiel für rk3326_linux5.10_release.xml:

```text
repo init --repo-url ssh://git@$HostIP/repo \
-u ssh://git@$HostIP/rockchip/platform/manifests \
-b linux -m rk3326_linux5.10_release.xml
```

## 5. Häufige Fragen

### 5.1 repo sync fragt wiederholt nach einem Passwort

Die Quelle ordnet dies der Gerrit-Synchronisierung zu und nennt git config --global credential.helper store für die automatische Passwortbereitstellung.

[Gitolite source](https://github.com/sitaramc/gitolite)

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}
