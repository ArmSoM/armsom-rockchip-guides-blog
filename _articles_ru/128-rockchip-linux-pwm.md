---
title: "Rockchip Linux PWM: конфигурация, захват, фильтр, ИК и генерация сигналов"
description: "Rockchip Linux PWM: конфигурация, захват, фильтр, ИК и генерация сигналов — V3.6.0"
excerpt: "Rockchip Linux PWM: конфигурация, захват, фильтр, ИК и генерация сигналов — V3.6.0"
translation_key: "128-rockchip-linux-pwm"
slug: "128-rockchip-linux-pwm"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "PWM", "Linux"]
---

{% raw %}

Источник RK-KF-YF-029 V3.6.0. ШИМ (PWM) управляет аналоговыми цепями цифровым выходом микропроцессора и применяется в измерениях, связи, управлении и преобразовании мощности. Полное руководство описывает функции Rockchip PWM, применение и диагностику. Это справочник платформы: проверьте SoC платы ArmSoM, SDK/BSP, ядро, канал PWM, IOMUX и домен напряжения. Аппаратная проверка ArmSoM не проводилась; не все функции доступны на каждой плате. Китайская статья использует китайские рисунки, EN/RU/DE — английские. Команды являются примерами источника и на оборудовании не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

| SoC | Минимальное ядро источника |
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

## 1. Драйвер

<!-- en PDF p.5 -->

### 1.1 Драйвер ядра

<!-- en PDF p.5 -->

#### 1.1.1 Файлы драйвера

<!-- en PDF p.5 -->

Linux-5.10 и ниже:

<!-- en PDF p.5 -->

```text
drivers/pwm/pwm-rockchip.c
```

<!-- en PDF p.5 -->

Linux-6.1 и выше:

<!-- en PDF p.5 -->

```text
drivers/pwm/pwm-rockchip.c
drivers/pwm/pwm-rockchip-test.c
```

<!-- en PDF p.5 -->

Поддержка PWM v4 начинается с Linux-6.1. PWM v1–v3 в Linux-5.10 и ниже используют интерфейс v1; далее они совместно называются PWM v1. В Linux-6.1 добавлен тестовый драйвер для проверки функций и диагностики, который также служит примером применения функций PWM. Для него включите CONFIG_PWM_ROCKCHIP_TEST.

<!-- en PDF p.5 -->

#### 1.1.2 Конфигурация DTS

<!-- en PDF p.5 -->

В DTS на узлы PWM обычно ссылаются другие драйверы, которые настраивают и используют PWM через интерфейсы подсистемы PWM. Здесь примером служит обычный драйвер подсветки. PWM v1:

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

Имена узлов PWM v1 и v4 различаются. Для v1 используется pwmX: идентификатор контроллера X / 4, канала X % 4. Для v4 — pwmX_Ych_Z: X — идентификатор контроллера, Y — число его каналов, Z — идентификатор канала. Начиная с Linux-4.4 число параметров PWM увеличилось с 2 в Linux-3.10 до 3; оно соответствует свойству #pwm-cells. Подробности: Documentation/devicetree/bindings/pwm/pwm.txt. Параметры кратко описаны ниже.

<!-- en PDF p.5 -->

Параметр 1 — index (индекс запрашиваемого PWM внутри chip), фиксированное значение 0. Каждый PWM channel платформы Rockchip соответствует одному PWM device, и у каждого device только один chip.

<!-- en PDF p.6 -->

Параметр 2 — period выходного сигнала PWM в ns. Значение 25000 ns в примере соответствует 40KHz. Параметр 3 — необязательная polarity, по умолчанию 0; для инверсии задайте PWM_POLARITY_INVERTED.

<!-- en PDF p.7 -->

## 2. Поддерживаемые функции

<!-- en PDF p.7 -->

| SoC | Версия PWM | Каналы | Непрерывно | Однократно | Захват | Фильтр | Глобальное управление | Смещение | Счётчик | Частотомер | ИК-выход | ИК-вход | Генератор | Двухфазный счётчик |
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

