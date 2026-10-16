---
title: "OTA-Updates auf ArmSoM: Wiederherstellung für Buildroot und Debian planen"
description: "Entwerfen Sie signierte, überwachbare und wiederherstellbare Updates für Sige5, Sige7 und Forge1 und prüfen Sie die Anpassungen gegenüber Raspberry-Pi- oder Jetson-Werkzeugen."
translation_key: "015-ota-buildroot-debian-armsom"
slug: "ota-buildroot-debian-armsom"
lang: de
date: 2026-10-14
author: "ArmSoM-Redaktion"
category: production
products: [Sige5, Sige7, Forge1]
tags: [OTA, Buildroot, Debian, secure update, ArmSoM]
keywords: "ArmSoM OTA update, Buildroot OTA, Debian RK3588"
---

# OTA-Updates auf ArmSoM: Wiederherstellung für Buildroot und Debian planen

![Freigabeprozess für OTA-Updates](../assets/015-ota-trust-chain.svg)

Ein Updatesystem ist eine Produktfunktion und erfordert mehr als ein Shellskript. ArmSoM dokumentiert Debian-, Android- und Buildroot-Unterstützung innerhalb der Sige-Familie; Forge1 ist auf Buildroot ausgerichtet. Imageformat, Bootloader und Rollbackmechanismus müssen deshalb für jedes Produkt festgelegt werden.

## Mindestanforderungen an ein Release

Versionieren Sie Kernel, Device Tree, Root-Dateisystem, Bootloaderkonfiguration und Anwendung gemeinsam. Signieren Sie die Artefakte in der CI, prüfen Sie sie vor der Installation und halten Sie einen nachweislich funktionierenden Slot oder einen externen Wiederherstellungsweg bereit. Erfassen Sie serielle Protokolle fehlgeschlagener Bootvorgänge.

```bash
sha256sum Image *.dtb rootfs.squashfs
printf '%s  %s\n' "$VERSION" "$(git rev-parse HEAD)" > release.manifest
```

Der Befehl erzeugt Nachweise; für eine vollständige Secure-Boot-Implementierung sind weitere Schritte erforderlich. Schlüsselspeicherung, Fuse-Zustand, Boot-ROM-Verhalten und Wiederherstellung im Feldeinsatz müssen boardspezifisch geprüft werden.

## Kompatibilitätsgrenzen

OTA-Werkzeuge für Raspberry Pi setzen häufig ein bestimmtes Layout der Bootpartition voraus. Jetson-Updateverfahren erwarten NVIDIA-Bootkomponenten. Übernehmen Sie solche Werkzeuge erst, nachdem Sie Datenträger, Bootloader und Wiederherstellungsverhalten von ArmSoM zugeordnet haben.

## Quellen

- [ArmSoM-Entwicklerzentrum](https://docs.armsom.org/)
- [Forge1-Dokumentation](https://docs.armsom.org/zh/armsom-forge1)
- [Einstieg in die Sige-Familie](https://docs.armsom.org/sige-family-started)

## Prüfung vor der Veröffentlichung

- [ ] Testen Sie einen Stromausfall während des Updates.
- [ ] Prüfen Sie Rollback und Werkswiederherstellung auf der konkreten Produktvariante.
- [ ] Dokumentieren Sie die Verantwortung für Schlüssel und die geplante Supportdauer.
