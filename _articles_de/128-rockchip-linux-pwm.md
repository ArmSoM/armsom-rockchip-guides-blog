---
title: "Rockchip Linux PWM: Konfiguration, Erfassung, Filter, IR und Signalerzeugung"
description: "Rockchip Linux PWM: Konfiguration, Erfassung, Filter, IR und Signalerzeugung — V3.6.0"
excerpt: "Rockchip Linux PWM: Konfiguration, Erfassung, Filter, IR und Signalerzeugung — V3.6.0"
translation_key: "128-rockchip-linux-pwm"
slug: "128-rockchip-linux-pwm"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PWM", "Linux"]
---

{% raw %}

Quelle RK-KF-YF-029 V3.6.0. Pulsweitenmodulation (PWM) steuert analoge Schaltungen über digitale Mikroprozessorausgänge und wird für Messung, Kommunikation, Leistungssteuerung und -wandlung eingesetzt. Dieser vollständige Leitfaden behandelt Rockchip-PWM-Funktionen, Nutzung und Fehlersuche. Plattformreferenz: SoC der ArmSoM-Platine, SDK/BSP, Kernel, PWM-Kanal, IOMUX und Spannungsdomäne prüfen. Keine ArmSoM-Hardwarevalidierung; nicht jede Platine unterstützt jede aufgeführte Funktion. Chinesische Artikel nutzen chinesische, EN/RU/DE englische Originalbilder. Befehle sind Quellbeispiele und wurden nicht auf Hardware ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

| SoC | Kernelminimum laut Quelle |
| --- | --- |
| RK3036 | Linux 4.4 |
| RK312X/PX3SE | Linux 4.4 |
| RK3288 | Linux 4.4 |
| RK322X/RK312XH | Linux 4.4 |
| RK3308 | Linux 4.4 |
| RK322XH/RK332X | Linux 4.4 |
| RK3326/PX30 | Linux 4.4 |
| RK3368/PX5 | Linux 4.4 |
| RK3399 | Linux 4.4 |
| RK1808 | Linux 4.4 |
| RV1109/RV1126 | Linux 4.19 |
| RK356X | Linux 4.19 |
| RK3588 | Linux 5.10 |
| RV1103/RV1106 | Linux 5.10 |
| RK3528 | Linux 4.19 |
| RK3562 | Linux 5.10 |
| RK3576 | Linux 6.1 |
| RV1103B | Linux 5.10 |
| RK3506 | Linux 6.1 |
| RV1126B | Linux 6.1 |

<!-- en PDF p.5 -->

## 1. Treiber

<!-- en PDF p.5 -->

### 1.1 Kernel-Treiber

<!-- en PDF p.5 -->

#### 1.1.1 Treiberdateien

<!-- en PDF p.5 -->

Linux-5.10 und älter:

<!-- en PDF p.5 -->

```text
drivers/pwm/pwm-rockchip.c
```

<!-- en PDF p.5 -->

Linux-6.1 und neuer:

<!-- en PDF p.5 -->

```text
drivers/pwm/pwm-rockchip.c
drivers/pwm/pwm-rockchip-test.c
```

<!-- en PDF p.5 -->

Linux-6.1 unterstützt erstmals PWM v4. PWM v1–v3 unter Linux-5.10 und älter teilen sich die v1-Schnittstelle und heißen im Folgenden gemeinsam PWM v1. Linux-6.1 ergänzt einen Testtreiber zum Funktionstest und zur Fehlersuche, der auch als Anwendungsbeispiel dient. Dazu CONFIG_PWM_ROCKCHIP_TEST aktivieren.

<!-- en PDF p.5 -->

#### 1.1.2 DTS-Konfiguration

<!-- en PDF p.5 -->

Andere Treiber referenzieren gewöhnlich die PWM-Knoten im DTS und konfigurieren beziehungsweise verwenden PWM über die Schnittstellen des PWM-Frameworks. Als Beispiel dient hier ein üblicher Hintergrundbeleuchtungstreiber. PWM v1:

<!-- en PDF p.5 -->

```text
backlight: backlight {
    compatible = "pwm-backlight";
    pwms = <&pwm5 0 25000 0>;
    ......
};
```

<!-- en PDF p.5 -->

PWM v4:

<!-- en PDF p.5 -->

```text
backlight: backlight {
    compatible = "pwm-backlight";
    pwms = <&pwm1_6ch_1 0 25000 0>;
    ......
};
```

<!-- en PDF p.5 -->

PWM-v1- und v4-Knoten werden unterschiedlich benannt. v1 nutzt pwmX: Controller-ID X / 4, Kanal-ID X % 4. v4 nutzt pwmX_Ych_Z: X ist die Controller-ID, Y die Kanalzahl und Z die Kanal-ID. Ab Linux-4.4 steigt die Anzahl der PWM-Parameter von 2 unter Linux-3.10 auf 3; sie entspricht #pwm-cells. Details stehen in Documentation/devicetree/bindings/pwm/pwm.txt. Die Parameter werden nachfolgend kurz erläutert.

<!-- en PDF p.5 -->

Parameter 1 ist index (Index des angeforderten PWM pro Chip) mit dem festen Wert 0. Jeder PWM-Kanal der Rockchip-Plattform entspricht einem PWM-Gerät, und jedes Gerät hat nur einen Chip.

<!-- en PDF p.6 -->

Parameter 2 ist period des PWM-Ausgangssignals in ns. Die 25000 ns im Beispiel entsprechen 40KHz. Parameter 3 ist die optionale polarity, standardmäßig 0; zur Invertierung PWM_POLARITY_INVERTED setzen.

<!-- en PDF p.7 -->