- Каждый контроллер имеет 4 канала. Continuous, oneshot и capture доступны на любом канале.
- Filter можно включить одновременно только на одном канале контроллера.
- IR input поддерживается только каналом 3 каждого контроллера.

PWM v3:

- Добавленные counter и output offset доступны на любом канале контроллера. Остальные функции совпадают с PWM v2.

PWM v4:

- Число каналов зависит от контроллера, максимум 8.
- Continuous, oneshot, capture, global control, output offset и filter доступны на любом канале.
- Counter, frequency meter, IR output и IR input поддерживают некоторые контроллеры; одновременно эти функции могут быть включены только на одном канале одного контроллера.
- Wave generator есть у некоторых контроллеров; несколько каналов одного контроллера могут использовать его одновременно.
- Biphasic counter есть у некоторых контроллеров и поддерживается несколькими каналами одного контроллера.
- Пример DTS: arch/arm/boot/dts/rk3506g-iotest-pwm-test.dtsi. Достаточно включить PWM-узел канала фазы A; каналу фазы B требуется соответствующая конфигурация IOMUX.

<!-- en PDF p.8 -->

## 3. Применение

<!-- en PDF p.8 -->

Применение PWM в ядре и пользовательском пространстве описано в Documentation/devicetree/bindings/pwm/pwm.txt. Здесь рассматриваются главным образом расширения функций PWM платформы Rockchip.

<!-- en PDF p.8 -->

### 3.1 Драйвер ядра

<!-- en PDF p.8 -->

Для использования PWM из драйвера ядра добавьте свойство pwms в узел драйвера, как в примере подсветки раздела DTS. Затем получите/освободите устройство PWM следующими интерфейсами:

<!-- en PDF p.8 -->

```text
struct pwm_device *pwm_get(struct device *dev, const char *con_id);
void pwm_put(struct pwm_device *pwm);

struct pwm_device *devm_pwm_get(struct device *dev, const char *con_id);
struct pwm_device *devm_fwnode_pwm_get(struct device *dev, struct fwnode_handle *fwnode, const char *con_id);
```

<!-- en PDF p.8 -->

Реализация и описание функций: include/linux/pwm.h и drivers/pwm/core.c. Ниже интерфейсы PWM framework из Linux-5.10; в Linux-6.1 все интерфейсы legacy-драйверов удалены:

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

Начиная с Linux-4.4 ядро реализует apply вместо config, enable и disable. Это позволяет функции int pwm_apply_state(struct pwm_device *pwm, const struct pwm_state *state) атомарно менять несколько параметров устройства через struct pwm_state.

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

Основные функции continuous, oneshot и capture доступны через интерфейсы PWM framework. Для frequency meter, counter и wave generator платформы Rockchip PWM v4 требуется include/linux/pwm-rockchip.h. Далее приведены функции и их применение; см. также демонстрационный драйвер drivers/pwm/pwm-rockchip-test.c.

<!-- en PDF p.10 -->

#### 3.1.1 Непрерывный режим

<!-- en PDF p.10 -->

Непрерывный режим выдаёт PWM-сигнал с заданным коэффициентом заполнения.

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

#### 3.1.2 Однократный режим

<!-- en PDF p.10 -->

Однократный режим выдаёт заданное число PWM-периодов. В ядре нужно включить CONFIG_PWM_ROCKCHIP_ONESHOT.

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

oneshot_count задаёт число периодов с указанным заполнением. В PWM v4 верхний предел расширен: фактическое число равно oneshot_repeat * oneshot_count. После завершения возникает прерывание. Нужную обработку добавляйте в drivers/pwm/pwm-rockchip-irq-callbacks.h:

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

#### 3.1.3 Захват

<!-- en PDF p.11 -->

Режим захвата рассчитывает длительность высокого и низкого уровней входного сигнала.

<!-- en PDF p.11 -->

```text
pwm_capture(pdev, &cap_res, timeout_ms);
```

