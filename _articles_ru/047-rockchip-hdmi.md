---
title: "Полное руководство Rockchip HDMI: DRM, PHY, HDCP, Android и диагностика"
description: "Полное руководство Rockchip HDMI: DRM, PHY, HDCP, Android и диагностика"
translation_key: "047-rockchip-hdmi"
slug: "047-rockchip-hdmi"
lang: "ru"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["HDMI", "Rockchip", "DRM", "HDCP", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip HDMI DRM PHY HDCP Android RK3588 RK3576"
excerpt: "Полное руководство Rockchip HDMI: DRM, PHY, HDCP, Android и диагностика"
---

{% raw %}

# Полное руководство Rockchip HDMI: DRM, PHY, HDCP, Android и диагностика

Это справочное руководство Rockchip HDMI на основе китайского PDF V1.2.0 (50 страниц); английский оригинал не предоставлен. Английская и русская статьи — полные переводы, во всех языках используются рисунки китайского PDF с локализованными описаниями. Таблица оригинала перечисляет RK322X/RK3328/RK3368/RK3399/RK3288/RK3528/RK356X/RK3588 и Linux 6.1/5.10/4.19/4.4;Текст также описывает RK3576. Общая таблица не подтверждает любую комбинацию SoC и ядра. Для ArmSoM проверьте разводку и доступность HDMI, SDK/BSP, драйвер ядра, PHY и версии Android/HWC. Проверка на оборудовании ArmSoM не проводилась. Измерение I2C 50kHz, производительность 4K UI, журналы и диагностика сертификации взяты из оригинала, а не испытаний ArmSoM.

[Редакционные замечания](/docs/rockchip-hdmi/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. HDMI на платформах Rockchip

Возможности HDMI различных платформ Rockchip приведены ниже:

| Функция | RK3288 | RK3368 | RK322X | RK3328 | RK3399 | RK3528 | RK356X | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Максимальное выходное разрешение | 3840x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 7680x4320p60 | 4096x2160p120 |
| Чересстрочный режим | N | N | Y | Y | Y | Y | Y | Y | Y |
| Цветовые форматы 4K60/50Hz | RGB YCbCr444 YCbCr422 YCbCr420(только RK3288W) | YCbCr420 | YCbCr420 | YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 |
| Поддержка глубины 10 бит | Y | N | Y | Y | Y | Y | Y | Y | Y |
| Версия HDMI | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.1 | HDMI 2.1 |

DRM:

DRM (Direct Rendering Manager) — компонент DRI (Direct Rendering Infrastructure). В ядрах Linux 4.4 и новее используется DRM. Пути драйверов HDMI:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-Rockchip.c
kernel/drivers/gpu/drm/rockchip/inno_hdmi.c

kernel/drivers/gpu/drm/bridge/synopsys/
```

## 2. HDMI в инфраструктуре DRM

### 2.1 Программная конфигурация HDMI

#### 2.1.1 Включение HDMI

Для включения HDMI добавьте:

```text
&hdmi {
   status = "okay";

};
```

#### 2.1.2 Привязка VOP

На платформах Rockchip данные изображения для интерфейсов HDMI, DP, CVBS и других поступают из VOP:

![Техническая иллюстрация китайского оригинала, p. 5](/docs/rockchip-hdmi/assets/cn-p5-1.png)

Платформы с двумя VOP, например RK3288 и RK3399, имеют VOPB (4K) и VOPL (только 2K). Их можно привязать к двум интерфейсам отображения и поменять назначения местами. Каждый интерфейс привязывается только к одному VOP:

![Техническая иллюстрация китайского оригинала, p. 6](/docs/rockchip-hdmi/assets/cn-p6-1.png)

При включении узла дисплея в DTS включаются оба порта интерфейса — VOPB и VOPL. Неиспользуемый порт необходимо отключить. Например, при привязке HDMI к VOPB добавьте:

```text
&hdmi_in_vopl {
   status = "disabled";
};
```

И наоборот, при привязке HDMI к VOPL добавьте:

```text
&hdmi_in_vopb {
   status = "disabled";
};
```

На платформах с единственным VOP этот шаг не требуется.

Начиная с VOP2 платформа содержит один VOP с несколькими выходами VP (Video Port), а не несколько VOP.

Пути от VOP к HDMI на RK356X показаны ниже:

![Техническая иллюстрация китайского оригинала, p. 6](/docs/rockchip-hdmi/assets/cn-p6-2.png)

HDMI можно привязать к VP0 или VP1. Для вывода 4K рекомендуется VP0:

```text
&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};
```

Пути от VOP к HDMI на RK3588 показаны ниже:

![Техническая иллюстрация китайского оригинала, p. 7](/docs/rockchip-hdmi/assets/cn-p7-1.png)

RK3588 имеет два HDMITX с одинаковыми характеристиками. Каждый можно привязать к VP0, VP1 или VP2.

Если достаточно вывода до 4K включительно, рекомендуется привязать HDMI0 и HDMI1 к VP0 и VP1 соответственно:

```text
&hdmi0_in_vp0 {
   status = "okay";
};


&hdmi0_in_vp1 {
   status = "disabled";
};

&hdmi0_in_vp2 {
   status = "disabled";
};

&hdmi1_in_vp1 {
   status = "okay";
};
&hdmi1_in_vp0 {
   status = "disabled";
};


&hdmi1_in_vp2 {
   status = "disabled";
};
```

Для вывода 8K на RK3588 необходимо объединить VP0 и VP1. В DTS интерфейс HDMI, выводящий 8K, необходимо привязать к VP0. Пример HDMI0:

```text
&hdmi0_in_vp0 {
   status = "okay";
};


&hdmi0_in_vp1 {
   status = "disabled";
};

&hdmi0_in_vp2 {
   status = "disabled";
};
```

Также установите VOP ACLK в 800M. Оригинал ссылается на §3.1.4 — устаревшую ссылку; настройка частоты находится в §2.1.4.

HDMI и eDP на RK3588 используют общий COMBPHY. Для HDMI0 и eDP0 узел hdptxphy_hdmi0 в DTS соответствует HDMI PHY, а hdptxphy0 — eDP PHY:

```text
hdptxphy0: phy@fed60000 {
   compatible = "rockchip,rk3588-hdptx-phy";

   reg = <0x0 0xfed60000 0x0 0x2000>;
   clocks = <&cru CLK_USB2PHY_HDPTXRXPHY_REF>, <&cru PCLK_HDPTX0>;
   clock-names = "ref", "apb";
   resets = <&cru SRST_P_HDPTX0>, <&cru SRST_HDPTX0_INIT>,
      <&cru SRST_HDPTX0_CMN>, <&cru SRST_HDPTX0_LANE>;
   reset-names = "apb", "init", "cmn", "lane";
   rockchip,grf = <&hdptxphy0_grf>;
   #phy-cells = <0>;
   status = "disabled";
};

hdptxphy_hdmi0: hdmiphy@fed60000 {
   compatible = "rockchip,rk3588-hdptx-phy-hdmi";

   reg = <0x0 0xfed60000 0x0 0x2000>;
   clocks = <&cru CLK_USB2PHY_HDPTXRXPHY_REF>, <&cru PCLK_HDPTX0>;
   clock-names = "ref", "apb";
   clock-output-names = "clk_hdmiphy_pixel0";
   #clock-cells = <0>;
   resets = <&cru SRST_HDPTX0>, <&cru SRST_P_HDPTX0>,
      <&cru SRST_HDPTX0_INIT>, <&cru SRST_HDPTX0_CMN>,
      <&cru SRST_HDPTX0_LANE>, <&cru SRST_HDPTX0_ROPLL>,
      <&cru SRST_HDPTX0_LCPLL>;
   reset-names = "phy", "apb", "init", "cmn", "lane", "ropll",
          "lcpll";
   rockchip,grf = <&hdptxphy0_grf>;
   #phy-cells = <0>;
   status = "disabled";
};
```

Поэтому при использовании HDMI необходимо отключить соответствующие eDP и eDP PHY. Пример HDMI0:

```text
&hdmi0 {
   status = "okay";
};


&hdptxphy_hdmi0 {
   status = "okay";
};

&edp0 {
   status = "disabled";
};

&hdptxphy0 {
   status = "disabled";
};
```

#### 2.1.3 Включение загрузочного логотипа

Если логотип U-Boot отключён, ядро также не сможет показать загрузочный логотип: изображение появится только после запуска системы и приложений. Для включения логотипа U-Boot активируйте route_hdmi в DTS:

```text
&route_hdmi {
   status = "okay";

};
```

На платформах с двумя VOP значение connect ниже должно указывать VOP, привязанный к HDMI, иначе возможно искажение изображения. Оригинал ссылается на §3.1.2; соответствующий раздел привязки здесь — §2.1.2.

```text
route_hdmi: route-hdmi {
   status = "disabled";
   logo,uboot = "logo.bmp";

   logo,kernel = "logo_kernel.bmp";
   logo,mode = "center";
   charge_logo,mode = "center";
   connect = <&vopb_out_hdmi>;
};
```

#### 2.1.4 Привязка VOP dclk к PLL

Для dclk VOP/VP, привязанного к HDMI, необходимо указать источник PLL. HDMI на RK322X, RK3328 и RK3528 привязан к фиксированным VOP/VP и всегда использует HDMI PHY PLL как источник dclk; дополнительная настройка не нужна.

##### 2.1.4.1 Привязка PLL на RK3288

Для dclk VOPB/VOPL на RK3288 доступны GPLL и CPLL. Они не поддерживают дробное деление, поэтому HDMI RK3288 выводит только стандартные разрешения с частотой, полученной целочисленным делением 594M, например 4K60, 1080P60 и 720P60. Пример привязки VOPB dclk к GPLL и VOPL dclk к CPLL:

```text
&vopb {
      assigned-clocks = <&cru DCLK_VOP0>;
      assigned-clock-parents = <&cru PLL_GPLL>;

};

&vopl {
      assigned-clocks = <&cru DCLK_VOP1>;
      assigned-clock-parents = <&cru PLL_CPLL>;
};
```

##### 2.1.4.2 Привязка PLL на RK3399

На RK3399 dclk VOP, используемого HDMI, необходимо привязать к VPLL. Для двух дисплеев dclk другого VOP привязывают к CPLL. Это позволяет получать произвольные частоты dclk и независимые разрешения. Конфигурация при привязке HDMI к VOPB:

```text
&vopb {
   assigned-clocks = <&cru DCLK_VOP0_DIV>;
   assigned-clock-parents = <&cru PLL_VPLL>;

};
&vopl {
   assigned-clocks = <&cru DCLK_VOP1_DIV>;
   assigned-clock-parents = <&cru PLL_CPLL>;
}；
```

При привязке HDMI к VOPL:

```text
&vopb {
   assigned-clocks = <&cru DCLK_VOP0_DIV>;

   assigned-clock-parents = <&cru PLL_CPLL>;
};
&vopl {
   assigned-clocks = <&cru DCLK_VOP1_DIV>;
   assigned-clock-parents = <&cru PLL_VPLL>;
};
```

##### 2.1.4.3 Привязка PLL на RK356X

На RK356X dclk VP, привязанного к HDMI, должен использовать HPLL. Пример VP0:

```text
&vop {
      status = "okay";
      assigned-clocks = <&cru DCLK_VOP0>;

      assigned-clock-parents = <&pmucru PLL_HPLL>;
};
```

##### 2.1.4.4 Привязка PLL на RK3588/RK3576

Для вывода выше 4K60 на RK3588 установите VOP ACLK в 800MHz:

```text
&vop {
      assigned-clocks = <&cru ACLK_VOP>;
      assigned-clock-rates = <800000000>;

      status = "okay";
};
```

VOP ACLK на RK3576 не требует отдельной настройки.

HDMI0/1 на RK3588 можно привязать к VP0/1/2, как описано в §2.1.2. Источниками их dclk могут быть GPLL, HDMI0 PHY PLL, HDMI1 PHY PLL или V0PLL.

Правила распределения и ограничения приведены в §10.11 документа Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

Для нестандартных разрешений на RK3588/RK3576 источником VOP dclk необходимо назначить PHY PLL.

Конфигурация DTS для RK3588:

```text
&display_subsystem {
   clocks = <&hdptxphy_hdmi_clk0>, <&hdptxphy_hdmi_clk1>;

   clock-names = "hdmi0_phy_pll", "hdmi1_phy_pll";
};

&hdptxphy_hdmi_clk0 {
   status = "okay";
};

&hdptxphy_hdmi_clk1 {
   status = "okay";
};
```

Конфигурация DTS для RK3576:

```text
&display_subsystem {
   clocks = <&hdptxphy_hdmi>;
   clock-names = "hdmi0_phy_pll";

};
```

Чтобы проверить применение назначений частот из DTS, выполните cat /sys/kernel/debug/clk/clk_summary.

Например, при привязке VP0 dclk к HDMI0 PHY PLL узел dclk_vop0 в дереве частот находится под clk_hdmiphy_pixel0:

```text
xin24m                    26    28     0   24000000     0
  0 50000
  clk_usbdpphy_mipidcpphy_ref 2  2     0   24000000     0

  0 50000
  clk_usb2phy_hdptxrxphy_ref 11 11     0   24000000     0
  0 50000
    clk_hdmiphy_pixel0    2      3     0  594000000     0
  0 50000
      dclk_vop0           2      4     0  594000000     0
  0 50000
```

#### 2.1.5 Включение HDCP на RK3288/RK3399/RK3528/RK356X

##### 2.1.5.1 Включение HDCP 1.4

```text
&hdmi {
   hdcp1x-enable = <1>;

}
```

После включения HDCP 1.4 запишите соответствующий ключ инструментом из каталога RKTools в SDK. Инструмент может различаться для версий Android; уточните его у FAE и прочитайте README. Ключ заказчик должен самостоятельно получить у Digital Content Protection LLC.

Следующий узел включает или отключает HDCP:

```text
echo 1 > /sys/class/misc/hdmi_hdcp1x/enable
```

1 включает HDCP, 0 отключает.

После включения HDCP проверьте работу следующими способами:

Считайте состояние HDCP из следующего узла:

```text
cat /sys/class/misc/hdmi_hdcp1x/status
```

Значения состояния означают:

| Значение узла status | Описание |
| --- | --- |
| hdcp disable | HDCP отключён. |
| hdcp_auth_start | Аутентификация HDCP начата. |
| hdcp_auth_success | Аутентификация успешна; начинается передача зашифрованного видео. |
| hdcp_auth_fail | Ошибка аутентификации HDCP |

Проверьте телевизор без поддержки HDCP 1.4 и телевизор с поддержкой. В оригинале признаком работы HDCP считается розовый экран на неподдерживаемом телевизоре при нормальном изображении на поддерживаемом после включения HDCP.

##### 2.1.5.2 Включение HDCP 2.2

RK3288/RK3399/RK3528/RK356X поддерживают HDCP 2.2 в DRM. Сначала необходимо обеспечить корректную работу HDCP 1.4. Включение HDCP 2.2:

Получите у FAE инструмент упаковки ключей HDCP 2.2 и пакет патчей. Упакуйте ключ и примените патчи по README.

Пересоберите и прошейте образ, затем включите или отключите HDCP 2.2 через:

```text
echo 1 > /sys/class/misc/hdcp2_node/enable
```

После включения проверьте HDCP 2.2 следующими способами:

Проверьте телевизор без поддержки HDCP 2.2 и телевизор с поддержкой. В оригинале признаком работы HDCP считается белый экран на неподдерживаемом телевизоре и нормальное изображение на поддерживаемом после включения.

Считайте состояние HDCP 2.2 из:

```text
cat /sys/class/misc/hdcp2_node/status
```

| Значение status | Описание |
| --- | --- |
| hdcp2 auth sucess | Аутентификация успешна. |
| no enable hdcp2 | HDCP 2.2 отключён. |
| hdcp2 no auth | HDMI отключён либо устройство не поддерживает HDCP 2.2. |
| no already auth sucess | Ошибка аутентификации. |

При сбое аутентификации приложите следующий файл журнала к обращению в указанной оригиналом системе Redmine:

```text
/cache/hdcp_tx0.log
```

Либо соберите журналы командой:

```text
logcat -s HDMI_HDCP2
dmesg | grep hdcp
```

#### 2.1.6 Включение HDCP на RK3588/RK3576

RK3588/RK3576 поддерживают HDCP 1.4/2.3. Для включения используются интерфейсы HDCP инфраструктуры DRM; свойства DRM управляют включением и сообщают состояние. Демонстрационный hdcptest.c предоставляется через представителя поставщика. Для отладки можно использовать modetest.

Путь исходного кода modetest в Android:

```text
external/libdrm/tests/modetest/
```

В Linux можно использовать modetest, собранный Buildroot. После сборки rootfs исходный код находится по пути:

```text
buildroot/output/rockchip_rk3588/build/libdrm-2.4.115/testst/modetest/
```

Для проверки HDCP через modetest используются следующие свойства:

```text
Content Protection:
           flags: enum
           enums: Undesired=0 Desired=1 Enabled=2

           value: 2

Undesired：关闭hdcp
Desired：开启hdcp
Enabled：hdcp已经开启并认证成功

hdcp_encrypted:
           flags: range
           values: 0 2
           value: 2

hdcp认证等级：
   0：hdcp未认证。

   1：hdcp1.4。
   2：hdcp2.3。
```

Для включения и отключения HDCP используйте modetest -w. Пример:

```text
modetest -w 423:"Content Protection":1
------->开启hdcp，优先2.3，若电视不⽀持2.3或2.3认证失败，⾃动切换到1.4。


modetest -w 423:"Content Protection":0
------->关闭hdcp。
```

423 — идентификатор HDMI connector. Узнать его можно командой modetest -c:

```text
rk3588_s:/ # modetest -c
trying to open device 'i915'...failed
trying to open device 'amdgpu'...failed

trying to open device 'radeon'...failed
trying to open device 'nouveau'...failed
trying to open device 'vmwgfx'...failed
trying to open device 'omapdrm'...failed
trying to open device 'exynos'...failed
trying to open device 'tilcdc'...failed
trying to open device 'msm'...failed
trying to open device 'sti'...failed
trying to open device 'tegra'...failed
trying to open device 'imx-drm'...failed
trying to open device 'rockchip'...done
Connectors:
id    encoder status   name        size (mm)  modes encoders

423   422  connected   HDMI-A-1    0x0        6     422
 modes:
      name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot)
 1920x1080 60 1920 2008 2052 2200 1080 1084 1089 1125 148500 flags: phsync,
