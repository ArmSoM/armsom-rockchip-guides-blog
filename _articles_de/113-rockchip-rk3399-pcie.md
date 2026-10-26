---
title: "RK3399-PCIe-Entwicklerleitfaden: DTS, NVMe, ASPM und Fehlersuche"
description: "RK3399-PCIe-Entwicklerleitfaden: DTS, NVMe, ASPM und Fehlersuche — RK-KF-YF-175 V1.1.0; Linux 4.4/4.19"
translation_key: "113-rockchip-rk3399-pcie"
slug: "113-rockchip-rk3399-pcie"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "RK3399", "PCIe", "NVMe"]
excerpt: "RK3399-PCIe-Entwicklerleitfaden: DTS, NVMe, ASPM und Fehlersuche — RK-KF-YF-175 V1.1.0; Linux 4.4/4.19"
---

{% raw %}

# RK3399-PCIe-Entwicklerleitfaden: DTS, NVMe, ASPM und Fehlersuche

Vollständige technische Übersetzung der Seiten 4–8 des chinesischen RK-KF-YF-175 V1.1.0. Die Quelle gilt für RK3399 und Kernel 4.4/4.19. Dies ist eine Plattformreferenz; eine passende ArmSoM-Platine ist nicht bestätigt. Die Unterstützung wird nicht auf sämtliche ArmSoM-Platinen oder andere SoCs ausgeweitet. Tatsächliches SDK/BSP, PCIe-Pins, Versorgung, Device Tree und Peripherietreiber platinenbezogen prüfen. Nur das chinesische PDF liegt vor; alle vier Sprachen verwenden dessen Abbildungen. Tabellenwerte sind Herstellerbeispiele vom RK3399 EVB3, keine ArmSoM-Messungen. Keine Hardwarevalidierung durchgeführt.

> Beibehaltene Quellenfragen: Die DTS-Schreibweise `status = <okay>;` und der Versorgungsverweis `vpcie0v9-supply = <&vdd_pcie1v8>;` sind am tatsächlichen BSP/Schaltplan zu prüfen, nicht blind zu übernehmen. Aussagen zu Lane-Tausch, Versorgung und Bandbreite stammen aus der Quelle; Lane-Tausch wurde vom Hersteller ausdrücklich nicht getestet. Der folgende fio-Schreibtest überschreibt das Zielblockgerät; nicht auf Geräten mit Daten ausführen. Spätere Vorschläge zur Spannungserhöhung sind keine sicheren Handlungsanweisungen; Platinen-/Bauteilspezifikationen niemals überschreiten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. DTS-Konfiguration

1. `ep-gpios = <&gpio3 13 GPIO_ACTIVE_HIGH>;` konfiguriert das PCIe-Reset-Signal PERST#. Suchen Sie den Pin im Schaltplan und konfigurieren Sie ihn korrekt, unabhängig davon, ob das Gerät gesteckt oder verlötet ist. Andernfalls scheitert der Linkaufbau.

2. `num-lanes = <4>;` legt die Anzahl der vom PCIe-Gerät verwendeten Lanes fest. Normalerweise ist keine Anpassung nötig; die Software erkennt ungenutzte Lanes und schaltet sie zum Stromsparen ab.

3. `status = <okay>;` ist die genaue Schreibweise der Quelle. Aktivieren Sie sowohl `pcie0` als auch `pcie_phy`. Standardmäßig sind sie deaktiviert, weil die PCIe-Erkennung ohne Peripheriegerät den Start deutlich verzögert. Projekte mit PCIe-Bedarf müssen beide einschalten. Beachten Sie vor Verwendung den redaktionellen Hinweis zur Quellsyntax.

4. Das optionale `vpcie3v3-supply = <&vdd_pcie3v3>;` konfiguriert die 3V3-Versorgung der Peripherie. Soll die Platine deren Freigabe steuern, definieren Sie den passenden Regulator wie im Beispiel. Zur Konfiguration siehe `Documentation/devicetree/bindings/regulator/`.

