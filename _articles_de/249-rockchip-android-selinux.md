---
title: "Rockchip Android SELinux (Sepolicy): Entwicklerhandbuch"
description: "Rockchip Android SELinux (Sepolicy): Entwicklerhandbuch — sepolicy, init, Binder, HAL, AVC, Android 7.1–10"
excerpt: "Rockchip Android SELinux (Sepolicy): Entwicklerhandbuch"
translation_key: "249-rockchip-android-selinux"
slug: "249-rockchip-android-selinux"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "SELinux", "Sepolicy"]
---

{% raw %}

# Rockchip Android SELinux (Sepolicy): Entwicklerhandbuch

ArmSoM-Plattformreferenz auf Grundlage des chinesischen Rockchip-Dokuments RK-KF-YF-217 V1.0 im technischen Kontext von 2019. Behandelt werden BSP-Beispiele für Android 7.1, 8.0+ und teilweise 10.0; eine einheitliche SoC-, Kernel- oder ArmSoM-Board-Matrix fehlt. sepolicy-Verzeichnisse, init-Syntax, Partitionen und Buildvariablen mit dem tatsächlichen SDK abgleichen. Keine Hardwarevalidierung durchgeführt.

Root-, Flash-, Permissive- und sensible Berechtigungsbeispiele sind ausschließlich für autorisierte Entwicklungsgeräte bestimmt. Für die Produktion Mandatory Access Control wiederherstellen und prüfen; neverallow nicht umgehen und breite Freigaben nicht blind übernehmen. Vor Eingriffen Daten sichern. Es wurden keine Befehle ausgeführt.

## 1. Einführung in SeAndroid

### 1.1 Aufgabe von SeAndroid

Das Android-Sicherheitsmodell basiert teilweise auf Anwendungssandboxen: jede App läuft in ihrer eigenen Sandbox. Vor Android 4.3 erhielt jede App bei der Installation eine eigene uid; der ressourcenbezogene Zugriff folgte der traditionellen Linux Discretionary Access Control (DAC). Ab Android 4.3 grenzt SELinux die Sandboxen zusätzlich ein. Android verwendet Mandatory Access Control (MAC) für alle Prozesse einschließlich root; sepolicy begrenzt privilegierte Prozesse. Laut Quelle aktivierte Android 4.4 den Enforcing-Modus mit der AOSP-Standardpolicy. In diesem Modus werden Policy-Verletzungen blockiert und unzulässige Zugriffe in dmesg und logcat protokolliert. Die Protokolle helfen, Software und Policies zu verbessern. Diese historische Aussage bleibt als Quellenangabe erhalten, nicht als allgemeine Zusage für alle Versionen.

### 1.2 SeAndroid-Sicherheitsrichtlinie

Ein Sicherheitskontext ist ein Objektlabel aus SELinux-Benutzer, Rolle, Typ und Sicherheitsstufe, jeweils durch Doppelpunkt getrennt: `user:role:type:rank`. Anzeige mit `ps -Z`:

```text
LABEL                           USER     PID   PPID  NAME
u:r:init:s0                     root      1     0     /init
u:r:kernel:s0                  root      2     0     kthreadd
...
u:r:kernel:s0                  root      258   2     irq/322-HPH_R O
u:r:logd:s0                     logd      259   1     /system/bin/logd
u:r:healthd:s0                 root      260   1     /sbin/healthd
u:r:lmkd:s0                     root      261   1     /system/bin/lmkd
u:r:servicemanager:s0          system    262   1     /system/bin/servicemanager
u:r:vold:s0                     root      263   1     /system/bin/vold
```

Die linke Spalte ist der Prozess-SContext. Die Quelle nennt den ersten Prozess `/system/bin/logwrapper` mit `u:r:init:s0`, obwohl die erste Tabellenzeile `/init` zeigt. `u` bezeichnet den SELinux-Benutzer (SeAndroid definiert `u`), `r` eine Rolle. Ein Benutzer kann mehreren Rollen mit unterschiedlichen Rechten angehören. `init` ist die Prozessdomain beziehungsweise der Typ; die Quelle nennt mehr als 100 Android-Typen. `S0` ist die Schreibweise der Erklärung, das Beispiel verwendet `s0`. MLS klassifiziert Prozesse und Dateien; Zugriff verlangt die passende Stufe. Diese Quellenwidersprüche bleiben zur Prüfung sichtbar.