## 2. Funktionsunterstützung

<!-- en PDF p.7 -->

| SoC | PWM-Version | Kanäle | Dauerbetrieb | Einmalig | Erfassung | Filter | Globale Steuerung | Versatz | Zähler | Frequenzmesser | IR-Ausgang | IR-Eingang | Generator | Zweiphasenzähler |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK3036 | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK312X/PX3SE | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK3288 | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK322X/RK312XH | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK3308 | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RK322XH/RK332X | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | Y | N | N |
| RK3326/PX30 | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RK3368/PX5 | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK3399 | v2 | 4 | Y | Y | Y | N | N | N | N | N | N | N | N | N |
| RK1808 | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RV1109/RV1126 | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RK356X | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RK3588 | v2 | 4 | Y | Y | Y | Y | N | N | N | N | N | Y | N | N |
| RV1103/RV1106 | v3 | 4 | Y | Y | Y | Y | N | Y | Y | N | Y | Y | N | N |
| RK3528 | v3 | 4 | Y | Y | Y | Y | N | Y | Y | N | Y | Y | N | N |
| RK3562 | v3 | 4 | Y | Y | Y | Y | N | Y | Y | N | Y | Y | N | N |
| RK3576 | v4(PWM0) | 2 | Y | Y | Y | Y | Y | Y | N | N | N | Y | N | N |
| RK3576 | v4(PWM1) | 6 | Y | Y | Y | Y | Y | Y | Y | Y | N | N | Y | Y |
| RK3576 | v4(PWM2) | 8 | Y | Y | Y | Y | Y | Y | N | N | Y | Y | N | Y |
| RV1103B | v4(PWM0) | 4 | Y | Y | Y | Y | Y | Y | Y | Y | N | Y | N | N |
| RV1103B | v4(PWM1) | 4 | Y | Y | Y | Y | Y | Y | N | N | N | N | N | N |
| RV1103B | v4(PWM2) | 4 | Y | Y | Y | Y | Y | Y | N | N | N | N | N | N |
| RK3506 | v4(PWM0) | 4 | Y | Y | Y | Y | Y | Y | N | N | N | Y | Y | N |
| RK3506 | v4(PWM1) | 8 | Y | Y | Y | Y | Y | Y | Y | Y | Y | N | N | Y |
| RV1126B | v4(PWM0) | 8 | Y | Y | Y | Y | Y | Y | N | N | N | N | N | Y |
| RV1126B | v4(PWM1) | 4 | Y | Y | Y | Y | Y | Y | Y | Y | N | Y | N | N |
| RV1126B | v4(PWM2) | 8 | Y | Y | Y | Y | Y | Y | N | N | N | N | Y | Y |
| RV1126B | v4(PWM3) | 8 | Y | Y | Y | Y | Y | Y | N | N | N | N | N | Y |

<!-- en PDF p.7 -->

<!-- en PDF p.8 -->

PWM v2:

- Jeder Controller hat 4 Kanäle. Continuous, oneshot und capture sind auf jedem Kanal verfügbar.
- Filter kann je Controller gleichzeitig nur auf einem Kanal aktiviert werden.
- IR input wird nur auf Kanal 3 jedes Controllers unterstützt.

PWM v3:

- Die ergänzten Funktionen counter und output offset sind auf jedem Kanal verfügbar. Alle übrigen Funktionen entsprechen PWM v2.

PWM v4:

- Die Kanalzahl variiert je Controller; maximal sind 8 Kanäle möglich.
- Continuous, oneshot, capture, global control, output offset und filter sind auf jedem Kanal verfügbar.
- Einige Controller unterstützen counter, frequency meter, IR output und IR input; gleichzeitig kann nur ein Kanal eines Controllers diese Funktionen aktivieren.
- Einige Controller unterstützen wave generator auf mehreren Kanälen gleichzeitig.
- Einige Controller unterstützen biphasic counter auf mehreren Kanälen.
- DTS-Beispiel: arch/arm/boot/dts/rk3506g-iotest-pwm-test.dtsi. Nur der PWM-Knoten für Phase A muss aktiviert werden; für Phase B ist die passende IOMUX-Konfiguration erforderlich.

<!-- en PDF p.8 -->

## 3. Anwendungshinweise

<!-- en PDF p.8 -->

Die Nutzung von PWM im Kernel und im Userspace wird in Documentation/devicetree/bindings/pwm/pwm.txt erläutert. Dieser Abschnitt konzentriert sich auf die PWM-Erweiterungen der Rockchip-Plattform.

<!-- en PDF p.8 -->

### 3.1 Kernel-Treiber

<!-- en PDF p.8 -->

Zur PWM-Nutzung im Kernel-Treiber die Eigenschaft pwms wie im Hintergrundbeleuchtungsbeispiel des DTS-Abschnitts ergänzen. Anschließend das PWM-Gerät mit folgenden Schnittstellen beziehen/freigeben:

<!-- en PDF p.8 -->

```text
struct pwm_device *pwm_get(struct device *dev, const char *con_id);
void pwm_put(struct pwm_device *pwm);

struct pwm_device *devm_pwm_get(struct device *dev, const char *con_id);
struct pwm_device *devm_fwnode_pwm_get(struct device *dev, struct fwnode_handle *fwnode, const char *con_id);
```

<!-- en PDF p.8 -->

Implementierung und Funktionsbeschreibung: include/linux/pwm.h und drivers/pwm/core.c. Nachfolgend die PWM-Framework-Schnittstellen aus Linux-5.10; in Linux-6.1 wurden alle Legacy-Treiberschnittstellen entfernt:

<!-- en PDF p.8 -->

