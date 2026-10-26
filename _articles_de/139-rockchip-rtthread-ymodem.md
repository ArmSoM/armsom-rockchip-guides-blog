---
title: "Rockchip RT-Thread Ymodem: Protokoll, Dateitransfer und Kompatibilität"
description: "Rockchip RT-Thread Ymodem: Protokoll, Dateitransfer und Kompatibilität — V1.0.0"
excerpt: "Rockchip RT-Thread Ymodem: Protokoll, Dateitransfer und Kompatibilität"
translation_key: "139-rockchip-rtthread-ymodem"
slug: "139-rockchip-rtthread-ymodem"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, Ymodem, UART]
---

{% raw %}

# Rockchip RT-Thread Ymodem: Protokoll, Dateitransfer und Kompatibilität

Vollständiger technischer Text des chinesischen RK-KF-YF-076 V1.0.0, Seiten 6–9. Produkt/Version sind allgemein angegeben, ohne Prüfung eines bestimmten ArmSoM-Boards, SoC oder BSP. RT-Thread-Plattformreferenz, kein Linux-Kernelleitfaden. Tatsächliche RT-Thread-Quellen, UART, Pegel, DFS und Firmwarekonfiguration prüfen. Kein englisches PDF vorhanden; alle vier Sprachen verwenden die vier Originalabbildungen des chinesischen PDFs, auch bei englischer Beschriftung. Leistungs- und Kompatibilitätsangaben sind historische Quellenberichte, keine ArmSoM-Hardwaretests.

> Redaktioneller Vorbehalt: Aussagen zu File_size-Zahlendarstellung, Wiederholung bei CRC-Fehlern und unschädlichem 0x1A bleiben erhalten, gelten aber nicht pauschal für alle Ymodem-Implementierungen. Insbesondere bei Binärfirmware Implementierung, Dateilänge und Prüfsumme vor/nach der Übertragung prüfen; Füllbytes sind nicht automatisch unschädlich. Kompatibilität und Upstream-Status beziehen sich nur auf den Quellenstand.