5. `vpcie1v8-supply = <&vdd_pcie1v8>;` — siehe Punkt 4.

6. `vpcie0v9-supply = <&vdd_pcie1v8>;` — siehe Punkt 4. Der Quellwert bleibt erhalten, ist aber nicht als korrekte Platinenversorgung bestätigt.

## 2. menuconfig-Konfiguration

1. Aktivieren Sie für die PCIe-Funktionen folgende Optionen:

```text
CONFIG_PCI=y
CONFIG_PCI_DOMAINS=y
CONFIG_PCI_DOMAINS_GENERIC=y
CONFIG_PCI_SYSCALL=y
CONFIG_PCI_BUS_ADDR_T_64BIT=y
CONFIG_PCI_MSI=y
CONFIG_PCI_MSI_IRQ_DOMAIN=y
CONFIG_PHY_ROCKCHIP_PCIE=y
CONFIG_PCIE_ROCKCHIP=y
CONFIG_PCIEPORTBUS=y
CONFIG_PCIEASPM=y
CONFIG_PCIEASPM_POWERSAVE=y
CONFIG_PCIE_PME=y
CONFIG_GENERIC_MSI_IRQ=y
CONFIG_GENERIC_MSI_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN=y
CONFIG_IRQ_DOMAIN_HIERARCHY=y
```

2. NVMe-Geräte aktivieren (über PCIe angeschlossene SSDs):

```text
CONFIG_BLK_DEV_NVME=y
```

3. AHCI-Geräte aktivieren (SATA-SSDs hinter einem PCIe-SATA-Adapter):

```text
CONFIG_SATA_PMP=y
CONFIG_SATA_AHCI=y
CONFIG_SATA_AHCI_PLATFORM=y
CONFIG_ATA_SFF=y
CONFIG_ATA=y
```

Hinweis: Der unveränderte offene Kernel 4.4 unterstützt nur die in `drivers/ata/ahci.c` aufgeführten Geräte. Für andere Geräte ist Unterstützung des Herstellers oder Distributors erforderlich.

4. Zur Einrichtung von PCIe-WLAN siehe die Dokumentation des jeweiligen WLAN-Herstellers.

## 3. Kernel-Kommandozeile konfigurieren

Details stehen in `Documentation/kernel-parameters.txt` des Kernels. Hier werden nur einige wichtige Parameter erläutert.

1. `nomsi`: Für Legacy-Interrupts `pci=nomsi` in parameter ergänzen.

2. `pcie_bus_safe`: Laut Quelle setzt `pci=pcie_bus_safe` die maximale Nutzlastgröße (MPS) innerhalb der PCIe-Hierarchie auf das Maximum und kann die Bandbreite erhöhen. Diese Quellaussage bleibt erhalten; tatsächliche Kernelimplementierung und Gerätegrenzen prüfen.

3. `pcie_aspm`: Mit `pcie_aspm=off` wird die dynamische Link-Energieverwaltung für Tests deaktiviert. Andernfalls gilt standardmäßig die Hardwareaushandlung.

## 4. Häufige Anwendungsfragen

### Q1: Lassen sich Lanes zur einfacheren Leiterplattenführung vertauschen?

A1: Laut Quelle ist dies theoretisch möglich: RC-Lanes [1–4] können beliebig EP-/Switch-Lanes [1–4] zugeordnet werden, ohne Softwareänderung. **Der Hersteller erklärt ausdrücklich, dies nicht praktisch geprüft zu haben; vorsichtig bewerten.**

### Q2: Darf die differentielle Polarität innerhalb einer Lane vertauscht werden?

Beispielsweise RX+ der RC-Lane1 an RX- des EP/Switch, TX+ an TX- oder andere RX-/TX-Polaritätskombinationen?

A2: Laut Quelle sind solche Verbindungen ohne zusätzliche Softwarebehandlung möglich; der PCIe-Erkennungszustandsautomat berücksichtigt sie.