```text
/**
 * struct pwm_ops - PWM controller operations
 * @request: optional hook for requesting a PWM
 * @free: optional hook for freeing a PWM
 * @capture: capture and report PWM signal
 * @apply: atomically apply a new PWM config
 * @get_state: get the current PWM state. This function is only
 *         called once per PWM device when the PWM chip is
 *         registered.
 * @get_output_type_supported: get the supported output type of this PWM
 * @owner: helps prevent removal of modules exporting active PWMs
 * @config: configure duty cycles and period length for this PWM
 * @set_polarity: configure the polarity of this PWM
 * @enable: enable PWM output toggling
 * @disable: disable PWM output toggling
 */
struct pwm_ops {
    int (*request)(struct pwm_chip *chip, struct pwm_device *pwm);
    void (*free)(struct pwm_chip *chip, struct pwm_device *pwm);
    int (*capture)(struct pwm_chip *chip, struct pwm_device *pwm,
               struct pwm_capture *result, unsigned long timeout);
    int (*apply)(struct pwm_chip *chip, struct pwm_device *pwm,
             const struct pwm_state *state);
    void (*get_state)(struct pwm_chip *chip, struct pwm_device *pwm,
              struct pwm_state *state);
    int (*get_output_type_supported)(struct pwm_chip *chip,
            struct pwm_device *pwm);
    struct module *owner;

    /* Only used by legacy drivers */
    int (*config)(struct pwm_chip *chip, struct pwm_device *pwm,
              int duty_ns, int period_ns);
    int (*set_polarity)(struct pwm_chip *chip, struct pwm_device *pwm,
                enum pwm_polarity polarity);
    int (*enable)(struct pwm_chip *chip, struct pwm_device *pwm);
    void (*disable)(struct pwm_chip *chip, struct pwm_device *pwm);

    ANDROID_KABI_RESERVE(1);
};
```

<!-- en PDF p.9 -->

Ab Linux-4.4 implementiert der Kernel apply anstelle von config, enable und disable. Damit kann int pwm_apply_state(struct pwm_device *pwm, const struct pwm_state *state) mehrere Geräteparameter über struct pwm_state atomar ändern.

<!-- en PDF p.9 -->

```text
/*
 * struct pwm_state - state of a PWM channel
 * @period: PWM period (in nanoseconds)
 * @duty_cycle: PWM duty cycle (in nanoseconds)
 * @polarity: PWM polarity
 * @enabled: PWM enabled status
 * @usage_power: If set, the PWM driver is only required to maintain the power
 *               output but has more freedom regarding signal form.
 *               If supported, the signal can be optimized, for example to
 *               improve EMI by phase shifting individual channels.
 */
struct pwm_state {
    u64 period;
    u64 duty_cycle;
    enum pwm_polarity polarity;
#ifdef CONFIG_PWM_ROCKCHIP_ONESHOT
    u64 oneshot_count;
    u32 oneshot_repeat;
    u64 duty_offset;
#endif /* CONFIG_PWM_ROCKCHIP_ONESHOT */
    bool enabled;
    bool usage_power;
};
```

<!-- en PDF p.10 -->

Die Grundfunktionen continuous, oneshot und capture sind über das PWM-Framework verfügbar. Für frequency meter, counter und wave generator von Rockchip PWM v4 ist include/linux/pwm-rockchip.h erforderlich. Nachfolgend Funktionen und Anwendung; siehe auch den Demotreiber drivers/pwm/pwm-rockchip-test.c.

<!-- en PDF p.10 -->

#### 3.1.1 Dauerbetrieb

<!-- en PDF p.10 -->

Der Dauerbetrieb gibt ein PWM-Signal mit vorgegebenem Tastverhältnis kontinuierlich aus.

<!-- en PDF p.10 -->

```text
pwm_get_state(pdev, &state);
state.period = period;
state.duty_cycle = duty;
state.polarity = polarity;
state.enabled = enable;
pwm_apply_state(pdev, &state);
```

<!-- en PDF p.10 -->

#### 3.1.2 Einmalige Ausgabe

<!-- en PDF p.10 -->

Der Einmalmodus gibt eine vorgegebene Anzahl von PWM-Perioden aus. Im Kernel muss CONFIG_PWM_ROCKCHIP_ONESHOT aktiviert sein.

<!-- en PDF p.10 -->

```text
pwm_get_state(pdev, &state);
state.period = period;
state.duty_cycle = duty;
state.duty_offset = duty_offset;
state.polarity = polarity;
state.oneshot_count = rpt_first;
state.oneshot_repeat = rpt_second;
pwm_apply_state(pdev, &state);
```

<!-- en PDF p.10 -->

oneshot_count legt die Anzahl der Perioden mit angegebenem Tastverhältnis fest. PWM v4 erweitert die Obergrenze: Die tatsächliche Anzahl beträgt oneshot_repeat * oneshot_count. Nach Abschluss wird ein Interrupt ausgelöst. Die gewünschte Verarbeitung kann in drivers/pwm/pwm-rockchip-irq-callbacks.h ergänzt werden:

<!-- en PDF p.10 -->

```text
static void rockchip_pwm_oneshot_callback(struct pwm_device *pwm, struct pwm_state *state)
{
    /*
     * If you want to enable oneshot mode again, config and call
     * pwm_apply_state().
     *
     * struct pwm_state new_state;
     *
     * pwm_get_state(pwm, &new_state);
     * new_state.enabled = true;
     * ......
     * pwm_apply_state(pwm, &new_state);
     *
     */
}
```

<!-- en PDF p.11 -->

#### 3.1.3 Erfassung

<!-- en PDF p.11 -->

