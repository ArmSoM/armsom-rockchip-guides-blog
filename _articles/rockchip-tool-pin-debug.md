---
title: "PinDebug: inspect Rockchip IOMUX, GPIO and voltage domains"
description: "PinDebug connects pin-function planning with the registers currently configured on a target. It is useful when an interface fails because a pad remains assigned to GPIO or another peripheral."
excerpt: "PinDebug connects pin-function planning with the registers currently configured on a target. It is useful when an interface fails because a pad remains assigned to GPIO or another peripheral."
translation_key: "rockchip-tool-pin-debug"
slug: "rockchip-tool-pin-debug"
lang: "en"
date: "2026-11-15"
author: "ArmSoM"
category: "interfaces"
products: []
tags: ["ArmSoM", "Rockchip", "Tools", "PinDebug"]
---

{% raw %}

![PinDebug](/assets/rockchip-tools/flows/pin-debug-en.svg)

## Complete PinDebug V1.1 workflow

The manual lists RK3588, RK3566, RK3568, RV1126, RV1109, RV1106, RV1103 and RK3528. PinDebug queries IOMUX and configures pin properties; the supplied Windows 1.18 and Linux 1.11 interfaces may differ. The following covers source sections 1.1–1.11; illustrations retain the original Chinese interface.

### 1.1 Open a project

Select the SoC before any operation. The Pin page shows multiplexing by pin/GPIO: search by Function, right-click a Function to print its configuration command, or double-click while connected to apply it directly. Pin and IO-number columns are sortable. The IOmux page groups controllable signals by module.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f01.png" alt="Select the chip and open a project" width="551" height="242" style="width:100%;max-width:551px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 1: Select the chip and open a project</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p02-f02.png" alt="Pins and alternate functions in the Pin view" width="1026" height="380" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 2: Pins and alternate functions in the Pin view</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f01.png" alt="Browse IOmux by functional module" width="1026" height="425" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 3: Browse IOmux by functional module</strong></figcaption>
</figure>

### 1.2 Connect the device

Communication uses ADB. Open the project, enable ADB on the device, connect the host and click the toolbar connection icon.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f02.png" alt="Connect the device" width="738" height="152" style="width:100%;max-width:738px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 4: Connect the device</strong></figcaption>
</figure>

### 1.3 Read IOMUX

Read all IOMUX registers to update both Pin and IOmux pages. Offline definitions do not replace actual device readback.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f03.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p03-f03.png" alt="Read IOMUX from the device" width="879" height="149" style="width:100%;max-width:879px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 5: Read IOMUX from the device</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f01.png" alt="Current functions in the IOmux view" width="1026" height="606" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 6: Current functions in the IOmux view</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p04-f02.png" alt="Enabled functions highlighted in the Pin view" width="1026" height="516" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 7: Enabled functions highlighted in the Pin view</strong></figcaption>
</figure>

### 1.4 Modify IOMUX

Checking a functional IO in IOmux selects that function; clearing it selects GPIO. A conflict prompt allows cancellation or confirmation.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f01.png" alt="Alternate-function conflict prompt" width="554" height="249" style="width:100%;max-width:554px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 8: Alternate-function conflict prompt</strong></figcaption>
</figure>

### 1.5 Pull and drive settings

Select an enabled functional IO and right-click to read or modify pull configuration and drive strength. The original figures use EMMC_CLKOUT; check whether the storage controller is actively using it before changes.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f02.png" alt="Inspect EMMC_CLKOUT pull and drive strength" width="897" height="276" style="width:100%;max-width:897px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 9: Inspect EMMC_CLKOUT pull and drive strength</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f03.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p05-f03.png" alt="Configure EMMC_CLKOUT properties" width="557" height="271" style="width:100%;max-width:557px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 10: Configure EMMC_CLKOUT properties</strong></figcaption>
</figure>

### 1.6 Read and modify GPIO data

The source uses GPIO1C3. The GPIO-function checkbox indicates GPIO mode; direction comes from GPIO `ddr`, output level from `dr`, IO voltage from PMU `vsel`, and port level from `ext_port`. Here `ddr` is a direction register, not DDR memory.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f01.png" alt="GPIO status and signal levels" width="1026" height="315" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 11: GPIO status and signal levels</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f02.png" alt="Configure GPIO1C3 properties" width="533" height="401" style="width:100%;max-width:533px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 12: Configure GPIO1C3 properties</strong></figcaption>
</figure>

### 1.7 Read regulators

The tool reads the device regulator-summary node with `cat` and parses all domains. The manual does not specify the complete node path.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f03.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p06-f03.png" alt="Read regulator information" width="1026" height="292" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 13: Read regulator information</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f01.png" alt="Regulator and power-domain information" width="1026" height="413" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 14: Regulator and power-domain information</strong></figcaption>
</figure>

### 1.8 Read voltage-domain selection

