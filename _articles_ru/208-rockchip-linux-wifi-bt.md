---
title: "Руководство разработчика Rockchip Linux Wi-Fi/BT"
description: "Руководство разработчика Rockchip Linux Wi-Fi/BT — V7.0.1"
excerpt: "Руководство разработчика Rockchip Linux Wi-Fi/BT"
translation_key: "208-rockchip-linux-wifi-bt"
slug: "208-rockchip-linux-wifi-bt"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "connectivity"
products: []
tags: [ArmSoM, Rockchip, Wi-Fi, Bluetooth, Linux]
---

{% raw %}

# Руководство разработчика Rockchip Linux Wi-Fi/BT

Основа — китайский и английский документы Rockchip V7.0.1 от 2024-04-16. Сохранены все технические материалы глав 1–10, конфигурации, код, испытательные рисунки и таблицы. Глава 11 содержит только служебные FTP-контакты и данные входа и исключена. Этот справочник ArmSoM не подтверждает поддержку всех модулей на всех платах: проверьте SoC, SDK/BSP, ядро, схему, питание и прошивку модуля. Команды, измерения и журналы взяты из источника; команды и аппаратные/RF-испытания не выполнялись.

Сохранена нумерация каждого источника: английский добавляет заголовок рисунка 2.2.4.1. Пункты Wi-Fi/BT и антенны китайского 4.8.1 становятся английскими 4.8.2/4.8.3; методы испытаний 4.8.2 соответствуют английскому 4.8.4. Некоторые ссылки источника используют старые номера (7.1.1, 7.2, 8.1); ищите раздел по названию. Написания Synopsys, Bcm44338a1.hcd/bcm43438a1.hcd, udhcpcd, reset gopios, комментарии о полярности GPIO и номера CPU для IRQ требуют проверки по SDK/документации. Код и его комментарии сохранены на исходном языке; рисунки — оригинальные технические изображения английского документа.

Исходные рисунки содержат смешанные китайские и английские подписи. RF-отчёт и отчёт об антенне также представлены редактируемыми таблицами.

| SoC | Linux |
| --- | --- |
| RK356X, RK3399, RK3326, RK3288, RK3308, RV1109, RV1126, PX30 | 4.4 / 4.19 |
| RK3588, RK3566, RK3568, RK3399, RV1106, RV1103 | 5.10 |

<!-- source:en p7 unit:0 -->

## 1. Введение

<!-- source:en p7 unit:1 -->

Документ описывает настройку, отладку, разработку и применение Wi-Fi/BT, включая SDK Buildroot, IPC, малопотребляющих изделий и Debian.

<!-- source:en p7 unit:2 -->

## 2. Настройка Wi-Fi/BT

<!-- source:en p7 unit:3 -->

### 2.1 Настройка SDK

<!-- source:en p7 unit:4 -->

Сначала выберите чип и плату командой ./build.sh chip. Можно изменить конфигурацию по умолчанию; ниже предполагается следующий deconfig:

<!-- source:en p7 unit:5 -->

```text
SDK_ROOT/device/rockchip$
+++ b/rk3588/rockchip_rk3588_evb1_lp4_v10_defconfig
@@ -1,4 +1,5 @@
 RK_YOCTO_CFG="rockchip-rk3568-evb"
+RK_WIFIBT_CHIP="ALL_AP"   //Note the colon ""
 RK_KERNEL_DTS_NAME="rk3568-evb1-ddr4-v10-linux" //The specific dts file used
 RK_PARAMETER="parameter-buildroot-fit.txt"
```

<!-- source:en p7 unit:6 -->

Выберите модель Wi-Fi через make menuconfig параметром RK_WIFIBT_CHIP (поиск через «/»). ALL_AP поддерживает все включённые в SDK модули Synopsys (AMPAK) и Realtek; ALL_CY — все Infineon и Realtek. Можно указать модель: AP6275/AP6358S/AP6212/AP6236 ... RTL8723DS/RTL8822CS ... CYW4354/CYW43438/CYW5557X_PCIE/CYW5557X_PCIE. Поддерживаемые модели:

<!-- source:en p7 unit:7 -->

```text
device/rockchip/common/scripts/post-wifibt.sh
156:    if [[ "$RK_WIFIBT_CHIP" = "AP6275_PCIE" ]];then
167:    if [[ "$RK_WIFIBT_CHIP" = "CYW4354" ]];then
174:    if [[ "$RK_WIFIBT_CHIP" = "CYW4373" ]];then
181:    if [[ "$RK_WIFIBT_CHIP" = "CYW43438" ]];then
188:    if [[ "$RK_WIFIBT_CHIP" = "CYW43455" ]];then
195:    if [[ "$RK_WIFIBT_CHIP" = "CYW5557X" ]];then
202:    if [[ "$RK_WIFIBT_CHIP" = "CYW5557X_PCIE" ]];then
209:    if [[ "$RK_WIFIBT_CHIP" = "CYW54591" ]];then
```

<!-- source:en p8 unit:8 -->

```text
216:    if [[ "$RK_WIFIBT_CHIP" = "CYW54591_PCIE" ]];then
223:    if [[ "$RK_WIFIBT_CHIP" = "RTL8188FU" ]];then
228:    if [[ "$RK_WIFIBT_CHIP" = "RTL8189FS" ]];then
233:    if [[ "$RK_WIFIBT_CHIP" = "RTL8723DS" ]];then
237:    if [[ "$RK_WIFIBT_CHIP" = "RTL8821CS" ]];then
241:    if [[ "$RK_WIFIBT_CHIP" = "RTL8822CS" ]];then
245:    if [[ "$RK_WIFIBT_CHIP" = "RTL8852BS" ]];then
249:    if [[ "$RK_WIFIBT_CHIP" = "RTL8852BE" ]];then
280:    if [[ "$RK_WIFIBT_CHIP" = "ALL_CY" ]];then
299:    if [[ "$RK_WIFIBT_CHIP" = "ALL_AP" ]];then
```

<!-- source:en p8 unit:9 -->

Другие модели, например китайские модули AIC и ATBM, поддерживаются материалами на FTP-сервере.

<!-- source:en p8 unit:10 -->

### 2.2 Настройка DTS

<!-- source:en p8 unit:11 -->

Обязательно настройте DTS по электрической схеме.

<!-- source:en p8 unit:12 -->

#### 2.2.1 Настройка SDIO Wi-Fi

<!-- source:en p8 unit:13 -->

Поддерживаются два метода, различающиеся прежде всего управлением питанием и моментом обнаружения карты. Стандартная схема: простой провайдер последовательности питания MMC поддерживает общие свойства разных SoC, позволяя использовать один провайдер для нескольких архитектур (mmc-pwrseq-simple). REG_ON Wi-Fi управляется подсистемой mmc; см. kernel/drivers/mmc/core/pwrseq_simple.c. Преимущество: единое управление всем питанием Wi-Fi через mmc. Недостаток: повторное обнаружение SDIO-карты не поддерживается.

<!-- source:en p8 unit:14 -->

```text
/* System-on-Chip designs may specify a specific
   * MMC power sequence. To successfully detect an
   * SDIO card, that power sequence must be maintained
   * while initializing the card.
   */
sdio_pwrseq: sdio-pwrseq {
  compatible = "mmc-pwrseq-simple";
  pinctrl-names = "default";
  pinctrl-0 = <&wifi_enable_h>;

  /* reset-gpios:
   * contains a list of GPIO specifiers. The reset GPIOs are asserted
   * at initialization and prior we start the power up procedure of the
   * card. They will be de-asserted right after the power has been
   * provided to the card.
   *
   * Alias: WIFI_REG_ON/WL_REG_ON etc (schematic diagram)
```

<!-- source:en p9 unit:15 -->

```text
   * Notes:
   * GPIO_ACTIVE_LOW: Active HIGH
   * GPIO_ACTIVE_LOW: Active LOW
   */
  reset-gpios = <&gpio0 RK_PA2 GPIO_ACTIVE_LOW>;

  /*
   * Default: disabled
   */
  //clocks = <&clk_32768_ck>;  //Handle for the entry in clock-names.
  //clock-names = "ext_clock"; //32.768K: External clock provided to the card.

  /* It's reused as a tunable delay waiting for I/O signaling
   * and card power supply to be stable, regardless of whether
   * pwrseq-simple is used. Default to 10ms if no available.
   *
   * Delay in ms after powering the card and de-asserting the
   * reset-gpios (if any).
   *
   * Default: disabled
   */
  //post-power-on-delay-ms = <200>;

  /* Delay in us after asserting the reset-gpios (if any)
   * during power off of the card.
   *
   * Default: disabled
   */
  //power-off-delay-us = <200>;
};

/* Related to reset-gpio above */
&pinctrl {
  sdio-pwrseq {
    wifi_enable_h: wifi-enable-h {
      rockchip,pins =
      <0 RK_PA2 RK_FUNC_GPIO &pcfg_pull_none>;
    };
  };
};

/* SDIO
 * https://elixir.bootlin.com/linux/latest/source/
 * Documentation/devicetree/bindings/mmc/mmc-controller.yaml
 */
&sdio {
  /*
   * Description:
   * Maximum operating frequency of the bus:
   *  - for SD/SDIO cards the SDR104 mode has a max supported
   *    frequency of 150 or 200MHz,
   * So, lets keep the maximum supported value here.
   */
  max-frequency = <150000000>;

  /* Number of data lines. */
```

<!-- source:en p10 unit:16 -->

```text
  bus-width = <4>;

  /* SD high-speed timing is supported. */
  cap-sd-highspeed;

  /* SD UHS SDR104 speed is supported. */
  sd-uhs-sdr104;

  /*
   * Controller is limited to send SD commands during initialization.
   * Controller is limited to send MMC commands during initialization.
   */
  no-sd;
  no-mmc;

  /* Non-removable slot (like SDIO Wi-Fi); assume always present. */
  non-removable;

  /* enable SDIO IRQ signaling on this interface */
  cap-sdio-irq;

  /* SDIO only. Preserves card power during a suspend/resume cycle. */
  keep-power-in-suspend;

  /* Enable pwrseq*/
  mmc-pwrseq = <&sdio_pwrseq>;

  status = "okay";
};

/* Rockchip Soc Wi-Fi node */
wireless-wlan {
  compatible = "wlan-platdata";
  rockchip,grf = <&grf>;

  /* Attention: If the Wi-Fi module requires 32.768K and is supplied
   * by the Power Management Integrated Circuit (PMIC) as indicated
   * in the schematic, open the following properties and fill in the
   * relevant attributes according to the actual PMIC model used.
   */
  clocks = <&rk809 1>;  //RK809
  clocks = <&hym8563>;  //or hym8563
  clock-names = "ext_clock";

  /* The name of the Wi-Fi, without any specific constraints,
   * serves merely as a suggestive indicator.
   */
  wifi_chip_type = "ap6255";

  /* WIFI_WAKE_HOST: The Wi-Fi chip issues an interrupt notification
   * to the System on Chip (SOC) through this pin for further operations.
   * Special attention: Please verify the connection relationship between
   * this pin and the main controller(SOC); the configuration for a direct
   * connection is GPIO_ACTIVE_HIGH. If an inverted tube is introduced
   * in between, the configuration should be set to GPIO_ACTIVE_LOW.
   */
```

<!-- source:en p11 unit:17 -->

```text
  WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;

  status = "okay";
};

wireless-wlan {
  /omit-if-no-ref/
  wifi_wake_host: wifi-wake-host {
    /* The initial state of the interrupt pin.*/
    rockchip,pins = <0 RK_PA0 0 &pcfg_pull_none>;
  };
};
```

<!-- source:en p11 unit:18 -->

Традиционная схема: REG_ON Wi-Fi управляется net/rfkill/rfkill-wlan.c. Драйвер можно многократно выгружать и загружать через rmmod/insmod; требуется исправление KO-режима.

<!-- source:en p11 unit:19 -->

```text
/* Wi-Fi */
wireless-wlan {
  compatible = "wlan-platdata";
  rockchip,grf = <&grf>;
  clocks = <&rk809 1>;  //RK809
  clocks = <&hym8563>;  //or hym8563
  clock-names = "ext_clock";
  wifi_chip_type = "ap6255";
  WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
  WIFI,poweren_gpio = <&gpio0 RK_PA2 GPIO_ACTIVE_HIGH>;
  status = "okay";
};

&sdio {
  max-frequency = <150000000>;
  bus-width = <4>;
    cap-sd-highspeed;
  sd-uhs-sdr104;
    no-sd;
    no-mmc;
    cap-sdio-irq;
    keep-power-in-suspend;

  /* delete-property */
  /delete-property/ non-removable;
  /delete-property/ mmc-pwrseq = <&sdio_pwrseq>;

  status = "okay";
};

wireless-wlan {
  /omit-if-no-ref/
  wifi_wake_host: wifi-wake-host {
    rockchip,pins = <0 RK_PA0 0 &pcfg_pull_none>;
  };
};
```

<!-- source:en p12 unit:20 -->

#### 2.2.2 Настройка Bluetooth

<!-- source:en p12 unit:21 -->

Настройте UART на выводы фактически используемого порта. Обязательно соедините RTS/CTS согласно SDK; см. замечания по Bluetooth. Особое внимание: многие сбои инициализации вызваны отсутствием или неправильным подключением этих двух выводов. Ниже предполагается UART4:

<!-- source:en p12 unit:22 -->

```text
/* Note the following UART configurations: uart4_xfer/uart4_rts/uart4_ctsn
 * The names for each platform may vary, so you need to look for the
 * corresponding UART notation in the dts/dtsi of the specific chip platform,
 * such as uart4_ctsn,which may be named uart4_cts on some platforms.
 */
wireless-bluetooth {
    compatible = "bluetooth-platdata"

    /* Must be configured and ensure it is correct
     * Configure the RTS pin corresponding to the UART of the SoC here
     * The special configuration is because some Bluetooth chips need to keep
     * the CTS pin low before power-on, otherwise, they will enter test mode
     * or other abnormal working modes. Therefore, the driver will pull it low
     * before power-on,through pinctrl-1, and switch back to the RTS function
     * after power-on, through pinctrl-0;
     */
    uart_rts_gpios = <&gpio4 RK_PA7 GPIO_ACTIVE_LOW>;
    pinctrl-names = "default", "rts_gpio";
    pinctrl-0 = <&uart4_rts>;
    pinctrl-1 = <&uart4_rts_gpio>;

    /* BT_REG_ON Bluetooth power switch */
    BT,power_gpio = <&gpio4 RK_PB3 GPIO_ACTIVE_HIGH>;

    /* Linux platform: The following two configurations do not need to be set */
    //BT,wake_host_irq = <&gpio4 RK_PB4 GPIO_ACTIVE_HIGH>; /* BT_WAKE_HOST */
    //BT,wake_gpio = <&gpio4 31 GPIO_ACTIVE_HIGH>; /* HOST_WAKE_BT */
    status = "okay";
};

/* Open the corresponding UART configuration */
&uart4 {
    pinctrl-names = "default";
    /* Configure the TX/RX/CTS PINs corresponding to the UART of the SoC here, do
not configure the RTS PIN */
    pinctrl-0 = <&uart4_xfer &uart4_ctsn>;
    status = "okay";
};

/* uart4_rts_gpio */
&pinctrl {
    wireless-bluetooth {
        uart4_rts_gpio: uart4-rts-gpio {
            rockchip,pins = <4 RK_PA7 RK_FUNC_GPIO &pcfg_pull_none>;
```

<!-- source:en p13 unit:23 -->

```text
        };
    };
};
```

<!-- source:en p13 unit:24 -->

Необязательная upstream-конфигурация ядра 6.1 broadcom-bluetooth

<!-- source:en p13 unit:25 -->

```text
# SPDX-License-Identifier: (GPL-2.0 OR BSD-2-Clause)
%YAML 1.2
---
$id: http://devicetree.org/schemas/net/broadcom-bluetooth.yaml#
$schema: http://devicetree.org/meta-schemas/core.yaml#

title: Broadcom Bluetooth Chips

maintainers:
  - Linus Walleij <linus.walleij@linaro.org>

description:
  This binding describes Broadcom UART-attached Bluetooth chips.

properties:
  compatible:
    enum:
      - brcm,bcm20702a1
      - brcm,bcm4329-bt
      - brcm,bcm4330-bt
      - brcm,bcm4334-bt
      - brcm,bcm43430a0-bt
      - brcm,bcm43430a1-bt
      - brcm,bcm43438-bt
      - brcm,bcm4345c5
      - brcm,bcm43540-bt
      - brcm,bcm4335a0
      - brcm,bcm4349-bt
      - cypress,cyw4373a0-bt
      - infineon,cyw55572-bt

  shutdown-gpios:
    maxItems: 1
    description: GPIO specifier for the line BT_REG_ON used to
      power on the BT module

  reset-gpios:
    maxItems: 1
    description: GPIO specifier for the line BT_RST_N used to
      reset the BT module. This should be marked as
      GPIO_ACTIVE_LOW.

  device-wakeup-gpios:
    maxItems: 1
    description: GPIO specifier for the line BT_WAKE used to
      wakeup the controller. This is using the BT_GPIO_0
      pin on the chip when in use.
```

<!-- source:en p14 unit:26 -->

```text
host-wakeup-gpios:
  maxItems: 1
  deprecated: true
  description: GPIO specifier for the line HOST_WAKE used
    to wakeup the host processor. This is using he BT_GPIO_1
    pin on the chip when in use. This is deprecated and replaced
    by interrupts and "host-wakeup" interrupt-names

clocks:
  minItems: 1
  maxItems: 2
  description: 1 or 2 clocks as defined in clock-names below,
    in that order

clock-names:
  description: Names of the 1 to 2 supplied clocks
  oneOf:
    - const: extclk
      deprecated: true
      description: Deprecated in favor of txco

    - const: txco
      description: >
        external reference clock (not a standalone crystal)

    - const: lpo
      description: >
        external low power 32.768 kHz clock

    - items:
        - const: txco
        - const: lpo

vbat-supply:
  description: phandle to regulator supply for VBAT

vddio-supply:
  description: phandle to regulator supply for VDDIO

brcm,bt-pcm-int-params:
  $ref: /schemas/types.yaml#/definitions/uint8-array
  minItems: 5
  maxItems: 5
  description: |-
    configure PCM parameters via a 5-byte array:
     sco-routing: 0 = PCM, 1 = Transport, 2 = Codec, 3 = I2S
     pcm-interface-rate: 128KBps, 256KBps, 512KBps, 1024KBps, 2048KBps
     pcm-frame-type: short, long
     pcm-sync-mode: slave, master
     pcm-clock-mode: slave, master

brcm,requires-autobaud-mode:
  type: boolean
  description:
    Set this property if autobaud mode is required. Autobaud mode is required
```

<!-- source:en p15 unit:27 -->