pvsync; type: preferred
 1920x1080 50 1920 2448 2492 2640 1080 1084 1089 1125 148500 flags: phsync,

pvsync; type: driver
 1280x720 60 1280 1390 1430 1650 720 725 730 750 74250 flags: phsync, pvsync;
type: driver
 1280x720 50 1280 1720 1760 1980 720 725 730 750 74250 flags: phsync, pvsync;
type: driver
 720x576 50 720 732 796 864 576 581 586 625 27000 flags: nhsync, nvsync; type:
driver
 720x480 60 720 736 798 858 480 489 495 525 27000 flags: nhsync, nvsync; type:
driver
```

Подробности приведены в Rockchip_RK3588_Developer_Guide_HDCP_CN.pdf.

#### 2.1.7 Настройка скорости DDC I2C

Если при подключении HDMI не удаётся прочитать EDID, попробуйте уменьшить скорость DDC I2C.

```text
[ 163.026743] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.130075] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.233407] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!

[ 163.336741] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440074] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440110] dwhdmi-rockchip fdea0000.hdmi: failed to get edid
```

Скорость I2C регулируется длительностью высокого и низкого уровней тактового сигнала. Следующая конфигурация соответствует 50kHz, измеренным в среде оригинала, а не на оборудовании ArmSoM.

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <9625>;

   ddc-i2c-scl-low-time-ns = <10000>;
}
```

Для изменения скорости пропорционально измените оба значения. Например, для 100kHz:

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <4812>;
   ddc-i2c-scl-low-time-ns = <5000>;

}
```

#### 2.1.8 Настройка уровня сигналов HDMI

Различия разводки плат могут требовать разных уровней управления. Их настройка может помочь при исследовании совместимости с телевизорами.

##### 2.1.8.1 Настройка сигналов RK322X/RK3328/RK3528/RK356X

###### 2.1.8.1.1 Настройка сигналов RK322X

Уровень сигналов HDMI RK322X настраивается свойством rockchip,phy-table в DTS. Формат:

```text
rockchip,phy-table =
     <165000000 0xaa 0x00 0x44 0x44 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0xaa 0x15 0x6a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0xaa 0x15 0x7a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Пример для строки 340000000 в таблице выше:

| Параметр | Описание |
| --- | --- |
| 340000000 | Максимальная частота TMDS для строки. Оригинал также указывает применимость ниже 165MHz, что противоречит 340000000; оба значения сохранены для проверки. |
| 0xaa | data lane0 slew rate: bit[1:0] data lane1 slew rate: bit[3:2] data lane2 slew rate: bit[5:4] clock lane slew rate: bit[7:6] slew rate: регулирует время нарастания/спада; большие значения сокращают его. |
| 0x15 | data lane0 pre-emphasis: bit[1:0] data lane1 pre-emphasis: bit[3:2] data lane2 pre-emphasis: bit[5:4] pre-emphasis: большие значения увеличивают предыскажение. |
| 0x6a | data lane2 swing: bit[3:0] clock lane swing: bit[7:4] swing: большие значения увеличивают амплитуду. |
| 0xaa | data lane0 swing: bit[3:0] data lane1 swing: bit[7:4] swing: большие значения увеличивают амплитуду. |
| Все последующие нулевые значения | Не используются |

###### 2.1.8.1.2 Настройка сигналов RK3328

Уровень сигналов HDMI RK3328 настраивается свойством rockchip,phy-table в DTS. Формат:

```text
rockchip,phy-table =
     <165000000 0x07 0x0a 0x0a 0x0a 0x00 0x00 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>,

     <340000000 0x0b 0x0d 0x0d 0x0d 0x07 0x15 0x08
             0x08 0x08 0x3f 0xac 0xcc 0xcd 0xdd>,
     <594000000 0x10 0x1a 0x1a 0x1a 0x07 0x15 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>;
```

Пример для строки 340000000 в таблице выше:

| Параметр | Описание |
| --- | --- |
| 340000000 | Максимальная частота TMDS для строки. Оригинал также указывает применимость ниже 165MHz, что противоречит 340000000; оба значения сохранены для проверки. |
| 0x0b | clock lane swing swing: большие значения увеличивают амплитуду. |
| 0x0d | data lane2 swing swing: большие значения увеличивают амплитуду. |
| 0x0d | data lane1 swing swing: большие значения увеличивают амплитуду. |
| 0x0d | data lane0 swing swing: большие значения увеличивают амплитуду. |
| 0x07 | data lane0 pre-emphasis mode: bit[0] data lane1 pre-emphasis mode: bit[1] data lane2 pre-emphasis mode: bit[2] pre-emphasis mode:0--full mode 1--half mode |
| 0x15 | data lane0 pre-emphasis level: bit[1:0] data lane1 pre-emphasis level: bit[3:2] data lane2 pre-emphasis level: bit[5:4] pre-emphasis level: большие значения усиливают предыскажение, ноль отключает его. |
| 0x08 | data lane2 pre-emphasis swing: bit[4:0] pre-emphasis swing: большие значения увеличивают амплитуду. |
| 0x08 | data lane1 pre-emphasis swing: bit[4:0] pre-emphasis swing: большие значения увеличивают амплитуду. |
| 0x08 | data lane0 pre-emphasis swing: bit[4:0] pre-emphasis swing: большие значения увеличивают амплитуду. |
| 0x3f | data lane0 pre-emphasis driver path gate: bit[0], main driver path gate: bit[1] data lane1 pre-emphasis driver path gate: bit[2], main driver path gate: bit[3] data lane2 pre-emphasis driver path gate: bit[4], main driver path gate: bit[5] clock lane pre-emphasis driver path gate: bit[6], main driver path gate: bit[7] Запишите 1 для включения пути. |
| 0xac | data lane2 pre-emphasis second delay gate: bit[0], pre-emphasis first delay gate: bit[1] data lane2 main driver second delay gate: bit[2], main driver first delay gate: bit[3] clock lane pre-emphasis second delay gate: bit[4], pre-emphasis first delay gate: bit[5] clock lane main driver second delay gate: bit[6], main driver first delay gate: bit[7] Запишите 1 для включения задержки. |

| Параметр | Описание |
| --- | --- |
| 0xcc | data lane0 pre-emphasis second delay gate: bit[0], pre-emphasis first delay gate: bit[1] data lane0 main driver second delay gate: bit[2], main driver first delay gate: bit[3] data lane1 pre-emphasis second delay gate: bit[4], pre-emphasis first delay gate: bit[5] data lane1 main driver second delay gate: bit[6], main driver first delay gate: bit[7] Запишите 1 для включения задержки. |
| 0xcd | data lane2 delay time: bit[3:0] clock lane delay time: bit[7:4] delay time: большие значения увеличивают задержку. |
| 0xdd | data lane0 delay time: bit[3:0] data lane1 delay time: bit[7:4] delay time: большие значения увеличивают задержку. |

###### 2.1.8.1.3 Настройка сигналов RK3528

Уровень сигналов HDMI RK3528 настраивается свойством rockchip,phy-table в DTS. Формат:

```text
rockchip,phy-table =
     <165000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0x02 0x08 0x0d 0x18 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Пример для строки 340000000 в таблице выше:

| Параметр | Описание |
| --- | --- |
| 340000000 | Максимальная частота TMDS для строки. Оригинал также указывает применимость ниже 165MHz, что противоречит 340000000; оба значения сохранены для проверки. |
| 0x03 | clock lane current bias control: 0x00:320uA 0x0f:920uA шаг 40uA |
| 0x04 | data lane current bias control: 0x00:320uA 0x0f:920uA шаг 40uA |
| 0x0c | clock lane swing: bit[4:0] swing: большие значения увеличивают амплитуду. |
| 0x12 | data lane swing: bit[4:0] ESD event detection threshold: bit[7:5] swing: большие значения увеличивают амплитуду. ESD event detection threshold: большие значения повышают порог. |
| 0x00 | Pre-cursor pre-emphasis:bit[2:0] Post-cursor pre-emphasis:bit[7:4] pre-emphasis: большие значения усиливают предыскажение, ноль отключает его. |
| Все последующие нулевые значения | Не используются |

##### 2.1.8.2 Настройка сигналов RK3288/RK3368/RK3399/RK356X

Уровень сигналов HDMI RK3288/RK3368/RK3399/RK356X настраивается свойством rockchip,phy-table в DTS. Формат:

`<PIXELCLOCK PHY_CKSYMTXCTRL PHY_TXTERM PHY_VLEVCTRL>`.

PIXELCLOCK — максимальная частота пикселей, для которой действует строка.

PHY_CKSYMTXCTRL (регистр 0x09) регулирует предыскажение HDMI и крутизну фронтов. Увеличение предыскажения или sloop boost повышает крутизну нарастания/спада DATA и сокращает время перехода:

Bit[0]: включение CLOCK. Bit[3:1]: предыскажение DATA. Bit[4:5]: sloop boost DATA (обозначение диапазона сохранено по оригиналу).

PHY_TXTERM (регистр 0x19) регулирует сопротивление терминации.

Bit[0:2]: большее значение соответствует большему сопротивлению терминации.

PHY_VLEVCTRL (регистр 0x0e) регулирует амплитуду HDMI. Bit[0:4] задаёт амплитуду tmds_clk +/-: меньшее значение даёт большую амплитуду. Bit[5:9] управляет tmds_data +/- с такой же обратной зависимостью.

Пример:

```text
&hdmi {
rockchip,phy-table =
   <74250000 0x8009 0x0004 0x0272>,

   <165000000 0x802b 0x0004 0x0209>,
   <297000000 0x8039 0x0005 0x028d>,
   <594000000 0x8039 0x0000 0x019d>,
   <000000000 0x0000 0x0000 0x0000>;
};
```

Строка <74250000 0x8009 0x0004 0x0272> действует при частоте пикселей до 74.25MHz (720p): PHY_CKSYMTXCTRL=0x8009, PHY_TXTERM=0x0004 и PHY_VLEVCTRL=0x0272. После изменения проверьте значения регистров командой cat /sys/kernel/debug/dw-hdmi/phy.

#### 2.1.9 Добавление специальных разрешений

##### 2.1.9.1 Добавление таймингов

DRM уже поддерживает большинство таймингов, однако некоторые специальные разрешения, например для повёрнутых HDMI-экранов, могут отсутствовать. Добавьте записи в конец drm_dmt_modes в kernel/drivers/gpu/drm/drm_edid.c:

```text
/* 0x58 - 4096x2160@59.94Hz RB */
{ DRM_MODE("4096x2160", DRM_MODE_TYPE_DRIVER, 556188, 4096, 4104,

     4136, 4176, 0, 2160, 2208, 2216, 2222, 0,
     DRM_MODE_FLAG_PHSYNC | DRM_MODE_FLAG_NVSYNC) },