Der Erfassungsmodus berechnet die Dauer des High- und Low-Pegels des Eingangssignals.

<!-- en PDF p.11 -->

```text
pwm_capture(pdev, &cap_res, timeout_ms);
```

<!-- en PDF p.11 -->

Nach timeout_ms wird das berechnete Ergebnis cap_res zurückgegeben:

<!-- en PDF p.11 -->

```text
/**
 * struct pwm_capture - PWM capture data
 * @period: period of the PWM signal (in nanoseconds)
 * @duty_cycle: duty cycle of the PWM signal (in nanoseconds)
 */
struct pwm_capture {
    unsigned int period;
    unsigned int duty_cycle;
};
```

<!-- en PDF p.11 -->

#### 3.1.4 Filter

<!-- en PDF p.11 -->

Der Eingangsfilter wird zusammen mit capture/IR input/biphasic counter verwendet und unterdrückt Störungen, die kürzer als das Filterfenster sind.

<!-- en PDF p.11 -->

```text
rockchip_pwm_set_filter(pdev, filter_window_ns);
```

<!-- en PDF p.11 -->

filter_window_ns ist die Breite des Filterfensters.

<!-- en PDF p.11 -->

#### 3.1.5 Globale Steuerung

<!-- en PDF p.11 -->

Die globale Steuerung aktualisiert mehrere Kanalkonfigurationen synchron. Zusammen mit continuous/oneshot ermöglicht sie synchrone Ausgaben, komplementäre Signale und weitere Funktionen.

<!-- en PDF p.11 -->

```text
// join the global control group
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_JOIN);
rockchip_pwm_global_ctrl(pdev1, PWM_GLOBAL_CTRL_JOIN);
rockchip_pwm_global_ctrl(pdev2, PWM_GLOBAL_CTRL_JOIN);
// assign one channel to obtain the permission of global control
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_GRANT);
// use pwm_apply_state() to update configurations for each channel
......
// update the configs for all channels in group
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_UPDATE);
// enable all channels in group
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_ENABLE);
// reclaim the permission of global control
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_RECLAIM);
// exit the global control group
rockchip_pwm_global_ctrl(pdev0, PWM_GLOBAL_CTRL_EXIT);
rockchip_pwm_global_ctrl(pdev1, PWM_GLOBAL_CTRL_EXIT);
rockchip_pwm_global_ctrl(pdev2, PWM_GLOBAL_CTRL_EXIT);
```

<!-- en PDF p.11 -->

Beschreibung der Befehle zur globalen Steuerung:

<!-- en PDF p.11 -->

```text
/**
 * enum rockchip_pwm_global_ctrl_cmd - commands for pwm global ctrl
 * @PWM_GLOBAL_CTRL_JOIN: join the global control group
 * @PWM_GLOBAL_CTRL_EXIT: exit the global control group
 * @PWM_GLOBAL_CTRL_GRANT: obtian the permission of global control
 * @PWM_GLOBAL_CTRL_RECLAIM: reclaim the permission of global control
 * @PWM_GLOBAL_CTRL_UPDATE: update the configs for all channels in group
 * @PWM_GLOBAL_CTRL_ENABLE: enable all channels in group
 * @PWM_GLOBAL_CTRL_DISABLE: disable all channels in group
 */
enum rockchip_pwm_global_ctrl_cmd {
    PWM_GLOBAL_CTRL_JOIN,
    PWM_GLOBAL_CTRL_EXIT,
    PWM_GLOBAL_CTRL_GRANT,
    PWM_GLOBAL_CTRL_RECLAIM,
    PWM_GLOBAL_CTRL_UPDATE,
    PWM_GLOBAL_CTRL_ENABLE,
    PWM_GLOBAL_CTRL_DISABLE,
};
```

<!-- en PDF p.12 -->

#### 3.1.6 Ausgangsversatz

<!-- en PDF p.12 -->

Der Ausgangsversatz verschiebt das PWM-Ausgangssignal um eine vorgegebene Zeit. Üblich ist die Kombination mit global control im oneshot-Modus. Er entspricht duty offset in struct pwm_state; siehe oneshot-Beschreibung.

<!-- en PDF p.12 -->

#### 3.1.7 Zähler

<!-- en PDF p.12 -->

Der Eingangszähler zählt die Perioden des Eingangssignals.

<!-- en PDF p.12 -->

```text
rockchip_pwm_set_counter(pdev, PWM_COUNTER_INPUT_FROM_IO, true);
msleep(timeout_ms);
rockchip_pwm_set_counter(pdev, 0, false);
rockchip_pwm_get_counter_result(pdev, &counter_res, true);
```

<!-- en PDF p.12 -->

Nach timeout_ms den Zähler schließen und counter_res abrufen.

<!-- en PDF p.12 -->

#### 3.1.8 Frequenzmesser

<!-- en PDF p.12 -->

Der Frequenzmessermodus berechnet die Frequenz des Eingangssignals.

<!-- en PDF p.12 -->

```text
rockchip_pwm_set_freq_meter(pdev, timeout_ms, PWM_COUNTER_INPUT_FROM_IO, &freq_hz);
```

<!-- en PDF p.12 -->

Nach timeout_ms wird das berechnete Ergebnis freq_hz zurückgegeben.

<!-- en PDF p.12 -->

#### 3.1.9 IR-Ausgabe

<!-- en PDF p.12 -->

Die IR-Ausgabe erzeugt Signale im NEC-Format. CONFIG_RC_CORE und CONFIG_LIRC im Kernel aktivieren: Ersteres unterstützt RC-Geräte im Framework, Letzteres stellt deren Userspace-Schnittstelle bereit.