<!-- en PDF p.11 -->

После timeout_ms возвращается рассчитанный результат cap_res:

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

#### 3.1.4 Фильтр

<!-- en PDF p.11 -->

Входной фильтр используется совместно с capture/IR input/biphasic counter и отфильтровывает помехи короче окна фильтра.

<!-- en PDF p.11 -->

```text
rockchip_pwm_set_filter(pdev, filter_window_ns);
```

<!-- en PDF p.11 -->

filter_window_ns — ширина окна фильтра.

<!-- en PDF p.11 -->

#### 3.1.5 Глобальное управление

<!-- en PDF p.11 -->

Глобальное управление синхронно обновляет конфигурации нескольких каналов. Вместе с continuous/oneshot оно обеспечивает синхронизацию выходов, комплементарный выход и другие функции.

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

Описание команд глобального управления:

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

#### 3.1.6 Смещение выхода

<!-- en PDF p.12 -->

Режим смещения сдвигает выходной PWM-сигнал на заданное время. Обычно он используется вместе с global control в oneshot. Ему соответствует duty offset в struct pwm_state; см. описание oneshot.

<!-- en PDF p.12 -->

#### 3.1.7 Счётчик

<!-- en PDF p.12 -->

Входной счётчик подсчитывает периоды входного сигнала.

<!-- en PDF p.12 -->

```text
rockchip_pwm_set_counter(pdev, PWM_COUNTER_INPUT_FROM_IO, true);
msleep(timeout_ms);
rockchip_pwm_set_counter(pdev, 0, false);
rockchip_pwm_get_counter_result(pdev, &counter_res, true);
```

<!-- en PDF p.12 -->

После timeout_ms отключите счётчик и получите counter_res.

<!-- en PDF p.12 -->

#### 3.1.8 Частотомер

<!-- en PDF p.12 -->

Частотомер рассчитывает частоту входного сигнала.

<!-- en PDF p.12 -->

```text
rockchip_pwm_set_freq_meter(pdev, timeout_ms, PWM_COUNTER_INPUT_FROM_IO, &freq_hz);
```

<!-- en PDF p.12 -->

После timeout_ms возвращается рассчитанное значение freq_hz.

<!-- en PDF p.12 -->

#### 3.1.9 ИК-выход

<!-- en PDF p.12 -->

ИК-выход выдаёт сигналы формата NEC. В ядре включите CONFIG_RC_CORE и CONFIG_LIRC: первое включает поддержку RC-устройств, второе предоставляет их интерфейс пользовательского пространства.

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

Подробнее об RC-устройствах и пользовательском интерфейсе: Documentation/userspace-api/media/rc/. По Documentation/userspace-api/media/rc/lirc-write.rst записываемый буфер должен содержать последовательность pulse/space. Rockchip также поддерживает более простую конфигурацию из 7 параметров; см. комментарии в drivers/pwm/pwm-rockchip.c.

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

#### 3.1.10 ИК-вход

<!-- en PDF p.14 -->

Подробнее: Rockchip_Developer_Guide_PWM_IR_CN. Соответствующий драйвер ядра: driver/input/remotectl/rockchip_pwm_remotectl.c.

<!-- en PDF p.14 -->

#### 3.1.11 Генератор сигнала

<!-- en PDF p.14 -->

Генератор выдаёт заданные сигналы согласно конфигурации таблицы wave.

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

Конфигурация и описание режима wave:

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

PWM v4 располагает памятью 768 * 8bit для duty/period. После включения duty_en/period_en каждые rpt циклов считывается значение в ns из duty_table/period_table по индексу duty_min + offset/period_min + offset до duty_max/period_max. Затем по update_mode начинается следующий цикл. В oneshot вывод прекращается после oneshot_repeat циклов; в continuous продолжается до ручной остановки. Переключение width_mode позволяет выбрать 768 * 8bit или 384 * 16bit; при одинаковом dclk 16bit поддерживает большие duty/period. Прерывания возникают на настроенных индексах middle и max. Нужную обработку добавляйте в drivers/pwm/pwm-rockchip-irq-callbacks.h:

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

