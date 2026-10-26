---
title: "Rockchip-PCIe-Gerätevirtualisierung: vollständiger Leitfaden zu QEMU, KVM, SMMU und VFIO"
description: "Rockchip-PCIe-Gerätevirtualisierung: vollständiger Leitfaden zu QEMU, KVM, SMMU und VFIO — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
translation_key: "112-rockchip-pcie-virtualization"
slug: "112-rockchip-pcie-virtualization"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "QEMU", "KVM", "SMMU", "VFIO"]
excerpt: "Rockchip-PCIe-Gerätevirtualisierung: vollständiger Leitfaden zu QEMU, KVM, SMMU und VFIO — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
---

{% raw %}

# Rockchip-PCIe-Gerätevirtualisierung: vollständiger Leitfaden zu QEMU, KVM, SMMU und VFIO

Der vollständige technische Inhalt (Seiten 4–7) und das technische Vorwort von RK-KF-YF-170 V1.0.0 werden aus dem Chinesischen übernommen. QEMU + ARM KVM + PCIe + SMMU + VFIO ermöglicht direkten PCIe-Zugriff der virtuellen Maschine, einschließlich NVMe-SSDs und PCIe-Netzwerkkarten. Die Quelle gilt für Rockchip-Chips mit SMMU und Kernel 4.19; Register werden am RK3588 gezeigt. Für ArmSoM sind SMMU/PCIe der jeweiligen Platine, Kernelzweig, BSP, Gerätebaum und IOMMU-Isolation zu prüfen. Plattformreferenz ohne ArmSoM-Hardwarevalidierung. Es liegt nur ein chinesisches PDF vor; EN/RU/DE sind vollständige Übersetzungen. Die Quelle enthält keine eigenständigen technischen Abbildungen.

> Zu prüfende Quellenangaben: Das Realtek-8169-Beispiel nennt die device ID `0000`; sie bleibt erhalten, auf Hardware ist jedoch die tatsächliche lspci-Ausgabe maßgeblich. Der abschließende Workaround `dev->archdata.dma_coherent = false;` ist quellenspezifisch; Zielkernelstrukturen und Konsistenzanforderungen prüfen. Die Quelle erwähnt eine vorbereitete Ramdisk; bereitgestellt wurde nur das PDF, keine Firmware. Dieser Artikel liefert diese Dateien nicht. Das Lösen des Treibers unterbricht die Hostnutzung des Geräts. Die Befehle sind nicht ausgeführte Referenzbeispiele.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Umgebung einrichten

### 1.1 Kernelkonfiguration des Gastbetriebssystems

Folgende Optionen aktivieren.

```text
CONFIG_ARM64_VA_BITS_39=y
CONFIG_ARM64_VA_BITS=39
```

Folgende Optionen deaktivieren.

```text
CONFIG_HUGETLBFS
CONFIG_HUGETLB_PAGE
```

Das Kernelimage des Gastbetriebssystems mit folgendem Befehl erstellen.

```text
make ARCH=arm64
```

Speicherort des Images:

```text
arch/arm64/boot/Image
```

### 1.2 Ramdisk des Gasts vorbereiten

busybox, lspci und ifconfig einbinden.

### 1.3 Kernelkonfiguration des Hosts

Zusätzlich zu rockchip_defconfig folgende Optionen aktivieren.

```text
CONFIG_KVM
CONFIG_VFIO
CONFIG_VFIO_PCI
CONFIG_IOMMU_SUPPORT
CONFIG_ARM_SMMU_V3
CONFIG_VFIO_IOMMU_TYPE1
CONFIG_BLK_DEV_NVME
CONFIG_R8169
CONFIG_PCIE_DW
CONFIG_PCIE_DW_HOST
CONFIG_PCIE_DW_ROCKCHIP
```

### 1.4 QEMU vorbereiten

qemu mit dem Rockchip-buildroot-Projekt kompilieren. Die ausführbare Datei heißt qemu-system-aarch64.

### 1.5 Ramdisk des Hosts vorbereiten