### 1.3 Wichtige SeAndroid-Dateien

Policy-Quelldateien enden auf `*.te` und definieren Domains und Labels. Unter `/device/manufacturer/device-name/sepolicy` können neue Dateien nötig sein; vorhandene Dateien jedoch möglichst aktualisieren. Es folgen die Kontextdateien.

1. `file_contexts` weist Dateien Labels zu und wird von mehreren Userspace-Komponenten verwendet. Bei neuen Labels erstellen oder aktualisieren. Das Dateisystemimage neu bauen oder betroffene Dateien mit `restorecon` neu labeln. Bei Upgrades gelten Änderungen automatisch für system und userdata. Für andere Partitionen nach dem Read-write-Mount `restorecon_recursive` in `init.board.rc` aufrufen.

2. `genfs_contexts` labelt Dateisysteme ohne erweiterte Attribute, etwa proc oder vfat. Es wird als Teil der Kernelpolicy geladen; Änderungen betreffen vorhandene Inodes möglicherweise nicht. Für vollständige Anwendung neu starten oder aus- und einhängen. Die Quelle nennt außerdem `context=mount` zur Labelzuweisung an eingebundene Dateisysteme wie vfat; die tatsächliche Mount-Syntax des Zielsystems prüfen.

3. `property_contexts` labelt Android-Systemeigenschaften und steuert, welche Prozesse sie setzen dürfen. init liest die Datei beim Booten.

4. `service_contexts` labelt Android-Binder-Dienste und steuert das Hinzufügen/Registrieren sowie Finden/Abfragen ihrer Binder-Referenzen durch Prozesse. servicemanager liest es beim Booten.

5. `seapp_contexts` labelt App-Prozesse und `/data/data`. zygote liest es bei jedem App-Start, installd beim Booten.

6. `mac_permissions.xml` weist seinfo-Tags anhand der App-Signatur und optional des Paketnamens zu. `seapp_contexts` nutzt seinfo als Schlüssel für spezifische Labels aller passenden Apps. system_server liest es beim Booten.

BoardConfig.mk: Nach Änderungen an Policy-/Kontextdateien `/device/rockchip/device-name/BoardConfig.mk` aktualisieren.

```text
BOARD_SEPOLICY_DIRS += \
        <root>/device/rockchip/device-name/sepolicy
```

Android 8.0+ benötigt den folgenden Teil nicht. Das Satzzeichen in `sepolicy.te。` bleibt als Quellenauffälligkeit erhalten.

```text
BOARD_SEPOLICY_UNION += \
        genfs_contexts \
        file_contexts \
        sepolicy.te。
```

## 2. Sepolicy-Probleme eingrenzen

1. Funktioniert etwas mit einem user-Image nicht, mit userdebug jedoch schon, können fehlende Berechtigungen die Ursache sein.

2. SELinux-Verweigerungen erscheinen als `avc:denied` in Kernel- oder Android-Logs. Zuerst Enforcing oder Permissive bestimmen. Bei reproduzierbaren Fehlern vorübergehend in Permissive testen, ob SELinux-Beschränkungen beteiligt sind. Nur für kontrolliertes Debugging verwenden.

```text
adb shell setenforce 0
```

Die Quelle bezeichnet `setenforce 0` als temporäres Aus- und `setenforce 1` als Einschalten. Präziser wird zwischen Permissive und Enforcing umgeschaltet; SELinux selbst wird nicht entfernt oder deaktiviert.

3. Die betreffenden Logs mit einem der Befehle erfassen:

```text
adb shell logcat | grep avc

adb shell dmesg | grep avc
```

## 3. Sepolicy-Regeln ergänzen und prüfen

### 3.1 Berechtigungen aus Logs ableiten

Beispiel 1