[ArmSoM Docs](https://docs.armsom.org/) · [RT-Thread](https://github.com/RT-Thread/rt-thread)

## 1. Funktionsprinzip

Ymodem überträgt Dateien über eine serielle Schnittstelle und entstand aus Xmodem. Übliche Datenblöcke von 128 oder 1024 Byte ergeben Pakete von 133 oder 1029 Byte. Die Quelle beschreibt CRC16-Prüfung und Abbruch bei einem Prüffehler. Chuck Forsberg berücksichtigte optionale Paketgrößen, Prüfverfahren und Wiederholungen; die Quelle führt die vielen Varianten auf diese nicht strikt festgelegten Optionen zurück. Implementierungen können daher inkompatibel sein. RT-Thread zielt hauptsächlich auf SecureCRT-Kompatibilität. Der Austausch zwischen Sender und Empfänger umfasst Handshake, Übertragung und Abschluss.

![Ymodem-Austausch zwischen Sender und Empfänger](/docs/rockchip-rtthread-ymodem/assets/cn-p006-figure-01.png)

Ymodem-Austausch zwischen Sender und Empfänger

### 1.1 Handshake

Der Empfänger sendet regelmäßig C (0x43), hier alle 1s. Der Sender antwortet mit `SOH|0x00|0xFF|File_name 00 File_size NULL|CRC16|`. SOH (0x01) kennzeichnet einen 128-Byte-Block; für 1024 Byte wird STX (0x02) verwendet. 0x00 ist die Paketnummer, 0xFF ihr Komplement. File_name bestimmt den empfangenen Dateinamen, File_size den reservierten Speicherbereich. Laut Quelle enthält File_size normalerweise die Bytezahl als hexadezimales ASCII, SecureCRT verwendet jedoch dezimales ASCII. Die letzten zwei Bytes enthalten CRC16. Der Empfänger antwortet mit ACK (0x06) und anschließend C (0x43), um die Dateiübertragung zu starten. Bleibt nach wiederholten C-Anfragen ein Senderpaket aus, tritt ein Timeout ein; hier sind 10 Versuche vorgesehen.

### 1.2 Übertragung

Der Sender übermittelt `SOH|0x01|0xFE| Data[0~127] |CRC16|`; der Empfänger bestätigt mit ACK (0x06), danach folgt das nächste Paket. Laut Quelle fordert SecureCRT nach einem fehlerhaften Datenpaket keine Wiederholung mit NAK (0x15) an, sondern bricht ab. Im ursprünglichen Test nach dem unten beschriebenen Verfahren wurde eine Datei über 5M bei 115200 Baud ohne Fehler übertragen. Das letzte Paket lautet `SOH|0x??|0x??| Data[0~??] 0x1A |CRC16|`. Ein kurzer Block wird mit 0x1A auf 128 Byte aufgefüllt; dies steht für Ctrl+Z/Dateiende. Die Quelle bezeichnet abschließende 0x1A-Bytes als normal und ohne Einfluss auf die Datei oder ihre Nutzung; hierzu gilt der obige Vorbehalt. CAN (0x18) vom Sender oder Ctrl+C im Terminal bricht die Übertragung ab.

### 1.3 Abschluss

Der Sender sendet EOT (0x04). Der Empfänger fordert mit NAK (0x15) eine Bestätigung an; der Sender wiederholt EOT (0x04), und ACK (0x06) vom Empfänger beendet diese Datei. Danach fordert C (0x43) eine weitere Datei an. Ist keine vorhanden, sendet der Sender `SOH|0x00|0xFF| NULL |CRC16|`; der Empfänger antwortet mit ACK (0x06). Damit ist der Ymodem-Vorgang beendet.

## 2. Anwendung

### 2.1 Ymodem-Konfiguration

Protokoll und Anwendungsbeispiele liegen unter `/components/utilities/ymodem`: ymodem.c und ymodem.h implementieren das Protokoll, ry_sy.c den Dateiversand und -empfang. Mit `scons --menuconfig` Ymodem unter Utilities aktivieren. Andere Hersteller verwenden es oft für RT-Thread-OTA-Updates ohne DFS-Abhängigkeit. Rockchip nutzt vor allem Dateiübertragungen; ry_sy.c benötigt daher DFS-Lese-/Schreibzugriff. Die Dateitransferoption aktiviert die ry_sy-Befehle. CRC Table ersetzt optional die direkte CRC-Berechnung durch Tabellensuche. Theoretisch ist dies schneller, bei 128-Byte-Blöcken und 115200 Baud meldet die Quelle jedoch keinen wesentlichen Gewinn; Deaktivierung spart Speicher. Die konfigurierte Firmware kompilieren und herunterladen, anschließend Ymodem seriell verwenden.

```text
RT-Thread Components --->
            Utilities --->
                [*] Enable Ymodem
                    [ ] Enable CRC Table in Ymodem
                    [*] Enable file transfer feature
```

### 2.2 Dateien empfangen

Der Empfang verwendet standardmäßig die Console; ein Argument wählt einen anderen UART. `ry` eingeben: Die Console zeigt C und wartet auf den Host. In SecureCRT Transfer → Send Ymodem und die Datei wählen. Der Fortschritt wird angezeigt. Für ein anderes Gerät beispielsweise `ry uart2` eingeben. Während der Übertragung ist jede serielle Textausgabe vorübergehend gesperrt.

![Originalbeispiel zum Dateiempfang](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-01.png)

Originalbeispiel zum Dateiempfang

```text
msh />ry
CCCC
Starting ymodem transfer.  Press Ctrl+C to cancel.
Transferring test.mp3...
  100%    2476 KB       3 KB/sec    00:10:51       0 Errors
```

Empfangene Dateien werden standardmäßig im Stammverzeichnis gespeichert. Für ein anderes Ziel fpath in `_rym_recv_begin` in ry_sy.c ändern.

### 2.3 Dateien senden

Auch das Senden verwendet standardmäßig die Console; ein Argument wählt einen anderen UART. `sy file_path` eingeben und auf den Host warten. In SecureCRT Transfer → Receive Ymodem wählen. Der Fortschritt wird angezeigt. Für uart2 `sy file_path uart2` verwenden. Während der Dateiübertragung ist jede serielle Textausgabe vorübergehend gesperrt.

![Originalbeispiel zum Dateiversand](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-02.png)

Originalbeispiel zum Dateiversand

```text
msh />sy /test.mp3

Starting ymodem transfer.  Press Ctrl+C to cancel.
Transferring test.mp3...
  100%    2476 KB       3 KB/sec    00:10:52       0 Errors
```

Einen absoluten Dateipfad verwenden; relative Pfade werden in dieser Quellversion nicht unterstützt. Der empfangene Dateiname enthält den gesamten Pfad. Bei Bedarf `_rym_send_begin` in ry_sy.c so ändern, dass der Pfad zerlegt und der Verzeichnisanteil entfernt wird.

## 3. Bekannte Probleme und geplante Verbesserungen

Zum Stand der Quelle waren Protokoll und Anwendung bereits in RT-Thread master übernommen, wie abgebildet. Die Quelle nennt folgende weitere Entwicklungsziele:

1. Versand von Paketen mit 1024-Byte-Datenblöcken unterstützen.

2. Bei 115200 Baud lag der stabile Durchsatz bei etwa 4kB/s. Eine Erhöhung auf 1.5M oder mehr verursachte Übertragungsfehler.

3. Bei 115200 Baud betrug die theoretische Grenze 11kB/s, die praktische 8kB/s; der Protokoll-Overhead war erheblich.

4. Weitere Terminalprogramme unterstützen.

![Original-Screenshot des RT-Thread-Merge-Eintrags](/docs/rockchip-rtthread-ymodem/assets/cn-p008-figure-03.png)

Original-Screenshot des RT-Thread-Merge-Eintrags

## 4. Softwarekompatibilität laut Quelle

| Betriebssystem | Terminal | Empfangen | Senden |
| --- | --- | --- | --- |
| Windows | SecureCRT | Unterstützt | Unterstützt |
| MacOS | SecureCRT | Nicht unterstützt | Unterstützt |
| MacOS | Minicom | Nicht unterstützt | Nicht unterstützt |
| Linux | Minicom | Unterstützt | Nicht unterstützt |

{% endraw %}
