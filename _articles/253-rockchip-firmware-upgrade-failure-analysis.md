---
title: "Rockchip Firmware Upgrade Failure Analysis: Boot Code, IDB, NAND and EMMC"
description: "Rockchip Firmware Upgrade Failure Analysis: Boot Code, IDB, NAND and EMMC — V1.2"
excerpt: "Rockchip Firmware Upgrade Failure Analysis: Boot Code, IDB, NAND and EMMC"
translation_key: "253-rockchip-firmware-upgrade-failure-analysis"
slug: "253-rockchip-firmware-upgrade-failure-analysis"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "firmware", "NAND", "EMMC"]
---

{% raw %}

# Rockchip Firmware Upgrade Failure Analysis: Boot Code, IDB, NAND and EMMC

ArmSoM platform reference: complete technical content of the manufacturer RK Firmware Upgrade Failure Analysis 1.2. The sole source is a 25-page Chinese PDF; English, Russian and German are full translations and all four use 45 original figures. Tool logs, binary comparisons, PCB and waveform evidence remain in original screenshots; unclear characters are not guessed. Readable batch code and the final power table are additionally transcribed. Examples cover several older SoCs/tools, not tested ArmSoM boards. Verify actual hardware, BSP, memory datasheet and boot chain.

## Scope and source checks

- These are vendor troubleshooting heuristics, not proof that a single message identifies a failed component. Preserve logs, verify firmware/power, then inspect evidence. Rework and chip replacement require qualified facilities.
- Repair, IDB erasure, reflashing and misc writes can destroy data or boot state. Back up and verify exact targets/partition sizes. Secure-boot devices need matching signed firmware, not bypassing verification.
- Pin38-to-VCC,10K pull-ups and EXT CSD179/167/162 apply only to matching parts/platforms. Source spellings RTS_n, DATO and RK3329 are explicitly flagged; never infer wiring or SoC identity from a likely typo.
- FLASH ID tables cover historical common values, not all modern parts. The trailing separator after D3 does not identify a second value; none is invented. Interpret00/FF only in the source diagnostic context, not as a substitute for electrical testing.
- Page25 is an image-only power table, retained and transcribed row by row: Ta=25°C at3.3V, VCC2.7V–3.6V and60mV peak-to-peak ripple. The body100-300mA/100-700uA ranges are not identical guarantees to this single-model example.
- The third batch-code screenshot on page17 is already clipped on the right in the PDF. Its full command can be recovered from the preceding screenshot and explicit-RK29→-RK30 change; both originals remain. Dates/times within logs remain technical context; cover dates, contact and revision table are removed. No flashing, erasing, register changes or hardware operations were performed.

## 1. Overview

Factories and engineers frequently encounter firmware-upgrade failures. This guide collects common problems and diagnostic suggestions. Tools continue to evolve, so exact messages may differ, while messages for the same failure type should be similar.

## 2. Common failures and analysis

### 2.1. Boot Code download failure

Message in the production tool:

![Original screenshot or diagram, PDF page 2, figure 1](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-01.png)

Message in the development tool:

![Original screenshot or diagram, PDF page 2, figure 2](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-02.png)

Log file in the production tool's log directory:

![Original screenshot or diagram, PDF page 3, figure 3](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-01.png)

Log file in the development tool's log directory:

![Original screenshot or diagram, PDF page 3, figure 4](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-02.png)

Possible causes:

1. Poor USB signal quality.

2. Poor SoC solder joints or power problems.

3. DDR-related problems.

4. Insufficient power supply.

5. Unsigned firmware used on a secure-boot-enabled device.

Diagnostic steps:

1. Use the DDR test tool to check for solder-joint problems.

2. Use a short, good-quality USB 2.0 cable connected to a rear PC USB port for upgrading.

3. Check whether USB-line ESD components are present and correctly specified.

4. Check USB supply voltage and ripple.

5. Check whether USB traces run parallel to other traces on adjacent layers.

6. Check resistor and capacitor values around the SoC and USB circuitry.

7. Use the board's supported external supply or battery.

8. Secure-boot devices require the corresponding correctly signed firmware.

### 2.2. Device test fails after successful Boot Code download

Production-tool message:

![Original screenshot or diagram, PDF page 4, figure 5](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-01.png)

Development-tool message:

![Original screenshot or diagram, PDF page 4, figure 6](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-02.png)

Production-tool log:

![Original screenshot or diagram, PDF page 5, figure 7](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-01.png)

Development-tool log:

![Original screenshot or diagram, PDF page 5, figure 8](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-02.png)

Possible causes:

1. DDR components or DDR PCB routing; the source considers these relatively likely.

2. Poor USB signal quality.

3. Wrong usbplug used when packaging miniloader under U-Boot.

Diagnostic steps:

1. Test DDR soldering with the DDR test tool.

2. Review DDR PCB routing for layout-rule violations.

3. Replace the DDR component if warranted by diagnosis.

4. For USB checks, follow section 2.1.

5. Connect the serial console and determine whether the CPU reaches DDR initialization or usbplug.

### 2.3. IDB preparation: NAND FLASH or EMMC soldering problems

Production tool reports IDB preparation failure:

![Original screenshot or diagram, PDF page 6, figure 9](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-01.png)

Production-tool log:

![Original screenshot or diagram, PDF page 6, figure 10](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-02.png)

Development tool reports failure to write ID_BLOCK:

![Original screenshot or diagram, PDF page 7, figure 11](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p007-figure-01.png)

The development-tool log says NAND FLASH was not found and ID_BLOCK writing failed.

Possible causes:

1. Poor NAND FLASH/EMMC solder joints.

2. Unsupported NAND FLASH.

3. PCB defects.

4. Incorrect FLASH VCCQ supply.

5. Incorrect FLASH SEL selection at the AP.

6. Missing CMD and D0 pull-ups for EMMC.

Diagnostic steps:

1. Rework NAND FLASH/EMMC soldering and inspect the PCB, using qualified board-repair procedures.

2. Compare schematic and NAND datasheet, especially pin 38. The source says most Toshiba, Sandisk and Samsung parts require VCC there, with no such requirement for other parts. This is a historical generalization: the exact part's datasheet and package are authoritative.

3. For unsupported NAND, obtain an appropriate driver update through the vendor's support channel and inspect its NAND support list to confirm the actual part.

4. Use serial logs to help diagnose soldering. A normal NAND device prints FLASH IDs as below. An EMMC device normally does not print FLASH IDs in this source's boot path.

![Original screenshot or diagram, PDF page 8, figure 12](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p008-figure-01.png)

The first FLASH ID byte identifies the manufacturer:

| ID | Manufacturer |
| --- | --- |
| 2C | Micron |
| AD | Hynix |
| 45 | Sandisk |
| 89 | Intel |
| EC | Samsung |
| 98 | Toshiba |
| 00 | No NAND FLASH connected |
| FF | No NAND FLASH connected |
| Other values | Poor soldering or unsupported NAND FLASH. |

The second byte indicates capacity; common source values follow:

| ID | Capacity |
| --- | --- |
| 75 | 32MB |
| 76 | 64MB |
| 78、79、F1、D1 | 128MB |
| DA、71 | 256MB |
| DC | 512MB |
| D3、 | 1GB |
| D5、48 | 2GB |
| D7、68 | 4GB |
| D9、88、DE、3A、64 | 8GB |
| 3C、A8、84 | 16GB |
| Other values | Poor soldering or unsupported NAND FLASH. |

Diagnostic examples:

1. The log below is attributed by the source to poor NAND FLASH or EMMC soldering.

![Original screenshot or diagram, PDF page 9, figure 13](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p009-figure-01.png)

2. Only two NAND chips are fitted, but the system detects four. The source attributes this to faulty NAND chip-select (CS) soldering.

![Original screenshot or diagram, PDF page 10, figure 14](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-01.png)

3. Two NAND chips are fitted and detected, but their IDs are wrong. First byte 2c identifies Micron. The second byte is 8C instead of the expected 88 for this example; the source concludes a soldering fault. Do not treat every unlisted ID as faulty without checking the exact part.

![Original screenshot or diagram, PDF page 10, figure 15](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-02.png)

### 2.4. IDB writing failure

Production tool reports ID_BLOCK writing failure:

![Original screenshot or diagram, PDF page 11, figure 16](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-01.png)

Development-tool ID_BLOCK writing failure:

![Original screenshot or diagram, PDF page 11, figure 17](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-02.png)

The development-tool log reports a comparison mismatch:

![Original screenshot or diagram, PDF page 12, figure 18](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-01.png)

Production-tool log:

![Original screenshot or diagram, PDF page 12, figure 19](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-02.png)

Several binary files also appear in the LOG directory:

![Original screenshot or diagram, PDF page 12, figure 20](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-03.png)

Use a binary comparison tool on files with the same prefix and the suffixes “flash” and “file”, for example:

![Original screenshot or diagram, PDF page 13, figure 21](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-01.png)

In the example below, one or a few differing bits suggest DDR trouble. Follow section 2.2; this is a diagnostic clue, not proof by itself.

![Original screenshot or diagram, PDF page 13, figure 22](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-02.png)

Many differing bits usually indicate NAND trouble in the source's examples. It suggests retrying the upgrade. Excessive NAND supply ripple or missing filter capacitors can cause the same symptom. If the power is normal and repeated upgrades do not resolve it, replace NAND after confirming the diagnosis.

![Original screenshot or diagram, PDF page 13, figure 23](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-03.png)

### 2.5. Firmware download failure

Production tool reports firmware download failure:

![Original screenshot or diagram, PDF page 14, figure 24](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-01.png)

Production-tool log: `WriteLBA failed`, error code `(-3)`.

![Original screenshot or diagram, PDF page 14, figure 25](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-02.png)

Production-tool log: `ReadLBA failed`, error code `(-4)`.

![Original screenshot or diagram, PDF page 14, figure 26](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-03.png)

The source attributes both cases to interrupted USB communication. Use section 2.1's checks.

Production-tool log: `RKA_File_Check failed`.

![Original screenshot or diagram, PDF page 15, figure 27](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-01.png)

The log directory also contains two files: intended firmware data and incorrect data read back from flash.

![Original screenshot or diagram, PDF page 15, figure 28](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-02.png)

Compare the two files. One or a few differing bits suggest DDR trouble; follow section 2.2.

![Original screenshot or diagram, PDF page 16, figure 29](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-01.png)

![Original screenshot or diagram, PDF page 16, figure 30](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-02.png)

For many differing bits, the source suspects NAND and proposes the production tool's “Repair” mode or “Erase IDB” in the development tool before reflashing. These operations can destroy data and boot metadata: back up and verify the target first. The original button images are retained below.

![Original screenshot or diagram, PDF page 16, figure 31](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-03.png)

Reflash only after the selected repair/erase step and the necessary checks.

Excessive NAND supply ripple or missing filter capacitors can cause this too. If supply checks and reflashing do not solve it, replace NAND after diagnosis.

![Original screenshot or diagram, PDF page 16, figure 32](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-04.png)

Development-tool messages/logs are similar to the production tool, so apply the same analysis.

### 2.6. Chip verification failure

Production-tool chip verification usually fails when the selected firmware does not match the SoC. During development, the chip parameter used to package firmware may be wrong. The source says the development tool does not check chip information; wrong firmware may fail to boot or return to upgrade mode. Reflash the correct firmware.

![Original screenshot or diagram, PDF page 17, figure 33](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-01.png)

The example firmware is for RK30 but was incorrectly packaged as RK29. Open `mkupdate.bat` and correct the chip argument.

