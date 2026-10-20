---
title: "Rockchip HDMI: vollständiger Entwicklerleitfaden zu DRM, PHY, HDCP, Android und Fehlerdiagnose"
description: "Vollständiger Rockchip-HDMI-Leitfaden: DRM-Konfiguration, PHY, HDCP, Android, Auflösungen und Fehlerdiagnose."
translation_key: "047-rockchip-hdmi"
slug: "047-rockchip-hdmi"
lang: "de"
date: "2026-10-16"
author: "ArmSoM-Redaktion · Rockchip-Quelldokumentation"
category: "media"
products: []
tags: ["HDMI", "Rockchip", "DRM", "HDCP", "RK3588", "RK3576"]
keywords: "ArmSoM Rockchip HDMI DRM PHY HDCP Android RK3588 RK3576"
excerpt: "Vollständiger Entwicklerleitfaden zu Rockchip HDMI: DRM, PHY, HDCP, Android und Fehlerdiagnose."
---

{% raw %}

# Rockchip HDMI: vollständiger Entwicklerleitfaden zu DRM, PHY, HDCP, Android und Fehlerdiagnose

Dieser Plattformleitfaden zu Rockchip HDMI basiert auf dem chinesischen PDF V1.2.0 mit 50 Seiten; ein englisches Original wurde nicht bereitgestellt. Die englische, russische und deutsche Fassung sind vollständige Übersetzungen. Alle Sprachfassungen verwenden die Abbildungen des chinesischen PDFs mit lokalisierten Alternativtexten. Die Produkttabelle der Quelle nennt RK322X/RK3328/RK3368/RK3399/RK3288/RK3528/RK356X/RK3588 und Linux 6.1/5.10/4.19/4.4; im Haupttext wird zusätzlich RK3576 behandelt. Diese zusammengefasste Tabelle bestätigt nicht jede Kombination aus SoC und Kernel. Prüfen Sie vor dem Einsatz auf ArmSoM die HDMI-Leiterbahnführung und verfügbaren Anschlüsse, SDK/BSP, Kerneltreiber, PHY sowie Android-/HWC-Versionen. Eine Hardwarevalidierung auf ArmSoM wurde nicht durchgeführt. Die I2C-Messung bei 50kHz, Leistungsangaben zur 4K-Benutzeroberfläche, Protokolle und Zertifizierungsdiagnosen stammen aus der Quelle und sind keine ArmSoM-Tests.