The tool parses the voltage-selection register into a domain list. Section 1.8 spells it `vesl`, while 1.6 says `vsel`; this source discrepancy is retained. A selection value is not a measured voltage.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f02.png" alt="Read voltage-domain selection" width="566" height="160" style="width:100%;max-width:566px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 15: Read voltage-domain selection</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f03.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f03.png" alt="Power-domain Vsel values" width="252" height="340" style="width:100%;max-width:252px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 16: Power-domain Vsel values</strong></figcaption>
</figure>

### 1.9 Check IOmux

Print selected IOs by module to determine which IO set is active when a module offers several modes.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f04.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p07-f04.png" alt="Check the IOmux configuration" width="635" height="136" style="width:100%;max-width:635px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 17: Check the IOmux configuration</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f01.png" alt="IOmux mode check results by module" width="1026" height="503" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 18: IOmux mode check results by module</strong></figcaption>
</figure>

### 1.10 Export GPIO configuration

After opening a project, export GPIO configuration to an Excel table. Record the selected SoC and distinguish static definitions from device-read values.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p08-f02.png" alt="Exported GPIO configuration table" width="1026" height="571" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 19: Exported GPIO configuration table</strong></figcaption>
</figure>

### 1.11 Offline GPIO command lookup

With the project open, look up IOMUX, pull, drive-strength and Schmitt-trigger commands without connecting a device. Enter `help` for syntax; the manual demonstrates `gpio0a0`. Generated commands do not establish suitability for the carrier wiring.

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f01.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f01.png" alt="Offline GPIO command help" width="1026" height="243" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 20: Offline GPIO command help</strong></figcaption>
</figure>

<figure style="margin:1.6rem 0">
<a href="/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f02.png" target="_blank" rel="noopener" aria-label="View full-size image"><img src="/assets/rockchip-tools/manuals/1cae2e2c0777/p09-f02.png" alt="Look up register commands for a GPIO" width="1026" height="211" style="width:100%;max-width:1026px;height:auto;margin:0 auto"></a>
<figcaption style="margin-top:.6rem;font-size:.9em;line-height:1.55"><strong>Figure 21: Look up register commands for a GPIO</strong></figcaption>
</figure>

### Offline lookup syntax transcribed from the screenshot

Enter these in the tool search box, not a shell. Regular expressions are supported. Export and lookup screenshots are example projects and show different register addresses; do not combine them into a single board configuration.

```text
gpio [mux|pull|ds|smt|ddr|dr]
gpio0a0
gpio0a0 mux
gpio0a0 pull
gpio0a0 ds
gpio0a0 smt
gpio0a0 ddr
gpio0a0 dr
gpio0a0 ddr|dr
```

## Applicability and verification

This is a documentation-based workflow for the supplied tool collection. Confirm the exact board, SoC, carrier, SDK/BSP and host architecture before using it. No flashing, provisioning, register writes or hardware tests were performed. Package availability does not establish support for every ArmSoM product.

## GitHub tool directory, versions and SHA-256

Open the matching GitHub directory, select the required host/version, then verify the file hash and extract the full directory. Links below open repository directories.

[Open the tool directory on GitHub](https://github.com/ArmSoM/rockchip-tools/tree/main/downloads/pin-debug)

| Platform / version | File | SHA-256 |
|---|---|---|
| Linux / 1.11 | `pin_debug_tool_v1.11_for_linux.tar.gz` | `16cb25b8fc2533e8f730a790c7486ab5042baa964b3bdb95a161ddce143c4a34` |
| Windows / 1.18 | `pin_debug_tool_v1.18_20250322_win.zip` | `88c550ee9a578eaa451a9b8a05b3d088247dc63dd9bd426b832191994dc6a7d5` |

[GitHub · catalog.json](https://github.com/ArmSoM/rockchip-tools/blob/main/catalog.json) · [SHA256SUMS](https://github.com/ArmSoM/rockchip-tools/blob/main/SHA256SUMS)

## Source documents and figures

- PinDebug_UserManual.pdf

## Continue with the related workflow

- [Rockchip Linux Pinctrl: Complete GPIO, IOMUX, Drive Strength and DTS Guide](/articles/116-rockchip-linux-pinctrl/)
- [USB SQ Tool 1.5: from USB eye-diagram diagnosis to PHY settings](/articles/rockchip-tool-usb-sq-tool/)
- [Rockchip tool download and workflow index](/articles/rockchip-tools-download-guide/)

## Find the correct ArmSoM board documentation

For board and carrier requirements, use the product manual first. The links below are platform references, not a statement that this archived tool has been validated on these products.

[ArmSoM Docs](https://docs.armsom.org/) · [Sige7](https://www.armsom.org/sige7) / [Docs](https://docs.armsom.org/armsom-sige7) · [CM5](https://www.armsom.org/cm5) / [Docs](https://docs.armsom.org/armsom-cm5)

{% endraw %}