### Q3: Können die vier RK3399-Lanes in 1-1-1-1, 2-2 oder anders aufgeteilt werden?

A3: RK3399 besitzt einen RC und unterstützt diese Aufteilung nicht. Für mehrere Geräte ist ein PCIe-Switch erforderlich. Der Hersteller berichtete über Tests mit einem Pericom-Switch und bezeichnete ihn damals als vermutlich günstigste Lösung; dies ist eine historische Quellaussage, keine aktuelle Preisempfehlung.

### Q4: Unterstützt RK3399 SSDs?

A4: Die Quelle unterscheidet NVMe-SSDs mit PCIe auf der physischen Schnittstelle und mSATA-SSDs mit SATA. Für Letztere wird ein PCIe-SATA- oder USB-SATA-Adapter benötigt.

### Q5: Wie groß darf ein NVMe-Laufwerk sein, und kann davon gebootet werden?

A5: Laut Quelle hängt die Kapazitätsgrenze vom Dateisystem und nicht vom Treiber ab. RK3399 unterstützt NVMe-Boot ab U-Boot. Ein zusätzlicher SPI-NOR für miniloader ist erforderlich, da MaskROM keine NVMe- oder PCIe-Treiber enthält.

### Q6: Welche Bandbreite erreicht NVMe, und wie wird sie gemessen?

A6: Der Hersteller verwendete fio. Eine eigene fio-Version mit statisch eingebundener libaio ist erforderlich. Nachfolgend stehen der Originalbefehl und die Herstellerergebnisse, keine ArmSoM-Messungen.

```sh
./fio -filename=/dev/block/nvme0n1 -direct=1 -iodepth 4 -thread=1 -rw=write -ioengine=libaio -bs=1M -size=200G -numjobs=30 -runtime=60 -group_reporting -name=my
```

![Herstellertabelle (chinesisches Original)](/docs/rockchip-rk3399-pcie/assets/cn-p006-figure-01.png)

FIO · RK3399 EVB3 · PCIe1.0×4 · Payload:256 · SSD: Samsung SM961 MZVPW256HEGL

| Test | iodepth | thread | ioengine | performance | AVG IOPS |
| --- | --- | --- | --- | --- | --- |
| 1M sequenziell lesen | 4 | 1 | libaio | 784032KB/s |  |
| 1M sequenziell schreiben | 4 | 1 | libaio | 792945KB/s |  |
| 4K zufällig schreiben | 64 | 6 | libaio |  | 194343 |
| 8K zufällig schreiben | 64 | 6 | libaio |  | 98200 |
| 16K zufällig schreiben | 64 | 6 | libaio |  | 49159 |
| 4K zufällig lesen | 64 | 6 | libaio |  | 170677 |
| 8K zufällig lesen | 64 | 6 | libaio |  | 93934 |
| 16K zufällig lesen | 64 | 6 | libaio |  | 44893 |

![Herstellertabelle (chinesisches Original)](/docs/rockchip-rk3399-pcie/assets/cn-p006-figure-02.png)

FIO · RK3399 EVB3 · PCIe2.0×4 · Payload:256 · SSD: Samsung SM961 MZVPW256HEGL

| Test | iodepth | thread | ioengine | performance | AVG IOPS |
| --- | --- | --- | --- | --- | --- |
| 1M sequenziell lesen | 4 | 1 | libaio | 1452.2MB/s |  |
| 1M sequenziell schreiben | 4 | 1 | libaio | 1039.1MB/s |  |
| 4K zufällig schreiben | 64 | 6 | libaio |  | 208538 |
| 8K zufällig schreiben | 64 | 6 | libaio |  | 105924 |
| 16K zufällig schreiben | 64 | 6 | libaio |  | 47737 |
| 4K zufällig lesen | 64 | 6 | libaio |  | 246223 |
| 8K zufällig lesen | 64 | 6 | libaio |  | 174749 |
| 16K zufällig lesen | 64 | 6 | libaio |  | 80787 |

