---
title: "Rockchip-PLL-Spreiztaktung: EMI, SSMOD und SSCG"
description: "Referenz zur Rockchip-PLL-Spreiztaktung: Parameter, Registerbeispiele, U-Boot-/Kerneländerungen, Jitter und Stabilitätsgrenzen."
translation_key: "035-rockchip-pll-spread-spectrum"
slug: "035-rockchip-pll-spread-spectrum"
lang: "de"
date: "2026-10-15"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "linux"
products: ["Sige7", "Sige5", "CM5", "AIM7", "AIM5"]
tags: ["PLL", "SSCG", "SSMOD", "EMI", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip PLL spread spectrum SSCG SSMOD EMI RK3588 RK3576"
excerpt: "Vollständige Referenz zu Parametern, Registern und Risiken der Rockchip-PLL-Spreiztaktung."
---

{% raw %}
# Rockchip-PLL-Spreiztaktung: EMI, SSMOD und SSCG

Diese aus der Quelle abgeleitete Plattformreferenz gilt auf SoC-/BSP-Ebene für Boards mit dokumentiert unterstütztem SoC, darunter Sige7/AIM7 (RK3588) und Sige5/CM5/AIM5 (RK3576). Prüfen Sie vor jedem Registerschreibzugriff die genaue CRU-Registerkarte, den PLL-Elternbaum, nachgelagerte Verbraucher und die veröffentlichte Bootfirmware-/Kernelversion. Messungen zu EMI, Jitter, Stabilität oder Zertifizierung auf ArmSoM wurden nicht durchgeführt.

Quelle: *Rockchip PLL Frequency Spreading Function Detailed Explanation*, V1.8.0, 2025-04-16. Die chinesische Quelle umfasst 13 Seiten, die englische 12, da die Versionshistorie gesondert angeordnet ist. Die entsprechenden Diagramme stehen auf den chinesischen Seiten 6–7 und englischen Seiten 5–6. Deckblatt, rechtliche Hinweise, Zielgruppenabschnitt und Versionshistorie wurden weggelassen.

## 1. Prinzip der Spreiztaktung

Taktflanken gehören häufig zu den höchstfrequenten Signalen eines Systems und sind eine verbreitete EMI-Quelle. Spread-Spectrum Clock Generation (SSCG/SSG) moduliert die Taktfrequenz und verteilt dadurch Energie, die sich sonst in einem schmalen Frequenzband konzentrieren würde. Das senkt Spitzen der Grundfrequenz und ungeradzahliger Oberwellen. Die Technik wirkt auf Systemebene, da synchrone Daten-, Adress- und Steuersignale mit der Taktquelle moduliert werden.

![Originaldiagramm: SSG-Prinzip](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_EN-p5-X42.png)

### 1.1 Parameter

- **Modulationsfrequenz**: Geschwindigkeit, mit der die Ausgangsfrequenz den eingestellten Bereich durchläuft. Sie sollte deutlich unter der Quelltaktfrequenz liegen, um Setup-/Hold-Probleme zu vermeiden, zugleich aber oberhalb des hörbaren Bereichs von 20 Hz–20 kHz. Die Quelle nennt typisch 30–120 kHz.
- **Modulationstiefe**: prozentuale Frequenzabweichung von der Quellfrequenz. Eine größere Tiefe senkt im Allgemeinen EMI-Spitzen, muss jedoch innerhalb der Systemtoleranz bleiben.

![Originaldiagramm: EMI-Spitzen bei unterschiedlichen Modulationstiefen](/docs/rockchip-pll-ssmod-clock/assets/Rockchip_Developer_Guide_Pll_Ssmod_Clock_EN-p6-X48.png)

## 2. PLL-Parameter konfigurieren

### 2.1 Allgemeine PLLs außer RK3588

1. Aktivieren Sie den Fractional-Modus durch `dsmpd = 0`. Eine PLL ohne Fractional-Modus unterstützt keine Spreiztaktung.
2. Setzen Sie `ssmod_reset = 0`, `ssmod_disable_sscg = 0` und `ssmod_bp = 0`.
3. Stellen Sie die Amplitude mit `ssmod_spread = n`, `n = 0…0x1f` ein; `n` steht für `0.n%`.
4. Stellen Sie die Modulationsfrequenz mit `ssmod_divval = n`, `n = 0…0xf` ein.

```text
spread-spectrum rate (Hz) = 24000000 / refdiv / 128 / n
```

`refdiv` ist ein PLL-Parameter, laut Quelle normalerweise 1; prüfen Sie das Ziel-TRM. Nur RK3399 benötigt eine externe Vektortabelle: Setzen Sie `ssmod_sel_ext_wave = 1` und `ssmod_ext_maxaddr = 0xff`.

### 2.2 PLLs des RK3588

- Aktivieren Sie den modulierten Modus mit `sscg_en = 1` (`0` deaktiviert ihn).
- Stellen Sie die Amplitude mit `mrr = 0…63` ein; Quellformel: `MR = mfr * mrr / m / 32`.
- Stellen Sie die Modulationsfrequenz mit `mfr = 0…255` ein; Quellformel: `MF = Fin / p / mfr / 32`.
- Setzen Sie `sel_pf`: `0` für Abwärtsspreizung, `1` für Aufwärtsspreizung, `1x` für zentrierte Spreizung. Die Quelle empfiehlt wegen des Jitters im Allgemeinen zentrierte Spreizung.

## 3. Registerbeispiele

Diese Befehle stammen aus der Quelle und müssen für das Zielsystem geprüft werden. Adressen, Ziel-PLLs und Bitkodierungen sind SoC-spezifisch.

```sh
# RK3399 GPLL
io -4 0xff760094 0x00010001
io -4 0xff760090 0x1f000100
io -4 0xff760090 0x00f000f0
io -4 0xff760094 0xff00ff00
io -4 0xff76008c 0x00080000
io -4 0xff760090 0x00070000

# RK3328 CPLL / PX30 GPLL / RK3308 VPLL0 / RV1126 HPLL / RK1808 GPLL
# use each target's CRU base address; amplitude is 0x1f000800,
# rate is 0x00f00060, then fractional mode and SSMOD enable.

# RK356X GPLL
io -4 0xfdd2004c 0x1f000800
io -4 0xfdd2004c 0x00f00060
io -4 0xfdd20044 0x10000000
io -4 0xfdd2004c 0x00070000

# RK3588 GPLL
io -4 0xfd7c01cc 0x00ff000c
io -4 0xfd7c01cc 0x3f000500
io -4 0xfd7c01cc 0xc0008000
io -4 0xfd7c01d0 0x00010001

# RK3576 GPLL
io -4 0x272001cc 0x00ff000c
io -4 0x272001cc 0x3f000500
io -4 0x272001cc 0xc0008000
io -4 0x272001d0 0x00010001
```

Die Quelle enthält entsprechende allgemeine PLL-Beispiele für RK3528 (`0xff4a006c`/`0xff4a0064`), RK3562 (`0xff10006c`/`0xff100064`), RK2118 V0PLL (`0x50b1002c`/`0x50b10024`), RV1103B (`0x2006006c`/`0x20060064`), RK3506 (`0xff9b000c`/`0xff9b0004`) und RV1126B/RV1126B-P (`0x2000002c`/`0x20000024`). Die Sequenzen behalten die oben gezeigte Reihenfolge Amplitude/Modulationsfrequenz/Fractional-Modus/Aktivierung bei. Entnehmen Sie jeden vollständigen Schreibwert der Quell-PDF und dem Ziel-TRM. RK3036, RK312X, RK322X, RK3188, RK3288 und RK3368 unterstützen diese Funktion laut Quelle nicht.

Die empfohlene Modulationsfrequenz beträgt 30 kHz. Die Quelle nennt keine allgemeingültige Amplitude; bestimmen Sie diese durch Labormessungen und EMI-Zertifizierung. Verwenden Sie auch bei ähnlichen PLLs stets deren jeweilige Basisadresse.

## 4. Dauerhafte Konfiguration

Konfigurieren Sie die festgelegten Parameter früh im Startablauf. Für RK3399 zeigt die Quelle U-Boot-Schreibzugriffe in `drivers/clk/rockchip/clk_rk3399.c` und Kernel-Schreibzugriffe in `drivers/clk/rockchip/clk-rk3399.c`, nach der Taktinitialisierung und vor der Registrierung des Providers. DPLL-/DDR-SSC muss im Loader eingerichtet werden; Änderungen des DDR-Takts an anderer Stelle können Instabilität oder Abstürze verursachen.

Beispielhafte RK3399-U-Boot-Sequenz:

```c
writel(0x1f001f00, &priv->cru->dpll_con[4]);
writel(0x00f00060, &priv->cru->dpll_con[4]);
writel(0x7f002700, &priv->cru->dpll_con[5]);
writel(0x00080000, &priv->cru->dpll_con[3]);
writel(0x00070000, &priv->cru->dpll_con[4]);
writel(0x00010001, &priv->cru->dpll_con[5]);
```

## 5. Technische Grenzen und Validierung

SSCG ist für bestimmte präzisionskritische Takte wie Ethernet und CAN ungeeignet. Es erzeugt Jitter und kann Setup-/Hold-Verletzungen, hohe Fehlerraten oder den Verlust der PLL-Verriegelung verursachen. Die Quelle schätzt den zusätzlichen Periodenjitter auf weniger als etwa 0.05%; dies ist keine Garantie auf Boardebene.

PLL-SSC beeinflusst alle von dieser PLL abgeleiteten Takte. Gemeinsam versorgte Verbraucher wie eMMC und SDIO können unterschiedliche EMI-Anforderungen haben; prüfen Sie beide, bevor Sie einen Kompromiss wählen. Für DDR, USB, SDIO, I2C, SPI, I2S, USB3.0, PCIe und eDP können SSC-Anforderungen gelten; beachten Sie die jeweiligen Spezifikationen. Aktivieren Sie SSC nur bei Bedarf und mit der kleinsten Tiefe, die die EMI-Anforderungen erfüllt. USB2.0 kann nach Aktivierung von SSC Frequenztests nicht bestehen; die Größe des elastischen PHY-Puffers beeinflusst die Toleranz. Prüfen Sie Stabilität und Kompatibilität für jedes Projekt gesondert.
{% endraw %}
