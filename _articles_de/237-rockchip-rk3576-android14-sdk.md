---
title: "Vollständiger Entwicklungsleitfaden für das Rockchip RK3576 Android 14 SDK"
description: "Vollständiger Entwicklungsleitfaden für das Rockchip RK3576 Android 14 SDK — V1.0.0, RKR4, GKI, ADB, DTS, FAQ"
excerpt: "Vollständiger Entwicklungsleitfaden für das Rockchip RK3576 Android 14 SDK"
translation_key: "237-rockchip-rk3576-android14-sdk"
slug: "237-rockchip-rk3576-android14-sdk"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "RK3576", "Android14", "SDK"]
---

{% raw %}

# Vollständiger Entwicklungsleitfaden für das Rockchip RK3576 Android 14 SDK

Plattformreferenz für ArmSoM: vollständiger technischer Inhalt des Herstellerleitfadens RK3576 Android 14 SDK V1.0.0, keine hardwarevalidierte Flash-Anleitung für ArmSoM. Vor der Anpassung SoC, Schaltplan, DTS, SDK-Release und Speicheraufteilung prüfen. Es erfolgten keine Hardwaretests; Quellabbildungen, Leistungsempfehlungen und Beispiele sind keine ArmSoM-Messungen. Vor Flashen und Partitionsänderungen Daten sichern. Codebezeichner und historische Beispiele bleiben erhalten; Quellenunterschiede und Risiken stehen am Ende.

Codeblöcke sind zeilengetreue Quelltranskriptionen mit PDF-Umbrüchen, typografischen Anführungszeichen und Strichen. Lange Befehle/Patches können umgebrochen sein und dürfen nicht ungeprüft eingefügt werden. Der Anhang verbindet etwa zwei update-alternatives-Befehle zu `--config javasudo`; `sudo update-alternatives --config java` und `sudo update-alternatives --config javac` getrennt prüfen. Linux_Upgrade_Tool_v2.26 in der Hilfeausgabe ist ein Altbeispiel; RK3576 benötigt mindestens 2.30.

## RK3576 Android 14 SDK herunterladen und bauen

### Quellcode herunterladen

#### Download-Adresse

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml
```

Mit Express-Berechtigung gilt folgende Download-Adresse:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml
```

#### Server-Spiegel herunterladen

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

