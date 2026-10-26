---
title: "Виртуализация PCIe Rockchip: полное руководство QEMU, KVM, SMMU и VFIO"
description: "Виртуализация PCIe Rockchip: полное руководство QEMU, KVM, SMMU и VFIO — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
translation_key: "112-rockchip-pcie-virtualization"
slug: "112-rockchip-pcie-virtualization"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PCIe", "QEMU", "KVM", "SMMU", "VFIO"]
excerpt: "Виртуализация PCIe Rockchip: полное руководство QEMU, KVM, SMMU и VFIO — RK-KF-YF-170 V1.0.0, kernel 4.19, RK3588."
---

{% raw %}

# Виртуализация PCIe Rockchip: полное руководство QEMU, KVM, SMMU и VFIO

Полностью сохранены технические главы (стр. 4–7) и техническое предисловие китайского RK-KF-YF-170 V1.0.0. QEMU + ARM KVM + PCIe + SMMU + VFIO обеспечивает прямой доступ виртуальной машины к PCIe, включая подключение NVMe SSD и сетевых карт PCIe. Источник относится к Rockchip с SMMU и ядром 4.19; регистры показаны на примере RK3588. Для ArmSoM проверьте SMMU/PCIe конкретной платы, ветку ядра, BSP, дерево устройств и изоляцию IOMMU. Это платформенная справка без аппаратной проверки ArmSoM. Есть только китайский PDF; EN/RU/DE переведены полностью. Отдельных технических рисунков нет.

> Проверить по оригиналу: пример Realtek 8169 содержит device ID `0000`; он сохранён, но на оборудовании используйте фактический вывод lspci. Обход `dev->archdata.dma_coherent = false;` в последней главе относится к среде источника; проверьте структуры целевого ядра и требования согласованности. Источник упоминает готовую ramdisk, но предоставлен только PDF без прошивок; статья не предоставляет эти файлы. Отвязка прерывает использование устройства хостом. Команды приведены для справки и не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux kernel](https://github.com/rockchip-linux/kernel)

## 1. Подготовка среды

### 1.1 Настройка ядра гостевой ОС

Включите следующие параметры.

```text
CONFIG_ARM64_VA_BITS_39=y
CONFIG_ARM64_VA_BITS=39
```

Отключите следующие параметры.

```text
CONFIG_HUGETLBFS
CONFIG_HUGETLB_PAGE
```

Соберите образ ядра гостевой ОС следующей командой.

```text
make ARCH=arm64
```

Расположение образа:

```text
arch/arm64/boot/Image
```

### 1.2 Подготовка ramdisk гостевой ОС

Включите busybox, lspci и ifconfig.

### 1.3 Настройка ядра хостовой ОС

Дополнительно к rockchip_defconfig включите следующие параметры.

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

### 1.4 Подготовка QEMU

Соберите qemu в проекте Rockchip buildroot. Исполняемый файл называется qemu-system-aarch64.

### 1.5 Подготовка ramdisk хостовой ОС

Создайте ramdisk в проекте Rockchip buildroot, включив qemu-system-aarch64, образ ядра и ramdisk гостевой ОС. Настройка и сборка проекта описаны в документации buildroot. Оригинальное руководство предоставляет предварительно собранный каталог ramdisk со всеми необходимыми образами. В Ubuntu abootimg-pack-initrd создаёт initrd.img рядом с каталогом ramdisk; abootimg-unpack-initrd распаковывает initrd.img.

## 2. Настройка DTS

### 2.1 Настройка SMMU

```text
compatible = "arm,smmu-v3";
```

Обязательная настройка для сопоставления с драйвером ARM SMMU-v3. Регистры и прерывания ниже приведены на примере RK3588.

```text
reg = <0x0 0xfc900000 0x0 0x100000>;
```

Базовый адрес и размер ARM SMMU-v3.

```text
interrupts = <GIC_SPI 369 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 371 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 374 IRQ_TYPE_EDGE_RISING>,
             <GIC_SPI 367 IRQ_TYPE_EDGE_RISING>;
interrupt-names = "eventq", "gerror", "priq", "cmdq-sync";
```

См. Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

```text
#iommu-cells = <1>;
```

Значение должно быть 1 для описания stream ID устройства. См. Documentation/devicetree/bindings/iommu/arm,smmu-v3.txt.

### 2.2 Дополнительная настройка PCIe

```text
iommu-map = <0x0 &smmu 0x0 0x10000>;
```

Создайте таблицы страниц SMMU для периферийных устройств PCIe.

## 3. Запуск

1. Отвяжите драйвер PCIe-устройства на хосте. Получите адрес устройства через lspci. Для примера 0002:21:00.0 выполните следующую команду.

```text
echo 0002:21:00.0 > /sys/bus/pci/devices/0002\:21\:00.0/driver/unbind
```

2. Привяжите PCIe-устройство к VFIO-PCI. Получите vendor id и device id через lspci. В оригинале пример сетевой карты Realtek 8169 PCIe использует vendor id 10ec и device id 0000, привязка выполняется так.

```text
echo 10ec 0000 > /sys/bus/pci/drivers/vfio-pci/new_id
```

3. Запустите qemu.

```text
qemu-system-aarch64 -nographic -monitor none -m 128 -machine virt,highmem=off -serial stdio -cpu host -enable-kvm  -device vfio-pci,host=0002:21:00.0 -kernel /Image -initrd /ramdisk_ok.img
```

Параметры qemu поясняются ниже.

```text
qemu-system-aarch64
```

Исполняемый файл qemu, собранный Rockchip buildroot, помещается в каталог bin/ корневой файловой системы хоста.

```text
-m 128
```

Выделите виртуальной машине 128M памяти.

```text
highmem=off
```

Используйте нижнее 32-битное адресное пространство.

```text
-device vfio-pci,host=0002:21:00.0
```

Создайте vfio-устройство, указав адрес PCIe-устройства как параметр, для доступа из виртуальной машины.

```text
-kernel /Image -initrd /ramdisk_ok.img
```

Здесь указаны соответственно образ ядра и образ корневой файловой системы гостевой ОС. Оба образа помещены в корневой каталог файловой системы хоста.

4. После запуска виртуальной машины настройте сетевую карту PCIe следующими командами.

```text
ifconfig eth0 up

ifconfig eth0 192.168.31.120 netmask 255.255.255.0

route add default gw 192.168.31.1
```

Настройте адрес и шлюз в соответствии с вашей сетью.

5. Проверьте сетевое соединение следующей командой.

```text
ping 8.8.8.8
```

При нормальной работе должен появиться вывод ping.

## 4. Нерешённая проблема

В виртуальной машине устройства PCIe по умолчанию имеют атрибут coherent, поэтому выделяемые dma-буферы становятся cacheable, что вызывает проблемы согласованности данных. Для обхода проблемы оригинал требует вручную задавать non-coherent при probe PCIe-устройства в виртуальной машине, как показано ниже.

```text
dev->archdata.dma_coherent = false;
```

{% endraw %}