```text
audit(1444651438.800:8): avc: denied { search } for pid=158 comm="setmacaddr"
name="/" dev="nandi" ino=1 scontext=u:r:engsetmacaddr:s0
tcontext=u:object_r:vfat:s0 tclass=dir permissive=0
```

Fehlende Berechtigung: `search`; Subjekt: `engsetmacaddr`; Ziel: `vfat`; Dateiklasse: `dir`. Resultierende Quellregel:

```text
allow engsetmacaddr vfat:dir { search };
```

Beispiel 2

```text
auditd  (  627):  avc: denied { write } for pid=15848 comm=“system_server”
name=“enable” dev=“sysfs” ino=9381 scontext=u:r:zygote:s0
tcontext=u:object_r:sysfs:s0 tclass=file permissive=1
```

Fehlende Berechtigung: `write`; Subjekt: `scontext=u:r:zygote:s0`; Ziel: `tcontext=u:object_r:sysfs:s0`; Dateiklasse: `tclass=file`. Resultierende Quellregel:

```text
allow zygote sysfs:file write
```

Beispiel 3

```text
audit(1441759284.810:5): avc: denied { read } for pid=1494 comm="sdcard"
name="0" dev="nandk" ino=245281 scontext=u:r:sdcardd:s0
tcontext=u:object_r:system_data_file:s0 tclass=dir permissive=0
```

Fehlende Berechtigung: `read`; Subjekt: `sdcardd`; Ziel: `system_data_file`; Dateiklasse: `dir`. Resultierende Quellregel:

```text
allow sdcardd system_data_file:dir read
```

Beispiel 4: Besonderheiten von ioctl

```text
avc: denied { ioctl } for path="/dev/cmx_ddlsw" dev="tmpfs" ino=10422
ioctlcmd=4d02 scontext=u:r:system_server:s0
tcontext=u:object_r:cmx_ddlsw_device:s0 tclass=chr_file permissive=0
```

Nach Freigabe von ioctl den konkreten iocmd anhand des Quellcodes angeben. Die Originalregeln folgen (`chr_file` unterscheidet sich von `file`; `allowxperm` bleibt unverändert). Vor Anwendung mit dem Ziel-SDK abgleichen.

```text
allow system_server cmx_ddlsw_device:file { ioctl };
allowxperm system_server cmx_ddlsw_device:file ioctl { 0x4d02 };
```

1. AVC-Logs können Fehler nacheinander zeigen: nach Freigabe von read fehlt etwa write. Die Quelle empfiehlt kontrolliertes Debugging in Permissive, um mehr Verweigerungen zu sehen und wiederholte Versuche zu reduzieren.

2. Berechtigungen in geschweiften Klammern gruppieren oder Makros nutzen; die Quelle empfiehlt Makros für bessere Kompatibilität. Beispiel:

```text
allow engsetmacaddr vfat:dir { search write add_name create};
```

### 3.2 Regelerzeugung mit audit2allow vereinfachen

1. AVC-denied-Einträge aus logcat oder serieller Ausgabe extrahieren; dieses Beispiel erfasst alle Treffer:

```text
$ adb shell "cat /proc/kmsg | grep avc" > avc_log.txt
```

2. Policy mit audit2allow erzeugen, nachdem `source build/envsetup.sh` die Umgebung geladen hat. Die Quelle schreibt hier auch audio2allow; dies ist als Quellfehler dokumentiert.

```text
$ audit2allow -i avc_log.txt
```

3. Die Policy in die passende te-Datei eintragen, meist unter `/device/<company>/common/sepolicy` oder `/device/<company>/$DEVICE/sepolicy`. Das tatsächliche Verzeichnis mit `get_build_var` wie in Kapitel 5 bestimmen. Generierte Rechte prüfen, nicht blind vollständig freigeben.

### 3.3 Änderungen wirksam machen

Anhand der Logs die entsprechenden Policy-Dateien unter `$SDK/device/rockchip/common` ändern. Unter Android 8.0+ `vendor.img`, bei älteren Versionen `boot.img`, neu bauen, flashen und prüfen. Für Android 10.0 nennt die Quelle `odm.img` über fastboot.

