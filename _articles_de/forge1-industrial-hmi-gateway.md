---
title: "ArmSoM Forge1: Gateways, HMI und Datenerfassung entwickeln"
description: "Bei Industrieprojekten müssen Anzeige, Gerätekommunikation und Anwendung gemeinsam zuverlässig arbeiten."
excerpt: "Bei Industrieprojekten müssen Anzeige, Gerätekommunikation und Anwendung gemeinsam zuverlässig arbeiten."
translation_key: "forge1-industrial-hmi-gateway"
slug: "forge1-industrial-hmi-gateway"
lang: "de"
date: "2026-11-02"
author: "ArmSoM"
category: "production"
products: ["CM1", "Forge1"]
tags: ["RK3506J", "RK3506B", "CM1", "Forge1", "Rockchip", "ArmSoM"]
image: "/assets/rk3506/forge1.jpg"
---

![Originalabbildung — ArmSoM Forge1](/assets/rk3506/forge1.jpg)

Bei Industrieprojekten müssen Anzeige, Gerätekommunikation und Anwendung gemeinsam zuverlässig arbeiten. ArmSoM Forge1 integriert RK3506J und übliche Platinenschnittstellen für HMI, Gateways und Datenerfassung. Für eine spätere eigene Bauform kann CM1 geprüft werden.

## Ausstattung und Software

Die Spezifikation nennt 512MB DDR3L, 512MB NAND, zwei Fast-Ethernet-Ports, MIPI DSI, USB2.0 Host und RS485/CAN-Ressourcen bei 92×62mm. Versorgung wahlweise DC 12V/1A oder Type-C 5V/2A gemäß Handbuch.

Die Softwarebeschreibung führt Buildroot, Linux 6.1, RT-Thread 4.1, AMP, Preempt-RT/Xenomai und LVGL auf. Nicht jedes Image aktiviert alle Funktionen zugleich. Vor Tests Image, Kernelkonfiguration und Beispiele prüfen.

## HMI für die Maschine

Status, Einstellungen, Alarmhistorie und Wartung darstellen. Reale Gerätedaten verwenden und Bedienreaktion unter Kommunikationslast messen. Erfassung von Darstellung entkoppeln, Aktualisierungsumfang begrenzen und große Bilddekodierungen oder häufige Schreibzugriffe vermeiden.

Paneltiming, Treiber und Touch müssen zusammenpassen. Eine 2D-Engine beschleunigt nicht automatisch jede UI-Bibliothek; Rendering-Backend und Treiberpfad verifizieren.

## Gateway zwischen Feld und Netzwerk

RS485 oder CAN verbinden Geräte, zwei Ethernet-Schnittstellen Feld- und übergeordnetes Netzwerk. Modbus und MQTT sind zu evaluierende Softwareoptionen, keine Zusage für das Werksimage.

Abfragezyklen, Timeouts, Wiederholungen, Puffergrenzen und Duplikaterkennung festlegen. Terminierung, Masse, Isolation, Überspannungsschutz und Kabel prüfen. Schnittstellennamen ersetzen keine EMV-Prüfung des Gesamtsystems.

## Nachvollziehbare Datenerfassung

Zustände, Zähler und Alarme mit Zeitstempeln versehen, offline begrenzt puffern und periodisch übertragen. Verhalten ohne Netzwerkzeit definieren, Konfigurationsstände speichern und Stromausfälle testen. Analoge, Thermoelement- oder Hochspannungseingänge benötigen externe Erfassungs- und Isolationsschaltungen.

## Echtzeit bewerten

Linux, Echtzeit-Patches und AMP bieten unterschiedliche Ansätze, garantieren aber keine maximale Reaktionszeit. Netzwerk, Display und Speicher gleichzeitig belasten und Latenzverteilung sowie Spitzen messen. Ob kritische Regelschleifen einen unabhängigen Controller benötigen, ergibt sich aus Zeit- und Fehleranforderungen.

## Einsatzgrenzen

Forge1 unterstützt frühe Schnittstellen- und Anwendungstests, CM1 die spätere eigene Trägerplatine. Der dokumentierte Bereich −40 bis 85°C gilt nicht automatisch für ein komplettes Gerät mit Display. Die offizielle Seite enthält neben NAND-Angaben auch einen eMMC-Boot-Hinweis. Hier wird die NAND-Spezifikation verwendet; das Startmedium ist am gelieferten Hardwarestand zu prüfen.

Die offizielle Schnittstellenabbildung nennt 92×60mm, die Spezifikation dagegen 92×62mm. Diese Abweichung bleibt dokumentiert. Für Gehäuse und Befestigung die mechanische Zeichnung des gelieferten Hardwarestands verwenden.

## Weitere Artikel und offizielle Unterlagen

- [RK3506J erklärt: industrielle HMI und vernetzte Geräte](/de/articles/rk3506j-chip-guide/)
- [ArmSoM CM1: RK3506J-Modul für eigene Industrieterminals](/de/articles/cm1-rk3506j-industrial-module/)
- [RK3506B Datasheet V1.0: Architektur, Anschlüsse und elektrische Auslegung](/de/articles/rk3506b-datasheet-v10/)
- [Rockchip RK3506](https://www.rock-chips.com/a/cn/product/RK35xilie/2025/1208/2125.html)
- [ArmSoM CM1](https://docs.armsom.org/armsom-cm1)
- [ArmSoM Forge1](https://docs.armsom.org/armsom-forge1)
- [ArmSoM](https://www.armsom.org/)