### Q7: Unterstützt RK3399 eine separate Grafikkarte?

A7: Theoretisch ja, sofern ein ARM-Treiber vorhanden ist. Praktisch verneint die Quelle dies: Für BARs stehen nur 32M physischer PCIe-Busadressraum bereit, während Grafikkarten üblicherweise mehr benötigen. Ein Switch hilft nicht, da er selbst Adressraum beansprucht und die Anforderungen an den RC erhöht.

### Q8: Welche Versorgungen benötigen PCIe-Geräte?

A8: Die Quelle nennt 0.9V, 3V3, 3V3_AUX und 12V. Sie ordnet 0.9V vor allem PCIe-WLAN und 3V3 den meisten Geräten zu. Die Hilfsversorgung 3V3_AUX muss im Suspend eingeschaltet bleiben, wenn das Gerät weiterarbeiten soll, etwa WLAN zum Aufwecken des Hosts. 12V versorgt leistungsstärkere Geräte wie Switches und Grafikkarten. Maßgeblich sind die Anforderungen des tatsächlichen EP-/Switch-Herstellers.

### Q9: Wie lässt sich ASPM auf RK3399 steuern?

A9: Die Quelle nennt fünf Verfahren:

1. `pcie_aspm=off` in die Kernel-Kommandozeile aufnehmen.
2. `link_state` an der Konsole konfigurieren; dafür ist `CONFIG_PCIEASPM_DEBUG=y` erforderlich:

```text
# cat /sys/bus/pci/devices/0000:00:00.0/power/link_state
7
# echo 0 > /sys/bus/pci/devices/0000:00:00.0/power/link_state
```

3. `CONFIG_PCIEASPM` deaktivieren.
4. `setpci` verwenden, beispielsweise `setpci -s 0:0 0xd0.w=0xC00`; zuvor die BDF des Zielgeräts ermitteln.
5. An der Konsole `echo performance > /sys/module/pcie_aspm/parameters/policy` ausführen.

### Q10: Wie werden PCIe-Geräteinformationen auf RK3399 angezeigt?

A10: Die Originalfrage schreibt den Chip als `RK399`. `lspci` auf das Gerät kopieren und ausführbar machen. `lspci -vvv` zeigt Eigenschaften und Betriebszustände, `lspci -t` den PCIe-Topologiebaum. Weitere Parameter stehen in `lspci --help`.

### Q11: Wie lassen sich PCIe-Register aus dem Userspace ändern?

A11: `setpci` erst verwenden, nachdem die Ziel-BDF mit `lspci` ermittelt wurde und die betreffenden Registeroffsets des Protokolls bekannt sind. Siehe `setpci --help`. Die Quelle bezeichnet dies als fortgeschrittenes Werkzeug und rät ohne ausreichende PCIe-Protokollkenntnisse davon ab.

## 5. Fehlersuche

### 5.1 Link-Training fehlgeschlagen

```text
rockchip-pcie f8000000.pcie: PCIe link training gen1 timeout!
rockchip-pcie: probe of f8000000.pcie failed with error -1
```

Die Quelle führt den Trainingsfehler auf ein nicht betriebsbereites Peripheriegerät zurück. Zuerst `ep-gpios`, dann Vorhandensein und ausreichende Versorgung prüfen. Sie nennt 3.3V als theoretisch ausreichend, behauptet jedoch, manche Geräte hätten 3.8V oder sogar 4V benötigt. **Dies ist eine unbestätigte historische Quellaussage, keine Aufforderung zur Überspannung: Platinen- und Bauteilgrenzen niemals überschreiten.** Auch bei ausreichender Spannung muss die verfügbare Leistung stimmen; die Quelle erwähnt einen Test mit externer Versorgung. Dafür sind ein geprüftes Versorgungskonzept und sichere Spannungsgrenzen erforderlich.

### 5.2 Hängen während der Konfiguration