<!-- en PDF p.12 -->

```text
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <sys/mman.h>
int main(int argc, char **argv)
{
    int fp = 0;
    int len = 0;
    int buf[7] = {0};
    char name[32];
    if (argc != 2) {
        printf("Usage: ./rc_tx_test 0/1/2/...\n");
        return -1;
    }
    sprintf(name, "/dev/lirc%s", argv[1]);
    fp = open(name, O_RDWR);
    if (fp < 0)
    {
        printf("Error : Can not open lirc device\n");
        return -1;
    }
    buf[0] = 0x2328;
    buf[1] = 0x1194;
    buf[2] = 0x08ca;
    buf[3] = 0x0230;
    buf[4] = 0x0230;
    buf[5] = 0x069a;
    buf[6] = 0xf00f0ff0;
    len = write(fp, (char *)buf, sizeof(buf));
    if (len < 0)
    {
        printf("Error : Can not write to lirc device\n");
        return -1;
    }
    close(fp);
    printf("Exit ir tx test\n");
    return 0;
}
```

<!-- en PDF p.13 -->

Weitere Angaben zu RC-Geräten und Userspace-Schnittstellen: Documentation/userspace-api/media/rc/. Laut Documentation/userspace-api/media/rc/lirc-write.rst muss der Schreibpuffer eine pulse/space-Sequenz enthalten. Rockchip unterstützt eine einfachere Konfiguration mit nur 7 Parametern; siehe Kommentare in drivers/pwm/pwm-rockchip.c.

<!-- en PDF p.13 -->

```text
static int rockchip_pwm_ir_transmit_v4(struct pwm_chip *chip, unsigned int *txbuf, unsigned int count)
{
......
    /*
     * Each value in the txbuf[] is in microseconds(us).
     * txbuf[0]: the low duration of NEC leader code.
     * txbuf[1]: the high duration of NEC leader code.
     * txbuf[2]: the high duration of NEC repeat code.
     * txbuf[3]: the low duration of NEC logic '0' and '1'.
     * txbuf[4]: the high duration of NEC logic '0'.
     * txbuf[5]: the high duration of NEC logic '1'.
     * txbuf[6]:
     * For 8-bit address code:
     *   bit[31:24]             bit[23:16]    bit[15:8]              bit[7:0]
     *   command inverted code  command code  address inverted code  address code
     *
     * For 16-bit address code:
     *   bit[31:24]             bit[23:16]    bit[15:8]              bit[7:0]
     *   command inverted code  command code  address code bit[15:8] address code bit[7:0]
     */
    preload = txbuf[0] << IR_TRANS_OUT_LOW_PRELOAD_SHIFT |
          txbuf[1] << IR_TRANS_OUT_HIGH_PRELOAD_SHIFT;
    spreload = txbuf[2] << IR_TRANS_OUT_HIGH_SIMPLE_PRELOAD_SHIFT;
    low_period = txbuf[3] << IR_TRANS_OUT_DATA_LOW_PERIOD_SHIFT;
    high_period = txbuf[4] << IR_TRANS_OUT_HIGH_PERIOD_FOR_ZERO_SHIFT |
              txbuf[5] << IR_TRANS_OUT_HIGH_PERIOD_FOR_ONE_SHIFT;
    tx_value = txbuf[6] << IR_TRANS_OUT_VALUE_SHIFT;
......
}
```

<!-- en PDF p.14 -->

#### 3.1.10 IR-Eingang

<!-- en PDF p.14 -->

Details: Rockchip_Developer_Guide_PWM_IR_CN. Zugehöriger Kernel-Treiber: driver/input/remotectl/rockchip_pwm_remotectl.c.

<!-- en PDF p.14 -->

#### 3.1.11 Signalgenerator

<!-- en PDF p.14 -->

Der Signalgenerator erzeugt vorgegebene Signale gemäß der Konfiguration in der Wave-Tabelle.

<!-- en PDF p.14 -->

```text
// setup the duty table
for (i = 0; i < PWM_TABLE_MAX; i++)
    table[i] = i * PWM_WAVE_STEP;
duty_table.table = table;
duty_table.offset = (channel_id % 3) * PWM_TABLE_MAX;
duty_table.len = PWM_TABLE_MAX;

// setup the repeat time for each parameter in table
wave_config.rpt = PWM_WAVE_RPT;

// setup the clk rate
wave_config.clk_rate = 400000;

// If duty_en is true, the wave will get duty config from table each PWM_WAVE_RPT period, and the same to period_en
wave_config.duty_table = &duty_table;
wave_config.period_table = NULL;
wave_config.enable = enable;
wave_config.duty_en = true;
wave_config.period_en = false;

// setup the width_mode and update_mode
wave_config.width_mode = PWM_WIDTH_MODE;
wave_config.update_mode = PWM_WAVE_INCREASING_THEN_DECREASING;

// setup the start and end index in duty/period table
wave_config.duty_max = (channel_id % 3 + 1) * PWM_TABLE_MAX - 1;
wave_config.duty_min = (channel_id % 3) * PWM_TABLE_MAX;
wave_config.period_max = 0;
wave_config.period_min = 0;
wave_config.offset = 0;

// setup the middle index to change table config in interrupt if needed.
wave_config.middle = PWM_TABLE_MAX / 2;
rockchip_pwm_set_wave(pdev, &wave_config);

// enable the continous mode
pwm_get_state(pdev, &state);
state.period = period;
state.duty_cycle = duty;
state.polarity = polarity;
state.enabled = enable;
pwm_apply_state(pdev, &state);
```

<!-- en PDF p.15 -->

