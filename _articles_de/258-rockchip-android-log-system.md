---
title: "Rockchip Android-Logsystem: Ausnahmen, Kernel-Panic und Protokollverwaltung"
description: "Rockchip Android-Logsystem: Ausnahmen, Kernel-Panic und Protokollverwaltung"
excerpt: "Rockchip Android-Logsystem: Ausnahmen, Kernel-Panic und Protokollverwaltung"
translation_key: "258-rockchip-android-log-system"
slug: "258-rockchip-android-log-system"
lang: "de"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android", "log", "panic"]
---

{% raw %}

# Rockchip Android-Logsystem: Ausnahmen, Kernel-Panic und Protokollverwaltung

Plattformreferenz für ArmSoM: vollständiger technischer Inhalt der 8-seitigen Einführung zum Rockchip Android-LOG-System. Der Dateiname enthält keine Sprachangabe, der Text ist jedoch chinesisch; eine separate englische Quelle fehlt. Englisch, Russisch und Deutsch sind vollständige Übersetzungen mit allen vier chinesisch beschrifteten Originalscreenshots und lokalisierten Anweisungen. Das Deckblatt nennt V1.1.0, die letzte interne technische Version lautet v1.2.0; dieser Unterschied bleibt vermerkt, maßgeblich ist der eigentliche Inhalt. Die Tabelle beschreibt den Quellumfang, keine geprüfte Unterstützung sämtlicher ArmSoM-Platinen.

| Produkt | Kernel |
| --- | --- |
| ALL | linux-5.10 |

## Übersicht des RK-LOG-Systems

RK Log ist ein durch Fehlerereignisse ausgelöstes Protokollierungssystem für die folgenden Aufgaben.

1. Es funktioniert in user-Builds. Um übermäßige Protokollierung zu vermeiden, entstehen Fehlerprotokolle bei Ausnahmen; Startaufzeichnungen werden unten separat beschrieben.

2. Nach Kernel-Panic und Neustart speichert es die Kernelinformationen des vorherigen Panic.

3. Nach dem Android-Start erfasst es Protokolle zu Android-Ausnahmen wie system crash, ANR, watchdog, lowmem und tombstone.

4. Alle Protokolle liegen in `/data/user_de/0/com.android.shell/files/bugreports`. Sie lassen sich per adb abrufen oder auf USB-Datenträger bzw. SD-Karte kopieren. Dafür die native Android-App Files verwenden. Zuerst die Entwickleroptionen aktivieren, dann den Originalscreenshots unten folgen.

Schritt 1: Einstellungen öffnen und Storage auswählen.

![Schritt 1: Einstellungen öffnen und Storage auswählen.](/docs/rockchip-android-log-system/assets/unspecified-p003-figure-01.png)

Schritt 2: unter Storage auf Documents & other klicken, um Dokumente anzuzeigen.

![Schritt 2: unter Storage auf Documents & other klicken, um Dokumente anzuzeigen.](/docs/rockchip-android-log-system/assets/unspecified-p004-figure-01.png)

Schritt 3: in Documents auf die Menütaste oben links tippen oder von links nach rechts wischen, um das Menü zu öffnen.

![Schritt 3: in Documents auf die Menütaste oben links tippen oder von links nach rechts wischen, um das Menü zu öffnen.](/docs/rockchip-android-log-system/assets/unspecified-p005-figure-01.png)

Schritt 4: Bug reports auswählen, um erfasste Protokolle aufzulisten. Im Dateimanager lassen sie sich kopieren oder löschen. Vor dem Löschen den erfolgreichen Export benötigter Protokolle prüfen.

![Schritt 4: Bug reports auswählen, um erfasste Protokolle aufzulisten. Im Dateimanager lassen sie sich kopieren oder löschen. Vor dem Löschen den erfolgreichen Export benötigter Protokolle prüfen.](/docs/rockchip-android-log-system/assets/unspecified-p006-figure-01.png)