```

| Параметр | Описание |
| --- | --- |
| "4096x2160" | mode name: hdisplay x vdisplay |
| DRM_MODE_TYPE_DRIVER | mode type: задайте DRM_MODE_TYPE_DRIVER |
| 556188 | Частота пикселей |
| 4096 | Активные пиксели строки |
| 4104 | Начало горизонтальной синхронизации |
| 4136 | Конец горизонтальной синхронизации |
| 4176 | Всего пикселей в строке |
| 0 | hskew, обычно 0 |
| 2160 | Активные строки кадра |
| 2208 | Начало вертикальной синхронизации |
| 2216 | Конец вертикальной синхронизации |
| 2222 | Всего строк в кадре |
| 0 | vscan, обычно 0 |
| vrefresh | Частота кадров дисплея |
| DRM_MODE_FLAG_PHSYNC \| DRM_MODE_FLAG_NVSYNC | Полярность hsync/vsync; flags: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |

Параметры описаны в таблице выше. Оригинал ссылается на §3.2.4 для определения таймингов; ссылка не соответствует нумерации этой редакции и требует проверки.

##### 2.1.9.2 Добавление настроек PLL для RK322X/RK3328/RK3528

Для специальных разрешений RK322X/RK3328/RK3528 также нужны настройки HDMI-PHY-PLL. Оригинал ссылается на §2.1.5.2 для расчёта, но этот раздел посвящён HDCP; ссылка требует уточнения.

При добавлении конфигурации PHY в DRM добавьте строку в таблицу PRE-PLL pre_pll_cfg_table. Таблица POST-PLL post_pll_cfg_table уже охватывает все поддерживаемые PHY разрешения и не требует дополнения. Путь:

```text
kernel/drivers/phy/rockchip/phy-Rockchip-inno-hdmi-phy.c
```

```text
static const struct pre_pll_config pre_pll_cfg_table[] = {
   { 27000000, 27000000, 1, 90, 3, 2, 2, 10, 3, 3, 4, 0, 0},
   { 27000000, 33750000, 1, 90, 1, 3, 3, 10, 3, 3, 4, 0, 0},
   { 40000000, 40000000, 1, 80, 2, 2, 2, 12, 2, 2, 2, 0, 0},
   { 40000000, 50000000, 1, 100, 2, 2, 2, 1, 0, 0, 15, 0, 0},
   { 59341000, 59341000, 1, 98, 3, 1, 2, 1, 3, 3, 4, 0, 0xE6AE6B},

   { 59400000, 59400000, 1, 99, 3, 1, 1, 1, 3, 3, 4, 0, 0},
   { 59341000, 74176250, 1, 98, 0, 3, 3, 1, 3, 3, 4, 0, 0xE6AE6B},
   { 59400000, 74250000, 1, 99, 1, 2, 2, 1, 3, 3, 4, 0, 0},
   { 65000000, 65000000, 1, 130, 2, 2, 2, 1, 0, 0, 12, 0, 0},
   { 65000000, 81250000, 3, 325, 0, 3, 3, 1, 0, 0, 10, 0, 0},
   { 71000000, 71000000, 3, 284, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 71000000, 88750000, 3, 355, 0, 3, 3, 1, 0, 0, 10, 0, 0},
   { 74176000, 74176000, 1, 98, 1, 2, 2, 1, 2, 3, 4, 0, 0xE6AE6B},
   { 74250000, 74250000, 1, 99, 1, 2, 2, 1, 2, 3, 4, 0, 0},
   { 74176000, 92720000, 4, 494, 1, 2, 2, 1, 3, 3, 4, 0, 0x816817},
   { 74250000, 92812500, 4, 495, 1, 2, 2, 1, 3, 3, 4, 0, 0},
   { 83500000, 83500000, 2, 167, 2, 1, 1, 1, 0, 0, 6, 0, 0},

   { 83500000, 104375000, 1, 104, 2, 1, 1, 1, 1, 0, 5, 0, 0x600000},
   { 85750000, 85750000, 3, 343, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 88750000, 88750000, 3, 355, 0, 3, 3, 1, 0, 0, 8, 0, 0},
   { 88750000, 110937500, 1, 110, 2, 1, 1, 1, 1, 0, 5, 0, 0xF00000},
   {108000000, 108000000, 1, 90, 3, 0, 0, 1, 0, 0, 5, 0, 0},
   {108000000, 135000000, 1, 90, 0, 2, 2, 1, 0, 0, 5, 0, 0},
   {119000000, 119000000, 1, 119, 2, 1, 1, 1, 0, 0, 6, 0, 0},
   {119000000, 148750000, 1, 99, 0, 2, 2, 1, 0, 0, 5, 0, 0x2AAAAA},
   {148352000, 148352000, 1, 98, 1, 1, 1, 1, 2, 2, 2, 0, 0xE6AE6B},
   {148500000, 148500000, 1, 99, 1, 1, 1, 1, 2, 2, 2, 0, 0},
   {148352000, 185440000, 4, 494, 0, 2, 2, 1, 3, 2, 2, 0, 0x816817},
   {148500000, 185625000, 4, 495, 0, 2, 2, 1, 3, 2, 2, 0, 0},
   {162000000, 162000000, 1, 108, 0, 2, 2, 1, 0, 0, 4, 0, 0},

   {162000000, 202500000, 1, 135, 0, 2, 2, 1, 0, 0, 5, 0, 0},
   {296703000, 296703000, 1, 98, 0, 1, 1, 1, 0, 2, 2, 0, 0xE6AE6B},
   {297000000, 297000000, 1, 99, 0, 1, 1, 1, 0, 2, 2, 0, 0},
   {296703000, 370878750, 4, 494, 1, 2, 0, 1, 3, 1, 1, 0, 0x816817},
   {297000000, 371250000, 4, 495, 1, 2, 0, 1, 3, 1, 1, 0, 0},
   {593407000, 296703500, 1, 98, 0, 1, 1, 1, 0, 2, 1, 0, 0xE6AE6B},
   {594000000, 297000000, 1, 99, 0, 1, 1, 1, 0, 2, 1, 0, 0},
   {593407000, 370879375, 4, 494, 1, 2, 0, 1, 3, 1, 1, 1, 0x816817},
   {594000000, 371250000, 4, 495, 1, 2, 0, 1, 3, 1, 1, 1, 0},
   {593407000, 593407000, 1, 98, 0, 2, 0, 1, 0, 1, 1, 0, 0xE6AE6B},
   {594000000, 594000000, 1, 99, 0, 2, 0, 1, 0, 1, 1, 0, 0},
   {    ~0UL,  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}

};

static const struct post_pll_config post_pll_cfg_table[] = {
   {33750000, 1, 40, 8, 1},
   {33750000, 1, 80, 8, 2},
   {33750000, 1, 10, 2, 4},
   {74250000, 1, 40, 8, 1},
   {74250000, 18, 80, 8, 2},
   {74250000, 1, 20, 4, 8},
   {148500000, 2, 40, 4, 3},
   {148500000, 1, 10, 2, 8},
   {297000000, 4, 40, 2, 3},
   {297000000, 2, 20, 2, 8},

   {594000000, 8, 40, 1, 3},
   {594000000, 4, 20, 1, 8},
   {    ~0UL, 0, 0, 0, 0}
};
```

Ниже определены struct pre_pll_config и struct post_pll_config. В Linux 4.4/4.19 они фактически разделяют struct ext_pll_config_tab из Linux 3.10.

```text
struct pre_pll_config {
   unsigned long pixclock;

   unsigned long tmdsclock;
   u8 prediv;
   u16 fbdiv;
   u8 tmds_div_a;
   u8 tmds_div_b;
   u8 tmds_div_c;
   u8 pclk_div_a;
   u8 pclk_div_b;
   u8 pclk_div_c;
   u8 pclk_div_d;
   u8 vco_div_5_en;
   u32 fracdiv;
};