Konfiguration und Beschreibung des Wave-Modus:

<!-- en PDF p.15 -->

```text
/**
 * enum rockchip_pwm_wave_table_width_mode - element width of pwm wave table
 * @PWM_WAVE_TABLE_8BITS_WIDTH: each element in table is 8bits
 * @PWM_WAVE_TABLE_16BITS_WIDTH: each element in table is 16bits
 */
enum rockchip_pwm_wave_table_width_mode {
    PWM_WAVE_TABLE_8BITS_WIDTH,
    PWM_WAVE_TABLE_16BITS_WIDTH,
};

/**
 * enum rockchip_pwm_wave_update_mode - update mode of wave generator
 * @PWM_WAVE_INCREASING:
 *     The wave table address will wrap back to minimum address when increase to
 *     maximum and then increase again.
 * @PWM_WAVE_INCREASING_THEN_DECREASING:
 *     The wave table address will change to decreasing when increasing to the maximum
 *     address. it will return to increasing when decrease to the minimum value.
 */
enum rockchip_pwm_wave_update_mode {
    PWM_WAVE_INCREASING,
    PWM_WAVE_INCREASING_THEN_DECREASING,
};

/**
 * struct rockchip_pwm_wave_config - wave generator config object
 * @duty_table: the wave table config of duty
 * @period_table: the wave table config of period
 * @enable: enable or disable wave generator
 * @duty_en: to update duty by duty table or not
 * @period_en: to update period by period table or not
 * @clk_rate: the dclk rate in wave generator mode
 * @rpt: the number of repeated effective periods
 * @width_mode: the width mode of wave table
 * @update_mode: the update mode of wave generator
 * @duty_max: the maximum address of duty table
 * @duty_min: the minimum address of duty table
 * @period_max: the maximum address of period table
 * @period_min: the minimum address of period table
 * @offset: the initial offset address of duty and period
 * @middle: the middle address of duty and period
 * @max_hold: the time to stop at maximum address
 * @min_hold: the time to stop at minimum address
 * @middle_hold: the time to stop at middle address
 */
struct rockchip_pwm_wave_config {
    struct rockchip_pwm_wave_table *duty_table;
    struct rockchip_pwm_wave_table *period_table;
    bool enable;
    bool duty_en;
    bool period_en;
    unsigned long clk_rate;
    u16 rpt;
    u32 width_mode;
    u32 update_mode;
    u32 duty_max;
    u32 duty_min;
    u32 period_max;
    u32 period_min;
    u32 offset;
    u32 middle;
    u32 max_hold;
    u32 min_hold;
    u32 middle_hold;
};
```

<!-- en PDF p.16 -->

PWM v4 besitzt 768 * 8bit Speicher für duty/period. Nach Aktivieren von duty_en/period_en wird alle rpt Zyklen ein Wert in ns aus duty_table/period_table ab duty_min + offset/period_min + offset bis duty_max/period_max gelesen. Anschließend beginnt gemäß update_mode der nächste Zyklus. oneshot stoppt nach oneshot_repeat Zyklen; continuous läuft bis zum manuellen Stoppen. width_mode wählt zwischen 768 * 8bit und 384 * 16bit; bei gleichem dclk unterstützt 16bit größere duty/period-Werte. An den konfigurierten middle- und max-Indizes entstehen Interrupts. Die gewünschte Behandlung kann in drivers/pwm/pwm-rockchip-irq-callbacks.h ergänzt werden:

<!-- en PDF p.16 -->

```text
static void rockchip_pwm_wave_middle_callback(struct pwm_device *pwm)
{
    /*
     * If you want to update the configuration of wave table, set
     * struct rockchip_pwm_wave_table and call rockchip_pwm_set_wave().
     *
     * struct rockchip_pwm_wave_config wave_config;
     * struct rockchip_pwm_wave_table duty_table;
     *
     * //fill the duty table
     * ......
     * wave_config.duty_table = &duty_table;
     * wave_config.enable = true;
     * rockchip_pwm_set_wave(pwm, &wave_config);
     *
     */
}

static void rockchip_pwm_wave_max_callback(struct pwm_device *pwm)
{
    /*
     * If you want to update the configuration of wave table, set
     * struct rockchip_pwm_wave_table and call rockchip_pwm_set_wave().
     *
     * struct rockchip_pwm_wave_config wave_config;
     * struct rockchip_pwm_wave_table duty_table;
     *
     * //fill the duty table
     * ......
     * wave_config.duty_table = &duty_table;
     * wave_config.enable = true;
     * rockchip_pwm_set_wave(pwm, &wave_config);
     *
     */
}
```

<!-- en PDF p.17 -->

#### 3.1.12 Zweiphasenzähler

<!-- en PDF p.17 -->

Der bidirektionale Zähler unterstützt fünf Modi mode0–mode4; Details im PWM-Kapitel des TRM. Mode0 kann die zuvor beschriebenen Funktionen counter und frequency meter übernehmen.

<!-- en PDF p.17 -->

```text
biphasic_config.enable = true;
biphasic_config.is_continuous = false;
biphasic_config.mode = biphasic_mode;
biphasic_config.delay_ms = timeout_ms;
rockchip_pwm_set_biphasic(pdev, &biphasic_config, &biphasic_res);
```

<!-- en PDF p.17 -->

Parameter von biphasic_config:

<!-- en PDF p.17 -->

```text
/**
 * struct rockchip_pwm_biphasic_config - biphasic counter config object
 * @enable: enable: enable or disable biphasic counter
 * @is_continuous: biphascic counter will not stop at the end of timer in continuous mode
 * @mode: the mode of biphasic counter
 * @delay_ms: time to wait, in milliseconds, before getting biphasic counter result
 */
struct rockchip_pwm_biphasic_config {
    bool enable;
    bool is_continuous;
    u8 mode;
    u32 delay_ms;
};
```