[Redaktionelle Prüfnotizen](/docs/rockchip-hdmi/EDITORIAL-NOTES.md) · [ArmSoM-Dokumentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. HDMI auf Rockchip-Plattformen

Die HDMI-Funktionen der verschiedenen Rockchip-Plattformen sind nachfolgend aufgeführt:

| Merkmal | RK3288 | RK3368 | RK322X | RK3328 | RK3399 | RK3528 | RK356X | RK3588 | RK3576 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Maximale Ausgabeauflösung | 3840x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 4096x2160p60 | 7680x4320p60 | 4096x2160p120 |
| Zeilensprungverfahren | N | N | Y | Y | Y | Y | Y | Y | Y |
| Farbformate bei 4K60/50Hz | RGB YCbCr444 YCbCr422 YCbCr420(nur RK3288W) | YCbCr420 | YCbCr420 | YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 | RGB YCbCr444 YCbCr420 | RGB YCbCr444 YCbCr422 YCbCr420 |
| Unterstützung für 10-Bit-Farbtiefe | Y | N | Y | Y | Y | Y | Y | Y | Y |
| HDMI-Version | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.0 | HDMI 2.1 | HDMI 2.1 |

DRM:

DRM (Direct Rendering Manager) ist eine Komponente der DRI (Direct Rendering Infrastructure). Linux-Kernel ab 4.4 verwenden DRM. Die HDMI-Treiber liegen unter:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-Rockchip.c
kernel/drivers/gpu/drm/rockchip/inno_hdmi.c

kernel/drivers/gpu/drm/bridge/synopsys/
```

## 2. HDMI im DRM-Framework

### 2.1 HDMI-Softwarekonfiguration

#### 2.1.1 HDMI aktivieren

Fügen Sie zum Aktivieren von HDMI Folgendes hinzu:

```text
&hdmi {
   status = "okay";

};
```

#### 2.1.2 Einen VOP zuordnen

Auf Rockchip-Plattformen stammen die Bilddaten für Anzeigeschnittstellen wie HDMI, DP und CVBS vom VOP:

![Technische Abbildung aus der chinesischen Quelle, S. 5](/docs/rockchip-hdmi/assets/cn-p5-1.png)

Plattformen mit zwei VOPs, etwa RK3288 und RK3399, besitzen VOPB (4K) und VOPL (nur 2K). Diese lassen sich zwei Anzeigeschnittstellen zuordnen; die Zuordnungen sind austauschbar. Jede Anzeigeschnittstelle kann jedoch nur einem VOP zugeordnet sein:

![Technische Abbildung aus der chinesischen Quelle, S. 6](/docs/rockchip-hdmi/assets/cn-p6-1.png)

Durch Aktivieren des Anzeigeknotens im DTS werden beide Ports VOPB und VOPL für diese Schnittstelle aktiviert. Deaktivieren Sie den nicht verwendeten VOP-Port. Fügen Sie beispielsweise bei Zuordnung von HDMI zu VOPB Folgendes hinzu:

```text
&hdmi_in_vopl {
   status = "disabled";
};
```

Bei Zuordnung von HDMI zu VOPL fügen Sie dagegen Folgendes hinzu:

```text
&hdmi_in_vopb {
   status = "disabled";
};
```

Bei Plattformen mit nur einem VOP entfällt dieser Schritt.

Ab VOP2 besitzt die Plattform statt mehrerer VOPs einen einzigen VOP mit mehreren VP-Ausgängen (Video Port).

Die Verbindungen zwischen VOP und HDMI auf RK356X sind nachfolgend dargestellt:

![Technische Abbildung aus der chinesischen Quelle, S. 6](/docs/rockchip-hdmi/assets/cn-p6-2.png)

HDMI lässt sich VP0 oder VP1 zuordnen. Für 4K-Ausgabe wird VP0 empfohlen:

```text
&hdmi_in_vp0 {
   status = "okay";
};


&hdmi_in_vp1 {
   status = "disabled";
};
```

Die Verbindungen zwischen VOP und HDMI auf RK3588 sind nachfolgend dargestellt:

![Technische Abbildung aus der chinesischen Quelle, S. 7](/docs/rockchip-hdmi/assets/cn-p7-1.png)

RK3588 besitzt zwei HDMITX-Instanzen mit identischer Leistungsfähigkeit. Jede lässt sich VP0, VP1 oder VP2 zuordnen.

Genügt eine Ausgabe bis 4K, ordnen Sie HDMI0 dem VP0 und HDMI1 dem VP1 zu:

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

Für die 8K-Ausgabe auf RK3588 müssen VP0 und VP1 kombiniert werden. Ordnen Sie im DTS die für 8K verwendete HDMI-Schnittstelle dem VP0 zu. Beispiel HDMI0:

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

Setzen Sie außerdem VOP ACLK auf 800M. Die Quelle verweist auf §3.1.4; dieser Verweis ist veraltet, die Taktkonfiguration steht in §2.1.4.

RK3588 HDMI und eDP teilen sich eine COMBPHY. Für HDMI0 und eDP0 bezeichnet hdptxphy_hdmi0 den HDMI-PHY-Knoten und hdptxphy0 den eDP-PHY-Knoten im DTS:

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

Deaktivieren Sie daher beim Einsatz von HDMI die entsprechenden eDP- und eDP-PHY-Knoten. Beispiel HDMI0:

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

#### 2.1.3 Startlogo aktivieren

Ist das U-Boot-Logo deaktiviert, kann auch der Kernel kein Startlogo anzeigen. Ein Bild erscheint erst nach dem Systemstart, wenn Anwendungen Ausgaben erzeugen. Aktivieren Sie route_hdmi im DTS, um das U-Boot-Logo einzuschalten:

```text
&route_hdmi {
   status = "okay";

};
```

Auf Plattformen mit zwei VOPs muss der durch connect angegebene VOP dem HDMI zugeordneten VOP entsprechen; andernfalls können Bildfehler auftreten. Die Quelle verweist auf §3.1.2; der entsprechende Abschnitt zur Zuordnung ist hier §2.1.2.

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

#### 2.1.4 VOP-dclk einer PLL zuordnen

Legen Sie eine PLL-Taktquelle für den dclk des HDMI zugeordneten VOP/VP fest. HDMI auf RK322X, RK3328 und RK3528 ist fest bestimmten VOP/VP-Instanzen zugeordnet und verwendet stets die HDMI-PHY-PLL als dclk-Quelle; dort ist keine Konfiguration erforderlich.

##### 2.1.4.1 PLL-Zuordnung auf RK3288

Der dclk von RK3288 VOPB/VOPL kann GPLL oder CPLL verwenden. Keine dieser PLLs unterstützt gebrochene Frequenzteilung. Deshalb kann RK3288 HDMI nur Standardauflösungen ausgeben, die sich durch ganzzahlige Teilung von 594M ableiten lassen, beispielsweise 4K60, 1080P60 und 720P60. Beispiel mit VOPB-dclk an GPLL und VOPL-dclk an CPLL:

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

##### 2.1.4.2 PLL-Zuordnung auf RK3399

Ordnen Sie auf RK3399 den dclk des HDMI-VOP der VPLL zu. Bei zwei Anzeigen ordnen Sie den dclk des anderen VOP der CPLL zu. Dadurch sind beliebige dclk-Frequenzen und voneinander unabhängige Auflösungen möglich. Konfiguration für HDMI an VOPB:

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

Bei Zuordnung von HDMI zu VOPL:

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

##### 2.1.4.3 PLL-Zuordnung auf RK356X

Auf RK356X muss der dclk des HDMI zugeordneten VP die HPLL verwenden. Beispiel VP0:

```text
&vop {
      status = "okay";
      assigned-clocks = <&cru DCLK_VOP0>;

      assigned-clock-parents = <&pmucru PLL_HPLL>;
};
```

##### 2.1.4.4 PLL-Zuordnung auf RK3588/RK3576

Setzen Sie für RK3588-Ausgaben oberhalb von 4K60 den VOP ACLK auf 800MHz:

```text
&vop {
      assigned-clocks = <&cru ACLK_VOP>;
      assigned-clock-rates = <800000000>;

      status = "okay";
};
```

Für den VOP ACLK von RK3576 ist keine gesonderte Konfiguration erforderlich.

RK3588 HDMI0/1 lässt sich wie in §2.1.2 beschrieben VP0/1/2 zuordnen. Als dclk-Quelle kommen GPLL, HDMI0 PHY PLL, HDMI1 PHY PLL oder V0PLL infrage.

Zu Zuweisungsregeln und Einschränkungen siehe §10.11 von Rockchip_Developer_Guide_DRM_Display_Driver_CN.pdf.

Verwenden Sie auf RK3588/RK3576 die PHY-PLL als VOP-dclk-Quelle, um nicht standardisierte Auflösungen zu unterstützen.

RK3588-DTS-Konfiguration:

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

RK3576-DTS-Konfiguration:

```text
&display_subsystem {
   clocks = <&hdptxphy_hdmi>;
   clock-names = "hdmi0_phy_pll";

};
```

Prüfen Sie mit cat /sys/kernel/debug/clk/clk_summary, ob die Taktzuweisungen im DTS wirksam wurden.

Ist beispielsweise VP0-dclk der HDMI0-PHY-PLL zugeordnet, erscheint dclk_vop0 im Taktbaum unter clk_hdmiphy_pixel0:

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

#### 2.1.5 HDCP auf RK3288/RK3399/RK3528/RK356X aktivieren

##### 2.1.5.1 HDCP 1.4 aktivieren

```text
&hdmi {
   hdcp1x-enable = <1>;

}
```

Spielen Sie nach dem Aktivieren von HDCP 1.4 den entsprechenden Schlüssel mit dem Werkzeug im SDK-Verzeichnis RKTools ein. Das Werkzeug kann je nach Android-Version variieren; beachten Sie die README und wenden Sie sich an den FAE. Den Schlüssel müssen Kunden selbst bei Digital Content Protection LLC beziehen.

Der folgende Knoten aktiviert oder deaktiviert HDCP:

```text
echo 1 > /sys/class/misc/hdmi_hdcp1x/enable
```

1 aktiviert HDCP; 0 deaktiviert es.

Prüfen Sie nach der Aktivierung die HDCP-Funktion mit folgenden Verfahren:

Lesen Sie den HDCP-Status aus diesem Knoten:

```text
cat /sys/class/misc/hdmi_hdcp1x/status
```

Bedeutung der Statuswerte:

| Wert des Statusknotens | Beschreibung |
| --- | --- |
| hdcp disable | HDCP deaktiviert. |
| hdcp_auth_start | HDCP-Authentifizierung gestartet. |
| hdcp_auth_success | Authentifizierung erfolgreich; die verschlüsselte Videoübertragung beginnt. |
| hdcp_auth_fail | HDCP-Authentifizierung fehlgeschlagen. |

Testen Sie einen Fernseher ohne HDCP-1.4-Unterstützung und einen mit Unterstützung. Die Quelle bewertet HDCP als funktionsfähig, wenn nach der Aktivierung der nicht unterstützte Fernseher ein rosa Bild zeigt, während der unterstützte Fernseher normal anzeigt.

##### 2.1.5.2 HDCP 2.2 aktivieren

RK3288/RK3399/RK3528/RK356X unterstützen HDCP 2.2 unter DRM. Zunächst muss HDCP 1.4 korrekt funktionieren. Aktivieren Sie HDCP 2.2 wie folgt:

Beziehen Sie das Werkzeug zum Verpacken des HDCP-2.2-Schlüssels und das Patchpaket vom FAE. Verpacken Sie den Schlüssel und wenden Sie die Patches gemäß README an.

Erstellen und flashen Sie das Image erneut. Aktivieren oder deaktivieren Sie HDCP 2.2 anschließend über:

```text
echo 1 > /sys/class/misc/hdcp2_node/enable
```

Prüfen Sie HDCP 2.2 nach dem Aktivieren mit folgenden Verfahren:

Testen Sie einen Fernseher ohne HDCP-2.2-Unterstützung und einen mit Unterstützung. Die Quelle bewertet HDCP als funktionsfähig, wenn nach der Aktivierung der nicht unterstützte Fernseher ein weißes Bild zeigt und der unterstützte Fernseher normal anzeigt.

Lesen Sie den HDCP-2.2-Status aus:

```text
cat /sys/class/misc/hdcp2_node/status
```

| Statuswert | Beschreibung |
| --- | --- |
| hdcp2 auth sucess | Authentifizierung erfolgreich. |
| no enable hdcp2 | HDCP 2.2 deaktiviert. |
| hdcp2 no auth | HDMI getrennt oder HDCP 2.2 vom Gerät nicht unterstützt. |
| no already auth sucess | Authentifizierung fehlgeschlagen. |

Laden Sie bei fehlgeschlagener Authentifizierung die folgende Protokolldatei in das in der Quelle beschriebene Redmine-Ticketsystem hoch:

```text
/cache/hdcp_tx0.log
```

Alternativ lassen sich Protokolle wie folgt erfassen:

```text
logcat -s HDMI_HDCP2
dmesg | grep hdcp
```

#### 2.1.6 HDCP auf RK3588/RK3576 aktivieren

RK3588/RK3576 unterstützen HDCP 1.4/2.3. Beide werden über die DRM-HDCP-Schnittstelle aktiviert; DRM-Properties steuern die Aktivierung und melden den Status. Beziehen Sie das Beispiel hdcptest.c über den geschäftlichen Ansprechpartner beim Hersteller. Zur Diagnose kann modetest verwendet werden.

Quellpfad von modetest unter Android:

```text
external/libdrm/tests/modetest/
```

Verwenden Sie unter Linux das von Buildroot erstellte modetest. Nach dem Erstellen von rootfs liegt der Quellcode unter:

```text
buildroot/output/rockchip_rk3588/build/libdrm-2.4.115/testst/modetest/
```

Für HDCP-Tests verwendet modetest folgende Properties:

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

Verwenden Sie modetest -w zum Aktivieren oder Deaktivieren von HDCP. Beispiel:

```text
modetest -w 423:"Content Protection":1
------->开启hdcp，优先2.3，若电视不⽀持2.3或2.3认证失败，⾃动切换到1.4。


modetest -w 423:"Content Protection":0
------->关闭hdcp。
```

423 ist die HDMI-Connector-ID. Ermitteln Sie diese mit modetest -c:

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

Ausführliche Anweisungen enthält Rockchip_RK3588_Developer_Guide_HDCP_CN.pdf.

#### 2.1.7 DDC-I2C-Geschwindigkeit konfigurieren

Scheitert das Lesen von EDID beim Ein- oder Ausstecken von HDMI, versuchen Sie, die DDC-I2C-Geschwindigkeit zu verringern.

```text
[ 163.026743] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.130075] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.233407] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!

[ 163.336741] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440074] dwhdmi-rockchip fdea0000.hdmi: i2c read time out!
[ 163.440110] dwhdmi-rockchip fdea0000.hdmi: failed to get edid
```

Die I2C-Geschwindigkeit wird über die High- und Low-Zeiten des Takts eingestellt. Die folgende Konfiguration entspricht den in der Quellumgebung gemessenen 50kHz, nicht einer Messung auf ArmSoM-Hardware.

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <9625>;

   ddc-i2c-scl-low-time-ns = <10000>;
}
```

Skalieren Sie beide Werte proportional, um die Geschwindigkeit zu ändern. Beispiel für 100kHz:

```text
&hdmi {
   ddc-i2c-scl-high-time-ns = <4812>;
   ddc-i2c-scl-low-time-ns = <5000>;

}
```

#### 2.1.8 HDMI-Signalstärke konfigurieren

Unterschiedliche Leiterbahnführungen können unterschiedliche Treiberstärken erfordern. Eine Anpassung kann bei der Untersuchung von Kompatibilitätsproblemen mit Fernsehern helfen.

##### 2.1.8.1 Signalkonfiguration auf RK322X/RK3328/RK3528/RK356X

###### 2.1.8.1.1 RK322X-Signalkonfiguration

Konfigurieren Sie die HDMI-Signalstärke von RK322X mit der DTS-Property rockchip,phy-table. Format:

```text
rockchip,phy-table =
     <165000000 0xaa 0x00 0x44 0x44 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0xaa 0x15 0x6a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0xaa 0x15 0x7a 0xaa 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Am Beispiel der obigen Zeile 340000000:

| Parameter | Beschreibung |
| --- | --- |
| 340000000 | Maximaler TMDS-Takt für diese Zeile. Die Quelle nennt zugleich einen Geltungsbereich unter 165MHz, was dem Wert 340000000 widerspricht. Beide Angaben bleiben bis zur Klärung erhalten. |
| 0xaa | Flankensteilheit Daten-Lane0: bit[1:0]; Daten-Lane1: bit[3:2]; Daten-Lane2: bit[5:4]; Takt-Lane: bit[7:6]. Die Flankensteilheit bestimmt Anstiegs-/Abfallzeit; größere Werte verkürzen diese. |
| 0x15 | Voremphase Daten-Lane0: bit[1:0]; Daten-Lane1: bit[3:2]; Daten-Lane2: bit[5:4]. Größere Werte verstärken die Voremphase. |
| 0x6a | Spannungshub Daten-Lane2: bit[3:0]; Takt-Lane: bit[7:4]. Größere Werte erhöhen die Amplitude. |
| 0xaa | Spannungshub Daten-Lane0: bit[3:0]; Daten-Lane1: bit[7:4]. Größere Werte erhöhen die Amplitude. |
| Alle nachfolgenden Nullwerte | Nicht verwendet |

###### 2.1.8.1.2 RK3328-Signalkonfiguration

Konfigurieren Sie die HDMI-Signalstärke von RK3328 mit der DTS-Property rockchip,phy-table. Format:

```text
rockchip,phy-table =
     <165000000 0x07 0x0a 0x0a 0x0a 0x00 0x00 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>,

     <340000000 0x0b 0x0d 0x0d 0x0d 0x07 0x15 0x08
             0x08 0x08 0x3f 0xac 0xcc 0xcd 0xdd>,
     <594000000 0x10 0x1a 0x1a 0x1a 0x07 0x15 0x08
             0x08 0x08 0x00 0xac 0xcc 0xcc 0xcc>;
```

Am Beispiel der obigen Zeile 340000000:

| Parameter | Beschreibung |
| --- | --- |
| 340000000 | Maximaler TMDS-Takt für diese Zeile. Die Quelle nennt zugleich einen Geltungsbereich unter 165MHz, was dem Wert 340000000 widerspricht. Beide Angaben bleiben bis zur Klärung erhalten. |
| 0x0b | Spannungshub der Takt-Lane; größere Werte erhöhen die Amplitude. |
| 0x0d | Spannungshub der Daten-Lane2; größere Werte erhöhen die Amplitude. |
| 0x0d | Spannungshub der Daten-Lane1; größere Werte erhöhen die Amplitude. |
| 0x0d | Spannungshub der Daten-Lane0; größere Werte erhöhen die Amplitude. |
| 0x07 | Voremphasemodus Daten-Lane0: bit[0]; Daten-Lane1: bit[1]; Daten-Lane2: bit[2]. Voremphasemodus: 0--voller Modus, 1--halber Modus. |
| 0x15 | Voremphasestufe Daten-Lane0: bit[1:0]; Daten-Lane1: bit[3:2]; Daten-Lane2: bit[5:4]. Größere Werte erhöhen die Stärke; null deaktiviert die Voremphase. |
| 0x08 | Voremphase-Spannungshub Daten-Lane2: bit[4:0]. Größere Werte erhöhen die Amplitude. |
| 0x08 | Voremphase-Spannungshub Daten-Lane1: bit[4:0]. Größere Werte erhöhen die Amplitude. |
| 0x08 | Voremphase-Spannungshub Daten-Lane0: bit[4:0]. Größere Werte erhöhen die Amplitude. |
| 0x3f | Freigabe des Voremphase-Treiberpfads Daten-Lane0: bit[0], Haupttreiberpfad: bit[1]; Daten-Lane1 Voremphase-Treiberpfad: bit[2], Haupttreiberpfad: bit[3]; Daten-Lane2 Voremphase-Treiberpfad: bit[4], Haupttreiberpfad: bit[5]; Takt-Lane Voremphase-Treiberpfad: bit[6], Haupttreiberpfad: bit[7]. Schreiben von 1 aktiviert den jeweiligen Pfad. |
| 0xac | Daten-Lane2: zweite Voremphase-Verzögerung bit[0], erste Voremphase-Verzögerung bit[1], zweite Haupttreiber-Verzögerung bit[2], erste Haupttreiber-Verzögerung bit[3]. Takt-Lane: zweite Voremphase-Verzögerung bit[4], erste Voremphase-Verzögerung bit[5], zweite Haupttreiber-Verzögerung bit[6], erste Haupttreiber-Verzögerung bit[7]. Schreiben von 1 aktiviert die Verzögerung. |

| Parameter | Beschreibung |
| --- | --- |
| 0xcc | Daten-Lane0: zweite Voremphase-Verzögerung bit[0], erste Voremphase-Verzögerung bit[1], zweite Haupttreiber-Verzögerung bit[2], erste Haupttreiber-Verzögerung bit[3]. Daten-Lane1: zweite Voremphase-Verzögerung bit[4], erste Voremphase-Verzögerung bit[5], zweite Haupttreiber-Verzögerung bit[6], erste Haupttreiber-Verzögerung bit[7]. Schreiben von 1 aktiviert die Verzögerung. |
| 0xcd | Verzögerungszeit Daten-Lane2: bit[3:0]; Takt-Lane: bit[7:4]. Größere Werte verlängern die Verzögerung. |
| 0xdd | Verzögerungszeit Daten-Lane0: bit[3:0]; Daten-Lane1: bit[7:4]. Größere Werte verlängern die Verzögerung. |

###### 2.1.8.1.3 RK3528-Signalkonfiguration

Konfigurieren Sie die HDMI-Signalstärke von RK3528 mit der DTS-Property rockchip,phy-table. Format:

```text
rockchip,phy-table =
     <165000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00

             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <340000000 0x03 0x04 0x0c 0x12 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>,
     <594000000 0x02 0x08 0x0d 0x18 0x00 0x00 0x00
             0x00 0x00 0x00 0x00 0x00 0x00 0x00>;
```

Am Beispiel der obigen Zeile 340000000:

| Parameter | Beschreibung |
| --- | --- |
| 340000000 | Maximaler TMDS-Takt für diese Zeile. Die Quelle nennt zugleich einen Geltungsbereich unter 165MHz, was dem Wert 340000000 widerspricht. Beide Angaben bleiben bis zur Klärung erhalten. |
| 0x03 | Ruhestromsteuerung der Takt-Lane: 0x00:320uA, 0x0f:920uA, Schritte von 40uA. |
| 0x04 | Ruhestromsteuerung der Daten-Lane: 0x00:320uA, 0x0f:920uA, Schritte von 40uA. |
| 0x0c | Spannungshub der Takt-Lane: bit[4:0]. Größere Werte erhöhen die Amplitude. |
| 0x12 | Spannungshub der Daten-Lane: bit[4:0]; Erkennungsschwelle für ESD-Ereignisse: bit[7:5]. Größere Werte erhöhen jeweils Amplitude beziehungsweise Erkennungsschwelle. |
| 0x00 | Pre-Cursor-Voremphase: bit[2:0]; Post-Cursor-Voremphase: bit[7:4]. Größere Werte erhöhen die Stärke; null deaktiviert die Voremphase. |
| Alle nachfolgenden Nullwerte | Nicht verwendet |

##### 2.1.8.2 Signalkonfiguration auf RK3288/RK3368/RK3399/RK356X

Konfigurieren Sie die HDMI-Signalstärke auf RK3288/RK3368/RK3399/RK356X über rockchip,phy-table im DTS. Format:

`<PIXELCLOCK PHY_CKSYMTXCTRL PHY_TXTERM PHY_VLEVCTRL>`.

PIXELCLOCK ist die höchste Pixeltaktfrequenz, für die diese Zeile gilt.

PHY_CKSYMTXCTRL (Register 0x09) stellt HDMI-Voremphase und Flankensteilheit ein. Eine höhere Voremphase oder ein höherer sloop boost erhöht die DATA-Anstiegs-/Abfallsteilheit und verkürzt die Übergangszeit:

Bit[0]: CLOCK-Freigabe. Bit[3:1]: DATA-Voremphase. Bit[4:5]: DATA sloop boost; die Bitbereichsnotation der Quelle bleibt erhalten.

PHY_TXTERM (Register 0x19) stellt den Abschlusswiderstand ein.

Bit[0:2]: Ein größerer Wert bewirkt einen höheren Abschlusswiderstand.

PHY_VLEVCTRL (Register 0x0e) stellt die HDMI-Signalamplitude ein. Bit[0:4] steuert die Amplitude von tmds_clk +/-; ein kleinerer Wert ergibt eine größere Amplitude. Bit[5:9] steuert die Amplitude von tmds_data +/- mit derselben umgekehrten Beziehung.

Beispiel:

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

Die Zeile <74250000 0x8009 0x0004 0x0272> gilt für Pixeltakte bis 74.25MHz (720p): PHY_CKSYMTXCTRL=0x8009, PHY_TXTERM=0x0004 und PHY_VLEVCTRL=0x0272. Prüfen Sie nach einer Änderung die Registerwerte mit cat /sys/kernel/debug/dw-hdmi/phy, um ihre Wirksamkeit zu bestätigen.

#### 2.1.9 Sonderauflösungen hinzufügen

##### 2.1.9.1 Timing-Definitionen hinzufügen

DRM unterstützt bereits die meisten Timings; einige Sonderauflösungen, beispielsweise gedrehte HDMI-Bildschirme, können jedoch fehlen. Ergänzen Sie Einträge in drm_dmt_modes in kernel/drivers/gpu/drm/drm_edid.c:

```text
/* 0x58 - 4096x2160@59.94Hz RB */
{ DRM_MODE("4096x2160", DRM_MODE_TYPE_DRIVER, 556188, 4096, 4104,

     4136, 4176, 0, 2160, 2208, 2216, 2222, 0,
     DRM_MODE_FLAG_PHSYNC | DRM_MODE_FLAG_NVSYNC) },
