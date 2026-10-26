---
title: "Rockchip Linux SARADC: V1/V2/V3-Treiber, DMA und Tests"
description: "Rockchip Linux SARADC: V1/V2/V3-Treiber, DMA und Tests — V1.1.0 / V1.0.0"
excerpt: "Rockchip Linux SARADC: V1/V2/V3-Treiber, DMA und Tests"
translation_key: "140-rockchip-linux-saradc"
slug: "140-rockchip-linux-saradc"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: [ArmSoM, Rockchip, Linux, SARADC, DMA]
---

{% raw %}

# Rockchip Linux SARADC: V1/V2/V3-Treiber, DMA und Tests

Gemeinsame Grundlage ist das chinesische RK-KF-YF-079 V1.1.0 (8 Seiten); nur im englischen V1.0.0 (7 Seiten) vorhandene Details werden separat ergänzt. Chinesischer Geltungsbereich: Rockchip/Linux 4.4, 4.19, 5.10 und 6.1. Diese Plattformreferenz bestätigt weder SARADC-Generation noch Pins, Referenzspannung oder Testschnittstelle eines bestimmten ArmSoM-Boards. SoC-TRM, BSP und DTS prüfen; Beispiel-IRQs und Kanalnummern nicht ungeprüft übernehmen. Beide Quellen enthalten keine eigenständigen technischen Abbildungen. Keine Hardware-Abtasttests durchgeführt.

> Quellenüberblick: 6 Kanäle, 10bit, 1MSPS bei 13MHz; der chinesische Text bezeichnet das Gerät als Digital-Analog-Wandler. Diese Formulierung sowie die späteren Testkanäle 0–7 anhand des konkreten Chips prüfen, statt Quellwerte stillschweigend zu ändern. Beide DTS-Beispiele verwenden io-channel-cells ohne # und ordnen 1.8V dem Wert 1024 zu; tatsächliches Binding und Auflösung prüfen. Abschnitt 6 enthält 537 und 538 im Protokoll, obwohl die Erklärung nur 537 nennt; beides bleibt erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. SARADC-Treiber

### 1.1 Treiberdatei

Treiberpfad: `drivers/iio/adc/rockchip_saradc.c`

### 1.2 DTS-Knotenkonfiguration

Siehe `Documentation/devicetree/bindings/iio/adc/rockchip-saradc.txt`. Parameter:

- `interrupts = <GIC_SPI 62 IRQ_TYPE_LEVEL_HIGH 0>;`: Interrupt nach Abschluss der Wandlung.
- `io-channel-cells = <1>;`: muss 1 sein; siehe iio-bindings.txt.
- `vref-supply = <&vccadc_ref>;`: Referenzspannung passend zur Hardware setzen. Die Quelle nennt maximal 1.8V entsprechend SARADC-Wert 1024 und einen linearen Zusammenhang zwischen Spannung und ADC-Wert.

## 2. SARADC verwenden

### 2.1 Überblick

Als IIO-Instanz benötigt SARADC eine initialisierte `struct iio_dev` und Registrierung durch `iio_device_register(indio_dev)`; siehe `rockchip_saradc_probe`.

Ein wichtiger Einsatz ist adc-key. Der Tastentreiber verwendet das Input-Framework: `struct input_polled_dev` initialisieren und mit `input_register_polled_device(poll_dev);` registrieren; siehe `adc_keys_probe` in `drivers/input/keyboard/adc-keys.c`.

Tasten mit getevent testen. Ist adc-key event0, durchläuft `getevent -s /dev/input/event0` folgende Aufrufkette:

```text
adc_keys_poll -> iio_read_channel_processed -> iio_channel_read -> chan->indio_dev
->info->read_raw(rockchip_saradc_read_raw) -> iio_convert_raw_to_processed_unlocked
```

Dies ist der vollständige adc-key-Abtastpfad zur Nachverfolgung des SARADC-Ablaufs.