## 4. GMS-bezogene Tests

```text
GtsSecurityHostTestCases
CtsSecurityHostTestCases
```

## 5. Berechtigungen für neue Bootdienste

### 5.1 Framework-Dienst ergänzen: redmine:179485

Ein Java-Binder-Dienst kann erforderlich sein, um Framework-Schnittstellen aufzurufen oder Apps besondere Schnittstellen bereitzustellen:

```text
    @Override
    public void onStart() {
        publishBinderService("ccc_service", new BinderService());

        publishLocalService(CCCServiceInternal.class, new LocalService());

        Watchdog.getInstance().addMonitor(this);
        Watchdog.getInstance().addThread(mHandler);
    }
```

`get_build_var BOARD_PLAT_PRIVATE_SEPOLICY_DIR` ausführen. Im ausgegebenen Verzeichnis `service.te`, beispielsweise `device/rockchip/common/sepolicy/private/service.te`, bearbeiten und ergänzen:

```text
type ccc_service, system_api_service, system_server_service, service_manager_type;
```

Anschließend diese Kontextzuordnung am Ende von `device/rockchip/common/sepolicy/private/service_contexts` im selben Verzeichnis ergänzen. Die Quelle erwähnt auch ein Verzeichnis service_context. Den Unterschied zwischen `ccc` hier und `ccc_service` oben prüfen.

```text
ccc u:object_r:ccc_service:s0
```

### 5.2 Binärdienst mit Autostart: Android 7.1

Eine Binärdatei oder ein Skript für den Boot-Autostart ergänzen, etwa `rockchip.sample.nougat.sh`.

```text
#! /system/bin/sh
echo "starting service..."
```

Die erste Skriptzeile muss den Shell-Pfad enthalten; die Quelle verlangt wie oben ein Leerzeichen nach `!`. Die zu ändernden Dateien liegen in den Verzeichnissen aus `get_build_var BOARD_SEPOLICY_DIRS`.

Den Dienst in init.rc, einer anderen geladenen rc-Datei oder einer neu deklarierten rc-Datei definieren.

```text
service rockchip-sample-nougat-sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Format: `service service_name service_path`. Das Skript muss ausführbar sein, direkt auf den Dienstnamen folgen und ein file_context-Label erhalten. Nicht `/system/bin/sh xxx.sh` verwenden: dann wäre sh/shell statt des Skripts das Dienstsubjekt. `class` bestimmt die Startphase; nach Bedarf anpassen. `oneshot` bedeutet einmaligen Start. Für nicht automatisch startende Dienste nennt die Quelle `disable` und `start servic_name`; beide Schreibweisen vor Verwendung anhand der init-Syntax prüfen.

Fehlerhaftes Skriptdienst-Beispiel:

```text
service rockchip-sample-nougat-sh /system/bin/sh /system/bin/rockchip.sample.nougat.sh
    class main
    user root
    group root wifi
    oneshot
```

Die Domain in einer neuen `rockchip_sample_nougat.te` unter sepolicy deklarieren:

```text
type rockchip_sample_nougat, domain;
type rockchip_sample_nougat_exec, exec_type, file_type;

init_daemon_domain(rockchip_sample_nougat)
```

Die ausführbare Datei labeln und mit der te-Deklaration verbinden; in `file_contexts` unter sepolicy ergänzen:

```text
/system/bin/rockchip\.sample\.nougat\.sh u:object_r:rockchip_sample_nougat_exec:s0
```

Format: `service_path u:object_r:te_type_name_exec:s0`, passend zum deklarierten te-Typ. Escape-Zeichen `\` beachten. Damit ist das Beispiel abgeschlossen.

### 5.3 Binärdienst mit Autostart: Android 8.0+

Alle Dateien liegen in Verzeichnissen aus `get_build_var BOARD_SEPOLICY_DIRS`. Das Beispiel xxxservice ähnelt Android 7.1, Programm/Skript müssen jedoch unter vendor/bin/ liegen. 1. init.rc oder andere rc-Datei:

```text
service xxxservice /vendor/bin/xxxservice
    class main
    oneshot