```

| Parameter | Beschreibung |
| --- | --- |
| "4096x2160" | Modusname: hdisplay x vdisplay |
| DRM_MODE_TYPE_DRIVER | Modustyp: DRM_MODE_TYPE_DRIVER setzen |
| 556188 | Pixeltakt |
| 4096 | Horizontal aktive Pixel |
| 4104 | Beginn der horizontalen Synchronisation |
| 4136 | Ende der horizontalen Synchronisation |
| 4176 | Gesamtzahl der Pixel je Zeile |
| 0 | hskew, normalerweise 0 |
| 2160 | Aktive Zeilen je Bild |
| 2208 | Beginn der vertikalen Synchronisation |
| 2216 | Ende der vertikalen Synchronisation |
| 2222 | Gesamtzahl der Zeilen je Bild |
| 0 | vscan, normalerweise 0 |
| vrefresh | Bildrate der Anzeige |
| DRM_MODE_FLAG_PHSYNC \| DRM_MODE_FLAG_NVSYNC | Polarität von hsync/vsync; Flags: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |

Die obige Tabelle erläutert die einzelnen Parameter. Die Quelle verweist für Timing-Definitionen auf §3.2.4; dieser Verweis passt nicht zur Nummerierung dieser Ausgabe und muss geprüft werden.

##### 2.1.9.2 PLL-Einstellungen auf RK322X/RK3328/RK3528 ergänzen

Sonderauflösungen auf RK322X/RK3328/RK3528 erfordern zusätzlich Einstellungen der HDMI-PHY-PLL. Zur Berechnung verweist die Quelle auf §2.1.5.2, der inzwischen HDCP behandelt; der Querverweis ist daher ungeklärt.

Fügen Sie beim Ergänzen einer PHY-Konfiguration unter DRM eine Zeile zur PRE-PLL-Tabelle pre_pll_cfg_table hinzu. Die POST-PLL-Tabelle post_pll_cfg_table deckt bereits sämtliche von der PHY unterstützten Auflösungen ab und benötigt keine zusätzliche Zeile. Pfad:

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

Es folgen die Definitionen von struct pre_pll_config und struct post_pll_config. Unter Linux 4.4/4.19 teilen diese faktisch struct ext_pll_config_tab aus Linux 3.10 auf.

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

Parameter von pre_pll_config:

| Parameter | Beschreibung |
| --- | --- |
| pixclock | Pixeltakt des HDMI-Ausgabemodus |
| tmdsclock | TMDS-Takt des HDMI-Ausgabemodus |
| prediv | pre-pll-pre-divider |
| fbdiv | pre-pll-feedback-divider |
| tmds_div_a | tmds-dividera |
| tmds_div_b | tmds-dividerb |
| tmds_div_c | tmds-dividerc |
| pclk_div_a | pclk-dividera |
| pclk_div_b | pclk-dividerb |
| pclk_div_c | pclk-dividerc |
| pclk_div_d | pclk-dividerd |
| vco_div_5_en | Legt fest, ob pin_hd20_pclk direkt aus VCO / 5 stammt; für bestimmte Takte verwendet |
| fracdiv | pre-pll-fractional-feedback-divider |

Parameter von post_pll_config:

| Parameter | Beschreibung |
| --- | --- |
| tmdsclock | TMDS-Takt des HDMI-Ausgabemodus |
| prediv | post-pll-pre-divider |
| fbdiv | post-pll-feedback-divider |
| postdiv | post-pll-post-divider |
| version | Chiprevision: POST-PLL anhand von Takt und Revision wählen. 1: RK322X und frühe RK322XH-Muster bei TMDS &lt;=74.25MHz. 2: Serien-RK322XH bei TMDS &lt;=74.25MHz. 3: RK322X/RK322XH bei TMDS >74.25MHz mit identischen Einstellungen. 4: Einige RK322X-Exemplare sind bei POST VCO=1080MHz instabil, bei 270MHz dagegen stabil und müssen gesondert behandelt werden. 8: RK3528-spezifische Einstellungen. |

Wählen Sie bei TMDS CLOCK=74.25MHz auf Serien-RK3328 die POST-PLL-Einstellungen wie folgt:

(1) Suchen Sie das Intervall für TMDS CLOCK in post_pll_cfg_table. Bei 74.25MHz wählt 33.75MHz < TMDS CLOCK <= 74.25MHz diese beiden Einträge:

```text
{74250000, 1, 40, 8, 1},
{74250000, 18, 80, 8, 2},
```

(2) Wählen Sie anhand der Chiprevision. Für Serien-RK3328 mit TMDS CLOCK <= 74.25MHz gilt version=2; daraus ergibt sich:

```text
{74250000, 18, 80, 8, 2},
```

(3) Die endgültigen Werte sind prediv=18, fbdiv=80 und postdiv=8. Im Linux-3.10-Treiber entsprechen diese ppll_nd, ppll_nf und ppll_no in struct ext_pll_config_tab. Da es sich um einen Serien-RK3328 mit TMDS CLOCK <= 74.25MHz handelt, fügen Sie den Eintrag in RK322XH_V1_PLL_TABLE ein.

##### 2.1.9.3 PLL-Einstellungen auf RK3288/RK3368/RK3399/RK356X ergänzen

Die Einstellungen der HDMI-PHY-PLL für RK3288/RK3368/RK3399/RK356X stehen in rockchip_mpll_cfg und rockchip_mpll_cfg_420:

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

Pfad:

```text
kernel/drivers/gpu/drm/rockchip/dw_hdmi-rockchip.c
```

rockchip_mpll_cfg konfiguriert RGB/YUV444/YUV422; rockchip_mpll_cfg_420 konfiguriert YUV420.

Definition von dw_hdmi_mpll_config:

```text
struct dw_hdmi_mpll_config {
      unsigned long mpixelclock;