### 2.2 Ablauf

#### 2.2.1 Abtastkonfiguration

`rockchip_saradc_read_raw` konfiguriert die Abtastung. Im Treiber erfolgt dies hauptsächlich über den `start`-Callback von `struct rockchip_saradc_data`; dort liegen die wesentlichen Unterschiede der drei Versionen.

##### 2.2.1.1 rockchip_saradc_start_v1

```text
writel_relaxed(8, info->regs + SARADC_DLY_PU_SOC);
```

Verzögerung zwischen Einschalten und Abtastbeginn setzen.

```text
writel(SARADC_CTRL_POWER_CTRL | (chan->channel & SARADC_CTRL_CHN_MASK) |
SARADC_CTRL_IRQ_ENABLE,info->regs + SARADC_CTRL);
```

Abtastkanal setzen, Interrupts aktivieren und Abtastung starten. Dies sind die wesentlichen V1-Konfigurationsschritte.

##### 2.2.1.2 rockchip_saradc_start_v2

```text
writel_relaxed(0xc, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
```

PHY-Kompatibilität konfigurieren.

```text
val = FIELD_PREP(SARADC2_EN_END_INT, 1);
val |= SARADC2_EN_END_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

END_INT-Interrupt aktivieren.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC2_SINGLE_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC2_SINGLE_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Abtastmodus und Kanal setzen, dann Abtastung starten.

##### 2.2.1.3 rockchip_saradc_start_v3

Die V3-Konfiguration ohne DMA entspricht V2. Der V3-DMA-Modus ruft rockchip_saradc_start_v3_dma auf.

###### 2.2.1.3.1 rockchip_saradc_start_v3_dma

```text
writel_relaxed(0x11, info->regs + SARADC_T_DAS_SOC);
writel_relaxed(0x20, info->regs + SARADC_T_PD_SOC);
writel_relaxed(0x0, info->regs + SARADC_T_SEL_SOC);
```

PHY-Kompatibilität konfigurieren.

```text
val = FIELD_PREP(SARADC3_PMASTER_EN, 1);
val |= SARADC3_PMASTER_EN << 16;
writel_relaxed(val, info->regs + SARADC3_FIFO_CON);
```

FIFO aktivieren.

```text
writel_relaxed((u64)info->dma_phys >> 32, info->regs + SARADC3_PADDR_BASE_H);
writel_relaxed(((u32)info->dma_phys) >> 2, info->regs + SARADC3_PADDR_BASE_L);
```

Zielpufferadresse für DMA konfigurieren.

```text
writel_relaxed((SARADC3_DMA_SIZE >> 2) - 1, info->regs + SARADC3_PADDR_OFF_MAX);
```

Größe des DMA-Schreibpuffers konfigurieren.

```text
val = FIELD_PREP(SARADC3_EN_END_MAX_INT, 1);
val |= SARADC3_EN_END_MAX_INT << 16;
writel_relaxed(val, info->regs + SARADC2_END_INT_EN);
```

MAX_INT-Interrupt konfigurieren.

```text
val = BIT(chn) << 16 | BIT(chn);
writel_relaxed(val, info->regs + SARADC3_AUTO_CH_EN);
```

Gewählten Kanal auf auto-Modus setzen.

```text
val = FIELD_PREP(SARADC2_START, 1) |
    FIELD_PREP(SARADC3_AUTO_MODE, 1) |
    FIELD_PREP(SARADC2_CONV_CHANNELS, chn);