```text
      if the device's initial baud rate in normal mode is not supported by the
      host or if the device requires autobaud mode startup before loading FW.

  interrupts:
    items:
      - description: Handle to the line HOST_WAKE used to wake
          up the host processor. This uses the BT_GPIO_1 pin on
          the chip when in use.

  interrupt-names:
    items:
      - const: host-wakeup

  max-speed: true
  current-speed: true

required:
  - compatible

dependencies:
  brcm,requires-autobaud-mode: [ shutdown-gpios ]

if:
  not:
    properties:
      compatible:
        contains:
          enum:
            - brcm,bcm20702a1
            - brcm,bcm4329-bt
            - brcm,bcm4330-bt
then:
  properties:
    reset-gpios: false

additionalProperties: false

examples:
  - |
    #include <dt-bindings/gpio/gpio.h>
    #include <dt-bindings/interrupt-controller/irq.h>

    uart {
        uart-has-rtscts;

        bluetooth {
            compatible = "brcm,bcm4330-bt";
            max-speed = <921600>;
            brcm,bt-pcm-int-params = [01 02 00 01 01];
            shutdown-gpios = <&gpio 30 GPIO_ACTIVE_HIGH>;
            device-wakeup-gpios = <&gpio 7 GPIO_ACTIVE_HIGH>;
            reset-gpios = <&gpio 9 GPIO_ACTIVE_LOW>;
            interrupt-parent = <&gpio>;
            interrupts = <8 IRQ_TYPE_EDGE_FALLING>;
        };
    };
```

<!-- source:en p16 unit:28 -->

#### 2.2.3 Настройка домена питания IO

<!-- source:en p16 unit:29 -->

Важно: используйте инструкцию по доменам питания соответствующего SDK. Учтите, что питание устройств SDIO3.0 должно составлять

<!-- source:en p16 unit:30 -->

1,8 В.

<!-- source:en p16 unit:31 -->

```text
//Note that the names of io_domains vary for each platform, some are written as
&pmu_io_domains;
&io_domains {
//or
&pmu_io_domains {
 /* VDDIO3_VDD references the voltage of vcc_1v8, if the hardware is connected to
3.3v, then change to vcc_3v3,
  * Note: The names vcc_1v8/vcc_3v3 should be adjusted according to the actual
dts/dtsi.
  */
 vccio3-supply = <&vcc_1v8>;
};

vcc_1v8: vcc_1v8: vcc-1v8 {
 compatible = "regulator-fixed";
 regulator-name = "vcc_1v8";
 regulator-always-on;
 regulator-boot-on;
 /* vcc_1v8 supplies 1.8v */
 regulator-min-microvolt = <1800000>;
 regulator-max-microvolt = <1800000>;
 vin-supply = <&vcc_io>;
};
```

<!-- source:en p16 unit:32 -->

#### 2.2.4 Настройка PCIE Wi-Fi

<!-- source:en p16 unit:33 -->

Настоятельно рекомендуется прочитать документы SDK: docs\Common\PCIe\Rockchip_RK3399_Developer_Guide_PCIe_EN.pdf, docs\Common\PCIe\Rockchip_RK356X_Developer_Guide_PCIe_EN.pdf, docs\Common\PCIe\Rockchip_Developer_Guide_PCIe_EN.pdf. По схеме определите три ключевых сигнала. Wi-Fi PCIe бывает распаянным на плате либо M2; принципы одинаковы. VBAT/VCC3V3 — общее питание 3,3 В, обычно постоянное. WIFI_REG_ON — вывод сброса/включения SoC, удерживаемый высоким при загрузке. PCIE_PERST_L/PERSTO — сброс PCIe-части SoC; его нужно правильно задать в соответствующем узле PCIE DTS.

<!-- source:en p17 unit:34 -->

Настройте Controller и PHY по схеме и трём указанным документам. Простой пример:

<!-- source:en p17 unit:35 -->

```text
// PHY node, the name varies depending on the chip, some are called
&combphy2_psq, the actual name refers to the three documents above;
&pcieXXphy {
    status = "okay";
};

/* If using pcie2x1l2, sata0 and pcie2x1l2 share combphy0_ps,
/* it is necessary to ensure that it is disabled
 */
&sata0 {
    status = "disabled";
}

// Controller node, specifically which controller node to connect to
&pcixxx {
 /* This item sets the PERST# reset signal of the PCIe interface;
 /* whether it is a slot or a soldered device, please find the pin
 /* on the schematic and configure it correctly,
  * otherwise, the link establishment will not be completed.
  * Choose one of the following
  */
    ep-gpios = <&gpio3 13 GPIO_ACTIVE_HIGH>; // RK3399 platform
    reset-gpios = <&gpio4 RK_PA5 GPIO_ACTIVE_HIGH>; // RK356X/3588 platform

    num-lanes = <4>;
    rockchip,skip-scan-in-resume;
    rockchip,perst-inactive-ms = <500>;  /* Refer to the Wi-Fi module manual for
the required #PERST reset time */
    vpcie3v3-supply = <&vcc3v3_pcie20_wifi>;
    status = "okay";
};

// Configure the Wi-Fi REG ON of the PCIe Wi-Fi to pull high during the boot
identification phase
vcc3v3_pcie20_wifi: vcc3v3-pcie20-wifi {
    compatible = "regulator-fixed";
    regulator-name = "vcc3v3_pcie20_wifi";
    regulator-min-microvolt = <3300000>;
    regulator-max-microvolt = <3300000>;
    enable-active-high;
    /*
    * wifi_reg_on is enabled after vbat, vddio is stable, and before reset-gpios
is
    * pulled high, so it is placed in the PCIe power node to meet the module
timing,
    * referring to wifi_poweron_gpio.
    */
    pinctrl-0 = <&wifi_poweron_gpio>
    startup-delay-us = <5000>;
    vin-supply = <&vcc12v_dcin>;
};
```

<!-- source:en p18 unit:36 -->

```text
// Wi-Fi node configuration
wireless_wlan: wireless-wlan {
    compatible = "wlan-platdata";
    wifi_chip_type = "ap6275p";
    // Configuration: WIFI_REG_ON, for use by the Wi-Fi driver
    WIFI,poweren_gpio = <&gpio0 RK_PA2 GPIO_ACTIVE_HIGH>;
    // Configuration: WIFI_HOST_WAKE, if any
    WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
    status = "okay";
};

&pinctrl {
    wireless-wlan {
        wifi_poweren_gpio: wifi-poweren-gpio {
            //PCIE REG ON： 务必配置成上拉
            rockchip,pins = <0 RK_PA2 RK_FUNC_GPIO &pcfg_pull_up>;
        };
    };
};
```

<!-- source:en p18 unit:37 -->

##### 2.2.4.1 Соответствие схемы RK3588 и PCIE20 dtsi

<!-- source:en p18 unit:38 -->

```text
//PCIE20_0 -> pcie2x1l2
PCIE20_0_REFCLKP
PCIE20_0_REFCLKN
PCIE20_0_TXP
PCIE20_0_TXN
PCIE20_0_RXP
PCIE20_0_RXN

&combphy0_ps {
 status = "okay";
};

//pcie@fe190000
&pcie2x1l2 {
    reset-gpios = <&gpio1 RK_PB4 GPIO_ACTIVE_HIGH>;
    status = "okay";
};

//PCIE20_1 -> pcie2x1l0
PCIE20_1_REFCLKP
PCIE20_1_REFCLKN
PCIE20_1_TXP
PCIE20_1_TXN
PCIE20_1_RXP
PCIE20_1_RXN

&combphy1_ps {
    status = "okay";
};

&pcie2x1l0 {   //pcie@fe170000
    reset-gpios = <&gpio1 RK_PB4 GPIO_ACTIVE_HIGH>;
```

<!-- source:en p19 unit:39 -->

```text
    status = "okay";
};

//PCIE20_2 -> pcie2x1l1
PCIE20_2_REFCLKP
PCIE20_2_REFCLKN
PCIE20_2_TXP
PCIE20_2_TXN
PCIE20_2_RXP
PCIE20_2_RXN

&combphy2_psu {
    status = "okay";
};

&pcie2x1l1 { //pcie@fe180000
    reset-gpios = <&gpio1 RK_PB4 GPIO_ACTIVE_HIGH>;
    status = "okay";
};
```

<!-- source:en p19 unit:40 -->

#### 2.2.5 Настройка USB Wi-Fi

<!-- source:en p19 unit:41 -->

Настоятельно рекомендуется прочитать docs\Common\USB\Rockchip_Developer_Guide_USB_EN.pdf. Настройка узла Wi-Fi делится на два случая:

<!-- source:en p19 unit:42 -->

```text
// Case one: The .config file in the kernel directory *has* the
CONFIG_RFKILL/CONFIG_RFKILL_RK configuration option enabled:
wireless_wlan: wireless-wlan {
    compatible = "wlan-platdata";
    wifi_chip_type = "rtl8188fu";
    // Configuration: WIFI_REG_ON pin;
    WIFI,poweren_gpio = <&gpio0 RK_PA2 GPIO_ACTIVE_HIGH>;
    // Configuration: WIFI_HOST_WAKE, if available;
    WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
    status = "okay";
};

// Case two: The .config file in the kernel directory *does not have* the
CONFIG_RFKILL/CONFIG_RFKILL_RK configuration option enabled:
// Configuration: WIFI_REG_ON pin
wifi_usb: wifi-usb {
    compatible = "regulator-fixed";
    regulator-name = "wifi_usb";
    regulator-min-microvolt = <3300000>;
    regulator-max-microvolt = <3300000>;
    regulator-boot-on;
    enable-active-high;  // Change to low if active low is required
    gpio = <&gpio0 RK_PA2 GPIO_ACTIVE_HIGH>; // WIFI_REG_ON PIN, change to LOW if
active low is required
};
```

<!-- source:en p20 unit:43 -->

Пример настройки USB-узла:

<!-- source:en p20 unit:44 -->

```text
/* Enable the corresponding controller and PHY
 * The following is a reference for RV1126/RV1109, please modify according to the
actual situation for other chips;
 * Note that USB has host/device/otg modes;
 * If you are unsure how to configure, please raise an issue on Rockchip redmine:
How to configure the USBXX port of the RKxxx chip as host mode
 * (usb module as device);
 */

/* USB connected to the HOST pin of the SoC */
&u2phy_host {
    status = "okay";
};

&u2phy1 {
    status = "okay";
};

&usb_host0_ehci {
    status = "okay";
};

&usb_host0_ohci {
    status = "okay";
};

/* Another option is to connect to OTG pin of the SOC */
&u2phy1 {
    status = "okay";
};

&usbdrd {
    status = "okay";
};

&usbdrd_dw3 {
    status = "okay";
};

&u2phy_otg {
    status = "okay";
};
```

<!-- source:en p20 unit:45 -->

### 2.3 Подключение Wi-Fi-чипа к SDMMC (интерфейсу SD-карты)

<!-- source:en p20 unit:46 -->

Иногда особые требования предполагают подключение Wi-Fi к SDMMC. В двух следующих настройках замените &sdio на &sdmmc и отключите неиспользуемые узлы. Особое внимание: SDMMC_DET необходимо аппаратно подтянуть к низкому уровню.

<!-- source:en p21 unit:47 -->

```text
&sdmmc {
    bus-width = <4>;
    cap-mmc-highspeed;
    cap-sd-highspeed;
    card-detect-delay = <200>;
    rockchip,default-sample-phase = <90>;
    supports-sd;
    sd-uhs-sdr12;
    sd-uhs-sdr25;
    sd-uhs-sdr104;
    vqmmc-supply = <&vccio_sd>;
-   status = "okay";
+   status = "disabled";
};

+&sdmmc {
-&sdio {
    max-frequency = <200000000>;
    bus-width = <4>;
    cap-sd-highspeed;
    cap-sdio-irq;
    keep-power-in-suspend;
    non-removable;
    rockchip,default-sample-phase = <90>;
    sd-uhs-sdr104;
    supports-sdio;
    mmc-pwrseq = <&sdio_pwrseq>; //sdio_pwrseq can only be referenced by one
node, it cannot be referenced by both sdmmc and sdio at the same time!
    status = "okay";
};

#RK3328 Platform:
&sdmmc {
     bus-width = <4>;
    cap-mmc-highspeed;
    cap-sd-highspeed;
    disable-wp;
    max-frequency = <150000000>;
    pinctrl-names = "default";
    pinctrl-0 = <&sdmmc0_clk &sdmmc0_cmd &sdmmc0_dectn &sdmmc0_bus4>;
    vmmc-supply = <&vcc_sd>;
    supports-sd;
-   status = "okay";
+   status = "disabled";
};

+&sdmmc {
-&sdio  {
    bus-width = <4>;
    cap-sd-highspeed;
    cap-sdio-irq;
    keep-power-in-suspend;
    max-frequency = <150000000>;
    supports-sdio;
    mmc-pwrseq = <&sdio_pwrseq>;
    non-removable;
```

<!-- source:en p22 unit:48 -->

```text
    pinctrl-names = "default";
    pinctrl-0 = <&sdmmc1_bus4 &sdmmc1_cmd &sdmmc1_clk>;
    status = "okay";
};
```

<!-- source:en p22 unit:49 -->

### 2.4 Настройка ядра

<!-- source:en p22 unit:50 -->

#### 2.4.1 Настройка ядра Wi-Fi

<!-- source:en p22 unit:51 -->

Драйверы Wi-Fi перенесены в external/rkwifibt/drivers/. См. описание структуры и сборки Wi-Fi/BT. Обязательные параметры ядра (при необходимости могут быть модульными):

<!-- source:en p22 unit:52 -->

```text
CONFIG_RFKILL=y
CONFIG_RFKILL_RK=y

CONFIG_MMC=y
CONFIG_PWRSEQ_SIMPLE=y

CONFIG_MMC_DW=y
CONFIG_MMC_DW_PLTFM=y
CONFIG_MMC_DW_ROCKCHIP=y

CONFIG_WIRELESS=y
CONFIG_WIRELESS_EXT=y
CONFIG_WEXT_CORE=y
CONFIG_WEXT_PROC=y
CONFIG_WEXT_PRIV=y
CONFIG_CFG80211=y
CONFIG_CFG80211_REQUIRE_SIGNED_REGDB=y
CONFIG_CFG80211_USE_KERNEL_REGDB_KEYS=y
CONFIG_CFG80211_DEFAULT_PS=y
CONFIG_CFG80211_CRDA_SUPPORT=y
# CONFIG_CFG80211_WEXT is not set
CONFIG_MAC80211=y
CONFIG_MAC80211_HAS_RC=y
CONFIG_MAC80211_RC_MINSTREL=y
CONFIG_MAC80211_RC_DEFAULT_MINSTREL=y
CONFIG_MAC80211_RC_DEFAULT="minstrel_ht"
CONFIG_MAC80211_STA_HASH_MAX_SIZE=0
```

<!-- source:en p22 unit:53 -->

#### 2.4.2 Настройка ядра Bluetooth

<!-- source:en p22 unit:54 -->

Synopsys (AMPAK) и Infineon (Azurewave/CY) используют штатный CONFIG_BT_HCIUART ядра; Realtek использует собственные hci uart/hci_usb. Каталоги исходных кодов драйверов:

<!-- source:en p23 unit:55 -->

```text
external\rkwifibt\realtek\bluetooth_uart_driver
external\rkwifibt\realtek\bluetooth_usb_driver
```

<!-- source:en p23 unit:56 -->

Загрузка выполняется как ko. Поэтому для Realtek Bluetooth обязательно отключите CONFIG_BT_HCIUART ядра: #CONFIG_BT_HCIUART is not set. Параметры kernel config:

<!-- source:en p23 unit:57 -->

```text
CONFIG_BT=y
CONFIG_BT_BREDR=y
CONFIG_BT_RFCOMM=y
# CONFIG_BT_RFCOMM_TTY is not set
# CONFIG_BT_BNEP is not set
CONFIG_BT_HIDP=y
# CONFIG_BT_HS is not set
CONFIG_BT_LE=y
CONFIG_BT_DEBUGFS=y
CONFIG_BT_HCIUART=y
CONFIG_BT_HCIUART_H4=y
```

<!-- source:en p23 unit:58 -->

## 3. Структура и сборка Wi-Fi/BT Инструкции

<!-- source:en p23 unit:60 -->

### 3.1 Файлы сборки

<!-- source:en p23 unit:61 -->

Файлы Wi-Fi/BT описаны ниже:

<!-- source:en p23 unit:62 -->

```text
external/rkwifibt/drivers/
bcmdhd                          #Common driver of Synopsys/AMPAK modules
infineon                        #Common driver of Infineon (Cypress Azurewave)
modules
rtlxxx                          #Realtek modules are special, each model has a
separate driver
bluetooth_uart_driver           #UART interface driver of RTK's Bluetooth
bluetooth_usb_driver            #USB interface driver RTK's Bluetooth
bin/arm*/                       #Pre-installed vendor's bin tools, wl is AMPAK
module configuration tool, rtwpriv is rtk module's test tool
conf/*conf                      #Pre-configured wpa_supplicant.conf/dnsmasq.conf
for STA/AP mode
tools/brcm_tools rtk_hciattach  #Bluetooth initialization tools from various
manufacturers
debian wifibt-init.service      #Component for the Debian system
S36wifibt-init.sh script/*sh    #Wi-Fi/BT initialization scripts of Buildroot
system, including connection tests, etc.
firmware/*                      #Wi-Fi/BT firmware files for each manufacturer's
respective models
```

<!-- source:en p23 unit:63 -->

Имена прошивок Wi-Fi/BT для моделей AMPAK/Infineon:

<!-- source:en p24 unit:64 -->

```text
├── AP6212A1
│   ├── bt                          #Bluetooth firmware
│   │   └── BCM43430A1.hcd
│   └── wifi                        #Wi-Fi firmware
│       ├── fw_bcm43438a0.bin
│       ├── fw_bcm43438a1.bin
│       ├── fw_bcm43438a1_mfg.bin
│       ├── nvram_ap6212a.txt
│       └── nvram_ap6212.txt
├── AP6236
│   ├── bt
│   │   └── BCM43430B0.hcd
│   └── wifi
│       ├── fw_bcm43436b0.bin
│       ├── fw_bcm43436b0_mfg.bin
│       └── nvram_ap6236.txt
├── AW-CM256
│   ├── bt
│   │   └── BCM4345C0.hcd
│   └── wifi
│       ├── fw_cyw43455.bin
│       └── nvram_azw256.txt
└── AW-NB197
    ├── bt
    │   └── BCM43430A1.hcd
    └── wifi
        ├── fw_cyw43438.bin
        └── nvram_azw372.txt
```

<!-- source:en p24 unit:65 -->

Драйверы и прошивки Realtek BT UART/USB. Примечание: Realtek Wi-Fi не требует файла прошивки; он нужен только Bluetooth.

<!-- source:en p24 unit:66 -->

```text
external/rkwifibt/drivers/bluetooth_uart_driver/    #Bluetooth UART driver
external/rkwifibt/drivers/bluetooth_usb_driver/     #Bluetooth USB driver
external/rkwifibt/tools/rtk_hciattach/              #Bluetooth initialization
program

external/rkwifibt/firmware/realtek/RTL8723DS/
rtl8723d_config                                     #Bluetooth config for 8723DS
rtl8723d_fw                                         #Bluetooth fw for 8723DS
```

<!-- source:en p24 unit:67 -->

### 3.2 Правила сборки

<!-- source:en p24 unit:68 -->

Разработчикам рекомендуется внимательно изучить следующие сценарии сборки. Правила разделены на две части. Сборка драйверов:

<!-- source:en p25 unit:69 -->

```text
/*
 * It includes the compilation of drivers, WiFiBT's ko, and the copying of
firmware:
 * 1. ./build.sh or ./build.sh wifibt will call the following scripts
 * 2. The scripts will compile the drivers under the
external/rkwifibt/drivers/directory
 * and copy the corresponding firmware files to the file system
 */
device/rockchip/common/scripts/mk-wifibt.sh
device/rockchip/common/scripts/post-wifibt.sh
```

<!-- source:en p25 unit:70 -->

Сборка утилит, включая brcm_patchram_plus1/rtk_hciattach:

<!-- source:en p25 unit:71 -->

```text
# Compilation Rules
buildroot/package/rockchip/rkwifibt/Config.in       # The rules are the same as
the regular Kconfig
buildroot/package/rockchip/rkwifibt/rkwifibt.mk     # Similar to a Makefile

# Bluetooth initialization tool compilation and copying, updated by ./build.sh or
make rkwifibt-rebuild
external/rkwifibt/meson.build
```

<!-- source:en p25 unit:72 -->

Важно уметь читать журнал make rkwifibt-rebuild: он показывает сборку и копирование, выполняемые указанными mk-файлами, и помогает выявлять ошибки сборки и копирования.

<!-- source:en p25 unit:73 -->

### 3.3 Файлы Wi-Fi/BT и их расположение

<!-- source:en p25 unit:74 -->

Разработчик должен знать используемые файлы и пути. При сбоях запуска Wi-Fi/BT проверьте наличие firmware/config и соответствие модели Bluetooth. Пример AP6255: расположение прошивок Wi-Fi/BT в SDK:

<!-- source:en p25 unit:75 -->

```text
external/rkwifibt/firmware/broadcom/AP6255/
├── bt
│   └── BCM4345C0.hcd
└── wifi
    ├── fw_bcm43455c0_ag.bin
    ├── fw_bcm43455c0_ag_mfg.bin
    └── nvram_ap6255.txt
```

<!-- source:en p25 unit:76 -->

После сборки файлы копируются в выходной каталог проекта; system/vendor ссылается на тот же каталог:

<!-- source:en p26 unit:77 -->

```text
buildroot/output/rockchip_rk3xxxx/target/
# After burning the files to the device, the following files should be available,
otherwise, troubleshoot the configuration and compilation issues!!!
$ ls
/system(vendor)/lib/modules/bcmdhd.ko               # Driver ko (if compiled as
ko)
/system(vendor)/etc/firmware/fw_bcm43455c0_ag.bin   # Driver firmware file
location
/system(vendor)/etc/firmware/nvram_ap6255.txt       # Driver nvram file location
/system(vendor)/etc/firmware/BCM4345C0.hcd          # Bluetooth firmware file (if
Bluetooth functionality is present)
```

<!-- source:en p26 unit:78 -->

Модули Realtek, примеры RTL8723DS/RTL8821CU: расположение прошивок Wi-Fi/BT в SDK:

<!-- source:en p26 unit:79 -->

```text
external/rkwifibt/firmware/realtek$ tree
├── RTL8723DS
│   ├── mp_rtl8723d_config  # Bluetooth test config, obtain from the manufacturer
│   ├── mp_rtl8723d_fw      # Bluetooth test firmware, obtain from the
manufacturer
│   ├── rtl8723d_config     # Bluetooth config
│   └── rtl8723d_fw         # Bluetooth firmware
├── RTL8821CU
│   ├── rtl8821cu_config    # Bluetooth config
│   └── rtl8821cu_fw        # Bluetooth firmware
├── bluetooth_uart_driver   # Bluetooth UART driver for RTL8723DS, compiled into
hci_uart.ko
├── bluetooth_usb_driver    # Bluetooth USB driver for RTL8821CU, compiled into
rtk_btusb.ko
├── rtk_hciattach           # Bluetooth initialization program rtk_hciattach,
used only for UART interface BT, USB not required
```

<!-- source:en p26 unit:80 -->

После сборки файлы копируются в выходной каталог проекта:

<!-- source:en p26 unit:81 -->

```text
buildroot/output/rockchip_rk3xxxx/target/

# After burning the files to the device, the following files should be available,
troubleshoot the configuration and compilation issues!!!
$ ls
/system(vendor)/lib/modules/8723ds.ko   # Driver ko (if compiled as ko)
/system(vendor)/lib/modules/8821cu.ko   # Driver ko (if compiled as ko)
/usr/bin/rtk_hciattach                  # Bluetooth initialization program (UART
interface only)
/usr/lib/modules/hci_uart.ko            # UART Bluetooth ko
/usr/lib/modules/rtk_btusb.ko           # USB Bluetooth ko

# Remember that: for UART interface Bluetooth, firmware files will be copied to
the /lib/firmware/rtlbt/ directory
/lib/firmware/rtlbt/rtl8723d_config     # Bluetooth normal function fw/config
/lib/firmware/rtlbt/rtl8723d_fw

# Remember that: for USB interface Bluetooth, firmware files will be copied to
the /lib/firmware/ directory
```

<!-- source:en p27 unit:82 -->

```text
/lib/firmware/rtl8821cu_config          # Bluetooth normal function fw/config
/lib/firmware/rtl8821cu_fw
```

<!-- source:en p27 unit:83 -->

### 3.4 Обновление сборки

<!-- source:en p27 unit:84 -->

Команда сборки:

<!-- source:en p27 unit:85 -->

```text
# Rule: Prioritize the compilation parameters specified on the command line, if
no parameters are specified, they will be obtained from BoardXXX.mk
$ ./build.sh

# or
$ ./build.sh wifibt

# Packaging
$ ./build.sh rootfs && ./build.sh firmware
```

<!-- source:en p27 unit:86 -->

Следите за выводом ./build.sh wifibt, чтобы видеть весь процесс сборки.

<!-- source:en p27 unit:87 -->

### 3.5 Запуск Wi-Fi/BT

<!-- source:en p27 unit:88 -->

Разработчик должен знать содержимое следующих трёх сценариев: это важно для диагностики. Правила запуска Wi-Fi/BT:

<!-- source:en p27 unit:89 -->

```text
# booting script process:
# /etc/init.d/S36wifibt-init.sh
#  -> wifibt-init.sh
#    -> wifibt-util.sh
external/rkwifibt/scripts/S36wifibt-init.sh

external/rkwifibt/scripts/
# Automatically identify the Wi-Fi/BT model based on VID/PID
wifibt-util.sh

# Load the WiFi ko based on the identified model above and initialize Bluetooth
wifibt-init.sh #start_wifibt/start_bt_brcm/start_bt_rtk_usb&uart etc.
```

<!-- source:en p28 unit:90 -->

## 4. Проверка аппаратных и программных функций Wi-Fi/BT Тестирование

<!-- source:en p28 unit:92 -->

### 4.1 Система Buildroot

<!-- source:en p28 unit:93 -->

#### 4.1.1 Тест Wi-Fi STA

<!-- source:en p28 unit:94 -->

Загрузите драйвер: insmod bcmdhd.ko/RTL8723DS.ko. Обычно ifconfig -a покажет wlan0. Включите Wi-Fi: ifconfig wlan0 up. Запустите wpa_supplicant: wpa_supplicant -B -i wlan0 -c /data/cfg/wpa_supplicant.conf. Разбор файла конфигурации:

<!-- source:en p28 unit:95 -->

```text
# ctrl_interface interface configuration
# If there are any modifications, the corresponding -p parameter of wpa_cli
command should be modified accordingly: wpa_cli –i wlan0 –p <ctrl_interface> xxx
$ vi /data/cfg/wpa_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant  # It is not recommended to change by
default!
ap_scan=1
update_config=1 # This configuration allows the hotspot configured by the wpa_cli
command to be saved to the conf file (wpa_cli save_config)

# AP configuration items
network={
    ssid="WiFi-AP"       # Wi-Fi name
    psk="12345678"       # Wi-Fi password
    key_mgmt=WPA-PSK     # Encryption configuration, change to key_mgmt=NONE for
no encryption
}
```

<!-- source:en p28 unit:96 -->

Путь wpa_supplicant.conf измените согласно фактическому расположению на платформе. Отключение Wi-Fi: ifconfig wlan0 down; killall wpa_supplicant.

<!-- source:en p29 unit:97 -->

#### 4.1.2 Сканирование ближайших AP

<!-- source:en p29 unit:98 -->

wpa_cli взаимодействует с процессом wpa_supplicant; убедитесь, что он запущен.

<!-- source:en p29 unit:99 -->

```text
wpa_cli -i wlan0 -p /var/run/wpa_supplicant scan
wpa_cli -i wlan0 -p /var/run/wpa_supplicant scan_results
```

<!-- source:en p29 unit:100 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p029-figure-01.png)

<!-- source:en p29 unit:101 -->

Сравните число обнаруженных точек с приблизительным числом маршрутизаторов рядом и результатами смартфона. Если модуль не поддерживает 5 ГГц, сравнивайте только 2,4 ГГц. Проверьте сигнал ближайшего маршрутизатора. Если он очень близко, а сигнал слабый (обычно хороший: -20…-50; слабее, но приемлемый: -50…-70; плохой: -70…-90), проверьте подключение антенны и соответствие RF-параметров модуля. См. раздел аппаратных RF-характеристик Wi-Fi/BT.

<!-- source:en p29 unit:102 -->

#### 4.1.3 Подключение к маршрутизатору

<!-- source:en p29 unit:103 -->

Изменение файла конфигурации

<!-- source:en p29 unit:104 -->

```text
# Add network configuration item in wpa_supplicant.conf
network={
    ssid="WiFi-AP"        # Wi-Fi Name
    psk="12345678"        # Wi-Fi Password
    key_mgmt=WPA-PSK      # Encryption configuration, change to key_mgmt=NONE for
no encryption
}

# Reload the above configuration for the wpa_supplicant process with the
following command:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconfigure

# Initiate connection:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconnect

# Connection Information
wpa_cli -i wlan0 -p /var/run/wpa_supplicant status
bssid=04:42:1a:b4:e7:7c
freq=5805
ssid=wwc3
id=0
mode=station
wifi_generation=6
```

<!-- source:en p30 unit:105 -->

```text
pairwise_cipher=CCMP
group_cipher=CCMP
key_mgmt=SAE
pmf=2
mgmt_group_cipher=BIP
sae_group=19
sae_h2e=0
sae_pk=0
wpa_state=COMPLETED
ip_address=192.168.50.169
address=d4:9c:dd:f5:52:c4
uuid=47ed7266-da34-5c0b-884a-4fcc17648d87
ieee80211ac=1
```

<!-- source:en p30 unit:106 -->

### 4.2 Проверка точки доступа Wi-Fi AP

<!-- source:en p30 unit:107 -->

SDK содержит необходимые программы. Команда softapDemo apName запускает точку доступа apName, по умолчанию без шифрования. Расположение исходного кода и собранных файлов:

<!-- source:en p30 unit:108 -->

```text
/external/softapDemo/src/main.c
buildroot/package/rockchip/softap/Config.in softap.mk
make softap-dirclean
make softap
```

<!-- source:en p30 unit:109 -->

Если исходный код softapDemo отсутствует, загрузите его по следующему адресу в каталог external:

<!-- source:en p30 unit:110 -->

```text
https://github.com/rockchip-linux/softapServer
```

<!-- source:en p30 unit:111 -->

Realtek: для softap используется p2p0, создаваемый настройкой драйвера ядра. Если узла p2p0 нет, проверьте следующую конфигурацию:

<!-- source:en p30 unit:112 -->

```text
+++ b/drivers/net/wireless/rockchip_wlan/rtl8xxx/Makefile
@@ -1593,7 +1593,7 @@ endif
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
EXTRA_CFLAGS += -DCONFIG_PLATFORM_ANDROID
+EXTRA_CFLAGS += -DCONFIG_CONCURRENT_MODE
```

<!-- source:en p30 unit:113 -->

AMPAK/Azurewave: softap использует wlan1. Создайте узел командой iw phy0 interface add wlan1 type managed. Отладка и пользовательские изменения:

<!-- source:en p30 unit:114 -->

```text
// Here you can add encryption, modify IP addresses, and DNS, etc., which can be
modified by yourself
int wlan_accesspoint_start(const char* ssid, const char* password)
{
    // Create softap hotspot configuration
    create_hostapd_file(ssid, password);
```

<!-- source:en p31 unit:115 -->

```text
    // softap_name: wlan1/p2p0
    sprintf(cmdline, "ifconfig %s up", softap_name);
    // Set custom IP address
    sprintf(cmdline, "ifconfig %s 192.168.88.1 netmask 255.255.255.0",
softap_name);

    // Create a configuration file for the DHCP address pool
    creat_dnsmasq_file();
    int dnsmasq_pid = get_dnsmasq_pid();
    if (dnsmasq_pid != 0) {
        memset(cmdline, 0, sizeof(cmdline));
        sprintf(cmdline, "kill %d", dnsmasq_pid);
        console_run(cmdline);
    }
    memset(cmdline, 0, sizeof(cmdline));
    // Use dnsmasq as a DHCP server to assign IP addresses to devices
    sprintf(cmdline, "dnsmasq -C %s --interface=%s", DNSMASQ_CONF_DIR,
softap_name);
    console_run(cmdline);

    memset(cmdline, 0, sizeof(cmdline));
    // Start softap hotspot mode
    sprintf(cmdline, "hostapd %s &", HOSTAPD_CONF_DIR);
    console_run(cmdline);
    return 1;
}

// Create a DHCP configuration file, which must be consistent with your custom IP
address, otherwise, it will cause the mobile phone to be unable to obtain an IP
bool creat_dnsmasq_file()
{
    FILE* fp;
    fp = fopen(DNSMASQ_CONF_DIR, "wt+");
    if (fp != 0) {
        fputs("user=root\n", fp);
        fputs("listen-address=", fp);
        fputs(SOFTAP_INTERFACE_STATIC_IP, fp);
        fputs("\n", fp);
        fputs("dhcp-range=192.168.88.50,192.168.88.150\n", fp);
        fputs("server=/google/8.8.8.8\n", fp);
        fclose(fp);
        return true;
    }
    DEBUG_ERR("---open dnsmasq configuration file failed!!---");
    return false;
}

// Create an AP hotspot configuration file, which can be consulted with the Wi-Fi
manufacturer, and the parameters here are greatly related to the chip
specifications
int create_hostapd_file(const char* name, const char* password)
{
    FILE* fp;
    char cmdline[256] = {0};
```

<!-- source:en p32 unit:116 -->

```text
    fp = fopen(HOSTAPD_CONF_DIR, "wt+");

    if (fp != 0) {
        sprintf(cmdline, "interface=%s\n", softap_name);
        fputs(cmdline, fp);
        fputs("ctrl_interface=/var/run/hostapd\n", fp);
        fputs("driver=nl80211\n", fp);
        fputs("ssid=", fp);
        fputs(name, fp);
        fputs("\n", fp);
        fputs("channel=6\n", fp);  // Channel setting
        fputs("hw_mode=g\n", fp);  // 2.4/5G configuration
        fputs("ieee80211n=1\n", fp);
        fputs("ignore_broadcast_ssid=0\n", fp);
#if 0  // If encryption is chosen, modify here
        fputs("auth_algs=1\n", fp);
        fputs("wpa=3\n", fp);
        fputs("wpa_passphrase=", fp);
        fputs(password, fp);
        fputs("\n", fp);
        fputs("wpa_key_mgmt=WPA-PSK\n", fp);
        fputs("wpa_pairwise=TKIP\n", fp);
        fputs("rsn_pairwise=CCMP", fp);
#endif
        fclose(fp);
        return 0;
    }
    return -1;
}

int main(int argc, char **argv)
    // According to the Wi-Fi model, set the corresponding hotspot interface. The
4.4 kernel can automatically obtain the Wi-Fi model through the
"/sys/class/rkwifi/chip" node,
    // but the kernel version 4.19 and later does not have this node, and the Wi-
Fi model can be determined in the following way
    // AMPAK/Azurewave: Check for the directory sys/bus/sdio/drivers/bcmsdh_sdmmc
    // Realtek: Check for the directory sys/bus/sdio/drivers/rtl8723ds
    if (!strncmp(wifi_type, "RTL", 3))
        strcpy(softap_name, "p2p0"); // Realtek uses p2p0
    else
        strcpy(softap_name, "wlan1"); // AMPAK/Azurewave uses wlan1

    ... ...
    if (!strncmp(wifi_type, "RTL", 3)) {
        // Realtek module automatically generates the p2p0 node after enabling
coexistence mode
        console_run("ifconfig p2p0 down");
        console_run("rm -rf /userdata/bin/p2p0");
        wlan_accesspoint_start(apName, NULL);
    } else {
        console_run("ifconfig wlan1 down");
        console_run("rm -rf /userdata/bin/wlan1");
        console_run("iw dev wlan1 del");
        console_run("ifconfig wlan0 up");
```

<!-- source:en p33 unit:117 -->

```text
        // AP module needs the iw command to generate the wlan1 node for softap
use
        console_run("iw phy0 interface add wlan1 type managed");
        wlan_accesspoint_start(apName, NULL);
    }
```

<!-- source:en p33 unit:118 -->

После выполнения команды точка доступа должна появиться в настройках Wi-Fi телефона. Если её нет, сначала проверьте указанные файлы конфигурации, затем наличие wlan1 или p2p0 в ifconfig и успешный запуск hostapd/dnsmasq.

<!-- source:en p33 unit:119 -->

### 4.3 Проверка BT

<!-- source:en p33 unit:120 -->

Сначала проверьте DTS/Buildroot по разделам 2/3/7.2. Здесь рассматриваются два распространённых типа BT-модулей. При правильной конфигурации создаётся bt_pcba_test (в новых SDK — bt_init.sh). Модуль REALTEK:

<!-- source:en p33 unit:121 -->

```text
# UART Interface:
/ # cat usr/bin/bt_pcba_test (bt_init.sh)
#!/bin/sh

killall rtk_hciattach

echo 0 > /sys/class/rfkill/rfkill0/state   # Power down
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 1
echo 1 > /sys/class/rfkill/rfkill0/state   # Power up
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 1
insmod /usr/lib/modules/hci_uart.ko           # REALTEK module requires loading
the UART driver
rtk_hciattach -n -s 115200 /dev/ttyS4 rtk_h5 &   # The blue reference indicates
which UART port the Bluetooth is using

# Note: Kill the rtk_hciattach process before starting the test each time.

# Note: For USB interface Bluetooth, there is no sh script. Execute the following
manually:
echo 0 > /sys/class/rfkill/rfkill0/state   # Power down
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 1
echo 1 > /sys/class/rfkill/rfkill0/state   # Power up
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 1
insmod /usr/lib/modules/rtk_btusb.ko          # REALTEK module requires loading
the USB driver
```

<!-- source:en p34 unit:122 -->

Модуль AMPAK/Azurewave

<!-- source:en p34 unit:123 -->

```text
/ # cat usr/bin/bt_pcba_test (bt_init.sh)
#!/bin/sh

killall brcm_patchram_plus1

echo 0 > /sys/class/rfkill/rfkill0/state  # Power down
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 2
echo 1 > /sys/class/rfkill/rfkill0/state  # Power up
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 2

brcm_patchram_plus1 --bd_addr_rand --enable_hci --no2bytes --
use_baudrate_for_download --tosleep 200000 --baudrate 1500000 --patchram
/system/etc/firmware/bcm43438a1.hcd /dev/ttyS4 &

# Note: Kill the brcm_patchram_plus1 process before starting the test each time.
```

<!-- source:en p34 unit:124 -->

Bcm44338a1.hcd обозначает прошивку соответствующей модели BT, /dev/ttyS4 — используемый UART. rtk_hciattach, hci_uart.ko, bcm43438a1.hcd создаются только при правильном выборе Wi-Fi/BT-модуля в Buildroot по разделу 2. Если файлов нет, проверьте конфигурацию (раздел 3). После сценария выполните команды ниже. Если hciconfig отсутствует, включите BR2_PACKAGE_BLUEZ5_UTILS в Buildroot, соберите и обновите систему. Выполните hciconfig hci0 up и hciconfig –a. Обычно должен появиться следующий вывод:

<!-- source:en p34 unit:125 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p034-figure-01.png)

<!-- source:en p34 unit:126 -->

Сканирование BT: hcitool scan

<!-- source:en p35 unit:127 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p035-figure-01.png)

<!-- source:en p35 unit:128 -->

При ошибках см. диагностику в разделе 7.2.

<!-- source:en p35 unit:129 -->

### 4.4 Пробуждение по Wi-Fi (WoL)

<!-- source:en p35 unit:130 -->

Wi-Fi поддерживает сетевое пробуждение: устройство, подключённое к AP и получившее IP, после сна пробуждается беспроводным пакетом, например ping. В общем случае любой адресованный устройству пакет может разбудить систему. Добавьте в wpa_supplicant.conf:

<!-- source:en p35 unit:131 -->

```text
wpa_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant
update_config=1
ap_scan=1
+wowlan_triggers=any # Add this configuration
```

<!-- source:en p35 unit:132 -->

Для Realtek Wi-Fi проверьте следующие параметры Makefile драйвера:

<!-- source:en p35 unit:133 -->

```text
kernel/drivers/net/wireless/rockchip_wlan/rtl8xxx/Makefile
+CONFIG_WOWLAN = y
+CONFIG_GPIO_WAKEUP = y
```

<!-- source:en p35 unit:134 -->

DTS: убедитесь по схеме, что WIFI_WAKE_HOST (или WL_HOST_WAKE) подключён к SoC, и проверьте следующую конфигурацию:

<!-- source:en p35 unit:135 -->

```text
WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
```

<!-- source:en p35 unit:136 -->

Проверка сна системы и Wi-Fi:

<!-- source:en p35 unit:137 -->

```text
dhd_priv setsuspendmode 1  # Only for AMPAK Azurewave modules, Realtek does not
require this command
echo mem > /sys/power/state
```

<!-- source:en p35 unit:138 -->

Теперь устройства той же локальной сети могут отправить ping, после чего система обычно просыпается. После пробуждения восстановите нормальный рабочий режим Wi-Fi:

<!-- source:en p36 unit:139 -->

```text
dhd_priv setsuspendmode 0 # Only for AMPAK Azurewave modules, Realtek does not
require this command
```

<!-- source:en p36 unit:140 -->

Диагностика: если пробуждение не происходит, проверьте вывод пробуждения, правильность уровня и не отключается ли 32,768 кГц.

<!-- source:en p36 unit:141 -->

### 4.5 Режим Wi-Fi MONITOR

<!-- source:en p36 unit:142 -->

Wi-Fi AMPAK/Azurewave

<!-- source:en p36 unit:143 -->

```text
# Set the monitor channel:
dhd_priv channel 6  // channel numbers

# Enable monitor mode:
dhd_priv monitor 1

# Disable monitor mode:
dhd_priv monitor 0
```

<!-- source:en p36 unit:144 -->

Wi-Fi Realtek

<!-- source:en p36 unit:145 -->

```text
# The driver Makefile needs to enable:
+ CONFIG_WIFI_MONITOR = y

# Bring up wlan0 and bring down p2p0
ifconfig wlan0 up
ifconfig p2p0 down

# Enable monitor mode
iwconfig wlan0 mode monitor
or
iw dev wlan0 set type monitor

# Switch to a specific channel
echo "<chan> 0 0" > /proc/net/<rtk_module>/wlan0/monitor // <rtk_module> is the
Realtek Wi-Fi module name, such as rtl8812au, rtl8188eu, etc.
```

<!-- source:en p36 unit:146 -->

### 4.6 Проверка Wi-Fi P2P

<!-- source:en p36 unit:147 -->

```text
# Create a new configuration file: p2p_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant
update_config=1
device_name=p2p_device_name
device_type=10-0050F204-5
config_methods=display push_button keypad virtual_push_button physical_display
p2p_add_cli_chan=1
pmf=1
```

<!-- source:en p37 unit:148 -->

```text
# Start: (kill the previous one first)
wpa_supplicant -B -i wlan0 -c /tmp/p2p_supplicant.conf
wpa_cli
> p2p_find
>

# At this point, open the P2P on the mobile device and you can search for the
device name specified above as device_name=p2p_device_name and click to connect

# At this point, the device side will display // Below is the test mobile device
> <3>P2P-PROV-DISC-PBC-REQ 26:31:54:8e:14:e7 p2p_dev_addr=26:31:54:8e:14:e7
pri_dev_type=10-0050F204-5 name='www' config_methods=0x188 dev_capab=0x25
group_capab=0x0

# The device side responds and sends a connection command, make sure the MAC
address matches the one above
>p2p_connect 26:31:54:8e:14:e7 pbc go_intent=1

> p2p_connect 26:31:54:8e:14:e7 pbc go_intent=1
OK
<3>P2P-FIND-STOPPED
<3>P2P-GO-NEG-SUCCESS role=client freq=5200 ht40=0 peer_dev=26:31:54:8e:14:e7
peer_iface=26:31:54:8e:94:e7 wps_method=PBC
<3>P2P-GROUP-FORMATION-SUCCESS
<3>P2P-GROUP-STARTED p2p-wlan0-2 client ssid="DIRECT-24-www" freq=5200
psk=3d67671b71f7a171118c1ace34ae5e4bcc8e17394394e258be91f55b7ab63748
go_dev_addr=26:31:54:8e:14:e7 [PERSISTENT]
> # At this point, the connection is successful
> quit

ifconfig
p2p-wlan0-2 Link encap:Ethernet  HWaddr 82:C5:F2:2E:7F:89
          inet addr:192.168.49.220  Bcast:192.168.49.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500   Metric:1
          RX packets:470 errors:0 dropped:0 overruns:0 frame:0
          TX packets:344 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:71779 (70.0 KiB)  TX bytes:33829 (33.0 KiB)
# It can be seen that the device is connected to the mobile phone, and if they
can ping each other, it indicates that it is normal.
```

<!-- source:en p37 unit:149 -->

### 4.7 Мост сетевых интерфейсов

<!-- source:en p37 unit:150 -->

Сценарий: wlan0 подключается к AP с доступом в сеть, а wlan1 или p2p0 по разделу 4.2 запускается как точка доступа, чтобы смартфон мог подключиться и выйти в Интернет. Конфигурация ниже; в ядре включите:

<!-- source:en p38 unit:151 -->

```text
+CONFIG_NETFILTER=y
+CONFIG_NF_CONNTRACK=y
+CONFIG_NF_TABLES=y
+CONFIG_NF_TABLES_INET=y
+CONFIG_NF_CONNTRACK_IPV4=y
+CONFIG_IP_NF_IPTABLES=y
+CONFIG_IP_NF_NAT=y
+CONFIG_IP_NF_TARGET_MASQUERADE=y
+CONFIG_BRIDGE=y
```

<!-- source:en p38 unit:152 -->

Выполните две следующие команды, используя IP-адрес, заданный при запуске softap:

<!-- source:en p38 unit:153 -->

```text
iptables -t nat -A POSTROUTING -s 192.168.43.0/24 -o wlan0 -j MASQUERADE
echo "1" > /proc/sys/net/ipv4/ip_forward
```

<!-- source:en p38 unit:154 -->

### 4.8 Аппаратные RF-характеристики Wi-Fi/BT

<!-- source:en p38 unit:155 -->

#### 4.8.1 Пункты испытаний

<!-- source:en p38 unit:156 -->

#### 4.8.2 Часть Wi-Fi/BT

<!-- source:en p38 unit:157 -->

Например: мощность передачи, EVM, отклонение частоты кварца, чувствительность приёмника. Пример для b/g/n/ac:

<!-- source:en p38 unit:158 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p038-figure-01.png)

802.11b / 20 MHz / 11 Mbps / Antenna 0

| Параметр | Единица | CH1 | CH7 | CH13 | Требование |
| --- | --- | --- | --- | --- | --- |
| Проводимая мощность | dBm | 17.17 | 16.86 | 17.21 | <20 dBm |
| Спектральная маска передачи | GHz | пройдено | пройдено | пройдено | |
| Точность модуляции передачи | dB / % | 6.65% | 5.91% | 4.26% | <35%; пиковый детектор |
| Допуск центральной частоты | ppm | 6.65 | 5.91 | 5.27 | ±10 ppm; запас 10 ppm |
| Чувствительность приёмника | dB | -84 | -83 | -82 | -78; запас 2 dB |
| Максимальный входной уровень приёмника | dBm | | | | » -10 dBm |

<!-- source:en p39 unit:159 -->

#### 4.8.3 Антенна

<!-- source:en p39 unit:160 -->

Пассивные S11- и активные OTA-испытания антенны Wi-Fi в устройстве. Пример:

<!-- source:en p39 unit:161 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p039-figure-01.png)

Wi-Fi 2G TRP

| Режим | Канал | Частота (MHz) | Средняя передача (dBm) | Средняя чувствительность (dBm) |
| --- | --- | --- | --- | --- |
| 80211b: 11MBps | 1 | 2412 | 11.12 | -80.8 |
| 80211b: 11MBps | 7 | 2442 | 14.39 | -80.62 |
| 80211b: 11MBps | 13 | 2472 | 13.79 | -80.54 |
| 80211g: 54MBps | 1 | 2412 | 12.4 | -67.25 |
| 80211g: 54MBps | 7 | 2442 | 15.07 | -66.49 |
| 80211g: 54MBps | 13 | 2472 | 14.45 | -65.66 |

<!-- source:en p39 unit:162 -->

Оформите результаты перечисленных испытаний официальным отчётом.

<!-- source:en p39 unit:163 -->

#### 4.8.4 Средства и методы испытаний

<!-- source:en p39 unit:164 -->

Упомянутые далее PDF/TXT находятся в docs/linux/wifibt. Если нет профессионального оборудования или есть вопросы, обратитесь к производителю модуля. Для icomm-semi/altobeam/AIC и других платформ запросите средства и методику у соответствующего производителя модуля или чипа.

<!-- source:en p39 unit:165 -->

##### 4.8.4.1 Испытания Realtek

<!-- source:en p39 unit:166 -->

Обычно различают COB и модули. Модули проходят строгие испытания изготовителя и обычно поставляются с калибровочными данными в efuse; заказчику достаточно проверить соответствие показателей. Для COB заказчик проектирует обвязку Wi-Fi, поэтому требуется полная RF-калибровка совместно с Realtek, с записью результатов в efuse или загрузкой через драйвер. Подробности уточняйте у производителя модуля. Испытания Wi-Fi:

<!-- source:en p39 unit:167 -->

```text
Refer to the Quick_Start_Guide_V6.txt, pay special attention to the command
iwpriv which should be uniformly replaced with rtwpriv.
```

<!-- source:en p39 unit:168 -->

Испытания BT: см. «MP tool user guide for linux20180319.pdf», конкретную методику уточняйте у производителя модуля или поставщика. Для измерений обязательна специальная тестовая прошивка Bluetooth от производителя, размещённая в указанном каталоге.

<!-- source:en p39 unit:169 -->

```text
# Note: Before performing the test, please turn on the BT power
echo 0 > sys/class/rfkill/rfkill0/state
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 1
echo 1 > sys/class/rfkill/rfkill0/state
echo 1 > /proc/bluetooth/sleep/btwrite
```

<!-- source:en p40 unit:170 -->

```text
# Special attention: The rtk_hciattach process should not run, if it does, please
terminate it with killall rtk_hciattach

///////////
/ #
/ # rtlbtmp
:::::::::::::::::::::::::::::::::::::::::::::::::
:::::::: Bluetooth MP Test Tool Starting ::::::::

>
>
>enable uart:/dev/ttyS4   # Note: ttySX corresponds to the actual hardware
connected uart port
>
>> > enable[Success:0]
```

<!-- source:en p40 unit:171 -->

##### 4.8.4.2 Испытания чипов Synopsys/Infineon

<!-- source:en p40 unit:172 -->

Испытания Wi-Fi: сначала установите тестовую прошивку. Для каждого AP-модуля нужна своя прошивка, например:

<!-- source:en p40 unit:173 -->

```text
AP6236 -> fw_bcm43436b0_mfg.bin
AP6212A -> fw_bcm43438a1_mfg.bin
```

<!-- source:en p40 unit:174 -->

fw_bcmxxx_mfg.bin и APxxxx должны соответствовать модели, иначе тест невозможен. Сначала проверьте наличие нужной прошивки; при отсутствии запросите у производителя. Новые SDK уже включают прошивки поддерживаемых моделей: встроенный сценарий сразу переводит Wi-Fi в RF-тестовый режим.

<!-- source:en p40 unit:175 -->

```text
external\rkwifibt\wifi_ap6xxx_rftest.sh
#!/bin/sh
killall ipc-daemon netserver connmand wpa_supplicant

# Reset
echo 0 > /sys/class/rfkill/rfkill0/state
sleep 1
echo 1 > /sys/class/rfkill/rfkill1/state
sleep 1

# Set to update the test firmware
echo /vendor/etc/firmware/fw_bcmdhd_mfg.bin >
/sys/module/bcmdhd/parameters/firmware_path
sleep 1

# Restart wlan0
ifconfig wlan0 down
ifconfig wlan0 up
sleep 1
```

<!-- source:en p41 unit:176 -->

```text
# Confirm whether it has entered the test mode
echo "wl ver"
wl ver
```

<!-- source:en p41 unit:177 -->

В старых SDK тестовая прошивка отсутствует; используйте следующий пример:

<!-- source:en p41 unit:178 -->

```text
# AP6236
# Push fw_bcm43436b0_mfg.bin to the data or other writable partition, then
execute the following commands: (Note the path below)
mount --bind /data/fw_bcm43436b0_mfg.bin /system/etc/firmware/fw_bcm43436b0.bin
ifconfig wlan0 down
ifconfig wlan0 up
wl ver

# CYW43438
echo /data/cyw43438-7.46.58.25-mfgtest.bin >
/sys/module/cywdhd/parameters/firmware_path
ifconfig wlan0 down
ifconfig wlan0 up
wl ver
```

<!-- source:en p41 unit:179 -->

При правильной настройке wl ver выводит строку с «WL_TEST», подтверждая тестовый режим. Подробная методика:

<!-- source:en p41 unit:180 -->

```text
Wi-Fi RF Test Commands for Linux-v03.pdf
```

<!-- source:en p41 unit:181 -->

Испытания Bluetooth: после встроенного сценария bt_init.sh (раздел 3.3) выполните следующие действия. Если hciconfig отсутствует, включите BR2_PACKAGE_BLUEZ5_UTILS в Buildroot, соберите и обновите систему для проверки.

<!-- source:en p41 unit:182 -->

```text
hciconfig hci0 up
hciconfig -a
```

<!-- source:en p41 unit:183 -->

Появление hci0 означает завершение инициализации. Если его нет, возможны две причины:

<!-- source:en p41 unit:184 -->

1. Ошибка DTS Bluetooth, аппаратная неисправность либо неверный UART мешают инициализации.

<!-- source:en p41 unit:185 -->

2. Неверно настроен или отсутствует файл прошивки Bluetooth. По обеим причинам см. разделы 2/3 о BT. Конкретные инструкции испытаний:

<!-- source:en p41 unit:186 -->

```text
BT RF Test Commands for Linux-v05.pdf #The test steps 1/2 are already executed in
the script, no need to execute them again
```

<!-- source:en p42 unit:187 -->

### 4.9 Испытания производительности Wi-Fi

<!-- source:en p42 unit:188 -->

Для iperf учтите два фактора. Перед измерением производительности завершите RF-испытания Wi-Fi и OTA-испытания антенны, подтвердив нормальные показатели; иначе результат бессмысленен. При сильных колебаниях проверьте место с минимальными помехами, например открытое пространство или подвал, предпочтительно экранированную камеру. Из-за сильных помех в открытой среде рекомендуется камера. Сначала убедитесь, что Wi-Fi подключается к AP и получает IP. Измеряйте пропускную способность, устойчивость и колебания. Используйте нижние, средние и верхние каналы маршрутизатора, например 1/6/11. Команды см. в документации iPerf3/iPerf2: «iPerf - iPerf3 and iPerf2 user documentation», iperf2 / iperf3 (es.net). Для платы включите в Buildroot BR2_PACKAGE_IPERF = y и BR2_PACKAGE_IPERF3 = y.

<!-- source:en p42 unit:189 -->

## 5. Диагностика Wi-Fi/BT

<!-- source:en p42 unit:190 -->

Важно: всегда сначала изучайте журнал и диагностируйте ошибки по нему! Обычно проблемы Wi-Fi/BT делятся на три группы: не обнаружено устройство SDIO/USB/PCIE; карта SDIO обнаружена, но прошивка не загрузилась; проблемы производительности — не подключается, мало результатов сканирования, периодические отключения и т. п.

<!-- source:en p43 unit:191 -->

### 5.1 Кратко о процессе обнаружения Wi-Fi

<!-- source:en p43 unit:192 -->

SDIO: при загрузке подсистема MMC ядра распознаёт карту. Сначала разбирается GPIO свойства reset gopios узла sdio_pwrseq в DTS; это WL_REG_ON, переводимый в высокий уровень. Затем по SDIO_CLK/CMD/DATA отправляются команды инициализации. Сначала тактирование низкое — 400/300/200K — для получения основных свойств: SDIO2.0 (максимум CLK 50M) или 3.0 (208M), поддержка четырёх либо одной линии и т. п. Затем по возможностям модуля SDIO_CLK повышается до 50M/150M, завершая базовую инициализацию. Журнал:

<!-- source:en p43 unit:193 -->

```text
# Note that the number 0 in mmc0 is not fixed, it could also be 0/1/2; ff4a0000:
represents the address of the controller, which is also different from platforms
# Parse the mmc-pwrseq node in the dts, to obtain WL_REG_ON
dwmmc_rockchip ff4a0000.dwmmc: allocated mmc-pwrseq
# Low-frequency initialization
mmc_host mmc0: Bus speed (slot 0) = 400000Hz (... actual 400000HZ div = 0)
# High-frequency operation mode
mmc_host mmc0: Bus speed (slot 0) = 50000000Hz (... actual 50000000HZ div = 0)
# SDIO 2.0
mmc0: new high speed SDIO card at address 0001
# SDIO 3.0
mmcx: new ultra high speed SDR104 SDIO card at address 0001
```

<!-- source:en p43 unit:194 -->

USB/PCIE: процесс обнаружения сложнее; см. соответствующие документы в каталоге doc. После успешного обнаружения USB команда lsusb показывает сведения следующего вида:

<!-- source:en p43 unit:195 -->

```text
Bus 001 Device 002: ID 0bda:f179 Realtek Semiconductor Corp. RTL8188FTV
802.11b/g/n 1T1R 2.4G WLAN Adapter
```

<!-- source:en p43 unit:196 -->

Также проверьте USB командой dmesg &#124; grep usb. Для PCIE при успешном обнаружении lspci показывает:

<!-- source:en p43 unit:197 -->

```text
0002:21:00.0 Network controller: Broadcom Inc. and subsidiaries Device 449d (rev
02)
```

<!-- source:en p43 unit:198 -->

Все перечисленные процессы обнаружения выполняются при загрузке. Драйвер Wi-Fi правильно загружается только после обнаружения нужного устройства!

<!-- source:en p44 unit:199 -->

### 5.2 Диагностика Wi-Fi