      struct {
           u16 cpce;
           u16 gmp;
      } res[DW_HDMI_RES_MAX];
};
```

Parameterbeschreibung:

| Parameter | Beschreibung |
| --- | --- |
| mpixelclock | Pixeltakt |
| cpce | Wert des Registers OPMODE_PLLCFG |
| gmp | Wert des Registers PLLGMPCTRL |

Am Beispiel des ersten Eintrags in rockchip_mpll_cfg:

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

Der HDMI-Treiber prüft zunächst, ob das Farbformat YUV420 ist. Falls ja, wählt er rockchip_mpll_cfg_420, andernfalls rockchip_mpll_cfg. 30666000 bedeutet, dass der Eintrag für Pixeltakte bis einschließlich 30666000 gilt. {0x00b3, 0x0000}, {0x2153, 0x0000} und {0x40f3, 0x0000} entsprechen den Farbtiefen 8, 10 beziehungsweise 12 Bit; die Implementierung der Quelle unterstützt tatsächlich nur 8 und 10 Bit.

Die Parameterwerte erfordern das PHY-Datenblatt. Teilen Sie dem FAE den benötigten Pixeltakt mit, um Einstellungen der HDMI-PHY-PLL zu ergänzen. Fügen Sie anschließend die bereitgestellte Konfiguration nach den obigen Regeln in rockchip_mpll_cfg oder rockchip_mpll_cfg_420 ein.

##### 2.1.9.4 PLL-Einstellungen auf RK3588/RK3576 ergänzen

Die Treiber von RK3588/RK3576 berechnen die PLL-Frequenzen automatisch; beim Ergänzen einer Auflösung ist keine gesonderte PLL-Konfiguration erforderlich.

Zur PLL-Zuordnung siehe §2.1.4.

#### 2.1.10 Audio aktivieren

Auf RK3368 und RK3288 werden HDMI-Soundkarte und Codec standardmäßig gemeinsam genutzt. Prüfen Sie folgende Konfiguration:

```text
&hdmi_analog_sound {
      status = "okay";

}
```

Auf RK3399 teilen sich HDMI und DP die Soundkarte:

```text
&hdmi_dp_sound {
         status = "okay";

};
```

### 2.2 Android-Anzeigeframework konfigurieren

Rockchip ergänzt das Android-Anzeigeframework um Systemeigenschaften, mit denen Anzeigen entsprechend den Produktanforderungen konfiguriert werden.

#### 2.2.1 Primäre und sekundäre Anzeigeschnittstelle

| Property | Funktion |
| --- | --- |
| sys.hwc.device.primary vendor.hwc.device.primary (nach Android 9.0 verwendet) | Primäre Anzeigeschnittstelle zuweisen |
| sys.hwc.device.extend vendor.hwc.device.extend (nach Android 9.0 verwendet) | Sekundäre Anzeigeschnittstelle zuweisen |

Fügen Sie diese beiden Properties in system.prop im Produktkonfigurationsverzeichnis ein, beispielsweise:

```text
device/rockchip/rk3368/rk3368_box/system.prop
```

Sind diese Properties nicht gesetzt, werden standardmäßig Schnittstellen ohne Hotplug-Unterstützung wie CVBS/MIPI/LVDS primär und hotplugfähige HDMI-/DP-Schnittstellen sekundär. Üblicherweise hat jede Rolle eine Schnittstelle. Das RK3399 BOX SDK verwendet beispielsweise standardmäßig HDMI als primäre und DP als sekundäre Anzeige.

```text
sys.hwc.device.primary=HDMI-A
sys.hwc.device.extend=DP
```

Nach Android 9.0 ändern sich die Properties zu:

```text
vendor.hwc.device.primary=HDMI-A
vendor.hwc.device.extend=DP
```

Sind einer primären oder sekundären Rolle mehrere Schnittstellen zugewiesen, haben hotplugfähige Geräte Vorrang. Beispiel der Standardkonfiguration im RK3368 BOX SDK:

```text
sys.hwc.device.primary=HDMI-A,TV
```

Nach Android 9.0 ändern sich die Properties zu:

```text
vendor.hwc.device.primary=HDMI-A,TV
```

Bei angeschlossenem HDMI verwendet die primäre Anzeige HDMI, andernfalls CVBS. Da sich die primäre Framebuffer-Auflösung nicht dynamisch ändern lässt, muss sie ausdrücklich festgelegt werden, wenn zwei oder mehr Schnittstellen als primär dienen. Die Schnittstellennamen sind in hardware/rockchip/hwcomposer/drmresources.cpp definiert:

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

#### 2.2.2 Primäre und sekundäre Schnittstelle abfragen

Diese schreibgeschützten Properties liefern die Namen der primären beziehungsweise sekundären Ausgabeschnittstelle:

| Property | Funktion |
| --- | --- |
| sys.hwc.device.main vendor.hwc.device.main(nach Android 9.0 verwendet) | Primäre Ausgabeschnittstelle abfragen |
| sys.hwc.device.aux vendor.hwc.device.main (nach Android 9.0 verwendet) | Sekundäre Ausgabeschnittstelle abfragen |

#### 2.2.3 Framebuffer-Auflösung

Die Framebuffer-Auflösung bestimmt die Auflösung, in der die Benutzeroberfläche gezeichnet wird, nicht die HDMI-Ausgabeauflösung. Bei unterschiedlichen Auflösungen wird skaliert. Konfigurieren Sie die Framebuffer-Auflösung mit:

```text
persist.sys.framebuffer.main=1920x1080
```

Nach Android 9.0 ändern sich die Properties zu:

```text
persist.vendor.framebuffer.main=1920x1080
```

#### 2.2.4 Auflösungen filtern

Die ursprüngliche Auflösungsliste kann unnötig umfangreich sein. Das HWC-Modul des SDK filtert sie deshalb anhand einer Positivliste:

```text
device/rockchip/common/resolution_white.xml
```

HWC filtert die ursprüngliche Liste mit dieser Konfigurationsdatei, bevor es sie an höhere Schichten weitergibt. Jeder Auflösungsblock im XML definiert eine zulässige Auflösung. Felder:

| Feld | Beschreibung |
| --- | --- |
| clock | Pixeltakt |
| hdisplay | Horizontal aktive Pixel |
| hsync_start | Beginn der horizontalen Synchronisation |
| hsync_end | Ende der horizontalen Synchronisation |
| htotal | Gesamtzahl der Pixel je Zeile |
| hskew | Horizontaler Versatz, normalerweise 0 |
| vdisplay | Aktive Zeilen je Bild |
| vsync_start | Beginn der vertikalen Synchronisation |
| vsync_end | Ende der vertikalen Synchronisation |
| vtotal | Gesamtzahl der Zeilen je Bild |
| vscan | Abtastwert des Bildes, normalerweise 0 |
| vrefresh | Bildrate der Anzeige |
| flags | Flag-Definitionen: DRM_MODE_FLAG_PHSYNC (1&lt;&lt;0) DRM_MODE_FLAG_NHSYNC (1&lt;&lt;1) DRM_MODE_FLAG_PVSYNC (1&lt;&lt;2) DRM_MODE_FLAG_NVSYNC (1&lt;&lt;3) DRM_MODE_FLAG_INTERLACE (1&lt;&lt;4) |
| vic | Durch HDMI definierter VIC; falls nicht definiert, 0 verwenden |

Die Timing-Definitionen sind nachfolgend dargestellt:

![Technische Abbildung aus der chinesischen Quelle, S. 31](/docs/rockchip-hdmi/assets/cn-p31-1.png)

#### 2.2.5 HDMI-Einstellungsoptionen

Über die Oberfläche der Systemeinstellungen lassen sich HDMI-Auflösung und weitere Eigenschaften ändern.

Android 7.x zeigt HDMI-Einstellungen standardmäßig an. Fügen Sie für Android 8.x und neuer folgende Property im Produktverzeichnis unter device hinzu:

```text
BOARD_SHOW_HDMI_SETTING := true
```

Standardmäßig zeigt die Oberfläche nur Einstellungen der sekundären Anzeige. Ändern Sie dafür HdmiSettings.java in package/apps/Settings:

```text
int value = SystemProperties.getInt("persist.hdmi.ui.state", ???);
```

Ersetzen Sie ??? durch 0 für die Einstellungen der sekundären Anzeige, 1 für die primäre Anzeige oder 2 für beide.

### 2.3 Häufige Diagnoseverfahren

#### 2.3.1 VOP-Status prüfen

Prüfen Sie den VOP-Status mit:

```text
cat /sys/kenrel/debug/dri/0/summary
```

![Technische Abbildung aus der chinesischen Quelle, S. 32](/docs/rockchip-hdmi/assets/cn-p32-1.png)

Das obige Protokoll stammt aus der Quelle und zeigt einen RK3399 mit angeschlossenem HDMI. Es enthält drei Arten von Informationen:

VOP-Status: VOPB ist aktiviert, VOPL deaktiviert.

Connector-Zustand: VOPB speist HDMI. bus_format=0x2025 bedeutet YUV444 mit 8 Bit; output_mode=0x0f bedeutet, dass der VOP-Ausgabebus ROCKCHIP_OUT_MODE_AAAA verwendet und 1920x1080P60 ausgibt. Häufige bus_format-Werte sind in uapi/linux/media-bus-format.h des Kernels definiert:

```text
#define MEDIA_BUS_FMT_RGB888_1X24  0x100a //RGB888
#define MEDIA_BUS_FMT_RGB101010_1X30 0x1018 //RGB101010
#define MEDIA_BUS_FMT_YUV8_1X24    0x2025 //YUV444 8bit

#define MEDIA_BUS_FMT_YUV10_1X30   0x2016 //YUV444 10bit
#define MEDIA_BUS_FMT_UYYVYY8_0_5X24 0x2026 //YUV420 8bit
#define MEDIA_BUS_FMT_UYYVYY10_0_5X30 0x2027 //YUV420 10bit
```

Häufige output_mode-Werte sind in drivers/gpu/drm/rockchip/rockchip_drm_vop.h definiert:

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

Ebenenkonfiguration: win0 und win2 sind aktiviert. win2 verwendet einen ARGB-Puffer von 29x37, ein Zielfenster von 29x37 und die linke obere Koordinate (385,543). win0 verwendet einen NV12-Puffer von 3840x2160, ein Zielfenster von 1920x1080 und die linke obere Koordinate (0,0).

#### 2.3.2 Connector-Status prüfen

/sys/class/drm listet die vom Treiber registrierten Grafikgeräte auf. Das folgende Verzeichnisbeispiel des RK3399 BOX enthält card0-HDMI-A-1 und card0-DP-1 für HDMI beziehungsweise DP.

![Technische Abbildung aus der chinesischen Quelle, S. 33](/docs/rockchip-hdmi/assets/cn-p33-1.png)

card0-HDMI-A-1 enthält beispielsweise:

Enabled: Aktivierungszustand.

Status: Verbindungszustand.

Mode: aktuelle Ausgabeauflösung.

Modes: vom angeschlossenen Gerät unterstützte Auflösungen.

Audioformat: vom angeschlossenen Gerät unterstützte Audioformate.

Edid: EDID des angeschlossenen Geräts; mit cat edid > /data/edid.bin speichern.

#### 2.3.3 HDMI-Betrieb prüfen

Der HDMI-Betrieb lässt sich prüfen, wenn der folgende Commit enthalten ist:

```text
commit eaca91814449199b1e6ad0b9fe0bba2215497c97
Author: Zheng Yang <zhengyang@rock-chips.com>

Date: Mon Nov 27 16:56:21 2017 +0800

      drm: bridge: dw-hdmi: add hdmi status debugfs node