#### 3.1.12 Двухфазный счётчик

<!-- en PDF p.17 -->

Двунаправленный счётчик поддерживает пять режимов mode0–mode4; детали — в главе PWM документа TRM. Mode0 может выполнять описанные выше функции counter и frequency meter.

<!-- en PDF p.17 -->

```text
biphasic_config.enable = true;
biphasic_config.is_continuous = false;
biphasic_config.mode = biphasic_mode;
biphasic_config.delay_ms = timeout_ms;
rockchip_pwm_set_biphasic(pdev, &biphasic_config, &biphasic_res);
```

<!-- en PDF p.17 -->

Параметры biphasic_config:

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

В не-непрерывном режиме после timeout_ms возвращается biphasic_res. В непрерывном режиме подсчёт продолжается до ручного отключения; текущий результат читается через int rockchip_pwm_get_biphasic_result(struct pwm_device *pwm, unsigned long *biphasic_res). Описание режимов двухфазного счётчика:

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

PWM_BIPHASIC_COUNTER_MODE0 эквивалентен counter, а PWM_BIPHASIC_COUNTER_MODE0_FREQ — frequency meter.

<!-- en PDF p.17 -->

### 3.2 Пользовательское пространство

<!-- en PDF p.17 -->

PWM framework предоставляет пользовательский интерфейс в /sys/class/pwm/; реализация — drivers/pwm/sysfs.c. После загрузки драйвера появляются каталоги pwmchipX, например pwmchip0 и pwmchip1. X не связан с идентификатором контроллера или канала: он определяется только порядком probe устройств PWM.

<!-- en PDF p.18 -->

```text
root@linaro-alip:/# cat /sys/class/pwm/pwmchip0/
device/    export     npwm       power/     subsystem/ uevent     unexport
```

<!-- en PDF p.18 -->

Запись Y в export создаёт каталог pwmY. Поскольку у каждого PWM device Rockchip только один chip, Y может быть только 0. Запись Y в unexport удаляет pwmY. Доступные узлы:

- enable: 1 включает, 0 отключает PWM.
- polarity: normal или inversed, соответствуют PWM_POLARITY_NORMAL/PWM_POLARITY_INVERSED.
- duty_cycle: длительность высокого уровня в normal либо низкого в reversed за период, в ns.
- period: период сигнала в ns.
- oneshot_count: число периодов в oneshot; нужен CONFIG_PWM_ROCKCHIP_ONESHOT.
- oneshot_repeat: число повторений oneshot; нужен CONFIG_PWM_ROCKCHIP_ONESHOT, только PWM v4. Итоговое число периодов — oneshot_repeat * oneshot_count.
- duty_offset: смещение выходного сигнала в ns; нужен CONFIG_PWM_ROCKCHIP_ONESHOT.
- capture: включает захват длительностей высокого и низкого уровней входного сигнала в ns.

<!-- en PDF p.18 -->

#### 3.2.1 Непрерывный режим

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

#### 3.2.2 Однократный режим

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

#### 3.2.3 Захват

<!-- en PDF p.18 -->

```text
cd /sys/class/pwm/pwmchip0/
echo 0 > export
cd pwm0
cat capture
```

<!-- en PDF p.19 -->

## 4. Частые вопросы

<!-- en PDF p.19 -->

### 4.1 Переход PWM между U-Boot и ядром

<!-- en PDF p.19 -->

Если U-Boot регулирует напряжение через PWM и PWM продолжает работать на стадии ядра, счётчик clock gating нужно согласовать с фактическим аппаратным состоянием. Иначе драйвер тактирования сочтёт такт PWM неиспользуемым и отключит его, остановив PWM. В drivers/pwm/pwm-rockchip.c это исправлено следующими коммитами; обновите драйвер как минимум до них:

<!-- en PDF p.19 -->

