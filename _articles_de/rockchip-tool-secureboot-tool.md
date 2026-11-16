---
title: "SecureBootTool 1.85: eine historische Secure-Boot-Werkzeugkette einordnen"
description: "SecureBootTool gehört zu einer älteren Rockchip-Sicherheitslösung."
excerpt: "SecureBootTool gehört zu einer älteren Rockchip-Sicherheitslösung."
translation_key: "rockchip-tool-secureboot-tool"
slug: "rockchip-tool-secureboot-tool"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "SecureBootTool"]
---

{% raw %}

![SecureBootTool](/assets/rockchip-tools/flows/secureboot-tool-de.svg)

## Historische Secure-Boot-Anwendungshinweise V1.2

Das Handbuch von 2016 nennt RK3126, RK3128, RK3228, RK3288 und RK3368; es ist keine allgemeine RK35xx-Konfiguration. Funktionen: Secure Boot ROM, SHA256/SHA160, RSA2048/RSA1024, OTP-Prüfung öffentlicher RSA-Schlüssel und Secure-Boot-Rockusb-Updates. Mindestversionen: Miniloader 2.19, U-Boot 2.17, EfuseTool 1.35, SecureBootTool 1.75 und RKBatchTool 1.8.

### 1. Vertrauenskette und Signierkonfiguration

Die Originalgrafik unten zeigt Prüfungen von ROM und Boot-Stufen. Im Windows-Werkzeug Chip wählen, für Vorgänger von 3188 others, dann eFuse- oder Softwaremodus. Die Quelle nennt eFuse-Unterstützung für 3128, 3288, 3228 und 3368, nicht für andere ältere Chips. Die GUI-Bezeichnung encryption darf nicht mit Vertraulichkeit durch Signaturprüfung verwechselt werden.

3188 und ältere verwenden loaderex=false und 1024-Bit-Schlüssel. Für 3128/3288/3228/3368 folgende Konfiguration mit den genannten Mindestversionen nutzen. Zulässig sind nur 1024 und 2048.