Mit Express-Berechtigung gilt folgende Adresse:

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14_Express.xml --mirror
```

repo ist ein von Google in Python geschriebenes Skript, das git zum Herunterladen und Verwalten von Android-Repositories aufruft. Download-Adresse:

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

Für einen schnellen Bezug der Quellen stellt der Rockchip-Ansprechpartner gewöhnlich ein Ausgangsarchiv der entsprechenden SDK-Version bereit. Nach Erhalt beispielsweise von Rockchip_Android14.0_SDK_RELEASE.tar.gz.* lassen sich die Quellen mit folgenden Befehlen synchronisieren:

```text
mkdir RK3576_Android14.0_SDK_RELEASE
cat RK3576_Android14.0_SDK_RELEASE.tar.gz* | tar -zx -C
RK3576_Android14.0_SDK_RELEASE
cd RK3576_Android14.0_SDK_RELEASE
.repo/repo/repo sync -l
.repo/repo/repo sync -c
```

### Eigenen repo-Quellcodeserver einrichten

#### Umgebung

openssh-server für Fernanmeldung, git für Projektverwaltung und keychain zur Verwaltung öffentlicher und privater Schlüssel installieren.

```text
sudo apt-get install openssh-server git keychain
```

#### gitolite einrichten

##### Serverseitige Schritte

Als Beispiel dient die Serveradresse 10.10.10.206.

1. Das Konto git erstellen:

```text
sudo adduser --system --shell /bin/bash --group git
sudo passwd git
```

2. Als Benutzer git am Server anmelden.

3. Laut Quelle muss ~/.ssh/authorized_keys leer sein oder fehlen; bestehende Zugangsschlüssel nicht ohne gesonderte Freigabe entfernen.

4. Den öffentlichen Administratorschlüssel nach ~/YourName.pub kopieren; Groß-/Kleinschreibung muss zum späteren Befehl passen.

5. gitolite-Quellen herunterladen.

```text
git clone https://github.com/sitaramc/gitolite.git
```

6. Im Benutzerverzeichnis von git den Ordner bin erstellen.

```text
mkdir -p ~/bin
```

7. gitolite mit folgendem Befehl installieren. Das Verfahren ist versionsabhängig; die Dokumentation im Quellcode beachten.

```text
gitolite/install -to ~/bin
```

8. Den Administrator einrichten.

```text
~/bin/gitolite setup -pk YourName.pub
```

##### Clientseitige Schritte

1. Das gitolite-Verwaltungsrepository vom Server klonen.

```text
git clone ssh://git@10.10.10.206/gitolite-admin.git
```

2. Den öffentlichen Benutzerschlüssel im gitolite-Verzeichnis ergänzen.

```text
cp username.pub keydir/username.pub
```

3. Einen Administratorbenutzer ergänzen.

```text
vi conf/gitolite.conf
@admin = admin1 admin2 admin3
repo gitolite-admin
RW+     =   @admin
```

#### repo-Spiegel einrichten

##### Serverseitige Schritte

1. Als git am Server anmelden.

2. Das repo-Werkzeug in das Wurzelverzeichnis des verwendeten Arbeitsbereichs herunterladen.

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

3. RK_Android14_mirror erstellen.

```text
mkdir RK_Android14_mirror
```

4. In RK_Android14_mirror wechseln.

```text
cd RK_Android14_mirror
```

5. Den Spiegel des RK-Android14-SDK herunterladen.

```text
repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b rk3576 -m
Android14.xml --mirror
```

6. Repository-Gruppenrechte erstellen.

```text
.repo/repo/repo list -n > android_u.conf
sed -i 's/^/@android_t = RK_Android14_mirror\/&/g' android_u.conf
```

##### Clientseitige Schritte

1. android_u.conf vom Server nach gitolite-admin/conf/ auf dem Client kopieren.

2. Gruppenrechte ergänzen.

```text
vi conf/android_u.conf
@usergroup = user1 user2 user3
repo @android_u
R   = @usergroup
RW+ = @admin
```

```text
vi conf/gitolite.conf
include "android_u.conf"
```

3. Ein eigenes manifests-Repository erstellen.

```text
vi conf/android_u.conf
@android_u = Android_T/manifests_xxx
```

#### Clientseitige Schritte

1. manifests_xxx auf dem Client herunterladen; manifests_xxx.git auf einem weiteren Clientrechner klonen.

```text
git clone ssh://git@10.10.10.206/Android_u/manifests_xxx.git
```

2. Das ursprüngliche manifests-Repository auf dem Client herunterladen.

```text
git clone ssh://git@10.10.10.206/Android_U/manifests.git
```

3. manifest.xml in das neue manifest_xxx übernehmen. Die Dateien des ursprünglichen manifests nach manifests_xxx kopieren.

```text
cd manifests_xxx
cp -rf manifests/*.xml manifests_xxx/
```

Die kopierten Dateien prüfen.

```text
git status

 Android14.xml
 Android14_Express.xml
 default.xml
 include/rk3576_repository.xml
 include/rk_checkout_from_aosp.xml
 include/rk_modules_repository.xml
 remote.xml
 remove_u.xml
 remove_unused.xml
```

Lokaler Commit

```text
git add -A
git commit -m "init xxx"
```

In den entfernten Branch übertragen

```text
git push origin master:master
```

4. Einen eigenen Quellcode-Download-Link erstellen. repo in das Wurzelverzeichnis des Arbeitsbereichs herunterladen.

```text
git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo
```

Nach diesen Schritten sieht der eigene Download-Aufruf wie folgt aus:

```text
mkdir Android14
cd Android14
~/repo/repo init -u ssh://git@10.10.10.206/Android_U/manifests_xxx.git -m
Android14.xml
```

Dabei ist //10.10.10.206 die eigene Serveradresse. Damit ist der repo-Server eingerichtet; der Link kann für gemeinsame Arbeit an Kollegen weitergegeben werden.

### Quellcodeverwaltung

Nach der Servereinrichtung verwenden die meisten Repositories die Standardbranches von RK. Für eigene Änderungen in einzelnen Repositories die folgende Vorgehensweise nutzen.

#### Auf eigene Branches wechseln

1. In das zu ändernde Repository wechseln; als Beispiel dient das Kernelverzeichnis.

```text
cd kernel-6.1
```

2. Einen lokalen Branch erstellen und auswählen.

```text
git checkout remotes/m/master -b xxx_branch
```

3. xxx_branch an den entfernten Server übertragen.

```text
git push rk29 xxx_branch:xxx_branch
```

rk29 ist der Remote-Name und lässt sich per Tab vervollständigen.

4. In .repo/manifests den im Manifest festgelegten Branch ändern. Mit grep kernel lässt sich das Manifest des Kernel-Repositories finden.

```text
cd .repo/manifests
```

```text
--- a/include/rk_modules_repository.xml
+++ b/include/rk_modules_repository.xml
@@ -10,7 +10,7 @@
   <project path="hardware/rockchip/libgraphicpolicy"
name="rk/hardware/rk29/libgraphicpolicy" remote="rk"
revision="refs/tags/android-1s.0-mid-rkr1" />
   <project path="hardware/rockchip/libhwjpeg" name="rk/hardware/rk29/libhwjpeg"
remote="rk" revision="refs/tags/android-14.0-mid-rkr1"/>
   <project path="u-boot" name="rk/u-boot" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
-  <project path="kernel" name="rk/kernel" remote="rk29"
revision="refs/tags/android-14.0-mid-rkr1"/>
+  <project path="kernel" name="rk/kernel" remote="rk29" revision="xxx_branch"/>

   <project path="bootable/recovery/rkupdate"
name="platform/bootable/recovery/rk_update" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
   <project path="bootable/recovery/rkutility"
name="platform/bootable/recovery/rk_utility" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1"/>
```

5. Das geänderte Manifest in den entfernten Branch übertragen.

```text
git add include/rk_modules_repository.xml
git commit -m "change kernel branch on xxx_branch"
git push origin default:master
```

Nach dem Übertragen von manifests können Kollegen die Kernelquellen aus den eigenen Branches synchronisieren.

#### Quellcodeänderungen einreichen

Nach dem Wechsel auf eigene Branches Änderungen dort committen und direkt nach xxx_branch übertragen.

#### RK-Quellen synchronisieren

1. RK-Quellen serverseitig synchronisieren.

```text
cd RK_Android14_mirror
```

```text
.repo/repo/repo sync -c
```

2. Auf dem Client die RK-Änderungen an manifests übernehmen. Das ursprüngliche RK-manifests herunterladen.

```text
git clone //10.10.10.206/wlq/test/manifests.git
```

RK-manifests und das eigene manifests_xxx mit einem Vergleichswerkzeug abgleichen und Änderungen übernehmen, insbesondere Tags sowie hinzugefügte oder entfernte Repositories. Nach Prüfung nach manifests_xxx übertragen. Dabei werden auch die geänderten Repositories bestimmt, die im nächsten Schritt zusammengeführt werden.

3. In Verzeichnissen mit eigenen Branches RK-Änderungen manuell zusammenführen. Kernelbeispiel: die aktuell referenzierten Remote-Branches prüfen.

```text
wlq@wlq:~/home1/test2/kernel-6.1$ git branch -av
* android-11.0-mid-rkr7   0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
  xxx_branch              0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
  remotes/m/master        -> rk29/xxx_branch
  remotes/rk29/xxx_branch 0bde59fad73a ARM: configs: rockchip_defconfig enable
ION_CMA_HEAP
```

Der aktuelle Verweis lautet remotes/m/master -> rk29/xxx_branch. Einen lokalen Branch vom eigenen Remote-Branch erstellen.

```text
git checkout remotes/m/xxx_branch -b local_xxx_branch
```

Den zuletzt veröffentlichten RK-TAG prüfen.

```text
wlq@wlq:~/home1/test2/kernel$ git tag | grep rkr
android-10.0-mid-rkr1
android-10.0-mid-rkr10
android-10.0-mid-rkr11
android-10.0-mid-rkr13
android-10.0-mid-rkr2
android-10.0-mid-rkr3
android-10.0-mid-rkr4
android-10.0-mid-rkr5
android-10.0-mid-rkr6
android-10.0-mid-rkr7
android-10.0-mid-rkr8
android-10.0-mid-rkr9
android-11.0-ebook-rkr1
android-11.0-ebook-rkr2
android-11.0-ebook-rkr3
android-11.0-ebook-rkr4
android-11.0-ebook-rkr5
android-11.0-ebook-rkr6
android-11.0-mid-rkr1
android-11.0-mid-rkr2
android-11.0-mid-rkr3
android-11.0-mid-rkr4
android-11.0-mid-rkr4.1
android-11.0-mid-rkr5
android-11.0-mid-rkr6
android-11.0-mid-rkr7
android-11.0-mid-rkr7-prev
android-11.0-mid-rkr8
android-14.0-mid-rkr1
```

Im Beispiel ist android-14.0-mid-rkr1 der letzte Android14-Tag. Diesen in den lokalen Branch integrieren.

```text
git merge android-14.0-mid-rkr1
```

Konflikte prüfen und zuerst beheben. Erst danach den zusammengeführten Quellcode in den entfernten Branch übertragen.

```text
git push rk29 local_xxx_branch:xxx_branch
```

Andere Verzeichnisse mit eigenen Branches ebenso zusammenführen und übertragen.

#### Pfad der Kernelquellen

Android14 unterstützt Kernel 6.1; seine Quellen liegen im Projektverzeichnis kernel-6.1.

#### Quellen kompilieren

##### lunch-Varianten

| lunch-Ziel | Passender SoC | Beschreibung |
| --- | --- | --- |
| rk3576_u-user | RK3576 | Android 14 auf RK3576-Entwicklungsplatinen; user-Build für die Produktion; 64- und 32-Bit-Unterstützung. |
| rk3576_u-userdebug | RK3576 | Android 14 auf RK3576-Entwicklungsplatinen; userdebug für Entwicklung und Debugging; 64- und 32-Bit-Unterstützung. |

##### Einheitlicher Build-Befehl

```text
./build.sh -UKAup
（ WHERE: -U = build uboot
       -C = build kernel with Clang
       -K = build kernel
       -A = build android
       -p = will build packaging in IMAGE
       -o = build OTA package
       -u = build update.img
       -v = build android with 'user' or 'userdebug'
       -d = huild kernel dts name
       -V = build version
       -J = build jobs
   ------------you can use according to the requirement, no need to record
uboot/kernel compiling commands------------------
 ）

============================================================
Please remember to set the environment variable before using the one key
compiling command, and select the platform to be compiled, for example:
source build/envsetup.sh
lunch rk3588_t-userdebug
============================================================
```

#### Übersicht der Build-Befehle

| Soc | Typ | Referenzmodell | Android | Gesamt-Build | Kernel-Build | U-Boot-Build |
| --- | --- | --- | --- | --- | --- | --- |
| RK3576 | EVB | rk3576-evb1-v10 | build/envsetup.sh;lunch rk3576_u-userdebug | ./build.sh -AUCKu | ./build.sh -K | ./build.sh -U |

#### GKI

Zum Aktivieren von GKI (Generic Kernel Image) auf RK3576 folgende Schritte ausführen:

```text
wlq@sys2206:~/b0_A14_bringup/device/rockchip/rk3576$ git diff
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
index eb52fb6..f59df62 100755
--- a/rk3576_u/BoardConfig.mk
+++ b/rk3576_u/BoardConfig.mk
```

```text
@@ -14,7 +14,7 @@
 # limitations under the License.
 #
 BUILD_WITH_GO_OPT := false
-BOARD_BUILD_GKI := false
+BOARD_BUILD_GKI := true

 BOARD_GRAVITY_SENSOR_SUPPORT := true
```

Bei BOARD_BUILD_GKI := false wird A/B automatisch abgeschaltet. Details: RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》.

#### Weitere Build-Hinweise

##### Android14.0: kernel.img und resource.img nicht direkt flashen

Der folgende Build gilt nur für non-GKI; für GKI siehe RKDocs/android/《Rockchip_Developer_Guide_Android14_GKI_CN》. Bei Android14.0 sind kernel.img und resource.img in boot.img enthalten. build.sh -AK baut Kernel und Android neu; danach boot.img aus rockdev flashen. Wegen der längeren Build-Zeit wird der separate Kernelbuild empfohlen: Kernel- und Ressourceninhalt des alten boot.img durch die Ergebnisse im Kernelverzeichnis ersetzen. Für den RK3576-Prototyp passende boot.img und DTS wählen. BOOT_IMG=../rockdev/Image-rk3576_u/boot.img bezeichnet das alte boot.img. Zuerst clang zur Umgebung hinzufügen:

```text
cd kernel-6.1
export PATH=../prebuilts/clang/host/linux-x86/clang-r487747c/bin:$PATH
alias msk='make CROSS_COMPILE=aarch64-linux-gnu- LLVM=1 LLVM_IAS=1'
```

```text
rk3576:
msk ARCH=arm64 rockchip_defconfig android-14.config rk3576.config && msk
ARCH=arm64 BOOT_IMG=../rockdev/Image-rk3576_u/boot.img rk3576-evb1-v10.img -j32
```

Nach dem Build lässt sich boot.img aus kernel-6.1 in die boot-Partition des Geräts schreiben. Dabei parameter.txt laden, damit nicht an die falsche Stelle geschrieben wird.

#### Images flashen

##### Flash-Werkzeug

Android14 benötigt den USB-Treiber DriverAssitant V5.1.1; das Update ist im Werkzeugkapitel beschrieben. Für RK3576 unter Windows ist das Flash-Werkzeug ab Version

3.28 erforderlich.

```text
RKTools/windows/AndroidTool/AndroidTool_Release_v3.28
```

![Technische Originalabbildung 1](/docs/rockchip-rk3576-android14-sdk/assets/en-p014-figure-01.png)

Flash-Werkzeug unter Linux: Für RK3576 ist Linux Upgrade Tool ab Version 2.30 erforderlich. Pfad: `RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30`.

Weitere Informationen stehen im Werkzeugkapitel.

##### Image-Beschreibung

Ein vollständiger Build erzeugt folgende Dateien:

```text
rockdev/Image-rk3576_u/
├── boot-debug.img
├── boot.img
├── config.cfg
├── dtbo.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── pcba_small_misc.img
├── pcba_whole_misc.img
├── recovery.img
├── resource.img
├── super.img
├── uboot.img
├── update.img
└── vbmeta.img
```

Folgende Dateien müssen geschrieben werden:

```text
rockdev/Image-rk3576_u/
├── boot.img
├── dtbo.img
├── MiniLoaderAll.bin
├── misc.img
├── parameter.txt
├── recovery.img
├── super.img
├── uboot.img
└── vbmeta.img
```

Alternativ kann update.img direkt geflasht werden.

##### Zweck der Images

| Image | Beschreibung |
| --- | --- |
| boot.img | Enthält ramdis (Quellschreibweise), Kernel und dtb. |
| boot-debug.img | Unterschied zu boot.img: Beim user-Build ermöglicht das Debug-Boot-Image Root-Operationen. Die Quellformulierung „dieses boot.img“ ist unklar; das gewählte boot-debug.img prüfen. |
| dtbo.img | Device-Tree-Overlays; siehe folgenden dtbo-Abschnitt. |
| config.cfg | Konfigurationsdatei des Flash-Werkzeugs zum Laden der erforderlichen Flash-Optionen. |
| MiniLoaderAll.bin | Loader der ersten Stufe. |
| misc.img | Boot-Markierung recovery-wipe; nach dem Flashen wird recovery gestartet. |
| parameter.txt | Partitionsinformationen. |
| pcba_small_misc.img | PCBA-Boot-Markierung; startet nach dem Flashen den einfachen PCBA-Modus. |
| pcba_whole_misc.img | PCBA-Boot-Markierung; startet nach dem Flashen den vollständigen PCBA-Modus. |
| recovery.img | Enthält recovery-ramdis (Quellschreibweise), Kernel und dtb. |
| super.img | Inhalt von odm, vendor und system; die chinesische Fassung nennt zusätzlich product und system_ext. |
| trust.img | BL31 und BL32; laut Quelle wird dieses Image für RK3566/RK3568 nicht erzeugt und nicht geflasht. Keine Aussage über RK3576. |
| uboot.img | U-Boot-Image. |
| vbmeta.img | AVB-Verifikationsdaten. |
| update.img | Paket der genannten Images; kann vom Werkzeug vollständig geflasht werden. |

#### Generic Kernel Image (GKI)

Für alle Android14-Produkte mit GMS-/EDLA-Zertifizierung verlangt die Quelle GKI. Konfiguration und Build: RKDocs/android/Rockchip_Developer_Guide_Android14_GKI_CN.pdf.

#### Dynamische Partitionen mit fastboot flashen

Neue Geräte mit R unterstützen dynamische Partitionen; separate system/vendor/odm/product/system_ext entfallen, stattdessen super.img flashen. Mit fastbootd lassen sich system/vendor/odm einzeln schreiben. Aktuelle adb-/fastboot-Versionen verwenden; das SDK enthält kompilierte Werkzeuge:

```text
RKTools/linux/Linux_adb_fastboot (Linux_x86 version)
RKTools/windows/adb_fastboot (Windows_x86 version)
```

Befehle zum Flashen einer dynamischen Partition:

```text
adb reboot fastboot
fastboot flash vendor vendor.img
fastboot flash system system.img
fastboot flash odm odm.img
```

Nach dem Wechsel zu fastbootd erscheinen Geräteinformationen auf dem Bildschirm:

![Technische Originalabbildung 2](/docs/rockchip-rk3576-android14-sdk/assets/en-p016-figure-01.png)

Bei nicht dynamischen Partitionen fastboot im Bootloader verwenden:

```text
adb reboot bootloader
```

GSI flashen:

Gerät entsperren und fastbootd starten. system.img aus GSI sowie misc.img der Firmware genügen; anschließend startet recovery für einen Werksreset. Vollständiger Ablauf:

1. In den Bootloader starten und das Gerät von lock auf unlock umstellen:

```text
adb reboot bootloader
fastboot oem at-unlock-vboot ## for the customers already flashing avb public
key, please refer to the corresponding document to unlock.
```

2. Werksreset ausführen und in fastbootd starten:

```text
fastboot flash misc misc.img
fastboot reboot fastboot  ## now it will enter fastbootd
```

3. GSI flashen.

```text
fastboot delete-logical-partition product  ## (optional) for the device with
small partition space, you can execute this command to delete product partition
first and then flash GSI
fastboot flash system system.img
fastboot reboot  ## after flashing successfully, reboot the device
```

GSI lässt sich über DSU (Dynamic System Updates) verwenden; Rockchip aktiviert DSU standardmäßig. Wegen des hohen Speicherbedarfs rät die Quelle bei DDR 1G oder weniger davon ab. Beschreibung: https://source.android.com/devices/tech/ota/dynamic-system-updates. Hinweise: Für VTS das kompilierte boot-debug.img in boot flashen; bei CTS-ON-GSI ist dies nicht nötig; für Tests ein von Google veröffentlichtes GSI mit Endung -signed verwenden.

### DTBO-Funktion

Android10.0 und neuer unterstützen Device Tree Overlays. Für die Kompatibilität mit mehreren Produkten wird bei der Entwicklung dtbo.img geflasht. Vorgehen:

1. Die Vorlagendatei suchen oder festlegen:

```text
get_build_var PRODUCT_DTBO_TEMPLATE
```

Beispiel:

```text
PRODUCT_DTBO_TEMPLATE := $(LOCAL_PATH)/dt-
overlay.in(device/rockchip/rk576/rk3576_u/dt-overlay.in)
```

2. Den benötigten Knoten ergänzen oder ändern. Beispiel:

```text
/dts-v1/;
/plugin/;
```

```text
&chosen {
    bootargs_ext = "androidboot.boot_devices=${_boot_device}";
};

&firmware_android {
    vbmeta {
        status = "disabled";
    };
    fstab {
        status = "disabled";
    };
};

&reboot_mode {
    mode-bootloader = <0x5242C309>;
    mode-charge = <0x5242C30B>;
    mode-fastboot = <0x5242C303>;
    mode-loader = <0x5242C301>;
    mode-normal = <0x5242C300>;
    mode-recovery = <0x5242C303>;
};
```

Für erfolgreiches DTBO-Overlay muss der entsprechende Alias im DTS vorhanden sein.

### fstab ändern

1. Die Vorlagendatei suchen oder festlegen:

```text
get_build_var PRODUCT_FSTAB_TEMPLATE
```

Beispiel:

```text
PRODUCT_FSTAB_TEMPLATE := device/rockchip/common/scripts/fstab_tools/fstab.in
```

2. Partitionsmounts ergänzen sowie swap_zram, das Format der data-Partition und weitere Parameter ändern.

### parameter.txt ändern

Android14 ergänzt ein Werkzeug, das parameter.txt aus Konfigurationsparametern erzeugt. Fehlt die Konfigurationsvorlage, wird die vorhandene angepasste parameter.txt verwendet.

1. Die Vorlagendatei suchen oder festlegen:

```text
get_build_var PRODUCT_PARAMETER_TEMPLATE
```

Beispiel:

```text
PRODUCT_PARAMETER_TEMPLATE :=
device/rockchip/common/scripts/parameter_tools/parameter.in
```

2. Partitionsgrößen konfigurieren, Beispiel:

```text
BOARD_SUPER_PARTITION_SIZE := 2688548864
BOARD_DTBOIMG_PARTITION_SIZE := xxxx
BOARD_BOOTIMAGE_PARTITION_SIZE := xxxxx
BOARD_CACHEIMAGE_PARTITION_SIZE := xxxx
```

3. Ohne Generator: parameter.txt in das Geräteverzeichnis legen. Beispiel:

```text
device/rockchip/rk3576/rk3576_u/parameter.txt
```

4. Nur parameter.txt mit dem Werkzeug erzeugen, Beispiel:

```text
parameter_tools --input
device/rockchip/common/scripts/parameter_tools/parameter.in --firmware-version
14.0 --machine-model rk3576 --manufacturer rockchip --machine rk3576_u --
partition-list
uboot_a:4096K,trust_a:4M,misc:4M,dtbo_a:4M,vbmeta_a:4M,boot_a:33554432,backup:30
0M,security:4M,cache:300M,metadata:4096,frp:512K,super:2G --output
parameter_new.txt
```

Bei einem OTA-Wechsel zwischen Hauptversionen parameter.txt der vorherigen Version verwenden.

5. Eine Partition ergänzen, am Beispiel baseparameter. In BoardConfig.mk des Produkts BOARD_WITH_SPECIAL_PARTITIONS definieren, etwa: BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M,logo:16M.

```text
device/rockchip/rk3576/rk3576_u/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -494,4 +494,11 @@ ifeq ($(strip $(BOARD_TWRP_ENABLE)), true)
+BOARD_WITH_SPECIAL_PARTITIONS := baseparameter:1M
```

BOARD_WITH_SPECIAL_PARTITIONS in RebuildParameter.mk ergänzen.

```text
device/rockchip/common/build/rockchip/RebuildParameter.mk
+ifneq ($(strip $(BOARD_WITH_SPECIAL_PARTITIONS)), )
+partition_list := $(partition_list),$(BOARD_WITH_SPECIAL_PARTITIONS)
+endif
```

### Allgemeine Android-Konfiguration

#### Produktvariante für lunch erstellen

Für ein neues RK3576-Produkt namens rk3576_new_u folgende Schritte ausführen.

1. In device/rockchip/rk3576 wechseln.

2. Dort rk3576_new_u erstellen.

3. Das vorhandene rk3576_u als Vorlage verwenden: Verzeichnis mit folgendem Befehl kopieren und rk3576_new_u nennen.

```text
cp -r rk3576_u rk3576_new_u
```

4. In das kopierte rk3576_new_u wechseln.

5. In allen Dateien von rk3576_new_u rk3576_u durch rk3576_new_u ersetzen, manuell oder mit sed. Beispiel:

```text
sed -i 's/rk3576_u/rk3576_new_u/g' *
```

Der Befehl ersetzt alle Vorkommen von rk3576_u in den Dateien des Verzeichnisses rk3576_new_u durch rk3576_new_u.

6. Das neue Produktverzeichnis rk3576_new_u ist für weitere Anpassung und Entwicklung bereit.

### Kernel-DTS-Beschreibung

#### DTS für ein neues Produkt

Ein zur Konfiguration passendes DTS aus folgender Tabelle als Grundlage des neuen Produkts wählen.

| Soc | PMIC | Typ | Modell | DTS |
| --- | --- | --- | --- | --- |
| RK3576 | RK806 | EVB | RK3576 EVB1 | rk3576-evb1-v10 |
| RK3576 | RK806 | EVB | RK3576 EVB1 + RK628 | rk3576-evb1-v10-rk628-hdmi2csi |

### Patch-Veröffentlichung

Wichtige Patches erscheinen regelmäßig unter folgender Redmine-Adresse:

```text
https://redmine.rock-chips.com/projects/rockchip_patch/issues
```

Für zeitnahe Patch-Benachrichtigungen per E-Mail abonnieren: Schritt 1 — mit dem bei Rockchip registrierten Konto in Redmine anmelden.

Schritt 2 — das eigene Konto öffnen.

![Technische Originalabbildung 3](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-01.png)

Schritt 3 — den Benachrichtigungstyp wählen. Im abgebildeten E-Mail-Auswahlfeld alle Benachrichtigungen für ausgewählte Projekte einstellen.

![Technische Originalabbildung 4](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-02.png)

Schritt 4 — das abgebildete Patch-Projekt auswählen und speichern.

![Technische Originalabbildung 5](/docs/rockchip-rk3576-android14-sdk/assets/en-p021-figure-03.png)

Nach erfolgreichem Abonnement kommen Benachrichtigungen über Rockchip-Patches an die bei Redmine registrierte E-Mail-Adresse.

### Dokumentationsübersicht

#### Listen unterstützter Peripherie

Die Unterstützungslisten für DDR/EMMC/NAND FLASH/WIFI/3G/CAMERA werden unter folgendem Redmine-Link laufend aktualisiert:

```text
https://redmine.rockchip.com.cn/projects/fae/documents
```

#### Dokumentation zum Camera IQ Tool

```text
external/camera_engine_rkaiq/rkisp2x_tuner/doc/
├── Rockchip_Color_Optimization_Guide_ISP2x_CN_v2.0.0.pdf
├── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.0.pdf
└── Rockchip_Tuning_Guide_ISP21_CN_v2.0.0.pdf
```

#### Entwicklungs-SDK und Dokumentation für rknn-toolkit2

```text
hardware/rockchip/rknn-toolkit2/doc/
```

#### Inhalt von RKDocs

```text
RKDocs/
├── android
│ ├── Android11 异显开发说明.zip
│ ├── audio
│ │ └── Rockchip_Developer_Guide_Android_Multi_Audio_CN.pdf
│ ├── bt
│ │ └── Rockchip_Introduction_Android9.0_BT_Configuration_CN.pdf
│ ├── patches
│ │ └── root
│ │ ├── android11_root.pdf
│ │ └── RootChecker.apk
│ ├── Rockchip_Android14_GKI_Developer_Guide_CN.pdf
│ ├── Rockchip_Android14_SDK_Developer_Guide_CN.pdf
│ ├── Rockchip_Android14_SDK_Developer_Guide_EN.pdf
│ ├── Rockchip_Android_Remote_key_Provisioning_Guide.pdf
│ ├── Rockchip_Developer_Guide_Android11_Optimization_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_AB_System_Upgrading_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_Recovery_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_SELinux(Sepolicy)CN.pdf
│ ├── Rockchip_Developer_Guide_PCBA_Test_Tool_V1.3_CN&EN.pdf
│ ├── Rockchip_Firmware_Upgrade_Failed_Analyze_Method_CN.pdf
│ ├── Rockchip_Introduction_Android_Application_Preinstallation_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Boot_Video_CN.pdf
│ ├── Rockchip_Introduction_Android_BOX_Display_Framework_Configuration_CN.pdf
│ ├── Rockchip_Introduction_Android_Factory_Reset_Protection_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Log_System.pdf
│ ├── Rockchip_Introduction_Android_Performance_Mode_CN&EN.pdf
│ ├──
Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Customization_CN&EN.pdf
│ ├── Rockchip_Introduction_Android_Samba_CN.pdf
│ ├── Rockchip_Introduction_Android_Widevine_Project_Start_Preparation_CN.pdf
│ ├── Rockchip_Introduction_Box_Media_Application_CN&EN.pdf
│ ├── Rockchip-Parameter-File-Format-Version1.4-CN.pdf
```

```text
│ ├── Rockchip_User_Guide_Android_GMS_Configuration_CN.pdf
│ ├── Rockchip_User_Guide_Android_GMS_Configuration_EN.pdf
│ ├── Rockchip_User_Guide_Box_FactoryTestTool_V3.0_CN.pdf
│ ├── Rockchip_User_Guide_Dr.G_CN&EN.pdf
│ ├── Rockchip_User_Guide_Magisk_Installation_EN.pdf
│ ├── video
│ │ └── Rockchip_Android_Multimedia_FAQ_CN.pdf
│ └── wifi
│ ├── Rockchip_Introduction_REALTEK_WIFI_Driver_Porting_CN&EN.pdf
│ └── Rockchip_Introduction_WIFI_Configuration_CN&EN.pdf
└── common
├── Audio
│ ├── Rockchip_Developer_Guide_Android_EQ_DRC_CN.pdf
│ ├── Rockchip_Developer_Guide_Android_Multi_Audio_CN.pdf
│ ├──
Rockchip_Developer_Guide_Audio_Call_3A_Algorithm_Integration_and_Parameter_Debugging_CN.pdf
│ ├── Rockchip_Developer_Guide_Audio_CN.pdf
│ └── Rockchip_Developer_Guide_RK817_RK809_Codec_CN.pdf
├── camera
│ ├── common
│ │ └── Camera_External_FAQ_v1.0 .pdf
│ ├── HAL1
│ │ ├── README_CN.txt
│ │ ├── README_EN.txt
│ │ ├── RK312x_Camera_User_Manual_v1.4(3288&3368).pdf
│ │ ├── RK_ISP10_Camera_User_Manual_v2.3.pdf
│ │ ├── RKISPV1_Camera_Module_AVL_v1.7.pdf
│ │ ├── Rockchip_Camera_AVL_v2.0_Package_20180515.7z
│ │ ├── Rockchip_Introduction_RKISPV1_Camera_Driver_Debugging_Method_CN.pdf
│ │ ├── Rockchip_Introduction_RKISPV1_Camera_FAQ_CN.pdf
│ │ ├── Rockchip SOFIA 3G-R_PMB8018(x3_C3230RK)Camera_Module_AVL_v1.6_20160226.pdf
│ │ └── Rockchip_Trouble_Shooting_Android_CameraHAL1_CN_EN.pdf
│ ├── HAL3
│ │ ├── camera_engine_rkisp_user_manual_v2.2.pdf
│ │ ├── camera_hal3_user_manual_v2.3.pdf
│ │ ├── README_CN.txt
│ │ ├── RKCIF_Driver_User_Manual_v1.0.pdf
│ │ ├── RKISP1_IQ_Parameters_User_Guide_v1.2.pdf
│ │ ├── RKISP_Driver_User_Manual_v1.3.pdf
│ │ ├── Rockchip_Color_Optimization_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Color_Optimization_Guide_ISP21_CN_v2.0.1.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Color_Optimization_Guide_ISP30_CN_v3.0.0.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Color_Optimization_Guide_ISP32_Lite_CN_v3.1.0.pdf
│ │ ├── Rockchip_Development_Guide_3A_ISP
│ │ │ └── ISP30
│ │ │ └── CN
```

```text
│ │ │ └── Rockchip_Development_Guide_3A_ISP30_v1.1.0.pdf
│ │ ├── Rockchip_Development_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Development_Guide_ISP21_CN_v2.1.0.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Development_Guide_ISP30_CN_v1.2.3.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Development_Guide_ISP32_Lite_CN_v1.0.0.pdf
│ │ ├── Rockchip_Driver_Guide_VI
│ │ │ ├── CN
│ │ │ │ └── Rockchip_Driver_Guide_VI_CN_v1.1.4.pdf
│ │ │ └── EN
│ │ │ └── Rockchip_Driver_Guide_VI_EN_v1.0.7.pdf
│ │ ├── Rockchip_IQ_Tools_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── Rockchip_IQ_Tools_Guide_ISP2x_CN_v2.0.3.pdf
│ │ │ ├── ISP30
│ │ │ │ └── Rockchip_IQ_Tools_Guide_ISP21_ISP30_CN_v2.0.4.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_IQ_Tools_Guide_v2.0.7_CN.pdf
│ │ ├── Rockchip_Trouble_Shooting_CameraHAL3_CN_EN.pdf
│ │ ├── Rockchip_Tuning_Guide_ISP
│ │ │ ├── ISP21
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Tuning_Guide_ISP21_CN_v2.1.0.pdf
│ │ │ ├── ISP30
│ │ │ │ └── CN
│ │ │ │ └── Rockchip_Tuning_Guide_ISP30_CN_v1.1.0.pdf
│ │ │ └── ISP32-lite
│ │ │ └── CN
│ │ │ └── Rockchip_Tuning_Guide_ISP32-lite_CN_v1.0.0.pdf
│ │ └── USB_UVC_Integrated_Cameras.pdf
│ ├── README.txt
│ └── vehicle
│ └── Rockchip_Android_Fast_Reverse_Image_System_Developer_Guide_CN_V1.0.3.pdf
├── Can
│ ├── Rockchip_Developer_Guide_Can_CN.pdf
│ └── Rockchip_Developer_Guide_CAN_FD_CN.pdf
├── CLK
│ ├── Rockchip_Developer_Guide_Clock_CN.pdf
│ ├── Rockchip_Developer_Guide_Gpio_Output_Clocks_CN.pdf
│ ├── Rockchip_Develop_Guide_Pll_Ssmod_Clock_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_Clock_CN.pdf
├── CRU
│ ├── Rockchip_Developer_Guide_Linux3.10_Clock_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux4.4_4.19_Clock_CN.pdf
│ ├── Rockchip_Develop_Guide_Pll_Ssmod_Clock_CN.pdf
│ ├── Rockchip_RK3399_Developer_Guide_Clock_CN.pdf
```

```text
│ └── Rockchip_RK3399_Developer_Guide_Linux4.4_Clock_CN.pdf
├── CRYPTO
│ ├── Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf
│ └── Rockchip_Developer_Guide_Crypto_HWRNG_EN.pdf
├── DDR
│ ├── DDR_bandwidth_statistics_tool
│ │ ├── rk-msch-probe-for-user-32bit
│ │ ├── rk-msch-probe-for-user-64bit
│ │ └── Rockchip_Introduction_DDR_Bandwidth_Tool_CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-EN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Problem-Solution-CN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Problem-Solution-EN.pdf
│ ├── Rockchip-Developer-Guide-DDR-Verification-Process-CN.pdf
│ ├── Rockchip_Developer_Guide_DDR_Verification_Process_EN.pdf
│ ├── Rockchip_Developer_Guide_HAL_DDR_ECC_CN.pdf
│ └── Rockchip-User-Guide-DDR-DQ-Eye-Tool-CN.pdf
├── debug
│ ├── RK3399-LOG-EXPLANATION.pdf
│ ├── Rockchip_Developer_Guide_DS5_CN.pdf
│ ├── Rockchip_Quick_Start_Linux_Perf.pdf
│ ├── Rockchip_Quick_Start_Linux_Streamline.pdf
│ ├── Rockchip_Quick_Start_Linux_Systrace.pdf
│ ├── Rockchip_RK3399_JTAG_Configuration_CN.pdf
│ └── Rockchip_User_Guide_J-Link_CN.pdf
├── display
│ ├── Rockchip_BT656_TX_AND_BT1120_TX_Developer_Guide_CN.pdf
│ ├── Rockchip_Developer_Guide_Baseparameter_Format_Define_And_Use_CN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Panel_Porting_CN&EN.pdf
│ ├── Rockchip_Developer_Guide_DRM_Panel_Porting_CN.pdf
│ ├── Rockchip_Developer_Guide_Dual_Display_Rotation_Direction_Debugging_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_Based_on_DRM_Framework_CN&EN.pdf
│ ├── Rockchip_Developer_Guide_HDMI-CEC_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_CN.pdf
│ ├── Rockchip_Develop_Guide_DRM_Direct_Show_CN.pdf
│ ├── Rockchip_Display_Issues_FAQ_V1.1.pdf
│ ├── Rockchip_DRM_RK628_Porting_Guide_CN.pdf
│ ├── Rockchip FAQ DRM Hardware Composer V1.00-20181213.pdf
│ ├── Rockchip_Introduction_DisplayAdjust_APK_CN.pdf
│ ├── Rockchip_Introduction_DRM_Integration_Helper_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_DisplayPort_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_MIPI_DSI2_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_Vsync_Adjust_CN.pdf
│ ├── Rockchip_RK3588_User_Guide_DP_CN.pdf
│ ├── Rockchip_RK3588_User_Guide_eDP_CN.pdf
│ └── Rockchip_Trouble_Shooting_Graphics
├── DVFS
│ ├── Rockchip_Developer_Guide_CPUFreq_CN.pdf
│ ├── Rockchip_Developer_Guide_CPUFreq_EN.pdf
│ ├── Rockchip_Developer_Guide_Devfreq_CN.pdf
│ ├── Rockchip_Developer_Guide_Devfreq_EN.pdf
```

```text
│ ├── Rockchip_Developer_Guide_Linux4.4_CPUFreq_CN.pdf
│ └── Rockchip_Developer_Guide_Linux4.4_Devfreq_CN.pdf
├── Ebook
│ ├── Rockchip_RK3566_Introduction_EBOOK_Display_Mode_CN.pdf
│ └── Rockchip_RK3566_Introduction_EBOOK_Sleep_Mode_CN.pdf
├── GMAC
│ ├── Rockchip_Developer_Guide_Ethernet_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_Mode_Configuration_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_GMAC_RGMII_Delayline_EN.pdf
├── hdmi-in
│ ├── apk
│ │ ├── HdmiInDemo_based_on_CameraHal1_2020.06.11_v1.2.tar.gz
│ │ └── rkCamera2_based_on_CameraHal3_V1.3.tar.gz
│ ├── Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal1_CN.pdf
│ ├── Rockchip_Developer_Guide_HDMI_IN_Based_On_CameraHal3_CN.pdf
│ └── Rockchip_Developer_Guide_HDMI_RX_CN.pdf
├── I2C
│ ├── Rockchip_Developer_Guide_I2C_CN.pdf
│ └── Rockchip_Developer_Guide_I2C_EN.pdf
├── IO-Domain
│ ├── Rockchip_Developer_Guide_Linux_IO_DOMAIN_CN.pdf
│ ├── Rockchip_PX30_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3288_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3326_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3399_Introduction_IO_Power_Domains_Configuration.pdf
│ ├── Rockchip_RK3399Pro_Introduction_IO_Power_Domains_Configuration.pdf
│ └── Rockchip_RK356X_Introduction_IO_Power_Domains_Configuration.pdf
├── IOMMU
│ ├── Rockchip_Developer_Guide_Linux_IOMMU_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_IOMMU_EN.pdf
├── Leds
│ └── Rockchip_Introduction_Leds_GPIO_Configuration_for_Linux4.4_CN.pdf
├── MCU
│ ├── Rockchip_RK3399_Developer_Guide_MCU_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_MCU_EN.pdf
├── Memory
│ └── Rockchip_Developer_Guide_Linux_CMA_CN.pdf
├── MMC
│ ├── Rockchip_Developer_Guide_SD_Boot_CN.pdf
│ └── Rockchip_Developer_Guide_SDMMC_SDIO_eMMC_CN.pdf
├── mobile-net
│ ├── Rockchip_Introduction_3G_Data_Card_USB_File_Conversion_CN.pdf
│ ├── Rockchip_Introduction_3G_Dongle_Configuration_CN&EN.pdf
│ └── Rockchip_Introduction_4G_Module_Configuration_CN&EN.pdf
├── MPP
│ ├── Rockchip_Developer_Guide_MPP_CN.pdf
│ └── Rockchip_Developer_Guide_MPP_EN.pdf
├── NVM
│ ├── Rockchip_Application_Notes_Storage_CN.pdf
│ ├── Rockchip_Developer_FAQ_Storage_CN.pdf
```

```text
│ ├── Rockchip_Developer_Guide_OTP_CN.pdf
│ ├── Rockchip_Developer_Guide_OTP_EN.pdf
│ ├── Rockchip_Developer_Guide_SATA_CN.pdf
│ ├── Rockchip_Introduction_Partition_CN.pdf
│ ├── Rockchip_Introduction_Partition_EN.pdf
│ └── Rockchip_RK356X_Developer_Guide_SATA_CN.pdf
├── PCie
│ ├── Rockchip-Developer-Guide-linux4.4-PCIe.pdf
│ ├── Rockchip_Developer_Guide_PCIe_CN.pdf
│ ├── Rockchip_PCIe_Virtualization_Developer_Guide_CN.pdf
│ └── Rockchip_RK3399_Developer_Guide_PCIe_CN.pdf
├── perf
│ ├── perf使用说明.pdf
│ ├── Rockchip_Developer_FAQ_FileSystem_CN.pdf
│ ├── Rockchip_Optimize_Tutorial_Linux_IO_CN.pdf
│ ├── Rockchip_Quick_Start_Linux_Performance_Analyse_CN.pdf
│ └── systrace使用说明.pdf
├── PIN-Ctrl
│ ├── Rockchip_Developer_Guide_Linux_Pinctrl_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_Pinctrl_EN.pdf
├── PMIC
│ ├── Rockchip_Developer_Guide_FreeRTOS_PMIC_CHARGER_POWERKEY_CN.pdf
│ ├── Rockchip_Developer_Guide_Power_Discrete_DCDC_EN.pdf
│ ├── Rockchip_Developer_Guide_RK817_RK809_Fuel_Gauge_CN&EN.pdf
│ ├── Rockchip_RK805_Developer_Guide_CN.pdf
│ ├── Rockchip_RK806_Developer_Guide_CN.pdf
│ ├── Rockchip_RK808_Developer_Guide_CN.pdf
│ ├── Rockchip_RK809_Developer_Guide_CN.pdf
│ ├── Rockchip_RK816_Developer_Guide_CN.pdf
│ ├── Rockchip_RK817_Developer_Guide_CN.pdf
│ ├── Rockchip_RK818_Developer_Guide_CN.pdf
│ ├── Rockchip_RK818_RK816_Developer_Guide_Fuel_Gauge_CN.pdf
│ └── Rockchip_RK818_RK816_Introduction_Fuel_Gauge_Log_CN.pdf
├── power
│ ├── Rockchip_Developer_Guide_Power_Analysis_EN.pdf
│ └── Rockchip_Developer_Guide_Sleep_and_Resume_CN.pdf
├── PWM
│ ├── Rockchip_Developer_Guide_Linux_PWM_CN.pdf
│ ├── Rockchip_Developer_Guide_Linux_PWM_EN.pdf
│ └── Rockchip_Developer_Guide_PWM_IR_CN.pdf
├── RGA
│ ├── Rockchip_Developer_Guide_RGA_CN.pdf
│ ├── Rockchip_Developer_Guide_RGA_EN.pdf
│ ├── Rockchip_FAQ_RGA_CN.pdf
│ └── Rockchip_FAQ_RGA_EN.pdf
├── RK628
│ ├── Rockchip_RK628D_Application_Notes_CN.pdf
│ └── Rockchip_RK628D_For_All_Porting_Guide_CN.pdf
├── RKTools manuals
│ ├── RKIQTool_User_Manual_v1.5-CH.pdf
│ ├── RKIQTool_User_Manual_v1.5-EN.pdf
│ ├── RK_Platform_apache_tomcat_ota_Server_Setup_Introduction.rar
```

```text
│ ├── Rockchip_Box_Factory_Test_Tool_V2.0.rar
│ ├── Rockchip_Developer_Guide_Linux_Nand_Flash_Open_Source_Solution_CN.pdf
│ ├── Rockchip_Introduction_Image_Upgrading_Failure_Analysis_CN.pdf
│ ├── Rockchip_Introduction_MP_Tool_Upgrading_and_Related_Issues_Debugging_CN.pdf
│ ├── Rockchip_Introduction_REPO_Mirror_Server_Build_and_Management_CN.pdf
│ ├── Rockchip_Introduction_Stresstest_for_VR_CN.pdf
│ ├── Rockchip_Introduction_WNpctool_Write_Tool_CN.pdf
│ ├── Rockchip_User_Guide_Box_Factory_Test_Tool_CN.pdf
│ ├── Rockchip_User_Guide_Keybox_Burning_EN.pdf
│ ├── Rockchip_User_Guide_KeyWrite_CN.pdf
│ ├── Rockchip_User_Guide_MP_Flashing_v1.2_CN.pdf
│ ├── Rockchip_User_Guide_Production_For_Firmware_Download_CN.pdf
│ ├── Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf
│ ├── Rockchip_User_Guide_RKDevInfoWriteTool_EN.pdf
│ ├── Rockchip_User_Guide_RK_Platform_MP_Upgrading_CN.pdf
│ ├── Rockchip_User_Manual_Android_Development_Tool_CN.pdf
│ ├── Rockchip_User_Manual_RKIQTool_CN.pdf
│ ├── Rockchip_User_Manual_RKIQTool_EN.pdf
│ ├── Rockchip_User_Manual_RKUpgrade_Dll_CN.pdf
│ └── SecureBootTool_UserManual.pdf
├── SARADC
│ ├── Rockchip_Developer_Guide_Linux_SARADC_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_SARADC_EN.pdf
├── security
│ ├── patch
│ │ └── u-boot
│ │ └── 0001-avb-add-embedded-key.patch
│ ├── RK3399_Efuse_Operation_Instructions_V1.00_EN.pdf
│ ├── RK356X_SecurityBoot_And_AVB_instructions_CN.pdf
│ ├── RK356X_SecurityBoot_And_AVB_instructions_EN.pdf
│ ├── RK3588_SecurityBoot_And_AVB_instructions_CN.pdf
│ ├── RK3588_SecurityBoot_And_AVB_instructions_EN.pdf
│ ├── Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_Application_Note_EN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_CN.pdf
│ ├── Rockchip_Developer_Guide_Secure_Boot_for_UBoot_Next_Dev_EN.pdf
│ ├── Rockchip_Developer_Guide_TEE_SDK_CN.pdf
│ ├── Rockchip_RK3399_User_Guide_SecurityBoot_And_AVB_CN.pdf
│ └── Rockchip Vendor Storage Application Note.pdf
├── Sensors
│ └── Rockchip_Developer_Guide_Sensors_CN.pdf
├── SPI
│ ├── Rockchip_Developer_Guide_Linux_SPI_CN.pdf
│ └── Rockchip_Developer_Guide_Linux_SPI_EN.pdf
├── Thermal
│ ├── Rockchip_Developer_Guide_Thermal_CN.pdf
│ └── Rockchip_Developer_Guide_Thermal_EN.pdf
├── TRUST
│ ├── Rockchip_Developer_Guide_Trust_CN.pdf
│ ├── Rockchip_Developer_Guide_Trust_EN.pdf
│ └── Rockchip_RK3588_Developer_Guide_System_Suspend_CN.pdf
├── Tutorial
```

```text
│ ├── RK3399-CPUINFO.pdf
│ ├── RK3399-LOG-EXPLANATION.pdf
│ ├── Rockchip_Developer_FAQ_FileSystem_CN.pdf
│ ├── Rockchip_Introduction_Browser_FAQ_CN.pdf
│ └── Rockchip_Trouble_Shooting_Firmware_Upgrade_Issue_CN.pdf
├── UART
│ ├── Rockchip-Developer-Guide-RT-Thread-UART.pdf
│ ├── Rockchip_Developer_Guide_UART_CN.pdf
│ ├── Rockchip_Developer_Guide_UART_EN.pdf
│ └── Rockchip_Developer_Guide_UART_FAQ_CN.pdf
├── u-boot
│ ├── Rockchip-Developer-Guide-Linux-AB-System.pdf
│ ├── Rockchip-Developer-Guide-Uboot-mmc-device-driver-analysis.pdf
│ └── Rockchip_Developer_Guide_UBoot_Nextdev_CN.pdf
├── usb
│ ├── Rockchip_Developer_Guide_Linux_USB_Initialization_Log_Analysis_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_Linux_USB_Performance_Analysis_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_Linux_USB_PHY_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_EN.pdf
│ ├── Rockchip_Developer_Guide_USB_FFS_Test_Demo_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_FFS_Test_Demo_CN_V1.2.1.pdf
│ ├── Rockchip_Developer_Guide_USB_Gadget_UAC_CN.pdf
│ ├── Rockchip_Developer_Guide_USB_Gadget_UAC_CN_V1.1.1.pdf
│ ├── Rockchip_Developer_Guide_USB_SQ_Test_CN.pdf
│ ├── Rockchip_Introduction_USB_SQ_Tool_CN.pdf
│ ├── Rockchip_RK3399_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_RK356x_Developer_Guide_USB_CN.pdf
│ ├── Rockchip_RK356X_User_Guide_USB_CN.pdf
│ ├── Rockchip_RK3588_Developer_Guide_USB_CN.pdf
│ └── Rockchip_User_Guide_USB_PHY_Tuning_CN.pdf
└── watchdog
├── Rockchip_Developer_Guide_Linux_WDT_CN.pdf
└── Rockchip_Developer_Guide_Linux_WDT_EN.pdf
```

### Werkzeuge verwenden

#### StressTest

Stresstest belastet Funktionen des Zielgeräts zur Prüfung der Systemstabilität. Im SDK startet die Eingabe 83991906= im Taschenrechner die Anwendung StressTest. Hauptprüfungen:

##### Modulbezogene Prüfungen

Kamera: Ein-/Ausschalten, Fotoaufnahme und Kamerawechsel. Bluetooth: Ein-/Ausschalten. Wi-Fi: Ein-/Ausschalten; ping- und iperf-Tests sind als geplant bezeichnet.

##### Weitere Prüfungen

Flugmodus ein-/ausschalten.

Belastungstests für Suspend/Resume, Videowiedergabe, Neustart, Recovery sowie ARM-, GPU- und DDR-Frequenzwechsel.

#### PCBA-Testwerkzeug

PCBA hilft, funktionierende und fehlerhafte Produkteigenschaften in der Fertigung schnell zu unterscheiden. Geprüft werden LCD, Wi-Fi, Bluetooth, DDR/EMMC, SD, USB HOST, Tasten, Lautsprecher/Kopfhörer (Codec). Wi-Fi, DDR/EMMC und Ethernet werden automatisch getestet; Tasten, SD, USB Host und Codec manuell. Konfiguration und Verwendung siehe:

```text
RKDocs\android\Rockchip_Developer_Guide_PCBA_Test_Tool_CN&EN.pdf_V1.1_20171222.p
df。
```

#### DeviceTest

DeviceTest prüft in der Fabrik das vollständige Gerät, vor allem die Peripherie nach dem Zusammenbau. Im SDK startet es über 000.= im Taschenrechner, wie unten gezeigt.

![Technische Originalabbildung 6](/docs/rockchip-rk3576-android14-sdk/assets/en-p030-figure-01.png)

Die gewünschte Peripherie auswählen und mit TEST CHECKED nacheinander testen. Bei Erfolg pass, sonst failed wählen; das Gesamtergebnis erscheint am Bildschirm. Rot kennzeichnet Fehler, andere Einträge Erfolge. Die Fertigung kann anhand dieser Ergebnisse reparieren. Für Anpassungen den Quellcode beim FAE anfragen.

#### USB-Treiber

Das Rockchip-USB-Treiberpaket enthält ADB- und Flash-Treiber.

```text
RKTools\windows\DriverAssitant_v5.1.1.zip
```

#### Entwicklungs-Flash-Werkzeug

##### Windows-Version

RKTools/windows/AndroidTool/AndroidTool_Release_v3.28.zip. Das Werkzeug wird regelmäßig aktualisiert; passende Aktualisierungen synchronisieren.

![Technische Originalabbildung 7](/docs/rockchip-rk3576-android14-sdk/assets/en-p031-figure-01.png)

##### Linux-Version

RKTools/linux/Linux_Upgrade_Tool/Linux_Upgrade_Tool_v2.30.zip

```text
Linux_Upgrade_Tool_v2.26$ sudo ./upgrade_tool -h
Program Data in /home/wlq/.config/upgrade_tool

---------------------Tool Usage ---------------------
Help:             H
Quit:             Q
Version:          V
Clear Screen:     CS
------------------Upgrade Command ------------------
ChooseDevice:           CD
ListDevice:                 LD
SwitchDevice:           SD
UpgradeFirmware:        UF <Firmware> [-noreset]
UpgradeLoader:          UL <Loader> [-noreset]
DownloadImage:          DI <-p|-b|-k|-s|-r|-m|-u|-t|-re image>
DownloadBoot:           DB <Loader>
EraseFlash:             EF <Loader|firmware> [DirectLBA]
PartitionList:          PL
WriteSN:                SN <serial number>
ReadSN:             RSN
----------------Professional Command -----------------
TestDevice:             TD
```

```text
ResetDevice:            RD [subcode]
ResetPipe:              RP [pipe]
ReadCapability:         RCB
ReadFlashID:            RID
ReadFlashInfo:          RFI
ReadChipInfo:           RCI
ReadSector:             RS  <BeginSec> <SectorLen> [-decode] [File]
WriteSector:            WS  <BeginSec> <File>
ReadLBA:                RL  <BeginSec> <SectorLen> [File]
WriteLBA:               WL  <BeginSec> <File>
EraseLBA:               EL  <BeginSec> <EraseCount>
EraseBlock:             EB <CS> <BeginBlock> <BlokcLen> [--Force]
-------------------------------------------------------
```

#### SD-Update- und Startwerkzeug

Für Updates, Start und PCBA-Tests von SD-Karte.

```text
RKTools\windows\SDDiskTool_v1.74.zip
```

#### SN-Schreibwerkzeug

RKTools\windows\RKDevInfoWriteTool-1.3.0.7z. Archiv entpacken, installieren und die Software als Administrator starten.

Werkzeuganleitung:

```text
RKDocs\common\RKTools manuals\Rockchip_User_Guide_RKDevInfoWriteTool_CN.pdf
```

#### DDR-Lötprüfung

Prüft DDR-Hardwareverbindungen und hilft bei Defekten wie unzureichenden Lötstellen.

```text
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_CN.7z
RKTools\windows\Rockchip_Platform_DDR_Test_Tool_V1.38_Release_Annoucement_EN.7z
```

#### eFuse-Programmierwerkzeug

Programmiert eFuse; genannt für RK3288W/RK3368/RK3399.

```text
RKTools\windows\efuse_v1.37.rar
```

#### eFuse-/OTP-Signierwerkzeug

Signiert Images für eFuse/OTP.

```text
RKTools\windows\SecureBootTool_v1.94.zip
```

#### Flash-Werkzeug für Serienfertigung

Für das serienmäßige Flashen von Images in der Fabrik.

```text
RKTools\windows\FactoryTool-1.72.9.7z
```

#### userdata-Daten vorab paketieren

Erstellt ein Paket vorinstallierter Daten für die userdata-Partition.

```text
RKTools\windows\OemTool_v1.3.rar
```

#### Camera IQ Tool

Zum Abstimmen der ISP-Bildwirkung.

```text
external/camera_engine_rkaiq/rkisp2x_tuner
```

### Systemdebugging

#### ADB-Werkzeug

#### Übersicht

ADB (Android Debug Bridge) aus dem Android SDK steuert Emulatoren oder reale Geräte: Shell starten, Ports zuordnen, Dateien in beide Richtungen übertragen und lokale APKs installieren. Es handelt sich um ein Client-Server-System; die vereinfachte Quellenbeschreibung nennt den PC als Client und Gerät/Emulator als Server. Netzwerk-ADB nutzt kabelgebundene oder drahtlose Netze, USB-ADB ein USB-Kabel.

##### USB-ADB verwenden

Die Quelle nennt für ihr USB-ADB: nur OTG, keine gleichzeitigen Clients wie cmd/eclipse und nur ein angeschlossenes Gerät. Dies beschreibt das Handbuch, keine allgemeine ADB-Grenze. Verbindung:

1. Im laufenden Android unter Entwickleroptionen/Computerverbindung USB-Debugging aktivieren.

2. Den PC per USB-Kabel mit dem OTG-Port verbinden und folgenden Befehl ausführen.

```text
adb shell
```

3. adb devices prüfen. Erscheint die Seriennummer, besteht eine Verbindung.

#### Häufige ADB-Befehle

(1) Gerätestatus: verbundene Android-Geräte und Emulatoren auflisten:

```text
adb devices
```

Das Ergebnis enthält Seriennummer oder IP/Port sowie Gerätestatus. (2) APK installieren: die angegebene Datei auf das Gerät installieren:

```text
adb install <apk file path>
```

Beispiel:

```text
adb install “F:\WishTV\WishTV.apk”
```

Anwendung erneut installieren:

```text
adb install –r “F:\WishTV\WishTV.apk”
```

(3) APK vollständig deinstallieren:

```text
adb uninstall <package>
```

Beispiel:

```text
adb uninstall com.wishtv
```

(4) APK-Datei mit rm entfernen:

```text
adb shell rm <filepath>
```

Beispiel:

```text
adb shell rm “system/app/WishTV.apk”
```

Das Beispiel entfernt WishTV.apk aus system/app. (5) Shell des Geräts oder Emulators öffnen:

```text
adb shell
```

(6) Dateien vom PC zum Gerät: push überträgt Dateien oder Verzeichnisse. local bezeichnet den PC-Pfad, remote den Pfad der über ADB verbundenen Platine. Beispiel adb push:

```text
adb push “F:\WishTV\WishTV.apk” “system/app”
```

Das Beispiel kopiert die lokale WishTV.apk nach Android system/app. (7) Vom Gerät zum PC kopieren: pull lädt Dateien oder Verzeichnisse auf den lokalen Rechner.

```text
adb pull <remote path> <local path>
```

Beispiel:

```text
adb pull system/app/Contacts.apk F:\
```

Das Beispiel kopiert system/app nach lokal F:\. (8) Fehlerbericht: adb bugreport liefert dumpsys-, dumpstate- und logcat-Informationen. (9) Geräte-Systeminformationen: folgende Befehle in adb shell ausführen.

```text
adb shell getprop
```

#### Logcat-Werkzeug

Android logcat zeichnet Debug-Ausgaben von Programmen in Systempuffern auf und zeigt sie an. Damit lässt sich der Programmablauf untersuchen. Wegen der großen Protokollmenge ist meist Filterung erforderlich.

##### logcat-Befehl

Inhalt des logcat-Systempuffers anzeigen. Grundformat:

```text
[adb] logcat [<option>] [<filter-spec>]
```

Beispiel:

```text
adb shell
logcat
```

#### Übliche logcat-Filter

Die Ausgabe lässt sich nach Priorität begrenzen. Beispiel:

```text
adb shell
logcat *:W
```

Es erscheinen Meldungen ab warning. Filterung nach Tag und Priorität, Beispiel:

```text
adb shell
logcat ActivityManager:I MyApp:D *:S
```

Der gezeigte Filter bedeutet: ActivityManager ab Info und MyApp ab Debug; andere Tags werden unterdrückt. Die englische Quellenformulierung zur Ausnahme ist fehlerhaft. Nur einen bestimmten Tag ausgeben, Beispiel:

```text
adb shell
logcat WishTV:* *:S
```

oder

```text
adb shell
logcat –s WishTV
```

Nur WishTV-Meldungen erscheinen. Tag und Priorität gemeinsam begrenzen, Beispiel:

```text
adb shell
logcat WishTV:I *:S
```

Gemäß Filter erscheinen WishTV-Meldungen ab Priorität I.

#### Procrank-Werkzeug

Procrank läuft in der Android-Shell und zeigt einen Speicher-Snapshot der Prozesse. VSS (Virtual Set Size): virtueller Speicher einschließlich gemeinsamer Bibliotheken. RSS (Resident Set Size): tatsächlich belegter physischer Speicher einschließlich gemeinsamer Bibliotheken. PSS (Proportional Set Size): physischer Speicher mit anteilig zugerechneten gemeinsamen Seiten. USS (Unique Set Size): ausschließlich diesem Prozess gehörende physische Seiten ohne gemeinsame Bibliotheken. Beim Prozessende wird USS vollständig frei. VSS/RSS enthalten gemeinsame Bibliotheken und sind daher für Einzelprozesse weniger aussagekräftig; PSS verteilt gemeinsame Seiten proportional.

##### procrank verwenden

Vor Ausführung root-Rechte sicherstellen, etwa über su. Befehlsformat:

```text
procrank [ -W ] [ -v | -r | -p | -u | -h ]
```

Optionen: -v nach VSS, -r nach RSS, -p nach PSS, -u nach USS sortieren; -R kehrt die Sortierrichtung um; -w zeigt nur Working-Set-Statistik, -W setzt sie zurück; -h Hilfe. Speicher-Snapshot:

```text
procrank
```

Snapshot nach absteigendem VSS:

```text
procrank –v
```

procrank sortiert standardmäßig nach PSS.

##### Bestimmte Informationen suchen

Format zur Speicheranzeige eines bestimmten Prozesses:

```text
procrank | grep [cmdline | PID]
```

cmdline ist der Anwendungsname, PID die Prozesskennung. Speicher von systemUI:

```text
procrank | grep “com.android.systemui”
```

oder:

```text
procrank  | grep 3396
```

##### Prozessspeicher verfolgen

Zum Erkennen von Speicherlecks wiederholt Snapshots per Skript erzeugen und USS vergleichen. Beispiel für com.android.systemui:

1. test.sh erstellen.

```text
#!/bin/bash
while true;do
adb shell procrank | grep “com.android.systemui”
sleep 1
done
```

2. Nach der ADB-Verbindung ./test.sh ausführen.

#### Dumpsys-Werkzeug

Dumpsys läuft in der Android-Shell und zeigt den Zustand von Binder-Diensten. Voraussetzungen für Ausgaben:

1. Der Dienst muss in ServiceManager registriert sein.

2. Der Dienst muss dump implementieren; andernfalls erscheinen keine Daten.

##### Dumpsys verwenden

dumpsys-Hilfe anzeigen:

```text
dumpsys  -help
```

Diensteliste: zeigt Dienste mit verfügbaren dumpsys-Informationen; den benötigten Dienst auswählen.

```text
dumpsys  -l
```

Bestimmten Dienst ausgeben: dumpsys [servicename]. Beispiel SurfaceFlinger:

```text
dumpsys SurfaceFlinger
```

Dienst und Anwendung ausgeben: dumpsys [servicename] [application name]. Beispiel meminfo für com.android.systemui:

```text
dumpsys meminfo com.android.systemui
```

Den vollständigen Dienstnamen unter Beachtung der Groß-/Kleinschreibung angeben.

#### Last log aktivieren

Folgende zwei Knoten im DTS ergänzen.

```text
ramoops_mem: ramoops_mem {
    reg = <0x0 0x110000 0x0 0xf0000>;
    reg-names = "ramoops_mem";
};

ramoops {
    compatible = "ramoops";
    record-size = <0x0 0x20000>;
    console-size = <0x0 0x80000>;
    ftrace-size = <0x0 0x00000>;
    pmsg-size = <0x0 0x50000>;
    memory-region = <&ramoops_mem>;
};
```

```text
- Check last log in the device
130|root@rk3399:/sys/fs/pstore # ls
dmesg-ramoops-0   Log saved after last kernel panic
pmsg-ramoops-0    Log of last user space, android log
ftrace-ramoops-0    Print function trace during some period
console-ramoops-0  kernel log when last_log was enabled last time, but only save
the log with higher priority than default log level
```

Verwendung:

```text
cat dmesg-ramoops-0
cat console-ramoops-0
logcat -L （pmsg-ramoops-0） pull out by logcat and parse
cat ftrace-ramoops-0
```

#### FIQ-Modus

Bei Absturz oder Hängen über die serielle Schnittstelle fiq-Befehle zur Zustandsprüfung eingeben. Befehle:

```text
127|console:/ $ fiq
debug>  help
FIQ Debugger commands:
 pc            PC status
 regs          Register dump
 allregs       Extended Register dump
 bt            Stack trace
 reboot [<c>]  Reboot with command <c>
 reset [<c>]   Hard reset with command <c>
 irqs          Interupt status
 kmsg          Kernel log
 version       Kernel version
 sleep         Allow sleep while in FIQ
 nosleep       Disable sleep while in FIQ
 console       Switch terminal to console
 cpu           Current CPU
 cpu <number>  Switch to CPU<number>
 ps            Process list
 sysrq         sysrq options
 sysrq <param> Execute sysrq with <param>
```

## Häufige Fragen

### Welche Kernel- und U-Boot-Versionen werden verwendet?

Android 14.0 verwendet Kernel 6.1 und den U-Boot-Branch next-dev.

### RK-Veröffentlichung bestimmen für das aktuelle SDK

Das Rockchip-Android14.0-SDK enthält AOSP und RK-Änderungen. RK-Repositories stehen in XML-Dateien unter .repo/manifests/include, Standard-AOSP in .repo/manifests/default.xml. RK-Version ermitteln:

```text
vim .repo/manifests/include/rk_checkout_from_aosp.xml
<project groups="pdk" name="platform/build" path="build/make" remote="rk"
revision="refs/tags/android-14.0-mid-rkr1">
```

Dies bedeutet RK android-14.0-mid-rkr1. AOSP-Anteil:

```text
vim .repo/manifests/default.xml
<default revision="refs/tags/android-14.0.0_r11"...>
```

Dies bedeutet AOSP android-14.0.0_r11. Bei Anfragen genügen diese beiden Versionsangaben. Den Tag eines einzelnen Repositories zeigt folgender Befehl:

```text
kernel-6.1$ git tag
android-14.0-mid-rkr1
```

RK-Versionen steigen nach dem Muster android-14.0-mid-rkrxx; in diesem Beispiel wird android-14.0-mid-rkr1 als letzter Tag genannt.

### Vollständigkeit des lokalen SDK-Updates prüfen auf die letzte RK-Veröffentlichung

Bei SDK-Veröffentlichung werden Commit-Informationen in .repo/manifests/commit/ abgelegt. Der Vergleich zeigt, ob das Update vollständig ist. Zunächst die RK-Version wie oben bestimmen. Die Quelle nennt das Beispiel RKR6; folgender Befehl speichert lokale Commit-Informationen.

```text
.repo/repo/repo manifest -r -o release_manifest_rkr1_local.xml
```

.repo/manifests/commit/commit_release_rkr1.xml mit release_manifest_rkr1_local.xml vergleichen. Die Quelle ordnet die erste Datei RKR6 zu, im Widerspruch zu rkr1 im Namen; die tatsächliche Veröffentlichung prüfen.

### U-Boot- und Kernel-Logos ersetzen

U-Boot und Kernel zeigen beim Start das erste und zweite Logo. Dateien: kernel-6.1/logo.bmp und kernel-6.1/logo_kernel.bmp. Gleichnamige BMPs ersetzen und den Kernel neu bauen; das Ergebnis liegt in boot.img. Die Quelle nennt eine Bildgrößengrenze von 8M und BMP mit 8/16/24/32bit.

### Android ausschließlich mit 64 Bit betreiben ohne 32-Bit-Unterstützung

Für Android14 mit GMS-/EDLA-Zertifizierung verlangt die Quelle ausschließlich 64 Bit ohne 32-Bit-Unterstützung, um Speicher zu sparen. Beispiel rk3562_ugo: BoardConfig.mk im Produktverzeichnis wie folgt ändern.

```text
diff --git a/rk3562_ugo/BoardConfig.mk b/rk3562_ugo/BoardConfig.mk
index c06433e..dc9cc50 100644
--- a/rk3562_ugo/BoardConfig.mk
+++ b/rk3562_ugo/BoardConfig.mk
@@ -18,3 +18,11 @@ PRODUCT_KERNEL_DTS := rk3562-rk817-tablet-v10
 CAMERA_SUPPORT_AUTOFOCUS := true
 BOARD_BUILD_GKI := true
 include device/rockchip/rk3562/BoardConfig.mk
+
+DEVICE_IS_64BIT_ONLY := true
+
+TARGET_2ND_ARCH :=
+TARGET_2ND_ARCH_VARIANT :=
+TARGET_2ND_CPU_ABI :=
+TARGET_2ND_CPU_ABI2 :=
+TARGET_2ND_CPU_VARIANT :=
```

### Laden im ausgeschalteten Zustand und Vorladen

Laden bei ausgeschaltetem Gerät und niedriger Akkuspannung im DTS konfigurieren:

```text
charge-animation {
                compatible = "rockchip,uboot-charge";
                rockchip,uboot-charge-on = <1>;
                rockchip,android-charge-on = <0>;
                rockchip,uboot-low-power-voltage = <3400>;
                rockchip,screen-on-voltage = <3500>;
                status = "okay";
        };
```

rockchip,uboot-charge-on und rockchip,android-charge-on schließen sich gegenseitig aus. rockchip,uboot-low-power-voltage legt die Startspannung nach Vorladen fest, rockchip,screen-on-voltage die Spannung zum Einschalten des Displays. Beide Schwellen passend zum Gerät wählen.

### U-Boot-Ladelogo paketieren und ersetzen

Das Ladelogo am genannten Pfad durch eine gleichnamige Datei im ursprünglichen Format ersetzen.

```text
u-boot/tools/images/
├── battery_0.bmp
├── battery_1.bmp
├── battery_2.bmp
├── battery_3.bmp
├── battery_4.bmp
├── battery_5.bmp
└── battery_fail.bmp
```

Ist U-Boot-Laden aktiv, aber kein Logo sichtbar, fehlt es möglicherweise in resource.img. Mit folgendem Befehl paketieren:

```text
cd u-boot
./scripts/pack_resource.sh ../kernel-6.1/resource.img
cp resource.img ../kernel/resource.img
```

Der Befehl integriert das Logo in resource.img im Kernelverzeichnis. Danach resource.img erneut in boot.img paketieren; die Quelle nennt ./mkiamge.sh im Android-Stammverzeichnis (vermutlicher Tippfehler, im SDK prüfen). Anschließend boot.img aus rockdev/ flashen.

### HDMI IN konfigurieren

HDMI IN ist standardmäßig deaktiviert. Aktivierung:

```text
vim device/rockchip/rk3588/BoardConfig.mk
+BOARD_HDMI_IN_SUPPORT := true
```

### RM310 4G konfigurieren

4G ist standardmäßig deaktiviert. Aktivierung:

```text
vim device/rockchip/common/BoardConfig.mk
#for rk 4g modem
-BOARD_HAS_RK_4G_MODEM ?= false
+BOARD_HAS_RK_4G_MODEM ?= true
```

### Wi-Fi-Standby-Richtlinie

Standardmäßig bleibt Wi-Fi im Standby verbunden. Zum Trennen im Standby Folgendes verwenden:

```text
---
a/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaul
ts.xml
+++
b/rk3566_rgo/overlay/frameworks/base/packages/SettingsProvider/res/values/defaul
ts.xml
@@ -24,5 +24,5 @@
        You can configure persist.wifi.sleep.delay.ms to delay closing wifi.
        The default is 15 minutes, 0 means that the wifi is turned off
        immediately after the screen is off. -->
-    <integer name="def_wifi_sleep_policy">2</integer>
+    <integer name="def_wifi_sleep_policy">0</integer>
      </resources>
```

### Recovery drehen

Unterstützt werden 0/90/180/270 Grad, standardmäßig 0. Konfiguration:

```text
vim device/rockchip/common/BoardConfig.mk
#0:   ROTATION_NONE rotate 0 degree
#90:  ROTATION_RIGHT rotate 90 degrees
#180: ROTATION_DOWN rotate 180 degrees
#270: ROTATION_LEFT rotate 270 degrees
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

### Android Surface drehen

Für die Android-Anzeigedrehung in folgender Konfiguration 0/90/180/270 wählen.

```text
# For Surface Flinger Rotation
SF_PRIMARY_DISPLAY_ORIENTATION ?= 0
```

### Remote für AOSP-Quellen ersetzen

Bei langsamem Download der RK-Veröffentlichung schlägt die Quelle ein AOSP-Mirror in China oder Google für ausländische Kunden vor. Nach repo init oder Entpacken des Basisarchivs in .repo/manifests/remote.xml den AOSP-Remote-fetch ändern von:

```text
< remote name="aosp" fetch="./" review="https://10.10.10.29" />
```

auf einen chinesischen Mirror, beispielsweise Tsinghua; ein anderer ist ebenfalls möglich:

```text
< remote name="aosp" fetch="https://aosp.tuna.tsinghua.edu.cn" />;
```

Für ausländische Kunden: Google-Mirror:

```text
< remote name="aosp" fetch="https://android.googlesource.com" />
```

### Lese-/Schreibleistung von data optimieren

Für Geräte mit Akku schlägt die Quelle fsync_mode=nobarrier in den fstab-Mountparametern von data vor. Dies kann E/A beschleunigen, birgt aber Datenbeschädigungsrisiken, besonders ohne Akku; für Geräte ohne Akku wird davon abgeraten. Änderungen:

```text
cd device/rockchip/common

diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 2ec6c265..c890cc84 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -23,6 +23,6 @@ ${_block_prefix}odm     /odm      ext4 ro,barrier=1
${_flags},first_stage_mount
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065,fsync_mode=nobarrier
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
diff --git a/scripts/fstab_tools/fstab_go.in b/scripts/fstab_tools/fstab_go.in
index 582557f2..05c7653c 100755
```

```text
--- a/scripts/fstab_tools/fstab_go.in
+++ b/scripts/fstab_tools/fstab_go.in
@@ -17,6 +17,6 @@ ${_block_prefix}odm     /odm      ext4 ro,barrier=1
${_flags},first_stage_mount
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065i,fsync_mode=nobarrie
r latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quo
ta,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

### userdata auf EXT4 umstellen

data verwendet standardmäßig f2fs. Für Produkte ohne Akku empfiehlt die Quelle ext4, um das Datenverlustrisiko bei Stromausfall zu verringern. Beispiel rk3566_r:

```text
device/rockchip/common$ git diff
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 6e78b00..a658332 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -20,6 +20,6 @@ ${_block_prefix}system_ext /system_ext  ext4 ro,barrier=1
${_flags},first_stage_
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults
   voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
+#/dev/block/by-name/userdata /data f2fs
noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065
latemount,wait,check,fileencryption=aes-256-xts:aes-256-
cts:v2+inlinecrypt_optimized,quota,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
-#/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

```text
+/dev/block/by-name/userdata    /data      ext4
discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1
latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M
,checkpoint=block
```

```text
device/rockchip/rk356x$ git diff
diff --git a/rk3566_r/recovery.fstab b/rk3566_r/recovery.fstab
index 7532217..cf789ac 100755
--- a/rk3566_r/recovery.fstab
+++ b/rk3566_r/recovery.fstab
@@ -7,7 +7,7 @@
 /dev/block/by-name/odm                   /odm                 ext4
defaults                  defaults
 /dev/block/by-name/cache                 /cache               ext4
defaults                  defaults
 /dev/block/by-name/metadata              /metadata            ext4
defaults                  defaults
-/dev/block/by-name/userdata              /data                f2fs
defaults                  defaults
+/dev/block/by-name/userdata              /data                ext4
defaults                  defaults
 /dev/block/by-name/cust                  /cust                ext4
defaults                  defaults
 /dev/block/by-name/custom                /custom              ext4
defaults                  defaults
 /dev/block/by-name/radical_update        /radical_update      ext4
defaults                  defaults
```

### Start-/Abschaltanimation und Töne

Referenzdokument:

```text
RKDocs\android\Rockchip_Introduction_Android_Power_On_Off_Animation_and_Tone_Cus
tomization_CN&EN.pdf
```

### Leistungsmodus für Anwendungen

In device/rockchip/rk3xxx/package_performance.xml die Paketnamen für den Leistungsmodus im Knoten ergänzen. Den Paketnamen ermittelt aapt dump badging (file_path.apk).

```text
< app package="package name" mode="whether to enable the acceleration, 1 for
enable, 0 for disable"/>
```

Beispiel antutu:

```text
< app package="com.antutu.ABenchMark"mode="1"/>
< app package="com.antutu.benchmark.full"mode="1"\/>
< app package="com.antutu.benchmark.full"mode="1"\/>
```

Beim Build wird die Datei ins Image aufgenommen.

### GPU-Probleme debuggen

Folgende Dokumente zur ersten Diagnose verwenden.

```text
RKDocs\android\Rockchip_User_Guide_Dr.G_CN&EN.pdf
```

### OTP und eFuse

OTP-Liste der Quelle: RK3326, PX30, RK3566, RK3568, RK3588, RK3568S. eFuse-Liste: RK3288, RK3368, RK3399. Image-Signierung und OTP-/eFuse-Programmierung siehe:

```text
RKDocs\common\security\Rockchip-Secure-Boot-Application-Note-V1.9.pdf
```

### Softwareseitig erkennen, ob OTP/eFuse programmiert ist des Geräts

Der Zustand wird über fuse.programmed in der Kernel-cmdline übermittelt. fuse.programmed=1: Firmware per Secure Boot signiert und OTP/eFuse programmiert. fuse.programmed=0: Firmware signiert, OTP/eFuse noch nicht programmiert. Fehlt der Parameter, ist die Firmware nicht signiert und Miniloader übermittelt ihn nicht, oder Miniloader ist zu alt für diese Übermittlung.

### SELinux aktivieren/deaktivieren

In folgender Einstellung deaktiviert false und aktiviert true SELinux. Deaktivierung nur für kontrolliertes Debugging, nicht als Produktionsempfehlung.

```text
device/rockchip/common$
--- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -67,7 +67,7 @@ endif

 # Enable android verified boot 2.0
 BOARD_AVB_ENABLE ?= false
-BOARD_SELINUX_ENFORCING ?= false
+BOARD_SELINUX_ENFORCING ?= true
```

### Warnung „There's an internal problem with your device.“ nach dem Start

Die Quelle nennt zwei Ursachen:

1. Nicht passende Images: fingerprints von system/boot/vendor stimmen nicht überein.

2. Eine IO-Debug-Konfiguration ist aktiviert. Den zuvor beschriebenen Kernel-Build verwenden.

3. Für IO-Debug-Projekte bietet die Quelle zusätzlich unabhängig davon den folgenden Patch. Er entfernt die Warnung, behebt aber für sich keine Image-Inkompatibilität.

```text
diff --git
a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
index 595c340..d4e495a 100644
---
a/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
+++
b/services/core/java/com/android/server/wm/ActivityTaskManagerService.java
@@ -6555,7 +6555,7 @@ public class ActivityTaskManagerService extends
IActivityTaskManager.Stub {
                 } catch (RemoteException e) {
                 }

-                if (!Build.isBuildConsistent()) {
+                if (0 && !Build.isBuildConsistent()) {
                     Slog.e(TAG, "Build fingerprint is not consistent, warning
user");
                     mUiHandler.post(() -> {
                         if (mShowDialogs) {
```

### Ethernet-Einstellungen aktivieren in Settings

Settings zeigt standardmäßig keine Ethernet-Konfiguration. Bei Bedarf wie folgt aktivieren:

```text
  --- a/BoardConfig.mk
+++ b/BoardConfig.mk
@@ -146,3 +146,6 @@ endif
 ifeq ($(strip $(BOARD_USES_AB_IMAGE)), true)
 DEVICE_MANIFEST_FILE :=
device/rockchip/$(TARGET_BOARD_PLATFORM)/manifest_ab.xml
 endif

+# for ethernet
+BOARD_HS_ETHERNET := true
```

### AVB und Secure Boot

Beschreibung und Konfiguration von AVB/Secure Boot siehe:

```text
RKDocs/common/security/RK356X_SecurityBoot_And_AVB_instructions_CN.pdf
```

### IO-Befehle nicht verfügbar

IO-Befehle benötigen DEVMEM, das standardmäßig deaktiviert ist. Für kontrolliertes Debugging folgende Änderungen vornehmen:

```text
wlq@ubuntu:~/rk3562_Android14.0/$ vim mkcombinedroot/configs/android-14.config
```

Bei GO-Produkten zusätzlich ändern:

```text
wlq@ubuntu:~/rk3562_Android14.0$ vim mkcombinedroot/configs/android-14-go.config
```

Folgende Konfigurationszeile entfernen:

```text
# CONFIG_DEVMEM is not set
```

Beim Android-Build ist zusätzlich folgende Codeänderung nötig.

```text
cd rk3562_Android14.0/kernel/configs

diff --git a/android-6.1/android-base.config b/android-6.1/android-base.config
index 5de76f0..6dcdf86 100644
--- a/android-6.1/android-base.config
+++ b/android-6.1/android-base.config
@@ -2,7 +2,6 @@
 # CONFIG_ANDROID_LOW_MEMORY_KILLER is not set
 # CONFIG_ANDROID_PARANOID_NETWORK is not set
 # CONFIG_BPFILTER is not set
-# CONFIG_DEVMEM is not set
 # CONFIG_FHANDLE is not set
 # CONFIG_FW_CACHE is not set
 # CONFIG_IP6_NF_NAT is not set
wlq@sys2206:~/rk3562_Android14.0/kernel/configs$ git diff
diff --git a/u/android-6.1/android-base.config b/u/android-6.1/android-
base.config
index 29b9e98..c1b21cf 100644
--- a/u/android-6.1/android-base.config
+++ b/u/android-6.1/android-base.config
@@ -2,7 +2,6 @@
 # CONFIG_ANDROID_LOW_MEMORY_KILLER is not set
 # CONFIG_ANDROID_PARANOID_NETWORK is not set
 # CONFIG_BPFILTER is not set
-# CONFIG_DEVMEM is not set
 # CONFIG_FHANDLE is not set
 # CONFIG_FW_CACHE is not set
 # CONFIG_IP6_NF_NAT is not set
```

### Regeln für die Seriennummer SN

SN muss mit einem Buchstaben beginnen und darf höchstens 14 Byte lang sein.

### LZ4-Fehler beim Kernelbuild

Beispiel eines Fehlerprotokolls:

![Technische Originalabbildung 8](/docs/rockchip-rk3576-android14-sdk/assets/en-p050-figure-01.png)

Ursache: zu alte System-LZ4-Version; erforderlich ist mindestens 1.8.3.

```text
wlq@ubuntu:~$ lz4 -v
*** LZ4 command line interface 64-bits v1.8.3, by Yann Collet ***
refusing to read from a console
```

Die Quelle schlägt vor, System-LZ4 durch das von Android gebaute Programm zu ersetzen. Vor einem Systemwerkzeugersatz Pfade prüfen und die funktionierende Version sichern.

```text
sudo cp out/host/linux-x86/bin/lz4 /usr/bin/lz4
```

### Android Samba

Referenzdatei:

```text
RKDocs/android/Rockchip_Introduction_Android_Samba_CN.pdf
```

### NFS-Start

Dokumente und Patches:

```text
RKDocs/android/patches/customized_functions/nfs_boot_patch_v1.1.0.zip
```

### RK3528 DDR 4BIT Loader aktualisieren

```text
diff --git a/RKBOOT/RK3528MINIALL.ini b/RKBOOT/RK3528MINIALL.ini
index a7e3779..6a952cf 100644
--- a/RKBOOT/RK3528MINIALL.ini
+++ b/RKBOOT/RK3528MINIALL.ini
@@ -14,7 +14,7 @@ Path1=bin/rk35/rk3528_usbplug_v1.03.bin
 NUM=2
 LOADER1=FlashData
 LOADER2=FlashBoot
-FlashData=bin/rk35/rk3528_ddr_1056MHz_v1.05.bin
+FlashData=bin/rk35/rk3528_ddr_1056MHz_4BIT_PCB_v1.05.bin
```

### Mehrere Bildschirme und Touch

Referenzdokument:

```text
RKDocs\android\patches\customized_functions/Android11异显开发说明.zip
```

### Getrennter Ton für verschiedene Bildschirme

Referenzdokument:

```text
RKDocs/android/patches/customized_functions/Dual_Audio_v1.0.zip
```

## Anhang A. Build-Umgebung einrichten und Entwicklungsumgebung

### Build-Umgebung vorbereiten

Dieser Abschnitt beschreibt die lokale Android-Build-Umgebung als historische Quellenreferenz. Genannt werden Linux oder Mac OS; Windows-Builds werden nicht unterstützt. Life of a Patch beschreibt Codeprüfung und -aktualisierung. Ein vorangestelltes $ ist ein Shell-Prompt und wird nicht eingegeben. Der übernommene Webtext nennt Click to copy oder Dreifachklick zum Kopieren ohne $; dies sind keine Funktionen dieses Artikels.

### Branch wählen

Ein Teil der Anforderungen hängt von der zu bauenden Version ab. Verfügbare Branches sind unter Build Numbers beschrieben. Für den in der Quelle master genannten neuesten Branch wird bei repo init keine Branch-Angabe gesetzt. Danach die zum gewählten Branch passende Umgebung einrichten.

### Linux-Build-Umgebung

Die historischen Anweisungen gelten für die genannten Branches einschließlich master. Die Quelle nennt Tests auf Ubuntu LTS 14.04 und Debian testing; andere Distributionen benötigen passende Werkzeuge. Gingerbread 2.3.x und neuer verlangen eine 64-Bit-Umgebung, ältere Versionen konnten mit 32 Bit gebaut werden. Vollständige Anforderungen stehen unter Requirements, gefolgt von Ubuntu-/Mac-OS-Anweisungen. Dies empfiehlt Ubuntu14.04 nicht als heutige Android14-Umgebung.

### JDK installieren

AOSP master enthält vorkompiliertes OpenJDK unter prebuilts/jdk/; keine zusätzliche Installation nötig. Ältere Android-Versionen benötigen separates JDK, unter Ubuntu OpenJDK. Versionen siehe JDK Requirements. Für Ubuntu >=15.04 nennt die Quelle:

```text
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

Ubuntu LTS14.04: keine unterstützten OpenJDK8-Pakete. Laut Quelle funktionierten Ubuntu15.04-Pakete auf14.04, neuere15.10/16.04-Pakete mit diesem Verfahren dagegen nicht.

1. 64-Bit-.deb-Pakete von old-releases.ubuntu.com herunterladen:

```text
openjdk-8-jre-headless_8u45-b14-1_amd64.deb with SHA256
0f5aba8db39088283b51e00054813063173a4d8809f70033976f83e214ab56c0
openjdk-8-jre_8u45-b14-1_amd64.deb with SHA256
9ef76c4562d39432b69baf6c18f199707c5c56a5b4566847df908b7d74e15849
openjdk-8-jdk_8u45-b14-1_amd64.deb with SHA256
6e47215cf6205aa829e6a0a64985075bd29d1f428a4006a80c9db371c2fc3c4c
```

2. Optional Prüfsummen mit den angegebenen SHA256-Werten vergleichen, etwa mit sha256sum:

```text
sha256sum {downloaded.deb file}
```

3. Pakete installieren:

```text
sudo apt-get update
```

dpkg für jede .deb-Datei ausführen. Fehlende Abhängigkeiten können Fehler erzeugen:

```text
sudo dpkg -i {downloaded.deb file}
```

Fehlende Abhängigkeiten beheben:

```text
sudo apt-get -f install
```

Optional: Standard-Java für die genannten Ubuntu-Versionen mit folgendem Befehl umstellen.

```text
sudo update-alternatives --config javasudo update-alternatives --config javac
```

Bei Java-Versionsfehlern während des Builds siehe Wrong Java version. Die historische Paketinstallation für Ubuntu14.04 benötigt 64-Bit-Ubuntu; die Empfehlung14.04 gehört zum alten Quellanhang.

```text
sudo apt-get install git-core gnupg flex bison gperf build-essential zip curl
zlib1g-dev gcc-multilib g++-multilib libc6-dev-i386 lib32ncurses5-dev x11proto-
core-dev libx11-dev lib32z-dev ccache libgl1-mesa-dev libxml2-utils xsltproc
unzip python-pyelftools python3-pyelftools device-tree-compiler libfdt-dev
libfdt1
```

Für SELinux-Policyanalyse zusätzlich python-networkx installieren. Bei LDAP und ART-Hosttests außerdem libnss-sss:i386.

### USB-Zugriff konfigurieren

Unter GNU/Linux, insbesondere Ubuntu, haben normale Benutzer möglicherweise standardmäßig keinen direkten USB-Zugriff. Die Quelle schlägt vor, als root /etc/udev/rules.d/51-android.rules mit folgenden Zeilen zu erstellen und den Benutzernamen durch den tatsächlich berechtigten Benutzer zu ersetzen.

```text
# adb protocol on passion (Rockchip products)
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", ATTR{idProduct}=="0010", MODE="0600",
OWNER="<username>"
```

Die Regeln gelten beim nächsten Geräteanschluss; USB gegebenenfalls neu verbinden. Die Quelle nennt Ubuntu Hardy Heron8.04.x LTS und Lucid Lynx10.04.x LTS als getestet; andere Systeme können andere Einstellungen verlangen. Historische Referenz: http://source.android.com/source/initializing.html.

## Anhang B. SSH-Schlüsseloperationen Anleitung

### B-1. Öffentlichen SSH-Schlüssel erzeugen

Erzeugungsbefehl:

```text
ssh-keygen -t rsa -C "user@host"
```

user@host durch die eigene E-Mail-Adresse ersetzen.

![Technische Originalabbildung 9](/docs/rockchip-rk3576-android14-sdk/assets/en-p054-figure-01.png)

Nach erfolgreicher Ausführung entstehen die Schlüsseldateien im eigenen Verzeichnis.

![Technische Originalabbildung 10](/docs/rockchip-rk3576-android14-sdk/assets/en-p054-figure-02.png)

Privaten id_rsa und Passwort schützen; nur den öffentlichen id_rsa.pub an die SDK-Serververwaltung senden.

### B-2. Schlüssel mit keychain verwalten

Die Quelle empfiehlt das einfache Werkzeug keychain. Vorgehen:

1. keychain-Paket installieren.

```text
$sudo aptitude install keychain
```

2. Schlüsselverwendung konfigurieren.

```text
$vim ~/.bashrc
```

Folgenden Befehl ergänzen:

```text
eval `keychain --eval ~/.ssh/id_rsa`
```

id_rsa bezeichnet den privaten Schlüssel. Nach der Konfiguration erneut an der Konsole anmelden und gegebenenfalls das bei der Erzeugung gesetzte Passwort eingeben. sudo/root nur mit Verständnis der Folgen verwenden,

sonst entstehen Berechtigungs- und Schlüsselverwaltungsprobleme.

### B-3. Denselben SSH-Schlüssel auf mehreren Geräten verwenden Gemeinsamer Schlüssel

Das historische Quellenverfahren kopiert den privaten id_rsa nach ~/.ssh/id_rsa eines weiteren vertrauenswürdigen Geräts. Dies vergrößert den Risikobereich; Übertragung und Berechtigungen schützen. Bei falschem privaten Schlüssel erscheint folgende Meldung; den korrekten Schlüssel verwenden.

![Technische Originalabbildung 11](/docs/rockchip-rk3576-android14-sdk/assets/en-p055-figure-01.png)

Nach Ergänzen des richtigen Schlüssels kann git die Quellen klonen:

![Technische Originalabbildung 12](/docs/rockchip-rk3576-android14-sdk/assets/en-p055-figure-02.png)

Beim Hinzufügen des privaten SSH-Schlüssels kann folgender Fehler auftreten:

```text
Agent admitted failture to sign using the key
```

Zur Behebung nennt die Quelle folgenden Konsolenbefehl.

```text
ssh-add ~/.ssh/id_rsa
```

### B-4. SSH-Schlüssel wechseln auf einem Gerät

SSH gemäß ssh_config-Dokumentation konfigurieren.

```text
~$ man ssh_config
```

![Technische Originalabbildung 13](/docs/rockchip-rk3576-android14-sdk/assets/en-p056-figure-01.png)

Folgende Befehle konfigurieren SSH für den aktuellen Benutzer.

```text
~$ cp /etc/ssh/ssh_config ~/.ssh/config
~$ vi .ssh/config
```

Das Beispiel legt ~/.ssh1/id_rsa als alternativen privaten Schlüssel fest, um zwischen Schlüsseln zu wählen.

![Technische Originalabbildung 14](/docs/rockchip-rk3576-android14-sdk/assets/en-p056-figure-02.png)

### B-5. Schlüsselberechtigungen verwalten

Der Server überwacht Downloadanzahl, IP und weitere Daten pro Schlüssel. Bei Auffälligkeiten kann die Downloadberechtigung gesperrt werden. Den privaten Schlüssel schützen und Dritten keine Berechtigung übertragen.

### B-6. Git-Zugriff beantragen

Den öffentlichen Schlüssel wie oben erzeugen und über den vereinbarten FAE-Kanal SDK-Quellcodezugriff beantragen; die Kontaktadresse der Quelle wurde entfernt.

## Quellenunterschiede und Prüfungen vor der Anwendung

Beide Quellen tragen V1.0.0, im Kontext Android 14 RKR4. Chinesisches Dokument 789: 53 Seiten; englisches Dokument 790: 57 Seiten. Technischer Hauptteil, FAQ und Anhänge A/B bleiben erhalten. Chinesisch verwendet chinesische Originalabbildungen; Englisch, Russisch und Deutsch verwenden englische Originalabbildungen mit unveränderten UI-Beschriftungen.

- Chinesische Synchronisations-/Merge-Beispiele verwenden `android-14.0-mid-rkr4`, englische noch `android-14.0-mid-rkr1`; auch die Tag-Historien unterscheiden sich. Der chinesische RKR4-Befehl folgt unten. Spätere FAQ mischen RKR1/RKR6-Beschreibungen und Dateinamen; daraus folgt keine Austauschbarkeit der SDK-Releases.
- Chinesisch nennt bei lunch den Standard-DTS `rk3576-evb1-v10.dts`, Englisch nicht. Die chinesische Build-Hilfe endet mit `lunch rk3576_u-userdebug`, die englische enthält noch das fremde `lunch rk3588_t-userdebug`. Chinesisches Gesamtbeispiel: `./build.sh -UKAup`; die Tabelle nennt separat `./build.sh -AUCKu`. Groß-/Kleinschreibung und Optionen am Release-Skript prüfen.
- Chinesisch erklärt GKI als standardmäßig deaktiviert; der Patch ändert `BOARD_BUILD_GKI := false` in `true`, wodurch A/B automatisch aktiviert wird. Der englische Patch ist gleich, der Folgetext beschreibt jedoch das Abschalten von A/B mit false. False aktiviert GKI nicht. Chinesisch enthält super.img odm, vendor, system, product, system_ext; Englisch nennt nur die ersten drei. Die tatsächliche Produkt-Partitionskonfiguration prüfen.
- Zum Entfernen der 32-Bit-Unterstützung patcht Chinesisch `rk3576_u/BoardConfig.mk`; Englisch enthält noch `rk3562_ugo/BoardConfig.mk` und `rk3562-rk817-tablet-v10`. Das Originalbeispiel bleibt erhalten; unten folgt der chinesische RK3576-Patch. RK3562-Pfade nicht ungeprüft auf RK3576 übertragen.
- Englisch ergänzt RK3568S in der historischen OTP-Liste. Keine der Listen belegt RK3576-Unterstützung. Die RK3566/RK3568-Ausnahme für trust.img ist ebenfalls keine RK3576-Aussage. ramdis ist die Quellschreibweise; die Zeile boot-debug.img nennt mehrdeutig „dieses boot.img“: das Debug-Image prüfen.
- `logcat ActivityManager:I MyApp:D *:S` lässt ausschließlich diese Tags ab dem genannten Schweregrad durch und unterdrückt die übrigen; die genannten Tags werden nicht ausgeschlossen. `WishTV:I` umfasst I und höhere Schweregrade, nicht nur I. ADB mit einem Client/Host ist das Nutzungsmodell der Quelle, keine allgemeine Protokollbeschränkung.
- `mkiamge.sh`, Android_T/Android_U, `@android_t`/`@android_u` und alte Branch-Namen können übernommene Altbeispiele sein. Am SDK prüfen; Bezeichner wurden nicht stillschweigend ersetzt. Eine unterdrückte Kompatibilitätswarnung behebt keine inkompatiblen Images.
- Ubuntu 14.04, OpenJDK 8 und master in Anhang A sind historische Upstream-Anweisungen, keine aktuellen Android-14-Empfehlungen. SDK-Hauptteil und tatsächliche Release-Anforderungen haben Vorrang. F2FS `fsync_mode=nobarrier` birgt auch mit Akku Datenverlustrisiken bei Stromausfall; EXT4 bietet ebenfalls keine absolute Garantie.
- Flashen, Neupartitionierung und Werksreset können Daten löschen. Sichern und Platine, Images und Partitionstabelle prüfen. OTP/eFuse-Schreibvorgänge können irreversibel sein. Beispiele zu privaten SSH-Schlüsseln, authorized_keys und Berechtigungen nur in autorisierten Umgebungen anwenden: bestehende Autorisierungsdateien nicht leeren und private Schlüssel/Passwörter nicht weitergeben. Zur Freischaltung nur den öffentlichen Schlüssel übermitteln.


### Ergänzung aus der chinesischen Basis: RKR4-Merge und RK3576-64-Bit-Konfiguration

```text
git merge android-14.0-mid-rkr4
```

```diff
diff --git a/rk3576_u/BoardConfig.mk b/rk3576_u/BoardConfig.mk
index c06433e..dc9cc50 100644
--- a/rk3576_u/BoardConfig.mk
+++ b/rk3576_u/BoardConfig.mk
@@ -18,3 +18,11 @@ PRODUCT_KERNEL_DTS := rk3576-evb1-v10
 CAMERA_SUPPORT_AUTOFOCUS := true
 BOARD_BUILD_GKI := true
 include device/rockchip/rk3576/rk3576_u/BoardConfig.mk
+
+DEVICE_IS_64BIT_ONLY := true
+
+TARGET_2ND_ARCH :=
+TARGET_2ND_ARCH_VARIANT :=
+TARGET_2ND_CPU_ABI :=
+TARGET_2ND_CPU_ABI2 :=
+TARGET_2ND_CPU_VARIANT :=
```

Offizielle Dokumentation: [Rockchip](https://www.rock-chips.com/) · [Android](https://source.android.com/) · [ArmSoM](https://docs.armsom.org/).

{% endraw %}