1. kernel-4.4: commit e6f2796ef5b660a70102c02d6c15f65ff8701d76

<!-- en PDF p.19 -->

2. kernel-3.10: commit 5a3d9257d5e379391eb02457ccd70f28a8fb188b

Разная частота источника тактирования PWM в U-Boot и ядре вызывает переходное переключение, меняет заполнение и может привести к зависанию из-за недостаточного напряжения. Источник и частота такта PWM должны совпадать. Несовпадение полярности и периода также вызывает переходные изменения заполнения и сбои регулирования; согласуйте их между U-Boot и ядром.

<!-- en PDF p.19 -->

### 4.2 Подтяжка PWM-вывода при регулировании напряжения

<!-- en PDF p.19 -->

При перезагрузке регистры GRF могут не сбрасываться (second global reset), тогда как PWM-контроллер сбрасывается и вывод становится входом. Состояние подтяжки меняет исходное напряжение PWM-регулятора после перезагрузки. Поэтому в ядре следует задать исходную подтяжку вверх/вниз, а не none. Это требуется только при использовании PWM как регулятора напряжения; для других функций не нужно. Исходную подтяжку определяют по схеме. Например, PWM2 платы RK3399 excavator регулирует напряжение; на схеме GPIO1_C3/PWM2_d: d означает исходную подтяжку вниз, u — вверх.

<!-- en PDF p.19 -->

![Оригинальный рисунок английского PDF — p.19](/docs/rockchip-linux-pwm/assets/en-p019-figure-01.png)

Читаемые обозначения выводов и цепей схемы (пусто — цепь не подписана):

| Вывод/функция | Контакт | Цепь |
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

*Оригинальный рисунок английского PDF — p.19*

<!-- en PDF p.19 -->

Определите pinctrl с подтяжкой PWM вниз в dtsi:

<!-- en PDF p.20 -->

```text
pwm2_pin_pull_down: pwm2-pin-pull-down {
    rockchip,pins =
        <1 19 RK_FUNC_1 &pcfg_pull_down>;
};
```

<!-- en PDF p.20 -->

Переопределите pinctrl в dts:

<!-- en PDF p.20 -->

```text
&pwm2 {
    status = "okay";
    pinctrl-names = "active";
    pinctrl-0 = <&pwm2_pin_pull_down>;
};
```

<!-- en PDF p.20 -->

### 4.3 Осциллограф не обнаруживает PWM-сигнал

<!-- en PDF p.20 -->

Если осциллограф не видит сигнал, сначала проверьте, меняется ли PWM Counter Register. Изменение означает, что PWM работает. При чтении через io для RK3328 и более поздних чипов нужно снять gating pclk; сведения есть в документации продукта, поскольку pclk PWM отделён от рабочего такта. Если регистр не меняется, PWM работает неправильно. Обычно причины следующие:

<!-- en PDF p.20 -->

1. Ошибка тактирования.

<!-- en PDF p.20 -->

2. Ошибка конфигурации PWM-регистров: PWM не включён, duty count больше period и т. п.

<!-- en PDF p.20 -->

3. Для RK3368 дополнительно нужно установить bit12 регистра GRF_SOC_CON15 в 1.

Если PWM Counter Register меняется, PWM работает, но отсутствие измеряемого сигнала указывает на pinctrl:

<!-- en PDF p.20 -->

1. Ошибка iomux.

<!-- en PDF p.20 -->

2. Неверная конфигурация io-domain.

<!-- en PDF p.20 -->

3. Аппаратные помехи.

Примечание: Y — поддерживается, N — нет. Источник использует PWM_POLARITY_INVERTED и PWM_POLARITY_INVERSED, а путь ИК-драйвера записывает как driver/input/remotectl/rockchip_pwm_remotectl.c. Обозначения сохранены; перед применением сверить заголовки и каталоги BSP. Поддержка чипа/ядра не означает, что вывод доступен на плате или адаптация выполнена.

{% endraw %}