```

2. xxxservice.te: Den exec-Typ zusätzlich mit vendor_file_type verbinden.

```text
type xxxservice, domain;
type xxxservice_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(xxxservice)
```

3. file_contexts: Wie bei Android 7.1 ergänzen:

```text
/vendor/bin/xxxservice u:object_r:xxxservice_exec:s0
```

### 5.4 Vollständiges Binärdienst-Beispiel für Android 7.1–9.0 (interner Verweis)

```text
https://10.10.10.29/#/q/topic:%22npu+monitor+service%22
```

Dies ist die interne Netzwerkadresse der Quelle; sie wurde nicht aufgerufen und ist möglicherweise extern nicht erreichbar.

### 5.5 HAL-Dienst unter Android 8.0+ ergänzen

Android 8.0 führt hwservice ein; die Konzepte erläutert Googles Dokumentation. Typische Anwendungen sind NFC-, Fingerabdruck- und Iriserkennungsmodule. Dieses Beispiel ergänzt einen NXP-NFC-HAL-Dienst.

Instance-Knoten ergänzen: `get_build_var DEVICE_MANIFEST_FILE` ausführen, die ausgegebene Datei (etwa `device/rockchip/common/manifest.xml`) bearbeiten und den Dienstknoten ergänzen:

```text
 <hal format="hidl">
        <name>vendor.nxp.nxpnfc</name>
        <transport>hwbinder</transport>
        <version>1.0</version>
        <interface>
            <name>INxpNfc</name>
            <instance>default</instance>
        </interface>
    </hal>
```

Einheitlicher Start über hwservice; rc-Beispiel:

```text
service vendor.nxp.nxpnfc-1-0 /vendor/bin/hw/vendor.nxp.nxpnfc@1.0-service

    class hal
    user system
    group system
```

`class hal` in rc ordnet den Dienst HAL zu; laut Quelle erfolgt der Start über hwservice in der start-hal-Phase von init.

hwservice deklarieren: `get_build_var BOARD_SEPOLICY_DIRS` ausführen und hwservice.te im ausgegebenen Verzeichnis bearbeiten.

```text
type vnd_nxpnfc_hwservice, hwservice_manager_type;
```

Dienstdatei labeln: Verzeichnis erneut mit `get_build_var BOARD_SEPOLICY_DIRS` bestimmen und file_contexts bearbeiten:

```text
/vendor/bin/hw/vendor\.nxp\.nxpnfc@1\.0-service u:object_r:nxpnfc_hal_exec:s0
```

Manifest-Instance verbinden: hwservice_contexts unter `get_build_var BOARD_SEPOLICY_DIRS` bearbeiten. Der Name muss zur neuen Manifest-Instance passen.

```text
vendor.nxp.nxpnfc::INxpNfc u:object_r:vnd_nxpnfc_hwservice:s0
```

Dienst deklarieren: nxpnfc.te im Verzeichnis aus `get_build_var BOARD_SEPOLICY_DIRS` anlegen. Das abschließende add_hwservice wird nur benötigt, wenn der nfc-Prozess den neuen Dienst startet.

```text
type nxpnfc_hal, domain;
type nxpnfc_hal_exec, exec_type, vendor_file_type, file_type;
init_daemon_domain(nxpnfc_hal)
add_hwservice(nfc, vnd_nxpnfc_hwservice)
```

## 6. Fehlerbehebung für Android 8.0+

### 6.1 Wie lässt sich SELinux unter Android 8.0+ deaktivieren?

Laut Quelle kann SELinux unter Android 8.0+ nicht deaktiviert werden, sondern nur in Permissive laufen. Am Ende eines Logs bedeutet `permissive=0` eine durchgesetzte Verweigerung; bei `permissive=1` ist diese informativ und blockiert die Operation nicht. `adb shell getenforce` zeigt permissive beziehungsweise enforcing. Dies beschreibt den BSP-Kontext der Quelle und ersetzt keine Sicherheitsprüfung des Zielbuilds.

### 6.12 Wie wird SELinux auf Permissive gesetzt?

`androidboot.selinux=permissive` in cmdline ergänzen. Zunächst den uboot-Branch bestimmen:

```text
cd u-boot; git branch -a
```

develop: in parameter.txt ergänzen. next-dev: in bootargs des chosen-Knotens einer Kernel-dts, etwa px30-android.dtsi, ergänzen.

### 6.13 Wie wird Permissive in user-Firmware aktiviert?

Nach Abschnitt 6.12 die folgende Quelländerung unter system/core vornehmen. Sie ist eine Debugging-Referenz, keine Standard-Sicherheitsrichtlinie für die Produktion.

```text
kenjc@ubuntu:~/1_RK3326_P_29/system/core/init$ git diff
diff --git a/init/Android.mk b/init/Android.mk
index c4a6a50..58161ca 100644
--- a/init/Android.mk
+++ b/init/Android.mk
@@ -14,7 +14,7 @@ init_options += \
 else
 init_options += \
     -DALLOW_LOCAL_PROP_OVERRIDE=0 \
