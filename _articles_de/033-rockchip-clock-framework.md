---
title: "Rockchip-Taktframework: PLL, DTS, Treiber-API und Fehlersuche"
description: "Referenz zum Rockchip-Taktframework auf Basis der Quelldokumentation: PLLs, Taktbaum, DTS-Zuweisungen, Linux-APIs und debugfs."
translation_key: "033-rockchip-clock-framework"
slug: "033-rockchip-clock-framework"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["Rockchip", "clock", "PLL", "device tree", "Linux kernel"]
keywords: "ArmSoM Rockchip clock framework PLL DTS Linux clock API RK3588 RK3576"
excerpt: "Vollständige Arbeitsreferenz zu Rockchip-Linux-Taktbaum, Device-Tree-Zuweisungen und Takt-API."
---

# Rockchip-Taktframework: PLL, DTS, Treiber-API und Fehlersuche

Diese Plattformreferenz basiert auf dem *Rockchip Clock Developer Guide*, V1.2.0 (2024-08-02). Sie umfasst das dokumentierte Rockchip-Linux-Taktframework: RK303X/RK312X/RK322X/RK3288X/RK3328/RK3368/RK3399/RV1108/PX30 unter Linux 4.4/4.19/5.10; RV1126 und RK356X unter 4.19/5.10; RK3588 und RV1103B unter 5.10; RK3576/RK3506 unter 6.1. Prüfen Sie vor Anwendung auf einem ArmSoM-Board dessen SoC, veröffentlichtes BSP, CRU-/PMUCRU-Karte, DTS und Bootkette. Die folgenden Angaben zu Frequenz, Jitter und Leistung stammen nicht aus ArmSoM-Hardwaremessungen.

Die chinesische und die englische Quelle umfassen laut englischer Artikelvorlage jeweils 24 Seiten. Die chinesische Fassung verwendet chinesische Originalabbildungen; die deutsche Fassung übernimmt die englischen Originalabbildungen. Rechtliche Deckblatthinweise, Kontaktdaten, Zielgruppenabschnitt und Versionshistorie wurden entfernt. [Redaktionelle Hinweise](/docs/rockchip-clock/EDITORIAL-NOTES.md).

## 1. Modell des Taktbaums

Das Taktsubsystem versorgt Hardwareverbraucher des SoC, etwa USB und Peripherietreiber, hierarchisch mit Takten. Es ist vom Linux-Zeitmesssystem zu unterscheiden. Ein Taktbaum besteht aus Oszillator/Quarz, PLLs, Teilern, Multiplexern, Gates und verbrauchenden Hardwareblöcken. Das Plattformkonzept legt PLL-Einstellungen, übergeordnete Takte, Teiler und MUX fest und unterscheidet sich je nach SoC.

Der übliche Ablauf besteht aus Ein-/Ausschalten eines Takts, Einstellen seiner Frequenz und Wahl seines übergeordneten Takts. Die Quelle nennt `drivers/clk/rockchip/clk-rk3xxx.c` für die Implementierung, `include/dt-bindings/clock/rk3xxx-cru.h` beziehungsweise `include/dt-bindings/clock/rockchip,rk3xxx-cru.h` für Binding-IDs, `drivers/clk/rockchip/clk-xxx.c` für SoC-spezifische Behandlung und `drivers/clk/` für allgemeine APIs.

![Originalabbildung des Taktbaums](/docs/rockchip-clock/assets/Rockchip_Developer_Guide_Clock_EN-p6-X67.png)

## 2. PLLs, Busse und Gates

| PLL | Hauptaufgabe laut Quelle | Typische Quellwerte |
|---|---|---|
| APLL | CPU (`CLOCK_CORE`) | Ändert sich mit der CPU-Frequenz |
| DPLL | DDR (`CLOCK_DDR`) | Ändert sich mit den DDR-Anforderungen |
| GPLL | Reserve für Busse und Peripherie | 594 MHz oder 1200 MHz; unterstützt grundlegende Ausgänge mit 100/200/300/400 MHz |
| CPLL | Reserve für GMAC/andere Geräte oder LCDC | 400/500/800/1000 MHz in den Beispielen |
| NPLL | Reserve für andere Geräte oder LCDC | Beispiel mit 1188 MHz |

ACLK überträgt Daten; PCLK und HCLK dienen gewöhnlich Registerzugriffen. Die Quelle nennt allgemeine Entwurfsbereiche von 100–300 MHz für ACLK, 50–150 MHz für PCLK und 37–150 MHz für HCLK. BUS enthält meist langsamere Geräte wie I2C/I2S/SPI, PERI häufig eMMC/GMAC/USB. Manche SoCs geben besonders anspruchsvoller Peripherie eigene ACLKs. Zur Leistungssteuerung trennt RK3399 die schnellen `ACLK_PERIHP/HCLK_PERIHP/PCLK_PERIHP` von den langsameren `ACLK_PERILP0/HCLK_PERILP0/PCLK_PERILP0/HCLK_PERILP1/PCLK_PERILP1`.