<!-- source:en p44 unit:200 -->

Для SDIO Wi-Fi обычно два случая. Сначала найдите следующие сообщения в журнале ядра. Если их нет, карта SDIO не обнаружена; см. раздел 7.1.1.

<!-- source:en p44 unit:201 -->

```text
mmc0: new high speed SDIO card at address 0001
# or
mmcx: new ultra high speed SDR104 SDIO card at address 0001
```

<!-- source:en p44 unit:202 -->

В журнале SDIO распознаётся нормально, однако wlan0 отсутствует или не включается.

<!-- source:en p44 unit:203 -->

#### 5.2.1 Сбой Wi-Fi: SDIO не обнаруживается

<!-- source:en p44 unit:204 -->

Сначала настоятельно рекомендуется ещё раз внимательно проверить DTS/KERNEL из главы 2! Затем выполняйте проверки по порядку, руководствуясь журналом ядра:

<!-- source:en p44 unit:205 -->

##### 5.2.1.1 Измерение напряжений

<!-- source:en p44 unit:206 -->

Измерьте уровни и частоту CLK на обозначенных выводах. Для SDIO 3.0 обязательно 1,8 В.

<!-- source:en p44 unit:207 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p044-figure-01.png)

<!-- source:en p44 unit:208 -->

Осциллографом измерьте последовательность VBAT/VDDIO/WL_REG_ON и проверьте следующие временные требования:

<!-- source:en p45 unit:209 -->

##### 5.2.1.2 Временная последовательность

<!-- source:en p45 unit:210 -->

Ниже указаны требования AMPAK. Проверяйте временную диаграмму документации фактически используемого модуля, особенно VDDIO.

<!-- source:en p45 unit:211 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p045-figure-01.png)

<!-- source:en p45 unit:212 -->

##### 5.2.1.3 Неверная настройка WL_REG_ON в DTS

<!-- source:en p45 unit:213 -->

Вывод включения Wi-Fi не поднимается в высокий уровень. Осциллографом проверьте переключения и амплитуду 1,8/3,3 В. Повторяющиеся высокие и низкие уровни нормальны: инициализация SDIO выполняет несколько попыток. При успехе WL_REG_ON остаётся высоким, при неудаче опускается. Постоянно низкий уровень указывает на неверный DTS. Если принудительный аппаратный высокий уровень позволяет обнаружить устройство, это также указывает на ошибку WL_REG_ON в DTS.

<!-- source:en p45 unit:214 -->

```text
mmcX: Bus speed (slot 0) = 300000Hz (slot req 300000Hz, actual 300000HZ div =
0)
mmcX: Bus speed (slot 0) = 200000Hz (slot req 200000Hz, actual 200000HZ div =
0)
mmcX: Bus speed (slot 0) = 100000Hz (slot req 100000Hz, actual 100000HZ div =
0)
```

<!-- source:en p45 unit:215 -->

##### 5.2.1.4 Неверная настройка WL_REG_ON в DTS

<!-- source:en p45 unit:216 -->

##### 5.2.1.5 Домен питания VDDIO/SDIO/IO

<!-- source:en p45 unit:217 -->

На PIN12 VDDIO должно быть 3,3/1,8 В, и SDIO_CMD/SDIO_DATA0~3 должны иметь соответствующие 3,3 либо 1,8 В. Проверьте соответствие напряжения VDDIO конфигурации домена питания DTS.

<!-- source:en p46 unit:218 -->

##### 5.2.1.6 Нет сигнала SDIO_CLK

<!-- source:en p46 unit:219 -->

Неверная настройка домена IO может привести к отсутствию CLK. Проверьте подтягивающий вверх резистор CLK и испытайте без него. Для захвата CLK настройте триггер осциллографа.

<!-- source:en p46 unit:220 -->

##### 5.2.1.7 Недостаточное питание или сильные колебания напряжения

<!-- source:en p46 unit:221 -->

VCC_WL/VBAT/VDDIO_SDIO: недостаточное питание или сильные колебания напряжения.

<!-- source:en p46 unit:222 -->

```text
# Realtek Modules
RTL871X: ### rtw_hal_ops_check - Error : Please hook HalFunc.read_chip_version
###
RTL871X: ### rtw_hal_ops_check - Error : Please hook HalFunc.init_default_value
###
```

<!-- source:en p46 unit:223 -->

##### 5.2.1.8 32.768K

<!-- source:en p46 unit:224 -->

Внешний тактовый сигнал: характеристики LPO

<!-- source:en p46 unit:225 -->

| Параметр | Характеристика | Единицы |
| --- | --- | --- |
| Номинальная входная частота | 32.768 | кГц |
| Точность частоты | ± 30 | ppm |
| Коэффициент заполнения | 30 - 70 | % |
| Амплитуда входного сигнала | 400–1800 | мВ, размах |
| Тип сигнала | Прямоугольный | - |
| Входной импеданс | &gt;100k &lt;5 | Ом пФ |
| Джиттер тактового сигнала (интегрированный в диапазоне 300 Гц – 15 кГц) | &lt;1 | Гц |
| Высокий уровень выходного напряжения | 0.7Vio - Vio | В |

<!-- source:en p46 unit:226 -->

CLK_32K_OUT: отсутствует сигнал 32,768 кГц либо его точность не соответствует требованиям таблицы выше!

<!-- source:en p46 unit:227 -->

```text
# For AMPAK/Azurewave modules, the abnormal log for 32k:
[11.068180] dhdsdio_htclk: HT Avail timeout (1000000): clkctl 0x50
[11.074372] dhd_bus_init: clock state is wrong. state = 1
[12.078468] dhdsdio_htclk: HT Avail timeout (1000000): clkctl 0x50
[12.086051] dhd_net_bus_devreset: dhd_bus_devreset: -1
```

<!-- source:en p47 unit:228 -->

##### 5.2.1.9 Недостаточное качество трассировки платы, неподходящие ёмкости или индуктивности

<!-- source:en p47 unit:229 -->

SDIO_CLK/CMD/DATAX: ошибки трассировки платы, неподходящие конденсаторы и индуктивности, плохой контакт или пайка могут приводить к сбоям инициализации либо невозможности работы на высокой частоте. Для проверки снизьте частоту через max-frequency в узле &sdio. Если снижение помогает, инженеры должны измерить сигналы и проверить временные характеристики CLK/CMD/DATA по документации модуля Wi-Fi. Изменение частоты:

<!-- source:en p47 unit:230 -->

```text
&sdio {
+  max-frequency = <10000000>;   # Modify here to limit the frequency
```

<!-- source:en p47 unit:231 -->

##### 5.2.1.10 Настройка io_domain

<!-- source:en p47 unit:232 -->

Проверьте соответствие напряжений Wi-Fi и контроллера SDIO, а также соответствие программной настройки io_domain аппаратуре (раздел 2.2.3).

<!-- source:en p47 unit:233 -->

```text
// Abnormal log 1
mmc_host mmc1: Bus speed(slot0)=100000000Hz(slotreq 100000000Hz,actual
100000000HZ div=0)
dwmmc_rockchip ff0d0000.dwmmc: All phases bad!
mmc1: tuning execution failed
mmc1: error -5 whilst initialising SDIO card

// Abnormal log 2, such as logs for data communication exceptions like firmware
download failure:
sdioh_buffer_tofrom_bus: TX FAILED ede95000, addr=0x08000, pkt_len=1968, ERR=-84
_dhdsdio_download_firmware: dongle image file download failed
dhd_bus_devreset Failed to download binary to the donglesdio

// Abnormal log 3
dwmmc_rockchip 30120000.rksdmmc: Busy; trying anyway
sdioh_buffer_tofrom_bus: RX FAILED c52ce000, addr=0x0f154, pkt_len=3752, ERR=-5
dhdsdio_membytes: membytes transfer failed
bcmsdh_sdmmc: Failed to Write byte F1:@0x1000a=00, Err: -5
dhdsdio_membytes: FAILED to set window back to 0x18100000
```

<!-- source:en p47 unit:234 -->

##### 5.2.1.11 WL_HOST_WAKE

<!-- source:en p47 unit:235 -->

WL_HOST_WAKE используется WLAN для пробуждения RK HOST. Неверная настройка вывода, нестабильный уровень или плохая пайка могут вызывать следующие ошибки либо зависание системы:

<!-- source:en p47 unit:236 -->

```text
# AMPAK Azurewave module, exception log:
dhd_bus_rxctl: resumed on timeout, INT status=0x208000C0
dhd_bus_rxctl: rxcnt_timeout=1, rxlen=0
```

<!-- source:en p48 unit:237 -->

##### 5.2.1.12 Плохая пайка выводов SDIO_D1~3

<!-- source:en p48 unit:238 -->

Если появляются следующие журналы и снижение max-frequency ниже 10 МГц не помогает:

<!-- source:en p48 unit:239 -->

```text
[ 22.484301] mmc3: queuing unknown CIS tuple 0x80 (7 bytes)
[ 22.598965] xxx 148500000Hz (slot req 150000000Hz, actual 148500000HZ div = 0)
[ 23.466816] dwmmc_rockchip fe000000.dwmmc: Unexpected xfer timeout, state 3
[ 24.370310] dwmmc_rockchip fe000000.dwmmc: All phases bad!
[ 24.370391] mmc3: tuning execution failed: -5
```

<!-- source:en p48 unit:240 -->

Переключитесь для проверки в однолинейный режим:

<!-- source:en p48 unit:241 -->

```text
&sdio {
+  bus-width = <1>;   /* Adjust to 1-line mode for testing */
```

<!-- source:en p48 unit:242 -->

Если это помогает, имеется аппаратная проблема одного из выводов SDIOD1~3, например плохая пайка или неверное соединение.

<!-- source:en p48 unit:243 -->

##### 5.2.1.13 Неисправный модуль или микросхема

<!-- source:en p48 unit:244 -->

С небольшой вероятностью неисправны основной чип либо модуль Wi-Fi. Рекомендуется проверить несколько экземпляров.

<!-- source:en p48 unit:245 -->

##### 5.2.1.14 Ошибка мультиплексирования IOMUX

<!-- source:en p48 unit:246 -->

```text
pinctrl: pin gpio3-4 already requested by ff120000.serial; cannot claim for
ff5f0000.dwmmc
pinctrl: pin-100 (ff5f0000.dwmmc) status -22
pinctrl: could not request pin 100 (gpio3-4) from group sdmmc0ext-bus4 on device
dwmmc_rockchip ff5f0000.dwmmc: Error applying setting, reverse things
```

<!-- source:en p48 unit:247 -->

##### 5.2.1.15 Дополнительные сведения

<!-- source:en p48 unit:248 -->

Если перечисленные проверки не помогли, загрузите в Redmine конфигурацию dts/dtsi, полный журнал ядра dmesg и электрическую схему PDF. Также предоставьте осциллограммы включения WIFI_REG_ON, Wi-Fi_CLK и Wi-Fi CMD.

<!-- source:en p48 unit:249 -->

#### 5.2.2 Диагностика USB Wi-Fi

<!-- source:en p48 unit:250 -->

Обычно устройство USB Wi-Fi выводит сведения следующего вида; без них драйвер Wi-Fi не загрузится!

<!-- source:en p49 unit:251 -->

```text
# USB device detected
usb 2-1: new high-speed USB device number 2 using ehci-platform
# Manufacturer's PID/VID
usb 2-1: New USB device found, idVendor=0bda, idProduct=b82c
usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
usb 2-1: Product: 802.11ac NIC
```

<!-- source:en p49 unit:252 -->

Если указанных сведений нет, по разделу 2.2 проверьте высокий уровень VBAT/WL_REG_ON и правильность настройки USB. Примечание: на RV1106/1103 иногда для обнаружения необходимо вручную выполнить echo 1 > /sys/devices/platform/ff3e0000.usb2-phy/otg_mode.

<!-- source:en p49 unit:253 -->

#### 5.2.3 Замечания по Realtek Wi-Fi

<!-- source:en p49 unit:254 -->

##### 5.2.3.1 WLAN0 обнаружен, но сканирование работает неправильно

<!-- source:en p49 unit:255 -->

Модули FN-Link: PIN25 (вывод 22 микросхемы COB) внутренне мультиплексирован. Одна функция — PCM_OUT, соединённый с PCM_IN SoC Rockchip для голосовой связи Bluetooth PCM; другая — LDO_SPS_SEL микросхемы Wi-Fi, выбор SPS/LDO. Низкий уровень означает SPS, высокий — LDO. Вывод должен иметь определённый высокий или низкий уровень. Промежуточный уровень может нарушать работу Wi-Fi: не обнаруживается SDIO или точки доступа. При промежуточном уровне установите аппаратную подтяжку вверх. Модули LB-LINK: PIN7 должен быть соединён с подтягивающим вниз резистором.

<!-- source:en p49 unit:256 -->

##### 5.2.3.2 Поддержка SDIO 3.0 в Realtek

<!-- source:en p49 unit:257 -->

На высокопроизводительных модулях с поддержкой 3.0, например RTL8821CS, возможен сбой инициализации со следующим журналом:

<!-- source:en p49 unit:258 -->

```text
mmc_host mmc1: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ
div = 0)
mmc_host mmc1: Voltage change didn't complete
mmc1: error -5 whilst initialising SDIO card
```

<!-- source:en p49 unit:259 -->

Добавьте следующее исправление:

<!-- source:en p49 unit:260 -->

```text
diff --git a/drivers/mmc/core/sdio.c b/drivers/mmc/core/sdio.c
index 2046eff..6626752 100644
--- a/drivers/mmc/core/sdio.c
+++ b/drivers/mmc/core/sdio.c
@@ -646,7 +646,7 @@ static int mmc_sdio_init_card(struct mmc_host *host, u32 ocr,
* try to init uhs card. sdio_read_cccr will take over this task
* to make sure which speed mode should work.
*/
```

<!-- source:en p50 unit:261 -->

```text
- if (!powered_resume && (rocr & ocr & R4_18V_PRESENT)) {
+ /*if (!powered_resume && (rocr & ocr & R4_18V_PRESENT)) {
  err = mmc_set_uhs_voltage(host, ocr_card);
  if (err == -EAGAIN) {
   mmc_sdio_resend_if_cond(host, card);
@@ -655,7 +655,10 @@ static int mmc_sdio_init_card(struct mmc_host *host, u32
ocr,
  } else if (err) {
   ocr &= ~R4_18V_PRESENT;
  }
- }
+ }*/
+
+ ocr &= R4_18V_PRESENT;
```

<!-- source:en p50 unit:262 -->

#### 5.2.4 Карта SDIO Wi-Fi обнаружена, но wlan0 не поднимается

<!-- source:en p50 unit:263 -->

Следующие сообщения kmesg означают, что карта SDIO распознана, но Wi-Fi ещё не работает.

<!-- source:en p50 unit:264 -->

```text
mmcx: new high speed SDR104 SDIO card at address 0001
# or
mmcx: new ultra high speed SDR104 SDIO card at address 0001
```

<!-- source:en p50 unit:265 -->

Файл прошивки отсутствует либо его имя не соответствует модели модуля (только AMPAK и Azurewave).

<!-- source:en p50 unit:266 -->

```text
[dhd] dhd_conf_set_path_params : Final
clm_path=/vendor/etc/firmware/clm_bcm43438a1.blob
[dhd] dhd_conf_set_path_params : Final conf_path=/vendor/etc/firmware/config.txt
  dhdsdio_download_code_file: Open firmware file failed
/vendor/etc/firmware/fw_bcm43438a1.bin
_dhdsdio_download_firmware: dongle image file download failed
```

<!-- source:en p50 unit:267 -->

Питание модуля Wi-Fi нестабильно.

<!-- source:en p50 unit:268 -->

```text
[ 14.059448] RTW: ERROR sd_write8: FAIL!(-110) addr=0x10080 val=0x00
[ 14.059602] RTW: ERROR _sd_cmd52_read: FAIL!(-110) addr=0x00086
[ 14.059615] RTW: ERROR sdio_chk_hci_resume((null)) err:-110
```

<!-- source:en p50 unit:269 -->

Модуль Realtek неправильно сканирует, например не обнаруживает точку доступа.

<!-- source:en p50 unit:270 -->

```text
[ 43.860022] RTW: sdio_power_on_check: 0x1B8 test Pass.
[ 43.860115] RTW: _InitPowerOn_8723DS: Test Mode
[ 43.860156] RTW: _InitPowerOn_8723DS: SPS Mode
```

<!-- source:en p50 unit:271 -->

Одновременно выбраны встроенный и KO-режимы либо конфигурация ядра не соответствует системе

<!-- source:en p51 unit:272 -->

Драйвер Wi-Fi загружается слишком рано: журнал показывает загрузку в первую секунду, когда устройство sdio/usb ещё не перечислено. Проверьте раздел настройки ядра. Другой случай — одновременно загружаются bcmdhd.ko и 88xx.ko, что вызывает ошибку. Причина описана в разделе 3 об инструкциях сборки.

<!-- source:en p51 unit:273 -->

#### 5.2.5 Сбой SDIO Wi-Fi после некоторого времени работы

<!-- source:en p51 unit:274 -->

SDIO_CLK/CMD/DATAX: неверная трассировка платы, неподходящие ёмкости и индуктивности, плохой контакт или пайка могут нарушить инициализацию или работу на высокой частоте. Для проверки уменьшите max-frequency в узле &sdio. Если это помогает, измерьте сигналы и проверьте временные параметры CLK/CMD/DATA по документации модуля Wi-Fi. SDIO2.0: диаграмма SDIO High Speed Mode Timing (CLK <= 50M); SDIO3.0: SDIO Bus Timing Specifications in SDR Modes (SDR104/DDR50), 50M < CLK <= 208M.

<!-- source:en p51 unit:275 -->

```text
&sdio {
+  max-frequency = <10000000>;   # Modify this to limit the frequency
```

<!-- source:en p51 unit:276 -->

Случай 2: напряжения Wi-Fi и SDIO SoC не соответствуют друг другу. Проверьте соответствие программной настройки io_domian аппаратуре (раздел 2.2.3).

<!-- source:en p51 unit:277 -->

#### 5.2.6 Wi-Fi: не удаётся подключиться к AP, нестабильное или медленное соединение

<!-- source:en p51 unit:279 -->

Сначала рассмотрим процесс подключения:

<!-- source:en p51 unit:280 -->

1. Сканирование и настройка SSID. Если нужный SSID не найден, сканирование повторяется до его обнаружения.

<!-- source:en p51 unit:281 -->

2. Начало подключения и выполнение четырёхстороннего рукопожатия.

<!-- source:en p51 unit:282 -->

3. Получение IP-адреса через DHCP. Эти проблемы обычно вызваны несоответствием RF-параметров или антенны чипа/модуля Wi-Fi. Для проверки сначала выполните простой программный тест подключения из раздела 4.1. RF-характеристики: предоставьте протокол RF-испытаний платы; если его нет, начните с основных параметров. Для готового устройства в корпусе проверьте наличие OTA-испытаний антенны; если их нет, проведите в первую очередь. Убедитесь, что протоколы RF Wi-Fi и OTA антенны готового изделия подтверждают соответствие аппаратных параметров: мощности передачи, EVM, отклонения частоты кварца и чувствительности приёма.

<!-- source:en p52 unit:283 -->