```

Lesen Sie den aktuellen HDMI-Ausgabestatus mit:

```text
cat /sys/kernel/debug/dw-hdmi/status
```

![Technische Abbildung aus der chinesischen Quelle, S. 33](/docs/rockchip-hdmi/assets/cn-p33-2.png)

![Technische Abbildung aus der chinesischen Quelle, S. 34](/docs/rockchip-hdmi/assets/cn-p34-1.png)

HDMI Output Status zeigt den PHY-Zustand an. Weitere Einzelheiten erscheinen nur bei aktivierter PHY.

Pixel Clk ist der aktuelle Ausgabepixeltakt.

TMDS Clk ist die aktuelle HDMI-Zeichenrate.

Color Format ist RGB, YUV444, YUV422 oder YUV420.

Color Depth ist 8bit, 10bit, 12bit oder 16bit.

Colorimery bezeichnet den Farbstandard: ITU.BT601, ITU.BIT709 oder ITU.BT2020. Die Schreibweisen der Quelle bleiben erhalten.

EOTF bezeichnet die elektrooptische Übertragungsfunktion für HDR:

| EOTF | Bedeutung |
| --- | --- |
| Unsupported | HDMI kann keine HDR-Informationen senden |
| Not Defined | Nicht definiert |
| Off | Keine HDR-Informationen gesendet |
| SDR | SDR-Kurve |
| ST2084 | ST2084 EOTF |
| HLG | HLG EOTF |

(x0,y0), (x1,y1), (x2,y2), (white x,white y), max lum, min lum, max cll und maxfall sind statische HDR-Deskriptorwerte. Laut Quelle erscheinen sie nur für die EOTF-Werte SDR, ST2084 oder HLG.

Lesen Sie die Register des HDMI-Controllers mit:

```text
cat /sys/kenrel/debug/dw-hdmi/ctrl
```

Register lassen sich auch ändern. Schreiben von 0xF8 in Register 0x1000:

```text
echo 1000 f8 > /sys/kenrel/debug/dw-hdmi/ctrl
```

Lesen Sie auf RK3288/RK3368/RK3399 die HDMI-PHY-Register mit:

```text
cat /sys/kenrel/debug/dw-hdmi/phy
```

PHY-Schreibzugriffe funktionieren ähnlich wie Controller-Schreibzugriffe. Schreiben von 0x8002 in Register 0x06:

```text
echo 06 8002 > /sys/kenrel/debug/dw-hdmi/phy
```

#### 2.3.4 HDMI-CEC-Status prüfen

Lesen Sie den HDMI-CEC-Status mit:

```text
cat /sys/kernel/debug/cec/cec0/status
```

![Technische Abbildung aus der chinesischen Quelle, S. 35](/docs/rockchip-hdmi/assets/cn-p35-1.png)

Bedeutung der obigen Ausgabe:

configured: Gibt an, ob der CEC-Adapter konfiguriert ist; 1=ja, 0=nein.

configuring: Gibt an, ob die Konfiguration läuft; 1=läuft, 0=abgeschlossen oder noch nicht begonnen.

phys_addr: physische CEC-Adresse; f.f.f.f bedeutet, dass noch keine physische Adresse ermittelt wurde.

number of LAs: Anzahl logischer Adressen, normalerweise 1, selten 2.

LA mask stellt zugewiesene logische Adressen als (1 << logical_address) dar. Beispielsweise ergibt 0x0010 um 4 Bit nach rechts verschoben den Wert 1 und bezeichnet Adresse 4; 0x0800 um 11 Bit nach rechts verschoben ergibt 1 und bezeichnet Adresse 11. 0x0000 bedeutet, dass keine Adresse zugewiesen ist.

has CEC follower bedeutet, dass empfangene CEC-Nachrichten im Userspace verarbeitet werden. in passthrough mode bedeutet, dass der Kernel CEC-Kernnachrichten nicht selbst verarbeitet, sondern alle an den Userspace weiterleitet.

pending transmits ist die Anzahl der zum Senden anstehenden CEC-Nachrichten.

#### 2.3.5 HDMI zwangsweise ein- oder ausschalten

HDMI zwangsweise einschalten:

```text
echo on > /sys/class/drm/card0-HDMI-A-1/status
```

HDMI zwangsweise ausschalten:

```text
echo off > /sys/class/drm/card0-HDMI-A-1/status
```

Hotplug-Erkennung wiederherstellen:

```text
echo detect > /sys/class/drm/card0-HDMI-A-1/status
```

#### 2.3.6 Auflösung über die Kommandozeile einstellen

Die Android-Auflösung lässt sich durch Setzen von Properties über die Kommandozeile ändern. Änderungen in den Systemeinstellungen aktualisieren ebenfalls die entsprechenden Properties, wie nachfolgend beschrieben.

##### 2.3.6.1 Auflösung unter Android 7.x und 8.x

| Property | Beschreibung |
| --- | --- |
| persist.sys.resolution.main | Primäre Auflösung anhand ihres Timings festlegen; Quellenverweis §3.2.4, hier §2.2.4. |
| persist.sys.resolution.aux | Sekundäre Auflösung anhand ihres Timings festlegen; Quellenverweis §3.2.4, hier §2.2.4. |
| sys.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Stellen Sie die primäre/sekundäre Auflösung über persist.sys.resolution.main und persist.sys.resolution.aux ein. Erhöhen Sie nach jeder Änderung sys.display.timeline um 1 und lösen Sie eine Aktualisierung der Benutzeroberfläche aus, etwa durch Bewegen der Maus, um sie anzuwenden. Beispiele:

4K60 einstellen:

```text
setprop persist.sys.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5
setprop sys.display.timeline 1
```

1080p60 einstellen:

```text
setprop persist.sys.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5
setprop sys.display.timeline 2
```

720P60 einstellen:

```text
setprop persist.sys.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5

setprop sys.display.timeline 3
```

480P60 einstellen:

```text
setprop persist.sys.resolution.main 720x480@59.94-736-798-858-489-495-525-a
setprop sys.display.timeline 4
```

##### 2.3.6.2 Auflösung unter Android 9.0 und neuer

Ältere und neuere Android-9.0-Versionen verwenden je nach HWC-Version unterschiedliche Auflösungs-Properties. Neue Android-9.0-SDKs und spätere Android-Versionen verwenden die neuen Properties.

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

Enthält HWC den obigen Commit, verwendet es die neuen Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.resolution.HDMI-A-0 | HDMI0-Auflösung einstellen; für HDMI1 HDMI-A-1 verwenden. Der Wert ist das Timing; Quellenverweis §3.2.4, hier §2.2.4. |
| vendor.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Ohne die obige Änderung verwendet HWC die alten Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.resolution.main | Primäre Auflösung anhand ihres Timings festlegen; Quellenverweis §3.2.4, hier §2.2.4. |
| persist.vendor.resolution.aux | Sekundäre Auflösung anhand ihres Timings festlegen; Quellenverweis §3.2.4, hier §2.2.4. |
| vendor.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Stellen Sie die primäre/sekundäre Auflösung über persist.vendor.resolution.main und persist.vendor.resolution.aux ein. Erhöhen Sie nach jeder Änderung vendor.display.timeline um 1 und lösen Sie eine Aktualisierung der Benutzeroberfläche aus, beispielsweise durch Bewegen der Maus. Beispiele:

4K60 einstellen:

```text
setprop persist.vendor.resolution.main 3840x2160@60-3840-4016-4104-4400-2160-2168-2178-2250-5

setprop vendor.display.timeline 1
```

1080p60 einstellen:

```text
setprop persist.vendor.resolution.main 1920x1080@60-1920-2008-2052-2200-1080-1084-1089-1125-5

