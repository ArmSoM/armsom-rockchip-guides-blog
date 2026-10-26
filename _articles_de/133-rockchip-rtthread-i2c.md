---
title: "Rockchip-RT-Thread-I2C-Leitfaden: Treiberkonfiguration und IOMUX"
description: "Die I2C-Konfiguration besteht aus Treiberframework und VENDOR-Einstellungen. Die benötigten I2C-Busse wie unten aktivieren. Alle Busse können aktiviert werden, benötigen dann aber etwas mehr Speicher."
excerpt: "Die I2C-Konfiguration besteht aus Treiberframework und VENDOR-Einstellungen. Die benötigten I2C-Busse wie unten aktivieren. Alle Busse können aktiviert werden, benötigen dann aber etwas mehr Speicher."
translation_key: "133-rockchip-rtthread-i2c"
slug: "133-rockchip-rtthread-i2c"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, RT-Thread, I2C, IOMUX]
---

{% raw %}

# Rockchip-RT-Thread-I2C-Leitfaden: Treiberkonfiguration und IOMUX

Vollständiger technischer Inhalt des chinesischen RK-KF-YF-113 V1.0.2 für RK2108/Pisces mit RT-Thread 3.1.3. Eine entsprechende ArmSoM-Boardkombination ist nicht bestätigt; daher Plattformreferenz: SoC, RT-Thread-BSP, Busnummern, Pin-Multiplexing, Spannungsdomäne und Pull-ups vor Verwendung prüfen. Keine Linux-I2C-Konfiguration und keine allgemeine Boardunterstützung. Nur eine chinesische Quelle ohne eigenständige technische Abbildungen liegt vor. Englisch, Russisch und Deutsch übersetzen den Text vollständig; Konfiguration und ursprüngliche Codekommentare bleiben erhalten. Keine Hardwareprüfung durchgeführt.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. Funktionskonfiguration

Die I2C-Konfiguration besteht aus Treiberframework und VENDOR-Einstellungen. Die benötigten I2C-Busse wie unten aktivieren. Alle Busse können aktiviert werden, benötigen dann aber etwas mehr Speicher.

```text
# I2C驱动框架
RT_USING_I2C [=y]
# VENDOR驱动，根据需求启用你需要的I2C总线，也可以全开，只是会浪费一点点的内存
RT_USING_I2C0 [=y]
RT_USING_I2C1 [=y]
RT_USING_I2C2 [=y]
```

## 2. Boardkonfiguration

Die I2C-IO-Pins von RK2108 und Pisces sind multiplexiert. IOMUX muss die betreffenden Pins in den I2C-Modus schalten. Siehe das IOMUX-Kapitel des Rockchip-RT-Thread-Entwicklungsleitfadens. Der Original-PDF-Link dorthin ist eine unvollständige relative Adresse; keine Website-Artikeladresse wurde erfunden.

## 3. Entwicklungsleitfaden

Der Rockchip-I2C-Treiber folgt dem standardmäßigen RTT-I2C-Treiberframework. Direkt den [offiziellen RTT-I2C-Entwicklungsleitfaden](https://www.rt-thread.org/document/site/programming-manual/device/i2c/i2c/) verwenden.

{% endraw %}