Gates verwenden Referenzzählung entlang der Eltern-Kind-Beziehungen. Das Aktivieren eines Blatts aktiviert automatisch seine Eltern; ein Elternknoten wird erst abgeschaltet, wenn alle relevanten Kinder abgeschaltet sind. Ein Treiber sollte daher seinen dokumentierten Blatttakt steuern.

## 3. Anfängliche Taktbaumkonfiguration

Nach Linux 4.4 erfolgt die dokumentierte Initialisierung über `of_clk_set_defaults()`. Die Funktion liest `assigned-clocks` und ordnet die optionalen Einträge in `assigned-clock-parents` und `assigned-clock-rates` anhand ihrer Position zu. Die Eigenschaften müssen eindeutig zugeordnet bleiben; eine verschobene Liste kann Einstellungen unbemerkt auf den falschen Takt anwenden.

```dts
&cru {
        assigned-clocks = <&cru ACLK_VOP0>, <&cru HCLK_VOP0>,
                          <&cru PLL_GPLL>, <&cru PLL_CPLL>;
        assigned-clock-parents = <&cru VPLL>, <&cru VPLL>,
                                 <&cru GPLL>, <&cru GPLL>;
        assigned-clock-rates = <400000000>, <200000000>,
                               <594000000>, <800000000>;
};
```

Das Fragment ist eine gekürzte Fassung des RK3399-Quellbeispiels. Verwenden Sie die Binding-Namen des tatsächlichen SoC und dessen vollständige Listen. Ein standardmäßig nicht aktivierter und von keinem Verbraucher angeforderter Takt kann nach der Initialisierung deaktiviert werden. Die Quelle beschreibt drei Ausnahmen:

- Ergänzen Sie den Namen in der SoC-Liste `*_critical_clocks`, wenn der Takt eingeschaltet bleiben muss.
- Verwenden Sie `CLK_IGNORE_UNUSED` in einer Gate-Definition, wenn sie beim Abschalten ungenutzter Takte aktiv bleiben muss; der angezeigte Aktivierungszähler kann trotzdem null sein.
- Unter Kernel 6.1 halten die dokumentierten Bootargumente `clk_gate.always_on=1 pm_domains.always_on=1` sämtliche Takte aktiv; alternativ kennzeichnet `CLK_IS_CRITICAL` eine ausgewählte Definition. Das Aktivhalten aller Takte erhöht den Energiebedarf und erleichtert die Diagnose.

Takt-IDs werden im Binding-Header des SoC definiert. Übliche Registrierungsmakros in `clk-rk3xxx.c` sind `GATE` (Gate-Register und Bit), `MUX` (Elternauswahl) und `COMPOSITE` (MUX, Teiler und Gate). Übernehmen Sie keine numerischen IDs eines anderen SoC.

## 4. Treiberintegration und API

Bevorzugen Sie eine benannte DTS-Taktreferenz. Das TSADC-Muster der Quelle lautet:

```dts
clocks = <&cru SCLK_TSADC>, <&cru PCLK_TSADC>;
clock-names = "tsadc", "apb_pclk";
assigned-clocks = <&cru SCLK_TSADC>;
assigned-clock-rates = <750000>;
```

```c
#include <linux/clk.h>

dev->pclk = devm_clk_get(&pdev->dev, "tsadc");
dev->clk = devm_clk_get(&pdev->dev, "apb_pclk");
/* devm_clk_get(NULL, "g_p_saradc") is a legacy alternative when DTS has none. */
```

Relevante APIs sind `devm_clk_get()`, `clk_get()/clk_put()`, `devm_clk_get_optional()`, `devm_clk_bulk_get()`, `devm_clk_bulk_get_all()`, `clk_prepare()/clk_unprepare()`, `clk_enable()/clk_disable()`, `clk_prepare_enable()/clk_disable_unprepare()`, `clk_get_rate()`, `clk_round_rate()` und `clk_set_rate()` (Hz). Verwenden Sie nach Möglichkeit verwaltete und Bulk-APIs.

`prepare`/`unprepare` können schlafen und dürfen nicht im atomaren Kontext laufen; `enable`/`disable` sind atomare Operationen. Die kombinierte prepare/enable-Funktion eignet sich nur für nichtatomaren Kontext. Zu jedem acquire/enable-Pfad gehört der passende release/disable-Pfad, auch bei probe-Fehlern und remove:

```c
thermal->num_clks = devm_clk_bulk_get_all(&pdev->dev, &thermal->clks);
if (thermal->num_clks < 1)
        return -ENODEV;
error = clk_bulk_prepare_enable(thermal->num_clks, thermal->clks);
/* ... */
clk_bulk_disable_unprepare(thermal->num_clks, thermal->clks);
```

## 5. Fehlersuche

Untersuchen Sie zuerst den Taktbaum zur Laufzeit:

```sh
cat /sys/kernel/debug/clk/clk_summary
cat /sys/kernel/debug/clk_saradc/clk_rate
echo 24000000 > /sys/kernel/debug/clk_saradc/clk_rate
echo 1 > /sys/kernel/debug/clk_saradc/clk_enable_count
echo 0 > /sys/kernel/debug/clk_saradc/clk_enable_count
# Kernel 6.1 source example:
echo 1 > /sys/kernel/debug/clk_saradc/clk_prepare_enable
echo 0 > /sys/kernel/debug/clk_saradc/clk_prepare_enable
```

Debugfs-Knoten hängen von Build und Kernel ab; setzen Sie ihre Existenz nicht in Produktionsskripten voraus. Die Quelle beschreibt zudem die Ausgabe ausgewählter Takte über `TEST_CLK_OUT` mit MUX-, Teiler- und Gate-Einstellung im CRU. Für RK3399 zeigen die Abbildungen die Offsets CRU_MISC_CON `0x050c`, CRU_CLKSEL58_CON `0x01e8` und CRU_CLKGATE13_CON `0x0334`, die zur Betriebsbasisadresse addiert werden. Prüfen Sie vor Messungen den Boardschaltplan und das SoC-TRM.

## 6. Randbedingungen für PLL- und Taktentwurf

Die Quelltabelle verwendet `RK3036_PLL_RATE(rate, refdiv, fbdiv, postdiv1, postdiv2, dsmpd, frac)`. Ihre Formeln lauten:

```text
VCO  = 24 MHz × FBDIV / REFDIV       (source range: 450–2200 MHz)
FOUT = VCO / POSTDIV1 / POSTDIV2
POSTDIV1 >= POSTDIV2
```

Beispiel: `24 MHz × 99 / 2 = 1188 MHz`, anschließend `1188 / 2 / 1 = 594 MHz`. Ein höherer VCO verringert Jitter, erhöht jedoch die Leistungsaufnahme; ein kleinerer `REFDIV` verkürzt die PLL-Verriegelungszeit. Fehlt eine Zielfrequenz in der Tabelle, lassen sich Parameter automatisch berechnen. Laut Quelle wird dabei jedoch möglicherweise kein maximaler VCO erreicht; bei hohen Jitteranforderungen ist dieses Verfahren ungeeignet.

Display-DCLK benötigt gewöhnlich eine eigene PLL, da er von der Panelauflösung abhängt. Die Quelle ordnet RK303X/RK312X/RK322X/RK3288X CPLL, RK3368 NPLL, RK3399 mit zwei Displays CPLL/VPLL, RK3568 mit drei Ports HPLL/VPLL, RK3588 mit vier Ports V0PLL und zwei HDMI-PHY-PLLs sowie RK3576 mit drei Ports VPLL und eine HDMI-PHY-PLL zu. RK3506 verwendet für einen Port die nächstliegende Teilung. Binden Sie auf RK3399 den HDMI-VOP-DCLK wie im DTS-Beispiel an VPLL und den anderen VOP an CPLL; tauschen Sie die Rollen nur bei entsprechendem Display-Routing.

Für I2S, UART und andere Fractional-Teiler verlangt die Quelle eine Frequenz des Fractional-Takts, die dem 20-Fachen der Elternfrequenz entspricht. Fehlt dieses Verhältnis, entstehen erheblicher Jitter und Frequenzfehler. Laut Quelle benötigt Gigabit Ethernet einen genauen 50-MHz-Takt und 10-Gigabit Ethernet 125 MHz. Verwenden Sie einen externen Quarz, wenn die PLL-Planung diese Genauigkeit nicht erreicht. RK3576-/RK3506-PLLs können als Referenz den ursprünglichen Quarzeingang oder einen zusätzlichen IO-Eingang zur Audiosynchronisierung verwenden; hierfür ist die SoC-spezifische BSP-Dokumentation erforderlich.

## 7. Sicherer Arbeitsablauf

1. Beginnen Sie mit dem veröffentlichten DTS und Takttreiber des Boards; prüfen Sie Registeradressen für den Ziel-SoC.
2. Ermitteln Sie Verbraucher, Zielfrequenz, zulässige Toleranz, mögliche Eltern und sämtliche gemeinsam versorgten Verbraucher.
3. Halten Sie die DTS-Zuweisungen positionsgetreu; prüfen Sie vor Festlegung einer neuen Frequenz `clk_round_rate()`.
4. Prüfen Sie Eltern, tatsächliche Frequenz und Aktivierungszähler über `clk_summary`; messen Sie den Testausgang nur bei entsprechend geprüfter Pinmux- und Schaltplankonfiguration.
5. Testen Sie Suspend/Resume, Peripherieverkehr, Displaymodi und Ethernet-/serielle Genauigkeit. Quellfrequenzen sind Zielwerte und müssen auf Boardebene geprüft werden.