```text
[ 0.459371] pci 0000:00:00.0: bridge configuration invalid ([bus 00-00]), reconfiguring
[ 0.459585] pci 0000:01:00.0: reg 0x10: initial BAR value 0x00000000 invalid
[ 0.460043] pci 0000:01:00.1: reg 0x10: initial BAR value 0x00000000 invalid
[ 0.460503] pci 0000:01:00.2: reg 0x10: initial BAR value 0x00000000 invalid
[ 0.460535] pci 0000:01:00.2: reg 0x14: initial BAR value 0x00000000 invalid
[ 0.460904] Bad mode in Error handler detected, code 0xbf000002 -- SError
[ 0.460919] Internal error: Oops - bad mode: 0 [#1] PREEMPT SMP
[ 0.466658] Modules linked in:
[ 0.466938] CPU: 5 PID: 1 Comm: swapper/0 Not tainted 4.4.55 #41
[ 0.467464] Hardware name: Rockchip RK3399 Excavator Board edp (Android) (DT)
[ 0.468089] task: ffffffc0f2160000 ti: ffffffc0f2168000 task.ti: ffffffc0f2168000
[ 0.468752] PC is at rockchip_pcie_rd_conf+0xb8/0x138
[ 0.469200] LR is at pci_bus_read_config_dword+0x78/0xbc
```

Im Beispiel war das Gerät aktiv und wurde enumeriert, hing jedoch anschließend bei der Kommunikation. Die Quelle führt die meisten solchen Fälle auf unzureichende Versorgungsspannung oder Leistung zurück.

### 5.3 RK3399-PCIe-PHY-PLL rastet nicht ein

```text
[ 0.440803] rockchip-pcie f8000000.pcie: no vpcie3v3 regulator found
[ 0.440831] rockchip-pcie f8000000.pcie: no vpcie1v8 regulator found
[ 0.440854] rockchip-pcie f8000000.pcie: no vpcie0v9 regulator found
[ 1.443759] pll lock timeout!
[ 1.443826] phy phy-phy@e220.5: phy poweron failed --> -22
[ 1.443847] rockchip-pcie f8000000.pcie: fail to power on phy, err -22
[ 1.443968] rockchip-pcie: probe of f8000000.pcie failed with error -22
```

Normale Spannung und ausreichende Versorgungsfähigkeit von `PCIE_AVDD_0V9` und `PCIE_AVDD_1V8` prüfen. Die Quelle verlangt für diesen Versorgungszweig einen LDO; mit dem tatsächlichen Platinendesign abgleichen.

### 5.4 Fehler beim gleichzeitigen Betrieb von PCIe und USB 3.0

Das folgende Quellprotokoll zeigt einen Systemfehler beim Einstecken eines USB-Geräts während des NVMe-Betriebs:

```text
[ 2.801962] Unhandled fault: synchronous external abort (0x96000210) at 0xffffff800936401c
[ 2.801997] Internal error: : 96000210 [#1] PREEMPT SMP
[ 2.803157] Modules linked in:
[ 2.803437] CPU: 2 PID: 146 Comm: nvme Not tainted 4.4.16 #146
[ 2.803949] Hardware name: rockchip,rk3399-firefly-mini (DT)
[ 2.804445] task: ffffffc07187d400 ti: ffffffc071910000 task.ti: ffffffc071910000
[ 2.805108] PC is at nvme_kthread+0x84/0x1f8
[ 2.805484] LR is at nvme_kthread+0x60/0x1f8
```

Die Quelle folgert, dass `PCIE_AVDD_0V9` unzureichend oder instabil ist, und schlägt zusätzliche Kapazität oder eine Spannungserhöhung vor. Dies bleibt zur Nachvollziehbarkeit erhalten, **nicht als freigegebene Änderung**. Vor Hardwareänderungen Versorgungsintegrität und Platinen-/Bauteilgrenzen prüfen; die spezifizierten Spannungsgrenzen nicht überschreiten.

{% endraw %}