val |= (SARADC2_START | SARADC3_AUTO_MODE | SARADC2_CONV_CHANNELS) << 16;
writel(val, info->regs + SARADC2_CONV_CON);
```

Kontinuierlichen Abtastmodus konfigurieren und starten.

#### 2.2.2 Auf Abtastende warten

```text
wait_for_completion_timeout(&info->completion, SARADC_TIMEOUT)
```

#### 2.2.3 Daten lesen

Nach Abschluss wird ein Interrupt ausgelöst. `rockchip_saradc_isr` ruft `rockchip_saradc_read` auf, speichert den Messwert in `info->last_val`, weckt `rockchip_saradc_read_raw` und gibt ihn über `*val = info->last_val` zurück. Versionsabhängige read-Implementierungen:

```text
rockchip_saradc_read_v1
rockchip_saradc_read_v2
rockchip_saradc_read_v3
```

Die read-Funktionen sind einfach und werden in der Quelle nicht weiter analysiert.

#### 2.2.4 SARADC abschalten

Die folgende Funktion schaltet SARADC ab. Nur V1 muss manuell abgeschaltet werden; V2/V3 schalten nach der Abtastung automatisch ab.

```text
rockchip_saradc_power_down
```

#### 2.2.5 Zusammenfassung

Ein vollständiger Zyklus konfiguriert und aktiviert SARADC über `rockchip_saradc_read_raw`, startet die Abtastung und wartet auf einen Interrupt. Der Handler löscht den Interrupt, liest den Messwert, weckt `rockchip_saradc_read_raw`, gibt den Wert zurück und schaltet SARADC ab.

## 3. Kernelkonfiguration

```text
Symbol: ROCKCHIP_SARADC [=y]
Type  : tristate
Prompt: Rockchip SARADC driver
    Location:
        -> Device Drivers
            -> Industrial I/O support (IIO [=y])
(1)             -> Analog to digital converters
    Defined at drivers/iio/adc/Kconfig:319
    Depends on: IIO [=y] && (ARCH_ROCKCHIP [=y] || ARM && COMPILE_TEST [=n]) &&
    RESET_CONTROLLER [=y]
```

## 4. Übliche SARADC-Schnittstellen

1. ADC-Werte im Userspace lesen; * ist die Kanalnummer:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage*_raw
```

Beispielsweise channel0:

```sh
cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw
```

2. Kernelschnittstellen: `iio_read_channel_raw()` liest den ADC-Wert, `iio_read_channel_processed()` die Spannung.

## 5. V2/V3-Verbesserungen

V2 ist nicht mit V1 kompatibel und ergänzt Schwellwert-Interrupts sowie automatische Abtastung.

V3 ist mit V2 kompatibel und ergänzt DMA-Schreibzugriffe auf externen Speicher.

## 6. Testschnittstelle

Aktivieren:

```text
CONFIG_ROCKCHIP_SARADC_TEST_CHN
```

Dadurch entsteht ein saradc_test_chn-Knoten unter sys. Den vollständigen Pfad suchen:

```text
echo chn > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

Bei chn 0–7 wird der jeweilige Kanal kontinuierlich abgetastet; die serielle Ausgabe lautet:

```text
chn[0] val = 537
chn[0] val = 537
chn[0] val = 538
```

Die Quelle beschreibt dieses Protokoll als Messwert 537 für Kanal 0.

```text
echo 8 > /sys/full_path_of_saradc_test_chn/saradc_test_chn
```

Zum Stoppen einen Wert oberhalb der höchsten gültigen Kanalnummer schreiben, beispielsweise 8.

## Ergänzung aus Englisch V1.0.0: ältere V1-Implementierung

Englische Seiten 5–6 nennen 8 sclk-Zyklen Verzögerung sowie Einschalten, Kanalwahl, Interruptfreigabe und Abtaststart. Nach Abschluss und Interrupt wird der Wert val zugewiesen; `iio_convert_raw_to_processed_unlocked` wandelt ihn in Spannung um. Der ältere ISR liest SARADC_DATA direkt und schreibt anschließend 0 zum Löschen des Interrupts und Abschalten:

```c
*val = info->last_val;
info->last_val = readl_relaxed(info->regs + SARADC_DATA);
writel_relaxed(0, info->regs + SARADC_CTRL);
```

{% endraw %}