<!-- en PDF p.17 -->

Im nicht kontinuierlichen Modus wird biphasic_res nach timeout_ms zurückgegeben. Im kontinuierlichen Modus läuft die Zählung bis zur manuellen Abschaltung; aktuelle Ergebnisse liefert int rockchip_pwm_get_biphasic_result(struct pwm_device *pwm, unsigned long *biphasic_res). Beschreibung der Zweiphasenzählermodi:

<!-- en PDF p.17 -->

```text
/**
 * enum rockchip_pwm_biphasic_mode - mode of biphasic counter
 * @PWM_BIPHASIC_COUNTER_MODE0: single phase increase mode with A-phase
 * @PWM_BIPHASIC_COUNTER_MODE1: single phase increase/decrease mode with A-phase
 * @PWM_BIPHASIC_COUNTER_MODE2: dual phase with A/B-phase mode
 * @PWM_BIPHASIC_COUNTER_MODE3: dual phase with A/B-phase 2 times frequency mode
 * @PWM_BIPHASIC_COUNTER_MODE4: dual phase with A/B-phase 4 times frequency mode
 */
enum rockchip_pwm_biphasic_mode {
    PWM_BIPHASIC_COUNTER_MODE0,
    PWM_BIPHASIC_COUNTER_MODE1,
    PWM_BIPHASIC_COUNTER_MODE2,
    PWM_BIPHASIC_COUNTER_MODE3,
    PWM_BIPHASIC_COUNTER_MODE4,
    PWM_BIPHASIC_COUNTER_MODE0_FREQ,
};
```

<!-- en PDF p.17 -->

PWM_BIPHASIC_COUNTER_MODE0 entspricht counter; PWM_BIPHASIC_COUNTER_MODE0_FREQ entspricht frequency meter.

<!-- en PDF p.17 -->

### 3.2 Userspace

<!-- en PDF p.17 -->

Das PWM-Framework stellt unter /sys/class/pwm/ eine Userspace-Schnittstelle bereit; Implementierung: drivers/pwm/sysfs.c. Nach erfolgreichem Laden entstehen Verzeichnisse wie pwmchip0 und pwmchip1. X hängt nicht von Controller- oder Kanal-ID ab, sondern nur von der Probe-Reihenfolge der PWM-Geräte.

<!-- en PDF p.18 -->

```text
root@linaro-alip:/# cat /sys/class/pwm/pwmchip0/
device/    export     npwm       power/     subsystem/ uevent     unexport
```

<!-- en PDF p.18 -->

Das Schreiben von Y nach export erzeugt pwmY. Da jedes Rockchip-PWM-Gerät nur einen Chip hat, ist ausschließlich Y=0 möglich. Schreiben nach unexport entfernt pwmY. Verfügbare Knoten:

- enable: 1 aktiviert, 0 deaktiviert PWM.
- polarity: normal oder inversed, entsprechend PWM_POLARITY_NORMAL/PWM_POLARITY_INVERSED.
- duty_cycle: Dauer des High-Pegels bei normal beziehungsweise Low-Pegels bei reversed innerhalb einer Periode, in ns.
- period: Signalperiode in ns.
- oneshot_count: Anzahl der oneshot-Perioden; erfordert CONFIG_PWM_ROCKCHIP_ONESHOT.
- oneshot_repeat: Anzahl der oneshot-Wiederholungen; erfordert CONFIG_PWM_ROCKCHIP_ONESHOT und PWM v4. Gesamtzahl: oneshot_repeat * oneshot_count.
- duty_offset: Ausgangssignalversatz in ns; erfordert CONFIG_PWM_ROCKCHIP_ONESHOT.
- capture: Erfasst High- und Low-Dauer des Eingangssignals in ns.

<!-- en PDF p.18 -->

#### 3.2.1 Dauerbetrieb

<!-- en PDF p.18 -->

```text
cd /sys/class/pwm/pwmchip0/
echo 0 > export
cd pwm0
echo 10000 > period
echo 5000 > duty_cycle
echo normal > polarity
echo 1 > enable
```

<!-- en PDF p.18 -->

#### 3.2.2 Einmalige Ausgabe

<!-- en PDF p.18 -->

```text
cd /sys/class/pwm/pwmchip0/
echo 0 > export
cd pwm0
echo 10000 > period
echo 5000 > duty_cycle
echo 1000 > duty_offset
echo normal > polarity
echo 100 > oneshot_count
echo 10 > oneshot_repeat
echo 1 > enable
```

<!-- en PDF p.18 -->

#### 3.2.3 Erfassung

<!-- en PDF p.18 -->

```text
cd /sys/class/pwm/pwmchip0/
echo 0 > export
cd pwm0
cat capture
```

<!-- en PDF p.19 -->

## 4. Häufige Fragen

<!-- en PDF p.19 -->

### 4.1 PWM-Übergang zwischen U-Boot und Kernel

<!-- en PDF p.19 -->

Wenn U-Boot PWM zur Spannungsregelung verwendet und PWM beim Kernelstart weiterläuft, muss der Clock-Gating-Zähler an den tatsächlichen Hardwarezustand angepasst werden. Andernfalls kann der Clock-Treiber den PWM-Takt als unbenutzt abschalten. Folgende Commits korrigieren dies in drivers/pwm/pwm-rockchip.c; den Treiber mindestens auf diesen Stand bringen:

<!-- en PDF p.19 -->