Mit dem Rockchip-buildroot-Projekt eine Ramdisk einschließlich qemu-system-aarch64 sowie Kernel- und Ramdiskimage des Gasts erzeugen. Konfiguration und Kompilierung sind in der buildroot-Dokumentation beschrieben. Das Quellhandbuch stellt ein vorkompiliertes ramdisk-Verzeichnis mit allen benötigten Images bereit. Unter Ubuntu erzeugt abootimg-pack-initrd die Datei initrd.img neben dem ramdisk-Verzeichnis; abootimg-unpack-initrd entpackt initrd.img.

## 2. DTS-Konfiguration

### 2.1 SMMU-Konfiguration

```text
compatible = "arm,smmu-v3";
```

Erforderlich zur Zuordnung zum ARM-SMMU-v3-Treiber. Die folgende Register- und Interruptkonfiguration verwendet RK3588 als Beispiel.

```text
reg = <0x0 0xfc900000 0x0 0x100000>;
```

Basisadresse und Größe von ARM SMMU-v3.

```text
interrupts = <GIC_SPI 369 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 371 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 374 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 367 IRQ_TYPE_EDGE_RISING>;
interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
```

Siehe Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

```text
#iommu-cells = <1>;
```

Muss zur Beschreibung der Stream-ID des Geräts 1 sein. Siehe Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

### 2.2 Zusätzliche PCIe-Konfiguration

```text
iommu-map = <0x0 &smmu 0x0 0x10000>;
```

SMMU-Seitentabellen für PCIe-Peripheriegeräte anlegen.

## 3. Ausführung

1. Den PCIe-Gerätetreiber des Hosts lösen. Die Geräteadresse mit lspci ermitteln. Für die Beispieladresse 0002:21:00.0 folgenden Befehl ausführen.

```text
echo 0002:21:00.0 > /sys/bus/pci/devices/0002\:21\:00.0/driver/unbind
```

2. Das PCIe-Gerät an VFIO-PCI binden. vendor id und device id mit lspci ermitteln. Die Quelle verwendet eine Realtek-8169-PCIe-Netzwerkkarte mit vendor id 10ec und device id 0000 und bindet sie wie folgt.

```text
echo 10ec 0000 > /sys/bus/pci/drivers/vfio-pci/new_id
```

3. qemu starten.

```text
qemu-system-aarch64 -nographic -monitor none -m 128 -machine virt,highmem=off -serial stdio -cpu host -enable-kvm  -device vfio-pci,host=0002:21:00.0 -kernel /Image -initrd /ramdisk_ok.img
```

Die qemu-Parameter werden nachfolgend erläutert.

```text
qemu-system-aarch64
```

Die mit Rockchip buildroot erstellte qemu-Datei liegt im Verzeichnis bin/ des Host-Rootdateisystems.

```text
-m 128
```

Der virtuellen Maschine 128M Arbeitsspeicher zuweisen.

```text
highmem=off
```

Den unteren 32-Bit-Adressraum verwenden.

```text
-device vfio-pci,host=0002:21:00.0
```

Mit der PCIe-Geräteadresse als Parameter ein vfio-Gerät für den Zugriff aus der virtuellen Maschine erstellen.

```text
-kernel /Image -initrd /ramdisk_ok.img
```

Diese Parameter geben das Kernelimage bzw. das Rootdateisystemimage des Gasts an. Beide Images liegen im Wurzelverzeichnis des Host-Rootdateisystems.

4. Nach dem Start der virtuellen Maschine die PCIe-Netzwerkkarte mit folgenden Befehlen konfigurieren.

```text
ifconfig eth0 up

ifconfig eth0 192.168.31.120 netmask 255.255.255.0

route add default gw 192.168.31.1
```

Adresse und Gateway an das tatsächliche Netzwerk anpassen.

5. Die Netzwerkverbindung mit folgendem Befehl prüfen.

```text
ping 8.8.8.8
```

Bei normalem Betrieb sollte eine ping-Ausgabe erscheinen.

## 4. Verbleibendes Problem

In der virtuellen Maschine sind PCIe-Geräte standardmäßig coherent; zugewiesene dma-Puffer sind daher cacheable, was Datenkonsistenzprobleme verursacht. Zur Umgehung verlangt die Quelle, beim Probe des PCIe-Geräts in der virtuellen Maschine manuell non-coherent einzustellen, wie unten gezeigt.

```text
dev->archdata.dma_coherent = false;
```

{% endraw %}