setprop vendor.display.timeline 2
```

720P60 einstellen:

```text
setprop persist.vendor.resolution.main 1280x720@60.00-1390-1430-1650-725-730-750-5
setprop vendor.display.timeline 3
```

480P60 einstellen:

```text
setprop persist.vendor.resolution.main 720x480@59.94-736-798-858-489-495-525-
a
setprop vendor.display.timeline 4
```

#### 2.3.7 Farbe über die Kommandozeile einstellen

Die Android-Farbausgabe lässt sich über Kommandozeilen-Properties konfigurieren. Änderungen in den Systemeinstellungen aktualisieren ebenfalls diese Properties, wie nachfolgend beschrieben.

##### 2.3.7.1 Farbe unter Android 7.x und 8.x

| Property | Beschreibung |
| --- | --- |
| persist.sys.color.main | Primäre Farbe als Format-Tiefe festlegen, z. B. RGB-8bit für RGB mit 8 Bit je Komponente (24-Bit-RGB). Formate: RGB, YCBCR444, YCBCR422, YCBCR420. Tiefen: 8bit, 10bit. |
| persist.sys.color.aux | Sekundäre Farbe festlegen; Parameter wie bei der primären Anzeige. |
| sys.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Stellen Sie die primäre/sekundäre Farbe mit persist.sys.color.main und persist.sys.color.aux ein. Erhöhen Sie nach jeder Änderung sys.display.timeline um 1 und aktualisieren Sie anschließend die Benutzeroberfläche, beispielsweise durch Bewegen der Maus. Beispiel:

```text
setprop persist.sys.color.main RGB-8bit
setprop sys.display.timeline 1
```

Ausgabe auf RGB mit 8 Bit je Komponente (24-Bit-RGB) einstellen.

##### 2.3.7.2 Farbe unter Android 9.0 und neuer

Wie bei den Auflösungseinstellungen in §2.3.6.2, in der Quelle §3.3.6.2, verwenden alte und neue Android-Versionen unterschiedliche Farb-Properties.

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

Enthält HWC den obigen Commit, verwendet es die neuen Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.color.HDMI-A-0 | HDMI0-Farbe einstellen; für HDMI1 HDMI-A-1 verwenden. Format: Farbe-Tiefe, z. B. RGB-8bit für RGB mit 8 Bit je Komponente (24-Bit-RGB). Formate: RGB, YCBCR444, YCBCR422, YCBCR420. Tiefen: 8bit, 10bit. |
| vendor.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Ohne die obige Änderung verwendet HWC die alten Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.color.main | Primäre Farbe als Format-Tiefe festlegen, z. B. RGB-8bit für RGB mit 8 Bit je Komponente (24-Bit-RGB). Formate: RGB, YCBCR444, YCBCR422, YCBCR420. Tiefen: 8bit, 10bit. |
| persist.vendor.color.aux | Sekundäre Farbe festlegen; Parameter wie bei der primären Anzeige. |
| vendor.display.timeline | Anzeige-Zeitachse aktualisieren; bei jeder neuen Auflösung um eins erhöhen. |

Stellen Sie die primäre/sekundäre Farbe mit persist.vendor.color.main und persist.vendor.color.aux ein. Erhöhen Sie nach jeder Änderung vendor.display.timeline um 1 und aktualisieren Sie anschließend die Benutzeroberfläche, beispielsweise durch Bewegen der Maus. Beispiel:

```text
setprop persist.vendor.color.main RGB-8bit
setprop vendor.display.timeline 1
```

RGB-Ausgabe mit 8 Bit je Komponente (24-Bit-RGB) einstellen.

#### 2.3.8 Overscan-Einstellungen

Unterschiede zwischen Fernsehern können dazu führen, dass das Bild über den Bildschirm hinausragt oder schwarze Ränder entstehen. Korrigieren Sie dies durch Anpassung der Overscan-Skalierung.

Unter Android lässt sich Overscan über Kommandozeilen-Properties oder die Systemeinstellungen ändern. Die Systemeinstellungen aktualisieren ebenfalls die entsprechenden Properties, wie nachfolgend beschrieben.

##### 2.3.8.1 Overscan unter Android 7.x und 8.x

| Property | Beschreibung |
| --- | --- |
| persist.sys.overscan.main | Primären Overscan einstellen. Format: overscan left,top,right,bottom. Dies sind die Overscan-Werte für links, oben, rechts und unten. Minimum=1; Maximum=persist.sys.overscan.max oder, falls nicht gesetzt, 100. |
| persist.sys.overscan.aux | Sekundären Overscan einstellen; Parameter wie bei der primären Anzeige. |

Beispiel:

```text
setprop persist.sys.overscan.main "overscan 70,70,70,70"
```

Overscan in allen vier Richtungen auf 70 setzen.

##### 2.3.8.2 Overscan unter Android 9.0 und neuer

Wählen Sie die Properties entsprechend der Android-Version wie in §2.3.6.2; Quellenverweis: §3.3.6.2.

Neue Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.overscan.HDMI-A-0 | HDMI0-Overscan einstellen; die Quelle spricht hier von Farbe. Für HDMI1 HDMI-A-1 verwenden. Format: overscan left,top,right,bottom. Dies sind die Overscan-Werte für links, oben, rechts und unten. Minimum=1; Maximum=persist.vendor.overscan.max oder, falls nicht gesetzt, 100. |

Alte Properties:

| Property | Beschreibung |
| --- | --- |
| persist.vendor.overscan.main | Primären Overscan einstellen. Format: overscan left,top,right,bottom. Dies sind die Overscan-Werte für links, oben, rechts und unten. Minimum=1; Maximum=persist.vendor.overscan.max oder, falls nicht gesetzt, 100. |
| persist.vendor.overscan.aux | Sekundären Overscan einstellen; Parameter wie bei der primären Anzeige. |

Beispiel:

```text
setprop persist.vendor.overscan.main "overscan 70,70,70,70"
```

Overscan in allen vier Richtungen auf 70 setzen.

#### 2.3.9 Helligkeit, Kontrast, Sättigung und Farbton

Android unterstützt diese Parameter über Kommandozeilen-Properties und Systemeinstellungen. Die Systemeinstellungen aktualisieren die entsprechenden Properties, wie nachfolgend beschrieben.

##### 2.3.9.1 Helligkeit, Kontrast, Sättigung und Farbton unter Android 7.x und 8.x

| BCSH | Bereich | Beschreibung |
| --- | --- | --- |
| Helligkeit | Ganzzahl 0–100, Standard 50 | persist.sys.brightness.main persist.sys.brightness.aux |
| Kontrast | Ganzzahl 0–100, Standard 50 | persist.sys.contrast.main persist.sys.contrast.aux |
| Sättigung | Ganzzahl 0–100, Standard 50 | persist.sys.saturation.main persist.sys.saturation.aux |
| Farbton | Ganzzahl 0–100, Standard 50 | persist.sys.hue.main persist.sys.hue.aux |

Beispiel:

```text
setprop persist.sys.brightness.main 70
setprop vendor.display.timeline 1
```

Stellen Sie die Helligkeit der primären Anzeige über persist.sys.brightness.main ein. Erhöhen Sie nach jeder Änderung vendor.display.timeline um 1 und aktualisieren Sie die Benutzeroberfläche, beispielsweise durch Bewegen der Maus. Die vendor-Property der Quelle in diesem Abschnitt zu älterem Android bleibt bis zur Klärung erhalten.

##### 2.3.9.2 Helligkeit, Kontrast, Sättigung und Farbton unter Android 9.0 und neuer

Wählen Sie die Properties entsprechend der Android-Version wie in §2.3.6.2; Quellenverweis: §3.3.6.2.

Neue Properties:

| BCSH | Bereich | Beschreibung |
| --- | --- | --- |
| Helligkeit | Ganzzahl 0–100, Standard 50 | persist.vendor.brightness.HDMI-A-0 |
| Kontrast | Ganzzahl 0–100, Standard 50 | persist.vendor.contrast.HDMI-A-0 |
| Sättigung | Ganzzahl 0–100, Standard 50 | persist.vendor.saturation.HDMI-A-0 |
| Farbton | Ganzzahl 0–100, Standard 50 | persist.vendor.hue.HDMI-A-0 |

Alte Properties:

| BCSH | Bereich | Beschreibung |
| --- | --- | --- |
| Helligkeit | Ganzzahl 0–100, Standard 50 | persist.vendor.brightness.main persist.vendor.brightness.aux |
| Kontrast | Ganzzahl 0–100, Standard 50 | persist.vendor.contrast.main persist.vendor.contrast.aux |
| Sättigung | Ganzzahl 0–100, Standard 50 | persist.vendor.saturation.main persist.vendor.saturation.aux |
| Farbton | Ganzzahl 0–100, Standard 50 | persist.vendor.hue.main persist.vendor.hue.aux |

Beispiel:

```text
setprop persist.vendor.brightness.main 70
setprop sys.display.timeline 1
```

Stellen Sie die Helligkeit der primären Anzeige über persist.vendor.brightness.main ein, erhöhen Sie nach jeder Änderung vendor.display.timeline um 1 und aktualisieren Sie anschließend die Benutzeroberfläche, etwa durch Bewegen der Maus.

### 2.4 Fehlerdiagnose

#### 2.4.1 Kein Signal, nicht unterstütztes Format, instabiles Bild oder farbige Punkte/Linien nach Anschluss oder Auflösungsänderung

(1) Prüfen Sie die aktuelle HDMI-Auflösung (§2.3.2; Quellenverweis §3.3.2).

(2) Verringern Sie die HDMI-Auflösung und prüfen Sie, ob der Fernseher normal anzeigt (§2.3.6; Quellenverweis §3.3.6).

(3) Testen Sie ein nachweislich funktionierendes HDMI-Kabel.

(4) Stellen Schritte 2 oder 3 das Bild wieder her, ist meist die Kompatibilität der physikalischen Signale betroffen. Prüfen Sie die Hardware und messen Sie zur weiteren Analyse die HDMI-Signale.

(5) Erfüllen die HDMI-Signale die Anforderungen nicht, passen Sie die HDMI-PHY-Einstellungen an (§2.1.8; Quellenverweis §3.1.7).

#### 2.4.2 Kein Signal oder nicht unterstütztes Format während der Videowiedergabe

Prüfen Sie, ob das Kernel-DTS eine videobezogene DDR-Frequenzskalierung aktiviert. Falls ja, setzen Sie auto-freq-en = <0>;, um die automatische Skalierung für diesen Diagnosetest zu deaktivieren.

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

#### 2.4.3 Kein Signal, schwarzes Bild oder Bildfehler auf manchen Fernsehern

(1) Prüfen Sie die aktuelle HDMI-Auflösung (§2.3.2; Quellenverweis §3.3.2).

(2) Verringern Sie die HDMI-Auflösung und prüfen Sie die Anzeige (§2.3.6; Quellenverweis §3.3.6).

(3) Testen Sie ein nachweislich funktionierendes HDMI-Kabel.

(4) Funktioniert die Anzeige nach Schritt 2 oder 3 wieder, deutet dies meist auf die Kompatibilität der physikalischen HDMI-Signale hin. Prüfen Sie die Hardware und testen Sie die HDMI-Signale.

(5) Erfüllen die Signale die Anforderungen nicht, passen Sie die HDMI-PHY-Einstellungen an (§2.1.8; Quellenverweis §3.1.7).

(6) Erfüllen die HDMI-Signale die Anforderungen, versuchen Sie folgende Registerwerte zu ändern:

```text
kernel\drivers\gpu\drm\bridge\synopsys\dw-hdmi.c
/* HDMI Initialization Step B.4 */
static void dw_hdmi_enable_video_path(struct dw_hdmi *hdmi)
{

   /* control period minimum duration */
   hdmi_writeb(hdmi, 12, HDMI_FC_CTRLDUR);
```

Erhöhen Sie HDMI_FC_CTRLDUR schrittweise bis höchstens 223 und prüfen Sie, ob die normale Anzeige zurückkehrt.

#### 2.4.4 Standardauflösung bei fehlgeschlagenem EDID-Lesen

```text
Commit 727e0fe68d8f422698f4e257cb7c04f90b8692c0
Author: xuhuicong xhc@rock-chips.com

Date: Tue Sep 26 17:32:56 2017 +0800
drm/edid: output common tv resolution and hdmi mode if no read the correct edid
Change-Id: Ib7379340e8c1d59382553d21b60165fe5fb371e8
Signed-off-by: xuhuicong xhc@rock-chips.com
```

Ist der obige Commit enthalten, ändern Sie def_modes auf den benötigten VIC. Im folgenden Beispiel entspricht 4 der Auflösung 720P60.

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

#### 2.4.5 Eine bestimmte Ausgabeauflösung erzwingen

Prüfen Sie für RK3288/RK3368/RK3399/RK356X das Vorhandensein dieses Commits, um EDID-Einschränkungen zu ignorieren und eine Auflösung zu erzwingen:

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

Prüfen Sie auf RK3588/RK3576 das Vorhandensein dieses Commits:

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

Mit diesen Commits können Sie die benötigte Auflösung und das Farbformat direkt im DTS konfigurieren:

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

(1) force-output: Flag zum Erzwingen der HDMI-Ausgabe.

(2) force-bus-format: Angegebenes Farbformat erzwingen.

(3) force_timing: Angegebenes Auflösungstiming erzwingen.

Fehlen diese Commits, nehmen Sie folgende Änderungen vor:

![Technische Abbildung aus der chinesischen Quelle, S. 46](/docs/rockchip-hdmi/assets/cn-p46-1.png)

Übertragung des lesbaren Quellcodes. Der Screenshot selbst ist beschnitten; dies ist kein vollständiger anwendbarer Patch.

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

(1) Setzen Sie das erste Element des Arrays def_mode auf den VIC der gewünschten Auflösung.

(2) Setzen Sie edid = NULL;, um den Fehlerpfad für EDID zu erzwingen und unabhängig vom tatsächlichen EDID-Leseergebnis def_modes zu verwenden.

(3) Kommentieren Sie für erzwungenes 4K außerdem den in der Abbildung markierten Code aus, um die 4K-Beschränkung aufzuheben.

Prüfen Sie beim Erzwingen von HDMI-2.0-Auflösungen oberhalb von 4K30 oder höheren Modi, ob die Senke SCDC-Kommunikation benötigt. Falls ja, muss HDMI DDC funktionieren. Erzwungene Ausgabe unterstützt kein HDMI-Hotplug.

#### 2.4.6 Keine HDMI-Anzeige im Recovery-Modus

Recovery unterstützt weder zwei Anzeigen noch Hotplug. Ergänzen Sie für HDMI-Ausgabe die folgende Änderung, falls sie fehlt, und starten Sie mit bereits angeschlossenem HDMI.

![Technische Abbildung aus der chinesischen Quelle, S. 46](/docs/rockchip-hdmi/assets/cn-p46-2.png)

Übertragung des lesbaren Quellcodes. Der Screenshot selbst ist beschnitten; dies ist kein vollständiger anwendbarer Patch.

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

#### 2.4.7 HDMI-Auflösung lässt sich in den Einstellungen nicht ändern

(1) Prüfen Sie die primäre/sekundäre Zuordnung und die Konfiguration der Einstellungen (§2.2.1 und §2.2.5; Quellenverweise §3.2.1 und §3.2.5).

(2) Prüfen Sie die Auflösungs-Properties (§2.3.6; Quellenverweis §3.3.6).

(3) Android 9.x und neuer erfordern RkOutputManager. Aktualisieren Sie den RK3399-Code auf diesen Commit:

![Technische Abbildung aus der chinesischen Quelle, S. 47](/docs/rockchip-hdmi/assets/cn-p47-1.png)

Übertragung des lesbaren Quellcodes. Der Screenshot selbst ist beschnitten; dies ist kein vollständiger anwendbarer Patch.

```text
commit 3550c7dd16aea55c67b58e45d42301d94216f665
Author: Wh <wanghang@rock-chips.com>
Date:   Wed Apr 3 15:56:06 2019 +0800

    rk3399: mid add hdmi config

    Change-Id: I0705b537f9fe110bb06ae6390caaa8886f8d36a6
    Signed-off-by: wh <wanghang@rock-chips.com>

wh@ubuntu:~/3399_9.0/device/rockchip/rk3399$
```

(4) Andere Android-9.0-Plattformen benötigen den entsprechenden Patch. Führen Sie nach den projektspezifischen Befehlen source und lunch den Befehl get_build_var DEVICE_MANIFEST_FILE aus, um das aktive Manifest zu bestimmen. Gibt er device/rockchip/common/manifest.xml aus, ergänzen Sie in dieser Datei:

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

#### 2.4.8 Unzureichende DDR-Bandbreite

Prüfen Sie bei Flimmern oder blinkenden grünen Linien unter hohen Auflösungen wie 4K das Kernelprotokoll auf:

```text
[drm:vop_isr] ERROR POST_BUF_EMPTY irq err
```

Dieses Protokoll weist auf unzureichende DDR-Bandbreite hin. Siehe §9.7 in Rockchip_RK3399_Developer_Guide_Android7.1_Software_CN&EN.pdf.

#### 2.4.9 Probleme mit einer 4K-Benutzeroberfläche

(1) Ist eine 4K-Benutzeroberfläche notwendig?

Die Quelle rät wegen des Ressourcenverbrauchs von einer 4K-Benutzeroberfläche ab und nennt für ihre Umgebung eine Grenze von ungefähr 4K25Hz. Dies ist kein ArmSoM-Benchmark. Für die reine Wiedergabe von 4K-Videos oder Anzeige von 4K-Bildern ist eine 4K-Benutzeroberfläche unnötig: Der Standardplayer und die Bildanzeige unterstützen diese Anwendungen.

(2) Wie wird eine 4K-Benutzeroberfläche konfiguriert?

Setzen Sie die Framebuffer-Auflösung wie in §2.2.3 beschrieben auf 4K; Quellenverweis §3.2.3.

(3) Flimmern nach Aktivierung der 4K-Benutzeroberfläche: Prüfen Sie die DDR-Bandbreite. Die Quelle verweist auf §3.4.10; der entsprechende Diagnoseabschnitt ist hier §2.4.8.

#### 2.4.10 Keine 4K-Auflösung in der HDMI-Einstellungsliste

(1) Bestätigen Sie, dass der Fernseher 4K unterstützt.

(2) Prüfen Sie, ob die HDMI-Modusliste des Kernels 4K enthält:

```text
cat /sys/class/drm/card0-HDMI-A-1/modes
```

(3) Falls nicht, prüfen Sie auf RK3288/RK3399 mit zwei VOPs die Zuordnung von HDMI zu VOPB. Alternativ unterstützt der Fernseher möglicherweise kein YUV420 für 4K50/60, wodurch die Möglichkeiten der Plattform überschritten werden; siehe Tabelle der maximalen Auflösungen in Kapitel 1.

(4) Listet der Kernel 4K auf, die Einstellungen jedoch nicht, prüfen Sie die Auflösungs-Positivliste (§2.2.4; Quellenverweis §3.2.4).

#### 2.4.11 Kein 8K-Modus in den HDMI-Einstellungen von RK3588

(1) Prüfen Sie, ob der Fernseher den HDMI-2.1-Modus oder Spielmodus verwendet. Bei den meisten 8K-Fernsehern muss dieser manuell ausgewählt werden, bevor sie 8K-Modi anbieten.

(2) Prüfen Sie VOP ACLK=800MHz (§2.1.4.4; Quellenverweis §3.1.5).

#### 2.4.12 Flimmern oder fehlerhafte Ausgabe bei 8K/4K120 auf RK3588/RK3576

(1) Prüfen Sie das HDMI-Kabel. Die Quelle verlangt für HDMI-2.1-Modi ein HDMI-2.1-Kabel.

(2) Stellen Sie dem Rockchip-Hardwaresupport HDMI-Schaltpläne und Leiterplattenzeichnungen zur Prüfung bereit.

(3) Vereinbaren Sie einen SI-Test mit einem externen Labor oder beantragen Sie über den geschäftlichen Ansprechpartner einen Test durch das Rockchip-Hardwarelabor.

#### 2.4.13 Einen HDMI-Zertifizierungsantrag ausfüllen

HDMI-Zertifizierungsstellen stellen normalerweise ein Antragsformular bereit, meist als Excel-Arbeitsmappe.

Prüfen Sie zunächst die Tabellenblattregister am unteren Rand, beispielsweise:

![Technische Abbildung aus der chinesischen Quelle, S. 48](/docs/rockchip-hdmi/assets/cn-p48-1.png)

Jede HDMI-Funktion erfordert Angaben im jeweiligen Tabellenblatt. Blätter zu nicht unterstützten Funktionen müssen nicht ausgefüllt werden. Häufige Blätter sind:

General ist normalerweise verpflichtend und enthält grundlegende Geräteinformationen: Anzahl der HDMI-Ein-/Ausgänge und HDCP-/CEC-Unterstützung. Diese Angaben bestimmen, welche weiteren Blätter erforderlich sind. Beispielsweise bedeutet HDMI_input_count=0, dass kein HDMI-Eingang vorhanden ist; Sink CDF ist dann nicht nötig.

![Technische Abbildung aus der chinesischen Quelle, S. 49](/docs/rockchip-hdmi/assets/cn-p49-1.png)

Source CDF ist für Geräte mit HDMI-Ausgängen erforderlich; deren Anzahl wird in General eingetragen. Gefragt sind üblicherweise unterstützte Ausgabeauflösungen, Farbformate und zugehörige Fähigkeiten.

![Technische Abbildung aus der chinesischen Quelle, S. 49](/docs/rockchip-hdmi/assets/cn-p49-2.png)

Sink CDF ist für Geräte mit HDMI-Eingängen erforderlich. Gefragt sind normalerweise unterstützte Eingabeauflösungen, Farbformate und EDID-Informationen.

Repeater CDF ist erforderlich, wenn das Gerät als HDMI-Repeater arbeitet. Die Quelle merkt an, dass Rockchip-Lösungen diese Produktform üblicherweise nicht verwenden.

Jedes Blatt enthält normalerweise mehrere Tabellen, die wie gewöhnliche Excel-Tabellen ausgefüllt werden. Beispiel: die Tabelle Video in Source CDF:

![Technische Abbildung aus der chinesischen Quelle, S. 50](/docs/rockchip-hdmi/assets/cn-p50-1.png)

Füllen Sie jedes Feld gemäß dem tatsächlichen Gerät aus. Bei Source_HDMI_YCbCr oben bezeichnen die Spalten Feldname, Beschreibung, zulässige Werte und Antwort des Antragstellers. Gefragt wird, ob HDMI YCbCr ausgeben kann. Wählen Sie bei Unterstützung Y, andernfalls N.

Das Formular enthält zu viele Felder, um sie hier einzeln zu erläutern. Stellen Sie Fragen zu bestimmten Feldern im Redmine-Ticketsystem des Herstellers.

{% endraw %}