Сравнение сканирования: разместите испытуемое устройство и смартфон на одинаковом расстоянии от маршрутизатора; сравните число AP и силу сигнала со смартфоном либо аналогичным изделием. Метод сканирования — в разделе 4.1. На Android откройте настройки разработчика и включите подробное журналирование WLAN; вернитесь в WLAN для просмотра подробностей AP, включая RSSI. Сравнение числа точек и уровня сигнала даёт предварительную оценку аппаратуры. Помехи: исключите влияние множества одновременно работающих устройств 2,4/5 ГГц. Поставьте испытуемое устройство и эталонный смартфон в одно место: если оба работают плохо, вероятны помехи; если смартфон работает нормально, вероятна проблема аппаратных параметров. Расстояние: слабый сигнал, например от -70 до -90 по wpa_cli scan/scan_r, может приводить к потере связи; приблизьте устройства для проверки. Совместимость маршрутизатора: испытайте разные марки и модели. Повторяемость: сравните две-три платы, исключая дефект одного экземпляра. Обращение к изготовителю: производитель модуля или Wi-Fi-чипа располагает профессиональными радиоснифферами и может быстро локализовать проблему. Можно также воспроизвести среду в указанном в источнике офисе в Шэньчжэне.

<!-- source:en p52 unit:284 -->

#### 5.2.7 Пропускная способность ниже ожидаемой

<!-- source:en p52 unit:285 -->

Для SDIO интерфейс платформы RK поддерживает частоту до 150M, а протокол — до 208M, поэтому часть потерь производительности обусловлена аппаратурой. Сначала проверьте RF-параметры; при необходимости предоставьте протокол RF и OTA-испытаний антенны. Затем проверьте работу в экранированной комнате либо чистой среде, например подземной парковке, чтобы исключить помехи. Наконец, можно выполнить проверку с фиксированными частотами CPU/DDR.

<!-- source:en p53 unit:286 -->

```text
# DDR
cat /sys/devices/platform/dmc/devfreq/dmc/available_frequencies
echo userspace > /sys/devices/platform/dmc/devfreq/dmc/governor
echo 1560000000 > /sys/devices/platform/dmc/devfreq/dmc/min_freq
cat /sys/devices/platform/dmc/devfreq/dmc/cur_freq

# CPU
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors
echo userspace > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
echo 1992000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq

# Move the dw-mmc interrupt to another CPU core for verification

#References:
#For switching CPU core interrupt verification.
cat /proc/interrupts to view the corresponding interrupt number
echo 5 > /proc/irq/38/smp_affinity_list // Move the interrupt to CPU core 2 for
execution
cat /proc/interrupts // Check the count
```

<!-- source:en p53 unit:287 -->

#### 5.2.8 Проблемы IP

<!-- source:en p53 unit:288 -->

Если не удаётся получить IP-адрес или возникают конфликты адресов, проверьте работу dhcpcd либо udhcpc. dhcpcd — более полный DHCP-клиент, используемый SDK по умолчанию и запускаемый вместе с системой. udhcpcd — облегчённый DHCP-клиент busybox. Не запускайте оба процесса одновременно; используйте только один!

<!-- source:en p53 unit:289 -->

#### 5.2.9 Неправильное пробуждение из сна

<!-- source:en p53 unit:290 -->

Если после перехода в сон Wi-Fi часто пробуждает устройство, исключите следующие причины: выключается тактирование 32,768 кГц модуля; WIFI_REG_ON переходит в низкий уровень; аппаратно нестабилен WIFI_WAKE_HOST и дрожит уровень (обычно низкий, срабатывание при высоком); модуль AP/CY не выполняет указанные ниже команды фильтрации широковещательных и групповых пакетов до и после сна Wi-Fi:

<!-- source:en p53 unit:291 -->

```text
# Execute before sleep:
dhd_priv setsuspendmode 1
# Execute after wake-up:
dhd_priv setsuspendmode 0
```

<!-- source:en p54 unit:292 -->

#### 5.2.10 PING не проходит или часто имеет большую задержку

<!-- source:en p54 unit:293 -->

Не измерены RF-параметры/антенна; вероятно, Wi-Fi выполняет сканирование, увеличивающее задержку ping; межсетевой экран маршрутизатора или ПК может блокировать ping.

<!-- source:en p54 unit:294 -->

#### 5.2.11 Пользовательские изменения заказчика

<!-- source:en p54 unit:295 -->

Если вы изменяли код драйвера, обязательно сообщите об этом сопровождающей стороне. Нередко необычные проблемы оказываются следствием изменения заказчиком настроек драйверов Wi-Fi/BT.

<!-- source:en p54 unit:296 -->

#### 5.2.12 wlan0 работает, но не находит ни одной точки доступа

<!-- source:en p54 unit:297 -->

Проверьте соответствие кварца требованиям чипа: например, вместо требуемых 24M установлен 37M. Также проверьте точность 32,768 кГц.

<!-- source:en p54 unit:298 -->

#### 5.2.13 Сбой Wi-Fi Icomm-semi

<!-- source:en p54 unit:299 -->

На RV1109/1126 SDIO обнаруживался, но возникали ошибки чтения/записи. Было опробовано следующее изменение:

<!-- source:en p54 unit:300 -->

```text
&sdio {
 //rockchip,default-sample-phase = <90>; # Remove this configuration option
}
```

<!-- source:en p54 unit:301 -->

#### 5.2.14 Проблемы iPhone

<!-- source:en p54 unit:302 -->

Проблема: после подключения iOS к точке доступа сеть примерно через 10 секунд отключается и автоматически подключается снова. Решение: DHCP-аренда iOS сохраняется во временном файле и теряется при перезагрузке. При назначении адресов через dnsmasq укажите в команде запуска -l, --dhcp-leasefile=&lt;path&gt;; путь должен сохраняться после отключения питания.

<!-- source:en p54 unit:303 -->

#### 5.2.15 Проблемы модулей AMPAK/Infineon/Azurewave/Synopsys

<!-- source:en p54 unit:304 -->

Распространённые причины: неверная настройка WIFI_REG_ON;

<!-- source:en p54 unit:305 -->

Отсутствует сигнал 32,768 кГц либо он не соответствует требованиям;

<!-- source:en p55 unit:306 -->

WIFI_WAKE_HOST: неверно настроен вывод либо уровень, из-за чего не проходит инициализация или поток dhd_dpc сильно загружает CPU; см. настройку DTS.

<!-- source:en p55 unit:307 -->

```text
/* Pin control configuration for WIFI_WAKE_HOST */
wireless-wlan {
    /omit-if-no-ref/
    wifi_wake_host: wifi-wake-host {
        /* Note that the Wi-Fi wake host pin is typically triggered by a high
level,
         * so it should be configured as pulled down here by default; if the
customer's
         * hardware design is inverse, it should be changed to pulled up, in any
case,
         * it should be initialized to a state opposite to the trigger level.
         */
        rockchip,pins = <0 RK_PA0 0 &pcfg_pull_down>;
    };
};
```

<!-- source:en p55 unit:308 -->

Во сне отключается сигнал 32,768 кГц либо WIFI_REG_ON; отсутствуют firmware/nvram, и ошибки загрузки файла видны в журнале; драйверы AMPAK (bcmdhd.ko) и Azurewave (cywdhd.ko) не взаимозаменяемы — выбирайте правильный.

<!-- source:en p55 unit:309 -->

#### 5.2.16 PCIe Wi-Fi не обнаруживается

<!-- source:en p55 unit:310 -->

Проверьте все настройки из раздела PCIE Wi-Fi Configuration и обязательно измерьте соответствующие напряжения питания!

<!-- source:en p55 unit:311 -->

### 5.3 Проблемы Bluetooth

<!-- source:en p55 unit:312 -->

При сбое теста Bluetooth или функций BT в rkwifibt-app-test последовательно проверьте следующее. Для Realtek отключите CONFIG_BT_HCIUART=n, см. настройку ядра Bluetooth. Проверьте вывод включения питания DTS BT (BT_RST_N), см. настройку Bluetooth. Для проверки используйте команды:

<!-- source:en p55 unit:313 -->

```text
echo 0 > sys/class/rfkill/rfkill0/state # Pull down BT_REG_ON, measure the
corresponding PIN with a multimeter
echo 0 > /proc/bluetooth/sleep/btwrite

echo 1 > sys/class/rfkill/rfkill0/state # Pull up BT_REG_ON, measure the
corresponding PIN with a multimeter
echo 1 > /proc/bluetooth/sleep/btwrite
```

<!-- source:en p56 unit:314 -->

Неверная настройка UART — см. 2.2.2/2.4.2/2.5. Realtek требует rtk_hciattach / hci_uart.ko / rtk_btusb.ko; проверьте правильность сборки и настройки ядра, см. разделы

<!-- source:en p56 unit:315 -->

2.5/3.3;

<!-- source:en p56 unit:316 -->

```text
# Initialize Bluetooth, only for UART module use
/usr/bin/rtk_hciattach

# Check if the kernel's CONFIG_BT_HCIUART configuration has been removed, and
whether the corresponding ko file has been generated
/usr/lib/modules/hci_uart.ko

# Whether the USB interface has generated the corresponding USB driver
/usr/lib/modules/rtk_btusb.ko
```

<!-- source:en p56 unit:317 -->

Файл firmware/config Bluetooth отсутствует либо не соответствует модели модуля, см. 3.3;

<!-- source:en p56 unit:318 -->

```text
# AMPAK Azurewave module, for example: AP6212A: The corresponding file is
bcm43438a1.hcd
/system(vendor)/etc/firmware/BCMxxxx.hcd

# RTL SDIO interface RTL8723DS corresponding file
/lib/firmware/rtlbt/rtl8723d_fw
/lib/firmware/rtlbt/rtl8723d_config

# RTL USB interface RTL8821CU corresponding file
/lib/firmware/rtl8821cu_fw
/lib/firmware/rtl8821cu_config
```

<!-- source:en p56 unit:319 -->

Неверное аппаратное подключение BT UART RTS/CTS нарушает обнаружение при инициализации.

<!-- source:en p56 unit:320 -->

```text
# AMPAK, Azurewave module, all 4 lines must be connected to the main control
host tx  - controller rx
host rx  - controller tx
host rts - controller cts
host cts - controller rts

# Realtek module
# For COB chips that directly use Realtek Bluetooth: The hardware wiring of
the UART interface is as follows:
host tx  - controller rx
host rx  - controller tx
host rts - controller cts
host cts - ground # The main control cts should be grounded

# For the RTL8822C chip, which is special, all 4 lines must be connected to
the main control
host tx  - controller rx
host rx  - controller tx
host rts - controller cts
host cts - controller rts
```

<!-- source:en p57 unit:321 -->

```text
# For modules, the module factory generally internally grounds the controller
rts, so there is no need for the main control to ground it, just connect it
directly to the controller
# rts; Pay special attention: Realtek has a large number of agents, and each
module may be different, so it is necessary to confirm with the module
factory, if
# the controller rts is not grounded, then the main control needs to ground
it.
host tx  - controller rx
host rx  - controller tx
host rts - controller cts
host cts - controller rts
```

<!-- source:en p57 unit:322 -->

## 6. Перенос новых модулей Wi-Fi/BT и обновление драйверов

<!-- source:en p57 unit:323 -->

Особое внимание: обязательно изучите правила хранения файлов и сборки из главы 3 — это принципиально важно для переноса. При обновлении драйвера некоторые последующие шаги можно пропустить в зависимости от ситуации.

<!-- source:en p57 unit:324 -->

### 6.1 Модуль Realtek

<!-- source:en p57 unit:325 -->

#### 6.1.1 Часть Wi-Fi

<!-- source:en p57 unit:326 -->

Пример RTL8821CS: получите у производителя модуля или чипа пакет переноса, например 20171225_RTL8821CS_WiFi_linux_v5.2.18_25830_BT_ANDROID_UART_COEX_8821CS-B1d1d_COEX20170908-1f1f. Для драйвера Wi-Fi перейдите в WiFi\RTL8821CS_WiFi_linux_v5.2.18_25830_COEX20170908-1f1f.20171225\driver. Добавьте настройку сборки: скопируйте драйвер в drivers/net/wireless/rockchip_wlan/, переименуйте каталог в rtl8821cs, дополните Makefile/Kconfig. При обновлении существующего драйвера этот шаг не нужен.

<!-- source:en p57 unit:327 -->

```text
drivers/net/wireless/rockchip_wlan/Makefile
+ obj-$(CONFIG_RTL8821CS) += rtl8821cs/

drivers/net/wireless/rockchip_wlan/Kconfig
+ source "drivers/net/wireless/rockchip_wlan/rtl8821cs/Kconfig"
```

<!-- source:en p57 unit:328 -->

Изменение Makefile

<!-- source:en p58 unit:329 -->

```text
# Change to RK platform:
CONFIG_PLATFORM_I386_PC = n
CONFIG_PLATFORM_ARM_RK3188 = y

# RK platform needs to remove the following configuration:
ifeq ($(CONFIG_PLATFORM_ARM_RK3188), y)
-EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC # Remove this configuration if it
exists
# Modify the ko name to be consistent with the BR2_PACKAGE_RKWIFIBT_WIFI_KO
configuration in the following Buildroot config.in!
MODULE_NAME := 8821cs

# If there is a need for Wi-Fi sleep to maintain connection (WOWLAN), enable the
following configurations:
CONFIG_WOWLAN = y
CONFIG_GPIO_WAKEUP = y
```

<!-- source:en p58 unit:330 -->

Если требуется WOWLAN, добавьте функцию получения IRQ для вывода WL_HOST_WAKE.

<!-- source:en p58 unit:331 -->

```text
# Modify platform\platform_ops.c
+#include <linux/rfkill-wlan.h>
+extern unsigned int oob_irq;
int platform_wifi_power_on(void)
{
    int ret = 0;

+    oob_irq = rockchip_wifi_get_oob_irq();   // This corresponds to the
WIFI_WAKE_HOST PIN in the dts

    return ret;
}
```

<!-- source:en p58 unit:332 -->

Требование пользовательского MAC-адреса

<!-- source:en p58 unit:333 -->

```text
# Modify: core\rtw_ieee80211.c
+include <linux/rfkill-wlan.h> // Add header file
# Find the rtw_macaddr_cfg function
void rtw_macaddr_cfg(u8 *out, const u8 *hw_mac_addr)
-/* Use the mac address stored in the Efuse */
-if (hw_mac_addr) {
-    rtw_memcpy(mac, hw_mac_addr, ETH_ALEN);
-    goto err_chk;
-}

+ /* Use the mac address stored in the Efuse */
+ if (hw_mac_addr) {
+     _rtw_memcpy(mac, hw_mac_addr, ETH_ALEN);
+ }

+ if (!rockchip_wifi_mac_addr(mac)) {
+     printk("get mac address from flash=[%02x:%02x:%02x:%02x:%02x:%02x]\n",
mac[0], mac[1],
+         mac[2], mac[3], mac[4], mac[5]);
```

<!-- source:en p59 unit:334 -->

```text
+     }
+ }
```

<!-- source:en p59 unit:335 -->

Добавление точки загрузки драйвера

<!-- source:en p59 unit:336 -->

```text
/* SDIO Interface: os_dep\linux\sdio_intf.c */
/* USB Interface: os_dep\linux\usb_intf.c */
/* PCIE Interface: os_dep\linux\pci_intf.c */

// At the end of this file, add the following code:
#include "rtw_version.h"
#include <linux/rfkill-wlan.h>
extern int get_wifi_chip_type(void);
extern int rockchip_wifi_power(int on);
extern int rockchip_wifi_set_carddetect(int val);

int rockchip_wifi_init_module_rtkwifi(void)
{
    rockchip_wifi_power(1);
    rockchip_wifi_set_carddetect(1);
    return rtw_drv_entry();
}

void rockchip_wifi_exit_module_rtkwifi(void)
{
    rtw_drv_halt();
    rockchip_wifi_set_carddetect(0);
    rockchip_wifi_power(0);
}

// For KO mode
module_init(rockchip_wifi_init_module_rtkwifi);
module_exit(rockchip_wifi_exit_module_rtkwifi);

// Comment out the following, and make sure to remove the __init __exit entries
for the two functions below
//module_init(rtw_drv_entry);
//module_exit(rtw_drv_halt);
```

<!-- source:en p59 unit:337 -->

Обработка возможных ошибок сборки

<!-- source:en p59 unit:338 -->

```text
rtl8xxx\os_dep\linux\rtw_android.c // Comment out the following two lines
#if (LINUX_VERSION_CODE >= KERNEL_VERSION(2, 6, 39)) ||
defined(COMPAT_KERNEL_RELEASE)
void *wifi_get_country_code(char *ccode)
{
    RTW_INFO("%s\n", __FUNCTION__);
    if (!ccode)
        return NULL;
-    if (wifi_control_data && wifi_control_data->get_country_code)
-        return wifi_control_data->get_country_code(ccode);
    return NULL;
}
#endif /* (LINUX_VERSION_CODE >= KERNEL_VERSION(2, 6, 39)) */
```

<!-- source:en p60 unit:339 -->

#### 6.1.2 Часть Bluetooth BT

<!-- source:en p60 unit:340 -->

Интерфейс UART: если модуль поддерживает Bluetooth, получите у производителя программный пакет следующего вида:

<!-- source:en p60 unit:341 -->

```text
20201130_ANDROID_BT_DRIVER_RTL8822C_COEX_v1c1c.tar.xx
```

<!-- source:en p60 unit:342 -->

На примере RTL8821CS (при обновлении драйвера достаточно заменить соответствующие файлы):

<!-- source:en p60 unit:343 -->

```text
# Place or update the Bluetooth firmware and configuration files in the following
directory:
ls external/rkwifibt/realtek/
# The structure is as follows:
external/rkwifibt/realtek/RTL8821CS # Create a new directory if it does not exist
├── rtl8821cs_config
└── rtl8821cs_fw

# Note: The name of the RTL8821CS directory must match the configuration in the
Buildroot rkwifibt Config.in:
# BR2_PACKAGE_RKWIFIBT_"RTL8821CS"
```

<!-- source:en p60 unit:344 -->

Интерфейс USB: для USB Bluetooth производитель предоставляет подобный пакет переноса; пример RTL8821CU:

<!-- source:en p60 unit:345 -->

```text
# tree
Linux_BT_USB_v3.10_20190430_8821CU_BTCOEX_20190509-4139.tar.xx
or
20201130_ANDROID_BT_DRIVER_RTL8821CU_COEX_v1c1c.tar.xx
|-8821CU                  # Firmware file
|-bluetooth_usb_driver    # USB driver

# Copy or update to the external/rkwifibt/realtek/ directory, the result is as
follows:
# external/rkwifibt/realtek$ tree
├── RTL8821CU
│   ├── rtl8821cu_config   # Bluetooth config
│   └── rtl8821cu_fw    # Bluetooth firmware
├── bluetooth_usb_driver   # RTL8821CU Bluetooth USB driver, compiled into
rtk_btusb.ko
    ├── Makefile
    ├── rtk_bt.c
    ├── rtk_bt.h
    ├── rtk_coex.c
    ├── rtk_coex.h
    ├── rtk_misc.c
    └── rtk_misc.h
```

<!-- source:en p61 unit:346 -->

### 6.2 Модуль AMPAK

<!-- source:en p61 unit:347 -->

Пример AP6256: запросите у производителя модуля пакет прошивок Wi-Fi и BT для AP6256; при обновлении достаточно заменить соответствующие файлы.

<!-- source:en p61 unit:348 -->