```ini
[Options]
Loaderex=true
Key=2048
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p05-f01.png" alt="Ablauf zum Signieren und Prüfen des Boot-Abbilds" width="1248" height="815" style="width:100%;max-width:1248px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 1: Ablauf zum Signieren und Prüfen des Boot-Abbilds</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p06-f01.png" alt="Hauptfenster von SecureBootTool" width="900" height="600" style="width:100%;max-width:900px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 2: Hauptfenster von SecureBootTool</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f01.png" alt="Zielchip auswählen" width="256" height="71" style="width:100%;max-width:256px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 3: Zielchip auswählen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f02.png" alt="eFuse- oder Softwaremodus auswählen" width="216" height="84" style="width:100%;max-width:216px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 4: eFuse- oder Softwaremodus auswählen</strong></figcaption>
</figure>

### 2. RSA-Schlüssel erzeugen, sichern und laden

Die Quelle verlangt ein Schlüsselpaar pro Produktmodell, das für spätere Firmware weiterverwendet und zusätzlich gesichert wird. Erzeugen, bestätigen, speichern und von dort laden. OpenSSL-`.pem`-RSA2048 wird unterstützt. Schlüsselverlust kann signierte Updates und Wiederherstellung verhindern. Die Screenshots zeigen den Ablauf, kein Produktions-Schlüsselmanagement.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p09-f01.png" alt="Speichern des erzeugten Schlüsselpaars bestätigen" width="897" height="594" style="width:100%;max-width:897px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 5: Speichern des erzeugten Schlüsselpaars bestätigen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p10-f01.png" alt="Verzeichnis zum Speichern der Schlüssel wählen" width="906" height="596" style="width:100%;max-width:906px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 6: Verzeichnis zum Speichern der Schlüssel wählen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p11-f01.png" alt="Gespeicherte private Schlüsseldatei laden" width="969" height="775" style="width:100%;max-width:969px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 7: Gespeicherte private Schlüsseldatei laden</strong></figcaption>
</figure>

### 3. Firmware vorbereiten und signieren

boot.img und recovery.img müssen beide den Kernel enthalten. Der Terminal-Screenshot zeigt folgendes RK3288-Android-4.4-Beispiel; NAND-Firmware benötigt außerdem miniloader und uboot.img. Gesicherten RSA-Schlüssel laden, Firmware wählen und signieren, Erfolg festhalten. Die doppelte Abschnittsnummer 3.5 der Vorlage ist hier nach Ablauf geordnet.

```text
./mkimage.sh ota
TARGET_PRODUCT=rk3288
TARGET_HARDWARE=rk30board
system filesystem is ext4
make ota images...
create boot.img with kernel... done.
create recovery.img with kernel... done.
create misc.img.... done.
```

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p12-f01.png" alt="Boot- und Recovery-Abbilder mit Kernel erzeugen" width="728" height="161" style="width:100%;max-width:728px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 8: Boot- und Recovery-Abbilder mit Kernel erzeugen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p07-f03.png" alt="Signierung mit Sign Firmware starten" width="222" height="60" style="width:100%;max-width:222px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 9: Signierung mit Sign Firmware starten</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p13-f01.png" alt="Zu signierende Firmware auswählen" width="963" height="784" style="width:100%;max-width:963px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 10: Zu signierende Firmware auswählen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p14-f01.png" alt="Erfolgsmeldung nach der Firmware-Signierung" width="888" height="594" style="width:100%;max-width:888px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 11: Erfolgsmeldung nach der Firmware-Signierung</strong></figcaption>
</figure>

### 4. eFuse programmieren

eFuse-Werkzeug öffnen, signierte Produktionsfirmware wählen und Start drücken. Ein leeres Gerät startet per USB in `maskromrockusb`, worauf die automatische Programmierung beginnt; mehrere Geräte werden unterstützt. RK312X benötigt eine Vorrichtung mit separater eFuse-Versorgung, RK3288 besitzt softwaregesteuerte Versorgung. Vor einer Serie ein Gerät programmieren, vollständige signierte Firmware aufspielen und alle Funktionen prüfen. eFuse ist irreversible Provisionierung, kein unbedenklicher Versuch an einem normalen Board.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p15-f01.png" alt="eFuse-Werkzeug öffnen" width="1224" height="744" style="width:100%;max-width:1224px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 12: eFuse-Werkzeug öffnen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p16-f01.png" alt="Signierte Produktionsfirmware auswählen" width="1206" height="792" style="width:100%;max-width:1206px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 13: Signierte Produktionsfirmware auswählen</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p17-f01.png" alt="Werkzeug starten und auf das Gerät warten" width="1303" height="789" style="width:100%;max-width:1303px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 14: Werkzeug starten und auf das Gerät warten</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p18-f01.png" alt="Ergebnis der eFuse-Programmierung prüfen" width="868" height="657" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 15: Ergebnis der eFuse-Programmierung prüfen</strong></figcaption>
</figure>

### 5. Aktualisieren und prüfen

Signierte Firmware mit passendem Produktionstool aktualisieren. Ohne eFuse-Programmierung wird dieser Secure Boot laut Vorlage nicht aktiviert. Beim Negativtest mit unsignierter Firmware soll der Start scheitern, das Gerät in `maskromrockusb` bleiben und nach Loader-Update einen Werkzeugfehler zeigen. Die folgenden Screenshots sind Quellenbelege, keine ArmSoM-Tests.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p20-f01.png" alt="Signierte Firmware im Batch-Werkzeug laden" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 16: Signierte Firmware im Batch-Werkzeug laden</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p21-f01.png" alt="Erfolgreiches Update mit signierter Firmware" width="868" height="683" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 17: Erfolgreiches Update mit signierter Firmware</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" target="_blank" rel="noopener" aria-label="Bild in voller Größe öffnen"><img src="/assets/rockchip-tools/manuals/094883c784c1/p22-f01.png" alt="Negativprüfung mit unsignierter Firmware" width="868" height="682" style="width:100%;max-width:868px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Abbildung 18: Negativprüfung mit unsignierter Firmware</strong></figcaption>
</figure>

### 6. Häufige Fehler

Bei eFuse-Fehlern Versorgung und bereits erfolgte Programmierung prüfen. Nicht durch wiederholtes Schreiben testen; Schlüssel, Firmware-Version, Zielchip und Ablaufprotokoll sichern und mit der Chipdokumentation abgleichen.

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

## GitHub-Werkzeugverzeichnis, Versionen und SHA-256

Das passende GitHub-Verzeichnis öffnen, Host und Version wählen, Dateihash prüfen und vollständig entpacken. Die folgenden Links öffnen Repository-Verzeichnisse.

[Werkzeugverzeichnis auf GitHub öffnen](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/secureboot-tool)

| Plattform / Version | Datei | SHA-256 |
|---|---|---|
| Host to verify / 1.85 | `SecureBootTool_v1.85_foruser.zip` | `d241ccc7503a3202c68a036f51cdd7f5d2db2a7594eb749ec19e2ffb2c67681a` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Quellen und Originalabbildungen

- Rockchip Secure Boot Application Note_v1.2_20160202.pdf

## Verwandte Arbeitsabläufe

- [Vollständiger Rockchip-Secure-Boot-Leitfaden: Signierung, eFuse, OTP und Prüfung](/de/articles/105-rockchip-secure-boot/)
- [Entwicklerleitfaden für Rockchip Linux Secure Boot](/de/articles/203-rockchip-linux-secure-boot/)
- [rk_sign_tool und sign_tool: Rockchip-Firmware signieren und prüfen](/de/articles/rockchip-tool-rk-sign-tool/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [Rockchip-Werkzeug- und Downloadübersicht](/de/articles/rockchip-tools-download-guide/)

## Passende ArmSoM-Boarddokumentation

Board- und Trägeranforderungen zunächst im Produkthandbuch prüfen. Diese Links dienen als Plattformreferenzen und belegen keine Validierung des Archivwerkzeugs auf diesen Produkten.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