-    -DALLOW_PERMISSIVE_SELINUX=0 \
+    -DALLOW_PERMISSIVE_SELINUX=1 \
     -DREBOOT_BOOTLOADER_ON_PANIC=0 \
     -DWORLD_WRITABLE_KMSG=0 \
     -DDUMP_ON_UMOUNT_FAILURE=0
```

### 6.2 Warum kann eine App trotz ergänzter Rechte in Permissive nicht auf einen Knoten zugreifen?

Die Quelle erkennt sensible Berechtigungen an `c512,c768` im Log. Eine versuchte Ergänzung in untrusted_app.te lautet:

```text
allow untrusted_app audio_device:chr_file { open write read };
```

Dennoch erscheint folgende Verweigerung:

```text
[ 141.935275] type=1400 audit(1546939304.786:43): avc: denied { write } for
pid=1836 comm="Thread-4" name="pcmC0D1c" dev="tmpfs" ino=11947
scontext=u:r:untrusted_app:s0:c512,c768 tcontext=
u:object_r:audio_device:s0 tclass=chr_file permissive=1
```

Zuerst prüfen, ob der Knoten zum sensiblen audio_device gehört. Möglichst das angesprochene Verzeichnis/die Datei ändern und den Typbereich eingrenzen.

1. Den genauen Knoten aus Quellcode oder Logs bestimmen, etwa `/dev/pcmc00xx`.
2. Einen neuen Typ in der passenden te-Datei, etwa file.te, deklarieren:

```text
type test_audio_device, dev_type;
```

3. Den konkreten Knoten in file_context an den neuen Typ binden:

```text
/dev/pcmc00xx u:object_r:test_audio_device:s0
```

4. Die benötigten Rechte ergänzen oder ändern:

```text
allow untrusted_app test_audio_device:chr_file { open write read };
```

Die Quelle nennt bei Verzicht auf GMS-Zertifizierung auch mlstrustedobject, rät jedoch wegen schwerwiegender Sicherheitsprobleme ausdrücklich davon ab. Das folgende unsichere Quellbeispiel bleibt dokumentiert und ist keine Empfehlung:

```text
typeattribute audio_device mlstrustedobject;
```

### 6.3 Warum startet ein neuer Dienst unter Android 8.0+ nicht?

Anhand von Kapitel 5 prüfen. Neue Dienste unter Android 8.0+ gehören nach vendor.

### 6.4 Buildfehler nach Rechtevergabe: neverallow xxx

Die Quelle führt dies auf zu breite Rechte zurück und empfiehlt deren Eingrenzung durch explizite Deklaration der tatsächlich benötigten Knoten. Sie verweist auf „Abschnitt 2“; das konkrete Regelwerk und die neverallow-Meldung prüfen, statt Einschränkungen zu entfernen.

### 6.5 Systembefehle über system() funktionieren in vendor-Binärdiensten ab Android 8.0 nicht

Der PATH des vendor-Dienstes wird auf `/vendor/bin:/vendor/xbin` überschrieben; Befehle der system-Partition werden daher nicht gefunden.

```text
cc_binary {
    name: "sh_vendor",
    defaults: ["sh-defaults"],
    stem: "sh",
    vendor: true,
    cflags: [
        // Additional flags for vendor variant
        "-UMKSH_DEFAULT_PROFILEDIR",
        "-UMKSHRC_PATH",
        "-UMKSH_DEFAULT_EXECSHELL",
        "-DMKSH_DEFAULT_PROFILEDIR=\"/vendor/etc\"",
        "-DMKSHRC_PATH=\"/vendor/etc/mkshrc\"",
        "-DMKSH_DEFAULT_EXECSHELL=\"/vendor/bin/sh\"",
        "-DMKSH_DEFPATH_OVERRIDE=\"/vendor/bin:/vendor/xbin\"",
    ],
}
```

Den system-Pfad innerhalb des Aufrufs ergänzen, beispielsweise:

```text
system("export PATH=$PATH:/system/bin; input tap 0 0");
```

system erzeugt per fork einen Kindprozess: export und input nicht getrennt aufrufen, sondern innerhalb desselben Aufrufs gemeinsam ausführen.

### 6.6 Welche Verzeichnisse werden geändert, und wie werden Änderungen wirksam?

Dateien mit den get_build_var-Befehlen der jeweiligen Abschnitte bestimmen. Laut Quelle muss system/sepolicy unter Android 8.0+ nicht geändert werden; fehlende Zieldateien neu anlegen. Buildzuordnungen folgen; am tatsächlichen BSP prüfen:

```text
BOARD_SEPOLICY_DIRS/BOARD_PLAT_PUBLIC_SEPOLICY_DIR -> vendor/etc/selinux
BOARD_PLAT_PRIVATE_SEPOLICY_DIR -> system/etc/selinux
```

### 6.7 Warum bleibt denied trotz ioctl-Freigabe bestehen?

ioctl greift direkt auf Treiber zu und umfasst Tausende Befehle; deshalb muss die Berechtigung den konkreten cmd nennen. Siehe Beispiel 4 in Abschnitt 3.1.

## Redaktionelle Hinweise und Quellen

- Kein entsprechendes englisches PDF vorhanden; Englisch, Russisch und Deutsch sind vollständige Übersetzungen des chinesischen Fachtexts. Alle sechs Kapitel auf zehn Seiten einschließlich des Fachtexts auf Seite 1 bleiben erhalten. Technische Abbildungen gibt es nicht. Nichttechnische Deckblatttabellen, Inhaltsverzeichnis und Einstufung wurden entfernt.
- Erläuterungen in grauen Kästen wurden als editierbarer Text statt als Code wiederhergestellt. Logs, Regeln, Java, init, XML, Patches und Buildbeispiele bleiben enthalten. Doppelte fi-Ligaturen an derselben Position, Codeumbrüche, verschobene Erläuterungen und visuelle Befehlsumbrüche wurden korrigiert.
- Quellenprobleme bleiben sichtbar: /system/bin/logwrapper gegenüber /init; S0/s0; ccc/ccc_service; fehlende Semikolons bei allow; chr_file/file und allowxperm; audio2allow; sepolicy.te。; disable; servic_name; context=mount; ältere Pfade und Imagezuständigkeiten. Mit dem Ziel-SDK abgleichen. Die Nummerierung 6.12/6.13 bleibt erhalten.
- Die Quelle deutet c512,c768 als sensible Berechtigungen und nennt Eingrenzung als Lösung für neverallow-Buildfehler. Das sind Quellenerklärungen, keine bestätigten universellen Diagnosen. Das unsichere mlstrustedobject-Beispiel und die Warnung vor gravierenden Risiken bleiben erhalten.
- GTS/CTS sind Testnamen der Quelle, keine ArmSoM-Ergebnisse. Der interne Link wurde nicht geöffnet. Alle Sprachen teilen denselben wiederhergestellten Code; Erklärungen sind kein ausführbarer Code.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/) · [AOSP SELinux](https://source.android.com/docs/security/features/selinux/customize)

{% endraw %}