```text
external\rkwifibt\firmware\broadcom//Create a folder named AP6256 in this
directory and store the files as follows:
external/rkwifibt/firmware/broadcom/AP6256$ tree
├── bt
│   └── BCM4345C5.hcd
└── wifi
    ├── fw_bcm43456c5_ag.bin
    ├── fw_bcm43456c5_ag_mfg.bin
    └── nvram_ap6256.txt
//Note the name of the AP6256 directory should match the configuration in the
following wifi Config.in: BR2_PACKAGE_RKWIFIBT_AP6256
```

<!-- source:en p61 unit:349 -->

Драйвер ядра изменять не нужно: он в основном совместим со всеми AP-модулями. По умолчанию используется CONFIG_AP6XXX.

<!-- source:en p61 unit:350 -->

### 6.3 Перенос стороннего драйвера Wi-Fi

<!-- source:en p61 unit:351 -->

Для модуля, не поддерживаемого SDK, используйте следующие указания. Настройка DTS по разделу 2.2: WIFI_REG_ON — вывод питания модуля; WIFI_WAKE_HOST — вывод пробуждения главного контроллера модулем Wi-Fi (необязательный, обычно у Broadcom/Realtek). Конфигурацию GPIO разбирает net/rfkill/rfkill-wlan.c ядра, предоставляя драйверу Wi-Fi следующие интерфейсы:

<!-- source:en p61 unit:352 -->

```text
/* SDIO card detection function */
int rockchip_wifi_set_carddetect(int val)

/* Wi-Fi driver to obtain the GPIO pin for the wake-up interrupt of the host
controller, optional */
int rockchip_wifi_get_oob_irq(void)
/* The trigger level of the interrupt, used in conjunction with the above API */
int rockchip_wifi_get_oob_irq_flag(void)

/* Wi-Fi power on and off functions */
int rockchip_wifi_power(int on)
```

<!-- source:en p61 unit:353 -->

Драйвер Wi-Fi вызывает указанные интерфейсы по необходимости. Для сборки драйвера укажите каталог ядра и соответствующий компилятор RK:

<!-- source:en p62 unit:354 -->

```text
# The variable names below should be modified according to the actual situation:
diff --git a/Makefile b/Makefile
index 649da3c..d0b128d 100644
--- a/Makefile
+++ b/Makefile

+KDIR=/home/rk/kernel/
+ARCH=arm or arm64
+CROSS_COMPILE=SDK/prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-
x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-
```

<!-- source:en p62 unit:355 -->

## 7. Распространённые функции и настройка

<!-- source:en p62 unit:356 -->

Инструкции

<!-- source:en p62 unit:357 -->

### 7.1 Инструкции по адаптации Wi-Fi/BT для Debian и других сторонних систем

<!-- source:en p62 unit:359 -->

Debian/Kylin/UOS уже имеют полноценные приложения Wi-Fi/BT верхнего уровня: NetworkManager/blumeman/gnome-bluetooth. Нужно лишь инициализировать интерфейсы до запуска системы: ifconfig должен показывать wlan0, а hciconfig — hci0. Конфигурация DTS/ядра Wi-Fi/BT универсальна и не зависит от дистрибутива; используйте раздел 2. Далее описана инициализация интерфейсов. В Yocto и подобных Buildroot системах необходимо включить стеки wpa_supplicant/bluez для соответствующих функций Wi-Fi/Bluetooth.

<!-- source:en p62 unit:360 -->

```text
# After compilation, binaries such as bluetoothd/bluetoothctl/hciconfig will be
generated
$ bluetoothd -ndC &    # Start bluetoothd
$ bluetoothctl    # Enter interactive mode
[bluetooth]# power on
[bluetooth]# scan on
[bluetooth]# help  # View more commands
```

<!-- source:en p62 unit:361 -->

Утилиты приложений и сборку см. в документации соответствующей системы.

<!-- source:en p62 unit:362 -->

#### 7.1.1 Пример адаптации модуля AMPAK

<!-- source:en p62 unit:363 -->

```text
### Example with AP6275P, obtain the three files from the AMPAK module
manufacturer
```

<!-- source:en p63 unit:364 -->

```text
# Bluetooth Initialization File: brcm_patchram_plus1.c, compile it with the
system's compiler into an executable file brcm_patchram_plus1 and place it into
the system
external/rkwifibt/brcm_tools/brcm_patchram_plus1.c # If there is RKSDK, it can be
obtained from this directory

# BT firmware file: Store according to the actual system requirements, no special
requirements, the following brcm_patchram_plus1 Bluetooth initialization program
will require specifying the firmware path;
BCM4362A2.hcd

# Wi-Fi firmware file: Store according to the actual system requirements
clm_bcm43752a2_pcie_ag.blob
fw_bcm43752a2_pcie_ag.bin
fw_bcm43752a2_pcie_ag_apsta.bin
nvram_AP6275P.txt

### Configuration
# Check the kernel Wi-Fi configuration and enable the following configurations:
CONFIG_WL_ROCKCHIP=y
CONFIG_WIFI_BUILD_MODULE=y
CONFIG_BCMDHD=y
CONFIG_AP6XXX=m
CONFIG_BCMDHD_PCIE=y #PCIE interface, mutually exclusive with SDIO, do not
configure if not PCIE
CONFIG_BCMDHD_SDIO=y #SDIO interface, mutually exclusive with PCIE

### Wi-Fi Interface Initialization
# After compiling with make, a ko file will be generated, store this file
according to your actual needs and load the Wi-Fi by opening this ko;
drivers/net/wireless/rockchip_wlan/rkwifi/bcmdhd/bcmdhd.ko

# Enable Wi-Fi: Load the ko first, and specify the firmware/nvram path when
insmod, change xx_path to the actual path used:
insmod /ko_path/bcmdhd.ko firmware_path=/fw_path/ nvram_path=/nvram_path/
ifconfig -a    #Normally, you can see wlan0, if not, refer to Chapter 2 and
Chapter 7 for troubleshooting

### Bluetooth Interface Initialization
# To enable Bluetooth, reset the BT power first:
echo 0 > /sys/class/rfkill/rfkill0/state   #Turn off BT power, equivalent to
rfkill block operation
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 0.2
echo 1 > /sys/class/rfkill/rfkill0/state   #Turn on BT power, equivalent to
rfkill unblock operation
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 0.2
# Initialize Bluetooth command, --patchram specifies the path of the Bluetooth
firmware file (modify according to the actual situation), /dev/ttyS8 is the
corresponding hardware serial port (modify according to the actual situation)
brcm_patchram_plus1 --bd_addr_rand --enable_hci --no2bytes --
use_baudrate_for_download --tosleep 200000 --baudrate 1500000 --patchram
/system/etc/firmware/BCM4362A2.hcd /dev/ttyS8 &
# If the system has installed the bluez protocol stack, use the hciconfig
command, you can see the hci0 node
```

<!-- source:en p64 unit:365 -->

```text
hciconfig -a

# Disable Bluetooth
echo 0 > /sys/class/rfkill/rfkill0/state   #Turn off BT power, equivalent to
rfkill block operation
echo 0 > /proc/bluetooth/sleep/btwrite

# Be sure to kill the brcm_patchram_plus1 process, because it will be executed
again when turned on, otherwise it will conflict;
killall brcm_patchram_plus1

# The above enable/disable operations should be ported to your system according
to the actual situation;

# Note: If the application layer turns on/off Bluetooth by calling rfkill block
to turn off Bluetooth power, then when unblocking to turn on Bluetooth power
again, you must execute the brcm_patchram_plus1 Bluetooth initialization command
again, otherwise Bluetooth cannot be used; if the upper layer is only hciconfig
hci0 down/up, there is no need to call the repeated initialization;
```

<!-- source:en p64 unit:366 -->

#### 7.1.2 Пример адаптации модуля Realtek

<!-- source:en p64 unit:367 -->

Адаптация Wi-Fi: на примере RTL8822CS сначала получите у производителя пакет драйверов соответствующего модуля.

<!-- source:en p64 unit:368 -->

```text
# For Wi-Fi: RTL8822CS_WiFi_linux_v5.12.1.5-1-g0e1519e_COEX20210504-2323.20210527
# For BT: 20201202_LINUX_BT_DRIVER_RTL8822C_COEX_v1c1c

### Wi-Fi Adaptation
# Refer to Section 8.1 for porting the Wi-Fi driver to the RK platform, and refer
to Section 2 for basic dts and kernel configuration
# After compiling with make, a ko file will be generated. Place this file
according to your actual needs and load the Wi-Fi with this ko file;
drivers/net/wireless/rockchip_wlan/rkwifi/rtl8822cs/8822cs.ko

# Realtek does not require firmware/nvram files, the timing of insmod execution
should be adjusted according to the system requirements;
insmod /ko_path/88xxxx.ko
# Normally, you should see wlan0, if not, refer to Section 2 and Section 7 for
troubleshooting
ifconfig -a

### Bluetooth Adaptation
# fw/config file explanation:
# Only Bluetooth requires fw/config files (found in the driver package), and the
storage location is related to the interface
# For RTL UART interface, the corresponding file for RTL8822CS should be placed
in the following location
/lib/firmware/rtlbt/rtl8822cs_fw
/lib/firmware/rtlbt/rtl8822cs_config
# Copy the correct FW file and config file to the correct path. (Copy the
firmware/config file)
```

<!-- source:en p65 unit:369 -->

```text
$ sudo mkdir -p /lib/firmware/rtlbt/
$ sudo cp rtkbt-firmware/lib/firmware/rtlbt/rtl8xxxx_fw /lib/firmware/rtlbt/
$ sudo cp rtkbt-firmware/lib/firmware/rtlbt/rtl8xxxx_config /lib/firmware/rtlbt/

# For RTL USB interface, the corresponding file for RTL8822CU (copy the
corresponding fw/config files to the system's corresponding location)
/lib/firmware/rtl8822cu_fw
/lib/firmware/rtl8822cu_config
# Copy the correct FW file and config file to the correct path.
$ sudo cp rtkbt-firmware/lib/firmware/rtl8xxxxx_fw /lib/firmware/
$ sudo cp rtkbt-firmware/lib/firmware/rtl8xxxxx_config /lib/firmware/

# rtk_hciattach/hci_uart/usb.ko file explanation

# hci_uart/usb.ko file explanation, Realtek does not use the built-in interface
driver of the kernel, the kernel must first remove the following two
configurations:
CONFIG_BT_HCIBTUSB
CONFIG_BT_HCIUART

### Initialization Instructions
# UART Interface:
killall rtk_hciattach # First, make sure to stop this process if it was
previously started (if applicable)
echo 0 > /sys/class/rfkill/rfkill0/state # Power off
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 0.5
echo 1 > /sys/class/rfkill/rfkill0/state # Power on
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 0.5
insmod /usr/lib/modules/hci_uart.ko    # Realtek module requires loading the uart
driver
rtk_hciattach -n -s 115200 /dev/ttyS4 rtk_h5 & # ttySX refers to which uart port
the Bluetooth is using

# If the system has the bluez protocol stack installed, use the hciconfig command
hciconfig -a # Normally, you should see the hci0 node, if not, refer to Section 2
and Section 7 for troubleshooting

# USB Interface:
echo 0 > /sys/class/rfkill/rfkill0/state # Power off
echo 0 > /proc/bluetooth/sleep/btwrite
sleep 0.5
echo 1 > /sys/class/rfkill/rfkill0/state # Power on
echo 1 > /proc/bluetooth/sleep/btwrite
sleep 0.5
insmod /usr/lib/modules/rtk_btusb.ko   # Realtek module requires loading the usb
driver
# If the system has the bluez protocol stack installed, use the hciconfig
command, and you should normally see hci0
hciconfig -a
```

<!-- source:en p65 unit:370 -->

Сборка драйвера Bluetooth и rtk_hciattach

<!-- source:en p66 unit:371 -->

```text
### Realtek UART/USB Bluetooth Driver ko Driver Compilation:
$ make -C /home/rk/rk3xxx/kernel/
 CROSS_COMPILE=/home/rk/rk3xxx/prebuilts/gcc/linux-x86/aarch64/gcc-arm-10.3-
2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- ARCH=arm64
M=/home/rk/rk3xxx/usb(uart)/bluetooth_usb(uart)_driver/
# -C specifies the kernel directory
# CROSS_COMPILE specifies the path to the cross-compiler toolchain
# ARCH specifies the system platform
# M specifies the path to the uart/usb driver
# Note that the paths must be absolute
# After a successful compilation,

# rtk_hciattach UART Initialization Program Compilation:
$ make CROSS_COMPILE=/home/rk/rk3xxx/prebuilts/gcc/linux-x86/aarch64/gcc-arm-
10.3-2021.07-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu- -C
/home/rk/rk3xxx/uart/rtk_hciattach/
# -C specifies the kernel directory
# CROSS_COMPILE specifies the path to the cross-compiler toolchain
```

<!-- source:en p66 unit:372 -->

#### 7.1.3 Автоматическая интеграция необходимых файлов

<!-- source:en p66 unit:373 -->

Описанная адаптация выполняется ручной сборкой или копированием. После отладки упростите автоматическую установку. Для коммерческих систем, например UOS/Kylin/UnionTech, применяйте собственные методы поставщика и обратитесь к нему за инструкциями. Для свободной Debian: способ 1 — создайте deb-пакет перечисленных файлов для установки; документация по пакетам и установке: https://www.debian.org/doc/. Способ 2 — непосредственно измените сценарий упаковки Debian платформы RK.

<!-- source:en p66 unit:374 -->

```text
#Debian version
debian/mk-rootfs-bullseye.sh
or
debian/mk-rootfs-buster.sh

#Create the relevant directories
sudo mkdir -p $TARGET_ROOTFS_DIR/system/lib/modules/
sudo mkdir -p $TARGET_ROOTFS_DIR/lib/firmware/rtl/
#Copy the relevant binaries
sudo cp /actual bin directory/rtk_hcixxx or brcmxxx
$TARGET_ROOTFS_DIR/usr/bin/
#Copy the ko file
sudo cp /actual ko directory/wifi.ko $TARGET_ROOTFS_DIR/system/lib/modules/
#Copy the firmware
sudo cp /actual firmware directory/fwXXX
$TARGET_ROOTFS_DIR/vendor/etc/firmware/

#Finally, repackage
```

<!-- source:en p67 unit:375 -->

Для Yocto/Buildroot-подобных систем используйте правила и методы сборки соответствующей системы.

<!-- source:en p67 unit:376 -->

### 7.2 Клиент DHCP

<!-- source:en p67 unit:377 -->

SDK по умолчанию использует dhcpcd — полноценный DHCP-клиент, запускаемый вместе с системой. udhcpc — облегчённый клиент busybox. Не включайте оба процесса одновременно; используйте только один! Для ускорения получения IP через dhcpcd внесите следующие изменения:

<!-- source:en p67 unit:378 -->

```text
# Modify the S41dhcpcd file
index a2e87ca054..f8b924ab0f 100755
/buildroot/package/dhcpcd/S41dhcpcd
@@ -13,7 +13,7 @@ PIDFILE=/var/run/dhcpcd.pid
 case "$1" in
    start)
        echo "Starting dhcpcd..."
-        start-stop-daemon -S -x "$DAEMON" -p "$PIDFILE" -- -f "$CONFIG"
+        start-stop-daemon -S -x "$DAEMON" -p "$PIDFILE" -- -AL -f "$CONFIG"
        ;;

// Rebuild the firmware
make dhcpcd-dirclean
make dhcpcd-rebuild
```

<!-- source:en p67 unit:379 -->

### 7.3 MAC-адрес Wi-Fi/BT

<!-- source:en p67 unit:380 -->

Обычно MAC-адрес Wi-Fi/BT встроен в чип. Если нужен собственный адрес, запишите его специальной утилитой RK в пользовательский раздел vendor флеш-памяти; процедура описана в отдельной документации и здесь не рассматривается. Для Azurewave Wi-Fi измените Makefile, добавив следующую конфигурацию:

<!-- source:en p67 unit:381 -->

```text
+ -DGET_CUSTOM_MAC_ENABLE
- -DGET_OTP_MAC_ENABLE
```

<!-- source:en p67 unit:382 -->

### 7.4 Коды стран Wi-Fi

<!-- source:en p67 unit:383 -->

Realtek: измените Makefile драйвера, добавив следующую строку в параметры сборки платформы.

<!-- source:en p68 unit:384 -->

```text
+++ b/drivers/net/wireless/rockchip_wlan/rtlxxx/Makefile
@@ -1270,6 +1270,7 @@ EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN -
DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFO
 # default setting for Android 4.1, 4.2, 4.3, 4.4
 EXTRA_CFLAGS += -DCONFIG_IOCTL_CFG80211 -DRTW_USE_CFG80211_STA_EVENT
 EXTRA_CFLAGS += -DCONFIG_CONCURRENT_MODE
+EXTRA_CFLAGS += -DCONFIG_RTW_IOCTL_SET_COUNTRY
 # default setting for Power control
 #EXTRA_CFLAGS += -DRTW_ENABLE_WIFI_CONTROL_FUNC
 #EXTRA_CFLAGS += -DRTW_SUPPORT_PLATFORM_SHUTDOWN
```

<!-- source:en p68 unit:385 -->

Через proc: echo X > /proc/net/rtlxxx/wlan0/country_code, например echo CN > /proc/net/rtlxxx/wlan0/country_code. В wpa_supplicant.conf задайте country=X; для softap в hostapd.conf — country_code=X. Код X можно найти, например, на https://countrycode.org/: используйте ISO CODES из двух заглавных букв. AMPAK/Azurewave: dhd_priv country XX.

<!-- source:en p68 unit:386 -->

### 7.5 Динамическая загрузка и выгрузка Wi-Fi в KO-режиме

<!-- source:en p68 unit:387 -->

При сборке Wi-Fi как KO для многократной загрузки/выгрузки примените следующее исправление для ядра 4.19:

<!-- source:en p68 unit:388 -->

```text
--- a/arch/arm64/boot/dts/rockchip/rk3xxx.dts
+++ b/arch/arm64/boot/dts/rockchip/rk3xxx.dts
@@ -112,6 +112,7 @@
    wireless-wlan {
        rockchip,grf = <&grf>;
        wifi_chip_type = "ap6354";
        sdio_vref = <1800>;
+        WIFI,poweren_gpio = <&gpio1 18 GPIO_ACTIVE_HIGH>; //Configure the
corresponding PIN for WIFI_REG_ON
        WIFI,host_wake_irq = <&gpio1 19 GPIO_ACTIVE_HIGH>;
        status = "okay";
    };

sdio_pwrseq: sdio-pwrseq {
+    status = "disabled"; //Disable this node
};

&sdio { //Remove the following two configurations
    disable-wp;
    keep-power-in-suspend;
    max-frequency = <150000000>;
-    mmc-pwrseq = <&sdio_pwrseq>;
-    non-removable;
    num-slots = <1>;
```

<!-- source:en p69 unit:389 -->

