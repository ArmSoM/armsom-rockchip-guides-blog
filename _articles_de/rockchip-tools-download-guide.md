---
title: "ArmSoM Rockchip-Werkzeuge: Downloads und 24 Anleitungen"
description: "Wählen Sie nach Aufgabe und prüfen Sie anschließend Host, Version, Handbuch und Board-Anforderungen. Die Sammlung umfasst 24 Werkzeugfamilien und 34 verfügbare Pakete. Jeder Beitrag verlinkt den tatsächlichen GitHub-Download; Befehle und Hashes stimmen in allen vier Sprachen überein."
excerpt: "Wählen Sie nach Aufgabe und prüfen Sie anschließend Host, Version, Handbuch und Board-Anforderungen. Die Sammlung umfasst 24 Werkzeugfamilien und 34 verfügbare Pakete. Jeder Beitrag verlinkt den tatsächlichen GitHub-Download; Befehle und Hashes stimmen in allen vier Sprachen überein."
translation_key: "rockchip-tools-download-guide"
slug: "rockchip-tools-download-guide"
lang: "de"
date: "2026-11-15"
author: "ArmSoM"
category: "linux"
products: []
tags: ["Rockchip", "ArmSoM", "Tools"]
---

Wählen Sie nach Aufgabe und prüfen Sie anschließend Host, Version, Handbuch und Board-Anforderungen. Die Sammlung umfasst 24 Werkzeugfamilien und 34 verfügbare Pakete. Jeder Beitrag verlinkt den tatsächlichen GitHub-Download; Befehle und Hashes stimmen in allen vier Sprachen überein.


## Download, Versionen und SHA-256

[ArmSoM / rockchip-tools](https://github.com/ArmSoM/rockchip-tools)

- [RKDevTool: Download, Loader, Partitionen und update.img](/de/articles/rockchip-tool-rkdevtool/)
- [DriverAssitant 5.13: Rockusb- und ADB-Treiber unter Windows](/de/articles/rockchip-tool-driver-assistant/)
- [upgrade_tool: Rockchip-Firmware per Kommandozeile schreiben](/de/articles/rockchip-tool-upgrade-tool/)
- [boot_merger: DDR-Komponenten und Loader richtig zusammenstellen](/de/articles/rockchip-tool-boot-merger/)
- [Firmware_Merger: Flat RK, Flat GPT und Compact GPT erstellen](/de/articles/rockchip-tool-firmware-merger/)
- [afptool und rkImageMaker: Rockchip update.img aufbauen und prüfen](/de/articles/rockchip-tool-firmware-pack-tools/)
- [Linux_Diff_Firmware: differenzielle Rockchip-OTA-Pakete erstellen](/de/articles/rockchip-tool-diff-firmware/)
- [DDR Bandwidth Tool: Speicherverkehr auf Rockchip auswerten](/de/articles/rockchip-tool-ddr-bandwidth/)
- [DDR_UserTool 1.41: passende DDR-Testkonfigurationen auswählen](/de/articles/rockchip-tool-ddr-user-tool/)
- [rk_ddrbin_tool: Parameter der frühen DDR-Initialisierung ändern](/de/articles/rockchip-tool-ddrbin-tool/)
- [PinDebug: IOMUX, GPIO und Spannungsdomänen auf Rockchip prüfen](/de/articles/rockchip-tool-pin-debug/)
- [USB SQ Tool 1.5: vom Augendiagramm zur USB-PHY-Konfiguration](/de/articles/rockchip-tool-usb-sq-tool/)
- [rk_sign_tool und sign_tool: Rockchip-Firmware signieren und prüfen](/de/articles/rockchip-tool-rk-sign-tool/)
- [SecureBootTool 1.85: eine historische Secure-Boot-Werkzeugkette einordnen](/de/articles/rockchip-tool-secureboot-tool/)
- [Linux SecurityAVB: Schlüssel, Boot-Signaturen und Versionsgrenzen](/de/articles/rockchip-tool-linux-avb/)
- [Linux SecurityDM: dm-verity und verschlüsselte Rootfs-Abbilder](/de/articles/rockchip-tool-linux-dm/)
- [BoardProofTool 1.01: Download und vollständige CPU-ID prüfen](/de/articles/rockchip-tool-board-proof/)
- [EfuseTool 1.42: eine nachvollziehbare Provisionierungsstation vorbereiten](/de/articles/rockchip-tool-efuse-tool/)
- [ParameterTool 1.2: Rockchip-Partitionsparameter vor dem Flashen prüfen](/de/articles/rockchip-tool-parameter-tool/)
- [RKDevInfoWriteTool: Seriennummern und MAC-Adressen kontrolliert schreiben](/de/articles/rockchip-tool-devinfo-write/)
- [RKPCBATool 1.2.1: Linux-Boardtests und manuelle Prüfungen konfigurieren](/de/articles/rockchip-tool-pcba-tool/)
- [HDCP Key Writer: autorisierte Schlüssel verpacken und provisionieren](/de/articles/rockchip-tool-hdcp-key-writer/)
- [SDDiskTool 1.78: SD-Boot-, Update- und PCBA-Karten unterscheiden](/de/articles/rockchip-tool-sd-disk-tool/)
- [programmer_image_tool: Abbilder für eMMC-, SPI-NOR- und NAND-Programmer](/de/articles/rockchip-tool-programmer-image-tool/)

## Geltungsbereich und Prüfung

Dieser Ablauf basiert auf der Dokumentation der Sammlung. Prüfen Sie Board, SoC, Trägerplatine, SDK/BSP und Host-Architektur. Flashen, Provisionieren, Registerschreiben und Hardwaretests wurden nicht ausgeführt. Ein verfügbares Paket belegt keine Unterstützung aller ArmSoM-Produkte.

Passendes Archiv laden, Hash prüfen und den vollständigen Ordner entpacken. Linux PinDebug zuerst nach verlinkter Anleitung zusammensetzen; der angegebene Hash gehört zur vollständigen Datei.

[SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

Werkzeugartikel enthalten Abläufe, Parameter und Abbildungen direkt. Werkzeuglinks öffnen das passende GitHub-Verzeichnis zur Plattform-/Versionswahl. Das vollständige PCBA-Handbuch verwendet den vorhandenen Fachartikel.