1. kernel-4.4: commit e6f2796ef5b660a70102c02d6c15f65ff8701d76

<!-- en PDF p.19 -->

2. kernel-3.10: commit 5a3d9257d5e379391eb02457ccd70f28a8fb188b

Unterschiedliche PWM-Taktquellenfrequenzen in U-Boot und Kernel verursachen Übergangsschaltungen, verändern das Tastverhältnis und können durch zu niedrige Regelspannung zum Absturz führen. Taktquelle und Frequenz müssen übereinstimmen. Auch abweichende Polarität und Periode können solche Übergänge und Spannungsprobleme auslösen; beide zwischen U-Boot und Kernel abstimmen.

<!-- en PDF p.19 -->

### 4.2 PWM-Pin-Pull-Konfiguration bei Spannungsregelung

<!-- en PDF p.19 -->

Beim Neustart werden GRF-Register möglicherweise nicht zurückgesetzt (second global reset), der PWM-Controller jedoch schon; der Pin wird zum Eingang. Sein Pull-Zustand verändert dadurch die Standardspannung des PWM-Reglers nach dem Neustart. Im Kernel deshalb den ursprünglichen Pull-up/-down konfigurieren, nicht none. Dies ist nur bei PWM-Spannungsregelung erforderlich, nicht bei anderen Funktionen. Den Standard-Pull anhand des Schaltplans bestimmen. Beispiel: PWM2 der RK3399-excavator-Platine regelt die Spannung; GPIO1_C3/PWM2_d bezeichnet mit d einen Standard-Pull-down, mit u einen Pull-up.

<!-- en PDF p.19 -->

![Originalabbildung aus englischem PDF — p.19](/docs/rockchip-linux-pwm/assets/en-p019-figure-01.png)

Lesbare Pin- und Netzbezeichnungen im Schaltplan (leer: kein Netzlabel im Bild):

| Pin/Funktion | Ball | Netz |
| --- | --- | --- |
| GPIO1_C0/SPI3_TXD/I2C0_SCL_u | N30 | I2C_SCL_PMIC |
| GPIO1_C1/SPI3_CLK_d | M27 | CPU_B_SLEEP |
| GPIO1_C2/SPI3_CSn0_u | N31 | Motor_PWR |
| GPIO1_C3/PWM2_d | M28 | LOG_DVS_PWM |
| GPIO1_C4/I2C8_SDA_u | M29 | TOUCH_INT_L |
| GPIO1_C5/I2C8_SCL_u | M30 | PMIC_INT_L |
| GPIO1_C6/TCPD_VBUS_SOURCE0_d | L25 | GSENSOR_INT_L |
| GPIO1_C7/TCPD_VBUS_SOURCE1_d | M31 | DC_DET_H |
| GPIO1_D0/TCPD_VBUS_SOURCE2_d | L26 | GYR_INT_L |
| DFT_JTAG_TMS_u | AA24 |  |
| DFT_JTAG_TRSTn_d | AB24 |  |
| PMUIO2_VDDPST | N23 | VCC_1V5 |
| PMUIO2_VDD | P23 | VCC_3V0 |

*Originalabbildung aus englischem PDF — p.19*

<!-- en PDF p.19 -->

Den PWM-Pull-down-pinctrl im dtsi definieren:

<!-- en PDF p.20 -->

```text
pwm2_pin_pull_down: pwm2-pin-pull-down {
    rockchip,pins =
        <1 19 RK_FUNC_1 &pcfg_pull_down>;
};
```

<!-- en PDF p.20 -->

Die pinctrl-Konfiguration im dts überschreiben:

<!-- en PDF p.20 -->

```text
&pwm2 {
    status = "okay";
    pinctrl-names = "active";
    pinctrl-0 = <&pwm2_pin_pull_down>;
};
```

<!-- en PDF p.20 -->

### 4.3 Oszilloskop erkennt kein PWM-Signal

<!-- en PDF p.20 -->

Wenn das Oszilloskop kein Signal erkennt, zunächst prüfen, ob sich PWM Counter Register ändert. Eine Änderung zeigt PWM-Aktivität an. Beim Lesen mit io muss bei RK3328 und späteren Chips das pclk-Gating aufgehoben werden; siehe Produkttabelle, da PWM-pclk und Arbeitstakt getrennt sind. Bleibt der Registerwert unverändert, arbeitet PWM nicht korrekt. Übliche Ursachen:

<!-- en PDF p.20 -->

1. Taktfehler.

<!-- en PDF p.20 -->

2. Fehlerhafte PWM-Registerkonfiguration: PWM nicht aktiviert, duty count größer als period usw.

<!-- en PDF p.20 -->

3. Bei RK3368 muss zusätzlich bit12 von GRF_SOC_CON15 auf 1 gesetzt werden.

Ändert sich PWM Counter Register, arbeitet PWM; ein weiterhin fehlendes Messsignal deutet auf pinctrl hin:

<!-- en PDF p.20 -->

1. Fehlerhafter iomux.

<!-- en PDF p.20 -->

2. Fehlerhafte io-domain-Konfiguration.

<!-- en PDF p.20 -->

3. Störung durch die Hardware.

Redaktionshinweis: Y bedeutet unterstützt, N nicht unterstützt. Die Quelle verwendet PWM_POLARITY_INVERTED und PWM_POLARITY_INVERSED sowie den IR-Treiberpfad driver/input/remotectl/rockchip_pwm_remotectl.c. Diese Bezeichner bleiben erhalten; tatsächliche BSP-Header und Verzeichnisse prüfen. Chip-/Kernelunterstützung belegt weder herausgeführte Platinenpins noch abgeschlossene Anpassung.

{% endraw %}