5. Der symbolische Link `bugreports` im Stammverzeichnis verweist auf `/data/user_de/0/com.android.shell/files/bugreports`; Dateien sind daher direkt über `/bugreports/` erreichbar:

```text
rk3588_s:/ $ ls bugreports -l
lrw-r--r-- 1 root root 50 2022-09-16 07:36 bugreports -> /data/user_de/0/com.android.shell/files/bugreports
```

## Bedienungshinweise

Jede Ausnahme erzeugt eine ZIP-Datei, deren Name mit einem Datum beginnt. Nach Zeit sortieren, um die zuletzt ausgelösten Protokolle zu finden, beispielsweise:

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-10-04-27-SYSTEM_BOOT.zip  2023-03-14-10-04-30-TOMBSTONE.zip
2023-03-14-10-04-34-TOMBSTONE.zip  2023-03-14-10-04-39-system_app_crash.zip
```

### Start und Android-Neustart

Beim Gerätestart wird ein Startprotokoll erzeugt:

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-10-04-27-SYSTEM_BOOT.zip
```

Dateien mit späterem Zeitstempel gehören zum aktuellen Startvorgang. Bei einem Android-Neustart entsteht eine Datei mit SYSTEM_RESTART im Namen:

```text
rk3588_s:/ $ ls bugreports/
2023-03-14-09-12-03-SYSTEM_RESTART.zip
```

Diese Dateinamen zeigen den Systemstart und den Zeitpunkt des Android-Neustarts an.

### Kernel-Neustart und Hänger

Beim Kernel geht es um Neustarts und Hänger. Mit den im Original beschriebenen RK-Voreinstellungen führen nur manche Fälle, etwa segment fault, zu Panic und Neustart; bei hard lock, soft lock oder rcu stall kann das System hängen bleiben. Wenn eine serielle Verbindung möglich ist, darüber mit dem fiq-Werkzeug weitere Protokolle erfassen. Andernfalls empfiehlt das Original folgende Optionen für Neustart und Protokollerfassung:

```diff
+CONFIG_BOOTPARAM_HUNG_TASK_PANIC=y
+CONFIG_BOOTPARAM_SOFTLOCKUP_PANIC=y
+CONFIG_BOOTPARAM_HARDLOCKUP_PANIC=y
+CONFIG_BOOTPARAM_RCU_STALL_PANIC=y
```

Die im Original beschriebenen Patches und das SDK aktivieren diese Optionen standardmäßig nur in user-Builds. Für userdebug die betreffenden Optionen in `arch/arm64/configs/rockchip_defconfig` ergänzen. Beispiel einer erfassten Ausnahme:

```text
rk3588_s:/ $ ls bugreports/
2022-09-24-09-58-10-kernel_panic.zip
```

Dieses Archiv enthält das ausführliche Kernel-Panic-Protokoll.

### Android-Ausnahmetypen

| Ausnahme | Bedeutung |
| --- | --- |
| TOMBSTONE | Absturz auf Native-Ebene |
| system_server_crash | Absturz eines Systemdiensts |
| system_server_anr | ANR eines Systemdiensts |
| system_server_lowmem | Speichermangel |
| system_server_watchdog | Watchdog-Ausnahme in system_server |
| SYSTEM_RESTART | Android-Neustart |
| system_app_crash | Erzwungenes Schließen einer System-App |
| system_app_anr | ANR einer System-App |
| system_server_wtf | Schwerer Fehler im Android-Framework; wtf steht für What a Terrible Failure |
| data_app_anr | ANR einer vom Benutzer installierten App |
| data_app_crash | Absturz einer vom Benutzer installierten App |
| data_app_wtf | wtf einer vom Benutzer installierten App |

Die Eigenschaft `persist.sys.rklog.level` steuert die erfassten Ausnahmen. Bei 0 werden keine Android-Ausnahmeprotokolle gesammelt, nur Kernel-Panic-Ausnahmen bleiben. Standardwert ist 7. Definitionen:

```c
enum {
    DROPBOX_SYSTEM_SERVER_CRASH = 1,
    DROPBOX_SYSTEM_SERVER_ANR = 2,
    DROPBOX_SYSTEM_SERVER_LOWMEM = 3,
    DROPBOX_SYSTEM_SERVER_WATCHDOG = 4,
    DROPBOX_SYSTEM_RESTART = 5,
    DROPBOX_SYSTEM_APP_CRASH = 6,
    DROPBOX_SYSTEM_APP_ANR = 7,
    DROPBOX_SYSTEM_SERVER_WTF = 8,
    DROPBOX_SYSTEM_APP_WTF = 9,
    DROPBOX_DATA_APP_ANR = 10,
    DROPBOX_DATA_APP_CRASH =11,
    DROPBOX_DATA_APP_WTF = 12,
    DROPBOX_MAX_ENTRY,
};
```

`persist.sys.rklog.level=7` aktiviert DROPBOX_SYSTEM_APP_ANR und die davor stehenden dropbox-Einträge: ein geordneter Schwellwert, keine Bitmaske. Tombstone löst standardmäßig aus, außer bei `persist.sys.rklog.level=0`. Das Enum enthält außerdem DROPBOX_SYSTEM_APP_WTF=9, das im Quelltext nicht separat erläutert wird; die Definition bleibt erhalten. Der Ausnahmetyp steht im Dateinamen, beispielsweise:

```text
2022-09-24-09-58-17-SYSTEM_BOOT.zip     2022-09-24-09-58-10-kernel_panic.zip
2022-09-24-09-55-10-system_app_crash.zip   2022-09-24-09-58-24-system_app_crash.zip
2022-09-24-09-55-16-system_app_crash.zip   2022-09-24-10-01-24-system_app_crash.zip
```

### Speichergrenze und Bereinigung

Protokolle liegen in `/data/user_de/0/com.android.shell/files/bugreports`. Das Original begrenzt die Größe der vom System erzeugten Dateien auf ungefähr 300M. Die Eigenschaft `dumpstate.max_log_size` gibt die Größe in M an; 200 bedeutet 200M. Der Standardwert lässt sich in `frameworks/native/cmds/dumpstate/dumpstate.rc` ändern. Beim Überschreiten werden die ältesten Protokolle gelöscht. Dateien lassen sich anhand des Datums im Namen filtern. Das Original empfiehlt, das Verzeichnis nach dem Abruf benötigter Logs zu leeren; vorher die Vollständigkeit exportierter Dateien prüfen und nötige Sicherungen behalten.

### Unterdrückung wiederholter Ausnahmen

Um übermäßige Logs durch wiederkehrende Fehler zu vermeiden, prüft das System, ob dieselbe Ausnahme seit dem aktuellen Start bereits aufgetreten ist. Dann wird erst nach 5 Minuten erneut ein Protokoll erzeugt. Wiederholte identische system_server_wtf-Fehler an derselben Stelle erzeugen beispielsweise nur ein Protokoll innerhalb von 5 Minuten.

## Grenzen und Vorsichtsmaßnahmen

Verhalten und Standardwerte gelten für SDK/Patches der Quelle und linux-5.10, nicht jede Android- oder ArmSoM-Firmware. Panic-Optionen machen aus manchen Hängern Neustarts, beeinträchtigen die Verfügbarkeit und können ungesicherte Daten verlieren; mit dem passenden Kernel prüfen. Führende `+` im Konfigurationsblock markieren hinzugefügte Patchzeilen und gehören nicht zum Optionsnamen. Protokolle können Gerätekennungen, App-Daten und andere vertrauliche Informationen enthalten; vor Export oder Weitergabe prüfen und schützen. Keine Konfigurationsänderungen, Fehlerinjektion, Dateilöschung oder Hardwaretests durchgeführt.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