struct post_pll_config {
   unsigned long tmdsclock;
   u8 prediv;
   u16 fbdiv;
   u8 postdiv;
   u8 version;
};
```

Параметры pre_pll_config:

| Параметр | Описание |
| --- | --- |
| pixclock | Частота пикселей выходного режима HDMI |
| tmdsclock | Частота TMDS выходного режима HDMI |
| prediv | pre-pll-pre-divider |
| fbdiv | pre-pll-feedback-divider |
| tmds_div_a | tmds-dividera |
| tmds_div_b | tmds-dividerb |
| tmds_div_c | tmds-dividerc |
| pclk_div_a | pclk-dividera |
| pclk_div_b | pclk-dividerb |
| pclk_div_c | pclk-dividerc |
| pclk_div_d | pclk-dividerd |
| vco_div_5_en | Получается ли pin_hd20_pclk непосредственно из VCO / 5; используется для определённых частот |
| fracdiv | pre-pll-fractional-feedback-divider |

Параметры post_pll_config:

| Параметр | Описание |
| --- | --- |
| tmdsclock | Частота TMDS выходного режима HDMI |
| prediv | post-pll-pre-divider |
| fbdiv | post-pll-feedback-divider |
| postdiv | post-pll-post-divider |
| version | Ревизия кристалла: POST-PLL выбирается по частоте и ревизии. 1: RK322X и ранние образцы RK322XH при TMDS &lt;=74.25MHz. 2: серийный RK322XH при TMDS &lt;=74.25MHz. 3: RK322X/RK322XH при TMDS >74.25MHz, одинаковые настройки. 4: отдельные RK322X нестабильны при POST VCO=1080MHz, но стабильны при 270MHz и требуют отдельного выбора. 8: настройки RK3528. |

Для TMDS CLOCK=74.25MHz на серийном RK3328 настройка POST-PLL выбирается следующим образом:

(1) Найдите диапазон TMDS CLOCK в post_pll_cfg_table. Для 74.25MHz условие 33.75MHz < TMDS CLOCK <= 74.25MHz выбирает две записи:

```text
{74250000, 1, 40, 8, 1},
{74250000, 18, 80, 8, 2},
```

(2) Выберите по ревизии кристалла. Для серийного RK3328 при TMDS CLOCK <= 74.25MHz выбирается version=2:

```text
{74250000, 18, 80, 8, 2},
```

(3) Итоговые значения: prediv=18, fbdiv=80, postdiv=8. В драйвере Linux 3.10 им соответствуют ppll_nd, ppll_nf и ppll_no в struct ext_pll_config_tab. Поскольку используется серийный RK3328 и TMDS CLOCK <= 74.25MHz, запись добавляется в RK322XH_V1_PLL_TABLE.

##### 2.1.9.3 Добавление настроек PLL для RK3288/RK3368/RK3399/RK356X

Настройки HDMI-PHY-PLL для RK3288/RK3368/RK3399/RK356X хранятся в rockchip_mpll_cfg и rockchip_mpll_cfg_420:

```text
static const struct dw_hdmi_mpll_config rockchip_mpll_cfg[] = {
   {

      30666000, {
         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40f3, 0x0000 },
      },
   }, {
      36800000, {
         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40a2, 0x0001 },
      },
   }, {

      46000000, {
         { 0x00b3, 0x0000 },
         { 0x2142, 0x0001 },
         { 0x40a2, 0x0001 },
      },
   }, {
```

Путь:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
```

rockchip_mpll_cfg задаёт RGB/YUV444/YUV422, а rockchip_mpll_cfg_420 — YUV420.

Определение dw_hdmi_mpll_config:

```text
struct dw_hdmi_mpll_config {
      unsigned long mpixelclock;

      struct {
           u16 cpce;
           u16 gmp;
      } res[DW_HDMI_RES_MAX];
};
```

Описание параметров:

| Параметр | Описание |
| --- | --- |
| mpixelclock | Частота пикселей |
| cpce | Значение регистра OPMODE_PLLCFG |
| gmp | Значение регистра PLLGMPCTRL |

Пример первой записи rockchip_mpll_cfg:

```text
static const struct dw_hdmi_mpll_config rockchip_mpll_cfg[] = {
   {
      30666000, {

         { 0x00b3, 0x0000 },
         { 0x2153, 0x0000 },
         { 0x40f3, 0x0000 },
      },
   }, {
```

Драйвер HDMI сначала проверяет формат YUV420: для него выбирается rockchip_mpll_cfg_420, иначе — rockchip_mpll_cfg. Значение 30666000 означает применимость записи при частоте пикселей не выше 30666000. {0x00b3, 0x0000}, {0x2153, 0x0000} и {0x40f3, 0x0000} соответствуют глубине 8, 10 и 12 бит; описанная реализация фактически поддерживает только 8 и 10 бит.

Значения параметров требуют документации PHY. Для добавления HDMI-PHY-PLL сообщите требуемую частоту пикселей FAE, затем добавьте полученные настройки в rockchip_mpll_cfg или rockchip_mpll_cfg_420 по правилам выше.

##### 2.1.9.4 Добавление настроек PLL для RK3588/RK3576

Драйверы RK3588/RK3576 автоматически рассчитывают частоты PLL; отдельная настройка PLL при добавлении разрешения не нужна.

Распределение PLL описано в §2.1.4.

#### 2.1.10 Включение звука

На RK3368 и RK3288 HDMI и кодек по умолчанию используют общую звуковую карту. Проверьте следующую конфигурацию:

```text
&hdmi_analog_sound {
      status = "okay";

}
```

На RK3399 HDMI и DP используют общую звуковую карту:

```text
&hdmi_dp_sound {
         status = "okay";

};
```

### 2.2 Настройка инфраструктуры отображения Android

Rockchip добавляет системные свойства в инфраструктуру отображения Android для настройки дисплеев под требования изделия.

#### 2.2.1 Основной и дополнительный интерфейсы отображения

| Свойство | Назначение |
| --- | --- |
| sys.hwc.device.primary vendor.hwc.device.primary (после Android 9.0) | Назначить основной интерфейс |
| sys.hwc.device.extend vendor.hwc.device.extend (после Android 9.0) | Назначить дополнительный интерфейс |

Добавьте эти два свойства в system.prop каталога конфигурации изделия, например:

```text
device/rockchip/rk3368/rk3368_box/system.prop
```

По умолчанию, если свойства не заданы, интерфейсы без горячего подключения — CVBS/MIPI/LVDS — становятся основными, а HDMI/DP с горячим подключением — дополнительными. Обычно для каждой роли задаётся один интерфейс. Например, RK3399 BOX SDK использует HDMI как основной, DP как дополнительный.

```text
sys.hwc.device.primary=HDMI-A
sys.hwc.device.extend=DP
```

После Android 9.0 свойства меняются на:

```text
vendor.hwc.device.primary=HDMI-A
vendor.hwc.device.extend=DP
```

Если одной роли назначено несколько интерфейсов, приоритет имеют устройства с горячим подключением. Например, конфигурация RK3368 BOX SDK по умолчанию:

```text
sys.hwc.device.primary=HDMI-A,TV
```

После Android 9.0 свойства меняются на:

```text
vendor.hwc.device.primary=HDMI-A,TV
```

При подключённом HDMI основной дисплей использует HDMI, при отключённом — CVBS. Разрешение основного framebuffer нельзя менять динамически, поэтому при двух и более основных интерфейсах рекомендуется задать его явно. Имена интерфейсов определены в hardware/rockchip/hwcomposer/drmresources.cpp:

```text
struct type_name connector_type_names[] = {
   { DRM_MODE_CONNECTOR_Unknown, "unknown" },//未知接⼝
   { DRM_MODE_CONNECTOR_VGA, "VGA" }, //VGA

   { DRM_MODE_CONNECTOR_DVII, "DVI-I" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_DVID, "DVI-D" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_DVIA, "DVI-A" },//DVI，暂不⽀持
   { DRM_MODE_CONNECTOR_Composite, "composite" },//不⽀持
   { DRM_MODE_CONNECTOR_SVIDEO, "s-video" },//S端⼦

   { DRM_MODE_CONNECTOR_LVDS, "LVDS" },//LVDS
   { DRM_MODE_CONNECTOR_Component, "component" },//分量信号YPbPr
   { DRM_MODE_CONNECTOR_9PinDIN, "9-pin DIN" },//不⽀持
   { DRM_MODE_CONNECTOR_DisplayPort, "DP" },//DP
   { DRM_MODE_CONNECTOR_HDMIA, "HDMI-A" },//HDMI A型⼝
   { DRM_MODE_CONNECTOR_HDMIB, "HDMI-B" },//HDMI B型⼝，不⽀持
   { DRM_MODE_CONNECTOR_TV, "TV" },// CVBS
   { DRM_MODE_CONNECTOR_eDP, "eDP" },//EDP
   { DRM_MODE_CONNECTOR_VIRTUAL, "Virtual" },//不⽀持
   { DRM_MODE_CONNECTOR_DSI, "DSI" },//MIPI
};
```

#### 2.2.2 Определение основного и дополнительного интерфейсов

Эти свойства только для чтения возвращают имена основного и дополнительного выходных интерфейсов соответственно:

| Свойство | Назначение |
| --- | --- |
| sys.hwc.device.main vendor.hwc.device.main(после Android 9.0) | Получить основной выходной интерфейс |
| sys.hwc.device.aux vendor.hwc.device.main (после Android 9.0) | Получить дополнительный выходной интерфейс |

#### 2.2.3 Разрешение framebuffer

Разрешение framebuffer используется для отрисовки UI и отличается от разрешения выхода HDMI. При несовпадении выполняется масштабирование. Настройка разрешения framebuffer:

```text
persist.sys.framebuffer.main=1920x1080
```

После Android 9.0 свойства меняются на:

```text
persist.vendor.framebuffer.main=1920x1080
```

#### 2.2.4 Фильтрация разрешений

Исходный список разрешений может быть избыточным. Поэтому модуль HWC в SDK фильтрует его по списку разрешённых режимов:

```text
device/rockchip/common/resolution_white.xml
```

HWC фильтрует исходный список по этому файлу перед передачей на верхний уровень. Каждый блок resolution в XML задаёт разрешённый режим. Поля:

| Поле | Описание |
| --- | --- |
| clock | Частота пикселей |
| hdisplay | Активные пиксели строки |
| hsync_start | Начало горизонтальной синхронизации |
| hsync_end | Конец горизонтальной синхронизации |
| htotal | Всего пикселей в строке |
| hskew | Горизонтальный сдвиг, обычно 0 |
| vdisplay | Активные строки кадра |
| vsync_start | Начало вертикальной синхронизации |
| vsync_end | Конец вертикальной синхронизации |
| vtotal | Всего строк в кадре |
| vscan | Параметр сканирования кадра, обычно 0 |
| vrefresh | Частота кадров дисплея |
| flags | Определения flags: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |
| vic | VIC по HDMI; 0, если не определён стандартом |

Определения таймингов показаны ниже:

![Техническая иллюстрация китайского оригинала, p. 31](/docs/rockchip-hdmi/assets/cn-p31-1.png)

#### 2.2.5 Параметры HDMI в настройках

Системное приложение Settings позволяет менять разрешение HDMI и другие свойства через UI.

Android 7.x показывает настройки HDMI по умолчанию. Для Android 8.x и новее добавьте свойство в каталог изделия внутри device:

```text
BOARD_SHOW_HDMI_SETTING := true
```

По умолчанию UI показывает только настройки дополнительного дисплея. Для изменения отредактируйте HdmiSettings.java в package/apps/Settings:

```text
int value = SystemProperties.getInt("persist.hdmi.ui.state", ???);
```

Замените ??? на 0 для UI дополнительного дисплея, 1 для основного или 2 для обоих.

### 2.3 Основные методы отладки

#### 2.3.1 Проверка состояния VOP

Проверьте состояние VOP командой:

```text
cat /sys/kenrel/debug/dri/0/summary
```

![Техническая иллюстрация китайского оригинала, p. 32](/docs/rockchip-hdmi/assets/cn-p32-1.png)

Журнал выше — пример из оригинала для RK3399 с HDMI. Он содержит три вида информации:

Состояние VOP: VOPB включён, VOPL отключён.

Состояние connector: VOPB выводит на HDMI. bus_format=0x2025 означает YUV444 8 бит; output_mode=0x0f задаёт шину VOP ROCKCHIP_OUT_MODE_AAAA с выводом 1920x1080P60. Типовые bus_format определены в uapi/linux/media-bus-format.h ядра:

```text
#define MEDIA_BUS_FMT_RGB888_1X24  0x100a //RGB888
#define MEDIA_BUS_FMT_RGB101010_1X30 0x1018 //RGB101010
#define MEDIA_BUS_FMT_YUV8_1X24    0x2025 //YUV444 8bit

#define MEDIA_BUS_FMT_YUV10_1X30   0x2016 //YUV444 10bit
#define MEDIA_BUS_FMT_UYYVYY8_0_5X24 0x2026 //YUV420 8bit
#define MEDIA_BUS_FMT_UYYVYY10_0_5X30 0x2027 //YUV420 10bit
```

Типовые output_mode определены в drivers/gpu/drm/rockchip/rockchip_drm_vop.h:

```text
#define ROCKCHIP_OUT_MODE_P888 0
#define ROCKCHIP_OUT_MODE_P666 1
#define ROCKCHIP_OUT_MODE_P565 2

#define ROCKCHIP_OUT_MODE_S888 8
#define ROCKCHIP_OUT_MODE_S888_DUMMY 12
#define ROCKCHIP_OUT_MODE_YUV420 14
/* for use special outface */
#define ROCKCHIP_OUT_MODE_AAAA 15
```

Конфигурация слоёв: win0 и win2 включены. win2 использует буфер ARGB 29x37, целевое окно 29x37 и левый верхний угол (385,543). win0 использует буфер NV12 3840x2160, целевое окно 1920x1080 и угол (0,0).

#### 2.3.2 Проверка состояния connector

В /sys/class/drm перечислены графические устройства, зарегистрированные драйвером. В примере RK3399 BOX ниже card0-HDMI-A-1 и card0-DP-1 соответствуют HDMI и DP.

![Техническая иллюстрация китайского оригинала, p. 33](/docs/rockchip-hdmi/assets/cn-p33-1.png)

Например, card0-HDMI-A-1 содержит:

Enabled: состояние включения.

Status: состояние подключения.

Mode: текущее выходное разрешение.

Modes: разрешения подключённого устройства.

Audioformat: звуковые форматы подключённого устройства.

Edid: EDID подключённого устройства; сохраните его командой cat edid > /data/edid.bin.

#### 2.3.3 Проверка работы HDMI

Работу HDMI можно проверить при наличии следующего коммита:

```text
commit eaca91814449199b1e6ad0b9fe0bba2215497c97
Author: Zheng Yang <zhengyang@rock-chips.com>

Date: Mon Nov 27 16:56:21 2017 +0800

      drm: bridge: dw-hdmi: add hdmi status debugfs node
```

Получите текущее состояние выхода HDMI командой:

```text
cat /sys/kernel/debug/dw-hdmi/status
```

![Техническая иллюстрация китайского оригинала, p. 33](/docs/rockchip-hdmi/assets/cn-p33-2.png)

![Техническая иллюстрация китайского оригинала, p. 34](/docs/rockchip-hdmi/assets/cn-p34-1.png)

HDMI Output Status показывает состояние PHY. Остальные сведения выводятся только при включённом PHY.

Pixel Clk — текущая частота пикселей.

TMDS Clk — текущая символьная скорость HDMI.

Color Format принимает RGB, YUV444, YUV422 или YUV420.

Color Depth принимает 8bit, 10bit, 12bit или 16bit.

Colorimery обозначает цветовой стандарт: ITU.BT601, ITU.BIT709 или ITU.BT2020 (написание оригинала сохранено).

EOTF обозначает электрооптическую передаточную функцию HDR:

| EOTF | Значение |
| --- | --- |
| Unsupported | HDMI не поддерживает передачу HDR-информации |
| Not Defined | Не определено |
| Off | HDR-информация не передаётся |
| SDR | Кривая SDR |
| ST2084 | EOTF ST2084 |
| HLG | EOTF HLG |

(x0,y0), (x1,y1), (x2,y2), (white x,white y), max lum, min lum, max cll и maxfall — параметры статического дескриптора HDR. Согласно оригиналу, они присутствуют только при EOTF SDR, ST2084 или HLG.

Считайте регистры контроллера HDMI командой:

```text
cat /sys/kenrel/debug/dw-hdmi/ctrl
```

Регистры можно изменять. Для записи 0xF8 в регистр 0x1000:

```text
echo 1000 f8 > /sys/kenrel/debug/dw-hdmi/ctrl
```

На RK3288/RK3368/RK3399 считайте регистры HDMI PHY командой:

```text
cat /sys/kenrel/debug/dw-hdmi/phy
```

Запись PHY аналогична записи контроллера. Для записи 0x8002 в регистр 0x06:

```text
echo 06 8002 > /sys/kenrel/debug/dw-hdmi/phy
```

#### 2.3.4 Проверка состояния HDMI CEC

Считайте состояние HDMI CEC командой:

```text
cat /sys/kernel/debug/cec/cec0/status
```

![Техническая иллюстрация китайского оригинала, p. 35](/docs/rockchip-hdmi/assets/cn-p35-1.png)

Вывод выше означает:

configured: настроен ли адаптер CEC; 1 — да, 0 — нет.

configuring: идёт ли настройка; 1 — выполняется, 0 — завершена или не начиналась.

phys_addr: физический адрес CEC; f.f.f.f означает, что адрес не получен.

number of LAs: количество логических адресов, обычно 1, в редких случаях 2.

LA mask представляет назначенные адреса как (1 << logical_address). Например, 0x0010 после сдвига вправо на 4 даёт 1, то есть адрес 4; 0x0800 после сдвига на 11 даёт 1, то есть адрес 11. 0x0000 означает отсутствие назначенного адреса.

has CEC follower означает обработку входящих сообщений CEC пользовательским пространством. in passthrough mode означает, что ядро не обрабатывает CEC core messages, а передаёт все сообщения пользовательскому пространству.

pending transmits — количество ожидающих отправки сообщений CEC.

#### 2.3.5 Принудительное включение и отключение HDMI

Принудительно включить HDMI:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status
```

Принудительно отключить HDMI:

```text
echo off > /sys/class/drm/card0-HDMI-A-1/status
```

Восстановить обнаружение горячего подключения:

```text
echo detect > /sys/class/drm/card0-HDMI-A-1/status
```

#### 2.3.6 Настройка разрешения из командной строки

Разрешение Android меняется установкой свойств из командной строки. Изменение разрешения в Settings также обновляет соответствующие свойства, как описано ниже.

##### 2.3.6.1 Разрешение в Android 7.x и 8.x

| Свойство | Описание |
| --- | --- |
| persist.sys.resolution.main | Задать основное разрешение его таймингами; ссылка оригинала §3.2.4 (здесь §2.2.4). |
| persist.sys.resolution.aux | Задать дополнительное разрешение его таймингами; ссылка оригинала §3.2.4 (здесь §2.2.4). |
| sys.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Задайте разрешения основного/дополнительного дисплея через persist.sys.resolution.main и persist.sys.resolution.aux. После изменения увеличьте sys.display.timeline на 1 и вызовите обновление UI, например перемещением мыши. Примеры:

Установить 4K60:

```text
setprop persist.sys.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5
setprop sys.display.timeline 1
```

Установить 1080p60:

```text
setprop persist.sys.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5
setprop sys.display.timeline 2
```

Установить 720P60:

```text
setprop persist.sys.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5

setprop sys.display.timeline 3
```

Установить 480P60:

```text
setprop persist.sys.resolution.main 720x480@59.94-736-798-858-489-495-525-a
setprop sys.display.timeline 4
```

##### 2.3.6.2 Разрешение в Android 9.0 и новее

Старые и новые редакции Android 9.0 используют разные свойства разрешения в зависимости от версии HWC. Новые SDK Android 9.0 и последующие версии Android используют новые свойства.

```text
commit 6f772a162893dd0242b6644fa32166e1ac15b2c0
Author: libin <bin.li@rock-chips.com>
Date: Wed May 12 15:00:05 2021 +0800


   DrmConnector : Add UpdateDisplayMode function

   In order to adapt to the three-screen version.

   The hwc switching resolution will be in accordance with
the following priority:
 1.persist.vendor.resolution.<Connector-type>-<Connector-ID>
 2.persist.vendor.resolution.main(aux)

 3.baseparameter(if exist)
 4.use "Auto"

Version: 1.1.137

Signed-off-by: libin <bin.li@rock-chips.com>
Change-Id: I73e216047ed5423929d7a091572d717c4ffdf50c
```

HWC с указанным выше коммитом использует новые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.resolution.HDMI-A-0 | Задать разрешение HDMI0; для HDMI1 используйте HDMI-A-1. Значение — тайминги; ссылка оригинала §3.2.4 (здесь §2.2.4). |
| vendor.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Без указанного изменения HWC использует старые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.resolution.main | Задать основное разрешение его таймингами; ссылка оригинала §3.2.4 (здесь §2.2.4). |
| persist.vendor.resolution.aux | Задать дополнительное разрешение его таймингами; ссылка оригинала §3.2.4 (здесь §2.2.4). |
| vendor.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Задайте разрешения через persist.vendor.resolution.main и persist.vendor.resolution.aux. Затем увеличьте vendor.display.timeline на 1 и вызовите обновление UI, например перемещением мыши. Примеры:

Установить 4K60:

```text
setprop persist.vendor.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5

setprop vendor.display.timeline 1
```

Установить 1080p60:

```text
setprop persist.vendor.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5

setprop vendor.display.timeline 2
```

Установить 720P60:

```text
setprop persist.vendor.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5
setprop vendor.display.timeline 3
```

Установить 480P60:

```text
setprop persist.vendor.resolution.main 720x480@59.94-736-798-858-489-495-525-
a
setprop vendor.display.timeline 4
```

#### 2.3.7 Настройка цвета из командной строки

Цветовой вывод Android настраивается свойствами из командной строки. Изменение цвета в Settings также обновляет эти свойства, как описано ниже.

##### 2.3.7.1 Цвет в Android 7.x и 8.x

| Свойство | Описание |
| --- | --- |
| persist.sys.color.main | Задать цвет основного дисплея как формат-глубина, например RGB-8bit для RGB по 8 бит на компонент (24-битный RGB). Форматы: RGB, YCBCR444, YCBCR422, YCBCR420. Глубины: 8bit, 10bit. |
| persist.sys.color.aux | Задать цвет дополнительного дисплея; параметры как для основного. |
| sys.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Настройте цвет через persist.sys.color.main и persist.sys.color.aux. После изменения увеличьте sys.display.timeline на 1 и обновите UI, например перемещением мыши. Пример:

```text
setprop persist.sys.color.main RGB-8bit
setprop sys.display.timeline 1
```

Установите RGB с глубиной 8 бит на компонент (24-битный RGB).

##### 2.3.7.2 Цвет в Android 9.0 и новее

Как и для разрешения в §2.3.6.2 (в оригинале §3.3.6.2), старые и новые версии Android используют разные свойства цвета.

```text
commit 6f772a162893dd0242b6644fa32166e1ac15b2c0
Author: libin <bin.li@rock-chips.com>

Date: Wed May 12 15:00:05 2021 +0800

   DrmConnector : Add UpdateDisplayMode function

   In order to adapt to the three-screen version.
The hwc switching resolution will be in accordance with
the following priority:

 1.persist.vendor.resolution.<Connector-type>-<Connector-ID>
 2.persist.vendor.resolution.main(aux)
 3.baseparameter(if exist)
 4.use "Auto"

Version: 1.1.137

Signed-off-by: libin <bin.li@rock-chips.com>
Change-Id: I73e216047ed5423929d7a091572d717c4ffdf50c
```

HWC с указанным выше коммитом использует новые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.color.HDMI-A-0 | Задать цвет HDMI0; для HDMI1 используйте HDMI-A-1. Формат: цвет-глубина, например RGB-8bit для RGB по 8 бит на компонент (24-битный RGB). Форматы: RGB, YCBCR444, YCBCR422, YCBCR420. Глубины: 8bit, 10bit. |
| vendor.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Без указанного изменения HWC использует старые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.color.main | Задать цвет основного дисплея как формат-глубина, например RGB-8bit для RGB по 8 бит на компонент (24-битный RGB). Форматы: RGB, YCBCR444, YCBCR422, YCBCR420. Глубины: 8bit, 10bit. |
| persist.vendor.color.aux | Задать цвет дополнительного дисплея; параметры как для основного. |
| vendor.display.timeline | Обновить временную шкалу отображения; увеличивать на единицу при новом разрешении. |

Задайте цвет через persist.vendor.color.main и persist.vendor.color.aux. Затем увеличьте vendor.display.timeline на 1 и вызовите обновление UI, например перемещением мыши. Пример:

```text
setprop persist.vendor.color.main RGB-8bit
setprop vendor.display.timeline 1
```

Установите RGB с глубиной 8 бит на компонент (24-битный RGB).

#### 2.3.8 Настройка overscan

Из-за различий телевизоров изображение может выходить за края экрана или иметь чёрные поля. Исправьте это настройкой масштаба overscan.

В Android overscan меняется через свойства командной строки или Settings. Settings также обновляет соответствующие свойства, как описано ниже.

##### 2.3.8.1 Overscan в Android 7.x и 8.x

| Свойство | Описание |
| --- | --- |
| persist.sys.overscan.main | Задать overscan основного дисплея. Формат: overscan left,top,right,bottom — значения слева, сверху, справа и снизу. Минимум=1; максимум задаётся persist.sys.overscan.max, по умолчанию 100. |
| persist.sys.overscan.aux | Задать overscan дополнительного дисплея; параметры как для основного. |

Пример:

```text
setprop persist.sys.overscan.main "overscan 70,70,70,70"
```

Установите overscan в 70 во всех четырёх направлениях.

##### 2.3.8.2 Overscan в Android 9.0 и новее

Выбирайте свойства по версии Android, как в §2.3.6.2 (ссылка оригинала: §3.3.6.2).

Новые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.overscan.HDMI-A-0 | Задать overscan HDMI0 (оригинал пишет «цвет»); для HDMI1 используйте HDMI-A-1. Формат: overscan left,top,right,bottom — значения слева, сверху, справа и снизу. Минимум=1; максимум задаётся persist.vendor.overscan.max, по умолчанию 100. |

Старые свойства:

| Свойство | Описание |
| --- | --- |
| persist.vendor.overscan.main | Задать overscan основного дисплея. Формат: overscan left,top,right,bottom — значения слева, сверху, справа и снизу. Минимум=1; максимум задаётся persist.vendor.overscan.max, по умолчанию 100. |
| persist.vendor.overscan.aux | Задать overscan дополнительного дисплея; параметры как для основного. |

Пример:

```text
setprop persist.vendor.overscan.main "overscan 70,70,70,70"
```

Установите overscan в 70 во всех четырёх направлениях.

#### 2.3.9 Яркость, контрастность, насыщенность и оттенок

Android позволяет менять эти параметры через свойства командной строки и Settings. Settings обновляет соответствующие свойства, как описано ниже.

##### 2.3.9.1 Яркость, контрастность, насыщенность и оттенок в Android 7.x и 8.x

| BCSH | Диапазон | Описание |
| --- | --- | --- |
| Яркость | Целое 0–100, по умолчанию 50 | persist.sys.brightness.main persist.sys.brightness.aux |
| Контрастность | Целое 0–100, по умолчанию 50 | persist.sys.contrast.main persist.sys.contrast.aux |
| Насыщенность | Целое 0–100, по умолчанию 50 | persist.sys.saturation.main persist.sys.saturation.aux |
| Оттенок | Целое 0–100, по умолчанию 50 | persist.sys.hue.main persist.sys.hue.aux |

Пример:

```text
setprop persist.sys.brightness.main 70
setprop vendor.display.timeline 1
```

Задайте яркость основного дисплея через persist.sys.brightness.main. После изменения увеличьте vendor.display.timeline на 1 и вызовите обновление UI, например перемещением мыши. Свойство vendor в разделе старого Android сохранено по оригиналу и требует проверки.

##### 2.3.9.2 Яркость, контрастность, насыщенность и оттенок в Android 9.0 и новее

Выберите свойства по версии Android, как в §2.3.6.2 (ссылка оригинала: §3.3.6.2).

Новые свойства:

| BCSH | Диапазон | Описание |
| --- | --- | --- |
| Яркость | Целое 0–100, по умолчанию 50 | persist.vendor.brightness.HDMI-A-0 |
| Контрастность | Целое 0–100, по умолчанию 50 | persist.vendor.contrast.HDMI-A-0 |
| Насыщенность | Целое 0–100, по умолчанию 50 | persist.vendor.saturation.HDMI-A-0 |
| Оттенок | Целое 0–100, по умолчанию 50 | persist.vendor.hue.HDMI-A-0 |

Старые свойства:

| BCSH | Диапазон | Описание |
| --- | --- | --- |
| Яркость | Целое 0–100, по умолчанию 50 | persist.vendor.brightness.main persist.vendor.brightness.aux |
| Контрастность | Целое 0–100, по умолчанию 50 | persist.vendor.contrast.main persist.vendor.contrast.aux |
| Насыщенность | Целое 0–100, по умолчанию 50 | persist.vendor.saturation.main persist.vendor.saturation.aux |
| Оттенок | Целое 0–100, по умолчанию 50 | persist.vendor.hue.main persist.vendor.hue.aux |

Пример:

```text
setprop persist.vendor.brightness.main 70
setprop sys.display.timeline 1
```

Задайте яркость основного дисплея через persist.vendor.brightness.main, увеличьте vendor.display.timeline на 1 и обновите UI, например перемещением мыши.

### 2.4 Поиск неисправностей

#### 2.4.1 Нет сигнала, неподдерживаемый формат, нестабильное изображение или цветные точки/линии после подключения или смены разрешения

(1) Проверьте текущее разрешение HDMI (§2.3.2; в оригинале §3.3.2).

(2) Уменьшите разрешение HDMI и проверьте изображение (§2.3.6; в оригинале §3.3.6).

(3) Попробуйте исправный кабель HDMI.

(4) Если шаги 2 или 3 восстанавливают изображение, причина обычно связана с совместимостью физических сигналов. Проверьте оборудование и измерьте сигналы HDMI.

(5) Если сигналы HDMI не отвечают требованиям, настройте HDMI PHY (§2.1.8; в оригинале §3.1.7).

#### 2.4.2 Нет сигнала или неподдерживаемый формат при воспроизведении видео

Проверьте, включено ли в DTS ядра изменение частоты DDR для видео. Если да, задайте auto-freq-en = <0>; для отключения автоматического изменения в ходе диагностики.

```text
dmc: dmc {
     compatible = "rockchip,rk3328-dmc";

     devfreq-events = <&dfi>;
     clocks = <&cru SCLK_DDRCLK>;
     clock-names = "dmc_clk";
     operating-points-v2 = <&dmc_opp_table>;
     ddr_timing = <&ddr_timing>;
     upthreshold = <40>;
     downdifferential = <20>;
     system-status-freq = <
           /*system status   freq(KHz)*/
           SYS_STATUS_NORMAL 786000
           SYS_STATUS_REBOOT 786000
           SYS_STATUS_SUSPEND 786000
           SYS_STATUS_VIDEO_1080P 786000

           SYS_STATUS_VIDEO_4K 786000
           SYS_STATUS_VIDEO_4K_10B 933000
           SYS_STATUS_PERFORMANCE 933000
           SYS_STATUS_BOOST  933000
     >;
     auto-min-freq = <786000>;
     auto-freq-en = <0>;
     #cooling-cells = <2>;
     status = "disabled";
```

#### 2.4.3 Нет сигнала, чёрный экран или искажения на отдельных телевизорах

(1) Проверьте текущее разрешение HDMI (§2.3.2; в оригинале §3.3.2).

(2) Уменьшите разрешение HDMI и проверьте изображение (§2.3.6; в оригинале §3.3.6).

(3) Попробуйте исправный кабель HDMI.

(4) Восстановление после шага 2 или 3 обычно указывает на совместимость физических сигналов HDMI. Проверьте оборудование и сигналы.

(5) Если сигналы не отвечают требованиям, настройте HDMI PHY (§2.1.8; в оригинале §3.1.7).

(6) Если сигналы HDMI соответствуют требованиям, попробуйте изменить следующие регистры:

```text
kernel\drivers\gpu\drm\bridge\synopsys\dw-hdmi.c
/* HDMI Initialization Step B.4 */
static void dw_hdmi_enable_video_path(struct dw_hdmi *hdmi)
{

   /* control period minimum duration */
   hdmi_writeb(hdmi, 12, HDMI_FC_CTRLDUR);
```

Постепенно увеличивайте HDMI_FC_CTRLDUR, максимум до 223, проверяя восстановление изображения.

#### 2.4.4 Разрешение по умолчанию при ошибке чтения EDID

```text
Commit 727e0fe68d8f422698f4e257cb7c04f90b8692c0
Author: xuhuicong xhc@rock-chips.com

Date: Tue Sep 26 17:32:56 2017 +0800
drm/edid: output common tv resolution and hdmi mode if no read the correct edid
Change-Id: Ib7379340e8c1d59382553d21b60165fe5fb371e8
Signed-off-by: xuhuicong xhc@rock-chips.com
```

При наличии указанного коммита измените def_modes на требуемый VIC. В примере ниже 4 соответствует 720P60.

```text
kernel\drivers\gpu\drm\bridge\synopsys\dw-hdmi.c
```

```text
static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
{
   struct dw_hdmi *hdmi = container_of(connector, struct dw_hdmi,

                  connector);
   struct edid *edid;
   struct drm_display_mode *mode;
   const u8 def_modes[6] = {4, 16, 31, 19, 17, 2};
   struct drm_display_info *info = &connector->display_info;
```

#### 2.4.5 Принудительный вывод заданного разрешения

Для игнорирования ограничений EDID и принудительного разрешения на RK3288/RK3368/RK3399/RK356X проверьте наличие коммита:

```text
commit b318f175080ca98173d75fcf436beeee64092303
Author: Algea Cao <algea.cao@rock-chips.com>
Date: Fri Nov 17 09:55:52 2023 +0800


   drm/bridge: synopsys: Support hdmi force output

   Support hdmi output specific resolution and color format
   regardless of whether hdmi is connected.

   Signed-off-by: Algea Cao <algea.cao@rock-chips.com>
   Change-Id: I228a74d128aa818166f589798897729473d97610
```

На RK3588/RK3576 проверьте наличие коммита:

```text
commit ed5631fa515a297b45cef5a1330b516f56e113dc
Author: Algea Cao <algea.cao@rock-chips.com>

Date: Thu Dec 28 10:16:17 2023 +0800

   drm/bridge: dw-hdmi-qp: Support hdmi force output

   Support hdmi output specific resolution and color format
   regardless of whether hdmi is connected.

   Signed-off-by: Algea Cao <algea.cao@rock-chips.com>
   Change-Id: I3f18aeb04427846e06b6a4397a4c6df77bbbcab2
```

При наличии этих коммитов задайте разрешение и цветовой формат непосредственно в DTS:

```text
&hdmi {
      status = "okay";

      force-output;
      force-bus-format = <MEDIA_BUS_FMT_RGB888_1X24>;
      force_timing {
           clock-frequency = <594000000>;
           hactive = <3840>;
           vactive = <2160>;
           hback-porch = <296>;
           hfront-porch = <176>;
           vback-porch = <72>;
           vfront-porch = <8>;
           hsync-len = <88>;
           vsync-len = <10>;
           hsync-active = <1>;

           vsync-active = <1>;
           de-active = <0>;
           pixelclk-active = <0>;
      };
};
```

(1) force-output: флаг принудительного вывода HDMI.

(2) force-bus-format: принудительный цветовой формат.

(3) force_timing: принудительные тайминги разрешения.

Если этих коммитов нет, внесите следующие изменения:

![Техническая иллюстрация китайского оригинала, p. 46](/docs/rockchip-hdmi/assets/cn-p46-1.png)

Расшифровка различимого кода. Сам снимок обрезан; это не полный патч для применения.

```text
diff --git a/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c b/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
index 5ed021b..9a7f18c 100644
--- a/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
+++ b/drivers/gpu/drm/bridge/synopsys/dw-hdmi.c
@@ -2497,7 +2497,7 @@ static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
                                             connector);
        struct edid *edid;
        struct drm_display_mode *mode;
-       const u8 def_modes[6] = {4, 16, 31, 19, 17, 2};
+       const u8 def_modes[6] = {107, 16, 31, 19, 17, 2};
        struct hdr_static_metadata *metadata =
                        &connector->display_info.hdmi.hdr_panel_metadata;
        int i, ret = 0;
@@ -2506,6 +2506,7 @@ static int dw_hdmi_connector_get_modes(struct drm_connector *connector)
                return 0;

        edid = drm_get_edid(connector, hdmi->ddc);
+       edid = NULL;
        if (edid) {
                dev_dbg(hdmi->dev, "got edid: width[%d] x height[%d]\n",
                        edid->width_cm, edid->height_cm);
diff --git a/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c b/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
index bdc96cd4..6653dfa 100644
--- a/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
+++ b/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
@@ -488,10 +488,12 @@ dw_hdmi_rockchip_mode_valid(struct drm_connector *connector,
         * If sink max TMDS Clock < 340MHz, we should check the mode pixel
         * clock > 340MHz is YCbCr420 or not.
         */
+#if 0
        if (mode->clock > 340000 &&
            connector->display_info.max_tmds_clock < 340000 &&
            !drm_mode_is_420(&connector->display_info, mode))
                return MODE_BAD;
+#endif

        if (!encoder) {
```

(1) Задайте первому элементу массива def_mode VIC требуемого разрешения.

(2) Установите edid = NULL; для принудительного перехода по пути ошибки EDID и использования def_modes независимо от результата чтения.

(3) Для принудительного 4K также закомментируйте указанный на рисунке код, снимающий ограничение 4K.

При принудительных режимах HDMI 2.0 выше 4K30 и более высоких проверьте, требуется ли приёмнику обмен SCDC. Если требуется, HDMI DDC должен работать. Принудительный вывод не поддерживает горячее подключение HDMI.

#### 2.4.6 Нет изображения HDMI в Recovery

Recovery не поддерживает ни два дисплея, ни горячее подключение. Для HDMI добавьте изменение ниже, если его нет, и загружайтесь с подключённым HDMI.

![Техническая иллюстрация китайского оригинала, p. 46](/docs/rockchip-hdmi/assets/cn-p46-2.png)

Расшифровка различимого кода. Сам снимок обрезан; это не полный патч для применения.

```text
diff --git a/minui/graphics_drm.cpp b/minui/graphics_drm.cpp
index 03e33b7..f4d5fc7 100644
--- a/minui/graphics_drm.cpp
+++ b/minui/graphics_drm.cpp
@@ -295,6 +295,7 @@ static drmModeConnector *find_main_monitor(int fd, drmModeRes *resources,
    int modes;
    /* Look for LVDS/eDP/DSI connectors. Those are the main screens. */
    unsigned kConnectorPriority[] = {
+       DRM_MODE_CONNECTOR_HDMIA,
        DRM_MODE_CONNECTOR_LVDS,
        DRM_MODE_CONNECTOR_eDP,
        DRM_MODE_CONNECTOR_DSI,
```

#### 2.4.7 Settings не меняет разрешение HDMI

(1) Проверьте назначение дисплеев и настройку Settings (§2.2.1 и §2.2.5; в оригинале §3.2.1 и §3.2.5).

(2) Проверьте свойства разрешения (§2.3.6; в оригинале §3.3.6).

(3) Android 9.x и новее требуют RkOutputManager. Обновите код RK3399 до коммита:

![Техническая иллюстрация китайского оригинала, p. 47](/docs/rockchip-hdmi/assets/cn-p47-1.png)

Расшифровка различимого кода. Сам снимок обрезан; это не полный патч для применения.

```text
commit 3550c7dd16aea55c67b58e45d42301d94216f665
Author: Wh <wanghang@rock-chips.com>
Date:   Wed Apr 3 15:56:06 2019 +0800

    rk3399: mid add hdmi config

    Change-Id: I0705b537f9fe110bb06ae6390caaa8886f8d36a6
    Signed-off-by: wh <wanghang@rock-chips.com>

wh@ubuntu:~/3399_9.0/device/rockchip/rk3399$
```

(4) Другим платформам Android 9.0 нужен соответствующий патч. После команд source и lunch проекта выполните get_build_var DEVICE_MANIFEST_FILE, чтобы определить manifest. Если выводится device/rockchip/common/manifest.xml, добавьте в него следующий код:

```text
<hal format="hidl">
   <name>rockchip.hardware.outputmanager</name>
   <transport>hwbinder</transport>

   <version>1.0</version>
   <interface>
      <name>IRkOutputManager</name>
      <instance>default</instance>
   </interface>
</hal>
```

#### 2.4.8 Недостаточная пропускная способность DDR

При мерцании или мигающих зелёных линиях на высоких разрешениях, например 4K, проверьте журнал ядра на наличие:

```text
[drm:vop_isr] ERROR POST_BUF_EMPTY irq err
```

Такой журнал указывает на недостаточную полосу DDR. См. §9.7 Rockchip_RK3399_Developer_Guide_Android7.1_Software_CN&EN.pdf.

#### 2.4.9 Вопросы 4K UI

(1) Необходим ли UI в 4K?

Оригинал не рекомендует 4K UI из-за расхода ресурсов и указывает предел около 4K25Hz в своей среде. Это не тест ArmSoM. Для воспроизведения 4K-видео или просмотра 4K-фото интерфейс 4K не обязателен: стандартные проигрыватель и просмотрщик поддерживают эти задачи.

(2) Как настроить 4K UI?

Установите framebuffer в 4K по §2.2.3 (ссылка оригинала §3.2.3).

(3) Мерцание после включения 4K UI: проверьте полосу DDR. В оригинале ссылка §3.4.10; здесь диагностика полосы находится в §2.4.8.

#### 2.4.10 В Settings HDMI отсутствует 4K

(1) Убедитесь, что телевизор поддерживает 4K.

(2) Проверьте наличие 4K в списке режимов HDMI ядра:

```text
cat /sys/class/drm/card0-HDMI-A-1/modes
```

(3) Если нет, проверьте привязку HDMI к VOPB на RK3288/RK3399 с двумя VOP. Либо телевизор не поддерживает YUV420 для 4K50/60, что превышает возможности платформы; см. таблицу главы 1.

(4) Если ядро перечисляет 4K, а Settings нет, проверьте список разрешённых режимов (§2.2.4; в оригинале §3.2.4).

#### 2.4.11 Нет 8K в Settings HDMI на RK3588

(1) Проверьте режим HDMI 2.1 или игровой режим телевизора. Большинство 8K-телевизоров требуют ручного выбора для появления 8K.

(2) Проверьте VOP ACLK=800MHz (§2.1.4.4; в оригинале §3.1.5).

#### 2.4.12 Мерцание или нарушения вывода 8K/4K120 на RK3588/RK3576

(1) Проверьте кабель HDMI. Оригинал требует кабель HDMI 2.1 для режимов HDMI 2.1.

(2) Предоставьте схему HDMI и разводку PCB аппаратной поддержке Rockchip для проверки.

(3) Организуйте SI-тестирование во внешней лаборатории либо запросите его в аппаратной лаборатории Rockchip через представителя поставщика.

#### 2.4.13 Заполнение заявки на сертификацию HDMI

Орган сертификации HDMI обычно предоставляет заявку в виде книги Excel.

Сначала проверьте вкладки листов внизу, например:

![Техническая иллюстрация китайского оригинала, p. 48](/docs/rockchip-hdmi/assets/cn-p48-1.png)

Для каждой функции HDMI заполняется соответствующий лист. Листы неподдерживаемых функций заполнять не нужно. Типичные листы:

General обычно обязателен и содержит основные сведения: количество входов/выходов HDMI и поддержку HDCP/CEC. Ответы определяют необходимость остальных листов. Например, HDMI_input_count=0 означает отсутствие входа HDMI, поэтому Sink CDF не нужен.

![Техническая иллюстрация китайского оригинала, p. 49](/docs/rockchip-hdmi/assets/cn-p49-1.png)

Source CDF обязателен для устройств с выходами HDMI, количество которых указывается в General. Обычно требуются выходные разрешения, цветовые форматы и связанные возможности.

![Техническая иллюстрация китайского оригинала, p. 49](/docs/rockchip-hdmi/assets/cn-p49-2.png)

Sink CDF обязателен для устройств с входами HDMI. Обычно требуются входные разрешения, цветовые форматы и сведения EDID.

Repeater CDF нужен, если устройство работает повторителем HDMI. Оригинал отмечает, что решения Rockchip обычно не относятся к этому типу изделий.

Каждый лист обычно содержит несколько таблиц, заполняемых как обычные таблицы Excel. Пример: Video на листе Source CDF:

![Техническая иллюстрация китайского оригинала, p. 50](/docs/rockchip-hdmi/assets/cn-p50-1.png)

Заполняйте каждый пункт по реальным возможностям устройства. Для Source_HDMI_YCbCr выше столбцы содержат имя пункта, описание, допустимые значения и ответ заявителя. Вопрос — поддерживает ли HDMI вывод YCbCr. Выберите Y при поддержке, иначе N.

Форма содержит слишком много пунктов для отдельного описания здесь. Вопросы по конкретным полям направляйте через Redmine поставщика.

{% endraw %}
