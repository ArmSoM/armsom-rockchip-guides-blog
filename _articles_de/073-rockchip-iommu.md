---
title: "Rockchip Linux IOMMU V1/V2: Seitentabellen, DMA-Zuordnung und Fehlersuche"
description: "Vollständige Aufbereitung auf Grundlage der chinesischen V1.2.0 mit V2-Seitentabellen, RK3588-Dumps, DMA/DRM/System-Heap und allen 18 FAQ-Abschnitten."
translation_key: "073-rockchip-iommu"
slug: "073-rockchip-iommu"
lang: "de"
date: "2026-10-18"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "IOMMU"]
keywords: "ArmSoM Rockchip rockchip iommu"
excerpt: "Vollständige Aufbereitung auf Grundlage der chinesischen V1.2.0 mit V2-Seitentabellen, RK3588-Dumps, DMA/DRM/System-Heap und allen 18 FAQ-Abschnitten."
---

{% raw %}

# Rockchip Linux IOMMU V1/V2: Seitentabellen, DMA-Zuordnung und Fehlersuche

## Anwendbarkeit auf ArmSoM und Geltungsbereich der Quelle

Plattformreferenz zur Anpassung von ArmSoM-Systemen auf Grundlage der chinesischen V1.2.0 im Vergleich zur englischen V1.0.1. Keine Kombination aus Board, SDK/BSP, Kernel oder Verdrahtung wurde hier auf Hardware geprüft. Der nachstehende Geltungsbereich der Quelle bedeutet nicht, dass jedes ArmSoM-Board oder jeder Kernel diese Funktionen unterstützt. Prüfen Sie den genauen SoC, den Board-Schaltplan, SDK/BSP, Kernel-Treiber und Pinmux. Befehle, Patches, Protokolle und Messungen sind Quellbeispiele, keine ArmSoM-Testergebnisse.

Mit Zustimmung des Nutzers folgen alle Sprachen der chinesischen V1.2.0, einschließlich V2-Layouts, RK3588-Seitentabellen-Dumps, System-Heap-Zuordnung und FAQ 5.9–5.18, die in der englischen V1.0.1 fehlen. Ergänzungen behalten Kommentare mit chinesischen Quellseiten bei. Englisch, Russisch und Deutsch verwenden für die vier gemeinsamen Abbildungen die passenden englischen Originale; die beiden V2-Abbildungen stammen aus dem chinesischen Original, da keine englische Entsprechung vorliegt. Die älteren englischen Formeln verwenden &&, während Chinesisch & verwendet; Grundlage sind die chinesischen Ausdrücke, beide Varianten sind im Redaktionsprotokoll dokumentiert.

| SoC laut Quelle | Kernel-Geltungsbereich laut Quelle |
| --- | --- |
| ROCKCHIP | 4.4/4.19/5.10/6.1 |

Die IOMMU übersetzt virtuelle 32-Bit-Adressen in physische Adressen, stellt Lese-/Schreibberechtigungsbits bereit und kann Interrupts für Seitenfehler sowie Busausnahmen auslösen.