```text
}

diff --git a/drivers/mmc/host/dw_mmc.c b/drivers/mmc/host/dw_mmc.c
index 8730e2e..04b9cb8 100644
--- a/drivers/mmc/host/dw_mmc.c
+++ b/drivers/mmc/host/dw_mmc.c
@@ -1518,6 +1518,9 @@ static int dw_mci_get_cd(struct mmc_host *mmc)
    struct dw_mci *host = slot->host;
    int gpio_cd = mmc_gpio_get_cd(mmc);
+   if (mmc->restrict_caps & RESTRICT_CARD_TYPE_SDIO)
+        return test_bit(DW_MMC_CARD_PRESENT, &slot->flags);
+
    /* Use platform get_cd function, else try onboard card detect */
    if ((brd->quirks & DW_MCI_QUIRK_BROKEN_CARD_DETECTION) ||
        (mmc->caps & MMC_CAP_NONREMOVABLE))
@@ -2755,6 +2758,9 @@ static int dw_mci_init_slot(struct dw_mci *host, unsigned
int id)
    dw_mci_get_cd(mmc);
+    if (mmc->restrict_caps & RESTRICT_CARD_TYPE_SDIO)
+        clear_bit(DW_MMC_CARD_PRESENT, &slot->flags);
+
    ret = mmc_add_host(mmc);
    if (ret)
        goto err_host_allocated;

--- a/drivers/mmc/core/sdio.c
+++ b/drivers/mmc/core/sdio.c
@@ -996,9 +996,7 @@ static int mmc_sdio_resume(struct mmc_host *host)
        }

        /* No need to reinitialize powered-resumed nonremovable cards */
-        if (mmc_card_is_removable(host) || !mmc_card_keep_power(host)) {
-            err = mmc_sdio_reinit_card(host, mmc_card_keep_power(host));
-        } else if (mmc_card_keep_power(host) && mmc_card_wake_sdio_irq(host)) {
+        if (mmc_card_keep_power(host) && mmc_card_wake_sdio_irq(host)) {
            /* We may have switched to 1-bit mode during suspend */
            err = sdio_enable_4bit_bus(host->card);
        }
```

<!-- source:en p69 unit:390 -->

### 7.6 Порядок диагностики сети

<!-- source:en p69 unit:391 -->

#### 7.6.1 Перегрузка сети или недостаточная скорость

<!-- source:en p69 unit:392 -->

```text
1. Ethernet: Replace the Ethernet cable to confirm
2. Use tcpdump to capture packets to confirm packet loss
3. If it's UDP+RTP, you can use the RTP sequence number to confirm
4. If there is no packet loss, it may be due to the application layer not
receiving packets in time, causing packet loss. You can use netstat to check the
TCP/IP layer buffer data situation to confirm
netstat -n -t -u
5. Disable gro to confirm
ethtool -K eth0 gro off
```

<!-- source:en p70 unit:393 -->

```text
ethtool -S eth0/wlan0
6. Increase CPU frequency to the highest to confirm
echo "performance" > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
7. Confirm the size of the TCP/IP cache buffer, the unit is bytes. The size of
the receive buffer area, the buffer that stores data received from the other end,
which will later be read by the application
echo "524288 1048576 2097152" > /proc/sys/net/ipv4/tcp_rmem
echo 2097152 > /proc/sys/net/core/rmem_max
echo 2097152 > /proc/sys/net/core/rmem_default
8. Use busybox ifconfig to check for packet loss statistics
9. Video playback: TCP packet loss causes stuttering, UDP packet loss causes
screen tearing
10. For Wi-Fi or Ethernet UDP packet loss rate anomalies, the following
modifications can be made for verification:
Note: The maximum cache used for data transmission for each socket (unit: bytes).
After HRTIMER is turned on, the CPU is frequently interrupted by the timer, which
is equivalent to the UDP transmission slowing down, and the buffer will not
overflow (you can see that it is interrupted by the timer 3-4 times every 1ms)
echo 12582912 > /proc/sys/net/core/wmem_max   #Change to 12M
echo 2097152 > /proc/sys/net/core/wmem_default  #Change to 2M

echo 1048576 > /proc/sys/net/core/rmem_max

11. netdev_max_backlog indicates the backlog of the network card device. Because
the network card receives data packets at a speed much faster than the kernel can
process these data packets, a backlog of the network card device occurs.
echo 65535 >  /proc/sys/net/core/netdev_max_backlog

12. Apply network parameters for high data performance.
echo 327680 > /proc/sys/net/core/rmem_default
echo 8388608 > /proc/sys/net/core/rmem_max
echo 327680 > /proc/sys/net/core/wmem_default
echo 8388608  /proc/sys/net/core/wmem_max

echo 20480 > /proc/sys/net/core/optmem_max
echo 10000 > /proc/sys/net/core/netdev_max_backlog
echo "2097152 4194304 8388608" > /proc/sys/net/ipv4/tcp_rmem
echo "262144 524288 8388608" > /proc/sys/net/ipv4/tcp_wmem
echo "44259 59012 88518" > /proc/sys/net/ipv4/tcp_mem
echo "88518 118025 177036" > /proc/sys/net/ipv4/udp_mem
```

<!-- source:en p70 unit:394 -->

#### 7.6.2 Простая проверка времени обработки пакетов сетевым стеком

<!-- source:en p70 unit:395 -->

Напишите стандартную сетевую echo-программу и захватите пакеты tcpdump. По двум жёлтым отметкам на рисунке ниже можно вычислить время обработки пакетов стеком.

<!-- source:en p71 unit:396 -->

![Wi-Fi / BT](/docs/rockchip-linux-wifi-bt/assets/en-p071-figure-01.png)

<!-- source:en p71 unit:397 -->

### 7.7 Обновление wpa_supplicant/hostapd

<!-- source:en p71 unit:398 -->

```text
# The current version of the SDK is 2.6, which addresses the WPA2 key
reinstallation vulnerability
# Patch details and address:
# https://w1.fi/security/2017-1/wpa-packet-number-reuse-with-replayed-
messages.txt

# If you need to update to a newer version, follow these steps:
# Go to the official GitHub website and find the Buildroot repository, then
navigate to the following directory:
https://github.com/buildroot/buildroot/tree/master/package/
... ...
# Locate the directories for wpa_supplicant and hostapd, and download them to
your local machine:
wpa_supplicant
hostapd
... ...

# Navigate to the SDK directory:
# RK3XXX_SDK: buildroot/package/
# Replace the existing wpa_supplicant and hostapd directories with the new
versions you downloaded earlier;

# Compilation and update method:
make wpa_supplicant-dirclean && make wpa_supplicant
make hostapd-dirclean && make hostapd
./build.sh rootfs
```

<!-- source:en p72 unit:399 -->

### 7.8 Отладочные настройки драйверов и приложений

<!-- source:en p72 unit:400 -->

#### 7.8.1 Захват пакетов TCPDUMP

<!-- source:en p72 unit:401 -->

Для диагностики сетевых приложений иногда требуется захват пакетов. Включите соответствующую конфигурацию, соберите tcpdump и используйте следующие команды:

<!-- source:en p72 unit:402 -->

```text
Select the appropriate configuration for Buildroot BR2_PACKAGE_TCPDUMP
tcpdump -h
tcpdump -i wlan0 -w /data/xxxx.pcap
```

<!-- source:en p72 unit:403 -->

#### 7.8.2 Отладка wpa_supplicant

<!-- source:en p72 unit:404 -->

Иногда проблемы wpa_supplicant необходимо исследовать по его журналам.

<!-- source:en p72 unit:405 -->

```text
Open the following configuration in Buildroot
Remember to save the configuration with make savedefconfig
+ BR2_PACKAGE_WPA_SUPPLICANT_DEBUG_SYSLOG

# Rebuild
make wpa_supplicant-dirclean
make wpa_supplicant-rebuild

When starting wpa_supplicant, add the -s parameter so that the logs are output to
the /var/log/messages file
-s = log output to syslog instead of stdout

-d to print more logs
-d = increase debugging verbosity (-dd for even more)

Since wpa logs are extensive and the messages file is quite small, you can modify
the following configuration to increase the file size
buildroot/package/busybox/S01logging
SYSLOGD_ARGS=-n
Change to
SYSLOGD_ARGS="-n -s 8192"

Rebuild busybox
make busybox-dirclean
make busybox-rebuild

Finally, repackage
./build.sh

Start wpa_supplicant and add -s -d and other debug options
wpa_supplicant -B -i wlan0 -c /xxx/wpa_supplicant.conf -s -ddd
```

<!-- source:en p73 unit:406 -->

## 8. Wi-Fi в IPC SDK серии RV

<!-- source:en p73 unit:407 -->

### 8.1 Инструкции по настройке

<!-- source:en p73 unit:408 -->

Настройка системы: для Wi-Fi измените конфигурацию по инструкции настройки и сборки IPC SDK в каталоге doc SDK RV1106/1103. Ниже предполагается BoardConfig-EMMC-NONE-EVB1_V10-IPC.mk:

<!-- source:en p73 unit:409 -->

```text
# project/cfg$
BoardConfig-EMMC-NONE-EVB1_V10-IPC.mk

# Kernel defconfig fragment
# rv1106-xxx.config is the default configuration for the selected configuration,
which determines the type of Wi-Fi interface. Depending on the type, add the
following configurations:
# For USB interface Wi-Fi, add the following configuration: rv1106-usbwifi.config
+export RK_KERNEL_DEFCONFIG_FRAGMENT="rv1106-xxx.config rv1106-usbwifi.config"
# For SDIO interface Wi-Fi, add the following configuration: rv1106-
sdiowifi.config
+export RK_KERNEL_DEFCONFIG_FRAGMENT="rv1106-xxx.config rv1106-sdiowifi.config"

# Enable Wi-Fi functionality, support for
SSV6X5X/RTL8189FS/RTL8188FTV/ATBM603X/ATBM6441/HI3861L
+export RK_ENABLE_WIFI_CHIP="RTL8189FS"
+export RK_ENABLE_WIFI=y
```

<!-- source:en p73 unit:410 -->

DTS: см. раздел настройки DTS. USB-модули обычно постоянно запитаны и не требуют управления питанием; у SDIO обычно есть WL_REG_ON (имя зависит от модуля), для которого в DTS указывается GPIO. В ядре особенно важно включить CONFIG_RFKILL=y и CONFIG_RFKILL_RK=y. Сборка: выполните ./build.sh; будут созданы KO Wi-Fi и программы wpa_supplicant/wpa_cli. Пути в работающей системе: /oem/usr/ko/wifi_xxx.ko, /usr/bin/wpa_supplicant, /usr/bin/wpa_cli.

<!-- source:en p74 unit:411 -->

### 8.2 Файлы, относящиеся к Wi-Fi

<!-- source:en p74 unit:412 -->

Каталог исходного кода драйвера Wi-Fi:

<!-- source:en p74 unit:413 -->

```text
# ls sysdrv/drv_ko/wifi/
hichannel        # Hisilicon Hi3861L, Low Power Wi-Fi
rtl8188ftv       # Realtek RTL8188FU USB
rtl8189fs        # Realtek RTL8189FS/FTV SDIO
ssv6x5x          # SSV6155P USB
atbm             # ATBM620x SDIO
atbm6441         # ATBM6441 Low Power WiFi SDIO
insmod_wifi.sh   # Driver ko loading script
```

<!-- source:en p74 unit:414 -->

Поддерживаются RTL8188FU/8189FS, Hi3861L, SSV6155P, ATBM6XX, ATBM6441 и другие. Каталог исходного кода wpa_supplicant:

<!-- source:en p74 unit:415 -->

```text
#wpa_supplicant
wpa_supplicant-2.6

# Default configuration file
wpa_supplicant.conf
```

<!-- source:en p74 unit:416 -->

В SDK включён сценарий сетевой инициализации insmod_wifi.sh. Он определяет модель по VID:PID и автоматически загружает соответствующий драйвер Wi-Fi с зависимостями:

<!-- source:en p74 unit:417 -->

```text
#!/bin/sh

#hi3861L (Low Power Wi-Fi, refer to the Low Power section)
cat /sys/bus/sdio/devices/*/uevent | grep "0296:5347"
if [ $? -eq 0 ];then
   insmod $(pwd)/hichannel.ko
   sleep 0.5
   vlink_hichannel_main &
fi

#rtl8189fs
cat /sys/bus/sdio/devices/*/uevent | grep "024C:F179"
if [ $? -eq 0 ];then
   insmod $(pwd)/8189fs.ko
fi

#usb wi-Fi
echo 1 > /sys/devices/platform/ff3e0000.usb2-phy/otg_mode
sleep 0.8

#rtl18188fu
cat /sys/bus/usb/devices/*/uevent | grep "bda/f179"
if [ $? -eq 0 ];then
   insmod $(pwd)/8188fu.ko
fi
```

<!-- source:en p75 unit:418 -->

```text
#ssv6x5x
cat /sys/bus/usb/devices/*/uevent | grep "8065/6000"
if [ $? -eq 0 ];then
   insmod $(pwd)/cfg80211.ko
   insmod $(pwd)/libarc4.ko
   insmod $(pwd)/mac80211.ko
   insmod $(pwd)/ctr.ko
   insmod $(pwd)/ccm.ko
   insmod $(pwd)/libaes.ko
   insmod $(pwd)/aes_generic.ko
   insmod $(pwd)/ssv6x5x.ko
fi
```

<!-- source:en p75 unit:419 -->

Драйвер Wi-Fi icomm-semi требует загрузки соответствующих cfg/mac80211-драйверов.

<!-- source:en p75 unit:420 -->

### 8.3 Разработка приложений

<!-- source:en p75 unit:421 -->

Штатное демоприложение RK упрощает разработку Wi-Fi; находится в project/app/wifi_app/wifi/. Демо служит лишь справочным примером; для стабильного серийного продукта доработайте его, добавляя и удаляя необходимые функции. Использование:

<!-- source:en p75 unit:422 -->

```text
# First, check if the rkwifi_server is running using the 'ps' command. If it's
not running, you must start the background service first.
# rkwifi_server start &

# Start the client
# rkwifi_server -h
[Usage]:
        "rkwifi_server close"
        "rkwifi_server scan"
        "rkwifi_server connect ssid password"
        "rkwifi_server disconnect"
        "rkwifi_server getinfo"
        "rkwifi_server deepsleep [ONLY LOW POWER]"
        "rkwifi_server reconnect ssid"
        "rkwifi_server forget ssid"
        "rkwifi_server getSavedInfo"
        "rkwifi_server cancel"
        "rkwifi_server reset"
        "rkwifi_server onoff_test"
        "rkwifi_server ap_cfg"
        "rkwifi_server ap_cfg_clr"
        "rkwifi_server setpir <0/1> = disable/enable PIR"
        "rkwifi_server ota"
        "rkwifi_server start_kp <ip:port:expire>"
        "rkwifi_server stop_kp"
```

<!-- source:en p76 unit:423 -->

### 8.4 Перенос сторонних приложений

<!-- source:en p76 unit:424 -->

Подробные инструкции см. в документации IPC SDK.

<!-- source:en p76 unit:425 -->

### 8.5 Перенос нового драйвера

<!-- source:en p76 unit:426 -->

Если SDK ещё не поддерживает нужный Wi-Fi, выполните перенос следующим образом. На примере altobeam ATBM6301 сначала скопируйте предоставленный производителем исходный драйвер atbm в sysdrv/drv_ko/wifi/ SDK:

<!-- source:en p76 unit:427 -->

```text
ls sysdrv\drv_ko\wifi
atbm
```

<!-- source:en p76 unit:428 -->

Затем измените Makefile драйвера, главным образом три переменные окружения системы:

<!-- source:en p76 unit:429 -->

```text
ARCH=$(ARCH)   // RV1106 is 32-bit
CROSS_COMPILE=$(CROSS_COMPILE)   // Cross-compiler toolchain
$(KERNEL_DIR) // Kernel directory
```

<!-- source:en p76 unit:430 -->

Найдите и измените соответствующие строки makefile:

<!-- source:en p76 unit:431 -->

```text
install:
    @echo "make PLATFORM_CROSS=$(platform)"
-    $(MAKE) ARCH=$(ARCH) CROSS_COMPILE=$(CROSS_COMPILE) -C $(KERNEL_DIR)
M=$(shell pwd) modules -j12
+    $(MAKE) all -f $(MAKEFILE_SUB) ARCH=$(ARCH)  CROSS_COMPILE=$(CROSS_COMPILE)
KDIR=$(KERNEL_DIR) SYS=$(sys) PLAT=$(platform) -j8
+  # Strip ko is to reduce ko size
+    $(CROSS_COMPILE)strip --strip-debug $(shell pwd)/driver_install/atbm603x_.ko
+   # Copy to the out directory, the system will automatically copy it to the
oem/usr/ko/ directory
+    cp $(shell pwd)/driver_install/atbm603x_.ko $(M_OUT_DIR)
```

<!-- source:en p76 unit:432 -->

Производитель должен предоставить драйвер Wi-Fi с поддержкой ядра 5.10! В конце дополните insmod_wifi.sh нужными insmod-командами по образцу других проектов в этом файле.

<!-- source:en p76 unit:433 -->

### 8.6 Диагностика и RF-испытания

<!-- source:en p76 unit:434 -->

См. предыдущие разделы диагностики Wi-Fi/BT и RF-параметров. Для RF-испытаний производитель чипа или модуля должен предоставить методику и тестовую программу. Предпочтителен статически скомпонованный исполняемый файл, иначе программа может не запускаться. В этом случае передайте производителю набор кросс-компиляции SDK arm-rockchip830-linux-uclibcgnueabihf-

<!-- source:en p77 unit:435 -->

для повторной сборки тестовой программы.

<!-- source:en p77 unit:436 -->

## 9. Разработка малопотребляющего Wi-Fi серии RV

<!-- source:en p77 unit:437 -->

Подробная документация: https://docs.qq.com/doc/p/ad70d285112c58d5aa09b08eb2d93cf96d85c591

<!-- source:en p77 unit:438 -->

## 10. Разработка приложений

<!-- source:en p77 unit:439 -->

Следующая библиотека скрывает сложные низкоуровневые операции Wi-Fi/BT, включая wpa_supplicant/bluez/bsa, и предоставляет удобный интерфейс приложений. Она рассчитана на штатную Buildroot. В Debian/Kylin/UOS уже есть полноценные приложения Wi-Fi/BT верхнего уровня, поэтому этот интерфейс не нужен. Руководство по разработке и проверке RKWIFIBT-APP: https://docs.qq.com/doc/p/a9dd00348639929fc080d20dbbdc4feea89c4983

### Ссылки источника

- [https://elixir.bootlin.com/linux/latest/source/Documentation/devicetree/bindings/mmc/mmc-pwrseq-simple.yaml](https://elixir.bootlin.com/linux/latest/source/Documentation/devicetree/bindings/mmc/mmc-pwrseq-simple.yaml)

- [https://elixir.bootlin.com/linux/latest/source/Documentation/devicetree/bindings/net/broadcom-bluetooth.yaml](https://elixir.bootlin.com/linux/latest/source/Documentation/devicetree/bindings/net/broadcom-bluetooth.yaml)

- [https://iperf.fr/iperf-doc.php](https://iperf.fr/iperf-doc.php)

- [https://fasterdata.es.net/performance-testing/network-troubleshooting-tools/iperf/](https://fasterdata.es.net/performance-testing/network-troubleshooting-tools/iperf/)

- [https://www.debian.org/doc/](https://www.debian.org/doc/)

- [https://countrycode.org/](https://countrycode.org/)

- [https://docs.qq.com/doc/p/ad70d285112c58d5aa09b08eb2d93cf96d85c591](https://docs.qq.com/doc/p/ad70d285112c58d5aa09b08eb2d93cf96d85c591)

- [https://docs.qq.com/doc/p/a9dd00348639929fc080d20dbbdc4feea89c4983](https://docs.qq.com/doc/p/a9dd00348639929fc080d20dbbdc4feea89c4983)

- [https://redmine.rock-chips.com/documents/59](https://redmine.rock-chips.com/documents/59)

- [http://www.rockchip.com.cn/](http://www.rockchip.com.cn/)

{% endraw %}