![Original screenshot or diagram, PDF page 17, figure 34](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-02.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK29 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

Change the `RKImageMaker.exe` chip argument to `-RK30` for this RK30 example.

![Original screenshot or diagram, PDF page 17, figure 35](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-03.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK30 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

For further configuration details, consult the documents in the firmware-generation tool directory.

## 3. Other problems

### 3.1. Still in upgrade mode after automatic reboot

Case 1: after flashing with the development tool, the device does not boot and appears in upgrade mode over USB. Serial output is shown below.

![Original screenshot or diagram, PDF page 18, figure 36](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p018-figure-01.png)

Readable key serial states (excerpt; the full log remains in the original image):

```text
unsigned!
SecureBootEn = 0
Boot ver: 2012-11-13#1.20
Error: Invaid tag(0x00000000)!
Load failed!
Begin recover...
GetRemapTbl flag = 1
Error: Invaid tag(0x00000000) in backup!
Start RockUsb...
2900305 UsbConnected
```

The source attributes this case to flashing misc.img without flashing recovery.img.

![Original screenshot or diagram, PDF page 19, figure 37](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p019-figure-01.png)

Remedy: reflash recovery.img. The source also describes writing another file larger than 32KB to misc to clear its commands; this is destructive and must not be applied blindly to modern layouts.

Case 2: the source lists RK3329 and RK3368 as examples that may fail to boot if trust.img was not flashed. Flash the matching trust.img. RK3329 is retained as written and requires platform verification.

### 3.2. EMMC devices do not boot at power-on

The source associates this mostly with RK3188, PX3, PX2, RK3066 and RK3168, after updating loader or assembling preprogrammed memory. Checks follow.

1. Inspect schematic/layout. CMD and DATA0-DATA7 require pull-ups; the source recommends 10K. Check their soldering. EMMC traces must not be routed through connections to NC pins.

2. Measure power-up timing with an oscilloscope. CMD should rise with EMMC VCCQ, as shown. Some EMMC devices cannot boot if CMD rises later than VCCQ.

![Original screenshot or diagram, PDF page 20, figure 38](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-01.png)

3. Check CMD and CLK for glitches. Some EMMC devices fail to boot if glitches occur. The source observed this with RK3066 plus a TI PMU and proposes changing the power-up sequence.

![Original screenshot or diagram, PDF page 20, figure 39](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-02.png)

4. Check overshoot on CMD, CLK and DATA; series termination may help. Strong CLK ringing in the example may cause logic errors.

![Original screenshot or diagram, PDF page 21, figure 40](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p021-figure-01.png)

5. Check VCC ripple; consider appropriate filtering capacitors.

6. For preprogrammed memory, verify EXT CSD configuration.

Source EXT CSD settings: byte 179 = 0x08 (boot from boot1 without ACK); byte 167 = 0x1F; byte 162 = 0x01 (enable reset pin). Leave all other settings at defaults. These are platform-specific source values, not universal programming instructions; some settings may be irreversible.

For RK312X, RK3228, RK3366, RK3288 and RK3399, the source says remaining in MASKROM after flashing usually indicates one or more incorrectly connected EMMC D0-D7 lines.

### 3.3. EMMC device fails to boot after reset

Check that the SoC's EMMC_PWEN connects to the EMMC pin called RTS_n in the source. Verify the actual schematic and datasheet signal name; do not infer a connection from this potentially misspelled label.

For preprogrammed firmware on RK3188, PX3, PX2, RK3066 or RK3168, the source requires EXTCSD byte 162 = 0x01.

### 3.4. Long delay before LOADER on EMMC

The source attributes the delay to BOOTROM entering NAND detection, which takes several seconds. Checks follow.

1. Inspect schematic/layout, CMD and DATA0-DATA7 pull-ups (recommended 10K), and solder joints. Do not route EMMC signals through NC pins. The example PCB connects DATA6 through an NC pin and consequently boots slowly.

![Original screenshot or diagram, PDF page 22, figure 41](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p022-figure-01.png)

2. Measure DATA0-DATA7 on power-up (the source spells the first signal DATO). DATA rise time must be less than 2us in this example. Figure 2 expands the red-ellipse region of Figure 1 to measure that rise time.

Figure 1:

![Original screenshot or diagram, PDF page 23, figure 42](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-01.png)

Figure 2: expanded rise-time waveform.

![Original screenshot or diagram, PDF page 23, figure 43](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-02.png)

### 3.5. EMMC read/write errors while Android runs

Possible causes:

1. Insufficient VCC/VCCQ supply causing voltage collapse during operation.

2. Poor routing and severe interference.

Remedies:

1. Check whether external activity such as Wi-Fi disturbs EMMC power; the source recommends a separate supply.
2. Measure bus timing with an oscilloscope. The example shows insufficient hold time at the falling CLK edge in DDR mode, which may cause logic errors.

![Original screenshot or diagram, PDF page 24, figure 44](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p024-figure-01.png)

### 3.6. EMMC power consumption

The source quotes 100-300mA while reading/writing and 100-700uA in standby. Consumption depends on speed mode, EMMC frequency/capacity, interface voltage, temperature, manufacturer process and pull-up resistance. The following is a typical example for one unspecified EMMC model, not a universal limit.

![Original screenshot or diagram, PDF page 25, figure 45](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p025-figure-01.png)

Ta=25°C @3.3V

| Mode | Maximum/typical value | Unit |
| --- | --- | --- |
| Auto Sleep | 350 | uA |
| Sleep (CMD5) | 200 maximum;130 typical | uA |
| Read: default speed | 100 | mA |
| Read: high speed | 200 | mA |
| Write: default speed | 100 | mA |
| Write: high speed | 200 | mA |

VCC:2.7V–3.6V; maximum ripple60mV peak-to-peak.

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}