[Redaktionelle Hinweise](/docs/rockchip-iommu/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source CN PDF p.4, unit 0 -->

## 1. IOMMU-Aufbau

<!-- Source CN PDF p.4, unit 1 -->

Es wird eine zweistufige Seitentabellenstruktur verwendet:

<!-- Source CN PDF p.4, unit 2 -->

![Zweistufige IOMMU-Seitentabellenstruktur — englisches Quell-PDF S.6](/docs/rockchip-iommu/assets/en-p06-figure1.png)

*Zweistufige IOMMU-Seitentabellenstruktur — englisches Quell-PDF S.6.*

<!-- Source CN PDF p.4, unit 3 -->

![Felder einer virtuellen 32-Bit-IOMMU-Adresse — englisches Quell-PDF S.6](/docs/rockchip-iommu/assets/en-p06-figure2.png)

*Felder einer virtuellen 32-Bit-IOMMU-Adresse — englisches Quell-PDF S.6.*

<!-- Source CN PDF p.4, unit 4 -->

Die 32-Bit-Adresse enthält einen 10-Bit-Versatz in der Tabelle erster Ebene, einen 10-Bit-Versatz in der Tabelle zweiter Ebene und einen 12-Bit-Versatz innerhalb der Seite.

<!-- Source CN PDF p.4, unit 5 -->

DTE-Aufbau:

<!-- Source CN PDF p.4, unit 6 -->

![DTE-Layout der IOMMU V1 — englisches Quell-PDF S.6](/docs/rockchip-iommu/assets/en-p06-figure3.png)

*DTE-Layout der IOMMU V1 — englisches Quell-PDF S.6.*

<!-- Source CN PDF p.4, unit 7 -->

V2-DTE-Aufbau (chinesische Quelle V1.2.0):

<!-- Source CN PDF p.4, unit 8 -->

![DTE-Layout der IOMMU V2 — chinesisches Quell-PDF S.4](/docs/rockchip-iommu/assets/cn-p04-figure4.png)

*DTE-Layout der IOMMU V2 — chinesisches Quell-PDF S.4.*

<!-- Source CN PDF p.4, unit 9 -->

bit0: Gibt an, ob die Seitentabelle der nächsten Ebene vorhanden ist.

<!-- Source CN PDF p.4, unit 10 -->

PTE-Aufbau:

<!-- Source CN PDF p.5, unit 11 -->

![PTE-Layout und Berechtigungen der IOMMU V1 — englisches Quell-PDF S.7](/docs/rockchip-iommu/assets/en-p07-figure1.png)

*PTE-Layout und Berechtigungen der IOMMU V1 — englisches Quell-PDF S.7.*

<!-- Source CN PDF p.5, unit 12 -->

bit0: Gibt an, ob die physische Seite vorhanden ist.

<!-- Source CN PDF p.5, unit 13 -->

bit1: Leseberechtigung.

<!-- Source CN PDF p.5, unit 14 -->

bit2: Schreibberechtigung.

<!-- Source CN PDF p.5, unit 15 -->

V2-PTE-Aufbau (chinesische Quelle V1.2.0):

<!-- Source CN PDF p.5, unit 16 -->

![PTE-Layout der IOMMU V2 — chinesisches Quell-PDF S.5](/docs/rockchip-iommu/assets/cn-p05-figure2.png)

*PTE-Layout der IOMMU V2 — chinesisches Quell-PDF S.5.*

Der vorstehende V1-Text nennt bit1=Lesen und bit2=Schreiben, die V2-Abbildung beschriftet dagegen bit2=Leseberechtigung und bit1=Schreibberechtigung (bit0=Seite vorhanden). Dieser versionsabhängige Unterschied bleibt exakt wie gezeigt erhalten. Übertragen Sie V1-Berechtigungen nicht ungeprüft auf V2; prüfen Sie den passenden Treiber beziehungsweise das TRM. Es erfolgte keine Hardwarevalidierung.

<!-- Source CN PDF p.5, unit 17 -->

## 2. IOMMU-Treiber

<!-- Source CN PDF p.5, unit 18 -->

### 2.1 Treiberdatei

<!-- Source CN PDF p.5, unit 19 -->

Pfad der Treiberdatei:

<!-- Source CN PDF p.5, unit 20 -->

```text
drivers/iommu/rockchip-iommu.c
```

<!-- Source CN PDF p.5, unit 21 -->

### 2.2 DTS-Knoten konfigurieren

<!-- Source CN PDF p.5, unit 22 -->

Die DTS-Konfiguration ist in `Documentation/devicetree/bindings/iommu/rockchip,iommu.txt` beschrieben. Die wichtigsten Parameter folgen:

<!-- Source CN PDF p.5, unit 23 -->

`compatible = "rockchip,iommu";`

<!-- Source CN PDF p.5, unit 24 -->

`compatible = "rockchip,iommu-v2";` — V2 aus der chinesischen Quelle V1.2.0.

<!-- Source CN PDF p.6, unit 25 -->

Laut Quelle verwenden die IOMMUs der Geräte denselben compatible-Wert. Für Ausnahmeinterrupts wie Seitenfehler nennt sie `interrupts = <GIC_SPI 119 IRQ_TYPE_LEVEL_HIGH 0>;`. Das Beispiel bleibt erhalten und ist gegen das tatsächliche DTS-Binding zu prüfen; oben enthält die Quelle sowohl V1- als auch V2-compatible-Zeichenfolgen.

<!-- Source CN PDF p.6, unit 26 -->

`clocks = <&cru ACLK_VOP1>, <&cru HCLK_VOP1>;`

<!-- Source CN PDF p.6, unit 27 -->

`clock-names = "aclk", "hclk";` — IOMMU und Master teilen sich Takte; diese Einträge ermöglichen dem IOMMU-Treiber deren unabhängige Steuerung.

<!-- Source CN PDF p.6, unit 28 -->

`power-domains = <&power RK3399_PD_VOPL>;` — ermöglicht Power-Domain-Operationen im IOMMU-Treiber.

<!-- Source CN PDF p.6, unit 29 -->

`iommu-cells = <0>;` — die Quelle verlangt 0; siehe iommu.txt. Das fehlende `#` in dieser Quellschreibweise bleibt erhalten und ist im Redaktionsprotokoll markiert.

<!-- Source CN PDF p.6, unit 30 -->

## 3. IOMMU verwenden

<!-- Source CN PDF p.6, unit 31 -->

Der Rockchip-IOMMU-Treiber hängt vom IOMMU-Framework ab:

<!-- Source CN PDF p.6, unit 32 -->

```text
drivers/iommu/iommu.c
```

<!-- Source CN PDF p.6, unit 33 -->

Er implementiert hauptsächlich Rückruffunktionen in:

<!-- Source CN PDF p.6, unit 34 -->

```text
struct iommu_ops rk_iommu_ops
```

<!-- Source CN PDF p.6, unit 35 -->

Der Master ruft die Framework-APIs auf, um die IOMMU wie folgt zu steuern:

<!-- Source CN PDF p.6, unit 36 -->

**1. iommu attach**

<!-- Source CN PDF p.6, unit 37 -->

```text
iommu_attach_device -> rk_iommu_attach_device /* enable iommu */
```

<!-- Source CN PDF p.6, unit 38 -->

**2. iommu detach**

<!-- Source CN PDF p.6, unit 39 -->

```text
iommu_detach_device -> rk_iommu_detach_device /* disable iommu */
```

<!-- Source CN PDF p.6, unit 40 -->

**3. iommu map**

<!-- Source CN PDF p.6, unit 41 -->

```text
iommu_map -> rk_iommu_map
```

<!-- Source CN PDF p.6, unit 42 -->

Erstellt Seitentabellen und Zuordnungen zwischen virtuellen und physischen Adressen. Aktivieren Sie bei der Fehlersuche die dbg-Ausgabe in iommu_map, um die Zuordnung zu beobachten.

<!-- Source CN PDF p.6, unit 43 -->

**4. iommu unmap**

<!-- Source CN PDF p.6, unit 44 -->

```text
iommu_unmap -> rk_iommu_unmap
```

<!-- Source CN PDF p.7, unit 45 -->

Entfernt die Zuordnungen zwischen virtuellen und physischen Adressen und gibt virtuellen Adressraum frei. Aktivieren Sie die dbg-Ausgabe in iommu_unmap, um das Aufheben der Zuordnung zu beobachten.

<!-- Source CN PDF p.7, unit 46 -->

**5. domain alloc**

<!-- Source CN PDF p.7, unit 47 -->

```text
iommu_domain_alloc -> rk_iommu_domain_alloc
```

<!-- Source CN PDF p.7, unit 48 -->

Weist die von attach/detach verwendete Seitentabellen-Basisadresse zu.

<!-- Source CN PDF p.7, unit 49 -->

**6. domain free**

<!-- Source CN PDF p.7, unit 50 -->

```text
iommu_domain_free -> rk_iommu_domain_free
```

<!-- Source CN PDF p.7, unit 51 -->

Gibt den Seitentabellenspeicher frei.

<!-- Source CN PDF p.7, unit 52 -->

**7. IOMMU-Seitentabellen ausgeben. Für RK3399 vopl_iommu und die virtuelle Adresse VA=0x00001000 gilt folgender Ablauf. a. Tabellenbasis DT der ersten Ebene ermitteln:**

<!-- Source CN PDF p.7, unit 53 -->

```text
io -4 0xff8f3f00
```

<!-- Source CN PDF p.7, unit 54 -->

b. Tabellenversatz der ersten Ebene berechnen:

<!-- Source CN PDF p.7, unit 55 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.7, unit 56 -->

c. Physische Adresse des Eintrags erster Ebene DTE berechnen:

<!-- Source CN PDF p.7, unit 57 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.7, unit 58 -->

d. Tabellenbasis PT der zweiten Ebene ermitteln:

<!-- Source CN PDF p.7, unit 59 -->

```text
PT = io -4 DTE
```

<!-- Source CN PDF p.7, unit 60 -->

e. Tabellenversatz der zweiten Ebene berechnen:

<!-- Source CN PDF p.7, unit 61 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.7, unit 62 -->

f. Physische Adresse des Eintrags zweiter Ebene PTE berechnen:

<!-- Source CN PDF p.7, unit 63 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.7, unit 64 -->

g. Physische PAGE-Adresse page ermitteln:

<!-- Source CN PDF p.7, unit 65 -->

```text
page = io -4 PTE
```

<!-- Source CN PDF p.7, unit 66 -->

h. Versatz innerhalb der Seite offset berechnen:

<!-- Source CN PDF p.7, unit 67 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 68 -->

Die Quelle bezeichnet offset als die physische Adresse zur virtuellen Adresse 0x00001000; der Master kann dort Daten untersuchen. Für RK3588 vop_mmu mit VA=0x00001000 ergänzt die chinesische V1.2.0 folgenden Ablauf. a. Tabellenbasis DT der ersten Ebene ermitteln:

<!-- Source CN PDF p.8, unit 69 -->

```text
DT = io -4 0xfdd97e00
DT = ((DT & 0xf0) << 32) | ((DT & 0xf00) << 24) | (DT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 71 -->

b. Tabellenversatz der ersten Ebene berechnen:

<!-- Source CN PDF p.8, unit 72 -->

```text
index1 = VA >> 22
```

<!-- Source CN PDF p.8, unit 73 -->

c. Physische Adresse DTE berechnen:

<!-- Source CN PDF p.8, unit 74 -->

```text
DTE = index1 * 4 + DT
```

<!-- Source CN PDF p.8, unit 75 -->

d. Tabellenbasis PT der zweiten Ebene ermitteln:

<!-- Source CN PDF p.8, unit 76 -->

```text
PT = io -4 DTE
PT = ((PT & 0xf0) << 32) | ((PT & 0xf00) << 24) | (PT & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 78 -->

e. Tabellenversatz der zweiten Ebene berechnen:

<!-- Source CN PDF p.8, unit 79 -->

```text
index2 = VA & 0x3ff000
```

<!-- Source CN PDF p.8, unit 80 -->

f. Physische Adresse PTE berechnen:

<!-- Source CN PDF p.8, unit 81 -->

```text
PTE = index2 * 4 + PT
```

<!-- Source CN PDF p.8, unit 82 -->

g. Physische Seitenadresse page ermitteln:

<!-- Source CN PDF p.8, unit 83 -->

```text
page = io -4 PTE
page = ((page & 0xf0) << 32) | ((page & 0xf00) << 24) | (page & 0xfffff000)
```

<!-- Source CN PDF p.8, unit 85 -->

h. offset berechnen:

<!-- Source CN PDF p.8, unit 86 -->

```text
offset = page + (VA & 0xfff)
```

<!-- Source CN PDF p.8, unit 87 -->

Die Quelle bezeichnet offset als die physische Adresse zu VA=0x00001000; der Master kann damit Daten untersuchen. Die Formeln sind wörtlich übernommen und wurden nicht auf Hardware geprüft.

<!-- Source CN PDF p.8, unit 88 -->

**8. dma-mapping. a. Bei einem Gerät ohne IOMMU:**

<!-- Source CN PDF p.9, unit 89 -->

```text
ARM32: dev->dma_ops = arm_dma_ops;
ARM64: dev->dma_ops = arm64_swiotlb_dma_ops;
```

<!-- Source CN PDF p.9, unit 90 -->

b. Bei einem IOMMU-Gerät:

<!-- Source CN PDF p.9, unit 91 -->

```text
ARM32: dev->dma_ops = iommu_ops;
ARM64: dev->dma_ops = iommu_dma_ops;
```

<!-- Source CN PDF p.9, unit 92 -->

Am Beispiel dma_alloc_attrs:

<!-- Source CN PDF p.9, unit 93 -->

**1. Bei einem Gerät ohne IOMMU weist die alloc-Rückruffunktion der dma_ops aus (a) zusammenhängenden physischen Speicher und eine virtuelle Kernel-Adresse zu.**

<!-- Source CN PDF p.9, unit 94 -->

**2. Bei einem IOMMU-Gerät weist alloc in den dma_ops aus (b) physischen Speicher zu und ruft über das Framework iommu_map auf, um Seitentabellen und Zuordnungen zwischen virtuellen und physischen Adressen zu erstellen. Zurückgegeben werden die anfängliche virtuelle IOMMU-Adresse und die virtuelle Kernel-Adresse.**

<!-- Source CN PDF p.9, unit 95 -->

Minimaler Ablauf zur IOMMU-Nutzung:

<!-- Source CN PDF p.9, unit 96 -->

```text
1. domain = iommu_domain_alloc(&platform_bus_type);
2. iommu_map(domain, iova, paddr, size, prot)；
3. iommu_attach_device(domain, dev)；
4. master启动访问iommu
```

<!-- Source CN PDF p.9, unit 97 -->

Die IOMMU ist eine Basiskomponente, die sich in Allokatoren wie ion/drm einbetten lässt. Unter ARM64 DRM lautet ein vollständiger Ablauf zur IOMMU-Pufferzuweisung und -zuordnung:

<!-- Source CN PDF p.9, unit 98 -->

```text
rockchip_gem_alloc_buf ->
rockchip_gem_get_pages ->
rockchip_gem_iommu_map ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 99 -->

IOMMU-Zuordnung bei Übergabe eines fd:

<!-- Source CN PDF p.9, unit 100 -->

DRM-Pfad:

<!-- Source CN PDF p.9, unit 101 -->

```text
1. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> drm_gem_map_dma_buf ->
dma_map_sg_attrs -> map_sg ->
__iommu_map_sg_attrs ->
iommu_dma_map_sg ->
iommu_map_sg ->
iommu_map
```

<!-- Source CN PDF p.9, unit 102 -->

SYSTEM-HEAP-Pfad:

<!-- Source CN PDF p.10, unit 103 -->

```text
2. struct dma_buf *dmabuf = dma_buf_get(fd) ->
dma_buf_attach -> dma_buf_map_attachment ->
map_dma_buf -> system_heap_map_dma_buf ->
dma_map_sgtable -> __dma_map_sg_attrs ->
map_sg -> iommu_dma_map_sg ->
iommu_map_sg_atomic ->
__iommu_map_sg ->
__iommu_map
```

<!-- Source CN PDF p.10, unit 104 -->

## 4. Kernel-Konfiguration

<!-- Source CN PDF p.10, unit 105 -->

```text
Symbol: ROCKCHIP_IOMMU [=y]
Type : boolean
Prompt: Rockchip IOMMU Support
    Location:
        -> Device Drivers
            -> IOMMU Hardware Support (IOMMU_SUPPORT [=y])
    Defined at drivers/iommu/Kconfig:211
    Depends on: IOMMU_SUPPORT [=y] && (ARM || ARM64 [=y]) && (ARCH_ROCKCHIP [=y] ||
                COMPILE_TEST [=n])
    Selects: IOMMU_API [=y] && ARM_DMA_USE_IOMMU
```

<!-- Source CN PDF p.10, unit 106 -->

## 5. Häufige Fragen zur IOMMU

<!-- Source CN PDF p.10, unit 107 -->

### 5.1 Seitenfehlerinterrupt

<!-- Source CN PDF p.10, unit 108 -->

Ein Seitenfehlerinterrupt bedeutet, dass für die aktuell verwendete virtuelle Adresse keine Zuordnung existiert. Bei Mastern traten drei Fälle auf: Zugriff auf eine nicht zugeordnete Adresse, Zugriff außerhalb der Grenzen oder Zugriffsbeginn vor Erstellung der Zuordnung.

<!-- Source CN PDF p.10, unit 109 -->

### 5.2 Fehler bei IOMMU enable-stall

<!-- Source CN PDF p.10, unit 110 -->

Möglicherweise ist bereits ein IOMMU-Seitenfehler aufgetreten, und der Master greift ohne dessen Behandlung weiter zu; prüfen Sie das Protokoll.

<!-- Source CN PDF p.10, unit 111 -->

Auch eine fehlerhafte Taktsteuerung ist möglich. Lassen Sie PD und CLK vorübergehend aktiviert, um diese Ursachen auszuschließen.

<!-- Source CN PDF p.11, unit 112 -->

### 5.3 IOMMU-Register nicht erreichbar

<!-- Source CN PDF p.11, unit 113 -->

Die Power-Domain-Verwaltung des Masters verwendet möglicherweise pm_runtime_get_sync/pm_runtime_put_sync falsch und greift auf IOMMU-Register zu, bevor die IOMMU-Power-Domain aktiviert ist.

<!-- Source CN PDF p.11, unit 114 -->

### 5.4 Fortlaufende IOMMU-Interrupts

<!-- Source CN PDF p.11, unit 115 -->

Die Interruptnummer im DTS kann falsch sein.

<!-- Source CN PDF p.11, unit 116 -->

Der Master greift möglicherweise ständig auf nicht zugeordnete IOVA zu; häufig treten dabei Anzeigefehler auf.

<!-- Source CN PDF p.11, unit 117 -->

### 5.5 Flackern der Anzeige beim Start

<!-- Source CN PDF p.11, unit 118 -->

Das Aktivieren der IOMMU während einer laufenden VOP-Anzeige kann das Einlesen der Bilddaten stören. Bei Chips ohne zum Frame-Wechsel wirksame Umschaltung muss vor dem Aktivieren gewartet werden, bis VOP keine Daten abruft.

<!-- Source CN PDF p.11, unit 119 -->

### 5.6 Fehlerhafte IOMMU-Register

<!-- Source CN PDF p.11, unit 120 -->

Grenzüberschreitende Zugriffe des Masters auf IOMMU-Register können dieses Problem verursachen.

<!-- Source CN PDF p.11, unit 121 -->

Ein Reset des gesamten Master-IP-Blocks setzt auch die IOMMU zurück, da sie in diesen IP-Block integriert ist.

<!-- Source CN PDF p.11, unit 122 -->

Stellen Sie nach einem Master-Reset die IOMMU-Registerkonfiguration wieder her.

<!-- Source CN PDF p.11, unit 123 -->

### 5.7 IOMMU-Integration über device-link

<!-- Source CN PDF p.11, unit 124 -->

Die Power-Domain-Steuerung wird an den Master übergeben; achten Sie auf die richtige Verwendung von pm_runtime_get/pm_runtime_put.

<!-- Source CN PDF p.11, unit 125 -->

Ein Aufruf von pm_runtime_get im Master aktiviert die IOMMU.

<!-- Source CN PDF p.11, unit 126 -->

Ein Aufruf von pm_runtime_put im Master deaktiviert die IOMMU.

<!-- Source CN PDF p.11, unit 127 -->

### 5.8 Pflege der Seitentabellen

<!-- Source CN PDF p.11, unit 128 -->

Unter ARM32 benötigen Master mit gemeinsam genutzter IOMMU, etwa vepu und vdpu, getrennte Seitentabellen und müssen vor jedem Zugriff die passende Tabelle anhängen. ARM64 verwendet gemeinsame Seitentabellen, daher ist wiederholtes attach nicht erforderlich.

<!-- Source CN PDF p.11, unit 129 -->

### 5.9 Reset-Fehler bei hoher Taktfrequenz

<!-- Source CN PDF p.11, unit 130 -->

RK3288-Neustart-Stresstests können VOP-Seitenfehler auslösen. Bei übertaktetem VOP kann der erzwungene Reset der VOP-IOMMU scheitern. Die Quelle umgeht dies, indem sie beim Anhängen der VOP-IOMMU den erzwungenen Reset überspringt.

<!-- Source CN PDF p.12, unit 131 -->

### 5.10 VOP-IOMMU auf RK3128/RK3126 nicht lesbar

<!-- Source CN PDF p.12, unit 132 -->

Die VOP-IOMMU-Register dieser Chips sind nicht lesbar. Ergänzen Sie folgenden Workaround in der DTS-Konfiguration der VOP-IOMMU:

<!-- Source CN PDF p.12, unit 133 -->

```text
rockchip,skip-mmu-read
```

<!-- Source CN PDF p.12, unit 134 -->

Der Treiber überspringt die betreffenden Lesezugriffe; das Flag heißt iommu->skip_read.

<!-- Source CN PDF p.12, unit 135 -->

### 5.11 Reset-Vorgang

<!-- Source CN PDF p.12, unit 136 -->

Nach einem Reset der ISP-IOMMU bestätigt ihr Statusregister den Abschluss möglicherweise nicht, obwohl der Reset erfolgreich war. Ergänzen Sie folgenden Workaround im ISP-IOMMU-DTS-Knoten:

<!-- Source CN PDF p.12, unit 137 -->

```text
rockchip,disable-mmu-reset
```

<!-- Source CN PDF p.12, unit 138 -->

Dadurch wird der ISP-IOMMU-Reset übersprungen; das Treiberflag heißt iommu->reset_disabled.

<!-- Source CN PDF p.12, unit 139 -->

### 5.12 Wirksamkeit von Schreibbefehlen sicherstellen

<!-- Source CN PDF p.12, unit 140 -->

Laut Quelle können bei der rkvenc-IOMMU von RK1126 und RV1109 Schreibbefehle verloren gehen; wiederholen Sie Schreibzugriffe mehrmals, um dies zu vermeiden. RK1126 bleibt wie im Original geschrieben erhalten und muss geprüft werden.

<!-- Source CN PDF p.12, unit 141 -->

### 5.13 Automatisches Anhängen der VOP-IOMMU deaktivieren

<!-- Source CN PDF p.12, unit 142 -->

Ab Kernel 4.19 hängt VOP die IOMMU explizit an, statt dies automatisch bei Registrierung des Geräteknotens zu tun. Dadurch werden Anzeigeprobleme beim Übergang von U-Boot zum Kernel vermieden.

<!-- Source CN PDF p.12, unit 143 -->

### 5.14 Leistungseinbußen durch Leeren des IOMMU-TLB

<!-- Source CN PDF p.12, unit 144 -->

Zuordnungen erfordern das Leeren des TLB. Fragmentierte Puffer können viele Leerungen verursachen und die Leistung senken; ergänzen Sie ein Flag, sodass der TLB nur einmal geleert wird.

<!-- Source CN PDF p.12, unit 145 -->

### 5.15 Eins-zu-eins-Zuordnung für VOP-IOMMU

<!-- Source CN PDF p.12, unit 146 -->

Eine Eins-zu-eins-Zuordnung vermeidet Anzeigefehler durch das Warten auf zum Frame-Wechsel wirksame Aktualisierungen beim Übergang zwischen U-Boot und Kernel. Beispielsweise hat RK356X mehr Master als IOMMUs, weshalb dieses Warten nicht verfügbar ist; eine Identitätsabbildung umgeht das Problem.

<!-- Source CN PDF p.13, unit 147 -->

### 5.16 Ein Master mit zwei IOMMUs

<!-- Source CN PDF p.13, unit 148 -->

Sofern keine besonderen Anforderungen bestehen, optimieren Sie den Master-Treiber so, dass beide IOMMUs dieselbe Seitentabelle verwenden.

<!-- Source CN PDF p.13, unit 149 -->

Der neuere IOMMU-Treiber der Quelle verwendet für mehrere IOMMUs eines Masters automatisch dieselbe Seitentabelle; Eingriffe des Master-Treibers sind nicht erforderlich.

<!-- Source CN PDF p.13, unit 150 -->

### 5.17 Zwischen H.264/H.265 auf PX30 umschalten

<!-- Source CN PDF p.13, unit 151 -->

Verwenden Sie folgende Reihenfolge:

<!-- Source CN PDF p.13, unit 152 -->

1. Sicherstellen, dass alle Takte aktiviert sind.
2. Sicherstellen, dass alle Power-Domains aktiviert sind.
3. Alle IOMMUs deaktivieren.
4. GRF umschalten.
5. Aktuelle IOMMU aktivieren.

<!-- Source CN PDF p.13, unit 157 -->

### 5.18 Fehler beim gleichzeitigen Betrieb von VPU und HEVC auf RK3368

<!-- Source CN PDF p.13, unit 158 -->

RK3368-VPU und HEVC teilen sich einen IOMMU-TLB. Führen Sie TLB-Operationen und damit Zuordnungsoperationen seriell aus, um Fehler zu verhindern.

{% endraw %}
